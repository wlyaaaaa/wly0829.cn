"""同一无窗口 Chrome 串行补性能；每项复用同输入的已过静态证据。

python tools/performance_batch.py art1 art2 --orient h --category white-single
python tools/performance_batch.py --manifest jobs.json
manifest: [{"art":"...","page":"...","orient":"h","category":"full"}, ...]

仅当合同明确写明 page/v 插画未测量、page/h 已测量时，单个 full h job 可设
"phone_preview_orientation":"h"：phone 4x 仍使用 v 手机视口与节流，只加载同页真实 h 预览。
该 job-scoped 路由会记录输入路径、实际路径与本工具SHA；其余测量不变。
"""
import argparse
import json
import hashlib
import time
from pathlib import Path

import browser
import check
import common
from playwright.sync_api import sync_playwright


def _phone_route_for_job(job, art, page, orient, category):
    """手机页只在合同明确未测量v、但测量h时，容许h预览运行在手机视口。"""
    if 'phone_preview_orientation' not in job:
        return None
    actual = job['phone_preview_orientation']
    if actual != 'h':
        raise ValueError('phone_preview_orientation 目前只允许显式指定 h')
    if orient != 'h' or category != 'full':
        raise ValueError('手机预览覆盖只适用于 full 类 h 方向性能项')
    if common.art_of_page(page) != art:
        raise ValueError('手机预览覆盖的 art/page 合同映射不匹配')
    try:
        horizontal = common.screen(page, 'h')
        vertical = common.screen(page, 'v')
    except KeyError as error:
        raise ValueError(f'手机预览覆盖要求合同中同时有 h 和 v 条目：{error}') from error
    if horizontal.get('illustration', {}).get('status') != 'measured' or not common.measured(page, 'h'):
        raise ValueError('手机预览覆盖要求 h 插画框在合同中实测')
    if vertical.get('illustration', {}).get('status') != 'unmeasured' or common.measured(page, 'v'):
        raise ValueError('手机预览覆盖只允许 v 插画框在合同中明确标为 unmeasured')
    return {
        'page': page,
        'contract': {
            'h_illustration_status': horizontal.get('illustration', {}).get('status'),
            'v_illustration_status': vertical.get('illustration', {}).get('status'),
        },
        'requested_preview_orientation': 'v',
        'actual_preview_orientation': actual,
        'requested_preview_path': str((common.ART / art / 'preview' / f'{page}-v.html').resolve()),
        'actual_preview_path': str((common.ART / art / 'preview' / f'{page}-h.html').resolve()),
        'viewport_config': dict(browser.LAYOUTS['v']),
        'cpu_throttling_rate': 4,
        'adapter_method': 'job-scoped check._fresh wrapper; only v+CPU4x path is remapped and restored in finally',
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('arts', nargs='*')
    ap.add_argument('--manifest')
    ap.add_argument('--orient', choices=['h', 'v', 'both'], default='both')
    ap.add_argument('--category', choices=['full', 'white-single'], default='full')
    ap.add_argument('--report')
    ap.add_argument('--guard-proof')
    args = ap.parse_args()
    if bool(args.arts) == bool(args.manifest):
        ap.error('传画名列表或 --manifest，二者选一')
    if args.manifest:
        from pathlib import Path
        jobs = json.loads(Path(args.manifest).read_text(encoding='utf-8'))
    else:
        jobs = []
        for name in args.arts:
            art = name if name in common.art_table() else common.art_of_page(name)
            page = name if name != art else common.art_table()[art]['pages'][0]
            for orient in (('h', 'v') if args.orient == 'both' else (args.orient,)):
                jobs.append({'art': art, 'page': page, 'orient': orient, 'category': args.category})
    if sum('phone_preview_orientation' in job for job in jobs) > 1:
        raise ValueError('phone_preview_orientation 覆盖为单 job 所有权，一批最多一项')
    # 先检查静态证据与手机路由合同，不为必然拒绝的批次占用性能窗口。
    phone_routes = []
    for job in jobs:
        art = job['art']
        page = job.get('page') or common.art_table()[art]['pages'][0]
        orient = job['orient']
        category = job.get('category', 'full')
        if orient not in ('h', 'v') or category not in ('full', 'white-single'):
            raise ValueError(f'无效批测项：{job}')
        phone_routes.append(_phone_route_for_job(job, art, page, orient, category))
        path = common.ART / art / 'check' / f'{page}-{orient}-static.json'
        rep = json.loads(path.read_text(encoding='utf-8'))
        if not rep['acceptance']['passed'] or rep.get('input_fingerprint', {}).get('sha256') != check.input_fingerprint(art, page, orient)['sha256']:
            raise ValueError(f'静态证据已过时或未过：{path}')
    result = {'at_beijing': common.beijing_now(), 'scope': 'exclusive-performance-batch', 'jobs': []}
    started = time.monotonic()
    adapter_tool_sha256 = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    if any(phone_routes):
        result['phone_route_adapter_tool_sha256'] = adapter_tool_sha256
    with sync_playwright() as pw, browser.managed(pw, scope='performance') as br:
        for job, route_spec in zip(jobs, phone_routes):
            art = job['art']
            page = job.get('page') or common.art_table()[art]['pages'][0]
            t0 = time.monotonic()
            route_state = {'applied': False} if route_spec else None
            original_fresh = None
            try:
                if route_spec:
                    original_fresh = check._fresh
                    expected_v = Path(route_spec['requested_preview_path']).resolve()
                    actual_h = Path(route_spec['actual_preview_path']).resolve()
                    if not actual_h.is_file():
                        raise FileNotFoundError(f'实测 h 手机预览不存在：{actual_h}')

                    def routed_fresh(current_br, path, orientation, cpu_rate=None):
                        if orientation == 'v' and cpu_rate == 4 and Path(path).resolve() == expected_v:
                            if route_state['applied']:
                                raise RuntimeError('手机预览路由被调用多于一次')
                            route_state['applied'] = True
                            # 保留 orientation='v' 的手机视口/DPR/touch/CPU4x，只切换到该页实际测量的 h 画面。
                            return original_fresh(current_br, actual_h, orientation, cpu_rate)
                        return original_fresh(current_br, path, orientation, cpu_rate)

                    check._fresh = routed_fresh
                try:
                    rep = check.run(art, page, job['orient'], stage='performance', category=job.get('category', 'full'), br=br,
                                    guard_proof=job.get('guard_proof') or args.guard_proof)
                finally:
                    if original_fresh is not None:
                        check._fresh = original_fresh
                route_metadata = None
                if route_spec:
                    if not route_state['applied']:
                        raise RuntimeError('手机预览适配器未命中预定的 v/CPU4x 路径')
                    route_metadata = {
                        'schema': 'living.phone-preview-route.v1',
                        **route_spec,
                        'adapter_applied': True,
                        'adapter_tool_sha256': adapter_tool_sha256,
                    }
                    rep['phone_measurement_route'] = route_metadata
                    rep['performance']['phone_measurement_route'] = route_metadata
                    # check.run 已写出官方报告；补入实际手机路由与适配器SHA后原位回写。
                    check._write_report(rep, '-performance')
                    check._write_report(rep)
                    print(f"手机4x预览路由：{route_spec['requested_preview_orientation']} → {route_spec['actual_preview_orientation']}（v手机视口保持不变）", flush=True)
                print(check.summary(rep), flush=True)
                record = {**job, 'wall_seconds': round(time.monotonic() - t0, 3), 'acceptance': rep['acceptance']}
                if route_metadata:
                    record['phone_measurement_route'] = route_metadata
                result['jobs'].append(record)
            except Exception as error:
                record = {**job, 'wall_seconds': round(time.monotonic() - t0, 3), 'error': str(error), 'acceptance': {'passed': False}}
                if route_spec:
                    record['phone_measurement_route'] = {
                        **route_spec,
                        'adapter_applied': route_state['applied'],
                        'adapter_tool_sha256': adapter_tool_sha256,
                    }
                result['jobs'].append(record)
                print(f'{art}/{page}/{job["orient"]} 补测失败：{error}', flush=True)
            finally:
                if original_fresh is not None and check._fresh is not original_fresh:
                    check._fresh = original_fresh
        br.close()
        result['resources'] = br._living_resource_state()
    result['wall_seconds'] = round(time.monotonic() - started, 3)
    result['passed'] = all(j['acceptance']['passed'] for j in result['jobs'])
    from pathlib import Path
    report = Path(args.report) if args.report else common.ENGINE / 'work' / 'performance-batch.json'
    report.parent.mkdir(parents=True, exist_ok=True)
    if report.exists():
        old = report.read_bytes()
        try:
            failed = not json.loads(old).get('passed', False)
        except (ValueError, TypeError):
            failed = True
        if failed:
            report.with_name(f'{report.stem}-prior-failed-{hashlib.sha256(old).hexdigest()[:16]}{report.suffix}').write_bytes(old)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(report, flush=True)
    if not result['passed']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
