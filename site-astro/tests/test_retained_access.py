"""授权页保留源码与构建成品对照：python -m pytest site-astro/tests/test_retained_access.py（需先 npm run build）。

授权页现由 src/retained-page.ts 直接读 sources/retained-home-cockpit/computer-access.html；源码字节和
随附运行件的登记由仓库根 tests/test_home_retained_frozen.py 核对。这里核对构建出的 dist 页面没有丢掉
源码里的屏幕清单和运行件，也没有叠加不该有的适配层。
"""
import json
import re
import unittest
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
SOURCE = SITE / 'sources/retained-home-cockpit/computer-access.html'
BUILT = ROOT / 'dist/computer-access/index.html'
# 构建收尾把站内资源改成阿里云发布目录的绝对地址；对照时按本站根路径还原
OSS = re.compile(r'https://wly0829-img-media-shanghai\.oss-cn-shanghai\.aliyuncs\.com/releases/[^/"]+/')


def page_data(text):
    return json.loads(re.search(r'<script id="page-data"[^>]*>(.*?)</script>', text, re.S)[1])


def scripts(text):
    return set(re.findall(r'<script[^>]+src="([^"]+)"', text))


@unittest.skipUnless(BUILT.is_file(), '还没有构建产物 dist/computer-access/index.html，先运行 npm run build')
class RetainedAccessBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.old = SOURCE.read_text('utf8')
        cls.built = OSS.sub('/', BUILT.read_text('utf8'))

    def test_screens_forms_and_actions_kept(self):
        self.assertEqual(page_data(self.built), page_data(self.old), '原屏幕、表单与动作清单必须完整保留')
        self.assertTrue(page_data(self.built)['screens'], '不得清空原屏幕清单')

    def test_original_runtime_scripts_kept(self):
        self.assertLessEqual(scripts(self.old), scripts(self.built), '原运行件不得缺失')

    def test_no_extra_adapter_layers(self):
        self.assertNotIn('/_living/live-dom.js', scripts(self.built), '不叠加新排版适配层')
        self.assertNotIn('cockpit-offline.css', self.built)
        self.assertNotIn('cockpit-offline.js', self.built)

    def test_local_runtime_files_published(self):
        missing = [url for url in scripts(self.old)
                   if url.startswith('/') and not (ROOT / 'dist' / url.lstrip('/').split('?')[0]).is_file()]
        self.assertEqual(missing, [])


class RetainedAccessEntryTests(unittest.TestCase):
    def test_route_reads_retained_page(self):
        self.assertIn("retainedPage('computer-access')", (SITE / 'src/pages/computer-access/index.astro').read_text('utf8'))


if __name__ == '__main__':
    unittest.main()
