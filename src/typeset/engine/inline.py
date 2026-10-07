"""行内标记 → HTML。所有定稿文字都经这里输出（COMPONENTS-API 第 2 节 ctx.inline）。"""
import html
import re
from .parse import MD_LINK_RE

BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
CODE_RE = re.compile(r"`([^`]+)`")
LINK_RE = re.compile(r"〔([^〔〕]+)〕")
BTN_RE = re.compile(r"[【［]([^【】［］]+)[】］]")
DOT_CLASS = {"●": "dot-on", "○": "dot-ring", "✕": "dot-x"}


def _motion_mark(kind, text):
    if kind == "status-dot":
        return ('<span data-role="status-dot" data-motion-text="status-dot" aria-hidden="true" '
                'style="display:inline-block;width:.5em;height:.5em;border-radius:50%;background:var(--status-on);vertical-align:middle;margin-inline-end:.12em;pointer-events:none"></span>' + text)
    attr = 'class="feature-number" style="font:inherit;color:inherit;flex:initial"' if kind == "number" else 'data-comp="arrow" style="display:inline-block;line-height:1"'
    return f'<span {attr} data-motion-text="{kind}">{text}</span>'


def make_inline(links, motion_text=None, markdown_links=False):
    # 只给规格点名的旧效果原字加定位；新状态点须限定唯一上下文。
    targets = [m for m in (motion_text or []) if isinstance(m, dict) and m.get("kind") in ("number", "arrow", "status-dot") and isinstance(m.get("text"), str) and m["text"] and (m["kind"] != "status-dot" or isinstance(m.get("within"), str) and bool(m["within"]))]
    marks = {html.escape(m["text"], quote=False): m["kind"] for m in targets if not m.get("within")}
    mark_re = re.compile("|".join(re.escape(t) for t in sorted(marks, key=len, reverse=True))) if marks else None
    def inline(s):
        if s is None:
            return ""
        scoped = []
        for m in targets:
            within = m.get("within")
            if isinstance(within, str) and within.count(m["text"]) == 1 and within in s:
                token = "\x01" + chr(0xE000 + len(scoped)) + "\x02"
                scoped.append((token, m))
                s = s.replace(within, within.replace(m["text"], token, 1), 1)
        codes = []

        def keep_code(m):
            codes.append(m.group(1)); return f"\x00{len(codes) - 1}\x00"
        s = CODE_RE.sub(keep_code, s)
        stored_markdown_links = []
        def keep_markdown_link(match):
            stored_markdown_links.append((match[1], match[2]))
            return "\x03" + str(len(stored_markdown_links) - 1) + "\x03"
        if markdown_links:
            s = MD_LINK_RE.sub(keep_markdown_link, s)
        s = html.escape(s, quote=False)
        s = BOLD_RE.sub(r"<b>\1</b>", s)
        s = s.replace("\\", "\\<wbr>")

        def lk(m):
            t = html.unescape(m.group(1))
            return f'<a class="lk" data-href="{html.escape(links.get(t, ""))}" data-hot="link">{html.escape(t, quote=False)}</a>'

        def bt(m):
            t = html.unescape(m.group(1))
            return f'<a class="btn inline-btn" data-href="{html.escape(links.get(t, ""))}" data-hot="button">{html.escape(t, quote=False)}</a>'
        s = LINK_RE.sub(lk, s)
        s = BTN_RE.sub(bt, s)
        def put_markdown_link(match):
            label, target = stored_markdown_links[int(match[1])]
            # 标准 Markdown 自带目标；同名标签的不同片段不能被文本字典合并。
            path, separator, fragment = target.partition("#")
            normalized_path = path.replace("\\", "/")
            name = normalized_path.rsplit("/", 1)[-1]
            suffix = "#" + fragment if separator else ""
            if normalized_path.endswith("templates/claude-home/CLAUDE.md"):
                target = "/rule-sources/templates/claude-home/CLAUDE.md" + suffix
            elif normalized_path.endswith("templates/codex-home/AGENTS.md"):
                target = "/rule-sources/templates/codex-home/AGENTS.md" + suffix
            elif name == "AGENTS.md":
                target = "/rules/charter/" + suffix
            elif re.fullmatch(r"agents\.[a-z-]+\.md", name):
                target = "/rules/" + name[7:-3] + "/" + suffix
            elif normalized_path.lower() == "e:/.agents/tools/find-duplicatecontent.ps1":
                target = "/source-tools/Find-DuplicateContent.ps1"
            visible = BOLD_RE.sub(r"<b>\1</b>", html.escape(label, quote=False))
            return '<a class="lk" data-href="' + html.escape(target, quote=True) + '" data-hot="link">' + visible + '</a>'
        s = re.sub(r"\x03(\d+)\x03", put_markdown_link, s)
        # ｜ 是定稿的分格记号（G1 基准也去掉它），从不画出来：换成一格空白
        s = s.replace("｜", '<span class="sep">　</span>')
        for ch, cls in DOT_CLASS.items():
            s = s.replace(ch, f'<span class="dot {cls}">{ch}</span>')

        def put_code(m):
            c = html.escape(codes[int(m.group(1))], quote=False).replace("\\", "\\<wbr>").replace("/", "/<wbr>")
            return f'<code class="mono">{c}</code>'
        s = re.sub(r"\x00(\d+)\x00", put_code, s)
        if mark_re:
            def mark(m):
                return _motion_mark(marks[m[0]], m[0])
            # 只处理文字节点；不触碰链接目标、路径、属性或已生成的标签。
            s = "".join(t if t.startswith("<") else mark_re.sub(mark, t) for t in re.split(r"(<[^>]*>)", s))
        for token, m in scoped:
            s = s.replace(token, _motion_mark(m["kind"], html.escape(m["text"], quote=False)))
        return s
    return inline
