"""公开检查须区分页命中与共用文件命中。"""
from pathlib import Path
import json
import sys
import unittest
from unittest.mock import patch
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import update_trial
from update_trial import public_owner


class PublicOwnershipTests(unittest.TestCase):
    def test_removed_number_proof_is_skipped_and_live_number_still_needs_display(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); source = root/'sources/pages/demo/page.json'; source.parent.mkdir(parents=True)
            source.write_text(json.dumps(dict(screens=[dict(text='总数 42 项。')])), encoding='utf8')
            md = root/'site-astro/src/content/pages/demo.md'; md.parent.mkdir(parents=True)
            md.write_text('---\n{}\n---\n', encoding='utf8')
            target = root/'dist/demo/index.html'; target.parent.mkdir(parents=True)
            target.write_text('<main>旧状态句已删除。</main>', encoding='utf8')
            retired = dict(id='old', page='demo', field='screens[0].text', page_pattern='上次 (99) 项',
                           retired_reason='随句删除', retirement_dependencies=[dict(page='other', record_id='peer')])
            live = dict(id='live', page='demo', field='screens[0].text', page_pattern='总数 (42) 项')
            proofs = [dict(record_id=i, value=v, locator=dict(field='screens[0].text')) for i, v in [('old', '99'), ('live', '42')]]
            errors = update_trial.number_errors(root, root/'dist', 'demo', [retired, live], proofs)
            self.assertEqual(len(errors), 1)
            self.assertTrue(errors[0]['message'].startswith('live：'))
            target.write_text('<main>总数 42 项。</main>', encoding='utf8')
            self.assertEqual(update_trial.number_errors(root, root/'dist', 'demo', [retired, live], proofs), [])
            self.assertEqual(retired['retirement_dependencies'], [dict(page='other', record_id='peer')])

    def test_author_render_and_dist_findings_stay_with_the_page(self):
        root = Path.cwd(); dist = root / 'dist'; routes = dict(alpha='/skills/alpha/', beta='/beta.html')
        for file in ['sources/pages/alpha/page.json', 'sources/assets/alpha/manifest.jsonl',
                     'site-astro/src/content/pages/alpha.md', 'site-astro/src/content/rendered/alpha.json',
                     'dist/skills/alpha/index.html']:
            self.assertEqual(public_owner(dict(file=file), root, dist, routes), 'alpha')
        self.assertEqual(public_owner(dict(file='dist/beta.html'), root, dist, routes), 'beta')
        for file in ['scripts/shared.js', 'config/example.json', 'docs/example.md', 'dist/shared.js',
                     'sources/pages/another/page.json']:
            self.assertIsNone(public_owner(dict(file=file), root, dist, routes))

    def test_number_uses_draft_rebinding_even_when_author_is_external(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); md = root / 'site-astro/src/content/pages/demo.md'; md.parent.mkdir(parents=True)
            md.write_text('---\n{}\n---\n', encoding='utf8')
            target = root / 'dist/demo/index.html'; target.parent.mkdir(parents=True); target.write_text('<main>帮助你处理。</main>', encoding='utf8')
            record = dict(id='total', page='demo', field='screens[0].text', page_pattern=r'总数 (42) 项')
            proof = dict(record_id='total', value='42', locator=dict(file='scripts/demo.json', field='text', start=3, end=5))
            with patch.object(update_trial, 'bound_json', return_value=dict(screens=[dict(text='帮助你处理。总数 42 项。')])):
                self.assertEqual(update_trial.number_errors(root, root/'dist', 'demo', [record], [proof])[0]['code'], 'number_not_displayed')
                target.write_text('<main>帮助你处理。总数 42 项。</main>', encoding='utf8')
                self.assertEqual(update_trial.number_errors(root, root/'dist', 'demo', [record], [proof]), [])
            record = dict(id='total', page='demo', page_number='n-total')
            with patch.object(update_trial, 'bound_json', return_value=dict(registry=dict(numbers=[dict(id='n-total', text='总数 42 项。')]))):
                self.assertEqual(update_trial.number_errors(root, root/'dist', 'demo', [record], [proof]), [])
