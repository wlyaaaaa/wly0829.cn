import importlib.util
from http.client import RemoteDisconnected
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import unittest
import tempfile
from threading import Thread
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location('monitor', Path(__file__).parents[1] / 'scripts/cockpit-monitor.py')
monitor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(monitor)


class MonitorClassification(unittest.TestCase):
    def rows(self):
        return [{'name': name, 'http': 200, 'valid': True, 'seconds': 1} for name in ('page', 'api', 'control')]

    def envelope(self, **changes):
        at = monitor.datetime.now(monitor.timezone.utc).isoformat()
        return dict(v=1, seq=1, rev='public-home-1', at=at, now=at, data=dict(screen={}),
                    viewer=dict(kind='public', device='none'), link=dict(state='online', basis='response')) | changes

    def test_local_slowness_never_becomes_website_failure(self):
        rows = self.rows()
        rows[0].update(http=503)
        rows[2]['seconds'] = 40
        self.assertEqual(monitor.verdict(rows)[0], 'unknown')
        rows[2]['seconds'] = 1
        rows[0].update(http=200, seconds=40)
        self.assertEqual(monitor.verdict(rows)[0], 'unknown')

    def test_response_failure_and_stale_data_stay_distinct(self):
        rows = self.rows()
        rows[0]['http'] = 503
        self.assertEqual(monitor.verdict(rows)[0], 'failed')
        rows[0]['http'] = 200
        rows[1]['valid'] = False
        self.assertEqual(monitor.verdict(rows)[0], 'failed')
        rows[1]['valid'] = True
        rows[1]['fresh'] = False
        self.assertEqual(monitor.verdict(rows)[0], 'unknown')
        rows[1].pop('fresh')
        rows[1]['error'] = 'TimeoutError'
        self.assertEqual(monitor.verdict(rows)[0], 'unknown')

    def test_live_page_and_envelope(self):
        self.assertTrue(monitor.URLS['api'].endswith('/live/v1/home'))
        self.assertTrue(monitor.page_valid((Path(__file__).parents[1] / 'site-v2/live/index.html').read_bytes()))
        self.assertFalse(monitor.page_valid(b'<script>const u=new URL("/live/",location.href);location.replace(u.href)</script>'))
        self.assertFalse(monitor.page_valid(b'<html>unrelated</html>'))
        value = self.envelope()
        self.assertTrue(monitor.api_valid(value)[0])
        for bad in ({}, dict(value, at='bad'), dict(value, data={}), dict(value, v=2), dict(value, v=True)):
            self.assertFalse(monitor.api_valid(bad)[0])
        self.assertGreater(monitor.MAX_BYTES, 1_200_000)

    def test_build_injects_one_beacon_and_skips_cockpit_redirect(self):
        spec = importlib.util.spec_from_file_location('build', Path(__file__).parents[1] / 'scripts/build-site.py')
        build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)
        runtime = build.load('runtime', 'site-astro/tools/build_runtime.py')
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            for route in ('live', 'cockpit'):
                (root / route).mkdir(); (root / route / 'index.html').write_text('<html><body></body></html>', encoding='utf-8')
            build.controls(root)
            for _ in range(2): build.visitors(root, runtime, {'cockpit/index.html': '/live/'})
            self.assertEqual((root / 'live/index.html').read_text().count('data-site-visitors'), 1)
            self.assertNotIn('data-site-visitors', (root / 'cockpit/index.html').read_text())
            for route, target in [('cv/', '/'), ('cv/live/', '/live/')]:
                page = (root / route / 'index.html').read_text('utf-8')
                self.assertIn('name="robots" content="noindex"', page)
                self.assertIn(f'<noscript><meta http-equiv="refresh" content="0;url={target}">', page)
                self.assertNotIn('https://wly0829.cn/' + route, (root / 'sitemap.xml').read_text('utf-8'))

    def test_live_probe_freshness(self):
        at = monitor.datetime.now(monitor.timezone.utc).isoformat()
        for stamp, link, fresh in ((at, 'online', True), ('2000-01-01T00:00:00+00:00', 'online', False), (at, 'offline', True)):
            response = MagicMock(status=200); response.__enter__.return_value = response
            response.read.return_value = json.dumps(self.envelope(at=stamp, link=dict(state=link, basis='response'))).encode()
            with patch.object(monitor, 'urlopen', return_value=response): row = monitor.probe(('api', monitor.URLS['api']))
            self.assertTrue(row['valid']); self.assertIs(row['fresh'], fresh)
            rows = self.rows(); rows[1] = row
            if link == 'offline':
                self.assertEqual(row['link_state'], 'offline')
                self.assertEqual(monitor.verdict(rows)[0], 'unknown')
                self.assertIn('回源连接不可用', monitor.verdict(rows)[1])
                self.assertNotIn('过期', monitor.verdict(rows)[1])

    def test_warming_and_paused_require_complete_expected_packets(self):
        at = monitor.datetime.now(monitor.timezone.utc).isoformat()
        value = dict(v=1, seq=0, rev='public-home-0', at=None, now=at, data=None, q='warming',
                     viewer=dict(kind='public', device='none'), link=dict(state='online', seen=at, since=None, basis='response'))
        cases = [(202, value, True), (200, value, False), (503, value, False)]
        cases += [(202, {k: v for k, v in value.items() if k != key}, False) for key in value]
        cases += [(202, dict(value, **change), False) for change in [dict(q='ok'), dict(data={}), dict(seq=True), dict(now='bad'), dict(viewer={}), dict(link={})]]
        paused = dict(error='live_public_paused', text='访客读取暂停开放', now=at)
        cases += [(503, paused, True), (500, paused, False), (200, paused, False)]
        cases += [(503, dict(paused, **change), False) for change in [dict(error='other'), dict(now='bad'), dict(now='2026-11-17T10:00:00')]]
        cases += [(503, {k: v for k, v in paused.items() if k != 'now'}, False)]
        for status, packet, valid in cases:
            with self.subTest(status=status, packet=packet):
                response = MagicMock(status=status); response.__enter__.return_value = response
                response.read.return_value = json.dumps(packet).encode()
                with patch.object(monitor, 'urlopen', return_value=response): row = monitor.probe(('api', monitor.URLS['api']))
                self.assertIs(row['valid'], valid); self.assertNotIn('error', row)
                rows = self.rows(); rows[1] = row
                self.assertEqual(monitor.verdict(rows)[0], 'unknown' if valid else 'failed')
                if row.get('paused'): self.assertEqual(monitor.verdict(rows)[1], '访客读取暂停开放')
        response = MagicMock(status=503); response.__enter__.return_value = response; response.read.return_value = json.dumps(paused).encode()
        with patch.object(monitor, 'urlopen', return_value=response): legacy = monitor.probe(('api', monitor.URLS['api']), legacy=True)
        self.assertFalse(legacy['valid']); self.assertFalse(legacy['paused'])

    def test_disconnect_reconnects_and_uses_successful_request_latency(self):
        response = MagicMock(status=200)
        response.__enter__.return_value = response
        response.read.return_value = b'User-agent: *'
        with patch.object(monitor, 'urlopen', side_effect=[RemoteDisconnected(), response]) as opened:
            row = monitor.probe(('control', monitor.URLS['control']))
        self.assertEqual(opened.call_count, 2)
        self.assertEqual(row['attempts'][0]['error'], 'RemoteDisconnected')
        self.assertEqual(row['http'], 200)
        self.assertNotIn('error', row)
        rows = self.rows()
        rows[2].update(row, seconds=20, request_seconds=1)
        self.assertEqual(monitor.verdict(rows)[0], 'success')

    def test_transport_retries_are_bounded_and_http_errors_are_not_retried(self):
        with patch.object(monitor, 'urlopen', side_effect=RemoteDisconnected()) as opened:
            row = monitor.probe(('page', monitor.URLS['page']))
        self.assertEqual(opened.call_count, 3)
        self.assertEqual(row['error'], 'RemoteDisconnected')
        response = MagicMock(status=503)
        response.__enter__.return_value = response
        response.read.return_value = b'Unavailable'
        with patch.object(monitor, 'urlopen', return_value=response) as opened:
            row = monitor.probe(('page', monitor.URLS['page']))
        self.assertEqual(opened.call_count, 1)
        self.assertEqual(row['http'], 503)

    def test_registry_switch_and_http_failures(self):
        packet, page, status = {}, b'', 200
        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                api = self.path.startswith('/computer-access/')
                body = json.dumps(packet).encode() if api else b'User-agent: *' if self.path == '/robots.txt' else page
                self.send_response(status if api else 200); self.end_headers(); self.wfile.write(body)
            def log_message(self, *args): pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = Thread(target=server.serve_forever, daemon=True); thread.start()
        try:
            with tempfile.TemporaryDirectory() as folder:
                registry = Path(folder) / 'links.json'
                for mode in ('cockpit', 'live', 'cockpit'):
                    registry.write_text(json.dumps(dict(website=dict(home='https://wly0829.cn/' + mode + '/'))), encoding='utf-8')
                    urls, legacy = monitor.monitor_urls(registry)
                    self.assertEqual(legacy, mode == 'cockpit')
                    self.assertEqual(urls['api'], 'https://live.wly0829.cn/computer-access/' + ('state?view=cockpit' if legacy else 'live/v1/home'))
                    for broken in ('none', 'http500', 'missing', 'page', 'stale'):
                        packet = dict(host={}, served_at_unix=monitor.time.time()) if legacy else self.envelope()
                        page = b'<div id="page-data">cockpit-01</div>' if legacy else b'<body class="page--live"><script src="live-client.js"></script>'
                        status = 500 if broken == 'http500' else 200
                        if broken == 'missing': packet = {}
                        if broken == 'page': page = b'<script>location.replace("/live/")</script>'
                        if broken == 'stale': packet.update(served_at_unix=0) if legacy else packet.update(at='2000-01-01T00:00:00+00:00')
                        rows = [monitor.probe((name, 'http://127.0.0.1:' + str(server.server_port) + url.split('.cn', 1)[1]), legacy=legacy) for name, url in urls.items()]
                        self.assertEqual(monitor.verdict(rows)[0], 'success' if broken == 'none' else 'unknown' if broken == 'stale' else 'failed', (mode, broken, rows))
        finally:
            server.shutdown(); thread.join(); server.server_close()


if __name__ == '__main__':
    unittest.main()
