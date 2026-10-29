import { ACTIONS } from './actions.js';

export const retiredAction = (res) => res.status === 410 && res.j?.error === 'cockpit_action_retired';
export function actionError(res) {
  if (retiredAction(res)) return '这个按钮已经取消，请刷新页面';
  const why = typeof res.j?.message === 'string' ? res.j.message : res.status === 429 ? '点得太快了' : res.status === 0 ? '连不上电脑' : '';
  return `没存上，再点一次${why ? '：' + why : ''}`;
}
// 将乐观收起和待撤回记在同一状态上，避免慢请求覆盖已经点下的撤回。
export function createActionController({ act, post, url, newKey, paint, load, retired, now = Date.now, later = setTimeout }) {
  let retiredLoaded = false;
  const toast = (s) => { s.toastUntil = now() + 6000; later(paint, 6100); return s; };
  const checkRetired = (res) => { if (retiredAction(res) && !retiredLoaded) { retiredLoaded = true; retired(); load(); } };
  async function undo(actId, itemId) {
    const s = itemId ? act.state.get(itemId) : null;
    if (s?.phase === 'sending') { s.undoRequested = true; toast(s); paint(); return; }
    if (!actId || s?.phase === 'undoing' || act.recent.get(actId) === 'undoing') return;
    if (s) act.state.set(itemId, toast({ ...s, phase: 'undoing', undoError: '' }));
    act.recent.set(actId, 'undoing');
    paint();
    const res = await post(`${url}/${encodeURIComponent(actId)}/undo`, {});
    if (res.ok) {
      act.recent.set(actId, 'undone');
      for (const [id, v] of act.state) if (v.receipt?.id === actId) act.state.set(id, toast({ ...v, phase: 'undone', undoRequested: false }));
      load();
    } else {
      const error = `没撤回：${res.j?.message || '稍后再试'}`;
      if (s) act.state.set(itemId, toast({ ...s, phase: 'done', undoRequested: false, undoError: error }));
      act.recent.set(actId, { error });
      checkRetired(res);
    }
    paint();
  }
  async function submit(item, action, extra = {}) {
    const previous = act.state.get(item.id);
    const settledSnooze = previous?.action === 'snooze' && previous.movedToDeferred;
    if (!ACTIONS.includes(action) || !item.id || ['sending', 'undoing'].includes(previous?.phase) || (previous?.phase === 'done' && !settledSnooze)) return;
    const body = { item_id: item.id, action, idempotency_key: newKey() };
    if (action === 'snooze') body.until = extra.until;
    if (item.version !== undefined) body.item_version = item.version;
    const base = toast({ action, title: item.title, sourceTitle: item.sourceTitle || item.title, until: body.until, clickAt: now() });
    act.state.set(item.id, { ...base, phase: 'sending' });
    paint();
    const res = await post(url, body), wantedUndo = act.state.get(item.id)?.undoRequested;
    if (res.ok && typeof res.j?.id === 'string') {
      act.state.set(item.id, { ...base, phase: 'done', receipt: res.j, undoRequested: wantedUndo });
      act.ui.delete(item.id);
      paint();
      if (wantedUndo) await undo(res.j.id, item.id);
      else load();
    } else {
      act.state.set(item.id, { ...base, phase: 'error', error: actionError(res), refresh: res.status === 409 || retiredAction(res) });
      paint();
      checkRetired(res);
    }
  }
  function reconcile(ids, snapshot = {}) {
    const current = new Set(ids);
    const needYou = new Set((Array.isArray(snapshot.need_you) ? snapshot.need_you : []).map((x) => x.id));
    const deferred = new Set((Array.isArray(snapshot.deferred) ? snapshot.deferred : []).map((x) => x.id));
    const receipts = Array.isArray(snapshot.owner_recent) ? snapshot.owner_recent : [];
    const failedItems = Array.isArray(snapshot.owner_actions_worker?.failed_items) ? snapshot.owner_actions_worker.failed_items : [];
    for (const [id, s] of act.state) if (s.phase === 'done') {
      const fresh = (at) => Number.isFinite(Date.parse(at || '')) && Date.parse(at) >= s.clickAt - 1000;
      const receipt = receipts.find((r) => r && typeof r.error_message === 'string' && r.error_message &&
        (r.id === s.receipt?.id || (r.item_id === id && (!r.action || r.action === s.action) && (!r.created_at || fresh(r.created_at)))));
      const worker = failedItems.find((r) => r && r.title === s.sourceTitle && r.action === s.action && fresh(r.at) && typeof r.message === 'string' && r.message);
      const reason = receipt?.error_message || worker?.message;
      if (reason) { act.state.set(id, { ...s, phase: 'error', undoRequested: false, error: actionError({ status: 500, j: { message: reason } }), toastUntil: 0 }); continue; }
      // 提醒已经移入不急事项：保留短回执供撤回，但不再沿用待办上的隐藏状态。
      if (s.action === 'snooze' && !needYou.has(id) && deferred.has(id)) { s.movedToDeferred = true; s.observedGone = false; }
      else if (!current.has(id)) s.observedGone = true;
      else if (s.observedGone) act.state.delete(id);
    }
  }
  return { submit, undo, reconcile };
}
