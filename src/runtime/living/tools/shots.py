"""连环截图：开场 3 格、平时 4 格、夜里 1 格，拼成一张。时间用引擎的 seek(秒)，每次结果一样。

用法：python tools/shots.py <画名或页名> [--page 页名] [--orient h|v|both] [--times 开场,,,|平时,,,,|夜里]
默认时刻：开场 0.35 / 0.8 / 1.35 秒；平时取招牌动作演到一半前后的 4 个时刻（按 spec 里各动作的 time 算）；夜里取招牌动作最亮的那一刻。
spec.json 里可以写 "check": {"idle": [..4 个秒..], "night": 秒} 指定。
输出：art/<画名>/shots/<页名>-<h|v>-sheet.jpg，以及每格原图 PNG。
"""
import argparse
import io
import json
import hashlib

from PIL import Image, ImageDraw, ImageFont

import browser
import build_preview
import common
from playwright.sync_api import sync_playwright


def default_times(spec):
    intro = spec.get("intro", {}).get("dur", 1.6)
    sig = [e for e in spec.get("effects", []) if e.get("time", {}).get("dur")]
    ck = spec.get("check", {})
    if ck.get("idle"):
        idle = ck["idle"]
    elif sig:
        st = min(e["time"]["start"] for e in sig)
        en = max(e["time"]["start"] + e["time"]["dur"] for e in sig)
        idle = [intro + st + (en - st) * f for f in (0.18, 0.4, 0.65, 0.85)]
    else:
        idle = [intro + 2, intro + 4, intro + 6, intro + 8]
    night = ck.get("night", idle[2])
    return [0.35, 0.8, 1.35], [round(t, 2) for t in idle], round(night, 2)


def label(im, text, font):
    d = ImageDraw.Draw(im)
    w = d.textlength(text, font=font)
    d.rectangle([6, 6, 14 + w, 34], fill=(255, 255, 255))
    d.text((10, 7), text, fill=(10, 114, 50), font=font)


def shoot(art, page, orient, times=None):
    spec = common.load_spec(art, orient)
    intro_t, idle_t, night_t = times or default_times(spec)
    path = common.ART / art / "preview" / f"{page}-{orient}.html"
    with browser.build_lock(art):
        build_preview.build(art, page, (orient,))
    source_hash = build_preview.evidence(path)
    out = common.ART / art / "shots"
    out.mkdir(parents=True, exist_ok=True)
    frames = []
    with sync_playwright() as pw, browser.managed(pw, scope='capture') as br:
        pg = browser.open_preview(br, path, orient)
        diag = browser.wait_ready(pg)
        if not diag or diag.get("phase") != "live":
            raise SystemExit(f"预览没有进入活画状态：{diag} {pg._errs}")
        pg.evaluate("() => living.setHour(12)")
        clip = browser.box_clip(pg, 0.04, 0.22)
        errs = []
        for kind, ts in (("开场", intro_t), ("平时", idle_t), ("夜里", [night_t])):
            if kind == '夜里':
                # 鸟的夜晚切换按它自己的时间记录。平时先走到后面再倒退会撤掉夜晚事件，夜景必须从新页面前进。
                errs.extend(pg._errs)
                pg.context.close()
                pg = browser.open_preview(br, path, orient)
                browser.wait_ready(pg)
                pg.evaluate("() => { living.setHour(22.5); living.setDebug({night: 1, sleep: true}); }")
                clip = browser.box_clip(pg, 0.04, 0.22)
            for t in ts:
                if kind == "夜里":
                    pg.evaluate("() => { living.setHour(22.5); living.setDebug({night: 1, sleep: true}); }")
                pg.evaluate(f"() => living.seek({t})")
                browser.frame_settle(pg)
                png = pg.screenshot(clip=clip, full_page=True)
                im = Image.open(io.BytesIO(png)).convert("RGB")
                im.save(out / f"{page}-{orient}-{kind}-{t:.2f}.png")
                frames.append((f"{kind} 第 {t:g} 秒", im))
        errs.extend(pg._errs)
        br.close()
        resources = br._living_resource_state()
    # 拼图：横版 4 列、竖版 4 列，8 格
    tw = 520 if orient == "h" else 360
    th = round(frames[0][1].height * tw / frames[0][1].width)
    cols = 4
    rows = (len(frames) + cols - 1) // cols
    board = Image.new("RGB", (tw * cols + 8 * (cols + 1), (th + 8) * rows + 8 + 40), "white")
    font = ImageFont.truetype(common.FONT, 18)
    d = ImageDraw.Draw(board)
    d.text((10, 8), f"{page}（{'横版' if orient == 'h' else '竖版'}）连环截图  画：{art}  北京时间 {common.beijing_now()}", fill=(20, 60, 40), font=font)
    for i, (lab, im) in enumerate(frames):
        cell = im.resize((tw, th), Image.LANCZOS)
        label(cell, lab, font)
        board.paste(cell, (8 + (i % cols) * (tw + 8), 48 + (i // cols) * (th + 8)))
    sheet = out / f"{page}-{orient}-sheet.jpg"
    board.save(sheet, quality=90)
    (out/f'{page}-{orient}-shots.json').write_text(json.dumps({'sheet':str(sheet),'page_errors':errs,'night_fresh_page':True,
      'engine_source_sha256':source_hash,'capture_scope':'seek-shared-chrome','resources':resources},ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(sheet, "页面报错：", errs or "无")
    return sheet


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art")
    ap.add_argument("--page")
    ap.add_argument("--orient", default="both", choices=["h", "v", "both"])
    a = ap.parse_args()
    art = a.art if a.art in common.art_table() else common.art_of_page(a.art)
    page = a.page or common.art_table()[art]["pages"][0]
    for o in (("h", "v") if a.orient == "both" else (a.orient,)):
        shoot(art, page, o)


if __name__ == "__main__":
    main()
