# System 首页内容源包

本文件是 `/` System 首页的产品与关系事实源，不是第二套动态状态数据库，也不是页面施工说明。
项目、规则和 Skills 的完整技术正文仍由各自内容文件拥有；System 首页只提炼跨项目关系与入口。

观察基线：2026-08-31。活动规则为 E95；项目与能力状态按下文各自的观察时间和证据层解释。

## 一句话产品定义

把通用 AI 变成长期可用的个人协作系统。

通用 AI 与智能体提供自然语言理解、推理、搜索、视觉和文档理解、工具与代码执行、浏览器操作以及并行协作。这些是已经接入的外部生产力，不冒充为个人开发。个人系统真正创造的价值，是用项目、E 规则、Skills、个人资料入口、机器现场、执行工具、分层验证和恢复路径，把这些通用能力组织成一套知道听谁的、能找到真实依据、能完成现实工作、能证明结果、失败后还能继续的协作方式。

## System 首页必须说清的边界

- System 保持平台与厂商中立，不出现具体模型名称，也不使用专用运行外壳概念解释整站归属。
- 单个项目仍直说真实产品名；项目技术页继续保留准确模型、版本、路径、端口、组件和失败证据。
- “已接入能力”不等于“个人原创”。只有来源能证明时才写“个人维护的项目/入口”；第三方能力、组件和素材分别写“已集成”或 Unknown（证据不足）。
- System 不证明服务此刻在线，也不把源码、测试、安装、运行、发布和 E2E 互相替代。
- 个人数据逐值判断；普通非敏感个人和技术事实不因来自本人而隐藏，真实 L3+ 值和可复用凭据继续走对应边界。

## 全部项目能力版图基线

2026-08-31 现场项目总账闭合为 47 个 GitHub 仓库：27 PUBLIC、20 PRIVATE，44 个有经 origin 核对的本地 clone，3 个仅远端；本次 identity 指纹为 sha256:a6f2f51b305dc975d21bc22ecc291e6f6553ac532672cb62a637007da85d98a5。数字只代表本次观察，不是永久常量。

当前 10 个项目是已经补齐完整产品说明和详情路由的入口，不是系统分母。全部仓库按现实作用进入八个稳定系统域：AI 协作与能力运行；电脑、服务与跨设备；材料、微信与原件；文档、媒体与专项制作；个人事务与长期协作；项目资产、研究与交付；凭据、备份与恢复；历史与迁移参考。

系统域允许一个项目参与多条关系，但完整资产表只给每个仓库一个主要归属，保证 47 项不重不漏。没有独立详情页的项目继续由 GitHub 总索引承载，不生成占位页；PRIVATE 项目在首页只写公开安全的产品角色。合同与私人事务类能力可以描述为合同、正式材料和文书协作，不主动突出案件或起诉，也不公开私人事实、证据和个人结果。

PersonalKnowledgeBase、PersonalOS-Retired、HealthLongevity 和 WeChatDirect-private-archive 当前只提供历史与迁移参考，不承担运行职责。出现在项目总账也不代表正在运行；源码、安装、运行、发布和现实验收仍分别判断。

## 从一句话到现实结果

1. 用户说目标、优先级和不能越过的边界。
2. 通用 AI 理解问题、推理并决定是否搜索、看图/文档、使用浏览器、执行工具/代码或并行调查。
3. E 规则确定指令优先级、事实 Owner、授权、施工范围、注意力和验证方式。
4. 项目与 Skill 把自然请求路由到真实业务、资料、机器或外部服务入口。
5. 工具在真实目标上执行；不确定、失败或缺能力只影响对应步骤。
6. source、test、install、runtime、publish、fresh task、E2E 和用户验收分别回读。
7. 用户拿到现实结果、明确 Unknown、恢复入口和是否还需要本人决定。

## 10 个已完整介绍的代表项目在系统中的位置

| 项目 | 归属与产品角色 | 普通请求与系统价值 | 当前证据与不能证明 | 入口 |
| --- | --- | --- | --- | --- |
| `.agents` | 吴乐阳个人维护的规则与能力控制面；不开发底层 AI | “把这个目标办成，别覆盖其他任务。”它让 AI 找对事实 Owner、复用已有授权、选择能力、协调并行并分层验收 | E95 `d32210b`、五规则闭包与 Skill 供应通过；不证明每项能力当前 E2E。Codex Home 的 E 盘规则目标与机器仍由 C 盘普通目录承载的现场必须并列 | `/projects/agents/`、`/rules/`、`/skills/` |
| PCConfig | 吴乐阳个人维护的 Windows 配置与恢复控制面 | “为什么任务没启动”“迁移到 V 盘”“重装后怎样恢复”。它把通用工具能力接到这台机器的路径、运行时、任务、备份和回滚 | PRIVATE main `f9245a1` 与 origin/main 对齐且工作树干净；完整可见 Drift 为 Registry 87 / Windows 88、2 新增/1 移除；BIOS 核心记录已验证。Codex Home 在线 ReadyCheck 已放行但仍等待用户自行退出：当前仍由 C 盘普通目录承载，E 正式目录和 CODEX_HOME 尚未生效 | `/projects/pcconfig/` |
| GitHub 总索引 | 吴乐阳公开维护的 Git/GitHub 事实控制面 | “这个目录会推到哪里”“worktree 能删吗”“是否真正进入远端主分支”。它补上多仓库身份、所有工作树与公开发布边界 | PUBLIC main `e6bf84b`；live 47 个仓库（27 PUBLIC / 20 PRIVATE）、44 个 clone，baseline 47/47、delta 0、issue 0、历史过渡提醒 1。公开 generation 仍是 45/43 的旧快照 | `/projects/github-index/`、`/skills/project-entry-gate/` |
| ChineseASR | 吴乐阳个人维护并集成外部识别运行时的公开中文语音项目 | “转写这段录音”“中断后继续”“哪些句段可能是我”。它把语言理解接到稳定 job、结果包、风险、可选时间线和人工复核 | PUBLIC main `70e3255`，345/345 单元测试通过；历史真实四切片 E2E 可回读。默认 strict 不保证完整逐句时间线，时间线/说话人需显式路线；本轮未跑真实模型 | `/projects/chinese-asr/`、`/skills/chinese-asr/` |
| TimeAudit | 吴乐阳个人维护并集成第三方探针/数据库/大盘的公开工作站黑匣子 | “过去一小时为什么卡”“是否断采”。AI先取得最长 168 小时聚合摘要；具体程序和闪退明细再进本机 Grafana 深读 | PUBLIC main `44a842e`，180 项 + 11 子测试通过；一小时 provider 3702 样本、coverage fresh。无有效游戏帧、无整库审计/最新恢复；上游手册仍有过强因果措辞 | `/projects/timeaudit/`、`/skills/timeaudit-diagnostics/` |
| PC Panel Hub | 吴乐阳个人维护的 MIT 双副屏源码；厂商二进制与壁纸素材不属于该许可 | “机箱屏冻了吗”“HS2 卡片会不会塞满”。TURZX 是 480×1920 USB 串口位图屏；HS2 是 2288×1048 Windows 副显示器上的透明事件层 | PUBLIC main `ebbc1f2`；84 指标 + 8 天气及项目原生检查通过。HS2 浮层当前 visible=1/misplaced=0；动态壁纸仅有 2026-08-30 本人确认，TURZX 实体像素/睡眠恢复未复验。市场壁纸作者/再发布许可 Unknown | `/projects/pc-panel-hub/` |
| CACB | 个人维护的 PRIVATE 可复现智能体评测产品；通用 AI 是被检验能力 | “给一种执行方式做可复现验收”。它冻结任务、隔离工作区、绑定实际任务身份、验证产物并区分能力/任务/环境/证据问题 | PRIVATE main `59b0b5c`；最新四个 CI job 在 lint 门失败，当前提交没有绿色验证。历史 focused/full 结果不继承，方法与评估有效性仍需复核；不公开受测配置结果 | `/projects/cacb/` |
| 用 AI 把一件事学明白 | 个人维护的文档化协作方法，不是应用或自研智能 | “先查权威资料，写成完整可读材料；我反馈后再重查。”AI负责研究和判断，人控制方向；一次只推进一个单元，没有反馈就停 | PRIVATE 文档项目；无应用代码、运行服务或自动化测试。方法合同真实存在，但不证明学习效果、主题、进度或普遍有效性 | `/projects/learning/` |
| Codex Remote | 吴乐阳个人开发和维护的非官方公开配套工具，无厂商隶属或背书 | “离开电脑后在手机继续同一个桌面任务”。它把外部智能体运行时的任务、工具、审批、文件和队列带到移动端，不另造聊天 | 正式 v0.1.5 / `c3a07719` 有 1771 项与历史真实多端证据；current main `94f1cfa` / `0.1.6-unreleased.0` 最新 CI failure。本轮不调用运行时，不代表当前在线 | `/projects/codex-remote/` |
| 个人健康证据与安全决策 | 个人维护的 PRIVATE 健康证据产品；通用 AI 负责研究与解释，项目负责证据链与人工采用边界 | 现有材料能回答就不重读原件；明确刷新设备时，前台导入、原始保全、离线验真、三态简报和 Health Owner 采用分开。产品原则要求 AI 站在用户利益一边但不迎合，并允许质疑医生、机构、设备和 AI | PRIVATE main `48d5a5b`，112/112 合成测试通过；不证明当前账号、设备、个人健康事实、诊断、处方或医疗效果。广义健康选择是产品原则，不是代码已执行治疗决定 | `/projects/personal-health/`、`/skills/personal-health/` |

## 5 份活动规则在系统中的位置

| 规则 | 解决什么 | 普通结果 | 当前证据边界 |
| --- | --- | --- | --- |
| 全局根规则 | 决定听谁、事实归谁、怎样选方法，并防止上下文噪声淹没目标 | AI按目标与净收益工作，复杂度只为现实价值存在 | E95 新增注意力质量、可信本地闭集和必要实现盲测；规则 identity 不证明具体项目可用 |
| 重大动作与 E release | 把 dirty 源码、活动规则、回退和现实重大动作判断分开 | current/previous 两代规则可验证、可回退；UAC 不冒充用户授权 | E95 Inspect 证明五文件与 pointer；不自动证明所有 ACL、fresh/spawn 与实际重大动作 |
| 授权与执行 Owner | 处理外部现实动作、长期授权、任务施工范围、Git 收口与 PUBLIC 数据 | 已明确范围不重复索权；动作仍解析真实目标并回读 | Owner Registry 和目标 resolver 决定施工/目标；授权文本不证明 effect 已发生 |
| 三控制面 | 只在 Git、机器或规则事实会改变决定时取证 | 最小进入 `.agents`、GitHub 总索引、PCConfig 或具体项目 | 入口不运行所有动态 Provider，也不恢复历史第四控制面 |
| 能力路由 | 选择 Skill、工具、reader、Provider、并行与必要盲测 | 用最有净收益的现有能力；真实缺失才降级 | E95 增加安全不换复杂度、注意力编排和自然意图盲测；合同不证明账号/工具当前可用 |

## 26 个 Skills 在系统中的位置

| Skill | 自然请求 → 用户得到什么 | 接入价值与依赖 | 当前边界 |
| --- | --- | --- | --- |
| `personal-media` | “找去年在餐厅拍的照片” → 少量核对后的媒体原件或临时浏览目录 | 连接自然线索、当前 SQLite catalog 与 canonical 原件，不建第二索引 | 本轮未查私人 catalog，不证明具体线索有命中 |
| `personal-materials` | “忘了那份材料在哪” → 少量经路径/角色/hash 核对的非媒体原件 | locator 失效时重新发现，已有精确路径则不增加一层 | 本轮未发现或打开私人文件 |
| `wechat-direct` | “某人上次说了什么”“归档这个群” → 原生顺序、回复关系、媒体与具名归档 | 连接微信本地数据与中文 ASR，不全账号后台同步 | 本轮未读聊天、账号或媒体 |
| `google-workspace-direct` | “查邮件/Drive/日历” → 固定账号、固定 Provider 的窄结果 | 避免静默换账号/第二 Provider；原生文档走正确 export | 零网络 ValidateOnly ready；在线账号与真实返回本轮未验 |
| `chinese-asr` | “转写并给复核线索” → 正文、风险、可选时间线/说话人证据 | 连接具名音频、模型路由、GPU 与结果包 | 本轮只跑 345 单测，未处理录音 |
| `timeaudit-diagnostics` | “过去一小时为什么卡” → 覆盖、聚合信号、因果限制和下一步 | 连接 TimeAudit 有界 provider 与 Windows/PCConfig 现场 | 最新一小时 3702 样本、fresh；不返回具体进程或证明根因 |
| `localocr` | “读扫描 PDF/表格/公式” → 文本、版面、表格、坐标和 sidecar | 复杂扫描材料走本地 OCR；普通清晰图片仍直接视觉 | 上次小图 E2E 可保留，当前 18665 health 本轮不可达 |
| `personal-health` | “结合我的当前资料回答/刷新设备” → 分层健康证据与最小更新 | 连接 processed-current、权威医学信息和 Health Owner | 未读取个人健康正文，不证明任何当前事实 |
| `personal-litigation` | “根据合同和现有材料准备一份正式文书，并告诉我现在到哪一步” → 可编辑文书、事实/未知和现实状态分层 | 连接唯一现状来源、真实原件、Word/PDF 工具与私人事务边界 | 只说明合同与私人事务文书产品；不读取或公开具体私人事实，本轮未跑真实事务 E2E |
| `documents` | “创建或修订这份 Word 文书并逐页检查” → 可编辑 DOCX、修订/批注和版面验收 | 宿主集成能力保留 Word 结构，并以逐页渲染检查真实版面 | 本轮只核对 observed bundle source/bytes/SHA，未创建真实文档，Current/Fresh/E2E Unknown |
| `pdf` | “填写或生成这份 PDF，并核对表单字段和页面显示” → 最终 PDF、字段逻辑与逐页验收 | 宿主集成能力同时检查 PDF 结构、表单字段、控件、外观和页面 | 本轮只核对 observed bundle source/bytes/SHA，未处理真实 PDF，Current/Fresh/E2E Unknown |
| `md-to-pdf` | “按正式样式导出 PDF” → 与源 hash、页数和布局绑定的 PDF | 本地插件连接 Markdown、浏览器渲染和原子发布 | 本轮未生成实际 PDF |
| `pdf-render-safe` | “检查 PDF 裁切/空白/错位” → 逐页 PNG、总览图与指纹报告 | 先低成本全量看，再提高可疑页分辨率 | 本轮未渲染 PDF |
| `mojibake-doctor` | “这个文件乱码了” → 原字节诊断、预览和可逆修复计划 | 避免直接另存覆盖仍可恢复的原字节 | 本轮未 Apply 文件 |
| `file-intake-router` | “处理这个混合资料包” → 各类文件交给真正保留结构的 reader | 防止 Office/数字 PDF/数据库全部被错误 OCR | 自身只分流，真实结果取决于下游 reader |
| `media-person-self` | “这张图/这段录音是不是我” → 具名文件中的位置/时间段与不确定性 | 只处理点名媒体，语音复用 ChineseASR，不识别其他人 | 本轮未读模板或媒体，语音独立回归仍有缺口 |
| `local-secret-broker` | “让程序使用这个凭据” → metadata、SecretRef 或盲注入 | 连接 AI 执行和 Password Center，不把秘密放进聊天/argv | 本轮未 lookup、reveal 或 use |
| `authorization-file-broker` | “加密/验证/恢复这些文件” → 可验证 bundle 或无覆盖恢复结果 | 中断、篡改、源变化和同名冲突都有确定行为 | 本轮没有点名文件授权，未执行真实 E2E |
| `vault-workflow` | “更新并备份 Vault/Key” → Doctor/Plan/WhatIf、PRIVATE 发布与远端回读 | 密码留在本机人工输入，和 Password Center/文件加密三域分开 | 本轮未读 Vault、密码、keyfile 或敏感正文 |
| `project-entry-gate` | “这个仓库能改/能推吗” → 身份、可见性、分支/worktree 与继续/阻断证据 | GitHub 总索引提供真实 Git 事实；该 Skill 不产生推送授权 | 发布前必须重新取得 live metadata/refs |
| `personal-panel-refresh` | “来源发布后页面会不会说错” → 非实质不建任务，实质变化异步建/续一个网站任务 | 连接来源发布、Registry、material threshold 与现有 Pages 发布链 | E95 source/install 当前有效；真实 handoff 是历史证据，本轮未新派发 |
| `control-plane-doctor` | “三个控制面哪里漂移了” → 按 Owner 分开的 health/convergence | 快速定位应去哪个 Owner，Doctor 本身不修业务 | scope run 不证明三个控制面所有现场都健康 |
| `tailscale-safe-exposure` | “只让这个 peer 访问这个端口” → 最小配置、回滚和分层验收 | 连接具名设备、服务和 Tailscale CLI，不扩大到公网 | 没有本轮具名 peer E2E |
| `llm-backend-toolkit` | “把封闭可验任务交给额外后端” → job/result/receipt，由主任务复核 | 接入额外计算能力，不自动 fallback、不信后端自报 | live registry 可读 6 个后端；不证明具体 job E2E |
| `native-economy-routing` | 任务出现独立并行面 → 有界子代理或保持 0，root 继续集成 | 接入平台原生并行生产力，同时收窄 scope、授权与责任 | System 只写能力类别；具体技术标识留在规则/Skill 技术页 |
| `token-budget-advisor` | 用户明确问配额/reset/Token → 只读现场或权威计数 | 不因任务看起来长就制造预算门，也不拿字符猜计数 | 本轮没有明确配额请求，因此没有调用当前账号入口 |

## 首页关系图建议只保留的稳定主线

1. `通用 AI → .agents → 现行规则 → Skills`：外部智能先进入个人目标、授权、协作和领域边界。
2. `GitHub 总索引 → project-entry-gate → 全部项目`：先确认仓库身份与发布事实，再进入项目业务。
3. `PCConfig → TimeAudit → timeaudit-diagnostics`：机器事实、历史采集和有界诊断三层分开。
4. `微信入口 → ChineseASR 项目 → chinese-asr Skill`：消息与媒体关系、语音实现和本次任务模式分开。
5. `材料入口 → LocalOCR → 验证矩阵`：只有扫描件或复杂版面进入识别，文字继续绑定原件质量。
6. `健康材料 → personal-health 项目 → personal-health Skill → 人的决定`：已有材料、前台更新、离线验真和人工采用分开。
7. `PCConfig → 开发环境备份与恢复 → 验证矩阵`：恢复关系、不可再生材料和现实验收分开。
8. `全部项目 → 验证矩阵 → 用户验收`：项目证据不能互相升级，最终结果回到当前目标。

其余关系只有在真实跨项目协作会改变理解时才进入；项目数量增加不扩大这组稳定主线。

## 仍需 System Owner 在最终页面验证

- System 首页正文和 System 数据对象中没有具体模型名或专用运行外壳概念；项目技术页不受此删减。
- 通用 AI 底层生产力不是一句尾注，而是首屏产品定义的一部分。
- 页面没有把全部项目和 26 个 Skills 全部强行画成网络；搜索、能力版图与目录承载完整清单，关系图只保留稳定主线。
- 移动端没有大片空白、横向溢出或滚动跳顶；系统图在 320/390/768/1440 宽度可读。
- 本内容包一旦被 System 页面和项目内容完全吸收，应重新评估是否仍有独立消费者；若只剩重复说明，可由最终 Owner 在保留 Git 历史后删除。
