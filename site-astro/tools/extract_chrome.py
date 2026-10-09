"""从现在的候选站点抄页头、页尾和它们用到的共用素材（原文件逐字节复制，不转码）。
用法：python tools/extract_chrome.py <候选站点根目录> [页名 ... | all]
产出：src/chrome/header.html、src/chrome/footer.html、src/chrome/toc-labels.json、public/_shared/...、public/_chrome/*.css"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = sys.argv[1]
SAMPLE = os.path.join(DIST, "skills", "report-page", "index.html")
html = open(SAMPLE, encoding="utf-8").read()


def cut(start, end):
    i = html.index(start); j = html.index(end, i) + len(end)
    return html[i:j]

header = cut('<div class="scenery"', '</dialog>')
footer = cut('<nav class="page-end', '</footer>')  # 含相邻页面导航（上一个/下一个），站点脚本按 page-data 填
# 页尾图片原来靠站点脚本延迟加载；新页不带那份脚本，直接写 src（同一文件）。
footer = footer.replace("data-lazy-srcset=", "srcset=").replace("data-lazy-src=", "src=")
os.makedirs(os.path.join(ROOT, "src", "chrome"), exist_ok=True)
open(os.path.join(ROOT, "src", "chrome", "header.html"), "w", encoding="utf-8").write(header)
open(os.path.join(ROOT, "src", "chrome", "footer.html"), "w", encoding="utf-8").write(footer)

# 样式：页头页尾、背景叶子、目录条（原文件）
css = [m for m in re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
       if "/_shared/site-" in m or "legacy-header" in m or "toc-consistency" in m]
out_css = []
for href in css:
    dst = os.path.join(ROOT, "public", "_chrome", os.path.basename(href))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(os.path.join(DIST, href.lstrip("/")), dst)
    out_css.append("/_chrome/" + os.path.basename(href))

# 目录条标签图：三页各自的分节名和标签图
labels = {}
# 哪些页：命令行第 2 个参数起写页名（all = sources/pages 下全部有 page.json 的页）；不写就是样板 3 页
_names = sys.argv[2:] or ["skill-report-page", "localocr", "rule-engineering-delivery"]
if _names == ["all"]:
    _names = sorted(d for d in os.listdir(os.path.join(os.path.dirname(ROOT), "sources", "pages")) if os.path.exists(os.path.join(os.path.dirname(ROOT), "sources", "pages", d, "page.json")))
PAIRS = []
for _n in _names:
    _url = json.load(open(os.path.join(os.path.dirname(ROOT), "sources", "pages", _n, "page.json"), encoding="utf-8-sig"))["url"]
    if _url:
        _f = os.path.join(DIST, *_url.strip("/").split("/"), "index.html")
    else:
        # 没有网址的页：404 对应现在网站根目录的 404.html；GitHub 个人主页稿现在网站上没有这一页，不抄
        # （以前网址空时拼出来的是根目录 index.html，把首页的目录条和页面数据抄给了这两页）
        _f = os.path.join(DIST, _n + ".html")
    if os.path.exists(_f):
        PAIRS.append((_n, _f))
    else:
        print(_n, "：现在网站上没有对应的页，不抄运行件")
for page, rel in PAIRS:
    h = open(rel, encoding="utf-8").read()
    toc = re.search(r'<nav data-toc-consistency[^>]*>(.*?)</nav>', h, re.S)
    items = []
    if toc:
        for m in re.finditer(r'<a class="nav-link" href="#([^"]+)" data-section="[^"]*" data-label-h="([^"]*)"[^>]*>.*?<img class="image-label" src="([^"]+)"', toc.group(1), re.S):
            items.append({"id": m[1], "label": m[2], "img": m[3]})
    labels[page] = items
    html_all = h
# 只抄了几页时不丢别的页已有的目录标签
_lp = os.path.join(ROOT, "src", "chrome", "toc-labels.json")
_all = json.load(open(_lp, encoding="utf-8")) if os.path.exists(_lp) else {}
_all.update(labels)
json.dump(_all, open(_lp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# 复制页头页尾、目录条和样式里引用到的 /_shared 文件
refs = set(re.findall(r'(/_shared/[^"\')\s,]+)', header + footer))
for c in out_css:
    refs |= set(re.findall(r"url\(['\"]?(/_shared/[^'\")]+)", open(os.path.join(ROOT, "public", c.lstrip("/")), encoding="utf-8").read()))
for items in labels.values():
    refs |= {i["img"] for i in items}
n = 0
for r in sorted(refs):
    src = os.path.join(DIST, r.lstrip("/"))
    if os.path.isfile(src):
        dst = os.path.join(ROOT, "public", r.lstrip("/"))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst); n += 1
    else:
        print("缺文件", r)
json.dump({"css": out_css}, open(os.path.join(ROOT, "src", "chrome", "chrome.json"), "w", encoding="utf-8"), indent=1)
print("css", out_css, "共用素材", n, "目录", {k: len(v) for k, v in labels.items()})

# —— 动效运行件：翻页过渡（album）、站点运行脚本（水彩流动、落叶、回顶、小鸟彩蛋）、环境动画引擎（living）——
# 原样抄现有页面实际加载的脚本和数据；只有两处按新版面重绑：album-page 的节点改指新页的插画和标题，
# 环境动画改用 src/scripts/living-mount.js（旧的 typeset-living.js 依赖整屏 PNG 结构）。
RUNTIME_DIR = os.path.join(ROOT, "src", "chrome", "runtime")
os.makedirs(RUNTIME_DIR, exist_ok=True)
HEAD_PATTERNS = [
    r'<link rel="preload" as="fetch" href="/_album/[^"]+"[^>]*>',
    r'<link rel="stylesheet" href="/_album/[^"]+"[^>]*>',
    r'<script data-resource-retry-capture[^>]*>.*?</script>',
    r'<script id="album-page" type="application/json">.*?</script>',
    r'<script data-album-inline>.*?</script>',
    r'<script\s+data-album-runtime[^>]*></script>',
    r'<script type="application/json" id="toc-label-data">.*?</script>',
    r'<script defer data-resource-retry[^>]*></script>',
    r'<link data-living-runtime rel="stylesheet"[^>]*>',
]
copy_refs = set()
for page, rel in PAIRS:
    h = open(rel, encoding="utf-8").read()
    head = h[:h.index("</head>")]
    parts = []
    for pat in HEAD_PATTERNS:
        parts += re.findall(pat, head, re.S)
    tail = h[h.index("</footer>") + len("</footer>"):h.index("</body>")]
    tail = re.sub(r'<script data-living-runtime src="/_living/_engine/typeset-living[^"]*"[^>]*></script>', "", tail)
    album = json.loads(re.search(r'<script id="album-page" type="application/json">(.*?)</script>', h, re.S)[1])
    living_cfg = re.search(r'data-living-config="([^"]+)"', h)
    living_bind = re.search(r'data-living-binding="([^"]+)"', h)
    import html as _h
    toc_m = re.search(r'<nav[^>]*class="toc"[^>]*aria-label="本页目录"[^>]*>.*?</nav>', h, re.S)
    rt = {"head": parts, "tail": tail, "album": album, "toc_html": toc_m[0] if toc_m else None,
          "living_config": living_cfg[1] if living_cfg else None,
          "living_binding": json.loads(_h.unescape(living_bind[1])) if living_bind else None}
    json.dump(rt, open(os.path.join(RUNTIME_DIR, page + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
    blob = chr(10).join(parts) + tail + (toc_m[0] if toc_m else "")
    copy_refs |= set(re.findall(r'(/_(?:album|shared|typeset/runtime|living/_engine)/[^"\'\s\),]+)', blob))
    if living_cfg:
        copy_refs.add(living_cfg[1])

def copy_tree(rel):
    src = os.path.join(DIST, rel)
    for base, _, files in os.walk(src):
        for f in files:
            s = os.path.join(base, f)
            d = os.path.join(ROOT, "public", os.path.relpath(s, DIST))
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copyfile(s, d)

copy_tree("_living/_engine")
# 纹理只复制三页配置里用到的（见下面按配置复制）
k = 0
for r in sorted(copy_refs):
    src = os.path.join(DIST, r.lstrip("/"))
    if os.path.isfile(src):
        dst = os.path.join(ROOT, "public", r.lstrip("/"))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst); k += 1
        if r.startswith("/_living/") and r.endswith("config.json"):
            cfg = json.load(open(src, encoding="utf-8"))
            for m in re.findall(r'"(/_living/[^"]+)"', json.dumps(cfg)):
                s2 = os.path.join(DIST, m.lstrip("/"))
                if os.path.isfile(s2):
                    d2 = os.path.join(ROOT, "public", m.lstrip("/")); os.makedirs(os.path.dirname(d2), exist_ok=True); shutil.copyfile(s2, d2); k += 1
print("动效运行件：复制", k, "个文件")
