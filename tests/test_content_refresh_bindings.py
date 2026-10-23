"""登记自检：下次按需更新必然失败或写错的绑定，在改稿提交时就拦下。"""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from binding_checks import binding_findings
from audit_edits import flags


class BindingCheckTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(); self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        page = self.root / "sources/pages/demo/page.json"; page.parent.mkdir(parents=True)
        page.write_text(json.dumps({"page": "demo", "screens": [{"id": "demo-01", "text":
            "现有 166 份登记，合计约 599.0 GB（10 月 22 日 06:47 计数）。\n\n10 月 11 日那次数是 44 份。"}],
            "registry": {"numbers": [{"id": "n-reg", "text": "160 份登记"}]}}, ensure_ascii=False), encoding="utf-8")
        self.base = {"page": "demo", "screen": "demo-01", "field": "screens[0].text", "automatic": True, "historical": False}

    def check(self, *records):
        return binding_findings(self.root, [dict(self.base, **r) for r in records])

    def test_pattern_must_hit_once_and_digits_follow_the_page(self):
        found = self.check({"id": "a", "page_pattern": r"现有 ([\d,]+) 份登记"},
                           {"id": "b", "page_pattern": r"([\d,]+) 份"},
                           {"id": "c", "page_pattern": r"合计约 ([\d.]+) GB", "retrieve": {"kind": "json", "digits": 0}})
        self.assertEqual([x["record_id"] for x in found["pattern"]], ["b"])
        self.assertEqual([x["record_id"] for x in found["digits"]], ["c"])

    def test_mirror_that_drifted_from_the_body_is_reported(self):
        found = self.check({"id": "a", "page_pattern": r"现有 ([\d,]+) 份登记", "registry_number": "n-reg"})
        self.assertEqual([x["record_id"] for x in found["mirror"]], ["a"])

    def test_observation_time_next_to_an_automatic_number_must_be_linked(self):
        number = {"id": "a", "page_pattern": r"现有 ([\d,]+) 份登记"}
        self.assertEqual(len(self.check(number)["observed"]), 1)  # “（10 月 11 日那次数是…）”是历史，不算
        stamp = {"id": "d", "page_pattern": r"GB（(\d+ 月 \d+ 日 \d+:\d+) 计数）", "qualifies": ["a"], "automatic": True}
        self.assertEqual(self.check(number, stamp)["observed"], [])


class EditAuditTests(unittest.TestCase):
    def test_review_marks_the_edits_most_likely_wrong(self):
        self.assertEqual(flags("749", "749.0"), ["小数位变化"])
        self.assertEqual(flags("80", "0"), ["跳变 -100%"])
        self.assertEqual(flags("10 月 23 日 10:25", "10 月 22 日 06:47"), ["日期倒退"])
        self.assertEqual(flags("10 月 22 日", "10 月 23 日 10:25"), ["时分精度变化"])
        self.assertEqual(flags("3,998", "4,012"), [])


if __name__ == "__main__":
    unittest.main()
