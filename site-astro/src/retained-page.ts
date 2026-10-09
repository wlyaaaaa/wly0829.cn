import home from './chrome/retained/home.html?raw';
import cockpit from './chrome/retained/cockpit.html?raw';

// 这两页保留候选站完整文档；不经过内容页的屏幕清单或动效坐标转换。
export function retainedPage(page: 'home' | 'cockpit') {
  let html = page === 'home' ? home : cockpit;
  // 编码先于含中文的同步脚本；慢网和无 JS 也保持原图正确的横竖比例。
  html = html.replace(/<meta\s+charset=[^>]+>/i, '').replace('<head>', '<head><meta charset="utf-8">');
  if (page === 'home') {
    const data = JSON.parse(html.match(/<script id="page-data"[^>]*>(.*?)<\/script>/s)![1]);
    const native = ['h', 'v'].map((orientation) => {
      const sizes = data.screens.map((screen: any) => {
        const [width, height] = screen.layouts[orientation].size;
        return `#${screen.id}{aspect-ratio:${width}/${height}!important}`;
      }).join('');
      return `@media(orientation:${orientation === 'h' ? 'landscape' : 'portrait'}){${sizes}}`;
    }).join('');
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8"><style data-retained-native-layout>${native}</style>`);
  }
  const style = page === 'home' ? 'time-labels.css' : 'cockpit-offline.css';
  html = html.replace('</head>', `<link rel="stylesheet" href="/_home-cockpit/${style}"></head>`);
  if (page === 'cockpit') html = html.replace('</body>', '<script src="/_home-cockpit/cockpit-offline.js" defer></script></body>');
  return html;
}
