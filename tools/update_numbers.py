"""数字先进入作者源提交；同一更新不再改数，不推进发布核对点。"""
from pathlib import Path
from hashlib import sha256
import sys

from update_gates import Run, git, locked, now, read, timestamp, write

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from apply_edits import apply_edits, build_number_edits
from refresh import collect
from validation import positive


def require_numbers(directory):
    state = Run(directory).load()
    if state.get("numbers", {}).get("status") != "committed":
        raise ValueError("先运行 numbers：取数、改数并提交，再核和写正文")
    git(state["root"], "merge-base", "--is-ancestor", state["numbers"]["commit"], "HEAD")


def numbers(directory, budget=300, only=None):
    positive(budget, "取数预算")
    run = Run(directory)
    with locked(run.directory):
        state = run.load(); root = Path(state["root"])
        if state.get("numbers", {}).get("status") == "committed":
            raise ValueError("本次更新已经改数并提交；数字问题留待下次取数")
        if state["status"] == "closed" or (state["deadline"] and now() >= timestamp(state["deadline"])):
            raise ValueError("本次已收工或到总上限，不能再取数")
        if any(p["status"] not in {"pending", "dropped"} for p in state["pages"].values()):
            raise ValueError("正文已经开工，不能再改数；新开一次更新")
        output = run.directory / "numbers"; output.mkdir(exist_ok=True)
        if "numbers" not in state:
            if git(root, "status", "--porcelain", "--untracked-files=no"):
                raise ValueError("取数前须提交或移走已有改动，数字提交不能混入别的修改")
            state["numbers"] = dict(status="collecting", base_commit=git(root, "rev-parse", "HEAD"),
                                    started_at=now().isoformat(), budget_seconds=budget, only=only)
            state["timings"].append(dict(page=None, step="numbers", round=1,
                started_at=state["numbers"]["started_at"], budget_seconds=budget))
            write(run.directory / "state.json", state)
        phase = state["numbers"]
        if phase["only"] != only: raise ValueError("续跑须沿用原来的数字范围")
        receipt = output / "apply-report.json"
        if not receipt.exists():
            if (output / "application-started.json").exists():
                raise ValueError("上次改数中断且没有完整回执；先核对已写作者源，不能再次应用")
            registry_path = root / "sources/refresh/registry.json"
            registry = read(registry_path)
            if only:
                selected = set(only.split(","))
                if selected - {r["page"] for r in registry["records"]}: raise ValueError("数字范围含未登记页")
                registry = dict(registry, records=[r for r in registry["records"] if r["page"] in selected])
            result_path = output / "result.json"
            if not result_path.exists():
                named = [r["page"] for r in read(run.directory / "scope.json")["pages"] if r["named"]]
                result = collect(root, registry, total_seconds=budget, manual_owner_request=named)
                result["registry_path"] = str(registry_path)
                write(result_path, result)
            payload = build_number_edits(root, read(result_path))
            payload.update(update_run=str(run.directory), update_run_id=state["run_id"])
            write(output / "number-edits.json", payload)
            apply_edits(root, payload)
        report = read(receipt)
        if any(r["status"] != "verified" for r in report["markdown_readback"]):
            raise ValueError("数字的 Markdown 回读未通过；保留回执，不能提交或再次应用")
        if any(sha256((root / f).read_bytes()).hexdigest() != digest for f, digest in report["files_sha256"].items()):
            raise ValueError("数字回读之后文件又变了；不能混入数字提交")
        if "files" not in phase:
            phase["files"] = sorted(report["files_sha256"])
            phase["status"] = "applied"
            write(run.directory / "state.json", state)
        commit_receipt = output / "commit.json"
        if not commit_receipt.exists():
            message = f"Refresh numbers for update {state['run_id']}\n\n变化：本次数字和真实观察日先提交，正文从此提交起核写。"
            head = git(root, "rev-parse", "HEAD")
            if head == phase["base_commit"]:
                changed = git(root, "diff", "--name-only", "HEAD").splitlines()
                if set(changed) - set(phase["files"]): raise ValueError("数字之外另有改动，不能混入数字提交")
                if changed: git(root, "add", "--", *changed)
                git(root, "commit", "--allow-empty", "-m", message)
                head = git(root, "rev-parse", "HEAD")
            elif git(root, "show", "-s", "--format=%B", "HEAD") != message:
                raise ValueError("取数后 HEAD 已被其他提交推进，先核对数字提交")
            write(commit_receipt, dict(commit=head, base_commit=phase["base_commit"]))
        phase.update(status="committed", commit=read(commit_receipt)["commit"], report="numbers/apply-report.json",
                     ended_at=now().isoformat())
        state["author_base_commit"] = phase["commit"]
        scope = read(run.directory / "scope.json"); scope["author_base_commit"] = phase["commit"]
        write(run.directory / "scope.json", scope)
        timing = next(t for t in state["timings"] if t["step"] == "numbers" and not t.get("page"))
        timing.update(ended_at=phase["ended_at"], artifact="numbers/commit.json", result="committed")
        write(run.directory / "state.json", state); run.summary(state)
        return state
