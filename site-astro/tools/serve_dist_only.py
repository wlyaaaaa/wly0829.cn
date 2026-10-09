"""只用新站 dist 的本地预览（不回退到旧站），用来核对新页需要的文件都在 dist 里。python tools/serve_dist_only.py <端口>
多个浏览器同时打分时连接很多：排队上限调大（默认只有 5，满了新连接会被拒）。"""
import http.server, os, sys, functools
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
class S(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True
S(("127.0.0.1", int(sys.argv[1])), functools.partial(H, directory=ROOT)).serve_forever()
