"""本地预览：先找新站 dist，找不到的路径退回现在的候选站（这样新页链到旧页时翻页过渡也能看）。
用法：python tools/serve.py <端口> <候选站根目录>"""
import http.server, os, sys, functools
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
FALLBACK = sys.argv[2]
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = http.server.SimpleHTTPRequestHandler.translate_path(self, path)
        rel = os.path.relpath(p, os.getcwd())
        mine = os.path.join(ROOT, rel)
        if os.path.exists(mine) and not (os.path.isdir(mine) and not os.path.exists(os.path.join(mine, "index.html"))):
            return mine
        return os.path.join(FALLBACK, rel)
    def log_message(self, *a):
        pass
os.chdir(ROOT)
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
