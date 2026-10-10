// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wly0829.cn',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // 增量构建只清空自己的暂存目录，已有根目录 dist 由构建入口按页更新。
  ...(process.env.SITE_BUILD_OUT_DIR ? { outDir: process.env.SITE_BUILD_OUT_DIR + '/' } : {}),
  // 图片原样放在 public/，不经 Astro 图片转码（本人禁令：不降清晰度、尺寸、质量）。
  // 正文不走 Markdown 渲染：区块由 tools/render_blocks.py 照内容文件排好（见 src/pages/[...slug].astro）。
  markdown: { syntaxHighlight: false },

});
