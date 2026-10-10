"""环境动画（水彩晃动、发光、落叶、浮尘、小鸟）配置改绑到新页的插画上。

旧配置的坐标是“整屏 PNG 里插画那一块（box）”的比例；新页直接显示插画原图，
所以把坐标按引擎自己的换算规则（living.js 里的 ht 函数，逐条照抄）预先换到插画坐标，
box 和遮罩范围改成整张图 [0,0,1,1]、image.size 改成插画原图尺寸。效果参数、遮罩图、纹理、小鸟一律不改。
用法：python tools/adapt_motion.py [页名 ...]  （读 src/chrome/runtime/<页>.json，写 public/_living/<页>/astro/config.json）"""
import json
import os
import shutil
import hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POINT = ("center", "pivot", "from", "to", "home")
POINTS = ("path", "quad", "points")


def ht(e, box):
    c = lambda m: [(m[0] - box[0]) / box[2], (m[1] - box[1]) / box[3]]
    u = {}
    for k, d in e.items():
        if k in POINT and isinstance(d, list):
            u[k] = c(d)
        elif k in POINTS and isinstance(d, list):
            u[k] = [c(x) for x in d]
        elif k == "areas" and isinstance(d, list):
            u[k] = [c([x[0], x[1]]) + c([x[2], x[3]]) for x in d]
        elif k == "items" and isinstance(d, list):
            u[k] = [ht(x, box) for x in d]
        elif k == "perches" and isinstance(d, list):
            u[k] = [{**x, "x": (x["x"] - box[0]) / box[2], "y": (x["y"] - box[1]) / box[3]} for x in d]
        elif k in ("region", "cover") and isinstance(d, dict):
            u[k] = ht(d, box)
        else:
            u[k] = d
    return u


def adapt(page):
    rt = json.load(open(os.path.join(ROOT, "src", "chrome", "runtime", page + ".json"), encoding="utf-8"))
    src_url = rt.get("living_config")
    if not src_url:
        return None
    cfg = json.load(open(os.path.join(ROOT, "public", src_url.lstrip("/")), encoding="utf-8"))
    out = {k: v for k, v in cfg.items() if k not in ("h", "v")}
    shown_h = None
    for side in ("h", "v"):  # 电脑、手机两份：新页里插画在电脑画布和手机画布上各有一张
        if side not in cfg:
            continue
        o = cfg[side]
        box = o["box"]
        tex = o.get("texture", {}).get("size")
        shown = [box[2] * o["image"]["size"][0], box[3] * o["image"]["size"][1]]
        n = {k: v for k, v in o.items()}
        n["effects"] = [ht(e, box) for e in o.get("effects", [])]
        if o.get("intro"):
            n["intro"] = ht(o["intro"], box)
        if o.get("bird"):
            n["bird"] = ht(o["bird"], box)
        n["masks"] = [{**m, "rect": [0, 0, 1, 1]} for m in o.get("masks", [])]
        n["box"] = [0, 0, 1, 1]
        n["image"] = {**o["image"], "size": tex or [round(shown[0]), round(shown[1])]}
        out[side] = n
        shown_h = shown_h or (shown, tex, box)
    if "guide" in cfg and isinstance(cfg["guide"], dict):
        out["guide"] = {k: v for k, v in cfg["guide"].items() if k in ("h", "v")}
    shown, tex, box = shown_h
    dst = os.path.join(ROOT, "public", "_living", page, "astro", "config.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False)
    print(page, "原 box", [round(x, 4) for x in box], "插画显示比例", round(shown[0] / shown[1], 4),
          "原图比例", round(tex[0] / tex[1], 4) if tex else None)
    return "/_living/" + page + "/astro/config.json"


def adapt_album():
    """沿用旧站过渡画法；新版标题直接参与快照，准备与播放各用自己的时钟。"""
    repo = os.path.dirname(ROOT)
    js = open(os.path.join(repo, "scripts", "album-runtime.js"), encoding="utf-8").read()
    css = open(os.path.join(repo, "scripts", "album-runtime.css"), encoding="utf-8").read()
    old = "    let title = titleNode && pixelLayer(titleNode, titleNode.title, 'album-title', participants, holes);"
    new = """    let title = (incoming || outgoingTitle) && [...document.querySelectorAll('.ts-canvas :is([data-title-key],[data-comp="chapter_title"] img,[data-comp="chapter_title"] .brushfont)')].find(el => {
      const r = el.getBoundingClientRect(); return visible(el) && (!screen || el.closest('[data-screen]')?.dataset.screen === screen)
        && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    });
    if (title) { altered.push([title, title.style.viewTransitionName]); title.style.viewTransitionName = 'album-title'; }
    else title = titleNode && pixelLayer(titleNode, titleNode.title, 'album-title', participants, holes);"""
    if js.count(old) != 1 or js.count("nominal = 720") != 1 or css.count("--album-duration: 720ms") != 1:
        raise ValueError("旧站过渡入口已变，需核对标题与时钟")
    js = js.replace(old, new).replace("nominal = 720", "nominal = 1200")
    css = css.replace("720 ms movement", "1200 ms movement").replace("--album-duration: 720ms", "--album-duration: 1200ms")
    dst = os.path.join(ROOT, "public", "_album")
    os.makedirs(dst, exist_ok=True)
    manifest = {"source": js}
    for kind, source in (("css", css), ("js", js)):
        name = "album-" + hashlib.sha256(source.encode("utf-8")).hexdigest()[:20] + "." + kind
        open(os.path.join(dst, name), "w", encoding="utf-8", newline="\n").write(source)
        manifest[kind] = "/_album/" + name
    json.dump(manifest, open(os.path.join(dst, "astro-runtime.json"), "w", encoding="utf-8"), ensure_ascii=False)


if __name__ == "__main__":
    import sys
    adapt_album()
    if sys.argv[1:] == ["--album-only"]:
        sys.exit(0)
    # 页名写在命令行；不写就是 src/chrome/runtime 里已抄出的全部页（不按页名写死）
    names = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, "src", "chrome", "runtime")) if f.endswith(".json"))
    for p in names:
        adapt(p)
