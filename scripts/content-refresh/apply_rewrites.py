"""整批校验后机械合入 Opus 屏稿；只修改明确列出的 JSON 值。"""
import argparse, json, re, tempfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
def reject_constant(value): raise ValueError(f"无效 JSON 常量: {value}")
DECODER = json.JSONDecoder(parse_constant=reject_constant)
def read_draft(path):
    raw = path.read_text(encoding="utf-8-sig")
    heading = re.match(r"\A# ([\w-]+)\s*\n", raw)
    sections = list(re.finditer(r"(?m)^## (屏[：:].*|status_line|old_urls)\s*$", raw))
    if not heading or not sections or raw[heading.end():sections[0].start()].strip():
        raise ValueError(f"{path.name}: 缺少页 id 或合稿段落")
    result, seen = [], set()
    for index, section in enumerate(sections):
        name = re.sub(r"^屏[：:]\s*", "屏：", section[1].strip())
        if name in seen:
            raise ValueError(f"{path.name}: 重复段落 {name}")
        seen.add(name)
        body = raw[section.end():sections[index + 1].start() if index + 1 < len(sections) else len(raw)].strip()
        if name.startswith("屏"):
            result.append(("screen", name[2:].strip(), body))
            continue
        fence = re.fullmatch(r"```(?:json)?\s*\n(.*?)\n```", body, re.S)
        try:
            value, end = DECODER.raw_decode(fence[1].strip() if fence else body)
        except ValueError as exc:
            raise ValueError(f"{path.name}: {name}: {exc}") from exc
        tail = "" if fence else re.sub(r"<!--.*?-->", "", body[end:], flags=re.S).strip()
        if tail and not (value == {} and re.fullmatch(r"（不改(?:：[^\n]*)?）", tail)):
            raise ValueError(f"{path.name}: {name} 的 JSON 后有多余内容")
        if (name == "status_line" and not isinstance(value, dict)) or (name == "old_urls" and
                (not isinstance(value, list) or any(not isinstance(url, str) for url in value))):
            raise ValueError(f"{path.name}: {name} 的 JSON 类型不符")
        result.append((name, None, value))
    return heading[1], result
def apply_rewrites(root, drafts):
    root, planned, seen = Path(root), {}, set()
    files = sorted(Path(drafts).glob("*.md"))
    if not files:
        raise ValueError("稿目录没有 Markdown 文件")
    for draft in files:
        slug, sections = read_draft(draft)
        if slug in seen:
            raise ValueError(f"重复页 id: {slug}")
        seen.add(slug)
        path = root / "sources/pages" / slug / "page.json"
        raw = path.read_bytes().decode("utf-8-sig")
        page = json.loads(raw)
        before = json.dumps(page, sort_keys=True)
        screens = {screen["id"]: index for index, screen in enumerate(page["screens"])}
        if page.get("page") != slug or len(screens) != len(page["screens"]):
            raise ValueError(f"{slug}: 作者页 id 不符或屏 id 重复")
        for kind, screen, value in sections:
            if kind == "screen":
                if screen not in screens or not value:
                    raise ValueError(f"{slug}: 屏不存在或稿为空: {screen}")
                page["screens"][screens[screen]]["text"] = value
            elif kind == "status_line":
                if value: page["status_line"] = {**page.get("status_line", {}), **value}
            else:
                page["old_urls"] = list(dict.fromkeys(page.get("old_urls", []) + value))
        if json.dumps(page, sort_keys=True) != before:
            rendered = json.dumps(page, ensure_ascii=False, indent=2) + "\n"
            planned[path] = rendered.replace("\n", "\r\n" if "\r\n" in raw else "\n").encode("utf-8")
    staged = []
    try:
        for path, data in planned.items():
            with tempfile.NamedTemporaryFile(dir=path.parent, prefix=path.name + ".", suffix=".tmp", delete=False) as handle:
                staged.append((path, Path(handle.name)))
                handle.write(data)
        for path, temporary in staged:
            temporary.replace(path)
    finally:
        for _, temporary in staged:
            temporary.unlink(missing_ok=True)
    return dict(pages=len(files), changed_files=[path.relative_to(root).as_posix() for path in planned])

def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("drafts", type=Path)
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args(argv)
    try:
        print(json.dumps(apply_rewrites(args.root, args.drafts), ensure_ascii=False, indent=2))
        return 0
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        print(json.dumps(dict(error=str(exc)), ensure_ascii=False))
        return 1
if __name__ == "__main__":
    raise SystemExit(main())
