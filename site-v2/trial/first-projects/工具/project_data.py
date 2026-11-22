"""两个命令共用的本地 Markdown 清单读取；不访问源码仓库。"""
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE_SOURCES = json.loads((ROOT / '工具/图源.json').read_text(encoding='utf-8'))


def image_dir(directory):
    parts = Path(directory).parts
    return ROOT / '网站示意' / parts[parts.index('first-projects') + 1] / 'assets'


def image_source(directory, name):
    parts = Path(directory).parts
    key = '/'.join(parts[parts.index('first-projects') + 1:]) + '/图/' + name
    return ROOT / IMAGE_SOURCES[key] if key in IMAGE_SOURCES else image_dir(directory) / name


def section(text, heading):
    match = re.search(r"^## " + heading + r"[^\n]*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return match[1] if match else ""


def rows(text):
    return [[cell.strip() for cell in line.strip().strip("|").split("|")]
            for line in text.splitlines() if line.startswith("|")]


def load_projects(root=ROOT):
    text = (root / "全站清单.md").read_text(encoding="utf-8-sig")
    projects = {}
    for cells in rows(section(text, "表1")):
        match = re.search(r"（`([^`]+)`）", cells[0])
        if not match:
            continue
        project_id = match[1]
        paths = re.findall(r"`([^`]+)`", cells[1])
        slugs = re.findall(r"`([^`]+)`", cells[3])
        projects[project_id] = dict(id=project_id, name=cells[0].split("（`")[0],
                                   repo=paths[0], source=paths[1],
                                   slug=slugs[0] if slugs else project_id, skills=[])
    if not projects:
        raise ValueError("全站清单.md 表1没有可识别的项目")
    for cells in rows(section(text, "表3")):
        ids = re.findall(r"`([^`]+)`", cells[0])
        if ids and ids[0] in projects:
            projects[ids[0]]["skills"] = re.findall(r"`([^`]+)`", cells[1])
    names = (root / "叫法表-名字.md").read_text(encoding="utf-8-sig")
    for cells in rows(section(names, "项目")):
        if len(cells) > 2 and cells[1].strip("`") in projects:
            name = re.sub(r"（不改）.*$", "", cells[2].replace("**", "")).strip()
            projects[cells[1].strip("`")]["name"] = name
    return projects
