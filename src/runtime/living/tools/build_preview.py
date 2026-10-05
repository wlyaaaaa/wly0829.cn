"""生成自包含的预览页：把某一页的整屏图、配置、范围图、引擎（和小鸟模块，有的话）装进一个 HTML，双击就能看。

页面结构照网站的首屏（.typeset-screen > .typeset-part > picture > img + .overlays），挂载代码也和网站接入时一样，
所以预览里看到的就是接到网站上的样子。横版、竖版各出一个文件。

用法：python tools/build_preview.py <画名或页名> [--page 页名] [--orient h|v|both] [--engine src|dist]
输出：art/<画名>/preview/<页名>-h.html、<页名>-v.html（小鸟素材放在同目录的 bird/ 里）
"""
import argparse
import base64
import json
import pathlib
import shutil
import hashlib
import re

import common
import pack

BIRD_DIST = common.P2 / "bird" / "dist"

LAYOUT_CSS = """
body{margin:0;background:#fff;color:#1d3a2c;font-family:"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif}
.paper{max-width:1392px;width:calc(100% - 48px);margin:24px auto}
.typeset-screen{position:relative;display:block;width:100%;margin:0 0 16px}
.typeset-part{position:relative;width:100%;padding:0;margin:0;overflow:visible}
.typeset-part>picture{display:block;position:relative;width:100%;height:100%}
.typeset-part>picture>img{display:block;width:100%;height:100%;object-fit:contain;object-position:top left;max-width:100%;pointer-events:none}
.typeset-part>.overlays{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
@media(max-width:767.98px){.paper{width:100%;margin:0}}
.preview-note{font-size:12px;color:#5b7a69;margin:6px 0 0}
"""


def data_uri(path: pathlib.Path) -> str:
    mime = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg"}[path.suffix.lower()]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def engine_files(which: str):
    if which == "dist":
        man = json.loads((common.DIST / "_engine" / "files.json").read_text(encoding="utf-8"))
        return (common.DIST / "_engine" / man["engine"]).read_text(encoding="utf-8"), (common.DIST / "_engine" / man["style"]).read_text(encoding="utf-8"), man.get('engine_source_sha256')
    raw = (common.SRC / 'living.js').read_bytes()
    return raw.decode('utf-8'), (common.SRC / "living.css").read_text(encoding="utf-8"), hashlib.sha256(raw).hexdigest()


def evidence(path):
    text = pathlib.Path(path).read_text(encoding='utf-8')
    match = re.search(r'name="living-engine-source-sha256" content="([a-f0-9]{64})"', text)
    if not match:
        raise ValueError(f'预览缺少构建时源码证据：{path}')
    return match.group(1)


def bird_files():
    """小鸟模块：p2/bird/dist 里的脚本和素材。还没到就返回 None。"""
    if not BIRD_DIST.exists():
        return None
    js = BIRD_DIST / "bird.js"
    return js if js.exists() else None


def build(art, page=None, orients=("h", "v"), engine="src"):
    info = common.art_table()[art]
    page = page or info["pages"][0]
    tmp = common.ART / art / "work" / "_pack"
    if tmp.exists():
        common.recycle(tmp)
    pack.build(art, out_root=tmp, quiet=True)
    cfg = json.loads((tmp / page / "config.json").read_text(encoding="utf-8"))
    for o in ("h", "v"):
        if o in cfg:
            for m in cfg[o]["masks"]:
                m["src"] = data_uri(tmp / page / m["src"])
            for e in cfg[o].get("effects", []):
                if e.get("sprite"):
                    e["sprite"]["src"] = data_uri(tmp / page / e["sprite"]["src"])
    js, css, source_hash = engine_files(engine)
    dom_hash = hashlib.sha256(js.replace('\r\n','\n').replace('\r','\n').encode('utf-8')).hexdigest()
    bird_js = bird_files()
    outdir = common.ART / art / "preview"
    outdir.mkdir(parents=True, exist_ok=True)
    bird_tag = ""
    if bird_js:
        bird_dir = outdir / "bird"
        if bird_dir.exists():
            common.recycle(bird_dir)
        bird_dir.mkdir(parents=True)
        for f in ("bird.js", "bird-atlas.webp"):
            shutil.copy2(BIRD_DIST / f, bird_dir / f)
        bird_tag = f"<script>{(bird_dir / bird_js.name).read_text(encoding='utf-8')}</script>"
    outs = []
    for o in orients:
        if o not in cfg:
            print(f"{page}/{o}: 约定里量不到插画框，跳过")
            continue
        img = common.site_image(page, o)
        W, H = cfg[o]["image"]["size"]
        name = "横版" if o == "h" else "竖版"
        html = f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>活画预览 {page} {name}</title>
<meta name="living-engine-source-sha256" content="{source_hash}">
<meta name="living-engine-dom-sha256" content="{dom_hash}">
<link rel="icon" href="data:,">
<style>{LAYOUT_CSS}{css}</style></head>
<body>
<div class="paper">
<section class="screen typeset-screen" id="{page}-01" data-section="top">
<div class="typeset-part" data-orientation="{o}" style="aspect-ratio:{W}/{H}"><picture><img src="{data_uri(img)}" width="{W}" height="{H}" alt="开头" decoding="async" draggable="false"></picture><div class="overlays"></div></div>
</section>
<p class="preview-note">活画预览：{page}（{name}）。画：{art}。生成于北京时间 {common.beijing_now()}。</p>
</div>
{bird_tag}
<script>{js}</script>
<script>
window.LIVING_CONFIG = {json.dumps(cfg, ensure_ascii=False)};
window.living = LivingArt.mount(document.querySelector('.typeset-screen'), {{ config: window.LIVING_CONFIG, preview: true, birdSprites: new URL('bird/', location.href).href }});
</script>
</body></html>
"""
        out = outdir / f"{page}-{o}.html"
        out.write_bytes(html.encode('utf-8'))
        outs.append(out)
        print(out, f"{out.stat().st_size:,} 字节")
    common.recycle(tmp)
    return outs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art")
    ap.add_argument("--page")
    ap.add_argument("--orient", default="both", choices=["h", "v", "both"])
    ap.add_argument("--engine", default="src", choices=["src", "dist"])
    a = ap.parse_args()
    art = a.art if a.art in common.art_table() else common.art_of_page(a.art)
    build(art, a.page, ("h", "v") if a.orient == "both" else (a.orient,), a.engine)


if __name__ == "__main__":
    main()
