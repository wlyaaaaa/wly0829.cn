"""Integration check: warm and empty-cache builds produce identical release bytes.

Run separately from the fast JS suite: python -B -X utf8 tests/test_incremental_build.py
"""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def inventory(folder):
    return {p.relative_to(folder).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in folder.rglob('*') if p.is_file() and p.name != '.build-receipt.json'}


class IncrementalBuild(unittest.TestCase):
    def test_changed_page_matches_empty_cache_build(self):
        cache = ROOT / '.cache'
        cache.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='build-parity-', dir=cache) as temporary:
            work = Path(temporary)
            def build(output, *options):
                log_path = work / (output.name + '.log')
                try:
                    with log_path.open('w', encoding='utf-8') as log:
                        subprocess.run([sys.executable, '-B', '-X', 'utf8', 'scripts/build-site.py',
                                        '--dist', str(output), *options], cwd=ROOT, stdout=log,
                                       stderr=subprocess.STDOUT, check=True)
                except subprocess.CalledProcessError:
                    print(log_path.read_text(encoding='utf-8')[-5000:])
                    raise
                return json.loads((output / '.build-receipt.json').read_text(encoding='utf-8'))
            incremental, full = work / 'incremental', work / 'full'
            baseline = build(incremental)
            page = ROOT / 'site-v2/live/index.html'
            original = page.read_bytes()
            try:
                untouched = incremental / 'principles/index.html'
                mtime = untouched.stat().st_mtime_ns
                page.write_bytes(original + b'\n<!-- incremental build parity -->\n')
                plain = build(incremental)
                self.assertEqual([p for p in plain['output_changes']['updated'] if p.endswith('.html')], ['live/index.html'])
                self.assertEqual(untouched.stat().st_mtime_ns, mtime)
                page.write_bytes(original + '\n<!-- incremental build parity 龘 -->\n'.encode('utf-8'))
                changed = build(incremental)
                self.assertNotEqual(baseline['files'], changed['files'])
                cold = build(full, '--full', '--cache-dir', str(work / 'empty-cache'))
                self.assertEqual(inventory(incremental), inventory(full))
                again = build(incremental)
                self.assertEqual(inventory(incremental), inventory(full))
                evidence = {'baseline': baseline['seconds'], 'plain_page': plain['seconds'], 'changed_page': changed['seconds'],
                            'cold': cold['seconds'], 'unchanged': again['seconds'],
                            'files': len(inventory(full)), 'hashes_match': True,
                            'plain_page_updated_html': [p for p in plain['output_changes']['updated'] if p.endswith('.html')],
                            'timings': {name: row['timings'] for name, row in
                                        [('plain_page', plain), ('changed_page', changed), ('cold', cold), ('unchanged', again)]}}
                (cache / 'build-parity-result.json').write_text(json.dumps(evidence, ensure_ascii=False, indent=2), encoding='utf-8')
                self.assertLessEqual(plain['seconds'], 60)
                self.assertLessEqual(changed['seconds'], 60)
                self.assertLessEqual(again['seconds'], 60)
            finally:
                page.write_bytes(original)
                for output in (incremental, full):
                    stage = ROOT / '.cache/site-build' / hashlib.sha256(str(output.resolve()).encode()).hexdigest()[:16]
                    self.assertEqual(stage.resolve().parent, (ROOT / '.cache/site-build').resolve())
                    shutil.rmtree(stage, ignore_errors=True)


if __name__ == '__main__':
    unittest.main()
