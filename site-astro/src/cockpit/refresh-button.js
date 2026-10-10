// 驾驶舱刷新按钮：常驻在“回到顶部”正上方，只在驾驶舱页出现。
// 点一次：请页面的数据层叫醒电脑重读（window.CockpitData.refresh），原地换数字，不整页重载、不动滚动位置。
// 数据层没准备好或电脑没回应时，按钮旁说清楚现在显示的是几点的数据。
(() => {
  const btn = document.querySelector('[data-cockpit-refresh]');
  if (!btn) return;
  const note = btn.parentElement.querySelector('[data-cockpit-refresh-note]');
  const hhmm = (sec) => new Date(sec * 1000).toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
  let hide = 0;
  const say = (text) => {
    clearTimeout(hide);
    note.textContent = text;
    note.hidden = false;
    hide = setTimeout(() => { note.hidden = true; }, 4000);
  };
  btn.addEventListener('click', async () => {
    if (btn.getAttribute('aria-busy') === 'true') return;
    const data = window.CockpitData;
    if (!data?.refresh) { say('页面还在读数据，稍等再点'); return; }
    btn.setAttribute('aria-busy', 'true');
    try {
      const r = await data.refresh({ wake: true });
      say(r?.fresh ? `已更新 ${hhmm(r.at)}` : `电脑没回应，现在显示的是 ${r?.at ? hhmm(r.at) : '之前'} 的数据`);
    } catch {
      say('电脑没回应，现在显示的是之前读到的数据');
    } finally {
      btn.setAttribute('aria-busy', 'false');
    }
  });
})();
