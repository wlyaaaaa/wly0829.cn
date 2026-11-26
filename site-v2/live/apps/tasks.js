(() => {
  'use strict';
  const U=window.LiveUI, V=window.LiveViz, C=window.LiveChart;
  function taskRows(d, viewer) {
    const items = d?.task_readings?.items;
    if (!items) {
      const confirmed = new Map();
      for (const key of ['cpu', 'gpu', 'memory']) for (const row of d?.apps_now?.[key] || []) {
        for (const origin of row.task_origins || []) {
          if (origin.id && origin.io) confirmed.set(origin.id, { ...origin.io, id: origin.id, name: origin.name });
        }
      }
      return [...confirmed.values()].map(row => taskRow(row, false));
    }
    return items.map(row => taskRow(row, true, viewer));
  }
  function taskRow(row, withResources, viewer) {
    const reading = (key, unit) => Number.isFinite(row[key]) ? C.value(row[key], unit) : '没有记录';
    const cpu = reading('cpu', '%');
    const processIo = `进程读 / 写 ${reading('read_bytes_per_second', 'B/s')} / ${reading('write_bytes_per_second', 'B/s')}`;
    const network = ['receive_bytes_per_second', 'send_bytes_per_second'].some(key => Object.hasOwn(row, key))
      ? `网络收 / 发 ${reading('receive_bytes_per_second', 'B/s')} / ${reading('send_bytes_per_second', 'B/s')}` : '';
    const resources = withResources ? `CPU ${cpu} · 内存 ${reading('memory', 'B')}` : '';
    // 后台在任务名上标了 visitor_labels.name（rewritten：访客看到的是换过的说法）的，名字那一行挂现有的小签；访客版也挂“对外换了说法”（M930）
    return { key: row.id, name: row.name, value: row.cpu, text: Number.isFinite(row.cpu) ? cpu : '', hue: '#00A650',
      name_tag: U.visitorLabel(row, ['$', 'name'], '任务名', viewer),
      sub: [resources, processIo, network].filter(Boolean).join(' · '), hasIo: true };
  }
  function batchRows(d, names = new Map()) {
    return (d?.batch_progress?.items || []).map(b=>({key:`batch:${b.id}`,name:'正在处理的一批',project:b.project && {name:names.get(b.project) || b.project,href:`/live/project/?id=${encodeURIComponent(b.project)}`},text:b.done != null && b.total != null ? `已完成 ${b.done}／共 ${b.total}` : '',sub:[b.remaining != null && `还剩 ${b.remaining} ${b.unit || '个'}`,b.rate_per_min != null && `每分钟 ${b.rate_per_min} ${b.unit || '个'}`,b.eta_at && `预计 ${U.date(b.eta_at)} ${U.time(b.eta_at)} 完成`,b.current && `正在${b.current}`,b.updated_at && `${U.date(b.updated_at)} ${U.time(b.updated_at)}`,b.q==='stale' && '这条记录已旧'].filter(Boolean).join(' · ')})).filter(r=>r.text || r.sub || r.project);
  }
  function renderBatches(host, rows) {
    U.list(host,rows.map(r=>({key:r.key,cls:'row row--flat',html:`<div class="row__text"><p class="row__main">${U.esc(r.name)}${r.project ? ` · <a href="${U.esc(r.project.href)}">${U.fieldHtml(r.project.name)}</a>` : ''}</p>${r.text ? `<p class="row__sub">${U.esc(r.text)}</p>` : ''}${r.sub ? `<p class="row__sub">${U.esc(r.sub)}</p>` : ''}</div>`})));
  }
  function mount() {
    const card=document.createElement('section'); card.className='card chat-stats'; card.hidden=true; card.id='apps-tasks'; card.style.margin='32px 0'; card.innerHTML='<div class="card__glass glass"><div class="card__body"><p class="part">按正在干的事看</p><p class="row__sub" data-task-scope>仅列出已明确对上任务的程序读数</p><p class="row__sub" data-task-note hidden></p><p class="row__sub" data-task-io hidden>进程读 / 写包含文件、网络和设备</p><div data-tasks></div><ul class="rows list" data-batches></ul></div></div>'; document.getElementById('board').before(card);
    const tasks=V.rank(card.querySelector('[data-tasks]'),{show:Infinity,top:false}); let current=null, viewer=null, names=new Map(), requested=false;
    function draw() {
      const rows=taskRows(current, viewer), batch=batchRows(current,names), reading=current?.task_readings;
      const note=card.querySelector('[data-task-note]');
      const seconds = (Date.parse(reading?.at) - Date.parse(reading?.from)) / 1000;
      const timing = seconds > 0 && rows.length ? `CPU 和读写取最近 ${Number(seconds.toFixed(1))} 秒的平均` : '';
      const status = reading?.q === 'stale' ? `上次任务读数 ${U.date(reading.at)} ${U.time(reading.at)}`
        : reading?.q === 'partial' ? '部分任务来源暂未读全' : reading?.q === 'unknown' ? '暂时读不到任务来源' : '';
      const withheld = viewer === 'public' && current && !Object.hasOwn(current, 'task_readings');
      card.querySelector('[data-task-scope]').hidden = withheld && !rows.length;
      note.textContent = [withheld && '按任务汇总的名称和资源读数仅本人可见', status, reading?.q !== 'stale' && timing].filter(Boolean).join(' · ');
      note.hidden=!note.textContent;
      card.hidden=!rows.length&&!batch.length&&note.hidden;
      card.querySelector('[data-tasks]').hidden=!rows.length;
      card.querySelector('[data-batches]').hidden=!batch.length;
      card.querySelector('[data-task-io]').hidden=!rows.some(row=>row.hasIo);
      tasks.set(rows); renderBatches(card.querySelector('[data-batches]'),batch);
    }
    window.Live.watch('computer',null,{data(d, meta) { current=d; viewer=meta.viewer?.kind; draw(); if(!requested && d?.batch_progress?.items?.some(b=>b.project)) {requested=true;window.Live.get('projects').then(r=>{names=new Map((r.data?.items || []).map(p=>[p.id,p.name]));draw();});} }});
  }
  U.taskDraw10={taskRows,batchRows,renderBatches}; mount();
})();
