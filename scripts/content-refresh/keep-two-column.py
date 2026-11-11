"""Remeasure selected horizontal screens; retain a two-column result under its existing key."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import time


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--screen', action='append', required=True)
    ap.add_argument('--cache', type=Path, required=True, help='Existing blocks directory')
    ap.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[2])
    ap.add_argument('--work', type=Path, required=True, help='New short directory for trial files')
    ap.add_argument('--tries', type=int, default=10)
    ap.add_argument('--dry-run', action='store_true', help='Write only work files; leave existing caches untouched')
    args = ap.parse_args()
    if args.tries < 1:
        ap.error('--tries must be positive')
    source, cache, work = (p.resolve() for p in (args.source, args.cache, args.work))
    work.mkdir(parents=True, exist_ok=False)
    os.environ.update(TEMP=str(work), TMP=str(work), TMPDIR=str(work))
    os.environ.update(BLOCK_PUB_DIR=str(source / 'site-astro/public'),
                      TYPESET_ASSET_ROOT=str(source / 'sources/assets'))
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(source / 'site-astro/tools'))
    import render_blocks as rb
    from bs4 import BeautifulSoup
    from playwright.sync_api import Browser
    rb.verify_render_lock()
    os.chdir(source)
    brush = Path(rb.BRUSH_DIR)
    rb.BRUSH_DIR = str(work / 'brush')
    # Use production hydration; block nonlocal browser requests.
    new_page = Browser.new_page
    blocked = []
    def local_page(browser, *a, **kw):
        page = new_page(browser, *a, **kw)
        def route(r):
            if r.request.url.startswith(('file:', 'data:', 'blob:')):
                r.continue_()
            else:
                blocked.append(r.request.url)
                r.abort()
        page.route('**/*', route)
        return page
    Browser.new_page = local_page
    css = source / 'site-astro/public/assets/_typeset/typeset.css'
    libfp = rb.library_fingerprint() + rb.sha(css)[:12] + rb.RENDER_VERSION + rb.hydration_fingerprint()
    known = json.loads((cache / '_cache.json').read_text('utf-8'))
    report = {'source': str(source), 'cache': str(cache), 'dry_run': args.dry_run,
              'chrome': rb.RENDER_LOCK['chrome'], 'session_kind': 'local_render', 'runs': [], 'blocked': blocked}
    failed = []
    for sid in args.screen:
        paths = list(cache.glob(f'*/{sid}-h.html'))
        if len(paths) != 1:
            raise ValueError(f'{sid}: expected one existing measurement HTML, found {len(paths)}')
        path = paths[0]
        document = path.read_text('utf-8')
        md = source / 'site-astro/src/content/pages' / (path.parent.name + '.md')
        first = rb.parse_md(md)[1][0][0]['screen']['id']
        binds = rb.bindings(path.parent.name, first)
        key = rb.screen_cache_key(document, 'h', libfp)
        key = hashlib.sha256(json.dumps([key, binds.get((sid, 'h'))], separators=(',', ':'), sort_keys=True).encode()).hexdigest()[:20]
        checkpoint = cache / '_completed' / (key + '.json')
        if key not in known and not checkpoint.is_file():
            raise ValueError(f'{sid}: input key {key} is absent; use its original source and cache')
        job = {'page': path.parent.name, 'screen': sid, 'o': 'h', 'html': str(path), 'key': key}
        for attempt in range(1, args.tries + 1):
            started = time.monotonic()
            results = rb.hydrate([job], binds)
            result = results[0] if results else None
            soup = BeautifulSoup(result['html'], 'html.parser') if result else None
            row = soup.select_one('.row.fit-ill') if soup else None
            cols = row.find_all('div', class_='col', recursive=False) if row else []
            art = next((c.select_one('[data-comp="illustration"] img') for c in cols if not c.select_one('[data-comp="chapter_title"]') and c.select_one('[data-comp="illustration"] img')), None)
            ok = len(cols) >= 2 and art is not None and float(art.get('data-ts-w', 0)) >= 300
            record = {'screen': sid, 'attempt': attempt, 'seconds': round(time.monotonic() - started, 3),
                      'layout': 'two-column' if ok else 'other', 'key': key, 'input_sha256': rb.sha(path)}
            report['runs'].append(record)
            if ok:
                payload = rb.cache_payload(result)
                trial = work / (sid + '.json')
                rb.write_cache(trial, payload)
                if not args.dry_run:
                    for image in Path(rb.BRUSH_DIR).glob('*.png'):
                        if image.as_uri() not in payload['html']:
                            continue
                        target = brush / image.name
                        target.parent.mkdir(parents=True, exist_ok=True)
                        if not target.exists():
                            shutil.copyfile(image, target)
                        if rb.sha(target) != rb.sha(image):
                            raise ValueError('Brush image hash mismatch: ' + str(target))
                        payload['html'] = payload['html'].replace(image.as_uri(), target.as_uri())
                    rb.write_cache(checkpoint, payload)
                break
        else:
            failed.append(sid)
        (work / 'receipt.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'receipt': str(work / 'receipt.json'), 'failed': failed, 'dry_run': args.dry_run}, ensure_ascii=False))
    return bool(failed)


if __name__ == '__main__':
    raise SystemExit(main())
