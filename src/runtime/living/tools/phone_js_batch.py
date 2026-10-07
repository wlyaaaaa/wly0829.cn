"""Capture real 412x915/DPR3.5/CPU4x 12-second page-error evidence per mapped page.

This is deliberately separate from check.py/performance_batch.py: it does not
run static checks, GPU matrices, watchdog injection, or recordings. Existing
website phone receipts are reusable only when their engine source and packaged
page config match the current source and dist config byte-for-byte.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from html.parser import HTMLParser
from functools import lru_cache
from datetime import datetime
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

import browser
import check
import common
import build_preview


ENGINE_SHA_REQUIRED = "339e0960decba7bbcf1b7eade3d893e40d1d379b059514dc289624666b0abc95"
PHONE_VIEWPORT = {"width": 412, "height": 915}
PHONE_DPR = 3.5
PHONE_CPU_RATE = 4
OBSERVE_SECONDS = 12.0
PAGE_ERROR_ROOTS = (common.GATE / "living-pipeline" / "website-support",
                    common.GATE / "living-pipeline" / "website-batch-05")
EXCLUDED_PAGES = {
    "steam-millennium-config-backup": "本人明确排除的Steam商标页；不造preview或bird。"
}
SITE_PROOF_MINIMUM_FIELDS = {"orientation", "viewport", "dpr", "cpu_rate",
                             "observed_seconds", "js_errors", "status"}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


@lru_cache(maxsize=1)
def current_engine_identity_hashes() -> dict[str, str]:
    source, _, source_sha = build_preview.engine_files("src")
    normalized = source.replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")
    return {
        "source_sha256": source_sha,
        "disk_source_sha256": sha256(common.SRC / "living.js"),
        "dom_sha256": hashlib.sha256(normalized).hexdigest(),
    }


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_json_atomic(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def preserve_prior_manifest(path: Path) -> dict[str, Any] | None:
    if not path.is_file():
        return None
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    archive = path.with_name(f"phone-js-manifest-pre-refresh-{digest[:16]}.json")
    if not archive.exists():
        archive.write_bytes(raw)
    if sha256(archive) != digest:
        raise RuntimeError(f"旧manifest快照SHA不符：{archive}")
    return {"path": archive.resolve().as_posix(), "sha256": digest, "bytes": len(raw)}


def _nested_live(case: dict[str, Any]) -> bool:
    """Require start and end live; the end state cannot be masked by start."""
    initial = case.get("initial")
    sustained = case.get("sustained")
    if isinstance(initial, dict):
        start_diag = initial.get("diagnostics")
        if not isinstance(start_diag, dict) or start_diag.get("phase") != "live":
            return False
    elif case.get("phase") != "live" and case.get("initial_phase") != "live":
        return False
    if isinstance(sustained, dict):
        end_diag = sustained.get("diagnostics")
        if not isinstance(end_diag, dict) or end_diag.get("phase") != "live":
            return False
        frames = end_diag.get("frames")
        if not isinstance(frames, (int, float)) or frames <= 0:
            return False
    elif case.get("phase") != "live":
        return False
    observed_frames = case.get("observed_frames")
    return isinstance(observed_frames, (int, float)) and observed_frames > 0


def _nested_trigger_clear(case: dict[str, Any]) -> bool:
    found_guard = False
    for key in ("initial", "sustained"):
        node = case.get(key)
        if isinstance(node, dict):
            diag = node.get("diagnostics")
            if isinstance(diag, dict):
                guard = diag.get("frameGuard")
                if not isinstance(guard, dict) or "trigger" not in guard:
                    return False
                found_guard = True
                if guard["trigger"] is not None:
                    return False
    return found_guard


class _InlineScriptParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts: list[str] = []
        self._current: list[str] | None = None

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script":
            self._current = []

    def handle_data(self, data):
        if self._current is not None:
            self._current.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._current is not None:
            self.scripts.append("".join(self._current))
            self._current = None


def inspect_preview(path: Path) -> dict[str, Any]:
    """Verify the HTML declares and embeds the exact current engine source."""
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="replace")
    source_match = re.search(r'name="living-engine-source-sha256" content="([a-f0-9]{64})"', text)
    dom_match = re.search(r'name="living-engine-dom-sha256" content="([a-f0-9]{64})"', text)
    parser = _InlineScriptParser()
    parser.feed(text)
    inline = []
    for index, script in enumerate(parser.scripts):
        normalized = script.replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")
        inline.append({"index": index, "bytes": len(normalized), "sha256": hashlib.sha256(normalized).hexdigest()})
    source_sha = source_match.group(1) if source_match else None
    dom_sha = dom_match.group(1) if dom_match else None
    current = current_engine_identity_hashes()
    return {
        "html_sha256": hashlib.sha256(raw).hexdigest(),
        "html_bytes": len(raw),
        "engine_source_meta_sha256": source_sha,
        "engine_dom_meta_sha256": dom_sha,
        "engine_dom_meta_matches_inline_script": bool(dom_sha and any(row["sha256"] == dom_sha for row in inline)),
        "engine_source_meta_matches_current_source": source_sha == current["source_sha256"] == current["disk_source_sha256"],
        "engine_dom_meta_matches_current_source": dom_sha == current["dom_sha256"],
        "inline_scripts": inline,
        "current_engine_identity": (source_sha == ENGINE_SHA_REQUIRED == current["source_sha256"] == current["disk_source_sha256"] and
                                    dom_sha == current["dom_sha256"] and bool(dom_sha and any(row["sha256"] == dom_sha for row in inline))),
    }


def unique_page_owners(pairs) -> dict[str, str]:
    owners: dict[str, str] = {}
    for page, art in pairs:
        if page in owners:
            raise ValueError(f"同一page重复映射：{page}: {owners[page]} / {art}")
        owners[page] = art
    return owners


def validate_exact_page_coverage(target_pages, report_rows, expected_count: int) -> dict[str, Any]:
    target = list(target_pages)
    passed_rows = [row for row in report_rows if row.get("status") in ("passed", "reused")]
    result_names = [row.get("page") for row in passed_rows]
    target_set = set(target)
    result_set = set(result_names)
    manifest_unique = len(target) == len(target_set)
    result_unique = len(result_names) == len(result_set)
    return {
        "expected_count": expected_count,
        "manifest_target_row_count": len(target),
        "manifest_target_unique_count": len(target_set),
        "result_row_count": len(report_rows),
        "passed_or_reused_row_count": len(passed_rows),
        "passed_or_reused_unique_page_count": len(result_set),
        "manifest_target_pages_unique": manifest_unique,
        "passed_or_reused_rows_unique": result_unique,
        "exact_page_set_covered": manifest_unique and result_unique and result_set == target_set,
        "gate_passed": (len(target) == expected_count and len(passed_rows) == expected_count and
                        manifest_unique and result_unique and result_set == target_set),
    }


def _walk_phone_cases(value: Any, path: tuple[str, ...] = ()):
    if isinstance(value, dict):
        if SITE_PROOF_MINIMUM_FIELDS.issubset(value) and value.get("orientation") == "v":
            yield path, value
        for key, child in value.items():
            yield from _walk_phone_cases(child, path + (str(key),))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from _walk_phone_cases(child, path + (str(index),))


@lru_cache(maxsize=1)
def _site_phone_proof_index() -> dict[str, list[dict[str, Any]]]:
    """Read existing site receipts once; avoid rescanning reports per page."""
    index: dict[str, list[dict[str, Any]]] = {}
    for root in PAGE_ERROR_ROOTS:
        if not root.exists():
            continue
        for path in root.rglob("*.json"):
            low = str(path).lower()
            if "http-cache" in low or "node-compile-cache" in low:
                continue
            try:
                document = json.loads(path.read_text(encoding="utf-8-sig"))
            except (OSError, ValueError):
                continue
            if not isinstance(document, dict):
                continue
            engine = document.get("engine_binding")
            if not isinstance(engine, dict) or engine.get("source_sha256") != ENGINE_SHA_REQUIRED:
                continue
            for row_path, case in _walk_phone_cases(document):
                page = case.get("page")
                if not page:
                    continue
                config = (engine.get("configs") or {}).get(page)
                if not isinstance(config, dict):
                    continue
                if case.get("viewport") != PHONE_VIEWPORT or case.get("dpr") != PHONE_DPR:
                    continue
                if case.get("cpu_rate") != PHONE_CPU_RATE:
                    continue
                if not isinstance(case.get("observed_seconds"), (int, float)) or case["observed_seconds"] < OBSERVE_SECONDS:
                    continue
                if case.get("js_errors") != [] or case.get("status") != "pass":
                    continue
                if not _nested_live(case) or not _nested_trigger_clear(case):
                    continue
                index.setdefault(page, []).append({
                    "path": path.resolve().as_posix(),
                    "sha256": sha256(path),
                    "case_path": "/".join(row_path),
                    "observed_seconds": case["observed_seconds"],
                    "observed_frames": case.get("observed_frames"),
                    "fps": case.get("observed_fps"),
                    "phase": "live",
                    "js_errors": case["js_errors"],
                    "viewport_css_px": case["viewport"],
                    "device_scale_factor": case["dpr"],
                    "cpu_throttling_rate": case["cpu_rate"],
                    "source_sha256": engine["source_sha256"],
                    "config_sha256": config["sha256"],
                    "config_bytes": config.get("bytes"),
                    "proof_scope": document.get("scope", "website performance case"),
                    "document_finished_at": document.get("finished_at_beijing") or document.get("observed_at_beijing"),
                })
    for candidates in index.values():
        candidates.sort(key=lambda row: (row.get("document_finished_at") or "", row["path"], row["case_path"]))
    return index


def _site_phone_reuse(page: str, current_config_sha: str | None,
                      current_engine_sha: str) -> dict[str, Any] | None:
    """Find an actual website 12s phone receipt bound to current339 + config."""
    if not current_config_sha or current_engine_sha != ENGINE_SHA_REQUIRED:
        return None
    candidates = [row for row in _site_phone_proof_index().get(page, [])
                  if row.get("source_sha256") == current_engine_sha and row.get("config_sha256") == current_config_sha]
    if not candidates:
        return None
    # Prefer an explicitly dated run; ties are deterministic and duplicate
    # workspace copies collapse to the same proof content hash.
    selected = candidates[-1]
    selected["duplicate_candidate_count"] = len(candidates)
    return selected


def _binding(art: str, page: str, binding_orient: str, preview_orient: str) -> dict[str, Any]:
    art_dir = common.ART / art
    spec_path = art_dir / "spec.json"
    preview_path = art_dir / "preview" / f"{page}-{preview_orient}.html"
    source_path = common.source_path(art, preview_orient)
    current_fp = check.input_fingerprint(art, page, binding_orient)["sha256"]
    preview_identity = inspect_preview(preview_path) if preview_path.is_file() else None
    config_path = common.DIST / page / "config.json"
    static_path = art_dir / "check" / f"{page}-{binding_orient}-static.json"
    static = None
    if static_path.is_file():
        try:
            static_doc = json.loads(static_path.read_text(encoding="utf-8"))
            static = {
                "path": static_path.resolve().as_posix(),
                "sha256": sha256(static_path),
                "passed": static_doc.get("acceptance", {}).get("passed"),
                "input_fingerprint_sha256": static_doc.get("input_fingerprint", {}).get("sha256"),
            }
        except (OSError, ValueError):
            static = {"path": static_path.resolve().as_posix(), "read_error": True}
    return {
        "art": art,
        "page": page,
        "binding_orientation": binding_orient,
        "preview_orientation": preview_orient,
        "phone_profile_orientation": "v",
        "engine_source_sha256": sha256(common.SRC / "living.js"),
        "source_path": source_path.resolve().as_posix(),
        "source_sha256": sha256(source_path) if source_path.is_file() else None,
        "spec_path": spec_path.resolve().as_posix(),
        "spec_sha256": sha256(spec_path) if spec_path.is_file() else None,
        "preview_path": preview_path.resolve().as_posix(),
        "preview_sha256": preview_identity["html_sha256"] if preview_identity else None,
        "preview_engine_identity": preview_identity,
        "current_input_fingerprint_sha256": current_fp,
        "dist_config_path": config_path.resolve().as_posix(),
        "dist_config_sha256": sha256(config_path) if config_path.is_file() else None,
        "static_evidence": static,
    }


def build_manifest(date_tag: str) -> dict[str, Any]:
    current_engine_sha = sha256(common.SRC / "living.js")
    page_pairs = []
    for art, info in common.art_table().items():
        for page in info["pages"]:
            page_pairs.append((page, art))
    pages = unique_page_owners(page_pairs)
    jobs = []
    for page, art in sorted(pages.items()):
        if page in EXCLUDED_PAGES:
            continue
        v_measured = common.measured(page, "v")
        h_measured = common.measured(page, "h")
        if v_measured:
            preview_orient = "v"
            binding_orient = "v"
            route_reason = "同一page的h/v共享艺术配置；手机按真实page-v预览测一次。"
        elif page == "github-profile" and h_measured:
            preview_orient = "h"
            binding_orient = "h"
            route_reason = "合同只测量h；使用真实h预览，手机412x915/DPR3.5/mobile/touch/CPU4x不变。"
        else:
            jobs.append({
                "art": art, "page": page, "status": "missing",
                "reason": "无可用的已测量手机预览方向；不临时造page-v，也不改合同。",
                "measured_h": h_measured, "measured_v": v_measured,
            })
            continue
        binding = _binding(art, page, binding_orient, preview_orient)
        preview_path = Path(binding["preview_path"])
        if not preview_path.is_file() or not Path(binding["spec_path"]).is_file() or not Path(binding["source_path"]).is_file():
            jobs.append({
                **binding, "status": "missing",
                "reason": "当前真实preview/spec/source文件缺失；未生成替代预览。",
                "route_reason": route_reason,
            })
            continue
        if current_engine_sha != ENGINE_SHA_REQUIRED:
            jobs.append({
                **binding, "status": "missing",
                "reason": f"当前living.js SHA与本批指定的339不符：{current_engine_sha}",
                "route_reason": route_reason,
            })
            continue
        reuse = _site_phone_reuse(page, binding.get("dist_config_sha256"), current_engine_sha)
        if reuse:
            jobs.append({
                **binding, "status": "reused",
                "route_reason": route_reason,
                "reuse_basis": "实际网站12秒手机case满足viewport/DPR/CPU4x/live/0JS，engine source=339且当前页面dist config哈希完全一致。",
                "reuse_proof": reuse,
            })
        elif not (binding.get("preview_engine_identity") or {}).get("current_engine_identity"):
            jobs.append({
                **binding, "status": "rebuild_required",
                "route_reason": route_reason,
                "reuse_basis": None,
                "reason": "当前预览的source meta或DOM内联引擎哈希不绑定339；先保存原字节并用现役build_preview仅重建本页真实方向。",
            })
        else:
            jobs.append({
                **binding, "status": "queued",
                "route_reason": route_reason,
                "reuse_basis": None,
                "reason": "没有找到同时绑定当前339源码与当前页面config的合格12秒手机过程errors回执。",
            })
    return {
        "schema": "living-phone-js-batch-manifest.v3",
        "created_at_beijing": common.beijing_now(),
        "date_tag": date_tag,
        "phone_profile": {
            "viewport_css_px": PHONE_VIEWPORT,
            "device_scale_factor": PHONE_DPR,
            "mobile": True,
            "has_touch": True,
            "cpu_throttling_rate": PHONE_CPU_RATE,
            "minimum_observed_seconds": OBSERVE_SECONDS,
            "input_errors": ["window.onerror/pageerror", "console warning", "console error"],
            "artificial_watchdog_stall_injection": False,
            "gpu_matrix": False,
            "static_or_video_checks": False,
        },
        "engine_source_sha256": current_engine_sha,
        "scope_exclusions": [{"page": page, "reason": reason} for page, reason in EXCLUDED_PAGES.items()],
        "historical_phone_receipts_not_reused": [{
            "path": (common.ART / "skill-mojibake-doctor" / "work" / "phone-cpu4x-js.json").resolve().as_posix(),
            "sha256": sha256(common.ART / "skill-mojibake-doctor" / "work" / "phone-cpu4x-js.json")
                if (common.ART / "skill-mojibake-doctor" / "work" / "phone-cpu4x-js.json").is_file() else None,
            "reason": "虽有12秒/page_errors空的旧实测，但未绑定当时与当前的spec/preview哈希和current input fingerprint；本次按当前预览重测。",
        }],
        "summary": {
            "mapped_pages": len(pages),
            "target_pages": len(pages) - len(EXCLUDED_PAGES),
            "queued": sum(row.get("status") == "queued" for row in jobs),
            "rebuild_required": sum(row.get("status") == "rebuild_required" for row in jobs),
            "reused": sum(row.get("status") == "reused" for row in jobs),
            "missing": sum(row.get("status") == "missing" for row in jobs),
        },
        "jobs": jobs,
    }


def rebuild_stale_previews(manifest: dict[str, Any]) -> dict[str, Any]:
    """Snapshot and rebuild only phone previews whose embedded engine is stale."""
    archive_dir = common.ENGINE / "work" / "performance-coordination" / "phone-js-prior-previews"
    receipts = []
    for job in manifest["jobs"]:
        if job.get("status") != "rebuild_required":
            continue
        page = job["page"]
        art = job["art"]
        orient = job["preview_orientation"]
        prior_path = Path(job["preview_path"])
        if not prior_path.is_file():
            job["status"] = "missing"
            job["reason"] = "准备重建前预览文件消失；未创建替代页面。"
            continue
        prior_bytes = prior_path.read_bytes()
        prior_sha = hashlib.sha256(prior_bytes).hexdigest()
        if prior_sha != job.get("preview_sha256"):
            job["status"] = "stale_manifest"
            job["reason"] = "预览在清单生成后已变化；本轮不快照/不覆盖。"
            continue
        archived = archive_dir / f"{art}--{page}--{orient}--{prior_sha[:16]}.html"
        archive_dir.mkdir(parents=True, exist_ok=True)
        if not archived.exists():
            archived.write_bytes(prior_bytes)
        if sha256(archived) != prior_sha:
            raise RuntimeError(f"原预览字节归档SHA不符：{archived}")
        source_fp_before = check.input_fingerprint(art, page, job["binding_orientation"])["sha256"]
        source_sha_before = sha256(common.SRC / "living.js")
        spec_sha_before = sha256(common.ART / art / "spec.json")
        if source_fp_before != job["current_input_fingerprint_sha256"] or source_sha_before != ENGINE_SHA_REQUIRED:
            job["status"] = "stale_manifest"
            job["reason"] = "预览重建前当前输入或living.js已变化，拒绝覆盖。"
            continue
        with browser.build_lock(art):
            outputs = build_preview.build(art, page, (orient,), engine="src")
        refreshed = _binding(art, page, job["binding_orientation"], orient)
        source_fp_after = check.input_fingerprint(art, page, job["binding_orientation"])["sha256"]
        identity = refreshed.get("preview_engine_identity") or {}
        refresh_receipt = {
            "at_beijing": common.beijing_now(),
            "builder": "tools/build_preview.py build(engine='src')",
            "output_paths": [Path(p).resolve().as_posix() for p in outputs],
            "prior_preview_archive": {"path": archived.resolve().as_posix(), "sha256": prior_sha, "bytes": len(prior_bytes)},
            "new_preview_sha256": refreshed.get("preview_sha256"),
            "new_engine_meta_sha256": identity.get("engine_source_meta_sha256"),
            "new_inline_dom_sha_matches": identity.get("engine_dom_meta_matches_inline_script"),
            "current_input_fingerprint_before": source_fp_before,
            "current_input_fingerprint_after": source_fp_after,
            "spec_sha256_before": spec_sha_before,
            "spec_sha256_after": sha256(common.ART / art / "spec.json"),
            "engine_source_sha256_before": source_sha_before,
            "engine_source_sha256_after": sha256(common.SRC / "living.js"),
        }
        job.update(refreshed)
        job["preview_rebuild"] = refresh_receipt
        if (source_fp_after == source_fp_before and
                refresh_receipt["spec_sha256_after"] == spec_sha_before and
                refresh_receipt["engine_source_sha256_after"] == ENGINE_SHA_REQUIRED and
                identity.get("current_engine_identity")):
            job["status"] = "queued"
            job["reason"] = "旧预览原字节已归档；当前官方构建产生的source meta=339且DOM内联代码哈希匹配。"
        else:
            job["status"] = "missing"
            job["reason"] = "重建后engine identity或输入稳定性核验失败；不进入手机观测。"
        receipts.append({"page": page, **refresh_receipt, "status": job["status"]})
        print(f"preview refresh {page}: {job['status']} old={prior_sha[:12]} new={str(refreshed.get('preview_sha256'))[:12]}", flush=True)
    manifest["preview_refreshes"] = receipts
    manifest["preview_refreshed_at_beijing"] = common.beijing_now()
    manifest["summary"].update({
        "queued": sum(row.get("status") == "queued" for row in manifest["jobs"]),
        "rebuild_required": sum(row.get("status") == "rebuild_required" for row in manifest["jobs"]),
        "reused": sum(row.get("status") == "reused" for row in manifest["jobs"]),
        "missing": sum(row.get("status") in ("missing", "stale_manifest") for row in manifest["jobs"]),
    })
    return manifest


def link_interrupted_attempts(manifest: dict[str, Any], path: Path) -> dict[str, Any]:
    if not path.is_file():
        return manifest
    interrupted = json.loads(path.read_text(encoding="utf-8"))
    rows = {row.get("page"): row for row in interrupted.get("completed_console_rows", [])}
    incomplete = interrupted.get("incomplete_page")
    if isinstance(incomplete, dict) and incomplete.get("page"):
        rows[incomplete["page"]] = incomplete
    for job in manifest["jobs"]:
        prior = rows.get(job.get("page"))
        if not prior:
            continue
        job["prior_interrupted_attempt"] = {
            "path": path.resolve().as_posix(),
            "sha256": sha256(path),
            "script_console_status": prior.get("script_console_status", prior.get("status")),
            "script_console_observed_seconds": prior.get("script_console_observed_seconds"),
            "script_console_fps": prior.get("script_console_fps"),
            "script_console_page_error_count": prior.get("script_console_page_error_count"),
            "current339_html_identity": prior.get("current339_html_identity"),
            "raw_page_error_array_saved": prior.get("raw_page_error_array_saved", False),
            "counted_as_final_phone_js_coverage": False,
        }
        if prior.get("current339_html_identity") and prior.get("script_console_status") == "passed":
            job["prior_interrupted_attempt"]["retest_reason"] = "原runner在最终聚合写入前被中断；没有完整几何/context/原始错误数组逐页回执。仅此4页定向重补，不把stdout或缺失字段补造成正式receipt。"
        elif prior.get("current339_html_identity") is False:
            job["prior_interrupted_attempt"]["retest_reason"] = "该12秒stdout来自实际旧引擎preview，保留为旧scope历史；现役339预览重建后重新测。"
        else:
            job["prior_interrupted_attempt"]["retest_reason"] = "中断前没有完整12秒结果，按manifest正常补测。"
    return manifest


def _diag(pg) -> dict[str, Any] | None:
    try:
        return pg.evaluate("""() => {
          if (!window.living || typeof living.diagnostics !== 'function') return null;
          const d = living.diagnostics();
          const part = document.querySelector('.typeset-part:not([hidden])');
          const layer = document.querySelector('.living-layer');
          const canvas = layer && layer.querySelector('canvas');
          const rect = e => { if (!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,right:r.right,bottom:r.bottom,left:r.left}; };
          const cfg = window.LIVING_CONFIG || {};
          const o = d.orient || (part && part.dataset.orientation) || null;
          const box = cfg[o] && cfg[o].box;
          return {
            at_performance_now_ms: performance.now(),
            diagnostics: d,
            actual_orientation: o,
            viewport: {innerWidth,innerHeight,devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
            max_touch_points: navigator.maxTouchPoints,
            mobile_media_matches: matchMedia('(pointer: coarse)').matches,
            viewport_meta: document.querySelector('meta[name="viewport"]')?.content || null,
            visual_viewport: window.visualViewport ? {width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,offsetLeft:visualViewport.offsetLeft,offsetTop:visualViewport.offsetTop} : null,
            part_rect_css_px: rect(part),
            config_box_ratio: box || null,
            living_layer_rect_css_px: rect(layer),
            canvas: canvas ? {width:canvas.width,height:canvas.height,rect_css_px:rect(canvas),visibility:getComputedStyle(canvas).visibility} : null,
            living_layer_count: document.querySelectorAll('.living-layer').length,
            bird_count: document.querySelectorAll('.living-layer .bird').length
          };
        }""")
    except Exception as exc:
        return {"diagnostics_read_error": str(exc)}


def _page_engine_identity(pg) -> dict[str, Any]:
    """Read the loaded DOM meta and hash every inline script from the page."""
    try:
        identity = pg.evaluate("""async () => {
          const meta = name => document.querySelector(`meta[name="${name}"]`)?.content || null;
          const scripts = Array.from(document.scripts).map(s => s.textContent || '');
          if (!crypto.subtle || !window.TextEncoder) return {
            source_sha256: meta('living-engine-source-sha256'),
            dom_sha256: meta('living-engine-dom-sha256'),
            inline_script_sha256: null,
            crypto_available: false
          };
          const hashes = await Promise.all(scripts.map(async (source, index) => {
            const normalized = source.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n');
            const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
            const sha = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
            return {index, bytes: new TextEncoder().encode(normalized).length, sha256: sha};
          }));
          return {
            source_sha256: meta('living-engine-source-sha256'),
            dom_sha256: meta('living-engine-dom-sha256'),
            inline_script_sha256: hashes,
            dom_matches_inline: hashes.some(h => h.sha256 === meta('living-engine-dom-sha256')),
            crypto_available: true,
            is_secure_context: isSecureContext
          };
        }""")
        return identity
    except Exception as exc:
        return {"read_error": f"{type(exc).__name__}: {exc}", "crypto_available": False}


def _context_profile(pg) -> dict[str, Any]:
    context = getattr(pg, "context", None)
    impl = getattr(context, "_impl_obj", None)
    options = getattr(impl, "_options", None)
    if not isinstance(options, dict):
        return {"context_options_read": False}
    return {
        "context_options_read": True,
        "viewport_css_px": options.get("viewport"),
        "device_scale_factor": options.get("deviceScaleFactor"),
        "mobile": options.get("isMobile"),
        "has_touch": options.get("hasTouch"),
    }


def run_one(br, job: dict[str, Any]) -> dict[str, Any]:
    result = {
        "art": job["art"], "page": job["page"], "preview_orientation": job["preview_orientation"],
        "phone_profile_orientation": "v", "status": "failed", "started_at_beijing": common.beijing_now(),
        "binding_before": _binding(job["art"], job["page"], job["binding_orientation"], job["preview_orientation"]),
        "artificial_watchdog_stall_injection": False,
    }
    if result["binding_before"]["current_input_fingerprint_sha256"] != job["current_input_fingerprint_sha256"]:
        result["status"] = "stale_manifest"
        result["reason"] = "当前输入指纹在manifest生成后发生变化，拒绝把旧清单用于新输入。"
        return result
    if result["binding_before"].get("preview_sha256") != job.get("preview_sha256"):
        result["status"] = "stale_manifest"
        result["reason"] = "preview HTML字节哈希在manifest生成后已变化。"
        return result
    before_identity = result["binding_before"].get("preview_engine_identity") or {}
    if not before_identity.get("current_engine_identity"):
        result["status"] = "stale_preview_engine"
        result["reason"] = "运行前HTML source meta或DOM内联脚本SHA没有绑定当前339。"
        return result
    path = Path(result["binding_before"]["preview_path"])
    pg = None
    navigation_started = time.monotonic()
    try:
        # browser.open_preview wires pg._errs before goto and establishes CPU4x
        # before page initialization; its v context includes mobile + touch.
        pg = browser.open_preview(br, path, "v", extra={"cpu_rate": PHONE_CPU_RATE})
        navigation_completed = time.monotonic()
        ready = browser.wait_ready(pg)
        errors_at_live = getattr(pg, "_errs", None)
        if not isinstance(errors_at_live, list):
            raise RuntimeError("browser.open_preview未提供从goto前开始收集的pg._errs数组")
        loaded_errors = list(errors_at_live)
        engine_identity_start = _page_engine_identity(pg)
        context_profile = _context_profile(pg)
        start = _diag(pg)
        if not isinstance(start, dict) or "diagnostics" not in start:
            raise RuntimeError("预览已导航但无法读取window.living diagnostics")
        start_diag = start["diagnostics"]
        start_frames = start_diag.get("frames")
        if not isinstance(start_frames, (int, float)):
            raise RuntimeError("live预览诊断没有frames计数")
        start_runtime_errors = start_diag.get("errors")
        if not isinstance(start_runtime_errors, list):
            raise RuntimeError("起始living.diagnostics.errors缺失或不是数组")
        start_guard = start_diag.get("frameGuard")
        if not isinstance(start_guard, dict) or "trigger" not in start_guard:
            raise RuntimeError("起始frameGuard.trigger字段缺失")
        observed_start = time.monotonic()
        start_perf = pg.evaluate("() => performance.now()")
        target_end = observed_start + OBSERVE_SECONDS + 0.05
        while time.monotonic() < target_end:
            time.sleep(min(0.25, max(0.01, target_end - time.monotonic())))
        end = _diag(pg)
        observed_end = time.monotonic()
        end_perf = pg.evaluate("() => performance.now()")
        errors_all_raw = getattr(pg, "_errs", None)
        if not isinstance(errors_all_raw, list):
            raise RuntimeError("12秒结束时pg._errs缺失或不是数组")
        errors_all = list(errors_all_raw)
        final_diag = end.get("diagnostics") if isinstance(end, dict) else None
        engine_identity_end = _page_engine_identity(pg)
        elapsed = observed_end - observed_start
        frames_end = final_diag.get("frames") if isinstance(final_diag, dict) else None
        frames_observed = frames_end - start_frames if isinstance(frames_end, (int, float)) else None
        fps = round(frames_observed / elapsed, 2) if frames_observed is not None and elapsed > 0 else None
        trigger_start = start_guard.get("trigger")
        end_guard = final_diag.get("frameGuard") if isinstance(final_diag, dict) else None
        trigger_end = end_guard.get("trigger") if isinstance(end_guard, dict) and "trigger" in end_guard else "missing"
        runtime_errors_start = start_runtime_errors
        runtime_errors_end = final_diag.get("errors") if isinstance(final_diag, dict) else None
        page_errors_after_live = errors_all[len(loaded_errors):] if errors_all[:len(loaded_errors)] == loaded_errors else errors_all
        after = _binding(job["art"], job["page"], job["binding_orientation"], job["preview_orientation"])
        viewport_options = context_profile.get("viewport_css_px") or {}
        geom_start_vp = start.get("viewport") or {}
        geom_end_vp = end.get("viewport") or {}
        expected_engine = current_engine_identity_hashes()
        config_before = result["binding_before"].get("dist_config_sha256")
        config_after = after.get("dist_config_sha256")
        config_path = Path(after.get("dist_config_path") or "")
        current_config_sha = sha256(config_path) if config_path.is_file() else None
        profile_checks = {
            "context_options_read": context_profile.get("context_options_read") is True,
            "context_viewport_412x915": viewport_options == PHONE_VIEWPORT,
            "context_dpr_3_5": context_profile.get("device_scale_factor") == PHONE_DPR,
            "context_mobile_true": context_profile.get("mobile") is True,
            "context_has_touch_true": context_profile.get("has_touch") is True,
            "cpu4x_cdp_session_and_pre_goto_route": bool(getattr(pg, "_cdp", None)) and PHONE_CPU_RATE == 4,
            "actual_start_viewport_412x915": geom_start_vp.get("innerWidth") == 412 and geom_start_vp.get("innerHeight") == 915,
            "actual_end_viewport_412x915": geom_end_vp.get("innerWidth") == 412 and geom_end_vp.get("innerHeight") == 915,
            "actual_start_dpr_3_5": geom_start_vp.get("devicePixelRatio") == PHONE_DPR,
            "actual_end_dpr_3_5": geom_end_vp.get("devicePixelRatio") == PHONE_DPR,
            "touch_reported_by_dom": (start.get("max_touch_points", 0) > 0 and end.get("max_touch_points", 0) > 0),
            "actual_start_orientation": start.get("actual_orientation") == job["preview_orientation"],
            "actual_end_orientation": end.get("actual_orientation") == job["preview_orientation"],
            "loaded_engine_source_sha_339": engine_identity_start.get("source_sha256") == ENGINE_SHA_REQUIRED,
            "loaded_engine_dom_matches_inline": engine_identity_start.get("crypto_available") is True and engine_identity_start.get("dom_matches_inline") is True,
            "loaded_engine_dom_matches_current_build_preview_source": (engine_identity_start.get("source_sha256") == expected_engine["source_sha256"] == expected_engine["disk_source_sha256"] and
                                                                      engine_identity_start.get("dom_sha256") == expected_engine["dom_sha256"]),
            "loaded_engine_identity_stable": (engine_identity_end.get("source_sha256") == engine_identity_start.get("source_sha256") == expected_engine["source_sha256"] and
                                               engine_identity_end.get("dom_sha256") == engine_identity_start.get("dom_sha256") == expected_engine["dom_sha256"] and
                                               engine_identity_end.get("dom_matches_inline") is True),
            "manifest_before_after_dist_config_nonnull_same_current_bytes": bool(config_before and config_after and
                config_before == config_after == job.get("dist_config_sha256") == current_config_sha),
        }
        if not isinstance(runtime_errors_end, list):
            profile_checks["engine_errors_arrays_empty"] = False
        else:
            profile_checks["engine_errors_arrays_empty"] = not runtime_errors_start and not runtime_errors_end
        if frames_observed is None or not isinstance(frames_observed, (int, float)):
            profile_checks["positive_observed_frames"] = False
        else:
            profile_checks["positive_observed_frames"] = frames_observed > 0
        profile_checks["complete_page_error_array_empty"] = len(errors_all) == 0
        profile_checks["single_and_sustained_guard_untriggered"] = trigger_start is None and trigger_end is None
        profile_checks["at_least_12_seconds"] = elapsed >= OBSERVE_SECONDS
        profile_checks["live_at_both_ends"] = start_diag.get("phase") == "live" and isinstance(final_diag, dict) and final_diag.get("phase") == "live"
        profile_checks["input_fingerprint_stable"] = after["current_input_fingerprint_sha256"] == result["binding_before"]["current_input_fingerprint_sha256"]
        profile_checks["preview_byte_hash_stable"] = after["preview_sha256"] == result["binding_before"]["preview_sha256"]
        passed = all(profile_checks.values())
        result.update({
            "status": "passed" if passed else "failed",
            "reason": None if passed else "实际手机profile、引擎身份、12秒观察/live、正帧、无JS错误、frameGuard状态或输入稳定性至少一项未满足；保留实测不报通过。",
            "profile": {**context_profile, "cdp_cpu_throttling_rate": PHONE_CPU_RATE,
                        "cdp_cpu_throttle_setup_before_goto": bool(getattr(pg, "_cdp", None))},
            "profile_checks": profile_checks,
            "loaded_engine_identity_at_start": engine_identity_start,
            "loaded_engine_identity_after_12s": engine_identity_end,
            "navigation_seconds": round(navigation_completed - navigation_started, 4),
            "ready_state": ready,
            "phase_at_observation_start": start_diag.get("phase"),
            "phase_after_observation": final_diag.get("phase"),
            "observed_seconds": round(elapsed, 4),
            "performance_now_elapsed_ms": round(end_perf - start_perf, 2),
            "frames_at_start": start_frames,
            "frames_at_end": frames_end,
            "observed_frames": frames_observed,
            "fps": fps,
            "frame_guard_trigger_at_start": trigger_start,
            "frame_guard_trigger_after_12s": trigger_end,
            "artificial_watchdog_stall_injection": False,
            "page_errors_from_navigation_to_end": errors_all,
            "page_errors_before_observation": loaded_errors,
            "page_errors_during_observation": page_errors_after_live,
            "engine_errors_at_start": runtime_errors_start,
            "engine_errors_after_12s": runtime_errors_end,
            "geometry_at_start": start,
            "geometry_after_12s": end,
            "input_binding_stable": after["current_input_fingerprint_sha256"] == result["binding_before"]["current_input_fingerprint_sha256"],
            "preview_stable": after["preview_sha256"] == result["binding_before"]["preview_sha256"],
            "binding_after": after,
            "closed_context": False,
        })
    except Exception as exc:
        result["status"] = "failed"
        result["reason"] = f"手机12秒实测未能完成：{type(exc).__name__}: {exc}"
        if pg is not None:
            raw_errors = getattr(pg, "_errs", None)
            result["page_errors_from_navigation_to_failure"] = list(raw_errors) if isinstance(raw_errors, list) else None
            result["diagnostics_at_failure"] = _diag(pg)
    finally:
        if pg is not None:
            try:
                pg.context.close()
                result["closed_context"] = True
            except Exception as exc:
                result["closed_context_error"] = str(exc)
    result["finished_at_beijing"] = common.beijing_now()
    return result


def execute(manifest: dict[str, Any]) -> dict[str, Any]:
    results = []
    date_tag = manifest.get("date_tag", datetime.now().strftime("%Y%m%d"))
    row_dir = common.ENGINE / "work" / "performance-coordination" / f"phone-js-rows-{date_tag}"
    row_dir.mkdir(parents=True, exist_ok=True)
    manifest_sha = manifest.get("manifest_sha256")

    def persist_row(row: dict[str, Any]) -> str:
        safe_page = re.sub(r"[^A-Za-z0-9._-]+", "_", str(row.get("page", "unknown")))
        prior = sorted(row_dir.glob(f"{safe_page}--*.json"))
        index = len(prior) + 1
        path = row_dir / f"{safe_page}--{index:02d}.json"
        payload = {**row, "receipt_path": path.resolve().as_posix(),
                   "manifest_path": manifest.get("manifest_path"), "manifest_sha256": manifest_sha}
        write_json_atomic(path, payload)
        return path.resolve().as_posix()

    for job in manifest["jobs"]:
        if job.get("status") == "reused":
            item = {**job, "status": "reused", "saved_at_beijing": common.beijing_now()}
            item["receipt_path"] = persist_row(item)
            results.append(item)
    candidate_jobs = [job for job in manifest["jobs"] if job.get("status") == "queued"]
    run_jobs = []
    resources = None
    browser_close_error = None
    current_engine_sha = sha256(common.SRC / "living.js")
    for job in candidate_jobs:
        pre = _binding(job["art"], job["page"], job["binding_orientation"], job["preview_orientation"])
        if current_engine_sha != manifest["engine_source_sha256"]:
            failure = {"art": job["art"], "page": job["page"], "status": "stale_manifest",
                       "reason": "启动时living.js输入与manifest不同。"}
        elif pre["current_input_fingerprint_sha256"] != job.get("current_input_fingerprint_sha256"):
            failure = {"art": job["art"], "page": job["page"], "status": "stale_manifest",
                       "reason": "启动时当前输入指纹与manifest不同。", "binding_at_preflight": pre}
        elif pre.get("preview_sha256") != job.get("preview_sha256") or not (pre.get("preview_engine_identity") or {}).get("current_engine_identity"):
            failure = {"art": job["art"], "page": job["page"], "status": "stale_preview_engine",
                       "reason": "启动前当前HTML字节或engine meta/inline DOM SHA不匹配339。", "binding_at_preflight": pre}
        else:
            run_jobs.append(job)
            continue
        failure["receipt_path"] = persist_row(failure)
        results.append(failure)
    if run_jobs:
        with sync_playwright() as pw:
            managed = browser.managed(pw, scope="performance")
            br = None
            try:
                with managed as owned:
                    br = owned
                    for index, job in enumerate(run_jobs, 1):
                        print(f"[{index}/{len(run_jobs)}] phone-js {job['page']} using preview-{job['preview_orientation']}", flush=True)
                        item = run_one(owned, job)
                        item["receipt_path"] = persist_row(item)
                        results.append(item)
                        print(f"  {item['status']} {item.get('observed_seconds')}s {item.get('fps')}fps errors={len(item.get('page_errors_from_navigation_to_end', []))}", flush=True)
                        if item["status"] == "stale_manifest" or item.get("input_binding_stable") is False:
                            print("发现输入漂移，停止后续页，避免错绑；尚未运行的页面保留missing状态。", flush=True)
                            break
            except Exception as exc:
                browser_close_error = f"{type(exc).__name__}: {exc}"
                if br is not None:
                    try:
                        br._living_cleanup()
                    except Exception as cleanup_exc:
                        browser_close_error += f"; cleanup {type(cleanup_exc).__name__}: {cleanup_exc}"
            finally:
                if br is not None:
                    try:
                        resources = br._living_resource_state()
                    except Exception as exc:
                        resources = {"read_error": str(exc)}
    return {
        "schema": "living-phone-js-batch-report.v1",
        "started_at_beijing": manifest.get("created_at_beijing"),
        "finished_at_beijing": common.beijing_now(),
        "scope": "one-Chrome-browser.managed-performance-exclusive",
        "engine_source_sha256": sha256(common.SRC / "living.js"),
        "manifest_sha256": None,
        "browser_close_error": browser_close_error,
        "resources": resources,
        "queued_count": len(candidate_jobs),
        "run_count": len(run_jobs),
        "per_page_rows_dir": row_dir.resolve().as_posix(),
        "results": results,
        "summary": {
            "passed": sum(row.get("status") == "passed" for row in results),
            "failed": sum(row.get("status") == "failed" for row in results),
            "stale_manifest": sum(row.get("status") == "stale_manifest" for row in results),
            "stale_preview_engine": sum(row.get("status") == "stale_preview_engine" for row in results),
            "reused": sum(row.get("status") == "reused" for row in results),
            "not_run_due_to_input_drift": max(0, len(run_jobs) - len(results)),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date-tag", default=datetime.now().strftime("%Y%m%d"))
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--plan-only", action="store_true", help="只写清单，不打开Chrome")
    parser.add_argument("--rebuild-stale-previews", action="store_true",
                        help="只归档并用现役build_preview重建标记为旧引擎的真实手机预览，不启动Chrome")
    args = parser.parse_args()
    out = common.ENGINE / "work" / "performance-coordination"
    manifest_path = args.manifest or out / f"phone-js-manifest-{args.date_tag}.json"
    report_path = args.report or out / f"phone-js-report-{args.date_tag}.json"
    if args.plan_only or args.rebuild_stale_previews:
        prior_manifest = preserve_prior_manifest(manifest_path)
        manifest = build_manifest(args.date_tag)
        manifest["manifest_path"] = manifest_path.resolve().as_posix()
        manifest["prior_manifest_snapshot"] = prior_manifest
        interrupted = out / f"phone-js-interrupted-preview-preflight-{args.date_tag}.json"
        if interrupted.is_file():
            manifest["prior_interrupted_run"] = {
                "path": interrupted.resolve().as_posix(),
                "sha256": sha256(interrupted),
                "scope": "historical_attempt_only_not_current_coverage",
            }
            manifest = link_interrupted_attempts(manifest, interrupted)
        if args.rebuild_stale_previews:
            manifest = rebuild_stale_previews(manifest)
        write_json_atomic(manifest_path, manifest)
    elif manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if manifest.get("schema") != "living-phone-js-batch-manifest.v3":
            raise SystemExit("现有manifest没有预览引擎身份字段；先运行--plan-only核现场输入，再--rebuild-stale-previews。")
    else:
        manifest = build_manifest(args.date_tag)
        manifest["manifest_path"] = manifest_path.resolve().as_posix()
        write_json_atomic(manifest_path, manifest)
    print(f"manifest: {manifest_path}")
    print("plan:", json.dumps(manifest["summary"], ensure_ascii=False))
    if args.plan_only or args.rebuild_stale_previews:
        return 0
    manifest["manifest_path"] = manifest_path.resolve().as_posix()
    manifest["manifest_sha256"] = sha256(manifest_path)
    runner_sha_start = sha256(Path(__file__))
    report = execute(manifest)
    runner_sha_finish = sha256(Path(__file__))
    report["manifest_path"] = manifest_path.resolve().as_posix()
    report["manifest_sha256"] = manifest["manifest_sha256"]
    report["runner_tool_sha256_at_start"] = runner_sha_start
    report["runner_tool_sha256_at_finish"] = runner_sha_finish
    covered = {row.get("page") for row in report["results"] if row.get("status") in ("passed", "reused")}
    target_pages = [row.get("page") for row in manifest["jobs"] if row.get("page")]
    coverage_structure = validate_exact_page_coverage(target_pages, report["results"], manifest["summary"]["target_pages"])
    report["coverage"] = {
        "mapped_pages": manifest["summary"]["mapped_pages"],
        "target_pages_excluding_explicit_scope": manifest["summary"]["target_pages"],
        "covered_pages": len(covered),
        "target_page_name_count": len(set(target_pages)),
        "coverage_structure": coverage_structure,
        "covered_page_names_unique": len(covered) == sum(row.get("status") in ("passed", "reused") for row in report["results"]),
        "exact_target_page_set_covered": covered == set(target_pages),
        "scope_exclusions": manifest.get("scope_exclusions", []),
        "missing_or_not_passed_pages": [
            {"page": row.get("page"), "status": row.get("status"), "reason": row.get("reason")}
            for row in manifest["jobs"] if row.get("page") not in covered
        ],
    }
    report["resources_verified"] = bool(
        report.get("resources") and report["resources"].get("http_closed") and
        report["resources"].get("mutex_release_succeeded") and
        report["resources"].get("gpu_scope", {}).get("released")
    )
    report["closeout_checks"] = {
        "exact_unique_82_page_scope": len(target_pages) == 82 and coverage_structure["gate_passed"],
        "all_targets_passed_or_bound_reuse": not report["coverage"]["missing_or_not_passed_pages"],
        "resources_verified": report["resources_verified"],
        "browser_close_error_absent": report["browser_close_error"] is None,
        "runner_file_unchanged_during_run": runner_sha_start == runner_sha_finish,
    }
    write_json_atomic(report_path, report)
    print(f"report: {report_path}")
    print("summary:", json.dumps(report["summary"], ensure_ascii=False))
    print("resources:", json.dumps(report.get("resources"), ensure_ascii=False))
    return 0 if (report["summary"]["failed"] == 0 and report["summary"]["stale_manifest"] == 0 and
                 report["summary"].get("stale_preview_engine", 0) == 0 and
                 all(report["closeout_checks"].values())) else 2


if __name__ == "__main__":
    raise SystemExit(main())
