"""只按非空产物及修改时间识别进度；不评价内容质量。"""
import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.dont_write_bytecode = True
from project_data import ROOT, load_projects, rows, section, image_dir

BEIJING = timezone(timedelta(hours=8))
STEPS = ["没开工", "清点", "写稿", "查漏（对页）", "补稿", "陌生人读稿",
         "照读者单改", "去向核对", "出图", "做成网页"]


def inventory(directory):
    result = {}
    for path in directory.rglob("*"):
        try:
            if path.is_file():
                result[path] = path.stat()
        except FileNotFoundError:  # 网页施工中刚被替换的文件，下一次刷新再收录
            continue
    return result


def inspect_project(root, project):
    directory = root / project["id"]
    entries = inventory(directory)
    entries.update(inventory(image_dir(directory)))
    files = {path for path, stat in entries.items() if stat.st_size}
    has = lambda pattern: any(p in files for p in directory.glob(pattern))
    draft = directory / "内容稿.md"
    backups = [p for p in files if p.parent == directory and p.match("内容稿.*.md")
               and not p.name.startswith("内容稿.暂缓")]
    readers = [p for p in files if p.parent.name == "清点" and p.match("读者单*.md")]
    expected = None
    if draft in files:
        table = rows(section(draft.read_text(encoding="utf-8-sig"), "分层"))
        counts = [int(c[2]) for c in table if len(c) > 2 and c[2].isdigit()]
        expected = sum(counts) if counts else None
    latest = {}
    image_files = [p for p in files if p.parent == image_dir(directory) and p.suffix.lower() in {".webp", ".jpg", ".jpeg"}]
    for path in image_files:
        match = re.fullmatch(r"(.+)-(\d+)-v(\d+)\.webp", path.name, re.I)
        if match:
            key, version = f"{match[1]}-{int(match[2]):02d}", int(match[3])
            if key not in latest or version > latest[key][0]:
                latest[key] = (version, path.name)
    web = inventory(root / "网站示意" / project["slug"])
    legacy = {p: stat for p, stat in entries.items() if p.parent == directory / "网页示意"}
    html = {p for p, stat in web.items() if stat.st_size and p.suffix.lower() == ".html"}
    if not html:
        html = {p for p, stat in legacy.items() if stat.st_size and p.suffix.lower() == ".html"}
    found = [has("清点/sol-清单.md"), has("内容稿.md") or has("取舍.md") or has("交回.md"),
             has("清点/对页*.md"), bool(backups) and draft in files,
             bool(readers), bool(readers) and draft in files and
             entries[draft].st_mtime > max(entries[p].st_mtime for p in readers),
             has("清点/去向核对.md"), bool(image_files), bool(html)]
    step = max((i for i, value in enumerate(found, 1) if value), default=0)
    times = [s.st_mtime for s in entries.values()]
    if directory.exists():
        times.append(directory.stat().st_mtime)
    modified = datetime.fromtimestamp(max(times), BEIJING).strftime("%Y-%m-%d %H:%M:%S") if times else None
    return dict(name=project["name"], id=project["id"], directory=directory.as_posix(),
                step=step, stage=f"走到 {step} {STEPS[step]}" if step else STEPS[0],
                images_done=len(latest), images_expected=expected, html_pages=len(html),
                latest_images=[v[1] for _, v in sorted(latest.items())],
                last_modified_beijing=modified,
                artifacts={STEPS[i]: bool(value) for i, value in enumerate(found, 1)})


def generate(root=ROOT):
    projects = load_projects(root)
    for path in root.iterdir():
        if path.is_dir() and path.name not in {"工具", "网站示意"} and not path.name.startswith("."):
            projects.setdefault(path.name, dict(id=path.name, name="认不出", slug=path.name))
    records = [inspect_project(root, p) for p in projects.values()]
    lines = ["# 各项目走到哪一步", "", "时间：北京时间（UTC+8）；按非空产物识别，不代表验收通过。",
             "", "| 中文名 | 项目 ID | 目录 | 走到哪一步 | 图（已出／应出） | 网页几页 | 最后改动（北京时间） |",
             "|---|---|---|---|---|---|---|"]
    for p in records:
        total = p["images_expected"] if p["images_expected"] is not None else ("认不出" if p["step"] else "—")
        lines.append(f'| {p["name"]} | {p["id"]} | {p["id"]}/ | {p["stage"]} | '
                     f'{p["images_done"]}／{total} | {p["html_pages"]} | {p["last_modified_beijing"] or "—"} |')
    output = root / "工具"
    output.mkdir(exist_ok=True)
    (output / "状态表.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (output / "状态表.json").write_text(json.dumps(dict(
        generated_at=datetime.now(BEIJING).isoformat(timespec="seconds"), projects=records),
        ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return records


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    try:
        records = generate(args.root.resolve())
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    print(f"已扫描 {len(records)} 个项目；状态表.md、状态表.json 写入 {args.root / '工具'}")
