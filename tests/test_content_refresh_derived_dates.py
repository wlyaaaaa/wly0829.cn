"""派生日期的真实观察时间、屏范围和冻结边界。"""
import sys
from pathlib import Path
from unittest import TestCase
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "site-astro/tools"))
from convert_page import derived_screen_dates


class DerivedDatesTests(TestCase):
    def test_oldest_beijing_observation_or_coverage_end_per_screen(self):
        page = {"kind": "project", "screens": [{"id": "a", "text": "10 项"}, {"id": "b", "text": "5 项"}]}
        records = [
            {"page": "demo", "screen": "a", "derive_as_of": True,
             "observed_at": "2026-10-31T00:30:00+00:00"},
            {"page": "demo", "screen": "a", "derive_as_of": True,
             "observed_at": "2026-10-31T22:30:00+00:00", "source_coverage_end": "2026-10-20"},
            {"page": "demo", "screen": "b", "derive_as_of": True,
             "observed_at": "2026-10-29T23:30:00+00:00"},
            {"page": "demo", "screen": "a", "derive_as_of": False,
             "observed_at": "2020-01-01T00:00:00+08:00"},
        ]
        with patch("convert_page.derived_date_records", return_value=records):
            self.assertEqual(derived_screen_dates("demo", page), {
                "a": "数字截至 2026 年 10 月 20 日", "b": "数字截至 2026 年 10 月 30 日"})

    def test_missing_observation_hides_group_and_historical_or_frozen_excluded(self):
        page = {"kind": "project", "screens": [{"id": "a"}, {"id": "old", "section": "history"}]}
        records = [
            {"page": "demo", "screen": "a", "derive_as_of": True,
             "observed_at": "2026-10-31T12:00:00+08:00"},
            {"page": "demo", "screen": "a", "derive_as_of": True},
            {"page": "demo", "screen": "old", "derive_as_of": True,
             "observed_at": "2026-10-31T12:00:00+08:00"},
        ]
        with patch("convert_page.derived_date_records", return_value=records):
            self.assertEqual(derived_screen_dates("demo", page), {})
            self.assertEqual(derived_screen_dates("demo", {**page, "kind": "frozen"}), {})
