"""读构图规格 specs\\<页名>.json；没有规格的屏按定稿结构自动选版式。产出整屏 HTML。"""
import html
import hashlib
import importlib
import json
import os
import re

from . import assets
E = lambda x: html.escape(x or "", quote=True)
from .inline import make_inline
from .parse import canon, node_text, parse, normalize, original_markdown
from . import registry as _registry
from .content import bound_json

PROTO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC_DIR = os.path.join(os.path.dirname(os.path.dirname(PROTO)), "sources", "pages")
MIN_FONT = {"h": 22, "v": 36}
WIDTH = {"h": 1672, "v": 941}


def textless_evidence(screen, component, nodes, spec):
    """只接纳scene明确归属插画、不要另排的完整无链接散词行。"""
    if component not in ("prose", "tag"):
        return None, "textless 只支持 prose/tag 装饰标签；其他组件保留原文"
    if screen.get("shape") == "source_text" or screen.get("source_excerpt_id") or spec.get("source_prose") or spec.get("source_body"):
        return None, "textless 不能省略 source_text 或真实原文段"
    bound_fields = ("attach_to", "label_position", "label_positions", "illustration_labels", "semantic_labels",
                    "motion_text", "motion_card_refs", "asset", "base_asset", "links", "buttons", "button_context")
    if any(spec.get(k) not in (None, False, "", "none", [], {}) for k in bound_fields):
        return None, "textless 不能省略真图内绑定、链接/按钮或动效文字"
    if len(nodes) != 1 or nodes[0].get("type") != "para" or len(nodes[0].get("src", [])) != 1:
        return None, "textless 必须只分到一个完整的插画散词段，不能带走其他正文"
    node = nodes[0]
    raw = node["src"][0]
    if any(mark in raw for mark in ("〔", "〕", "【", "】", "［", "］")) or re.search(r"\[[^\]]+\]\([^)]*\)", raw) or node.get("links") or node.get("buttons"):
        return None, "textless 装饰行的 links 必须为0；原链接/按钮保留"
    scene = screen.get("scene") or ""
    for match in re.finditer(r'text\s*里(?:\s*单独一行的)?\s*[“"]([^”"\n]+)[”"]([^。]*)(?:。|$)', scene):
        sentence_start = scene.rfind("。", 0, match.start()) + 1
        sentence = scene[sentence_start:match.end()]
        plaque_label = (re.search(r"牌|标签|书脊|纸条", sentence)
                        and "这一行就是" in match[2]
                        and any(cue in match[2] for cue in ("不要另外画成一行文字", "不另排", "不另外排")))
        screen_label = ("单独一行的" in match[0] and "就是屏幕上这四个字" in match[2]
                        and "不另画别处" in match[2] and "显示器" in sentence)
        if ("插画" not in sentence or not (plaque_label or screen_label)
                or canon(normalize(match[1])) != node_text(node)):
            continue
        source_nodes = parse(screen["text"], markdown_links=original_markdown(screen))
        indices = [i for i, source_node in enumerate(source_nodes) if source_node == node]
        lines = normalize(screen["text"]).split("\n")
        line_indices = [i for i, line in enumerate(lines) if line.strip() == raw.strip()]
        if len(indices) != 1 or len(line_indices) != 1:
            return None, "textless 原散词节点/行必须在当前source中唯一；未省略原文"
        return {"component": component, "source_node_index": indices[0], "source_line_index": line_indices[0],
                "node_type": node["type"], "source_text": node["text"], "links": 0,
                "source_scene_evidence": sentence, "scene_label_text": match[1],
                "source_scene_sha256": hashlib.sha256(scene.encode("utf8")).hexdigest()}, ""
    return None, "textless 未找到当前source.scene明确归属插画且不另排的完整原词行；正文保留"


def textless_visible_source(screen, exclusions):
    """G1再依据当前source重验省略归属，按真实行号扣除，不按字符串全局替换。"""
    source_nodes = parse(screen["text"], markdown_links=original_markdown(screen))
    removed, node_indices = set(), set()
    for record in exclusions:
        index = record.get("source_node_index")
        if type(index) is not int or not 0 <= index < len(source_nodes):
            raise ValueError("textless 省略记录没有有效原节点索引")
        evidence, error = textless_evidence(screen, record.get("component"), [source_nodes[index]], {})
        if error or evidence != {k: record[k] for k in evidence}:
            raise ValueError(error or "textless 省略记录与当前source/scene不一致")
        if index in node_indices:
            raise ValueError("textless 省略记录重复")
        node_indices.add(index); removed.add(evidence["source_line_index"])
    visible_source = "\n".join(line for i, line in enumerate(normalize(screen["text"]).split("\n")) if i not in removed)
    return visible_source, [node for i, node in enumerate(source_nodes) if i not in node_indices]


class Ctx:
    def __init__(self, page, screen, orient, registry, notes, incomplete=None):
        self.page, self.screen, self.orient = page, screen, orient
        self._incomplete = incomplete if incomplete is not None else []
        self.min_font = MIN_FONT[orient]
        self.links = {l["text"]: l.get("href", "") for l in screen.get("links", []) or []}
        self.original_source = original_markdown(screen)
        for b in screen.get("buttons", []) or []:
            self.links.setdefault(b.get("text", ""), b.get("api", ""))
        self.inline = make_inline(self.links, markdown_links=self.original_source)
        self._reg = registry
        self._notes = notes
        self._icon_i = 0
        self.textless_exclusions = []
        self._textless_blocks = set()

    def icons(self):
        return [assets.url(r["path"]) for r in assets.for_screen(self.screen["id"], "icon", self.orient)]

    def illustrations(self):
        return [assets.url(r["path"]) for r in assets.for_screen(self.screen["id"], "illustration", self.orient)]

    def resolve(self, p):
        """规格里写的素材路径：绝对路径；“proto:名字” = typeset-proto\assets\名字.png；其余相对 typeset-assets。"""
        p = assets.local_path(p)
        if p.startswith("proto:"):
            p = os.path.join(PROTO, "assets", p[6:] + ("" if p.endswith(".png") else ".png"))
        elif not os.path.isabs(p):
            p = os.path.join(assets.ASSET_ROOT, p)
        if not os.path.exists(p):
            self.warn(f"规格里的素材不存在：{p}")
        return p

    def take_icons(self, n, spec=None):
        """按顺序领 n 个小图标；规格 icons 写了文件列表就用列表；不够就一个都不给（同组卡片插画方式要一致）。"""
        if spec and isinstance(spec.get("icons"), list):
            return [assets.url(self.resolve(x)) for x in spec["icons"]][:n]
        ic = self.icons()
        if self._icon_i + n <= len(ic):
            out = ic[self._icon_i:self._icon_i + n]; self._icon_i += n; return out
        return []

    def slots(self, role="icon"):
        """按原图槽位取素材：[(槽位号, 地址 或 None)]；缺的槽位是 None，不把后面的图往前挪。"""
        return [(k, assets.url(r["path"]) if r else None) for k, r in assets.slots(self.screen["id"], role, self.orient)]

    def asset_url(self, p):
        return assets.url(p)

    def hot(self, kind, key):
        return f'data-hot="{kind}" data-href="{html.escape(str(key))}"'

    def render(self, block):
        if self.consume_textless(block):
            return ""
        fn = self._reg.get(block["type"]) or self._reg.get("_fallback")
        if block["type"] not in self._reg:
            self.warn(f"没有组件 {block['type']}，用兜底排法")
            self.incomplete(f"没有组件 {block['type']}，用兜底排法", "composition")
        prior_inline = self.inline
        prior_cards = getattr(self, "motion_card_refs", [])
        if block.get("spec", {}).get("motion_text"):
            self.inline = make_inline(self.links, block["spec"]["motion_text"], markdown_links=self.original_source)
        if block.get("spec", {}).get("motion_card_refs"):
            self.motion_card_refs = block["spec"]["motion_card_refs"]
        try:
            # 栏内同行字段已由父布局消费，不交给有独立字段校验的组件族重复解释。
            component_block = block
            if any(k in block.get("spec", {}) for k in ("inline_row", "inline_width", "source_prose", "textless")):
                component_block = dict(block, spec={k: v for k, v in block["spec"].items()
                                                  if k not in ("inline_row", "inline_width", "source_prose", "textless")})
            return fn(component_block, self)
        finally:
            self.inline = prior_inline
            self.motion_card_refs = prior_cards

    def consume_textless(self, block):
        if block["type"] not in ("prose", "tag"):
            return False
        spec = block.get("spec", {})
        if "textless" not in spec or spec["textless"] is False:
            return False
        if spec["textless"] is not True:
            self.incomplete("textless 须为布尔值；原文保留", "composition")
            return False
        evidence, error = textless_evidence(self.screen, block["type"], block.get("nodes", []), spec)
        if error:
            self.incomplete(error, "composition")
            return False
        if id(block) in self._textless_blocks:
            return True
        evidence["text_ref"] = spec.get("text_ref")
        self.textless_exclusions.append(evidence)
        self._textless_blocks.add(id(block))
        return True

    def warn(self, msg):
        self._notes.append(msg)

    def incomplete(self, msg, kind="composition"):
        """记一条“未完成”：kind = asset（缺素材）/ title（毛笔标题字体兜底或 G4 没做）/ composition（构图没执行）。
        有未完成项的屏状态是 incomplete，不算通过，报告单列。"""
        item = {"kind": kind, "msg": msg}
        if item not in self._incomplete:
            self._incomplete.append(item)


# ---------- 规格 ----------
def load_spec(page_name, spec_file=None):
    p = spec_file or os.path.join(SPEC_DIR, page_name, "layout.json")
    if not os.path.exists(p):
        return {}
    data = bound_json(p)
    out = {}
    for item in data:
        out[(item["screen"], item.get("orientation", "h"))] = item
    return out


def _starts(node, ref):
    """节点开头是否就是 text_ref（编号条目允许带编号，如 “1读入口”）。"""
    raw_ref = canon(ref.split("|")[0])
    ref = canon(normalize(ref.split("|")[0]))
    nt = node_text(node)
    if ref and (nt.startswith(ref) or re.sub(r"^\d+", "", nt).startswith(ref)):
        return True
    raw = canon(node.get("raw") or "")  # 规格按带说明前缀的原文写 text_ref（如“一句话：”）时用原行比
    return bool(raw_ref and raw) and (raw.startswith(raw_ref) or re.sub(r"^\d+", "", raw).startswith(raw_ref))


LIST_TYPES = ("bullets", "steps", "stats")


def _split_items(nodes, ref):
    """text_ref 指向清单/编号/数字组中间某一条时，把这个节点在这一条前切成两个（各带自己的原文行）。"""
    r = canon(normalize(ref.split("|")[0]))
    if not r:
        return False
    for k, n in enumerate(nodes):
        if n["type"] not in LIST_TYPES or len(n.get("src", [])) != len(n["items"]):
            continue
        for i in range(1, len(n["items"])):
            t = node_text({"src": [n["src"][i]]})
            if t.startswith(r) or re.sub(r"^\d+", "", t).startswith(r):
                a = dict(n, items=n["items"][:i], src=n["src"][:i])
                b = dict(n, items=n["items"][i:], src=n["src"][i:])
                nodes[k:k + 1] = [a, b]
                return True
    return False


def assign_by_spec(nodes, spec_blocks, notes, incomplete=None):
    """按 text_ref 找每块开头，从这里到下一块开头之前的节点归这一块。
    text_ref 可以指向清单/编号/数字组里的某一条（不是第一条时，程序在这条前把组切开）。"""
    inc = incomplete if incomplete is not None else []
    nodes = list(nodes)
    for b in spec_blocks:
        ref = b.get("text_ref")
        if ref and not any(_starts(n, ref) for n in nodes):
            _split_items(nodes, ref)
    starts = []
    pos = 0
    for b in spec_blocks:
        ref = b.get("text_ref")
        if not ref:
            starts.append(None); continue
        rr = canon(ref.split("|")[0])
        if rr and any(canon(n.get("raw_lead") or "").startswith(rr) for n in nodes[pos:]):
            # 这一块的 text_ref 是一整行设计说明前缀（如“数字卡片（竖线前大字，竖线后小字）：”），按 13:50 裁定不显示：块不分字
            notes.append(f"text_ref “{ref[:12]}” 是说明前缀行，已按裁定不显示，这一块不分字")
            starts.append(None); continue
        k = next((j for j in range(pos, len(nodes)) if _starts(nodes[j], ref) and j not in starts), None)
        if k is None:
            k = next((j for j in range(len(nodes)) if _starts(nodes[j], ref) and j not in starts), None)
            if k is not None:
                notes.append(f"text_ref “{ref[:12]}” 不在顺序位置上")
        if k is None:
            notes.append(f"text_ref “{ref[:12]}” 在定稿里找不到")
            inc.append({"kind": "composition", "msg": f"{b.get('type')} 的 text_ref “{ref[:12]}” 在定稿里找不到，这一块的构图没执行（字被前一块带走或补在末尾）"})
        starts.append(k)
        if k is not None:
            pos = k + 1
    blocks = []
    order = sorted({s for s in starts if s is not None})
    for b, s in zip(spec_blocks, starts):
        blk = {"type": b["type"], "spec": b, "nodes": []}
        if s is not None:
            nxt = next((o for o in order if o > s), len(nodes))
            blk["nodes"] = nodes[s:nxt]
        blocks.append(blk)
    used = {id(n) for blk in blocks for n in blk["nodes"]}
    lost = [n for n in nodes if id(n) not in used]
    if lost:
        notes.append(f"规格没分到的定稿节点 {len(lost)} 个，补在末尾")
        inc.append({"kind": "composition", "msg": f"规格没分到的定稿节点 {len(lost)} 个，补在末尾（开头：{node_text(lost[0])[:12]}）"})
        blocks.append({"type": "prose", "spec": {"auto": True}, "nodes": lost})
    return blocks


def apply_mock_attachments(blocks, ctx):
    """组件提供拆分，父布局只把原节点移到明确唯一的目标块，不复制尾部标签。"""
    fn = ctx._reg.get("document_mock")
    pending = [b for b in blocks if b["type"] == "document_mock" and b["spec"].get("attach_to")]
    if not pending or fn is None:
        return blocks
    prepare = getattr(importlib.import_module(fn.__module__), "prepare_mock_attachments", None)
    if not callable(prepare):
        return blocks
    moved = set()
    for block in pending:
        attachment = prepare(block, ctx)
        if attachment is None:
            continue
        targets = [b for b in blocks if b is not block and b["spec"].get("id") == attachment["attach_to"]]
        children = attachment["mock_attachments"]
        child_nodes = [n for child in children for n in child["block"]["nodes"]]
        if (len(targets) != 1 or targets[0]["type"] != "content_card"
                or [id(n) for n in child_nodes] != [id(n) for n in block["nodes"]]):
            ctx.incomplete("document_mock 的 attach_to 目标不唯一、不支持，或标签分配未保全原节点；原尾块保留", "composition")
            continue
        for child in children:
            for key in ("motion_text", "motion_card_refs"):
                if key in block["spec"]:
                    child["block"]["spec"].setdefault(key, block["spec"][key])
        targets[0].setdefault("mock_attachments", []).extend(children)
        moved.add(id(block))
    return [b for b in blocks if id(b) not in moved]


# ---------- 自动选版式 ----------
def auto_blocks(nodes, screen, orient):
    blocks = []
    has_ill = bool(assets.for_screen(screen["id"], "illustration", orient))
    i = 0
    title_nodes = []
    # 开头：h1/h2，或一行很短的无标记标题（如“选哪条路”）
    if nodes and (nodes[0]["type"] in ("h1", "h2") or (nodes[0]["type"] == "para" and len(nodes[0]["text"]) <= 20
                                                     and not nodes[0]["text"].endswith(("。", "；", "：")))):
        title_nodes = [nodes[0]]; i = 1
    intro = []
    while i < len(nodes) and nodes[i]["type"] in ("para", "linkrow") and len(intro) < 3:
        intro.append(nodes[i]); i += 1
    ill_used = False
    if title_nodes and has_ill and intro and orient == "h":
        blocks.append({"type": "chapter_title", "spec": {"row": "top", "width": "47%", "align": "left"}, "nodes": title_nodes})
        blocks.append({"type": "prose", "spec": {"row": "top"}, "nodes": intro})
        blocks.append({"type": "illustration", "spec": {"row": "top", "width": "53%"}, "nodes": []})
        ill_used = True
    else:
        if title_nodes:
            blocks.append({"type": "chapter_title", "spec": {}, "nodes": title_nodes})
        if has_ill and orient == "v" and intro:
            blocks.append({"type": "illustration", "spec": {}, "nodes": []}); ill_used = True
        if intro:
            blocks.append({"type": "prose", "spec": {}, "nodes": intro})
    kind = {"stats": "stat_card", "steps": "numbered_steps", "table": "table", "legend": "status_legend",
            "linkrow": "action_button", "now": "live_strip", "code": "monospace", "h3": "section_heading",
            "group": "section_heading", "h1": "chapter_title", "h2": "chapter_title"}
    while i < len(nodes):
        n = nodes[i]
        t = n["type"]
        if t == "card":
            j = i
            while j < len(nodes) and nodes[j]["type"] == "card":
                j += 1
            blocks.append({"type": "content_card", "spec": {}, "nodes": nodes[i:j]}); i = j; continue
        if t == "bullets":
            typ = "content_card" if all(it["lead"] for it in n["items"]) else "bullet_list"
            blocks.append({"type": typ, "spec": {}, "nodes": [n]}); i += 1; continue
        if t == "para":
            blocks.append({"type": "prose", "spec": {}, "nodes": [n]}); i += 1; continue
        blocks.append({"type": kind.get(t, "prose"), "spec": {}, "nodes": [n]}); i += 1
    if has_ill and not ill_used:
        # 插画放在第一组卡片旁边不好猜，先放标题和介绍后面整宽一幅（规格可改）
        k = 1 + (1 if intro else 0) if title_nodes else 0
        blocks.insert(min(k, len(blocks)), {"type": "illustration", "spec": {"size": "banner"}, "nodes": []})
    if screen.get("screenshots"):
        blocks.append({"type": "screenshot", "spec": {}, "nodes": []})
    return blocks


# ---------- 规格字段有没有被执行 ----------
# 主程序自己消费的字段（排版行、分张、共享外框）和纯说明性字段：哪个组件都不用管
GENERIC_FIELDS = {"type", "text_ref", "row", "row_v", "width", "frame", "container", "page_break_after", "page_break_before",
                  "row_equal_height", "row_align", "row_valign", "row_width", "row_card_notes",
                  "inline_row", "inline_width",
                  "notes", "note", "comment", "id", "role", "description", "illustration_description", "auto",
                  "textless", "omit_unapproved_text", "asset_role", "container_id", "verification", "source_note", "source_prose", "motion_text", "motion_card_refs"}
NEUTRAL = (None, "", "none", "auto", False, [], {}, "default", "left")


def check_fields(b, ctx):
    """组件族导出了 SPEC_FIELDS 时，规格里写了、该组件不认的字段（取值不是 none/auto 这类中性值）记为构图未完成。"""
    t = b["type"]
    fields = _registry.SPEC_FIELDS.get(t)
    if fields is None:
        return
    fam = _registry.OWNER.get(t, "?")
    for k, v in b["spec"].items():
        if k in GENERIC_FIELDS or k in fields or v in NEUTRAL:
            continue
        if k in ("columns", "columns_v") and v == 1 and t in ("chapter_title", "illustration", "live_strip"):
            continue
        val = v if isinstance(v, (str, int, float, bool)) else type(v).__name__
        ctx.incomplete(f"{fam}.{t} 不认规格字段 {k}={str(val)[:20]}，这项构图没执行", "composition")


def build_html(page, screen, orient, registry, css_files, spec=None):
    notes, incomplete = [], []
    nodes = parse(screen["text"], markdown_links=original_markdown(screen))
    ctx = Ctx(page, screen, orient, registry, notes, incomplete)
    if spec and spec.get("blocks"):
        blocks = assign_by_spec(nodes, spec["blocks"], notes, incomplete)
        source = "spec"
    else:
        blocks = auto_blocks(nodes, screen, orient)
        source = "auto"
    blocks = apply_mock_attachments(blocks, ctx)
    parts, row, row_name = [], [], None   # parts: [(frame, html)]

    def fr(b):
        return b["spec"].get("frame") or b["spec"].get("container")

    def pct(w):
        return f"minmax(0,{float(w.rstrip('%'))}fr)" if w and str(w).endswith("%") else (w or "minmax(0,1fr)")

    def inline_rows(items):
        """同一栏/共享框里的相邻 inline_row 块横排；其余兄弟仍纵排。"""
        out, k = [], 0
        while k < len(items):
            name = items[k][0]["spec"].get("inline_row")
            j = k + 1
            while name and j < len(items) and items[j][0]["spec"].get("inline_row") == name:
                j += 1
            if name and j - k > 1:
                tmpl = " ".join(pct(b["spec"].get("inline_width")) for b, _ in items[k:j])
                out.append(f'<div class="row mid" data-inline-row="{E(str(name))}" style="grid-template-columns:{tmpl}">' +
                           "".join(f'<div class="col">{h}</div>' for _, h in items[k:j]) + "</div>")
            else:
                if name:
                    ctx.incomplete(f"inline_row={name} 在本栏只有一块，旁置构图未执行", "composition")
                out.append(items[k][1])
            k = j
        return "".join(out)

    def wrap_frames(items):
        """一栏里相邻、frame/container 同名的块装进同一张卡。items: [(block, html)] → html"""
        out, k = [], 0
        while k < len(items):
            f = fr(items[k][0])
            j = k + 1
            while j < len(items) and fr(items[j][0]) == f:
                j += 1
            hs = inline_rows(items[k:j])
            out.append(f'<div class="card frame" data-frame="{E(str(f))}">{hs}</div>' if f else hs)
            k = j
        return "".join(out)

    def flush():
        nonlocal row, row_name
        if not row:
            return
        names = {fr(b) for b, _ in row}
        frame = fr(row[0][0]) if len(names) == 1 else None   # 整行同名：整行一张卡；否则在各栏里分别包
        sp0 = {}
        for b, _ in row:  # 行级字段写在行内任一块上都算
            for k in ("row_equal_height", "row_align", "row_valign", "row_width", "row_card_notes"):
                if b["spec"].get(k) not in (None, "", False):
                    sp0.setdefault(k, b["spec"][k])
        rcls = (" eqh" if sp0.get("row_equal_height") else "") + (" mid" if sp0.get("row_valign") == "center" else "")
        if sp0.get("row_card_notes") is True:
            rcls += " card-notes"
        rst = ""
        if sp0.get("row_width"):
            rst += f"width:{E(str(sp0['row_width']))};"
        if sp0.get("row_align") in ("center", "right"):
            rst += "align-self:" + ("center" if sp0["row_align"] == "center" else "flex-end") + ";"
        if len(row) == 1:
            w = row[0][0]["spec"].get("width")
            single = inline_rows(row)
            if w or rst:  # 同 row 只有一块：照 width 占宽、靠左（不补空占位）；row_align 可居中/靠右
                parts.append((frame, f'<div class="row1" style="{f"width:{E(str(w))};" if w else ""}{rst}">{single}</div>'))
            else:
                parts.append((frame, single))
        else:
            cols = []
            # 同一 row 里连续的、没有 width 的块并进前一栏
            for b, h in row:
                if b["spec"].get("width") or not cols:
                    cols.append([b["spec"].get("width"), [(b, h)]])
                else:
                    cols[-1][1].append((b, h))
            # 百分比按比例换成 fr，免得加上栏间距后溢出
            tmpl = " ".join(pct(w) for w, _ in cols)
            inner = inline_rows if frame else wrap_frames
            parts.append((frame, f'<div class="row{rcls}" style="grid-template-columns:{tmpl};{rst}">' +
                          "".join('<div class="col"' + (f' style="--row-card-column:{i + 1}"' if sp0.get("row_card_notes") is True else "") + f'>{inner(it)}</div>' for i, (_, it) in enumerate(cols)) + "</div>"))
        row, row_name = [], None

    BREAK = '<div class="pgbreak" data-page-break="1" aria-hidden="true"></div>'
    for r in assets.manifest().get(screen["id"], []):  # 共用库的兜底叶子、语义未核实的旧裁片：报告里点到屏和槽位
        if r.get("_lib") and (not r.get("orientations") or orient in r["orientations"]):
            if r.get("fallback"):
                notes.append(f"{r['role']} 槽位 {r.get('slot_ordinal')} 用通用叶子兜底：{r.get('fallback_reason') or '未写原因'}")
            elif r.get("semantic_status") and "unresolved" in str(r["semantic_status"]):
                notes.append(f"{r['role']} 槽位 {r.get('slot_ordinal')} 是语义未核实的旧裁片（{r['semantic_status']}），构图终审要看")
    last_step = None
    for b in blocks:
        # 在任何行、栏、共享外框或分页占位建立前消费，不能留下空布局块。
        if ctx.consume_textless(b):
            continue
        active_row = b["spec"].get("row") if orient == "h" or b["spec"].get("row_v") else None
        if b["spec"].get("inline_row") and not active_row:
            ctx.incomplete("inline_row 没有本方向的父 row，旁置构图未执行", "composition")
        if b["spec"].get("inline_width") and not b["spec"].get("inline_row"):
            ctx.incomplete("inline_width 没有对应 inline_row，栏内宽度未执行", "composition")
        if fr(b):  # 只读回执：这一块确实被装进了同名共享外卡（frame/container）
            b["applied_container"] = fr(b)
        b["previous_step_end"] = last_step  # 只读：这一块之前最近一组编号的最末号（截图 after_step 核对用）
        ctx.applied_container = b.get("applied_container")  # 兼容：旧组件读 ctx.applied_container
        ctx.previous_step_end = b.get("previous_step_end")
        h = ctx.render(b)
        if b["spec"].get("source_prose") is True:
            # 只由规格明确点名真实原文；display:contents 保留已有卡片和行的构图。
            h = '<div class="source-prose" style="display:contents">' + h + '</div>'
        elif b["spec"].get("source_prose") not in (None, False):
            ctx.incomplete("source_prose 须为布尔值；原文标记未执行", "composition")
        for n in b["nodes"]:
            if n["type"] == "steps" and n["items"]:
                last_step = int(n["items"][-1]["n"]) if str(n["items"][-1]["n"]).isdigit() else last_step
        if not b["spec"].get("auto"):
            check_fields(b, ctx)
        if orient == "v" and b["spec"].get("page_break_before") is True:
            h = BREAK + h
        if orient == "v" and b["spec"].get("page_break_after") is True:
            h = h + BREAK
        rn = active_row
        if rn and rn == row_name:
            row.append((b, h)); continue
        flush()
        if rn:
            row, row_name = [(b, h)], rn
        else:
            parts.append((fr(b), h))
    flush()
    # 共享外框：相邻、frame 同名的块装进同一张卡（如“一张大卡里左插画、右正文和按钮”）
    out, k = [], 0
    while k < len(parts):
        f, h = parts[k]
        if not f:
            out.append(h); k += 1; continue
        j = k
        while j < len(parts) and parts[j][0] == f:
            j += 1
        out.append(f'<div class="card frame" data-frame="{E(str(f))}">' + "".join(x for _, x in parts[k:j]) + "</div>")
        k = j
    links = "".join(f'<link rel="stylesheet" href="{assets.url(c)}">' for c in css_files)
    # 画布：规格 aspect（如 "8:5"）给最小高度；shape=card/strip 用窄边距
    style = ""
    if spec and spec.get("aspect"):
        a, b = [float(x) for x in str(spec["aspect"]).replace("：", ":").split(":")]
        style = f' style="min-height:{round(WIDTH[orient] * b / a)}px"'
    shape = screen.get("shape") or ""
    doc = (f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">{links}</head>'
           f'<body class="o-{orient} shape-{shape}"><main id="page"{style}>{"".join(out)}</main>'
           f'<script src="{assets.url(os.path.join(PROTO, "typeset_check.js"))}"></script>'
           f'<script src="{assets.url(os.path.join(PROTO, "typeset_labels.js"))}"></script>'
           f'<script src="{assets.url(os.path.join(PROTO, "typeset_apply.js"))}"></script>'
           '<script>window.__typesetReady=(async()=>{'
           'if(document.readyState!=="complete")await new Promise(r=>window.addEventListener("load",r,{once:true}));'
           'await Promise.all([...document.images].map(i=>i.decode?i.decode().catch(()=>{}):Promise.resolve()));'
           'await document.fonts.ready;'
           'await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));'
           'return TypesetApply();})();</script>'
           '</body></html>')
    return doc, {"source": source, "notes": notes, "incomplete": incomplete,
                 "blocks": [b["type"] for b in blocks if id(b) not in ctx._textless_blocks],
                 "textless_exclusions": ctx.textless_exclusions}
