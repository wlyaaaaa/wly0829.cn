"""更新状态与钟。每次操作重读磁盘；锁随进程退出释放，收尾不推进编辑底稿。"""
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
import hashlib
import json
import msvcrt
from pathlib import Path
import re
import subprocess
import uuid

GATES = ("content", "program", "visual")


def now():
    return datetime.now(timezone(timedelta(hours=8)))


def timestamp(value):
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise ValueError("时间必须带时区")
    return result


def read(path):
    return json.loads(Path(path).read_text("utf-8-sig"))


def write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)


def git(root, *args):
    return subprocess.run(["git", "-C", str(root), *args], check=True, capture_output=True,
                          text=True, encoding="utf-8", timeout=30).stdout.strip()


def protected_inputs(root):
    paths = git(root, "ls-files", "src/typeset", "site-astro/tools", "scripts/build-site.py",
                "scripts/prepare-oss-release.py", "scripts/verify*", "docs/update.md",
                "site-astro/src/styles/typeset-page.css", "tools/update*.py").splitlines()
    return {p: hashlib.sha256((Path(root) / p).read_bytes()).hexdigest() for p in paths}


def draft_hash(directory, page):
    draft = Path(directory) / "drafts" / page
    return hashlib.sha256(b"".join(f.encode() + b"\0" + (draft / f).read_bytes() + b"\0"
                          for f in ["draft.json", *read(draft / "draft.json")["files"]])).hexdigest()


@contextmanager
def locked(directory):
    with (Path(directory) / "state.lock").open("a+b") as handle:
        handle.seek(0); handle.write(b"0"); handle.flush(); handle.seek(0)
        msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
        try:
            yield
        finally:
            handle.seek(0); msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)


class Run:
    def __init__(self, directory):
        self.directory = Path(directory).resolve()

    def load(self):
        return read(self.directory / "state.json")

    def summary(self, state=None):
        state = self.load() if state is None else state
        at = timestamp(state["ended_at"]) if state.get("ended_at") else now()
        rows = [dict(t, seconds=round((timestamp(t.get("ended_at") or at.isoformat()) -
                                      timestamp(t["started_at"])).total_seconds(), 3)) for t in state["timings"]]
        result = dict(total_seconds=round((at - timestamp(state["requested_at"])).total_seconds(), 3),
                      steps=rows, repairs={p: s["repairs"] for p, s in state["pages"].items()},
                      dropped={p: s.get("reason") for p, s in state["pages"].items() if s["status"] == "dropped"})
        write(self.directory / "timing.json", result)
        lines = ["# 用时表", "", f"从开口累计 {result['total_seconds']} 秒。", "",
                 "|页/步骤|预算秒|实际秒|轮次|状态|", "|---|---:|---:|---:|---|"]
        lines += [f"|{t.get('page') or '全局'}/{t['step']}|{t['budget_seconds'] if t.get('budget_seconds') is not None else '未设'}|{t['seconds']}|{t['round']}|{'结束' if t.get('ended_at') else '进行中'}|" for t in rows]
        (self.directory / "timing.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
        return result

    def apply(self, action, page=None, step=None, artifact=None, reason="", budget=None, event_id=None):
        event_id = event_id or uuid.uuid4().hex
        if not re.fullmatch(r"[a-zA-Z0-9_.-]{1,100}", event_id):
            raise ValueError("事件编号须为短文件名")
        with locked(self.directory):
            state = self.load()  # 不把 helper 持有的旧状态盖回来。
            if event_id in state["events"]:
                return state
            if action == "finish" and state["status"] == "closed": return state
            at = now(); current = state["pages"][page] if page else None
            if action in {"begin", "repair", "pass", "reject", "drop", "record-published"} and current is None:
                raise ValueError("缺页名")
            if action == "begin" and current["status"] in {"ready", "published", "dropped", "active"}:
                return state
            opening = action in {"begin", "repair"} or (action == "step-start" and (page or step not in {"publish", "report"}))
            if state["status"] == "closed" and action in {"begin", "repair", "step-start"}:
                raise ValueError("本次已经收工；继续须新开一次")
            if opening:
                if state["deadline"] and at >= timestamp(state["deadline"]):
                    raise ValueError("总上限已到：只许放下、发布过关页、汇报")
                if protected_inputs(state["root"]) != state["protected_inputs"]:
                    raise ValueError("更新期间共用程序或流程规矩变了；放下受影响页，收工后另修")
            if artifact:
                artifact = (self.directory / artifact).resolve()
                if not artifact.is_relative_to(self.directory) or not artifact.is_file():
                    raise ValueError("产出必须是本次目录内已有的文件")
                artifact = artifact.relative_to(self.directory).as_posix()
            if action in {"pass", "step-end", "record-published", "finish"} and not artifact:
                raise ValueError("缺本次目录内的产出文件")
            active = next((t for t in reversed(state["timings"]) if t.get("page") == page and
                           t["step"] == step and not t.get("ended_at")), None)
            if action == "begin":
                if current.get("blocked"):
                    raise ValueError("来源未齐：" + "; ".join(current["blocked"]))
                if current["status"] != "pending":
                    raise ValueError("退回的页须用 repair 续修")
                current["status"] = "active"
            elif action == "repair":
                if current["status"] != "rejected" or current["repairs"] >= 3:
                    raise ValueError("这一页没有可开的修复")
                current["repairs"] += 1; current["status"] = "active"
                current["passed"] = []  # 改过的草稿重新走三关，修复次数跨关累计。
            elif action == "step-start":
                if page and (current["status"] != "active" or step not in GATES):
                    raise ValueError("只能给正在做的页开内容、程序、看屏步骤")
                if page and (step in current["passed"] or any(t.get("page") == page and t["step"] != step and not t.get("ended_at") for t in state["timings"])):
                    raise ValueError("已过的步骤不重做；同一页按步核对")
                if not step:
                    raise ValueError("缺步骤名")
                if not active:
                    round_number = current["repairs"] + 1 if page else 1 + sum(t["step"] == step and not t.get("page") for t in state["timings"])
                    state["timings"].append(dict(page=page, step=step, round=round_number,
                                                started_at=at.isoformat(), budget_seconds=budget))
            elif action in {"pass", "reject", "step-end"}:
                if not active:
                    raise ValueError("该步骤尚未开工或已经结束")
                if action in {"pass", "reject"}:
                    if not current or current["status"] != "active" or step not in GATES:
                        raise ValueError("只能核对正在做的页")
                    if action == "pass":
                        if (self.directory / "drafts" / page / "draft.json").is_file():
                            digest = draft_hash(self.directory, page)
                            if current["passed"] and current.get("draft_sha256") != digest: raise ValueError("草稿已改：退回后 repair，重走三关")
                            current["draft_sha256"] = digest
                        current["passed"].append(step)
                        if set(current["passed"]) == set(GATES): current["status"] = "ready"
                    else:
                        if not reason.strip(): raise ValueError("退回须写原因")
                        current.update(status="dropped" if current["repairs"] == 3 else "rejected", reason=reason)
                elif page:
                    raise ValueError("页面步骤须用 pass 或 reject 收回执")
                active.update(ended_at=at.isoformat(), artifact=artifact, result=action)
            elif action == "drop":
                if not current or current["status"] in {"ready", "published"} or not reason.strip():
                    raise ValueError("只可放下未过关页，并须写原因")
                current.update(status="dropped", reason=reason)
                for t in state["timings"]:
                    if t.get("page") == page and not t.get("ended_at"): t.update(ended_at=at.isoformat(), result="drop")
            elif action == "record-published":
                if current["status"] != "ready": raise ValueError("只能登记过关页的发布结果")
                current.update(status="published", publication=artifact)
            elif action == "finish":
                if page: raise ValueError("finish 用于整次更新")
                state.update(status="closed", ended_at=at.isoformat(), report=artifact)
                for t in state["timings"]:
                    if not t.get("ended_at"): t.update(ended_at=at.isoformat(), result="unfinished")
            else:
                raise ValueError("未知操作")
            event = dict(id=event_id, action=action, page=page, step=step, at=at.isoformat(), artifact=artifact, reason=reason)
            write(self.directory / "events" / (event_id + ".json"), event)
            state["events"].append(event_id)
            write(self.directory / "state.json", state)
            self.summary(state)
            return state
