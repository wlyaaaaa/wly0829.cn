"""Regression checks for the public projection, image prose and page metadata."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from public_page_contract import public_page_data, public_search_records, omit_local_literals, local_values
spec=importlib.util.spec_from_file_location('audit_publication',ROOT/'scripts/audit-page-publication.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)

class PublicProjection(unittest.TestCase):
    def test_unknown_fields_never_enter_even_with_innocent_names(self):
        data={'title':'本地文字识别','url':'/projects/localocr/',
              'unexpected':{'anything':r'Q:\private\build'},
              'shared':{'group_leaf':{'src':'/leaf.webp','crop':[0,0,3,4],
                        'source':r'E:\Cache\input.png','new_metadata':{'owner':'private'}},
                        'selection_event_repair':{'output':'local'}}}
        omitted=[];result=public_page_data(data,omitted)
        self.assertEqual(result['shared']['group_leaf'],{'src':'/leaf.webp','crop':[0,0,3,4]})
        self.assertNotIn('unexpected',result)
        self.assertIn('page-data.unexpected',omitted)
    def test_authored_path_request_survives_projection(self):
        title=r'比如我问“E:\GitHub总索引这个目录最后会推到哪里？”'
        self.assertEqual(public_page_data({'title':title}),{'title':title})
    def test_public_field_retains_authored_path(self):
        data={'title':r'E:\Cache\build'}
        self.assertEqual(public_page_data(data),data)
    def test_rule_prose_and_ordinary_fields_retain_authored_paths(self):
        original=r'<p>入口是 E:\.agents\tools\Invoke-EAgentRulesRelease.ps1。</p>'
        data={'screens':[{'source_meta':{'original_html':original}}],'title':r'E:\Cache\build'}
        self.assertEqual(public_page_data(data),data)
    def test_coordinates_labels_actions_and_resources_survive(self):
        data={'title':'项目','screens':[{'id':'a','parts':[{'src':'/a.webp','size':[1440,915],
              'links':[{'href':'/rules/','text':'规则','rect':[.1,.2,.3,.4]}],
              'native_actions':[{'action':'copy','copy_text':'原文','rect':[0,0,1,1]}]}]}],
              'shared':{'nav_labels':{'项目':{'src':'/nav.webp','size':[200,60],'ink_left':.1,
              'encoded_edges':{'avif':{'ink_right':.8}}}}}}
        self.assertEqual(public_page_data(data),data)
    def test_video_mount_decision_survives_projection_without_source_records(self):
        video={'src':'/hero.mp4','mask':'/mask.png','mount_allowed':True,
               'compatibility':{'status':'matched_provenance','reason':'当前插画与影片同源',
                                'source_record':{'input':'producer-only'}},
               'producer_record':{'input':'producer-only'}}
        result=public_page_data({'video':video})['video']
        self.assertIs(result['mount_allowed'],True)
        self.assertEqual(result['compatibility'],{'status':'matched_provenance','reason':'当前插画与影片同源'})
        self.assertNotIn('producer_record',result)
    def test_search_projection_drops_new_source_notes(self):
        data=[{'title':'查找材料','href':'/projects/personal-materials/','scopes':['projects'],'source_notes':{'origin':r'E:\Cache\work'}}]
        result=public_search_records(data)
        self.assertEqual(result,[{'title':'查找材料','href':'/projects/personal-materials/','scopes':['projects']}])
    def test_safe_unc_and_relative_paths_survive(self):
        self.assertEqual(omit_local_literals(r'\\server\share\item.txt'), r'\\server\share\item.txt')
        relative=json.dumps(r'.\scripts\helper.ps1')
        self.assertEqual(local_values(relative),[])

class TranscriptMetadata(unittest.TestCase):
    def setUp(self):
        # The caller sets TEMP to its own E-drive directory. Retain the small
        # fixture until the task's recycle-bin closeout; no recursive deletion.
        self.root=Path(tempfile.mkdtemp(prefix='audit-publication-test-'))
        (self.root/'cover.webp').write_bytes(b'fixture')
        (self.root/'favicon.svg').write_text('<svg/>',encoding='utf8')
    def fixture(self):
        return '<html><head><title>旧名</title></head><body><main><section data-screen="one"><picture><img data-src="/cover.webp" alt="开头"></picture><a href="/rules/">规则</a></section></main></body></html>'
    def test_rendered_prose_excludes_file_urls_and_keeps_actual_words(self):
        value='<html><head><title>页面包装</title><style>not prose</style></head><body><div class="ghost">本地文字识别</div><p>模型 18 个，3.9 GB。</p><img src="file:///E:/Cache/input.png" alt="参考图"><script>ignored</script></body></html>'
        text=audit.rendered_text(value)
        self.assertIn('模型 18 个，3.9 GB。',text)
        self.assertIn('本地文字识别',text)
        self.assertNotIn('file:',text)
        self.assertNotIn('ignored',text)
        self.assertNotIn('页面包装',text)
    def test_spaced_path_preserves_complete_prose(self):
        prose=r'例如 C:\Program Files\<软件名>；后面的中文也保留。'
        self.assertEqual(omit_local_literals(prose,replacement='（本机路径）'),prose)
    def test_hidden_body_attached_without_changing_visible_image_or_link(self):
        result,count=audit.install_transcripts(self.fixture(),{'one':{'h':'完整定稿原文。','v':'竖版完整定稿原文。'}},'/example/')
        self.assertEqual(count,1)
        self.assertIn('data-src="/cover.webp"',result)
        self.assertIn('<a href="/rules/">规则</a>',result)
        self.assertIn('aria-describedby="one-equivalent-text"',result)
        self.assertIn('data-transcript-orientation="v">竖版完整定稿原文。',result)
        repeated,_=audit.install_transcripts(result,{'one':{'h':'完整定稿原文。','v':'竖版完整定稿原文。'}},'/example/')
        self.assertEqual(repeated,result)
    def test_fingerprint_change_refuses_source(self):
        path=self.root/'source.json';path.write_text('{}',encoding='utf8')
        with self.assertRaisesRegex(ValueError,'fingerprint changed'):
            audit.verified_bytes(path,{'sha256':'wrong'})
    def test_project_and_skill_titles_distinct_canonical_and_shared_picture(self):
        data={'title':'本地文字识别'}
        proj,pm=audit.apply_metadata(self.fixture(),'/projects/localocr/',self.root,data)
        skill,sm=audit.apply_metadata(self.fixture(),'/skills/localocr/',self.root,data)
        self.assertNotEqual(pm['title'],sm['title'])
        self.assertEqual(pm['canonical'],'https://wly0829.cn/projects/localocr/')
        self.assertIn('property="og:image" content="https://wly0829.cn/cover.webp"',proj)
        self.assertIn('href="/favicon.svg"',proj)
        self.assertIn('name="twitter:image"',skill)
    def test_home_uses_existing_name_and_first_paragraph(self):
        source={'title':'首页','screens':[{'text':'# 吴乐阳\n\n**在杭州。Java 出身，现在的乐趣是让 AI 替我把电脑和日常打理好。**\n\n后面的原文。'}]}
        result,meta=audit.apply_metadata(self.fixture(),'/',self.root,{'title':'首页'},source)
        self.assertEqual(meta['title'],'吴乐阳 · 首页 · wly0829.cn')
        self.assertEqual(meta['description'],'在杭州。Java 出身，现在的乐趣是让 AI 替我把电脑和日常打理好。')
        self.assertEqual(meta['image'],'https://wly0829.cn/cover.webp')
    def test_json_newline_after_path_cannot_be_removed_as_path_suffix(self):
        value={'text':'配置在 E:\\Tools\\helper.ps1\n下一段完整保留。','source_notes':'E:\\Cache\\task'}
        source='<script type="application/json" data-continuation-context="">'+json.dumps(value,ensure_ascii=False)+'</script>'
        result=audit.scrub_html_literals(source,[],'/example/')
        data=json.loads(result.split('>',1)[1].rsplit('</script>',1)[0])
        self.assertEqual(data['text'],value['text'])
        self.assertEqual(local_values(data),[])
    def test_final_projection_is_idempotent_and_preserves_metadata(self):
        data={'title':'材料','url':'/','shared':{'group_leaf':{'src':'/leaf.webp','source':r'E:\Cache\input'}}}
        html=self.fixture().replace('</body>','<script id="page-data" type="application/json">'+json.dumps(data)+'</script></body>')
        (self.root/'index.html').write_text(html,encoding='utf8')
        (self.root/'search-index.js').write_text('window.__WLY_SEARCH_INDEX__='+json.dumps([{'title':'材料','href':'/','detail':r'读 E:\Docs\file.txt，继续。','source_notes':'internal'}],ensure_ascii=False)+';',encoding='utf8')
        first=audit.finalize_public_fields(self.root)
        text=(self.root/'index.html').read_text('utf8')
        self.assertEqual(first['remaining_local_literals'],[])
        self.assertEqual(audit.finalize_public_fields(self.root)['changed_files'],[])
        self.assertIn('<title>旧名</title>',text)
    def test_orientation_duplicates_are_reported_once(self):
        facts=[{'route':'/x/','screen':'one','orientation':orient,'value':r'E:\Docs'} for orient in ('h','v')]
        result=audit.unique_source_conflicts(facts)
        self.assertEqual(len(result),1)
        self.assertEqual(result[0]['orientations'],['h','v'])

if __name__=='__main__':unittest.main()
