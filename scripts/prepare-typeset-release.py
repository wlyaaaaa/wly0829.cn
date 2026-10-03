"""Check typeset publication evidence; the default command has no network effects."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import re
import struct
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote, urljoin, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://wly0829.cn"
EXPECTED_PAGE_COUNT = 84
EFFECT_NAMES = {"cards", "numbers", "dots", "arrows", "screen_enter", "seam", "depth", "update", "ambient",
                "back_top", "footer_signature", "navigation", "viewer", "brief", "live", "screenshots", "compare", "card_feedback"}
spec = importlib.util.spec_from_file_location("typeset_hybrid", ROOT / "scripts/hybrid-release.py")
hybrid = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hybrid)
motion_spec = importlib.util.spec_from_file_location('release_motion', ROOT / 'scripts/prepare-motion-release.py')
motion = importlib.util.module_from_spec(motion_spec)
motion_spec.loader.exec_module(motion)


def now():
    return datetime.now(timezone(timedelta(hours=8))).isoformat()


def read(path):
    return json.loads(Path(path).read_text("utf-8-sig"))


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf8")


def digest(path):
    return hybrid.digest(path)


def bound_file(path, expected):
    path = Path(path)
    if not isinstance(expected, dict) or not path.is_file():
        raise ValueError("Missing recorded input: " + str(path))
    if expected.get("sha256") != digest(path) or expected.get("bytes") != path.stat().st_size:
        raise ValueError("Input changed since build: " + str(path))


def beijing_timestamp(value, field):
    if not isinstance(value, str):
        raise ValueError("Missing timestamp: " + field)
    stamp = datetime.fromisoformat(value)
    if stamp.utcoffset() != timedelta(hours=8):
        raise ValueError("Timestamp must include +08:00: " + field)


def page_token(value):
    if not isinstance(value, str) or not re.fullmatch(r"[a-zA-Z0-9][a-zA-Z0-9._-]*", value):
        raise ValueError("Invalid page identity: " + str(value))
    return value


def local_url(value):
    parts = urlsplit(value)
    if not value.startswith("/") or value.startswith("//") or parts.netloc or parts.query or parts.fragment:
        raise ValueError("Expected canonical website path: " + str(value))
    if "\\" in value or any(x in {".", ".."} for x in parts.path.split("/")):
        raise ValueError("Invalid website path: " + value)
    hybrid.route_file(value)
    return value


def manifest_input(page_root, name):
    candidate = (page_root / name).resolve()
    if not candidate.is_relative_to(page_root.resolve()):
        raise ValueError("Manifest input escapes page directory: " + str(name))
    return candidate


def quality_evidence(quality, inputs, page_manifest):
    assessment = {"source_status": quality.get("status", "unknown"), "report_sha256": quality.get("report_sha256"),
                  "legacy_evidence": bool(quality.get("legacy_evidence")), "visual_pending": [], "program_failures": []}
    quality_hash = quality.get("report_sha256")
    paths = [Path(key) for key, value in inputs.items() if value.get("sha256") == quality_hash]
    if not quality_hash or not paths:
        assessment["source_status"] = "unverified"
        assessment["visual_pending"].append("No bound renderer quality report; Claude must review this disclosed gap")
        if quality.get("status") == "fail":
            assessment["program_failures"].append("Renderer reports a real G1-G6 failure")
        return assessment
    if quality.get("report_path"):
        quality_path = Path(quality["report_path"]).resolve()
        if quality_path not in paths:
            raise ValueError("Quality report path differs from its bound hash")
    else:
        quality_path = paths[0]
    report = read(quality_path)
    records = [item for item in report.get("screens", []) if not item.get("skipped")]
    expected = {(screen["screen"], image["orientation"]) for screen in page_manifest["screens"] for image in screen["images"]}
    recorded = {(item.get("screen"), item.get("orientation")) for item in records}
    if not expected or expected != recorded:
        assessment["visual_pending"].append("Renderer quality records do not cover every manifest screen and orientation")
        if assessment["source_status"] == "pass":
            assessment["source_status"] = "incomplete"
    for item in records:
        label = str(item.get("screen", "")) + "/" + str(item.get("orientation", ""))
        if "status" not in item:
            assessment["legacy_evidence"] = True
        if item.get("status") == "fail" or item.get("issues"):
            assessment["program_failures"].append({"screen": label, "issues": item.get("issues") or ["G1-G6 failed"]})
        if item.get("status") in {"incomplete", "visual_pending", "legacy"} or item.get("incomplete"):
            assessment["visual_pending"].append({"screen": label, "items": item.get("incomplete") or ["Visual review pending"]})
    if report.get("g6"):
        assessment["program_failures"].append({"gate": "G6", "issues": report["g6"]})
    if quality.get("status") == "fail" and not assessment["program_failures"]:
        assessment["program_failures"].append("Renderer reports a real G1-G6 failure")
    if assessment["program_failures"]:
        assessment["source_status"] = "fail"
    elif assessment["legacy_evidence"] and assessment["source_status"] == "pass":
        assessment["source_status"] = "legacy"
    elif assessment["visual_pending"] and assessment["source_status"] == "pass":
        assessment["source_status"] = "incomplete"
    return assessment


def geometry_evidence(page, page_root, page_manifest, inputs, snapshot, snapshot_path, snapshot_hash, entry):
    """Bind every measured layout to the HTML and PNG generation being released."""
    if snapshot.get("schema") != "wly.typeset-geometry.v1" or snapshot.get("geometry_version") != 2:
        raise ValueError("Geometry must use the current producer-viewport measurement contract (version 2)")
    snapshot_key = str(snapshot_path.resolve())
    bound_file(snapshot_path, inputs.get(snapshot_key))
    if inputs[snapshot_key]["sha256"] != snapshot_hash or entry.get("geometry_sha256") != snapshot_hash:
        raise ValueError("Page build does not bind this exact geometry snapshot")
    expected = {}
    for screen in page_manifest["screens"]:
        for image in screen["images"]:
            orientation = image.get("orientation", "v" if "-v" in image["image"] else "h")
            if orientation not in {"h", "v"}:
                raise ValueError("Invalid geometry orientation: " + str(orientation))
            expected.setdefault((screen["screen"], orientation), []).append(image["image"])
    records = snapshot.get("records")
    if not isinstance(records, list) or any(not isinstance(item, dict) for item in records):
        raise ValueError("Geometry snapshot has no measurement records")
    selected = [item for item in records if item.get("page") == page]
    identities = [(item.get("screen"), item.get("orientation")) for item in selected]
    if not expected or len(identities) != len(set(identities)) or set(identities) != set(expected):
        raise ValueError("Geometry records must cover every manifest screen and orientation exactly once")
    for record in selected:
        identity = (record["screen"], record["orientation"])
        label = record["screen"] + "/" + record["orientation"]
        if record.get("issues") != [] or record.get("broken_images") != []:
            raise ValueError("Geometry measurement has unresolved issues or broken images: " + label)
        html_path = manifest_input(page_root, "html/" + record["screen"] + "-" + record["orientation"] + ".html")
        if not record.get("html") or Path(record["html"]).resolve() != html_path:
            raise ValueError("Geometry refers to a different producer HTML: " + label)
        bound_file(html_path, inputs.get(str(html_path)))
        if record.get("html_sha256") != inputs[str(html_path)]["sha256"]:
            raise ValueError("Geometry producer HTML hash is stale: " + label)
        motion.dot_evidence(record, html_path.read_text('utf8'))
        parts = record.get("parts")
        if not isinstance(parts, list) or [item.get("image") for item in parts] != expected[identity]:
            raise ValueError("Geometry PNG parts or their order differ from the manifest: " + label)
        for part in parts:
            image_path = manifest_input(page_root, part["image"])
            bound_file(image_path, inputs.get(str(image_path)))
            with image_path.open("rb") as stream:
                header = stream.read(24)
            if len(header) != 24 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
                raise ValueError("Geometry part is not a PNG with a valid size header: " + str(image_path))
            size = list(struct.unpack(">II", header[16:24]))
            if part.get("size") != size or part.get("sha256") != inputs[str(image_path)]["sha256"]:
                raise ValueError("Geometry PNG size or hash is stale: " + str(image_path))
        viewport_width = record.get("viewport_width")
        source_height = sum(part["size"][1] for part in parts) - 30 * (len(parts) - 1)
        measured_height = record.get("measured_height")
        if type(viewport_width) is not int or viewport_width <= 0 or any(part["size"][0] != viewport_width for part in parts):
            raise ValueError("Geometry viewport differs from the PNG width: " + label)
        if record.get("source_height") != source_height or type(measured_height) is not int or abs(measured_height - source_height) > 2:
            raise ValueError("Measured DOM height differs from the current PNG generation: " + label)
        if any(not isinstance(record.get(name), list) for name in ("cards", "numbers", "dots", "arrows", "illustrations")):
            raise ValueError("Geometry lacks its actual DOM component observations: " + label)
    return {"path": snapshot_key, "sha256": snapshot_hash, "records": len(selected), "geometry_version": 2}


def effects_evidence(entry, dom, snapshot_hash):
    expected = entry.get("effects_expected")
    proof = dom.get("effects")
    if not isinstance(expected, list) or not isinstance(proof, dict):
        raise ValueError("Missing current effects inventory or normal-branch program evidence")
    if any(not isinstance(name, str) or name not in EFFECT_NAMES for name in expected):
        raise ValueError("Unknown original-site effect category")
    if proof.get("status") != "pass" or proof.get("issues") != []:
        raise ValueError("Effects program verification has unresolved issues")
    actual_expected = proof.get("expected")
    preserved = proof.get("preserved")
    if not isinstance(actual_expected, list) or not isinstance(preserved, list):
        raise ValueError("Effects verification lacks expected and preserved capabilities")
    if any(not isinstance(name, str) or name not in EFFECT_NAMES for name in actual_expected + preserved):
        raise ValueError("Effects evidence contains an unknown capability name")
    if set(actual_expected) != set(expected) or not set(expected).issubset(preserved):
        raise ValueError("Effects evidence omits or changes an original-site capability")
    evidence = proof.get("evidence")
    if not isinstance(evidence, dict):
        raise ValueError("Effects verification has no actual program observations")
    for field in ("normal_branch", "new_geometry_bound", "hotspot_css_feedback", "native_buttons_bound"):
        if evidence.get(field) is not True:
            raise ValueError("Required effects evidence is missing or false: " + field)
    if evidence.get("geometry_sha256") != snapshot_hash or entry.get("geometry_sha256") != snapshot_hash:
        raise ValueError("Effects observations belong to a different geometry snapshot")
    counts = evidence.get("geometry_counts")
    if not isinstance(counts, dict) or any(type(counts.get(name)) is not int or counts[name] < 0 for name in ("cards", "numbers", "dots", "arrows")):
        raise ValueError("Effects evidence lacks current-layout geometry counts")
    if type(evidence.get("running_animation_count")) is not int or evidence["running_animation_count"] < 0:
        raise ValueError("Effects evidence lacks an observed animation count")
    checks = evidence.get("checks")
    if not isinstance(checks, list) or len(checks) != 2 or {item.get("width") for item in checks} != {1440, 390}:
        raise ValueError("Effects observations must cover the normal desktop and phone branches")
    observed = set()
    totals = dict.fromkeys(("cards", "numbers", "dots", "arrows"), 0)
    running = []
    for check in checks:
        if check.get("issues") != [] or check.get("reduced_motion") is not False or check.get("hidden") is not False:
            raise ValueError("Effects normal-branch observations are incomplete or contain failures")
        if any(check.get(field) is not True for field in ("normal_branch", "new_geometry_bound", "hotspot_css_feedback", "native_buttons_bound")):
            raise ValueError("Effects desktop or phone branch lacks its actual binding and interaction observations")
        current = check.get("geometry_counts")
        if not isinstance(current, dict) or any(type(current.get(name)) is not int or current[name] < 0 for name in totals):
            raise ValueError("Effects viewport observation lacks current geometry counts")
        for name in totals:
            totals[name] += current[name]
        animation_count = check.get("running_animation_count")
        if type(animation_count) is not int or animation_count < 0:
            raise ValueError("Effects viewport observation lacks an actual animation count")
        running.append(animation_count)
        capabilities = check.get("preserved")
        if not isinstance(capabilities, list) or any(name not in EFFECT_NAMES for name in capabilities):
            raise ValueError("Effects viewport observation lacks its preserved capabilities")
        observed.update(capabilities)
    if counts != totals or evidence["running_animation_count"] != max(running) or set(preserved) != observed:
        raise ValueError("Effects summary differs from its actual desktop and phone observations")
    capability = entry.get('effects_capabilities', {}).get('dots')
    if capability:
        if capability.get('policy') != motion.DOT_POLICY or capability.get('status') not in {'present', 'no_corresponding_element'}:
            raise ValueError('Current status-dot capability evidence is incomplete')
        if (capability['status'] == 'present') != ('dots' in expected) or (capability['status'] == 'present') != (counts['dots'] > 0):
            raise ValueError('Expected status-dot capability differs from measured active markers')
    if entry.get('motion_appearance'):
        for check in checks:
            if check.get('motion_appearance') != entry['motion_appearance']:
                raise ValueError('Observed motion appearance differs from the built configuration')
    # Counts describe the current DOM; they are deliberately not compared to old
    # image coordinates or old component counts.
    return {"expected": expected, "preserved": preserved, "new_geometry_bound": True, "geometry_sha256": snapshot_hash}


def asset_path(url, page_url):
    # Relative src/mask URLs resolve against the page route, just as in Chrome.
    parts = urlsplit(urljoin(page_url, url))
    path = parts.path.lstrip("/")
    if not path or "\\" in path or any(part in {".", ".."} for part in path.split("/")):
        raise ValueError("Invalid static video asset path")
    return path


def video_evidence(entry, dom, files):
    if "video_expected" not in entry:
        raise ValueError("Build lacks the current original-site video inventory")
    expected = entry["video_expected"]
    proof = dom.get("video_checks")
    if not isinstance(proof, dict) or proof.get("status") != "pass" or proof.get("issues") != []:
        raise ValueError("Video program verification is missing or has unresolved issues")
    observations = proof.get("files")
    gates = proof.get("gates")
    if not isinstance(observations, list) or not isinstance(gates, list):
        raise ValueError("Video evidence lacks file and condition checks")
    if expected is None:
        if observations or gates or proof.get("mounted") is not False:
            raise ValueError("A page without an original video mounted a player or lacks its no-mount observation")
        checks = dom.get("effects", {}).get("evidence", {}).get("checks")
        if not isinstance(checks, list) or len(checks) != 2 or {item.get("width") for item in checks} != {1440, 390} or any(
                item.get("normal_branch") is not True or item.get("hero_video_attached") is not False or item.get("video_spec", {}) is not None for item in checks):
            raise ValueError("A page without original video lacks both actual normal-branch no-player observations")
        return {"expected": None, "mounted": False}
    if not isinstance(expected, dict) or proof.get("issues") != []:
        raise ValueError("Invalid current video specification or missing issue result")
    if len(observations) != 2 or {item.get("kind") for item in observations} != {"video", "mask"}:
        raise ValueError("Video and mask both need exact HTTP byte evidence")
    for item in observations:
        prefix = "src" if item["kind"] == "video" else "mask"
        path = asset_path(expected[prefix], entry["url"])
        expected_hash = expected[prefix + "_sha256"]
        expected_bytes = expected[prefix + "_bytes"]
        if files.get(path) != {"sha256": expected_hash, "bytes": expected_bytes}:
            raise ValueError("The active video or mask bytes were not preserved in the release: " + path)
        if asset_path(item["url"], entry["url"]) != path or item.get("http_status") != 200 or item.get("status") != "pass":
            raise ValueError("Video asset did not return HTTP 200 at the expected path: " + path)
        if item.get("bytes") != expected_bytes or item.get("expected_bytes") != expected_bytes or item.get("sha256") != expected_hash or item.get("expected_sha256") != expected_hash:
            raise ValueError("Video HTTP bytes or hashes differ from the active original: " + path)
    cases = {"desktop", "below_width", "portrait", "reduced_motion", "offscreen", "document_hidden"}
    if len(gates) != len(cases) or {item.get("case") for item in gates} != cases:
        raise ValueError("Video evidence must cover all six mount/play conditions")
    for item in gates:
        case = item["case"]
        mount = case == "desktop"
        if item.get("status") != "pass" or item.get("issues") != [] or type(item.get("hidden")) is not bool:
            raise ValueError("Video gate failed or lacks a visibility observation: " + case)
        if any(type(item.get(field)) is not bool or item[field] is not mount for field in ("expected_mounted", "expected_playing", "mounted", "playing")):
            raise ValueError("Video mounted or played outside its required condition: " + case)
        observations = {"time_advanced": mount, "reduced_motion": case == "reduced_motion",
                        "portrait": case == "portrait", "hidden": case == "document_hidden"}
        if any(type(item.get(field)) is not bool or item[field] is not value for field, value in observations.items()):
            raise ValueError("Video gate lacks the actual native condition or player observation: " + case)
        if type(item.get("attached")) is not bool or mount and item["attached"] is not True:
            raise ValueError("Video gate lacks its attached-player observation: " + case)
        if type(item.get("section_visible")) is not bool or case == "desktop" and not item["section_visible"] or case == "offscreen" and item["section_visible"]:
            raise ValueError("Video gate did not isolate viewport visibility: " + case)
        if item["attached"]:
            if any(item.get(field) is not (not mount) for field in ("video_paused", "video_hidden")):
                raise ValueError("The retained player does not match its actual pause/hide condition: " + case)
            before_time, after_time = item.get("current_time_before"), item.get("current_time_after")
            if any(type(value) not in {int, float} or not math.isfinite(value) or value < 0 for value in (before_time, after_time)):
                raise ValueError("Video gate lacks real playback-time observations: " + case)
            if mount and abs(after_time - before_time) <= .01 or not mount and after_time > before_time + .01:
                raise ValueError("Playback-time observations contradict the required running or stopped condition: " + case)
        if item.get("phase") != ("playing" if mount else "image"):
            raise ValueError("Video gate lacks its actual runtime phase: " + case)
        width, height = item.get("width"), item.get("height")
        if type(width) is not int or type(height) is not int or width <= 0 or height <= 0:
            raise ValueError("Video gate lacks real viewport dimensions: " + case)
        if case == "desktop" and (width != 1440 or width <= height):
            raise ValueError("Video desktop gate did not exercise the 1440-pixel landscape branch")
        if case == "desktop" and item["hidden"]:
            raise ValueError("Video played while hidden in the desktop gate")
        if case == "below_width" and width != 1023:
            raise ValueError("Video width gate did not exercise the 1023-pixel boundary")
        if case == "portrait" and (width != 390 or width >= height):
            raise ValueError("Video portrait gate did not exercise the 390-pixel portrait branch")
        if case not in {"below_width", "portrait"} and (width != 1440 or width <= height):
            raise ValueError("Video gate did not isolate its condition on the desktop viewport: " + case)
        if case == "document_hidden":
            if item.get("method") != "navigation_visibilitychange" or item.get("endpoint") != "about:blank" or item.get("visibility_event_observed") is not True or item.get("visibility_state") != "hidden" or item.get("parent_hidden") is not False:
                raise ValueError("Document-hidden evidence lacks the real iframe navigation visibility event")
            if urlsplit(item.get("source_url", "")).path != entry["url"]:
                raise ValueError("Document-hidden event belongs to a different page")
            before = item.get("before_navigation")
            if not isinstance(before, dict) or before.get("case") != "desktop" or before.get("status") != "pass" or before.get("issues") != []:
                raise ValueError("Document-hidden transition lacks its visible desktop playback observation")
            if any(before.get(field) is not True for field in ("expected_mounted", "expected_playing", "mounted", "playing", "attached", "section_visible", "time_advanced")) or any(before.get(field) is not False for field in ("hidden", "reduced_motion", "portrait", "video_paused", "video_hidden")) or before.get("phase") != "playing":
                raise ValueError("Document-hidden transition did not start from actual visible playback")
            if before.get("width") != width or before.get("height") != height:
                raise ValueError("Document-hidden transition changed its viewport before the native event")
            start, end = before.get("current_time_before"), before.get("current_time_after")
            if any(type(value) not in {int, float} or not math.isfinite(value) or value < 0 for value in (start, end)) or abs(end - start) <= .01:
                raise ValueError("Document-hidden transition lacks measured playback before navigation")
    return {"expected": expected, "verified_cases": sorted(cases)}


def prepare(args):
    release = args.release.resolve()
    if args.output.resolve().is_relative_to(release):
        raise ValueError("Preparation receipt must be outside the immutable release")
    result = {"schema": "wly.typeset-preparation.v1", "status": "blocked", "prepared_at_beijing": now(),
              "release_root": str(release), "pages": {}, "blockers": [], "publication_performed": False}

    def block(kind, message, page=None):
        issue = {"kind": kind, "message": str(message)}
        if page:
            issue["page"] = page
        result["blockers"].append(issue)

    # The explicit Claude instruction is supplied by the caller; never manufacture it.
    build = read(args.build_report)
    verification = read(args.verification)
    directive_present = args.directive is not None and args.directive.is_file()
    directive = read(args.directive) if directive_present else {}
    geometry_path = args.geometry.resolve()
    geometry_payload = geometry_path.read_bytes()
    geometry = json.loads(geometry_payload.decode("utf-8-sig"))
    geometry_hash = hashlib.sha256(geometry_payload).hexdigest()
    for data, schema, name in ((build, "wly.typeset-build.v1", "build"),
                               (verification, "wly.typeset-verification.v1", "DOM verification"),
                               (directive, "wly.typeset-publish-directive.v1", "Claude publication instruction")):
        if data.get("schema") != schema and (name != "Claude publication instruction" or directive_present):
            block("evidence", name + " schema mismatch")
    manifest = hybrid.verify_release(release)
    baseline_manifest = read(args.baseline_manifest)
    old, _ = hybrid.verify_baseline(args.baseline.resolve(), baseline_manifest)
    build_hash = digest(args.build_report)
    release_id = manifest["release_id"]
    result.update(release_id=release_id, build_report_sha256=build_hash,
                  verification_sha256=digest(args.verification), directive_sha256=digest(args.directive) if directive_present else None,
                  release_manifest_sha256=digest(release / hybrid.MANIFEST), baseline_index_sha256=old["index.html"]["sha256"],
                  geometry_path=str(geometry_path), geometry_sha256=geometry_hash)
    elapsed = build.get("seconds")
    measured_seconds = elapsed if type(elapsed) in {int, float} and math.isfinite(elapsed) and elapsed >= 0 else None
    result["local_build_statistics"] = {"built_at_beijing": build.get("built_at_beijing"), "pages": len(build.get("pages", {})),
        "files": len(manifest["files"]), "bytes": sum(item["bytes"] for item in manifest["files"].values()),
        "elapsed_seconds": measured_seconds, "upload_seconds": None}
    if measured_seconds is None:
        result["local_build_statistics"]["timing_note"] = "This build report has no valid measured seconds; duration remains unknown"
    if not build.get("geometry_path") or Path(build["geometry_path"]).resolve() != geometry_path or build.get("geometry_sha256") != geometry_hash:
        block("geometry", "Build does not identify the exact geometry snapshot supplied to publication")
    if manifest.get("baseline_files") != old:
        block("baseline", "Release is not bound to the supplied production baseline")
    overlay_info = build.get('release_overlay')
    if manifest.get('release_overlay'):
        try:
            if not overlay_info: raise ValueError('Build lacks the exact release overlay')
            overlay_path = Path(overlay_info['path'])
            bound_file(overlay_path, overlay_info)
            overlay = hybrid.load_overlay(overlay_path, args.baseline.resolve())
            public_entries = {rel:{key:value for key,value in entry.items() if key!='source_path'} for rel,entry in overlay['files'].items()}
            if public_entries != manifest['release_overlay'] or overlay_info['files'] != overlay['files']:
                raise ValueError('Release overlay differs from the reviewed build')
            runtime = {entry['page']:entry for entry in public_entries.values() if entry['kind']=='runtime_reference'}
            if runtime:
                report_path = getattr(args,'runtime_verification',None)
                if not report_path: raise ValueError('Runtime-reference updates need actual final-artifact rotation verification')
                proof = read(report_path)
                if proof.get('schema')!='wly.typeset-reading-check.v1' or proof.get('evidence_mode')!='artifact' or proof.get('release_id')!=release_id or proof.get('status')!='pass' or proof.get('artifact_unchanged') is not True:
                    raise ValueError('Reading-position evidence is not the actual final artifact')
                plan_path=getattr(args,'reading_plan',None)
                if not plan_path or proof.get('build_report_sha256')!=digest(plan_path):
                    raise ValueError('Reading-position evidence belongs to a different URL plan')
                plan=read(plan_path)
                expected_runtime={page:entry['url'] for page,entry in runtime.items()}
                expected_runtime.update({page:entry['url'] for page,entry in build['pages'].items()})
                if set(proof['pages'])!=set(expected_runtime) or set(plan['pages'])!=set(expected_runtime):
                    raise ValueError('Reading-position verification must cover every updated runtime page')
                reviewed_root=Path(build['output_root']).resolve()
                if Path(proof['root']).resolve()!=reviewed_root or proof['manifest_sha256']!=digest(reviewed_root/hybrid.MANIFEST):
                    raise ValueError('Reading-position report is bound to a different reviewed artifact')
                summary=proof['summary']
                if summary['resizes']<=0 or summary['navigation_checks']<=0 or any(summary[field] for field in ('failed_resizes','screen_mismatches','failed_navigation','page_errors')):
                    raise ValueError('Reading-position verification contains real failures')
                for page,url in expected_runtime.items():
                    observed=proof['pages'].get(page,{})
                    relative=hybrid.route_file(url)
                    if observed.get('url')!=url or plan['pages'][page]['url']!=url or observed.get('html_sha256')!=manifest['files'][relative]['sha256']:
                        raise ValueError('Reading-position HTML binding differs: '+page)
                    if not any(case.get('page')==page and case.get('pass') is True for case in proof['cases']):
                        raise ValueError('Missing actual reading-position cases: '+page)
                    expected_scripts=[]
                    for src in re.findall(r'<script\b[^>]*\bsrc=["\']([^"\'<>]+)["\']',(release/relative).read_text('utf8')):
                        target=urlsplit(urljoin(url,src));rel=target.path.lstrip('/')
                        expected_scripts.append({'src':src,'url':target.path,'sha256':manifest['files'][rel]['sha256'] if not target.netloc and rel in manifest['files'] else None})
                    observed_scripts=observed.get('scripts',[])
                    artifact_scripts=[{key:script.get(key) for key in ('src','url','sha256')} for script in observed_scripts]
                    if artifact_scripts!=expected_scripts or any(script.get('overridden') is not False or script.get('served_sha256')!=script.get('sha256') for script in observed_scripts):
                        raise ValueError('Reading-position script set or identity differs: '+page)
                result['runtime_verification']={'path':str(report_path),'sha256':digest(report_path),'summary':summary,'pages':sorted(expected_runtime),'reading_plan_sha256':digest(plan_path)}
            result['release_overlay']={'path':str(overlay_path),'sha256':digest(overlay_path),'files':public_entries}
        except (ValueError, KeyError, OSError, TypeError) as error:
            block('release_overlay',error)
    elif overlay_info:
        block('release_overlay','Build overlay is absent from the release manifest')
    if build.get("files") != manifest["files"]:
        block("build", "Release files differ from the Claude-reviewed build report; rebuild requires new verification")
    if build.get("release_id", release_id) != release_id:
        block("build", "Build release_id differs; repeat program verification, Claude review, and the publication instruction")
    if build.get("baseline_index_sha256") != old["index.html"]["sha256"]:
        block("baseline", "Build report does not bind the exact production homepage")
    if build.get("baseline_manifest_sha256") and build["baseline_manifest_sha256"] != digest(args.baseline_manifest):
        block("baseline", "Production baseline manifest changed since build")
    if not build.get("baseline_root") or Path(build["baseline_root"]).resolve() != args.baseline.resolve():
        block("baseline", "Build report refers to a different baseline directory")
    if manifest["files"].get("index.html") != old["index.html"] or digest(release / "index.html") != old["index.html"]["sha256"]:
        block("homepage", "Production homepage bytes changed")
    for url in manifest.get("accepted_pages", {}):
        if Path(hybrid.route_file(url)).as_posix() == "index.html":
            block("homepage", "Homepage must never occur in accepted_pages")
    bound_evidence = [(verification, "DOM verification")]
    if directive_present:
        bound_evidence.append((directive, "Claude publication instruction"))
    for data, name in bound_evidence:
        if data.get("build_report_sha256") != build_hash or data.get("release_id") != release_id:
            block("evidence", name + " belongs to a different build or release")
    try:
        beijing_timestamp(build.get("built_at_beijing"), "built_at_beijing")
        beijing_timestamp(verification.get("verified_at_beijing"), "verified_at_beijing")
        if directive_present:
            beijing_timestamp(directive.get("instructed_at_beijing"), "instructed_at_beijing")
    except ValueError as error:
        block("evidence", error)
    instruction_source = directive.get("source")
    source_present = isinstance(instruction_source, str) and bool(instruction_source.strip()) or isinstance(instruction_source, dict) and any(isinstance(value, str) and value.strip() for value in instruction_source.values())
    if directive.get("recorded_by") != "Claude" or directive.get("instruction") != "发布" or directive.get("reviewed") is not True or not source_present:
        block("publication_instruction", "Claude must review the full program evidence and issue an explicit publication instruction with its real source")

    rows = [json.loads(line) for line in args.inventory.read_text("utf-8-sig").splitlines() if line.strip()]
    inventory_pages = {}
    for row in rows:
        inventory_pages.setdefault(page_token(row["page"]), []).append(row)
    expected = sorted(inventory_pages)
    selected = list(args.pages) if args.pages else expected
    if not selected or len(selected) != len(set(selected)):
        block("scope", "Requested page list must be nonempty and contain no duplicates")
    for page in selected:
        page_token(page)
    if not args.pages and len(expected) != EXPECTED_PAGE_COUNT:
        block("scope", f"Full batch expects {EXPECTED_PAGE_COUNT} pages, inventory contains {len(expected)}")
    if set(selected) - set(expected):
        block("scope", "Pages absent from inventory: " + ", ".join(sorted(set(selected) - set(expected))))
    if directive_present and (not isinstance(directive.get("pages"), list) or set(directive["pages"]) != set(selected) or len(directive["pages"]) != len(selected)):
        block("publication_instruction", "Instruction pages must exactly equal this publication batch")
    result.update(batch="partial" if args.pages else "full", expected_pages=expected, selected_pages=selected,
                  deferred_pages=sorted(set(expected) - set(selected)), expected_page_count=EXPECTED_PAGE_COUNT)
    if args.rebuilt_report:
        rebuilt = read(args.rebuilt_report)
        if rebuilt.get("schema") != "wly.typeset-build.v1":
            block("rebuild", "Rebuild report schema mismatch")
        for field in ("release_id", "inputs", "files", "baseline_root", "baseline_index_sha256",
                      "baseline_manifest_sha256", "geometry_path", "geometry_sha256", "release_overlay"):
            if rebuilt.get(field) != build.get(field):
                block("rebuild", "Rebuild changed the reviewed " + field + "; repeat program verification and Claude's publication instruction")
        for page in selected:
            current = rebuilt.get("pages", {}).get(page, {})
            reviewed = build.get("pages", {}).get(page, {})
            if current.get("status") != "built" or current.get("issues") != []:
                block("rebuild", "Rebuild reports an unresolved program issue", page)
            for field in ("url", "inputs", "html_sha256", "quality", "effects_expected", "video_expected", "geometry_sha256"):
                if current.get(field) != reviewed.get(field):
                    block("rebuild", "Rebuild changed the reviewed page " + field, page)
    global_inputs = build.get("inputs", {})
    inventory_key = str(args.inventory.resolve())
    bound_urls = []
    for page in selected:
        start = len(result["blockers"])
        entry = build.get("pages", {}).get(page, {})
        result["pages"][page] = {"status": "blocked", "url": entry.get("url"), "quality": entry.get("quality", {}).get("status")}
        if page == "github-profile":
            block("publication_target", "github-profile has no accepted website route; Claude must resolve its publication target", page)
        if page in {"home", "index", "homepage"}:
            block("homepage", "Homepage cannot enter the typeset publication batch", page)
        if entry.get("status") != "built":
            block("build", "Page is not built", page)
        if entry.get("issues"):
            block("build", "Build contains unresolved issues: " + json.dumps(entry["issues"], ensure_ascii=False), page)
        quality = entry.get("quality", {})
        if quality.get("status") == "fail":
            block("quality_program", "Renderer reports real G1-G6 failures; the publication instruction cannot waive them", page)
        try:
            url = local_url(entry["url"])
            if Path(hybrid.route_file(url)).as_posix() == "index.html":
                raise ValueError("Page URL attempts to replace the homepage")
            if page == "404" and url != "/404.html":
                raise ValueError("404 must retain /404.html")
            bound_urls.append(url)
            if entry.get("html_sha256") != digest(release / hybrid.route_file(url)):
                raise ValueError("HTML bytes differ from build report")
            inputs = {str(Path(key).resolve()): value for key, value in {**global_inputs, **entry.get("inputs", {})}.items()}
            if not inputs:
                raise ValueError("No input hashes in build report")
            for key, value in inputs.items():
                bound_file(key, value)
            page_root = args.typeset_root / page
            page_manifest_path = (page_root / "page-manifest.json").resolve()
            page_manifest = read(page_manifest_path)
            if page_manifest.get("page") != page:
                raise ValueError("Page manifest identity mismatch")
            required = {str(page_manifest_path), inventory_key}
            manifest_screens = []
            for screen in page_manifest["screens"]:
                manifest_screens.append(screen["screen"])
                if not screen.get("images"):
                    raise ValueError("Manifest screen has no images: " + screen["screen"])
                for image in screen["images"]:
                    for field in ("image", "links"):
                        required.add(str(manifest_input(page_root, image[field])))
            inventory_screens = [row["screen_id"] for row in inventory_pages.get(page, []) if not row.get("hidden")]
            if len(manifest_screens) != len(set(manifest_screens)) or manifest_screens != inventory_screens:
                raise ValueError("Manifest screen coverage differs from inventory")
            for row in inventory_pages.get(page, []):
                source = Path(row["source_path"]).resolve()
                required.add(str(source))
                if digest(source) != row["source_sha256"]:
                    raise ValueError("Inventory source hash is stale: " + str(source))
            if required - set(inputs):
                raise ValueError("Build does not bind required inputs: " + ", ".join(sorted(required - set(inputs))))
            result["pages"][page]["geometry"] = geometry_evidence(page, page_root, page_manifest, inputs,
                                                                 geometry, geometry_path, geometry_hash, entry)
            quality_review = {"source_status": "unverified", "report_sha256": quality.get("report_sha256")}
            try:
                quality_review = quality_evidence(quality, inputs, page_manifest)
                result["pages"][page]["quality_review"] = quality_review
                if quality_review["program_failures"]:
                    block("quality_program", json.dumps(quality_review["program_failures"], ensure_ascii=False), page)
            except (ValueError, KeyError, OSError, TypeError) as error:
                block("quality", error, page)
            dom = verification.get("pages", {}).get(page, {})
            if dom.get("status") != "pass" or dom.get("url") != url:
                raise ValueError("DOM verification failed, missing, or targets another URL")
            checks = dom.get("checks", [])
            if not isinstance(checks, list) or len(checks) != 2 or {check.get("width") for check in checks} != {1440, 390}:
                raise ValueError("DOM evidence must cover both 1440 and 390 pixels")
            if any(check.get("issues") != [] or check.get("status") != "pass" for check in checks):
                raise ValueError("DOM checks contain unresolved issues")
            for kind, validator in (("effects_program", lambda: effects_evidence(entry, dom, geometry_hash)),
                                    ("video_program", lambda: video_evidence(entry, dom, manifest["files"]))):
                try:
                    result["pages"][page][kind] = validator()
                except (ValueError, KeyError, OSError, TypeError) as error:
                    block(kind, error, page)
            result["pages"][page]["evidence"] = {"page": page, "page_manifest_sha256": digest(page_manifest_path),
                "build_report_sha256": build_hash, "quality_report_sha256": quality_review.get("report_sha256"),
                "source_quality_status": quality_review.get("source_status"),
                "verification_sha256": result["verification_sha256"], "directive_sha256": result["directive_sha256"],
                "geometry_sha256": geometry_hash,
                "candidate_html_sha256": entry["html_sha256"]}
        except (ValueError, KeyError, OSError, TypeError) as error:
            block("page_evidence", error, page)
        if len(result["blockers"]) == start:
            result["pages"][page]["status"] = "ready"
    if len(bound_urls) != len(set(bound_urls)) or set(manifest.get("accepted_pages", {})) != set(bound_urls):
        block("scope", "accepted_pages must exactly match the selected website URLs")
    result["status"] = "ready" if not result["blockers"] else "blocked"
    write(args.output, result)
    return result


def fetch_bytes(relative, size=None):
    url = SITE + "/" + quote(relative, safe="/") + "?typeset_readback=" + str(time.time_ns())
    request = Request(url, headers={"Cache-Control": "no-cache", "Accept-Encoding": "identity", "User-Agent": "wly-typeset-release-readback"})
    with urlopen(request, timeout=20) as response:
        return response.read() if size is None else response.read(size + 1)


def online_file(relative, expected, attempts=3):
    last = None
    for attempt in range(attempts):
        try:
            body = fetch_bytes(hybrid.file_route(relative).lstrip("/"), expected["bytes"])
            actual = {"sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body)}
            if actual == expected:
                return {"path": relative, "status": "pass", "attempts": attempt + 1}
            last = {"path": relative, "status": "mismatch", "actual": actual, "expected": expected}
        except (OSError, ValueError) as error:
            last = {"path": relative, "status": "unknown", "message": str(error)}
        if attempt + 1 < attempts:
            time.sleep(2)
    return last


def online_oss_file(relative, expected, attempts=3):
    last = None
    for attempt in range(attempts):
        try:
            headers = {'Origin': SITE, 'Referer': SITE+'/', 'Accept-Encoding': 'identity', 'Cache-Control': 'no-cache'}
            h, count = hashlib.sha256(), 0
            with urlopen(Request(expected['url'], headers=headers), timeout=60) as response:
                cors = response.headers.get('Access-Control-Allow-Origin')
                mime = response.headers.get_content_type()
                accepted = {expected['content_type']}
                if expected['content_type'] == 'application/javascript': accepted.add('text/javascript')
                if response.status != 200 or cors not in ('*', SITE) or mime not in accepted:
                    raise ValueError('OSS HTTP, CORS or MIME differs')
                while chunk := response.read(1024*1024):
                    h.update(chunk); count += len(chunk)
            actual = {'sha256': h.hexdigest(), 'bytes': count}
            if actual != {key: expected[key] for key in ('sha256', 'bytes')}:
                last = {'path': relative, 'status': 'mismatch', 'actual': actual}
            else:
                if relative.endswith('.mp4'):
                    length = min(count, 32); headers['Range'] = f'bytes=0-{length-1}'
                    with urlopen(Request(expected['url'], headers=headers), timeout=60) as response:
                        part = response.read(length+1)
                        if (response.status != 206 or response.headers.get('Content-Range') != f'bytes 0-{length-1}/{count}'
                                or len(part) != length or hashlib.sha256(part).hexdigest() != expected['range_sha256']):
                            raise ValueError('OSS video range differs from verified bytes')
                return {'path': relative, 'status': 'pass', 'attempts': attempt+1, 'bytes': count, 'sha256': h.hexdigest()}
        except (OSError, ValueError) as error:
            last = {'path': relative, 'status': 'unknown', 'message': str(error)}
        if attempt+1 < attempts: time.sleep(2)
    return last


def production_check(args):
    manifest = read(args.baseline_manifest)
    baseline, _ = hybrid.verify_baseline(args.baseline.resolve(), manifest)
    commit = subprocess.check_output(["git", "rev-parse", "--verify", args.production_ref + "^{commit}"], cwd=ROOT, text=True).strip()
    remote_manifest = json.loads(subprocess.check_output(["git", "show", commit + ":site-release/release-manifest.json"], cwd=ROOT))
    if remote_manifest.get("schema") != "wly.hybrid-release.v1":
        raise ValueError("Fetched production commit has no verified hybrid release")
    if remote_manifest.get('oss'):
        oss_spec = importlib.util.spec_from_file_location('oss_publication', ROOT/'scripts/prepare-oss-release.py')
        oss = importlib.util.module_from_spec(oss_spec); oss_spec.loader.exec_module(oss)
        oss.verify_manifest(remote_manifest)
        remote_id = remote_manifest['release_id']
    else:
        remote_id = hashlib.sha256(json.dumps(remote_manifest["files"], sort_keys=True).encode()).hexdigest()
    if remote_id != remote_manifest.get("release_id"):
        raise ValueError("Fetched production release identifier differs from its file inventory")
    remote_files = dict(remote_manifest["files"])
    if "CNAME" not in baseline:
        remote_files.pop("CNAME", None)
    if baseline != remote_files:
        raise ValueError("Baseline is stale or incomplete against fetched origin/main; capture current production including its homepage")
    online = None
    for attempt in range(3):
        try:
            online = json.loads(fetch_bytes("release-manifest.json"))
            if online.get("release_id") == remote_manifest.get("release_id") and online.get("files") == remote_manifest.get("files"):
                break
        except (OSError, ValueError):
            online = None
        if attempt < 2:
            time.sleep(2)
    if not online or online.get("release_id") != remote_manifest.get("release_id") or online.get("files") != remote_manifest.get("files"):
        raise ValueError("Current Pages identity is not confirmed; stop and retry readback without rollback")
    homepage = online_file("index.html", baseline["index.html"])
    if homepage["status"] != "pass":
        raise ValueError("Current production homepage is not confirmed: " + json.dumps(homepage))
    if args.build_report:
        claimed = read(args.build_report).get("baseline_production_commit")
        if claimed and claimed != commit:
            raise ValueError("Build's production commit is stale; rebuild and repeat acceptance")
    result = {"schema": "wly.typeset-production-check.v1", "status": "pass", "production_commit": commit,
              "production_release_id": remote_manifest["release_id"], "baseline_index_sha256": baseline["index.html"]["sha256"],
              "checked_at_beijing": now(), "homepage": homepage}
    write(args.output, result)
    return result


def stage_check(args):
    """Verify copied bytes after the old in-repo baseline has been replaced.

    All producer inputs and instructions were checked in the bound ready receipt
    before replacement. This step checks the actual copy and allowed metadata.
    """
    build=read(args.build_report);prepared=read(args.preparation)
    manifest=hybrid.verify_release(args.release.resolve())
    if manifest!=read(args.expected_manifest):
        raise ValueError('Staged manifest differs from the exact metadata-bearing rebuild')
    if prepared.get('schema')!='wly.typeset-preparation.v1' or prepared.get('status')!='ready' or prepared.get('blockers'):
        raise ValueError('Staging requires the completed pre-replacement evidence check')
    if prepared['build_report_sha256']!=digest(args.build_report) or prepared['release_id']!=manifest['release_id'] or manifest['files']!=build['files']:
        raise ValueError('Staged artifact differs from the checked rebuild')
    reviewed=hybrid.verify_release(Path(build['output_root']).resolve())
    for field in ('baseline_files','release_overlay','routes','rejected_pages','temporary_href_mappings'):
        if manifest.get(field)!=reviewed.get(field): raise ValueError('Staged manifest changed '+field)
    expected={prepared['pages'][page]['url']:prepared['pages'][page]['evidence'] for page in prepared['selected_pages']}
    if manifest['accepted_pages']!=expected or manifest['rollback_ref']!=args.rollback_ref:
        raise ValueError('Staged publication metadata differs from the checked receipt')
    result={'schema':'wly.typeset-stage-check.v1','status':'pass','release_id':manifest['release_id'],
            'checked_at_beijing':now(),'preparation_sha256':digest(args.preparation),
            'build_report_sha256':digest(args.build_report),'manifest_sha256':digest(args.release/hybrid.MANIFEST),
            'files':len(manifest['files']),'producer_inputs_checked_before_replacement':True}
    write(args.output,result)
    return result


def readback(args):
    manifest = hybrid.verify_release(args.release.resolve())
    files = {key: value for key, value in manifest["files"].items() if key != "CNAME"}
    for relative, obj in manifest.get('oss', {}).get('objects', {}).items():
        entry = dict(obj)
        if relative.endswith('.mp4'):
            entry['range_sha256'] = manifest['oss']['verification']['objects'][relative]['range']['sha256']
        files['OSS/'+relative] = entry
    retained = {}
    retry_report = getattr(args, "retry_report", None)
    if retry_report:
        previous = read(retry_report)
        if previous.get("schema") != "wly.typeset-online-readback.v1" or previous.get("release_id") != manifest["release_id"]:
            raise ValueError("Retry report belongs to a different release")
        retained = {item["path"]: item for item in previous.get("checks", [])}
        if set(retained) != set(files):
            raise ValueError("Retry report does not cover the complete release")
        pending = {key: value for key, value in files.items() if retained[key].get("status") != "pass"}
    else:
        pending = files
    with ThreadPoolExecutor(max_workers=6) as pool:
        current_checks = list(pool.map(lambda item: online_oss_file(*item) if item[0].startswith('OSS/') else online_file(*item), sorted(pending.items())))
    retained.update({item["path"]: item for item in current_checks})
    checks = [retained[key] for key in sorted(files)]
    identity = None
    identity_issue = None
    for attempt in range(3):
        try:
            identity = json.loads(fetch_bytes("release-manifest.json"))
            if identity.get("release_id") == manifest["release_id"] and identity.get("files") == manifest["files"] and identity.get('oss') == manifest.get('oss'):
                identity_issue = None
                break
            identity_issue = {"path": "release-manifest.json", "status": "mismatch", "message": "Online release identity differs",
                              "actual_release_id": identity.get("release_id"),
                              "actual_files_sha256": hashlib.sha256(json.dumps(identity.get("files", {}), sort_keys=True).encode()).hexdigest()}
        except (OSError, ValueError) as error:
            identity_issue = {"path": "release-manifest.json", "status": "unknown", "message": str(error)}
        if attempt < 2:
            time.sleep(2)
    failed = [check for check in checks if check["status"] != "pass"]
    if identity_issue:
        failed.append(identity_issue)
    status = "unknown" if any(item["status"] == "unknown" for item in failed) else "mismatch" if failed else "pass"
    result = {"schema": "wly.typeset-online-readback.v1", "status": status, "release_id": manifest["release_id"],
              "checked_at_beijing": now(), "checked_files": len(checks), "checks": checks, "issues": failed,
              "retried_files": len(current_checks), "retry_report_sha256": digest(retry_report) if retry_report else None,
              "excluded_deployment_metadata": ["CNAME"], "automatic_rollback": False}
    write(args.output, result)
    return result


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if argv and argv[0].startswith("--"):
        argv.insert(0, "prepare")
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    gate = commands.add_parser("prepare", help="Local evidence check; no build, Git mutation, or network")
    for name in ("typeset-root", "inventory", "geometry", "baseline", "baseline-manifest", "release", "build-report", "verification", "output"):
        gate.add_argument("--" + name, type=Path, required=True)
    gate.add_argument("--directive", type=Path, help="Actual Claude publication instruction; omission produces a local publication_instruction blocker")
    gate.add_argument("--rebuilt-report", type=Path, help="Bind a publish-time rebuild's inputs and program contract to the reviewed report")
    gate.add_argument('--runtime-verification',type=Path,help='Actual artifact rotation checks for the preserved pages whose app references change')
    gate.add_argument('--reading-plan',type=Path,help='Exact URL plan checked by runtime verification')
    gate.add_argument("--pages", nargs="+")
    production = commands.add_parser("production-check", help="Explicit online check used only by -Publish")
    for name in ("baseline", "baseline-manifest", "output"):
        production.add_argument("--" + name, type=Path, required=True)
    production.add_argument("--production-ref", default="origin/main")
    production.add_argument("--build-report", type=Path)
    online = commands.add_parser("readback", help="Explicit online HTML and asset hash check; never restores")
    online.add_argument("--release", type=Path, required=True)
    online.add_argument("--output", type=Path, required=True)
    online.add_argument("--retry-report", type=Path, help="Recheck unresolved files while retaining the prior full-coverage results")
    wrap = commands.add_parser("wrap-baseline", help="Local exact rollback package using hybrid.assemble")
    for name in ("baseline", "baseline-manifest", "output"):
        wrap.add_argument("--" + name, type=Path, required=True)
    stage=commands.add_parser('stage-check',help='Check actual staged bytes using the completed pre-replacement evidence receipt')
    for name in ('release','build-report','preparation','output','expected-manifest'):
        stage.add_argument('--'+name,type=Path,required=True)
    stage.add_argument('--rollback-ref',required=True)
    args = parser.parse_args(argv)
    if args.command == "wrap-baseline":
        manifest = hybrid.assemble(args.baseline, args.baseline, args.output, read(args.baseline_manifest), {})
        print(json.dumps({"status": "prepared", "release_id": manifest["release_id"]}))
        return 0
    result = {"prepare": prepare, "production-check": production_check, "readback": readback,'stage-check':stage_check}[args.command](args)
    print(json.dumps({"status": result["status"], "release_id": result.get("release_id"), "report": str(args.output),
                      "blockers": len(result.get("blockers", result.get("issues", [])))}, ensure_ascii=False))
    return 0 if result["status"] in {"ready", "pass"} else 3 if result["status"] == "unknown" else 2


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError, TypeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error))
