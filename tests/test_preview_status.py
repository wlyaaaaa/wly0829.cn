import importlib.util
import gzip
from io import BytesIO
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import threading
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('preview_site', Path(__file__).resolve().parents[1] / 'tools/preview_site.py')
preview = importlib.util.module_from_spec(spec)
PROXIES = {name: 'http://127.0.0.1:1' for name in ('HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY')}
PROXIES['NO_PROXY'] = ''
with patch.dict(os.environ, PROXIES): spec.loader.exec_module(preview)


class PreviewStatusTest(unittest.TestCase):
    def test_direct_fallback_and_invalid_json(self):
        self.assertEqual(preview.STATUS_ENDPOINTS, ('https://mcp.wly0829.cn/computer-access/api/status', 'https://live.wly0829.cn/computer-access/state'))
        seen = []
        class Upstream(BaseHTTPRequestHandler):
            def log_message(self, *args): pass
            def do_GET(self):
                seen.append((self.path, self.headers.get('X-Cockpit-Device'), self.headers.get('Accept-Encoding')))
                self.send_response(503 if self.path.startswith('/mcp-error') else 200)
                compressed = self.path.startswith(('/live-ok', '/mcp-truncated', '/mcp-corrupt'))
                if compressed: self.send_header('Content-Encoding', 'gzip')
                self.end_headers()
                body = gzip.compress(b'{"host":{},"personal_data":{}}') if self.path.startswith('/live-ok') else b'{'
                if self.path.startswith('/mcp-truncated'): body = b'\x1f\x8b'
                self.wfile.write(body)
        server = ThreadingHTTPServer(('127.0.0.1', 0), Upstream)
        thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
        base = 'http://127.0.0.1:' + str(server.server_port)
        try:
            with patch.dict(os.environ, PROXIES):
                for bad in ('/mcp-error', '/mcp-bad', '/mcp-truncated', '/mcp-corrupt'):
                    with patch.object(preview, 'STATUS_ENDPOINTS', (base + bad, base + '/live-ok')):
                        self.assertIn(b'"personal_data"', preview.read_status('?view=cockpit', {'X-Cockpit-Device': 'A' * 43}))
                    self.assertEqual(seen[-2:], [(bad + '?view=cockpit', 'A' * 43, 'gzip'), ('/live-ok?view=cockpit', 'A' * 43, 'gzip')])
                with patch.object(preview, 'STATUS_ENDPOINTS', (base + '/bad', base + '/bad')):
                    with self.assertRaises(ValueError): preview.read_status('', {})
        finally:
            server.shutdown(); server.server_close(); thread.join()

    def test_query_device_and_no_store(self):
        for device in ('A' * 43, 'invalid'):
            handler = object.__new__(preview.Preview)
            handler.path = '/__status?view=cockpit&refresh=1'; handler.headers = {'X-Cockpit-Device': device}
            handler.wfile = BytesIO(); outgoing = []
            handler.send_response = lambda code: self.assertEqual(code, 200)
            handler.send_header = lambda name, value: outgoing.append((name, value))
            handler.end_headers = lambda: None
            with patch.object(preview, 'read_status', return_value=b'{"host":{}}') as read:
                handler.do_GET()
            query, headers = read.call_args.args
            self.assertEqual(query, '?view=cockpit&refresh=1')
            self.assertEqual(headers.get('X-Cockpit-Device'), device if len(device) == 43 else None)
            self.assertIn(('Cache-Control', 'no-store'), outgoing)
            self.assertEqual(handler.wfile.getvalue(), b'{"host":{}}')
