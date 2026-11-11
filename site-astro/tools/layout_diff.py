"""Compare measured rendered JSON, never layout.json or freshly measured geometry."""
import argparse
import hashlib
from difflib import SequenceMatcher
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from page_checks import write_json


class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.root = dict(attrs={}, children=[], text="", tag="root")
        self.stack = [self.root]
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = dict(attrs=dict(attrs), children=[], text="", tag=tag, parent=self.stack[-1])
        self.stack[-1]["children"].append(node)
        if tag not in {"img", "br", "hr", "input", "meta", "link", "source", "wbr", "area", "embed", "param", "col"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        for node in self.stack:
            node["text"] += text


def walk(node):
    yield node
    for child in node["children"]:
        yield from walk(child)


def columns(template):
    # Split CSS tracks only outside parentheses; expand repeat(N,...) as N tracks.
    tracks = re.findall(r"(?:[^\s()]+|\((?:[^()]|\([^()]*\))*\))+", template)
    return sum(int(m[1]) if (m := re.match(r"repeat\(\s*(\d+)\s*,", t)) else 1 for t in tracks)


def snapshot(part, previous=None):
    root = Tree(part["html"]).root
    nodes = [n for n in walk(root) if n["attrs"].get("data-comp") not in (None, "arrow")]
    remaining = dict((previous or {}).get("blocks", {}))
    blocks = {}
    # Exact content/type matches survive moves; same-type similarity handles edited prose.
    pairs = []
    for i, n in enumerate(nodes):
        kind, text = n["attrs"]["data-comp"], re.sub(r"\s+", "", n["text"])
        if not text:
            text = "|".join(x["attrs"].get("src", "").rsplit("/", 1)[-1] for x in walk(n) if x["tag"] == "img")
        n["kind"], n["content"] = kind, text
        for key, old in remaining.items():
            if old["type"] == kind:
                pairs.append((SequenceMatcher(None, text, old["content"], autojunk=False).ratio(),
                              -abs(i - previous["order"].index(key)), -i, key))
    assigned = {}
    for _, _, neg_i, key in sorted(pairs, reverse=True):
        i = -neg_i
        if i not in assigned and key in remaining:
            assigned[i] = key; remaining.pop(key)
    for i, n in enumerate(nodes):
        key = assigned.get(i, ("new:" if previous else "") + str(i))
        n["block"] = key
        blocks[key] = dict(type=n["kind"], content=n["content"], label=re.sub(r"\s+", "", n["text"])[:40] or n["kind"])

    def members(n):
        if "block" in n:
            return [n["block"]]
        return [key for child in n["children"] for key in members(child)]

    rows, groups = [], {}
    for n in walk(root):
        attrs = n["attrs"]
        style = {k: v.strip() for k, v in re.findall(r"([\w-]+)\s*:\s*([^;]+)", attrs.get("style", ""))}
        classes = attrs.get("class", "").split()
        template = style.get("grid-template-columns", "")
        flex = style.get("display") == "flex"
        if not (template or "row" in classes or "row1" in classes or flex):
            continue
        children = [c for c in n["children"] if c["tag"] not in {"script", "style"}]
        cells = [members(c) for c in children]
        owner = n
        while "block" not in owner and "parent" in owner:
            owner = owner["parent"]
        if template and not any(cells) and "block" in owner:
            group = groups.get(owner["block"], 0); groups[owner["block"]] = group + 1
            for i, c in enumerate(children):
                key = owner["block"] + "/grid:" + str(group) + "/item:" + str(i)
                blocks[key] = dict(type=owner["kind"] + "/item", content=c["text"], label=c["text"][:40] or "图位")
                cells[i] = [key]
        if not any(cells):
            continue
        count = (1 if style.get("flex-direction", "").startswith("column") else len(cells)) if flex else columns(template) or 1
        parent = n.get("parent")
        while parent and "row_index" not in parent:
            parent = parent.get("parent")
        n["row_index"] = len(rows)
        rows.append(dict(columns=count, cells=cells, parent_row=parent["row_index"] if parent else None,
                         title=any(blocks[k]["type"] == "chapter_title" for c in cells for k in c)))
    return dict(height=part["height"], rows=rows, blocks=blocks, order=[n["block"] for n in nodes])


def compare_pages(before, after):
    old = {(s["id"], o): s[o] for s in before.get("screens", []) for o in ("h", "v") if o in s}
    new = {(s["id"], o): s[o] for s in after.get("screens", []) for o in ("h", "v") if o in s}
    changes = []
    for sid, o in sorted(old.keys() | new.keys()):
        a = snapshot(old[(sid, o)]) if (sid, o) in old else None
        b = snapshot(new[(sid, o)], a) if (sid, o) in new else None
        fields = []
        if a is None or b is None:
            fields = ["added" if a is None else "removed"]
        else:
            if a["height"] != b["height"]: fields.append("height")
            if [r["columns"] for r in a["rows"]] != [r["columns"] for r in b["rows"]]: fields.append("columns")
            if [(r["columns"], r["cells"]) for r in a["rows"]] != [(r["columns"], r["cells"]) for r in b["rows"]]: fields.append("parallel")
            if a["order"] != b["order"]: fields.append("order")
        if fields:
            def describe(s):
                if s is None: return "无此屏"
                lines = [str(s["height"]) + "px"]
                for row in s["rows"]:
                    labels = ["、".join(s["blocks"][k]["label"] for k in c) or "空" for c in row["cells"]]
                    lines.append(("内层" if row["parent_row"] is not None else "") + ("标题行" if row["title"] else "行") + str(row["columns"]) + "栏[" + " | ".join(labels) + "]")
                return "；".join(lines)
            changes.append(dict(page=after.get("page", before.get("page")), screen=sid, orientation=o,
                                changed_fields=fields, before=a, after=b, message=describe(a) + " → " + describe(b)))
    return changes


def write_layout_diff(baseline, current, names, path):
    report = dict(schema="wly.layout-diff.v1", baseline=str(baseline) if baseline else None,
                  status="compared" if baseline else "baseline_required", changed_screens=None, changes=[], errors=[], inputs=[])
    if baseline:
        for name in names:
            try:
                old = Path(baseline, name + ".json")
                if not old.is_file(): raise FileNotFoundError("基线缺页：" + name)
                a, b = old.read_bytes(), Path(current, name + ".json").read_bytes()
                report["inputs"].append(dict(page=name, baseline_sha256=hashlib.sha256(a).hexdigest(), current_sha256=hashlib.sha256(b).hexdigest()))
                report["changes"] += compare_pages(json.loads(a), json.loads(b))
            except (OSError, ValueError, KeyError) as e:
                report["errors"].append(dict(page=name, message=str(e)))
        report["changed_screens"] = len({(c["page"], c["screen"]) for c in report["changes"]})
        if report["errors"]: report["status"] = "incomplete"
    write_json(path, report)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("baseline", type=Path)
    parser.add_argument("current", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--pages", nargs="+")
    args = parser.parse_args()
    names = args.pages or sorted({p.stem for root in (args.baseline, args.current) for p in root.glob("*.json")})
    result = write_layout_diff(args.baseline, args.current, names, args.output)
    print(json.dumps({k: result[k] for k in ("status", "changed_screens", "errors")}, ensure_ascii=False))
