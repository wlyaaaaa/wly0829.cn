"""Generate local rule previews. Styling lives in template.html, rules.css, rules.js."""
import argparse
from datetime import datetime, timedelta, timezone
from difflib import unified_diff
from hashlib import sha256
from html import escape, unescape
import json
from pathlib import Path
import re
import sys
from tempfile import NamedTemporaryFile
from string import Template
from urllib.parse import unquote

from bs4 import BeautifulSoup, NavigableString, Tag
from markdown_it import MarkdownIt
import mistune

HERE = Path(__file__).resolve().parent
REWRITE_RESULTS = []
TOPICS = [
    ("authorization", ("用户授权",)), ("protected-actions", ("重大动作与", "本人验证")),
    ("privacy-data", ("个人资料与", "数据处理")), ("context-sources", ("事实来源与", "任务上下文")),
    ("execution-coordination", ("分工与", "并行施工")), ("engineering-delivery", ("工程与交付",)),
    ("capabilities-runtime", ("能力与", "运行方式")), ("rule-release", ("规则发布与", "恢复")),
    ("claude-adapter", ("Claude 适配",)), ("codex-adapter", ("Codex 适配",)),
    ("antigravity-adapter", ("Antigravity 适配",)),
]
MD = MarkdownIt("commonmark", {"html": True}).enable("table")
AST = mistune.create_markdown(renderer="ast", plugins=["table"])
BLOCKS = set("p div h1 h2 h3 h4 h5 h6 li ul ol pre blockquote table thead tbody tr th td hr".split())
LIST_LABEL = re.compile(r"^\*\*([㐀-鿿]+：)\*\*(?=[㐀-鿿])")


def normalized(text):
    return re.sub(r"\s+", " ", text).strip()


def count_words(text):
    """汉字逐字计数，连续英文字母和数字计一字；标点、空白不计。"""
    return len(re.findall(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f\U00030000-\U000323af]|[A-Za-z0-9]+", text))


def dom_text(node):
    if not isinstance(node, Tag):
        return str(node)
    text = "".join(dom_text(child) for child in node.children)
    return "\n" + text + "\n" if node.name in BLOCKS else text


def source_text(node, list_item=False):
    """Independent Markdown AST, without markup or link destinations."""
    kind = node["type"]
    if kind in {"softbreak", "linebreak"}:
        return "\n"
    if kind in {"inline_html", "block_html"}:  # 原文里的 HTML 标签是标记，只算其中的字
        return dom_text(BeautifulSoup(node["raw"], "html.parser"))
    if "raw" in node:
        return node["raw"] if kind in {"codespan", "block_code"} else unescape(node["raw"])
    inline = {"paragraph", "heading", "block_text", "emphasis", "strong", "link", "table_cell"}
    children = node.get("children", [])
    text = ("" if kind in inline else "\n").join(source_text(c, kind == "list_item") for c in children)
    return LIST_LABEL.sub(r"\1", text) if list_item and kind in {"paragraph", "block_text"} and children and children[0]["type"] == "text" else text


def slug(text):
    return re.sub(r"\s", "-", re.sub(r"[^\w\-\s]", "", text.lower()))


# 公开稿（本人 11-24 定稿）：访客版按全局《个人资料与数据处理》的两层边界，从本人稿自动生成，每个新规则版本照样能出。
# 改写表是本机私有输入（site-v2/配置/规则公开改写.json，不进公开仓库）：
#   {"替换": [{"old": 原词组, "new": 公开说法, "file": 可选，只改这一页}], "收起的词": [不对外点名的词]}
#   旧格式（只有一个列表、每行带 file）照旧可用。
# 1. 先按“替换”换掉确定的词组（每一处都换），能只改一处的只改那一处；
# 2. 换完仍带“收起的词”的句子（以。！？；为界，加粗、行内代码、链接不拆开）从公开稿拿掉，整段空了就整段拿掉；
# 3. 写着全局通用句的那一段（第一层边界本身）换完仍带收起的词时，公开稿只留开头的加粗小标题和这句通用句（兜底；
#    平时由改写表把这一段改成不点名的说法，其余句子照原文放出）。
# 本人稿不经过这里，原样给配对设备。
GENERIC = "公开版按实际情况说明事项的进展和结果。部分个人细节只在本人版显示。"
SENTENCE_END = re.compile(r"[。！？；](?:[」”’）)]*)")
ATOMIC = re.compile(r"\*\*.+?\*\*|`[^`\n]+`|\[[^\]\n]*\]\([^)\n]*\)")


POLICY_KEYS = {"说明", "替换", "收起的词"}


def kind_of(value):
    return {dict: "对象", list: "列表", str: "文字", int: "数字", float: "数字", bool: "真假值", type(None): "null"}.get(type(value), type(value).__name__)


def load_policy(raw, source="规则公开改写.json"):
    """认两种结构：新格式对象 {"说明", "替换", "收起的词"}，旧格式（只有一个替换列表）。认不出的直接报错停下，不悄悄跳过。"""
    def bad(where, want, value):
        raise ValueError(f"{source}：{where}应是{want}，实际是{kind_of(value)}：{json.dumps(value, ensure_ascii=False)[:120]}")

    def rows(value, where):
        if not isinstance(value, list):
            bad(where, "列表", value)
        for i, row in enumerate(value, 1):
            here = f"{where}第 {i} 项"
            if not isinstance(row, dict):
                bad(here, '对象 {"old", "new", "file"（可选）}', row)
            extra = set(row) - {"old", "new", "file"}
            if extra:
                bad(here, '只带 "old"、"new"、"file"（可选）的对象', row)
            for key in ("old", "new"):
                if not isinstance(row.get(key), str) or (key == "old" and not row[key]):
                    bad(f"{here}的“{key}”", "非空文字" if key == "old" else "文字", row.get(key))
            if "file" in row and not (isinstance(row["file"], str) and row["file"]):
                bad(f"{here}的“file”", "页面文件名（文字）", row["file"])
        return value

    if isinstance(raw, list):
        return dict(replace=rows(raw, "旧格式列表"), hide=[])
    if not isinstance(raw, dict):
        bad("整个文件", '对象 {"替换", "收起的词"} 或旧格式列表', raw)
    unknown = set(raw) - POLICY_KEYS
    if unknown:
        bad(f"顶层的“{'”“'.join(sorted(unknown))}”", "“说明”“替换”“收起的词”之一", {key: raw[key] for key in sorted(unknown)})
    hide = raw.get("收起的词", [])
    if not isinstance(hide, list):
        bad("“收起的词”", "列表", hide)
    for i, word in enumerate(hide, 1):
        if not (isinstance(word, str) and word):
            bad(f"“收起的词”第 {i} 项", "非空文字", word)
    return dict(replace=rows(raw.get("替换", []), "“替换”"), hide=hide)


def sentences(text):
    """按句号、问号、分号切句；加粗、行内代码和链接里面不切，切点落在里面就挪到它后面。"""
    spans = [m.span() for m in ATOMIC.finditer(text)]
    cuts, start = [], 0
    for match in SENTENCE_END.finditer(text):
        end = match.end()
        inside = next((b for a, b in spans if a < end < b), None)
        end = inside if inside is not None else end
        if end > start:
            cuts.append(text[start:end])
            start = end
    if start < len(text):
        cuts.append(text[start:])
    return cuts


def public_line(line, pattern):
    """拿掉一行里带收起词的句子；返回新行和有没有改。整行只剩列表记号、引用记号或加粗小标题时返回空。"""
    if not pattern.search(line):
        return line, False
    if line.lstrip().startswith("|"):
        cells = line.split("|")
        return "|".join((public_line(cell, pattern)[0] or " ") if pattern.search(cell) else cell for cell in cells), True
    lead = re.match(r"^(\s*(?:[-*+]|\d+[.)]|>|#{1,6})?\s*)", line).group(1)
    kept = []
    for part in sentences(line[len(lead):]):
        if pattern.search(part):
            if kept and part.rstrip().endswith(("。", "！", "？")) and kept[-1].rstrip().endswith("；"):
                kept[-1] = kept[-1].rstrip()[:-1] + "。"
            continue
        kept.append(part)
    body = "".join(kept).strip()
    if not body or re.fullmatch(r"\*\*[^*]+\*\*", body):
        return "", True
    return lead + body, True


def public_source(source, output, policy):
    for row in policy["replace"]:
        if row.get("file") not in (None, output):
            continue
        count = source.count(row["old"])
        REWRITE_RESULTS.append(dict(file=output, old=row["old"], new=row["new"], occurrences=count))
        if row.get("file") and count > 1:
            raise ValueError(f"{output}: 公开改写原句出现多次")
        source = source.replace(row["old"], row["new"])
    if not policy["hide"]:
        return source
    pattern = re.compile("|".join(map(re.escape, policy["hide"])))
    lines, fenced, result = source.split("\n"), False, []
    for line in lines:
        if line.lstrip().startswith(("```", "~~~")):
            fenced = not fenced
        if fenced or line.lstrip().startswith(("```", "~~~")):
            result.append("" if pattern.search(line) else line)
            continue
        new, changed = public_line(line, pattern)
        if changed and GENERIC.split("。")[0] in line:
            label = re.match(r"^(\s*(?:[-*+]\s+)?)(\*\*[^*]+\*\*)?", line)
            new = (label.group(1) or "") + ((label.group(2) + " ") if label.group(2) else "") + GENERIC
        if changed:
            REWRITE_RESULTS.append(dict(file=output, old=line, new=new, occurrences=1, kind="收起句子"))
        if changed and not new.strip():
            continue  # 整行拿掉，不留空行，免得把一张列表断成两张
        result.append(new)
    return "\n".join(result)


def load_document(path, output, policy=None):
    source = path.read_text(encoding="utf-8-sig")
    original = source
    if policy:
        source = public_source(source, output, policy)
    soup = BeautifulSoup(MD.render(source), "html.parser")
    # CommonMark treats a full-width colon followed immediately by Han text
    # as literal markers. Repair only labels in ordinary list text, not code.
    for item in soup.find_all("li"):
        for block in item.find_all("p", recursive=False) or [item]:
            first = next(iter(block.children), None)
            if type(first) is NavigableString and (match := LIST_LABEL.match(first)):
                label = soup.new_tag("strong")
                label.string = match[1]
                first.replace_with(label, first[match.end():])
    headings = soup.find_all(re.compile(r"^h[1-6]$"))
    title = soup.find("h1")
    if title is None:
        raise ValueError(f"{path.name}: 缺少一级标题")
    groups = [p for p in soup.find_all("p") if p.find("strong", recursive=False)
              and p.get_text().strip() == p.find("strong", recursive=False).get_text().strip()]
    used = set()
    for tag in [*headings, *groups]:
        base = slug(tag.get_text())
        anchor, number = base, 0
        while anchor in used:
            number += 1
            anchor = f"{base}-{number}"
        tag["id"] = anchor
        used.add(anchor)
    return dict(path=path, output=output, source=source, soup=soup, title=title,
                targets=[*headings, *groups], ids=used, trimmed=source != original)


def rewrite_links(documents, release):
    known = {}
    for doc in documents:
        known[str(doc["path"].resolve()).lower()] = doc
        alias = Path("E:/.agents") / doc["path"].relative_to(release)
        known[str(alias.resolve()).lower()] = doc
    for doc in documents:
        for link in list(doc["soup"].find_all("a", href=True)):
            href = link["href"]
            if re.match(r"https?://", href, re.I):
                continue
            file, mark, fragment = href.partition("#")
            if not file:
                target = doc
            else:
                local = Path(unquote(file).replace("\\", "/"))
                target = known.get(str((doc["path"].parent / local).resolve()).lower())
            if target is None:
                link.unwrap()
                continue
            if fragment and unquote(fragment) not in target["ids"]:
                raise ValueError(f'{doc["path"].name}: 链接锚点不存在：{href}')
            link["href"] = ("" if not file else target["output"]) + (mark + fragment)


def toc_entries(doc, items):
    if items is None:
        return [(h, h.get_text(), 1) for h in doc["soup"].find_all("h2")]
    entries, stale = [], []
    for item in items:
        heading = item["heading"]
        matches = [tag for tag in doc["targets"] if tag.get_text().strip() == heading]
        if len(matches) != 1:
            stale.append(heading)
        else:
            entries.append((matches[0], item["label"], int(item.get("level", 1))))
    if not stale:
        return entries
    print(f'{doc["path"].name}: 目录标题未唯一匹配（{"、".join(stale)}），改用本版正文生成目录', file=sys.stderr)
    targets = doc["soup"].select("h2[id], h3[id], h4[id], h5[id], h6[id], p[id]")
    return [(tag, tag.get_text().strip(), 1 if tag.name == "h2" else 2) for tag in targets]


def make_toc(doc, config):
    items = config.get(doc["path"].name, {}).get("toc")
    result, major = [], 0
    for tag, label, level in toc_entries(doc, items):
        major += level == 1  # 只给大项编号，小项缩进、不编号
        mark = f'<span class="toc-number">{major:02}</span>' if level == 1 else ''
        label_html = escape(label).replace("要什么", '<span class="toc-phrase">要什么</span>')
        result.append(f'<li class="toc-level-{level}"><a href="#{escape(tag["id"], quote=True)}">'
                      f'{mark}<span class="toc-label">{label_html}</span></a></li>')
    return "\n".join(result)


RULE_REF = re.compile(r"（L\d+(?:、L\d+)*）")


def mark_up(soup):
    """只加样式用的标记，字一个不变：条号包一层，专题开头的 owner 行加个类。"""
    for text in list(soup.find_all(string=RULE_REF)):
        if text.find_parent(["code", "pre"]):
            continue
        value, nodes, start = str(text), [], 0
        for match in RULE_REF.finditer(value):
            if match.start() > start:
                nodes.append(NavigableString(value[start:match.start()]))
            ref = soup.new_tag("span", attrs={"class": "rule-ref"})
            ref.string = match.group()
            nodes.append(ref)
            start = match.end()
        if start < len(value):
            nodes.append(NavigableString(value[start:]))
        text.replace_with(*nodes)
    first = soup.find(True)
    if first is not None and first.name == "p" and first.get_text().startswith("owner:"):
        first["class"] = "doc-owner"


def header_html():
    source = (HERE.parent.parent / "list-pages/demo/index.html").read_text(encoding="utf-8-sig")
    header = re.search(r'<header\b.*?</header>', source, re.S).group()
    header = header.replace('<a class="pill" href="#">规则</a>', '<a class="pill" href="index.html" aria-current="page">规则</a>')
    header = header.replace('href="skills.html"', 'href="../../list-pages/demo/skills.html"')
    return header.replace('href="index.html" aria-current="page">项目', 'href="../../list-pages/demo/index.html">项目')


def page_text(doc, page):
    tree = AST(doc["source"])
    expected = normalized("\n".join(source_text(n) for n in tree))
    actual = normalized(dom_text(page.select_one("[data-source-title]")) + dom_text(page.select_one("#rules-body")))
    code_equal = [n["raw"] for n in tree if n["type"] == "block_code"] == [n.get_text() for n in page.select("#rules-body pre code")]
    return expected, actual, code_equal


def check_pages(documents):
    checks, failed = [], []
    for doc in documents:
        page = BeautifulSoup((HERE / doc["output"]).read_text(encoding="utf-8"), "html.parser")
        expected, actual, code_equal = page_text(doc, page)
        passed = actual == expected and code_equal
        checks.append(dict(source=doc["path"].name, page=doc["output"], passed=passed,
                           source_characters=len(expected), page_characters=len(actual), literal_code_preserved=code_equal))
        if not passed:
            failed.append(doc["path"].name)
            diff = "\n".join(unified_diff([expected], [actual], fromfile="source", tofile="page"))
            (HERE / (doc["output"] + ".diff.txt")).write_text(diff, encoding="utf-8")
        print(f'{"PASS" if passed else "FAIL"} {doc["path"].name}: {len(expected)} / {len(actual)}')
    report = dict(passed=not failed, pages=checks, failed=failed,
                  comparison="Independent Mistune source AST vs rendered DOM; whitespace runs normalized only")
    (HERE / "self-check.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if failed:
        raise ValueError("正文逐字自检失败：" + "、".join(failed))


def documents_for(release, topics, policy):
    docs = [load_document(release / "AGENTS.md", "index.html", policy)]
    docs += [load_document(release / f"docs/contracts/agents.{key}.md", f"topic-{key}.html", policy)
             for key, _ in topics]
    for doc in docs:
        doc["word_count"] = sum(not c.isspace() for c in doc["path"].read_text(encoding="utf-8-sig"))
    return docs


def document_parts(doc, documents, config):
    toc = make_toc(doc, config)
    title = doc["title"].extract()
    title["data-source-title"] = ""
    mark_up(doc["soup"])
    topic_words = (f'专题共 {sum(row["word_count"] for row in documents[1:]):,}' if doc["output"] == "index.html"
                   else f'{escape(title.get_text())} {doc["word_count"]:,}')
    return dict(source_title=str(title), toc=toc, body=str(doc["soup"]),
                charter_words=f'{documents[0]["word_count"]:,}', topic_words=topic_words)


def write_owner_pages(release, topics, config, metadata_raw, destination):
    docs = documents_for(release, topics, None)
    hashes = {row["relative_path"]: row["sha256"]
              for row in json.loads(metadata_raw.decode("utf-8-sig"))["files"]}
    for doc in docs:
        path = doc["path"]
        if sha256(path.read_bytes()).hexdigest() != hashes.get(path.relative_to(release).as_posix()):
            raise ValueError(f'本人版正文不在本次规则发布中：{doc["output"]}')
    rewrite_links(docs, release)
    pages = {}
    for doc in docs:
        parts = document_parts(doc, docs, config)
        fragment = parts["source_title"] + '<article id="rules-body">' + parts["body"] + '</article>'
        expected, actual, code_equal = page_text(doc, BeautifulSoup(fragment, "html.parser"))
        if not code_equal or expected != actual:
            raise ValueError(f'本人版正文逐字自检失败：{doc["output"]}')
        pages[Path(doc["output"]).stem] = parts
    version = release.name
    destination.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(dir=destination, mode="w", encoding="utf-8", delete=False) as stream:
        pending = Path(stream.name)
        json.dump(dict(release=version, proof=sha256(metadata_raw).hexdigest(), pages=pages),
                  stream, ensure_ascii=False)
    try:
        pending.replace(destination / f"{version}.json")
    finally:
        pending.unlink(missing_ok=True)


def main():
    REWRITE_RESULTS.clear()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--release", type=Path, default=None,
                        help="规则版本目录；不填就读 E:/.agents/releases/current-rules.json 里当前活动版本")
    parser.add_argument("--toc", type=Path, default=HERE.parent / "目录.json")
    parser.add_argument("--owner-out", type=Path, help="本人正文写入独立的本机运行目录")
    parser.add_argument("--check-only", action="store_true", help="核对已有网页，不重新生成")
    args = parser.parse_args()
    if args.release is None:
        releases = Path("E:/.agents/releases")
        pointer = json.loads((releases / "current-rules.json").read_text(encoding="utf-8-sig"))
        args.release = releases / pointer["current"]["release_id"]
    release = args.release.resolve()
    records = HERE.parents[3] / ".publish/site-v2-rules"
    records.mkdir(parents=True, exist_ok=True)
    policy_path = HERE.parents[2] / "配置/规则公开改写.json"
    policy = load_policy(json.loads(policy_path.read_text(encoding="utf-8-sig")), str(policy_path))
    topics_in_release = [(key, name_parts) for key, name_parts in TOPICS
                         if key != "antigravity-adapter" or (release / f"docs/contracts/agents.{key}.md").is_file()]
    documents = documents_for(release, topics_in_release, policy)
    (records / "流水线-规则改写结果.json").write_text(json.dumps(REWRITE_RESULTS, ensure_ascii=False, indent=2), encoding="utf-8")
    matched = {row["old"] for row in REWRITE_RESULTS if row["occurrences"]}
    for row in policy["replace"]:
        if row["old"] not in matched:
            print(f'规则公开改写未匹配：{row.get("file", "各页")} → {row["old"]}')
    trimmed = sum(row.get("kind") == "收起句子" for row in REWRITE_RESULTS)
    if trimmed:
        print(f"规则公开稿：{trimmed} 处句子只给本人稿（详见 .publish/site-v2-rules/流水线-规则改写结果.json）")
    if not args.check_only:
        config = json.loads(args.toc.read_text(encoding="utf-8-sig")) if args.toc.exists() else {}
        metadata_raw = (release / "release.json").read_bytes()
        metadata = json.loads(metadata_raw.decode("utf-8-sig"))
        version = metadata["release_id"]
        if version != release.name:
            raise ValueError("规则发布文件与目录版号不一致")
        date = datetime.fromisoformat(metadata["created_at_utc"]).astimezone(timezone(timedelta(hours=8)))
        template = Template((HERE / "template.html").read_text(encoding="utf-8"))
        rewrite_links(documents, release)
        charter_title = escape(documents[0]["title"].get_text())
        header = header_html()
        # 访客读到的都是公开版：每页醒目标出“公开版”。“个别内容仅本人可见”只写在约法那页（本人 11-25），
        # 整套里有句子只给本人稿时才写；专题页只标“公开版”。
        owner_only = any(doc["trimmed"] for doc in documents)
        for doc in documents:
            title = escape(doc["title"].get_text())
            parts = document_parts(doc, documents, config)
            topics = "\n".join(f'<li><a href="topic-{key}.html"' +
                               (' aria-current="page"' if doc["output"] == f"topic-{key}.html" else '') +
                               f'>{"<wbr>".join(map(escape, name_parts))}</a></li>' for key, name_parts in topics_in_release)
            charter = ('<a href="index.html"' + (' aria-current="page"' if doc["output"] == "index.html" else '') +
                       f'>{charter_title}</a>')
            kicker = ('' if doc["output"] == "index.html" else
                      f'<p class="rules-kicker"><a href="index.html">{charter_title}</a>'
                      '<span class="rules-kicker-sep"> · </span>专题</p>')
            note = owner_only and doc["output"] == "index.html"
            public_mark = ('<p class="rules-public-mark" data-rule-public-mark><span class="rules-public-mark__tag">公开版</span>'
                           + ('<span class="rules-public-mark__note">个别内容仅本人可见</span>' if note else '') + '</p>')
            page = template.substitute(title=title, kicker=kicker, header=header, charter=charter, public_mark=public_mark,
                                       version=escape(version), date=date.strftime("%Y-%m-%d %H:%M"),
                                       page_key=Path(doc["output"]).stem, topics=topics, **parts)
            if policy["hide"] and (hit := re.search("|".join(map(re.escape, policy["hide"])), page)):
                raise ValueError(f'{doc["output"]}: 公开稿里还有只给本人稿的词（第 {page.count(chr(10), 0, hit.start()) + 1} 行）')
            (HERE / doc["output"]).write_text(page, encoding="utf-8")
    check_pages(documents)
    if args.owner_out and not args.check_only:
        destination = args.owner_out.resolve()
        if destination.is_relative_to(HERE.parents[3]):
            raise ValueError("本人正文必须放在网站工作树外")
        write_owner_pages(release, topics_in_release, config, metadata_raw, destination)


if __name__ == "__main__":
    main()
