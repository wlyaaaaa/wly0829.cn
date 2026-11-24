(() => {
  'use strict';
  const { esc } = window.LiveUI;
  const lower = (source, key) => source.lower_bound === true || source.at_least === true || window.LiveProjectViz.lower(source, key);
  const missing = '没有记录';
  const number = n => n.toLocaleString('zh-CN');

  function introRow(m, href) {
    const hasCount = [m.count, m.value?.projects, m.value?.skills].some(Number.isFinite);
    const said = m.text ?? missing;
    const bounded = lower(m, 'count') || (m.value && lower(m.value, 'count'));
    const text = hasCount && bounded && !said.includes('至少') ? `至少 ${said}` : said;
    return {
      key: m.id, cls: 'pj-fig pj-fig--wide',
      html: href ? `<a class="pj-fig__v pj-fig__link pj-text" href="${esc(href)}">${esc(text)}${window.ProjectAdditions?.metricCadence(m) || ''} <span class="more__chev">›</span></a>` : `<span class="pj-fig__v pj-text">${esc(text)}${window.ProjectAdditions?.metricCadence(m) || ''}</span>`,
    };
  }

  function staticAge(row, stamp) {
    return [
      row.at && stamp(row.at),
      Number.isFinite(row.age_days) && `${lower(row, 'age_days') ? '至少 ' : ''}${number(row.age_days)} 天没更新`,
    ].filter(Boolean).join(' · ');
  }

  function unclassifiedApps(metric) {
    const { computer_count: computer, phone_count: phone } = metric.value || {};
    const apps = n => n == null ? missing : `${number(n)} 个`;
    return {
      ...metric, label: '还没分类的应用', expandable: false, section: null, href: null,
      text: computer == null && phone == null ? missing : `电脑 ${apps(computer)}、手机 ${apps(phone)}`,
      value: null, count: null, lower_bound: false, at_least: false,
    };
  }

  function todoRows(section, row, stamp) {
    return (section.metrics || []).filter(m => m.label || m.id === 'unclassified_apps').map(m => {
      if (m.id === 'unclassified_apps') return row(unclassifiedApps(m));
      const key = m.count == null ? 'value' : 'count', n = m[key];
      const text = Number.isFinite(n) ? `${lower(m, key) ? '至少 ' : ''}${number(n)}${m.unit ? ` ${m.unit}` : ''}` : missing;
      return row({
        ...m, text, value: null, count: null, lower_bound: false, at_least: false,
        note: m.id === 'stale_static' && (m.at || m.age_days != null) ? staticAge(m, stamp) : m.note,
      });
    });
  }

  const periods = {
    new_site_7d: '新站 · 近 7 天', new_site_30d: '新站 · 近 30 天',
    legacy_site_7d: '旧站 · 近 7 天', legacy_site_30d: '旧站 · 近 30 天',
  };
  const readings = [
    ['visitors', '来访人数', '人'], ['pageviews', '看的次数', '次'], ['new_visitors', '新访客', '人'],
    ['returning_visitors', '回头客', '人'], ['cv_opens', '专用链接打开', '次'],
  ];
  const ranks = [['top_pages', 'page', '看得最多的页'], ['sources', 'category', '从哪来']];
  const count = (source, key, unit, metric = source) => Number.isFinite(source[key])
    ? `${lower(source, key) || lower(metric, key) ? '至少 ' : ''}${number(source[key])} ${unit}` : missing;

  function ownerText(value, stamp) {
    if (value == null) return missing;
    if (Array.isArray(value)) return value.map(item => ownerText(item, stamp)).join('；') || missing;
    if (typeof value === 'object') {
      const labels = { at: '时刻', region: '地区', network: '网络', count: '次数', opens: '打开次数' };
      return Object.entries(value).map(([key, item]) => `${labels[key] || key} ${ownerText(item, stamp)}`).join('，') || missing;
    }
    return typeof value === 'string' && /^\d{4}-\d\d-\d\d(?:T|$)/.test(value) && Number.isFinite(Date.parse(value))
      ? stamp(value) : typeof value === 'number' ? number(value) : String(value);
  }

  function visitors(host, section, viewer, stamp) {
    const details = viewer === 'owner' ? section.owner_details : null;
    const signature = JSON.stringify([section.metrics, details, viewer]);
    if (host.dataset.readings === signature) return;
    host.dataset.readings = signature;
    const metrics = (section.metrics || []).filter(m => Object.hasOwn(periods, m.id));
    if (!metrics.length) { host.innerHTML = `<p class="pj-note">${missing}</p>`; return; }
    const ownFields = [['regions', '地区'], ['networks', '网络'], ['cv_visits', '专用链接逐次']];
    const privateRows = metrics.map(m => {
      const own = details?.[m.id];
      const rows = ownFields.filter(([key]) => own && Object.hasOwn(own, key));
      return rows.length ? `<p class="pj-skill-period">${periods[m.id]}</p>${rows.map(([key, label]) => `<p class="pj-note">${label}：${esc(ownerText(own[key], stamp))}</p>`).join('')}` : '';
    }).join('');
    host.innerHTML = metrics.map(m => {
      const v = m.value;
      const period = `<p class="pj-part"><b>${periods[m.id]}${window.ProjectAdditions?.metricCadence(m) || ''}</b></p>`;
      if (!v) return `<div>${period}<p class="pj-note">${missing}</p></div>`;
      const dates = v.from && v.to ? `<p class="pj-note">${esc(stamp(v.from))} 至 ${esc(stamp(v.to))}</p>` : '';
      const figures = readings.filter(([key]) => Object.hasOwn(v, key)).map(([key, label, unit]) => `
        <li class="pj-kv__row"><span class="pj-kv__k">${label}</span><span class="pj-kv__v"><b>${count(v, key, unit, m)}</b></span></li>`).join('');
      const charts = ranks.filter(([key]) => Object.hasOwn(v, key)).map(([key, , label]) =>
        `<p class="pj-skill-period">${label}</p><div data-visit-rank="${key}"></div>`).join('');
      return `<div data-visit-period="${m.id}">${period}${dates}<ul class="pj-kv">${figures}</ul>${charts}</div>`;
    }).join('') + (privateRows ? `<div><details><summary class="live-disclosure"><span class="disclosure-closed">本人明细</span><span class="disclosure-open">收起本人明细</span><span class="disclosure-chev">›</span></summary>${privateRows}</details></div>` : '');
    for (const m of metrics) {
      for (const [key, name] of ranks) {
        const target = host.querySelector(`[data-visit-period="${m.id}"] [data-visit-rank="${key}"]`);
        if (!target) continue;
        const rows = (m.value[key] || []).map((r, i) => ({
          key: i, name: r[name], value: r.opens, text: count(r, 'opens', '次'), hue: '#00A650',
        }));
        window.LiveViz.rank(target, { empty: missing, unit: '次' }).set(rows);
      }
    }
  }

  window.ProjectSiteReadings = { introRow, todoRows, visitors };
})();
