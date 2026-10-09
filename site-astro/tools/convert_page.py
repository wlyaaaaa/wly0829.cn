"""把 sources/pages/<页>/page.json（+ layout.json 横版构图提示）转成 site-astro 的 Markdown 内容文件。

用法：python tools/convert_page.py <页名> [<页名> ...]      （在 site-astro 目录下运行）
      python tools/convert_page.py --all                    （批量：sources/pages 下全部有 page.json 的页）

做法：
1. 文字切分沿用现有排版引擎的解析（src/typeset/engine/parse.py、layout.assign_by_spec），保证分块和旧站一致；
2. 旧构图里 40 来种区块名只当“提示”，归到 8 种自动排版区块（章节头、卡片组、数字条、步骤、表格、对话、画廊、正文）；
3. 毛笔标题图、插画、图标按共用素材库 asset-map.jsonl 找原文件，逐字节复制到 public/assets/（不转码、不缩图）；
4. 写死的宽度、列数、行号全部丢掉，排版交给 CSS。"""
import datetime
import hashlib
import json
import os
import re
import shutil
import sys
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
REPO = os.path.dirname(SITE)
sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
from engine import parse as P  # noqa: E402
from engine.layout import assign_by_spec  # noqa: E402

ASSETS = os.path.join(REPO, "sources", "assets")

# —— 规则原文的公开过滤：走现有的 scripts/rule_original_contract.public_markdown 和私有过滤表，不另写一套 ——
# 过滤表 .publish/private/rule-public-policy.json 不进仓库；工作副本里没有时读主检出（可用 WLY_RULE_POLICY 指定）。
POLICY_FILE = os.environ.get("WLY_RULE_POLICY") or next((p for p in (
    os.path.join(REPO, ".publish", "private", "rule-public-policy.json"),
    "V:/Personal/Projects/wly0829.cn/.publish/private/rule-public-policy.json") if os.path.exists(p)), None)
_gate = None
def rule_gate():
    global _gate
    if _gate is None:
        if not POLICY_FILE:
            raise SystemExit("规则原文需要公开过滤表 rule-public-policy.json，找不到就不生成（不绕开过滤）")
        sys.path.insert(0, os.path.join(REPO, "scripts"))
        import private_rule_policy as pol
        from pathlib import Path
        pol.POLICY_PATH = Path(POLICY_FILE)
        import rule_original_contract as rc
        _gate = (pol, rc)
    return _gate
GATE_LOG = []


def public_rule_text(screen):
    """原文屏：确认过滤表里这份文件要省略的内容一条都不在正文里，再用现有公开投影改写链接。只记条数，不记内容。"""
    pol, rc = rule_gate()
    rel = screen["source"]["file"].replace("\\", "/")
    rel = rel.split(".publish/private/rule-sources/")[-1]
    text = screen.get("text", "")
    values = pol.load_policy()["omissions"].get(rel, [])
    leaked = sum(1 for v in values if v in text)
    if leaked:
        raise SystemExit(f"{screen['id']}: 正文里还有 {leaked} 处过滤表要求省略的内容，停止生成")
    out = rc.public_markdown(text, rel, apply_omissions=False)
    GATE_LOG.append({"screen": screen["id"], "file": rel, "policy_omissions_for_file": len(values), "leaked": 0,
                     "declared_omit": len(screen["source"].get("omit", [])), "changed_by_projection": out != text})
    return out
OUT_MD = os.path.join(SITE, "src", "content", "pages")
OUT_PUB = os.path.join(SITE, "public")
TOC_LABELS = os.path.join(SITE, "src", "chrome", "toc-labels.json")
SECTION_LABEL = {"top": "开头", "usage": "怎么用", "tech": "技术", "highlights": "亮点", "features": "全部功能",
                 "history": "演进", "examples": "例子", "abilities": "能做的事", "limits": "边界",
                 "points": "要点", "original": "原文"}

CARD_TYPES = {"content_card", "feature_card", "points_card", "project_tile", "directory_tile", "comparison", "link_grid"}
STEP_TYPES = {"flow", "numbered_steps", "timeline", "stretch_list"}
NOTE_TYPES = {"notice", "live_strip", "live_box", "status_legend"}
GALLERY_TYPES = {"screenshot", "annotation", "numbered_screenshot", "document_mock", "chart", "topology"}


# —— 素材 ——
_lib = None
def library():
    global _lib
    if _lib is None:
        _lib = {}
        for line in open(os.path.join(ASSETS, "_library", "asset-map.jsonl"), encoding="utf-8"):
            if not line.strip():
                continue
            r = json.loads(line)
            if r.get("status") != "ready" or not r.get("asset"):
                continue
            if not os.path.isfile(os.path.join(ASSETS, r["asset"])):
                continue
            _lib.setdefault(r["screen_id"], []).append(r)
        for v in _lib.values():
            v.sort(key=lambda r: (r.get("role", ""), float(r.get("slot_ordinal") or 0)))
    return _lib


def rows(sid, role):
    out = [r for r in library().get(sid, []) if r["role"] == role]
    h = [r for r in out if "h" in (r.get("orientations") or ["h"])]
    return h or out


def publish(rel):
    """原文件逐字节复制到 public/assets/<同一相对路径>，返回网址。"""
    rel = rel.replace("\\", "/")
    src = os.path.join(ASSETS, *rel.split("/"))
    dst = os.path.join(OUT_PUB, "assets", *rel.split("/"))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
        shutil.copyfile(src, dst)
    return "/assets/" + urllib.parse.quote(rel, safe="/")


def publish_ref(path_from_repo):
    rel = path_from_repo.replace(chr(92), "/")
    if rel.startswith("sources/assets/"):
        return publish(rel[len("sources/assets/"):])
    # 仓库里其它位置的原图（如 public/media/...）：原样复制到 public/assets/_repo/<同路径>
    src = os.path.join(REPO, *rel.split("/"))
    dst = os.path.join(OUT_PUB, "assets", "_repo", *rel.split("/"))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
        shutil.copyfile(src, dst)
    return "/assets/_repo/" + urllib.parse.quote(rel, safe="/")


# —— 行内文字 ——
def link_target(target):
    path, sep, frag = target.partition("#")
    norm = path.replace("\\", "/")
    name = norm.rsplit("/", 1)[-1]
    suf = "#" + frag if sep else ""
    if norm.endswith("templates/claude-home/CLAUDE.md"):
        return "/rule-sources/templates/claude-home/CLAUDE.md" + suf
    if norm.endswith("templates/codex-home/AGENTS.md"):
        return "/rule-sources/templates/codex-home/AGENTS.md" + suf
    if name == "AGENTS.md":
        return "/rules/charter/" + suf
    if re.fullmatch(r"agents\.[a-z-]+\.md", name):
        return "/rules/" + name[7:-3] + "/" + suf
    return target


def esc(s):
    s = s.replace("\\", "\\\\")
    s = re.sub(r"([_~\[\]<>$])", r"\\\1", s)
    s = re.sub(r":(?=[A-Za-z])", r"\\:", s)        # 防止 “x:abc” 被当成区块记号
    s = re.sub(r"(?<!\*)\*(?!\*)", r"\\*", s)        # 单个 * 是字；成对 ** 是粗体
    return s


def inline(s, links, md_links=False):
    if s is None:
        return ""
    parts = re.split(r"(`[^`]+`)", s)
    out = []
    for p in parts:
        if p.startswith("`") and p.endswith("`") and len(p) > 1:
            out.append(p); continue
        keep = []
        def hold(v):
            keep.append(v); return f"\x00{len(keep)-1}\x00"
        if md_links:
            p = P.MD_LINK_RE.sub(lambda m: hold(f"[{esc(m[1])}]({link_target(m[2])})"), p)
        p = P.LINK_RE.sub(lambda m: hold(f"[{esc(m[1])}]({links.get(m[1], '#')})"), p)
        p = P.BTN_RE.sub(lambda m: hold(f':btn[{esc(m[1])}]{{href="{links.get(m[1], "#")}"}}'), p)
        p = esc(p).replace("｜", "　")
        p = re.sub(r"\x00(\d+)\x00", lambda m: keep[int(m[1])], p)
        out.append(p)
    r = "".join(out)
    r = re.sub(r"\*\*(.+?)\*\*", lambda m: "<strong>" + m.group(1) + "</strong>", r)
    if re.match(r"^\s*(#|>|\+ |-{3,}|={3,}|\d+[.)]\s)", r):
        r = "\\" + r.lstrip() if not r.lstrip()[0].isdigit() else re.sub(r"^(\s*\d+)([.)])", r"\1\\\2", r)
    return r


def item_line(it, links, md):
    lead = it.get("lead")
    if lead:
        return f"<strong>{inline(lead, links, md)}</strong>{it.get('lead_gap') or ''}{inline(it.get('text'), links, md)}"
    return inline(it.get("text"), links, md)


def node_md(n, links, md=False, heading="####"):
    t = n["type"]
    if t == "para":
        return inline(n["text"], links, md)
    if t == "status":
        return f'<span class="status-tag" data-state="{state_of(n["text"]) or "on"}">{inline(n["text"], links, md)}</span>'
    if t == "group":
        return f"{heading} {inline(n['name'], links, md)}"
    if t == "card":
        return f"<strong>{inline(n['name'], links, md)}</strong>　{inline(n['text'], links, md)}"
    if t in ("h1", "h2", "h3"):
        lv = {"h1": "##", "h2": "###", "h3": "###"}[t] if md else "###"
        return f"{lv} {inline(n['text'], links, md)}"
    if t == "bullets":
        return "\n".join("- " + item_line(it, links, md) for it in n["items"])
    if t == "steps":
        return "\n".join(f"{it['n']}. " + item_line(it, links, md) for it in n["items"])
    if t == "stats":
        return "\n".join(f"- <strong>{inline(it['num'], links, md)}</strong>　{inline(it['text'], links, md)}" for it in n["items"])
    if t == "table":
        def row(cells):
            return "| " + " | ".join(inline(c, links, md).replace("|", "\\|") for c in cells) + " |"
        lines = []
        header = n.get("header")
        width = max([len(header or [])] + [len(r) for r in n["rows"]])
        if header:
            lines.append(row(header + [""] * (width - len(header))))
        else:
            lines.append(row([""] * width))
        lines.append("|" + "---|" * width)
        for r in n["rows"]:
            lines.append(row(r + [""] * (width - len(r))))
        return "\n".join(lines)
    if t == "legend":
        return "　".join(f'<span class="legend-item" data-state="{state_of(i["text"]) or "on"}"><span class="legend-dot" aria-hidden="true">{i["dot"]}</span>{inline(i["text"], links, md)}</span>' for i in n["items"])
    if t == "now":
        return inline("现在　" + "　".join(n["slots"]), links, md) + ("　" + " ".join(f':btn[{esc(l)}]{{href="{links.get(l, "#")}"}}' for l in n["links"]) if n["links"] else "")
    if t == "linkrow":
        return " ".join(f'[{esc(l)}]({links.get(l, "#")})' for l in n["links"])
    if t == "code":
        return "```" + (n.get("lang") or "") + "\n" + "\n".join(n["lines"]) + "\n```"
    return inline(P.node_text(n), links, md)


def nodes_md(nodes, links, md=False, heading="####"):
    return "\n\n".join(node_md(n, links, md, heading) for n in nodes)


def text_of(n):
    if n["type"] in ("para", "h1", "h2", "h3"):
        return n["text"]
    if n["type"] == "group":
        return n["name"]
    return P.node_text(n)


# —— 图标：素材库里标了“语义没对上、拿装饰叶子凑数”（fallback）的槽位不用，
#    改按卡片/步骤的字从图标库里挑意思对得上的；挑不到就不放图，不再用叶子凑。——
KEYWORD_ICONS = [  # (关键词正则, 素材库里的图) 先匹配标题，再匹配正文；同一组里尽量不重复
    (r"显卡|GPU|领卡|腾卡", "_library/round3/clean-assets/png/11-显卡-clean.png"),
    (r"体检|诊断|自检|健康", "_library/round3/clean-assets/png/42-听诊器检查-clean.png"),
    (r"查|核对|核验|验收|检查|比对|看结构", "_library/icons/放大镜.png"),
    (r"超时|太久|等|小时|分钟|秒|快读|速度", "_library/icons/秒表.png"),
    (r"时间|定时|每天|每周|日期|日历", "_library/icons/日历时钟.png"),
    (r"指纹|留底|快照|SHA|印章|盖章", "_library/icons/印章.png"),
    (r"拆|切|分页|拆页", "_library/icons/裁纸刀.png"),
    (r"停|取消|中断|禁止|不做|不许", "_library/icons/禁止文件.png"),
    (r"失败|出错|报错|出事|警", "_library/icons/报警灯.png"),
    (r"锁|密码|私人|私有|权限|授权", "_library/icons/钥匙.png"),
    (r"安全|保护|保险|防", "_library/icons/盾牌对勾.png"),
    (r"换电脑|环境|重建|安装|部署", "_library/icons/工具箱.png"),
    (r"备份|硬盘|存档", "_library/icons/硬盘循环.png"),
    (r"上传|推送|同步|GitHub|仓库", "_library/icons/文件夹链接.png"),
    (r"删除|回收站|清理|腾", "_library/icons/回收站文件.png"),
    (r"截图|照片|图片|相机|拍", "_library/icons/相机.png"),
    (r"交结果|交付|完成|打包|发布|结果", "_library/icons/纸箱.png"),
    (r"清单|步骤|规矩|写法|要点|待办", "_library/icons/打勾清单.png"),
    (r"想法|原则|建议|思路|亮点|巧思", "_library/icons/气泡灯泡.png"),
    (r"网页|网站|浏览器|在线|Chrome|打开", "_library/icons/浏览器标签页.png"),
    (r"语音|录音|麦克风", "_library/icons/麦克风.png"),
    (r"模型|识别|AI", "_library/icons/双模型窗口.png"),
    (r"文件|材料|文档|讲义|扫描|PDF|纸|页", "_library/icons/文稿堆.png"),
    (r"数据|数据库|记录|日志", "_library/icons/数据库.png"),
    (r"设置|配置|改|工具|生成", "_library/icons/齿轮.png"),
    (r"对话|说|答复|回答|聊天", "_library/icons/双气泡.png"),
]


def keyword_icon(title, text, used):
    for source in (title or "", text or ""):
        hits = [icon for pat, icon in KEYWORD_ICONS if re.search(pat, source) and os.path.isfile(os.path.join(ASSETS, icon))]
        fresh = [h for h in hits if h not in used]
        if fresh:
            return fresh[0]  # 同一组里不重复用同一张图；没有新的就不放（不拿重复的凑）
    return None


def cols_attr(spec, default=None, default_v=1):
    """旧构图写的列数（横版 columns / 竖版 columns_v）照搬：电脑上按它排，排不下才少列。"""
    c = spec.get("columns") or default
    v = spec.get("columns_v") or spec.get("portrait_columns") or default_v
    out = []
    if c:
        out.append(f'cols="{int(c)}"')
    if v:
        out.append(f'colsv="{int(v)}"')
    return " ".join(out)


STATE_WORDS = [("待验收", "pending"), ("待实施", "todo"), ("没用过", "unused"), ("说不准", "uncertain"), ("已停用", "off"), ("停用", "off"), ("在用", "on")]


def state_of(text):
    for w, st in STATE_WORDS:
        if w in (text or ""):
            return st
    return None


# —— 区块 ——
PAGE_ARTS = set()  # 同一页里已经放过的插画不再重复放
class Screen:
    def __init__(self, page, s, spec, first):
        self.page, self.s, self.spec, self.first = page, s, spec, first
        self.links = {l["text"]: l["href"] for l in s.get("links") or [] if l.get("text")}
        self.md = P.original_markdown(s) or s.get("shape") == "source_text"
        self.icons = [r for r in rows(s["id"], "icon")]
        self.icon_i = 0
        self.titles = rows(s["id"], "title")
        self.arts = rows(s["id"], "illustration")
        self.used_art = set()
        self.notes = []
        self.out = []
        self.motion = None
        self.spec_chapter = None

    def take_icons(self, n, texts=None):
        """按槽位顺序取图；槽位是“拿叶子凑数”的（fallback），改按这一项的字挑意思对得上的图。"""
        got, used = [], set()
        texts = texts or [("", "")] * n
        for k in range(n):
            row = self.icons[self.icon_i] if self.icon_i < len(self.icons) else None
            self.icon_i += 1
            asset = row["asset"] if row and not row.get("fallback") else None
            if asset in used:  # 同一组里槽位图重复（同一张灯泡连放三次）也按字另挑
                asset = None
            if not asset:
                asset = keyword_icon(texts[k][0], texts[k][1], used)
                if asset:
                    self.notes.append(f"图标：槽位 {self.icon_i} 原是凑数的装饰叶子，按字改用 {asset.split('/')[-1]}")
            if asset:
                used.add(asset)
            got.append(publish(asset) if asset else "")
        return got

    def art(self):
        blocks = (self.spec or {}).get("blocks", [])
        if blocks and not any(b["type"] == "illustration" for b in blocks):
            return None  # 现在这一屏没有插画（构图里没有 illustration），不额外加
        if any(b["type"] == "illustration" and b.get("size") == "small" for b in blocks) and \
                not any(b["type"] == "illustration" and b.get("size") != "small" for b in blocks):
            return None  # 现在只是标题两边的小装饰图，不当章节插画
        for r in self.arts:
            if r["asset"] not in self.used_art and r["asset"] not in PAGE_ARTS:
                self.used_art.add(r["asset"]); PAGE_ARTS.add(r["asset"]); return publish(r["asset"])
        return None

    def sub_title(self, text):
        want = P.canon(text)
        for r in self.titles[1:]:
            tt = P.canon(r.get("title_text") or r.get("source_phrase") or "")
            if tt and (tt == want or want.startswith(tt) or tt.startswith(want)):
                return publish(r["asset"])
        return None

    def emit(self, s):
        if s.strip():
            self.out.append(s.strip())

    # 章节头
    def chapter(self, nodes, lead):
        title_node = nodes[0] if nodes else None
        title = text_of(title_node) if title_node else self.s.get("title", "")
        brush = publish(self.titles[0]["asset"]) if self.titles else None
        box = ink_box(self.titles[0]["asset"]) if self.titles else None
        art = self.art()
        attrs = [f'title="{title.replace(chr(34), "＂")}"']
        if brush:
            attrs.append(f'brush="{brush}"')
            if box:
                attrs.append(f'brushbox="{",".join(map(str, box))}"')
            size = (self.spec_chapter or {}).get("size")
            if size in ("small", "medium", "large"):
                attrs.append(f'size="{size}"')
        if art:
            attrs.append(f'art="{art}"')
            # 插画占多宽、在左还是右照旧构图：同一 row 里插画排在别的块前面就靠左
            bl = (self.spec or {}).get("blocks", [])
            ill = next((b for b in bl if b["type"] == "illustration" and b.get("size") != "small"), None)
            if ill and str(ill.get("width") or "").endswith("%"):
                attrs.append(f'artw="{ill["width"]}"')
            if ill and ill.get("row"):
                same = [b for b in bl if b.get("row") == ill["row"]]
                if same and same[0] is ill and len(same) > 1:
                    attrs.append('artside="left"')
        align = (self.spec_chapter or {}).get("align") or ("left" if art else "center")
        attrs.append(f'align="{align}"')
        if self.first:
            attrs.append('level="1"')
            living = os.path.join(OUT_PUB, "_living", self.page["page"], "astro", "config.json")
            if art and os.path.exists(living):
                attrs.append(f'living="/_living/{self.page["page"]}/astro/config.json"')
            self.motion = {"screen": self.s["id"], "art": art, "brush": brush, "title": title}
        body = nodes_md(nodes[1:] + lead, self.links, self.md)
        self.emit(":::chapter{" + " ".join(attrs) + "}\n" + body + "\n:::")

    def cards(self, blocks):
        cards = []  # [(title, [nodes])]
        for b in blocks:
            nodes = b["nodes"]
            lists = [n for n in nodes if n["type"] in ("bullets", "steps")]
            if len(nodes) == 1 and lists and all(it.get("lead") for it in lists[0]["items"]) and b["type"] == "feature_card":
                for it in lists[0]["items"]:
                    num = (it.get("n") + " ") if it.get("n") else ""
                    cards.append((num + it["lead"].rstrip("：:"), [{"type": "para", "text": it["text"]}]))
                continue
            cur = None
            for n in nodes:
                if n["type"] in ("group", "h3", "h2") or (n["type"] == "card"):
                    if n["type"] == "card":
                        cards.append((n["name"], [{"type": "para", "text": n["text"]}])); cur = None; continue
                    cur = (text_of(n), []); cards.append(cur); continue
                if n["type"] == "steps" and b["type"] in ("feature_card", "content_card") and cur is None and all(not it.get("lead") and (it.get("cols") or "　" in (it.get("text") or "")) for it in n["items"]):
                    # 功能清单“名｜说明｜状态”：每条一张卡，状态单独一个小标签
                    for it in n["items"]:
                        segs = it.get("cols") or [x for x in it["text"].split("　") if x.strip()]
                        body = [{"type": "para", "text": segs[1] if len(segs) > 1 else ""}]
                        if len(segs) > 2:
                            body.append({"type": "status", "text": "　".join(segs[2:])})
                        cards.append((f"{it['n']} {segs[0]}", body))
                    continue
                if n["type"] == "steps" and b["type"] in ("feature_card", "content_card") and all(it.get("lead") for it in n["items"]) and cur is None:
                    for it in n["items"]:
                        cards.append((f"{it['n']} {it['lead']}".rstrip("：:"), [{"type": "para", "text": it["text"]}]))
                    continue
                if cur is None:
                    cur = ("", []); cards.append(cur)
                cur[1].append(n)
        if not cards:
            return
        want_icons = not any((b["spec"].get("icons") == "none") for b in blocks)
        texts = [(t, " ".join(P.node_text(n) for n in body if n.get("src")) or " ".join(n.get("text", "") for n in body)) for t, body in cards]
        icons = self.take_icons(len(cards), texts) if want_icons else [""] * len(cards)
        # 图怎么放照旧构图：content_card 的 left_inside/top_inside 是大插图，其它（功能卡、要点卡）是标题旁小图标
        spec0 = blocks[0]["spec"]
        ill = spec0.get("illustration")
        art_mode = "left" if (blocks[0]["type"] == "content_card" and ill == "left_inside") else "top" if (blocks[0]["type"] in ("content_card",) and ill == "top_inside") else "icon"
        parts = []
        for (title, body), icon in zip(cards, icons):
            head = "::card" + (f'{{icon="{icon}"}}' if icon else "")
            seg = [head]
            if title:
                seg.append("#### " + inline(title, self.links, self.md))
            if body:
                seg.append(nodes_md(body, self.links, self.md, heading="#####"))
            parts.append("\n\n".join(seg))
        default_cols = 3 if blocks[0]["type"] == "feature_card" else None
        # 列数照旧构图：同一 row 里并排的卡片块数、各块 columns 里取最大（旧版把同 row 的块左右排）
        from collections import Counter
        rows = Counter(b["spec"].get("row") for b in blocks if b["spec"].get("row"))
        want = max([rows.most_common(1)[0][1] if rows else 1] + [int(b["spec"].get("columns") or 1) for b in blocks])
        spec_c = dict(spec0)
        if want > int(spec0.get("columns") or default_cols or 1):
            spec_c["columns"] = min(want, len(cards))
        attrs = f'art="{art_mode}" kind="{blocks[0]["type"]}" ' + cols_attr(spec_c, default_cols)
        self.emit(":::cards{" + attrs.strip() + "}\n" + "\n\n".join(parts) + "\n:::")

    def stats(self, b):
        items = []
        extra = []
        for n in b["nodes"]:
            if n["type"] == "stats":
                items += [(it["num"], [it["text"]]) for it in n["items"]]
            elif n["type"] == "group":
                items.append((n["name"], []))
            elif n["type"] == "card":
                items.append((n["name"], [n["text"]]))
            elif n["type"] == "para" and re.match(r"^[0-9０-９][^　｜]{0,14}[　｜]", n["text"]) and not extra:
                num, rest = re.split(r"[　｜]", n["text"], maxsplit=1)
                items.append((num, [rest.strip("　 ")]))
            elif n["type"] == "para" and items and not extra and items[-1][1] == []:
                items[-1][1].append(n["text"])
            elif n["type"] == "para" and items and not extra and not re.match(r"^截至|^数据|^注", n["text"]) and len(items[-1][1]) < 2:
                items[-1][1].append(n["text"])
            else:
                extra.append(n)
        if not items:
            self.emit(nodes_md(b["nodes"], self.links, self.md)); return
        if len(items) > 4 and False:
            pass
        icons = [] if b["spec"].get("icons") == "none" else self.take_icons(len(items), [(num, " ".join(t)) for num, t in items])
        attr = "{" + cols_attr(b["spec"], min(4, len(items)), 2) + (f' icons="{",".join(icons)}"' if any(icons) else "") + "}"
        lines = []
        for num, texts in items:
            body = "<br>".join(inline(t, self.links, self.md) for t in texts)
            lines.append(f"- <strong>{inline(num, self.links, self.md)}</strong>　{body}")
        self.emit(":::stats" + attr + "\n" + "\n".join(lines) + ("\n\n" + nodes_md(extra, self.links, self.md) if extra else "") + "\n:::")

    def steps(self, b):
        nodes = b["nodes"]
        items, extra = [], []
        kind = "timeline" if b["type"] == "timeline" else "flow"
        raw0 = (nodes[0].get("raw") or "").strip() if nodes else ""
        if kind == "flow" and raw0.count("→") >= 2 and len(P.canon(raw0)) < 80 and not raw0.startswith(("1.", "- ")):
            # “A → B → C” 一行流程：每一段是一步
            items = [(x.replace("**", "").strip(), "", "") for x in raw0.split("→") if x.strip()]
            nodes = nodes[1:]
        for n in nodes:
            if n["type"] == "steps":
                for it in n["items"]:
                    items.append((it.get("lead") or "", it.get("text") or "", it.get("lead_gap") or ""))
            elif n["type"] == "group" and (not extra):
                items.append((re.sub(r"^\d+[.．、]\s*", "", n["name"]), "", ""))
            elif n["type"] == "para" and "→" in n["text"] and not items and len(n["text"]) < 60 and kind == "flow":
                for part in re.split(r"\s*→\s*", n["text"]):
                    items.append((part, "", ""))
            elif n["type"] == "para" and kind == "timeline" and re.match(r"^\d+\s*月\s*\d+\s*日[^　｜]*[　｜]", n["text"]) and not extra:
                head, rest = re.split(r"[　｜]", n["text"], maxsplit=1)
                items.append((head, rest.strip("　 "), ""))
            elif n["type"] == "para" and items and not items[-1][1] and not extra and kind == "flow":
                items[-1] = (items[-1][0], n["text"], "")
            elif n["type"] == "para" and items and not extra and kind == "flow" and items[-1][1]:
                items[-1] = (items[-1][0], items[-1][1] + "\n" + n["text"], "")
            else:
                extra.append(n)
        if not items:
            self.emit(nodes_md(nodes, self.links, self.md)); return
        icons = [] if b["spec"].get("icons") == "none" or kind == "timeline" else self.take_icons(len(items), [(t, x) for t, x, _ in items])
        attrs = [f'kind="{kind}"', cols_attr(b["spec"])]
        if any(icons):
            attrs.append(f'icons="{",".join(icons)}"')
        lines = []
        for i, (title, text, gap) in enumerate(items, 1):
            t = f"<strong>{inline(title, self.links, self.md)}</strong>" if title else ""
            body = "<br>".join(inline(x, self.links, self.md) for x in text.split("\n")) if text else ""
            lines.append(f"{i}. {t}{gap or ('　' if t and body else '')}{body}")
        self.emit(":::steps{" + " ".join(attrs) + "}\n" + "\n".join(lines) + ("\n\n" + nodes_md(extra, self.links, self.md) if extra else "") + "\n:::")

    def gallery(self, b, done):
        shots = self.s.get("screenshots") or []
        page_text = P.canon(self.s.get("text", ""))
        if shots and not done:
            imgs = []
            for sh in shots:
                f = sh.get("file", "")
                if not f or not os.path.isfile(os.path.join(REPO, f)):
                    self.notes.append(f"截图缺文件 {f}"); continue
                cap = sh.get("caption", "")
                alt = cap.replace("]", "）").replace("[", "（")
                dup = P.canon(cap) and P.canon(cap) in page_text
                imgs.append(f"![{esc(alt)}]({publish_ref(f)}{' \"nocap\"' if dup else ''})")
            if imgs:
                self.emit(":::gallery\n" + "\n\n".join(imgs) + "\n:::")
            done = True
        elif not shots and b["type"] in ("topology", "chart", "document_mock") and not done:
            self.notes.append(f"{b['type']} 没有可用的整块图片，按文字原样放")
        self.prose(b)
        return done

    def prose(self, b):
        nodes = b["nodes"]
        if not nodes:
            return
        self.emit(nodes_md(nodes, self.links, self.md))

    def render(self):
        s = self.s
        spec = self.spec
        text = public_rule_text(s) if s.get("shape") == "source_text" else s.get("text", "")
        nodes = P.parse(text, markdown_links=P.original_markdown(s))
        if spec:
            blocks = assign_by_spec(nodes, spec["blocks"], self.notes)
        else:
            blocks = [{"type": "chapter_title" if nodes and nodes[0]["type"] in ("h1", "h2") else "prose", "spec": {}, "nodes": nodes[:1] if nodes and nodes[0]["type"] in ("h1", "h2") else nodes}]
            if blocks[0]["type"] == "chapter_title":
                blocks.append({"type": "prose", "spec": {}, "nodes": nodes[1:]})
        has_chapter = any(b["type"] == "chapter_title" for b in blocks)
        cont = (not has_chapter) and not self.first
        self.emit(f'::screen{{#{s["id"]} section="{s.get("section", "")}"' + (' continue="1"' if cont else "") + "}")
        if self.md and s.get("shape") == "source_text":
            # 规则原文：整屏按正文排，开头的“原文 · 版本”一行当小标题
            body = nodes_md(nodes, self.links, True, heading="####")
            self.emit(":::source\n" + body + "\n:::")
            return "\n\n".join(self.out)
        i = 0
        gallery_done = False
        pending_cards = []
        def flush():
            if pending_cards:
                self.cards(list(pending_cards)); pending_cards.clear()
        while i < len(blocks):
            b = blocks[i]
            t = b["type"]
            if t in CARD_TYPES or (t == "source_text_card"):
                pending_cards.append(b); i += 1; continue
            flush()
            if t in ("chapter_title", "title_strip"):
                self.spec_chapter = b["spec"]
                lead = []
                j = i + 1
                # 章节头里放“一句话”：紧跟的正文（不长于 400 字）整块并入，否则只取第一段
                while j < len(blocks) and blocks[j]["type"] == "illustration":
                    j += 1
                if j < len(blocks) and blocks[j]["type"] == "prose" and blocks[j]["nodes"]:
                    pn = blocks[j]["nodes"]
                    total = sum(len(P.node_text(n)) for n in pn)
                    if total <= 400 and all(n["type"] in ("para", "group") for n in pn):
                        lead = pn; blocks[j] = dict(blocks[j], nodes=[])
                    elif pn[0]["type"] == "para" and len(pn[0]["text"]) <= 160:
                        lead = pn[:1]; blocks[j] = dict(blocks[j], nodes=pn[1:])
                self.chapter(b["nodes"], lead)
            elif t == "illustration":
                if has_chapter and not any(x["type"] == "chapter_title" for x in blocks[:i]) and False:
                    pass
                a = self.art() if self.arts else None
                if a and not has_chapter:
                    self.emit(f":::figure\n![]({a})\n:::")
                elif a and i > 0:
                    self.emit(f":::figure\n![]({a})\n:::")
                self.prose(b)
            elif t == "stat_card":
                self.stats(b)
            elif t in STEP_TYPES:
                self.steps(b)
            elif t == "dialogue":
                body = nodes_md(b["nodes"], self.links, self.md)
                self.emit(":::dialogue\n" + body + "\n:::")
            elif t == "status_legend":
                body = nodes_md(b["nodes"], self.links, self.md)
                body = re.sub(r"([●○✕])\s*([^　●○✕<\n]+)", lambda m: f'<span class="legend-item" data-state="{state_of(m[2]) or "on"}"><span class="legend-dot" aria-hidden="true">{m[1]}</span>{m[2].strip()}</span>', body)
                self.emit(":::legend" + chr(10) + body + chr(10) + ":::")
            elif t in NOTE_TYPES:
                self.emit(":::note\n" + nodes_md(b["nodes"], self.links, self.md) + "\n:::")
            elif t == "tag":
                self.emit(":::tag\n" + nodes_md(b["nodes"], self.links, self.md) + "\n:::")
            elif t == "action_button":
                self.emit(":::buttons\n" + nodes_md(b["nodes"], self.links, self.md) + "\n:::")
            elif t in GALLERY_TYPES:
                gallery_done = self.gallery(b, gallery_done)
            elif t == "section_heading" and b["nodes"]:
                first = b["nodes"][0]
                img = None  # 小节名照现在：深绿粗体字，不用毛笔图
                if img:
                    alt = text_of(first).replace('"', "＂")
                    self.emit(f'<h3 class="sub-brush"><img src="{img}" alt="{alt}"></h3>')
                else:
                    self.emit('<h3 class="sechead">' + inline(text_of(first), self.links, self.md) + '</h3>')
                self.emit(nodes_md(b["nodes"][1:], self.links, self.md))
            else:
                self.prose(b)
            i += 1
        flush()
        if (s.get("screenshots") or []) and not gallery_done:
            gallery_done = self.gallery({"type": "screenshot", "nodes": [], "spec": {}}, False)
        return "\n\n".join(self.out)


def ink_box(rel):
    """毛笔标题图四周的白纸边（像现在网站一样只显示有笔画的部分，四周留 8 像素）：返回 上,右,下,左 要裁掉的像素。
    只用于显示时裁（CSS object-view-box），图片文件本身不改。"""
    from PIL import Image
    import numpy as np
    with Image.open(os.path.join(ASSETS, *rel.split("/"))) as im:
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA"); bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[3]); im = bg
        a = np.asarray(im.convert("RGB")).min(axis=2)
    ys, xs = np.where((a < 243).any(1))[0], np.where((a < 243).any(0))[0]
    if not len(ys):
        return None
    h, w = a.shape; m = 8
    t, b, l, r = max(0, ys[0] - m), max(0, h - 1 - ys[-1] - m), max(0, xs[0] - m), max(0, w - 1 - xs[-1] - m)
    return [int(t), int(r), int(b), int(l)]


def file_meta(url):
    if not url:
        return None
    from PIL import Image
    p = os.path.join(OUT_PUB, *urllib.parse.unquote(url).lstrip("/").split("/"))
    with Image.open(p) as im:
        size = list(im.size)
    return {"src": url, "size": size, "key": hashlib.sha256(open(p, "rb").read()).hexdigest()}


def motion_meta(m):
    """翻页过渡要的“这页的插画和标题是哪张图”：按文件内容算指纹，和旧站翻页数据里的指纹对得上。"""
    if not m:
        return None
    return {"screen": m["screen"], "art": file_meta(m["art"]), "brush": file_meta(m["brush"])}


def convert(page):
    src = os.path.join(REPO, "sources", "pages", page, "page.json")
    raw = open(src, "rb").read()
    data = json.loads(raw.decode("utf-8"))
    lay_p = os.path.join(REPO, "sources", "pages", page, "layout.json")
    specs = {}
    if os.path.exists(lay_p):
        for it in json.load(open(lay_p, encoding="utf-8")):
            if it.get("orientation", "h") == "h":
                specs.setdefault(it["screen"], it)
    parts, notes, sections = [], [], []
    motion = None
    PAGE_ARTS.clear()
    for k, s in enumerate(data["screens"]):
        if s.get("hidden"):
            continue
        sc = Screen(data, s, specs.get(s["id"]), k == 0)
        parts.append(sc.render())
        if sc.motion:
            motion = sc.motion
        notes += [f"{s['id']}: {n}" for n in sc.notes]
        if s.get("section") and s["section"] not in [x[0] for x in sections]:
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
        "toc": toc,
        "motion": motion_meta(motion),
        "source": {"page": f"sources/pages/{page}/page.json", "sha256": hashlib.sha256(raw).hexdigest(), "converted_at_beijing": now},
    }
    body = "\n\n".join(parts) + "\n"
    out = "---\n" + json.dumps(fm, ensure_ascii=False, indent=1) + "\n---\n\n" + body
    os.makedirs(OUT_MD, exist_ok=True)
    open(os.path.join(OUT_MD, page + ".md"), "w", encoding="utf-8", newline="\n").write(out)
    return notes


if __name__ == "__main__":
    names = sys.argv[1:]
    if names == ["--all"]:
        names = sorted(d for d in os.listdir(os.path.join(REPO, "sources", "pages")) if os.path.exists(os.path.join(REPO, "sources", "pages", d, "page.json")))
    import time as _t
    t0 = _t.time()
    failed = []
    for n in names:
        try:
            notes = convert(n)
        except SystemExit:
            raise
        except Exception as e:  # 批量时一页失败不拦其它页，最后列出来
            failed.append((n, repr(e)[:200])); print(n, "转换失败", repr(e)[:200]); continue
        print(n, "转换完成", f"提示 {len(notes)} 条")
        for x in notes:
            print("  ", x)
    for g in GATE_LOG:
        print("  规则原文公开过滤：", json.dumps(g, ensure_ascii=False))
    print(f"转换用时 {(_t.time() - t0):.1f} 秒，共 {len(names)} 页，失败 {len(failed)} 页")
