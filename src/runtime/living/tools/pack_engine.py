"""打包共用引擎：src/living.js、living.css 压缩后带内容指纹，小鸟模块（p2/bird/dist 的 bird.js 和图集）放进带指纹的文件夹。

输出 dist/_engine/：
  living.<指纹>.js      引擎（压缩，esbuild）
  living.<指纹>.css     样式
  bird.<指纹>/bird.js、bird-atlas.webp   小鸟模块（原样收进来；引擎用到时自己读，页面不用另挂）
  files.json            本版各文件的名字和大小（给网站的构建流程读）
用法：python tools/pack_engine.py
"""
import gzip
import hashlib
import json
import shutil
import subprocess

import common

ESBUILD = "C:/Users/10979/AppData/Roaming/npm/node_modules/tsx/node_modules/esbuild"
BIRD = common.P2 / "bird" / "dist"


def h(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:10]


def minify(code: str, loader: str) -> str:
    js = f"""const e=require({json.dumps(ESBUILD)});let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{{process.stdout.write(e.transformSync(s,{{minify:true,loader:{json.dumps(loader)},target:'es2019',charset:'utf8',legalComments:'none'}}).code);}});"""
    r = subprocess.run(["node", "-e", js], input=code.encode("utf-8"), capture_output=True, check=True)
    return r.stdout.decode("utf-8")


def main():
    out = common.DIST / "_engine"
    if out.exists():
        common.recycle(out)
    out.mkdir(parents=True)
    bird_js, bird_atlas = (BIRD / "bird.js").read_bytes(), (BIRD / "bird-atlas.webp").read_bytes()
    bird_dir = f"bird.{h(bird_js + bird_atlas)}"
    (out / bird_dir).mkdir()
    (out / bird_dir / "bird.js").write_bytes(bird_js)
    (out / bird_dir / "bird-atlas.webp").write_bytes(bird_atlas)
    src = (common.SRC / "living.js").read_text(encoding="utf-8")
    token = "const BIRD_DIR = 'bird/';"
    if src.count(token) != 1:
        raise SystemExit("引擎里找不到小鸟文件夹名的位置")
    src = src.replace(token, f"const BIRD_DIR = '{bird_dir}/';")
    js = minify(src, "js").encode("utf-8")
    css = minify((common.SRC / "living.css").read_text(encoding="utf-8"), "css").encode("utf-8")
    if len(js) + len(css) > 150000:
        raise ValueError('引擎脚本+样式超过150KB')
    if len(bird_js) + len(bird_atlas) > 120000:
        raise ValueError('独立小鸟超过120KB')
    js_name, css_name = f"living.{h(js)}.js", f"living.{h(css)}.css"
    (out / js_name).write_bytes(js)
    (out / css_name).write_bytes(css)
    files = {p.relative_to(out).as_posix(): p.stat().st_size for p in sorted(out.rglob("*")) if p.is_file()}
    man = {"engine": js_name, "style": css_name, "bird": bird_dir + "/", "files": files,
           "engine_source_sha256":hashlib.sha256((common.SRC/'living.js').read_bytes()).hexdigest(),
           "sizes": {"engine_js": len(js), "engine_css": len(css), "engine_js_gzip": len(gzip.compress(js, 9)), "engine_css_gzip": len(gzip.compress(css, 9)),
                     "engine_total": len(js) + len(css), "bird_js": len(bird_js), "bird_atlas": len(bird_atlas), "bird_total": len(bird_js) + len(bird_atlas)},
           "built_at_beijing": common.beijing_now()}
    (out / "files.json").write_text(json.dumps(man, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    write_doc(man)
    print(json.dumps(man, ensure_ascii=False, indent=1))


def write_doc(man=None):
    """按当前 dist 里的实际文件写《接入说明》的大小表（打完页面后再跑一次 python tools/pack_engine.py --doc 更新）。"""
    man = man or json.loads((common.DIST / "_engine" / "files.json").read_text(encoding="utf-8"))
    z = man["sizes"]
    pages = []
    for d in sorted(common.DIST.iterdir()):
        if d.is_dir() and not d.name.startswith("_") and (d / "config.json").exists():
            pages.append(f"`{d.name}` {sum(f.stat().st_size for f in d.iterdir()):,}")
    doc = (common.SRC / "接入说明.template.md").read_text(encoding="utf-8")
    doc = doc.replace("{{ENGINE}}", f"{z['engine_total']:,}（脚本 {z['engine_js']:,}，gzip 后 {z['engine_js_gzip']:,}；样式 {z['engine_css']:,}）")
    doc = doc.replace("{{BIRD}}", f"{z['bird_total']:,}（脚本 {z['bird_js']:,}，图集 {z['bird_atlas']:,}）")
    doc = doc.replace("{{PAGES}}", "；".join(pages) or "（还没有）")
    (common.DIST / "接入说明.md").write_text(doc, encoding="utf-8")


if __name__ == "__main__":
    import sys
    if "--doc" in sys.argv:
        write_doc()
        raise SystemExit
    main()
