"""把 sources/pages/<页>/page.json 和 layout.json 转成 site-astro 的内容文件 src/content/pages/<页>.md。

用法：python tools/convert_page.py <页名> [<页名> ...]      （在 site-astro 目录下运行）
      python tools/convert_page.py --all                    （sources/pages 下全部有 page.json 的页）

第四轮做法（照现在的页面逐段对齐）：
- 现在网站每一屏的整屏图，就是共用区块库（src/typeset/components，HTML + CSS）在固定画布上排好再截的图。
  新站直接用同一套区块库在浏览器里排，所以内容文件只需要写清三样东西，不写任何坐标：
  1. 这一屏的文字（原样，就是 page.json 的 text）；
  2. 构图：用哪些区块、哪几块同一行、各占多宽（电脑 h、手机 v 两份，照 layout.json）；
  3. 每个位置用哪张图：素材库里这一屏实际用到的图标、插画、毛笔标题，路径逐条写明。
- 以后改内容只改这个 Markdown 文件，生成时由 tools/render_blocks.py 照它排版，不再查素材库映射。"""
import datetime
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
REPO = os.path.dirname(SITE)
ASSETS = os.path.join(REPO, "sources", "assets")
OUT_MD = os.environ.get("CONVERT_OUT_MD") or os.path.join(SITE, "src", "content", "pages")
TOC_LABELS = os.path.join(SITE, "src", "chrome", "toc-labels.json")
SECTION_LABEL = {"top": "开头", "usage": "怎么用", "tech": "技术", "highlights": "亮点", "features": "全部功能",
                 "history": "演进", "examples": "例子", "abilities": "能做的事", "limits": "边界",
                 "points": "要点", "original": "原文"}

# —— 规则原文的公开副本：照现在网站发布时的公开投影（scripts/prepare-rule-public-projection.py）做同样三件事——
#    正文走 rule_original_contract.public_markdown、链接走 source_link_target、排好以后首行“一字不改”显示成“公开副本”；
#    另核对过滤表要省略的内容一条都不在，在就停，不生成。过滤表 .publish/private/rule-public-policy.json 不进仓库。
POLICY_FILE = os.environ.get("WLY_RULE_POLICY") or next((p for p in (
    os.path.join(REPO, ".publish", "private", "rule-public-policy.json"),
    "V:/Personal/Projects/wly0829.cn/.publish/private/rule-public-policy.json") if os.path.exists(p)), None)
GATE_LOG = []


def rule_gate(screen):
    if not screen.get("source"):
        return
    if not POLICY_FILE:
        raise SystemExit("规则原文需要公开过滤表 rule-public-policy.json，找不到就不生成（不绕开过滤）")
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import private_rule_policy as pol
    from pathlib import Path
    pol.POLICY_PATH = Path(POLICY_FILE)
    rel = screen["source"]["file"].replace("\\", "/").split(".publish/private/rule-sources/")[-1]
    values = pol.load_policy()["omissions"].get(rel, [])
    leaked = sum(1 for v in values if v in screen.get("text", ""))
    if leaked:
        raise SystemExit(f"{screen['id']}: 正文里还有 {leaked} 处过滤表要求省略的内容，停止生成")
    import rule_original_contract as rc
    screen["text"] = rc.public_markdown(screen.get("text", ""), rel, apply_omissions=False)
    for link in screen.get("links", []) or []:
        link["href"] = rc.source_link_target(link["href"])
    # 首行标签：构图按原文首行认块，所以文字照原样；显示时把“一字不改”换成“公开副本”（现在网站发布时也是排好以后再换）
    if "一字不改" in screen["text"].split("\n", 1)[0]:
        screen["display_replace"] = {"一字不改": "公开副本"}
    GATE_LOG.append({"screen": screen["id"], "file": rel, "policy_omissions_for_file": len(values), "leaked": 0,
                     "display_replace": screen.get("display_replace")})


# —— 素材库：只认发布标记 ready、文件在的行（和现在网站出图时的读法一样）——
_lib = None
def library():
    global _lib
    if _lib is None:
        _lib = {}
        for line in open(os.path.join(ASSETS, "_library", "asset-map.jsonl"), encoding="utf-8"):
            if not line.strip():
                continue
            r = json.loads(line)
            if r.get("status") != "ready" or not r.get("asset") or not os.path.isfile(os.path.join(ASSETS, r["asset"])):
                continue
            _lib.setdefault(r["screen_id"], []).append(r)
    return _lib


IMAGE_KEYS = ("role", "slot_ordinal", "orientations", "asset", "source_image", "fallback", "fallback_reason",
              "semantic_status", "title_exact_match", "text_verified", "key", "text", "title_text",
              "source_phrase", "sha256", "status")
# 分组标题的品牌图标（构图写 "brand": "Claude" 等）：区块库按“<品牌>标志”在整个素材库里认图，这里把认到的那张也写进这一屏
BRAND_OK = ("scene_explicit_primary_object", "automatically_accepted_per_b2bc0efe")


def screen_images(sid, layout=None):
    """这一屏每个位置用的图（素材库里的原文件路径，相对 sources/assets）。
    分组图标按原 scene 短语认图（source_phrase）、品牌图标按“<品牌>标志”认图，所以这两项和文件指纹也写明。"""
    out = []
    for r in library().get(sid, []):
        out.append({k: r[k] for k in IMAGE_KEYS if k in r})
    import re as _re
    brands = sorted(set(_re.findall(r'"brand": "([^"]+)"', json.dumps(layout or {}, ensure_ascii=False))))
    seen = {(r["asset"], r.get("key")) for r in out}
    for b in brands:
        for rows in library().values():
            for r in rows:
                if (r.get("key") == b + "标志" and r.get("role") == "icon" and not r.get("fallback")
                        and r.get("semantic_status") in BRAND_OK and (r["asset"], r.get("key")) not in seen):
                    seen.add((r["asset"], r.get("key")))
                    out.append({**{k: r[k] for k in IMAGE_KEYS if k in r}, "via": "brand"})  # 不占这一屏的图位，见 render_blocks.py
    out.sort(key=lambda r: (r.get("role", ""), float(r.get("slot_ordinal") or 0), r["asset"]))
    return out


SCREEN_SKIP = ("text",)


def convert(page):
    src = os.path.join(REPO, "sources", "pages", page, "page.json")
    raw = open(src, "rb").read()
    # 页里引用的数字和链接（{{scale.total}}、{{group_counts.…}}、{{stories.…links}} 等）用区块库同一个 bound_json 算好，
    # 和现在出图时一样在这一步冻结进内容文件；数据变了重新转换这一页即可
    sys.path.insert(0, os.path.join(REPO, "src", "typeset"))
    from engine.content import bound_json
    from pathlib import Path
    data = bound_json(src, read=lambda p: Path(p).read_text("utf-8-sig"))
    specs = {}
    lay_p = os.path.join(REPO, "sources", "pages", page, "layout.json")
    if os.path.exists(lay_p):
        for it in bound_json(lay_p, read=lambda p: Path(p).read_text("utf-8-sig")):  # 构图里的 text_ref 也按同样的数字展开（区块库 layout.py 同样用 bound_json 读）
            specs[(it["screen"], it.get("orientation", "h"))] = {k: v for k, v in it.items()
                                                                 if k not in ("screen", "orientation", "source_image", "source_images", "composition_basis")}
    parts, sections = [], []
    for s in data["screens"]:
        if s.get("hidden"):
            continue
        s = json.loads(json.dumps(s))
        rule_gate(s)
        bad = [x for x in (s.get("links") or []) if not isinstance(x, dict)]
        if bad:  # 链接字段不是链接列表（例如模板占位符没展开、被拆成单字）：按没有链接处理，提示出来
            print(f"  {s['id']}: links 不是链接列表（{''.join(map(str, bad))[:60]}），按没有链接处理")
            s["links"] = [x for x in s["links"] if isinstance(x, dict)]
        meta = {"screen": {k: v for k, v in s.items() if k not in SCREEN_SKIP},
                "layout": {o: specs[(s["id"], o)] for o in ("h", "v") if (s["id"], o) in specs},
                "images": screen_images(s["id"], {o: specs[(s["id"], o)] for o in ("h", "v") if (s["id"], o) in specs})}
        text = s.get("text", "")
        parts.append(f'::screen{{#{s["id"]} section="{s.get("section", "")}"}}\n\n```typeset\n'
                     + json.dumps(meta, ensure_ascii=False, indent=1) + "\n```\n\n" + text.rstrip("\n") + "\n")
        if s.get("section") and s["section"] not in [x[0] for x in sections]:
            sections.append((s["section"], s.get("title", "")))
    labels = {}
    if os.path.exists(TOC_LABELS):
        labels = {t["id"]: t for t in json.load(open(TOC_LABELS, encoding="utf-8")).get(page, [])}
    toc = []
    for sec, first_title in sections:
        t = labels.get(sec)
        item = {"id": sec, "label": t["label"] if t else SECTION_LABEL.get(sec, first_title.split("：")[0])}
        if t and t.get("img"):
            item["img"] = t["img"]
        toc.append(item)
    now = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)).strftime("%Y-%m-%dT%H:%M:%S+08:00")
    fm = {
        "title": data["title"], "kind": data["kind"], "url": data["url"], "tagline": data.get("tagline", ""),
        "toc": toc,
        "page": {k: v for k, v in data.items() if k != "screens"},
        "source": {"page": f"sources/pages/{page}/page.json", "sha256": hashlib.sha256(raw).hexdigest(), "converted_at_beijing": now},
    }
    out = "---\n" + json.dumps(fm, ensure_ascii=False, indent=1) + "\n---\n\n" + "\n".join(parts)
    os.makedirs(OUT_MD, exist_ok=True)
    open(os.path.join(OUT_MD, page + ".md"), "w", encoding="utf-8", newline="\n").write(out)
    return len(parts)


def all_pages():
    root = os.path.join(REPO, "sources", "pages")
    return sorted(d for d in os.listdir(root) if os.path.exists(os.path.join(root, d, "page.json")))


if __name__ == "__main__":
    names = sys.argv[1:]
    if names == ["--all"]:
        names = all_pages()
    failed = []
    for n in names:
        try:
            k = convert(n)
        except SystemExit:
            raise
        except Exception as e:  # 批量时一页失败不拦其它页，最后列出来
            failed.append((n, repr(e)[:200])); print(n, "转换失败", repr(e)[:200]); continue
        print(n, "转换完成", k, "屏")
    for g in GATE_LOG:
        print("  规则原文公开过滤：", json.dumps(g, ensure_ascii=False))
    print(f"共 {len(names)} 页，失败 {len(failed)} 页")
