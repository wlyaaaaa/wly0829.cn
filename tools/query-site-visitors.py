#!/usr/bin/env python3
"""Query private OSS/SLS access logs; output aggregates only, never credentials or IPs.

Recent 7 days: SLS real-time logs (~3 minutes); older: OSS archive (up to 48 hours).
"""
import argparse
import bisect
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from functools import lru_cache
import gzip
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import ipaddress
import json
import os
from pathlib import Path
import re
import select
import socket
import shutil
from statistics import median
import struct
import subprocess
from threading import Thread
import time
import zlib
from urllib.parse import parse_qs, unquote, urlsplit
from urllib.request import Request, urlopen

TZ = timezone(timedelta(hours=8))
BUCKET = "wly0829-access-logs-shanghai"
SOURCE = "wly0829-img-media-shanghai"
PREFIX = "access/" + SOURCE + "/"
TOKEN = re.compile(r'"((?:\\.|[^"\\])*)"|\[([^\]]*)\]|([^\s"\[\]]+)')
BOT = re.compile(r"bot|crawl|spider|headless|curl|wget|python|probe|lighthouse|uptime|httpclient|scanner|playwright|puppeteer", re.I)
BROWSER = re.compile(r"Chrome/|Firefox/|Safari/|Edg/|OPR/|SamsungBrowser/", re.I)
AI_BOTS = ("GPTBot", "ClaudeBot", "PerplexityBot", "Bytespider", "Amazonbot", "meta-externalagent", "Google-Extended")
NETWORK_ERRORS = (OSError, ValueError, RuntimeError, struct.error, EOFError, zlib.error)


def network_failure(error):
    return {"status": "error", "reason": f"离线地区/机构数据库不可用（{type(error).__name__}）；地区与机构保持未知，访客统计继续"}


class OfflineNetworks:
    """Only download whole public databases; never send a visitor IP to a service."""
    def __init__(self, cache, download=True):
        self.root, self.asns, self.xdb = cache / "networks", {}, {}
        urls = {f"ip2region_v{v}.xdb": f"https://raw.githubusercontent.com/lionsoul2014/ip2region/master/data/ip2region_v{v}.xdb" for v in (4, 6)}
        urls["ip2asn-combined.tsv.gz"] = "https://iptoasn.com/data/ip2asn-combined.tsv.gz"
        for name, url in urls.items():
            path = self.root / name
            if not path.exists() and download:
                self.root.mkdir(parents=True, exist_ok=True)
                temporary = path.with_suffix(f".{os.getpid()}.tmp")
                try:
                    with urlopen(Request(url, headers={"User-Agent": "wly0829-site-visitors/1.0"}), timeout=90) as response, temporary.open("wb") as stream:
                        shutil.copyfileobj(response, stream)
                    temporary.replace(path)
                finally:
                    temporary.unlink(missing_ok=True)
            if not path.exists():
                raise ValueError("离线网络库未缓存；先联网运行一次或指定已有 --cache-dir")
        for version in (4, 6):
            data = (self.root / f"ip2region_v{version}.xdb").read_bytes()
            if len(data) < 524544 or struct.unpack_from("<H", data)[0] != 3 or struct.unpack_from("<HH", data, 16) != (version, 4):
                raise ValueError("ip2region 离线库格式不兼容")
            self.xdb[version] = data
        self.metadata = {"status": "ready", **{name: {"source": url, "sha256": digest(self.root / name),
                              "cached_at": datetime.fromtimestamp((self.root / name).stat().st_mtime, TZ)} for name, url in urls.items()}}

    def prepare(self, addresses):
        wanted = {v: sorted({int(ipaddress.ip_address(ip)) for ip in addresses if ipaddress.ip_address(ip).version == v}) for v in (4, 6)}
        if not any(wanted.values()):
            return
        pending = sum(map(len, wanted.values()))
        with gzip.open(self.root / "ip2asn-combined.tsv.gz", "rt", encoding="utf-8") as stream:
            for line in stream:
                begin, end, asn, country, name = line.rstrip("\n").split("\t", 4)
                version = 6 if ":" in begin else 4
                if not wanted[version]:
                    continue
                lo, hi = int(ipaddress.ip_address(begin)), int(ipaddress.ip_address(end))
                offset = bisect.bisect_left(wanted[version], lo)
                while offset < len(wanted[version]) and wanted[version][offset] <= hi:
                    self.asns[(version, wanted[version][offset])] = f"AS{asn} {name}" if asn != "0" else "未知机构网络"
                    offset += 1
                    pending -= 1
                if not pending:
                    break

    def __call__(self, address):
        ip = ipaddress.ip_address(address)
        data, width = self.xdb[ip.version], len(ip.packed)
        begin, end = struct.unpack_from("<II", data, 256 + int.from_bytes(ip.packed[:2], "big") * 8)
        lo, hi, region = 0, (end - begin) // (width * 2 + 6), ""
        while begin and end and lo <= hi:
            middle = (lo + hi) // 2
            offset = begin + middle * (width * 2 + 6)
            byteorder = "little" if ip.version == 4 else "big"
            left = int.from_bytes(data[offset:offset + width], byteorder)
            right = int.from_bytes(data[offset + width:offset + width * 2], byteorder)
            if int(ip) < left:
                hi = middle - 1
            elif int(ip) > right:
                lo = middle + 1
            else:
                length, pointer = struct.unpack_from("<HI", data, offset + width * 2)
                region = data[pointer:pointer + length].decode("utf-8")
                break
        fields = [part if part and part != "0" else "未知" for part in (region.split("|") + [""] * 5)[:5]]
        return {"country": fields[0], "province": fields[1], "city": fields[2], "operator": fields[3],
                "organization": self.asns.get((ip.version, int(ip)), "未知机构网络")}


def app_name(ua):
    lowered = ua.lower()
    for name, tokens in (("企业微信", ("wxwork",)), ("微信", ("micromessenger",)), ("钉钉", ("dingtalk",)),
                         ("飞书/Lark", ("lark", "feishu")), ("Boss 直聘", ("bosszp", "zhipin", "boss/"))):
        if any(token in lowered for token in tokens):
            return name
    return "普通浏览器/其他 App（UA 未识别）"


def metric(params, key):
    try:
        value = float(params.get(key, ""))
        return value if 0 <= value <= (86400 if key == "visible" else 3600000) else None
    except (TypeError, ValueError):
        return None

def dates(start, end):
    return [start + timedelta(days=i) for i in range((end - start).days + 1)]


def parse_uri(uri):
    uri = unquote(uri) if uri.lower().startswith("%2f") else uri
    parsed = urlsplit(uri)
    query = parse_qs(parsed.query, keep_blank_values=True)
    params = {name: query.get("x-" + name, query.get(name, [""]))[0]
              for name in ("v", "p", "ref", "self", "monitor", "event", "id", "visible", "ttfb", "dom", "load", "first", "entry", "cv-session")}
    params["p"] = urlsplit(params["p"]).path or "未知页面"
    params["ref"] = urlsplit(params["ref"]).hostname or "直接访问/未知"
    return unquote(parsed.path), params


def parse_line(line):
    fields, pos = [], 0
    for match in TOKEN.finditer(line):
        if line[pos:match.start()].strip():
            raise ValueError("Unmatched log token")
        value = next(value for value in match.groups() if value is not None)
        fields.append(re.sub(r'\\(["\\])', r'\1', value))
        pos = match.end()
    if line[pos:].strip() or len(fields) < 17 or "\ufffd" in line:
        raise ValueError("Incomplete OSS log")
    ip = str(ipaddress.ip_address(fields[0]))
    stamp = datetime.strptime(fields[3], "%d/%b/%Y:%H:%M:%S %z").astimezone(TZ)
    method, uri, protocol = fields[4].split()
    if not protocol.startswith("HTTP/"):
        raise ValueError("Invalid request protocol")
    path, params = parse_uri(uri)
    return {"time": stamp, "ip": ip, "method": method, "status": int(fields[5]),
            "path": path, "params": params, "ua": fields[9],
            "bucket": fields[15], "operation": fields[14],
            "identity": (fields[15], fields[11]) if fields[11] != "-" else line.strip()}


def parse_sls_row(row):
    try:
        ua = row.get("user_agent", row.get("User-Agent"))
        if not isinstance(ua, str) or not isinstance(row.get("request_id"), str) or row["request_id"] in ("", "-"):
            raise ValueError("Missing SLS request identity or user agent")
        uri = row["request_uri"]
        uri = unquote(uri) if uri.lower().startswith("%2f") else uri
        path, params = parse_uri(re.sub(r"\s+HTTP/\d+(?:\.\d+)?$", "", uri))
        operation = row["operation"]
        return {"time": datetime.fromtimestamp(float(row["__time__"]), TZ),
                "ip": str(ipaddress.ip_address(row["client_ip"])),
                "method": row["http_method"],
                "status": int(row["http_status"]), "path": path, "params": params,
                "ua": ua,
                "bucket": row["bucket"], "operation": operation,
                "identity": (row["bucket"], row["request_id"])}
    except (AttributeError, KeyError, TypeError, ValueError, OverflowError) as error:
        raise ValueError("Invalid SLS access-log schema") from error


class SlsTunnel(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass
    def do_CONNECT(self):
        host, _, port = self.path.rpartition(":")
        if port != "443" or not (host == "cn-shanghai.log.aliyuncs.com" or host.endswith(".cn-shanghai.log.aliyuncs.com")):
            self.send_error(403)
            return
        try:
            with socket.create_connection((self.server.sls_address, 443), timeout=20) as remote:
                self.send_response(200, "Connection established")
                self.end_headers()
                peers = [self.connection, remote]
                while ready := select.select(peers, [], [], 30)[0]:
                    for peer in ready:
                        data = peer.recv(65536)
                        if not data:
                            return
                        (remote if peer is self.connection else self.connection).sendall(data)
        except OSError:
            return

@lru_cache(maxsize=1)
def sls_address():
    for attempt in range(3):
        try:
            with urlopen("https://dns.google/resolve?name=cn-shanghai.log.aliyuncs.com&type=A", timeout=15) as response:
                answers = json.load(response).get("Answer", [])
            addresses = [str(ipaddress.IPv4Address(row["data"])) for row in answers if row.get("type") == 1]
            if addresses:
                return addresses[0]
        except (OSError, ValueError):
            if attempt == 2:
                raise CloudCommandError("DNS 解析失败", "无法解析 SLS 服务地址；未将连接失败当作零访客") from None
            time.sleep(attempt + 1)
    raise CloudCommandError("DNS 解析失败", "无法解析 SLS 服务地址；未将连接失败当作零访客")


def cli_error(result):
    error = (result.stderr + result.stdout).decode("utf-8", errors="replace").lower()
    for category, markers in (
        ("连接超时", ("timeout", "timed out", "deadline exceeded")),
        ("DNS 解析失败", ("no such host", "name resolution")),
        ("连接中断", ("eof", "connection reset", "connection refused", "tls handshake")),
        ("代理拒绝", ("proxyconnect",)),
        ("鉴权失败", ("forbidden", "unauthorized", "accessdenied", "invalidaccesskey", "signature", "credential", "invalid_grant", "invalid grant")),
        ("请求参数无效", ("invalidparameter", "badrequest", "invalid argument")),
        ("CLI 初始化失败", ("init openapi client failed",)),
    ):
        if any(marker in error for marker in markers):
            return category
    return "CLI 调用失败"


class CloudCommandError(RuntimeError):
    def __init__(self, category, message):
        self.category = category
        super().__init__(message)


def cli_run(command, *, timeout=None, attempts=None):
    relay, env = None, None
    is_sls = command[1] == "sls"
    prepared = False
    try:
        attempts = attempts if attempts is not None else (3 if is_sls else 1)
        for attempt in range(attempts):
            try:
                if is_sls and not prepared:
                    if any(address[4][0].startswith(("198.18.", "198.19."))
                           for address in socket.getaddrinfo("cn-shanghai.log.aliyuncs.com", 443)):
                        address = sls_address()
                        relay = ThreadingHTTPServer(("127.0.0.1", 0), SlsTunnel)
                        relay.sls_address = address
                        Thread(target=relay.serve_forever, daemon=True).start()
                        # OAuth refresh must keep its normal path; this relay accepts SLS only.
                        env = {**os.environ, "NO_PROXY": "oauth.aliyun.com,oauth.alibabacloud.com,signin.aliyun.com,signin.alibabacloud.com",
                               "HTTPS_PROXY": f"http://127.0.0.1:{relay.server_port}"}
                    prepared = True
                result = subprocess.run(command, capture_output=True, timeout=timeout if timeout is not None else (60 if is_sls else 180), env=env)
            except socket.gaierror:
                category = "DNS 解析失败"
            except CloudCommandError as error:
                category = error.category
            except subprocess.TimeoutExpired:
                category = "连接超时"
            else:
                if not result.returncode:
                    return result.stdout.decode("utf-8-sig")
                category = cli_error(result)
            if is_sls and category in ("连接超时", "DNS 解析失败", "连接中断") and attempt < attempts - 1:
                time.sleep(attempt + 1)
                continue
            raise CloudCommandError(category, f"阿里云命令失败（{category}，尝试 {attempt + 1} 次）；未输出可能含凭据的原始错误")
    finally:
        if relay:
            relay.shutdown()
            relay.server_close()


def list_objects(args, prefix):
    cursor, seen, rows = "", set(), []
    while True:
        command = [args.aliyun, "oss", "ls", f"oss://{args.bucket}/{prefix}",
                   "--profile", args.profile, "--endpoint", "oss-cn-shanghai.aliyuncs.com",
                   "--cli-output", "json", "--limited-num", "1000"]
        page = json.loads(cli_run(command + (["--cli-cursor", cursor] if cursor else [])))
        if (page.get("schema_version") != "1" or type(page.get("complete")) is not bool
                or not isinstance(page.get("items"), list) or type(page.get("returned")) is not int or page["returned"] != len(page["items"])):
            raise ValueError("Unknown OSS list schema")
        for row in page["items"]:
            if not isinstance(row.get("key"), str) or not row["key"].startswith(prefix) or not row.get("etag") or type(row.get("size")) is not int:
                raise ValueError("Invalid OSS object identity")
            rows.append(row)
        if page["complete"]:
            return rows
        cursor = page.get("next_cursor")
        if not cursor or cursor in seen:
            raise ValueError("Incomplete OSS pagination")
        seen.add(cursor)


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def sync_logs(args, start, end):
    cache = args.cache_dir
    cache.mkdir(parents=True, exist_ok=True)
    index_path = cache / "cache-index.json"
    index = json.loads(index_path.read_text("utf-8")) if index_path.exists() else {}
    source_prefix = args.prefix + SOURCE
    window = {day.isoformat() for day in dates(start - timedelta(days=2), end + timedelta(days=2))}
    listed = list_objects(args, source_prefix)
    rows = {row["key"]: row for row in listed if row["key"][len(source_prefix):].lstrip("-")[:10] in window}
    paths, downloaded = [], 0
    for key, row in sorted(rows.items()):
        identity = args.bucket + "/" + key
        local = cache / (hashlib.sha256(identity.encode()).hexdigest() + ".log")
        previous = index.get(identity, {})
        if not (local.exists() and previous.get("etag") == row["etag"]
                and local.stat().st_size == row["size"] and previous.get("sha256") == digest(local)):
            temporary = local.with_suffix(f".{os.getpid()}.tmp")
            try:
                cli_run([args.aliyun, "ossutil", "cp", f"oss://{args.bucket}/{key}", str(temporary),
                         "--profile", args.profile, "--region", "cn-shanghai",
                         "--endpoint", "oss-cn-shanghai.aliyuncs.com", "--force", "--no-progress", "--loglevel", "off"])
                if temporary.stat().st_size != row["size"]:
                    raise ValueError("Incomplete log download")
                temporary.replace(local)
            finally:
                temporary.unlink(missing_ok=True)
            downloaded += 1
        index[identity] = {"etag": row["etag"], "size": row["size"], "sha256": digest(local)}
        paths.append(local)
    temporary = index_path.with_suffix(f".{os.getpid()}.tmp")
    temporary.write_text(json.dumps(index, ensure_ascii=False), "utf-8")
    temporary.replace(index_path)
    return paths, {"listed_objects": len(listed), "objects": len(paths), "downloaded": downloaded, "reused": len(paths) - downloaded}


def sls_logs(args, start, end):
    if not args.sls_project:
        raise ValueError("SLS 项目未配置；请指定 --sls-project")
    records, offset, page_size = [], 0, 100
    search = f"__topic__:oss_access_log AND bucket:{SOURCE}"
    deep_read = getattr(args, "deep_read", False)
    if deep_read:
        search += ' AND (request_uri: "/_v.gif" OR request_uri: "%2F_v.gif")'
    while True:
        body = {"from": int(start.timestamp()), "to": int(end.timestamp()),
                "query": search,
                "line": page_size, "offset": offset, "reverse": False}
        command = [args.aliyun, "sls", "GetLogsV2", "--project", args.sls_project,
                   "--logstore", args.sls_logstore, "--region", "cn-shanghai",
                   "--endpoint", "cn-shanghai.log.aliyuncs.com", "--read-timeout", "20", "--connect-timeout", "10",
                   "--profile", args.profile, "--body", json.dumps(body)]
        attempts = 2 if deep_read else 3
        for attempt in range(attempts):
            # 深读一页最多两次 25 秒调用；不叠加 CLI 的三次网络重试。
            try:
                page = json.loads(cli_run(command, timeout=25, attempts=1) if deep_read else cli_run(command))
            except CloudCommandError as error:
                if not deep_read or error.category not in ("连接超时", "DNS 解析失败", "连接中断") or attempt == attempts - 1:
                    raise
                time.sleep(1)
                continue
            if not isinstance(page, dict):
                raise ValueError("Unknown SLS response schema")
            meta, data = page.get("meta", {}), page.get("data")
            if not isinstance(meta, dict) or not isinstance(data, list) or meta.get("progress") not in ("Complete", "Incomplete"):
                raise ValueError("Unknown SLS response schema")
            if meta["progress"] == "Complete":
                break
            if attempt < attempts - 1:
                time.sleep(1)
        else:
            raise RuntimeError("SLS 查询未完成；未将部分日志当作完整结果")
        if int(meta.get("count", -1)) != len(data) or len(data) > page_size:
            raise ValueError("Incomplete SLS page")
        records.extend(parse_sls_row(row) for row in data)
        if len(data) < page_size:
            return records
        offset += len(data)


def source_windows(start, end, now, begin_at=None):
    begin = begin_at if begin_at is not None else datetime.combine(start, datetime.min.time(), TZ) - timedelta(seconds=30)
    finish = datetime.combine(end + timedelta(days=1), datetime.min.time(), TZ) + timedelta(seconds=30)
    cutoff = now - timedelta(days=7)
    windows = []
    if begin < cutoff:
        windows.append(("oss_archive", begin, min(finish, cutoff + timedelta(seconds=30))))
    if finish > cutoff and begin <= now:
        windows.append(("sls_realtime", max(begin, cutoff), min(finish, now + timedelta(seconds=1))))
    return windows


def sync_cloud(args, start, end, now):
    paths, records, file_range = [], [], None
    sync = {"mode": "hybrid", "listed_objects": 0, "objects": 0, "downloaded": 0, "reused": 0, "sources": []}
    begin_at = args.since.astimezone(TZ) - timedelta(minutes=30) if getattr(args, "deep_read", False) else None
    for source, begin, finish in source_windows(start, end, now, begin_at):
        segment = {"source": source, "from": begin, "to": finish}
        if source == "oss_archive":
            paths, archive_sync = sync_logs(args, begin.date(), finish.date())
            sync.update(archive_sync)
            file_range = (begin, finish)
            segment.update({"delay": "最长约 48 小时", "objects": len(paths)})
        else:
            records = sls_logs(args, begin, finish)
            segment.update({"delay": "约 3 分钟", "query_complete": True, "records": len(records)})
        sync["sources"].append(segment)
    return paths, records, sync, file_range


def deep_visitors(events, since, locations, history):
    people, qualified = defaultdict(list), {}
    for row in sorted(events, key=lambda r: r["time"]):
        if row["params"]["v"]:
            people[row["params"]["v"]].append(row)
    for visitor, rows in people.items():
        sessions = [[]]
        for row in rows:
            if sessions[-1] and row["time"] - sessions[-1][-1]["time"] > timedelta(minutes=30):
                sessions.append([])
            sessions[-1].append(row)
        for session in sessions:
            if session[-1]["time"] <= since:
                continue
            instances, pages = defaultdict(float), defaultdict(float)
            for row in session:
                params = row["params"]
                key = (params["id"] or row["identity"], params["p"].rstrip("/") or "/")
                seconds = metric(params, "visible") if params["event"] in ("leave", "resume", "heartbeat") else None
                instances[key] = max(instances[key], seconds or 0)
            for (_, page), seconds in instances.items():
                pages[page] += seconds
            if not (any(seconds >= 120 and (page == "/" or page.startswith("/projects/")) for page, seconds in pages.items()) or len(pages) >= 3 and sum(pages.values()) >= 180):
                continue
            latest = session[-1]
            qualified[visitor] = {"id": visitor, "first_at": history.get("first_seen", {}).get(visitor, session[0]["time"].isoformat()),
                                  "city": locations[latest["ip"]]["city"], "organization": locations[latest["ip"]]["organization"], "app": app_name(latest["ua"]),
                                  "pages": [{"path": page, "visible_seconds": round(seconds, 2)} for page, seconds in sorted(pages.items())]}
    return {"checked_at": datetime.now(TZ).isoformat(), "visitors": list(qualified.values())}


def visitor_metrics(events, history, start, end, networks=None, city=None, org=None, deep_since=None, cv_only=False):
    locations = {ip: {"province": "未知", "city": "未知", "operator": "未知", "organization": "未知机构网络"} for ip in {r["ip"] for r in events}}
    if networks:
        try:
            networks.prepare(locations)
            locations = {ip: networks(ip) for ip in locations}
        except NETWORK_ERRORS as error:
            networks.metadata = network_failure(error)
    regions, organizations, apps, speed, groups, people = Counter(), Counter(), Counter(), defaultdict(lambda: defaultdict(list)), defaultdict(list), defaultdict(list)
    views = sorted((r for r in events if r["params"]["event"] in ("", "view")), key=lambda r: r["time"])
    fallback = {}
    for row in reversed(views):
        visitor = row["params"]["v"]
        if visitor and visitor in fallback:
            seconds = (fallback[visitor] - row["time"]).total_seconds()
            row["fallback_seconds"] = seconds if 0 <= seconds <= 1800 else None
        if visitor:
            fallback[visitor] = row["time"]
        location = locations[row["ip"]]
        regions[f'{location["province"]}/{location["city"]}'] += 1
        organizations[location["organization"]] += 1
        apps[app_name(row["ua"])] += 1
    for row in events:
        params = row["params"]
        if params["event"] != "entry":
            groups[(params["v"], params["id"] or row["identity"])].append(row)
        if params["v"]:
            people[params["v"]].append(row)
    dwell, visitor_dwell = defaultdict(list), defaultdict(lambda: defaultdict(list))
    for rows in groups.values():
        rows.sort(key=lambda r: r["time"])
        row, location = rows[0], locations[rows[0]["ip"]]
        visible = [(r["time"], value) for r in rows if r["params"]["event"] in ("leave", "resume", "heartbeat") and (value := metric(r["params"], "visible")) is not None]
        seconds, method = (max(value for _, value in visible), "visible_beacon") if visible else (row.get("fallback_seconds"), "time_gap_estimate")
        reported = max((stamp for stamp, _ in visible), default=None)
        item = {"seconds": round(seconds, 2) if seconds is not None else None, "method": method if seconds is not None else "unknown",
                "last_report_at": reported.isoformat() if reported is not None else None}
        dwell[row["params"]["p"]].append(item)
        if row["params"]["v"]:
            visitor_dwell[row["params"]["v"]][row["params"]["p"]].append(item)
        for key in ("ttfb", "dom", "load"):
            samples = [value for r in rows if (value := metric(r["params"], key)) is not None]
            if samples:
                speed[f'{location["province"]}/{location["operator"]}'][key].append(samples[-1])
    def dwell_summary(items):
        known = [item["seconds"] for item in items if item["seconds"] is not None]
        return {"observed_seconds": round(sum(known), 2), "samples": len(known), "unknown_opens": len(items) - len(known),
                "median_seconds": median(known) if known else None, "methods": dict(Counter(item["method"] for item in items)),
                "last_report_at": max((item["last_report_at"] for item in items if item["last_report_at"] is not None), default=None)}
    first = history.get("first_seen", {})
    returning = sum(first.get(visitor, "9999")[:10] < start.isoformat() for visitor in people)
    result = {"region_pageviews": dict(regions), "organization_pageviews": dict(organizations), "app_pageviews": dict(apps),
              "visitor_cohorts": {"first_observed_in_window": len(people) - returning, "returning_observed_before_window": returning,
                                  "observation_from": history.get("observation_from"), "observation_to": history.get("observation_to"), "complete": False},
              "page_dwell": {page: dwell_summary(items) for page, items in dwell.items()},
              "visitor_dwell": {visitor: {"total": dwell_summary([item for items in pages.values() for item in items]),
                                         "pages": {page: dwell_summary(items) for page, items in pages.items()}} for visitor, pages in visitor_dwell.items()},
              "navigation_timing_ms": {group: {key: {"median": median(values), "samples": len(values)} for key, values in metrics.items()} for group, metrics in speed.items()}}
    entries = {"cv": {"label": "简历来的（/cv）", "unique_visitors": 0, "first_at": None, "visitors": []}}
    for visitor, rows in people.items():
        attribution = history.get("first_entry", {}).get(visitor, {})
        name, stamp = attribution.get("entry", "unmarked"), attribution.get("first_at", first.get(visitor))
        group = entries.setdefault(name, {"label": "直接访问/未标记" if name == "unmarked" else name,
                                         "unique_visitors": 0, "first_at": None, "visitors": []})
        group["first_at"] = min(group["first_at"] or stamp, stamp) if stamp else group["first_at"]
        group["visitors"].append({"visitor": visitor, "first_at": stamp, "cities": sorted({locations[r["ip"]]["city"] for r in rows}),
                                 **result["visitor_dwell"].get(visitor, {"pages": {}, "total": dwell_summary([])})})
        group["unique_visitors"] += 1
    result["entry"] = entries
    if cv_only:
        sessions = defaultdict(list)
        for row in events:
            marker = row["params"]["cv-session"]
            if marker:
                sessions[(row["params"]["v"], marker)].append(row)
        # 旧版只给首次 /cv 入口和首页标记；后续页面仅可按同一编号的 30 分钟活动窗口推测。
        legacy = defaultdict(list)
        for row in events:
            if row["params"]["v"] and not row["params"]["cv-session"]:
                legacy[row["params"]["v"]].append(row)
        for visitor, rows in legacy.items():
            current = None
            for row in sorted(rows, key=lambda item: item["time"]):
                if row["params"]["event"] == "entry" and row["params"]["p"].rstrip("/") == "/cv":
                    current = (visitor, "legacy:" + row["time"].isoformat())
                elif current and (row["time"] - sessions[current][-1]["time"]).total_seconds() > 1800:
                    current = None
                if current:
                    sessions[current].append(row)
        visits = []
        for (visitor, marker), rows in sessions.items():
            rows.sort(key=lambda row: row["time"])
            opened = defaultdict(list)
            views = [row for row in rows if row["params"]["event"] in ("", "view")]
            for index, view in enumerate(views):
                instance = [row for row in rows if row["params"]["id"] == view["params"]["id"]
                            and row["params"]["p"] == view["params"]["p"]]
                visible = [value for row in instance if row["params"]["event"] in ("leave", "resume", "heartbeat")
                           and (value := metric(row["params"], "visible")) is not None]
                gap = (views[index + 1]["time"] - view["time"]).total_seconds() if index + 1 < len(views) else None
                seconds = max(visible) if visible else gap if gap is not None and 0 <= gap <= 1800 else None
                opened[view["params"]["p"]].append({"seconds": round(seconds, 2) if seconds is not None else None,
                    "method": "visible_beacon" if visible else "time_gap_estimate" if seconds is not None else "unknown",
                    "last_report_at": max((row["time"].isoformat() for row in instance if row["params"]["event"] in ("leave", "resume", "heartbeat")
                                           and metric(row["params"], "visible") is not None), default=None)})
            first_row = next((row for row in rows if row["params"]["event"] == "entry"), rows[0])
            network = locations[first_row["ip"]]
            visits.append({"visitor": visitor, "session": marker, "first_at": first_row["time"].isoformat(),
                "first_at_kind": "legacy_entry_inferred_30m" if marker.startswith("legacy:") else "entry" if first_row["params"]["event"] == "entry" else "first_observed",
                "possible_region": network["province"] + "/" + network["city"],
                "possible_network": network["organization"], "possible_operator": network["operator"],
                "pages": {page: dwell_summary(items) for page, items in opened.items()}})
        result["cv"] = {"visits": sorted(visits, key=lambda row: row["first_at"]), "count": len(visits),
            "note": "地区和机构只是可能的网络归属，不能确认访客身份；没有合法停留信标且没有下一页时停留未知。旧信标缺访问编号，只能从入口起按同一浏览器编号的 30 分钟活动窗口推测，旧版重复点击 /cv 可能漏记。"}
    if city:
        matches = []
        for visitor, rows in people.items():
            matched = [locations[r["ip"]] for r in rows if city in locations[r["ip"]]["city"] and (not org or org.casefold() in (locations[r["ip"]]["organization"] + " " + locations[r["ip"]]["operator"]).casefold())]
            if matched:
                matches.append({"conclusion": "可能", "visitor": visitor, "first_observed": first.get(visitor),
                                "cities": sorted({r["city"] for r in matched}), "organizations": sorted({r["organization"] for r in matched}),
                                "apps": sorted({app_name(r["ua"]) for r in rows}),
                                "pages": {page: dwell_summary(items) for page, items in visitor_dwell[visitor].items()}})
        result["possible_sources"] = {"conclusion": "可能", "city": city, "org": org, "visitors": matches}
    if deep_since is not None:
        result["deep_read"] = deep_visitors(events, deep_since, locations, history)
    return result


def analyze(paths, start, end, include_self=False, include_monitor=False, extra_records=(), file_range=None, networks=None, history=None, city=None, org=None, deep_since=None, cv_only=False):
    records, seen, malformed, duplicates = list(extra_records), set(), 0, 0
    for path in paths:
        opener = gzip.open if path.suffix == ".gz" else open
        with opener(path, "rt", encoding="utf-8-sig", errors="replace") as stream:
            for line in stream:
                if not line.strip():
                    continue
                try:
                    row = parse_line(line)
                except (ValueError, IndexError):
                    malformed += 1
                    continue
                if file_range and not file_range[0] <= row["time"] < file_range[1]:
                    continue
                records.append(row)
    unique = []
    for row in records:
        if row["identity"] in seen:
            duplicates += 1
            continue
        seen.add(row["identity"])
        unique.append(row)
    records = unique
    history = history if history is not None else {}
    first = history.setdefault("first_seen", {})
    first_entry = history.setdefault("first_entry", {})
    excluded, allowed = defaultdict(list), defaultdict(list)
    filtered = Counter()
    def exclusion(row):
        params, ua = row["params"], row["ua"]
        monitor = params["monitor"] == "1" or "cockpitmonitor" in ua.lower()
        if params["self"] == "1" and not include_self:
            return "self"
        if monitor and not include_monitor:
            return "monitor"
        if BOT.search(ua) and not (monitor and include_monitor):
            return "bot"
        if not ("Mozilla/" in ua and BROWSER.search(ua)) and not (monitor and include_monitor):
            return "non_browser"
        return ""
    for row in records:
        if row["path"] == "/_v.gif" and row["status"] == 200:
            reason = exclusion(row)
            target = excluded if reason in ("self", "monitor") else allowed if not reason else None
            if target is not None:
                target[(row["ip"], row["ua"])].append(row["time"].timestamp())
    for mapping in (excluded, allowed):
        for values in mapping.values():
            values.sort()
    def near(mapping, row):
        values, stamp = mapping[(row["ip"], row["ua"])], row["time"].timestamp()
        offset = bisect.bisect_left(values, stamp - 30)
        return offset < len(values) and values[offset] <= stamp + 30
    daily = {day.isoformat(): {"visitors": set(), "ips": set(), "pv": 0, "log_lines": 0} for day in dates(start, end)}
    visitors, ips, pages, refs, devices = set(), set(), Counter(), Counter(), Counter()
    no_id = 0
    events, ai_requests = [], defaultdict(list)
    for row in records:
        if row["bucket"] == SOURCE and row["path"] == "/_v.gif" and row["status"] == 200 and not exclusion(row) and row["params"]["v"]:
            stamp, visitor = row["time"].isoformat(), row["params"]["v"]
            first[visitor] = min(first.get(visitor, stamp), stamp)
            if row["params"]["entry"] and stamp < first_entry.get(visitor, {}).get("first_at", "9999"):
                first_entry[visitor] = {"entry": row["params"]["entry"], "first_at": stamp}
            history["observation_from"] = min(history.get("observation_from", stamp), stamp)
            history["observation_to"] = max(history.get("observation_to", stamp), stamp)
        day = row["time"].date().isoformat()
        if day not in daily or row["bucket"] != SOURCE:
            continue
        daily[day]["log_lines"] += 1
        for name in AI_BOTS:
            if name.casefold() in row["ua"].casefold():
                ai_requests[name].append(day)
        reason = exclusion(row)
        beacon = row["path"] == "/_v.gif"
        if not reason and not beacon and near(excluded, row) and not near(allowed, row):
            reason = "marked_resource_window"
        if reason:
            filtered[reason] += 1
            continue
        if row["method"] != "GET" or row["operation"] != "GetObject":
            continue
        ips.add(row["ip"])
        daily[day]["ips"].add(row["ip"])
        if not beacon or row["status"] != 200:
            continue
        params = row["params"]
        events.append(row)
        if params["v"]:
            visitors.add(params["v"])
            daily[day]["visitors"].add(params["v"])
        if params["event"] not in ("", "view"):
            continue
        if not params["v"]:
            no_id += 1
        daily[day]["pv"] += 1
        pages[params["p"]] += 1
        refs[params["ref"]] += 1
        ua = row["ua"].lower()
        devices["平板" if "ipad" in ua or ("android" in ua and "mobile" not in ua)
                else "手机" if "mobile" in ua or "iphone" in ua else "电脑"] += 1
    output_daily = [{"date": day, "unique_visitors": len(row["visitors"]), "unique_ips": len(row["ips"]),
                     "pageviews": row["pv"], "log_lines": row["log_lines"],
                     "coverage": "observed_partial" if row["log_lines"] else "no_logs"} for day, row in daily.items()]
    enhancements = visitor_metrics(events, history, start, end, networks, city, org, deep_since, cv_only)
    enhancements["ai_crawler_lower_bound"] = {"by_ua": {name: {"requests": len(values), "dates": dict(Counter(values))} for name, values in ai_requests.items()},
                                               "note": "只是下限，看不到只抓网页的爬虫；UA 声称身份不代表经过身份验证。"}
    return {**enhancements, "timezone": "Asia/Shanghai", "start": start.isoformat(), "end": end.isoformat(), "daily": output_daily,
            "total": {"unique_visitors": len(visitors), "unique_ips": len(ips), "pageviews": sum(pages.values())},
            "top_pages": dict(pages.most_common(20)), "referrers": dict(refs.most_common(20)), "device_classes": dict(devices),
            "log_coverage": {"files": len(paths), "malformed_lines": malformed, "duplicate_lines": duplicates,
                             "first_observed": min((r["time"] for r in records), default=None),
                             "last_observed": max((r["time"] for r in records), default=None), "complete": False},
            "filtered_lines": dict(filtered), "pageviews_without_visitor_id": no_id,
            "include_self": include_self, "include_monitor": include_monitor,
            "notes": ["新/回头客依据本机已观察日志的首次日期，窗口内首次仅为首次观察，未证明绝对新客；苹果 Safari 与微信清存储会使回头客偏少。",
                      "入口按每个访客编号首次已观察到的标记归类，简历来的（/cv）单列；重复入口和回访不重复计人，直接访问/未标记不证明从未通过简历来过。",
                      "离线 IP 地区及 ASN 只是网络归属线索，不代表个人身份或雇主；App 来自 UA，可能漏识别或伪装。",
                      "停留是已收到的累计可见时长：离开、恢复前台和每 15 秒前台心跳按同一页面实例取最大值，再跨实例相加；隐藏时不计时、不发心跳。last_report_at 是最近合法可见时长信标的事件时间，不证明认真阅读或访问已结束；15 秒采样仍叠加 SLS 约 3 分钟延迟。没有合法可见时长信标时用相邻页时间差（最多 30 分钟），最后一页及丢失事件保持未知。",
                      "打开速度为 Navigation Timing 的 responseStart、domComplete、loadEventEnd 各减 startTime，即导航开始后的累计完成毫秒数；仅统计有字段的页面打开，按省份/运营商给中位数。",
                      "以访客编号为主：同一浏览器跨天只算一次；换设备、清存储会多算，共用浏览器会少算。",
                      "IP 是浏览器访问图片桶的替代口径：换网络可能多算，共用 IP 可能少算，缓存资源可能漏算。",
                      "本人/巡检资源仅按同 IP 与同 UA 的信标前后 30 秒排除；附近有正常信标时保留资源，避免误删共享 IP。",
                      "近 7 天 SLS 实时日志约延迟 3 分钟，更早的 OSS 转存最多延迟 48 小时；SLS 首次开通不回填之前的访问，no_logs 或计数为 0 均不是零访客的确证。"]}


def main():
    parser = argparse.ArgumentParser(description="按北京时间查询网站访客（输出 JSON）")
    parser.add_argument("--deep-read", action="store_true", help="查询新达标的深读访客；30 分钟空闲切访问，只用可见信标")
    parser.add_argument("--cv", action="store_true", help="逐次查询 /cv 入口访问及后续页面")
    parser.add_argument("--since", type=datetime.fromisoformat, help="深读检查起点 ISO 时间（必须带时区）")
    parser.add_argument("--json", action="store_true", help="显式选择 JSON（默认已经是 JSON）")
    parser.add_argument("--days", type=int)
    parser.add_argument("--month", help="自然月 YYYY-MM（北京时间）")
    parser.add_argument("--around", type=date.fromisoformat, help="以此日期为中心，默认共 14 天")
    parser.add_argument("--city", help="可能来源查询的城市关键字")
    parser.add_argument("--org", help="可能来源查询的 ASN/机构网络关键字")
    parser.add_argument("--start", type=date.fromisoformat)
    parser.add_argument("--end", type=date.fromisoformat)
    parser.add_argument("--logs-dir", type=Path, help="只分析本地日志，不访问 OSS 或 SLS")
    parser.add_argument("--cache-dir", type=Path, default=Path(r"E:\Cache\wly-site-visitors"))
    parser.add_argument("--aliyun", default=r"E:\Tools\aliyun-cli\aliyun.exe")
    parser.add_argument("--profile", default="website-images")
    parser.add_argument("--bucket", default=BUCKET)
    parser.add_argument("--prefix", default=PREFIX)
    parser.add_argument("--sls-project", default="oss-log-1438786100967605-cn-shanghai")
    parser.add_argument("--sls-logstore", default="oss-log-store")
    parser.add_argument("--include-self", action="store_true")
    parser.add_argument("--include-monitor", action="store_true")
    args = parser.parse_args()
    if bool(args.deep_read) != bool(args.since) or (args.deep_read and (args.since.tzinfo is None or args.start or args.end or args.month or args.around or args.days is not None or args.include_self or args.include_monitor or args.cv)):
        parser.error("--deep-read 与带时区的 --since 配对使用，不能指定日期窗口或包含本人/巡检")
    if bool(args.start) != bool(args.end) or (args.start and args.days is not None) or (args.days is not None and args.days < 1):
        parser.error("同时指定 --start 和 --end，或使用正数 --days")
    if (args.month and (args.start or args.around or args.days is not None)) or (args.around and args.start) or bool(args.around) != bool(args.city) or (args.org and not args.around):
        parser.error("--month 独立使用；--around 与 --city 配对，可加 --org 和正数 --days")
    end = args.end or datetime.now(TZ).date()
    start = args.start or end - timedelta(days=(args.days or 7) - 1)
    if args.deep_read:
        # 日期只用于分析切日；sync_cloud 的深读查询保留这个起点的具体时分秒。
        start = (args.since.astimezone(TZ) - timedelta(minutes=30)).date()
    if args.month:
        try:
            start = datetime.strptime(args.month, "%Y-%m").date().replace(day=1)
            end = (start.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        except ValueError:
            parser.error("--month 格式应为 YYYY-MM")
    if args.around:
        start = args.around - timedelta(days=(args.days or 14) // 2)
        end = start + timedelta(days=(args.days or 14) - 1)
    if start > end:
        parser.error("起始日期不得晚于结束日期")
    try:
        records, file_range, checked_at = [], None, datetime.now(TZ)
        if args.logs_dir:
            if not args.logs_dir.is_dir():
                raise ValueError("日志目录不存在")
            paths = sorted(p for p in args.logs_dir.rglob("*") if p.is_file() and p.suffix in ("", ".log", ".gz"))
            sync = {"mode": "local_only", "sources": [{"source": "local_logs"}]}
        else:
            paths, records, sync, file_range = sync_cloud(args, start, end, checked_at)
        history_path = args.cache_dir / "visitor-history.json"
        history = json.loads(history_path.read_text("utf-8")) if not args.logs_dir and history_path.exists() else {}
        cached = any((args.cache_dir / "networks" / name).is_file() for name in ("ip2region_v4.xdb", "ip2region_v6.xdb", "ip2asn-combined.tsv.gz"))
        database_state = {"status": "unavailable", "reason": "本地模式未缓存地区库，不访问网络；地区/机构保持未知"}
        try:
            networks = None if args.logs_dir and not cached else OfflineNetworks(args.cache_dir, download=not args.logs_dir)
        except NETWORK_ERRORS as error:
            networks, database_state = None, network_failure(error)
        output = analyze(paths, start, end, args.include_self, args.include_monitor, records, file_range, networks, history, args.city, args.org, args.since, args.cv)
        output["offline_network_databases"] = networks.metadata if networks else database_state
        if not args.logs_dir:
            args.cache_dir.mkdir(parents=True, exist_ok=True)
            temporary = history_path.with_suffix(f".{os.getpid()}.tmp")
            temporary.write_text(json.dumps(history, ensure_ascii=False), "utf-8")
            temporary.replace(history_path)
        output["log_coverage"]["sources"] = sync["sources"]
        output["sync"] = sync
        if args.deep_read:
            output["deep_read"]["checked_at"] = checked_at.isoformat()
        selected = output["deep_read"] if args.deep_read else {"start": output["start"], "end": output["end"],
                    "cv": output["cv"], "log_coverage": output["log_coverage"], "sync": output["sync"]} if args.cv else output
        print(json.dumps(selected, ensure_ascii=False, indent=2, default=lambda value: value.isoformat()))
    except (OSError, ValueError, RuntimeError, struct.error, subprocess.TimeoutExpired) as error:
        if isinstance(error, CloudCommandError):
            code = {"连接超时": "query_connection_timeout", "DNS 解析失败": "query_dns_failed",
                    "连接中断": "query_connection_interrupted", "代理拒绝": "query_proxy_refused",
                    "鉴权失败": "query_auth_failed", "请求参数无效": "query_invalid_request",
                    "CLI 初始化失败": "query_cli_init_failed"}.get(error.category, "query_cli_failed")
        elif isinstance(error, OSError):
            code = "query_io_error"
        elif str(error) == "SLS 查询未完成；未将部分日志当作完整结果":
            code = "query_incomplete"
        elif str(error) in ("Unknown SLS response schema", "Incomplete SLS page", "Invalid SLS access-log schema"):
            code = "query_invalid_response"
        else:
            code = "query_failed"
        print(json.dumps({"status": "error", "error_code": code,
                          "reason": "网站访客查询失败；未将失败当作零访客"}, ensure_ascii=False))
        return 1
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
