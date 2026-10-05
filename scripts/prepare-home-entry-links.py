"""Fix only the owner's named home entry URLs, with exact reversible edits."""
import argparse
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import re

def sha(payload):return hashlib.sha256(payload).hexdigest()
def prepare_links(source_site, output_home=None, evidence_path=None, inspect=False, return_bytes=False):
    root=Path(source_site).resolve();source=root/'index.html'
    original=source.read_bytes();text=original.decode('utf8')
    manifest=json.loads((root/'release-manifest.json').read_text('utf-8-sig'))
    def published(url):
        rel=url.strip('/')+'/index.html'
        entry=manifest['files'].get(rel)
        path=root/rel
        return bool(entry and path.is_file() and path.stat().st_size==entry['bytes'] and sha(path.read_bytes())==entry['sha256'])
    collaboration='/how/'
    if not published(collaboration) or not published('/cockpit/'):
        raise ValueError('The complete current package must contain /how/ and /cockpit/; an unrelated project is not the collaboration target')
    targets={'home-01-link-1-0':collaboration,'home-01-link-2-0':'/cockpit/'}
    edits=[];counts=dict.fromkeys(targets,0)
    data=re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>',text,re.S)
    if not data:raise ValueError('Home page-data is missing')
    payload=data[1];model=json.loads(payload)
    if inspect:
        def walk(node):
            if isinstance(node,dict):
                if node.get('id') in targets:print(json.dumps(node))
                for value in node.values():walk(value)
            elif isinstance(node,list):
                for value in node:walk(value)
        walk(model);return
    for obj in re.finditer(r'\{[^{}]*"id"\s*:\s*"(home-01-link-[12]-0)"[^{}]*\}',payload):
        parsed=json.loads(obj[0]);identity=parsed['id']
        link=re.search(r'"href"\s*:\s*("(?:\\.|[^"\\])*")',obj[0])
        # Arrow audit records reuse the logical id but are not links.
        if not link:continue
        old=json.loads(link[1]);new=targets[identity]
        begin=data.start(1)+obj.start()+link.start(1);end=data.start(1)+obj.start()+link.end(1)
        edits.append({'start':begin,'end':end,'old':text[begin:end],'new':json.dumps(new),'identity':identity,'original_href':old,'target_href':new})
        counts[identity]+=1
    if any(count!=2 for count in counts.values()):raise ValueError('Both approved entries must have their horizontal and portrait link records')
    header=re.search(r'<header\b[^>]*>.*?</header>',text,re.S)
    if not header:raise ValueError('Top header is missing')
    nav_counts={'怎么协作':0,'驾驶舱':0}
    for anchor in re.finditer(r'<a\b[^>]*>.*?</a>',header[0],re.S):
        tag=anchor[0].split('>',1)[0]
        if not re.search(r'\bclass="[^"]*\bnav-link\b',tag):continue
        label=re.search(r'\bdata-label-text="([^"]+)"',anchor[0])
        if not label or html.unescape(label[1]) not in nav_counts:continue
        name=html.unescape(label[1]);href=re.search(r'\bhref="([^"]*)"',tag)
        if not href:raise ValueError('Top navigation has no href')
        new=collaboration if name=='怎么协作' else '/cockpit/'
        begin=header.start()+anchor.start()+href.start(1);end=header.start()+anchor.start()+href.end(1)
        edits.append({'start':begin,'end':end,'old':text[begin:end],'new':new,'identity':'top-nav:'+name,'original_href':html.unescape(href[1]),'target_href':new})
        nav_counts[name]+=1
    if any(count!=1 for count in nav_counts.values()):raise ValueError('Exactly the two approved top navigation entries are required')
    for edit in sorted(edits,key=lambda item:item['start'],reverse=True):
        if text[edit['start']:edit['end']]!=edit['old']:raise ValueError('Entry edit preimage differs')
        text=text[:edit['start']]+edit['new']+text[edit['end']:]
    spec=importlib.util.spec_from_file_location('home_entry_navigation',Path(__file__).with_name('repair-release-navigation.py'))
    nav=importlib.util.module_from_spec(spec);spec.loader.exec_module(nav)
    text,native_changes=nav.repair_owned_navigation(text,nav.page_inventory(root),'/')
    corrected=text.encode('utf8')
    if source.read_bytes()!=original:raise ValueError('Home changed during preparation')
    evidence={'schema':'wly.home-entry-links.v1','status':'pass','source':str(source),'before_sha256':sha(original),'after_sha256':sha(corrected),
        'changes':edits,'logical_entry_counts':counts,'top_navigation_counts':nav_counts,'source_unchanged':True,
        'native_navigation_changes':native_changes,'temporary_href_mappings':[],
        'restoration_rule':'Bind visible navigation labels against the complete current package; preserve historical inputs unchanged.'}
    if output_home:
        output_home=Path(output_home);output_home.parent.mkdir(parents=True,exist_ok=True);output_home.write_bytes(corrected)
    if evidence_path:
        evidence_path=Path(evidence_path);evidence_path.parent.mkdir(parents=True,exist_ok=True);evidence_path.write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    if return_bytes:return corrected,evidence
    return evidence

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-site',type=Path,required=True)
    parser.add_argument('--output-home',type=Path,required=True)
    parser.add_argument('--evidence',type=Path,required=True)
    parser.add_argument('--inspect',action='store_true')
    args=parser.parse_args()
    proof=prepare_links(args.source_site,args.output_home,args.evidence,args.inspect)
    if args.inspect:return
    collaboration=proof['changes'][0]['target_href']
    print(json.dumps({'status':'pass','changed_addresses':len(proof['changes']),'target_collaboration':collaboration,'target_cockpit':'/cockpit/'}))
if __name__=='__main__':main()
