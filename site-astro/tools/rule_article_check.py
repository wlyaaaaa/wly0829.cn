"""规则原文屏核对（读构建目录 dist 和现在网站的构建目录）：
- 每个原文屏的网页字原文，和现在网站同一屏的网页字原文逐字节比（现在网站那份去掉开头的 owner 行以后应该一模一样）；
- 规则页上不再出现 “owner: E:\\.agents” “原文排版图与技术证据” “技术证据” 这些字样，也没有排好的原文卡（原文只出现一遍）。
用法：python tools/rule_article_check.py <现在网站构建目录> <输出 json> [--dist dist]"""
import argparse, glob, html as H, json, os, re

ap = argparse.ArgumentParser()
ap.add_argument("now"); ap.add_argument("out")
ap.add_argument("--dist", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist"))
a = ap.parse_args()
OWNER = re.compile(r'<p\b[^>]*>\s*owner:.*?</p>', re.S)
rows, bad = [], []
for f in sorted(glob.glob(os.path.join(a.dist, "rules", "*", "index.html"))):
    rel = os.path.relpath(f, a.dist)
    new = open(f, encoding="utf-8").read()
    oldf = os.path.join(a.now, rel)
    old = open(oldf, encoding="utf-8").read() if os.path.exists(oldf) else ""
    text = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", "", new, flags=re.S)
    visible = H.unescape(re.sub(r"<[^>]+>", " ", text))
    leaks = [w for w in ("owner: E:\\.agents", "原文排版图与技术证据", "技术证据") if w in visible]
    for m in re.finditer(r'<section[^>]*\bid="([^"]+)"[^>]*>(?:(?!</section>).)*?<article class="rule-original-prose">(.*?)</article>', new, re.S):
        sid, art = m.group(1), m.group(2)
        o = re.search(r'<section[^>]*data-screen="' + re.escape(sid) + r'".*?<article class="rule-original-prose">(.*?)</article>', old, re.S)
        want = OWNER.sub("", o.group(1), count=1) if o else None
        same = want is not None and want == art
        canvas = bool(re.search(r'<section[^>]*\bid="' + re.escape(sid) + r'"[^>]*>(?:(?!</section>).)*?class="ts-canvas', new, re.S))
        rows.append({"page": rel, "screen": sid, "same_as_now_minus_owner": same, "has_canvas_copy": canvas, "now_found": o is not None})
        if not same or canvas:
            bad.append(rows[-1])
    if leaks:
        bad.append({"page": rel, "leaks": leaks})
res = {"screens": len(rows), "same": sum(r["same_as_now_minus_owner"] for r in rows), "with_canvas_copy": sum(r["has_canvas_copy"] for r in rows), "bad": bad, "rows": rows}
json.dump(res, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"原文屏 {len(rows)} 个；和现在逐字节一致（去掉 owner 行）{res['same']} 个；还带排好的原文卡 {res['with_canvas_copy']} 个；问题 {len(bad)} 条")
for b in bad[:20]:
    print("  ", b)
