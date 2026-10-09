# site-astro：内容页（区块照现在的网站，排版在浏览器里自动做）

每页一个内容文件 `src/content/pages/<页>.md`。页头、页尾、目录条、翻页过渡、小鸟、落叶、水彩照现在网站；首页和驾驶舱不在这里。

## 为什么这样做（第四轮）

现在网站每一屏的整屏图，就是共用区块库 `src/typeset/components`（HTML + CSS）在固定画布上排好再截的图（电脑画布 1672 宽、手机画布 941 宽）。
新站直接用同一套区块库、同一份样式在浏览器里排，不再截图：

- 区块（卡片、数字卡、步骤和箭头、时间线和蛇形连线、对话气泡和小尾巴、例外虚线、右侧栏、术语表、按钮、编号标注截图……）的字号、间距、边框、配色、装饰和现在完全一样，因为是同一份代码；
- 不写坐标：构图只写“用哪些区块、哪几块同一行、各占多宽”，浏览器按构图排；没写构图的屏由区块库自动分块；
- 每个位置用哪张图（图标、插画、毛笔标题）在内容文件里逐条写明，以后改内容只改这个文件；
- 文字是真文字（能选、能搜、读屏能读），字体是出图时用的同一个字体文件按本页用字抽的子集。

画布排好以后按栏宽整体等比缩放显示（宽于 768 用电脑那份，窄于 768 用手机那份），所以 960、1280 宽时和现在一样是缩小显示。

## 一次完整生成

```powershell
cd site-astro
npm install                                                # 只第一次
python tools/extract_chrome.py <现在网站的构建目录> all     # 抄页头页尾、目录条、动效运行件（原文件逐字节复制）
python tools/convert_page.py --all                         # page.json + layout.json → 内容文件（只在从旧站搬内容时用）
python tools/adapt_motion.py                               # 环境动画配置改绑到插画（电脑、手机两份）
python tools/pack_living.py                                # 环境动画引擎“已显示的图不再晕开、位移从 0 渐入”修正版
npm run build                                              # = render_blocks.py --all（区块排版，没改的屏不重排）+ astro build
```

`public/` 下的 `assets/`、`_shared/`、`_living/`、`_album/`、`_chrome/`，以及 `.cache/`、`src/content/rendered/` 都由上面几步生成，不进仓库。

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

- 改字：直接改屏下面的文字。
- 改图：改 `images` 里那个位置的 `asset`（相对 `sources/assets`）。
- 改构图：`layout.h.blocks` 里每块的 `type`（区块名，见 `src/typeset/components`）、`row`（同一行的块写同一个名字）、`width`（这一栏占多宽）。手机构图不写时自动竖排。
- 分组标题图标按原 scene 短语认图、品牌图标按“<品牌>标志”认图，所以 `images` 里这两种还写明 `source_phrase` 和 `sha256`；品牌图标行带 `"via": "brand"`，不占这一屏的图位。
- 页里引用的数字和链接（`{{scale.total}}`、`{{group_counts.…}}`、`{{stories.…links}}` 等）在转换时用区块库的 `bound_json` 算好写进内容文件，和现在出图时冻结的时机一样；数据变了重新转换这一页。
- 连续的独立卡（`shape: card`）放进两列网格（手机一列），中间别的屏（如分类标题条）把网格断开、占满整行。

## 检查

```powershell
python tools/serve_dist_only.py 18963                                        # 只用 dist，缺文件会直接报 404
python tools/check.py out.json --base http://127.0.0.1:18963                 # 五种宽度：溢出、图片、逐屏文字和现在比、重叠、空卡
python tools/section_compare.py <输出目录> <现在网站构建目录> --suffix=-r4      # 逐屏新旧并排 + 像不像分数（tools/likeness.py）
python tools/slow_swap.py <输出目录> --base http://127.0.0.1:18963            # 慢网慢机下插画“静态图 → 动画”逐帧
```

## 规则原文

规则原文屏照现在网站发布时的公开投影处理（`scripts/rule_original_contract.public_markdown`、链接公开化、首行标“公开副本”），并核对私有过滤表 `.publish/private/rule-public-policy.json` 要省略的内容一条都不在；找不到过滤表就停止生成，不绕开。

页面上和现在网站一样分两半：上面是网页字原文（横版原文卡正文，经 `project_original_html` 公开投影，放在素材库 `rule-paper` 的水彩框里），下面是默认展开的“原文排版图与技术证据”，里面是排好的原文卡。
