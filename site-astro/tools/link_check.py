"""全站站内链接检查（离线，读构建目录 dist）：每页的 <a href>、data-href 里的站内地址，目标页或文件要在 dist 里，
带 #锚点的要在目标页里找得到这个 id。站外地址（http、mailto 等）不查。
用法：python tools/link_check.py <输出 json> [--dist dist] [--skip /,/cockpit/]（skip：由别的任务合入、这里不构建的页）"""
import argparse, html as H, json, os, re, sys, urllib.parse

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--dist", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist"))
ap.add_argument("--skip", default="/,/cockpit/")
a = ap.parse_args()
skip = [x for x in a.skip.split(",") if x]
pages = {}
for root, _, files in os.walk(a.dist):
    for f in files:
        if f.endswith(".html"):
            p = os.path.join(root, f)
            rel = "/" + os.path.relpath(p, a.dist).replace("\\", "/")
            pages[rel] = p
ids_cache = {}


def ids_of(path):
    if path not in ids_cache:
        s = open(path, encoding="utf-8", errors="replace").read()
        ids_cache[path] = set(H.unescape(x) for x in re.findall(r'\sid="([^"]+)"', s))
    return ids_cache[path]


def target_file(url_path):
    path = urllib.parse.unquote(url_path)
    if path.endswith("/"):
        cand = [path + "index.html"]
    elif os.path.splitext(path)[1]:
        cand = [path]
    else:
        cand = [path + "/index.html", path + ".html"]
    for c in cand:
        f = os.path.join(a.dist, *c.lstrip("/").split("/"))
        if os.path.isfile(f):
            return f
    return None


bad, skipped, total = [], 0, 0
for rel, p in sorted(pages.items()):
    s = open(p, encoding="utf-8", errors="replace").read()
    base = rel.rsplit("/", 1)[0] + "/"
    for m in re.finditer(r'<a\b[^>]*?\s(?:href|data-href)="([^"]*)"', s):
        href = H.unescape(m.group(1)).strip()
        if not href or re.match(r'^(?:[a-z][a-z0-9+.-]*:|//)', href, re.I):
            continue
        total += 1
        u = urllib.parse.urlsplit(urllib.parse.urljoin(base, href))
        path, frag = u.path, urllib.parse.unquote(u.fragment)
        if any(path == x for x in skip):
            skipped += 1
            continue
        f = target_file(path)
        if not f:
            bad.append({"page": rel, "href": href, "problem": "目标页或文件不在构建里"}); continue
        if frag and f.endswith(".html") and frag not in ids_of(f):
            bad.append({"page": rel, "href": href, "problem": "目标页里没有这个锚点"})
by = {}
for b in bad:
    by.setdefault(b["problem"], []).append(b)
res = {"pages": len(pages), "links": total, "skipped_other_task": skipped, "bad": len(bad), "by_problem": {k: len(v) for k, v in by.items()}, "items": bad}
json.dump(res, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(pages)} 页，站内链接 {total} 个（指向首页、驾驶舱的 {skipped} 个不查），有问题 {len(bad)} 个", {k: len(v) for k, v in by.items()})
for b in bad[:30]:
    print("  ", b["page"], b["href"], b["problem"])
