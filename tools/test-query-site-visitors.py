#!/usr/bin/env python3
"""Synthetic OSS logs only. Run: python -B -X utf8 tools/test-query-site-visitors.py"""
from datetime import date
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
from urllib.parse import urlencode

SPEC = importlib.util.spec_from_file_location("visitors", Path(__file__).with_name("query-site-visitors.py"))
query = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(query)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/142.0.0.0 Safari/537.36"
START, END = date(2026, 10, 11), date(2026, 10, 12)


def log(time="12/Oct/2026:10:00:00 +0800", v="visitor-A", p="/", ip="203.0.113.1", ua=UA,
        extra=None, path="/_v.gif", status=200, request_id=None):
    params = {"x-v": v, "x-p": p, "x-ref": "", **(extra or {})}
    uri = path + "?" + urlencode(params)
    fields = [ip, "-", "-", f"[{time}]", json.dumps(f"GET {uri} HTTP/1.1"), str(status), "43", "1",
              '"https://wly0829.cn/"', json.dumps(ua), '"host"', json.dumps(request_id or time + uri),
              '"true"', '"-"', '"GetObject"', json.dumps(query.SOURCE), json.dumps(path.lstrip("/")),
              "43", "1", '"-"', "100", '"-"', "-", '"-"', '"Standard"', '"-"', '"-"', '"-"', '"arn"']
    return " ".join(fields) + "\n"


class VisitorTests(unittest.TestCase):
    def setUp(self):
        cache = Path(r"E:\Cache")
        self.temporary = tempfile.TemporaryDirectory(prefix="wly-visitors-test-", dir=cache if cache.is_dir() else None)
        self.root = Path(self.temporary.name)
        self.addCleanup(self.temporary.cleanup)

    def analyze(self, lines, **kwargs):
        files = []
        for i, text in enumerate(lines):
            path = self.root / f"{i}.log"
            path.write_text(text, "utf-8")
            files.append(path)
        return query.analyze(files, START, END, **kwargs)

    def test_daily_and_cross_day_dedup_pages_sources_devices(self):
        a = log("11/Oct/2026:23:59:59 +0800", p="/甲/", extra={"x-ref": "https://example.com/?a=1&b=2"})
        result = self.analyze([a, log(p="/two/", ua=UA + " Mobile") + log("12/Oct/2026:11:00:00 +0800", p="/two/")])
        self.assertEqual([day["unique_visitors"] for day in result["daily"]], [1, 1])
        self.assertEqual(result["total"], {"unique_visitors": 1, "unique_ips": 1, "pageviews": 3})
        self.assertEqual(result["top_pages"], {"/two/": 2, "/甲/": 1})
        self.assertEqual(result["referrers"]["example.com"], 1)
        self.assertEqual(result["device_classes"], {"电脑": 2, "手机": 1})

    def test_beijing_boundaries_and_duplicate_requests(self):
        before = log("11/Oct/2026:15:59:59 +0000", v="before")
        inside = log("11/Oct/2026:16:00:00 +0000", v="inside")
        after = log("12/Oct/2026:16:00:00 +0000", v="after")
        result = self.analyze([before + inside + after, inside])
        self.assertEqual([day["unique_visitors"] for day in result["daily"]], [1, 1])
        self.assertEqual(result["total"]["unique_visitors"], 2)
        self.assertEqual(result["log_coverage"]["duplicate_lines"], 1)

    def test_self_monitor_bots_and_shared_ip(self):
        rows = log(v="self", extra={"x-self": "1"}) + log(path="/image.png")
        rows += log(v="shared-self", ip="203.0.113.2", extra={"x-self": "1"})
        rows += log(v="normal", ip="203.0.113.2") + log(path="/image.png", ip="203.0.113.2")
        rows += log(v="monitor", ip="203.0.113.3", extra={"x-monitor": "1"})
        rows += log(v="native-monitor", ip="203.0.113.4", ua="CockpitMonitor/1")
        rows += log(v="bot", ip="203.0.113.5", ua=UA + " Googlebot/1")
        rows += log(v="headless", ip="203.0.113.6", ua=UA.replace("Chrome", "HeadlessChrome"))
        result = self.analyze([rows])
        self.assertEqual(result["total"], {"unique_visitors": 1, "unique_ips": 1, "pageviews": 1})
        result = self.analyze([rows], include_self=True, include_monitor=True)
        self.assertEqual(result["total"], {"unique_visitors": 5, "unique_ips": 4, "pageviews": 5})

    def test_blank_id_bad_lines_aliases_and_unavailable_coverage(self):
        aliases = log(v="", extra={"v": "must-not-override-blank-x-v", "x-p": "/空格 和&字符/"})
        result = self.analyze([aliases + 'bad log\n' + log(ip="invalid") + log().replace('"host"', '"host') + log(status=404)])
        self.assertEqual(result["total"]["unique_visitors"], 0)
        self.assertEqual(result["total"]["pageviews"], 1)
        self.assertEqual(result["pageviews_without_visitor_id"], 1)
        self.assertGreaterEqual(result["log_coverage"]["malformed_lines"], 2)
        self.assertIn("/空格 和&字符/", result["top_pages"])
        empty = self.analyze([])
        self.assertFalse(empty["log_coverage"]["complete"])
        self.assertTrue(all(day["coverage"] == "no_logs" for day in empty["daily"]))
        self.assertIn("不是零访客", empty["notes"][-1])

    def test_cache_is_incremental_and_detects_corruption(self):
        args = SimpleNamespace(cache_dir=self.root / "cache", aliyun="aliyun", profile="website-images",
                               bucket=query.BUCKET, prefix=query.PREFIX)
        text = log()
        row = {"key": query.PREFIX + query.SOURCE + "-2026-10-12-10-00-00-id", "size": len(text.encode()), "etag": "etag"}
        alternate = {**row, "key": query.PREFIX + query.SOURCE + "2026-10-12-11-00-00-id"}
        outside = {**row, "key": query.PREFIX + query.SOURCE + "-2026-10-09-10-00-00-id"}
        def listing(args, prefix):
            self.assertEqual(prefix, query.PREFIX + query.SOURCE)
            return [row, alternate, outside]
        def download(command):
            Path(command[4]).write_bytes(text.encode())
            return ""
        with patch.object(query, "list_objects", side_effect=listing) as listing_mock, patch.object(query, "cli_run", side_effect=download) as cloud:
            paths, first = query.sync_logs(args, END, END)
            _, second = query.sync_logs(args, END, END)
            self.assertEqual((first["downloaded"], second["reused"], cloud.call_count), (2, 2, 2))
            self.assertEqual(listing_mock.call_count, 2)
            paths[0].write_bytes(b"x" * len(text.encode()))
            self.assertEqual(query.sync_logs(args, END, END)[1]["downloaded"], 1)

    def test_pagination_completion_and_cli_local_mode(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", bucket=query.BUCKET)
        pages = [{"schema_version": "1", "complete": False, "items": [], "returned": 0, "next_cursor": "next"},
                 {"schema_version": "1", "complete": True, "items": [], "returned": 0}]
        with patch.object(query, "cli_run", side_effect=[json.dumps(p) for p in pages]) as cloud:
            self.assertEqual(query.list_objects(args, "prefix"), [])
            self.assertEqual(cloud.call_args.args[0][-2:], ["--cli-cursor", "next"])
        self.root.joinpath("sample.log").write_text(log(), "utf-8")
        result = subprocess.run([sys.executable, "-B", "-X", "utf8", str(Path(query.__file__)), "--logs-dir", str(self.root),
                                 "--start", "2026-10-12", "--end", "2026-10-12"], capture_output=True, check=True)
        self.assertEqual(json.loads(result.stdout)["total"]["unique_visitors"], 1)


if __name__ == "__main__":
    unittest.main()
