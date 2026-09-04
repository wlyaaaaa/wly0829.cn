# wly0829.cn

吴乐阳本人使用的只读项目看板。网站公开访问，但第一读者是本人：打开页面后应当能理解项目、规则、Skills、当前状态、失败和证据，不需要回看旧对话。

## 当前内容

- 最终项目价值顺序与后续施工顺序：`config/final-project-order.json`
- 已发布项目 Registry（登记表）：`config/panel-projects.json`
- 当前有 22 个项目已发布，并按固定总名次显示；未建设的名次保持空缺
- 五份活动规则：同一 `/rules` 工作台内切换
- Skills：按当前实际价值排序，每项包含意义、决策影响、当前规则、术语、失败恢复和验证

最终规模固定为 36 个独立项目：22 个已经发布，14 个仍待建设。名次是整个项目集合的总价值顺序，不再按历史建设先后压缩编号；所以当前目录允许缺号，未建项目不会提前出现卡片、路由或占位文案。当前最高未建项是 `#12 devconfig-backup`；完成一个项目的来源重建、三层页面、测试、构建、PUBLIC 发布和公网回读后，再由同一份最终顺序选择下一个最低未完成名次。

排序按理性多数认可的综合净价值判断：既看普适直接收益和防损，也给已有真实消费者的控制面有限乘数，再按成熟度修正兑现概率并扣除采用、维护、复杂度和副作用成本；不会把下游价值重复相加，也不因本人当前使用频率、历史建设顺序或个人偏好加分。10 个不单独成卡的关系说明中已有 8 个完成，剩余 2 个只作为现有页面 TODO（待办）维护。CACB、学习方法、Codex Remote 和 personal-health 是 owner 明确指定的 `curated_packaging + manual_owner_only` 项目；其余已发布项目默认 `real_dashboard`。规则页始终读取 verified current E release。现有 PUBLIC 目标已获长期授权：已登记刷新和选定项目通过内容、测试、构建、公开门与预览后，默认自动 normal-push `main`、等待 Pages 并公网回读。

## 项目模式

- `real_dashboard（真实看板）`：默认。展示真实架构、流程、状态、缺口和证据。
- `curated_packaging（策展包装）`：只有用户明确指定的包装项目才可使用。

已纳入项目默认展示完整产品与技术细节。只隐藏私人敏感正文和密钥、令牌、恢复码等可复用秘密；模型、Provider、Profile、版本、模式、路径、端口、组件、数据流、提交、hash、候选、安装/运行状态、失败、测试、E2E 和已知缺口都保留。每个项目第一屏先列出当前实际选择，不能让本人读完整篇才拼出“现在到底用了什么”。

唯一不进入 Git 的项目文档是 `docs/design/private-content-rules.md`，它保存包装和屏蔽规则。其他产品、维护和 QA 文档都应跟踪。可重建 QA 图片留在 ignored 目录。

## 本地命令

```powershell
npm install
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
npm run build
npm test
npm run verify:snapshot
npm run verify:public
```

## AI 快速刷新

网页正文由 AI 更新。用户只需要说“刷新个人看板里的 PCConfig”或“全部更新一下”；AI 读取 Registry 和真实 Owner、形成独立产品判断、自动修复安全问题并原位更新内容。小改默认不更新，全量复核也允许全部项目保持字节不变。来源发布造成实质快照漂移时，`personal-panel-refresh` 异步创建一个 projectless 网站任务；任务 ID 是派发成功回执，来源对话不等待。网站门通过后自动发布到现有 PUBLIC `main` 并完成 Pages 回读。

AI 内部可先取得定向或全量刷新计划：

```powershell
npm run refresh:ai -- --project pcconfig
npm run refresh:ai -- --project chinese-asr
npm run refresh:ai -- --project timeaudit
npm run refresh:ai -- --project pc-panel-hub
npm run refresh:ai -- --project wechat-direct
npm run refresh:ai -- --project personal-materials
npm run refresh:ai -- --project document-materials
npm run refresh:ai -- --project work-delivery
npm run refresh:ai -- --project daily-preferences
npm run refresh:ai -- --project personal-media
npm run refresh:ai -- --project localocr
npm run refresh:ai -- --project vault-tool
npm run refresh:ai -- --project video-scaffold
npm run refresh:ai -- --project openclaw-gateway
npm run refresh:ai -- --project cacb --manual-owner-request
npm run refresh:ai -- --project personal-health --manual-owner-request
npm run refresh:ai -- --all
npm run verify:ai-refresh -- --bundle <ai-result.json>
```

该命令只返回项目、当前内容指纹、事实采集入口和刷新边界，不写网页正文。完整合同见 [个人看板 AI 快速刷新合同](docs/maintenance/ai-panel-refresh.md)。

`manual_owner_only` 项目没有 Source/Skill 自动刷新。未带
`--manual-owner-request` 时，CACB、学习方法、Codex Remote 或 personal-health 的定向计划，以及包含
这些项目的全量计划只返回 `manual_owner_request_required`，不会收集证据或创建网站
任务；只有本人明确要求的网站任务才可携带该标记继续。

当前每条路由都在构建时生成完整静态正文，禁用 JavaScript 仍可阅读；浏览器只加载一个小型共享增强脚本，使用原生目录页面导航，并最多预取下一条非兼容路由。共享交互 JavaScript、共享 CSS、全站紧凑搜索和全部项目模块搜索的 gzip 审查阈值以 Registry 的当前实测线为准；它们是防膨胀审查线，不是永久内容上限。搜索在构建时从项目快照与模块、规则、Skills、System 节点的审过字段生成有界自然短语，只保留搜索语义，不把完整正文复制进公共 JavaScript。本轮二十二项目构建后的实际 gzip 数值记录在 `design-qa.md`，README 不把一次构建数字固化成永久事实。不得用点击后正文加载、fetch（网络读取）、spinner、骨架屏、空白或删减专业正文换取体积；图片画廊仍可使用轻量缩略图，并只在用户打开后解码完整图片。

刷新 `.agents` 的活动规则/Skill 结构化证据：

```powershell
npm run refresh:agents-snapshot
```

该结构化刷新只属于 `.agents`。Rules 正文、路径和 SHA 只取 `Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json` 返回的 frozen current E release；当前 source checkout 即使 dirty 或已进入下一候选提交，也只能作为非活动施工状态展示，不能覆盖 E release。刷新通过独占锁、前后 Git/E pointer 完整指纹和原子替换避免半新半旧；快速刷新不重跑整个源码测试集，没有新全量回归证据就明确显示 Unknown。解释是否准确仍由 AI 内容终审负责，不冒充 hash 检查能力。

判断 Source 变化是否需要网站任务：

```powershell
npm run impact -- --project agents --path AGENTS.md
npm run impact -- --project agents --path AGENTS.md --material-change
```

路径命中只表示影响候选；只有 Source Owner 确认页面会实质失真并显式传入 `--material-change`，才要求创建新的独立网站任务。

## 事实来源

优先级：

1. 正式 current E release、PRIVATE main commit 与五文件 ruleset；
2. Source 项目真实默认分支；
3. Git/机器/Provider 的正式 read-back；
4. 项目测试和用户路径；
5. 基于上述事实维护的页面解释。

Dirty/unreleased source 不冒充 current E release；Source、Test、Install、Publish、Fresh task、E2E 和 User acceptance 彼此独立。C 盘旧规则材料只作恢复历史。

## 发布

项目使用 React、Vite 和 GitHub Pages。完成要求：

- 本地 build/test/public gate 通过；
- 真实浏览器完成桌面、平板和手机验收；
- 定向 commit 和 normal push 到 `main`；
- 远端 `main`、Pages deployment 和公网 read-back 指向同一提交；
- 直接路由、自定义 404、robots、sitemap 与 SEO 全部核对。

当前产品边界、模块规则和发布合同以 [项目规则](AGENTS.md)、[项目 Registry](config/panel-projects.json) 与实际内容对象为准；[最终项目顺序](config/final-project-order.json) 只拥有固定 36 项名次、施工顺序和非卡说明待办，不复制模块数、Skill 数或项目快照状态。长期内容原则见 [看板内容建设原则](docs/design/内容建设原则与MVP重构方案.md)。
