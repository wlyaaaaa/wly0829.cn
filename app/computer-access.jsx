import React, { useEffect, useRef, useState } from "react";
import { ArrowClockwise, ArrowRight, Cpu, Desktop, Gauge, HardDrives, LockKey, Memory, ShieldCheck, User, Infinity as InfinityIcon, WifiHigh } from "@phosphor-icons/react";
import { HOST_ORIGIN, adaptStatus, apiRequest, beijingTime, capacity, canRetryVerification, createGrantAttempt, createStatusReader, durationMinutes, errorMessages, grantLabel, hardwareBasis, isAccessOrigin, isHostOrigin, minutesLabel, numeric, queryResultUpdate, rate, reading, reductionAction, reductionFailureResult, remainingMinutes, successfulGrantSnapshot, successfulReductionSnapshot, unresolvedAction } from "./computer-access-model.js";

function SampleTime({ sample }) {
  const observed = sample?.observed_at_unix;
  return <small className="ca-sample">{observed ? `${sample.timestamp_basis === "provider_read" ? "读取" : "采样"} ${beijingTime(observed, true)}` : "尚无采样"}{sample?.timestamp_basis === "provider_read" ? " · 样本时间未知" : ""}{sample?.state === "stale" ? " · 数据已过期" : sample?.state === "unavailable" ? " · 来源暂不可用" : ""}</small>;
}

function Meter({ used, total = 100, label }) {
  const value = numeric(used), max = numeric(total);
  return <div className="ca-meter" role={value !== null && max > 0 ? "meter" : undefined} aria-label={label} aria-valuenow={value !== null && max > 0 ? value : undefined} aria-valuemin={0} aria-valuemax={max > 0 ? max : undefined}><span style={{ width: value !== null && max > 0 ? `${Math.max(0, Math.min(100, value / max * 100))}%` : "0%" }} /></div>;
}

function Facts({ items }) { return <dl className="ca-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>; }

function ReadingSources({ sample, compact = false, note = null }) {
  const labels = { model: "型号", cores: "核心数", threads: "线程数", usage_percent: "使用率", temperature_celsius: "温度", power_watts: "功耗", frequency_mhz: "频率", vram_used_bytes: "已用显存", vram_total_bytes: "显存总量", installed_bytes: "安装内存", total_bytes: "系统可用总量／卷容量", used_bytes: "已用容量", available_bytes: "当前可用内存", free_bytes: "剩余容量", upload_bytes_per_second: "上传速率", download_bytes_per_second: "下载速率", read_bytes_per_second: "读取速率", write_bytes_per_second: "写入速率" };
  const sources = Object.entries(sample?.sources || {}).filter(([field]) => labels[field]);
  if (!sources.length) return null;
  return <details className="ca-source-details"><summary>{compact ? <><SampleTime sample={sample} /><span> · 来源</span></> : "查看读数来源与时间"}</summary>{note && <p className="ca-footnote">{note}</p>}<dl>{sources.map(([field, source]) => <div key={field}><dt>{labels[field]}</dt><dd>{source.source || "来源未知"} · {source.status === "unknown" ? "暂无读数" : source.status === "stale" ? "读数已过期" : source.status === "unavailable" ? "来源不可用" : "已读取"}<br />{source.observed_at_unix ? `${source.timestamp_basis === "provider_read" ? "读取于" : "采样于"} ${beijingTime(source.observed_at_unix)}` : "时间未知"}{source.timestamp_basis === "provider_read" ? "；实际样本时间未知" : ""}</dd></div>)}</dl></details>;
}

function Hardware({ hardware = {}, host = {} }) {
  const cpu = hardware.cpu || {}, memory = hardware.memory || {};
  const gpus = hardware.gpus?.length ? hardware.gpus : [{}];
  const volumes = hardware.volumes || [];
  const kindLabel = kind => ({ ssd: "固态", hdd: "机械", removable: "可移动", virtual: "虚拟盘", ramdisk: "内存盘", fixed: "固定卷", network: "网络卷", optical: "光盘" })[kind] || "类型未知";
  return <section className="ca-card ca-resources" aria-labelledby="ca-hardware-title">
    <div className="ca-section-title"><h2 id="ca-hardware-title">系统资源状态</h2><div className="ca-system-line"><span>{host.windows_version || "Windows版本未知"}</span><span><Desktop size={14} />{({ locked: "已锁屏", unlocked: "未锁屏", no_session: "无交互桌面" })[host.screen_state] || "屏幕状态未知"}</span><span>已运行 {Number.isFinite(host.uptime_seconds) ? minutesLabel(Math.floor(host.uptime_seconds / 60)) : "未知"}</span><details className="ca-boot-details"><summary>本轮开机与更新时间</summary><p>本轮开机：{beijingTime(host.boot_time_unix)}。下方每组保留实际读取时间；读取成功不等于传感器样本时间已知。</p></details></div></div>
    <div className="ca-resource-grid">
      <article className="ca-hardware-card"><div className="ca-hardware-heading"><span className="ca-icon"><Cpu size={25} /></span><div><h3>处理器</h3><p className="ca-model">{reading(cpu.model)}</p><small>{reading(cpu.cores)} 核 · {reading(cpu.threads)} 线程</small></div></div><div className="ca-primary-reading"><strong>{reading(cpu.usage_percent, "%")}</strong></div><Meter used={cpu.usage_percent} label="CPU使用率" /><div className="ca-inline-stats"><span>{reading(cpu.temperature_c, " °C")}</span><span>{reading(cpu.power_w, " W")}</span><span>{reading(cpu.frequency_mhz, " MHz")}</span></div><ReadingSources sample={cpu} compact note={hardwareBasis(cpu.frequency_basis, "frequency")} /></article>
      {gpus.map((gpu, index) => <article className="ca-hardware-card" key={index}><div className="ca-hardware-heading"><span className="ca-icon"><Gauge size={25} /></span><div><h3>显卡{gpus.length > 1 ? ` ${index + 1}` : ""}</h3><p className="ca-model">{reading(gpu.model)}</p></div></div><div className="ca-primary-reading"><strong>{reading(gpu.usage_percent, "%")}</strong></div><Meter used={gpu.usage_percent} label="显卡使用率" /><div className="ca-inline-stats"><span>{reading(gpu.temperature_c, " °C")}</span><span>{reading(gpu.power_w, " W")}</span></div><p className="ca-vram">显存 <strong>{capacity(gpu.memory_used_bytes)} / {capacity(gpu.memory_total_bytes)}</strong></p><ReadingSources sample={gpu} compact /></article>)}
      <article className="ca-hardware-card"><div className="ca-hardware-heading"><span className="ca-icon"><Memory size={25} /></span><h3>内存</h3></div><div className="ca-primary-reading ca-memory-reading"><span>已用</span><strong>{capacity(memory.used_bytes)}</strong></div><Meter used={memory.used_bytes} total={memory.usable_total_bytes} label="物理内存占用" /><Facts items={[["已安装", capacity(memory.installed_total_bytes)], ["Windows可用物理总量", capacity(memory.usable_total_bytes)], ["当前剩余", capacity(memory.available_bytes)]]} /><ReadingSources sample={memory} compact /></article>
    </div>
    <section className="ca-storage" aria-labelledby="ca-storage-title"><div className="ca-card-heading"><HardDrives size={20} /><h3 id="ca-storage-title">存储空间</h3><span>虚拟盘与内存盘单独标记</span></div>
      {volumes.length ? <div className="ca-volume-table"><div className="ca-volume-columns" aria-hidden="true"><span>卷</span><span>类型</span><span>已用 / 总量</span><span>剩余</span><span>占用</span><span /></div>{volumes.map((volume, index) => { const used=numeric(volume.used_bytes), total=numeric(volume.total_bytes); const percent=used !== null && total > 0 ? Math.round(used / total * 100) : null; return <details className="ca-volume" key={volume.drive || index}><summary><strong><HardDrives size={15} />{volume.drive || "未知卷"}</strong><span className="ca-volume-kind">{kindLabel(volume.kind)}{volume.state === "disconnected" ? " · 未连接" : ""}</span><span className="ca-volume-size">{volume.state === "disconnected" ? "暂无容量" : `${capacity(volume.used_bytes)} / ${capacity(volume.total_bytes)}`}</span><span className="ca-volume-free">{volume.state === "disconnected" ? "未知" : capacity(volume.free_bytes)}</span><span className="ca-volume-bar"><Meter used={volume.state === "disconnected" ? null : volume.used_bytes} total={volume.total_bytes} label={`${volume.drive || "卷"}占用`} /><small>{percent === null || volume.state === "disconnected" ? "—" : `${percent}%`}</small></span><span className="ca-chevron" aria-hidden="true">›</span></summary><div className="ca-volume-detail"><p>{volume.mapping || "物理盘映射未知"}</p><div className="ca-inline-stats"><span>温度 {reading(volume.temperature_celsius, " °C")}</span><span>读取 {rate(volume.read_bytes_per_second)}</span><span>写入 {rate(volume.write_bytes_per_second)}</span></div><p className="ca-footnote">同一物理盘上的卷共用物理盘速率，容量不重复累计。</p><SampleTime sample={volume} /><ReadingSources sample={volume} /></div></details>; })}</div> : <p className="ca-empty">尚未取得卷列表。连接后显示全部可见卷及已登记外接盘。</p>}
      <p className="ca-footnote ca-storage-note">容量统一为 GiB / TiB。展开任一卷可查看物理盘映射、温度、读写与来源。</p>
    </section>

  </section>;
}

function NetworkCard({ network = {} }) {
  return <section className="ca-card ca-network-card" aria-label="网络状态">
    <section className="ca-network-strip" aria-label="网络"><div><WifiHigh size={19} /><h3>网络</h3></div><span>↑ 上传 <strong>{rate(network.upload_bytes_per_second)}</strong></span><span>↓ 下载 <strong>{rate(network.download_bytes_per_second)}</strong></span><a href="https://grafana.wly0829.cn/" target="_blank" rel="noopener noreferrer">更多历史 · Grafana <ArrowRight size={14} /></a></section><div className="ca-network-meta"><p>{hardwareBasis(network.interface_basis || network.basis, "network")}</p><SampleTime sample={network} /><ReadingSources sample={network} /></div>
  </section>;
}

function QueryFeedback({ item, loading = false }) {
  if (loading) return <p className="ca-query-feedback" role="status">正在查询原请求，请稍候…</p>;
  if (!item?.query_state) return null;
  return <p className={`ca-query-feedback${item.query_state === "failed" ? " ca-query-failed" : ""}`} role="status">{item.query_state === "failed" ? "本次查询未完成，保留上次结果；可稍后再次查询。" : item.query_state === "unchanged" ? `已查询，结果仍为“${resultStates[item.state] || "结果待确认"}”。` : `已查到新结果：“${resultStates[item.state] || "结果待确认"}”。`}<small>{beijingTime(item.queried_at_unix, true)}</small></p>;
}

function GrantCard({ title, grant, now, current, description, onChoose, enabled, purpose, onEnd, endEnabled }) {
  const active = current && remainingMinutes(grant, now) > 0;
  const Icon = purpose === "personal_data" ? User : InfinityIcon;
  return <section className={`ca-card ca-grant${active ? " ca-grant-active" : ""}`}><span className="ca-grant-icon"><Icon size={29} /></span><div className="ca-grant-copy"><h3>{title}</h3><strong className="ca-grant-state">{current ? grantLabel(grant, now) : "当前状态未知"}</strong>{!current && grant && <small>上次观测：{grantLabel(grant, now)}</small>}<p>{description}</p></div><div className="ca-grant-actions"><button className="ca-button ca-button-secondary" type="button" aria-label={`${active ? "延长" : "开启"}${title}`} disabled={!enabled} onClick={() => onChoose(purpose)}>{active ? "延长" : purpose === "personal_data" ? "解锁" : "开启"}</button><button className="ca-button ca-end-button" type="button" aria-label={purpose === "personal_data" ? "锁定个人资料" : "结束无限制授权"} disabled={!endEnabled} onClick={onEnd}>{purpose === "personal_data" ? "锁定" : "结束"}</button></div></section>;
}

const resultStates = { succeeded: "已完成", success: "已完成", active: "已生效", unlocked: "资料已解锁", locked: "资料已锁定", failed: "未完成", unavailable: "暂不可用", pending: "等待确认", verifying: "验证中", cancelled: "已取消", expired: "本次请求已到期", partial: "部分完成", unknown: "结果待确认", closing: "正在关闭资料" };
function Result({ result }) {
  if (!result) return null;
  return <div className="ca-result" role="status"><strong>{result.title || (result.personal_data?.state === "closing" ? "资料正在关闭" : resultStates[result.state || result.status]) || "结果待确认"}</strong>{result.message && <p>{result.message}</p>}{result.default_saved === true && <p>已保存为以后默认；已有授权截止保持不变。</p>}{result.default_saved === false && <p>本次授权结果如下，但默认时长未保存。</p>}{result.error && <p>{errorMessages[result.error] || "主机暂未完成此操作，请查询本次结果。"}</p>}{["personal_data", "unrestricted"].map(key => result[key] && result[key].state !== "not_requested" ? <p key={key}>{key === "personal_data" ? "个人资料" : "无限制授权"}：{resultStates[result[key].state || result[key].status] || "结果待确认"}{result[key].reason && errorMessages[result[key].reason] ? ` · ${errorMessages[result[key].reason]}` : ""}</p> : null)}</div>;
}

export default function ComputerAccess() {
  const [snapshot, setSnapshot] = useState(null), [connection, setConnection] = useState("connecting"), [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(0), [hostMode, setHostMode] = useState(false), [formAllowed, setFormAllowed] = useState(false);
  const [purpose, setPurpose] = useState("personal_data"), [combined, setCombined] = useState(false), [hours, setHours] = useState("8"), [formOpen, setFormOpen] = useState(true), [saveDefault, setSaveDefault] = useState(false);
  const [totp, setTotp] = useState(""), [request, setRequest] = useState(null), [busy, setBusy] = useState(false), [result, setResult] = useState(null), [error, setError] = useState(""), [lookupOnly, setLookupOnly] = useState(false);
  const [actionRequests, setActionRequests] = useState([]), [actionBusy, setActionBusy] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const actionPending = useRef(false);
  const reader = useRef(null), touched = useRef(false), operation = useRef(false), formRef = useRef(null), mounted = useRef(false);
  const base = hostMode ? "" : HOST_ORIGIN;
  useEffect(() => {
    mounted.current = true;
    const onHost = isHostOrigin(window.location.origin);
    setHostMode(onHost); setFormAllowed(isAccessOrigin(window.location.origin, window.top === window.self)); setNow(previous => Math.max(previous, Date.now() / 1000));
    let savedId;
    try {
      savedId = sessionStorage.getItem("p6-request-id");
      const savedActions = JSON.parse(sessionStorage.getItem("p6-action-requests") || "[]");
      if (Array.isArray(savedActions)) {
        const retained = savedActions.filter(item => item.state !== "succeeded" && reductionAction(item) && /^[a-zA-Z0-9_-]{8,100}$/.test(item.request_id || ""));
        setActionRequests(retained);
        sessionStorage.setItem("p6-action-requests", JSON.stringify(retained));
      }
    } catch {}
    const restoredParams = new URLSearchParams(window.location.search);
    const restoredId = restoredParams.get("request") || restoredParams.get("request_id") || savedId;
    if (restoredId && /^[a-zA-Z0-9_-]{8,100}$/.test(restoredId)) {
      setRequest({ request_id: restoredId, state: "unknown" }); setLookupOnly(true); setFormOpen(true);
      apiRequest(onHost ? "" : HOST_ORIGIN, `/requests/${encodeURIComponent(restoredId)}`).then(data => { if (mounted.current) { const action = reductionAction(data); if (action) { acceptAction({ request_id: restoredId, ...data, action }); locateRequest(null); setRequest(null); setLookupOnly(false); } else { acceptResult(data); if (data.state === "succeeded") reader.current?.read({ replace: true }); } } }).catch(() => { if (mounted.current) setError("暂无法取得原请求结果，请手动查询；不要重新提交验证码。"); });
    }
    if (isAccessOrigin(window.location.origin)) {
      const params = new URLSearchParams(window.location.search);
      if (["personal_data", "unrestricted"].includes(params.get("purpose"))) {
        setSaveDefault(params.get("save_default") === "1"); setPurpose(params.get("purpose")); setCombined(params.get("combined") === "1"); setFormOpen(true);
        if (durationMinutes(params.get("hours")) !== null) { touched.current = true; setHours(params.get("hours")); }
      }
      // Selections are non-secret; clearing them prevents accidental replay on refresh.
      if (window.location.search && !restoredId) history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
    reader.current = createStatusReader(signal => { setRefreshing(true); return apiRequest(onHost ? "" : HOST_ORIGIN, "/status", { signal }); }, data => {
      if (!mounted.current) return;
      setRefreshing(false); setSnapshot(adaptStatus(data)); setConnection("online"); setNow(previous => Math.max(previous, Date.now() / 1000));
      if (!touched.current && Number.isFinite(data.default_minutes)) setHours(String(data.default_minutes / 60));
    }, () => { if (mounted.current) { setRefreshing(false); setConnection("offline"); } });
    let timer;
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(async () => { if (!operation.current && !actionPending.current) await reader.current.read(); schedule(); }, 60000); };
    const visible = () => { clearTimeout(timer); if (document.hidden) { reader.current.invalidate(); setRefreshing(false); } else { if (!operation.current && !actionPending.current) reader.current.read(); schedule(); } };
    reader.current.read(); schedule();
    document.addEventListener("visibilitychange", visible);
    const clock = setInterval(() => { if (!document.hidden) setNow(previous => Math.max(previous, Date.now() / 1000)); }, 15000);
    return () => { mounted.current = false; clearTimeout(timer); clearInterval(clock); reader.current.invalidate(); document.removeEventListener("visibilitychange", visible); };
  }, []);
  useEffect(() => { if (!successNotice) return; const timeout = setTimeout(() => setSuccessNotice(""), 8000); return () => clearTimeout(timeout); }, [successNotice]);
  const available = formAllowed && connection === "online" && Boolean(snapshot?.state_version);
  const minutes = durationMinutes(hours);
  const selectedActive = remainingMinutes(snapshot?.[purpose], now) > 0;
  const selectedKeys = combined ? ["personal_data", "unrestricted"] : [purpose];
  const overLimit = minutes !== null && selectedKeys.some(key => (remainingMinutes(snapshot?.[key], now) || 0) + minutes > 4320);
  const cooldownUntil = snapshot?.factor?.cooldown_until_unix || 0;
  const cooling = cooldownUntil > now;
  const factorAvailable = snapshot?.factor?.available === true && !cooling;
  const visibleError = request?.error === "public_totp_cooldown" && !cooling ? "上次提交遇到冷却。现在可重新输入验证码，点击办理按钮后才会重试。" : error;
  const retryable = canRetryVerification(request);
  const requestTerminal = request && ["succeeded", "success", "partial", "failed", "cancelled", "expired"].includes(request.state || request.status);
  function locateRequest(id) { try { if (id) sessionStorage.setItem("p6-request-id", id); else sessionStorage.removeItem("p6-request-id"); } catch {} const url = new URL(window.location.href); url.search = ""; if (id) url.searchParams.set("request", id); history.replaceState(null, "", url.pathname + url.search + url.hash); }
  function choose(nextPurpose) { setRequestQuery(null); locateRequest(null); setLookupOnly(false); setPurpose(nextPurpose); setCombined(false); setSaveDefault(false); setFormOpen(true); setResult(null); setError(""); setRequest(null); setTotp(""); touched.current = true; setTimeout(() => formRef.current?.focus({ preventScroll: false }), 0); }
  const responseSerial = useRef(0), attemptRef = useRef(null);
  const [cancelling, setCancelling] = useState(false);
  const [checkingRequest, setCheckingRequest] = useState(false), [requestQuery, setRequestQuery] = useState(null), [queryingActionId, setQueryingActionId] = useState("");
  function acceptResult(value, freshPost = false) {
    if (value.state === "succeeded") {
      if (freshPost) setSnapshot(previous => successfulGrantSnapshot(previous, value, true) || previous);
      setNow(previous => Math.max(previous, Date.now() / 1000)); setTotp(""); setRequest(null); setRequestQuery(null);
      setResult(null); setLookupOnly(false); setFormOpen(true); setCombined(false); setSaveDefault(false); setError(""); locateRequest(null);
      setSuccessNotice(freshPost ? (value.default_saved === false ? "办理成功；默认时长未保存。" : "办理成功。") : "已确认这次办理当时成功，当前授权以最新状态为准。");
      return;
    }
    if (value.request_created === false) locateRequest(null);
    setRequest(previous => ({ ...previous, ...value, error: value.error }));
    setResult(value);
    setLookupOnly(!canRetryVerification(value));
    setTotp("");
    if (Number.isFinite(value.cooldown_until_unix)) setSnapshot(previous => previous ? { ...previous, factor: { ...previous.factor, cooldown_until_unix: value.cooldown_until_unix } } : previous);
    setError(value.error ? errorMessages[value.error] || "主机暂未完成此操作，请查询本次结果。" : "");
  }
  async function act(action) {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError(""); reader.current.invalidate(); setRefreshing(false);
    const serial = ++responseSerial.current;
    try { await action(serial); }
    catch (failure) {
      if (serial !== responseSerial.current) return;
      if (failure.data) {
        const candidate = { ...failure.data, state: failure.data.state || "failed" };
        acceptResult(canRetryVerification(candidate) || failure.data.state ? candidate : { ...candidate, state: "unknown" });
      } else {
        setRequest(previous => previous ? { ...previous, state: "unknown" } : previous);
        setLookupOnly(true);
        setError("提交结果暂无法确认。请查询本次结果，不要重复提交验证码或锁定动作。");
      }
    } finally {
      if (serial === responseSerial.current) {
        operation.current = false; setBusy(false); attemptRef.current = null;
        reader.current.read({ replace: true });
      }
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || cancelling || actionBusy || !available || minutes === null || overLimit || !factorAvailable || (request && !retryable)) return;
    if (!formAllowed) return;
    if (!/^\d{6}$/.test(totp)) { setError("请输入验证器中的6位动态验证码，保留开头的0。"); return; }
    const code = totp;
    setTotp(""); setResult(null); setRequestQuery(null);
    await act(async serial => {
      const id = crypto.randomUUID();
      setRequest({ request_id: id, state: "pending" }); locateRequest(id);
      const attempt = createGrantAttempt({
        requestId: id,
        body: { purpose, combined, save_default: saveDefault, duration_hours: hours, state_version: snapshot.state_version },
        api: (path, options) => apiRequest(base, path, options),
        onCreated: created => { if (serial === responseSerial.current) setRequest({ ...created, state: "verifying" }); },
      });
      attemptRef.current = attempt;
      const verified = await attempt.run(code);
      if (serial === responseSerial.current && verified) acceptResult(verified, true);
    });
  }
  async function cancel() {
    if (!formAllowed || cancelling) return;
    if (!request || requestTerminal) {
      locateRequest(null); setLookupOnly(false); setFormOpen(Boolean(requestTerminal)); setCombined(false); setSaveDefault(false);
      setTotp(""); setRequest(null); setError("");
      if (!requestTerminal) setResult({ title: "本次办理已取消", message: "原有授权保持原期限。" });
      return;
    }
    const serial = ++responseSerial.current;
    setCancelling(true); setTotp(""); reader.current.invalidate(); setRefreshing(false);
    try {
      let cancelled;
      if (attemptRef.current) cancelled = await attemptRef.current.cancel();
      else {
        const current = request.csrf_token ? request : await apiRequest(base, `/requests/${encodeURIComponent(request.request_id)}`);
        cancelled = await apiRequest(base, `/requests/${encodeURIComponent(request.request_id)}/cancel`, { method: "POST", csrf: current.csrf_token, body: {} });
      }
      if (serial === responseSerial.current) acceptResult(cancelled);
    } catch {
      if (serial === responseSerial.current) { setLookupOnly(true); setRequest(previous => ({ ...previous, state: "unknown" })); setError("取消结果暂无法确认。请查询本次结果，不要重新提交验证码。"); }
    } finally {
      if (serial === responseSerial.current) {
        operation.current = false; attemptRef.current = null; setBusy(false); setCancelling(false);
        reader.current.read({ replace: true });
      }
    }
  }
  async function checkRequest() {
    if (!request || operation.current) return;
    setCheckingRequest(true);
    try {
      await act(async serial => {
        try {
          const status = await apiRequest(base, `/requests/${encodeURIComponent(request.request_id)}`);
          if (serial === responseSerial.current) { acceptResult(status); if (status.state !== "succeeded") setRequestQuery(queryResultUpdate(request, status, Date.now() / 1000)); }
        } catch {
          if (serial === responseSerial.current) setRequestQuery(queryResultUpdate(request, null, Date.now() / 1000, true));
        }
      });
    } finally { setCheckingRequest(false); }
  }
  function rememberAction(value) {
    setActionRequests(previous => {
      const next = [...previous.filter(item => item.request_id !== value.request_id && (item.action !== value.action || unresolvedAction(item))), ...(value.state === "succeeded" ? [] : [value])];
      try { sessionStorage.setItem("p6-action-requests", JSON.stringify(next.map(({ request_id, action, state, error }) => ({ request_id, action, state, error })))); } catch {}
      return next;
    });
  }
  function acceptAction(value, freshPost = false) {
    rememberAction(value);
    if (value.state !== "succeeded") return;
    if (freshPost) setSnapshot(previous => successfulReductionSnapshot(previous, value, true) || previous);
    setSuccessNotice(freshPost ? (value.action === "personal-data" ? value.personal_data?.state === "closing" ? "资料访问已结束，正在关闭资料。" : "个人资料已锁定。" : value.action === "unrestricted" ? "无限制授权已结束。" : "Windows锁屏已完成。") : "已确认这次操作当时完成，当前状态正在更新。");
  }
  async function lock(kind, priorId = null) {
    if (actionPending.current || busy || cancelling || (!priorId && request && !requestTerminal)) return;
    actionPending.current = true; setActionBusy(kind); setQueryingActionId(priorId || ""); reader.current.invalidate(); setRefreshing(false);
    const id = priorId || crypto.randomUUID();
    if (!priorId) rememberAction({ request_id: id, action: kind, state: "pending" });
    try {
      const response = await apiRequest(base, priorId ? `/requests/${encodeURIComponent(id)}` : `/locks/${kind}`, priorId ? {} : { method: "POST", body: { state_version: snapshot.state_version, request_id: id }, timeout: 15000 });
      acceptAction(priorId ? queryResultUpdate(actionRequests.find(item => item.request_id === id), { request_id: id, action: kind, ...response }, Date.now() / 1000) : { request_id: id, action: kind, ...response }, !priorId);
    } catch (failure) {
      rememberAction(priorId ? queryResultUpdate(actionRequests.find(item => item.request_id === id), null, Date.now() / 1000, true) : reductionFailureResult(failure, id, kind, false));
    } finally {
      actionPending.current = false; setActionBusy(""); setQueryingActionId("");
      reader.current.read({ replace: true });
    }
  }
  const actionEnabled = kind => available && !busy && !cancelling && !actionBusy && (!request || requestTerminal) && !actionRequests.some(item => item.action === kind && unresolvedAction(item));
  const host = snapshot?.host || {};
  const observed = snapshot?.observed_at_unix;
  return <div className="ca-page"><div className="ca-workspace"><div className="ca-overview">
    <header className="ca-intro"><h1>授权与状态</h1><span className={`ca-connection ca-connection-${connection}`}><span className="ca-dot" />{connection === "online" ? "主机在线" : connection === "connecting" ? "正在连接主机" : "电脑离线或暂时无法连接"}</span><span className="ca-updated">{observed ? `${connection === "offline" ? "上次观测" : "更新于"} ${beijingTime(observed, true)}` : "尚无主机数据"} · 每60秒更新</span><div className="ca-top-actions"><button className="ca-refresh" type="button" disabled={busy || Boolean(actionBusy) || refreshing} aria-busy={refreshing} onClick={() => reader.current?.read()}><ArrowClockwise size={17} />{refreshing ? "刷新中…" : connection === "offline" ? "重新检查" : "刷新状态"}</button><button className="ca-refresh ca-screen-lock" title="仅锁交互桌面，保留资料和无限制授权原期限" type="button" disabled={!actionEnabled("windows") || snapshot?.public_actions?.lock_windows !== true} onClick={() => lock("windows")}><Desktop size={17} />锁定Windows</button></div></header>
    {connection === "offline" && <p className="ca-notice" role="status">暂时无法确认主机状态。保留的上次观测不代表此刻状态；远程办理已暂停，页面会在前台自动重连，也可手动重新检查。</p>}
    <div className="ca-grants"><GrantCard title="个人资料" grant={snapshot?.personal_data} now={now} current={connection === "online"} purpose="personal_data" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="本机与已认证的电脑连接共用" endEnabled={actionEnabled("personal-data") && snapshot?.public_actions?.lock_data === true} onEnd={() => lock("personal-data")} /><GrantCard title="无限制授权" grant={snapshot?.unrestricted} now={now} current={connection === "online"} purpose="unrestricted" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="全局授权，与个人资料分别计时" endEnabled={actionEnabled("unrestricted") && snapshot?.public_actions?.end_unrestricted === true} onEnd={() => lock("unrestricted")} /></div>
    {successNotice && <p className="ca-success-notice" role="status">{successNotice}</p>}

    {actionRequests.length > 0 && <section className="ca-action-results" aria-label="操作结果">{actionRequests.map(item => <div className="ca-action-result" key={item.request_id} aria-busy={queryingActionId === item.request_id}><div><strong>{({ windows: "Windows锁屏", "personal-data": "锁定个人资料", unrestricted: "结束无限制授权" })[item.action]} · {resultStates[item.state] || "结果待确认"}</strong>{item.error && <p>{errorMessages[item.error] || (item.state === "failed" ? "主机已确认本次操作未完成，请按当前状态重新办理。" : "本次结果暂无法确认，请查询原请求。")}</p>}{unresolvedAction(item) && <p>保留这次请求等待核实；其他独立操作仍可按当前状态办理。</p>}<QueryFeedback item={item} loading={queryingActionId === item.request_id} />{!hostMode && <a href={`${HOST_ORIGIN}/computer-access/?request=${encodeURIComponent(item.request_id)}`} target="_blank" rel="noopener noreferrer">在主机查询此请求</a>}</div><button type="button" className="ca-refresh" disabled={Boolean(actionBusy) || busy} onClick={() => lock(item.action, item.request_id)}>{queryingActionId === item.request_id ? "查询中…" : "查询结果"}</button></div>)}</section>}
    <Hardware hardware={snapshot?.hardware} host={host} />
    <p className="ca-update-note">仅前台每60秒读取，回到前台立即检查；状态刷新不延长授权。</p>
    </div><aside className="ca-access" aria-label="本次办理">
      <section className="ca-card ca-form-card" id="access-form" tabIndex={-1} ref={formRef} aria-labelledby="ca-form-title"><h3 id="ca-form-title">{lookupOnly ? "查询本次结果" : formOpen ? purpose === "personal_data" ? selectedActive ? "延长个人资料授权" : "解锁个人资料" : selectedActive ? "延长无限制授权" : "开启无限制授权" : "选择上方功能开始办理"}</h3>{!formAllowed ? <p className="ca-footnote">请从<a href="https://wly0829.cn/computer-access/">正式授权页面</a>办理。</p> : !formOpen ? <p className="ca-footnote">时长可自由填写0.5～72小时。已有授权会在原期限上加时，两项始终各自计时。</p> : <form onSubmit={submit}>{request?.summary && !retryable && <div className="ca-duration-preview"><p>本次已绑定：{request.summary.targets?.map(key => key === "personal_data" ? "个人资料解锁" : key === "unrestricted" ? "全局无限制授权" : "未知办理项").join(" + ")}</p><p>本次时长：{minutesLabel(request.summary.minutes)}{request.summary.save_default ? " · 成功后设为以后默认" : ""}</p></div>}
        <fieldset hidden={lookupOnly} disabled={busy || cancelling || Boolean(request && !retryable)}><legend className="visually-hidden">本次办理内容</legend><div className="ca-purpose-buttons"><button type="button" aria-pressed={purpose === "personal_data"} onClick={() => setPurpose("personal_data")}>个人资料</button><button type="button" aria-pressed={purpose === "unrestricted"} onClick={() => setPurpose("unrestricted")}>无限制授权</button></div><label className="ca-combined"><input type="checkbox" role="switch" aria-label="本次同时建立无限制授权和个人资料解锁期" checked={combined} onChange={event => setCombined(event.target.checked)} /><span>同时{purpose === "personal_data" ? "办理无限制授权" : "解锁个人资料"}<small>一次验证，分别办理两项授权。</small></span></label><label className="ca-field-label" htmlFor="ca-hours">本次{selectedKeys.some(key => remainingMinutes(snapshot?.[key], now) > 0) ? "增加" : "授权"}时长 <span>小时</span></label><input className="ca-hours" id="ca-hours" inputMode="decimal" autoComplete="off" value={hours} onChange={event => { touched.current = true; setHours(event.target.value); }} aria-describedby="ca-duration-help" aria-invalid={minutes === null || overLimit} /><div className="ca-shortcuts">{[0.5, 2, 8, 24].map(value => <button type="button" key={value} onClick={() => { touched.current = true; setHours(String(value)); }}>{value}小时</button>)}</div><label className="ca-combined"><input type="checkbox" checked={saveDefault} onChange={event => setSaveDefault(event.target.checked)} /><span>将本次时长设为以后默认<small>本次验证成功后保存，不改变已有授权截止。</small></span></label></fieldset>
        <div className="ca-duration-preview" id="ca-duration-help" hidden={lookupOnly}>{minutes === null ? <p>请输入0.5～72之间的小时数，可用小数，如1.23。</p> : <><p>{Number(hours) * 60 === minutes ? "本次" : "按分钟精度计为"} {minutesLabel(minutes)}（{minutes}分钟）</p>{selectedKeys.map(key => <p className="ca-remaining-preview" key={key}><span>{key === "personal_data" ? "个人资料" : "无限制授权"}办理后预计剩余</span><strong>{minutesLabel((remainingMinutes(snapshot?.[key], now) || 0) + minutes)}</strong></p>)}{overLimit && <p className="ca-field-error">办理后剩余超过72小时，请减少本次时长。</p>}</>}</div>
        {cooling && <p className="ca-notice">验证暂不可用（冷却中）。请在 {minutesLabel(Math.ceil((cooldownUntil - now) / 60))} 后重试（{beijingTime(cooldownUntil)}）。已有授权保持；本地验证与公网冷却独立。</p>}
        {available && !snapshot?.factor?.available && !cooling && <p className="ca-notice">主机验证器暂不可用，请稍后重新检查。</p>}
        {formAllowed && !lookupOnly && <div className="ca-totp"><label className="ca-field-label" htmlFor="ca-totp">TOTP动态验证码</label><input id="ca-totp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="off" value={totp} disabled={busy || cancelling || cooling || !available} onChange={event => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))} aria-describedby="ca-totp-help" />{visibleError && <p className="ca-notice ca-error" role="alert">{visibleError}</p>}<p id="ca-totp-help" className="ca-footnote">在验证器中查看6位验证码，本页直接提交到电脑验证。切换应用不会取消办理。</p></div>}
        {!lookupOnly && <button className="ca-button ca-button-primary" type="submit" disabled={busy || cancelling || Boolean(actionBusy) || !available || minutes === null || overLimit || !factorAvailable}>{busy ? checkingRequest ? "正在查询…" : "正在办理…" : combined ? "验证并办理两项" : purpose === "personal_data" ? selectedActive ? "验证并延长资料授权" : "验证并解锁资料" : selectedActive ? "验证并延长无限制授权" : "验证并开启无限制授权"}<ArrowRight size={16} /></button>}
        <div className="ca-form-links">{(!request || requestTerminal || formAllowed) && <button type="button" disabled={cancelling} onClick={cancel}>{cancelling ? "正在取消…" : requestTerminal ? "返回填写" : "取消本次办理"}</button>}{request && <button type="button" disabled={busy} onClick={checkRequest}>{checkingRequest ? "查询中…" : "查询本次结果"}</button>}</div><p className="ca-footnote">本人验证后才生效；取消只结束本次请求，保留原有效授权。</p>
      </form>}<QueryFeedback item={requestQuery} loading={checkingRequest} /></section>
      {error && (!formAllowed || lookupOnly) && <p className="ca-notice ca-error" role="alert">{error}</p>}{!retryable && <Result result={result} />}
      <NetworkCard network={snapshot?.hardware?.network} />
      <a className="ca-back" href="https://wly0829.cn/mcp/">连接电脑 · 查看MCP接入方式<ArrowRight size={15} /></a>
    </aside></div>
  </div>;
}
