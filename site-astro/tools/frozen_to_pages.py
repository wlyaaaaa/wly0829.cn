"""机械迁移选定的冻结模块页；正文、链接和素材来源均从已有输入取得。

用法：--routes 路由清单 --report 报告目录 [--dry-run] [--force]。
后续专图原位替换 asset-map 的该页首屏 illustration 行（asset 和 sha256），
再运行 convert_page.py 该页及构建；不要追加第二条同槽 ready 行。
换图不需要 --force；该选项会从冻结源重写正文，覆盖已更新的事实。
"""
import argparse
from collections import Counter
import copy
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, urlunsplit

from bs4 import BeautifulSoup, NavigableString, Tag

REPO = Path(__file__).resolve().parents[2]
REQUIRED_CLASSES = ("project-hero", "project-lead", "snapshot-card", "module-product",
    "plain-language-grid", "outcome-state-grid", "usage-start", "usage-inputs",
    "module-product-flow", "module-technical", "status-pill", "skill-decision-list",
    "definition-list", "problem-callout", "failure-list", "source-list", "document-pagination")
FAMILIES = ("top", "usage_cards", "outcome_cards", "start", "technical", "definitions", "failure", "sources")
TITLES = ("", "这项功能怎样使用", "结果怎么看", "从哪里开始", "技术实现与依据", "名词和入口", "出问题时", "依据与来源")
ICONS = {"为什么需要它": "why", "举个实际例子": "example", "最后我会得到什么": "result",
    "正常时": "normal", "发现问题时": "problem", "入口不可用或证据不足时": "unavailable",
    "需要准备什么": "inputs", "从开始到拿到结果": "steps", "关键规则与设计选择": "rules",
    "失败与恢复": "failure", "依据与来源": "sources"}


def route_id(route):
    if not re.fullmatch(r"/projects/[a-z0-9-]+/[a-z0-9-]+/", route):
        raise ValueError("不是冻结模块路由：" + route)
    return "-".join(route.strip("/").split("/")[1:])


def normalize_route(value):
    parsed = urlsplit(value)
    return parsed.path.rstrip("/") + "/" if not parsed.scheme and not parsed.netloc else value


def rewrite_link(href, route, retired_routes):
    parsed = urlsplit(urljoin(route, href))
    if parsed.scheme or parsed.netloc:
        return href
    path = parsed.path.rstrip("/") + "/"
    for old, destination in retired_routes.items():
        if path == old or path.startswith(old):
            path = destination
            break
    return urlunsplit(("", "", path, parsed.query, parsed.fragment))


def visible(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"(?m)^\s*(?:#{1,6}\s+|-\s+)", "", text)
    text = re.sub(r"(?m)^\s*\|[ :|\-]+\|\s*$", "", text)
    return re.sub(r"[\s*`|〔〕]", "", text)


def retention_ratio(original, converted):
    """按可见字符的重数计算保留率；新标题和重复表头不能抵偿缺失的字。"""
    before, after = Counter(visible(original)), Counter(visible(converted))
    return sum((before & after).values()) / max(1, sum(before.values()))


def split_blocks(blocks, max_chars=1400, max_items=8, min_chars=120):
    """只在完整段、列表项、表格行之间拆分；保留编号和行内容。"""
    chunks, current, chars, items = [], [], 0, 0
    for block in blocks:
        size = len(visible(block["text"]))
        item = int(block.get("kind") in ("list_item", "table_row"))
        if current and (chars + size > max_chars or items + item > max_items):
            tail = []
            while current and current[-1].get("kind") == "heading":
                tail.insert(0, current.pop())
            if current:
                chunks.append(current)
            current, chars, items = tail, sum(len(visible(b["text"])) for b in tail), 0
        current.append(block)
        chars += size
        items += item
    if current:
        if chunks and sum(len(visible(b["text"])) for b in current) < min_chars:
            prior = chunks[-1]
            count = lambda seq: sum(b.get("kind") in ("list_item", "table_row") for b in seq)
            if count(prior) + count(current) <= max_items:
                prior.extend(current)
                current = []
            else:
                while len(prior) > 1 and sum(len(visible(b["text"])) for b in current) < min_chars:
                    if count(current) + count(prior[-1:]) > max_items or sum(len(visible(b["text"])) for b in prior[:-1]) < min_chars:
                        break
                    current.insert(0, prior.pop())
                while prior and prior[-1].get("kind") == "heading":
                    current.insert(0, prior.pop())
        if current:
            chunks.append(current)
    return chunks


class Extractor:
    def __init__(self, main, route, retired):
        self.main, self.route, self.retired = main, route, retired
        self.positions = {id(n): i for i, n in enumerate(main.descendants)}
        self.used, self.links = set(), []

    def mark(self, node):
        self.used.add(id(node))
        self.used.update(id(n) for n in node.descendants)

    def inline(self, node):
        if isinstance(node, NavigableString):
            return str(node)
        if not isinstance(node, Tag) or node.name in ("script", "style", "svg"):
            return ""
        if node.name == "br":
            return "\n"
        if node.name in ("ul", "ol"):
            return "\n" + "\n".join((f"{i}. " if node.name == "ol" else "- ") + self.inline(li).strip()
                for i, li in enumerate(node.find_all("li", recursive=False), 1)) + "\n"
        body = "".join(self.inline(n) for n in node.children)
        if node.name == "a" and node.get("href"):
            label = node.get_text(" ", strip=True)
            if label:
                self.links.append({"text": label, "href": rewrite_link(node["href"], self.route, self.retired)})
                return "〔" + label + "〕"
        if node.name in ("strong", "b"):
            return "**" + body + "**"
        if node.name in ("em", "i"):
            return "*" + body + "*"
        if node.name == "code" and body:
            return "`" + body.replace("`", "\\`") + "`"
        if node.name in ("p", "div"):
            return body + "\n\n"
        return body

    def block(self, node, text=None, kind="prose", **extra):
        body = self.inline(node).strip() if text is None else text
        links = [{"text": a.get_text(" ", strip=True), "href": rewrite_link(a["href"], self.route, self.retired)}
                 for a in [node, *node.find_all("a", href=True)] if a.name == "a" and a.get("href")]
        anchors = [{"id": n["id"], "text": n.get_text(" ", strip=True)}
                   for n in [node, *node.find_all(attrs={"id": True})] if isinstance(n, Tag) and n.get("id")]
        return dict(text=body, kind=kind, pos=self.positions.get(id(node), -1),
                    links=links, anchors=anchors, **extra)

    def blocks(self, node, token=None):
        self.mark(node)
        result = []
        if node.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            b = self.block(node, kind="heading")
            b["text"] = ("# " if node.name == "h1" else "## ") + b["text"]
            b["icon_category"] = ICONS.get(node.get_text(" ", strip=True))
            result.append(b)
        elif node.name in ("ul", "ol"):
            for index, li in enumerate(node.find_all("li", recursive=False), int(node.get("start", 1))):
                clone = copy.copy(li)
                first = clone.find("span", recursive=False)
                if first and re.fullmatch(r"\d+", first.get_text(strip=True)):
                    first.decompose()
                b = self.block(li, kind="list_item")
                heading = clone.find("h4")
                if heading:
                    label = self.inline(heading).strip()
                    heading.decompose()
                    body = "**" + label + "**　" + self.inline(clone).strip()
                else:
                    body = self.inline(clone).strip()
                b["text"] = (f"{index}. " if node.name == "ol" else "- ") + body
                result.append(b)
        elif node.name == "table":
            rows = node.find_all("tr")
            header = None
            for index, tr in enumerate(rows):
                cells = [self.inline(c).strip().replace("|", "\\|").replace("\n", "<br>")
                         for c in tr.find_all(["td", "th"], recursive=False)]
                if not cells:
                    continue
                line = "| " + " | ".join(cells) + " |"
                if index == 0:
                    header = line + "\n| " + " | ".join("---" for c in cells) + " |"
                    if tr.find("th"):
                        continue
                    header = "| " + " | ".join("" for c in cells) + " |\n| " + " | ".join("---" for c in cells) + " |"
                result.append(self.block(tr, line, "table_row", table_header=header))
        elif node.name == "dl":
            for dt in node.find_all("dt"):
                dd = dt.find_next_sibling("dd")
                if dd:
                    b = self.block(dt, kind="list_item")
                    b["text"] = "- **" + self.inline(dt).strip() + "**：" + self.inline(dd).strip()
                    reference = self.block(dd)
                    b["links"].extend(reference["links"])
                    b["anchors"].extend(reference["anchors"])
                    result.append(b)
        elif node.name in ("p", "pre", "blockquote", "a"):
            b = self.block(node)
            if node.name == "pre":
                b["text"] = "```\n" + node.get_text() + "\n```"
            result.append(b)
        else:
            for child in node.children:
                if isinstance(child, NavigableString):
                    if child.strip():
                        result.append(dict(text=str(child).strip(), kind="prose", pos=self.positions[id(child)], links=[], anchors=[]))
                elif isinstance(child, Tag):
                    result.extend(self.blocks(child))
        result = [b for b in result if b["text"].strip()]
        if token and result:
            result[0]["token"] = token
        return result


def assemble(blocks):
    parts, previous = [], None
    for b in blocks:
        if b.get("table_header") and previous != b["table_header"]:
            parts.append(b["table_header"])
        parts.append(b["text"])
        previous = b.get("table_header")
    result = ""
    for part in parts:
        result += ("\n" if part.startswith("|") and result.rstrip().endswith("|") else "\n\n") + part
    return result.lstrip()


def convert_html(html, route, parent, retired_routes=None):
    pid = route_id(route)
    retired = {r["route"]: r["destination"] for r in retired_routes} if isinstance(retired_routes, list) else retired_routes or {}
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    if main is None:
        raise ValueError("缺少 main：" + route)
    for cls in REQUIRED_CLASSES:
        if len(main.select("." + cls)) != 1:
            raise ValueError(f"{route}：{cls} 必须恰好出现一次")
    report = {"route": route, "page": pid, "discarded": [], "warnings": [], "screens": []}
    # 原页外壳与表单不进入新正文；保留每类实际被排除的片段及原因。
    for selector, reason in ((".breadcrumbs", "面包屑"), (".project-reading-nav", "旧阅读标签"),
        (".continuation-brief", "旧续作表单"), (".project-navigation", "旧模块侧栏"),
        (".visually-hidden", "原本不可见"), ("script", "脚本")):
        for node in list(main.select(selector)):
            report["discarded"].append({"selector": selector, "reason": reason, "html": str(node)})
            node.decompose()
    for node in main.select("svg, style"):
        node.decompose()  # 非正文的绘图路径、样式不参加可见文字保留率。
    original = main.get_text(" ", strip=True)
    ex = Extractor(main, route, retired)
    groups = [[] for _ in FAMILIES]
    hero = main.select_one(".project-hero")
    h1 = hero.find("h1")
    if not h1:
        raise ValueError("项目首屏缺少 h1：" + route)
    title = h1.get_text(" ", strip=True)
    state = main.select_one(".status-pill").get_text(" ", strip=True)
    as_of = "Unknown"
    observation = hero.select_one(".reader-observation")
    if observation:
        time = observation.find("time")
        stamp = time.get_text(" ", strip=True) if time else observation.get_text(" ", strip=True)
        match = re.search(r"\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?", stamp)
        as_of = match[0] if match else "Unknown"
        raw = observation.get_text(" ", strip=True)
        before, sep, after = raw.partition("；")
        report["discarded"].append({"reason": "快照日期转入 status_line", "text": before, "moved": True})
        original = original.replace(before, "", 1)
        observation.clear()
        if sep:
            observation.append(after)
        # 日期属于移动而非丢弃；仍参与总保留率计算。
    groups[0] = ex.blocks(hero)
    title_block = next(b for b in groups[0] if b["text"].startswith("# "))
    groups[0].remove(title_block)
    groups[0].insert(0, title_block)
    for b in groups[0]:
        if b["text"].startswith("# "):
            b["token"] = "title"
        if b["pos"] == ex.positions.get(id(main.select_one(".project-lead"))):
            b["token"] = "lead"
    back = "回到项目 → " + parent["title"]
    links = [{"text": back, "href": parent["url"]}]
    repo = hero.select_one(".project-hero-repository-link")
    if repo:
        links.append({"text": "GitHub", "href": repo["href"]})
        repo_label = visible(repo.get_text(" ", strip=True))
        groups[0] = [b for b in groups[0] if not (visible(b["text"]) == repo_label
            and any(r["href"] == repo["href"] for r in b.get("links", [])))]
        report["repository_entry"] = {"source_label": repo_label, "label": "GitHub", "href": repo["href"], "moved": True}
    links.append({"text": "复制 AI 续作说明", "href": parent["url"] + "#ai-brief"})
    report["continuation_entry"] = parent["url"] + "#ai-brief"
    groups[0].insert(1, dict(text="　".join("〔" + r["text"] + "〕" for r in links), kind="prose", pos=-1, links=links, anchors=[], token="buttons"))
    for number, selector in ((1, ".plain-language-grid"), (2, ".outcome-state-grid")):
        grid = main.select_one(selector)
        for ordinal, card in enumerate(grid.find_all(recursive=False)):
            blocks = ex.blocks(card)
            heading = next((b for b in blocks if b["kind"] == "heading"), None)
            if heading:
                heading["card"] = True
                heading["icon_category"] = ("why", "example", "result")[ordinal] if number == 1 else ("normal", "problem", "unavailable")[ordinal]
            groups[number].extend(blocks)
        owner = grid.find_parent("section")
        for heading in owner.find_all(["h2", "p"], recursive=False):
            if id(heading) not in ex.used:
                if heading.name == "h2" and heading.get_text(" ", strip=True) == TITLES[number]:
                    ex.mark(heading)  # 已映射到本屏唯一标题，原 ID 在统一锚点步骤保留。
                else:
                    groups[number].extend(ex.blocks(heading))
    start, inputs = main.select_one(".usage-start"), main.select_one(".usage-inputs")
    for child in list(start.children):
        if isinstance(child, Tag) and child is not inputs:
            groups[3].extend(ex.blocks(child, "intro" if child.name == "p" else None))
    groups[3].extend(dict(b, area="inputs") for b in ex.blocks(inputs, "inputs"))
    groups[3].extend(dict(b, area="steps") for b in ex.blocks(main.select_one(".module-product-flow"), "steps"))
    tech_heading = main.select_one(".module-technical-heading")
    if tech_heading:
        blocks = ex.blocks(tech_heading)
        intro = next((b for b in blocks if b["kind"] != "heading"), None)
        if intro:
            intro["token"] = "intro"
        groups[4].extend(blocks)
    else:
        groups[4].extend(ex.blocks(main.select_one(".status-pill"), "intro"))
    decisions = main.select_one(".skill-decision-list")
    ex.mark(decisions)
    for number, article in enumerate(decisions.find_all(recursive=False), 1):
        clone = copy.copy(article)
        badge = clone.find("span", recursive=False)
        if badge and re.fullmatch(r"\d+", badge.get_text(strip=True)):
            badge.decompose()
        groups[4].append(ex.block(article, f"{number}. " + ex.inline(clone).strip(), "list_item", token="rule_list" if number == 1 else None))
    definitions = main.select_one(".definition-list")
    ex.mark(definitions)
    for dt in definitions.find_all("dt"):
        dd = dt.find_next_sibling("dd")
        if dd:
            line = "| " + ex.inline(dt).strip().replace("|", "\\|") + " | " + ex.inline(dd).strip().replace("|", "\\|").replace("\n", "<br>") + " |"
            block = ex.block(dt, line, "table_row", table_header="| 名词 | 意思 |\n| --- | --- |", token="table")
            reference = ex.block(dd)
            block["links"].extend(reference["links"])
            block["anchors"].extend(reference["anchors"])
            groups[5].append(block)
    groups[6].extend(ex.blocks(main.select_one(".problem-callout"), "callout"))
    groups[6].extend(ex.blocks(main.select_one(".failure-list"), "failures"))
    sources = main.select_one(".source-list")
    ex.mark(sources)
    for item in sources.find_all(recursive=False):
        groups[7].append(ex.block(item, "- " + ex.inline(item).strip(), "list_item", token="source_list"))
    for node in main.select(".source-reference-link"):
        if id(node) not in ex.used:
            groups[7].extend(ex.blocks(node))
    pagination = main.select_one(".document-pagination")
    ex.mark(pagination)
    end_links = []
    for node in pagination.find_all("a", href=True):
        end_links.append({"text": node.get_text(" ", strip=True), "href": rewrite_link(node["href"], route, retired)})
    # 映射小节外的原有标题仍属于正文；移入其拥有的屏。
    for cls, group in (("skill-decision-list", 4), ("definition-list", 5), ("failure-list", 6), ("source-list", 7)):
        owner = main.select_one("." + cls).parent
        for heading in owner.find_all(["h2", "h3"], recursive=False):
            if id(heading) not in ex.used:
                groups[group].extend(ex.blocks(heading))
    standard_sections = {"专业定义": 5, "当前怎样实现": 4, "执行流程": 4, "边界": 6, "如何验证": 7, "与其他模块的关系": 7}
    for section in main.select(".document-section, .document-section > div"):
        heading = section.find(["h2", "h3"], recursive=False)
        if heading and heading.get_text(" ", strip=True) in standard_sections and not any(id(n) in ex.used for n in section.descendants):
            groups[standard_sections[heading.get_text(" ", strip=True)]].extend(ex.blocks(section))
    markers = [(b["pos"], i) for i, group in enumerate(groups) for b in group if b["pos"] >= 0]
    # 最大的未认领片段保留在邻近屏，避免只认类名而吞掉新版新增小节。
    def remaining(node):
        if id(node) in ex.used or not str(node).strip():
            return
        if isinstance(node, Tag) and not any(id(n) in ex.used for n in node.descendants):
            if node.get_text(" ", strip=True):
                pos = ex.positions.get(id(node), 0)
                owner = min(markers, key=lambda m: abs(m[0] - pos))[1]
                groups[owner].extend(ex.blocks(node))
                report["warnings"].append({"code": "unmapped_fragment", "preserved": True, "handled": True, "family": FAMILIES[owner], "pos": pos, "html": str(node)})
            return
        if isinstance(node, NavigableString):
            if node.strip():
                pos = ex.positions[id(node)]
                owner = min(markers, key=lambda m: abs(m[0] - pos))[1]
                groups[owner].append(dict(text=str(node), kind="prose", pos=pos, links=[], anchors=[]))
                report["warnings"].append({"code": "unmapped_text", "preserved": True, "handled": True, "family": FAMILIES[owner], "pos": pos, "text": str(node)})
        else:
            for child in list(node.children):
                remaining(child)
    remaining(main)
    # 日期状态、分页链接单独参与字数核对；其余正文来自块。
    screens, metas = [], []
    for number, group in enumerate(groups):
        # 首屏按钮固定在标题后；别的内容以原页顺序为准。
        if number:
            group.sort(key=lambda b: b["pos"])
        chunks = split_blocks(group)
        for part, chunk in enumerate(chunks):
            heading = title if number == 0 else TITLES[number]
            if number:
                chunk = [b for b in chunk if not (b["kind"] == "heading" and visible(b["text"]) == visible(heading))]
            if len(chunks) > 1:
                heading += "（" + chinese_number(part + 1) + "）"
            text = assemble(chunk)
            if number and not text.startswith("## " + heading):
                text = "## " + heading + "\n\n" + text
            for b in chunk:
                if b.get("kind") in ("list_item", "table_row") and len(visible(b["text"])) > 1400:
                    report["warnings"].append({"code": "oversize_atomic_block", "preserved": True, "handled": True, "chars": len(visible(b["text"]))})
            meta = {"family": FAMILIES[number], "blocks": chunk, "split": len(chunks) > 1}
            if screens and len(visible(text)) < 120 and screens[-1]["section"] == ("usage" if number < 4 else "tech"):
                screens[-1]["text"] += "\n\n" + text
                screens[-1]["links"].extend(r for b in chunk for r in b.get("links", []))
                screens[-1]["anchors"].extend(r for b in chunk for r in b.get("anchors", []))
                metas[-1]["blocks"].extend(chunk)
                continue
            screens.append(dict(id=f"{pid}-{len(screens)+1:02d}", section="top" if number == 0 else "usage" if number < 4 else "tech",
                title=heading, text=text, links=[r for b in chunk for r in b.get("links", [])], anchors=[r for b in chunk for r in b.get("anchors", [])],
                live=None, screenshots=[], chain=None, reuse=None))
            metas.append(meta)
    screens[-1]["links"].extend(end_links)
    # 旧阅读面板和容器的 ID 也要接管，站外已有深链才能继续定位。
    for node in main.find_all(attrs={"id": True}):
        positions = {ex.positions.get(id(n), -1) for n in [node, *node.descendants]}
        owner = next((i for i, meta in enumerate(metas) if any(b["pos"] in positions for b in meta["blocks"])), None)
        if owner is None:
            owner = min(range(len(metas)), key=lambda i: min(abs(b["pos"] - ex.positions.get(id(node), 0)) for b in metas[i]["blocks"]))
        screens[owner]["anchors"].append({"id": node["id"], "text": node.get_text(" ", strip=True)[:120]})
    seen = set()
    for screen, meta in zip(screens, metas):
        screen["links"] = unique_dicts(screen["links"])
        screen["anchors"] = [r for r in unique_dicts(screen["anchors"]) if r["id"] not in seen and not seen.add(r["id"])]
        report["screens"].append(dict(id=screen["id"], chars=len(visible(screen["text"])), list_items=sum(b["kind"] in ("list_item", "table_row") for b in meta["blocks"]), **meta))
    snapshot_as_of = as_of
    parent_state = parent.get("status")
    if isinstance(parent_state, str) and parent_state.strip() and len(parent_state.strip()) <= 32:
        state = parent_state.strip()
        parent_line = parent.get("status_line") or {}
        as_of = parent_line.get("as_of", "Unknown") if parent_line.get("state") == state else "Unknown"
        source = f"父项目作者页 {parent['url']} 的 status；技术证据为冻结页 {snapshot_as_of} 原快照，待按现状重取"
        state_origin = "parent.status"
    elif len(state) <= 32:
        source = "冻结页原短状态；技术证据与日期为原快照，待按现状重取"
        state_origin = "frozen.status-pill"
    else:
        raise ValueError("冻结页状态栏是技术证据全文，父项目缺少可复用的短状态：" + route)
    report["status_origin"] = dict(field=state_origin, parent=parent["page"], as_of=as_of,
        technical_evidence_as_of=snapshot_as_of, evidence_field="module-technical .status-pill")
    page = dict(schema="site-b1.page.v1", page=pid, kind="project", title=title, url=route, parent=parent["page"],
                status_line=dict(state=state, as_of=as_of, source=source), screens=screens)
    reconstructed = "\n".join(s["text"] for s in screens) + "\n" + "\n".join(r["text"] for r in end_links)
    reconstructed += "\n" + state + "\n" + as_of
    ratio = retention_ratio(original, reconstructed)
    report.update(original_chars=len(visible(original)), converted_chars=len(visible(reconstructed)), retention_ratio=ratio, screen_count=len(screens))
    for warning in report["warnings"]:
        if "pos" in warning:
            warning["screen_id"] = min(report["screens"], key=lambda s: min(abs(b["pos"] - warning["pos"]) for b in s["blocks"]))["id"]
    report["unresolved_warnings"] = [w for w in report["warnings"] if not w.get("handled")]
    if ratio < .97:
        raise ValueError(f"{route}：可见文字保留率 {ratio:.2%} 低于 97%")
    return page, report


def chinese_number(number):
    digits = "零一二三四五六七八九"
    return digits[number] if number < 10 else ("十" + (digits[number % 10] if number % 10 else "")) if number < 20 else str(number)


def unique_dicts(rows):
    found, out = set(), []
    for row in rows:
        key = json.dumps(row, sort_keys=True, ensure_ascii=False)
        if key not in found:
            found.add(key)
            out.append(row)
    return out


def read_json(path):
    return json.loads(path.read_text("utf-8-sig"))


def asset_rows(path):
    return [json.loads(line) for line in path.read_text("utf-8-sig").splitlines() if line.strip()] if path.exists() else []


def asset_mapping(page, report, parent, rows, icons, root):
    ready = [r for r in rows if r.get("status") == "ready" and r.get("role") == "illustration"]
    dedicated = [r for r in ready if r.get("page") == page["page"]]
    hero = [r for r in dedicated if r.get("screen_id") == page["page"] + "-01"]
    if len({(r["asset"], r["sha256"]) for r in hero}) > 1:
        raise ValueError("首屏插画映射不唯一；请原位替换该页已有 illustration 行，不追加同槽：" + page["page"])
    dedicated.sort(key=lambda r: r.get("screen_id") != page["page"] + "-01")
    candidates = dedicated + [r for r in ready if r.get("page") == parent["page"] and r.get("screen_id") == parent["page"] + "-01"]
    if not candidates:
        raise ValueError("缺少当前页或父项目首屏插画：" + page["page"])
    chosen = candidates[0]
    mapped = []
    def add(screen, role, asset, phrase):
        path = root / "sources/assets" / asset["asset"]
        if not path.is_file():
            raise ValueError("素材不存在：" + str(path))
        sha = hashlib.sha256(path.read_bytes()).hexdigest()
        if sha != asset["sha256"]:
            raise ValueError("素材 SHA256 不符：" + asset["asset"])
        ordinal = 1 + sum(r["screen_id"] == screen and r["role"] == role for r in mapped)
        mapped.append(dict(page=page["page"], screen_id=screen, role=role, slot_ordinal=ordinal,
            key=asset.get("key", phrase), asset=asset["asset"], sha256=sha, status="ready",
            source_phrase=phrase, mapping_basis="frozen-module-template"))
    add(page["screens"][0]["id"], "illustration", chosen, chosen.get("source_phrase", "冻结页迁移：复用项目插画"))
    for screen, meta in zip(page["screens"], report["screens"]):
        categories = [b.get("icon_category") for b in meta["blocks"] if b.get("icon_category")]
        if meta["family"] in ("failure", "sources"):
            categories.insert(0, "failure" if meta["family"] == "failure" else "sources")
        meta["icons"] = []
        for category in dict.fromkeys(categories):
            if category not in icons:
                raise ValueError("固定图标表缺少：" + category)
            add(screen["id"], "icon", icons[category], "冻结页迁移固定图标：" + category)
            meta["icons"].append(category)
    return mapped


def make_layout(page, report, templates, icons, mapped):
    layouts = []
    candidate = templates.get("card_candidates", {}).get(templates.get("card_layout"), {})
    templates = templates.get("templates", templates)
    for screen, meta in zip(page["screens"], report["screens"]):
        family, blocks = meta["family"], meta["blocks"]
        refs = {"title": screen["title"], "intro": "", "lead": "", "buttons": "", "cards": "", "step_list": "", "rule_list": "", "source_list": ""}
        for b in blocks:
            if b.get("token"):
                refs.setdefault(b["token"], b["text"])
                if not refs.get(b["token"]):
                    refs[b["token"]] = b["text"]
            text = re.sub(r"^#{1,6}\s+", "", b["text"])
            if b.get("card") and not refs["cards"]:
                refs["cards"] = text
            if b.get("icon_category"):
                refs.setdefault(b["icon_category"], text)
            if b["kind"] == "list_item":
                key = "step_list" if family == "start" else "rule_list" if family == "technical" else "failure_list" if family == "failure" else "source_list"
                if not refs.get(key) and (family != "start" or b.get("area") == "steps"):
                    refs[key] = b["text"]
        refs["rules"] = refs.get("rule_list", "")
        refs["sources"] = refs.get("source_list", "")
        refs["failures"] = refs.get("failures") or refs.get("failure_list", "")
        table = next((b for b in blocks if b.get("table_header")), None)
        if table:
            refs["table"] = table["table_header"].strip("| ").split("|")[0].strip()
        cards = [b for b in blocks if b.get("card")]
        for n, card in enumerate(cards, 1):
            refs[f"icon_{n}"] = icons[card["icon_category"]]["asset"] if card.get("icon_category") else ""
        for category, icon in icons.items():
            refs["icon_" + category] = icon["asset"]
        refs["illustration"] = next((r["asset"] for r in mapped if r["screen_id"] == screen["id"] and r["role"] == "illustration"), "")
        def fill(value):
            if isinstance(value, str):
                return re.sub(r"\{\{([a-zA-Z0-9_]+)\}\}", lambda m: str(refs.get(m[1], "")), value)
            if isinstance(value, list):
                return [fill(x) for x in value]
            if isinstance(value, dict):
                return {k: fill(v) for k, v in value.items()}
            return value
        for orientation in ("h", "v"):
            recipe = copy.deepcopy(templates[family][orientation])
            recipe = recipe if isinstance(recipe, dict) else {"blocks": recipe}
            rendered = []
            for raw in recipe["blocks"]:
                block = fill(raw)
                if "text_ref" in block:
                    ref = block["text_ref"]
                    if not ref or visible(ref) not in visible(screen["text"]):
                        continue
                    block["text_ref"] = re.sub(r"^#{1,6}\s+", "", ref)
                if block["type"] == "illustration" and not refs["illustration"]:
                    continue
                if isinstance(block.get("header_icon"), list):
                    block["header_icon"] = [x for x in block["header_icon"][:len(cards)] if x]
                if family in ("usage_cards", "outcome_cards") and orientation == "h" and block["type"] == "source_text_card":
                    block.update(candidate)
                    block["columns"] = min(block.get("columns", 2), max(1, len(cards)))
                if family == "start" and sum(b.get("area") == "steps" and b["kind"] == "list_item" for b in blocks) > 4:
                    block.pop("row", None)
                    block.pop("width", None)
                rendered.append(block)
            # 按当前拆屏正文排序；图片保留其模板行位置。
            ranked = [(visible(screen["text"]).find(visible(b["text_ref"])) if b.get("text_ref") else 10**9, i, b) for i, b in enumerate(rendered)]
            text_blocks = sorted((r for r in ranked if r[0] != 10**9), key=lambda r: (r[0], r[1]))
            for _, i, b in ranked:
                if not b.get("text_ref"):
                    text_blocks.insert(min(i, len(text_blocks)), (0, i, b))
            layouts.append(dict(screen=screen["id"], orientation=orientation, **{k: v for k, v in recipe.items() if k != "blocks"}, blocks=[r[2] for r in text_blocks]))
    return layouts


def append_mapping(path, rows):
    old = path.read_bytes() if path.exists() else b""
    existing = asset_rows(path)
    keys = {(r.get("page"), r.get("screen_id"), r.get("role"), r.get("slot_ordinal"), r.get("asset"), r.get("sha256")) for r in existing}
    added = [r for r in rows if (r["page"], r["screen_id"], r["role"], r["slot_ordinal"], r["asset"], r["sha256"]) not in keys]
    if added:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("ab") as stream:
            if old and not old.endswith((b"\n", b"\r")):
                stream.write(b"\n")
            for row in added:
                stream.write((json.dumps(row, ensure_ascii=False) + "\n").encode("utf-8"))
    return len(added)


def convert_routes(routes, report_dir, root=REPO, dry_run=False, force=False):
    root, report_dir = Path(root), Path(report_dir)
    result = {"schema": "frozen-module-conversion.v1", "dry_run": dry_run, "pages": [], "errors": []}
    parents, ids, urls = {}, {}, {}
    for path in (root / "sources/pages").glob("*/page.json"):
        data = read_json(path)
        ids[path.parent.name] = data
        if not data.get("url"):
            continue
        url = normalize_route(data["url"])
        urls.setdefault(url, []).append(path.parent.name)
        parents[url] = data
    icons = read_json(root / "site-astro/tools/frozen_module_icons.json")["icons"]
    templates = read_json(root / "site-astro/tools/frozen_module_layout.json")
    config = root / "config/final-project-order.json"
    retired = read_json(config).get("retired_routes", []) if config.exists() else []
    map_path = root / "sources/assets/_library/asset-map.jsonl"
    rows = asset_rows(map_path)
    for route in routes:
        try:
            pid = route_id(route)
            target = root / "sources/pages" / pid
            if pid in ids and normalize_route(ids[pid].get("url", "")) != route:
                raise ValueError("页 ID 已用于不同路由：" + pid)
            if route in urls and any(name != pid for name in urls[route]):
                raise ValueError("路由已被其他页 ID 接管：" + route)
            if target.exists() and pid not in ids:
                raise ValueError("目标目录存在但没有正确的 page.json：" + str(target))
            if pid in ids and not force:
                result["pages"].append({"route": route, "page": pid, "status": "skipped"})
                continue
            parent_url = "/" + "/".join(route.strip("/").split("/")[:2]) + "/"
            if parent_url not in parents:
                raise ValueError("找不到按 URL 对应的原生父项目：" + parent_url)
            if len(urls[parent_url]) != 1:
                raise ValueError("父项目 URL 不唯一：" + parent_url)
            parent = parents[parent_url]
            source = root / "site-astro/sources/frozen-site/pages" / route.strip("/") / "index.html"
            page, report = convert_html(source.read_text("utf-8-sig"), route, parent, retired)
            mapped = asset_mapping(page, report, parent, rows, icons, root)
            layout = make_layout(page, report, templates, icons, mapped)
            report.update(status="dry-run" if dry_run else "converted", asset_rows=mapped)
            if not dry_run:
                target.mkdir(parents=True, exist_ok=True)
                (target / "page.json").write_text(json.dumps(page, ensure_ascii=False, indent=2) + "\n", "utf-8")
                (target / "layout.json").write_text(json.dumps(layout, ensure_ascii=False, indent=2) + "\n", "utf-8")
                report["asset_rows_added"] = append_mapping(map_path, mapped)
                rows.extend(mapped)
                ids[pid], urls[route] = page, [pid]
            result["pages"].append(report)
        except (ValueError, OSError, KeyError) as exc:
            result["errors"].append({"route": route, "error": str(exc)})
    result["converted"] = sum(p["status"] in ("converted", "dry-run") for p in result["pages"])
    result["skipped"] = sum(p["status"] == "skipped" for p in result["pages"])
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / "convert-report.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", "utf-8")
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--routes", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--root", type=Path, default=REPO, help="仓库根目录；隔离测试可传临时仓库")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args(argv)
    try:
        routes = [line.strip() for line in args.routes.read_text("utf-8-sig").splitlines() if line.strip() and not line.lstrip().startswith("#")]
        if len(routes) != len(set(routes)):
            raise ValueError("路由清单有重复项")
        result = convert_routes(routes, args.report, args.root, args.dry_run, args.force)
        print(json.dumps({"converted": result["converted"], "skipped": result["skipped"], "errors": result["errors"]}, ensure_ascii=False))
        return int(bool(result["errors"]))
    except (ValueError, OSError, KeyError) as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
