"""把 sources/pages/<页>/page.json 和 layout.json 转成 site-astro 的内容文件 src/content/pages/<页>.md。

用法：python tools/convert_page.py <页名> [<页名> ...]      （在 site-astro 目录下运行）
      python tools/convert_page.py --all                    （sources/pages 下全部有 page.json 的页）
      python tools/convert_page.py --check-all              （只校验全部页，不写文件）

第四轮做法（照现在的页面逐段对齐）：
- 现在网站每一屏的整屏图，就是共用区块库（src/typeset/components，HTML + CSS）在固定画布上排好再截的图。
  新站直接用同一套区块库在浏览器里排，所以内容文件只需要写清三样东西，不写任何坐标：
  1. 这一屏的文字（原样，就是 page.json 的 text）；
  2. 构图：用哪些区块、哪几块同一行、各占多宽（电脑 h、手机 v 两份，照 layout.json）；
  3. 每个位置用哪张图：素材库里这一屏实际用到的图标、插画、毛笔标题，路径逐条写明。
- 以后改内容只改这个 Markdown 文件，生成时由 tools/render_blocks.py 照它排版，不再查素材库映射。"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
REPO = os.path.dirname(SITE)
ASSETS = os.path.join(REPO, "sources", "assets")
OUT_MD = os.environ.get("CONVERT_OUT_MD") or os.path.join(SITE, "src", "content", "pages")
# 公开入口模板（按活动版本重出时一起写）；试跑时设了 CONVERT_OUT_MD 就写在它旁边，不碰站点
OUT_PUBLIC = os.path.join(os.environ["CONVERT_OUT_MD"], "public") if os.environ.get("CONVERT_OUT_MD") else os.path.join(SITE, "public")
TOC_LABELS = os.path.join(SITE, "src", "chrome", "toc-labels.json")
SECTION_LABEL = {"top": "开头", "usage": "怎么用", "tech": "技术", "highlights": "亮点", "features": "全部功能",
                 "history": "演进", "examples": "例子", "abilities": "能做的事", "limits": "边界",
                 "points": "要点", "original": "原文"}

# 规则只认显式刷新形成的同版公共快照，不读旧私有过滤表，不二次改写正文。
GATE_LOG = []


def rule_snapshot():
    root = Path(RULES_RELEASE) if RULES_RELEASE else Path(REPO, "sources/rules")
    pin = json.loads((root / "release.json").read_text("utf-8-sig"))
    if pin.get("schema") != "wly.astro-rules-pin.v1":
        raise ValueError("规则转换需要 sources/rules 的同版公共快照，请先刷新公共规则源")
    return root, pin


def rule_source(root, pin, source):
    rel = source["file"].replace("\\", "/").split(".publish/private/rule-sources/")[-1]
    matched = [(key, row) for key, row in pin.get("documents", {}).items() if row["relative_path"] == rel]
    if len(matched) != 1:
        raise ValueError("规则来源没有唯一的同版公共绑定：" + rel)
    key, row = matched[0]
    raw = (root / row["relative_path"]).read_bytes()
    if hashlib.sha256(raw).hexdigest() != row["public_source_sha256"]:
        raise ValueError("规则公共源字节与同版快照指纹不同：" + rel)
    return key, row, raw


def copy_public_source(source, target, expected_sha):
    """公开原件逐字节复制，同大小的新内容也按 SHA256 更新并核验。"""
    raw = source.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected_sha:
        raise ValueError("待复制的规则公共源指纹不同：" + str(source))
    if not target.exists() or hashlib.sha256(target.read_bytes()).hexdigest() != expected_sha:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        if target.stat().st_size != len(raw) or hashlib.sha256(target.read_bytes()).hexdigest() != expected_sha:
            raise ValueError("规则公共源复制后的 SHA256 不同：" + str(target))


def rule_gate(screen, page=None, check_only=False):
    if not screen.get("source"):
        return
    root, pin = rule_snapshot()
    source = screen["source"]
    key, row, raw = rule_source(root, pin, source)
    if source.get("release") != pin["version"] or source.get("sha256") != row["sha256"]:
        raise ValueError(f"{screen['id']}: 规则版本或作者源指纹与同版公共快照不同")
    if source.get("public_sha256", row["public_source_sha256"]) != row["public_source_sha256"]:
        raise ValueError(f"{screen['id']}: 规则公共源绑定不同")
    part = screen.get("source_excerpt_id") or (page + "/" + screen["id"] if page else screen["id"])
    entries = [entry for entry in row.get("parts", []) if entry["id"] == part]
    if len(entries) != 1:
        raise ValueError(f"{screen['id']}: 规则正文没有唯一的同版分段绑定")
    label, separator, body = screen.get("text", "").partition("\n")
    if not separator or label.strip() != entries[0]["label"] or pin["version"] not in label:
        raise ValueError(f"{screen['id']}: 规则原文版本标签与同版公共快照不同")
    if hashlib.sha256(body.strip().encode()).hexdigest() != entries[0]["markdown_sha256"]:
        raise ValueError(f"{screen['id']}: 规则当前正文与同版公共分段不同")
    screen["source_logical_id"] = key
    screen["source_public_sha256"] = row["public_source_sha256"]
    screen["source_rule_part"] = part
    for template in (() if check_only else pin["documents"].values()):
        if template["relative_path"].startswith("templates/"):
            source_path = root / template["relative_path"]
            for rel in (template["src"].lstrip("/"), "rule-sources/" + template["relative_path"]):
                copy_public_source(source_path, Path(OUT_PUBLIC, rel), template["public_source_sha256"])
    GATE_LOG.append({"screen": screen["id"], "file": row["relative_path"], "version": pin["version"], "source_logical_id": key, "part": part})


# —— 素材库：只认发布标记 ready、文件在的行（和现在网站出图时的读法一样）——
_lib = None
def library():
    global _lib
    if _lib is None:
        _lib = {}
        for line in open(os.path.join(ASSETS, "_library", "asset-map.jsonl"), encoding="utf-8"):
            if not line.strip():
                continue
            r = json.loads(line)
            if r.get("status") != "ready" or not r.get("asset") or not os.path.isfile(os.path.join(ASSETS, r["asset"])):
                continue
            _lib.setdefault(r["screen_id"], []).append(r)
    return _lib


IMAGE_KEYS = ("role", "slot_ordinal", "orientations", "asset", "source_image", "fallback", "fallback_reason",
              "semantic_status", "title_exact_match", "text_verified", "key", "text", "title_text",
              "source_phrase", "sha256", "status",
              # 区块库按这些认图、定位：功能组尾排插画按原物件短句（original_elements）和组名认图，标题图按原图位置定对齐和取色
              "original_elements", "group_name", "group", "source_box", "hidden", "g4_target_reference_available",
              "verified_no_text")
# 分组标题的品牌图标（构图写 "brand": "Claude" 等）：区块库按“<品牌>标志”在整个素材库里认图，这里把认到的那张也写进这一屏
BRAND_OK = ("scene_explicit_primary_object", "automatically_accepted_per_b2bc0efe")


def screen_images(sid, layout=None):
    """这一屏每个位置用的图（素材库里的原文件路径，相对 sources/assets）。
    分组图标按原 scene 短语认图（source_phrase）、品牌图标按“<品牌>标志”认图，所以这两项和文件指纹也写明。"""
    out = []
    for r in library().get(sid, []):
        out.append({k: r[k] for k in IMAGE_KEYS if k in r})
    import re as _re
    brands = sorted(set(_re.findall(r'"brand": "([^"]+)"', json.dumps(layout or {}, ensure_ascii=False))))
    seen = {(r["asset"], r.get("key")) for r in out}
    for b in brands:
        for rows in library().values():
            for r in rows:
                if (r.get("key") == b + "标志" and r.get("role") == "icon" and not r.get("fallback")
                        and r.get("semantic_status") in BRAND_OK and (r["asset"], r.get("key")) not in seen):
                    seen.add((r["asset"], r.get("key")))
                    out.append({**{k: r[k] for k in IMAGE_KEYS if k in r}, "via": "brand"})  # 不占这一屏的图位，见 render_blocks.py
    out.sort(key=lambda r: (r.get("role", ""), float(r.get("slot_ordinal") or 0), r["asset"]))
    return out


SCREEN_SKIP = ("text",)

# —— 按同版公共快照重出：--rules-release <公共快照目录>（例如 sources/rules）——
#    活动原件先由 astro_rules.refresh 冻结，再以同版完整正文的分段接口重出；不读取私有过滤表。
RULES_RELEASE = None


def rule_release_text(page, screen, screens):
    src = screen.get("source") or {}
    if not RULES_RELEASE or not src.get("file"):
        return None
    root, pin = rule_snapshot()
    key, row, raw = rule_source(root, pin, src)
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import astro_rules
    part = screen.get("source_excerpt_id") or page + "/" + screen["id"]
    chosen = astro_rules.public_parts(raw.decode("utf-8"), page, screens)
    entries = [entry for entry in row.get("parts", []) if entry["id"] == part]
    if len(entries) != 1 or part not in chosen:
        raise ValueError("规则原文没有同版公共分段：" + part)
    old_first = screen.get("text", "").split("\n", 1)[0]
    first = entries[0]["label"]
    body, selection = chosen[part]
    screen["text"] = first + "\n\n" + body
    screen["source_excerpt_id"] = part
    src.update(file=row["relative_path"], release=pin["version"], sha256=row["sha256"], public_sha256=row["public_source_sha256"], **selection)
    return (old_first, first) if first != old_first else None


def swap_text_ref(node, old, new):
    """构图里认首行版本标签的 text_ref 跟着换成新版本号，不然区块库按 text_ref 分块时找不到这一行，标签会混进原文正文。"""
    if isinstance(node, dict):
        return {k: (new if k == "text_ref" and v == old else swap_text_ref(v, old, new)) for k, v in node.items()}
    if isinstance(node, list):
        return [swap_text_ref(x, old, new) for x in node]
    return node


# —— 画廊屏的标题：项目注册表生成的“画廊”屏原来用小号的 section_heading，和别的小节（毛笔大标题）不一样；
#    统一成 chapter_title，毛笔标题图用素材库里同字的那张（“画廊”，个人媒体 04 已在用）——
def gallery_title(meta, text):
    lay = meta.get("layout") or {}
    hit = False
    for o, sp in lay.items():
        blocks = (sp or {}).get("blocks") or []
        if blocks and blocks[0].get("type") == "section_heading" and blocks[0].get("text_ref") == "画廊":
            blocks[0] = {**{k: v for k, v in blocks[0].items() if k not in ("type",)}, "type": "chapter_title", "align": "center", "size": "medium"}
            hit = True
    if not hit:
        return text
    if not any(r.get("role") == "title" for r in meta["images"]):
        for rows in library().values():
            for r in rows:
                if r.get("role") == "title" and (r.get("title_text") == "画廊" or r.get("text") == "画廊"):
                    meta["images"].append({k: r[k] for k in IMAGE_KEYS if k in r})
                    break
            if any(r.get("role") == "title" for r in meta["images"]):
                break
    lines = text.split("\n", 1)
    if lines[0].strip() == "画廊":
        text = "# 画廊" + ("\n" + lines[1] if len(lines) > 1 else "")
    return text


# —— K1-A 首屏先放状态（本人 10 月 10 日 05:29 选 A）：项目页、技能页的第 1 屏，标题下面先放状态——
#    “现在”实时条（live_strip / live_box，实时位由 live-dom.js 填；“运行”那一格读到时带上次运行时间），
#    再放首屏的数字卡（连同卡前、卡后给数字注日期和来源的那一句，见 STATUS_ASOF）；讲解、插画、清单和按钮照原顺序往后挪，一字不删。
#    只是挪现有的块：样式、颜色、字号都不变。首屏既没有实时位也没有数字卡的页不加状态行（不硬塞空行）；
#    冻结页的状态就是标题下的“已冻结”标签，数字是冻结前的历史数，不挪。
STATUS_KINDS = ("project", "skill")
STATUS_LIVE = ("live_strip", "live_box")
STATUS_REPORT = {}   # 页 → 首屏状态行里有什么（转换结束时打印）
# 数字卡的随附说明：卡前的“数字卡片……”或“截至……”标题行；卡后紧跟的那一句——数字的日期（“截至……”“数字截至……”“前三个数截至……”）、
# 来源注（notice 的 source_note，如“0.48 秒和 2 / 9 条是……合成样例跑出来的”）、现状说明（“偶尔用：只修报错……”）。
# 这几句是给数字卡注日期、注来源的，跟着数字卡一起挪；不跟着挪，日期就和数字隔开一大段（10 月 10 日 07:00 复查发现 7 页这样）
STATUS_ASOF = re.compile(r"^(数字|前三个数)?截至")
# 卡后注数字来源的那一句也可能以“按……记录”开头（个人表达：“按 9 月 15–27 日的旧使用记录，AI 调用‘讲给我听’33 次……”，10 月 10 日内容对齐时从卡里挪出来的）
STATUS_SRC = re.compile(r"^按[^，。]{0,30}(记录|统计|日志)")


def status_note_before(b):
    ref = str(b.get("text_ref", ""))
    return b.get("type") == "section_heading" and (ref.startswith("数字卡片") or bool(STATUS_ASOF.match(ref)))


def status_note_after(b):
    ref = str(b.get("text_ref", ""))
    if b.get("type") not in ("prose", "notice"):
        return False
    return bool(STATUS_ASOF.match(ref) or STATUS_SRC.match(ref)) or ref.startswith("偶尔用") or (b.get("type") == "notice" and b.get("variant") == "source_note")


TEXTISH = ("prose", "action_button", "notice", "points_card", "content_card", "bullet_list", "section_heading", "source_text_card", "quote", "dialogue", "tag", "stat_card")
# 非首屏“文字 + 图”行里文字栏还认这几种（大标题、图例、流程、时间线、编号步骤、功能卡、表格）
TEXTISH_ALL = TEXTISH + ("chapter_title", "status_legend", "flow", "timeline", "numbered_steps", "feature_card", "table")


def title_absorbed(s, bl, t0, tj):
    """标题组后面紧跟的段落要是没有自己的块（构图里漏了），区块库会把它算进标题那一块（个人健康横版就是这样）。
    返回给这些段落补的 prose 块的 text_ref（没有就 None）。"""
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.parse import parse, original_markdown, node_text
    from engine.layout import assign_by_spec, _starts
    nodes = parse(s.get("text", ""), markdown_links=original_markdown(s))
    got = assign_by_spec(nodes, [dict(b) for b in bl], [], [])
    extra = [n for g in got[t0:tj] for n in g["nodes"][1:]]
    if not extra or extra[0].get("type") != "para":
        return None
    t = node_text(extra[0])
    ref = t[:min(len(t), 12)]
    return ref if _starts(extra[0], ref) else None


def fit_rows(blocks, textish=None):
    """横版：一行两栏、一栏是图（一幅插画，或一张截图连同下面的图注）、另一栏是文字（含数字卡）的，标上 row_fit_illustration
    （排版时图按文字栏高度定大小，见区块库 typeset_apply.js 的 fitIllustrationRows）。"""
    textish = textish or TEXTISH
    n = 0
    i = 0
    while i < len(blocks):
        r = blocks[i].get("row")
        if not r:
            i += 1
            continue
        j = i
        while j < len(blocks) and blocks[j].get("row") == r:
            j += 1
        cols = []
        for b in blocks[i:j]:
            if b.get("width") or not cols:
                cols.append([b])
            else:
                cols[-1].append(b)
        ill = [c for c in cols if (len(c) == 1 and c[0].get("type") == "illustration" and not c[0].get("panels") and "gallery_assets" not in c[0])
               or (c[0].get("type") == "screenshot" and all(b.get("type") == "prose" for b in c[1:]))]
        txt = [c for c in cols if c not in ill and all(b.get("type") in textish for b in c)]
        tail = [c for c in cols if len(c) >= 2 and c[-1].get("type") == "illustration" and not c[-1].get("panels") and "gallery_assets" not in c[-1]
                and all(b.get("type") in textish for b in c[:-1])]
        if len(cols) == 2 and not ill and len(tail) == 1 and all(b.get("type") in textish for c in cols if c not in tail for b in c):
            for b in blocks[i:j]:
                b.pop("row_valign", None)
            blocks[i]["row_fit_illustration"] = True
            n += 1
        elif len(cols) == 2 and len(ill) == 1 and len(txt) == 1:
            for b in blocks[i:j]:
                b.pop("row_valign", None)
            blocks[i]["row_fit_illustration"] = True
            n += 1
        i = j
    return n


def block_text_len(s, bl):
    """每一块分到多少字（区块库同样的分块办法）：{id(块): 字数}。"""
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.parse import parse, original_markdown, node_text
    from engine.layout import assign_by_spec
    nodes = parse(s.get("text", ""), markdown_links=original_markdown(s))
    got = assign_by_spec(nodes, [dict(b) for b in bl], [], [])
    return {id(b): sum(len(node_text(n)) for n in g["nodes"]) for b, g in zip(bl, got)}, {id(b): g["nodes"] for b, g in zip(bl, got)}


def fit_text_rows(blocks, lens):
    """横版的输入卡和步骤按真实正文量选并排/上下；不改原文或同栏后续块归属。"""
    from engine.layout import row_widths
    i = 0
    while i < len(blocks):
        name = blocks[i].get("row")
        if not name:
            i += 1
            continue
        j = i + 1
        while j < len(blocks) and blocks[j].get("row") == name:
            j += 1
        cols = []
        for b in blocks[i:j]:
            if b.get("width") or not cols:
                cols.append([b])
            else:
                cols[-1].append(b)
        widths = row_widths([c[0].get("width") for c in cols])
        for c, width in zip(cols, widths):
            if width and not c[0].get("width"):
                c[0]["width"] = width
        if (len(cols) > 1 and any(b.get("type") == "source_text_card" for b in blocks[i:j])
                and all(b.get("type") in TEXTISH_ALL for b in blocks[i:j])
                and all(re.fullmatch(r"\d+(?:\.\d+)?%", str(w)) for w in widths)):
            sizes = [sum(lens.get(id(b), 0) for b in c) for c in cols]
            shares = [float(w[:-1]) for w in widths]
            loads = [n / max(w, 1) for n, w in zip(sizes, shares)]
            narrow = any(w < 30 and n > 160 for w, n in zip(shares, sizes))
            if narrow or max(sizes) > 600 or (max(sizes) > 240 and max(loads) > 2.5 * max(1, min(loads))):
                for b in blocks[i:j]:
                    for key in ("row", "width", "row_fit_illustration", "row_equal_height"):
                        b.pop(key, None)
        i = j


def plain_ill(b):
    return b.get("type") == "illustration" and not b.get("panels") and "gallery_assets" not in b



PAIR_SKIP_SIZES = ("banner", "large")
# 不和单独插画配一行的块：标题类，以及时间线、功能卡、表格、流程、编号步骤、对比这类长块（文字栏太高、图放不大，空得更多）
PAIR_SKIP_TYPES = ("chapter_title", "section_heading", "tag", "action_button", "timeline", "feature_card", "table", "flow", "numbered_steps", "comparison")


def pair_lone_illustrations(blocks, lens=None):
    """单独占一行、没铺满宽的插画和前面一块文字（没有就后面一块）排成“文字 + 图”一行（标 row_fit_illustration，图按文字高度定大小）。
    只动没有 row 的块；标题、分节小标题不配（配了标题会挤到一边）。返回配成的行数。"""
    n = 0
    for i, b in enumerate(blocks):
        mw = str(b.get("max_width") or "")
        if (b.get("type") == "screenshot" and not b.get("row") and len(b.get("indices") or []) == 1 and not b.get("equal_row_height")
                and re.fullmatch(r"\d+(?:\.\d+)?%", mw) and float(mw[:-1]) <= 60):
            # 单独一张限宽截图：和后面的图注段（没有就前面一块文字）排成一行，截图在左
            cand = next((j for j in (i + 1, i - 1) if 0 <= j < len(blocks) and not blocks[j].get("row")
                         and blocks[j].get("type") in TEXTISH_ALL and blocks[j].get("type") not in ("chapter_title", "section_heading", "tag", "action_button")), None)
            if cand is None:
                continue
            t, name = blocks[cand], f"lone-shot-{i}"
            if cand < i:
                blocks[i], blocks[cand] = t, b
            b["row"], t["row"], b["width"], t["width"] = name, name, "55%", "45%"
            b.pop("max_width", None)
            n += 1
    lens = lens or {}
    i = 0
    while i < len(blocks):
        b = blocks[i]
        i += 1
        if b.get("row") or not plain_ill(b) or b.get("bleed") or b.get("panels"):
            continue
        big = b.get("size") in PAIR_SKIP_SIZES
        if big:
            # A 横幅紧挨着一行（最多两栏、全是文字）：并进那一行当最右一栏
            done = False
            for j in (i, i - 2):
                if 0 <= j < len(blocks) and blocks[j].get("row") and not done:
                    r = blocks[j]["row"]
                    mem = [k for k, x in enumerate(blocks) if x.get("row") == r]
                    ncol = 1 + sum(1 for k in mem[1:] if blocks[k].get("width"))
                    if ncol <= 2 and mem == list(range(mem[0], mem[-1] + 1)) and all(blocks[k].get("type") in TEXTISH_ALL for k in mem):
                        blocks.remove(b)
                        last = max(k for k, x in enumerate(blocks) if x.get("row") == r)
                        blocks.insert(last + 1, b)
                        b["row"], b["width"] = r, "30%"
                        for k in ("size", "target_width", "target_height", "align"):
                            b.pop(k, None)
                        n += 1
                        done = True
                        i = 0
            if done:
                continue
        i0 = blocks.index(b)
        prev = blocks[i0 - 1] if i0 else None
        if (prev and prev.get("row") and prev.get("type") in TEXTISH_ALL and not big
                and not (i0 + 1 < len(blocks) and blocks[i0 + 1].get("row") == prev["row"])):
            # 紧跟在某一行最后一栏的文字后面：并进那一栏，排在文字下面
            b["row"] = prev["row"]
            b.pop("width", None)
            for k in ("size", "target_width", "target_height", "align"):
                b.pop(k, None)
            n += 1
            continue
        cand = None
        for j in (i0 - 1, i0 + 1):
            if 0 <= j < len(blocks):
                t = blocks[j]
                if (not t.get("row") and t.get("type") in TEXTISH_ALL and t.get("type") not in PAIR_SKIP_TYPES
                        and (not big or lens.get(id(t), 0) >= 40)):
                    cand = j
                    break
        if cand is None:
            continue
        name = f"lone-ill-{i0}"
        t = blocks[cand]
        t["row"], b["row"] = name, name
        if cand < i0:
            t["width"], b["width"] = "60%", "40%"
        else:   # 图在前、文字在后：图仍放右边（换顺序）
            blocks[i0], blocks[cand] = t, b
            t["width"], b["width"] = "60%", "40%"
        for k in ("size", "target_width", "target_height", "align"):
            b.pop(k, None)
        t["row_fit_illustration"] = True
        n += 1
    return n


def even_rows(n, c):
    """n 个气泡排 c 列、最后一排不满时：排数不变，平均分到各排（前几排多一个），每排排满。"""
    rows = -(-n // c)
    base, extra = divmod(n, rows)
    return [base + 1] * extra + [base] * (rows - extra)


def dialogue_turns(nodes, spec):
    """对话块里气泡的条数，和气泡是不是连成一段（区块库 comp-text _dialogue_items 同样的认法）；认不准返回 None。"""
    kinds = []
    for n in nodes:
        t = n.get("type")
        if t in ("group", "h1", "h2", "h3"):
            kinds.append(False)
        elif t == "para" and not kinds and spec.get("split_items") and len(str(n.get("text") or "")) <= 24 and str(n.get("text") or "").rstrip().endswith((":", "：")):
            kinds.append(False)
        elif t == "bullets" and spec.get("split_items"):
            kinds += [True] * len(n.get("items") or [])
        elif t == "para" and spec.get("split_paras"):
            kinds += [True] * len([x for x in str(n.get("text") or "").splitlines() if x.strip()])
        else:
            kinds.append(False)
    runs = sum(1 for i, k in enumerate(kinds) if k and (i == 0 or not kinds[i - 1]))
    return sum(kinds) if runs == 1 else None


def fill_dialogue_rows(page, sp, s, bl):
    """F2：首屏横版里多列对话框，气泡数不是列数整数倍的，按 row_counts 平均分到各排（每排排满，不留空格）。"""
    _, nodes = block_text_len(s, bl)
    for b in sp["blocks"]:
        if b.get("type") != "dialogue" or not (b.get("split_items") or b.get("split_paras")) or b.get("row_counts") or b.get("last_full_width"):
            continue
        try:
            c = int(b.get("columns", 1))
        except (TypeError, ValueError):
            continue
        n = dialogue_turns(nodes.get(id(b)) or [], b) if c >= 2 else None
        if not n or n % c == 0 or n < c:
            continue
        b["row_counts"] = even_rows(n, c)
        b.pop("flow", None); b.pop("rows", None)
        DIALOGUE_ROWS.append(f"{page}：{n} 条 {c} 列 → 每排 {b['row_counts']}")


STATUS_STATE = {"在用": "ok", "常用": "ok", "偶尔用": "ok", "待验收": "waiting", "待实施": "waiting", "已停用": "disabled", "已冻结": "disabled"}


def status_items(sl):
    """page.json 顶层 status_line（主持 10 月 10 日 08:00 定的字段，见 status-line-schema.md）→ 首屏状态行：
    第一项“状态 · 上次……”，后面每条事实一项（最多 2 条）；下面一行小字“截至……（来源）”。查不到的项省略，不编。"""
    if not isinstance(sl, dict) or not sl.get("state"):
        return [], ""
    yr = str(sl.get("as_of") or "")[:4]

    def day(v):
        m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?", str(v or ""))
        if not m:
            return ""
        y, mo, d, hh, mm = m.groups()
        return (f"{y} 年 " if y != yr else "") + f"{int(mo)} 月 {int(d)} 日" + (f" {int(hh):02d}:{mm}" if hh else "")

    first = str(sl["state"]).strip()
    last = sl.get("last") if isinstance(sl.get("last"), dict) else {}
    if last.get("at") and day(last["at"]):
        first += " · " + (str(last.get("label") or "上次运行").strip()) + " " + day(last["at"])
    items = [{"text": first, "state": STATUS_STATE.get(str(sl["state"]).strip(), "ok")}]
    items += [{"text": str(f).strip(), "state": "fact"} for f in (sl.get("facts") or [])[:2] if str(f).strip()]  # 事实项：中性圆点
    note = ""
    if day(sl.get("as_of")):
        # 来源常自带括号（“AI 使用小记录（记到 10 月 8 日）”），用“ · ”隔开，不套两层括号
        note = "截至 " + day(sl["as_of"]) + (f" · {str(sl['source']).strip()}" if str(sl.get("source") or "").strip() else "")
    return items, note


SAME_DAY_NOTE = re.compile(r"^(?:数字|前三个数)?截至(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日(?:（北京时间）)?。?$")


def same_day_note(text, as_of):
    """数字卡下面只写日期的那一句，日期和状态行的截至日期是同一天：True。"""
    m = SAME_DAY_NOTE.match(text or "")
    a = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})", str(as_of or ""))
    if not m or not a:
        return False
    y, mo, d = m.groups()
    return (y is None or y == a.group(1)) and int(mo) == int(a.group(2)) and int(d) == int(a.group(3))


def status_first(page, meta, s=None, status_line=None):
    got = set()
    for o, sp in (meta.get("layout") or {}).items():
        bl = list((sp or {}).get("blocks") or [])
        ti = next((i for i, b in enumerate(bl) if b.get("type") == "chapter_title"), None)
        if ti is None:
            continue
        # 标题组：大标题（连同和它用 inline_row 并排的品牌小图标），加紧跟着的标签（tag）和加粗大字的副标题
        il = bl[ti].get("inline_row")
        t0 = ti
        while il and t0 > 0 and bl[t0 - 1].get("inline_row") == il:
            t0 -= 1
        tj = ti + 1
        while tj < len(bl) and ((il and bl[tj].get("inline_row") == il) or bl[tj].get("type") == "tag" or (
                bl[tj].get("type") == "prose" and bl[tj].get("bold") and bl[tj].get("size") == "large")):
            tj += 1
        live = [i for i in range(tj, len(bl)) if bl[i].get("type") in STATUS_LIVE]
        stats = []
        for i in range(tj, len(bl)):
            if bl[i].get("type") != "stat_card":
                continue
            if i - 1 >= tj and status_note_before(bl[i - 1]):
                stats.append(i - 1)
            stats.append(i)
            if i + 1 < len(bl) and status_note_after(bl[i + 1]):
                stats.append(i + 1)
        st_block = None   # 没有实时条的页：page.json 的 status_line 排成一条静态“现在”条，放在数字卡前面（有实时条的页实时条优先）
        if not live and status_line:
            items, note = status_items(status_line)
            if items:
                st_block = {"type": "live_strip", "frame_mode": "plain", "static_items": items, **({"static_note": note} if note else {})}
        if not live and not stats and not st_block:
            continue
        dropped = set()
        if st_block is not None and s:  # 数字卡下面只写日期、和状态行同一天的那一句不再单独显示（主持 09:33）
            _, nodes_by = block_text_len(s, bl)   # （顺带把区块库加进 sys.path）
            from engine.parse import node_text
            for i in stats:
                if bl[i].get("type") != "stat_card" and same_day_note("".join(node_text(n) for n in nodes_by.get(id(bl[i])) or []), status_line.get("as_of")):
                    dropped.add(i)
                    DROP_NOTES.setdefault(id(s), set()).update(node_text(n) for n in nodes_by.get(id(bl[i])) or [])
            stats = [i for i in stats if i not in dropped]
        # 数字卡和截图/插画并排成一行（Typora 薄荷主题：截图 60% + 数字卡 40%）：整行一起挪到标题下，保持原来的并排，
        # 不把截图单独留在下面（单独留下就是一张 60% 宽的图、右边空一大块）
        keep_rows = set()
        for i in stats:
            r = bl[i].get("row")
            if r and bl[i].get("type") == "stat_card":
                others = [b for k, b in enumerate(bl) if k >= tj and b.get("row") == r and k != i]
                if others and all(b.get("type") in ("screenshot", "illustration") for b in others):
                    keep_rows.add(r)
        stat_set = set(stats) | {k for k in range(tj, len(bl)) if bl[k].get("row") in keep_rows}
        moved = live + sorted(k for k in stat_set if k not in live)
        title, status = bl[t0:tj], ([st_block] if st_block else []) + [bl[i] for i in moved]
        rest = [b for i, b in enumerate(bl) if i >= tj and i not in moved and i not in dropped]
        row = bl[ti].get("row")
        if o == "h" and row and any(b.get("row") == row for b in rest) and not os.environ.get("CONVERT_K1A_HEAD_ROW"):
            # 主持 10 月 10 日 11:52（本人对照旧站）：插画回到标题右边（右上角），状态块放在左栏标题下面，数字卡和其余往下排
            st_list = ([st_block] if st_block else []) + [bl[i] for i in live]
            for b in st_list:
                b.pop("width", None)
                b["row"] = row
            bl[ti]["align"] = "left"
            hero = [b for b in rest if b.get("row") == row]
            others = [b for b in rest if b.get("row") != row]
            below = [bl[i] for i in moved if i not in live]
            for b in below:
                if b.get("row") not in keep_rows:
                    b.pop("row", None); b.pop("width", None)
            sp["blocks"] = bl[:t0] + title + st_list + hero + below + others
            HERO_ROW.append(page)
            FITTED[page] = FITTED.get(page, 0) + fit_rows(sp["blocks"])
            if s:
                fill_dialogue_rows(page, sp, s, bl)
            got.add("实时" if live else ("状态行" if st_block else "数字"))
            continue
        if row:  # 标题组从并排的那一行里拿出来占整行；原来标题那一栏的宽度交给这一行剩下的第一块，左右比例不变
            w = next((b.get("width") for b in title if b.get("width")), None)
            add_ref = title_absorbed(s, bl, t0, tj) if s else None
            for b in title:
                b.pop("row", None); b.pop("width", None)
                if il and b.get("inline_row") == il:   # 品牌小图标和标题照旧并排：只装这几块的一行（inline_row 要在行里才排得出来）
                    b["row"] = "k1a-title"
            # 标题原来在并排行的左栏（看着靠左）：挪出来占整行后照原样靠左，不居中（主持 10 月 10 日 07:18）
            bl[ti]["align"] = "left"
            if add_ref:  # 标题那一块原来顺带装着的介绍段：补一块 prose 留在原来的栏里，跟插画并排，不跟着标题挪到状态上面
                k = next((x for x, b in enumerate(rest) if b.get("row") == row), 0)
                rest.insert(k, {"type": "prose", "text_ref": add_ref, "row": row, **({"width": w} if w else {})})
                ABSORBED.append(f"{page} {o}：{add_ref}")
            nxt = next((b for b in rest if b.get("row") == row), None)
            if nxt is not None and w and not nxt.get("width"):
                nxt["width"] = w
            # 右栏插画后面原来同栏的块（对话、提示等）挪到这一行下面占整行，这一行只剩文字和插画两栏
            cols = []
            for b in (x for x in rest if x.get("row") == row):
                if b.get("width") or not cols:
                    cols.append([b])
                else:
                    cols[-1].append(b)
            if len(cols) >= 2 and cols[-1][0].get("type") == "illustration":
                for b in cols[-1][1:]:
                    b.pop("row", None); b.pop("width", None)
        if o == "h" and st_block is not None:
            # 电脑版：静态状态行放在标题右边，不另起一行（主持 10 月 10 日 08:00 状态行说明：“状态行和标题、数字卡排在一起，不另起一块空白”）。
            # 标题组一栏按标题自身宽度（最多 60%），状态行一栏占其余，几项上下排（base.css 的 .row .status-static）；手机照旧上下排
            for b in title:
                b.pop("width", None)
                b.pop("row_fit_illustration", None)   # 原来那一行的行级标记不跟着标题走（看驾驶舱技能页标在标题块上）
                b["row"] = "k1a-head"
            title[0]["width"] = "fit-content(60%)"
            bl[ti]["align"] = "left"   # 标题在左栏照原样靠左（主持 07:18：首屏标题统一照原页面靠左）
            st_block["row"], st_block["width"] = "k1a-head", "minmax(0,1fr)"
            # F1 插画挪到标题行最右一栏（高度跟标题、状态行一样，typeset_apply.js fitHeadIllustration）：原来和标题同一行的插画，
            # 标题挪走以后旁边只剩一句短话（技能名那一行，≤60 字）或什么都不剩；或整屏只有一幅单独占一行的小插画（两边空着）。
            # 不然那一行就是“一句话 + 一幅图”，中间空一大块（10 月 10 日 09:05 扫描：讲给我听、修乱码、中文语音转写等）
            lens = block_text_len(s, bl)[0] if s else {}
            head_ill = None
            if row:
                rem = [b for b in rest if b.get("row") == row]
                ills = [b for b in rem if plain_ill(b)]
                txt = [b for b in rem if b not in ills]
                if len(ills) == 1 and all(b.get("type") == "prose" for b in txt) and sum(lens.get(id(b), 999) for b in txt) <= 60:
                    head_ill = ills[0]
                    for b in txt:
                        b.pop("row", None); b.pop("width", None); b.pop("row_fit_illustration", None)
            if head_ill is None:
                solo = [b for b in rest if plain_ill(b) and not b.get("row") and b.get("size") == "small"]
                if len(solo) == 1:
                    head_ill = solo[0]
            if head_ill is not None:
                rest.remove(head_ill)
                for k in ("width", "size", "target_width", "target_height", "row_fit_illustration"):
                    head_ill.pop(k, None)
                head_ill.update({"row": "k1a-head", "width": "auto", "align": "right"})
                status.insert(status.index(st_block) + 1, head_ill)
                HEAD_ILL.append(page)
        for b in status:  # 状态块占整行（和截图并排的数字卡那一行照旧并排）
            if b is st_block or b.get("row") == "k1a-head":
                continue
            if b.get("row") in keep_rows:
                continue
            b.pop("row", None); b.pop("width", None)
        sp["blocks"] = bl[:t0] + title + status + rest
        if o == "h":
            FITTED[page] = FITTED.get(page, 0) + fit_rows(sp["blocks"])
            if s:
                fill_dialogue_rows(page, sp, s, bl)
        got.add("实时" if live else ("状态行" if st_block else "数字"))
    if got:
        STATUS_REPORT[page] = "+".join(sorted(got, reverse=True))
    gone = DROP_NOTES.pop(id(s), None) if s else None
    if gone:  # 正文里拿掉这几段（只拿整段就是这句日期的行），h、v 两份构图都已去掉对应的块
        from engine.parse import canon, normalize
        keep = [ln for ln in s["text"].split("\n") if not (ln.strip() and canon(normalize(ln)) in gone)]
        s["text"] = re.sub(r"\n{3,}", "\n\n", "\n".join(keep))
        SAME_DAY.append(f"{page}：{'、'.join(sorted(gone))}")
    return bool(got)


ABSORBED, FITTED, HEAD_ILL, DIALOGUE_ROWS, SAME_DAY, DROP_NOTES = [], {}, [], [], [], {}
LONE, FITTED_ALL = {}, {}
HERO_ROW = []
# 演示用临时状态行（不进仓库）：CONVERT_STATUS_LINE_DEMO=<json 文件，{页: status_line}>
STATUS_DEMO = json.load(open(os.environ["CONVERT_STATUS_LINE_DEMO"], encoding="utf-8")) if os.environ.get("CONVERT_STATUS_LINE_DEMO") else {}


# —— 构图里写死数字的 text_ref：内容组刷新数字以后（例如“125个自动任务”变成“127 个自动任务”），区块库按 text_ref 认不出这一块，
#    这一块的字会被前一块带走（数字卡跑进正文那一栏）。只差数字时，text_ref 换成源里现在的写法；别的认不出的列出来 ——
HEALED, UNMATCHED = [], []


def heal_text_refs(s, meta):
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.parse import parse, original_markdown, canon, normalize, node_text
    from engine.layout import _starts, LIST_TYPES
    nodes = parse(s.get("text", ""), markdown_links=original_markdown(s))
    texts = []
    for n in nodes:
        texts.append(node_text(n))
        if n["type"] in LIST_TYPES and len(n.get("src", [])) == len(n.get("items", [])):
            texts += [node_text({"src": [n["src"][i]]}) for i in range(1, len(n["items"]))]
    digits = lambda x: re.sub(r"\d[\d,.]*", "#", x)
    for o, sp in (meta.get("layout") or {}).items():
        for b in (sp or {}).get("blocks") or []:
            ref = b.get("text_ref")
            if not isinstance(ref, str) or not ref.strip():
                continue
            head = ref.split("|")[0]
            r = canon(normalize(head))
            if not r or any(_starts(n, ref) for n in nodes) or any(t.startswith(r) or re.sub(r"^\d+", "", t).startswith(r) for t in texts):
                continue
            if any(canon(n.get("raw_lead") or "").startswith(canon(head)) for n in nodes):
                continue  # 指向说明前缀行（如“数字卡片（竖线前大字……）：”），区块库按裁定不显示这一行，不算认不出
            want, cands = digits(r), set()
            if want != r:  # text_ref 里有数字才按“只差数字”认
                for t in texts:
                    k = next((k for k in range(1, min(len(t), len(r) + 12) + 1) if digits(t[:k]) == want), None)
                    if k:
                        cands.add(t[:k])
            if len(cands) == 1:
                new = cands.pop()
                HEALED.append(f"{s['id']} {o}：{head} → {new}")
                b["text_ref"] = new + ref[len(head):]
            else:
                UNMATCHED.append(f"{s['id']} {o}：{head}")


# —— 退役技能的去向页（kind=skill-redirect）：共用一个简单版式，不逐页构图（主持 10 月 10 日 08:06 改成和全站一样）——
#    电脑上一行两栏：左栏毛笔大标题（没有同字标题图，排版时用行楷字截图）和那一句话（〔〕里的词按 links 变成能点的链接），
#    右栏一张小图标（素材库已有的“工具箱进回收站”），按文字高度定大小；手机上标题、图标、那句话从上到下。卡片按内容高，不留大块空；不收录（noindex）。
REDIRECT_ICON = "_library/icons/工具箱回收站.png"


def redirect_layout(s, title):
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.parse import parse, original_markdown, node_text
    nodes = parse(s.get("text", ""), markdown_links=original_markdown(s))
    ref = next((node_text(n)[:10] for n in nodes[1:] if n.get("type") == "para" and node_text(n)), None)
    h = [{"type": "chapter_title", "text_ref": title, "align": "left", "size": "large", "row": "go", "width": "70%", "row_fit_illustration": True}]
    v = [{"type": "chapter_title", "text_ref": title, "align": "center", "size": "large"},
         {"type": "illustration", "asset": REDIRECT_ICON, "align": "center", "size": "medium"}]
    if ref:
        h.append({"type": "prose", "text_ref": ref, "row": "go"})
        v.append({"type": "prose", "text_ref": ref})
    h.append({"type": "illustration", "asset": REDIRECT_ICON, "align": "center", "row": "go", "width": "30%"})
    return {"h": {"blocks": h}, "v": {"blocks": v}}


def convert(page, check_only=False):
    src = os.path.join(REPO, "sources", "pages", page, "page.json")
    raw = open(src, "rb").read()
    # 页里引用的数字和链接（{{scale.total}}、{{group_counts.…}}、{{stories.…links}} 等）用区块库同一个 bound_json 算好，
    # 和现在出图时一样在这一步冻结进内容文件；数据变了重新转换这一页即可
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.content import bound_json
    from engine.card_rows import fit_card_rows
    from engine.layout import assign_by_spec
    from engine.parse import parse, original_markdown
    from render_blocks import check_screen_images
    data = bound_json(src, read=lambda p: Path(p).read_text("utf-8-sig"))
    specs = {}
    lay_p = os.path.join(REPO, "sources", "pages", page, "layout.json")
    if os.path.exists(lay_p):
        for it in bound_json(lay_p, read=lambda p: Path(p).read_text("utf-8-sig")):  # 构图里的 text_ref 也按同样的数字展开（区块库 layout.py 同样用 bound_json 读）
            specs[(it["screen"], it.get("orientation", "h"))] = {k: v for k, v in it.items()
                                                                 if k not in ("screen", "orientation", "source_image", "source_images", "composition_basis")}
    parts, sections = [], []
    redirect = data.get("kind") == "skill-redirect"
    first = True
    for s in data["screens"]:
        if s.get("hidden"):
            continue
        s = json.loads(json.dumps(s))
        t = s.get("text")
        if isinstance(t, str) and "\n" not in t and "\\n" in t:
            # 源里整屏的换行被写成了字面的 \n（一整段连成一行，区块库认不出标题和要点，例如能力运行第 6 屏）：还原成换行
            print(f"  {s['id']}: 源文字里的换行写成了字面的 \\n，已还原（源文件也该改）")
            s["text"] = t.replace("\\n", "\n")
        swap = rule_release_text(page, s, data["screens"])
        rule_gate(s, page, check_only)
        bad = [x for x in (s.get("links") or []) if not isinstance(x, dict)]
        if bad:  # 链接字段不是链接列表（例如模板占位符没展开、被拆成单字）：按没有链接处理，提示出来
            print(f"  {s['id']}: links 不是链接列表（{''.join(map(str, bad))[:60]}），按没有链接处理")
            s["links"] = [x for x in s["links"] if isinstance(x, dict)]
        meta = {"screen": {k: v for k, v in s.items() if k not in SCREEN_SKIP},
                "layout": {o: specs[(s["id"], o)] for o in ("h", "v") if (s["id"], o) in specs},
                "images": screen_images(s["id"], {o: specs[(s["id"], o)] for o in ("h", "v") if (s["id"], o) in specs})}
        if redirect:  # 去向页不用各页旧的构图：照共用版式排（见 redirect_layout）
            meta["layout"], meta["images"] = redirect_layout(s, data["title"]), []
        if swap:  # 按活动版本重出时，构图里认首行标签的 text_ref 跟着换
            meta["layout"] = swap_text_ref(meta["layout"], *swap)
        heal_text_refs(s, meta)
        did_status = False
        if first and data.get("kind") in STATUS_KINDS and not os.environ.get("CONVERT_NO_STATUS_FIRST"):  # 设这个变量只为出“改前”对照
            did_status = status_first(page, meta, s, data.get("status_line") or STATUS_DEMO.get(page))
        first = False
        hsp = (meta.get("layout") or {}).get("h")
        if hsp and hsp.get("blocks") and not did_status and not redirect:
            fit_text_rows(hsp["blocks"], block_text_len(s, hsp["blocks"])[0])
        if hsp and hsp.get("blocks") and not redirect and not os.environ.get("CONVERT_NO_FILL_ROWS"):
            # 非首屏也不留空（主持 10 月 10 日 10:36）：单独一幅没铺满的插画和旁边的文字排成一行；“文字 + 图”行图按文字高度定大小
            if not did_status:   # 首屏已按 K1-A 排好（扫过 0 处），不再动
                LONE[page] = LONE.get(page, 0) + pair_lone_illustrations(hsp["blocks"], block_text_len(s, hsp["blocks"])[0])
                FITTED_ALL[page] = FITTED_ALL.get(page, 0) + fit_rows(hsp["blocks"], TEXTISH_ALL)
        if hsp and hsp.get("blocks"):
            fit_card_rows(data, "h", assign_by_spec(parse(s.get("text", ""), markdown_links=original_markdown(s)), hsp["blocks"], []))
        text = gallery_title(meta, s.get("text", ""))
        check_screen_images(page, data, {**s, "text": text}, meta)
        parts.append(f'::screen{{#{s["id"]} section="{s.get("section", "")}"}}\n\n```typeset\n'
                     + json.dumps(meta, ensure_ascii=False, indent=1) + "\n```\n\n" + text.rstrip("\n") + "\n")
        if s.get("section") and s["section"] not in [x[0] for x in sections] and not redirect:   # 去向页只有一屏，不出目录条
            sections.append((s["section"], s.get("title", "")))
    if check_only:
        return len(parts)
    labels = {}
    if os.path.exists(TOC_LABELS):
        labels = {t["id"]: t for t in json.load(open(TOC_LABELS, encoding="utf-8")).get(page, [])}
    toc = []
    for sec, first_title in sections:
        t = labels.get(sec)
        item = {"id": sec, "label": t["label"] if t else SECTION_LABEL.get(sec, first_title.split("：")[0])}
        if t and t.get("img"):
            item["img"] = t["img"]
        toc.append(item)
    now = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)).strftime("%Y-%m-%dT%H:%M:%S+08:00")
    fm = {
        "title": data["title"], "kind": data["kind"], "url": data["url"], "tagline": data.get("tagline", ""),
        # 改过地址的页：旧地址出一句话的去向页、站内链到旧地址的都改指现在的地址（page.json 的 old_urls）
        **({"old_urls": data["old_urls"]} if data.get("old_urls") else {}),
        "toc": toc,
        "page": {k: v for k, v in data.items() if k != "screens"},
        "source": {"page": f"sources/pages/{page}/page.json", "sha256": hashlib.sha256(raw).hexdigest(), "converted_at_beijing": now},
    }
    out = "---\n" + json.dumps(fm, ensure_ascii=False, indent=1) + "\n---\n\n" + "\n".join(parts)
    os.makedirs(OUT_MD, exist_ok=True)
    dst = os.path.join(OUT_MD, page + ".md")
    # 只差转换时间就不改写：同一份 page.json 重新转换一遍，得到的 .md 逐字节相同
    stamp = re.compile(r'"converted_at_beijing": "[^"]*"')
    if os.path.exists(dst):
        prev = open(dst, encoding="utf-8").read()
        if stamp.sub("", prev) == stamp.sub("", out):
            return len(parts)
    open(dst, "w", encoding="utf-8", newline="\n").write(out)
    return len(parts)


# 驾驶舱保留候选站原 HTML（src/pages/cockpit/index.astro，见 README“首页和驾驶舱”），不出内容页，--all 时跳过
RETAINED = {"cockpit"}


def all_pages():
    root = os.path.join(REPO, "sources", "pages")
    return sorted(d for d in os.listdir(root) if d not in RETAINED and os.path.exists(os.path.join(root, d, "page.json")))


if __name__ == "__main__":
    names = sys.argv[1:]
    if "--rules-release" in names:
        i = names.index("--rules-release")
        RULES_RELEASE = names[i + 1]
        del names[i:i + 2]
    check_only = "--check-all" in names
    if check_only:
        sys.dont_write_bytecode = True
        if names != ["--check-all"]:
            raise SystemExit("--check-all 只校验全部页，可搭配 --rules-release，不能搭配页名或 --all")
    if names in (["--all"], ["--check-all"]):
        names = all_pages()
    failed = []
    for n in names:
        try:
            k = convert(n, check_only=check_only)
        except SystemExit:
            raise
        except Exception as e:  # 批量时一页失败不拦其它页，最后列出来
            failed.append((n, str(e))); print(n, "校验失败" if check_only else "转换失败", str(e)); continue
        print(n, "校验完成" if check_only else "转换完成", k, "屏")
    for g in GATE_LOG:
        print("  规则同版公共绑定：", json.dumps(g, ensure_ascii=False))
    if STATUS_REPORT:
        print("  首屏状态行：", json.dumps(STATUS_REPORT, ensure_ascii=False))
    if FITTED:
        print("  首屏文字+插画并排行（插画按文字高度定大小）：", json.dumps({k: v for k, v in FITTED.items() if v}, ensure_ascii=False))
    for a in ABSORBED:
        print("  标题块顺带装着的介绍段，补成单独一块留在原栏：", a)
    if HEAD_ILL:
        print("  首屏插画挪到标题行最右（旁边只剩一句短话或单独一幅小图）：", " ".join(HEAD_ILL))
    for d in DIALOGUE_ROWS:
        print("  首屏对话框每排排满：", d)
    for d in SAME_DAY:
        print("  数字卡下面和状态行同一天的截至日期不再单独显示：", d)
    if HERO_ROW:
        print("  首屏插画回到标题右边、状态块在左栏标题下面：", len(set(HERO_ROW)), "页")
    if LONE:
        print("  单独一幅插画和旁边文字排成一行：", json.dumps({k: v for k, v in LONE.items() if v}, ensure_ascii=False))
    if FITTED_ALL:
        print("  非首屏图文并排行（图按文字高度定大小）：", sum(FITTED_ALL.values()), "行")
    for h in HEALED:
        print("  构图 text_ref 只差数字，已按源里现在的写法认：", h)
    for u in UNMATCHED:
        print("  构图 text_ref 在源里找不到：", u)
    print(f"共 {len(names)} 页，失败 {len(failed)} 页")
    if failed:
        raise SystemExit("内容转换未完成：" + repr(failed))
