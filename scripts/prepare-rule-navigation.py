"""Freeze exact old workbench references and verify their new original-screen targets."""
from __future__ import annotations
import argparse
import importlib.util
import json
from pathlib import Path
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import rule_original_contract as contract

TOPICS={'agents_root_rules':'charter','authorization_contract':'rule-authorization',
        'capabilities_runtime_contract':'rule-capabilities-runtime','claude_adapter_contract':'rule-claude-adapter',
        'codex_adapter_contract':'rule-codex-adapter','context_sources_contract':'rule-context-sources',
        'engineering_delivery_contract':'rule-engineering-delivery','execution_coordination_contract':'rule-execution-coordination',
        'privacy_data_contract':'rule-privacy-data','protected_actions_contract':'rule-protected-actions',
        'rule_release_contract':'rule-rule-release'}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--references',type=Path,required=True)
    parser.add_argument('--output',type=Path,default=HERE.parent/'config/rule-navigation-mappings.json')
    parser.add_argument('--root',type=Path,help='Actual mixed release with all new rule original screens')
    parser.add_argument('--apply',action='store_true')
    parser.add_argument('--report',type=Path)
    args=parser.parse_args();source=json.loads(args.references.read_text('utf8'))
    pin=contract.load_pin(HERE.parent);excerpts=pin['excerpt_contract']['excerpts'];entries={}
    for logical,page in TOPICS.items():
        first=min((entry for entry in excerpts.values() if entry['page']==page),key=lambda item:item['screen'])
        route='/rules/charter/' if page=='charter' else '/rules/'+page.removeprefix('rule-')+'/'
        target=route+'#'+first['screen']
        entries['/rules/?rule='+logical+'#rule-panel-'+logical]={'target':target,'excerpt_id':page+'/'+first['screen']}
        entries['/rules/?rule='+logical+'#rule-tab-'+logical]={'target':target,'excerpt_id':page+'/'+first['screen']}
    references=[]
    for row in source['references']:
        mapping=entries.get(row['reference'])
        if not mapping:raise ValueError('Unmapped legacy reference in frozen report')
        references.append({**row,'target':mapping['target'],'excerpt_id':mapping['excerpt_id']})
    if len(references)!=source['reference_count'] or len({row['reference'] for row in references})!=source['unique_target_count']:
        raise ValueError('Frozen reference inventory count is inconsistent')
    result={'schema':'wly.rule-navigation-mappings.v1','version':pin['version'],
            'source_report_sha256':source['source_report_sha256'],'source_reference_inventory_sha256':contract.sha_bytes(args.references.read_bytes()),
            'pin_sha256':contract.sha_bytes((HERE.parent/'config/assembled-rules-pin.json').read_bytes()),
            'reference_count':len(references),'unique_target_count':len({row['reference'] for row in references}),
            'entries':entries,'references':references}
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    if args.root:
        spec=importlib.util.spec_from_file_location('rule_navigation',HERE/'repair-release-navigation.py')
        nav=importlib.util.module_from_spec(spec);spec.loader.exec_module(nav)
        changed=nav.restore_pending_links(args.root,nav.page_inventory(args.root)) if args.apply else []
        pages=nav.page_inventory(args.root);checked=[{**row,'target_exists':nav.target_exists(row['target'],pages)} for row in references]
        missing=[row for row in checked if not row['target_exists']]
        receipt={'schema':'wly.rule-navigation-verification.v1','status':'block' if missing else 'pass',
                 'mapping_sha256':contract.sha_bytes(args.output.read_bytes()),'changed_files':changed,
                 'reference_count':len(checked),'unique_target_count':result['unique_target_count'],'references':checked}
        if args.report:
            args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
        if missing:raise ValueError('Legacy rule mappings do not all point to existing new original screens')
    print(json.dumps({'status':'pass','reference_count':len(references),'unique_target_count':result['unique_target_count']},ensure_ascii=False))

if __name__=='__main__':main()
