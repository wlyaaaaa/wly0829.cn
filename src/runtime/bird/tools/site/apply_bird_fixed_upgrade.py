"""定向移植当前鸟修复依赖到集成者的最新HTML，默认只核差分。"""
import argparse, json
from pathlib import Path
from urllib.parse import urlsplit
import apply_bird_visible_upgrade as old
import prepare_living_batch as b

def apply(site,packet,write=False,engine_url=None,bird_url=None,config_urls=None):
 refs=b.read(packet/'references.json')
 engine_url=engine_url or refs['engine_url'];bird_url=bird_url or refs['bird_sprites_url']
 if Path(urlsplit(engine_url).path).name!=refs['current_engine']['engine']:raise ValueError('engine URL与批准内容版本不同')
 if not urlsplit(bird_url).path.endswith('/'+refs['current_engine']['bird']):raise ValueError('bird目录与批准内容版本不同')
 config_urls=config_urls or {};allowed={r['page'] for r in refs['mounted']}
 if not set(config_urls)<=allowed:raise ValueError('配置映射包含范围之外的页')
 rows=[]
 for row in refs['mounted']:
  p=site/b.relative(row['route']);before=p.read_bytes();cfg=config_urls.get(row['page'],row['config'])
  if refs.get('native08_bindings') and b'data-living-runtime' not in before:
   data=json.loads(b.DATA.search(before.decode('utf-8'))[1]);parts=data['screens'][0]['parts']
   binding={o:{'src':parts[i]['src'],'size':parts[i]['size']} for o,i in row['first_screen_parts'].items()}
   if data.get('page')!=row['page'] or binding!=row['first_image_bindings']:raise ValueError('Native08实际首屏与被动配置绑定不符：'+row['page'])
   runtime={**refs['runtime'],'engine':engine_url}
   after=b.patch_html(before.decode('utf-8'),data,row['first_screen_parts'],cfg,runtime,binding,set(),changed_data=False).encode('utf-8')
  else:
   after=old.patch_html(before,row,refs['previous_engine']['engine'],engine_url,cfg,
    previous_adapter=refs.get('previous_adapter'),current_adapter_url=refs.get('runtime',{}).get('adapter'),bird_sprites_url=None if refs.get('native08_bindings') else bird_url)
  if write and after!=before:p.write_bytes(after)
  rows.append({'page':row['page'],'route':row['route'],'changed':before!=after,'before_sha256':b.sha(before),'after_sha256':b.sha(after),'body_binding_hotspots_preserved':True})
 return {'schema':'wly.bird-fixed-selective-update.v1','status':'pass','applied':write,'pages':rows,'mounted':len(rows),'stage_unmounted':len(refs['staged']),'external_actions':[]}

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__)
 for n in ('site','packet','output'):p.add_argument('--'+n,type=Path,required=True)
 p.add_argument('--engine-url');p.add_argument('--bird-url');p.add_argument('--config-url-map',type=Path);p.add_argument('--apply',action='store_true')
 a=p.parse_args();r=apply(a.site,a.packet,a.apply,a.engine_url,a.bird_url,b.read(a.config_url_map) if a.config_url_map else None);b.write(a.output,r)
 print(json.dumps({'status':r['status'],'changed':sum(x['changed'] for x in r['pages']),'applied':r['applied']}))
