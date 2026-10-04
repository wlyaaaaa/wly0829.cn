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


def module(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), HERE / (name + '.py'))
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


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
    published=json.loads(subprocess.check_output(['git','show',baseline_ref+':site-release/'+hybrid.MANIFEST],cwd=HERE.parent))
    oss=module('prepare-oss-release')
    oss.verify_manifest(published)
    cloud=published['oss']
    if previous.get('release_id')!=cloud['source_release_id']:
        raise ValueError('Runtime staging is not the published OSS source version')
    if set(files)!=set(published['files'])|set(cloud['objects']):
        raise ValueError('Runtime staging must contain every published HTML and source asset')
    rewrite=oss.Rewriter(files,cloud['asset_base_url'],cloud['prefix'],'https://wly0829.cn',version=cloud.get('rewriter_version',1))
    home,_=oss.current_home_links(baseline)
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
