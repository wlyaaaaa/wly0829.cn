"""Compare two unpacked site runtimes in isolated Chrome. Requires Playwright, Pillow and NumPy."""
import argparse
import asyncio
import base64
from contextlib import AsyncExitStack
from datetime import datetime, timezone
from difflib import unified_diff
from email.utils import format_datetime
from hashlib import file_digest, sha256
from html import escape
from html.parser import HTMLParser
from io import BytesIO
import json
from pathlib import Path
import re
import sys
from tempfile import TemporaryDirectory
from time import monotonic
from urllib.parse import unquote, urldefrag, urljoin, urlsplit

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from playwright.async_api import Error, async_playwright

DESKTOP = dict(width=1440, height=900)
PHONE = dict(width=390, height=844)
MOBILE_SAMPLE = ('/', '/live/', '/projects/', '/principles/')
ASSETS = {'stylesheet', 'script', 'image', 'font', 'media'}
ALIGN = """phase => document.getAnimations().filter(a => a.playState === 'running' &&
  a.effect?.getTiming().iterations === Infinity).forEach(a => a.currentTime = phase)"""
OBSERVE = """(trace) => {
  window.siteComparison = {layout: 0, motion: {}};
  const state = window.siteComparison;
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) state.layout = Math.max(state.layout, e.value);
  }).observe({type: 'layout-shift', buffered: true});
  window.sampleSiteMotion = (onlyLoops = false) => {
    for (const a of document.getAnimations()) {
      const e = a.effect, t = e?.target;
      const {duration, iterations, easing} = e?.getTiming() || {};
      if (!t || !duration || a.transitionProperty || onlyLoops && iterations !== Infinity ||
          a.playState !== 'running' || a.animationName?.startsWith('-ua-')) continue;
      const name = [e.pseudoElement, a.animationName || t.id || t.localName].join(' ').trim();
      const frames = e.getKeyframes().map(k => Object.fromEntries(Object.entries(k).sort()));
      const signature = JSON.stringify([duration, String(iterations), easing,
        a.animationName && !e.pseudoElement && iterations !== Infinity ? frames : frames.map(Object.keys)]);
      (state.motion[name] ||= {})[signature] = true;
    }
  };
  if (trace) state.timer = setInterval(window.sampleSiteMotion, 75);
}"""
PREPARE = """async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  for (const image of document.images) if (image.loading === 'lazy') image.loading = 'eager';
  await Promise.race([Promise.allSettled([document.fonts.ready, ...Array.from(document.images, i => i.decode())]), wait(1800)]);
  for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 24000); y += innerHeight * .85) {
    scrollTo({top:y, behavior:'instant'});
    await wait(70);
  }
  scrollTo({top:0, behavior:'instant'});
  await wait(1200);
}"""

class PageLinks(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.links, self.redirect = [], None
        content = file.read_bytes()
        self.digest = sha256(content).digest()
        self.feed(content.decode('utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href') and attrs.get('target', '_self') == '_self' and 'download' not in attrs:
            self.links.append(attrs['href'])
        if tag == 'meta' and (attrs.get('http-equiv') or '').lower() == 'refresh':
            match = re.fullmatch(r'\s*0(?:\.0+)?\s*;\s*url\s*=\s*(.*?)\s*', attrs.get('content', ''), re.I)
            if match:
                self.redirect = match[1].strip("\"'")

def site_routes(root):
    pages, sources = {}, {}
    for file in sorted((root / 'dist').rglob('*.html')):
        route = '/' + file.relative_to(root / 'dist').as_posix()
        route = route[:-10] if route.endswith('/index.html') else route
        pages[route] = PageLinks(file)
    for source, page in sorted(pages.items(), key=lambda pair: (pair[0].count('/'), len(pair[0]), pair[0])):
        if page.redirect or source == '/404.html':
            continue
        for href in page.links:
            target = urlsplit(urljoin(source, href))
            if not (target.netloc or target.scheme or target.fragment) and source != unquote(target.path):
                key = unquote(target.path) + ('?' + target.query if target.query else '')
                sources.setdefault(key, {}).setdefault(source, href)
    return pages, sources
async def serve(stack, cmd, expected):
    process = await asyncio.create_subprocess_exec(*map(str, cmd), stdout=asyncio.subprocess.PIPE,
                                                   stderr=asyncio.subprocess.STDOUT)
    async def stop():
        if process.returncode is None:
            process.terminate()
        await process.communicate()
    stack.push_async_callback(stop)
    output = []
    async with asyncio.timeout(35):
        while line := await process.stdout.readline():
            output.append(line.decode('utf-8', errors='replace').strip())
            if match := re.fullmatch(expected + r': (http://127\.0\.0\.1:\d+)', output[-1]):
                return match[1]
    raise RuntimeError('\n'.join(output[-14:]) or f'{expected} exited without a port')

def decode(data):
    with Image.open(BytesIO(data)) as im:
        return im.convert('RGB')
async def desktop_shot(cdp):
    size = (await cdp.send('Page.getLayoutMetrics'))['cssContentSize']
    clip = dict(x=0, y=0, width=DESKTOP['width'], height=min(24000, size['height']), scale=0.5)
    shot = await cdp.send('Page.captureScreenshot', dict(format='jpeg', quality=86, clip=clip,
                                                        captureBeyondViewport=True))
    return decode(base64.b64decode(shot['data'])), size['height'] > clip['height']
async def sample(browser, base, route, source, href, mobile, blocked, clock):
    context = await browser.new_context(viewport=PHONE if mobile else DESKTOP, is_mobile=mobile,
                                        has_touch=mobile, service_workers='block', reduced_motion='no-preference')
    try:
        async def local_only(handler):
            request = handler.request
            url = urlsplit(request.url)
            if f'{url.scheme}://{url.netloc}' != base or request.method not in {'GET', 'HEAD'} or url.path == '/__status':
                blocked.add((url.netloc or '(本机)', request.method, request.resource_type))
                await handler.abort()
            elif url.path.startswith('/__live/') and request.method == 'GET':
                response = await handler.fetch(max_redirects=0)
                if 'json' not in response.headers.get('content-type', ''):
                    return await handler.fulfill(response=response)
                headers = {k: v for k, v in response.headers.items() if k not in {'content-length', 'content-encoding', 'etag'}}
                headers['date'] = format_datetime(clock, usegmt=True)
                body = await response.json()
                if isinstance(body, dict) and 'now' in body:
                    body['now'] = clock.isoformat()
                await handler.fulfill(status=response.status, headers=headers, json=body)
            else:
                await handler.continue_()

        await context.route('**/*', local_only)
        await context.add_init_script(f'({OBSERVE})({str(not mobile).lower()})')
        page = await context.new_page()
        await page.clock.set_fixed_time(clock)
        page.set_default_timeout(5000)
        cdp = await context.new_cdp_session(page)
        frames, errors, assets, api = [], set(), set(), {}
        async def on_frame(event):
            try:
                await cdp.send('Page.screencastFrameAck', {'sessionId': event['sessionId']})
            except Error:
                return
            frames.append((monotonic(), event['data']))
        def on_response(response):
            path = unquote(urlsplit(response.url).path)
            if response.request.resource_type in ASSETS:
                if response.status < 400:
                    assets.add(path)
                else:
                    errors.add(f'{response.status} {path}')
            if path.startswith('/__live/'):
                api[response.url.removeprefix(base)] = response.status
        if not mobile:
            await page.goto(base + (source or '/'), wait_until='domcontentloaded')
            link = page.locator(f'a[href={json.dumps(href, ensure_ascii=False)}]:visible').first if href else None
            if link and await link.count():
                await link.scroll_into_view_if_needed()
            else:
                link = None
            cdp.on('Page.screencastFrame', on_frame)
            await cdp.send('Page.startScreencast', dict(format='jpeg', quality=52, maxWidth=432, maxHeight=270))
            await page.wait_for_timeout(150)
        page.on('response', on_response)
        page.on('pageerror', lambda error: errors.add(str(error)))
        started = monotonic()
        if not mobile and link:
            await link.click(no_wait_after=True, timeout=3500)
            await page.wait_for_url(lambda u: urldefrag(unquote(u))[0] != base + source, wait_until='domcontentloaded')
        else:
            response = await page.goto(base + route, wait_until='domcontentloaded')
            if response and response.status >= 400 and route != '/404.html':
                raise RuntimeError(f'HTTP {response.status}')
        await page.wait_for_timeout(1550)
        if not mobile:
            await cdp.send('Page.stopScreencast')
        await page.wait_for_load_state('load')
        layout = await page.evaluate('() => { clearInterval(siteComparison.timer); return siteComparison.layout; }')
        await page.evaluate(PREPARE)
        motion = await page.evaluate('() => { sampleSiteMotion(true); return siteComparison.motion; }')
        text = await page.evaluate(r"""() => document.body.innerText.split('\n')
            .map(l => l.trim().replace(/\s+/g, ' ')).filter(Boolean)""")
        async def shot(phase):
            await page.evaluate(ALIGN, phase)
            if mobile:
                return decode(await page.screenshot(type='jpeg', quality=86, timeout=10000)), False
            return await desktop_shot(cdp)
        first, clipped = await shot(4000)
        await page.wait_for_timeout(230)
        second, _ = await shot(4500)
        return dict(images=(first, second), url=unquote(page.url.removeprefix(base)), text=text,
                    frames=sorted(frames), started=started, layout=layout, motion=motion, errors=sorted(errors), assets=assets,
                    api=api, method=source if not mobile and link else '直接导航', clipped=clipped)
    finally:
        await context.close()
def flash_frames(record):
    frames = [(t - record['started'], decode(base64.b64decode(image))) for t, image in record['frames']]
    if len(frames) < 3:
        return {}, frames
    small = np.stack([np.asarray(im.resize((32, 20), Image.Resampling.BOX)) for _, im in frames])
    findings = {}
    for label, masks in [('白', small.min(axis=3) >= 246), ('黑', small.max(axis=3) <= 14)]:
        ends = masks[0] | masks[-1]
        for i, mask in enumerate(masks[1:-1], start=1):
            if frames[i][0] < 0:
                continue
            fraction = mask.mean()
            if fraction >= .95 and max(masks[0].mean(), masks[-1].mean()) < .90:
                findings.setdefault(label + '屏', (i, float(fraction)))
            for height, width in ((8, 12), (5, 20), (12, 8)):
                windows = np.lib.stride_tricks.sliding_window_view(mask, (height, width))
                revealed = np.lib.stride_tricks.sliding_window_view(mask & ~ends, (height, width))
                score = float(np.where(windows.mean(axis=(-1, -2)) >= .98, revealed.mean(axis=(-1, -2)), 0).max())
                if score >= .42 and frames[i+1][0]-frames[i][0] >= .065 and score > findings.get(label + '块', (0, 0))[1]:
                    findings[label + '块'] = (i, score)
    return findings, frames
def picture_pair(old, new, path):
    width, height = (max(im.size[i] for im in old + new) for i in (0, 1))
    def canvas(image):
        canvas = Image.new('RGB', (width, height), '#eee')
        canvas.paste(image)
        return canvas
    def delta(a, b):
        red, green, blue = ImageChops.difference(a, b).split()
        return np.asarray(ImageChops.lighter(ImageChops.lighter(red, green), blue))

    left, left_later, right, right_later = map(canvas, old + new)
    activity = [delta(left, left_later), delta(right, right_later)]
    stationary = (activity[0] < 25) & (activity[1] < 25)
    color = (delta(left, right) >= 36) & (delta(left_later, right_later) >= 36)
    # Moving background glows can differ in color while the rendered content stays in place.
    detail = [ImageChops.subtract(im, im.filter(ImageFilter.BoxBlur(6)), offset=128) for im in (left, left_later, right, right_later)]
    structure = (delta(detail[0], detail[2]) >= 18) & (delta(detail[1], detail[3]) >= 18)
    changed = stationary & (color if color.mean() >= .10 else structure)
    marked = Image.new('RGB', (width * 2, height), '#eee')
    marked.paste(old[0])
    marked.paste(new[0], (width, 0))
    draw = ImageDraw.Draw(marked)
    for y in range(0, height, 24):
        for x in range(0, width, 24):
            if changed[y:y+24, x:x+24].sum() >= 18:
                draw.rectangle((width+x, y, min(2*width-1, width+x+23), min(height-1, y+23)),
                               outline='#00A650', width=2)
    marked.save(path, quality=86)
    moving = [(sample[:450] >= 30).mean() for sample in activity]
    return float(changed.mean()), [round(float(value) * 100, 3) for value in moving]

def strip_frames(frames, selected, path):
    take = sorted({0, len(frames)//3, len(frames)-1, *(i for i, _ in selected.values())})
    thumb = Image.new('RGB', (220 * len(take), 160), '#eee')
    draw = ImageDraw.Draw(thumb)
    for col, index in enumerate(take):
        elapsed, im = frames[index]
        im.thumbnail((220, 140))
        thumb.paste(im, (col*220, 0))
        draw.text((col*220+4, 141), f'{elapsed*1000:+.0f} ms', fill='#111')
    thumb.save(path, quality=82)

def bytes_at(root, route):
    file = root / 'dist' / route.lstrip('/')
    if file.is_file() and file.resolve().is_relative_to(root / 'dist'):
        with file.open('rb') as stream:
            return file_digest(stream, 'sha256').digest()

async def compare(browser, bases, roots, job, out, blocked, asset_hashes, clock):
    index, route, mobile, source, links, aliases, exists, identical = job
    result = dict(route=route, mobile=mobile, flags=[], id=index)
    if aliases[0] and aliases[0] == aliases[1] and identical:
        return dict(result, alias=aliases[0])
    captures, failures = [], []
    for base, href, present in zip(bases, links, exists):
        try:
            captures.append(await sample(browser, base, route, source, href, mobile, blocked, clock) if present else None)
            failures.append(None)
        except (Error, RuntimeError) as error:
            captures.append(None)
            failures.append(str(error).splitlines()[0])
    if not all(exists):
        result['flags'].append('新增页面' if exists[1] else '移除页面')
    if any(failures):
        result['flags'].append('采集失败')
        result['failures'] = failures
    if not all(captures):
        for side, capture in zip(('old', 'new'), captures):
            if capture:
                capture['images'][0].save(out / f'{index}-{side}.jpg', quality=86)
                result[side] = f'{index}-{side}.jpg'
        return result
    old, new = captures
    result['image'] = f'{index}.jpg'
    pixels, moving = picture_pair(old['images'], new['images'], out / result['image'])
    result.update(pixels=round(100*pixels, 3), moving=moving, destination=[c['url'] for c in captures],
                  navigation=[c['method'] for c in captures], sampled_frames=[len(c['frames']) for c in captures],
                  layout=[round(c['layout'], 3) for c in captures], errors=[c['errors'] for c in captures],
                  live=[c['api'] for c in captures], clipped=any(c['clipped'] for c in captures))
    flags = result['flags']
    if pixels >= .001:
        flags.append('画面像素变化')
    if aliases[0] != aliases[1] or old['url'] != new['url']:
        flags.append('跳转目标变化')
    if old['text'] != new['text']:
        flags.append('可见文字变化')
        result['text'] = list(unified_diff(old['text'], new['text'], fromfile='正在跑', tofile='待装', lineterm='', n=1))
    if old['errors'] != new['errors'] or old['api'] != new['api']:
        flags.append('脚本或请求结果变化')
    if not mobile:
        for path in old['assets'] | new['assets']:
            if path not in asset_hashes:
                asset_hashes[path] = [bytes_at(root, path) for root in roots]
        result['assets'] = [p for p in sorted(old['assets'] | new['assets']) if asset_hashes[p][0] != asset_hashes[p][1]]
        motion = [set((name, signature) for name, values in c['motion'].items() for signature in values)
                  for c in captures]
        if motion[0] != motion[1]:
            result['motion'] = [sorted(motion[0] - motion[1]), sorted(motion[1] - motion[0])]
            flags.append('采到的浏览器动效不同')
        if max(moving) >= .5 and min(moving) < max(moving) * .15:
            flags.append('首屏持续画面运动差异')
        flash = [flash_frames(c) for c in captures]
        result['flash'] = [{label: round(frames[i][0]*1000) for label, (i, _) in hits.items()} for hits, frames in flash]
        if set(flash[0][0]) != set(flash[1][0]):
            flags.append('转场采到的白屏、黑屏或露底不同')
        if max(result['layout']) >= .06 and abs(result['layout'][0] - result['layout'][1]) >= .04:
            flags.append('最大布局偏移不同')
        if any('转场' in flag or '动效' in flag or '偏移' in flag for flag in flags):
            for side, (hits, frames) in zip(('old', 'new'), flash):
                if frames:
                    name = f'{index}-{side}-transition.jpg'
                    strip_frames(frames, hits, out / name)
                    result[side + '_transition'] = name
    return result

def jobs_for(inventories, selected, extra):
    (old, old_sources), (new, new_sources) = inventories
    routes = sorted((set(selected) if selected else old.keys() | new.keys()) | set(extra), key=lambda r: (r == '/', r))
    runs = [(r, False) for r in routes] + [(r, True) for r in MOBILE_SAMPLE if r in routes]
    for i, (route, mobile) in enumerate(runs, start=1):
        key = unquote(urlsplit(route).path)
        left, right = old_sources.get(route, {}), new_sources.get(route, {})
        source = next((s for s in left if s in right), None)
        existence = [key in pages for pages in (old, new)]
        if not any(existence) or not route.startswith('/') or route.startswith('//'):
            raise ValueError(f'未知页面 {route}')
        yield (i, route, mobile, source, [left.get(source), right.get(source)],
               [pages[key].redirect if key in pages else None for pages in (old, new)], existence,
               all(existence) and old[key].digest == new[key].digest)

def report(out, results, seconds, roots, blocked):
    def image(path):
        return f'<a href="{path}"><img loading="lazy" src="{path}" alt="画面对比"></a>'

    def markup(root, route):
        path = root / 'dist' / unquote(urlsplit(route).path).lstrip('/')
        path = path / 'index.html' if path.is_dir() else path
        return re.sub(rb'<link\b[^>]*\brel=["\'](?:shortcut )?icon["\'][^>]*>\s*', b'',
                      path.read_bytes(), flags=re.I) if path.is_file() else None

    def row(r):
        label = r['route'] + (' · 手机' if r['mobile'] else '')
        reason = '、'.join(r['flags']) or ('跳转 → ' + r['alias'] if r.get('alias') else '资源文件有变化' if r.get('assets') else '未采到变化')
        pictures = ''.join(image(r[k]) for k in ('image', 'old', 'new', 'old_transition', 'new_transition') if k in r)
        details = {k: v for k, v in r.items() if k not in {'id', 'route', 'flags', 'mobile', 'alias', 'image'}
                   and not k.endswith('_transition') and v}
        evidence = f'<pre>{escape(json.dumps(details, ensure_ascii=False, indent=2))}</pre>' if details else ''
        return f'<details><summary>{escape(label)} · {escape(reason)}</summary>{pictures}{evidence}</details>'

    affected, trace, rest = [], [], []
    for r in results:
        direct = {'新增页面', '移除页面', '采集失败', '跳转目标变化'} & set(r['flags'])
        if direct or r.get('assets') or r['flags'] and markup(roots[0], r['route']) != markup(roots[1], r['route']):
            affected.append(r)
        else:
            (trace if r['flags'] else rest).append(r)
    versions = [root.name for root in roots]
    data = dict(versions=versions, seconds=seconds, blocked=sorted(blocked), pages=results)
    (out / 'report.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (out / 'index.html').write_text(f"""<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<title>网站版本比对</title><style>
body{{font:16px/1.6 system-ui;margin:24px auto;padding:0 18px;max-width:1500px;color:#172620}}
details{{padding:5px;border-bottom:1px solid #e0e7e2}}summary{{cursor:pointer}}img{{width:100%;height:auto}}
pre{{white-space:pre-wrap;overflow-wrap:anywhere}}a{{color:#006937}}</style>
<h1>网站版本比对</h1><p>{escape(versions[0])} → {escape(versions[1])} · {seconds:.1f} 秒</p>
<p>截图左边为正在跑的版本，右边为待装版本，绿色框标出稳定画面的像素差。
转场图第一条为正在跑的版本，第二条为待装版本。时间从尝试点击或导航算起。
两版共用合成实况数据及同一个测试时钟。外网请求和写入请求被拦截。</p>
<h2>页面、加载文件变化或采集失败 · {len(affected)}</h2>{''.join(map(row, affected))}
<h2>仅采样不同 · {len(trace)}</h2>{''.join(map(row, trace))}
<h2>其他入口 · {len(rest)}</h2>{''.join(map(row, rest))}
<p><a href="report.json">下载机器可读结果</a></p></html>""", encoding='utf-8')

async def run(args):
    started = monotonic()
    roots = [args.running, args.candidate]
    inventories = [site_routes(root) for root in roots]
    jobs = list(jobs_for(inventories, args.page, args.extra_page))
    results, blocked, hashes = [], set(), {}
    async with AsyncExitStack() as stack:
        scratch = stack.enter_context(TemporaryDirectory(dir=args.out))
        fixture = await serve(stack, [args.fixture_python, '-B', '-X', 'utf8', args.fixture_script,
                                      '--runtime-root', scratch, '--port', '0'], 'Fixture preview')
        port = urlsplit(fixture).port
        bases = [await serve(stack, [sys.executable, '-B', '-X', 'utf8', root / 'tools/preview_site.py',
                                     '--port', '0', '--upstream-port', port], 'Preview') for root in roots]
        pw = await stack.enter_async_context(async_playwright())
        probe = await pw.request.new_context()
        stack.push_async_callback(probe.dispose)
        reply = await probe.get(f'{fixture}/computer-access/live/v1/home', timeout=10000, max_redirects=0)
        packet = await reply.json()
        clock = datetime.fromisoformat(packet.get('now') or packet['at']).astimezone(timezone.utc)
        browser = await pw.chromium.launch(executable_path=args.chrome, channel=None if args.chrome else 'chrome')
        stack.push_async_callback(browser.close)
        for job in jobs:
            results.append(await compare(browser, bases, roots, job, args.out, blocked, hashes, clock))
            if len(results) % 20 == 0:
                print(f'{len(results)}/{len(jobs)}', flush=True)
    report(args.out, results, monotonic() - started, roots, blocked)
    print(args.out / 'index.html', flush=True)
    return int(any(row.get('failures') for row in results))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('running', 'candidate', 'out', 'fixture-script'):
        parser.add_argument('--' + name, required=True, type=lambda p: Path(p).resolve())
    parser.add_argument('--fixture-python', default=sys.executable)
    parser.add_argument('--chrome', help='Chrome executable, defaults to installed Chrome')
    parser.add_argument('--page', action='append', help='focus on a route such as /live/ or /live/item/?id=example')
    parser.add_argument('--extra-page', action='append', default=[], help='include a query route in the full scan')
    args = parser.parse_args()
    for root in (args.running, args.candidate):
        if not (root / 'dist/index.html').is_file() or not (root / 'tools/preview_site.py').is_file():
            parser.error(f'Expected an unpacked runtime with dist/ and tools/preview_site.py: {root}')
    if any((p / '.git').exists() for p in (args.out, *args.out.parents)):
        parser.error('--out must be outside a Git working tree')
    if args.out.exists() and any(args.out.iterdir()):
        parser.error('--out must be a new or empty directory')
    args.out.mkdir(parents=True, exist_ok=True)
    return asyncio.run(run(args))
if __name__ == '__main__':
    sys.exit(main())
