# wly0829.cn

吴乐阳本人使用的只读项目看板。网站公开访问，但第一读者是本人：打开页面后应当能理解项目、规则、Skills、当前状态、失败和证据，不需要回看旧对话。

## 当前内容

- 项目清单：`config/panel-projects.json`
- 当前项目顺序：`.agents`、PCConfig、GitHub 总索引、ChineseASR、TimeAudit、PC Panel Hub、CACB、用 AI 把一件事学明白、Codex Remote、个人健康证据与安全决策、WeChatDirect、个人材料查找、文书和材料制作（1/2/3/4/5/6/7/8/9/10/11/12/13）
- 五份活动规则：同一 `/rules` 工作台内切换
- Skills：按当前实际价值排序，每项包含意义、决策影响、当前规则、术语、失败恢复和验证

单项目、三项目本地版和四项目 PUBLIC MVP 已验收；TimeAudit、PC Panel Hub、CACB、学习方法、Codex Remote、personal-health、WeChatDirect、personal-materials 与 document-materials 已依次选为第 5 至 13 项。document-materials 是 `real_dashboard`：完整展示当前事项与必要原件、同源 DOCX/PDF、逐页彩色/灰度验收、自包含材料包、本人签名与 ready 版本，以及递送、收件、处理、对方签回和恢复边界；只使用“文书和材料制作”这一公开名称，不读取或公开真实个人原件、签名、正文、路径、回执或结果。CACB、学习方法、Codex Remote 和 personal-health 则是 owner 明确指定的 `curated_packaging + manual_owner_only` 项目：学习方法只展示通用学习协作；Codex Remote 只读取 PUBLIC Git、版本、测试与获准图片，不调用冻结运行时；personal-health 只展示证据路由、前台刷新、离线验真、三态和 Health Owner 边界，不读取或公开个人健康载荷。Source、材料、截图、规则、Skill、设备或运行状态变化不会自动更新这些 manual-only 页面。项目仍由 Registry（登记清单）驱动，`.agents` 固定 `order=1`，每个项目按真实产品边界决定模块数量。规则页始终读取 verified current E release。现有 PUBLIC 目标已获长期授权：已登记刷新和选定项目通过内容、测试、构建、公开门与预览后，默认自动 normal-push `main`、等待 Pages 并公网回读。

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

当前每条路由都在构建时生成完整静态正文，禁用 JavaScript 仍可阅读；浏览器只加载一个小型共享增强脚本，使用原生目录页面导航，并最多预取下一条非兼容路由。共享交互 JavaScript、共享 CSS、全站紧凑搜索和全部项目模块搜索的 gzip 审查阈值分别为 12 KiB、21 KiB、64 KiB 和 64 KiB；它们是防膨胀审查线，不是永久内容上限。搜索在构建时从项目快照与模块、规则、Skills、System 节点的审过字段生成有界自然短语，只保留搜索语义，不把完整正文复制进公共 JavaScript。当前十二项目构建后的实际 gzip 数值记录在本轮 `design-qa.md`，README 不把一次构建数字固化成永久事实。不得用点击后正文加载、fetch（网络读取）、spinner、骨架屏、空白或删减专业正文换取体积；图片画廊仍可使用轻量缩略图，并只在用户打开后解码完整图片。

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

当前产品边界、模块规则和发布合同以 [项目规则](AGENTS.md)、[项目 Registry](config/panel-projects.json) 与实际内容对象为准；不再维护一份会重复模块数、Skill 数和快照状态的第二规格。长期内容原则见 [看板内容建设原则](docs/design/内容建设原则与MVP重构方案.md)。
