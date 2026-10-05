"""Bind a sealed OSS split and its actual browser evidence to reviewed source bytes."""
import argparse
import importlib.util
import hashlib
import json
import math
import re
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import unquote,urljoin,urlsplit,urlunsplit

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('typeset_oss_release',HERE/'prepare-oss-release.py')
oss=importlib.util.module_from_spec(spec);spec.loader.exec_module(oss)
spec=importlib.util.spec_from_file_location('typeset_source_gate',HERE/'prepare-typeset-release.py')
source_gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(source_gate)

def require(condition,message):
    if not condition:raise ValueError(message)

BOUNDED_SCHEMA='wly.oss-bounded-transfer-acceptance.v1'
EXTENDED_INSTRUCTION='8c5b469a-9178-475c-92aa-b59dd6fa5292'

def elapsed(value):
    return type(value) in (int,float) and math.isfinite(value) and value>=0

def bounded_report(report,manifest,manifest_sha256,role):
    """Validate actual per-run bodies; retain observations without another GET."""
    require(report.get('release_id')==manifest['release_id'] and report.get('manifest_sha256')==manifest_sha256,role+' transfer generation differs')
    method=report.get('transport_method','');scope=report.get('transport_scope','')
    require('Actual HTTPS route.fetch(max_retries=0)' in method and 'at most one retry' in method and 'verified network body within this run' in method,role+' transport method is not bounded actual HTTPS')
    require('Exact manifest-listed HTTPS static GET objects' in scope and 'excluding API paths, non-GET and Range' in scope and 'no local body substitution' in scope and 'not native uninterrupted cold sockets' in scope,role+' transport scope differs')
    origin=report.get('cors_origin',report.get('html_origin'))
    if origin is None and role=='reading':
        origins={urlsplit(row['url']).scheme+'://'+urlsplit(row['url']).netloc for row in report.get('responses',[]) if row.get('status')==200 and any(urlsplit(row['url']).path==page.get('url') and row.get('sha256')==page.get('html_sha256') for page in report.get('pages',{}).values())}
        require(len(origins)==1,'Reading actual HTML responses do not establish one browser origin')
        origin=next(iter(origins))
    parsed_origin=urlsplit(origin or '')
    require(parsed_origin.scheme in {'http','https'} and parsed_origin.netloc and origin==parsed_origin.scheme+'://'+parsed_origin.netloc,role+' actual CORS origin is missing')
    require(report.get('static_transfer_status')=='pass' and (role=='network' or not report.get('failed_requests')) and not report.get('errors') and not report.get('response_failures'),role+' has unresolved resource failures')
    if role=='reading':require(report.get('status')=='pass', 'Reading capability failed')
    remote={obj['url']:obj for obj in manifest['oss']['objects'].values()}
    transfers=report.get('static_transfers',[]);seen=set();first_failures=[];timings=[];gets=0
    require(transfers,role+' lacks actual static body transfers')
    for transfer in transfers:
        url=transfer.get('url');obj=remote.get(url);parsed=urlsplit(url or '')
        require(obj is not None and url not in seen and parsed.scheme=='https' and 'api' not in parsed.path.lower().split('/'),role+' has duplicate or out-of-scope objects')
        seen.add(url)
        require(transfer.get('status')=='pass' and transfer.get('method')==method and transfer.get('scope')==scope and transfer.get('cors_origin')==origin,role+' object transport metadata differs')
        attempts=transfer.get('attempts',[])
        require(1<=len(attempts)<=2 and [item.get('number') for item in attempts]==list(range(1,len(attempts)+1)),role+' exceeds the single retry')
        for attempt in attempts:
            require(elapsed(attempt.get('seconds')) and isinstance(attempt.get('started_at_beijing'),str),role+' attempt timing missing')
            require(datetime.fromisoformat(attempt['started_at_beijing']).utcoffset()==timedelta(hours=8),role+' attempt timestamp is not Beijing time')
        require(elapsed(transfer.get('seconds')) and transfer['seconds']+.000003>=sum(item['seconds'] for item in attempts),role+' total elapsed time is missing or shorter than attempts')
        final=attempts[-1]
        require(final.get('http')==200 and final.get('final_url')==url and final.get('bytes')==obj['bytes'] and final.get('sha256')==obj['sha256'] and final.get('content_type','').split(';',1)[0].strip()==obj['content_type'] and final.get('acao') in {origin,'*'} and not final.get('failure') and not final.get('error'),role+' final body/SHA/MIME/CORS/URL differs')
        require('first_failure' in transfer,role+' first failure field was removed')
        if len(attempts)==1:
            require(transfer['first_failure'] is None,role+' invents a first failure')
        else:
            first=attempts[0];reason=first.get('failure');error=first.get('error','').lower()
            allowed=(reason=='http_5xx' and type(first.get('http')) is int and 500<=first['http']<600) or (reason=='empty_body' and first.get('bytes')==0)
            allowed=allowed or (reason=='empty_transport' and 'http' not in first and any(token in error for token in ('err_empty_response','socket hang up','econnreset','client network socket disconnected before secure tls connection was established')))
            allowed=allowed or (reason=='long_transport_timeout' and 'http' not in first and 'route.fetch' in error and 'timeout' in error)
            if any(token in error for token in ('certificate','err_cert_','ssl verification','ssl handshake failed')):allowed=False
            require(allowed and transfer['first_failure']==first,role+' retry reason or retained first failure differs')
            first_failures.append({'url':url,'first_failure':first})
        consumers=transfer.get('consumers',[])
        require(consumers and all(item.get('reused_transfer') is (number>0) and item.get('resource_type') for number,item in enumerate(consumers)),role+' consumer reuse observations are missing')
        for consumer in consumers:
            actual=urlsplit(consumer['url']);query='&'.join(part for part in actual.query.split('&') if unquote(part.partition('=')[0])!='__wly_resource_retry')
            require(urlunsplit((actual.scheme,actual.netloc,actual.path,query,actual.fragment))==url,role+' consumer query or object identity differs')
        gets+=len(attempts);timings.append({'url':url,'seconds':transfer['seconds'],'attempts':[{'number':item['number'],'started_at_beijing':item['started_at_beijing'],'seconds':item['seconds']} for item in attempts]})
    canceled_consumers=[];raw_failed_requests=report.get('failed_requests',[])
    require(isinstance(raw_failed_requests,list),role+' failed request observations are malformed')
    by_url={transfer['url']:transfer for transfer in transfers}
    for failure in raw_failed_requests:
        require(role=='network' and failure.get('error')=='net::ERR_ABORTED' and failure.get('resource_type')=='image','Only full QA image consumer cancellations may be retained with a verified body')
        actual=urlsplit(failure.get('url',''));query='&'.join(part for part in actual.query.split('&') if unquote(part.partition('=')[0])!='__wly_resource_retry')
        canonical=urlunsplit((actual.scheme,actual.netloc,actual.path,query,actual.fragment));transfer=by_url.get(canonical)
        require(transfer is not None and any(consumer['url']==failure['url'] and consumer['resource_type']=='image' for consumer in transfer['consumers']),'Canceled image lacks its exact same-run verified transfer and consumer')
        canceled_consumers.append({'observation':failure,'canonical_url':canonical,'classification':'image_consumer_aborted_with_same_run_verified_body','verified_body':{key:transfer['attempts'][-1][key] for key in ('http','final_url','bytes','sha256','content_type','acao')},'cancellation_time_and_cause':'not established by network report'})
    cold_timings=[]
    if role=='cold':
        require(report.get('native_uninterrupted_cold') is False and report.get('static_retry_once') is True and report.get('capability_status')=='pass' and report.get('performance_status')=='not_met' and report.get('status')=='not_met','Controlled transfer must not claim native cold or two-second performance')
        checks=report.get('checks',[]);routes={'/projects/localocr/','/skills/localocr/'}
        require(len(checks)==8 and {(row['route'],row['phone'],row['round']) for row in checks}=={(route,phone,number) for route in routes for phone in (False,True) for number in (1,2)},'Controlled cold omits the LocalOCR eight cases')
        for row in checks:
            require(row.get('status')=='pass' and row.get('issues')==[] and not row.get('failed_requests') and not row.get('network_failures') and row.get('native_uninterrupted_cold') is False and row.get('transport_method')==method and row.get('transport_scope')==scope,'Controlled cold capability or issues failed')
            observation=row.get('observation',{});images=observation.get('images',[])
            require(observation.get('expected_main_images') and observation.get('decoded_main_images')==observation['expected_main_images'] and images and all(image.get('complete') is True and image.get('width',0)>0 and image.get('height',0)>0 for image in images),'Controlled cold current main page parts did not decode')
            require(observation.get('video_count')==0 and observation.get('hero',{}).get('reason')=='illustration-compatibility','Controlled cold MM01 static illustration gate changed')
            responses=row.get('oss_responses',[])
            require(responses and all(item.get('status') in {200,206} and not item.get('disk_cache') and not item.get('service_worker') for item in responses),'Controlled cold lacks actual uncached OSS response observations')
            require(row.get('static_transfer_urls') and set(row['static_transfer_urls'])<=seen,'Controlled cold case lacks its actual transfer references')
            require(all(elapsed(row.get(key)) for key in ('seconds','completion_seconds','elapsed_seconds')) and row.get('under_two_seconds') is (row['seconds']<=2),'Controlled cold elapsed observations changed')
            cold_timings.append({key:row[key] for key in ('route','phone','round','seconds','completion_seconds','elapsed_seconds','under_two_seconds')})
    return {'objects':len(transfers),'body_gets':gets,'first_failures':first_failures,'transfer_timings':timings,'cold_timings':cold_timings,'run_seconds':report.get('seconds'),'transport_method':method,'transport_scope':scope,'cors_origin':origin,'checked_at_beijing':report.get('checked_at_beijing'),'verified_at_beijing':report.get('verified_at_beijing'),'raw_failed_requests':raw_failed_requests,'raw_failed_requests_sha256':hashlib.sha256(json.dumps(raw_failed_requests,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf8')).hexdigest(),'canceled_consumers':canceled_consumers}

def bounded_acceptance(manifest,manifest_sha256,instruction,sources,layout_acceptance=None,build_report=None,qa_plan=None):
    instruction=instruction.resolve();text=instruction.read_text('utf8')
    require(EXTENDED_INSTRUCTION in text and '2e、2f 和以后各版' in text and '最多重试一次' in text,'Bounded acceptance lacks the actual 14:52 extension')
    require(set(sources)=={'cold','network','reading'},'Bounded acceptance requires all three actual reports')
    retained={}
    for role,path in sources.items():
        path=Path(path).resolve();report=oss.read(path)
        retained[role]={'path':str(path),'sha256':oss.digest(path),'release_id':report.get('release_id'),'manifest_sha256':report.get('manifest_sha256'),**bounded_report(report,manifest,manifest_sha256,role)}
    verification_path=Path(sources['network']).resolve().parent/'verification.json'
    verification=oss.read(verification_path)
    require(verification.get('release_id')==manifest['release_id'],'Bounded full QA generation differs')
    accepted_layout=None
    if layout_acceptance:
        require(build_report and qa_plan,'Layout acceptance requires the same source report and split QA plan')
        plan=oss.read(qa_plan)
        require(plan.get('split_manifest_sha256')==manifest_sha256 and plan.get('files')==manifest['files'],'Layout QA plan differs from the bounded split')
        accepted_layout=source_gate.layout_acceptance(layout_acceptance,oss.read(build_report),build_report,
            verification,verification_path,list(plan['pages']),qa_plan)
    else:
        require(verification.get('summary',{}).get('failed')==0 and verification.get('summary',{}).get('passed')==len(verification.get('pages',{})) and verification.get('pages'),'Bounded full QA source did not pass')
        for page in verification['pages'].values():
            require(page.get('status')=='pass' and len(page.get('checks',[]))==2 and {row.get('width') for row in page['checks']}=={1440,390} and all(row.get('status')=='pass' and row.get('issues')==[] for row in page['checks']),'Bounded full QA lacks its desktop/mobile capability')
    result={'schema':BOUNDED_SCHEMA,'status':'pass','instruction_id':EXTENDED_INSTRUCTION,'instruction_file':str(instruction),'instruction_sha256':oss.digest(instruction),'release_id':manifest['release_id'],'manifest_sha256':manifest_sha256,'max_get_attempts_per_object_per_run':2,'native_uninterrupted_cold':False,'performance_status':'not_met','persistent_settings_changed':False,'new_body_gets_for_proof':0,'sources':retained,'verification':{'path':str(verification_path),'sha256':oss.digest(verification_path)}}
    if accepted_layout:result['layout_acceptance']=accepted_layout
    return result

def verify_bounded_acceptance(receipt,manifest,manifest_sha256,cold_path,reading_path,verification_path,layout_acceptance=None,build_report=None,qa_plan=None):
    sources=receipt.get('sources',{})
    require(set(sources)=={'cold','network','reading'},'Bounded proof source set differs')
    require(Path(sources['cold']['path']).resolve()==cold_path.resolve() and Path(sources['reading']['path']).resolve()==reading_path.resolve(),'Bounded proof is not the selected actual cold/reading reports')
    require(Path(receipt['verification']['path']).resolve()==verification_path.resolve() and oss.digest(verification_path)==receipt['verification']['sha256'],'Bounded proof is not the selected unchanged full QA verification')
    for role,source in sources.items():require(oss.digest(Path(source['path']))==source['sha256'],'Bounded '+role+' source SHA changed')
    expected=bounded_acceptance(manifest,manifest_sha256,Path(receipt['instruction_file']),{role:source['path'] for role,source in sources.items()},layout_acceptance,build_report,qa_plan)
    require(receipt==expected,'Bounded proof instruction, observations or acceptance metadata changed')

def verify(args):
    preparation=args.preparation.resolve()
    plan=oss.verify_local(preparation)
    manifest=oss.read(preparation/'github/release-manifest.json')
    oss.verify_manifest(manifest)
    require(not plan['test_only'],'Loopback preparations cannot be published')
    build=oss.read(args.build_report)
    require(build['release_id']==plan['source_release_id'],'OSS split belongs to another source release')
    source_files={key:value for key,value in plan['source_files'].items() if key!='release-manifest.json'}
    require(source_files==build['files'],'OSS split source files differ from reviewed source inventory')
    if args.rebuilt_source:
        rebuilt=oss.read(args.rebuilt_source/'release-manifest.json')
        require(rebuilt['release_id']==build['release_id'] and rebuilt['files']==source_files,'Publish-time rebuild differs from reviewed source')
        require({key:value for key,value in oss.inventory(args.rebuilt_source).items() if key!='release-manifest.json'}==source_files,'Rebuilt source bytes differ')
    qa_plan=oss.read(args.qa_plan)
    require(qa_plan.get('schema')=='wly.typeset-oss-qa-plan.v1','Unsupported split QA plan')
    require(qa_plan['release_id']==manifest['release_id'] and qa_plan['source_release_id']==build['release_id'],'QA plan release identity differs')
    require(qa_plan['source_build_report_sha256']==oss.digest(args.build_report),'QA source report changed')
    require(qa_plan['split_manifest_sha256']==oss.digest(preparation/'github/release-manifest.json'),'QA split manifest changed')
    require(qa_plan['files']==manifest['files'] and set(qa_plan['pages'])==set(build['pages']),'QA split file/page coverage differs')
    verification=oss.read(args.verification)
    require(verification['build_report_sha256']==oss.digest(args.qa_plan) and verification['release_id']==manifest['release_id'],'Browser verification belongs to another split plan')
    acceptance_path=getattr(args,'layout_acceptance',None)
    accepted_layout=source_gate.layout_acceptance(acceptance_path,build,args.build_report,verification,args.verification,
        list(build['pages']),args.qa_plan) if acceptance_path else None
    if not accepted_layout:
        require(verification['summary']['failed']==0 and verification['summary']['passed']==len(build['pages']),'Split DOM verification did not pass every page')
    require(set(verification['pages'])==set(build['pages']),'Split DOM verification omits pages')
    for page,entry in qa_plan['pages'].items():
        observed=verification['pages'][page]
        require((accepted_layout or observed['status']=='pass') and observed['url']==entry['url'],'Failed split page: '+page)
        require(len(observed['checks'])==2 and {check['width'] for check in observed['checks']}=={1440,390},'Missing desktop/mobile checks: '+page)
        if not accepted_layout:
            require(all(check['status']=='pass' and check['issues']==[] for check in observed['checks']),'Unresolved split DOM checks: '+page)
    reading=oss.read(args.reading)
    require(reading['status']=='pass' and reading['evidence_mode']=='artifact' and reading['artifact_unchanged'] is True,'Reading check is not the actual unchanged split artifact')
    require(reading['release_id']==manifest['release_id'] and reading['manifest_sha256']==oss.digest(preparation/'github/release-manifest.json'),'Reading check release differs')
    require(reading['build_report_sha256']==oss.digest(args.qa_plan),'Reading plan differs')
    require(not reading.get('response_failures') and reading['responses'],'Reading check lacks actual response byte evidence')
    require(set(reading['pages'])==set(qa_plan['pages']),'Reading check omits or adds reviewed pages')
    remote_by_url={entry['url']:entry for entry in manifest['oss']['objects'].values()}
    for page,entry in qa_plan['pages'].items():
        observed=reading['pages'][page]
        relative=source_gate.hybrid.route_file(entry['url'])
        expected_html=manifest['files'][relative]['sha256']
        require(observed['url']==entry['url'] and observed['html_sha256']==expected_html,'Reading HTML/page identity differs: '+page)
        documents=[row for row in reading['responses'] if urlsplit(row['url']).path==entry['url']]
        require(documents and all(row['status']==200 and row.get('sha256')==expected_html for row in documents),'Reading HTML was not actually served: '+page)
        expected_scripts=[]
        html=(preparation/'github'/relative).read_text('utf8')
        for src in re.findall(r'<script\b[^>]*\bsrc=["\']([^"\'<>]+)["\']',html):
            url=urljoin(entry['url'],src);parsed=urlsplit(url)
            sha=remote_by_url[url]['sha256'] if parsed.netloc else manifest['files'][parsed.path.lstrip('/')]['sha256']
            expected_scripts.append({'src':src,'url':parsed.path,'sha256':sha})
        scripts=observed['scripts']
        require([{key:script.get(key) for key in ('src','url','sha256')} for script in scripts]==expected_scripts,'Reading script inventory differs: '+page)
        require(all(script.get('overridden') is False and script.get('response_verified') is True and script.get('served_sha256')==script['sha256'] and script.get('observed_sha256') and all(value==script['sha256'] for value in script['observed_sha256']) for script in scripts),'Reading script response bytes differ: '+page)
        require(any(case.get('page')==page and case.get('pass') is True for case in reading['cases']),'Reading check lacks actual cases: '+page)
    cold=oss.read(args.cold)
    require(cold['release_id']==manifest['release_id'],'Cold browser verification changed generation')
    require(cold['manifest_sha256']==oss.digest(preparation/'github/release-manifest.json'),'Cold browser manifest changed')
    require(len(cold['checks'])==8,'Cold browser does not cover both routes, widths and rounds')
    cold_routes={row['route'] for row in cold['checks']}
    expected_cases={(route,phone,number) for route in cold_routes for phone in [False,True] for number in [1,2]}
    actual_cases={(row['route'],row['phone'],row['round']) for row in cold['checks']}
    require(len(cold_routes)==2 and len(actual_cases)==8 and actual_cases==expected_cases,'Cold browser case identities are duplicated or incomplete')
    retry_receipt=None
    if args.retry_proof and oss.read(args.retry_proof).get('schema')==BOUNDED_SCHEMA:
        retry_receipt=oss.read(args.retry_proof)
        verify_bounded_acceptance(retry_receipt,manifest,oss.digest(preparation/'github/release-manifest.json'),args.cold,args.reading,args.verification,
            acceptance_path,args.build_report,args.qa_plan)
    elif args.retry_proof:
        retry_receipt=oss.read(args.retry_proof)
        extended=retry_receipt.get('instruction_id')=='8c5b469a-9178-475c-92aa-b59dd6fa5292'
        require(retry_receipt.get('schema')=='wly.oss-bounded-retry.v1' and (extended or retry_receipt['instruction_id']=='229e1241-e4a0-4f3a-9490-c039d5439019'),'Retry acceptance lacks the actual selected instruction')
        if extended:
            instruction=Path(retry_receipt['instruction_file'])
            require(oss.digest(instruction)==retry_receipt['instruction_sha256'],'Extended retry instruction changed')
            text=instruction.read_text('utf8')
            require('8c5b469a-9178-475c-92aa-b59dd6fa5292' in text and '2e、2f 和以后各版' in text and '最多重试一次' in text,'Retry proof is not the actual 14:52 extension')
        require(retry_receipt['status']=='pass' and retry_receipt['release_id']==manifest['release_id'] and retry_receipt['manifest_sha256']==oss.digest(preparation/'github/release-manifest.json'),'Retry proof is incomplete or belongs to another split')
        require(retry_receipt['max_post_failure_get_attempts']==1 and retry_receipt['persistent_settings_changed'] is False,'Retry count/settings differ from instruction')
        for row in retry_receipt['objects']:
            obj=remote_by_url.get(row['url'])
            require(obj is not None and row['status']=='pass' and row['post_failure_get_attempts']==1 and row['http']==200 and row['bytes']==obj['bytes'] and row['sha256']==obj['sha256'] and row['mime']==obj['content_type'] and row['acao']=='https://wly0829.cn' and row['final_url']==obj['url'],'Retry body or transfer contract differs from its exact object')
        retried={row['url'] for row in retry_receipt['objects']}
        failed_urls=set()
        for row in cold['checks']:
            failed_urls.update(failure['url'] for failure in row['failed_requests'])
            require(all(failure['failure']=='net::ERR_EMPTY_RESPONSE' for failure in row['failed_requests']),'Cold failure is not an allowed transient empty response')
            require(all(failure['canceled'] is False and failure['error']=='net::ERR_EMPTY_RESPONSE' and failure['url'] in retried for failure in row['network_failures']),'Unresolved cold network failure')
        require(failed_urls<=retried,'One or more cold resources lack their single real retry')
        require(retry_receipt['new_body_gets']==len(retry_receipt['objects'])==retry_receipt['unique_failed_objects'],'Incomplete single-retry coverage')
        if not extended:
            require(retry_receipt['peer_direct_objects']>0,'Incomplete peer coverage')
            peer_path=args.retry_proof.parent/'peer-direct-probe.json'
            if not peer_path.is_file():peer_path=Path(retry_receipt['retained_retry_proof']['original_path']).parent/'peer-direct-probe.json'
            require(oss.digest(peer_path)==retry_receipt['peer_probe_sha256'],'Peer direct probe changed')
            peer=oss.read(peer_path)
            require(peer['persistent_settings_changed'] is False and peer['process_only_no_proxy'] is True and len(peer['objects'])==retry_receipt['peer_direct_objects'],'Peer direct probe scope/settings differ')
            require(all(row['status']=='pass' and row['curl_exit']==0 and row['http']=='200' and row['remote_ip']==peer['explicit_public_ip'] and row['url'] in remote_by_url and row['bytes']==remote_by_url[row['url']]['bytes'] and row['sha256']==remote_by_url[row['url']]['sha256'] for row in peer['objects']),'Peer direct probe did not retrieve the exact objects')
        raw_failed_urls=set()
        for source in retry_receipt['source_cold_receipts']:
            path=Path(source['path'])
            require(oss.digest(path)==source['sha256'],'Original native cold receipt changed')
            original=oss.read(path)
            for case in original['checks']:raw_failed_urls.update(failure['url'] for failure in case['failed_requests'])
        require(raw_failed_urls==retried,'Retry object set differs from every retained original native failure')
        require(reading.get('static_transfers') and all(transfer['status']=='pass' and 1<=len(transfer['attempts'])<=2 for transfer in reading['static_transfers']),'Final split execution lacks bounded actual static transfers')
    else:
        require(cold['status']=='pass' and all(row['status']=='pass' and row['under_two_seconds'] and not row['failed_requests'] and not row['network_failures'] for row in cold['checks']),'Cold browser coverage or resource checks failed')
    if manifest.get('home_living_preparation'):
        living=cold.get('home_living',{})
        require(build.get('creative_preparation') and living.get('schema')=='wly.oss-home-living.v1' and living.get('release_id')==manifest['release_id'] and living.get('html_sha256')==manifest['files']['index.html']['sha256'] and living.get('status')=='pass','Living homepage lacks bound actual OSS runtime evidence')
        require(len(living.get('checks',[]))==3 and {row['case'] for row in living['checks']}=={'desktop','phone','reduced'},'Living homepage runtime cases are incomplete')
        for row in living['checks']:
            require(row['status']=='pass' and row['issues']==[] and not row['errors'] and row['responses'] and row.get('shader_time_uniform')=='u_t','Living homepage runtime or resource observations failed')
            require(all(response.get('verified') is True and response['url'] in remote_by_url and response['bytes']==remote_by_url[response['url']]['bytes'] and response['sha256']==remote_by_url[response['url']]['sha256'] for response in row['responses']),'Living homepage did not execute exact real OSS bodies')
            if row['case']=='reduced':require(row['after']['draws']==0 and row['after']['diagnostics']['phase']=='static' and row['after']['diagnostics']['reason']=='reduced-motion' and row['after']['diagnostics']['frames']==row['before']['diagnostics']['frames'] and row['after']['image'] and all(image['complete'] and image['width']>0 for image in row['after']['image']),'Living static original and quiet clock/status contract were not observed')
            else:require(row['after']['draws']>row['before']['draws'] and row['after']['diagnostics']['frames']>row['before']['diagnostics']['frames'] and len(set(row['after']['time_samples']))>=2,'Actual living GL/frame/time did not advance')
    else:
        video=cold.get('video',{})
        require(video.get('status')=='pass' and video.get('issues')==[] and video.get('route')=='/' and video.get('seek',{}).get('seeked') is True,'Unchanged homepage lacks actual playback and seek evidence')
        require(video['before']['src'] in remote_by_url and video['after']['current_src']==video['before']['src'] and video['after']['current_time']>video['before']['current_time'],'Homepage playback does not use the bound real OSS video')
    if args.staged:
        staged=oss.read(args.staged/'release-manifest.json')
        oss.verify_manifest(staged)
        receipt=oss.read(args.preparation_receipt)
        require(receipt['status']=='ready' and receipt['release_id']==build['release_id'],'Staged publication lacks the source publication gate')
        source_layout=receipt.get('layout_acceptance')
        require(bool(source_layout)==bool(accepted_layout),'Staged OSS requires the same explicit layout acceptance as the source receipt')
        if accepted_layout:
            require(source_layout.get('domain')=='source' and source_layout.get('path')==accepted_layout['path']
                and source_layout.get('sha256')==accepted_layout['sha256'] and not receipt.get('blockers')
                and receipt.get('build_report_sha256')==oss.digest(args.build_report),'Source and OSS layout evidence differ')
        accepted={proof['url']:proof['evidence'] for proof in receipt['pages'].values()}
        expected={**manifest,'rollback_ref':args.rollback_ref,'accepted_pages':accepted}
        require(staged==expected,'Staged OSS manifest changed beyond exact rollback/publication evidence')
        require({key:value for key,value in oss.inventory(args.staged).items() if key!='release-manifest.json'}==manifest['files'],'Staged Git files differ from tested OSS HTML')
    result={'schema':'wly.typeset-oss-publication-check.v1','status':'pass','release_id':manifest['release_id'],
            'source_release_id':build['release_id'],'pages':len(build['pages']),
            'plan_sha256':oss.digest(preparation/'oss-plan.json'),'qa_plan_sha256':oss.digest(args.qa_plan),
            'verification_sha256':oss.digest(args.verification),'reading_sha256':oss.digest(args.reading),
            'cold_sha256':oss.digest(args.cold),'retry_proof_sha256':oss.digest(args.retry_proof) if args.retry_proof else None,
            'cold_acceptance':('Actual controlled HTTPS bodies with at most one retry per object per run under the 14:52 extension; first failures and elapsed times retained; native cold/two-second performance not claimed' if retry_receipt.get('schema')==BOUNDED_SCHEMA else ('Actual single post-failure body retry under the 14:52 extension to 2e/2f/future versions; first native failures and timing retained' if retry_receipt.get('instruction_id')=='8c5b469a-9178-475c-92aa-b59dd6fa5292' else 'Actual single post-failure body retry under 08:52 instruction; first native failures and timing retained')) if retry_receipt else 'All native cold cases pass under two seconds',
            'staged':bool(args.staged),'verified_at_beijing':oss.stamp()}
    result['raw_dom_verification']={'summary':verification.get('summary'),'verification_sha256':oss.digest(args.verification)}
    browser_network=getattr(args,'browser_network',None)
    require(not getattr(args,'require_browser_network',False) or browser_network,'Publication requires the final-origin native Chrome network gate')
    if browser_network:
        spec=importlib.util.spec_from_file_location('oss_native_network_gate',HERE/'verify-oss-browser-network.py')
        network_gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(network_gate)
        result['browser_network']=network_gate.validate_receipt(preparation,browser_network,'candidate',args.staged)
    if accepted_layout:
        require(accepted_layout['sha256']==oss.digest(acceptance_path) and accepted_layout['verification_sha256']==oss.digest(args.verification)
            and qa_plan['source_build_report_sha256']==oss.digest(args.build_report),'Layout evidence changed during OSS checking')
        result['layout_acceptance']=accepted_layout
    return result

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ['preparation','build-report','qa-plan','verification','reading','cold','output']:
        parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--rebuilt-source',type=Path)
    parser.add_argument('--staged',type=Path)
    parser.add_argument('--preparation-receipt',type=Path)
    parser.add_argument('--rollback-ref')
    parser.add_argument('--retry-proof',type=Path,help='Actual native bounded retry or controlled 14:52 transfer acceptance; retains source failures and timings')
    parser.add_argument('--layout-acceptance',type=Path,help='Same precise source/OSS layout acceptance supplied to the source publication gate')
    parser.add_argument('--browser-network',type=Path,help='Exact final-origin candidate native Chrome network gate receipt')
    parser.add_argument('--require-browser-network',action='store_true',help='Mandatory before HTML publication; earlier preparation checks may precede this run')
    args=parser.parse_args()
    if args.staged and (not args.preparation_receipt or not args.rollback_ref):parser.error('Staging needs the real source gate receipt and rollback commit')
    result=verify(args);oss.write(args.output,result)
    print(json.dumps(result,ensure_ascii=False))

if __name__=='__main__':main()
