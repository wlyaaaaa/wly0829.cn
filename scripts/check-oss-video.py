"""Verify real hero playback in installed headless Chrome without screenshots.

Loopback mode serves exact release bytes, supports Range, and delays a real MP4
beyond the old six-second cutoff. --url verifies a deployed release with fresh
browser contexts; its cold-cache result is separate from loopback evidence.
"""
from __future__ import annotations
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import threading
import time
from urllib.parse import urljoin, urlsplit
from playwright.async_api import async_playwright

DATA = re.compile(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', re.S)
INSTRUMENT = r'''(()=>{
 const seen=new WeakSet();window.__ossVideo={events:[],first_frame_ms:null,frames:0};
 function watch(v){if(seen.has(v))return;seen.add(v);const proof=window.__ossVideo;
  for(const type of ['loadstart','loadedmetadata','loadeddata','canplay','playing','waiting','error','seeked'])v.addEventListener(type,()=>proof.events.push({type,ms:performance.now(),time:v.currentTime,ready:v.classList.contains('ready'),paused:v.paused}));
  if(v.requestVideoFrameCallback){const tick=(ms,meta)=>{if(proof.first_frame_ms===null)proof.first_frame_ms=ms;proof.frames++;proof.last_frame_media_time=meta.mediaTime;v.requestVideoFrameCallback(tick);};v.requestVideoFrameCallback(tick);}
 }
 new MutationObserver(records=>{for(const row of records)for(const n of row.addedNodes){if(n.nodeType!==1)continue;if(n.tagName==='VIDEO')watch(n);n.querySelectorAll?.('video').forEach(watch);}}).observe(document,{childList:true,subtree:true});
})();'''
SNAPSHOT = r'''()=>{
 const v=document.querySelector('video.hero-video')||document.querySelector('video'),s=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen');
 return {phase:window.SiteHero?.phase,reason:window.SiteHero?.reason,hidden:document.hidden,width:innerWidth,portrait:matchMedia('(orientation:portrait)').matches,reduced_motion:matchMedia('(prefers-reduced-motion:reduce)').matches,
  attached:!!v,paused:v?.paused??null,video_hidden:v?.hidden??null,ready_state:v?.readyState??null,ready_class:v?.classList.contains('ready')??false,opacity:v?getComputedStyle(v).opacity:null,src:v?.getAttribute('src'),current_src:v?.currentSrc,
  current_time:v?.currentTime||0,duration:v?.duration||0,video_width:v?.videoWidth||0,video_height:v?.videoHeight||0,playback_rate:v?.playbackRate,section_visible:s?(()=>{const r=s.getBoundingClientRect();return !!s.getClientRects().length&&r.bottom>0&&r.top<innerHeight;})():null,
  proof:window.__ossVideo};
}'''


class MediaServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, root):
        super().__init__(('127.0.0.1', 0), partial(RangeHandler, directory=str(root)))
        self.requests = []; self.delay_seconds = 0; self.chunk_seconds = 0


class RangeHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path.startswith('/__oss_video_host/'):
            body = b'<!doctype html><title>Video DOM verifier</title><iframe id="probe" style="border:0;width:1440px;height:1000px"></iframe>'
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        path = Path(self.translate_path(self.path))
        if path.suffix.lower() != '.mp4' or not path.is_file():
            return super().do_GET()
        size = path.stat().st_size; start = 0; end = size-1
        requested = self.headers.get('Range'); status = 200
        if requested:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', requested.strip())
            if not match:
                self.send_error(416); return
            if match[1]:
                start = int(match[1]); end = min(end, int(match[2]) if match[2] else end)
            else:
                start = max(0, size-int(match[2]))
            if start > end or start >= size:
                self.send_error(416); return
            status = 206
        record = {'path': urlsplit(self.path).path, 'range': requested, 'status': status,
                  'size': size, 'start': start, 'end': end, 'requested_monotonic': time.monotonic(), 'bytes_sent': 0}
        self.server.requests.append(record)
        delay, chunk_delay = self.server.delay_seconds, self.server.chunk_seconds
        try:
            self.send_response(status); self.send_header('Content-Type', 'video/mp4')
            self.send_header('Accept-Ranges', 'bytes'); self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(end-start+1))
            if status == 206: self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.end_headers()
            if delay: time.sleep(delay)
            with path.open('rb') as stream:
                stream.seek(start); left = end-start+1
                while left:
                    chunk = stream.read(min(65536, left)); self.wfile.write(chunk); self.wfile.flush()
                    record['bytes_sent'] += len(chunk); left -= len(chunk)
                    if chunk_delay and left: time.sleep(chunk_delay)
            record['completed_monotonic'] = time.monotonic()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
            record['connection_closed'] = True
        finally:
            record['ended_monotonic'] = time.monotonic()


def video_pages(root):
    rows = []
    for html in sorted(root.rglob('*.html')):
        match = DATA.search(html.read_text('utf8'))
        if not match: continue
        data = json.loads(match[1])
        if data.get('video'):
            rel = html.relative_to(root).as_posix()
            route = '/' if rel == 'index.html' else '/'+rel.removesuffix('index.html')
            rows.append({'route': route, 'spec': data['video']})
    return rows


async def position(page, offscreen=False):
    await page.evaluate('''offscreen=>{const s=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen');const r=s.getBoundingClientRect();scrollTo({top:Math.max(0,scrollY+(offscreen?r.bottom+200:r.top-80)),behavior:'instant'});}''', offscreen)
    await page.wait_for_timeout(200)


async def wait_playing(page):
    await page.wait_for_function("(()=>{const v=document.querySelector('video.hero-video');return v&&!v.hidden&&!v.paused&&v.readyState>=3&&v.classList.contains('ready')&&window.SiteHero?.phase==='playing'&&window.__ossVideo?.frames>0;})()", timeout=45000)


async def observe_playback(page, spec):
    before = await page.evaluate(SNAPSHOT); await page.wait_for_timeout(600); after = await page.evaluate(SNAPSHOT)
    result = {'before': before, 'after': after, 'issues': []}
    if not (after['proof']['first_frame_ms'] is not None and after['proof']['frames'] > 0): result['issues'].append('No presented video frame')
    if after['current_time'] == before['current_time']: result['issues'].append('Video media time did not advance')
    if after['src'] != spec['src']: result['issues'].append('Video src does not directly bind the released media URL')
    if (after['current_src'] or '').startswith('blob:'): result['issues'].append('Video still uses a Blob URL')
    if not after['ready_class'] or float(after['opacity']) < .95: result['issues'].append('Video did not fade in after canplay')
    if after['playback_rate'] != (spec.get('playback_rate') or 1): result['issues'].append('Released video speed changed')
    canplay = next((row for row in after['proof']['events'] if row['type'] == 'canplay'), None)
    if not canplay or canplay['ready']: result['issues'].append('Fade was already applied before canplay')
    seek = await page.evaluate('''async()=>{const v=document.querySelector('video.hero-video');v.pause();const target=Math.min(v.duration-.1,Math.max(.5,v.duration*.55));const before=window.__ossVideo.frames;
      return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('seeked frame deadline')),10000);v.addEventListener('seeked',()=>{v.requestVideoFrameCallback((ms,meta)=>{clearTimeout(timer);resolve({target,current_time:v.currentTime,media_time:meta.mediaTime,frames_before:before,frames_after:window.__ossVideo.frames,width:v.videoWidth,height:v.videoHeight,seeked:true});});},{once:true});v.currentTime=target;});}''')
    result['seek'] = seek
    if not seek['seeked'] or abs(seek['current_time']-seek['target']) > .1 or not seek['width']: result['issues'].append('Seek did not decode a real frame')
    await page.evaluate('''async()=>{const v=document.querySelector('video.hero-video');await v.play();}''')
    return result


async def context_page(browser, cache, width=1440, reduced=False, save_data=False):
    context = await browser.new_context(viewport={'width': width, 'height':1000}, reduced_motion='reduce' if reduced else 'no-preference')
    await context.add_init_script(INSTRUMENT)
    if save_data:
        await context.add_init_script("Object.defineProperty(navigator,'connection',{value:{saveData:true}})")
    page = await context.new_page(); session = await context.new_cdp_session(page)
    await session.send('Network.enable'); await session.send('Network.setCacheDisabled', {'cacheDisabled':True})
    return context, page


async def sample(browser, cache, base, row, server=None, delayed=False):
    context, page = await context_page(browser, cache); errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
    request_start = len(server.requests) if server else 0
    if delayed: server.delay_seconds = 7.25; server.chunk_seconds = .1
    try:
        response = await page.goto(urljoin(base, row['route']), wait_until='load', timeout=90000)
        if not response or response.status != 200: raise ValueError('Page HTTP status is not 200')
        await position(page); await wait_playing(page)
        transfers_at_playback = [dict(r) for r in server.requests[request_start:]] if server else []
        proof = await observe_playback(page, row['spec'])
        proof.update({'route':row['route'], 'case':'delayed_range' if delayed else 'cold_desktop', 'page_errors':errors,
                      'method':'Installed headless Chrome; fresh context, HTTP cache disabled; real frame callbacks, media time and seeked'})
        if errors: proof['issues'].extend(errors)
        if server:
            proof['media_requests_at_playback'] = transfers_at_playback
            proof['media_requests'] = [dict(r) for r in server.requests[request_start:]]
            if not any(r['status'] == 206 for r in proof['media_requests']): proof['issues'].append('No real Range response observed')
        if delayed:
            first = proof['after']['proof']['first_frame_ms']; proof['old_timeout_seconds'] = 6
            if first < 7250: proof['issues'].append('Delayed request did not exceed the old cutoff')
            if not any((r.get('ended_monotonic', time.monotonic())-r['requested_monotonic']) > 6 for r in proof['media_requests']): proof['issues'].append('Transfer did not exceed six seconds')
            proof['playback_before_full_response'] = any(r['bytes_sent'] < r['end']-r['start']+1 for r in transfers_at_playback)
        proof['status'] = 'fail' if proof['issues'] else 'pass'
        return proof
    except Exception as error:
        return {'route':row['route'], 'case':'delayed_range' if delayed else 'cold_desktop', 'status':'fail', 'issues':[str(error)], 'last_state':await page.evaluate(SNAPSHOT)}
    finally:
        if delayed: server.delay_seconds = 0; server.chunk_seconds = 0
        await context.close()


async def forbidden(browser, cache, base, row, case):
    width = 390 if case == 'phone' else 1023 if case == 'below_width' else 1440
    context, page = await context_page(browser, cache, width, case == 'reduced_motion', case == 'save_data')
    try:
        address = urljoin(base, row['route'])+('?audit=1' if case == 'audit' else '')
        await page.goto(address, wait_until='load', timeout=90000); await position(page)
        if case == 'offscreen':
            await wait_playing(page); before = await page.evaluate(SNAPSHOT); await position(page, True)
        else: before = None
        await page.wait_for_timeout(750); state = await page.evaluate(SNAPSHOT)
        issues = []
        if state['attached'] and (not state['paused'] or not state['video_hidden']): issues.append('Disallowed video remained active')
        if state['phase'] != 'image': issues.append('Disallowed video runtime did not return to image')
        if case == 'offscreen' and state['section_visible']: issues.append('Hero did not actually leave the viewport')
        return {'route':row['route'], 'case':case, 'status':'fail' if issues else 'pass','before':before,'state':state,'issues':issues,
                'condition_method':'Injected saveData API flag' if case == 'save_data' else 'Native viewport/media/scroll condition'}
    finally: await context.close()


async def static_gate(browser, cache, base, row):
    context,page=await context_page(browser,cache);media=[]
    page.on('request',lambda request:media.append(request.url) if urlsplit(request.url).path.endswith('.mp4') else None)
    try:
        await page.goto(urljoin(base,row['route']),wait_until='load',timeout=90000);await position(page)
        await page.wait_for_timeout(500);state=await page.evaluate(SNAPSHOT)
        retained=await page.evaluate('''()=>{const data=JSON.parse(document.querySelector('#page-data').textContent),section=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen'),im=section.querySelector('picture img');return {spec:data.video,static_image_preserved:!!im&&im.complete&&im.naturalWidth>0,current_static_src:im?.currentSrc,static_width:im?.naturalWidth,static_height:im?.naturalHeight};}''')
        issues=[]
        if state['attached'] or media:issues.append('An incompatible video was mounted or requested')
        if state['phase']!='image' or state['reason']!='illustration-compatibility':issues.append('Video illustration gate did not hold the static state')
        if not retained['static_image_preserved']:issues.append('The retained static illustration did not decode')
        if retained['spec']!=row['spec']:issues.append('Video restoration metadata changed')
        return {'route':row['route'],'case':'illustration_static_gate','state':state,'retained':retained,'media_requests':media,'issues':issues,'status':'fail' if issues else 'pass'}
    finally:await context.close()


async def hidden_gate(browser, cache, base, row):
    context, page = await context_page(browser, cache)
    try:
        # Reuse the existing typeset QA method: real iframe navigation emits
        # visibilitychange on its old document, without spoofing document.hidden.
        await page.goto(urljoin(base, '/__oss_video_host/'), wait_until='load')
        await page.evaluate('address=>document.querySelector("#probe").src=address', urljoin(base,row['route']))
        frame = await page.wait_for_selector('#probe'); child = await frame.content_frame()
        await child.wait_for_url(urljoin(base,row['route']))
        await child.wait_for_load_state('load'); await position(child); await wait_playing(child)
        before = await child.evaluate(SNAPSHOT)
        proof = await page.evaluate('''async()=>{const f=document.querySelector('#probe'),w=f.contentWindow,d=w.document,v=d.querySelector('video.hero-video'),state=w.SiteHero;
          return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('native hidden deadline')),10000);d.addEventListener('visibilitychange',()=>{if(!d.hidden)return;const t=v.currentTime;setTimeout(()=>{clearTimeout(timer);resolve({hidden:d.hidden,visibility_state:d.visibilityState,paused:v.paused,video_hidden:v.hidden,phase:state.phase,time_before:t,time_after:v.currentTime});},350);});f.src='about:blank';});}''')
        issues = []
        if not (proof['hidden'] and proof['visibility_state'] == 'hidden' and proof['paused'] and proof['video_hidden'] and proof['phase'] == 'image'): issues.append('Native document-hidden transition did not pause/hide video')
        if proof['time_after'] > proof['time_before']+.01: issues.append('Hidden video time continued')
        return {'route':row['route'],'case':'document_hidden','method':'Existing QA native iframe navigation visibilitychange','before':before,'state':proof,'issues':issues,'status':'fail' if issues else 'pass'}
    finally: await context.close()


async def all_media(browser, cache, base, rows):
    context, page = await context_page(browser, cache); result = []
    try:
        await page.goto(base,wait_until='domcontentloaded'); await page.set_content('<!doctype html><video muted playsinline style="width:640px;height:360px"></video>')
        for row in rows:
            url = urljoin(urljoin(base,row['route']),row['spec']['src'])
            issues=[];proof={}
            try:
                proof = await page.evaluate('''async url=>{const v=document.querySelector('video');v.src=url;v.muted=true;
                  await v.play();const t=v.currentTime;await new Promise(r=>setTimeout(r,250));const advanced=v.currentTime!==t;v.pause();const target=Math.min(v.duration-.1,v.duration*.6);
                  const seek=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('media seek deadline')),10000);let sought=false,frame=null;
                    const finish=()=>{if(sought&&frame){clearTimeout(timer);resolve(frame);}};
                    v.addEventListener('seeked',()=>{sought=true;finish();},{once:true});
                    const observe=(ms,meta)=>{if(Math.abs(meta.mediaTime-target)>.15){v.requestVideoFrameCallback(observe);return;}frame={media_time:meta.mediaTime,width:v.videoWidth,height:v.videoHeight};finish();};
                    v.requestVideoFrameCallback(observe);v.currentTime=target;});return {direct_url:v.currentSrc,duration:v.duration,time_advanced:advanced,seek_target:target,seek};}''',url)
                if not proof['time_advanced'] or not proof['seek']['width'] or abs(proof['seek_target']-proof['seek']['media_time'])>.15: issues.append('Real MP4 playback/seek failed')
            except Exception as error:
                issues.append(str(error));proof['last_state']=await page.evaluate(SNAPSHOT)
            result.append({'route':row['route'],**proof,'status':'fail' if issues else 'pass','issues':issues})
            print('Media '+row['route']+': '+result[-1]['status'],flush=True)
    finally: await context.close()
    return result


async def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release',type=Path,required=True);parser.add_argument('--task-cache',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True);parser.add_argument('--url')
    parser.add_argument('--pages',nargs='+',default=['/','/projects/localocr/','/skills/localocr/'])
    parser.add_argument('--chrome',default='C:/Program Files/Google/Chrome/Application/chrome.exe')
    parser.add_argument('--mount-only',action='store_true',help='Verify MM01 mount/static gates without repeating unchanged MP4 decode checks')
    args=parser.parse_args();rows=video_pages(args.release.resolve());by_route={r['route']:r for r in rows}
    if set(args.pages)-set(by_route): raise ValueError('Sample lacks a real released video')
    cache=args.task_cache.resolve();cache.mkdir(parents=True,exist_ok=True)
    os.environ.update({'TEMP':str(cache),'TMP':str(cache),'TMPDIR':str(cache)})
    server=None;thread=None
    if not args.url:
        server=MediaServer(args.release.resolve());thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    base=args.url or f'http://127.0.0.1:{server.server_port}/'
    result={'schema':'wly.oss-video-browser.v1','scope':'deployed_cold_cache' if args.url else 'loopback_real_media',
            'base_url':base,'status':'fail','checks':[],'source_media_count':len(rows),'screenshots_taken':False}
    result['video_mount_scope']=[{'route':row['route'],'mount_allowed':row['spec'].get('mount_allowed'),
                                 'compatibility':row['spec'].get('compatibility'),'src_retained':bool(row['spec'].get('src')),
                                 'mask_retained':bool(row['spec'].get('mask'))} for row in rows]
    manifest_path=args.release.resolve()/'release-manifest.json'
    with manifest_path.open('rb') as stream:
        result['release_manifest_sha256']=hashlib.file_digest(stream,'sha256').hexdigest()
    result['release_id']=json.loads(manifest_path.read_text('utf8'))['release_id']
    try:
        async with async_playwright() as runtime:
            # Installed Google Chrome; no signed-in profile or visible window.
            browser=await runtime.chromium.launch(executable_path=args.chrome,headless=True,
                args=['--hide-scrollbars'],downloads_path=str(cache))
            try:
                for route in args.pages:
                    row=by_route[route]
                    proof=await static_gate(browser,cache,base,row) if row['spec'].get('mount_allowed') is False else await sample(browser,cache,base,row,server)
                    result['checks'].append(proof);print(route+' mount/static: '+proof['status'],flush=True)
                for case in ([] if args.mount_only else ['phone','below_width','reduced_motion','offscreen','save_data','audit']):
                    proof=await forbidden(browser,cache,base,rows[0],case);result['checks'].append(proof);print(case+': '+proof['status'],flush=True)
                if server and not args.mount_only:
                    proof=await sample(browser,cache,base,rows[0],server,True);result['checks'].append(proof);print('delayed_range: '+proof['status'],flush=True)
                    proof=await hidden_gate(browser,cache,base,rows[0]);result['checks'].append(proof);print('document_hidden: '+proof['status'],flush=True)
                elif not args.mount_only:
                    result['native_hidden_check']='Reuse the loopback native-hidden proof for identical runtime; deployment does not serve the test host'
                if args.mount_only:
                    result['media_decode_checks']=[];result['unchanged_media_decode']='Not repeated; original 27-MP4 playback/seek proof remains in the earlier exact-media browser evidence'
                else:
                    result['media_decode_checks']=await all_media(browser,cache,base,rows)
                    print('Real MP4 decode/seek: '+str(sum(r['status']=='pass' for r in result['media_decode_checks']))+'/'+str(len(rows)),flush=True)
            finally: await browser.close()
    finally:
        if server: server.shutdown();server.server_close();thread.join(timeout=3)
    result['status']='pass' if all(r['status']=='pass' for r in result['checks']+result['media_decode_checks']) else 'fail'
    result['checked_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return 0 if result['status']=='pass' else 2


if __name__=='__main__':
    raise SystemExit(asyncio.run(main()))
