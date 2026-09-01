import { generatedPanelFacts } from "./panel-facts.generated.js";
import { createProjectSnapshot } from "./project-snapshot.js";
import panelProjectRegistry from "../config/panel-projects.json" with { type: "json" };

export const site = {
  name: "吴乐阳",
  url: "https://wly0829.cn",
  email: "hello@wly0829.cn"
};

export const socialLinks = [
  { label: "GitHub", ariaLabel: "在新窗口打开吴乐阳的 GitHub", href: "https://github.com/wlyaaaaa", icon: "github" },
  { label: "哔哩哔哩", ariaLabel: "在新窗口打开吴乐阳的哔哩哔哩主页", href: "https://space.bilibili.com/179179701", icon: "bilibili" },
  { label: "X", ariaLabel: "在新窗口打开吴乐阳的 X", href: "https://x.com/wlyaaaaaaa", icon: "x" },
  { label: "邮箱", ariaLabel: "发送邮件至 hello@wly0829.cn", href: "mailto:hello@wly0829.cn", icon: "mail", mail: true }
];

export const primaryNav = [
  { label: "系统", href: "/" },
  { label: "项目", href: "/projects" },
  { label: "规则", href: "/rules" },
  { label: "Skills", href: "/skills" }
];

if (
  generatedPanelFacts?.schema !== "wly.panel-facts.v2"
  || generatedPanelFacts?.generatedBy !== "scripts/refresh-panel-snapshot.mjs"
  || !generatedPanelFacts?.authority?.releaseId
  || !Array.isArray(generatedPanelFacts?.ruleBinding)
  || generatedPanelFacts.ruleBinding.some((binding) => !/^[a-f0-9]{64}$/.test(binding?.sourceSha256 || "") || !Number.isInteger(binding?.sourceBytes) || typeof binding?.sourceMatchesRelease !== "boolean" || !binding?.releasePath)
  || !Array.isArray(generatedPanelFacts?.validation?.rows)
  || !Array.isArray(generatedPanelFacts?.validation?.failures)
  || !Number.isInteger(generatedPanelFacts?.skills?.activeInstallIntent)
  || !Number.isInteger(generatedPanelFacts?.skills?.personalSelectedCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.hostIntegratedCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.selectedPublicCount)
  || generatedPanelFacts.skills.selectedPublicCount !== generatedPanelFacts.skills.personalSelectedCount + generatedPanelFacts.skills.hostIntegratedCount
  || generatedPanelFacts.skills.hostIntegratedDiscovery !== "not_rerun_by_agents_snapshot_refresh"
  || !Number.isInteger(generatedPanelFacts?.skills?.transactionCampaignCount)
  || !generatedPanelFacts?.integrity?.payloadSha256
) {
  throw new Error("panel facts are missing or invalid; run npm run refresh:snapshot before build");
}

export const panelSnapshot = generatedPanelFacts;
const currentValidationDetail = (prefix) => panelSnapshot.validation.rows.find((row) => row.layer.startsWith(prefix))?.detail || "本轮没有取得这一层的当前证据。";
const activeRuleCount = panelSnapshot.ruleBinding.length;
const activeRuleBytes = panelSnapshot.ruleBinding.reduce((total, binding) => total + binding.sourceBytes, 0);
const localOwnerObservation = Object.freeze({
  observedAt: "2026-08-31T11:41:50Z",
  releaseId: "E95",
  gitCommit: "d32210b6594bf8ba1679da7b0f5bd66d18f3f6a7",
  pointerRevision: 16,
  previousReleaseId: "E94",
  ruleCount: 5,
  ruleBytes: 81694,
  rulesetSha256: "b56847d29e1102945ffa437de0e58dfb79a887d4f0a606bfe1020b28746d8ef9",
  registered: 42,
  passed: 38,
  failed: 0,
  timedOut: 0,
  crossOwnerSkipped: 4,
  activeIntent: 25,
  skillTransactions: 37,
  unfinished: 0,
  invalid: 0,
  contractPassed: 36,
  contractTotal: 36,
  findings: 0
});

const agentsSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T22:13:00Z",
  label: `${localOwnerObservation.releaseId} 完整回归观察 + 当前 source/Skill 供应快照`,
  boundary: `本页活动规则绑定已验证的 ${panelSnapshot.authority.releaseId}；本地回归仍是 ${localOwnerObservation.releaseId} 观察：${localOwnerObservation.passed} pass、${localOwnerObservation.failed} fail，另 ${localOwnerObservation.crossOwnerSkipped} 项是 cross-owner skip（跨 Owner 跳过）；未来 release 不继承这次回归`,
  metrics: [
    { label: "活动规则", value: `${panelSnapshot.authority.releaseId} · ${activeRuleCount}/${activeRuleCount}` },
    { label: "能力供应", value: `${panelSnapshot.skills.activeInstallIntent} 项` },
    { label: `本地回归 · ${localOwnerObservation.releaseId}`, value: `${localOwnerObservation.passed} pass · ${localOwnerObservation.failed} fail` },
    { label: `合同覆盖 · ${localOwnerObservation.releaseId}`, value: `${localOwnerObservation.contractPassed}/${localOwnerObservation.contractTotal}` }
  ],
  facts: [
    { label: "当前活动规则", value: `${panelSnapshot.authority.releaseId} · release commit ${panelSnapshot.authority.gitCommit.slice(0, 7)} · ruleset ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…；current pointer revision ${panelSnapshot.authority.pointerRevision}，previous=${panelSnapshot.authority.previous?.release_id || "无"}` },
    { label: "活动规则闭包", value: `当前 ${activeRuleCount}/${activeRuleCount} 份规则共 ${activeRuleBytes} bytes；每份 release 与 source 的 bytes/SHA 必须一致，dirty source 和历史材料不能替代当前指针` },
    { label: "本地回归边界", value: `${localOwnerObservation.releaseId} 的独立 Owner 观察与未来 release identity 分层；跨 Owner 跳过项不折算成失败或通过` },
    { label: "个人能力供应", value: "active install intent 只说明供应目标；安装事务、当前任务、全新任务和真实场景验收仍分别取证" },
    { label: "合同覆盖边界", value: "当前覆盖闭合不代表未来合同自动通过；规则、授权、能力、Git 与机器事实继续由各自责任源解释" },
    { label: "产品能力", value: "自然语言目标可接到真实项目、规则、Skills 与工具；源码、测试、安装、发布、恢复和用户结果分层回读" },
    { label: "当前规则与源码分层", value: `活动规则仍是 ${panelSnapshot.authority.releaseId} release commit=${panelSnapshot.authority.gitCommit}；current pointer revision ${panelSnapshot.authority.pointerRevision}，previous=${panelSnapshot.authority.previous?.release_id || "无"}，五规则 ruleset=${panelSnapshot.authority.rulesetSha256}。当前源码 main=${panelSnapshot.sourceCommit}，branch=${panelSnapshot.sourceBranch}，${panelSnapshot.sourceSync}；源码 main 不能冒充尚未发布的下一代 E release。`, hero: false },
    { label: "历史完整回归观察", value: `Owner 于 ${localOwnerObservation.observedAt} 对 ${localOwnerObservation.releaseId} 运行完整本地回归：${localOwnerObservation.passed} pass、${localOwnerObservation.failed} fail、${localOwnerObservation.timedOut} timeout，另 ${localOwnerObservation.crossOwnerSkipped} 项属于 cross-owner skip；合同覆盖 ${localOwnerObservation.contractPassed}/${localOwnerObservation.contractTotal}、finding ${localOwnerObservation.findings}。这是一条历史完整回归观察，不改写当前 source main。`, hero: false },
    { label: "Skill 供应快照", value: `当前 Skill 供应快照于 ${panelSnapshot.observedAt} 回读 ${panelSnapshot.skills.activeInstallIntent} 个 active install intent、${panelSnapshot.skills.transactionCampaignCount}/${panelSnapshot.skills.transactionCampaignCount} 个 terminal transaction；selected public=${panelSnapshot.skills.selectedPublicCount}。Source/install/transaction 通过仍不替代 current task、fresh task 或领域 E2E。`, hero: false },
    { label: "工作树热备", value: "工作树热备 source/合同存在；2026-08-31T21:24:42Z 只读观察确认 G 卷 Healthy/OK，且 G:\\80_Backup\\ControlPlane\\agents-hot-mirror-status.json 存在。该回执最后镜像时间为 2026-07-30T20:30:07-07:00、robocopy exit=1，当时记录 source HEAD=c96dbf1、dirty=21。", hero: false }
  ],
  gaps: [
    `refresh-panel-snapshot 只刷新 source、活动 E release 与 Skill 供应，不会自动重跑当前 source main 的完整本地回归；以上 ${localOwnerObservation.releaseId} 38/0 仍保持 ${localOwnerObservation.observedAt} 历史观察，直到新的 Owner 回执替换。`,
    "当前会话没有观察到 AgentsHotMirror-Daily 计划任务；现有状态回执也明显早于当前 source main。页面只能证明热备合同和历史镜像存在，不能声称每日自动热备当前已安装、正在运行或已覆盖最新工作树。"
  ]
});

const agentsRegistration = panelProjectRegistry.projects.find((item) => item.id === "agents" && item.enabled);
if (!agentsRegistration || agentsRegistration.order !== 1 || agentsRegistration.presentation_mode !== "real_dashboard") {
  throw new Error("panel project registry must contain enabled .agents at order 1 in real_dashboard mode");
}

export { panelProjectRegistry };

export const project = {
  order: agentsRegistration.order,
  slug: "agents",
  title: agentsRegistration.title,
  route: agentsRegistration.route,
  visibility: agentsRegistration.source.visibility === "PRIVATE" ? "私有仓库" : "公开仓库",
  repositoryNote: "仓库不向匿名访客开放；本面板完整介绍它的产品、规则、模块和真实验证状态。",
  cardStatus: `当前 ${panelSnapshot.authority.releaseId} 已激活；最近完整 Owner 回归为 ${localOwnerObservation.releaseId} 观察`,
  cardStatusTone: "pass",
  ...agentsSnapshot,
  summary: ".agents 是我和 AI 协作时的总规则与能力中枢。我只需用自然语言说清目标和不能越过的边界，它会让任务找对事实来源、在已有授权内行动、保护并发施工、选择合适能力，并把本地完成、远端发布和真正可用分开验证。最后我拿到的是办成的结果、真实缺口，以及是否还需要我作决定。",
  why: "个人 AI 工作会同时跨越代码仓库、本机配置、私有资料、外部服务和多个并行任务。没有统一边界时，最容易改错项目、扩大授权、覆盖其他任务，或者把测试通过误报成用户已经能用。",
  plainExample: "例如我说“重建并发布个人项目网站”。它先让网站项目决定页面内容和测试方式，让 Git 总索引确认公开仓库、主分支和远端，让 .agents 判断哪些动作已经得到允许以及能否并行；构建、推送和公网打开分别验证。任何一步没完成，都不能用上一层的成功冒充整个任务已经完成。",
  result: "我最终会得到一条可以追溯的工作链：每个事实来自正确项目，每个写入有人负责，每个外部动作有明确授权，失败时知道从哪里恢复，结束时能区分本地完成、远端完成和用户真正可用。",
  readerStates: {
    pass: "目标、事实来源、授权、施工范围和验证层都明确时，任务继续执行并分别回读本地、远端和用户可见结果。",
    problem: "只停止发生冲突或验证失败的那一步，明确失败位置、原因和恢复线索；其他不依赖该问题的安全工作可以继续。",
    unavailable: "把对应事实标记为 Unknown（证据不足），不猜路径、不猜授权，也不把本地成功冒充成远端或用户可用。"
  },
  productPrinciples: [
    { title: "人定目标，AI负责方法，Hook（宿主钩子）只验真", detail: "用户说明要达成什么、优先级和不能越过的边界；AI负责调查、工具、并行数量和验证深度。宿主 Hook 只提供可信身份与创建前复核，不替 AI 调度，也不替用户授权。" },
    { title: "事实回到真正负责它的地方", detail: "业务由项目解释，仓库与发布由 Git 总索引解释，机器事实与恢复由 PCConfig 解释；旧报告和模型记忆不能替代现场。" },
    { title: "明确过的授权不反复索要", detail: "同一目标和范围内持续推进；只有目标、账号、公开面、付费、秘密或不可逆边界变化时，才重新判断。" },
    { title: "并行提高质量，但不覆盖别人", detail: "互不依赖的工作可以并行；重叠写入用最小施工范围协调，已有改动始终保留。" },
    { title: "完成必须分层证明", detail: "源码、测试、安装、发布和用户真正可用各自证明不同事情，任何一层都不能冒充整件事完成。" },
    { title: "Git 历史与工作树热备各保一层", detail: "PRIVATE Git 保存提交历史，G 盘 hot mirror（热镜像）保存当前工作树和未提交状态；两者互补，但热镜像不复制 .git、不触碰 H 冷备，也不冒充完整仓库备份。" },
    { title: "不知道就保留未知", detail: "证据不足只停止受影响步骤，说明缺什么和怎样恢复；不依赖该问题的安全工作继续。" },
    { title: "能力越小越容易长期可靠", detail: "优先复用窄而成熟的 Skill、工具和接口；没有现实消费者的框架、服务和历史链退出活动面。" },
    { title: "产品复杂度由需求决定，技术架构必须最小充分", detail: "用户要的功能、流程、状态和体验不能被反膨胀删减；先冻结同一完整验收，再在能满足质量、可维护性、兼容和已证扩展轴的路线中，强制选择更小、更快、少节点的实现。" },
    { title: "注意力质量高于上下文数量", detail: "先保住目标、边界、最新证据、未知和验收，再读取会改变判断的细节；既不漏掉关键事实，也不靠堆文件和日志制造理解假象。" },
    { title: "自然能力要用自然请求验收", detail: "需要证明 AI 会自己选路时，给全新评估者普通用户目标，不泄露 Skill、工具或预期路线；同时检查它是否自主选对能力，以及用户最后是否真的拿到正确结果。" },
    { title: "官方更新不靠易变版本号维持", detail: "同一官方主体更新后按稳定 package family（软件包家族）、签名、宿主事件和当前能力继续；版本号或安装路径改变不构成阻断，只有真实缺失的精确能力局部降级。" },
    { title: "普通本地工作不虚构对抗者", detail: "本机现有用户、文件、进程、软件和私人账号空间默认可信；除非用户明确提出安全任务，不额外制造攻击模型、审计链或守护服务，正确性、可靠性和恢复仍单独做好。" },
    { title: "私人问题直接进入对应小入口", detail: "健康、私人事务文书、微信、材料、录音和扫描分别走自己的边界，不恢复中央个人画像或默认全景上下文。" }
  ],
  responsibilities: [
    "定义跨项目适用的 Agent 行为与指令优先级",
    "管理用户授权、委派收窄和执行 Owner",
    "选择工具、Skills、插件与原生代理的使用边界",
    "维护重大动作的活动规则、发布链和恢复语义",
    "在任务真正结束且没有后续义务时安全归档；仍有未交付内容时保留接手人与恢复线索",
    "维护个人 Skills 的 canonical source、安装清单与验证分层",
    "为 .agents 当前工作树提供固定 E→G 热备合同、状态回执与恢复边界",
    "在不削弱产品验收的前提下执行最小充分架构硬门，并在自造复杂度失败时优先删层"
  ],
  exclusions: [
    "不拥有仓库身份、远端、默认分支和发布事实；这些由 Git 控制面负责",
    "不拥有本机路径、端口、任务、运行时、备份和恢复事实；这些由 PCConfig 负责",
    "不替具体项目定义业务含义、数据模型、启动方式和项目测试",
    "不保存中央个人资料库，也不恢复已退役的中央个人上下文系统"
  ],
  glossary: [
    { term: "Agent（智能体）", meaning: "负责理解目标、选择方法、调用工具并交付结果的 AI 执行单元。" },
    { term: "Fact Owner（事实责任源）", meaning: "某类动态事实的唯一负责来源；文档可以指路，但不能代替它的现场回读。" },
    { term: "Project rule（项目规则）", meaning: "项目目录中的 AGENTS 规则，拥有该项目的业务语义、命令、兼容和发布边界。" },
    { term: "Control plane（控制面）", meaning: "维护一类跨项目规则或动态事实的系统；当前只有 .agents、Git 和 PCConfig 三个。" },
    { term: "E release（E 规则版本）", meaning: `递增 E 代号、PRIVATE main commit、五份规范 bytes/SHA 和 ruleset SHA 的不可复用绑定；当前是 ${panelSnapshot.authority.releaseId}。` },
    { term: "Canonical source（规范源码）", meaning: "E:\\.agents 当前可编辑规则源码；dirty 或未激活提交不是 current release。" },
    { term: "Current pointer（当前指针）", meaning: "E:\\.agents\\releases\\current-rules.json，原子指向 current/previous release。" },
    { term: "Ruleset SHA（五规则总指纹）", meaning: "按固定 logical id 顺序绑定五份文件 path、bytes 和 SHA 的总指纹。" },
    { term: "Release record（版本记录）", meaning: "绑定 E 代号、Git commit、五文件描述符、ruleset、远端包含和发布时 source clean 的 JSON。" },
    { term: "Recovery-only C history（仅恢复的 C 盘历史）", meaning: "旧 generation、Publisher、签名、anchor、manifest、ledger 和回执可读保留，但不是当前权威或运行依赖。" },
    { term: "Runtime root（运行根）", meaning: "当前唯一 Codex 根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 已是指向它的兼容 junction（目录联接），不是第二副本。任务临时目录位于 E:\\Cache\\Codex\\Temp\\<task-id>。" },
    { term: "Activator（激活器）", meaning: "唯一执行测试、PRIVATE main 回读、五哈希、UAC CAS、pointer 切换和 ACL/read-back 的本地工具。" },
    { term: "CoreGoalCommitment（目标承诺）", meaning: "一次可靠人类确认冻结的长期目标、范围、禁止项和停止条件，不冻结具体实现。" },
    { term: "StepCapability（单步能力）", meaning: "只允许一次精确现实动作的短时、防重放能力，绑定目标、参数、executor、pre/post 和回滚。" },
    { term: "Execution Owner（施工责任）", meaning: "协调哪个任务正在改哪个最小 scope；它不产生用户授权、管理员权限或业务事实。" },
    { term: "Durable explicit user authorization（耐久明确用户授权）", meaning: "用户已明确给出的长期授权在冻结 goal/scope 内跨轮次、压缩、root、全部后代和新顶层任务持续有效，不要求同轮重述。" },
    { term: "Lifecycle resolver（任务生命周期解析器）", meaning: "固定只读入口，证明任务是否真正 terminal、是否 archived、是否仍有 goal/queue/residual；标题、超时和归档标记不能替代。" },
    { term: "RecoverRelease / RecoverReleaseClaim（恢复释放 / 恢复并认领）", meaning: "普通非长期，或已归档且 clean 的 predecessor 在终态且无残留时使用 RecoverRelease；有 checkpoint 或 residual 时原子转给真实 successor。未归档 long_term_task 不自动释放。" },
    { term: "threadId / clientThreadId（真实任务标识 / 创建中回执）", meaning: "只有真实 threadId 可用于任务管理和归档；clientThreadId 只证明创建已受理。" },
    { term: "Complete goal（已完成目标）", meaning: "goal 的关闭状态；它不再构成 open residual，但仍须分别确认 queue、pending transaction、Owner 和 follow-up 都已收口。" },
    { term: "Scope（施工范围）", meaning: "Owner 认领的最小文件、模块或责任边界。不同活动任务的 scope 不能重叠。" },
    { term: "CAS（比较后交换）", meaning: "只有 registry revision 仍等于预期值时才提交 Owner 变更，避免并发覆盖。" },
    { term: "Registered target（已登记目标）", meaning: "持久 reference 说明目标是谁，现场 resolution 说明它现在是否活动、允许做什么和怎样回读。" },
    { term: "External effect（外部现实动作）", meaning: "会改变外部系统或现实状态的动作，例如发消息、公开、部署、删除或付费。" },
    { term: "Read-back（正式回读）", meaning: "动作执行后，从真实 Owner 再读取结果；命令返回成功不能替代。" },
    { term: "Fail closed（失败关闭）", meaning: "关键身份、授权、完整性或目标事实缺失时，只关闭相关高风险动作，不靠猜测继续。" },
    { term: "Skill（能力入口）", meaning: "把一个稳定、窄范围能力和它的本机入口、边界、失败语义放进任务注意力。" },
    { term: "Plugin（插件包）", meaning: "可以分发 Skills、工具服务、Apps、hooks、assets 或脚本的安装单元。" },
    { term: "Provider（事实或能力提供器）", meaning: "以固定 schema 返回现场状态或执行精确 operation 的 Owner 接口。" },
    { term: "Junction（目录联接）", meaning: "用户发现目录到 canonical Skill source 的 Windows 链接，不是第二份源码。" },
    { term: "Recovery capsule（恢复胶囊）", meaning: "安装事务在变更前记录的 source、destination、pre-image 和固定 roots，用于中断回滚。" },
    { term: "Working-tree hot mirror（工作树热镜像）", meaning: "把 E:\\.agents 当前文件状态镜像到固定 G 盘热备根，保留尚未提交的工作，但排除 .git 和临时附件；它不同于 Git 历史与 H 冷备。" },
    { term: "Fresh task（全新任务验证）", meaning: "安装完成后启动的另一个任务真实发现该能力。" },
    { term: "E2E（端到端验证）", meaning: "用真实输入走完整路径并得到用户可见结果。" },
    { term: "Unknown（未验证）", meaning: "当前没有足够证据。它既不是 PASS，也不表示永久不可用。" }
  ],
  operatingFlow: [
    { title: "确定真实目标", detail: "先读当前请求和最近的项目规则，明确用户到底要什么、哪些边界不能越过。" },
    { title: "找到事实 Owner", detail: "业务回到具体项目；Git、机器事实和 Agent 规则分别回到自己的控制面，避免用旧报告或猜测替代现场事实。" },
    { title: "选择能力", detail: "根据风险、信息价值、延迟、耦合和可逆性，决定直接处理、读取 Skill、调用工具或并行委派。" },
    { title: "绑定授权与施工责任", detail: "外部动作确认授权；既有 durable grant（耐久授权）不要求同轮重述，前提成立就真实调用一次并以实际 deny/unavailable/error 为准。写入前由最小 execution scope 认领 Owner。" },
    { title: "执行并分层验证", detail: "源码、测试、安装、发布、全新任务可用性和用户可见结果分别取证，任何一层都不能代替另一层。" },
    { title: "用人话收口", detail: "先说明现实结果、使用方式、边界和是否需要用户动作，再保留会改变判断的技术证据。" }
  ],
  components: [
    { name: "全局根规则", responsibility: "跨项目优先级、E rules authority、事实 Owner、授权、Git 与验证总原则。", implementation: `${panelSnapshot.authority.releaseId} release AGENTS.md 是当前默认入口；dirty source 不是活动规则。` },
    { name: "合同 Catalog", responsibility: "根据触发 metadata 找到正确合同、Owner、Provider、schema 和 validator。", implementation: "Catalog 只做路由，不加载正文、不运行 Provider，也不决定是否授权。" },
    { name: "三控制面上下文", responsibility: "跨 .agents、Git 和 PCConfig 时提供最小 metadata 视图。", implementation: "两个零正文视图，先返回路径、SHA、大小和 Owner，再按影响展开。" },
    { name: "E rules activator", responsibility: "证明并激活 current/previous E release。", implementation: "测试、PRIVATE main commit/remote readback、五哈希、UAC expected-pointer CAS、ACL 和正式回读；不创建后台组件。" },
    { name: "E release store", responsibility: "只保存当前和上一代两份已验证规则，以便原子激活与回退。", implementation: `当前 store 仅保留 current=${panelSnapshot.authority.releaseId} 与 previous=${panelSnapshot.authority.previous?.release_id || "无"}；更早 E 代留在 PRIVATE Git 历史，不在活动 store 堆积。release record、current pointer 与两代目录由 SYSTEM-owned 封闭 ACL 保护。` },
    { name: "运行与临时目录", responsibility: "让 AI 工作台的唯一运行根、数据库和任务临时文件位于 E 数据/缓存盘，同时保留旧入口兼容。", implementation: "当前唯一 Codex 根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 已是指向该根的 junction（目录联接），不是第二副本。任务 temp 使用 E:\\Cache\\Codex\\Temp\\<task-id>。" },
    { name: "CoreGoal 授权", responsibility: "把一次人类确认固定为长期目标，同时允许实现、修复和恢复继续推进。", implementation: "CoreGoalCommitment 加每个现实 effect 的短时单次 StepCapability。" },
    { name: "Execution Owner Registry", responsibility: "协调多个任务对项目最小 scope 的 Claim、Add、Transfer、Release 和恢复。", implementation: "Expected revision CAS 加 append-only transition journal；固定 resolver 证明普通非长期或已归档 predecessor terminal 后，无 residual 用 RecoverRelease，有 residual 用 RecoverReleaseClaim。未归档 long_term_task 只接续或正式退役。" },
    { name: "原生代理路由门", responsibility: "验证 model（模型）、effort、root/child 身份、E release/commit/ruleset 和合同 SHA 后才允许 spawn。", implementation: "宿主事件注入身份，创建前再检查 TOCTOU；它不替模型选择 0–10、家族或 scope。" },
    { name: "Personal Skill 供应链", responsibility: "维护 Skill canonical source（能力唯一源码）、安装意图、发现 junction（目录联接）、事务回滚和六层证据。", implementation: "一个 registry（登记表）、两个 canonical roots（唯一维护根目录）、事务 installer（安装器）和 recovery capsule（恢复胶囊）。" },
    { name: ".agents 工作树热备", responsibility: "保存 E:\\.agents 当前工作树与未提交改动的 G 盘恢复点，补足 PRIVATE Git 只保存提交历史的边界。", implementation: "固定 E→G 路径、G 卷健康门、全局互斥、受限 robocopy 镜像、状态 JSON 和可选每日无窗口任务；不复制 .git，不访问 H。" },
    { name: "Control Plane Doctor", responsibility: "按用户点名的 Owner 做只读健康、漂移、迁移和恢复检查。", implementation: "只调用被选中的 Provider；需要修复时退出 Doctor 并交给真实 Owner。" },
    { name: "最小充分架构与测试", responsibility: "冻结完整产品/质量验收，比较短路线与长路线的总生命周期成本，并阻止没有现实需求证据的新技术层。", implementation: "complete_acceptance_floor + minimum_sufficient_architecture_hard_gate；复杂度失败先删层，再按差异运行 Local/Cross-owner 验证和 repository bloat budget。" }
  ],
  usageExamples: [
    { ask: "比较几个方案，给我净收益最好的一个。", effect: "模型自己选择调查、工具和验证深度，不机械套头脑风暴模板。", moduleSlug: "capability-routing" },
    { ask: "先复现根因，再修并跑相关回归。", effect: "先取得真实失败，再在最小 Owner scope 内修复并验证，不能用跳过测试制造绿灯。", moduleSlug: "context-evidence" },
    { ask: "能并行的并行，避免写冲突。", effect: "把互不依赖支路交给不同代理，只有真实写冲突的临界区串行。", moduleSlug: "capability-routing" },
    { ask: "只读审计，不实施修复。", effect: "不 Claim 排他 Owner，不产生外部 effect，只报告事实、证据和缺口。", moduleSlug: "authorization-owner" },
    { ask: "现场回读，不用旧报告或记忆。", effect: "重新读取活动规则、项目规则、Owner Provider、Git 状态和当前源码。", moduleSlug: "rules-contracts" },
    { ask: "我有一批还没提交的 .agents 修改，电脑出问题时怎样从 G 盘恢复？", effect: "先检查 G 卷健康和热备状态回执；需要执行时只允许固定 E:\\.agents → G:\\80_Backup\\ControlPlane\\.agents，排除 .git/临时附件并记录源 HEAD 与 dirty 数。恢复时把 G 当工作树文件来源，Git 历史仍从 PRIVATE Git 取得；当前任务未观察到已安装的每日任务，因此不冒充自动热备正在运行。", moduleSlug: "working-tree-hot-mirror" },
    { ask: "验证后定向提交并正常推送。", effect: "保留其他 dirty work，只 stage 本任务文件，提交后 normal push 并从远端默认分支回读。", moduleSlug: "authorization-owner" },
    { ask: "公开项目里有被 Git 忽略、但不能丢的私有配置和文档，怎样既保留又不泄露？", effect: "只筛 Git 明确 ignored、未跟踪/未暂存且有保留价值的材料；先复制和 hash 到现场仍为 PRIVATE 的 companion，提交推送并从远端默认分支回读后，才把原件同卷改为可回滚备份并在原路径建立继续 ignored 的本地 link。任一步失败都恢复原件，不把半份迁移写成完成。", moduleSlug: "authorization-owner" },
    { ask: "我新加了一个 Skill（能力入口），为什么文件有了，全新任务还是看不到？", effect: "把 canonical source（唯一维护源）、安装事务、发现入口、当前任务、fresh task（全新任务验证）和真实 E2E 分开检查，只修失败的那一层。", moduleSlug: "skills-plugins" },
    { ask: "发布一版新规则，保留上一版回退，别让 dirty source 冒充 current。", effect: "从已验证 PRIVATE main commit 生成五文件 E release，经 expected-pointer CAS 激活并回读 current/previous。", moduleSlug: "protected-policy" },
    { ask: "Hook（宿主钩子）到底检查什么，谁决定开几个代理？", effect: "UserPromptSubmit 或 SubagentStart 先注入可信身份，AI 再自主决定 0–10 与家族，PreToolUse 只在创建前复核。", moduleSlug: "capability-routing" },
    { ask: "功能和质量都别删，但别为了显得专业再加服务、数据库和状态机。", effect: "先冻结完整功能、好用程度、正确性、可靠性、恢复、性能、可维护性和现有兼容；若现有入口或单模块已经满足，就禁止新增技术层。只有短路线明确缺少某项验收且有当前证据时，才增加解决该缺口的最小实现。", moduleSlug: "capability-routing" },
    { ask: "别告诉验收者内部路线，看看它能不能自己选对能力并给出结果。", effect: "用 implementation-blind fresh E2E（实现盲态全新端到端验收）同时验证无提示选路和用户可见结果；点名工具的测试仍只算定向执行。", moduleSlug: "capability-routing" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "当前源码或规则候选写了什么。", doesNotProve: "已经安装、发布或运行。" },
    { layer: "Test（测试）", proves: "某个明确行为在指定环境通过回归。", doesNotProve: "生产入口和用户路径已经生效。" },
    { layer: "Install（安装）", proves: "制品、junction 或运行时已经落到目标位置。", doesNotProve: "新任务能发现，或场景 E2E 成功。" },
    { layer: "Publish（发布）", proves: "制品通过正式发布链进入目标。", doesNotProve: "网页、服务或用户操作真实可用。" },
    { layer: "Fresh task（全新任务）", proves: "安装之后启动的新任务能发现目标能力。", doesNotProve: "每一种真实输入都正确。" },
    { layer: "End to end（端到端）", proves: "真实输入走完整路径并得到用户可见结果。", doesNotProve: "所有未来输入和环境都不会失败。" },
    { layer: "User acceptance（用户验收）", proves: "产品结果确实解决了用户当前问题。", doesNotProve: "内部实现没有可继续优化的空间。" }
  ],
  evolution: [
    { date: "2026-06-30", commit: "7a7d476", result: "建立第一版全局规则与 Skills。" },
    { date: "2026-07-09", commit: "38d83f7", result: "加入只读 Control Plane Doctor。" },
    { date: "2026-07-10", commit: "30cee72", result: "引入合同 Catalog，让正文按需路由。" },
    { date: "2026-07-31", commit: "95028c4", result: "建立重大动作 Authority 与活动代际。" },
    { date: "2026-08-13", commit: "94e6e3a", result: "引入 scoped execution owner，协调并发施工。" },
    { date: "2026-08-15", commit: "ecc2064", result: "建立宿主身份绑定的原生代理路由门。" },
    { date: "2026-08-21", commit: "6f6e1ab", result: "退出历史第四基座，收敛为三个控制面。" },
    { date: "2026-08-22", commit: "9498615", result: "清理活动面并建立仓库膨胀治理。" },
    { date: "2026-08-25", commit: "325d6a7", result: "补全归档任务的 Owner 恢复。" },
    { date: "2026-08-26", commit: "472ab3a", result: "CoreGoal 授权进入保护消费者，四类人类因子统一。" },
    { date: "2026-08-29", commit: "157060f–31009aa", result: "退役 C 盘规则 Publisher/Authority 生产链，建立 E release、跨项目 coordination、差异驱动快速验证和分阶段墙钟回执；运行根迁移已进入 staging 与兼容修复阶段，但尚未完成 junction、唯一副本和新运行时回读。" },
    { date: "2026-08-30", commit: "464564b–185503e", result: "E91 统一 PUBLIC L1–L5 分级、私人账号等价可信与 english_chinese_gloss；E92 正式化耐久授权、真实调用一次和来源任务归档；E93 明确长期任务保留与接续；E94 保证 RecoverReleaseClaim 继承 predecessor 的非空 coordination，并让 Repartition 把当前冻结 coordination 写入全部 replacement bindings，避免跨项目目标在恢复或重分区时丢失身份。" },
    { date: "2026-08-31", commit: "d32210b–805abf6", result: "E95 先把普通本地安全收敛到可信闭集，并建立注意力、实现盲测和自然意图路由；E96 把产品复杂度与技术复杂度分轴并建立最小充分架构硬门；E97 又让旧 root 的用户确认跨 E 代际继续有效，只重读规则、重派生并刷新代际快照而不重复询问，同时让 Owner lifecycle resolver 从物理 CODEX_HOME 归一兼容 junction 路径。" }
  ],
  operationalEntrypoints: [
    { name: "活动 E 规则", command: "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json", purpose: "唯一证明 current/previous E release、commit、ruleset、五文件路径和 pointer。" },
    { name: "合同导航", command: "E:\\.agents\\tools\\Get-ControlPlaneContractCatalog.ps1 -All -Json", purpose: "查看合同 Owner、触发 metadata、Provider 和 validator。" },
    { name: "三控制面视图", command: "E:\\.agents\\tools\\Get-FourBaseDecisionContext.ps1 -List -Json", purpose: "列出两个零正文跨控制面视图。" },
    { name: "Skill 供应", command: "E:\\.agents\\tools\\Test-PersonalSkillSupply.ps1 -RequireInstalled -NoExternalEvidence -Json", purpose: "验证 source、install 和 transaction，不冒充 fresh task 或 E2E。" },
    { name: "本地回归", command: "E:\\.agents\\tests\\Invoke-AllTests.ps1 -Scope Local -Parallel -Json", purpose: "运行登记为本地安全的测试，跨 Owner 项明确 skip。" }
  ]
};

export const modules = [
  {
    slug: "rules-contracts",
    shortTitle: "规则与合同",
    title: "规则、合同与事实 Owner",
    teaser: "决定任务先听谁的、哪类事实回到哪里，以及何时需要展开专项合同。",
    status: "已落地并处于活动规则中",
    statusTone: "pass",
    value: "避免 Agent 从旧报告、错误仓库或不适用的全局规则出发，导致理解错项目、执行错命令或用错动态事实。",
    why: "同一个任务里可能同时出现用户本轮要求、项目规则、全局规则、历史报告和现场状态。如果不知道谁拥有最终解释权，AI 很容易拿旧材料覆盖当前项目。",
    example: "例如我说“按这个项目自己的测试把问题修好，别拿上个月的报告当现在；如果发布状态和电脑状态不一致就分别查清”。系统会先读本轮要求和最近的项目规则，再只向 Git、PCConfig 或业务项目查询真正需要的现场事实。",
    result: "任务会从正确规则和事实来源开始；来源冲突无法同时满足时会明确停止并说明冲突，不会拼接一个看似合理的答案。",
    readerStates: { pass: "项目规则、全局规则和事实责任源一致时，按项目真实命令继续。", problem: "规则或来源冲突时停止受影响步骤，列出冲突双方和需要谁裁定。", unavailable: "必要规则或事实责任源不可读时，依赖它的结论保持未知；不拿旧报告或记忆补齐。" },
    searchProjection: {
      intents: ["项目规则和全局规则冲突时听谁的", "某类现场事实应该去哪个 Owner 查", "当前问题是否需要展开专项合同"],
      entities: ["AGENTS.md", "E release", "事实 Owner", "合同 Catalog", "Git 控制面", "PCConfig"],
      relations: ["本轮用户要求高于项目规则和全局习惯", "项目规则拥有本项目业务语义与验收", "仓库、机器和业务事实分别回到自己的 Owner"],
      failureRecovery: ["规则不可读时只把依赖结论标为 Unknown", "Catalog schema 漂移时停止跨控制面推断", "旧报告与现场冲突时回读 current E release 和真实 Owner"]
    },
    decisionImpact: ["项目有更具体规则时，优先按项目规则执行。", "需要 Git 或机器动态事实时，改去对应控制面现场读取。", "只有当前问题真正触发时才展开专项合同。", "来源冲突无法同时满足时停止，不用猜测拼接。"],
    problem: "当全局要求、项目规则、历史文档和现场状态同时存在时，必须有一套稳定方法判断谁拥有事实、哪一层优先，否则模型会把旧报告当规则、用全局原则覆盖项目业务，或者一次性加载所有材料后丢失注意力。",
    implementation: [
      "根规则只保留跨项目元规则和硬边界；保护、授权、三控制面和能力选择分别下沉到专项合同。",
      "项目根到当前目录链上的最近规则拥有业务语义、真实命令、兼容、生成区、Owner 和项目安全；全局通常只能取交集或收紧。窄例外是授权合同唯一拥有的 PUBLIC 个人数据分级与项目收紧授权。",
      "contract catalog 只保存触发 metadata、owner、文档和 validator 指针。模型先看 metadata，再按当前决定的信息价值读取正文。",
      "历史计划、报告、生成物和记忆只作线索，不会自动成为当前指令或动态事实。"
    ],
    flow: [
      "Inspect current E release 并取得同一 ruleset 的根规则",
      "读取当前项目最近的规则并确定业务 Owner",
      "用 catalog metadata 判断是否需要保护、授权、能力或三控制面合同",
      "只展开会改变当前决定的正文和现场 Provider（事实入口）",
      "发生冲突时按上位指令、项目语义和全局硬边界逐层处理"
    ],
    concepts: [
      { term: "事实 Owner", explanation: "某类动态事实的唯一负责来源。文档指针可以导航，但不能代替它的现场回读。" },
      { term: "Project rule nonoverride（项目规则通常不覆盖）", explanation: "全局规则不能改写具体项目的业务语义、命令或兼容约束；唯一窄例外是授权合同统一拥有 PUBLIC 个人数据分级和项目收紧 L1/L2 默认的授权条件。" },
      { term: "渐进读取", explanation: "先确认 metadata 是否相关，再读取必要正文，不把全部合同机械灌进每个任务。" }
    ],
    boundaries: [
      "README 和操作指南面向人，不是执行规则或动态权威",
      "catalog 只能选择候选正文，不能证明某个 effect 已发生",
      "全局规则不能以统一为理由覆盖项目业务与测试；项目若要收紧 L1/L2 公开默认，必须有真实需要和用户对精确项目、范围、限制的明确授权",
      "兼容文件名和历史命名不能恢复已经退役的控制面"
    ],
    failures: [
      { condition: "规则优先级冲突", response: "保留冲突两端的原文和 Owner；无法同时满足时失败关闭并说清差异。" },
      { condition: "catalog 缺项或 schema 漂移", response: "停止依赖该 catalog 的跨控制面结论，回到真实 Owner 修复 coverage。" },
      { condition: "人类指南与活动规则不一致", response: "current E release 继续作为权威，同时把过期指南视为待修缺陷。" }
    ],
    sources: [
      { path: "E:\\.agents\\AGENTS.md", role: "跨项目根规则的 canonical source" },
      { path: "E:\\.agents\\docs\\contracts\\README.md", role: "合同导航和三控制面关系说明" },
      { path: "E:\\.agents\\config\\control-plane-contract-catalog.json", role: "触发 metadata、owner 和 validator 的唯一目录" }
    ],
    verification: [
      `E rules Inspect 确认根规则来自 current ${panelSnapshot.authority.releaseId} release，而不是 dirty canonical source 或 C 盘历史`,
      "GlobalRulesStructure 验证根承诺唯一性、合同指针和字符预算",
      "ContractCatalog 与 ContractRouting 验证 schema、路由和 unknown trigger 的失败关闭",
      "跨控制面 coverage 单独验证所有 owner 合同是否进入 catalog"
    ],
    relation: "这个模块决定从哪里开始和应该读什么；能力路由决定怎样做，授权与 Owner 决定谁可以做，保护策略决定重大动作依据哪一代规则。"
  },
  {
    slug: "capability-routing",
    shortTitle: "能力路由",
    title: "能力、方法与原生代理路由",
    teaser: "用户只说目标；AI 找到现有能力，在可信身份成立后自主决定方法与并行，并在不删产品功能的前提下强制选择满足完整验收的最小充分技术架构。",
    status: "已落地；身份门禁与路由回归通过",
    statusTone: "pass",
    value: "我不需要背 Skill（能力入口）、工具、插件或代理名称。AI 先找现有入口，再按任务价值选择方法；涉及子代理时由宿主验真、AI 决定 0–10 和分工。涉及架构时，产品功能和质量先完整保留，能用现有入口、单模块或少步骤满足同一验收，就不能另加服务、数据库、状态机或证明层。",
    why: "读取文件、转写录音、修复代码、跨项目审计和验收页面需要的能力不同。过度简化会丢需求，过度工程化又会增加等待、失败、维护和恢复成本。系统必须同时讲清身份与并行，也要讲清新增每一层技术结构究竟解决哪一项已证需求缺口。",
    example: "例如我说“功能、可靠性和维护性都保留，但别为了显得专业再加服务、数据库和状态机”。AI 先冻结完整验收；若现有项目内一个模块已经满足，就直接实现并验证。只有短路线明确缺少某项验收，且当前证据证明新增层正好解决该缺口时，才允许最小增量。若自造层导致失败，先删除或绕开那一层，不继续叠 guard、receipt 或 fallback。",
    result: "我会得到与任务匹配的能力组合、可信并行和最小充分实现：产品语义与质量不被删，新增技术层都有明确消费者和验收依据。身份或能力缺失只关闭受影响路线；复杂实现失败先收缩架构，最终说明用户可见结果、真实缺口和没有引入的多余层。",
    readerStates: { pass: "可信身份、授权、能力和完整验收成立后，AI 选择方法与并行；短路线满足 complete acceptance floor（完整验收底线）时强制采用，不新增无证据技术层。", problem: "身份、参数、写范围、资源或验收变化时重判；新增层无法映射精确需求/质量缺口，或该层导致失败时，停止写入并先删层/绕开复杂度。", unavailable: "Hook 缺失只关闭委派；短路线证据不足时先补最小证据，不以假想未来授权长架构。普通调查、实现、测试和答复继续。" },
    searchAliases: [
      "Hook到底检查什么，谁决定开几个代理",
      "UserPromptSubmit和SubagentStart有什么区别",
      "PreToolUse为什么不能替代前置判断",
      "什么时候需要实现盲测",
      "不点名Skill怎么验AI会自己选路",
      "点名工具的测试算不算盲测",
      "Codex官方更新后为什么不能看版本号准入",
      "功能不删怎样选择最小充分架构"
    ],
    searchProjection: {
      intents: ["Hook 到底检查什么以及谁决定 0–10", "什么时候需要 implementation-blind fresh E2E", "怎样证明 AI 在没有路线提示时自己选对能力", "Codex 官方更新后怎样保持能力连续", "不删产品功能时怎样选择最小充分架构", "新增技术层需要什么证据"],
      entities: ["UserPromptSubmit / SubagentStart", "PreToolUse / verified identity", "route_selected_without_hint", "directed_execution_test", "package family", "complete_acceptance_floor", "minimum_sufficient_architecture_hard_gate", "complexity_failure_collapse"],
      relations: ["UserPromptSubmit和SubagentStart在判断前提供各自身份", "AI决定数量和家族而Hook只验真", "PreToolUse只在spawn前复核TOCTOU", "稳定主体与事件能力发现高于版本路径", "用户和业务Owner拥有产品复杂度", "同一验收下短路线满足就禁止长路线", "新增技术层逐项映射精确需求和当前证据", "自造复杂度失败先删层而不是加门"],
      failureRecovery: ["可信身份缺失时只关闭委派并继续普通任务", "创建前身份或上限漂移时取消本次spawn后重判", "盲测点名路线时降为directed execution test后重测", "新增层无法举证时禁止写入和派发", "自造复杂度失败时先删除或绕开该层", "官方更新缺失精确能力时只降级受影响路线"]
    },
    decisionImpact: [
      "简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。",
      "root 的 UserPromptSubmit 与 child 的 SubagentStart 在任何 0–10 判断前注入 verified model、effective effort、role、turn hash 和当前 E identity。",
      "AI 根据任务语义、独立可验性、质量、墙钟、冲突、资源和 slots 自主决定 0–10、家族与 effort；Hook 不做调度。",
      "PreToolUse 只在真实 spawn 前复核 TOCTOU、家族/effort 上限、参数与跨身份 fork，不能取代判断前身份。",
      "只有完全没有 Hook 或身份注入的旧 root 才复用同一任务中用户已经给出的自然语言 model/effort 确认；确认层规范化别名，thread binding 只写 canonical ID，child 不继承。E identity 换代只刷新快照、重读并重派生，不重复确认。",
      "实现者知道内部答案可能污染验收时，AI 主动安排 implementation-blind fresh E2E，而不是等用户说出“盲测”。",
      "测试自然语言自主路由时，提示不点名 Skill、tool、plugin、provider、内部路径或预期路线，同时验 route_selected_without_hint 和用户可见结果。",
      "Codex 官方更新按稳定主体、事件和现场能力发现保持连续；app version、build 与 versioned path 不准入，真实能力缺失才局部降级。",
      "产品/需求复杂度由用户和业务 Owner 决定；反膨胀只能优化实现，不能删功能、流程、状态、体验、质量、维护性或已证扩展轴。",
      "写入前冻结完整验收底线；原生能力、现有入口、单模块或少步骤已经满足时，长路线属于 prohibited_unjustified_complexity（禁止的无依据复杂度）。",
      "新增 source/module、服务、任务、进程、watcher、schema、数据库、队列、状态机、Owner、receipt 或验证层，都必须逐项对应一个短路线未满足的验收项和当前正面证据。",
      "Agent 自造复杂度导致失败时执行 complexity_failure_collapse：先移除或绕开复杂层，再重判最小路径，不能默认继续叠 guard、preflight、baseline、fallback 或状态。"
    ],
    problem: "工具、Skills、插件和模型很多，真正困难的不只是选哪个，还要防止两种错误：借反膨胀删掉真实产品需求，或把产品复杂误当成可以无限增加技术层的理由。固定模板会让简单任务膨胀；自造层失败后继续叠门又会把工程成本和等待转嫁给用户。",
    implementation: [
      "model intuition precedence 让模型根据目标、风险、信息增益、延迟、耦合、可逆性和净收益选择方法。",
      "Skill、Plugin、模板和计划默认只是建议性制品，不能凭正文里的 MUST 自行升级为硬门。",
      "初始工具列表不是能力上限；先查 owner adapter、固定 CLI/API 和当前 metadata，确认实质缺口后才降级或建议插件。",
      "UserPromptSubmit 验证 root transcript，SubagentStart 从 child transcript 绑定 lineage；两者都在 0–10 判断前注入 model（模型）、effective effort（实际思考等级）、root/child role、turn hash、E release、Git commit、五文件 ruleset 和合同 SHA。",
      "收到可信身份后由 AI 按任务语义选择 0–10、Luna/Terra/Sol 家族、effort、scope 和 fork；稳定 Hook 只验证身份、E rules 与参数，不选择也不创建。",
      "PreToolUse 在真实 spawn 前独立重建现场身份，复核 TOCTOU、父级家族与 effort 上限、参数和跨身份 fork；SubagentStart 再以真实 child turn context 绑定结果。",
      "完全无 Hook 的旧 root 可以把同一任务中用户已有的自然语言 model/effort 确认规范化为 canonical ID，写入并回读同一 CODEX_THREAD_ID 的 user_attested_verified；E identity 换代时重读、重派生并刷新快照，不重复索要确认，规则撤销该路径时失败关闭；宿主身份恢复后优先用宿主，child 从不借父绑定。",
      "blind acceptance detection 在内部测试不能代表自然语言、UI、provider、模型或恢复结果时，给 fresh evaluator 最小充分的用户可见目标和正常环境，不给 diff、根因、修复线索与无关项目细节。",
      "natural intent blind routing E2E 保持正常能力 metadata 可见，但提示只说自然用户目标；验收同时检查无提示选路和可见结果，点名路线只记录为 directed execution test。",
      "Codex official update continuity 只认稳定 PFN/package family、signer/principal、device/bridge key、schema/event/capability 与 current discovery；版本号、build、带版本路径、update epoch 和可选 metadata 不作为准入。",
      "同一官方主体更新或 optional metadata 缺失不触发 step-up/BLOCK；只有精确 event 或 capability 现场不存在时关闭对应能力，普通项目不受影响。",
      "change_surface_validation 按现实风险和 diff 影响面选择 focused 或 standard 验证；E rules 快速发布目标 180 秒内并分列测试、Git、push/readback、UAC activation 墙钟。",
      "product_requirement_complexity_authority 把产品与技术复杂度分轴：用户/业务 Owner 拥有用户可见需求，技术结构逐项映射精确需求或质量不变量。",
      "minimum_sufficient_architecture_hard_gate 先冻结功能、好用、正确、可靠、可恢复、性能、可维护、兼容和已证扩展轴，再在同一 floor 下强制选择总成本更低的路线。",
      "新增技术层要列出对应验收项、短路线失败证据和最小解决增量；假想未来、最佳实践、更安全、更完整或额度充足都不能举证。",
      "complexity_failure_collapse 要求因新增层/状态/证明链失败时先删层或绕开，不给原长路线继续增加 guard、receipt、preflight、baseline、fallback 或状态。",
      "长任务保留可重建目标、边界、关键决定、实现和验证状态；压缩摘要只作线索。"
    ],
    flow: [
      "理解自然语言目标、用户可见结果和不能越过的边界",
      "查询已有 Owner、原生入口和当前能力 metadata；实证缺口出现前不安装第二套路线",
      "root 由 UserPromptSubmit、child 由 SubagentStart 在 0–10 判断前取得可信身份与当前 E identity",
      "AI 评估独立可验性、质量、墙钟、写入冲突、资源和 slots，自主决定 0–10、家族、effort 与 scope",
      "root 派出 child 后继续战略、依赖、风险和不冲突工作，不把等待冒充进展",
      "每次真实 spawn 前由 PreToolUse 复核现场身份、TOCTOU、上限和参数；漂移则取消这次创建并重判",
      "能力确实缺失时才安装官方运行时或提出精确插件；官方更新只按稳定主体、事件和能力现场局部降级",
      "架构变更前冻结完整验收；比较现有入口/单模块短路线与长路线在用户时间、额度、金钱、IO、退出和返工上的总成本",
      "短路线满足同一验收就直接采用；不满足时只增加解决已证缺口的最小技术层",
      "新增层导致失败时先收缩架构，再重新运行受影响验收，不继续沿长路线叠复杂度",
      "实现知识可能污染验收时，另给 fresh evaluator 最小自然目标和正常环境，不暴露内部答案",
      "最后分别验证能力可用、route_selected_without_hint、用户可见结果与剩余 Unknown；定向测试单列"
    ],
    concepts: [
      { term: "Advisory artifact", explanation: "提供方法和入口，但不会自动取得更高优先级、授权或施工 Owner。" },
      { term: "能力显著性", explanation: "metadata 先把可能相关的能力放回注意力，正文仍按当前问题的净收益渐进读取。" },
      { term: "身份先于委派", explanation: "代理名称和模型自报不算身份；没有可信身份时只关闭委派，主任务继续。" },
      { term: "Hook（宿主钩子）", explanation: "宿主在固定事件点注入或复核可信事实；它不调度代理、不创建 child、不产生授权。" },
      { term: "UserPromptSubmit / SubagentStart", explanation: "前者为 root 请求，后者为 child 启动；都必须在该代理进行 0–10 判断前提供自己的 verified identity。" },
      { term: "PreToolUse", explanation: "真实 spawn 前的二次现场复核，只处理 TOCTOU、上限和参数，不能成为第一次得知身份。" },
      { term: "Implementation-blind fresh E2E", explanation: "让不知道 diff、根因和预期路线的新评估者，按最小用户目标走正常产品路径。" },
      { term: "Natural-intent blind routing", explanation: "提示不点名能力路线，正常 metadata 仍可见；同时验证 AI 自己选路和最终用户结果。" },
      { term: "Directed execution test", explanation: "明确告诉模型使用哪个 Skill、tool 或 provider 的定向测试，只证明该路线能执行，不证明自主路由。" },
      { term: "Official update continuity", explanation: "官方同主体更新以稳定 package family、签名、事件和当前能力发现延续，不把易变版本号或安装路径当身份。" },
      { term: "Complete acceptance floor（完整验收底线）", explanation: "功能、好用、正确、可靠、恢复、性能、可维护、现有兼容和已证扩展轴的共同验收；短长路线必须在同一底线上比较。" },
      { term: "Minimum sufficient architecture（最小充分架构）", explanation: "满足完整验收所需的最少技术层、节点、状态和人工步骤；不是靠删产品功能获得的表面简单。" },
      { term: "Complexity failure collapse（复杂度失败收缩）", explanation: "Agent 新增的层导致失败时，先删除或绕开该层再重判；不能继续给长路线叠证明和保护结构。" },
      { term: "证据式降级", explanation: "只有入口真实缺失、失败或策略阻断时才换路线，不因想象中的风险先降级。" }
    ],
    boundaries: [
      "能力发现不会扩大用户授权",
      "账号、插件、管理员权限令牌和子代理都不能绕过 Owner（责任源）或 effect（外部现实动作）边界",
      "不为假想未来预装动态配置服务、兼容层或第二套 Provider（服务入口）",
      "子代理模型家族和 effort 不能高于父级允许上限",
      "Hook 只验证身份、E identity 和参数；0–10、家族、分工与验收由 AI 决定",
      "旧 root thread binding 仅用于宿主完全无 Hook 或注入，只保存 canonical ID；E 代际变化不使已成立的用户确认失效，child 不继承且不能覆盖冲突的宿主身份",
      "不依赖 Stop Hook；回执缺失不能阻塞普通工具或最终答复",
      "app version、build、versioned executable path、update epoch 和 optional metadata 不能成为准入门",
      "盲测不是每次机械执行；客观需要时也不能因省上下文或反膨胀而跳过",
      "测试提示点名 Skill、tool、plugin、provider、内部路径或预期路线时不得称为 blind routing E2E",
      "反膨胀不删除或降级用户已知且接受的产品语义，也不以一次性烂代码、封死真实扩展点或漏验收伪造简单",
      "任何新增技术层若没有精确需求、短路线失败验收和当前证据，写入、派发和制品创建都停止"
    ],
    failures: [
      { condition: "委派身份不可验证", response: "停止 spawn，但继续本地调查、实现、测试和答复。" },
      { condition: "PreToolUse 发现身份、家族、effort、参数或 fork 已漂移", response: "取消这一次 spawn，回到当前身份和任务范围重判，不扩大授权。" },
      { condition: "旧 root 没有 Hook，且同一任务中不存在用户对 model/effort 的明确自然语言确认", response: "不建立对话绑定、不猜身份；主任务继续，只有委派不可用。" },
      { condition: "provider 缺失或账号不可用", response: "报告确切缺口，不伪造第二 provider 或静默换账号。" },
      { condition: "盲测提示泄露 Skill、工具、Provider 或预期路线", response: "把该结果降为定向执行证据，用新的独立上下文和纯自然意图重新验收。" },
      { condition: "官方更新后某个精确 event 或 capability 不存在", response: "只关闭受影响的 Hook 或能力并报告缺口；不因版本号或路径变化阻塞普通项目。" },
      { condition: "子代理中断", response: "优先恢复原 session；无法恢复才重新执行，partial 不能冒充完成。" },
      { condition: "新增技术层无法映射精确需求或质量缺口", response: "标记 prohibited_unjustified_complexity，停止写入/派发/创建制品，回到现有入口或更短路线。" },
      { condition: "Agent 新增的服务、状态机、证明链或验证层导致任务失败", response: "先移除或绕开该复杂度并重判完整验收；只有短路线被独立证据证明不足时，才恢复精确最小增量。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.capability-routing.md", role: "能力、上下文、复杂度和原生委派的唯一语义 owner" },
      { path: "E:\\.agents\\skills\\native-economy-routing\\SKILL.md", role: "把活动委派门禁恢复到注意力的窄入口" },
      { path: "E:\\.agents\\tools\\codex_native_economy_gate.py", role: "稳定 Hook bridge；只核对事件、受管 runtime 指纹和调用边界" },
      { path: "E:\\.agents\\tools\\codex_native_economy_runtime.py", role: "UserPromptSubmit、SubagentStart 与 PreToolUse 的身份注入和创建前复核实现" },
      { path: "E:\\.agents\\tests\\Test-AttentionFidelityPolicy.ps1", role: "实现盲测、自然意图路由、无提示选路与定向测试边界回归" },
      { path: "E:\\.agents\\tests\\Test-AgentRuntimeCompatibility.ps1", role: "官方更新稳定主体、版本路径非准入和能力局部降级回归" },
      { path: "E:\\.agents\\config\\on-demand-plugin-catalog.json", role: "只有实证能力缺口时读取的插件 metadata" }
    ],
    verification: [
      "NativeEconomyRoutingGate 验证 UserPromptSubmit/SubagentStart 的判断前注入、E identity 先行、家族/effort 上限与 PreToolUse 创建前复核",
      "AgentRuntimeCompatibility 验证官方同主体更新以稳定 package/signature/event/capability 连续，app version 和 versioned path 不参与准入",
      "AgentAutonomyPolicy 与 AttentionFidelityPolicy 验证模型主动识别盲测、提示不泄露路线、route_selected_without_hint 和 directed_execution_test 的证据边界",
      "E97 根规则和 capability contract 继续承载 E96 建立的产品复杂度权威、complete acceptance floor、minimum sufficient architecture hard gate 与 complexity failure collapse，并新增旧 root 用户确认的代际连续性；网页不把 E95 的复杂度概述冒充当前语义。",
      "implementation-blind fresh E2E 只有在 fresh evaluator 未获得 diff、根因或路线提示，并真实走完用户路径后才成立",
      "natural-intent blind routing E2E 必须同时证明 AI 自己选择了正确路线和用户可见结果正确；只命中工具或只得到答案都不完整",
      "聚焦 Hook、合同和定向执行回归只能证明对应机制，不冒充某个真实自然语言任务的盲测结果"
    ],
    relation: "能力路由决定怎样做、是否并行和怎样验收；Hook 只为该判断提供可信身份并在创建前复核。它不产生用户授权、Execution Owner 或 E release，这些分别由授权和保护合同拥有。"
  },
  {
    slug: "authorization-owner",
    shortTitle: "授权与 Owner",
    title: "用户授权、CoreGoal 与执行 Owner",
    teaser: "把用户目标拆成耐久授权、目标身份、施工范围、步骤能力、lifecycle 收敛和真实收口；既不反复索权，也不越过实际 deny、step_up 或证据门。",
    status: "合同已生效；Owner registry 回归通过",
    statusTone: "pass",
    value: "防止“用户让我做事”被误解成任何代理都能对任何对象任意写，也防止多个任务同时改同一范围或任务结束时遗失未完成义务。",
    why: "用户同意一个目标，不等于所有代理都能无限扩大范围；多个任务同时修改同一文件，也可能互相覆盖或各自误报完成。",
    example: "例如我说“这个看板以后通过检查就发布到现有地址，不要每次再问，但也别覆盖另一个任务正在改的内容”。系统会复用这项明确授权，现场确认发布目标和最小施工范围，前提成立就真实调用一次；目标变化、范围冲突或工具实际拒绝时才停对应步骤。",
    result: "每一步都能回答授权是否跨轮次仍有效、真实工具有没有被调用、谁正在改哪一块、旧 Owner 是否真正终态、以及远端是否完成回读；未完成义务会随检查点移交。",
    readerStates: { pass: "目标、授权和施工范围明确且没有重叠 Owner 时，执行、验证和正常收口可以连续推进。", problem: "发现重叠施工、目标扩大或步骤事实漂移时，停止对应写入并重新协调或派生步骤。", unavailable: "授权事实或 Owner registry（施工登记表）不可验证时，外部写入和受保护动作停止；只读调查可以继续。" },
    searchProjection: {
      intents: ["同一目标已经授权为什么还反复问", "谁正在修改这个最小范围", "外部动作与本机可逆操作怎样区分", "旧任务未完成内容怎样交给 successor", "把PUBLIC项目里被忽略的私有材料迁到PRIVATE伴随仓库"],
      entities: ["durable explicit user authorization", "CoreGoalCommitment / StepCapability", "Execution Owner / CAS", "external effect / threadId", "public project private companion", "ignored untracked material", "PRIVATE manifest / default-branch read-back", "rollback rename / local-only link"],
      relations: ["用户授权不等于 UAC 或 Agent 身份", "CoreGoal 固定目标而步骤能力绑定一次 effect", "Execution Owner 协调写入范围但不制造授权", "有 residual 的旧 Owner 通过 checkpoint 转给真实 successor", "PUBLIC worktree只筛明确ignored材料", "PRIVATE远端hash回读先于替换原件", "local link必须继续不进入PUBLIC staging"],
      failureRecovery: ["重叠 Owner 时先解析 lifecycle 再 Claim 或 Transfer", "目标或 executor 漂移时废弃步骤能力并重新派生", "真实工具返回 deny 或 unavailable 时按现场结果停止", "PRIVATE target可见性或远端回读失败时保留原件", "link进入PUBLIC status时回滚rename并停止", "非 fast-forward时保留双方改动并停止推送"]
    },
    decisionImpact: ["本机低风险可逆操作可直接继续。", "用户明确标记的长期授权在冻结 goal/scope 内跨轮次、压缩、root、全部 child/后代和新顶层任务持续有效。", "前提成立时必须真实调用一次，不因通用工具说明、缓存失败或 AI 预判再次索权。", "system/developer、实际 deny/step_up/needs_evidence/action-time confirmation 与现场身份、CAS、target、read-back 失败仍有效。", "用户私人账号空间在没有 public/share 信号时与本机私密目标等价可信。", "PUBLIC 个人数据只有 L3+ 才进入可能敏感审查，L1/L2 不因属于个人数据而删改。", "PUBLIC 项目的有价值 ignored 私有材料不是自动丢弃物；没有现成 PRIVATE 远端覆盖时，应在不打开已推送版本正文的前提下收敛进唯一 PRIVATE companion。", "有重叠 Owner 先用固定 resolver 判断 lifecycle；归档不是终态证明。", "普通非长期 terminal scope，或已归档且 clean 的 predecessor，无 residual 时用 RecoverRelease；有 residual 才带 checkpoint RecoverReleaseClaim。", "未归档 long_term_task 不自动释放，只能明确接续或正式退役。", "只有真实 threadId 可归档，clientThreadId 只是创建中回执。", "complete goal 是关闭状态；来源任务仍须确认无 follow-up、queue、pending transaction 和 Owner residual 才可逆归档。"],
    problem: "用户说要完成一件事，不等于任何代理都能对任何对象执行所有动作。系统必须区分用户授权、操作系统权限、最高权限身份、目标是否仍是原目标、施工范围是否被别人占用，以及动作完成后是否有正式回读。",
    implementation: [
      "低风险、可逆、范围内的本机读取、编辑和测试直接推进；消息、外部写入、发布、部署和付费需要明确授权。",
      "durable explicit user authorization 在冻结 goal/scope 内跨轮次、压缩、root、全部后代和新顶层任务持续有效；项目只能定义客观 precondition，不能把它降为 absent 或要求同轮重述。",
      "durable authorization attempt once 要求前提成立后真实调用一次 adapter/tool；只有实际 unavailable、deny、step_up、needs_evidence、action-time confirmation、error 或现场证据失败才决定本次结果。",
      "CoreGoalCommitment 冻结目标、范围、禁止项和停止条件，不冻结计划、代码、执行器或后续 epoch。",
      "每个现实步骤使用短时、单次、防重放的步骤能力，绑定 effect、目标、pre/post、回滚和 executor。",
      "scoped execution owner（范围化施工责任）用 expected revision CAS（预期修订号比较后交换）认领最小 scope（施工范围）；纯只读审计不需要排他绑定。",
      "Owner 冲突先由固定 Codex lifecycle resolver 证明 active 或 terminal；resolver 读取物理 CODEX_HOME，只有验证 C 盘 compatibility junction 指向同一 E 根后才归一 rollout 路径，绝不把兼容目录当成第二 authority。普通非长期或已归档且 clean 的 terminal predecessor 无残留时逐 scope RecoverRelease，有 checkpoint/residual 才 RecoverReleaseClaim 给真实 successor。未归档 long_term_task 只接续或正式退役。",
      "来源创建的顶层任务只有取得真实 threadId，且正式完成/停止后无 follow-up、queue、pending transaction 或 Owner residual，才由来源可逆归档；complete goal 已关闭，不算 open residual。",
      "当前已认证账号属于用户、目标默认私人且没有 public/share 信号时，私人账号空间与本机、workspace 和 BitLocker 盘同属 default trusted target（默认可信目标）；可信不等于已授权写入。",
      "PUBLIC 个人数据按唯一 L1–L5 表判断最终载荷整体；没有达到 L3+ 的正面证据时默认按 L2，项目不能靠自写规则把 L1/L2 变成受限内容。",
      "PUBLIC companion 只审 Git check-ignore/本机 exclude 明确忽略、未跟踪且未暂存的 path；tracked/unignored 候选留给公开项目 Owner，已推来源GitHub的版本不重新打开复审。依赖、cache、build、普通日志、可重建下载、活数据库和大制品默认排除。",
      "迁移按 copy/hash → PRIVATE manifest+commit/normal push → default branch/hash read-back → 同卷 rollback rename → local-only link 与 PUBLIC git status 回读执行；PRIVATE远端回读成功前绝不替换原件。",
      "Git 完成和业务完成分别报告；个人仓库最终必须从真实默认分支可达并由远端回读。"
    ],
    flow: [
      "解析现实 effect 和目标",
      "判断当前请求或既有 durable grant 是否已明确覆盖精确动作",
      "前提成立时真实调用一次，并保留实际 tool result 分类",
      "解析 registered target 的当前状态和允许动作",
      "Inspect Owner；冲突时先解析 lifecycle，再 Claim、RecoverRelease 或 RecoverReleaseClaim 最小 scope",
      "为单一 effect 派生短时步骤能力",
      "在副作用边界重读目标事实后执行",
      "若目标是PUBLIC ignored私有伴随材料，先筛候选并现场重验唯一PRIVATE companion，再按复制/远端回读/可回滚替换/link状态链执行",
      "取得 owner receipt、read-back 和必要的 Git 收口",
      "释放 Owner，或将未完 residual 连同 checkpoint 原子移交"
    ],
    concepts: [
      { term: "CoreGoal", explanation: "长期不变的目标承诺。实现细节变化不会强迫用户重新确认，目标扩大才建立 successor。" },
      { term: "Durable explicit user authorization（耐久明确用户授权）", explanation: "用户已明确、持续同意的窄授权；在冻结边界内不要求 root、child 或 successor 同轮重述。" },
      { term: "Attempt once（真实尝试一次）", explanation: "所有前提满足后必须实际调用 adapter/tool 一次；unavailable、failed 与 dispatch-unconfirmed 由真实结果区分。" },
      { term: "步骤能力", explanation: "只允许一次精确 effect 的短时凭据，过期或事实漂移后必须重新派生。" },
      { term: "Execution Owner", explanation: "协调谁在改哪一块，不替代事实 Owner，也不产生用户授权或管理员权限。" },
      { term: "Registered target", explanation: "reference 证明目标是谁，live resolution 说明现在能做什么；两者都不证明动作已发生。" },
      { term: "Public personal data classification（公开个人数据分级）", explanation: "跨项目唯一的 L1–L5 表；只有 L3+ 才进入个人数据可能敏感审查。" },
      { term: "Project publication restriction authority（项目公开限制授权）", explanation: "项目收紧 L1/L2 默认时，必须有真实项目需要和用户对精确项目、范围、限制的明确授权；项目自写不成立。" },
      { term: "Source task auto archive（来源任务自动归档）", explanation: "来源只在真实 threadId 已解析、任务终态且无后续、队列、pending transaction 或 Owner residual 时执行可逆 archive。" },
      { term: "Private companion（私有伴随仓库）", explanation: "为一个PUBLIC项目保存Git明确忽略但有价值的私有材料的唯一已登记PRIVATE目标；映射和本机指针不进入PUBLIC提交。" }
    ],
    boundaries: [
      "UAC（Windows 管理员确认）只提升 Windows 进程权限，不扩大任务授权",
      "耐久授权不覆盖 system/developer/platform、实际 deny/step_up/needs_evidence/action-time confirmation，也不扩大目标、账号、公开面、付费、秘密或不可逆边界",
      "子代理、shell、worktree 和插件不能绕过已有重叠 Owner",
      "force-push、新公开面、付费和不可恢复动作不在默认收敛授权内",
      "PRIVATE 或可信目标不等于已经授权写入",
      "L1/L2 不受个人数据公开限制；真实 secret、第三人授权、许可和 external effect 授权仍是独立边界",
      "PRIVATE companion不接管tracked/unignored候选，不用skip-worktree、硬链接或改公开.gitignore隐藏内容，也不迁移可重建cache、活数据库和大制品"
    ],
    failures: [
      { condition: "目标或 executor 漂移", response: "废弃当前步骤能力，现场重读后在同一 CoreGoal 下重新派生。" },
      { condition: "发现重叠 Owner", response: "先用固定 resolver 判断是否 archived/terminal；只有仍 active 的 Owner 才发送一次有界请求。" },
      { condition: "长期授权已覆盖但平台结果未知", response: "真实调用一次；按 unavailable、deny、step_up、needs_evidence、error 或 dispatch-unconfirmed 的实际结果收口，不靠预判。" },
      { condition: "旧任务已归档但有 open goal 或 turn_aborted", response: "保留旧任务归档；用 checkpoint 和 residual 原子 RecoverReleaseClaim 到真实 successor。" },
      { condition: "Git 非 fast-forward", response: "停止推送并解决同步，不使用 force-push掩盖冲突。" },
      { condition: "任务仍有 residual", response: "保留 lease，记录 checkpoint 并转交真实 successor，不能直接宣称完成。" },
      { condition: "PRIVATE companion可见性、copy/hash、commit/push、default-branch/hash回读或local link状态任一步失败", response: "远端回读前不替换原件；替换后失败则用同卷rollback rename恢复原件，移除有问题的link并保持PUBLIC状态不含候选。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.authorization-delegation.md", role: "授权、CoreGoal、Owner、Git、可信目标、PUBLIC个人数据分级与PUBLIC项目私有伴随材料迁移合同" },
      { path: "E:\\.agents\\tools\\Invoke-ExecutionOwnerRegistry.ps1", role: "Owner CAS、scope transition 和 action authorization 入口" },
      { path: "E:\\.agents\\tests\\Test-ExecutionOwnerRegistry.ps1", role: "Owner claim、冲突、移交和恢复回归" }
    ],
    verification: [
      `${panelSnapshot.authority.releaseId} release descriptor 确认授权合同路径、SHA 和 bytes 来自同一 ruleset`,
      "ExecutionOwnerRegistry 聚焦回归验证 Claim/Add/Transfer/Release、RecoverRelease/RecoverReleaseClaim、complete goal 与 archived lifecycle 语义",
      "E97 活动授权合同继续把 PUBLIC companion 迁移绑定为 PRIVATE 远端先完成 default-branch/hash 回读、随后才替换原件并验证 local link 继续 ignored；失败恢复原件，不接受半完成。",
      "Git 结果必须另由 Git owner 现场确认 default branch、remote 和 push read-back"
    ],
    relation: "这个模块决定谁被允许做哪一步；能力路由只推荐方法，保护策略只证明重大动作使用哪一代规则。"
  },
  {
    slug: "protected-policy",
    shortTitle: "保护策略",
    title: "E rules release、重大动作判断与 C 盘历史隔离",
    teaser: `当前 ${panelSnapshot.authority.releaseId} 由 PRIVATE main commit、递增 E 代号和五文件 ruleset 唯一绑定；C 盘旧 generation、Publisher、anchor 和 ledger 只作恢复历史。激活只做 UAC 原子 current/previous 切换，不运行旧平台。`,
    status: `${panelSnapshot.authority.releaseId} current 已验证；previous=${panelSnapshot.authority.previous?.release_id || "无"}，C 盘生产读者为 0`,
    statusTone: "mixed",
    value: "让我直接知道当前是哪五份规则、怎样激活和回退，并保证 dirty source、C 盘失败和 App 版本变化不会误阻塞普通任务；高影响现实动作仍保留语义判断、精确目标和正式回读。",
    why: "规则需要快速编辑，但活动规则必须绑定不可变 Git commit 和五份字节。旧 C 盘发布平台包含大量服务、Publisher、账本和耦合消费者，长期造成阻塞和复杂度；E release 用更小的 current/previous 事务保留同样必要的可验证与恢复结果。",
    example: `例如我说“让这次规则修订正式生效，但出问题必须能退回上一版”。系统会把正在编辑的源码、已提交候选和真正生效版本分开；验证候选与 PRIVATE main、五文件指纹一致后才切换 current，同时保留 previous。尚未提交或哈希不符时，${panelSnapshot.authority.releaseId} 继续工作。`,
    result: `我会得到一个明确可用的当前规则版本和一个可回退的上一版本，普通任务不会被 dirty source 或 C 盘旧平台误阻塞；技术回执同时列出 ${panelSnapshot.authority.releaseId}、commit ${panelSnapshot.authority.gitCommit.slice(0, 7)}、五文件 path/SHA/bytes、ruleset、pointer revision ${panelSnapshot.authority.pointerRevision} 与 previous ${panelSnapshot.authority.previous?.release_id || "无"}。`,
    readerStates: { pass: "E current pointer、release record、五文件闭包和 remote-main 可达性验证时，按当前 E release 工作。", problem: "source dirty 或已进入下一候选时，活动 E release 继续有效，同时把未激活路径和当前源码测试单独标为 repair。", unavailable: "E pointer 或五文件哈希不可验证时只关闭依赖规则身份的动作，保留 current/previous；绝不回退到 C 盘。" },
    searchProjection: {
      intents: ["当前活动规则到底是哪一版", "怎样发布新规则并保留上一版回退", "dirty source 为什么不能冒充 current", "C 盘旧规则故障会不会阻塞现在"],
      entities: ["E release", "current pointer", "previous release", "release record", "ruleset SHA", "expected-preimage CAS", "PRIVATE main"],
      relations: ["一个 E release 绑定同一 commit 的五份规则", "current 和 previous 由受保护 pointer 原子切换", "dirty source 是候选而不是活动权威", "C 盘历史只供恢复不参与准入"],
      failureRecovery: ["五文件 SHA 或 bytes 不符时保留 current/previous", "pointer CAS stale 时重新 Inspect 而不覆盖", "新候选未激活时继续使用当前 release", "活动闭包不可验证时只关闭依赖规则身份的动作"]
    },
    decisionImpact: [`Rules 页面当前显示 ${panelSnapshot.authority.releaseId}，不再显示 generation 79 或 candidate/productionActivation。`, "dirty source 是未激活施工，不能覆盖 frozen release。", "C Authority unavailable 不再阻塞 Hook、spawn、Skill、Owner CAS 或普通项目。", "小而已知的规则 diff 可走 change-surface fast validation；触及保护/身份/Owner 等边界自动回标准路径。", "人类因子是否需要仍由最高权限智能体按现实影响判断。"],
    problem: "如果网页把 dirty source 当 current，就会把未完成施工冒充规则；如果继续读取 C Authority，又会让已退役平台影响当前任务。模块必须同时展示 E current、source candidate 和 C recovery-only 三层。",
    implementation: [
      "Invoke-EAgentRulesRelease.ps1 是唯一 activator/reader，current-rules.json 记录 current/previous、pointer revision 和 release record commitment。",
      `每代 release 固定五份 logical id、relative path、bytes、SHA、PRIVATE main commit 和 ruleset SHA；当前 ${panelSnapshot.authority.releaseId} 绑定 ${panelSnapshot.authority.gitCommit.slice(0, 7)} 与 ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…。`,
      "release 目录和 pointer 关闭 ACL 继承，由 SYSTEM 拥有；普通/管理员编辑器只读执行，Activator 临时写后恢复封闭 ACL。",
      "E82 新增英文中文括注、系统级反膨胀、语义保真和 projectless 默认；E83 增加 coordination_id 跨项目精确 scope；E84–E86 增加 change-surface validation、FastRelease 确定性回执与分阶段墙钟预算；E87 完成运行根与任务临时目录迁移语义；E88 扩展未来模型家族和 Ultra 路由；E89 明确 CI 只在影响交付、发布、兼容或用户决策时运行；E90 增加 PUBLIC 项目 ignored 私有伴随材料的 PRIVATE 收敛链；E91 建立 PUBLIC 个人数据唯一 L1–L5 表、私人账号空间等价可信与项目收紧授权窄例外；E92–E94 正式化耐久授权、真实调用、Owner 生命周期与 coordination 延续；E95 建立可信本地安全闭集、注意力和实现盲测；E96 把产品复杂度与技术复杂度分轴并加入最小充分架构硬门；E97 让旧 root 的用户确认跨 E 代际保持有效，并把 Owner lifecycle 记录从兼容 C 路径归一到物理 E 运行根。",
      "普通规则文本、目录、预算及对应测试可走 FastRelease：只跑变更闭集关键回归，但复用同一 Git、五哈希、pointer CAS、UAC activator 和 fresh Inspect；触及保护合同、Activator、ACL、Hook、Owner Registry、身份/授权或其他代码时必须回标准路径。",
      "E rules release 的机器侧 Git 收口、激活和回读目标为 180 秒内；回执分列 focused tests、commit、push/readback 与 UAC activation 墙钟，网络或用户处理 UAC 的等待单列。",
      "e81-retirement-dispositions 证明旧 C production reader count=0，退役未新增 background service、queue、database 或 task；Secret Broker 等独立产品保留。",
      "当前 source checkout 若 dirty，只计算 source SHA/bytes/差异并显示，不用它生成 Rules 正文。"
    ],
    flow: [
      "读取 current pointer 并验证 release record SHA",
      "验证 current E 代号、commit、ruleset 与五文件 descriptors",
      "确认 current commit 从 PRIVATE remote main 可达",
      "需要新代时先完成 source/test/Git，再生成新 E 代号和五文件哈希",
      "用 expected-pointer SHA 和 UAC 原子切 current/previous",
      "回读 ACL、hash、fresh root/child、真实 spawn 与压缩恢复",
      "网站只在 current release 改变时定向重建 Rules 快照"
    ],
    concepts: [
      { term: "E release（E 规则版本）", explanation: "递增 E 代号、PRIVATE main commit、五文件 descriptors 和 ruleset SHA 的不可复用绑定。" },
      { term: "Current pointer（当前指针）", explanation: "受保护 JSON，只在完整激活回读后指向 current 和 previous。" },
      { term: "Expected-preimage CAS（变更前像比较交换）", explanation: "只有 pointer 仍与准备时一致才切换，避免并发激活覆盖。" },
      { term: "Recovery-only history（仅恢复历史）", explanation: "C 盘旧规则材料可读保留，但不能成为 authority、fallback、Owner 证明或 runtime dependency。" }
    ],
    boundaries: [
      "不得创建新 C generation、调用旧 Publisher、读取 policy epoch 或恢复旧生产读者",
      "不得把 dirty source、任务标题、模型自报或临时 JSON 冒充 E current",
      "E activation 不消费 CoreGoal、人类因子或 Secret Broker，也不产生用户授权",
      "C/E 规则异常不能触发 BitLocker、锁盘、重启、读取秘密或创建 CoreGoal",
      "官方 App 版本、build 和 versioned path 不得成为准入"
    ],
    failures: [
      { condition: "Dirty source 或新 commit 未激活", response: "current release 保持有效；页面显示 source repair，不读取其正文替换 Rules。" },
      { condition: "五文件任一 SHA/bytes 不符", response: "拒绝新 release，保留 current/previous。" },
      { condition: "Pointer CAS stale", response: "重新 Inspect 当前 pointer，不覆盖其他激活。" },
      { condition: "C Authority 返回错误", response: "只作历史诊断，不形成当前 blocker，也不调用旧 Publisher。" },
      { condition: "页面 current 仍出现 gen79/candidate/productionActivation", response: "视为 P0 真实性缺陷，重建 E snapshot 后才允许发布。" }
    ],
    sources: [
      { path: "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1", role: "唯一 E release activator 与 current/previous reader" },
      { path: "E:\\.agents\\tools\\Invoke-EAgentRulesFastRelease.ps1", role: "已知小改的差异驱动快速入口；触及硬边界自动返回 standard_lane_required" },
      { path: "E:\\.agents\\releases\\current-rules.json", role: "受保护 current/previous pointer" },
      { path: panelSnapshot.authority.releaseRecordPath, role: `${panelSnapshot.authority.releaseId} commit、五文件 descriptors、ruleset 和发布时 clean/remote readback` },
      { path: "E:\\.agents\\config\\e81-retirement-dispositions.json", role: "旧 C 规则产品退役清单与零后台组件验收" },
      { path: "E:\\.agents\\tests\\Test-EAgentRulesRelease.ps1", role: "激活、ACL、rollback、dirty 拒绝和 C 隔离回归" }
    ],
    verification: [
      `${panelSnapshot.authority.releaseId} Inspect 返回 pass/e_rules_active_verified、pointer revision ${panelSnapshot.authority.pointerRevision}、previous ${panelSnapshot.authority.previous?.release_id || "无"}`,
      `${panelSnapshot.authority.releaseId} commit=${panelSnapshot.authority.gitCommit}，ruleset=${panelSnapshot.authority.rulesetSha256}`,
      "五份 release 文件路径、bytes 和 SHA 与 current descriptor 闭合",
      currentValidationDetail("E release validator"),
      currentValidationDetail("Full local tests"),
      "原生路由先验证宿主 model、effort、root/child 与同一 E release identity，再按任务语义选择 0–10 条支路；某次任务的代理数量只属于该次回执，不是持续项目状态"
    ],
    relation: "本模块拥有 E release 与重大动作保护；用户授权、CoreGoal、Execution Owner 和 Git/Pages 收口由授权合同拥有，能力家族/数量由能力合同拥有。"
  },
  {
    slug: "skills-plugins",
    shortTitle: "Skills / Plugins",
    title: "个人 Skills 与插件供应链",
    teaser: "用一份 registry 管理 canonical source、安装意图、发现入口和分层验证。",
    status: "供应源码、安装和事务当前通过；运行 E2E（端到端验证）不能由安装推断",
    statusTone: "mixed",
    value: "防止同一个 Skill 出现多份互相漂移的源码，也防止系统仅凭文件存在或 junction 存在就声称新任务真的能用。",
    why: "一个能力可能有源码、安装目录、当前任务注入和真实端到端结果四种不同状态。只看文件存在，会把未安装或不可用的能力误报成正常。",
    example: "例如我问“新加的配额查询能力明明已经有文件，为什么全新任务还是看不到”。系统会分别检查唯一源码、供应登记、发现 junction（目录联接）、安装事务、当前任务注入和 fresh task（全新任务验证）；只有新任务实际使用并给出结果后，才把最后一层记为通过。",
    result: "每个能力都会显示源码、安装、当前任务、全新任务和端到端证据；某一层缺失时只标记该层未知，不用绿色总状态掩盖。",
    readerStates: { pass: "源码、安装事务和对应运行证据各自通过时，只把已证明的层标成通过。", problem: "发现源码漂移、安装事务未闭合或新任务不可发现时，只阻断该能力的对应层并给出恢复入口。", unavailable: "唯一源码或安装 Provider（现场读取器）不可用时，该 Skill（能力）显示不可用或未知；不从旧回执和残留目录倒推正常。" },
    searchProjection: {
      intents: ["Skill 文件有了为什么新任务仍看不到", "怎样安装或恢复个人 Skill", "如何区分源码安装和真实可用", "退役 Skill 为什么不会被残留目录复活"],
      entities: ["personal-skill-supply registry", "canonical source", "junction", "transaction installer", "recovery capsule", "fresh task", "E2E"],
      relations: ["Registry 声明安装意图而 junction 只负责发现", "canonical source 与用户发现目录不是两份源码", "source、install、current task、fresh task 和 E2E 分层证明", "插件可以供应 Skill 但二者不是同一层"],
      failureRecovery: ["Source 映射漂移时不从用户目录反向复制", "安装事务中断时按 recovery capsule rollback 或 reconcile", "当前任务无回执时保持 Unknown", "退役残留只清理发现路径而不恢复能力"]
    },
    decisionImpact: ["Source（源码）、quick validation（快速校验）、junction（目录联接）和 transaction（安装事务）全部通过才算安装层健康。", "Current task（当前任务）、Fresh task（全新任务验证）和 E2E（端到端验证）没证据时显示 Unknown（证据不足）。", "安装中断时按 recovery capsule（恢复胶囊）回滚或 reconcile（收敛修复）。", "退役 Skill 的目录或旧测试不能让它重新出现。"],
    problem: "Skill 源码、用户目录可发现性、当前任务注入和真实自然语言 E2E 是不同事实。如果只看文件存在或 junction 存在就声称能力可用，最终会得到一份看起来很满、实际无法判断的清单。",
    implementation: [
      "E:\\.agents\\skills 与 plugins 是 canonical source；personal-skill-supply.json 是名称、来源和 install 意图的唯一 registry。",
      "用户目录只保存由事务 installer 创建的同名 junction，不允许手工维护第二份源。",
      "安装事务记录 intent、applied、pre-image 和 recovery capsule；回滚不依赖当前 registry，避免 registry 漂移后无法恢复。",
      "验证分成 source、install、transaction、current task、fresh task 和 end-to-end 六层。",
      "外部提供但已经真实接入且有持续价值的能力可以进入面板，来源必须与个人维护区分。"
    ],
    flow: [
      "从 registry 读取 active、inactive 和 retired 声明",
      "验证每个 canonical source 的 SKILL、编码和 frontmatter",
      "验证 discovery junction 精确指向 source",
      "检查是否存在 unfinished 或损坏的安装事务",
      "按宿主回执分别判断 current、fresh 和 E2E，不从 install 倒推",
      "新增或恢复时走事务 installer，失败时用 capsule 预览并回滚"
    ],
    concepts: [
      { term: "Canonical source", explanation: "唯一可维护正文；用户目录只是发现链接，不是第二份源码。" },
      { term: "Install intent", explanation: "registry 要求安装，不等于宿主已经注入，也不等于场景 E2E 已通过。" },
      { term: "Fresh task", explanation: "在安装完成之后启动的另一个任务真实看见该能力，不能由当前任务或旧回执替代。" },
      { term: "Recovery capsule", explanation: "记录固定 roots、目标、source 和 pre-image，使 registry 漂移时仍能安全恢复。" }
    ],
    boundaries: [
      "不手工创建或修补 discovery junction",
      "源文件通过不能证明安装、任务注入或真实 E2E",
      "退役 Skill 不会因历史目录或测试存在而恢复",
      "插件分发单位和 Skill 触发入口不是同一层"
    ],
    failures: [
      { condition: "Source 缺失或映射漂移", response: "供应验证 BLOCK，不从用户目录反向复制成新 source。" },
      { condition: "安装事务中断", response: "通过最新 recovery capsule 先预览，再执行 rollback 或在 desired state 完整满足时 reconcile。" },
      { condition: "当前任务没有回执", response: "显示 unknown，而不是把 install=true 翻译成已启用。" }
    ],
    sources: [
      { path: "E:\\.agents\\config\\personal-skill-supply.json", role: "个人 Skill 名称、source、kind 和 install 意图的唯一 registry" },
      { path: "E:\\.agents\\skills", role: "个人维护 Skills 的 canonical root（唯一维护根目录）" },
      { path: "E:\\.agents\\plugins", role: "插件提供 Skills 的 canonical root（唯一维护根目录）" },
      { path: "E:\\.agents\\docs\\personal-skill-supply-recovery.md", role: "事务安装、回滚、reconcile 和六层证据说明" }
    ],
    verification: [
      "PersonalSkillSupply 验证 registry、source、junction 和事务",
      "PersonalSkillAutonomy 与 SemanticCuration 验证 metadata 是否窄而有用",
      "Current task、fresh task 和 E2E 必须来自对应宿主回执；本快照未取得的显示 unknown"
    ],
    relation: "Skills 供应提供窄能力入口，能力路由决定何时使用；授权合同继续约束它产生的现实 effect。"
  },
  {
    slug: "context-evidence",
    shortTitle: "上下文与证据",
    title: "三控制面上下文、耐久状态与完成证据",
    teaser: "只加载会改变决定的事实，让长任务可从正确责任源恢复，并把设计、源码、测试、安装、运行、发布和用户结果分开证明。",
    status: "三控制面、耐久状态和证据分层合同闭合；当前 E97 身份与 E95 历史完整回归已明确分层",
    statusTone: "mixed",
    searchAliases: ["本地构建通过为什么还不能说完成", "任务压缩后怎样恢复现场", "三控制面什么时候需要", "证据过期应该标什么", "source test install publish怎样分层"],
    value: "避免一次加载过多上下文让模型注意力丢失，也避免用“代码存在”“测试通过”或“部署返回成功”代替用户真正能用。任务即使经过压缩、交接或外部状态变化，也能重新找到目标、边界、当前实现和真实验收位置。",
    why: "长任务会经历压缩、交接和外部状态变化；源码、测试、安装、发布和用户可见结果又分别证明不同事情。若只信摘要或一个 PASS 字段，最容易在错误事实、错误 Owner 或过期证据上继续施工。",
    example: "例如我说“网站本地构建通过了，为什么公网还是打不开，先别说已经完成”。系统会分别读取当前源码和测试、Git/Pages 发布事实与公网打开结果，保留“本地通过”和“公网失败”两个独立结论。",
    result: "任务在压缩或交接后仍能从正确来源恢复；完成报告会明确每一层已证明什么、还缺什么、用户现在能否真正使用，以及哪一项证据过期后需要重新回读。",
    readerStates: { pass: "所需责任源可读且各证据层一致时，形成可重建的当前结论并继续任务。", problem: "摘要、源码、运行态或外部回读冲突时，以现场责任源为准，把冲突层单独标出并只停止受影响判断。", unavailable: "必要责任源不可读时，只把依赖它的结论标成 Unknown（证据不足）或阻断；不恢复退役中央系统，也不从旧摘要猜当前事实。" },
    searchProjection: {
      intents: ["本地构建通过为什么还不能说完成", "对话压缩或任务交接后怎样恢复现场", "跨规则仓库和机器怎样只取必要事实", "证据过期时应该标什么", "怎样区分当前规则与历史测试"],
      entities: ["三控制面", "metadata / checkpoint", "evidence layer / read-back", "source / test / install / publish", "fresh task / E2E / Unknown"],
      relations: ["摘要只作线索而现场 Owner 决定当前事实", "source、test、install、publish、fresh task 与 E2E 互不代替", "历史完整回归不继承到新的release identity", "用户可见验收高于内部PASS字段"],
      failureRecovery: ["摘要与现场冲突时以规则 Owner 和当前源码为准", "证据过期时降为历史或Unknown", "跨控制面schema无效时修复正确Owner而不恢复中央资料库", "只有受影响结论停止而独立工作继续"]
    },
    decisionImpact: ["普通单项目问题不进入全景控制面。", "跨 Owner（责任源）决策先读 metadata（元数据），再展开必要正文。", "证据缺失或过期时降为 Unknown（证据不足），而不是 PASS（通过）。", "设计、Git（版本管理系统）、机器运行和外部 read-back（正式回读）分开验证。", "当前 E97 release identity 与 E95 38/0 历史回归分开表达，不能把历史测试继承给新规则。"],
    problem: "长任务会压缩，多个 owner 会变化，同一结论又可能来自文档、源码、测试、运行时或外部回执。系统必须让重要状态可重建，同时防止把摘要、历史命名或某一层 PASS 当成全部完成。",
    implementation: [
      "现行只有三个控制面：.agents、Git 总索引和 PCConfig；具体项目拥有业务事实。兼容名称不会创造第四个控制面。",
      "跨控制面入口只返回 Owner（责任源）、路径、SHA（内容指纹）、大小和 Token（模型计数单位）估算，不复制私人正文、不运行动态 Provider（现场读取器）、不建立共享数据库。",
      "长任务使目标、边界、授权、关键决定、当前实现和验证状态可从正确 owner 或持久任务状态重建。",
      "证据层包括合同设计、源码、测试、安装、运行、发布、fresh task、E2E 和用户可见结果，互不冒充。",
      "仓库膨胀治理把完成计划和历史复盘留给 Git，活动树只保留当前 source（源码）、contract（合同）、config（配置）和行为回归。"
    ],
    flow: [
      "判断跨控制面事实是否真的会改变当前决定",
      "先读取视图 metadata，再按影响展开 owner 正文",
      "分别调用 Git、机器或业务 provider 取得动态事实",
      "将每个结论标记为活动事实、设计原则或解释示例",
      "按证据层记录 PASS、FAIL、BLOCK、SKIP 或 unknown",
      "压缩或交接后重新读取规则、Owner、工作树和关键证据，而不是只信摘要"
    ],
    concepts: [
      { term: "三控制面", explanation: ".agents 管 Agent，Git 控制面管仓库，PCConfig 管机器；具体项目仍独立拥有业务。" },
      { term: "Durable state", explanation: "让任务在压缩、崩溃或交接后仍能从正确来源恢复目标和当前状态，不保存隐藏推理。" },
      { term: "Evidence layer", explanation: "每层只证明自己的事。代码存在不证明安装，部署成功不证明用户路径可用。" },
      { term: "Unknown", explanation: "没有当前证据时的诚实状态，不是自动 PASS，也不等于永久不可用。" }
    ],
    boundaries: [
      "普通单项目问题不机械进入三控制面全景",
      "兼容 ID 不会恢复已退役的第四基座或中央个人上下文",
      "checkpoint 不保存秘密、隐藏推理和无关私人内容",
      "测试、receipt 和状态字段不能代替用户看得见的产品验收"
    ],
    failures: [
      { condition: "视图 owner 或 primary 缺失", response: "失败关闭跨控制面结论，修复正确 owner 的 catalog 或路径。" },
      { condition: "摘要与现场冲突", response: "现场规则、Owner、Git 状态和当前源码优先；摘要只保留为定位线索。" },
      { condition: "证据过期", response: "降为历史或 unknown，重新执行最小必要 read-back。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.four-base-decision-context.md", role: "三控制面架构和渐进上下文合同" },
      { path: "E:\\.agents\\tools\\Get-FourBaseDecisionContext.ps1", role: "零正文 metadata 视图入口" },
      { path: "E:\\.agents\\config\\repository-bloat-budget.json", role: "活动树大小、历史路径和例外退出条件" }
    ],
    verification: [
      "FourBaseDecisionContext 当前验证两个视图、三个 owner、五规则闭包和无退役基座",
      "RepositoryBloatGovernance 单独验证活动树预算和禁止历史副本",
      "Cross-control coverage（跨控制面覆盖）在项目当前快照中闭合且无 finding；以后新增合同仍必须单独回归",
      `refresh snapshot 没有重跑当前 source 的 full Local 回归；验证矩阵中的完整 38/0 仍只属于 ${localOwnerObservation.releaseId} 历史观察。当前 ${panelSnapshot.authority.releaseId} 由五文件 release identity、source/remote 与正式 pointer 回读证明，二者不能互相替代。`
    ],
    relation: "这个模块把其他模块的结论放进正确证据层，并保证长任务和更新快照时不会靠记忆续写；工作树镜像的文件恢复生命周期由独立模块说明。"
  },
  {
    slug: "working-tree-hot-mirror",
    shortTitle: "工作树热备",
    title: ".agents 工作树 E→G 热镜像与恢复",
    teaser: "PRIVATE Git 保存已经提交的历史；独立热镜像保存 E:\\.agents 当前文件和未提交改动，固定写入 G 盘恢复根，并明确排除 .git、临时附件和 H 冷备。",
    status: "热镜像源码与测试合同存在；G 卷 Healthy/OK 且有历史状态回执，但当前未观察到每日任务，最新工作树覆盖 Unknown",
    statusTone: "mixed",
    searchAliases: ["未提交的agents工作树怎样热备", "G盘agents热镜像", "AgentsHotMirror任务", "热备和Git历史有什么不同", "从G盘恢复agents工作树"],
    value: "尚未提交的 .agents 修改也能有一个独立恢复点，不必等下一次 Git commit；恢复时 Git 补提交历史，G 镜像补当前工作树文件，两层职责不会混在一起。",
    why: "PRIVATE Git 不保存未提交文件。若当前工作树只存在于 E 盘，机器或卷故障会直接丢掉正在施工的内容；若镜像又复制 .git 或写入 H，则会制造第二规则权威、扩大破坏半径并干扰冷备。",
    example: "例如我说“我有一批未提交的规则修改，电脑出问题时怎样从 G 盘恢复”。镜像前先检查 G 卷 Healthy/OK 和全局互斥，只允许 `E:\\.agents → G:\\80_Backup\\ControlPlane\\.agents`；成功后状态回执记录源 HEAD、dirty 数、排除项和 robocopy 结果。恢复时先取 PRIVATE Git，再叠加核对过的 G 工作树文件。",
    result: "正常时得到固定 G 路径下的工作树镜像和 `agents.hot-mirror-status.v1` 回执；冲突或失败时保留 E 源与既有 G 镜像并给出精确原因。当前只能证明合同、G 卷和历史镜像存在，不能声称每日任务已安装或最新工作树已覆盖。",
    readerStates: { pass: "G 卷健康、互斥取得、robocopy 退出码低于 8，且状态回执与源/目标/HEAD/dirty/排除项一致时，本次镜像成立。", problem: "任务缺失、回执陈旧或 robocopy 失败时，只把自动覆盖状态标为 Unknown 或失败，不覆盖既有恢复点。", unavailable: "G 卷不可用或互斥超时时不运行镜像、不切换指针，也不改用 H；E 源和旧 G 镜像原样保留。" },
    searchProjection: {
      intents: ["热备未提交的agents工作树", "从G盘恢复当前规则源码文件", "检查AgentsHotMirror每日任务", "区分Git历史与工作树镜像"],
      entities: ["AgentsHotMirror-Daily", "E:\\.agents → G:\\80_Backup\\ControlPlane\\.agents", "robocopy /MIR", "agents.hot-mirror-status.v1", "source HEAD / dirty count"],
      relations: ["PRIVATE Git保存提交历史而G热镜像保存当前工作树", "热镜像排除.git和临时附件", "G热备不触碰H冷备", "状态回执不证明任务已安装"],
      failureRecovery: ["热备任务缺失或回执陈旧时保持Unknown", "G卷不健康或互斥超时时不覆盖既有镜像", "robocopy退出码>=8时保留失败回执与源文件", "恢复时先取PRIVATE Git历史再叠加G工作树文件"]
    },
    decisionImpact: ["固定 source/destination 之外不允许 /MIR。", "PRIVATE Git 与 G 热镜像互不冒充；H 不在自动链中。", "旧状态回执不能证明当前工作树已覆盖。", "每日任务是可选安装层，源码和测试通过不能证明它当前存在。"],
    problem: "解决未提交工作只有一个故障域、镜像目标漂移、并发镜像互相覆盖、陈旧回执冒充当前覆盖，以及热备越界复制 Git 历史或 H 冷备的问题。",
    implementation: [
      "Sync-AgentsHotMirror.ps1 只接受固定 E:\\.agents 与 G:\\80_Backup\\ControlPlane\\.agents，先验证 G 卷 Healthy/OK，再取得 Global\\CodexAgentsHotMirrorLock，最多等待 30 分钟。",
      "镜像使用有界 robocopy /MIR、/COPY:DAT、/DCOPY:DAT、/XJ、/R:2、/W:3、/MT:8；排除 .git、临时目录、pytest cache 和 Codex Remote 附件，退出码 >=8 才失败。",
      "成功镜像写 agents.hot-mirror-status.v1，记录时间、固定源/目标、模式、robocopy exit、source Git HEAD、dirty entry count 与排除项。",
      "可选 AgentsHotMirror-Daily 为每日20:30、StartWhenAvailable=true、Limited交互用户、wscript无窗口、IgnoreNew、3次/10分钟重试、2小时上限且 WakeToRun=false；明确不写 H。"
    ],
    flow: ["只读检查 G 卷、任务和最后状态回执", "验证固定 E/G 路径并取得全局互斥", "运行受限 robocopy 镜像", "写入并回读 status v1", "恢复时先从 PRIVATE Git 取得提交历史", "核对镜像时间和源 HEAD 后再叠加 G 工作树文件"],
    concepts: [
      { term: "Working-tree hot mirror（工作树热镜像）", explanation: "保存当前文件和未提交状态的固定 E→G 镜像；不是 Git 仓库副本。" },
      { term: "Hot mirror status（热镜像状态回执）", explanation: "记录一次镜像的时间、HEAD、dirty 数、排除项和 robocopy 结果；不是最新覆盖或任务安装证明。" },
      { term: "robocopy /MIR（目录镜像）", explanation: "让目标匹配源的有删除能力复制模式，因此只能对固定 allowlist 路径使用。" }
    ],
    boundaries: ["不复制 .git、临时目录、pytest cache 和附件", "不访问或写入 H 冷备", "不创建第二规则权威", "不从旧回执推断当前已覆盖", "未核对时间和 HEAD 前不把 G 镜像覆盖回 E"],
    failures: [
      { condition: "G 卷不健康、不可用或镜像互斥超时", response: "不运行 robocopy；保留 E 源和既有 G 镜像，报告精确门禁。" },
      { condition: "robocopy 返回 8 或更高", response: "判本次镜像失败，保留源工作树和日志；不用状态文件或旧镜像冒充成功。" },
      { condition: "每日任务未安装或状态回执陈旧", response: "只报告源码合同和历史镜像存在，自动热备状态保持 Unknown。" },
      { condition: "恢复镜像 HEAD/时间与当前源冲突", response: "停止覆盖，先保留两份文件并由 Owner 比较；不使用 /MIR 反向猜测。" }
    ],
    sources: [
      { path: "E:\\.agents\\tools\\Sync-AgentsHotMirror.ps1", role: "固定E→G镜像、卷健康、互斥、robocopy边界与状态回执" },
      { path: "E:\\.agents\\tools\\Install-AgentsHotMirrorTask.ps1", role: "每日20:30、错过补跑、无窗口、Limited和有界重试任务合同" },
      { path: "E:\\.agents\\tests\\Test-AgentsHotMirror.ps1", role: "固定路径、排除项、无H盘、任务设置与回读合同回归" }
    ],
    verification: [
      "Test-AgentsHotMirror.ps1 验证固定E/G路径、/MIR与.git排除、任务网络独立/错过补跑/3次重试/不唤醒/2小时上限、隐藏launcher与不触碰H。",
      "2026-08-31T21:24:42Z 只读现场：G 卷 Healthy/OK，历史 status 存在；未观察到 AgentsHotMirror-Daily 任务。",
      "历史 status 最后镜像时间为 2026-07-30、HEAD=c96dbf1、dirty=21；因此当前安装和最新工作树覆盖保持 Unknown。"
    ],
    relation: "Git 历史由 PRIVATE 仓库负责；本模块只补未提交工作树恢复层。context-evidence 模块负责判断这份回执属于哪一证据层，PCConfig 机器备份和 H 冷备不由本模块替代。"
  }
];

const ruleBindingById = new Map(panelSnapshot.ruleBinding.map((binding) => [binding.logicalId, binding]));

function currentRuleBinding(logicalId) {
  const binding = ruleBindingById.get(logicalId);
  if (!binding) throw new Error(`current E release is missing rule binding: ${logicalId}`);
  return binding;
}

export const rulesSnapshot = {
  ...panelSnapshot.authority,
  observedAt: panelSnapshot.observedAt,
  sourceCommit: panelSnapshot.sourceCommit,
  rules: [
    {
      logicalId: "agents_root_rules",
      title: "全局根规则",
      question: "我现在说的话、项目规则和旧记录冲突时，先听谁的？",
      owner: ".agents",
      sha256: currentRuleBinding("agents_root_rules").sha256,
      bytes: currentRuleBinding("agents_root_rules").bytes,
      characters: currentRuleBinding("agents_root_rules").characters,
      lines: currentRuleBinding("agents_root_rules").lines,
      sourcePath: "E:\\.agents\\AGENTS.md",
      releaseRelativePath: "AGENTS.md",
      purpose: "所有任务的默认总入口。它定义 E 规则权威、指令优先级、事实 Owner、模型自治、english_chinese_gloss、耐久授权总边界、Owner lifecycle、Git 与验证习惯，以及私人领域固定路由。",
      plainLanguage: "先听当前用户要求和离工作位置最近的项目规则；仓库、机器、业务和授权事实分别去真正负责它们的来源确认，旧记录只能帮助定位，不能压过现场。",
      why: "同一任务里常同时出现用户新要求、项目自己的做法、通用习惯和旧笔记。顺序不清时，AI 容易沿用过时计划、改错项目，或用通用习惯覆盖项目真实验收。",
      example: "你不需要手动调用这条规则。只要说“帮我把网站修好，保留别人已有改动，能自动完成的直接做，最后告诉我真实缺口”，它就会先找对项目、Git 和机器事实，再选择方法和验证层。",
      result: "AI 会按明确顺序理解要求、找到正确项目和事实来源，再继续实施；遇到无法同时满足的冲突，只暂停受影响部分并说明原因、保留内容和继续办法。",
      readerStates: { pass: "当前要求、项目做法和事实来源一致时，按项目真实流程继续。", problem: "要求或规则互相冲突时，暂停受影响动作并说明冲突、责任来源和恢复入口。", unavailable: "必要规则或事实来源不可读时，不用旧笔记补猜；只暂停依赖它的部分，其他安全工作继续。" },
      scope: ["所有项目任务和无项目任务", "root（根代理）与 child（子代理）", "具体项目规则之外的跨项目元规则"],
      decisions: [
        "E 代号、PRIVATE main commit、五文件 SHA 和 ruleset 是否构成当前活动规则",
        "system（系统指令）、developer（开发者指令）、本轮用户、最近项目规则、全局规则和记忆之间怎样排序",
        "Agent、Git、机器和业务事实分别回到哪个 Owner",
        "english_chinese_gloss 怎样保留有用英文，并在英文自然词或短语首次出现时紧跟中文括注",
        "PUBLIC 个人数据唯一分级和项目收紧 L1/L2 默认的授权由谁拥有",
        "durable explicit user authorization 为什么跨轮次、压缩、root、后代和新顶层任务有效，何时必须真实调用一次",
        "terminal/archived Owner 怎样 RecoverRelease 或 RecoverReleaseClaim，以及来源任务何时可逆归档",
        "什么工作直接推进，什么动作需要授权或进入受保护合同",
        "怎样保留已有改动、分层验证并收口个人仓库",
        "健康、微信、录音、扫描件、秘密和 Vault 应走哪条窄入口"
      ],
      allowed: ["范围内低风险本机工作直接推进", "E identity 可信时按净收益选择 0–10 个原生代理", "长期明确授权覆盖精确动作且前提成立时真实调用一次", "授权已明确时完成验证、发布和回读", "保留 dirty work 并定向提交"],
      forbidden: ["读取 C 盘历史作为规则权威或准入", "用全局规则覆盖项目业务，或让项目自写 PUBLIC 个人数据限制冒充用户授权", "让项目、Skill 或历史把既有长期授权降为 absent 或要求同轮重述", "把历史报告或记忆当活动权威", "无可信身份时委派", "删掉有用英文来规避中文括注", "用测试或字段冒充产品结果", "恢复已退役中央个人上下文"],
      process: ["Inspect 当前 E release 并核对五文件闭包", "读取最近项目规则", "确定目标与事实 Owner", "按触发读取专项合同", "Owner 冲突时先解析 lifecycle 并收敛 exact scopes", "实施并分层验证", "用人话报告现实结果"],
      failure: ["规则冲突无法同时满足时停止并说清冲突", "委派身份缺失只关闭委派，主任务继续", "授权不清时停止外部 effect，但继续安全调查", "长期授权已覆盖时以真实 tool call 的 unavailable/deny/error 等结果为准", "Git 未收口时分别报告业务和 Git 状态"],
      sections: [
        { title: "优先级与事实 Owner（责任源）", paragraphs: ["活动规则只来自同一 E release：递增 E 代号、PRIVATE main commit、五文件 bytes/SHA 和 ruleset SHA。dirty source 与 C 盘历史都不是活动规则。"], items: [".agents：Agent（智能体）行为、授权、E rules release、能力路由和个人 Skills（能力入口）", "Git 控制面：仓库身份、可见性、分支、同步和发布；它消费授权合同的 PUBLIC 分级结论，不另建等级", "PCConfig：机器路径、运行时、任务、备份和恢复", "AI 工作台唯一运行根与数据库位于 E:\\Data\\AppData\\Codex，C:\\Users\\10979\\.codex 只是兼容 junction；任务 temp 位于 E:\\Cache\\Codex\\Temp\\<task-id>", "具体项目：业务、领域数据、启动和测试；项目收紧 L1/L2 默认须有真实需要与用户精确授权"] },
        { title: "模型自治与复杂度", paragraphs: ["模型按照目标、风险、信息增益、可逆性和净收益选方法；原生委派在 E identity 可信后按任务语义选择 Luna/Terra/Sol 与 0–10。"], items: ["english_chinese_gloss：除常见英文缩写和精确标识外，英文自然词或短语首次出现时保留英文并紧跟简短中文括注", "不得为免括注删除、回避或全中文替代有用英文", "Skill（能力入口）和模板默认是建议，不是硬门", "官方 App 版本和 versioned path 不得成为准入", "只抽象真实重复和 owner（责任方）边界", "长任务保留可重建状态，短任务不制造文档债"] },
        { title: "授权、Git 与验证", paragraphs: ["本机可逆工作直接做；外部 effect（现实动作）需要明确授权。durable grant（耐久授权）不要求同轮重述，但不会覆盖上位 deny、证据、目标或不可逆边界。用户私人账号空间在默认私人且没有 public/share 信号时与本机私密目标等价可信，但信任不产生写授权。"], items: ["长期明确授权在冻结 goal/scope 内跨 root、child、压缩和 successor 持续有效；前提成立须真实调用一次", "实际 unavailable、deny、step_up、needs_evidence、action-time confirmation、error、身份/CAS/target/read-back 失败仍按现场结果处理", "PUBLIC 个人数据唯一 L1–L5 表由授权合同拥有：L1/L2 不受个人数据限制，L3+ 才进入可能敏感审查", "项目收紧 L1/L2 默认必须有真实项目需要和用户对精确项目、范围、限制的明确授权", "普通非长期或已归档且 clean 的 terminal predecessor 无 residual 用 RecoverRelease；有 residual 用 RecoverReleaseClaim；未归档 long_term_task 只接续或正式退役", "只有真实 threadId 可归档", "E release 激活是 UAC expected-preimage CAS，不经过旧 Publisher、人类因子或 CoreGoal", "不覆盖用户已有改动", "force-push（强制推送）不在默认授权内", "source（源码）、test（测试）、install（安装）、publish（发布）、fresh task（全新任务验证）与 E2E（端到端验证）独立", "个人仓库必须由远端默认分支回读"] },
        { title: "私人领域与供应", paragraphs: ["中央个人知识入口已退役；持续需求通过健康、微信、原件、录音、OCR、秘密和 Vault 等小型独立入口处理。"], items: ["Personal Skills 的 source 只在 E:\\.agents\\skills 和 plugins", "用户目录只是 discovery junction", "动态事实由真实 owner 现场提供", "新规则原位升级，不堆补丁"] }
      ],
      relation: `它是 ${panelSnapshot.authority.releaseId} 默认入口；其余四份规则分别拥有 E release/重大动作保护、授权、跨控制面取证和能力选择的完整语义。`
    },
    {
      logicalId: "protected_major_actions_contract",
      title: "重大动作保护",
      question: "改动可能影响公开内容、重要数据或整机状态时，怎样安全继续？",
      owner: ".agents",
      sha256: currentRuleBinding("protected_major_actions_contract").sha256,
      bytes: currentRuleBinding("protected_major_actions_contract").bytes,
      characters: currentRuleBinding("protected_major_actions_contract").characters,
      lines: currentRuleBinding("protected_major_actions_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.protected-major-actions.md",
      releaseRelativePath: "docs\\contracts\\agents.protected-major-actions.md",
      purpose: "唯一拥有 Agent 侧重大动作判断、E 规则 release 和真人因子前生产等价 rehearsal 的合同；动态机器状态仍回到各自 Owner。",
      plainLanguage: "先确认目标、影响范围、是否已经得到允许，以及失败后怎样退回；始终保留当前可用版和上一可用版，真正执行后再从生效位置检查结果。",
      why: "高影响改动若只看命令成功，很容易在失败时没有可用版本，或把草稿、测试和真实生效混为一谈。把变更前状态、回退办法和最终回读放在一起，才能既推进又可恢复。",
      example: "你不需要手动操作规则发布器。只要说“更新这些规则，但必须能回退；如果目标或现状不清就先停”，它会把可编辑草稿、已经提交的源码和真正生效的规则版本分开，并在失败时保留上一版。",
      result: "我会得到一个已核对的当前可用版、一个明确可退回的上一可用版，以及真实生效位置的检查结果；草稿和测试不会被误报为已经生效。",
      readerStates: { pass: "目标、授权、变更前状态、回退办法和生效回读都明确时继续。", problem: "候选内容还在修改或生效结果不一致时，保留当前可用版并停止切换。", unavailable: "当前状态或生效位置无法核对时，只暂停这项高影响动作，保留已有可用版本和普通工作。" },
      scope: ["三个控制面及受管项目", "E rules release、current/previous 与回退", "人类因子前的四路线生产等价 rehearsal", "新公开面、唯一数据、信任根和不可逆迁移等现实重大动作"],
      decisions: ["哪一个 E release 真正活动", "重大动作应 allow、step_up、deny、needs_evidence 还是 suspected_tamper", "何时需要一种人类因子", "E release activation 是否满足五文件和 expected-pointer CAS", "生产等价 rehearsal 是否真实覆盖外层执行与恢复"],
      allowed: ["E current 验证后继续普通工作", "dirty source 存在时继续使用已验证 release", "测试和 PRIVATE main 回读后用 UAC 激活新 E 代", "验证 current↔previous 后回退", "普通本地编辑、测试、定向 commit 和 normal push"],
      forbidden: ["读取 C 盘旧规则作为权威或 fallback", "复用 E 代号或覆盖 E80 bootstrap", "由关键词、路径或 effect 名称机械推导 human required", "用 mock/stub 冒充四类生产等价 rehearsal", "把 UAC 当用户授权或人类因子"],
      process: ["验证 source 测试", "PRIVATE main commit 与 remote readback", "计算五文件描述符和 ruleset SHA", "以 expected pointer SHA 做 CAS", "UAC 原子切 current/previous 并恢复封闭 ACL", "Inspect 与 fresh root/child/spawn read-back"],
      failure: ["dirty source：不激活，current 保持不变", "五文件任一漂移：拒绝新 release", "stale pointer CAS：拒绝覆盖并重读", "激活失败：保留 current/previous", "E identity 缺失：只关闭委派/受保护动作，普通任务继续", "C Authority unavailable：忽略为历史，不形成 blocker"],
      sections: [
        { title: "判断边界", paragraphs: ["最高权限智能体结合真实意图、目标、范围和可恢复性作语义判断；机械层只验证 principal、schema、签名/nonce、目标、事实和 effect 边界。"], items: ["人类因子：Passkey、TOTP、Recovery、Account", "Google 与 Microsoft 只是 Account provider", "取消、超时和失败只暂停", "E release activation 明确不属于人类因子路径"] },
        { title: "E 规则唯一活动权威", paragraphs: ["一个 release 唯一绑定递增 E 代号、PRIVATE main commit、五份规范 bytes/SHA 和 ruleset SHA。E80 是不可变 bootstrap，E81 及后续必须新 commit、新代号。"], items: ["dirty 工作区不是活动规则", "current-rules.json 位于受保护 releases 父目录", "current/previous 原子切换", "普通/管理员编辑器直接改写或删除必须失败"] },
        { title: "C 盘退役与产品隔离", paragraphs: ["历史 C 盘 generation、Publisher、签名、anchor、manifest、ledger 和回执只读保留，但不参与任何准入、fallback 或运行。"], items: ["不创建新 C generation", "不调用旧 Publisher", "不读取 policy epoch", "C unavailable 不阻塞 Hook、spawn、Skill、project admission、CoreGoal 或 Owner CAS"] },
        { title: "激活与回读", paragraphs: ["唯一 activator 固定执行测试、PRIVATE main 回读、五文件哈希、UAC expected-pointer CAS、current/previous 切换和 ACL/read-back。"], items: ["不创建服务/队列/数据库/计划任务", "失败保留现有 current/previous", "回退只交换已验证 reference", "source/test/install/fresh/spawn 分层证明"] }
      ],
      relation: "它拥有 E release 与重大动作保护；用户授权、CoreGoal、Execution Owner 和 Git 收口由授权合同负责，能力与委派家族由能力合同负责。"
    },
    {
      logicalId: "authorization_delegation_contract",
      title: "授权与委派",
      question: "用户已经同意的同一件事，还要每一步都再问吗？",
      owner: ".agents",
      sha256: currentRuleBinding("authorization_delegation_contract").sha256,
      bytes: currentRuleBinding("authorization_delegation_contract").bytes,
      characters: currentRuleBinding("authorization_delegation_contract").characters,
      lines: currentRuleBinding("authorization_delegation_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.authorization-delegation.md",
      releaseRelativePath: "docs\\contracts\\agents.authorization-delegation.md",
      purpose: "唯一拥有 durable explicit user authorization、CoreGoal、委派收窄、Execution Owner、lifecycle 收敛、来源任务归档、跨项目 coordination_id、可信目标、PUBLIC 个人数据分级、项目公开限制授权、PUBLIC 项目 ignored 私有材料迁移、E rules 精确 scope release 与 Git 收口的合同。",
      plainLanguage: "不用。同一个已经明确允许的目标可以连续完成调查、修改、验证和回读；只有目标、对象、账号、公开范围、付费、秘密或不可逆影响发生变化时，才暂停并重新确认。",
      why: "用户同意完成一个目标，不代表任意代理都能扩大到其他仓库；反过来，用户已经明确给出长期授权，也不能被新对话、压缩、项目模板或通用工具说明降成‘还没同意’。多个任务同时修改同一范围，还会覆盖彼此工作或丢失未完成事项。",
      example: "你不需要记住授权字段或 Owner 命令。比如说“这个网站通过检查后直接发布到现有公网，别反复问同一件事，但不要覆盖别人的改动”，系统会复用这项明确授权、协调施工范围，并在真实目标或工具拒绝时只停止对应动作。",
      result: "同一目标会连续推进到真实结果，不反复索要已经给过的同意；每一步仍能说明谁在改什么、外部结果是否真的发生，以及失败后从哪里继续。",
      readerStates: { pass: "允许的目标、对象和修改范围都清楚时，连续完成实施、验证、正常推送和结果回读。", problem: "目标扩大、对象变化或多人修改范围冲突时，先停止对应写入并协调或取得新确认。", unavailable: "无法确认是否允许或谁正在修改时，停止外部写入；不会用更高系统权限或另一个代理猜测授权。" },
      scope: ["本机工作与 external effect（外部现实动作）", "root（根代理）和 child（子代理）委派", "长期无人值守目标", "多任务施工与 Git 收口", "PRIVATE（私有）、PUBLIC（公开）和未知目标"],
      decisions: ["当前请求或既有 durable grant 是否已授权现实 effect", "前提满足后是否已经真实调用一次 adapter/tool", "是否需要 UAC 但不扩大授权", "实际 deny/step_up/needs_evidence/action-time confirmation 是否要求停止", "目标是否仍是已登记目标", "谁拥有最小施工 scope", "旧 Owner 是否由固定 resolver 证明 active/terminal/archived，scope 应 RecoverRelease 还是 RecoverReleaseClaim", "来源创建的 task 是否已有真实 threadId 且满足无 follow-up/queue/pending/residual 的归档条件", "显式跨项目目标是否使用同一 coordination_id 且逐项目隔离", "私人账号空间是否满足用户账号、默认私人且无 public/share 信号的等价可信条件", "PUBLIC 最终载荷属于 L1–L5 哪一级，是否有升级到 L3+ 的正面证据", "项目收紧 L1/L2 默认是否同时具备真实需要与用户对精确项目、范围、限制的明确授权", "PUBLIC 项目被 Git 明确忽略的有价值私有材料是否需要迁入已登记 PRIVATE companion", "E rules release 的变化对应哪些精确 logical-id scope", "Git、发布和 external effect 是否真正收口"],
      allowed: ["低风险本地工作直接做", "冻结 goal/scope 内的长期明确授权跨 root、全部 child/后代、新顶层 task 与压缩持续有效", "前提成立后真实调用一次并按实际 unavailable/failed/dispatch-unconfirmed 分类", "同一 active goal 内重派生步骤", "普通非长期或已归档且 clean 的 terminal exact scope 无 residual 时 RecoverRelease；有 residual 时 RecoverReleaseClaim 给真实 successor；未归档 long_term_task 只接续或正式退役", "complete goal 是关闭状态，不再计入 open residual；来源归档仍须分别确认 follow-up、queue、pending transaction 和 Owner residual 都已收口", "真实 threadId 的来源 task 在完全收口后可逆归档", "现有 upstream 定向 commit 和 normal push", "用户私人账号空间满足无公开信号条件时与本机私密目标等价可信", "可信私有目标内按任务需要保真", "PUBLIC 载荷没有 L3+ 正面证据时按 L2 处理，不因个人来源删改", "PUBLIC 项目私有伴随材料在 PRIVATE 远端回读后以 ignored 本地链接继续提供原路径"],
      forbidden: ["child（子代理）、shell（命令行）、worktree（工作树）或 UAC（管理员确认）扩权", "项目、AI、Skill、模板、历史或 Owner 自称产生新授权，或把既有长期授权降为 absent/要求同轮重述", "用 generic tool description、缓存失败或 AI 预判跳过已授权动作的真实一次调用", "绕过重叠 Owner（施工责任）", "用 archive 标记、timeout（超时）、标题或自制 evidence（证据）证明 terminal/恢复 Owner", "把 clientThreadId 当真实 threadId 归档", "有 follow-up、queue、pending transaction 或 Owner residual 时归档", "无明确门禁 force-push（强制推送）或新公开", "把 trusted（可信目标）当已授权", "用 unknown、来自个人、可识别或谨慎起见把 L1/L2 升级", "让项目、AI、Skill、模板、历史文档或 Owner 自称产生 L1/L2 收紧授权"],
      process: ["解析 effect（外部现实动作）", "解析 registered target（已登记目标）", "确认当前请求、durable grant 或 CoreGoal（长期目标授权）", "前提成立就真实调用一次精确 adapter/tool", "Inspect Owner 并用固定 resolver 处理冲突", "Claim、RecoverRelease 或 RecoverReleaseClaim 最小 scope（施工范围）", "执行边界重验目标", "PUBLIC ignored 私有材料按 copy/hash、PRIVATE commit/read-back、rollback rename、本地 link/status 回读迁移", "执行并 read-back（正式回读）", "Git/Pages 收口", "Release（释放）/Transfer（移交），满足完整条件后由来源归档真实 threadId"],
      failure: ["步骤漂移：废弃并重派生", "目标扩大：建立 successor 并重新确认", "真实调用返回 unavailable/deny/step_up/needs_evidence/action-time confirmation/error：按本次结果停止", "task 创建无 trackable id：dispatch-unconfirmed，不盲重试", "Owner 冲突：先解析 lifecycle；仍 active 才一次有界协调", "归档 predecessor 有 open goal 或 turn_aborted：带 checkpoint/residual RecoverReleaseClaim", "PRIVATE companion 远端回读前任一步失败：恢复 PUBLIC worktree 原件", "E release scope 与五文件 descriptor 不符：拒绝激活", "Git 非 fast-forward：停止并解决同步", "Residual 未移交：保持 lease"],
      sections: [
        { title: "授权与提权", paragraphs: ["本机可逆工作直接推进；external effect（外部现实动作）要有明确授权。durable explicit user authorization 是用户已经明确、持续同意的窄授权，不是 AI 推断；Windows Medium integrity（中等完整性权限）不表示管理员能力不存在，UAC（Windows 管理员确认）只解决操作系统进程权限。"], items: ["当前请求明确对象、内容和动作即可授权", "长期明确授权在冻结 goal/scope 内跨轮次、压缩、root、全部后代和新顶层 task 生效，不要求同轮重述", "前提满足必须真实调用一次，actual unavailable/deny/step_up/needs_evidence/action-time confirmation/error 与身份/CAS/target/read-back 失败仍有效", "用户撤销或目标、scope、账号、公开面、付费、秘密、不可逆边界变化才需新授权", "实际 publish/deploy 边界重新解析 registered target", "委派边界只能收窄", "项目规则继续拥有业务语义、安全和项目验收，但不能降级既有长期授权", "PUBLIC 个人数据唯一分级与 project_publication_restriction_authority 由本合同拥有；项目自写限制不产生用户授权"] },
        { title: "CoreGoal 与步骤能力", paragraphs: ["CoreGoal 固定目标、范围、禁止项和停止条件，不冻结计划、代码或 executor。每个 effect 使用短时、单次、防重放的步骤能力。"], items: ["实现漂移不要求重新人类确认", "目标扩大才建立 successor", "步骤能力绑定 pre/post 和回滚", "四类人类因子全部丢失时不能自举"] },
        { title: "Execution Owner 与 lifecycle", paragraphs: ["Owner 只协调施工，不产生授权和事实。Owner 冲突先由固定 Codex lifecycle resolver 证明 active 或 terminal；归档标记、标题、timeout 和无回执都不够。"], items: ["纯只读审计不 Claim", "禁止 whole_project 与授权串用", "child 不继承 coordination", "普通非长期，或已归档且 clean 的 terminal predecessor 无 residual 时逐一 RecoverRelease", "open goal、turn_aborted 或其他 residual 必须随 checkpoint RecoverReleaseClaim 给真实 successor", "未归档且正式登记 long_term_task 的 Owner 不自动释放，即使 resolver 显示 terminal", "terminal long-term 只能由带 checkpoint/residual 的明确 successor 接续或正式 retirement", "归档任务仍无长期保留例外"] },
        { title: "来源 task 可逆归档", paragraphs: ["来源只管理自己创建或正式登记的新顶层 task；native child 不属于 App task。archive 是可逆状态，不是删除。"], items: ["clientThreadId 只证明创建已受理，不能传给归档工具", "只有解析到真实 threadId 才能归档", "来源明确停止时先停止 effect、保留 checkpoint/residual 并 Release/Transfer Owner", "正式 terminal/completed 且无 follow-up、queued work、pending transaction 或未交接 Owner residual 时才自动归档", "active、unknown、needs_attention 或等待用户时不得归档"] },
        { title: "E release 与 Git 收口", paragraphs: ["E rules release 从同一 commit 的五个 descriptor 推导精确 scope；Git 实施默认含定向提交和正常推送，个人仓库结果必须从真实默认分支可达并由远端回读。"], items: ["E activation 不消费 CoreGoal 或旧 Publisher 权限", "force-push 不在默认授权", "PUBLIC 暴露检查失败时停止", "PUBLIC 项目只迁移 Git 明确 ignored、未跟踪且尚无 PRIVATE 远端覆盖的有价值材料", "PRIVATE 远端 hash 回读成功前不替换原件；本地 link 仍须证明继续 ignored", "不完整副本不能称完整备份"] },
        { title: "可信目标与 PUBLIC 个人数据唯一分级", paragraphs: ["本机、workspace、BitLocker 盘与满足用户账号、默认私人、无 public/share 信号的私人账号空间同属 default_trusted_target（默认可信目标）；可信、可见性和写授权仍相互独立。PUBLIC 最终载荷按 effective_level=max(字段等级, 组合后的现实损害等级) 判断，缺少达到 L3+ 的正面证据时默认 L2。"], items: ["L1：非个人、虚构、匿名，或重复公开不会增加现实损害的普通已公开事实；不受个人数据限制", "L2：用户本人的姓名、完整生日、普通照片、城市、履历、兴趣、普通公开账号或指定公开联系方式；姓名+生日+普通履历仍默认 L2，不能仅因个人数据而审查、脱敏、删改或额外确认", "L3：有正面证据可能造成诈骗、信用/名誉/关系损害、持续骚扰或非实时精准追踪；私人联系方式、精确住址、详细财务、非公开纠纷、可预测行踪与第三人未公开数据进入可能敏感审查，但不自动阻断", "L4：可能造成严重人身、财产、身份或重大隐私损害；证件、账户、生物识别、实时位置、完整健康/亲密信息、原始私人聊天和可用秘密属于此级，可用秘密明文不得公开", "L5：大规模多人数据、机构关键/核心数据或影响国家安全、公共利益和系统性运行的重要数据；普通个人单条自身数据通常不适用", "L1/L2 以及没有 L3+ 正面证据的其他内容在个人数据敏感性轴上不受限制；只有 L3+ 才进入审查", "项目想收紧 L1/L2 默认，必须同时有真实项目需要，以及用户对精确项目、范围和限制内容的明确授权", "真实 secret、第三人授权、许可、目标解析、external effect 授权及 system/developer/platform 边界与等级正交"] }
      ],
      relation: "它拥有现实 effect 的授权、施工责任、E release 精确 scope 和 Git/Pages 收口；能力合同决定怎么做，保护合同决定 E release 与重大动作保护。"
    },
    {
      logicalId: "four_base_decision_context_contract",
      title: "三控制面决策上下文",
      question: "一个问题同时涉及规则、仓库、电脑和项目时，分别去哪里确认？",
      owner: ".agents",
      sha256: currentRuleBinding("four_base_decision_context_contract").sha256,
      bytes: currentRuleBinding("four_base_decision_context_contract").bytes,
      characters: currentRuleBinding("four_base_decision_context_contract").characters,
      lines: currentRuleBinding("four_base_decision_context_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.four-base-decision-context.md",
      releaseRelativePath: "docs\\contracts\\agents.four-base-decision-context.md",
      purpose: "跨控制面架构、运行治理和长期演化的 metadata 入口。兼容 logical id 保留旧名称，但现行只有三个控制面；Git 只提供 PUBLIC 目标事实并消费 .agents 的分级/授权结论。",
      plainLanguage: "规则听规则来源，仓库和发布听 Git 事实，电脑路径、任务和恢复听 PCConfig，业务结果听具体项目；只读取会改变当前决定的那部分。",
      why: "Agent 规则、Git 仓库和本机配置分别由不同项目维护。把所有事实塞进一个总库会过期，也会让一个项目越权解释另一个项目。",
      example: "你不需要先选择控制面。直接问“为什么这项本机服务代码已经发布，但电脑上仍然用不了”，系统会分别去仓库、机器配置和规则来源取证，再把矛盾落到真正负责的一方。",
      result: "任务会得到一份足够当前判断的最小事实组合，每条结论都能回到负责它的来源；某一处不可读，只影响依赖它的结论。",
      readerStates: { pass: "所需来源都可读时，组合最小必要事实并继续。", problem: "不同来源给出矛盾事实时，分别保留并交给真正负责的一方复核，不强行合成一个答案。", unavailable: "某个必要来源不可读或数据结构无效时，只停止依赖它的跨项目结论，不用旧中央资料补猜。" },
      scope: ["跨控制面架构评审", "运行治理", "全局演化", "Owner 关系和合同覆盖"],
      decisions: ["当前需要哪个控制面的事实", "是否只需 metadata 还是要展开正文", "Git 是否只提供 visibility 与候选内容事实，而没有越权建立或收紧 PUBLIC 个人数据等级", "设计、Git、机器和 external receipt 应怎样分开验证", "是否真的出现需要新基座的稳定需求"],
      allowed: ["零写获取 metadata", "从 E current release 读取规则路径与 SHA", "按影响展开 owner 正文", "必要时联动三个 Owner"],
      forbidden: ["把兼容名称理解成第四控制面", "让 Git 控制面另建或收紧 PUBLIC 个人数据等级", "读取 C 盘旧 authority/generation/Publisher/epoch", "恢复已退役中央上下文", "复制私人正文和巨大快照", "用 dirty source 冒充 E current", "用合同设计证明 runtime"],
      process: ["确认跨 Owner（责任源）事实会改变决定", "列出视图和 owner（责任方）", "选择 operations governance（运行治理）或 global evolution（全局演化）", "读取 primary metadata（主要元数据）", "按影响展开 conditional（条件内容）", "独立验证各层"],
      failure: ["schema 无效：BLOCK", "E release 五规则闭包不完整：BLOCK", "required owner 缺失：BLOCK", "primary 不可读：BLOCK", "修正确 Owner，不回退 C 盘或历史中央系统"],
      sections: [
        { title: "现行边界", paragraphs: ["现行控制面只有 .agents、Git 总索引和 PCConfig；具体项目继续拥有业务语义。文件名里的 four-base 只是兼容标识。"], items: [".agents：Agent 行为、授权、能力路由及 PUBLIC 个人数据唯一分级", "Git：仓库身份、可见性、分支、同步、发布；只向 .agents 提供事实并消费分级/授权结论，不另建等级", "PCConfig：机器路径、运行时、任务、备份、恢复", "具体项目：业务和产品结果"] },
        { title: "入口与证据", paragraphs: ["入口只返回 Owner（责任源）、E release path、content SHA、大小和 Token（模型计数单位）估算；不复制无关正文、不运行动态 Provider（现场读取器）、不建共享数据库。"], items: ["先 metadata（元数据）后正文", "活动规则从同一 E release 解析", "dirty source 不是 current", "设计、Git（版本管理系统）、机器和 Adapter receipt（适配器回执）分开验证", "普通单项目任务不机械进入全景"] },
        { title: "退役边界", paragraphs: ["历史中央系统及其冻结文档不是控制面、默认个人上下文或运行产品。备份对象存在也不会恢复它。"], items: ["不调用旧 context、beacon 或 probe", "不读取历史私人数据库和媒体", "历史命名不是新基座理由", "新基座必须有独立稳定 owner、生命周期和恢复边界"] }
      ],
      relation: "它只选择跨 Owner 证据，不提供业务答案、不授权 effect，也不证明发布完成。"
    },
    {
      logicalId: "capability_routing_contract",
      title: "能力路由",
      question: "用户只说目标时，AI 怎样自己选工具、能力和并行方式？",
      owner: ".agents",
      sha256: currentRuleBinding("capability_routing_contract").sha256,
      bytes: currentRuleBinding("capability_routing_contract").bytes,
      characters: currentRuleBinding("capability_routing_contract").characters,
      lines: currentRuleBinding("capability_routing_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.capability-routing.md",
      releaseRelativePath: "docs\\contracts\\agents.capability-routing.md",
      purpose: "唯一拥有方法选择、english_chinese_gloss、上下文路由、复杂度治理、动态配置准入、reader routing、原生经济委派和按需插件语义的合同。",
      plainLanguage: "用户不用背工具名。AI 根据目标、风险、速度、写入冲突和验收方式选择合适能力；互不影响的工作可以并行，能力不可用时说明缺口并换成仍然可靠的做法。",
      why: "不同任务需要的工具和并行程度不同。机械套同一流程会用错能力、重复安装工具，或开出很多代理却没有人负责最终结果。",
      example: "你不需要指定 Skill、工具或子代理。只要说“把聊天附件、录音、扫描件和合同原件核对后整理成可编辑文书和逐页验收 PDF；不能确认的事实单列”，系统会自己选择原件、转写、识别、文书和 PDF 验收能力，并把未知保留到成品。",
      result: "任务会使用真正有帮助的工具、资料和并行数量，最后由当前任务统一合并和验收；用户拿到的是可用结果、依据和仍然存在的缺口。",
      readerStates: { pass: "能力可用、范围清楚且能独立验收时，选择合适工具或并行协作并继续。", problem: "出现写入冲突、资源争用、无法独立验收或并行收益不足时，减少并发或改为串行。", unavailable: "目标能力不可用时，只停止这条路线，继续其他安全工作并说明缺少什么、怎样继续。" },
      scope: ["所有能力选择", "长任务状态重建", "README 与项目规则路由", "动态配置设计", "原生委派和插件缺口"],
      decisions: ["当前任务值不值得使用某项能力", "英文自然词或短语是否需要按 english_chinese_gloss 在首次出现后紧跟中文括注", "PUBLIC 内容判断是否需要按需读取授权合同的唯一分级表", "项目规则是否在定义客观 precondition，还是错误地降级既有长期授权", "应读多少上下文", "是否安装运行时或建议插件", "可信 model/effort/role/E release identity 是否成立", "应并行 0–10 个代理以及选择 Luna/Terra/Sol 哪个家族", "当前验收是否会被实现知识污染，需不需要 implementation-blind fresh E2E", "自然请求是否在没有路线提示时自主选对能力并交付正确可见结果", "Codex 官方更新是否仍是稳定主体且现场 event/capability 可用", "顶层 task 的真实创建调用返回 success、unavailable、failed 还是 dispatch-unconfirmed", "怎样保持代码和仓库不过度膨胀"],
      allowed: ["按净收益选择方法", "需要时安装官方稳定运行时", "verified 身份下委派", "需要时用最小自然意图和正常产品环境执行 implementation-blind fresh E2E", "durable explicit user authorization 在 root/全部 child/后代和新顶层 task 中持续满足精确用户允许门", "前提成立时真实调用一次 create_thread 并按 trackable id 分类", "真实能力缺口时提醒精确插件", "复杂任务建立可重建 checkpoint"],
      forbidden: ["把 Skill 指令升级成硬门", "项目规则或模板把既有长期授权降为 absent 或要求同轮重述", "用通用工具说明或历史失败预判 create_thread 不可用", "为规避中文括注而删除、回避或全中文替代有用英文", "在非 PUBLIC 决策中无差别加载个人数据分级表", "已有入口仍提示插件", "在 blind routing 提示中点名 Skill、tool、plugin、provider、内部路径或预期路线", "把 directed_execution_test 冒充 route_selected_without_hint", "用 app version、build 或 versioned path 作为官方更新准入", "无身份 spawn", "固定默认 child 模型", "派出高于父级 effort 或超过 Ultra 绝对上限的后代", "用顶层 task 绕过 native 拒绝", "因 C Authority unavailable 关闭 E rules 委派", "为假想未来建动态配置平台", "把 README 当默认 AI 上下文"],
      process: ["理解自然语言目标和用户可见验收", "查 Owner、原生入口和当前能力 metadata", "确认 durable user authorization 与其他上位门的交集", "root 经 UserPromptSubmit、child 经 SubagentStart 在判断前取得 model/effort/role 与 E identity", "完整读取同 E release 的原生经济路由节", "AI 按任务语义、净收益、冲突和 slots 决定 0–10、家族与 scope，root 继续不冲突工作", "每次真实 spawn 前由 PreToolUse 复核 TOCTOU、家族/effort 上限、参数和 fork", "只有真实独立 Owner 边界且当前任务不能 Claim 时，才调用一次顶层 task 创建工具", "缺能力再装 runtime 或建议插件；官方更新按稳定 package family、signer/principal 与当前 event/capability 发现保持连续并局部降级", "实现知识可能污染验收时，用不泄露路线的 fresh evaluator 同时验证 route_selected_without_hint 和用户可见结果", "root 与 child 分层验证并由 root 最终集成"],
      failure: ["无可信身份：只关闭委派", "E identity 变化或压缩：重读 11 条强门禁", "PreToolUse 发现身份、上限或参数漂移：取消本次 spawn 并重判", "blind routing 提示泄露内部路线：降为 directed_execution_test，用新的纯自然意图重测", "官方更新后精确 event/capability 缺失：只关闭对应能力，普通项目继续", "create_thread 实际缺失或 deny：unavailable；工具 error：failed；无 trackable id：dispatch-unconfirmed，均不盲重试", "Provider（服务入口）缺失：报告受限，不造第二 Provider", "child（子代理）中断：优先恢复原 session（会话）", "C Authority unavailable：不影响此路径", "catalog schema（目录数据结构）无效：失败关闭"],
      sections: [
        { title: "方法与能力自治", paragraphs: ["目标、信息增益、延迟、耦合和可逆性决定方法。Skill、Plugin、模板和计划只是候选能力，不会扩大授权。"], items: ["english_chinese_gloss 保留有用英文；除 AI/LLM/API/URL/JSON 等常见缩写和精确标识外，英文自然词或短语首次出现后紧跟简短中文括注", "不得为免括注删除、回避或全中文替代有用英文", "先找 owner adapter、CLI/API 和 metadata", "实证缺失才降级", "任务必需 runtime 可从官方路径安装", "既有项目服从 lock、版本和 CI"] },
        { title: "耐久状态与代码", paragraphs: ["长任务必须可重建；代码优先内聚、单一事实源、显式接口和确定行为，不为假想未来建框架。"], items: ["Consumer 只依赖最小接口", "配置按真实需求逐级准入", "秘密只用 SecretRef", "完成计划和旧复盘由 Git 留史"] },
        { title: "Reader routing（读者路由）", paragraphs: ["人类 README（说明文档）要保持人话和最新，但不是动态权威；项目规则只承载该项目真正更具体的语义。"], items: ["用户明确询问或验收需要时才读操作指南", "只有目标明确 PUBLIC 或正在决定公开内容时，才读取授权合同的 PUBLIC 个人数据唯一分级表", "Git 与项目提供 visibility、候选内容和业务事实，不复制或改写等级", "项目收紧 L1/L2 默认须满足授权合同的项目需要与用户精确授权", "项目可定义客观 precondition，但不能制造授权、降级既有 durable grant 或要求同轮重述", "过期文档是待修缺陷", "嵌套规则只在子树语义不同才存在", "现场代码、测试和 Provider（事实入口）决定实现事实"] },
        { title: "原生经济委派与顶层任务", paragraphs: ["现行 11 条规则先绑定 model、effective effort、root/child role 与 E release/commit/ruleset/合同 SHA，再做 0 到 10 决策；durable grant 对全部后代持续满足用户允许，但身份、slot 与真实工具结果仍现场证明。"], items: ["gpt-5.6-luna：封闭可验、读重和确定性工作", "gpt-5.6-terra：强耦合实现、深调试和架构审查", "gpt-5.6-sol：最高难度、风险、战略与终审", "宿主返回的其他 verified 模型归更强的未来模型家族，不维护型号白名单", "Sol 与未来模型可在父级上限内使用 High/XHigh/Max/Ultra；Luna/Terra 保持 Max", "家族与 effort 只能向下收窄，Root 持续负责目标、风险和最终集成", "顶层 Owner task 只在 live scope 无 Owner 且当前任务不能 Claim 时评估；projectless 是默认", "create_thread 只真实调用一次；threadId/clientThreadId 表示受理，clientThreadId 仍不能用于归档"] },
        { title: "按需插件", paragraphs: ["Skill 注入、安装、账号连接、fresh task 和 E2E 是独立事实。只有能力缺口真实影响结果时才读取插件 catalog。"], items: ["已有等价入口不提示插件", "用户同意后才安装或连接", "未知 trigger 返回 not found", "catalog schema 无效失败关闭"] }
      ],
      relation: "它选择方法、上下文和 native 代理家族/数量，但不会产生授权、Owner 或 E release；这些分别由授权和保护合同拥有。"
    }
  ]
};
