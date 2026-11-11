const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count = (n) => Number.isInteger(n) && n >= 0 ? String(n) : '未读到';
const date = (s) => Number.isFinite(Date.parse(s)) ? new Date(s).toLocaleDateString('zh-CN', {timeZone:'Asia/Shanghai'}) : '未读到';
const entry = (p) => (p.entry_text ? `${esc(p.entry_text)}<br>` : '') + (/^https?:\/\//i.test(p.entry || '') ? `<a href="${esc(p.entry)}" target="_blank" rel="noopener noreferrer">${esc(p.entry_label || '看使用说明')} ↗</a>` : esc(p.entry || '未读到'));

export function renderProjects(data) {
  return data.projects.map(p => `<tr data-repo="${esc(p.repo)}"><th scope="row">${esc(p.name)}${p.frozen ? '<small>已冻结</small>' : p.frozen == null ? '<small>冻结状态未读到</small>' : ''}</th><td>${esc(p.purpose || '未读到用途')}</td><td>${entry(p)}</td><td>${date(p.updated_at)}</td><td>${count(p.commits_7d)}</td><td>${count(p.commits_30d)}</td><td>${count(p.waiting_owner)}</td><td>${esc(p.change || (p.error ? '未读到' : '还没有留过'))}</td></tr>`).join('')
    + `<tr data-unassigned><th scope="row">没标项目</th><td colspan="5">驾驶舱登记里没标项目的事</td><td>${count(data.unassigned?.waiting_owner)}</td><td>不分到其他项目</td></tr>`
    + Object.entries(data.unmatched || {}).map(([key,n]) => `<tr><th scope="row">${esc(key)}</th><td colspan="5">登记的项目不在这次仓库名单里</td><td>${count(n)}</td><td>不分到其他项目</td></tr>`).join('');
}

if (typeof document !== 'undefined') {
  const gate = document.getElementById('projects-gate'), owner = document.getElementById('projects-owner');
  const rows = document.getElementById('projects-rows'), status = document.getElementById('projects-status');
  const button = document.getElementById('projects-refresh');
  const endpoint = 'https://mcp.wly0829.cn/computer-access/api/cockpit/projects';
  async function load() {
    let token;
    try { token = localStorage.getItem('wly-cockpit-device'); } catch { /* 无法读取配对信息 */ }
    if (!/^[A-Za-z0-9_-]{43}$/.test(token || '')) { owner.hidden = true; gate.hidden = false; rows.innerHTML = ''; return; }
    button.disabled = true;
    gate.textContent = '正在计算全部项目。';
    gate.hidden = false;
    owner.hidden = true;
    rows.innerHTML = '';
    try {
      const r = await fetch(endpoint, {cache:'no-store', credentials:'omit', headers:{'X-Cockpit-Device':token}, signal:AbortSignal.timeout(90000)});
      const data = await r.json();
      if (r.status === 403 || data.viewer?.kind === 'public') { gate.textContent = '这一页只给本人看'; return; }
      if (!r.ok || data.viewer?.kind !== 'owner') throw new Error('读取失败');
      if (data.schema !== 'pcconfig.cockpit-projects.v1' || !Array.isArray(data.projects)) throw new Error('数据不完整');
      rows.innerHTML = renderProjects(data);
      const at = new Date(data.observed_at).toLocaleString('zh-CN', {timeZone:'Asia/Shanghai',hour12:false});
      status.textContent = `共 ${data.projects.length} 个项目；${at} 计算。${[...(data.issues || []), ...(data.projects.some(p=>p.error) ? ['部分项目没读全，请看表里的“未读到”。'] : [])].join(' ')}`;
      gate.hidden = true;
      owner.hidden = false;
    } catch { gate.textContent = '暂时读不到项目，请稍后重新打开这一页。'; }
    finally { button.disabled = false; }
  }
  button.addEventListener('click', load);
  addEventListener('pageshow', e => { if (e.persisted) load(); });
  load();
}
