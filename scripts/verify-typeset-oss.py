"""Bind a sealed OSS split and its actual browser evidence to reviewed source bytes."""
import argparse
import importlib.util
import json
import re
from pathlib import Path
from urllib.parse import urljoin,urlsplit

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('typeset_oss_release',HERE/'prepare-oss-release.py')
oss=importlib.util.module_from_spec(spec);spec.loader.exec_module(oss)

def require(condition,message):
    if not condition:raise ValueError(message)

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
    require(verification['summary']['failed']==0 and verification['summary']['passed']==len(build['pages']),'Split DOM verification did not pass every page')
    require(set(verification['pages'])==set(build['pages']),'Split DOM verification omits pages')
    for page,entry in qa_plan['pages'].items():
        observed=verification['pages'][page]
        require(observed['status']=='pass' and observed['url']==entry['url'],'Failed split page: '+page)
        require(len(observed['checks'])==2 and {check['width'] for check in observed['checks']}=={1440,390},'Missing desktop/mobile checks: '+page)
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
        relative=entry['url'].lstrip('/')+'index.html'
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
    if args.retry_proof:
        retry_receipt=oss.read(args.retry_proof)
        require(retry_receipt.get('schema')=='wly.oss-bounded-retry.v1' and retry_receipt['instruction_id']=='229e1241-e4a0-4f3a-9490-c039d5439019','Retry acceptance lacks the actual selected instruction')
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
        require(retry_receipt['new_body_gets']==len(retry_receipt['objects'])==retry_receipt['unique_failed_objects'] and retry_receipt['peer_direct_objects']>0,'Incomplete retry/peer coverage')
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
        accepted={proof['url']:proof['evidence'] for proof in receipt['pages'].values()}
        expected={**manifest,'rollback_ref':args.rollback_ref,'accepted_pages':accepted}
        require(staged==expected,'Staged OSS manifest changed beyond exact rollback/publication evidence')
        require({key:value for key,value in oss.inventory(args.staged).items() if key!='release-manifest.json'}==manifest['files'],'Staged Git files differ from tested OSS HTML')
    return {'schema':'wly.typeset-oss-publication-check.v1','status':'pass','release_id':manifest['release_id'],
            'source_release_id':build['release_id'],'pages':len(build['pages']),
            'plan_sha256':oss.digest(preparation/'oss-plan.json'),'qa_plan_sha256':oss.digest(args.qa_plan),
            'verification_sha256':oss.digest(args.verification),'reading_sha256':oss.digest(args.reading),
            'cold_sha256':oss.digest(args.cold),'retry_proof_sha256':oss.digest(args.retry_proof) if args.retry_proof else None,
            'cold_acceptance':'Actual single post-failure body retry under 08:52 instruction; first native failures and timing retained' if retry_receipt else 'All native cold cases pass under two seconds',
            'staged':bool(args.staged),'verified_at_beijing':oss.stamp()}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ['preparation','build-report','qa-plan','verification','reading','cold','output']:
        parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--rebuilt-source',type=Path)
    parser.add_argument('--staged',type=Path)
    parser.add_argument('--preparation-receipt',type=Path)
    parser.add_argument('--rollback-ref')
    parser.add_argument('--retry-proof',type=Path,help='Actual 08:52 bounded retry acceptance; retains original native cold failures')
    args=parser.parse_args()
    if args.staged and (not args.preparation_receipt or not args.rollback_ref):parser.error('Staging needs the real source gate receipt and rollback commit')
    result=verify(args);oss.write(args.output,result)
    print(json.dumps(result,ensure_ascii=False))

if __name__=='__main__':main()
