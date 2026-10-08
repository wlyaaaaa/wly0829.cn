"""Stage selected native project bodies before the complete release is assembled."""
import html
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def source_inputs(stamp):
    paths = [Path(__file__), ROOT/'scripts/generate-routes.mjs', ROOT/'scripts/build-typeset-site.py', ROOT/'package.json', ROOT/'package-lock.json']
    paths += [p for folder in ('app', 'server', 'config') for p in (ROOT/folder).iterdir() if p.is_file()]
    return {str(p): stamp(p) for p in paths}


def main_body(text):
    matches = re.findall(r'<main\b[^>]*>[\s\S]*?</main>', text)
    if len(matches) != 1 or len(re.findall(r'<main\b', text)) != 1:
        raise ValueError('Native body requires one main element')
    return matches[0]


def prepare(args, candidate, accepted, expected, stamp, route_file):
    if source_inputs(stamp) != expected: raise ValueError('Native source inputs changed before SSR')
    work = args.output.parent/(args.output.name+'-native-body'); work.mkdir()
    config = work/'render.json'; config.write_text(json.dumps({'routes':args.native_routes,'output':str(work/'bodies')}), encoding='utf8')
    subprocess.run(['node', str(ROOT/'scripts/generate-routes.mjs'), '--render-bodies', str(config)], cwd=ROOT, check=True, creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    if source_inputs(stamp) != expected: raise ValueError('Native source inputs changed during SSR')
    metadata = json.loads((work/'bodies/route-meta.json').read_text('utf8'))
    inputs = {**expected, str(config):stamp(config), str(work/'bodies/route-meta.json'):stamp(work/'bodies/route-meta.json')}; records = {}
    for route in args.native_routes:
        if not re.fullmatch(r'/projects/[a-z0-9-]+(?:/[a-z0-9-]+)?', route): raise ValueError('Only owning native project routes are allowed: '+route)
        rel = route_file(route+'/'); old_path = args.baseline/rel; fresh_path = work/'bodies'/rel
        old = old_path.read_text('utf8'); fresh = fresh_path.read_text('utf8')
        if re.search(r'\bid=["\']page-data["\']', old): raise ValueError('Native route cannot replace a typeset page: '+route)
        text = old.replace(main_body(old), main_body(fresh), 1)
        meta = metadata[route]; text, count = re.subn(r'<title\b[^>]*>[^<]*</title>', lambda _: '<title>'+html.escape(meta['title'])+'</title>', text, count=1)
        if count != 1: raise ValueError('Native route title is missing: '+route)
        def meta_value(match):
            field = 'description' if 'description' in match[1] else 'title'
            return match[1]+html.escape(meta[field], quote=True)+match[2]
        text, count = re.subn(r'(<meta\b[^>]*(?:name|property)=["\'](?:description|og:title|og:description|twitter:title|twitter:description)["\'][^>]*content=["\'])[^"\']*(["\'])', meta_value, text)
        if not re.search(r'<meta\b[^>]*name=["\']description["\']', text): raise ValueError('Native route description is missing: '+route)
        dest = candidate/rel; dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(text, encoding='utf8')
        url = route+'/'; accepted[url] = {'native_body':True, 'build_status':'built'}
        records[url] = {'baseline':stamp(old_path), 'body':stamp(fresh_path), 'html':stamp(dest), 'metadata':meta}
        inputs.update({str(old_path):stamp(old_path), str(fresh_path):stamp(fresh_path)})
    return {'schema':'wly.native-readability.v1', 'routes':records, 'inputs':inputs}
