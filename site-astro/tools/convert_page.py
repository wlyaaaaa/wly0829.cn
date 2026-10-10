"""把 sources/pages/<页>/page.json 和 layout.json 转成 site-astro 的内容文件 src/content/pages/<页>.md。

用法：python tools/convert_page.py <页名> [<页名> ...]      （在 site-astro 目录下运行）
      python tools/convert_page.py --all                    （sources/pages 下全部有 page.json 的页）

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
import re
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

# —— 规则原文的公开副本：照现在网站发布时的公开投影（scripts/prepare-rule-public-projection.py）做同样三件事——
#    正文走 rule_original_contract.public_markdown、链接走 source_link_target、排好以后首行“一字不改”显示成“公开副本”；
#    另核对过滤表要省略的内容一条都不在，在就停，不生成。过滤表 .publish/private/rule-public-policy.json 不进仓库。
POLICY_FILE = os.environ.get("WLY_RULE_POLICY") or next((p for p in (
    os.path.join(REPO, ".publish", "private", "rule-public-policy.json"),
    "V:/Personal/Projects/wly0829.cn/.publish/private/rule-public-policy.json") if os.path.exists(p)), None)
GATE_LOG = []


def rule_gate(screen):
    if not screen.get("source"):
        return
    if not POLICY_FILE:
        raise SystemExit("规则原文需要公开过滤表 rule-public-policy.json，找不到就不生成（不绕开过滤）")
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import private_rule_policy as pol
    from pathlib import Path
    pol.POLICY_PATH = Path(POLICY_FILE)
    rel = screen["source"]["file"].replace("\\", "/").split(".publish/private/rule-sources/")[-1]
    values = pol.load_policy()["omissions"].get(rel, [])
    leaked = sum(1 for v in values if v in screen.get("text", ""))
    if leaked:
        raise SystemExit(f"{screen['id']}: 正文里还有 {leaked} 处过滤表要求省略的内容，停止生成")
    import rule_original_contract as rc
    screen["text"] = rc.public_markdown(screen.get("text", ""), rel, apply_omissions=False)
    for link in screen.get("links", []) or []:
        link["href"] = rc.source_link_target(link["href"])
    # 首行标签：构图按原文首行认块，所以文字照原样；显示时把“一字不改”换成“公开副本”（现在网站发布时也是排好以后再换）
    if "一字不改" in screen["text"].split("\n", 1)[0]:
        screen["display_replace"] = {"一字不改": "公开副本"}
    GATE_LOG.append({"screen": screen["id"], "file": rel, "policy_omissions_for_file": len(values), "leaked": 0,
                     "display_replace": screen.get("display_replace")})


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

# —— 规则原文按活动版本重出：--rules-release <规则发布目录>（例如 E:\.agents\releases\E251）——
#    用同一套摘录边界（rule_original_contract.excerpts）从这个版本的规则文件里重新取每屏原文，首行版本号换成这个版本；
#    之后照常走公开过滤和公开投影。不给这个参数就用 page.json 里固定的那一版。
RULES_RELEASE = None


def rule_release_text(page, screen):
    src = screen.get("source") or {}
    if not RULES_RELEASE or not src.get("file"):
        return None
    if not POLICY_FILE:
        raise SystemExit("按活动版本重出原文需要公开过滤表 rule-public-policy.json，找不到就不生成（不绕开过滤）")
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import private_rule_policy as pol
    from pathlib import Path
    pol.POLICY_PATH = Path(POLICY_FILE)
    import rule_original_contract as rc
    rel = src["file"].replace("\\", "/").split(".publish/private/rule-sources/")[-1]
    raw_bytes = open(os.path.join(RULES_RELEASE, *rel.split("/")), "rb").read()
    raw = raw_bytes.decode("utf-8-sig")
    version = os.path.basename(os.path.normpath(RULES_RELEASE))
    rec = os.path.join(RULES_RELEASE, "release.json")
    if os.path.exists(rec):
        r = json.load(open(rec, encoding="utf-8-sig"))
        version = r.get("release_id") or r.get("version") or version
    chosen = {ident.split("/")[-1]: text for ident, text, _ in rc.excerpts(raw, page)}
    if screen["id"] not in chosen:
        return None
    old_first = screen.get("text", "").split("\n", 1)[0]
    import re as _re
    first = _re.sub(r"E\d+", version, old_first, count=1)
    body = chosen[screen["id"]]
    if page == "charter":
        body = charter_with_headings(raw, body, rc)
    screen["text"] = first + "\n\n" + body
    src.update(release=version, sha256=hashlib.sha256(raw_bytes).hexdigest())
    # 原文里链到的公开入口模板（/rule-sources/templates/…）也按这个版本重出：同一套公开投影，写进 public/，构建时原样发布
    for tpl in ("templates/claude-home/CLAUDE.md", "templates/codex-home/AGENTS.md"):
        f = os.path.join(RULES_RELEASE, *tpl.split("/"))
        if os.path.exists(f) and tpl not in RELEASE_TEMPLATES_DONE:
            out = os.path.join(OUT_PUBLIC, "rule-sources", *tpl.split("/"))
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "w", encoding="utf-8", newline="\n").write(rc.public_markdown(open(f, encoding="utf-8-sig").read(), tpl))
            RELEASE_TEMPLATES_DONE.add(tpl)
    return (old_first, first) if first != old_first else None


def charter_with_headings(raw, body, rc):
    """约法原文屏：摘录边界（rule_original_contract.excerpts）只取条文；约法的构图按“一、怎样对我说话”这类小节标题分卡，
    所以把落在这一屏的小节标题（和标题下的说明行，链接照样公开化）按原位置插回条文前面，和现在网站的内容文件同一结构。
    条文本身（含已批准的省略）原样用摘录的结果。"""
    import re as _re
    raw = raw.replace("\r\n", "\n").replace("\r", "\n")
    sec = raw[raw.index("## 我的 AI 约法"):raw.index("## 每次都要做的几件事")]
    heads = {}
    for h in _re.finditer(r"^###\s+.+$", sec, _re.M):
        nxt = _re.search(r"^- \*\*L(\d+)\b", sec[h.end():], _re.M)
        if not nxt:
            continue
        notes = [line.strip() for line in sec[h.end():h.end() + nxt.start()].split("\n") if line.strip()]
        notes = [_re.sub(r"\]\(([^)]+)\)", lambda m: "](" + rc.source_link_target(m[1]) + ")", line) for line in notes]
        heads[int(nxt[1])] = "\n".join([h[0].strip()] + notes)
    out = []
    for part in _re.split(r"(?m)^(?=\*\*L\d+\b)", body):
        if not part.strip():
            continue
        n = int(_re.match(r"\*\*L(\d+)", part)[1])
        if n in heads:
            out.append(heads[n])
        out.append(part.strip())
    return "\n\n".join(out)


def swap_text_ref(node, old, new):
    """构图里认首行版本标签的 text_ref 跟着换成新版本号，不然区块库按 text_ref 分块时找不到这一行，标签会混进原文正文。"""
    if isinstance(node, dict):
        return {k: (new if k == "text_ref" and v == old else swap_text_ref(v, old, new)) for k, v in node.items()}
    if isinstance(node, list):
        return [swap_text_ref(x, old, new) for x in node]
    return node


RELEASE_TEMPLATES_DONE = set()


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


def status_note_before(b):
    ref = str(b.get("text_ref", ""))
    return b.get("type") == "section_heading" and (ref.startswith("数字卡片") or bool(STATUS_ASOF.match(ref)))


def status_note_after(b):
    ref = str(b.get("text_ref", ""))
    if b.get("type") not in ("prose", "notice"):
        return False
    return bool(STATUS_ASOF.match(ref)) or ref.startswith("偶尔用") or (b.get("type") == "notice" and b.get("variant") == "source_note")


TEXTISH = ("prose", "action_button", "notice", "points_card", "content_card", "bullet_list", "section_heading", "source_text_card", "quote", "dialogue", "tag", "stat_card")


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


def fit_rows(blocks):
    """横版：一行两栏、一栏是图（一幅插画，或一张截图连同下面的图注）、另一栏是文字（含数字卡）的，标上 row_fit_illustration
    （排版时图按文字栏高度定大小，见区块库 typeset_apply.js 的 fitIllustrationRows）。"""
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
        txt = [c for c in cols if c not in ill and all(b.get("type") in TEXTISH for b in c)]
        tail = [c for c in cols if len(c) >= 2 and c[-1].get("type") == "illustration" and not c[-1].get("panels") and "gallery_assets" not in c[-1]
                and all(b.get("type") in TEXTISH for b in c[:-1])]
        if len(cols) == 2 and not ill and len(tail) == 1 and all(b.get("type") in TEXTISH for c in cols if c not in tail for b in c):
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
        note = "截至 " + day(sl["as_of"]) + (f"（{str(sl['source']).strip()}）" if str(sl.get("source") or "").strip() else "")
    return items, note


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
        rest = [b for i, b in enumerate(bl) if i >= tj and i not in moved]
        row = bl[ti].get("row")
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
        for b in status:  # 状态块占整行（和截图并排的数字卡那一行照旧并排）
            if b is st_block:
                continue
            if b.get("row") in keep_rows:
                continue
            b.pop("row", None); b.pop("width", None)
        sp["blocks"] = bl[:t0] + title + status + rest
        if o == "h":
            FITTED[page] = FITTED.get(page, 0) + fit_rows(sp["blocks"])
        got.add("实时" if live else ("状态行" if st_block else "数字"))
    if got:
        STATUS_REPORT[page] = "+".join(sorted(got, reverse=True))
    return bool(got)


ABSORBED, FITTED = [], {}
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


def convert(page):
    src = os.path.join(REPO, "sources", "pages", page, "page.json")
    raw = open(src, "rb").read()
    # 页里引用的数字和链接（{{scale.total}}、{{group_counts.…}}、{{stories.…links}} 等）用区块库同一个 bound_json 算好，
    # 和现在出图时一样在这一步冻结进内容文件；数据变了重新转换这一页即可
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.content import bound_json
    from pathlib import Path
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
        swap = rule_release_text(page, s)
        rule_gate(s)
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
        if first and data.get("kind") in STATUS_KINDS and not os.environ.get("CONVERT_NO_STATUS_FIRST"):  # 设这个变量只为出“改前”对照
            status_first(page, meta, s, data.get("status_line") or STATUS_DEMO.get(page))
        first = False
        text = gallery_title(meta, s.get("text", ""))
        parts.append(f'::screen{{#{s["id"]} section="{s.get("section", "")}"}}\n\n```typeset\n'
                     + json.dumps(meta, ensure_ascii=False, indent=1) + "\n```\n\n" + text.rstrip("\n") + "\n")
        if s.get("section") and s["section"] not in [x[0] for x in sections] and not redirect:   # 去向页只有一屏，不出目录条
            sections.append((s["section"], s.get("title", "")))
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
    if names == ["--all"]:
        names = all_pages()
    failed = []
    for n in names:
        try:
            k = convert(n)
        except SystemExit:
            raise
        except Exception as e:  # 批量时一页失败不拦其它页，最后列出来
            failed.append((n, repr(e)[:200])); print(n, "转换失败", repr(e)[:200]); continue
        print(n, "转换完成", k, "屏")
    for g in GATE_LOG:
        print("  规则原文公开过滤：", json.dumps(g, ensure_ascii=False))
    if STATUS_REPORT:
        print("  首屏状态行：", json.dumps(STATUS_REPORT, ensure_ascii=False))
    if FITTED:
        print("  首屏文字+插画并排行（插画按文字高度定大小）：", json.dumps({k: v for k, v in FITTED.items() if v}, ensure_ascii=False))
    for a in ABSORBED:
        print("  标题块顺带装着的介绍段，补成单独一块留在原栏：", a)
    for h in HEALED:
        print("  构图 text_ref 只差数字，已按源里现在的写法认：", h)
    for u in UNMATCHED:
        print("  构图 text_ref 在源里找不到：", u)
    print(f"共 {len(names)} 页，失败 {len(failed)} 页")
