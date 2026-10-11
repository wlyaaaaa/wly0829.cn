"""The one-command artifact contains every retained and native route."""
import json
import re
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class CompleteBuildTests(unittest.TestCase):
    def test_complete_site_has_312_html_files_and_all_registered_routes(self):
        snapshot = json.loads((ROOT / 'site-astro/sources/frozen-site/manifest.json').read_text('utf8'))
        dist = ROOT / 'dist'
        self.assertEqual(len(list(dist.rglob('*.html'))), 312)
        for route in snapshot['routes']:
            rel = 'index.html' if route == '/' else route.lstrip('/') if route.endswith('.html') else route.strip('/') + '/index.html'
            self.assertTrue((dist / rel).is_file(), route)

    def test_complete_artifact_has_no_old_aliyun_release_addresses(self):
        snapshot = (ROOT / 'site-astro/sources/frozen-site/manifest.json').read_text('utf8')
        prefixes = {url.encode() for url in re.findall(r'https://[^/]*\.aliyuncs\.com/releases/[^/"\s]+/', snapshot)}
        prefixes |= {b'releases/' + url.split(b'/releases/', 1)[1] for url in prefixes}
        for path in (ROOT / 'dist').rglob('*'):
            if path.is_file():
                raw = path.read_bytes()
                self.assertFalse(any(prefix in raw for prefix in prefixes), str(path))

    def test_complete_artifact_has_no_build_machine_paths_in_attributes_or_urls(self):
        # 只拦属性值（name="…"）和地址里的盘符绝对路径；正文和代码示例里介绍系统的文字不在此列。
        # 理由是维护：这类值是构建时的临时文件夹，换个文件夹构建，带它的页面都会被算作改动，按需更新白传、改动清单失真。
        pattern = re.compile(rb"(?:[A-Za-z0-9_-]=[\x22']|url\(\s*[\x22']?|[\x22'](?:src|href|srcset|url)[\x22']\s*:\s*[\x22'])(?:[A-Za-z]:(?:\\{1,2}|/)[A-Za-z0-9_.$]|file:///)")
        hits = []
        for path in (ROOT / 'dist').rglob('*'):
            if path.is_file() and path.suffix in {'.html', '.js', '.css', '.json'} and path.name != '.build-receipt.json':
                hits += [f'{path}: {m.group().decode("utf-8", "replace")}' for m in pattern.finditer(path.read_bytes())][:3]
        self.assertEqual(hits, [])

if __name__ == '__main__': unittest.main()
