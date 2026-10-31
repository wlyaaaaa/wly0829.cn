const DRIVES = ['C', 'D', 'E', 'G', 'H'];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const valid = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const size = (n) => {
  if (!valid(n)) return '未读到';
  const [unit, divisor] = n >= 1e12 ? ['TB', 1e12] : ['GB', 1e9];
  return (n / divisor).toLocaleString('zh-CN', {maximumFractionDigits:2}) + ' ' + unit;
};
const time = (s) => Number.isFinite(Date.parse(s)) ? new Date(s).toLocaleString('zh-CN', {timeZone:'Asia/Shanghai', hour12:false}) : '时间未确认';
const shortTime = (s) => Number.isFinite(Date.parse(s)) ? new Date(s).toLocaleString('zh-CN', {timeZone:'Asia/Shanghai', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}) : '时间未确认';
const difference = (n) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${size(Math.abs(n))}`;

export function renderVolumes(data = {}, fresh = true) {
  const reported = Array.isArray(data.volumes) ? data.volumes : [];
  return DRIVES.map(drive => {
    const v = reported.find(row => row && String(row.drive).replace(':','').toUpperCase() === drive) || {};
    const available = v.state !== 'unavailable' && valid(v.total_bytes) && v.total_bytes > 0 && valid(v.used_bytes) && v.used_bytes <= v.total_bytes;
    const classified = available && valid(v.classified_bytes) ? Math.min(v.classified_bytes, v.used_bytes) : null;
    const unclassified = classified === null ? null : v.used_bytes - classified;
    const complete = v.classification_complete === true;
    const lowerBound = classified !== null && v.classified_lower_bound === true;
    const uncertain = classified !== null && !complete;
    const categories = (Array.isArray(v.categories) ? v.categories : []).filter(row => row && typeof row.label === 'string' && valid(row.bytes));
    const folders = (Array.isArray(v.top_directories) ? v.top_directories : []).filter(row => row && typeof row.label === 'string' && valid(row.bytes) && !(row.complete === false && row.bytes === 0)).slice(0,5);
    const topComplete = v.top_complete === true;
    const growth = available && typeof v.weekly_growth_bytes === 'number' && Number.isFinite(v.weekly_growth_bytes) && Number.isFinite(Date.parse(v.baseline_at));
    const tag = !fresh ? '历史采样' : !available ? '未读到' : !complete || !topComplete ? '测量不完整' : '已测完';
    const meter = classified === null ? '' : `<div class="storage-meter" role="img" aria-label="${esc(`用途已知 ${lowerBound ? '至少 ' : ''}${size(classified)}，还说不清 ${uncertain ? '至多 ' : ''}${size(unclassified)}，空闲 ${size(v.total_bytes-v.used_bytes)}`)}"><span class="is-known" style="width:${classified/v.total_bytes*100}%"></span><span class="is-unknown" style="width:${unclassified/v.total_bytes*100}%"></span></div>`;
    const details = categories.length ? `<ul class="storage-category-list">${categories.map(row => `<li><span>${esc(row.label)}${row.complete === false ? '（已测部分）' : ''}</span><b>${row.complete === false ? '≥ ' : ''}${esc(size(row.bytes))}</b></li>`).join('')}</ul>` : '<p class="storage-empty">暂未确认分类，这部分仍计入“还说不清”。</p>';
    const folderList = folders.length ? `<ol class="storage-top-list">${folders.map(row => `<li><span>${esc(row.label)}</span><b>${row.complete === false ? '≥ ' : ''}${esc(size(row.bytes))}</b></li>`).join('')}</ol>` : '<p class="storage-empty">还没有文件夹的完整读数，等待后台继续测量。</p>';
    return `<article class="storage-disk${available ? '' : ' is-unavailable'}${fresh ? '' : ' is-historical'}" data-drive="${drive}">
      <header class="storage-disk-head"><h2>${drive} 盘</h2><span class="storage-tag">${tag}</span></header>
      <p class="storage-used"><strong>${available ? esc(size(v.used_bytes)) : '未读到'}</strong><span>${available ? `已用 / ${esc(size(v.total_bytes))} 总容量` : '还不能判断已用与总容量'}</span></p>
      ${meter}
      <dl class="storage-facts">
        <div class="storage-fact"><dt>用途已知</dt><dd>${lowerBound ? '≥ ' : ''}${esc(size(classified))}<small>${lowerBound ? '已测下界' : classified !== null && !complete ? '已确认的部分' : '按分类去重合计'}</small></dd></div>
        <div class="storage-fact is-unexplained"><dt>还说不清的占用</dt><dd>${uncertain ? '≤ ' : ''}${esc(size(unclassified))}<small>${uncertain ? '最多还有这些待归类' : '已用减去用途已知'}</small></dd></div>
        <div class="storage-fact"><dt>近一周</dt><dd>${growth ? esc(difference(v.weekly_growth_bytes)) : available ? '样本不足' : '未读到'}<small>${growth ? `对比 ${esc(shortTime(v.baseline_at))}` : available ? '需要 6—8 天前的采样' : '等待读取磁盘采样'}</small></dd></div>
      </dl>
      <details class="storage-categories"><summary>分类明细（${categories.length} 项）</summary>${details}</details>
      <section class="storage-top"><h3>${topComplete ? '最大的 5 个文件夹' : '当前已测的大文件夹'}</h3>${folderList}</section>
    </article>`;
  }).join('');
}

export function renderCategories(data = {}, fresh = true) {
  return (Array.isArray(data.categories) ? data.categories : []).map(c => {
    const complete = c.complete === true && valid(c.bytes);
    const used = complete ? size(c.bytes) : `${valid(c.partial_bytes) ? '≥ ' + size(c.partial_bytes) : '未读到'}（测量不完整）`;
    const growth = c.baseline_at && typeof c.weekly_growth_bytes === 'number' && Number.isFinite(c.weekly_growth_bytes) ? `${difference(c.weekly_growth_bytes)}；对比 ${shortTime(c.baseline_at)}` : '样本不足';
    const status = c.alert === null ? (complete ? '未触发阈值' : '测量不完整') : ({budget:'超过容量预算，AI 处理', weekly_growth:'一周增长异常，AI 处理', measurement_incomplete:'测量不完整，AI 核对'}[c.alert] || '状态未知');
    const basis = c.budget_basis && c.budget_basis !== 'total-bytes.v1' && valid(c.budget_used_bytes)
      ? `；按扣除保留部分后的 ${size(c.budget_used_bytes)} 比预算${valid(c.retained_bytes) && c.retained_bytes > 0 ? `（还原期内 ${size(c.retained_bytes)} 不算）` : ''}` : '';
    return '<tr>' + [c.label, `${used}；预算 ${size(c.budget_bytes)}${basis}`, `${growth}；周增长阈值 ${size(c.growth_limit_bytes)}`, c.retention_zh || '规则未读到', `${fresh ? '' : '历史采样：'}${status}`].map(s => `<td>${esc(s)}</td>`).join('') + '</tr>';
  }).join('') || '<tr><td colspan="5">尚未读到分类采样。</td></tr>';
}

if (typeof document !== 'undefined') {
  const volumes = document.getElementById('storage-volumes'), rows = document.getElementById('storage-rows');
  const note = document.getElementById('storage-status'), button = document.getElementById('storage-refresh');
  const endpoints = /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname) ? ['/__status?view=cockpit'] : ['https://live.wly0829.cn/computer-access/state?view=cockpit', 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit'];
  async function load() {
    button.disabled = true;
    try {
      const stop = new AbortController(), timer = setTimeout(() => stop.abort(), 12000);
      const one = async (url) => { const r = await fetch(url, {cache:'no-store', credentials:'omit', signal:stop.signal}); if (!r.ok) throw new Error('HTTP ' + r.status); const d = (await r.json()).storage_pressure; if (d?.schema === 'pcconfig.ai-storage-pressure.v1' && (Array.isArray(d.volumes) || Array.isArray(d.categories))) return d; throw new Error('没有采样'); };
      let data;
      try { data = await Promise.any(endpoints.map(one)); } catch {} finally { clearTimeout(timer); stop.abort(); }
      if (!data) throw new Error('unavailable');
      const maxAge = Number(data.max_age_seconds) > 0 ? Number(data.max_age_seconds) * 1000 : 14*3600000;
      const age = Date.now() - Date.parse(data.observed_at), fresh = Number.isFinite(age) && age >= -60000 && age <= maxAge;
      const reported = Array.isArray(data.volumes) ? data.volumes : [];
      const incomplete = DRIVES.some(drive => !reported.some(v => v && String(v.drive).replace(':','').toUpperCase() === drive && v.classification_complete === true && v.top_complete === true));
      note.textContent = fresh ? `采样于 ${time(data.observed_at)}；显示采样时的状态。` : `采样已过期或时间无法确认（${time(data.observed_at)}），下面仅作历史参考。`;
      if (incomplete) note.textContent += ' 部分数据仍在测量，标 ≥ 的是下界。';
      volumes.innerHTML = renderVolumes(data, fresh);
      rows.innerHTML = renderCategories(data, fresh);
    } catch {
      volumes.innerHTML = renderVolumes();
      rows.innerHTML = '<tr><td colspan="5">当前读不到在线采样，稍后可重读状态。</td></tr>';
      note.textContent = '在线数据不可用；还不能判断当前占用与增长。';
    } finally { button.disabled = false; }
  }
  button.addEventListener('click', load);
  load();
}
