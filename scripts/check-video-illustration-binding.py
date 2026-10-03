"""Bind hero mount decisions to exact release media and source provenance.

This tool never displays images. The optional home frame check runs FFmpeg into
memory and reports full-resolution masked foreground numbers as supporting
evidence, rather than accepting a small whole-picture similarity score.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import posixpath
import re
import subprocess
from urllib.parse import unquote, urlsplit

DATA = re.compile(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', re.S)


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def stamp(path):
    with Path(path).open('rb') as stream:
        digest=hashlib.file_digest(stream,'sha256').hexdigest()
    return {'sha256':digest,'bytes':Path(path).stat().st_size}


def asset_path(page, address, files):
    url=urlsplit(address); path=unquote(url.path)
    if not url.scheme and not url.netloc:
        rel=posixpath.normpath(posixpath.join(posixpath.dirname('/'+page),path)).lstrip('/')
        if rel in files:return rel
    # OSS absolute URLs may have a release prefix before the unchanged object path.
    matches=[rel for rel in files if path=='/'+rel or path.endswith('/'+rel)]
    if len(matches)!=1:raise ValueError('Asset address has no unique exact release path: '+address)
    return matches[0]


def route(page):
    return '/' if page=='index.html' else '/'+page.removesuffix('index.html')


class HeroPicture(HTMLParser):
    def __init__(self,text):
        super().__init__();self.in_section=False;self.in_picture=False;self.done=False;self.addresses=[];self.feed(text)

    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='section' and d.get('data-screen') and not self.done:self.in_section=True
        if tag=='picture' and self.in_section and not self.done:self.in_picture=True
        if self.in_picture and tag in {'source','img'}:
            if d.get('src'):self.addresses.append(d['src'])
            self.addresses.extend(part.strip().split()[0] for part in d.get('srcset','').split(',') if part.strip())

    def handle_endtag(self,tag):
        if tag=='picture' and self.in_picture:self.in_picture=False;self.done=True


def static_files(page,data,text,files):
    screen=data['screens'][0]
    addresses=[p['src'] for p in screen.get('parts',[]) if p.get('src')]
    if not addresses:addresses=HeroPicture(text).addresses
    return {asset_path(page,a,files):files[asset_path(page,a,files)] for a in addresses}


def home_supporting_numbers(root,data,source_image):
    import numpy as np
    from PIL import Image
    files=read(root/'release-manifest.json')['files'];video=data['video'];w,h=video['size']
    vp=asset_path('index.html',video['src'],files);mp=asset_path('index.html',video['mask'],files)
    process=subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(root/vp),'-frames:v','1',
                            '-f','rawvideo','-pix_fmt','rgb24','pipe:1'],capture_output=True,check=True,
                            creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0),timeout=30)
    frame=np.frombuffer(process.stdout,np.uint8).reshape(h,w,3).astype(float)
    mask=np.asarray(Image.open(root/mp).convert('L').resize((w,h),Image.Resampling.NEAREST))>=250
    layout=data['screens'][0]['layouts']['h'];sw,sh=layout['size'];r=video['rect']
    crop=tuple(round(x) for x in (r[0]*sw,r[1]*sh,(r[0]+r[2])*sw,(r[1]+r[3])*sh))
    source=Image.open(source_image).convert('RGB')
    region=np.asarray(source.crop(crop).resize((w,h),Image.Resampling.LANCZOS)).astype(float)
    foreground=lambda z:((z.max(2)-z.min(2)>20)&(z.min(2)<220))|(z.mean(2)<160)
    selections={'masked_foreground_union':mask&(foreground(region)|foreground(frame)),
                'masked_dark_core':mask&(region.mean(2)<160)}
    difference=np.abs(frame-region);checks={}
    for name,use in selections.items():
        if int(use.sum())<1000:raise ValueError('Insufficient non-white effective illustration pixels')
        checks[name]={'pixels':int(use.sum()),'fraction_of_native_frame':float(use.mean()),
                     'mae_255':float(difference[use].mean()),'channel_error_p90':float(np.percentile(difference[use],90)),
                     'pixel_fraction_max_channel_error_gt40':float((difference.max(2)[use]>40).mean())}
    return {'native_video_size':[w,h],'method':'Native decoded first frame; mask>=250, saturated/dark foreground union and dark core; no white-background averaging',
            'support_only':True,'threshold_used_for_admission':False,'checks':checks,'image_or_frame_written':False,'visual_tool_used':False}


def prepare(root,build_reports,audit_findings,home_source,home_review,home_job,output):
    root=root.resolve();manifest=read(root/'release-manifest.json');files=manifest['files']
    builds={};inputs=[]
    for path in build_reports:
        document=read(path);inputs.append({'kind':'build_report','sha256':stamp(path)['sha256']})
        for item in document.get('pages',{}).values():
            if item.get('video_expected'):builds[item['url']]=item
    findings=read(audit_findings);mm01=next(item for item in findings if item['id']=='MM-01')
    mismatched=set(mm01['affected_routes']);review=read(home_review);job=read(home_job)
    inputs.extend({'kind':kind,'sha256':stamp(path)['sha256']} for kind,path in
                  [('MM01_findings',audit_findings),('home_approved_binding',home_review),('home_generation_job',home_job)])
    pages={}
    for page in sorted(files):
        if not page.endswith('.html'):continue
        text=(root/page).read_text('utf8');match=DATA.search(text)
        if not match:continue
        data=json.loads(match[1]);video=data.get('video')
        if not video:continue
        address=route(page);vp=asset_path(page,video['src'],files);mp=asset_path(page,video['mask'],files)
        if stamp(root/vp)!=files[vp] or stamp(root/mp)!=files[mp]:raise ValueError('Recorded media bytes changed')
        entry={'mount_allowed':False,'status':'insufficient_evidence','reason':'没有可靠的同素材与源裁切绑定；保留新首屏静图，待按新插画重出或证明匹配后恢复',
               'video_sha256':files[vp]['sha256'],'mask_sha256':files[mp]['sha256'],
               'video_path':vp,'mask_path':mp,'hero_static_files':static_files(page,data,text,files),
               'original_video_spec':video,'restoration':'保留原 src、mask、rect、资源；新素材证据到齐后重新运行绑定检查和挂载准备，不是永久禁播名单'}
        build=builds.get(address)
        if build:
            expected=build['video_expected'];binding=expected.get('binding',{})
            entry['old_binding']={k:binding.get(k) for k in ['method','illustration_sha256','source_crop_used','source_image']}
            if expected['src_sha256']!=entry['video_sha256'] or expected['mask_sha256']!=entry['mask_sha256'] or expected['rect']!=video['rect']:
                raise ValueError('Build evidence does not bind the actual media/geometry: '+address)
        if address in mismatched:
            entry.update(status='mismatched',reason='同版 MM-01 已确认旧视频与新插画构图不一致；保留新首屏静图，待按新插画重出视频',mismatch_evidence='MM-01 / '+mm01['source_id'],mismatch_method='复用已有同版审计结论；本检查未重新视觉查看')
        if address=='/':
            source_stamp=stamp(home_source);layout=data['screens'][0]['layouts']['h'];sw,sh=layout['size'];r=video['rect']
            measured_crop=[round(x) for x in [r[0]*sw,r[1]*sh,(r[0]+r[2])*sw,(r[1]+r[3])*sh]]
            matched=(not data.get('typeset') and entry['video_sha256']==review['video_sha256']==job['video_sha256']
                     and entry['mask_sha256']==review['mask_sha256']==job['mask_sha256']
                     and source_stamp['sha256']==review['source_sha256'] and measured_crop==job['source_crop'])
            if not matched:raise ValueError('Home approved source/video/mask/crop provenance is incomplete')
            entry.update(mount_allowed=True,status='matched_provenance',reason='当前首页 video/mask SHA、已审 job/accepted、批准插画源 SHA 与实际裁切范围完整一致',
                         provenance={'approved_source':source_stamp,'approved_video_sha256':review['video_sha256'],'approved_mask_sha256':review['mask_sha256'],
                                     'source_crop':job['source_crop'],'actual_crop':measured_crop,'source_binding_steering_id':review.get('source_binding_steering_id')},
                         supporting_numbers=home_supporting_numbers(root,data,home_source))
        pages[address]=entry
    result={'schema':'wly.video-illustration-binding.v1','status':'pass','checked_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),
            'source_release_id':manifest['release_id'],'source_manifest_sha256':stamp(root/'release-manifest.json')['sha256'],
            'admission_method':'完整源素材/视频/遮罩/crop provenance 主准入；无证据不挂载。全分辨率非白有效区域数值只辅证，无视觉查看。',
            'inputs':inputs,'pages':pages,'counts':{state:sum(row['status']==state for row in pages.values()) for state in ['matched_provenance','mismatched','insufficient_evidence']}}
    output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ['source','audit-findings','home-source','home-review','home-job','output']:parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--build-report',type=Path,action='append',default=[])
    args=parser.parse_args();result=prepare(args.source,args.build_report,args.audit_findings,args.home_source,args.home_review,args.home_job,args.output)
    print(json.dumps({'status':result['status'],'pages':len(result['pages']),'counts':result['counts']},ensure_ascii=False))


if __name__=='__main__':main()
