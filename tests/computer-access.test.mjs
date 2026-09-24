import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { adaptStatus, apiRequest, beijingTime, canEndGrant, canRetryVerification, capacity, createGrantAttempt, createStatusReader, durationMinutes, grantLabel, hardwareBasis, hardwareSnapshot, isAccessOrigin, isHostOrigin, memorySpecification, networkConnection, queryResultUpdate, rate, reductionAction, reductionFailureResult, successfulGrantSnapshot, successfulReductionSnapshot, unresolvedAction } from "../app/computer-access-model.js";

test("only a complete authoritative grant updates remaining time and returns the form to ready", () => {
  const before = { state_version: "old", personal_data: { state: "unlocked", expires_at_unix: 100 }, unrestricted: { state: "active", expires_at_unix: 200 } };
  const success = { state: "succeeded", personal_data: { state: "succeeded", expires_at_unix: 300 } };
  const next = successfulGrantSnapshot(before, success, true);
  assert.equal(next.personal_data.expires_at_unix, 300);
  assert.deepEqual(next.unrestricted, before.unrestricted);
  assert.equal(next.state_version, "");
  assert.equal(before.personal_data.expires_at_unix, 100);
  for (const invalid of [{ ...success, state: "partial" }, { ...success, state: "unknown" }, { state: "succeeded" }, { state: "succeeded", personal_data: { state: "unknown", expires_at_unix: 300 } }]) assert.equal(successfulGrantSnapshot(before, invalid, true), null);
});

test("reducing actions settle explicit precreate rejection without inventing certainty for lost responses", () => {
  for (const error of ["public_state_changed", "public_lock_disabled", "public_owner_end_disabled", "public_windows_lock_disabled", "public_request_invalid"]) {
    const result = reductionFailureResult({ data: { error } }, "request-1", "windows");
    assert.equal(result.state, "failed");
    assert.equal(result.request_created, false);
    assert.equal(unresolvedAction(result), false);
    assert.equal(reductionFailureResult({ data: { error } }, "request-1", "windows", true).state, "unknown");
  }
  for (const failure of [new Error("network"), { data: { error: "public_access_unavailable" } }, { data: { error: "public_request_not_found" } }]) {
    assert.equal(reductionFailureResult(failure, "request-1", "windows").state, "unknown");
  }
});

test("hour input uses decimal half-up minutes and rejects out-of-range values before rounding", () => {
  for (const [input, expected] of [[".5", 30], ["1.", 60], ["0.5", 30], ["1.23", 74], ["2.25", 135], ["6.8", 408], ["17.3", 1038], ["72", 4320], ["1.225", 74], ["1.2249999999999999999999999", 73]]) assert.equal(durationMinutes(input), expected, input);
  for (const input of ["", " ", "0", "-1", "0.49999999", "72.000001", "NaN", "Infinity", "1e2", "1x", "."]) assert.equal(durationMinutes(input), null, input);
});

test("only the two exact HTTPS origins may display and submit the verification form", () => {
  for (const origin of ["https://wly0829.cn", "https://mcp.wly0829.cn"]) {
    assert.equal(isAccessOrigin(origin), true);
    assert.equal(isAccessOrigin(origin, false), false, "embedded pages cannot conduct verification");
  }
  assert.equal(isHostOrigin("https://mcp.wly0829.cn"), true);
  for (const origin of ["http://wly0829.cn", "http://mcp.wly0829.cn", "https://mcp.wly0829.cn.evil.test", "https://wly0829.cn.evil.test", "http://localhost:4179"]) assert.equal(isAccessOrigin(origin), false);
});

test("historical grant results never restore current authority and current_state wins on POST", () => {
  const before = { state_version: "new", unrestricted: { state: "inactive", expires_at_unix: 0 } };
  const old = { state: "succeeded", unrestricted: { state: "succeeded", expires_at_unix: 9999999999 } };
  assert.equal(successfulGrantSnapshot(before, old), null);
  assert.equal(successfulGrantSnapshot(before, { ...old, unrestricted: { ...old.unrestricted, current_state: "revoked" } }, true).unrestricted.state, "revoked");
});

test("fresh reduction receipts immediately project actual phase, historical receipts never end newer grants", () => {
  const before = { state_version: "new", personal_data: { state: "unlocked", expires_at_unix: 300 }, unrestricted: { state: "active", expires_at_unix: 300 } };
  for (const phase of ["locked", "closing"]) {
    const result = { action: "personal-data", state: "succeeded", personal_data: { state: phase, expires_at_unix: 0 } };
    const projected = successfulReductionSnapshot(before, result, true);
    assert.equal(projected.personal_data.state, phase);
    assert.equal(projected.personal_data.expires_at_unix, 0);
    assert.equal(projected.state_version, "");
    assert.deepEqual(projected.unrestricted, before.unrestricted);
    assert.equal(successfulReductionSnapshot(before, result), null);
  }
  const result = { action: "unrestricted", state: "succeeded", unrestricted: { state: "inactive", expires_at_unix: 0 } };
  assert.equal(successfulReductionSnapshot(before, result, true).unrestricted.state, "inactive");
  assert.equal(successfulReductionSnapshot(before, result), null);
  assert.equal(successfulReductionSnapshot(before, { state: "succeeded", action: "windows" }, true), null);
});

test("hardware adapter preserves missing, disconnected and stale observations", () => {
  const adapted = adaptStatus({ hardware: {
    cpu: { temperature_celsius: 52, sources: { temperature_celsius: { status: "stale", observed_at_unix: 123, timestamp_basis: "sample" } } },
    memory: { installed_bytes: 64 * 1024 ** 3, total_bytes: 61.6 * 1024 ** 3 },
    network: { download_bytes_per_second: null },
    volumes: [{ letter: "H:", connected: false, total_bytes: null, type: "removable" }, { letter: "Z:", type: "ramdisk", total_bytes: 1024 ** 3 }],
  } });
  assert.equal(adapted.hardware.cpu.temperature_c.state, "stale");
  assert.equal(adapted.hardware.cpu.observed_at_unix, 123);
  assert.equal(capacity(adapted.hardware.memory.installed_total_bytes), "64.0 GiB");
  assert.equal(adapted.hardware.volumes[0].state, "disconnected");
  assert.equal(capacity(adapted.hardware.volumes[0].total_bytes), "暂无数据");
  assert.match(adapted.hardware.volumes[1].mapping, /不计入物理盘容量/);
  assert.equal(rate(adapted.hardware.network.download_bytes_per_second), "暂无数据");
  assert.equal(rate({ value: 1024 ** 2, state: "stale" }), "1 MiB/s（已过期）");
});

test("group time follows the dynamic read while individual static and unknown sample times remain intact", () => {
  const cpu = adaptStatus({ hardware: { cpu: { model: "synthetic", temperature_celsius: 42, sources: {
    model: { observed_at_unix: 100, status: "ok", timestamp_basis: "sample" },
    temperature_celsius: { observed_at_unix: 200, status: "ok", source: "sensor", timestamp_basis: "provider_read" },
  } } } }).hardware.cpu;
  assert.equal(cpu.observed_at_unix, 200);
  assert.equal(cpu.model.observed_at_unix, 100);
  assert.equal(cpu.temperature_c.timestamp_basis, "provider_read");
  assert.equal(cpu.temperature_c.source, "sensor");
  assert.equal(cpu.timestamp_basis, "provider_read");
  assert.equal(hardwareBasis("LHM core average clock", "frequency"), "各核心当前频率的平均值");
  assert.match(hardwareBasis("lowest-metric active physical IPv4 default route; tunnels excluded", "network"), /不重复累计隧道/);
});

test("same-form retry requires a definite pre-commit failure and never retries unknown or partial commit", () => {
  for (const error of ["totp_verification_failed", "public_totp_cooldown", "public_totp_not_ready"])
    assert.equal(canRetryVerification({ state: "failed", error }), true);
  for (const value of [{ state: "pending", error: "public_totp_cooldown" }, { state: "unknown", error: "totp_verification_failed" }, { state: "failed", error: "public_access_response_unknown" }, { state: "failed", error: "totp_verification_failed", personal_data: { state: "succeeded" } }, { state: "partial", error: "totp_verification_failed" }])
    assert.equal(canRetryVerification(value), false);
});

function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
test("one user submit creates then verifies the exact bound request once", async () => {
  const calls = [];
  const attempt = createGrantAttempt({ requestId: "synthetic-id", body: { purpose: "personal_data", duration_hours: "1.23", combined: false }, onCreated() {}, api: async (path, options) => {
    calls.push({ path, options });
    return path === "/requests" ? { request_id: "synthetic-id", state: "pending", csrf_token: "synthetic-csrf" } : { state: "succeeded" };
  } });
  assert.deepEqual(await attempt.run("000000"), { state: "succeeded" });
  assert.deepEqual(calls.map(call => call.path), ["/requests", "/requests/synthetic-id/verify"]);
  assert.equal(calls[1].options.csrf, "synthetic-csrf");
  assert.equal(calls[1].options.body.totp, "000000");
});

test("unprepared, failed or mismatched create responses never receive the code", async () => {
  for (const prepared of [{ request_id: "synthetic-id", state: "failed", error: "public_totp_cooldown" }, { request_id: "synthetic-id", state: "unknown" }, { request_id: "another-id", state: "pending", csrf_token: "synthetic-csrf" }]) {
    const paths = [];
    const attempt = createGrantAttempt({ requestId: "synthetic-id", body: {}, onCreated() {}, api: async path => { paths.push(path); return prepared; } });
    await attempt.run("000000");
    assert.deepEqual(paths, ["/requests"]);
  }
});

test("cancel while create is pending cancels that request and never sends a factor", async () => {
  const created = deferred(), calls = [];
  const attempt = createGrantAttempt({ requestId: "synthetic-id", body: {}, onCreated() {}, api: async path => {
    calls.push(path); return path === "/requests" ? created.promise : { state: "cancelled" };
  } });
  const running = attempt.run("000000"), cancelling = attempt.cancel();
  created.resolve({ request_id: "synthetic-id", state: "pending", csrf_token: "synthetic-csrf" });
  assert.equal(await running, null);
  assert.deepEqual(await cancelling, { state: "cancelled" });
  assert.deepEqual(calls, ["/requests", "/requests/synthetic-id/cancel"]);
});

test("explicit creation rejection racing cancellation is recoverable without a nonexistent saved request", async () => {
  let reject;
  const created = new Promise((_, fail) => { reject = fail; });
  const calls = [];
  const attempt = createGrantAttempt({ requestId: "synthetic-id", body: {}, onCreated() { throw new Error("not created"); },
    api: async path => { calls.push(path); return created; } });
  const running = attempt.run("000000"), cancelling = attempt.cancel();
  reject(Object.assign(new Error("rejected"), { data: { status: "error", error: "public_state_changed" } }));
  assert.equal(await running, null);
  const result = await cancelling;
  assert.equal(result.state, "cancelled");
  assert.equal(result.request_created, false);
  assert.equal(result.factor_submitted, false);
  assert.deepEqual(calls, ["/requests"]);
});

test("cancel while verify is pending suppresses late verify and preserves actual cancel readback", async () => {
  for (const terminal of ["cancelled", "succeeded"]) {
    const verified = deferred(), started = deferred();
    const attempt = createGrantAttempt({ requestId: "synthetic-id", body: {}, onCreated() {}, api: async path => {
      if (path === "/requests") return { request_id: "synthetic-id", state: "pending", csrf_token: "synthetic-csrf" };
      if (path.endsWith("/verify")) { started.resolve(); return verified.promise; }
      return { state: terminal };
    } });
    const running = attempt.run("000000"); await started.promise;
    assert.deepEqual(await attempt.cancel(), { state: terminal });
    verified.resolve({ state: "succeeded" });
    assert.equal(await running, null);
  }
});

test("expired grants never render as active, unknown never means locked", () => {
  assert.equal(grantLabel({ state: "active", expires_at_unix: 100 }, 101), "已到期 · 等待主机确认");
  assert.equal(grantLabel(null, 101), "状态未知");
  assert.equal(grantLabel({ state: "closing" }, 101), "正在关闭资料");
});

test("all absolute display times use Beijing time regardless of the browser timezone", () => {
  assert.equal(beijingTime(Date.UTC(2026, 8, 24, 0, 30) / 1000), "2026/09/24 08:30:00 北京时间");
  assert.equal(beijingTime(Date.UTC(2026, 8, 23, 20, 30) / 1000, true), "04:30:00 北京时间");
  assert.equal(beijingTime(null), "时间未知");
});

test("unknown reduction requests remain classified separately from factor requests", () => {
  assert.equal(reductionAction({ action: "windows", state: "unknown" }), "windows");
  assert.equal(reductionAction({ error: "public_windows_lock_result_unknown", state: "unknown" }), "windows");
  assert.equal(reductionAction({ state: "unknown" }), null);
  assert.equal(unresolvedAction({ state: "unknown" }), true);
  assert.equal(unresolvedAction({ state: "failed" }), false);
});

test("lookup feedback distinguishes unchanged unknown, new success and query failure without changing old truth", () => {
  const previous = { request_id: "same-id", action: "windows", state: "unknown", error: "public_windows_lock_result_unknown" };
  const unchanged = queryResultUpdate(previous, previous, 100);
  assert.equal(unchanged.state, "unknown");
  assert.equal(unchanged.query_state, "unchanged");
  assert.equal(unchanged.queried_at_unix, 100);
  const succeeded = queryResultUpdate(previous, { request_id: "same-id", state: "succeeded" }, 110);
  assert.equal(succeeded.query_state, "updated");
  assert.equal(succeeded.error, undefined);
  assert.equal(succeeded.action, "windows");
  const failed = queryResultUpdate(succeeded, null, 120, true);
  assert.equal(failed.query_state, "failed");
  assert.equal(failed.state, "succeeded");
  assert.equal(failed.request_id, "same-id");
});

test("a logical API failure in an HTTP 200 response cannot be mistaken for a prepared factor request", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ status: "error", error: "public_state_changed" }), { status: 200 });
  try { await assert.rejects(apiRequest("", "/requests", { method: "POST", body: {} }), /状态已变化/); }
  finally { globalThis.fetch = originalFetch; }
});

test("status reads do not overlap and a late old poll cannot overwrite operation readback", async () => {
  const pending = [], seen = [];
  const reader = createStatusReader(signal => new Promise(resolve => pending.push({ resolve, signal })), data => seen.push(data), error => { throw error; });
  const first = reader.read();
  await reader.read();
  assert.equal(pending.length, 1);
  reader.invalidate();
  assert.equal(pending[0].signal.aborted, true);
  const second = reader.read({ replace: true });
  pending[1].resolve("new-state"); await second;
  pending[0].resolve("old-state"); await first;
  assert.deepEqual(seen, ["new-state"]);
});

test("built route preserves the complete static shell and scoped connection policy", async () => {
  const html = await readFile(new URL("../dist/computer-access/index.html", import.meta.url), "utf8");
  for (const text of ["授权与状态", "存储空间", "Windows可用物理总量", "无限制授权", "锁定个人资料", "锁定Windows", "正在连接主机"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('id="ca-totp"'));
  assert.match(html, /href="https:\/\/wly0829.cn\/computer-access\/"/);
  assert.match(html, /aria-label="授权与状态"/);
  assert.ok(!html.includes("需要结束访问时"));
  assert.match(html, /aria-label="结束无限制授权"/);
  assert.ok(html.indexOf('class="ca-grants"') < html.indexOf('id="ca-hardware-title"'));
  assert.ok(html.indexOf('id="access-form"') < html.indexOf('id="ca-hardware-title"'));
  assert.ok(!html.includes('class="flow-field"'));
  assert.match(html, /href="\/computer-access\/"[^>]*aria-label="授权与状态"/);
  assert.match(html, /connect-src 'self' https:\/\/mcp.wly0829.cn/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.ok(html.indexOf('id="access-form"') < html.indexOf('class="ca-card ca-network-card"'));
  assert.ok(html.indexOf('class="ca-card ca-network-card"') > html.indexOf("</aside>"));
  assert.match(html, /rel="preconnect" href="https:\/\/mcp.wly0829.cn"/);
});

test("website entry mounts in place without redirecting or discarding request locators", async () => {
  const runtime = await readFile(new URL("../static-site/main.jsx", import.meta.url), "utf8");
  const entry = runtime.slice(runtime.indexOf('if (document.querySelector("[data-computer-access]"))'), runtime.indexOf("const searchEntries"));
  assert.ok(entry.includes('import("../app/computer-access-client.jsx")'));
  assert.ok(!entry.includes("location.replace"));
  assert.ok(!entry.includes("sessionStorage"));
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.ok(!home.includes("Content-Security-Policy"));
});

test("end buttons reflect actual grant state without conflating pending request cancellation", () => {
  for (const state of ["locked", "inactive", "expired", "revoked", "unknown"]) assert.equal(canEndGrant({ state, expires_at_unix: 200 }, 100), false);
  for (const state of ["unlocked", "active"]) {
    assert.equal(canEndGrant({ state, expires_at_unix: 200 }, 100), true);
    assert.equal(canEndGrant({ state, expires_at_unix: 100 }, 100), false);
  }
  for (const state of ["opening", "closing"]) assert.equal(canEndGrant({ state, expires_at_unix: 0 }, 100), true);
  assert.equal(canEndGrant(null, 100), false);
});

test("manual refresh reaches the status fetch without changing singleflight or generation safety", async () => {
  const pending = [], seen = [];
  const reader = createStatusReader((signal, options) => new Promise(resolve => pending.push({ signal, options, resolve })), (data, options) => seen.push({ data, options }), error => { throw error; });
  const initial = reader.read();
  await reader.read({ refresh: true });
  assert.equal(pending.length, 1);
  assert.equal(pending[0].options.refresh, false);
  reader.invalidate();
  const fresh = reader.read({ refresh: true });
  assert.equal(pending[1].options.refresh, true);
  pending[1].resolve("fresh"); await fresh;
  pending[0].resolve("old"); await initial;
  assert.deepEqual(seen, [{ data: "fresh", options: { refresh: true } }]);
});

test("reload cache projection strips all authority and request fields", () => {
  const saved = hardwareSnapshot({ hardware: { cpu: { model: "synthetic", usage_percent: 10 } }, observed_at_unix: 100, personal_data: { state: "unlocked" }, unrestricted: { state: "active" }, state_version: "old", totp: "synthetic", request_id: "old" });
  assert.deepEqual(Object.keys(saved).sort(), ["hardware", "observed_at_unix"]);
  assert.equal(hardwareSnapshot(null), null);
  assert.equal(hardwareSnapshot({ hardware: {} }), null);
});

test("computer routes stay in the current tab while external links retain their target", async () => {
  const html = await readFile(new URL("../dist/computer-access/index.html", import.meta.url), "utf8");
  for (const name of ["连接电脑", "授权与状态"]) {
    const tag = html.match(new RegExp(`<a[^>]+aria-label="${name}"[^>]*>`))?.[0];
    assert.ok(tag, name); assert.ok(!tag.includes('target="_blank"'), tag);
  }
  assert.match(html, /data-grafana-entry="true"[^>]*href="\/#grafana-status"/);
});

test("hardware specifications preserve actual inventory and dynamic link evidence", () => {
  const source = (observed_at_unix) => ({ status: "ok", observed_at_unix, timestamp_basis: "sample" });
  const status = adaptStatus({ hardware: {
    memory: { type: "DDR5", data_rate_mt_s: 6200, module_count: 2, module_capacity_bytes: 32 * 1024 ** 3, manufacturer: "Synthetic", timings: null, used_bytes: 1024, sources: { type: source(10), data_rate_mt_s: source(10), manufacturer: source(10), timings: source(10), used_bytes: source(20) } },
    network: { model: "Synthetic adapter", connection_type: "ethernet", link_speed_bps: 2500000000, sources: { model: source(10), connection_type: source(20), link_speed_bps: source(20) } },
    volumes: [{ letter: "C:", filesystem: "ReFS", sources: { filesystem: source(10), used_bytes: source(20) } }],
  } });
  const memory = memorySpecification(status.hardware.memory);
  assert.equal(memory.standard, "DDR5-6200"); assert.equal(memory.modules, "2 × 32.0 GiB"); assert.equal(memory.timings, null);
  assert.equal(memorySpecification({ timings: "36-38-38-80" }).timings, "时序 36-38-38-80");
  assert.equal(status.hardware.memory.observed_at_unix, 20); assert.equal(status.hardware.memory.type.observed_at_unix, 10);
  assert.equal(networkConnection(status.hardware.network), "有线以太网 · 2.5 Gbps");
  assert.equal(networkConnection({ connection_type: "wifi", link_speed_bps: 1200000000 }), "Wi-Fi · 1.2 Gbps");
  assert.equal(networkConnection({ connection_type: "physical", link_speed_bps: null }), "物理网络 · 链路速率未读取");
  assert.equal(status.hardware.network.model.observed_at_unix, 10); assert.equal(status.hardware.network.link_speed_bps.observed_at_unix, 20);
  assert.equal(status.hardware.volumes[0].filesystem.value, "ReFS");
});

test("processor metrics accept native display fields and retain voltage measurement basis", () => {
  const source = { status: "ok", observed_at_unix: 123, timestamp_basis: "sample", source: "synthetic sensor" };
  const adapted = adaptStatus({ hardware: { cpu: { power_w: 65, temperature_c: 52, frequency_mhz: 4800, voltage_v: 1.15, voltage_basis: "VID", sources: { voltage_v: source } }, gpus: [{ power_watts: 80, temperature_celsius: 45, frequency_mhz: 2200, voltage_v: 1.02, voltage_basis: "GPU core voltage" }] } });
  assert.equal(adapted.hardware.cpu.power_w, 65); assert.equal(adapted.hardware.cpu.temperature_c, 52);
  assert.equal(adapted.hardware.cpu.voltage_v.value, 1.15); assert.equal(adapted.hardware.cpu.voltage_basis, "VID");
  assert.equal(adapted.hardware.gpus[0].power_w, 80); assert.equal(adapted.hardware.gpus[0].temperature_c, 45);
  assert.equal(adapted.hardware.gpus[0].frequency_mhz, 2200);
});

test("new telemetry groups retain units and per-field observation evidence", () => {
  const source = { status: "ok", source: "synthetic provider", observed_at_unix: 100, timestamp_basis: "provider_read", sample_time_known: false };
  const result = adaptStatus({ hardware: {
    memory: { committed_bytes: 123, commit_limit_bytes: 456, sources: { committed_bytes: source, commit_limit_bytes: source } },
    display: { model: "Synthetic monitor", width_px: 3840, height_px: 2160, refresh_hz: 144, bits_per_channel: 10, sources: { width_px: source, refresh_hz: source } },
    network: { latency_ms: 12.5, jitter_ms: 0.8, packet_loss_percent: 1, sources: { latency_ms: source, jitter_ms: source, packet_loss_percent: source } },
    health: { dpc_usage_percent: 0.3, sources: { dpc_usage_percent: source } },
  } });
  assert.equal(result.hardware.memory.committed_bytes.value, 123); assert.equal(result.hardware.memory.commit_limit_bytes.value, 456);
  assert.equal(result.hardware.display.refresh_hz.value, 144); assert.equal(result.hardware.display.refresh_hz.observed_at_unix, 100);
  assert.equal(result.hardware.network.latency_ms.value, 12.5); assert.equal(result.hardware.network.packet_loss_percent.value, 1);
  assert.equal(result.hardware.health.dpc_usage_percent.value, 0.3);
  assert.equal(result.hardware.health.sources.dpc_usage_percent.sample_time_known, false);
});

test("HTTP service failure retains status for friendly connection diagnosis without claiming a powered-off PC", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("upstream unavailable", { status: 502 });
  try { await assert.rejects(apiRequest("", "/status"), error => error.httpStatus === 502); }
  finally { globalThis.fetch = original; }
});

test("home and MCP summaries only offer links to the common authority page", async () => {
  for (const route of ["index.html", "mcp/index.html"]) {
    const html = await readFile(new URL(`../dist/${route}`, import.meta.url), "utf8");
    assert.ok(html.includes("data-access-summary")); assert.ok(html.includes("进入授权与状态")); assert.ok(html.includes('id="grafana-status"'));
    assert.ok(!html.includes('id="ca-totp"'));
  }
  const summary = await readFile(new URL("../app/computer-access-summary.jsx", import.meta.url), "utf8");
  assert.ok(!summary.includes('method: "POST"'));
});
