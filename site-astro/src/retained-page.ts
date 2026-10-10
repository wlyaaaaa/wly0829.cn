import home from './chrome/retained/home.html?raw';
import cockpit from './chrome/retained/cockpit.html?raw';
import access from './chrome/retained/computer-access.html?raw';
import timeLabels from '../public/_home-cockpit/time-labels.css?raw';
import homeCta from '../public/_home-cockpit/home-cta.css?raw';
import albumRuntime from '../public/_album/astro-runtime.json';

// 保留候选站完整文档；不经过内容页的屏幕清单或动效坐标转换。
export function retainedPage(page: 'home' | 'cockpit' | 'computer-access') {
  let html = page === 'home' ? home : page === 'cockpit' ? cockpit : access;
  html = html.replace(/<script[^>]*data-album-inline[^>]*>.*?<\/script>/s, () => `<script data-album-inline>${albumRuntime.source}</script>`)
    .replace(/\/_album\/album-[\w]+\.css/g, albumRuntime.css);
  // 编码先于含中文的同步脚本；慢网和无 JS 也保持原图正确的横竖比例。
  html = html.replace(/<meta\s+charset=[^>]+>/i, '').replace('<head>', '<head><meta charset="utf-8">');
  const data = JSON.parse(html.match(/<script id="page-data"[^>]*>(.*?)<\/script>/s)![1]);
  // 顶栏使用透明原 WebP；不在它显示后升级到尚未接收完的 AVIF 背景。
  html = html.replace('</head>', `<style data-retained-header>:root{--nav-band-tile:url("${data.shared.art.header_tile}")!important}</style></head>`);
  if (page === 'home') {
    const buttons = data.screens[0].layouts.h.links.filter((link: any) => link.button);
    const practice = html.match(/<\/section>\s*<div class="screen-control-row" data-home-practice-link><a href="([^"]+)">([^<]+)<\/a><\/div>/)!;
    const links = [...buttons.map((link: any) => [link.href, link.text]), [practice[1], practice[2]]];
    html = html.replace(practice[0], `<nav class="home-hero-cta" aria-label="首页入口">${links.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav></section>`);
    html = html.replace('id="home-01"', 'id="home-01" data-home-cta="group"');
    const native = ['h', 'v'].map((orientation) => {
      const sizes = data.screens.map((screen: any) => {
        const [width, height] = screen.layouts[orientation].size;
        return `#${screen.id}{aspect-ratio:${width}/${height}!important}`;
      }).join('');
      return `@media(orientation:${orientation === 'h' ? 'landscape' : 'portrait'}){${sizes}}`;
    }).join('');
    const critical = timeLabels.split('/* 标签绘色 */')[0];
    // 加载占位的水彩底：原来从第一轮样板的 blocks.css 取 --card-bg；那份样式第四轮已换成区块库原样式（文件已删），值照抄在这里
    const watercolor = 'radial-gradient(circle at 0% 0%, rgba(150, 215, 172, .16), transparent 42%), '
      + 'radial-gradient(circle at 100% 100%, rgba(170, 225, 190, .14), transparent 40%), '
      + 'linear-gradient(165deg, #f2fbf5 0%, #fbfefc 55%, #f7fcf9 100%)';
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8"><style data-retained-native-layout>${native}${critical}html:not([data-home-opening="pending"]) .image-loading-wrap,#content>.screen:not(#home-01) .image-loading-wrap{background:${watercolor}!important}</style>`);
  }
  if (page !== 'computer-access') {
    const style = page === 'home' ? 'time-labels.css' : 'cockpit-offline.css';
    html = html.replace('</head>', `<link rel="stylesheet" href="/_home-cockpit/${style}"></head>`);
  }
  if (page === 'home') html = html.replace('</head>', `<style data-home-cta-layout>${homeCta}</style></head>`);
  if (page === 'cockpit') html = html.replace('</body>', '<script src="/_home-cockpit/cockpit-offline.js" defer></script></body>');
  return html;
}
