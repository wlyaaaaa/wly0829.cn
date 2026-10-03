"""DOM/network/accessibility regression probe using isolated headless Google Chrome."""
import argparse
from functools import partial
import http.server
import json
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

CHROME=Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
ANDROID_UA='Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
ROUTES=['/','/projects/localocr/','/skills/localocr/','/cockpit/','/rescue/','/projects/localocr/runtime-resources/']

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def check(root, profile_root):
    root=Path(root).resolve();profile_root=Path(profile_root).resolve()
    if profile_root.drive.upper()!='E:':raise ValueError('Chrome temporary profiles must use E drive')
    handler=partial(QuietHandler,directory=str(root))
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    origin='http://127.0.0.1:'+str(server.server_port);rows=[]
    try:
        with sync_playwright() as driver:
            for mode,options in [('desktop',{'viewport':{'width':1440,'height':1000},'device_scale_factor':1}),
                                 ('xiaomi15pro',{'viewport':{'width':412,'height':915},'device_scale_factor':3.5,'is_mobile':True,'has_touch':True,'user_agent':ANDROID_UA})]:
                context=driver.chromium.launch_persistent_context(str(profile_root/mode),executable_path=str(CHROME),headless=True,
                    args=['--no-first-run','--no-default-browser-check'],**options)
                try:
                    page=context.new_page();errors=[];bad=[]
                    page.on('pageerror',lambda error:errors.append(str(error)))
                    page.on('response',lambda response:bad.append({'url':response.url,'status':response.status}) if response.status>=400 and response.url.startswith(origin) else None)
                    for route in ROUTES:
                        errors.clear();bad.clear();response=page.goto(origin+route,wait_until='domcontentloaded',timeout=30000)
                        page.wait_for_timeout(900)
                        facts=page.evaluate('''() => {
                            const q=s=>document.querySelector(s);
                            const meta=k=>q('meta[name="'+k+'"],meta[property="'+k+'"]')?.content;
                            const transcripts=[...document.querySelectorAll('.screen-equivalent-text')];
                            return {title:document.title,description:meta('description'),canonical:q('link[rel=canonical]')?.href,
                                image:meta('og:image'),twitter:meta('twitter:image'),favicon:q('link[rel=icon]')?.href,
                                transcripts:transcripts.length,transcriptCharacters:transcripts.reduce((a,n)=>a+n.textContent.length,0),
                                transcriptVisible:transcripts.some(n=>n.getBoundingClientRect().width>1.1||n.getBoundingClientRect().height>1.1),
                                describedImages:document.querySelectorAll('picture img[aria-describedby]').length,
                                overflow:document.documentElement.scrollWidth>innerWidth+1,
                                firstScreenHeight:q('[data-screen]')?.getBoundingClientRect().height,
                                dpr:devicePixelRatio,userAgent:navigator.userAgent};
                        }''')
                        cdp=context.new_cdp_session(page)
                        ax=cdp.send('Accessibility.getFullAXTree')['nodes'];cdp.detach()
                        facts['accessibleTranscriptText']=sum(len(n.get('name',{}).get('value','')) for n in ax if n.get('role',{}).get('value')=='StaticText')
                        row={'route':route,'mode':mode,'status':response.status,**facts,'page_errors':list(errors),'local_network_errors':list(bad)}
                        row['pass']=bool(response.status==200 and facts['title'] and facts['description'] and facts['canonical']
                            and facts['image']==facts['twitter'] and facts['favicon'] and not facts['overflow']
                            and not facts['transcriptVisible'] and not errors and not bad)
                        if route!='/projects/localocr/runtime-resources/':row['pass']=row['pass'] and facts['transcripts']>0 and facts['accessibleTranscriptText']>50
                        rows.append(row)
                finally:context.close()
    finally:server.shutdown();server.server_close();thread.join(timeout=2)
    return {'schema':'wly.audit-publication-browser.v1','chrome':str(CHROME),'headless':True,'profile_root':str(profile_root),
            'passed':sum(row['pass'] for row in rows),'total':len(rows),'rows':rows}

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--release-root',type=Path,required=True)
    ap.add_argument('--profile-root',type=Path,required=True)
    ap.add_argument('--report',type=Path,required=True)
    args=ap.parse_args();result=check(args.release_root,args.profile_root)
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'passed':result['passed'],'total':result['total'],'failed':[{'route':row['route'],'mode':row['mode'],'errors':row['page_errors'],'network':row['local_network_errors']} for row in result['rows'] if not row['pass']]},ensure_ascii=False))
    if result['passed']!=result['total']:raise SystemExit(1)

if __name__=='__main__':main()
