"""Independently pin verified E-rule sources and the approved original excerpts."""
from __future__ import annotations
import argparse
import importlib.util
import json
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))
import rule_original_contract as contract


def generate(release_root, record_sha256):
    release_root = Path(release_root).resolve()
    record_path = release_root / 'release.json'
    if contract.sha_bytes(record_path.read_bytes()) != record_sha256:
        raise ValueError('Release record does not match verified Inspect evidence')
    record = json.loads(record_path.read_text('utf8'))
    if record.get('release_id') != 'E214' or record.get('remote_main_contains_commit') is not True:
        raise ValueError('Expected the verified, formally released E214 source')
    entries = {entry['relative_path']: entry for entry in record['files']}
    spec = importlib.util.spec_from_file_location('independent_rule_builder', HERE / 'build-assembled-site.py')
    builder = importlib.util.module_from_spec(spec); spec.loader.exec_module(builder)
    documents = {}; selected = {}; resources = {}
    for page in ['charter', *contract.RANGES]:
        relative = contract.document_for_page(page)
        entry = entries[relative]
        raw_bytes = (release_root / relative).read_bytes()
        if len(raw_bytes) != entry['bytes'] or contract.sha_bytes(raw_bytes) != entry['sha256']:
            raise ValueError('Fixed source bytes do not match release inventory: ' + relative)
        raw = raw_bytes.decode('utf-8-sig')
        public = contract.public_markdown(raw, relative)
        public_sha = contract.sha_bytes(public.encode('utf8'))
        published_body = (public[public.index('## 我的 AI 约法'):public.index('## 每次都要做的几件事')]
                          if relative == 'AGENTS.md' else public)
        documents[relative] = {
            'source_sha256': entry['sha256'], 'source_bytes': entry['bytes'],
            'public_source_sha256': public_sha,
            'rendered_text_sha256': builder.prose_digest(contract.render_markdown(published_body), True),
            'complete_rendered_text_sha256': builder.prose_digest(contract.render_markdown(public), True),
            'approved_omitted_count': len(contract.OMISSIONS.get(relative, [])),
            'public_projection': 'approved-source-omissions-and-local-literals-v1',
            'basis': '独立核验 E214 清单中的完整来源；从固定来源及既有批准范围生成摘要，未读取候选正文',
        }
        resources['/_typeset/rule-sources/' + public_sha + '.md'] = {
            'relative_file': relative, 'source_sha256': entry['sha256'], 'public_source_sha256': public_sha}
        for identity, markdown_text, selection in contract.excerpts(raw, page):
            projected = contract.public_markdown(markdown_text, relative, apply_omissions=False)
            selected[identity] = {
                'page': page, 'screen': identity.split('/')[-1], 'relative_file': relative,
                'source_sha256': entry['sha256'], 'selection': selection,
                'approved_omitted_count': len(selection['approved_omissions']),
                'rendered_text_sha256': builder.prose_digest(contract.render_markdown(projected), True),
                'markdown_sha256': contract.sha_bytes(projected.encode('utf8')),
                'heading_aliases': (contract.charter_heading_aliases(raw,*selection['articles'])
                                    if page=='charter' else contract.source_heading_aliases(projected)),
            }
    for relative in ('templates/claude-home/CLAUDE.md', 'templates/codex-home/AGENTS.md'):
        entry = entries[relative]; raw = (release_root / relative).read_bytes()
        if contract.sha_bytes(raw) != entry['sha256']:
            raise ValueError('Entry template differs from verified release inventory')
        public = contract.public_markdown(raw.decode('utf8'), relative)
        resources['/rule-sources/' + relative] = {
            'relative_file': relative, 'source_sha256': entry['sha256'],
            'public_source_sha256': contract.sha_bytes(public.encode('utf8'))}
    return {
        'schema': 'wly.assembled-rules-pin.v2', 'version': record['release_id'],
        'release_commit': record['git_commit'], 'release_record_sha256': record_sha256,
        'ruleset_sha256': record['ruleset_sha256'], 'documents': documents,
        'excerpt_contract': {'id': contract.CONTRACT, 'excerpts': selected},
        'public_source_resources': resources,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-root', required=True, type=Path)
    parser.add_argument('--verified-record-sha256', required=True)
    parser.add_argument('--output', type=Path, default=HERE.parent / 'config/assembled-rules-pin.json')
    args = parser.parse_args()
    pin = generate(args.release_root, args.verified_record_sha256)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(pin, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps({'status': 'pass', 'version': pin['version'], 'documents': len(pin['documents']),
                      'excerpts': len(pin['excerpt_contract']['excerpts'])}, ensure_ascii=False))


if __name__ == '__main__':
    main()
