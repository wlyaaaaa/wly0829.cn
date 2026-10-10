"""稳定画面扫描；来源、只读预览规则和用法见 docs/publish-and-scan.md。"""
import argparse, functools, hashlib, http.server, json, os, subprocess, sys, tempfile, threading, time, urllib.error, urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
HERE = Path(__file__).resolve().parent
UPSTREAMS = {"mcp": "https://mcp.wly0829.cn", "live": "https://live.wly0829.cn", "oss": "https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com"}
VIEWPORTS = ((1920, 1080), (3840, 2160))
def read_json(path): return json.loads(Path(path).read_text(encoding="utf-8-sig"))
def file_inventory(root):
    hashes = {}
    for file in sorted(f for f in root.rglob("*") if f.is_file()):
        with file.open("rb") as stream: hashes[file.relative_to(root).as_posix()] = hashlib.file_digest(stream, "sha256").hexdigest()
    return hashes
def route_name(path):
    value = "/" + str(path).replace("\\", "/").lstrip("/")
    return value[:-10] if value.endswith("index.html") else value
def select_pages(dist, mode, hashes, previous, locked=False):
    if mode == "all": selected = list(hashes)
    elif mode == "changed":
        receipt = dist / ".build-receipt.json"
        if receipt.exists():
            data = read_json(receipt)
            selected = [route_name(x) for x in data["rebuilt_pages"]]
        else: selected = [r for r, h in hashes.items() if previous.get(r) != h]
    else: selected = [route_name(x.strip()) for x in mode.split(",") if x.strip()]
    missing = set(selected) - hashes.keys()
    if missing: raise ValueError(f"成品缺少页面：{sorted(missing)}")
    return sorted(set(selected) - ({"/"} if locked else set()))
class Preview(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
    def upstream(self, url, headers, head):
        local = getattr(self.server, "local_objects", {}).get(url)
        if local and local.is_file():
            return 200, {"Content-Type": self.guess_type(str(local)), "X-Glance-Local-Object": "1"}, local.read_bytes()
        cacheable = not head and url.startswith(UPSTREAMS["oss"] + "/")
        key = hashlib.sha256((url + "\n" + headers.get("Range", "")).encode()).hexdigest() if cacheable else None
        lock = self.server.oss_locks.setdefault(key, threading.Lock()) if key else threading.Lock()
        with lock:
            file = self.server.oss_cache / key if key else None
            meta = file.with_suffix(".json") if file else None
            if meta and meta.is_file():
                saved = read_json(meta); return saved["status"], saved["headers"], file.read_bytes()
            try:
                response = urllib.request.urlopen(urllib.request.Request(url, method="HEAD" if head else "GET", headers=headers), timeout=20)
            except urllib.error.HTTPError as error: response = error
            except Exception as error: return 502, {"Content-Type": "text/plain", "X-Glance-Proxy-Error": type(error).__name__}, b""
            with response:
                try: raw = response.read()
                except Exception as error: return 502, {"Content-Type": "text/plain", "X-Glance-Proxy-Error": type(error).__name__}, b""
                info = {k: response.headers[k] for k in ("Content-Type", "Content-Length", "Content-Range", "Accept-Ranges") if k in response.headers}
                info["X-Glance-Upstream-Status"] = str(response.code)
                if file and response.code in (200, 206):
                    file.write_bytes(raw)
                    meta.write_text(json.dumps({"url": url, "range": headers.get("Range", ""), "status": response.code,
                        "headers": info, "sha256": hashlib.sha256(raw).hexdigest(),
                        "observed_at_beijing": datetime.now(timezone(timedelta(hours=8))).isoformat()}), encoding="utf-8")
                return response.code, info, raw
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
        head = self.command == "HEAD"; upstream = None
        if self.path.startswith("/__status"): upstream = UPSTREAMS["mcp"] + "/computer-access/api/status" + self.path[len("/__status"):]
        for key, host in UPSTREAMS.items():
            prefix = "/__proxy/" + key
            if self.path.startswith(prefix + "/"): upstream = host + self.path[len(prefix):]
        if upstream:
            headers = {"Origin": "https://wly0829.cn", "Referer": "https://wly0829.cn/", "User-Agent": "wly-local-preview", "Accept": self.headers.get("Accept", "*/*")}
            if self.headers.get("Range"): headers["Range"] = self.headers["Range"]
            status, info, raw = self.upstream(upstream, headers, head)
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
    do_HEAD = do_GET
def is_live(url):
    parts = urlsplit(url)
    return parts.hostname in ("mcp.wly0829.cn", "live.wly0829.cn") or parts.path.startswith(("/__status", "/__proxy/mcp/", "/__proxy/live/"))
def finding(category, message, selector="html", rect=None):
    return {"category": category, "message": message, "selector": selector, "rect": rect}
def settle(page, activity, pending, all_images=False):
    page.evaluate("""async all => {
      const images = [...document.images].filter(i => i.getAttribute('src') && (all || i.loading !== 'lazy' || i.getBoundingClientRect().top < innerHeight));
      const ready = Promise.all([document.fonts.ready, ...images.map(i => i.complete ? null : new Promise(r => {i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true});}))]);
      await Promise.race([ready,new Promise((_, reject)=>setTimeout(()=>reject(new Error('字体或图片未完成')),20000))]);
    }""", all_images)
    deadline = time.monotonic() + 30
    while pending or time.monotonic() - activity[0] < 1:
        if time.monotonic() > deadline: raise TimeoutError("网络未静默 1 秒")
        page.wait_for_timeout(100)
def scan_worker(worker, jobs, args, base, scratch, config, link_items):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    results = []; script = (HERE / "scan_glance_dom.js").read_text(encoding="utf-8")
    with sync_playwright() as pw:
        browser = pw.chromium.launch_persistent_context(str(scratch / f"chrome-{worker}"), executable_path=args.chrome, headless=True, device_scale_factor=1, reduced_motion="reduce", service_workers="block")
        browser.set_default_timeout(30000)
        browser.route("**/*", lambda route: route.continue_() if route.request.method in ("GET", "HEAD", "OPTIONS") else route.abort())
        for route, width, height in jobs:
            page = browser.new_page(); page.set_viewport_size({"width": width, "height": height})
            row = {"page": route, "viewport": f"{width}x{height}", "failures": [], "hints": [], "live_unavailable": [], "seconds": {}}
            mark = [time.monotonic()]
            def tick(label):
                now = time.monotonic(); row["seconds"][label] = round(now - mark[0], 3); mark[0] = now
            activity = [time.monotonic()]; pending = set()
            def request(req): pending.add(req); activity[0] = time.monotonic()
            def finished(req): pending.discard(req); activity[0] = time.monotonic()
            def response(res):
                if res.status >= 400:
                    error = res.headers.get("x-glance-proxy-error")
                    dest = row["live_unavailable"] if is_live(res.url) else row["failures"]
                    item = finding("读不到" if is_live(res.url) else "transport" if error else "404", f"{res.status} {res.url}")
                    item.update(exception_type=error, response_kind="proxy_transport" if error else "http")
                    dest.append(item)
            def failed(req):
                finished(req)
                dest = row["live_unavailable"] if is_live(req.url) else row["failures"]
                dest.append(finding("读不到" if is_live(req.url) else "transport", f"{req.failure} {req.url}"))
            page.on("request", request); page.on("requestfinished", finished); page.on("requestfailed", failed); page.on("response", response)
            stem = hashlib.sha256(route.encode()).hexdigest()[:12] + f"--{width}"
            try:
                page.goto(base + quote(route, safe="/"), wait_until="load", timeout=30000)
                if config.get("home_locked", True) and urlsplit(page.url).path in ("/", "/index.html"): raise RuntimeError("路由跳到了已排除的首页")
                tick("load"); settle(page, activity, pending); tick("initial_settle")
                y = 0; steps = 0
                while y < page.evaluate("document.documentElement.scrollHeight") and steps < 1500:
                    page.evaluate("(y)=>window.scrollTo({top:y,left:0,behavior:'instant'})", y)
                    page.wait_for_timeout(50); y += max(500, int(height * .8)); steps += 1
                if steps == 1500: raise RuntimeError("滚动未覆盖整页")
                settle(page, activity, pending, True)
                page.evaluate("window.scrollTo({top:0,left:0,behavior:'instant'})"); settle(page, activity, pending)
                page.evaluate(script + "\n;void 0;"); dom = page.evaluate("(config)=>window.scanGlance(config)", config)
                row["failures"].extend(dom["failures"]); row["hints"].extend(dom["hints"])
                for item in link_items:
                    if route_name(item["page"]) == route:
                        selector = "a[href=" + json.dumps(item["href"]) + "]"
                        rect = page.locator(selector).first.bounding_box() if page.locator(selector).count() else None
                        row["failures"].append(finding("404", item["problem"], selector, rect))
            except Exception as error: row["failures"].append(finding("scan_error", str(error)))
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
            page.close(); results.append(row)
            print(json.dumps({"page": route, "viewport": row["viewport"], "failures": len(row["failures"]), "hints": len(row["hints"])}, ensure_ascii=False), flush=True)
        browser.close()
    return results
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", required=True, type=Path); parser.add_argument("--pages", default="changed")
    parser.add_argument("--out", type=Path); parser.add_argument("--config", type=Path, default=HERE / "scan_glance.json")
    parser.add_argument("--chrome", default=r"C:\Program Files\Google\Chrome\Application\chrome.exe"); parser.add_argument("--port", type=int, default=0)
    args = parser.parse_args(); args.dist = args.dist.resolve(); args.out = (args.out or args.dist.parent / "scan-glance").resolve()
    if not args.dist.is_dir(): parser.error("dist 不存在")
    args.out.mkdir(parents=True, exist_ok=True); (args.out / "screenshots").mkdir(exist_ok=True)
    started = time.monotonic(); config = read_json(args.config); result_path = args.out / "scan-result.json"
    previous = read_json(result_path).get("html_sha256", {}) if result_path.exists() else {}
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
        server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), functools.partial(Preview, directory=str(args.dist)))
        server.oss_cache = args.out / ("oss-cache-" + str(time.time_ns())); server.oss_cache.mkdir()
        server.oss_locks = {}
        manifest = read_json(args.dist / "release-manifest.json") if "release-manifest.json" in dist_files else {}
        server.local_objects = {row["url"]: args.dist / rel for rel, row in manifest.get("oss", {}).get("objects", {}).items() if (args.dist / rel).is_file()}
        server.base = f"http://127.0.0.1:{server.server_port}"; threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            jobs = [(route, w, h) for route in selected for w, h in VIEWPORTS]
            with ThreadPoolExecutor(max_workers=4) as pool:
                futures = [pool.submit(scan_worker, i, jobs[i::4], args, server.base, scratch, config, links) for i in range(4) if jobs[i::4]]
                for i, future in enumerate(futures):
                    try: rows.extend(future.result())
                    except Exception as error:
                        rows.extend({"page": r, "viewport": f"{w}x{h}", "hints": [], "live_unavailable": [],
                                     "failures": [finding("scan_error", str(error))]} for r, w, h in jobs[i::4])
        finally: server.shutdown(); server.server_close()
    for row in rows:
        for kind in ("failures", "hints", "live_unavailable"):
            for item in row[kind]: item.update(page=row["page"], viewport=row["viewport"])
    failures = offline + [item for row in rows for item in row["failures"]]
    unchanged = dist_files == file_inventory(args.dist)
    if not unchanged: failures.append(dict(finding("scan_error", "扫描期间 dist 文件增删或字节变化"), page="offline", viewport="offline"))
    complete = {r for r in selected if all(not any(f["category"] == "scan_error" for f in row["failures"])
                                          for row in rows if row["page"] == r)}
    result = {"observed_at_beijing": datetime.now(timezone(timedelta(hours=8))).isoformat(),
              "seconds": round(time.monotonic() - started, 3), "pages": rows, "selected_routes": selected,
              "failures": failures, "counts": dict(Counter(item["category"] for item in failures)),
              "hints": [item for row in rows for item in row["hints"]],
              "live_unavailable": [item for row in rows for item in row["live_unavailable"]],
              "html_sha256": previous | {r: hashes[r] for r in complete}, "input_html_sha256": hashes,
              "dist_files_sha256": dist_files, "dist_files_unchanged": unchanged,
              "home_locked": config.get("home_locked", True), "browser": args.chrome}
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"seconds": result["seconds"], "scanned": len(rows), "counts": result["counts"], "result": str(result_path)}, ensure_ascii=False))
    return int(bool(failures))
if __name__ == "__main__": sys.exit(main())
