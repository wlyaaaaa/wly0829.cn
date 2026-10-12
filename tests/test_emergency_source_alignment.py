"""急救时限必须在两个入口保持一致，避免省略等待后立即重启。"""
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.parametrize("page,screen", [("pcconfig", "pcconfig-08"), ("rescue", "rescue-02")])
def test_freeze_card_keeps_stop_and_restart_budgets(page, screen):
    source = json.loads((ROOT / f"sources/pages/{page}/page.json").read_text("utf-8"))
    text = next(row["text"] for row in source["screens"] if row["id"] == screen)
    card = text.split("**自动留现场**")[0].split("### 远程连不上")[0]
    assert "约 90 秒" in card and "停止尝试" in card
    assert "从发现卡住算起等约 2 分钟" in card
    assert card.index("约 90 秒") < card.index("约 2 分钟")
    assert "正常重启也卡住，最后才长按电源键" in card
    assert "直接重启就行" not in card and "不留现场：" not in card
    markdown = (ROOT / f"site-astro/src/content/pages/{page}.md").read_text("utf-8")
    assert text in markdown


def test_freeze_feature_uses_the_same_canonical_card():
    source = json.loads((ROOT / "sources/pages/pcconfig/page.json").read_text("utf-8"))
    feature = next(row for row in source["registry"]["features"] if row["id"] == "f-freeze-card")
    assert "90 秒" in feature["what"] and "2 分钟" in feature["what"]
    assert "desktop-freeze-rescue.md" in feature["source"]
    assert "整轮预算" in feature["source"]
    assert feature["status"] == "没用过"
