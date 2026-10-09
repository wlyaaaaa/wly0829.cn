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
  if (d) { p.width = d.w; p.height = d.h; }
  return el('img', p);
}

// —— 章节头：毛笔标题图 + 一句话 + 插画 ——
function chapter(node) {
  const title = data(node, 'title') || '';
  const brush = data(node, 'brush');
  const art = data(node, 'art');
  const level = data(node, 'level') === '1' ? 'h1' : 'h2';
  const heading = brush
    ? el(level, { className: ['brush-title'], dataTitleKey: fileKey(brush) }, [img(brush, title, { loading: 'eager', className: ['brush'] })])
    : el(level, { className: ['text-title'] }, [{ type: 'text', value: title }]);
  const body = node.children.filter((c) => !blank(c));
  const textCol = el('div', { className: ['chapter-text'] }, [heading, ...body]);
  const kids = [];
  if (art) {
    const living = data(node, 'living');
    const fig = el('figure', { className: ['chapter-art'], dataArtKey: fileKey(art) }, [img(art, '', { loading: 'eager' })]);
    if (living) fig.properties.dataLivingConfig = living;
    kids.push(fig);
  }
  kids.push(textCol);  // 插画在前：窄屏排在上面，宽屏浮到右上角
  return el('div', { className: ['chapter', art ? 'has-art' : 'no-art'], id: node.properties.id }, kids);
}

// —— 卡片组：::card 分隔，每张卡可带图标 ——
function cards(node) {
  const out = [];
  let cur = null;
  for (const c of node.children) {
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
  for (const a of out) {
    // 图标和卡片标题并排成一行
    const icon = a.children[0] && has(a.children[0], 'card-icon') ? a.children[0] : null;
    const h = a.children.find((c) => isTag(c, 'h4'));
    if (icon && h && a.children.indexOf(h) === 1) {
      a.children.splice(0, 2, el('div', { className: ['card-head'] }, [icon, h]));
    }
  }
  // 某张卡的字数远多于其他卡（超过中位数 2.2 倍）时让它独占一行，免得同排的短卡被拉出大块空白
  if (out.length >= 3) {
    const lens = out.map((a) => text(a).length);
    const med = [...lens].sort((x, y) => x - y)[Math.floor(lens.length / 2)];
    out.forEach((a, i) => { if (lens[i] > med * 2.2 && lens[i] > 160) a.properties.className.push('is-wide'); });
  }
  node.properties.dataN = String(out.length);
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
    if (num) box.children.push(el('div', { className: ['stat-num'] }, num.children));
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
    const top = el('div', { className: ['step-head'] }, [el('span', { className: ['step-no'] }, [{ type: 'text', value: String(i + 1) }])]);
    if (icons[i]) top.children.unshift(img(icons[i], '', { className: ['step-icon'] }));
    if (head) top.children.push(head);
    box.children.push(top);
    // 去掉正文开头的空白
    while (body.length && body[0].type === 'text' && !body[0].value.trim()) body.shift();
    if (body.length && body[0].type === 'text') body[0] = { ...body[0], value: body[0].value.replace(/^[\s　]+/, '') };
    if (body.length) box.children.push(el('div', { className: ['step-text'] }, body));
    return box;
  });
  const extra = node.children.filter((c) => c !== list && !blank(c));
  const n = out.length;
  node.properties.dataN = String(n);
  if (n > 5) node.properties.className.push('is-long');
  node.children = [el('ol', { className: ['step-list'] }, out), ...extra];
  return node;
}

// —— 表格：给每格写上列名；按各列最长的字数算出“整表至少要多宽”，比这窄就每行变一张卡 ——
const TBL_FS = 18;                     // 按最大正文字号估算（宽屏 18px），窄屏字号更小时只会更宽裕
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
    screens(tree);
  };
}
