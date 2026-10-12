#!/usr/bin/env python3
"""Query private OSS/SLS access logs; output aggregates only, never credentials or IPs.

Recent 7 days: SLS real-time logs (~3 minutes); older: OSS archive (up to 48 hours).
"""
import argparse
import bisect
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
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
import subprocess
from threading import Thread
import time
from urllib.parse import parse_qs, unquote, urlsplit
from urllib.request import urlopen

TZ = timezone(timedelta(hours=8))
BUCKET = "wly0829-access-logs-shanghai"
SOURCE = "wly0829-img-media-shanghai"
PREFIX = "access/" + SOURCE + "/"
TOKEN = re.compile(r'"((?:\\.|[^"\\])*)"|\[([^\]]*)\]|([^\s"\[\]]+)')
BOT = re.compile(r"bot|crawl|spider|headless|curl|wget|python|probe|lighthouse|uptime|httpclient|scanner|playwright|puppeteer", re.I)
BROWSER = re.compile(r"Chrome/|Firefox/|Safari/|Edg/|OPR/|SamsungBrowser/", re.I)

def dates(start, end):
    return [start + timedelta(days=i) for i in range((end - start).days + 1)]


def parse_uri(uri):
    uri = unquote(uri) if uri.lower().startswith("%2f") else uri
    parsed = urlsplit(uri)
    query = parse_qs(parsed.query, keep_blank_values=True)
    params = {name: query.get("x-" + name, query.get(name, [""]))[0]
              for name in ("v", "p", "ref", "self", "monitor")}
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
                "method": row.get("http_method", {"GetObject": "GET", "HeadObject": "HEAD"}.get(operation, "")),
                "status": int(row["http_status"]), "path": path, "params": params,
                "ua": ua,
                "bucket": row["bucket"], "operation": operation,
                "identity": (row["bucket"], row["request_id"])}
    except (AttributeError, KeyError, TypeError, ValueError, OverflowError) as error:
        raise ValueError("Invalid SLS access-log schema") from error


class SlsTunnel(BaseHTTPRequestHandler):
    """Process-local CONNECT relay; TLS and CLI credential handling remain intact."""
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


def cli_run(command):
    relay, env = None, None
    if command[1] == "sls" and any(address[4][0].startswith(("198.18.", "198.19."))
                                  for address in socket.getaddrinfo("cn-shanghai.log.aliyuncs.com", 443)):
        # The installed TUN's fake-IP route failed; resolve only the public SLS host.
        with urlopen("https://dns.google/resolve?name=cn-shanghai.log.aliyuncs.com&type=A", timeout=15) as response:
            answers = json.load(response).get("Answer", [])
        addresses = [str(ipaddress.IPv4Address(row["data"])) for row in answers if row.get("type") == 1]
        if not addresses:
            raise RuntimeError("无法解析 SLS 服务地址；未将连接失败当作零访客")
        relay = ThreadingHTTPServer(("127.0.0.1", 0), SlsTunnel)
        relay.sls_address = addresses[0]
        Thread(target=relay.serve_forever, daemon=True).start()
        env = {**os.environ, "NO_PROXY": "", "HTTPS_PROXY": f"http://127.0.0.1:{relay.server_port}"}
    try:
        result = subprocess.run(command, capture_output=True, timeout=180, env=env)
    finally:
        if relay:
            relay.shutdown()
            relay.server_close()
    if result.returncode:
        raise RuntimeError(f"阿里云命令失败（退出码 {result.returncode}）；未输出可能含凭据的原始错误")
    return result.stdout.decode("utf-8-sig")


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
    while True:
        body = {"from": int(start.timestamp()), "to": int(end.timestamp()),
                "query": f"__topic__:oss_access_log AND bucket:{SOURCE}",
                "line": page_size, "offset": offset, "reverse": False}
        command = [args.aliyun, "sls", "GetLogsV2", "--project", args.sls_project,
                   "--logstore", args.sls_logstore, "--region", "cn-shanghai",
                   "--endpoint", "cn-shanghai.log.aliyuncs.com", "--read-timeout", "20", "--connect-timeout", "10",
                   "--profile", args.profile, "--body", json.dumps(body)]
        for attempt in range(3):
            page = json.loads(cli_run(command))
            page = page.get("body", page) if isinstance(page, dict) else page
            page = json.loads(page) if isinstance(page, str) else page
            if not isinstance(page, dict):
                raise ValueError("Unknown SLS response schema")
            meta, data = page.get("meta", {}), page.get("data")
            if not isinstance(meta, dict) or not isinstance(data, list) or meta.get("progress") not in ("Complete", "Incomplete"):
                raise ValueError("Unknown SLS response schema")
            if meta["progress"] == "Complete":
                break
            if attempt < 2:
                time.sleep(1)
        else:
            raise RuntimeError("SLS 查询未完成；未将部分日志当作完整结果")
        if int(meta.get("count", -1)) != len(data) or len(data) > page_size:
            raise ValueError("Incomplete SLS page")
        records.extend(parse_sls_row(row) for row in data)
        if len(data) < page_size:
            return records
        offset += len(data)


def source_windows(start, end, now):
    begin = datetime.combine(start, datetime.min.time(), TZ) - timedelta(seconds=30)
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
    for source, begin, finish in source_windows(start, end, now):
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


def analyze(paths, start, end, include_self=False, include_monitor=False, extra_records=(), file_range=None):
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
    for row in records:
        day = row["time"].date().isoformat()
        if day not in daily or row["bucket"] != SOURCE:
            continue
        daily[day]["log_lines"] += 1
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
        if params["v"]:
            visitors.add(params["v"])
            daily[day]["visitors"].add(params["v"])
        else:
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
    return {"timezone": "Asia/Shanghai", "start": start.isoformat(), "end": end.isoformat(), "daily": output_daily,
            "total": {"unique_visitors": len(visitors), "unique_ips": len(ips), "pageviews": sum(pages.values())},
            "top_pages": dict(pages.most_common(20)), "referrers": dict(refs.most_common(20)), "device_classes": dict(devices),
            "log_coverage": {"files": len(paths), "malformed_lines": malformed, "duplicate_lines": duplicates,
                             "first_observed": min((r["time"] for r in records), default=None),
                             "last_observed": max((r["time"] for r in records), default=None), "complete": False},
            "filtered_lines": dict(filtered), "pageviews_without_visitor_id": no_id,
            "include_self": include_self, "include_monitor": include_monitor,
            "notes": ["以访客编号为主：同一浏览器跨天只算一次；换设备、清存储会多算，共用浏览器会少算。",
                      "IP 是浏览器访问图片桶的替代口径：换网络可能多算，共用 IP 可能少算，缓存资源可能漏算。",
                      "本人/巡检资源仅按同 IP 与同 UA 的信标前后 30 秒排除；附近有正常信标时保留资源，避免误删共享 IP。",
                      "近 7 天 SLS 实时日志约延迟 3 分钟，更早的 OSS 转存最多延迟 48 小时；SLS 首次开通不回填之前的访问，no_logs 或计数为 0 均不是零访客的确证。"]}


def main():
    parser = argparse.ArgumentParser(description="按北京时间查询网站访客（输出 JSON）")
    parser.add_argument("--days", type=int)
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
    if bool(args.start) != bool(args.end) or (args.start and args.days is not None) or (args.days is not None and args.days < 1):
        parser.error("同时指定 --start 和 --end，或使用正数 --days")
    end = args.end or datetime.now(TZ).date()
    start = args.start or end - timedelta(days=(args.days or 7) - 1)
    if start > end:
        parser.error("起始日期不得晚于结束日期")
    try:
        records, file_range = [], None
        if args.logs_dir:
            if not args.logs_dir.is_dir():
                raise ValueError("日志目录不存在")
            paths = sorted(p for p in args.logs_dir.rglob("*") if p.is_file() and p.suffix in ("", ".log", ".gz"))
            sync = {"mode": "local_only", "sources": [{"source": "local_logs"}]}
        else:
            paths, records, sync, file_range = sync_cloud(args, start, end, datetime.now(TZ))
        output = analyze(paths, start, end, args.include_self, args.include_monitor, records, file_range)
        output["log_coverage"]["sources"] = sync["sources"]
        output["sync"] = sync
        print(json.dumps(output, ensure_ascii=False, indent=2, default=lambda value: value.isoformat()))
    except (OSError, ValueError, RuntimeError, subprocess.TimeoutExpired) as error:
        print(json.dumps({"status": "error", "reason": str(error)}, ensure_ascii=False))
        return 1
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
