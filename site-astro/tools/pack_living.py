"""环境动画引擎“入场晕开盖住已显示的图”修正（样板）。
现网引擎 living.521533a56a.js 比仓库源码 src/runtime/living/src/living.js 多了整屏图对齐等后加内容，源码直接重打和现网不一致，
所以在现网文件上做同一处最小修改，并把同样的改动写进源码（见 src/runtime/living/src/living.js 的同名注释）：
开始画之前再看一眼原图——此刻已经显示在页面上（加载完、有尺寸、没隐藏、不透明度大于 0），就算“已显示”，不播入场晕开。
用法：python tools/pack_living.py"""
import hashlib, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENG = os.path.join(ROOT, "public", "_living", "_engine")
src = open(os.path.join(ENG, "living.521533a56a.js"), encoding="utf-8").read()
OLD = 'It(),Ue=!0,ze="live",Xe=null,L=m.intro===!0||m.intro!==!1&&!J,'
NEW = ('It(),Ue=!0,ze="live",Xe=null,'
       '(()=>{if(!J&&T.complete&&T.naturalWidth&&T.getClientRects().length){const _cs=getComputedStyle(T);'
       '_cs.visibility!=="hidden"&&_cs.display!=="none"&&Number(_cs.opacity)>0&&(J=!0)}})(),'
       'L=m.intro===!0||m.intro!==!1&&!J,')
if src.count(OLD) != 1:
    sys.exit("现网引擎里找不到入场判断那一段")
fixed = src.replace(OLD, NEW)
# 修正二：晃动、水波这类“位移”效果从接手那一刻起 0.8 秒内由 0 平滑加到原幅度（不是透明度），
# 所以画布第一帧的叶子位置和静态图完全一样，之后才慢慢动起来。
RAMP = "Fe(He((t-ne.i0-W)/.8,0,1))"
PAIRS = [('o.amp||.004],xe);break}case"flow"', f'(o.amp||.004)*{RAMP}],xe);break}}case"flow"'.replace("}}case", "}case")),
         ('de.set([t*2*Math.PI/v,0,0,o.amp||.004],xe):de.set([t/v*.9,t/v*.6,0,o.amp||.003],xe)',
          f'de.set([t*2*Math.PI/v,0,0,(o.amp||.004)*{RAMP}],xe):de.set([t/v*.9,t/v*.6,0,(o.amp||.003)*{RAMP}],xe)')]
for a, b in PAIRS:
    if fixed.count(a) != 1:
        sys.exit("找不到位移效果参数：" + a[:30])
    fixed = fixed.replace(a, b)
# 纹理和静图同址、且静图已经可读时直接复用图像对象；禁缓存的首次访问也不重复取图。
# 保留纹理框、尺寸检查与原有画布处理，不同地址或不可读仍走原加载函数。
OLD_TEXTURE = 'const q=new URL(p.src,u.base).href,y=await dt(q,!0),a=y.naturalWidth'
NEW_TEXTURE = 'const q=new URL(p.src,u.base).href,y=q===(T.currentSrc||T.src)&&Ct(T)?T:await dt(q,!0),a=y.naturalWidth'
if fixed.count(OLD_TEXTURE) != 1:
    sys.exit("找不到原纹理加载入口")
fixed = fixed.replace(OLD_TEXTURE, NEW_TEXTURE)
# 读页小鸟只改停靠点的 DOM 适配；飞行、精灵图、停留节奏和旧页分支原样保留。
bird_src = os.path.join(ENG, "bird.fffa187360")
bird = open(os.path.join(bird_src, "bird.js"), encoding="utf-8").read()
OLD_GUIDE = 'function ee(){xe=[],le.parts.forEach'
NEW_GUIDE = '''function ee(){xe=[];if(document.querySelector(".ts-page")){
document.querySelectorAll(".ts-screen").forEach(function(o){
var part=o.querySelector(Z.orient==="v"?".ts-v":".ts-h")||o.querySelector(".ts-h.ts-both"),m=part&&part.querySelector('[data-comp="chapter_title"] img, [data-comp="chapter_title"] .brushfont');
if(!m)return;var H={getBoundingClientRect:function(){return m.getBoundingClientRect()}},d={s:o.id,perches:[["title",.4,0,1,1],["title",.65,0,-1,1]]};
function ink(){if(!m.naturalWidth)return;try{var c=document.createElement("canvas");c.width=m.naturalWidth;c.height=m.naturalHeight;
var g=c.getContext("2d",{willReadFrequently:true});g.drawImage(m,0,0);d.perches.forEach(function(q){
var p=g.getImageData(Math.floor(q[1]*c.width),0,1,c.height).data;for(var y=0;y<c.height;y++){var k=y*4;
if(p[k+3]>96&&p[k]<160&&p[k+1]>p[k]*1.15&&p[k+1]>p[k+2]*1.05){q[2]=y/c.height;break}}});}catch(e){}}
ink();if(m.tagName==="IMG"&&!m.naturalWidth)m.addEventListener("load",ink,{once:true});xe.push({el:H,d:d});
});}else le.parts.forEach'''
if bird.count(OLD_GUIDE) != 1:
    sys.exit("找不到小鸟读页停靠点入口")
bird = bird.replace(OLD_GUIDE, NEW_GUIDE)
bird = bird.replace('}),Y.setPageSize(G()?M.phonePageMin:M.pageMin)}', '});Y.setPageSize(G()?M.phonePageMin:M.pageMin)}', 1)
bird_name = "bird." + hashlib.sha256(bird.encode("utf-8")).hexdigest()[:10]
import shutil
shutil.copytree(bird_src, os.path.join(ENG, bird_name), dirs_exist_ok=True)
open(os.path.join(ENG, bird_name, "bird.js"), "w", encoding="utf-8", newline="\n").write(bird)
fixed = fixed.replace('Jt="bird.fffa187360/"', 'Jt="' + bird_name + '/"')
fixed = fixed.encode("utf-8")
name = f"living.{hashlib.sha256(fixed).hexdigest()[:10]}.js"
open(os.path.join(ENG, name), "wb").write(fixed)
json.dump({"deployed": "living.521533a56a.js", "fixed": name}, open(os.path.join(ROOT, "src", "chrome", "living-engine.json"), "w", newline="\n"), indent=1)
print("修正版：", name)
