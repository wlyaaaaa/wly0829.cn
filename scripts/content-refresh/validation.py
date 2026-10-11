"""常设来源清单的格式校验；旧清单的缺口由严格盘点逐项报告。"""
import math
import re

MANUAL_REASONS = {"needs_admin_rescan", "ui_only", "external_account", "judgment", "source_broken"}
KINDS = {"manual", "entry", "sqlite_ro", "log_window", "usage_ledger", "git_count",
         "file_count", "line_count", "json", "rules_inspect", "regex_count",
         "page_count", "feature_count", "group_count"}
LEDGER = "__usage_ledger__"


def select_sql(sql):
    if not isinstance(sql, str):
        raise ValueError("SQL 必须是单条 select")
    # 忽略字符串、引用标识符和注释中的分号；保留语句分隔符。
    tokens = re.sub(r"'(?:''|[^'])*'|\"(?:\"\"|[^\"])*\"|`[^`]*`|\[[^\]]*\]|--[^\n]*|/\*.*?\*/",
                    " ", sql, flags=re.S).strip()
    if not re.match(r"select\b", tokens, re.I) or ";" in tokens.rstrip(";").strip() or tokens.count(";") > 1:
        raise ValueError("只允许单条 select；不允许多语句或写入")
    return sql


def positive(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(name + " 必须是正数")


def validate_entries(entries):
    if not isinstance(entries, dict):
        raise ValueError("entries.json 必须是入口名到配置的对象")
    for name, entry in entries.items():
        if not isinstance(entry, dict) or entry.get("read_only") is not True:
            raise ValueError(name + " 必须已核实 read_only=true")
        if not entry.get("owner_project"):
            raise ValueError(name + " 缺 owner_project")
        if name == LEDGER:
            if not entry.get("path") or entry.get("format", "jsonl") not in {"jsonl", "json"}:
                raise ValueError("使用账本须登记 path 和 json/jsonl 格式")
            continue
        argv = entry.get("argv")
        if not isinstance(argv, list) or not argv or not all(isinstance(v, str) and v for v in argv):
            raise ValueError(name + " 的 argv 必须为非空字符串数组")
        if not isinstance(entry.get("cwd"), str) or not entry["cwd"] or entry.get("output") != "json":
            raise ValueError(name + " 缺 cwd 或 output=json")
        if "timeout" in entry:
            positive(entry["timeout"], name + ".timeout")


def validate_method(method, entries):
    kind = method.get("kind")
    if kind not in KINDS:
        raise ValueError("未实现的 retrieve.kind")
    if any(k in method for k in ("argv", "command", "shell", "cwd")):
        raise ValueError("记录不接受命令；argv/cwd 只能登记在 entries.json")
    if "timeout" in method:
        positive(method["timeout"], "retrieve.timeout")
    if kind == "entry" and (method.get("entry") not in entries or method.get("entry") == LEDGER):
        raise ValueError("entry 未登记在白名单")
    if kind == "sqlite_ro":
        if not method.get("path"):
            raise ValueError("sqlite_ro 缺 path")
        select_sql(method.get("sql"))
    if kind == "log_window":
        if not method.get("path") or not isinstance(method.get("pattern"), str):
            raise ValueError("log_window 缺 path/pattern")
        re.compile(method["pattern"])
        if method.get("days") is not None:
            positive(method["days"], "log_window.days")
        if method.get("operation", "count") not in {"count", "last_time"}:
            raise ValueError("log_window.operation 只能 count/last_time")
    if kind == "usage_ledger":
        if LEDGER not in entries or not method.get("key") or method.get("operation") not in {"count_7d", "last_time"}:
            raise ValueError("usage_ledger 缺账本登记、key 或合法 operation")


def record_errors(record, entries, ids):
    errors = []
    try:
        if record.get("qualifies") is not None:
            refs = record["qualifies"]
            if not isinstance(refs, list) or not refs or not all(isinstance(v, str) and v in ids and v != record["id"] for v in refs):
                raise ValueError("qualifies 必须指向存在的其他记录 id")
        else:
            validate_method(record.get("retrieve", {}), entries)
            if record.get("retrieve", {}).get("kind") == "manual" and not (record.get("historical") or record.get("frozen") or record.get("field") == "status_line.state"):
                if record.get("manual_reason") not in MANUAL_REASONS:
                    raise ValueError("manual_reason 必须是五个合规值之一")
                if not isinstance(record.get("manual_route"), str) or not record["manual_route"].strip():
                    raise ValueError("manual 缺 manual_route 取法/修复去向")
    except (ValueError, TypeError) as exc:
        errors.append(str(exc))
    return errors


def registry_errors(records, entries):
    ids = {r["id"] for r in records}
    errors = [{"record_id": r["id"], "page": r["page"], "screen": r["screen"], "errors": record_errors(r, entries, ids)} for r in records]
    if len(ids) != len(records):
        errors.append({"record_id": "duplicate", "errors": ["重复记录 id"]})
    return [e for e in errors if e["errors"]]
