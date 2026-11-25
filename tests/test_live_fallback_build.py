import importlib.util
import json
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest


spec = importlib.util.spec_from_file_location(
    'assembly', Path(__file__).resolve().parents[1] / 'site-v2/site-assembly/组装.py')
assembly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(assembly)


@pytest.mark.parametrize('mode', ['success', 'failure', 'unset', 'invalid', 'resources', 'missing',
                                  'partial', 'missing-home', 'old-policy'])
def test_live_fallback(tmp_path, monkeypatch, capsys, mode):
    monkeypatch.setattr(assembly, 'SITE', tmp_path)
    def check(data, *, require_metadata):
        assert require_metadata and data['metadata_only'] is True
    monkeypatch.setattr(assembly.live_fallback, 'load_exporter', lambda: SimpleNamespace(check_fallback_publication=check))
    out = tmp_path / 'live/_fallback.json'
    out.parent.mkdir()
    out.write_text('stale', encoding='utf-8')
    fake = tmp_path / 'fake.py'
    body = {'v': 1, 'at': '2026-11-16', 'viewer': {'kind': 'public'}, 'data': {}}
    publication = {'policy': 'policy-9' if mode == 'old-policy' else 'policy-11', 'audience': 'a'*64}
    payload = {'v': 1, 'at': body['at'], 'publication': publication, 'metadata_only': True,
               'resources': {'home': body, 'projects?state=frozen': body}}
    if mode == 'partial':
        payload['resources'].pop('projects?state=frozen')
    if mode == 'missing-home':
        payload['resources'].pop('home')
    text = 'broken' if mode == 'invalid' else json.dumps(
        {**payload, 'resources': []} if mode == 'resources' else payload)
    fake.write_text('import pathlib,sys\npathlib.Path(sys.argv[1]).write_text('
                    + repr(text) + ', encoding="utf-8")\nsys.exit('
                    + ('1' if mode == 'failure' else '0') + ')', encoding='utf-8')
    monkeypatch.setenv('WLY_LIVE_FALLBACK_CMD', f'"{sys.executable}" "{fake}" "{{out}}"')
    if mode == 'missing':
        monkeypatch.setenv('WLY_LIVE_FALLBACK_CMD', 'wly-no-such-export-command "{out}"')
    if mode == 'unset':
        monkeypatch.delenv('WLY_LIVE_FALLBACK_CMD')
    if mode in ('success', 'partial', 'unset'):
        assembly.build_live_fallback()
    else:
        with pytest.raises(SystemExit) as stopped:
            assembly.build_live_fallback()
        assert stopped.value.code not in (0, None)
        if mode == 'missing-home':
            assert '缺少入口 home' in str(stopped.value)
        if mode == 'old-policy':
            assert '需要 policy-11' in str(stopped.value)
    log = capsys.readouterr().out
    if mode in ('success', 'partial'):
        assert json.loads(out.read_text('utf-8')) == payload
        assert f'实况垫底文件：{len(payload["resources"])} 个资源，数据截止 2026-11-16' in log
    else:
        assert not out.exists()
        assert mode == 'unset' or '实况垫底文件没生成：' in log


def test_whole_build_checks_links_and_survives_record_failure(tmp_path, monkeypatch, capsys):
    from types import SimpleNamespace
    from unittest.mock import Mock
    root = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location('whole_build', root/'scripts/build-site.py')
    build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)
    runtime = build.load('unit_runtime', 'site-astro/tools/build_runtime.py')
    policy = build.load('unit_policy', 'scripts/site_public_words.py')
    monkeypatch.setattr(build, 'ROOT', tmp_path/'repo')
    monkeypatch.setattr(build, 'load', lambda name, rel: runtime if rel.endswith('build_runtime.py') else policy if rel.endswith('site_public_words.py') else assembly)
    def assemble(*args):
        folder = Path(args[args.index('--output') + 1]); (folder/'公用').mkdir(parents=True)
        (folder/'公用/页名到地址.json').write_text('{}', 'utf-8')
        (folder/'index.html').write_text('<h1>public</h1>', 'utf-8')
    monkeypatch.setattr(build, 'run', assemble)
    for name in ('legacy_routes', 'connect_cockpit', 'controls', 'visitors'):
        monkeypatch.setattr(build, name, lambda *args: {})
    def seal(folder, *args):
        runtime.oss.write(folder/'release-manifest.json', {'release_id': 'test'})
        runtime.oss.write(folder/'release-identity.json', {'release_id': 'test'})
        return {'source_commit': 'a'*40}, {}
    monkeypatch.setattr(build, 'seal', seal)
    record = Mock(side_effect=RuntimeError('record fixture failed'))
    monkeypatch.setitem(sys.modules, 'live_project', SimpleNamespace(record=record))
    checked = Mock(wraps=assembly.check_links); monkeypatch.setattr(assembly, 'check_links', checked)
    result = build.build(tmp_path/'output', full=True)
    assert result['status'] == 'built'
    assert json.loads((tmp_path/'output/.build-receipt.json').read_text('utf-8'))['status'] == 'built'
    checked.assert_called_once(); record.assert_called_once()
    assert '构建已成功，实况登记失败' in capsys.readouterr().err
    # The optional fallback may be absent. Page links warn, missing assets still fail.
    folder = tmp_path/'checks'; (folder/'公用').mkdir(parents=True); (folder/'live/_lib').mkdir(parents=True)
    (folder/'公用/页名到地址.json').write_text('{}', 'utf-8')
    (folder/'live/_lib/live-client.js').write_text("fetch('/release-identity.json')", 'utf-8')
    build.check_site_links(folder)
    (folder/'index.html').write_text('<a href="/missing/">broken</a><a href="https://wly0829.cn/retired.html">old</a>', 'utf-8')
    assert build.check_site_links(folder) == [
        ('index.html', '/missing/（文件不存在）'),
        ('index.html', 'https://wly0829.cn/retired.html（文件不存在）'),
    ]
    (folder/'index.html').write_text('<img src="/missing.png">', 'utf-8')
    with pytest.raises(ValueError, match='文件不存在'): build.check_site_links(folder)


def test_fallback_audience_changes_identity_and_object_without_changing_page(tmp_path):
    root = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location(
        'oss_prepare', root / 'scripts/prepare-oss-release.py')
    oss = importlib.util.module_from_spec(spec); spec.loader.exec_module(oss)
    spec = importlib.util.spec_from_file_location('preview', root / 'tools/preview_site.py')
    preview = importlib.util.module_from_spec(spec); spec.loader.exec_module(preview)
    records = []
    for generation in (1, 2):
        dist = tmp_path / str(generation)
        (dist / 'live').mkdir(parents=True)
        (dist / 'index.html').write_text('<main>same</main><script src="/reader.js"></script>', 'utf-8')
        (dist / 'reader.js').write_text("fetch('/release-identity.json')", 'utf-8')
        (dist / 'live/_fallback.json').write_text(json.dumps({'seq': 1, 'publication': {
            'policy': 'policy-11', 'audience': str(generation)*64}}), 'utf-8')
        oss.write(dist/oss.MANIFEST, {'schema': 'wly.hybrid-release.v1', 'release_id': str(generation),
                                     'files': oss.inventory(dist)})
        manifest = oss.finalize_dist(dist)
        identity = oss.read(dist/'release-identity.json')
        copy = identity['live_fallback']
        assert copy['origin'] + '/' + copy['key'] == manifest['oss']['objects']['live/_fallback.json']['url']
        assert copy['path'] == '/live/_fallback.json'
        path = dist / 'release-identity.json'
        preview.ROOT = dist
        assert preview.static_content(path, 'http://127.0.0.1:1234/', True) == path.read_bytes()
        records.append((copy['key'], manifest['oss']['objects']['reader.js']['key'],
                        (dist / 'index.html').read_bytes()))
    assert records[0][0] != records[1][0]
    assert records[0][1:] == records[1][1:]
