import importlib.util,tempfile,unittest
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'scripts/prepare-toc-consistency.py';s=importlib.util.spec_from_file_location('toc',P);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class Toc(unittest.TestCase):
 def test_only_directory_changes_and_rerun_is_stable(self):
  with tempfile.TemporaryDirectory() as d:
   r=Path(d);p=r/'index.html';p.write_text('<head></head><header><a href="/projects/">项目</a></header><nav class="toc"><div class="toc-inner toc-text"><a class="nav-link" href="/projects/" data-section="projects" data-label-h="项目" data-label-v="项目"><img alt="项目"></a></div></nav><main><span id="projects"></span><p>正文保留</p></main>',encoding='utf8')
   proof=m.prepare_toc(r,{'项目':{'src':'/label.webp','size':[100,50],'ink_left':0,'ink_right':1,'ink_top':0,'ink_bottom':1}});self.assertEqual(proof['page_count'],1);text=p.read_text('utf8');self.assertIn('<header><a href="/projects/">项目</a></header>',text);self.assertIn('href="#projects"',text);self.assertIn('<p>正文保留</p>',text);before=p.read_bytes();self.assertEqual(m.prepare_toc(r)['page_count'],0);self.assertEqual(p.read_bytes(),before)
 def test_missing_section_is_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'index.html';p.write_text('<head></head><nav class="toc"><a data-section="gone" data-label-h="缺少" href="#gone">缺少</a></nav>',encoding='utf8')
   with self.assertRaisesRegex(ValueError,'Missing section'):m.prepare_toc(Path(d),{'缺少':{'src':'/label.webp','size':[100,50],'ink_left':0,'ink_right':1,'ink_top':0,'ink_bottom':1}})
if __name__=='__main__':unittest.main()
