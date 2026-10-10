import importlib.util, tempfile, types, unittest.mock
from pathlib import Path
spec = importlib.util.spec_from_file_location('publisher', Path(__file__).resolve().parents[1]/'site-astro/tools/publish_site.py')
publisher = importlib.util.module_from_spec(spec); spec.loader.exec_module(publisher)
class PublishTests(unittest.TestCase):
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
            for name in ('index.html', 'release-manifest.json', 'release-identity.json'): self.assertEqual((root/name).read_bytes(), (Path(receipt['site_dist']['root'])/name).read_bytes())
