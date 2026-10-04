"""Current measured content keeps the existing split-screen coordinate mapping."""
import ast
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
tree=ast.parse((ROOT/'scripts/build-typeset-site.py').read_text('utf8'))
module=ast.Module(body=[node for node in tree.body if isinstance(node,ast.FunctionDef) and node.name=='motion_part'],type_ignores=[])
namespace={};exec(compile(module,'motion_part','exec'),namespace)
motion_part=namespace['motion_part']


class ContentMappingTests(unittest.TestCase):
    def record(self):
        return {'cards':[[0,0,1000,2000]],'html_sha256':'a'*64,'fit_sha256':'b'*64,
                'parts':[{'image':'page-v2.png','sha256':'c'*64}],
                'content_occupancy':{'policy':'semantic-content-rects-v1','method':'actual fitted DOM',
                    'measurement_sha256':'d'*64,'issues':[],
                    'blocks':[{'kind':'text','rect':[20,980,400,100]},
                              {'kind':'drawing','rect':[500,1300,300,200]}]}}

    def test_original_split_and_padding_map_only_real_content_blocks(self):
        result=motion_part(self.record(),'page-v2.png',[1000,800],1000,30)
        proof=result['content_occupancy']
        self.assertEqual(len(proof['blocks']),2)
        self.assertEqual(proof['blocks'][0],{'kind':'text','rect':[.02,.0375,.4,.1]})
        self.assertEqual(proof['blocks'][1],{'kind':'drawing','rect':[.5,.4125,.3,.25]})
        self.assertEqual(proof['source_png_sha256'],'c'*64)
        self.assertEqual(proof['source_html_sha256'],'a'*64)
        self.assertEqual(proof['measurement_sha256'],'d'*64)
        self.assertNotEqual(proof['blocks'][0]['rect'],result['cards'][0])

    def test_missing_or_failed_measurement_never_uses_cards_as_content(self):
        for record in ({'cards':[[0,0,1000,2000]]},self.record()):
            if 'content_occupancy' in record:record['content_occupancy']['issues']=['ink unreadable']
            self.assertNotIn('content_occupancy',motion_part(record,'page-v2.png',[1000,800],1000,30))


if __name__=='__main__':unittest.main()
