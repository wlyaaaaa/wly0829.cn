# GitHub 总索引项目内容设计

## 交付状态

本文件和 `app/content-github-index.js` 已进入本地看板；三项目版已经完成用户验收，但仍不是公网发布回执。

- 已完成：项目总览、六个真实模块、术语、工作流、组件、失败恢复、验证层、阶段时间线和维护入口；内容对象与三态字段已进入项目 Registry、可见路由、通用项目页面和网站合同测试。
- 已通过：JavaScript import（导入）、字段闭包、六个唯一模块、readerStates（三态）和项目隔离约束。
- 三项目 Owner 浏览器验收已经完成；整站 commit（提交）、push（推送）、Pages（静态站）发布和公网回读仍未执行。
- 接入边界：规则与 Skills 仍是 `.agents` 拥有的全局页面，GitHub 总索引只使用自己的总览与六模块。
- 并发边界：创建本包时，wly0829.cn 和 GitHub 总索引都已有其他任务的 dirty work（未提交修改）；后续只在网站内容包与设计文档内修正，不触碰来源仓库的并发施工。

## 一句话产品定位

GitHub 总索引不是项目陈列柜，而是当前 GitHub Owner（仓库责任域）身份与已登记本地副本的真实总账：它确认受管目录对应哪个远端、公开还是私有、默认分支与相关 Worktree（工作树）是否收敛，并把“能传输”“适合公开”“已有授权”分开证明。

## 为什么需要

项目多、工作树多以后，最危险的错误通常不是 Git 命令不会用，而是目标搞错或证据层混在一起：

1. 本地目录名称正确，但 `origin` 指向另一个仓库；
2. 当前分支对自己的 upstream（上游跟踪分支）是 0/0，但提交没有进入远端默认分支；
3. 当前工作树干净，另一个 linked worktree（关联工作树）仍有独有内容；
4. 仓库曾经是 PRIVATE，后来变成 PUBLIC，却继续沿用旧可见性处理敏感候选；
5. 本地 main 与 origin/main 同步，但工作区仍有未提交修改；
6. 临时工作树已被默认分支吸收，却因不清楚依赖而永久堆积，或反过来被过早删除；
7. refresh 只写完一半，公开 Markdown 混合两个观察时间，却被当成最新事实。

总索引的价值是对这些事故给出结构化、可复查、能失败关闭的证据，而不是要求每次普通 commit 走一遍固定审批流程。

## 真实使用例子

2026-08-29 为 wly0829.cn 准备本内容包时，现场 `Get-ProjectAdmission.ps1 -ForPublication` 同时回读公开远端 `wlyaaaaa/wly0829.cn` 的 GitHub metadata（GitHub 元数据）与 remote refs（远端引用）：

- 仓库 identity、PUBLIC、默认分支 main 均正确；
- 本地 main 与 origin/main 的 ahead/behind（领先/落后）为 0/0；
- 工作区存在其他任务的未提交修改；
- 因此顶层是 `warn`，策略是 `clean_or_stage_explicitly`，而不是“可以发布”。

本任务据此只创建两个明确文件，没有触碰并发修改，也没有把 0/0 冒充成内容已经提交、推送或上线。

最终用户得到的是：正确 repo/remote、当前 visibility、默认分支、全部 worktree/branch 证据、继续/警告/阻断原因，以及发布和恢复还缺哪一层。

## 现场权威与来源

本包没有用旧报告替代现场。主要来源如下：

| 来源 | 作用 | 本包怎样使用 |
|---|---|---|
| `E:\GitHub总索引\AGENTS.md` | 当前项目边界、Owner 分工、公开安全与生成/恢复原则 | 决定负责与不负责、PRIVATE 不展开、不得自动清理 |
| `README.md` 与《我的 GitHub 项目管理指南》 | 面向人的用途、常用入口和真实场景 | 形成总览的读者层，不作为动态权威 |
| `tools/Get-ProjectAdmission.ps1` 与 `GitHubIndex.Core.psm1` | 单仓库 identity/worktree/sync/target/transport Provider | 形成“项目入场”和“工作树同步”模块 |
| `tools/Get-GitOwnerStatus.ps1`、`Get-ProjectCognitionSource.ps1` | 全量仓库身份、Owner baseline、分页 inventory 与 compact status | 形成“仓库总账”模块 |
| `GitHubIndex.PrivateNavigation.psm1` | ignored 私有导航 v2 与 Owner baseline store v3 | 说明公开/私有双层结构和 current/previous 历史 |
| `config/git-artifact-governance.json` | exact ref owner、frozen history、necessary retention schema | 只说明机制，不公开具体 PRIVATE 条目 |
| `git.project-admission`、`git.worktree-sync`、`git.push-publication`、`git.refresh-consistency` | 稳定机制和失败语义 | 决定入场、同步、发布和快照模块的边界、流程与恢复 |
| `05_规则与模板/推送放行与否决规则.md` | transport/publication/authorization 唯一完整矩阵 | 形成“公开发布”模块，不复制第二份规则 |
| `docs/contracts/git.protected-major-actions.md` 与 `tools/Invoke-ProtectedGitHubMajorAction.ps1` | 删除、转移、改名、可见性、默认分支和远端替换等重大动作 | 形成“重大变更保护”模块；提交 6afc858 已修复旧因子语义，但安装与真实 E2E 仍分层显示为未验 |
| `00_总览/current-generation.json` 与 refresh/consistency 工具 | 原子 generation、兼容投影、current+previous 与中断恢复 | 形成“快照与恢复”模块 |
| 当前 Git log 与定向 tests | 演化阶段、实现是否有回归保护 | 同日相关 commits 合并成产品阶段，不做 commit 流水账 |

## 为什么是六个模块

模块数量来自 GitHub 总索引真实职责，不沿用 `.agents` 的六模块形状。

| 模块 | 回答的问题 | 独立存在的理由 |
|---|---|---|
| 仓库总账 | 我有哪些仓库，身份集合是否与 GitHub 现场一致？ | 全量 identity、PUBLIC/PRIVATE 隔离和 Owner baseline 是集合级问题 |
| 项目入场 | 这个精确目录、远端、visibility 和 target 是否可信？ | 单仓库现场新鲜度与 target scope 有独立 v1 Provider |
| 工作树同步 | 所有 worktree/branch 是否真的进入远端默认分支？ | upstream 0/0、dirty 和 default-branch integration 是不同证据层 |
| 公开发布 | 能 push 是否等于内容可公开并已授权？ | transport、publication、authorization 必须独立失败关闭 |
| 重大变更保护 | 删除、转移、改名、公开性、默认分支或远端替换怎样避免误操作？ | 当前语义来自 verified current E release；Git Owner 6afc858 源码基线使用同一四类因子/step_up 边界，但 consumer 安装与真实 E2E 不能由旧源码测试推出 |
| 快照与恢复 | 总账变化如何原子刷新，失败后怎样保住完整旧代？ | generation、projection、pointer、retention 和 consistency 有独立生命周期 |

里程碑记录没有单独做模块：它只是有界 Owner 来源和人工记录 helper，不是每次 push 的事件流，也不是本项目的核心用户路径。工作树必要保留也没有拆成独立模块，因为它直接服务默认分支收敛和删除前恢复判断。

## 数据导出合同

`app/content-github-index.js` 导出：

```js
export const githubIndexProject = { /* 项目总览 */ };
export const githubIndexModules = [ /* 六个项目自有模块 */ ];
```

`githubIndexProject` 继承现有 `content-core.js` 的主要项目字段，并增加三个当前项目确实需要的字段：

- `why`：为什么需要这套总账；
- `result`：最终用户得到什么；
- `readerStates`：正常、发现问题和证据不足时分别怎样处理；
- `currentState`：有日期的现场事实与真实缺口。

每个 module 保持现有页面可消费的字段：

`slug`、`shortTitle`、`title`、`teaser`、`status`、`statusTone`、`value`、`why`、`example`、`result`、`readerStates`、`decisionImpact`、`problem`、`implementation`、`flow`、`concepts`、`boundaries`、`failures`、`sources`、`verification`、`relation`。

渲染顺序固定为 `value → why → example → result → readerStates`；只有三态说明完成后才进入 `decisionImpact` 和技术层。`statusTone` 使用 `pass / problem / unknown / mixed`，页面不得从中文状态关键词猜颜色。

`site-content.js` 现在从 `config/panel-projects.json` 读取启用状态并校验内容包；GitHub 总索引已按 `order=3` 进入 `/projects/github-index` 与六模块路由。Registry 仍是顺序和启用状态的唯一来源。

## 专业详细说人话

每个模块按同一读者顺序展开，但不套固定字数：

1. 它实际为 Owner 做什么；
2. 防止什么具体事故；
3. 一个普通请求的真实例子；
4. 最终拿到什么；
5. 通过、发现问题或无法运行时会改变什么决定；
6. 然后才进入 schema、Provider、refs、hash、generation 和回归细节。

英文术语第一次出现使用 `English（中文含义）` 或紧邻解释。模块自己的 `concepts` 再解释该页会反复使用的术语，不能要求读者先去总览 glossary（术语表）猜。

## 公开安全边界

- 允许公开：项目作用、公开仓库示例、schema 名、工具相对/已公开路径、状态枚举、聚合计数、generation 语义、测试范围和失败代码。
- 不公开：PRIVATE 仓库 identity、精确 private clone path、registry 内部条目、凭据值、原始日志/数据库/聊天/健康资料、机器快照和恢复 secret。
- `currentState` 可以公开安全聚合：现场 45 个仓库（26 PUBLIC、19 PRIVATE），旧快照 44/26/18，差异为新增 1 个 PRIVATE 身份；不披露该仓库名称。
- 公开页面明确区分 `PUBLIC`、`PRIVATE` 和目标授权；PRIVATE 保真不等于可以复制到公开页面。
- wly0829.cn 只用自己的公开仓库作实例，不把其他项目正文或私有路径带进页面。

## 当前事实与真实缺口

2026-08-29 现场状态：

- GitHub 总索引：PUBLIC/main，本地 main 与 origin/main 0/0；有 5 个并发修改文件，无 public-exposure path conflict。
- wly0829.cn：PUBLIC/main，本地 main 与 origin/main 0/0；有并发未提交修改，无 public-exposure path conflict。
- Git Owner Provider：`execution_status=completed`、`domain_status=review_needed`、identity delta=1、issue=0、history continuous、registry valid。
- 重大动作 Owner 源码：提交 `6afc858d418714664a757a4950f65de8a9d3578d` 已改为 Passkey（通行密钥）/TOTP（动态验证码）/Recovery（恢复码）/Account（账号验证）四类因子，Google/Microsoft 只作 Account provider（账号验证提供方），`human_required`（需要人类验证）只由最高权限 `step_up`（补充人类验证）决定；聚焦回归、公开门和远端 main 回读通过。未执行安装、策略发布或真实 broker/人类因子 E2E，因此模块保持 mixed（混合证据），而不是全绿。
- 公开 pointer：观察时间为 2026-08-25，`authoritative=false`、`decision_authority=false`，只对该 generation 的完整性负责。
- 只读 consistency check：比较 8 份公开文档，stable drift=8、volatile drift=0、退出码 1；临时生成目录已自动清理。
- GitHub 总索引当前工作副本中还有未提交的里程碑 Provider 候选；定向 Owner 测试通过，但没有 commit、push、远端 main read-back，因此本包没有把它列为已发布能力。

这些缺口不会阻止只读理解和本内容包创建，但会阻止“总账已完全 current”“八份公开投影仍是现场状态”“当前工作区可以直接发布”“候选功能已经上线”等结论。

## 本次验证

- `tests/Test-ProjectAdmission.ps1`：exit 0，最终输出 `All project admission tests passed.`。
- `tests/Test-GitOwnerStatus.ps1`：exit 0，最终输出 `Git owner provider tests passed.`。
- `tests/Test-ProjectCognitionSource.ps1`：exit 0，最终输出 `Project cognition source provider tests passed.`。
- `tools/Test-GitHubLocalIndexConsistency.ps1 -SkipFetch`：exit 1，准确报告 8/8 stable drift；这是当前事实缺口，不是用跳过或改期望值制造的绿灯。
- `app/content-github-index.js`：原生 ESM（JavaScript 模块）import 成功；项目必需字段、六个唯一 module slug（模块标识）及每模块完整字段校验通过。
- 两个新文件的 `git diff --no-index --check` 未报告空白错误；命令因“空文件对新文件”按预期返回差异码 1，并提示本机 Git 将来会按仓库设置把 LF（换行）转为 CRLF（Windows 换行）。两个源文件当前均为 UTF-8 无 BOM（字节顺序标记）。

当前本地 build 和合同测试已经覆盖本包、Registry 与可见路由；三项目浏览器/Owner 验收已经完成，但仍不构成 Pages（公网部署）验收，把本地接入通过称为网站上线会违反证据分层。

## 本地接入状态与后续验收

本地接入已经完成：

1. 项目 registry 已启用 GitHub 总索引，单项目内容门已由 Owner 解除；
2. 聚合内容层直接导入 `githubIndexProject` 与 `githubIndexModules`，没有复制第二份事实源；
3. 项目卡直接展示 Overview 和六个模块链接，不继承 `.agents` 模块；
4. 页面渲染 `why`、`result`、`readerStates` 与 `currentState`，真实缺口未被静默丢失；
5. 站点 contract、build、53 条直接路由和公开内容门已进入自动验证。

尚余步骤是 current E release / PCConfig / GitHub / ChineseASR 快照的最终浏览器 QA、commit、normal push、Pages deployment 与公网 read-back；未完成前仍不称公开交付。
