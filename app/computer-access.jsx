import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SiModelcontextprotocol } from "@icons-pack/react-simple-icons";
import { GrafanaStatus, useGrafanaNavigation } from "./computer-access-summary.jsx";
import { ArrowClockwise, ArrowRight, CheckCircle, Cpu, Desktop, Gauge, HardDrives, LockKey, Memory, ShieldCheck, User, WarningCircle, X, Infinity as InfinityIcon, WifiHigh } from "@phosphor-icons/react";
import { HOST_ORIGIN, adaptStatus, apiRequest, beijingTime, capacity, canEndGrant, canRetryVerification, createGrantAttempt, createStatusReader, durationMinutes, errorMessages, grantLabel, hardwareBasis, hardwareSnapshot, isAccessOrigin, isHostOrigin, memorySpecification, minutesLabel, networkConnection, numeric, queryResultUpdate, rate, reading, reductionAction, reductionFailureResult, remainingMinutes, successfulGrantSnapshot, successfulReductionSnapshot, unresolvedAction } from "./computer-access-model.js";

function SampleTime({ sample }) {
  const observed = sample?.observed_at_unix;
  return <small className="ca-sample">{observed ? `读取于 ${beijingTime(observed, true)}` : "等待数据"}{sample?.state === "stale" ? " · 数据已过期" : sample?.state === "unavailable" ? " · 来源暂不可用" : ""}</small>;
}

function Meter({ used, total = 100, label }) {
  const value = numeric(used), max = numeric(total);
  return <div className="ca-meter" role={value !== null && max > 0 ? "meter" : undefined} aria-label={label} aria-valuenow={value !== null && max > 0 ? value : undefined} aria-valuemin={0} aria-valuemax={max > 0 ? max : undefined}><span style={{ width: value !== null && max > 0 ? `${Math.max(0, Math.min(100, value / max * 100))}%` : "0%" }} /></div>;
}

function HardwareMetrics({ sample }) {
  const voltageBasis = sample.voltage_basis && typeof sample.voltage_basis === "object" ? sample.voltage_basis.value : sample.voltage_basis;
  return <dl className="ca-metric-grid">
    {[["频率", reading(sample.frequency_mhz, " MHz"), "frequency"], ["功耗", reading(sample.power_w, " W"), "power"], ["温度", reading(sample.temperature_c, " °C"), "temperature"], [/core_vid_average/i.test(voltageBasis || "") ? "平均VID" : /vid/i.test(voltageBasis || "") ? "VID" : "电压", reading(sample.voltage_v, " V", 3), "voltage"]].map(([label, value, kind]) => <div className={`ca-metric ca-metric-${kind}`} key={kind}><dt>{label}</dt><dd>{value}</dd></div>)}
  </dl>;
}

function Facts({ items }) { return <dl className="ca-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>; }

function FloatingDetails({ label, children, title = "来源与详情", className = "" }) {
  const trigger = useRef(null), panel = useRef(null);
  const [position, setPosition] = useState(null);
  function close() { setPosition(null); trigger.current?.focus({ preventScroll: true }); }
  function toggle() {
    if (position) { close(); return; }
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(420, window.innerWidth - 32), maxHeight = Math.min(480, window.innerHeight - 40);
    const below = window.innerHeight - rect.bottom - 16;
    setPosition({ width, maxHeight, left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)), ...(below >= 220 ? { top: rect.bottom + 6, maxHeight: Math.min(maxHeight, below - 6) } : { bottom: Math.max(16, window.innerHeight - rect.top + 6), maxHeight: Math.min(maxHeight, rect.top - 22) }) });
  }
  useEffect(() => {
    if (!position) return;
    const escape = event => { if (event.key === "Escape") close(); };
    const outside = event => { if (!trigger.current?.contains(event.target) && !panel.current?.contains(event.target) && !event.target.closest?.(".ca-source-popover")) setPosition(null); };
    const dismiss = () => setPosition(null);
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", dismiss); };
  }, [position]);
  return <div className={`ca-floating-details ${className}`}><button type="button" className="ca-disclosure-button" ref={trigger} aria-expanded={Boolean(position)} onClick={toggle}>{label}<span className="ca-disclosure-arrow" aria-hidden="true">⌄</span></button>{position && createPortal(<section ref={panel} className="ca-source-popover" style={position} aria-label={title}><header><strong>{title}</strong><button type="button" aria-label={`关闭${title}`} onClick={close}><X size={16} /></button></header>{children}</section>, document.body)}</div>;
}

function ReadingSources({ sample, compact = false, note = null }) {
  const labels = { type: "内存类型", data_rate_mt_s: "内存数据率", module_count: "内存条数量", module_capacity_bytes: "单条容量", manufacturer: "厂商", part_number: "型号编号", timings: "时序", filesystem: "文件系统", connection_type: "连接类型", link_speed_bps: "链路速率", voltage_v: "电压／VID", voltage_basis: "电压口径", committed_bytes: "提交占用", commit_limit_bytes: "提交上限", latency_ms: "网络延迟", jitter_ms: "网络抖动", packet_loss_percent: "网络丢包", dpc_usage_percent: "系统DPC占用", width_px: "水平像素", height_px: "垂直像素", refresh_hz: "刷新率", bits_per_channel: "色深", model: "型号", cores: "核心数", threads: "线程数", usage_percent: "使用率", temperature_celsius: "温度", power_watts: "功耗", frequency_mhz: "频率", vram_used_bytes: "已用显存", vram_total_bytes: "显存总量", installed_bytes: "安装内存", total_bytes: "系统可用总量／卷容量", used_bytes: "已用容量", available_bytes: "当前可用内存", free_bytes: "剩余容量", upload_bytes_per_second: "上传速率", download_bytes_per_second: "下载速率", read_bytes_per_second: "读取速率", write_bytes_per_second: "写入速率" };
  const sources = Object.entries(sample?.sources || {}).filter(([field]) => labels[field]);
  if (!sources.length && !note) return null;
  return <FloatingDetails className="ca-source-details" label={compact ? <><SampleTime sample={sample} /><span> · 来源</span></> : "查看读数来源与时间"}>{note && <p className="ca-footnote">{note}</p>}<dl>{sources.map(([field, source]) => <div key={field}><dt>{labels[field]}</dt><dd>{source.source || "来源未知"} · {source.status === "unknown" ? "暂无读数" : source.status === "stale" ? "读数已过期" : source.status === "unavailable" ? "来源不可用" : "已读取"}<br />{source.observed_at_unix ? `读取于 ${beijingTime(source.observed_at_unix)}` : "读取时间未提供"}</dd></div>)}</dl></FloatingDetails>;
}

function DisplayCard({ display = {} }) {
  const width = numeric(display.width_px), height = numeric(display.height_px), hz = numeric(display.refresh_hz), bits = numeric(display.bits_per_channel);
  return <section className="ca-display-card" aria-label="主屏"><h4><Desktop size={15} />主屏</h4><p>{reading(display.model)}</p><small>{width > 0 && height > 0 ? `${width} × ${height}` : "分辨率未读取"} · {hz > 0 ? `${hz} Hz` : "刷新率未读取"} · {bits > 0 ? `${bits} bit` : "色深未读取"}</small><ReadingSources sample={display} compact /></section>;
}

function Hardware({ hardware = {}, host = {}, cached = false, grafana, connected, onRetry }) {
  const cpu = hardware.cpu || {}, memory = hardware.memory || {};
  const memorySpecs = memorySpecification(memory);
  const windowsLabel = host.windows_version?.match(/Windows\s+(?:Server\s+\d{4}|\d+)(?:\s+(?:Pro|Home|Enterprise|Education|专业版|家庭版|企业版|教育版))?/i)?.[0] || host.windows_version || "Windows版本未知";
  const gpus = hardware.gpus?.length ? hardware.gpus : [{}];
  const volumes = hardware.volumes || [];
  const kindLabel = kind => ({ ssd: "固态", hdd: "机械", removable: "可移动", virtual: "虚拟盘", ramdisk: "内存盘", fixed: "固定卷", network: "网络卷", optical: "光盘" })[kind] || "类型未知";
  return <section className="ca-card ca-resources" aria-labelledby="ca-hardware-title">
    <div className="ca-section-title"><div className="ca-resource-heading"><h2 id="ca-hardware-title">系统资源状态{cached && <small className="ca-cached-label">上次采样 · 等待连接确认</small>}</h2><nav className="ca-resource-links" aria-label="电脑与监控入口"><a href="/mcp/"><SiModelcontextprotocol size={15} />连接电脑</a><GrafanaStatus service={grafana} connected={connected} onRetry={onRetry} compact /></nav></div><div className="ca-system-line"><span>{windowsLabel}</span><span><Desktop size={14} />{({ locked: "已锁屏", unlocked: "未锁屏", no_session: "无交互桌面" })[host.screen_state] || "屏幕状态未知"}</span><span>已运行 {Number.isFinite(host.uptime_seconds) ? minutesLabel(Math.floor(host.uptime_seconds / 60)) : "未知"}</span><FloatingDetails className="ca-boot-details" label="详情" title="系统详情"><p>{host.windows_version || "Windows版本未知"}<br />本轮开机：{beijingTime(host.boot_time_unix)}。各项读数保留实际来源与读取时间。</p></FloatingDetails></div></div>
    <div className="ca-system-health"><span>系统DPC占用 <strong>{reading(hardware.health?.dpc_usage_percent, "%", 2)}</strong></span><ReadingSources sample={hardware.health} compact /></div>
    <div className="ca-resource-grid">
      <article className="ca-hardware-card"><div className="ca-hardware-heading"><span className="ca-icon"><Cpu size={25} /></span><div><h3>处理器</h3><p className="ca-model">{reading(cpu.model)}</p><small>{reading(cpu.cores)} 核 · {reading(cpu.threads)} 线程</small></div></div><div className="ca-primary-reading"><strong>{reading(cpu.usage_percent, "%")}</strong></div><Meter used={cpu.usage_percent} label="CPU使用率" /><HardwareMetrics sample={cpu} /><DisplayCard display={hardware.display} /><ReadingSources sample={cpu} compact note={`${hardwareBasis(cpu.frequency_basis, "frequency")}；电压口径：${reading(cpu.voltage_basis)}`} /></article>
      {gpus.map((gpu, index) => <article className="ca-hardware-card" key={index}><div className="ca-hardware-heading"><span className="ca-icon"><Gauge size={25} /></span><div><h3>显卡{gpus.length > 1 ? ` ${index + 1}` : ""}</h3><p className="ca-model">{reading(gpu.model)}</p></div></div><div className="ca-primary-reading"><strong>{reading(gpu.usage_percent, "%")}</strong></div><Meter used={gpu.usage_percent} label="显卡使用率" /><HardwareMetrics sample={gpu} /><div className="ca-vram"><div><span>显存</span><strong>{capacity(gpu.memory_used_bytes)} / {capacity(gpu.memory_total_bytes)}</strong></div><Meter used={gpu.memory_used_bytes} total={gpu.memory_total_bytes} label="显存占用" /></div><ReadingSources sample={gpu} compact note={`电压口径：${reading(gpu.voltage_basis)}`} /></article>)}
      <article className="ca-hardware-card"><div className="ca-hardware-heading"><span className="ca-icon"><Memory size={25} /></span><div><h3>内存</h3>{memorySpecs.standard && <p className="ca-model">{memorySpecs.standard}</p>}{(memorySpecs.modules || memorySpecs.manufacturer) && <small className="ca-memory-spec">{[memorySpecs.modules, memorySpecs.manufacturer].filter(Boolean).join(" · ")}</small>}{memorySpecs.timings && <small className="ca-memory-spec">{memorySpecs.timings}</small>}</div></div><div className="ca-primary-reading ca-memory-reading"><span>已用</span><strong>{capacity(memory.used_bytes)}</strong></div><Meter used={memory.used_bytes} total={memory.usable_total_bytes} label="物理内存占用" /><Facts items={[["已安装", capacity(memory.installed_total_bytes)], ["Windows可用物理总量", capacity(memory.usable_total_bytes)], ["当前剩余", capacity(memory.available_bytes)]]} /><div className="ca-commit"><div><span>提交占用</span><strong>{capacity(memory.committed_bytes)} / {capacity(memory.commit_limit_bytes)}</strong></div><Meter used={memory.committed_bytes} total={memory.commit_limit_bytes} label="内存提交占用" /></div><ReadingSources sample={memory} compact note={`内存型号：${reading(memory.part_number)}；${memorySpecs.timings || "时序未读取"}`} /></article>
    </div>
    <section className="ca-storage" aria-labelledby="ca-storage-title"><div className="ca-card-heading"><HardDrives size={20} /><h3 id="ca-storage-title">存储空间</h3><span>虚拟盘与内存盘单独标记</span></div>
      {volumes.length ? <div className="ca-volume-table"><div className="ca-volume-columns" aria-hidden="true"><span>卷</span><span>类型</span><span>文件系统</span><span>已用 / 总量</span><span>剩余</span><span>占用</span><span /></div>{volumes.map((volume, index) => { const used=numeric(volume.used_bytes), total=numeric(volume.total_bytes); const percent=used !== null && total > 0 ? Math.round(used / total * 100) : null; return <FloatingDetails className="ca-volume" key={volume.drive || index} title={`${volume.drive || "卷"} · 详情`} label={<><strong><HardDrives size={15} />{volume.drive || "未知卷"}</strong><span className="ca-volume-kind">{kindLabel(volume.kind)}{volume.state === "disconnected" ? " · 未连接" : ""}</span><span className="ca-volume-filesystem">{reading(volume.filesystem)}</span><span className="ca-volume-size">{volume.state === "disconnected" ? "暂无容量" : `${capacity(volume.used_bytes)} / ${capacity(volume.total_bytes)}`}</span><span className="ca-volume-free">{volume.state === "disconnected" ? "未知" : capacity(volume.free_bytes)}</span><span className="ca-volume-bar"><Meter used={volume.state === "disconnected" ? null : volume.used_bytes} total={volume.total_bytes} label={`${volume.drive || "卷"}占用`} /><small>{percent === null || volume.state === "disconnected" ? "—" : `${percent}%`}</small></span></>}><div className="ca-volume-detail"><p>{volume.mapping || "物理盘映射未知"}</p><div className="ca-inline-stats"><span>温度 {reading(volume.temperature_celsius, " °C")}</span><span>读取 {rate(volume.read_bytes_per_second)}</span><span>写入 {rate(volume.write_bytes_per_second)}</span></div><p className="ca-footnote">同一物理盘上的卷共用物理盘速率，容量不重复累计。</p><SampleTime sample={volume} /><ReadingSources sample={volume} /></div></FloatingDetails>; })}</div> : <p className="ca-empty">尚未取得卷列表。连接后显示全部可见卷及已登记外接盘。</p>}
      <p className="ca-footnote ca-storage-note">容量统一为 GiB / TiB。展开任一卷可查看物理盘映射、温度、读写与来源。</p>
    </section>

  </section>;
}

function NetworkCard({ network = {} }) {
  return <section className="ca-card ca-network-card" aria-label="网络状态">
    <section className="ca-network-strip" aria-label="网络"><div><WifiHigh size={19} /><h3>网络</h3></div><div className="ca-network-device"><strong>{reading(network.model)}</strong><small>{networkConnection(network)}</small></div><span>↑ 上传 <strong>{rate(network.upload_bytes_per_second)}</strong></span><span>↓ 下载 <strong>{rate(network.download_bytes_per_second)}</strong></span></section><dl className="ca-network-quality">{[["延迟", network.latency_ms, " ms", "latency"], ["抖动", network.jitter_ms, " ms", "jitter"], ["丢包", network.packet_loss_percent, "%", "loss"]].map(([label, value, unit, kind]) => <div className={`ca-metric ca-metric-${kind}`} key={kind}><dt>{label}</dt><dd>{reading(value, unit, 2)}</dd></div>)}</dl><div className="ca-network-meta"><p>{hardwareBasis(network.interface_basis || network.basis, "network")}</p><SampleTime sample={network} /><ReadingSources sample={network} /></div>
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
  const [snapshot, setSnapshot] = useState(null), [connection, setConnection] = useState("connecting"), [refreshing, setRefreshing] = useState(false), [connectionProblem, setConnectionProblem] = useState(null);
  useGrafanaNavigation(connection === "online" ? snapshot?.services?.grafana : null);
  const [now, setNow] = useState(0), [hostMode, setHostMode] = useState(false), [formAllowed, setFormAllowed] = useState(false);
  const [purpose, setPurpose] = useState("personal_data"), [combined, setCombined] = useState(false), [hours, setHours] = useState("8"), [formOpen, setFormOpen] = useState(true), [saveDefault, setSaveDefault] = useState(false);
  const [totp, setTotp] = useState(""), [request, setRequest] = useState(null), [busy, setBusy] = useState(false), [result, setResult] = useState(null), [error, setError] = useState(""), [lookupOnly, setLookupOnly] = useState(false);
  const [actionRequests, setActionRequests] = useState([]), [actionBusy, setActionBusy] = useState("");
  const [toast, setToast] = useState(null), [resultsOpen, setResultsOpen] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  function notify(message, tone = "info") { setToast(message ? { message, tone } : null); }
  function setSuccessNotice(message) { notify(message, "success"); }
  const actionPending = useRef(false);
  const reader = useRef(null), touched = useRef(false), operation = useRef(false), formRef = useRef(null), mounted = useRef(false);
  const base = hostMode ? "" : HOST_ORIGIN;
  useEffect(() => {
    mounted.current = true;
    const onHost = isHostOrigin(window.location.origin);
    setHostMode(onHost); setFormAllowed(isAccessOrigin(window.location.origin, window.top === window.self)); setNow(previous => Math.max(previous, Date.now() / 1000));
    try {
      const savedHardware = hardwareSnapshot(JSON.parse(sessionStorage.getItem("p6-hardware-snapshot") || "null"));
      if (savedHardware) setSnapshot(adaptStatus(savedHardware));
    } catch {}
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
    reader.current = createStatusReader((signal, { refresh }) => {
      setRefreshing(true);
      if (refresh) notify("正在刷新状态与硬件读数…");
      return apiRequest(onHost ? "" : HOST_ORIGIN, refresh ? "/status?refresh=1" : "/status", { signal });
    }, (data, { refresh }) => {
      if (!mounted.current) return;
      setRefreshing(false); setSnapshot(adaptStatus(data)); setConnection("online"); setLastRead(Date.now() / 1000);
      try { const saved = hardwareSnapshot(data); if (saved) sessionStorage.setItem("p6-hardware-snapshot", JSON.stringify(saved)); } catch {}
      if (refresh) notify("本次读取已完成。各项采样时间见读数来源；未变化的数值不表示读取失败。", "success"); setNow(previous => Math.max(previous, Date.now() / 1000));
      if (!touched.current && Number.isFinite(data.default_minutes)) setHours(String(data.default_minutes / 60));
    }, (failure, { refresh }) => { if (mounted.current) { setRefreshing(false); setConnection("offline"); setConnectionProblem(failure.httpStatus >= 500 ? "service" : "unknown"); if (refresh) notify("本次读取未完成，保留上次观测；当前状态未知。", "warning"); } });
    let timer;
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(async () => { if (!operation.current && !actionPending.current) await reader.current.read(); schedule(); }, 60000); };
    const visible = () => { clearTimeout(timer); if (document.hidden) { reader.current.invalidate(); setRefreshing(false); } else { if (!operation.current && !actionPending.current) reader.current.read(); schedule(); } };
    reader.current.read(); schedule();
    document.addEventListener("visibilitychange", visible);
    const clock = setInterval(() => { if (!document.hidden) setNow(previous => Math.max(previous, Date.now() / 1000)); }, 15000);
    return () => { mounted.current = false; clearTimeout(timer); clearInterval(clock); reader.current.invalidate(); document.removeEventListener("visibilitychange", visible); };
  }, []);
  useEffect(() => { if (!toast) return; const timeout = setTimeout(() => setToast(null), 10000); return () => clearTimeout(timeout); }, [toast]);
  useEffect(() => { if (error) notify(error, "warning"); }, [error]);
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
    if (value.summary && !canRetryVerification(value)) {
      const targets = value.summary.targets || [];
      if (targets.includes("personal_data") || targets.includes("unrestricted")) {
        setPurpose(targets.includes("personal_data") ? "personal_data" : "unrestricted");
        setCombined(targets.includes("personal_data") && targets.includes("unrestricted"));
      }
      if (Number.isFinite(value.summary.minutes)) setHours(String(value.summary.minutes / 60));
      setSaveDefault(value.summary.save_default === true); touched.current = true;
    }
    setRequest(previous => ({ ...previous, ...value, error: value.error }));
    setResult(value);
    notify(errorMessages[value.error] || resultStates[value.state] || "结果待确认，请查询原请求。", value.state === "cancelled" ? "info" : "warning");
    setLookupOnly(!canRetryVerification(value));
    setTotp("");
    if (Number.isFinite(value.cooldown_until_unix)) setSnapshot(previous => previous ? { ...previous, factor: { ...previous.factor, cooldown_until_unix: value.cooldown_until_unix } } : previous);
    setError(value.error ? errorMessages[value.error] || "主机暂未完成此操作，请查询本次结果。" : "");
  }
  async function act(action) {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError(""); notify("正在处理本次请求…"); reader.current.invalidate(); setRefreshing(false);
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
      locateRequest(null); setLookupOnly(false); setFormOpen(true); setCombined(false); setSaveDefault(false);
      setTotp(""); setRequest(null); setRequestQuery(null); setResult(null); setError(""); setSuccessNotice("");
      setHours(String(Number.isFinite(snapshot?.default_minutes) ? snapshot.default_minutes / 60 : 8)); touched.current = false;
      return;
    }
    const serial = ++responseSerial.current;
    setCancelling(true); setTotp(""); notify("正在取消本次请求…"); reader.current.invalidate(); setRefreshing(false);
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
          if (serial === responseSerial.current) {
            setRequestQuery(queryResultUpdate(request, null, Date.now() / 1000, true));
            notify("查询未完成，保留原请求；可从操作结果再次查询。", "warning");
          }
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
    if (value.state !== "succeeded") { notify(errorMessages[value.error] || resultStates[value.state] || "本次结果待确认，请查询原请求。", unresolvedAction(value) ? "warning" : "info"); return; }
    if (freshPost) setSnapshot(previous => successfulReductionSnapshot(previous, value, true) || previous);
    setSuccessNotice(freshPost ? (value.action === "personal-data" ? value.personal_data?.state === "closing" ? "资料访问已结束，正在关闭资料。" : "个人资料已锁定。" : value.action === "unrestricted" ? "无限制授权已结束。" : "Windows锁屏已完成。") : "已确认这次操作当时完成，当前状态正在更新。");
  }
  async function lock(kind, priorId = null) {
    if (actionPending.current || busy || cancelling || (!priorId && request && !requestTerminal)) return;
    actionPending.current = true; setActionBusy(kind); notify(priorId ? "正在查询原请求…" : "正在处理本次操作…"); setQueryingActionId(priorId || ""); reader.current.invalidate(); setRefreshing(false);
    const id = priorId || crypto.randomUUID();
    if (!priorId) rememberAction({ request_id: id, action: kind, state: "pending" });
    try {
      const response = await apiRequest(base, priorId ? `/requests/${encodeURIComponent(id)}` : `/locks/${kind}`, priorId ? {} : { method: "POST", body: { state_version: snapshot.state_version, request_id: id }, timeout: 15000 });
      acceptAction(priorId ? queryResultUpdate(actionRequests.find(item => item.request_id === id), { request_id: id, action: kind, ...response }, Date.now() / 1000) : { request_id: id, action: kind, ...response }, !priorId);
    } catch (failure) {
      acceptAction(priorId ? queryResultUpdate(actionRequests.find(item => item.request_id === id), null, Date.now() / 1000, true) : reductionFailureResult(failure, id, kind, false));
    } finally {
      actionPending.current = false; setActionBusy(""); setQueryingActionId("");
      reader.current.read({ replace: true });
    }
  }
  const actionEnabled = kind => available && !busy && !cancelling && !actionBusy && (!request || requestTerminal) && !actionRequests.some(item => item.action === kind && unresolvedAction(item));
  const host = snapshot?.host || {};
  const observed = snapshot?.observed_at_unix;
  return <div className="ca-page">{connection === "offline" && <section className="ca-offline-panel" aria-label="电脑连接说明"><div><Desktop size={24} /><h2>{connectionProblem === "service" ? "连接服务暂时异常" : "暂时无法连接电脑"}</h2></div><p>{connectionProblem === "service" ? "服务器返回了异常响应，当前无法读取电脑状态；这不表示电脑已经关机。" : "可能是网络、休眠、关机或连接服务问题，目前无法确认原因。"} 已有授权仍按原期限处理，页面不会重放办理操作。</p><p>如需远程开机或恢复连接，可使用已配置的 ToDesk、网易UU 或小米智能插座3路径，再回来重新检查。请先确认实际情况，避免仅凭连接失败反复断电。</p><button className="ca-refresh" type="button" disabled={refreshing} onClick={() => reader.current?.read({ refresh: true })}>重新检查连接</button></section>}<div className="ca-workspace"><div className="ca-overview">
    <header className="ca-intro"><h1>授权与状态</h1><span className={`ca-connection ca-connection-${connection}`}><span className="ca-dot" />{connection === "online" ? "主机在线" : connection === "connecting" ? "正在连接主机" : connectionProblem === "service" ? "连接服务异常" : "暂时无法连接电脑"}</span><span className="ca-updated"><span>{observed ? `${connection !== "online" ? "上次观测" : "更新于"} ${beijingTime(observed, true)}` : "尚无主机数据"}</span><span>{refreshing ? lastRead ? "正在读取…" : "首次读取中…" : lastRead ? `读取完成 ${beijingTime(lastRead, true)}` : "尚未读取"} · 每60秒更新</span></span><div className="ca-top-actions"><button className="ca-refresh" type="button" disabled={busy || Boolean(actionBusy) || refreshing} aria-busy={refreshing} onClick={() => reader.current?.read({ refresh: true })}><ArrowClockwise size={17} />{refreshing ? "刷新中…" : connection === "offline" ? "重新检查" : "刷新状态"}</button><button className="ca-refresh ca-screen-lock" title="仅锁交互桌面，保留资料和无限制授权原期限" type="button" disabled={!actionEnabled("windows") || snapshot?.public_actions?.lock_windows !== true} onClick={() => lock("windows")}><Desktop size={17} />锁定Windows</button></div></header>

    <div className="ca-grants"><GrantCard title="个人资料" grant={snapshot?.personal_data} now={now} current={connection === "online"} purpose="personal_data" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="本机与已认证的电脑连接共用" endEnabled={canEndGrant(snapshot?.personal_data, now) && actionEnabled("personal-data") && snapshot?.public_actions?.lock_data === true} onEnd={() => lock("personal-data")} /><GrantCard title="无限制授权" grant={snapshot?.unrestricted} now={now} current={connection === "online"} purpose="unrestricted" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="全局授权，与个人资料分别计时" endEnabled={canEndGrant(snapshot?.unrestricted, now) && actionEnabled("unrestricted") && snapshot?.public_actions?.end_unrestricted === true} onEnd={() => lock("unrestricted")} /></div>
    </div><aside className="ca-access" aria-label="本次办理">
      <section className="ca-card ca-form-card" id="access-form" tabIndex={-1} ref={formRef} aria-labelledby="ca-form-title"><h3 id="ca-form-title">{lookupOnly ? "查询本次结果" : formOpen ? purpose === "personal_data" ? selectedActive ? "延长个人资料授权" : "解锁个人资料" : selectedActive ? "延长无限制授权" : "开启无限制授权" : "选择上方功能开始办理"}</h3>{!formAllowed ? <p className="ca-footnote">请从<a href="https://wly0829.cn/computer-access/">正式授权页面</a>办理。</p> : !formOpen ? <p className="ca-footnote">时长可自由填写0.5～72小时。已有授权会在原期限上加时，两项始终各自计时。</p> : <form onSubmit={submit}>
        <p className="ca-form-context">{request && !retryable && !request.summary ? "正在核实原请求，办理内容以查询结果为准。" : <>本次：{selectedKeys.map(key => key === "personal_data" ? "个人资料" : "无限制授权").join(" + ")} · {minutes === null ? "请填写时长" : minutesLabel(minutes)}</>}</p>
        {formAllowed && <div className="ca-totp"><label className="ca-field-label" htmlFor="ca-totp">TOTP动态验证码</label><input id="ca-totp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="off" value={totp} disabled={busy || cancelling || cooling || !available || lookupOnly} onChange={event => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))} aria-describedby="ca-totp-help" /><p id="ca-totp-help" className="ca-footnote">在验证器中查看6位验证码，本页直接提交到电脑验证。切换应用不会取消办理。</p></div>}
        <fieldset disabled={busy || cancelling || Boolean(request && !retryable)}><legend className="visually-hidden">本次办理内容</legend><div className="ca-purpose-buttons"><button type="button" aria-pressed={purpose === "personal_data"} onClick={() => setPurpose("personal_data")}>个人资料</button><button type="button" aria-pressed={purpose === "unrestricted"} onClick={() => setPurpose("unrestricted")}>无限制授权</button></div><label className="ca-combined"><input type="checkbox" role="switch" aria-label="本次同时建立无限制授权和个人资料解锁期" checked={combined} onChange={event => setCombined(event.target.checked)} /><span>同时{purpose === "personal_data" ? "办理无限制授权" : "解锁个人资料"}<small>一次验证，分别办理两项授权。</small></span></label><label className="ca-field-label" htmlFor="ca-hours">本次{selectedKeys.some(key => remainingMinutes(snapshot?.[key], now) > 0) ? "增加" : "授权"}时长 <span>小时</span></label><input className="ca-hours" id="ca-hours" inputMode="decimal" autoComplete="off" value={hours} onChange={event => { touched.current = true; setHours(event.target.value); }} aria-describedby="ca-duration-help" aria-invalid={minutes === null || overLimit} /><div className="ca-shortcuts">{[0.5, 2, 8, 24].map(value => <button type="button" key={value} onClick={() => { touched.current = true; setHours(String(value)); }}>{value}小时</button>)}</div><label className="ca-combined"><input type="checkbox" checked={saveDefault} onChange={event => setSaveDefault(event.target.checked)} /><span>将本次时长设为以后默认<small>本次验证成功后保存，不改变已有授权截止。</small></span></label></fieldset>
        <div className="ca-duration-preview" id="ca-duration-help">{minutes === null ? <p>请输入0.5～72之间的小时数，可用小数，如1.23。</p> : <><p>{Number(hours) * 60 === minutes ? "本次" : "按分钟精度计为"} {minutesLabel(minutes)}（{minutes}分钟）</p>{selectedKeys.map(key => <p className="ca-remaining-preview" key={key}><span>{key === "personal_data" ? "个人资料" : "无限制授权"}办理后预计剩余</span><strong>{minutesLabel((remainingMinutes(snapshot?.[key], now) || 0) + minutes)}</strong></p>)}{overLimit && <p className="ca-field-error">办理后剩余超过72小时，请减少本次时长。</p>}</>}</div>
        {cooling && <p className="ca-notice">验证暂不可用（冷却中）。请在 {minutesLabel(Math.ceil((cooldownUntil - now) / 60))} 后重试（{beijingTime(cooldownUntil)}）。已有授权保持；本地验证与公网冷却独立。</p>}
        {available && !snapshot?.factor?.available && !cooling && <p className="ca-notice">主机验证器暂不可用，请稍后重新检查。</p>}
        <button className="ca-button ca-button-primary" type="submit" disabled={busy || cancelling || Boolean(actionBusy) || lookupOnly || !available || minutes === null || overLimit || !factorAvailable}>{busy ? checkingRequest ? "正在查询…" : "正在办理…" : combined ? "验证并办理两项" : purpose === "personal_data" ? selectedActive ? "验证并延长资料授权" : "验证并解锁资料" : selectedActive ? "验证并延长无限制授权" : "验证并开启无限制授权"}<ArrowRight size={16} /></button>
        <div className="ca-form-links">{(!request || requestTerminal || formAllowed) && <button type="button" disabled={cancelling} onClick={cancel}>{cancelling ? "正在取消…" : requestTerminal ? "返回填写" : "取消本次办理"}</button>}{request && <button type="button" disabled={busy} onClick={checkRequest}>{checkingRequest ? "查询中…" : "查询本次结果"}</button>}</div><p className="ca-footnote">本人验证后才生效；取消只结束本次请求，保留原有效授权。</p>
      </form>}</section>
    </aside><div className="ca-hardware-area">
      <Hardware hardware={snapshot?.hardware} host={host} cached={connection !== "online" && Boolean(snapshot?.hardware)} grafana={snapshot?.services?.grafana} connected={connection === "online"} onRetry={() => reader.current?.read({ refresh: true })} />
    </div><div className="ca-page-notes"><p className="ca-update-note">仅前台每60秒读取，回到前台立即检查；状态刷新不延长授权。</p></div><NetworkCard network={snapshot?.hardware?.network} /></div>
    {toast && createPortal(<div className={`ca-toast ca-toast-${toast.tone}`} role="status">{toast.tone === "success" ? <CheckCircle size={19} weight="bold" aria-hidden="true" /> : <WarningCircle size={19} aria-hidden="true" />}<p>{toast.message}</p><button type="button" aria-label="关闭提示" onClick={() => setToast(null)}><X size={15} weight="bold" aria-hidden="true" /></button></div>, document.body)}
    {(actionRequests.length > 0 || request || result) && <button className="ca-results-toggle" type="button" aria-expanded={resultsOpen} aria-controls="ca-results-panel" onClick={() => setResultsOpen(open => !open)}>操作结果{actionRequests.length > 0 ? `（${actionRequests.length}）` : ""}</button>}
    {resultsOpen && <section className="ca-results-panel" id="ca-results-panel" aria-label="操作结果"><header><h2>操作结果</h2><button type="button" aria-label="关闭操作结果" onClick={() => setResultsOpen(false)}>×</button></header>
    {actionRequests.length > 0 && <section className="ca-action-results" aria-label="操作结果">{actionRequests.map(item => <div className="ca-action-result" key={item.request_id} aria-busy={queryingActionId === item.request_id}><div><strong>{({ windows: "Windows锁屏", "personal-data": "锁定个人资料", unrestricted: "结束无限制授权" })[item.action]} · {resultStates[item.state] || "结果待确认"}</strong>{item.error && <p>{errorMessages[item.error] || (item.state === "failed" ? "主机已确认本次操作未完成，请按当前状态重新办理。" : "本次结果暂无法确认，请查询原请求。")}</p>}{unresolvedAction(item) && <p>保留这次请求等待核实；其他独立操作仍可按当前状态办理。</p>}<QueryFeedback item={item} loading={queryingActionId === item.request_id} />{!hostMode && <a href={`${HOST_ORIGIN}/computer-access/?request=${encodeURIComponent(item.request_id)}`} target="_blank" rel="noopener noreferrer">在主机查询此请求</a>}</div><button type="button" className="ca-refresh" disabled={Boolean(actionBusy) || busy} onClick={() => lock(item.action, item.request_id)}>{queryingActionId === item.request_id ? "查询中…" : "查询结果"}</button></div>)}</section>}
      {request?.summary && !retryable && <div className="ca-duration-preview"><p>本次已绑定：{request.summary.targets?.map(key => key === "personal_data" ? "个人资料解锁" : key === "unrestricted" ? "全局无限制授权" : "未知办理项").join(" + ")}</p><p>本次时长：{minutesLabel(request.summary.minutes)}{request.summary.save_default ? " · 成功后设为以后默认" : ""}</p></div>}
      {request && <p><button className="ca-refresh" type="button" disabled={busy} onClick={checkRequest}>{checkingRequest ? "查询中…" : "查询本次结果"}</button></p>}
      {error && <p className="ca-notice ca-error">{visibleError}</p>}
      <QueryFeedback item={requestQuery} loading={checkingRequest} /><Result result={result} />
      {!actionRequests.length && !request && !result && <p>当前没有待查询的操作。</p>}
    </section>}
  </div>;
}
