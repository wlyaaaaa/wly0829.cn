"""页名 ↔ 画 的对照表：从做网站的对话给的约定文件 first-screens.json 读，按无字原图分组。

一幅画做一份 spec.json（art/<画名>/），打包时自动给用这幅画的每一页生成横竖配置。画名 = 用它的页里按字母排第一个的页名；
编号 = 《每页动法》总览图上的编号（p2/contract-sheets/unique-sources.json 的顺序）。

用法：python tools/art_map.py            # 打印表格，并写 art-map.json、画和页对照.md
      python tools/art_map.py <页名>     # 只查这一页用的是哪幅画
"""
import json
import sys

import common


def rows():
    out = []
    for art, info in common.art_table().items():
        st = []
        for p in info["pages"]:
            for o in ("h", "v"):
                if not common.measured(p, o):
                    st.append(f"{p}/{o} 量不到插画框")
        spec = common.ART / art / "spec.json"
        state = "未开始"
        if spec.exists():
            s = json.loads(spec.read_text(encoding="utf-8"))
            state = "测试稿（draft）" if s.get("status") == "draft" else ("不出活画" if s.get("disabled") else "已写配置")
        out.append({"no": info["no"], "art": art, "source": info["source"], "sources": info["sources"], "pages": info["pages"], "gaps": st, "state": state})
    return out


def main():
    if len(sys.argv) > 1:
        page = sys.argv[1]
        art = common.art_of_page(page)
        print(f"{page} → 画 {art}（编号 {common.art_table()[art]['no']}，同一幅画的页：{'、'.join(common.art_table()[art]['pages'])}）" if art else f"{page}：约定文件里没有这一页的无字原图（不出活画，或还缺图）")
        return
    rs = rows()
    (common.ENGINE / "art-map.json").write_text(json.dumps(rs, ensure_ascii=False, indent=1), encoding="utf-8")
    pages_all = sorted({e["page"] for e in common.contract()["first_screens"]})
    no_art = [p for p in pages_all if not common.art_of_page(p)]
    md = ["# 画和页对照", "", f"由 `tools/art_map.py` 从约定文件生成（北京时间 {common.beijing_now()}）。一幅画做一份配置，打包时给表里这幅画的每一页各生成横竖两份。", "",
          "| 编号 | 画名（art/ 下的文件夹） | 用这幅画的页 | 无字原图 | 缺口 | 进度 |", "|---|---|---|---|---|---|"]
    for r in rs:
        source = f"`{r['source']}`" if len(set(r['sources'].values())) == 1 else '<br>'.join(f"{o}：`{p}`" for o,p in r['sources'].items())
        md.append(f"| {r['no'] or ''} | `{r['art']}` | {'、'.join(r['pages'])} | {source} | {'；'.join(r['gaps']) or ''} | {r['state']} |")
    md += ["", f"没有无字原图的页（不出活画，引擎什么都不做）：{'、'.join(no_art) or '无'}", ""]
    (common.ENGINE / "画和页对照.md").write_text("\n".join(md), encoding="utf-8")
    print("\n".join(md))


if __name__ == "__main__":
    main()
