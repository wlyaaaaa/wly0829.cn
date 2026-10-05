"""小鸟带路样板的本地预览（只听 127.0.0.1）。

  python scripts/serve_bird_guide_preview.py --site <整站候选目录> [--packet living-prepared/bird-guide] [--cache <http-cache>]... [--port 8765]
  然后用浏览器打开 http://127.0.0.1:8765/projects/localocr/ 、/how-this-site/ 或 /cockpit/

先在样板包里找（pages/ 是挂好带路的样板页，assets/ 是新引擎、鸟和配置），找不到再到整站候选里找。
网站图片在 OSS 上、只认正式网站来源；预览时把页面、样式、脚本里的 OSS 地址改写成本机 /__oss/，
由本服务先查缓存、缺的再以正式网站来源取一次并存进 --own-cache。页面本身和样板包文件不改。
"""
from __future__ import annotations

import argparse
import hashlib
import http.server
import json
import mimetypes
import socketserver
import tempfile
import urllib.request
from pathlib import Path
from urllib.parse import unquote

OSS = 'https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/'
REFERER = 'https://wly0829.cn/'
TEXT = ('.html', '.css', '.js', '.mjs', '.json')
mimetypes.add_type('image/webp', '.webp'); mimetypes.add_type('image/avif', '.avif'); mimetypes.add_type('text/javascript', '.js')


def main():
    here = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--site', type=Path, required=True)
    ap.add_argument('--packet', type=Path, default=here / 'living-prepared/bird-guide')
    ap.add_argument('--asset-root', type=Path, action='append', default=[])
    ap.add_argument('--cache', type=Path, action='append', default=[])
    ap.add_argument('--own-cache', type=Path, default=None)
    ap.add_argument('--port', type=int, default=8765)
    ap.add_argument('--no-fetch', action='store_true',
                    help='OSS来源在所给cache和own-cache都未命中时返回502，不发起公网GET')
    a = ap.parse_args()
    roots = [a.packet / 'pages', a.packet / 'assets', *a.asset_root, a.site]
    index = {}
    for d in a.cache:
        t = d / 'traffic.json'
        if t.exists():
            for sha, v in json.loads(t.read_text('utf-8')).items():
                index.setdefault(v['url'], d / (sha + '.body'))
    own = a.own_cache or Path(tempfile.gettempdir()) / 'wly-bird-guide-preview'
    own.mkdir(parents=True, exist_ok=True)

    def oss_bytes(url):
        p = index.get(url)
        if p and p.exists():
            return p.read_bytes()
        key = own / (hashlib.sha256(url.encode()).hexdigest() + '.body')
        if key.exists():
            return key.read_bytes()
        if a.no_fetch:
            raise FileNotFoundError('OSS object missing from local caches; --no-fetch prevented a public GET: ' + url)
        req = urllib.request.Request(url, headers={'Referer': REFERER, 'User-Agent': 'Mozilla/5.0 wly-bird-guide-preview'})
        body = urllib.request.urlopen(req, timeout=90).read()
        key.write_bytes(body)
        return body

    class Handler(http.server.BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def send(self, body, ctype):
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            path = unquote(self.path.split('?', 1)[0].split('#', 1)[0])
            try:
                if path.startswith('/__oss/'):
                    url = OSS + path[len('/__oss/'):]
                    body = oss_bytes(url)
                else:
                    rel = path.lstrip('/')
                    hit = None
                    for r in roots:
                        p = r / rel
                        if p.is_dir() and (p / 'index.html').exists():
                            hit = p / 'index.html'; break
                        if p.is_file():
                            hit = p; break
                    if not hit:
                        self.send_error(404); return
                    body, url = hit.read_bytes(), hit.name
                name = url.rsplit('/', 1)[-1]
                ctype = mimetypes.guess_type(name)[0] or 'application/octet-stream'
                if name.endswith(TEXT) or ctype.startswith('text/'):
                    body = body.replace(OSS.encode(), b'/__oss/')
                    if ctype.startswith('text/') or name.endswith(('.js', '.json')):
                        ctype += '; charset=utf-8'
                self.send(body, ctype)
            except Exception as error:  # 预览服务：出错只回 502，不中断
                self.send_error(502, str(error)[:200])

    class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True

    print(f'预览：http://127.0.0.1:{a.port}/projects/localocr/  和  http://127.0.0.1:{a.port}/how-this-site/', flush=True)
    Server(('127.0.0.1', a.port), Handler).serve_forever()


if __name__ == '__main__':
    main()
