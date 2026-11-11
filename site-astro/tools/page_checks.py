"""Shared page-local results; the update workflow decides publication policy."""
import json
from pathlib import Path


class PageCheckError(ValueError):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("；".join(e["message"] for e in errors))


def issue(code, screen, message, **fields):
    return dict(code=code, screen=screen, message=message, **fields)


def page_result(page, error=None, code="conversion_failed"):
    errors = [] if error is None else (error.errors if isinstance(error, PageCheckError)
                                      else [issue(code, None, str(error))])
    return dict(page=page, passed=not errors, errors=errors, warnings=[])


def write_checks(path, stage, pages):
    result = dict(schema="wly.page-checks.v1", stage=stage, pages=pages)
    write_json(path, result)
    return result


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
