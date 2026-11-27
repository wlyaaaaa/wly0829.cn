(() => {
  'use strict';
  const pages = window.ProjectPages ||= {};
  const U = window.LiveUI, { esc } = U;
  const unread = '暂时读不到';
  const frozen = d => d.mode === 'frozen_static';
  const number = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 });
  // 快照以北京时间返回，保留年份与时分，省去“多久以前”。
  const day = at => typeof at === 'string' && /^\d{4}-\d\d-\d\dT/.test(at) ? at.slice(0, 10) : '';
  const clock = at => day(at) && at.slice(0, 16).replace('T', ' ');
  const value = (n, unit) => Number.isFinite(n)
    ? `<span title="${number.format(n)} ${unit}">${number.format(n < 1e4 ? n : n / 1e4)}<small>${n < 1e4 ? '' : '万'}${unit}</small></span>`
    : `<span class="pj-archive-unread">${unread}</span>`;
  const cell = (label, reading, detail = '') => `<div><dt>${label}</dt><dd>${reading}${detail}</dd></div>`;

  function repoButton(archive, viewer) {
    const label = 'GitHub 仓库 <span aria-hidden="true">↗</span>';
    if (viewer !== 'owner' && archive.repository_private === true)
      return `<button class="pj-archive-repo" type="button" data-frozen-repository>${label}</button>`;
    const url = archive.repository_url;
    if (/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(url || ''))
      return `<a class="pj-archive-repo" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    return `<span class="pj-archive-repo pj-archive-unread">GitHub 仓库${unread}</span>`;
  }
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-frozen-repository]')) window.TrustModal?.show();
  });

  function archiveCard(d, viewer, graphBlock) {
    const archive = d.frozen_archive || {};
    const last = day(archive.last_commit_at), first = day(archive.first_commit_at);
    const hero = document.querySelector('#pj-hero [data-part="about"]');
    const intro = archive.description && U.fieldHtml(archive.description, { name: '项目介绍', kind: viewer });
    hero.hidden = false;
    U.html(hero, `<span class="pj-when">最后一次提交：${esc(clock(archive.last_commit_at) || unread)}</span>
      <a class="more more--link pj-archive-details" href="#frozen-archive">详情 <span class="more__chev">›</span></a>
      ${intro ? `<span class="pj-about">${intro}</span>` : ''}
      <span class="pj-about pj-archive-note">${U.fieldHtml(d.note || '项目已冻结，保留已有资料，不再更新运行数据。', { name: '项目状态', kind: viewer })}</span>`, false);

    const block = graphBlock('frozen-archive', '');
    block.head.hidden = true;
    block.el.tabIndex = -1;
    const cutoff = last ? `截止 ${last.replace('-', '年').replace('-', '月')}日 最后一次提交` : `最后一次提交${unread}`;
    const lines = Number.isFinite(archive.code_lines) ? `代码 ${number.format(archive.code_lines)} 行` : `代码行数${unread}`;
    const grid = [
      cell('第一次提交', first || `<span class="pj-archive-unread">${unread}</span>`),
      cell('提交次数', value(archive.commit_count, '次')),
      cell('文档', value(archive.docs_chars, '字')),
      cell('代码', value(archive.code_chars, '字'), `<small class="pj-archive-lines">${lines}</small>`),
    ].join('');
    U.html(block.viz, `<header class="pj-archive-title"><h2>冻结档案</h2><p>${esc(cutoff)}</p></header>
      <div class="pj-archive-body"><dl>${grid}</dl>${repoButton(archive, viewer)}</div>`, false);
    return [block];
  }

  pages.frozenArchive = {
    register(id) {
      if (!id) return;
      const original = Object.hasOwn(pages, id) ? pages[id] : {};
      pages[id] = {
        ...original,
        adapt(d) {
          return frozen(d) ? { ...d, size: null, sections: [], counts: null, artifacts: null, changes7: null }
            : original.adapt?.(d) || d;
        },
        board(d, viewer, graphBlock, host) {
          return frozen(d) ? archiveCard(d, viewer, graphBlock) : original.board?.(d, viewer, graphBlock, host) || [];
        },
      };
    },
  };
})();
