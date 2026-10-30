import home from '../sources/retained-home-cockpit/home.html?raw';
import access from '../sources/retained-home-cockpit/computer-access.html?raw';
import timeLabels from '../public/_home-cockpit/time-labels.css?raw';
import homeCta from '../public/_home-cockpit/home-cta.css?raw';
import albumRuntime from '../public/_album/astro-runtime.json';
import motionRuntime from '../public/_living/quality-runtime/manifest.json';
import typesetStyles from './styles/typeset-page.css?raw';
import accessFixes from './styles/access-fixes.css?raw';
import accessBird from './scripts/access-bird.js?raw';
import livingEngine from './chrome/living-engine.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 保留候选站完整文档；不经过内容页的屏幕清单或动效坐标转换。
export function retainedPage(page: 'home' | 'computer-access') {
  const activate = (document: string) => document.replace('</head>', '<script src="/_live/site-live-runtime.js" defer></script></head>')
    .replace(/<script\b[^>]*\bdata-src="[^"]*b2-(?:typeset|live)-[^"/]+\.js"[^>]*>/g, tag => tag.replace(/\sdata-album-runtime\b/g, '').replace('data-src=', 'src='));
  // 授权页插画和别的内容页一样用修正版引擎（固定白天，只有首页跟昼夜变）；首屏小鸟用同一份 LivingBird 资源，目录名从引擎里读，不写死。
  const accessBirdTag = () => {
    const folder = readFileSync(resolve(process.cwd(), 'public/_living/_engine', livingEngine.fixed), 'utf8').match(/\b[\w$]+="(bird\.[a-f0-9]+\/)"/)?.[1];
    if (!folder) throw new Error('授权页小鸟资源目录未登记');
    const data = JSON.stringify({ script: `/_living/_engine/${folder}bird.js`, atlas: `/_living/_engine/${folder}bird-atlas.webp` }).replace(/"/g, '&quot;');
    return `<script data-access-bird data-bird="${data}">${accessBird}</script>`;
  };
  if (page === 'computer-access') return activate(access).replace(`/_living/_engine/${livingEngine.deployed}`, `/_living/_engine/${livingEngine.fixed}`).replace('</head>', `<link rel="stylesheet" href="/_interactions/anchor-offset.css"><style data-access-fixes>${accessFixes}</style></head>`)
    // 第 2 步三项真正互斥：“同时办理”开着时点单项，先关掉同时办理再选该项；只动“选哪项”的界面状态，提交和办理流程不变。
    .replace('</body>', `<script data-access-exclusive>document.addEventListener('click',e=>{const b=e.target instanceof Element&&e.target.closest('button[data-b2-action^="purpose-"]');if(!b)return;const c=document.querySelector('button[data-b2-action="combined"][data-selected="true"]');if(c&&!c.disabled)c.click();},true);</script></body>`)
    .replace('</body>', '<script src="/_interactions/anchor-offset.js" defer></script></body>')
    .replace('</body>', () => accessBirdTag() + '</body>');
  let html = page === 'home' ? home : access;
  for (const [from, to] of Object.entries(motionRuntime.urls)) html = html.replaceAll(from, to as string);
  html = html.replace('</head>', `<style data-motion-quality>${typesetStyles.split('/* motion-quality-v2 */')[1]}</style></head>`);
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
    html = html.replace(practice[0], `<nav class="home-hero-cta" aria-label="首页入口">${links.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav></section><aside id="home-phone-status" role="status">还没读到电脑状态。</aside>`);
    html = html.replace('</body>', `<script>(()=>{const row=document.querySelector('#home-phone-status');const update=s=>{const value=s?.overall;if(value)row.textContent=[value.title,value.detail].filter(Boolean).join('\\n');};document.addEventListener('site-status',e=>update(e.detail));update(window.SiteStatus?.snapshot?.());})();</script></body>`);
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
    html = html.replace('</head>', '<link rel="stylesheet" href="/_home-cockpit/time-labels.css"></head>');
  }
  if (page === 'home') html = html.replace('</head>', `<style data-home-cta-layout>${homeCta}</style></head>`);
  if (page !== 'home') html = html.replace('</head>', '<link rel="stylesheet" href="/_interactions/anchor-offset.css"></head>')
    .replace('</body>', '<script src="/_interactions/anchor-offset.js" defer></script></body>');
  return activate(html);
}
