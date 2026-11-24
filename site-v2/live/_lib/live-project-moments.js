// 实况共用小件：项目读数里“这件事最后一次发生”的时刻（M769 C 类）。
// 这些读数后台每晚照常刷新，回包里的 at 却是这件事最后一次发生（上一次上课、上一次给材料、上一次真机验收……）的时刻，
// 后台再按“多久算旧”把它们标成旧、写“最近一次记录于 …”，页面看着像坏了。后台没有字段分得清，这里按项目和读数键写说法：
//   LiveProjectMoments.settle(projectId, project) → 项目回包的副本：表里的读数不再标旧，带上 moment（照这件事本身意思写的一句）
//   LiveProjectMoments.headline(item)            → 实况首页项目卡、项目列表用：代表数是表里的读数时，替“数据截至／读取于”的那一句；不是就给 ''
// 只认表里的读数；读数本身读失败（read_error 之类）照旧标旧。真停了的（A 类）不在表里，照旧标旧。
// when: 'stale' 的只在后台标了旧时才换（访客版回包里同一读数的时刻可能是取数时刻，没标旧就不动）；plain 只是不标旧，不另写一句（读数本身就是那个时刻）。
// code：规模类读数（文件数、字数），读数时刻不早于页头“最近一次提交”才写“按 MM-DD 那版代码算”；早于提交的是真没重算，照旧。
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LiveProjectMoments = api;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  'use strict';
  const PLAIN = { plain: true };
  const CODE = { code: true };
  const LEARN = { say: '学习记录最后整理于 {d}，上课或答题后才更新', when: 'stale' };
  const QUEUE = { say: '题单最后整理于 {d}，有新题或新作答才更新', when: 'stale' };
  const FILMS = { say: '{d} 以后没变过' };
  const DEMO = { say: '{d} 那次演示的结果' };
  const BOOK = { say: '账本最后整理于 {d}，给了新材料才会更新' };
  const HOME = { say: '主页最后更新 {d}' };
  const ACCEPT = { say: '{d} 验收' };
  const each = (ids, spec) => Object.fromEntries(ids.split(' ').map(key => [key, spec]));
  const TABLE = {
    'career-development': { ...each('completed started class_days quiz exercises known_minutes next_first_step', LEARN), progress_updated: { plain: true, when: 'stale' }, ...each('question_queue question_history', QUEUE) },
    'video-scaffold': { ...each('films duration latest checks versions legacy_chunks', FILMS), ...each('render_seconds render_fps', { say: '{d} 那一段测的' }), source_files: CODE },
    'work-delivery-copilot': { ...each('usage office', { say: '工作记录最后更新于 {d}' }), ...each('packages impact stale selected versions reporting_seconds launch_seconds', DEMO), latest_demo: PLAIN },
    'daily-preferences': { cognitions: { say: '认识库最后变动于 {d}' }, ...each('group-0 group-1 group-2 group-3 group-4 group-5', { say: '最后整理于 {d}' }) },
    'personal-finance': each('balance_date updated credit_until consumption_until credit_report asset_sources debt_sources references settled calendar_until credit_material calendar_entries calendar_days', BOOK),
    passwordcenter: { ...each('mobile_version mobile_code', { say: '{d} 装的' }), ...each('mobile_unlock mobile_sync', { say: '{d} 本人实测' }), desktop_installed: PLAIN },
    wechatdirect: { measurements: { say: '{d} 真机验收' }, environment: { say: '{d} 检查' } },
    localocr: each('tests skipped quality_cases quality_passed', ACCEPT),
    wlyaaaaa: { profile_observed: PLAIN, ...each('cards source_links image_files image_bytes', HOME) },
    pcconfig: { recovery_config: { say: '上次核对于 {d}' }, delivery_watch: { say: '设定于 {d}' }, restore_anchors: { say: '最后登记于 {d}' } },
    // 规模类：页头“有多大”（size）和更多数据里的文件数、字数
    'pc-panel-hub': { size: CODE, ...each('docs_files code_files docs_chars_raw code_chars code_words', CODE) },
    'vault-tool': { size: CODE, ...each('docs_files docs_words code_files code_chars code_words tracked_files', CODE) },
    'emerald-veil': { size: CODE, ...each('docs_files code_files config_files tracked_files', CODE) },
    key: { size: CODE, ...each('tracked_files document_files code_files', CODE) },
    proxyclean: { size: CODE, ...each('tracked_files doc_files code_files doc_words code_chars', CODE) },
    'sunshine-remote-streaming': { size: CODE, ...each('file_counts code_chars', CODE) },
    'steam-millennium-config-backup': { size: CODE, ...each('docs_files code_files config_files tracked_files code_chars', CODE) },
  };
  const parse = at => typeof at !== 'string' || !at ? NaN : Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}${at.length === 10 ? 'T00:00:00' : ''}+08:00`);
  // 北京时间的 MM-DD（不是今年的带年份）
  function day(at, now = Date.now()) {
    const t = parse(at);
    if (!Number.isFinite(t)) return '';
    const bj = new Date(t + 8 * 3600000).toISOString(), year = new Date(now + 8 * 3600000).toISOString().slice(0, 4);
    return bj.startsWith(year) ? bj.slice(5, 10) : bj.slice(0, 10);
  }
  const stale = m => m?.stale === true || m?.q === 'stale' || m?.state === 'stale' || /^(?:最近一次记录于|数据截[止至])\s/.test(m?.gap || '');
  const failed = m => !!(m?.read_error || m?.refresh_error || m?.error);
  const spec = (projectId, key) => (Object.hasOwn(TABLE, projectId || '') && Object.hasOwn(TABLE[projectId], key || '')) ? TABLE[projectId][key] : null;
  // 这一项要不要换、换成哪句：不换给 null，只不标旧给 ''
  function moment(projectId, key, m, changedAt) {
    const s = spec(projectId, key);
    if (!s || !m || failed(m) || s.when === 'stale' && !stale(m)) return null;
    const at = m.source_at || m.at;
    if (s.code) {
      const measured = parse(at), changed = parse(changedAt);
      return Number.isFinite(measured) && Number.isFinite(changed) && measured >= changed ? `按 ${day(at)} 那版代码算` : null;
    }
    if (s.plain) return '';
    const d = day(at);
    return d ? s.say.replace('{d}', d) : null;
  }
  function settleMetric(projectId, m, changedAt) {
    const text = moment(projectId, m?.id, m, changedAt);
    if (text == null) return m;
    const out = { ...m, moment: text || undefined };
    if (stale(m)) {
      if (!m.gap || m.gap === m.stale_text || /^(?:最近一次记录于|数据截[止至])\s/.test(m.gap)) delete out.gap;
      delete out.stale_text; out.stale = false;
      if (out.q === 'stale') out.q = 'ok';
      if (out.state === 'stale') out.state = 'ok';
    }
    return out;
  }
  function settle(projectId, project) {
    if (!project || typeof project !== 'object' || !Object.hasOwn(TABLE, projectId || '')) return project;
    const changedAt = project.changed?.at;
    const sections = Array.isArray(project.sections) ? project.sections.map(s => s && Array.isArray(s.metrics) ? { ...s, metrics: s.metrics.map(m => settleMetric(projectId, m, changedAt)) } : s) : project.sections;
    const sizeMoment = project.size && moment(projectId, 'size', project.size, changedAt);
    return { ...project, sections, ...(sizeMoment ? { size: { ...project.size, moment: sizeMoment } } : {}) };
  }
  // 首页项目卡、项目列表：代表数（headline）是表里的读数时用这一句
  function headline(item) {
    const h = item?.headline;
    if (!h || typeof h !== 'object') return '';
    return moment(item.id, h.id, h, item.changed?.at) || '';
  }
  return { settle, headline, moment, day };
});
