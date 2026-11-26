"""Serve the complete artifact with fixed local live and computer API proxies."""
import argparse
import gzip
import errno
import socket
from functools import partial
from http.cookies import CookieError, SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from ipaddress import ip_address, ip_network
from io import BytesIO
import json
from hashlib import sha256
from http.client import HTTPConnection, HTTPException
from pathlib import Path
import re
from runpy import run_path
from urllib.request import ProxyHandler, Request, build_opener
from urllib.parse import parse_qs, unquote, urlsplit
import zlib

ROOT = Path(__file__).resolve().parents[1] / 'dist'
PREFIX = run_path(str(ROOT.parent / 'scripts/same-origin-runtime.py'))['PREFIX']
HOME_ASSET = re.compile(PREFIX.pattern + r"""((?:[\w.%-]+/)*[\w.%-]+\.(?:css|js))(?=["'])""")
ASSET_QUERY = '_preview_asset='
DEVICE = re.compile(r'[A-Za-z0-9_-]{43}')
TEXT = {'.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest'}
STATUS_ENDPOINTS = ('https://mcp.wly0829.cn/computer-access/api/status', 'https://live.wly0829.cn/computer-access/state')
# A preview is a direct host read, independent of the launching AI session's proxies.
STATUS_OPENER = build_opener(ProxyHandler({}))
OWNER_LAN = ip_network('192.168.31.0/24')
NOT_LISTENING = b'{"error":"preview_upstream_not_listening"}'
UPSTREAM_UNREACHABLE = b'{"error":"preview_upstream_unreachable"}'


def static_content(path, base, owner_lan):
    if path == ROOT / 'release-identity.json':
        return path.read_bytes()
    raw = PREFIX.sub(base, path.read_text('utf8')).encode('utf8')
    if owner_lan and path == ROOT / 'live/_lib/live-client.js':
        # Only preview GETs carry the view cookie; pairing and POST stay unchanged.
        raw = raw.replace(b"fetch(url, { cache: 'no-store', credentials: 'omit'", b"fetch(url, { cache: 'no-store', credentials: 'same-origin'")
    return raw


def owner_source(address):
    try: return address == '127.0.0.1' or ip_address(address) in OWNER_LAN
    except ValueError: return False


def preview_back(query):
    back = parse_qs(query).get('back', ['/live/'])[0]
    if not back.startswith('/') or back.startswith('//') or '\\' in back or any(ord(c) < 32 for c in back): return '/live/'
    return back


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

    def owner_lan(self):
        return getattr(self.server, 'owner_lan', False) and owner_source(self.client_address[0])

    def physical_lan(self):
        if not getattr(self.server, 'lan_live_port', None) or not self.owner_lan(): return False
        host, port = self.server.server_address
        return self.headers.get('Host') == f'{host}:{port}'

    def public_view(self):
        view = self.headers.get('X-Wly-View')
        if view in {'public', 'owner'}: return view == 'public'
        cookie = SimpleCookie()
        try: cookie.load(self.headers.get('Cookie', ''))
        except CookieError: return False
        return 'wly-preview-view' in cookie and cookie['wly-preview-view'].value == 'public'

    def live_reply(self, status, body):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store'); self.end_headers()
        return BytesIO(body)

    def proxy(self):
        path, _, query = self.path.partition('?')
        path = unquote(path)
        live = re.fullmatch(r'/__live/([A-Za-z0-9_-]+(?:/[A-Za-z0-9_.:-]+)*)', path)
        computer = re.fullmatch(r'/__computer/(cockpit-device/pair|cockpit/open|cockpit/automation-settings|cockpit/actions(?:/receipt)?|cockpit/report/[A-Za-z0-9_.:-]{1,256})', path)
        if not (live or computer) or any(part in {'.', '..'} for part in path.split('/')): return self.send_error(404)
        target = '/computer-access/' + ('live/v1/' + live[1] if live else 'api/' + computer[1])
        receipt = computer and computer[1] == 'cockpit/actions/receipt'
        methods = {'GET'} if receipt else {'GET', 'HEAD'} if live or computer[1].startswith('cockpit/report/') else {'POST'}
        if self.command not in methods: return self.send_error(405)
        home = self.owner_lan()
        home_proxy = getattr(self.server, 'owner_lan', False)
        if computer and computer[1] in {'cockpit/actions', 'cockpit/actions/receipt'}:
            origin = self.headers.get('Origin')
            if not self.physical_lan() or self.public_view() or (not receipt or origin is not None) and origin != 'http://' + self.headers.get('Host', ''):
                return self.live_reply(403, b'{"status":"error","error":"public_origin_not_allowed"}')
            if not DEVICE.fullmatch(self.headers.get('X-Cockpit-Device', '')):
                return self.live_reply(403, b'{"status":"error","error":"cockpit_owner_required"}')
        if computer and (computer[1] == 'cockpit/automation-settings' or home_proxy and computer[1] == 'cockpit-device/pair'):
            if home_proxy and not home:
                return self.live_reply(403, b'{"status":"error","error":"cockpit_owner_required"}')
            host = self.headers.get('Host')
            if not host or self.headers.get('Origin') != 'http://' + host:
                return self.live_reply(403, b'{"status":"error","error":"public_origin_not_allowed"}')
        public_view = live and self.public_view()
        access_status = live and live[1] == 'access'
        headers = {'Origin': 'https://wly0829.cn', 'Referer': 'https://wly0829.cn/'}
        if home: headers['X-Wly-Cockpit-Home'] = '1'
        for key in ('X-Cockpit-Device', 'If-None-Match', 'Accept-Encoding', 'Content-Type'):
            if key == 'X-Cockpit-Device' and (public_view or access_status): continue
            if key in self.headers: headers[key] = self.headers[key]
        try:
            size = int(self.headers.get('Content-Length', '0')) if self.command == 'POST' else 0
            if not 0 <= size <= 8192: return self.send_error(413)
            # 和本人那份一样最多等 40 秒：后端慢时 8 秒就断会让访客页整片 502，页面还会重读、反倒加负担
            connection = HTTPConnection('127.0.0.1', getattr(self.server, 'upstream_port', 18793), timeout=40)
            try:
                if live:
                    try: connection.connect()
                    except ConnectionRefusedError: return self.live_reply(502, NOT_LISTENING)
                connection.request(self.command, target + ('?' + query if query else ''), self.rfile.read(size) if size else None, headers)
                response = connection.getresponse()
                body = response.read()
                self.send_response_only(response.status)
                for key, value in {key.lower(): value for key, value in response.getheaders()}.items():
                    if key in {'content-type', 'content-length', 'content-encoding', 'etag', 'cache-control', 'vary', 'date', 'content-disposition', 'content-security-policy'}:
                        self.send_header(key, value)
                if live and not access_status and self.owner_lan():
                    self.send_header('X-Wly-Preview-View', 'public' if public_view else 'owner')
                self.end_headers()
                return BytesIO(body)
            finally:
                connection.close()
        except (OSError, ValueError, HTTPException):
            if live: return self.live_reply(502, UPSTREAM_UNREACHABLE)
            return self.send_error(502, 'Local API unavailable')

    def do_POST(self):
        body = self.proxy()
        if body:
            with body: self.copyfile(body, self.wfile)

    def send_head(self):
        if self.path.startswith(('/__live', '/__computer')): return self.proxy()
        path = Path(self.translate_path(self.path))
        if path.is_dir() and not self.path.split('?', 1)[0].endswith('/'): return super().send_head()
        if path.is_dir(): path /= 'index.html'
        if not path.is_file() or path.suffix not in TEXT: return super().send_head()
        version = self.path.partition('?')[2]
        versioned = path.suffix in {'.css', '.js'} and version.startswith(ASSET_QUERY)
        owner_lan = self.owner_lan()
        base = 'http://' + self.headers['Host'] + '/'
        if path == ROOT / 'live/index.html':
            def mark_asset(match):
                name = match[1]
                local = Path(unquote(name))
                if local.anchor or '..' in local.parts: return base + name
                try: stamp = sha256(static_content(ROOT / local, base, owner_lan)).hexdigest()
                except OSError: return base + name
                return base + name + '?' + ASSET_QUERY + stamp
            text = HOME_ASSET.sub(mark_asset, path.read_text('utf8'))
            raw = PREFIX.sub(base, text).encode('utf8')
        else:
            # Keep absolute assets absolute so sprite engines do not prepend their base.
            raw = static_content(path, base, owner_lan)
        lan_port = getattr(self.server, 'lan_live_port', None)
        if path.suffix == '.html' and self.physical_lan() and not self.public_view():
            meta = f'<meta name="wly-lan-live-port" content="{lan_port}">'.encode()
            raw = raw.replace(b'<head>', b'<head>' + meta, 1)
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(path.name) + '; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        if versioned:
            immutable = version == ASSET_QUERY + sha256(raw).hexdigest()
            self.send_header('Cache-Control', 'private, max-age=31536000, immutable' if immutable else 'no-store')
        self.end_headers()
        return BytesIO(raw)

    def do_GET(self):
        view = urlsplit(self.path)
        if view.path in {'/__view/public', '/__view/owner'} and self.owner_lan():
            public = view.path.endswith('/public')
            self.send_response(303)
            self.send_header('Set-Cookie', 'wly-preview-view=' + ('public; Max-Age=31536000' if public else '; Max-Age=0') + '; Path=/; SameSite=Lax')
            self.send_header('Location', preview_back(view.query))
            self.send_header('Cache-Control', 'no-store'); self.send_header('Content-Length', '0')
            self.end_headers(); return
        if self.path.split('?')[0] != '/__status': return super().do_GET()
        try:
            query = '?' + self.path.split('?', 1)[1] if '?' in self.path else ''
            headers = {'Origin': 'https://wly0829.cn', 'Referer': 'https://wly0829.cn/', 'User-Agent': 'wly-local-preview'}
            # 本人设备钥匙只按固定格式原样转发，不记录
            device = self.headers.get('X-Cockpit-Device') or ''
            if not self.public_view() and DEVICE.fullmatch(device): headers['X-Cockpit-Device'] = device
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


class PreviewServer(ThreadingHTTPServer):
    # A browser opens several CSS and script connections in parallel.
    request_queue_size = 64
    # Windows otherwise permits two previews to share the same address.
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1'); parser.add_argument('--port', type=int, default=None, help='listen port (default: 4321, or an available port when busy)')
    parser.add_argument('--upstream-port', type=int, default=18793, help='loopback computer API port')
    parser.add_argument('--owner-lan', action='store_true', help='enable the preview view switch for local and LAN clients')
    parser.add_argument('--lan-live-port', type=int, help='browser read port for the registered 8829 LAN listener')
    args = parser.parse_args()
    if not 1 <= args.upstream_port <= 65535: parser.error('invalid upstream port')
    if args.lan_live_port is not None and (
        not args.owner_lan or args.port != 8829 or not owner_source(args.host) or args.host == '127.0.0.1'
        or not 1024 <= args.lan_live_port <= 65535 or args.lan_live_port in (args.upstream_port, args.port)
    ):
        parser.error('--lan-live-port requires the dedicated physical LAN preview')

    handler = partial(Preview, directory=str(ROOT))
    try:
        server = PreviewServer((args.host, 4321 if args.port is None else args.port), handler)
    except OSError as error:
        if args.port is not None or (error.errno != errno.EADDRINUSE and getattr(error, 'winerror', None) != 10048):
            raise
        server = PreviewServer((args.host, 0), handler)
    server.daemon_threads = True
    server.upstream_port = args.upstream_port
    server.owner_lan = args.owner_lan
    server.lan_live_port = args.lan_live_port
    print('Preview: http://' + args.host + ':' + str(server.server_port), flush=True)
    server.serve_forever()
