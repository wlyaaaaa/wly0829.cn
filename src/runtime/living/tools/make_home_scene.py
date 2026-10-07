"""从首页接入包的源码（p1review/src/hero-live.js，只读）生成拆分后的首页场景模块 src/home-scene.js：
通用部分（防卡死保险、看得见吗/减少动态/滚动/尺寸监听、跨域读图、杭州时间和日出日落）改用活画引擎 living.js 里的
LivingArt.core；首页专用的部分（整幅画的着色器、画里屏幕那一层、首页的鸟和开场）原样保留。对外接口 HeroLive.mount / setStatus 不变。"""
import pathlib
import argparse
import common

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--home-source', required=True, type=pathlib.Path, help='只读的 p1review 根目录；首页不随本轮 p2 迁移')
args = ap.parse_args()
SRC = args.home_source.resolve() / 'src' / 'hero-live.js'
OUT = common.SRC / 'home-scene.js'
s = SRC.read_text(encoding="utf-8")


def rep(old, new, count=1):
    global s
    assert s.count(old) >= 1, old[:80]
    s = s.replace(old, new, count)


rep("/* 活的那幅画。素材和坐标由配置提供，原图始终留在容器下面。 */\n(function (global) {\n'use strict';\n",
    "/* 首页那幅“活的画”：首页专用的部分（整幅画的着色器、画里屏幕那一层、首页的鸟和开场）。\n"
    "   通用部分（防卡死保险、看得见吗/减少动态/滚动/尺寸、跨域读图、杭州时间和日出日落）用活画引擎 living.js 的 LivingArt.core，\n"
    "   所以页面上要先加载 living.js，再加载本文件。对外接口仍是 HeroLive.mount / HeroLive.setStatus，和原首页接入包一致。 */\n"
    "(function (global) {\n'use strict';\nconst C = global.LivingArt && global.LivingArt.core;\n"
    "if (!C) { console.info('[HeroLive] 需要先加载活画引擎 living.js；这次只显示原图。'); return; }\n")
# 杭州时间、日出日落：用共用的
a = s.index("function hzDate() {")
b = s.index("const sun = sunTimes();")
s = s[:a] + "const hzDate = C.hzDate, hzHour = C.hzHour, sunTimes = C.sunTimes;      // 共用：杭州时间、日出日落（和原来同一套算法）\n" + s[b:]
# 防卡死保险：用共用的那一份（口径和代码与原来相同）
a = s.index("// ---------- 防卡死的保险（宁可不触发，不能误触发） ----------")
b = s.index("function schedule() {", a)
s = s[:a] + """// ---------- 防卡死的保险：用共用的那一份（LivingArt.core.makeGuard，口径和原来逐字相同） ----------
const guard = C.makeGuard({ label: 'HeroLive', shouldRun: () => shouldRun(), exempt: () => V.manual || S.frozen != null, shared, stop: why => stop(why) });
const GUARD = guard.rules;
function resetGuard(grace = 0) { guard.reset(grace); }
function resetBudget() { last = 0; guard.reset(GUARD.graceMs); }
function checkFrameGuard(now) { return guard.check(now); }
""" + s[b:]
rep("let guardEligibleAt = Infinity, guardTrigger = null, lastPaused = shared.paused;", "let lastPaused = shared.paused;")
a = s.index("frameGuard:{intervals:guardGaps.length")
b = s.index("errors:shared.errors.slice()})", a)
s = s[:a] + "frameGuard:guard.state()," + s[b:]
# 读图：用共用的（跨域声明的做法相同）
a = s.index("function loadImage(src, cors = false) {")
b = s.index("// 静态底图优先直接用首页自己那张图", a)
s = s[:a] + "const loadImage = C.loadImage;      // 共用：cors=true 时带跨域声明（要当显卡贴图的图）\n" + s[b:]
# 挂载：监听改用共用的 watch
a = s.index("  const shared = {status:options.status ? validateStatus(options.status) : {...status}")
b = s.index("  const ready = Promise.resolve().then(async () => {", a)
mid = s[a:b]
new_mid = """  let scene = null, config = null, orientation = null, destroyed = false, token = 0;
  const W = C.watch(container, { pause: () => { if (scene) scene.pauseChanged(); }, reduced: () => { if (scene) scene.preferenceChanged(); }, resize: () => { refresh(); } });
  const shared = Object.assign(W.shared, {status:options.status ? validateStatus(options.status) : {...status}, plateImage});
  W.observe(container);
  const originalPosition = container.style.position;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  const choose = () => container.clientHeight > container.clientWidth && config.portrait ? 'portrait' : 'landscape';
  const resolveAssets = (variant, baseURL) => {
    const url = value => value ? new URL(value, baseURL).href : null;
    const sprites = {}; for (const [k, sp] of Object.entries(config.sprites || {})) sprites[k] = {...sp, src:url(sp.src || sp.file)};
    return {...variant, plate:url(variant.plate), plateNoBird:url(variant.plateNoBird), sprites};
  };
  let assetBase = document.baseURI;
  async function refresh() {
    if (!config || destroyed) return;
    const next = choose(); if (next === orientation && scene) { scene.layout(); return; }
    orientation = next; const current = ++token;
    if (scene) scene.destroy();
    try { scene = createScene(container, resolveAssets(config[next], assetBase), config, shared); await scene.ready; }
    catch (e) { shared.errors.push(String(e.message || e)); }
    if (current !== token || destroyed) return;
  }
"""
# 确认原来这段里只有我们要换掉的东西
for must in ("document.addEventListener('visibilitychange', pauseChanged);", "new IntersectionObserver", "new ResizeObserver", "async function refresh()"):
    assert must in mid, must
s = s[:a] + new_mid + s[b:]
rep("    if (scene) scene.destroy(); if (observer) observer.disconnect(); if (resize) resize.disconnect(); else global.removeEventListener('resize', refresh);\n"
    "    document.removeEventListener('visibilitychange',pauseChanged); global.removeEventListener('scroll',scrollChanged,true); media.removeEventListener('change',preferenceChanged);",
    "    if (scene) scene.destroy(); W.dispose();")
OUT.write_text(s, encoding="utf-8")
print("ok", len(s))
