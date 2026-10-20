# AI 刷新计划适配合同

网站更新的唯一主流程是 [按需更新操作清单](../ondemand-update.md)。范围确认、事实重取、内容判断、独立复核、构建、预览、发布和公网回读均按该清单执行；本文只规定现有 `refresh:ai` 只读计划与 v2 结果校验包怎样接入，不再维护另一套刷新或发布步骤。

## 只读计划入口

```powershell
npm run refresh:ai -- --project <id>
npm run refresh:ai -- --project cacb --manual-owner-request
npm run refresh:ai -- --all
```

`prepare-ai-panel-refresh.mjs` 读取 `config/panel-projects.json` 和当前作者输入，返回 `wly.ai-panel-refresh-plan.v2`。它不运行采集器、不判断内容是否重要、不改正文、不创建网站任务。本人要求更新网站后，主持可将这个计划作为按需流程的来源、范围和指纹附件；来源项目、规则或 Skill 变化本身不能启动刷新，只在原任务汇报可能过时之处。

- `--project` 只选择一个启用项目，`--all` 按 Registry 的固定名次选择全部启用项目，两者互斥。
- `manual_owner_only` 项目必须已有本人的明确更新请求，才能附 `--manual-owner-request`。没有该标记时计划返回 `manual_owner_request_required`，不能据此取证或改动其内容；带标记不会自行创造本人授权。
- `collectors`、`conditional_collectors` 与 `impact_sources` 是候选事实入口。由本轮 AI 按已确定的范围选择，不把它们当成每次必须全跑的清单。
- 型号与档位按活动路由和实际执行身份记录；Registry 中的 null 不是可调用型号。

## 作者源与指纹

项目 ID、路由和作者目录不保证同名，以 Registry 的 `ai_refresh.content_path` 为总览入口。`panel-content-paths.mjs` 同时按登记项目身份与该入口的真实目录、路由收集所属页，避免只改总览或按 ID 猜错目录。

| 计划字段 | 实际含义 |
|---|---|
| `content_path` | 当前总览入口：原生项目指向真实 `sources/pages/<作者目录>/page.json`；尚由冻结字节提供总览的项目指向实际冻结 HTML |
| `content_files` | 该项目总览和全部模块的逐文件路径及 SHA-256；包含页面 JSON、布局、当前 `site-astro/src/content/pages/*.md`，以及同项目仍上线的冻结子页 |
| `content_sha256` | 对按路径排序的 `content_files` 清单计算的聚合 SHA-256；不是总览单文件的 SHA |
| `source_fingerprint` | 由 AI 根据本次选用的 Owner 观察和保留证据填写，计划阶段为 null；网页文件未变不能证明来源状态未变 |
| `observed_at` | 作者输入声明的观察日期；没有声明就明确 Unknown，不用脚本运行时间冒充事实新鲜度 |

直接编辑的 Markdown 也是实际构建输入，因此必须进入指纹，不能只校验 JSON。内容更新、转换与直接 Markdown 的冲突处理继续遵守 [Astro 作者源说明](../../site-astro/README.md)。新页或迁移完成后，同步维护 Registry 的真实入口；冻结与原生并存的项目不能漏掉仍上线的子页。

全局表面的 `content_paths` 可以登记作者目录；计划和验证器展开为相同的实际文件清单：Rules 包含 `sources/rules` 与当前规则页面源，Skills 包含当前目录和详情源，System 指向已合并内容的保留首页。`/system/` 是去向页。首页可修改范围继续服从按需清单的首页锁定与明确例外，计划列出文件不代表获得编辑授权。

旧 React 正文、`app/panel-facts.generated.js` 及其专用快照生成、保留、验证脚本已退役。规则作者源使用现有 `prepare-astro-release.py refresh` 更新并由生产构建的 `astro_rules.py` 核对；不得以旧快照 PASS 代替当前作者源或活动规则验证。

## v2 结果包

本轮 AI 按按需主流程完成内容判断后，可生成 `wly.ai-panel-refresh-result.v2` 并运行：

```powershell
npm run verify:ai-refresh -- --bundle <ai-result.json>
```

结果包保留这些接口：

- `mode` 为 targeted 或 all。targeted 恰有一个项目；all 与 Registry 的全部启用项目闭合，满足 `enabled = changed + unchanged + blocked`。
- `projects` 逐项声明入口、旧/新聚合内容 SHA、旧/新 semantic revision、source fingerprint、观察时间、material、semantic_change、理由、实际采集器及需要的回执。
- `source_deltas` 对每个所选项目分别保留产品与技术的 added、changed、retired 桶、unknowns，以及受影响的项目、Rules、Skills、System 表面。每项是 AI 写的人话结论与 Owner 证据；路径、提交和 hash 只定位输入，不能代替语义判断。
- `global_surfaces` 对计划中的每个全局表面逐文件声明旧/新 SHA 与 changed、unchanged 或 blocked；目录必须展开成计划采用的实际文件清单。
- `auto_repairs` 和 `blockers` 分别列真实修复与未解决项，不能用计数替代说明。

验证器检查当前作者文件、聚合指纹、登记身份、结果闭包、semantic revision、materiality、逐文件 no-op，以及已声明采集器/回执的接口约束。只有声明新鲜 SYSTEM/Administrator 快照时才要求相应登记回执，回执需满足 schema、principal、pointer、完整可见性与 SHA 约束。它不执行来源采集，也不证明正文已经准确、完整或好读；阅读、来源完整性及发布验收仍由唯一主流程负责。

未变化或 blocked 项目保留原内容字节；只有 semantic_change=true 才将 semantic revision 加一。发生实际内容变化的表面须与 AI 声明的 affected_surfaces 闭合，不能用通过的 hash 检查替 AI 决定新增、修改或退役的意义。

## 未请求的手动快照怎样保留

合并多个 targeted 计划形成 all 结果时，未被本人点名更新的 manual_owner_only 项目可以保留旧快照，不能借 all 结果制造一次新鲜来源复核。其接口为：

- `status=unchanged`、`retained_manual_snapshot=true`；包级和项目级 `manual_owner_request` 为 false 或省略。
- 旧/新内容 SHA 与 semantic revision 相同，`material=false`、`semantic_change=false`、`source_fingerprint=null`。
- collectors、collector_receipts、产品/技术六个差分桶和 affected_surfaces 均为空。
- 保留原观察时间，reason 明说只核对网站快照字节，未读取或更新来源。

普通项目不能使用这个保留标记；实际手动更新仍须本人的明确请求。该接口只处理结果包闭合，不改变按需清单规定的更新范围、事实来源或发布责任。
