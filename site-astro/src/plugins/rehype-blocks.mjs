// 区块结构整理：把 remark-blocks 产出的外壳整理成固定的 HTML 结构。
// 原则：这里只决定“是什么”（章节头、卡片、数字、步骤、表格、对话、画廊），
// 不写任何宽度或列数；放几列、何时退成单列全在 src/styles/blocks.css 里按可用宽度自动决定。
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import crypto from 'node:crypto';

const keyCache = new Map();
function fileKey(src) {
  if (!src || !src.startsWith('/')) return undefined;
  if (!keyCache.has(src)) {
    try { keyCache.set(src, crypto.createHash('sha256').update(fs.readFileSync(path.join(PUBLIC, decodeURI(src)))).digest('hex')); }
    catch { keyCache.set(src, undefined); }
  }
  return keyCache.get(src);
}

const PUBLIC = path.join(process.cwd(), 'public');
const sizeCache = new Map();
function dims(src) {
  if (!src || !src.startsWith('/')) return null;
  if (sizeCache.has(src)) return sizeCache.get(src);
  let d = null;
  try {
    const s = imageSize(fs.readFileSync(path.join(PUBLIC, decodeURI(src))));
    d = { w: s.width, h: s.height };
  } catch { d = null; }
  sizeCache.set(src, d);
  return d;
}

const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const cls = (n) => (n && n.properties && n.properties.className) || [];
const has = (n, c) => n && n.type === 'element' && cls(n).includes(c);
const isTag = (n, t) => n && n.type === 'element' && n.tagName === t;
const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const blank = (n) => n.type === 'text' && !n.value.trim();
const data = (n, k) => { const p = n.properties || {}; return p['data-' + k] ?? p['data' + k[0].toUpperCase() + k.slice(1)]; };

function img(src, alt, extra = {}) {
  const d = dims(src);
  const p = { src, alt: alt || '', loading: 'lazy', decoding: 'async', ...extra };
  // 原图像素尺寸写成变量：样式按“旧画布 1 像素 = --u”缩放，图和现在显示得一样大
  if (d) { p.width = d.w; p.height = d.h; p.style = `--iw:${d.w};--ih:${d.h}`; }
  return el('img', p);
}

// —— 章节头：毛笔标题图 + 一句话 + 插画 ——
function chapter(node) {
  const title = data(node, 'title') || '';
  const brush = data(node, 'brush');
  const art = data(node, 'art');
  const level = data(node, 'level') === '1' ? 'h1' : 'h2';
  let brushImg = null;
  if (brush) {
    brushImg = img(brush, title, { loading: 'eager', decoding: 'sync', className: ['brush'] });
    const box = (data(node, 'brushbox') || '').split(',').map(Number);
    const d = dims(brush);
    if (d && box.length === 4 && box.every((v) => Number.isFinite(v))) {
      // 只显示有笔画的部分（显示时裁，原图不动），尺寸按裁后的像素算
      const cw = d.w - box[1] - box[3], ch = d.h - box[0] - box[2];
      brushImg.properties.style = `--iw:${cw};--ih:${ch};object-view-box:inset(${box[0]}px ${box[1]}px ${box[2]}px ${box[3]}px)`;
    }
  }
  const size = data(node, 'size') || 'large';
  const heading = brush
    ? el(level, { className: ['brush-title'], dataTitleKey: fileKey(brush), dataSize: size }, [brushImg])
    : el(level, { className: ['text-title'] }, [{ type: 'text', value: title }]);
  const body = node.children.filter((c) => !blank(c));
  // 现在的版式：标题下面那句短的“一句话”是绿色粗体导语；长的说明段落是正文，不加粗
  if (body[0] && body[0].tagName === 'p' && text(body[0]).length <= 48) body[0].properties = { ...(body[0].properties || {}), className: ['lead'] };
  const align = data(node, 'align') || (art ? 'left' : 'center');
  let fig = null;
  if (art) {
    const living = data(node, 'living');
    // 同步解码：下载完的那一帧就画出整张图，不会出现“占位底撤了、图还没画出来”的一瞬空白
    fig = el('figure', { className: ['chapter-art'], dataArtKey: fileKey(art) }, [img(art, '', { loading: 'eager', decoding: 'sync' })]);
    if (living) fig.properties.dataLivingConfig = living;
    const aw = data(node, 'artw');
    if (aw && /^[0-9.]+%$/.test(aw)) fig.properties.style = `--artw:${aw}`;
    if (data(node, 'artside') === 'left') fig.properties.dataSide = 'left';
  }
  // 靠左（首屏）：插画在前，浮到右上角，标题和一句话在左；居中：标题占满一行居中，插画在标题下面浮到右边
  const kids = align === 'center'
    ? [heading, ...(fig ? [fig] : []), el('div', { className: ['chapter-text'] }, body)]
    : [...(fig ? [fig] : []), el('div', { className: ['chapter-text'] }, [heading, ...body])];
  return el('div', { className: ['chapter', art ? 'has-art' : 'no-art'], dataAlign: align, id: node.properties.id }, kids);
}

// —— 卡片组：::card 分隔，每张卡可带图标 ——
function cards(node) {
  const out = [];
  let cur = null;
  for (const c of node.children) {
    if (has(c, 'brk-card') && data(c, 'head')) {  // 一组卡的小标题：占满一行，不画成卡
      cur = el('div', { className: ['cards-head'] }, []);
      out.push(cur);
      continue;
    }
    if (has(c, 'brk-card')) {
      const icon = data(c, 'icon');
      cur = el('article', { className: ['card'] }, []);
      if (icon) cur.children.push(img(icon, '', { className: ['card-icon'] }));
      const tone = data(c, 'tone');
      if (tone) cur.properties.dataTone = tone;
      out.push(cur);
      continue;
    }
    if (blank(c)) continue;
    if (!cur) { cur = el('article', { className: ['card'] }, []); out.push(cur); }
    cur.children.push(c);
  }
  const heads = out.filter((a) => has(a, 'cards-head'));
  for (const a of out) {
    if (heads.includes(a)) continue;
    // 结构照现在的功能卡：图在左（或上），文字一栏，状态是右上角一个彩色点
    const icon = a.children[0] && has(a.children[0], 'card-icon') ? a.children[0] : null;
    const rest = a.children.filter((c) => c !== icon);
    let dot = null;
    const pull = (nodes) => nodes.forEach((n) => {
      if (!n.children) return;
      n.children = n.children.filter((c) => {
        if (has(c, 'status-tag')) {
          const st = c.properties.dataState || 'on';
          dot = el('span', { className: ['status-dot'], dataState: st, title: text(c) }, [el('span', { className: ['sr'] }, c.children)]);
          return false;
        }
        return true;
      });
      pull(n.children);
    });
    pull(rest);
    const copy = el('div', { className: ['card-copy'] }, rest.filter((c) => !(isTag(c, 'p') && !text(c).trim() && !c.children.some((x) => x.type === 'element'))));
    a.children = [...(icon ? [icon] : []), copy, ...(dot ? [dot] : [])];
    if (dot) a.properties.dataStatus = dot.properties.dataState;
  }
  // 某张卡的字数远多于其他卡（超过中位数 2.2 倍）时让它独占一行，免得同排的短卡被拉出大块空白
  if (out.length >= 3) {
    const lens = out.map((a) => (heads.includes(a) ? 0 : text(a).length));
    const med = [...lens].sort((x, y) => x - y)[Math.floor(lens.length / 2)];
    out.forEach((a, i) => { if (lens[i] > med * 2.2 && lens[i] > 160) a.properties.className.push('is-wide'); });
  }
  node.properties.dataN = String(out.length - heads.length);
  node.children = out;
  return node;
}

// —— 数字条：- **65 份** 说明 ——
function stats(node) {
  const list = node.children.find((c) => isTag(c, 'ul') || isTag(c, 'ol'));
  const items = list ? list.children.filter((c) => isTag(c, 'li')) : [];
  const icons = (data(node, 'icons') || '').split(',').filter(Boolean);
  const out = items.map((li, i) => {
    const kids = li.children.filter((c) => !blank(c));
    const flat = kids.length === 1 && isTag(kids[0], 'p') ? kids[0].children : kids;
    const strongAt = flat.findIndex((c) => isTag(c, 'strong'));
    const num = strongAt >= 0 ? flat[strongAt] : null;
    const rest = flat.filter((_, k) => k !== strongAt);
    const box = el('div', { className: ['stat'] }, []);
    if (icons[i]) box.children.push(img(icons[i], '', { className: ['stat-icon'] }));
    if (num) {
      // 数字大、单位小（照现在）：“684 次”→ 684 + 小字“次”
      const t = text(num);
      const m = t.match(/^([0-9０-９.,，%+~～–\-:：]+)\s*(.*)$/);
      box.children.push(el('div', { className: ['stat-num'] }, m && m[2]
        ? [{ type: 'text', value: m[1] }, el('span', { className: ['stat-unit'] }, [{ type: 'text', value: ' ' + m[2] }])]
        : num.children));
    }
    while (rest.length && rest[0].type === 'text' && !rest[0].value.replace(/[\s\u3000]/g, '')) rest.shift();
    if (rest.length && rest[0].type === 'text') rest[0] = { ...rest[0], value: rest[0].value.replace(/^[\s\u3000]+/, '') };
    box.children.push(el('div', { className: ['stat-text'] }, rest));
    return box;
  });
  const extra = node.children.filter((c) => c !== list && !blank(c));
  node.properties.dataN = String(out.length);
  node.children = [el('div', { className: ['stat-row'] }, out), ...extra];
  return node;
}

// —— 步骤/时间线：列表的每一项是一步 ——
function steps(node) {
  const list = node.children.find((c) => isTag(c, 'ol') || isTag(c, 'ul'));
  const items = list ? list.children.filter((c) => isTag(c, 'li')) : [];
  const icons = (data(node, 'icons') || '').split(',').filter(Boolean);
  const out = items.map((li, i) => {
    const kids = li.children.filter((c) => !blank(c));
    const flat = kids.length && isTag(kids[0], 'p') ? [...kids[0].children, ...kids.slice(1)] : kids;
    const first = flat.findIndex((c) => !blank(c));
    const body = [];
    let head = null;
    if (first >= 0 && isTag(flat[first], 'strong')) {
      head = el('div', { className: ['step-title'] }, flat[first].children);
      body.push(...flat.slice(first + 1));
    } else body.push(...flat);
    const box = el('li', { className: ['step'] }, []);
    if (icons[i]) box.children.push(el('div', { className: ['step-pic'] }, [img(icons[i], '', { className: ['step-icon'] })]));
    const top = el('div', { className: ['step-head'] }, [el('span', { className: ['step-no'] }, [{ type: 'text', value: String(i + 1) }])]);
    if (head) top.children.push(head);
    const bodyBox = el('div', { className: ['step-body'] }, [top]);
    box.children.push(bodyBox);
    // 去掉正文开头的空白
    while (body.length && body[0].type === 'text' && !body[0].value.trim()) body.shift();
    if (body.length && body[0].type === 'text') body[0] = { ...body[0], value: body[0].value.replace(/^[\s　]+/, '') };
    if (body.length) bodyBox.children.push(el('div', { className: ['step-text'] }, body));
    return box;
  });
  const extra = node.children.filter((c) => c !== list && !blank(c));
  const n = out.length;
  node.properties.dataN = String(n);
  if (icons.some(Boolean)) node.properties.className.push('has-pics');
  if (n > 6) node.properties.className.push('is-long');
  node.children = [el('ol', { className: ['step-list'] }, out), ...extra];
  return node;
}

// —— 表格：给每格写上列名；按各列最长的字数算出“整表至少要多宽”，比这窄就每行变一张卡 ——
const TBL_FS = 20;                     // 按最大正文字号估算（宽屏 18px），窄屏字号更小时只会更宽裕
const TBL_STEP = 120;                  // 档位：blocks.css 里按 120px 一档写好了对应的容器查询
function table(t) {
  const head = t.children.find((c) => isTag(c, 'thead'));
  const headRow = head ? head.children.filter((c) => isTag(c, 'tr'))[0] : null;
  const names = headRow ? headRow.children.filter((c) => isTag(c, 'th')).map(text) : [];
  const body = t.children.find((c) => isTag(c, 'tbody'));
  const rows = body ? body.children.filter((c) => isTag(c, 'tr')) : [];
  const cols = Math.max(names.length, ...rows.map((tr) => tr.children.filter((c) => isTag(c, 'td')).length), 1);
  const longest = Array(cols).fill(0);
  names.forEach((n, i) => { longest[i] = Math.max(longest[i], n.length); });
  for (const tr of rows) tr.children.filter((c) => isTag(c, 'td')).forEach((td, i) => {
    if (names[i]) td.properties.dataLabel = names[i];
    longest[i] = Math.max(longest[i], text(td).length);
  });
  // 第一列是短名称（都不超过 10 字，如“日常识字”“两三个关键数字”）：整列不换行，免得被别的长列挤成一字一行
  if (longest[0] <= 10) {
    const mark = (c) => { c.properties = { ...(c.properties || {}), className: [...((c.properties || {}).className || []), 'nw'] }; };
    if (headRow) { const th = headRow.children.filter((c) => isTag(c, 'th'))[0]; if (th) mark(th); }
    for (const tr of rows) { const td = tr.children.filter((c) => isTag(c, 'td'))[0]; if (td) mark(td); }
  }
  // 会换行的列（超过 15 字）至少留 15 字宽；短列按自己的字数
  const need = longest.reduce((s, L) => s + Math.min(L, 15) * TBL_FS + 28, 0);
  for (const tr of [headRow, ...rows].filter(Boolean)) tr.children.filter((c) => isTag(c, 'td') || isTag(c, 'th')).forEach((cell, i) => {
    if (longest[i] > 15) cell.properties.dataWide = '';
  });
  const fit = Math.ceil(need / TBL_STEP) * TBL_STEP;
  return el('div', { className: ['tbl', names.length > 1 ? 'has-head' : 'no-head', 'tbl-fit-' + fit], dataCols: String(cols), dataNeed: String(Math.round(need)) }, [t]);
}

// —— 画廊：每张图按原比例分宽，同一行等高 ——
function gallery(node) {
  const figs = [];
  const extra = [];
  for (const c of node.children) {
    if (isTag(c, 'p')) {
      const imgs = c.children.filter((x) => isTag(x, 'img'));
      if (imgs.length) {
        for (const im of imgs) {
          const d = dims(im.properties.src) || { w: 4, h: 3 };
          const r = d.w / d.h;
          figs.push(el('figure', { className: ['shot'], style: `--r:${r.toFixed(4)}` }, [
            img(im.properties.src, im.properties.alt || ''),
            ...(im.properties.alt && im.properties.title !== 'nocap' ? [el('figcaption', {}, [{ type: 'text', value: im.properties.alt }])] : []),
          ]));
        }
        continue;
      }
    }
    if (!blank(c)) extra.push(c);
  }
  node.properties.dataN = String(figs.length);
  node.children = [el('div', { className: ['shots'] }, figs), ...extra];
  return node;
}

function dialogue(node) {
  node.children = node.children.filter((c) => !blank(c)).map((c) =>
    isTag(c, 'p') ? el('p', { className: ['bubble'] }, c.children) : c);
  // 全是短句（每句不超过 40 字）时允许像卡片一样换行铺开，避免右侧大块空白；有长句就保持单列
  const bubbles = node.children.filter((c) => has(c, 'bubble'));
  if (bubbles.length && bubbles.every((b) => text(b).length <= 40)) node.properties.className.push('is-short');
  return node;
}

function transform(node) {
  if (!node.children) return node;
  node.children = node.children.map((c) => {
    if (c.type !== 'element') return c;
    transform(c);
    if (has(c, 'blk-chapter')) return chapter(c);
    if (has(c, 'blk-cards')) return cards(c);
    if (has(c, 'blk-stats')) return stats(c);
    if (has(c, 'blk-steps')) return steps(c);
    if (has(c, 'blk-gallery')) return gallery(c);
    if (has(c, 'blk-dialogue')) return dialogue(c);
    if (has(c, 'blk-row')) return row(c);
    if (has(c, 'blk-annotate')) return annotate(c);
    if (isTag(c, 'table')) return table(c);
    if (isTag(c, 'img') && !c.properties.width) {
      const d = dims(c.properties.src);
      if (d) { c.properties.width = d.w; c.properties.height = d.h; }
      c.properties.loading = c.properties.loading || 'lazy';
    }
    return c;
  });
  return node;
}

// —— 旧构图的 row + width：同一行的块分栏左右排（栏宽照构图百分比；窄屏叠成一栏，见样式表）——
function row(node) {
  const ws = String(data(node, 'cols') || '').split(',').map(Number).filter((x) => x > 0);
  node.properties.style = `--row-cols:${ws.map((w) => `minmax(0,${w}fr)`).join(' ')}`;
  // 分栏里的步骤照现在竖排（样式表里 .blk-steps.in-col）
  const mark = (n) => { for (const k of n.children || []) { if (has(k, 'blk-steps')) k.properties.className.push('in-col'); mark(k); } };
  mark(node);
  return node;
}

// —— 编号标注截图：截图上按坐标放编号点；旁注按点的高度排在右边，引线连过去（窄屏旁注排到下面）——
function annotate(node) {
  const shot = data(node, 'shot');
  const w = Number(data(node, 'w')) || 60;
  const anchors = String(data(node, 'anchors') || '').split(';').filter(Boolean).map((a) => a.split(',').map(Number));
  const list = node.children.find((c) => isTag(c, 'ul') || isTag(c, 'ol'));
  const items = list ? list.children.filter((c) => isTag(c, 'li')) : [];
  // 旁注的高度：照点的高度，挨得太近就往下让（至少隔 9%）
  let last = -1;
  const ys = items.map((_, k) => { const a = anchors.find((x) => x[2] === k) || anchors[k]; let y = a ? a[1] : (k + .5) / Math.max(1, items.length); y = Math.max(y, last + .09); last = y; return y; });
  const figKids = [img(shot, data(node, 'alt') || '', { loading: 'lazy' })];
  const leads = [];
  items.forEach((li, k) => {
    const a = anchors.find((x) => x[2] === k) || anchors[k];
    const no = (text(li).trim().match(/^[0-9０-９]+/) || [String(k + 1)])[0];
    if (a) {
      figKids.push(el('span', { className: ['ann-dot'], style: `--x:${a[0]};--y:${a[1]}`, ariaHidden: 'true' }, [{ type: 'text', value: no }]));
      leads.push(el('span', { className: ['ann-lead'], style: `--x:${a[0]};--y:${a[1]};--ny:${ys[k]}`, ariaHidden: 'true' }, []));
    }
    li.properties = { ...(li.properties || {}), style: `--ny:${ys[k]}` };
  });
  const ol = el('ol', { className: ['ann-notes'] }, items);
  node.properties.style = `--mw:${w}%`;
  node.children = [el('div', { className: ['ann-stage'] }, [el('figure', { className: ['ann-shot'] }, figKids), ...leads, ol])];
  return node;
}

// 插画位：把同一屏章节头里的插画（带动画层的 figure）原样挪到构图写的那一栏
function artslots(root) {
  let lastChapter = null;
  const walk = (n) => {
    if (!n.children) return;
    for (let i = 0; i < n.children.length; i++) {
      const c = n.children[i];
      if (c.type !== 'element') continue;
      if (has(c, 'brk-screen')) lastChapter = null;
      if (has(c, 'chapter')) lastChapter = c;
      if (has(c, 'brk-artslot')) {
        const fig = lastChapter && lastChapter.children.find((k) => isTag(k, 'figure') && has(k, 'chapter-art'));
        if (fig) {
          lastChapter.children = lastChapter.children.filter((k) => k !== fig);
          lastChapter.properties.className = cls(lastChapter).filter((x) => x !== 'has-art').concat(['no-art', 'art-moved']);
          fig.properties.className = [...cls(fig), 'row-art'];
          n.children[i] = fig;
        } else n.children.splice(i--, 1);
        continue;
      }
      walk(c);
    }
  };
  walk(root);
}

// —— 分屏：每个章节头开一个白底面板，同一节的续屏并进上一块面板 ——
function screens(root) {
  const out = [];
  let cur = null;
  let lastSection = null;
  for (const c of root.children) {
    if (blank(c)) continue;
    const isChapter = has(c, 'chapter');
    if (has(c, 'brk-screen')) {
      const section = data(c, 'section');
      if (section && section !== lastSection) {
        out.push(el('div', { className: ['section-anchor'], id: section }));
        lastSection = section;
      }
      if (cur && data(c, 'continue') === '1') {
        cur.children.push(el('span', { className: ['screen-anchor'], id: c.properties.id }));
        continue;
      }
      cur = el('section', { className: ['sx-screen'], id: c.properties.id, dataScreen: c.properties.id, dataSection: data(c, 'section') }, []);
      out.push(cur);
      continue;
    }
    if (!cur || (isChapter && cur.children.some((k) => !has(k, 'screen-anchor')))) {
      cur = el('section', { className: ['sx-screen'] }, []);
      out.push(cur);
    }
    cur.children.push(c);
  }
  root.children = out;
}

export default function rehypeBlocks() {
  return (tree) => {
    transform(tree);
    artslots(tree);
    screens(tree);
  };
}
