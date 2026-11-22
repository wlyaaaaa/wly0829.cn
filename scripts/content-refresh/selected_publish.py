"""Keep already published HTML when a selected update changes a shared asset address."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import quote

ASSET = re.compile(rb'https://[a-zA-Z0-9.-]+/releases/[^"\'\s<>?#]+')
FONT = re.compile(r'(公用/(?:fonts|assets/fonts)/.+)-[a-f0-9]{16}(\.(?:css|woff2))')
PROJECT_DATA = re.compile(r'([a-z0-9][a-z0-9-]*)/content\.js')
HTML_PAGE = re.compile(rb'<body\b[^>]*\bdata-page="([^"]+)"')


def routes(batch, route_file):
    return {route_file(route) for route in batch["allowed_routes"]}


def known_addresses(cloud):
    result = {row["url"].encode(): rel for rel, row in cloud["objects"].items()}
    base = cloud["asset_base_url"]
    for key in cloud.get("reference_keys", ()):
        if key.startswith("releases/") and key.count("/") >= 2:
            _, _, rel = key.split("/", 2)
            result.setdefault((base + "/" + quote(key, safe="/~!$&()*+,;=:@-._")).encode(), rel)
    return result


def project_page(body, slug):
    decoder = json.JSONDecoder()
    config = decoder.raw_decode(body.split("window.PROJECT_CONFIG = ", 1)[1])[0]
    pages = config.pop("pages")
    content = decoder.raw_decode(body.split("window.PAGE_DATA = ", 1)[1])[0]
    return config, pages.get(slug), content.get(slug)


def git_file(root, commit, rel):
    if not re.fullmatch(r"[a-f0-9]{40}", commit or ""):
        return None
    result = subprocess.run(["git", "show", f"{commit}:{rel}"], cwd=root, capture_output=True)
    return result.stdout if result.returncode == 0 else None


def preserve_html(dist, source, previous, changes, allowed, read_previous, root):
    if not previous or previous["oss"]["asset_base_url"] != source["oss"]["asset_base_url"]:
        return {}
    from selected_project import WEB

    old_index, new_index = map(known_addresses, (previous["oss"], source["oss"]))
    source_diffs = {}
    old_commit, new_commit = previous.get("source_commit"), source.get("source_commit")

    def versions(rel):
        if rel not in source_diffs:
            path = (WEB / rel).as_posix()
            source_diffs[rel] = [git_file(root, commit, path) for commit in (old_commit, new_commit)]
        return source_diffs[rel]

    def normalize(body, index, techniques):
        def normalize_asset(match):
            rel = index.get(match[0], "")
            if (font := FONT.fullmatch(rel)):
                return (font[1] + font[2]).encode("utf-8")
            if PROJECT_DATA.fullmatch(rel) or rel == "公用/page.css":
                techniques.add(rel)
                return rel.encode("utf-8")
            return match[0]
        return ASSET.sub(normalize_asset, body)

    retained = {}
    for change in changes:
        rel = change["path"]
        if (not rel.endswith(".html") or rel in allowed or rel not in previous["files"]
                or rel not in source["files"]):
            continue
        after = (dist / rel).read_bytes()
        before = read_previous(rel)
        if hashlib.sha256(before).hexdigest() != previous["files"][rel]["sha256"]:
            raise ValueError("上一成功版本页面的字节与清单不符：" + rel)
        techniques = set()
        if normalize(before, old_index, techniques) != normalize(after, new_index, techniques):
            continue
        # A generated project script holds separate arrays for each page.
        # Compare the unselected page's own source data before retaining its old script.
        same_content = True
        for asset in techniques:
            old_raw, new_raw = versions(asset)
            if old_raw is not None and old_raw == new_raw:
                continue
            match = HTML_PAGE.search(after)
            if not (match and old_raw and new_raw and PROJECT_DATA.fullmatch(asset)):
                same_content = False
                break
            slug = match[1].decode("utf-8")
            try:
                same_content = project_page(old_raw.decode("utf-8-sig"), slug) == project_page(new_raw.decode("utf-8-sig"), slug)
            except (KeyError, ValueError, IndexError):
                same_content = False
            if not same_content:
                break
        if same_content:
            retained[rel] = before
    return retained
