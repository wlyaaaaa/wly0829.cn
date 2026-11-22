"""Generate the website principles page from the approved Markdown files."""
import argparse
import hashlib
import json
import re
import shutil
from html import escape
from pathlib import Path

import markdown
from bs4 import BeautifulSoup
from PIL import Image

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "文稿"
OUTPUT = HERE.parents[1] / "demo"
SITE = HERE.parents[4] / "dist"
VIZ = HERE.parent / "viz"
LIVE_SOURCE = HERE.parents[3] / "live"  # 实况在原理页之后才组装进站，查实况页在不在先看源码
FILES = ["文章标题.md", "引言.md", "第1节-设备互联.md", "第2节-数据采集与回溯.md",
         "第3节-个人理解.md", "第4节-凭据与数据安全.md", "第5节-代办事务.md", "第6节-内容制作.md",
         "第7节-无人值守与通知.md", "第8节-系统维护与恢复.md", "第9节-多模型协作.md",
         "第10节-规则与演进.md", "第11节-综合示例.md"]


def read_body(name):
    return re.split(r"(?m)^---\s*$", (SOURCE / name).read_text(encoding="utf-8-sig"), maxsplit=1)[1].strip()


def plain(text):
    return re.sub(r"\s", "", text)


def count_words(text):
    """汉字逐字计数，连续英文字母和数字计一字；标点、空白不计。"""
    return len(re.findall(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f\U00030000-\U000323af]|[A-Za-z0-9]+", text))


def body_text(page):
    body = BeautifulSoup(str(page), "html.parser")
    for figure in body.select(".viz"):
        figure.decompose()
    return plain("".join(el.get_text() for el in body.select(".rules-title, .rules-body")))


def add_viz(article, output):
    figures = json.loads((VIZ / "figures.json").read_text(encoding="utf-8"))
    for item in figures:
        matches = [p for p in article.select("p") if item["after"] in p.get_text()]
        assert len(matches) == 1, f'配图位置不唯一：{item["id"]}'
        caption = item["caption"]
        lead, stop, rest = caption.partition("。")
        cap = (f'<figcaption class="viz__cap"><span class="viz__lead">{escape(lead + stop)}</span>{escape(rest)}</figcaption>' if caption else "")
        source = VIZ / item["file"]
        target = output / item["file"]
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        if source.suffix == ".webp":
            with Image.open(source) as image:
                w, h = image.size
            plate = (f'<div class="viz__plate"><img src="{escape(item["file"])}" alt="{escape(item["alt"])}" '
                     f'width="{w}" height="{h}" loading="lazy" decoding="async"></div>')
        else:
            # 示意图各是一个文件，组装时和别的图一样改成 OSS 地址；viz.js 滑到附近才取回来内联进衬底，
            # 图里的字照样用页面字体、受 viz.css 管，动效也够得着。衬底按 viewBox 先占好位，图到了页面不跳。
            w, h = re.search(r'viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"', source.read_text(encoding="utf-8")).groups()
            plate = f'<div class="viz__plate" data-src="{escape(item["file"])}" style="aspect-ratio:{w}/{h}"></div>'
        figure = BeautifulSoup(f'<figure class="{item["class"]}" id="viz-{item["id"]}">{plate}{cap}</figure>', "html.parser")
        if item["after"].startswith("【图："):
            assert matches[0].get_text() == item["after"], f'配图记号须独占一段：{item["id"]}'
            matches[0].replace_with(figure)
        else:
            matches[0].insert_after(figure)
    intro = next(p for p in article.select("p") if "说得准的事交给程序" in p.get_text())
    text = str(intro)
    for word, cls in (("交给程序", ""), ("交给 AI", " viz-dot--ai"), ("要我们定", " viz-dot--we")):
        offset = {"交给程序": 2, "交给 AI": 3, "要我们定": 1}[word]
        text = text.replace(word, word[:offset] + f'<span class="viz-dot{cls}" aria-hidden="true"></span>' + word[offset:], 1)
    intro.replace_with(BeautifulSoup(text, "html.parser"))
    section = article.select_one("#section-11")
    for p in section.find_all_next("p"):
        if p.find_parent("figure"):
            continue
        for node in list(p.find_all(string=re.compile(r"见第\s*\d+\s*节"))):
            node.replace_with(BeautifulSoup(re.sub(r"见第\s*(\d+)\s*节", lambda m: f'<a href="#section-{int(m[1]):02}">{m[0]}</a>', escape(str(node))), "html.parser"))


def make_names(kind, article, site):
    index = BeautifulSoup((site / kind / "index.html").read_text(encoding="utf-8"), "html.parser")
    aliases = json.loads((HERE / "aliases.json").read_text(encoding="utf-8"))
    # remote-control 并入 pcconfig 后仍有专页，按标识补回，不依赖中文叫法。
    if kind == "projects" and not index.select_one("#p-remote-control"):
        index.append(index.new_tag("a", attrs={"class": "piece", "id": "p-remote-control",
                                              "href": "/pcconfig/remote.html"}))
    found = []
    for card in index.select(".piece"):
        image = card.select_one("img.piece__art")
        label = card.select_one(".todo__name")
        name = image.get("alt", "") if image else label.get_text() if label else ""
        slug = re.sub(r"^[ps]-", "", card.get("id", ""))
        candidates = [name] + aliases.get(kind, {}).get(slug, [])
        hits = [(article.find(alias), alias) for alias in candidates if alias and alias in article]
        if hits:
            position, matched = min(hits)
            href = card.get("href", "")
            target = site / href.lstrip("/").split("#", 1)[0]
            if not href.startswith("/") or not (target.is_file() or (target / "index.html").is_file()):
                href = ""
            found.append(dict(name=name, slug=slug, matched=matched, position=position, href=href))
    return sorted(found, key=lambda row: row["position"])


def page_exists(href, site):
    path = href.split("#", 1)[0].lstrip("/")
    if (site / path).is_file() or (site / path / "index.html").is_file():
        return True
    return path.startswith("live/") and (LIVE_SOURCE / path[len("live/"):] / "index.html").is_file()


def make_pages(article, site):
    """文中提到的实况各页、规则页等：按 linked-pages.json 的叫法找，页面还没建好的只显示名字（预留）。"""
    found = []
    for page in json.loads((HERE / "linked-pages.json").read_text(encoding="utf-8")):
        hits = [(article.find(word), word) for word in page["match"] if word in article]
        if hits:
            href = page["href"] if page_exists(page["href"], site) else ""
            slug = page["href"].strip("/").replace("/", "-") or "home"
            found.append(dict(name=page["name"], slug=slug, matched=page["name"], position=min(hits)[0], href=href))
    return sorted(found, key=lambda row: row["position"])


def build(published, site=SITE, output=OUTPUT):
    output.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(HERE / "principles.css", output / "principles.css")
    for name in ("viz.css", "viz.js"):
        shutil.copyfile(VIZ / name, output / name)
    (output / "article-spacing.css").unlink(missing_ok=True)
    raw = [read_body(name) for name in FILES]
    title = BeautifulSoup(markdown.markdown(raw[0]), "html.parser")
    heading, subtitle = title.h1.get_text(), title.p.get_text()
    article = BeautifulSoup(markdown.markdown("\n\n".join(raw[1:]), extensions=["nl2br"]), "html.parser")
    toc = []
    section = 0
    for el in article.select("h2, h3"):
        if el.name == "h2":
            section += 1
            number, label = el.get_text().split(" ", 1)
            el["id"] = f"section-{section:02}"
            el.clear()
            el.append(BeautifulSoup(f'<span class="section-number" data-number="{section:02}">{number}</span> {escape(label)}', "html.parser"))
            toc.append(f'<li><a href="#{el["id"]}"><span class="toc-number">{section:02}</span><span class="toc-label">{escape(label)}</span></a></li>')
        else:
            el["id"] = f"section-{section:02}-sub-{len(toc)}"
            toc.append(f'<li class="toc-level-2"><a href="#{el["id"]}"><span class="toc-label">{escape(el.get_text())}</span></a></li>')
    add_viz(article, output)
    prose = BeautifulSoup(str(article), "html.parser")
    for decoration in prose.select(".viz, .section-number"):
        decoration.decompose()
    word_count = count_words(prose.get_text())
    header = BeautifulSoup((site / "rules" / "index.html").read_text(encoding="utf-8"), "html.parser").header
    header.select_one('[aria-current="page"]').attrs.pop("aria-current")
    current = next(a for a in header.select("a.pill") if a.get_text() == "原理")
    current["aria-current"], current["href"] = "page", "/principles/"
    names = {kind: make_names(kind, "\n\n".join(raw), site) for kind in ("projects", "skills")}
    names["pages"] = make_pages("\n\n".join(raw), site)
    meta = (f'<dl><div><dt>发布</dt><dd>{escape(published)}</dd></div><div><dt>作者</dt><dd>吴乐阳</dd></div>'
            f'<div><dt>字数</dt><dd>{word_count:,} 字</dd></div></dl>')
    meta += '<p class="publication-note">本文记录的是 2026 年 11 月的样子，之后不再更新；现行规矩见<a href="/rules/">规则页</a>。</p><dl>'
    for kind, label in (("projects", "文中提到的项目"), ("skills", "文中提到的技能"), ("pages", "文中提到的页面")):
        meta += f'<div class="mentioned"><dt>{label}</dt><dd><ul>'
        for row in names[kind]:
            name = escape(row["matched"])
            link = f'<a href="{escape(row["href"], quote=True)}">{name}</a>' if row["href"] else name
            meta += f'<li data-slug="{escape(row["slug"])}">{link}</li>'
        meta += '</ul></dd></div>'
    meta += '</dl>'
    # 全站通用动效的约定（motion-brainstorm\demo\修复-opus.md“新页面怎么自动有全站动效”）：
    # 四大块各带 data-mo-rise；装配站里有了 /motion/ 才在 head 末尾加那两行，没并进站之前不引用不存在的文件。
    motion = ('<link rel="stylesheet" href="/motion/motion.css"><script src="/motion/motion.js"></script>'
              if (site / "motion" / "motion.css").exists() else "")
    # 第一屏总图和样式一起先取，viz.js 一跑就能放进去，不等脚本下完才开始下图。
    first = article.select_one(".viz__plate[data-src]")
    preload = f'<link rel="preload" href="{escape(first["data-src"])}" as="fetch" crossorigin="anonymous">' if first else ""
    html = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1440"><link rel="icon" href="data:,">
<title>原理</title><link rel="stylesheet" href="/header/topbar.css"><link rel="stylesheet" href="/rules/rules.css"><link rel="stylesheet" href="principles.css"><link rel="stylesheet" href="viz.css">{preload}{motion}</head>
<body>{header}<main class="rules-page principles-page"><div class="rules-title" data-mo-rise><h1>{escape(heading)}</h1><p class="principles-subtitle">{escape(subtitle)}</p></div>
<div class="rules-layout"><nav class="rules-toc" aria-label="本篇目录" data-mo-rise><ol>{''.join(toc)}</ol></nav>
<article class="rules-body" data-mo-rise>{article}</article><aside class="rules-meta" aria-label="文章信息" data-mo-rise>{meta}</aside></div></main>
<script src="/header/topbar.js"></script><script src="/rules/rules.js"></script><script src="viz.js"></script></body></html>
'''
    (output / "index.html").write_text(html, encoding="utf-8")
    rendered = BeautifulSoup(html, "html.parser")
    actual = body_text(rendered)
    prose = re.sub(r"(?m)^【图：[^\n]+】\s*$", "", "\n\n".join(raw))
    expected = plain(BeautifulSoup(markdown.markdown(prose), "html.parser").get_text())
    assert actual == expected, "正文有差异，停止交付"
    facts = dict(source_characters=len(expected), page_characters=len(actual), identical=True,
                 sha256=hashlib.sha256(expected.encode()).hexdigest(), published=published, names=names,
                 sections=section, figures=len(article.select(".viz")),
                 source_hashes={name: hashlib.sha256((SOURCE / name).read_bytes()).hexdigest() for name in FILES},
                 shared_assets=["/header/topbar.css", "/rules/rules.css", "/header/topbar.js", "/rules/rules.js"])
    if output == OUTPUT:
        (HERE / "content-check.json").write_text(json.dumps(facts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in facts.items() if k in ("source_characters", "page_characters", "identical", "sections", "figures")}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--published", default="2026-11-23", help="发布日写实际上线那天")
    parser.add_argument("--site", type=Path, default=SITE, help="本次已组装的页眉、列表和链接目标")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    build(args.published, args.site.resolve(), args.output.resolve())
