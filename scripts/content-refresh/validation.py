"""常设来源清单的格式校验；旧清单的缺口由严格盘点逐项报告。"""
import math
import re

MANUAL_REASONS = {"needs_admin_rescan", "ui_only", "external_account", "judgment", "source_broken"}
KINDS = {"manual", "entry", "sqlite_ro", "log_window", "usage_ledger", "git_count",
         "file_count", "line_count", "json", "rules_inspect", "regex_count",
         "page_count", "feature_count", "group_count"}
LEDGER = "__usage_ledger__"
NUMBER_CLASSES = {"fixed_parameter", "runtime_field", "status_conclusion", "historical_example"}


def block_counts(document, page):
    """C1 原文块分区的字数；横竖布局里的重复归属不再相加。"""
    if document.get("schema") != "wly.content-blocks.v1" or document.get("page") != page:
        raise ValueError("块导出格式或所属页不符")
    blocks = document.get("blocks")
    if not isinstance(blocks, list):
        raise ValueError("块导出缺 blocks 数组")
    counts, ids = {}, set()
    for block in blocks:
        sid, number, chars = block.get("screen"), block.get("id"), block.get("chars")
        if (not isinstance(sid, str) or not sid or not isinstance(number, int) or isinstance(number, bool)
                or number < 1 or number in ids or not isinstance(chars, int) or isinstance(chars, bool) or chars < 0):
            raise ValueError("块导出的屏、编号或字数无效")
        ids.add(number)
        counts[sid] = counts.get(sid, 0) + chars
    return counts


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
        if "timeout" in entry:
            positive(entry["timeout"], name + ".timeout")
        if name == LEDGER:
            if not entry.get("path") or entry.get("format", "jsonl") not in {"jsonl", "json"}:
                raise ValueError("使用账本须登记 path 和 json/jsonl 格式")
            continue
        argv = entry.get("argv")
        if not isinstance(argv, list) or not argv or not all(isinstance(v, str) and v for v in argv):
            raise ValueError(name + " 的 argv 必须为非空字符串数组")
        if not isinstance(entry.get("cwd"), str) or not entry["cwd"] or entry.get("output") != "json":
            raise ValueError(name + " 缺 cwd 或 output=json")


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
        if "number_class" in record and record["number_class"] not in NUMBER_CLASSES:
            raise ValueError("number_class 必须为 fixed_parameter/runtime_field/status_conclusion/historical_example")
        if record.get("freshness_class", "current") not in {"current", "semantic", "historical"}:
            raise ValueError("freshness_class 必须为 current/semantic/historical")
        if record.get("observation_basis", "unknown") not in {"live_read", "snapshot_timestamp", "coverage_end", "unknown"}:
            raise ValueError("observation_basis 不支持")
        for name in ("source_observed_at_pointer", "source_coverage_end_pointer"):
            if name in record and not isinstance(record[name], list):
                raise ValueError(name + " 必须为 JSON 路径数组")
        if record.get("qualifies") is not None:
            refs = record["qualifies"]
            if not isinstance(refs, list) or not refs or not all(isinstance(v, str) and v in ids and v != record["id"] for v in refs):
                raise ValueError("qualifies 必须指向存在的其他记录 id")
            if record.get("date_semantics") == "coverage_end":
                validate_method(record.get("retrieve", {}), entries)
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


def relation_errors(record, relation, by_id):
    """关系的口径和截至是显式登记；不能因值相同推断关系。"""
    if not isinstance(relation, dict) or relation.get("kind") not in ("equal", "sum"):
        return ["关系 kind 必须为 equal/sum"]
    refs = relation.get("record_ids")
    if (not isinstance(refs, list) or not refs or not all(isinstance(v, str) for v in refs)
            or len(set(refs)) != len(refs) or record["id"] in refs or any(v not in by_id for v in refs)):
        return ["关系 record_ids 必须指向存在、不重复的其他记录"]
    if relation["kind"] == "sum" and len(refs) < 2:
        return ["加总关系至少需要两个分项"]
    errors = []
    for key in ("measurement_scope", "as_of"):
        value = record.get(key)
        if not isinstance(value, str) or not value.strip() or any(by_id[v].get(key) != value for v in refs):
            errors.append("关系 " + key + " 缺失或不一致")
    return errors


def registry_errors(records, entries):
    ids = {r["id"] for r in records}
    errors = [{"record_id": r["id"], "page": r["page"], "screen": r["screen"], "errors": record_errors(r, entries, ids)} for r in records]
    by_id = {r["id"]: r for r in records}
    for record, error in zip(records, errors):
        relations = record.get("relations", [])
        if not isinstance(relations, list):
            error["errors"].append("relations 必须为数组")
            continue
        for relation in relations:
            error["errors"].extend(relation_errors(record, relation, by_id))
    if len(ids) != len(records):
        errors.append({"record_id": "duplicate", "errors": ["重复记录 id"]})
    return [e for e in errors if e["errors"]]
