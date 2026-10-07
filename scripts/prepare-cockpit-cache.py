"""Prepare only the cockpit cache runtime and its exact release delta; never publish."""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re

BJT = timezone(timedelta(hours=8))
MARKER = '/* Cockpit consumes the shared site-live v1 last-read cache. */'

# Keep the existing cache key, {project,result,at} envelope and 24-hour lifetime.
# Store displayed public results, never the raw authority/status response.
# Reused from integration/post-oss-cache-worktree. The canonical live renderer
# additionally marks a partial hardware display cacheable while keeping its
# current state unknown; bare unknown, remote and iframe results stay ineligible.
CACHE_RUNTIME = r"""
/* Cockpit consumes the shared site-live v1 last-read cache. */
const cockpitLastValues=new Map();
const cockpitCacheKey=slot=>`site-live:v1:${data.page}:${slot}`;
function cockpitReadLast(slot,now=Date.now()){
 const validRows=rows=>Array.isArray(rows)&&rows.every(row=>row&&typeof row.text==='string'&&(!row.children||validRows(row.children)));
 const knownResult=result=>['ok','warn','error','closed'].includes(result?.state)||(result?.state==='unknown'&&result.cacheable===true&&validRows(result.rows));
 const valid=c=>c&&c.project===data.project&&typeof c.result?.text==='string'&&knownResult(c.result)&&!c.result.iframe&&(!c.result.rows||validRows(c.result.rows))&&Number.isFinite(c.at)&&c.at<=now+60000;
 let c=cockpitLastValues.get(slot);if(!valid(c))c=null;
 try{const stored=JSON.parse(localStorage.getItem(cockpitCacheKey(slot)));if(valid(stored)&&(!c||stored.at>c.at))c=stored;}catch{}
 return c;
}
function cockpitReadCache(slot,now=Date.now()){
 const c=cockpitReadLast(slot,now);return c&&now-c.at<86400000?c:null;
}
function cockpitPlainRows(rows){return rows.map(row=>[row.text,row.detail,row.children?cockpitPlainRows(row.children):''].filter(Boolean).join('；')).join('\n');}
function cockpitHistoricalRows(rows){return rows.map(({state,...row})=>({...row,children:row.children?cockpitHistoricalRows(row.children):undefined}));}
function rememberCockpitValues(at){
 if(!['cockpit','mcp','computer-access'].includes(data.kind)||!online())return;
 try{localStorage.setItem('computer-last-read-v1',String(Date.now()/1000));}catch{}
 const selectedTarget=target;target=null;
 try{
  const cells=(data.screens||[]).flatMap(screen=>[...(screen.parts||[]),...Object.values(screen.layouts||{})].flatMap(layout=>layout.native_live||layout.live||[]));
  const slots=new Set([...cells.map(cell=>cell.slot),...[...document.querySelectorAll('[data-b2-slot]')].map(el=>el.dataset.b2Slot)]);
  if(data.kind==='computer-access')slots.add('cockpit-pc');
  for(const slot of slots){
   if(['ca-form','ca-toast','ca-results','ca-form-hours','ca-form-code'].includes(slot))continue;
   const value=currentValue(slot);
   if(value.iframe||(!['ok','warn','error','closed'].includes(value.state)&&!(value.state==='unknown'&&value.cacheable===true&&Array.isArray(value.rows))))continue;
   const result={...value,text:value.text??(value.rows?cockpitPlainRows(value.rows):'')};
   if(!result.text)continue;
   const sampleAt=slotTime(slot),c={project:data.project,result,at:Number.isFinite(sampleAt)&&sampleAt>0?sampleAt*1000:at};
   cockpitLastValues.set(slot,c);
   try{localStorage.setItem(cockpitCacheKey(slot),JSON.stringify(c));}catch{}
  }
 }finally{target=selectedTarget;}
}
function value(slot){
 if(['ca-form','ca-toast','ca-results','ca-form-hours','ca-form-code'].includes(slot))return currentValue(slot);
 if(!['cockpit','mcp','computer-access'].includes(data.kind))return currentValue(slot);
 const connected=online(),current=connected?currentValue(slot):null;
 if(connected&&(current.state!=='unknown'||current.rows||current.iframe))return current;
 const c=cockpitReadLast(slot),at=c?.at/1000||status?.observed_at_unix||lastRead;
 if(connected){if(!c)return current;return {...c.result,text:'此项正在重新读取 · 当时：'+c.result.text,rows:c.result.rows?[{text:'上次读到 '+time(c.at/1000)+'（北京时间）；此项当前还不能确认'},...cockpitHistoricalRows(c.result.rows)]:undefined,state:'unknown',cached:true,cachedAt:c.at,hardwareCached:!!c.result.hardwareDisplay};}
 if(['cockpit-overall','ca-connection','mcp-main'].includes(slot))return {text:offline(at),state:'unknown',cached:!!c,cachedAt:c?.at};
 if(slot==='cockpit-attention')return {rows:[{text:offline(at)},{text:'若只是主入口故障，可查看连接电脑页的副机备用入口（两台电脑都需开机联网）',href:'/mcp/'},...(c?.result.rows?[{text:'以下是上次读到的待办，当前情况还不能确认'},...cockpitHistoricalRows(c.result.rows)]:[])],state:'unknown',cached:!!c,cachedAt:c?.at};
 if(!c)return {text:phase==='loading'?'正在连接电脑 · 还没读到过':'读不到电脑 · 还没读到过',state:'unknown',cached:false};
 const date=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit'}).format(new Date(c.at));
 const label='上次读到 '+time(c.at/1000)+'（'+date+'，北京时间） · 当前状态未知';
 return {...c.result,rows:c.result.rows?[{text:label},...cockpitHistoricalRows(c.result.rows)]:undefined,
  text:label+'\n当时：'+c.result.text,state:'unknown',cached:true,cachedAt:c.at};
}
"""


def replace_once(text: str, before: str, after: str) -> str:
    if text.count(before) != 1:
        raise ValueError('Unsupported cockpit runtime anchor: ' + before[:90])
    return text.replace(before, after, 1)


def patch_cockpit_cache(text: str) -> str:
    """Works on the actual typeset bundle and before the typeset builder patch."""
    if MARKER in text:
        return text
    text = replace_once(text, 'function value(slot){', CACHE_RUNTIME + '\nfunction currentValue(slot){')
    text = replace_once(text, "const slot=el.dataset.b2Slot,valueRow=value(slot);el.dataset.state=valueRow.state||'unknown';",
        "const slot=el.dataset.b2Slot,valueRow=value(slot);el.dataset.state=valueRow.state||'unknown';el.dataset.cached=String(valueRow.cached===true);if(valueRow.cachedAt)el.dataset.lastReadAt=String(valueRow.cachedAt);else delete el.dataset.lastReadAt;")
    text = replace_once(text, "if(target?.lands_on==='cockpit-tasks'&&slot==='cockpit-tasks'&&target.api_project)",
        "if(!valueRow.cached&&target?.lands_on==='cockpit-tasks'&&slot==='cockpit-tasks'&&target.api_project)")
    text = replace_once(text, "phase='ready';lastRead=Number.isFinite(value.observed_at_unix)?value.observed_at_unix:clock();problem='';",
        "phase='ready';lastRead=data.kind==='cockpit'?clock():Number.isFinite(value.observed_at_unix)?value.observed_at_unix:clock();problem='';rememberCockpitValues(lastRead*1000);")
    return text


def proof(payload: bytes) -> dict:
    return {'sha256': hashlib.sha256(payload).hexdigest(), 'bytes': len(payload)}


def prepare(release: Path, output: Path) -> dict:
    release, output = release.resolve(), output.resolve()
    if output == release or output.is_relative_to(release) or release.is_relative_to(output):
        raise ValueError('Preparation output must not overlap the input release')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Preparation output must be empty; use a fresh review directory')
    html_rel = 'cockpit/index.html'
    original_html = (release / html_rel).read_bytes()
    html = original_html.decode('utf8')
    script_refs = re.findall(r'<script\b[^>]*\bsrc="([^"]*b2-typeset-[a-f0-9]+\.js)"[^>]*>', html)
    if len(script_refs) != 1:
        raise ValueError('Expected one actual cockpit B2 script reference')
    old_ref = script_refs[0]
    old_rel = (Path('cockpit') / old_ref).as_posix() if not old_ref.startswith('/') else old_ref.lstrip('/')
    original = (release / old_rel).read_bytes()
    patched = patch_cockpit_cache(original.decode('utf8')).encode('utf8')
    new_rel = 'cockpit/assets/b2-typeset-' + proof(patched)['sha256'][:20] + '.js'
    new_ref = '/'+new_rel if old_ref.startswith('/') else 'assets/' + Path(new_rel).name
    if html.count(old_ref) != 1:
        raise ValueError('Unexpected duplicate B2 reference')
    changed_html = original_html.replace(old_ref.encode(), new_ref.encode(), 1)
    manifest_path = release / 'release-manifest.json'
    manifest = json.loads(manifest_path.read_text('utf8'))
    for rel, payload in ((html_rel, original_html), (old_rel, original)):
        if manifest['files'].get(rel) != proof(payload):
            raise ValueError('Input release manifest differs from actual bytes: ' + rel)
    if (release/new_rel).exists() and (release/new_rel).read_bytes() != patched:
        raise ValueError('Refusing to overwrite a content-addressed asset')
    files = {}
    for rel, payload in ((new_rel, patched), (html_rel, changed_html)):
        before = proof((release/rel).read_bytes()) if (release/rel).is_file() else None
        after = proof(payload)
        if before == after:
            continue
        path = output/'files'/rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
        files[rel] = {'before': before, 'after': after, 'source_path': str(path)}
        manifest['files'][rel] = after
    if files:
        manifest['prepared_at_beijing'] = datetime.now(BJT).isoformat()
        manifest['release_id'] = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
    output.mkdir(parents=True, exist_ok=True)
    (output/'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    receipt = {'schema': 'wly.cockpit-cache-preparation.v1', 'status': 'prepared' if files else 'unchanged',
        'input_release': str(release), 'baseline_manifest': proof(manifest_path.read_bytes()),
        'input_bundle': {'path': old_rel, **proof(original)}, 'files': files,
        'html_replacements': {old_ref: new_ref} if old_ref != new_ref else {},
        'release_id': manifest['release_id'], 'manifest_changes': ['files', 'release_id', 'prepared_at_beijing'] if files else [],
        'cache_lifetime_ms': 86400000, 'external_write': False}
    (output/'preparation.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = prepare(args.release, args.output)
    print(json.dumps({'status': result['status'], 'release_id': result['release_id'], 'files': list(result['files'])}))


if __name__ == '__main__':
    main()
