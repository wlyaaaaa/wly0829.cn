"""现行驾驶舱（site-astro 原生页）的浏览器测试底座；全部数据虚构，只在 127.0.0.1 上跑。

不走整站构建（构建时会去读线上电脑状态），而是照 site-astro/src/pages/cockpit/index.astro 的做法拼一页：
- 首帧：用 node 调现行的 model.js / render.js / overview-screen.js，和构建时一样画好整页；
- 浏览器里：原样加载 src/cockpit/client.js、refresh-button.js、today-river.js、overview-screen.js；
- 刷新按钮的外框、cockpit-boot 里的本机读取地址，都从 index.astro 原文里取，页面改了这里跟着变。
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
from pathlib import Path
import re
import subprocess
import threading
import time
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site-astro'
COCKPIT = SITE / 'src' / 'cockpit'
ASTRO = SITE / 'src' / 'pages' / 'cockpit' / 'index.astro'
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
SCHEMA = 'pcconfig.cockpit-view.v1'

# 测试服务器上的路径 → 仓库里的现行文件
STATIC = {
    '/src/cockpit/': COCKPIT,
    '/_overview/': SITE / 'public' / '_overview',
    '/scripts/today-river-assets2/': ROOT / 'scripts' / 'today-river-assets2',
    '/assets/cockpit/': ROOT / 'sources' / 'assets' / 'cockpit',
}
STATIC_FILES = {
    '/scripts/today-river.js': ROOT / 'scripts' / 'today-river.js',
    '/scripts/today-river.css': ROOT / 'scripts' / 'today-river.css',
}


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone(timedelta(hours=8))).isoformat()


def ago(**kw) -> str:
    return iso(datetime.now(timezone.utc) - timedelta(**kw))


def astro_parts() -> dict:
    """从 index.astro 原文取：本机读取地址、刷新按钮外框、页面里加载的两份浏览器脚本。"""
    text = ASTRO.read_text('utf8')
    local = re.search(r"local:\s*\[([^\]]*)\]", text)
    wrap = re.search(r'<div class="cockpit-refresh-wrap">.*?</div>', text, re.S)
    if not local or not wrap:
        raise AssertionError('index.astro 里找不到本机读取地址或刷新按钮外框；驾驶舱结构变了，先更新测试底座')
    for need in ("import '../../cockpit/client.js';", "import '../../cockpit/refresh-button.js';", 'id="cockpit-boot"', '/_overview/overview-screen.js'):
        if need not in text:
            raise AssertionError('index.astro 不再包含 ' + need + '；先更新测试底座')
    return {'local': json.loads('[' + local.group(1).replace("'", '"') + ']'), 'refresh_wrap': wrap.group(0)}


RENDER = r"""
const [base, ovUrl] = process.argv.slice(1);
let input = '';
process.stdin.on('data', (d) => input += d).on('end', async () => {
  const { normalize } = await import(base + 'model.js');
  const { page } = await import(base + 'render.js');
  const ov = await import(ovUrl);
  const { snapshot, projectUrls } = JSON.parse(input);
  process.stdout.write(page(normalize(snapshot), { now: new Date(), offline: false, phase: 'snapshot', projectUrls, img: {}, ov }));
});
"""


def first_frame(snapshot: dict, project_urls: dict) -> str:
    """和 index.astro 构建时同一组函数画首帧。"""
    ov = (SITE / 'public' / '_overview' / 'overview-screen.js').as_uri()
    out = subprocess.run(['node', '-e', RENDER, COCKPIT.as_uri() + '/', ov], input=json.dumps({'snapshot': snapshot, 'projectUrls': project_urls}),
                         capture_output=True, text=True, encoding='utf8', check=True)
    return out.stdout


def document(snapshot: dict, project_urls: dict | None = None) -> bytes:
    project_urls = project_urls or {}
    parts = astro_parts()
    safe = lambda o: json.dumps(o, ensure_ascii=False).replace('<', '\\u003c')
    boot = safe({'endpoints': ['https://live.invalid/state?view=cockpit'], 'local': parts['local'], 'snapshot': snapshot, 'projectUrls': project_urls, 'img': {}})
    html = f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>驾驶舱测试页</title>
<link rel="stylesheet" href="/src/cockpit/cockpit.css"><link rel="stylesheet" href="/src/cockpit/refresh-button.css">
<link rel="stylesheet" href="/scripts/today-river.css"><link rel="stylesheet" href="/_overview/overview-screen.css">
<style>html,body{{margin:0}}main{{max-width:1440px;margin:0 auto;padding:0 16px;box-sizing:border-box}}</style>
</head><body><main><div class="cp-page">{first_frame(snapshot, project_urls)}</div>{parts['refresh_wrap']}</main>
<script type="application/json" id="cockpit-boot">{boot}</script>
<script type="module" src="/_overview/overview-screen.js"></script>
<script type="module" src="/scripts/today-river.js"></script>
<script type="module">import '/src/cockpit/client.js'; import '/src/cockpit/refresh-button.js';</script>
</body></html>"""
    return html.encode('utf8')


def view(processor='测试处理器 A', observed=None, **extra) -> dict:
    """一份虚构的精简视图（pcconfig.cockpit-view.v1）。"""
    observed = observed or ago(seconds=20)
    task = {'id': 'fixture-task', 'name': '虚构测试任务', 'group': 'mine', 'state': 'success', 'enabled': True, 'mine': True,
            'runs_today': True, 'last_run_at': observed, 'next_run_at': iso(datetime.now(timezone.utc) + timedelta(hours=1)),
            'schedule': '每小时', 'what': '虚构测试工作', 'stop': '虚构停止入口', 'impact': '虚构停止影响'}
    body = {
        'schema': SCHEMA, 'display_only': True, 'status': 'pass', 'served_at': observed, 'collected_at': observed,
        'collectors': {k: {'state': 'ready', 'observed_at': observed, 'refresh_completed_at': observed} for k in ('authorization', 'hardware', 'dashboard')},
        'verdict': {'severity': 'gray', 'state': 'ok', 'observed_at': observed},
        'security': {'personal_data': {'state': 'locked'}, 'unrestricted': {'state': 'inactive'}, 'windows': {'state': 'locked'},
                     'computer': {'online': True, 'uptime_hours': 2}, 'observed_at': observed, 'state': 'ok'},
        'automation': {'state': 'ok', 'observed_at': observed, 'groups': [], 'items': [task]},
        'sections': {
            'computer': [{'id': 'computer_health', 'title': '处理器', 'text': processor + '：12%，40℃', 'state': 'ok', 'observed_at': observed}],
            'remote': [{'id': 'remote', 'title': '远程连接', 'text': '虚构远程连接在线', 'state': 'ok', 'observed_at': observed}],
            'backup_cloud': [{'id': 'fixture_backup', 'title': '虚构测试备份', 'text': '虚构备份都在期限内', 'state': 'ok', 'observed_at': observed}],
            'today': [],
        },
        'today': {'state': 'ok', 'observed_at': observed, 'items': []},
        'grafana': {'state': 'unavailable', 'checked_at': observed, 'links': []},
        'projects': {'state': 'ok', 'observed_at': observed, 'items': [{'id': 'p1', 'name': '虚构正常项目', 'run_health': 'ok', 'overview': 'ok'}]},
        'overview': {'schema': 'overview.v1', 'score': 90, 'level': 'ok', 'as_of': observed, 'stale_after_seconds': 180, 'reasons': [],
                     'signals': [{'id': 'computer', 'level': 'ok'}, {'id': 'today_tasks', 'level': 'ok', 'value': 0}, {'id': 'backup', 'level': 'ok'}],
                     'sections': {k: {'level': 'ok', 'word': '正常'} for k in ('need_you', 'automation', 'computer', 'backup_cloud', 'projects', 'today')}},
    }
    body.update(extra)
    return body


class StatusServer:
    """127.0.0.1 上的页面和虚构状态接口；状态按到达顺序从队列取，可设延迟，记录所有请求。"""

    def __init__(self):
        self.lock = threading.Lock()
        self.queue: list = []
        self.default = (503, {'status': 'error', 'reason': 'fictional_fixture_unavailable'}, 0)
        self.pages: dict[str, bytes] = {}
        self.status_reads = 0
        self.requests: list = []
        self.stamp_collectors = True
        outer = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_):
                pass

            def _send(self, code, payload, ctype):
                self.send_response(code)
                self.send_header('Content-Type', ctype)
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(payload)))
                self.end_headers()
                try:
                    self.wfile.write(payload)
                except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                    pass

            def do_POST(self):
                with outer.lock:
                    outer.requests.append((self.command, self.path))
                self._send(405, b'{}', 'application/json')

            do_PUT = do_DELETE = do_PATCH = do_POST

            def do_GET(self):
                path = unquote(urlsplit(self.path).path)
                with outer.lock:
                    outer.requests.append((self.command, self.path))
                if path == '/__status':
                    with outer.lock:
                        outer.status_reads += 1
                        code, body, delay = outer.queue.pop(0) if outer.queue else outer.default
                    time.sleep(delay)
                    body = body() if callable(body) else body
                    if code == 200 and outer.stamp_collectors and isinstance(body, dict) and body.get('schema') == SCHEMA:
                        # 刷新按钮看“三个采集器都在点击之后完成过”；虚构接口每次都算刚采完
                        body = {**body, 'collectors': {k: {**v, 'refresh_completed_at': iso(datetime.now(timezone.utc))} for k, v in body.get('collectors', {}).items()}}
                    return self._send(code, json.dumps(body, ensure_ascii=False).encode('utf8'), 'application/json')
                if path in outer.pages:
                    return self._send(200, outer.pages[path], 'text/html; charset=utf-8')
                file = STATIC_FILES.get(path)
                if not file:
                    for prefix, folder in STATIC.items():
                        if path.startswith(prefix):
                            file = folder / path[len(prefix):]
                            break
                if not file or not file.is_file():
                    return self._send(404, b'not found', 'text/plain')
                ctype = 'text/javascript' if file.suffix == '.js' else mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
                if ctype.startswith('text/'):
                    ctype += '; charset=utf-8'
                return self._send(200, file.read_bytes(), ctype)

        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.server.daemon_threads = True
        self.origin = 'http://127.0.0.1:' + str(self.server.server_port)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def respond(self, *items):
        with self.lock:
            self.queue = list(items)

    def writes(self):
        with self.lock:
            return [r for r in self.requests if r[0] not in ('GET', 'HEAD')]

    def close(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(2)


def isolate(context):
    """只放行 127.0.0.1；其他地址一律拦下（图表网页、线上接口都不真连）。"""
    context.route('**/*', lambda route: route.continue_() if urlsplit(route.request.url).hostname == '127.0.0.1' else route.abort())


# 浏览器里读各块现在的样子（文字和 HTML），用来比“换了没有”
REGIONS_JS = """()=>Object.fromEntries([...document.querySelectorAll('[data-cp]')].map(n=>[n.dataset.cp,n.innerHTML]))"""
