"""Wrapped sequence connectors stay in the corridor between complete rows."""
import os
from pathlib import Path
import re
import sys
import tempfile
import unittest
from unittest.mock import patch

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src/typeset"))
from engine.layout import build_html
from engine.registry import load


class SequenceEdgesTests(unittest.TestCase):
    def test_uneven_wrapped_rows_and_mobile_single_column(self):
        registry, _, css, _ = load()
        text = "\n".join(f"{i}. **步骤{i}**　" + "说明文字。" * size
                         for i, size in enumerate((18, 14, 2, 10, 16, 2, 5), 1))
        temp_root = Path(os.environ.get("TEMP", ROOT))
        with tempfile.TemporaryDirectory(dir=temp_root) as profile, sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(profile,
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True, viewport={"width": 1400, "height": 1100})
            try:
                page = browser.new_page()
                for path, orient, columns, width in (("flat", "h", 3, 1200),
                        ("serpentine", "h", 3, 1200), ("z_order", "h", 3, 1200),
                        ("flat", "v", 1, 390)):
                    with self.subTest(path=path, orient=orient):
                        spec = {"type": "flow", "text_ref": text.split("\n")[0], "columns": columns,
                                "path": path, "direction": "horizontal", "connector": "arrow",
                                "illustration": "none", "icons": "none"}
                        with patch("engine.assets.manifest", return_value={}):
                            html, _ = build_html({"page": "sequence-fixture"},
                                {"id": "sequence-fixture-01", "text": text}, orient,
                                registry, css, {"blocks": [spec]})
                        page.set_viewport_size({"width": width, "height": 1100})
                        page.set_content(str(BeautifulSoup(html, "html.parser").select_one(".c-sequence")))
                        page.add_style_tag(content=(ROOT / "src/typeset/components/comp-diagram/sequence.css").read_text("utf8") +
                            ".c-diagram.c-sequence{width:calc(100vw - 40px);font-size:20px;--fs-body:20px;--fs-name:24px;--sequence-min-font:16px;--sequence-space:36px;--accent:#16853d;--line:#b8e6c5;--cardbg:#f3fbf5;--text:#244b75}")
                        page.evaluate("document.fonts.ready")
                        page.evaluate("() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
                        turns = page.eval_on_selector_all('[data-edge-kind="row-turn"]', """paths => paths.map(p => {
                            const root=p.closest('.c-sequence'), nodes=[...root.querySelectorAll('.sequence-item')];
                            const rows=[nodes[Number(p.dataset.sourceItem)-1],nodes[Number(p.dataset.targetItem)-1]]
                                .map(n=>[...n.closest('.sequence-row').querySelectorAll('.sequence-item')].map(i=>i.getBoundingClientRect()));
                            return {d:p.getAttribute('d'), origin:root.getBoundingClientRect().top+root.clientTop,
                                bottom:Math.max(...rows[0].map(r=>r.bottom)),top:Math.min(...rows[1].map(r=>r.top))};
                        })""")
                        self.assertEqual(len(turns), 6 if columns == 1 else 2)
                        for turn in turns:
                            coords = re.findall(r"([MVH])\s*([-\d.]+)(?:\s+([-\d.]+))?", turn["d"])
                            y = None
                            for command, first, second in coords:
                                if command == "M": y = float(second)
                                elif command == "V": y = float(first)
                                elif command == "H":
                                    self.assertGreater(y + turn["origin"], turn["bottom"])
                                    self.assertLess(y + turn["origin"], turn["top"])
                        if columns == 1:
                            self.assertTrue(all(" H " not in turn["d"] for turn in turns))
            finally:
                browser.close()


if __name__ == "__main__":
    unittest.main()
