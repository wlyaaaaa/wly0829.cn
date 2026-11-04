"""Generated interaction pictures keep their finalized resource addresses."""
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('interaction_oss', ROOT/'scripts/prepare-oss-release.py')
oss = importlib.util.module_from_spec(spec); spec.loader.exec_module(oss)


class PageInteractionAssetsTests(unittest.TestCase):
    def test_finalized_art_table_drives_images_and_absent_table_makes_no_request(self):
        art = {key: '/_shared/'+key+'.webp' for key in ('back_to_top', 'easter_bird')}
        files = {'index.html': {}, 'interaction.js': {}, **{value.lstrip('/'): {} for value in art.values()}}
        rewrite = oss.Rewriter(files, 'https://example.oss.invalid', 'releases/current', 'https://wly0829.cn', version=7)
        body = ('<script src="/interaction.js" data-art=\''+json.dumps(art)+'\'></script>').encode()
        final = rewrite.rewrite(body, 'index.html').decode()
        table = next(attrs['data-art'] for tag, attrs, *_ in oss.HtmlTags(final).tags if tag == 'script')
        runner = r"""const fs=require('node:fs'),vm=require('node:vm'),images=[];
const element=()=>({setAttribute(){},append(i){images.push(i.src)},classList:{contains(){return false}}});
const document={currentScript:{dataset:{art:process.argv[2]}},querySelector(){return null},createElement:element,addEventListener(){},body:{append(){},classList:{contains(){return false}}}};
vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),{window:{},document,Image:class{},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},scrollY:0,innerHeight:1000});
process.stdout.write(JSON.stringify(images));"""
        script = ROOT/'site-astro/src/scripts/page-interactions.js'
        for data, expected in [(table, ['https://example.oss.invalid/releases/current'+value for value in art.values()]), ('', [])]:
            result = subprocess.run(['node', '-e', runner, str(script), data], capture_output=True, text=True, check=True)
            self.assertEqual(json.loads(result.stdout), expected)
        self.assertEqual(rewrite.references['index.html'], {'interaction.js', *(value.lstrip('/') for value in art.values())})
        self.assertFalse(rewrite.missing)


if __name__ == '__main__': unittest.main()
