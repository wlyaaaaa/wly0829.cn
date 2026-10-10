/* Frozen how-demo v3 renderer. Narrative text comes only from how-demo-data.json. */
(()=>{'use strict';
const scope=document.getElementById('one-sentence');if(!scope||scope.dataset.howDemoInitialized)return;scope.dataset.howDemoInitialized='true';
const DATA=JSON.parse(scope.querySelector('[data-how-demo-data]').textContent);
const $=s=>scope.querySelector(s),reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');let reduce=reduceQuery.matches;
const {stories:STORIES,heads:HEADS,chipNames:CHIP_NAMES}=DATA;
const siteSpeed=()=>Number(window.SiteMotionAppearance?.speed_multiplier)||Number(scope.dataset.howDemoSiteSpeed);
let SPEED=siteSpeed(),autoStarted=false,visible=false,ready=false,frame=0;
const GAP=2,WAIT=2;
function tipText(value){if(value.startsWith('@model:'))return DATA.models[value.slice(7)];if(value.startsWith('@shared:'))return DATA.shared[value.slice(8)];return value;}
const IC=n=>DATA.assets[n].src;
function iconMarkup(n){const a=DATA.assets[n],box=a.crop||[0,0,...a.size];return `<svg class="how-demo-icon" viewBox="${box.join(' ')}" aria-hidden="true"><image href="${esc(a.src)}" width="${a.size[0]}" height="${a.size[1]}" crossorigin="anonymous"/></svg>`;}
const icons=list=>`<span class="ic${list.length>1?' two':''}">${list.map(iconMarkup).join('')}</span>`;
const DONE='<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="#13803d"/><path d="m9 15.4 4 4 8-8.2" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const narrow=()=>getComputedStyle($('#how-demo-app')).gridTemplateColumns.trim().split(/\s+/).length===1;
// ── 搭页面
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// 折行：卡片里的字按词切开，只在词和词之间留换行点（<wbr>），配合 CSS 的 word-break:keep-all，词不会从中间断开。
// 名字和小标题再按“ · ”分成几段，每段是一个整体（inline-block），优先在“·”处换行。不支持 Intl.Segmenter 的浏览器照旧按字折行。
const SEGR = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('zh', { granularity:'word' }) : null;
const CJK = /[　-〿一-鿿＀-￯]/;
function words(s) {
  if (!SEGR) return esc(s);
  const ps = [...SEGR.segment(s)].map(x => x.segment);
  const NOHEAD = /^[，。；：、）」』”’！？·％]/, NOTAIL = /[（「『“‘]$/;   // 标点不放行首、开括号不留行尾
  return ps.map((p, i) => (i > 0 && (CJK.test(p[0]) || CJK.test(ps[i - 1].slice(-1))) && !NOHEAD.test(p) && !NOTAIL.test(ps[i - 1]) ? '<wbr>' : '') + esc(p)).join('');
}
function nameHTML(s) {
  const parts = String(s).split(' · ');
  return parts.map((p, i) => `<span class="seg">${words(p)}${i < parts.length - 1 ? ' ·' : ''}</span>`).join(' ');
}
const pick = $('#how-demo-pick'), grid = $('#how-demo-grid'), resBox = $('#how-demo-result'), app = $('#how-demo-app'), wires = $('#how-demo-wires'), fly = $('#how-demo-fly'), slot = $('#how-demo-slot'), slottxt = $('#how-demo-slottxt'), who = $('#how-demo-who'), ill = $('#how-demo-ill');
STORIES.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'say'; b.type = 'button'; b.textContent = s.say; b.dataset.i = i;
  b.addEventListener('click', () => {
    autoStarted = true; select(i, true);
    // 手机上舞台在句子下面：点完把舞台滚到眼前，免得演出发生在屏幕外
    if (narrow()) slot.scrollIntoView({ block:'start', behavior: reduce ? 'auto' : 'smooth' });
  });
  pick.appendChild(b);
  const im = document.createElement('img'); im.src = DATA.assets[s.ill].src; im.alt = ''; ill.appendChild(im);
});
$('#how-demo-legend').innerHTML = DATA.ui.legend.map(l=>`<span data-tip="${esc(l.tip)}">${iconMarkup(l.icon)}${esc(l.text)}</span>`).join('')+DATA.ui.legendNotes.map(t=>`<span class="small">${esc(t)}</span>`).join('');

let cur = -1, R = [];
function build(i) {
  const s = STORIES[i]; TT = timing(s);
  grid.innerHTML = HEADS.map(h => `<div class="head" data-tip="${esc(h.tip)}"><b>${h.n}</b>${esc(h.t)}</div>`).join('');
  s.rows.forEach((r, k) => {
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML =
      `<div class="node card"><div class="in"><span class="num">${esc(DATA.ui.taskPrefix)} ${k + 1} ${esc(DATA.ui.taskSuffix)}</span><span class="t1 nice">${words(r.task)}</span></div></div>` +
      `<div class="node rule" data-tip="${esc(tipText(r.ruleTip))}"><div class="ring"></div><div class="in">${icons(['盾牌对勾'])}<span class="t1 reveal nice">${words(r.rule)}</span></div><span class="stamp${r.wait ? ' wait' : ''}">${esc(r.stamp)}</span></div>` +
      `<div class="node take" data-tip="${esc(tipText(r.take.tip))}"><div class="ring"></div><div class="in">${icons(r.take.ic)}<span class="t1 nice name">${nameHTML(r.take.name)}</span><span class="t2 nice name">${nameHTML(r.take.sub)}</span></div></div>` +
      `<div class="node ai" data-tip="${esc(tipText(r.tip))}"><div class="ring"></div><div class="in">${icons(r.ic)}<span class="t1 nice name">${nameHTML(r.model)}</span><span class="t2 reveal nice">${words(r.why)}</span>` +
        (r.act ? `<span class="act nice">${words(r.act.t)}</span>`.replace('act nice', `act ${r.act.kind} nice`) : '') + `</div></div>`;
    grid.appendChild(row);
  });
  resBox.innerHTML = `<div class="box" data-tip="${esc(DATA.ui.resultTip)}"><div class="ring"></div><div class="in"><span class="ic">${DONE}</span><div class="lab">${esc(DATA.ui.resultLabel)}</div>` +
    `<div class="msg"><span class="m"></span><span class="caret"></span></div>` +
    `<div class="chips"><span>${esc(DATA.ui.chipsLabel)}</span>${s.chips.map((c, j) => `<span class="chip" data-tip="${esc(c)}"><i></i>${CHIP_NAMES[j]}</span>`).join('')}</div>` +
    `<div class="by">${esc(s.by)}</div><a class="go" href="${s.link}">${esc(DATA.ui.goLabel)}</a></div></div>`;
  slottxt.textContent = s.say; who.textContent = s.who; fly.textContent = s.say;
  wires.innerHTML = '<defs><filter id="how-demo-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.6"/></filter></defs>';
  R = [...grid.querySelectorAll('.row')].map((row, k) => {
    const [card, rule, take, ai] = row.querySelectorAll('.node');
    const segs = [0, 1, 2, 3, 4].map(() => {
      const halo = mk('path', { fill:'none', stroke:'#c9ecd6', 'stroke-width':6, 'stroke-linecap':'round' });
      const p = mk('path', { fill:'none', stroke:'#3aae6a', 'stroke-width':2, 'stroke-linecap':'round' });
      wires.append(halo, p); return { p, halo, len:1 };
    });
    const dot = mk('g', {});
    dot.append(mk('circle', { r:9, fill:'#5fd394', opacity:.55, filter:'url(#how-demo-glow)' }), mk('circle', { r:4.6, fill:'#13803d' }), mk('circle', { r:1.8, fill:'#fff' }));
    const tails = [0, 1, 2].map(j => mk('circle', { r:3.4 - j * .8, fill:'#2f9e5a', opacity:.45 - j * .12 }));
    wires.append(...tails, dot);
    return { card, rule, take, ai, segs, dot, tails, wait: !!s.rows[k].wait, data: s.rows[k],
             ruleTxt: rule.querySelector('.reveal'), stamp: rule.querySelector('.stamp'), whyTxt: ai.querySelector('.reveal'), act: ai.querySelector('.act'),
             rings: [rule, take, ai].map(n => n.querySelector('.ring')), ins: [card, rule, take, ai].map(n => n.querySelector('.in')) };
  });
}
function mk(tag, attrs) { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }

// ── 量位置（相对 .app），排连线
let L = null;
function rel(el) { const a = app.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x:b.left - a.left, y:b.top - a.top, w:b.width, h:b.height, cx:b.left - a.left + b.width / 2, cy:b.top - a.top + b.height / 2 }; }
function curve(A, B) {
  const dx = B.x - A.x, dy = B.y - A.y;
  if (Math.abs(dx) >= Math.abs(dy)) return `M${A.x},${A.y} C${A.x + dx * .5},${A.y} ${B.x - dx * .5},${B.y} ${B.x},${B.y}`;
  return `M${A.x},${A.y} C${A.x},${A.y + dy * .5} ${B.x},${B.y - dy * .5} ${B.x},${B.y}`;
}
function layout() {
  if (cur < 0) return;
  // 先撤掉动画加上的位移和缩放，量到的才是落位后的真实位置
  slot.style.transform = ''; R.forEach(r => [r.card, r.rule, r.take, r.ai].forEach(n => n.style.transform = ''));
  const rb = resBox.querySelector('.box'); if (rb) rb.style.transform = '';
  const bs = rel(pick.children[cur]), ss = rel(slot), rs = rel(rb);
  const mobile = narrow();
  L = { btn:bs, slot:ss, res:rs, mobile, rows:[] };
  R.forEach((r, k) => {
    const c = rel(r.card), u = rel(r.rule), t = rel(r.take), a = rel(r.ai);
    const pts = !mobile ? [
      [{ x:ss.x + 26, y:ss.y + ss.h }, { x:c.x, y:c.cy }],
      [{ x:c.x + c.w, y:c.cy }, { x:u.x, y:u.cy }],
      [{ x:u.x + u.w, y:u.cy }, { x:t.x, y:t.cy }],
      [{ x:t.x + t.w, y:t.cy }, { x:a.x, y:a.cy }],
      [{ x:a.x + a.w, y:a.cy }, { x:rs.x + rs.w, y:rs.cy }]
    ] : [
      [{ x:c.x + 30, y:ss.y + ss.h }, { x:c.x + 30, y:c.y }],
      [{ x:c.x + 14, y:c.y + c.h }, { x:u.x, y:u.cy }],
      [{ x:u.x, y:u.cy }, { x:t.x, y:t.cy }],
      [{ x:t.x, y:t.cy }, { x:a.x, y:a.cy }],
      [{ x:a.x, y:a.cy }, { x:rs.cx, y:rs.y }]
    ];
    pts.forEach(([A, B], j) => {
      let d = curve(A, B);
      // 桌面：拆分的线沿小事这一列左边一根“树干”往下分叉；汇总的线沿右边绕下来，像一个大括号收进结果
      if (!mobile && j === 0) { const tx = A.x - 40; d = `M${A.x},${A.y} C${A.x},${A.y + 18} ${tx},${A.y + 10} ${tx},${A.y + 40} L${tx},${B.y - 16} Q${tx},${B.y} ${B.x},${B.y}`; }
      if (!mobile && j === 4) { const bx = Math.max(A.x, B.x) + 9; d = `M${A.x},${A.y} Q${bx},${A.y} ${bx},${A.y + 16} L${bx},${B.y - 16} Q${bx},${B.y} ${B.x},${B.y}`; }
      if (mobile && j >= 1 && j <= 3) d = `M${A.x},${A.y} C${A.x - 22},${A.y} ${B.x - 22},${B.y} ${B.x},${B.y}`;   // 手机：从左边绕下来
      if (mobile && j === 4) d = `M${A.x},${A.y} C${A.x - 30},${A.y} ${A.x - 30},${B.y - 40} ${B.x},${B.y}`;
      const s = r.segs[j]; s.p.setAttribute('d', d); s.halo.setAttribute('d', d); s.len = s.p.getTotalLength() || 1;
      s.p.style.strokeDasharray = s.halo.style.strokeDasharray = s.len;
    });
    L.rows.push({ c, u, t, a });
  });
  wires.setAttribute('viewBox', `0 0 ${app.clientWidth} ${app.clientHeight}`);
}

// ── 时间表：t 是“动效自己的秒”。所有画面都由 t 算出来，所以 seek(t) 能停在任意一刻逐格截图
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const span = (t, t0, dur) => clamp((t - t0) / dur);
const easeIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOut = x => 1 - Math.pow(1 - x, 3);
const back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const pop = x => x <= 0 ? 0 : Math.sin(Math.PI * clamp(x));

// 每一步都等上一步的字出全、再停 GAP：句子落位 1.2 → 卡片 3.2 起（出全 5.0）→ 规矩 7.0 起（字出全 8.7）→ 谁来接 10.7 起（亮全 12.2）
// → 派给谁 14.2 起（理由和短话出全 16.45）→ 汇总 18.45 起 → 结果逐字写出 → 停 GAP → 四个标签 → 跳转按钮
const T = {
  fly:1.2, ROW:.35,
  card:i => 3.2 + i * .3, cardDur:.9,
  seg1:7.0, seg2:10.7, seg3:14.2, seg4:18.45, segDur:.95, seg4Dur:1.1,
  typeDur:3.0, chipGap:.3
};
// 结果这一段跟着最后一条汇总线落地的时刻走（第 1 件要等验证的句子会晚一点）
function timing(s) {
  const last = Math.max(...s.rows.map((r, k) => T.seg4 + k * T.ROW + (r.wait ? WAIT : 0) + T.seg4Dur));
  const res = last - .9, type = last + .3, typeEnd = type + T.typeDur, chips = typeEnd + GAP, go = chips + 1.5;
  return { res, type, typeEnd, chips, go, glow:typeEnd, end: go + .5 };
}
let TT = null;

function apply(t) {
  scope.dataset.howDemoTime=t.toFixed(3);
  if (cur < 0 || !L) return;
  const s = STORIES[cur];
  // 0) 左栏的小插画：换句子时淡入
  [...ill.children].forEach((im, k) => { im.style.opacity = k === cur ? String(.25 + .75 * easeOut(span(t, 0, .8))) : '0'; });
  // 1) 句子从左边飞到舞台上方
  const fp = easeIO(span(t, 0, T.fly)), landed = t >= T.fly;
  if (t > 0 && !landed) {
    const b = L.btn, d = L.slot;
    const x = b.x + (d.x - b.x) * fp, y = b.y + (d.y - b.y) * fp - Math.sin(Math.PI * fp) * 26;
    fly.style.width = (b.w + (d.w - b.w) * fp) + 'px';
    fly.style.transform = `translate(${x}px,${y}px) rotate(${Math.sin(Math.PI * fp) * -2.2}deg)`;
    fly.style.opacity = String(clamp(t / .15));
  } else fly.style.opacity = '0';
  const sp = pop(span(t, T.fly, .5));
  slottxt.style.opacity = landed ? '1' : '0'; who.style.opacity = landed ? '1' : '.35';
  slot.style.borderStyle = landed ? 'solid' : 'dashed';
  slot.style.borderColor = landed ? '#2f9e5a' : '#c3ead0';
  slot.style.boxShadow = landed ? `0 0 0 ${3 + sp * 7}px rgba(47,158,90,${.10 + sp * .12})` : 'none';
  slot.style.transform = `scale(${1 + sp * .035})`;

  // 2) 每行：卡片从句子里分出来落位，光点依次走过 规矩 → 接活 → 派给，最后汇到结果
  R.forEach((r, k) => {
    const g = L.rows[k], dk = k * T.ROW, wt = r.wait ? WAIT : 0;
    const cp = span(t, T.card(k), T.cardDur), ce = back(cp);
    r.card.style.transform = `translate(${(L.slot.cx - g.c.cx) * (1 - ce)}px,${(L.slot.cy - g.c.cy) * (1 - ce)}px) scale(${.55 + .45 * clamp(ce, 0, 1.2)})`;
    r.card.style.opacity = String(clamp(cp * 3));
    seg(r.segs[0], easeOut(cp), cp > 0);

    const st = [T.seg1 + dk, T.seg2 + dk + wt, T.seg3 + dk + wt, T.seg4 + dk + wt];
    const ps = st.map((x, j) => span(t, x, j === 3 ? T.seg4Dur : T.segDur));
    ps.forEach((p, j) => seg(r.segs[j + 1], easeIO(p), p > 0));
    let on = -1; for (let j = 0; j < 4; j++) if (ps[j] > 0 && ps[j] < 1) on = j;
    const waiting = r.wait && t >= st[0] + T.segDur && t < st[1];
    const verified = st[1] - GAP;   // 等验证的那一步：这一刻换成“已验证”，再停 GAP 才往下走
    if (on >= 0) {
      const sg = r.segs[on + 1], p = easeIO(ps[on]);
      place(r.dot, sg, p, 1); r.tails.forEach((c, j) => place(c, sg, Math.max(0, p - (j + 1) * .05), 1));
    } else if (waiting) {
      // 停在规矩这一格门口，一闪一闪地等我点头；验证过后不再闪，稳稳地等下一步
      const sg = r.segs[1]; place(r.dot, sg, 1, t < verified ? .55 + .45 * Math.abs(Math.cos((t - st[0]) * 5)) : 1); r.tails.forEach(c => c.style.opacity = '0');
    } else { r.dot.style.opacity = '0'; r.tails.forEach(c => c.style.opacity = '0'); }

    const lit = [ps[0] >= 1, ps[1] >= 1, ps[2] >= 1];
    const arrive = [st[0] + T.segDur, st[1] + T.segDur, st[2] + T.segDur];
    [r.rule, r.take, r.ai].forEach((n, j) => {
      const a = span(t, arrive[j], .55);
      n.style.transform = `scale(${1 + pop(a) * .06})`;
      r.ins[j + 1].style.opacity = String(cp <= 0 ? 0 : (lit[j] ? .35 + .65 * easeOut(clamp(a * 2)) : .32));
      r.ins[j + 1].style.filter = lit[j] ? 'none' : 'grayscale(1)';
      const rp = span(t, arrive[j], .7);
      r.rings[j].style.opacity = String(rp > 0 && rp < 1 ? (1 - rp) * .9 : 0);
      r.rings[j].style.transform = `scale(${1 + rp * .06})`;
    });
    r.ruleTxt.style.clipPath = `inset(0 ${(1 - easeOut(span(t, arrive[0] - .05, .8))) * 100}% 0 0)`;
    // 印章：要我点头的那一步先盖“等你验证”，等完换成“已验证”
    const sa = span(t, arrive[0] + .1, .5);
    if (r.wait) {
      const done = t >= verified, sb = span(t, verified, .4);
      r.stamp.textContent = done ? r.data.stamp2 : r.data.stamp;
      r.stamp.classList.toggle('wait', !done);
      r.stamp.style.opacity = String(clamp(sa * 3));
      r.stamp.style.transform = done ? `scale(${1 + pop(sb) * .35}) rotate(-6deg)` : `scale(${sa <= 0 ? 1.8 : 1 + (1 - easeOut(sa)) * .8 + Math.sin((t - arrive[0]) * 6) * .04}) rotate(-6deg)`;
    } else {
      r.stamp.style.opacity = String(clamp(sa * 3));
      r.stamp.style.transform = `scale(${sa <= 0 ? 1.8 : 1 + (1 - easeOut(sa)) * .8}) rotate(-6deg)`;
    }
    r.whyTxt.style.clipPath = `inset(0 ${(1 - easeOut(span(t, arrive[2] - .05, .9))) * 100}% 0 0)`;
    if (r.act) r.act.style.clipPath = `inset(0 ${(1 - easeOut(span(t, arrive[2] + .5, .8))) * 100}% 0 0)`;
  });

  // 3) 结果：框先出现，等光点汇齐后逐字写出；再依次亮出“这一句里看得到”的四样，最后给跳转按钮
  const box = resBox.querySelector('.box'), rin = box.querySelector('.in');
  const rp = span(t, TT.res, .8);
  box.style.opacity = String(rp <= 0 ? 0 : .35 + .65 * easeOut(rp));
  box.style.transform = `translateY(${(1 - easeOut(rp)) * 10}px)`;
  const ty = span(t, TT.type, T.typeDur);
  box.querySelector('.m').textContent = s.result;
  box.querySelector('.caret').style.opacity = (ty > 0 && ty < 1) ? '1' : '0';
  rin.style.borderColor = ty >= 1 ? '#2f9e5a' : '#c3ead0';
  [...box.querySelectorAll('.chip')].forEach((c, j) => {
    const cp = span(t, TT.chips + j * T.chipGap, .4);
    c.style.opacity = String(easeOut(cp)); c.style.transform = `translateY(${(1 - easeOut(cp)) * 6}px) scale(${1 + pop(cp) * .08})`;
  });
  const gp = easeOut(span(t, TT.go, .5)), go = box.querySelector('.go');
  go.style.opacity = String(gp); go.style.transform = `translateY(${(1 - gp) * 6}px)`;
  const gl = span(t, TT.glow, .7);
  box.querySelector('.ring').style.opacity = String(gl > 0 && gl < 1 ? (1 - gl) : 0);
  box.querySelector('.ring').style.transform = `scale(${1 + gl * .04})`;
}
function seg(s, p, show) {
  s.p.style.strokeDashoffset = s.halo.style.strokeDashoffset = s.len * (1 - p);
  s.p.style.opacity = show ? '1' : '0'; s.halo.style.opacity = show ? '.6' : '0';
}
function place(el, s, p, op) {
  const q = s.p.getPointAtLength(s.len * clamp(p));
  el.setAttribute('transform', `translate(${q.x},${q.y})`); el.style.opacity = String(op);
}


const V={t:0,playing:false,last:0};
function mark(){scope.dataset.howDemoStory=String(cur);scope.dataset.howDemoPhase=V.playing?(visible&&!document.hidden?'playing':'paused'):(TT&&V.t>=TT.end?'complete':'idle');scope.dataset.howDemoSpeed=String(SPEED);}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;}
function schedule(){if(V.playing&&visible&&!document.hidden&&!reduce&&!frame){V.last=performance.now();frame=requestAnimationFrame(tick);}mark();}
function select(i,play){stop();SPEED=siteSpeed();if(i!==cur){cur=i;build(i);} [...pick.children].forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',String(k===i));});layout();V.t=reduce?TT.end:0;V.playing=!reduce&&play;apply(V.t);schedule();}
function tick(now){frame=0;if(!V.playing||!visible||document.hidden||reduce){mark();return;}if(window.SiteMotionInsurance?.snapshot?.stalled||document.body.classList.contains('motion-stalled')){V.t=TT.end;V.playing=false;apply(V.t);mark();return;}SPEED=siteSpeed();const dt=Math.max(0,(now-V.last)/1000);V.last=now;V.t=Math.min(TT.end,V.t+dt*SPEED);if(V.t>=TT.end)V.playing=false;apply(V.t);mark();if(V.playing)frame=requestAnimationFrame(tick);}
let resizing=0;
const refresh=()=>{cancelAnimationFrame(resizing);resizing=requestAnimationFrame(()=>{layout();apply(V.t);});};
addEventListener('resize',refresh);new ResizeObserver(refresh).observe(app);
reduceQuery.addEventListener('change',e=>{reduce=e.matches;if(reduce){stop();V.playing=false;V.t=TT.end;apply(V.t);}schedule();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else schedule();mark();});
let tipFor=null;const tip=$('#how-demo-tip');
function hideTip(){tipFor=null;tip.classList.remove('on');}
function showTip(el){const txt=el.getAttribute('data-tip');if(!txt)return;tipFor=el;tip.textContent=txt;tip.classList.add('on');const b=el.getBoundingClientRect();tip.style.maxWidth=Math.min(310,innerWidth-24)+'px';let y=b.bottom+8;if(y+tip.offsetHeight>innerHeight-8)y=Math.max(8,b.top-tip.offsetHeight-8);tip.style.left=Math.min(innerWidth-tip.offsetWidth-12,Math.max(12,b.left+b.width/2-tip.offsetWidth/2))+'px';tip.style.top=y+'px';}
scope.addEventListener('mouseover',e=>{const el=e.target.closest('[data-tip]');if(el){if(el!==tipFor)showTip(el);}else hideTip();});
scope.addEventListener('click',e=>{const el=e.target.closest('[data-tip]');if(el&&matchMedia('(hover: none)').matches)el===tipFor?hideTip():showTip(el);else if(!el)hideTip();});
scope.addEventListener('focusin',e=>{const el=e.target.closest('[data-tip]');if(el)showTip(el);});scope.addEventListener('focusout',hideTip);addEventListener('scroll',hideTip,{passive:true});
select(0,false);
const ALL_IC=[...new Set(STORIES.flatMap(s=>s.rows.flatMap(r=>[...r.ic,...r.take.ic])).concat(DATA.ui.legend.map(l=>l.icon),'盾牌对勾'))];
const KEEP=[];const decodes=ALL_IC.map(n=>{const im=new Image();im.crossOrigin='anonymous';im.src=IC(n);KEEP.push(im);return im.decode().catch(()=>{});});
const fonts=document.fonts?.ready||Promise.resolve();const ownImages=[...scope.querySelectorAll('img')].map(im=>im.decode().catch(()=>{}));
Promise.all([fonts,...decodes,...ownImages]).then(()=>{ready=true;scope.dataset.howDemoReady='true';refresh();if(reduce){V.t=TT.end;apply(V.t);}else if(visible&&!autoStarted){autoStarted=true;select(0,true);}mark();});
const watcher=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scope.dataset.howDemoVisible=String(visible);if(!visible)stop();else if(ready&&!autoStarted){autoStarted=true;select(0,true);}else schedule();mark();},{threshold:0});watcher.observe($('#how-demo-stage'));
})();
