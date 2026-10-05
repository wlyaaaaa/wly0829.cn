"""在同一本机 Chrome 中量 DPR 对齐；只在 engine/work 保留证据，不改样板 spec。"""
import argparse
import io
import json
import pathlib
import numpy as np
from scipy import ndimage, optimize
from PIL import Image
from playwright.sync_api import sync_playwright
import browser
import build_preview
import common

def arr(pg, clip):
    return np.asarray(Image.open(io.BytesIO(pg.screenshot(clip=clip))).convert('RGB'), np.int16)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--tag', default='after')
    ap.add_argument('--width', type=int, default=412)
    a=ap.parse_args()
    out=common.ENGINE/'work'/'alignment'/a.tag
    out.mkdir(parents=True, exist_ok=True)
    result={}
    build_preview.build('localocr', orients=('v',))
    path=common.ART/'localocr'/'preview'/'localocr-v.html'
    with sync_playwright() as pw, browser.managed(pw) as br:
        for dpr in (1,2,3,3.5):
            pg=browser.open_preview(br,path,'v',extra={'device_scale_factor':dpr,'viewport':{'width':a.width,'height':915}})
            browser.wait_ready(pg)
            pg.evaluate("() => {living.setHour(12);living.setDebug({noBird:true,noIntro:true,only:'none',full:true});living.seek(30);}")
            clip=browser.box_clip(pg,0)
            pg.evaluate("() => document.querySelector('.living-layer').style.display='none'")
            browser.frame_settle(pg)
            orig=arr(pg,clip)
            pg.evaluate("() => document.querySelector('.living-layer').style.display=''")
            browser.frame_settle(pg)
            rendered=arr(pg,clip)
            state=pg.evaluate("""() => { const sc=living.scene(),g=sc.gl(),p=g.getParameter(g.CURRENT_PROGRAM),u=g.getUniformLocation(p,'u_map'),map=Array.from(g.getUniform(p,u));window.__align={g,u,map}; const root=sc.root.getBoundingClientRect(),canvas=g.canvas.getBoundingClientRect();return {root:{x:root.x,y:root.y,w:root.width,h:root.height},canvas:{x:canvas.x,y:canvas.y,w:canvas.width,h:canvas.height},map,diagnostics:living.diagnostics()};} """)
            samples=[]
            for shift in np.arange(-1,1.0001,0.125):
                pg.evaluate("""([dx,w]) => {const {g,u,map}=window.__align;g.uniform4f(u,map[0],map[1],map[2]+dx/w,map[3]);g.drawArrays(g.TRIANGLE_STRIP,0,4);} """,[float(shift),state['root']['w']])
                browser.frame_settle(pg)
                diff=np.abs(arr(pg,clip)-orig)
                # 图边缘和空白不参与位移拟合；颜色误差另全量报告。
                samples.append({'sample_shift_css':float(shift),'mean_rgb_error':round(float(diff[8:-8,8:-8].mean()),5)})
            best=min(samples,key=lambda x:x['mean_rgb_error'])
            dd=np.abs(rendered-orig).max(-1)
            def fit(q):
                shifted=ndimage.shift(rendered.astype('float32'),(q[1],q[0],0),order=1,prefilter=False)
                return float(((shifted[8:-8,8:-8]-orig[8:-8,8:-8])**2).mean())
            fit_res=optimize.minimize(fit,(0,0),method='Nelder-Mead',options={'xatol':0.001,'initial_simplex':np.array([[0,0],[1,0],[0,1]])})
            result[str(dpr)]={'geometry':state,'static_full':{'max':int(dd.max()),'p999':float(np.percentile(dd,99.9)),'mean':round(float(dd.mean()),5)},'translation_fit_css':[round(float(v/dpr),4) for v in fit_res.x],'best':best,'shift_samples':samples}
            Image.fromarray(orig.astype('uint8')).save(out/f'original-{dpr}.png')
            Image.fromarray(rendered.astype('uint8')).save(out/f'canvas-{dpr}.png')
            im=Image.fromarray(rendered.astype('uint8'));im.thumbnail((900,900));im.save(out/f'dpr-{dpr}.png')
            pg.context.close()
        br.close()
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(json.dumps({k:{'static_full':v['static_full'],'best':v['best'],'translation_fit_css':v['translation_fit_css']} for k,v in result.items()},ensure_ascii=False))

if __name__=='__main__':main()
