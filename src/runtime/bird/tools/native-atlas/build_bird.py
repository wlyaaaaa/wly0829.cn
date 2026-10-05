"""从现有图集构建任务专用鸟，不触碰原正式包。"""
import json, subprocess
from pathlib import Path

work = Path(__file__).resolve().parent
directory = work / 'bird'
j = json.loads((directory / 'bird-atlas.json').read_text('utf-8'))
atlas = dict(image=j['image'], size=j['size'], standH=j['standH'],
             body=[round(x) for x in j['bodyFromFeet']],
             poses={k: [p['x'], p['y'], p['w'], p['h'], round(p['ax']), round(p['ay']), int(p['kind']=='body')]
                    for k,p in j['poses'].items()})
source = (directory / 'bird.src.js').read_text('utf-8').replace('__ATLAS__', json.dumps(atlas,separators=(',',':')))
import re
source = re.sub(r'/\*TEST\*/[\s\S]*?/\*END\*/', '', source)
(directory / 'bird.full.js').write_text(source, encoding='utf-8')
node = "const e=require('C:/Users/10979/AppData/Roaming/npm/node_modules/tsx/node_modules/esbuild');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>process.stdout.write(e.transformSync(s,{minify:true,target:'es2017',charset:'utf8',legalComments:'none'}).code));"
result = subprocess.run(['node','-e',node], input=source.encode(), capture_output=True, check=True)
(directory/'bird.js').write_bytes(result.stdout)
print(json.dumps({'bird_bytes':len(result.stdout),'atlas_bytes':(directory/'bird-atlas.webp').stat().st_size}))
