"""定位真实 JSON 作者，并核对作者转换出的 Markdown。"""
import json
from hashlib import sha256
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

PLACEHOLDER = re.compile(r"\{\{([^{}]+)\}\}")


def resolve_author(root, page, field):
    if not re.fullmatch(r"[\w-]+", page):
        raise ValueError("author_path_unresolved")
    root, filename, seen = Path(root), f"sources/pages/{page}/page.json", set()
    try:
        while (filename, field) not in seen:
            seen.add((filename, field))
            value, concrete = json.loads((root / filename).read_text("utf-8-sig")), ""
            for part in field.replace("[", ".").replace("]", "").split("."):
                if isinstance(value, list):
                    index = int(part) if part.isdigit() else next(i for i, row in enumerate(value)
                        if row.get("id", row.get("scenario")) == part)
                    value, concrete = value[index], concrete + f"[{index}]"
                else:
                    value, concrete = value[part], concrete + ("." if concrete else "") + part
            match = PLACEHOLDER.fullmatch(value) if isinstance(value, str) else None
            if not match:
                return dict(file=filename, field=concrete)
            ref, field = match[1].split(".", 1)
            if ref == "roster" and field == "updated_beijing_date":
                return dict(file="config/model-roster.json", field=field)
            if ref in {"scale", "rules", "group_counts", "roster"}:
                raise ValueError("placeholder_computed_value")
            if not re.fullmatch(r"[\w-]+", ref):
                raise ValueError("author_path_unresolved")
            filename = "scripts/how-demo-data.json" if ref == "stories" else f"sources/pages/{ref}/page.json"
        raise ValueError("author_reference_cycle")
    except ValueError:
        raise
    except (OSError, KeyError, IndexError, TypeError, StopIteration) as exc:
        raise ValueError("author_path_unresolved") from exc


def editable_range(text, start, end):
    if any(start < m.end() and m.start() < end for m in PLACEHOLDER.finditer(text)):
        raise ValueError("placeholder_computed_value")


def affected_pages(root, files):
    """对应 build-site.py::sync_markdown 的作者/跨页、scale、group_counts、stories 依赖。"""
    root, files, affected = Path(root), set(files), set()
    changed = {Path(f).parent.name for f in files if re.fullmatch(r"sources/pages/[\w-]+/page\.json", f)}
    for source in (root / "sources/pages").glob("*/page.json"):
        refs = {m[1].split(".")[0] for path in source.parent.glob("*.json")
                for m in PLACEHOLDER.finditer(path.read_text("utf-8-sig"))}
        if (source.parent.name in changed or refs & changed or "scale" in refs and changed
                or "group_counts" in refs and "projects-home" in changed
                or "roster" in refs and "config/model-roster.json" in files
                or "stories" in refs and "scripts/how-demo-data.json" in files):
            affected.add(source.parent.name)
    return affected


def sync_roster(root, source):
    """同步公开模型投影；how-05 是人工稿，场景变化只提示重读。"""
    path = Path(root) / "config/model-roster.json"
    payload = Path(source).read_bytes(); current = json.loads(payload)
    previous = json.loads(path.read_text("utf-8-sig"))
    # 私有项目分工不进入公开快照；未被页面引用的历史评测说明保持已审公开版本。
    projected = {key: current[key] for key in (*previous.keys(), "limits") if key in current}
    projected.pop("project_models", None)
    projected["routing"] = dict(current["routing"])
    if "evals" in previous.get("routing", {}):
        projected["routing"]["evals"] = previous["routing"]["evals"]
    old_rows = {r["scenario"]: r for r in previous["routing"]["scenarios"]}
    new_rows = {r["scenario"]: r for r in current["routing"]["scenarios"]}
    if (any("claude" in row or "gpt" in row for row in old_rows.values())
            and not any("default" in row for row in new_rows.values())
            and set(old_rows) - set(new_rows)):
        raise ValueError("模型场景来源缺项，how-05 要重读")
    watched = ("default", "switch")
    scenario_changes = [{"scenario": name, "before": {k: old_rows.get(name, {}).get(k) for k in watched},
                         "after": {k: new_rows.get(name, {}).get(k) for k in watched}}
                        for name in new_rows if any(old_rows.get(name, {}).get(k) != new_rows[name].get(k) for k in watched)]
    scenario_changes += [{"scenario": name, "before": old_rows[name], "after": None}
                         for name in old_rows if name not in new_rows]
    changes = [{"field": key, "before": previous.get(key), "after": value}
               for key, value in projected.items() if previous.get(key) != value]
    if changes:
        text = json.dumps(projected, ensure_ascii=False, indent=2) + "\n"
        crlf = b"\r\n" in path.read_bytes()
        path.write_bytes(text.replace("\n", "\r\n" if crlf else "\n").encode("utf-8"))
    review = bool(scenario_changes or previous["routing"].get("scenarios_note") != current["routing"].get("scenarios_note"))
    return dict(source=str(source), source_sha256=sha256(payload).hexdigest(), changes=changes,
                scenario_changes=scenario_changes, how05_review_required=review,
                review_message="how-05 要重读" if review else "",
                projection_fields=list(projected), retained_public_fields=["routing.evals"])


def convert_markdown(root, pages, output_dir=None):
    env = dict(os.environ)
    env.pop("CONVERT_OUT_MD", None)
    if output_dir is not None:
        env["CONVERT_OUT_MD"] = str(output_dir)
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(Path(root) / "site-astro/tools/convert_page.py"),
                    *sorted(pages)], cwd=root, env=env, check=True, capture_output=True, timeout=180)


def markdown_checks(root, pages, converter=None, missing_ok=False):
    root, checks, converter = Path(root), {}, converter or convert_markdown
    present = {page for page in pages if (root / f"site-astro/src/content/pages/{page}.md").is_file()}
    if missing_ok:
        checks.update({page: True for page in set(pages) - present})
    else:
        checks.update({page: False for page in set(pages) - present})
    if not present:
        return checks
    with tempfile.TemporaryDirectory(prefix="wly-author-md-") as output:
        try:
            converter(root, present, Path(output))
        except (OSError, ValueError, RuntimeError, subprocess.SubprocessError):
            return {page: False for page in pages}
        for page in present:
            try:
                actual = root / f"site-astro/src/content/pages/{page}.md"
                def content(path):
                    head, body = path.read_text("utf-8-sig").split("\n---\n", 1)
                    meta = json.loads(head[4:])
                    meta.get("source", {}).pop("converted_at_beijing", None)
                    return meta, body
                checks[page] = content(actual) == content(Path(output) / (page + ".md"))
            except (OSError, ValueError, TypeError, AttributeError):
                checks[page] = False
    return checks
