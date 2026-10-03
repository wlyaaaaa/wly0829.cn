"""Read-only desktop/mobile checks on deployed routes using isolated headless Chrome."""
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
import json
import hashlib
from pathlib import Path
import time
import uuid
from urllib.parse import urljoin, urlsplit, unquote
from playwright.async_api import async_playwright


async def main():
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ('build-report','output','task-cache'):
        parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--url',default='https://wly0829.cn/')
    parser.add_argument('--pages',nargs='+')
    parser.add_argument('--widths',nargs='+',type=int,default=[1440,390])
    parser.add_argument('--canonical',action='store_true')
    parser.add_argument('--navigate-width',type=int)
    parser.add_argument('--release',type=Path,help='Exact restored package; legacy samples must exist in its manifest')
    parser.add_argument('--legacy',action='store_true',help='Check restored legacy routes without requiring typeset data')
    args=parser.parse_args()
    build=json.loads(args.build_report.read_text('utf8'))
    available=list(build['pages'])
    if args.legacy:
        if not args.release:raise ValueError('Legacy checks require the exact restored package')
        files=json.loads((args.release/'release-manifest.json').read_text('utf8'))['files']
        def route_file(name):
            path=unquote(urlsplit(build['pages'][name]['url']).path).lstrip('/')
            return path+'index.html' if not path or path.endswith('/') else path
        available=[name for name in available if route_file(name) in files]
    preferred=[name for name in ('404','cockpit','localocr') if name in available]
    names=args.pages or list(dict.fromkeys(preferred+available))[:3]
    if not names:names=available[:3]
    if set(names)-set(available):raise ValueError('Online sample is outside the reviewed batch')
    cache=args.task_cache.resolve();cache.mkdir(parents=True,exist_ok=True)
    profile=cache/('chrome-profile-'+uuid.uuid4().hex)
    result={'schema':'wly.typeset-online-dom.v1','status':'fail','pages':names,'checks':[],
            'method':'Installed Chrome, isolated headless profile; visible viewport DOM, dimensions and image decode only; no screenshots'}
    async with async_playwright() as runtime:
        context=await runtime.chromium.launch_persistent_context(str(profile),headless=True,
            executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',
            viewport={'width':1440,'height':1000},args=['--hide-scrollbars'])
        try:
            page=context.pages[0]
            for name in names:
                for width in args.widths:
                    issues=[];errors=[];unavailable=False
                    def on_error(error):errors.append(str(error))
                    page.on('pageerror',on_error)
                    try:
                        await page.set_viewport_size({'width':args.navigate_width or width,'height':1000})
                        route=build['pages'][name]['url']
                        address=urljoin(args.url,route)+(('' if args.canonical else '?typeset_online='+str(time.time_ns())))
                        response=await page.goto(address,wait_until='domcontentloaded',timeout=60000)
                        if not response or response.status!=200:issues.append('Route HTTP status is not 200')
                        elif not args.legacy and hashlib.sha256(await response.body()).hexdigest()!=build['pages'][name]['html_sha256']:issues.append('Online HTML bytes differ from the reviewed page')
                        if not args.legacy:
                            await page.wait_for_function('!!window.SiteAudit',timeout=20000)
                            if args.navigate_width and args.navigate_width!=width:
                                await page.set_viewport_size({'width':width,'height':1000})
                            await page.wait_for_function("""()=>document.fonts.status==='loaded'&&Array.from(document.querySelectorAll('.typeset-part:not([hidden])')).filter(host=>{const r=host.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}).every(host=>{const im=host.querySelector('picture img');return host._layout&&im&&im.complete&&im.naturalWidth>0&&Array.from(host.querySelectorAll('.typeset-screenshot img')).every(x=>x.complete&&x.naturalWidth>0);})""",timeout=180000)
                        await page.wait_for_timeout(300)
                        observed=await page.evaluate("""()=>{
                          const doc=document, data=JSON.parse(doc.querySelector('#page-data')?.textContent||'{}'), issues=[];
                          let parts=0,hotspots=0,live=0,shots=0;
                          if(doc.documentElement.scrollWidth>innerWidth+1)issues.push('Horizontal overflow');
                          for(const host of doc.querySelectorAll('.typeset-part:not([hidden])')){
                            const r=host.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight)continue;parts++;const p=host._layout,im=host.querySelector('picture img');
                            if(!p||!im?.complete||im.naturalWidth!==p.size[0]||im.naturalHeight!==p.size[1])issues.push('Image/model decode mismatch');
                            else if(Math.abs(r.height-r.width*p.size[1]/p.size[0])>1.5)issues.push('Image aspect ratio mismatch');
                            for(const h of p?.hotspots||[]){
                              const el=[...host.querySelectorAll('[data-hot-id]')].find(x=>x.dataset.hotId===h.id);
                              if(!el){issues.push('Missing hotspot '+h.id);continue;}
                              const b=el.getBoundingClientRect(),want=[r.left+h.rect_px[0]*r.width/p.size[0],r.top+h.rect_px[1]*r.height/p.size[1],h.rect_px[2]*r.width/p.size[0],h.rect_px[3]*r.height/p.size[1]];
                              if(Math.max(Math.abs(b.left-want[0]),Math.abs(b.top-want[1]),Math.abs(b.width-want[2]),Math.abs(b.height-want[3]))>1.5)issues.push('Hotspot geometry mismatch '+h.id);
                              if(['link','button'].includes(h.kind))hotspots++;
                              if(h.kind==='live'){live++;if(!el.textContent.trim()&&el.tagName!=='INPUT'&&!el.classList.contains('typeset-lamp')&&h.slot!=='ca-toast')issues.push('Empty live slot '+h.id);}
                              if(h.kind==='screenshot'){shots++;if(el.querySelectorAll('img').length!==h.shots.length||[...el.querySelectorAll('img')].some(x=>!x.complete||!x.naturalWidth))issues.push('Screenshot decode mismatch '+h.id);}
                            }
                          }
                          return {width:innerWidth,route:location.pathname,typeset:!!data.typeset,hidden:doc.hidden,
                            scroll_width:doc.documentElement.scrollWidth,active_parts:parts,hotspots,live_slots:live,screenshot_slots:shots,issues};
                        }""")
                        issues.extend(observed.pop('issues'))
                        if not args.legacy and not observed['typeset']:issues.append('Online route is not the reviewed typeset generation')
                        if observed['width']!=width or observed['hidden']:issues.append('Online sample viewport is not visible at the requested width')
                    except Exception as error:
                        unavailable=True
                        observed={'width':width,'route':build['pages'][name]['url']}
                        issues.append(type(error).__name__+': '+(str(error)or'bounded image readiness deadline reached'))
                    finally:page.remove_listener('pageerror',on_error)
                    issues.extend(errors)
                    check={'page':name,**observed,'status':'unknown' if unavailable else 'fail' if issues else 'pass','issues':sorted(set(issues))}
                    result['checks'].append(check)
                    print(name+' '+str(width)+': '+check['status'],flush=True)
        finally:await context.close()
    result['status']='unknown' if any(c['status']=='unknown' for c in result['checks']) else 'pass' if result['checks'] and all(c['status']=='pass' for c in result['checks']) else 'fail'
    result['checked_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return 0 if result['status']=='pass' else 3 if result['status']=='unknown' else 2


if __name__=='__main__':
    try:raise SystemExit(asyncio.run(main()))
    except Exception as error:
        print('Online browser result is unavailable: '+str(error),flush=True)
        raise SystemExit(3)
