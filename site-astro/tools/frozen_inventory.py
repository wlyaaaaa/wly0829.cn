"""盘点冻结快照；非项目 slug 取路由首段（如 skills/system），不伪造项目身份。
接管按构建实际读取的 Markdown url/old_urls 判断；未转换的 JSON 不算已接管。
--routes 与 frozen_to_pages.py 共用每行一路由的 UTF-8 清单；CSV 数组列保留 JSON。"""
import argparse
import csv
import importlib.util
import io
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "site-astro"
SPEC = importlib.util.spec_from_file_location("inventory_build", ROOT / "scripts/build-site.py")
BUILD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILD)
DATE = re.compile(r"(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}(?:[ T]\d{1,2}:\d{2}(?::\d{2})?)?|(?:\d{4}\s*年\s*)?\d{1,2}\s*月\s*\d{1,2}\s*日")
NUMBER = re.compile(r"(?<![A-Za-z0-9_])\d+(?:[.,]\d+)*(?:%|％)?")

class Text(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.skip = None
        self.capture = None
        self.parts = {"text": [], "title": [], "h1": []}
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}: self.skip = tag
        if not self.skip and tag in {"title", "h1"}: self.capture = tag

    def handle_endtag(self, tag):
        if tag == self.skip: self.skip = None
        if tag == self.capture: self.capture = None

    def handle_data(self, data):
        if self.skip: return
        self.parts["text"].append(data)
        if self.capture: self.parts[self.capture].append(data)

def content_claims(content_root):
    claims = {}
    fixed = {BUILD.normalize_route(("/" + path.relative_to(SITE / "src/pages").as_posix().removesuffix(".astro")).removesuffix("/index") or "/")
             for path in (SITE / "src/pages").rglob("*.astro") if "[" not in path.relative_to(SITE / "src/pages").as_posix()}
    for path in sorted(content_root.glob("*.md")):
        page = BUILD.markdown_frontmatter(path)
        for value, kind in [(page.get("url") or "/" + path.stem + "/", "url"),
                            *((url, "old_url") for url in page.get("old_urls") or [])]:
            route = BUILD.normalize_route(value)
            if route in {"/", "/cockpit/", "/computer-access/"}: continue
            if route in claims or route in fixed: raise ValueError("同一路由由两处产出：" + route)
            claims[route] = (path.stem, kind)
    return claims

def inventory(manifest, content_root, projects=(), routes=()):
    claims = content_claims(content_root)
    pages = json.loads(manifest.read_text("utf-8"))["pages"]
    known = {BUILD.file_route(relative) for relative in pages}
    if set(routes) - known: raise ValueError("Unknown frozen routes: " + ", ".join(sorted(set(routes) - known)))
    rows = []
    for relative in sorted(pages):
        route = BUILD.file_route(relative)
        parts = route.strip("/").split("/")
        project = parts[0] == "projects"
        slug = parts[1] if project else parts[0] or "root"
        if (projects and slug not in projects) or (routes and route not in routes): continue
        text = Text((manifest.parent / "pages" / relative).read_text("utf-8"))
        visible = " ".join(text.parts["text"])
        title = " ".join("".join(text.parts["title"] or text.parts["h1"]).split())
        owner, claim = claims.get(route, ("", ""))
        rows.append({"route": route, "slug": slug, "route_kind": ("project_module" if len(parts) > 2 else "project_overview") if project else "site_page",
                     "title": title, "taken_over": bool(owner), "content_page": owner, "claim": claim,
                     "dates": list(dict.fromkeys(DATE.findall(visible))), "numbers": list(dict.fromkeys(NUMBER.findall(visible)))})
    return rows

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=SITE / "sources/frozen-site/manifest.json")
    parser.add_argument("--content-root", type=Path, default=SITE / "src/content/pages")
    parser.add_argument("--project", action="append", default=[], help="按 slug 选取；可重复")
    parser.add_argument("--routes", type=Path, help="每行一路由，与冻结页转换器使用同一清单")
    parser.add_argument("--format", choices=["json", "csv"], default="json")
    parser.add_argument("--output", type=Path, help="省略时输出到标准输出")
    args = parser.parse_args()
    routes = [BUILD.normalize_route(line) for line in args.routes.read_text("utf-8-sig").splitlines() if line.strip() and not line.lstrip().startswith("#")] if args.routes else []
    if len(routes) != len(set(routes)): parser.error("路由清单有重复项")
    rows = inventory(args.manifest, args.content_root, args.project, routes) if not args.routes or routes else []
    output = json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
    if args.format == "csv":
        stream = io.StringIO(newline="")
        writer = csv.DictWriter(stream, fieldnames=["route", "slug", "route_kind", "title", "taken_over", "content_page", "claim", "dates", "numbers"])
        writer.writeheader()
        writer.writerows({**row, "dates": json.dumps(row["dates"], ensure_ascii=False), "numbers": json.dumps(row["numbers"], ensure_ascii=False)} for row in rows)
        output = stream.getvalue()
    if args.output: args.output.write_text(output, encoding="utf-8", newline="")
    else: sys.stdout.write(output)

if __name__ == "__main__": main()
