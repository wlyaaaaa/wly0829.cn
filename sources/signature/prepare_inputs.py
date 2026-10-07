from PIL import Image
from pathlib import Path
import json
root=Path(__file__).parent
source=root.parent/'creative-handoff/home-living/dist'
out=root/'image-inputs'
out.mkdir(exist_ok=True)
files={}
for p in (source/'assets').glob('plate-*.webp'):
 im=Image.open(p).convert('RGB')
 thumb=im.copy();thumb.thumbnail((900,900));thumb.save(out/(p.stem+'-preview.png'))
 files[p.name]={'path':str(p),'size':im.size}
(out/'sources.json').write_text(json.dumps(files,ensure_ascii=False,indent=2),'utf8')
print(json.dumps(files,ensure_ascii=False))
rects={'h':[70,977,1060,1148],'v':[153,1538,1126,1718]}
for ori in ('h','v'):
 p=next((source/'assets').glob('plate-'+ori+'-white.*.webp'))
 im=Image.open(p).convert('RGB').crop(rects[ori])
 im.save(out/('signature-'+ori+'-native.png'))
 im.thumbnail((900,900));im.save(out/('signature-'+ori+'-edit.png'))
(out/'rects.json').write_text(json.dumps(rects,indent=2),'utf8')
static=root.parent/'creative-integrator/prepared-living-final/assets'
for p in static.glob('home-01-*'):
 im=Image.open(p).convert('RGB'); print('STATIC',p.name,im.size)
 if ('2880' in p.name or '1280' in p.name):
  th=im.copy();th.thumbnail((900,900));th.save(out/(p.stem+'-preview.png'))
  ori='h' if '-h-' in p.name else 'v'
  w,h=files[next(k for k in files if k.startswith('plate-'+ori+'-white.'))]['size']
  rect=tuple(round(t*im.width/w) for t in rects[ori])
  crop=im.crop(rect);crop.thumbnail((900,900));crop.save(out/('static-signature-'+ori+'.png'))
