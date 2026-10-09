"""只用新站 dist 的本地预览（不回退到旧站），用来核对新页需要的文件都在 dist 里。python tools/serve_dist_only.py <端口>"""
import http.server, os, sys, functools
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), functools.partial(H, directory=ROOT)).serve_forever()
