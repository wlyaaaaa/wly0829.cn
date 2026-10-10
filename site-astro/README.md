# site-astro：内容页（区块照现在的网站，排版在浏览器里自动做）

内容页每页一个内容文件 `src/content/pages/<页>.md`，一律由 `tools/convert_page.py` 从 `sources/pages/<页>/page.json`（和 `layout.json`）生成，不手改。页头、页尾、目录条、翻页过渡、小鸟、落叶、水彩照现在网站。

## 为什么这样做（第四轮）

现在网站每一屏的整屏图，就是共用区块库 `src/typeset/components`（HTML + CSS）在固定画布上排好再截的图（电脑画布 1672 宽、手机画布 941 宽）。
新站直接用同一套区块库、同一份样式在浏览器里排，不再截图：

- 区块（卡片、数字卡、步骤和箭头、时间线和蛇形连线、对话气泡和小尾巴、例外虚线、右侧栏、术语表、按钮、编号标注截图……）的字号、间距、边框、配色、装饰和现在完全一样，因为是同一份代码；
- 不写坐标：构图只写“用哪些区块、哪几块同一行、各占多宽”，浏览器按构图排；没写构图的屏由区块库自动分块；
- 每个位置用哪张图（图标、插画、毛笔标题）在内容文件里逐条写明；内容文件由转换器生成，改内容改 `page.json`、改构图改 `layout.json`，再重新转换；
- 文字是真文字（能选、能搜、读屏能读），字体是出图时用的同一个字体文件按本页用字抽的子集。

画布排好以后按栏宽整体等比缩放显示（宽于 768 用电脑那份，窄于 768 用手机那份），所以 960、1280 宽时和现在一样是缩小显示。

## 首页和驾驶舱

首页、驾驶舱保留候选站原 HTML、原图和动效，由 Astro 静态路由输出。

首页与驾驶舱入口来自版本化的 `sources/retained-home-cockpit`：已选样板的补丁后两份 HTML、唯一首页首帧脚本及依赖清单。运行 `python tools/retain_home_cockpit.py` 可在没有本机忽略文件时恢复入口，逐字节核验后写入 `src/chrome/retained` 和 `public/_home-cockpit`；其余图像、字体、动效依赖由发布流程按清单 SHA-256 复用，不降低图像质量。清单的 `pages` 绑定实际补丁后页面，`inputs` 保留补丁前输入依据。只有显式选定新候选站时才运行 `python tools/retain_home_cockpit.py <候选站构建目录>`，它只读候选站并生成下一份待审输入。这两页不经过内容页的坐标转换和屏幕清单清空。按钮样式在 `public/_home-cockpit/time-labels.css`，断连状态在同目录的 `cockpit-offline.js/css`；删除两条静态路由和这些附加引用即可撤回接入。

首页按浏览器会话首次从纸色播放原开场；图片到达后 3 秒未开播，或开场连续 5 帧超过 100 毫秒，就跳到完成图并恢复环境动画。回访、后退缓存与减少动态不播。顶栏固定用原 WebP 背景，避免显示途中切换未接收完的 AVIF；加载占位和标签行布局在首绘前确定，不用低清预览。

## 一次完整生成

```powershell
cd site-astro
npm install                                                # 只第一次
python tools/extract_chrome.py <现在网站的构建目录> all     # 抄页头页尾、目录条、动效运行件（原文件逐字节复制）
python tools/copy_runtime_refs.py <现在网站的构建目录> all  # 补齐运行件实际会加载、脚本 import 到的文件（例如 how 页演示脚本、b2-access-model）
python tools/convert_page.py --all                         # page.json + layout.json → 内容文件（源改了就重新转换；同一份源转换两遍逐字节相同）
python tools/adapt_motion.py                               # 环境动画配置改绑到插画（电脑、手机两份）
python tools/pack_living.py                                # 环境动画引擎“已显示的图不再晕开、位移从 0 渐入”修正版
npm run build                                              # = render_blocks.py --all（区块排版，没改的屏不重排）+ astro build
```

`public/` 下的 `assets/`、`_shared/`、`_living/`、`_album/`、`_chrome/`、`_typeset/`、`_how-demo/`，以及 `.cache/`、`src/content/rendered/` 都由上面几步生成，不进仓库。

`public/rule-sources/`、`public/source-tools/` 是规则原文里链到的公开文件（公开入口模板、`Find-DuplicateContent.ps1`），和现在网站发布的逐字节一致，进仓库；按活动版本重出原文时（`convert_page.py --rules-release`）公开入口模板跟着重出。

## 内容文件怎么写

开头是 JSON 字段：`title`、`kind`、`url`、`toc`、`page`（页面级字段）。每一屏：

````markdown
::screen{#<屏号> section="<分节>"}

```typeset
{ "screen": {链接、按钮、截图等这一屏的字段},
  "layout": {"h": {电脑构图}, "v": {手机构图}},
  "images": [{"role": "icon", "slot_ordinal": 1, "asset": "_library/icons/齿轮.png"}, ...] }
```

这一屏的文字（Markdown）
````

内容文件不手改，下面说的都是改源再重新转换（`python tools/convert_page.py <页>`）：

- 改字、数字、链接：改 `sources/pages/<页>/page.json` 里那一屏的 `text`、`links`。
- 改图：改素材表 `sources/assets/_library/asset-map.jsonl` 里这一屏这个位置的行（转换时写进 `images`，路径相对 `sources/assets`）。
- 改构图：改 `sources/pages/<页>/layout.json`：`h.blocks` 里每块的 `type`（区块名，见 `src/typeset/components`）、`row`（同一行的块写同一个名字）、`width`（这一栏占多宽）。手机构图不写时自动竖排。
- 全新的页（只有 `page.json`、没有 `layout.json`）：转换器照样出内容文件，区块库按文字自动分块，电脑、手机两份都会排出来（毛笔标题、正文、编号步骤卡、列表、表格）；但没有插画、分组图标和左右分栏，要和现有页一样图文并排，得补素材表里的图、写 `layout.json`。
- 改了地址的页：`page.json` 的 `url` 写现在的地址，旧地址列在 `old_urls`。旧地址出一句话的去向页（两秒后跳到现在的地址、不收录），站内链到旧地址的链接在排版时改指现在的地址。
- 分组标题图标按原 scene 短语认图、品牌图标按“<品牌>标志”认图，所以 `images` 里这两种还写明 `source_phrase` 和 `sha256`；品牌图标行带 `"via": "brand"`，不占这一屏的图位。
- 页里引用的数字和链接（`{{scale.total}}`、`{{group_counts.…}}`、`{{stories.…links}}` 等）在转换时用区块库的 `bound_json` 算好写进内容文件，和现在出图时冻结的时机一样；数据变了重新转换这一页。
- 连续的独立卡（`shape: card`）放进两列网格（手机一列），中间别的屏（如分类标题条）把网格断开、占满整行。
- 项目注册表生成的“画廊”屏，标题统一成和别的小节一样的毛笔大标题（`chapter_title`，用素材库里同字的标题图）。
- “全部功能”卡片按源里的顺序（编号从小到大）逐行排，不再按状态重排。

## 检查

```powershell
python tools/serve_dist_only.py 18963                                        # 只用 dist，缺文件会直接报 404
python tools/check.py out.json --base http://127.0.0.1:18963                 # 五种宽度：溢出、图片、逐屏文字和现在比、重叠、空卡
python tools/section_compare.py <输出目录> <现在网站构建目录> --suffix=-r4      # 逐屏新旧并排 + 像不像分数（tools/likeness.py）
python tools/slow_swap.py <输出目录> --base http://127.0.0.1:18963            # 慢网慢机下插画“静态图 → 动画”逐帧
python tools/fullsite_check.py out.json --pages all                          # 全站五种宽度：横向溢出、坏图、4xx/5xx
python tools/link_check.py links.json                                        # 全站站内链接和锚点（离线读 dist）
python tools/rule_article_check.py <现在网站构建目录> rules.json               # 规则原文网页字和现在逐字节比、页面不再出现 owner 行和“技术证据”
```

## 规则原文

按需更新时，`scripts/astro_rules.py` 从核验通过的活动规则生成 `sources/rules` 和各规则页的原文分段；活动原件、公开副本、catalog、指针和入口模板分别绑定 SHA。普通转换和构建只读这份已提交的规则源，不读取私人过滤文件，也不在构建时把本机的新版本写进网页。

页面上只出网页字原文（横版原文卡正文，经 `project_original_html` 公开投影，放在素材库 `rule-paper` 的水彩框里），上面一行版本标签；规则文件开头给维护者看的 owner 行不显示，排好的原文卡也不再另出一份（原文只出现一遍）。

按需更新活动规则：在仓库根运行 `python scripts/prepare-astro-release.py refresh --output <审计JSON>`，再全量转换和构建。转换器按每页现有的原文屏重建分段，保留完整正文和顺序；渲染器从当前 Markdown 生成单份 article 和版本标签。发布前核验活动原件是否仍与这份规则源一致，正文、模板、分段或当前版本不匹配时阻断发布。

只想试排、不碰站点时，用环境变量把目录换到别处：`CONVERT_OUT_MD=<目录>`（转换结果，公开入口模板写在它下面的 `public/`），`BLOCK_MD_DIR`、`BLOCK_OUT_DIR`、`BLOCK_PUB_DIR`、`BLOCK_WORK_DIR`（区块排版读的内容、写的结果、发布文件和排版缓存；和站点排版同时跑时缓存要分开）。

## 毛笔标题

素材库里没有同字标题图的大标题（`chapter_title` 退到 `title-font`），区块库用本机的行楷字体（`src/typeset/style/base.css` 的 `Brush`）排字。网页不能带这个字体，所以排版时把这几个字在 2 倍分辨率下单独截成透明 PNG（`.publish/typeset-out/_cache/brushfont-<内容摘要>.png`，发布到 `/assets/_titles/`），换掉页面里的字；原字留作透明文字，能选、能搜、读屏能读。

## “现在”实时位

区块库排好的实时位（`[data-hot="live"][data-href=<键>]`）由 `src/scripts/live-dom.js` 填（排版时复制到 `/_living/live-dom.js`）：借现在网站运行件对外的 `SiteLiveRuntime.readStatus / parse` 取数（授权与状态、连接电脑两页借 `SiteB2`），一分钟一次，切回页面时立刻读。读不到时照驾驶舱的做法：页面上只说一次“暂时读不到电脑，保留最后一次读到的状态（北京时间）”，实时位显示上次读到的值、整体变淡；从没读到过就安静占位，不出“读不到”；读到后自动恢复。上次读到的值只在真正读到时存（浏览器本地 `site-live-dom:v1:<页>`）。实时位放在哪一屏都一样填，挪到首屏标题下的状态行也不用改脚本。
