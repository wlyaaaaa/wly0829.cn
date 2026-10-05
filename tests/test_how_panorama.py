"""Frozen graph binding rejects stale sources and incomplete map measurements."""
from copy import deepcopy
import importlib.util
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('prepare_how_panorama', ROOT / 'scripts/prepare-how-demo.py')
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)


class PanoramaBindingTests(unittest.TestCase):
    def setUp(self):
        self.source = Mock()
        self.source.resolve.return_value = self.source
        self.source.stat.return_value.st_size = 123
        self.args = SimpleNamespace(panorama_source=self.source, panorama_source_sha256='a' * 64,
                                    panorama_source_bytes=123)
        self.registry = {
            'nodes': [{'id': 'index', 'name': '项目总索引', 'href': '/projects/old-index/'},
                      {'id': 'media', 'name': '媒体', 'href': '/projects/media/'},
                      {'id': 'phone', 'name': '手机'}, {'id': 'actor', 'name': 'AI'}],
            'relations': [{'from': 'phone', 'to': 'media'}, {'from': 'media', 'to': 'index'},
                          {'from': 'index', 'to': 'actor'}],
        }
        self.page = {'screens': [{'id': 'how-02', 'parts': []}]}
        for orientation in ('h', 'v'):
            rows = [
                {'text': '项目总索引', 'href': '/projects/index/',
                 'original_href': '/projects/old-index/', 'rect': [.1, .2, .3, .04]},
                {'text': '媒体', 'href': '/projects/media/', 'rect': [.1, .3, .3, .04]},
                {'text': '手机', 'href': None, 'rect': [.1, .4, .3, .04]},
                {'text': 'AI（当前模型）', 'href': None, 'rect': [.1, .5, .3, .04]},
            ]
            self.page['screens'][0]['parts'].append({
                'orientation': orientation, 'image': 'map-' + orientation + '.png',
                'panorama_nodes': rows,
                'hotspots': [{'id': orientation + '-' + str(i), 'href': row['href'],
                              'original_href': row.get('original_href')}
                             for i, row in enumerate(rows) if row['href']],
            })

    def project(self, page=None, registry=None):
        with patch.object(prepare, 'digest', return_value='a' * 64), \
                patch.object(prepare, 'read', return_value={'registry': registry or self.registry}):
            return prepare.panorama_data(self.args, page or self.page)

    def test_real_href_alias_and_unlinked_actor_boxes_survive_projection(self):
        graph, proof = self.project()
        self.assertEqual([h['node'] for h in graph['hotspots']], ['index', 'media'] * 2)
        self.assertEqual({v['node'] for v in graph['visuals']}, {'index', 'media', 'phone', 'actor'})
        self.assertEqual([n for n in graph['nodes'] if n['id'] == 'phone'], [{'id': 'phone', 'href': None}])
        self.assertEqual([n for n in graph['nodes'] if n['id'] == 'index'], [{'id': 'index', 'href': '/projects/index/'}])
        self.assertEqual(graph['relations'], [['phone', 'media'], ['media', 'index'], ['index', 'actor']])
        self.assertNotIn(['phone', 'index'], graph['relations'])
        self.assertEqual((proof['bound_hotspots'], proof['measured_node_boxes']), (4, 8))

    def test_either_orientation_missing_actor_is_rejected(self):
        for orientation in range(2):
            page = deepcopy(self.page)
            page['screens'][0]['parts'][orientation]['panorama_nodes'].pop()
            with self.subTest(orientation=orientation), self.assertRaisesRegex(ValueError, 'all frozen projects and actors'):
                self.project(page)

    def test_source_sha_or_byte_drift_is_rejected_before_registry_read(self):
        for field, value in [('panorama_source_sha256', 'b' * 64), ('panorama_source_bytes', 124)]:
            with self.subTest(field=field), patch.object(prepare, 'digest', return_value='a' * 64), \
                    patch.object(prepare, 'read') as read:
                original = getattr(self.args, field)
                setattr(self.args, field, value)
                try:
                    with self.assertRaisesRegex(ValueError, 'SHA256 and bytes'):
                        prepare.panorama_data(self.args, self.page)
                    read.assert_not_called()
                finally:
                    setattr(self.args, field, original)

    def test_unbound_graph_endpoint_is_rejected(self):
        registry = deepcopy(self.registry)
        registry['relations'].append({'from': 'phone', 'to': 'missing'})
        with self.assertRaisesRegex(ValueError, 'Unknown panorama relation endpoint'):
            self.project(registry=registry)

    def test_orientation_destination_disagreement_is_rejected(self):
        page = deepcopy(self.page)
        page['screens'][0]['parts'][1]['hotspots'][0]['href'] = '/projects/another-index/'
        with self.assertRaisesRegex(ValueError, 'inconsistent current hotspot destinations'):
            self.project(page)


if __name__ == '__main__':
    unittest.main()
