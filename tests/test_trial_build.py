"""Trial failures must not leave an old page looking like a fresh build."""
import importlib.util, json, tempfile, unittest
from pathlib import Path
from unittest.mock import patch, MagicMock
spec = importlib.util.spec_from_file_location('trial_builder', Path(__file__).resolve().parents[1] / 'scripts/build-site.py')
builder = importlib.util.module_from_spec(spec); spec.loader.exec_module(builder)


class TrialBuildTests(unittest.TestCase):
    def test_render_failure_removes_only_its_old_html_and_continues(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); site = root / 'site'; dist = root / 'dist'; report = root / 'checks.json'
            builder.write(root / 'snapshot/manifest.json', {})
            fixed = site / 'src/pages/cockpit/index.astro'; fixed.parent.mkdir(parents=True); fixed.write_bytes(b'fixed original')
            malformed = root / 'sources/pages/malformed/page.json'; malformed.parent.mkdir(parents=True); malformed.write_text('{', encoding='utf8')
            for name in ('good', 'bad'):
                path = site / 'src/content/pages' / (name + '.md'); path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('---\n' + json.dumps(dict(url='/' + name + '/')) + '\n---\ntext', encoding='utf8')
                builder.write(site / 'src/content/rendered' / (name + '.json'), dict(render_md_sha256='fresh'))
            for name in ('good', 'bad', 'untouched'):
                path = dist / name / 'index.html'; path.parent.mkdir(parents=True); path.write_bytes(b'old')
            def stage(args, **kwargs):
                key = 'CONVERT_PAGE_CHECKS' if 'CONVERT_PAGE_CHECKS' in kwargs['env'] else 'BLOCK_PAGE_CHECKS'
                builder.write(kwargs['env'][key], dict(pages=[dict(page=n, passed=key == 'CONVERT_PAGE_CHECKS' or n != 'bad', errors=[] if n != 'bad' or key == 'CONVERT_PAGE_CHECKS' else [dict(code='overflow', message='too tall')]) for n in args[5:]]))
            def run(*args, **kwargs):
                if args[0] == 'node':
                    self.assertFalse(fixed.exists())
                    path = Path(kwargs['env']['SITE_BUILD_OUT_DIR']) / 'good/index.html'; path.parent.mkdir(); path.write_bytes(b'new')
            with patch.multiple(builder, ROOT=root, SITE=site, SNAPSHOT=root / 'snapshot', verify_typeset_lock=MagicMock(), load=MagicMock(), restore=MagicMock(), markdown_render_sha=lambda p: 'fresh', run=run), patch.object(builder.ArtifactStore, 'restore', return_value={}), patch.object(builder.subprocess, 'run', side_effect=stage):
                result = builder.trial_build('good,bad,malformed', dist, report)
            self.assertEqual([r['passed'] for r in result['pages']], [True, False, False])
            self.assertEqual(result['pages'][2]['errors'][0]['code'], 'route_invalid')
            self.assertEqual(fixed.read_bytes(), b'fixed original')
            self.assertEqual((dist / 'good/index.html').read_bytes(), b'new')
            self.assertFalse((dist / 'bad/index.html').exists())
            self.assertEqual((dist / 'untouched/index.html').read_bytes(), b'old')
