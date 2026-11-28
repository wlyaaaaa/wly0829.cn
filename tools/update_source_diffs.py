"""Read-only source comparisons for the website update run."""
import ast
import hashlib
import json
import re
import sqlite3
from contextlib import closing
from datetime import datetime, timedelta, timezone
from pathlib import Path

from editorial_ledger import read_json, write_json

NAME = "源头与网页差项.json"
PC = Path("E:/PCConfig")
AGENTS = Path("E:/.agents")
RUNTIME = Path("E:/Data/RemoteComputerMCP")
AUTO_DB = Path("E:/Data/PCConfig/AutoTasks/state.sqlite3")
GROUPS = ("项目", "技能", "自动任务", "计划任务", "智能体", "钩子", "开场", "等你的事、AI 对话、AI 账本",
          "电脑、笔记本", "软件、运行环境、自启动", "手机", "备份", "项目专项读数、成品、变化", "规则页、随站备用包")
PAGES = ("/live/projects/、项目详情和讲解页项目列表", "/live/agents/ 和技能讲解页", "/live/automation/ 和实况值守",
         "/live/tasks/", "/live/agents/ 和 AI 百工谱", "/live/agents/ 钩子表和 AI 百工谱", "/live/agents/opening/",
         "/live/items/、/live/chats/、/live/ledger/ 和实况值守", "/live/computer/、/live/laptop/ 和电脑大本营",
         "/live/environment/ 和电脑大本营", "/live/phone/、应用子页和电脑页设备卡", "/live/backups/ 和电脑大本营",
         "实况首页、项目详情、变化汇总", "/rules/ 和各页备用包")


def optional(path, read=read_json):
    try:
        return read(path)
    except (OSError, ValueError, sqlite3.Error):
        return None


def digest(value):
    raw = value if isinstance(value, bytes) else json.dumps(value, ensure_ascii=False, sort_keys=True).encode()
    return hashlib.sha256(raw).hexdigest()


def ids(rows, key="id"):
    return sorted({row[key] for row in rows if row.get(key)}) if isinstance(rows, list) else None


def live_packets(path):
    raw = path.read_bytes()
    with closing(sqlite3.connect(":memory:")) as db:
        seq, roster = db.execute("""SELECT json_extract(?1,'$.seq'),
            json_extract(?1,'$.views.public."projects?state=active"')""", (raw,)).fetchone()
        rows = db.execute("""SELECT key,value FROM json_each(?, '$.views.owner')
            WHERE key IN ('computer','phone','phone/apps','automation','tasks?scope=scheduled','backups')
            OR key GLOB 'projects/*' AND instr(substr(key,10),'/')=0 AND instr(key,'?')=0""", (raw,))
        return seq, json.loads(roster or "{}"), {key: json.loads(value) for key, value in rows}


def inventory(common, settings):
    published = optional(common / "wly-oss/published.json") or {}
    manifest = published.get("manifest", {})
    files = manifest.get("files") if published.get("readback") and published.get("deployment") else None
    seq, public, owner = optional(RUNTIME / settings["live_snapshot"]["relative_path"], live_packets) or (None, {}, {})
    raw = optional(Path(published.get("site_dist", {}).get("root", "")) / "rules/index.html", Path.read_bytes)
    rule_sha = (files or {}).get("rules/index.html", {}).get("sha256")
    rule = re.search(rb'data-rule-release="(E[0-9]+)"', raw) if raw and digest(raw) == rule_sha else None
    fallback = manifest.get("oss", {}).get("objects", {})
    seen = {"file": sorted(files) if files is not None else None, "rules": [rule[1].decode()] if rule else None,
            "projects": ids(public.get("data", {}).get("items")),
            "fallback": ["live/_fallback.json"] if "live/_fallback.json" in fallback else [] if files is not None else None}
    for bucket, route in (("categories", "automation"), ("types", "automation"), ("sets", "backups")):
        seen["backups" if bucket == "sets" else bucket] = ids(owner.get(route, {}).get("data", {}).get(bucket))
    for route, packet in owner.items():
        if route.startswith("projects/") and isinstance((data := packet.get("data", {})).get("sections"), list):
            seen[route] = sorted(f"{s['id']}/{m['id']}" for s in data["sections"] for m in s.get("metrics", [])
                                 if s.get("id") and m.get("id"))
    seen["project details"] = [route[9:] for route in seen if route.startswith("projects/")] if owner else None
    return {"release_id": manifest.get("release_id"), "live_seq": seq}, seen, owner


def capture(paths, policies, projects, catalog, settings):
    groups = {group: {"fingerprints": {}, "expected": {}, "retired": {}, "review": []} for group in GROUPS}

    def watch(index, path, value=None):
        group = groups[GROUPS[index]]
        if value is None:
            value = optional(path, Path.read_bytes)
        if value is None:
            group["review"].append(f"来源读不到，请 AI 看 {path}")
        else:
            group["fingerprints"][str(path)] = digest(value)

    def expect(index, bucket, ident, retired=False):
        field = "retired" if retired else "expected"
        groups[GROUPS[index]][field].setdefault(bucket, []).append(ident)

    registrations = {repo.casefold(): row for repo, row in settings.get("project_sources", {}).items()}
    frozen = set()
    for repo, policy in policies.items():
        short = repo.split("/")[-1].lstrip(".")
        identity = policy.get("live_id") or short
        options = [row["id"] for row in projects if row.get("source", {}).get("repo", "").casefold() == repo]
        options = options or ["learning" if short == "career-development" else short]
        if policy["visibility"] == "frozen_static":
            frozen.update(options)
            groups[GROUPS[0]].setdefault("excluded", []).extend([identity, *(f"{p}/project.html" for p in options)])
            continue
        wanted = [p for p in options if catalog["项目表"].get(p.casefold(), ("",))[0] not in {"不上网站", "不进流水线"}]
        for project in wanted:
            expect(0, "file", f"{project}/project.html", retired=policy["visibility"] != "public")
        expect(0, "projects", identity, retired=policy["visibility"] != "public")
        if policy["visibility"] != "public":
            continue
        expect(0, "project details", identity)
        watch(0, f"website-projects.json#{repo}", policy)
        if repo not in paths:
            groups[GROUPS[0]]["review"].append(f"{identity} 本机仓库未登记，接入单请 AI 核对")
            continue
        registered = registrations.get(repo, {}).get("contract")
        contract = Path((registered.get("path") if isinstance(registered, dict) else registered)
                        or Path(paths[repo]) / "docs/live.contract.json")
        spec = optional(contract)
        if not spec or spec.get("v") != 1 or spec.get("id") != identity:
            groups[GROUPS[0]]["review"].append(f"{identity} 接入单缺失、读不到或 ID 不一致，请核实况详情")
            continue
        watch(12, contract, spec)
        optional_metrics = {m["id"] for m in spec.get("metrics", []) if m.get("hide_zero") or m.get("public") == "owner"}
        for section in spec.get("sections", []):
            for metric in section.get("metrics", []):
                if metric not in optional_metrics:
                    expect(12, f"projects/{identity}", f"{section['id']}/{metric}")

    supply_path = AGENTS / "config/personal-skill-supply.json"
    supply = optional(supply_path) or {}
    for row in supply.get("skills", []):
        if row.get("install"):
            watch(1, f"{supply_path}#{row['name']}", row)
            watch(1, AGENTS / row["source"] / "SKILL.md")
    for name, (status, parent) in catalog["技能表"].items():
        if status in {"要做", "做完"} and parent not in frozen:
            expect(1, "file", f"{parent}/{name}.html")
        if parent in frozen:
            groups[GROUPS[1]].setdefault("excluded", []).append(f"{parent}/{name}.html")
    watch(1, supply_path, supply.get("retired_skills"))

    auto = PC / "tools/remote-computer-mcp/automation"
    core = optional(auto / "core.py", lambda p: ast.parse(p.read_text("utf-8-sig")))
    for bucket, constant in (("categories", "CATEGORIES"), ("types", "TYPES")):
        node = next((n.value for n in core.body if isinstance(n, ast.Assign)
                     and isinstance(n.targets[0], ast.Name) and n.targets[0].id == constant), None) if core else None
        if isinstance(node, ast.Dict):
            for identity, title in ast.literal_eval(node).items():
                expect(2, bucket, identity)
                watch(2, f"{constant}#{identity}", title)
        else:
            groups[GROUPS[2]]["review"].append(f"登记 {constant} 读不到，请 AI 看")
    watch(2, "dashboard_sources.json#任务来源", {k: settings.get(k) for k in ("linked_automations", "related_receipts")})

    for index, paths_to_watch in {
        2: [auto / f"{name}.py" for name in ("category_view", "translator", "commitments")],
        3: [PC / "registries/task_purpose_catalog.json"],
        4: [AGENTS / "config/model-roster.json", AGENTS / "config/agent-hook-coverage.json"],
        5: [AGENTS / "config/hook-catalog.json", AGENTS / "config/agent-hook-coverage.json"],
        6: [AGENTS / "docs/operations/context-hooks.md"],
        7: [PC / "docs/runtime/owner-items-v2-write-contract.md", PC / "docs/runtime/live-design/接口约定.md"],
        8: [PC / "registries/machine.json", PC / "registries/remote_computer_mcp.secondary_laptop.json"],
        10: [PC / "docs/runtime/phone-direct.md"],
    }.items():
        for path in paths_to_watch:
            watch(index, path)
    if phone := paths.get("wlyaaaaa/phone-collector"):
        watch(10, Path(phone) / "config/phone-app-categories.json")
    environment = PC / "docs/live.contract.json"
    watch(9, environment, [m for m in (optional(environment) or {}).get("metrics", [])
                           if m["id"].startswith(("software", "runtimes", "startup"))] or None)
    core_path = PC / "registries/core_recovery.json"
    recovery = optional(core_path) or {}
    sets = recovery.get("backup_sets", []) + recovery.get("external_owners", [])
    watch(11, core_path, sets or None)
    for row in sets:
        expect(11, "backups", row["id"].replace("recovery_kit", "recovery-kit"))
    pointer = AGENTS / "releases/current-rules.json"
    if rule := (optional(pointer) or {}).get("current", {}).get("release_id"):
        expect(13, "rules", rule)
        watch(13, pointer, rule)
    else:
        groups[GROUPS[13]]["review"].append("活动规则指针读不到，请 AI 核规则页版本")
    expect(13, "fallback", "live/_fallback.json")
    return groups


def compare(groups, seen, previous):
    rows = {}
    for name, page in zip(GROUPS, PAGES, strict=True):
        group = groups[name]
        old = previous.get(name, {})
        expected, retired = group["expected"], group["retired"]
        row = rows[name] = {"website": page, "missing": [], "retired": [], "changed": [], "review": group["review"][:]}
        for bucket in sorted(expected.keys() | retired.keys()):
            if seen.get(bucket) is None:
                row["review"].append(f"网页对应证据读不到，请 AI 看 {bucket}")
                continue
            live, source = set(seen[bucket]), set(expected.get(bucket, []))
            gone = set(retired.get(bucket, []))
            row["missing"].extend(sorted(f"{bucket} {entry}" for entry in source - live))
            row["retired"].extend(sorted(f"{bucket} {entry}" for entry in live & gone))
        before = old.get("fingerprints", {})
        if old:
            row["changed"] = sorted(path for path, key in group["fingerprints"].items() if before.get(path) != key)
        elif name == "技能":
            row["review"].append("新装、插件技能核技能榜和讲解归属；退役讲解页核去向")
        elif group["fingerprints"] and not expected:
            row["review"].append("首次无对照指纹，请 AI 对现行来源和对应说明核一遍")
    return rows


def no_data_receipt(path):
    with closing(sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)) as db:
        receipt = db.execute("""SELECT cursor FROM sources JOIN settings ON settings.type_id=sources.id
            WHERE sources.id='no-data-scan' AND (mode='on' OR mode='paused' AND until_at<=unixepoch())""").fetchone()
    return json.loads(receipt[0]) if receipt and receipt[0] else {}


def freshness(owner, settings):
    policy = read_json(PC / "registries/live_refresh_policy.json")["blocks"]
    findings = []
    for resource in ("computer", "phone", "phone/apps", "automation", "tasks?scope=scheduled", "backups"):
        data = owner.get(resource, {}).get("data", {})
        rule = policy.get("tasks/roster" if resource.startswith("tasks?") else resource, {})
        at = data.get("roster_at") or data.get("source_at") or data.get("at")
        mode, limit = data.get("refresh_mode", rule.get("refresh_mode")), data.get("stale_after", rule.get("stale_after"))
        if at and isinstance(limit, (int, float)) and mode in {"realtime", "async", "scheduled"}:
            age = (datetime.now().astimezone() - datetime.fromisoformat(at)).total_seconds()
            if age > limit:
                findings.append(f"{resource} 完成包读数截至 {at}，已超过登记的 {limit} 秒")
    if (check := optional(AUTO_DB, no_data_receipt)) is None:
        findings.append("没数据扫描回执读不到，请 AI 核对")
    elif check:
        stale = {key.split("?")[0] for key, reason in check.get("gaps", {}).items() if "超过登记刷新周期" in reason}
        grouped = sorted({key.split("/")[0] for key in stale})
        if grouped:
            findings.append(f"没数据扫描 {check['day']} 已报 {len(stale)} 个超期读数，回查对应时刻：{'、'.join(grouped)}")
    nightly = optional(Path(settings["nightly_project_checks"]["receipt_path"])) or {}
    return findings + [f"{identity} 夜检刷新失败（{nightly.get('finished_at')}）"
                       for identity, row in nightly.get("live_refresh", {}).items() if row.get("status") == "failed"]


def run(path, root, common, start, inputs=None):
    settings = read_json(PC / "registries/dashboard_sources.json")
    proof, seen, owner = inventory(common, settings)
    if path.exists():
        state = read_json(path)
        if state.get("repository") != str(root):
            raise ValueError("差项清单不属于此工作副本")
    elif not start:
        raise ValueError(f"找不到本轮差项清单 {path}")
    else:
        previous = next((record for candidate in sorted(path.parent.parent.glob("update-*/" + NAME), reverse=True)
                         if candidate != path and (record := optional(candidate)) and record.get("recheck")), {})
        scope = capture(*inputs, settings)
        for name, group in scope.items():
            old = previous.get("scope", {}).get(name, {})
            for bucket in group["expected"].keys() - {"rules", "fallback"}:
                gone = set(old.get("expected", {}).get(bucket, [])) | set(old.get("retired", {}).get(bucket, []))
                gone.update(group["retired"].get(bucket, []))
                group["retired"][bucket] = sorted(gone - set(group["expected"][bucket]) - set(group.get("excluded", [])))
        state = {"repository": str(root), "captured_at": datetime.now(timezone(timedelta(hours=8))).isoformat(), "scope": scope,
                 "previous_at": previous.get("captured_at"), "previous_scope": previous.get("scope", {})}
    result = {"proof": proof, "rows": compare(state["scope"], seen, state["previous_scope"]),
              "freshness": freshness(owner, settings)}
    if count := owner.get("tasks?scope=scheduled", {}).get("data", {}).get("purpose_unregistered_count"):
        result["rows"]["计划任务"]["review"].append(f"计划任务页有 {count} 条用途未登记，请回原登记核对")
    step = "opening" if start else "recheck"
    if not start or step not in state:
        state[step] = result
        write_json(path, state)
    result = state[step]
    print(f"\n## 源头与网页差项（{'开头' if start else '收尾'}）\n{path}\n"
          f"正式成品 {result['proof']['release_id']}｜实况完成包 {result['proof']['live_seq']}｜"
          f"上一轮来源指纹时刻 {state['previous_at'] or '暂无，本轮留下起点'}")
    for name, row in result["rows"].items():
        print(f"- {name} → {row['website']}｜网页缺 {len(row['missing'])}，源头已撤但网页仍有 {len(row['retired'])}，"
              f"来源版本变化 {len(row['changed'])}，请 AI 看 {len(row['review'])}")
        for field, title in (("missing", "网页缺"), ("retired", "源头已撤但网页仍有"),
                             ("changed", "请 AI 判断说明是否仍对"), ("review", "核对提示")):
            for item in row[field]:
                print(f"  - {title}｜{item}")
    print("\n### 该自动更新却停了、比该有的旧")
    for item in result["freshness"]:
        print(f"- {item}")
