# site-astro：内容页自动排版样板

内容页每页一个 Markdown 文件（`src/content/pages/<页>.md`），区块自动适应宽度；首页、驾驶舱保留候选站原 HTML、原图和动效，由 Astro 静态路由输出。

首页与驾驶舱生成：`python tools/retain_home_cockpit.py <候选站构建目录>`，然后 `npm run build`。生成脚本只读候选站，复制两页实际依赖和自有动效包，逐文件核对 SHA-256；清单在 `src/chrome/retained/manifest.json`。这两页不经过内容页的坐标转换和屏幕清单清空。按钮样式在 `public/_home-cockpit/time-labels.css`，断连状态在同目录的 `cockpit-offline.js/css`；删除两条静态路由和这些附加引用即可撤回接入。

首页按浏览器会话首次从纸色播放原开场；图片到达后 3 秒未开播，或开场连续 5 帧超过 100 毫秒，就跳到完成图并恢复环境动画。回访、后退缓存与减少动态不播。顶栏固定用原 WebP 背景，避免显示途中切换未接收完的 AVIF；加载占位和标签行布局在首绘前确定，不用低清预览。

## 一次完整生成

```powershell
cd site-astro
npm install                                              # 只第一次
python tools/extract_chrome.py <现在网站的构建目录>       # 抄页头页尾、目录条、动效运行件（原文件逐字节复制）
python tools/adapt_motion.py                             # 环境动画配置改绑到章节头插画（坐标按引擎自己的换算规则）
python tools/pack_living.py                              # 环境动画引擎“已显示的图不再晕开、位移从 0 渐入”修正版
python tools/convert_page.py <页> [<页> ...]             # 或 --all；page.json → Markdown，素材原样复制到 public/assets
npm run build                                            # = astro build --force（改了插件也不会用旧缓存）
```

`public/` 下的 `assets/`、`_shared/`、`_living/`、`_album/`、`_typeset/`、`_chrome/` 都由上面几步生成，不进仓库。

## 内容文件怎么写

开头字段：`title`、`kind`、`url`、`toc`、`motion`（转换脚本填）。正文是普通 Markdown，加下面几种区块记号；**不写任何宽度、列数**，放几列由 `src/styles/blocks.css` 按可用宽度决定。

| 记号 | 是什么 | 自动排法 |
|---|---|---|
| `::screen{#id section="x"}` | 一屏的开始 | 每屏一块白底面板；没有章节头的续屏并进上一块 |
| `:::chapter{title brush art}` | 章节头：毛笔标题图 + 一句话 + 插画 | 宽屏插画浮在右上、文字和后面的区块绕开；窄屏图在上 |
| `:::cards` + `::card{icon=...}` | 卡片组 | 每张最窄 15 字宽，最多 3 列；4 张排 2×2；最后一行自动撑满；特别长的卡独占一行 |
| `:::stats` + `- <strong>65 份</strong>　说明` | 数字条 | 2–4 个等分一行，多了或放不下就换行成卡片 |
| `:::steps{kind=flow\|timeline}` + 有序列表 | 步骤/时间线 | 每步放得下 15 字且不超过 5 步时横排，否则竖线列表 |
| GFM 表格 | 表格 | 按各列字数算出整表最小宽度，比可用宽度宽就每行变一张卡 |
| `:::dialogue` | 对话/引文 | 单列；全是短句时像卡片一样铺开 |
| `:::gallery` + 图片 | 画廊/截图 | 每行等高，按原图比例分宽，最窄 220px |
| `:::note` / `:::tag` / `:::buttons` / `:::figure` / `:::source` | 提示框、标签、按钮行、整块图、规则原文 | 单列 |

总规则：任何一栏窄到放不下 15 个汉字就退回单列；正文不分栏，每行最多约 38 字。拓扑图、流程图这类靠构图的，没有可用整图时先按文字原样放（转换脚本会提示）。

## 检查

```powershell
python tools/serve_dist_only.py 4392                     # 只用 dist，缺文件会直接报 404
python tools/check.py out.json --base http://127.0.0.1:4392
python tools/firstframe_check.py ff.json /projects/localocr/   # 动画接替静态图的第一帧
python tools/motion_inventory.py motion.json                    # 每页实际跑起来的动效
```

## 规则原文

规则原文屏走现有 `scripts/rule_original_contract.public_markdown` 和私有过滤表 `.publish/private/rule-public-policy.json`；找不到过滤表就停止生成，不绕开。转换日志只记条数，不记内容。
