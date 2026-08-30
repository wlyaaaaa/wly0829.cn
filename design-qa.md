# 八项目 MAP 设计与产品验收

状态：`eight_project_public_pass`

观察时间：2026-08-30

## 当前范围

Registry 当前启用 8 项：`.agents`、PCConfig、GitHub 总索引、ChineseASR、
TimeAudit、PC Panel Hub、CACB、用 AI 把一件事学明白。

第 8 项是 `curated_packaging + manual_owner_only` 私有来源项目。公开页只还原
AI 协助学习的方法本质：搜索权威资料、讲人话、搜索后继续交流与重查、少量不计分
问题、必要时最小验证、人类最终决定、无学习监督、小注意力和低复杂度。页面不展示
任何具体学习主题、材料清单或数量、顺序、状态、个人进度、原始反馈或私人来源路径。

## 第 8 项内容与 UI

- 产品名：`用 AI 把一件事学明白`，Overview + 5 个方法节点：先查清楚、讲人话、
  继续聊、题目与验证、人做主。
- 首屏直接说明人负责问题、节奏和最终取舍；AI 负责搜索、解释、补查、修正和必要
  验证。沉默、提问或讨论中的建议都不当作确认。
- 原生方法画布用 6 步静态流程、你 / AI / 刻意没有三列和主题中立的不计分问题
  解释完整方法；没有图片、画廊、动画、表单或客户端状态。
- learning kind 使用独立 copy renderer，保留前 7 项既有 `AI（人工智能）` 注释行为，
  但不在第 8 项每张卡机械重复括注。
- 方法快照不显示事实/缺口计数；首页卡不显示进度，改为人做主、一手优先、问题
  不计分、无监督。
- 参考来源可直接打开，包含 ACRL、NIST、ERIC、EEF、IES、PMC、PubMed、DOI、
  UNESCO 与美国教育部；页面同时说明研究平均结果不能自动外推到每个人和每种情境。

## E90 规则快照

- 活动规则已从 E89 更新为 E90：PRIVATE main
  `998a7e75ba0285b961edff65ef371699c1a5626e`，ruleset
  `a1e814325d6723267c39c62fb80b25af2e8098d4292e12c9f7a08be38e71ea05`。
- E90 唯一语义变化是 `public_project_private_companion_migration`：PUBLIC 项目中
  Git 明确忽略、未跟踪且有价值的本地私有材料，先复制/hash，提交到已登记 PRIVATE
  companion 并完成远端回读，再以可回滚 rename 和继续 ignored 的本地 link 保留原路径。
- `config/panel-rule-bindings.json`、授权规则人话层和完整 guide 已同步；快速结构化快照
  重新生成并通过 live E90 校验。全量 `.agents` 源测试没有在快速快照中重跑，继续
  明确显示 Unknown，不沿用旧 PASS。

## Manual-only 合同与根治

- learning 的 `impact_sources=[]`；Source、材料、反馈、规则、Skill、测试或任何
  source-side materiality 声明都不会创建网站任务。
- targeted refresh 未带 `--manual-owner-request` 时返回
  `manual_owner_request_required`；带标记才进入 `ready_for_ai`。全量刷新会同时列出
  CACB 和 learning 两个手动项目。
- result verifier 现在要求 collectors 与 Registry 数量完全闭合、每项为对象、命令
  精确匹配、状态合法、时长有效；changed/unchanged 必须全部 `pass`。`null`、错误命令
  和失败状态均有机械反例测试，不能再用一条空 collector 冒充 fresh evidence。
- 没有新增 Skill、Source hook、watcher、服务、数据库、账号、计划任务或自动同步。

## 自动化门

- `npm run build`：PASS。
- `npm test`：37/37 PASS。
- Snapshot binding：E90、5 个规则、23 个公开 Skill、25 个 active install intent，
  live finding 0。
- PUBLIC gate：86 个 source + 119 个 dist，共 205 个文件，finding 0。
- 79 条产品路由均生成完整静态入口；另有 custom 404，共 80 个 HTML。
- 共享 JavaScript：13,957 bytes，Node gzip 5,046 bytes，低于 120 KiB 阈值。
- CSS：75,084 bytes，gzip 13,391 bytes；第 8 项增加的是无状态方法画布样式，没有
  引入浏览器正文或依赖。
- 紧凑搜索投影：81 条，28,938 bytes，gzip 11,911 bytes，低于 24 KiB 阈值；
  learning 总览和 5 个方法节点均有自然问法入口。
- 79/79 route root 均非空；最小 HTML 48,341 bytes，最大 Rules 145,612 bytes。
- 浏览器图不含 narrative content import、dynamic import 或 click-time fetch。

## 内容与独立审计

- 私有材料挖掘、学习科学研究、网页 UX、内容公共边界、UI/架构和刷新合同由多路
  全新 Sol Max 独立审查；作者检查不冒充终审。
- 内容终审确认：主题化题目、材料数量/状态、职业包装、私人反馈和软件评测语境均已
  退出；questions-validation 只使用领域中立的解释、观察、计算、小实验与失败记录。
- 科学依据明确限定范围：来源核验、主动提取、形成性反馈、支架和人类自主有研究或
  治理依据，但聊天界面本身、一次训练的广泛远迁移和整套产品普遍有效均未被证明。
- UI 源码和首次 Edge 候选检查覆盖 1440/768/390/320；方法画布对应 6/3/1/1 列，
  320 overview 与 module 未见横向溢出。最终审计要求的 Browser Skill 仍因受管缓存
  版本错位不能自动建立 binding，因此最终候选的插件级四宽交互复验仍是已知证据缺口，
  不能被机械测试冒充。

## 当前缺口与发布边界

- 第 8 项不宣称个人掌握、学习效果、实时辅导服务或对所有人普遍有效。
- 可选问题不计分、不计时、不强制提交，也不形成掌握记录。
- 验证只在会改变判断时发生；未执行的设计保持设计，小范围观察不外推为现实普遍效果。
- Browser Skill 版本错位是宿主工具证据缺口，不是网页已知功能失败；本地最新预览已向
  owner 打开。按四项目 MVP 后的项目规则，该缺口对选定新项目发布为 non-blocking，
  但必须保留在当前 QA。
- 第 8 项产品提交 `b0adcc91da0d19725163ae555e3a47441a9c82a2` 已 normal-push
  到 PUBLIC `main`。Pages workflow `33308431463` 的 build 与 deploy 均 success，
  github-pages deployment `6166022936` 绑定同一提交。
- 公网首页、learning 总览、authoritative-research 和 human-control-simple 均返回
  HTTP 200，route marker 与代表正文完整，职业/进度禁用词 0 命中。公网共享脚本
  `index--yTxmrqe.js` 为 13,957 bytes，SHA-256
  `1F1E7A3AD1EBE35FEC0B8B6B04D91791AED37BDBBBA7C783565E783066F3880D`，
  与本地产物逐字节一致。因此八项目状态升级为 `eight_project_public_pass`。
