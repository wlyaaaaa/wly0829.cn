# 九项目 MAP 设计与产品验收

状态：`nine_project_local_pass_pending_public_readback`

观察时间：2026-08-30

## 当前范围

Registry 当前启用 9 项：`.agents`、PCConfig、GitHub 总索引、ChineseASR、
TimeAudit、PC Panel Hub、CACB、用 AI 把一件事学明白、Codex Remote。

第 9 项 Codex Remote 是 `curated_packaging + manual_owner_only` 的 PUBLIC
来源项目。它直接使用真实产品名，解释怎样从手机浏览器继续 Windows 上同一个
Codex Desktop 任务；不写成远程桌面、第二份聊天或当前在线服务。Source、release、
测试、截图、规则、Skill 与运行状态变化不会自动创建网站任务。

## 产品事实与内容

- PUBLIC source：`wlyaaaaa/codex-local-remote`，观察时远端
  `main=94f1cfadfbba97d3cfd2b21c73fba0104ccf2cf6`，本地工作树干净。
- 最新正式发布版：`v0.1.5`，提交
  `c3a07719ecbe00dbad515b3cae00fd0f33b186d2`；发布记录为 1771 项测试、
  public-safety 与 Chromium 六视口验收通过。
- 当前 main 的 package 是 `0.1.6-unreleased.0`；页面保留该精确源码事实，但不把它
  写成已发布 v0.1.6。
- Overview + 6 个模块：同一任务、审批与上下文、项目与文件、共享架构、安全接入、
  版本与证据。每页均有用途、现实事故、完整例子、结果、正常/问题/不可用三态、
  实现、流程、边界、失败恢复、真实入口和验证。
- 首屏 6 项直接给出产品形态、同一任务机制、完整能力、正式版本、当前源码和证据
  边界；本人不必读完整页才知道证据是什么。
- 页面区分 source、v0.1.5 测试、历史真实多端 E2E、真实手机图、合成图和当前 Git
  identity；任何一层都不冒充本轮在线验收。

## 价值导向画廊

- 当前保留 20 张：12 张真实手机 UI、7 张 PUBLIC tracked 合成演示、1 张历史合成
  QA。数量不是 KPI；只有逐张审查后仍能解释独立产品能力的图片才进入。
- 9 张 2026-07-28 真实图统一裁去顶部 400px 私有地址栏并 strip metadata；3 张
  2026-08-02 真实 UI 细节保持原幅；原始个人媒体不改动。
- 每张图都有证据等级、标签、能证明、不能证明、日期和来源身份；20 张 SHA-256
  全部唯一，没有用语言或文件格式重复凑数。
- 完整图 20 张、2,630,521 bytes；WebP 预览 20 张、316,858 bytes；合计
  2,947,379 bytes。竖图预览用上/中/下三段并排，点击后仍打开完整图。
- 逐图排除了凭据承载面、明确禁项、私人高风险正文、无关购物/医疗/支付图片、私有
  tailnet 地址和低相关重复图。普通任务名、模型、版本、路径、命令、diff、目录和
  额度等 L1/L2 或实际非敏感事实保留。

## 同轮自动修复

- public gate 原来全局禁掉字面量 Codex；已移除这一误禁，其他明确禁项与全部
  credential regex 保留。
- manual-only 计划与页面原来一律写“私有 Owner 证据”；已改为中性的 fresh/current
  Owner evidence，使 PUBLIC Codex Remote 与 PRIVATE CACB/学习方法都准确。
- full search 原来没有把 aliases 放入 Latin-token admission，导致完整搜索与构建期
  紧凑搜索排序不同；已修为同一可搜索文本，并由全部 alias 一致性测试覆盖。
- 项目规则明确：网站整体可平台中立，但单个项目必须直说真实产品；微信、
  WeChatDirect 与 Codex Remote 可直接出现。PUBLIC 个人数据分级只引用 E92 全局授权
  合同中的唯一表，项目不复制或自行收紧。
- 删除桌面端奇数最后一张卡片居中特例；第 9 项保持普通网格顺序，未来第 10 项可直接
  填右列，不发生卡片跳位。
- 修复所有项目详情首屏的无意义大空白：hero 左列现在按“标题与说明 → 22px 间距 →
  关键事实”连续排布，右侧快照卡独立成列，不再用其高度把关键事实压到页面底部。
- 六个 Codex Remote 模块补齐真实的跨模块关系，并把 `relation` 纳入所有项目模块的
  公共内容合同；不会再出现只有标题、正文为空但测试仍绿的段落。
- 技术词不再用“整项目关闭解释”的方式保护品牌。`Codex Remote`、AI、LLM 等常见
  或精确名称保持原样；app-server、Sidecar、loopback、diff 等首次出现时立即解释。
- 手机横向大图不再强制占满整屏：100% 时画布按图片比例收紧，放大后才扩展内部
  viewport 并保留双向滚动；竖图继续完整使用可用高度。

## Registry 与刷新合同

- `id=codex-remote`、`order=9`、`route=/projects/codex-remote`、PUBLIC source、
  `manual_owner_only`、`automatic_handoff=false`、`impact_sources=[]`。
- assessor 即使收到 source path 与 `--material-change` 也始终返回
  `manual_owner_request_required_no_automatic_handoff`。
- targeted refresh 未带 `--manual-owner-request` 时返回
  `manual_owner_request_required`；全量计划的 manual IDs 为 CACB、learning、
  codex-remote。
- collectors 只允许 Git Owner、PUBLIC source、release/CI 与已批准图片；明确禁止
  dispatcher、计划任务、Broker、Sidecar、app-server、安装运行时和 Remote endpoint。
- 没有新增 Skill、Source hook、watcher、服务、数据库、队列、在线探针或依赖。

## 构建、测试与反膨胀

- E92 已刷新并由原生 snapshot verifier 现场通过：活动提交
  `cf5981bfdb305be5b9cffc8c89f91697a3637e6e`、ruleset
  `f9200d4c4d1ee2d497c3c54926a3838459433ae068b494a0e0440932a44a8a75`、pointer
  revision 13、previous E91、5 项规则 binding、0 finding。当前 `.agents`
  `main=83518cfd93672a6a9e87b3b90d714516eebc7887` 且工作树干净；五规则 bytes 仍与
  E92 完全一致，后续 Skill 提交不覆盖活动 release。
- 最终 `npm run build` 通过：86 条完整静态产品路由、87 个 HTML、88 条紧凑搜索记录；
  PUBLIC gate 扫描 127 个 source 文件与 166 个 dist 文件，共 293 个，0 finding。
- 最终 `npm test` 为 39/39；模块关系、Codex Remote 即时术语说明、逐图独立证据价值、
  横向大图收紧、E92 durable authorization/lifecycle、personal-panel-refresh 精确派发
  分类和静态增强脚本均进入回归合同。
- 共享 JavaScript：14.19 kB，gzip 5.12 kB；长正文没有进入浏览器包。
- CSS：75.25 kB，gzip 13.41 kB；没有新增依赖、服务、数据库或后台刷新节点。
- 搜索投影：32,203 bytes，gzip 13,132 bytes，低于 24 KiB 审查阈值。
- 初始总览只观察到 20 张 WebP 预览资源，完整 JPG/PNG 资源为 0；完整图只在
  lightbox 打开后请求。页面没有正文 fetch/import、spinner、骨架屏或空白壳。

## 当前浏览器 QA

本轮使用 Codex in-app Browser 完成真实交互验收；控制台 warning/error 为 0。

- 1440×900：Overview、6 项首屏事实、7 个模块入口、GitHub 按钮和 20 图完整；
  无页面级横向溢出。hero 的 copy→facts 实测间距为 22px，空白修复后 facts 与右侧
  snapshot 底部基本对齐。
- TimeAudit 同轮复验：copy→facts 同为 22px，原先用户圈出的空白同步消失，证明修复
  不是 Codex Remote 专用补丁。
- 390×844：Overview 与三段式预览可读；页面没有横向溢出。横向图 100% 状态从旧版
  535px viewport / 217px 图片、59.4% 空黑区，收敛为 217px viewport / 217px 图片、
  空白比 0；150% 与 400% 继续在内部 viewport 双向滚动。竖图 100% 使用 554px 高度。
- 320×800：页面 `scrollWidth=window.innerWidth=320`；项目导航自身横向滚动，不把
  正文撑宽。
- 768×1024：模块点击保留阅读位置，直接进入完整 `same-task-control` 静态文档；
  reader layer、源码入口、跨模块关系和当前证据边界均在首次 HTML 中。
- lightbox：1/20 打开完整 JPG，`+` 到 150%，切到 2/20 时恢复 100%，关闭后 body
  scroll 恢复且焦点回到原缩略卡；ArrowRight 切图、Escape 关闭也通过。移动端横图
  100% 为 348×217，150% 后内部 scrollWidth=522；竖图 100% 为 284×554。
- 页面正文不再把 Codex Remote 误解成普通远端仓库，也不会给 AI 机械补中文全称；
  app-server、Sidecar、loopback 与 diff 均在首次出现处有人话解释。
- 与同视口 TimeAudit 参考图并排检查：沿用同一 header、hero、快照卡、首屏事实、
  左侧模块导航、绿色/白色设计系统和内容密度，没有新造另一套网站视觉。
- `/404.html` 专用制品真实显示“这里没有这页”、返回首页/规则/Skills；Vite preview
  对未知 URL 的首页 fallback 不冒充 Pages 404，真实未知路由留到公网部署后回读。
- `/rules/?rule=authorization_delegation_contract` 显示 E92、previous E91、pointer 13、
  durable explicit user authorization、真实调用一次、RecoverRelease/Claim、真实
  threadId/clientThreadId 与 complete goal 关闭状态；`/skills/personal-panel-refresh/`
  同步 unavailable/failed/dispatch-unconfirmed，且不再公开旧 task ID/Owner 台账。

Ignored QA：

- `docs/design/qa/codex-remote/01-overview-1440x900.png`
- `docs/design/qa/codex-remote/02-gallery-1440x900.png`
- `docs/design/qa/codex-remote/03-lightbox-1440x900.png`
- `docs/design/qa/codex-remote/04-overview-390x844.png`
- `docs/design/qa/codex-remote/05-gallery-390x844.png`
- `docs/design/qa/codex-remote/06-lightbox-390x844.png`
- `docs/design/qa/codex-remote/07-overview-320x800.png`
- `docs/design/qa/codex-remote/08-overview-768x1024.png`
- `docs/design/qa/codex-remote/09-module-768x1024.png`
- `docs/design/qa/codex-remote/12-overview-compact-1440x900.png`
- `docs/design/qa/codex-remote/13-timeaudit-compact-1440x900.png`

## 当前缺口与发布边界

- 本轮没有启动、关闭、重启、查询或访问 Codex Remote runtime；页面只说明真实做成、
  跑通过的产品与版本证据，不宣称当前在线。
- v0.1.5 测试和历史真实截图不能自动覆盖当前 Desktop、Codex、网络或浏览器版本。
- 当前 PUBLIC 仍是八项目提交 `85ca73d`。本地 `main` 以 E91 快照提交 `9c1f72d`
  为基线，当前 E92 + 第九项目 checkpoint 已通过最终本地门；只有定向提交、normal
  push、Pages deployment 和公网 commit/路由/图片/404 回读完成后，状态才升级为
  `nine_project_public_pass`。

## E92 合并快照

E92 Source 已正式发布并回读，assessor 确认 generation-changed、material-change 与
fresh independent website task 均成立。本网站只保留公开产品事实：E92 活动身份、
五规则 bytes/SHA、耐久明确授权、真实调用一次、terminal Owner 收敛、complete goal
关闭状态、来源 task 可逆归档，以及 personal-panel-refresh 的精确派发分类。内部 task
ID、Owner lifecycle 台账和 predecessor 细节不进入 PUBLIC 设计文档。
