"""Exercise actual preview processes without building or contacting upstreams."""
import http.client
from pathlib import Path
import queue
import socket
import subprocess
import sys
import threading
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class PreviewCliTest(unittest.TestCase):
    def start_preview(self, *args):
        process = subprocess.Popen(
            [sys.executable, '-B', '-u', str(ROOT / 'tools/preview_site.py'), *args],
            cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, encoding='utf-8',
        )
        def cleanup():
            if process.poll() is None:
                process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)
            process.stdout.close()
        self.addCleanup(cleanup)
        lines = queue.Queue()
        reader = threading.Thread(target=lambda: lines.put(process.stdout.readline()), daemon=True)
        reader.start()
        try:
            line = lines.get(timeout=10)
        except queue.Empty:
            self.fail('Preview did not announce readiness within 10 seconds')
        self.assertTrue(line.startswith('Preview: http://127.0.0.1:'), line)
        port = urlsplit(line.removeprefix('Preview: ').strip()).port
        self.assertGreater(port, 0)
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
        try:
            connection.request('HEAD', '/__preview_cli_missing_fixture__')
            response = connection.getresponse()
            self.assertEqual(response.status, 404)
            response.read()
        finally:
            connection.close()
        return port

    def test_default_retains_port_4321_when_available(self):
        with socket.socket() as probe:
            if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
                probe.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
            try:
                probe.bind(('127.0.0.1', 4321))
            except OSError:
                self.skipTest('Port 4321 is already occupied by another process')
        self.assertEqual(self.start_preview(), 4321)

    def test_default_previews_can_run_together(self):
        first = self.start_preview()
        second = self.start_preview()
        self.assertNotEqual(first, second)

    def test_explicit_busy_port_does_not_fall_back(self):
        port = self.start_preview('--port', '0')
        result = subprocess.run(
            [sys.executable, '-B', str(ROOT / 'tools/preview_site.py'), '--port', str(port)],
            cwd=ROOT, capture_output=True, text=True, timeout=10,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn('Preview: ', result.stdout)

    def test_explicit_port_is_preserved(self):
        with socket.socket() as reservation:
            reservation.bind(('127.0.0.1', 0))
            port = reservation.getsockname()[1]
        self.assertEqual(self.start_preview('--port', str(port)), port)


if __name__ == '__main__':
    unittest.main()
