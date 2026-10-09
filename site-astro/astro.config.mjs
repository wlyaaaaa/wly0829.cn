// @ts-check
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import remarkBlocks from './src/plugins/remark-blocks.mjs';
import rehypeBlocks from './src/plugins/rehype-blocks.mjs';
import rehypeRaw from 'rehype-raw';

export default defineConfig({
  site: 'https://wly0829.cn',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // 图片原样放在 public/，不经 Astro 图片转码（本人禁令：不降清晰度、尺寸、质量）
  markdown: {
    remarkPlugins: [remarkDirective, remarkBlocks],
    rehypePlugins: [rehypeRaw, rehypeBlocks],
    smartypants: false,
  },
});
