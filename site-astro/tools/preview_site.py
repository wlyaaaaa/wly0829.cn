"""Serve the actual complete artifact, with only a read-only status proxy."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1] / 'dist'


class Preview(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

    def do_GET(self):
        if self.path.split('?')[0] != '/__status': return super().do_GET()
        try:
            query = '?refresh=1' if 'refresh=1' in self.path else ''
            request = Request('https://mcp.wly0829.cn/computer-access/api/status' + query,
                              headers={'Origin': 'https://wly0829.cn', 'Referer': 'https://wly0829.cn/'})
            with urlopen(request, timeout=15) as response: body = response.read()
            self.send_response(200); self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store'); self.send_header('Content-Length', str(len(body)))
            self.end_headers(); self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError): pass
        except Exception: self.send_error(502, 'Status unavailable')

    def send_error(self, code, message=None, explain=None):
        if code == 404 and (ROOT / '404.html').is_file():
            body = (ROOT / '404.html').read_bytes(); self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(body)))
            self.end_headers(); self.wfile.write(body)
        else: super().send_error(code, message, explain)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1'); parser.add_argument('--port', type=int, default=4321)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), partial(Preview, directory=str(ROOT)))
    server.daemon_threads = True
    print('Preview: http://' + args.host + ':' + str(server.server_port), flush=True)
    server.serve_forever()
