from datetime import date, datetime
from pathlib import Path
from runpy import run_path
from types import SimpleNamespace

from scripts import live_project


AT = '2026-11-18T01:00:00+08:00'


def test_visitors_use_only_successfully_published_routes(tmp_path, monkeypatch):
    live_project.save(tmp_path, 'publication', {}, AT, '', routes=['/old/'])
    live_project.save(tmp_path, 'build', {}, AT, '', routes=['/draft/'])
    public = tmp_path / '.live/public.json'
    assert live_project.read(public)['build_routes'] == ['/draft/']
    assert live_project.read(public)['published_routes'] == ['/old/']
    monkeypatch.setattr(live_project.subprocess, 'run', lambda *a, **kw: SimpleNamespace(returncode=0, stdout=str(tmp_path)))
    pointer = tmp_path / 'wly-oss/published.json'
    live_project.write(pointer, dict(schema='wly.site-publication.v1', deployment=True, manifest={'routes': ['/new/', '/cv/', '/cv/live/']}))
    pages = {'/new/': 2, '/old/': 3, '/draft/': 3, '/cv/': 1, '/cv/live/': 1}
    daily = [dict(date='2026-11-18', coverage='observed_partial', unique_visitors=5, pageviews=10)]
    result = dict(start='2026-11-12', end='2026-11-18', count_scope='external_only', top_pages=pages, daily=daily, device_classes={},
                  total=dict(unique_visitors=5, pageviews=10), visitor_cohorts=dict(first_observed_in_window=5, returning_observed_before_window=0),
                  page_dwell={p: dict(observed_seconds=10, unknown_opens=0) for p in pages}, navigation_timing_ms={},
                  ai_crawler_lower_bound={'by_ua': {}}, entry={'cv': {'unique_visitors': 1}})
    live_project.visitors(tmp_path, result, AT)
    metrics = live_project.read(public)['metrics']
    assert {r['page']: r['opens'] for r in metrics['top_pages']} == {'/new/': 2, '其他地址': 8}
    assert [r['page'] for r in metrics['dwell']] == ['/new/']
    live_project.save(tmp_path, 'publication', {}, '2026-11-18T02:00:00+08:00', '', routes=[])
    metrics = live_project.read(public)['metrics']
    assert [(r['page'], r['opens']) for r in metrics['top_pages']] == [('其他地址', 10)]
    assert metrics['dwell'] == []


def test_visitor_days_start_at_beijing_launch_date_and_keep_log_coverage(tmp_path, monkeypatch):
    query = run_path(str(Path(__file__).resolve().parents[1] / 'tools/query-site-visitors.py'))
    launch_at = datetime.fromisoformat('2026-11-17T23:00:00+00:00')
    self_visit = query['parse_sls_row'](dict(
        __time__=str(launch_at.timestamp()), client_ip='203.0.113.1',
        user_agent='Mozilla/5.0 Chrome/142.0.0.0', request_id='self-visit',
        request_uri='/_v.gif?x-v=self&x-self=1&x-audience=internal&x-event=view', http_method='GET', http_status='200',
        bucket=query['SOURCE'], operation='GetObject'))
    result = query['analyze']([], date(2026, 11, 13), date(2026, 11, 19),
                              extra_records=[self_visit], launch_at=launch_at, external_only=True)
    result['site_scope'] = {'launch_at': launch_at}
    monkeypatch.setattr(live_project, 'published_routes', lambda *_: set())
    live_project.visitors(tmp_path, result, '2026-11-19T08:00:00+08:00')

    for audience in ('public', 'owner'):
        daily = live_project.read(tmp_path / '.live' / f'{audience}.json')['metrics']['daily']
        assert [row['date'] for row in daily] == ['2026-11-18', '2026-11-19']
        unverified, missing = daily
        assert unverified['coverage'] == 'network_unverified'
        assert (unverified['visitors'], unverified['pageviews']) == (None, None)
        assert unverified['text'] == '2026-11-18：未能核对内网出口'
        assert missing['coverage'] == 'no_logs'
        assert (missing['visitors'], missing['pageviews']) == (None, None)
        assert missing['state_text'] == '没有日志'
        assert missing['text'] == '2026-11-19：没有日志'
        assert (missing['q'], missing['gap']) == ('partial', '没有日志')
    result['daily'] = [dict(date='2026-11-19', coverage='no_logs')]
    live_project.visitors(tmp_path, result, '2026-11-19T09:00:00+08:00')
    snapshot = live_project.read(tmp_path / '.live/public.json')
    assert snapshot['count_scope'] == 'external_only'
    assert all(snapshot['metrics'][key] is None for key in ('visitors', 'pageviews', 'devices', 'top_pages'))


def test_older_event_cannot_overwrite_either_view(tmp_path):
    artifact = dict(kind='local-build', public='owner', title='new')
    live_project.save(tmp_path, 'build', {'pages': 10}, AT, 'new', artifact, 'new', ['/new/'])
    views = [tmp_path / '.live' / f'{audience}.json' for audience in ('public', 'owner')]
    before = [path.read_bytes() for path in views]
    live_project.save(tmp_path, 'build', {'pages': 1}, '2026-11-18T06:00:00+14:00', 'old', dict(artifact, title='old'), 'old', ['/old/'])
    assert [path.read_bytes() for path in views] == before
