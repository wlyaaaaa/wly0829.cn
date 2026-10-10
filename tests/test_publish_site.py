import importlib.util, tempfile, types, unittest.mock
from pathlib import Path
spec = importlib.util.spec_from_file_location('publisher', Path(__file__).resolve().parents[1]/'site-astro/tools/publish_site.py')
publisher = importlib.util.module_from_spec(spec); spec.loader.exec_module(publisher)
class PublishTests(unittest.TestCase):
    def test_pages_dispatches_main_and_waits_for_returned_run_id(self):
        with unittest.mock.patch.object(publisher, 'command', side_effect=[
                'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42',
                '{"status":"in_progress","conclusion":null}', '{"status":"completed","conclusion":"success"}']) as commands, unittest.mock.patch.object(publisher.time, 'sleep'):
            self.assertEqual(publisher.pages('a'*40, 60), 42)
        self.assertEqual(commands.call_args_list[0].args, ('gh', 'workflow', 'run', 'pages.yml', '--repo', 'wlyaaaaa/wly0829.cn', '--ref', 'main', '-f', 'sha='+'a'*40))
        self.assertEqual(commands.call_args_list[0].kwargs['timeout'], 60)
        for call in commands.call_args_list[1:]:
            self.assertEqual(call.args, ('gh', 'run', 'view', '42', '--repo', 'wlyaaaaa/wly0829.cn', '--json', 'status,conclusion'))
            self.assertGreater(call.kwargs['timeout'], 0)
    def test_pages_rejects_failed_cancelled_and_other_non_success_runs(self):
        for conclusion in ('failure', 'cancelled', 'timed_out', 'skipped', 'neutral'):
            with self.subTest(conclusion=conclusion), unittest.mock.patch.object(publisher, 'command', side_effect=[
                    'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42',
                    publisher.json.dumps({'status': 'completed', 'conclusion': conclusion})]):
                with self.assertRaisesRegex(ValueError, conclusion): publisher.pages('a'*40, 60)
    def test_pages_timeout_uses_the_same_deadline_without_real_sleep(self):
        clock = [0]
        with unittest.mock.patch.object(publisher.time, 'monotonic', side_effect=lambda: clock[0]), unittest.mock.patch.object(publisher.time, 'sleep', side_effect=lambda seconds: clock.__setitem__(0, clock[0]+seconds)), unittest.mock.patch.object(publisher, 'command', side_effect=[
                'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42', '{"status":"queued","conclusion":null}']):
            with self.assertRaisesRegex(TimeoutError, 'run 42'): publisher.pages('a'*40, 1)
    def test_pages_never_guesses_a_run_when_dispatch_returns_no_exact_url(self):
        for result in ('', 'https://github.com/other/repo/actions/runs/42'):
            with self.subTest(result=result), unittest.mock.patch.object(publisher, 'command', return_value=result) as commands:
                with self.assertRaisesRegex(ValueError, 'no run id'): publisher.pages('a'*40, 60)
                self.assertEqual(commands.call_count, 1)
    def test_pages_reports_a_dispatch_command_timeout(self):
        with unittest.mock.patch.object(publisher, 'command', side_effect=publisher.subprocess.TimeoutExpired('gh', 1)):
            with self.assertRaises(publisher.subprocess.TimeoutExpired): publisher.pages('a'*40, 1)
    def test_one_html_zero_resources_and_same_hash_new_key(self):
        old = {'a.js': {'key': 'releases/old/a.js', 'sha256': 'a'}, 'index.html': {'sha256': 'b'}}
        self.assertEqual(set(publisher.delta({'old/a.js': old['a.js'], 'index.html': {'sha256': 'c'}}, old)), {'index.html'})
        self.assertEqual(set(publisher.delta({'a.js': {'key': 'releases/new/a.js', 'sha256': 'a'}}, old)), {'a.js'})
    def test_dry_run_commits_a_local_orphan_without_remote_writes(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)/'dist'; root.mkdir()
            (root/'index.html').write_bytes(b'<h1>fixture</h1>\r\n')
            (root/'a.js').write_bytes(b'console.log(1)')
            publisher.oss.write(root/'release-manifest.json', {'fixture': True, 'release_id': 'fixture', 'files': publisher.oss.inventory(root)})
            publisher.oss.finalize_dist(root)
            scan = Path(temporary)/'scan.json'
            publisher.oss.write(scan, {'fixture': True, 'failures': [], 'dist_files_sha256':
                {path.relative_to(root).as_posix(): publisher.oss.digest(path) for path in root.rglob('*') if path.is_file()}})
            options = types.SimpleNamespace(output=Path(temporary)/'run', dist=root, scan_result=scan, previous_manifest=None, source_commit=None, dry_run=True)
            real = publisher.command
            with unittest.mock.patch.object(publisher.retention, 'predecessor', return_value=None), unittest.mock.patch.object(publisher, 'command', side_effect=lambda *args: '' if 'ls-remote' in args else real(*args)) as commands:
                receipt = publisher.publish(options)
            self.assertEqual((receipt['status'], receipt['site_dist']['parent'], receipt['uploaded_files']), ('dry_run', [], 0))
            self.assertFalse(any('push' in call.args or publisher.CLI in call.args or 'gh' in call.args for call in commands.call_args_list))
            self.assertFalse((Path(receipt['site_dist']['root'])/'.github/workflows/pages.yml').exists())
            for name in ('index.html', 'release-manifest.json', 'release-identity.json'): self.assertEqual((root/name).read_bytes(), (Path(receipt['site_dist']['root'])/name).read_bytes())
