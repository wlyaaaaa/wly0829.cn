"""单页出图：排版 → 无头 Chrome 截图 → 质量关 G1–G7 → 竖版分张 → 热区 → 对比图 → page-manifest / report。

每屏每方向的状态 status：
  pass        程序能查的关全过，而且没有未完成项；
  incomplete  程序关都过了，但有“未完成”：缺素材留空、毛笔标题字体兜底（G4 没做）、规格写的构图没执行。不算通过；
  fail        有 G1–G6 实测失败。
pass 字段只在 status == pass 时为 true。"""
import glob
import json
import os
import re
import time
from pathlib import Path

from . import assets
from .layout import build_html, load_spec, textless_visible_source, WIDTH, MIN_FONT
from .parse import canon, expected_text, node_text, parse, original_markdown
from .registry import load as load_registry
from .content import bound_json

PROTO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIPE = os.path.dirname(os.path.dirname(PROTO))
OUT_ROOT = os.path.join(PIPE, ".publish", "typeset-out")
INV = os.path.join(PIPE, "sources", "screens.jsonl")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
# 兜底毛笔标题不折行：比可用宽度宽时逐步缩字号（下限为正文下限的 1.5 倍），缩过的记在 data-fit 上
FIT_JS = """() => { for (const t of document.querySelectorAll('.title-font .brushfont')) {
  const box = t.closest('.title-wrap').parentElement; const cs = getComputedStyle(box);
  const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  let fs = parseFloat(getComputedStyle(t).fontSize); const lo = document.body.classList.contains('o-v') ? 54 : 33; const f0 = fs;
  while (t.scrollWidth > avail && fs > lo) { fs -= 2; t.style.fontSize = fs + 'px'; }
  if (t.scrollWidth > avail) { t.style.whiteSpace = 'normal'; t.dataset.fit = f0 + '→' + fs + '（仍放不下，折行）'; }
  else if (fs !== f0) t.dataset.fit = f0 + '→' + fs; }
  return [...document.querySelectorAll('.title-font .brushfont')].map(t => (t.dataset.fit || '') + '|' + Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight))); }"""
CHECK_JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "checks.js"), encoding="utf-8").read()
V_MAX = 3 * 1672      # 竖版超过 3 屏高就分张
V_PART = 2 * 1672     # 自动切点目标 2 屏高；完整内容不可拆时允许延至最近安全空隙
CONT_PAD = 30         # 续张顶上补的留白（热区坐标同步加上）

# 程序能查到什么、查不到什么（写进 report.gates，审页员据此知道哪些还要人看）
GATES = {
    "G1": "程序：除显式textless且经source.scene归属核验的插画散词外，渲染文字逐字等于定稿去记号；另查排版记号有没有被画出来",
    "G2": "程序：按实际字形高度量",
    "G3": "程序：溢出、超页、文字块重叠、出卡；装饰（叶子、aria-hidden 图）外框盖字；分张实切口避开整表、标题、完整流程/时间线节点及可见文字行框",
    "G4": "部分：有本屏原图对照的标题图和原图同位置深色中位数色差 ≤8；逐字一致的新画标题没有原图对照时，和批准样板毛笔标题标准色范围比（G4_STD）；都查不放大；识字依据素材库逐字核对记录，本次不重新 OCR；字体兜底记“未完成”",
    "G5": "程序：热区按实际外框记坐标、分张换算、不被切开；定稿链接/按钮、实时框、截图位个数和绑定是否齐",
    "G6": "程序：同页同方向同角色（.prose .body .name .num .sechead .blist li 和 data-role）字号一致，全页（含分批出的屏）一起算",
    "G7": "没有程序检查：素材里有没有定稿外的字、伪字、未点名标志，要审页员看图",
}

# 组件 ctx.warn 写的提醒按字面归类（组件可直接用 ctx.incomplete 明确记，见 COMPONENTS-API）
import re as _re
_PENDING = _re.compile(r"待样张|待本人|样张审核|样张批准|待.{0,6}批准")
_TITLE = _re.compile(r"字体兜底|G4 ?取色没做|G4.{0,4}未")
_ASSET = _re.compile(r"(素材|插画|图标|头像|右图|左图|底图|主图).{0,24}(缺|没有|未找到|不存在|不足|不放|未生成|留空|仅 ?\d)|(缺|没有|不足|缺少).{0,12}(素材|插画|图标|头像|底图)")
_COMP = _re.compile(r"找不到|没有组件|没分到|不支持|没有.{0,10}规格|缺少.{0,20}规格|未提供|尚待核心|未生效|没执行|没有可绘制|尚未复现|没有推断")


def classify(note):
    """提醒 → None（普通提醒）/ "pending_review"（新样式待本人看）/ asset / title / composition。"""
    if _PENDING.search(note):
        return "pending_review"
    if _TITLE.search(note):
        return "title"
    if _ASSET.search(note):
        return "asset"
    if _COMP.search(note):
        return "composition"
    return None


def page_sources():
    """页名 → page.json 路径（来自清点清单）。"""
    out = {}
    for src in glob.glob(os.path.join(PIPE, "sources", "pages", "*", "page.json")):
        out[os.path.basename(os.path.dirname(src))] = src
    return out


def verify_lock(lock):
    """Fail before rendering when the locked font encoder cannot run."""
    import platform
    import importlib
    import sys
    sys.path.insert(0, lock['python_tools'])
    versions = {"python": platform.python_version()}
    for name, module in (("fonttools", "fontTools"), ("brotli", "brotli")):
        try:
            versions[name] = importlib.import_module(module).__version__
        except ImportError as error:
            raise ValueError("Missing locked rendering dependency: " + name) from error
    if versions != lock["python_packages"]:
        raise ValueError("Locked Python/FontTools/Brotli versions differ: " + repr(versions))
    from fontTools.ttLib import woff2
    if not woff2.haveBrotli:
        raise ValueError("Locked FontTools WOFF2 encoder has no Brotli")
    for row in [lock["chrome"], *lock["fonts"]]:
        if assets._sha(row["path"]) != row["sha256"]:
            raise ValueError("Locked rendering dependency changed: " + row["path"])


def render_dependencies(page_name, page, spec, registry=None):
    """The loaded styles and component families actually used by this page."""
    reg, owner, css, _ = registry or load_registry()
    files = set(Path(PROTO, "engine").glob("*.py")) | {Path(PROTO, "engine/checks.js"), Path(PROTO, "style/base.css")}
    files.update(map(Path, css))  # The renderer links every registered stylesheet.
    files.update(Path(PROTO, 'components').rglob('*.css'))
    files.update(Path(PROTO, 'style').glob('*'))
    files.update(Path(PROTO, 'assets', 'leaf-'+side+'.png') for side in ('l', 'r'))
    files.update(Path(PROTO, name) for name in ("typeset_check.js", "typeset_labels.js", "typeset_apply.js"))
    used = set()
    def track(name, fn):
        def call(block, ctx):
            used.add(owner[name]); return fn(block, ctx)
        return call
    tracked = {name: track(name, fn) for name, fn in reg.items()}
    import sys
    def observe(frame, event, arg):
        if event == 'call' and frame.f_code.co_filename.startswith(PROTO): files.add(Path(frame.f_code.co_filename))
    for screen in page["screens"]:
        if screen.get("hidden"): continue
        for orient in ("h", "v"):
            if not wanted(screen, orient, spec): continue
            item = spec.get((screen["id"], orient), {})
            previous = sys.getprofile(); sys.setprofile(observe)
            try: build_html(page, screen, orient, tracked, [str(p) for p in css], item)
            finally: sys.setprofile(previous)
            for family in used:
                files.update(p for p in Path(PROTO, "components", family).rglob('*')
                             if p.suffix in ('.py', '.js', '.png', '.json') and '__pycache__' not in p.parts)
            if screen['id'] == 'rule-engineering-delivery-10':
                files.add(Path(PROTO, 'components/comp-diagram/step-ports.js'))
    return files


def g1(screen, text, textless_exclusions=()):
    source, source_nodes = screen["text"], None
    if textless_exclusions:
        try:
            source, source_nodes = textless_visible_source(screen, textless_exclusions)
        except (ValueError, KeyError, TypeError) as error:
            return False, f"G1 textless 归属核验失败：{error}"
    exp = expected_text(source, markdown_links=original_markdown(screen))
    got = canon(text)
    if got == exp:
        return True, ""
    # 规格可能调整了块的上下顺序：字一样多、每个定稿节点都整段出现，也算通过
    if sorted(got) == sorted(exp) and all(node_text(n) in got for n in (source_nodes if source_nodes is not None else parse(screen["text"], markdown_links=original_markdown(screen)))):
        return True, "顺序按规格调整"
    i = next((k for k in range(min(len(got), len(exp))) if got[k] != exp[k]), min(len(got), len(exp)))
    return False, f"G1 第 {i} 字附近：定稿「{exp[max(0, i - 6):i + 10]}」渲染「{got[max(0, i - 6):i + 10]}」（定稿 {len(exp)} 字、渲染 {len(got)} 字）"


def dark_median(im, box=None):
    import numpy as np
    a = np.asarray((im.crop(box) if box else im).convert("RGB")).reshape(-1, 3).astype(int)
    d = a[a.min(1) < 120]
    return (tuple(int(x) for x in np.median(d, 0)), len(d)) if len(d) else (None, 0)


# 批准样板毛笔标题标准色：approved-style-v2 三张对比图新图标题区深色中位数（09:5x 取样）
# agents-01-h (5,131,56)、agents-02-h (6,103,46)、agents-01-v (3,106,47)；本人说标题“差不多就行”，
# 范围 = 各通道最小/最大中位数各放宽 16 级（有原图对照的仍按 ≤8）
G4_STD = {"lo": (0, 87, 30), "hi": (22, 147, 72), "samples": [(5, 131, 56), (6, 103, 46), (3, 106, 47)]}


def g4(png, titles, issues):
    from PIL import Image
    if not titles:
        return
    im = Image.open(png)
    for t in titles:
        if t.get("std"):  # 逐字一致的新画标题、没有本屏原图对照：和批准样板标准色范围比（本人：差不多就行）
            b, nb = dark_median(im, (t["x"], t["y"], t["x"] + t["w"], t["y"] + t["h"]))
            if b and not all(lo <= v <= hi for v, lo, hi in zip(b, G4_STD["lo"], G4_STD["hi"])):
                issues.append(f"G4 新画标题颜色 {b} 不在批准样板标准色范围 {G4_STD['lo']}–{G4_STD['hi']}")
            if t["w"] > t["natural"] + 1:
                issues.append("G4 标题图被放大了")
            continue
        src = Image.open(t["src"])
        x0, y0, x1, y1 = [int(v) for v in t["box"].split(",")]
        a, na = dark_median(src, (x0, y0, x1, y1))
        b, nb = dark_median(im, (t["x"], t["y"], t["x"] + t["w"], t["y"] + t["h"]))
        if a and b:
            diff = max(abs(p - q) for p, q in zip(a, b))
            if diff > 8:
                issues.append(f"G4 标题颜色和原图差 {diff} 级（原 {a}，新 {b}）")
        if t["w"] > t["natural"] + 1:
            issues.append("G4 标题图被放大了")


def _auto_pieces(lo, hi, cuts):
    """[lo, hi) 太长时按块间空隙自动切，目标 2 屏高，保全完整表格/节点。"""
    pieces, start = [], lo
    if hi - lo <= V_MAX:
        return [(lo, hi)]
    while hi - start > V_PART:
        ok = [c for c in cuts if start + 400 < c <= start + V_PART]
        if not ok:
            # 过高的不可拆块保全；在它之后第一个真实空隙切，不能退回按像素硬切。
            ok = [c for c in cuts if start + V_PART < c < hi - 20]
            if not ok:
                break
            pieces.append((start, ok[0])); start = ok[0]
            continue
        end = ok[-1]
        forward = [c for c in cuts if start + V_PART < c < hi - 20]
        if end - start < V_PART / 2 and forward and forward[0] <= start + V_MAX:
            # 不可拆表格正跨过目标高度时，优先整表后的空隙，避免标题介绍单独成为短张。
            pieces.append((start, forward[0])); start = forward[0]
            continue
        # 只在同一连续安全空隙里取中点；跨两个空隙求平均可能重新落回文字/标题内。
        gap = [end]
        for c in reversed(ok[:-1]):
            if end - c >= 120 or gap[-1] - c > 2:
                break
            gap.append(c)
        end = gap[len(gap) // 2]
        pieces.append((start, end)); start = end
    pieces.append((start, hi))
    return pieces


def safe_breaks(requested, cuts, protected, H):
    """明确换张也必须落在实测空隙；表格/标题/节点/行框里的请求吸附到最近安全切口。"""
    result, adjustments = [], []
    for y in sorted(requested):
        hits = [r for r in protected if r["top"] - 8 < y < r["bottom"] + 8]
        if hits:
            available = [c for c in cuts if 20 < c < H - 20]
            end = min(available, key=lambda c: (abs(c - y), c)) if available else None
            adjustments.append({"requested": y, "actual": end,
                                "protected": sorted({r["kind"] for r in hits})})
            if end is None:
                continue
            y = end
        if 20 < y < H - 20 and y not in result:
            result.append(y)
    return sorted(result), adjustments


def check_seams(parts, protected, cards, issues, inc):
    """检查实际写出的分张边界，显式和自动切口都不能漏关。"""
    seams = [b for _, _, b in parts[:-1]]
    for y in seams:
        hits = [r for r in protected if r["top"] < y - 0.5 and r["bottom"] > y + 0.5]
        if hits:
            kinds = "/".join(sorted({r["kind"] for r in hits}))
            issues.append(f"G3 分张切过完整内容（{kinds}，y={y}）：{hits[0]['text']}")
        for c in cards:
            if c["top"] < y - 2 and c["bottom"] > y + 2:
                inc.append({"kind": "composition", "msg":
                            f"分张切过卡片外框（{c['name'][:20]}，y={y}），续张的卡框没重建"})
    return seams


def split_v(png, H, cuts, hot, sid, outdir, breaks=()):
    """竖版分张；返回 [(文件名, 起, 止)]。规格/组件写了明确换张（breaks）的先在那里切（不管总高），
    每段再超过 3 屏高的按块间空隙自动切。热区由调用方换算到各自那张。"""
    from PIL import Image
    marks = [0] + [b for b in sorted(breaks) if 0 < b < H] + [H]
    pieces = []
    for lo, hi in zip(marks, marks[1:]):
        pieces += _auto_pieces(lo, hi, cuts)
    if len(pieces) == 1:
        return [(f"{sid}-v.png", 0, H)]
    os.makedirs(assets.CACHE, exist_ok=True)
    # 先挪走整张长图，第一张才不会被覆盖删掉；临时名带进程号，别的页代理同时出同一屏也不会互相踩
    full = os.path.join(assets.CACHE, f"{sid}-v.full.{os.getpid()}.png")
    os.replace(png, full)
    png = full
    im = Image.open(png)
    out = []
    for i, (t, b) in enumerate(pieces, 1):
        name = f"{sid}-v.png" if i == 1 else f"{sid}-v{i}.png"
        seg = im.crop((0, t, im.width, b))
        if i > 1:  # 续张顶上补留白
            c = Image.new("RGB", (im.width, seg.height + CONT_PAD), "white"); c.paste(seg, (0, CONT_PAD)); seg = c
        seg.save(os.path.join(outdir, name))
        out.append((name, t, b))
    im.close()
    recycle([png], assets.CACHE)  # 本进程自己的临时整张长图：用完放回收站（不永久删）
    return out


def approved_replacements():
    p = os.path.join(PIPE, "pages-approved.json")
    out = {}
    try:
        for r in json.load(open(p, encoding="utf-8")):
            for k, v in (r.get("replace_images") or {}).items():
                out[k] = v
    except Exception:
        pass
    return out


def originals(page_dir, sid, o, sp=None):
    """对比左图：规格 source_images/source_image 优先，其次 pages-approved 的替换图，最后原 img 目录。"""
    if sp:
        srcs = sp.get("source_images") or ([sp["source_image"]] if sp.get("source_image") else [])
        srcs = [x for x in srcs if os.path.exists(x)]
        if srcs:
            return srcs
    rep = approved_replacements()
    img = os.path.join(page_dir, "img")
    if o == "h" and not os.path.exists(os.path.join(img, f"{sid}-h.png")) and os.path.exists(os.path.join(img, f"{sid}.png")):
        return [rep.get(f"{sid}.png", os.path.join(img, f"{sid}.png"))]
    if o == "h":
        p = rep.get(f"{sid}-h.png", os.path.join(img, f"{sid}-h.png"))
        return [p] if os.path.exists(p) else []
    vs = sorted(glob.glob(os.path.join(img, f"{sid}-v*.png")), key=lambda p: (len(p), p))
    return [rep.get(os.path.basename(v), v) for v in vs]


def compare(olds, news, dst, label_old, label_new, notes=None):
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype(r"C:\Windows\Fonts\NotoSansSC-VF.ttf", 34)
    good = []
    for p in olds:  # 原图坏了（0 字节、解不开）就跳过并记下，不让整页中断
        try:
            Image.open(p).verify(); good.append(p)
        except Exception:
            if notes is not None:
                notes.append(f"对比原图解不开，已跳过：{os.path.basename(p)}")
    olds = good

    def stack(ps):
        ims = [Image.open(p).convert("RGB") for p in ps]
        w = max(i.width for i in ims)
        c = Image.new("RGB", (w, sum(i.height for i in ims) + 12 * (len(ims) - 1)), (205, 205, 205)); y = 0
        for i in ims:
            c.paste(i, (0, y)); y += i.height + 12
        return c
    L = stack(olds) if olds else Image.new("RGB", (400, 200), (235, 235, 235))
    R = stack(news)
    W, BAND = L.width + R.width + 40, 64
    c = Image.new("RGB", (W, max(L.height, R.height) + BAND), (205, 205, 205))
    d = ImageDraw.Draw(c); d.rectangle((0, 0, W, BAND), fill="white")
    d.text((14, 12), label_old if olds else "原图：没有（新屏）", font=font, fill=(90, 90, 90))
    d.text((L.width + 54, 12), label_new, font=font, fill=(10, 114, 50))
    c.paste(L, (0, BAND)); c.paste(R, (L.width + 40, BAND)); c.save(dst)


def recycle(paths, root):
    """把本次出图作废的旧产物放进回收站（不直接删）。用规则仓库的回收入口，失败就留着并记下。"""
    import subprocess
    tool = os.path.join("E:" + os.sep, ".agents", "tools", "Move-TaskItemToRecycleBin.ps1")
    for p in paths:
        try:
            subprocess.run(["pwsh", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", tool, "-LiteralPath", p,
                            "-AllowedRoot", root, "-Confirm:$false"], capture_output=True, timeout=60,
                           creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
        except Exception:
            pass


def g5_complete(scr, hot, issues, inc):
    """定稿里出现的链接/按钮都要有热区；实时框个数和绑定照 screen.live；截图位个数照 screen.screenshots。"""
    from .parse import normalize
    text = normalize(scr.get("text", ""))
    shown = {h["text"] for h in hot} | {h.get("href", "") for h in hot}
    for l in scr.get("links", []) or []:
        t = l.get("text", "")
        if t and (f"〔{t}〕" in text or f"【{t}】" in text or f"［{t}］" in text) and t not in shown and l.get("href", "") not in shown:
            issues.append(f"G5 缺热区：〔{t[:14]}〕")
    live = [str(x) for x in (scr.get("live") or [])]
    lh = []
    for h in hot:  # 同一实时键可以有几个分部矩形（part/shared_key、竖版拆两窗），按键去重后再比
        if h["kind"] == "live" and h.get("href", "") not in lh:
            lh.append(h.get("href", ""))
    if live:
        if not lh:
            inc.append({"kind": "composition", "msg": f"定稿有 {len(live)} 个实时框（{'/'.join(live)}），图里一个都没画"})
        elif len(lh) != len(live):
            issues.append(f"G5 实时框绑定了 {len(lh)} 个键（{'/'.join(lh)}），定稿 {len(live)} 个（{'/'.join(live)}）")
        elif lh != live and sorted(lh) == sorted(live):
            pass  # 只是换了顺序（规格可调块序）
        elif lh != live:
            issues.append(f"G5 实时框绑定 {'/'.join(lh)} 和定稿 {'/'.join(live)} 不一致")
    shots = scr.get("screenshots") or []
    sh = [h for h in hot if h["kind"] == "screenshot"]
    if shots and not sh:
        inc.append({"kind": "composition", "msg": f"定稿有 {len(shots)} 个截图位，图里没画"})


def wanted(scr, o, spec):
    """这一屏要不要出这个方向：独立卡（shape=card）只出横版；规格写 portrait_required=false 的不出竖版。"""
    if o == "v":
        # 明确 opt-in 的竖版规格优先；未请求竖版的旧独立卡保持原行为。
        if spec.get((scr["id"], "v"), {}).get("portrait_required") is True:
            return True
        if scr.get("shape") == "card":
            return False
        for (sid, oo), it in spec.items():
            if sid == scr["id"] and it.get("portrait_required") is False:
                return False
    return True


def _alive(pid):
    """Windows 上看进程还在不在（不用 os.kill：Windows 的 os.kill 会直接结束进程）。"""
    try:
        import ctypes
        k = ctypes.windll.kernel32
        h = k.OpenProcess(0x1000, False, int(pid))  # PROCESS_QUERY_LIMITED_INFORMATION
        if not h:
            return False
        code = ctypes.c_ulong()
        k.GetExitCodeProcess(h, ctypes.byref(code)); k.CloseHandle(h)
        return code.value == 259  # STILL_ACTIVE
    except Exception:
        return True


class PageLock:
    """同一页同一输出目录同时只许一个出图进程写（防报告、清单、图互相覆盖）。"""
    def __init__(self, outdir):
        self.p = os.path.join(outdir, ".render.lock")

    def __enter__(self):
        if os.path.exists(self.p):
            try:
                pid, t0 = open(self.p, encoding="utf-8").read().split()[:2]
                if _alive(pid) and int(pid) != os.getpid() and time.time() - float(t0) < 1800:
                    raise SystemExit(f"{os.path.dirname(self.p)} 正被另一个出图进程（pid {pid}）写，等它结束再出")
            except (ValueError, OSError):
                pass
        open(self.p, "w", encoding="utf-8").write(f"{os.getpid()} {time.time()}")
        return self

    def __exit__(self, *a):
        try:
            os.remove(self.p)
        except OSError:
            pass


def render_page(page_name, screens=None, orients=("h", "v"), do_compare=True, out_root=OUT_ROOT, browser=None,
                spec_file=None, source_file=None):
    t0 = time.perf_counter()
    src = os.path.abspath(source_file) if source_file else page_sources().get(page_name)
    if not src:
        raise SystemExit(f"清单里没有页 {page_name}")
    page = bound_json(src)
    for screen in page["screens"]: screen["screenshots"] = [] if screen["id"] in page.get("withdrawn_screenshot_screens", []) else screen.get("screenshots", [])
    outdir = os.path.join(out_root, page_name)
    os.makedirs(os.path.join(outdir, "html"), exist_ok=True)
    os.makedirs(os.path.join(outdir, "compare"), exist_ok=True)
    with PageLock(outdir):
        return _render_page(page, page_name, src, screens, orients, do_compare, outdir, browser, spec_file, t0)


def _render_page(page, page_name, src, screens, orients, do_compare, outdir, browser, spec_file, t0):
    page_dir = os.path.dirname(src)
    reg, owner, css, reg_warn = load_registry()
    css_files = [os.path.join(PROTO, "style", "base.css")] + css
    spec = load_spec(page_name, spec_file)
    report ={"page": page_name, "source": src, "registry_warnings": reg_warn, "screens": []}
    manifest = {"page": page_name, "screens": []}
    own = browser is None
    if own:
        from playwright.sync_api import sync_playwright
        pw = sync_playwright().start()
        browser = pw.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else EDGE, headless=True)

    try:
        for scr in page["screens"]:
            if screens and scr["id"] not in screens:
                continue
            if scr.get("hidden"):
                report["screens"].append({"screen": scr["id"], "skipped": "hidden"}); continue
            entry = {"screen": scr["id"], "images": []}
            for o in orients:
                if not wanted(scr, o, spec):
                    continue
                sp = spec.get((scr["id"], o))
                doc, info = build_html(page, scr, o, reg, css_files, sp)
                hp = os.path.join(outdir, "html", f"{scr['id']}-{o}.html")
                with open(hp, "w", encoding="utf-8", newline="\n" if original_markdown(scr) else None) as html_file:
                    html_file.write(doc)
                pg = browser.new_page(viewport={"width": WIDTH[o], "height": 200}, device_scale_factor=1)  # 高度按内容
                pg.goto(assets.url(hp))
                pg.evaluate("document.fonts.ready")
                for f in pg.evaluate(FIT_JS):
                    fit, lines = f.split("|")
                    if fit:
                        info["notes"].append(f"兜底标题太长，字号 {fit}px 缩到放得下（不折行）")
                typeset_adjustments = pg.evaluate("""async () => {
                  const r = await window.__typesetReady;
                  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                  return {version:r.version,labels:r.labels.length,tails:r.tails.length,widths:r.widths.length,
                          cards:r.cards.length,unresolved:r.unresolved,balance:r.balance||[],page_fill:r.page_fill||0,
                          short_labels:{tags:r.extra_labels.tags.length,terms:r.extra_labels.terms.length,
                            live:r.extra_labels.live.length,buttons:r.extra_labels.buttons.length,
                            unresolved:r.extra_labels.unresolved}};
                }""")
                chk = pg.evaluate(CHECK_JS)
                png = os.path.join(outdir, f"{scr['id']}-{o}.png")
                pg.screenshot(path=png, full_page=True)
                pg.close()
                issues = list(chk["issues"])
                ok1, why = g1(scr, chk["text"], info.get("textless_exclusions", []))
                if not ok1:
                    issues.insert(0, why)
                elif why:
                    info["notes"].append(why)
                if chk["minGlyph"] < MIN_FONT[o] - 0.5:
                    issues.append(f"G2 实测最小字高 {chk['minGlyph']:.1f}px < {MIN_FONT[o]}（“{chk['minGlyphAt']}”）")
                g4(png, chk["titles"], issues)
                inc = list(info.get("incomplete", []))
                pending = []
                for n in info["notes"]:
                    k = classify(n)
                    if k == "pending_review":
                        pending.append(n)
                    elif k and not any(n[:16] in x["msg"] or x["msg"][:16] in n for x in inc):
                        inc.append({"kind": k, "msg": n})
                g5_complete(scr, chk["hot"], issues, inc)
                for m in chk.get("domIncomplete", []):
                    inc.append({"kind": "composition", "msg": m})
                for b in chk.get("broken", []):
                    inc.append({"kind": "asset", "msg": f"图片没加载出来：{b}"})
                requested = chk.get("breaks", []) if o == "v" else []
                protected = chk.get("splitProtected", []) if o == "v" else []
                breaks, adjustments = safe_breaks(requested, chk["cuts"], protected, chk["H"])
                for adj in adjustments:
                    if adj["actual"] is None:
                        inc.append({"kind": "composition", "msg":
                                    f"明确换张 y={adj['requested']} 穿过完整内容，整屏没有安全切口"})
                    else:
                        info["notes"].append(f"明确换张从 y={adj['requested']} 移到安全空隙 y={adj['actual']}")
                parts = split_v(png, chk["H"], chk["cuts"], chk["hot"], scr["id"], outdir, breaks) if o == "v" else \
                    [(f"{scr['id']}-h.png", 0, chk["H"])]
                seams = check_seams(parts, protected, chk.get("splitCards", []) if o == "v" else [], issues, inc)
                imgs = []
                for name, top, bot in parts:
                    hs = []
                    pad = CONT_PAD if top else 0
                    for h in chk["hot"]:
                        if h["y"] >= top and h["y"] + h["h"] <= bot:
                            d = dict(h); d["y"] = h["y"] - top + pad; d["part"] = name; hs.append(d)
                        elif h["y"] < bot and h["y"] + h["h"] > top:
                            issues.append(f"G5 热区被分张切开：{h['text'][:10]}")
                    for d in hs:  # 换算后必须落在这张图里
                        if d["y"] < 0 or d["y"] + d["h"] > bot - top + pad + 1 or d["x"] < 0 or d["x"] + d["w"] > WIDTH[o] + 1:
                            issues.append(f"G5 热区坐标出了图：{d['text'][:10]}")
                    lj = name[:-4] + ".links.json"
                    json.dump(hs, open(os.path.join(outdir, lj), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                    imgs.append({"image": name, "links": lj, "hotspots": len(hs)})
                if do_compare:
                    olds = originals(page_dir, scr["id"], o, sp)
                    try:
                        compare(olds, [os.path.join(outdir, x["image"]) for x in imgs],
                                os.path.join(outdir, "compare", f"{scr['id']}-{o}-compare.png"),
                                "原图（模型整张画）", f"新排版（程序逐字排版）{'规格' if info['source'] == 'spec' else '自动版式'}",
                                info["notes"])
                    except Exception as e:  # 对比图出错不拖垮整页出图
                        info["notes"].append(f"对比图没生成：{e!r}"[:120])
                if o == "v":  # 这一方向已不在本次分张里的旧续图、旧热区文件（如之前是 3 张、现在 1 张）清退到回收站
                    keep = {x["image"] for x in imgs} | {x["links"] for x in imgs}
                    pat = re.compile(r"^" + re.escape(scr["id"]) + r"-v\d*\.(png|links\.json)$")
                    stale = [f for f in os.listdir(outdir) if pat.match(f) and f not in keep]
                    if stale:
                        recycle([os.path.join(outdir, f) for f in stale], outdir)
                        info["notes"].append("清退旧续图 " + "、".join(stale))
                entry["images"] += [dict(x, orientation=o) for x in imgs]
                report["screens"].append({"screen": scr["id"], "orientation": o, "issues": issues,
                                          "incomplete": inc, "pending_review": pending,
                                          "layout": info["source"], "blocks": info["blocks"], "notes": info["notes"],
                                          "textless_exclusions": info.get("textless_exclusions", []),
                                          "height": chk["H"], "min_glyph_px": round(chk["minGlyph"], 1),
                                          "roles": {r: sorted(v) for r, v in chk["roles"].items()},
                                          "typeset": chk["typeset"], "typeset_adjustments": typeset_adjustments,
                                          "breaks": breaks, "requested_breaks": requested,
                                          "break_adjustments": adjustments, "seams": seams,
                                          "parts": [x["image"] for x in imgs]})
            manifest["screens"].append(entry)
    finally:
        if own:
            browser.close(); pw.stop()
    report["gates"] = GATES
    report["asset_source"] = assets.SOURCE
    rp = os.path.join(outdir, "report.json")
    mp = os.path.join(outdir, "page-manifest.json")
    done = {(r["screen"], r.get("orientation")) for r in report["screens"]}
    order = {x["id"]: k for k, x in enumerate(page["screens"])}
    valid = {(x["id"], o) for x in page["screens"] if not x.get("hidden") for o in ("h", "v") if wanted(x, o, spec)}
    # 分批出同一页时合并：这次没出的屏和方向保留上次的记录；定稿已隐藏或不该出的方向（如项目卡竖版）丢掉
    if os.path.exists(rp):
        try:
            old = json.load(open(rp, encoding="utf-8"))
            keep = [r for r in old.get("screens", []) if (r["screen"], r.get("orientation")) not in done
                    and ((r["screen"], r.get("orientation")) in valid or r.get("skipped"))]
            report["screens"] = keep + report["screens"]
            report["screens"].sort(key=lambda r: (order.get(r["screen"], 999), r.get("orientation") or ""))
            oldm = json.load(open(mp, encoding="utf-8"))
            newm = {e["screen"]: e for e in manifest["screens"]}
            merged = []
            for e in oldm.get("screens", []):
                n = newm.pop(e["screen"], None)
                if n:
                    os_ = {x["orientation"] for x in n["images"]}
                    n["images"] = [x for x in e["images"] if x.get("orientation") not in os_] + n["images"]
                    merged.append(n)
                else:
                    merged.append(e)
            merged += list(newm.values())
            for e in merged:
                e["images"] = [x for x in e["images"] if (e["screen"], x.get("orientation")) in valid]
            merged.sort(key=lambda e: order.get(e["screen"], 999))
            manifest["screens"] = [e for e in merged if e["images"]]
        except Exception:
            pass
    from .responsive import build_responsive_views
    try:
        responsive = build_responsive_views(page, manifest, outdir)
        if responsive is not None:
            manifest["responsive"] = responsive
    except Exception as exc:
        report["responsive_error"] = repr(exc)
        card_ids = {s["id"] for s in page["screens"] if s.get("shape") == "card" and not s.get("hidden")}
        for row in report["screens"]:
            if row["screen"] in card_ids and row.get("orientation") == "h":
                row.setdefault("incomplete", []).append({"kind": "composition", "msg":
                                                        f"响应式拼页未完成：{exc}"})
    finalize(report)
    report["seconds"] = round(time.perf_counter() - t0, 2)
    json.dump(manifest, open(mp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(report, open(rp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return report


def finalize(report):
    """全页一起算 G6（含分批保留的旧屏），再给每屏定状态、汇总数字。"""
    rs = [r for r in report["screens"] if "issues" in r]
    for r in rs:
        r["issues"] = [x for x in r["issues"] if not x.startswith("G6 ")]
        r.setdefault("incomplete", [])
        if "roles" not in r and not any(x.get("kind") == "stale" for x in r["incomplete"]):
            r["incomplete"].append({"kind": "stale", "msg": "旧版程序出的记录（10 月 3 日 07:30 前），没按新质量关算，请重出这一屏"})
    sizes = {}
    for r in rs:
        for role, ss in (r.get("roles") or {}).items():
            for z in ss:
                sizes.setdefault((r["orientation"], role), {}).setdefault(z, []).append(r)
    g6 = []
    for (o, role), by in sizes.items():
        if len(by) < 2:
            continue
        main = max(by, key=lambda z: len(by[z]))  # 用得最多的字号算准，其余的屏记 G6 失败
        g6.append(f"G6 {o} 版 {role} 有 {len(by)} 种字号：{sorted(by)}（多数 {main}）")
        for z, lst in by.items():
            if z != main:
                for r in lst:
                    r["issues"].append(f"G6 {role} 字号 {z}，同页多数是 {main}")
    report["g6"] = g6
    for r in rs:
        r["status"] = "fail" if r["issues"] else ("incomplete" if r["incomplete"] else "pass")
        r["pass"] = r["status"] == "pass"
    report["passed"] = sum(r["status"] == "pass" for r in rs)
    report["incomplete"] = sum(r["status"] == "incomplete" for r in rs)
    report["failed"] = sum(r["status"] == "fail" for r in rs)
    report["total"] = len(rs)
    typeset_counts = {}
    for r in rs:
        for key, value in r.get("typeset", {}).get("counts", {}).items():
            typeset_counts[key] = typeset_counts.get(key, 0) + value
    report["typeset"] = {"checked_directions": sum("typeset" in r for r in rs),
                         "counts": typeset_counts,
                         "gate": "仅报告，不影响现有G1–G6通过状态"}
    kinds = {}
    for r in rs:
        for x in r["incomplete"]:
            kinds[x["kind"]] = kinds.get(x["kind"], 0) + 1
    report["incomplete_kinds"] = kinds
    report["incomplete_list"] = [{"screen": r["screen"], "orientation": r["orientation"],
                                  "items": [f"[{x['kind']}] {x['msg']}" for x in r["incomplete"]]}
                                 for r in rs if r["incomplete"]]
    return report
