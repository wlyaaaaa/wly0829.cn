(() => {
  'use strict';
  const U = window.LiveUI;
  const text = (value, kind) => U.fieldText(value, kind).trim();
  const html = (value, kind) => text(value, kind) ? U.fieldHtml(value, { kind }) : '';
  const stage = { requested: '已请求接手', accepted: '已接手', continue: '继续跟进' };

  function detail(row, kind, fact) {
    const summary = text(row.progress_summary, kind);
    const owner = text(row.owner_detail, kind);
    const repeated = summary && owner.replace(/^进展[：:]\s*/u, '') === summary;
    const progress = [
      html(row.progress_summary, kind),
      !repeated && html(row.owner_detail, kind),
    ].filter(Boolean).join(' · ');
    return [
      html(row.why_you, kind) && fact('为什么要你处理', html(row.why_you, kind)),
      html(row.consequence, kind) && fact('不处理会怎样', html(row.consequence, kind)),
      html(row.done_when, kind) && fact('怎么算办完', html(row.done_when, kind)),
      progress && fact('最新进展', progress),
      typeof row.problem_present === 'boolean' && fact('复查', row.problem_present ? '问题还在' : '已经没了'),
    ];
  }

  function evidence(value, kind) {
    const shown = html(value, kind), href = text(value, kind);
    if (shown !== U.esc(href) || !/^(https?:\/\/|\/(?![/\\]))/i.test(href)) return shown;
    try {
      const url = new URL(href, location.origin);
      if (href.startsWith('/') && url.origin !== location.origin) return shown;
      return `<a href="${U.esc(url.href)}">${shown}</a>`;
    } catch { return shown; }
  }

  function event(row, kind, when, body) {
    const field = value => html(value, kind);
    const fields = (value, values) => {
      const inline = field(value);
      return inline || values.map(field).filter(Boolean).join(' · ');
    };
    const handoff = row.handoff, claim = row.claim;
    const extra = [
      ['证据', evidence(row.evidence_ref, kind)],
      ['修复摘要', text(row.repair_summary, kind) !== text(body, kind) && field(row.repair_summary)],
      ['复查条件', field(row.review_condition)],
      ['交接', fields(handoff, [
        Object.hasOwn(stage, handoff?.stage) ? stage[handoff.stage] : handoff?.stage,
        handoff?.at && when(handoff.at), handoff?.session, handoff?.plan_ref,
      ])],
      ['认领', fields(claim, [
        claim?.executor, claim?.claimed_at && `${when(claim.claimed_at)} 认领`,
        claim?.due_at && `到 ${when(claim.due_at)}`, claim?.session_id,
      ])],
    ].filter(([, value]) => value);
    const actor = field(row.actor);
    return {
      actor: actor ? `<small class="issue-event-actor">由谁处理：${actor}</small>` : '',
      extra: extra.length ? `<div class="run__out rec-prose issue-event-extra">${extra.map(([name, value]) => `<div>${name}：${value}</div>`).join('')}</div>` : '',
    };
  }

  function breakHeading(lead) {
    for (const node of lead?.childNodes || []) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const match = /，\s*(?=AI )/u.exec(node.data);
      if (!match) continue;
      node.splitText(match.index + match[0].length);
      node.after(document.createElement('br'));
      return;
    }
  }
  function conclusion(html) {
    if (/[<>]/.test(html)) return html;
    return html.replace(/\b([A-Z])盘/gu, '$1 盘')
      .replace(/\s*(\d+(?:\.\d+)?)\s*([KMGT]B)\b\s*/gu, ' $1 $2 ')
      .replace(/ (?=[，。；、！？）》）]|$)/gu, '')
      .replace(/([，,])\s*(?=[A-Z] 盘[^，。！？]*\d [KMGT]B)/u, '$1<br>')
      .replace(/(\d+(?:\.\d+)? [KMGT]B)\b/gu, '<span class="live-unit">$1</span>');
  }
  window.LiveIssueReadings = { detail, event, breakHeading, conclusion };
})();
