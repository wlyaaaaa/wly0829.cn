"""按私有模板开只读 Sol 单；一个等候器补发并收齐，Opus 只出卡不调用。"""
from collections import defaultdict
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

from editorial_ledger import Ledger, atomic_write_text
from update_gates import Run, git, locked, now, protected_inputs, read, timestamp, write

DISPATCH = "E:/.agents/tools/Invoke-ClaudeGptChild.ps1"
REPOS = Path("E:/PCConfig/registries/repository-paths.json")
SUPPLY = Path("E:/.agents/config/personal-skill-supply.json")
FINAL = {"completed", "failed", "timeout", "stopped", "quota_exhausted", "auth_invalid", "network_error"}
FIELDS = dict(a="句数 不对 整段 查不到 账讲了页上没有 意思跟着数变 登记数不对 状态句 顺手未讲".split(),
              b="候选 已没了 演进候选".split(), e="句数 不对 换出处 查不到".split(),
              f="打架 对不上数 两处不一 指代落空 重复 标题不符 其他".split())


def ps(*args):
    result = subprocess.run(["pwsh", "-NoProfile", "-File", DISPATCH, *map(str, args), "-Full"],
                            capture_output=True, text=True, encoding="utf-8-sig")
    try: value = json.loads(result.stdout)
    except ValueError as error: raise ValueError(result.stdout + result.stderr) from error
    if result.returncode or value.get("status") == "error": raise ValueError(str(value))
    return value


def fill(templates, name, values, target):
    source = next(Path(templates).glob(name + ("-*.md" if name in "abcef" else ".md")))
    text = re.sub(r"\{\{([^{}]+)\}\}", lambda m: str(values[m[1]]), source.read_text("utf-8-sig"))
    target.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_text(target, text, encoding="utf-8")


def prepare(directory, task_id, kinds="ab", materials=None, repositories=REPOS, supply=SUPPLY):
    directory = Path(directory).resolve(); state = Run(directory).load(); scope = read(directory / "scope.json")
    store = Ledger(state["root"]); root = store.root; templates = store.companion / "files/docs/update-templates"
    bindings = {r["repo"].lower(): Path(r["path"]) for r in read(repositories)["entries"]}
    skills = read(supply)["skills"]
    supplied = read(materials) if materials else {}; previous = read(directory / "batch.json") if (directory / "batch.json").exists() else dict(jobs=[], peak=0)
    jobs = previous["jobs"]; projects = {}
    for row in scope["pages"]:
        page, book = row["page"], row["book"]; project = book.removeprefix("project-"); ledger = store.read(book)
        source_lines, differences = [], []
        for repo in ledger["source_repositories"]:
            if repo not in scope["sources"] or repo.lower() not in bindings:
                source_lines.append(repo + "：来源未齐"); continue
            checkout = bindings[repo.lower()]; commit = scope["sources"][repo]["commit"]
            source_lines.append(f"{checkout} 截至提交 {commit}")
            old_commits = {p.get("checked_sources", {}).get(repo, {}).get("commit") for p in ledger["pages"].values()}
            for old in sorted(c for c in old_commits if c):
                differences.extend(p for p in git(checkout, "diff", "--name-status", "--diff-filter=AD", old, commit).splitlines()
                                   if not re.search(r"(^|[/\\])(tests?|__tests__)([/\\]|$)", p.split("\t")[-1], re.I))
        skill = project.removeprefix("skill-")
        skill = {"learning": "career-development", "document-materials": "personal-formal-documents"}.get(skill, skill)
        for name in sorted({skill} | {s["name"] for s in skills if s.get("install") and s.get("project_id") in ledger["source_repositories"]}):
            skill_path = Path("E:/.agents/skills") / name / "SKILL.md"
            if skill_path.exists():
                agents = skill_path.parents[2]; commit = git(agents, "rev-list", "-1", "--before=" + scope["cutoff"], "HEAD")
                source_lines.append(f"{skill_path}（同样是来源，{agents} 截至提交 {commit}）")
        target = directory / "pages" / kinds / page
        if not target.exists():
            target.mkdir(parents=True)
            for name in ("page.json", "layout.json"):
                source = root / "sources/pages" / page / name
                if source.exists(): shutil.copyfile(source, target / name)
        pagefile = str(target / "page.json") if (target / "page.json").exists() else "https://wly0829.cn" + row["url"]
        values = dict(项目=project, 页路由=row["url"], 页短名=page, 本次目录=str(directory), 整件编号=task_id,
                      时限分钟=60, 页文件=pagefile, 改完的整页=pagefile, 账文件=str(store.path(book)),
                      页图片目录=f"线上页 https://wly0829.cn{row['url']} 的真实图片 URL（本机可能只有 manifest，不能当作图片；用无头浏览器，不开可见标签页）",
                      来源仓库和截至提交="；".join(source_lines), 上次每屏来源=json.dumps(ledger["pages"].get(page, {}).get("screen_sources", {}), ensure_ascii=False),
                      模式="头一遍" if state["first_pass"] or not any(p.get("checked_sources") for p in ledger["pages"].values()) else "每周",
                      上次核到的提交=json.dumps({p: v.get("checked_sources", {}) for p, v in ledger["pages"].items()}, ensure_ascii=False),
                      新增删除文件清单="\n".join(differences) or "无；头一遍或新项目仍列全部")
        values.update(supplied.get("*", {})); values.update(supplied.get(page, {}))
        projects.setdefault(project, dict(values=values, page_dirs=[]))["page_dirs"].append(str(target))
        for kind in kinds:
            key = f"{kind}-{project if kind == 'b' else page}"
            if any(j["key"] == key for j in jobs): continue
            if kind == "e" and not supplied.get(page, {}).get("本页改动清单"): continue
            if kind == "f" and not state["first_pass"] and page not in supplied: continue
            card = directory / "cards" / (key + ".md"); fill(templates, kind, values, card)
            (directory / kind).mkdir(exist_ok=True)
            jobs.append(dict(key=key, kind=kind, page=page, project=project, url=row["url"], card=str(card),
                             defer_c=state["first_pass"] and (row["url"] in {"/", "/how/", "/computer-access/"} or row["url"].startswith("/cockpit/")),
                             receipt=str(directory / kind / ((project if kind == "b" else page) + ".md")), status="pending"))
    previous.update(jobs=jobs, projects=projects, templates=str(templates), task_id=task_id, stage=kinds)
    write(directory / "batch.json", previous)
    return previous


def header(job):
    body = Path(job["receipt"]).read_text("utf-8-sig"); match = re.match(r"\s*---\s*\n(.*?)\n---(?:\s*\n|$)", body, re.S)
    if not match: raise ValueError("缺回执字段头")
    pairs = [line.split(":", 1) for line in match[1].splitlines() if ":" in line]; data = {k.strip(): v.strip() for k, v in pairs}
    if len(data) != len(pairs) or data.get("单") != job["kind"]: raise ValueError("回执身份或重复字段")
    if job["kind"] != "f" and data.get("项目") != job["project"]: raise ValueError("回执项目不符")
    if job["kind"] != "b" and data.get("页") != job["url"]: raise ValueError("回执页面不符")
    counts = {k: int(data[k]) for k in FIELDS[job["kind"]]}
    if any(v < 0 for v in counts.values()): raise ValueError("回执条数为负")
    if job["kind"] == "a" and counts["整段"] > counts["不对"]: raise ValueError("整段大于不对")
    if job["kind"] in "ae" and counts["不对"] > counts["句数"]: raise ValueError("不对大于句数")
    return counts, body


def collect(directory, batch):
    grouped = defaultdict(list); notes = []; singles = []; opus = []
    for job in batch["jobs"]:
        if job.get("run_dir"):
            state = read(Path(job["run_dir"]) / "task-state.json"); job.update(status=state["execution_status"], seconds=state["time"]["work_seconds"], report=state["report"], started_at=state["started_at"], ended_at=state["ended_at"])
            mail = Path(job["run_dir"]) / "to-claude.md"
            if mail.exists() and mail.read_text("utf-8-sig").strip(): notes.append(str(mail))
        if job["kind"] not in batch.get("stage", "ab"): continue
        job.pop("issue", None); job.pop("counts", None); grouped[job["project"]].append(job)
        if job["status"] == "completed":
            try: job["counts"], _ = header(job)
            except (ValueError, KeyError, OSError) as error: job["issue"] = str(error)
        elif job["status"] == "starting" and not job.get("run_dir"): job["issue"] = "派单结果不明：核对原任务，不重复开"
        elif job["status"] not in {"pending", "starting", "running"}: job["issue"] = job.get("error", job["status"])
        if job.get("issue"): notes.append(job["key"] + "：" + job["issue"])
    summaries = []
    for project, jobs in grouped.items():
        routes = set(); items = []; receipts = []
        for job in jobs:
            c = job.get("counts", {}); kind = job["kind"]; receipts.append(job["receipt"])
            if job.get("issue"): routes.add("主持")
            if kind == "a" and c:
                if any(c[k] for k in ("整段", "账讲了页上没有", "意思跟着数变", "状态句")): routes.add("c")
                if c["登记数不对"]: routes.add("数字")
                if c["不对"] > c["整段"]:
                    found = re.findall(r"^a-[^｜|\n]+[｜|][^｜|\n]*单句[^｜|\n]*[｜|][^\n]*", header(job)[1], re.M)
                    if len(found) != c["不对"] - c["整段"]: routes.add("主持"); notes.append(job["key"] + "：单句条数和正文不符")
                    else: routes.add("批阅"); items.extend(f"{project}｜{job['page']}｜{line}" for line in found)
            if kind == "b" and any(c.values()): routes.add("c")
            if kind == "e" and c:
                if c["不对"]: routes.add("c")
                if c["换出处"] or c["查不到"]: routes.add("主持")
            if kind == "f" and any(c.values()): routes.add("c")
        ready = all(j.get("counts") is not None for j in jobs)
        if "c" in routes: routes.discard("批阅")
        if "c" in routes and any(j.get("defer_c") for j in jobs):
            routes.discard("c"); routes.add("主持"); notes.append(project + "：头一遍首页、协作、驾驶舱、授权页交样张主持")
        if ready and "主持" not in routes:
            info = batch["projects"][project]; values = dict(info["values"])
            if "c" in routes:
                values.update(页目录="；".join(info["page_dirs"]),
                              块导出文件=values.get("块导出文件", "尚无；由主持补本次块导出，不凭空编块号"), a和b回执="；".join(receipts),
                              升成c的条目="无；本项目单句一并处理", 回改报告="；".join(receipts),
                              私有内容规则=str(Path(batch["templates"]).parent / "design/private-content-rules.md"),
                              放不下怎么办="放不下的新条目本次不加屏、不动构图，账里记待加屏；改错换成差不多长的句子")
                if not info["values"].get("块导出文件"): notes.append(project + "：c 卡缺块导出材料，主持须在 --materials 的 * 项补块导出文件")
                card = directory / "opus" / batch["stage"] / f"c-{project}.md"; fill(batch["templates"], "c", values, card)
                opus.append(dict(project=project, model="Opus", role="c", effort="xhigh", prompt_file=str(card)))
            elif "批阅" in routes: singles.extend(items)
        totals = {k: sum(j.get("counts", {}).get(k, 0) for j in jobs) for k in {k for j in jobs for k in j.get("counts", {})}}
        if not ready: routes.add("等候" if not any(j.get("issue") for j in jobs) else "主持")
        summaries.append(dict(project=project, routes=sorted(routes) or ["到此为止"], counts=totals,
                              completed=sum(j["status"] == "completed" for j in jobs), total=len(jobs)))
    for n, offset in enumerate(range(0, len(singles), 70), 1):
        items = directory / "opus" / batch["stage"] / f"items-{n}.md"; items.parent.mkdir(parents=True, exist_ok=True)
        atomic_write_text(items, "项目｜页｜编号｜种类｜原句｜来源｜建议\n" + "\n".join(singles[offset:offset + 70]) + f"\n同屏上下文：{directory / 'pages' / 'ab'} 下各页 page.json。", encoding="utf-8")
        values = dict(本次目录=str(directory), 批号=n, 时限分钟=45, 整件编号=batch["task_id"], 本批单句改法文件=str(items),
                      来源仓库和截至提交="；".join(p["values"]["来源仓库和截至提交"] for p in batch["projects"].values()))
        card = directory / "opus" / batch["stage"] / f"review-{n}.md"; fill(batch["templates"], "批阅", values, card)
        opus.append(dict(model="Opus", role="批阅", effort="medium", prompt_file=str(card)))
    result = dict(projects=summaries, opus_to_open=opus, notes=notes, peak=batch["peak"],
                  sol_count=sum(bool(j.get("run_dir")) for j in batch["jobs"]), sol_hours=sum(j.get("seconds") or 0 for j in batch["jobs"]) / 3600,
                  sol_time_unknown=sum(bool(j.get("run_dir")) and j.get("seconds") is None for j in batch["jobs"]),
                  opus_started=0, opus_hours=0, capacity_wait=batch.get("capacity_wait"))
    write(directory / "batch-summary.json", result); write(directory / "batch.json", batch)
    atomic_write_text(directory / "batch-summary.md", "\n".join(f"{r['project']}｜{r['completed']}/{r['total']}｜{'、'.join(r['routes'])}｜{json.dumps(r['counts'], ensure_ascii=False)}" for r in summaries) + "\n", encoding="utf-8")
    atomic_write_text(directory / "host-notes.md", "\n".join(notes) + "\n", encoding="utf-8")
    return result


def execute(directory, max_running=10, min_free_gb=6, parent_harness="Claude", session_id=None, model=None):
    if max_running < 1 or min_free_gb < 0: raise ValueError("并发须为正、预留内存不能为负")
    directory = Path(directory).resolve()
    lockdir = directory / "batch-lock"; lockdir.mkdir(exist_ok=True)
    with locked(lockdir):
        batch = read(directory / "batch.json")
        model = model or read(Path("E:/.agents/config/model-roster.json"))["routing"]["model_families"]["sol"]["current_model"]
        while True:
            batch.pop("capacity_wait", None)
            result = collect(directory, batch)
            active = [j for j in batch["jobs"] if j.get("run_dir") and j["status"] not in FINAL]
            for job in (j for j in batch["jobs"] if j["status"] == "pending"):
                if len(active) >= max_running: break
                free = float(subprocess.check_output(["pwsh", "-NoProfile", "-Command", "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB"], text=True).strip())
                if free < min_free_gb + 1:
                    batch["capacity_wait"] = f"空闲 {free:.1f}GB，须预留 {min_free_gb}GB 再加每张约1GB"; break
                state = Run(directory).load()
                if state["status"] == "closed" or state["deadline"] and now() >= timestamp(state["deadline"]):
                    job.update(status="stopped", error="总上限已到或本次已收工"); continue
                if protected_inputs(state["root"]) != state["protected_inputs"]: raise ValueError("更新期间共用程序或流程规矩变了")
                if state["pages"][job["page"]].get("blocked"):
                    job.update(status="failed", error="来源未齐"); continue
                job.update(status="starting", model=model, effort="medium" if job["kind"] == "e" else "ultra"); write(directory / "batch.json", batch)
                name = re.sub("[^A-Za-z0-9_-]", "-", job["key"])[:22] + "-" + hashlib.sha256((str(directory) + job["key"]).encode()).hexdigest()[:12]
                args = ["-Mode", "Start", "-Model", job["model"], "-Effort", job["effort"],
                        "-PromptFile", job["card"], "-WorkDir", directory, "-TaskName", name, "-ParentHarness", parent_harness,
                        "-RepeatReason", f"每页或每项目一张，不是重复跑同一件事；{job['key']} 的回执决定该页改不改"]
                if session_id: args += ["-SessionId", session_id]
                try:
                    receipt = ps(*args)
                    if not receipt.get("run_dir"): raise ValueError(str(receipt))
                    job.update(run_dir=receipt["run_dir"], status="running", started_at=now().isoformat()); active.append(job)
                except (ValueError, OSError, subprocess.SubprocessError) as error: job.update(status="failed", error=str(error))
                batch["peak"] = max(batch["peak"], len(active)); write(directory / "batch.json", batch)
            result = collect(directory, batch)
            if not active: return result
            notice = ps("-Mode", "Watch", "-RunDirs", ",".join(j["run_dir"] for j in active))
            if notice.get("reason") not in {"task_finished", "all_finished"}:
                result = collect(directory, batch); result["watch_notice"] = notice
                result["notes"].append("Watch 需要主持处理：" + str(notice.get("reason")))
                atomic_write_text(directory / "host-notes.md", "\n".join(result["notes"]) + "\n", encoding="utf-8")
                write(directory / "batch-summary.json", result)
                return result


def register(sub):
    for action in ("batch-plan", "batch-run", "batch-collect"):
        cmd = sub.add_parser(action)
        if action == "batch-plan":
            cmd.add_argument("--task-id", required=True); cmd.add_argument("--kinds", choices=("ab", "e", "f", "ef"), default="ab")
            cmd.add_argument("--materials", type=Path); cmd.add_argument("--repositories", type=Path, default=REPOS)
            cmd.add_argument("--supply", type=Path, default=SUPPLY)
        if action == "batch-run":
            cmd.add_argument("--max-running", type=int, default=10); cmd.add_argument("--min-free-gb", type=float, default=6)
            cmd.add_argument("--parent-harness", choices=("Claude", "Codex"), default="Claude"); cmd.add_argument("--session-id", default=os.environ.get("CODEX_THREAD_ID"))


def main(args):
    if args.action == "batch-run": return execute(args.run_dir, args.max_running, args.min_free_gb, args.parent_harness, args.session_id)
    lockdir = args.run_dir / "batch-lock"; lockdir.mkdir(exist_ok=True)
    with locked(lockdir):
        if args.action == "batch-plan": return prepare(args.run_dir, args.task_id, args.kinds, args.materials, args.repositories, args.supply)
        return collect(args.run_dir, read(args.run_dir / "batch.json"))
