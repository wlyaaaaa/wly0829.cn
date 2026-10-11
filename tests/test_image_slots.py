"""真实卡片新增段落回归：7ef84860 修复前的 github-local-index 第 3 屏结构。"""
import contextlib
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-astro/tools"))
import convert_page as convert
import render_blocks as render

ICON = "_library/icons/工具箱回收站.png"
TEXT = ("**仍需处理：10 个**\n那一刻几个 AI 正同时收尾。\n\n"
        "**有 36 个仓库这次没联网核对**\n远端状态用的是本机上次拉下来的记录。\n\n"
        "**现在多出 2 个仓库还没进看板**\nGitHub 上现场 47 个，看板还是 45 个。")


class ImageSlotsTests(unittest.TestCase):
    def setUp(self):
        self.registry = render.load_registry()[0]
        self.screen = {"id": "github-local-index-03", "text": TEXT}
        self.card = {"type": "content_card", "text_ref": "仍需处理：10个", "icons": [ICON, ICON]}

    def test_historical_new_card_fails_in_renderer_with_context(self):
        message = ("github-local-index 屏 github-local-index-03：content_card 需要 3 个图位，只配了 2 个"
                   "（asset-map.jsonl 补行，或把段落移出卡片）")
        with self.assertRaises(ValueError) as error:
            render.checked_html("github-local-index", {}, self.screen, "h", self.registry, [],
                                {"blocks": [self.card]}, check_only=True)
        self.assertEqual(str(error.exception), message)
        # 真修复只把新增段落移出卡片，原有两张图足够。
        repaired = {"blocks": [self.card, {"type": "prose", "text_ref": "现在多出2个仓库还没进看板"}]}
        render.checked_html("github-local-index", {}, self.screen, "h", self.registry, [], repaired, check_only=True)

    def test_conversion_rejects_before_writing_and_check_only_never_writes(self):
        with tempfile.TemporaryDirectory(dir=ROOT.parent) as temporary:
            root = Path(temporary)
            source = root / "sources/pages/github-local-index"
            source.mkdir(parents=True)
            data = {"title": "GitHub 项目总索引", "kind": "fixture", "url": "/fixture/", "screens": [self.screen]}
            (source / "page.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf8")
            layouts = [{"screen": self.screen["id"], "orientation": "h", "blocks": [self.card]}]
            (source / "layout.json").write_text(json.dumps(layouts), encoding="utf8")
            output = root / "output"
            with patch.object(convert, "REPO", str(root)), patch.object(convert, "OUT_MD", str(output)), \
                    patch.object(convert, "screen_images", return_value=[]), contextlib.redirect_stdout(io.StringIO()):
                with self.assertRaisesRegex(ValueError, "github-local-index 屏 github-local-index-03"):
                    convert.convert("github-local-index")
                self.assertFalse(output.exists())
                layouts[0]["blocks"].append({"type": "prose", "text_ref": "现在多出2个仓库还没进看板"})
                (source / "layout.json").write_text(json.dumps(layouts), encoding="utf8")
                before = {p.relative_to(root): p.read_bytes() for p in root.rglob("*") if p.is_file()}
                self.assertEqual(convert.convert("github-local-index", check_only=True), 1)
                self.assertEqual(before, {p.relative_to(root): p.read_bytes() for p in root.rglob("*") if p.is_file()})

    def test_group_headings_use_actual_rendered_group_count(self):
        screen = {"id": "groups-01", "text": "### 第一组\n\n**一**｜说明\n\n### 第二组\n\n**二**｜说明"}
        spec = {"blocks": [{"type": "feature_card", "text_ref": "第一组", "icons": "none",
                            "group_heading_variant": "icon_underline", "group_heading_icons": [ICON]}]}
        with self.assertRaisesRegex(ValueError, "groups 屏 groups-01：feature_card 分组标题 需要 2 个图位，只配了 1 个"):
            render.checked_html("groups", {}, screen, "h", self.registry, [], spec, check_only=True)

    def test_orientation_fallback_and_shared_icon_cursor(self):
        screen = {"id": "cursor-01", "text": "**一**｜说明\n\n**二**｜说明\n\n**三**｜说明"}
        rows = [{"role": "icon", "asset": ICON, "orientations": ["h"], "slot_ordinal": i} for i in (1, 2)]
        meta = {"images": rows, "layout": {o: {"blocks": [
            {"type": "content_card", "text_ref": "一", "icons": "auto"},
            {"type": "content_card", "text_ref": "二", "icons": "auto"}]} for o in ("h", "v")}}
        with self.assertRaisesRegex(ValueError, "cursor 屏 cursor-01：content_card 需要 2 个图位，只配了 1 个"):
            render.check_screen_images("cursor", {}, screen, meta)
        self.card["icons"] = "none"
        render.checked_html("no-icons", {}, self.screen, "h", self.registry, [], {"blocks": [self.card]}, check_only=True)

    def test_rule_check_skips_template_copy(self):
        data = json.loads((ROOT / "sources/pages/charter/page.json").read_text("utf8"))
        screen = next(s for s in data["screens"] if s.get("source"))
        with patch.object(convert, "copy_public_source", side_effect=AssertionError("只读检查写了模板")):
            convert.rule_gate(screen, "charter", check_only=True)

    def test_card_main_illustrations_use_real_card_count(self):
        self.card.update(icons="none", illustration_source="illustration", illustration_index=1)
        with patch.object(render.A, "_manifest", {self.screen["id"]: [
                {"role": "illustration", "path": ICON, "slot_ordinal": 1},
                {"role": "illustration", "path": ICON, "slot_ordinal": 2}]}):
            with self.assertRaisesRegex(ValueError, "content_card 需要 3 个图位，只配了 1 个"):
                render.checked_html("github-local-index", {}, self.screen, "h", self.registry, [],
                                    {"blocks": [self.card]}, check_only=True)


if __name__ == "__main__":
    unittest.main()
