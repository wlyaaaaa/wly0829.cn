import json, runpy, tempfile, unittest
from pathlib import Path
class CockpitLinksTest(unittest.TestCase):
    def test_project_defaults_and_explicit_links(self):
        with tempfile.TemporaryDirectory() as folder:
            for name in ('agents', 'chinese-asr'):
                p = Path(folder)/name/'content.js'; p.parent.mkdir(); p.write_text('window.PAGE_DATA = '+json.dumps({'project':[{'buttons':[{'label':'看实况','href':''},{'label':'看实况','href':'/live/power/'}]}]}), encoding='utf-8')
            self.assertEqual(runpy.run_path(str(Path(__file__).resolve().parents[1]/'scripts/build-site.py'))['connect_cockpit'](Path(folder)), 2)
            for name, target in [('agents','agents'), ('chinese-asr','chineseasr')]:
                self.assertEqual([b['href'] for b in json.loads((Path(folder)/name/'content.js').read_text(encoding='utf-8').split(' = ',1)[1])['project'][0]['buttons']], ['/live/project/?id='+target, '/live/power/'])
