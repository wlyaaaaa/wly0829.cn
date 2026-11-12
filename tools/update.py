"""update：固定本次来源、接草稿试建与三关回执；不代 AI 判断或发布。"""
import argparse
from datetime import timedelta
from hashlib import sha256
import json
from pathlib import Path
import subprocess
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts/content-refresh"))
from editorial_ledger import Ledger
from block_tool import asset_rows, draft_updates
from update_gates import GATES, Run, draft_hash, git, locked, now, protected_inputs, read, timestamp, write
from update_numbers import numbers, require_numbers
import update_batch

MANUAL = {"learning", "personal-health", "cacb", "codex-remote", "personal-finance"}
FROZEN = {"frozen", "冻结", "已冻结", "historical", "历史"}
REPOSITORIES = Path("E:/PCConfig/registries/repository-paths.json")
SUPPLY = Path("E:/.agents/config/personal-skill-supply.json")
EXCLUSIONS = Path("E:/PCConfig/registries/site_repo_exclusions.json")


def route(value):
    return value if value.endswith(("/", ".html")) else value + "/"


def inventory(store):
    """作者页 + 保留页 + 代码页，HTML frozen 不等于产品冻结。"""
    roots = [(route(p["route"]), "website" if p["id"] == "wly0829-cn" else "project-" + p["id"])
             for p in store.projects if p.get("enabled") and p.get("route")]
    stopped = [route(p["url"]) for p in store.pages.values() if p.get("url") and
               (p.get("kind") in {"frozen", "skill-redirect"} or p.get("status") in FROZEN)]
    result = {}
    for slug, data in store.pages.items():
        if data.get("url"):
            result[route(data["url"])] = dict(page=slug, book=store.book_for(slug))
    manifest = store.root / "site-astro/sources/frozen-site/manifest.json"
    snapshot = read(manifest) if manifest.exists() else {}
    extra = set(snapshot.get("routes", []))
    extra.update("/" + p.removesuffix("index.html") if p.endswith("index.html") else "/" + p for p in snapshot.get("pages", {}))
    if (store.root / "scripts/build-site.py").exists(): extra.add("/cv/")
    for path in (store.root / "site-astro/src/pages").rglob("*.astro"):
        name = path.relative_to(store.root / "site-astro/src/pages").as_posix()
        if "[" not in name:
            extra.add("/" if name == "index.astro" else route("/" + name.removesuffix(".astro").removesuffix("/index")))
    for url in extra:
        url = route(url)
        if url not in result:
            book = next((b for prefix, b in sorted(roots, reverse=True) if url.startswith(prefix)), "website")
            result[url] = dict(page=url.strip("/").replace("/", "--") or "home", book=book)
    for url, row in result.items():
        row.update(url=url, frozen=any(url.startswith(prefix) for prefix in stopped),
                   top_level=url.count("/") <= 2 and row["book"] in {"website", "rules"})
    return list(result.values())


def changes(store, repositories, supply, exclusions):
    site = {p.get("source", {}).get("repo", "").lower() for p in store.projects}
    local = {r["repo"].lower() for r in repositories}
    if not local: raise ValueError("仓库登记为空，不能据此认定项目消失")
    ignored = {s.lower() for s in read(exclusions)["excluded"]}
    installed = {s["name"] for s in supply["skills"] if s.get("install") is True}
    installed -= {s["name"] for s in supply.get("retired_skills", [])}
    aliases = {"learning": "career-development", "document-materials": "personal-formal-documents"}
    skills = {aliases.get(s[6:], s[6:]) for s, p in store.pages.items() if s.startswith("skill-") and p.get("kind") == "skill"}
    omitted = set(read(store.root / "config/skill-site-exclusions.json")["excluded"])
    return dict(new_repositories=sorted(local - site - ignored),
                missing_projects=sorted(r for r in site - local if "/" in r),
                new_skills=sorted(installed - skills - omitted))


def start(root, directory, requested_at, projects=(), pages=(), scope=None, numbers_only=False,
          first_pass=False, repositories=REPOSITORIES, supply=SUPPLY, exclusions=EXCLUSIONS):
    root = Path(root).resolve(); requested = timestamp(requested_at)
    if requested > now(): raise ValueError("开口时间不能在未来")
    store = Ledger(root); catalog = inventory(store)
    carry_file = store.companion / "files/update-dropped.json"
    carry = read(carry_file) if carry_file.exists() else {}
    catalog += [r["scope"] for p, r in carry.items() if p not in {v["page"] for v in catalog}]
    named = set(projects); named_pages = set(pages)
    known = {p["id"] for p in store.projects} | {r["book"] for r in catalog}
    if named - known or named_pages - {r["page"] for r in catalog}:
        raise ValueError("点名中有未登记的项目或页面")
    repo_rows = read(repositories)["entries"]
    bindings = {r["repo"].lower(): Path(r["path"]) for r in repo_rows}
    question = changes(store, repo_rows, read(supply), exclusions)
    links = root / "sources/creative/static-home/highlights-page.json"
    highlights = {route(link["href"]) for s in read(links)["screens"] for link in s.get("links", [])} if links.exists() else set()
    allowed = read(scope) if scope else None
    if allowed is not None:
        if not isinstance(allowed, list) or any(not isinstance(item, str) for item in allowed):
            raise ValueError("范围名单须为项目 ID、账名或页名的 JSON 数组")
        allowed = set(allowed)
        if allowed - known - {r["page"] for r in catalog}: raise ValueError("范围名单含未登记项")
    books = {r["book"]: store.read(r["book"]) for r in catalog}
    snapshots, failures = {}, {}
    selected = []
    for row in catalog:
        book = row["book"]; pid = book.removeprefix("project-")
        is_named = pid in named or book in named or row["page"] in named_pages
        if not first_pass and (row["frozen"] or (pid in MANUAL and not is_named)):
            continue
        if not first_pass and allowed is not None and not is_named and not ({pid, book, row["page"]} & allowed):
            continue
        if (named_pages or named) and scope is None and not first_pass and not is_named:
            continue
        data = books[book]
        sources = data["source_repositories"] if not row["frozen"] else ["wlyaaaaa/wly0829.cn"]
        for source in sources:
            if source in snapshots or source in failures: continue
            try:
                checkout = bindings[source.lower()]
                snapshots[source] = dict(commit=git(checkout, "rev-parse", "HEAD"), observed_at=now().isoformat())
            except (KeyError, OSError, subprocess.SubprocessError) as error:
                failures[source] = f"{source}: {type(error).__name__}"
        old = data["pages"]
        changed = not sources or any(s in failures for s in sources) or any(any(p.get("checked_sources", {}).get(s, {}).get("commit") != snapshots.get(s, {}).get("commit")
                                        for s in sources) for p in old.values()) or not old
        if not (first_pass or is_named or numbers_only or changed or row["page"] in carry): continue
        review = old.get(row["page"], {}).get("semantic_review", {}).get("checked_at", "")
        row.update(named=is_named, highlighted=any(row["url"].startswith(h) for h in highlights),
                   last_review=review, review_scope="frozen-notice" if row["frozen"] else "whole-page",
                   blocked=(["账里未登记来源仓库"] if not sources else [failures[s] for s in sources if s in failures]))
        if row["page"] in carry: row.update(retry=carry[row["page"]])
        selected.append(row)
    selected.sort(key=lambda r: ("retry" not in r, not r["top_level"], not r["named"], not r["highlighted"],
                                 timestamp(r["last_review"]).timestamp() if r["last_review"] else 0, r["page"]))
    small = numbers_only or (0 < sum(r["named"] for r in selected) <= 3)
    deadline = None if first_pass else (requested + timedelta(hours=3 if small else 12)).isoformat()
    directory = Path(directory).resolve()
    if directory.is_relative_to(root): raise ValueError("本次目录必须在公开工作树之外")
    directory.mkdir(parents=True, exist_ok=False)
    cutoff = now().isoformat()
    scope_data = dict(cutoff=cutoff, sources=snapshots, source_failures=failures, pages=selected, questions=question)
    write(directory / "scope.json", scope_data)
    lines = ["# 一道多选题", "", "以下变化哪些要上站或调整去向？可多选；未选的继续保留现状，新页另开一件活。", ""]
    labels = dict(new_repositories="新仓库", missing_projects="登记项目未找到", new_skills="新技能")
    lines += [f"- [ ] {labels[kind]}：{item}" for kind, items in question.items() for item in items]
    (directory / "questions.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    state = dict(schema="wly.update-run.v1", status="open" if selected else "no-changes", run_id=uuid.uuid4().hex, root=str(root), requested_at=requested_at,
                 cutoff=cutoff, deadline=deadline, first_pass=first_pass, scope="scope.json", events=[],
                 protected_inputs=protected_inputs(root),
                 pages={r["page"]: dict(status="pending", repairs=0, passed=[], blocked=r["blocked"]) for r in selected},
                 timings=[dict(page=None, step="scope", round=1, started_at=requested_at, ended_at=cutoff, budget_seconds=None)])
    write(directory / "state.json", state)
    Run(directory).summary(state)
    return state


def replace_asset_rows(raw, page, rows):
    if [r for r in asset_rows(raw) if r.get("page") == page] == rows: return raw
    replacement = b"".join((json.dumps(r, ensure_ascii=False) + "\n").encode("utf-8") for r in rows)
    result = []; inserted = False
    for line in raw.splitlines(keepends=True):
        if line.strip() and json.loads(line).get("page") == page:
            if not inserted: result.append(replacement); inserted = True
        else: result.append(line)
    if not inserted: result.append((b"\n" if raw and not raw.endswith(b"\n") else b"") + replacement)
    return b"".join(result)


def merge(directory):
    """三关回执决定哪些草稿可进作者源；同一能力的去处按账同进同退。"""
    require_numbers(directory)
    run = Run(directory)
    with locked(run.directory):
        state = run.load(); root = Path(state["root"]); store = Ledger(root)
        drafts = run.directory / "drafts"
        if git(root, "status", "--porcelain", "--untracked-files=all"):
            raise ValueError("合入前作者工作树须干净，不能混入别的修改")
        scope = {r["page"]: r for r in read(run.directory / "scope.json")["pages"]}
        candidates = {p: drafts / p for p in state["pages"] if (drafts / p / "draft.json").is_file()
                      and not state["pages"][p].get("merged_commit")}
        groups = [{d["page"] for d in cap.get("destinations", [])}
                  for book in {r["book"] for r in scope.values()} for cap in store.read(book)["capabilities"]]
        ready = {p for p, row in state["pages"].items() if row["status"] == "ready" and set(row["passed"]) == set(GATES)}
        peers = set().union(*groups) | candidates.keys()
        failures = {p: state["pages"].get(p, {}).get("reason") or "三关或草稿未齐" for p in peers
                    if p not in ready or p not in candidates and not state["pages"].get(p, {}).get("merged_commit")}
        registry_file = "sources/refresh/registry.json"; registry = read(root / registry_file)
        asset_map = "sources/assets/_library/asset-map.jsonl"
        map_raw = (root / asset_map).read_bytes() if (root / asset_map).is_file() else b""
        updates = {}
        for p in sorted(candidates.keys() - failures.keys()):
            try:
                if state["pages"][p].get("draft_sha256") != draft_hash(run.directory, p): raise ValueError("过关后草稿已变，须重走三关")
                updates[p] = draft_updates(root, candidates[p])
            except (ValueError, KeyError, OSError) as error:
                failures[p] = str(error)
        blocking = {p: {p} for p in failures}
        for _ in groups:  # 传播原始失败原因；重叠能力的传递同组也不能半合入。
            for group in groups:
                causes = set().union(*(blocking.get(p, set()) for p in group))
                if causes:
                    for p in group: blocking[p] = blocking.get(p, set()) | causes
        allowed = candidates.keys() - blocking.keys()
        deferred = {p: dict(reason="；".join(f"{q}：{failures[q]}" for q in sorted(blocking[p])),
                            draft=str(candidates[p]), scope=scope[p]) for p in candidates.keys() & blocking.keys()}
        for p, row in deferred.items(): write(candidates[p] / "deferred.json", row)
        payloads = {}; merged_map = map_raw
        for p in sorted(allowed):
            files, rows, materials = updates[p]; payloads.update(files)
            replacements = {r["id"]: r for r in rows}
            registry["records"] = [replacements.pop(r["id"], r) if r.get("page") == p else r
                                   for r in registry["records"] if r.get("page") != p or r["id"] in replacements] + list(replacements.values())
            if materials is not None: merged_map = replace_asset_rows(merged_map, p, materials)
        if merged_map != map_raw:
            payloads[asset_map] = merged_map
            marker_file = "sources/assets/_library/REQUESTS-READY.json"; marker = read(root / marker_file)
            marker["asset_map_sha256"] = sha256(merged_map).hexdigest()
            payloads[marker_file] = (json.dumps(marker, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        if allowed and registry != read(root / registry_file):
            payloads[registry_file] = (json.dumps(registry, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        changed = {f: raw for f, raw in payloads.items() if not (root / f).exists() or (root / f).read_bytes() != raw}
        before = {f: (root / f).read_bytes() if (root / f).exists() else None for f in changed}
        commit = git(root, "rev-parse", "HEAD")
        try:
            for f, raw in changed.items():
                target = root / f; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
            if changed:
                git(root, "add", "--", *changed)
                git(root, "commit", "-m", "Merge accepted page drafts", "-m", "变化：过关草稿进入作者源，未过页保留原内容。")
                commit = git(root, "rev-parse", "HEAD")
        except (OSError, subprocess.SubprocessError):
            try: git(root, "reset", "--", *changed)
            finally:
                for f, raw in before.items():
                    if raw is None: (root / f).unlink(missing_ok=True)
                    else: (root / f).write_bytes(raw)
            raise
        for p in allowed: state["pages"][p].update(merged_commit=commit, draft=str(candidates[p]))
        carry_file = store.companion / "files/update-dropped.json"
        carry = read(carry_file) if carry_file.exists() else {}
        for p in allowed: carry.pop(p, None)
        carry.update({p: dict(r, scope={k: v for k, v in r["scope"].items() if k != "retry"}) for p, r in deferred.items()})
        write(carry_file, carry)
        receipt = dict(merged=sorted(allowed), deferred=deferred, commit=commit, files=sorted(changed))
        write(run.directory / "merge.json", receipt)
        write(run.directory / "state.json", state)
        run.summary(state)
        return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    begin = sub.add_parser("start")
    begin.add_argument("--root", type=Path, default=ROOT)
    begin.add_argument("--requested-at", required=True, help="本人开口的带时区时间")
    begin.add_argument("--project", action="append", default=[])
    begin.add_argument("--page", action="append", default=[])
    begin.add_argument("--scope", type=Path, help="范围名单 JSON 数组：项目 ID、账名或页名；不填按全部动了的项目")
    begin.add_argument("--numbers-only", action="store_true")
    begin.add_argument("--first-pass", action="store_true", help="仅全站头一遍：全页入围，无总截止")
    for key, default in (("repositories", REPOSITORIES), ("supply", SUPPLY), ("exclusions", EXCLUSIONS)):
        begin.add_argument("--" + key, type=Path, default=default)
    numeric = sub.add_parser("numbers")
    numeric.add_argument("--budget", type=float, default=300, help="取数默认预算，只记用时不截断")
    numeric.add_argument("--only", help="明确只换这些页的数字，逗号分隔；默认取全部已登记允许页")
    sub.add_parser("merge")
    trial = sub.add_parser("trial")
    for name in ("baseline-dist", "baseline-rendered", "checks-input"):
        trial.add_argument("--" + name, type=Path, required=True)
    for action in ("status", "begin", "repair", "step-start", "step-end", "pass", "reject", "drop", "record-published", "finish"):
        cmd = sub.add_parser(action)
        cmd.add_argument("--page")
        cmd.add_argument("--step")
        cmd.add_argument("--artifact")
        cmd.add_argument("--reason", default="")
        cmd.add_argument("--budget", type=float)
        cmd.add_argument("--event-id", help="重发同一操作时沿用，避免重复计数")
    update_batch.register(sub)
    for cmd in sub.choices.values(): cmd.add_argument("--run-dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.action.startswith("batch-"):
            state = update_batch.main(args)
        elif args.action == "start":
            state = start(args.root, args.run_dir, args.requested_at, args.project, args.page, args.scope,
                          args.numbers_only, args.first_pass, args.repositories, args.supply, args.exclusions)
        elif args.action == "status":
            run = Run(args.run_dir)
            with locked(run.directory): state = run.load(); run.summary(state)
        elif args.action == "numbers":
            state = numbers(args.run_dir, args.budget, args.only)
        elif args.action == "merge":
            state = merge(args.run_dir)
        elif args.action == "trial":
            from update_trial import trial
            state = trial(args.run_dir, args.baseline_dist, args.baseline_rendered, args.checks_input)
        else:
            if args.action in {"begin", "repair"} or args.action == "step-start" and args.page:
                require_numbers(args.run_dir)
            state = Run(args.run_dir).apply(args.action, args.page, args.step, args.artifact, args.reason, args.budget, args.event_id)
        print(json.dumps(dict(run_dir=str(args.run_dir), **state), ensure_ascii=False, indent=2))
    except (ValueError, KeyError, OSError, subprocess.SubprocessError) as error:
        parser.exit(1, f"update: {error}\n")


if __name__ == "__main__":
    main()
