# PCConfig 项目内容与接入设计

## 文档角色

这是一份已进入本地看板的内容与接入说明；三项目版已完成用户验收，当前只新增 ChineseASR。本文不是公网发布回执。

- app/content-pcconfig.js 导出 pcconfigProject 与 pcconfigModules。
- 内容对象已经进入项目 Registry（结构化登记表）、可见路由、通用项目页面和合同测试；验证字段闭包、六个模块、readerStates、statusTone 与项目隔离。
- PCConfig 所在三项目版已经完成本地 Owner 预览；当前整站仍未提交、发布和公网回读，本地页面存在不等于线上已经更新。
- 页面目标是吴乐阳自己的真实看板，不是简历、营销页或代码仓库浏览器。

## 第一页必须让人听懂什么

第一次看到 PCConfig 的人，应当先能复述下面四件事：

1. 它是这台电脑的配置地图和恢复中心，负责路径、磁盘、端口、运行时、启动、计划任务、备份与恢复事实。
2. 没有它时，最常见的问题不是“文件完全没了”，而是重装、迁移或升级后，路径、任务、服务、凭据入口和应用状态接不回来。
3. 一个现实场景是“重装 Windows（微软操作系统）后恢复开发环境和计划任务”：它按恢复顺序逐层执行，并把需要重新登录、已证明通过和仍无法证明的部分分开。
4. 最终产物不是一句“装好了”，而是可回读的分层结果、明确缺口和失败后的回滚/恢复入口。

技术字段、命令、schema（数据结构合同）、哈希和模块关系只能出现在这层解释之后。

## Owner 与公开边界

PCConfig（电脑配置与恢复中心）只拥有机器事实和机器侧恢复：

- E:\PCConfig：本机路径、磁盘、端口、运行时、任务、启动、备份、迁移、恢复和受保护机器动作。
- 具体项目：业务语义、源码、启动方式和项目验收。
- Git（版本控制）控制面：仓库身份、可见性、远端、默认分支、同步和发布。
- 规则控制面：跨项目智能体行为、能力路由和活动规则正文。

源仓库经 GitHub（代码托管平台）现场回读为 PRIVATE（私有），默认分支为 main。公开页可以说明真实架构、入口、状态、失败和证据，但不得包含：

- 密码、令牌、私钥、恢复码、客户端密钥或可离线验证秘密的派生值；
- 账号身份、完整环境文件、浏览器登录态、Cookie、聊天数据库、私人正文或原始日志；
- 计划任务完整 XML、敏感 Action、arguments（参数）或截图；
- 可以公开会影响判断的有界、无秘密源码候选摘要，但必须明确标为“未提交、未安装、仍可能变化”；不能把候选描述成正式安装或现役结果。

## 2026-08-29 现场基线

内容不是从旧报告复制，而是从现行规则、当前 Git 状态、Registry、Provider（现场读取器）、安装态公开状态与测试入口重建。

| 证据面 | 当前事实 | 不能推出 |
|---|---|---|
| 仓库 | wlyaaaaa/PCConfig 为私有仓库，默认分支 main；主检出 clean，HEAD 与 origin/main 同为 7776fb3、0/0 | 主检出干净等于所有机器运行与恢复验收通过 |
| Registry | 当前 42 份 JSON（结构化数据格式）Registry；项目配置 157 键；目录和路径 Owner 各 57 项；项目路径依赖汇总 13 个项目；任务投影 91 项；任务用途/重建计划 52 项 | 所有值仍是 live current（现场当前） |
| 稳定机器投影 | 当前版本 5，最后生成于 2026-08-16 | 2026-08-29 现场硬件与运行时完全没有变化 |
| 开发存储 | Get-DevStorageHealth 当前 5 pass、0 warn、0 block | 所有 V/Z 消费者业务都已验收 |
| 启动项 | live provider 当前 20 项：19 enabled、1 disabled；相对快照新增 3 项，归类 informational only（仅供参考） | 新增项是故障或必须关闭 |
| 任务全量可见性 | Test-PCConfigDrift 当前 5 pass、2 warn、0 block；Registry 85 项，Medium 权限观察 81 项，另外 4 项为 partial visibility/unknown | 这 4 项已经删除、应该恢复，或 Registry 应覆盖成 81 项 |
| 任务健康 | 27 个核心任务中有 3 个非零 LastTaskResult，2 个属于 Scheduler 状态；P0 结果 4 已由在线恢复回执分类为 historical_failure_recovered_online。第 68 版 normal/LKG/trusted control 可用，但下一次自然 boot deadline 仍待验 | 在线恢复等于自然重启 deadline 已通过 |
| CoreRecovery（核心恢复） | Inspect 当前 ready、0 warning、不枚举文件名或正文；定向 area（验收区域）3/3 pass | 整机治理或每个应用恢复都已全绿 |
| Secret Broker（秘密代理） | status pass、0 critical failure、1 optional gap，回执明确零明文 | 每个外部网站和账号本次都可用 |
| Google Workspace Provider（谷歌办公服务读取器） | binding（绑定）configured、凭据状态文件存在；检查为 zero-network（零网络）且未解密；只有 Gmail、Drive、Calendar 经同一 Provider 的真实读取验收全通过后，读取才成为默认能力 | OAuth（账号授权协议）、远端身份或某个真实动作已验收 |
| C 盘 protected-policy | E 盘 PCConfig 退役 Owner 返回 status=retired、production_activation=false；36 个依赖已分类、6 个退役任务缺席，历史 C tree/gen79/ledgers 保留。旧 C 历史入口当前返回 active_integrity_failure/global-shim-invalid；E rules 由 `.agents` current E release 独立拥有 | 把旧 C 入口错误当成当前 E 规则失败，或认为退役删除了 Secret Broker/BitLocker/P0 |
| P0 安全换挡 | v1 public status 为 normal/trusted、active=LKG（最后确认可用版本）、保留独立 rollback | boot task、三分钟 reboot（重启）时限或 v2 安装已通过 |
| Vault V2（第二代加密保险库） | Registry 为 protected-install source ready；生产状态只能来自 installer inspect/read-back | 保险库已正式安装、真实因子或 Carrier（恢复载体）已验收 |
| P5–P7 | fixture_replica_acceptance_only、正式数据 action 未授权、正式路径未触碰 | 正式数据迁移已经开始 |

这些当前事实会漂移。未来刷新时必须重新运行匹配 Provider，不能把本表当永久权威。

## 模块划分

模块按 PCConfig 的真实业务分成六个，不照搬其他项目的信息架构。

| 模块 | 用户先看到的价值 | 技术责任 | 关键缺口 |
|---|---|---|---|
| 机器事实 | 找到配置、依赖和安全变更入口 | Registry、稳定投影、项目配置快照、端口、路径、V/Z 健康 | 静态投影有观察时间，不能冒充 live |
| 运行与启动 | 判断工具、启动项和任务是否真的在运行 | runtime（运行时）、受管软件、环境元数据、startup（登录启动）、Task Scheduler（计划任务服务） | 当前 2 个 attention：4 项任务可见性 unknown；P0 下一次自然 boot deadline 未验 |
| 恢复与备份 | 重装/换机后按顺序重建并可回退 | CoreRecovery、Hot/Cold、迁移门禁、任务重建、验收 | maintenance inspect ready、tasks_inspect pass 和 area 3/3 只证明 CoreRecovery；全局任务可见性和 P0 boot SLO 仍独立保留 |
| 秘密与 Provider | 完成登录和云端动作但不返回明文 | SecretRef（秘密引用）、DPAPI（Windows 数据保护接口）、类型化 Workspace actions | binding configured 不等于 live OAuth |
| 受保护动作 | 看清旧 policy runtime 退役与独立产品保留 | retirement Registry、状态入口、任务/worker 缺席、历史 CoreGoal override、机器 read-back | 物理 C tree/CoreGoal 未卸载；不得恢复旧生产读者 |
| 受保护数据 | 新版本失败可回旧版，一份 Carrier 加一个因子可隔离恢复 | P0 selector（版本选择器）、因子、加密保险库、Carrier、P5–P7 | boot task fail；v2/Vault/P5–P7 尚未完成正式证据 |

## 为什么是六个模块

- 机器事实与运行启动不能合并：路径/端口正确不证明任务或服务正在工作。
- 普通 CoreRecovery 与受保护数据恢复不能合并：前者允许选择性恢复普通日常环境，后者要求密文 Carrier 加有效因子，并有严格阶段顺序。
- Secret Broker 与受保护动作不能合并：前者拥有秘密存储、盲用和人类因子；后者只消费已登记因子结果，拥有目标和单步 effect（现实效果）协调。
- Authority/CoreGoal 与 Vault 不能合并：目标授权不执行保险库业务，Vault 也不能自行扩大授权。
- 漂移/验收不单列模块，因为它横穿六个业务面；项目总览和每个模块都必须说明“证明什么、不能证明什么”。

## 内容对象合同

### pcconfigProject

字段与现有项目内容对象保持一致：

- order、slug、title、route、visibility、repositoryNote
- summary、why、plainExample、result、readerStates（正常 / 问题 / 证据不足三态）
- responsibilities、exclusions
- glossary、operatingFlow、components
- usageExamples、evidenceLayers
- evolution、operationalEntrypoints
- currentState（带观察日期的现场事实与真实缺口）

当前 Registry 已启用 `order=2`，PCConfig 固定排在 `.agents` 之后、GitHub 总索引之前。

### pcconfigModules

每个模块保持完全相同的字段闭包：

- 导航：slug、shortTitle、title、teaser、status、statusTone（pass / problem / unknown / mixed）
- 第一读者层：value、why、example、result、readerStates（正常 / 问题 / 证据不足三态）
- 决策层：decisionImpact、problem
- 技术层：implementation、flow、concepts
- 安全与失败：boundaries、failures
- 事实依据：sources、verification
- 跨模块关系：relation

模块自己的 concepts 会重新解释本模块术语；不能依赖项目总 glossary（术语表）替首次读者补课。
渲染顺序固定为 value → why → example → result → readerStates；decisionImpact 和技术层只能放在三态之后。

## 状态表达规则

页面不得只写“已完成”或“已落地”。每个状态必须说明当前证据面：

- source ready：源码、Registry 和静态验证具备；
- test pass：指定 fixture 或回归通过；
- installed：固定安装根、权限和入口已正式 read-back；
- runtime pass：任务、服务或 Provider 本次现场运行；
- recovery pass：精确恢复对象在隔离路径或真实目标完成校验；
- reboot pass：自然重启后的任务、selector 和时间边界成立；
- user accepted：用户现实问题得到可用结果。

unknown 不是失败的委婉说法，也不是通过；它只表示当前证据不足。block 必须说明阻断哪一类决定，不把一个模块的问题扩大成“整台电脑已损坏”。

## 演化时间线规则

PCConfig 当前有大量细粒度提交，公开时间线不逐条罗列。内容对象把同一天或同一连续产品阶段的相关提交合并为一个 milestone（阶段成果）：

1. 机器事实与恢复基础；
2. 资源、存储、受管软件和端口门禁；
3. 秘密、备份、启动与核心恢复；
4. 受保护重大动作和配置 Provider；
5. 跨主机恢复与运行态加固；
6. P0/P1 和受保护数据连续性；
7. CoreGoal V2、Workspace 与 P3/P4；
8. vNext 收敛、日常保险库体验与 P5–P7 设计；
9. 远端默认分支的残留步骤恢复语义、发布器有界诊断和浏览器人类因子幂等交付。

最后一阶段明确说明主检出已同步且干净，但其他 worktree/分支仍独立保留，防止远端 commit（提交）、其他施工 source 和安装态混代。

## 真实入口选择

总览只展示 read/inspect/status（读取、比较、状态）入口：

- drift（漂移）；
- stable projection（稳定投影）；
- runtime；
- V/Z 存储健康；
- 固定端口预检；
- 受管软件目录；
- startup inspect；
- CoreRecovery inspect；
- Secret Broker status；
- Workspace binding；
- Authority status；
- 按 area 验收。

不在总览提供 Execute、Publish、Apply、Update、Restore、Delete 或 Reveal 等现实写入命令，避免把参考页面误作授权面。模块正文仍解释这些写入的正式 Owner、preimage（变更前像）、回滚和 read-back 语义。

## 本地接入与发布验收

本地接入已经完成内容、Registry 与路由层；发布前仍至少要完成：

1. JavaScript（网页内容代码）import（导入）成功，两个 export（导出）存在。
2. 项目对象字段齐全，六个模块 slug 唯一且字段闭包一致。
3. 公开内容扫描不出现凭据值、账号身份、私密正文、完整任务参数或禁止的品牌身份词。
4. 项目索引、Overview（总览）和六个模块 route（路由）在桌面与移动端可达。
5. 抽样让第一次阅读者复述用途、没有它的风险、现实例子、最终结果和失败行为。
6. 浏览器预览达到 Owner checkpoint（用户预览检查点）后暂停，不能把内部 schema 检查当用户验收。
7. Registry、路由和测试已经在本地更新；current E release / PCConfig / GitHub / ChineseASR 一致性与 Pages 公网 read-back 仍须在本轮完成。

## 仍需未来刷新或确认的事实

- 任务 Registry 的 85 项与 Medium 观察到的 81 项不能直接当成配置漂移：另外 4 项只有 elevated 完整可见性才能判断。Registry 不自动覆盖成 81 项。
- P0 boot task 结果 4 必须按时间线分开解释：较早启动曾 196468 ms 超过 180000 ms；最新自然启动是第 66 版只读恢复、57656 ms、`deadline_met=false`；在线恢复随后恢复第 68 版 normal/LKG，但按合同不改写历史回执。唯一解除条件是以后一次自然或用户授权重启由同一 AtStartup SYSTEM task 全新返回 0，并产生 `deadline_met=true` 的 normal/LKG 回读。
- Workspace binding 的远端 OAuth、账号身份和具体动作可用性，本次只做了零网络状态检查；Gmail、Drive、Calendar 的同 Provider 真实读取验收并未由本包证明。
- P0 v2 RecoveryKernel、Vault V2 protected install 与 P5–P7 正式数据动作当前没有完成证据。
- P0 source Inspector 当前因旧安装 manifest 与新 source Registry 合同不同而 BLOCK；它不等于 selector 损坏或数据丢失，也不授权自动重装。

这些缺口应保留在真实看板中，不能为了页面整洁删除。
