"""Mandatory native Chrome network gate at the final HTTPS website origin.

Candidate mode supplies only manifest-bound navigation HTML. OSS and service
requests use Chrome's real HTTPS transport, without interception or substitution.
Live mode also retrieves documents from the real public URL. No UI actions.
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import time
import uuid
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit, urlunsplit

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('browser_network_oss', HERE/'prepare-oss-release.py')
oss = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oss)
ORIGIN = 'https://wly0829.cn'
SCHEMA = 'wly.oss-browser-network.v1'
METHOD = 'Installed headless Chrome; native HTTPS OSS and service GET; CDP Network events and actual response body SHA256; no OSS interception'
STATUS_URL = 'https://mcp.wly0829.cn/computer-access/api/status'


def route_file(route):
    parsed = urlsplit(route)
    if parsed.scheme or parsed.netloc or parsed.query or parsed.fragment or not route.startswith('/'):
        raise ValueError('Manifest route must be a website path: ' + route)
    path = unquote(parsed.path).lstrip('/')
    if any(part in ('.', '..') for part in path.split('/')):
        raise ValueError('Route escapes release root')
    return path + 'index.html' if not path or path.endswith('/') else path


def canonical_object(url):
    parts = urlsplit(url)
    query = '&'.join(part for part in parts.query.split('&') if unquote(part.partition('=')[0]) != '__wly_resource_retry' and part != 'living-cors=1')
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, ''))


def declared_oss_static(payload, owner, manifest):
    rewriter=oss.Rewriter({},manifest['oss']['asset_base_url'],manifest['oss']['prefix'],ORIGIN,version=4)
    return any(rewriter.is_oss_resource(value,owner,context) for tag,attrs,raw,offset in oss.HtmlTags(payload.decode('utf8')).tags
               for value,context in rewriter.resource_values(tag,attrs))


def status_get_succeeded(item):
    return (item.get('method')=='GET' and canonical_object(item.get('url',''))==STATUS_URL
            and item.get('response_http')==200 and canonical_object(item.get('response_url',''))==STATUS_URL)


def artifact(preparation, release=None):
    preparation = Path(preparation).resolve()
    plan = oss.verify_local(preparation)
    if plan['test_only'] or plan['html_origin'] != ORIGIN or not plan.get('remote_verified'):
        raise ValueError('Network gate requires sealed production preparation at the final website origin')
    if not re.fullmatch(r'https://[a-z0-9-]+\.oss-cn-shanghai\.aliyuncs\.com', plan['asset_base_url']):
        raise ValueError('Network gate requires the sealed Shanghai OSS origin')
    root = Path(release).resolve() if release else preparation/'github'
    manifest_path = root/oss.MANIFEST
    manifest = oss.read(manifest_path)
    oss.verify_manifest(manifest)
    prepared = oss.read(preparation/'github'/oss.MANIFEST)
    if manifest['release_id'] != plan['release_id'] or manifest['files'] != prepared['files'] or manifest['oss'] != prepared['oss']:
        raise ValueError('Selected document package differs from sealed OSS preparation')
    if {rel: value for rel, value in oss.inventory(root).items() if rel != oss.MANIFEST} != manifest['files']:
        raise ValueError('Document package bytes differ from its manifest')
    routes = manifest.get('routes')
    if not isinstance(routes, list) or not routes or len(routes) != len(set(routes)):
        raise ValueError('Manifest route inventory is missing or duplicated')
    documents = {route: route_file(route) for route in routes}
    if set(documents.values()) != {rel for rel in manifest['files'] if rel.endswith('.html')}:
        raise ValueError('Manifest routes do not cover every actual HTML document')
    if not {'/computer-access/', '/cockpit/'} <= set(routes):
        raise ValueError('Mandatory status pages are absent from the release')
    return plan, manifest, root, documents


def validate_receipt(preparation, receipt_path, mode='candidate', release=None, allow_failed=False):
    plan, manifest, root, documents = artifact(preparation, release)
    report = oss.read(receipt_path)
    expected = {'schema': SCHEMA, 'mode': mode, 'method': METHOD, 'origin': ORIGIN,
                'oss_asset_base_url':plan['asset_base_url'],
                'release_id': manifest['release_id'], 'source_release_id': plan['source_release_id'],
                'plan_sha256': oss.digest(Path(preparation)/oss.PLAN),
                'manifest_sha256': oss.digest(root/oss.MANIFEST), 'routes': list(documents)}
    for key, value in expected.items():
        if report.get(key) != value: raise ValueError('Browser network receipt differs: ' + key)
    if report.get('status') not in (('pass','fail') if allow_failed else ('pass',)) or not report.get('profile_cleanup', {}).get('verified'):
        raise ValueError('Native browser network gate or profile cleanup did not pass')
    rows = report.get('pages', [])
    if len(rows) != len(documents) or [row.get('route') for row in rows] != list(documents):
        if not allow_failed or len({row.get('route') for row in rows}) != len(rows) or any(row.get('route') not in documents for row in rows):
            raise ValueError('Browser network receipt omits manifest routes or aliases')
    for row in rows:
        if allow_failed and row.get('status') == 'fail': continue
        verify_oss_403(row,plan['asset_base_url'])
        derived = blocking_events(row, compat_contract(root,manifest,documents,row['route']), manifest)
        if any(row.get(key) != value for key,value in derived.items()):
            raise ValueError('Blocking-event classification differs from retained browser evidence')
        if row.get('status') != 'pass' or derived['blocking_issues'] or derived['blocking_loading_failed'] or row.get('page_errors') or row.get('http_failures'):
            raise ValueError('Browser failures remain on ' + row.get('route', '?'))
        observed = row.get('documents', [])
        address = ORIGIN + row['route']
        if not any(item.get('url') == address and item.get('http') == 200 and item.get('sha256') == manifest['files'][documents[row['route']]]['sha256'] for item in observed):
            raise ValueError('Browser lacks actual route document bytes: ' + row['route'])
        if row['route'] in ('/computer-access/', '/cockpit/') and not any(status_get_succeeded(item) for item in row.get('requests', [])):
            raise ValueError('Actual service status GET was not sent: ' + row['route'])
        expected_static=declared_oss_static((root/documents[row['route']]).read_bytes(),documents[row['route']],manifest)
        if row.get('declared_oss_static') is not expected_static:raise ValueError('Declared static dependency evidence differs from the actual document')
        if expected_static and not row.get('static_bodies'): raise ValueError('No native sealed OSS response bodies for the actual declared dependencies: '+row['route'])
        for body in row['static_bodies']:
            obj = next((obj for obj in manifest['oss']['objects'].values() if obj['url'] == body.get('canonical_url')), None)
            if not obj or body.get('verified') is not True or not body.get('sha256'):
                raise ValueError('Browser body is not a sealed OSS object')
            if body.get('http') == 200 and (body.get('sha256') != obj['sha256'] or body.get('bytes') != obj['bytes']):
                raise ValueError('Browser full body SHA differs from sealed OSS object')
    if report.get('summary') != summarize(rows,plan['asset_base_url']): raise ValueError('Browser network summary does not match retained events')
    return {**expected, 'status': 'pass', 'receipt_path': str(Path(receipt_path).resolve()),
            'receipt_sha256': oss.digest(receipt_path), 'summary': report['summary']}


def oss_403_count(row, asset_base):
    # ExtraInfo still contains the actual HTTP status when CORS prevents the
    # renderer from receiving Network.responseReceived. Count a response once.
    return len({(item.get('request_id'),item.get('url')) for item in
                row.get('responses',[])+row.get('http_response_extra',[])
                if item.get('http') == 403 and item.get('url','').startswith(asset_base.rstrip('/')+'/')})


def verify_oss_403(row, asset_base):
    actual = oss_403_count(row,asset_base)
    if type(row.get('oss_http_403')) is not int or row['oss_http_403'] != actual:
        raise ValueError('OSS HTTP 403 counter differs from actual browser responses')
    if actual: raise ValueError('Actual OSS HTTP 403 responses remain on '+row.get('route','?'))


def summarize(rows, asset_base):
    return {'routes': len(rows), 'passed': sum(row.get('status') == 'pass' for row in rows),
            'csp_blocked': sum(is_csp_failure(event) for row in rows for event in row.get('loading_failed', [])),
            'loading_failed': sum(len(row.get('loading_failed', [])) for row in rows),  # Raw, never rewritten to zero.
            'blocking_loading_failed': sum(len(row.get('blocking_loading_failed',row.get('loading_failed',[]))) for row in rows),
            'expected_navigation_cancellations': sum(len(row.get('expected_navigation_cancellations',[])) for row in rows),
            'http_failures': sum(len(row.get('http_failures', [])) for row in rows),
            'oss_http_403': sum(oss_403_count(row,asset_base) for row in rows),
            'page_errors': sum(len(row.get('page_errors', [])) for row in rows)}


def is_csp_failure(event):
    # Some blocked subframe Documents omit blockedReason in Chrome's CDP event.
    return event.get('blockedReason') == 'csp' or event.get('errorText') == 'net::ERR_BLOCKED_BY_CSP'



def compat_contract(root, manifest, documents, route):
    """Conservative single-hop zero-second same-origin manifest declaration."""
    payload = (root/documents[route]).read_text('utf8')
    refresh = [attrs.get('content','') for tag,attrs,raw,offset in oss.HtmlTags(payload).tags
               if tag == 'meta' and attrs.get('http-equiv','').lower() == 'refresh']
    if len(refresh) != 1:
        return None
    match = re.fullmatch(r'\s*(0+(?:\.0+)?)\s*;\s*url\s*=\s*(.*?)\s*',refresh[0],re.I)
    if not match or not match[2]:
        return None
    target = urljoin(ORIGIN+route,match[2].strip('"\''))
    parts = urlsplit(target)
    if parts.scheme != 'https' or parts.netloc != urlsplit(ORIGIN).netloc or parts.path == route:
        return None
    if parts.path not in documents or documents[parts.path] not in manifest['files']:
        return None
    target_text = (root/documents[parts.path]).read_text('utf8')
    if any(tag == 'meta' and attrs.get('http-equiv','').lower() == 'refresh'
           for tag,attrs,raw,offset in oss.HtmlTags(target_text).tags):
        return None  # Multi-hop or cyclic declarations receive no exception.
    title_spec = importlib.util.spec_from_file_location('c09_redirect_navigation',HERE/'repair-release-navigation.py')
    title_module = importlib.util.module_from_spec(title_spec)
    title_spec.loader.exec_module(title_module)
    title = title_module.PageFacts(target_text,root).title
    if not title:
        return None
    return {'initial_url':ORIGIN+route,'target_url':target,
            'target_http_url':urlunsplit((parts.scheme,parts.netloc,parts.path,parts.query,'')),
            'initial_sha256':manifest['files'][documents[route]]['sha256'],
            'target_sha256':manifest['files'][documents[parts.path]]['sha256'],
            'target_title':title,'declared_content':refresh[0]}


def blocking_events(row, contract, manifest):
    """Derive allowances from retained events; missing identity always blocks."""
    result = {'blocking_loading_failed':list(row.get('loading_failed',[])),
              'blocking_issues':list(row.get('issues',[])),
              'expected_navigation_cancellations':[]}
    if not contract:
        return result
    actual = row.get('final_document',{})
    if actual.get('url') != contract['target_url'] or actual.get('title') != contract['target_title']:
        return result
    for url,digest in ((contract['initial_url'],contract['initial_sha256']),
                       (contract['target_http_url'],contract['target_sha256'])):
        if not any(item.get('url') == url and item.get('http') == 200 and item.get('sha256') == digest
                   and item.get('verified') is True for item in row.get('documents',[])):
            return result
    def unique_document(url):
        values = [item for item in row.get('requests',[]) if item.get('type') == 'Document'
                  and item.get('method') == 'GET' and item.get('url') == url]
        return values[0] if len(values) == 1 else None
    old = unique_document(contract['initial_url'])
    target = unique_document(contract['target_http_url'])
    if not old or not target or not old.get('loader_id') or not old.get('frame_id'):
        return result
    if target.get('frame_id') != old['frame_id'] or not target.get('loader_id') or target['loader_id'] == old['loader_id']:
        return result
    dcl = [event for event in row.get('lifecycle_events',[]) if event.get('frame_id') == target['frame_id']
           and event.get('loader_id') == target['loader_id'] and event.get('name') == 'DOMContentLoaded']
    if len(dcl) != 1: return result
    low,high = target.get('timestamp'),dcl[0].get('timestamp')
    if not isinstance(low,(int,float)) or not isinstance(high,(int,float)) or high < low:
        return result
    for request,url in ((old,contract['initial_url']),(target,contract['target_url'])):
        if not any(item.get('frame_id') == request['frame_id'] and item.get('loader_id') == request['loader_id']
                   and item.get('url') == url and not item.get('parent_id') for item in row.get('frame_navigations',[])):
            return result
    if not any(item.get('frame_id') == old['frame_id'] and item.get('url') == contract['target_url']
               and item.get('reason') == 'metaTagRefresh' for item in row.get('navigation_requests',[])):
        return result
    requests = {item.get('request_id'):item for item in row.get('requests',[])}
    responses = {item.get('request_id'):item for item in row.get('responses',[])}
    def forbidden_response(identity):
        return (responses.get(identity,{}).get('http',0) >= 400
                or any(item.get('request_id') == identity and item.get('http',0) >= 400
                       for item in row.get('http_response_extra',[])))
    def belongs_old(identity):
        item = requests.get(identity,{})
        stamp = item.get('timestamp')
        return (item.get('loader_id') == old['loader_id'] and item.get('frame_id') == old['frame_id']
                and item.get('type') != 'Document' and isinstance(stamp,(int,float)) and stamp <= high)
    allowed_failures = []
    for event in row.get('loading_failed',[]):
        stamp = event.get('timestamp')
        if (event.get('canceled') is True and event.get('errorText') == 'net::ERR_ABORTED'
                and not is_csp_failure(event) and belongs_old(event.get('requestId'))
                and not forbidden_response(event.get('requestId'))
                and event.get('url') == requests[event['requestId']].get('url')
                and isinstance(stamp,(int,float)) and low <= stamp <= high):
            allowed_failures.append(event)
    result['expected_navigation_cancellations'] = allowed_failures
    result['blocking_loading_failed'] = [event for event in row.get('loading_failed',[]) if event not in allowed_failures]
    return result


def recycle_profile(profile, allowed_root):
    command = ['pwsh', '-NoProfile', '-File', 'E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
               '-LiteralPath', str(profile), '-AllowedRoot', str(allowed_root), '-Json']
    result = subprocess.run(command, capture_output=True, text=True, encoding='utf8')
    try: receipt = json.loads(result.stdout.lstrip('\ufeff'))
    except ValueError: receipt = {'output': result.stdout, 'error': result.stderr}
    return {'verified': result.returncode == 0 and not profile.exists() and receipt.get('status') == 'recycled'
            and receipt.get('original_path_verified') is True and receipt.get('recovery_item_exists') is True,
            'receipt': receipt, 'exit': result.returncode}


async def native_body(session, identity, item, bodies):
    prior = bodies.get(canonical_object(item['url']))
    if item['http'] == 200 and item['disk_cache'] and prior and prior.get('verified') is True:
        return {**prior, 'url':item['url'], 'reused':True}, None
    value = await asyncio.wait_for(session.send('Network.getResponseBody', {'requestId':identity}),timeout=10)
    body = base64.b64decode(value['body']) if value.get('base64Encoded') else value['body'].encode('utf8')
    return {'url':item['url'], 'http':item['http'], 'bytes':len(body), 'sha256':hashlib.sha256(body).hexdigest()}, body


async def candidate_document(session, event, root, url_documents):
    request = event['request']; rel = url_documents.get(request['url'])
    if event.get('resourceType') == 'Document' and request['method'] == 'GET' and rel:
        await session.send('Fetch.fulfillRequest', {'requestId':event['requestId'], 'responseCode':200,
            'responseHeaders':[{'name':'Content-Type','value':'text/html; charset=utf-8'}],
            'body':base64.b64encode((root/rel).read_bytes()).decode('ascii')})
    else: await session.send('Fetch.continueRequest', {'requestId':event['requestId']})


async def run(args):
    from playwright.async_api import async_playwright
    started = time.monotonic()
    plan, manifest, root, documents = artifact(args.preparation, args.release)
    args.output = args.output.resolve()
    if args.output.exists(): raise ValueError('Network report must be a new file; preserve earlier failures')
    cache = args.task_cache.resolve()
    if cache.drive.upper() != 'E:': raise ValueError('Task cache must be on E:')
    cache.mkdir(parents=True, exist_ok=True)
    prior_temp = {name:os.environ.get(name) for name in ('TEMP','TMP','TMPDIR')}
    for name in prior_temp: os.environ[name] = str(cache)
    profile = cache/('chrome-network-'+uuid.uuid4().hex)
    report = {'schema': SCHEMA, 'status': 'fail', 'mode': args.mode, 'method': METHOD, 'origin': ORIGIN,
              'oss_asset_base_url':plan['asset_base_url'],
              'release_id': manifest['release_id'], 'source_release_id': plan['source_release_id'],
              'plan_sha256': oss.digest(args.preparation/oss.PLAN), 'manifest_sha256': oss.digest(root/oss.MANIFEST),
              'routes': list(documents), 'pages': [], 'started_at_beijing': oss.stamp()}
    retained = {}
    if args.retry_failed:
        validate_receipt(args.preparation,args.retry_failed,args.mode,args.release,allow_failed=True)
        retained = {row['route']:row for row in oss.read(args.retry_failed)['pages'] if row['status'] == 'pass'}
        report['retry_receipt'] = {'path':str(args.retry_failed.resolve()),'sha256':oss.digest(args.retry_failed)}
    objects = {obj['url']: (rel, obj) for rel, obj in manifest['oss']['objects'].items()}
    multiplier = len(documents)-len(retained) if args.cold_cache else bool(len(documents)-len(retained))
    oss.estimate_download({url:{**obj,'bytes':obj['bytes']*multiplier} for url,(rel,obj) in objects.items()},
                          args.confirm_download_over_5gb)
    verified_bodies = {}
    url_documents = {ORIGIN+route: rel for route, rel in documents.items()}
    contracts = {route:compat_contract(root,manifest,documents,route) for route in documents}
    for contract in contracts.values():
        if contract: url_documents[contract['target_http_url']] = route_file(urlsplit(contract['target_url']).path)
    async with async_playwright() as runtime:
        context = None
        try:
            context = await runtime.chromium.launch_persistent_context(str(profile), executable_path=str(args.chrome),
                headless=True, viewport={'width':1440, 'height':1000}, service_workers='block')
            report['browser_version'] = context.browser.version if context.browser else 'persistent installed Chrome'
            for initial in list(context.pages): await initial.close()
            for route, rel in documents.items():
                if route in retained:
                    report['pages'].append(retained[route]); continue
                page = await context.new_page()
                session = await context.new_cdp_session(page)
                await session.send('Page.enable')
                await session.send('Page.setLifecycleEventsEnabled',{'enabled':True})
                await session.send('Network.enable', {'maxTotalBufferSize':512*1024*1024, 'maxResourceBufferSize':64*1024*1024, 'enableDurableMessages':True})
                if args.cold_cache: await session.send('Network.clearBrowserCache')
                await session.send('Network.setCacheDisabled', {'cacheDisabled':args.cold_cache})
                if args.mode == 'candidate':
                    async def document_handler(event): await candidate_document(session,event,root,url_documents)
                    session.on('Fetch.requestPaused', document_handler)
                    await session.send('Fetch.enable', {'patterns':[{'urlPattern':ORIGIN+'/*','resourceType':'Document'}]})
                row = {'route':route, 'url':ORIGIN+route, 'status':'fail', 'requests':[], 'responses':[], 'http_response_extra':[],
                       'documents':[], 'static_bodies':[], 'loading_failed':[], 'http_failures':[], 'page_errors':[], 'issues':[],
                       'frame_navigations':[], 'navigation_requests':[], 'lifecycle_events':[]}
                row['declared_oss_static']=declared_oss_static((root/rel).read_bytes(),rel,manifest)
                report['pages'].append(row)
                requests = {}; responses = {}; pending = set(); body_tasks = set(); request_referrers = {}; cache_hits = set(); last_event = time.monotonic()
                def frame_navigated(event):
                    frame = event['frame']
                    row['frame_navigations'].append({'frame_id':frame['id'],'loader_id':frame.get('loaderId'),
                        'parent_id':frame.get('parentId'),'url':frame.get('url')})
                def lifecycle_event(event):
                    row['lifecycle_events'].append({'frame_id':event['frameId'],'loader_id':event['loaderId'],
                        'name':event['name'],'timestamp':event['timestamp']})
                def navigation_requested(event):
                    row['navigation_requests'].append({'frame_id':event['frameId'],'url':event['url'],'reason':event.get('reason')})
                def requested(event):
                    nonlocal last_event
                    last_event = time.monotonic(); request = event['request']; identity = event['requestId']
                    item = {'request_id':identity, 'url':request['url'], 'method':request['method'], 'type':event.get('type'),
                            'initiator_type':event.get('initiator',{}).get('type'), 'response_received':False,
                            'loader_id':event.get('loaderId'),'frame_id':event.get('frameId'),'timestamp':event.get('timestamp'),
                            'referer':request_referrers.get(identity,next((value for key,value in request.get('headers',{}).items() if key.lower()=='referer'),''))}
                    requests[identity] = item; pending.add(identity); row['requests'].append(item)
                    if request['method'] not in ('GET', 'HEAD', 'OPTIONS'): row['issues'].append('Unexpected non-read request: '+request['method']+' '+request['url'])
                def request_headers(event):
                    identity = event['requestId']
                    referer = next((value for key,value in event.get('headers',{}).items() if key.lower()=='referer'),'')
                    request_referrers[identity] = referer
                    if identity in requests: requests[identity]['referer'] = referer
                def received(event):
                    nonlocal last_event
                    last_event = time.monotonic(); response = event['response']; identity = event['requestId']
                    if identity in requests: requests[identity].update(response_received=True,response_http=response['status'],response_url=response['url'])
                    item = {'request_id':identity, 'url':response['url'], 'http':response['status'], 'type':event.get('type'),
                            'headers':{key.lower():value for key,value in response.get('headers',{}).items()
                                       if key.lower() in ('content-type','content-range','content-length','access-control-allow-origin')},
                            'disk_cache':response.get('fromDiskCache',False) or identity in cache_hits, 'service_worker':response.get('fromServiceWorker',False)}
                    responses[identity] = item; row['responses'].append(item)
                    if response['status'] >= 400: row['http_failures'].append({key:item[key] for key in ('url','http','type')})
                def response_headers(event):
                    identity = event['requestId']
                    item = {'request_id':identity,'url':requests.get(identity,{}).get('url',''),'http':event['statusCode']}
                    row['http_response_extra'].append(item)
                    if item['http'] == 403 and item['url'].startswith(plan['asset_base_url']+'/'):
                        row['issues'].append('Actual OSS HTTP 403: '+item['url'])
                def failed(event):
                    nonlocal last_event
                    last_event = time.monotonic(); pending.discard(event['requestId'])
                    row['loading_failed'].append({**event, 'url':requests.get(event['requestId'],{}).get('url')})
                async def record_body(identity):
                    item = responses.get(identity)
                    if not item: return
                    url = item['url']; canonical = canonical_object(url); is_document = item['type'] == 'Document'
                    bound = objects.get(canonical)
                    if not is_document and not bound:
                        if item['type'] in ('Script','Stylesheet','Image','Font','Media') and url.startswith((ORIGIN+'/',plan['asset_base_url']+'/')):
                            row['issues'].append('Static browser resource did not use sealed OSS: '+url)
                        return  # Never read or retain service response payloads.
                    try:
                        result,body = await native_body(session,identity,item,verified_bodies if bound and not args.cold_cache else {})
                        if result.get('reused'):
                            row['static_bodies'].append(result); return
                        if is_document:
                            target = url_documents.get(url)
                            result['verified'] = bool(target and item['http'] == 200 and result['sha256'] == manifest['files'][target]['sha256'])
                            row['documents'].append(result)
                        else:
                            object_rel, obj = bound; result['canonical_url'] = canonical
                            if item['http'] == 206:
                                match = re.fullmatch(r'bytes (\d+)-(\d+)/(\d+)', item['headers'].get('content-range',''))
                                if not match: raise ValueError('Invalid native media Content-Range')
                                low, high, size = map(int, match.groups())
                                with (args.preparation/'oss'/object_rel).open('rb') as source:
                                    source.seek(low); expected = source.read(high-low+1)
                                result['content_range'] = item['headers']['content-range']
                                result['verified'] = size == obj['bytes'] and body == expected and len(body) == high-low+1
                            else: result['verified'] = item['http'] == 200 and result['bytes'] == obj['bytes'] and result['sha256'] == obj['sha256']
                            row['static_bodies'].append(result)
                            if result['verified'] and item['http'] == 200: verified_bodies[canonical] = result
                        if not result['verified']: row['issues'].append('Native response body differs from manifest: '+url)
                    except Exception as error: row['issues'].append('Actual browser body unavailable: '+url+' '+str(error))
                def finished(event):
                    nonlocal last_event
                    last_event = time.monotonic(); pending.discard(event['requestId'])
                    if event['requestId'] in requests: requests[event['requestId']]['finished_timestamp'] = event.get('timestamp')
                    if event['requestId'] in responses: responses[event['requestId']]['transferred_bytes'] = event.get('encodedDataLength',0)
                    task = asyncio.create_task(record_body(event['requestId'])); body_tasks.add(task); task.add_done_callback(body_tasks.discard)
                session.on('Page.lifecycleEvent',lifecycle_event)
                session.on('Page.frameNavigated',frame_navigated)
                session.on('Page.frameRequestedNavigation',navigation_requested)
                session.on('Network.requestWillBeSent', requested)
                session.on('Network.requestWillBeSentExtraInfo', request_headers)
                session.on('Network.responseReceived', received)
                session.on('Network.responseReceivedExtraInfo', response_headers)
                session.on('Network.requestServedFromCache', lambda event: cache_hits.add(event['requestId']))
                session.on('Network.loadingFailed', failed)
                session.on('Network.loadingFinished', finished)
                page.on('pageerror', lambda error: row['page_errors'].append(str(error)))
                deadline = time.monotonic()+args.route_timeout
                try:
                    await page.goto(ORIGIN+route, wait_until='domcontentloaded', timeout=args.route_timeout*1000)
                    if contracts[route]:
                        await page.wait_for_url(contracts[route]['target_url'],wait_until='domcontentloaded',
                            timeout=max(1,int((deadline-time.monotonic())*1000)))
                    # Native scrolling activates the page's actual lazy resources.
                    height = await page.evaluate('document.documentElement.scrollHeight')
                    for position in range(0, height, 850):
                        if time.monotonic() >= deadline: raise TimeoutError('Route scroll/load deadline')
                        await page.evaluate('(position)=>scrollTo(0,position)', position)
                        await asyncio.sleep(.12)
                    await page.evaluate('scrollTo(0,0)')
                    while time.monotonic() < deadline:
                        status_sent = route not in ('/computer-access/','/cockpit/') or any(status_get_succeeded(item) for item in row['requests'])
                        if not pending and not body_tasks and status_sent and time.monotonic()-last_event >= 1: break
                        await asyncio.sleep(.1)
                    else: row['issues'].append('Native network did not settle before deadline; pending: '+str([requests[x]['url'] for x in pending if x in requests]))
                    row['final_document'] = await page.evaluate('({url:location.href,title:document.title})')
                    if route in ('/computer-access/','/cockpit/') and not any(status_get_succeeded(item) for item in row['requests']):
                        row['issues'].append('Actual service status GET was not sent and answered')
                    if not any(item['url'] == ORIGIN+route and item['verified'] for item in row['documents']):
                        row['issues'].append('Initial route document body was not verified')
                    if row['declared_oss_static'] and not row['static_bodies']: row['issues'].append('No native OSS response bodies for the actual declared dependencies')
                except Exception as error: row['issues'].append(type(error).__name__+': '+str(error))
                finally:
                    if body_tasks:
                        active=list(body_tasks)
                        done,unresolved=await asyncio.wait(active,timeout=10)
                        if unresolved:
                            row['issues'].append('Native body capture exceeded its bounded teardown wait')
                            for task in unresolved:task.cancel()
                            await asyncio.gather(*unresolved,return_exceptions=True)
                    # Capture cancellation events from owned page teardown as well.
                    try:await asyncio.wait_for(page.close(),timeout=10)
                    except Exception as error:row['issues'].append('Owned page teardown failed: '+str(error))
                    await asyncio.sleep(.05)
                    row.update(blocking_events(row,contracts[route],manifest))
                    row['status'] = 'pass' if not any(row[key] for key in ('blocking_issues','blocking_loading_failed','http_failures','page_errors')) else 'fail'
                    row['oss_http_403'] = oss_403_count(row,plan['asset_base_url'])
                print(route+' '+row['status']+' CSP='+str(sum(is_csp_failure(event) for event in row['loading_failed']))+' OSS403='+str(row['oss_http_403']), flush=True)
        except Exception as error: report['error'] = type(error).__name__+': '+str(error)
        finally:
            if context: await context.close()
            report['profile_cleanup'] = recycle_profile(profile, cache) if profile.exists() else {'verified':True, 'not_created':True}
            for name,value in prior_temp.items():
                if value is None: os.environ.pop(name,None)
                else: os.environ[name] = value
    report['oss_download_bytes'] = sum(item.get('transferred_bytes',0) for row in report['pages'] if row['route'] not in retained
                                      for item in row.get('responses',[]) if item['url'].startswith(plan['asset_base_url']+'/'))
    report['summary'] = summarize(report['pages'],plan['asset_base_url'])
    report['status'] = 'pass' if len(report['pages']) == len(documents) and report['summary']['passed'] == len(documents) and not report.get('error') and report['profile_cleanup']['verified'] else 'fail'
    report['completed_at_beijing'] = oss.stamp(); report['seconds'] = round(time.monotonic()-started,3)
    args.output.parent.mkdir(parents=True,exist_ok=True); oss.write(args.output, report)
    if report['status'] == 'pass': validate_receipt(args.preparation, args.output, args.mode, args.release)
    print(json.dumps({'status':report['status'], 'summary':report['summary'], 'output':str(args.output)}, ensure_ascii=False))
    return 0 if report['status'] == 'pass' else 2


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--preparation',type=Path,required=True)
    parser.add_argument('--release',type=Path,help='Exact staged package including its publication manifest evidence')
    parser.add_argument('--mode',choices=('candidate','live'),required=True)
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--task-cache',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--route-timeout',type=int,default=120)
    parser.add_argument('--cold-cache',action='store_true',help='Independently download and verify every route without shared cache')
    parser.add_argument('--retry-failed',type=Path,help='Retain verified passing routes from this manifest-bound receipt')
    parser.add_argument('--confirm-download-over-5gb',action='store_true',help='Host explicitly confirmed an estimated download over 5 GB')
    args = parser.parse_args(); args.preparation = args.preparation.resolve()
    if args.route_timeout < 10: parser.error('Route timeout must allow real network settling')
    return asyncio.run(run(args))


if __name__ == '__main__': raise SystemExit(main())
