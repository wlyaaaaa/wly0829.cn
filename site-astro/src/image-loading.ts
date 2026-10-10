import imageLoading from '../../scripts/image-loading-runtime.js?raw';

// 图片统一接入同一原生加载器，前面的资源错误捕获与其他脚本原样保留。
export function currentImageLoading(html: string) {
  const source = imageLoading.replaceAll('</script', '<\\/script');
  if (!/\bdata-resource-retry-capture\b/.test(html)) return html + `<script data-native-image-loading>${source}</script>`;
  return html.replace(/(<script\b[^>]*\bdata-resource-retry-capture\b[^>]*>)(.*?)(<\/script>)/s, (whole, open, body, close) => {
    const start = body.search(/\(\(\) => \{\r?\n 'use strict';/);
    return open + (start < 0 ? body : body.slice(0, start)) + source + close;
  });
}
