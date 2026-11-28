#!/usr/bin/env python3
"""Synthetic OSS logs only. Run: python -B -X utf8 tools/test-query-site-visitors.py"""
from datetime import date, datetime, timedelta
import importlib.util
import io
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


def log(time="12/Oct/2026:10:00:00 +0800", v="visitor-A", p="/", ip="93.184.216.34", ua=UA,
        extra=None, path="/_v.gif", status=200, request_id=None):
    params = {"x-v": v, "x-p": p, "x-ref": "", "x-audience": "external", "x-event": "view", **(extra or {})}
    uri = path + "?" + urlencode(params)
    fields = [ip, "-", "-", f"[{time}]", json.dumps(f"GET {uri} HTTP/1.1"), str(status), "43", "1",
              '"https://wly0829.cn/"', json.dumps(ua), '"host"', json.dumps(request_id or time + uri),
              '"true"', '"-"', '"GetObject"', json.dumps(query.SOURCE), json.dumps(path.lstrip("/")),
              "43", "1", '"-"', "100", '"-"', "-", '"-"', '"Standard"', '"-"', '"-"', '"-"', '"arn"']
    return " ".join(fields) + "\n"


class VisitorTests(unittest.TestCase):
    def seed_exit(self, cache):
        cache.mkdir(exist_ok=True)
        instants = [datetime(2026, 10, 12, 9, tzinfo=query.TZ) + timedelta(minutes=i) for i in range(0, 181, 30)]
        (cache / 'internal-visitor-probes.txt').write_text(''.join(f'{i}\n' for i in range(len(instants))))
        self.root.joinpath('probes.log').write_text(''.join(self.probe(at, str(i)) for i, at in enumerate(instants)))

    def probe(self, when, nonce, ip='93.184.216.36'):
        return log(when.strftime('%d/%b/%Y:%H:%M:%S %z'), ip=ip, extra={'x-network-probe': nonce}).replace('GET /', 'HEAD /')

    def era_cli(self, *args):
        if not {'--freeze-legacy', '--legacy-archive'}.intersection(map(str, args)):
            self.seed_exit(self.root / "cache")
        with patch.object(sys, "argv", [query.__file__, "--cache-dir", str(self.root / "cache"), *map(str, args)]), patch("builtins.print") as printed:
            self.assertEqual(query.main(), 0)
            return json.loads(printed.call_args.args[0])

    def era_fixture(self):
        (self.root / "visits.log").write_text(log(v="old") + log("12/Oct/2026:11:00:00 +0800", v="new", p="/cv/", extra={"x-entry": "cv", "x-event": "entry", "x-cv-session": "new-session"})
                                              + log("12/Oct/2026:11:00:01 +0800", v="new", extra={"x-entry": "cv", "x-cv-session": "new-session"}), "utf-8")
        return ("--logs-dir", self.root, "--start", "2026-10-12", "--end", "2026-10-12")

    def test_unconfigured_era_keeps_existing_counts(self):
        result = self.era_cli(*self.era_fixture())
        self.assertEqual(result["total"], {"unique_visitors": 2, "unique_ips": 1, "pageviews": 2})
        self.assertEqual(result["site_scope"]["mode"], "all_observed")

    def test_all_visit_dimensions_share_the_external_beacon_filter(self):
        old = log("11/Oct/2026:10:00:00 +0800", v="old", extra={"x-audience": ""})
        page_open = log(v="outside", p="/public/", ip="::ffff:93.184.216.34", extra={"x-id": "outside-page"}, request_id="open")
        rows = page_open + page_open.replace('"open"', '"retry"') + log(v="resource", path="/image.webp", ip="93.184.216.35")
        rows += log(v="paired", extra={"x-audience": "internal"}) + log(v="owner", extra={"x-self": "1"})
        rows += log(v="lan", ip="192.168.1.5") + log(v="tailnet", ip="100.73.0.5") + log(v="nat", ip="93.184.216.36")
        (self.root / "visits.log").write_text(old + rows, "utf-8")
        result = self.era_cli("--logs-dir", self.root, "--start", START, "--end", END)
        self.assertEqual((result["count_scope"], result["external_since"]), ("external_only", "2026-10-12T10:00:00+08:00"))
        self.assertEqual(result["total"], {"unique_visitors": 1, "unique_ips": 1, "pageviews": 1})
        self.assertEqual((result["top_pages"], result["device_classes"]), ({"/public/": 1}, {"电脑": 1}))
        self.assertEqual((result["daily"][0]["coverage"], result["daily"][1]["pageviews"]), ("before_external_scope", 1))

    def test_launch_exact_boundary_applies_to_totals_cv_and_deep_read(self):
        args = self.era_fixture(); config = self.root / "cache/site-era.json"; config.parent.mkdir()
        config.write_text('{"launch_at":"2026-10-12T11:00:00+08:00"}', "utf-8")
        result = self.era_cli(*args)
        self.assertEqual(result["total"]["unique_visitors"], 1)
        self.assertEqual(result["log_coverage"]["first_observed"], "2026-10-12T11:00:00+08:00")
        self.assertEqual(result["entry"]["cv"]["unique_visitors"], 1)
        self.assertEqual(self.era_cli(*args, "--cv")["cv"]["count"], 1)
        deep = self.era_cli("--logs-dir", self.root, "--deep-read", "--since", "2026-10-12T09:00:00+08:00")
        self.assertEqual(deep["site_scope"]["mode"], "new_site")
        launch = datetime.fromisoformat("2026-10-12T11:00:00+08:00")
        with patch.object(query, "sls_logs", return_value=[]) as sls:
            query.sync_cloud(SimpleNamespace(deep_read=False, launch_at=launch), END, END, launch + timedelta(hours=1))
            self.assertEqual(sls.call_args.args[1], launch)

    def test_event_capture_keeps_actions_and_two_entries_out_of_ordinary_counts(self):
        self.seed_exit(self.root)
        shown = self.root.joinpath('probes.log').read_text()
        for visitor, p, entry in [('resume', '/cv/', 'cv'), ('meeting', '/live/', 'live-cv')]:
            props = {'x-id': visitor, 'x-entry': entry, 'x-cv-session': visitor}
            shown += log(v=visitor, p=p, extra=props | {'x-event': 'entry'}) + log(v=visitor, p='/', extra=props)
        shown += log(v='action-only', p='/live/?ignored=1', extra={'x-event': 'action', 'x-action': 'email_copy', 'x-entry': 'cv'})
        events = []
        result = self.analyze([shown], external_only=True, cv_only=True, exit_probes={str(i) for i in range(7)},
                              on_events=lambda received, *_: events.extend(row['params'] for row in received))
        self.assertEqual([(p['v'], p['p']) for p in events if p['event'] == 'action'], [('action-only', '/live/')])
        self.assertEqual((result['total']['pageviews'], result['total']['unique_visitors'], result['cv']['count']), (2, 2, 1))

    def test_frozen_legacy_reads_old_records_offline_and_never_appends(self):
        args = self.era_fixture(); config = self.root / "era.json"; archive = self.root / "legacy.json.gz"
        config.write_text('{"launch_at":"2026-10-12T11:00:00+08:00"}', "utf-8")
        frozen = self.era_cli(*args, "--era-config", config, "--freeze-legacy", archive)
        self.addCleanup(archive.chmod, 0o666)
        self.assertEqual(frozen["records"], 1)
        self.assertFalse(archive.stat().st_mode & 0o222)
        before = archive.read_bytes()
        with patch.object(query, "sync_cloud", side_effect=AssertionError("no cloud")), patch.object(query, "OfflineNetworks", side_effect=AssertionError("no download")):
            result = self.era_cli("--legacy-archive", archive, "--era-config", config)
        self.assertEqual(result["total"]["pageviews"], 1)
        self.assertEqual(set(result["visitor_dwell"]), {"old"})
        self.assertEqual(result["site_scope"]["mode"], "frozen_legacy")
        with self.assertRaises(FileExistsError):
            query.freeze_legacy(archive, [], [], None, datetime.fromisoformat("2026-10-12T11:00:00+08:00"), START, END, {"sources": []})
        self.assertEqual(archive.read_bytes(), before)

    def test_page_and_entry_filters_select_cv_without_counting_redirect_as_read(self):
        args = self.era_fixture()
        result = self.era_cli(*args, "--page", "/cv")
        self.assertEqual((result["total"]["unique_visitors"], result["total"]["pageviews"]), (1, 0))
        self.assertEqual(result["page_dwell"], {})
        self.assertEqual(self.era_cli(*args, "--entry", "cv")["total"]["pageviews"], 1)

    def test_new_site_does_not_inherit_legacy_first_seen_or_entry(self):
        cache = self.root / "cache"; cache.mkdir()
        (cache / "site-era.json").write_text('{"launch_at":"2026-10-12T11:00:00+08:00"}', "utf-8")
        old = '{"first_seen":{"same":"2026-10-01T10:00:00+08:00"},"first_entry":{"same":{"entry":"cv","first_at":"2026-10-01T10:00:00+08:00"}}}'
        (cache / "visitor-history.json").write_text(old, "utf-8")
        with patch.object(query, "sync_cloud", return_value=([self.root / 'probes.log'], [query.parse_line(log("12/Oct/2026:11:00:00 +0800", v="same"))], {"sources": []}, None)), patch.object(query, "OfflineNetworks", side_effect=ValueError("not cached")):
            result = self.era_cli("--start", "2026-10-12", "--end", "2026-10-12")
        self.assertEqual(result["entry"]["cv"]["unique_visitors"], 0)
        self.assertEqual((cache / "visitor-history.json").read_text("utf-8"), old)

    def test_start_site_era_previews_and_refuses_a_different_stamp(self):
        cache = self.root / "new cache"
        config = cache / "site-era.json"
        cli = ["start-site-era", "--cache-dir", str(cache), "--launch-at", "2026-10-12T18:00:00+00:00"]
        with patch("builtins.print") as printed, patch.object(query, "sync_cloud", side_effect=AssertionError("no cloud")):
            self.assertEqual(query.main(cli), 0)
        self.assertFalse(cache.exists())
        self.assertIn("2026-10-13T02:00:00+08:00", printed.call_args_list[0].args[0])
        self.assertIn("--end 2026-10-13", printed.call_args.args[0])
        cache.mkdir()
        original = '{"launch_at":"2026-10-12T18:01:00+00:00"}'
        config.write_text(original, "utf-8")
        with patch.object(query, "live_producer", side_effect=AssertionError("no live write")), patch("sys.stderr"):
            with self.assertRaises(SystemExit) as refusal:
                query.main(cli + ["--execute"])
        self.assertEqual(refusal.exception.code, 1)
        with self.assertRaises(ValueError):
            query.initialize_era(config, datetime.fromisoformat(cli[-1]))
        self.assertEqual(config.read_text("utf-8"), original)

    def test_start_site_era_replaces_registered_legacy_traffic(self):
        live = query.live_producer()
        now = datetime.now(query.TZ)
        launch = (now - timedelta(minutes=5)).replace(microsecond=0)
        earlier = (launch - timedelta(minutes=1)).strftime("%d/%b/%Y:%H:%M:%S %z")
        cv = {"x-entry": "cv", "x-cv-session": "old-session"}
        rows = [query.parse_line(log(earlier, p="/cv/", extra={**cv, "x-event": "entry"})),
                query.parse_line(log(earlier, p="/old/", extra={**cv, "x-id": "old-page"})),
                query.parse_line(log(earlier, p="/old/", extra={**cv, "x-id": "old-page", "x-event": "leave", "x-visible": "20"}))]
        proofs = [query.parse_line(self.probe(launch + timedelta(minutes=minutes), str(minutes))) for minutes in (-20, 15)]
        old = query.analyze([], launch.date() - timedelta(days=1), now.date(), extra_records=rows + proofs, external_only=True, exit_probes={'-20', '15'})
        public, owner = [self.root / "registered" / (audience + ".json") for audience in ("public", "owner")]
        live.write(self.root / ".publish/private/live-project.json", {"public": str(public), "owner": str(owner)})
        live.save(self.root, "publication", {}, now.isoformat(), "", routes=["/old/"])
        # An in-flight old query may get a later timestamp than the first new-era query.
        old_checked = (now + timedelta(minutes=1)).isoformat()
        live.visitors(self.root, old, old_checked)
        self.assertEqual(live.read(owner)["metrics"]["cv_visitors"], 1)
        self.assertEqual(live.read(public)["metrics"]["dwell"][0]["observed_seconds"], 20)
        cache = self.root / "cache"
        cli = ["start-site-era", "--cache-dir", str(cache), "--launch-at", launch.isoformat(), "--execute"]
        with patch.object(query, "ROOT", self.root), patch.object(query, "sync_cloud", return_value=([], rows, {"sources": []}, None)), \
                patch.object(query, "OfflineNetworks", side_effect=ValueError("no network")), patch("builtins.print"):
            with patch.object(live, "write", side_effect=PermissionError), patch("sys.stderr"):
                self.assertEqual(query.main(cli), 1)
            self.assertEqual(query.read_launch_at(cache / "site-era.json"), launch)
            self.assertEqual(query.main(cli), 0)
        self.assertEqual(query.read_launch_at(cache / "site-era.json"), launch)
        for path in (public, owner):
            data = live.read(path)
            self.assertEqual(data["visitor_launch_at"], launch.isoformat())
            metrics = data["metrics"]
            self.assertEqual((metrics["visitors"], metrics["pageviews"], metrics["top_pages"], metrics["dwell"]), (None, None, None, None))
        self.assertIsNone(live.read(owner)["metrics"]["cv_visitors"])
        self.assertNotIn("cv_visitors", live.read(public)["metrics"])
        with self.assertRaises(ValueError):
            live.visitors(self.root, old, old_checked)
        self.assertIsNone(live.read(owner)["metrics"]["pageviews"])

    def test_live_package_distinguishes_assets_and_references(self):
        sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
        import live_project
        objects = {k: dict(key=k, content_type=t, bytes=n) for k, t, n in
                   [('used', 'image/webp', 30), ('unused', 'image/webp', 50), ('font', 'font/woff2', 10)]}
        value = live_project.package(dict(files={'index.html': {'bytes': 7}, 'map.xml': {}},
            oss=dict(objects=objects, reference_keys=['used', 'font'])), 'x_')
        self.assertEqual(tuple(value['x_' + k] for k in ('html_files', 'images', 'used_images',
            'image_bytes', 'used_image_bytes', 'resource_bytes', 'index_bytes')), (1, 2, 1, 80, 30, 90, 7))
        with tempfile.TemporaryDirectory() as folder:
            live_project.save_views(Path(folder), {}, 'build', {}, '2026-11-16T09:00:00+08:00', '', None, 'new', ())
            live_project.save_views(Path(folder), {}, 'publication', {'local_build': '旧写法'}, '2026-11-12T13:00:00+08:00', '', None, 'old', ())
            self.assertEqual(live_project.read(Path(folder) / '.live/public.json')['times']['version'], '2026-11-16T09:00:00+08:00')

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
            with patch.object(query, "digest", wraps=query.digest) as checksums:
                _, second = query.sync_logs(args, END, END)
                self.assertEqual(checksums.call_count, 2)
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
        self.seed_exit(self.root)
        result = subprocess.run([sys.executable, "-B", "-X", "utf8", str(Path(query.__file__)), "--logs-dir", str(self.root),
                                 "--cache-dir", str(self.root), "--start", "2026-10-12", "--end", "2026-10-12"], capture_output=True, check=True)
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
        marked = {**self.sls_row(), "client_ip": "93.184.216.34", "__time__": cutoff.timestamp(), "request_uri": "/_v.gif?x-v=self&x-self=1"}
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
        unpadded = query.source_windows(START, START, now)[0]
        padded = query.source_windows(START, START, now, padding=query.MAX_EXIT_INTERVAL)[0]
        self.assertEqual(padded[1:], (unpadded[1] - query.MAX_EXIT_INTERVAL, unpadded[2] + query.MAX_EXIT_INTERVAL))
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

    def test_snapshot_cursor_preserves_same_second_and_uses_adjacent_windows(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="store", sls_logstore="logs",
                               snapshot_beacons=True)
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        stop = start + timedelta(days=2, minutes=1)
        cursor = int(start.timestamp()) + 15
        rows = [dict(self.sls_row(), request_id=key, __time__=cursor) for key in ("a", "b", "c")]
        rows.append(dict(self.sls_row(), request_id="d", __time__=int((stop - timedelta(seconds=15)).timestamp())))

        def page(records):
            return json.dumps({"meta": {"count": len(records), "progress": "Complete"}, "data": records})

        with patch.object(query, "SLS_SQL_PAGE", 2), patch.object(query, "source_windows", return_value=[
                ("sls_realtime", start, stop)]), patch.object(query, "cli_run", side_effect=[
                    page(rows[:2]), page(rows[:2]), page(rows[2:3]), page([]), page(rows[3:])]) as cloud:
            _, records, sync, _ = query.sync_cloud(args, start.date(), stop.date(), stop)
        self.assertEqual([row["identity"][1] for row in records], [row["request_id"] for row in rows])
        bodies = [json.loads(call.args[0][-1]) for call in cloud.call_args_list]
        edge = int((start + timedelta(days=2)).timestamp())
        self.assertEqual([(p["from"], p["to"]) for p in bodies], [
            (int(start.timestamp()), edge), (cursor, edge), (cursor, cursor + 1),
            (cursor + 1, edge), (edge, int(stop.timestamp()))])
        self.assertEqual([p["query"].split("LIMIT ")[-1] for p in bodies], ["2", "2", "2, 2", "2", "2"])
        self.assertEqual([s["records"] for s in sync["sources"]], [3, 1])

    def test_monitor_cv_keeps_two_day_results_when_seven_day_snapshot_fails(self):
        snapshot = Mock()
        cache = self.root
        args = ["--cv", "--days", "2", "--monitor-sources", str(self.root / "sources.json"), "--cache-dir", str(cache)]
        (cache / "internal-visitor-probes.txt").write_text("1a\n1b\n5a\n5b\n", "utf-8")
        def visits(day):
            at = datetime.now(query.TZ).replace(hour=12, minute=0, second=0) - timedelta(days=day)
            entry = log(at.strftime("%d/%b/%Y:%H:%M:%S %z"), extra={"x-entry": "cv", "x-id": f"page-{day}", "x-cv-session": str(day)})
            return [query.parse_line(line) for line in (self.probe(at - timedelta(minutes=1), f"{day}a"), entry, self.probe(at + timedelta(minutes=1), f"{day}b"))]
        recent = ([], visits(1), {"sources": [{"query_complete": True}]}, None)
        overview = (recent[0], visits(5) + recent[1], *recent[2:])
        for succeeds in (False, True):
            with self.subTest(succeeds=succeeds), patch.object(query, "DEFAULT_CACHE", cache), \
                    patch.dict(query.os.environ, {"AGENTS_BACKGROUND_AUTOMATION": "1"}), patch.object(query, "send_exit_probe"), \
                    patch.object(query, "OfflineNetworks", side_effect=ValueError), patch.object(query, "due_snapshot", return_value={"owner": "x"}), \
                    patch.object(query, "live_producer", return_value=SimpleNamespace(visitors=snapshot)), \
                    patch.object(query, "sync_cloud", side_effect=[recent, overview if succeeds else query.SnapshotQueryTimeout()]) as sync, \
                    patch("builtins.print") as printed:
                self.assertEqual(query.main(args), 0)
            selected = json.loads(printed.call_args.args[0])
            self.assertEqual((date.fromisoformat(selected["end"]) - date.fromisoformat(selected["start"])).days, 1)
            self.assertEqual(selected["cv"]["count"], 1)
            self.assertEqual([int((call.args[2] - call.args[1]).days) for call in sync.call_args_list], [1, 6])
            self.assertEqual(selected.get("snapshot_refresh_error"), None if succeeds else "snapshot_query_timeout")
            self.assertEqual(snapshot.call_count, int(succeeds))
            if succeeds:
                summary = snapshot.call_args.args[1]
                self.assertEqual((date.fromisoformat(summary["end"]) - date.fromisoformat(summary["start"])).days, 6)
                self.assertEqual((summary["total"]["unique_visitors"], summary["total"]["pageviews"]), (1, 2))

    def test_sls_deep_read_filters_both_beacon_forms_without_changing_window(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test", sls_logstore="oss-log-store")
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        end = start + timedelta(hours=1)
        rows = [self.sls_row(), {**self.sls_row(), "request_uri": "/_v.gif?x-v=plain&x-p=/"}]
        page = {"meta": {"count": len(rows), "progress": "Complete"}, "data": rows}
        base = f"__topic__:oss_access_log AND bucket:{query.SOURCE}"
        for deep_read, cv in ((None, None), (False, False), (True, False), (False, True)):
            args.deep_read, args.cv = deep_read, cv
            with self.subTest(deep_read=deep_read, cv=cv), patch.object(query, "cli_run", return_value=json.dumps(page)) as cloud:
                records = query.sls_logs(args, start, end)
            self.assertEqual([record["path"] for record in records], ["/_v.gif", "/_v.gif"])
            expected = base + " | SELECT * WHERE regexp_like(request_uri, '(?i)x-cv-session(?:=|%3d)[A-Za-z0-9-]+|x-event(?:=|%3d)entry|x-network-probe(?:=|%3d)[A-Za-z0-9_-]+') LIMIT 10000" if cv else base + ' AND (request_uri: "/_v.gif" OR request_uri: "%2F_v.gif")' if deep_read else base
            if deep_read:
                expected += " | SELECT * ORDER BY __time__ ASC, request_id ASC LIMIT 0, 10000"
            self.assertEqual(json.loads(cloud.call_args.args[0][-1]),
                {"from": int(start.timestamp()), "to": int(end.timestamp()), "query": expected,
                 "line": 10000 if cv else 0 if deep_read else 100, "offset": 0, "reverse": False})
            cloud.assert_called_once()
            self.assertEqual(cloud.call_args.kwargs, {"timeout": 25, "attempts": 1} if deep_read else {})
        args.deep_read = True
        with patch.object(query, "cli_run", return_value=json.dumps({"meta": {"count": 0, "progress": "Incomplete"}, "data": []})) as cloud, patch.object(query.time, "sleep"):
            with self.assertRaises(RuntimeError):
                query.sls_logs(args, start, end)
        self.assertEqual(cloud.call_count, 2)

    def test_deep_read_sql_pages_keep_full_backlog_and_reject_partial_results(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test",
                               sls_logstore="oss-log-store", deep_read=True)
        start = datetime(2026, 10, 12, 10, 28, 6, tzinfo=query.TZ)
        end = start + timedelta(days=3, hours=20)
        full = [{**self.sls_row(), "request_id": f"row-{i:05d}"} for i in range(10000)]
        tail = [{**self.sls_row(), "request_id": "row-10000"}]
        def page(rows, progress="Complete"):
            return json.dumps({"meta": {"count": len(rows), "progress": progress}, "data": rows})
        complete = page(full)
        cases = (("retry_tail", [complete, query.CloudCommandError("连接中断", "fixture EOF"), page(tail)], True),
                 ("incomplete_tail", [complete, page(tail, "Incomplete"), page(tail, "Incomplete")], False))
        for name, responses, succeeds in cases:
            with self.subTest(case=name), patch.object(query, "cli_run", side_effect=responses) as cloud, patch.object(query.time, "sleep"):
                if succeeds:
                    records = query.sls_logs(args, start, end)
                    self.assertEqual([row["identity"][1] for row in records],
                                     [row["request_id"] for row in full + tail])
                else:
                    with self.assertRaisesRegex(RuntimeError, "SLS 查询未完成"):
                        query.sls_logs(args, start, end)
                bodies = [json.loads(call.args[0][-1]) for call in cloud.call_args_list]
                self.assertEqual(len(bodies), 3)
                for body, offset, call in zip(bodies, (0, 10000, 10000), cloud.call_args_list):
                    self.assertEqual((body["from"], body["to"], body["line"], body["offset"]),
                                     (int(start.timestamp()), int(end.timestamp()), 0, 0))
                    self.assertTrue(body["query"].endswith(
                        f" | SELECT * ORDER BY __time__ ASC, request_id ASC LIMIT {offset}, 10000"))
                    self.assertIn('request_uri: "/_v.gif" OR request_uri: "%2F_v.gif"', body["query"])
                    self.assertEqual(call.kwargs, {"timeout": 25, "attempts": 1})

    def test_sls_cv_legacy_entry_rechecks_all_beacons(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test", sls_logstore="oss-log-store", cv=True)
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        entry = {**self.sls_row(), "request_uri": "/_v.gif?x-v=old&x-p=/cv&x-event=entry"}
        followup = {**self.sls_row(), "request_id": "followup", "request_uri": "/_v.gif?x-v=old&x-p=/next"}
        def page(rows):
            return json.dumps({"meta": {"count": len(rows), "progress": "Complete"}, "data": rows})
        with patch.object(query, "cli_run", side_effect=[page([entry]), page([entry, followup])]) as cloud:
            records = query.sls_logs(args, start, start + timedelta(hours=1))
        self.assertEqual([r["params"]["p"] for r in records], ["/cv", "/next"])
        self.assertIn('request_uri: "/_v.gif"', json.loads(cloud.call_args_list[-1].args[0][-1])["query"])

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

    def test_deep_read_failure_details_survive_both_attempts_and_json(self):
        args = SimpleNamespace(aliyun="aliyun", profile="website-images", sls_project="oss-log-test",
                               sls_logstore="oss-log-store", deep_read=True)
        start = datetime(2026, 10, 12, 10, tzinfo=query.TZ)
        responses = [subprocess.CompletedProcess([], 2, b"", b"EOF secret-value"),
                     subprocess.CompletedProcess([], 3, b"", b"connection reset secret-value")]
        with patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", side_effect=responses), patch.object(query.time, "sleep"):
            with self.assertRaises(query.CloudCommandError) as raised:
                query.sls_logs(args, start, start + timedelta(hours=1))
        diagnostics = raised.exception.diagnostics
        self.assertEqual([r["subtype"] for r in diagnostics], ["eof", "connection_reset"])
        self.assertEqual([r["returncode"] for r in diagnostics], [2, 3])
        self.assertTrue(all(isinstance(r["elapsed_ms"], int) and r["elapsed_ms"] >= 0 for r in diagnostics))
        with patch.object(sys, "argv", [query.__file__, "--deep-read", "--since", start.isoformat()]), patch.object(query, "sync_cloud", side_effect=raised.exception), patch("builtins.print") as output:
            self.assertEqual(query.main(), 1)
        result = json.loads(output.call_args.args[0])
        self.assertEqual(result["query_diagnostics"], diagnostics)
        self.assertNotIn("secret-value", output.call_args.args[0])

    def test_tunnel_records_failure_side_and_stage_without_socket_text(self):
        for phase, side, error in (("relay", "upstream", None), ("relay", "client", OSError(10054, "secret-value")),
                                   ("connect", "upstream", OSError(10061, "secret-value"))):
            with self.subTest(phase=phase, side=side, error=type(error).__name__):
                tunnel = query.SlsTunnel.__new__(query.SlsTunnel)
                tunnel.path, tunnel.connection = query.SLS_ENDPOINT + ":443", Mock()
                tunnel.server = SimpleNamespace(sls_address="203.0.113.1", diagnostic_lock=query.Lock(), diagnostic_rows=[])
                tunnel.send_response, tunnel.end_headers = Mock(), Mock()
                remote = Mock(); remote.__enter__ = Mock(return_value=remote); remote.__exit__ = Mock(return_value=False)
                peer = remote if side == "upstream" else tunnel.connection
                peer.recv.side_effect = error if phase == "relay" and error else None
                peer.recv.return_value = b""
                with patch.object(query.socket, "create_connection", side_effect=error if phase == "connect" else None, return_value=remote), patch.object(query.select, "select", return_value=([peer], [], [])):
                    tunnel.do_CONNECT()
                row, = tunnel.server.diagnostic_rows
                self.assertEqual((row["phase"], row["close_side"], row["end"]), (phase, side, "socket_error" if error else "eof"))
                self.assertEqual(row["errno"], error.errno if error else None)
                self.assertNotIn("secret-value", json.dumps(row))

    def test_cli_subtypes_are_bounded_and_process_timeout_is_distinct(self):
        for marker, expected in ((b"EOF", "eof"), (b"connection reset", "connection_reset"),
                                 (b"connection refused", "connection_refused"), (b"TLS handshake", "tls_handshake"),
                                 (b"timeout", "timeout"), (b"no such host", "dns"), (b"secret-value", "other")):
            self.assertEqual(query.cli_subtype(subprocess.CompletedProcess([], 1, b"", marker)), expected)
        with patch.object(query.socket, "getaddrinfo", return_value=[]), patch.object(query.subprocess, "run", side_effect=subprocess.TimeoutExpired("secret-value", 25)):
            with self.assertRaises(query.CloudCommandError) as raised:
                query.cli_run(["aliyun", "sls", "GetLogsV2"], timeout=25, attempts=1)
        self.assertEqual(raised.exception.diagnostics[0]["subtype"], "process_timeout")
        self.assertIsNone(raised.exception.diagnostics[0]["returncode"])

    def test_sls_dualstack_dns_prefers_ipv6_and_accepts_ipv4_only_answers(self):
        for ipv6 in (True, False):
            query.sls_address.cache_clear()
            def resolve(url, **kwargs):
                kind = 28 if "type=AAAA" in url else 1
                rows = [{"type": kind, "data": "2001:db8::1" if kind == 28 else "203.0.113.1"}]
                return io.BytesIO(json.dumps({"Answer": rows if ipv6 or kind == 1 else []}).encode())
            with self.subTest(ipv6=ipv6), patch.object(query, "urlopen", side_effect=resolve) as dns:
                self.assertEqual(query.sls_address(), "2001:db8::1" if ipv6 else "203.0.113.1")
                self.assertIn("cn-shanghai.dualstack.log.aliyuncs.com", dns.call_args.args[0])
        query.sls_address.cache_clear()

    def test_sls_tunnel_retries_ipv4_when_ipv6_network_is_unavailable(self):
        tunnel = query.SlsTunnel.__new__(query.SlsTunnel)
        tunnel.path, tunnel.connection = query.SLS_ENDPOINT + ":443", Mock()
        tunnel.server = SimpleNamespace(sls_address="2001:db8::1", diagnostic_lock=query.Lock(), diagnostic_rows=[])
        tunnel.send_response, tunnel.end_headers = Mock(), Mock()
        remote = Mock(); remote.__enter__ = Mock(return_value=remote); remote.__exit__ = Mock(return_value=False)
        remote.recv.return_value = b""
        with patch.object(query.socket, "create_connection", side_effect=[OSError(10051, "unreachable"), remote]) as connect, patch.object(query, "sls_address", return_value="203.0.113.1") as resolve, patch.object(query.select, "select", return_value=([remote], [], [])):
            tunnel.do_CONNECT()
        self.assertEqual([call.args[0] for call in connect.call_args_list], [("2001:db8::1", 443), ("203.0.113.1", 443)])
        resolve.assert_called_once_with("A")
        tunnel.send_response.assert_called_once_with(200, "Connection established")

    def test_cli_failure_snapshots_each_attempt_after_existing_relay_cleanup(self):
        relay, rows = Mock(server_port=12005), []
        def run(*args, **kwargs):
            row = {"phase": "relay", "end": "active", "close_side": "unknown"}
            rows.append(row); relay.diagnostic_rows.append(row)
            return subprocess.CompletedProcess([], len(rows), b"", b"EOF secret-value")
        def close():
            for index, row in enumerate(rows):
                row.update(end="eof", close_side="upstream" if index == 0 else "client")
        relay.server_close.side_effect = close
        with patch.object(query.socket, "getaddrinfo", return_value=[(0, 0, 0, "", ("198.18.0.1", 443))]), patch.object(query, "sls_address", return_value="203.0.113.1"), patch.object(query, "ThreadingHTTPServer", return_value=relay), patch.object(query, "Thread"), patch.object(query.subprocess, "run", side_effect=run), patch.object(query.time, "sleep"):
            with self.assertRaises(query.CloudCommandError) as raised:
                query.cli_run(["aliyun", "sls", "GetLogsV2"], attempts=2)
        self.assertEqual([r["relay"][0]["close_side"] for r in raised.exception.diagnostics], ["upstream", "client"])
        self.assertTrue(all(r["relay"][0]["end"] == "eof" for r in raised.exception.diagnostics))
        rows[0]["end"] = "active"
        self.assertEqual(raised.exception.diagnostics[0]["relay"][0]["end"], "eof")

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
        relay = Mock(server_port=12005)
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
        relay = Mock(server_port=12005)
        failed = SimpleNamespace(returncode=2, stdout=b"", stderr=b"request failed: EOF")
        good = SimpleNamespace(returncode=0, stdout=b'\xef\xbb\xbf{"data":[]}', stderr=b"")
        with patch.object(query.socket, "getaddrinfo", return_value=[(0, 0, 0, "", ("198.18.0.1", 443))]), patch.object(query, "sls_address", return_value="203.0.113.1"), patch.object(query, "ThreadingHTTPServer", return_value=relay), patch.object(query, "Thread"), patch.object(query.subprocess, "run", side_effect=[failed, subprocess.TimeoutExpired("aliyun", 60), good]) as run, patch.object(query.time, "sleep") as sleep:
            self.assertEqual(query.cli_run(["aliyun", "sls", "GetLogsV2"]), '{"data":[]}')
        self.assertEqual(run.call_count, 3)
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [1, 2])
        env = run.call_args.kwargs["env"]
        self.assertIn("oauth.aliyun.com", env["NO_PROXY"].split(","))
        self.assertNotIn("aliyuncs.com", env["NO_PROXY"])
        self.assertEqual(env["HTTPS_PROXY"], "http://127.0.0.1:12005")
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
        self.assertEqual((group["label"], group["unique_visitors"], group["first_at"]), ("专用链接来的（/cv）", 1, "2026-10-11T23:59:59+08:00"))
        self.assertEqual(group["visitors"][0]["cities"], ["深圳市"])
        self.assertEqual(group["visitors"][0]["pages"]["/"]["observed_seconds"], 15)
        self.assertNotIn("/cv/", group["visitors"][0]["pages"])
        self.assertEqual(result["entry"]["unmarked"]["unique_visitors"], 1)
        self.assertNotIn("other", result["entry"])
        again = self.analyze([log(extra={"x-entry": "other"})], history=history)
        self.assertEqual(again["entry"]["cv"]["unique_visitors"], 1)
        self.assertEqual(self.analyze([])["entry"]["cv"]["unique_visitors"], 0)

    def test_cv_visits_are_separate_and_include_pages_network_and_unknown_dwell(self):
        first = {"x-cv-session": "visit-one", "x-entry": "cv"}
        second = {"x-cv-session": "visit-two", "x-entry": "cv"}
        rows = log("12/Oct/2026:10:00:00 +0800", p="/cv/", extra={**first, "x-event": "entry"})
        rows += log("12/Oct/2026:10:00:01 +0800", extra={**first, "x-id": "home"})
        rows += log("12/Oct/2026:10:00:21 +0800", extra={**first, "x-id": "home", "x-event": "leave", "x-visible": "20"})
        rows += log("12/Oct/2026:10:00:22 +0800", p="/projects/demo/", extra={**first, "x-id": "detail"})
        rows += log("12/Oct/2026:11:00:00 +0800", p="/cv/", extra={**second, "x-event": "entry"})
        rows += log("12/Oct/2026:11:00:01 +0800", extra={**second, "x-id": "home-two"})
        rows += log(v="self", extra={**first, "x-self": "1", "x-event": "entry"})
        network = Mock(return_value={"province": "上海市", "city": "上海市", "operator": "电信", "organization": "AS123"})
        visits = self.analyze([rows], networks=network, cv_only=True)["cv"]["visits"]
        self.assertEqual(self.analyze([rows + log(v="other", p="/unrelated/")], networks=network, cv_only=True)["cv"]["visits"], visits)
        self.assertEqual(len(visits), 2)
        self.assertEqual(visits[0]["first_at"], "2026-10-12T10:00:00+08:00")
        self.assertEqual((visits[0]["possible_region"], visits[0]["possible_network"]), ("上海市/上海市", "AS123"))
        self.assertEqual(visits[0]["pages"]["/"]["observed_seconds"], 20)
        self.assertEqual(visits[0]["pages"]["/projects/demo/"]["unknown_opens"], 1)
        self.assertNotIn("/cv/", visits[0]["pages"])
        legacy = self.analyze([log("12/Oct/2026:09:00:00 +0800", v="old", p="/cv/", extra={"x-event": "entry"})
                               + log("12/Oct/2026:09:01:00 +0800", v="old", p="/old/")], cv_only=True)["cv"]["visits"]
        self.assertEqual(legacy[0]["first_at_kind"], "legacy_entry_inferred_30m")
        self.assertIn("/old/", legacy[0]["pages"])

    def test_cv_cli_local_logs(self):
        (self.root / "cv.log").write_text(log(p="/cv/", extra={"x-event": "entry", "x-cv-session": "visit"})
                                          + log(p="/", extra={"x-cv-session": "visit"}), "utf-8")
        self.seed_exit(self.root / "cache")
        done = subprocess.run([sys.executable, "-B", "-X", "utf8", str(Path(__file__).with_name("query-site-visitors.py")),
                               "--cv", "--start", "2026-10-12", "--end", "2026-10-12", "--logs-dir", str(self.root),
                               "--cache-dir", str(self.root / "cache")], capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(done.returncode, 0, done.stderr)
        output = json.loads(done.stdout)
        self.assertEqual(output["cv"]["count"], 1)
        self.assertEqual(output["cv"]["visits"][0]["pages"]["/"]["unknown_opens"], 1)

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
        self.seed_exit(self.root)
        self.assertEqual(set(json.loads(subprocess.run([sys.executable, "-B", "-X", "utf8", query.__file__, "--logs-dir", str(self.root), "--cache-dir", str(self.root), "--deep-read", "--since", since.isoformat(), "--json"], capture_output=True, check=True).stdout)), {"checked_at", "visitors", "site_scope", "count_scope", "external_since"})

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
        self.seed_exit(self.root)
        for phase in ("init", "prepare"):
            networks = Mock(); networks.prepare.side_effect = EOFError("203.0.113.1 must stay local")
            with patch.object(sys, "argv", [query.__file__, "--cache-dir", str(self.root), "--start", "2026-10-12", "--end", "2026-10-12"]), patch.object(query, "sync_cloud", return_value=([self.root / 'probes.log'], [query.parse_line(log())], {"sources": []}, None)), patch.object(query, "OfflineNetworks", return_value=networks, side_effect=ValueError("broken partial cache") if phase == "init" else None), patch("builtins.print") as printed:
                self.assertEqual(query.main(), 0); result = json.loads(printed.call_args.args[0])
                self.assertEqual(result["total"]["pageviews"], 1); self.assertEqual(result["region_pageviews"], {"未知/未知": 1}); self.assertEqual(result["offline_network_databases"]["status"], "error"); self.assertNotIn("203.0.113.1", json.dumps(result))

if __name__ == "__main__":
    unittest.main()
