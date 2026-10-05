"""Apply navigation, accessible text, metadata and live display fixes; never deploy."""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess

HERE = Path(__file__).resolve().parent
HOTFIX_BASELINE_SCHEMA = 'wly.oss-metadata-hotfix-runtime-baseline.v1'
HOTFIX_INSTRUCTION = 'c6a54c5b-bd74-43d5-9ffe-4a49b95d1190'
HOTFIX_DOCUMENT = 'computer-access/index.html'


def module(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), HERE / (name + '.py'))
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


def git_bytes(ref, relative):
    if not isinstance(ref,str) or not re.fullmatch(r'[0-9a-f]{40,64}',ref):
        raise ValueError('Metadata hotfix binding requires an exact Git commit')
    return subprocess.check_output(['git','show',ref+':site-release/'+relative],cwd=HERE.parent)


def meta_policy_spans(payload):
    oss=module('prepare-oss-release');text=payload.decode('utf8');spans={}
    for tag,attrs,raw,offset in oss.HtmlTags(text).tags:
        if tag!='meta':continue
        kind='csp' if (attrs.get('http-equiv')or'').lower()=='content-security-policy' else 'referrer' if (attrs.get('name')or'').lower()=='referrer' else None
        if not kind:continue
        for attr in oss.ALL_ATTR.finditer(raw):
            if attr['name'].lower()=='content':
                field='quoted' if attr['q'] else 'unquoted'
                if kind in spans:raise ValueError('Bounded hotfix expects exactly one original CSP and referrer meta')
                spans[kind]={'start':offset+attr.start(field),'end':offset+attr.end(field),'raw':attr[field]}
    if set(spans)!={'csp','referrer'}:raise ValueError('Bounded hotfix lacks original CSP or referrer meta')
    return text,spans


def replace_meta_policies(payload, policies):
    text,spans=meta_policy_spans(payload)
    for kind in sorted(spans,key=lambda key:spans[key]['start'],reverse=True):
        row=spans[kind];text=text[:row['start']]+policies[kind]+text[row['end']:]
    return text.encode('utf8')


def metadata_hotfix_delta(before_ref, production_ref):
    """Admit only the approved two meta values and four manifest fields."""
    oss=module('prepare-oss-release')
    before=json.loads(git_bytes(before_ref,'release-manifest.json'))
    current=json.loads(git_bytes(production_ref,'release-manifest.json'))
    subprocess.check_call(['git','merge-base','--is-ancestor',before_ref,production_ref],cwd=HERE.parent)
    changed=subprocess.check_output(['git','diff','--name-only',before_ref,production_ref,'--','site-release'],cwd=HERE.parent,text=True).splitlines()
    if set(changed)!={'site-release/'+HOTFIX_DOCUMENT,'site-release/release-manifest.json'}:
        raise ValueError('Production delta is outside the approved metadata hotfix')
    oss.verify_manifest(before);oss.verify_manifest(current)
    prior_body=git_bytes(before_ref,HOTFIX_DOCUMENT);current_body=git_bytes(production_ref,HOTFIX_DOCUMENT)
    for manifest,body in ((before,prior_body),(current,current_body)):
        if manifest['files'][HOTFIX_DOCUMENT]!={'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}:
            raise ValueError('Production hotfix HTML is not bound to its real Git manifest')
    _,old=meta_policy_spans(prior_body);_,new=meta_policy_spans(current_body)
    policies={key:row['raw'] for key,row in new.items()}
    if replace_meta_policies(prior_body,policies)!=current_body:
        raise ValueError('Production HTML changed beyond the approved CSP/referrer values')
    if old['referrer']['raw']!='no-referrer' or new['referrer']['raw']!=oss.OSS_REFERRER_POLICY:
        raise ValueError('Production referrer delta is not the approved origin-only policy')
    old_segments=[part.split() for part in oss.html.unescape(old['csp']['raw']).split(';') if part.split()]
    new_segments=[part.split() for part in oss.html.unescape(new['csp']['raw']).split(';') if part.split()]
    if len(old_segments)!=len(new_segments):raise ValueError('Hotfix added or removed CSP directives')
    allowed={'script-src':'application/javascript','style-src':'text/css','img-src':'image/'}
    objects={row['url']:row for row in before['oss']['objects'].values()}
    for prior,updated in zip(old_segments,new_segments):
        if updated[:len(prior)]!=prior:raise ValueError('Hotfix removed or changed an original CSP source, nonce or directive')
        added=updated[len(prior):]
        if added and prior[0] not in allowed:raise ValueError('Hotfix widened an unrelated CSP directive')
        for url in added:
            obj=objects.get(url);mime=obj.get('content_type','') if obj else ''
            if not obj or not (mime.startswith('image/') if prior[0]=='img-src' else mime==allowed[prior[0]]):
                raise ValueError('Hotfix CSP source is not the exact existing object of the required type')
    expected=json.loads(json.dumps(before))
    expected['files'][HOTFIX_DOCUMENT]=current['files'][HOTFIX_DOCUMENT]
    expected['release_id']=current['release_id'];expected['oss']['verification']['release_id']=current['release_id']
    if expected!=current:raise ValueError('Hotfix manifest changed beyond its four approved semantic fields')
    return before,current,policies


def rebuild_metadata_hotfix_baseline(original, before_ref, production_ref, output):
    """Copy original runtime bytes, then bind the exact approved meta delta."""
    original,output=Path(original).resolve(),Path(output).resolve()
    if output.exists() or output.is_relative_to(original) or original.is_relative_to(output):
        raise ValueError('Hotfix baseline requires a fresh disjoint output')
    previous=verify_input_baseline(original,before_ref,True)
    before,current,policies=metadata_hotfix_delta(before_ref,production_ref)
    hybrid=module('hybrid-release');oss=module('prepare-oss-release')
    source_before=(original/HOTFIX_DOCUMENT).read_bytes()
    source_after=replace_meta_policies(source_before,policies)
    shutil.copytree(original,output)
    (output/HOTFIX_DOCUMENT).write_bytes(source_after)
    files=hybrid.inventory(output)
    if {key:value for key,value in files.items() if key!=HOTFIX_DOCUMENT}!={key:value for key,value in previous['files'].items() if key!=HOTFIX_DOCUMENT}:
        raise ValueError('Hotfix baseline changed another original source or media file')
    if source_before==source_after:raise ValueError('Hotfix runtime source did not receive the real metadata delta')
    manifest={**previous,'files':files,'release_id':hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest(),
        'production_metadata_hotfix':{'schema':HOTFIX_BASELINE_SCHEMA,'instruction_id':HOTFIX_INSTRUCTION,
            'original_source_root':str(original),'original_source_manifest_sha256':oss.digest(original/hybrid.MANIFEST),
            'original_source_release_id':previous['release_id'],'before_production_commit':before_ref,'production_commit':production_ref,
            'production_manifest_sha256':hashlib.sha256(git_bytes(production_ref,hybrid.MANIFEST)).hexdigest(),
            'runtime_release_id':hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest(),
            'document':HOTFIX_DOCUMENT,'before':previous['files'][HOTFIX_DOCUMENT],'after':files[HOTFIX_DOCUMENT]}}
    # Maintain the existing source overlay ledger as well as files/RID. Its
    # before value still describes the earlier source construction baseline.
    if HOTFIX_DOCUMENT in manifest.get('release_overlay',{}):
        manifest['release_overlay']={**manifest['release_overlay'],HOTFIX_DOCUMENT:{**manifest['release_overlay'][HOTFIX_DOCUMENT],'after':files[HOTFIX_DOCUMENT]}}
    # This is a new source RID computed from new real bytes, never the old RID.
    if manifest['release_id']==previous['release_id']:raise ValueError('New runtime baseline did not acquire its actual new source identity')
    hybrid.write(output/hybrid.MANIFEST,manifest)
    verify_input_baseline(output,production_ref,True)
    return manifest


def verify_input_baseline(baseline, baseline_ref=None, runtime_baseline=False):
    hybrid=module('hybrid-release')
    if not runtime_baseline:
        return hybrid.verify_release(baseline)
    if not isinstance(baseline_ref,str) or not re.fullmatch(r'[0-9a-f]{40,64}',baseline_ref):
        raise ValueError('Runtime staging requires an exact published Git commit')
    previous=hybrid.read(baseline/hybrid.MANIFEST)
    files=hybrid.inventory(baseline)
    if previous.get('schema')!='wly.hybrid-release.v1' or previous.get('files')!=files:
        raise ValueError('Complete runtime staging inventory differs from its manifest')
    if previous.get('release_id')!=hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest():
        raise ValueError('Runtime source release identifier differs from its actual file inventory')
    published=json.loads(subprocess.check_output(['git','show',baseline_ref+':site-release/'+hybrid.MANIFEST],cwd=HERE.parent))
    oss=module('prepare-oss-release')
    oss.verify_manifest(published)
    cloud=published['oss']
    binding=previous.get('production_metadata_hotfix')
    original_id=previous.get('release_id')
    if binding and binding.get('runtime_release_id')==previous.get('release_id'):
        if (binding.get('schema')!=HOTFIX_BASELINE_SCHEMA or binding.get('instruction_id')!=HOTFIX_INSTRUCTION
                or binding.get('production_commit')!=baseline_ref or binding.get('document')!=HOTFIX_DOCUMENT):
            raise ValueError('Runtime hotfix binding is not the exact approved production generation')
        original=Path(binding['original_source_root']).resolve()
        original_manifest=verify_input_baseline(original,binding['before_production_commit'],True)
        if (oss.digest(original/hybrid.MANIFEST)!=binding['original_source_manifest_sha256']
                or original_manifest.get('production_metadata_hotfix') or original_manifest['release_id']!=binding['original_source_release_id']):
            raise ValueError('Original immutable runtime source or identity changed')
        _,bound_production,policies=metadata_hotfix_delta(binding['before_production_commit'],baseline_ref)
        if (bound_production!=published or hashlib.sha256(git_bytes(baseline_ref,hybrid.MANIFEST)).hexdigest()!=binding['production_manifest_sha256']
                or previous['release_id']!=hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()
                or binding['before']!=original_manifest['files'][HOTFIX_DOCUMENT] or binding['after']!=files[HOTFIX_DOCUMENT]
                or {key:value for key,value in files.items() if key!=HOTFIX_DOCUMENT}!={key:value for key,value in original_manifest['files'].items() if key!=HOTFIX_DOCUMENT}
                or (baseline/HOTFIX_DOCUMENT).read_bytes()!=replace_meta_policies((original/HOTFIX_DOCUMENT).read_bytes(),policies)):
            raise ValueError('Runtime baseline is not the exact metadata-only hotfix derivation')
        original_id=original_manifest['release_id']
    if previous.get('source_kind') == 'offline-cache-with-exact-published-hotfix-document':
        document = 'projects/ai-cli-profile-manager/index.html'
        if (previous.get('production_commit') != baseline_ref
                or (baseline/document).read_bytes() != git_bytes(baseline_ref, document)):
            raise ValueError('Privacy baseline does not contain the exact published hotfix document')
        # The retained source hashes and complete production rewrite are checked below.
        original_id = cloud['source_release_id']
    if original_id!=cloud['source_release_id']:
        raise ValueError('Runtime staging is not the published OSS source version')
    if set(files)!=set(published['files'])|set(cloud['objects']):
        raise ValueError('Runtime staging must contain every published HTML and source asset')
    rewrite=oss.Rewriter(files,cloud['asset_base_url'],cloud['prefix'],'https://wly0829.cn',version=cloud.get('rewriter_version',1),source_root=baseline)
    home,_=oss.current_home_links(baseline,version=cloud.get('rewriter_version',1))
    for relative,proof in files.items():
        if relative in cloud['objects']:
            if proof!=cloud['objects'][relative].get('source'):
                raise ValueError('Runtime source fingerprint differs from published provenance: '+relative)
        else:
            body=home if relative=='index.html' else (baseline/relative).read_bytes()
            if relative.endswith('.html') or Path(relative).suffix in oss.TEXT_ASSETS:
                body=rewrite.rewrite(body,relative)
            expected=published['files'][relative]
            if len(body)!=expected['bytes'] or hashlib.sha256(body).hexdigest()!=expected['sha256']:
                raise ValueError('Runtime HTML rewrite does not reproduce published bytes: '+relative)
    if rewrite.missing:
        raise ValueError('Runtime staging has unresolved asset references')
    return previous


def finalize_release(baseline, output, reports, baseline_ref=None, runtime_baseline=False):
    """Bind only actual changed files to their previous and resulting identities."""
    hybrid = module('hybrid-release')
    baseline = Path(baseline).resolve()
    output = Path(output).resolve()
    previous = verify_input_baseline(baseline,baseline_ref,runtime_baseline)
    before = previous['files']
    after = hybrid.inventory(output)
    removed = sorted(set(before) - set(after))
    if removed:
        raise ValueError('Audit repair cannot remove existing release assets: ' + ', '.join(removed))
    changed = {rel for rel, proof in after.items() if proof != before.get(rel)}
    accepted = {}
    overlays = {}
    for rel in sorted(changed):
        if rel.endswith('.html'):
            accepted[hybrid.file_route(rel)] = {
                'scope': 'existing-page-audit-repair',
                'baseline_html_sha256': before.get(rel, {}).get('sha256'),
                'candidate_html_sha256': after[rel]['sha256'],
            }
        else:
            overlays[rel] = {'kind': 'audit_asset', 'before': before.get(rel), 'after': after[rel]}
    routes = sorted(set(previous['routes']) | {
        hybrid.file_route(rel) for rel in after if rel.endswith('/index.html') or rel == 'index.html'
    })
    mappings = reports.get('navigation', {}).get('temporary_href_mappings')
    if mappings is None:
        mappings = reports.get('navigation', {}).get('mappings', previous.get('temporary_href_mappings', []))
    manifest = {
        'schema': 'wly.hybrid-release.v1',
        'release_id': hashlib.sha256(json.dumps(after, sort_keys=True).encode()).hexdigest(),
        'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'rollback_ref': baseline_ref,
        'baseline_production_commit': baseline_ref,
        'baseline_files': before,
        'routes': routes,
        'accepted_pages': accepted,
        'rejected_pages': {},
        'temporary_href_mappings': mappings,
        'release_overlay': overlays,
        'files': after,
        'audit_repair': {
            'schema': 'wly.site-audit-repair.v1',
            'baseline_release_id': previous['release_id'],
            'baseline_input_kind': 'complete_runtime_staging' if runtime_baseline else 'exact_release',
            'changed_html': len(accepted),
            'changed_assets': len(overlays),
            'image_design_changed': False,
            'publication_performed': False,
        },
    }
    hybrid.write(output / hybrid.MANIFEST, manifest)
    hybrid.verify_release(output)
    return manifest


def prepare(args):
    baseline = args.baseline.resolve()
    output = args.output.resolve()
    if output.exists() or output.is_relative_to(baseline) or baseline.is_relative_to(output):
        raise ValueError('Choose a fresh output directory disjoint from its baseline')
    hybrid = module('hybrid-release')
    previous = verify_input_baseline(baseline,args.baseline_ref,args.runtime_baseline)
    shutil.copytree(baseline, output)
    reports = {}
    reports['publication'] = module('audit-page-publication').apply_release(
        output, coverage=args.body_coverage, home_source=args.home_source,
        home_receipt=args.home_receipt, omit_local_paths=True,
    )
    reports['navigation'] = module('repair-release-navigation').apply(output, manifest=previous)
    reports['live'] = module('update-live-release').update_release(output)
    reports['public_fields'] = module('audit-page-publication').finalize_public_fields(output)
    if reports['public_fields'].get('remaining_local_literals'):
        raise ValueError('Public HTML or search still contains local/internal literals')
    manifest = finalize_release(baseline, output, reports, args.baseline_ref,args.runtime_baseline)
    report = {
        'schema': 'wly.site-audit-preparation.v1',
        'prepared_at_beijing': manifest['prepared_at_beijing'],
        'baseline_release_id': previous['release_id'],
        'release_id': manifest['release_id'],
        'changed_html': manifest['audit_repair']['changed_html'],
        'changed_assets': manifest['audit_repair']['changed_assets'],
        'checks': reports,
    }
    if args.report:
        hybrid.write(args.report, report)
    print(json.dumps({key: report[key] for key in ('schema', 'release_id', 'changed_html', 'changed_assets')}))
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--body-coverage', type=Path, required=True)
    parser.add_argument('--home-source', type=Path, required=True)
    parser.add_argument('--home-receipt', type=Path, required=True)
    parser.add_argument('--baseline-ref')
    parser.add_argument('--runtime-baseline',action='store_true',help='Verify complete local runtime source against the published OSS Git manifest')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    prepare(args)


if __name__ == '__main__':
    main()
