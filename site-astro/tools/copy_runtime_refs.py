"""把运行件（src/chrome/runtime/*.json）里页面实际会加载的脚本、样式、图片，以及脚本 import 的模块、样式 url()/@import 的文件
（例如 b2-typeset 脚本 import 的 b2-access-model），从现在网站的构建目录原样复制到 public/（逐字节，不转码；缺的才复制）。
页面数据里旧整屏图的清单新页不用（站点脚本拿到的屏清单是空的），不复制；脚本里只是字符串提到的文件（例如资源重试脚本里的全站清单）不跟。
用法：python tools/copy_runtime_refs.py <现在网站构建目录> [页名 ... | all] [--dry-run]"""
import json, os, re, shutil, sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = sys.argv[1]
DRY = "--dry-run" in sys.argv
names = [a for a in sys.argv[2:] if a != "--dry-run"] or ["all"]
RT = os.path.join(SITE, "src", "chrome", "runtime")
if names == ["all"]:
    names = sorted(f[:-5] for f in os.listdir(RT) if f.endswith(".json"))
P = r'(/_(?:album|shared|typeset/runtime|living/_engine|how-demo)/[^"\'\s\),`]+)'
REF = re.compile(P)
JS_DEP = re.compile(r'(?:\bfrom\s*|\bimport\s*\(?\s*)[\'"]' + P + r'[\'"]')
CSS_DEP = re.compile(r'(?:url\(\s*[\'"]?|@import\s+[\'"])' + P)


def page_blob(d):
    tail = re.sub(r'(<script id="page-data" type="application/json">)(.*?)(</script>)',
                  lambda m: m.group(1) + json.dumps({k: v for k, v in json.loads(m.group(2)).items() if k != "screens"}) + m.group(3),
                  d.get("tail") or "", flags=re.S)
    head = [h for h in (d.get("head") or []) if not h.startswith('<script id="album-page"')]
    return "\n".join(head) + tail + (d.get("toc_html") or "")


todo = set()
for n in names:
    d = json.load(open(os.path.join(RT, n + ".json"), encoding="utf-8"))
    todo |= set(REF.findall(page_blob(d)))
seen, copied, missing = set(), 0, []
while todo:
    r = todo.pop()
    if r in seen:
        continue
    seen.add(r)
    src = os.path.join(DIST, *r.lstrip("/").split("/"))
    dst = os.path.join(SITE, "public", *r.lstrip("/").split("/"))
    if not os.path.isfile(src):
        if not os.path.isfile(dst):
            missing.append(r)
        continue
    if not os.path.isfile(dst) and not DRY:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)
        copied += 1
    if r.endswith(".js"):
        todo |= set(JS_DEP.findall(open(src, encoding="utf-8", errors="replace").read())) - seen
    elif r.endswith(".css"):
        todo |= set(CSS_DEP.findall(open(src, encoding="utf-8", errors="replace").read())) - seen
if DRY:
    print("\n".join(sorted(seen)))
else:
    print(f"{len(names)} 页的运行件：用到 {len(seen)} 个文件，新复制 {copied} 个，现在网站上也没有的 {len(missing)} 个", missing[:10])
