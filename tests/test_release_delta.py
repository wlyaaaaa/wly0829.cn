import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from release_delta import inventory, source_path, stable_evidence

def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / (name + '.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

hybrid, river = load('hybrid-release'), load('prepare-today-river')

class ReleaseDeltaTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix='release-delta-'))
        self.base, self.native = self.root / 'base', self.root / 'native'
        self.base.mkdir(); self.native.mkdir()
        self.put(self.base, 'index.html', '<a href="/cockpit/">home</a>')
        self.put(self.base, '404.html', 'missing')
        self.put(self.base, 'CNAME', 'wly0829.cn\n')
        self.put(self.base, 'kept/index.html', 'untouched route')
        self.put(self.base, '_typeset/runtime/app.js', 'immutable')
        self.put(self.base, '_shared/app.js', 'immutable')
        self.put(self.base, 'cockpit/assets/b2-typeset-1234.js', 'function render(){}')
        self.put(self.base, 'cockpit/assets/today-river-1234.js', 'old river')
        self.put(self.base, 'cockpit/assets/today-river-1234.css', 'old river')
        head = '<script src="assets/b2-typeset-1234.js"></script>'
        old = '<script src="assets/today-river-1234.js"></script><link href="assets/today-river-1234.css" rel="stylesheet">'
        self.html = '<head>'+head+old+old+'</head><body><script id="page-data">{"kind":"cockpit"}</script><div class="screen-equivalent-text" id="cockpit-01-equivalent-text"></div></body>'
        self.put(self.base, 'cockpit/index.html', self.html)
        self.put(self.native, 'cockpit/index.html', self.html.replace('<body>', '<body data-rebuilt="true">'))
        self.put(self.native, 'cockpit/assets/b2-typeset-1234.js', 'function render(){}')
        self.manifest = {'schema':'wly.hybrid-release.v1', 'files':hybrid.inventory(self.base), 'routes':['/','/404.html','/cockpit/','/kept/'], 'prepared_at_beijing':'2026-10-07T20:00:00+08:00'}
        self.accepted = {'/cockpit/': {'status':'pass'}}
        self.manifest['release_id'] = hashlib.sha256(json.dumps(self.manifest['files'],sort_keys=True).encode()).hexdigest()
        self.handoff = self.root/'handoff'; self.handoff.mkdir()
        self.put(self.handoff, 'river2.template.html', 'bound template')

    def put(self, root, rel, text):
        path=root/rel; path.parent.mkdir(parents=True,exist_ok=True); path.write_text(text,'utf8')

    def assemble_river(self, name, sparse):
        native=self.root/(name+'-native')
        hybrid.assemble(self.base,self.native,native,self.manifest,self.accepted,defer=sparse)
        output=self.root/(name+'-river')
        with patch.dict(os.environ, {'WLY_RELEASE_DELTA':'1' if sparse else '0'}):
            river.prepare(native,output,self.handoff)
        current=output/'site'; files=inventory(current)
        changes={rel:{'kind':'integrated_preparation','source_path':str(source_path(current,rel)),'before':self.manifest['files'].get(rel),'after':value} for rel,value in files.items() if rel!='cockpit/index.html' and value!=self.manifest['files'].get(rel)}
        final=self.root/name
        manifest=hybrid.assemble(self.base,current,final,self.manifest,self.accepted,candidate_files=files,overlay={'files':changes})
        manifest['today_river_preparation']=hybrid.read(current/hybrid.MANIFEST)['today_river_preparation']
        hybrid.write(final/hybrid.MANIFEST,manifest)
        return final,current

    def test_sparse_and_full_materialization_have_identical_published_bytes(self):
        full,_=self.assemble_river('full',False)
        sparse,current=self.assemble_river('sparse',True)
        self.assertEqual({p.relative_to(full).as_posix():p.read_bytes() for p in full.rglob('*') if p.is_file()}, {p.relative_to(sparse).as_posix():p.read_bytes() for p in sparse.rglob('*') if p.is_file()})
        self.assertFalse((current/'kept/index.html').exists())
        self.assertEqual((sparse/'kept/index.html').read_bytes(),(self.base/'kept/index.html').read_bytes())
        text=(sparse/'cockpit/index.html').read_text('utf8')
        self.assertEqual(text.count('data-today-river'),1)
        self.assertEqual(len(__import__('re').findall(r'<script[^>]*src="[^"]*today-river-[a-f0-9]+\.js"',text)),1)
        replay=self.root/'replayed'
        with patch.dict(os.environ, {'WLY_RELEASE_DELTA':'0'}):
            river.prepare(sparse,replay,self.handoff)
        self.assertEqual((replay/'site/cockpit/index.html').read_bytes(),(sparse/'cockpit/index.html').read_bytes())
        self.assertEqual((replay/'site/release-manifest.json').read_bytes(),(sparse/'release-manifest.json').read_bytes())

    def test_sparse_changed_asset_tampering_is_rejected_at_final_assembly(self):
        _,current=self.assemble_river('sealed',True)
        rel=next(rel for rel in inventory(current) if 'today-river-' in rel and rel.endswith('.js') and rel not in self.manifest['files'])
        source_path(current,rel).write_bytes(b'tampered')
        with self.assertRaisesRegex(ValueError,'Candidate output changed'):
            hybrid.assemble(self.base,current,self.root/'bad',self.manifest,self.accepted,candidate_files=inventory(current))

    def test_evidence_paths_are_stable_without_losing_hashes(self):
        proof={'path':str(ROOT/'scripts/today-river.js'),'sha256':'abc','source_root':str(self.root/'current')}
        self.assertEqual(stable_evidence(proof,ROOT),{'path':'scripts/today-river.js','sha256':'abc','source_root':'release-input/abc'})
        self.assertEqual(stable_evidence(proof,ROOT),stable_evidence({**proof,'source_root':str(self.root/'another-task')},ROOT))

    def test_album_serialized_recovery_keeps_exact_rollback_bytes(self):
        retry=load('prepare-resource-retry')
        info={'runtime':'_shared/resource-retry-bound.js','addition':'\n<script defer '+retry.MARKER+' src="/_shared/resource-retry-bound.js"></script>\n', 'initial_capture_addition':retry.INITIAL_CAPTURE}
        original=(retry.INITIAL_CAPTURE+'\n<script '+retry.MARKER+' data-album-runtime data-src="/_shared/resource-retry-bound.js"></script>\n<p>保留正文</p>').encode('utf8')
        cleaned,ledger=retry.remove_previous_recovery(original,info)
        self.assertNotIn(retry.MARKER.encode(),cleaned)
        self.assertEqual(retry.restore_previous_recovery(cleaned,ledger),original)
        with self.assertRaises(ValueError):
            retry.remove_previous_recovery(original.replace(b'bound.js',b'other.js'),info)
