"""本轮事实来源选择；项目身份取自登记路径、路由和作者页父级。"""
import json
from pathlib import Path
import runpy


class Selection:
    def __init__(self, root, manual_owner_request=()):
        root = Path(root)
        self.requested = sorted(set(manual_owner_request))
        self.pages = {p.parent.name: json.loads(p.read_text("utf-8-sig"))
                      for p in (root / "sources/pages").glob("*/page.json")}
        path = root / "config/panel-projects.json"
        projects = json.loads(path.read_text("utf-8-sig"))["projects"] if path.exists() else []
        routes = {route.rstrip("/"): slug for slug, p in self.pages.items()
                  for route in [p.get("url"), *(p.get("old_urls") or [])] if route}
        alias_path = root / "scripts/audit-content-refresh.py"
        aliases = runpy.run_path(str(alias_path))["PROJECT_ALIASES"] if alias_path.exists() else {}
        self.owners, self.aliases = {}, {}
        for project in projects:
            content = project.get("ai_refresh", {}).get("content_path") or project.get("content_path", "")
            slug = next((s for s in self.pages if content == f"sources/pages/{s}/page.json"), None)
            slug = slug or routes.get(project.get("route", "").rstrip("/"))
            # 旧登记仍指向冻结 HTML 时，复用已有的显式身份别名，不拼名称前缀。
            slug = slug or next((s for s, owner in aliases.items() if owner == project["id"] and s in self.pages), None)
            if slug:
                self.owners[slug] = project
                self.aliases[project["id"]] = slug

    def reason(self, slug):
        seen = set()
        while slug and slug not in seen:
            seen.add(slug)
            page, project = self.pages.get(slug, {}), self.owners.get(slug, {})
            named = slug in self.requested or project.get("id") in self.requested
            if not named:
                if page.get("kind") == "frozen" or page.get("status") in {"frozen", "冻结", "已冻结"}:
                    return f"冻结项目 {slug} 未被本人点名"
                if project.get("ai_refresh", {}).get("mode") == "manual_owner_only":
                    return f"仅本人点名才更新的项目 {project['id']} 本轮未纳入"
            parent = page.get("parent")
            slug = self.aliases.get(parent, parent)
        return None

    def partition(self, rows):
        included, excluded = [], []
        for row in rows:
            reason = self.reason(row["page"])
            if reason or row.get("status") == "excluded":
                excluded.append(dict(record_id=row.get("record_id", row.get("id")), page=row["page"],
                                     reason=reason or row.get("reason", "取数时未纳入本轮")))
            else:
                included.append(row)
        return included, excluded
