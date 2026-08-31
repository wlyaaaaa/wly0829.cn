import { createProjectSnapshot } from "./project-snapshot.js";

const pcconfigSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T11:43:18Z",
  label: "机器配置、恢复任务与秘密恢复闭合；Codex Home 已就绪并等待本人退出切换",
  boundary: "机器配置、核心恢复与恢复介质的现行静态证据已闭合；H 冷备、新机端到端恢复、WEPE 内部盘/网络 smoke（冒烟验证）、BIOS 保存后重启回读及 Codex Home 正式切换仍须分别验收",
  metrics: [
    { label: "配置地图", value: "v6 · 15 项目 · 157 键" },
    { label: "恢复任务", value: "10 Ready · 0 失败" },
    { label: "秘密恢复", value: "10/10 三路一致" },
    { label: "Codex 迁移", value: "75.13 GB · 已就绪" }
  ],
  facts: [
    { label: "配置地图", value: "源仓库 PRIVATE（私有）main 当前提交为 f9245a1；配置地图覆盖 44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项和 87 个任务。" },
    { label: "开发存储", value: "开发存储回读 V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过。" },
    { label: "恢复任务", value: "10 个核心恢复任务均为 Ready、最近结果 0，CoreRecovery 3/3 验收通过；任务就绪和业务恢复结果仍按各自责任源分层。" },
    { label: "秘密恢复", value: "Secret 恢复 10/10 项在三条路线一致；G 路 20 份、PRIVATE 路 65 份快照，覆盖 33 天。公开回执不返回秘密原文。" },
    { label: "稳定机器投影", value: "稳定机器投影当前为 v6，登记 15 个项目路径关系；开发存储有 17 个恢复锚点，C 盘用户配置 inventory（清单）有 26 项，三者都是恢复导航而不是应用可用性的替代证明。", hero: false },
    { label: "恢复介质", value: "恢复介质 Registry 当前 16 项资产通过校验，0 error、0 warning；BIOS/UEFI 文字基线在 E 源、E 镜像和 G 热备三份同 SHA-256，F 有救急速查，文档引用的 20 个照片路径均存在且本次未读取照片内容。", hero: false },
    { label: "Codex Home 迁移", value: "Codex Home 迁移覆盖 39911 个文件、75.13 GB；最终差异为 565 个文件 / 6.74 GiB，ReadyCheck 用时 58 秒，预计离线窗口 4:37–7:56。当前已就绪并等待本人退出后切换。" },
    { label: "凭据中心", value: "Password Center 独立安装态为 current：9/9 文件与锚点一致，retired_c_policy_used=false。银行卡三字段可原子保存与盲填，但真实支付页提交始终由用户决定。" },
    { label: "受保护数据", value: "P0 current 为 revision 68、normal、active=LKG、trusted=true、recovery_status=null；最新自然启动为 46984 ms、deadline_met=true，低于 180 秒门。", hero: false },
    { label: "运行健康", value: "fresh Drift 返回 runtime_health=pass、failure_last_result_count=0、recovered_historical_count=0；旧启动失败不再进入当前任务健康计数。", hero: false }
  ],
  gaps: [
    "Google Password Manager 没有稳定逐条 API 或 changefeed；当前只支持官方完整导出快照，reconciliation 状态仍为 missing，不能称实时双向同步。",
    "银行卡桥已安装并通过结构回归，本次没有真实支付页面的用户可见 E2E；不能声称真实付款表单已经验收。",
    "PRIVATE Git 恢复路径已安装且状态就绪，本次没有执行干净新机恢复演练；同机重装、换机、系统盘故障和仅 PE 四条路径因此仍需在真实事件中分别完成端到端回读。",
    "最近一次 CoreRecovery 冷备因 H_unavailable 跳过，没有当前 Codex 对话 H closure；恢复后在新系统重建 Hot/Cold 并形成新的 G/H 回执也尚未发生。",
    "Codex Home 当前已就绪但仍等待本人退出；正式切换、新运行时回读和回滚副本退出条件尚未发生。",
    "SafeSwitch manifest 当前 invalid；P0 revision 68 的在线与自然启动证据不能替代该 manifest 缺口的后置修复和回读。",
    "Workspace 只完成零网络绑定检查，尚未证明远端 OAuth（账号授权）和具体动作本次可用。",
    "P0 v2 尚无安装根和自然重启证据，只能称源码候选。",
    "Vault V2 当前只到 protected_install_effect_source_ready（受保护安装动作源码已准备），没有 installer read-back（安装器回读），不能称已安装。",
    "P5–P7 仍是隔离样例；正式数据动作未授权，正式数据路径也没有被触碰。",
    "Recovery kit 的 BIOS/UEFI 核心设置记录是 present_verified（材料存在且指纹已核对），CPU/内存生效语义来自 user_confirmed（用户确认）；它不等于完整原生 Profile，也没有证明保存设置后的自然重启。WEPE 隐藏分区是 present_observed（现场观察到），只能说明能进入 PE；内部盘识别与网络 smoke 尚未验证。"
  ]
});

export const pcconfigProject = {
  order: 2,
  slug: "pcconfig",
  title: "PCConfig",
  route: "/projects/pcconfig",
  searchAliases: ["PCConfig能管理哪些机器事实", "PCConfig怎样换机重装", "PCConfig有哪些受保护能力", "PCConfig如何恢复本机配置"],
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "主工作站配置可用；副驾驶笔记本已登记，现场状态待在该机回读",
  cardStatusTone: "pass",
  ...pcconfigSnapshot,
  repositoryNote: "源代码位于 PRIVATE（私有）GitHub（代码托管平台）仓库；本页完整公开产品思想、机器配置结构、普通技术事实、入口、失败和验证，只排除可复用凭据以及经活动全局分级确认需要保留的 L3+ 具体载荷。",
  summary: "PCConfig 是 Windows（微软操作系统）设备的配置地图和恢复中心。它既管理 WLY 台式主工作站的磁盘、运行时、任务、备份、重大机器动作和明确选中文件的授权加密，也登记一台真实副驾驶笔记本的远控、轻量开发、独立灾备和故障接管边界。我可以直接问“为什么这个任务没启动”“把这些文件加密并确认可恢复”“离开主机时笔记本能做什么”或“台式机坏了怎样继续工作”。",
  why: "机器配置不仅散落在文件、环境变量、任务、服务和安装目录里，还会随主机身份改变。同一个 V 盘、任务或登录入口在台式机与笔记本上可能完全不同；全盘同步会复制错误驱动、登录态和故障，只靠 Git（版本控制）又漏掉普通文件、设备服务和恢复介质。需要保护的普通文件也不能被当作凭据解析、塞进 Vault（普通加密保险库）或在中断后从头重做。PCConfig 用主机限定事实、选择性恢复、独立授权文件域和逐层回读把这些能力接成可理解、可恢复但不互相污染的系统。",
  plainExample: "例如台式机突然无法开机。我可以先用副驾驶笔记本继续远控以外的本地 Git、文档和轻量开发；若原 NVMe 完好，再把它装进已验收硬盘盒，只读识别原 E/V 工作区并继续必要项目。PCConfig 会明确哪些来自 Git、哪些来自原盘、哪些账号要重新登录、哪些重型能力不能继承，以及修好台式机后怎样安全交回。",
  result: "我最终会得到一份按设备和证据分层的可执行结果：当前是哪台主机、它承担什么角色、路径和端口真正属于谁、明确选择的文件怎样形成可续作和可校验的授权包、日常与离线能力有哪些、变更如何回退、重装/丢盘/主机故障从哪条来源恢复、哪些只完成源码或离线测试、哪些仍须在真实设备、重启或应用中验收。",
  readerStates: {
    pass: "需要的机器事实、配置责任源和恢复入口都能现场读取时，按依赖顺序执行，并分别回读文件、运行时、计划任务、账号入口和用户可见结果。",
    problem: "发现路径漂移、任务失败、版本不一致或恢复证据不完整时，只暂停受影响的一层，保留变更前状态并列出责任源、失败位置和下一步恢复入口。",
    unavailable: "磁盘、Provider（现场读取器）或受保护入口不可用时，把对应结论标为 Unknown（证据不足），不猜默认路径、不整包覆盖，也不把部分复制或安装称为整机恢复。"
  },
  productPrinciples: [
    { title: "先读现场，再改变机器", detail: "登记表负责导航，不能冒充当前状态；真正要改什么，先由 Windows、安装根、任务或项目配置现场证明。" },
    { title: "先确认主机，再解释配置", detail: "台式机和副驾驶笔记本各有自己的路径、任务、端口和规则入口；host mismatch 只表示不适用，不能把另一台机器的账本套过来。" },
    { title: "项目仍拥有自己的配置", detail: "PCConfig 管机器路径、端口、任务、运行时和恢复关系，不把项目业务配置收走形成第二份真相。" },
    { title: "每次变更都能退回", detail: "目标、变更前状态、影响对象、回滚入口和完成后的现场回读必须成对存在。" },
    { title: "恢复按依赖分层进行", detail: "先恢复磁盘、网络和基础运行时，再恢复项目、任务、启动项和私密配置；不把整包覆盖当快捷方式。" },
    { title: "秘密可以被使用，但不必被看见", detail: "凭据通过引用和受保护调用完成任务，不进入聊天、终端、命令行或普通文件。" },
    { title: "文件只按本次明确选择处理", detail: "授权文件域把文件当作不透明字节，只递归用户点名的目录；不扫描整盘、不理解正文、不自动删除、上传、备份或并入凭据库。" },
    { title: "每一层单独验收", detail: "源码、安装、运行、恢复、自然重启和用户可用分别回读，不能用文件存在或任务就绪代替真实结果。" },
    { title: "未知不是失败，也不是通过", detail: "不可读、不存在、执行失败和证据不足分别说明，只暂停受影响的一层。" },
    { title: "按需检查，不建设第二套操作系统", detail: "只在现实任务需要时读取机器事实，不新增全机后台扫描、自动更新或常驻治理层。" }
  ],
  responsibilities: [
    "维护本机路径、磁盘、目录用途、固定端口、运行时和本地数据源等机器事实",
    "维护 Registry（结构化登记表）、现场 Provider、稳定投影、漂移检查和验收入口",
    "维护 Windows 计划任务、启动项、受管软件、快捷方式和恢复顺序的机器配置",
    "维护主工作站与副驾驶笔记本的设备角色、主机限定健康入口、双机网络边界和故障接管路线",
    "维护迁移门禁、核心恢复、热备与冷备衔接、恢复介质和回滚边界",
    "提供 SecretRef（秘密引用标识）、固定账号 Provider 和零明文的秘密使用入口",
    "为用户明确选择的文件或目录提供独立的计划、分块加密、校验、续作和无覆盖恢复入口，并始终保留来源",
    "承载本机受保护重大动作、长期目标授权、版本换挡和受保护数据恢复的机器侧运行边界"
  ],
  exclusions: [
    "不拥有具体项目的业务语义、源码设计、启动方式和项目验收；这些继续由项目自己负责",
    "不拥有 Git（版本控制）仓库身份、可见性、远端、默认分支和发布事实；这些由 Git 控制面负责",
    "不拥有跨项目智能体行为、能力路由和活动规则正文；这些由规则控制面负责",
    "不把明文密码、令牌、私钥或恢复码写入 Registry、聊天、日志或普通文件；秘密值留在受保护存储中，并只按精确引用盲用或经用户明确验证后受控显示",
    "不把授权文件正文当作凭据发现源，不把授权文件域与 Password Center 凭据、SecretRef、Key/Vault 或 P0–P7 的密钥、数据根、会话和恢复流程合并",
    "不把 Registry、测试、安装或任务存在单独冒充为整机恢复完成",
    "不把两台电脑做成后台全盘同步，不复制驱动、任务、AppData、登录态或秘密，也不把临时笔记本观察写回主工作站事实",
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
    { term: "Authorization file bundle（授权文件包）", meaning: "只包含用户明确选择文件的密文对象、加密索引、恢复状态和无正文回执；来源文件默认保留。" },
    { term: "DPAPI（Windows 数据保护接口）", meaning: "把本地敏感材料绑定到指定 Windows 身份的系统加密能力。" },
    { term: "Google Workspace Provider（谷歌办公服务读取器）", meaning: "把一个固定账号的邮件、云盘和日历能力收敛成类型化动作的本机入口。" },
    { term: "AuthorityHost（旧 C 盘规则权威服务）", meaning: "第 79 代旧链曾用于验证规则、签名、账本和执行 Adapter；该 C 盘规则链已经决定退役，不再作为新规则的当前权威。" },
    { term: "CoreGoal（长期目标授权）", meaning: "一次可靠人类确认冻结目标；同一目标下的现实步骤再使用短时、单次、不可重放的能力。" },
    { term: "LKG（最后确认可用版本）", meaning: "Last Known Good 的缩写；版本切换失败时可回到的最后一个已证明健康版本。" },
    { term: "Recovery Carrier（恢复载体）", meaning: "保存一份完整加密恢复集的已登记介质；只有载体或只有因子都不足以恢复原文。" },
    { term: "E2E（端到端验证）", meaning: "真实输入从用户入口经过完整链路，最终得到可见且可回读的结果。" },
    { term: "Host-scoped（主机限定）", meaning: "一份账本或 Provider 只有在实时机器身份满足条件时才解释现场；在其他电脑上只能作为设计和恢复导航。" },
    { term: "Recovery capsule（恢复胶囊）", meaning: "副驾驶笔记本的目标状态、窄用户文件、世代闭合和恢复入口；它防止空白新机覆盖旧来源，不是整机镜像。" }
  ],
  currentState: {
    observedAt: "2026-08-31T22:48:54Z",
    label: "主工作站配置与恢复可读；副驾驶笔记本产品已登记、现场状态待目标机回读",
    facts: [
      "源仓库 PRIVATE（私有）main 与 origin/main 当前同为 d4480abc17574177b91e52b0aff9aebd30583f58，worktree clean；配置地图覆盖 44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项和 87 个任务。",
      "开发存储回读 V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过。",
      "10 个核心恢复任务均为 Ready、最近结果 0，CoreRecovery 3/3 验收通过；任务就绪和业务恢复结果仍按各自责任源分层。",
      "Secret 恢复 10/10 项在三条路线一致；G 路 20 份、PRIVATE 路 65 份快照，覆盖 33 天。公开回执不返回秘密原文。",
      "稳定机器投影当前为 v6，登记 15 个项目路径关系；开发存储有 17 个恢复锚点，C 盘用户配置 inventory（清单）有 26 项，三者都是恢复导航而不是应用可用性的替代证明。",
      "恢复介质 Registry 当前 16 项资产通过校验，0 error、0 warning；BIOS/UEFI 文字基线在 E 源、E 镜像和 G 热备三份同 SHA-256，F 有救急速查，文档引用的 20 个照片路径均存在且本次未读取照片内容。",
      "PCConfig 现登记两种电脑角色：WLY 主工作站与 1 台副驾驶/备用笔记本 LAPTOP-E48N0DRJ；后者有独立 host identity 门、健康 Provider、远控/网络基线、恢复任务、writer 状态机和 USB 世代设计。",
      "2026-08-31 从当前 WLY 调副驾驶健康入口返回 schema pcconfig.secondary-laptop-health.v1、status=not_applicable、reason=host_mismatch；这证明主机门正确停止，不证明笔记本服务或恢复状态。",
      "P0 current 为 revision 68、normal、active=LKG、trusted=true、recovery_status=null；最新自然启动为 46984 ms、deadline_met=true，低于 180 秒门。",
      "2026-08-31T17:49:27Z fresh Drift 返回 6 pass、1 warn、0 block，证据为 6 pass、0 fail、1 unknown；唯一 attention 是 tasks.live_match 的 complete_visibility=false，runtime_health 仍 pass 且 failure_last_result_count=0。",
      "AI 工作台当前唯一运行根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 只是指向它的兼容 junction，不存在第二份活动 Codex Home。",
      "Password Center 独立安装态为 current：9/9 文件与锚点一致，retired_c_policy_used=false。银行卡三字段可原子保存与盲填，但真实支付页提交始终由用户决定。",
      "授权文件实现已包含在上述 9/9 current 安装态中：authorization_file_broker.py 的 source/installed SHA-256 同为 5eb7b3e59099ccde45804824d3edef03ced8abfab3ff8a3cbc1252db65123854，manifest anchor 匹配且 Inspect 零写入；独立 6/6 合成测试通过。"
    ],
    gaps: [
      "Google Password Manager 没有稳定逐条 API 或 changefeed；当前只支持官方完整导出快照，reconciliation 状态仍为 missing，不能称实时双向同步。",
      "银行卡桥已安装并通过结构回归，本次没有真实支付页面的用户可见 E2E；不能声称真实付款表单已经验收。",
      "授权文件本次只验证源码、独立测试和安装一致性，没有调用最高权限入口处理真实选择文件；当前 runtime（运行链）与自然用户 E2E 仍未在本次快照复核，不能由 6/6 合成测试或 9/9 安装态替代。正式入口目前也没有独立 preview/dry-run（预览/只预演）动作，只能把显式 SelectedPath/OutputPath 作为输入后在执行链内部生成有界计划。",
      "PRIVATE Git 恢复路径已安装且状态就绪，本次没有执行干净新机恢复演练；同机重装、换机、系统盘故障和仅 PE 四条路径因此仍需在真实事件中分别完成端到端回读。",
      "最近一次 CoreRecovery 冷备因 H_unavailable 跳过，没有当前 Codex 对话 H closure；恢复后在新系统重建 Hot/Cold 并形成新的 G/H 回执也尚未发生。",
      "本轮只读回读确认 C 兼容 junction 精确指向 E 唯一根；没有为了网页重新演练停写增量、原子 cutover（切换）或 rollback（回滚），因此本页证明当前落点，不把历史迁移流程冒充本轮 E2E。",
      "SafeSwitch manifest 当前 invalid；P0 revision 68 的在线与自然启动证据不能替代该 manifest 缺口的后置修复和回读。",
      "Workspace 只完成零网络绑定检查，尚未证明远端 OAuth（账号授权）和具体动作本次可用。",
      "P0 v2 尚无安装根和自然重启证据，只能称源码候选。",
      "Vault V2 当前只到 protected_install_effect_source_ready（受保护安装动作源码已准备），没有 installer read-back（安装器回读），不能称已安装。",
      "P5–P7 仍是隔离样例；正式数据动作未授权，正式数据路径也没有被触碰。",
      "Recovery kit 的 BIOS/UEFI 核心设置记录是 present_verified（材料存在且指纹已核对），CPU/内存生效语义来自 user_confirmed（用户确认）；它不等于完整原生 Profile，也没有证明保存设置后的自然重启。WEPE 隐藏分区是 present_observed（现场观察到），只能说明能进入 PE；内部盘识别与网络 smoke 尚未验证。",
      "副驾驶笔记本当前 ToDesk/Tailscale/FlyingBird、防火墙、工具、WSL/Docker、BitLocker/WinRE、恢复任务、本地/U 盘世代和项目盘均未在目标机现场回读，保持 Unknown。",
      "原台式机 GM7000 通过 NVMe 硬盘盒在笔记本识盘、持续读取、跨机 BitLocker 解锁、ReFS Dev Drive VHDX 挂载与重型能力检查尚未做真实端到端演练。",
      "副驾驶本地项目 V:\\Projects\\ai-engineering-lab 无远端且不在恢复胶囊；未建立 PRIVATE Git 或加密导出前仍是单机故障风险。"
    ]
  },
  operatingFlow: [
    { title: "先确认当前是哪台设备", detail: "读取实时计算机名与用户根，区分 WLY 主工作站、副驾驶笔记本和临时 NVMe 接管；主机不匹配就返回不适用，不加载另一台机器的现场路径。" },
    { title: "先确认问题属于机器层", detail: "只有当前决定依赖本机路径、端口、运行时、任务、启动、备份或恢复事实时才进入 PCConfig；项目业务问题继续回到项目本身。" },
    { title: "定位唯一 Owner 和真实配置源", detail: "用最小 Registry 找到对应文件、任务、服务或 Provider；旧报告和人类指南只负责导航。" },
    { title: "现场观察并分离证据状态", detail: "读取 Provider、Windows 现场和安装根，把明确不匹配写成 fail，把无法读取写成 unknown，不用缓存补齐。" },
    { title: "先生成有回滚的变更计划", detail: "路径迁移、任务注册、软件更新或受保护动作先固定 target、preimage、依赖、回滚和验证命令；高风险写入走正式授权入口。" },
    { title: "由真实 Owner 执行", detail: "项目配置先由项目改，软件由组件 Adapter 更新，任务由注册事务变更，秘密只通过盲填或盲注入使用；明确选择的文件只交给独立授权文件域，不进入凭据发现或普通 Vault。" },
    { title: "逐层 Read-back", detail: "分别核对源码、测试、安装、任务或服务运行、恢复可用性、重启结果和用户可见结果；上一层成功不能替下一层。" },
    { title: "保留缺口并给出恢复入口", detail: "通过就说明证据范围；发现问题就保留原状或回滚；无法运行就给出精确 unknown、影响和下一次取证入口。" }
  ],
  components: [
    { name: "机器事实 Registry", responsibility: "登记磁盘、路径、配置键、任务、运行时、启动、恢复和受保护产品的稳定结构。", implementation: "当前仓库有 44 份 Registry；动态值仍由匹配 Provider 或 Windows 现场裁定。" },
    { name: "现场 Provider", responsibility: "以闭合 schema（数据结构合同）读取运行时、磁盘、启动项、端口、任务和安装态。", implementation: "主要使用 PowerShell（Windows 自动化终端）入口，输出有界 JSON，不返回秘密值或原始任务参数。" },
    { name: "稳定机器投影", responsibility: "保存长期有意义的硬件、系统、磁盘与关键运行时薄快照。", implementation: "规范 SHA-256（文件指纹）、版本链、原子替换和 no-change（无变化不重写）语义；当前 Registry 为版本 6。" },
    { name: "项目配置快照", responsibility: "为路径、端口、模型和本地数据源提供跨项目导航。", implementation: "157 个登记键使用 inspect、期望哈希、dry-run（只预演）、apply（正式应用）和 mark-stale（标记陈旧）事务。" },
    { name: "任务与启动链", responsibility: "维护计划任务恢复投影、用途目录、启动快照和无窗口父进程合同。", implementation: "Task Scheduler 是运行权威；任务 XML、原始 Action 和敏感参数不进入公开回执。" },
    { name: "受管软件路由", responsibility: "把组件别名解析到自己的状态与更新 Adapter。", implementation: "当前目录登记 11 个组件；behind 才更新，equal 不重装，ahead 不降级，unknown 直接停止。" },
    { name: "CoreRecovery（核心恢复）", responsibility: "组织重装或换机时的恢复顺序、热备/冷备衔接、任务重建和选择性验收。", implementation: "Inspect 零正文读取；Hot 原子发布小型上下文；Cold 只消费已验证 Hot，不用镜像删除。" },
    { name: "副驾驶笔记本健康与接管", responsibility: "维护备用笔记本的角色、远控、Tailscale、防火墙、运行时和台式机故障接管边界。", implementation: "唯一健康 Provider 只在 LAPTOP-E48N0DRJ 上读取现场；WLY 调用固定返回 host_mismatch，不建立第二份主工作站机器事实。" },
    { name: "副驾驶恢复胶囊", responsibility: "让笔记本重装、换机或丢盘后从独立世代恢复，同时防止空白新机覆盖旧数据。", implementation: "ProgramData 受保护任务、三态 writer 门、7 天周期、2 世代、本地 rollback 与加密 USB 分层；用户文件只覆盖 Desktop/Documents/Downloads。" },
    { name: "Secret Broker（秘密代理）", responsibility: "集中管理秘密的发现、盲用、恢复集和设备信任，不把明文交给调用者。", implementation: "运行库在仓库外加密保存；公开 Registry 只保存 SecretRef、策略和无秘密入口。" },
    { name: "Password Center（密码中心）", responsibility: "让用户查找、查看、导入、盲填和恢复凭据，同时把真实秘密留在受保护运行库。", implementation: "独立于退役 C Policy；银行卡三字段原子保存，查看窗口白底纯绿、可逐字段复制，剪贴板历史与云同步关闭并在 60 秒或关窗后按值清理。" },
    { name: "Authorization File Broker（授权文件代理）", responsibility: "把用户明确选择的文件或目录计划成可续作、可校验、可无覆盖恢复的加密包。", implementation: "独立随机域根、包密钥和逐文件密钥；AES-256-GCM 分块对象、加密 state/index、原子输出与无正文 receipt（回执）。不新增服务、数据库或后台任务。" },
    { name: "Browser Bridge（浏览器桥）", responsibility: "把网站登录和银行卡填充限定到用户当前确认的精确网页目标。", implementation: "1.4.0 launcher-verified；AgentCardFill 只对唯一 HTTPS 支付表单使用一次性能力，同时填入卡号、有效期和 CVV，不提交页面。" },
    { name: "Codex 恢复与迁移", responsibility: "把对话恢复点和 Codex Home 迁移分别做成内容可验证、可以回退的事务。", implementation: "对话备份使用 VSS、内容寻址、逐对象 SHA-256 与 pointer-last；Home 迁移以写入退出后的最终增量、ACL/链接清单、原子切换、C 兼容联接和回滚完成。当前 E 是唯一根，C 仅为 junction。" },
    { name: "固定 Google Workspace Provider", responsibility: "通过一个固定账号绑定提供邮件、云盘和日历的类型化动作。", implementation: "凭据用 DPAPI 保存；入口没有通用网址、方法或请求体透传，状态检查可做到 zero-network（零网络）。" },
    { name: "Protected-policy retirement", responsibility: "证明旧 C 盘规则运行面、Publisher consumer、worker 与任务已经退役，同时保留历史恢复材料和独立产品。", implementation: "Retirement Registry、固定 retired 状态入口、36 依赖分类、6 任务缺席和机器收敛回执。" },
    { name: "受保护数据连续性", responsibility: "提供版本换挡、最高权限因子、加密保险库、恢复载体和隔离恢复设计。", implementation: "P0–P7（八个严格串行阶段）各有独立完成证据；源码、安装、真实数据迁移和重启验收不能互相冒充。" },
    { name: "漂移与验收", responsibility: "把策略结论和证据结论分开，让失败与 unknown 可定位。", implementation: "稳定 check id、bounded output（有界输出）和按 area/check 精确选择；验证器不会自动修复业务 Owner。" }
  ],
  usageExamples: [
    { moduleSlug: "machine-facts", ask: "我要把一个本地服务换到固定端口。", effect: "先检查动态端口范围、系统排除段、现有监听和登记冲突；通过后立即绑定并回到项目真实配置源验证，不把预检当成预留。" },
    { moduleSlug: "machine-facts", ask: "这个项目准备从 E 盘搬到 V 盘。", effect: "先确认仓库状态、路径消费者、计划任务、快捷方式、回滚和目标盘健康；复制验证后再切引用，不把移动和永久删除混在一起。" },
    { moduleSlug: "secondary-laptop", ask: "PCConfig 里登记了哪些电脑，它们分别做什么？", effect: "先按实时主机身份区分 WLY 主工作站与唯一副驾驶笔记本；只展示各自职责、稳定入口和未知，不把一台机器的盘符、任务或规则套到另一台。" },
    { moduleSlug: "runtime-startup", ask: "把本机已登记的开发工具安全升级。", effect: "先由组件 Adapter 读取 current/target/relation；只有 behind 才备份、精确更新、等待和回读，unknown 或 channel mismatch（通道不匹配）都停止。" },
    { moduleSlug: "runtime-startup", ask: "为什么某个计划任务没有按预期工作？", effect: "比较 Scheduler 现场、稳定任务签名、LastTaskResult（最近运行结果）和 Owner 回执；不输出完整 Action 或 XML，也不凭任务存在认定业务成功。" },
    { moduleSlug: "runtime-startup", ask: "本地模型、OCR 和语音任务会不会一起抢显卡？", effect: "先从 LocalGpuBroker 读取 lease（占用租约）、活动请求、内部 Ollama 和当前宿主能力；所有重型工作复用同一个串行入口，宿主不满足就零启动，普通 CPU/文档工作继续。" },
    { moduleSlug: "secondary-laptop", ask: "离开台式机时，副驾驶笔记本能不能独立工作？", effect: "在笔记本现场检查 Tailscale、ToDesk、FlyingBird、开发工具、WSL2/Docker 和精确防火墙；台式机代理或数据库不可达时只标出依赖，不开放 LAN/公网替代。" },
    { moduleSlug: "drift-acceptance", ask: "PCConfig 现在到底健康吗？", effect: "运行当前只读 drift，分别回答策略上是否需要关注、证据是否 pass/fail/unknown，并把任务、运行时、开发盘和恢复合同拆成稳定 check。" },
    { moduleSlug: "drift-acceptance", ask: "为什么任务数量对不上，是故障还是权限看不全？", effect: "读取 complete_visibility、registry/observed 计数和有界差异；部分可见保持 unknown，只有完整只读扫描才能判定真实定义漂移。" },
    { moduleSlug: "drift-acceptance", ask: "只检查核心恢复，不要跑整套验收。", effect: "用精确 area/check selector 只启动 core_recovery 的登记项；拼错或空交集时零检查启动，不把未选区域写成通过。" },
    { moduleSlug: "recovery-backup", ask: "重装系统或换机后恢复主要日常环境。", effect: "先分清同机重装、换机、系统盘故障或仅 PE，再只读识盘并重认盘符；随后按 BIOS/UEFI、Windows、三个控制面、运行时、项目、用户配置、任务、启动、登录与受保护数据分层恢复，最后以自然启动和应用内数据可见收口。" },
    { moduleSlug: "secondary-laptop", ask: "台式机坏了，能不能把原 NVMe 接到笔记本继续工作？", effect: "用笔记本自己的 Windows 启动，把原 GM7000 只当数据盘；只读确认分区和 E/V 锚点，按实际根继续 Git、文档和项目，不改写台式机 Registry，也不假定重型 GPU 能力可继承。" },
    { moduleSlug: "secondary-laptop", ask: "副驾驶笔记本重装后怎样恢复，又不让空白新机覆盖旧备份？", effect: "从已验证胶囊 current 与 closure 生成恢复预览，保持 writerState=restore_pending；数据和设备验收后先标记 restored_unaccepted，只有用户确认整机可用才激活 writer。" },
    { moduleSlug: "secondary-laptop", ask: "副驾驶笔记本硬盘坏了或恢复 U 盘不在，能恢复到什么程度？", effect: "Git 恢复有远端的项目，独立加密 U 盘只恢复已提交世代覆盖的 Desktop、Documents、Downloads 与窄 Codex 策略；U 盘不在保持 unknown/等待，本机同盘 rollback 不能冒充灾备。" },
    { moduleSlug: "secrets-providers", ask: "让一个程序使用凭据，但不要把密码发给我。", effect: "使用 SecretRef 和登记执行目标盲注入；结果回执固定不含明文，调用者只知道成功、失败或需要人工因子。" },
    { moduleSlug: "authorization-files", ask: "把我选中的这些文件和这个目录加密；中断后接着做，并确认以后能恢复。", effect: "把精确 SelectedPath 和 OutputPath 作为输入，执行链内部生成有界计划，再经最高权限授权逐文件分块加密；来源始终保留。当前没有独立 dry-run 预览动作；完成回执给计数、路径、哈希、状态和有界失败项，中断时复用已认证 state 续作，正文与密钥都不返回模型。" },
    { moduleSlug: "secrets-providers", ask: "在这个支付页填我选中的银行卡，但不要替我提交。", effect: "确认唯一 HTTPS 页面和一组标准支付字段后，用一次性能力原子盲填卡号、有效期与 CVV；模型看不到值，提交按钮仍由用户决定。" },
    { moduleSlug: "secrets-providers", ask: "两台电脑之间怎样恢复账号和凭据，能不能直接复制登录状态？", effect: "不能复制旧会话、Cookie、Token、密码或设备身份密钥；在目标设备重新登录，非秘密配置按新路径重建，秘密只从凭据 Owner、Provider 或 SecretRef 恢复。" },
    { moduleSlug: "recovery-backup", ask: "系统损坏后把 Codex 对话恢复回来。", effect: "先验证内容寻址恢复点、逐对象哈希和 closure；G 热备或已闭合的 H 冷备按各自证据恢复，原始对话不上传 GitHub。" },
    { moduleSlug: "protected-actions", ask: "把 Codex Home 搬到 E 盘，但当前不能重启应用。", effect: "迁移事务会先准备 staging、最终增量、ACL/链接清单和回滚副本；写入仍活跃时保持 waiting_for_codex_exit。当前这次迁移已经完成，E 是唯一根，C 只保留兼容 junction。" },
    { moduleSlug: "protected-data", ask: "升级受保护数据应用，同时保证失败能退回。", effect: "候选进入不可变旁路版本，经过 pre/post health（切换前后健康检查）后才更新 selector（版本选择器）；失败回到 LKG，无法证明任何版本可用时进入只读恢复。" }
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
    { date: "2026-08-30—08-31", commit: "9449bad–f9245a1", result: "Password Center 从“能找到密码”进化为可独立恢复、可原子保存银行卡并精确盲填；Codex 对话进入内容寻址的 G→H 恢复链，Codex Home 形成可预演、可回滚的迁移事务；同时把 BIOS/UEFI 文字基线、恢复介质、驱动、项目路径、用户配置、任务与自然启动验收串成完整换机/重装旅程。" }
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
    { name: "副驾驶笔记本健康", command: "<当前 PCConfig checkout>\\tools\\Get-SecondaryLaptopHealth.ps1 -Json", purpose: "只在精确副驾驶主机读取远控、网络、工具、任务和恢复状态；其他主机返回 not_applicable/host_mismatch。" },
    { name: "秘密代理状态", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action Status -Json", purpose: "验证安全核心和恢复闭环，回执固定不返回明文。" },
    { name: "授权文件工作流", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action <AuthorizationFileEncrypt|AuthorizationFileVerify|AuthorizationFileDecrypt> -Json", purpose: "只对明确选择路径执行加密、无明文落地校验或无覆盖恢复；Encrypt 传 SelectedPath/OutputPath，Verify 传 InputPath，Decrypt 传 InputPath/OutputPath。" },
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
    status: "机器事实可读，开发存储 5/5 通过，稳定投影为版本 6；TimeAudit 增量消费者已有合同与定向测试，本轮未证明 weekly 现场运行",
    statusTone: "mixed",
    searchAliases: ["TimeAudit异常会直接改变稳定机器投影吗", "PCConfig异常游标什么时候推进", "每周机器维护怎样消费TimeAudit摘要"],
    searchProjection: {
      intents: ["查看本机配置在哪里", "确认当前主机和设备角色", "迁移项目路径", "检查固定端口", "判断笔记本能否接管台式机", "消费TimeAudit增量异常并决定是否重查稳定事实"],
      entities: ["WLY 主工作站", "磁盘与盘符", "V 开发盘", "Z 可重建缓存", "项目配置键", "稳定机器投影", "TimeAudit anomaly cursor", "projection_recheck_recommended"],
      relations: ["主机身份决定机器事实", "项目配置源投影到 PCConfig", "路径关联项目和任务消费者", "端口同时受系统范围和监听约束", "TimeAudit只给异常摘要和重查建议", "PCConfig live provider独立裁定投影是否变化"],
      failureRecovery: ["host mismatch 不套用另一台机器", "现场不可读保持 Unknown", "快照更新失败标记 stale", "TimeAudit来源不可用或payload非法时游标不推进", "迁移失败保留源路径和回滚"]
    },
    value: "把散落在磁盘、环境、项目文件和本机服务里的配置变成可导航、可验证的机器地图。用户不用靠记忆猜路径，也不会因为看到一个旧值就直接改错地方。TimeAudit 发现持续硬件压力时，PCConfig 还能按自己的游标消费一份有界异常摘要，再决定是否值得重新读取稳定机器事实。",
    why: "同一个端口可能同时受 Windows 动态范围、现有 listener（监听进程）和项目配置影响；同一个目录也可能被计划任务、快捷方式或服务引用。没有唯一 Owner 和依赖导航，迁移很容易造成“文件还在，但程序找不到”。同样，一次温度或磁盘延迟异常只能说明时序信号，若直接写入稳定投影或自动判定硬件变化，就会把短暂负载变成错误机器基线。",
    example: "例如我要把一个新项目放到 V 盘，并让它使用固定本地端口。这个模块先证明 V 盘健康，再查端口是否落入动态/排除范围、是否已有监听、是否被别的 Owner 登记；通过后才让项目绑定并把稳定配置投影回 Registry。每周维护还会用上次成功游标请求 TimeAudit 的 `(after, until]` 摘要；只有摘要明确建议重查时才额外读取一次 live stable provider，而摘要本身永不写进稳定投影。",
    result: "检查通过时得到可用候选和验证入口；发现冲突时得到具体阻断原因；现场来源不可读时得到 unknown，并停止迁移或固定端口选择，不用默认路径或常见端口猜测。TimeAudit 增量消费另返回窗口、coverage、聚合异常、是否建议重查和 PCConfig 自己的 cursor/receipt；成功窗口才推进游标，相同边界严格 no-op，来源不可用或 payload 非法时游标不动。最终是否 `no_change` 或 `published` 仍只由 PCConfig 当前稳定事实决定。",
    readerStates: {
      pass: "磁盘、路径、端口和依赖引用都由真实责任源确认后，返回可用目标和后续验证入口，项目才继续绑定或迁移；TimeAudit 成功窗口另推进 PCConfig 游标并按建议最多触发一次稳定事实重查。",
      problem: "发现端口占用、目录引用、磁盘健康或登记冲突时阻断对应选择；TimeAudit 异常只形成重查建议，不能直接宣称配置或硬件已经改变。",
      unavailable: "现场机器事实不可读时保持 Unknown（证据不足），不拿缓存路径、常见盘符或默认端口代替当前事实；TimeAudit 来源不可用、窗口非法或摘要不合约时保留旧游标，不重启对方服务，也不发布新投影。"
    },
    decisionImpact: [
      "机器配置值先回到项目、服务或任务的真实配置源，PCConfig 快照只负责导航。",
      "路径迁移必须同时具备 source（源路径）、target（目标路径）、消费者、preimage（变更前像）、rollback（回滚）和 verification（验证）。",
      "固定端口在所有实时门禁通过后仍须立即真实 bind（绑定），预检不是预留。",
      "短生命周期服务直接绑定端口 0，由操作系统分配，不建立无意义的固定登记。",
      "V 是开发层，Z 只放可重建有界缓存；唯一源码、数据库和正式备份不能放进 Z。",
      "PCConfig 只持有 TimeAudit 增量 cursor 与有界 decision receipt；原始时序、进程、窗口标题和异常 payload 不进入稳定机器状态。",
      "只有成功 `(after, until]` 窗口才推进游标；unavailable、非法 payload 和相同边界分别保持旧游标或严格 no-op。",
      "TimeAudit 只建议是否重查，`Invoke-StableMachineProjection.ps1` 必须重新读取 PCConfig live 稳定事实后独立决定 no_change 或 published。"
    ],
    problem: "机器事实既有长期稳定信息，也有每次都可能变化的现场状态。把两者混在一份静态文档里，会让旧路径、旧端口或旧运行时继续被误用；反过来持续扫描整机又会制造隐私、延迟和第二事实源。",
    implementation: [
      "44 份 Registry 分别保存 machine、drives、folders、path owners、project config keys、dependencies、runtimes 和恢复关系；每类都有明确 schema 和 validator（校验器）。",
      "稳定机器 Provider 只采集硬件、系统、固定卷和关键运行时，明确排除序列号、网络标识、负载、温度、进程、秘密和原始时序。",
      "稳定投影用规范哈希、previous 链和同目录原子替换；payload（有效数据）不变时返回 no_change，不刷新 mtime（文件修改时间）。",
      "项目配置快照当前有 157 个键。update 请求必须绑定 Registry 期望哈希、单一 project id、唯一 key 集和项目 Owner 验证；安全投影失败时 mark_stale，而不是保留伪 current。",
      "目录 Registry 和路径 Owner Registry 各登记 57 项；项目路径依赖 Registry 汇总 15 个项目。普通任务只读取命中的有界条目，不加载整份依赖表。",
      "generated_publication_pipelines 把 inventory、task scan、项目依赖、任务重建和用途目录限定到各自 allowlist、checkpoint 与 current pointer；机器生成物不能越界写叙事或替代源 Owner。",
      "端口 Provider 同时读取 IPv4/IPv6 动态范围、排除段、listener 和登记冲突，available、blocked、unknown 使用不同退出码。",
      "开发存储 Provider 单独判断 V 与 Z；Z 降级不会自动阻断健康的 V 项目，当前现场摘要为 pass=5、warn=0、block=0。",
      "Invoke-TimeAuditAnomalyIncrement.ps1 调用 TimeAudit 的 `timeaudit.pcconfig-anomaly-digest.v1` Provider，只在 `%LOCALAPPDATA%\\PCConfig\\stable-machine` 保存 `pcconfig.timeaudit-anomaly-cursor.v1` 和有界 consumption receipt。",
      "weekly `PCConfig Governance Check` 复用现有维护路径：先消费增量，再固定运行一次稳定投影 publisher；若增量同时建议重查，罕见的第二次 publisher 调用严格 no-op，不新增高频任务。"
    ],
    flow: [
      "判断当前问题是否真的依赖机器事实",
      "从 Registry 定位 Owner、真实配置源和只读入口",
      "运行匹配 Provider 取得本次现场观察",
      "需要变更时冻结 source、target、消费者、preimage、rollback 和 verification",
      "先由项目 Owner 修改并验收真实配置",
      "再用期望哈希事务更新 PCConfig 快照或稳定投影",
      "每周维护按上次成功 cursor 向 TimeAudit 请求最长 168 小时的 `(after, until]` 聚合窗口；验证 owner/profile/schema/coverage、异常和重查建议。",
      "成功窗口写 bounded receipt 并推进 cursor；source unavailable、非法 payload 或同一时间边界不推进、不重写。只有明确 recommendation 才额外 Inspect 一次 live stable provider。",
      "从项目与现场两端分别回读"
    ],
    concepts: [
      { term: "Registry（结构化登记表）", explanation: "提供稳定键、Owner、来源和验证入口；它不是现场真相，也不能单独证明消费者已加载。" },
      { term: "Stable projection（稳定投影）", explanation: "只保存长期有意义且公开安全的机器事实，版本化记录真正变化，不做实时监控。" },
      { term: "Mark stale（标记陈旧）", explanation: "保留 last-known value（最后已知值），但明确撤销“这是当前值”的声明。" },
      { term: "Port preflight（端口预检）", explanation: "判断候选端口此刻是否适合尝试绑定；它没有锁定端口，因此检查后必须立即 bind。" },
      { term: "Move gate（迁移门禁）", explanation: "只有源、目标、依赖、风险、回滚和验证全部明确，才允许从复制验证推进到切换引用。" },
      { term: "Dev Drive（开发盘）", explanation: "V 盘的开发层；适合可恢复的仓库、worktree（隔离工作树）、包缓存和构建输出，不是独立物理备份。" },
      { term: "TimeAudit anomaly cursor（异常消费游标）", explanation: "PCConfig 自己保存的最后成功时间边界；它让每周维护只消费新窗口，失败不越过证据缺口，相同窗口不重复写。" }
    ],
    boundaries: [
      "不递归扫描整个 C 盘，只看会改变当前决定的候选",
      "不保存环境变量值、完整依赖 payload、序列号、网络身份或秘密",
      "project_config_keys 快照不反向修改项目真实配置",
      "稳定投影不记录进程、负载、温度、空闲空间或时序数据",
      "VHD（虚拟磁盘文件）位于 E 盘，不构成独立故障域",
      "目录不整齐不是迁移理由，移动和永久删除不能放在同一操作",
      "TimeAudit digest 不进入 stable_machine_projection.json，也不证明温度、磁盘或硬件配置发生稳定变化。",
      "增量消费不新建数据库、控制面或高频任务，不查询 TimeAudit 原始行，也不在来源不可用时重启它。"
    ],
    failures: [
      { condition: "Provider 或 Registry schema 失败", response: "对应事实保持 unknown，阻断依赖该事实的迁移或配置决定；旧报告不能补齐。" },
      { condition: "项目配置源已改变但快照无法安全更新", response: "优先把命中键标记为 stale；标记也失败则保留原文件并报告哈希或锁冲突。" },
      { condition: "端口预检通过但真实 bind 失败", response: "停止服务启动，重新探测；不自动退回 8000 等常见默认端口。" },
      { condition: "稳定投影 live payload 不完整或含禁入字段", response: "在替换 current 前失败，保留最后一个已验证的 v6 current；失败采集不能覆盖既有投影。" },
      { condition: "生成投影 staging、manifest 或 current 不闭合", response: "保留旧 current 与 checkpoint，不把 .incoming 或部分 registry 拼进现行配置地图。" },
      { condition: "V 或 Z 恢复锚点不可读", response: "只阻断依赖该盘的工作；不自动创建同名空盘覆盖恢复线索。" },
      { condition: "TimeAudit source unavailable、窗口非法或 digest schema / payload 不合约", response: "写有界 unavailable 结果但不推进 cursor、不调用稳定投影 publisher，也不尝试重启 TimeAudit。" },
      { condition: "同一 `(after, until]` 边界被重复调用", response: "返回 no_new_window，cursor 与 receipt 不重写；weekly 路径不会因此重复发布。" },
      { condition: "异常建议重查但 live stable provider 返回无变化", response: "保留 anomaly receipt，稳定投影严格 no_change；摘要不能覆盖 live provider 的裁定。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\folders.json", role: "57 个登记目录及其用途边界" },
      { path: "E:\\PCConfig\\registries\\path_owners.json", role: "57 个路径 Owner 与依赖事实来源" },
      { path: "E:\\PCConfig\\registries\\project_path_dependencies.json", role: "15 个项目的路径依赖汇总" },
      { path: "E:\\PCConfig\\registries\\project_config_keys.json", role: "路径、端口、模型和数据源的非权威快照目录" },
      { path: "E:\\PCConfig\\registries\\stable_machine_projection.json", role: "版本化稳定机器投影 current" },
      { path: "E:\\PCConfig\\registries\\generated_publication_pipelines.json", role: "机器生成 Registry/报告的 allowlist、checkpoint 与 current 边界" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.path-project-config.md", role: "路径与项目配置事务合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.stable-machine-projection.md", role: "稳定字段、禁入项、版本与发布语义" },
      { path: "E:\\PCConfig\\tools\\Invoke-TimeAuditAnomalyIncrement.ps1", role: "有界增量窗口、cursor、receipt、recommendation 与 publisher 调用边界" },
      { path: "E:\\PCConfig\\tools\\timeaudit_anomaly_increment.test.ps1", role: "成功推进、unavailable 不推进、同边界 no-op 与重查建议回归" },
      { path: "E:\\PCConfig\\docs\\governance\\local_service_port_policy.md", role: "固定端口实时门禁" },
      { path: "E:\\PCConfig\\docs\\governance\\move_gate.md", role: "迁移、回滚与删除分离" },
      { path: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", role: "E/V/Z 放置和恢复关系" }
    ],
    verification: [
      "Get-DevStorageHealth.ps1 -Json 于 2026-08-29 返回 5 项 pass、0 warn、0 block",
      "Get-RuntimeInventory.ps1 -Json 当前 exit 0 且返回 pcconfig.runtimes.v1",
      "Invoke-StableMachineProjection.ps1 -Action Read -Json 当前可读取版本 6；该投影生成于 2026-08-30，是稳定配置基线而非瞬时运行状态",
      "validate_project_config_keys.mjs 验证键、敏感级别、来源、快照状态和事务字段",
      "test_local_service_port.test.ps1 覆盖动态范围、排除段、listener、登记冲突和 unknown",
      "stable_machine_projection.test.ps1 覆盖禁入字段、原子回读、变化链和重复 no-op",
      "d4480abc 的合同与 focused test 已定义 TimeAudit 增量消费者；本网页审计没有把测试存在冒充 weekly 任务本轮已运行或稳定投影发生变化。"
    ],
    relation: "这个模块回答“机器配置在哪里、现在是什么”；TimeAudit 增量摘要只提醒它何时值得重新读一次现场，不提供稳定事实本身。运行时与启动模块负责“它怎样启动和运行”，恢复模块负责“故障后怎样重建”，受保护动作模块负责“重大写入怎样获准并回读”。"
  },
  {
    slug: "runtime-startup",
    shortTitle: "运行与启动",
    title: "运行时、受管软件、启动项与计划任务",
    teaser: "把工具版本、环境元数据、登录启动和计划任务拆成各自可观察、可恢复、不会弹黑窗的运行链。",
    status: "运行环境与配置地图可读；当前覆盖 17 个启动项、87 个任务，10 个核心恢复任务均 Ready 且最近结果 0",
    statusTone: "mixed",
    searchProjection: {
      intents: ["检查运行时版本", "排查计划任务", "恢复登录启动链", "安全升级受管软件", "判断离线时哪些能力可用"],
      entities: ["PowerShell 运行时", "受管软件 Adapter", "启动来源面", "Task Scheduler", "业务 Owner 回执", "无窗口 launcher"],
      relations: ["软件状态决定是否更新", "任务定义和业务结果分层", "项目先恢复再注册任务", "启动项依赖当前用户和机器"],
      failureRecovery: ["unknown 不自动安装", "任务 Ready 不冒充业务成功", "任务注册失败恢复 XML preimage", "启动差异只按真实影响处理"]
    },
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
      "LocalGpuBroker 统一拥有客户端 32100 与内部 Ollama backend 32101，把 Ollama、LocalOCR、ChineseASR 等重型 GPU 工作串行化；项目不能绕过 Broker 直接抢占同一 GPU。",
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
      "OllamaStable32100 与 SelfHeal 任务负责 Broker/内部 backend 的登录启动和幂等恢复；启动前先验当前宿主内存、NVIDIA GPU/显存、命令和模型路径，失败时不创建日志目录或进程。",
      "governance check 只调用登记的 zero-write Provider 和稳定 publisher；同一非 current fingerprint 只有首次或变化时产生 attention。"
    ],
    flow: [
      "用别名或任务名定位受管条目和业务 Owner",
      "读取 live runtime、startup 或 Scheduler 现场",
      "把配置签名、瞬时状态、LastTaskResult 和 Owner receipt 分开",
      "需要更新时先固定 current/target/relation 和回滚材料",
      "重型 GPU 请求先取得 Broker lease 并在当前宿主通过能力门，结束或失败后释放；普通运行时不进入这条串行链",
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
      { term: "Hidden launcher（无窗口父启动器）", explanation: "从最外层就不创建可见控制台的启动链；Task Scheduler 的 Hidden 复选框不能单独证明这一点。" },
      { term: "LocalGpuBroker（本地 GPU 串行代理）", explanation: "给 Ollama、OCR、ASR 和模型工作提供一个共享入口、lease 与内部 backend，避免多个重型进程同时争抢显卡。" }
    ],
    boundaries: [
      "环境变量、PATH、任务 Action、参数、XML 和日志按实际值判断：普通名称、路径、结构、状态和失败事实可以公开；只省略其中确含 L3+ 私人正文或可复用凭据的具体值",
      "不自动建立无人值守软件更新任务",
      "不因为 startup 新增、删除或启停变化就生成故障或待办",
      "不从 provider 名称猜管理员需求；安装范围由本次 status Adapter 回读",
      "不重装 equal 但 degraded 的组件，只报告健康缺口",
      "不在宿主能力门失败时启动 Broker、Ollama 或重型项目，也不把临时宿主观察写回主工作站基线",
      "具体任务为何成功仍由所属项目定义"
    ],
    failures: [
      { condition: "完整权限现场与 Registry 不同", response: "保留精确差异并标明观察时间；不把历史 task-scan 冒充当前闭合，也不把 runtime health PASS 反推成定义一致。" },
      { condition: "2026-08-28 的历史 LastTaskResult=4", response: "保留为带日期的旧回执；当前 rev68 自然启动已在 46984 ms 内返回 deadline_met=true，不再把历史失败算进当前健康。" },
      { condition: "启动快照比现场少 3 项", response: "当前归类为 informational_only；无需自动刷新、关闭应用或要求用户确认，下次真实维护可吸收为新基线。" },
      { condition: "环境变量 registry/process 读取失败", response: "对应项 exists=null、diff_status=unknown；不把读取失败写成 absent。" },
      { condition: "组件 status 为 unknown 或通道不匹配", response: "不备份、不安装、不降级，返回稳定错误码和 Owner 入口。" },
      { condition: "LocalGpuBroker backend 已活动或 lease 被占用", response: "组件更新和新的重型任务等待或停止，不终止现有 Owner；读取 Broker 状态后从原 lease 恢复，不另开直接 backend。" },
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
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.scheduled-tasks.md", role: "Scheduler 权威、无窗口和事务回滚合同" },
      { path: "E:\\PCConfig\\tools\\local_gpu_broker\\broker.py", role: "32100 公共入口、32101 内部 backend、lease 与重型请求串行实现" },
      { path: "E:\\PCConfig\\tools\\local_gpu_broker\\Test-HeavyRuntimeHostCapability.ps1", role: "重型运行前的当前宿主能力门" }
    ],
    verification: [
      "2026-08-31T11:43:18Z 配置地图回读 44 份 Registry、15 个项目、157 个配置键、89 个环境变量、64 段 PATH、11 个受管软件、17 个启动项和 87 个任务",
      "10 个核心恢复任务均为 Ready、最近结果 0；CoreRecovery 3/3 验收通过",
      "P0 rev68 为 normal、active=LKG、trusted=true、recovery_status=null；最新自然启动为 46984 ms、deadline_met=true",
      "Get-StartupInventory.ps1 -Json 当前覆盖 17 个启动项",
      "Invoke-StartupSnapshotMaintenance.ps1 -Action Inspect -Json 当前返回 changes_observed，但 action_required=false、confirmation_required=false",
      "2026-08-31 Test-LocalGpuBroker.ps1 返回 ok=true、lease=null、active_ollama_requests=0、ollama_version=0.33.1；这是当前 Broker 状态，不证明每个重型项目已运行",
      "validate_managed_software_catalog.mjs、validate_env_var_index.mjs 与对应回归覆盖 catalog、环境元数据和闭合状态机"
    ],
    relation: "机器事实模块告诉它们在哪里；本模块证明怎样启动和运行；恢复模块在系统重建后按顺序重新接上这些运行链；漂移结果又成为整体验收的输入。"
  },
  {
    slug: "drift-acceptance",
    shortTitle: "漂移与验收",
    title: "机器事实漂移、证据状态与分区验收",
    teaser: "回答“当前登记和现场是否一致、证据够不够、究竟要修什么”，并允许只运行与本次决定有关的检查。",
    status: "2026-08-31 live_read_only（现场只读）为 6 pass、1 warn、0 block；任务定义只得到 partial visibility（部分可见），因此 tasks.live_match 是 warn/unknown，运行时、开发存储、CoreRecovery 和任务运行结果均有 pass 证据",
    statusTone: "mixed",
    searchProjection: {
      intents: ["检查 PCConfig 当前是否健康", "比较登记与现场", "只验一个恢复区域", "区分故障和证据不足", "定位计划任务差异", "判断是否需要修复"],
      entities: ["pcconfig.drift.v2", "status", "evidence_status", "稳定 check ID", "acceptance area", "tasks.live_match", "bounded evidence"],
      relations: ["策略处置和执行证据双轴", "Registry 与 live Provider 比较", "验收 area 关联 Owner check", "任务定义漂移与运行健康分离", "unknown 不能折算为 pass"],
      failureRecovery: ["部分可见保持 unknown", "selector 不存在时零检查启动", "Provider 超时保留阻断原因", "真实不匹配交回事实 Owner", "旧报告不补齐当前证据"]
    },
    value: "我可以直接问“PCConfig 现在到底健康吗”“任务数量为什么对不上”或“只检查核心恢复”。系统会把明确不匹配、证据不足和仅需提醒分开，给出稳定检查名、当前证据和真正负责修复的 Owner，而不是用一个总绿灯或一长串日志让我自己猜。",
    why: "机器登记可能陈旧，现场读取也可能因权限、设备离线或 Provider 失败而不完整。把这两种情况都写成失败会制造误修，把 unknown 写成通过又会掩盖真实风险；每次全跑所有验收还会浪费时间并触发无关依赖。需要一个能分离政策处置与证据结论、支持精确选区且输出有界的长期证据层。",
    example: "例如 Registry 有 87 个任务，而普通用户现场只看到 84 个。漂移入口不会立刻说“丢了 3 个任务”，而是返回 tasks.live_match=warn、evidence_status=unknown、complete_visibility=false，并列出有界 added/removed 候选；与此同时 tasks.runtime_health 可以独立 PASS。只有提升后的完整只读扫描才能把定义漂移变成 pass 或 fail。",
    result: "我最终得到一份可行动但不越权的结论：哪些检查已证明一致，哪些已证明不匹配，哪些因证据不足仍未知，是否需要关注或阻断，哪个 Owner 负责下一步，以及重跑时应选哪个 area/check。验收不会自动修项目、迁移路径、秘密或外部系统。",
    readerStates: {
      pass: "相关 check 的 status 与 evidence_status 都有当前证据，且所选 area/check 完整运行时，返回稳定 ID、关键计数和证据范围；只说明本次选择证明的层。",
      problem: "现场明确与 Registry/合同不符时标为 fail，并按现实风险给出 warn 或 block；修复交给对应任务、运行时、磁盘、恢复或项目 Owner，验收器本身不改事实源。",
      unavailable: "权限不足、Provider/Registry 不可用、超时或上游未执行时 evidence_status=unknown；策略可以提醒或阻断，但永远不把 unknown 折算为 pass。"
    },
    decisionImpact: [
      "status=pass|warn|block 表示当前处置级别，evidence_status=pass|fail|unknown 表示证据结论；两条轴必须同时读。",
      "真实不匹配是 fail；完整性不足是 unknown；已证明但只需提醒的陈旧证据可以是 warn/fail，不能靠一个颜色覆盖语义。",
      "任务定义 tasks.live_match 与任务运行结果 tasks.runtime_health 独立；定义可见性不足不等于任务业务失败，LastTaskResult 信息码也不自动算失败。",
      "Test-PCConfigDrift -NoWrite 与 Get-DevStorageHealth 是 zero-write（零写入）；acceptance 的 NoWrite 不改 PCConfig 报告/Registry，但被选 Owner check 可能创建并删除有界临时产物。",
      "acceptance selector 采用 area 与 check ID 的精确交集；任一不存在或交集为空时，在启动任何检查前返回 selection error。",
      "只运行会改变本次决定的 area/check；未选项不进入 selected_items 或 results，也不能被写成通过。",
      "任务差异只返回有界 task key、计数和 changed_fields 字段名，不返回完整 Action、参数、trigger 或旧/新值。",
      "验收结论只证明机器事实证据，不反向拥有 Git admission、Skill 供应、项目业务状态或公开发布。"
    ],
    problem: "旧式健康检查容易把命令 exit 0 当全局 PASS、把权限不足当对象不存在、把任务定义和业务结果混在一起，或者为了“完整”每次运行全套脚本。这样既会误修，又无法从结果恢复。漂移与验收层必须保留稳定 ID、双状态、精确选择、超时和有界证据，才能在现场变化时仍给出同一种可理解答案。",
    implementation: [
      "Test-PCConfigDrift.ps1 -NoWrite 输出 pcconfig.drift.v2：每个 check 有稳定 id、domain、status、evidence_status、message 与有界 evidence，summary 分别汇总策略计数和证据计数。",
      "当前检查集包括 registry.schema、tasks.live_match、tasks.runtime_health、tasks.path_integrity、runtimes.live_match、drives.dev_storage 与 recovery.core_contract；新增检查必须保留 owner、状态域和输出边界。",
      "tasks.live_match 在完整可见时比较 registry_count、observed_count、added/removed/changed；最多返回 20 条清理后的 task key 和 changed_fields 名称，超出以 *_truncated 标记。",
      "tasks.runtime_health 只评估 managed-core 的 LastTaskResult 与可选结构化 Owner receipt；Scheduler 状态码、真实失败、历史已恢复结果和外部 Owner unknown 分开计数。",
      "runtimes.live_match 调当前运行时 Provider；drives.dev_storage 调 V/Z 健康 Provider；recovery.core_contract 同时核对 manifest、任务 Inspect 与维护 Inspect，不用一个文件代替整条合同。",
      "acceptance_checklist.json 登记 area、check ID、blocking、命令、超时、隐私边界、trigger 和 acceptance；Invoke-PCConfigAcceptance 只执行 selector 交集并返回 selected_items。",
      "selector 支持数组或逗号分隔、大小写不敏感但必须精确匹配；未知 area/check、空交集或 checklist schema 错误都 selection.status=error、exit 1、零检查启动。",
      "每个 owner check 的 stdout、stderr、超时和 exit code 被转换为 pass/fail/unknown 与简短 output_excerpt；原始大日志、秘密和完整任务定义不进入公共结果。",
      "按需排障先消费结构化摘要；只有一个 check fail/unknown 时才读取它指向的 owner 证据，避免加载整份历史报告或无关机器状态。",
      "验收器不自动修复：Registry 漂移交 Registry Owner，任务交任务/项目 Owner，运行时交 PCConfig/组件 Adapter，恢复数据与秘密继续走各自专用入口。"
    ],
    flow: [
      "先写清当前决定依赖哪类机器事实：任务、运行时、开发盘、恢复、秘密入口或完整收尾。",
      "选择最小入口：快速 drift 摘要、单个 live Provider，或 acceptance 的精确 area/check；不为普通项目收尾机械全跑。",
      "读取 execution_status 与 selection；selector 错误时确认零检查已启动，再修正名称而不是解释空结果。",
      "逐项同时读 status 和 evidence_status：pass/pass 是已证，warn/fail 是已证但只需关注，warn/unknown 是证据不足，block/unknown 是关键证据无法成立。",
      "核对 evidence 的观察范围、complete_visibility、计数、截断和时间；不拿旧 Registry 或旧报告补现场缺口。",
      "把 tasks.live_match、runtime_health、path_integrity 等相邻但不同结论分开，不用一个通过项覆盖另一个未知。",
      "明确差异时转给对应 Owner，带上稳定 check ID、最小 evidence 和重新验证入口；验收器不直接修改真实配置。",
      "修复后重新运行同一精确 check/area；只有当前证据转为 pass 才收口，未选择或无法运行的项继续保持未知。"
    ],
    concepts: [
      { term: "Drift（漂移）", explanation: "登记、合同或稳定投影与当前现场不一致；它可能是需修故障，也可能只是快照尚未刷新。" },
      { term: "Status（处置状态）", explanation: "pass、warn、block 表示当前应继续、关注或停止的策略结论，不等于证据真假本身。" },
      { term: "Evidence status（证据状态）", explanation: "pass、fail、unknown 表示当前证明满足、证明不满足或无法证明；unknown 永远不是 pass。" },
      { term: "Stable check ID（稳定检查标识）", explanation: "跨版本保持含义的检查名，用于定向选择、Owner 交接和修复后重验。" },
      { term: "Area selector（区域选择器）", explanation: "只运行某一产品区域的检查；与 check ID 同时给出时取精确交集。" },
      { term: "Complete visibility（完整可见性）", explanation: "当前身份能看到足够完整的系统对象；普通用户的部分任务列表不能证明定义一致或缺失。" },
      { term: "Bounded evidence（有界证据）", explanation: "只返回会改变判断的计数、稳定字段和有限差异，避免泄露完整参数或淹没注意力。" },
      { term: "NoWrite（不改权威状态）", explanation: "不改 PCConfig Registry/报告；acceptance 中的 Owner check 仍可能按合同创建并删除有界临时验证产物。" }
    ],
    boundaries: [
      "不把 schema 正确、命令 exit 0、文件存在或一个 check PASS 推成全机健康",
      "不把权限不足、Provider 超时、设备离线或上游未执行写成 absent 或 fail",
      "不把 unknown 折算为 pass，也不因 status=warn 就隐去 evidence_status=fail/unknown",
      "不把任务定义漂移、任务运行结果、业务 Owner 回执和历史结果混成一个状态",
      "不在 selector 无效时启动任何检查，不把未选择项放进结果或总数",
      "不输出完整任务 XML、Action、路径参数、旧/新敏感值、原始日志或秘密",
      "不让验收器自动修改 Registry、注册任务、迁移路径、恢复秘密、推送 Git 或执行外部写入",
      "不周期性全扫；只有机器事实或恢复状态会改变当前决定时才触发对应检查"
    ],
    failures: [
      { condition: "tasks.live_match complete_visibility=false", response: "保持 warn/unknown，显示 registry/observed 计数和有界候选；只有提升后的完整只读扫描能判定真实漂移。" },
      { condition: "Provider、Registry 或 owner validator 超时/失败", response: "对应 check 保持 unknown 并列出依赖与重试入口；其他已完成检查仍保留自身结论。" },
      { condition: "Registry 与完整现场明确不同", response: "标记 fail，并按风险选择 warn/block；修复真实来源或刷新 owning snapshot 后重跑同一 check。" },
      { condition: "任务非零结果是 Scheduler 状态码", response: "按分类保留为运行状态，不自动算业务失败；有 Owner receipt 时再判断业务结论。" },
      { condition: "area/check selector 拼错或交集为空", response: "selection error、exit 1、selected_items=[]，不执行 fallback 全套验收。" },
      { condition: "检查输出超过边界或含不允许字段", response: "截断或拒绝该证据并保持 unknown；不能为了给结论公开完整任务参数或日志。" },
      { condition: "修复后只看到旧报告变绿", response: "重新调用当前 Provider/同一 check；旧报告只能解释历史，不能关闭当前漂移。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.drift-acceptance.md", role: "双状态、稳定 ID、选择器、有界证据与 Owner 边界合同" },
      { path: "E:\\PCConfig\\tools\\Test-PCConfigDrift.ps1", role: "机器事实与恢复合同的现场只读 drift 汇总" },
      { path: "E:\\PCConfig\\registries\\acceptance_checklist.json", role: "area、check、blocking、超时、隐私与验收登记" },
      { path: "E:\\PCConfig\\tools\\Invoke-PCConfigAcceptance.ps1", role: "精确 selector、超时和有界结果的 acceptance runner" },
      { path: "E:\\PCConfig\\tools\\Get-DevStorageHealth.ps1", role: "V/Z 开发存储 zero-write Provider" },
      { path: "E:\\PCConfig\\tools\\Get-RuntimeInventory.ps1", role: "当前运行时事实 Provider" },
      { path: "E:\\PCConfig\\tools\\invoke_acceptance_checks.test.ps1", role: "selector、超时、unknown、未启动项和输出边界回归" },
      { path: "E:\\PCConfig\\tools\\test_pcconfig_drift.test.ps1", role: "drift 双状态、任务差异、历史结果和零写入回归" }
    ],
    verification: [
      "2026-08-31T17:49:27Z Test-PCConfigDrift.ps1 -NoWrite -Json 返回 schema=pcconfig.drift.v2、execution_status=completed、summary=6 pass/1 warn/0 block，证据为 6 pass/0 fail/1 unknown",
      "同次唯一 attention 是 tasks.live_match=warn/unknown：registry_count=87、observed_count=84、complete_visibility=false；它是部分可见性，不是已证明任务丢失",
      "同次 tasks.runtime_health、tasks.path_integrity、runtimes.live_match、drives.dev_storage 与 recovery.core_contract 均 pass/pass；两条 Scheduler 状态码未被误分类成失败",
      "drives.dev_storage 回读 5 pass、0 warn、0 block；CoreRecovery 维护状态 ready、warnings=0、Cold=additive_no_mirror、Git/云 payload 写入禁止",
      "先前精确 core_recovery area 验收返回 manifest_contract、maintenance_inspect、task_contract 三项 PASS；只证明该 area，不代表未选择区域",
      "invoke_acceptance_checks.test.ps1 与 test_pcconfig_drift.test.ps1 分别覆盖 selector 零启动、超时/unknown、有界输出和 drift 双状态；测试证据不替代当前 live Provider"
    ],
    relation: "机器事实、运行时、恢复、副驾驶、秘密和受保护数据模块各自产生 Owner 证据；本模块只负责把这些证据按稳定 ID、双状态和精确选择组合成可行动结论。它不接管修复，也不把项目/Git/Skill 的上游验收吞进 PCConfig。"
  },
  {
    slug: "recovery-backup",
    shortTitle: "换机与恢复",
    title: "换机、重装、备份与恢复",
    teaser: "从 BIOS/UEFI、启动介质和盘符识别开始，一直恢复到项目、登录、自然启动和应用内数据可见；备份只是来源，不是完成证明。",
    status: "CoreRecovery 当前 ready：10 个任务、9 个备份集合、2 个外部 Owner，区域验收 3/3 PASS；H、新机端到端、WEPE 识盘/网络和 BIOS 保存重启仍待真实验收",
    statusTone: "mixed",
    searchAliases: [
      "BIOS", "UEFI", "主板设置", "换机 BIOS", "重装 BIOS", "启动U盘", "WEPE", "WinPE", "Q-Flash Plus", "Windows ISO",
      "驱动导出", "重装后恢复驱动", "C盘用户配置", "换机后恢复项目", "重新登录", "自然启动验收", "present_verified",
      "BIOS和换机重装有什么关系", "换主板或重装前 BIOS 要留什么", "重装 Windows 后怎么把电脑恢复回来"
    ],
    searchProjection: {
      intents: ["重装 Windows 后恢复电脑", "换机后恢复项目和配置", "系统盘故障只读救援", "从 PE 开始恢复", "重建 Hot 和 Cold 备份"],
      entities: ["BIOS/UEFI", "WEPE/WinPE", "F 启动 U 盘", "G Hot", "H Cold", "项目与用户配置", "计划任务与启动项"],
      relations: ["恢复来源决定可恢复范围", "盘符按现场重新识别", "项目和运行时先于任务", "应用可见性晚于文件复制", "普通恢复不替代 P0–P7"],
      failureRecovery: ["识盘前不 clean 或 format", "驱动不兼容改用官方来源", "H 不可用保持 skipped", "应用看不到数据保持未完成", "恢复后重新建立备份"]
    },
    value: "重装 Windows、换电脑、系统盘故障或只能进入 PE 时，我能从当前手里真正可用的来源开始，按不破坏原盘的顺序恢复：先认机器和磁盘，再处理 BIOS/UEFI、Windows 与驱动，接回三个控制面、运行时、项目、用户配置、任务和启动项，最后恢复登录与受保护数据并做真实应用验收。",
    why: "“有 ISO”“能进 PE”“备份目录存在”“任务是 Ready”都只证明一小段。恢复最容易漏掉的是主板版本和 BIOS 边界、盘符变化、驱动兼容、项目路径、C 盘用户配置、任务身份、登录因子，以及应用能否在自然启动后看到原数据；直接 clean、format、修 BCD 或整包覆盖，会先破坏还能取证和回退的来源。",
    example: "例如系统盘损坏但 E/G 数据仍可读。我先在 UEFI 启动的 WEPE/WinPE 里只读列出物理盘和卷，不按旧 C/E/G 盘符猜，也不先 clean、format 或重建 BCD。确认主板与 PCB revision（电路板版本）、当前 BIOS、Windows 目标盘和恢复来源后，再安装系统与关键驱动，clone 三个控制面，恢复 15 个项目路径、26 项用户配置和必要任务。最后逐个自然启动应用、确认数据可见，并在新系统重新建立 Hot/Cold 备份链。",
    result: "最后得到的不是“文件拷回来了”，而是一份按层可继续的恢复结果：四种场景走了哪条路，F/G/H/Git/P0–P7 各提供了什么，哪些设置和数据已回读，哪些应用仍要登录，哪些只到 present_verified、present_observed 或 user_confirmed，哪些真实验收尚未发生，以及失败时应停在哪个检查点。",
    readerStates: {
      pass: "场景、物理磁盘、恢复来源、主板/驱动兼容和回滚入口都已确认时，按依赖顺序恢复；每一层都从真实 Owner 回读，最终用自然启动、应用内数据可见和新备份回执验收。",
      problem: "识盘、兼容、复制、路径、任务、启动、登录或应用可见性任一层失败时，停在该层并保留原盘、旧 current 和已验证结果；不靠后续步骤掩盖前面的失败。",
      unavailable: "只有启动 U 盘、G/H 离线、BitLocker 未解锁、账号/因子不可用或证据不足时，只做当前允许的只读识别与网络重建，逐项标明缺失来源；不格式化、不猜盘符、不声称整机已恢复。"
    },
    decisionImpact: [
      "同机重装：若主板与 BIOS 没有重置或升级，不为重装 Windows 额外刷写 BIOS；先保护现有数据盘，再按旧机器基线重认盘符和配置。",
      "换机或换主板：旧板的超频、固件包和驱动不能直接套到新板；BIOS 文字记录只帮助理解旧机器，目标机必须按自己的型号、PCB revision 和兼容清单重建。",
      "系统盘故障：先只读确认物理盘、分区、BitLocker 和可用副本；不要因 Windows 起不来就先 clean、format、改分区或修 BCD。",
      "只有 PE：F 只提供 UEFI/WEPE 启动与救急导航，不是完整数据包；先验证内部盘和网络，能进 PE 不能升级成“可恢复”。",
      "GitHub 与官方网络只能重建已发布源码、软件和非秘密默认环境；未推送改动、私人文件、聊天、密码和原样登录态必须来自其他已核验来源。",
      "G 是在线 Hot（热备）来源，H 是人工解锁窗口中的 Cold（冷备）来源；H 不可用时记录 skipped，不自动解锁、回锁或改变设备信任。",
      "Password Center、媒体和其他受保护数据走 P0–P7 的完整 Carrier（恢复载体）加有效因子；普通备份、程序已安装或只有因子都不能替代它。",
      "实际完成必须经过自然启动、应用打开、账号与数据可见、必要业务动作，以及恢复后重新建立备份；复制、hash 或任务 Ready 都只是中间证据。"
    ],
    problem: "过去的恢复说明更像一组名词和入口：知道有 CoreRecovery、BIOS、项目路径和任务计划，却无法从“我现在是同机重装还是换机”一路走到“应用真的能用”。完整恢复必须把场景分流、来源选择、破坏性动作禁区、依赖顺序、证据等级和用户可见验收串成一条连续旅程。",
    implementation: [
      "现行入口按四种事故分流：同机重装保留硬件/数据盘并重建 Windows；换机重新建立硬件、盘符和驱动映射；系统盘故障优先保护可读介质；仅 PE 先把机器恢复到可登录、联网并能由 AI 接管。",
      "恢复来源分工固定：F 是启动/救急 U 盘；G 是在线 Hot；H 是人工 Cold；Git 只重建正常仓库与公开安全元数据；P0–P7 处理需要 Carrier 与有效因子的受保护数据。介质存在不等于内容完整。",
      "Recovery kit（恢复材料包）当前登记 16 项资产，校验器为 0 error、0 warning。UEFI 启动 F 可进入 PE 是 user_confirmed；隐藏 WEPE 分区为 present_observed，内部盘与网络 smoke 尚未验。Windows ISO、ADK/WinPE、驱动和 BIOS 包各有独立版本、路径、hash 与兼容边界。",
      "BIOS/UEFI 文字基线覆盖 Gigabyte X870E AORUS PRO ICE 的 CPU、内存、启动与 PCIe 核心设置；E 源、E 镜像和 G 热备三份同 SHA-256，F 保留救急速查，20 个照片引用路径存在但照片内容不进入本页。native profile（原生配置档）未找到。",
      "Windows 当前观察到 F4b；F 根的 GIGABYTE.bin 与 fan 属于 F4b 救急材料，F12 是稳定归档，F13b 是 beta/archive-only（测试版仅归档）。刷写前必须现场确认精确主板、PCB revision、目标文件、hash、BitLocker/启动恢复条件和稳定供电；本模块从不自动刷写。",
      "只有 BIOS reset（重置）或明确升级后需要恢复设置时，才人工应用照片中已确认的核心项；未拍外围菜单保持“未验证的默认候选”。保存、重启、进入 Windows 后再读稳定机器投影，不能用 user_confirmed 替代 post-boot read-back（启动后回读）。",
      "WEPE/WinPE 先用 list disk / list volume 等只读观察识别物理盘、卷、文件系统、BitLocker 和安装目标；盘符按卷角色、内容锚点与现场重新映射，不能把旧 C/E/G/H 字母当设备身份。决定前禁止 clean、format、分区重建和 BCD 改写。",
      "驱动先恢复存储、芯片组、LAN、Wi-Fi、蓝牙、RAID/USB 等关键链；现有系统驱动导出含 230 个 package（驱动包），是匹配新硬件后可选择导入的候选，不保证换板兼容，也不替代厂商当前驱动。",
      "基础系统可登录联网后，从可信 GitHub clone PCConfig、.agents 和 GitHub 总索引三个控制面；再按稳定机器投影 v6 和现场 Provider 重建 PowerShell、Git、Node.js、Python、Go、.NET、WSL、Docker、Ollama 等实际需要的运行时。",
      "项目与用户层使用 17 个恢复锚点、15 个项目路径关系和 26 项 C 盘用户配置 inventory 做导航；先安装工具，再选择性恢复配置并按新盘符改引用，不整包灌回 AppData、cache、旧 session、旧 executable 或陈旧 PATH。",
      "计划任务恢复投影有 9 个阶段、53 个现行任务，启动快照有 17 项。先恢复项目、解释器、账号入口和配置，再按 rebuild_required、optional、manual_after_install、hold_for_user 与 vendor-owned 边界重建；任务 identity 使用 task_path + task_name，并保存 exact preimage。",
      "登录与秘密最后分层处理：GitHub/客户端重新登录，SecretRef 只盲用不出明文，Password Center 与媒体/PersonalData 走各自 P0–P7；恢复文件、恢复登录态和应用确认是三个不同结果。",
      "应用验收后才在新系统重新建立备份：发布 G Hot 上下文，并在用户提供 H 解锁窗口后用已验证 Hot 建 Cold。Hot 原子切换 current；Cold 重验卷身份、BitLocker、空间、48 小时时效和 closure，采用加法复制，不使用 /MIR。"
    ],
    flow: [
      "先回答是哪一种场景：同机重装、换机/换板、系统盘故障，还是只有 PE；记录现存机器、网络、可读磁盘、F/G/H、GitHub 权限和 P0–P7 Carrier。",
      "在任何写入前只读识别物理盘和卷：核对型号、容量、文件系统、BitLocker、恢复锚点与数据角色；建立本次盘符映射，不沿用旧字母猜测。",
      "若涉及 BIOS reset、升级或换板，先确认主板与 PCB revision、当前 BIOS 和供电；同板未变则保持现状，换板不套旧值，需要恢复时只手工应用已确认核心基线。",
      "验证 UEFI 启动链、WEPE/WinPE、Windows ISO 和目标盘；能进 PE 之后仍须分别验证内部盘与网络，未作决定前不 clean、不 format、不重分区、不改 BCD。",
      "安装 Windows 到已确认目标，先装存储/芯片组/网络等关键驱动；230 包导出按硬件兼容选择，缺驱动时优先使用精确主板/设备的官方当前版本。",
      "取得本人 GitHub 与客户端访问权，clone PCConfig、.agents、GitHub 总索引；验证 remote、identity、visibility、branch，Git 不恢复 worktree、未推送或未提交内容。",
      "按现场路径恢复稳定盘位、17 个锚点和 15 个项目关系；copy-first（先复制）、验证 target、改消费者引用，再决定旧路径是否退役。",
      "从官方来源安装当前兼容运行时和软件，按真实安装路径重建非秘密环境变量与 PATH；公共软件、AI、模型、OCR/ASR 放在依赖链后段。",
      "从 26 项 C 用户配置清单中按 Owner 选择恢复；Documents、Downloads、微信、存档保持原生格式，登录态、秘密、浏览器/聊天数据库不作为普通配置整包导入。",
      "依赖齐全后，按 9 阶段/53 任务重建计划任务，并对 17 个启动项逐个检查；只恢复现役且前置条件满足的项，不从旧 XML 复活退役任务。",
      "重新登录 GitHub、Codex 和必要应用；SecretRef、Password Center、媒体与其他受保护数据各走自己的人工因子与 P0–P7 恢复入口。",
      "自然启动 Windows 与关键应用，核对任务/启动链、项目打开、账号、Documents/Downloads/微信或应用数据可见和必要业务动作；把需登录、unknown 与失败项保留为独立结果。",
      "发布恢复后的稳定机器投影和必要 lifecycle event（生命周期事件），重建 G Hot；H 可用时再建立 Cold 并核对回执，使下一次恢复不依赖旧机器快照。"
    ],
    concepts: [
      { term: "BIOS/UEFI（主板固件设置）", explanation: "Windows 启动前的主板设置层。文字基线帮助人工恢复确认过的核心项，但不是可导入 Profile，也不自动刷写。" },
      { term: "PCB revision（主板电路板版本）", explanation: "同一商品名下的硬件修订版；刷 BIOS 和选驱动前必须现场确认，支持页路径不能替代板上标识。" },
      { term: "WEPE/WinPE（Windows 预安装环境）", explanation: "系统无法登录时用于识盘、联网、安装或修复的轻量环境；能启动不等于内部盘、网络和备份都可用。" },
      { term: "CoreRecovery（核心恢复）", explanation: "重装/换机后的恢复范围、来源、任务和 Hot/Cold 关系的主观察入口；不是磁盘镜像，也不读取私人 payload 正文。" },
      { term: "Hot（在线热备）", explanation: "G 上持续可访问的恢复上下文与已登记数据副本；完整写入 staging 并回读后才原子更新 current。" },
      { term: "Cold（人工冷备）", explanation: "H 上由用户提供解锁窗口的独立副本；只消费已验证 Hot，不反向改写 G，也不自动解锁或回锁。" },
      { term: "Closure（闭合清单）", explanation: "把规范文件名、schema、长度和 SHA-256 绑在一起，避免 current 指向不完整的一组文件。" },
      { term: "Selective restore（选择性恢复）", explanation: "备份可以宽，恢复只取经过 Owner、新硬件兼容和新系统验证的必要对象，不整包覆盖。" },
      { term: "present_verified / present_observed / user_confirmed（材料证据三种边界）", explanation: "前者证明材料存在且通过指纹检查；observed 只证明现场看见；user_confirmed 保存用户确认的生效语义。三者都不能替代未执行的自然重启或新机端到端验收。" },
      { term: "Recovery checkpoint（恢复检查点）", explanation: "每一层完成后可回读、可停下并继续的耐久状态，而不是一次长命令的临时输出。" }
    ],
    boundaries: [
      "不把 BIOS 变成独立模块；它只在同板设置丢失、明确升级或换板判断中作为恢复旅程的一步",
      "不自动刷写 BIOS，不根据文件较新、支持页 Rev. 1.0 线索或照片中的 Q-Flash 进度决定活动版本",
      "只读识盘完成前不 clean、format、改分区或 BCD；旧盘符不等于设备身份",
      "F 启动 U 盘不等于 G/H 数据备份，Windows ISO、WEPE 启动和应用数据恢复是三层证据",
      "不把 Git 工作树、未推送提交、untracked、ignored 或 .git 当普通备份 payload",
      "不递归复制整个 AppData，不把浏览器登录态或原始聊天数据库写入仓库",
      "不新增云上传、不切换账号、不读取活动 OAuth 私密内容",
      "230 个导出驱动包不保证换板或新系统兼容；关键驱动仍须按目标硬件和官方来源筛选",
      "普通恢复不接管 P0–P7、Password Center 或 personal-media 的 Carrier、因子与正式数据动作",
      "备份存在、任务 exit 0、文件复制或 hash 通过都不单独证明应用恢复",
      "冷备不使用 /MIR，不因版本多就删除未知历史包",
      "永久删除和秘密恢复始终保留精确人工门禁"
    ],
    failures: [
      { condition: "PE 能启动但看不到内部盘或网络", response: "保持 present_observed，不格式化 U 盘或内盘；先补存储/网络驱动和只读 smoke，仍不可见就停止该来源的恢复。" },
      { condition: "旧盘符与新机器不一致", response: "按物理盘、卷、文件系统、容量和恢复锚点重建映射，再更新项目/任务消费者；不创建同名字母空盘掩盖缺失。" },
      { condition: "主板 PCB revision 或当前 BIOS 无法确认", response: "不刷写、不导入旧设置；只保留文字基线与候选包，待现场确认精确板号、版本、文件、hash 和供电。" },
      { condition: "BIOS 设置已按记录填写但未做保存重启", response: "保持 user_confirmed 历史语义，当前恢复仍未完成；进入 Windows 后重新读取稳定机器投影并做稳定性验收。" },
      { condition: "导出驱动与目标硬件不兼容", response: "跳过该包，优先安装精确硬件的官方当前驱动；不因 230 包清单完整就强行批量安装。" },
      { condition: "CoreRecovery 当前区域检查", response: "manifest_contract、maintenance_inspect 和 task_contract 三项均 PASS；它证明恢复合同、10 个当前任务与 9 个备份集合可观察，不覆盖新机应用验收。" },
      { condition: "H 锁定、缺失或卷身份不符", response: "Cold 返回 skipped 或 fail，既不写入介质，也不自动解锁、锁卷或改变设备信任。" },
      { condition: "Hot closure 或时效不满足", response: "Cold 不复制，也不用进程成功值或旧 current 补齐。" },
      { condition: "复制中断或校验失败", response: "保留逐项结果、旧 current（当前完整状态）和 source（恢复来源）；不切消费者，不清旧路径。" },
      { condition: "任务或启动项定义已恢复但自然启动失败", response: "区分身份、Action、权限、依赖和应用 Owner 结果；不靠手动点开一次或旧 LastTaskResult 冒充自然启动通过。" },
      { condition: "应用数据已复制但客户端不可见", response: "保持恢复未完成，回到应用 Owner 做原生打开、账号、数据格式和一致性验证。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\core_recovery.json", role: "核心恢复 scope、备份集合、外部 Owner 和成功条件" },
      { path: "E:\\PCConfig\\registries\\recovery_kit.json", role: "F/G/H 恢复介质、UEFI/WEPE、Windows ISO、230 包驱动导出、BIOS/驱动归档及证据状态" },
      { path: "E:\\PCConfig\\docs\\recovery\\bios-settings.md", role: "照片固化的 BIOS/UEFI 核心基线、F4b/F12/F13b 边界与恢复后回读要求；不包含照片原件" },
      { path: "E:\\PCConfig\\registries\\project_restore_anchors.json", role: "17 个开发存储恢复锚点" },
      { path: "E:\\PCConfig\\registries\\projects.json", role: "15 个项目及当前路径导航" },
      { path: "E:\\PCConfig\\registries\\c_user_config_inventory.json", role: "26 项 C 盘用户配置及选择性恢复分层" },
      { path: "E:\\PCConfig\\registries\\scheduled_task_rebuild_plan.json", role: "9 个阶段、53 个现行任务、恢复决定与授权边界" },
      { path: "E:\\PCConfig\\registries\\startup_snapshot.json", role: "17 个启动项的现场观察与用途分类" },
      { path: "E:\\PCConfig\\registries\\stable_machine_projection.json", role: "版本 6 的硬件、磁盘和运行时稳定基线" },
      { path: "E:\\PCConfig\\registries\\backup_media_structure.json", role: "Hot/Cold 介质结构导航" },
      { path: "E:\\PCConfig\\registries\\acceptance_checklist.json", role: "分区域验收入口，当前 core_recovery 精确选择三项" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.core-recovery.md", role: "CoreRecovery、Hot/Cold 和选择性恢复合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.recovery-privacy.md", role: "迁移、秘密与私人 payload 边界" },
      { path: "E:\\PCConfig\\docs\\recovery\\START_RECOVERY.md", role: "同机重装、换机、系统盘故障与仅 PE 的第一入口和来源分流" },
      { path: "E:\\PCConfig\\docs\\recovery\\scheduled_tasks_rebuild.md", role: "项目/运行时先于任务的九阶段人类恢复说明" },
      { path: "E:\\PCConfig\\docs\\recovery\\private_config_restore.md", role: "重新登录、SecretRef、Password Center 与 P0–P7 分层" }
    ],
    verification: [
      "2026-08-31 现场：PCConfig PRIVATE main=origin/main=d4480abc17574177b91e52b0aff9aebd30583f58，worktree clean；node tools\\validate_recovery_kit.mjs 返回 16 assets、0 error、0 warning",
      "同次只读 CoreRecovery Inspect 返回 pcconfig.core_recovery_observation.v2、status=ready、warnings=[]，报告 10 个任务、9 个 backup set、2 个 external owner；不枚举 payload 名称或正文",
      "同次 Invoke-PCConfigAcceptance.ps1 -NoWrite -Area core_recovery -Json 返回 3 PASS、0 fail、0 unknown、0 blocking_unresolved",
      "Invoke-StableMachineProjection.ps1 -Action Read -Json 返回 projection_version=6；project_restore_anchors、projects 与 c_user_config_inventory 分别登记 17、15、26 项",
      "scheduled_task_rebuild_plan.json 当前为 9 个阶段、53 个任务；startup_snapshot.json 当前观察 17 个启动项。两者是重建导航，不单独证明自然启动",
      "BIOS 文字记录的 E 源、E 镜像与 G 热备三份 SHA-256 均为 2FE3B5C7…B0E21B；F 救急速查存在。20 个引用照片路径只做存在性检查，本次未读取照片",
      "BIOS 核心基线为 present_verified，CPU/内存生效为 user_confirmed；native_profile_status=not_found，PCB revision、保存后自然重启和完整外围菜单仍未独立验证",
      "F 的 UEFI→PE 启动由用户确认；WEPE 隐藏分区仅 present_observed，内部 Windows 磁盘可见和网络可用的 PE smoke 仍未执行",
      "H 冷备、新机/换板端到端恢复、恢复后的 Hot/Cold 重建，以及各应用自然启动与数据可见仍是命名缺口，不从静态校验或当前机器状态推断通过",
      "core_recovery_maintenance.test.ps1 覆盖 Inspect、Hot、Cold、closure、时效、卷身份和中断回执",
      "build_scheduled_task_rebuild_plan.test.mjs 与 validate_scheduled_task_rebuild_plan.test.mjs 覆盖任务恢复投影",
      "acceptance runner 的精确 area/check selector、超时、unknown 和有界输出由 invoke_acceptance_checks.test.ps1 验证"
    ],
    relation: "本模块是 PCConfig 从机器断点回到可用电脑的完整旅程：机器事实模块提供主板、磁盘、盘符、锚点和项目路径；运行时与启动模块提供软件、任务和自然启动链；秘密模块负责重新登录与 SecretRef；受保护数据模块继续独立承担 P0–P7 Carrier、因子和正式数据恢复。BIOS/UEFI 归这条恢复旅程，不另拆模块。"
  },
  {
    slug: "secondary-laptop",
    shortTitle: "副驾驶笔记本",
    title: "副驾驶笔记本、跨设备接管与独立恢复",
    teaser: "让一台真正登记的 Windows（微软操作系统）笔记本承担远控、轻量开发和台式机 NVMe（固态硬盘）故障接管，同时拥有自己的健康检查、恢复胶囊和不覆盖旧数据的换机流程。",
    status: "已登记 1 台副驾驶笔记本 LAPTOP-E48N0DRJ；角色、健康 Provider（现场读取器）与恢复源码存在且离线回归通过，本次从 WLY 主机只得到 not_applicable/host_mismatch，笔记本当前现场、恢复 U 盘和 NVMe 外置演练仍未知",
    statusTone: "mixed",
    searchProjection: {
      intents: ["查看副驾驶笔记本能做什么", "离开台式机继续工作", "检查笔记本健康", "重装副电脑并恢复", "台式机坏后用笔记本接管", "笔记本丢盘后恢复"],
      entities: ["LAPTOP-E48N0DRJ", "ToDesk", "Tailscale", "FlyingBird", "CodexRecovery-SecondaryLaptop", "恢复胶囊 USB", "原台式机 GM7000 NVMe"],
      relations: ["台式机主工作站与笔记本副驾驶分工", "主机身份决定账本和 Provider 是否适用", "本地 rollback 与独立 USB 灾备分层", "Git 项目与无远端项目恢复方式不同", "原 NVMe 临时接管不改写台式机事实"],
      failureRecovery: ["host_mismatch 返回 not_applicable", "断网时不开放 LAN 或公网替代", "空白新机保持 writer 冻结", "U 盘不在保持正常等待", "NVMe 接管未验不冒充可用", "无远端项目明确保全或接受丢失"]
    },
    value: "我不在台式机旁边时，这台笔记本可以作为副驾驶完成远控、文档、Git（版本控制）和轻量开发；台式机非硬盘硬件故障时，它还可以读取原 NVMe 上的代码和工作区继续最必要的工作。笔记本自己重装、换机或丢盘时，则从独立恢复胶囊重建，而不是复制台式机或让空白新机反向覆盖旧备份。",
    why: "只有一台高性能主工作站时，离开主机、远控故障、主板/电源故障或笔记本自身重装都会中断工作。简单把两台电脑做成全盘镜像会同步错误驱动、登录态、硬件配置和损坏状态；只靠 Git 又覆盖不了未入库的普通文件、设备服务、网络边界和恢复写入门。副驾驶需要自己的角色、现场健康、数据范围和恢复生命周期。",
    example: "例如台式机因主板故障无法开机，但原 4 TB NVMe 完好。我用笔记本自己的 Windows 启动，把原盘装进已验收的 NVMe 硬盘盒，只读确认分区和 E/V 锚点，从实际根读取 PCConfig、规则和项目；普通 Git、文档和轻量开发可继续，台式机驱动、任务、登录态和 GPU 能力不会被继承。修复主机前提交或备份新增工作，再卸载 VHDX、安全弹出并把原盘装回。",
    result: "我最终得到一张清楚的双机能力图：台式机负责什么、笔记本日常能独立做什么、哪些动作依赖主机或网络、事故时从 Git/胶囊/原 NVMe 哪条路接管、账号与秘密怎样重新建立、当前哪些只完成源码和离线测试、哪些必须回到真实笔记本或介质验收。",
    readerStates: {
      pass: "实时主机身份匹配副驾驶笔记本，远控、Tailscale、防火墙、开发工具、恢复任务、本地世代和在场介质均按合同回读时，分别显示日常可用能力与恢复准备度；整机恢复还要完成用户验收后才能启用 writer。",
      problem: "服务、精确防火墙、任务信任链、世代闭合、存储空间或恢复来源明确不满足时，只阻断对应日常或恢复能力，保留现有数据和 writer 冻结状态，不自动放宽网络或覆盖旧胶囊。",
      unavailable: "当前不在 LAPTOP-E48N0DRJ、笔记本离线、USB 未接入/未解锁或原 NVMe 未装入时，对应现场结论保持 not_applicable 或 Unknown；账本仍说明设计，但不冒充设备当前健康。"
    },
    decisionImpact: [
      "WLY 是主工作站，承担 canonical E/V/Z、G 在线备份和本地重型 GPU/OCR/ASR；LAPTOP-E48N0DRJ 是副驾驶/备用终端，不复制主机职责。",
      "日常远控以 ToDesk 为主，Moonlight/Sunshine 只作备用；双机发现和精确访问走 Tailscale，不为方便开放普通 LAN 或公网。",
      "笔记本可以有自己的 WSL2、Docker 和开发工具，但 Docker 登录自启关闭、Kubernetes 不启用，重型能力必须按当前宿主重新验收。",
      "PCConfig PRIVATE Git 同步版本化账本和恢复源码，不同步实时机器状态、用户文件、登录态或秘密，也不把一台机器的盘符写成另一台事实。",
      "恢复胶囊只覆盖登记的 Desktop、Documents、Downloads 和窄 Codex 策略束；GitHub-backed 项目重新 clone，无远端项目必须另选 PRIVATE Git、加密导出或明确接受丢失。",
      "本地 rollback cache 与笔记本 C: 在同一物理故障域，只帮助同机回滚；只有独立、已绑定且加密的 USB 世代能承担笔记本丢盘/换机介质角色。",
      "台式机 NVMe 外置接管只把原盘作为数据与工作区来源；不从外置盘启动 Windows，不恢复台式机任务/驱动，也不改写 WLY Registry。",
      "公司内网转接尚未激活；离开公司或断网时，不自动发布网段、切换未登记代理或把临时网络路径固化成长期配置。"
    ],
    problem: "副驾驶不是“装了几个软件的第二台电脑”。它同时涉及两台主机的事实隔离、日常远控、端口和防火墙、可离线的工具基线、跨设备数据来源、笔记本自身灾备、空白新机防覆盖，以及台式机故障时的临时 NVMe 接管。漏掉任一层，都可能把远控可用误写成可恢复，把源码测试误写成设备健康，或让新机第一次备份覆盖唯一旧世代。",
    implementation: [
      "唯一登记的笔记本主机为 LAPTOP-E48N0DRJ，角色是 secondary-laptop。只有计算机名精确匹配、活动用户根为 C:\\Users\\wly 且本地规则入口存在时，副驾驶账本和该主机 Codex 入口才适用；其他主机返回 not_applicable/host_mismatch。",
      "副驾驶稳定职责包含 ToDesk 日常远控、Tailscale 双机通道、FlyingBird 服务、可选 Moonlight；台式机代理 7892 只经 tailnet Serve 使用，PostgreSQL 45432 只读测试入口和笔记本 SSH 22/RDP 3389 只允许登记的台式机 Tailscale 对端。",
      "WLY 主工作站自己的 RDP 3389 暴露由 rdp_tailscale_exposure Registry 单独管理，只允许登记的同用户 Tailscale peers，并保留 ToDesk 与既有 Serve/Funnel；它与笔记本入站规则不能互相复制。",
      "笔记本默认阻止入站；精确防火墙只接受 Tailscale 接口上的登记对端。公司网段转接未激活，宽泛 Tailscale-In 规则在系统或 Tailscale 更新后须重新确认未被启用。",
      "副驾驶 IPv4/IPv6 TCP active/persistent 动态范围登记为 49152–65535，旧 MaxUserPort=15000 应保持移除；Codex localhost:1455 再现 10013 时重查范围、排除段和真实 listener，不用循环重启 WinNAT 或新增普通 excluded range 掩盖根因。",
      "运行基线登记 Git/LFS、VS Code、Python/uv、Temurin JDK 21、Maven、psql、WSL2 Ubuntu 24.04 与 Docker Desktop。Docker 使用 WSL2/Linux 容器、关闭登录自启和 Kubernetes；WSL/Docker 停止是正常状态，健康检查不会为验证启动它们。",
      "Get-SecondaryLaptopHealth.ps1 是唯一只读健康入口：检查 role.machine、远控/网络/防火墙、recovery.task/local/usb、BitLocker、WinRE、WSL2、Docker、空间、工具和 PCConfig Git。它不联网、不提权、不启动服务、不解锁 U 盘、不触发备份或写健康快照。",
      "恢复内核安装在管理员保护的 C:\\ProgramData\\CodexRecovery\\secondary-laptop；唯一任务 CodexRecovery-SecondaryLaptop 每天 09:00 和 21:00 以 S4U + Highest 运行，恰好一个 System32 wscript.exe //B //NoLogo Action，再调用受保护 pwsh，全链不得引用普通用户可写代码。",
      "任务信任链覆盖 ProgramData 祖先、安装根、launcher、Backup 脚本、settings、deployment manifest、runtime receipt、实际 pwsh 和 Windows Task Scheduler 定义；reparse、非可信 Owner 或可替换叶文件都阻断，不能只检查安装根 ACL。",
      "writerState 固定为 restore_pending → restored_unaccepted → writer_activated。新机和重装默认禁用任务；-Force 不能越门。Mark 与 Activate 在两个进程中重新验证同一个 current、generation、manifest、closure、exact set、长度和 SHA-256，最后由用户确认才启用 writer。",
      "本地与 USB 都用原子世代和 current.json，默认保留 2 个已验证世代；距离上次成功至少 7 天才生成新世代。USB 未接入、未解锁或未绑定是正常等待，不推进 USB 成功时间。",
      "USB 首次绑定只接受 BusType=USB、稳定卷/磁盘身份、BitLocker FullyEncrypted + Protection On 且路径无 reparse；绑定本身不备份，只有 writer_activated 后显式 CreateInitialBackup 才写第一个世代。",
      "胶囊对用户文件只做 Desktop、Documents、Downloads 的非破坏性合并；同名和敏感候选先预览。它不复制整棵 AppData、旧驱动/OEM/电源计划、浏览器或 Codex 登录态、活动 WSL/Docker VHDX、密码、Token、Cookie、私钥或设备身份密钥。",
      "Codex 策略只保存不可自动加载的三项惰性束：唯一规则正文、worker 定义和 [agents] 两键投影；恢复时物化到新用户唯一目标并语义合并，不恢复整个 .codex 或 raw config.toml。",
      "副驾驶重装顺序是 Windows/网络 → Git 与 PCConfig 账本 → Tailscale/ToDesk/FlyingBird → 经确认用户文件 → 开发工具 → 人工重建 WSL/Docker → 可选 Moonlight → 精确防火墙 → 整体验收 → writer 激活。账号与设备配对在目标机重新完成。",
      "台式机故障接管默认由笔记本自己的 Windows 启动，原 Predator GM7000 只作为数据盘；动态根记为 DesktopDataRoot，原 E/V 可按需读取或挂载，Z 重建，G 默认不挂载。缺少原机应用、服务或登录态不阻断 Git/文档接管。",
      "启动 LocalGpuBroker、Ollama、本地模型、LocalOCR 或 ChineseASR 前必须对笔记本当前硬件运行重型能力检查；不满足就零启动、零目录创建，普通 Codex、Git 和文档继续，不把临时宿主观察写回 WLY 稳定投影。"
    ],
    flow: [
      "先确认现实目标：日常离开主机继续工作、笔记本自身重装/换机、笔记本磁盘故障，还是台式机非硬盘故障后的临时接管。",
      "回读当前计算机名和用户根。只有精确命中 LAPTOP-E48N0DRJ/C:\\Users\\wly 才运行副驾驶 live Provider；在 WLY 或其他主机只读账本，不加载对方本地路径。",
      "日常使用先验证 Tailscale、ToDesk/FlyingBird、精确防火墙和所需开发工具；台式机代理、数据库或远控不可达时，列出依赖并继续本地可做的 Git、文档和轻量开发。",
      "笔记本重装或换机时先保持恢复任务 Disabled 与 writerState=restore_pending，从 USB 胶囊 current 指向的已提交世代读取 START_FOR_CODEX、desired、snapshot、manifest 和 closure。",
      "生成一页恢复预览，分成自动执行、需要登录/配对、冲突/跳过；用户集中确认后，非破坏性恢复 Desktop、Documents、Downloads 和窄 Codex 策略。",
      "从 PRIVATE PCConfig 刷新账本；Git-backed 项目重新 clone。对每个无远端 V 项目选择 PRIVATE Git、加密导出或明确接受丢失，不把它们假装包含在胶囊。",
      "按目标机重新安装工具、Tailscale、ToDesk、FlyingBird；人工重建 WSL2/Docker，只从停机导出或 Owner-aware 导出恢复不可再生数据。",
      "重新登录 Codex、Tailscale、ToDesk、FlyingBird、浏览器和其他身份应用；秘密只经凭据 Owner、Provider 或 SecretRef，不复制旧 session。",
      "恢复文件后以真实胶囊来源标记 restored_unaccepted；检查服务、工具、精确防火墙、文件和仍缺项目，用户确认整体可用后再 Activate writer。",
      "writer 激活后才绑定/验证独立 USB，并显式创建初始世代；未接入或未解锁时保留正常等待，本地 rollback 继续但不冒充灾备。",
      "台式机故障接管时，用笔记本自己的 Windows 启动并取消任何初始化/格式化提示；只读识别原 GM7000、分区和锚点，从 DesktopDataRoot 工作。",
      "需要 V 项目时先只读检查 Dev Drive VHDX，再在 V: 空闲且确需写入时挂载；不恢复 Z，不默认挂 G，不把临时盘符写回 PCConfig。",
      "接管结束前提交或备份新增工作，停止外置盘消费者，卸载 VHDX 并安全弹出；原盘装回 WLY 后再以原机现场重建 E/V/Z、任务、运行时和备份结论。"
    ],
    concepts: [
      { term: "Host-scoped ledger（主机限定账本）", explanation: "只有主机身份和用户根同时匹配时才解释该设备现场；在别的电脑上只能作为设计与恢复导航。" },
      { term: "Secondary laptop（副驾驶笔记本）", explanation: "承担远控、轻量开发和应急接管的备用 Windows 设备，不是台式机硬件、任务和盘符的镜像。" },
      { term: "Health Provider（健康读取器）", explanation: "一次只读检查设备角色、网络、运行时、任务和恢复链；它不修复、不联网，也不启动或备份。" },
      { term: "Recovery capsule（恢复胶囊）", explanation: "由目标状态、窄用户文件、惰性 Codex 策略、世代 manifest 和恢复入口组成的笔记本重建包。" },
      { term: "Writer state（备份写入者状态）", explanation: "控制空白/未验新机何时可以开始覆盖性风险最低的后续备份；只有用户验收后才激活。" },
      { term: "Local rollback cache（本机回滚副本）", explanation: "与笔记本系统盘同故障域的快速回退材料，不能替代独立 USB 灾备。" },
      { term: "USB generation（USB 恢复世代）", explanation: "写入已绑定加密介质、经 exact-set/长度/SHA-256 验证后由 current 指向的完整版本。" },
      { term: "External NVMe takeover（原盘外置接管）", explanation: "把故障台式机的原 NVMe 接到笔记本，只作为数据与工作区来源，不从它启动或把笔记本改写成主机。" },
      { term: "DesktopDataRoot（原台式机数据根）", explanation: "外接后按现场得到的临时根，不把临时盘符固化回台式机 Registry。" },
      { term: "Heavy-runtime gate（重型运行能力门）", explanation: "在临时宿主上启动 GPU 模型/OCR/ASR 前重新检查内存、GPU、命令和资源路径，不继承台式机能力声明。" }
    ],
    boundaries: [
      "不把副驾驶账本变成跨主机全局规则，不从机器名称之外的猜测加载 C:\\Users\\wly 或 V:\\GitHub\\PCConfig",
      "不后台同步两台电脑的完整磁盘、AppData、任务、注册表、驱动、登录态或秘密",
      "不把 PCConfig Git checkout 或源码测试冒充笔记本当前服务、任务、BitLocker、WinRE、USB 或远控健康",
      "不把 ToDesk 当通用端口隧道，不为 7892 开 Funnel，不把 SSH/RDP 放宽到 LAN、公网、整个 tailnet 或公司网段",
      "不为了健康检查启动 WSL、Docker、服务、备份、UAC、重启或 USB 解锁",
      "不让 restore_pending 或 restored_unaccepted 的新机运行备份，即使使用 -Force",
      "不把同盘 local cache 称为换机/丢盘备份，不在 USB 未绑定/未加密时写用户世代",
      "不复制整棵 .codex、raw config.toml、旧 session、Cookie、Token、密码、设备密钥或原始数据库行",
      "不热拷 WSL ext4.vhdx 或 Docker VHDX；不可再生内容只从停机/Owner-aware 导出恢复",
      "不从外置 GM7000 启动 Windows，不初始化、格式化、修复分区或重建 EFI/BCD",
      "不因临时盘符、笔记本硬件或任务变化更新 WLY 的 canonical Registry",
      "不假定 NVMe 硬盘盒已购入、兼容或验收，不假定笔记本可挂 ReFS VHDX 或解锁跨机 BitLocker"
    ],
    failures: [
      { condition: "在 WLY 或其他非目标主机调用健康入口", response: "返回 not_applicable/host_mismatch，只报告当前主机名；不读取或套用副驾驶路径和现场结论。" },
      { condition: "Tailscale、ToDesk 或 FlyingBird 不可用", response: "区分双机发现、远控和本地工作；不开放 LAN/公网、不切未登记代理，本地 Git/文档能力按实际继续。" },
      { condition: "台式机代理 7892 或 PostgreSQL 45432 不可达", response: "只暂停依赖它的代理或只读测试路径，不把笔记本整体判坏，也不新增公开端口。" },
      { condition: "BitLocker/WinRE 在非管理员会话不可读", response: "策略可保持 pass，证据状态保留 unknown；需要完整验收时另开明确现场任务。" },
      { condition: "恢复任务定义正确但 ACL 或信任链不可读", response: "保持 block/unknown，不把安装根看起来正常写成安全；不得启用任务。" },
      { condition: "恢复 U 盘未接入、未解锁或未绑定", response: "返回正常等待，不告警、不自动解锁、不推进 USB 成功时间；本地副本仍不升级为灾备。" },
      { condition: "新机数据已复制但尚未整体验收", response: "保持 restored_unaccepted 和任务 Disabled；继续验证服务、文件、登录、项目与防火墙，不能提前激活 writer。" },
      { condition: "胶囊 current、manifest、closure 或 payload 不一致", response: "停止恢复/激活，保留旧世代与来源；调用方声明的 generation id 或 digest 不能补齐真实证据。" },
      { condition: "V 盘无远端项目没有独立导出", response: "明确列为单机故障风险，选择 PRIVATE Git、加密导出或接受丢失；不声称胶囊或 PCConfig Git 已覆盖。" },
      { condition: "外接 NVMe 出现初始化/格式化提示或身份不清", response: "取消写入，只读核对磁盘、分区和锚点；无法确认就停止接管并保留原盘。" },
      { condition: "笔记本不满足重型 GPU 能力门", response: "LocalGpuBroker、模型、OCR/ASR 零启动；普通 Codex、Git 和文档继续，必要时使用已授权云能力。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\recovery\\副驾驶笔记本账本.md", role: "副驾驶角色、日常能力、网络边界、运行基线和 host-scoped 事实" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.secondary-laptop-health.md", role: "唯一健康 Provider 的检查 ID、证据双轴、正常例外与隐私边界" },
      { path: "E:\\PCConfig\\tools\\Get-SecondaryLaptopHealth.ps1", role: "副驾驶笔记本只读健康入口；主机不匹配时提前返回" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\README.md", role: "受保护安装、任务、writer 状态机、USB 世代和恢复命令合同" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\config\\desired.yaml", role: "副驾驶目标软件、WSL/Docker、启动、网络、数据和人工动作基线" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\config\\settings.json", role: "恢复 profile、7 天周期、2 世代保留、本地根和三类用户文件范围" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\templates\\START_FOR_CODEX.md", role: "新机先冻结 writer、恢复预览、两阶段验收和激活顺序" },
      { path: "E:\\PCConfig\\docs\\recovery\\nvme_enclosure_takeover.md", role: "台式机非硬盘故障时的原 NVMe 外置接管与结束流程" },
      { path: "E:\\PCConfig\\docs\\recovery\\codex_login_10013.md", role: "副驾驶 localhost 1455 与动态端口范围的持久修复/复核边界" },
      { path: "E:\\PCConfig\\registries\\rdp_tailscale_exposure.json", role: "WLY 主工作站 RDP 的独立 Tailscale-only 对端、规则与保留入口" },
      { path: "E:\\PCConfig\\tools\\test_secondary_laptop_recovery.test.ps1", role: "恢复胶囊、writer、USB、ACL、任务和负例的离线回归" }
    ],
    verification: [
      "2026-08-31 从 WLY 主工作站调用 Get-SecondaryLaptopHealth.ps1 -Json 返回 schema=pcconfig.secondary-laptop-health.v1、status=not_applicable、reason=host_mismatch；这证明 host gate 正常，不证明笔记本健康",
      "get_secondary_laptop_health.test.ps1 本次离线 fixture 通过；它验证 Provider 的角色、网络、任务、恢复、unknown 和 host mismatch 语义，不替代目标设备现场",
      "test_secondary_laptop_recovery.test.ps1 本次完整离线回归通过；它证明恢复胶囊的 writer/世代/USB/ACL/任务负例实现，不证明真实笔记本或介质已恢复",
      "恢复源码固定 profileId=secondary-laptop、writerState 默认 restore_pending、backupIntervalDays=7、generationRetentionCount=2，dataSources 仅 Desktop/Documents/Downloads",
      "健康合同覆盖 ToDesk/Tailscale/FlyingBird、精确防火墙、CodexRecovery-SecondaryLaptop、local/USB 世代、BitLocker/WinRE、WSL2/Docker、空间、工具与 Git；Provider 明确零网络、零写入",
      "副驾驶当前服务版本、任务最近结果、BitLocker/WinRE、USB 绑定/世代、实时防火墙和项目盘状态未从目标笔记本回读，均保持 Unknown",
      "原 GM7000 通过硬盘盒的真实识盘、持续读取、跨机 BitLocker、ReFS Dev Drive VHDX 挂载和重型能力尚未做端到端演练"
    ],
    relation: "机器事实模块保留主机身份与盘符事实，运行时模块解释单机软件/任务，普通恢复模块负责 WLY 主工作站重装链，秘密模块负责目标设备重新登录与 SecretRef；本模块独立拥有副驾驶产品角色、双机网络、笔记本恢复胶囊和原 NVMe 临时接管。它不复制这些模块，也不把笔记本变成第二个主工作站。"
  },
  {
    slug: "secrets-providers",
    shortTitle: "秘密与服务入口",
    title: "SecretRef（秘密引用）与固定 Workspace Provider（办公服务读取器）",
    teaser: "让程序完成登录、盲填和固定账号的类型化动作，同时让密码、令牌、银行卡和账号会话始终留在受保护运行库。",
    status: "秘密代理可用；Password Center 安装态 current；固定 Workspace 仅完成零网络绑定检查，远端实读本次未复核",
    statusTone: "mixed",
    searchAliases: ["让程序用密码但不显示", "盲填银行卡但不要提交", "固定Workspace账号怎样读邮件云盘日历", "换电脑后能不能复制登录状态", "SecretRef怎样恢复"],
    searchProjection: {
      intents: ["让程序使用凭据但不显示", "盲填银行卡但不提交", "在新设备重新登录", "读取固定 Workspace 账号", "恢复 SecretRef"],
      entities: ["SecretRef", "Secret Broker", "Password Center", "google-workspace.primary / v1.1.0", "Browser Bridge", "CurrentUser DPAPI"],
      relations: ["秘密绑定精确执行目标", "账号绑定限制Provider动作", "设备变化要求重新登录", "Browser Bridge只绑定唯一网页", "普通恢复只引用秘密入口"],
      failureRecovery: ["凭据不可用暂停对应动作", "scope不匹配不换账号", "网络失败不判凭据失效", "旧登录态不跨设备复制", "Reveal缺新鲜因子时零字段返回"]
    },
    value: "自动化可以真正使用账号、API（程序接口）和银行卡字段，却不把密码、令牌或卡号交给模型。需要人工验证时只完成那个精确边界，日常任务不会因此获得批量明文能力。",
    why: "把秘密写进环境变量、命令行、日志或聊天会扩大泄漏面；把 Provider 做成可临时换账号、网址和任意请求体的通用网络入口，又会让一次授权扩散到其他账号和动作。",
    example: "例如我说“在当前支付页填我选中的银行卡，但不要提交”。系统确认唯一 HTTPS tab、origin、frame 与标准字段后，用一次性能力原子盲填卡号、有效期和 CVV；模型看不到值，提交按钮仍由我决定。另一个例子是读取邮件：只能用已登记的固定 Workspace binding 和类型化 Gmail action，不能临时换账号或构造任意 URL。",
    result: "正常时得到登录、盲填或类型化账号动作的业务结果，以及固定不含明文、token 或 client secret 的回执。身份、设备、scope、网络或 Provider 有问题时只暂停对应动作并返回精确状态，不静默换账号、复制旧会话或降级为明文。",
    readerStates: {
      pass: "SecretRef 路线核对登记 executable、参数目标或受控输入，Workspace 路线核对固定 binding（绑定）、scope（权限范围）和 typed action（类型化动作）；两者只返回业务结果与无明文回执。",
      problem: "目标程序、网页、账号、scope 或 Provider 不匹配时停止对应动作，不静默切换账号、扩大授权或把明文交给调用者。",
      unavailable: "最高权限、设备信任、秘密代理、账号授权或固定 Provider 不可用时暂停对应动作，保留精确恢复入口；秘密不会转入聊天、日志、命令行或普通回执。"
    },
    decisionImpact: [
      "默认完成“使用秘密”，不默认 Reveal（显示明文）。",
      "AgentLogin（浏览器盲填）只匹配精确 tab、origin 和 frame；AgentSecretRef 只匹配登记 executable、参数目标或受控输入通道。",
      "固定 Workspace Provider 只有一个 binding，动作不能在运行时选择其他账号。",
      "当前精确 Provider kind=pcconfig-google-workspace-direct、version=1.1.0、binding id=google-workspace.primary；这些是公开安全的执行身份，不包含账号值。",
      "只有 Gmail、Drive 和 Calendar 通过同一 Provider 的真实读取验收后，Read action（读取动作）才成为默认能力；当前仅证明零网络 binding（绑定）已配置，尚未证明远端 OAuth（账号授权）和实际读取可用。Write action（写入动作）还必须对每种动作独立验收，并由本轮明确对象和内容授权。",
      "OAuth enrollment（账号授权登记）只在前台进行一次，callback（回调）使用随机 loopback 端口与 PKCE（授权码保护）。",
      "换电脑、重装或从台式机切到副驾驶时，非秘密配置可以按新路径重建，但 DPAPI 状态、账号 session 和设备信任不跨机复制；目标设备必须重新登录或从正式 Recovery Set 恢复。",
      "Secret Broker 状态通过不证明每个外部网站、账号、网络请求或授权文件真实操作当前都成功。"
    ],
    problem: "凭据系统常见两个极端：要么所有自动化都能读明文，要么秘密封得太深，真实任务无法使用；通用网络入口还会把一个固定账号动作扩大成任意账号和任意请求。",
    implementation: [
      "运行时数据库、密钥包和恢复材料位于 Git 仓库外并加密；PCConfig source 只保存策略、SecretRef、无秘密 Registry 和测试。",
      "AgentSecretRef 把 SecretRef 绑定到登记 executable、argv（参数）或 stdin（标准输入）目标；目标 hash、参数位置和调用方都必须匹配。",
      "Reveal 只允许用户明确点名的单个字段；批量恢复查看即使获准也不得进入模型、聊天、stdout、JSON、日志、剪贴板或普通文件。",
      "Secret Broker status 当前明确 plaintext_returned=false、key_project_touched=false、remote_fetch_performed=false，安全核心和 product closure（产品闭环）均 pass。",
      "当前唯一 optional gap 是外部密码管理器缺少逐条公开 API；它不会把核心状态改写为失败，也不会授权抓取浏览器数据库。",
      "Workspace credential state 使用 CurrentUser DPAPI；状态检查只看固定路径和文件存在性，不解密，2026-08-29 返回 configured、credential_state_present=true、credential_state_decrypted=false、zero_network=true。",
      "pcconfig-google-workspace-direct v1.1.0 固定使用 google-workspace.primary，服务面只有 Gmail、Drive、Calendar；MCP（模型上下文协议）只读工具固定为 gmail_search、gmail_get_message、gmail_get_thread、gmail_list_labels、drive_search、drive_get、drive_list_permissions、drive_export、calendar_list_calendars、calendar_events。",
      "副驾驶恢复胶囊明确排除密码、Token、Cookie、私钥、设备身份密钥、Codex 登录态和 raw config.toml；只恢复无秘密 [agents] 两键投影，账号在目标机按官方流程重新建立。",
      "Provider 暴露 Gmail（邮件）、Drive（云盘）和 Calendar（日历）的 closed action allowlist，没有通用 URL、HTTP method（请求方法）、body 或账号透传。",
      "access token（访问令牌）只在当前进程内存在；receipt（执行回执）明确 token_returned=false、client_secret_returned=false。"
    ],
    flow: [
      "先区分请求是使用 SecretRef、浏览器盲填还是执行固定账号动作；各路线不得静默合并",
      "用固定 SecretRef、网页目标或 binding 定位精确 Owner 和动作",
      "先确认当前设备、用户身份、运行时和设备信任；设备变化时把旧 DPAPI/session 视为不可直接继承",
      "需要人类因子时冻结精确 action 与 target，由最高权限策略选择当前有效已登记因子",
      "SecretRef/Provider 分支只在受保护进程内解密或刷新短时凭据，再盲填、盲注入或执行类型化动作",
      "完成后回执只返回 action、状态和有界错误码，不返回凭据或 token",
      "换机恢复时在目标设备重新登录；SecretRef、账号状态和普通 Vault 各走自己的恢复流程"
    ],
    concepts: [
      { term: "SecretRef（秘密引用标识）", explanation: "稳定指向一个秘密的名字；调用者使用它，不知道也不接收秘密值。" },
      { term: "Blind injection（盲注入）", explanation: "秘密直接进入登记程序的受控输入，不经过模型、终端、环境变量、日志或剪贴板。" },
      { term: "Binding（固定绑定）", explanation: "把 Provider、账号身份、scope、状态路径和端点固定在 Registry 中，动作不能临时换账号。" },
      { term: "OAuth（账号授权协议）", explanation: "用户在官方页面同意固定 scope，Provider 用授权码换取并安全保存 refresh token（刷新令牌）。" },
      { term: "PKCE（授权码保护）", explanation: "给一次 OAuth 流程绑定 code verifier（校验秘密），降低授权码被截获后复用的风险。" },
      { term: "Typed action（类型化动作）", explanation: "每个邮件、云盘或日历操作都有固定参数 schema，不允许调用者构造任意网络请求。" },
      { term: "Device trust（设备信任）", explanation: "某项秘密是否允许在当前 Windows 身份与设备使用的独立事实；复制文件、管理员权限或旧登录态不能继承。" },
      { term: "google-workspace.primary", explanation: "PCConfig v1.1.0 唯一固定的 Workspace binding id；它绑定一个既定账号，但公开页不披露账号值。" }
    ],
    boundaries: [
      "不在仓库、模型上下文、stdout、JSON、日志或剪贴板保存秘密值",
      "不把 Cookie、浏览器 profile、会话数据库或完整环境文件作为导入源",
      "不因管理员权限令牌、插件或账号登录扩大任务授权",
      "不静默切换到另一个账号、公共 connector（连接器）或第三方 CLI",
      "不在两台电脑之间复制浏览器/Codex session、DPAPI 密文、Cookie、Token、私钥或设备身份密钥来跳过重新登录",
      "单请求有固定传输上限；大文件失败不会引入无边界上传平台",
      "验证码、CAPTCHA 和网站确认继续由用户完成"
    ],
    failures: [
      { condition: "Secret Broker 状态无法验证", response: "冻结秘密使用，返回 failed/partial 或精确 unavailable；不从旧回执或 Registry 推断可用。" },
      { condition: "Workspace binding 仅 configured", response: "当前零网络检查只证明固定配置与 state file 存在，不证明 OAuth scope、远端账号身份或某个动作可用。" },
      { condition: "换机后旧 credential state 文件存在", response: "不尝试从文件存在推断可解密或已登录；在目标设备重新 enrollment，或按 Secret Broker 的 RegisteredCarrier 与有效因子恢复。" },
      { condition: "网络错误、超时或限流", response: "报告 transport failure，不把凭据标成无效，也不自动更换账号或重复写操作。" },
      { condition: "scope 多、少、重复或账号身份不符", response: "OAuth enrollment 在持久化前 fail closed，既有 enrolled record 不被重复导入覆盖。" },
      { condition: "Reveal 命中不唯一或缺少新鲜因子", response: "不返回任何字段，不降级为批量列表或侧路文件。" },
      { condition: "外部逐条凭据 API 不可用", response: "保留 optional gap；不抓浏览器数据库，也不把可发现元数据误作可写来源。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\secret_broker.json", role: "SecretRef、运行时和安全边界 Registry" },
      { path: "E:\\PCConfig\\registries\\google_workspace_provider.json", role: "固定 Workspace binding、scope、端点与无秘密元数据" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.secret-broker.md", role: "秘密使用、恢复、信任与零明文产品合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.password-center-m2.md", role: "Password Center 用户体验、SecretRef、银行卡盲填与产品域隔离合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.google-workspace-provider.md", role: "固定账号 Provider、OAuth 和类型化动作合同" },
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1", role: "正式秘密代理与受保护入口" },
      { path: "E:\\PCConfig\\tools\\Invoke-GoogleWorkspaceProvider.ps1", role: "Gmail、Drive 和 Calendar 类型化 dispatch（分发）入口" },
      { path: "E:\\PCConfig\\tools\\Start-GoogleWorkspaceMcp.ps1", role: "十个只读 stdio MCP 工具的固定入口" }
    ],
    verification: [
      "Invoke-SecretBroker.ps1 -Action Status -Json 当前 exit 0、status=pass、security_core_status=pass、product_closure_status=pass",
      "同次 Secret Broker 回执为 0 critical failure、1 optional gap，并明确 plaintext_returned=false、remote_fetch_performed=false",
      "Get-GoogleWorkspaceProviderBinding.ps1 -Json 当前 exit 0、status=configured、services=gmail/drive/calendar、zero_network=true",
      "Registry 精确绑定 provider kind=pcconfig-google-workspace-direct、version=1.1.0、binding=google-workspace.primary；MCP ListTools 只应返回十个登记只读工具，本轮未用它冒充远端读取。",
      "binding status 明确 credential_state_decrypted=false；因此本页不把 configured 写成 OAuth 或 live API 验收",
      "secret_broker.test.py、secret_authority.test.py 与 secret_device_trust.test.py 覆盖授权、原子回读、恢复和负例",
      "invoke_google_workspace_provider.test.ps1 覆盖 closed action、大小边界、账号/scope 绑定、写入授权和无秘密回执"
    ],
    relation: "本模块展示凭据盲用和固定账号动作；Password Center/Secret Broker 拥有 SecretRef、因子、浏览器盲填和恢复入口，Workspace Provider 拥有一个账号的类型化动作。授权文件的独立包状态机和恢复生命周期由下一模块说明，双方只复用既有最高权限因子选择，不共享数据根或密钥。"
  },
  {
    slug: "authorization-files",
    shortTitle: "授权文件",
    title: "明确选择文件的续作加密、校验与无覆盖恢复",
    teaser: "只处理用户本次点名的文件、目录和输出，把它们做成可续作、可验证、可恢复的独立加密包；来源文件、正文和密钥不交给模型。",
    status: "源码、6/6 合成测试与 9/9 安装一致性已闭合；最高权限真实文件运行态与自然用户 E2E 本次未实跑",
    statusTone: "mixed",
    searchAliases: ["批量加密明确选择的文件", "加密到一半怎样继续", "校验授权文件包", "解密恢复但不覆盖已有文件", "文件被篡改后拒绝恢复", "授权文件不是Vault也不是SecretRef"],
    searchProjection: {
      intents: ["加密明确选择的文件或目录", "中断后继续文件加密", "验证加密包而不落地明文", "恢复到新目录且不覆盖冲突文件"],
      entities: ["Authorization File Broker", "SelectedPath / OutputPath", "AES-256-GCM", "domain / bundle / file key", "resume state / index.enc", "AuthorizationFileVerify / Decrypt"],
      relations: ["明确选择生成有界计划", "Password Center只提供因子而不合并文件域", "每文件每块独立认证", "来源与密文包默认都保留", "恢复冲突不覆盖"],
      failureRecovery: ["输入越界或含联接点时创建前拒绝", "中断复用已认证state续作", "来源变化只失败对应项", "密文索引篡改拒绝明文落地", "相同目标幂等跳过而不同内容停止"]
    },
    value: "我可以把自己点名的文件做成一个中断后能继续、完成后能校验、换目录后能恢复的加密包，不需要把正文或密钥交给模型，也不用把普通文件塞进凭据库或 Vault。",
    why: "一次性加密脚本常见四个事故：扫描范围扩大、处理中断后从头重做、密文损坏到恢复时才发现，以及恢复时覆盖同名原件。授权文件域把选择、密钥、续作、验证和恢复做成独立生命周期。",
    example: "例如我说“把这个目录和这两个文件加密到指定输出，中断后继续，并确认以后能恢复”。系统只展开 SelectedPath，拒绝链接、联接点、输出落在来源内部和相对路径碰撞；经最高权限验证后按文件分块加密，每完成一项原子保存认证 state。之后 Verify 在内存中重算长度与哈希，Decrypt 只有完整通过后才原子落地，遇到不同内容绝不覆盖。",
    result: "正常时得到 manifest、key envelope、分块密文 objects、加密 index 和不含正文/密钥的 receipt；中断时保留可续作 state。来源、密文或恢复目标有问题时返回精确 partial/conflict/tamper 状态并保留双方。当前没有独立 preview/dry-run 动作，也没有用真实用户文件跑最高权限 E2E。",
    readerStates: { pass: "最高权限、明确选择、独立域根、完整索引、对象与逐块哈希闭合时，包或恢复结果成立。", problem: "来源变化、选择碰撞、密文被改动或恢复目标有不同内容时，只停止受影响项并保留来源和包。", unavailable: "最高权限、设备信任或独立域根不可用时暂停动作并保留续作状态；不改用 SecretRef/Vault 根，也不返回正文。" },
    decisionImpact: [
      "只处理用户本次明确点名的路径和输出；不自动扫描 Downloads、Documents、整盘或仓库集合。",
      "来源文件和授权包默认都保留；删除、上传、同步、备份和迁移均是独立动作。",
      "既有最高权限策略选择已登记因子；文件域使用自己的随机 domain/bundle/file keys、session、index、receipt 和 recovery，不与凭据数据库、Key/Vault 或 P0–P7 合并。",
      "Source/Test、Install、Runtime、真实最高权限验证和自然用户 E2E 是五层独立证据；本次没有用前两层冒充后三层。"
    ],
    problem: "解决明确选择被扩大、中断重做、来源版本混合、密文篡改、恢复覆盖冲突和文件域与凭据/Vault 混线。",
    implementation: [
      "受保护 Invoke-SecretBroker.ps1 暴露 AuthorizationFileEncrypt、AuthorizationFileVerify 和 AuthorizationFileDecrypt；Encrypt 只接收 SelectedPath/OutputPath，Verify 接收 InputPath，Decrypt 接收 InputPath/OutputPath。",
      "plan_explicit_inputs 有界展开明确路径，拒绝 symlink、junction/reparse point、特殊条目、输出位于来源内部和大小写折叠碰撞；默认上限 10000 文件、100 GiB。",
      "随机 256-bit domain root 下每包生成 bundle key、每文件生成 file key；AES-256-GCM 保护根封装、密钥、state、index 和默认 4 MiB 内容块，AAD 绑定 operation/item/chunk/length。",
      "每完成一个文件原子更新加密 resume state；全部完成后生成 index.enc、记录 index/object hashes 并删除 state。同一 selection digest 与 operation 可继续，completed 重入返回 already_complete。",
      "Verify 逐块解密到进程内重算长度/SHA-256而不物化明文；Decrypt 先核对象与 GCM tag，再写同目录临时文件并原子换入。相同大小/哈希目标记 already_restored，不同内容返回 restore_conflict。",
      "Recovery Set 只把域根 envelope 当 opaque asset 恢复；不自动上传、同步或备份密文包。复用现有运行库，不新增服务、数据库、daemon、任务或全盘扫描器。"
    ],
    flow: ["接收精确 SelectedPath/InputPath/OutputPath", "生成有界计划、选择指纹、数量和总字节", "冻结精确 action/target 并完成最高权限因子", "Encrypt 创建或打开独立域根并逐块写包", "中断时以认证 state 只续未完成项", "Verify 无明文落地校验", "Decrypt 完整通过后原子恢复且不覆盖冲突", "返回无正文/密钥的状态回执"],
    concepts: [
      { term: "Authorization file domain（授权文件域）", explanation: "只处理明确选择文件的独立产品域；复用最高权限授权，但不属于凭据、Key/Vault 或 P0–P7。" },
      { term: "Authorization file bundle（授权文件包）", explanation: "manifest、密钥封装、分块密文、加密索引和无正文回执组成的目录；来源默认不删。" },
      { term: "Resume state（续作状态）", explanation: "用包密钥认证加密的逐文件进度；中断后只继续未完成项，完整完成后删除。" },
      { term: "AES-GCM（带完整性校验的加密）", explanation: "每个密文块同时提供机密性和认证，块身份、序号和长度进入 AAD。" }
    ],
    boundaries: ["不读取、解析、摘要、分类或发送文件正文", "不搜索未点名目录发现候选", "拒绝symlink/junction/reparse point和读取期间变化", "来源与包默认不删不上传不自动备份", "不同内容绝不覆盖", "与SecretRef/Key/Vault/P0–P7不共享根、session、index或recovery"],
    failures: [
      { condition: "输入为空、不可用、越界或含重解析点", response: "创建包前拒绝，不扩大选择、不跟随链接。" },
      { condition: "输出位于来源内部、路径碰撞或已有不匹配包", response: "返回精确 conflict，保留来源与输出。" },
      { condition: "加密中断", response: "保留 manifest、key envelope、已完成对象和加密 state；同一选择/operation 只续未完成项。" },
      { condition: "来源读取前后变化", response: "该项返回 source_changed，不把两个版本混成完成。" },
      { condition: "index、key envelope、object hash 或 GCM tag 被改动", response: "Verify/Decrypt 返回精确失败项，拒绝明文落地；partial 不升级整包 pass。" },
      { condition: "恢复目标已有不同内容", response: "返回 restore_conflict 并保留双方；只有大小和 SHA-256 均相同才记 already_restored。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1", role: "AuthorizationFileEncrypt/Verify/Decrypt 受保护入口" },
      { path: "E:\\PCConfig\\tools\\authorization_file_broker.py", role: "显式计划、AES-GCM 分块、resume/index/receipt、verify 与无覆盖恢复" },
      { path: "E:\\PCConfig\\tools\\authorization_file_broker.test.py", role: "独立域根、往返、中断续作、幂等恢复、篡改和来源变化合成测试" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.password-center-m2.md", role: "最高权限因子复用与授权文件/SecretRef/Key/Vault 域隔离" }
    ],
    verification: [
      "Source：authorization_file_broker.py 实现显式选择、4 MiB AES-256-GCM、独立 keys、加密 state/index、metadata-only receipt、verify 与无覆盖 decrypt。",
      "Test：2026-08-31 合成 temp 数据 6/6 PASS，覆盖空文件/同名叶子、中断续作、幂等恢复、篡改拒绝、来源变化和 output-inside-source。",
      "Install：Install-PasswordCenterIndependent Inspect 返回 current、9/9 source=installed、manifest_anchor_matches=true；source/installed SHA-256 均为 5eb7b3e59099ccde45804824d3edef03ced8abfab3ff8a3cbc1252db65123854。",
      "Runtime/E2E：本次未消费最高权限因子、未打开独立域根或处理真实选择；自然请求→Encrypt→Verify→Decrypt→用户可见恢复保持 not_run，且没有独立 preview action。"
    ],
    relation: "secrets-providers 只提供既有最高权限因子选择，不能读取文件正文或合并根；本模块独立拥有随机 keys、数据、session、index、receipt 和 recovery。CoreRecovery 只引用其恢复入口，Recovery Set 只恢复域根 envelope。"
  },
  {
    slug: "protected-actions",
    shortTitle: "受保护动作",
    title: "旧受保护平台退役与机器动作归属",
    teaser: "旧规则 Publisher（发布器）、CoreGoal consumer（目标消费者）和通用执行链退出生产；当前每个机器动作回到自己的窄 Owner、事务、授权和回读，不再共享一个万能管理员平台。",
    status: "protected-policy status=retired；6 个退役任务缺席，CoreGoal 仅 frozen historical compatibility",
    statusTone: "mixed",
    searchProjection: {
      intents: ["确认旧 policy 是否退役", "执行受保护机器动作", "迁移 Codex Home", "保留历史回退", "区分规则发布和机器动作"],
      entities: ["E rules", "退役 C policy", "CoreGoal 历史兼容", "BitLocker", "机器动作 Owner", "Codex Home 迁移"],
      relations: ["E rules 与 PCConfig 机器动作分离", "退役链不再发布或执行", "独立产品不继承旧 policy", "迁移事务绑定 preimage 和回读"],
      failureRecovery: ["旧任务重现时阻断退役验收", "历史入口失败不冒充 E rules 失败", "迁移未切换保持 waiting", "回滚失败保持精确状态"]
    },
    value: "我能知道一项高影响机器操作现在该走哪里：规则发布归 .agents，Codex Home 迁移走自己的可回滚事务，BitLocker、Password Center、P0–P7 各走独立产品入口；旧 C policy 只保留历史，不再因为拥有管理员能力就成为万能执行器。",
    why: "旧 C policy 平台把规则发布、长期目标、机器动作和多个产品耦合在一起，既复杂又容易把一个系统的授权扩散到另一个系统。完整退役不只是删任务，还要把现役动作逐项交回真实 Owner，保留必要恢复材料，并证明独立产品没有被误删或被旧状态重新激活。",
    example: "例如这次把 Codex Home 切到 E 盘时，迁移事务先保存 preimage、最终增量、ACL/链接清单和回滚副本；写入仍活跃时曾保持 waiting_for_codex_exit，退出后才原子切换并回读。现在 E 是唯一根，C 只是一条兼容 junction；全过程没有创建旧 CoreGoal step，也没有让规则 Publisher 或 BitLocker containment 代执行。另一个例子是规则发布，它只走 .agents 的 E release。",
    result: "我最终得到明确的动作归属和状态：旧 policy 是否保持 retired、历史材料是否完整、当前请求对应哪个窄 Owner、授权是否覆盖、preimage/rollback 在哪里、执行和回读是否发生。没有对应专用入口的动作不会退回通用管理员 shell。",
    readerStates: {
      pass: "旧 policy 保持 retired、任务与 worker 缺席，当前动作又能由自己的窄 Owner 提供授权、preimage、执行和回读时，两条路线分别成立而不互相继承。",
      problem: "旧 Publisher/consumer 复活、通用执行入口重现、现役动作串错 Owner，或独立产品被退役误伤时停止相关动作，恢复正确边界后分别回读。",
      unavailable: "旧状态或某个专用机器动作入口不可读时，不恢复旧平台、不改用通用管理员 shell；只暂停该动作，其他独立产品按自己的证据继续。"
    },
    decisionImpact: [
      "Verified current E release 是规则权威；C 盘第 79 代、Publisher、anchor 和 ledgers 只作历史恢复。",
      "E 盘 PCConfig 退役入口固定 retired/production_activation=false，不能再返回 candidate/active；旧 C 历史入口即使返回 active_integrity_failure，也只属于历史入口自身。",
      "CoreGoal V2 Registry 为 frozen_historical_compatibility，禁止新 goal/step，policy-publish consumer inactive。",
      "6 个旧目标任务必须 absent，系统不得有匹配的 Authority/Protected service 或 policy Python worker。",
      "Secret Broker、Password Center、BitLocker 和 P0–P7 是独立产品，退役不能删除或改变它们。",
      "当前机器动作必须有具名 Owner 和窄入口：Codex Home migration、CoreRecovery、RDP/Tailscale、Secret Broker、P0 selector 等各自拥有 transaction/read-back，不能互相借授权。",
      "bitlocker_containment Registry 的 retirement override 已生效：旧 automatic action、设备信任变更和 scheduled executor 都不允许；手工 BitLocker 与恢复路径仍保留。",
      "物理删除 C tree 或彻底卸载历史 CoreGoal 没有发生，未来若需要是另一项明确决定。"
    ],
    problem: "退役不是把状态改成一个字符串。旧任务、worker、service、Publisher、consumer 与所有依赖都要分类和缺席回读，同时保留真正有 consumer 的历史/恢复材料与独立产品。",
    implementation: [
      "registries/protected_policy_retirement.json 是退役结构化事实源；E 盘 PCConfig 的 Get-ProtectedPolicyAuthorityStatus.ps1 返回 retired 摘要。旧 C 历史目录里的同名入口不是当前 Owner。",
      "Test-ProtectedPolicyRetirement 检查 36 个依赖、6 个任务缺席、状态入口、无 App 版本绑定、Secret Broker 保留和 BitLocker 未改变。",
      "机器收敛回执证明旧任务 absent、无匹配 service/worker，P0 boot recovery、Password Center 和 BitLocker 未改。",
      "CoreGoal V2 与 BitLocker containment 使用 retirement override 把旧 policy coupling 冻结为历史，不允许自动 action。",
      "旧 C policy tree、generation 79 和 ledgers 没有物理删除，仍可作为恢复/审计材料。",
      "Codex Home 迁移是独立机器事务：staging、最终增量、ACL/链接 manifest、原子切换、C 兼容 junction 与 rollback 都由专用入口拥有；本次事务已完成，当前 E 是唯一运行根，C junction 精确指向 E。",
      "E rules 的 current/previous、UAC activation 和 Rules 页面由 .agents 拥有，不再由 PCConfig 安装或发布。"
    ],
    flow: [
      "从 E 盘 PCConfig Owner 读取 protected-policy retirement Registry 与 status=retired",
      "核对 36 个 source/machine dependency disposition",
      "确认 6 个退役任务在 Task Scheduler 中 absent",
      "确认无匹配旧 service、worker 或可执行 Publisher 路径",
      "核对 Secret Broker、Password Center、BitLocker、P0–P7 未被改变",
      "遇到新机器动作时定位其具名 Owner、精确授权、preimage、rollback 与 read-back；没有专用入口就停止，不回退旧 CoreGoal",
      "保留历史 tree、generation 79 和 ledgers，不恢复生产读者",
      "以后每次漂移检查继续验证退役不反弹"
    ],
    concepts: [
      { term: "Protected policy retirement（规则平台退役）", explanation: "旧 C 盘规则生产读者、Publisher、consumer、任务和 worker 退出，历史材料保留。" },
      { term: "Frozen historical compatibility（冻结历史兼容）", explanation: "数据结构仍可读取旧记录，但禁止创建新 goal/step 或执行旧 consumer。" },
      { term: "Retirement override（退役覆盖）", explanation: "对旧 Registry 历史字段施加现行禁止语义，避免历史 production_enabled 被误执行。" },
      { term: "Independent product（独立产品）", explanation: "Secret Broker、BitLocker、P0 等有自己的 Owner、状态和验收，不由规则退役连带删除。" },
      { term: "Specific machine action（具名机器动作）", explanation: "只有一个明确目标、专用执行入口、preimage、回滚和回读的机器变更；管理员权限本身不创造通用动作授权。" }
    ],
    boundaries: [
      "不提供通用 shell、任意管理员执行器、第二规则系统、第二队列或后台守护服务",
      "智能体名称、提示词、管理员权限令牌或复制密钥不能继承最高权限身份",
      "紧急授权不覆盖 system/developer/platform，不伪造密码学或外部事实，也不补足缺失 Carrier/因子",
      "活动规则发布、受保护机器动作和 P0 各自拥有执行与账本，CoreGoal 不内嵌它们",
      "不因旧平台退役就删除手工 BitLocker 恢复、Secret Broker、Password Center、P0 boot recovery 或专用迁移事务",
      "source test、registry 状态或 P0 health 不能单独证明两个真实 consumer 的 effect",
      "未提交 source 和 concurrent dirty work 不计入 installed current"
    ],
    failures: [
      { condition: "任一退役任务重新出现", response: "retirement acceptance 失败，停止旧路线并由 PCConfig Owner 删除/禁用后回读。" },
      { condition: "E 盘退役 Owner 返回 active/candidate", response: "视为退役回归，必须恢复固定 retired 输出，不能把 C 链当当前 authority。" },
      { condition: "旧 C 历史入口返回 integrity failure", response: "如实显示旧入口的 global-shim-invalid，但不把它升级成 E rules 或普通任务 blocker，也不尝试恢复旧 Publisher。" },
      { condition: "Secret Broker 或 BitLocker 被退役误伤", response: "回滚对应 PCConfig 变更并恢复独立产品，不恢复旧 policy runtime。" },
      { condition: "当前机器动作没有专用 Owner 或回滚入口", response: "保持未执行并报告缺口；不调用旧 CoreGoal、Publisher、任意管理员命令或旁路任务。" },
      { condition: "未来同类迁移在 cutover 前仍有写入进程", response: "保持 waiting_for_codex_exit，不启动切换；继续保留 staging 和回滚材料，待真实退出后再复核。这是事务失败语义，不是当前机器状态。" },
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
      "PCConfig 固定 source cutoff 为 d4480abc17574177b91e52b0aff9aebd30583f58；该 commit 的时间晚于旧 11:43Z 现场，因此页面不再用旧观察时间冒充 source 绑定。2026-08-31T22:48:54Z 只读回读确认 C:\\Users\\10979\\.codex LinkType=Junction、Target=E:\\Data\\AppData\\Codex，且 E 目标存在；本轮未重演 cutover。"
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
    searchProjection: {
      intents: ["升级受保护数据应用", "恢复加密数据", "验证 Carrier 和因子", "失败回到 LKG", "确认源码安装和真实数据边界"],
      entities: ["P0–P7", "selector", "LKG", "Recovery Carrier", "AuthorityVault", "Vault V2", "正式数据"],
      relations: ["版本候选经健康检查后切 selector", "Carrier 与有效因子共同恢复", "源码安装运行和正式数据分层", "CoreRecovery 不替代加密恢复"],
      failureRecovery: ["候选失败回到 LKG", "所有版本未知进入只读恢复", "Carrier 或因子缺失不恢复原文", "未安装候选不冒充可用"]
    },
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
    problem: "受保护数据同时依赖版本、selector、密钥因子、加密对象、索引、GUI、Carrier 和恢复入口。旧实现曾把同一 effect 在多个 wrapper（封装层）重复编排，增加了状态分叉和安装放大；当前 vNext 目标是用四个清晰角色收敛。",
    implementation: [
      "P0 v1 在固定 ProgramData root 使用 immutable slot、一个 control.json、journal/receipt 和公开零秘密 status；selector 以 revision CAS 和同卷原子替换更新。",
      "control 只有 normal、trial、read_only_recovery 三种 mode，绑定 active、LKG、rollback 和 manifest hash；每次 launch/health/recovery 都重新核验完整闭包。",
      "当前 public status revision 68、mode=normal、trusted_control=true、active=LKG、rollback distinct、recovery_status=null；最新自然启动为 46984 ms、deadline_met=true。",
      "2026-08-27 的 196468 ms 超时与 2026-08-28 的 rev66、57656 ms、deadline_met=false、LastTaskResult=4 都只作为带日期的历史回执保留，不代表当前状态。",
      "正式 boot-deadline-recovery operation 先把 current 恢复为第 68 版 normal、active=LKG；随后新的自然启动闭合 boot acceptance，历史失败回执不再代表当前启动状态。",
      "P0 vNext RecoveryKernel 设计旁路安装到 v2 root，但继续使用唯一 v1 state/slots；2026-08-29 v2 public status root absent（安装根不存在），所以仍是 source candidate（源码候选版本）。",
      "vNext 设计中的 P1 AuthorityVault 将提供 Passkey、TOTP、Recovery、Account 四类同接口因子，成功只交付进程内 opaque session（不透明会话）；当前 source 不能冒充安装态。",
      "RecoveryFactorHost 是 P1 的窄候选：Registry 当前 lifecycle=candidate_only、actual_install_state=not_installed、production_activation=false；它只适配现有 RegisteredCarrier/因子解封，不拥有因子 Registry、root key 或生产仪式。",
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
      { condition: "P0 boot task 返回当前失败", response: "按新回执重新判断并保留 rev68 当前可用版本；2026-08-28 的历史 LastTaskResult=4 不得代替当前结果。" },
      { condition: "候选版本切换前后健康检查失败或超时", response: "恢复旧 LKG；旧 LKG 也不能证明时写 read_only_recovery（只读恢复），并拒绝业务写入。" },
      { condition: "control current 损坏", response: "只接受完整验证的 previous preimage；不能靠猜测选择 newest slot。" },
      { condition: "v2 RecoveryKernel root absent（安装根不存在）", response: "只称 source candidate（源码候选版本），不称 side-by-side installed（并行版本已安装）、fresh read-back（全新回读）或 reboot verified（重启已验证）。" },
      { condition: "RecoveryFactorHost source 或 fixture 通过", response: "仍保持 candidate_only/not_installed；没有正式 installer read-back、生产因子和真实 Carrier E2E 时，不得称 P1 可用。" },
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
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-recovery-factor-host.md", role: "P1 因子 Host 候选、现有 Carrier 复用、固定 operation 与禁止所有权边界" },
      { path: "E:\\PCConfig\\registries\\recovery_factor_host.json", role: "candidate_only、not_installed 与 production_activation=false 生命周期证据" },
      { path: "E:\\PCConfig\\registries\\protected_data_vault_v2_formal.json", role: "Vault V2 source/install lifecycle Registry" },
      { path: "E:\\PCConfig\\registries\\protected_data_p5_p7_delivery_v3.json", role: "P5–P7 fixture、正式授权和真实路径触碰状态" }
    ],
    verification: [
      "P0 public status 于 2026-08-29 可读取 schema pcconfig.protected-data-safe-switch.public-status.v1、mode=normal、revision=68、trusted_control=true",
      "当前状态回读 active_equals_lkg=true、rollback_distinct=true，并与项目 currentState 的 rev68 自然启动事实一致",
      "fresh Test-PCConfigDrift 返回 runtime_health=pass、failure_last_result_count=0、recovered_historical_count=0",
      "boot-latest.json 当前回读为第 68 版 normal/LKG、46984 ms、deadline_met=true、recovery_status=null；旧回执只按上方明确日期保留",
      "C:\\ProgramData\\PCConfig\\ProtectedDataSafeSwitch\\v2\\public\\status.json 当前不存在，明确阻止 installed-v2 声明",
      "recovery_factor_host.json 当前 lifecycle.state=candidate_only、actual_install_state=not_installed、install_execution_permitted=false；只证明源码边界已登记",
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
