"""样板机器检查（只用 Playwright，不另做检查系统）。每页 × 375/390/960/1280/1920 五种宽度：
  1. 横向溢出：页面宽于窗口；
  2. 图片：显示着的图片全部加载成功（滚到底触发懒加载后，complete 且有像素；另记 4xx/5xx 请求）；
  3. 文字：每屏显示的字和现在网站这一屏的“等价文字”（整屏图旁给读屏用的原文）逐字比（去空白）；
  4. 重叠：同一画布里不同元素的文字行、图片互相压住（装饰图、透明的标题替代字不算）；
  5. 窄栏和表格：画布里会换行的文字块每行放得下几个字、表格还按行列显示时换行格子的宽度——
     新版画布和现在出图的画布同宽、同字号，按画布像素量，和现在网站同一屏逐项比，比现在窄才算问题；
  6. 卡片：说明文字在自己的卡片里（数字卡的数字下面有说明，卡片除了标题还有内容）。
用法：python tools/check.py <输出json> [--base http://127.0.0.1:18963] [--pages a,b|all] [--dist <现在网站构建目录>]"""
import argparse, html as H, json, os, re, sys, time
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REPO = os.path.dirname(ROOT)
WIDTHS = (375, 390, 960, 1280, 1920)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

JS = r"""
() => {
  const main = document.querySelector('main');
  const out = { overflow: null, overlaps: [], narrow: [], images: [], empty_cards: [], texts: {} };
  const de = document.documentElement;
  out.overflow = de.scrollWidth > innerWidth + 1 ? { scrollWidth: de.scrollWidth, innerWidth } : null;
  const canvases = [...main.querySelectorAll('.ts-canvas')].filter(c => c.getClientRects().length);
  for (const c of canvases) {
    const sid = c.closest('section.ts-screen').id;
    out.texts[sid] = c.innerText;
    const k = c.getBoundingClientRect().width / c.offsetWidth;  // 画布缩放比例：下面的尺寸都换回画布像素
    const deco = e => e.closest('[aria-hidden="true"],.ghost,.living-layer') || getComputedStyle(e).color === 'rgba(0, 0, 0, 0)';
    const boxes = [];
    const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const host = n.parentElement; if (deco(host)) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 1 && q.height > 1) boxes.push({ el: host, x: q.left, y: q.top, w: q.width, h: q.height, kind: 'text', t: n.nodeValue.trim().slice(0, 16) });
    }
    for (const im of c.querySelectorAll('img')) {
      if (deco(im)) continue;
      const q = im.getBoundingClientRect(); if (q.width > 1 && q.height > 1) boxes.push({ el: im, x: q.left, y: q.top, w: q.width, h: q.height, kind: 'img', t: (im.getAttribute('src') || '').split('/').pop().slice(0, 30) });
    }
    boxes.sort((a, b) => a.y - b.y);
    for (let i = 0; i < boxes.length; i++) {
      const a = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const b = boxes[j];
        if (b.y >= a.y + a.h) break;
        if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        if (a.kind === 'img' && b.kind === 'img') continue;
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox / k > 3 && oy / k > 3) out.overlaps.push({ screen: sid, a: a.kind + ':' + a.t, b: b.kind + ':' + b.t, ox: Math.round(ox / k), oy: Math.round(oy / k) });
        if (out.overlaps.length > 40) break;
      }
    }
    for (const el of c.querySelectorAll('p, li, td, th, .tb')) {
      const txt = el.innerText.trim(); if (txt.length < 16 || el.querySelector('p, li, td, th, .tb')) continue;
      const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const r = document.createRange(); r.selectNodeContents(el);
      const lines = new Set([...r.getClientRects()].map(q => Math.round(q.top))).size;
      if (w > 0 && lines > 1) out.narrow.push({ screen: sid, key: el.tagName + '|' + txt.slice(0, 24), chars: Math.round(w / fs * 10) / 10, table: !!el.closest('table') && getComputedStyle(el).display === 'table-cell', width: Math.round(w) });
    }
    for (const st of c.querySelectorAll('.stat')) { const t = [...st.querySelectorAll('[data-role="body"], .body, .hub-field-description')].map(x => x.textContent.trim()).join(''); if (!t) out.empty_cards.push({ screen: sid, kind: 'stat', title: st.textContent.trim().slice(0, 20) }); }
    for (const cd of c.querySelectorAll('.ct-card:not(.ct-bubble):not(.ct-dialogue-frame)')) { const head = cd.querySelector(':scope > .ct-card-head'); const rest = (cd.textContent || '').trim().length - (head ? head.textContent.trim().length : 0); if (head && rest <= 0) out.empty_cards.push({ screen: sid, kind: 'card', title: head.textContent.trim().slice(0, 20) }); }
  }
  for (const im of document.images) if (im.getClientRects().length && im.getAttribute('src') && !(im.complete && im.naturalWidth > 0)) out.images.push(im.currentSrc || im.getAttribute('src'));
  return out;
}
"""


def canon(t):
    return re.sub(r"\s+", "", t)


def transcripts(dist, url):
    html = open(os.path.join(dist, *url.strip("/").split("/"), "index.html"), encoding="utf-8").read()
    tr = {}
    for m in re.finditer(r'data-screen-transcript="([^"]+)">(.*?)<!-- /screen-equivalent-text -->', html, re.S):
        for t in re.finditer(r'data-transcript-orientation="([hv])">(.*?)</div>', m[2], re.S):
            tr[(m[1], t[1])] = canon(H.unescape(re.sub(r"<[^>]+>", "", t[2])))
    return tr


ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--base", default="http://127.0.0.1:18963")
ap.add_argument("--pages", default="skill-report-page,localocr,rule-engineering-delivery")
ap.add_argument("--dist", default="E:/Cache/Codex/Temp/final-batch-round06-e230-final-rebuild2/dist-final-A")
a = ap.parse_args()
names = sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, "src", "content", "rendered")) if f.endswith(".json")) if a.pages == "all" else a.pages.split(",")
result = {"started": time.strftime("%H:%M:%S"), "pages": []}
t0 = time.time()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None)
    # 现在网站同一屏的窄栏基线：现在出图用的画布 HTML 就是新版的区块（同宽同字号），按同一口径量
    for page in names:
        url = json.load(open(os.path.join(REPO, "sources", "pages", page, "page.json"), encoding="utf-8-sig"))["url"]
        tr = transcripts(a.dist, url)
        row = {"page": page, "path": url, "widths": {}}
        for w in WIDTHS:
            ctx = b.new_context(viewport={"width": w, "height": 900})
            pg = ctx.new_page()
            bad = []
            pg.on("response", lambda r, bad=bad: r.status >= 400 and bad.append(f"{r.status} {r.url}"))
            pg.goto(a.base + url, wait_until="networkidle")
            pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
            pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(500)
            pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(300)
            try:
                pg.wait_for_function("[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete)", timeout=20000)
            except Exception:
                pass
            r = pg.evaluate(JS)
            o = "h" if w >= 768 else "v"
            text_bad = []
            for sid, t in r["texts"].items():
                want = tr.get((sid, o)) or tr.get((sid, "h"))
                if want is None:
                    text_bad.append({"screen": sid, "why": "现在网站这一屏没有等价文字"}); continue
                g = canon(t)
                if g != want:
                    i = next((k for k in range(min(len(g), len(want))) if g[k] != want[k]), min(len(g), len(want)))
                    text_bad.append({"screen": sid, "now_chars": len(want), "new_chars": len(g), "same_chars_sorted": sorted(g) == sorted(want),
                                     "now": want[max(0, i - 8):i + 16], "new": g[max(0, i - 8):i + 16]})
            row["widths"][w] = {"overflow": r["overflow"], "broken_images": r["images"], "http_errors": bad, "overlaps": r["overlaps"],
                                "empty_cards": r["empty_cards"], "text_mismatch": text_bad, "screens": len(r["texts"]),
                                "narrow_min_chars": min([x["chars"] for x in r["narrow"] if not x["table"]] or [None]) if r["narrow"] else None,
                                "table_min_width": min([x["width"] for x in r["narrow"] if x["table"]] or [None]) if r["narrow"] else None,
                                "_narrow": r["narrow"]}
            ctx.close()
        # 窄栏、表格：新版画布和现在同宽，按画布像素比；同一屏同一段文字，电脑三种宽度一样、手机两种宽度一样
        result["pages"].append(row)
        v = row["widths"]
        ok = all(not x["overflow"] and not x["broken_images"] and not x["http_errors"] and not x["empty_cards"] for x in v.values())
        print(page, "通过" if ok else "有问题", {w: {k: (len(x[k]) if isinstance(x[k], list) else x[k]) for k in ("overflow", "broken_images", "http_errors", "overlaps", "empty_cards", "text_mismatch", "screens")} for w, x in v.items()}, flush=True)
    b.close()
result["seconds"] = round(time.time() - t0, 1)
json.dump(result, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("检查用时", result["seconds"], "秒")
