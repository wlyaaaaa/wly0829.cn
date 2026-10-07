"""第二版“今天的河”：把素材和数据装进一个网页文件。主页面用真实记录；两张验收页明说是假设。"""
import base64
import copy
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
A2 = ROOT / "assets2"


def uri(name, mime):
    return f"data:{mime};base64," + base64.b64encode((A2 / name).read_bytes()).decode()


template = (ROOT / "river2.template.html").read_text(encoding="utf-8")
template = (template.replace("__RIVER__", uri("river.webp", "image/webp")).replace("__MASK__", uri("mask.png", "image/png"))
            .replace("/*__GEOM__*/null", (A2 / "geom.json").read_text(encoding="utf-8")))
for i in range(4):
    template = template.replace(f"__BOAT{i}__", uri(f"boat{i}.webp", "image/webp"))
bird = json.loads((A2 / "bird.json").read_text(encoding="utf-8"))
for pose, meta in bird.items():
    meta["src"] = uri(f"bird-{pose}.webp", "image/webp")
template = template.replace("/*__BIRD__*/null", json.dumps(bird))
snapshot = json.loads((ROOT / "tasks-snapshot.json").read_text(encoding="utf-8"))


def write(filename, data):
    payload = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
    out = ROOT / filename
    out.write_text(template.replace("/*__DATA__*/null", payload), encoding="utf-8")
    return out


def every(row):
    s = row.get("schedule_zh") or ""
    if "每分钟一次" in s:
        return 1
    m = re.search(r"每\s*(\d+)\s*分钟一次", s)
    return int(m.group(1)) if m else 10 ** 9


def afternoon(snap, at="2026-10-04T16:30:00+08:00"):
    """假设现在是下午：按真实的计划时间，把已经到点的船算作跑完；再假装两条船和一盏灯出了问题。"""
    s = copy.deepcopy(snap); a = s["automation"]; now = datetime.fromisoformat(at)
    s["sample_kind"] = "hypothetical"; s["captured_at"] = at; a["observed_at"] = at
    s["source_note"] = "这一页是假设的验收画面：把时间拨到今天 16:30，按真实的计划时间算哪些船已经过了浮标，再假装有两条船和一盏灯出了问题。不是电脑上真实发生的事。"
    for row in a["items"]:
        if row.get("enabled") is False or row["state"] == "disabled":
            continue
        n = every(row)
        if n <= 30 and row["state"] in ("success", "running"):
            row["last_run_at"] = (now - timedelta(minutes=min(n, 3))).isoformat(); row["next_run_at"] = (now + timedelta(minutes=n)).isoformat()
            continue
        nxt = row.get("next_run_at")
        if nxt:
            t = datetime.fromisoformat(nxt)
            if t.astimezone(now.tzinfo).date() == now.date() and t <= now:
                row["last_run_at"] = t.isoformat(); row["next_run_at"] = (t + timedelta(days=1)).isoformat()
                if row["state"] == "never":
                    row["state"] = "success"
    fake = {"第二备份盘同步": ("failed", "假设：第二备份盘没有接上，这一趟没有写进去"),
            "系统恢复备份": ("warn", "假设：只备份了一部分，剩下的等下一趟"),
            "小米妙享守护": ("failed", "假设：守护连着几次没有回应")}
    for row in a["items"]:
        hit = fake.get(row["plain"]["name"])
        if hit:
            row["state"], row["status_note"] = hit
    return s


outs = [write("今天的河-第二版.html", snapshot), write("今天的河-第二版-假设下午有异常.html", afternoon(snapshot))]
offline = copy.deepcopy(snapshot); offline["automation"]["state"] = "stale"
outs.append(write("今天的河-第二版-读不到电脑.html", offline))
for o in outs:
    print(o.name, round(o.stat().st_size / 1024), "KB")
