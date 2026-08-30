# 七项目 MAP 设计与产品验收

状态：`seven_project_public_pass`

观察时间：2026-08-30

## 当前范围

项目 Registry 当前启用 7 项，顺序为 `.agents`、PCConfig、GitHub 总索引、
ChineseASR、TimeAudit、PC Panel Hub、CACB。CACB 是 owner 明确指定的
`curated_packaging + manual_owner_only` 项目，使用“总览 + 5 个真实模块”：
问题库、隔离执行、身份与证据、确定性验证、失败与报告。

公开页面只展示 CACB 已做成的评测产品，不展示任何受测配置名单、结果、数字结论
或先后顺序，也不出现内部生命周期 bookkeeping。

## CACB Source 与验证

- PRIVATE source `main=e6f7581d7d119b94b4df508df2d51c972cd9b73f`，工作树
  干净，本地与远端引用 0/0。
- 当前源树有 233 个跟踪文件、47 个 Python 核心模块、25 个 schema、59 个
  `test_*.py` 文件和 6 份报告/模板文件。该数量不代表文件可原样公开；网页只消费
  经逐项筛选的框架事实，不复制其中的受测配置或结果。
- 完整回归收集 928 项，当前没有全绿。失败集中在跨代冻结标识、原生身份
  envelope、外部执行 adapter 和部分报告不变量；页面明确保留这个边界。
- 与公开产品结构直接相关的 11 个测试文件共 162 项全部通过：问题库、campaign、
  workspace、worker contract、fast flow、接入验收、公开案例、归档和报告 schema。
- 本轮没有启动新的受测执行、云端调用、本地重型推理或结果生成。

## Manual-only 合同

- Registry：`presentation_mode=curated_packaging`、
  `ai_refresh.mode=manual_owner_only`、`automatic_handoff=false`、
  `impact_sources=[]`。
- `assess-panel-impact --project cacb --material-change` 仍返回
  `impact_candidate=false`、`task_required=false`、
  `manual_owner_request_required_no_automatic_handoff`。
- `prepare-ai-panel-refresh --project cacb` 不带手动标记时返回
  `manual_owner_request_required`；带 `--manual-owner-request` 才返回
  `ready_for_ai`。
- Result verifier 要求 bundle 和 CACB 项目同时携带
  `manual_owner_request=true`；缺失会阻断。
- Source、规则、Skill、commit、测试或报告变化均不会创建网站任务；没有新增 Skill、
  watcher、hook、服务或计划任务。

## 网站自动化门

- `npm run build`：PASS。
- `npm test`：35/35 PASS。
- Snapshot binding：E89、5 个 rule bindings、23 个公开 Skill、25 个 active
  install intent，0 finding。
- PUBLIC gate：85 个 source + 113 个 dist，共 198 个文件，0 finding。
- 73 条产品路由均生成目录入口；另有 custom 404，共 74 个 HTML。
- 73/73 条路由都含完整非空静态正文；最小 HTML 44,566 bytes，Rules 最大
  140,565 bytes。禁用 JavaScript 时仍可读取 reader layer 与技术正文；Rules 的
  noscript 样式会展开全部 5 个规则 panel（面板）。
- 共享生产 JavaScript：13,957 bytes，Node gzip 5,046 bytes；相较迁移前
  302,706 bytes gzip 减少 297,660 bytes（98.33%），低于 120 KiB 审查线
  117,834 bytes。
- 首页内嵌 75 条紧凑搜索投影，26,079 bytes、gzip 10,829 bytes；63 个唯一
  alias（别名）均以生产 scorer 与完整搜索逐条比对，canonical top href mismatch 0。
  浏览器图不导入任何 narrative content（叙事正文）包，也没有 dynamic import
  或点击后 fetch。
- 没有新增依赖、服务、数据库、watcher 或后台状态。

## 真实浏览器 QA

静态路由迁移前，使用 Microsoft Edge 150 的真实 1440×900、390×844 与
768×900 viewport 验收七项目内容与布局；任务专用 E 盘临时目录保存
`cacb-browser-qa/qa-report.json`。这些证据证明正文、布局和当时的切换体验，不替代
迁移后原生增强 runtime（运行脚本）的发布级浏览器复验。

- 首页 7 卡保持两列，前 4 卡进入桌面首屏；CACB 卡显示私有状态且无仓库按钮。
- CACB 总览标题、5 个模块、162 focused evidence、928 full-regression boundary 和
  manual-only 文案全部可见。
- 页面正文未出现受测配置名称、数字比较输出、内部 lifecycle 词或私有 locator。
- 390 与 768 宽度切换模块再返回，`window.scrollY` delta 均为 0。
- 模块切换新增 Document / Script / Fetch / XHR 请求均为 0，无 spinner、
  skeleton 或空白。
- 桌面、移动、平板无横向溢出；console warning/error 与 runtime exception 为 0。

## PC Panel Hub 画廊修复

- 第 1 张保留当前 HS2 水冷屏的 Wallpaper Engine 实际显示缓冲区画面。
- 第 2 张改为生产发送循环的 480×1920 当前帧：`frame=32986`、
  `sent=32986`、`failed=0`、`frame_transport=diff_204`，PNG 比同帧
  heartbeat 晚约 7.8 ms 落盘。公开副本只遮盖精确天气地点与前台应用名；它证明
  主机生成并成功发送了同一逻辑帧，不冒充设备像素回读。
- 第 3 张由当前 Renderer 直接使用公开安全 fixture 生成，替代会与实际输出不一致
  的旧 SVG 设计预览；旧 active/idle 设计图及其缩略图已从 staged candidate tree
  （暂存候选树）移除。
- 第 2、3 张横向预览不再把整张竖图缩成细线，而是用顶部、中段、底部三段并排的
  960×540 WebP 联系表；点击后仍加载未裁切的 480×1920 完整 PNG。
- 画廊现在支持 100%–400% 放大、缩小、恢复适合窗口、双击切换、滚动/触屏平移、
  `+ / - / 0` 键、上一张/下一张、Escape 与完整焦点回收；Ctrl/Meta/Alt 组合键
  继续交给浏览器。
- Fresh Edge 150 在 1440×900 打开第 2 张竖图至 400%，真实像素可见面积
  `430172`；在 390×844 打开第 1 张横图至 400%，可见面积约 `164933`。
  两种尺寸均无页面横向溢出，关闭重开或切图首帧即恢复 100%/scroll 0。
- 缩放区域聚焦时左右键平移；导航按钮聚焦时左右键切图。焦点陷阱、简短 dialog
  标题、序号 + alt 读屏播报、连续开关 100 次的 DOM/监听器稳定性均通过；
  console、page error、request failure 为 0，点击未加载新脚本。
- 上述画廊 Edge 证据来自迁移前的等价 React 交互；迁移后的原生 runtime 已由共享
  源码合同锁住相同 zoom、scroll、focus 与 keyboard 语义，但仍属于下节所列浏览器
  证据缺口。

Ignored QA：

- `docs/design/qa/home-1440x900.png`
- `docs/design/qa/cacb-overview-1440x900.png`
- `docs/design/qa/cacb-overview-390x844.png`
- `docs/design/qa/cacb-module-768x900.png`

## 当前仍诚实保留的缺口

- 完整 928 项回归未闭合，不能宣称所有历史执行路线当前可验证。
- PRIVATE holdout、原始 trace、隐藏答案和机器快照不公开，因此网页不能复算私有
  execution evidence。
- 页面是手动快照，可能长期保持同一状态；只有 owner 明确要求时才更新。
- Browser Skill 当前因受管缓存版本错位无法建立浏览器绑定；静态路由、共享脚本、
  公开门与合同测试已经重建，但本轮新架构的发布级 Edge 交互复验仍须单列证据，
  不得用机械测试冒充。

## PUBLIC 部署与回读

- 产品提交：`312abd9a6d7e3c85a740872fcacc95d723070fed`；本地 HEAD、远端
  `origin/main`、Pages workflow head 与最新 `github-pages` deployment SHA
  四者一致。
- Pages run：`33301748038`，build 与 deploy 均 success；deployment id
  `6164803551`。
- 公网 `/`、`/projects/cacb/`、`/projects/cacb/question-bank/`、
  `/projects/pc-panel-hub/`、`/rules/?rule=agents_root_rules` 均为 HTTP 200，
  route-specific static marker、代表正文和 Rules 五面板 noscript 合同均存在。
- 当前生产 runtime `/assets/index-ClBowuHQ.js` 为 13,957 bytes，公网与本地
  SHA-256 同为
  `1F1E7A3AD1EBE35FEC0B8B6B04D91791AED37BDBBBA7C783565E783066F3880D`。
- 机箱屏实时完整帧、三截 WebP、当前 Renderer 完整图和对应三截 WebP 均从公网
  下载并与本地逐字节 SHA-256 一致；一次 GitHub Pages Unicorn 500 经有界重试后
  恢复，不影响最终字节回读结论。

## 发布边界

本地产品内容、manual-only 合同、35 项测试、构建和公开门已 PASS；迁移前内容、
布局与画廊浏览器 QA 也已 PASS。新原生 runtime 的自动浏览器复验因 Browser Skill
缓存版本错位未完成，当前最新本地预览已向 owner 打开；按已验收 MVP 后的项目规则，
该预览证据缺口对所选新项目发布是 non-blocking（非阻断），但不得从报告中删除。
第七项目、PC Panel Hub 画廊修复、静态路由架构和网站全局 Sol Max 质量规则已经随
`312abd9a` normal push，并由 Pages deployment 与公网 commit/路由/字节回读共同
确认；七项目公开状态因此为 `seven_project_public_pass`。
