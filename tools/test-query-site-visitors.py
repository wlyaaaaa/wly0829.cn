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

    def test_deep_read_keeps_exact_time_across_midnight_and_afternoon(self):
        for hour, minute in ((0, 10), (16, 25)):
            since = datetime(2026, 10, 12, hour, minute, tzinfo=query.TZ)
            begin, now = since - timedelta(minutes=30), since + timedelta(minutes=15)
            args = SimpleNamespace(deep_read=True, since=since)
            with patch.object(query, "sync_logs") as archive, patch.object(query, "sls_logs", return_value=[]) as realtime:
                _, _, sync, _ = query.sync_cloud(args, begin.date(), now.date(), now)
            archive.assert_not_called()
            self.assertEqual(realtime.call_args.args[1:], (begin, now + timedelta(seconds=1)))
            self.assertEqual(sync["sources"][0]["from"], begin)

    def test_sls_deep_read_filters_both_beacon_forms_without_changing_window(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test", sls_logstore="oss-log-store")
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        end = start + timedelta(hours=1)
        rows = [self.sls_row(), {**self.sls_row(), "request_uri": "/_v.gif?x-v=plain&x-p=/"}]
        page = {"meta": {"count": len(rows), "progress": "Complete"}, "data": rows}
        base = f"__topic__:oss_access_log AND bucket:{query.SOURCE}"
        for deep_read in (None, False, True):
            if deep_read is not None:
                args.deep_read = deep_read
            with self.subTest(deep_read=deep_read), patch.object(query, "cli_run", return_value=json.dumps(page)) as cloud:
                records = query.sls_logs(args, start, end)
            self.assertEqual([record["path"] for record in records], ["/_v.gif", "/_v.gif"])
            expected = base + ' AND (request_uri: "/_v.gif" OR request_uri: "%2F_v.gif")' if deep_read else base
            self.assertEqual(json.loads(cloud.call_args.args[0][-1]),
                {"from": int(start.timestamp()), "to": int(end.timestamp()), "query": expected,
                 "line": 100, "offset": 0, "reverse": False})
            cloud.assert_called_once()
            self.assertEqual(cloud.call_args.kwargs, {"timeout": 25, "attempts": 1} if deep_read else {})
        with patch.object(query, "cli_run", return_value=json.dumps({"meta": {"count": 0, "progress": "Incomplete"}, "data": []})) as cloud, patch.object(query.time, "sleep"):
            with self.assertRaises(RuntimeError):
                query.sls_logs(args, start, end)
        self.assertEqual(cloud.call_count, 2)

    def test_deep_read_cli_timeout_does_not_stack_network_retries(self):
        with patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", side_effect=subprocess.TimeoutExpired("aliyun", 25)) as run, patch.object(query.time, "sleep") as sleep:
            with self.assertRaisesRegex(RuntimeError, "连接超时"):
                query.cli_run(["aliyun", "sls", "GetLogsV2"], timeout=25, attempts=1)
        run.assert_called_once()
        self.assertEqual(run.call_args.kwargs["timeout"], 25)
        sleep.assert_not_called()

    def test_deep_read_shares_two_attempts_for_network_and_incomplete(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test",
                               sls_logstore="oss-log-store", deep_read=True)
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        end = start + timedelta(hours=1)
        eof = subprocess.CompletedProcess([], 2, b"", b"request failed: EOF secret-value")
        denied = subprocess.CompletedProcess([], 2, b"", b"AccessDenied secret-value")
        complete = subprocess.CompletedProcess([], 0, b'{"meta":{"count":0,"progress":"Complete"},"data":[]}', b"")
        incomplete = subprocess.CompletedProcess([], 0, b'{"meta":{"count":0,"progress":"Incomplete"},"data":[]}', b"")
        cases = (("eof_success", [eof, complete], None),
                 ("timeout_success", [subprocess.TimeoutExpired("aliyun", 25), complete], None),
                 ("persistent_eof", [eof, eof], "连接中断"),
                 ("access_denied", [denied], "鉴权失败"),
                 ("incomplete_eof", [incomplete, eof], "连接中断"))
        for name, results, error in cases:
            with self.subTest(case=name), patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", side_effect=results) as run, patch.object(query.time, "sleep") as sleep:
                if error:
                    with self.assertRaisesRegex(RuntimeError, error) as raised:
                        query.sls_logs(args, start, end)
                    self.assertNotIn("secret-value", str(raised.exception))
                else:
                    self.assertEqual(query.sls_logs(args, start, end), [])
                self.assertEqual(run.call_count, len(results))
                self.assertEqual([call.args for call in sleep.call_args_list], [(1,)] * (len(results) - 1))
                for call in run.call_args_list:
                    body = json.loads(call.args[0][-1])
                    self.assertEqual((body["from"], body["to"], body["offset"]),
                                     (int(start.timestamp()), int(end.timestamp()), 0))
                    self.assertEqual(call.kwargs["timeout"], 25)

    def test_deep_read_dns_setup_uses_shared_attempt_budget(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test",
                               sls_logstore="oss-log-store", deep_read=True)
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        complete = subprocess.CompletedProcess([], 0, b'{"meta":{"count":0,"progress":"Complete"},"data":[]}', b"")
        failure = query.socket.gaierror("secret-value")
        for responses, succeeds in (([failure, []], True), ([failure, failure], False)):
            with self.subTest(succeeds=succeeds), patch.object(query.socket, "getaddrinfo", side_effect=responses) as dns, patch.object(query.subprocess, "run", return_value=complete) as run, patch.object(query.time, "sleep") as sleep:
                if succeeds:
                    self.assertEqual(query.sls_logs(args, start, start + timedelta(hours=1)), [])
                    body = json.loads(run.call_args.args[0][-1])
                    self.assertEqual((body["from"], body["to"], body["offset"]),
                                     (int(start.timestamp()), int((start + timedelta(hours=1)).timestamp()), 0))
                    self.assertEqual(run.call_args.kwargs["timeout"], 25)
                else:
                    with self.assertRaises(query.CloudCommandError) as raised:
                        query.sls_logs(args, start, start + timedelta(hours=1))
                    self.assertEqual(raised.exception.category, "DNS 解析失败")
                    self.assertNotIn("secret-value", str(raised.exception))
                self.assertEqual(dns.call_count, 2)
                self.assertEqual(run.call_count, int(succeeds))
                self.assertEqual([call.args for call in sleep.call_args_list], [(1,)])

    def test_dns_failure_classification_and_normal_retry_budget(self):
        good = subprocess.CompletedProcess([], 0, b"{}", b"")
        with patch.object(query.socket, "getaddrinfo", side_effect=[query.socket.gaierror("secret-value"), query.socket.gaierror("secret-value"), []]) as dns, patch.object(query.subprocess, "run", return_value=good) as run, patch.object(query.time, "sleep") as sleep:
            self.assertEqual(query.cli_run(["aliyun", "sls", "GetLogsV2"]), "{}")
        self.assertEqual(dns.call_count, 3)
        run.assert_called_once()
        self.assertEqual([call.args for call in sleep.call_args_list], [(1,), (2,)])
        query.sls_address.cache_clear()
        with patch.object(query, "urlopen", side_effect=OSError("secret-value")), patch.object(query.time, "sleep"):
            with self.assertRaises(query.CloudCommandError) as raised:
                query.sls_address()
        self.assertEqual(raised.exception.category, "DNS 解析失败")
        self.assertNotIn("secret-value", str(raised.exception))
        relay = Mock(server_port=12345)
        with patch.object(query.socket, "getaddrinfo", return_value=[(0, 0, 0, "", ("198.18.0.1", 443))]), patch.object(query, "sls_address", side_effect=[raised.exception, "203.0.113.1"]) as resolve, patch.object(query, "ThreadingHTTPServer", return_value=relay), patch.object(query, "Thread"), patch.object(query.subprocess, "run", return_value=good), patch.object(query.time, "sleep") as sleep:
            self.assertEqual(query.cli_run(["aliyun", "sls", "GetLogsV2"]), "{}")
        self.assertEqual(resolve.call_count, 2)
        sleep.assert_called_once_with(1)
        relay.shutdown.assert_called_once()
        relay.server_close.assert_called_once()
        with patch.object(query.socket, "getaddrinfo") as dns, patch.object(query.subprocess, "run", return_value=good):
            self.assertEqual(query.cli_run(["aliyun", "oss", "ls"]), "{}")
        dns.assert_not_called()

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

    def test_invalid_grant_is_auth_failure_without_retry_or_raw_error(self):
        for marker in (b"invalid_grant", b"invalid grant"):
            failed = subprocess.CompletedProcess([], 1, b"", b"init openapi client failed: OAuth refresh " + marker + b" secret-value")
            with self.subTest(marker=marker), patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", return_value=failed) as run, patch.object(query.time, "sleep") as sleep:
                with self.assertRaises(query.CloudCommandError) as raised:
                    query.cli_run(["aliyun", "sls", "GetLogsV2"])
                self.assertEqual(raised.exception.category, "鉴权失败")
                run.assert_called_once(); sleep.assert_not_called()
            with patch.object(sys, "argv", [query.__file__, "--deep-read", "--since", "2026-10-12T10:00:00+08:00"]), patch.object(query, "sync_cloud", side_effect=raised.exception), patch("builtins.print") as output:
                self.assertEqual(query.main(), 1)
            result = json.loads(output.call_args.args[0])
            self.assertEqual((result["status"], result["error_code"]), ("error", "query_auth_failed"))
            self.assertNotIn("secret-value", output.call_args.args[0])
            self.assertNotIn("visitors", result)

    def test_cloud_failure_is_error_and_not_zero_visitors(self):
        with patch.object(sys, "argv", [query.__file__, "--start", "2026-10-12", "--end", "2026-10-12"]), patch.object(query, "sync_cloud", side_effect=RuntimeError("SLS unavailable")), patch("builtins.print") as output:
            self.assertEqual(query.main(), 1)
        result = json.loads(output.call_args.args[0])
        self.assertEqual(result["status"], "error")
        self.assertNotIn("total", result)

    def test_main_failure_codes_are_fixed_and_never_echo_errors(self):
        categories = {"连接超时": "query_connection_timeout", "DNS 解析失败": "query_dns_failed",
                      "连接中断": "query_connection_interrupted", "代理拒绝": "query_proxy_refused",
                      "鉴权失败": "query_auth_failed", "请求参数无效": "query_invalid_request",
                      "CLI 初始化失败": "query_cli_init_failed", "CLI 调用失败": "query_cli_failed"}
        cases = [(query.CloudCommandError(category, "secret-value"), code) for category, code in categories.items()]
        cases += [(RuntimeError("SLS 查询未完成；未将部分日志当作完整结果"), "query_incomplete"),
                  (ValueError("Unknown SLS response schema"), "query_invalid_response"),
                  (OSError("secret-value"), "query_io_error"), (RuntimeError("secret-value"), "query_failed")]
        for error, code in cases:
            with self.subTest(code=code), patch.object(sys, "argv", [query.__file__, "--deep-read", "--since", "2026-10-12T10:00:00+08:00"]), patch.object(query, "sync_cloud", side_effect=error), patch("builtins.print") as output:
                self.assertEqual(query.main(), 1)
                result = json.loads(output.call_args.args[0])
                self.assertEqual((result["status"], result["error_code"]), ("error", code))
                self.assertNotIn("secret-value", output.call_args.args[0])
                self.assertNotIn("visitors", result)

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
        self.assertEqual(result["page_dwell"]["/"]["last_report_at"], "2026-10-12T10:00:20+08:00")
        self.assertEqual(result["page_dwell"]["/new/"]["unknown_opens"], 1)
        self.assertIsNone(result["page_dwell"]["/new/"]["last_report_at"])
        self.assertEqual(result["navigation_timing_ms"]["广东省/电信"]["load"], {"median": 300, "samples": 1})
        self.assertEqual(result["app_pageviews"]["企业微信"], 1)
        self.assertEqual(result["visitor_cohorts"]["returning_observed_before_window"], 1)
        self.assertEqual(result["visitor_cohorts"]["first_observed_in_window"], 1)
        self.assertEqual(len(result["possible_sources"]["visitors"]), 2)
        self.assertTrue(all(r["conclusion"] == "可能" for r in result["possible_sources"]["visitors"]))
        self.assertNotIn("203.0.113.1", json.dumps(result, default=str))
        self.assertTrue(history["first_seen"]["visitor-B"].startswith("2026-10-12"))

    def test_live_visible_reports_dedup_instances_without_leave(self):
        rows = log(extra={"x-id": "one", "x-event": "view"})
        for second, instance, event, visible in ((15, "one", "heartbeat", "60"), (20, "one", "resume", "60"),
                (30, "one", "heartbeat", "90"), (35, "one", "heartbeat", "80"), (40, "two", "view", "0"),
                (45, "two", "heartbeat", "45"), (50, "two", "heartbeat", "NaN"), (55, "two", "resume", "-1")):
            rows += log(f"12/Oct/2026:10:00:{second:02d} +0800", extra={"x-id": instance, "x-event": event, "x-visible": visible})
        rows += log("12/Oct/2026:10:00:59 +0800", extra={"x-id": "two", "x-event": "perf", "x-visible": "999"})
        result = self.analyze([rows], deep_since=datetime(2026, 10, 12, 10, tzinfo=query.TZ))
        self.assertEqual(result["total"]["pageviews"], 2)
        self.assertEqual(result["page_dwell"]["/"]["observed_seconds"], 135)
        self.assertEqual(result["page_dwell"]["/"]["samples"], 2)
        self.assertEqual(result["page_dwell"]["/"]["unknown_opens"], 0)
        self.assertEqual(result["page_dwell"]["/"]["last_report_at"], "2026-10-12T10:00:45+08:00")
        self.assertEqual(result["visitor_dwell"]["visitor-A"]["total"]["observed_seconds"], 135)
        self.assertEqual(result["visitor_dwell"]["visitor-A"]["total"]["last_report_at"], "2026-10-12T10:00:45+08:00")
        self.assertEqual(result["deep_read"]["visitors"][0]["pages"], [{"path": "/", "visible_seconds": 135}])

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

    def test_entry_first_attribution_dedup_history_and_dwell(self):
        history = {}
        entry = log("11/Oct/2026:23:59:59 +0800", p="/cv/", extra={"x-event": "entry", "x-entry": "cv"})
        rows = log(extra={"x-id": "home", "x-entry": "cv"}) + entry + entry
        rows += log("12/Oct/2026:10:00:20 +0800", extra={"x-id": "home", "x-event": "leave", "x-visible": "15"})
        rows += log("12/Oct/2026:11:00:00 +0800", extra={"x-entry": "other"}) + log(v="direct")
        rows += log(v="self", extra={"x-self": "1", "x-entry": "cv"}) + log(v="bot", ua=UA + " Googlebot", extra={"x-entry": "cv"})
        result = self.analyze([rows], history=history, networks=Mock(return_value={"province": "广东省", "city": "深圳市", "operator": "电信", "organization": "AS123"}))
        group = result["entry"]["cv"]
        self.assertEqual((group["label"], group["unique_visitors"], group["first_at"]), ("简历来的（/cv）", 1, "2026-10-11T23:59:59+08:00"))
        self.assertEqual(group["visitors"][0]["cities"], ["深圳市"])
        self.assertEqual(group["visitors"][0]["pages"]["/"]["observed_seconds"], 15)
        self.assertNotIn("/cv/", group["visitors"][0]["pages"])
        self.assertEqual(result["entry"]["unmarked"]["unique_visitors"], 1)
        self.assertNotIn("other", result["entry"])
        again = self.analyze([log(extra={"x-entry": "other"})], history=history)
        self.assertEqual(again["entry"]["cv"]["unique_visitors"], 1)
        self.assertEqual(self.analyze([])["entry"]["cv"]["unique_visitors"], 0)

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
