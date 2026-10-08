"""Numbers and model choices come from their owning inputs, including typed links."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'src/typeset'))
from engine import content


class ContentBindings(unittest.TestCase):
    def test_source_change_updates_scale_and_named_model_without_editing_the_page(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            def write(relative, value):
                target=root/relative; target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(json.dumps(value, ensure_ascii=False), encoding='utf8')
                return target
            one={'kind':'project','status':'常用','public':True,'registry':{'features':[{}]}}
            two={'kind':'frozen','status':'冻结','public':False,'registry':{'features':[{},{}]}}
            write('sources/pages/one/page.json', one); write('sources/pages/two/page.json', two)
            roster={'updated_beijing_date':'2026-10-05','routing':{'scenarios':[{'scenario':'生图','choose':'Luna "low"\n落盘'}]}}
            write('config/model-roster.json', roster)
            page=write('sources/pages/index/page.json', {'kind':'index','text':'共 {{scale.total}}，公开 {{scale.public}}，功能 {{scale.features}}；{{roster.routing.scenarios.生图.choose}}；{{roster.updated_beijing_date}}'})
            with patch.object(content, '__file__', str(root/'src/typeset/engine/content.py')):
                self.assertEqual(content.bound_json(page)['text'], '共 2，公开 1，功能 3；Luna "low"\n落盘；2026-10-05')
                two['registry']['features'].append({}); write('sources/pages/two/page.json', two)
                roster['routing']['scenarios'].insert(0, {'scenario':'写代码','choose':'Sol'}); write('config/model-roster.json', roster)
                self.assertEqual(content.bound_json(page)['text'], '共 2，公开 1，功能 4；Luna "low"\n落盘；2026-10-05')

    def test_story_links_remain_a_list_and_missing_fact_cannot_publish_a_placeholder(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory); (root/'scripts').mkdir()
            links=[{'text':'真实入口','href':'/projects/one/#use'}]
            (root/'scripts/how-demo-data.json').write_text(json.dumps({'stories':[{'detail_screens':[{'links':links}]}]}), encoding='utf8')
            page=root/'page.json'; page.write_text(json.dumps({'links':'{{stories.stories.0.detail_screens.0.links}}'}), encoding='utf8')
            with patch.object(content, '__file__', str(root/'src/typeset/engine/content.py')):
                self.assertEqual(content.bound_json(page)['links'], links)
                page.write_text(json.dumps({'text':'{{missing.registry.numbers.count.text}}'}), encoding='utf8')
                with self.assertRaises(KeyError): content.bound_json(page)


if __name__ == '__main__': unittest.main()
