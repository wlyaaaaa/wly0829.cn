(() => {
  'use strict';
  const RESOURCE = 'computer/responsiveness'; // 空值只读 computer 的内嵌块。
  const POLL_MS = 5000, FRESH_MS = 15000, MAX_POLL_MS = 60000;
  const remaining = (data, now) => Math.min(FRESH_MS, Date.parse(data.activity_last_sample_at) + FRESH_MS - now);

  function readings(data, fresh, { esc, time }) {
    const count = (n, unit) => `${esc(n)} ${unit}`;
    const clock = at => Number.isFinite(Date.parse(at)) ? esc(time(at)) : '';
    const last = (n, at) => {
      const stamp = n > 0 && clock(at);
      return stamp ? ` · 最近一次 ${stamp}` : '';
    };
    const hung = fresh ? data.current_hung_count : null;
    const names = data.current_hung || [], recent = data.recent_hung || [];
    const spike = data.frametime_spike_samples, past = data.recent_hung_count;
    const rows = list => `<ul class="rows stability-events">${list.map(item => {
      const from = clock(item.first_observed_at), to = clock(item.last_observed_at);
      const period = from && to ? `${from} 至 ${to}` : from || to;
      return `<li class="row"><div class="row__text"><p class="row__main">${esc(item.process_name)} · 采到 ${esc(item.sample_count)} 次没响应</p>${period ? `<p class="row__sub">${period}</p>` : ''}</div></li>`;
    }).join('')}</ul>`;
    const more = recent.length > 5 ? `<details class="vz-more" data-fold-count="${recent.length - 5}"><summary class="more"><span class="stability-more">展开（还有 ${recent.length - 5} 条）</span><span class="stability-less">收起</span> <span class="more__chev">›</span></summary>${rows(recent.slice(5))}</details>` : '';
    const end = clock(data.window_end);
    // 没读到时写后台给的原因（current_hung_gap、recent_hung_gap）；读数在、只是本页 15 秒没等到新采样的，写停在几点。
    const why = gap => typeof gap === 'string' && gap.trim() ? (/^正在/.test(gap.trim()) ? '' : '没读到：') + esc(gap.trim()) : '';
    const stale = data.current_hung_count != null && clock(data.activity_last_sample_at);
    const hungGap = why(data.current_hung_gap) || (stale ? `没读到：进程采样停在 ${stale}，已超过 15 秒没更新` : '当前无响应状态未读到');
    return {
      values: [spike == null ? esc(data.frametime_gap || '没有可统计的帧时间样本') : count(spike, '次') + last(spike, data.last_spike_at),
        (hung == null ? hungGap : hung === 0 ? '现在没有' : count(hung, '个')) + (hung > 0 && names.length ? ` · ${names.map(esc).join('、')}` : ''),
        past == null ? why(data.recent_hung_gap) || '近 5 分钟无响应的程序未读到' : count(past, '个程序') + last(past, data.last_hung_at)],
      details: recent.length ? `<p class="l2-part">无响应明细 · 程序窗口不响应，和画面卡顿分开算</p>${rows(recent.slice(0, 5))}${more}` : '',
      end: end ? `统计到 ${end}` : '',
    };
  }

  function markup({ values, details, end }) {
    const fields = ['近 5 分钟帧时间突增', '当前无响应', '近 5 分钟无响应'].map((label, i) =>
      `<div><dt class="l2-part">${label}</dt><dd class="row__main">${values[i]}</dd></div>`).join('');
    return `<div class="card__glass glass"><dl>${fields}</dl><div class="computer-responsiveness__detail"${details ? '' : ' hidden'}>${details}</div><p class="row__sub" data-window-end${end ? '' : ' hidden'}>${end}</p></div>`;
  }
  const render = (data, now, ui) => markup(readings(data, remaining(data, now) >= 0, ui));

  function track(data, now, previous) {
    if (!data) return null;
    if (previous?.data === data && (!now || previous.now === now)) return previous;
    return { data, now, expires: performance.now() + remaining(data, Date.parse(now)) };
  }

  function mount(host) {
    const { Live, LiveUI } = window;
    let embedded, fallback, latest, audience, pending, expiry, retry, previous;
    let delay = POLL_MS, failed = false;
    function paint() {
      clearTimeout(expiry);
      const reading = latest || fallback;
      const data = reading?.data, freshFor = reading?.expires - performance.now();
      const view = data == null ? null : readings(data, freshFor >= 0, LiveUI);
      const values = host.querySelector('dl')?.querySelectorAll('dd');
      host.hidden = data == null;
      const changed = [];
      if (!previous || !view || !values?.length) {
        LiveUI.html(host, view ? markup(view) : '', false);
        const detail = host.querySelector('.computer-responsiveness__detail');
        if (detail && view) detail._html = view.details;
      } else {
        view.values.forEach((text, i) => {
          if (text === previous.values[i]) return;
          LiveUI.html(values[i], text, false);
          changed.push(values[i]);
        });
        if (view.details !== previous.details) {
          const detail = host.querySelector('.computer-responsiveness__detail');
          const open = detail.querySelector('details[open]:not([data-fold-flat])');
          detail.hidden = !view.details;
          LiveUI.html(detail, open ? view.details.replace('<details ', '<details open ') : view.details, false);
        }
        if (view.end !== previous.end) {
          const end = host.querySelector('[data-window-end]');
          end.hidden = !view.end;
          LiveUI.html(end, view.end, false);
        }
      }
      previous = view;
      if (changed.length && !document.hidden && document.documentElement.classList.contains('mo-on')) {
        const style = getComputedStyle(document.documentElement);
        const duration = 200 * (parseFloat(style.getPropertyValue('--mo-speed')) || 1);
        const easing = style.getPropertyValue('--mo-out').trim() || 'cubic-bezier(.16,1,.3,1)';
        for (const node of changed) node.animate({ opacity: [.15, 1] }, { duration, easing });
      }
      if (freshFor >= 0 && data.current_hung_count != null) expiry = setTimeout(paint, freshFor + 1);
    }
    async function poll() {
      if (document.hidden || pending || !RESOURCE) return;
      clearTimeout(retry);
      pending = true;
      const viewer = audience;
      let ok = false;
      try {
        const { data, meta, now, offline, publicPaused } = await Live.get(RESOURCE);
        if (audience === viewer) {
          if (publicPaused || meta.status === 403 || meta.viewer?.kind !== viewer) {
            latest = fallback = embedded = null;
          } else if ([200, 304].includes(meta.status) && meta.source !== 'fallback' && data && 'window_end' in data) {
            latest = track(data, offline ? null : now, latest);
            ok = true;
          } else if (meta.status === 404) latest = null;
        }
      } catch { // 临时故障保留同一身份最后一次成功的数据。
      } finally {
        pending = false;
        delay = ok || !failed ? POLL_MS : Math.min(MAX_POLL_MS, delay * 2);
        failed = !ok;
        retry = setTimeout(poll, delay);
        paint();
      }
    }
    if (RESOURCE) {
      document.addEventListener('visibilitychange', () => { if (!document.hidden && audience !== undefined) { paint(); poll(); } });
    }
    // 和电脑页共用同一个请求，从 link 取得内嵌块所在回包的服务端时钟。
    Live?.watch?.('computer', null, { link(state) {
      const data = state.data?.responsiveness;
      const current = !state.offline && !state.publicPaused && [200, 304].includes(state.meta.status)
        && !['copy', 'fallback'].includes(state.meta.source);
      const old = embedded;
      embedded = track(data, current ? state.now : null, old);
      if (old && fallback === old && data === old.data && embedded !== old) {
        fallback = embedded;
        paint();
      }
    } });
    return (data, viewer) => {
      const initial = audience === undefined;
      if (audience !== viewer) latest = null;
      audience = viewer;
      fallback = embedded?.data === data ? embedded : track(data, data?.window_end, fallback);
      paint();
      if (initial) poll();
    };
  }

  window.ComputerResponsiveness = { mount, render };
})();
