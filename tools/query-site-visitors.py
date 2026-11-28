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
import secrets
import select
import socket
import shutil
from statistics import median
import struct
import subprocess
import sys
import tempfile
from threading import Lock, Thread
import time
import zlib
from urllib.parse import parse_qs, unquote, urlsplit
from urllib.request import Request, urlopen

TZ = timezone(timedelta(hours=8))
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CACHE = Path(r"E:\Cache\wly-site-visitors")
BUCKET = "wly0829-access-logs-shanghai"
SOURCE = "wly0829-img-media-shanghai"
PIXEL_URL = f"https://{SOURCE}.oss-cn-shanghai.aliyuncs.com/_v.gif"
MAX_EXIT_INTERVAL = timedelta(minutes=45)
SLS_ENDPOINT = "cn-shanghai.dualstack.log.aliyuncs.com"
SLS_SQL_PAGE = 10000
SNAPSHOT_QUERY_SECONDS = 210
PREFIX = "access/" + SOURCE + "/"
TOKEN = re.compile(r'"((?:\\.|[^"\\])*)"|\[([^\]]*)\]|([^\s"\[\]]+)')
LOG_ESCAPE = re.compile(r'\\(["\\])')
BOT = re.compile(r"bot|crawl|spider|headless|curl|wget|python|probe|lighthouse|uptime|httpclient|scanner|playwright|puppeteer", re.I)
BROWSER = re.compile(r"Chrome/|Firefox/|Safari/|Edg/|OPR/|SamsungBrowser/", re.I)
AI_BOTS = ("GPTBot", "ClaudeBot", "PerplexityBot", "Bytespider", "Amazonbot", "meta-externalagent", "Google-Extended")
NETWORK_ERRORS = (OSError, ValueError, RuntimeError, struct.error, EOFError, zlib.error)
BEACON_ID = re.compile(r"[A-Za-z0-9_-]{1,96}")


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


def ip_text(raw):
    address = ipaddress.ip_address(raw)
    return str(getattr(address, "ipv4_mapped", None) or address)


@lru_cache(maxsize=1)
def public_project_ids():
    try:
        data = json.loads((ROOT / "site-v2/live/project/cover-links.json").read_text("utf-8"))
        return frozenset((*data.keys(), *data.values(), "wly0829.cn"))
    except (OSError, ValueError):
        return frozenset({"wly0829.cn"})


def parse_uri(uri):
    uri = unquote(uri) if uri.lower().startswith("%2f") else uri
    parsed = urlsplit(uri)
    query = parse_qs(parsed.query, keep_blank_values=True)
    params = {name: query.get("x-" + name, query.get(name, [""]))[0]
              for name in ("v", "p", "ref", "self", "monitor", "event", "id", "visible", "ttfb", "dom", "load", "first", "entry", "cv-session", "audience", "network-probe", "action")}
    params["p"] = urlsplit(params["p"]).path or "未知页面"
    params["ref"] = urlsplit(params["ref"]).hostname or "直接访问/未知"
    via = query.get("x-via", ())
    params["via"] = via[0] if len(via) == 1 and "via" not in query and re.fullmatch(r"[A-Za-z0-9-]{1,32}", via[0]) else ""
    for name, allowed in (("target", {"github", "pdf"}), ("project", None), ("audience-source", {"device"})):
        values = query.get("x-" + name, ())
        if len(values) == 1 and values[0] in (public_project_ids() if allowed is None else allowed):
            params[name] = values[0]
    return unquote(parsed.path), params


def parse_line(line):
    fields, pos = [], 0
    for match in TOKEN.finditer(line):
        if line[pos:match.start()].strip():
            raise ValueError("Unmatched log token")
        value = match[match.lastindex]
        fields.append(LOG_ESCAPE.sub(r'\1', value) if "\\" in value else value)
        pos = match.end()
    if line[pos:].strip() or len(fields) < 17 or "\ufffd" in line:
        raise ValueError("Incomplete OSS log")
    ip = ip_text(fields[0])
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
                "ip": ip_text(row["client_ip"]),
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
        if port != "443" or not (host == SLS_ENDPOINT or host.endswith("." + SLS_ENDPOINT)):
            self.send_error(403)
            return
        started = time.monotonic()
        row = {"phase": "connect", "close_side": "upstream", "end": "active", "errno": None,
               "client_bytes": 0, "upstream_bytes": 0, "elapsed_ms": 0}
        with self.server.diagnostic_lock:
            if len(self.server.diagnostic_rows) < 4:
                self.server.diagnostic_rows.append(row)
        def update(**values):
            with self.server.diagnostic_lock:
                row.update(values, elapsed_ms=round((time.monotonic() - started) * 1000))
        try:
            try:
                remote = socket.create_connection((self.server.sls_address, 443), timeout=5)
            except OSError:
                if ":" not in self.server.sls_address:
                    raise
                # Keep working on networks without IPv6; TLS and SNI stay in the CLI.
                remote = socket.create_connection((sls_address("A"), 443), timeout=20)
            with remote:
                update(phase="relay", close_side="client")
                self.send_response(200, "Connection established")
                self.end_headers()
                peers = [self.connection, remote]
                while ready := select.select(peers, [], [], 30)[0]:
                    for peer in ready:
                        side = "client" if peer is self.connection else "upstream"
                        update(close_side=side)
                        data = peer.recv(65536)
                        if not data:
                            update(end="eof")
                            return
                        update(**{side + "_bytes": row[side + "_bytes"] + len(data)},
                               close_side="upstream" if side == "client" else "client")
                        (remote if peer is self.connection else self.connection).sendall(data)
                        update(close_side="unknown")
                update(end="idle_timeout", close_side="unknown")
        except OSError as error:
            update(end="socket_error", errno=error.errno)
            return
        finally:
            update()

@lru_cache(maxsize=2)
def sls_address(record_type="AAAA"):
    for attempt in range(3):
        try:
            with urlopen(f"https://dns.alidns.com/resolve?name={SLS_ENDPOINT}&type={record_type}", timeout=8) as response:
                answers = json.load(response).get("Answer", [])
            kind, address_type = (28, ipaddress.IPv6Address) if record_type == "AAAA" else (1, ipaddress.IPv4Address)
            addresses = [str(address_type(row["data"])) for row in answers if row.get("type") == kind]
            if addresses:
                return addresses[0]
            if record_type == "AAAA":
                return sls_address("A")
        except (OSError, ValueError):
            if attempt == 2:
                if record_type == "AAAA":
                    return sls_address("A")
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
    def __init__(self, category, message, diagnostics=None):
        self.category = category
        self.diagnostics = diagnostics or []
        super().__init__(message)


def cli_subtype(result):
    error = (result.stderr + result.stdout).decode("utf-8", errors="replace").lower()
    for subtype, markers in (("connection_reset", ("connection reset",)), ("connection_refused", ("connection refused",)),
                             ("tls_handshake", ("tls handshake",)), ("eof", ("eof",)),
                             ("timeout", ("timeout", "timed out", "deadline exceeded")), ("dns", ("no such host", "name resolution"))):
        if any(marker in error for marker in markers):
            return subtype
    return "other"


def cli_run(command, *, timeout=None, attempts=None):
    relay, env = None, None
    is_sls = command[1] == "sls"
    prepared, diagnostics = False, []
    try:
        attempts = attempts if attempts is not None else (3 if is_sls else 1)
        for attempt in range(attempts):
            started, returncode, subtype = time.monotonic(), None, "other"
            if relay:
                with relay.diagnostic_lock:
                    relay.diagnostic_rows = []
            try:
                if is_sls and not prepared:
                    if any(address[4][0].startswith(("198.18.", "198.19."))
                           for address in socket.getaddrinfo(SLS_ENDPOINT, 443)):
                        address = sls_address()
                        relay = ThreadingHTTPServer(("127.0.0.1", 0), SlsTunnel)
                        relay.sls_address = address
                        relay.diagnostic_lock, relay.diagnostic_rows = Lock(), []
                        Thread(target=relay.serve_forever, daemon=True).start()
                        # OAuth refresh must keep its normal path; this relay accepts SLS only.
                        env = {**os.environ, "NO_PROXY": "oauth.aliyun.com,oauth.alibabacloud.com,signin.aliyun.com,signin.alibabacloud.com",
                               "HTTPS_PROXY": f"http://127.0.0.1:{relay.server_port}"}
                    prepared = True
                result = subprocess.run(command, capture_output=True, timeout=timeout if timeout is not None else (60 if is_sls else 180), env=env)
            except socket.gaierror:
                category, subtype = "DNS 解析失败", "dns"
            except CloudCommandError as error:
                category, subtype = error.category, "dns" if error.category == "DNS 解析失败" else "other"
            except subprocess.TimeoutExpired:
                category, subtype = "连接超时", "process_timeout"
            else:
                if not result.returncode:
                    return result.stdout.decode("utf-8-sig")
                category = cli_error(result)
                subtype, returncode = cli_subtype(result), result.returncode
            connections = []
            if relay:
                with relay.diagnostic_lock:
                    connections = list(relay.diagnostic_rows)
            diagnostics.append({"subtype": subtype, "elapsed_ms": round((time.monotonic() - started) * 1000),
                                "returncode": returncode, "relay": connections})
            if is_sls and category in ("连接超时", "DNS 解析失败", "连接中断") and attempt < attempts - 1:
                time.sleep(attempt + 1)
                continue
            raise CloudCommandError(category, f"阿里云命令失败（{category}，尝试 {attempt + 1} 次）；未输出可能含凭据的原始错误", diagnostics[-3:])
    finally:
        if relay:
            relay.shutdown()
            relay.server_close()
            with relay.diagnostic_lock:
                for diagnostic in diagnostics:
                    diagnostic["relay"] = [dict(row) for row in diagnostic["relay"]]


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
        checksum = None
        if local.exists() and previous.get("etag") == row["etag"] and local.stat().st_size == row["size"]:
            checksum = digest(local)
        if checksum is None or previous.get("sha256") != checksum:
            temporary = local.with_suffix(f".{os.getpid()}.tmp")
            try:
                cli_run([args.aliyun, "ossutil", "cp", f"oss://{args.bucket}/{key}", str(temporary),
                         "--profile", args.profile, "--region", "cn-shanghai",
                         "--endpoint", "oss-cn-shanghai.aliyuncs.com", "--force", "--no-progress", "--loglevel", "off"])
                if temporary.stat().st_size != row["size"]:
                    raise ValueError("Incomplete log download")
                checksum = digest(temporary)
                temporary.replace(local)
            finally:
                temporary.unlink(missing_ok=True)
            downloaded += 1
        index[identity] = {"etag": row["etag"], "size": row["size"], "sha256": checksum}
        paths.append(local)
    temporary = index_path.with_suffix(f".{os.getpid()}.tmp")
    temporary.write_text(json.dumps(index, ensure_ascii=False), "utf-8")
    temporary.replace(index_path)
    return paths, {"listed_objects": len(listed), "objects": len(paths), "downloaded": downloaded, "reused": len(paths) - downloaded}


class SnapshotQueryTimeout(RuntimeError):
    pass


def sls_logs(args, start, end, legacy_fallback=False):
    if not args.sls_project:
        raise ValueError("SLS 项目未配置；请指定 --sls-project")
    snapshot = getattr(args, "snapshot_beacons", False)
    cv_query = getattr(args, "cv", False) and not legacy_fallback and not snapshot
    deep_read = getattr(args, "deep_read", False)
    sql_paging = (deep_read or snapshot) and not cv_query
    records, offset, second_only = [], 0, False
    left, right = int(start.timestamp()), int(end.timestamp())
    page_size = SLS_SQL_PAGE if sql_paging else 10000 if cv_query else 100
    deadline = getattr(args, "snapshot_deadline", None) if snapshot else None
    search = f"__topic__:oss_access_log AND bucket:{SOURCE}"
    if cv_query:
        search += (" | SELECT * WHERE regexp_like(request_uri, '(?i)x-cv-session(?:=|%3d)[A-Za-z0-9-]+"
                   "|x-event(?:=|%3d)entry|x-network-probe(?:=|%3d)[A-Za-z0-9_-]+') LIMIT 10000")
    elif sql_paging or legacy_fallback:
        search += ' AND (request_uri: "/_v.gif" OR request_uri: "%2F_v.gif")'
    while True:
        # 原始查询每页最多 100 条；SQL 大页减少中断后补查积压的逐页开销。
        page_query = search
        if snapshot:
            limit = f"{offset}, {page_size}" if second_only else str(page_size)
            page_query += f" | SELECT * ORDER BY __time__ ASC, request_id ASC LIMIT {limit}"
        elif sql_paging:
            page_query += f" | SELECT * ORDER BY __time__ ASC, request_id ASC LIMIT {offset}, {page_size}"
        body = {"from": left, "to": left + 1 if second_only else right,
                "query": page_query,
                "line": 0 if sql_paging else page_size,
                "offset": 0 if sql_paging else offset, "reverse": False}
        command = [args.aliyun, "sls", "GetLogsV2", "--project", args.sls_project,
                   "--logstore", args.sls_logstore, "--region", "cn-shanghai",
                   "--endpoint", SLS_ENDPOINT, "--read-timeout", "20", "--connect-timeout", "10",
                   "--profile", args.profile, "--body", json.dumps(body)]
        bounded = deep_read or deadline is not None
        attempts, diagnostics = (2 if bounded else 3), []
        for attempt in range(attempts):
            # 有截止的任务一页最多两次，每次最多 25 秒，不叠加 CLI 网络重试。
            remaining = deadline - time.monotonic() if deadline is not None else 25
            if remaining <= 0:
                raise SnapshotQueryTimeout("SLS snapshot budget spent")
            try:
                page = json.loads(cli_run(command, timeout=min(remaining, 25), attempts=1) if bounded else cli_run(command))
            except CloudCommandError as error:
                diagnostics.extend(error.diagnostics)
                error.diagnostics = diagnostics[-attempts:]
                if not bounded or error.category not in ("连接超时", "DNS 解析失败", "连接中断") or attempt == attempts - 1:
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
        if snapshot and len(data) == page_size:
            try:
                timestamps = [int(row["__time__"]) for row in data]
            except (KeyError, TypeError, ValueError):
                raise ValueError("Incomplete SLS page") from None
            edge = timestamps[-1]
            if min(timestamps) < left or max(timestamps) != edge or edge >= body["to"]:
                raise ValueError("Incomplete SLS page")
            if edge > left:
                # The lower API bound is inclusive. Reread the final second as a unit.
                records.extend(parse_sls_row(row) for row, stamp in zip(data, timestamps) if stamp < edge)
                left = edge
            else:
                records.extend(parse_sls_row(row) for row in data)
                second_only = True
                offset += len(data)
                if offset >= 50000:
                    raise RuntimeError("SLS snapshot second exceeds paging limit")
            continue
        records.extend(parse_sls_row(row) for row in data)
        if cv_query and len(data) == page_size:
            raise RuntimeError("SLS 专用链接查询达到单次上限；未将截断日志当作完整结果")
        if len(data) < page_size:
            if second_only and left + 1 < right:
                left, offset, second_only = left + 1, 0, False
                continue
            if cv_query and any(row["params"]["event"] == "entry" and row["params"]["p"].rstrip("/") == "/cv"
                                and not row["params"]["cv-session"] for row in records):
                return sls_logs(args, start, end, legacy_fallback=True)
            return records
        offset += len(data)


def source_windows(start, end, now, begin_at=None, padding=timedelta()):
    begin = (begin_at or datetime.combine(start, datetime.min.time(), TZ) - timedelta(seconds=30)) - padding
    finish = datetime.combine(end + timedelta(days=1), datetime.min.time(), TZ) + timedelta(seconds=30) + padding
    if begin >= finish:
        return []
    cutoff = now - timedelta(days=7)
    windows = []
    if begin < cutoff:
        windows.append(("oss_archive", begin, min(finish, cutoff + timedelta(seconds=30))))
    if finish > cutoff and begin <= now:
        windows.append(("sls_realtime", max(begin, cutoff), min(finish, now + timedelta(seconds=1))))
    return windows


def snapshot_slice(args, begin, stop, now):
    # A failed weekly refresh keeps only the closed, successfully queried slices.
    if args.snapshot_chunks is None or stop > now - timedelta(hours=1):
        return sls_logs(args, begin, stop)
    folder = args.cache_dir / "snapshot-sls-slices"
    key = (SOURCE, args.sls_project, args.sls_logstore, args.launch_at, begin, stop)
    tag = hashlib.sha256(str(key).encode()).hexdigest()[:20]
    path = folder / f"{stop:%Y%m%d}-{tag}.json.gz"
    try:
        with gzip.open(path, "rt", encoding="utf-8") as stream:
            rows = json.load(stream)
        for row in rows:
            row["time"] = datetime.fromisoformat(row["time"])
            row["identity"] = tuple(row["identity"])
        args.snapshot_chunks.add(path)
        return rows
    except (OSError, ValueError, TypeError, KeyError, EOFError):
        pass
    rows = sls_logs(args, begin, stop)
    temporary = path.with_suffix(f".{os.getpid()}.tmp")
    try:
        folder.mkdir(parents=True, exist_ok=True)
        with gzip.open(temporary, "wt", encoding="utf-8", compresslevel=1) as stream:
            json.dump(rows, stream, ensure_ascii=False, separators=(",", ":"), default=datetime.isoformat)
        temporary.replace(path)
        args.snapshot_chunks.add(path)
    except OSError:
        remove_snapshot_slices((temporary,))
    return rows


def remove_snapshot_slices(paths):
    for path in paths:
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass


def sync_cloud(args, start, end, now):
    paths, records, file_range = [], [], None
    sync = {"mode": "hybrid", "listed_objects": 0, "objects": 0, "downloaded": 0, "reused": 0, "sources": []}
    begin_at = args.since.astimezone(TZ) - timedelta(minutes=30) if getattr(args, "deep_read", False) else None
    if getattr(args, "launch_at", None) and not getattr(args, "freeze_legacy", None):
        begin_at = max(begin_at or datetime.combine(start, datetime.min.time(), TZ), args.launch_at)
    padding = MAX_EXIT_INTERVAL if getattr(args, "external_only", False) else timedelta()
    for source, begin, finish in source_windows(start, end, now, begin_at, padding):
        segment = {"source": source, "from": begin, "to": finish}
        if source == "oss_archive":
            paths, archive_sync = sync_logs(args, begin.date(), finish.date())
            sync.update(archive_sync)
            file_range = (begin, finish)
            segment.update({"delay": "最长约 48 小时", "objects": len(paths)})
            sync["sources"].append(segment)
        else:
            while begin < finish:
                if getattr(args, "snapshot_chunks", None) is not None:
                    day_end = datetime.combine(begin.date() + timedelta(days=1), datetime.min.time(), TZ)
                    stop = min(finish, day_end)
                    page = snapshot_slice(args, begin, stop, now)
                else:
                    stop = min(finish, begin + timedelta(days=2)) if getattr(args, "snapshot_beacons", False) else finish
                    page = sls_logs(args, begin, stop)
                records.extend(page)
                sync["sources"].append({"source": source, "from": begin, "to": stop, "delay": "约 3 分钟",
                                        "query_complete": True, "records": len(page)})
                begin = stop
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


def dwell_sample(rows, fallback):
    visible = [(r["time"], value) for r in rows if r["params"]["event"] in ("leave", "resume", "heartbeat")
               and (value := metric(r["params"], "visible")) is not None]
    seconds = max(value for _, value in visible) if visible else fallback
    reported = max((stamp for stamp, _ in visible), default=None)
    return {"seconds": round(seconds, 2) if seconds is not None else None,
            "method": "visible_beacon" if visible else "time_gap_estimate" if seconds is not None else "unknown",
            "last_report_at": reported.isoformat() if reported is not None else None}


def visitor_metrics(events, history, start, end, networks=None, city=None, org=None, deep_since=None, cv_only=False, on_events=None):
    locations = {ip: {"province": "未知", "city": "未知", "operator": "未知", "organization": "未知机构网络"} for ip in {r["ip"] for r in events}}
    if networks:
        try:
            networks.prepare(locations)
            locations = {ip: networks(ip) for ip in locations}
        except NETWORK_ERRORS as error:
            networks.metadata = network_failure(error)
    if on_events:
        on_events(events, locations)
        events = [row for row in events if row["params"]["event"] != "action"]
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
        item = dwell_sample(rows, row.get("fallback_seconds"))
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
    entries = {"cv": {"label": "专用链接来的（/cv）", "unique_visitors": 0, "first_at": None, "visitors": []}}
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
        sessions, legacy = defaultdict(list), defaultdict(list)
        for row in events:
            if row["params"]["entry"] == "live-cv":
                continue
            visitor, marker = row["params"]["v"], row["params"]["cv-session"]
            if marker:
                sessions[(visitor, marker)].append(row)
            elif visitor:
                legacy[visitor].append(row)
        # 旧版只给首次 /cv 入口和首页标记；后续页面仅可按同一编号的 30 分钟活动窗口推测。
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
                gap = (views[index + 1]["time"] - view["time"]).total_seconds() if index + 1 < len(views) else None
                opened[view["params"]["p"]].append(dwell_sample(instance, gap if gap is not None and 0 <= gap <= 1800 else None))
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


def load_records(paths, extra_records=(), file_range=None):
    records, malformed = list(extra_records), 0
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
    return records, malformed


def freeze_legacy(path, paths, records, file_range, launch_at, start, end, sync):
    records, malformed = load_records(paths, records, file_range)
    if malformed:
        raise ValueError("日志有损坏行，未冻结")
    unique = {row["identity"]: row for row in records if start <= row["time"].date() <= end and row["time"] < launch_at}
    archive = {"schema": "site-visitors.legacy.v1", "launch_at": launch_at.isoformat(),
               "start": start.isoformat(), "end": end.isoformat(), "sync": sync, "records": list(unique.values()), "complete": False}
    path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(path, "xt", encoding="utf-8") as stream:
        json.dump(archive, stream, ensure_ascii=False, default=lambda value: value.isoformat())
    path.chmod(0o444)
    return {"status": "frozen", "records": len(unique), "launch_at": launch_at.isoformat(), "complete": False, "sources": sync["sources"]}


def classified_beacon(row):
    params = row["params"]
    event = params.get("event")
    return (row["bucket"] == SOURCE and row["path"] == "/_v.gif" and row["status"] == 200
            and row["method"] == "GET" and row["operation"] == "GetObject"
            and (event in {"view", "perf", "entry", "leave", "resume", "heartbeat"} or
                 event == "action" and params.get("action") in {"email_copy", "external_link", "download", "project_link"})
            and params.get("audience") in {"external", "internal"})


def excluded_open(row, reason):
    p = row["params"]
    if (p["event"] != "view" or not p["p"].startswith("/") or row["path"] != "/_v.gif" or row["status"] != 200
            or row["method"] != "GET" or row["operation"] != "GetObject"
            or not BEACON_ID.fullmatch(p["v"]) or not BEACON_ID.fullmatch(p["id"])):
        return None
    paired = p["audience"] == "internal" and p.get("audience-source") == "device"
    return 0 if paired or reason == "self" else {"monitor": 1, "bot": 2}.get(reason)


def send_exit_probe(path):
    nonce = secrets.token_urlsafe(18)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as stream:
        stream.write(nonce + "\n")
    try:
        subprocess.run(["curl.exe", "--ipv4", "--noproxy", "*", "--silent", "--head", "--max-time", "4",
                        f"{PIXEL_URL}?x-network-probe={nonce}"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                       timeout=5, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
    except (OSError, subprocess.TimeoutExpired):
        pass  # No matching OSS receipt means no coverage for this probe.


def exit_observations(records, probes):
    observed = set()
    for row in records:
        nonce = row["params"].get("network-probe")
        if nonce not in probes or row["bucket"] != SOURCE or row["path"] != "/_v.gif" or row["method"] != "HEAD" or row["status"] != 200:
            continue
        address = ipaddress.ip_address(row["ip"])
        if address.version == 4 and address.is_global and not address.is_multicast:
            observed.add((row["time"], str(address)))
    return sorted(observed)


def analyze(paths, start, end, include_self=False, include_monitor=False, extra_records=(), file_range=None, networks=None, history=None, city=None, org=None, deep_since=None, cv_only=False, launch_at=None, page=None, entry=None, *, external_only=False, exit_probes=None, on_events=None, on_excluded_opens=None):
    records, malformed = load_records(paths, extra_records, file_range)
    observations = exit_observations(records, exit_probes or set()) if external_only else []
    exit_times = [stamp for stamp, _ in observations]

    def observed_exit(stamp):
        index = bisect.bisect_right(exit_times, stamp)
        if 0 < index < len(observations):
            (before, first), (after, last) = observations[index - 1:index + 1]
            if first == last and after - before <= MAX_EXIT_INTERVAL:
                return first

    records = [row for row in records if launch_at is None or row["time"] >= launch_at]
    history = history if history is not None else {}
    external_since = history.get("external_since") if external_only else None
    if external_only and (observed := min((row["time"].isoformat() for row in records if classified_beacon(row)), default=None)):
        external_since = history["external_since"] = min(external_since or observed, observed)
    records = [row for row in records if (page is None or row["params"]["p"].rstrip("/") == page.rstrip("/"))
               and (entry is None or row["params"]["entry"] == entry)]
    unique = {}
    for row in records:
        unique.setdefault(row["identity"], row)
    duplicates = len(records) - len(unique)
    records = unique.values()
    first = history.setdefault("first_seen", {})
    first_entry = history.setdefault("first_entry", {})
    nearby = defaultdict(list)
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
        if external_only:
            if not classified_beacon(row):
                return "unclassified"
            if params["audience"] == "internal":
                return "internal"
            address = ipaddress.ip_address(row["ip"])
            if not address.is_global or address.is_multicast:
                return "internal_network"
            home = observed_exit(row["time"]) if address.version == 4 else None
            if home is None or str(address) == home:
                return "network_unverified" if home is None else "shared_exit"
        return ""
    for row in records:
        if row["path"] == "/_v.gif" and row["status"] == 200:
            reason = exclusion(row)
            if not reason or reason in ("self", "monitor"):
                nearby[(bool(reason), row["ip"], row["ua"])].append(row["time"].timestamp())
    for values in nearby.values():
        values.sort()
    def near(is_excluded, row):
        values, stamp = nearby[(is_excluded, row["ip"], row["ua"])], row["time"].timestamp()
        offset = bisect.bisect_left(values, stamp - 30)
        return offset < len(values) and values[offset] <= stamp + 30
    daily = {day.isoformat(): {"visitors": set(), "ips": set(), "pv": 0, "log_lines": 0, "covered": False} for day in dates(start, end)}
    visitors, ips, pages, refs, devices = set(), set(), Counter(), Counter(), Counter()
    no_id = 0
    events, ai_requests, uncertain_days, view_ids = [], defaultdict(list), set(), set()
    excluded_opens = {}
    for row in records:
        if row["bucket"] == SOURCE and row["path"] == "/_v.gif" and row["status"] == 200 and not exclusion(row) and row["params"]["v"] and row["params"]["event"] != "action":
            stamp, visitor = row["time"].isoformat(), row["params"]["v"]
            first[visitor] = min(first.get(visitor, stamp), stamp)
            if row["params"]["entry"] and stamp < first_entry.get(visitor, {}).get("first_at", "9999"):
                first_entry[visitor] = {"entry": row["params"]["entry"], "first_at": stamp}
            history["observation_from"] = min(history.get("observation_from", stamp), stamp)
            history["observation_to"] = max(history.get("observation_to", stamp), stamp)
        day = row["time"].date().isoformat()
        if day not in daily or row["bucket"] != SOURCE:
            continue
        if not external_only or classified_beacon(row):
            daily[day]["log_lines"] += 1
            if external_only and observed_exit(row["time"]) and ipaddress.ip_address(row["ip"]).version == 4:
                daily[day]["covered"] = True
        for name in AI_BOTS:
            if name.casefold() in row["ua"].casefold():
                ai_requests[name].append(day)
        reason = exclusion(row)
        beacon = row["path"] == "/_v.gif"
        if not reason and not beacon and near(True, row) and not near(False, row):
            reason = "marked_resource_window"
        if reason:
            if external_only and on_excluded_opens and (kind := excluded_open(row, reason)) is not None:
                key, at = (row["params"]["v"], row["params"]["id"]), row["time"]
                prev_at, prev_kind = excluded_opens.get(key, (at, kind))
                excluded_opens[key] = min(prev_at, at), min(prev_kind, kind)
            if reason in {"network_unverified", "shared_exit"} or (beacon and row["params"].get("audience") == "unknown"):
                uncertain_days.add(day)
            filtered[reason] += 1
            continue
        if row["method"] != "GET" or row["operation"] != "GetObject":
            continue
        params = row["params"]
        if params["event"] == "action":
            if external_only and on_events:
                events.append(row)
            continue
        if external_only and params["event"] == "view" and params["id"]:
            instance = (params["v"], params["id"])
            if instance in view_ids:
                continue
            view_ids.add(instance)
        ips.add(row["ip"])
        daily[day]["ips"].add(row["ip"])
        if not beacon or row["status"] != 200:
            continue
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
    output_daily = []
    for day, row in daily.items():
        coverage = "observed_partial" if row["log_lines"] else "no_logs"
        if external_only and (external_since is None or day < external_since[:10]):
            coverage = "before_external_scope"
        elif external_only and (row["log_lines"] and not row["covered"] or day in uncertain_days and not row["ips"]):
            coverage = "network_unverified"
        counts = dict(unique_visitors=len(row["visitors"]), unique_ips=len(row["ips"]), pageviews=row["pv"])
        if external_only and coverage != "observed_partial":
            counts = dict.fromkeys(counts)
        output_daily.append(dict(date=day, coverage=coverage, log_lines=row["log_lines"], **counts))
    total = dict(unique_visitors=len(visitors), unique_ips=len(ips), pageviews=sum(pages.values()))
    if external_only and not ips and (uncertain_days or not any(row["coverage"] == "observed_partial" for row in output_daily)):
        total = dict.fromkeys(total)
    sink = None
    if external_only and (on_events or on_excluded_opens):
        archive_readable = not malformed and file_range and any(
            file_range[0] <= row["time"] < file_range[1] - timedelta(seconds=30) and start <= row["time"].date() <= end for row in records)
        if on_excluded_opens:
            on_excluded_opens(excluded_opens.values(), archive_readable, external_since)
        if on_events:
            sink = lambda events, locations: on_events(events, locations, observations, archive_readable)
    enhancements = visitor_metrics(events, history, start, end, networks, city, org, deep_since, cv_only, sink)
    enhancements["ai_crawler_lower_bound"] = {"by_ua": {name: {"requests": len(values), "dates": dict(Counter(values))} for name, values in ai_requests.items()},
                                               "note": "只是下限，看不到只抓网页的爬虫；UA 声称身份不代表经过身份验证。"}
    return {**enhancements, "count_scope": "external_only" if external_only else "legacy_or_diagnostic",
            "external_since": external_since,
            "timezone": "Asia/Shanghai", "start": start.isoformat(), "end": end.isoformat(), "daily": output_daily,
            "total": total,
            "top_pages": dict(pages.most_common(20)), "referrers": dict(refs.most_common(20)), "device_classes": dict(devices),
            "log_coverage": {"files": len(paths), "malformed_lines": malformed, "duplicate_lines": duplicates,
                             "first_observed": min((r["time"] for r in records), default=None),
                             "last_observed": max((r["time"] for r in records), default=None), "complete": False},
            "filtered_lines": dict(filtered), "pageviews_without_visitor_id": no_id,
            "include_self": include_self, "include_monitor": include_monitor,
            "notes": ["新/回头客依据本机已观察日志的首次日期，窗口内首次仅为首次观察，未证明绝对新客；苹果 Safari 与微信清存储会使回头客偏少。",
                      "入口按每个访客编号首次已观察到的标记归类，专用链接来的（/cv）单列；重复入口和回访不重复计人，直接访问/未标记不证明从未通过专用链接来过。",
                      "离线 IP 地区及 ASN 只是网络归属线索，不代表个人身份或雇主；App 来自 UA，可能漏识别或伪装。",
                      "停留是已收到的累计可见时长：离开、恢复前台和每 15 秒前台心跳按同一页面实例取最大值，再跨实例相加；隐藏时不计时、不发心跳。last_report_at 是最近合法可见时长信标的事件时间，不证明认真阅读或访问已结束；15 秒采样仍叠加 SLS 约 3 分钟延迟。没有合法可见时长信标时用相邻页时间差（最多 30 分钟），最后一页及丢失事件保持未知。",
                      "打开速度为 Navigation Timing 的 responseStart、domComplete、loadEventEnd 各减 startTime，即导航开始后的累计完成毫秒数；仅统计有字段的页面打开，按省份/运营商给中位数。",
                      "以访客编号为主：同一浏览器跨天只算一次；换设备、清存储会多算，共用浏览器会少算。",
                      ("外来来访仅用可分类的页面信标；未分类旧数据和图片请求不计入访客、访问与独立 IP。" if external_only else
                       "本人/巡检资源按同 IP 与同 UA 的信标前后 30 秒排除；附近有正常信标时保留资源。"),
                      "近 7 天 SLS 实时日志约延迟 3 分钟，更早的 OSS 转存最多延迟 48 小时；SLS 首次开通不回填之前的访问，no_logs 或计数为 0 均不是零访客的确证。"]}


def read_launch_at(path):
    try:
        config = json.loads(path.read_text("utf-8-sig"))
    except FileNotFoundError:
        return None
    stamp = config.get("launch_at") if isinstance(config, dict) else None
    if not isinstance(stamp, str):
        raise ValueError("上线配置必须有带时区的 launch_at")
    launch_at = datetime.fromisoformat(stamp)
    if launch_at.tzinfo is None:
        raise ValueError("上线时刻必须带时区")
    return launch_at.astimezone(TZ)


def initialize_era(path, launch_at):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=path.parent) as staging:
        temporary = Path(staging) / path.name
        temporary.write_text(json.dumps({"launch_at": launch_at.isoformat()}) + "\n", encoding="utf-8")
        try:
            os.link(temporary, path)
        except FileExistsError:
            if read_launch_at(path) != launch_at:
                raise ValueError("已有不同的上线时刻，保留现有配置") from None


def live_producer():
    sys.path.insert(0, str(ROOT / "scripts"))
    import live_project
    return live_project


def due_snapshot(registry, instant):
    producer = live_producer()
    sources = producer.read(registry)["project_sources"]["wlyaaaaa/wly0829.cn"]["sources"]
    paths = {key: sources[f"website.{key}"]["path"] for key in ("public", "owner")}
    try:
        snapshots = [producer.read(path) for path in paths.values()]
        fresh = all(row.get("count_scope") == "external_only" and instant - datetime.fromisoformat(row["times"]["visitors"]) < timedelta(hours=1) for row in snapshots)
    except (FileNotFoundError, ValueError, TypeError, KeyError):
        fresh = False
    return None if fresh else paths


def start_site_era(argv):
    parser = argparse.ArgumentParser(prog="query-site-visitors.py start-site-era", description="登记实际的上线时刻并刷新实况访客统计")
    parser.add_argument("--launch-at", type=datetime.fromisoformat, help="带时区的实际上线时刻，省略时取当前北京时间")
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    parser.add_argument("--execute", action="store_true", help="写入配置并查询；默认只预演")
    args = parser.parse_args(argv)
    now = datetime.now(TZ)
    launch_at = args.launch_at or now
    if launch_at.tzinfo is None or launch_at > now:
        parser.error("--launch-at 须为带时区的实际上线时刻，不得晚于现在")
    launch_at = launch_at.astimezone(TZ)
    cache = args.cache_dir.resolve()
    path = cache / "site-era.json"
    archive = cache / f"legacy-{launch_at:%Y%m%dT%H%M%S-%f}.json.gz"

    def quote(value):
        return "'" + str(value).replace("'", "''") + "'"

    try:
        existing = read_launch_at(path)
        if existing is not None and existing != launch_at:
            raise ValueError(f"{path} 已登记 {existing.isoformat()}，保留现有配置")
        print(f"{'执行' if args.execute else '预演'}：{path} -> {json.dumps({'launch_at': launch_at.isoformat()})}")
        print(f"用这条分界刷新近 7 天访客实况，登记路径见 {ROOT / '.publish/private/live-project.json'}")
        print(f"上线至少 5 分钟后执行（{(launch_at + timedelta(minutes=5)).isoformat()} 起）：")
        print(f"python -B -X utf8 {quote(Path(__file__).resolve())} --cache-dir {quote(cache)} "
              f"--freeze-legacy {quote(archive)} --start 1970-01-01 --end {launch_at.date()}")
        if args.execute:
            live_producer().read_live_paths(ROOT, require_registered=True)
            if existing is None:
                initialize_era(path, launch_at)
            return main(["--cache-dir", str(cache)], require_live=True)
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    return 0


def main(argv=None, *, require_live=False, on_events=None, beacon_only=False, on_excluded_opens=None):
    argv = sys.argv[1:] if argv is None else argv
    if argv[:1] == ["start-site-era"]:
        return start_site_era(argv[1:])
    parser = argparse.ArgumentParser(description="按北京时间查询网站访客；配置上线时刻后默认只算新站，旧记录仅用 --legacy-archive 显式查（JSON）")
    parser.epilog = "新站上线请用 start-site-era --help"
    parser.add_argument("--era-config", type=Path, help="上线配置 JSON；默认 <cache-dir>/site-era.json 的 launch_at（带时区 ISO）")
    parser.add_argument("--legacy-archive", type=Path, help="只读冻结旧档，不联网；未指定日期时查询整份旧档")
    parser.add_argument("--freeze-legacy", type=Path, help="导出上线前日志为只读 gzip JSON；须明确 --start/--end，不覆盖已有档案")
    parser.add_argument("--page", help="只看指定页面路径（忽略末尾斜线）；/cv 跳转不算 PV，逐次入口用 --cv")
    parser.add_argument("--entry", help="只看指定入口标记，例如 cv；后续页面详情用 --cv")
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
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    parser.add_argument("--aliyun", default=r"E:\Tools\aliyun-cli\aliyun.exe")
    parser.add_argument("--profile", default="website-images")
    parser.add_argument("--bucket", default=BUCKET)
    parser.add_argument("--prefix", default=PREFIX)
    parser.add_argument("--sls-project", default="oss-log-1438786100967605-cn-shanghai")
    parser.add_argument("--sls-logstore", default="oss-log-store")
    parser.add_argument("--include-self", action="store_true")
    parser.add_argument("--include-monitor", action="store_true")
    parser.add_argument("--monitor-sources", type=Path, help=argparse.SUPPRESS)
    args = parser.parse_args(argv)
    if args.legacy_archive and (args.logs_dir or args.freeze_legacy or args.deep_read):
        parser.error("--legacy-archive 不与本地日志、冻结或深读提醒混用")
    if args.freeze_legacy and (not args.start or not args.end or args.cv or args.deep_read or args.page or args.entry):
        parser.error("冻结须明确 --start/--end，不能筛页面、入口或提醒")
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
        config_path = args.era_config or args.cache_dir / "site-era.json"
        args.launch_at = read_launch_at(config_path) if not args.legacy_archive else None
        if (args.freeze_legacy or require_live) and not args.launch_at:
            raise ValueError("冻结或上线刷新前须配置上线时刻")
        records, file_range, checked_at = [], None, datetime.now(TZ)
        local_only = bool(args.logs_dir or args.legacy_archive)
        external_only = not (args.legacy_archive or args.include_self or args.include_monitor)
        args.external_only = external_only and not args.freeze_legacy
        full_snapshot = (not any((local_only, args.freeze_legacy, args.deep_read, args.cv, args.around, args.month,
                                  args.include_self, args.include_monitor, args.page, args.entry))
                         and end == checked_at.date() and (end - start).days == 6)
        probe_path = args.cache_dir / "internal-visitor-probes.txt"
        official_probe = (args.monitor_sources and args.cv and args.days == 2 and not local_only
                          and args.cache_dir.resolve() == DEFAULT_CACHE.resolve() and os.environ.get("AGENTS_BACKGROUND_AUTOMATION") == "1")
        snapshot_paths = snapshot_error = recent = None
        snapshot_deadline = time.monotonic() + SNAPSHOT_QUERY_SECONDS
        if official_probe:
            send_exit_probe(probe_path)
            try:
                snapshot_paths = due_snapshot(args.monitor_sources, checked_at)
            except (OSError, ValueError, TypeError, KeyError):
                snapshot_error = "snapshot_registry_unavailable"
        args.snapshot_beacons = beacon_only
        exit_probes = set(probe_path.read_text("utf-8").splitlines()) if external_only and probe_path.is_file() else set()
        if args.legacy_archive:
            with gzip.open(args.legacy_archive, "rt", encoding="utf-8") as stream:
                archive = json.load(stream)
            if archive["schema"] != "site-visitors.legacy.v1":
                raise ValueError("旧档格式不兼容")
            records, paths = archive["records"], []
            for row in records:
                row["time"] = datetime.fromisoformat(row["time"])
                if isinstance(row["identity"], list):
                    row["identity"] = tuple(row["identity"])
            if not any((args.start, args.days, args.month, args.around)):
                start = min((r["time"].date() for r in records), default=date.fromisoformat(archive["start"]))
                end = max((r["time"].date() for r in records), default=date.fromisoformat(archive["end"]))
            sync = {"mode": "frozen_legacy", "sources": archive["sync"]["sources"]}
        elif args.logs_dir:
            if not args.logs_dir.is_dir():
                raise ValueError("日志目录不存在")
            paths = sorted(p for p in args.logs_dir.rglob("*") if p.is_file() and p.suffix in ("", ".log", ".gz"))
            sync = {"mode": "local_only", "sources": [{"source": "local_logs"}]}
        else:
            paths, records, sync, file_range = sync_cloud(args, start, end, checked_at)
            if snapshot_paths:
                overview_start = end - timedelta(days=6)
                args.snapshot_beacons = True
                args.snapshot_deadline = snapshot_deadline
                args.snapshot_chunks = set()
                older = (overview_start - timedelta(days=1)).strftime("%Y%m%d")
                folder = args.cache_dir / "snapshot-sls-slices"
                remove_snapshot_slices(path for path in folder.glob("*.json.gz")
                                       if path.name[:8].isdigit() and path.name[:8] < older)
                try:
                    overview = sync_cloud(args, overview_start, end, checked_at)
                except (OSError, ValueError, RuntimeError, struct.error, subprocess.TimeoutExpired) as error:
                    snapshot_error = "snapshot_query_timeout" if isinstance(error, SnapshotQueryTimeout) else "snapshot_query_failed"
                    snapshot_paths = None
                    args.snapshot_beacons = beacon_only
                else:
                    recent = paths, records, sync, file_range, start
                    paths, records, sync, file_range = overview
                    start = overview_start
        if args.freeze_legacy:
            print(json.dumps(freeze_legacy(args.freeze_legacy, paths, records, file_range, args.launch_at, start, end, sync), ensure_ascii=False, default=lambda value: value.isoformat()))
            return 0
        era_suffix = "-" + hashlib.sha256(args.launch_at.isoformat().encode()).hexdigest()[:12] if args.launch_at else ""
        scope_suffix = "-external-v1" if external_only else ""
        history_path = args.cache_dir / f"visitor-history{scope_suffix}{era_suffix}.json"
        history = json.loads(history_path.read_text("utf-8")) if not local_only and history_path.exists() else {}
        cached = any((args.cache_dir / "networks" / name).is_file() for name in ("ip2region_v4.xdb", "ip2region_v6.xdb", "ip2asn-combined.tsv.gz"))
        database_state = {"status": "unavailable", "reason": "本地模式未缓存地区库，不访问网络；地区/机构保持未知"}
        try:
            networks = None if local_only and not cached else OfflineNetworks(args.cache_dir, download=not local_only)
        except NETWORK_ERRORS as error:
            networks, database_state = None, network_failure(error)
        sink = None
        exclusions = None
        if args.logs_dir or not args.cv or args.snapshot_beacons:
            if on_events:
                sink = lambda events, locations, observations, archive: on_events(events, locations, observations, archive, args, sync, checked_at, start, end)
            if on_excluded_opens:
                exclusions = lambda rows, archive, since: on_excluded_opens(rows, archive, since, args, sync, checked_at, start, end)
        output = analyze(paths, start, end, args.include_self, args.include_monitor, records, file_range, networks, history, args.city, args.org, args.since, args.cv and recent is None, args.launch_at, args.page, args.entry,
                         external_only=external_only, exit_probes=exit_probes, on_events=sink, on_excluded_opens=exclusions)
        output["site_scope"] = {"mode": "frozen_legacy" if args.legacy_archive else "new_site" if args.launch_at else "all_observed", "launch_at": args.launch_at}
        output["offline_network_databases"] = networks.metadata if networks else database_state
        cv_output = output
        if recent:
            cv_paths, cv_records, cv_sync, cv_range, cv_start = recent
            cv_output = analyze(cv_paths, cv_start, end, args.include_self, args.include_monitor, cv_records, cv_range,
                                networks, history, cv_only=True, launch_at=args.launch_at, page=args.page, entry=args.entry,
                                external_only=external_only, exit_probes=exit_probes)
            cv_output.update(site_scope=output["site_scope"], sync=cv_sync)
            cv_output["log_coverage"]["sources"] = cv_sync["sources"]
        if not local_only and not args.page and not args.entry and external_only:
            args.cache_dir.mkdir(parents=True, exist_ok=True)
            temporary = history_path.with_suffix(f".{os.getpid()}.tmp")
            temporary.write_text(json.dumps(history, ensure_ascii=False), "utf-8")
            temporary.replace(history_path)
        output["log_coverage"]["sources"] = sync["sources"]
        output["sync"] = sync
        if snapshot_paths:
            try:
                live_producer().visitors(ROOT, output, checked_at.isoformat(), require_registered=True, registered_paths=snapshot_paths)
                remove_snapshot_slices(args.snapshot_chunks)
            except (OSError, ValueError, TypeError, KeyError):
                snapshot_error = "snapshot_write_failed"
        if require_live:
            try:
                live_producer().visitors(ROOT, output, checked_at.isoformat(), require_registered=True)
            except (OSError, ValueError, KeyError, IndexError) as error:
                print(f"实况快照更新失败（{type(error).__name__}）。请用同一个 --launch-at 重试。", file=sys.stderr)
                return 1
        elif full_snapshot:
            live_producer().record('visitors', ROOT, output, checked_at.isoformat())
        if args.deep_read:
            output["deep_read"].update(checked_at=checked_at.isoformat(), **{key: output[key] for key in ("site_scope", "count_scope", "external_since")})
        selected = output["deep_read"] if args.deep_read else {key: cv_output[key] for key in (
            "start", "end", "cv", "site_scope", "count_scope", "external_since", "log_coverage", "sync")} if args.cv else output
        if snapshot_error:
            selected["snapshot_refresh_error"] = snapshot_error
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
        failure = {"status": "error", "error_code": code, "reason": "网站访客查询失败；未将失败当作零访客"}
        if isinstance(error, CloudCommandError) and error.diagnostics:
            failure["query_diagnostics"] = error.diagnostics
        print(json.dumps(failure, ensure_ascii=False))
        return 1
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
