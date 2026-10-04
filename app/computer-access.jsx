import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HardwareSummary, ReadIndicator, authorizationCurrent, screenStateLabel, useGrafanaNavigation } from "./computer-access-summary.jsx";
import { ArrowClockwise, ArrowRight, CheckCircle, Desktop, WarningCircle, X } from "@phosphor-icons/react";
import { HOST_ORIGIN, GRANT_STAGE_KEY, adaptStatus, apiRequest, beijingTime, canEndGrant, canRetryVerification, canRestartUnsubmittedGrant, createGrantAttempt, createStatusReader, durationMinutes, errorMessages, grantLabel, grantResultNeedsQuery, hardwareSnapshot, isAccessOrigin, isHostOrigin, markGrantVerificationSubmitted, minutesLabel, queryResultUpdate, readGrantStage, reductionAction, reductionFailureResult, remainingMinutes, successfulGrantSnapshot, successfulReductionSnapshot, unresolvedAction } from "./computer-access-model.js";

function QueryFeedback({ item, loading = false }) {
  if (loading) return <p className="ca-query-feedback" role="status">正在查询原请求，请稍候…</p>;
  if (!item?.query_state) return null;
  return <p className={`ca-query-feedback${item.query_state === "failed" ? " ca-query-failed" : ""}`} role="status">{item.query_state === "failed" ? "本次查询未完成，保留上次结果；可稍后再次查询。" : item.query_state === "unchanged" ? `已查询，结果仍为“${resultStates[item.state] || "结果待确认"}”。` : `已查到新结果：“${resultStates[item.state] || "结果待确认"}”。`}<small>{beijingTime(item.queried_at_unix, true)}</small></p>;
}

function GrantCard({ title, grant, now, current, description, onChoose, enabled, purpose, onEnd, endEnabled }) {
  const active = current && remainingMinutes(grant, now) > 0;
  const state = current ? active ? purpose === "personal_data" ? "已解锁" : "已开启" : grantLabel(grant, now) : "当前状态读不到";
  const deadline = current && active ? `截止 ${beijingTime(grant.expires_at_unix)}` : current && ["locked", "inactive", "expired", "revoked"].includes(grant?.state) ? "当前没有生效期限" : "截止时间读不到";
  return <section className={`ca-card ca-grant${active ? " ca-grant-active" : ""}`} data-authority-state={current ? grant?.state || "unknown" : "unknown"}><img className="ca-authority-icon" src={`/assets/live-hardware/${purpose === "personal_data" ? "personal-data" : "unrestricted"}.webp`} alt="" width="46" height="46" /><div className="ca-grant-copy"><h3>{title}</h3><strong className="ca-grant-state">{state}</strong><p className="ca-grant-deadline">{deadline}</p>{current && active && <small>{grantLabel(grant, now)}</small>}<p>{description}</p></div><div className="ca-grant-actions"><button className="ca-button ca-button-secondary" type="button" aria-label={`${active ? "延长" : "开启"}${title}`} disabled={!enabled} onClick={() => onChoose(purpose)}>{active ? "延长" : purpose === "personal_data" ? "解锁" : "开启"}</button><button className="ca-button ca-end-button" type="button" aria-label={purpose === "personal_data" ? "锁定个人资料" : "结束无限制授权"} disabled={!endEnabled} onClick={onEnd}>{purpose === "personal_data" ? "锁定" : "结束"}</button></div></section>;
}

const resultStates = { succeeded: "已完成", success: "已完成", active: "已生效", unlocked: "资料已解锁", locked: "资料已锁定", failed: "未完成", unavailable: "暂不可用", pending: "等待确认", verifying: "验证中", cancelled: "已取消", expired: "本次请求已到期", partial: "部分完成", unknown: "结果待确认", closing: "正在关闭资料" };
function Result({ result }) {
  if (!result) return null;
  return <div className="ca-result" role="status"><strong>{result.title || (result.personal_data?.state === "closing" ? "资料正在关闭" : resultStates[result.state || result.status]) || "结果待确认"}</strong>{result.message && <p>{result.message}</p>}{result.default_saved === true && <p>已保存为以后默认；已有授权截止保持不变。</p>}{result.default_saved === false && <p>本次授权结果如下，但默认时长未保存。</p>}{result.error && <p>{errorMessages[result.error] || "主机暂未完成此操作，请查询本次结果。"}</p>}{["personal_data", "unrestricted"].map(key => result[key] && result[key].state !== "not_requested" ? <p key={key}>{key === "personal_data" ? "个人资料" : "无限制授权"}：{resultStates[result[key].state || result[key].status] || "结果待确认"}{result[key].reason && errorMessages[result[key].reason] ? ` · ${errorMessages[result[key].reason]}` : ""}</p> : null)}</div>;
}

export default function ComputerAccess({ initialRead = null }) {
  const initialStatusRead = useRef(initialRead);
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
      if (savedHardware) {setSnapshot(adaptStatus(savedHardware));setLastRead(savedHardware.observed_at_unix);}
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
      let phase;
      try { phase = readGrantStage(sessionStorage, restoredId); } catch {}
      const restored = { request_id: restoredId, state: "unknown", ...(phase === undefined ? {} : { factor_submitted: phase }) };
      setRequest(restored); setLookupOnly(true); setFormOpen(true);
      apiRequest(onHost ? "" : HOST_ORIGIN, `/requests/${encodeURIComponent(restoredId)}`).then(data => {
        if (!mounted.current) return;
        const action = reductionAction(data);
        if (action) { acceptAction({ request_id: restoredId, ...data, action }); locateRequest(null); setRequest(null); setLookupOnly(false); }
        else if (canRestartUnsubmittedGrant(restored, data)) returnToUnsubmitted(restoredId);
        else { acceptResult({ ...restored, ...data }); if (data.state === "succeeded") reader.current?.read({ replace: true }); }
      }).catch(failure => {
        if (!mounted.current) return;
        if (canRestartUnsubmittedGrant(restored, null, failure)) returnToUnsubmitted(restoredId);
        else setError("暂无法取得原请求结果，请手动查询；不要重新提交验证码。");
      });
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
    }, (failure, { refresh }) => { if (mounted.current) { setRefreshing(false); setConnection("offline"); setConnectionProblem(failure.httpStatus >= 500 ? "service" : "unknown"); if (refresh) notify("本次读取未完成，保留上次观测；当前状态未知。", "warning"); } }, { initialRead: initialStatusRead.current });
    initialStatusRead.current = null;
    let timer;
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(async () => { if (!operation.current && !actionPending.current) await reader.current.read(); schedule(); }, 60000); };
    const visible = () => { clearTimeout(timer); if (document.hidden) { reader.current.invalidate(); setRefreshing(false); } else { if (!operation.current && !actionPending.current) reader.current.read(); schedule(); } };
    if (!document.hidden) reader.current.read(); else reader.current.invalidate(); schedule();
    document.addEventListener("visibilitychange", visible);
    const clock = setInterval(() => { if (!document.hidden) setNow(previous => Math.max(previous, Date.now() / 1000)); }, 15000);
    return () => { mounted.current = false; clearTimeout(timer); clearInterval(clock); reader.current.invalidate(); document.removeEventListener("visibilitychange", visible); };
  }, []);
  useEffect(() => { if (!toast) return; const timeout = setTimeout(() => setToast(null), 10000); return () => clearTimeout(timeout); }, [toast]);
  const currentAuthority = authorizationCurrent(snapshot, connection === "online", now);
  const available = formAllowed && currentAuthority && Boolean(snapshot?.state_version);
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
  function locateRequest(id, factorSubmitted) {
    try {
      if (id) {
        sessionStorage.setItem("p6-request-id", id);
        if (typeof factorSubmitted === "boolean") sessionStorage.setItem(GRANT_STAGE_KEY, JSON.stringify({ request_id: id, factor_submitted: factorSubmitted }));
      } else { sessionStorage.removeItem("p6-request-id"); sessionStorage.removeItem(GRANT_STAGE_KEY); }
    } catch {}
    const url = new URL(window.location.href); url.search = ""; if (id) url.searchParams.set("request", id); history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  function returnToUnsubmitted(id, error = "public_factor_not_submitted") {
    acceptResult({ request_id: id, state: "failed", factor_submitted: false, error });
  }
  function choose(nextPurpose) { setRequestQuery(null); locateRequest(null); setLookupOnly(false); setPurpose(nextPurpose); setCombined(false); setSaveDefault(false); setFormOpen(true); setResult(null); setError(""); setRequest(null); setTotp(""); touched.current = true; setTimeout(() => formRef.current?.focus({ preventScroll: false }), 0); }
  const responseSerial = useRef(0);
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
    const needsQuery = grantResultNeedsQuery(value);
    if (needsQuery || canRetryVerification(value)) setRequest(previous => ({ ...previous, ...value, error: value.error }));
    else { setRequest(null); locateRequest(null); }
    setResult(value);
    setLookupOnly(needsQuery);
    setToast(null);
    setTotp("");
    if (Number.isFinite(value.cooldown_until_unix)) setSnapshot(previous => previous ? { ...previous, factor: { ...previous.factor, cooldown_until_unix: value.cooldown_until_unix } } : previous);
    setError(value.error ? errorMessages[value.error] || "主机暂未完成此操作，请查询本次结果。" : "");
  }
  async function act(action) {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError(""); setToast(null); reader.current.invalidate(); setRefreshing(false);
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
        operation.current = false; setBusy(false);
        reader.current.read({ replace: true });
      }
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || actionBusy || !available || minutes === null || overLimit || !factorAvailable || (request && !retryable)) return;
    if (!formAllowed) return;
    if (!/^\d{6}$/.test(totp)) { setError("请输入验证器中的6位动态验证码，保留开头的0。"); return; }
    const code = totp;
    setTotp(""); setResult(null); setRequestQuery(null);
    await act(async serial => {
      const id = crypto.randomUUID();
      setRequest({ request_id: id, state: "pending", factor_submitted: false }); locateRequest(id, false);
      const attempt = createGrantAttempt({
        requestId: id,
        body: { purpose, combined, save_default: saveDefault, duration_hours: hours, state_version: snapshot.state_version },
        api: (path, options) => apiRequest(base, path, options),
        onCreated: created => { if (serial === responseSerial.current) setRequest({ ...created, state: "verifying", factor_submitted: false }); },
        onVerificationStarted: requestId => {
          if (!markGrantVerificationSubmitted(sessionStorage, requestId)) throw Object.assign(new Error("stage unavailable"), { code: "public_request_tracking_unavailable" });
          if (serial === responseSerial.current) setRequest(previous => ({ ...previous, factor_submitted: true }));
        },
      });
      try {
        const verified = await attempt.run(code);
        if (serial === responseSerial.current && verified) {
          const reportedEffect = [verified.personal_data?.state, verified.unrestricted?.state].some(state => ["succeeded", "unknown", "verifying"].includes(state));
          if (!attempt.factorSubmitted && grantResultNeedsQuery(verified) && verified.state !== "partial" && !reportedEffect) returnToUnsubmitted(id);
          else acceptResult(verified, attempt.factorSubmitted);
        }
      } catch (failure) {
        if (serial === responseSerial.current && !attempt.factorSubmitted) { returnToUnsubmitted(id, failure.code === "public_request_tracking_unavailable" ? failure.code : "public_factor_not_submitted"); return; }
        throw failure;
      }
    });
  }
  async function checkRequest() {
    if (!request || operation.current) return;
    setCheckingRequest(true);
    try {
      await act(async serial => {
        try {
          const status = await apiRequest(base, `/requests/${encodeURIComponent(request.request_id)}`);
          if (serial === responseSerial.current) {
            if (canRestartUnsubmittedGrant(request, status)) { returnToUnsubmitted(request.request_id); return; }
            acceptResult(status); if (status.state !== "succeeded") setRequestQuery(queryResultUpdate(request, status, Date.now() / 1000));
          }
        } catch (failure) {
          if (serial === responseSerial.current) {
            if (canRestartUnsubmittedGrant(request, null, failure)) { returnToUnsubmitted(request.request_id); return; }
            setRequestQuery(queryResultUpdate(request, null, Date.now() / 1000, true));
            setToast(null);
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
    if (actionPending.current || busy || (!priorId && request && !requestTerminal)) return;
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
  const actionEnabled = kind => available && !busy && !actionBusy && (!request || requestTerminal) && !actionRequests.some(item => item.action === kind && unresolvedAction(item));
  const host = snapshot?.host || {};
  const observed = snapshot?.observed_at_unix;
  return <div className="ca-page"><div className="ca-workspace"><div className="ca-overview">
    <header className="ca-intro"><h1>授权与状态</h1><span className={`ca-connection ca-connection-${connection}`}><span className="ca-dot" />{connection === "online" ? "主机在线" : connection === "connecting" ? "正在连接主机" : connectionProblem === "service" ? "连接服务异常" : "暂时无法连接电脑"}</span><span className="ca-updated"><ReadIndicator busy={refreshing || connection === "connecting"}>{refreshing || connection === "connecting" ? "正在读取…" : lastRead || observed ? `${connection === "online" ? "读取完成" : "上次读取"} ${beijingTime(lastRead || observed, connection === "online")}` : "尚未读取"}</ReadIndicator></span><div className="ca-top-actions"><button className="ca-refresh" type="button" disabled={busy || Boolean(actionBusy) || refreshing || connection === "connecting"} aria-busy={refreshing || connection === "connecting"} onClick={() => reader.current?.read({ refresh: true })}><ArrowClockwise size={17} />{refreshing || connection === "connecting" ? "刷新中…" : connection === "offline" ? "重新检查" : "刷新状态"}</button></div></header>

    <div className="ca-grants"><GrantCard title="个人资料" grant={snapshot?.personal_data} now={now} current={currentAuthority} purpose="personal_data" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="本机与已认证的电脑连接共用" endEnabled={canEndGrant(snapshot?.personal_data, now) && actionEnabled("personal-data") && snapshot?.public_actions?.lock_data === true} onEnd={() => lock("personal-data")} /><GrantCard title="无限制授权" grant={snapshot?.unrestricted} now={now} current={currentAuthority} purpose="unrestricted" enabled={available && !busy && !actionBusy && (!request || requestTerminal)} onChoose={choose} description="全局授权，与个人资料分别计时" endEnabled={canEndGrant(snapshot?.unrestricted, now) && actionEnabled("unrestricted") && snapshot?.public_actions?.end_unrestricted === true} onEnd={() => lock("unrestricted")} /><section className="ca-card ca-grant ca-windows" data-authority-state={screenStateLabel(snapshot, currentAuthority) === "当前状态读不到" ? "unknown" : host.screen_state}><img className="ca-authority-icon" src="/assets/live-hardware/windows.webp" alt="" width="46" height="46" /><div className="ca-grant-copy"><h3>Windows 锁屏</h3><strong className="ca-grant-state">{screenStateLabel(snapshot, currentAuthority)}</strong><p>Windows 屏幕独立于两项授权。</p></div><div className="ca-grant-actions"><button className="ca-button ca-button-secondary" type="button" disabled={!actionEnabled("windows") || snapshot?.public_actions?.lock_windows !== true} onClick={() => lock("windows")}>锁定Windows</button></div></section></div>
    </div><section className="ca-hardware-area" aria-labelledby="ca-computer-summary-title"><h2 id="ca-computer-summary-title">电脑现在</h2><HardwareSummary snapshot={snapshot} cached={connection !== "online" && Boolean(snapshot?.hardware)} online={connection === "online"} now={now} />{connection === "offline" && <section className="ca-offline-panel" aria-label="电脑连接说明"><h2>{connectionProblem === "service" ? "连接服务暂时异常" : "暂时读不到电脑"}</h2><p>可能电脑不在线，也可能是当前网络连不上。{lastRead ? `最后读到是 ${beijingTime(lastRead)}。` : "还没读到过。"}<a href="/mcp/">查看连接与副机入口</a></p></section>}</section><aside className="ca-access" aria-label="本次办理">
      <section className="ca-card ca-form-card" id="access-form" tabIndex={-1} ref={formRef} aria-labelledby="ca-form-title"><h3 id="ca-form-title">{lookupOnly ? "查询本次结果" : formOpen ? purpose === "personal_data" ? selectedActive ? "延长个人资料授权" : "解锁个人资料" : selectedActive ? "延长无限制授权" : "开启无限制授权" : "选择上方功能开始办理"}</h3>{!formAllowed ? <p className="ca-footnote">请从<a href="https://wly0829.cn/computer-access/">正式授权页面</a>办理。</p> : !formOpen ? <p className="ca-footnote">时长可自由填写0.5～72小时。已有授权会在原期限上加时，两项始终各自计时。</p> : <form onSubmit={submit}>
        <p className="ca-form-context">{request && !retryable && !request.summary ? "正在核实原请求，办理内容以查询结果为准。" : <>本次：{selectedKeys.map(key => key === "personal_data" ? "个人资料" : "无限制授权").join(" + ")} · {minutes === null ? "请填写时长" : minutesLabel(minutes)}</>}</p>
        {formAllowed && <div className="ca-totp"><label className="ca-field-label" htmlFor="ca-totp">TOTP动态验证码</label><input id="ca-totp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="off" value={totp} disabled={busy || cooling || !available || lookupOnly} onChange={event => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))} aria-describedby="ca-totp-help" /><p id="ca-totp-help" className="ca-footnote">在验证器中查看6位验证码，本页直接提交到电脑验证。切换应用不会取消办理。</p></div>}
        <fieldset className="ca-form-selection" disabled={busy || Boolean(request && !retryable)}><legend className="visually-hidden">本次办理内容</legend><div className="ca-purpose-buttons"><button type="button" aria-pressed={purpose === "personal_data"} onClick={() => setPurpose("personal_data")}>个人资料</button><button type="button" aria-pressed={purpose === "unrestricted"} onClick={() => setPurpose("unrestricted")}>无限制授权</button></div><label className="ca-combined"><input type="checkbox" role="switch" aria-label="本次同时建立无限制授权和个人资料解锁期" checked={combined} onChange={event => setCombined(event.target.checked)} /><span>同时{purpose === "personal_data" ? "办理无限制授权" : "解锁个人资料"}<small>一次验证，分别办理两项授权。</small></span></label><label className="ca-field-label" htmlFor="ca-hours">本次{selectedKeys.some(key => remainingMinutes(snapshot?.[key], now) > 0) ? "增加" : "授权"}时长 <span>小时</span></label><input className="ca-hours" id="ca-hours" inputMode="decimal" autoComplete="off" value={hours} onChange={event => { touched.current = true; setHours(event.target.value); }} aria-describedby="ca-duration-help" aria-invalid={minutes === null || overLimit} /><div className="ca-shortcuts">{[0.5, 2, 8, 24].map(value => <button type="button" key={value} onClick={() => { touched.current = true; setHours(String(value)); }}>{value}小时</button>)}</div><p className={`ca-duration-hint${minutes === null || overLimit ? " ca-field-error" : ""}`} id="ca-duration-help">{minutes === null ? "请输入0.5～72小时，可用小数。" : overLimit ? "办理后剩余超过72小时，请减少本次时长。" : connection !== "online" ? "恢复连接后计算预计结果。" : `预计剩余：${selectedKeys.map(key => `${key === "personal_data" ? "个人资料" : "无限制授权"} ${minutesLabel((remainingMinutes(snapshot?.[key], now) || 0) + minutes)}`).join("；")}，以验证成功后为准。`}</p><label className="ca-combined"><input type="checkbox" checked={saveDefault} onChange={event => setSaveDefault(event.target.checked)} /><span>将本次时长设为以后默认<small>本次验证成功后保存，不改变已有授权截止。</small></span></label></fieldset>
        {cooling && <p className="ca-notice">验证暂不可用（冷却中）。请在 {minutesLabel(Math.ceil((cooldownUntil - now) / 60))} 后重试（{beijingTime(cooldownUntil)}）。已有授权保持；本地验证与公网冷却独立。</p>}
        {available && !snapshot?.factor?.available && !cooling && <p className="ca-notice">主机验证器暂不可用，请稍后重新检查。</p>}
        {(request || result || error) && <div className={`ca-inline-request${lookupOnly ? " ca-inline-request-unknown" : ""}`} role="status" aria-live="polite">
          <strong>{busy ? checkingRequest ? "正在查询本次结果…" : "正在验证，请稍候…" : lookupOnly ? result?.state === "partial" ? "本次部分完成，仍需确认结果" : "本次结果尚未确认" : resultStates[result?.state || request?.state] || "请检查本次输入"}</strong>
          {lookupOnly && <p>本次请求已保留。请查询同一请求，不要重新提交验证码。</p>}
          {visibleError && <p>{visibleError}</p>}
          <QueryFeedback item={requestQuery} loading={checkingRequest} />
        </div>}
        <button className="ca-button ca-button-primary" type={lookupOnly ? "button" : "submit"} onClick={lookupOnly ? checkRequest : undefined} disabled={lookupOnly ? busy || Boolean(actionBusy) : busy || Boolean(actionBusy) || !available || minutes === null || overLimit || !factorAvailable} aria-busy={busy}>{busy ? checkingRequest ? "正在查询…" : "正在验证…" : lookupOnly ? "查询本次结果" : combined ? "验证并办理两项" : purpose === "personal_data" ? selectedActive ? "验证并延长资料授权" : "验证并解锁资料" : selectedActive ? "验证并延长无限制授权" : "验证并开启无限制授权"}<ArrowRight size={16} /></button>
        {actionRequests.some(unresolvedAction) && <p className="ca-inline-action-note">有操作结果仍待确认。<button type="button" onClick={() => setResultsOpen(true)}>查看操作结果</button></p>}
        <p className="ca-form-about">个人资料与无限制授权分别计时，刷新不会延长期限。验证成功后按主机返回的实际结果生效。</p>
      </form>}</section>
    </aside><div className="ca-page-notes"><p className="ca-update-note">状态刷新不会延长授权。</p></div></div>
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
