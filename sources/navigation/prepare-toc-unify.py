"""在集成方当前完整准备包上刷新全站目录；不覆盖整包。

prepare_toc(site_root, label_map, pages) 的调用形状沿用旧入口。
本版允许刷新已规范化目录，也覆盖原先纯字图的页；原文字面和a标签保留。
"""
from __future__ import annotations
import argparse, hashlib, html, json, re
from pathlib import Path
HERE=Path(__file__).resolve().parent
MARKER='data-toc-consistency="uniform-v1"'

def prepare_toc(site_root, label_map=None, pages=None):
    root=Path(site_root).resolve()
    if not label_map:raise ValueError('必须传入本轮完整标准label_map；拒绝隐式回退')
    scope=None if pages is None else {Path(p).as_posix() for p in pages}
    plans=[];missing=[]
    for path in sorted(root.rglob('*.html')):
        rel=path.relative_to(root).as_posix()
        if scope is not None and rel not in scope:continue
        before=path.read_bytes();text=before.decode('utf8')
        nav=re.search(r'<nav\b[^>]*class="toc"[^>]*>.*?</nav>',text,re.S)
        if not nav:continue
        names=[html.unescape(x)for x in re.findall(r'data-label-[hv]="([^"]+)"',nav[0])]
        absent=sorted(set(names)-set(label_map))
        if absent:missing.append({'page':rel,'labels':absent});continue
        ids=set(re.findall(r'\bid="([^"]+)"',text))
        labels=[]
        def anchor(m):
            tag=m[1];section=re.search(r'\bdata-section="([^"]+)"',tag);label=re.search(r'\bdata-label-h="([^"]+)"',tag)
            if not section or not label:return m[0]
            target=html.unescape(section[1]);name=html.unescape(label[1])
            if target not in ids:raise ValueError(f'{rel}: 目录目标不存在 #{target}')
            href=re.search(r'\bhref="([^"]+)"',tag)
            if not href or html.unescape(href[1])!='#'+target:raise ValueError(f'{rel}: href与data-section不一致，不替任务外正文改字')
            labels.append({'section':target,'label_h':name,'label_v':html.unescape(re.search(r'data-label-v="([^"]+)"',tag)[1])})
            item=label_map[name];w,h=item['size'];scale=18/(h*(item['ink_bottom']-item['ink_top']))
            style=f'--toc-bitmap-height:{h*scale}px;--toc-bitmap-left:{-w*scale*item["ink_left"]}px;--toc-bitmap-top:{-h*scale*item["ink_top"]}px;--toc-label-width:{w*scale*(item["ink_right"]-item["ink_left"])}px'
            return '<a'+tag+'><span class="nav-label" data-indicator="image-label" data-label-text="'+html.escape(name,quote=True)+'" style="'+style+'"><picture class="asset-picture"><img class="image-label" src="'+html.escape(item['src'],quote=True)+'" alt="'+html.escape(name,quote=True)+'"></picture></span></a>'
        updated=re.sub(r'<a([^>]*)>(.*?)</a>',anchor,nav[0],flags=re.S)
        if not labels:continue
        if MARKER not in updated:updated=updated.replace('<nav ','<nav '+MARKER+' ',1)
        text=text[:nav.start()]+updated+text[nav.end():]
        text=re.sub(r'<script\b[^>]*id="toc-label-data"[^>]*>.*?</script>','',text,flags=re.S)
        text=re.sub(r'<link\b[^>]*href="[^"]*/toc-consistency[^"/]*\.css"[^>]*>','',text)
        text=re.sub(r'<script\b[^>]*(?:src|data-src)="[^"]*/toc-consistency[^"/]*\.js"[^>]*>\s*</script>','',text,flags=re.S)
        plans.append({'path':path,'page':rel,'before':before,'text':text,'labels':labels,'names':names})
    # 缺图时不进行半截接线，交调用方补全输入。
    if missing:return {'schema':'wly.toc-unify.v1','status':'needs_assets','page_count':0,'missing_labels':missing,'pages':[]}
    assets={}
    for name in ('toc-consistency.css','toc-consistency.js'):
        payload=(HERE/'runtime'/name).read_bytes()
        filename=Path(name).stem+'-'+hashlib.sha256(payload).hexdigest()[:20]+Path(name).suffix
        rel='_typeset/runtime/'+filename;dst=root/rel;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(payload);assets[Path(name).suffix]='/'+rel
    changes=[]
    for plan in plans:
        data={name:label_map[name]for name in dict.fromkeys(plan['names'])}
        tags='<script type="application/json" id="toc-label-data">'+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+'</script><link rel="stylesheet" href="'+assets['.css']+'"><script defer src="'+assets['.js']+'"></script>'
        text=plan['text'].replace('</head>',tags+'</head>',1)
        if text.encode('utf8')!=plan['before']:plan['path'].write_bytes(text.encode('utf8'))
        changes.append({'page':plan['page'],'labels':plan['labels'],'before_sha256':hashlib.sha256(plan['before']).hexdigest(),'after_sha256':hashlib.sha256(text.encode('utf8')).hexdigest(),'changed':text.encode('utf8')!=plan['before']})
    return {'schema':'wly.toc-unify.v1','status':'prepared','assets':assets,'missing_labels':[],'page_count':len(changes),'changed_page_count':sum(x['changed']for x in changes),'pages':changes,'manifest_action':'在当前完整准备包调用后，按集成原管线重算完整包manifest。'}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--site',type=Path,required=True);p.add_argument('--label-map',type=Path,required=True);p.add_argument('--pages',type=Path,required=True);p.add_argument('--evidence',type=Path,required=True);a=p.parse_args()
    pages=json.loads(a.pages.read_text('utf8'));pages=[x['page']if isinstance(x,dict)else x for x in pages]
    result=prepare_toc(a.site,json.loads(a.label_map.read_text('utf8')),pages)
    a.evidence.parent.mkdir(parents=True,exist_ok=True);a.evidence.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(json.dumps({'status':result['status'],'page_count':result['page_count'],'changed_page_count':result.get('changed_page_count',0)}))
if __name__=='__main__':main()
