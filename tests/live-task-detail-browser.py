"""Browser check for the three task-detail variants on a built loopback preview."""
from datetime import datetime, timedelta, timezone
from sys import argv
from urllib.parse import urlsplit
from playwright.sync_api import expect, sync_playwright
origin = argv[1].rstrip("/")
assert urlsplit(origin).hostname in {"127.0.0.1", "localhost"}
now = datetime(2026, 11, 19, 10, tzinfo=timezone(timedelta(hours=8)))
time = lambda delta=0: (now + timedelta(minutes=delta)).isoformat()
run = {"run_key": "internal-unreadable-id", "started": time(-60), "finished": time(-57), "result": "ok",
       "executor": "codex", "chat_id": "chat-fixture", "output": "写好一份结果"}
d = {"name": "合成任务", "last": {"start": time(-60), "result": "ok"}, "runs": [run], "at": time()}
cases = (
    ("plan", {**d, "group": "backup", "days7": [{"date": f"2026-11-{day}", "state": "ok" if day > 17 else None} for day in range(13, 20)],
              "last": {"start": time(-30), "result": "failed", "reason": "备份命令超时", "exit_code": 1}}),
    ("pickup", {**d, "automation_group": "ai-pickup", "today_runs": 0, "today_runs_q": "ok",
                "runs": [{**run, "started": time(-900), "finished": time(-895), "cause": {"visibility": "owner", "text": "本人才能看到的合成起因"}}],
                "last": {"start": time(-900), "end": time(-895), "result": "ok"}}),
    ("schedule", {**d, "automation_group": "ai-schedule", "scheduler": "codex",
                  "upcoming_runs": [time(240), time(-1), time(180), time(240), time(480)]}),
)
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="C:/Program Files/Google/Chrome/Application/chrome.exe", args=["--no-proxy-server"])
    for variant, data in cases:
        context = browser.new_context(service_workers="block")
        def route_request(route):
            url = urlsplit(route.request.url)
            if not route.request.url.startswith(origin + "/") or route.request.method != "GET":
                return route.abort()
            if url.path == "/__live/tasks/task-fixture":
                return route.fulfill(json={"at": time(), "now": time(), "seq": 1, "rev": "fixture", "viewer": {"kind": "public"}, "data": data})
            route.continue_()
        context.route("**/*", route_request)
        page = context.new_page()
        page.goto(origin + "/live/task/?id=task-fixture", wait_until="domcontentloaded")
        expect(page.locator("body")).to_have_attribute("data-variant", variant)
        expect(page.locator("#task-stats dd")).to_have_count(4)
        assert "internal-unreadable-id" not in page.locator("main").inner_text()
        if variant == "plan":
            expect(page.locator(".task-day")).to_have_count(7)
            expect(page.locator("#failure")).to_contain_text("备份命令超时")
        elif variant == "pickup":
            expect(page.locator("[data-stat=today] dd")).to_have_text("0 次")
            assert "本人才能看到的合成起因" not in page.locator("main").inner_text()
            expect(page.locator("#runs table a")).to_have_attribute("href", "/live/chat/?id=chat-fixture")
        else:
            assert page.locator("#future-runs time").all_text_contents() == ["今天 13:00", "今天 14:00", "今天 18:00"]
            expect(page.locator("#runs")).to_contain_text("写好一份结果")
        context.close()
    browser.close()
