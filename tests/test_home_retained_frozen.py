"""授权页的冻结字节和登记一致；首页已于 10 月 23 日解锁（亮点随所属项目数字重画），不再核对其字节。

原测试依赖已在 G1 统一构建里删除的 site-astro/tools/retain_home_cockpit.py。现在保留页直接由
site-astro/src/retained-page.ts 从 sources/retained-home-cockpit/ 读取，这里不再跑恢复脚本，只核对：
授权页和登记的 sha256/字节一致；登记的随附运行件、授权页运行件和模型字节一致；依赖清单每一条都能
在仓库里找到且字节一致；旧驾驶舱已退役（新驾驶舱是 Astro 原生页）。任何一字节改动都会让测试失败。
"""
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / 'site-astro/sources/retained-home-cockpit'
PIN = json.loads((SNAPSHOT / 'manifest.json').read_text('utf8'))
RETIRED = set(json.loads((ROOT / 'site-astro/sources/frozen-site/manifest.json').read_text('utf8')).get('retired_runtime_assets', []))


def proof(path):
    raw = path.read_bytes()
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw)}


class FrozenHomeTests(unittest.TestCase):
    def test_frozen_pages_match_pins(self):
        self.assertEqual(proof(SNAPSHOT / 'computer-access.html'), PIN['pages']['computer-access'])

    def test_old_cockpit_stays_retired(self):
        self.assertFalse((SNAPSHOT / 'cockpit.html').exists())
        self.assertTrue((ROOT / 'site-astro/src/pages/cockpit/index.astro').is_file())
        self.assertNotIn("retainedPage('cockpit')", (ROOT / 'site-astro/src/pages/cockpit/index.astro').read_text('utf8'))

    def test_bundled_runtime_files_match_pins(self):
        checked = 0
        for relative, row in PIN['bundled'].items():
            source = (SNAPSHOT / row['source']).resolve()
            if relative in RETIRED: continue  # 已退役运行件（构建会拦住任何页面再引用它们），不再核对源文件
            self.assertEqual(proof(source), {'sha256': row['sha256'], 'bytes': row['bytes']}, relative); checked += 1
        self.assertGreater(checked, 0)

    def test_authorization_runtime_and_model_match_pins(self):
        access = PIN['computer_access']
        for key, sha in (('runtime', 'sha256'), ('model', 'model_sha256')):
            row = PIN['bundled'][access[key]]
            self.assertEqual(proof((SNAPSHOT / row['source']).resolve())['sha256'], access[sha], access[key])

    def test_dependency_ledger_sources_exist_and_match(self):
        ledger = json.loads((SNAPSHOT / 'dependencies.json').read_text('utf8'))
        bad = []
        for relative, row in ledger.items():
            if 'source_path' not in row: continue
            source = ROOT / row['source_path']
            if not source.is_file() or proof(source) != {'sha256': row['sha256'], 'bytes': row['bytes']}: bad.append(relative)
        self.assertEqual(bad, [])


if __name__ == '__main__':
    unittest.main()
