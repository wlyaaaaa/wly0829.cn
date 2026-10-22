"""稳定画面扫描，包含横排卡片内容失衡；只读预览规则和用法见 docs/publish-and-scan.md。"""
import argparse, functools, hashlib, http.server, importlib.util, json, os, re, subprocess, sys, tempfile, threading, time
import urllib3
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urljoin, urlsplit
HERE = Path(__file__).resolve().parent
UPSTREAMS = {"mcp": "https://mcp.wly0829.cn", "live": "https://live.wly0829.cn", "oss": "https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com"}
VIEWPORTS = ((1920, 1080), (3840, 2160))
RETRY_NETWORK_ERRORS = ("ERR_NO_BUFFER_SPACE", "ERR_ABORTED", "ERR_CONNECTION_RESET")
def read_json(path): return json.loads(Path(path).read_text(encoding="utf-8-sig"))
def file_inventory(root):
    hashes = {}
    for file in sorted(f for f in root.rglob("*") if f.is_file()):
        with file.open("rb") as stream: hashes[file.relative_to(root).as_posix()] = hashlib.file_digest(stream, "sha256").hexdigest()
    return hashes
def route_name(path):
    value = "/" + str(path).replace("\\", "/").lstrip("/")
    return value[:-10] if value.endswith("index.html") else value
def published_manifest():
    spec = importlib.util.spec_from_file_location("glance_retention", HERE.parents[1] / "scripts/oss-retention.py")
    retention = importlib.util.module_from_spec(spec); spec.loader.exec_module(retention)
    path = retention.shared() / "published.json"
    return read_json(path)["manifest"] if path.is_file() else None

def select_pages(dist, mode, hashes, previous, locked=False):
    if mode == "published-diff":
        published = published_manifest()
        if published is None:
            print("扫描范围：无已发布记录，回退 changed", flush=True); mode = "changed"
        else:
            previous = {route_name(rel): row["sha256"] for rel, row in published["files"].items() if rel.endswith(".html")}
            mode = "changed"
    if mode == "all": selected = list(hashes)
    elif mode == "changed": selected = [r for r, h in hashes.items() if previous.get(r) != h]
    else: selected = [route_name(x.strip()) for x in mode.split(",") if x.strip()]
    missing = set(selected) - hashes.keys()
    if missing: raise ValueError(f"成品缺少页面：{sorted(missing)}")
    # 这两个入口只跳转首页；首页锁定也覆盖它的直达别名。
    return sorted(set(selected) - ({"/", "/cv/", "/system/"} if locked else set()))

def successful_routes(selected, rows, unchanged=True):
    expected = {f"{w}x{h}" for w, h in VIEWPORTS}
    return {r for r in selected if unchanged
            and {row["viewport"] for row in rows if row["page"] == r} == expected
            and all(not row["failures"] for row in rows if row["page"] == r)}

def scan_baseline(result):
    inputs = result.get("input_html_sha256", result.get("html_sha256", {}))
    previous = {r: h for r, h in inputs.items() if result.get("html_sha256", {}).get(r) == h}
    selected = set(result.get("selected_routes", []))
    complete = successful_routes(selected, result.get("pages", []), result.get("dist_files_unchanged", True))
    failed = {item.get("page") for item in result.get("failures", [])}
    return {r: h for r, h in previous.items() if (r not in selected or r in complete) and r not in failed}

def retryable_transport(row):
    failures = row["failures"]
    return bool(failures) and all(item.get("category") == "transport" for item in failures) and any(
        item.get("response_kind") == "proxy_transport" or any(code in item.get("message", "") for code in RETRY_NETWORK_ERRORS) for item in failures)

def original_url(url):
    parts = urlsplit(url)
    for key, host in UPSTREAMS.items():
        prefix = "/__proxy/" + key + "/"
        if parts.path.startswith(prefix): return host + parts.path[len(prefix) - 1:] + ("?" + parts.query if parts.query else "")
    return url

def classify_images(items, proxy_results):
    for item in items:
        if item.get("category") != "image": continue
        urls = item.get("imageSources") or [item.get("currentSrc") or item.get("src") or ""]
        evidence = [proxy_results.get(original_url(url), {}) for url in urls]
        if all(url and result.get("kind") == "transport" for url, result in zip(urls, evidence)):
            item.update(category="transport", response_kind="proxy_transport", proxy=evidence)
    return items

def make_server(dist, out, port=0, manifest=None):
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Preview, directory=str(dist)))
    server.daemon_threads = True
    cache = Path(out).resolve() / "oss-cache"
    if any(cache.is_relative_to(root.resolve()) for root in (Path(dist), HERE.parents[1])):
        cache = Path(tempfile.gettempdir()) / "wly-scan-glance" / hashlib.sha256(str(Path(dist).resolve()).encode()).hexdigest()
    server.oss_cache = cache; server.oss_cache.mkdir(parents=True, exist_ok=True)
    server.oss_locks = {}; server.proxy_results = {}; server.proxy_stats = Counter(); server.proxy_disconnects = []
    server.upstream_pool = urllib3.PoolManager(maxsize=4, block=True)
    objects = (manifest or {}).get("oss", {}).get("objects", {})
    server.local_objects = {row["url"]: Path(dist) / rel for rel, row in objects.items() if (Path(dist) / rel).is_file()}
    server.object_hashes = {row["url"]: row["sha256"] for row in objects.values() if row.get("sha256")}
    server.base = f"http://127.0.0.1:{server.server_port}"
    return server

class Preview(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def log_message(self, *args): pass
    def handle(self):
        try: super().handle()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError) as error:
            self.server.proxy_stats["client_disconnects"] += 1
            self.server.proxy_disconnects.append({"url": getattr(self, "path", ""), "error": type(error).__name__,
                "stage": "idle_read" if getattr(self, "reply_complete", False) else "response_write", "winerror": getattr(error, "winerror", None)})
            self.close_connection = True
    def upstream(self, url, headers, head):
        canonical = url.split("?", 1)[0]
        objects = self.server.local_objects; local = objects.get(url) or objects.get(canonical)
        expected = self.server.object_hashes.get(url) or self.server.object_hashes.get(canonical)
        if local and local.is_file():
            self.server.proxy_stats["local_objects"] += 1
            raw = local.read_bytes()
            if expected and hashlib.sha256(raw).hexdigest() != expected:
                return 502, {"X-Glance-Object-Error": "sha256_mismatch"}, b""
            return 200, {"Content-Type": self.guess_type(str(local)), "X-Glance-Local-Object": "1"}, raw
        cacheable = not head and canonical.startswith(UPSTREAMS["oss"] + "/releases/")
        key = hashlib.sha256((canonical + "\n" + (expected or "") + "\n" + headers.get("Range", "")).encode()).hexdigest() if cacheable else None
        lock = self.server.oss_locks.setdefault(key, threading.Lock()) if key else threading.Lock()
        with lock:
            file = self.server.oss_cache / key if key else None
            meta = file.with_suffix(".json") if file else None
            if meta and meta.is_file():
                try:
                    saved = read_json(meta); raw = file.read_bytes(); digest = hashlib.sha256(raw).hexdigest()
                    if digest == saved["sha256"] and (not expected or headers.get("Range") or digest == expected):
                        self.server.proxy_stats["cache_hits"] += 1
                        return saved["status"], saved["headers"], raw
                except (OSError, ValueError, KeyError): pass
            started = time.monotonic()
            try:
                response = self.server.upstream_pool.request("HEAD" if head else "GET", url, headers=headers,
                    timeout=urllib3.Timeout(connect=3, read=5, total=8), pool_timeout=8, preload_content=True,
                    retries=urllib3.Retry(total=2, connect=2, read=2, status=0, redirect=0, other=2), redirect=False)
                raw = response.data
            except urllib3.exceptions.HTTPError as error:
                self.server.proxy_stats["upstream_transport"] += 1
                return 502, {"Content-Type": "text/plain", "X-Glance-Proxy-Error": type(error).__name__}, b""
            self.server.proxy_stats["upstream_requests"] += 1
            self.server.proxy_stats["upstream_retries"] += len(response.retries.history)
            info = {k: response.headers[k] for k in ("Content-Type", "Content-Length", "Content-Range", "Accept-Ranges") if k in response.headers}
            info["X-Glance-Upstream-Status"] = str(response.status)
            info["X-Glance-Upstream-Seconds"] = str(round(time.monotonic() - started, 3))
            digest = hashlib.sha256(raw).hexdigest()
            if not head and response.status == 200 and expected and digest != expected:
                return 502, {"X-Glance-Object-Error": "sha256_mismatch"}, b""
            if file and response.status in (200, 206):
                staged = file.with_suffix(f".{time.time_ns()}.tmp"); staged.write_bytes(raw); staged.replace(file)
                staged = meta.with_suffix(f".{time.time_ns()}.tmp")
                staged.write_text(json.dumps({"status": response.status, "headers": info, "sha256": digest}), encoding="utf-8"); staged.replace(meta)
            return response.status, info, raw
    def rewrite(self, body, ctype):
        if any(t in ctype for t in ("text/", "javascript", "json", "svg")):
            text = body.decode("utf-8", "surrogateescape")
            for key, upstream in UPSTREAMS.items(): text = text.replace(upstream, self.server.base + "/__proxy/" + key)
            for host in ("https://www.wly0829.cn", "https://wly0829.cn"): text = text.replace(host, self.server.base)
            body = text.encode("utf-8", "surrogateescape")
        return body
    def headers_out(self, status, ctype, length, extra=None):
        self.send_response(status)
        headers = {"Content-Type": ctype, "Content-Length": str(length), "Cache-Control": "no-store",
                   "Access-Control-Allow-Origin": self.headers.get("Origin", "*"), "Access-Control-Allow-Credentials": "true"}
        for key, value in (headers | (extra or {})).items(): self.send_header(key, value)
        self.end_headers()
    def do_OPTIONS(self):
        self.headers_out(204, "text/plain", 0, {"Access-Control-Allow-Methods": "GET, HEAD",
            "Access-Control-Allow-Headers": self.headers.get("Access-Control-Request-Headers", "Content-Type")})
    def refuse(self): self.send_error(405, "Read-only preview: GET/HEAD only")
    do_POST = do_PUT = do_PATCH = do_DELETE = refuse
    def do_GET(self):
        self.reply_complete = False
        head = self.command == "HEAD"; upstream = None
        if self.path.startswith("/__status"): upstream = UPSTREAMS["mcp"] + "/computer-access/api/status" + self.path[len("/__status"):]
        for key, host in UPSTREAMS.items():
            prefix = "/__proxy/" + key
            if self.path.startswith(prefix + "/"): upstream = host + self.path[len(prefix):]
        if upstream:
            headers = {"Origin": "https://wly0829.cn", "Referer": "https://wly0829.cn/", "User-Agent": "wly-local-preview", "Accept": self.headers.get("Accept", "*/*")}
            if self.headers.get("Range"): headers["Range"] = self.headers["Range"]
            status, info, raw = self.upstream(upstream, headers, head)
            self.server.proxy_results[upstream] = {"status": status, "kind": "transport" if info.get("X-Glance-Proxy-Error") else "object_error" if info.get("X-Glance-Object-Error") else "http", "error": info.get("X-Glance-Proxy-Error") or info.get("X-Glance-Object-Error")}
            ctype = info.get("Content-Type", "application/octet-stream"); body = self.rewrite(raw, ctype)
            length = int(info.get("Content-Length", 0)) if head and not info.get("X-Glance-Local-Object") else len(body)
            extra = {key: value for key, value in info.items() if key not in ("Content-Type", "Content-Length")}
            self.headers_out(status, ctype, length, extra)
        else:
            target = Path(self.translate_path(self.path))
            if target.is_dir(): target /= "index.html"
            if not target.is_file(): return super().do_HEAD() if head else super().do_GET()
            ctype = self.guess_type(str(target)); body = self.rewrite(target.read_bytes(), ctype)
            self.headers_out(200, ctype, len(body))
        if not head: self.wfile.write(body)
        self.reply_complete = True
    do_HEAD = do_GET
def is_live(url):
    parts = urlsplit(url)
    return parts.hostname in ("mcp.wly0829.cn", "live.wly0829.cn") or parts.path.startswith(("/__status", "/__proxy/mcp/", "/__proxy/live/"))
def finding(category, message, selector="html", rect=None):
    return {"category": category, "message": message, "selector": selector, "rect": rect}
def settle(page, activity, pending, all_images=False):
    page.evaluate("""async (allImages) => {
      const images = [...document.images].filter(i => {
        const r = i.getBoundingClientRect();
        return i.getAttribute('src') && i.getClientRects().length > 0 && r.width > 0 && r.height > 0
          && (allImages || r.bottom > 0 && r.top < innerHeight) && r.right > 0 && r.left < innerWidth;
      });
      if (allImages) for (const i of images) i.loading = 'eager';
      const ready = Promise.all([document.fonts.ready, ...images.map(i => i.complete ? null : new Promise(r => {i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true});}))]);
      await Promise.race([ready,new Promise((_, reject)=>setTimeout(()=>reject(new Error('字体或图片未完成')),20000))]);
    }""", all_images)
    deadline = time.monotonic() + 30
    while pending or time.monotonic() - activity[0] < 1:
        if time.monotonic() > deadline: raise TimeoutError("网络未静默 1 秒")
        page.wait_for_timeout(100)
def wait_meta_refresh(page, base, locked=True, evidence=None):
    if evidence is None: evidence = []
    for _ in range(4):
        contents = page.eval_on_selector_all('meta[http-equiv]', "ms => ms.filter(m => m.httpEquiv.toLowerCase() === 'refresh').map(m => m.content)")
        if not contents: return evidence
        content = contents[0]
        match = re.fullmatch(r'\s*(\d+(?:\.\d+)?)\s*;\s*url\s*=\s*(.*?)\s*', content, re.I)
        if not match: raise RuntimeError('无法识别 meta refresh 声明：' + content)
        target = urljoin(page.url, match[2].strip('"\''))
        destination, origin = urlsplit(target), urlsplit(base)
        if (destination.scheme, destination.netloc) != (origin.scheme, origin.netloc) or destination.path.startswith('/__proxy/'):
            page.route(target, lambda request: request.abort())
            raise RuntimeError('不跟随非本机页面的 meta refresh：' + target)
        if locked and destination.path in ('/', '/index.html'):
            page.route(target, lambda request: request.abort())
            raise RuntimeError('meta refresh 指向已排除的首页')
        before = page.url
        evidence.append({'from': before, 'declared_target': target, 'declared_seconds': float(match[1])})
        page.wait_for_url(target, wait_until='load', timeout=30000)
        evidence[-1]['to'] = page.url
    raise RuntimeError('meta refresh 跳转超过 4 层')


def classify_alias_leaves(row):
    sources = {urlsplit(nav['from']).path for nav in row.get('navigation', []) if nav.get('to') and nav['to'] != nav['from']}
    for item in list(row['failures']):
        parts = urlsplit(original_url(item.get('request_url', ''))); query = parse_qs(parts.query)
        if (item.get('request_failure') == 'net::ERR_ABORTED' and item.get('request_method') == 'GET'
                and parts.path == '/_v.gif' and query.get('x-event') == ['leave'] and query.get('x-p', [None])[0] in sources):
            row.setdefault('navigation_diagnostics', []).append(item)
            row['failures'].remove(item)


def scan_worker(worker, jobs, args, base, scratch, config, link_items, proxy_results=None):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    results = []; script = (HERE / "scan_glance_dom.js").read_text(encoding="utf-8")
    with sync_playwright() as pw:
        browser = pw.chromium.launch_persistent_context(str(scratch / f"chrome-{worker}"), executable_path=args.chrome, headless=True, device_scale_factor=1, reduced_motion="reduce", service_workers="block")
        browser.set_default_timeout(30000)
        browser.route("**/*", lambda route: route.continue_() if route.request.method in ("GET", "HEAD", "OPTIONS") else route.abort())
        for route, width, height in jobs:
            attempts = []
            for attempt in range(2):
                page = browser.new_page(); page.set_viewport_size({"width": width, "height": height})
                row = {"page": route, "viewport": f"{width}x{height}", "failures": [], "hints": [], "live_unavailable": [], "seconds": {}}
                mark = [time.monotonic()]
                def tick(label):
                    now = time.monotonic(); row["seconds"][label] = round(now - mark[0], 3); mark[0] = now
                activity = [time.monotonic()]; pending = set(); resource_errors = {}
                def request(req): pending.add(req); activity[0] = time.monotonic()
                def finished(req): pending.discard(req); activity[0] = time.monotonic()
                def response(res):
                    error = res.headers.get("x-glance-proxy-error")
                    object_error = res.headers.get("x-glance-object-error")
                    resource_errors[original_url(res.url)] = {"kind": "transport" if error else "object_error" if object_error else "http", "status": res.status}
                    if res.status >= 400:
                        dest = row["live_unavailable"] if is_live(res.url) else row["failures"]
                        item = finding("读不到" if is_live(res.url) else "transport" if error else "image" if object_error else "404", f"{res.status} {res.url}")
                        item.update(exception_type=error or object_error, response_kind="proxy_transport" if error else "http")
                        dest.append(item)
                def failed(req):
                    finished(req)
                    dest = row["live_unavailable"] if is_live(req.url) else row["failures"]
                    dest.append(dict(finding("读不到" if is_live(req.url) else "transport", f"{req.failure} {req.url}"),
                        request_url=req.url, request_failure=req.failure, request_method=req.method))
                    url = original_url(req.url)
                    if resource_errors.get(url, {}).get("status", 0) < 400:
                        resource_errors[url] = {"kind": "transport" if any(code in (req.failure or "") for code in RETRY_NETWORK_ERRORS) else "request_error", "error": req.failure}
                page.on("request", request); page.on("requestfinished", finished); page.on("requestfailed", failed); page.on("response", response)
                stem = hashlib.sha256(route.encode()).hexdigest()[:12] + f"--{width}" + ("--retry" if attempt else "")
                try:
                    page.goto(base + quote(route, safe="/"), wait_until="load", timeout=30000)
                    row['navigation'] = []
                    wait_meta_refresh(page, base, config.get('home_locked', True), row['navigation'])
                    row['final_route'] = urlsplit(page.url).path
                    if config.get("home_locked", True) and urlsplit(page.url).path in ("/", "/index.html"): raise RuntimeError("路由跳到了已排除的首页")
                    page.evaluate("document.querySelectorAll('img[loading=lazy],img[data-ts-src]').forEach(i => {if(i.getClientRects().length && getComputedStyle(i).visibility !== 'hidden'){if(!i.getAttribute('src') && i.dataset.tsSrc)i.src=i.dataset.tsSrc;i.loading='eager';}})")
                    tick("load"); settle(page, activity, pending); tick("initial_settle")
                    y = 0; steps = 0
                    while y < page.evaluate("document.documentElement.scrollHeight") and steps < 1500:
                        page.evaluate("(y)=>window.scrollTo({top:y,left:0,behavior:'instant'})", y)
                        page.wait_for_timeout(50); y += max(500, int(height * .8)); steps += 1
                    if steps == 1500: raise RuntimeError("滚动未覆盖整页")
                    # 布局可能在步进中增长；真正到达当前页底，给页脚观察器渲染帧来激活懒图。
                    page.evaluate("async () => {window.scrollTo({top:document.documentElement.scrollHeight,left:0,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}")
                    settle(page, activity, pending, all_images=True)
                    page.evaluate("window.scrollTo({top:0,left:0,behavior:'instant'})"); settle(page, activity, pending, all_images=True)
                    page.evaluate(script + "\n;void 0;"); dom = page.evaluate("(config)=>window.scanGlance(config)", config)
                    row["failures"].extend(classify_images(dom["failures"], (proxy_results or {}) | resource_errors)); row["hints"].extend(dom["hints"])
                    for item in link_items:
                        if route_name(item["page"]) == route:
                            selector = "a[href=" + json.dumps(item["href"]) + "]"
                            rect = page.locator(selector).first.bounding_box() if page.locator(selector).count() else None
                            row["failures"].append(finding("404", item["problem"], selector, rect))
                except Exception as error:
                    category = "transport" if ("load" not in row["seconds"] and any(code in str(error) for code in RETRY_NETWORK_ERRORS)) or retryable_transport(row) and any(t in str(error) for t in ("图片未完成", "网络未静默")) else "scan_error"
                    row["failures"].append(finding(category, str(error)))
                row['final_route'] = urlsplit(page.url).path
                classify_alias_leaves(row)
                try:
                    if config.get("home_locked", True) and urlsplit(page.url).path in ("/", "/index.html"): raise RuntimeError("首页已排除，不自动截图")
                    shot = args.out / "screenshots" / (stem + ".png")
                    page.screenshot(path=str(shot), full_page=True, timeout=30000); row["screenshot"] = str(shot)
                    tick("scroll_settle_dom_fullshot")
                    with Image.open(shot) as full:
                        for n, item in enumerate(row["failures"]):
                            r = item.get("rect") or {"x": 0, "y": 0, "width": width, "height": height}
                            x = max(0, min(r["x"] - 24, full.width - 1)); y = max(0, min(r["y"] - 24, full.height - 1))
                            w = min(r["width"] + 48, width, full.width - x); h = min(r["height"] + 48, height, full.height - y)
                            path = args.out / "screenshots" / f"{stem}--fail-{n:04}.png"
                            full.crop((int(x), int(y), int(x + w), int(y + h))).save(path); item["screenshot"] = str(path)
                except Exception as error: row["failures"].append(finding("scan_error", f"截图失败：{error}"))
                page.close(); attempts.append(row)
                if attempt or not retryable_transport(row): break
            if len(attempts) > 1: row = dict(row, attempts=attempts)
            results.append(row)
            print(json.dumps({"page": route, "viewport": row["viewport"], "failures": len(row["failures"]), "hints": len(row["hints"])}, ensure_ascii=False), flush=True)
        browser.close()
    return results
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", required=True, type=Path); parser.add_argument("--pages", default="published-diff")
    parser.add_argument("--out", type=Path); parser.add_argument("--config", type=Path, default=HERE / "scan_glance.json")
    parser.add_argument("--chrome", default=r"C:\Program Files\Google\Chrome\Application\chrome.exe"); parser.add_argument("--port", type=int, default=0)
    args = parser.parse_args(); args.dist = args.dist.resolve(); args.out = (args.out or args.dist.parent / "scan-glance").resolve()
    if not args.dist.is_dir(): parser.error("dist 不存在")
    args.out.mkdir(parents=True, exist_ok=True); (args.out / "screenshots").mkdir(exist_ok=True)
    started = time.monotonic(); config = read_json(args.config); result_path = args.out / "scan-result.json"
    previous = scan_baseline(read_json(result_path)) if result_path.exists() else {}
    dist_files = file_inventory(args.dist)
    hashes = {route_name(rel): digest for rel, digest in dist_files.items() if rel.endswith(".html")}
    selected = select_pages(args.dist, args.pages, hashes, previous, config.get("home_locked", True))
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(HERE / "link_check.py"), str(args.out / "links.json"), "--dist", str(args.dist), "--skip", ""], check=True, capture_output=True, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
    links = read_json(args.out / "links.json")["items"]
    if config.get("home_locked", True): links = [item for item in links if route_name(item["page"]) != "/"]
    offline = [dict(finding("404", item["problem"], "a[href=" + json.dumps(item["href"]) + "]"), page=route_name(item["page"]), viewport="offline") for item in links if route_name(item["page"]) not in selected]
    rows = []
    with tempfile.TemporaryDirectory(prefix="runtime-", dir=args.out) as temp:
        scratch = Path(temp); os.environ.update(TEMP=str(scratch), TMP=str(scratch), TMPDIR=str(scratch))
        http.server.ThreadingHTTPServer.request_queue_size = 256
        manifest = read_json(args.dist / "release-manifest.json") if "release-manifest.json" in dist_files else {}
        server = make_server(args.dist, args.out, args.port, manifest)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            jobs = [(route, w, h) for route in selected for w, h in VIEWPORTS]
            with ThreadPoolExecutor(max_workers=4) as pool:
                futures = [pool.submit(scan_worker, i, jobs[i::4], args, server.base, scratch, config, links, server.proxy_results) for i in range(4) if jobs[i::4]]
                for i, future in enumerate(futures):
                    try: rows.extend(future.result())
                    except Exception as error:
                        rows.extend({"page": r, "viewport": f"{w}x{h}", "hints": [], "live_unavailable": [],
                                     "failures": [finding("scan_error", str(error))]} for r, w, h in jobs[i::4])
        finally: server.shutdown(); server.server_close(); server.upstream_pool.clear()
    for row in rows:
        for kind in ("failures", "hints", "live_unavailable"):
            for item in row[kind]: item.update(page=row["page"], viewport=row["viewport"])
    failures = offline + [item for row in rows for item in row["failures"]]
    unchanged = dist_files == file_inventory(args.dist)
    if not unchanged: failures.append(dict(finding("scan_error", "扫描期间 dist 文件增删或字节变化"), page="offline", viewport="offline"))
    complete = successful_routes(selected, rows, unchanged)
    result = {"observed_at_beijing": datetime.now(timezone(timedelta(hours=8))).isoformat(),
              "seconds": round(time.monotonic() - started, 3), "pages": rows, "selected_routes": selected,
              "failures": failures, "counts": dict(Counter(item["category"] for item in failures)),
              "hints": [item for row in rows for item in row["hints"]],
              "live_unavailable": [item for row in rows for item in row["live_unavailable"]],
              "html_sha256": {r: h for r, h in previous.items() if r in hashes and r not in selected} | {r: hashes[r] for r in complete}, "input_html_sha256": hashes,
              "dist_files_sha256": dist_files, "dist_files_unchanged": unchanged,
              "home_locked": config.get("home_locked", True), "browser": args.chrome,
              "proxy_stats": dict(server.proxy_stats), "proxy_requests": server.proxy_results, "proxy_disconnects": server.proxy_disconnects}
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"seconds": result["seconds"], "scanned": len(rows), "counts": result["counts"], "result": str(result_path)}, ensure_ascii=False))
    return int(bool(failures))
if __name__ == "__main__": sys.exit(main())
