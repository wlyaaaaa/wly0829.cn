"""逐盘存储页的浏览器回归：虚构数据，只访问本机测试服务器。"""
from datetime import datetime, timedelta, timezone
import importlib.util
import os
from pathlib import Path
import re
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests/cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)
h.STATIC['/src/typeset/'] = ROOT / 'src/typeset'
OUT = Path(os.environ.get('STORAGE_PAGE_QA_ROOT', str(ROOT / '.publish/storage-page' / uuid.uuid4().hex)))


def document():
    source = (ROOT / 'site-astro/src/pages/cockpit/storage/index.astro').read_text('utf8')
    body = re.search(r'<Site\b[^>]*>(.*?)</Site>', source, re.S).group(1)
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>虚构磁盘采样</title><link rel="stylesheet" href="/src/cockpit/cockpit.css"><link rel="stylesheet" href="/src/cockpit/storage.css">
<style>html,body{{margin:0}}*,*::before,*::after{{box-sizing:border-box}}main{{max-width:1440px;margin:auto}}</style>
</head><body><main>{body}</main><script type="module" src="/src/cockpit/storage.js"></script></body></html>'''.encode('utf8')


def fixture(partial=False):
    now = datetime.now(timezone.utc)
    stamp, baseline = h.iso(now), h.iso(now - timedelta(days=7))
    volumes = []
    for drive in 'CDEGH':
        volumes.append(dict(drive=drive, state='partial' if partial else 'ok', observed_at=stamp,
            total_bytes=1_000_000_000_000, used_bytes=500_000_000_000, classified_bytes=120_000_000_000,
            unclassified_bytes=380_000_000_000, classification_complete=not partial,
            weekly_growth_bytes=None if partial else -5_000_000_000, baseline_at=None if partial else baseline,
            top_complete=not partial, top_observed_at=stamp,
            top_directories=[dict(label=label, bytes=(5-i)*10_000_000_000, complete=not partial, path='X:\\fictional\\hidden')
                             for i, label in enumerate(['缓存', '项目', '个人资料（受保护）', '应用', '其他目录'])],
            categories=[dict(id='fixture_cache', label='虚构临时文件', bytes=120_000_000_000, complete=True)]))
    return dict(storage_pressure=dict(schema='pcconfig.ai-storage-pressure.v1', observed_at=stamp, max_age_seconds=50400,
        volumes=volumes, categories=[dict(label='虚构临时文件', bytes=120_000_000_000, complete=True,
            partial_bytes=None, weekly_growth_bytes=None if partial else -5_000_000_000, baseline_at=None if partial else baseline,
            budget_bytes=180_000_000_000, growth_limit_bytes=20_000_000_000, retention_zh='按现行保留期清理。', alert=None)]))


class StoragePageTests(unittest.TestCase):
    def test_five_disk_accounts_expand_and_fit_phone_and_desktop(self):
        from playwright.sync_api import sync_playwright
        OUT.mkdir(parents=True, exist_ok=True)
        server = h.StatusServer()
        server.default = (200, fixture(), 0)
        server.pages['/cockpit/storage/'] = document()
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                for width in (320, 390, 1440):
                    context = browser.new_context(viewport=dict(width=width, height=1000))
                    h.isolate(context)
                    page = context.new_page()
                    errors = []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.goto(server.origin + '/cockpit/storage/', wait_until='networkidle')
                    page.wait_for_selector('[data-drive="E"] .storage-meter')
                    self.assertEqual(page.locator('.storage-disk').count(), 5)
                    card = page.locator('[data-drive="E"]')
                    self.assertIn('500 GB', card.locator('.storage-used').inner_text())
                    self.assertIn('1 TB 总容量', card.locator('.storage-used').inner_text())
                    self.assertIn('120 GB', card.locator('.storage-fact').nth(0).inner_text())
                    self.assertIn('380 GB', card.locator('.storage-fact').nth(1).inner_text())
                    self.assertIn('−5 GB', card.locator('.storage-fact').nth(2).inner_text())
                    self.assertEqual(card.locator('.storage-top-list li').count(), 5)
                    self.assertIn('个人资料（受保护）', card.inner_text())
                    self.assertIn('Dev Drive', card.inner_text())
                    summary = card.locator('.storage-categories summary')
                    summary.focus()
                    page.keyboard.press('Enter')
                    self.assertTrue(card.locator('.storage-categories').evaluate('e=>e.open'))
                    self.assertTrue(card.get_by_text('虚构临时文件', exact=True).is_visible())
                    self.assertFalse(page.evaluate('document.documentElement.scrollWidth>innerWidth'))
                    for cell in card.locator('.storage-fact,.storage-top-list li').all():
                        self.assertFalse(cell.evaluate('e=>e.scrollWidth>e.clientWidth'), cell.inner_text())
                    self.assertNotIn('fictional', page.locator('body').inner_text())
                    self.assertFalse(errors, errors)
                    page.screenshot(path=str(OUT / f'storage-{width}.png'), full_page=True)
                    context.close()
                browser.close()
            self.assertFalse(server.writes())
        finally:
            server.close()

    def test_partial_stale_and_failed_reads_keep_gaps_explicit(self):
        from playwright.sync_api import sync_playwright
        server = h.StatusServer()
        data = fixture(partial=True)
        data['storage_pressure']['observed_at'] = h.iso(datetime.now(timezone.utc)-timedelta(hours=15))
        server.default = (200, data, 0)
        server.pages['/cockpit/storage/'] = document()
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context(viewport=dict(width=390, height=1000))
                h.isolate(context)
                page = context.new_page()
                page.goto(server.origin + '/cockpit/storage/', wait_until='networkidle')
                page.wait_for_selector('[data-drive="C"] .storage-meter')
                self.assertIn('采样已过期', page.locator('#storage-status').inner_text())
                card = page.locator('[data-drive="C"]')
                self.assertIn('历史采样', card.inner_text())
                self.assertIn('样本不足', card.inner_text())
                self.assertIn('含尚未测全的分类', card.inner_text())
                self.assertIn('测量不完整', card.inner_text())
                self.assertIn('≥ 50 GB', card.inner_text())
                self.assertNotIn('最大的 5 个文件夹', card.inner_text())
                server.default = (502, {}, 0)
                page.locator('#storage-refresh').click()
                page.wait_for_function("document.getElementById('storage-status').textContent.includes('在线数据不可用')")
                self.assertEqual(page.locator('.storage-disk.is-unavailable').count(), 5)
                self.assertNotIn('500 GB', page.locator('#storage-volumes').inner_text())
                self.assertIn('等待读取磁盘采样', page.locator('[data-drive="C"]').inner_text())
                self.assertFalse(page.locator('#storage-refresh').is_disabled())
                context.close()
                browser.close()
            self.assertFalse(server.writes())
        finally:
            server.close()


if __name__ == '__main__':
    unittest.main()
