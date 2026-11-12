"""Screen artifacts retain HTML and exact resource bytes across checkouts."""
import json, os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'site-astro/tools'))
from render_cache import ArtifactStore, markdown_render_sha, restore_assets

class ArtifactTests(unittest.TestCase):
    def test_relocated_roundtrip_versions_and_missing_resource(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); store = ArtifactStore(root / 'library')
            site = root / 'source'; work = site / '.cache/blocks'
            md = site / 'src/content/pages/page.md'; md.parent.mkdir(parents=True)
            md.write_text('---\n{"source":{}}\n---\n正文', encoding='utf8')
            assets = {'/assets/_source/title.png': b'original pixels',
                      '/assets/font.woff2': b'font', '/_living/page/config.json': b'{"version":1}'}
            result = {'html': '<img src="/assets/_source/title.png">', 'assets': {}}
            for url, body in assets.items():
                path = work / '_assets' / url.lstrip('/'); path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(body); result['assets'][url] = store.sha(path)
            def save(key):
                (work / '_cache.json').write_text(json.dumps({key: result}), encoding='utf8')
                (work / '_index.json').write_text(json.dumps({'page/one-h': {'key': key}}), encoding='utf8')
                return store.save(site, work)
            rendered = site / 'src/content/rendered/page.json'; rendered.parent.mkdir(parents=True)
            rendered.write_bytes(json.dumps({'render_md_sha256': markdown_render_sha(md), 'screens': [result]},
                                           ensure_ascii=False).encode('utf8') + b'\r\n')
            first = save('first')
            config = work / '_assets/_living/page/config.json'; config.write_bytes(b'{"version":2}')
            result['assets']['/_living/page/config.json'] = store.sha(config)
            second = save('second'); self.assertNotEqual(first['snapshot'], second['snapshot'])
            target = root / 'fresh'; target_md = target / 'src/content/pages/page.md'
            target_md.parent.mkdir(parents=True); target_md.write_bytes(md.read_bytes())
            fresh = target / '.cache/blocks'
            self.assertEqual(store.restore(target, fresh), {'screens': 2, 'missing': 0, 'rendered': 1})
            self.assertEqual((target / 'src/content/rendered/page.json').read_bytes(), rendered.read_bytes())
            self.assertEqual(ArtifactStore(store.root, first['snapshot']).manifest()['screens'].keys(), {'first'})
            (target / 'public/_living/page/config.json').write_bytes(b'local current')
            store.restore(target, fresh); self.assertEqual((target / 'public/_living/page/config.json').read_bytes(), b'local current')
            cache = json.loads((fresh / '_cache.json').read_text('utf8'))
            with patch.dict(os.environ, SITE_ARTIFACT_STORE=str(store.root)):
                restore_assets(cache['first'], fresh, target / 'public', store.sha)
                self.assertEqual((target / 'public/_living/page/config.json').read_bytes(), assets['/_living/page/config.json'])
                restore_assets(cache['second'], fresh, target / 'public', store.sha)
                self.assertEqual((target / 'public/_living/page/config.json').read_bytes(), config.read_bytes())
            for url in ('/assets/_source/title.png', '/assets/font.woff2'):
                self.assertEqual((fresh / '_assets' / url.lstrip('/')).read_bytes(), assets[url])
            self.assertTrue((store.root / 'manifests' / (first['snapshot'] + '.json')).is_file())
            font_sha = result['assets']['/assets/font.woff2']; store.object(font_sha).write_bytes(b'corrupt')
            (fresh / '_assets/assets/font.woff2').unlink(); (target / 'public/assets/font.woff2').unlink()
            miss = ArtifactStore(store.root).restore(target, fresh)
            self.assertEqual(miss['missing'], 2); self.assertEqual(json.loads((fresh / '_cache.json').read_text('utf8')), {})
            with self.assertRaises(ValueError): store.put(b'wrong bytes', '0' * 64)
            self.assertFalse((store.objects / ('0' * 64)).exists())
            repaired = ArtifactStore(store.root); repaired.put(b'font', font_sha)
            self.assertEqual(repaired.object(font_sha).read_bytes(), b'font')
