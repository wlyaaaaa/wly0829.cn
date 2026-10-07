"""Small adversarial DOM fixtures, measured by an isolated installed Chrome."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('site_ui', ROOT/'scripts/check-site-ui.py')
site_ui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site_ui)
STYLE = '''<style>
body {margin:20px;font:16px Arial} .row {display:flex;align-items:flex-start;gap:20px}
.btn {display:inline-flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;
width:160px;height:48px;padding:8px;border:1px solid black;font:16px/20px Arial}
.btn svg {width:16px;height:16px;flex:none} .cards {display:grid;grid-template-columns:repeat(3,1fr);width:600px;gap:10px}
.cards article {height:70px;background:#ddd}
</style>'''
ICON = '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>'
IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'


class SiteUiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.allowed = Path('E:/Cache/Codex/Temp')
        cls.allowed.mkdir(parents=True, exist_ok=True)
        cls.folder = Path(tempfile.mkdtemp(prefix='site-auto-review-test-', dir=cls.allowed))
        cls.previous = {key: os.environ.get(key) for key in ('TEMP', 'TMP', 'TMPDIR')}
        os.environ.update({key: str(cls.folder) for key in cls.previous})
        cls.context = cls.pw = None
        cls.addClassCleanup(cls.cleanup)
        cls.pw = sync_playwright().start()
        cls.context = cls.pw.chromium.launch_persistent_context(str(cls.folder/'profile'),
            executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True,
            viewport={'width': 800, 'height': 600})
        cls.page = cls.context.pages[0]
        cls.dom = (ROOT/'scripts/site-ui-dom.js').read_text('utf8')

    @classmethod
    def cleanup(cls):
        if cls.context: cls.context.close()
        if cls.pw: cls.pw.stop()
        for key, value in cls.previous.items():
            if value is None: os.environ.pop(key, None)
            else: os.environ[key] = value
        result = subprocess.run(['pwsh', '-NoProfile', '-File', 'E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
            '-LiteralPath', str(cls.folder), '-AllowedRoot', str(cls.allowed), '-Json'], capture_output=True,
            text=True, encoding='utf8', creationflags=subprocess.CREATE_NO_WINDOW,
            env={**os.environ, **{key: str(cls.folder) for key in cls.previous}})
        receipt = json.loads(result.stdout.lstrip('\ufeff'))
        if result.returncode or receipt.get('status') != 'recycled' or not receipt.get('original_path_verified') or not receipt.get('recovery_item_exists'):
            raise AssertionError('Fixture recycle was not verified: '+result.stdout+result.stderr)

    def scan(self, body):
        self.page.set_content(STYLE+body, wait_until='load')
        self.page.evaluate('document.fonts.ready')
        return self.page.evaluate(self.dom)

    def test_centered_icon_group_card_links_and_hidden_content_do_not_report(self):
        result = self.scan('<div class="row"><button class="btn">Open</button>'
            '<button class="btn">'+ICON+'<span>Open</span></button><a class="btn" href="/">Open</a></div>'
            '<a href="/" style="display:block;height:160px;border:1px solid;padding:20px">'
            '<h2>A long card title</h2><p>This is a descriptive card, not a compact button.</p></a>'
            '<div hidden><button class="btn" style="text-align:left">Hidden</button>'
            '<img src="broken:" width="40" height="40"><svg width="40" height="40"></svg></div>')
        self.assertEqual(result['issues'], [])
        self.assertEqual(result['counts']['buttons'], 3)
        self.assertEqual(result['counts']['images'], 1)

    def test_button_center_wrapping_and_overflow_are_detected(self):
        fixtures = [
            ('button-center', 'justify-content:flex-start', 'Open'),
            ('button-wrap', 'width:70px', 'Wrap This Text'),
            ('button-overflow', 'width:70px;white-space:nowrap', 'LongOverflowText')]
        for kind, style, label in fixtures:
            with self.subTest(kind=kind):
                issues = self.scan('<button id="bad" class="btn" style="'+style+'">'+label+'</button>')['issues']
                self.assertIn((kind, '#bad'), [(item['kind'], item['element']) for item in issues])

    def test_same_row_height_and_vertical_alignment_are_detected(self):
        for style, expected in [('height:62px', {'button-row-height', 'button-row-align'}),
                                ('transform:translateY(8px)', {'button-row-align'})]:
            with self.subTest(style=style):
                issues = self.scan('<div class="row"><button class="btn">One</button>'
                    '<button class="btn" style="'+style+'">Two</button></div>')['issues']
                self.assertTrue(expected <= {item['kind'] for item in issues}, issues)

    def test_grid_last_single_card_must_start_in_first_column(self):
        prefix = '<div id="grid" class="cards">'+('<article>Card</article>'*3)
        self.assertEqual(self.scan(prefix+'<article>Last</article></div>')['issues'], [])
        issues = self.scan(prefix+'<article style="grid-column:2">Last</article></div>')['issues']
        self.assertIn(('grid-row-offset', '#grid'), [(item['kind'], item['element']) for item in issues])

    def test_missing_broken_empty_and_placeholder_assets_are_detected(self):
        fixtures = [
            ('image-source-missing', '<img width="40" height="40">'),
            ('image-load-failed', '<img src="data:image/png;base64,broken" width="40" height="40">'),
            ('svg-empty', '<svg width="40" height="40"><defs><rect width="30" height="30"/></defs></svg>'),
            ('svg-empty', '<svg width="40" height="40"><g opacity="0"><rect width="30" height="30"/></g></svg>'),
            ('image-text-unmeasurable', '<a class="hotspot" data-typeset-kind="link" aria-label="电脑状态看驾驶舱" href="/cockpit/#pc" style="display:block;width:172px;height:73px"></a>'),
            ('image-placeholder', '<img src="'+IMAGE+'" alt="placeholder" width="40" height="40">')]
        self.assertEqual(self.scan('<img src="'+IMAGE+'" width="40" height="40">')['issues'], [])
        for kind, markup in fixtures:
            with self.subTest(kind=kind, markup=markup):
                issues = self.scan(markup)['issues']
                self.assertIn(kind, {item['kind'] for item in issues})

    def test_inventory_refuses_empty_and_unknown_and_maps_page_ids(self):
        folder = self.folder/'routes'
        folder.mkdir()
        with self.assertRaises(ValueError): site_ui.inventory(folder)
        for rel, name in [('index.html', 'home'), ('guide/index.html', 'guide'), ('guide/detail/index.html', 'guide')]:
            file = folder/rel
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text('<script id="page-data">'+json.dumps({'page': name})+'</script>', 'utf8')
        self.assertEqual(site_ui.inventory(folder, ['guide']), ['/guide/', '/guide/detail/'])
        self.assertEqual(site_ui.inventory(folder, ['homepage', '/guide/']), ['/', '/guide/'])
        with self.assertRaises(ValueError): site_ui.inventory(folder, ['not-a-page'])

    def test_ci_page_scope_and_gate_failure_propagation(self):
        source = (ROOT/'scripts/verify-public-content.mjs').read_text('utf8')
        block = source[source.rindex('\nif (process.env.GITHUB_ACTIONS'):]
        script = self.folder/'ci-fixture.cjs'
        script.write_text(r'''const fs=require('node:fs'), AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const block=fs.readFileSync(0,'utf8');
async function check(changes,fail=false) { const calls=[]; let error=null;
  const exec=(cmd,args)=>{calls.push([cmd,args]);if(cmd==='git'&&args[0]==='diff')return Buffer.from(changes.join('\n'));if(args[0].endsWith('check-site-ui.py')&&fail)throw Error('gate failed');return Buffer.alloc(0);};
  const run=new AsyncFunction('execFileSync','readFile','path','process','findings','projectRoot','scriptDirectory','distRoot',block);
  try {await run(exec,async()=>JSON.stringify({before:'a'.repeat(40)}),{join:(...p)=>p.join('/')},{env:{GITHUB_ACTIONS:'true',GITHUB_EVENT_PATH:'event.json'}},[],'/project','/project/scripts','/dist');}
  catch(e){error=e.message;}
  return {args:calls.find(c=>c[1][0].endsWith('check-site-ui.py'))?.[1],error}; }
const html='site-release/computer-access/index.html';
Promise.all([check([html]),check([html,'site-release/shared.css']),check([html],true)]).then(rows=>console.log(JSON.stringify(rows))).catch(e=>{console.error(e);process.exitCode=1;});
''', 'utf8')
        result = subprocess.run(['node', str(script)], input=block, capture_output=True, text=True,
            encoding='utf8', creationflags=subprocess.CREATE_NO_WINDOW)
        self.assertEqual(result.returncode, 0, result.stderr)
        single, shared, failed = json.loads(result.stdout)
        self.assertEqual(single['args'][-2:], ['--pages', '/computer-access/'])
        self.assertNotIn('--full', single['args'])
        self.assertEqual(shared['args'][-1], '--full')
        self.assertNotIn('--pages', shared['args'])
        self.assertEqual(failed['error'], 'gate failed')


if __name__ == '__main__': unittest.main()
