"""打包拆分后的首页：dist/home/ = 首页场景模块 home-scene.<指纹>.js + 首页样式 + 首页配置 + 首页素材（和原首页接入包相同）。
通用部分在 dist/_engine/living.<指纹>.js 里，首页要先加载它。
用法：python tools/pack_home.py   （先跑 pack_engine.py）
"""
import hashlib
import json
import shutil
import subprocess

import common
import pack_engine



def h(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()[:10]


def main(home_source):
    P1 = home_source.resolve() / "src"
    out = common.DIST / "home"
    if out.exists():
        common.recycle(out)
    (out / "assets").mkdir(parents=True)
    cfg = json.loads((P1 / "hero-live.config.json").read_text(encoding="utf-8"))
    # 竖版位置数据只留引擎读的字段（和原打包脚本 p1review/package.py 一样）
    src_text = (home_source / "package.py").read_text(encoding="utf-8")
    ns = {}
    start = src_text.index("KEEP = {")
    exec(src_text[start:src_text.index("def h(")], ns)          # 只取 KEEP 和 prune，不执行它的 main
    if cfg.get("portrait"):
        cfg["portrait"]["geom"] = ns["prune"](cfg["portrait"]["geom"], ns["KEEP"])
    names = {}

    def put(rel):
        b = (P1 / rel).read_bytes()
        p = (P1 / rel)
        n = f"assets/{p.stem}.{h(b)}{p.suffix}"
        (out / n).write_bytes(b)
        return n
    for k in ("landscape", "portrait"):
        if cfg.get(k):
            cfg[k]["plate"] = put(cfg[k]["plate"])
            cfg[k]["plateNoBird"] = put(cfg[k]["plateNoBird"])
    for sp in cfg["sprites"].values():
        sp["src"] = put(sp["src"])
    cfg["scene"] = "home"
    cb = (json.dumps(cfg, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
    cfg_name = f"hero-live.config.{h(cb)}.json"
    (out / cfg_name).write_bytes(cb)
    css = (P1 / "hero-live.css").read_bytes()
    css_name = f"hero-live.{h(css)}.css"
    (out / css_name).write_bytes(css)
    js = (common.SRC / "home-scene.js").read_text(encoding="utf-8")
    tok = "new URL('hero-live.config.json'"
    assert js.count(tok) == 1
    js = js.replace(tok, f"new URL('{cfg_name}'")
    jsm = pack_engine.minify(js, "js").encode("utf-8")
    js_name = f"home-scene.{h(jsm)}.js"
    (out / js_name).write_bytes(jsm)
    eng = json.loads((common.DIST / "_engine" / "files.json").read_text(encoding="utf-8"))
    files = {p.relative_to(out).as_posix(): p.stat().st_size for p in sorted(out.rglob("*")) if p.is_file()}
    man = {"engine": f"../_engine/{eng['engine']}", "scene": js_name, "style": css_name, "config": cfg_name,
           "homeImage": {"landscape": cfg["landscape"]["plate"], "portrait": cfg["portrait"]["plate"]},
           "files": files, "built_at_beijing": common.beijing_now(),
           "note": "首页要先加载 ../_engine/ 里的 living.<指纹>.js（通用部分），再加载 home-scene.<指纹>.js（首页专用部分）；挂载代码和原首页接入包相同：HeroLive.mount(...)"}
    (out / "home.files.json").write_text(json.dumps(man, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps({k: man[k] for k in ("engine", "scene", "style", "config")}, ensure_ascii=False), sum(files.values()))


if __name__ == "__main__":
    import argparse
    import pathlib
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--home-source', required=True, type=pathlib.Path)
    main(ap.parse_args().home_source)
