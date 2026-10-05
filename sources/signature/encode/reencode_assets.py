"""Rebuild approved glyphs from proven encoder inputs, without final-image decoding."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import copy, hashlib, io, json
import numpy as np
from PIL import Image, features

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).parent
ASSETS = OUT / 'new-assets'
MASTERS = OUT / 'edited-masters'
PREVIEW = OUT / 'previews'
OCR = OUT / 'ocr-inputs'
for p in (ASSETS, MASTERS, PREVIEW, OCR):
    p.mkdir(parents=True, exist_ok=True)
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
original_manifest = OUT / 'assets-manifest-before.json'
manifest = json.loads((original_manifest if original_manifest.exists() else ROOT / 'assets-manifest.json').read_text('utf8'))
static = {i['old_name']: i for i in json.loads((OUT / 'proof/static-provenance.json').read_text('utf8'))['items']}
living_proof = json.loads((ROOT / 'encode-review/plate-source-proof.json').read_text('utf8'))
living = {Path(i['baseline_path']).name: i for i in living_proof['items']}
rects = json.loads((ROOT / 'image-inputs/rects.json').read_text('utf8'))
patches = {}
for ori in ('h','v'):
    approved = Image.open(ROOT / f'generated/composited-signature-{ori}.png').convert('RGB')
    original = Image.open(ROOT / f'image-inputs/signature-{ori}-native.png').convert('RGB')
    difference = np.any(np.asarray(approved) != np.asarray(original), axis=2)
    ys = np.flatnonzero(difference.any(axis=1))
    bands = [g for g in np.split(ys,np.where(np.diff(ys)>1)[0]+1) if len(g)]
    boxes = []
    for band in bands:
        xs = np.flatnonzero(difference[band[0]:band[-1]+1].any(axis=0))
        boxes.append([int(xs[0]),int(band[0]),int(xs[-1]+1),int(band[-1]+1)])
    assert len(boxes) == 2, boxes
    patches[ori] = approved, boxes

edited = {}
def edit_master(path, ori):
    key = str(path), ori
    if key in edited:
        return edited[key]
    im = Image.open(path).convert('RGB')
    before = np.asarray(im).copy()
    basis = (2880,1621) if ori == 'h' else (1280,2227)
    r = rects[ori]
    master_rect = [round(v * im.size[k % 2] / basis[k % 2]) for k,v in enumerate(r)]
    approved, boxes = patches[ori]
    # Transfer only the same two approved row windows, preserving the master's
    # own white/watercolor pixels on all four crop edges.
    scaled = approved.resize((master_rect[2]-master_rect[0],master_rect[3]-master_rect[1]),Image.Resampling.LANCZOS)
    windows = []
    for box in boxes:
        mapped = [round(v*scaled.size[k%2]/approved.size[k%2]) for k,v in enumerate(box)]
        xy = [master_rect[0]+mapped[0],master_rect[1]+mapped[1]]
        im.paste(scaled.crop(mapped), tuple(xy))
        windows.append([xy[0],xy[1],master_rect[0]+mapped[2],master_rect[1]+mapped[3]])
    after = np.asarray(im)
    outside = np.any(before != after,axis=2)
    outside[master_rect[1]:master_rect[3],master_rect[0]:master_rect[2]] = False
    assert not outside.any()
    dest = MASTERS / (sha(path)[:12] + '-bio.png')
    im.save(dest)
    record = dict(path=str(dest),sha256=sha(dest),dimensions=list(im.size),edit_rect_xyxy=master_rect,
                  changed_windows_xyxy=windows,outside_rect_changed_pixels=0,
                  approved_patch_sha256=sha(ROOT / f'generated/composited-signature-{ori}.png'))
    edited[key] = im, record
    return im, record

def differences(old_path,new_path,rect,guard=0):
    a=np.asarray(Image.open(old_path).convert('RGB')).astype(np.int16)
    b=np.asarray(Image.open(new_path).convert('RGB')).astype(np.int16)
    assert a.shape == b.shape
    d=np.abs(a-b)
    mask=np.ones(a.shape[:2],bool)
    l,t,r,bottom=rect
    mask[max(0,t-guard):min(a.shape[0],bottom+guard),max(0,l-guard):min(a.shape[1],r+guard)] = False
    vals=d[mask]
    return dict(changed_pixels=int(np.any(vals!=0,axis=1).sum()),pixel_count=int(mask.sum()),
                max_channel_difference=int(vals.max()),mean_channel_difference=float(vals.mean()),
                p99_channel_difference=float(np.percentile(vals,99)),
                p999_channel_difference=float(np.percentile(vals,99.9)),guard_pixels=guard)

rows=[]
for old in manifest['items']:
    item=copy.deepcopy(old)
    old_path=Path(old['source_path'])
    prior=ROOT/'worktree'/old['repository_path']
    assert sha(prior)==old['sha256'] and sha(old_path)==old['old_sha256']
    proof=static.get(old['old_name']) or living[old['old_name']]
    supported = old['kind']=='living' or proof['sha256_equal'] or proof['decoded_pixels_equal']
    if not supported:
        item['encoding_status']='retained_delivered_lossless'
        item['retention_reason']='Original fallback chain includes decoded lossy WebP; no direct first-generation lossless encoder input proven.'
        item['provenance']=proof
        item['outside_edit_rect_diff']=differences(old_path,prior,old['edit_rect_xyxy'])
        item['previous_delivery_bytes']=old['bytes']
        item['original_bytes']=old_path.stat().st_size
        rows.append(item)
        im=Image.open(prior).convert('RGB')
    else:
        path=Path(proof.get('master_path') or proof['source_path'])
        assert sha(path)==(proof.get('master_sha256') or proof['source_sha256'])
        source,master=edit_master(path,old['orientation'])
        im=source.resize(tuple(old['dimensions']),Image.Resampling.LANCZOS) if source.size!=tuple(old['dimensions']) else source.copy()
        fmt='AVIF' if old_path.suffix=='.avif' else 'WEBP'
        if old['kind']=='static' and len(proof['encoding_steps'])==2:
            # Replay the original fallback recipe from the original lossless
            # master. Both its existing lossy stages remain; no final online
            # image is decoded as a new artwork input.
            first,second=proof['encoding_steps']
            interim=source.resize(tuple(first['resize']),Image.Resampling.LANCZOS)
            intermediate=io.BytesIO();interim.save(intermediate,'WEBP',**first['parameters'])
            im=Image.open(io.BytesIO(intermediate.getvalue())).resize(tuple(second['resize']),Image.Resampling.LANCZOS)
            params=second['parameters']
        else:
            params=proof['encoding_steps'][0]['parameters'] if old['kind']=='static' else dict(quality=93,method=6,exact=True)
        buffer=io.BytesIO();im.save(buffer,fmt,**params);body=buffer.getvalue()
        digest=hashlib.sha256(body).hexdigest()
        stem=(old_path.stem.rsplit('-',1)[0] if old['kind']=='static' else old_path.stem.rsplit('.',1)[0])
        name=stem+'-bio-'+digest[:12]+old_path.suffix
        dest=ASSETS/name;dest.write_bytes(body)
        diff=differences(old_path,dest,old['edit_rect_xyxy'])
        # Native masters remain byte-identical beyond the row windows. Global
        # changes after an ordinary lossy encode are measured, never called zero.
        item.update(new_name=name,repository_path='public/media/home-bio-20261005/'+name,
                    bytes=len(body),sha256=digest,lossless=False,encoding_status='reencoded_from_proven_master',
                    encoder=dict(format=fmt,pillow=Image.__version__,parameters=params),
                    provenance=proof,edited_master=master,previous_delivery_bytes=old['bytes'],
                    original_bytes=old_path.stat().st_size,outside_edit_rect_diff=diff,
                    outside_edit_rect_plus_16_diff=differences(old_path,dest,old['edit_rect_xyxy'],16),
                    outside_rect_changed_pixels=diff['changed_pixels'])
        a=np.asarray(Image.open(old_path).convert('RGB'));b=np.asarray(Image.open(dest).convert('RGB'))
        item['changed_pixels']=int(np.any(a!=b,axis=2).sum())
        rows.append(item)
        im=Image.open(dest).convert('RGB')
    preview=im.copy();preview.thumbnail((900,900));preview.save(PREVIEW/(Path(item['new_name']).stem+'.png'))
    crop=im.crop(old['edit_rect_xyxy']);crop.thumbnail((900,900));crop.save(OCR/(Path(item['new_name']).stem+'.png'))
    print(item['new_name'],item['encoding_status'],item['bytes'],item['outside_edit_rect_diff'],flush=True)

manifest['items']=rows
manifest['prepared_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
manifest['encoding_revision']='proven-master-reencode-v1'
manifest['encoding_summary']=dict(reencoded=sum(i['encoding_status']=='reencoded_from_proven_master' for i in rows),
                                 retained_lossless=sum(i['encoding_status']=='retained_delivered_lossless' for i in rows),
                                 previous_delivery_bytes=sum(i['previous_delivery_bytes'] for i in rows),
                                 bytes=sum(i['bytes'] for i in rows),original_bytes=sum(i['original_bytes'] for i in rows))
(OUT/'assets-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
print(json.dumps(manifest['encoding_summary']),flush=True)
