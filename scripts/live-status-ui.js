(function (scope) {
  'use strict';

  const labels = Object.freeze({
    run: '运行状态', backup: '备份', image: '系统镜像', cloud: '云端维护',
    acceptance: '待验收', watch: '升级观察', local: '本机模型服务',
    config: '配置备份', wechat: '微信备份', sync: '项目同步',
    panel: '机箱屏画面', health: '缓存盘状态', capture: '画面采集',
    grafana: '图表网页', lessons: '学习进度', week: '近七天学习', practice: '练习进度'
  });
  const states = Object.freeze({
    ok: ['ok', '正常'], success: ['ok', '正常'],
    failed: ['failed', '失败'], error: ['failed', '出错已停'],
    warn: ['warn', '需要留意'], overdue: ['warn', '需要留意'],
    waiting: ['waiting', '待验收'], pending: ['waiting', '待处理'],
    running: ['running', '正在运行'], loading: ['loading', '读取中'],
    disabled: ['neutral', '已停用'], paused: ['neutral', '已暂停'],
    expired: ['neutral', '已到期'], none: ['neutral', '尚未开始'],
    not_applicable: ['neutral', '暂无任务'], learning: ['running', '学习中'],
    offline: ['unknown', '读不到电脑'], unknown: ['unknown', '读不到']
  });

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function safeURL(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    const url = value.trim();
    // Build-time copied relative assets and ordinary web links are supported.
    if (/^(?:https?:\/\/|\/(?!\/)|\.\.?\/)/i.test(url)) return url;
    return null;
  }

  function readDate(value) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      const date = new Date(value < 1e11 ? value * 1000 : value);
      return Number.isFinite(date.getTime()) ? date : null;
    }
    // A timezone is required; never reinterpret a source time in the browser's zone.
    if (typeof value !== 'string' || !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return null;
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  function beijingTime(value, historical) {
    const date = readDate(value);
    if (!date) return null;
    const parts = Object.fromEntries(new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).map(part => [part.type, part.value]));
    const day = historical ? parts.year + '年' + parts.month + '月' + parts.day + '日 ' : '';
    return { label: day + parts.hour + ':' + parts.minute, iso: date.toISOString() };
  }

  function view(result, options = {}) {
    const input = result && typeof result === 'object' ? result : {};
    const sourceState = text(input.state) || 'unknown';
    const cached = options.cached === undefined ? input.cached === true : options.cached === true;
    const history = cached || sourceState === 'stale' || input.source?.status === 'stale';
    const unavailable = !text(input.text) || ['unknown', 'offline', 'unavailable', 'stale'].includes(sourceState)
      || ['unknown', 'unavailable', 'offline', 'stale'].includes(input.source?.status);
    const state = history && !unavailable ? 'offline' : unavailable ? (sourceState === 'offline' ? 'offline' : 'unknown') : sourceState;
    const [tone, status] = states[state] || states.unknown;
    const title = text(options.title) || text(options.prefix) || labels[options.slot] || '当前状态';
    const body = text(input.text) || '暂时读不到';
    const lines = body.split(/\s+·\s+|\r?\n/).map(item => item.trim()).filter(Boolean);
    const readAt = options.readAt === undefined ? input.readAt : options.readAt;
    const time = beijingTime(readAt, history);
    return {
      title, body, lines, state, sourceState, tone, status, history, cached,
      time, timeLabel: time ? '北京时间 ' + time.label + (history ? ' 读到' : ' 读取') : '读取时间：读不到',
      href: safeURL(input.href), icon: safeURL(options.icon || options.icons?.[options.slot] || options.icons?.status)
    };
  }

  function node(document, tag, className, value) {
    const element = document.createElement(tag);
    element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  }

  function decorate(element, result, options = {}) {
    const document = element.ownerDocument;
    const model = view(result, options);
    element.classList.add('live-status-card');
    element.classList.toggle('live-status-history', model.history);
    element.classList.toggle('live-status-compact', options.compact === true);
    element.dataset.state = model.state;
    element.dataset.sourceState = model.sourceState;
    element.dataset.tone = model.tone;
    element.dataset.cached = String(model.cached);
    element.dataset.liveStatus = 'true';

    const heading = node(document, 'div', 'live-status-heading');
    if (model.icon) {
      const icon = node(document, 'img', 'live-status-icon');
      icon.src = model.icon;
      icon.alt = '';
      icon.width = 36;
      icon.height = 36;
      icon.setAttribute('aria-hidden', 'true');
      heading.append(icon);
    }
    heading.append(node(document, 'strong', 'live-status-title', model.title));
    if (model.history) heading.append(node(document, 'small', 'live-status-history-label', '历史记录'));

    const summary = node(document, 'div', 'live-status-summary');
    const dot = node(document, 'i', 'live-status-dot');
    dot.setAttribute('aria-hidden', 'true');
    const summaryText = model.history ? model.status : model.lines[0];
    summary.append(dot, node(document, 'strong', 'live-status-state', summaryText));

    const value = node(document, 'div', 'live-status-value');
    const details = model.history ? model.lines.filter(line => line !== model.status) : model.lines.slice(1);
    if (details.length > 1) {
      const list = node(document, 'ul', 'live-status-list');
      for (const line of details) list.append(node(document, 'li', 'live-status-line', line));
      value.append(list);
    } else if (details.length) value.append(node(document, 'span', 'live-status-line', details[0]));

    const footer = node(document, 'div', 'live-status-meta');
    const time = node(document, model.time ? 'time' : 'span', 'live-status-time', model.timeLabel);
    if (model.time) time.dateTime = model.time.iso;
    footer.append(time);
    if (model.history) footer.append(node(document, 'span', 'live-status-current-unknown', '当前状态读不到'));
    if (model.href && element.tagName === 'A') footer.append(node(document, 'span', 'live-status-link', '查看详情 ↗'));
    element.replaceChildren(heading, summary, ...(details.length ? [value] : []), footer);
    element.title = model.title + '：' + model.body + '；' + model.timeLabel + (model.history ? '；历史记录，当前状态读不到' : '');

    if (element.tagName === 'A') {
      if (model.href) {
        element.href = model.href;
        element.target = '_blank';
        element.rel = 'noopener';
        element.setAttribute('role', 'link');
      } else {
        element.removeAttribute('href');
        element.removeAttribute('target');
        element.removeAttribute('rel');
        element.setAttribute('role', 'status');
      }
    } else element.setAttribute('role', 'status');
    element.setAttribute('aria-live', options.announce === false ? 'off' : 'polite');
    return element;
  }

  function render(document, result, options = {}) {
    const element = document.createElement(safeURL(result?.href) ? 'a' : 'article');
    return decorate(element, result, options);
  }

  const api = Object.freeze({ render, decorate, view, beijingTime, labels, classNamespace: 'live-status-' });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.LiveStatusUI = api;
})(typeof window === 'undefined' ? globalThis : window);
