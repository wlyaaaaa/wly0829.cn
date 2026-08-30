# wly0829.cn 当前设计验收

## 验收对象

本文件只记录当前实现，不累积旧版设计过程。验收范围包括项目首页、`.agents`、
PCConfig、GitHub 总索引、ChineseASR 四个项目的总览与各六个模块、规则工作台、Skills 目录与详情页，
以及全局导航、搜索、移动端菜单和动态背景。

当前本地预览由 `http://127.0.0.1:5173/` 的同一开发服务提供，源码修改会直接进入
用户正在查看的页面。下列截图清单已按当前生产 dist 重新生成；27 张规范图是本轮证据，
非规范旧变体已移入 Windows 回收站，不再拿旧截图冒充当前验收。

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
- 不使用粒子、尖峰、鼠标吸附凹陷、发光、渐变玻璃或伪造的项目预览图。
- 图标使用维护中的品牌与界面图标库，不手绘近似标志。
- PUBLIC 项目卡和详情页提供带官方 GitHub 图标的仓库按钮；PRIVATE 项目只显示状态，不生成链接。

## 当前信息架构

顶层导航只有三个入口：项目、规则、Skills。项目按 `.agents`、PCConfig、GitHub 总索引、ChineseASR
固定为 1/2/3/4；每个项目只使用自己的总览与六模块。规则页和 Skills 仍由 `.agents`
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
已前进到 `31009aa57c8451e49e4e6c2bef0cb9ca5235df98`；它是未激活 source candidate。当前另有 1 项
公开安全地标为 workbench-local metadata 的未激活本地状态；它不会覆盖 E89。快速刷新
明确保留“全量本地测试本轮未重跑”的 Unknown。

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

发布前公网仍是 `1b9fb6f`，最终 public PASS 必须等待新提交、Pages deployment 与公网 bundle/页面
回读后才能成立。当前 27 张规范 QA 图完整，61 个非规范旧变体共 17,024,171 bytes 已移入 Windows
回收站；生产 JavaScript 仍接近 256 KiB 预算，CSS 也保留历史重复 selector，但两者不阻断当前四项目发布。

第五项目 gate 继续关闭：先完成当前四项目公网 read-back；之后只有用户提出真实、反复发生的阅读或
决策需求，且候选 build 实测仍低于 bundle 预算时，才评估一个新项目，不预列或预建装饰卡。

final result: owner_preview_accepted_publication_authorized
