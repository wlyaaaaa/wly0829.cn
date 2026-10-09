// Markdown 区块记号 → HTML 外壳。
// 写法：:::cards ... :::（容器），::card{icon=...}（卡片分隔），:btn[文字]{href=...}（按钮链接）。
// 只做“记号变标签”，排版全部交给 CSS（自动适应宽度），结构整理在 rehype-blocks。
import { visit } from 'unist-util-visit';

function props(node, base) {
  const out = { className: base };
  for (const [k, v] of Object.entries(node.attributes || {})) {
    if (k === 'class') out.className.push(...String(v).split(/\s+/).filter(Boolean));
    else if (k === 'id') out.id = v;
    else out['data-' + k] = v;
  }
  return out;
}

export default function remarkBlocks() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = props(node, ['blk', 'blk-' + node.name]);
      } else if (node.type === 'leafDirective') {
        const data = node.data || (node.data = {});
        data.hName = 'hr';
        data.hProperties = props(node, ['brk', 'brk-' + node.name]);
      } else if (node.type === 'textDirective') {
        if (node.name === 'btn') {
          const data = node.data || (node.data = {});
          const a = node.attributes || {};
          data.hName = 'a';
          data.hProperties = { className: ['btn'], href: a.href || '#' };
        } else if (parent && typeof index === 'number') {
          // 不是本站记号（正文里偶然出现的 “:word”），原样还给正文
          const label = (node.children || []).map((c) => c.value || '').join('');
          parent.children.splice(index, 1, { type: 'text', value: ':' + node.name + (label ? '[' + label + ']' : '') });
        }
      }
    });
  };
}
