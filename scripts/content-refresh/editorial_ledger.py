"""网站的编辑底稿：私有存放，核对草稿只在该页发布回读后生效。"""
import argparse
from collections import Counter
from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile

SCHEMA = "wly.editorial-ledger.v1"
REPOSITORY = "wlyaaaaa/wly0829.cn"
VISIBILITY = {"能公开", "脱敏后能公开", "不能公开"}


def read_json(path):
    return json.loads(Path(path).read_text("utf-8-sig"))


def _atomic_write(path, data, **options):
    path, temporary = Path(path), None
    try:
        with tempfile.NamedTemporaryFile(mode="w" if isinstance(data, str) else "wb",
                dir=path.parent, prefix=path.name + ".", suffix=".tmp", delete=False, **options) as stream:
            temporary = Path(stream.name)
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def atomic_write_text(path, text, encoding="utf-8", newline=None):
    _atomic_write(path, text, encoding=encoding, newline=newline)


def atomic_write_bytes(path, data):
    _atomic_write(path, data)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_bytes(path, (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def companion_root(root):
    """显式隔离目录，或本机登记；没有 Git 身份的材料目录不借用本人账。"""
    if override := os.environ.get("WLY_EDITORIAL_ROOT"):
        return Path(override)
    if not (Path(root) / ".git").exists():
        return None
    registry = read_json(Path("E:/PCConfig/registries/public-project-private-companion.json"))
    target = Path(registry["local_path"])
    catalog = read_json(target / registry["catalog"])
    source = next(row for row in catalog["sources"] if row["source_repository"] == REPOSITORY)
    return target / source["prefix"]


def empty_book(book):
    return dict(schema=SCHEMA, book=book, source_repositories=[], capabilities=[], stages=[], images=[], pages={})


def reconcile_capabilities(expected_ids, book):
    """来源单的 ID 与账逐行闭合；不靠比例，也不从网页倒推来源。"""
    rows = book["capabilities"]
    counts = Counter(row["id"] for row in rows)
    expected, actual = set(expected_ids), set(counts)
    return dict(missing=sorted(expected - actual), extra=sorted(actual - expected),
                empty=[r["id"] for r in rows if (not r.get("destinations") or any(not d.get("page") or not d.get("screen") for d in r["destinations"]))
                       and not str(r.get("omission_reason") or "").strip()],
                duplicate=sorted(key for key, count in counts.items() if count > 1))


def valid_time(value):
    try:
        return bool(datetime.fromisoformat(str(value).replace("Z", "+00:00")).tzinfo)
    except ValueError:
        return False


class Ledger:
    def __init__(self, root, companion=None):
        self.root = Path(root)
        self.companion = Path(companion) if companion is not None else companion_root(self.root)
        if self.companion is None:
            raise FileNotFoundError("没有登记的编辑底稿目录")
        if self.companion.resolve().is_relative_to(self.root.resolve()):
            raise ValueError("编辑底稿必须放在公开仓库之外")
        self.pages = {p.parent.name: read_json(p) for p in (self.root / "sources/pages").glob("*/page.json")}
        config = self.root / "config/panel-projects.json"
        self.projects = read_json(config)["projects"] if config.exists() else []
        self.owners = {}
        for project in self.projects:
            content = project.get("ai_refresh", {}).get("content_path", "")
            for slug, page in self.pages.items():
                if content == f"sources/pages/{slug}/page.json" or (project.get("route") and page.get("url", "").rstrip("/") == project["route"].rstrip("/")):
                    self.owners[slug] = project

    def book_for(self, slug):
        if slug.startswith("skill-"):
            return slug
        if slug.startswith("rule-") or slug in {"charter", "rules-home"}:
            return "rules"
        page, seen = slug, set()
        while page and page not in seen:
            seen.add(page)
            project = self.owners.get(page) or next((p for p in self.projects if p["id"] == page), None)
            if project:
                return "website" if project["id"] == "wly0829-cn" else "project-" + project["id"]
            page = self.pages.get(page, {}).get("parent")
        return "website"

    def path(self, book):
        if not re.fullmatch(r"[a-z0-9][a-z0-9._-]*", book):
            raise ValueError("账名不是安全的文件名")
        return self.companion / "files/editorial-ledgers" / (book + ".json")

    def read(self, book):
        path = self.path(book)
        data = read_json(path) if path.exists() else empty_book(book)
        if data.get("schema") != SCHEMA or data.get("book") != book:
            raise ValueError("编辑底稿格式或身份不符")
        return data

    def write(self, data):
        if data.get("schema") != SCHEMA:
            raise ValueError("编辑底稿格式不符")
        rows = data["capabilities"]
        if any(reconcile_capabilities([r["id"] for r in rows], data).values()):
            raise ValueError("能力 ID 重复，或没有网页去处/不讲理由")
        if any(r.get("visibility") not in VISIBILITY for r in rows):
            raise ValueError("能力缺公开标记")
        ids = {r["id"] for r in rows}
        if any(not set(image["capability_ids"]).issubset(ids) or not image["capability_ids"] for image in data["images"]):
            raise ValueError("图片没有挂到已有能力")
        path = self.path(data["book"])
        write_json(path, data)
        manifest_path = self.companion / "manifest.json"
        manifest = read_json(manifest_path) if manifest_path.exists() else dict(
            schema="public-project-private-backup.manifest.v1", source_repository=REPOSITORY, files=[])
        relative = path.relative_to(self.companion).as_posix()
        entry = next((r for r in manifest["files"] if r["target_relative_path"] == relative), None)
        if entry is None:
            entry = dict(source_relative_path=".publish/private/editorial-ledgers/" + path.name, target_relative_path=relative)
            manifest["files"].append(entry)
        raw = path.read_bytes()
        entry.update(bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())
        write_json(manifest_path, manifest)

    def reviews(self):
        return {slug: page["semantic_review"] for path in (self.companion / "files/editorial-ledgers").glob("*.json")
                for slug, page in self.read(path.stem)["pages"].items() if "semantic_review" in page}

    def stage_reviews(self, reviews):
        for slug, review in reviews.items():
            data = self.read(self.book_for(slug))
            data["pages"].setdefault(slug, {})["pending_review"] = review
            self.write(data)

    def advance_page(self, slug, checked_sources, publication):
        """只接正式发布回执；失败页留待续，其他页/来源标记不动。"""
        route = self.pages[slug]["url"].lstrip("/")
        relative = route if route.endswith(".html") else route.rstrip("/") + "/index.html" if route else "index.html"
        back = publication.get("readback", {}).get(relative, {})
        if (publication.get("schema") != "wly.site-publication.v1" or publication.get("status") not in {None, "published"}
                or not publication.get("deployment") or not valid_time(publication.get("verified_at_beijing"))
                or not re.fullmatch(r"[a-f0-9]{40}", str(publication.get("source_commit") or ""))
                or back.get("status") != "pass" or back.get("http") != 200
                or not re.fullmatch(r"[a-f0-9]{64}", str(back.get("sha256") or "")) or back["sha256"] != back.get("expected_sha256")):
            return False
        if not checked_sources or any(not re.fullmatch(r"[a-f0-9]{40}", s.get("commit", ""))
                                      or not valid_time(s.get("time")) for s in checked_sources.values()):
            raise ValueError("每个来源须有完整提交号和带时区的核对时间")
        published_at = datetime.fromisoformat(publication["verified_at_beijing"].replace("Z", "+00:00"))
        if any(datetime.fromisoformat(s["time"].replace("Z", "+00:00")) > published_at for s in checked_sources.values()):
            return False
        data = self.read(self.book_for(slug))
        page = data["pages"].setdefault(slug, {})
        if "pending_review" in page:
            checked_at = page["pending_review"].get("checked_at")
            if not valid_time(checked_at) or published_at < datetime.fromisoformat(checked_at.replace("Z", "+00:00")):
                return False
            page["semantic_review"] = page.pop("pending_review")
        page["checked_sources"] = checked_sources
        data["source_repositories"] = sorted(set(data["source_repositories"]) | checked_sources.keys())
        self.write(data)
        return True

    def migrate(self, legacy):
        """保留旧证据原值；旧 based_on 是参考，绝不伪装成本轮发布核对点。"""
        books = {}
        for slug, review in legacy["pages"].items():
            book = self.book_for(slug)
            data = books.setdefault(book, self.read(book))
            page = data["pages"].setdefault(slug, {})
            if "semantic_review" in page and page["semantic_review"] != review:
                raise ValueError("已有不同核对记录，不能用旧账覆盖：" + slug)
            page["semantic_review"] = review
            page.setdefault("screen_sources", {})
            if basis := self.pages.get(slug, {}).get("based_on"):
                page.setdefault("legacy_basis", basis)
            project = next((p for p in self.projects if book == "project-" + p["id"]), {})
            source = project.get("source", {}).get("repo")
            if book == "rules" or "/.agents/" in str(page.get("legacy_basis", {}).get("file", "")).replace("\\", "/"):
                source = "wlyaaaaa/.agents"
            if book == "website":
                source = REPOSITORY
            if source and "/" in source and source not in data["source_repositories"]:
                data["source_repositories"].append(source)
        for data in books.values():
            self.write(data)
        return sorted(books)


def read_reviews(root):
    companion = companion_root(root)
    return Ledger(root, companion).reviews() if companion is not None else {}


def stage_reviews(root, reviews):
    Ledger(root).stage_reviews(reviews)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--companion", type=Path, help="已登记的私有项目目录，或隔离样例目录")
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--create", help="创建一本空账，已有的账保持原值")
    action.add_argument("--read", help="读取一本账；正文仅用于私有操作")
    action.add_argument("--migrate", type=Path, help="迁入旧 semantic-reviews JSON，原时间不变")
    args = parser.parse_args()
    store = Ledger(args.root, args.companion)
    if args.create:
        store.write(store.read(args.create))
    elif args.read:
        print(json.dumps(store.read(args.read), ensure_ascii=False, indent=2))
    else:
        print(json.dumps(dict(migrated=store.migrate(read_json(args.migrate))), ensure_ascii=False))


if __name__ == "__main__":
    main()
