"""Check the published rules version and rehearse or publish only rules pages."""
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from tempfile import TemporaryDirectory
from urllib.request import Request, urlopen

RELEASES = Path("E:/.agents/releases")
ORIGIN = "https://wly0829.cn/"
CONTROL_FILES = {"release-identity.json", "release-manifest.json", "sitemap.xml"}
PRIVATE_OWNER_PAGES = Path("E:/Data/RemoteComputerMCP/state/owner-rule-pages")


def read(path):
    return json.loads(path.read_text("utf-8-sig"))


def public(url):
    with urlopen(Request(url, headers={"Cache-Control": "no-cache"}), timeout=30) as response:
        return response.read()


def version(html):
    return re.search(rb'data-rule-release="(E\d+)"', html)[1].decode("ascii")


def rule_page(path):
    return path.startswith("rules/") and path.endswith(".html")


def stage_live_project_settings(worktree, pcconfig):
    registry = read(pcconfig / 'registries/dashboard_sources.json')
    sources = registry['project_sources']['wlyaaaaa/wly0829.cn']['sources']
    paths = {audience: sources[f'website.{audience}']['path'] for audience in ('public', 'owner')}
    config = worktree / '.publish/private/live-project.json'
    config.parent.mkdir(parents=True, exist_ok=True)
    config.write_text(json.dumps(paths, ensure_ascii=False), 'utf-8')


def run(args, cwd, *, env=None, output=None, capture=False):
    return subprocess.run([str(arg) for arg in args], cwd=cwd, env=env, check=True, text=True,
                          encoding="utf-8", errors="replace", stdout=subprocess.PIPE if capture else output,
                          stderr=output, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0)).stdout


def update(args, result, log):
    active = args.rules_release or read(RELEASES / "current-rules.json")["current"]["release_id"]
    online = version(public(ORIGIN + "rules/"))
    result.update(active=active, online=online)
    if online == active:
        return "unchanged", "规则没变，没发"
    if not (args.publish or args.rehearse):
        return "publication_off", "规则有变化，自动发布尚未开启"

    def command(*cmd, cwd=args.repo, env=None, capture=False):
        log.write("+ " + subprocess.list2cmdline([str(arg) for arg in cmd]) + "\n")
        return run(cmd, cwd, env=env, output=log, capture=capture)

    python_exe = sys.executable.replace("pythonw.exe", "python.exe")

    def python(path, *options):
        command(python_exe, "-B", "-X", "utf8", path, *options, cwd=worktree, env=env)

    def lock(mode):
        command("pwsh", "-NoProfile", "-File", "E:/.agents/tools/Invoke-ShortLock.ps1", "-Mode", mode,
                "-Name", "wly0829-publication", "-Holder", holder, "-Minutes", "30", "-Json")

    shared = Path(command("git", "rev-parse", "--path-format=absolute", "--git-common-dir", capture=True).strip())
    pointer = shared / "wly-oss/published.json"
    saved = read(pointer)
    prior = saved["manifest"]
    if json.loads(public(ORIGIN + "release-identity.json"))["release_id"] != prior["release_id"]:
        raise ValueError("公网版本与本机成功发布记录不一致")
    source = saved["source_commit"]
    result["source_commit"] = source
    holder = f"rules-daily:{os.getpid()}"
    with TemporaryDirectory(prefix="run-", dir=args.state) as folder:
        scratch = Path(folder)
        worktree, dist = scratch / "src", scratch / "dist"
        previous = scratch / "previous.json"
        previous.write_text(json.dumps(prior, ensure_ascii=False), "utf-8")
        pcconfig = args.pcconfig.resolve()
        exporter = pcconfig / "tools/remote-computer-mcp/export_public_fallback.py"
        fallback = scratch / "fallback.json"
        env = dict(os.environ, WLY_RULES_RELEASE=active, WLY_LIVE_PCCONFIG_ROOT=str(pcconfig),
                   WLY_OWNER_RULES_OUT=str(PRIVATE_OWNER_PAGES if args.publish else scratch / "owner"),
                   WLY_LIVE_FALLBACK_CMD=f'copy /b /y "{fallback}" "{{out}}"')
        env.pop("WLY_RULES_SIGNED_PAGES", None)
        command(python_exe, "-B", "-X", "utf8", exporter, "--strict", "--out", fallback, env=env)
        command("git", "worktree", "add", "--detach", worktree, source)
        try:
            python(args.prepare, "prepare", "--worktree", worktree)
            python("scripts/build-site.py", "--dist", dist)
            if version((dist / "rules/index.html").read_bytes()) != active:
                raise ValueError("规则成品版本与本轮检查不一致")
            manifest = dist / "release-manifest.json"
            built = read(manifest)
            pages = {path: row for path, row in built["files"].items() if rule_page(path)}
            routes = ["/" + (path[:-10] if path.endswith("/index.html") else path) for path in sorted(pages)]
            batch = scratch / "batch.json"
            batch.write_text(json.dumps(dict(run_id=holder, batch_id=holder, source_commit=source,
                release_id=built["release_id"], manifest_sha256=hashlib.sha256(manifest.read_bytes()).hexdigest(),
                allowed_routes=routes, pages={route: dict(route=route, merged_commit=source) for route in routes})), "utf-8")
            scan, dry = scratch / "scan", scratch / "dry"
            python("site-astro/tools/scan_glance.py", "--dist", dist, "--pages", ",".join(routes), "--out", scan)
            publish = ["site-astro/tools/publish_site.py", "--dist", dist, "--scan-result", scan / "scan-result.json",
                       "--update-batch", batch, "--lock-holder", holder]
            python(*publish, "--dry-run", "--previous-manifest", previous,
                   "--previous-site-dist", saved["site_dist"]["root"], "--output", dry)
            plan = read(dry / "publish-receipt.json")
            documents = plan["site_dist"]["changed_files"]
            unexpected = [p for p in documents if not (rule_page(p) or p in CONTROL_FILES)]
            assets = plan["planned_assets"] + plan["planned_origin_readbacks"]
            unexpected += [p for p in assets if p != "live/_fallback.json"
                           and not p.startswith(("rules/", "公用/assets/fonts/", "公用/fonts/"))]
            result.update(pages=[p for p in documents if rule_page(p)], assets=len(assets),
                          control_files=sorted(set(documents) & CONTROL_FILES), unexpected=unexpected)
            if unexpected:
                raise ValueError("发版范围超出规则页：" + "、".join(unexpected))
            if args.publish:
                lock("Acquire")
                try:
                    current = json.loads(public(ORIGIN + "release-identity.json"))["release_id"]
                    if current != prior["release_id"] or read(pointer)["manifest"]["release_id"] != current:
                        raise ValueError("预演后有其他版本上线，本轮停止发布")
                    stage_live_project_settings(worktree, args.pcconfig)
                    python(*publish)
                finally:
                    lock("Release")
                return "published", "规则页已发布并回读"
        finally:
            command("git", "worktree", "remove", "--force", worktree)
    return "dry_run", "发布预演通过，未发布"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("repo", "state", "pcconfig", "prepare"):
        parser.add_argument("--" + name, type=Path, required=True)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--publish", action="store_true")
    mode.add_argument("--rehearse", action="store_true")
    parser.add_argument("--rules-release", type=lambda value: re.fullmatch(r"E\d+", value)[0])
    args = parser.parse_args()
    if args.rules_release and not args.rehearse:
        parser.error("--rules-release requires --rehearse")
    args.state.mkdir(parents=True, exist_ok=True)
    result = {}
    with (args.state / "latest.log").open("w", encoding="utf-8", buffering=1) as log:
        try:
            status, summary = update(args, result, log)
        except Exception as error:
            status, summary = "failed", "规则检查或更新失败，查看本轮记录"
            log.write(str(error) + "\n")
            result["error"] = str(error)
    result.update(status=status, summary=summary, finished_at=datetime.now(timezone(timedelta(hours=8))).isoformat())
    tmp = args.state / "latest.tmp"
    tmp.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", "utf-8")
    tmp.replace(args.state / "latest.json")
    print(json.dumps(result, ensure_ascii=False))
    return int(status == "failed")


if __name__ == "__main__":
    sys.exit(main())
