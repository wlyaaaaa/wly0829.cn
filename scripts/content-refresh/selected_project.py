"""Use the existing draft parser to replace only selected project page data."""
import hashlib
import importlib.util
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

from editorial_ledger import atomic_write_bytes, read_json

TRIAL = Path("site-v2/trial/first-projects")
WEB = TRIAL / "网站示意"
MARKER = "window.PAGE_DATA = "
DECODER = json.JSONDecoder()


def save_image(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_bytes(path, data)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def dependencies(companion):
    files = companion / "files/site-v2"
    return (load("selected_draft", companion / "files" / WEB / "公用/build-content.py"),
            load("selected_draft_check", files / "建站流水线/工具/check_draft.py"))


def section(root, row):
    pid = row["project"]
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", pid):
        raise ValueError("项目编号无效")
    web = root / WEB / pid
    settings = read_json(web / "project.json")["sections"][row["draft_page"]]
    expected = f"/{pid}/{settings.get('file', settings['slug'] + '.html')}"
    if row["route"] != expected:
        raise ValueError(f"{row['title']} 的项目配置指向 {expected}")
    return web, settings


def page_span(raw, slug):
    offset = raw.index(MARKER) + len(MARKER)
    obj, _ = DECODER.raw_decode(raw, offset)
    if slug not in obj:
        raise ValueError(f"网页素材里没有 {slug}")
    cursor = offset + 1
    for _ in obj:
        key, cursor = DECODER.raw_decode(raw, re.compile(r"\S").search(raw, cursor).start())
        value_at = re.compile(r"\s*:\s*").match(raw, cursor).end()
        value, end = DECODER.raw_decode(raw, value_at)
        if key == slug:
            return value, value_at, end
        cursor = re.compile(r"\s*,").match(raw, end).end()


def snapshot_before(root, folder, page_id, row, prior):
    web, settings = section(root, row)
    source = (web / "content.js").read_bytes().decode("utf-8")
    existing, _, _ = page_span(source, settings["slug"])
    cards = {item["id"]: item for item in existing}
    result = {**prior}
    for ident in row["images"].keys() - prior.keys():
        if ident not in cards:
            continue
        old = web / cards[ident]["image"]
        saved = folder / "images" / page_id / "before" / old.name
        save_image(saved, old.read_bytes())
        result[ident] = str(saved)
    return result


def draft_file(row):
    directory = Path(row["draft_dir"])
    page = directory / "稿" / (row["draft_page"] + ".md")
    return page if page.is_file() else directory / "内容稿.md"


def input_hashes(row):
    paths = [draft_file(row), *map(Path, row.get("images", {}).values())]
    return {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in paths}


def selected_draft(row, checker):
    directory, page = Path(row["draft_dir"]), row["draft_page"]
    source = draft_file(row)
    if source.name == "内容稿.md":
        return source.read_text("utf-8-sig")
    data = checker.page_data(directory, page)
    text = data["text"]
    headings = list(re.finditer(r"^#{1,2} (.+)$", text, re.M))
    sections = {}
    for index, heading in enumerate(headings):
        match = re.fullmatch("(" + re.escape(page) + r"-\d{2,})\s+(.+)", heading[1])
        if match:
            end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
            sections[match[1]] = (match[2], text[heading.end():end])
    pages = {p["name"]: p for p in checker.read_layout(directory)["pages"]}
    return checker.compose({"project_id": row["project"]}, pages, [(page, data)], sections)


def prepare_page(root, folder, page_id, row, tools, raw, web, settings):
    from PIL import Image

    prefix = row["draft_page"]
    converter, checker = tools
    details_only = row.get("details_only", False)
    layers, buttons, sections = converter.parse_draft(selected_draft(row, checker), details_only)
    existing, start, end = page_span(raw, settings["slug"])
    current = {card["id"]: card for card in existing}
    graph = read_json(root / WEB / "公用/页名到地址.json")
    graph.update({href: href for href in graph.values() if href})
    routed_paths = {urlsplit(href).path for href in graph.values() if href}
    assets = {}
    reviewed_images = row.get("images", {})
    if details_only and (reviewed_images or layers[prefix] != len(existing)):
        raise ValueError("只改右栏的页须沿用现有分层和图片")
    cards = []
    for number in range(1, layers[prefix] + 1):
        key = f"{prefix}-{number:02}"
        ident = f"{settings['slug']}-{number:02}"
        card = {**current.get(ident, {}), "id": ident}
        title, body = sections[key]
        card["detail"] = converter.read_detail(body, key)
        if not details_only:
            image_text = body.split("**图上的字**", 1)[-1].split("**右栏的文**", 1)[0]
            card.update(title=title,
                        imageText="\n".join(re.sub(r"^> ?", "", line) for line in image_text.splitlines() if line.startswith(">")))
        if ident in reviewed_images:
            approved = Path(reviewed_images[ident])
            stem = f"{settings['imagePrefix']}-{number:02}"
            if not re.fullmatch(re.escape(stem) + r"-v\d+\.webp", approved.name):
                raise ValueError(f"{ident} 的选定图须使用现行图名和版本号")
            with Image.open(approved) as image:
                image.load()
                if image.format != "WEBP":
                    raise ValueError(f"{ident} 的图不是 WebP")
                card.update(image="assets/" + approved.name, width=image.width, height=image.height)
            target = web / card["image"]
            data = approved.read_bytes()
            if target.exists() and target.read_bytes() != data:
                raise ValueError(f"{approved.name} 的现有版本是另一张图，请使用新版本号")
            report_image = folder / "images" / page_id / "after" / approved.name
            assets[ident] = (target, report_image, data)
        if not card.get("image"):
            raise ValueError(f"{ident} 缺选定图")
        action = buttons.get(f"{settings.get('buttonPrefix', prefix)}-{number:02}")
        if action is not None:
            # Explicit Markdown routes may carry a query or fragment on a registered page.
            for href in re.findall(r"`(/[^\x60]+)`", action):
                path = urlsplit(href).path
                if path in routed_paths:
                    graph[href] = href
            card["buttons"] = converter.read_actions(action, graph, key)
        cards.append(card)
    if reviewed_images.keys() - assets.keys():
        raise ValueError("有选定图不属于该页")
    replacement = json.dumps(cards, ensure_ascii=False, indent=2).replace("\n", "\n  ")
    return raw[:start] + replacement + raw[end:], assets
