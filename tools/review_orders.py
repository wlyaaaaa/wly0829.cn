"""改屏看图：私有模板批量开 Sol 单，原图、原单和原结果绑定后复用。"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import uuid

from review_capture import capture, digest
from update_gates import Run, read, write

DISPATCH = "E:/.agents/tools/Invoke-ClaudeGptChild.ps1"


def evidence(job, reused=False):
    """结论重读原始结果，不取汇总或缓存自报的好坏。"""
    for key in ("card", "manifest", "result", "completion"):
        required = reused or key in {"card", "manifest"} or key + "_sha256" in job or key == "completion" and key in job
        if required and digest(job[key]) != job[key + "_sha256"]:
            raise ValueError("原单或结果已改：" + job[key])
    completion = read(job["completion"]) if job.get("completion") else read(Path(job["run_dir"]) / "task-state.json")
    if completion["execution_status"] != "completed":
        raise ValueError("看图任务尚未正常完成")
    if completion.get("result_sha256", digest(job["result"])) != digest(job["result"]): raise ValueError("原结果与完成回执不符")
    manifest = read(job["manifest"])
    if manifest["result"] != job["result"]: raise ValueError("结果不是原单指定文件")
    images = manifest["images"]; results = read(job["result"])["images"]
    if len(results) != len(images) or {r["sha256"] for r in results} != {r["sha256"] for r in images}:
        raise ValueError("结果缺图、重复或多图")
    for row in images:
        if digest(row["path"]) != row["sha256"]: raise ValueError("原图已改或丢失")
    for row in results:
        for key in ("bad", "notes"):
            if not isinstance(row[key], list) or any(not isinstance(s, str) or not s.strip() for s in row[key]):
                raise ValueError("坏处和排版提醒须为文字数组")
    return {r["sha256"]: r for r in results}


def split_reused(images, known):
    fresh, reused = [], {}
    for image in images:
        key = image["sha256"]; prior = known.get(key)
        try:
            if prior is None or key not in evidence(prior, reused=True): raise ValueError("没有原始证据")
            reused[key] = prior
        except (OSError, ValueError, KeyError, TypeError):
            fresh.append(image)
    return fresh, reused


def prepare(directory, template, cache):
    run = Run(directory); directory = run.directory; cache = Path(cache).resolve()
    current = directory / "visual.json"
    if current.exists():
        previous = read(current)
        if any(run.load()["pages"][p]["status"] == "active" and "visual" not in run.load()["pages"][p]["passed"] for p in previous["pages"]):
            for page in previous["pages"]:
                state = run.load()["pages"][page]
                if state["status"] == "active" and "visual" not in state["passed"]: run.apply("step-start", page, "visual")
            return previous  # 中断后续原单，不给正在看的图再开单。
    selected = capture(directory); unique = {i["sha256"]: i for r in selected["pages"].values() if not r["errors"] for i in r["images"]}
    known = read(cache / "index.json") if (cache / "index.json").exists() else {}
    fresh, reused = split_reused(list(unique.values()), known); jobs = []
    for offset in range(0, len(fresh), 12):
        folder = cache / "objects" / uuid.uuid4().hex; folder.mkdir(parents=True)
        images = []
        for image in fresh[offset:offset + 12]:
            target = folder / (image["sha256"] + ".png"); shutil.copyfile(image["path"], target)
            images.append(dict(image, path=str(target)))
        manifest = folder / "images.json"; result = folder / "result.json"; card = folder / "order.md"
        write(manifest, dict(images=images, result=str(result)))
        text = Path(template).read_text("utf-8-sig").replace("{{图片清单}}", str(manifest)).replace("{{结果文件}}", str(result))
        card.write_text(text, encoding="utf-8")
        jobs.append(dict(card=str(card), card_sha256=digest(card), manifest=str(manifest),
                         manifest_sha256=digest(manifest), result=str(result), status="pending"))
    plan = dict(selected, cache=str(cache), jobs=jobs, reused=reused, new_reviews=len(fresh))
    write(current, plan)
    for page in plan["pages"]: run.apply("step-start", page, "visual")
    return plan


def dispatch(directory, session_id, max_running=4):
    run = Run(directory); file = run.directory / "visual.json"; plan = read(file)
    if capture(directory, plan["pages"])["pages"] != plan["pages"]: raise ValueError("开单后输入已变，不派旧图")
    for page in plan["pages"]:
        state = run.load()["pages"][page]
        if state["status"] == "active" and "visual" not in state["passed"]: run.apply("step-start", page, "visual")
    for job in plan["jobs"]:
        if job.get("run_dir") and job["status"] in {"running", "starting"}:
            job["status"] = read(Path(job["run_dir"]) / "task-state.json")["execution_status"]
    active = sum(j["status"] in {"running", "starting"} for j in plan["jobs"])
    for job in plan["jobs"]:
        if job["status"] != "pending": continue
        if active >= max_running: break
        job["status"] = "starting"; write(file, plan)
        args = ["pwsh", "-NoProfile", "-File", DISPATCH, "-Mode", "Start", "-Model", "gpt-6.1-sol", "-Effort", "medium",
                "-PromptFile", job["card"], "-WorkDir", run.directory, "-TaskName", "screen-" + Path(job["card"]).parent.name[:16],
                "-ParentHarness", "Codex", "-SessionId", session_id, "-NoWait", "-Full",
                "-RepeatReason", "只看本批新指纹截图，结果决定这些页能否通过看屏关"]
        completed = subprocess.run(list(map(str, args)), capture_output=True, text=True, encoding="utf-8-sig")
        receipt = json.loads(completed.stdout)
        if completed.returncode or not receipt.get("run_dir"): raise ValueError(str(receipt))
        job.update(run_dir=receipt["run_dir"], status="running"); active += 1; write(file, plan)
    return plan


def collect(directory):
    run = Run(directory); file = run.directory / "visual.json"; plan = read(file)
    cache = Path(plan["cache"]); known = read(cache / "index.json") if (cache / "index.json").exists() else {}
    found = {}; sources = {}; issues = []; transitions = []
    sealed = {j["manifest"]: j for j in known.values()}
    reused = {j["manifest"] for j in plan["reused"].values()}
    for job in {j["manifest"]: j for j in [*plan["reused"].values(), *plan["jobs"]]}.values():
        try:
            job = sealed.get(job["manifest"], job)
            rows = evidence(job, reused=job["manifest"] in sealed or job["manifest"] in reused); found.update(rows)
            job["result_sha256"] = digest(job["result"]); job["status"] = "completed"
            if not job.get("completion"):
                completion = Path(job["manifest"]).parent / "completion.json"
                write(completion, dict(execution_status="completed", run_dir=job["run_dir"], result_sha256=job["result_sha256"]))
                job.update(completion=str(completion), completion_sha256=digest(completion))
            sources.update({key: dict(job) for key in rows})
        except (OSError, ValueError, KeyError, TypeError) as error:
            issues.append(dict(card=job["card"], error=str(error)))
    live = capture(directory, plan["pages"]); notes = []; results = {}
    for page, row in plan["pages"].items():
        current = run.load()["pages"][page]
        errors = list(row["errors"])
        if live["pages"][page] != row: errors.append("开单后草稿、截图或成品已变，重新走程序关")
        for image in row["images"]:
            verdict = found.get(image["sha256"], {})
            errors.extend(f"{image['screen']}/{image['viewport']}：{s}" for s in verdict.get("bad", []))
            notes.extend(dict(page=page, screen=image["screen"], viewport=image["viewport"], message=s) for s in verdict.get("notes", []))
        if current["status"] != "active" or "visual" in current["passed"]:
            results[page] = "reject" if current["status"] in {"rejected", "dropped"} else "pass"; continue
        if not errors and any(i["sha256"] not in found for i in row["images"]):
            results[page] = "incomplete"; continue
        artifact = run.directory / "visual" / (page + ".json")
        write(artifact, dict(page=page, images=row["images"], errors=errors,
                             results={i["sha256"]: found[i["sha256"]] for i in row["images"] if i["sha256"] in found}, sources=sources))
        action = "reject" if errors else "pass"
        transitions.append((action, page, str(artifact), "；".join(errors)))
        results[page] = action
    note_file = run.directory / "layout-notes.json"
    trial_notes = Path(read(run.directory / "trial.json")["output"]) / "layout-notes.json"
    previous = read(note_file) if note_file.exists() else dict(schema="wly.layout-notes.v1", findings=[])
    notes = (read(trial_notes)["findings"] if trial_notes.exists() else []) + notes
    for row in notes:
        if row not in previous["findings"]: previous["findings"].append(row)
    write(note_file, previous); known.update(sources); write(cache / "index.json", known)
    plan.update(results=results, issues=issues); write(file, plan)
    for action, page, artifact, reason in transitions:
        run.apply(action, page, "visual", artifact=artifact, reason=reason)
    return plan


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "dispatch", "collect"))
    parser.add_argument("--run-dir", type=Path, required=True)
    parser.add_argument("--template", type=Path)
    parser.add_argument("--cache", type=Path)
    parser.add_argument("--session-id")
    parser.add_argument("--max-running", type=int, default=4)
    args = parser.parse_args()
    try:
        if args.action == "prepare":
            if not args.template or not args.cache: parser.error("prepare 须给 --template 和私有 --cache")
            result = prepare(args.run_dir, args.template, args.cache)
        elif args.action == "dispatch":
            if not args.session_id: parser.error("dispatch 须给 Codex --session-id")
            if args.max_running < 1: parser.error("--max-running 须为正数")
            result = dispatch(args.run_dir, args.session_id, args.max_running)
        else: result = collect(args.run_dir)
        summary = {k: result[k] for k in ("total_screens", "selected_screens", "new_screenshots", "new_reviews", "results", "issues") if k in result}
        summary["run_dirs"] = [j["run_dir"] for j in result["jobs"] if j.get("run_dir") and j["status"] == "running"]
        print(json.dumps(summary, ensure_ascii=False))
    except (OSError, ValueError, KeyError) as error:
        parser.exit(1, f"review: {error}\n")


if __name__ == "__main__":
    main()
