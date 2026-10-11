#!/usr/bin/env python3
"""Merge refresh registries by identity; missing identities never mean deletion."""
import argparse
import json
import subprocess
import sys
from pathlib import Path

FILES = ("sources/refresh/registry.json", "sources/refresh/entries.json")
MISSING = object()


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def decode(raw, source):
    try:
        value = json.loads(raw, object_pairs_hook=unique_object)
        if not isinstance(value, dict):
            raise ValueError("top level must be an object")
        return value
    except ValueError as exc:
        raise ValueError(f"{source}: {exc}") from exc


def git(repo, *args):
    return subprocess.run(["git", "-C", str(repo), *args], check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout.decode("utf-8")


def identity_map(document, records, source):
    if not records:
        return document
    if not isinstance(document.get("schema"), str) or not document["schema"].strip():
        raise ValueError(f"{source}: registry schema must be a nonempty string")
    if not isinstance(document.get("records"), list):
        raise ValueError(f"{source}: records must be an array")
    result = {}
    for record in document["records"]:
        key = record.get("id") if isinstance(record, dict) else None
        if not isinstance(key, str) or not key.strip() or key in result:
            raise ValueError(f"{source}: missing, invalid or duplicate record id: {key!r}")
        result[key] = record
    return result


def semantic(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def merge(base, lanes, path, report):
    merged = {}
    keys = dict.fromkeys(key for mapping in [lanes[0][1], base, *[m for _, m in lanes[1:]]]
                         for key in mapping)
    for key in keys:
        before = base.get(key, MISSING)
        changed = [(name, mapping[key]) for name, mapping in lanes if key in mapping
                   and (before is MISSING or semantic(mapping[key]) != semantic(before))]
        if changed and len({semantic(value) for _, value in changed}) > 1:
            report["conflicts"].append({"kind": "identity", "file": path, "key": key,
                                        "base_present": before is not MISSING,
                                        "base": None if before is MISSING else before,
                                        "versions": dict(changed)})
            continue
        if changed:
            name, value = changed[0]
            report["adopted"][name][path] += 1
            merged[key] = value
        else:
            merged[key] = before
    return merged


def metadata_conflicts(base, lanes, path, report):
    current = lanes[0][1]
    for name, document in lanes[1:]:
        for key, value in document.items():
            if key == "records":
                continue
            changed = key not in base or semantic(value) != semantic(base[key])
            different = key not in current or semantic(value) != semantic(current[key])
            if different and (key == "schema" or changed):
                report["conflicts"].append({"kind": "metadata", "file": path, "key": key,
                                            "source": name, "value": value,
                                            "current_present": key in current,
                                            "current": current.get(key)})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="baseline commit or ref")
    parser.add_argument("--branch", action="append", required=True, help="repeat for each commit/ref")
    parser.add_argument("--report", type=Path, help="write the full JSON report")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[2]
    if args.report and args.report.resolve() in [(repo / path).resolve() for path in FILES]:
        parser.error("--report must not overwrite either source registry")
    report = {"base_ref": args.base, "branches": [], "totals": {}, "adopted": {}, "conflicts": []}
    outputs = {}
    try:
        report["base_sha"] = git(repo, "rev-parse", "--verify", "--end-of-options", args.base + "^{commit}").strip()
        for index, ref in enumerate(args.branch, 1):
            sha = git(repo, "rev-parse", "--verify", "--end-of-options", ref + "^{commit}").strip()
            report["branches"].append({"source": f"branch:{index}:{ref}", "ref": ref, "sha": sha})
        names = ["worktree", *[branch["source"] for branch in report["branches"]]]
        report["adopted"] = {name: {path: 0 for path in FILES} for name in names}
        for path in FILES:
            base = decode(git(repo, "show", f"{report['base_sha']}:{path}"), f"base:{path}")
            current = decode((repo / path).read_text(encoding="utf-8-sig"), f"worktree:{path}")
            lanes = [("worktree", current)]
            for branch in report["branches"]:
                lanes.append((branch["source"], decode(git(repo, "show", f"{branch['sha']}:{path}"),
                                                       f"{branch['source']}:{path}")))
            records = path == FILES[0]
            if records:
                metadata_conflicts(base, lanes, path, report)
            mapped = [(name, identity_map(doc, records, f"{name}:{path}")) for name, doc in lanes]
            result = merge(identity_map(base, records, f"base:{path}"), mapped, path, report)
            report["totals"][path] = {"union": len(set().union(identity_map(base, records, path),
                                                        *[set(mapping) for _, mapping in mapped])),
                                     "resolved": len(result)}
            outputs[path] = {**current, "records": list(result.values())} if records else result
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        report["conflicts"].append({"kind": "input", "error": str(exc)})
    report["status"] = "conflict" if report["conflicts"] else "merged"
    serialized = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(serialized, encoding="utf-8", newline="\n")
    print(serialized, end="")
    if report["conflicts"]:
        return 1
    for path, document in outputs.items():
        (repo / path).write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
