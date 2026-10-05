"""原始十三张姿态按原生像素打图集，保原脚锚和飞姿身体修正。"""
from pathlib import Path
import json, hashlib

work=Path(__file__).resolve().parent
pipe=work.parents[1]
script=(pipe/'p2/bird/tools/build_assets.py').read_text('utf-8')
script=script.replace('OUT = BASE / "p2" / "bird" / "dist"', 'OUT = pathlib.Path('+repr(str(work/'bird'))+')')
script=script.replace('SCALE = 0.32', 'SCALE = 1.0').replace('SHEET_W = 1024','SHEET_W = 4096').replace('PAD = 6','PAD = 18')
script=script.replace('QUALITY, ALPHA_Q = 82, 70','QUALITY, ALPHA_Q = 92, 100')
script=script.replace('sheet.save(buf, "WEBP", quality=QUALITY, alpha_quality=ALPHA_Q, method=6)', 'sheet.save(buf, "WEBP", lossless=True, exact=True, method=6)')
namespace={'__name__':'__bird_atlas_task__'}
exec(compile(script,str(pipe/'p2/bird/tools/build_assets.py'),'exec'),namespace)
base=namespace['BASE']
inputs=[]
for parent in (base/'sample/sprites',base/'bird2/sprites'):
    for p in sorted(parent.glob('bird*.png')):
        inputs.append({'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
result={'original_pose_inputs':inputs,'scale_from_original':1.0,'enlarged_old_atlas':False,'lossless_webp':True,'atlas_sha256':hashlib.sha256((work/'bird/bird-atlas.webp').read_bytes()).hexdigest()}
(work/'atlas-build.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
