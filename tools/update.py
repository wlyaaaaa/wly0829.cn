"""The selected-page checklist used by the existing website update instructions."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import time
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / part) for part in ("scripts/content-refresh", "site-astro/tools")]
from editorial_ledger import (
    Ledger, atomic_write_bytes, companion_root, read_json, validate_book_reviews, valid_time, write_json,
)
import selected_project

RUNS = Path("E:/Cache/wly-site-build/refresh-runs")
SCHEMA = "wly.selected-site-update.v1"
FINGERPRINT = re.compile(r"[a-f0-9]{40}")
REPORT = Path("E:/.agents/skills/report-page/scripts/New-ReportPage.ps1")
STEPS = dict(renames="查改名", before="保留改前图", convert="改稿换进网页", scan="验成品", publish="发布回读")
REQUIRED_REVIEWS = {
    "/live/": "实况：逐项核 docs/update.md 第九节（含项目页模块抽查）",
    "/rules/": "规则：对照活动版本、专题名单和适用范围",
}


def now():
    return datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")


def python(script, *args, check=True):
    return subprocess.run([sys.executable, "-B", "-X", "utf8", str(ROOT / script), *map(str, args)],
                          cwd=ROOT, check=check).returncode


def get_active():
    paths = [p for p in RUNS.glob("update-*/update-batch.json") if not read_json(p).get("finished_at")]
    if len(paths) > 1:
        raise ValueError("有多趟更新未结束，请明确传 --batch")
    return paths[0] if paths else None


@contextmanager
def run_lock(batch):
    # All entrypoints for this run share a Windows file lock. The OS releases it on interruption.
    import msvcrt
    batch.parent.mkdir(parents=True, exist_ok=True)
    lock_dir = RUNS if batch.is_relative_to(RUNS.resolve()) else batch.parent
    with (lock_dir / ".update.lock").open("a+b") as handle:
        handle.seek(0)
        try:
            msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            raise ValueError("这一趟已经在跑，请等当前命令结束") from None
        try:
            yield
        finally:
            handle.seek(0)
            msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)


def init(batch, plan):
    if batch.exists():
        raise ValueError("已有这趟清单，请用 status 接着跑")
    active = get_active() if batch.is_relative_to(RUNS.resolve()) else None
    if active:
        raise ValueError(f"先继续这趟更新：{active}")
    pages = plan["pages"]
    if not pages:
        raise ValueError("清单没有选定页")
    routes = set()
    for ident, row in pages.items():
        if not re.fullmatch(r"[a-z0-9][a-z0-9_.-]*", ident):
            raise ValueError(f"无效页编号：{ident}")
        if not row["title"].strip() or not row["reason"].strip():
            raise ValueError(f"漏写页名或改动原因：{ident}")
        route = row["route"]
        parsed = urlsplit(route)
        if not route.startswith("/") or parsed.netloc or parsed.query or parsed.fragment or ".." in Path(route).parts or "\\" in route:
            raise ValueError(f"无效页地址：{route}")
        if route in routes:
            raise ValueError(f"重复页：{route}")
        routes.add(route)
    if any(not entry["old"].strip() or not entry["new"].strip() for entry in plan.get("renames", [])):
        raise ValueError("改名记录须同时写原称呼和现称呼")
    validate_book_reviews(plan.get("book_reviews", {}))
    return {**plan, "schema": SCHEMA, "run_id": batch.parent.name, "created_at": now(),
            "repository": str(ROOT), "required_reviews": REQUIRED_REVIEWS, "progress": {}, "attempts": []}


def git_at(path, *args):
    proc = subprocess.run(["git", "-C", path, *args], capture_output=True, text=True, encoding="utf-8")
    return proc.stdout.strip() if proc.returncode == 0 else None


def ranges():
    print("每轮必核页面：")
    for route, review in REQUIRED_REVIEWS.items():
        print(f"- {route} {review}")
    common = git_at(ROOT, "rev-parse", "--path-format=absolute", "--git-common-dir")
    receipt = Path(common) / "wly-oss/published.json" if common else None
    published = read_json(receipt) if receipt and receipt.is_file() else {}
    if published.get("schema") == "wly.site-publication.v1" and published.get("deployment"):
        verified_at = datetime.fromisoformat(published["verified_at_beijing"]).astimezone(timezone(timedelta(hours=8)))
        print(f"最近正式发布：{verified_at.isoformat(timespec='seconds')}，源码 {published['source_commit']}，成品 {published['commit']}")
    else:
        print("未取得最近正式发布的成功回执")
    print()
    ledger = Ledger(ROOT)
    registry = Path("E:/PCConfig/registries")
    paths = {row["repo"].casefold(): row["path"] for row in read_json(registry / "repository-paths.json")["entries"]}
    policy = {row["repo"].casefold(): row["website"]["visibility"]
              for row in read_json(registry / "website-projects.json")["entries"]}
    table = ledger.companion / "files/site-v2/trial/first-projects/表/归属表.md"
    catalog = table.read_text("utf-8-sig")
    projects = {row["id"]: row.get("source", {}).get("repo", "") for row in ledger.projects}
    print("| 账 | 来源仓库 | 本机仓库 | 路径范围 | 起点 | 最早页账参考 | 本机 HEAD | 非合并提交 | 上次细读 | 状态 |")
    print("|---|---|---|---|---|---|---|---:|---|---|")
    for title, prefix in (("项目表", "project-"), ("技能表", "skill-")):
        section = re.search(r"^## " + title + r"\s*\n(.*?)(?=^## |\Z)", catalog, re.M | re.S)[1]
        rows = [[cell.strip() for cell in line.strip("|").split("|")] for line in section.splitlines() if line.startswith("|")]
        status_column = rows[0].index("状态")
        for row in sorted(rows[2:]):
            ident = row[0]
            if row[status_column] not in {"做完", "要做"}:
                continue
            book = "website" if prefix == "project-" and ident == "wly0829-cn" else prefix + ident
            data = ledger.read(book)
            skill = prefix == "skill-"
            primary = "wlyaaaaa/.agents" if skill else projects.get(ident, "")
            if "/" not in primary:
                primary = next(iter(data["source_repositories"]), "") if len(data["source_repositories"]) == 1 else ""
            audited = {repo.casefold(): (repo, detail) for repo, detail in data.get("reviewed_sources", {}).items()}
            reviewed = {**({primary.casefold(): (primary, {})} if primary or not audited else {}), **audited}
            for key, (repo, detail) in sorted(reviewed.items()):
                path, tip, count = paths.get(key), None, "—"
                scope = detail.get("path", "skills/" + ident) if skill else ""
                start = detail.get("commit")
                reference = None if start else min(
                    (source for page in data["pages"].values() for name, source in page.get("checked_sources", {}).items()
                     if name.casefold() == key and valid_time(source.get("time"))),
                    key=lambda source: datetime.fromisoformat(source["time"].replace("Z", "+00:00")), default=None)
                if policy.get(key) == "frozen_static":
                    status = "冻结"
                elif policy.get(key) == "hidden":
                    status = "不上网站"
                elif not path or not (Path(path) / ".git").exists() or not (tip := git_at(path, "rev-parse", "HEAD")):
                    status = "本机仓库未登记或不可读"
                else:
                    if scope and not (Path(path) / scope).is_dir() and (plugin := next(Path(path).glob(f"plugins/*/{scope}/SKILL.md"), None)):
                        scope = plugin.parent.relative_to(path).as_posix()
                    basis = start or (reference or {}).get("commit")
                    status = "可读" if basis else "待定起点"
                    if basis:
                        if git_at(path, "merge-base", "--is-ancestor", basis, tip) is None:
                            status = "起点不在本机 HEAD 历史"
                        else:
                            count = git_at(path, "rev-list", "--full-history", "--no-merges", "--count", f"{basis}..{tip}",
                                           *(("--", scope) if scope else ())) or "—"
                            if count != "—" and not start:
                                count += "（页账参考）"
                cells = (book, repo or "无登记", path or "无登记", scope or "全仓", start or "无记录",
                         (reference or {}).get("commit", "—"), tip or "—", count, data.get("last_deep_read", "无记录"), status)
                print("| " + " | ".join(cells) + " |")


def before(state, folder):
    prior = state["progress"].get("before", {}).get("output", {})
    return {ident: selected_project.snapshot_before(ROOT, folder, ident, row, prior.get(ident, {}))
            for ident, row in state["pages"].items() if row.get("images") and not row.get("new")}


def convert(state, folder):
    grouped, assets, evidence = {}, {}, {}
    selected = {key: row for key, row in state["pages"].items() if row.get("draft_dir") and not row.get("deferred")}
    if selected:
        converter = selected_project.dependencies(companion_root(ROOT))
    for ident, row in selected.items():
        if row.get("images") and not row.get("new") and ident not in state["progress"].get("before", {}).get("output", {}):
            raise ValueError(f"先为这张页保存改前图：{row['title']}")
        web, settings = selected_project.section(ROOT, row)
        path = web / "content.js"
        raw = grouped[path] if path in grouped else path.read_bytes().decode("utf-8")
        grouped[path], images = selected_project.prepare_page(ROOT, folder, ident, row, converter, raw, web, settings)
        assets.update({target: (report_image, data) for target, report_image, data in images.values()})
        evidence[ident] = {"images": {key: str(values[1]) for key, values in images.items()},
                           "inputs": selected_project.input_hashes(row)}
    for target, (report_image, data) in assets.items():
        selected_project.save_image(target, data)
        selected_project.save_image(report_image, data)
    for path, raw in grouped.items():
        atomic_write_bytes(path, raw.encode("utf-8"))
    return evidence


def renames(state, folder):
    terms = state.get("renames", [])
    if any(not entry["old"].strip() or not entry["new"].strip() for entry in terms):
        raise ValueError("改名记录须同时写原称呼和现称呼")
    output = folder / "rename-hits.json"
    if not terms:
        write_json(output, {})
        return str(output)
    inputs = [(row["route"], Path(row["path"])) for row in state.get("rename_inputs", [])]
    drafts = Path(state["drafts_dir"]) if "drafts_dir" in state else None
    for project in sorted((ROOT / selected_project.WEB).iterdir()):
        config = project / "project.json"
        if drafts is None or not config.is_file():
            continue
        for name, section in read_json(config)["sections"].items():
            source = drafts / project.name / "稿" / (name + ".md")
            if source.is_file():
                route = f"/{project.name}/{section.get('file', section['slug'] + '.html')}"
                inputs.append((route, source))
    layer = ROOT / "site-v2/first-layer"
    sources = {"connect-auth/demo": ("/computer-access/",), "list-pages/demo": ("/projects/", "/skills/"),
               "rules-page/demo": ("/rules/",),
               "header/demo": ("共用导航",), "trust-modal": ("设备验证弹窗",)}
    for relative, routes in sources.items():
        inputs.extend((route, file) for file in sorted((layer / relative).glob("*"))
                      if file.suffix in {".md", ".html", ".js"} for route in routes)
    found = {}
    for route, source in inputs:
        data = source.read_text("utf-8-sig")
        hits = [term for term in terms if term["old"] in data]
        if hits:
            found.setdefault(route, []).append({"file": str(source), "renames": hits})
    write_json(output, found)
    return str(output)


def publishable(state):
    return {ident: row for ident, row in state["pages"].items() if not row.get("deferred")}


def allowed_routes(state):
    return sorted({row["route"] for row in publishable(state).values()} | set(state.get("references", [])))


def seal(state, folder, dist):
    from publish_site import runtime
    manifest_path = dist / "release-manifest.json"
    manifest = read_json(manifest_path)
    source = manifest["source_commit"]
    rows = publishable(state)
    if not rows or not FINGERPRINT.fullmatch(source):
        raise ValueError("须先提交本轮源文件，再用成功封存的成品发布")
    converted = state["progress"].get("convert", {}).get("output", {})
    if any(row.get("draft_dir") and converted.get(ident, {}).get("inputs") != selected_project.input_hashes(row)
           for ident, row in rows.items()):
        raise ValueError("选定稿或图有新变化，先转页并重新构建")
    pages, hashes = {}, {}
    for ident, row in rows.items():
        rel = runtime.nav.route_file(row["route"])
        row_source = row.get("merged_commit", source)
        if not FINGERPRINT.fullmatch(row_source) or subprocess.run(
                ["git", "merge-base", "--is-ancestor", row_source, source], cwd=ROOT).returncode:
            raise ValueError(f"本轮成品没有合入 {row['title']} 的提交")
        if not (dist / rel).is_file():
            raise ValueError(f"本轮成品缺选定页：{row['route']}")
        hashes[rel] = manifest["files"][rel]["sha256"]
        pages[ident] = {"route": row["route"], "merged_commit": row_source}
    frozen = {"run_id": state["run_id"], "batch_id": state["run_id"], "source_commit": source,
              "release_id": manifest["release_id"], "manifest_sha256": hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
              "pages": pages, "allowed_routes": allowed_routes(state), "html_hashes": hashes}
    identity = folder / "publisher-batch.json"
    if identity.is_file() and read_json(identity) != frozen and any(not attempt["dry_run"] for attempt in state["attempts"]):
        raise ValueError("已有实发回执，继续使用原成品")
    write_json(identity, frozen)
    return identity


def collect(state, folder, final_only=False):
    sealed = folder / "publisher-batch.json"
    if not sealed.is_file():
        return {}
    from publish_site import runtime
    frozen = read_json(sealed)
    receipt = runtime.retention.shared() / "published.json"
    history = [read_json(receipt)] if receipt.is_file() else []
    for attempt in state["attempts"]:
        path = Path(attempt["directory"]) / "publish-receipt.json"
        if not attempt["dry_run"] and path.is_file():
            proof = read_json(path)
            if proof.get("deployment") and proof.get("completed_at_beijing"):
                history.append({**proof, "schema": "wly.site-publication.v1",
                                "status": "published", "local_attempt": proof["status"] != "published", "readback": proof["get"],
                                "verified_at_beijing": proof["completed_at_beijing"]})
    found = {}
    for proof in history:
        if (final_only and proof.get("local_attempt")) or proof.get("update_batch") != frozen or not proof.get("deployment"):
            continue
        for ident, row in frozen["pages"].items():
            rel = runtime.nav.route_file(row["route"])
            back = proof.get("readback", {}).get(rel, {})
            if (back.get("status") == "pass" and back.get("http") == 200
                    and back.get("sha256") == back.get("expected_sha256") == frozen["html_hashes"][rel]):
                found.setdefault(ident, proof)
    return found


def result(state, folder):
    rows, galleries = [], []
    before_images = state["progress"].get("before", {}).get("output", {})
    after_images = state["progress"].get("convert", {}).get("output", {})
    attempt = state["attempts"][-1] if state["attempts"] else {}
    receipt_file = Path(attempt["directory"]) / "publish-receipt.json" if attempt else None
    receipt = read_json(receipt_file) if receipt_file and receipt_file.is_file() else {}
    for ident, row in state["pages"].items():
        proof = state.get("public_readback", {}).get(ident)
        label = "已上线" if proof else "待下次" if row.get("deferred") else "未上线"
        if label == "未上线" and receipt.get("status") == "dry_run":
            label = "预演通过"
        if row.get("new"):
            label += " · 新页"
        rows.append([row["title"], row.get("deferred") or row["reason"], label])
        pictures = [dict(src=path, caption=phase + " · " + picture, private=True)
                    for picture, after in after_images.get(ident, {}).get("images", {}).items()
                    for phase, path in (("改前", before_images.get(ident, {}).get(picture)), ("改后", after))
                    if path]
        if pictures:
            galleries.append({"type": "heading", "level": 3, "text": row["title"]})
            galleries.append({"type": "gallery", "items": pictures})
    steps = [[STEPS[name], f"{proof['seconds']:.1f} 秒"] for name, proof in state["progress"].items() if name in STEPS]
    blocks = [{"type": "table", "columns": ["页", "为什么改", "结果"], "rows": rows}, *galleries]
    for entry in reversed(state["attempts"]):
        path = Path(entry["directory"]) / "publish-receipt.json"
        if entry["dry_run"] or not path.is_file():
            continue
        published = read_json(path)
        if published.get("status") != "published":
            continue
        retention = published.get("oss_retention", {})
        status = retention.get("status")
        if published.get("retained_reference_gaps"):
            cleanup = "部分旧对象待核引用"
        else:
            cleanup = {"complete": "已完成（旧网址和缓存另核）", "incomplete": "未完成",
                       "skipped_by_request": "本次跳过", "pending_publication": "等待回收回执"}.get(status, "未取得回执")
        blocks.append({"type": "table", "columns": ["收尾", "结果"],
                       "rows": [["网站发布", "已发布并回读"], ["OSS 旧对象回收", cleanup]]})
        break
    if notes := state.get("notes"):
        blocks.append({"type": "points", "items": notes})
    if error := receipt.get("error"):
        blocks.append({"type": "text", "text": "发布停在 " + error})
    if steps:
        blocks.append({"type": "table", "columns": ["这一步", "用时"], "rows": steps})
    output = folder / "update-result.json"
    write_json(output, {"title": "网站更新结果", "kind": "report", "report_id": state["run_id"],
                        "no_question_reason": "这页记录更新内容和发布回读。", "blocks": blocks})
    return output


def update_ledger(state, folder, batch):
    for ident, proof in collect(state, folder).items():
        row = state["pages"][ident]
        state.setdefault("public_readback", {})[ident] = proof["commit"]
        advanced = state.setdefault("ledger_updated", [])
        if ident not in advanced and row.get("checked_sources"):
            if Ledger(ROOT).advance_page(row.get("ledger_page", ident), row["checked_sources"], proof,
                                         route=row["route"], project=row.get("project")):
                advanced.append(ident)
        write_json(batch, state)
    final = collect(state, folder, final_only=True)
    if not state.get("finished_at") and final.keys() == publishable(state).keys():
        required = {ident for ident, row in publishable(state).items() if row.get("checked_sources")}
        if required <= set(state.get("ledger_updated", [])):
            if reviews := state.get("book_reviews"):
                if any(proof.get("schema") != "wly.site-publication.v1" or proof.get("status") not in {None, "published"}
                       for proof in final.values()):
                    return
                # A local receipt's completion time also includes work after readback.
                times = [p.get("started_at_beijing" if "local_attempt" in p else "verified_at_beijing") for p in final.values()]
                if not all(map(valid_time, times)):
                    return
                verified_at = min(datetime.fromisoformat(t.replace("Z", "+00:00")) for t in times)
                ledger = Ledger(ROOT)
                for book, review in reviews.items():
                    if skipped := ledger.advance_book(book, review, verified_at):
                        print(f"{book} 晚于发布回读，未记入：{', '.join(skipped)}", file=sys.stderr)
            state.setdefault("finished_at", now())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", type=Path)
    commands = parser.add_subparsers(dest="action", required=True)
    commands.add_parser("init").add_argument("--plan", required=True, type=Path)
    for name in ("status", "before", "convert"):
        commands.add_parser(name)
    commands.add_parser("renames").add_argument("--plan", type=Path)
    commands.add_parser("scan").add_argument("--dist", required=True, type=Path)
    publish = commands.add_parser("publish")
    publish.add_argument("--dist", required=True, type=Path)
    publish.add_argument("--previous-manifest", type=Path)
    publish.add_argument("--previous-site-dist", type=Path)
    publish.add_argument("--dry-run", action="store_true")
    commands.add_parser("result").add_argument("--report-generator")
    commands.add_parser("ranges", help="只读列出项目和技能的下轮取材范围")
    args = parser.parse_args()
    if args.action == "ranges":
        ranges()
        return 0
    if args.action == "publish" and (args.previous_manifest or args.previous_site_dist) and not args.dry_run:
        parser.error("实发采用登记的上次成功发布；自选上次成品只用于演练")
    if args.action == "renames" and args.plan:
        plan = args.plan.resolve()
        folder = plan.parent
        if folder.is_relative_to(ROOT):
            parser.error("本轮资料须放在公开源码仓库之外")
        with run_lock(folder / "update-batch.json"):
            print(renames(read_json(plan), folder))
        return 0
    path = args.batch or get_active()
    if not path:
        parser.error("没有在跑的更新；开始时传 --batch")
    batch = path.resolve()
    folder = batch.parent
    if folder.is_relative_to(ROOT):
        parser.error("更新清单须放在公开源码仓库之外")
    with run_lock(batch):
        if args.action == "init":
            write_json(batch, init(batch, read_json(args.plan)))
            print(batch)
            return 0
        state = read_json(batch)
        if state["schema"] != SCHEMA or state["repository"] != str(ROOT):
            raise ValueError("更新清单不属于此工作树")
        state["required_reviews"] = REQUIRED_REVIEWS
        if args.action == "status":
            print(json.dumps(state, ensure_ascii=False, indent=2))
            return 0
        started = time.monotonic()
        output = None
        code = 0
        if args.action in ("before", "convert", "renames"):
            step = {"before": lambda: before(state, folder), "convert": lambda: convert(state, folder),
                    "renames": lambda: renames(state, folder)}[args.action]
            output = step()
        elif args.action == "scan":
            code = python("site-astro/tools/scan_glance.py", "--dist", args.dist.resolve(), "--pages",
                          ",".join(allowed_routes(state)), "--out", folder / "scan", check=False)
            output = str(folder / "scan/scan-result.json")
        elif args.action == "publish":
            identity = seal(state, folder, args.dist.resolve())
            if not args.dry_run:
                update_ledger(state, folder, batch)
            if not state.get("finished_at"):
                attempt = folder / f"publish-{len(state['attempts']) + 1:02}"
                state["attempts"].append({"directory": str(attempt), "dry_run": args.dry_run})
                write_json(batch, state)
                command = ["--dist", args.dist.resolve(), "--update-batch", identity, "--scan-result",
                           folder / "scan/scan-result.json", "--output", attempt]
                if args.previous_manifest:
                    command.extend(["--previous-manifest", args.previous_manifest.resolve()])
                if args.previous_site_dist:
                    command.extend(["--previous-site-dist", args.previous_site_dist.resolve()])
                if args.dry_run:
                    command.append("--dry-run")
                code = python("site-astro/tools/publish_site.py", *command, check=False)
                output = str(attempt / "publish-receipt.json")
                if not args.dry_run:
                    update_ledger(state, folder, batch)
        elif not state.get("finished_at"):
            update_ledger(state, folder, batch)
        state["progress"][args.action] = {"time": now(), "seconds": round(time.monotonic() - started, 3),
                                           "status": "failed" if code else "done", "output": output}
        write_json(batch, state)
        if args.action in ("publish", "result"):
            report = result(state, folder)
            if args.action == "result" and args.report_generator:
                subprocess.run(["pwsh", "-NoProfile", "-File", str(REPORT), "-ContentPath", str(report),
                                "-OutputPath", str(folder / "网站更新结果.html"), "-Directory", str(folder),
                                "-KeepDays", "0", "-NoOpen", "-OwnerAsked", "-Generator", args.report_generator], check=True)
            print(report)
        elif output:
            print(json.dumps(output, ensure_ascii=False))
        return code


if __name__ == "__main__":
    raise SystemExit(main())
