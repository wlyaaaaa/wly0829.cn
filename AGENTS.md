# wly0829.cn project rules

This repository is public. Every tracked file must be suitable for an unknown
visitor to read, clone and quote. The website itself is primarily the owner's
personal AI collaboration workspace; public presentation is secondary.

- **是什么：** 本人的个人网站 wly0829.cn。讲解页、首页和实况前端的现役源码在 `site-v2/`，实况入口是 `/live/`。
- **入口：** [README](README.md) 说明如何配齐本机输入并用 `npm run build` 组装 `dist/`。[发布与扫描](docs/publish-and-scan.md) 说明如何用同一成品预览、验收和发布。本人说“更新网站”或“更新网页”（同义）才跑 [按需更新](docs/update.md)，每次盘点全站、按变化选页；项目完善与修毛病、发 QA 版各按自己的任务推进。
- **不做什么、归谁：** 驾驶舱数据归 PCConfig 状态服务；全局规则归 `.agents`。按需更新时发现别的项目的问题：小问题顺手修，改在那个项目自己的仓库里；大问题登记给本人。
- **没有手机版：** 不为手机另做一套版式。手机打开就是电脑版，整页按电脑的样子等比缩小到屏幕宽度，不出现横着滚，双指放大不禁用（现在的做法是每页视口那一行写 `width=1440`）。
- **动效一直开着：** 每页动效对所有人照常播放。不做“减少动态”适配，系统开了减少动态也不减；不设计任何关掉动效的情况，开关、网址参数、连不上时停动效都不做，状态用颜色和文字表示。禁令（本人 2026-11-20，源 b020ac8d-b5f5-4ea9-8996-4f944d9d7d55），要改先问本人。
- **访客流量：** 网页 HTML 放 GitHub Pages，每页只留几十 KB；图片、字体、脚本、样式都走阿里云 OSS（见 [OSS 资源契约](docs/oss-publication.md)）。新做或改版的页（讲解页，和实况，也就是原来的驾驶舱）都照这几条：访客不滑动时只下第一屏看得见的东西，首屏以下的图滑到附近再下；中文字体按全站用到的字裁成子集、文件名带内容指纹；HTML 里不内嵌大段图片或字体数据；图加载慢就一直等、真失败才重取。
- **注意流量：** 更新网站时 GPT 子任务（Sol 看图、Luna 出图）走付费代理，很费流量。看图不论几张都用 `-TrafficMode Review`，图少一单装得下就不分单（不加时 GPT 会来回发几十次请求、每次都带着图，2026-11-25 一单 18 张没加，估计上传约 1.1 GB）；出图用 `-TrafficMode Generation`；字先定对再出图，同一张图不出两遍；要大批重出图前，先估流量报本人。
- **改了留一句：** 改了这个仓库、对用的人有影响的提交，说明里单独一行以“变化：”开头，写对用的人变了什么（例：“变化：备份页不再手写上次运行时间”）；没影响写“变化：无”。这一行会原样显示在公开的实况页上，带私事的换个能公开的说法；提交说明是英文时这一行仍用中文。本机装了提交关卡，漏写会被当场拦下。

本人说“完善网站”或“完善驾驶舱”，指让他用起来更好：一眼看懂现在的情况，要他做或选的事不漏，写的是人话、不让人猜，能直接在上面操作；不是重构代码、加没人要的功能，或修不影响使用的毛病。

本人问“谁访问了网站／有什么人访问”，新站上线后一律只算上线时刻起的新站访问，同域名按时间分界。查询工具读取本机 `<cache-dir>/site-era.json` 的 `launch_at`，所有日期、`--cv` 和深读查询均遵守分界；没设时保持原口径。上线前记录另存只读旧档，只有本人明确查旧时才用 `--legacy-archive <旧档>`，不把旧档并进当前统计；上线、冻结和按页查询步骤见 [访客日志](docs/visitor-logs.md)。

本人问网站某天或某几天访问人数时，在仓库根运行 `python -B -X utf8 tools/query-site-visitors.py --start 2026-10-12 --end 2026-10-12`（替换日期；最近七天用 `--days 7`）：默认排除本人和巡检、北京时间切日，以浏览器访客编号及整段跨天去重为主（换设备或清存储会多算、共用浏览器会少算），独立 IP 是辅助口径（换网络多算、共用 IP 少算、资源缓存会漏算）；近 7 天从 SLS 实时日志查询，约延迟 3 分钟，更早来自 OSS 日志转存，可能延迟最多 48 小时，输出会列出各段来源，零条日志不能认定零访客，本人设备访问任一页带 `?self=1` 后持续排除，`?self=0` 取消。

本人问网站搜索词、点击、展示、平均排名或收录时，查询入口是 `python -B -X utf8 tools/query-search-terms.py --days 28`（默认 28 天，可改天数或用 `--end YYYY-MM-DD`；凭据须经密码中心登记程序供给，未配置或读取失败会明确报错）；Google 按太平洋日期切日、默认截止到当地三天前，数据通常晚 2–3 天且低频词会被隐去，网站总量与可见词表分开，Bing 词统计按返回日期筛选但每周更新且周覆盖区间未知，Google 全站收录需另读 Page Indexing 或通过 `--google-index-snapshot <本机快照.json>` 显示带日期的非实时快照，Bing 显示最新可取得的收录快照，空记录不等于无人搜索。

月度热门页面用 `python -B -X utf8 tools/query-site-visitors.py --month 2026-10`。普通查询同时输出离线 ip2region 省市、IPtoASN 机构网络与 App 分布、新访客/回头客、每页与每个编号的停留汇总，以及按省份/运营商分组的打开速度中位数；地区与机构只是 IP 网络归属线索，不证明个人身份、精确位置或雇主，原始 IP 不出本机。离线数据库与首次观察编号历史只保存在本机默认缓存 `E:\Cache\wly-site-visitors`，不提交仓库；数据库不可用时汇总明确为未知，不用网络查询 IP。新/回头客依据已观察日志中的首次日期，首次观察不证明绝对首次来访，苹果 Safari 与微信清存储会使回头客偏少。

推断某个日期附近的可能访问来源，用 `python -B -X utf8 tools/query-site-visitors.py --around 2026-10-12 --city 上海 --days 14`，可加 `--org 电信` 等实际机构网络名或运营商名片段；`--days` 表示以该日期为中心的总窗口天数，默认 14 天。此模式额外列出匹配编号对应的首次观察时间、城市、机构网络、App、看过的页面和停留；结论只能写“可能”，不得据此确认是谁，也不建立投递记录。

停留表示已收到的累计可见时长：离开/隐藏、恢复前台即时上报及每 15 秒前台心跳，在同一页面实例内只取合法累计秒数最大值，再跨实例相加；隐藏时不计时、不发心跳，恢复/心跳不增加 PV。last_report_at 是最新合法可见时长信标的真实事件时间（无则 null），不能证明认真阅读或访问已结束；15 秒采样仍叠加原有 SLS 约 3 分钟延迟。没有合法可见时长信标时用相邻页面时间差后备（最多 30 分钟），最后一页保持未知。打开速度为 Navigation Timing 从导航开始到首字节、DOM 完成和 load 完成的毫秒数，只汇总已收到的字段。图片桶日志另统计 GPTBot、ClaudeBot、PerplexityBot、Bytespider、Amazonbot、meta-externalagent、Google-Extended 等声称的 UA 次数与日期，注明“只是下限，看不到只抓网页的爬虫”。

本人要看完整日志时，一次讲清实际覆盖的日志来源、时间、IP 的地区与网络归属、页面或接口动作及结果、本地与 AI 测试和机器请求的已知标记、错误和缺口；不只轮流报访客数量再等本人追问 IP、时间和做了什么，访客信标也不能冒充全部后端日志。这类查询在对话里直接解释，不专门做汇报页，本人当次要求时除外。

普通访客查询默认单列“专用链接来的（/cv）”（`entry.cv`），按首次已标记入口去重，包含人数、首次时间、城市、看过的页和停留；`/cv` 自动跳到首页，跳转本身不计阅读停留。
本人问“专用链接有没有人点开”时，在仓库根运行 `python -B -X utf8 tools/query-site-visitors.py --cv --days 30`，逐次列出北京时间、可能的 IP 地区与机构网络、后续页面和停留；零记录不证明零来访，日志延迟和身份推断限制同上。

Before changing the website's product, page copy, styling, interactions,
navigation, project selection, content generation or public publication, or tools
or documents that can affect them, read the
[complete panel content contract](docs/design/panel-content-contract.md) in full.
It remains mandatory project rules.

## Product boundary

See [Product boundary](docs/design/panel-content-contract.md#product-boundary). For layout, navigation, and cockpit interactions, read [Layout and interaction](docs/design/layout-and-interaction.md).

## Public-content gate

See [Public-content gate](docs/design/panel-content-contract.md#public-content-gate).

## Project expansion gate

See [Project expansion gate](docs/design/panel-content-contract.md#project-expansion-gate).

## Project-local evidence

- Design briefs, current content principles and `design-qa.md` are maintained
  project documentation and are tracked. Reproducible comparison screenshots
  remain ignored under `docs/design/qa/` to avoid binary history bloat.
- Product Design QA updates `design-qa.md` with current evidence references and
  final status; stale prior QA is replaced rather than accumulated.

## 更新网站

先读 [网站怎么更新](docs/update.md)；开头四行说明本仓库是什么、入口、不做什么、改了留一句。
发布操作见 [发布与扫描](docs/publish-and-scan.md)。
按需更新和 QA 各用自己的工作副本、批次及回执。只在正式发布时共用入口和发布锁；另一线先发，接着发的一线先重读最新成功版本，并复核自己这轮的成品差异。按需更新和 QA 都发公网。家里网站默认不启动，只有要先在家里给本人看某样东西时才启动，看完就停。
