import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from importlib.util import module_from_spec, spec_from_file_location
from site_font_text_test import ASSEMBLY


class ButtonConfigTests(unittest.TestCase):
    def test_only_illustrated_live_links_are_added_to_covers(self):
        path = Path(__file__).resolve().parents[1] / 'scripts/build-site.py'
        spec = spec_from_file_location('build_site', path)
        build = module_from_spec(spec)
        spec.loader.exec_module(build)
        label = '看本项目实况'
        explicit = {'label': '看实况', 'href': '/live/project/?id=timeaudit'}
        cases = [('chinese-asr', {label: ['cover.webp', '8rem']}, [],
                  [{'label': label, 'href': '/live/project/?id=chineseasr'}]),
                 ('github-index', {}, [], []),
                 ('timeaudit', {}, [explicit], [explicit])]
        with tempfile.TemporaryDirectory() as tmp:
            paths = []
            for slug, art, buttons, expected in cases:
                folder = Path(tmp) / slug
                folder.mkdir()
                (folder / 'project.html').touch()
                source = folder / 'content.js'
                source.write_text('window.PROJECT_CONFIG = ' + json.dumps({'buttonArt': art}) + ';\n'
                                  'window.PAGE_DATA = ' + json.dumps({'project': [{'buttons': buttons}]}),
                                  encoding='utf-8')
                paths.append((source, expected))
            self.assertEqual(build.connect_cockpit(Path(tmp)), 1)
            for source, expected in paths:
                cards = json.loads(source.read_text('utf-8').split('window.PAGE_DATA = ')[1])['project']
                self.assertEqual(cards[0]['buttons'], expected)

    def test_project_config_uses_content_thumbnails(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            web, site = root / 'web', root / 'site'
            (web / '公用').mkdir(parents=True)
            (web / '公用/button-art.js').write_text("document.querySelectorAll('.pill')")
            (web / '公用/page-loader.js').write_text('')
            (root / '项目页配页眉.css').write_text('')
            table = root / '归属表.md'
            table.write_text('## 技能表\n\n| 状态 |\n| --- |\n', encoding='utf-8')
            project = web / 'demo'
            project.mkdir()
            (project / 'project.html').write_text('<head></head><body data-page="project"><header class="site-header"></header></body>')
            config = {'buttonArt': {'go': ['original.webp', '10rem']},
                      'detailArt': ['detail.webp', '12rem'], 'title': '保留'}
            sections = {'总览': {'slug': 'project'}}
            (project / 'project.json').write_text(json.dumps({**config, 'sections': sections}), encoding='utf-8')
            (project / 'content.js').write_text(
                'window.PROJECT_CONFIG = ' + json.dumps(config) + ';\nwindow.PAGE_DATA = {"project":[{"id":"project-01","title":"Cover","image":"cover.webp","width":48,"height":32,"buttons":[],"detail":[]}]};',
                encoding='utf-8')
            def thumbnail(folder, value):
                value[0] = 'button-' + value[0]
            with patch.multiple(ASSEMBLY, WEB=web, SITE=site, MATERIAL=root, TABLE=table), \
                    patch.object(ASSEMBLY, 'button_thumbnail', thumbnail):
                ASSEMBLY.build_project_pages({'demo': [{'地址': '/demo/project.html', '种类': '项目', '它是什么': '示例项目'}]})
            actual = json.loads((site / 'demo/project.json').read_text(encoding='utf-8'))
            self.assertEqual(actual, {'buttonArt': {'go': ['button-original.webp', '10rem']},
                                     'detailArt': ['button-detail.webp', '12rem'], 'title': '保留', 'sections': sections})
            runtime, _ = json.JSONDecoder().raw_decode(
                (site / 'demo/content.js').read_text(encoding='utf-8').split(' = ', 1)[1])
            self.assertEqual(runtime['buttonArt']['go'][0], 'assets/buttons/button-original.webp')
            self.assertEqual(runtime['detailArt'][0], 'assets/buttons/button-detail.webp')
