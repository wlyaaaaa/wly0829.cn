"""Exercise the real producer-HTML measurement service without viewing images."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ['typeset-root','legacy-site','run-root']:ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--pages',nargs='+',required=True);args=ap.parse_args()
    run=args.run_root.resolve();run.mkdir(parents=True,exist_ok=True);cache=run/'cache';cache.mkdir(exist_ok=True)
    env={**os.environ,'TEMP':str(cache),'TMP':str(cache),'TMPDIR':str(cache)}
    build=run/'local-build-context.json';build.write_text('{"pages":{}}',encoding='utf8')
    geometry=run/'geometry.json';log=run/'server.log'
    with log.open('w',encoding='utf8') as stream:
        server=subprocess.Popen([sys.executable,'-u',str(ROOT/'scripts/serve-typeset-preview.py'),'--root',str(ROOT/'site-release'),'--build-report',str(build),'--verification-out',str(run/'qa-unused.json'),'--typeset-root',str(args.typeset_root.resolve()),'--legacy-site',str(args.legacy_site.resolve()),'--geometry-out',str(geometry),'--port','0'],stdout=stream,stderr=subprocess.STDOUT,env=env,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
        try:
            address=None
            for _ in range(100):
                match=re.search(r'http://127\.0\.0\.1:\d+',log.read_text('utf8'))
                if match:address=match[0];break
                if server.poll() is not None:raise RuntimeError('Measurement server stopped')
                time.sleep(.1)
            if not address:raise RuntimeError('Measurement server startup failed')
            child=subprocess.run([sys.executable,'-u',str(ROOT/'scripts/run-typeset-checks.py'),'--mode','geometry','--url',address,'--task-cache',str(cache),'--pages',*args.pages],env=env,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
            spec=importlib.util.spec_from_file_location('geometry_motion',ROOT/'scripts/prepare-motion-release.py');motion=importlib.util.module_from_spec(spec);spec.loader.exec_module(motion)
            snapshot=json.loads(geometry.read_text('utf8'));summary={};issues=[]
            for record in snapshot['records']:
                entry=summary.setdefault(record['page'],{'records':0,'active_markers':0,'measured_markers':0,'absence_records':0,'issues':[],'circled_numbers':[]})
                entry['records']+=1;cap=record.get('dot_capability',{});entry['active_markers']+=cap.get('active_markers',0);entry['measured_markers']+=cap.get('measured_markers',0);entry['absence_records']+=cap.get('status')=='no_corresponding_element'
                try:
                    if motion.file_stamp(record['html'])['sha256']!=record['html_sha256']:raise ValueError('Producer HTML changed after planning')
                    for part in record['parts']:
                        image=args.typeset_root/record['page']/part['image']
                        if motion.file_stamp(image)['sha256']!=part['sha256']:raise ValueError('Producer PNG changed after planning')
                    motion.dot_evidence(record,Path(record['html']).read_text('utf8'))
                except ValueError as error:entry['issues'].append(str(error))
                entry['issues']+=record.get('issues',[]);entry['circled_numbers'] += [{'screen':record['screen'],'orientation':record['orientation'],'text':number['text'],'value':number['value']} for number in record.get('numbers',[]) if number.get('notation')=='circled']
            missing=set(args.pages)-set(summary)
            issues += ['page has no measured records: '+name for name in sorted(missing)]
            issues += [name+': '+issue for name,entry in summary.items() for issue in entry['issues']]
            report={'schema':'wly.motion-geometry-check.v1','status':'pass'if child.returncode==0 and not issues else'fail','selected_pages':args.pages,'complete':snapshot.get('complete'),'geometry_sha256':motion.file_stamp(geometry)['sha256'],'pages':summary,'issues':issues,'source_and_pngs_modified':False,'no_image_viewing':True}
            (run/'summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
            print(json.dumps({'status':report['status'],'pages':len(summary),'records':len(snapshot['records']),'issues':len(issues)},ensure_ascii=False))
            if report['status']!='pass':raise SystemExit(1)
        finally:
            server.terminate();server.wait(timeout=15)


if __name__=='__main__':main()
