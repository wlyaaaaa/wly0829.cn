"""只裁现有/内置生成位图，校准新增图墨色，保留原字形；不使用字体造字。"""
from pathlib import Path
import csv, hashlib, json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT=Path(__file__).resolve().parent
REG=Path('E:/Cache/Claude/Temp/4bd59299/b1/shared/nav-labels')
IMAGES=OUT/'images';IMAGES.mkdir(exist_ok=True)
labels=(OUT/'inventory/labels-toc-75.txt').read_text('utf8').splitlines()
wanted=json.loads((OUT/'wanted-labels.json').read_text('utf8'))
registry={x['text']:x for x in json.loads((REG/'labels.json').read_text('utf8'))['labels']}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def ink(im):
    a=np.asarray(im);ys,xs=np.nonzero(a[:,:,3]>=16)
    if not len(xs):raise ValueError('没有可见墨迹')
    return [int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
def bands(im):
    a=np.asarray(im);active=np.flatnonzero((a[:,:,3]>=46).sum(axis=1)>=8)
    result=[];start=last=int(active[0])
    for y in active[1:]:
        if y-last>=12:result.append((start,last+1));start=int(y)
        last=int(y)
    result.append((start,last+1));return result
new_images={};crop_evidence=[]
override_path=OUT/'sources/crop-overrides.json'
overrides=json.loads(override_path.read_text('utf8'))if override_path.exists()else {}
for n in range(1,7):
    source=OUT/f'sources/generated-standard-sheet-{n:02}.png'
    if not source.exists():continue
    names=wanted['new'][(n-1)*8:n*8]
    im=Image.open(source).convert('RGBA');row_bands=bands(im)
    if len(row_bands)!=len(names):raise ValueError(f'{source.name}: {len(row_bands)}行，预期{len(names)}，必须人工核对裁片')
    for i,(text,(t,b))in enumerate(zip(names,row_bands)):
        if text in overrides:
            info=overrides[text];p=OUT/info['source'];im1=Image.open(p).convert('RGBA');box=info['box'];source1=p
        else:
            im1=im;source1=source
            region=im.crop((0,max(0,t-5),im.width,min(im.height,b+5)));bbox=ink(region)
            box=[bbox[0],max(0,t-5)+bbox[1],bbox[2],max(0,t-5)+bbox[3]]
        tile=im1.crop(box)
        # 原标准墨迹约70px；72px覆盖18px×DPR3.5=63px，同时避免把超大生图整块搬进导航。
        before_size=list(tile.size)
        tile=tile.resize((round(tile.width*72/tile.height),72),Image.Resampling.LANCZOS)
        tile2=Image.new('RGBA',(tile.width+8,tile.height+8));tile2.paste(tile,(4,4))
        a=np.asarray(tile2).copy();core=a[:,:,3]>=192
        median=np.median(a[:,:,:3][core],axis=0).astype(int)
        delta=np.array([0,112,64])-median
        rgb=np.clip(a[:,:,:3].astype(int)+delta,0,255).astype('uint8');a[:,:,:3]=rgb;a[a[:,:,3]==0,:3]=0
        tile2=Image.fromarray(a,'RGBA')
        new_images[text]=(tile2,{'method':'built-in-imagegen','source':str(source1),'source_sha256':sha(source1),'source_box':box,'source_crop_size':before_size,'normalized_ink_height_target':72,'resampling':'Lanczos','rgb_core_before':median.tolist(),'rgb_delta':delta.tolist(),'target_core_rgb':[0,112,64]})
        crop_evidence.append({'text':text,'sheet':str(source1),'sheet_sha256':sha(source1),'box':box,'row':i+1})
records=[];tiles=[];missing=[]
for idx,text in enumerate(labels,1):
    if text in new_images:im,origin=new_images[text];kind='new'
    elif text in registry:
        meta=registry[text];source=REG/meta['file'];im=Image.open(source).convert('RGBA')
        origin={'method':'reused-standard-imagegen','source':str(source),'source_sha256':sha(source),'registry_source_sheet':meta['source'],'registry_sheet_sha256':meta['source_sha256'],'registry_source_box':meta['source_box']};kind='reused'
    else:missing.append(text);continue
    name=f'nav-unify-label-{idx:02}-{hashlib.sha256(text.encode("utf8")).hexdigest()[:10]}'
    png=IMAGES/(name+'.png');webp=IMAGES/(name+'.webp')
    im.save(png);im.save(webp,lossless=True,method=6,exact=True)
    assert Image.open(webp).convert('RGBA').tobytes()==im.tobytes()
    b=ink(im)
    record={'index':idx,'text':text,'kind':kind,'png':'images/'+png.name,'webp':'images/'+webp.name,'size':list(im.size),'ink_box_alpha16':b,'png_sha256':sha(png),'webp_sha256':sha(webp),'rgba_sha256':hashlib.sha256(im.tobytes()).hexdigest(),'origin':origin}
    records.append(record);tiles.append(im)
save(OUT/'sources/crop-evidence.json',crop_evidence)
save(OUT/'manifest.json',{'schema':'wly.nav-unify-assets.v1','standard':'2026-09-30 built-in imagegen heavy bold green sans-serif original header labels','expected_labels':75,'available_labels':len(records),'new':sum(r['kind']=='new'for r in records),'reused':sum(r['kind']=='reused'for r in records),'missing':missing,'items':records})
with (OUT/'manifest.csv').open('w',encoding='utf8',newline='')as f:
    fields=['index','text','kind','png','webp','size','ink_box_alpha16','png_sha256','webp_sha256','rgba_sha256'];w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
    for r in records:w.writerow({k:json.dumps(r[k],ensure_ascii=False)if isinstance(r[k],list)else r[k]for k in fields})
if missing and '--partial'not in sys.argv:raise ValueError('缺失字图: '+repr(missing))
if records:
    width=max(im.width for im in tiles)+16;height=sum(im.height+16 for im in tiles)+8
    atlas=Image.new('RGBA',(width,height));mapping={};y=8
    for r,im in zip(records,tiles):
        atlas.paste(im,(8,y));l,t,bottomr,bt=r['ink_box_alpha16'];x1=8+l;y1=y+t;x2=8+bottomr;y2=y+bt
        mapping[r['text']]={'src':'/_shared/nav-unify-standard-v1.webp','size':[width,height],'ink_left':x1/width,'ink_right':x2/width,'ink_top':y1/height,'ink_bottom':y2/height,'text':r['text']}
        r['atlas_ink_box']=[x1,y1,x2,y2];r['atlas_tile_box']=[8,y,8+im.width,y+im.height];y+=im.height+16
    atlas.save(OUT/'nav-unify-standard-v1.png');atlas.save(OUT/'nav-unify-standard-v1.webp',lossless=True,method=6,exact=True)
    assert Image.open(OUT/'nav-unify-standard-v1.webp').convert('RGBA').tobytes()==atlas.tobytes()
    save(OUT/'label-map-atlas-qa-only.json',mapping)
    standalone={}
    for r in records:
        w,h=r['size'];l,t,rr,b=r['ink_box_alpha16']
        standalone[r['text']]={'src':'/_shared/nav-unify-standard/'+Path(r['webp']).name,'size':[w,h],'ink_left':l/w,'ink_right':rr/w,'ink_top':t/h,'ink_bottom':b/h,'text':r['text']}
    save(OUT/'label-map-webp-visible-ink.json',standalone)
    manifest=json.loads((OUT/'manifest.json').read_text('utf8'));manifest['items']=records;manifest['atlas']={'size':[width,height],'png_sha256':sha(OUT/'nav-unify-standard-v1.png'),'webp_sha256':sha(OUT/'nav-unify-standard-v1.webp'),'webp_bytes':(OUT/'nav-unify-standard-v1.webp').stat().st_size};save(OUT/'manifest.json',manifest)
    # 每页最大边不超过900；正常字号28和网页字号18各一行，逐字复核。
    font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',12)
    for start in range(0,len(records),10):
        view=Image.new('RGB',(890,860),'#fffef9');d=ImageDraw.Draw(view)
        d.text((10,6),'标准原图复用 / 新图：28px逐字核对 + 18px网页显示',font=font,fill='#125239')
        for j,r in enumerate(records[start:start+10]):
            y=30+j*82;d.text((10,y),f'{r["index"]:02}  {r["kind"]}  {r["text"]}',font=font,fill='#34503f')
            im=Image.open(OUT/r['png']).convert('RGBA').crop(r['ink_box_alpha16'])
            for h,dy in [(28,18),(18,52)]:
                scaled=im.resize((round(im.width*h/im.height),h),Image.Resampling.LANCZOS)
                if scaled.width>860:raise ValueError(f'复核图一行不完整: {r["text"]}')
                view.paste(scaled,(10,y+dy),scaled)
        view.crop((0,0,890,30+len(records[start:start+10])*82)).save(OUT/f'labels-review-{start//10+1:02}-small.png')
print(json.dumps({'available':len(records),'new':sum(r['kind']=='new'for r in records),'reused':sum(r['kind']=='reused'for r in records),'missing':missing},ensure_ascii=False))
