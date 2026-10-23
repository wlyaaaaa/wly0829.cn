"""定位真实 JSON 作者，并核对作者转换出的 Markdown。"""
import json
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
                or "stories" in refs and "scripts/how-demo-data.json" in files):
            affected.add(source.parent.name)
    return affected


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
