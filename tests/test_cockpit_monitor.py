import importlib.util
from pathlib import Path
import unittest

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


if __name__ == '__main__':
    unittest.main()
