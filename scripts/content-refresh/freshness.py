"""按需更新的时间依据、频率与原位闭环；不运行后台任务。"""
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import re

BEIJING = timezone(timedelta(hours=8))
BASE_POLICY = dict(current="every_request", semantic_review_days=28, historical="preserve")
BASES = {"live_read", "snapshot_timestamp", "coverage_end", "unknown"}


def now():
    return datetime.now(BEIJING).isoformat(timespec="seconds")


def valid_time(value):
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).isoformat()
    except (ValueError, TypeError):
        return None


def cadence(record, policy=None, today=None, historical=False, targeted=False):
    policy, today = dict(BASE_POLICY, **(policy or {})), today or datetime.now(BEIJING).date()
    kind = "historical" if historical or record.get("historical") or record.get("frozen") else record.get("freshness_class", "current")
    due, reason, stamp = kind == "current", "every_request", True
    if kind == "historical":
        due, reason = False, "historical_preserve"
    elif kind == "semantic":
        stamp = valid_time(record.get("semantic_checked_at"))
        due = targeted or record.get("source_changed") is True or not stamp or (today - date.fromisoformat(stamp[:10])).days >= policy["semantic_review_days"]
        reason = "targeted_project" if targeted else "source_changed" if record.get("source_changed") else "semantic_checked_at_unknown" if not stamp else "semantic_review_due" if due else "semantic_current"
    return dict(freshness_class=kind, refresh_due=due, freshness_status="due_unknown" if kind == "semantic" and not stamp else "due" if due else "current", cadence_reason=reason, overdue=due)


def metadata(document, method, entry=None, checked_at=None):
    config = dict(entry or {}, **method)
    checked_at = checked_at or now()
    values = {}
    for name in ("source_observed_at", "source_coverage_end"):
        pointer = config.get(name + "_pointer")
        try:
            value = document
            if pointer is not None:
                for key in pointer:
                    value = value[int(key)] if isinstance(value, list) else value[key]
            else:
                value = document.get(name) if isinstance(document, dict) else None
                if value is None and isinstance(document, dict):
                    value = document.get("metadata", {}).get(name)
            stamp = valid_time(value)
            values[name] = stamp[:10] if name == "source_coverage_end" and stamp else stamp
        except (KeyError, IndexError, TypeError, ValueError):
            values[name] = None
    basis = config.get("observation_basis", "unknown")
    if basis == "live_read":
        values["source_observed_at"] = checked_at
    elif values["source_observed_at"]:
        basis = "snapshot_timestamp"
    elif values["source_coverage_end"]:
        basis = "coverage_end"
    else:
        basis = "unknown"
    return dict(checked_at=checked_at, observation_basis=basis, **values)


def review_tasks(inventory, rows):
    tasks = [dict(id="review:" + i["id"], page=i["page"], field=i["field"], kind=i["kind"],
                  reason="需要实际人工核对并提供本轮依据", status="pending")
             for i in inventory.get("items", []) if not i.get("historical")
             and (i.get("review_stamp") or i["kind"] == "status_line.state")]
    tasks.extend(dict(id="semantic:" + r["id"], page=r["page"], kind="semantic", reason=r["cadence_reason"], status="pending")
                 for r in rows if r.get("freshness_class") == "semantic" and r.get("refresh_due"))
    tasks.extend(inventory.get("semantic_reviews", []))
    return tasks


def sync_registry(path, rows):
    """只同步已完成原位回读的记录，不改历史或失败项。"""
    path = Path(path)
    if not path.exists():
        return dict(status="not_present", records=[])
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    updates, changed = {r["id"]: r for r in rows}, []
    for record in data["records"]:
        row = updates.get(record["id"])
        if row is None or row.get("status") == "historical":
            continue
        record["current_value"] = row["new_value"]
        for key in ("checked_at", "source_observed_at", "source_coverage_end", "observation_basis"):
            record[key] = row.get(key)
        record["observed_at"] = row.get("source_observed_at")
        changed.append(record["id"])
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        actual = {r["id"]: r for r in json.loads(path.read_text(encoding="utf-8-sig"))["records"]}
        if any(actual[rid]["current_value"] != updates[rid]["new_value"] for rid in changed):
            raise ValueError("来源登记同步回读不一致")
    return dict(status="synced", records=changed)


def close_run(root, result, report=None):
    from refresh import pages, page_value, comparable
    from apply_edits import same_value, field_at, digest
    root, report = Path(root), report or {}
    run_id = result.get("run_id")
    if not run_id or result.get("schema") != "content-refresh.result.v1":
        raise ValueError("闭环只接受含 run_id 的真实 collect 结果")
    if report and report.get("run_id") != run_id:
        raise ValueError("应用回执与取数 run_id 不一致")
    catalog = {p["page"]: p for p in pages(root)}
    applied = {r["record_id"]: r for r in report.get("record_readback", []) if r.get("status") == "verified"}
    outcomes, synced = [], []
    for row in result["rows"]:
        status, reason = "pending", row.get("reason", "")
        if row["status"] == "historical":
            status = "historical_preserved"
        elif row.get("freshness_class") == "semantic":
            status = "manual_pending" if row.get("refresh_due") else "semantic_current"
        else:
            try:
                proof = applied.get(row["id"])
                if row["status"] == "changed" and proof:
                    locator = proof["locator"]
                    parent, key = field_at(catalog[row["page"]], locator["field"])
                    if digest(parent[key]) != proof["field_sha256"]:
                        raise ValueError("应用后字段又发生变化")
                    actual = parent[key][locator["start"]:locator["end"]]
                else:
                    actual, _ = page_value(row, catalog[row["page"]], root)
                equal = lambda value: comparable(actual) == comparable(value) or same_value(str(actual), value)
                if row["status"] == "changed":
                    if row["id"] in applied and equal(row["new_value"]):
                        status = "applied_readback_verified"
                        synced.append(row)
                    else:
                        reason = "变化项没有同轮成功应用及原位回读"
                elif row["status"] == "unchanged" and row.get("checked_at") and row.get("observation_basis") != "unknown" and equal(row["new_value"]):
                    status = "checked_unchanged"
                    synced.append(row)
                elif row["status"] in {"unavailable", "domain_fact_task", "scope_pending"} and row.get("checked_at") and reason and equal(row["old_value"]):
                    status = "unknown_preserved"
            except (KeyError, ValueError, IndexError, StopIteration) as exc:
                reason = "原位回读失败：" + str(exc)
        outcomes.append(dict(record_id=row["id"], status=status, reason=reason))
    resolutions = {r.get("id"): r for r in report.get("manual_closures", [])
                   if r.get("run_id") == run_id and r.get("checked_at") and r.get("evidence") and r.get("status") == "completed"}
    tasks = [dict(t, status="completed" if t["id"] in resolutions else "pending") for t in result.get("manual_tasks", [])]
    for outcome in outcomes:
        if outcome["status"] == "manual_pending" and "semantic:" + outcome["record_id"] in resolutions:
            outcome["status"] = "manual_completed"
    pending = [o for o in outcomes if o["status"] in {"pending", "manual_pending"}] + [t for t in tasks if t["status"] == "pending"]
    return dict(schema="content-refresh.closure.v1", run_id=run_id, checked_at=now(),
                status="incomplete" if pending else "closed", rows=outcomes, manual_tasks=tasks,
                registry_sync=sync_registry(result.get("registry_path") or root / "sources/refresh/registry.json", synced), pending=len(pending))
