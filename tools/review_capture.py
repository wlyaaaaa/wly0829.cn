"""从本趟试建选改屏，直接使用扫描 PNG；缺图逐页报错，不重开浏览器。"""
from hashlib import sha256
from pathlib import Path

from update_gates import Run, draft_hash, read

VIEWPORTS = ("1536x860", "390x844")


def digest(path):
    return sha256(Path(path).read_bytes()).hexdigest()


def capture(directory, pages=None):
    run = Run(directory); state = run.load(); trial = read(run.directory / "trial.json")
    output = Path(trial["output"]); changes = read(output / "screens.json")["changes"]
    scan = read(output / "scan/scan-result.json")
    candidates = pages if pages is not None else [p for p, s in state["pages"].items()
        if s["status"] == "active" and "program" in s["passed"] and "visual" not in s["passed"]]
    selected = {}; built = {r["page"]: r for r in trial["pages"]}
    for page in candidates:
        row = dict(images=[], errors=[]); selected[page] = row
        try:
            current = state["pages"][page]; product = built[page]; html = Path(product["html"])
            if "program" not in current["passed"] or not product["passed"]:
                raise ValueError("本页程序关未过")
            if not scan["dist_files_unchanged"] or digest(html) != scan["input_html_sha256"][product["route"]]:
                raise ValueError("成品已不是扫描时的本页")
            if (run.directory / "drafts" / page / "draft.json").exists() and draft_hash(run.directory, page) != current["draft_sha256"]:
                raise ValueError("程序关后草稿已改")
            row.update(html=str(html), html_sha256=digest(html))
            changed = {c["screen"] for c in changes if c["page"] == page and (c["content_changed"] or c["layout_changed"])}
            for screen in sorted(changed):
                for viewport in VIEWPORTS:
                    matches = [s for p in scan["pages"] if p["page"] == product["route"] and p["viewport"] == viewport
                               for s in p["screens"] if s["screen"] == screen and s["viewport"] == viewport]
                    if len(matches) != 1: raise ValueError(f"缺图或重复：{screen}/{viewport}")
                    image = Path(matches[0]["screenshot"])
                    if image.read_bytes()[:8] != b"\x89PNG\r\n\x1a\n": raise ValueError(f"不是 PNG：{image}")
                    row["images"].append(dict(page=page, screen=screen, viewport=viewport,
                        path=str(image.resolve()), sha256=digest(image)))
        except (OSError, ValueError, KeyError) as error:
            row["errors"].append(str(error))
    return dict(pages=selected, total_screens=sum(len(p["screens"]) for p in scan["pages"]),
                selected_screens=sum(len(p["images"]) for p in selected.values()), new_screenshots=0)
