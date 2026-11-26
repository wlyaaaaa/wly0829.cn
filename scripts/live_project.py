"""Small event-time results from the existing build, publication and visitor producers."""
from collections import Counter
from datetime import datetime, timedelta, timezone
import json
import msvcrt
from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory
import xml.etree.ElementTree as ET


BEIJING = timezone(timedelta(hours=8))
DASHBOARD_REGISTRY = Path('E:/PCConfig/registries/dashboard_sources.json')


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    temporary.replace(path)


def read_live_paths(root, *, require_registered=False, registered_paths=None):
    config = Path(root) / '.publish/private/live-project.json'
    paths = registered_paths if registered_paths is not None else read(config) if config.is_file() else {}
    if require_registered:
        registered = [paths.get(audience) for audience in ('public', 'owner')] if isinstance(paths, dict) else []
        if not registered or not all(isinstance(path, str) and Path(path).is_absolute() for path in registered):
            raise ValueError(f'{config} 须登记实况 public 和 owner 两个绝对路径')
        if Path(registered[0]).resolve() == Path(registered[1]).resolve():
            raise ValueError(f'{config} 的实况 public 和 owner 须写入不同文件')
    return paths


def dashboard_paths():
    sources = read(DASHBOARD_REGISTRY)['project_sources']['wlyaaaaa/wly0829.cn']['sources']
    return {audience: sources[f'website.{audience}']['path'] for audience in ('public', 'owner')}


def point_build_alias(index, folder):
    if not index.is_file():
        raise FileNotFoundError(index)
    alias = folder / 'local-build'
    if alias.is_symlink() and alias.resolve() == index.parent:
        return
    with TemporaryDirectory(dir=folder, prefix='.local-build-') as temporary:
        link = Path(temporary) / 'target'
        link.symlink_to(index.parent, target_is_directory=True)
        previous = Path(temporary) / 'previous'
        if alias.is_symlink():
            alias.rename(previous)
        try:
            link.rename(alias)
        except OSError:
            if previous.is_symlink():
                previous.rename(alias)
            raise


def save(root, kind, metrics, at, scope, artifact=None, version=None, routes=(), *,
         visitor_launch_at=None, require_registered=False, registered_paths=None, build_index=None):
    paths = read_live_paths(root, require_registered=require_registered, registered_paths=registered_paths)
    lock = Path(paths.get('public') or Path(root) / '.live/public.json').with_suffix('.lock')
    lock.parent.mkdir(parents=True, exist_ok=True)
    with lock.open('a+b') as handle:
        handle.write(b' ')
        handle.seek(0)
        msvcrt.locking(handle.fileno(), msvcrt.LK_LOCK, 1)
        try:
            if kind == 'visitors':
                metrics = visitor_metrics(metrics, published_routes(root, paths))
            save_views(root, paths, kind, metrics, at, scope, artifact, version, routes, visitor_launch_at, build_index)
        finally:
            handle.seek(0)
            msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)


def save_views(root, paths, kind, metrics, at, scope, artifact, version, routes, visitor_launch_at=None, build_index=None):
    for audience in ('public', 'owner'):
        path = Path(paths.get(audience) or Path(root) / '.live' / (audience + '.json'))
        data = read(path) if path.is_file() else dict(v=1, metrics={}, times={}, scopes={}, artifacts=[], versions={})
        first_new_era = False
        if kind == 'visitors':
            recorded_era = data.get('visitor_launch_at')
            if recorded_era and recorded_era != visitor_launch_at:
                raise ValueError('实况已有新站访客统计，拒绝其他分界的查询结果')
            first_new_era = bool(visitor_launch_at and not recorded_era)
            first_new_era |= data.get('count_scope') != 'external_only'
            data['count_scope'] = 'external_only'
        previous = data['times'].get(kind)
        if not first_new_era and previous and datetime.fromisoformat(at) < datetime.fromisoformat(previous):
            continue
        if first_new_era:
            data['visitor_launch_at'] = visitor_launch_at
        data.update(scope='已完成版本和上次访客查询；不是当前公网探测。')
        data['times'][kind], data['scopes'][kind] = at, scope
        data['metrics'].update(metrics)
        data.pop('routes', None)
        if kind == 'build':
            data['build_routes'] = sorted(set(routes))
            if audience == 'owner' and build_index:
                point_build_alias(build_index, path.parent)
                data['build_index'] = str(build_index)
        if kind == 'publication':
            routes = set(routes)
            data['published_routes'] = sorted(routes)
            if data['metrics'].get('top_pages') is not None:
                data['metrics']['top_pages'] = top_pages(((r['page'], r['opens']) for r in data['metrics']['top_pages']), routes)
            if data['metrics'].get('dwell') is not None:
                data['metrics']['dwell'] = [r for r in data['metrics']['dwell'] if public_page(r['page'], routes) != '其他地址']
        if version is not None:
            data['versions'][kind] = version
            if data['versions'].get('build'):
                text = data['times']['build'][:16].replace('T', ' ').removeprefix('2026-') + (' 组装好，这版已发布' if data['versions'].get('publication') == data['versions']['build'] else ' 组装好，尚未发布')
                data['metrics']['local_build'] = text
                build_at = data['times']['build']
                data['times']['version'] = max(build_at, data['times'].get('publication', build_at), key=datetime.fromisoformat)
                data['scopes']['version'] = '成功组装时刻和成功发布基线指纹对照。'
        if artifact:
            data['artifacts'] = [a for a in data['artifacts'] if a['kind'] != artifact['kind']]
            if audience == 'owner' or artifact['public'] == 'same':
                data['artifacts'].append(artifact)
        if audience == 'public':
            data['metrics'].pop('cv_visitors', None)
        data['at'] = max(data['times'].values(), key=datetime.fromisoformat)
        write(path, data)


def package(manifest, prefix):
    files, oss = manifest['files'], manifest['oss']
    images = [o for o in oss['objects'].values() if o['content_type'].startswith('image/')]
    references = set(oss['reference_keys'])
    used = [o for o in images if o['key'] in references]
    return {prefix + key: value for key, value in dict(
        html_files=sum(k.endswith('.html') for k in files), images=len(images), used_images=len(used),
        image_bytes=sum(o['bytes'] for o in images), used_image_bytes=sum(o['bytes'] for o in used),
        resource_bytes=sum(o['bytes'] for o in oss['objects'].values()), index_bytes=files['index.html']['bytes']).items()}


def build(root, dist, receipt, *, record_local=False):
    if receipt.get('status') != 'built':
        return
    manifest = read(dist / 'release-manifest.json')
    table = Path(root) / 'site-v2/trial/first-projects/表/归属表.md'
    block = table.read_text('utf-8-sig').split('## 技能表', 1)[1].split('\n## ', 1)[0]
    rows = [[c.strip() for c in line.strip('| ').split('|')] for line in block.splitlines() if line.startswith('|')]
    skills = [dict(zip(rows[0], row)) for row in rows[2:]]
    metrics = package(manifest, 'build_') | dict(build_seconds=receipt['seconds'],
        build_redirects=len(receipt['legacy_redirects']),
        pages=len(ET.parse(dist / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')),
        projects=sum(k.endswith('/project.html') for k in manifest['files']),
        skills=sum(r['状态'] == '做完' for r in skills))
    at = datetime.fromisoformat(receipt['prepared_at_beijing']).astimezone(BEIJING).isoformat()
    artifact = dict(at=at, kind='local-build', title=f"本地组装完成：{metrics['pages']} 个正式页面",
        recent_title='网站本地组装成品', recent_detail=f"这次组装输出了 {metrics['pages']} 个正式页面。",
        status='completed', public='owner', open=dict(source='website.build-ready'))
    save(root, 'build', metrics, at, '本地成品；含已冻结项目的既成页面，图片按亮暗及尺寸分别计文件。',
         artifact, manifest['release_id'], manifest['routes'], require_registered=record_local,
         registered_paths=dashboard_paths() if record_local else {}, build_index=(dist / 'index.html').resolve(strict=True) if record_local else None)


def publication(root, record):
    if record.get('schema') != 'wly.site-publication.v1' or not record.get('deployment'):
        return
    at = datetime.fromisoformat(record['verified_at_beijing']).astimezone(BEIJING).isoformat()
    manifest = record['manifest']
    metrics = package(manifest, 'published_') | dict(published=at[:16].replace('T', ' ').removeprefix('2026-') + ' 成功发布并回读')
    artifact = dict(at=at, kind='published-site', title=f"已发布网站：{metrics['published_html_files']} 个 HTML 文件",
        recent_title='已发布的网站', recent_detail=f"本次发布包含 {metrics['published_html_files']} 个网页文件，入口可查看网站首页。",
        status='completed', public='same', open=dict(source='website.published-ready', href='https://wly0829.cn/'))
    save(root, 'publication', metrics, at, '上次成功发布基线；HTML 文件含跳转和功能页，不等于正文篇数。',
         artifact, manifest['release_id'], manifest['routes'], require_registered=True, registered_paths=dashboard_paths())


def published_routes(root, paths):
    git = subprocess.run(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'],
                         cwd=root, capture_output=True, text=True, encoding='utf-8')
    pointer = Path(git.stdout.strip()) / 'wly-oss/published.json'
    if git.returncode == 0 and pointer.is_file():
        baseline = read(pointer)
        if baseline.get('schema') == 'wly.site-publication.v1' and baseline.get('deployment'):
            return set(baseline['manifest']['routes'])
    public = Path(paths.get('public') or Path(root) / '.live/public.json')
    return set(read(public).get('published_routes', ())) if public.is_file() else set()


def public_page(name, routes):
    return name if name in routes and name.rstrip('/') not in {'/cv', '/cv/live'} else '其他地址'


def top_pages(counts, routes):
    pages = Counter()
    for name, count in counts:
        pages[public_page(name, routes)] += count
    return [dict(page=p, opens=n, text=f'{p}：打开 {n} 次', state_text='已观察到；日志覆盖不完整')
            for p, n in pages.most_common()]


def visitor_daily(result):
    launch_at = result.get('site_scope', {}).get('launch_at')
    launch_date = launch_at.astimezone(BEIJING).date().isoformat() if launch_at else None
    rows = []
    for row in result['daily']:
        day, coverage = row['date'], row['coverage']
        if launch_date and day < launch_date:
            continue
        if coverage != 'observed_partial':
            gap = {'before_external_scope': '该日尚未按新口径统计', 'network_unverified': '未能核对内网出口'}.get(coverage, '没有日志')
            rows.append(dict(date=day, coverage=coverage, visitors=None, pageviews=None,
                             text=f'{day}：{gap}', state_text=gap, q='partial', gap=gap))
            continue
        visitors, pageviews = row['unique_visitors'], row['pageviews']
        rows.append(dict(date=day, coverage=coverage, visitors=visitors, pageviews=pageviews,
                         text=f'{day}：来访 {visitors}，打开 {pageviews} 次', state_text='已观察到；日志覆盖不完整'))
    return rows


def visitor_metrics(result, routes):
    if result.get('count_scope') != 'external_only':
        raise ValueError('实况只接受站外来访口径')
    daily = visitor_daily(result)
    if not any(r['coverage'] == 'observed_partial' for r in daily):
        return dict.fromkeys('visitors pageviews top_pages devices cohorts dwell speed crawlers cv_visitors'.split()) | dict(daily=daily)
    records = lambda rows: [dict(row, state_text='已观察到；日志覆盖不完整') for row in rows]
    metrics = dict(visitors=result['total']['unique_visitors'], pageviews=result['total']['pageviews'],
        daily=daily,
        top_pages=top_pages(result['top_pages'].items(), routes),
        devices=dict(result['device_classes'], text='、'.join(f'{k} {v} 次' for k, v in result['device_classes'].items())),
        cohorts=dict(result['visitor_cohorts'], text=f"窗口内首次观察 {result['visitor_cohorts']['first_observed_in_window']}，更早观察过 {result['visitor_cohorts']['returning_observed_before_window']}"),
        dwell=records([dict(page=p, text=f"{p}：已观察停留 {v['observed_seconds']} 秒，{v['unknown_opens']} 次停留未知", **v) for p, v in result['page_dwell'].items() if public_page(p, routes) != '其他地址']),
        speed=records([dict(group=g, text=g + '：' + '、'.join(f"{label} {v[key]['median']} 毫秒（{v[key]['samples']} 个样本）" for key, label in (('ttfb','首字节'),('dom','DOM 完成'),('load','load 完成')) if key in v), **v) for g, v in result['navigation_timing_ms'].items()]) or None,
        crawlers=records([dict(ua=k, text=f"{k}：至少 {v['requests']} 次，" + '、'.join(f'{d} {n} 次' for d,n in v['dates'].items()), **v) for k, v in result['ai_crawler_lower_bound']['by_ua'].items()]))
    return metrics | dict(cv_visitors=result['entry']['cv']['unique_visitors'])


def visitors(root, result, at, *, require_registered=False, registered_paths=None):
    scope = f"仅计站外来访，{result['start']} 至 {result['end']}，截至 {at}，按浏览器去重。零记录不证明零来访。"
    launch_at = result.get('site_scope', {}).get('launch_at')
    if launch_at:
        scope = f'新站自 {launch_at.isoformat()} 起统计。' + scope
    save(root, 'visitors', result, at, scope, visitor_launch_at=launch_at.isoformat() if launch_at else None,
         require_registered=require_registered, registered_paths=registered_paths)


def record(kind, *args, **kwargs):
    try:
        globals()[kind](*args, **kwargs)
    except (OSError, ValueError, KeyError, IndexError) as error:
        print(json.dumps(dict(live_snapshot='failed', producer=kind, error_type=type(error).__name__)), file=__import__('sys').stderr)
