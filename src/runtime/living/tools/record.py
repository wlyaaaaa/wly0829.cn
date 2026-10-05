"""逐格录 60 帧录像：每一格都用引擎的 seek(第 i/60 秒) 定格再截图（小鸟用它自己的 seek 跟着走），
所以录像里每一格都正好前进 1/60 秒，和电脑快慢无关。用无窗口 Chrome 截插画框（上边多留一点给小鸟），ffmpeg 压成 H.264。

用法：python tools/record.py <画名或页名> [--page 页名] [--orient h|v|both] [--seconds 8] [--night]
输出：art/<画名>/video/<页名>-<h|v>-60帧.mp4，并检查：格数、帧率、相邻两格完全相同的有几对。
"""
import argparse
import hashlib
import io
import json
import subprocess
import time

from PIL import Image

import browser
import build_preview
import common
from playwright.sync_api import sync_playwright

FPS = 60


def record(art, page, orient, seconds=8.0, night=False):
    path = common.ART / art / "preview" / f"{page}-{orient}.html"
    with browser.build_lock(art):
        build_preview.build(art, page, (orient,))
    source_hash = build_preview.evidence(path)
    out = common.ART / art / "video"
    out.mkdir(parents=True, exist_ok=True)
    mp4 = out / f"{page}-{orient}-60帧{'-夜里' if night else ''}.mp4"
    n = round(seconds * FPS)
    started = time.monotonic()
    with sync_playwright() as pw, browser.managed(pw, scope='capture') as br:
        pg = browser.open_preview(br, path, orient)
        diag = browser.wait_ready(pg)
        if not diag or diag.get("phase") != "live":
            raise SystemExit(f"预览没有进入活画状态：{diag}")
        pg.evaluate(f"() => {{ living.setHour({22 if night else 12}); {'living.setDebug({night: 1, sleep: true});' if night else ''} living.seek(0); }}")
        clip = browser.box_clip(pg, 0.03, 0.18)
        clip["width"] = int(clip["width"]) // 2 * 2 / 1.0
        clip["height"] = int(clip["height"]) // 2 * 2 / 1.0
        dsf = browser.LAYOUTS[orient]["device_scale_factor"]
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-",
                               "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-c:v", "libx264rgb", "-preset", "slow", "-crf", "0", "-pix_fmt", "rgb24",
                               "-r", str(FPS), "-movflags", "+faststart", str(mp4)], stdin=subprocess.PIPE)
        hashes = []
        try:
            for i in range(n):
                pg.evaluate(f"() => living.seek({i / FPS})")
                browser.frame_settle(pg)  # 给 seek 后的 WebGL 更新两帧，再抓取当前画面
                png = pg.screenshot(clip=clip, full_page=True)
                ff.stdin.write(png)
                hashes.append(hashlib.md5(Image.open(io.BytesIO(png)).convert('RGBA').tobytes()).hexdigest())
            ff.stdin.close()
            if ff.wait() != 0:
                raise RuntimeError('ffmpeg 编码失败')
        finally:
            if not ff.stdin.closed:
                ff.stdin.close()
            if ff.poll() is None:
                ff.terminate()
                try:
                    ff.wait(timeout=15)
                except subprocess.TimeoutExpired:
                    ff.kill()
                    ff.wait()
        errs = pg._errs
        br.close()
        resources = br._living_resource_state()
    pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries",
                                    "stream=width,height,r_frame_rate,nb_read_frames", "-show_entries", "format=duration,size", "-of", "json", str(mp4)],
                                   capture_output=True, text=True, check=True).stdout)
    dup = sum(1 for i in range(1, n) if hashes[i] == hashes[i - 1])
    s = pr["streams"][0]
    res = {"mp4": str(mp4), "frames": int(s["nb_read_frames"]), "fps": s["r_frame_rate"], "size": [s["width"], s["height"]],
           "seconds": float(pr["format"]["duration"]), "kb": round(int(pr["format"]["size"]) / 1024), "identical_adjacent_source_frames": dup, "page_errors": errs,
           "engine_source_sha256":source_hash}
    res['source_frame_hash'] = 'decoded-rgba-pixels'
    res['capture_scope'] = 'seek-device-pixel-frames-shared-chrome'
    res['wall_seconds_capture'] = round(time.monotonic() - started, 3)
    res['resources'] = resources
    decoded = subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(mp4),'-an','-pix_fmt','rgb24','-f','framemd5','-'],capture_output=True,text=True,check=True)
    hashes_decoded = [line.rsplit(',',1)[-1].strip() for line in decoded.stdout.splitlines() if line and not line.startswith('#')]
    res['identical_adjacent_decoded_frames'] = sum(a==b for a,b in zip(hashes_decoded,hashes_decoded[1:]))
    res['encoding_crf'] = 0
    res['encoding'] = 'lossless-h264-rgb'
    res['passed'] = res['frames'] == n and res['fps'] == '60/1' and dup == 0 and res['identical_adjacent_decoded_frames']==0 and not errs
    (out / f'{page}-{orient}-record.json').write_text(json.dumps(res, ensure_ascii=False, indent=1)+'\n', encoding='utf-8')
    print(json.dumps(res, ensure_ascii=False), flush=True)
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art")
    ap.add_argument("--page")
    ap.add_argument("--orient", default="both", choices=["h", "v", "both"])
    ap.add_argument("--seconds", type=float, default=8.0)
    ap.add_argument("--night", action="store_true")
    a = ap.parse_args()
    art = a.art if a.art in common.art_table() else common.art_of_page(a.art)
    page = a.page or common.art_table()[art]["pages"][0]
    for o in (("h", "v") if a.orient == "both" else (a.orient,)):
        if not record(art, page, o, a.seconds, a.night)['passed']:
            raise SystemExit(1)


if __name__ == "__main__":
    main()
