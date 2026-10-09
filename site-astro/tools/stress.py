"""压力测试：拿已转换的页面，一组卡片的内容加长一倍、另一组卡片删掉一半，写成 /stress/... 的页面。
用法：python tools/stress.py   然后 SX_STRESS=1 npm run build
改动：汇报网页“能做的事：卡片、媒体、好读”三张卡，每张卡正文整段重复一遍（字数翻倍）；
      本地文字识别“读字”那组 6 张功能卡删掉后 3 张。"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "content", "pages")
OUT = os.path.join(SRC, "_stress"); os.makedirs(OUT, exist_ok=True)


def load(name):
    t = open(os.path.join(SRC, name + ".md"), encoding="utf-8").read()
    _, fm, body = t.split("---\n", 2)
    return json.loads(fm), body


def save(name, fm, body):
    fm["url"] = "/stress" + fm["url"]
    open(os.path.join(OUT, name + ".md"), "w", encoding="utf-8").write("---\n" + json.dumps(fm, ensure_ascii=False, indent=1) + "\n---\n" + body)


def blocks(body):
    return [m for m in re.finditer(r"^:::cards\n(.*?)^:::$", body, re.S | re.M)]


# 1) 加长一倍
fm, body = load("skill-report-page")
i = body.index("::screen{#skill-report-page-05")
m = next(b for b in blocks(body) if b.start() > i)
cards = re.split(r"(?m)^(?=::card)", m.group(1))
doubled = []
for c in cards:
    if not c.strip():
        continue
    head, _, rest = c.partition("\n\n")
    parts = rest.split("\n\n", 1)
    title, content = (parts[0], parts[1]) if parts[0].startswith("####") and len(parts) > 1 else ("", rest)
    doubled.append(head + "\n\n" + (title + "\n\n" if title else "") + content.rstrip() + "\n\n" + content.rstrip() + "\n")
body = body[:m.start(1)] + "\n".join(doubled) + body[m.end(1):]
save("skill-report-page", fm, body)

# 2) 删掉一半
fm, body = load("localocr")
i = body.index("::screen{#localocr-10")
m = next(b for b in blocks(body) if b.start() > i)
cards = [c for c in re.split(r"(?m)^(?=::card)", m.group(1)) if c.strip()]
keep = cards[: (len(cards) + 1) // 2]
body = body[:m.start(1)] + "".join(keep) + body[m.end(1):]
save("localocr", fm, body)
print("加长一倍：汇报网页·卡片媒体好读", len(doubled), "张；删掉一半：本地文字识别·读字", len(cards), "→", len(keep), "张")
