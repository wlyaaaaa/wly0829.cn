import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { SiGrafana } from "@icons-pack/react-simple-icons";
import { HOST_ORIGIN, adaptStatus, apiRequest, beijingTime, createStatusReader, grantLabel, remainingMinutes } from "./computer-access-model.js";
import "../scripts/live-hardware-ui.js";
import "../scripts/live-hardware-ui.css";

export function authorizationCurrent(snapshot, contacted, now) {
  const collector = snapshot?.display_cache?.collectors?.authorization;
  const at = collector?.observed_at_unix ?? snapshot?.observed_at_unix;
  return contacted && typeof at === 'number' && Number.isFinite(at) && at > 0 && at <= now + 60 && now - at <= (Number(snapshot?.max_age_seconds) || 120) && collector?.state !== 'error';
}

export function screenStateLabel(snapshot, current) {
  const state = snapshot?.host?.screen_state, source = snapshot?.host?.sources?.screen_state;
  const wrapped = state && typeof state === 'object' ? state : {};
  if (!current || ['unknown', 'unavailable', 'error', 'failed', 'stale'].includes(wrapped.state || source?.status)) return '当前状态读不到';
  return ({ locked: '已锁屏', unlocked: '未锁屏', no_session: '无交互桌面' })[wrapped.value ?? state] || '当前状态读不到';
}

// A React bridge to the same pure compact renderer used by the cockpit.
export function HardwareSummary({ snapshot, cached = false, online = false, now }) {
  const target = useRef(null);
  useEffect(() => {
    const node = window.LiveHardwareUI.render(document, snapshot, { mode: 'compact', cached, online, now });
    const previous = target.current?.firstElementChild;
    if (previous?.matches('a.live-hardware-compact')) {
      for (const attr of [...previous.attributes]) if (!node.hasAttribute(attr.name)) previous.removeAttribute(attr.name);
      for (const attr of [...node.attributes]) previous.setAttribute(attr.name, attr.value);
      previous.replaceChildren(...node.childNodes);
    } else target.current?.replaceChildren(node);
  }, [snapshot, cached, online, now]);
  return <div className="ca-computer-summary" data-live-hardware-slot ref={target}><a href="/cockpit/#pc" className="ca-computer-summary-fallback">电脑现在 · 等待读取。查看完整硬件状态 →</a></div>;
}

export function useGrafanaNavigation(service) {
  useEffect(() => {
    for (const link of document.querySelectorAll("[data-grafana-entry]")) {
      const online = service?.state === "online";
      link.setAttribute("href", online ? "https://grafana.wly0829.cn/" : document.querySelector("#grafana-status") ? "#grafana-status" : "/#grafana-status");
      if (online) { link.setAttribute("target", "_blank"); link.setAttribute("rel", "noopener noreferrer"); }
      else { link.removeAttribute("target"); link.removeAttribute("rel"); }
    }
  }, [service?.state]);
}

export function GrafanaStatus({ service, connected = false, onRetry, compact = false, loading = false }) {
  const state = connected ? service?.state || "unknown" : "unknown";
  return <div className={`grafana-status${compact ? " grafana-status-compact" : ""}`} id="grafana-status" data-state={state}>
    <div><SiGrafana size={17} color="#F46800" aria-hidden="true" />{state === "online" ? <a href="https://grafana.wly0829.cn/" target="_blank" rel="noopener noreferrer">Grafana · 在线</a> : <span>Grafana · {state === "unavailable" ? "暂不可用" : "状态未确认"}</span>}{state !== "online" && <button type="button" disabled={loading} onClick={onRetry}>{loading ? "读取中…" : "重新检查"}</button>}</div>
    {!compact && <small>{state === "online" ? "监控服务已响应，可打开历史仪表盘。" : state === "unavailable" ? "监控服务暂不可用，请稍后重新检查。" : "暂时无法确认监控服务状态，不据此判断电脑是否关机。"}{service?.observed_at_unix ? ` 读取于 ${beijingTime(service.observed_at_unix, true)}` : ""}</small>}
  </div>;
}

export function ReadIndicator({ busy, children }) {
  return <span className="ca-read-status" role="status" aria-live="polite" data-busy={busy ? "true" : "false"}>{busy && <span className="ca-read-spinner" aria-hidden="true" />}{children}</span>;
}

// This overview only reads status. All action links lead to the one authoritative form.
export default function ComputerAccessSummary({ initialRead = null }) {
  const initialStatusRead = useRef(initialRead);
  const [refreshing, setRefreshing] = useState(true);
  const [snapshot, setSnapshot] = useState(null), [state, setState] = useState("connecting"), [now, setNow] = useState(0), [lastRead, setLastRead] = useState(0);
  const reader = useRef(null);
  useGrafanaNavigation(state === "online" ? snapshot?.services?.grafana : null);
  useEffect(() => {
    let mounted = true, timer;
    try{const saved=Number(localStorage.getItem('computer-last-read-v1'));if(Number.isFinite(saved)&&saved>0&&saved<=Date.now()/1000+60)setLastRead(saved);}catch{}
    reader.current = createStatusReader(signal => { setRefreshing(true); return apiRequest(HOST_ORIGIN, "/status", { signal }); }, data => {
      if (mounted) { setRefreshing(false); setSnapshot(adaptStatus(data)); setState("online"); setNow(Date.now() / 1000); setLastRead(Date.now()/1000);try{localStorage.setItem('computer-last-read-v1',String(Date.now()/1000));}catch{} }
    }, error => { if (mounted) { setRefreshing(false); setState(error.httpStatus >= 500 ? "service-error" : "unavailable"); } }, { initialRead: initialStatusRead.current });
    initialStatusRead.current = null;
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(async () => { await reader.current.read(); schedule(); }, 60000); };
    const visible = () => { clearTimeout(timer); if (document.hidden) { reader.current.invalidate(); setRefreshing(false); } else { reader.current.read(); schedule(); } };
    if (!document.hidden) reader.current.read(); else reader.current.invalidate(); schedule(); document.addEventListener("visibilitychange", visible);
    const clock = setInterval(() => { if (!document.hidden) setNow(previous => Math.max(previous, Date.now() / 1000)); }, 15000);
    return () => { mounted = false; clearTimeout(timer); clearInterval(clock); reader.current.invalidate(); document.removeEventListener("visibilitychange", visible); };
  }, []);
  const current = authorizationCurrent(snapshot, state === 'online', now);
  return <section className="access-summary" aria-label="主机授权状态"><header><strong><ShieldCheck size={18} />主机授权状态</strong><ReadIndicator busy={refreshing || state === "connecting"}>{refreshing || state === "connecting" ? "正在读取…" : state === "online" ? "已读取" : state === "service-error" ? "连接服务异常" : "暂时无法连接"}</ReadIndicator></header>
    {[{ key: "personal_data", label: "个人资料", icon: 'personal-data' }, { key: "unrestricted", label: "无限制授权", icon: 'unrestricted' }].map(({ key, label, icon }) => {
      const grant = snapshot?.[key], active = current && remainingMinutes(grant, now) > 0;
      const href = `/computer-access/?purpose=${key}`;
      return <article key={key} data-authority-state={current ? grant?.state || 'unknown' : 'unknown'}><img className="access-authority-icon" src={`/assets/live-hardware/${icon}.webp`} alt="" width="40" height="40" /><div><h3>{label}</h3><p>{current ? active ? key === 'personal_data' ? '已解锁' : '已开启' : grantLabel(grant, now) : "当前状态读不到"}</p>{active && <small>截止 {beijingTime(grant.expires_at_unix)}</small>}</div><nav aria-label={`${label}办理入口`}><a href={href}>{active ? "延长" : key === "personal_data" ? "解锁" : "开启"}</a>{active && <a href={href}>{key === "personal_data" ? "锁定" : "结束"}</a>}</nav></article>;
    })}
    <article data-authority-state={screenStateLabel(snapshot, current) === '当前状态读不到' ? 'unknown' : snapshot?.host?.screen_state}><img className="access-authority-icon" src="/assets/live-hardware/windows.webp" alt="" width="40" height="40" /><div><h3>Windows 锁屏</h3><p>{screenStateLabel(snapshot, current)}</p></div><nav><a href="/computer-access/">查看与锁屏</a></nav></article>
    <HardwareSummary snapshot={snapshot} cached={state !== 'online' && Boolean(snapshot?.hardware)} online={state === 'online'} now={now} />
    <GrafanaStatus service={snapshot?.services?.grafana} connected={state === "online"} loading={refreshing} onRetry={() => reader.current?.read()} />
    <a className="access-summary-entry" href="/computer-access/">进入授权与状态<ArrowRight size={16} /></a>
    {state!=="online"&&<p role="status">{state==="connecting"?"正在连接电脑。":"读不到电脑：可能电脑不在线，也可能是你这边的网络连不上它。"}{lastRead?`最后读到是 ${beijingTime(lastRead)}。`:"还没读到过。"} <a href="/mcp/">查看连接电脑页的副机备用入口</a></p>}
    <small>{snapshot?.observed_at_unix ? `${state === "online" ? "读取于" : "上次读取"} ${beijingTime(snapshot.observed_at_unix)}` : "状态由主机提供，尚未读取成功。"} · 操作在授权页办理</small>
  </section>;
}
