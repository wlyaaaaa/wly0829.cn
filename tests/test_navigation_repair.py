"""Published-target, original-copy and two-generation navigation regressions."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('navigation', ROOT / 'scripts/repair-release-navigation.py')
nav = importlib.util.module_from_spec(spec); spec.loader.exec_module(nav)
spec = importlib.util.spec_from_file_location('hybrid', ROOT / 'scripts/hybrid-release.py')
hybrid = importlib.util.module_from_spec(spec); spec.loader.exec_module(hybrid)


class NavigationRepair(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='navigation-fixture-')
        self.root = Path(self.temp.name)

    def tearDown(self): self.temp.cleanup()

    def put(self, rel, text):
        path = self.root / rel; path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf8'); return path

    def test_topic_selects_real_workbench_and_original_page_wins_after_publication(self):
        self.put('index.html', '<h1>首页</h1>')
        self.put('rules/index.html', '<article id="rule-panel-privacy_data_contract">真实说明</article>')
        original = '/rules/privacy-data/#p-classification'
        self.assertEqual(nav.resolve_navigation(original, nav.page_inventory(self.root)),
                         '/rules/?rule=privacy_data_contract#rule-panel-privacy_data_contract')
        self.put('rules/privacy-data/index.html', '<h2 id="p-classification">已发布原专题</h2>')
        self.assertEqual(nav.resolve_navigation(original, nav.page_inventory(self.root)), original)

    def test_unpublished_page_and_anchor_use_nearest_actual_page_without_inventing_hash(self):
        self.put('index.html', '<h1>首页</h1>')
        self.put('projects/index.html', '<h1>项目</h1>')
        self.put('projects/codex-remote/index.html', '<h1>Codex 远程</h1>')
        pages = nav.page_inventory(self.root)
        self.assertEqual(nav.resolve_navigation('/projects/codex-local-remote/', pages), '/projects/codex-remote/')
        self.assertEqual(nav.resolve_navigation('/projects/future/#missing', pages), '/projects/')
        self.assertEqual(nav.resolve_navigation('/projects/codex-remote/#missing', pages), '/projects/codex-remote/')

    def test_private_repository_keeps_displayed_text_and_cannot_supply_link_from_metadata(self):
        original = '<a href="https://github.com/wlyaaaaa/github-local-index" target="_blank"><b>GitHub 总索引</b></a><script>{"repositoryUrl":"https://github.com/wlyaaaaa/github-local-index"}</script>'
        result = nav.remove_private_links(original)
        self.assertIn('<b>GitHub 总索引</b>', result)
        self.assertNotIn('<a', result); self.assertNotIn('https://github.com/wlyaaaaa/github-local-index', result)
        self.assertIn('"repositoryUrl":""', result)

    def test_search_rebuild_uses_real_screen_copy_and_removes_only_stale_targets(self):
        self.put('index.html', '<h1>新首页</h1>')
        self.put('skills/index.html', '<a class="skill-directory-item" href="/skills/documents/">文档</a>')
        screen = {'title': '微信聊天读取', 'screens': [{'id': 'chat', 'title': '找到原话'}]}
        self.put('projects/wechatdirect/index.html', '<title>微信聊天读取</title><section id="chat"><div data-screen-transcript="chat">聊天、语音和附件能回到原件。暂时读不到时保留未知。</div></section><script id="page-data">' + json.dumps(screen, ensure_ascii=False) + '</script>')
        valid = {'type':'规则','title':'已有有效规则','detail':'保持原文','href':'/skills/','search':'未改说明','unknown_source_path':'must-not-be-published'}
        stale = {'type':'旧首页','title':'失效','detail':'旧','href':'/#deleted','search':'旧'}
        self.put('search-index.js', nav.serialize_search([valid, stale]))
        self.put('search-projects.js', nav.serialize_search([], True))
        changed, invalid, count = nav.repair_search(self.root, nav.page_inventory(self.root))
        records = nav.search_records((self.root/'search-index.js').read_text()) + nav.search_records((self.root/'search-projects.js').read_text())
        self.assertEqual(len(invalid), 1)
        self.assertTrue(any(e['title']=='已有有效规则' and e['search']=='未改说明' for e in records))
        actual = next(e for e in records if e['href']=='/projects/wechatdirect/#chat')
        self.assertIn('暂时读不到时保留未知', actual['search'])
        self.assertFalse(any(e['href']=='/#deleted' for e in records))
        self.assertFalse(any('unknown_source_path' in e for e in records))

    def test_prior_fallback_restores_automatically_when_target_is_in_next_hybrid_release(self):
        old=self.root/'old'; candidate=self.root/'candidate'; old.mkdir(); candidate.mkdir()
        data={'neighbors':{'next':{'title':'目标','href':'/','original_href':'/future/#actual'}}}
        (old/'index.html').write_text('<h1>原首页</h1>',encoding='utf8')
        (old/'404.html').write_text('404',encoding='utf8')
        (old/'kept').mkdir(); (old/'kept/index.html').write_text('<script id="page-data">'+json.dumps(data)+'</script>',encoding='utf8')
        (candidate/'future').mkdir(); (candidate/'future/index.html').write_text('<h1 id="actual">已发布目标</h1>',encoding='utf8')
        baseline={'files':hybrid.inventory(old),'routes':['/','/kept/','/404.html']}
        out=self.root/'out'; manifest=hybrid.assemble(old,candidate,out,baseline,{'/future/':{}})
        result=json.loads(nav.PAGE_DATA.search((out/'kept/index.html').read_text())[2])
        self.assertEqual(result['neighbors']['next']['href'],'/future/#actual')
        self.assertEqual(manifest['release_overlay']['kept/index.html']['kind'],'navigation_restoration')
        self.assertEqual(hybrid.verify_release(out)['release_id'],manifest['release_id'])

    def test_viewer_text_node_handler_uses_parent_element(self):
        text="document.addEventListener('selectstart',e=>{if(e.target.closest('.screen picture,.screen .hotspot,.raster-card'))e.preventDefault();});"
        patched=nav.patch_viewer_runtime(text)
        self.assertIn('e.target instanceof Element?e.target:e.target?.parentElement',patched)
        self.assertEqual(nav.patch_viewer_runtime(patched),patched)

    def test_project_runtime_dialog_hash_survives_absolute_link_conversion_and_restores_old_fallback(self):
        route='/projects/example/'
        data={'kind':'project','url':route,'screens':[{'links':[
            {'href':route,'original_href':route+'#ai-brief','text':'复制 AI 续作说明'}]}]}
        page=self.put('projects/example/index.html','<script id="page-data">'+json.dumps(data)+'</script>')
        self.put('index.html','首页')
        pages=nav.page_inventory(self.root)
        self.assertTrue(nav.target_exists(route+'#ai-brief',pages))
        self.assertEqual(nav.resolve_navigation(route+'#ai-brief',pages),route+'#ai-brief')
        candidate='<a href="'+route+'#ai-brief">复制 AI 续作说明</a>'
        self.assertEqual(hybrid.rewrite_links(candidate,self.root,page,set(pages),[],navigation_pages=pages),candidate)
        nav.restore_pending_links(self.root,pages)
        corrected=json.loads(nav.PAGE_DATA.search(page.read_text())[2])
        self.assertEqual(corrected['screens'][0]['links'][0]['href'],route+'#ai-brief')
        self.put('ordinary/index.html','<script id="page-data">{"kind":"how"}</script>')
        self.assertFalse(nav.target_exists('/ordinary/#ai-brief',nav.page_inventory(self.root)))

    def test_existing_navigation_labels_correct_all_three_surfaces_without_touching_source_provenance(self):
        for label,target in nav.SITE_NAVIGATION.items():
            self.put(nav.route_file(target),'<title>'+label+'</title>')
        data={'page':'home','url':'/','screens':[{'links':[
            {'id':'home-01-link-1-0','href':'/projects/agents/','original_href':'/projects/agents/'},
            {'id':'home-01-link-2-0','href':'/'}]}],
              'source_meta':{'original_html':'<a href="/">怎么协作</a>'}}
        anchor='<a class="nav-link" href="/"><span data-label-text="怎么协作"><img alt="怎么协作"></span></a>'
        text='<header>'+anchor+'</header><dialog id="menu">'+anchor+'</dialog><footer>'+anchor+'</footer>'
        text+='<main><a href="/">怎么协作</a></main><script id="page-data">'+json.dumps(data)+'</script>'
        corrected,changes=nav.repair_owned_navigation(text,nav.page_inventory(self.root),'/')
        self.assertEqual(corrected.count('href="/how/"'),3)
        self.assertIn('<main><a href="/">怎么协作</a></main>',corrected)
        result=json.loads(nav.PAGE_DATA.search(corrected)[2])
        self.assertEqual(result['source_meta'],data['source_meta'])
        self.assertEqual(result['screens'][0]['links'][0]['href'],'/how/')
        self.assertEqual(result['screens'][0]['links'][1]['href'],'/cockpit/')
        self.assertEqual(nav.repair_owned_navigation(corrected,nav.page_inventory(self.root),'/')[0],corrected)

    def test_runtime_dialog_hash_survives_registered_project_alias_restoration(self):
        canonical='/projects/codex-remote/';original='/projects/codex-local-remote/#ai-brief'
        data={'kind':'project','url':canonical,'screens':[{'links':[{'href':canonical,'original_href':original}]}]}
        text='<a href="'+canonical+'" data-original-href="'+original+'">复制 AI 续作说明</a><script id="page-data">'+json.dumps(data)+'</script>'
        self.put(nav.route_file(canonical),text)
        corrected,restored=nav.restore_pending_html(text,nav.page_inventory(self.root))
        self.assertTrue(restored)
        self.assertIn('href="'+canonical+'#ai-brief"',corrected)
        self.assertEqual(json.loads(nav.PAGE_DATA.search(corrected)[2])['screens'][0]['links'][0]['href'],canonical+'#ai-brief')

    def test_rule_neighbors_use_one_order_and_every_forward_link_returns_to_its_source(self):
        for topic in nav.RULE_TOPICS:
            route='/rules/'+topic+'/'
            data={'url':route,'title':topic,'neighbors':{'previous':{'href':'/wrong/','title':'wrong'}}}
            self.put(nav.route_file(route),'<title>'+topic+'</title><script id="page-data">'+json.dumps(data)+'</script>')
        pages=nav.page_inventory(self.root)
        for topic in nav.RULE_TOPICS:
            route='/rules/'+topic+'/'
            expected=nav.rule_neighbors(route,pages)
            corrected,_=nav.repair_owned_navigation((self.root/nav.route_file(route)).read_text(),pages,route)
            self.assertEqual(json.loads(nav.PAGE_DATA.search(corrected)[2])['neighbors'],expected)
            if expected.get('next'):
                self.assertEqual(nav.rule_neighbors(expected['next']['href'],pages)['previous']['href'],route)
        self.assertIn('claude-adapter',nav.RULE_TOPICS)

    def test_release_search_serializer_cannot_reintroduce_source_path_or_unknown_fields(self):
        raw={'title':'例子','href':'/projects/example/','detail':'先读 E:\\Fixture\\steps.md。继续说明。',
             'search':'来源 file:///E:/Fixture/picture.png。','aliases':['\\\\fixture\\files\\input.json'],
             'producer':{'source_path':'E:\\Fixture\\provenance.json'}}
        text=nav.serialize_search([raw])
        row=nav.search_records(text)[0]
        self.assertNotIn('producer',row)
        self.assertEqual(row['detail'],'先读 （本机路径）。继续说明。')
        self.assertNotIn('Fixture',text);self.assertNotIn('fixture',text)


if __name__ == '__main__': unittest.main()
