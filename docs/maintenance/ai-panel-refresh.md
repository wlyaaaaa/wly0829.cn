# 个人看板 AI 快速刷新合同

## 产品入口

网页内容只由网站项目里的 AI 任务更新。用户不需要运行脚本或填写参数，直接说：

- “刷新个人看板里的 PCConfig”——只复核并可能更新 PCConfig；
- “刷新个人看板”或“全部更新一下”——按 Registry 顺序复核所有启用项目；
- 来源项目正式发布后，由 `personal-panel-refresh` 把项目 ID、远端回读提交和实质影响理由异步交给一个全新 projectless 网站任务。`create_thread` 返回可追踪任务 ID 即派发成功，来源对话立即继续或结束；创建失败时只报告精确错误，不等待新任务进度或完成。

脚本和 Provider 只能采集事实、计算指纹、检查闭包和验证产物。它们不能决定内容是否重要，也不能机械重写专业叙述。

`manual_owner_only` 是独立手动快照模式。Source、材料、反馈、规则、Skill、commit、
测试或报告变化都不能触发这类项目的网站任务；`personal-panel-refresh` 不适用。
只有 owner 明确说更新 CACB、学习方法、Codex Remote、personal-health，或明确要求包含 manual-only 项目的全量更新时，网站任务才可
携带 `--manual-owner-request` 继续。缺少该标记时计划返回
`manual_owner_request_required`，不得取证、改文案或发布。

## 默认不更新

AI 只有在“继续保留当前页面会让用户对能力、边界、当前状态、用法、成熟度、安全判断或下一步决策产生实质错误”时才修改网页。

以下变化默认是 no-op（不改网页）：

- 格式、注释、重构、文件移动；
- 单个测试、文案或实现细节调整；
- 时间戳、hash、普通计数或无语义版本变化；
- 页面已经准确写明的 blocked、dirty source 或 unreleased source 状态；
- 不改变用户判断的小 Bug 修复。

全量刷新是全量复核，不是全量重写。没有实质变化的项目必须保持内容文件 SHA-256 不变。

## 定向刷新流程

1. 运行 `npm run refresh:ai -- --project <id>`，读取本次项目、内容路径、当前内容指纹、Owner 采集入口和影响来源；manual-only 项目必须由明确 owner 请求改用 `--manual-owner-request`。
2. 完整阅读该项目当前总览、模块、状态、缺口和演化，不能只看结构化字段。
3. 运行 Registry 登记的只读 collectors，并按问题增补最小 Owner 回读；不复制任意原始输出到网站。
4. 比较新证据与当前页面，先作 material/no-op 判断。
5. 发现无需用户决策、可逆且有真实 Owner 验证入口的问题时，按 Owner 边界自动修复并重新取证。
6. 只有 material change 才原位改写、合并或删除该项目内容；不触碰其他项目。
7. 运行内容合同、构建、公开边界和本地预览；四项目 MVP 验收后的已登记刷新默认自动提交到现有 PUBLIC `main`，等待 Pages 并完成公网回读，不再单独询问发布授权。

AI 完成取证和内容判断后，生成 `wly.ai-panel-refresh-result.v1` 结果包并运行：

```powershell
npm run verify:ai-refresh -- --bundle <ai-result.json>
```

Verifier 检查 changed/unchanged/blocked 闭包、当前内容 SHA、每项目 source fingerprint、materiality、semantic revision 和 no-op 字节不变性。它只验证 AI 结果合同，不替 AI 判断语义。

## 全量刷新流程

运行 `npm run refresh:ai -- --all`。当清单包含 manual-only 项目时，只有 owner 明确要求全量复核才追加 `--manual-owner-request`；否则计划停在 `manual_owner_request_required`。AI 按 Registry 的 1…N 顺序建立计划，并可根据当前原生并发槽位分批取证。每个项目仍独立判断：

```text
enabled = changed + unchanged + blocked
```

- `changed`：有实质变化，已更新并验证；
- `unchanged`：完成新鲜取证，但内容文件字节不变；
- `blocked`：Owner 证据缺失或矛盾，保留旧快照并明确缺口。

全量模式允许 40 多个项目中绝大多数为 unchanged。不能为了证明“刷新过”更新时间、追加日志或改写无关句子。

## 每项目证据包

AI 在任务上下文中为每个项目保留最小公开安全证据：

- Registry 项目 ID、来源仓库、默认分支与当前 content path；
- 旧/新 source fingerprint 和内容 SHA-256；
- observedAt 与只读 collectors 的有界结论；
- materiality 结论和人话理由；
- 自动修复、验证结果、真实 blocker；
- changed 或 unchanged 结论。

不得把凭据、私人正文、完整日志、任意 Owner 原始 payload 或机器全景复制进证据包。

## 内容与反膨胀

- 更新必须替换、合并或删除旧内容，不追加“本次更新记录”。
- 不因刷新新增卡片、章节、重复证据表或“旧说法 + 新说法”。
- 当前状态只保留当前事实和必要缺口；过期动态值被直接替换。
- 演化只记录重要产品阶段：能力、边界或用户使用方式的重要变化。一个阶段可以是一天或时间段，并可合并多次相关建设。
- 小修、测试补充、单个 Bug、提交和普通发布不新增演化项。
- 不设置固定字数上限；通过重复语义、无消费者章节、同阶段演化和未受影响项目字节漂移检查控制膨胀。

## 规则边界

Rules 只根据 `Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json` 正式回读的 current E release 更新。Canonical source 的 dirty/unreleased 修改只作为施工状态显示，不进入活动规则正文、路径或 SHA，也不阻断非规则项目刷新。历史 C 盘 generation、Publisher、anchor、ledger 和回执只可出现在恢复历史说明中。

`refresh:agents-snapshot` 是快速结构化刷新，不是每次重跑整个 `.agents` 测试仓库。它重新验证 current/previous 指针、release record、五文件闭包、专用 E release validator、Skill 供应和合同覆盖；当前源码全量回归没有新证据时明确显示 Unknown（证据不足），不能沿用旧 PASS。下一代规则是否允许发布，仍由源码 Owner 根据 change surface（改动影响面）运行聚焦或标准验证。

一次刷新只在以下条件全部稳定时替换生成文件：同一进程独占刷新锁；开始与结束的 source HEAD、origin/main、branch、ahead/behind 和完整 dirty porcelain（工作树原始状态）一致；current/previous、pointer revision/SHA、release record、五文件路径/bytes/SHA 全部一致。输出先写同目录临时文件，再原子替换正式快照。任一事实中途变化时保留旧文件并要求重跑，不产生半新半旧快照。

## 40+ 项目扩展

Registry 是唯一项目清单。新增项目必须提供唯一内容包、轻量卡片信息、Owner collectors、impact sources 和独立 observedAt/fingerprint。

当前十项目为每条路由生成含完整正文的静态 HTML；共享 JavaScript 只负责菜单、搜索、规则选择、背景与画廊等增强，路由使用原生目录页面导航，并最多预取下一条非兼容路由。共享脚本、共享 CSS、全站紧凑搜索和全部项目模块搜索的 gzip 防膨胀审查阈值分别为 12 KiB、20 KiB、40 KiB 和 25 KiB；这些数字不是永久内容上限。构建器从项目快照与模块、规则、Skills 和 System 关系的审过字段生成去重词元，减去标题、摘要和别名已经包含的词；完整语义原型实测全站约 38.6 KiB、全部项目模块约 22.8 KiB，因此分别采用最小整数门 40/25 KiB。超过当前阈值时仍先审真实重复、依赖和公网墙钟，只有无法无损压缩且仍满足流畅性时才记录证据并最小增额。禁止把正文长句重新塞入公共 JS，也禁止点击后加载正文、fetch、spinner、骨架屏、空白或以删除专业正文换体积；图片画廊可先显示轻量缩略图，并在用户打开后解码完整图片。派生搜索索引只能保留类型、标题、短摘要、链接、明确 aliases（别名）和去重搜索词元，由权威正文在构建时投影，不能成为第二份语义正文。

## 完成标准

一次 AI 刷新必须返回：

- 实际检查项目；
- changed / unchanged / blocked；
- 真实耗时；
- 自动修复及证据；
- 内容、测试、构建和预览结论；
- 是否发生提交、发布和正式回读；所有门通过后默认自动发布，若未发布必须说明用户暂停或精确阻断。

文件存在、脚本成功、hash 一致或测试通过都不能单独代替内容准确、专业、详细且人话的阅读验收。
