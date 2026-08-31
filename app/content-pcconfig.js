export const pcconfigProject = {
  order: 2,
  slug: "pcconfig",
  title: "PCConfig",
  route: "/projects/pcconfig",
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "机器配置与恢复可用；Codex Home 等待本人退出后切换",
  cardStatusTone: "pass",
  snapshotBoundary: "SafeSwitch manifest invalid 仍是后置缺口；Codex Home 等待本人退出后切换，切换后的新运行时与自然启动、新机恢复端到端验收仍需各自回读",
  repositoryNote: "源代码位于 PRIVATE（私有）GitHub（代码托管平台）仓库；本页完整公开产品思想、机器配置结构、普通技术事实、入口、失败和验证，只排除可复用凭据以及经活动全局分级确认需要保留的 L3+ 具体载荷。",
  summary: "PCConfig 是这台 Windows 电脑的配置地图和恢复中心。我可以直接问“为什么这个任务没启动”“把项目迁到 V 盘”或“重装后恢复开发环境”。它会先从现场确认路径、磁盘、运行时、启动任务和备份，再用可回退的方式处理。最后我会看到哪些已经恢复并能用、哪些需要重新登录、哪些证据还不足，以及从哪里继续或回滚。",
  why: "机器配置分散在文件、环境变量、计划任务、服务、安装目录和加密状态里。没有统一导航和恢复顺序时，重装或迁移后经常不是“文件丢了”，而是路径、任务、登录状态和程序引用互相接不上；直接整包覆盖又会把旧配置和故障一起带回来。",
  plainExample: "例如我说“重装 Windows（微软操作系统）后，把开发环境、计划任务和必要配置恢复回来”。PCConfig 会先确认磁盘与恢复来源，再按运行时、项目、启动链和私密配置分层恢复；每一层都从现场 Provider（现场读取器）取证。最后我得到的不是一句“软件装完了”，而是一份分层结果：哪些已恢复并回读、哪些需要重新登录、哪些仍是 unknown（证据不足），以及每个失败项的安全停止点。",
  result: "我最终会得到一份可执行、可回读的机器状态与恢复结果：当前配置真正在哪里、准备修改什么、变更前状态怎样保存、每一层是否通过、哪些只完成源码或安装、哪些仍需登录或自然重启，以及失败后从哪个检查点恢复。",
  readerStates: {
    pass: "需要的机器事实、配置责任源和恢复入口都能现场读取时，按依赖顺序执行，并分别回读文件、运行时、计划任务、账号入口和用户可见结果。",
    problem: "发现路径漂移、任务失败、版本不一致或恢复证据不完整时，只暂停受影响的一层，保留变更前状态并列出责任源、失败位置和下一步恢复入口。",
    unavailable: "磁盘、Provider（现场读取器）或受保护入口不可用时，把对应结论标为 Unknown（证据不足），不猜默认路径、不整包覆盖，也不把部分复制或安装称为整机恢复。"
  },
  cardMetrics: [
    { label: "配置地图", value: "15 项目 · 157 键" },
    { label: "恢复任务", value: "10 Ready · 0 失败" },
    { label: "秘密恢复", value: "10/10 三路一致" },
    { label: "Codex 迁移", value: "75.13 GB · 已就绪" }
  ],
  heroFacts: [
    { label: "配置地图", value: "PRIVATE main=f9245a1；44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项、87 个任务" },
    { label: "开发存储", value: "V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过" },
    { label: "恢复任务", value: "10 个核心恢复任务均为 Ready、最近结果 0；CoreRecovery 3/3 验收通过" },
    { label: "秘密恢复", value: "10/10 项在三条恢复路线一致；G 路 20 份、PRIVATE 路 65 份快照，跨度 33 天" },
    { label: "受保护数据", value: "P0 revision 68 为 normal、active=LKG、trusted=true；自然启动用时 46.984 秒，低于 180 秒门" },
    { label: "Codex Home 迁移", value: "39911 个文件、75.13 GB；最终差异 565 个文件 / 6.74 GiB，ReadyCheck 58 秒，预计离线窗口 4:37–7:56；已就绪并等待本人退出" }
  ],
  productPrinciples: [
    { title: "先读现场，再改变机器", detail: "登记表负责导航，不能冒充当前状态；真正要改什么，先由 Windows、安装根、任务或项目配置现场证明。" },
    { title: "项目仍拥有自己的配置", detail: "PCConfig 管机器路径、端口、任务、运行时和恢复关系，不把项目业务配置收走形成第二份真相。" },
    { title: "每次变更都能退回", detail: "目标、变更前状态、影响对象、回滚入口和完成后的现场回读必须成对存在。" },
    { title: "恢复按依赖分层进行", detail: "先恢复磁盘、网络和基础运行时，再恢复项目、任务、启动项和私密配置；不把整包覆盖当快捷方式。" },
    { title: "秘密可以被使用，但不必被看见", detail: "凭据通过引用和受保护调用完成任务，不进入聊天、终端、命令行或普通文件。" },
    { title: "每一层单独验收", detail: "源码、安装、运行、恢复、自然重启和用户可用分别回读，不能用文件存在或任务就绪代替真实结果。" },
    { title: "未知不是失败，也不是通过", detail: "不可读、不存在、执行失败和证据不足分别说明，只暂停受影响的一层。" },
    { title: "按需检查，不建设第二套操作系统", detail: "只在现实任务需要时读取机器事实，不新增全机后台扫描、自动更新或常驻治理层。" }
  ],
  responsibilities: [
    "维护本机路径、磁盘、目录用途、固定端口、运行时和本地数据源等机器事实",
    "维护 Registry（结构化登记表）、现场 Provider、稳定投影、漂移检查和验收入口",
    "维护 Windows 计划任务、启动项、受管软件、快捷方式和恢复顺序的机器配置",
    "维护迁移门禁、核心恢复、热备与冷备衔接、恢复介质和回滚边界",
    "提供 SecretRef（秘密引用标识）、固定账号 Provider 和零明文的秘密使用入口",
    "承载本机受保护重大动作、长期目标授权、版本换挡和受保护数据恢复的机器侧运行边界"
  ],
  exclusions: [
    "不拥有具体项目的业务语义、源码设计、启动方式和项目验收；这些继续由项目自己负责",
    "不拥有 Git（版本控制）仓库身份、可见性、远端、默认分支和发布事实；这些由 Git 控制面负责",
    "不拥有跨项目智能体行为、能力路由和活动规则正文；这些由规则控制面负责",
    "不把明文密码、令牌、私钥或恢复码写入 Registry、聊天、日志或普通文件；秘密值留在受保护存储中，并只按精确引用盲用或经用户明确验证后受控显示",
    "不把 Registry、测试、安装或任务存在单独包装成整机恢复完成",
    "不因为目录看起来不整齐就自动搬移，也不通过 watcher（后台监听器）或轮询持续扫描整台电脑"
  ],
  glossary: [
    { term: "PCConfig（电脑配置与恢复中心）", meaning: "这台电脑的机器事实索引、受控变更入口和恢复中心；它记录怎么找到、验证和恢复配置，不接管项目业务。" },
    { term: "Owner（责任源）", meaning: "对一类事实或动作拥有最终解释权的来源。PCConfig 只拥有机器事实，具体项目仍拥有业务含义。" },
    { term: "Registry（结构化登记表）", meaning: "保存稳定索引、恢复关系和安全元数据的 JSON（结构化数据格式）文件；它通常不是现场运行状态。" },
    { term: "Provider（现场读取器）", meaning: "从 Windows、安装根或真实服务读取当下状态的只读入口。" },
    { term: "Source of truth（真实配置源）", meaning: "某个配置真正生效的文件、任务、服务或运行时；PCConfig 快照只能引用它，不能反向取代它。" },
    { term: "Projection（稳定投影）", meaning: "从现场事实中筛出长期有意义、公开安全且可版本化的一层薄快照。" },
    { term: "Drift（漂移）", meaning: "登记事实与现场观察不一致；它可以是故障，也可以只是尚未刷新，必须看匹配检查的语义。" },
    { term: "Evidence status（证据状态）", meaning: "pass（已证明）、fail（已证明不满足）或 unknown（当前无法证明）；unknown 永远不能折算为通过。" },
    { term: "Read-back（正式回读）", meaning: "执行后再从真实 Owner 读取最终状态，而不是只相信命令退出码或旧回执。" },
    { term: "Preimage（变更前像）", meaning: "写入前保存并验证的原状态，用于失败后恢复到精确已知状态。" },
    { term: "CAS（比较后交换）", meaning: "只有当前 revision（修订号）仍等于预期值时才写入，避免并发覆盖。" },
    { term: "Task Scheduler（Windows 计划任务服务）", meaning: "计划任务是否存在、启用和最近怎样运行的现场权威；Registry 只保存恢复投影。" },
    { term: "Managed software（受管软件）", meaning: "已登记状态与更新 Adapter（适配器）的本机组件；未知组件不会被猜测或自动安装。" },
    { term: "SecretRef（秘密引用标识）", meaning: "让程序使用某个秘密但不把明文交给模型、终端或日志的稳定引用。" },
    { term: "DPAPI（Windows 数据保护接口）", meaning: "把本地敏感材料绑定到指定 Windows 身份的系统加密能力。" },
    { term: "Google Workspace Provider（谷歌办公服务读取器）", meaning: "把一个固定账号的邮件、云盘和日历能力收敛成类型化动作的本机入口。" },
    { term: "AuthorityHost（旧 C 盘规则权威服务）", meaning: "第 79 代旧链曾用于验证规则、签名、账本和执行 Adapter；该 C 盘规则链已经决定退役，不再作为新规则的当前权威。" },
    { term: "CoreGoal（长期目标授权）", meaning: "一次可靠人类确认冻结目标；同一目标下的现实步骤再使用短时、单次、不可重放的能力。" },
    { term: "LKG（最后确认可用版本）", meaning: "Last Known Good 的缩写；版本切换失败时可回到的最后一个已证明健康版本。" },
    { term: "Recovery Carrier（恢复载体）", meaning: "保存一份完整加密恢复集的已登记介质；只有载体或只有因子都不足以恢复原文。" },
    { term: "E2E（端到端验证）", meaning: "真实输入从用户入口经过完整链路，最终得到可见且可回读的结果。" }
  ],
  currentState: {
    observedAt: "2026-08-31T11:43:18Z",
    label: "机器配置、恢复任务与秘密恢复闭合；Codex Home 已就绪并等待本人退出切换",
    facts: [
      "源仓库 PRIVATE（私有）main 当前提交为 f9245a1；配置地图覆盖 44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项和 87 个任务。",
      "开发存储回读 V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过。",
      "10 个核心恢复任务均为 Ready、最近结果 0，CoreRecovery 3/3 验收通过；任务就绪和业务恢复结果仍按各自责任源分层。",
      "Secret 恢复 10/10 项在三条路线一致；G 路 20 份、PRIVATE 路 65 份快照，覆盖 33 天。公开回执不返回秘密原文。",
      "P0 current 为 revision 68、normal、active=LKG、trusted=true；最近自然启动用时 46.984 秒，低于 180 秒门。",
      "Codex Home 迁移覆盖 39911 个文件、75.13 GB；最终差异为 565 个文件 / 6.74 GiB，ReadyCheck 用时 58 秒，预计离线窗口 4:37–7:56。当前已就绪并等待本人退出后切换。",
      "Password Center 独立安装态为 current：9/9 文件与锚点一致，retired_c_policy_used=false。银行卡三字段可原子保存与盲填，但真实支付页提交始终由用户决定。"
    ],
    gaps: [
      "Google Password Manager 没有稳定逐条 API 或 changefeed；当前只支持官方完整导出快照，reconciliation 状态仍为 missing，不能称实时双向同步。",
      "银行卡桥已安装并通过结构回归，本次没有真实支付页面的用户可见 E2E；不能声称真实付款表单已经验收。",
      "PRIVATE Git 恢复路径已安装且状态就绪，本次没有执行干净新机恢复演练。",
      "最近一次 CoreRecovery 冷备因 H_unavailable 跳过，没有当前 Codex 对话 H closure；不能写成 H 冷备已完成。",
      "Codex Home 当前已就绪但仍等待本人退出；正式切换、新运行时回读和回滚副本退出条件尚未发生。",
      "SafeSwitch manifest 当前 invalid；P0 revision 68 的在线与自然启动证据不能替代该 manifest 缺口的后置修复和回读。",
      "Workspace 只完成零网络绑定检查，尚未证明远端 OAuth（账号授权）和具体动作本次可用。",
      "P0 v2 尚无安装根和自然重启证据，只能称源码候选。",
      "Vault V2 当前只到 protected_install_effect_source_ready（受保护安装动作源码已准备），没有 installer read-back（安装器回读），不能称已安装。",
      "P5–P7 仍是隔离样例；正式数据动作未授权，正式数据路径也没有被触碰。",
      "Recovery kit 的 BIOS/UEFI 核心设置记录已成为 present_verified，覆盖照片保留的 CPU、内存、启动和 PCIe 基线；它不等于每个菜单的完整原生 Profile，也没有替代下一次启动后的现场回读。WEPE 隐藏分区仍只有 present_observed。"
    ]
  },
  operatingFlow: [
    { title: "先确认问题属于机器层", detail: "只有当前决定依赖本机路径、端口、运行时、任务、启动、备份或恢复事实时才进入 PCConfig；项目业务问题继续回到项目本身。" },
    { title: "定位唯一 Owner 和真实配置源", detail: "用最小 Registry 找到对应文件、任务、服务或 Provider；旧报告和人类指南只负责导航。" },
    { title: "现场观察并分离证据状态", detail: "读取 Provider、Windows 现场和安装根，把明确不匹配写成 fail，把无法读取写成 unknown，不用缓存补齐。" },
    { title: "先生成有回滚的变更计划", detail: "路径迁移、任务注册、软件更新或受保护动作先固定 target、preimage、依赖、回滚和验证命令；高风险写入走正式授权入口。" },
    { title: "由真实 Owner 执行", detail: "项目配置先由项目改，软件由组件 Adapter 更新，任务由注册事务变更，秘密只通过盲填或盲注入使用。" },
    { title: "逐层 Read-back", detail: "分别核对源码、测试、安装、任务或服务运行、恢复可用性、重启结果和用户可见结果；上一层成功不能替下一层。" },
    { title: "保留缺口并给出恢复入口", detail: "通过就说明证据范围；发现问题就保留原状或回滚；无法运行就给出精确 unknown、影响和下一次取证入口。" }
  ],
  components: [
    { name: "机器事实 Registry", responsibility: "登记磁盘、路径、配置键、任务、运行时、启动、恢复和受保护产品的稳定结构。", implementation: "当前仓库有 44 份 Registry；动态值仍由匹配 Provider 或 Windows 现场裁定。" },
    { name: "现场 Provider", responsibility: "以闭合 schema（数据结构合同）读取运行时、磁盘、启动项、端口、任务和安装态。", implementation: "主要使用 PowerShell（Windows 自动化终端）入口，输出有界 JSON，不返回秘密值或原始任务参数。" },
    { name: "稳定机器投影", responsibility: "保存长期有意义的硬件、系统、磁盘与关键运行时薄快照。", implementation: "规范 SHA-256（文件指纹）、版本链、原子替换和 no-change（无变化不重写）语义；当前 Registry 为版本 5。" },
    { name: "项目配置快照", responsibility: "为路径、端口、模型和本地数据源提供跨项目导航。", implementation: "157 个登记键使用 inspect、期望哈希、dry-run（只预演）、apply（正式应用）和 mark-stale（标记陈旧）事务。" },
    { name: "任务与启动链", responsibility: "维护计划任务恢复投影、用途目录、启动快照和无窗口父进程合同。", implementation: "Task Scheduler 是运行权威；任务 XML、原始 Action 和敏感参数不进入公开回执。" },
    { name: "受管软件路由", responsibility: "把组件别名解析到自己的状态与更新 Adapter。", implementation: "当前目录登记 11 个组件；behind 才更新，equal 不重装，ahead 不降级，unknown 直接停止。" },
    { name: "CoreRecovery（核心恢复）", responsibility: "组织重装或换机时的恢复顺序、热备/冷备衔接、任务重建和选择性验收。", implementation: "Inspect 零正文读取；Hot 原子发布小型上下文；Cold 只消费已验证 Hot，不用镜像删除。" },
    { name: "Secret Broker（秘密代理）", responsibility: "集中管理秘密的发现、盲用、恢复集和设备信任，不把明文交给调用者。", implementation: "运行库在仓库外加密保存；公开 Registry 只保存 SecretRef、策略和无秘密入口。" },
    { name: "Password Center（密码中心）", responsibility: "让用户查找、查看、导入、盲填和恢复凭据，同时把真实秘密留在受保护运行库。", implementation: "独立于退役 C Policy；银行卡三字段原子保存，查看窗口白底纯绿、可逐字段复制，剪贴板历史与云同步关闭并在 60 秒或关窗后按值清理。" },
    { name: "Browser Bridge（浏览器桥）", responsibility: "把网站登录和银行卡填充限定到用户当前确认的精确网页目标。", implementation: "1.4.0 launcher-verified；AgentCardFill 只对唯一 HTTPS 支付表单使用一次性能力，同时填入卡号、有效期和 CVV，不提交页面。" },
    { name: "Codex 恢复与迁移", responsibility: "把对话恢复点和 Codex Home 迁移分别做成内容可验证、可以回退的事务。", implementation: "对话备份使用 VSS、内容寻址、逐对象 SHA-256 与 pointer-last；Home 迁移等待写入退出后完成最终增量、ACL/链接清单、原子切换、C 兼容联接和回滚。" },
    { name: "固定 Google Workspace Provider", responsibility: "通过一个固定账号绑定提供邮件、云盘和日历的类型化动作。", implementation: "凭据用 DPAPI 保存；入口没有通用网址、方法或请求体透传，状态检查可做到 zero-network（零网络）。" },
    { name: "Protected-policy retirement", responsibility: "证明旧 C 盘规则运行面、Publisher consumer、worker 与任务已经退役，同时保留历史恢复材料和独立产品。", implementation: "Retirement Registry、固定 retired 状态入口、36 依赖分类、6 任务缺席和机器收敛回执。" },
    { name: "受保护数据连续性", responsibility: "提供版本换挡、最高权限因子、加密保险库、恢复载体和隔离恢复设计。", implementation: "P0–P7（八个严格串行阶段）各有独立完成证据；源码、安装、真实数据迁移和重启验收不能互相冒充。" },
    { name: "漂移与验收", responsibility: "把策略结论和证据结论分开，让失败与 unknown 可定位。", implementation: "稳定 check id、bounded output（有界输出）和按 area/check 精确选择；验证器不会自动修复业务 Owner。" }
  ],
  usageExamples: [
    { ask: "我要把一个本地服务换到固定端口。", effect: "先检查动态端口范围、系统排除段、现有监听和登记冲突；通过后立即绑定并回到项目真实配置源验证，不把预检当成预留。" },
    { ask: "这个项目准备从 E 盘搬到 V 盘。", effect: "先确认仓库状态、路径消费者、计划任务、快捷方式、回滚和目标盘健康；复制验证后再切引用，不把移动和永久删除混在一起。" },
    { ask: "把本机已登记的开发工具安全升级。", effect: "先由组件 Adapter 读取 current/target/relation；只有 behind 才备份、精确更新、等待和回读，unknown 或 channel mismatch（通道不匹配）都停止。" },
    { ask: "为什么某个计划任务没有按预期工作？", effect: "比较 Scheduler 现场、稳定任务签名、LastTaskResult（最近运行结果）和 Owner 回执；不输出完整 Action 或 XML，也不凭任务存在认定业务成功。" },
    { ask: "重装系统后恢复主要日常环境。", effect: "按磁盘与网络、三个控制面、运行时、项目、任务、启动、私密配置和最终验收分层恢复；需要重新登录的部分明确留给用户。" },
    { ask: "让一个程序使用凭据，但不要把密码发给我。", effect: "使用 SecretRef 和登记执行目标盲注入；结果回执固定不含明文，调用者只知道成功、失败或需要人工因子。" },
    { ask: "在这个支付页填我选中的银行卡，但不要替我提交。", effect: "确认唯一 HTTPS 页面和一组标准支付字段后，用一次性能力原子盲填卡号、有效期与 CVV；模型看不到值，提交按钮仍由用户决定。" },
    { ask: "系统损坏后把 Codex 对话恢复回来。", effect: "先验证内容寻址恢复点、逐对象哈希和 closure；G 热备或已闭合的 H 冷备按各自证据恢复，原始对话不上传 GitHub。" },
    { ask: "把 Codex Home 搬到 E 盘，但当前不能重启应用。", effect: "先准备 staging、最终增量、ACL/链接清单和回滚副本；状态保持 waiting_for_codex_exit，只有 Codex 完全退出后才按需启动正式切换。" },
    { ask: "升级受保护数据应用，同时保证失败能退回。", effect: "候选进入不可变旁路版本，经过 pre/post health（切换前后健康检查）后才更新 selector（版本选择器）；失败回到 LKG，无法证明任何版本可用时进入只读恢复。" }
  ],
  evidenceLayers: [
    { layer: "Registry（登记层）", proves: "已登记 Owner、路径引用、恢复关系、schema 和验证入口。", doesNotProve: "现场值仍相同、任务正在运行或消费者已加载。" },
    { layer: "Provider（现场层）", proves: "本次观察时 Windows、安装根或服务返回了什么。", doesNotProve: "登记快照已刷新，也不授权任何写入。" },
    { layer: "Source / Test（源码与测试层）", proves: "当前实现和指定 fixture（隔离样例）覆盖了哪些行为。", doesNotProve: "正式安装态、计划任务、真实账号或真实数据已经可用。" },
    { layer: "Install（安装层）", proves: "制品、ACL（访问控制权限）、任务或快捷方式已落到目标并回读。", doesNotProve: "一次真实启动、重启或业务请求已经成功。" },
    { layer: "Runtime（运行层）", proves: "任务、服务、Adapter 或 Provider 在本次现场能够运行。", doesNotProve: "备份内容完整，或所有项目业务都恢复。" },
    { layer: "Recovery（恢复层）", proves: "精确 preimage、备份集或隔离目录能按合同恢复并校验。", doesNotProve: "换机、全部私人数据或未抽样对象已经恢复。" },
    { layer: "Reboot（重启层）", proves: "自然 Windows 重启后的启动任务、selector 和时限结果。", doesNotProve: "未来每次启动都不会受硬件或外部依赖影响。" },
    { layer: "User acceptance（用户验收层）", proves: "用户要解决的现实问题已经得到可用结果。", doesNotProve: "所有低优先级差异已经消失，或系统不再需要维护。" }
  ],
  evolution: [
    { date: "2026-07-09—07-10", commit: "5be0221–1359298", result: "建立 PCConfig 私有恢复仓库、机器事实 Registry、漂移/验收入口、运行时观察和中文恢复导航，形成“机器现在怎样、改动影响什么、故障后怎样恢复”的第一版闭环。" },
    { date: "2026-07-12—07-25", commit: "cddf2d1–f841453", result: "加入本地 GPU（图形处理器）工作负载串行、受管软件与环境变量元数据、V/Z 开发存储健康、NVMe（固态硬盘）接管说明和固定端口实时门禁；路径与资源变更开始有明确 Owner 和回滚条件。" },
    { date: "2026-07-26—07-30", commit: "8799324–5a9eb5a", result: "形成秘密代理、热备/冷备衔接、计划任务加固、启动快照、稳定机器投影和 CoreRecovery；“文件存在”与“可恢复、可回读”开始严格分层。" },
    { date: "2026-07-31—08-08", commit: "50f71fc–edb3cef", result: "加入 BitLocker（磁盘加密）containment（保护性隔离）、受保护重大动作权威、桌面与治理任务、事务化项目配置快照，以及固定 Workspace 授权 Provider 的初版。" },
    { date: "2026-08-11—08-16", commit: "bc933c3–04fc78d", result: "补齐副驾驶电脑健康与恢复账本、远控和关键启动链，改进 Workspace Provider，并刷新任务、运行时与稳定机器投影；不同主机的规则开始只在身份现场成立时生效。" },
    { date: "2026-08-18—08-23", commit: "1a4d030–f879e5f", result: "建立受保护数据连续性目标、无人值守目标授权基础、P0 安全换挡器和最高权限因子保险库；明确源码通过、安装、真实重启与正式数据恢复是四种不同证据。" },
    { date: "2026-08-24—08-27", commit: "8753374–d3d8d00", result: "CoreGoal V2 进入耐久目标与单步能力模型，Workspace Provider 增加固定类型化读写和原生文档导出，受保护数据推进到 P3/P4 候选；同时补齐受管软件、备份介质结构和恢复 read-back。" },
    { date: "2026-08-28", commit: "0fffc15–c63d804", result: "把 P0–P4 后续实现收敛为更小的 RecoveryKernel（恢复内核）、AuthorityVault（因子保险库）、GoalJournal（目标账本）和 VaultApp（加密文件应用）四角色；改善日常预览/排序，补完 P5–P7 设计与任务投影。" },
    { date: "2026-08-29", commit: "ec98fb1–6922bdb", result: "先补齐残留步骤恢复与旧发布链诊断，随后正式退役 C 盘 protected-policy runtime：移除生产读者、Publisher consumer、worker 与六个任务，保留历史材料和独立产品；再正确分类 P0 历史失败，并为现有桌面恢复入口补齐有界 launcher、测试和快捷方式回读。" },
    { date: "2026-08-30", commit: "9449bad–d13ac19", result: "Password Center 从“能找到密码”进化为可独立恢复、可原子保存银行卡并精确盲填；中文与 Google 导入改为严格解码、保留重复项和事务回滚；Codex 对话进入内容寻址的 G→H 恢复链；Codex Home 形成可预演、可回滚、等待退出后按需启动的迁移事务。" }
  ],
  operationalEntrypoints: [
    { name: "机器事实漂移", command: "E:\\PCConfig\\tools\\Test-PCConfigDrift.ps1 -NoWrite -Json", purpose: "零写入比较登记与现场，并分别给出策略状态和证据状态。" },
    { name: "稳定机器投影", command: "E:\\PCConfig\\tools\\Invoke-StableMachineProjection.ps1 -Action Read -Json", purpose: "读取版本化、公开安全的稳定机器事实，不触发 live publish（现场发布）。" },
    { name: "运行时现场", command: "E:\\PCConfig\\tools\\Get-RuntimeInventory.ps1 -Json", purpose: "读取 PowerShell、系统权限与编码相关的当前运行时事实。" },
    { name: "开发存储健康", command: "E:\\PCConfig\\tools\\Get-DevStorageHealth.ps1 -Json", purpose: "检查 V 开发盘和 Z 缓存盘的挂载、文件系统、目录骨架和恢复锚点。" },
    { name: "固定端口预检", command: "E:\\PCConfig\\tools\\Test-LocalServicePort.ps1 -Port <port> -ProjectId <project_id> -Key <stable_key> -Json", purpose: "检查动态范围、排除段、监听和 Owner 冲突；它不会预留端口。" },
    { name: "受管软件目录", command: "E:\\PCConfig\\tools\\Invoke-ManagedSoftware.ps1 -List -Json", purpose: "列出已登记组件和自己的状态/更新路由，不探测未知组件。" },
    { name: "启动快照比较", command: "E:\\PCConfig\\tools\\Invoke-StartupSnapshotMaintenance.ps1 -Action Inspect -Json", purpose: "比较五个登录启动 surface（来源面）；差异只作信息，不自动修复。" },
    { name: "核心恢复观察", command: "E:\\PCConfig\\tools\\Invoke-CoreRecoveryMaintenance.ps1 -Mode Inspect -Json", purpose: "只读任务和根路径元数据，不枚举个人文件名或内容。" },
    { name: "秘密代理状态", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action Status -Json", purpose: "验证安全核心和恢复闭环，回执固定不返回明文。" },
    { name: "Workspace 绑定", command: "E:\\PCConfig\\tools\\Get-GoogleWorkspaceProviderBinding.ps1 -Json", purpose: "零网络读取固定绑定与凭据文件存在性；不解密、不证明远端授权。" },
    { name: "旧 policy 退役状态", command: "E:\\PCConfig\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1 -Json", purpose: "固定返回 retired、历史保留和 E rules replacement；不再读取 C 盘活动代际。" },
    { name: "按区域验收", command: "E:\\PCConfig\\tools\\Invoke-PCConfigAcceptance.ps1 -NoWrite -Area <area> -Json", purpose: "只运行选定 area（验收区域）的登记检查；未运行项不进入结果。" }
  ]
};

export const pcconfigModules = [
  {
    slug: "machine-facts",
    shortTitle: "机器事实",
    title: "机器事实、路径与配置导航",
    teaser: "回答“这台电脑现在怎样、配置真正在哪里、改动会影响谁”，并为路径、端口和开发存储提供现场门禁。",
    status: "机器事实可读，开发存储 5/5 通过；稳定投影为版本 5",
    statusTone: "pass",
    value: "把散落在磁盘、环境、项目文件和本机服务里的配置变成可导航、可验证的机器地图。用户不用靠记忆猜路径，也不会因为看到一个旧值就直接改错地方。",
    why: "同一个端口可能同时受 Windows 动态范围、现有 listener（监听进程）和项目配置影响；同一个目录也可能被计划任务、快捷方式或服务引用。没有唯一 Owner 和依赖导航，迁移很容易造成“文件还在，但程序找不到”。",
    example: "例如我要把一个新项目放到 V 盘，并让它使用固定本地端口。这个模块先证明 V 盘健康，再查端口是否落入动态/排除范围、是否已有监听、是否被别的 Owner 登记；通过后才让项目绑定并把稳定配置投影回 Registry。",
    result: "检查通过时得到可用候选和验证入口；发现冲突时得到具体阻断原因；现场来源不可读时得到 unknown，并停止迁移或固定端口选择，不用默认路径或常见端口猜测。",
    readerStates: {
      pass: "磁盘、路径、端口和依赖引用都由真实责任源确认后，返回可用目标和后续验证入口，项目才继续绑定或迁移。",
      problem: "发现端口占用、目录引用、磁盘健康或登记冲突时阻断对应选择，并指出冲突对象和应由哪个项目处理。",
      unavailable: "现场机器事实不可读时保持 Unknown（证据不足），不拿缓存路径、常见盘符或默认端口代替当前事实。"
    },
    decisionImpact: [
      "机器配置值先回到项目、服务或任务的真实配置源，PCConfig 快照只负责导航。",
      "路径迁移必须同时具备 source（源路径）、target（目标路径）、消费者、preimage（变更前像）、rollback（回滚）和 verification（验证）。",
      "固定端口在所有实时门禁通过后仍须立即真实 bind（绑定），预检不是预留。",
      "短生命周期服务直接绑定端口 0，由操作系统分配，不建立无意义的固定登记。",
      "V 是开发层，Z 只放可重建有界缓存；唯一源码、数据库和正式备份不能放进 Z。"
    ],
    problem: "机器事实既有长期稳定信息，也有每次都可能变化的现场状态。把两者混在一份静态文档里，会让旧路径、旧端口或旧运行时继续被误用；反过来持续扫描整机又会制造隐私、延迟和第二事实源。",
    implementation: [
      "44 份 Registry 分别保存 machine、drives、folders、path owners、project config keys、dependencies、runtimes 和恢复关系；每类都有明确 schema 和 validator（校验器）。",
      "稳定机器 Provider 只采集硬件、系统、固定卷和关键运行时，明确排除序列号、网络标识、负载、温度、进程、秘密和原始时序。",
      "稳定投影用规范哈希、previous 链和同目录原子替换；payload（有效数据）不变时返回 no_change，不刷新 mtime（文件修改时间）。",
      "项目配置快照当前有 157 个键。update 请求必须绑定 Registry 期望哈希、单一 project id、唯一 key 集和项目 Owner 验证；安全投影失败时 mark_stale，而不是保留伪 current。",
      "目录 Registry 和路径 Owner Registry 各登记 57 项；项目路径依赖 Registry 汇总 15 个项目。普通任务只读取命中的有界条目，不加载整份依赖表。",
      "端口 Provider 同时读取 IPv4/IPv6 动态范围、排除段、listener 和登记冲突，available、blocked、unknown 使用不同退出码。",
      "开发存储 Provider 单独判断 V 与 Z；Z 降级不会自动阻断健康的 V 项目，当前现场摘要为 pass=5、warn=0、block=0。"
    ],
    flow: [
      "判断当前问题是否真的依赖机器事实",
      "从 Registry 定位 Owner、真实配置源和只读入口",
      "运行匹配 Provider 取得本次现场观察",
      "需要变更时冻结 source、target、消费者、preimage、rollback 和 verification",
      "先由项目 Owner 修改并验收真实配置",
      "再用期望哈希事务更新 PCConfig 快照或稳定投影",
      "从项目与现场两端分别回读"
    ],
    concepts: [
      { term: "Registry（结构化登记表）", explanation: "提供稳定键、Owner、来源和验证入口；它不是现场真相，也不能单独证明消费者已加载。" },
      { term: "Stable projection（稳定投影）", explanation: "只保存长期有意义且公开安全的机器事实，版本化记录真正变化，不做实时监控。" },
      { term: "Mark stale（标记陈旧）", explanation: "保留 last-known value（最后已知值），但明确撤销“这是当前值”的声明。" },
      { term: "Port preflight（端口预检）", explanation: "判断候选端口此刻是否适合尝试绑定；它没有锁定端口，因此检查后必须立即 bind。" },
      { term: "Move gate（迁移门禁）", explanation: "只有源、目标、依赖、风险、回滚和验证全部明确，才允许从复制验证推进到切换引用。" },
      { term: "Dev Drive（开发盘）", explanation: "V 盘的开发层；适合可恢复的仓库、worktree（隔离工作树）、包缓存和构建输出，不是独立物理备份。" }
    ],
    boundaries: [
      "不递归扫描整个 C 盘，只看会改变当前决定的候选",
      "不保存环境变量值、完整依赖 payload、序列号、网络身份或秘密",
      "project_config_keys 快照不反向修改项目真实配置",
      "稳定投影不记录进程、负载、温度、空闲空间或时序数据",
      "VHD（虚拟磁盘文件）位于 E 盘，不构成独立故障域",
      "目录不整齐不是迁移理由，移动和永久删除不能放在同一操作"
    ],
    failures: [
      { condition: "Provider 或 Registry schema 失败", response: "对应事实保持 unknown，阻断依赖该事实的迁移或配置决定；旧报告不能补齐。" },
      { condition: "项目配置源已改变但快照无法安全更新", response: "优先把命中键标记为 stale；标记也失败则保留原文件并报告哈希或锁冲突。" },
      { condition: "端口预检通过但真实 bind 失败", response: "停止服务启动，重新探测；不自动退回 8000 等常见默认端口。" },
      { condition: "稳定投影 live payload 不完整或含禁入字段", response: "在替换 current 前失败，保留版本 5 的既有投影。" },
      { condition: "V 或 Z 恢复锚点不可读", response: "只阻断依赖该盘的工作；不自动创建同名空盘覆盖恢复线索。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\folders.json", role: "57 个登记目录及其用途边界" },
      { path: "E:\\PCConfig\\registries\\path_owners.json", role: "57 个路径 Owner 与依赖事实来源" },
      { path: "E:\\PCConfig\\registries\\project_path_dependencies.json", role: "15 个项目的路径依赖汇总" },
      { path: "E:\\PCConfig\\registries\\project_config_keys.json", role: "路径、端口、模型和数据源的非权威快照目录" },
      { path: "E:\\PCConfig\\registries\\stable_machine_projection.json", role: "版本化稳定机器投影 current" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.path-project-config.md", role: "路径与项目配置事务合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.stable-machine-projection.md", role: "稳定字段、禁入项、版本与发布语义" },
      { path: "E:\\PCConfig\\docs\\governance\\local_service_port_policy.md", role: "固定端口实时门禁" },
      { path: "E:\\PCConfig\\docs\\governance\\move_gate.md", role: "迁移、回滚与删除分离" },
      { path: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", role: "E/V/Z 放置和恢复关系" }
    ],
    verification: [
      "Get-DevStorageHealth.ps1 -Json 于 2026-08-29 返回 5 项 pass、0 warn、0 block",
      "Get-RuntimeInventory.ps1 -Json 当前 exit 0 且返回 pcconfig.runtimes.v1",
      "Invoke-StableMachineProjection.ps1 -Action Read -Json 当前可读取版本 5；该投影最后生成于 2026-08-16，不能冒充 2026-08-29 live 采集",
      "validate_project_config_keys.mjs 验证键、敏感级别、来源、快照状态和事务字段",
      "test_local_service_port.test.ps1 覆盖动态范围、排除段、listener、登记冲突和 unknown",
      "stable_machine_projection.test.ps1 覆盖禁入字段、原子回读、变化链和重复 no-op"
    ],
    relation: "这个模块回答“机器配置在哪里、现在是什么”；运行时与启动模块负责“它怎样启动和运行”，恢复模块负责“故障后怎样重建”，受保护动作模块负责“重大写入怎样获准并回读”。"
  },
  {
    slug: "runtime-startup",
    shortTitle: "运行与启动",
    title: "运行时、受管软件、启动项与计划任务",
    teaser: "把工具版本、环境元数据、登录启动和计划任务拆成各自可观察、可恢复、不会弹黑窗的运行链。",
    status: "运行环境与配置地图可读；当前覆盖 17 个启动项、87 个任务，10 个核心恢复任务均 Ready 且最近结果 0",
    statusTone: "mixed",
    value: "让我知道“软件装着”之外，正确版本是否可用、启动入口是否仍在、计划任务上次怎样结束，以及重装后要按什么顺序恢复。故障会落到具体任务或组件，而不是一句笼统的“电脑环境坏了”。",
    why: "运行时路径会变化，环境变量可能双作用域，登录启动和计划任务又是两套机制。只看文件是否存在会漏掉错误 Action（执行命令）、错误身份、被禁用任务或非零结果；只看任务 Ready（就绪）也不能证明业务成功。",
    example: "例如我问“为什么一个后台维护任务今天没生效”。这个模块先比较 Task Scheduler（Windows 计划任务服务）现场和稳定签名，再读 LastTaskResult（最近运行结果）、结构化 Owner 回执和 hidden launcher（无窗口启动器）身份。若任务本身成功但业务回执失败，会保留两层不同结果。",
    result: "正常时得到当前运行时、组件 relation（版本关系）、启动差异和任务健康摘要；发现问题时定位到配置漂移、任务结果或 Owner 回执；来源不可读时保持 unknown（证据不足），不把 absent（不存在）和 unreadable（无法读取）混为一谈。",
    readerStates: {
      pass: "运行时版本、启动入口、计划任务定义、最近结果和业务回执相互一致时，显示该组件可用并保留对应恢复顺序。",
      problem: "文件存在但任务、身份、命令或业务回执不一致时，分别显示任务层和业务层问题，不用 Ready（就绪）状态掩盖失败。",
      unavailable: "计划任务服务、运行时或结构化回执不可读时标记无法读取，不把它误写成不存在、已禁用或运行成功。"
    },
    decisionImpact: [
      "运行时当前值只信 Get-RuntimeInventory；冻结 Registry 只用于 drift 比较。",
      "受管软件只有 behind 才更新，equal 不重装，ahead 不降级，unknown 和 channel_mismatch 停止。",
      "登录启动快照差异默认 informational（仅供参考），不会自动关闭或修复应用。",
      "Task Scheduler 是任务运行权威，瞬时 Ready/Running 不进入稳定 drift。",
      "无交互任务必须由验证过的父级 hidden launcher 创建无可见控制台的子进程。",
      "任务存在、exit 0 或 receipt 文件存在都不能单独证明业务成功。"
    ],
    problem: "版本、路径、权限、环境、启动面和任务结果经常被压成一个“环境是否正常”的问题，导致自动重装、误删启动项或用旧任务结果猜当前状态。PCConfig 必须把每个运行面分开，并只让真实 Owner 解释业务结果。",
    implementation: [
      "运行时 Provider 返回 Windows、PowerShell Core（跨平台 PowerShell）和 Windows PowerShell 的路径、版本、架构与编码事实；路径多候选时使用当前 PSHOME 的唯一 executable（可执行文件）。",
      "managed_software_catalog 当前登记 11 个组件，每个条目只给 status/update Adapter，不允许自由命令字符串或缓存 last_observed。",
      "更新流程固定为 Resolve → Status → Backup → Preflight → Update → Wait → Verify；目标版本在安装前 pin（精确固定），安装后强制相等。",
      "环境变量索引当前记录 90 个变量元数据和 64 个 PATH（可执行搜索路径）条目；Probe-EnvVar 只返回存在性、作用域和差异，不返回任何值。",
      "启动快照只覆盖当前用户/机器 Run 与用户/公共 Startup 文件夹五个 surface，不复制 Task Scheduler，也不覆盖服务、驱动和 packaged app。",
      "本轮配置地图覆盖 17 个启动项；更早的 2026-08-29 live startup 20 项观察只保留为历史，不覆盖当前快照。",
      "tasks Registry 当前有 87 项；10 个核心恢复任务均为 Ready、最近结果 0，并由 CoreRecovery 3/3 验收分层回读。",
      "governance check 只调用登记的 zero-write Provider 和稳定 publisher；同一非 current fingerprint 只有首次或变化时产生 attention。"
    ],
    flow: [
      "用别名或任务名定位受管条目和业务 Owner",
      "读取 live runtime、startup 或 Scheduler 现场",
      "把配置签名、瞬时状态、LastTaskResult 和 Owner receipt 分开",
      "需要更新时先固定 current/target/relation 和回滚材料",
      "需要注册任务时保存 exact XML preimage 或 absent",
      "执行后回读路径、版本、Principal、trigger、Settings 和业务 receipt",
      "将确定故障、提醒和 unknown 分别收口"
    ],
    concepts: [
      { term: "Runtime（运行时）", explanation: "真正执行脚本或程序的本机环境，包括 executable 路径、版本、架构和编码通道。" },
      { term: "Relation（版本关系）", explanation: "installed 与 target 的 behind、equal、ahead、unknown 或 channel_mismatch；它直接决定是否允许更新。" },
      { term: "Startup surface（启动来源面）", explanation: "Run 注册表或 Startup 文件夹中的一个独立来源；跨来源同名项不会被错误去重。" },
      { term: "Task signature（任务稳定签名）", explanation: "恢复所需的 enabled、Action、trigger、重试和执行限制等配置，不包含 Ready/Running 瞬时状态。" },
      { term: "LastTaskResult（最近运行结果）", explanation: "Scheduler 的最近返回码；信息码与真实失败要分类，非零也要结合业务 Owner 回读。" },
      { term: "Hidden launcher（无窗口父启动器）", explanation: "从最外层就不创建可见控制台的启动链；Task Scheduler 的 Hidden 复选框不能单独证明这一点。" }
    ],
    boundaries: [
      "环境变量、PATH、任务 Action、参数、XML 和日志按实际值判断：普通名称、路径、结构、状态和失败事实可以公开；只省略其中确含 L3+ 私人正文或可复用凭据的具体值",
      "不自动建立无人值守软件更新任务",
      "不因为 startup 新增、删除或启停变化就生成故障或待办",
      "不从 provider 名称猜管理员需求；安装范围由本次 status Adapter 回读",
      "不重装 equal 但 degraded 的组件，只报告健康缺口",
      "具体任务为何成功仍由所属项目定义"
    ],
    failures: [
      { condition: "完整权限现场与 Registry 不同", response: "保留精确差异并标明观察时间；不把历史 task-scan 冒充当前闭合，也不把 runtime health PASS 反推成定义一致。" },
      { condition: "P0 历史 LastTaskResult=4", response: "正式回执已证明在线恢复到第 68 版 normal/LKG，因此分类为 historical_failure_recovered_online；下一次自然 boot deadline 仍须单独验收。" },
      { condition: "启动快照比现场少 3 项", response: "当前归类为 informational_only；无需自动刷新、关闭应用或要求用户确认，下次真实维护可吸收为新基线。" },
      { condition: "环境变量 registry/process 读取失败", response: "对应项 exists=null、diff_status=unknown；不把读取失败写成 absent。" },
      { condition: "组件 status 为 unknown 或通道不匹配", response: "不备份、不安装、不降级，返回稳定错误码和 Owner 入口。" },
      { condition: "任务注册 read-back 不一致", response: "自动恢复 exact XML preimage 并再次核对；回滚失败单独 fail closed。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\runtimes.json", role: "冻结运行时投影" },
      { path: "E:\\PCConfig\\registries\\managed_software_catalog.json", role: "11 个受管组件与 Adapter 路由" },
      { path: "E:\\PCConfig\\registries\\env_var_index.json", role: "变量名称、作用域和 PATH 顺序元数据" },
      { path: "E:\\PCConfig\\registries\\startup_snapshot.json", role: "五个登录启动来源面的维护快照" },
      { path: "E:\\PCConfig\\registries\\tasks.json", role: "计划任务稳定恢复投影" },
      { path: "E:\\PCConfig\\registries\\task_purpose_catalog.json", role: "任务用途、Owner 和验证入口" },
      { path: "E:\\PCConfig\\registries\\scheduled_task_rebuild_plan.json", role: "分阶段任务重建计划" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.managed-software-routing.md", role: "受控更新状态机" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.scheduled-tasks.md", role: "Scheduler 权威、无窗口和事务回滚合同" }
    ],
    verification: [
      "2026-08-31T11:43:18Z 配置地图回读 44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项和 87 个任务",
      "10 个核心恢复任务均为 Ready、最近结果 0；CoreRecovery 3/3 验收通过",
      "P0 第 68 版为 normal、active=LKG、trusted=true；最新自然启动用时 46.984 秒、deadline_met=true",
      "Get-StartupInventory.ps1 -Json 当前覆盖 17 个启动项",
      "Invoke-StartupSnapshotMaintenance.ps1 -Action Inspect -Json 当前返回 changes_observed，但 action_required=false、confirmation_required=false",
      "validate_managed_software_catalog.mjs、validate_env_var_index.mjs 与对应回归覆盖 catalog、环境元数据和闭合状态机"
    ],
    relation: "机器事实模块告诉它们在哪里；本模块证明怎样启动和运行；恢复模块在系统重建后按顺序重新接上这些运行链；漂移结果又成为整体验收的输入。"
  },
  {
    slug: "recovery-backup",
    shortTitle: "恢复与备份",
    title: "核心恢复、备份介质与迁移回滚",
    teaser: "把“有备份”升级为“知道从哪里恢复、按什么顺序、如何验证、失败后怎样不覆盖原状”。",
    status: "10 个核心恢复任务均 Ready 且最近结果 0；CoreRecovery 3/3 通过，H 冷备与新机恢复端到端验收仍独立待证",
    statusTone: "mixed",
    value: "重装、换机或磁盘故障时，不再凭记忆到处拷文件。它把网络可重建的软件、需要备份的日常数据、私密配置、计划任务和人工登录分层，让恢复可以停在安全检查点继续。",
    why: "单纯复制文件无法恢复任务身份、运行时顺序、路径引用、登录态和业务可见性；反过来整包覆盖又可能把旧配置、损坏数据库或错误路径带回新系统。恢复必须选择性、可回退并逐层验收。",
    example: "例如系统盘损坏但数据盘和一份冷备仍在。这个模块先验证机器、磁盘和恢复载体，再重建三个控制面与开发运行时，随后按 allowlist（明确允许清单）恢复 Documents、Downloads、应用数据和任务；私密配置走自己的人工门禁。最后用 checklist（验收清单）列出可用、需登录和未证明项。",
    result: "Inspect 通过时得到不含文件名和正文的恢复准备摘要；执行恢复时每个对象都有 source（来源）、target（目标）、hash/read-back（指纹与回读）和 rollback（回滚）；来源缺失或锁定时只暂停对应层，不把部分复制称为整机恢复。",
    readerStates: {
      pass: "恢复载体、目标磁盘、分层清单和回退入口完整时，按层恢复并逐项核对来源、目标、内容指纹和用户可用结果。",
      problem: "某一层复制、任务恢复、路径重建或登录验证失败时停在该检查点，保留已验证层和原始恢复来源，不继续整包覆盖。",
      unavailable: "恢复载体离线、来源被锁定或关键清单不可读时只暂停对应层，并明确还缺哪份来源或人工登录，不宣称整机已恢复。"
    },
    decisionImpact: [
      "GitHub 和官方网络可重建软件与已发布代码，但不能恢复未推送改动或私人数据。",
      "普通恢复与受保护媒体/私密数据恢复分开，不能把一条备份链扩大成全盘恢复。",
      "Hot（在线热备）是 G 恢复上下文唯一 writer，Cold（人工冷备）只消费已验证 Hot。",
      "恢复可以从宽备份中选择性取回，禁止整包覆盖新系统。",
      "H 不可用时记录 skipped，不写 G/H，也不自动弹解锁或改变设备信任。",
      "实际恢复完成要经过应用打开、数据可见和业务操作，复制成功只是中间证据。"
    ],
    problem: "备份往往回答“字节在哪里”，恢复却要回答“哪些字节可信、先恢复谁、路径怎样接回、任务用什么身份、秘密怎样重建、应用能否看到”。没有统一恢复顺序与 Owner 分工，就容易把备份存在误当成系统可用。",
    implementation: [
      "core_recovery Registry 当前登记 8 个 backup set（备份集合）和 2 个 external owner（外部责任源），明确 contains_secret_values=false。",
      "Inspect 只读取任务和根路径元数据，不枚举个人文件名或内容；2026-08-29 的 ready / 0 warning 是历史回执，2026-08-30 最新现场为 ready_with_warnings，不能用旧绿灯覆盖。",
      "Hot 在 G 的同根 staging（暂存区）写 manifest、指南、观察上下文和 closure（闭合清单），完整回读后才原子切换 current 指针。",
      "Cold 重验卷身份、BitLocker、空间、Hot 指针、四文件 closure、48 小时时效和全部 SHA-256；复制采用加法式，不使用镜像删除。",
      "启动/任务恢复保存 exact XML preimage；同名任务只有 Owner marker 和 Action identity 同时匹配才可替换。",
      "move gate 要求先刷新目录证据，再 copy-first、验证 target、更新引用、验消费者，最后才讨论旧路径退役。",
      "acceptance Registry 当前有 12 个 area、17 个 item；selector 不存在时在启动任何 check 前直接 error。",
      "恢复完成后的稳定硬件、系统或运行时变化可以发布为 projection（稳定机器投影）版本，或显式记录 migration/reinstall lifecycle event（迁移/重装生命周期事件）。"
    ],
    flow: [
      "确认故障范围与可用网络、磁盘、恢复介质",
      "验证三个控制面根锚点和 GitHub 身份",
      "按 Windows、运行时、项目、任务、应用、私密配置的顺序恢复",
      "对每个对象固定 source（恢复来源）、target（恢复目标）、preimage（变更前状态）、hash（内容指纹）和回滚",
      "先在隔离或新路径验证，再切换消费者引用",
      "运行匹配 area 的验收和真实应用检查",
      "保留需登录、unknown 和无法恢复项，不用百分比包装"
    ],
    concepts: [
      { term: "CoreRecovery（核心恢复）", explanation: "重装/换机后的主恢复编排与观察入口，不是磁盘镜像，也不读取所有私人 payload。" },
      { term: "Hot（在线热备）", explanation: "在可持续访问介质上原子发布的小型恢复上下文与已登记数据副本。" },
      { term: "Cold（人工冷备）", explanation: "需要人工接入/解锁的独立介质，只从完整验证的 Hot 消费，不反向改写 Hot。" },
      { term: "Closure（闭合清单）", explanation: "把规范文件名、schema、长度和 SHA-256 绑在一起，避免 current 指向不完整的一组文件。" },
      { term: "Selective restore（选择性恢复）", explanation: "备份可以宽，恢复只取经过 Owner 与新系统验证的必要对象，不整包覆盖。" },
      { term: "Recovery checkpoint（恢复检查点）", explanation: "每一层完成后可回读、可停下并继续的耐久状态，而不是一次长命令的临时输出。" }
    ],
    boundaries: [
      "不把 Git 工作树、未推送提交、untracked、ignored 或 .git 当普通备份 payload",
      "不递归复制整个 AppData，不把浏览器登录态或原始聊天数据库写入仓库",
      "不新增云上传、不切换账号、不读取活动 OAuth 私密内容",
      "备份存在、任务 exit 0、文件复制或 hash 通过都不单独证明应用恢复",
      "冷备不使用 /MIR，不因版本多就删除未知历史包",
      "永久删除和秘密恢复始终保留精确人工门禁"
    ],
    failures: [
      { condition: "当前 CoreRecovery 区域验收", response: "manifest_contract、maintenance_inspect 和 task_contract 三项均 pass；它只证明该区域合同，不覆盖全局 task drift。" },
      { condition: "整机任务仍有 attention", response: "CoreRecovery maintenance inspect 与区域验收通过；但 4 项任务缺少完整可见性，P0 下一次自然 boot deadline 未验，所以不称整机治理全绿。" },
      { condition: "H 锁定、缺失或卷身份不符", response: "Cold 返回 skipped 或 fail，既不写入介质，也不自动解锁、锁卷或改变设备信任。" },
      { condition: "Hot closure 或时效不满足", response: "Cold 不复制，也不用进程成功值或旧 current 补齐。" },
      { condition: "复制中断或校验失败", response: "保留逐项结果、旧 current（当前完整状态）和 source（恢复来源）；不切消费者，不清旧路径。" },
      { condition: "应用数据已复制但客户端不可见", response: "保持恢复未完成，回到应用 Owner 做原生打开、账号和数据一致性验证。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\core_recovery.json", role: "核心恢复 scope、备份集合、外部 Owner 和成功条件" },
      { path: "E:\\PCConfig\\registries\\backup_media_structure.json", role: "热备/冷备介质结构导航" },
      { path: "E:\\PCConfig\\registries\\scheduled_task_rebuild_plan.json", role: "任务恢复阶段与授权边界" },
      { path: "E:\\PCConfig\\registries\\recovery_kit.json", role: "启动介质、驱动、固件和恢复资产清单" },
      { path: "E:\\PCConfig\\registries\\acceptance_checklist.json", role: "12 区域、17 项验收入口" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.core-recovery.md", role: "CoreRecovery、Hot/Cold 和选择性恢复合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.recovery-privacy.md", role: "迁移、秘密与私人 payload 边界" },
      { path: "E:\\PCConfig\\docs\\recovery\\START_RECOVERY.md", role: "重装/换机的机器接管入口" }
    ],
    verification: [
      "Invoke-CoreRecoveryMaintenance.ps1 -Mode Inspect -Json 当前返回 pcconfig.core_recovery_observation.v2、status=ready、warnings=0",
      "同次 Inspect 只报告 9 个任务、8 个 backup set、2 个 external owner；payload_names_emitted=false、payload_content_read=false",
      "Invoke-PCConfigAcceptance.ps1 -NoWrite -Area core_recovery -Json 当前 3 pass、0 fail、0 unknown、0 blocking_unresolved",
      "core_recovery_maintenance.test.ps1 覆盖 Inspect、Hot、Cold、closure、时效、卷身份和中断回执",
      "build_scheduled_task_rebuild_plan.test.mjs 与 validate_scheduled_task_rebuild_plan.test.mjs 覆盖任务恢复投影",
      "acceptance runner 的精确 area/check selector、超时、unknown 和有界输出由 invoke_acceptance_checks.test.ps1 验证"
    ],
    relation: "本模块消费机器事实、运行时与任务模块的入口；秘密模块提供不进普通备份的私密恢复；受保护数据模块承担需要 Carrier 与因子的独立加密恢复。"
  },
  {
    slug: "secrets-providers",
    shortTitle: "秘密与 Provider",
    title: "SecretRef（秘密引用）、秘密代理与固定 Workspace Provider",
    teaser: "让程序完成登录、调用和云端读写，同时把秘密值留在受保护运行库；Provider（类型化读取器）只返回任务结果，不把秘密交给模型、终端或公开回执。",
    status: "秘密代理可用；固定 Workspace 账号的远端实读仍未复核",
    statusTone: "mixed",
    value: "用户可以让自动化真正使用账号和 API（程序接口），而不是反复复制密码、令牌或客户端密钥。需要人工验证时只完成那个精确边界，日常任务不因此获得查看秘密明文的能力。",
    why: "把秘密写进环境变量、命令行、日志或聊天会扩大泄漏面；只说“凭据在密码管理器里”又不能让项目稳定调用。SecretRef 和固定 Provider 在可用性与零明文之间建立一条可回读路线。",
    example: "例如我说“从固定 Workspace 账号读取一个云端文档并导出为 PDF（便携文档格式）”。系统先用固定 binding（绑定）和类型化 Drive action（云盘动作），按需解密 DPAPI 状态并在进程内刷新 access token（访问令牌）；输出只写指定文件，回执不包含账号、标题、正文、文件 id 或访问令牌。",
    result: "成功时得到任务结果和无秘密回执；需要账号授权时进入前台浏览器由用户完成；来源不可用、scope（权限范围）不匹配或文件超限时返回精确错误，不静默换账号、换 Provider 或把秘密交给调用者。",
    readerStates: {
      pass: "本地程序调用时核对 SecretRef（秘密引用）与登记执行目标；Workspace 调用时核对固定 binding（绑定）、scope（权限范围）和 typed action（类型化动作）。两条路线都只返回业务结果和无秘密回执。",
      problem: "账号、权限范围、目标文件或 Provider（固定服务入口）不匹配时停止调用并返回精确错误，不静默切换账号或扩大授权。",
      unavailable: "秘密代理、账号授权或固定 Provider 不可用时暂停对应外部动作；秘密明文不会转入聊天、日志、命令行或普通文件。"
    },
    decisionImpact: [
      "默认完成“使用秘密”，不默认 Reveal（显示明文）。",
      "AgentLogin（浏览器盲填）只匹配精确 tab、origin 和 frame；AgentSecretRef 只匹配登记 executable、参数目标或受控输入通道。",
      "固定 Workspace Provider 只有一个 binding，动作不能在运行时选择其他账号。",
      "只有 Gmail、Drive 和 Calendar 通过同一 Provider 的真实读取验收后，Read action（读取动作）才成为默认能力；当前仅证明零网络 binding（绑定）已配置，尚未证明远端 OAuth（账号授权）和实际读取可用。Write action（写入动作）还必须对每种动作独立验收，并由本轮明确对象和内容授权。",
      "OAuth enrollment（账号授权登记）只在前台进行一次，callback（回调）使用随机 loopback 端口与 PKCE（授权码保护）。",
      "Secret Broker 状态通过不证明每个外部网站、账号或网络请求当前都成功。"
    ],
    problem: "凭据系统常见两个极端：要么所有自动化都能读明文，要么秘密封得太深，真实任务无法使用。PCConfig 把存储、授权、盲用、单项显示、恢复和设备信任分开，每个入口只拿完成当前动作所需的最小结果。",
    implementation: [
      "运行时数据库、密钥包和恢复材料位于 Git 仓库外并加密；PCConfig source 只保存策略、SecretRef、无秘密 Registry 和测试。",
      "AgentSecretRef 把 SecretRef 绑定到登记 executable、argv（参数）或 stdin（标准输入）目标；目标 hash、参数位置和调用方都必须匹配。",
      "Reveal 只允许用户明确点名的单个字段；批量恢复查看即使获准也不得进入模型、聊天、stdout、JSON、日志、剪贴板或普通文件。",
      "Secret Broker status 当前明确 plaintext_returned=false、key_project_touched=false、remote_fetch_performed=false，安全核心和 product closure（产品闭环）均 pass。",
      "当前唯一 optional gap 是外部密码管理器缺少逐条公开 API；它不会把核心状态改写为失败，也不会授权抓取浏览器数据库。",
      "Workspace credential state 使用 CurrentUser DPAPI；状态检查只看固定路径和文件存在性，不解密，2026-08-29 返回 configured、credential_state_present=true、credential_state_decrypted=false、zero_network=true。",
      "Provider 暴露 Gmail（邮件）、Drive（云盘）和 Calendar（日历）的 closed action allowlist，没有通用 URL、HTTP method（请求方法）、body 或账号透传。",
      "access token（访问令牌）只在当前进程内存在；receipt（执行回执）明确 token_returned=false、client_secret_returned=false。"
    ],
    flow: [
      "用固定 SecretRef 或 binding 定位 Owner",
      "只读检查运行时、设备信任和目标登记",
      "需要人类因子时冻结精确 action 与 target",
      "在受保护进程内解密或刷新短时凭据",
      "把凭据盲填、盲注入或交给类型化 Provider",
      "执行真实动作并取得服务端结果",
      "回执只返回状态、hash、计数和错误码，不返回秘密"
    ],
    concepts: [
      { term: "SecretRef（秘密引用标识）", explanation: "稳定指向一个秘密的名字；调用者使用它，不知道也不接收秘密值。" },
      { term: "Blind injection（盲注入）", explanation: "秘密直接进入登记程序的受控输入，不经过模型、终端、环境变量、日志或剪贴板。" },
      { term: "Binding（固定绑定）", explanation: "把 Provider、账号身份、scope、状态路径和端点固定在 Registry 中，动作不能临时换账号。" },
      { term: "OAuth（账号授权协议）", explanation: "用户在官方页面同意固定 scope，Provider 用授权码换取并安全保存 refresh token（刷新令牌）。" },
      { term: "PKCE（授权码保护）", explanation: "给一次 OAuth 流程绑定 code verifier（校验秘密），降低授权码被截获后复用的风险。" },
      { term: "Typed action（类型化动作）", explanation: "每个邮件、云盘或日历操作都有固定参数 schema，不允许调用者构造任意网络请求。" }
    ],
    boundaries: [
      "不在仓库、模型上下文、stdout、JSON、日志或剪贴板保存秘密值",
      "不把 Cookie、浏览器 profile、会话数据库或完整环境文件作为导入源",
      "不因管理员权限令牌、插件或账号登录扩大任务授权",
      "不静默切换到另一个账号、公共 connector（连接器）或第三方 CLI",
      "单请求有固定传输上限；大文件失败不会引入无边界上传平台",
      "验证码、CAPTCHA 和网站确认继续由用户完成"
    ],
    failures: [
      { condition: "Secret Broker 状态无法验证", response: "冻结秘密使用，返回 failed/partial 或精确 unavailable；不从旧回执或 Registry 推断可用。" },
      { condition: "Workspace binding 仅 configured", response: "当前零网络检查只证明固定配置与 state file 存在，不证明 OAuth scope、远端账号身份或某个动作可用。" },
      { condition: "网络错误、超时或限流", response: "报告 transport failure，不把凭据标成无效，也不自动更换账号或重复写操作。" },
      { condition: "scope 多、少、重复或账号身份不符", response: "OAuth enrollment 在持久化前 fail closed，既有 enrolled record 不被重复导入覆盖。" },
      { condition: "Reveal 命中不唯一或缺少新鲜因子", response: "不返回任何字段，不降级为批量列表或侧路文件。" },
      { condition: "外部逐条凭据 API 不可用", response: "保留 optional gap；不抓浏览器数据库，也不把可发现元数据误作可写来源。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\secret_broker.json", role: "SecretRef、运行时和安全边界 Registry" },
      { path: "E:\\PCConfig\\registries\\google_workspace_provider.json", role: "固定 Workspace binding、scope、端点与无秘密元数据" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.secret-broker.md", role: "秘密使用、恢复、信任与零明文产品合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.google-workspace-provider.md", role: "固定账号 Provider、OAuth 和类型化动作合同" },
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1", role: "正式秘密代理入口" },
      { path: "E:\\PCConfig\\tools\\Invoke-GoogleWorkspaceProvider.ps1", role: "Gmail、Drive 和 Calendar 类型化 dispatch（分发）入口" }
    ],
    verification: [
      "Invoke-SecretBroker.ps1 -Action Status -Json 当前 exit 0、status=pass、security_core_status=pass、product_closure_status=pass",
      "同次 Secret Broker 回执为 0 critical failure、1 optional gap，并明确 plaintext_returned=false、remote_fetch_performed=false",
      "Get-GoogleWorkspaceProviderBinding.ps1 -Json 当前 exit 0、status=configured、services=gmail/drive/calendar、zero_network=true",
      "binding status 明确 credential_state_decrypted=false；因此本页不把 configured 写成 OAuth 或 live API 验收",
      "secret_broker.test.py、secret_authority.test.py 与 secret_device_trust.test.py 覆盖授权、原子回读、恢复和负例",
      "invoke_google_workspace_provider.test.ps1 覆盖 closed action、大小边界、账号/scope 绑定、写入授权和无秘密回执"
    ],
    relation: "本模块为项目和恢复链提供安全凭据使用；CoreRecovery 只引用它的恢复入口，不复制秘密；受保护动作模块复用已登记人类因子，但不能读取 Secret Broker 私有因子状态。"
  },
  {
    slug: "protected-actions",
    shortTitle: "受保护动作",
    title: "C 盘 policy runtime 退役、历史 CoreGoal 与独立机器动作",
    teaser: "旧规则 Publisher、policy consumer、worker 和任务已经退出生产；E rules 独立在 .agents 激活。PCConfig 只保留历史兼容材料，并继续拥有 Secret Broker、BitLocker、P0–P7 与各机器动作自己的 Owner/read-back。",
    status: "protected-policy status=retired；6 个退役任务缺席，CoreGoal 仅 frozen historical compatibility",
    statusTone: "mixed",
    value: "让我明确知道哪些旧链已经退出、哪些历史材料仍保留，以及 E rules、Secret Broker、BitLocker、P0–P7 为什么互不依赖；不会因删除 policy runtime 顺手破坏机器恢复产品。",
    why: "旧 C policy 平台把规则发布、CoreGoal、机器动作和多个独立产品耦合在一起，代码和运行节点过大。退役必须减掉生产读者与执行器，同时保留恢复证据和真正仍被产品消费的 Secret Broker、Password Center、BitLocker 与 P0。",
    example: "退役事务停止 1 个旧 policy process、移除 6 个目标任务并保留 C policy tree、generation 79 和 ledgers；current E rules 另由 .agents release 激活，P0 boot recovery、Password Center 和 BitLocker 没有被修改，也不需要重启。",
    result: "E 盘退役 Owner 固定返回 retired；我能看到 36 个依赖分类、6 个任务缺席、历史材料保留和各独立产品未改变。旧 C 入口当前明确报 global-shim-invalid，但这个历史诊断不会被误写成当前 E 规则失败。旧 policy 不能再创建 goal/step、发布规则或执行机器动作。",
    readerStates: {
      pass: "status=retired、依赖分类、任务缺席和保留产品验收全部通过时，旧 policy 路线保持 fail-closed，其他机器产品继续。",
      problem: "退役任务重新出现、旧 Publisher 可执行、CoreGoal 新 goal/step 可创建，或独立产品被误删时，退役验收失败并由 PCConfig Owner 修复。",
      unavailable: "退役 Registry、任务现场或机器回执不可读时，不恢复旧 runtime，也不猜完成；普通只读调查和独立产品继续按各自证据工作。"
    },
    decisionImpact: [
      "Verified current E release 是规则权威；C 盘第 79 代、Publisher、anchor 和 ledgers 只作历史恢复。",
      "E 盘 PCConfig 退役入口固定 retired/production_activation=false，不能再返回 candidate/active；旧 C 历史入口即使返回 active_integrity_failure，也只属于历史入口自身。",
      "CoreGoal V2 Registry 为 frozen_historical_compatibility，禁止新 goal/step，policy-publish consumer inactive。",
      "6 个旧目标任务必须 absent，系统不得有匹配的 Authority/Protected service 或 policy Python worker。",
      "Secret Broker、Password Center、BitLocker 和 P0–P7 是独立产品，退役不能删除或改变它们。",
      "物理删除 C tree 或彻底卸载历史 CoreGoal 没有发生，未来若需要是另一项明确决定。"
    ],
    problem: "退役不是把状态改成一个字符串。旧任务、worker、service、Publisher、consumer 与所有依赖都要分类和缺席回读，同时保留真正有 consumer 的历史/恢复材料与独立产品。",
    implementation: [
      "registries/protected_policy_retirement.json 是退役结构化事实源；E 盘 PCConfig 的 Get-ProtectedPolicyAuthorityStatus.ps1 返回 retired 摘要。旧 C 历史目录里的同名入口不是当前 Owner。",
      "Test-ProtectedPolicyRetirement 检查 36 个依赖、6 个任务缺席、状态入口、无 App 版本绑定、Secret Broker 保留和 BitLocker 未改变。",
      "机器收敛回执证明旧任务 absent、无匹配 service/worker，P0 boot recovery、Password Center 和 BitLocker 未改。",
      "CoreGoal V2 与 BitLocker containment 使用 retirement override 把旧 policy coupling 冻结为历史，不允许自动 action。",
      "旧 C policy tree、generation 79 和 ledgers 没有物理删除，仍可作为恢复/审计材料。",
      "E rules 的 current/previous、UAC activation 和 Rules 页面由 .agents 拥有，不再由 PCConfig 安装或发布。"
    ],
    flow: [
      "从 E 盘 PCConfig Owner 读取 protected-policy retirement Registry 与 status=retired",
      "核对 36 个 source/machine dependency disposition",
      "确认 6 个退役任务在 Task Scheduler 中 absent",
      "确认无匹配旧 service、worker 或可执行 Publisher 路径",
      "核对 Secret Broker、Password Center、BitLocker、P0–P7 未被改变",
      "保留历史 tree、generation 79 和 ledgers，不恢复生产读者",
      "以后每次漂移检查继续验证退役不反弹"
    ],
    concepts: [
      { term: "Protected policy retirement（规则平台退役）", explanation: "旧 C 盘规则生产读者、Publisher、consumer、任务和 worker 退出，历史材料保留。" },
      { term: "Frozen historical compatibility（冻结历史兼容）", explanation: "数据结构仍可读取旧记录，但禁止创建新 goal/step 或执行旧 consumer。" },
      { term: "Retirement override（退役覆盖）", explanation: "对旧 Registry 历史字段施加现行禁止语义，避免历史 production_enabled 被误执行。" },
      { term: "Independent product（独立产品）", explanation: "Secret Broker、BitLocker、P0 等有自己的 Owner、状态和验收，不由规则退役连带删除。" }
    ],
    boundaries: [
      "不提供通用 shell、任意管理员执行器、第二规则系统、第二队列或后台守护服务",
      "智能体名称、提示词、管理员权限令牌或复制密钥不能继承最高权限身份",
      "紧急授权不覆盖 system/developer/platform，不伪造密码学或外部事实，也不补足缺失 Carrier/因子",
      "活动规则发布、受保护机器动作和 P0 各自拥有执行与账本，CoreGoal 不内嵌它们",
      "source test、registry 状态或 P0 health 不能单独证明两个真实 consumer 的 effect",
      "未提交 source 和 concurrent dirty work 不计入 installed current"
    ],
    failures: [
      { condition: "任一退役任务重新出现", response: "retirement acceptance 失败，停止旧路线并由 PCConfig Owner 删除/禁用后回读。" },
      { condition: "E 盘退役 Owner 返回 active/candidate", response: "视为退役回归，必须恢复固定 retired 输出，不能把 C 链当当前 authority。" },
      { condition: "旧 C 历史入口返回 integrity failure", response: "如实显示旧入口的 global-shim-invalid，但不把它升级成 E rules 或普通任务 blocker，也不尝试恢复旧 Publisher。" },
      { condition: "Secret Broker 或 BitLocker 被退役误伤", response: "回滚对应 PCConfig 变更并恢复独立产品，不恢复旧 policy runtime。" },
      { condition: "物理历史材料缺失", response: "报告恢复证据损失；不能为补材料重新启用 Publisher 或 consumer。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\protected_policy_retirement.json", role: "退役对象、保留对象、状态入口和验收规则" },
      { path: "E:\\PCConfig\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1", role: "固定 retired 状态入口" },
      { path: "E:\\PCConfig\\tools\\Test-ProtectedPolicyRetirement.ps1", role: "依赖、任务缺席、独立产品保留和零 mutation 验收" },
      { path: "E:\\PCConfig\\registries\\core_goal_v2.json", role: "frozen historical compatibility 与 inactive policy consumer" },
      { path: "E:\\PCConfig\\registries\\bitlocker_containment.json", role: "旧 policy coupling 的 effective retirement override" }
    ],
    verification: [
      "E 盘 PCConfig Get-ProtectedPolicyAuthorityStatus 当前返回 retired、production_activation=false、reason=protected_policy_retired、historical_state_preserved=true",
      "旧 C 盘历史 Provider 原入口当前返回 active_integrity_failure / global-shim-invalid；按现行 E 规则合同它不是权威、准入、fallback 或 Owner 证明",
      "Test-ProtectedPolicyRetirement PASS：36 个依赖、6 个退役任务缺席、无 App 版本绑定、Secret Broker 保留、BitLocker 未变、无 mutation",
      "机器收敛回执证明 6 个目标任务 absent、无匹配 service/worker，P0 boot recovery、Password Center 和 BitLocker 未改",
      "PCConfig 当前 PRIVATE main 为 f9245a1；Codex Home 迁移覆盖 39911 个文件、75.13 GB，已通过 ReadyCheck 并等待本人退出。正式 cutover 与新运行时回读尚未发生。"
    ],
    relation: "本模块只说明旧 C policy/CoreGoal coupling 的退役与历史保留；秘密、BitLocker、P0–P7 和 E rules 分别由各自 Owner/模块继续，不因退役相互继承或删除。"
  },
  {
    slug: "protected-data",
    shortTitle: "受保护数据",
    title: "版本换挡、加密保险库与隔离恢复",
    teaser: "让受保护数据产品可以旁路升级、失败回退和用一份完整恢复载体重建，同时诚实区分源码候选、安装态和正式数据迁移。",
    status: "当前第 68 版 normal/LKG 与自然启动已通过；SafeSwitch manifest、v2/Vault 和正式数据仍未闭合",
    statusTone: "problem",
    value: "升级加密数据产品时，用户不会因为一个坏版本、进程崩溃或电脑重启就失去最后可用入口；真正灾难恢复也不依赖全部介质同时在线，只需要一份完整有效 Carrier（恢复载体）和一个有效因子。",
    why: "普通应用升级失败可以重装，但加密数据升级失败可能同时损坏入口、索引、密钥封装和恢复线。必须先证明新版本可读写、可重开、可恢复，再切换；任何 unknown 都要停止写入并保留旧版本。",
    example: "例如要给加密文件应用上线一个支持更快搜索的新版本。P0 先把候选放进不可变 slot（版本槽），运行切换前健康检查，再切到 trial（试运行），并通过 stable selector（稳定版本选择器）做切换后健康检查。任何一步失败都回到 LKG；如果旧版也无法证明健康，则只提供 read-only recovery（只读恢复），绝不继续写正式数据。",
    result: "通过时得到一个 normal selector（正常选择器）、新 LKG 和仍保留的 rollback（回退版）；失败时得到旧 LKG 或明确只读恢复。只有 source（源码）通过时只叫 candidate（候选版本），只有安装时只叫 installed（已安装）；正式数据是否迁移、Carrier 是否可恢复和重启是否在三分钟内通过，都必须另取证。",
    readerStates: {
      pass: "候选版本通过写入、重开、恢复和切换后健康检查时，才成为新的 LKG（最后确认可用版本），同时继续保留独立回退版。",
      problem: "候选健康检查、正式数据迁移或启动恢复失败时回到旧 LKG；若旧版也无法证明健康，则只开放只读恢复并停止正式写入。",
      unavailable: "恢复载体、解密因子、活动选择器或正式数据证据不可得时保持 Unknown（证据不足），不把源码候选、已安装文件或隔离样例写成生产完成。"
    },
    decisionImpact: [
      "P0–P7 严格串行；前一阶段没有用户可用结果、fresh 验收和可恢复检查点时，不启动下一阶段正式 effect。",
      "P0 只负责版本 selector、health、LKG 和 rollback，不拥有因子、目标授权、保险库业务或 Carrier。",
      "加密保险库用一套 core engine、一个 GUI 和一个 Carrier 格式，不复制第二套 index/crypto。",
      "一份完整 current Carrier 加任一有效因子才可恢复；GitHub 只能重建程序和规则，不能恢复密文数据。",
      "P5 正式迁移只允许 copy-encrypt-hash-readback（复制、加密、哈希、回读），旧明文先只读保留。",
      "源码、fixture、protected install permitted（允许进入受保护安装）都不等于真实数据 action 已获准或发生。"
    ],
    problem: "受保护数据同时依赖版本、selector、密钥因子、加密对象、索引、GUI、Carrier 和恢复入口。旧实现曾把同一 effect 在多个 wrapper（包装层）重复编排，增加了状态分叉和安装放大；当前 vNext 目标是用四个清晰角色收敛。",
    implementation: [
      "P0 v1 在固定 ProgramData root 使用 immutable slot、一个 control.json、journal/receipt 和公开零秘密 status；selector 以 revision CAS 和同卷原子替换更新。",
      "control 只有 normal、trial、read_only_recovery 三种 mode，绑定 active、LKG、rollback 和 manifest hash；每次 launch/health/recovery 都重新核验完整闭包。",
      "当前 public status revision 68、mode=normal、trusted_control=true、active=LKG、rollback distinct；recovery_status=boot_deadline_recovery。",
      "较早的 2026-08-27 与 2026-08-28 启动失败回执继续作为历史保留；当前最新自然启动已由同一 AtStartup SYSTEM task 全新运行，回读第 68 版 normal、active=LKG、trusted=true，用时 46.984 秒并返回 deadline_met=true。",
      "正式 boot-deadline-recovery operation 先把 current 恢复为第 68 版 normal、active=LKG；随后新的自然启动闭合 boot acceptance，历史失败回执不再代表当前启动状态。",
      "P0 vNext RecoveryKernel 设计旁路安装到 v2 root，但继续使用唯一 v1 state/slots；2026-08-29 v2 public status root absent（安装根不存在），所以仍是 source candidate（源码候选版本）。",
      "vNext 设计中的 P1 AuthorityVault 将提供 Passkey、TOTP、Recovery、Account 四类同接口因子，成功只交付进程内 opaque session（不透明会话）；当前 source 不能冒充安装态。",
      "P3/P4 Vault V2 使用 AES-GCM（带完整性校验的分块加密）、单一对象/索引引擎、opaque lease（不透明租约）和恢复 Bridge；读取流一次最多保留 1 MiB 明文，EOF（读到结尾）后才确认完整 hash。",
      "Vault V2 Registry 当前 lifecycle=protected_install_effect_source_ready，并要求 production_state_source=installer-inspect-readback-only；这不是 installed current。",
      "P5–P7 Registry 当前 status=fixture_replica_acceptance_only、formal_data_action_authorized=false、formal_data_paths_touched=false，明确没有正式数据迁移。",
      "vNext 四角色是 RecoveryKernel、AuthorityVault、GoalJournal 和 VaultApp；跨角色只保留因子→opaque session、goal step→产品命令/回执、Carrier→隔离恢复回执。"
    ],
    flow: [
      "构建闭合 candidate manifest（候选版本清单）和不可变 payload（版本载荷）",
      "在旁路 slot 完整写入、flush、hash read-back",
      "运行 pre health 的写入、关闭、重开、读取与 preimage 恢复",
      "原子写 trial selector 并从 stable selector 运行 post health",
      "成功写 normal、新 LKG 并保留旧 rollback；失败恢复旧 LKG",
      "需要灾难恢复时用一份 Carrier 加一个因子进入隔离目录",
      "验证核心数据库、索引、元数据和代表性对象",
      "只有全部正式证据成立后才切入口、观察并讨论旧路径退役"
    ],
    concepts: [
      { term: "P0–P7（八阶段恢复路线）", explanation: "从安全换挡、因子、目标授权、保险库、单 Carrier 恢复，到正式迁移、新设备恢复和旧路径退役的严格顺序。" },
      { term: "Selector（版本选择器）", explanation: "唯一 control 状态，决定 active、LKG、rollback 和当前 mode；不能分散到多个权威指针。" },
      { term: "LKG（最后确认可用版本）", explanation: "经过 health 证明、切换失败时可恢复的版本；active 不自动等于 LKG。" },
      { term: "Read-only recovery（只读恢复）", explanation: "任何可写版本都无法证明时的安全模式，只说明缺失条件和可验证候选，不恢复 normal 写入。" },
      { term: "Recovery Carrier（恢复载体）", explanation: "包含完整 current 密文、manifest、身份和 epoch 的独立恢复集；盘符或介质名称本身不是身份。" },
      { term: "Opaque lease（不透明租约）", explanation: "授权进程短时使用保险库能力，但不暴露主密钥或可复制的明文凭据。" },
      { term: "Fixture-only（仅隔离样例）", explanation: "只证明测试目录和合成数据路径，不能宣传为正式安装、真实因子、真实 Carrier 或正式数据恢复。" }
    ],
    boundaries: [
      "P0 不修改活动规则、Publisher、正式数据、主密钥或因子",
      "保险库 source 不接触正式数据，正式迁移前旧明文保持原 Owner 和只读回退",
      "Carrier 撤销登记不等于自动擦除介质字节，最后恢复路径不得无替代删除",
      "未做真实 reboot receipt 时不宣称三分钟启动恢复验收完成",
      "物理断电未实测时只称 durable-write 强制终止矩阵，不冒充物理断电测试",
      "P5–P7 当前禁止正式 data action、删除、迁移、备份写入、恢复或外部交付"
    ],
    failures: [
      { condition: "当前 P0 selector", response: "public status 显示 normal、trusted、active=LKG 且有独立 rollback，说明当前选择器有可用证据。" },
      { condition: "当前 P0 boot task", response: "LastTaskResult=4 已证明在线恢复并降为 warning；它仍不替代下一次自然 task/reboot deadline 证据。" },
      { condition: "候选版本切换前后健康检查失败或超时", response: "恢复旧 LKG；旧 LKG 也不能证明时写 read_only_recovery（只读恢复），并拒绝业务写入。" },
      { condition: "control current 损坏", response: "只接受完整验证的 previous preimage；不能靠猜测选择 newest slot。" },
      { condition: "v2 RecoveryKernel root absent（安装根不存在）", response: "只称 source candidate（源码候选版本），不称 side-by-side installed（并行版本已安装）、fresh read-back（全新回读）或 reboot verified（重启已验证）。" },
      { condition: "P0 source Inspector 返回 install_manifest_invalid", response: "明确显示当前源码检查器无法验证旧安装 manifest；保留 selector/LKG 可用事实，不把检查器 BLOCK 夸大成数据损坏，也不自动重装。" },
      { condition: "Vault V2 source/fixture 通过", response: "仍不等于 protected install、真实因子、Carrier、重启或故障恢复 E2E。" },
      { condition: "P5–P7 正式授权为 false", response: "保持 fixture-only；formal_data_paths_touched=false，禁止以设计或测试推动真实数据迁移。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-product-roadmap.md", role: "P0–P7 冻结产品结果、顺序和 vNext 收敛" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-safe-switch.md", role: "P0 selector、health、启动恢复和验收合同" },
      { path: "E:\\PCConfig\\registries\\protected_data_safe_switch.json", role: "P0 source、root、task、预算和 closed mode Registry" },
      { path: "C:\\ProgramData\\PCConfig\\ProtectedDataSafeSwitch\\v1\\public\\status.json", role: "P0 当前零秘密 selector 状态" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-vault-v2-engine.md", role: "Vault V2 engine、对象、索引、lease 与 consumer 边界" },
      { path: "E:\\PCConfig\\registries\\protected_data_vault_v2_formal.json", role: "Vault V2 source/install lifecycle Registry" },
      { path: "E:\\PCConfig\\registries\\protected_data_p5_p7_delivery_v3.json", role: "P5–P7 fixture、正式授权和真实路径触碰状态" }
    ],
    verification: [
      "P0 public status 于 2026-08-29 可读取 schema pcconfig.protected-data-safe-switch.public-status.v1、mode=normal、revision=68、trusted_control=true",
      "当前状态回读 active_equals_lkg=true、rollback_distinct=true；最新自然启动为第 68 版 normal/LKG、46.984 秒、deadline_met=true",
      "Test-PCConfigDrift 当前把 P0 boot task LastTaskResult=4 分类为 historical_failure_recovered_online；tasks.runtime_health 为 warning/evidence pass，不再 block",
      "boot-latest.json 最新回读为第 68 版 normal/LKG、46984 ms、deadline_met=true；较早的 57656 ms 与 196468 ms 失败回执单独保留为历史",
      "C:\\ProgramData\\PCConfig\\ProtectedDataSafeSwitch\\v2\\public\\status.json 当前不存在，明确阻止 installed-v2 声明",
      "Install-ProtectedDataSafeSwitch.ps1 -Mode Inspect 当前返回 protected_data_safe_switch_install_manifest_invalid；旧安装文件仍与旧 manifest 一致，但当前 source Registry 的 release/字段合同已前进",
      "Vault V2 Registry 只允许 installer inspect read-back 作为 production state source；source acceptance 不能替代",
      "P5–P7 Registry 当前 formal_data_action_authorized=false、formal_data_paths_touched=false",
      "protected_data_safe_switch.test.py、p0_boot_deadline_recovery.test.ps1 和 VaultV2Acceptance 分别覆盖 selector/crash、deadline 窄恢复和加密对象/索引负例"
    ],
    relation: "受保护动作模块提供目标与单步 capability；本模块拥有版本、保险库和 Carrier 的真实 effect 与 read-back；CoreRecovery 只负责普通恢复，不能替代这条加密恢复链。"
  }
];

export const project = pcconfigProject;
export const modules = pcconfigModules;
