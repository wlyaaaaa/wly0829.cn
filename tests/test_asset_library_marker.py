import hashlib
import json
from pathlib import Path
import unittest

LIBRARY = Path(__file__).resolve().parents[1] / 'sources/assets/_library'


class AssetLibraryMarkerTests(unittest.TestCase):
    def test_ready_marker_names_the_current_asset_map(self):
        # 映射改了却没改指纹时，引擎静默退回抠图 manifest，标题图和新插画都找不到。
        marker = json.loads((LIBRARY / 'REQUESTS-READY.json').read_text('utf-8'))
        digest = hashlib.sha256((LIBRARY / 'asset-map.jsonl').read_bytes()).hexdigest()
        self.assertEqual(marker['status'], 'ready')
        self.assertEqual(marker['asset_map_sha256'], digest)


if __name__ == '__main__':
    unittest.main()
