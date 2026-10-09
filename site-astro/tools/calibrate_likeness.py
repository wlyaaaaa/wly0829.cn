"""用第三轮并排图校准门槛：主持判为“同等”的 8 段（汇报网页 04、05、07，本地文字识别 04、05、06，工程与交付 02、03）。
并排图左边是现在、右边是第三轮（中间隔 20 像素，顶上 40 像素标签），宽度和高度读 sections.json。
用法：python tools/calibrate_likeness.py <sections-r3 目录> <输出 json>"""
import json, os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from likeness import likeness
d, out = sys.argv[1], sys.argv[2]
SAME = {("skill-report-page", "skill-report-page-04"), ("skill-report-page", "skill-report-page-05"), ("skill-report-page", "skill-report-page-07"),
        ("localocr", "localocr-04"), ("localocr", "localocr-05"), ("localocr", "localocr-06"),
        ("rule-engineering-delivery", "rule-engineering-delivery-02"), ("rule-engineering-delivery", "rule-engineering-delivery-03")}
WORSE = {("skill-report-page", "skill-report-page-06"), ("skill-report-page", "skill-report-page-08"), ("localocr", "localocr-13"),
         ("localocr", "localocr-10"), ("rule-engineering-delivery", "rule-engineering-delivery-01"), ("rule-engineering-delivery", "rule-engineering-delivery-10")}
rows = []
for x in json.load(open(os.path.join(d, "sections.json"), encoding="utf-8")):
    f = os.path.join(d, os.path.basename(x["file"]))
    c = Image.open(f).convert("RGB")
    tw = (c.width - 20) // 2
    old = c.crop((0, 40, tw, 40 + x["old_h"])); new = c.crop((tw + 20, 40, 2 * tw + 20, 40 + x["new_h"]))
    s = likeness(old, new)
    k = (x["page"], x["section"])
    rows.append({"page": x["page"], "section": x["section"], "width": x["width"], "host": "同等" if k in SAME else "不如现在" if k in WORSE else "基本同等", **s})
res = {}
for w in (1440, 390):
    same = [r["score"] for r in rows if r["width"] == w and r["host"] == "同等"]
    worse = [r["score"] for r in rows if r["width"] == w and r["host"] == "不如现在"]
    mid = [r["score"] for r in rows if r["width"] == w and r["host"] == "基本同等"]
    res[w] = {"same_min": min(same), "same_mean": round(sum(same) / len(same), 4), "worse_max": max(worse), "worse_mean": round(sum(worse) / len(worse), 4),
              "basic_mean": round(sum(mid) / len(mid), 4)}
json.dump({"rows": rows, "summary": res}, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for r in rows:
    print(r["width"], r["section"], r["host"], r["score"], r["ssim"], r["iou"], r["height"])
print(json.dumps(res, ensure_ascii=False))
