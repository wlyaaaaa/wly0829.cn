"""全站机器检查（轻量）：每页在 375、390、960、1280、1920 五种宽度下看横向溢出、坏图（下载失败或解不出来）、4xx/5xx 请求。
延迟加载的图先改成立即加载、等它们下完（每页最多等 15 秒）再判。
用法：python tools/fullsite_check.py <输出 json> [--base http://127.0.0.1:18963] [--pages a,b|all] [--widths 375,390,960,1280,1920]"""
import argparse, json, os, time
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--base", default="http://127.0.0.1:18963")
ap.add_argument("--pages", default="all"); ap.add_argument("--widths", default="375,390,960,1280,1920")
a = ap.parse_args()
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(SITE)
rendered = sorted(f[:-5] for f in os.listdir(os.path.join(SITE, "src", "content", "rendered")) if f.endswith(".json"))
names = rendered if a.pages == "all" else a.pages.split(",")
JS = """async () => {
  const imgs = [...document.images];
  imgs.forEach(i => { const v = i.dataset.tsSrc || i.dataset.src || i.dataset.lazySrc; if (v) { i.src = v; delete i.dataset.tsSrc; } i.loading = 'eager'; });
  document.querySelectorAll('svg [data-ts-src]').forEach(i=>{i.setAttribute('href',i.dataset.tsSrc);delete i.dataset.tsSrc;});
  await document.fonts.ready;
  await Promise.race([Promise.all(imgs.map(i => i.complete ? 1 : new Promise(r => { i.addEventListener('load', r, {once: true}); i.addEventListener('error', r, {once: true}); }))),
                      new Promise(r => setTimeout(r, 15000))]);
  const broken = imgs.filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0 && i.getClientRects().length).map(i => i.currentSrc || i.src);
  const pending = imgs.filter(i => i.getAttribute('src') && !i.complete && i.getClientRects().length).map(i => i.currentSrc || i.src);
  // Structural vertical gaps in actual screen pixels; this is not a white-pixel test.
  const vertical_blanks = [], ignore = 'script,style,noscript,template,.ghost,.deco,.living-layer,.sample-overlay,[data-typeset-ignore]';
  const visible = el => {
    if (el.closest(ignore)) return false;
    for (let n=el; n; n=n.parentElement) { const s=getComputedStyle(n); if (s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse'||Number(s.opacity)===0) return false; }
    return [...el.getClientRects()].some(r=>r.width>0&&r.height>0);
  };
  for (const container of document.querySelectorAll('.ts-canvas,.ts-canvas .col,.ts-canvas .card:not(.hub-stat-shell),.ts-canvas .ct-card')) {
    if (!visible(container)) continue;
    const box=container.getBoundingClientRect(), spans=[];
    const add = r => { if(r.width>0&&r.height>0&&r.right>box.left&&r.left<box.right) { const top=Math.max(box.top,r.top),bottom=Math.min(box.bottom,r.bottom); if(bottom>top)spans.push([top,bottom]); } };
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT); let node;
    while ((node=walker.nextNode())) {
      const el=node.parentElement,s=getComputedStyle(el);
      if (!node.textContent.trim()||!visible(el)||el.closest('svg')||['transparent','rgba(0, 0, 0, 0)'].includes(s.color)||s.webkitTextFillColor==='transparent') continue;
      const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())add(r);
    }
    for(const el of [...container.querySelectorAll('img,svg,[data-hot="live"],.livebox,[data-status-item],[data-status-line]'),...container.closest('.ts-screen').querySelectorAll('.ts-art img')])
      if(visible(el))add(el.getBoundingClientRect());
    const kind=container.matches('.ts-canvas')?'screen':container.matches('.col')?'column':'card', screen=container.closest('.ts-screen')?.id||'';
    const record = gap => { if(gap>120)vertical_blanks.push({screen,kind,classes:container.className,text:container.textContent.trim().slice(0,48),height:Math.round(box.height),offset:Math.round(end-box.top),gap:Math.round(gap*100)/100}); };
    spans.sort((a,b)=>a[0]-b[0]);let end=box.top;
    for(const [top,bottom]of spans){record(top-end);end=Math.max(end,bottom);}record(box.bottom-end);
  }
  const de = document.documentElement;
  return {overflow: de.scrollWidth > innerWidth + 1 ? de.scrollWidth - innerWidth : 0, broken, pending: pending.slice(0, 5), imgs: imgs.length, vertical_blanks};
}"""
rows = []
t0 = time.time()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe", headless=True)
    for n in names:
        url = json.load(open(os.path.join(REPO, "sources", "pages", n, "page.json"), encoding="utf-8-sig"))["url"] or f"/{n}/"
        for w in [int(x) for x in a.widths.split(",")]:
            ctx = b.new_context(viewport={"width": w, "height": 900}, is_mobile=w < 768, has_touch=w < 768, reduced_motion="reduce")
            pg = ctx.new_page()
            errs = []
            pg.on("response", lambda r: errs.append((r.status, r.url)) if r.status >= 400 else None)
            try:
                pg.goto(a.base + url, wait_until="networkidle", timeout=60000)
                r = pg.evaluate(JS)
                r.update(page=n, width=w, http_errors=errs[:5])
            except Exception as e:
                r = {"page": n, "width": w, "error": repr(e)[:200]}
            rows.append(r)
            ctx.close()
        bad = [r for r in rows if r["page"] == n and (r.get("overflow") or r.get("broken") or r.get("pending") or r.get("http_errors") or r.get("error") or r.get("vertical_blanks"))]
        print(n, "通过" if not bad else "有问题", [(r["width"], r.get("overflow"), len(r.get("broken") or []), len(r.get("http_errors") or []), r.get("error", "")[:60]) for r in bad], flush=True)
        json.dump(rows, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    b.close()
json.dump(rows, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(rows), "次，", f"{time.time() - t0:.0f} 秒")
