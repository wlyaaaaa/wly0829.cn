export const HOST_ORIGIN = "https://mcp.wly0829.cn";
export const API_PATH = "/computer-access/api";

export function beijingTime(unix, timeOnly = false) {
  if (!Number.isFinite(unix) || unix <= 0) return "时间未知";
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour12: false,
    ...(timeOnly ? {} : { year: "numeric", month: "2-digit", day: "2-digit" }),
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(new Date(unix * 1000)) + " 北京时间";
}

export function reductionAction(result) {
  if (["windows", "personal-data", "unrestricted"].includes(result?.action)) return result.action;
  if (result?.error === "public_windows_lock_result_unknown") return "windows";
  return null;
}

export function unresolvedAction(result) {
  return ["pending", "verifying", "unknown"].includes(result?.state);
}

export function successfulGrantSnapshot(snapshot, result) {
  if (result?.state !== "succeeded") return null;
  const parts = ["personal_data", "unrestricted"].filter(key => result[key] && result[key].state !== "not_requested");
  if (!parts.length || parts.some(key => result[key].state !== "succeeded" || !Number.isFinite(result[key].expires_at_unix) || result[key].expires_at_unix <= 0)) return null;
  const updated = { ...snapshot, state_version: "" }; // The next action waits for fresh authoritative versioning.
  for (const key of parts) updated[key] = { ...snapshot?.[key], state: key === "personal_data" ? "unlocked" : "active", expires_at_unix: result[key].expires_at_unix };
  return updated;
}

export function queryResultUpdate(previous, response, checkedAt, failed = false) {
  if (failed) return { ...previous, query_state: "failed", queried_at_unix: checkedAt };
  const unchanged = previous?.state === response?.state && previous?.error === response?.error;
  return { request_id: previous?.request_id, action: previous?.action, ...response, error: response?.error,
    query_state: unchanged ? "unchanged" : "updated", queried_at_unix: checkedAt };
}

export function reductionFailureResult(failure, requestId, action, lookupOnly = false) {
  const code = failure?.data?.error || "public_access_response_unknown";
  const beforeCreation = !lookupOnly && new Set([
    "public_state_changed", "public_lock_disabled", "public_windows_lock_disabled",
    "public_owner_end_disabled", "public_request_invalid", "public_origin_not_allowed",
    "public_request_rate_limited", "public_request_too_large",
  ]).has(code);
  return { ...failure?.data, request_id: requestId, action,
    state: beforeCreation ? "failed" : failure?.data?.state || "unknown", error: code,
    ...(beforeCreation ? { request_created: false } : {}), plaintext_returned: false };
}

// Decimal arithmetic keeps the preview identical to the authority's minute rounding.
export function durationMinutes(text) {
  const raw = String(text).trim();
  if (!/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/.test(raw) || raw.length > 48) return null;
  const [integer, fraction = ""] = raw.split(".");
  const whole = integer || "0";
  const scale = 10n ** BigInt(fraction.length);
  const value = BigInt(whole + fraction);
  if (value * 2n < scale || value > 72n * scale) return null;
  return Number((value * 120n + scale) / (2n * scale));
}

export function minutesLabel(minutes) {
  if (!Number.isFinite(minutes)) return "未知";
  return `${Math.floor(minutes / 60)}小时${Math.floor(minutes % 60)}分钟`;
}

export function remainingMinutes(grant, now) {
  if (!grant || !["active", "unlocked"].includes(grant.state) || !Number.isFinite(grant.expires_at_unix)) return null;
  return Math.max(0, Math.ceil((grant.expires_at_unix - now) / 60));
}

export function grantLabel(grant, now) {
  if (!grant) return "状态未知";
  const remaining = remainingMinutes(grant, now);
  if (remaining !== null) return remaining > 0 ? `剩余 ${minutesLabel(remaining)}` : "已到期 · 等待主机确认";
  return ({ locked: "资料已锁定", inactive: "未开启", expired: "已到期", revoked: "已撤销", opening: "正在准备资料", closing: "正在关闭资料", error: "资料状态异常", partial: "部分完成", failed: "操作未完成", unavailable: "暂不可用", unknown: "状态未知" })[grant.state] || "状态未知";
}

export function isHostOrigin(origin) { return origin === HOST_ORIGIN; }

export function hostFormUrl({ purpose, combined, hours, saveDefault = false }) {
  const url = new URL("/computer-access/", HOST_ORIGIN);
  url.searchParams.set("purpose", purpose);
  url.searchParams.set("combined", combined ? "1" : "0");
  url.searchParams.set("hours", hours);
  url.searchParams.set("save_default", saveDefault ? "1" : "0");
  url.hash = "access-form";
  return url.href;
}

export function reading(value, unit = "", digits = 1) {
  const sample = value && typeof value === "object" ? value : { value };
  if (sample.state === "disconnected") return "未连接";
  if (sample.state === "unavailable") return "不可用";
  if (sample.state === "unknown" || sample.value === null || sample.value === undefined) return "暂无数据";
  const label = typeof sample.value === "number" ? Number.isFinite(sample.value) ? sample.value.toLocaleString("zh-CN", { maximumFractionDigits: digits }) : "未知" : String(sample.value);
  return `${label}${unit}${sample.state === "stale" ? "（已过期）" : ""}`;
}

export function numeric(value) {
  const number = value && typeof value === "object" ? value.value : value;
  return typeof number === "number" && Number.isFinite(number) ? number : null;
}

export function capacity(bytes) {
  const value = numeric(bytes);
  if (value === null) return reading(bytes);
  const label = value >= 1024 ** 4 ? `${(value / 1024 ** 4).toFixed(2)} TiB` : `${(value / 1024 ** 3).toFixed(1)} GiB`;
  return label + (bytes?.state === "stale" ? "（已过期）" : "");
}

export function rate(value) {
  const number = numeric(value);
  return number === null ? reading(value) : reading({ value: number / 1024 ** 2, state: value?.state }, " MiB/s", 2);
}

export function hardwareBasis(value, kind) {
  const raw = value && typeof value === "object" ? value.value : value;
  if (!raw || raw === "unavailable") return "暂未取得口径";
  const descriptions = {
    "LHM core average clock": "各核心当前频率的平均值",
    "lowest-metric active physical IPv4 default route; tunnels excluded": "当前优先使用的物理网络出口，不重复累计隧道流量",
    "physical default-route interface; tunnel adapters excluded": "当前物理网络出口，不重复累计隧道流量",
    "associated physical disk aggregate; shared across its volumes": "所属物理盘的总读写速率，同盘各卷共用这一读数",
  };
  if (descriptions[raw]) return descriptions[raw];
  if (/[\u3400-\u9fff]/.test(raw)) return raw;
  return kind === "network" ? "系统出口速率；详细接口口径暂未识别" : "当前频率；详细测量口径暂未识别";
}

const retryableFactorErrors = new Set(["totp_verification_failed", "public_totp_cooldown", "public_totp_format_invalid", "public_totp_not_ready", "public_request_expired", "public_state_changed"]);
export function canRetryVerification(result) {
  return Boolean(result && ["failed", "expired"].includes(result.state) && retryableFactorErrors.has(result.error)
    && ![result.personal_data?.state, result.unrestricted?.state].some(state => ["succeeded", "unknown"].includes(state)));
}

// A single user submit retains the server's create -> verify binding. Cancellation
// waits for create when necessary, and suppresses the old verification response.
export function createGrantAttempt({ requestId, body, api, onCreated }) {
  let createdPromise, current, cancelled = false, code = "", cancelPromise;
  const rejectedBeforeCreation = failure => new Set([
    "public_state_changed", "public_totp_cooldown", "public_totp_not_ready",
    "public_duration_total_exceeds_72_hours", "personal_access_duration_hours_invalid",
    "public_request_capacity", "public_request_invalid", "public_origin_not_allowed",
  ]).has(failure?.data?.error);
  const rejectedResult = (failure, cancel = false) => ({
    schema: "pcconfig.public-access-result.v1", request_id: requestId,
    state: cancel ? "cancelled" : "failed", status: cancel ? "pass" : "blocked",
    ...(cancel ? { reason: failure.data.error } : { error: failure.data.error }),
    request_created: false, factor_submitted: false, plaintext_returned: false,
  });
  return {
    async run(input) {
      code = input;
      createdPromise = api("/requests", { method: "POST", body: { ...body, request_id: requestId } });
      try { current = await createdPromise; }
      catch (failure) {
        code = "";
        if (rejectedBeforeCreation(failure)) return cancelled ? null : rejectedResult(failure);
        throw failure;
      }
      onCreated(current);
      if (cancelled) { code = ""; return null; }
      if (current.state !== "pending" || !current.csrf_token || current.request_id !== requestId) {
        code = "";
        return ["failed", "expired", "cancelled", "succeeded", "partial"].includes(current.state)
          ? current : { ...current, state: "unknown", error: "public_access_response_unknown" };
      }
      const submitted = code;
      code = "";
      const result = await api(`/requests/${encodeURIComponent(current.request_id)}/verify`, {
        method: "POST", csrf: current.csrf_token, body: { totp: submitted }, timeout: 30000,
      });
      return cancelled ? null : result;
    },
    cancel() {
      cancelled = true;
      code = "";
      if (!cancelPromise) cancelPromise = (async () => {
        let prepared;
        try { prepared = current || await createdPromise; }
        catch (failure) {
          if (rejectedBeforeCreation(failure)) return rejectedResult(failure, true);
          throw failure;
        }
        if (["failed", "expired", "cancelled", "succeeded", "partial"].includes(prepared.state)) return prepared;
        return api(`/requests/${encodeURIComponent(prepared.request_id)}/cancel`, { method: "POST", csrf: prepared.csrf_token, body: {} });
      })();
      return cancelPromise;
    },
  };
}

// One translation boundary for the host's public hardware schema.
export function adaptStatus(data) {
  const hardware = data.hardware || {};
  function group(raw = {}, aliases = {}) {
    const converted = { ...raw };
    for (const [field, source] of Object.entries(raw.sources || {})) {
      converted[field] = { value: raw[field], state: source.status, source: source.source, observed_at_unix: source.observed_at_unix, timestamp_basis: source.timestamp_basis };
    }
    for (const [target, source] of Object.entries(aliases)) converted[target] = converted[source];
    const staticFields = new Set(["model", "cores", "threads", "installed_bytes", "total_bytes", "vram_total_bytes", "frequency_basis", "basis", "interface_basis", "physical_disks", "type", "letter"]);
    const dynamicSources = Object.entries(raw.sources || {}).filter(([field]) => !staticFields.has(field)).map(([, source]) => source);
    const times = dynamicSources.map(source => source.observed_at_unix).filter(Number.isFinite);
    // The group describes its newest dynamic read, while per-field evidence below
    // retains older or unknown samples instead of laundering them through this time.
    converted.observed_at_unix = times.length ? Math.max(...times) : raw.observed_at_unix;
    converted.timestamp_basis = dynamicSources.some(source => source.timestamp_basis === "provider_read") ? "provider_read" : "sample";
    converted.state = dynamicSources.some(source => source.status === "stale") ? "stale" : raw.state;
    return converted;
  }
  return { ...data, hardware: {
    ...hardware,
    cpu: group(hardware.cpu, { temperature_c: "temperature_celsius", power_w: "power_watts" }),
    gpus: (hardware.gpus || []).map(gpu => group(gpu, { temperature_c: "temperature_celsius", power_w: "power_watts", memory_used_bytes: "vram_used_bytes", memory_total_bytes: "vram_total_bytes" })),
    memory: group(hardware.memory, { installed_total_bytes: "installed_bytes", usable_total_bytes: "total_bytes" }),
    network: group(hardware.network),
    volumes: (hardware.volumes || []).map(volume => ({ ...group(volume), drive: volume.letter, kind: volume.type, state: volume.connected === false ? "disconnected" : volume.state || volume.status,
      mapping: volume.physical_disks?.length ? volume.physical_disks.map(disk => `${disk.model || "型号未知"} · ${capacity(disk.capacity_bytes)}`).join("；") : volume.type === "ramdisk" ? "内存盘 · 不计入物理盘容量" : volume.type === "virtual" ? "虚拟盘 · 底层映射未知" : "物理盘映射未知",
    })),
  } };
}

export const errorMessages = {
  public_state_changed: "授权、开机或配置状态已变化。请查看最新状态，再决定是否重新办理。",
  public_request_expired: "本次请求已到期，已有授权保持原期限。",
  public_totp_format_invalid: "请输入完整的6位动态验证码，保留开头的0。",
  totp_verification_failed: "动态验证码不正确。本次未完成，已有授权保持原期限。",
  public_totp_cooldown: "验证暂不可用（冷却中），请等候显示的可重试时间。已有授权不受影响。",
  public_totp_not_ready: "主机验证器暂不可用，请稍后重新检查。",
  public_access_busy: "主机正在处理另一项操作，请查看当前状态，稍后手动重试。",
  public_access_entry_failed: "主机办理服务发生故障，尚未确认授权成功。请查询本次结果。",
  public_access_response_unknown: "提交结果暂无法确认。请查询本次结果，不要重复提交。",
  public_lock_disabled: "公网资料锁定入口已停用。",
  public_windows_lock_disabled: "公网Windows锁屏入口已停用。",
  public_owner_end_disabled: "公网结束无限制授权入口已停用。",
  public_action_result_unknown: "本次结果暂无法确认。请查询原请求，不要重复提交。",
  public_windows_lock_not_executed: "本次未执行Windows锁屏，请刷新状态后手动重试。",
  interactive_screen_lock_request_failed: "Windows未接受本次锁屏请求，请检查当前桌面状态。",
  interactive_screen_lock_status_unavailable: "暂时无法读取Windows桌面状态，本次未执行锁屏。",
  interactive_screen_lock_status_invalid: "Windows桌面状态读取异常，本次未执行锁屏。",
  interactive_screen_lock_status_unknown: "Windows桌面状态尚不明确，本次未执行锁屏。",
  interactive_screen_lock_session_unknown: "暂时无法确定Windows交互桌面，本次未执行锁屏。",
  public_windows_lock_result_unknown: "Windows锁屏结果暂无法确认。可查询这次结果，其他独立操作仍按当前主机状态办理。",
  public_windows_lock_not_executed: "主机确认本次没有执行Windows锁屏。请查看当前屏幕状态后再决定是否重试。",
  interactive_screen_lock_noninteractive: "当前没有可锁定的交互桌面，未完成Windows锁屏。",
  interactive_screen_lock_unavailable: "Windows锁屏服务暂不可用，未确认锁屏成功。",
  public_duration_total_exceeds_72_hours: "办理后剩余超过72小时，请减少本次时长。",
  cooldown: "验证暂不可用（冷却中）。已有授权保持原期限。",
  invalid_totp: "动态验证码不正确，请核对验证器后手动重试。",
  factor_unavailable: "主机验证器暂不可用，请稍后重新检查。",
  state_conflict: "主机状态已变化。请重新查看当前状态，再明确办理。",
  state_version_mismatch: "主机状态已变化。请重新查看当前状态，再明确办理。",
  duration_limit: "办理后剩余时间超过72小时，请减少本次时长。",
  expired: "本次请求已到期，原有授权不受影响。",
  cancelled: "本次办理已取消，原有授权不受影响。",
  disabled: "此操作已由主机停用。",
};

export async function apiRequest(base, path, { method = "GET", body, csrf, signal, timeout = 10000 } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, timeout);
  try {
    const response = await fetch(`${base}${API_PATH}${path}`, {
      method, cache: "no-store", credentials: "include", signal: controller.signal,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(csrf ? { "X-CSRF-Token": csrf } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok || (data.status === "error" && !data.request_id)) {
      const error = new Error(errorMessages[data.code || (typeof data.error === "string" ? data.error : data.error?.code) || data.reason] || "主机暂未完成此操作，请查看当前状态。");
      error.data = data;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

// One in-flight status request. An operation invalidates the old read before its readback.
export function createStatusReader(fetchStatus, onSuccess, onFailure) {
  let active = null;
  let generation = 0;
  return {
    async read({ replace = false } = {}) {
      if (active && !replace) return;
      if (active) active.abort();
      const controller = new AbortController();
      const current = ++generation;
      active = controller;
      try {
        const result = await fetchStatus(controller.signal);
        if (current === generation) onSuccess(result);
      } catch (error) {
        if (current === generation && !controller.signal.aborted) onFailure(error);
      } finally { if (current === generation) active = null; }
    },
    invalidate() { generation++; active?.abort(); active = null; },
  };
}
