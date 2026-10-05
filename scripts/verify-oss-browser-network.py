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
    query = '&'.join(part for part in parts.query.split('&') if unquote(part.partition('=')[0]) != '__wly_resource_retry')
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, ''))


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


def validate_receipt(preparation, receipt_path, mode='candidate', release=None):
    plan, manifest, root, documents = artifact(preparation, release)
    report = oss.read(receipt_path)
    expected = {'schema': SCHEMA, 'mode': mode, 'method': METHOD, 'origin': ORIGIN,
                'release_id': manifest['release_id'], 'source_release_id': plan['source_release_id'],
                'plan_sha256': oss.digest(Path(preparation)/oss.PLAN),
                'manifest_sha256': oss.digest(root/oss.MANIFEST), 'routes': list(documents)}
    for key, value in expected.items():
        if report.get(key) != value: raise ValueError('Browser network receipt differs: ' + key)
    if report.get('status') != 'pass' or not report.get('profile_cleanup', {}).get('verified'):
        raise ValueError('Native browser network gate or profile cleanup did not pass')
    rows = report.get('pages', [])
    if len(rows) != len(documents) or [row.get('route') for row in rows] != list(documents):
        raise ValueError('Browser network receipt omits manifest routes or aliases')
    for row in rows:
        if row.get('status') != 'pass' or row.get('issues') or row.get('loading_failed') or row.get('page_errors') or row.get('http_failures'):
            raise ValueError('Browser failures remain on ' + row.get('route', '?'))
        observed = row.get('documents', [])
        address = ORIGIN + row['route']
        if not any(item.get('url') == address and item.get('http') == 200 and item.get('sha256') == manifest['files'][documents[row['route']]]['sha256'] for item in observed):
            raise ValueError('Browser lacks actual route document bytes: ' + row['route'])
        if row['route'] in ('/computer-access/', '/cockpit/') and not any(
                item.get('method') == 'GET' and canonical_object(item.get('url', '')) == STATUS_URL and item.get('response_received')
                for item in row.get('requests', [])):
            raise ValueError('Actual service status GET was not sent: ' + row['route'])
        if not row.get('static_bodies'): raise ValueError('No native sealed OSS response bodies: '+row['route'])
        for body in row['static_bodies']:
            obj = next((obj for obj in manifest['oss']['objects'].values() if obj['url'] == body.get('canonical_url')), None)
            if not obj or body.get('verified') is not True or not body.get('sha256'):
                raise ValueError('Browser body is not a sealed OSS object')
            if body.get('http') == 200 and (body.get('sha256') != obj['sha256'] or body.get('bytes') != obj['bytes']):
                raise ValueError('Browser full body SHA differs from sealed OSS object')
    if report.get('summary') != summarize(rows): raise ValueError('Browser network summary does not match retained events')
    return {**expected, 'status': 'pass', 'receipt_path': str(Path(receipt_path).resolve()),
            'receipt_sha256': oss.digest(receipt_path), 'summary': report['summary']}


def summarize(rows):
    return {'routes': len(rows), 'passed': sum(row.get('status') == 'pass' for row in rows),
            'csp_blocked': sum(is_csp_failure(event) for row in rows for event in row.get('loading_failed', [])),
            'loading_failed': sum(len(row.get('loading_failed', [])) for row in rows),
            'http_failures': sum(len(row.get('http_failures', [])) for row in rows),
            'page_errors': sum(len(row.get('page_errors', [])) for row in rows)}


def is_csp_failure(event):
    # Some blocked subframe Documents omit blockedReason in Chrome's CDP event.
    return event.get('blockedReason') == 'csp' or event.get('errorText') == 'net::ERR_BLOCKED_BY_CSP'


def recycle_profile(profile, allowed_root):
    command = ['pwsh', '-NoProfile', '-File', 'E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
               '-LiteralPath', str(profile), '-AllowedRoot', str(allowed_root), '-Json']
    result = subprocess.run(command, capture_output=True, text=True, encoding='utf8')
    try: receipt = json.loads(result.stdout.lstrip('\ufeff'))
    except ValueError: receipt = {'output': result.stdout, 'error': result.stderr}
    return {'verified': result.returncode == 0 and not profile.exists() and receipt.get('status') == 'recycled'
            and receipt.get('original_path_verified') is True and receipt.get('recovery_item_exists') is True,
            'receipt': receipt, 'exit': result.returncode}


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
              'release_id': manifest['release_id'], 'source_release_id': plan['source_release_id'],
              'plan_sha256': oss.digest(args.preparation/oss.PLAN), 'manifest_sha256': oss.digest(root/oss.MANIFEST),
              'routes': list(documents), 'pages': [], 'started_at_beijing': oss.stamp()}
    objects = {obj['url']: (rel, obj) for rel, obj in manifest['oss']['objects'].items()}
    url_documents = {ORIGIN+route: rel for route, rel in documents.items()}
    async with async_playwright() as runtime:
        context = None
        try:
            context = await runtime.chromium.launch_persistent_context(str(profile), executable_path=str(args.chrome),
                headless=True, viewport={'width':1440, 'height':1000}, service_workers='block')
            report['browser_version'] = context.browser.version if context.browser else 'persistent installed Chrome'
            if args.mode == 'candidate':
                async def document_handler(route):
                    request = route.request
                    rel = url_documents.get(request.url)
                    if request.resource_type == 'document' and request.method == 'GET' and rel:
                        await route.fulfill(status=200, content_type='text/html; charset=utf-8', body=(root/rel).read_bytes())
                    else: await route.continue_()
                # This pattern never matches the OSS or service origin.
                await context.route(ORIGIN+'/**', document_handler)
            for initial in list(context.pages): await initial.close()
            for route, rel in documents.items():
                page = await context.new_page()
                session = await context.new_cdp_session(page)
                await session.send('Network.enable', {'maxTotalBufferSize':512*1024*1024, 'maxResourceBufferSize':64*1024*1024})
                await session.send('Network.setCacheDisabled', {'cacheDisabled':True})
                row = {'route':route, 'url':ORIGIN+route, 'status':'fail', 'requests':[], 'responses':[],
                       'documents':[], 'static_bodies':[], 'loading_failed':[], 'http_failures':[], 'page_errors':[], 'issues':[]}
                report['pages'].append(row)
                requests = {}; responses = {}; pending = set(); body_tasks = set(); last_event = time.monotonic()
                def requested(event):
                    nonlocal last_event
                    last_event = time.monotonic(); request = event['request']; identity = event['requestId']
                    item = {'request_id':identity, 'url':request['url'], 'method':request['method'], 'type':event.get('type'),
                            'initiator_type':event.get('initiator',{}).get('type'), 'response_received':False}
                    requests[identity] = item; pending.add(identity); row['requests'].append(item)
                    if request['method'] not in ('GET', 'HEAD', 'OPTIONS'): row['issues'].append('Unexpected non-read request: '+request['method']+' '+request['url'])
                def received(event):
                    nonlocal last_event
                    last_event = time.monotonic(); response = event['response']; identity = event['requestId']
                    if identity in requests: requests[identity]['response_received'] = True
                    item = {'request_id':identity, 'url':response['url'], 'http':response['status'], 'type':event.get('type'),
                            'headers':{key.lower():value for key,value in response.get('headers',{}).items()
                                       if key.lower() in ('content-type','content-range','content-length','access-control-allow-origin')},
                            'disk_cache':response.get('fromDiskCache',False), 'service_worker':response.get('fromServiceWorker',False)}
                    responses[identity] = item; row['responses'].append(item)
                    if response['status'] >= 400: row['http_failures'].append({key:item[key] for key in ('url','http','type')})
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
                        value = await session.send('Network.getResponseBody', {'requestId':identity})
                        body = base64.b64decode(value['body']) if value.get('base64Encoded') else value['body'].encode('utf8')
                        result = {'url':url, 'http':item['http'], 'bytes':len(body), 'sha256':hashlib.sha256(body).hexdigest()}
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
                        if not result['verified']: row['issues'].append('Native response body differs from manifest: '+url)
                    except Exception as error: row['issues'].append('Actual browser body unavailable: '+url+' '+str(error))
                def finished(event):
                    nonlocal last_event
                    last_event = time.monotonic(); pending.discard(event['requestId'])
                    task = asyncio.create_task(record_body(event['requestId'])); body_tasks.add(task); task.add_done_callback(body_tasks.discard)
                session.on('Network.requestWillBeSent', requested)
                session.on('Network.responseReceived', received)
                session.on('Network.loadingFailed', failed)
                session.on('Network.loadingFinished', finished)
                page.on('pageerror', lambda error: row['page_errors'].append(str(error)))
                deadline = time.monotonic()+args.route_timeout
                try:
                    await page.goto(ORIGIN+route, wait_until='domcontentloaded', timeout=args.route_timeout*1000)
                    # Native scrolling activates the page's actual lazy resources.
                    height = await page.evaluate('document.documentElement.scrollHeight')
                    for position in range(0, height, 850):
                        if time.monotonic() >= deadline: raise TimeoutError('Route scroll/load deadline')
                        await page.evaluate('(position)=>scrollTo(0,position)', position)
                        await asyncio.sleep(.12)
                    await page.evaluate('scrollTo(0,0)')
                    while time.monotonic() < deadline:
                        status_sent = route not in ('/computer-access/','/cockpit/') or any(
                            item['method'] == 'GET' and canonical_object(item['url']) == STATUS_URL and item['response_received'] for item in row['requests'])
                        if not pending and not body_tasks and status_sent and time.monotonic()-last_event >= 1: break
                        await asyncio.sleep(.1)
                    else: row['issues'].append('Native network did not settle before deadline; pending: '+str([requests[x]['url'] for x in pending if x in requests]))
                    if route in ('/computer-access/','/cockpit/') and not any(
                        item['method'] == 'GET' and canonical_object(item['url']) == STATUS_URL and item['response_received'] for item in row['requests']):
                        row['issues'].append('Actual service status GET was not sent and answered')
                    if not any(item['url'] == ORIGIN+route and item['verified'] for item in row['documents']):
                        row['issues'].append('Initial route document body was not verified')
                    if not row['static_bodies']: row['issues'].append('No native OSS response bodies were observed')
                except Exception as error: row['issues'].append(type(error).__name__+': '+str(error))
                finally:
                    if body_tasks: await asyncio.gather(*list(body_tasks), return_exceptions=True)
                    # Capture cancellation events from owned page teardown as well.
                    await page.close(); await asyncio.sleep(.05)
                    row['status'] = 'pass' if not any(row[key] for key in ('issues','loading_failed','http_failures','page_errors')) else 'fail'
                print(route+' '+row['status']+' CSP='+str(sum(is_csp_failure(event) for event in row['loading_failed'])), flush=True)
        except Exception as error: report['error'] = type(error).__name__+': '+str(error)
        finally:
            if context: await context.close()
            report['profile_cleanup'] = recycle_profile(profile, cache) if profile.exists() else {'verified':True, 'not_created':True}
            for name,value in prior_temp.items():
                if value is None: os.environ.pop(name,None)
                else: os.environ[name] = value
    report['summary'] = summarize(report['pages'])
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
    args = parser.parse_args(); args.preparation = args.preparation.resolve()
    if args.route_timeout < 10: parser.error('Route timeout must allow real network settling')
    return asyncio.run(run(args))


if __name__ == '__main__': raise SystemExit(main())
