"""定稿 text → 节点列表（格式见 COMPONENTS-API.md 第 3 节），以及 G1 用的逐字基准。"""
import re

LINK_RE = re.compile(r"〔([^〔〕]+)〕")
MD_LINK_RE = re.compile(r"\[([^\[\]\n]+)\]\(([^()\s\n]*(?:\([^()\s\n]*\)[^()\s\n]*)*)\)")
BTN_RE = re.compile(r"[【［]([^【】［］]+)[】］]")
DOT_CHARS = "●○✕"
NUM_LEAD = re.compile(r"^[0-9０-９][0-9,，.．:：~～–\-%+\s]*")


def _split_cols(s):
    return [c.strip() for c in s.split("｜")] if "｜" in s else None


# 定稿里写给画图用的说明前缀（Claude 13:50 裁定第 2 条）：行首出现时当排版记号，不显示、G1 也先去掉
PREFIX_RE = re.compile(r"^(\s*(?:#{1,3}\s+)?(?:\*\*)?)(?:大标题|副标题|小标题|标题|一句话|介绍|导语|说明|截图说明|大数字卡)[：:][ \t　]*")
CARD_PREFIX_RE = re.compile(r"^(\s*(?:\*\*)?)数字卡片(?:（([^）]*)）)?[：:][ \t　]*")


def _strip_prefix(line):
    line = re.sub(r"^(\s*(?:#{1,3}\s+)?)\*\*\*\*", r"\1", PREFIX_RE.sub(r"\1", line))  # “**说明：**正文”去前缀后不留空粗体

    def card(m):  # “数字卡片（截至 9 月 29 日）：”里有业务意义的括注（日期、截至）保留，纯画法说明去掉
        inner = m.group(2) or ""
        return m.group(1) + (inner if re.search(r"截至|\d", inner) else "")
    return CARD_PREFIX_RE.sub(card, line)


def normalize(text, strip_prefix=True):
    """定稿归一（解析和 G1 共用）：
    1. 整屏没有真换行、却写了字面 \\n 的（如 rule-capabilities-runtime-06），把字面 \\n 当换行；
    2. 转义造成的双反斜杠按单反斜杠（13:50 裁定第 5 条）；
    3. 行首的设计说明前缀（大标题：/标题：/一句话：/介绍：/导语：/说明：/截图说明：/大数字卡：/数字卡片（…）：）去掉。"""
    text = text or ""
    if "\n" not in text and "\\n" in text:
        text = text.replace("\\n", "\n")
    text = text.replace("\\\\", "\\")
    if not strip_prefix:
        return text
    return "\n".join(_strip_prefix(l) for l in text.split("\n"))


def sep_row(s):
    """项目卡数字格行：不以记号开头、按｜分格、每格恰有一个 · 分开数值和说明（如 26 个·技能｜118 次·发版）。
    只有这种行里的 · 是排版记号；粗体数字（**6 张看板 · 80 个图**）、步骤列和普通正文里的 · 都是字。"""
    s = s.strip()
    if "｜" not in s or "·" not in s or re.match(r"^(\*\*|- |\d+\.\s|\||#)", s):
        return False
    cells = [c.strip() for c in s.split("｜")]
    return len(cells) >= 2 and all(c.count("·") == 1 for c in cells)


# 清单/编号条目的粗体名：**名**[：]｜说明。紧跟的分隔冒号归到名字末尾（显示一次，正文不以“：”起头）
LEAD_RE = re.compile(r"^\*\*(.+?)\*\*([：:])?[\s　]*(?:｜[\s　]*)?(.*)$")
def lead_gap(raw, match):
    """保留粗体名与正文之间原有的空白；不把设计分格符画进原文。"""
    end = match.end(1) + 2 + len(match.group(2) or "")
    return raw[end:match.start(3)].replace("｜", "")
SLOT_SPLIT = re.compile(r"[　\t]+|\s{2,}")
NOW_RE = re.compile(r"^(?:\*\*现在\*\*|现在)[　\t]+(.*)$")


def _now(s):
    """“现在”实时条：现在　[实时项名　…]　[〔按钮〕…]，或 **现在**　…。实时项名按全角空格（或两个以上空格）分，
    名字里的普通空格保留（如“近 7 天”“基座体检（10 月 5–26 日每周一次）”）。返回 (slots, links) 或 None。"""
    m = NOW_RE.match(s)
    if not m:
        return None
    rest = m.group(1).strip()
    lm = re.search(r"((?:〔[^〔〕]+〕[\s　]*)+)$", rest)
    links = LINK_RE.findall(lm.group(1)) if lm else []
    body = rest[:lm.start()] if lm else rest
    slots = [w.strip() for w in SLOT_SPLIT.split(body) if w.strip()]
    if any(re.search(r"[〔〕【】［］｜。；！？]|^\*\*", w) for w in slots):
        return None
    if not slots and not links:
        return None
    if not s.startswith("**") and not links:
        return None  # “现在　…”不带按钮的，当普通段
    return slots, links


def original_markdown(screen):
    return screen.get("shape") == "source_text" and bool(screen.get("source_excerpt_id"))


def parse(text, markdown_links=False):
    raw_lines = normalize(text, strip_prefix=False).split("\n")  # 去前缀前的原行（text_ref 按原文写的也能定位）
    text = normalize(text)
    lines = text.split("\n")
    nodes, i = [], 0
    while i < len(lines):
        raw = lines[i]
        s = raw.strip()
        if not s:
            i += 1; continue
        if s.startswith("```"):
            lang = s[3:].strip(); j = i + 1; body = []
            while j < len(lines) and not lines[j].strip().startswith("```"):
                body.append(lines[j]); j += 1
            nodes.append({"type": "code", "lang": lang, "lines": body, "src": lines[i:j + 1]}); i = j + 1; continue
        m = re.match(r"^(#{1,3})\s+(.*)$", s)
        if m:
            nodes.append({"type": "h%d" % len(m.group(1)), "text": m.group(2), "src": [raw]}); i += 1; continue
        if s.startswith("|"):
            j = i; rows = []
            while j < len(lines) and lines[j].strip().startswith("|"):
                rows.append(lines[j].strip()); j += 1
            cells = [[c.strip() for c in r.strip("|").split("|")] for r in rows]
            header, align, body = None, None, cells
            if len(cells) > 1 and all(re.fullmatch(r":?-{2,}:?", c.replace(" ", "")) for c in cells[1] if c):
                header = cells[0]
                align = ["center" if c.startswith(":") and c.endswith(":") else "right" if c.endswith(":") else "left" for c in cells[1]]
                body = cells[2:]
            nodes.append({"type": "table", "header": header, "rows": body, "align": align, "src": rows}); i = j; continue
        if re.match(r"^\d+\.\s", s):
            j = i; items = []; src = []
            while j < len(lines) and re.match(r"^\d+\.\s", lines[j].strip()):
                t = lines[j].strip(); src.append(lines[j])
                mm = re.match(r"^(\d+)\.\s+(.*)$", t)
                n, rest = mm.group(1), mm.group(2)
                lm = LEAD_RE.match(rest)
                lead, body = (lm.group(1) + (lm.group(2) or ""), lm.group(3)) if lm else (None, rest)
                item = {"n": n, "lead": lead, "text": body, "cols": _split_cols(rest)}
                item["lead_gap"] = lead_gap(rest, lm) if lm else ""
                items.append(item)
                j += 1
            nodes.append({"type": "steps", "items": items, "src": src}); i = j; continue
        if s.startswith("- "):
            j = i; items = []; src = []
            while j < len(lines) and lines[j].strip().startswith("- "):
                t = lines[j].strip()[2:]; src.append(lines[j])
                lm = LEAD_RE.match(t)
                item = {"lead": lm.group(1) + (lm.group(2) or ""), "text": lm.group(3)} if lm else {"lead": None, "text": t}
                item["lead_gap"] = lead_gap(t, lm) if lm else ""
                items.append(item)
                j += 1
            if all(it["lead"] and NUM_LEAD.match(it["lead"]) for it in items):
                nodes.append({"type": "stats", "items": [{"num": it["lead"], "text": it["text"]} for it in items], "src": src})
            else:
                nodes.append({"type": "bullets", "items": items, "src": src})
            i = j; continue
        if re.fullmatch(r"(?:[%s]\s*[^%s　]+[\s　]*)+" % (DOT_CHARS, DOT_CHARS), s):
            items = [{"dot": m.group(1), "text": m.group(2).strip()} for m in re.finditer(r"([%s])\s*([^%s　]+)" % (DOT_CHARS, DOT_CHARS), s)]
            nodes.append({"type": "legend", "items": items, "src": [raw]}); i += 1; continue
        nw = _now(s)
        if nw:  # 现在　[实时项名…]　〔按钮〕；实时项名是留空框前的小字
            nodes.append({"type": "now", "label": "现在", "slots": nw[0], "links": nw[1], "src": [raw]}); i += 1; continue
        if s == "**现在**":  # **现在** 单独一行、下一行是实时项名（mcp-01：主机　副机　主机授权）
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            nxt = lines[j].strip() if j < len(lines) else ""
            nw = _now("**现在**　" + nxt) if nxt and "　" in nxt else None
            if nw and nw[0] and not nw[1] and all(len(w) <= 12 for w in nw[0]):
                nodes.append({"type": "now", "label": "现在", "slots": nw[0], "links": [], "src": [raw, lines[j]]}); i = j + 1; continue
        if LINK_RE.sub("", BTN_RE.sub("", s)).strip(" 　") == "" and (LINK_RE.search(s) or BTN_RE.search(s)):
            nodes.append({"type": "linkrow", "links": re.findall(r"[〔【［]([^〔〕【】［］]+)[〕】］]", s), "src": [raw]}); i += 1; continue
        m = re.fullmatch(r"\*\*(.+?)\*\*", s)
        if m:
            nodes.append({"type": "group", "name": m.group(1), "src": [raw]}); i += 1; continue
        m = re.match(r"^\*\*(.+?)\*\*(?:[\s　]*｜[\s　]*|[\s　]+)(.+)$", s)
        if m:
            nodes.append({"type": "card", "name": m.group(1), "text": m.group(2), "src": [raw]}); i += 1; continue
        m = re.match(r"^\*\*(.+?)\*\*([^｜*〔【\s　][^｜*〔【]{0,23})[\s　]*｜[\s　]*(.+)$", s)
        if m:  # **看门狗**（PowerShell）｜说明：粗体名后面紧跟括注，再｜说明——括注算名字的一部分，｜不画
            nodes.append({"type": "card", "name": m.group(1) + m.group(2), "text": m.group(3), "src": [raw]}); i += 1; continue
        nodes.append({"type": "para", "text": s, "src": [raw]}); i += 1
    ptr = 0
    for n in nodes:
        first = (n.get("src") or [None])[0]
        j = next((k for k in range(ptr, len(lines)) if lines[k] == first), None)
        if j is not None:  # 只剩说明前缀、去掉后变空的行（如“数字卡片（竖线前大字…）：”）并进下一个节点的原行
            lead = "".join(raw_lines[k] for k in range(ptr, j) if raw_lines[k].strip() and not lines[k].strip())
            n["raw"] = raw_lines[j]; ptr = j + 1
            if lead:
                n["raw_lead"] = lead
    # 连续两张以上、名称以数字开头的卡（如 **1 秒一刷**｜说明）当数字卡
    out, k = [], 0
    while k < len(nodes):
        j = k
        while j < len(nodes) and nodes[j]["type"] == "card" and NUM_LEAD.match(nodes[j]["name"]):
            j += 1
        if j - k >= 2:
            out.append({"type": "stats", "items": [{"num": c["name"], "text": c["text"]} for c in nodes[k:j]],
                        "src": [l for c in nodes[k:j] for l in c["src"]],
                        **{x: nodes[k][x] for x in ("raw", "raw_lead") if x in nodes[k]}})
            k = j
        else:
            out.append(nodes[k]); k += 1
    if markdown_links:
        for node in out:
            node["original_markdown"] = True
    return out


def canon(s):
    """去掉排版记号后的逐字文本（去空白）。"""
    s = s.replace("**", "").replace("`", "")
    s = re.sub(r"[〔〕【】［］｜]", "", s)
    s = s.replace("\\\\", "\\").replace("↓", "→")  # 双反斜杠≡单反斜杠；竖版向下箭头≡横版右箭头（13:50 裁定第 5、6 条）
    return re.sub(r"\s+", "", s.replace("　", ""))


def expected_text(text, markdown_links=False):
    out = []
    in_code = False
    for line in normalize(text).split("\n"):
        s = line.strip()
        is_sep = sep_row(s)
        if s.startswith("```"):
            in_code = not in_code
            continue
        if markdown_links and not in_code:
            # 原文保留 Markdown 链接；逐字基准只取可见标签，代码中的示例保持字面。
            codes = []
            def keep_code(match):
                codes.append(match[0])
                return "\x00" + str(len(codes) - 1) + "\x00"
            s = re.sub(r"`[^`]+`", keep_code, s)
            s = MD_LINK_RE.sub(r"\1", s)
            s = re.sub(r"\x00(\d+)\x00", lambda match: codes[int(match[1])], s)
        if re.fullmatch(r"\|?(\s*:?-{2,}:?\s*\|)+\s*:?-*:?\s*\|?", s):
            continue  # 表格分隔行
        s = re.sub(r"^#{1,3}\s+", "", s)
        s = re.sub(r"^-\s+", "", s)
        s = re.sub(r"^(\d+)\.\s+", r"\1", s)
        if s.startswith("|"):
            s = s.replace("|", "")  # 只有表格行的 | 是记号；正文里的 | 是字
        if is_sep:
            s = s.replace("·", "")  # 只有项目卡数字格行里的 · 是记号（见 sep_row）
        out.append(s)
    return canon("".join(out))


def node_text(n):
    """一个节点的逐字文本（G1 分块核对用）。"""
    return expected_text("\n".join(n.get("src", [])), markdown_links=bool(n.get("original_markdown")))
