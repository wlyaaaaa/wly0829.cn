#!/usr/bin/env python3
"""Synthetic OSS logs only. Run: python -B -X utf8 tools/test-query-site-visitors.py"""
from datetime import date, datetime, timedelta
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch
from urllib.parse import quote, urlencode

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

    def sls_row(self):
        return {"__time__": str(datetime(2026, 10, 12, 10, tzinfo=query.TZ).timestamp()),
                "client_ip": "203.0.113.1", "user_agent": UA, "http_status": "200", "http_method": "GET",
                "bucket": query.SOURCE, "operation": "GetObject", "request_id": "shared",
                "request_uri": quote("/_v.gif?" + urlencode({"x-v": "visitor-A", "x-p": "/甲&/",
                    "x-ref": "https://example.com/?a=1&b=2", "x-self": "0"}), safe="")}

    def test_sls_encoded_uri_cross_source_dedup_and_exclusion(self):
        row = query.parse_sls_row(self.sls_row())
        self.assertEqual((row["path"], row["params"]["p"], row["params"]["ref"]), ("/_v.gif", "/甲&/", "example.com"))
        archived = log(p="/甲&/", extra={"x-ref": "https://example.com/?a=1&b=2", "x-self": "0"}, request_id="shared")
        marked = {**self.sls_row(), "request_id": "self", "request_uri": "/_v.gif?x-v=self&x-self=1"}
        result = self.analyze([archived], extra_records=[row, query.parse_sls_row(marked)])
        self.assertEqual(result["total"], {"unique_visitors": 1, "unique_ips": 1, "pageviews": 1})
        self.assertEqual(result["log_coverage"]["duplicate_lines"], 1)
        self.assertEqual(result["filtered_lines"]["self"], 1)
        alternate = self.sls_row()
        alternate["User-Agent"] = alternate.pop("user_agent")
        self.assertEqual(query.parse_sls_row(alternate)["ua"], UA)
        protocol_row = {**self.sls_row(), "request_uri": "/_v.gif?x-v=visitor-A&x-self=1&x-monitor=0 HTTP/1.1"}
        self.assertEqual(query.parse_sls_row(protocol_row)["params"]["monitor"], "0")
        self.assertEqual(query.parse_sls_row({**protocol_row, "request_uri": quote(protocol_row["request_uri"], safe="")})["params"]["monitor"], "0")

    def test_cross_source_resource_exclusion_and_archive_cutoff(self):
        self.root.joinpath("boundary.log").write_text(log("05/Oct/2026:11:59:50 +0800", path="/image.png") + log("05/Oct/2026:12:00:31 +0800", v="too-late"), "utf-8")
        cutoff = datetime(2026, 10, 5, 12, tzinfo=query.TZ)
        marked = {**self.sls_row(), "__time__": cutoff.timestamp(), "request_uri": "/_v.gif?x-v=self&x-self=1"}
        result = query.analyze([self.root / "boundary.log"], cutoff.date(), cutoff.date(),
            extra_records=[query.parse_sls_row(marked)], file_range=(cutoff - timedelta(minutes=1), cutoff + timedelta(seconds=30)))
        self.assertEqual(result["total"], {"unique_visitors": 0, "unique_ips": 0, "pageviews": 0})
        self.assertEqual(result["filtered_lines"]["marked_resource_window"], 1)

    def test_rolling_retention_and_source_windows(self):
        now = datetime(2026, 10, 12, 12, tzinfo=query.TZ)
        windows = query.source_windows(date(2026, 10, 5), END, now)
        self.assertEqual([window[0] for window in windows], ["oss_archive", "sls_realtime"])
        self.assertEqual(windows[1][1], now - timedelta(days=7))
        self.assertEqual(windows[0][2], windows[1][1] + timedelta(seconds=30))
        self.assertEqual(windows[1][2], now + timedelta(seconds=1))
        self.assertEqual(query.source_windows(END, END, now)[0][0], "sls_realtime")
        self.assertEqual(query.source_windows(date(2026, 10, 1), date(2026, 10, 1), now)[0][0], "oss_archive")
        with patch.object(query, "sync_logs", return_value=([], {"objects": 0})) as archive, patch.object(query, "sls_logs", return_value=[]) as realtime:
            _, _, sync, _ = query.sync_cloud(SimpleNamespace(), date(2026, 10, 5), END, now)
        self.assertEqual(archive.call_args.args[1:], (date(2026, 10, 4), date(2026, 10, 5)))
        self.assertEqual(realtime.call_args.args[1:], windows[1][1:])
        self.assertEqual([source["source"] for source in sync["sources"]], ["oss_archive", "sls_realtime"])

    def test_sls_pagination_retries_and_schema(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test", sls_logstore="oss-log-store")
        def page(data, progress="Complete"):
            return {"meta": {"count": len(data), "progress": progress}, "data": data}
        row = self.sls_row()
        pages = [page([], "Incomplete"), page([row] * 100), page([row])]
        stamp = datetime(2026, 10, 12, tzinfo=query.TZ)
        with patch.object(query, "cli_run", side_effect=[json.dumps(p) for p in pages]) as cloud, patch.object(query.time, "sleep"):
            self.assertEqual(len(query.sls_logs(args, stamp, stamp + timedelta(days=1))), 101)
        bodies = [json.loads(call.args[0][-1]) for call in cloud.call_args_list]
        self.assertEqual([body["offset"] for body in bodies], [0, 0, 100])
        self.assertIn(query.SOURCE, bodies[0]["query"])
        with patch.object(query, "cli_run", return_value=json.dumps(page([row], "Incomplete"))) as cloud, patch.object(query.time, "sleep"):
            with self.assertRaises(RuntimeError):
                query.sls_logs(args, stamp, stamp + timedelta(days=1))
            self.assertEqual(cloud.call_count, 3)
        with patch.object(query, "cli_run", return_value=json.dumps({"meta": {"count": 1, "progress": "Complete"}, "data": []})):
            with self.assertRaises(ValueError):
                query.sls_logs(args, stamp, stamp + timedelta(days=1))
        with self.assertRaises(ValueError):
            query.parse_sls_row({**row, "request_id": "-"})

    def test_sls_relay_preserves_oauth_and_retries_network_failures(self):
        relay = Mock(server_port=12345)
        failed = SimpleNamespace(returncode=2, stdout=b"", stderr=b"request failed: EOF")
        good = SimpleNamespace(returncode=0, stdout=b'\xef\xbb\xbf{"data":[]}', stderr=b"")
        with patch.object(query.socket, "getaddrinfo", return_value=[(0, 0, 0, "", ("198.18.0.1", 443))]), patch.object(query, "sls_address", return_value="203.0.113.1"), patch.object(query, "ThreadingHTTPServer", return_value=relay), patch.object(query, "Thread"), patch.object(query.subprocess, "run", side_effect=[failed, subprocess.TimeoutExpired("aliyun", 60), good]) as run, patch.object(query.time, "sleep") as sleep:
            self.assertEqual(query.cli_run(["aliyun", "sls", "GetLogsV2"]), '{"data":[]}')
        self.assertEqual(run.call_count, 3)
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [1, 2])
        env = run.call_args.kwargs["env"]
        self.assertIn("oauth.aliyun.com", env["NO_PROXY"].split(","))
        self.assertNotIn("aliyuncs.com", env["NO_PROXY"])
        self.assertEqual(env["HTTPS_PROXY"], "http://127.0.0.1:12345")
        self.assertEqual(run.call_args.kwargs["timeout"], 60)
        relay.shutdown.assert_called_once()
        relay.server_close.assert_called_once()

    def test_cli_failures_are_classified_without_secrets_or_auth_retries(self):
        for service, message, attempts, category in (("sls", b"AccessDenied secret-value", 1, "鉴权失败"), ("sls", b"request failed: EOF secret-value", 3, "连接中断"), ("oss", b"request failed: EOF secret-value", 1, "连接中断")):
            failed = SimpleNamespace(returncode=2, stdout=b"", stderr=message)
            with patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", return_value=failed) as run, patch.object(query.time, "sleep"):
                with self.assertRaises(RuntimeError) as error:
                    query.cli_run(["aliyun", service, "GetLogsV2"])
            self.assertEqual(run.call_count, attempts)
            self.assertIn(category, str(error.exception))
            self.assertNotIn("secret-value", str(error.exception))

    def test_cloud_failure_is_error_and_not_zero_visitors(self):
        with patch.object(sys, "argv", [query.__file__, "--start", "2026-10-12", "--end", "2026-10-12"]), patch.object(query, "sync_cloud", side_effect=RuntimeError("SLS unavailable")), patch("builtins.print") as output:
            self.assertEqual(query.main(), 1)
        result = json.loads(output.call_args.args[0])
        self.assertEqual(result["status"], "error")
        self.assertNotIn("total", result)

    def test_leave_dedup_speed_apps_cohorts_possible_sources_and_no_ips(self):
        location = {"province": "广东省", "city": "深圳市", "operator": "电信", "organization": "AS123 Example Network"}
        networks = Mock(return_value=location)
        rows = log(extra={"x-id": "one", "x-event": "view", "x-ttfb": "100", "x-dom": "200"}, ua=UA + " wxwork MicroMessenger")
        rows += log("12/Oct/2026:10:00:05 +0800", extra={"x-id": "one", "x-event": "perf", "x-load": "300"}, ua=UA + " wxwork MicroMessenger")
        for second, visible in ((10, "8"), (11, "8"), (20, "15")):
            rows += log(f"12/Oct/2026:10:00:{second:02d} +0800", extra={"x-id": "one", "x-event": "leave", "x-visible": visible}, ua=UA + " wxwork MicroMessenger")
        rows += log("12/Oct/2026:10:01:00 +0800", v="visitor-B", p="/new/", extra={"x-event": "view", "x-first": "2020-01-01"})
        history = {"first_seen": {"visitor-A": "2026-10-10T12:00:00+08:00"}}
        result = self.analyze([rows], networks=networks, history=history, city="深圳", org="example")
        self.assertEqual(result["total"]["pageviews"], 2)
        self.assertEqual(result["page_dwell"]["/"]["observed_seconds"], 15)
        self.assertEqual(result["page_dwell"]["/new/"]["unknown_opens"], 1)
        self.assertEqual(result["navigation_timing_ms"]["广东省/电信"]["load"], {"median": 300, "samples": 1})
        self.assertEqual(result["app_pageviews"]["企业微信"], 1)
        self.assertEqual(result["visitor_cohorts"]["returning_observed_before_window"], 1)
        self.assertEqual(result["visitor_cohorts"]["first_observed_in_window"], 1)
        self.assertEqual(len(result["possible_sources"]["visitors"]), 2)
        self.assertTrue(all(r["conclusion"] == "可能" for r in result["possible_sources"]["visitors"]))
        self.assertNotIn("203.0.113.1", json.dumps(result, default=str))
        self.assertTrue(history["first_seen"]["visitor-B"].startswith("2026-10-12"))

    def test_time_gap_fallback_invalid_metrics_and_ai_lower_bound(self):
        rows = log(extra={"x-id": "one", "x-load": "NaN"})
        rows += log("12/Oct/2026:10:00:20 +0800", p="/two/", extra={"x-id": "two", "x-visible": "-1"})
        rows += log(ua="GPTBot/1.0", path="/image.png") + log(ua="ClaudeBot/1.0", status=404)
        result = self.analyze([rows])
        self.assertEqual(result["page_dwell"]["/"]["observed_seconds"], 20)
        self.assertEqual(result["page_dwell"]["/two/"]["unknown_opens"], 1)
        self.assertEqual((result["visitor_dwell"]["visitor-A"]["total"]["observed_seconds"], result["visitor_dwell"]["visitor-A"]["total"]["unknown_opens"], set(result["visitor_dwell"]["visitor-A"]["pages"])), (20, 1, {"/", "/two/"}))
        self.assertEqual(result["navigation_timing_ms"], {})
        self.assertEqual(result["ai_crawler_lower_bound"]["by_ua"]["GPTBot"]["requests"], 1)
        self.assertEqual(result["total"]["pageviews"], 2)
        self.assertEqual([query.app_name(UA + token) for token in (" MicroMessenger", " DingTalk", " Lark", " bosszp")], ["微信", "钉钉", "飞书/Lark", "Boss 直聘"])

    def test_deep_read_thresholds_sessions_watermark_exclusions_and_no_ips(self):
        rows = ""
        for visitor, page, seconds, minute, extra, ua in (("project", "/projects/demo/", 120, "02", {}, UA), ("project", "/projects/demo/", 120, "03", {}, UA),
                ("home", "/", 120, "02", {}, UA), ("short", "/projects/demo/", 119, "02", {}, UA), ("self", "/", 999, "02", {"x-self": "1"}, UA),
                ("monitor", "/", 999, "02", {"x-monitor": "1"}, UA), ("bot", "/", 999, "02", {}, UA + " Googlebot"), ("old", "/", 120, "00", {}, UA)):
            rows += log(f"12/Oct/2026:10:{minute}:00 +0800", v=visitor, p=page, ua=ua, extra={"x-id": page, "x-event": "leave", "x-visible": str(seconds), **extra})
        for visitor, hours in (("multi", (10, 10, 10)), ("split", (10, 10, 11))):
            for index, hour in enumerate(hours):
                rows += log(f"12/Oct/2026:{hour}:0{index + 2}:00 +0800", v=visitor, p=f"/page-{index}", extra={"x-id": str(index), "x-event": "leave", "x-visible": "60"})
        rows += log("12/Oct/2026:10:02:00 +0800", v="estimate", p="/", extra={"x-event": "view"}) + log("12/Oct/2026:10:04:00 +0800", v="estimate", p="/second", extra={"x-event": "view"})
        since = datetime(2026, 10, 12, 10, 1, tzinfo=query.TZ)
        output = self.analyze([rows], deep_since=since)["deep_read"]
        people = {person["id"]: person for person in output["visitors"]}
        self.assertEqual(set(people), {"project", "home", "multi"})
        self.assertEqual(people["project"]["pages"], [{"path": "/projects/demo", "visible_seconds": 120}])
        self.assertEqual(sum(page["visible_seconds"] for page in people["multi"]["pages"]), 180)
        self.assertEqual(people["project"]["first_at"], "2026-10-12T10:02:00+08:00")
        self.assertNotIn("203.0.113.1", json.dumps(output))
        self.assertEqual(set(json.loads(subprocess.run([sys.executable, "-B", "-X", "utf8", query.__file__, "--logs-dir", str(self.root), "--cache-dir", str(self.root), "--deep-read", "--since", since.isoformat(), "--json"], capture_output=True, check=True).stdout)), {"checked_at", "visitors"})

    def test_offline_ipv4_ipv6_network_database_boundaries(self):
        root = self.root / "networks"
        root.mkdir()
        for version, address in ((4, "203.0.113.1"), (6, "2001:db8::1")):
            ip = query.ipaddress.ip_address(address)
            data = bytearray(524544)
            query.struct.pack_into("<H", data, 0, 3)
            query.struct.pack_into("<HH", data, 16, version, 4)
            region = "中国|广东省|深圳市|电信|CN".encode()
            pointer = len(data)
            data.extend(region)
            index = len(data)
            packed = ip.packed[::-1] if version == 4 else ip.packed
            data.extend(packed * 2 + query.struct.pack("<HI", len(region), pointer))
            query.struct.pack_into("<II", data, 256 + int.from_bytes(ip.packed[:2], "big") * 8, index, index)
            (root / f"ip2region_v{version}.xdb").write_bytes(data)
        with query.gzip.open(root / "ip2asn-combined.tsv.gz", "wt") as stream:
            stream.write("203.0.113.1\t203.0.113.1\t123\tCN\tExample Network\n2001:db8::1\t2001:db8::1\t456\tCN\tExample IPv6\n")
        networks = query.OfflineNetworks(self.root, download=False)
        networks.prepare(["203.0.113.1", "2001:db8::1"])
        self.assertEqual(networks("203.0.113.1")["city"], "深圳市")
        self.assertEqual(networks("2001:db8::1")["organization"], "AS456 Example IPv6")
        self.assertEqual(networks("203.0.113.2")["province"], "未知")

    def test_month_and_around_cli_windows(self):
        networks = Mock()
        networks.metadata = {}
        for arguments, expected in ((["--month", "2026-02"], (date(2026, 2, 1), date(2026, 2, 28))),
                                    (["--around", "2026-10-12", "--city", "深圳", "--days", "14"], (date(2026, 10, 5), date(2026, 10, 18)))):
            with patch.object(sys, "argv", [query.__file__, "--cache-dir", str(self.root), *arguments]), patch.object(query, "sync_cloud", return_value=([], [], {"sources": []}, None)) as cloud, patch.object(query, "OfflineNetworks", return_value=networks), patch("builtins.print"):
                self.assertEqual(query.main(), 0)
                self.assertEqual(cloud.call_args.args[1:3], expected)

    def test_database_failures_preserve_counts_and_report_unknown(self):
        for phase in ("init", "prepare"):
            networks = Mock(); networks.prepare.side_effect = EOFError("203.0.113.1 must stay local")
            with patch.object(sys, "argv", [query.__file__, "--cache-dir", str(self.root), "--start", "2026-10-12", "--end", "2026-10-12"]), patch.object(query, "sync_cloud", return_value=([], [query.parse_line(log())], {"sources": []}, None)), patch.object(query, "OfflineNetworks", return_value=networks, side_effect=ValueError("broken partial cache") if phase == "init" else None), patch("builtins.print") as printed:
                self.assertEqual(query.main(), 0); result = json.loads(printed.call_args.args[0])
                self.assertEqual(result["total"]["pageviews"], 1); self.assertEqual(result["region_pageviews"], {"未知/未知": 1}); self.assertEqual(result["offline_network_databases"]["status"], "error"); self.assertNotIn("203.0.113.1", json.dumps(result))

if __name__ == "__main__":
    unittest.main()
