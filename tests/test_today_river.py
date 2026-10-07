"""Installed-Chrome acceptance of the actual B2 relay with synthetic status."""
from __future__ import annotations

import argparse
import asyncio
import datetime as dt
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import subprocess
import threading
import time
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BJT = dt.timezone(dt.timedelta(hours=8))
spec = importlib.util.spec_from_file_location('live_browser', ROOT / 'tests/live-runtime-browser.py')
live_browser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(live_browser)


def verify_insurance(output):
    """Feed timestamps to the actual loop policy; never busy-wait the browser."""
    source=(ROOT/'scripts/today-river.js').read_text('utf8')
    frame=source[source.index('function frame(ts)'):source.index('function freeze(why)')]
    wake=next(line for line in source.splitlines() if line.startswith('const wake = '))
    script=r"""
const vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={document:{hidden:false},requestAnimationFrame:()=>1,console};
vm.createContext(sandbox);
vm.runInContext(`let raf=0,still=false,seen=true,reduce=false,last=0,gaps=[],since=0,M={stale:false};
const metrics={frames:0,medianFPS:null,freezeReason:null},clock={t0:null,skip:false,manual:null};
const SPEED=2.5,I={end:16.5};const step=()=>{};
const freeze=why=>{still=true;metrics.freezeReason=why;};
`+FRAME+'\n'+WAKE+`
function reset(){raf=0;still=false;seen=true;reduce=false;M.stale=false;document.hidden=false;last=0;gaps=[];since=0;clock.t0=null;metrics.frames=0;metrics.medianFPS=null;metrics.freezeReason=null;}
function run(from,to,gap){for(let t=from;t<=to;t+=gap)frame(t);}
function evidence(){return {insurance:still,frames:metrics.frames,medianFPS:metrics.medianFPS,reason:metrics.freezeReason};}
`,sandbox);
const cases=[];
function check(name,code,want){vm.runInContext('reset();'+code,sandbox);const value=vm.runInContext('evidence()',sandbox);assert.equal(value.insurance,want,name);cases.push({case:name,...value});}
check('first-two-seconds','run(1,1900,150)',false);
check('single-long-frame','run(1,6000,1000/60);frame(7500);run(7517,11000,1000/60)',false);
check('brief-slow-frames','run(1,6000,1000/60);run(6150,6600,150);run(6617,12000,1000/60)',false);
check('hidden-excluded','run(1,6000,1000/60);document.hidden=true;run(6150,17000,150);document.hidden=false;wake();run(17017,24000,1000/60)',false);
check('stale-water-insured','M.stale=true;run(1,12000,150)',true);
check('reduced-motion-excluded','reduce=true;run(1,12000,150)',false);
check('continuous-low-fps','run(1,14000,150)',true);
process.stdout.write(JSON.stringify({schema:'wly.today-river-insurance-policy.v1',synthetic_timestamps:true,busy_wait:false,cases}));
""".replace('FRAME',json.dumps(frame)).replace('WAKE',json.dumps(wake))
    result=subprocess.run(['node','-'],input=script,text=True,capture_output=True,check=True)
    (output/'insurance-policy.json').write_text(result.stdout+'\n','utf8')
    reader=r"""
const vm=require('node:vm'),assert=require('node:assert/strict'),fs=require('node:fs');
const requests=[];let timeout=true,expired=false;
const sandbox={module:{exports:{}},AbortController,clearTimeout,setTimeout:(f,ms)=>setTimeout(f,ms===8000?5:ms),fetch:async(url,{signal})=>{
 requests.push(url);if(timeout&&url.includes('live.wly'))return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true}));
 return {ok:true,json:async()=>({observed_at_unix:Date.now()/1000-(expired&&url.includes('mcp.wly')?121:0),automation:{state:'unavailable'}})};
}};
vm.runInNewContext(fs.readFileSync('scripts/site-live-runtime.js','utf8'),sandbox);
(async()=>{const read=sandbox.module.exports.readStatus;
 await read(undefined,false,false);timeout=false;await read(undefined,false,false);expired=true;
 assert.equal((await read(undefined,false,false)).automation.state,'unavailable');await read(undefined,false,true);await read(undefined,false,false);
 assert.deepEqual(requests.map(x=>x.includes('live.wly')?'live':x.includes('mcp.wly')?'mcp':x),['live','mcp','mcp','mcp','live','/__status','live']);
 const signal=AbortSignal.abort();await assert.rejects(read(signal,false,false));assert.equal(requests.length,7);process.stdout.write(JSON.stringify({mock:true,timeout_path:true,requests}));
})().catch(error=>{console.error(error);process.exitCode=1;});
"""
    readback=subprocess.run(['node','-'],input=reader,text=True,capture_output=True,check=True,cwd=ROOT)
    (output/'reader-policy.json').write_text(readback.stdout+'\n','utf8')
    return json.loads(result.stdout)


def fixture(mode):
    result = live_browser.fixture('normal')
    now = time.time() - (3600 if mode=='stale' else 0)
    iso = lambda seconds: dt.datetime.fromtimestamp(seconds, BJT).isoformat()
    def row(key, state='success', **extra):
        return {'id':'synthetic-'+key,'project':'合成测试','group':'backup','enabled':True,'state':state,
                'plain':{'name':'合成'+key,'what':'只用于本地合成验收','stop':'没有真实任务可以停','impact':'不影响电脑'}, **extra}
    rows = [row('已跑',last_run_at=iso(now-60),next_run_at=iso(now+900),runs_today=True),
            row('未跑',last_run_at=iso(now-86400),next_run_at=iso(now+1800),runs_today=True),
            row('未来时间',last_run_at=iso(now+1800),next_run_at=iso(now+2400),runs_today=True),
            row('高频','running',group='upkeep',schedule_zh='每 10 秒一次',last_run_at=iso(now-10),next_run_at=iso(now+10)),
            row('停用','disabled',enabled=False,last_run_at=iso(now-30)),
            row('明天',last_run_at=iso(now-86400),next_run_at=iso(now+86400))]
    if mode in ['partial','errors']:
        rows.append(row('未知','unknown'))
    if mode == 'errors':
        rows.extend([row('失败','failed',last_run_at=iso(now-120),status_note='合成失败原因'),
                     row('过期','overdue',status_note='合成过期原因'),
                     row('灯出错','failed',schedule_zh='每 5 分钟一次',last_run_at=iso(now-60))])
        rows.append(row('内部编号','never',plain={}))
    a = {'state':'partial' if mode=='partial' else 'ok','items':rows,'groups':[{'id':'backup','name':'合成备份组'},{'id':'upkeep','name':'合成维护组'}],
         'observed_at':iso(now),'max_age_seconds':120}
    if mode=='empty':
        a.update(state='empty',items=[])
    if mode in ['unknown','unavailable']:
        a.update(state=mode,items=[])
    if mode=='stale':
        a.update(state='stale',observed_at=iso(now))
    result['automation']=a
    return result


SNAP = r"""()=>{
 const root=document.querySelector('#today-river'), stage=root.querySelector('#stage'), sc=root.querySelector('#scroller');
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
 return {headline:root.querySelector('#headline').textContent,when:root.querySelector('#when').textContent,
   signs:[...root.querySelectorAll('.sign')].map(e=>e.textContent),
   tips:[...root.querySelectorAll('[data-tip]')].map(e=>e.dataset.tip),
   lead:root.querySelector('.tag.lead')?.textContent,
   groups:[...root.querySelectorAll('.group>summary')].map(e=>e.textContent),
   legend:root.querySelector('#legend').textContent, root:rect(root), stage:rect(stage), scroller:rect(sc),
   textLayout:[...root.querySelectorAll('h3,.when,.legend>span,.card h4,.group>summary,.group>summary .say')].map(e=>({text:e.textContent,lineHeight:getComputedStyle(e).lineHeight,height:e.getBoundingClientRect().height})),
   scrollLeft:sc.scrollLeft, gateCenter:rect(stage).x+stage.clientWidth*.47, overflow:document.documentElement.scrollWidth>innerWidth+1,
   model:window.todayRiver.model?{state:window.todayRiver.model.A.state,reason:window.todayRiver.model.snap.reason,ran:window.todayRiver.model.tasks.filter(t=>t.ran).length,future:window.todayRiver.model.future.length,guards:window.todayRiver.model.guards.length,fog:window.todayRiver.model.fog.length}:null,
   insurance:window.todayRiver.still,static:window.todayRiver.static,gl:window.todayRiver.gl,metrics:window.todayRiver.metrics,
   title:document.title, b2:[...document.querySelectorAll('[data-b2-slot=cockpit-quick-4],[data-b2-slot=cockpit-tasks]')].map(e=>e.textContent),
   riverStorageKeys:[...Object.keys(localStorage),...Object.keys(sessionStorage)].filter(k=>/river/i.test(k)&&!k.startsWith('site-river-height-v1:')),
   activeAnimations:root.getAnimations({subtree:true}).filter(a=>a.playState==='running').length};
}"""


async def main(args):
    args.output.mkdir(parents=True,exist_ok=True)
    policy=verify_insurance(args.output)
    args.temp.mkdir(parents=True,exist_ok=True)
    os.environ['TEMP']=os.environ['TMP']=str(args.temp.resolve())
    state={'mode':'failure','status_requests':0,'external_blocked':[],'non_get_blocked':[],'missing':[]}
    site=args.site.resolve()
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*_): pass
        def do_GET(self):
            path=unquote(urlsplit(self.path).path)
            mime='text/html; charset=utf-8'; status=200
            if path=='/__status':
                state['status_requests']+=1
                status=503 if state['mode']=='failure' else 200
                body=json.dumps(fixture(state['mode']),ensure_ascii=False).encode()
                mime='application/json'
            elif path=='/__graph':
                body=b'<html><body>synthetic graph</body></html>'
            else:
                target=(site/(path.lstrip('/')+('index.html' if path.endswith('/') else ''))).resolve()
                if not target.is_relative_to(site):
                    status=403;body=b''
                elif target.is_file():
                    body=target.read_bytes();mime=mimetypes.guess_type(target)[0] or 'application/octet-stream'
                else:
                    status=404;body=b'';state['missing'].append(path)
            self.send_response(status)
            self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)))
            self.send_header('Access-Control-Allow-Origin','https://wly0829.cn')
            self.send_header('Access-Control-Allow-Credentials','true')
            self.end_headers();self.wfile.write(body)
        def do_POST(self):
            state['non_get_blocked'].append(self.path);self.send_error(405)
    class Server(ThreadingHTTPServer):
        request_queue_size=256
    server=Server(('127.0.0.1',0),Handler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results=[];errors=[];console=[];failure=None;contexts=[]
    try:
        async with async_playwright() as pw:
            for device,options in [('desktop',{'viewport':{'width':1440,'height':1000}}),('phone',{'viewport':{'width':412,'height':915},'device_scale_factor':3.5,'is_mobile':True,'has_touch':True})]:
                context=await pw.chromium.launch_persistent_context(str(args.temp/device),executable_path=str(args.chrome),headless=True,timezone_id='America/Chicago',**options)
                contexts.append(context)
                async def route(r):
                    request=r.request;u=urlsplit(request.url)
                    if request.method!='GET':
                        state['non_get_blocked'].append(request.url);return await r.abort()
                    if u.hostname=='wly0829.cn':path=u.path
                    elif u.hostname=='mcp.wly0829.cn' and u.path.endswith('/status'):
                        if state['mode']=='offline-browser':return await r.continue_()
                        path='/__status'
                    elif u.hostname=='local-graph.invalid':path='/__graph'
                    else:
                        state['external_blocked'].append(request.url);return await r.abort()
                    response=await context.request.get(base+path,timeout=20000)
                    await r.fulfill(response=response)
                await context.route('**/*',route)
                page=context.pages[0]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:console.append({'type':m.type,'text':m.text}) if m.type in ['error','warning'] or '[今天的河]' in m.text or '[river-audio-test]' in m.text else None)
                async def load(mode,reduce=False):
                    state['mode']=mode
                    await page.emulate_media(reduced_motion='reduce' if reduce else 'no-preference')
                    await page.goto('https://wly0829.cn/cockpit/',wait_until='domcontentloaded')
                    try:
                        await page.wait_for_function("window.todayRiver?.ready && document.body.dataset.b2StatusPhase === '"+('error' if mode=='failure' else 'ready')+"'",timeout=12000)
                    except Exception:
                        results.append({'device':device,'case':'load-failed-'+mode,'dom':await page.evaluate('({phase:document.body.dataset.b2StatusPhase,river:!!window.todayRiver,b2:!!window.SiteB2,headline:document.querySelector("#headline")?.textContent})')})
                        raise
                    await page.locator('#today-river').scroll_into_view_if_needed()
                    await page.wait_for_timeout(400)
                    return await page.evaluate(SNAP)
                async def refresh(mode):
                    state['mode']=mode
                    await page.evaluate('window.SiteB2.refresh()')
                    await page.wait_for_timeout(450)
                    return await page.evaluate(SNAP)
                initial=await load('failure')
                assert initial['model'] is None and initial['headline']=='暂时读不到电脑，还没读到今天的自动任务。',initial
                assert 'NaN' not in initial['when']
                results.append({'device':device,'case':'initial-no-data','snapshot':initial})
                empty=await load('empty')
                assert empty['headline']=='电脑上现在没有登记的自动任务。',empty
                results.append({'device':device,'case':'empty','snapshot':empty})
                normal=await load('normal')
                await page.evaluate('window.todayRiver.seek(10)')
                normal=await page.evaluate(SNAP)
                assert normal['model']['ran']==1 and normal['model']['guards']==1 and normal['model']['future']==3,normal
                assert all('今天跑了 2 个' in x for x in normal['b2']),normal['b2']
                assert any('合成备份组' in x and '合成维护组' in x for x in normal['b2']),normal['b2']
                assert not normal['overflow'] and normal['root']['width']>0,normal
                assert all(float(x['lineHeight'].removesuffix('px'))>0 and x['height']>0 for x in normal['textLayout']),normal['textLayout']
                assert not normal['riverStorageKeys'],normal
                assert normal['gl'],normal
                assert '小样' not in normal['title']
                if device=='phone':
                    assert normal['stage']['width']>=860
                    center=normal['scroller']['x']+normal['scroller']['width']/2
                    assert abs(normal['gateCenter']-center)<22,(normal['gateCenter'],center)
                    await page.locator('#today-river #scroller').evaluate('(e)=>e.scrollLeft=0')
                    assert await page.locator('#today-river #scroller').evaluate('(e)=>e.scrollLeft')==0
                results.append({'device':device,'case':'normal-future-runs-today-and-chinese-groups','snapshot':normal})
                if device=='phone':
                    await refresh('normal')
                    assert await page.locator('#today-river #scroller').evaluate('(e)=>e.scrollLeft')==0
                    await page.evaluate('window.todayRiver.seek(10);window.riverOrientationNodes=[...document.querySelector("#today-river #layer").children]')
                    await page.set_viewport_size({'width':915,'height':412})
                    await page.wait_for_timeout(250)
                    landscape=await page.evaluate(SNAP)
                    await page.set_viewport_size({'width':412,'height':915})
                    await page.wait_for_timeout(250)
                    portrait=await page.evaluate(SNAP)
                    same_nodes=await page.evaluate('[...document.querySelector("#today-river #layer").children].every((e,i)=>e===window.riverOrientationNodes[i])')
                    assert same_nodes and not landscape['overflow'] and not portrait['overflow']
                    assert len(portrait['signs'])==len(normal['signs']) and portrait['signs']==normal['signs']
                    results.append({'device':device,'case':'rotate-no-replay-no-duplicate-and-preserve-manual-scroll','same_nodes':same_nodes,'landscape':landscape,'portrait':portrait})
                if args.small_crops:
                    await page.locator('#today-river #stage').evaluate('(e)=>window.scrollBy(0,e.getBoundingClientRect().top-90)')
                    await page.locator('#today-river #scroller').evaluate('(e)=>e.scrollLeft=Math.max(0,e.scrollWidth*.47-e.clientWidth/2)')
                    crop=await page.locator('#today-river #scroller').evaluate('(e)=>{const r=e.getBoundingClientRect();return {x:Math.max(0,r.x+(r.width-340)/2),y:Math.max(0,r.y),width:340,height:220}}')
                    await page.screenshot(path=str(args.output/(device+'-now-small.png')),clip=crop,scale='css')
                # A real pointer click opens the same six-field task card.
                await page.locator('#today-river .boat').first.click(force=True)
                labels=await page.locator('#today-river #pick .six b').all_text_contents()
                assert labels==['在做什么','上次什么时候跑的','下次什么时候跑','有没有出错','怎么停','停了影响什么'],labels
                # Count native WebAudio oscillators to verify the accepted click chirp.
                await page.locator('#today-river #stage').evaluate('(e)=>window.scrollBy(0,e.getBoundingClientRect().top-160)')
                await page.wait_for_timeout(100)
                hit=await page.locator('#today-river .bird img').evaluate('(e)=>{const r=e.getBoundingClientRect();const q=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {x:r.x,y:r.y,width:r.width,height:r.height,hit:q?.outerHTML}}')
                results.append({'device':device,'case':'bird-hit-target','hit':hit})
                await page.evaluate("()=>{const original=AudioContext.prototype.createOscillator; AudioContext.prototype.createOscillator=function(){console.info('[river-audio-test] native oscillator created');return original.call(this)}}")
                before_chirp=sum('[river-audio-test]' in x['text'] for x in console)
                await page.locator('#today-river .bird img').click()
                await page.wait_for_timeout(100)
                after_chirp=sum('[river-audio-test]' in x['text'] for x in console)
                results.append({'device':device,'case':'boat-six-fields-bird-click','labels':labels,'native_oscillators_created':after_chirp-before_chirp})
                assert after_chirp>before_chirp,(after_chirp,before_chirp)
                partial=await refresh('partial')
                assert partial['model']['fog']==1 and '读到结果的任务都没有出错' in partial['headline'] and '好坏还不知道' in ''.join(partial['groups']),partial
                results.append({'device':device,'case':'partial-unknown','snapshot':partial})
                bad=await refresh('errors')
                assert '其中 1 个有问题' in bad['headline'] and any('上次时间没读到 · 过期' in x for x in bad['tips']),bad
                assert '过期' in await page.locator('#today-river #alerts').text_content(),bad
                assert '没写名字的任务' in await page.locator('#today-river #log').text_content(),bad
                assert 'synthetic-内部编号' not in await page.locator('#today-river').text_content(),bad
                await page.locator('#today-river #g-alert .row').first.locator('summary').click()
                await page.locator('#today-river #g-alert .row').first.locator('.six').wait_for(state='attached')
                results.append({'device':device,'case':'errors-overdue-fallback-name','snapshot':bad})
                for mode,word in [('failure','现在读不到电脑。'),('unknown','自动任务暂时读不到。'),('unavailable','自动任务暂时读不到。'),('stale','自动任务的记录没有及时更新。')]:
                    await refresh('normal')
                    last=await page.evaluate('({at:todayRiver.model.now,boats:[...document.querySelectorAll("#today-river .boat")].map(e=>[e.style.left,e.style.top])})')
                    old=await refresh(mode)
                    assert word in old['headline'] and '旧数据，之后的情况不知道' in old['headline'],old
                    assert not old['static'] and '还有' not in (old['lead'] or '') and '到点了' not in ''.join(old['tips']),old
                    await page.evaluate('()=>{window.riverTestNow=Date.now;Date.now=()=>riverTestNow()+120000;}')
                    await page.wait_for_timeout(1100)
                    held=await page.evaluate('({at:todayRiver.model.now,sign:document.querySelector("#today-river .now").textContent,boats:[...document.querySelectorAll("#today-river .boat")].map(e=>[e.style.left,e.style.top]),filter:getComputedStyle(document.querySelector("#today-river #layer")).filter,frames:todayRiver.metrics.frames})')
                    await page.evaluate('()=>{Date.now=riverTestNow;delete window.riverTestNow;}')
                    assert held['at']==last['at'] and held['boats']==last['boats'] and held['filter']=='none' and held['frames']>old['metrics']['frames'],(last,held)
                    assert held['sign']=='最后读到 '+dt.datetime.fromtimestamp(last['at']/1000,BJT).strftime('%H:%M'),held
                    if mode=='stale':
                        await page.set_viewport_size({'width':390,'height':844})
                        await page.wait_for_timeout(250)
                        await page.set_viewport_size({'width':1440,'height':900})
                        await page.wait_for_timeout(250)
                        assert await page.evaluate('water.width>0 && water.height>0 && stage.clientWidth>0')
                        await page.set_viewport_size(options['viewport'])
                        await page.wait_for_timeout(250)
                    assert '最后一次读到' in old['headline'] and '最后读到时刻' in old['legend'] and any('当时已跑完' in x for x in old['groups']),old
                    results.append({'device':device,'case':mode+'-old-value-boundary','snapshot':old})
                recovered=await refresh('normal')
                assert not recovered['static'] and '旧数据' not in recovered['headline'] and recovered['signs'][0].startswith('现在 '),recovered
                state['mode']='offline-browser'
                await context.set_offline(True)
                await page.evaluate('window.SiteB2.refresh()')
                await page.wait_for_function("document.body.dataset.b2StatusPhase === 'error'",timeout=12000)
                disconnected=await page.evaluate(SNAP)
                assert '现在读不到电脑。' in disconnected['headline'] and not disconnected['static']
                assert '之后的情况不知道' in disconnected['headline']
                assert '还有' not in (disconnected['lead'] or '') and not any('到点了' in x for x in disconnected['tips'])
                results.append({'device':device,'case':'browser-network-offline-old-value','snapshot':disconnected,'browser_offline':True,'synthetic_http_failure':False})
                await context.set_offline(False)
                reduced=await load('normal',True)
                before=await page.evaluate('()=>{const layer=document.querySelector("#today-river #layer").cloneNode(true);layer.querySelector(".now b").textContent="";return {draws:todayRiver.metrics.draws,frames:todayRiver.metrics.frames,html:layer.innerHTML}}')
                await page.wait_for_timeout(1600)
                after=await page.evaluate('()=>{const layer=document.querySelector("#today-river #layer").cloneNode(true);layer.querySelector(".now b").textContent="";return {draws:todayRiver.metrics.draws,frames:todayRiver.metrics.frames,html:layer.innerHTML}}')
                assert before==after and reduced['activeAnimations']==0,(before,after,reduced)
                for width,height in [(390,844),(1440,900),(390,844),(844,390),(390,844)]:
                    await page.set_viewport_size({'width':width,'height':height})
                    await page.wait_for_timeout(250)
                    assert await page.evaluate('water.width===Math.round(stage.clientWidth*devicePixelRatio) && water.height>0')
                await page.set_viewport_size(options['viewport'])
                await page.wait_for_timeout(250)
                valid_size=await page.evaluate('[water.width,water.height]')
                await page.locator('#stage').evaluate("e=>e.style.display='none'")
                await page.wait_for_timeout(250)
                assert await page.evaluate('[water.width,water.height]')==valid_size
                await page.locator('#stage').evaluate("e=>e.style.display=''")
                await page.wait_for_timeout(250)
                assert await page.evaluate('water.width>0 && water.height>0 && parseFloat(getComputedStyle(stage).fontSize)>0')
                assert all(float(x['lineHeight'].removesuffix('px'))>0 and x['height']>0 for x in reduced['textLayout']),reduced['textLayout']
                results.append({'device':device,'case':'reduced-motion-static','snapshot':reduced,'dom_and_draws_unchanged':True})
                if device in ['desktop','phone']:
                    await load('normal')
                    session=await context.new_cdp_session(page)
                    for rate in [4]:
                        await session.send('Emulation.setCPUThrottlingRate',{'rate':rate})
                        frames_before=await page.evaluate('todayRiver.metrics.frames')
                        wall_start=time.monotonic()
                        await page.evaluate('window.todayRiver.replay()')
                        await page.wait_for_timeout(10500)
                        measurement=await page.evaluate(SNAP)
                        elapsed=time.monotonic()-wall_start
                        delta=measurement['metrics']['frames']-frames_before
                        if rate==4:assert not measurement['insurance'] and delta>100,measurement
                        results.append({'device':device,'case':f'natural-cpu-{rate}x','snapshot':measurement,'artificial_busy_wait':False,'observed_seconds':elapsed,'frames_added':delta,'mean_fps':delta/elapsed})
                        await session.send('Emulation.setCPUThrottlingRate',{'rate':1})
                await context.close()
    except Exception as exc:
        failure=traceback.format_exc()
    finally:
        for context in contexts:
            try:await context.close()
            except Exception:pass
        server.shutdown();server.server_close()
    receipt={'schema':'wly.today-river-dom-acceptance.v1','observed_at_beijing':dt.datetime.now(BJT).isoformat(),'chrome':str(args.chrome),'served_root':str(site),'local_server':base,'server_stopped':True,'results':results,'insurance_policy':policy,'page_errors':errors,'console':console,'requests':state,'screenshots':2 if args.small_crops else 0,'images_viewed':0,'real_status_requests':0,'failure':failure}
    (args.output/'dom-evidence.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n','utf8')
    if failure:raise RuntimeError(failure)
    assert not errors,errors
    assert not state['non_get_blocked'],state
    assert not state['missing'],state['missing']
    print(json.dumps({'cases':len(results),'page_errors':len(errors),'missing_files':len(state['missing']),'server_stopped':True}))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--temp',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--small-crops',action='store_true',help='Save only 340×220 CSS-pixel river crops')
    asyncio.run(main(parser.parse_args()))
