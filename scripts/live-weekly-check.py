"""Compare local Live field and active project snapshots with site-v2."""
import argparse
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import re
import sys

LIVE = Path(__file__).resolve().parents[1] / "site-v2/live"
KNOWN = Path(__file__).with_name("live-weekly-check-known.json")
OWNER_FIELDS = Path("E:/Data/PCConfig/LiveWeeklyCheck/owner-fields.json")
BEIJING = timezone(timedelta(hours=8))
FIELD_SCHEMA = "pcconfig.owner-fields.v1"
ROSTER_NAME = "active-projects.json"
GENERIC = frozenset("""
    q at gap partial stale stale_text refresh_seconds level why visibility hidden hidden_what
    id key name label text value unit state mode cached note href items total next from to
    v seq rev now viewer link data rewrite public_why attention_count attention_groups
    reason missing basis window coverage
""".split())
IDENT = re.compile(r"""(?<=['"])[\w$]+(?:-[\w$]+)+(?=['"])|(?<![\w$])[\w$]+""")
FIELD_PATH = re.compile(r"data(?:\[\])*(?:\.(?:[\w-]+|\*)(?:\[\])*)*")


def read_snapshot(path):
    snapshot = json.loads(path.read_text(encoding="utf-8"))
    day = date.fromisoformat(snapshot["date"])
    if day.isoformat() != snapshot["date"] or (datetime.now(BEIJING).date() - day).days > 2:
        raise ValueError("invalid or stale snapshot date")
    return snapshot


def read_fields(path):
    snapshot = read_snapshot(path)
    resources = snapshot["resources"]
    if snapshot.get("schema") != FIELD_SCHEMA or not isinstance(resources, dict) or not resources:
        raise ValueError("invalid owner fields snapshot")
    if any(not isinstance(paths, dict) for paths in resources.values()):
        raise ValueError("invalid owner field paths")
    return resources


def unused_fields(resources, source, known):
    tokens = set(IDENT.findall(source)) | GENERIC
    # Keep the old leaf-name exemptions at any depth. New exemptions use exact paths.
    tokens.update(path.removeprefix("data.**.") for path in known if path.startswith("data.**."))
    unused = {}
    for resource, paths in sorted(resources.items()):
        for path, states in paths.items():
            key = path.rsplit(".", 1)[-1]
            if (states and FIELD_PATH.fullmatch(path) and key != "*" and not key.endswith("[]")
                    and key not in tokens and path not in known):
                unused.setdefault(path, []).append(resource)
    return dict(sorted(unused.items()))


def project_key(project_id):
    value = 0x811C9DC5
    for byte in project_id.encode("utf-8"):
        value = ((value ^ byte) * 0x01000193) & 0xFFFFFFFF
    return f"{value:08x}"
def own_image(url, images):
    path = images / url.removeprefix("/live/img/")
    return (url.startswith("/live/img/") and url != "/live/img/projects.webp"
            and path.resolve().is_relative_to(images.resolve()) and path.is_file())
def missing_illustrations(items, looks, images):
    result = {}
    for project_id in sorted({row["id"] for row in items}):
        key = project_key(project_id)
        look = looks.get(key)
        missing = ["looks.json"] if not look else [
            field for field in ("img", "thumb") if not own_image(look.get(field, ""), images)]
        if missing:
            result[project_id] = {"key": key, "missing": missing}
    return result

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    staged = path.with_suffix(path.suffix + ".tmp")
    staged.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    staged.replace(path)
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--owner-fields", type=Path, default=OWNER_FIELDS)
    parser.add_argument("--write-known", action="store_true")
    args = parser.parse_args()
    known = json.loads(KNOWN.read_text(encoding="utf-8"))
    source = "\n".join(path.read_text(encoding="utf-8") for path in LIVE.rglob("*")
                       if path.suffix in {".html", ".js"} and "_fixtures" not in path.parts)
    looks = json.loads((LIVE / "project/looks.json").read_text(encoding="utf-8"))
    failures = []
    try:
        data = read_fields(args.owner_fields)
    except (OSError, ValueError, TypeError, KeyError):
        data = {}
        failures.append(args.owner_fields.name)
    roster = args.owner_fields.with_name(ROSTER_NAME)
    try:
        ids = read_snapshot(roster)["ids"]
        if not isinstance(ids, list) or any(not isinstance(project_id, str) or not project_id for project_id in ids):
            raise ValueError("invalid active project IDs")
        active = [{"id": project_id} for project_id in ids]
    except (OSError, ValueError, TypeError, KeyError):
        active = None
        failures.append(roster.name)
    fields = unused_fields(data, source, known)
    projects = missing_illustrations(active, looks, LIVE / "img") if active is not None else None
    if args.write_known and not failures:
        known.update(dict.fromkeys(fields, "上线验收时已纳入未引用字段基线。"))
        write_json(KNOWN, dict(sorted(known.items())))
        fields = {}
    summary = f"发现 {len(fields)} 个前端未引用字段"
    summary += f"、{len(projects)} 个缺项目插画" if projects is not None else "、项目插画未能检查"
    if failures:
        summary += "。未能读取有效清单：" + "、".join(failures) + "，结果不完整"
    report = dict(summary=summary + "。", fields=fields, projects=projects,
                  resources_checked=len(data), projects_checked=len(active or []),
                  failed_resources=failures, skipped_resources=[])
    write_json(args.output, report)
    print(report["summary"])
    return 2 if failures else 3 * bool(fields or projects)

if __name__ == "__main__":
    sys.exit(main())
