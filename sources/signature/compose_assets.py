"""Paste only generated glyph strips into each original decoded raster."""
from pathlib import Path
from PIL import Image
import numpy as np, hashlib,json
from datetime import datetime,timezone,timedelta
root=Path(__file__).parent
repo=root/'worktree'
out=repo/'public/media/home-bio-20261005'
out.mkdir(parents=True,exist_ok=True)
rects=json.loads((root/'image-inputs/rects.json').read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def ink(a):
 a=a.astype(int)
 return (a[:,:,1]-a[:,:,0]>25)&(a[:,:,1]-a[:,:,2]>12)&(a[:,:,1]<190)&(a[:,:,0]<140)
def rows(a):
 y=np.where(ink(a).sum(axis=1)>5)[0]
 return [v for v in np.split(y,np.where(np.diff(y)>1)[0]+1) if len(v)>10]
patches={}
for ori in ('h','v'):
 original=Image.open(root/('image-inputs/signature-'+ori+'-native.png')).convert('RGB')
 generated=Image.open(root/('generated/signature-'+ori+'.png')).convert('RGB')
 oa=np.array(original);ga=np.array(generated)
 orows,grows=rows(oa),rows(ga)
 assert len(orows)==len(grows)==2
 # In this narrow signature strip the background is white. Preserve its
 # pale watercolor edge and all pixels outside the two printed text rows.
 patch=original.copy()
 for oy,gy in zip(orows,grows):
  oldmask=ink(oa[oy[0]:oy[-1]+1]);oldxs=np.where(oldmask.any(axis=0))[0]
  newmask=ink(ga[gy[0]:gy[-1]+1]);newxs=np.where(newmask.any(axis=0))[0]
  top,bottom=int(oy[0]),int(oy[-1]+1)
  # Clear only the previous text band; the pasted band is the generated art.
  # Both source rows occupy a clean white field inside this crop.
  region=Image.new('RGB',(patch.width,bottom-top+6),(255,255,255))
  oldleft=int(oldxs[0]);oldright=int(oldxs[-1]+1)
  piece=generated.crop((int(newxs[0])-3,int(gy[0])-3,int(newxs[-1])+4,int(gy[-1])+4))
  scale=(bottom-top)/(int(gy[-1])+1-int(gy[0]))
  piece=piece.resize((round(piece.width*scale),bottom-top+round(6*scale)),Image.Resampling.LANCZOS)
  xpos=oldleft-round(3*scale) if ori=='h' else (patch.width-piece.width)//2
  ypos=top-round(3*scale)
  # Only replace the union of old/new text extent, keeping side watercolor.
  left=min(oldleft-3,xpos);right=max(oldright+3,xpos+piece.width)
  patch.paste((255,255,255),(left,top-3,right,bottom+3))
  patch.paste(piece,(xpos,ypos))
  print('ROW',ori,{'old_y':[top,bottom],'new_width':piece.width,'xy':[xpos,ypos]})
 patches[ori]=patch
 patch.save(root/('generated/composited-signature-'+ori+'.png'))
 preview=patch.copy();preview.thumbnail((900,900));preview.save(root/('generated/composited-signature-'+ori+'-preview.png'))
sources=list((root.parent/'creative-integrator/prepared-living-final/assets').glob('home-01-*'))
sources+=list((root.parent/'creative-handoff/home-living/dist/assets').glob('plate-*.webp'))
items=[]
for p in sources:
 ori='h' if '-h-' in p.name else 'v'
 im=Image.open(p).convert('RGB');before=np.array(im)
 basis=(2880,1621) if ori=='h' else (1280,2227)
 r=rects[ori]
 rect=[round(r[0]*im.width/basis[0]),round(r[1]*im.height/basis[1]),round(r[2]*im.width/basis[0]),round(r[3]*im.height/basis[1])]
 patch=patches[ori].resize((rect[2]-rect[0],rect[3]-rect[1]),Image.Resampling.LANCZOS)
 im.paste(patch,(rect[0],rect[1]))
 stem=p.stem.rsplit('.',1)[0] if p.name.startswith('plate-') else p.stem
 tmp=out/(stem+'-bio.webp');im.save(tmp,format='WEBP',lossless=True,quality=100,method=6)
 dest=out/(stem+'-bio-'+sha(tmp)[:12]+'.webp');tmp.rename(dest)
 after=np.array(Image.open(dest).convert('RGB'))
 diff=np.any(before!=after,axis=2);outside=diff.copy();outside[rect[1]:rect[3],rect[0]:rect[2]]=False
 assert not outside.any(),p
 assert after.shape==before.shape
 # Verify exact native patch pixels survived the lossless WebP encode.
 assert np.array_equal(after[rect[1]:rect[3],rect[0]:rect[2]],np.array(patch))
 preview=im.copy();preview.thumbnail((900,900));preview.save(root/('generated/'+dest.stem+'-preview.png'))
 items.append({'old_name':p.name,'old_sha256':sha(p),'new_name':dest.name,'source_path':str(p),'repository_path':dest.relative_to(repo).as_posix(),'bytes':dest.stat().st_size,'sha256':sha(dest),'dimensions':list(im.size),'edit_rect_xyxy':rect,'changed_pixels':int(diff.sum()),'outside_rect_changed_pixels':int(outside.sum()),'lossless':True,'orientation':ori,'kind':'living' if p.name.startswith('plate-') else 'static'})
manifest={'schema':'wly.home-bio-assets.v1','prepared_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'old_text':'Java 出身，现在的乐趣是让 AI 替我把电脑和日常打理好。','new_text':'Java 出身，正在把自己的电脑和日常，一点点交给 AI 打理。','prefix':'在杭州。','items':items,'generated_patches':{ori:{'path':str(root/('generated/signature-'+ori+'.png')),'sha256':sha(root/('generated/signature-'+ori+'.png'))} for ori in ('h','v')}}
(out/'assets-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
(root/'assets-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
print(json.dumps({'images':len(items),'bytes':sum(i['bytes'] for i in items),'outside_rect_changed_pixels':sum(i['outside_rect_changed_pixels'] for i in items)},ensure_ascii=False))
