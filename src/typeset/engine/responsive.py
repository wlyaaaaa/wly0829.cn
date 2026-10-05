"""独立横版卡的响应式拼页清单与手机预览；复用原图，不生成竖版卡。"""
import html
import hashlib
import json
from pathlib import Path


def build_review_strips(manifest, outdir, review_dir, orient="v", width=450, max_height=6000):
    """正式审图入口按manifest顺序选图；手机复用卡只认响应式清单，不glob。"""
    from PIL import Image

    root, target = Path(outdir), Path(review_dir)
    responsive = manifest.get("responsive")
    if responsive is not None:
        selected = responsive["views"][orient]
    else:
        selected = []
        for screen in manifest["screens"]:
            chosen = [i for i in screen["images"] if i["orientation"] == orient]
            if not chosen:
                raise ValueError(f"{screen['screen']}/{orient} 无素材或缺响应式复用清单")
            selected.extend({**i, "screen": screen["screen"]} for i in chosen)
    if not selected:
        raise ValueError(f"{manifest['page']}/{orient} 审图清单为空")
    target.mkdir(parents=True, exist_ok=True)
    gap, pages, batch, height = 9, [], [], 0
    for index, entry in enumerate(selected):
        with Image.open(root / entry["image"]) as bitmap:
            size = list(bitmap.size)
        h = round(size[1] * width / size[0])
        # 组名与第一张卡同张，切口只在完整图之间，避免裁断卡片。
        keep_next = entry.get("shape") == "strip" and index + 1 < len(selected)
        next_h = 0
        if keep_next:
            with Image.open(root / selected[index + 1]["image"]) as bitmap:
                next_h = round(bitmap.height * width / bitmap.width) + gap
        required = h + next_h + (gap if batch else 0)
        if batch and height + required > max_height:
            pages.append((batch, height))
            batch, height = [], 0
        top = height + (gap if batch else 0)
        batch.append({**entry, "source_size": size, "top": top, "bottom": top + h,
                      "image_sha256": hashlib.sha256((root / entry["image"]).read_bytes()).hexdigest()})
        height = top + h
    if batch:
        pages.append((batch, height))
    result = {"schema": "typeset.review-strips.v1", "page": manifest["page"],
              "orientation": orient, "source": "responsive.views." + orient if responsive else "screens.images",
              "width": width, "count": len(selected), "strips": []}
    for index, (rows, h) in enumerate(pages, 1):
        canvas = Image.new("RGB", (width, h), "white")
        for row in rows:
            with Image.open(root / row["image"]) as bitmap:
                scaled = bitmap.convert("RGB").resize((width, row["bottom"] - row["top"]), Image.Resampling.LANCZOS)
                canvas.paste(scaled, (0, row["top"]))
                scaled.close()
        name = f"{manifest['page']}-{orient}-{index}.jpg"
        canvas.save(target / name, quality=92, subsampling=0)
        canvas.close()
        result["strips"].append({"image": name, "size": [width, h], "parts": rows,
                                 "sha256": hashlib.sha256((target / name).read_bytes()).hexdigest()})
    (target / f"{manifest['page']}-{orient}.strips.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    return result


def build_responsive_views(page, manifest, outdir):
    """为含独立卡的页面写真实手机拼页，顺序只取当前定稿与正式manifest。

    手机首屏/分组条使用v，明确不画v的卡使用h；隐藏屏不进入两端清单。
    返回的记录保留实际素材方向，供审图和装配选择，不混入正式渲染方向数。
    """
    if not any(s.get("shape") == "card" and not s.get("hidden") for s in page["screens"]):
        return None
    from PIL import Image

    root = Path(outdir)
    visible = [s for s in page["screens"] if not s.get("hidden")]
    entries = {e["screen"]: e for e in manifest["screens"]}
    views = {"h": [], "v": []}
    groups, current_group = [], None
    group_for = {}
    for screen in visible:
        if screen.get("shape") == "strip":
            current_group = {"screen": screen["id"], "anchors": screen.get("anchors", []), "cards": []}
            groups.append(current_group)
        if screen.get("shape") == "card" and current_group:
            current_group["cards"].append(screen["id"])
        group_for[screen["id"]] = current_group["screen"] if current_group else None
    for orient in views:
        for screen in visible:
            sid = screen["id"]
            images = entries.get(sid, {}).get("images", [])
            chosen = [i for i in images if i.get("orientation") == orient]
            reuse = orient == "v" and screen.get("shape") == "card" and not chosen
            if reuse:
                chosen = [i for i in images if i.get("orientation") == "h"]
            if not chosen:
                raise ValueError(f"{sid}/{orient} 缺少拼页素材")
            for image in chosen:
                path = root / image["image"]
                with Image.open(path) as bitmap:
                    size = list(bitmap.size)
                views[orient].append({**image, "screen": sid, "shape": screen.get("shape", "screen"),
                                      "display_orientation": orient, "reuse_horizontal": reuse, "size": size,
                                      "group": group_for[sid], "anchors": screen.get("anchors", [])})

    folder = root / "assembled"
    folder.mkdir(exist_ok=True)
    parts, y, width, sequences = [], 0, 941, []
    markup = []
    for entry in views["v"]:
        with Image.open(root / entry["image"]) as source:
            height = round(source.height * width / source.width)
            parts.append(source.convert("RGB").resize((width, height), Image.Resampling.LANCZOS))
        sequences.append({"screen": entry["screen"], "image": entry["image"], "top": y, "bottom": y + height,
                          "reuse_horizontal": entry["reuse_horizontal"]})
        sid = html.escape(entry["screen"], quote=True)
        href = html.escape("../" + entry["image"], quote=True)
        anchors = []
        for hot in json.loads((root / entry["links"]).read_text(encoding="utf-8")):
            if hot["kind"] not in ("link", "button"):
                continue
            w, h = entry["size"]
            style = f"left:{100*hot['x']/w}%;top:{100*hot['y']/h}%;width:{100*hot['w']/w}%;height:{100*hot['h']/h}%"
            anchors.append(f'<a href="{html.escape(hot.get("href", ""), quote=True)}" '
                           f'aria-label="{html.escape(hot.get("text", ""), quote=True)}" style="{style}"></a>')
        points = "".join(f'<span id="{html.escape(point["id"], quote=True)}"></span>' for point in entry["anchors"])
        markup.append(f'<section id="{sid}" data-screen="{sid}" data-shape="{entry["shape"]}" '
                      f'data-group="{html.escape(entry["group"] or "", quote=True)}" '
                      f'data-source-orientation="{entry["orientation"]}">{points}<img src="{href}" '
                      f'width="{entry["size"][0]}" height="{entry["size"][1]}" alt="">{"".join(anchors)}</section>')
        y += height + 18
    canvas = Image.new("RGB", (width, y - 18), "white")
    for bitmap, entry in zip(parts, sequences):
        canvas.paste(bitmap, (0, entry["top"]))
        bitmap.close()
    canvas.save(folder / "mobile.png")
    canvas.close()
    # 这是任务产品预览；不带汇报文字、不弹浏览器、没有替代网站登录状态。
    doc = ('<!doctype html><html lang="zh-CN"><meta charset="utf-8">'
           '<meta name="viewport" content="width=device-width,initial-scale=1">'
           '<style>body{margin:0;background:#fff}main{max-width:941px;margin:auto}'
           'section{position:relative;margin-bottom:18px}img{display:block;width:100%;height:auto}'
           'a{position:absolute}</style><main>' + "".join(markup) + '</main></html>')
    (folder / "mobile.html").write_text(doc, encoding="utf-8")
    responsive = {"schema": "typeset.responsive-views.v1", "views": views, "groups": groups,
                  "mobile_image": "assembled/mobile.png", "mobile_preview": "assembled/mobile.html",
                  "mobile_sequence": sequences}
    review = build_review_strips({**manifest, "responsive": responsive}, root, folder / "strips")
    responsive["mobile_review"] = {
        "manifest": f"assembled/strips/{manifest['page']}-v.strips.json",
        "images": ["assembled/strips/" + row["image"] for row in review["strips"]],
        "count": review["count"], "source": review["source"]}
    return responsive
