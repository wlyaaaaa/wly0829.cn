#!/usr/bin/env python3
"""Read search aggregates; credentials are injected by Password Center, never logged."""
import argparse
import base64
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import time
from urllib.error import HTTPError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

SITE = "https://wly0829.cn/"
PROPERTY = "sc-domain:wly0829.cn"
TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_API = "https://www.googleapis.com/webmasters/v3/sites/" + quote(PROPERTY, safe="") + "/searchAnalytics/query"
GOOGLE_INDEX = "https://search.google.com/search-console/index?resource_id=" + quote(PROPERTY, safe="")
NOTES = ["Google 使用太平洋日期，数据通常晚 2–3 天；默认截止日期为当地今天减 3 天。",
         "Google 低频词会被隐去，API 也只返回可用的主要词；词表之和不能代替无维度的网站总量。",
         "Bing 词统计每周更新；Date 代表的周覆盖区间未知，仅按返回 Date 筛选，不能保证完整覆盖所选天数。",
         "Bing 网站总量包含 Web、Chat、News、Images、Videos、KnowledgePanel；排名保持官方返回口径，不自行加 1。",
         "空记录只表示 API 在本次查询中未返回数据，不能据此保证整段时间内无人搜索或点击。"]
def request(url, data=None, headers=None):
    with urlopen(Request(url, data=data, headers=headers or {}), timeout=45) as response:
        return json.load(response)
def google_token(raw):
    credential = json.loads(raw)
    if credential.get("type") == "authorized_user":
        payload = {key: credential[key] for key in ("client_id", "client_secret", "refresh_token")}
        payload["grant_type"] = "refresh_token"
    elif credential.get("type") == "service_account":
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding
        encode = lambda value: base64.urlsafe_b64encode(value).rstrip(b"=")
        now = int(time.time())
        claim = {"iss": credential["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly",
                 "aud": TOKEN_URL, "iat": now, "exp": now + 3600}
        message = encode(b'{"alg":"RS256","typ":"JWT"}') + b"." + encode(json.dumps(claim).encode())
        key = serialization.load_pem_private_key(credential["private_key"].encode(), password=None)
        assertion = message + b"." + encode(key.sign(message, padding.PKCS1v15(), hashes.SHA256()))
        payload = {"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion.decode()}
    else:
        raise ValueError("Unsupported credential type")
    return request(TOKEN_URL, urlencode(payload).encode(), {"Content-Type": "application/x-www-form-urlencoded"})["access_token"]
def google(start, end, limit, raw):
    headers = {"Authorization": "Bearer " + google_token(raw), "Content-Type": "application/json"}
    def query(dimensions, offset=0):
        body = {"startDate": str(start), "endDate": str(end), "type": "web", "dataState": "final",
                "dimensions": dimensions, "rowLimit": 25000, "startRow": offset}
        return request(GOOGLE_API, json.dumps(body).encode(), headers).get("rows", [])
    summary = query([])
    total = {key: summary[0][key] if summary else (None if key == "position" else 0)
             for key in ("clicks", "impressions", "position")}
    rows, offset = [], 0
    while True:
        page = query(["query"], offset)
        rows.extend({"query": row["keys"][0], **{key: row[key] for key in total}} for row in page)
        if len(page) < 25000:
            break
        offset += len(page)
    return {"status": "ok", "scope": "Google 网页搜索；无维度总量与可见词表分开",
            "total": total, "returned_terms": len(rows), "terms": top(rows, limit),
            "indexed_pages": "Unknown", "index_url": GOOGLE_INDEX,
            "index_note": "官方 API 无全站收录总量；站点地图 indexed 字段已废弃，请查看 Page Indexing。"}
def bing_date(value):
    match = re.fullmatch(r"/Date\((-?\d+)([+-]\d{4})?\)/", value)
    if not match:
        return date.fromisoformat(value[:10])
    offset = match[2]
    minutes = (int(offset[1:3]) * 60 + int(offset[3:])) * (-1 if offset[0] == "-" else 1) if offset else 0
    return datetime.fromtimestamp(int(match[1]) / 1000, timezone.utc).astimezone(timezone(timedelta(minutes=minutes))).date()
def top(rows, limit):
    return sorted(rows, key=lambda row: (-row["clicks"], -row["impressions"], row["query"]))[:limit]
def safe_error(error):
    return f"读取失败（HTTP {error.code}）；未输出原始错误" if isinstance(error, HTTPError) else "读取失败；请检查凭据、授权、网络或返回结构（原始错误未输出）"

def bing(start, end, limit, key):
    result = {"status": "ok", "scope": "Bing 网站多类搜索总量；词表仅按 Date 筛选，周覆盖未知", "errors": [], "terms": []}
    def get(method):
        response = request("https://ssl.bing.com/webmaster/api.svc/json/" + method + "?" + urlencode({"siteUrl": SITE, "apikey": key}))
        rows = response["d"]
        if not isinstance(rows, list):
            raise ValueError("Unexpected Bing response")
        return rows
    def selected(rows):
        return [row for row in rows if start <= bing_date(row["Date"]) <= end]
    for method in ("GetQueryStats", "GetRankAndTrafficStats", "GetCrawlStats"):
        try:
            rows = get(method)
            if method == "GetCrawlStats":
                latest = max(rows, key=lambda row: bing_date(row["Date"]), default=None)
                result.update(indexed_pages=latest["InIndex"] if latest else "Unknown",
                              index_date=str(bing_date(latest["Date"])) if latest else None)
            elif method == "GetRankAndTrafficStats":
                rows = selected(rows)
                result["total"] = {name.lower(): sum(row[name] for row in rows) for name in ("Clicks", "Impressions")}
                result["total"]["position"] = None
                result["traffic_record_dates"] = sorted({str(bing_date(row["Date"])) for row in rows})
            else:
                rows, terms = selected(rows), defaultdict(lambda: [0, 0, 0])
                for row in rows:
                    value = terms[row["Query"]]
                    value[0] += row["Clicks"]
                    value[1] += row["Impressions"]
                    value[2] += row["AvgImpressionPosition"] * row["Impressions"]
                result["terms"] = top([{"query": term, "clicks": c, "impressions": i, "position": p / i if i else None}
                                       for term, (c, i, p) in terms.items()], limit)
                result["returned_terms"] = len(terms)
                result["query_record_dates"] = sorted({str(bing_date(row["Date"])) for row in rows})
        except Exception as error:
            result["status"] = "partial_error"
            result["errors"].append(method + ": " + safe_error(error))
    result.setdefault("indexed_pages", "Unknown")
    return result

def positive(value):
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("必须为正整数")
    return number

def main(argv=None):
    parser = argparse.ArgumentParser(description="只读查询 wly0829.cn 的 Google / Bing 搜索词、点击、展示、平均排名及可取得的收录总量。")
    parser.add_argument("--days", type=positive, default=28)
    parser.add_argument("--end", type=date.fromisoformat, help="截止日期 YYYY-MM-DD（Google 太平洋日期）")
    parser.add_argument("--limit", type=positive, default=20)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--google-index-snapshot", help="本机 Page Indexing 人工读取快照 JSON；不是凭据，也不是实时 API")
    parser.add_argument("--output", type=Path, help="把同一份匿名统计 JSON 写到指定本机文件；正常 stdout 不变")
    args = parser.parse_args(argv)
    end = args.end or (datetime.now(ZoneInfo("America/Los_Angeles")).date() - timedelta(days=3))
    start = end - timedelta(days=args.days - 1)
    output = {"site": SITE, "start": str(start), "end": str(end), "notes": NOTES}
    for name, variable, fetch in (("Google", "WLY_SEARCH_GOOGLE_JSON", google), ("Bing", "WLY_SEARCH_BING_KEY", bing)):
        credential = os.environ.get(variable)
        result = {"status": "unconfigured", "error": "未配置：需由密码中心登记程序注入 " + variable, "indexed_pages": "Unknown"}
        if credential:
            try:
                result = fetch(start, end, args.limit, credential)
            except Exception as error:
                result = {"status": "error", "error": safe_error(error), "indexed_pages": "Unknown"}
        if name == "Google": result["index_url"] = GOOGLE_INDEX
        output[name] = result
    if args.google_index_snapshot:
        try:
            with open(args.google_index_snapshot, encoding="utf-8-sig") as stream: snapshot = json.load(stream)
            if not (isinstance(snapshot, dict) and snapshot.get("property") == PROPERTY and type(snapshot.get("indexed_pages")) is int and snapshot["indexed_pages"] >= 0
                    and snapshot.get("source") == GOOGLE_INDEX and str(date.fromisoformat(snapshot["date"])) == snapshot["date"]): raise ValueError("Invalid index snapshot")
            output["Google"].update(indexed_pages=snapshot["indexed_pages"], index_date=snapshot["date"], source=GOOGLE_INDEX,
                                    index_note="Page Indexing 人工读取快照（所有已知网页），报告上次更新 " + snapshot["date"] + "；非实时 API。")
        except Exception:
            output["Google"].update(indexed_pages="Unknown", index_note="未取得有效的 Page Indexing 人工读取快照；原始错误未输出。")
    if args.output:
        try:
            args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
        except OSError: parser.error("结果文件写入失败；原始错误未输出。")
    if args.json:
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        print(f"网站搜索数据：{start} 至 {end}（含首尾）")
        for name in ("Google", "Bing"):
            result = output[name]
            print(f"\n{name}：{result['status']}；收录页数 {result['indexed_pages']}" + ("；快照日期 " + result["index_date"] if result.get("index_date") else ""))
            for field in ("error", "scope", "index_note", "index_url"):
                if result.get(field): print(result[field])
            for error in result.get("errors", []): print(error)
            for field in ("query_record_dates", "traffic_record_dates"):
                if field in result: print(("词统计返回日期：" if field == "query_record_dates" else "网站流量返回日期：") + ", ".join(result[field]))
            if "total" in result: print("网站总量：" + json.dumps(result["total"], ensure_ascii=False))
            print("搜索词\t点击\t展示\t平均排名")
            for row in result.get("terms", []): print(f"{row['query']}\t{row['clicks']}\t{row['impressions']}\t{row['position']}")
        for note in NOTES: print("提示：" + note)
    return int(any(output[name]["status"] != "ok" for name in ("Google", "Bing")))

if __name__ == "__main__":
    raise SystemExit(main())
