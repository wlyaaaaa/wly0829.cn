import importlib.util
from http.client import RemoteDisconnected
from pathlib import Path
import unittest
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location('monitor', Path(__file__).parents[1] / 'scripts/cockpit-monitor.py')
monitor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(monitor)


class MonitorClassification(unittest.TestCase):
    def rows(self):
        return [{'name': name, 'http': 200, 'valid': True, 'seconds': 1} for name in ('page', 'api', 'control')]

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

    def test_cockpit_view_shape_is_valid_and_limit_allows_full_payload(self):
        self.assertTrue(monitor.URLS['api'].endswith('?view=cockpit'))
        self.assertTrue(monitor.api_valid({'overview': {}, 'served_at_unix': 1.0})[0])
        self.assertTrue(monitor.api_valid({'host': {}, 'observed_at_unix': 1})[0])
        self.assertFalse(monitor.api_valid({'overview': {}})[0])
        self.assertFalse(monitor.api_valid({'served_at_unix': 1.0})[0])
        self.assertGreater(monitor.MAX_BYTES, 1_200_000)

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


if __name__ == '__main__':
    unittest.main()
