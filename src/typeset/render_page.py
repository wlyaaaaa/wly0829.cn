"""单页出图命令。

  python render_page.py agents                       # 整页横竖版 + 质量关 + 对比图 → typeset-out\\agents\\
  python render_page.py agents --screens agents-02   # 只出某几屏
  python render_page.py agents --orient h            # 只出横版
  python render_page.py chinese-asr --screens chinese-asr-05 --demo table   # 组件测试图写到 components\\table\\demo\\
  python render_page.py --all                        # 全站（清单里的全部页）

规格：specs\\<页名>.json（没有的屏自动选版式）。组件：components\\<族名>\\。接口见 COMPONENTS-API.md。
"""
import argparse
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from engine.render import OUT_ROOT, page_sources, render_page, CHROME, EDGE  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page", nargs="?")
    ap.add_argument("--screens", nargs="*")
    ap.add_argument("--orient", nargs="*", default=["h", "v"])
    ap.add_argument("--no-compare", action="store_true")
    ap.add_argument("--demo", help="组件族名：输出改写到 components\\<族名>\\demo\\")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--out", default=OUT_ROOT)
    ap.add_argument("--spec-file", help="用这份规格代替 specs\\<页名>.json（组件样张用，不碰页代理的规格）")
    ap.add_argument("--source-file", help="明确指定独立投影定稿文件，不覆盖库存原件；报告记录实际输入")
    a = ap.parse_args()
    if a.all and a.source_file:
        ap.error("--source-file 只用于一页独立投影，不能与 --all 同用")
    out = os.path.join(HERE, "components", a.demo, "demo") if a.demo else a.out
    pages = sorted(page_sources()) if a.all else [a.page]
    if not pages or pages == [None]:
        ap.error("要给页名或 --all")
    t0 = time.perf_counter()
    from playwright.sync_api import sync_playwright
    summary = []
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else EDGE, headless=True, args=["--disable-gpu", "--disable-lcd-text"])
        for name in pages:
            try:
                r = render_page(name, a.screens, tuple(a.orient), not a.no_compare, out, br, a.spec_file, a.source_file)
            except Exception as e:
                print(f"{name}: 出错 {e!r}"); summary.append({"page": name, "error": repr(e)}); continue
            print(f"{name}: {r['passed']}/{r['total']} 通过，{r['incomplete']} 未完成，{r['failed']} 失败，{r['seconds']} 秒")
            for s in r["screens"]:
                if s.get("issues"):
                    print(f"   失败 {s['screen']}-{s['orientation']}: " + "；".join(s["issues"][:3]))
            if r["incomplete"]:
                print("   未完成（不算通过，明细见 report.json incomplete_list）：" +
                      "，".join(f"{k} {v}" for k, v in r.get("incomplete_kinds", {}).items()))
            summary.append({"page": name, "passed": r["passed"], "incomplete": r["incomplete"], "failed_n": r["failed"],
                            "total": r["total"], "seconds": r["seconds"],
                            "failed": [f"{s['screen']}-{s['orientation']}" for s in r["screens"] if s.get("status") == "fail"],
                            "incomplete_screens": [f"{s['screen']}-{s['orientation']}" for s in r["screens"] if s.get("status") == "incomplete"]})
        br.close()
    total = round(time.perf_counter() - t0, 1)
    if a.all:
        json.dump({"pages": summary, "seconds": total}, open(os.path.join(out, "_report.json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
    print(f"共 {len(pages)} 页，用时 {total} 秒")


if __name__ == "__main__":
    main()
