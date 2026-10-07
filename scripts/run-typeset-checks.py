"""Run authorized headless Chrome DOM checks with a task-owned temporary profile.

No screenshot, image inspection, signed-in profile, or publication operation.
"""
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import time
from urllib.parse import unquote, urlsplit, urlunsplit
import uuid
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError


STATIC_TRANSFER_METHOD='Actual HTTPS route.fetch(max_retries=0), at most one retry after an empty response, transport timeout or HTTP 5xx; reuse only the verified network body within this run'
STATIC_TRANSFER_SCOPE='Exact manifest-listed HTTPS static GET objects, excluding API paths, non-GET and Range; no local body substitution; not native uninterrupted cold sockets'


def static_transfer_handler(manifest, origin, transfers):
    """The reading probe's bounded fetch, with sealed bodies shared by consumers."""
    base=manifest['oss']['asset_base_url'].rstrip('/')
    remote={obj['url']:obj for obj in manifest['oss']['objects'].values()
            if obj['url'].startswith(base+'/') and urlsplit(obj['url']).scheme=='https'
            and 'api' not in urlsplit(obj['url']).path.lower().split('/')}
    parsed_origin=urlsplit(origin);cors_origin=parsed_origin.scheme+'://'+parsed_origin.netloc
    pending={}

    async def retrieve(route,obj,transfer):
        request=route.request;began=time.monotonic()
        try:
            for number in (1,2):
                started=time.monotonic();observation={'number':number,'started_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat()}
                transfer['attempts'].append(observation);response=None
                try:
                    headers={**request.headers,'Origin':cors_origin,'Accept-Encoding':'identity'}
                    response=await route.fetch(url=transfer['url'],headers=headers,timeout=30000,max_retries=0,max_redirects=0)
                    body=await response.body();actual_headers=dict(response.headers)
                    observation.update(http=response.status,final_url=response.url,bytes=len(body),sha256=hashlib.sha256(body).hexdigest(),
                        content_type=actual_headers.get('content-type',''),acao=actual_headers.get('access-control-allow-origin'))
                    if 500<=response.status<600 or not body:
                        observation['failure']='http_5xx' if 500<=response.status<600 else 'empty_body'
                        if number==1:
                            transfer['first_failure']=dict(observation)
                            continue
                        raise ValueError('Static response remained '+observation['failure'])
                    mime=observation['content_type'].split(';',1)[0].strip()
                    if (response.status!=200 or response.url!=transfer['url'] or len(body)!=obj['bytes']
                        or observation['sha256']!=obj['sha256'] or mime!=obj['content_type']
                        or observation['acao'] not in {cors_origin,'*'}):
                        observation['failure']='sealed_response_mismatch'
                        raise ValueError('Actual static bytes, SHA, MIME, CORS or final URL differ from the sealed object')
                    fulfilled={key:value for key,value in actual_headers.items() if key.lower() not in {'content-encoding','transfer-encoding','content-length'}}
                    fulfilled['content-length']=str(len(body));transfer['status']='pass'
                    return {'status':response.status,'headers':fulfilled,'body':body}
                except Exception as error:
                    observation['error']=type(error).__name__+': '+str(error)
                    empty_transport=not response and any(value in str(error).lower() for value in ('err_empty_response','socket hang up','econnreset','client network socket disconnected before secure tls connection was established'))
                    long_transport_timeout=not response and (isinstance(error,PlaywrightTimeoutError) or str(error).startswith('Route.fetch: Timeout '))
                    if empty_transport:observation['failure']='empty_transport'
                    if long_transport_timeout:observation['failure']='long_transport_timeout'
                    if number==1 and (empty_transport or long_transport_timeout):
                        transfer['first_failure']=dict(observation)
                        continue
                    transfer['status']='fail';transfer['error']=observation['error']
                    if number==1:transfer['first_failure']=dict(observation)
                    return None
                finally:
                    observation['seconds']=round(time.monotonic()-started,6)
                    if (transfer.get('first_failure')or{}).get('number')==number:
                        transfer['first_failure']=dict(observation)
                    if response:await response.dispose()
        finally:transfer['seconds']=round(time.monotonic()-began,6)

    async def handler(route):
        request=route.request;parsed=urlsplit(request.url)
        # Preserve every query component except the product's exact retry marker.
        query='&'.join(part for part in parsed.query.split('&') if unquote(part.partition('=')[0])!='__wly_resource_retry')
        canonical=urlunsplit((parsed.scheme,parsed.netloc,parsed.path,query,parsed.fragment))
        obj=remote.get(canonical)
        if not obj or request.method!='GET' or any(key.lower()=='range' for key in request.headers):
            return await route.continue_()
        reused=canonical in pending
        if not reused:
            transfer={'url':canonical,'method':STATIC_TRANSFER_METHOD,'scope':STATIC_TRANSFER_SCOPE,
                      'cors_origin':cors_origin,'status':'running','attempts':[],'consumers':[],'first_failure':None}
            transfers.append(transfer)
            pending[canonical]=(asyncio.create_task(retrieve(route,obj,transfer)),transfer)
        task,transfer=pending[canonical]
        transfer['consumers'].append({'url':request.url,'resource_type':request.resource_type,'reused_transfer':reused})
        payload=await asyncio.shield(task)
        if payload is None:return await route.abort('failed')
        await route.fulfill(**payload)
    return handler


async def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode',choices=['geometry','qa','baseline'],required=True)
    parser.add_argument('--verification',type=Path);parser.add_argument('--baseline-output',type=Path)
    parser.add_argument('--production-commit');parser.add_argument('--collect-baseline',action='store_true')
    parser.add_argument('--url',default='http://127.0.0.1:63415')
    parser.add_argument('--task-cache',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--pages',nargs='+')
    parser.add_argument('--timeout',type=int,default=900)
    parser.add_argument('--jobs',type=int,default=3)
    parser.add_argument('--network-output',type=Path,help='Actual failed/static-response transport observations, without response bodies')
    parser.add_argument('--static-retry-once',action='store_true',help='Use actual sealed HTTPS static bodies with at most one retry; retain first failures and timing')
    parser.add_argument('--static-manifest',type=Path,help='Exact OSS split release-manifest.json; required with --static-retry-once')
    args=parser.parse_args()
    if args.mode=='baseline':
        proof=json.loads(args.verification.read_text('utf8'))
        if proof['summary'].get('unverified'):raise ValueError('Incomplete baseline observations')
        pages=next((json.loads(p.read_text('utf8'))['pages'] for p in (args.baseline_output,Path(__file__).resolve().parent.parent/'config/quality-baseline.json') if p.is_file()),{})
        for name,page in proof['pages'].items():
            pages[name]={str(check['width']):{'blank':{s['part']:s['largest_empty_rectangle']['viewport_fraction'] for s in check['content_acceptance']['screens']},'preserved':next(c['preserved'] for c in page['effects']['evidence']['checks'] if c['width']==check['width']),'motion':[{'part':s['part'],'kind':s['kind'],'key':s.get('effect_key')} for s in next(c['samples'] for c in page['effects']['evidence']['checks'] if c['width']==check['width']) if s['part'] and s['layout_bound']]} for check in page['checks']}
        args.baseline_output.write_text(json.dumps({'schema':'wly.typeset-quality-baseline.v1','release_id':proof['release_id'],'production_commit':args.production_commit,'verification_sha256':hashlib.sha256(args.verification.read_bytes()).hexdigest(),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
        return
    if args.static_retry_once and not args.static_manifest:parser.error('--static-retry-once requires --static-manifest')
    profile=args.task_cache.resolve()/('chrome-profile-'+uuid.uuid4().hex)
    profile.mkdir(parents=True)
    print('Temporary profile: '+str(profile),flush=True)
    started=time.monotonic()
    network={'responses':[],'failed_requests':[],'static_transfers':[],
             'transport_method':STATIC_TRANSFER_METHOD if args.static_retry_once else 'Native browser transfers without a static route handler',
             'transport_scope':STATIC_TRANSFER_SCOPE if args.static_retry_once else 'Observed browser requests only'}
    if args.static_retry_once:
        manifest_bytes=args.static_manifest.read_bytes();manifest=json.loads(manifest_bytes)
        parsed_origin=urlsplit(args.url)
        network.update(release_id=manifest['release_id'],manifest_sha256=hashlib.sha256(manifest_bytes).hexdigest(),cors_origin=parsed_origin.scheme+'://'+parsed_origin.netloc)
        network['qa_wait_budget_ms']=90000
    async with async_playwright() as runtime:
        context=await runtime.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,
                   viewport={'width':1760,'height':1050},device_scale_factor=1,args=['--hide-scrollbars'])
        if args.network_output:
            context.on('response',lambda response:network['responses'].append({'url':response.url,'status':response.status,'resource_type':response.request.resource_type}))
            context.on('requestfailed',lambda request:network['failed_requests'].append({'url':request.url,'error':request.failure,'resource_type':request.resource_type}))
        if args.static_retry_once:
            static_handler=static_transfer_handler(manifest,args.url,network['static_transfers'])
            await context.route(manifest['oss']['asset_base_url'].rstrip('/')+'/**',static_handler)
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
                    worker_context=await runtime.chromium.launch_persistent_context(str(profile/('worker-'+str(index))),executable_path=str(args.chrome),headless=True,viewport={'width':1760,'height':1050},args=['--hide-scrollbars'])
                    worker=worker_context.pages[0];last=None;handled=set();page_errors=[]
                    worker.on('pageerror',lambda error:page_errors.append(str(error)))
                    if args.network_output:
                        worker_context.on('response',lambda response:network['responses'].append({'url':response.url,'status':response.status,'resource_type':response.request.resource_type}))
                        worker_context.on('requestfailed',lambda request:network['failed_requests'].append({'url':request.url,'error':request.failure,'resource_type':request.resource_type}))
                    if args.static_retry_once:await worker_context.route(manifest['oss']['asset_base_url'].rstrip('/')+'/**',static_handler)
                    try:
                        suffix=('&static_wait_ms=90000' if args.static_retry_once else '')+('&baseline=1' if args.collect_baseline else '')
                        await worker.goto(args.url+'/__typeset/qa?native=1&pages='+','.join(group)+suffix,wait_until='domcontentloaded')
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
                                if page_errors:raise RuntimeError('Page JavaScript errors: '+str(page_errors))
                                return
                            await asyncio.sleep(.5)
                        raise TimeoutError('QA deadline reached')
                    finally:
                        if args.static_retry_once:await worker_context.unroute_all(behavior='wait')
                        await worker_context.close()
                await asyncio.gather(*(drive(names[index::jobs],index+1)for index in range(jobs)))
            if args.static_retry_once and (not network['static_transfers'] or any(row['status']!='pass' for row in network['static_transfers'])):
                raise RuntimeError('One or more bounded static transfers failed; inspect network output')
        finally:
            if args.static_retry_once:await context.unroute_all(behavior='wait')
            await context.close()
            if args.network_output:
                network['seconds']=round(time.monotonic()-started,3)
                network['checked_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
                network['static_transfer_status']=('pass' if network['static_transfers'] and all(row['status']=='pass' for row in network['static_transfers']) else 'fail') if args.static_retry_once else 'not_requested'
                args.network_output.parent.mkdir(parents=True,exist_ok=True)
                args.network_output.write_text(json.dumps(network,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('Headless DOM run seconds: '+str(round(time.monotonic()-started,3)),flush=True)


if __name__=='__main__':asyncio.run(main())
