"""开发用：把 shoot.py 的分段图拼起来缩小、切成 1800 高的预览块。python tools/review_sheet.py <目录>"""
import glob, os, sys
from PIL import Image
d = sys.argv[1]
for page in ['skill-report-page', 'localocr', 'rule-engineering-delivery']:
    for w in (1440, 390):
        fs = sorted(glob.glob(os.path.join(d, f'{page}-{w}-new-part*.png')))
        if not fs: continue
        ims = [Image.open(f) for f in fs]; H = sum(i.height for i in ims); c = Image.new('RGB', (w, H), 'white'); y = 0
        for i in ims: c.paste(i, (0, y)); y += i.height
        sc = 0.5 if w == 1440 else 1.0
        c = c.resize((int(w * sc), int(H * sc)))
        for k, y in enumerate(range(0, c.height, 1800)):
            c.crop((0, y, c.width, min(c.height, y + 1800))).save(os.path.join(d, f'v-{page}-{w}-{k}.png'))
        print(page, w, H, (c.height + 1799) // 1800)
