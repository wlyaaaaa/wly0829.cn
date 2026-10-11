"""Uneven real card and flow bodies receive wider layouts without losing text."""
import copy, sys, unittest
from pathlib import Path
from unittest.mock import patch
from bs4 import BeautifulSoup
ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / "src/typeset"), str(ROOT / "site-astro/tools")]
from engine.card_rows import fit_card_rows
from engine.layout import assign_by_spec, build_html
from engine.parse import parse
from engine.registry import load
LONG_INTERFACE = "10 月 4 日起，电脑上原有的状态服务里，采集线程每 30 秒更新一次显示缓存（慢的来源按各自时效），读的是登记和回执；网站来取时直接给最近一份，不让页面干等，也没为它另起常驻程序。10 月 11 日起，同一份缓存还能给驾驶舱一个只带显示所需字段的精简包（约 105 KB，全量约 711 KB，授权页和 AI 照旧读全量）；‘稳 / 留意 / 要你处理’的总分和六个信号（要你做、AI 在跟、电脑、备份、今天任务、安全授权）也只在这里算一次，首页和驾驶舱只显示不另算；资料锁着只挡新读取，已显示的上次结果按原时间照常变旧，不改成‘等待解锁’"
class CardRowsTests(unittest.TestCase):
    def blocks(self, text, kind, columns):
        spec = {"type": kind, "columns": columns, "illustration": "none", "icons": "none"}; return assign_by_spec(parse(text), [dict(spec, text_ref=text.split("\n")[0])], [])
    def test_pcconfig_interface_flow_uses_existing_vertical_nodes(self):
        text = "\n".join(f"{i}. **{name}**　{body}" for i, (name, body) in enumerate([
            ("登记", "机器的事实只记一处：49 个登记文件，记着盘、端口、任务、软件、环境变量、恢复材料"),
            ("工具和自动任务", "读登记干活，用 PowerShell、Python、Node.js、C# 写成"),
            ("回执", "每次运行写一份结果：成功、失败、跳过都写清"),
            ("看板接口", LONG_INTERFACE), ("驾驶舱", "把这些翻成人话显示在网站上")], 1))
        blocks = self.blocks(text, "flow", 5); nodes = copy.deepcopy(blocks[0]["nodes"]); render_spec = dict(blocks[0]["spec"]); render_spec["row_order"] = "1-2 / 3-4-5"
        self.assertEqual(fit_card_rows({"page": "pcconfig"}, "h", blocks), 1); self.assertEqual((blocks[0]["spec"]["columns"], blocks[0]["spec"]["direction"], blocks[0]["nodes"]), (1, "vertical", nodes))
        registry, _, css, _ = load()
        with patch("engine.assets.manifest", return_value={}): html, _ = build_html({"page": "pcconfig"}, {"id": "pcconfig-12", "text": text}, "h", registry, css, {"blocks": [render_spec]})
        soup = BeautifulSoup(html, "html.parser"); self.assertEqual((soup.select_one('[data-comp="flow"]')["data-direction"], len(soup.select(".sequence-item")), soup.get_text().count(LONG_INTERFACE), len(soup.select(".sequence-row"))), ("vertical", 5, 1, 5))
    def test_short_balanced_cards_keep_columns_but_long_card_gets_full_width(self):
        for orient, body, expected in (("h", "资料" * 15, 3), ("h", LONG_INTERFACE, 1), ("v", "资料" * 15, 2), ("v", LONG_INTERFACE, 1)):
            blocks = self.blocks(f"**甲**　资料\n\n**乙**　{body}\n\n**丙**　资料", "content_card", 3); blocks[0]["spec"]["columns_v"] = 2; fit_card_rows({"page": "fixture"}, orient, blocks)
            self.assertEqual(blocks[0]["spec"]["columns_v" if orient == "v" else "columns"], expected)
        for orient in ("h", "v"):
            blocks = self.blocks(f"**甲**　{LONG_INTERFACE}\n\n**乙**　{LONG_INTERFACE}", "content_card", 2); blocks[0]["spec"]["columns_v"] = 2; fit_card_rows({"page": "fixture"}, orient, blocks)
            self.assertEqual(blocks[0]["spec"]["columns_v" if orient == "v" else "columns"], 2)
        blocks = self.blocks(f"**甲**　资料\n\n**乙**　资料\n\n**丙**　资料\n\n**丁**　{LONG_INTERFACE}", "content_card", 4)
        fit_card_rows("fixture", "h", blocks); self.assertEqual((blocks[0]["spec"]["columns"], blocks[0]["spec"].get("last_full_width")), (3, True))
    def test_protected_pages_never_change_layout(self):
        for page, orient in [(p, o) for p in ("home", {"url": "/"}, {"page": "cockpit"}, {"kind": "computer-access"}) for o in ("h", "v")]:
            blocks = self.blocks(f"**甲**　短\n\n**乙**　{LONG_INTERFACE}", "content_card", 3); blocks[0]["spec"]["columns_v"] = 3; original = copy.deepcopy(blocks)
            self.assertEqual(fit_card_rows(page, orient, blocks), 0); self.assertEqual(blocks, original)
    def test_split_paras_points_card_counts_each_real_card(self):
        blocks = self.blocks(f"第一段资料\n\n{LONG_INTERFACE}\n\n第三段资料", "points_card", 3); blocks[0]["spec"].update(split_paras=True, split_cards=False); original = copy.deepcopy(blocks[0]["nodes"])
        self.assertEqual((fit_card_rows("fixture", "h", blocks), blocks[0]["spec"]["columns"], blocks[0]["nodes"]), (1, 1, original))
    def test_flow_illustration_anchors_keep_original_row_boundaries(self):
        text = "\n\n".join(f"**节点{i}**　" + "文" * size for i, size in enumerate((100, 250, 100, 100, 100)))
        for anchor in ("hero_after_item", "illustration_after_item", "decoration_after"):
            blocks = self.blocks(text, "flow", 3); blocks[0]["spec"][anchor] = 3; original = copy.deepcopy(blocks)
            self.assertEqual(fit_card_rows("fixture", "h", blocks), 0); self.assertEqual(blocks, original)
        blocks = self.blocks(text, "flow", 3); blocks[0]["spec"]["row_order"] = "1-2-3 / 4-5"; fit_card_rows("fixture", "h", blocks); self.assertNotIn("last_full_width", blocks[0]["spec"])
if __name__ == "__main__": unittest.main()
