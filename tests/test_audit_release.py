"""The repair generation keeps rollback bytes and never hides inventory drift."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

scripts = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('audit_release', scripts / 'prepare-audit-release.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
POLICY_UNAVAILABLE = bool(os.environ.get('CI')) and not (Path(__file__).resolve().parents[1] / '.publish/private/rule-public-policy.json').is_file()

class AuditRelease(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='audit-release-test-')
        self.root = Path(self.temp.name)
        self.baseline = self.root / 'baseline'
        self.candidate = self.root / 'candidate'
        for folder in (self.baseline, self.candidate):
            folder.mkdir()
            (folder / 'index.html').write_text('<h1>原稿</h1>', encoding='utf8')
            (folder / '404.html').write_text('<h1>没找到</h1>', encoding='utf8')
            (folder / 'app.js').write_text('void 0;', encoding='utf8')
        h = audit.module('hybrid-release')
        files = h.inventory(self.baseline)
        manifest = {
            'schema': 'wly.hybrid-release.v1', 'files': files,
            'release_id': audit.hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
            'routes': ['/', '/404.html'], 'baseline_files': files,
            'accepted_pages': {}, 'temporary_href_mappings': [],
        }
        h.write(self.baseline / h.MANIFEST, manifest)

    def tearDown(self):
        self.temp.cleanup()

    def test_public_html_preserves_authored_paths_and_escaped_placeholders(self):
        pub=audit.module('audit-page-publication')
        original='<p>新目录 V:\\Personal\\Projects\\&lt;name&gt;，再继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),original)
        original='<p title="先读 E:\\Fixture\\A&amp;B.txt。">先读 E:\\Fixture\\A&amp;B.txt。继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),original)

if __name__ == '__main__':
    unittest.main()
