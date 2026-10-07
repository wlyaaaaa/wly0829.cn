"""定向移植当前鸟修复依赖到集成者的最新HTML，默认只核差分。"""
import argparse, json, re, sys
from pathlib import Path
from urllib.parse import urlsplit
import apply_bird_visible_upgrade as old
import prepare_living_batch as b
sys.path.insert(0, str(Path(__file__).resolve().parents[3] / 'living/tools'))
from pack import to_screen

def apply(site,packet,write=False,engine_url=None,bird_url=None,config_urls=None,pages=None):
 refs=b.read(packet/'references.json')
 engine_url=engine_url or refs['engine_url'];bird_url=bird_url or refs['bird_sprites_url']
 if Path(urlsplit(engine_url).path).name!=refs['current_engine']['engine']:raise ValueError('engine URL与批准内容版本不同')
 if not urlsplit(bird_url).path.endswith('/'+refs['current_engine']['bird']):raise ValueError('bird目录与批准内容版本不同')
 config_urls=config_urls or {};allowed={r['page'] for r in refs['mounted']}
 if not set(config_urls)<=allowed:raise ValueError('配置映射包含范围之外的页')
 selected=allowed if pages is None else set(pages)
 if not selected<=allowed:raise ValueError('选定页包含范围之外的页：'+', '.join(sorted(selected-allowed)))
 rows=[]
 for row in refs['mounted']:
  if row['page'] not in selected:continue
  p=site/b.relative(row['route']);before=p.read_bytes();cfg=config_urls.get(row['page'],row['config'])
  if refs.get('illustration_bindings'):
   data=json.loads(b.DATA.search(before.decode('utf-8'))[1]);parts=data['screens'][0]['parts']
   if data.get('page')!=row['page']:raise ValueError('实际首屏页名不符：'+row['page'])
   album=json.loads(re.search(r'<script\b[^>]*id="album-page"[^>]*>(.*?)</script>',before.decode('utf-8'),re.S)[1])
   source=refs['object_sources'][row['config'].lstrip('/')]
   config=b.read(Path(__file__).resolve().parents[5]/source)
   binding={};indices={}
   for o in ('h','v'):
    variant=config[o]
    nodes=[n for n in album['nodes'] if n['screen']==data['screens'][0]['id'] and n['orientation']==o]
    arts=[(n,a) for n in nodes for a in n['arts'] if a['key']==variant['source_sha256']]
    if len(arts)!=1:raise ValueError('首屏插画源已变或定位不唯一：'+row['page']+'/'+o)
    node,art=arts[0]
    matches=[(i,p) for i,p in enumerate(parts) if p['orientation']==o and p['src']==node['src'] and p['size']==node['size']]
    if len(matches)!=1:raise ValueError('首屏插画与实际分片不符：'+row['page']+'/'+o)
    i,part=matches[0];indices[o]=i;box=art['rect']
    if len(box)!=4 or min(box[2:])<=0:raise ValueError('首屏插画几何无效：'+row['page']+'/'+o)
    projected=to_screen(variant,box)
    projected['image']={'size':part['size']};projected['box']=box
    for mask in projected.get('masks',[]):
     mask['rect']=box;mask['src']=old.urljoin(row['config'],mask['src'])
    if projected.get('texture'):projected['texture']['src']=old.urljoin(row['config'],projected['texture']['src'])
    for effect in projected.get('effects',[]):
     if effect.get('sprite'):effect['sprite']['src']=old.urljoin(row['config'],effect['sprite']['src'])
    config[o]=projected
    binding[o]={'src':part['src'],'size':part['size'],'source_sha256':variant['source_sha256'],'rect':box}
   config['schema']='living-art/1'
   payload=json.dumps(config,ensure_ascii=False,separators=(',',':')).encode('utf-8')
   cfg='/_living/'+row['page']+'/bird-source.'+b.sha(payload)[:12]+'/config.json'
   if write:
    target=site/cfg.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(payload)
   runtime={**refs['runtime'],'engine':engine_url}
   text=re.sub(r'<link\b[^>]*data-living-runtime[^>]*>|<script\b[^>]*data-living-runtime[^>]*>.*?</script>','',before.decode('utf-8'),flags=re.S)
   text=re.sub(r'\s+data-living-first="[hv]"','',text)
   after=b.patch_html(text,data,indices,cfg,runtime,binding,set(),changed_data=False).encode('utf-8')
  else:
   after=old.patch_html(before,row,refs['previous_engine']['engine'],engine_url,cfg,
    previous_adapter=refs.get('previous_adapter'),current_adapter_url=refs.get('runtime',{}).get('adapter'),bird_sprites_url=None if refs.get('illustration_bindings') else bird_url)
  if write and after!=before:p.write_bytes(after)
  rows.append({'page':row['page'],'route':row['route'],'changed':before!=after,'before_sha256':b.sha(before),'after_sha256':b.sha(after),'body_hotspots_preserved':True})
 return {'schema':'wly.bird-fixed-selective-update.v1','status':'pass','applied':write,'pages':rows,'mounted':len(rows),'deferred_pages':sorted(allowed-selected),'stage_unmounted':len(refs['staged']),'external_actions':[]}

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__)
 for n in ('site','packet','output'):p.add_argument('--'+n,type=Path,required=True)
 p.add_argument('--pages',nargs='*')
 p.add_argument('--engine-url');p.add_argument('--bird-url');p.add_argument('--config-url-map',type=Path);p.add_argument('--apply',action='store_true')
 a=p.parse_args();r=apply(a.site,a.packet,a.apply,a.engine_url,a.bird_url,b.read(a.config_url_map) if a.config_url_map else None,pages=a.pages);b.write(a.output,r)
 print(json.dumps({'status':r['status'],'changed':sum(x['changed'] for x in r['pages']),'applied':r['applied']}))
