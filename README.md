# wly0829.cn

吴乐阳本人使用的个人 AI 协作工作台。网站公开访问，但第一读者是本人：可以查看项目、规则、Skills、当前状态和证据，也可以复制 AI 续作说明、配置电脑连接并进入实际任务，不需要回看旧对话。页面观察记录与实际操作结果分别说明。

## 当前内容

- 最终项目价值顺序与后续施工顺序：`config/final-project-order.json`
- 已纳入项目 Registry（登记表）：`config/panel-projects.json`
- 当前图片页面登记35个项目，包含“个人网站（总看板）”，Skills目录展示31项能力。首页计数按当前 sources/pages 与项目分组核对。
- 活动规则：`/rules` 只展示当前 release 的正式阅读专题；兼容引用、目录与入口模板另外进入完整发布校验
- Skills：按当前实际价值排序，每项包含意义、决策影响、当前规则、术语、失败恢复和验证

最终价值规划保留 34 个独立项目，包括 Emerald Veil、个人表达与沟通支持和个人网站（总看板）。既有价值槽位保持原顺序，网站接在末尾；当前图片页面的35张项目卡按实际分组登记核对，内部价值槽位不作为页面编号。Playbook 与 RTX 5090D Ollama 项目已退出展示。网页语义更新以活动 E release、当前 Skill 供应和各项目 Owner 的已发布证据为准；来源、运行观察与历史验收分别标时，不把某次模型分工或旧 E 代号写成永久产品身份。电脑 MCP、手机同库理解、表达支持、外部图像等通用能力与可恢复轻量工具按各自真实边界呈现。Codex、Gemini／Antigravity、Claude、OpenClaw 的备份范围在“AI 工作区备份与恢复”中统一解释，但源码、备份消费者和恢复链保持独立。项目编号与画廊按需加载保持，产品层先讲用途、功能和选择，技术层保留完整证据。

Scripts 的能力由对应项目直接承接，不生成独立卡片、路由、内容包、TODO 或未来施工项；`md-triple-tactics-talent-solver` 只保留为 System 的历史 GitHub 总账资产，不属于独立项目规划，也不生成项目卡、路由、内容包或未来施工项。

排序按理性多数认可的综合净价值判断：既看普适直接收益和防损，也给已有真实消费者的控制面有限乘数，再按成熟度修正兑现概率并扣除采用、维护、复杂度和副作用成本；不会把下游价值重复相加，也不因本人当前使用频率、历史建设顺序或个人偏好加分。所有不单独成卡的关系说明都已在现有项目或 System 中闭合，当前没有非卡说明 TODO（待办）。CACB、学习方法、Codex Remote 和 personal-health 是 owner 明确指定的 `curated_packaging + manual_owner_only` 项目；其余已发布项目默认 `real_dashboard`。规则页始终读取 verified current E release。现有 PUBLIC 目标已获长期授权：已登记刷新和选定项目通过内容、测试、构建、公开门与预览后，默认自动 normal-push `main`、等待 Pages 并公网回读。

## 项目模式

- `real_dashboard（真实看板）`：默认。展示真实架构、流程、状态、缺口和证据。
- `curated_packaging（策展包装）`：只有用户明确指定的包装项目才可使用。

已纳入项目完整展示产品与技术细节。只隐藏私人敏感正文和密钥、令牌、恢复码等可复用秘密；模型、Provider、Profile、版本、模式、路径、端口、组件、数据流、提交、hash、候选、安装/运行状态、失败、测试、E2E 和已知缺口都保留。项目、模块与 Skill 使用“产品用法 / 技术与依据”两个页签，默认先说清能做什么、在哪里开始、需要什么、实际步骤和结果；会影响使用的真实选择保留名称与作用，完整专业依据单独直达。

唯一不进入 Git 的项目文档是 `docs/design/private-content-rules.md`，它保存包装和屏蔽规则。其他产品、维护和 QA 文档都应跟踪。可重建 QA 图片留在 ignored 目录。

## 本地命令

```powershell
npm ci --prefix site-astro
npm run dev -- --host 127.0.0.1 --port 4173
npm run build
npm run build -- --pages /how/,/projects/agents/
npm run preview -- --host 127.0.0.1 --port 5194
npm test
npm run verify:public
```

`npm run build` 生成完整静态站到仓库根 `dist`；`npm run dev` 一条命令先构建再启动同一成品的本地预览，`preview` 只启动已有成品。修改内容后重新运行，当前不承诺热更新。构建直接读取首页和授权页的 HTML 源文件及已入库运行件，驾驶舱由 Astro 原生页取数并渲染，原样带上 33 个仍由冻结字节提供的页（4 个冻结项目 31 页，加 `/search/` 和 `/system/`）；只从本地依赖包取资源，不读取旧站构建目录，也不联网恢复外壳。内容指纹决定哪些页面需要更新；`--pages` 只选择指定路由，须先有完整 `dist`。每次构建把分步耗时、重建页面和完整文件清单写入 `dist/.build-receipt.json`。来源、缓存、准备链和按需迁移方法见 [site-astro/README.md](site-astro/README.md)。保留已有 5194 预览时复用可控会话，不另开重复服务。

## AI 快速刷新

网页正文由 AI 更新。用户只需要说“刷新个人看板里的 PCConfig”或“全部更新一下”；AI 读取 Registry 和真实 Owner、形成独立产品判断、自动修复必要源问题并原位更新内容。只有本人要求“更新网站”时才开始更新；来源项目、规则或 Skill 发布后不自动交接，也不新建网站任务。AI 在别的工作中发现网站已过时，只在汇报里提一句，等本人要求更新。一次定向请求只处理点名的登记快照及受影响的直接表面，小改默认不更新，全量复核也允许全部项目保持字节不变。仍匹配的证据才复用，批次稳定后只运行一次最终完整门；预览服务在可控后台会话中限时运行。网站门通过后自动发布到现有 PUBLIC `main` 并完成 Pages 回读。

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

该命令只返回项目、实际上线的总览与全部模块源（包括页面 JSON、布局和当前 Markdown）的聚合指纹、事实采集入口和刷新边界；尚未迁移的四个项目明确列出仍参与构建的冻结 HTML，不写网页正文。完整合同见 [个人看板 AI 快速刷新合同](docs/maintenance/ai-panel-refresh.md)。

`manual_owner_only` 项目没有 Source/Skill 自动刷新。未带
`--manual-owner-request` 时，CACB、学习方法、Codex Remote 或 personal-health 的定向计划，以及包含
这些项目的全量计划只返回 `manual_owner_request_required`，不会收集证据或创建网站
任务；只有本人明确要求的网站任务才可携带该标记继续。

当前每条路由都在构建时生成完整静态正文，禁用 JavaScript 仍可阅读；浏览器只加载一个小型共享增强脚本，使用原生目录页面导航，并最多预取下一条非兼容路由。共享交互 JavaScript、共享 CSS、全站紧凑搜索和全部项目模块搜索的 gzip 审查阈值以 Registry 的当前实测线为准；它们是防膨胀审查线，不是永久内容上限。搜索在构建时从项目快照与模块、规则、Skills、System 节点的审过字段生成有界自然短语，只保留搜索语义，不把完整正文复制进公共 JavaScript。当前完整构建的实际 gzip 数值记录在 `design-qa.md`，README 不把一次构建数字固化成永久事实。不得用点击后正文加载、fetch（网络读取）、spinner、骨架屏、空白或删减专业正文换取体积；图片画廊仍可使用轻量缩略图，并只在用户打开后解码完整图片。

规则作者源由现有 `python scripts/prepare-astro-release.py refresh --output <本轮回执.json>` 从已核验的 current E release 更新到 `sources/rules`；构建再验证该快照并排版原文。Skills 目录和详情由 `sources/pages/skills-home`、`sources/pages/skill-*` 拥有。旧 React 专用的 `refresh:agents-snapshot` 与 `verify:snapshot` 已退役；文件指纹只说明作者输入是否变化，不代替当前活动规则与来源证据的核验。

定位 Source 变化影响的候选页面：

```powershell
npm run impact -- --project agents --path AGENTS.md
npm run impact -- --project agents --path AGENTS.md --material-change
```

路径命中只表示影响候选，`--material-change` 标明已确认的实质漂移；来源变化不自动路由或新建网站任务。AI 在来源任务的汇报中说明过时内容，等本人要求更新网站后，再按该请求的范围处理候选页面。

## 事实来源

优先级：

1. 正式 current E release、PRIVATE main commit 与该代完整发布文件目录；
2. Source 项目真实默认分支；
3. Git/机器/Provider 的正式 read-back；
4. 项目测试和用户路径；
5. 基于上述事实维护的页面解释。

Dirty/unreleased source 不冒充 current E release；Source、Test、Install、Publish、Fresh task、E2E 和 User acceptance 彼此独立。C 盘旧规则材料只作恢复历史。

## 发布

Windows 发布二进制通过 SHA256 缓存 `E:\Cache\wly0829\release-assets` 在同卷输出间共享；文本和 `live-hardware` 保持独立，资源替换使用原子写入。
`WLY_RELEASE_ASSET_CACHE` 可指定隔离测试缓存；跨卷输出会明确警告并独立复制，不节省该输出的空间，同卷硬链接失败和损坏缓存直接报错。
项目使用单一 `scripts/build-site.py` → Astro 静态构建链和 GitHub Pages。完成要求：

- 本地 build/test/public gate 通过；
- 真实浏览器完成桌面、平板和手机验收；
- 定向 commit 和 normal push 到 `main`；
- 分别核验源码 `main`、成品 `site-dist`、Pages 部署与公网回读的对应关系；
- 直接路由、自定义 404、robots、sitemap 与 SEO 全部核对。

当前产品边界、模块规则和发布合同以 [项目规则](AGENTS.md)、[看板产品与内容规则](docs/design/panel-content-contract.md)、[项目 Registry](config/panel-projects.json) 与实际内容对象为准；[最终项目顺序](config/final-project-order.json) 拥有保留项目的内部价值顺序、施工顺序和已闭合的非卡归类证据，不复制模块数、Skill 数或项目快照状态。页面编号按实际展示列表连续生成。长期内容原则见 [看板内容建设原则](docs/design/内容建设原则与MVP重构方案.md)。
