import importlib.util
from io import BytesIO
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch
from urllib.parse import quote, urlsplit
spec = importlib.util.spec_from_file_location('preview', Path(__file__).resolve().parents[1] / 'tools/preview_site.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)
class PreviewOwnerTest(unittest.TestCase):
    def handler(self, path='/__live/home?q=1', method='GET', enabled=True, cookie='', address='127.0.0.1'):
        handler = object.__new__(preview.Preview)
        handler.server = SimpleNamespace(owner_lan=enabled, upstream_port=18793)
        handler.client_address = (address, 1234); handler.path = path; handler.command = method
        handler.headers = {'Host': '127.0.0.1:8829', 'Cookie': cookie}; handler.rfile = BytesIO()
        handler.send_response = Mock(); handler.send_response_only = Mock(); handler.send_error = Mock()
        handler.send_header = Mock(); handler.end_headers = Mock()
        return handler
    def test_sources(self):
        for address in ('192.168.31.5', '127.0.0.1', '192.168.1.5', '10.0.0.2', '100.64.0.1'):
            self.assertEqual(preview.owner_source(address), address in ('192.168.31.5', '127.0.0.1'))
    def test_window_view_header_overrides_legacy_cookie(self):
        for view, cookie, public in (('public', '', True), ('owner', 'wly-preview-view=public', False)):
            handler = self.handler(cookie=cookie); handler.headers['X-Wly-View'] = view
            self.assertEqual(handler.public_view(), public)
        upstream = Mock(); upstream.getresponse.return_value.status = 200
        upstream.getresponse.return_value.read.return_value = b'{}'; upstream.getresponse.return_value.getheaders.return_value = []
        with patch.object(preview, 'HTTPConnection', return_value=upstream):
            handler = self.handler()
            handler.headers.update({'X-Wly-View': 'public', 'X-Cockpit-Device': 'A'*43})
            handler.proxy().close()
            self.assertNotIn('X-Cockpit-Device', upstream.request.call_args.args[3])
            handler.send_header.assert_any_call('X-Wly-Preview-View', 'public')
            handler = self.handler('/__computer/cockpit/open', 'POST')
            handler.headers.update({'X-Wly-View': 'public', 'X-Cockpit-Device': 'A'*43}); handler.proxy().close()
            self.assertEqual(upstream.request.call_args.args[3]['X-Cockpit-Device'], 'A'*43)

    def test_access_status_remains_public_in_owner_mode(self):
        upstream = Mock(); upstream.getresponse.return_value.read.return_value = b'{}'
        upstream.getresponse.return_value.getheaders.return_value = []
        with patch.object(preview, 'HTTPConnection', return_value=upstream):
            handler = self.handler('/__live/access')
            handler.headers.update({'X-Wly-View': 'owner', 'X-Cockpit-Device': 'A'*43})
            handler.proxy().close()
            self.assertNotIn('X-Cockpit-Device', upstream.request.call_args.args[3])
            self.assertNotIn('X-Wly-Preview-View', dict(call.args for call in handler.send_header.call_args_list))

    def test_upstream_decides_viewer_for_every_browser_read(self):
        upstream = Mock(); upstream.getresponse.return_value.getheaders.return_value = []
        cases = ((None, 'public', 'none'), ('A'*43, 'owner', 'ok'),
                 ('B'*43, 'public', 'invalid'), ('malformed', 'public', 'invalid'), ('', 'public', 'none'))
        with patch.object(preview, 'HTTPConnection', return_value=upstream):
            for proof, kind, state in cases:
                status = 200 if proof != 'malformed' else 403
                packet = f'{{"viewer":{{"kind":"{kind}","device":"{state}"}}}}'.encode()
                upstream.getresponse.return_value.status = status
                upstream.getresponse.return_value.read.return_value = packet
                handler = self.handler(address='192.168.31.5')
                handler.headers['X-Wly-View'] = 'owner'
                if proof is not None: handler.headers['X-Cockpit-Device'] = proof
                self.assertEqual(handler.proxy().read(), packet)
                handler.send_response_only.assert_called_once_with(status)
                handler.send_header.assert_any_call('X-Wly-Preview-View', 'owner')
                self.assertEqual(upstream.request.call_args.args[3].get('X-Cockpit-Device'), proof)
            handler = self.handler(method='POST'); handler.proxy(); handler.send_error.assert_called_once_with(405)

    def test_unpaired_loopback_and_home_proxy_get_only_the_formal_public_response(self):
        upstream = Mock()
        reply = upstream.getresponse.return_value
        reply.status = 200
        reply.getheaders.return_value = []
        reply.read.return_value = b'{"viewer":{"kind":"public","device":"none"}}'
        with patch.object(preview, 'HTTPConnection', return_value=upstream):
            for peer, host in (('127.0.0.1', '127.0.0.1:8829'), ('127.0.0.1', 'tailnet.invalid:8829'),
                               ('192.168.31.17', '192.168.31.235:8829')):
                handler = self.handler(address=peer)
                handler.headers['Host'] = host
                self.assertEqual(handler.proxy().read(), reply.read.return_value)
                self.assertNotIn('X-Cockpit-Device', upstream.request.call_args.args[3])

    def test_refused_listener_and_unreachable_backend_are_distinct(self):
        for failure, body in ((ConnectionRefusedError(), preview.NOT_LISTENING), (TimeoutError(), preview.UPSTREAM_UNREACHABLE)):
            upstream = Mock(); upstream.connect.side_effect = failure
            with patch.object(preview, 'HTTPConnection', return_value=upstream):
                handler = self.handler('/__live/screen')
                self.assertEqual(handler.proxy().read(), body)
                handler.send_response.assert_called_once_with(502); upstream.request.assert_not_called()

    def test_home_pair_and_settings_reject_clients_outside_home(self):
        with patch.object(preview, 'HTTPConnection') as upstream:
            upstream.return_value.getresponse.return_value.read.return_value = b'{}'
            upstream.return_value.getresponse.return_value.getheaders.return_value = []
            for route in ('cockpit-device/pair', 'cockpit/automation-settings'):
                handler = self.handler('/__computer/' + route, 'POST', address='192.168.1.5')
                handler.headers.update({'Origin': 'http://127.0.0.1:8829', 'X-Cockpit-Device': 'A'*43})
                handler.proxy().close()
                handler.send_response.assert_called_once_with(403)
            upstream.assert_not_called()

    def test_item_actions_only_forward_device_proof_from_home_view(self):
        host = '192.168.31.235:8829'
        for mode in ('owner', 'public-header', 'public-cookie', 'no-device', 'other-origin', 'other-peer', 'other-host', 'other-listener'):
            handler = self.handler('/__computer/cockpit/actions', 'POST', address='192.168.31.5')
            handler.server.server_address = ('192.168.31.235', 8829)
            handler.server.lan_live_port = None if mode == 'other-listener' else 18829
            handler.headers.update({'Host': host, 'Origin': 'http://' + host, 'X-Cockpit-Device': 'A'*43})
            if mode == 'public-header': handler.headers['X-Wly-View'] = 'public'
            if mode == 'public-cookie': handler.headers['Cookie'] = 'wly-preview-view=public'
            if mode == 'no-device': del handler.headers['X-Cockpit-Device']
            if mode == 'other-origin': handler.headers['Origin'] = 'https://wly0829.cn'
            if mode == 'other-peer': handler.client_address = ('192.168.1.5', 1234)
            if mode == 'other-host': handler.headers.update(Host='other.test:8829', Origin='http://other.test:8829')
            with self.subTest(mode=mode), patch.object(preview, 'HTTPConnection') as upstream:
                upstream.return_value.getresponse.return_value.read.return_value = b'{}'
                upstream.return_value.getresponse.return_value.getheaders.return_value = []
                handler.proxy().close()
                if mode == 'owner':
                    method, path, _, headers = upstream.return_value.request.call_args.args
                    self.assertEqual((method, path), ('POST', '/computer-access/api/cockpit/actions'))
                    self.assertEqual((headers['X-Wly-Cockpit-Home'], headers['X-Cockpit-Device']), ('1', 'A'*43))
                else:
                    handler.send_response.assert_called_once_with(403)
                    upstream.assert_not_called()

    def test_view_switch_and_back(self):
        for back in ('/live/tasks/?q=1#item', 'https://outside.test/', '//outside.test/', '/\\outside.test/', '/live/\r\nX:1', 'relative'):
            self.assertEqual(preview.preview_back('back=' + quote(back, safe='')), back if back == '/live/tasks/?q=1#item' else '/live/')
        self.assertEqual(preview.preview_back(''), '/live/')
        for mode, age in (('public', '31536000'), ('owner', '0')):
            handler = self.handler('/__view/' + mode + '?back=%2Flive%2Ftasks%2F')
            handler.do_GET(); handler.send_header.assert_any_call('Location', '/live/tasks/')
            self.assertIn('Max-Age=' + age, handler.send_header.call_args_list[0].args[1])
        with patch.object(preview.SimpleHTTPRequestHandler, 'do_GET') as ordinary:
            self.handler('/__view/public', enabled=False).do_GET(); ordinary.assert_called_once()

    def test_only_physical_lan_html_advertises_business_listener(self):
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as temp, patch.object(preview, 'ROOT', Path(temp)):
            root = Path(temp)
            (root / 'live').mkdir()
            (root / 'live/index.html').write_text('<head></head>', 'utf8')
            for peer, host, cookie, expected in (
                ('192.168.31.17', '192.168.31.235:8829', '', True),
                ('192.168.31.235', '192.168.31.235:8829', '', True),
                ('127.0.0.1', '127.0.0.1:8829', '', False),
                ('192.168.31.17', 'unapproved.test:8829', '', False),
                ('192.168.31.17', '192.168.31.235:8829', 'wly-preview-view=public', False),
            ):
                handler = self.handler('/live/', address=peer, cookie=cookie)
                handler.directory = temp
                handler.headers['Host'] = host
                handler.server.server_address = ('192.168.31.235', 8829)
                handler.server.lan_live_port = 18829
                with handler.send_head() as body:
                    self.assertEqual(b'wly-lan-live-port' in body.read(), expected)

    def test_home_asset_cache_uses_current_bytes_and_local_view(self):
        from os import utime
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as temp, patch.object(preview, 'ROOT', Path(temp)):
            root = Path(temp)
            script = root / 'live/_lib/live-client.js'
            script.parent.mkdir(parents=True)
            initial = "fetch(url, { cache: 'no-store', credentials: 'omit' })"
            script.write_text(initial, encoding='utf8')
            original = script.stat()
            cdn = 'https://wly0829-img-media-shanghai.cn-shanghai.oss.aliyuncs.com/releases/hash/'
            (root / 'live/index.html').write_text(f'<script src="{cdn}live/_lib/live-client.js"></script>', 'utf8')
            def read(path, address='127.0.0.1'):
                handler = self.handler(path, address=address)
                handler.directory = temp
                with handler.send_head() as body:
                    return body.read().decode(), dict(call.args for call in handler.send_header.call_args_list)
            asset = urlsplit(read('/live/')[0].split('"')[1])
            old = asset._replace(scheme='', netloc='').geturl()
            body, headers = read(old)
            self.assertIn('immutable', headers['Cache-Control'])
            self.assertEqual(body, initial.replace("'omit'", "'same-origin'"))
            untrusted, headers = read(old, '192.168.1.5')
            self.assertEqual((untrusted, headers['Cache-Control']), (initial, 'no-store'))
            updated = initial.replace("'omit'", "'keep'")
            script.write_text(updated, encoding='utf8')
            utime(script, ns=(original.st_atime_ns, original.st_mtime_ns))
            current_info = script.stat()
            fields = ('st_size', 'st_ino', 'st_mtime_ns')
            self.assertEqual(tuple(getattr(current_info, f) for f in fields), tuple(getattr(original, f) for f in fields))
            body, headers = read(old)
            self.assertEqual((body, headers['Cache-Control']), (updated, 'no-store'))
            self.assertNotIn('Cache-Control', read(asset.path)[1])
            current = urlsplit(read('/live/')[0].split('"')[1])
            self.assertNotEqual(current.query, asset.query)
            body, headers = read(current.path + '?' + current.query)
            self.assertEqual(body, updated)
            self.assertIn('immutable', headers['Cache-Control'])
