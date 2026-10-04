"""Current layout capability expectations and fail-closed absence evidence."""
import importlib.util
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('current_effects_builder',ROOT/'scripts/build-typeset-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)


class CurrentEffectsTests(unittest.TestCase):
    def fixture(self):
        part={'orientation':'h','motion_measured':True,'cards':[[0,0,.2,.2]],'numbers':[],
              'arrows':[{'rect':[.3,0,.1,.1]}],'hotspots':[],'interactive_cards':[]}
        return {'screens':[{'id':'one','shape':'screen','parts':[part]}]}, {'screens':[{'id':'one','screenshots':[]}]},part

    def test_current_elements_add_requirements_and_bound_absence_retires_old_ones(self):
        data,source,_=self.fixture()
        expected,caps,changes=builder.current_effects(data,source,['ambient','numbers','screenshots','card_feedback'])
        self.assertEqual(expected,['ambient','cards','arrows'])
        self.assertEqual(caps['arrows']['count_h'],1)
        self.assertEqual(caps['arrows']['count_v'],0)
        self.assertEqual(caps['numbers']['status'],'no_corresponding_element')
        self.assertEqual({c['effect'] for c in changes},{'cards','numbers','arrows','screenshots','card_feedback'})

    def test_missing_binding_never_proves_absence_or_drops_existing_requirement(self):
        data,source,part=self.fixture();part.pop('motion_measured')
        expected,caps,_=builder.current_effects(data,source,['numbers'])
        self.assertEqual(expected,['numbers'])
        self.assertTrue(all(c['status']=='measurement_missing' for c in caps.values()))

    def test_declared_screenshot_without_a_hotspot_and_missing_declaration_block_absence(self):
        for screens in ([{'id':'one','screenshots':[{'id':'result'}]}],[{'id':'one'}]):
            data,source,_=self.fixture();source['screens']=screens
            expected,caps,_=builder.current_effects(data,source,['screenshots'])
            self.assertIn('screenshots',expected)
            self.assertEqual(caps['screenshots']['status'],'measurement_missing')

    def test_whole_cards_keep_feedback_without_floating_motion(self):
        data,source,_=self.fixture();screen=data['screens'][0];screen.update(shape='card',primary_href='/projects/example/')
        expected,caps,_=builder.current_effects(data,source,[])
        self.assertNotIn('cards',expected);self.assertIn('card_feedback',expected)
        self.assertEqual(caps['card_feedback']['count_h'],1)

    def test_public_projection_keeps_current_capability_and_home_flag_without_binding_records(self):
        data,source,_=self.fixture();_,caps,_=builder.current_effects(data,source,[])
        result=builder.public_page_data({**data,'home_living':True,'motion_capabilities':caps})
        self.assertEqual(result['motion_capabilities'],caps)
        self.assertTrue(result['home_living'])
        self.assertNotIn('motion_measured',result['screens'][0]['parts'][0])


class CurrentTocTests(unittest.TestCase):
    def fixture(self, href):
        text='<nav class="toc"><a href="'+href+'">旧标题</a></nav><main><div id="old"></div><section data-screen="one" data-section="old"></section></main>'
        data={'screens':[{'id':'one','title':'当前标题','section':'old'}]}
        source={'screens':[{'id':'one','section':'current','title':'当前标题'}]}
        return text,data,source

    def test_all_valid_legacy_targets_keep_markup_and_existing_section(self):
        text,data,source=self.fixture('#old')
        actual,proof=builder.bind_current_toc(text,data,source)
        self.assertEqual(actual,text)
        self.assertEqual(data['screens'][0]['section'],'old')
        self.assertEqual(proof['status'],'legacy_targets_preserved')

    def test_missing_legacy_target_uses_current_authored_sections_without_erasing_old_anchors(self):
        text,data,source=self.fixture('#removed')
        actual,proof=builder.bind_current_toc(text,data,source)
        self.assertEqual(data['screens'][0]['section'],'current')
        self.assertIn('data-section="current"',actual)
        reader=builder.hybrid.builder.Refs();reader.feed(actual)
        self.assertTrue({'old','current'}<=reader.ids)
        links=[href for href,is_link in reader.refs if is_link]
        self.assertEqual(links,['#current'])
        self.assertTrue(all(href[1:] in reader.ids for href in links))
        self.assertEqual(proof['previous_invalid_targets'],['#removed'])
        self.assertEqual(proof['entries'],[{'href':'#current','title':'当前标题'}])


if __name__=='__main__':unittest.main()
