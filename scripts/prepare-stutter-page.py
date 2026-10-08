"""Generate only the cockpit child page and its assets; no publication or home edits."""
import argparse, hashlib, html, json, re
from pathlib import Path
from release_delta import inventory, proof, source_path, write_changes

def prepare(release, output, delta=False):
    release, output = Path(release).resolve(), Path(output).resolve()
    if output == release or output.is_relative_to(release) or release.is_relative_to(output):
        raise ValueError('Use an independent empty output')
    if output.exists() and any(output.iterdir()): raise ValueError('Output must be empty')
    root = Path(__file__).parent
    copy = json.loads((root / 'stutter-page-copy.json').read_text('utf8'))
    updates, refs = {}, {}
    for name, path in [('css', root/'stutter-page.css'), ('js', root/'stutter-page.js'), ('reader', root/'site-live-runtime.js')]:
        body = path.read_bytes(); rel = 'cockpit/stutter/assets/'+path.stem+'-'+proof(body)['sha256'][:20]+path.suffix
        updates[rel], refs[name] = body, '/'+rel
    template = (root/'stutter-page.html').read_text('utf8')
    values = {**copy, **refs, 'copy-json':json.dumps(copy, ensure_ascii=False).replace('<', '\\u003c')}
    updates['cockpit/stutter/index.html'] = re.sub(r'@@([\w-]+)@@', lambda m: values[m[1]] if m[1]=='copy-json' else html.escape(values[m[1]], quote=True), template).encode('utf8')
    if delta:
        manifest = json.loads(source_path(release, 'release-manifest.json').read_text('utf8'))
        manifest['files'] = write_changes(release, output, updates, delta=True)
        manifest['release_id'] = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
        (output/'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', 'utf8')
    else:
        for rel, body in updates.items():
            target = output/rel; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(body)
    return {'route':'/cockpit/stutter/', 'output':str(output), 'files':{rel:proof(body) for rel,body in updates.items()}, 'publication_performed':False}

if __name__ == '__main__':
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument('--release',type=Path,required=True); ap.add_argument('--output',type=Path,required=True); ap.add_argument('--delta',action='store_true')
    args=ap.parse_args(); print(json.dumps(prepare(args.release,args.output,args.delta), ensure_ascii=False))
