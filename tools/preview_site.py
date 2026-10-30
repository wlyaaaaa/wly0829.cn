"""Serve the actual complete artifact, with only a read-only status proxy."""
import argparse
import gzip
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
import json
from http.client import HTTPException
from pathlib import Path
import re
from runpy import run_path
from urllib.request import ProxyHandler, Request, build_opener
import zlib

ROOT = Path(__file__).resolve().parents[1] / 'dist'
PREFIX = run_path(str(ROOT.parent / 'scripts/same-origin-runtime.py'))['PREFIX']
DEVICE = re.compile(r'[A-Za-z0-9_-]{43}')
TEXT = {'.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest'}
STATUS_ENDPOINTS = ('https://mcp.wly0829.cn/computer-access/api/status', 'https://live.wly0829.cn/computer-access/state')
# A preview is a direct host read, independent of the launching AI session's proxies.
STATUS_OPENER = build_opener(ProxyHandler({}))


def read_status(query, headers):
    for endpoint in STATUS_ENDPOINTS:
        try:
            with STATUS_OPENER.open(Request(endpoint + query, headers={**headers, 'Accept-Encoding': 'gzip'}), timeout=6) as response:
                body = response.read()
                if not 200 <= response.status < 300: raise ValueError('Status unavailable')
                if response.headers.get('Content-Encoding', '').strip().lower() == 'gzip': body = gzip.decompress(body)
            if not isinstance(json.loads(body), dict): raise ValueError('Invalid status')
            return body
        except (OSError, ValueError, HTTPException, EOFError, zlib.error) as error:
            failure = error
    raise failure


class Preview(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir() and not self.path.split('?', 1)[0].endswith('/'): return super().send_head()
        if path.is_dir(): path /= 'index.html'
        if not path.is_file() or path.suffix not in TEXT: return super().send_head()
        # Keep absolute assets absolute so sprite engines do not prepend their base.
        raw = PREFIX.sub('http://' + self.headers['Host'] + '/', path.read_text('utf8')).encode('utf8')
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(path.name) + '; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        return BytesIO(raw)

    def do_GET(self):
        if self.path.split('?')[0] != '/__status': return super().do_GET()
        try:
            query = '?' + self.path.split('?', 1)[1] if '?' in self.path else ''
            headers = {'Origin': 'https://wly0829.cn', 'Referer': 'https://wly0829.cn/', 'User-Agent': 'wly-local-preview'}
            # 本人设备钥匙只按固定格式原样转发，不记录
            device = self.headers.get('X-Cockpit-Device') or ''
            if DEVICE.fullmatch(device): headers['X-Cockpit-Device'] = device
            body = read_status(query, headers)
            self.send_response(200); self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store'); self.send_header('Content-Length', str(len(body)))
            self.end_headers(); self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError): pass
        except Exception: self.send_error(502, 'Status unavailable')

    def send_error(self, code, message=None, explain=None):
        if code == 404 and (ROOT / '404.html').is_file():
            body = PREFIX.sub('http://' + self.headers['Host'] + '/', (ROOT / '404.html').read_text('utf8')).encode('utf8'); self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD': self.wfile.write(body)
        else: super().send_error(code, message, explain)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1'); parser.add_argument('--port', type=int, default=4321)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), partial(Preview, directory=str(ROOT)))
    server.daemon_threads = True
    print('Preview: http://' + args.host + ':' + str(server.server_port), flush=True)
    server.serve_forever()
