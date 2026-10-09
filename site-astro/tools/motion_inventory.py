"""动效清单核对：每页在“正常”和“系统减少动态效果”两种设置下，实际跑起来的动效。
用法：python tools/motion_inventory.py <输出json>"""
import json, sys
from playwright.sync_api import sync_playwright
PAGES = {"skill-report-page": "/skills/report-page/", "localocr": "/projects/localocr/", "rule-engineering-delivery": "/rules/engineering-delivery/"}
JS = r"""
async () => {
  const fig = document.querySelector('figure[data-living-config]');
  let cfg = null; try { cfg = fig ? await (await fetch(fig.dataset.livingConfig)).json() : null; } catch {}
  const types = {}; for (const e of (cfg && cfg.h && cfg.h.effects) || []) types[e.type] = (types[e.type] || 0) + 1;
  const d = window.pageLiving ? window.pageLiving.diagnostics() : null;
  const anims = document.getAnimations().map(a => a.animationName || (a.effect && a.effect.pseudoElement) || 'js').filter(Boolean);
  const count = {}; for (const n of anims) count[n] = (count[n] || 0) + 1;
  return {
    album_script: !!window.SiteAlbum || !!document.querySelector('script[data-album-inline]'),
    view_transition_css: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.cssText.includes('@view-transition')); } catch { return false; } }),
    falling_leaves: document.querySelectorAll('.falling-leaf').length,
    watercolour_washes: document.querySelectorAll('.watercolour-wash').length,
    body_motion_off: document.body.classList.contains('motion-off'),
    living: d ? { phase: d.phase, reason: d.reason, bird: d.bird, intro: d.intro, fps: d.fps } : null,
    living_effect_types: types, bird_config: !!(cfg && cfg.h && cfg.h.bird),
    css_animations_running: count,
  };
}
"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, path in PAGES.items():
        for mode in ("no-preference", "reduce"):
            ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion=mode)
            pg = ctx.new_page(); pg.goto("http://127.0.0.1:4391" + path, wait_until="networkidle"); pg.wait_for_timeout(3000)
            res[f"{name}/{mode}"] = pg.evaluate(JS); ctx.close()
            print(name, mode, json.dumps(res[f"{name}/{mode}"], ensure_ascii=False)[:400])
    b.close()
json.dump(res, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
