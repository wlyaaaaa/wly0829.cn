"""Prepare a byte-bound release with streaming hero video; never publish assets."""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import posixpath
import re
import shutil
from urllib.parse import unquote, urlsplit

MARKER = '/* 只播放人工标注的插画面片'
PAGE_DATA = re.compile(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', re.S)
STREAMING_VIDEO = '''/* 只播放人工标注的插画面片；字始终来自底图。原地址流式播放，canplay 后淡入。 */
(()=>{'use strict';const d=JSON.parse(document.querySelector('#page-data').textContent),spec=d.video;if(!spec)return;const state={phase:'image',reason:null};window.SiteHero=state;if(spec.mount_allowed!==true){state.reason='illustration-compatibility';return;}
__SECTION__
let visible=false,video=null,pending=false;
const allowed=()=>query.get('audit')!=='1'&&!rm.matches&&!document.hidden&&!portrait.matches&&innerWidth>=1024&&visible;
async function readyImages(){if(document.readyState!=='complete')await new Promise(r=>addEventListener('load',r,{once:true}));const images=[...document.images].filter(i=>{const b=i.getBoundingClientRect();return i.getAttribute('src')&&b.bottom>0&&b.top<innerHeight;});await Promise.all(images.map(i=>i.decode()));}
function reveal(){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(video&&allowed()&&video.readyState>=3&&!video.paused)video.classList.add('ready');}));}
async function update(){
 if(video){const r=spec.rect;video.style.top=r[1]*(section._mediaHeight||section.clientHeight)+'px';video.style.height=r[3]*(section._mediaHeight||section.clientHeight)+'px';}
 if(!allowed()){if(video){video.pause();video.hidden=true;video.classList.remove('ready');}state.phase='image';return;}
 if(video){video.hidden=false;video.play().then(()=>{if(allowed()&&!video.paused){state.phase='playing';reveal();}}).catch(()=>{video.hidden=true;state.phase='image';});return;}
 if(pending||navigator.connection?.saveData)return;pending=true;
 try{state.phase='waiting-images';await readyImages();if(!allowed())return;
  const mask=new Image();mask.src=spec.mask;await mask.decode();if(!allowed())return;
  video=document.createElement('video');video.className='hero-video';video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.defaultPlaybackRate=spec.playback_rate||1;video.playbackRate=spec.playback_rate||1;video.style.transitionDuration=(spec.intro_fade_seconds??.5)+'s';video.setAttribute('aria-hidden','true');const r=spec.rect;Object.assign(video.style,{left:r[0]*100+'%',top:r[1]*(section._mediaHeight||section.clientHeight)+'px',width:r[2]*100+'%',height:r[3]*(section._mediaHeight||section.clientHeight)+'px',right:'auto',bottom:'auto',maskImage:`url("${spec.mask}")`,webkitMaskImage:`url("${spec.mask}")`});
  video.addEventListener('canplay',reveal);video.addEventListener('playing',()=>{if(allowed()){state.phase='playing';reveal();}});video.addEventListener('error',()=>{video.hidden=true;state.phase='image';state.reason='decode-error';});
  state.phase='loading';video.src=spec.src;section.insertBefore(video,section.querySelector('.overlays'));await video.play();if(allowed()&&!video.paused){state.phase='playing';reveal();}
 }catch(error){state.phase='image';state.reason=String(error);if(video)video.hidden=true;}finally{pending=false;}
}
new IntersectionObserver(es=>{visible=es[0].isIntersecting;update();}).observe(section);for(const event of ['visibilitychange','site-motion','site-layout'])document.addEventListener(event,update);addEventListener('resize',update);rm.addEventListener('change',update);addEventListener('pagehide',()=>{if(video)video.pause();});
})();'''


def patch_video_runtime(text):
    """Replace only the known hero module, retaining its exact host selector."""
    if text.count(MARKER) != 1:
        raise ValueError('Expected exactly one hero video module')
    start = text.index(MARKER)
    end = text.index('\n})();', start) + len('\n})();')
    original = text[start:end]
    if original == STREAMING_VIDEO.replace('__SECTION__', original.splitlines()[2]):
        return text
    if not all(token in original for token in ('response.blob()', 'blob.size>2_000_000',
                                               'spec.download_timeout_ms||6000', 'attempts>=2')):
        raise ValueError('Unsupported hero video loading contract')
    section = original.splitlines()[2]
    if not (section.startswith('const query=') and section.endswith('if(!hero)return;')):
        raise ValueError('Unsupported hero video section selector')
    return text[:start] + STREAMING_VIDEO.replace('__SECTION__', section) + text[end:]


def stamp(path):
    with path.open('rb') as stream:
        digest = hashlib.file_digest(stream, 'sha256').hexdigest()
    return {'sha256': digest, 'bytes': path.stat().st_size}


def inventory(root):
    result = {}
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            raise ValueError('Release contains a symbolic link')
        if path.is_file() and path.relative_to(root).as_posix() != 'release-manifest.json':
            result[path.relative_to(root).as_posix()] = stamp(path)
    return result


class Scripts(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.sources = []; self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == 'script' and dict(attrs).get('src'):
            self.sources.append(dict(attrs)['src'])


def script_path(page, source):
    url = urlsplit(source)
    if url.scheme or url.netloc:
        return None
    return posixpath.normpath(posixpath.join(posixpath.dirname('/'+page), unquote(url.path))).lstrip('/')


def prepare(source, output, evidence, home_html=None, home_original_sha256=None, video_bindings=None):
    source, output, evidence = source.resolve(), output.resolve(), evidence.resolve()
    if output.exists() or source == output or source in output.parents:
        raise ValueError('Output must be a new directory outside the source release')
    if output == evidence or output in evidence.parents:
        raise ValueError('Runtime evidence must remain outside the release inventory')
    manifest = json.loads((source/'release-manifest.json').read_text('utf-8-sig'))
    before = inventory(source)
    if before != manifest['files']:
        raise ValueError('Source release differs from its manifest')
    home_text = None; home_overlay = None
    if bool(home_html) != bool(home_original_sha256):
        raise ValueError('Home HTML override requires the original home SHA256')
    if home_html:
        if before['index.html']['sha256'] != home_original_sha256:
            raise ValueError('Original home HTML SHA256 does not match the reviewed source')
        home_html = Path(home_html).resolve(); home_text = home_html.read_text('utf8')
        original_data = PAGE_DATA.search((source/'index.html').read_text('utf8'))
        replacement_data = PAGE_DATA.search(home_text)
        original_video = json.loads(original_data[1]).get('video') if original_data else None
        replacement_video = json.loads(replacement_data[1]).get('video') if replacement_data else None
        if original_video != replacement_video:
            raise ValueError('Home link overlay changed the existing video identity or geometry')
        home_overlay = {'before': before['index.html'], 'replacement': stamp(home_html),
                        'scope': 'Root-owned exact home-link overlay; video/media identity retained'}
    refs = {}; pages = {}
    for rel in before:
        if not rel.endswith('.html'):
            continue
        text = home_text if rel == 'index.html' and home_text is not None else (source/rel).read_text('utf8')
        pages[rel] = text
        for address in Scripts(text).sources:
            path = script_path(rel, address)
            if path and path in before and MARKER in (source/path).read_text('utf8'):
                refs.setdefault(path, []).append({'page': rel, 'address': address})
    if not refs:
        raise ValueError('No actual page uses a known hero video runtime')
    binding_proof = None
    video_pages = {rel: PAGE_DATA.search(text) for rel,text in pages.items()}
    video_pages = {rel: match for rel,match in video_pages.items() if match and json.loads(match[1]).get('video')}
    if video_pages:
        if not video_bindings:
            raise ValueError('Video source/illustration bindings are required before preparing runtime')
        video_bindings = Path(video_bindings).resolve()
        binding_proof = json.loads(video_bindings.read_text('utf8'))
        if binding_proof.get('schema') != 'wly.video-illustration-binding.v1' or binding_proof.get('status') != 'pass':
            raise ValueError('Video illustration binding evidence is not verified')
        if binding_proof.get('source_release_id') != manifest['release_id'] or binding_proof.get('source_manifest_sha256') != stamp(source/'release-manifest.json')['sha256']:
            raise ValueError('Video binding evidence belongs to a different source release')
        loader=importlib.util.spec_from_file_location('video_binding',Path(__file__).with_name('check-video-illustration-binding.py'))
        binding=importlib.util.module_from_spec(loader);loader.loader.exec_module(binding)
        if set(binding_proof['pages']) != {binding.route(rel) for rel in video_pages}:
            raise ValueError('Video binding evidence does not cover exactly the actual video pages')
        for rel,match in video_pages.items():
            data=json.loads(match[1]);video=data['video'];row=binding_proof['pages'][binding.route(rel)]
            vp=binding.asset_path(rel,video['src'],before);mp=binding.asset_path(rel,video['mask'],before)
            if before[vp]['sha256'] != row['video_sha256'] or before[mp]['sha256'] != row['mask_sha256']:
                raise ValueError('Video binding media identity changed: '+rel)
            if any(before.get(path) != proof for path,proof in row['hero_static_files'].items()):
                raise ValueError('Video binding static illustration changed: '+rel)
            if not isinstance(row['mount_allowed'],bool) or row['mount_allowed'] and row['status'] not in {'matched_provenance','matched_strict_pixels'}:
                raise ValueError('Unsupported video illustration mount decision')
            video['mount_allowed']=row['mount_allowed']
            video['compatibility']={'status':row['status'],'reason':row['reason']}
            pages[rel]=pages[rel][:match.start(1)]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+pages[rel][match.end(1):]
    replacements = {}; bundles = []
    for rel, uses in sorted(refs.items()):
        original = (source/rel).read_text('utf8')
        patched = patch_video_runtime(original)
        digest = hashlib.sha256(patched.encode('utf8')).hexdigest()
        new_rel = str(Path(rel).with_name('app-'+digest[:20]+'.js')).replace('\\', '/')
        if new_rel == rel or new_rel in before:
            raise ValueError('New runtime must not overwrite an existing content-addressed asset')
        replacements[rel] = (new_rel, patched)
        bundles.append({'before_path': rel, 'before': before[rel], 'after_path': new_rel,
                        'after': {'sha256': digest, 'bytes': len(patched.encode('utf8'))},
                        'pages': sorted({u['page'] for u in uses})})
    shutil.copytree(source, output)
    changed = []
    for rel, (new_rel, patched) in replacements.items():
        (output/new_rel).write_text(patched, encoding='utf8', newline='')
        for use in refs[rel]:
            pages[use['page']] = pages[use['page']].replace(use['address'], '/'+new_rel)
    for rel, text in pages.items():
        if text != (source/rel).read_text('utf8'):
            (output/rel).write_text(text, encoding='utf8', newline='')
            changed.append({'path': rel, 'before': before[rel], 'after': stamp(output/rel)})
    after = inventory(output)
    unchanged = [rel for rel in before if rel not in {row['path'] for row in changed}]
    if any(before[rel] != after[rel] for rel in unchanged):
        raise ValueError('An original asset changed outside the permitted HTML URL rewrite')
    now = datetime.now(timezone(timedelta(hours=8))).isoformat()
    proof = {'schema': 'wly.oss-video-runtime.v1', 'status': 'prepared', 'prepared_at_beijing': now,
             'source_release_id': manifest['release_id'], 'source_manifest': stamp(source/'release-manifest.json'),
             'bundles': bundles, 'changed_html': changed, 'unchanged_original_files': len(unchanged),
             'media_bytes_preserved': all(before[r] == after[r] for r in before if Path(r).suffix.lower() in {'.mp4', '.png', '.webp', '.avif', '.jpg', '.jpeg'}),
             'browser_verification': 'pending', 'oss_cold_cache_verification': 'pending_handoff'}
    if home_overlay:
        home_overlay['after_runtime'] = after['index.html']; proof['home_overlay'] = home_overlay
    if binding_proof:
        proof['video_illustration_binding']={'evidence':stamp(video_bindings),'counts':binding_proof['counts'],
                                             'mount_decisions':{route:row['mount_allowed'] for route,row in binding_proof['pages'].items()}}
    manifest['files'] = after
    manifest['prepared_at_beijing'] = now
    manifest['runtime_overlay'] = proof
    manifest['release_id'] = hashlib.sha256(json.dumps(after, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    (output/'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    evidence.parent.mkdir(parents=True, exist_ok=True)
    evidence.write_text(json.dumps(proof, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    return proof


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--evidence', type=Path, required=True)
    parser.add_argument('--home-html', type=Path, help='Exact root-owned home link overlay')
    parser.add_argument('--home-original-sha256', help='SHA256 of the reviewed original index.html; required with --home-html')
    parser.add_argument('--video-bindings', type=Path, help='Exact-release video/illustration binding evidence; required for actual video pages')
    args = parser.parse_args()
    proof = prepare(args.source, args.output, args.evidence, args.home_html, args.home_original_sha256, args.video_bindings)
    print(json.dumps({'status': proof['status'], 'bundles': len(proof['bundles']),
                      'changed_html': len(proof['changed_html']), 'media_bytes_preserved': proof['media_bytes_preserved']}))


if __name__ == '__main__':
    main()
