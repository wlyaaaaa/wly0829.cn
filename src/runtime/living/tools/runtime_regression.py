"""晚挂载和全站叶幅的真实 Chrome 回归。结果只写 engine/work。"""
import json
import re
from playwright.sync_api import sync_playwright
import browser
import build_preview
import common

PROBE = """(() => {window.__firstIntro=[];const old=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(kind,...args){const g=old.call(this,kind,...args);if(g&&/^webgl/.test(kind)&&!g.__introProbe){g.__introProbe=true;const draw=g.drawArrays.bind(g);g.drawArrays=function(...a){if(window.__firstIntro.length<4){const p=g.getParameter(g.CURRENT_PROGRAM),u=g.getUniformLocation(p,'u_intro');window.__firstIntro.push(g.getUniform(p,u));}return draw(...a);};}return g;};})();"""

def main():
    build_preview.build('localocr',orients=('h',))
    src=(common.ART/'localocr'/'preview'/'localocr-h.html').read_text(encoding='utf-8')
    src=re.sub(r'window\.living = (LivingArt\.mount\([^\n]+);', r'window.mountArt = () => { window.living = \1; };',src)
    path=common.ENGINE/'work'/'runtime-regression.html'
    path.write_text(src,encoding='utf-8')
    result={}
    with sync_playwright() as pw, browser.managed(pw) as br:
        for key,option in [('auto',None),('off',False),('on',True)]:
            pg=br.new_page(**browser.LAYOUTS['h'])
            pg.add_init_script(PROBE)
            pg.goto(br._preview_base+'/'+path.relative_to(common.GATE).as_posix())
            pg.wait_for_timeout(400)
            if option is None:
                pg.evaluate('() => mountArt()')
            else:
                pg.evaluate('(value) => { const orig=LivingArt.mount; window.LivingArt={...LivingArt,mount:(el,opts)=>orig(el,{...opts,intro:value})};mountArt();}',option)
            browser.wait_ready(pg)
            result[key]=pg.evaluate("() => ({diagnostics:living.diagnostics(),firstIntro:__firstIntro,amplitudes:living.scene().effects.filter(e=>e.type==='sway').map(e=>e.amp),globalAmplitude:LivingArt.leafAmplitude})")
            pg.close()
        br.close()
    result['passed']=(not result['auto']['diagnostics']['intro']['enabled'] and result['auto']['diagnostics']['intro']['reason']=='image-already-visible'
      and result['auto']['firstIntro'][0]>=1.5 and not result['off']['diagnostics']['intro']['enabled'] and result['on']['diagnostics']['intro']['enabled']
      and result['on']['firstIntro'][0]<1.5 and all(v==.005 for r in result.values() if isinstance(r,dict) for v in r.get('amplitudes',[])))
    (common.ENGINE/'work'/'runtime-regression.json').write_text(json.dumps(result,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False),flush=True)
    if not result['passed']:raise SystemExit(1)

if __name__=='__main__':main()
