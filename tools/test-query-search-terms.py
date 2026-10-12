import contextlib
from datetime import date
import importlib.util
import io
import json
import os
from pathlib import Path
import unittest
from unittest.mock import mock_open, patch
spec = importlib.util.spec_from_file_location("search_terms", Path(__file__).with_name("query-search-terms.py"))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
class SearchTermsTests(unittest.TestCase):
    def test_google_pagination_keeps_website_total(self):
        calls, row = [], {"keys": ["网站"], "clicks": 1, "impressions": 3, "position": 2}
        def response(url, data, headers):
            body = json.loads(data); calls.append((body["dimensions"], body["startRow"]))
            return {"rows": [{"clicks": 123, "impressions": 456, "position": 4}] if not body["dimensions"] else [row] * (25000 if body["startRow"] == 0 else 1)}
        with patch.object(m, "google_token", return_value="test"), patch.object(m, "request", side_effect=response):
            result = m.google(date(2026, 10, 1), date(2026, 10, 2), 2, "test")
        self.assertEqual(calls, [([], 0), (["query"], 0), (["query"], 25000)])
        self.assertEqual((result["total"]["clicks"], result["returned_terms"], result["indexed_pages"]), (123, 25001, "Unknown"))
    def test_bing_date_weighting_and_latest_index(self):
        self.assertEqual(m.bing_date("/Date(0-0700)/"), date(1969, 12, 31))
        base = {"Query": "网站", "Clicks": 1, "Date": "2026-10-01", "Impressions": 2, "AvgImpressionPosition": 1}
        records = {"GetQueryStats": [base, {**base, "Impressions": 6, "AvgImpressionPosition": 5}, {**base, "Date": "2026-09-01"}], "GetRankAndTrafficStats": [base], "GetCrawlStats": [{"Date": "2026-10-02", "InIndex": 9}, {"Date": "2026-09-01", "InIndex": 1}]}
        with patch.object(m, "request", side_effect=lambda url: {"d": records[url.split("?")[0].rsplit("/", 1)[1]]}):
            result = m.bing(date(2026, 10, 1), date(2026, 10, 2), 20, "test")
        self.assertEqual((result["terms"][0]["position"], result["indexed_pages"], result["total"]["clicks"]), (4, 9, 1))
    def test_unconfigured_and_error_do_not_expose_credentials(self):
        good = {"property": m.PROPERTY, "indexed_pages": 160, "date": "2026-10-08", "source": m.GOOGLE_INDEX}
        for raw, count in ((json.dumps(good), 160), (json.dumps({**good, "indexed_pages": True}), "Unknown"), (json.dumps({**good, "indexed_pages": -1}), "Unknown"), (json.dumps({**good, "property": "wrong"}), "Unknown"), (json.dumps({**good, "date": "invalid"}), "Unknown"), ("secret-test-marker", "Unknown")):
            output = io.StringIO()
            with patch.dict(os.environ, {} if count == 160 else {"WLY_SEARCH_GOOGLE_JSON": "secret-test-marker"}, clear=True), patch("builtins.open", mock_open(read_data=raw)), patch.object(m.Path, "write_text") as saved, contextlib.redirect_stdout(output):
                self.assertEqual(m.main(["--json", "--end", "2026-10-01", "--google-index-snapshot", "test.json", "--output", "result.json"]), 1)
            self.assertNotIn("secret-test-marker", output.getvalue())
            result = json.loads(output.getvalue())
            self.assertEqual(json.loads(saved.call_args.args[0]), result)
            self.assertEqual((result["Google"]["indexed_pages"], result["Bing"]["status"]), (count, "unconfigured"))
if __name__ == "__main__": unittest.main()
