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
