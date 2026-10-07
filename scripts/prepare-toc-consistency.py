"""Normalize only in-page directory labels in a task-owned prepared site.

Call prepare_toc(site_root) after the other release overlays and before hashing
release-manifest.json. It changes no source screen, top navigation or live card.
"""
from __future__ import annotations
import argparse,hashlib,html,json,re
from pathlib import Path
HERE=Path(__file__).resolve().parent
MARKER='data-toc-consistency="uniform-v1"'
def prepare_toc(site_root, label_map=None, pages=None):
 root=Path(site_root).resolve()
 assets={}
 for name in ('toc-consistency.css','toc-consistency.js'):
  payload=(HERE/name).read_bytes();filename=Path(name).stem+'-'+hashlib.sha256(payload).hexdigest()[:20]+Path(name).suffix
  rel='_typeset/runtime/'+filename;target=root/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(payload);assets[Path(name).suffix]='/'+rel
 changes=[];missing=[]
 page_scope=None if pages is None else {Path(page).as_posix()for page in pages}
 for path in sorted(root.rglob('*.html')):
  if page_scope is not None and path.relative_to(root).as_posix()not in page_scope:continue
  before=path.read_bytes();text=before.decode('utf8');nav=re.search(r'<nav\b[^>]*class="toc"[^>]*>.*?</nav>',text,re.S)
  if not nav:continue
  if MARKER in nav[0]:continue
  model_match=re.search(r'<script[^>]*id="page-data"[^>]*>(.*?)</script>',text,re.S)
  model=json.loads(model_match[1]) if model_match else {}
  labels_map={**model.get('shared',{}).get('nav_labels',{}),**(label_map or {})}
  names=[html.unescape(x)for x in re.findall(r'data-label-[hv]="([^"]+)"',nav[0])]
  absent=sorted(set(names)-set(labels_map))
  originally_mixed=any(name not in model.get('shared',{}).get('nav_labels',{})for name in names)
  if not originally_mixed:continue
  if absent:missing.append({'page':str(path.relative_to(root)).replace('\\','/'),'labels':absent});continue
  ids=set(re.findall(r'\bid="([^"]+)"',text));labels=[]
  def anchor(m):
   tag,body=m[1],m[2];section=re.search(r'\bdata-section="([^"]+)"',tag);label=re.search(r'\bdata-label-h="([^"]+)"',tag)
   if not section or not label:return m[0]
   target=html.unescape(section[1]);name=html.unescape(label[1])
   if target not in ids:raise ValueError(f'{path.relative_to(root)}: Missing section anchor #{target}')
   tag=re.sub(r'\bhref="[^"]*"','href="#'+html.escape(target,quote=True)+'"',tag,count=1)
   labels.append({'section':target,'label':name})
   item=labels_map[name];w,h=item['size'];scale=18/(h*(item.get('ink_bottom',1)-item.get('ink_top',0)));left=item.get('ink_left',0);right=item.get('ink_right',1);top=item.get('ink_top',0)
   style=f'--toc-bitmap-height:{h*scale}px;--toc-bitmap-left:{-w*scale*left}px;--toc-bitmap-top:{-h*scale*top}px;--toc-label-width:{w*scale*(right-left)}px'
   return '<a'+tag+'><span class="nav-label" data-indicator="image-label" data-label-text="'+html.escape(name,quote=True)+'" style="'+style+'"><picture class="asset-picture"><img class="image-label" src="'+html.escape(item['src'],quote=True)+'" alt="'+html.escape(name,quote=True)+'"></picture></span></a>'
  updated=re.sub(r'<a([^>]*)>(.*?)</a>',anchor,nav[0],flags=re.S)
  if not labels:continue
  updated=updated.replace('<nav ','<nav '+MARKER+' ',1);text=text[:nav.start()]+updated+text[nav.end():]
  links='<script type="application/json" id="toc-label-data">'+json.dumps({name:labels_map[name]for name in names},ensure_ascii=False).replace('<','\\u003c')+'</script><link rel="stylesheet" href="'+assets['.css']+'"><script defer src="'+assets['.js']+'"></script>'
  text=text.replace('</head>',links+'</head>',1);path.write_bytes(text.encode('utf8'))
  changes.append({'page':str(path.relative_to(root)).replace('\\','/'),'labels':labels,'before_sha256':hashlib.sha256(before).hexdigest(),'after_sha256':hashlib.sha256(text.encode()).hexdigest()})
 return {'schema':'wly.toc-consistency.v1','status':'needs_assets' if missing else 'prepared','assets':assets,'missing_labels':missing,'page_count':len(changes),'pages':changes,'manifest_action':'Rehash the complete prepared package after applying this overlay.'}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--label-map',type=Path);p.add_argument('--site',type=Path,required=True);p.add_argument('--evidence',type=Path,required=True);a=p.parse_args();r=prepare_toc(a.site,json.loads(a.label_map.read_text('utf8'))if a.label_map else None);a.evidence.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(json.dumps({'status':r['status'],'page_count':r['page_count']}))
if __name__=='__main__':main()
