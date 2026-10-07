"""跨域取首屏图当贴图的实测：两个本机端口就是两个不同的源（一个当网站，一个当 OSS）。
OSS 那个端口：可选给不给 Access-Control-Allow-Origin；**不回 Vary: Origin**（照实测的 OSS）；带 Cache-Control 让浏览器缓存。
场景：
  A 页面首屏 <img> 带 crossorigin="anonymous"，OSS 给跨域许可 → 引擎直接用这张图当贴图，不另外下载
  B 页面首屏 <img> 不带跨域属性，图先被普通方式取过并进了缓存，OSS 给跨域许可但不回 Vary → 引擎带跨域声明加小参数另取一次
  C 同 B，但引擎不加小参数（模拟没处理这个坑）→ 看会不会失败
  D 首屏图不给跨域许可（配置/范围图允许），页面 <img> 不带跨域属性 → 引擎安静退回原图
  E 首屏图不给跨域许可（配置/范围图允许），页面 <img> 却带了 crossorigin → 看首屏图本身会不会出问题
用法：python tools/cors_test.py   （先跑 pack_engine.py 和 pack.py localocr）
输出：work/cors-results.json
"""
import functools
import http.server
import json
import shutil
import threading
import time
import contextlib

import browser
import common
from playwright.sync_api import sync_playwright

PAGE = "localocr"


def serve(directory, acao, log):
    class H(http.server.SimpleHTTPRequestHandler):
        def copyfile(self, source, outputfile):
            try:
                super().copyfile(source, outputfile)
            except (ConnectionAbortedError,ConnectionResetError,BrokenPipeError):
                pass
        def end_headers(self):
            # 照 OSS 的实际做法：只有请求带 Origin（按跨域方式取）时才回许可头；不回 Vary: Origin
            if (acao or not self.path.startswith('/_typeset/')) and self.headers.get("Origin"):
                self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin"))
            self.send_header("Cache-Control", "public, max-age=3600")
            super().end_headers()

        def log_message(self, fmt, *a):
            log.append(self.path)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=str(directory)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    root = common.ENGINE / "work" / "cors"
    if root.exists():
        common.recycle(root)
    oss = root / "oss"
    site = root / "site"
    shutil.copytree(common.DIST / "_engine", oss / "_engine")
    shutil.copytree(common.DIST / PAGE, oss / PAGE)
    img_src = common.site_image(PAGE, "h")
    (oss / "_typeset" / PAGE).mkdir(parents=True)
    shutil.copy2(img_src, oss / "_typeset" / PAGE / img_src.name)
    man = json.loads((oss / "_engine" / "files.json").read_text(encoding="utf-8"))
    W, H = common.image_size(PAGE, "h")
    site.mkdir(parents=True)
    results = {}
    with sync_playwright() as pw, browser.managed(pw) as br, contextlib.ExitStack() as services:
        for key, acao, attr, bust in [("A", True, True, True), ("B", True, False, True), ("C", True, False, False), ("D", False, False, True), ("E", False, True, True)]:
            log_oss, log_site = [], []
            o = serve(oss, acao, log_oss)
            services.callback(o.server_close); services.callback(o.shutdown)
            s = serve(site, False, log_site)
            services.callback(s.server_close); services.callback(s.shutdown)
            O = f"http://127.0.0.1:{o.server_port}"
            img_url = f"{O}/_typeset/{PAGE}/{img_src.name}"
            html = f"""<!doctype html><html><head><meta charset="utf-8"><link rel="icon" href="data:,"><link rel="stylesheet" href="{O}/_engine/{man['style']}">
<style>body{{margin:0}}.paper{{max-width:1392px;width:calc(100% - 48px);margin:24px auto}}.typeset-part{{position:relative}}.typeset-part>picture>img{{display:block;width:100%;height:100%}}.overlays{{position:absolute;inset:0;pointer-events:none}}</style></head>
<body><div class="paper"><section class="typeset-screen"><div class="typeset-part" data-orientation="h" style="aspect-ratio:{W}/{H}"><picture><img id="hero" src="{img_url}" {'crossorigin="anonymous"' if attr else ''} width="{W}" height="{H}" alt="开头"></picture><div class="overlays"></div></div></section></div>
<script src="{O}/_engine/{man['engine']}"></script>
<script>
// 先让页面上的图按页面自己的方式加载完、进缓存，再挂活画（模拟网站先显示图、脚本后到）
const go = () => {{ window.living = LivingArt.mount(document.querySelector('.typeset-screen'), {{ config: '{O}/{PAGE}/config.json', preview: true, _noCorsBust: {str(not bust).lower()} }}); }};
const im = document.getElementById('hero'); if (im.complete) setTimeout(go, 300); else {{ im.onload = () => setTimeout(go, 300); im.onerror = () => setTimeout(go, 300); }}
</script></body></html>"""
            (site / f"{key}.html").write_text(html, encoding="utf-8")
            ctx = br.new_context(viewport={"width": 1440, "height": 1000})
            pg = ctx.new_page()
            errs, cons = [], []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: cons.append(f"{m.type}: {m.text}"))
            pg.goto(f"http://127.0.0.1:{s.server_port}/{key}.html")
            t0 = time.time()
            d = None
            while time.time() - t0 < 12:
                d = pg.evaluate("() => window.living && living.diagnostics()")
                if d and d.get("phase") in ("live", "static"):
                    break
                time.sleep(0.3)
            time.sleep(0.8)
            d = pg.evaluate("() => window.living && living.diagnostics()")
            img_ok = pg.evaluate("() => { const i = document.getElementById('hero'); return i.complete && i.naturalWidth > 0; }")
            canvas_visible = pg.evaluate("() => { const c = document.querySelector('.living-layer canvas'); return !!c && getComputedStyle(c).visibility === 'visible'; }")
            ctx.close()
            o.shutdown(); s.shutdown()
            img_reqs = [p for p in log_oss if p.split("?")[0].endswith(img_src.name)]
            results[key] = {"oss_allows_cors": acao, "img_has_crossorigin": attr, "engine_cache_bust": bust,
                            "phase": d and d.get("phase"), "reason": d and d.get("reason"), "errors": d and d.get("errors"),
                            "intro": d and d.get('intro'), "engine_source_sha256":man.get('engine_source_sha256'),
                            "first_screen_image_visible": img_ok, "canvas_visible": canvas_visible,
                            "image_requests": img_reqs, "page_exceptions": errs, "console_errors": [c for c in cons if c.startswith("error")][:3]}
            print(key, json.dumps(results[key], ensure_ascii=False))
        br.close()
    (common.ENGINE / "work" / "cors-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
    checks = {'A_direct':results['A']['phase']=='live' and results['A']['first_screen_image_visible'] and len(results['A']['image_requests'])==1,
      'B_fallback':results['B']['phase']=='live' and results['B']['first_screen_image_visible'] and len(results['B']['image_requests'])==2,
      'C_cached_negative':results['C']['phase']=='static',
      'D_denied':results['D']['phase']=='static' and results['D']['first_screen_image_visible'] and not results['D']['canvas_visible'],
      'E_bad_img_cors':results['E']['phase']=='static' and not results['E']['first_screen_image_visible'],
      'no_page_exceptions':all(not r['page_exceptions'] for r in results.values())}
    acceptance = {'passed':all(checks.values()),'checks':checks,'engine_source_sha256':man.get('engine_source_sha256')}
    (common.ENGINE/'work'/'cors-acceptance.json').write_text(json.dumps(acceptance,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(json.dumps(acceptance,ensure_ascii=False),flush=True)
    if not acceptance['passed']:raise SystemExit(1)


if __name__ == "__main__":
    main()
