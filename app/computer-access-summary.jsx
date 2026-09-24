import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, User, Infinity as InfinityIcon } from "@phosphor-icons/react";
import { SiGrafana } from "@icons-pack/react-simple-icons";
import { HOST_ORIGIN, apiRequest, beijingTime, createStatusReader, grantLabel, remainingMinutes } from "./computer-access-model.js";

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

export function GrafanaStatus({ service, connected = false, onRetry, compact = false }) {
  const state = connected ? service?.state || "unknown" : "unknown";
  return <div className={`grafana-status${compact ? " grafana-status-compact" : ""}`} id="grafana-status" data-state={state}>
    <div><SiGrafana size={17} color="#F46800" aria-hidden="true" />{state === "online" ? <a href="https://grafana.wly0829.cn/" target="_blank" rel="noopener noreferrer">Grafana · 在线</a> : <span>Grafana · {state === "unavailable" ? "暂不可用" : "状态未确认"}</span>}{state !== "online" && <button type="button" onClick={onRetry}>重新检查</button>}</div>
    {!compact && <small>{state === "online" ? "监控服务已响应，可打开历史仪表盘。" : state === "unavailable" ? "监控服务暂不可用，请稍后重新检查。" : "暂时无法确认监控服务状态，不据此判断电脑是否关机。"}{service?.observed_at_unix ? ` 读取于 ${beijingTime(service.observed_at_unix, true)}` : ""}</small>}
  </div>;
}

// This overview only reads status. All action links lead to the one authoritative form.
export default function ComputerAccessSummary() {
  const [snapshot, setSnapshot] = useState(null), [state, setState] = useState("connecting"), [now, setNow] = useState(0);
  const reader = useRef(null);
  useGrafanaNavigation(state === "online" ? snapshot?.services?.grafana : null);
  useEffect(() => {
    let mounted = true, timer;
    reader.current = createStatusReader(signal => apiRequest(HOST_ORIGIN, "/status", { signal }), data => {
      if (mounted) { setSnapshot(data); setState("online"); setNow(Date.now() / 1000); }
    }, error => { if (mounted) setState(error.httpStatus >= 500 ? "service-error" : "unavailable"); });
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(async () => { await reader.current.read(); schedule(); }, 60000); };
    const visible = () => { clearTimeout(timer); if (document.hidden) reader.current.invalidate(); else { reader.current.read(); schedule(); } };
    reader.current.read(); schedule(); document.addEventListener("visibilitychange", visible);
    const clock = setInterval(() => { if (!document.hidden) setNow(previous => Math.max(previous, Date.now() / 1000)); }, 15000);
    return () => { mounted = false; clearTimeout(timer); clearInterval(clock); reader.current.invalidate(); document.removeEventListener("visibilitychange", visible); };
  }, []);
  return <section className="access-summary" aria-label="主机授权状态"><header><strong><ShieldCheck size={18} />主机授权状态</strong><span>{state === "online" ? "已读取" : state === "connecting" ? "正在读取…" : state === "service-error" ? "连接服务异常" : "暂时无法连接"}</span></header>
    {[{ key: "personal_data", label: "个人资料", Icon: User }, { key: "unrestricted", label: "无限制授权", Icon: InfinityIcon }].map(({ key, label, Icon }) => {
      const grant = snapshot?.[key], active = state === "online" && remainingMinutes(grant, now) > 0;
      const href = `/computer-access/?purpose=${key}`;
      return <article key={key}><Icon size={24} /><div><h3>{label}</h3><p>{state === "online" ? grantLabel(grant, now) : "当前状态未知"}</p></div><nav aria-label={`${label}办理入口`}><a href={href}>{active ? "延长" : key === "personal_data" ? "解锁" : "开启"}</a>{active && <a href={href}>{key === "personal_data" ? "锁定" : "结束"}</a>}</nav></article>;
    })}
    <GrafanaStatus service={snapshot?.services?.grafana} connected={state === "online"} onRetry={() => { setState("connecting"); reader.current?.read(); }} />
    <a className="access-summary-entry" href="/computer-access/">进入授权与状态<ArrowRight size={16} /></a>
    <small>{snapshot?.observed_at_unix ? `${state === "online" ? "读取于" : "上次读取"} ${beijingTime(snapshot.observed_at_unix, true)}` : "状态由主机提供，尚未读取成功。"} · 操作在授权页办理</small>
  </section>;
}
