import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 每页一个 Markdown：开头字段写页面身份，正文用区块记号写内容（写法见 README.md）
const pages = defineCollection({
  // 压力测试页放在 _stress/ 里，只有设了 SX_STRESS=1 才一起构建
  loader: glob({ pattern: process.env.SX_STRESS ? '**/*.md' : '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    kind: z.string(),
    url: z.string(),
    old_urls: z.array(z.string()).optional(),  // 改过地址的页：旧地址出一句话的去向页
    tagline: z.string().optional(),
    toc: z.array(z.object({ id: z.string(), label: z.string(), img: z.string().optional() })).default([]),
    page: z.any().optional(),
    source: z.object({ page: z.string(), sha256: z.string(), converted_at_beijing: z.string() }).optional(),
  }),
});

export const collections = { pages };
