"""Font coverage, disjoint live shards and the actual YaHei UI collection face."""
import importlib.util
import hashlib
from pathlib import Path
import tempfile
import unittest

from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'site-v2/site-assembly/素材/字体'
SPEC = importlib.util.spec_from_file_location('site_font_subset', ROOT / 'site-v2/site-assembly/font-subset.py')
FONT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(FONT)


class FontSubsetTests(unittest.TestCase):
    def test_fixed_source_prefers_local_and_restores_only_registered_bytes(self):
        with tempfile.TemporaryDirectory(prefix='font-source-', dir=ROOT / '.cache') as directory:
            local = Path(directory) / 'fixed'
            local.mkdir()
            source = Path(directory) / 'WindowsApps/Microsoft.WindowsTerminal_1.0_x64/CascadiaMono.ttf'
            source.parent.mkdir(parents=True)
            registered = b'fixed font bytes'
            record = dict(file=source.name, source=str(source), sha256=hashlib.sha256(registered).hexdigest())
            target = local / source.name
            target.write_bytes(registered)
            source.write_bytes(b'upgraded bytes')
            self.assertEqual(target, FONT.fixed_source(record, local))
            self.assertEqual(registered, target.read_bytes())
            target.unlink()
            source.write_bytes(registered)
            self.assertEqual(target, FONT.fixed_source(record, local))
            self.assertEqual(registered, target.read_bytes())
            target.unlink()
            source.write_bytes(b'upgraded bytes')
            alternative = source.parent.with_name('Microsoft.WindowsTerminal_2.0_x64') / source.name
            alternative.parent.mkdir()
            alternative.write_bytes(registered)
            self.assertEqual(target, FONT.fixed_source(record, local))
            self.assertEqual(registered, target.read_bytes())
            target.write_bytes(b'local drift')
            with self.assertRaises(ValueError): FONT.fixed_source(record, local)
            self.assertEqual(b'local drift', target.read_bytes())
            target.unlink()
            alternative.write_bytes(b'other upgraded bytes')
            with self.assertRaises(ValueError) as failure: FONT.fixed_source(record, local)
            for value in (source.name, record['sha256'], str(source)):
                self.assertIn(value, str(failure.exception))
            self.assertFalse(target.exists())

    def test_live_shards_cover_each_source_without_overlap(self):
        for weight in ('Medium', 'Bold', 'Black'):
            with self.subTest(weight=weight), TTFont(SOURCES / f'HarmonyOS_Sans_SC_{weight}.ttf') as font:
                available = set(font.getBestCmap())
                parts = FONT.partition(available, set(map(ord, '界面正文0123456789')) | {0x10FFFF})
                union = set()
                for name, points in parts.items():
                    self.assertFalse(union & points, name)
                    union.update(points)
                self.assertEqual(available, union)
                self.assertEqual(parts['core'], available & set(map(ord, '界面正文0123456789')))
                extra_core = next(iter(available - parts['core']))
                changed = FONT.partition(available, parts['core'] | {extra_core})
                for name in parts:
                    if name not in ('core', f'u{extra_core // 128:04x}'):
                        self.assertEqual(parts[name], changed[name], name)

    def test_bidi_closure_keeps_mirror_glyph_without_overlapping_cmap(self):
        source = SOURCES / 'consola.ttf'
        with TTFont(source) as original:
            mirror = RecordingPen()
            original.getGlyphSet()[original.getBestCmap()[0x2264]].draw(mirror)
        with tempfile.TemporaryDirectory(prefix='font-bidi-', dir=ROOT / '.cache') as directory:
            target, points = FONT.build_font(source, '≥', Path(directory))
            self.assertEqual({0x2265}, points)
            with TTFont(target) as font:
                self.assertEqual({0x2265}, set(font.getBestCmap()))
                outlines = []
                for glyph in font.getGlyphSet().values():
                    pen = RecordingPen(); glyph.draw(pen); outlines.append(pen.value)
                self.assertIn(mirror.value, outlines)

    def test_ttc_selects_ui_and_subset_keeps_exact_cmap_and_cache(self):
        with tempfile.TemporaryDirectory(prefix='font-test-', dir=ROOT / '.cache') as directory:
            cache = Path(directory)
            requested = set(map(ord, '中文CPU012℃'))
            target, cmap = FONT.build_font(SOURCES / 'msyhbd.ttc', requested | {0x10FFFF}, cache, 1)
            with TTFont(target) as font:
                self.assertEqual('Microsoft YaHei UI', font['name'].getDebugName(1))
                self.assertEqual(requested, set(font.getBestCmap()))
                self.assertEqual(700, font['OS/2'].usWeightClass)
            self.assertEqual(requested, cmap)
            timestamp = target.stat().st_mtime_ns
            self.assertEqual((target, cmap), FONT.build_font(SOURCES / 'msyhbd.ttc', requested, cache, 1))
            self.assertEqual(timestamp, target.stat().st_mtime_ns)
            self.assertEqual('U+20-22,U+41,U+4E00-4E01', FONT.unicode_range({32, 33, 34, 65, 0x4E00, 0x4E01}))


if __name__ == '__main__':
    (ROOT / '.cache').mkdir(exist_ok=True)
    unittest.main()
