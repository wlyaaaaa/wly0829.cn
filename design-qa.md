# wly0829.cn 当前设计验收

## 验收对象

本文件只记录当前实现，不累积旧版设计过程。当前验收范围包括项目首页、`.agents`、
PCConfig、GitHub 总索引、ChineseASR、TimeAudit 五个项目的总览与各自真实模块、规则工作台、Skills
目录与详情页，以及全局导航、搜索、移动端菜单、动态背景和可选项目画廊。

当前五项目生产 `dist` 通过本地静态预览复核。原 27 张规范图保留四项目 PUBLIC PASS 基线，本轮已
重建首页，新增 5 张 TimeAudit 总览、模块、画廊和移动灯箱图，以及 1 张 timeaudit-diagnostics Skill
详情图；当前 QA 集共 33 张、3,335,161 bytes。
非规范旧变体已移入 Windows 回收站，不能拿旧图冒充第五项目验收。

网站首先是吴乐阳本人使用的只读面板。判断界面是否合格，不看它像不像营销页，
而看本人能否在有限屏幕里快速找到项目、规则和能力，并继续读到足够完整的细节。

## 已确定的视觉方向

- 白色为主背景，纯绿色只承担状态、选择和少量结构强调。
- 桌面页头保持单行：姓名、完整搜索框、项目 / 规则 / Skills 和外部入口。移动端顶栏常驻姓名、三个主导航、搜索图标和外链菜单图标；搜索与外链浮层分别展开。
- 桌面项目目录使用两列；项目扩展后，第一屏应能容纳四张真实卡片。移动端一列，
  第一屏约能看到两张卡片。
- 卡片整体可点击，公开性或私有性放在右上角，不设置重复的“进入项目”按钮。
- 项目、规则和 Skills 目录直接进入内容，不重复堆放大标题和空泛介绍。
- 全页面背景使用固定的缓慢平行曲线；正文滚动不会重启动画，也不会让曲线在区块
  交界处断裂。
- 不使用粒子、尖峰、鼠标吸附凹陷、发光、渐变玻璃或伪造的项目预览图。真实产品截图正常进入
  通用画廊；预览可裁切，但打开后必须保留完整原图和真实语义。截图中的进程、路径、时间和技术值
  不按字段类别视为敏感，只有具体值真正包含个人敏感正文或凭据时才隐藏。
- 图标使用维护中的品牌与界面图标库，不手绘近似标志。
- PUBLIC 项目卡和详情页提供带官方 GitHub 图标的仓库按钮；PRIVATE 项目只显示状态，不生成链接。

## 当前信息架构

顶层导航只有三个入口：项目、规则、Skills。项目按 `.agents`、PCConfig、GitHub 总索引、ChineseASR、
TimeAudit 固定为 1/2/3/4/5；每个项目只使用自己的总览与按真实边界划分的模块，模块数量不固定。
规则页和 Skills 仍由 `.agents`
拥有：规则在同一页面内切换五份当前规则，不创建五条详情路由；Skills 目录按实际使用
价值排列，每项都有独立详情页。网站工程自身不作为项目卡出现。

全站搜索可检索项目、模块、规则和 Skills：桌面直接显示搜索框，移动端点击搜索图标后在顶栏下展开整宽输入框。搜索结果必须说明命中的内容类型和位置，不能只返回一串没有上下文的标题。

## 交互验收标准

- 页头在桌面和移动端都不能产生水平溢出。
- 移动端搜索和外链菜单互斥；均支持按钮开关、点击页面关闭和 `Escape` 关闭。
- 项目卡、搜索结果、规则选择和所有外部链接都可用键盘访问。
- 规则工作台支持鼠标、键盘方向键和移动端原生选择器；切换规则不改变路由。
- 项目模块导航在长页面中保持可见，并在内容超出时显示真实滚动条；当前选项不会
  因页面滚动而丢失。
- 动态背景属于全页面固定层；内容滚动与动画时间彼此独立。
- 系统要求减少动态效果时，背景只渲染静态帧。

## 可复现证据

浏览器截图保存在被忽略的 `docs/design/qa/`，不进入公开提交历史。最终验收至少保留：

- `home-1440x900.png`：桌面项目首页。
- `home-1800x900.png`：宽屏项目首页，确认四张卡片仍完整进入首屏。
- `home-390x844.png`：移动端项目首页。
- `agents-overview-1800x900.png`：复核用户截图中的宽屏关键事实留白。
- `rules-1440x900.png`：桌面规则工作台。
- `rules-390x844.png`：移动端规则工作台。
- `skills-1440x900.png`：Skills 目录。
- `skills-390x844.png`：移动端 Skills 目录。
- `skill-project-entry-1440x900.png`：代表性能力详情页。
- `skill-detail-390x844.png`：移动端能力详情页。
- `pcconfig-overview-1440x900.png` 与 `pcconfig-overview-390x844.png`：PCConfig 总览。
- `pcconfig-current-state-360x800.png`：移动端长任务状态、hash 与下划线文本换行。
- `pcconfig-module-1440x900.png`：PCConfig 代表模块与本项目导航。
- `github-index-overview-1440x900.png` 与 `github-index-overview-390x844.png`：GitHub 总索引总览。
- `github-index-module-1440x900.png`：GitHub 总索引代表模块与本项目导航。
- `chinese-asr-overview-1440x900.png` 与 `chinese-asr-overview-390x844.png`：ChineseASR 总览。
- `chinese-asr-module-1440x900.png`：ChineseASR 代表模块、证据层与本项目导航。
- `search-1440x900.png`：全站搜索“刷新看板”时，刷新 Skill 作为首项并保留相关结果。
- `project-scroll-nav-1440x900.png`：长页面滚动后的固定模块导航。
- `mobile-menu-390x844.png`：移动端菜单展开状态。
- `mobile-header-search-360x800.png` 与 `mobile-header-menu-360x800.png`：移动搜索和菜单按钮的对齐、互斥与展开状态。
- `background-a-1440x900.png` 与 `background-b-1440x900.png`：同一位置不同时刻的
  背景帧，用于确认缓慢运动真实存在。

每轮最终验收同时检查控制台错误、直接路由、404、键盘操作、桌面与移动端溢出，
以及生产构建中的公开内容门。截图本身不能替代这些检查。

## 当前结论

2026-08-30 的用户截图重新打开了 owner preview。旧截图和旧“无溢出”结论均已失效，
尤其不能再用 `document.scrollWidth === viewport` 证明子元素没有被 `hidden/clip` 裁切。

当前本地候选已经原位修复并取得关键真实浏览器证据：

- `.agents` 关键事实跨越 hero 两列，奇数末项占满整行；1440×900 下事实区域宽度与 hero 一致，不再留下截图中的大块死区。
- PCConfig 的长哈希和下划线状态值可在列表项内换行；390×844 下逐项检查没有超出内容容器。
- 移动搜索与菜单按钮保留 40×40 触摸区域、去掉笨重边框并共同垂直居中。
- 桌面首页缩短卡片摘要和内部留白；1440×900 的四张卡 bottom=680.6，全部进入首屏。
- SPA 内部链接使用 canonical trailing slash，路径变化后把焦点移到可聚焦的 main；显式 favicon 消除默认资源 404。
- GitHub 总索引、PCConfig、`.agents` 与相关 Skills 的耐久文案已按当前 Owner 证据原位刷新；ChineseASR 本轮事实未发生实质变化。

当前结构化 `.agents` 快照仍绑定 verified E89：活动 release commit 为
`6a272ca361919bd377975c4574f6ab4372483ade`，ruleset 为
`e58ca597501ff20306d384e841623e39373eca8d715034856c63b9ebe59b0ce4`。Canonical source main
已前进到 `eede561691e672e3b372bbe30e599ec1d075a904`；它是未激活 source candidate。当前另有 1 项
公开安全地标为 workbench-local metadata 的未激活本地状态；它不会覆盖 E89。快速刷新
明确保留“全量本地测试本轮未重跑”的 Unknown。Skill supply 为 25 个 active install intent，
公开看板收录 23 个；新增 `timeaudit-diagnostics`。

四项目 `--all` refresh result 已通过现有 verifier：`.agents`、PCConfig、GitHub 总索引 3 个内容包
material changed，ChineseASR byte-identical；PCConfig receipt 绑定 canonical task-scan generation
`20260830t011100879-3ff5ec92330242fc` task scan generation、Administrator/SYSTEM principal 合同、88/88 任务定义、
`complete_visibility=true`、manifest/artifact SHA。结果包保存在被忽略的 `.panel-refresh/runs/`，不成为
第二叙事源或 build 常驻状态。

真实浏览器已覆盖 320/360/390/768/1440/1800 关键视口：首页四卡、`.agents` 宽屏事实区、
PCConfig 长文本、移动顶栏、项目模块、Rules、Skill、搜索排序、canonical URL、SPA 焦点和 favicon；
代表页面无控制台 warning/error，逐项长文本没有超出所属容器。27 项合同测试、E89 snapshot、
生产构建与公开内容门均通过。Owner 已于 2026-08-30 查看本地项目首页、`.agents` 总览、PCConfig
总览、代表模块、Rules 和代表 Skill，并明确通过预览、授权继续发布。

四项目版本已以 `a357299` 完成 PUBLIC main、Pages deployment 和公网 bundle/页面回读；移动端项目
模块切换随后由 `717e5ec` 修复并再次部署，390×844 公网真实点击的“总览 → 能力路由 → 总览”两向
`scrollY` delta 均为 0。当前 27 张四项目规范 QA 图完整，61 个非规范旧变体共 17,024,171 bytes 已
移入 Windows 回收站。

用户已在四项目 PASS 后明确打开第五项目并选择 TimeAudit。当前建设包含第五张项目卡、Owner 驱动
刷新登记、公开安全聚合状态，以及一个可由后续可视化项目复用的截图画廊；画廊预览懒加载，单击打开
完整图并支持关闭、上一张和下一张。TimeAudit 只有在新的五项目测试、浏览器 QA、bundle 预算、
PUBLIC main、Pages deployment 与公网 read-back 全部闭合后才升级为 PASS。

画廊保留 11 张用户原图的 byte-exact PNG，共 8,213,369 bytes；列表使用 11 张由原图生成且实际被
消费的 960 px WebP 预览，共 372,582 bytes。浏览器回读确认列表 11/11 使用 WebP，打开灯箱后只加载
当前选中的完整 PNG，避免同时解码 11 张 4K 原图造成真实内存与滚动卡顿。

TimeAudit 与 `.agents` 两个定向 AI refresh result 均通过 verifier：各 1 changed、0 blocked；合计
5 项 auto-repair、0 finding。五项目合同测试 31/31；共 61 条直接路由；E89 snapshot 与 PUBLIC gate
均 PASS。TimeAudit PUBLIC main 已前进到 `a5a34d61360e52c1d019833eaa424f82ba06abcb`，新增
diagnostic summary provider 与 `timeaudit-diagnostics` Skill；一小时真实查询 coverage=fresh、3590
个样本、no_game_frames 和 9 次 packet-loss occurrence。
当前 eager JavaScript gzip 约 271 KiB，低于五项目当前 320 KiB 防膨胀审查阈值；该阈值可按实测与
语义完整性做最小有据增额，不是永久内容上限。站内模块切换不使用点击后 lazy-load。

真实浏览器已复核 1440×900 首页、TimeAudit 总览、硬件与流畅度模块、11 图画廊，以及 390×844
首页、TimeAudit 总览和移动灯箱。桌面/移动均无水平溢出或 console warning/error；灯箱通过 body
portal 覆盖固定页头，关闭/上一张/下一张、Escape、左右键和焦点回收可用。390×844 的
“TimeAudit 总览 → 硬件与流畅度 → 总览”两向 `scrollY 520 → 520`，delta=0。

本地五项目预览与产品阅读审计已 PASS。交付内容 commit `fe660a97d07d362b7d88b660de33d6d7e089b4fc`
已 normal-push 到 PUBLIC main；GitHub Pages run `33290605564` 的 build 19 秒、deploy 9 秒并成功。
公网首页、`.agents`、TimeAudit 总览/六模块和 timeaudit-diagnostics Skill 代表路由全部 200；公网 JS
`index-CdNCuuT_.js` SHA-256=`d8c809a57d6ae14a412910bf548d29590e45374367771595b26a47ad03c79bcb`，
CSS `index-DEMPLj0Z.css` SHA-256=`df615e56ebc9fa80bee7b1752a459000298ff6ff40e8460c1ba8b68193c311eb`，
与本地产物精确一致。PNG 原图与 WebP 预览均为正确 MIME 和源字节。

公网 390×844 真实交互复核：TimeAudit“总览 → 硬件与流畅度”保持 `scrollY 700 → 700`；画廊
1/11 → 2/11 → 1/11、Escape 关闭、焦点回到触发图；预览使用 WebP，灯箱使用完整 PNG；
timeaudit-diagnostics 页面包含 3590 样本现场、aggregate-only 不是字段公开禁令的边界，console
无 warning/error。四项目旧问题、第五项目、异步 projectless 刷新与自动 PUBLIC 发布均已收口。

current result: five_project_public_pass
