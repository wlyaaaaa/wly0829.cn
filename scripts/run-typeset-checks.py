"""Run authorized headless Chrome DOM checks with a task-owned temporary profile.

No screenshot, image inspection, signed-in profile, or publication operation.
"""
import argparse
import asyncio
from pathlib import Path
import time
import uuid
from playwright.async_api import async_playwright


async def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode',choices=['geometry','qa'],required=True)
    parser.add_argument('--url',default='http://127.0.0.1:63415')
    parser.add_argument('--task-cache',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--pages',nargs='+')
    parser.add_argument('--timeout',type=int,default=900)
    parser.add_argument('--jobs',type=int,default=3)
    args=parser.parse_args()
    profile=args.task_cache.resolve()/('chrome-profile-'+uuid.uuid4().hex)
    profile.mkdir(parents=True)
    print('Temporary profile: '+str(profile),flush=True)
    started=time.monotonic()
    async with async_playwright() as runtime:
        context=await runtime.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,
                   viewport={'width':1760,'height':1050},device_scale_factor=1,args=['--hide-scrollbars'])
        try:
            page=context.pages[0] if context.pages else await context.new_page()
            if args.mode=='geometry':
                last_pending=-1;stable=0
                for batch in range(12):
                    suffix=('&pages='+','.join(args.pages)) if args.pages else ''
                    await page.goto(args.url+'/__typeset/measure?limit=250'+suffix,wait_until='domcontentloaded')
                    await page.wait_for_function("document.querySelector('#state').dataset.done==='true'",timeout=180000)
                    state=await page.locator('#state').inner_text()
                    print('Batch '+str(batch+1)+': '+state,flush=True)
                    if await page.locator('#state').get_attribute('data-complete')=='true':break
                    pending=int(await page.locator('#state').get_attribute('data-pending'))
                    stable=stable+1 if pending==last_pending else 0;last_pending=pending
                    if stable>=2:raise RuntimeError('Geometry has stable unresolved issues; inspect recorded differences')
                    if '新增 0' in state:raise RuntimeError('Geometry could not make progress: '+state)
                    if time.monotonic()-started>args.timeout:raise TimeoutError('Geometry deadline reached')
                else:raise RuntimeError('Geometry batch bound reached')
            else:
                response=await context.request.get(args.url+'/__typeset/build-report');build=await response.json()
                names=args.pages or list(build['pages']);jobs=max(1,min(4,args.jobs,len(names)))
                await page.close()
                async def drive(group,index):
                    worker=await context.new_page();last=None;handled=set()
                    try:
                        await worker.goto(args.url+'/__typeset/qa?native=1&pages='+','.join(group),wait_until='domcontentloaded')
                        while time.monotonic()-started<args.timeout:
                            state=await worker.evaluate("({text:document.querySelector('#state')?.textContent, request:window.TypesetQA?.request,phase:window.TypesetQA?.phase,error:window.TypesetQA?.error})")
                            if state.get('text')!=last:
                                print('Worker '+str(index)+': '+str(state.get('text')),flush=True);last=state.get('text')
                            request=state.get('request')or{}
                            if request.get('status')=='waiting'and request.get('id')not in handled and request.get('condition')=='reduced_motion':
                                await worker.emulate_media(reduced_motion='reduce'if request.get('value')else'no-preference');handled.add(request['id'])
                            if state.get('phase')in{'complete','save_failed','error'}:
                                proof=await worker.evaluate('window.TypesetQA.result');print('Worker '+str(index)+' QA result: '+str(proof.get('summary')if proof else state),flush=True)
                                if state['phase']!='complete':raise RuntimeError('QA did not complete: '+str(state))
                                return
                            await asyncio.sleep(.5)
                        raise TimeoutError('QA deadline reached')
                    finally:await worker.close()
                await asyncio.gather(*(drive(names[index::jobs],index+1)for index in range(jobs)))
        finally:
            await context.close()
    print('Headless DOM run seconds: '+str(round(time.monotonic()-started,3)),flush=True)


if __name__=='__main__':asyncio.run(main())
