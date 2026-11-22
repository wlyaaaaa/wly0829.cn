"""按共用表提醒文字不一致；只写一致扫描.md / .json，不改稿、不联网。"""
import argparse
import importlib.util
from collections import Counter, defaultdict
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
from project_data import ROOT, rows, section

CATEGORIES = "名字 按钮 称呼 技能归属 别名 行话 禁用词 旧名 未识别".split()
_policy_spec = importlib.util.spec_from_file_location('site_public_words', Path(__file__).resolve().parents[4] / 'scripts/site_public_words.py')
_policy = importlib.util.module_from_spec(_policy_spec)
_policy_spec.loader.exec_module(_policy)
load_formal_public_policy, formal_public_word_pattern = _policy.load_policy, _policy.word_pattern
def load_public_policy(path=None, root=ROOT):
    policy = _policy.load_policy(path)
    local = [s.strip() for s in read(Path(root) / "公开页禁用词.txt").splitlines() if s.strip()]
    return {**policy, 'words': sorted(set(policy['words']) | set(local), key=lambda word: (-len(word), word))}


def public_word_pattern(policy):
    # Test the left boundary after the literal so the regex keeps its fast initial-character scan.
    return '|'.join(re.escape(word) + r'(?<![A-Za-z0-9]' + re.escape(word) + r')(?![A-Za-z0-9])'
                    if word.isascii() else re.escape(word) for word in policy['words']) or r'(?!)'


def public_words(root=ROOT):
    policy = load_public_policy(root=root)
    return policy['words'], re.compile(public_word_pattern(policy))



def read(path):
    return path.read_text(encoding="utf-8-sig")


def table(path, heading):
    result, header, active = [], None, False
    for number, line in enumerate(read(path).splitlines(), 1):
        if line.startswith("## "):
            active, header = line[3:].startswith(heading), None
        if active and line.startswith("|"):
            cells = rows(line)[0]
            if header is None:
                header = cells
            elif not all(re.fullmatch(r"[: -]+", c) for c in cells):
                result.append(dict(zip(header, cells), _line=number))
    return result


def clean(value):
    return re.sub(r"[（(]不改[）)].*$", "", value).replace("**", "").strip(" `")


def pattern(word):
    return (r"(?<![A-Za-z0-9_])" if re.match(r"[A-Za-z0-9_]", word) else "") + re.escape(word) + (
        r"(?![A-Za-z0-9_])" if re.search(r"[A-Za-z0-9_]$", word) else "")


def matcher(words):
    return re.compile("|".join(pattern(w) for w in sorted(set(words), key=lambda w: (-len(w), w))) or r"(?!)")


def rules(root):
    path = root / "表/归属表.md"
    projects, skills, children = (table(path, h) for h in ("项目表", "技能表", "子页表"))
    names = {r.get("中文名", r.get("子页名")): r for r in projects + skills + children}
    names = {k: v for k, v in names.items() if k not in {"—", "待起名"}}
    common = table(root / "表/人话词表.md", "常用词")
    jargon = table(root / "表/人话词表.md", "行话")
    terms = {r["词"]: ("行话", r["说成什么"]) for r in jargon}
    for row in common:
        for alias in row["别名（页上不用）"].split("、"):
            if alias != "—":
                terms[alias] = ("别名", row["词"])
    for word in [*names, *(word for r in common for word in r["词"].split("、"))]:
        terms[word] = (None, "")
    for word in ("服务器", "服务商", "AI 服务", "AI服务"):  # 行话表明写这些“服务”不算。
        terms[word] = (None, "")
    old = defaultdict(set)
    for heading in ("项目（", "技能（"):
        for row in table(root / "叫法表-名字.md", heading):
            before, new = row["现名"], clean(row["新名"])
            variants = [re.split(r"[（(]", before)[0]]
            for extra in re.findall(r"[（(]([^）)]*)[）)]", before):
                variants.extend(x.split("：", 1)[1] for x in extra.split("；") if "：" in x)
            for variant in variants:
                word = clean(variant)
                if word and word not in {new, "无页", "—"}:
                    old[word].add(new)
    banned, ban_re = public_words(root)
    return dict(projects=projects, skills=skills, children=children, names=names, terms=terms,
                lex=matcher(terms), old=old, old_re=matcher([*old, *names]), banned=banned, ban_re=ban_re)


def check(text, pronoun, rule):
    for match in re.finditer(r"〔([^〕]+)〕", text):
        name = match[1]
        if name not in rule["names"]:
            yield match.start(), "名字", name, " / ".join(sorted(rule["old"].get(name, []))) or "在归属表核对中文名、子页名"
        elif rule["names"][name]["状态"] not in {"做完", "要做"}:
            yield match.start(), "按钮", name, "这里不该有按钮（状态：" + rule["names"][name]["状态"] + "）"
    for match in rule["ban_re"].finditer(text):
        yield match.start(), "禁用词", match[0], "只是提示，不拦；由写稿 AI 按意思判断是否修改"
    # 文件名和仓库地址仍查禁用词；其中英文仓库标识不是展示旧名。
    old_text = re.sub(r"`[^`]*[./\\][^`]*`", lambda m: " " * len(m[0]), text)
    for match in rule["old_re"].finditer(old_text):
        if match[0] in rule["old"] and not (re.fullmatch(r"[A-Za-z0-9_. -]+", match[0]) and re.search(r"出处：|代码仓库[：:]", text)):
            yield match.start(), "旧名", match[0], " / ".join(sorted(rule["old"][match[0]]))
    body = re.sub(r"〔[^〕]*〕", lambda m: " " * len(m[0]), text)
    for match in rule["lex"].finditer(body):
        kind, suggestion = rule["terms"][match[0]]
        if kind:
            yield match.start(), kind, match[0], suggestion
    body = matcher(rule["names"]).sub(lambda m: " " * len(m[0]), body)
    body = re.sub(r'“[^”]*”|‘[^’]*’|"[^"\n]*"', lambda m: " " * len(m[0]), body)
    body = re.sub(r"Windows\s*(?:账户|帐户|账号)?用户|用户(?=账户|帐户|账号)", lambda m: " " * len(m[0]), body)
    for match in re.finditer(r"本人|你|用户|我", body):
        if match[0] in {"你", "本人"} or (pronoun and match[0] != pronoun):
            yield match.start(), "称呼", match[0], "页上统一用“" + (pronoun or "归属表规定的称呼") + "”"


def pages(draft, project, rule):
    project_row = next((r for r in rule["projects"] if r["项目ID"] == project), {})
    result, aliases = {}, {}
    for cells in rows(section(draft, "分层")):
        if len(cells) < 3 or not cells[2].isdigit() or int(cells[2]) == 0:
            continue
        page, row = cells[1].strip("`"), project_row
        if page.startswith("技能-"):
            row = next((r for r in rule["skills"] if r["技能ID"] == page[3:]), {})
        elif page.startswith("子页-"):
            row = next((r for r in rule["children"] if r["子页名"] == page[3:] and r["归属项目ID"] == project), project_row)
        result[page] = row.get("称呼", project_row.get("称呼")) if row else None
        for alias in (page, page.removeprefix("子页-"), row.get("中文名", "")):
            if alias:
                aliases[alias] = page
    skill_pages = [p for p in result if p.startswith("技能-")]
    if len(skill_pages) == 1:
        aliases["技能"] = skill_pages[0]
    return result, aliases


def page_for(label, aliases):
    return next((aliases[a] for a in sorted(aliases, key=len, reverse=True)
                 if label == a or label.startswith(a + "-")), None)


def draft_lines(text, aliases):
    page, mode = None, ""
    for n, line in enumerate(text.splitlines(), 1):
        if line.startswith("## "):
            page, mode = page_for(line[3:].split(" ")[0], aliases), ""
        if "按钮一览" in line and (line.startswith("## ") or line.startswith("按钮一览")):
            mode = "buttons"
        if line.startswith("**图上的字**") or line.startswith("**右栏的文**"):
            mode = "text"
            continue
        if line.startswith("---"):
            mode = ""
        if mode == "buttons" and line.startswith("|"):
            cells = rows(line)[0]
            if cells[0] not in {"图", "页"} and not re.fullmatch(r"[-: ]+", cells[0]):
                if not cells[1].startswith(("暂不放按钮", "无")):
                    yield n, re.sub(r"（[^）]*）", "", cells[1]), page_for(cells[0], aliases)
        elif page and (mode == "text" or line.startswith("**按钮**")):
            yield n, line, page


def prompt_lines(text):
    output, active, recognized, started = [], "", False, False
    for n, line in enumerate(text.splitlines(), 1):
        if re.match(r"^(左下角|参考图|除了这些字|除这些|除此之外)", line) or (active == "paragraph" and started and not line.strip()):
            active = ""
        if re.match(r"^图上.*字如下", line):
            active, recognized = "block", True
            continue
        if re.search(r"(?:换成|替换为|改成)下面(?:这段|这些字|这行)", line):
            active, started = "paragraph", False
            continue
        labels = re.match(r"^.{0,30}字依次换成：([^（]+)", line)
        if labels:
            output.append((n, labels[1]))
        button = re.match(r"^按钮上(?:逐字印|原样印这行字)[^：]*：", line)
        body = re.match(r"^(正文|题跋)[（(：:]", line)
        title = re.match(r"^.{0,25}(上的字|上的标题|上的大字)[（(：:]", line)
        if button or body or title:
            value = re.split(r"[：:]", line, maxsplit=1)[-1]
            if value:
                output.append((n, value))
            active, recognized, started = ("paragraph" if button or body else ""), True, bool(value)
            continue
        if active and line.strip():
            output.append((n, line))
            started = True
    if not recognized:
        for n, line in enumerate(text.splitlines(), 1):
            output.extend((n, m[1]) for m in re.finditer(r"(?:改成|换成|变成|替换为|替换成)“([^”]+)”", line))
    return output, recognized


def scan(root=ROOT):
    root, findings, summaries, coverage = Path(root), [], [], []
    rule = rules(root)
    def add(project, file, line, kind, text, suggestion, word="", column=1, page=None):
        start = max(0, column - 16)
        snippet = text.strip() if kind == "禁用词" else text[start:start + 40].strip()
        findings.append(dict(project=project, file=file, line=line, category=kind, text=snippet,
                             suggestion=suggestion, match=word, column=column, page=page))
    by_id = defaultdict(list)
    project_ids = {r["项目ID"] for r in rule["projects"]}
    for row in rule["skills"]:
        by_id[row["技能ID"]].append(row)
    for skill, entries in by_id.items():
        if len(entries) > 1 or any(e["归属项目ID"] not in project_ids and not
                                  (e["状态"] == "不上网站" and e["归属项目ID"] == "—") for e in entries):
            for e in entries:
                add(e["归属项目ID"], "表/归属表.md", e["_line"], "技能归属", skill,
                    "技能ID只能一行、归一个项目：" + "、".join(r["归属项目ID"] for r in entries))
    for directory in sorted(root.iterdir()):
        draft = directory / "内容稿.md"
        if not directory.is_dir() or not draft.is_file():
            continue
        project, text = directory.name, read(draft)
        page_map, aliases = pages(text, project, rule)
        if not page_map:
            add(project, f"{project}/内容稿.md", 1, "未识别", "分层表没有可识别页名", "核对分层表，称呼尚未检查")
        for page, pronoun in page_map.items():
            if not pronoun:
                add(project, f"{project}/内容稿.md", 1, "未识别", page, "归属表没有该页的称呼，须核对页名或技能ID")
        inputs = [(draft, list(draft_lines(text, aliases)))]
        for path in sorted(directory.rglob("*")):
            if path.suffix.lower() not in {".txt", ".md"} or not any(
                    "提示" in part or "prompt" in part.lower() for part in path.relative_to(directory).parts):
                continue
            if "背景" in path.name:
                continue
            lines, full = prompt_lines(read(path))
            page = page_for(path.stem, aliases)
            if not full or not page:
                add(project, path.relative_to(root).as_posix(), 1, "未识别", path.name,
                    ("局部修改，只检查能认出的新文字片段；原图保留文字须人看" if not full else "页名认不出，称呼须人看"))
            inputs.append((path, [(n, s, page) for n, s in lines]))
        for path, lines in inputs:
            coverage.append(dict(project=project, file=path.relative_to(root).as_posix(), lines=len(lines)))
            for n, line, page in lines:
                for col, kind, word, suggestion in check(line, page_map.get(page), rule):
                    add(project, path.relative_to(root).as_posix(), n, kind, line, suggestion, word, col + 1, page)
        counts = Counter(f["category"] for f in findings if f["project"] == project)
        name = next((r["中文名"] for r in rule["projects"] if r["项目ID"] == project), project)
        summaries.append(dict(id=project, name=name, counts={k: counts[k] for k in CATEGORIES}))
    return dict(projects=summaries, findings=findings, coverage=coverage)


def generate(root=ROOT):
    root, result = Path(root), scan(root)
    lines = ["# 全站一致扫描", "", "| 项目 | " + " | ".join(CATEGORIES) + " |", "|---|" + "---|" * len(CATEGORIES)]
    for p in result["projects"]:
        lines.append(f'| {p["name"]}（{p["id"]}） | ' + " | ".join(str(p["counts"][k]) for k in CATEGORIES) + " |")
    lines += ["", "每次命中计一处；稿和提示分开计，提示含旧版本。仅扫正式内容稿的图文和按钮；提示只扫可认出的待印文字。",
              "称呼不查引号里的话及明确的 Windows 用户账户；行话已解释过也会提醒，备注中的例外由人判断。未识别表示局部保留文字或页名不能自动核对。源码公开性未查。", "",
              "| 项目 | 文件 | 行 | 类别 | 那句话（禁用词显示整句） | 建议 |", "|---|---|---|---|---|---|"]
    for f in result["findings"]:
        cells = [f["project"], f["file"], str(f["line"]), f["category"], f["text"], ("命中“"+f["match"]+"”；" if f["category"] == "禁用词" else "")+f["suggestion"]]
        lines.append("| " + " | ".join(s.replace("|", "\\|").replace("\n", " ") for s in cells) + " |")
    (root / "工具/一致扫描.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (root / "工具/一致扫描.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    result = generate(parser.parse_args().root)
    for project in result["projects"]:
        print(project["name"] + "：" + "，".join(f"{k}{v}" for k, v in project["counts"].items()))
    for item in result['findings']:
        if item['category'] == '禁用词': print(f"{item['file']}:{item['line']}：禁用词“{item['match']}”（只是提示，不拦）：{item['text']}")
