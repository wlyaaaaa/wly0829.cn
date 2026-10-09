"""样板机器检查（只用 Playwright，不另做检查系统）。
每页 × 375/768/1440 三种宽度：
  1. 横向溢出：页面宽于窗口；
  2. 元素重叠：正文里不同元素的文字行、图片互相压住（按文字的实际行框比，绕开浮动插画的行不算）；
  3. 窄栏：一段需要换行的文字，所在栏宽放不下 15 个字；
  4. 图片：所有图片加载成功（滚到底触发懒加载后，complete 且有像素；另记 4xx/5xx 请求）；
另外每页一次：page.json 文字逐段在新页面上找得到（去空白和排版记号后比，毛笔标题图按其替代文字算），列出缺的。
用法：python tools/check.py <输出json> [--base http://127.0.0.1:4391] [--pages a,b]"""
import argparse, json, os, re, sys, time
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
from engine import parse as P  # noqa: E402

PAGES = {"skill-report-page": "/skills/report-page/", "localocr": "/projects/localocr/",
         "rule-engineering-delivery": "/rules/engineering-delivery/"}
WIDTHS = (375, 768, 1440)

JS = r"""
() => {
  const main = document.querySelector('main');
  const out = { overflow: null, overlaps: [], narrow: [], images: [] };
  const de = document.documentElement;
  out.overflow = de.scrollWidth > innerWidth + 1 ? { scrollWidth: de.scrollWidth, innerWidth } : null;
  // 文字行框和图片
  const boxes = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const host = n.parentElement;
    if (host.closest('.living-layer')) continue;
    const th = host.closest('thead'); if (th && getComputedStyle(th).clipPath !== 'none') continue;  // 卡片模式下表头只留给读屏
    const r = document.createRange(); r.selectNodeContents(n);
    for (const q of r.getClientRects()) if (q.width > 1 && q.height > 1) boxes.push({ el: host, x: q.left, y: q.top + scrollY, w: q.width, h: q.height, kind: 'text', t: n.nodeValue.trim().slice(0, 16) });
  }
  for (const im of main.querySelectorAll('img')) {
    if (im.closest('.living-layer')) continue;  // 动画层的小鸟本来就落在插画上
    const q = im.getBoundingClientRect(); if (q.width > 1 && q.height > 1) boxes.push({ el: im, x: q.left, y: q.top + scrollY, w: q.width, h: q.height, kind: 'img', t: (im.getAttribute('src') || '').split('/').pop().slice(0, 30) });
  }
  boxes.sort((a, b) => a.y - b.y);
  for (let i = 0; i < boxes.length; i++) {
    const a = boxes[i];
    for (let j = i + 1; j < boxes.length; j++) {
      const b = boxes[j];
      if (b.y >= a.y + a.h) break;
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 2 && oy > 2) out.overlaps.push({ a: a.kind + ':' + a.t, b: b.kind + ':' + b.t, ox: Math.round(ox), oy: Math.round(oy), y: Math.round(a.y) });
      if (out.overlaps.length > 40) break;
    }
  }
  // 窄栏：需要换行的文字块，内容宽度放不下 15 个字
  for (const el of main.querySelectorAll('p, li, td, th, h3, h4, figcaption, .step-title, .step-text, .stat-text, .bubble')) {
    const txt = el.innerText.trim(); if (txt.length < 16) continue;
    const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize);
    const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const r = document.createRange(); r.selectNodeContents(el);
    const lines = new Set([...r.getClientRects()].map(q => Math.round(q.top))).size;
    if (w > 0 && w < 15 * fs - 1 && lines > 1) out.narrow.push({ tag: el.tagName, cls: el.className, width: Math.round(w), need: Math.round(15 * fs), text: txt.slice(0, 20) });
  }
  for (const im of document.images) if (im.getAttribute('src') && !(im.complete && im.naturalWidth > 0)) out.images.push(im.currentSrc || im.getAttribute('src'));
  return out;
}
"""


def expected_segments(page):
    data = json.load(open(os.path.join(REPO, "sources", "pages", page, "page.json"), encoding="utf-8"))
    segs = []
    for s in data["screens"]:
        if s.get("hidden"):
            continue
        md = P.original_markdown(s)
        for node in P.parse(s.get("text", ""), markdown_links=md):
            for line in node.get("src", []):
                t = P.expected_text(line, markdown_links=md)
                if t:
                    segs.append((s["id"], t))
    return segs


def canon_page(text, expected=False):
    """比对口径：去空白和排版记号；箭头、冒号不计（新版把“名：说明”排成标题+正文、把箭头排成步骤）；
    原文段首的序号不计（新版用编号圆点和列表序号显示）。"""
    t = P.canon(text)
    t = re.sub(r"[→↓：:]", "", t)
    if expected:
        t = re.sub(r"^\d+[.．、]?", "", t)
    return t


ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--base", default="http://127.0.0.1:4391"); ap.add_argument("--pages", default=",".join(PAGES))
ap.add_argument("--paths", default="")
a = ap.parse_args()
pages = a.pages.split(",")
paths = dict(zip(pages, a.paths.split(","))) if a.paths else PAGES
result = {"started": time.strftime("%H:%M:%S"), "pages": []}
t0 = time.time()
with sync_playwright() as p:
    b = p.chromium.launch()
    for page in pages:
        row = {"page": page, "path": paths[page], "widths": {}}
        for w in WIDTHS:
            ctx = b.new_context(viewport={"width": w, "height": 900})
            pg = ctx.new_page()
            bad = []
            pg.on("response", lambda r, bad=bad: r.status >= 400 and bad.append(f"{r.status} {r.url}"))
            pg.goto(a.base + paths[page], wait_until="networkidle")
            pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
            pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(500)
            pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(300)
            try:
                pg.wait_for_function("[...document.images].every(i=>i.complete)", timeout=15000)
            except Exception:
                pass
            r = pg.evaluate(JS)
            r["http_errors"] = bad
            if w == 1440:
                seen = canon_page(pg.evaluate("(()=>{const c=document.querySelector('main').cloneNode(true);c.querySelectorAll('.step-no').forEach(e=>e.remove());return c.textContent+[...document.querySelectorAll('main h1 img, main h2 img, main h3 img, main .shot img')].map(i=>i.alt).join('')})()"))
                segs = expected_segments(page)
                miss = [(sid, t) for sid, t in segs if canon_page(t, True) not in seen]
                total = sum(len(t) for _, t in segs); missing = sum(len(t) for _, t in miss)
                row["text"] = {"segments": len(segs), "missing_segments": len(miss), "chars": total, "missing_chars": missing,
                               "coverage": round(1 - missing / max(1, total), 4), "missing": [{"screen": s, "text": t[:60]} for s, t in miss]}
            row["widths"][w] = {"overflow": r["overflow"], "overlaps": r["overlaps"], "narrow": r["narrow"], "broken_images": r["images"], "http_errors": r["http_errors"]}
            ctx.close()
        result["pages"].append(row)
        ok = all(not v["overflow"] and not v["overlaps"] and not v["narrow"] and not v["broken_images"] for v in row["widths"].values())
        print(page, "通过" if ok else "有问题", {w: {k: (len(v[k]) if isinstance(v[k], list) else bool(v[k])) for k in v} for w, v in row["widths"].items()}, "文字覆盖", row.get("text", {}).get("coverage"))
    b.close()
result["seconds"] = round(time.time() - t0, 1)
json.dump(result, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("检查用时", result["seconds"], "秒")
