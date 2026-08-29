import { generatedPanelFacts } from "./panel-facts.generated.js";
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
  { label: "项目", href: "/" },
  { label: "规则", href: "/rules" },
  { label: "Skills", href: "/skills" }
];

if (
  generatedPanelFacts?.schema !== "wly.panel-facts.v1"
  || generatedPanelFacts?.generatedBy !== "scripts/refresh-panel-snapshot.mjs"
  || !generatedPanelFacts?.authority?.generationId
  || !Array.isArray(generatedPanelFacts?.ruleBinding)
  || generatedPanelFacts.ruleBinding.some((binding) => !/^[a-f0-9]{64}$/.test(binding?.candidateSha256 || "") || !Number.isInteger(binding?.candidateBytes) || typeof binding?.candidateMatchesActive !== "boolean")
  || !Array.isArray(generatedPanelFacts?.validation?.rows)
  || !Array.isArray(generatedPanelFacts?.validation?.failures)
  || !Number.isInteger(generatedPanelFacts?.skills?.activeInstallIntent)
  || !generatedPanelFacts?.integrity?.payloadSha256
) {
  throw new Error("panel facts are missing or invalid; run npm run refresh:snapshot before build");
}

export const panelSnapshot = generatedPanelFacts;

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
  summary: "管理个人 AI 工作的共同规则、授权边界、能力路由和完成证据。它不接管具体项目的业务，而是保证不同任务知道该去哪里取事实、可以做到哪一步、怎样证明真的完成。",
  responsibilities: [
    "定义跨项目适用的 Agent 行为与指令优先级",
    "管理用户授权、委派收窄和执行 Owner",
    "选择工具、Skills、插件与原生代理的使用边界",
    "维护重大动作的活动规则、发布链和恢复语义",
    "维护个人 Skills 的 canonical source、安装清单与验证分层"
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
    { term: "AuthorityHost（活动规则权威服务）", meaning: "固定验证并返回当前活动规则代际、签名、锚点、ledger 和生产适配器状态的本机权威入口。" },
    { term: "Candidate（候选规则）", meaning: "E 盘可编辑的规则源码。它尚未生效，也不会因为与活动代际不同就自动变成安全事故。" },
    { term: "Active generation（活动代际）", meaning: "C 盘中不可变、已签名并正式回读的现行五规则集合。" },
    { term: "Projection（规则投影）", meaning: "某个活动代际中供 Agent 按 logical id 读取的规范规则文件树。" },
    { term: "Manifest（清单）", meaning: "声明集合、路径、hash 或安装意图的结构化文件；清单本身不证明动作已经发生。" },
    { term: "Attestation（证明声明）", meaning: "把 generation、内容指纹和发布身份绑定起来的受保护证明材料。" },
    { term: "Policy epoch（策略代际号）", meaning: "活动规则的单调编号，当前是 79，用于防止回滚和混代。" },
    { term: "Anchor（活动锚点）", meaning: "保存在受保护机器位置的当前 generation 承诺。" },
    { term: "Ledger（追加式账本）", meaning: "记录发布、签发、消费和终止的不可倒写链，用来证明步骤没有被重放。" },
    { term: "Adapter（执行适配器）", meaning: "负责一种受保护现实动作的正式执行入口，例如规则发布、Git 重大动作或 PCConfig 重大动作。" },
    { term: "CoreGoalCommitment（目标承诺）", meaning: "一次可靠人类确认冻结的长期目标、范围、禁止项和停止条件，不冻结具体实现。" },
    { term: "StepCapability（单步能力）", meaning: "只允许一次精确现实动作的短时、防重放能力，绑定目标、参数、executor、pre/post 和回滚。" },
    { term: "Execution Owner（施工责任）", meaning: "协调哪个任务正在改哪个最小 scope；它不产生用户授权、管理员权限或业务事实。" },
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
    { term: "Fresh task（全新任务验证）", meaning: "安装完成后启动的另一个任务真实发现该能力。" },
    { term: "E2E（端到端验证）", meaning: "用真实输入走完整路径并得到用户可见结果。" },
    { term: "Unknown（未验证）", meaning: "当前没有足够证据。它既不是 PASS，也不表示永久不可用。" }
  ],
  operatingFlow: [
    { title: "确定真实目标", detail: "先读当前请求和最近的项目规则，明确用户到底要什么、哪些边界不能越过。" },
    { title: "找到事实 Owner", detail: "业务回到具体项目；Git、机器事实和 Agent 规则分别回到自己的控制面，避免用旧报告或猜测替代现场事实。" },
    { title: "选择能力", detail: "根据风险、信息价值、延迟、耦合和可逆性，决定直接处理、读取 Skill、调用工具或并行委派。" },
    { title: "绑定授权与施工责任", detail: "外部动作确认授权；写入前由最小 execution scope 认领 Owner，并发只串行真正冲突的临界区。" },
    { title: "执行并分层验证", detail: "源码、测试、安装、发布、全新任务可用性和用户可见结果分别取证，任何一层都不能代替另一层。" },
    { title: "用人话收口", detail: "先说明现实结果、使用方式、边界和是否需要用户动作，再保留会改变判断的技术证据。" }
  ],
  components: [
    { name: "全局根规则", responsibility: "跨项目优先级、事实 Owner、默认授权边界、Git 与验证总原则。", implementation: "AGENTS.md 经受保护发布进入活动 generation；普通任务默认完整读取这一份。" },
    { name: "合同 Catalog", responsibility: "根据触发 metadata 找到正确合同、Owner、Provider、schema 和 validator。", implementation: "Catalog 只做路由，不加载正文、不运行 Provider，也不决定是否授权。" },
    { name: "三控制面上下文", responsibility: "跨 .agents、Git 和 PCConfig 时提供最小 metadata 视图。", implementation: "两个零正文视图，先返回路径、SHA、大小和 Owner，再按影响展开。" },
    { name: "AuthorityHost", responsibility: "证明哪一代规则当前生效，并验证签名、anchor、ledger、shim 和 adapter。", implementation: "固定 C 盘入口；E 盘源码永远只是 candidate。" },
    { name: "保护策略 Publisher", responsibility: "把五份 candidate 规则发布成不可变活动 generation。", implementation: "全局互斥、单次步骤能力、staging 后再验、事务写入和正式 read-back。" },
    { name: "CoreGoal 授权", responsibility: "把一次人类确认固定为长期目标，同时允许实现、修复和恢复继续推进。", implementation: "CoreGoalCommitment 加每个现实 effect 的短时单次 StepCapability。" },
    { name: "Execution Owner Registry", responsibility: "协调多个任务对项目最小 scope 的 Claim、Add、Transfer、Release 和恢复。", implementation: "Expected revision CAS 加 append-only transition journal。" },
    { name: "原生代理路由门", responsibility: "验证 model、effort、root/child 身份、generation 和合同 SHA 后才允许 spawn。", implementation: "宿主事件注入身份，spawn 前再做 TOCTOU 复核；它不替模型选择代理。" },
    { name: "Personal Skill 供应链", responsibility: "维护 Skill canonical source、安装意图、发现 junction、事务回滚和六层证据。", implementation: "一个 registry、两个 canonical roots、事务 installer 和恢复 capsule。" },
    { name: "Control Plane Doctor", responsibility: "按用户点名的 Owner 做只读健康、漂移、迁移和恢复检查。", implementation: "只调用被选中的 Provider；需要修复时退出 Doctor 并交给真实 Owner。" },
    { name: "测试与复杂度预算", responsibility: "统一登记本地与跨 Owner 测试，并限制活动树中的文件、字节和历史副本。", implementation: "Test registry、Local/Cross-owner scope 和 repository bloat budget。" }
  ],
  usageExamples: [
    { ask: "比较几个方案，给我净收益最好的一个。", effect: "模型自己选择调查、工具和验证深度，不机械套 brainstorming 模板。" },
    { ask: "先复现根因，再修并跑相关回归。", effect: "先取得真实失败，再在最小 Owner scope 内修复并验证，不能用跳过测试制造绿灯。" },
    { ask: "能并行的并行，避免写冲突。", effect: "把互不依赖支路交给不同代理，只有真实写冲突的临界区串行。" },
    { ask: "只读审计，不实施修复。", effect: "不 Claim 排他 Owner，不产生外部 effect，只报告事实、证据和缺口。" },
    { ask: "现场回读，不用旧报告或记忆。", effect: "重新读取活动规则、项目规则、Owner Provider、Git 状态和当前源码。" },
    { ask: "验证后定向提交并正常推送。", effect: "保留其他 dirty work，只 stage 本任务文件，提交后 normal push 并从远端默认分支回读。" }
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
    { date: "2026-08-29", commit: "472ab3a–fa64622", result: "状态 wrapper（运维包装器）、Skill 元数据、微信路由和 36/36 合同覆盖完成当前对齐。" },
    { date: "2026-08-29", commit: "295d3f6", result: "加入个人照片、视频和录音的统一检索 Skill。" },
    { date: "2026-08-29", commit: "b703bc2", result: "恢复 token-budget-advisor 的自然语言发现，并完成 Fresh task 真实计数验收。" },
    { date: "2026-08-29", commit: "3cf3e83–40c20cc", result: "加入 personal-panel-refresh 的事件阈值判断、事务安装和 Fresh task 验收。" },
    { date: "2026-08-29", commit: "9dd7d25", result: "收紧 FastPublish（快速规则发布）的 Authority 前置校验；活动规则仍是 generation 79，候选尚未发布。" }
  ],
  operationalEntrypoints: [
    { name: "活动规则状态", command: "C:\\ProgramData\\PCConfig\\AuthorityHost\\policy\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1 -Json", purpose: "唯一证明当前活动 generation 和 production activation。" },
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
    value: "避免 Agent 从旧报告、错误仓库或不适用的全局规则出发，导致理解错项目、执行错命令或用错动态事实。",
    decisionImpact: ["项目有更具体规则时，优先按项目规则执行。", "需要 Git 或机器动态事实时，改去对应控制面现场读取。", "只有当前问题真正触发时才展开专项合同。", "来源冲突无法同时满足时停止，不用猜测拼接。"],
    problem: "当全局要求、项目规则、历史文档和现场状态同时存在时，必须有一套稳定方法判断谁拥有事实、哪一层优先，否则模型会把旧报告当规则、用全局原则覆盖项目业务，或者一次性加载所有材料后丢失注意力。",
    implementation: [
      "根规则只保留跨项目元规则和硬边界；保护、授权、三控制面和能力选择分别下沉到专项合同。",
      "项目根到当前目录链上的最近规则拥有业务语义、真实命令、兼容和发布边界；全局规则只能取交集或收紧。",
      "contract catalog 只保存触发 metadata、owner、文档和 validator 指针。模型先看 metadata，再按当前决定的信息价值读取正文。",
      "历史计划、报告、生成物和记忆只作线索，不会自动成为当前指令或动态事实。"
    ],
    flow: [
      "从固定活动入口取得同一 generation 的根规则",
      "读取当前项目最近的规则并确定业务 Owner",
      "用 catalog metadata 判断是否需要保护、授权、能力或三控制面合同",
      "只展开会改变当前决定的正文和现场 provider",
      "发生冲突时按上位指令、项目语义和全局硬边界逐层处理"
    ],
    concepts: [
      { term: "事实 Owner", explanation: "某类动态事实的唯一负责来源。文档指针可以导航，但不能代替它的现场回读。" },
      { term: "项目规则不覆盖", explanation: "全局规则不能改写具体项目的业务语义、命令或兼容约束；冲突无法同时满足时明确停止。" },
      { term: "渐进读取", explanation: "先确认 metadata 是否相关，再读取必要正文，不把全部合同机械灌进每个任务。" }
    ],
    boundaries: [
      "README 和操作指南面向人，不是执行规则或动态权威",
      "catalog 只能选择候选正文，不能证明某个 effect 已发生",
      "全局规则不能以统一为理由覆盖项目自己的测试与发布边界",
      "兼容文件名和历史命名不能恢复已经退役的控制面"
    ],
    failures: [
      { condition: "规则优先级冲突", response: "保留冲突两端的原文和 Owner；无法同时满足时失败关闭并说清差异。" },
      { condition: "catalog 缺项或 schema 漂移", response: "停止依赖该 catalog 的跨控制面结论，回到真实 Owner 修复 coverage。" },
      { condition: "人类指南与活动规则不一致", response: "活动 generation 继续作为权威，同时把过期指南视为待修缺陷。" }
    ],
    sources: [
      { path: "E:\\.agents\\AGENTS.md", role: "跨项目根规则的 canonical source" },
      { path: "E:\\.agents\\docs\\contracts\\README.md", role: "合同导航和三控制面关系说明" },
      { path: "E:\\.agents\\config\\control-plane-contract-catalog.json", role: "触发 metadata、owner 和 validator 的唯一目录" }
    ],
    verification: [
      "固定 Authority 入口确认根规则来自活动 generation，而不是 E 盘候选",
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
    teaser: "根据任务价值选择工具、Skill、插件、运行时和并行方式，而不是机械套流程。",
    status: "已落地；身份门禁与路由回归通过",
    value: "避免每个任务都套同一流程、错过现成能力，或为了看起来复杂而引入不需要的插件、运行时和子代理。",
    decisionImpact: ["简单问题可以直接完成。", "存在稳定窄能力时改走对应 Skill 或 Owner 入口。", "独立支路有质量或时间净收益时决定 0–10 个子代理。", "原路线真实缺失或失败后才降级，不先假设做不了。"],
    problem: "工具、Skills、插件和模型很多，真正困难的不是有没有，而是当前任务是否值得使用、会不会扩大范围、是否有更直接的 owner 入口，以及并行是否真的节省时间。固定模板会让简单任务膨胀，也会让复杂任务错过可用能力。",
    implementation: [
      "model intuition precedence 让模型根据目标、风险、信息增益、延迟、耦合、可逆性和净收益选择方法。",
      "Skill、Plugin、模板和计划默认只是建议性制品，不能凭正文里的 MUST 自行升级为硬门。",
      "初始工具列表不是能力上限；先查 owner adapter、固定 CLI/API 和当前 metadata，确认实质缺口后才降级或建议插件。",
      "原生委派先验证 model、effective effort、root/child role、generation 和合同 SHA，再判断 0 到 10 个直属代理。",
      "长任务保留可重建目标、边界、关键决定、实现和验证状态；压缩摘要只作线索。"
    ],
    flow: [
      "理解任务和验收结果",
      "查询已有 owner、原生入口和当前能力 metadata",
      "评估信息收益、延迟、冲突和可逆性",
      "需要委派时先验证身份，再按任务语义选择模型家族和 effort",
      "能力确实缺失时才安装官方运行时或提出精确插件",
      "实施后分别验证能力存在、当前可用和真实任务结果"
    ],
    concepts: [
      { term: "Advisory artifact", explanation: "提供方法和入口，但不会自动取得更高优先级、授权或施工 Owner。" },
      { term: "能力显著性", explanation: "metadata 先把可能相关的能力放回注意力，正文仍按当前问题的净收益渐进读取。" },
      { term: "身份先于委派", explanation: "代理名称和模型自报不算身份；没有可信身份时只关闭委派，主任务继续。" },
      { term: "证据式降级", explanation: "只有入口真实缺失、失败或策略阻断时才换路线，不因想象中的风险先降级。" }
    ],
    boundaries: [
      "能力发现不会扩大用户授权",
      "账号、插件、管理员 token 和子代理都不能绕过 Owner 或 effect 边界",
      "不为假想未来预装动态配置服务、兼容层或第二套 provider",
      "子代理模型家族和 effort 不能高于父级允许上限"
    ],
    failures: [
      { condition: "委派身份不可验证", response: "停止 spawn，但继续本地调查、实现、测试和答复。" },
      { condition: "provider 缺失或账号不可用", response: "报告确切缺口，不伪造第二 provider 或静默换账号。" },
      { condition: "子代理中断", response: "优先恢复原 session；无法恢复才重新执行，partial 不能冒充完成。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.capability-routing.md", role: "能力、上下文、复杂度和原生委派的唯一语义 owner" },
      { path: "E:\\.agents\\skills\\native-economy-routing\\SKILL.md", role: "把活动委派门禁恢复到注意力的窄入口" },
      { path: "E:\\.agents\\config\\on-demand-plugin-catalog.json", role: "只有实证能力缺口时读取的插件 metadata" }
    ],
    verification: [
      "NativeEconomyRoutingGate 验证身份先行、家族/effort 上限和触发重判",
      "AgentRuntimeCompatibility 验证宿主与规则的运行兼容",
      "AgentAutonomyPolicy 验证方法自治承诺，但不冒充真实委派 E2E"
    ],
    relation: "能力路由选择方法，不产生授权。它把现实动作交给授权与 Owner，并在受保护动作前使用活动策略。"
  },
  {
    slug: "authorization-owner",
    shortTitle: "授权与 Owner",
    title: "用户授权、CoreGoal 与执行 Owner",
    teaser: "把用户目标拆成授权、目标身份、施工范围、步骤能力和真实收口。",
    status: "合同已生效；Owner registry 回归通过",
    value: "防止“用户让我做事”被误解成任何代理都能对任何对象任意写，也防止多个任务同时改同一范围或任务结束时遗失未完成义务。",
    decisionImpact: ["本机低风险可逆操作可直接继续。", "外部现实动作未授权时停止。", "有重叠 Owner 时不绕过，先协调或等待一次。", "目标扩大时建立 successor，不拿旧授权硬套。", "有 residual 时必须带 checkpoint 移交，不能直接完成。"],
    problem: "用户说要完成一件事，不等于任何代理都能对任何对象执行所有动作。系统必须区分用户授权、操作系统权限、最高权限身份、目标是否仍是原目标、施工范围是否被别人占用，以及动作完成后是否有正式回读。",
    implementation: [
      "低风险、可逆、范围内的本机读取、编辑和测试直接推进；消息、外部写入、发布、部署和付费需要明确授权。",
      "CoreGoalCommitment 冻结目标、范围、禁止项和停止条件，不冻结计划、代码、执行器或后续 epoch。",
      "每个现实步骤使用短时、单次、防重放的步骤能力，绑定 effect、目标、pre/post、回滚和 executor。",
      "scoped execution owner 用 expected revision CAS 认领最小 scope；纯只读审计不需要排他绑定。",
      "Git 完成和业务完成分别报告；个人仓库最终必须从真实默认分支可达并由远端回读。"
    ],
    flow: [
      "解析现实 effect 和目标",
      "判断授权是否已在当前请求中明确成立",
      "解析 registered target 的当前状态和允许动作",
      "Inspect 并 Claim 最小 execution scope",
      "为单一 effect 派生短时步骤能力",
      "在副作用边界重读目标事实后执行",
      "取得 owner receipt、read-back 和必要的 Git 收口",
      "释放 Owner，或将未完 residual 连同 checkpoint 原子移交"
    ],
    concepts: [
      { term: "CoreGoal", explanation: "长期不变的目标承诺。实现细节变化不会强迫用户重新确认，目标扩大才建立 successor。" },
      { term: "步骤能力", explanation: "只允许一次精确 effect 的短时凭据，过期或事实漂移后必须重新派生。" },
      { term: "Execution Owner", explanation: "协调谁在改哪一块，不替代事实 Owner，也不产生用户授权或管理员权限。" },
      { term: "Registered target", explanation: "reference 证明目标是谁，live resolution 说明现在能做什么；两者都不证明动作已发生。" }
    ],
    boundaries: [
      "UAC 只提升 Windows token，不扩大任务授权",
      "子代理、shell、worktree 和插件不能绕过已有重叠 Owner",
      "force-push、新公开面、付费和不可恢复动作不在默认收敛授权内",
      "PRIVATE 或可信目标不等于已经授权写入"
    ],
    failures: [
      { condition: "目标或 executor 漂移", response: "废弃当前步骤能力，现场重读后在同一 CoreGoal 下重新派生。" },
      { condition: "发现重叠 Owner", response: "不绕过；发送一次有界请求，只有硬依赖时作一次事件等待。" },
      { condition: "Git 非 fast-forward", response: "停止推送并解决同步，不使用 force-push掩盖冲突。" },
      { condition: "任务仍有 residual", response: "保留 lease，记录 checkpoint 并转交真实 successor，不能直接宣称完成。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.authorization-delegation.md", role: "授权、CoreGoal、Owner、Git 和可信目标的唯一合同" },
      { path: "E:\\.agents\\tools\\Invoke-ExecutionOwnerRegistry.ps1", role: "Owner CAS、scope transition 和 action authorization 入口" },
      { path: "E:\\.agents\\tests\\Test-ExecutionOwnerRegistry.ps1", role: "Owner claim、冲突、移交和恢复回归" }
    ],
    verification: [
      "Authority descriptor 确认授权合同来自活动 generation",
      "ExecutionOwnerRegistry 聚焦回归验证 Claim/Add/Transfer/Release 语义",
      "Git 结果必须另由 Git owner 现场确认 default branch、remote 和 push read-back"
    ],
    relation: "这个模块决定谁被允许做哪一步；能力路由只推荐方法，保护策略只证明重大动作使用哪一代规则。"
  },
  {
    slug: "protected-policy",
    shortTitle: "保护策略",
    title: "活动 Authority、重大动作与恢复",
    teaser: "把 E 盘候选规则发布成不可变活动代际，并区分普通漂移与真正完整性事故。",
    status: "第 79 代活动有效；E 侧消费者兼容回归已通过",
    value: "防止一份可编辑源码、临时 JSON 或自签名文件冒充正在控制重大动作的规则，同时避免把普通候选变化或一次读取失败误判成设备遭到攻击。",
    decisionImpact: ["固定 Authority 验证通过时继续使用当前 active generation。", "Candidate pending 时旧 active 仍有效，但候选不能执行。", "Production activation 不成立时关闭登记重大动作。", "只有真实活动链完整性异常才进入 containment 和恢复。"],
    problem: "规则源码可以编辑，但重大动作不能直接相信任意工作树或临时状态。系统需要一个固定、可验证、不可变的活动代际，同时又不能把普通 candidate 差异、一次读取失败或用户取消验证误判成设备被攻击。",
    implementation: [
      "E 盘五份 canonical source 始终只是 candidate；C 盘签名 generation 才是活动规则。",
      "固定 AuthorityHost 入口验证五份规范字节、projection manifest、签名、generation chain、HKLM anchor、ledger、shim、provider 和 adapter registry。",
      "正常发布链是 candidate、protected publish、immutable active generation、正式 read-back。",
      "只有活动包、签名、anchor、epoch、AuthorityHost 或 ledger 在合法事务外被破坏并经重复回读确认，才进入完整性事件和 containment。",
      "人类因子固定为 Passkey、TOTP、Recovery 和 Account；Google/Microsoft 只是 Account provider。"
    ],
    flow: [
      "调用固定 C 入口并验证状态、generation root 和五份闭包",
      "默认完整读取根规则，按任务需要再读保护合同",
      "发布时重新校验旧活动链、候选规范字节和单次步骤能力",
      "在全局互斥中 staging、再验新鲜度、写 generation/anchor/shim/ledger",
      "正式 read-back 后才允许已登记生产适配器执行"
    ],
    concepts: [
      { term: "Candidate", explanation: "可编辑的 E 盘规则源码。与活动规则不同只意味着待发布，不意味着系统被破坏。" },
      { term: "Active generation", explanation: "C 盘不可变、签名并由固定入口验证的现行规则集合。" },
      { term: "Containment", explanation: "活动权威真实完整性异常时冻结高风险能力并进入恢复，不由一次读取错误触发。" },
      { term: "Read-back", explanation: "动作完成后从正式 owner 再读一次结果；脚本返回成功不能代替。" }
    ],
    boundaries: [
      "E 源码、candidate manifest、自签名或任意 status JSON不能证明活动规则",
      "candidate pending 和 candidate unavailable 都不会降低既有活动 generation",
      "用户取消因子、因子缺失或一次读取失败只暂停相关交易",
      "文档投影本身不是 effect 授权源"
    ],
    failures: [
      { condition: "Candidate pending", response: "继续使用旧活动代际；修复或完成候选发布，不进入 device untrusted。" },
      { condition: "Candidate unavailable", response: "继续验证旧活动代际，禁止猜测、发布或恢复候选。" },
      { condition: "Production activation false", response: "只在唯一允许的 pending reason 下继续读规则；依赖适配器的重大动作仍关闭。" },
      { condition: "活动完整性失败", response: "失败关闭重大动作，保留恢复证据并通过正式受保护链恢复。" }
    ],
    sources: [
      { path: "C:\\ProgramData\\PCConfig\\AuthorityHost\\policy\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1", role: "唯一固定活动状态入口" },
      { path: "E:\\.agents\\docs\\contracts\\agents.protected-major-actions.md", role: "保护策略 canonical candidate source" },
      { path: "E:\\.agents\\tools\\Get-ProtectedMajorActionPolicyStatus.ps1", role: "E 侧运维包装器；不是 Authority" }
    ],
    verification: [
      "当前固定 Authority 返回 candidate_pending；第 79 代 active generation 仍完整验证、production activation true、无 integrity incident",
      "五份 active descriptor、活动 projection 和网站规则解释一致；E 盘 source 是 candidate，存在候选时不宣称与 active 逐字节相同",
      "E 侧 wrapper（运维包装器）与当前授权状态兼容并通过真实 read-back；它仍只是消费者，不能反向覆盖 C Authority（活动权威）",
      "Publisher 成功、源码测试、安装和活动 read-back 必须作为不同证据层记录"
    ],
    relation: "保护策略只拥有活动权威和重大动作安全；用户授权与施工 Owner 仍由授权合同拥有。"
  },
  {
    slug: "skills-plugins",
    shortTitle: "Skills / Plugins",
    title: "个人 Skills 与插件供应链",
    teaser: "用一份 registry 管理 canonical source、安装意图、发现入口和分层验证。",
    status: "供应 source/install/transaction 当前通过；运行 E2E 不能由安装推断",
    value: "防止同一个 Skill 出现多份互相漂移的源码，也防止系统仅凭文件存在或 junction 存在就声称新任务真的能用。",
    decisionImpact: ["Source、quick validation、junction 和 transaction 全部通过才算安装层健康。", "Current task、Fresh task 和 E2E 没证据时显示 Unknown。", "安装中断时按 recovery capsule 回滚或 reconcile。", "退役 Skill 的目录或旧测试不能让它重新出现。"],
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
      { path: "E:\\.agents\\skills", role: "个人维护 Skills 的 canonical root" },
      { path: "E:\\.agents\\plugins", role: "插件提供 Skills 的 canonical root" },
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
    teaser: "只加载会改变决定的事实，并把设计、源码、运行、发布和用户结果分开证明。",
    status: "三控制面视图与 36/36 合同覆盖均通过",
    value: "避免一次加载过多上下文让模型注意力丢失，也避免用“代码存在”“测试通过”或“部署返回成功”代替用户真正能用。",
    decisionImpact: ["普通单项目问题不进入全景控制面。", "跨 Owner 决策先读 metadata，再展开必要正文。", "证据缺失或过期时降为 Unknown，而不是 PASS。", "设计、Git、机器运行和外部 read-back 分开验证。"],
    problem: "长任务会压缩，多个 owner 会变化，同一结论又可能来自文档、源码、测试、运行时或外部回执。系统必须让重要状态可重建，同时防止把摘要、历史命名或某一层 PASS 当成全部完成。",
    implementation: [
      "现行只有三个控制面：.agents、Git 总索引和 PCConfig；具体项目拥有业务事实。兼容名称不会创造第四个控制面。",
      "跨控制面入口只返回 owner、路径、SHA、大小和 token 估算，不复制私人正文、不运行动态 provider、不建立共享数据库。",
      "长任务使目标、边界、授权、关键决定、当前实现和验证状态可从正确 owner 或持久任务状态重建。",
      "证据层包括合同设计、源码、测试、安装、运行、发布、fresh task、E2E 和用户可见结果，互不冒充。",
      "仓库膨胀治理把完成计划和历史复盘留给 Git，活动树只保留当前 source、contract、config 和行为回归。"
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
      "Cross-control coverage（跨控制面覆盖）当前为 36/36，finding_count=0；以后新增合同仍必须单独回归"
    ],
    relation: "这个模块把其他五个模块的结论放进正确证据层，并保证长任务和更新快照时不会靠记忆续写。"
  }
];

const ruleHashes = {
  agents_root_rules: "de3ff6c32c45d07dda589395ba84ee14fa6b86fed4525c22e60a70d83408104d",
  protected_major_actions_contract: "03180bd48e469df07d27bf2cd9732b5571a0782fd7184dd185aadc7c12adfa19",
  authorization_delegation_contract: "8fb6e082174501be53eb921b56cd9d2e1afc7c43121cc6d996a14c5cef7add94",
  four_base_decision_context_contract: "8a1995d73ed93f47f8e992baaa64bf32a74bb6081a13d9984f0fa8ab1c44d35a",
  capability_routing_contract: "f73d398715402352089c5d5466247ee592e1e1c09912354ef519df44b2730f96"
};

export const rulesSnapshot = {
  ...panelSnapshot.authority,
  observedAt: panelSnapshot.observedAt,
  sourceCommit: panelSnapshot.sourceCommit,
  rules: [
    {
      logicalId: "agents_root_rules",
      title: "全局根规则",
      question: "日常任务先遵循什么，哪一类事实由谁负责？",
      owner: ".agents",
      sha256: ruleHashes.agents_root_rules,
      bytes: 14747,
      characters: 7497,
      lines: 56,
      sourcePath: "E:\\.agents\\AGENTS.md",
      projectionRelpath: "agents-root-rules.md",
      purpose: "所有任务的默认总入口。它定义指令优先级、事实 Owner、模型自治、授权总边界、Git 与验证习惯，以及私人领域的固定路由。",
      plainLanguage: "先确认谁拥有答案，再在安全边界内把事情办完；不拿流程冒充结果，也不拿全局规则改写项目业务。",
      scope: ["所有项目任务和无项目任务", "root 与 child", "具体项目规则之外的跨项目元规则"],
      decisions: [
        "system/developer、本轮用户、最近项目规则、全局规则和记忆之间怎样排序",
        "Agent、Git、机器和业务事实分别回到哪个 Owner",
        "什么工作直接推进，什么动作需要授权或进入受保护合同",
        "怎样保留已有改动、分层验证并收口个人仓库",
        "健康、微信、录音、扫描件、秘密和 Vault 应走哪条窄入口"
      ],
      allowed: ["范围内低风险本机工作直接推进", "根据净收益自主选择方法与并行", "授权已明确时完成验证、发布和回读", "保留 dirty work 并定向提交"],
      forbidden: ["用全局规则覆盖项目业务", "把历史报告或记忆当活动权威", "无可信身份时委派", "用测试或字段冒充产品结果", "恢复已退役中央个人上下文"],
      process: ["读取固定活动根规则", "读取最近项目规则", "确定目标与事实 Owner", "按触发读取专项合同", "实施并分层验证", "用人话报告现实结果"],
      failure: ["规则冲突无法同时满足时停止并说清冲突", "委派身份缺失只关闭委派，主任务继续", "授权不清时停止外部 effect，但继续安全调查", "Git 未收口时分别报告业务和 Git 状态"],
      sections: [
        { title: "优先级与事实 Owner", paragraphs: ["活动规则只接受当前固定 Authority 提供的同一 generation。具体项目继续拥有自己的业务语义、命令和发布边界。"], items: [".agents：Agent 行为、授权、能力路由和个人 Skills", "Git 控制面：仓库身份、可见性、分支、同步和发布", "PCConfig：机器路径、运行时、任务、备份和恢复", "具体项目：业务、领域数据、启动和测试"] },
        { title: "模型自治与复杂度", paragraphs: ["模型按照目标、风险、可逆性和净收益选方法；长任务保留可重建状态，短任务不为流程完整制造文档。"], items: ["Skill 和模板默认是建议，不是硬门", "只抽象真实重复和 owner 边界", "活动树保留当前 source、contract、config 和行为回归", "最新或不确定的技术事实优先核对官方来源"] },
        { title: "授权、Git 与验证", paragraphs: ["本机可逆工作直接做；外部 effect 需要明确授权。Git 实施默认包含定向提交和正常推送，除非用户明确只本地。"], items: ["不覆盖用户已有改动", "force-push 不在默认授权内", "source、test、install、publish、fresh task 与 E2E 独立", "个人仓库必须由远端默认分支回读"] },
        { title: "私人领域与供应", paragraphs: ["中央个人知识入口已退役；持续需求通过健康、微信、原件、录音、OCR、秘密和 Vault 等小型独立入口处理。"], items: ["Personal Skills 的 source 只在 E:\\.agents\\skills 和 plugins", "用户目录只是 discovery junction", "动态事实由真实 owner 现场提供", "新规则原位升级，不堆补丁"] }
      ],
      relation: "它是默认入口；其余四份规则分别拥有保护、授权、跨控制面取证和能力选择的完整语义。"
    },
    {
      logicalId: "protected_major_actions_contract",
      title: "重大动作保护",
      question: "高影响动作什么时候允许、暂停、拒绝或进入恢复？",
      owner: ".agents",
      sha256: ruleHashes.protected_major_actions_contract,
      bytes: 10501,
      characters: 6259,
      lines: 68,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.protected-major-actions.md",
      projectionRelpath: "contracts\\agents.protected-major-actions.md",
      purpose: "唯一拥有活动策略、完整性、保护发布、安装与 containment 的合同。它把可编辑 candidate 与真正生效的 immutable generation 分开。",
      plainLanguage: "E 盘是草稿，固定 C Authority 里的签名代际才是现行规则；普通草稿变化不是攻击，真实活动链破坏才进入 containment。",
      scope: ["三个控制面及受管项目", "操作系统、磁盘、启动与恢复链", "新公开面、唯一副本、不可逆迁移和规则发布"],
      decisions: ["哪一代规则真正活动", "何时需要 human factor", "candidate 与 active 的差异如何解释", "什么才是确定性完整性事件", "publisher、shim、anchor、ledger 和 adapter 是否可信"],
      allowed: ["verified generation 下继续普通工作", "candidate pending 时继续旧 active", "单次步骤能力下执行受保护发布", "合法事务中替换 generation、anchor 和 shim"],
      forbidden: ["把 E candidate 或自签名当 active", "由关键词机械推导 human required", "一次读取失败就进入 device untrusted", "production activation 不成立时执行重大 adapter"],
      process: ["固定 C 状态", "验证五份闭包和签名链", "按任务读取保护合同", "取得单次步骤能力", "原子发布", "正式 read-back"],
      failure: ["candidate pending：继续旧活动代际", "candidate unavailable：继续旧 active，禁止猜候选", "适配器授权 pending：可读规则但重大 effect 关闭", "活动完整性失败：冻结重大动作并按正式链恢复"],
      sections: [
        { title: "判断边界", paragraphs: ["最高权限智能体结合真实意图、目标、范围和可恢复性作语义判断；机械层只验证身份、签名、nonce、事实和 effect 边界。"], items: ["人类因子：Passkey、TOTP、Recovery、Account", "Google 与 Microsoft 只是 Account provider", "取消、超时和失败只暂停", "四类全失不能自举新的人类根"] },
        { title: "Candidate 与 Active", paragraphs: ["正常链路是 E candidate、protected publish、C active generation。candidate pending 不降低活动代际，candidate unavailable 也不授权猜测或恢复。"], items: ["五份规则必须在同一 projection", "活动 generation 不可变", "源码相等只能证明候选一致", "production activation 仍需正式状态"] },
        { title: "完整性与 containment", paragraphs: ["只有活动包、签名、anchor、epoch、AuthorityHost、owner 或 ledger 在合法事务外被替换、删除、回滚、伪造、重放或旁路，并经重复回读确认，才是确定性事件。"], items: ["先排除 candidate 差异", "先排除合法 journal 和 preimage", "一次读取故障不能触发 BitLocker containment", "普通拒绝和因子缺失不会改变设备信任"] },
        { title: "发布与回读", paragraphs: ["Publisher 在锁内重验旧链、候选规范字节和单次能力，staging 后再次检查新鲜度，再事务写入 generation、anchor、shim 和 ledger。"], items: ["成功返回不等于 read-back", "源码测试不等于生产激活", "文档投影不等于 effect authority", "生产 registry 只有三个登记 adapter"] }
      ],
      relation: "只判断活动性、保护发布与 containment；用户授权、CoreGoal、Owner 和 Git 由授权合同负责。"
    },
    {
      logicalId: "authorization_delegation_contract",
      title: "授权与委派",
      question: "授权覆盖到哪里，谁可以施工，怎样证明动作完成？",
      owner: ".agents",
      sha256: ruleHashes.authorization_delegation_contract,
      bytes: 16138,
      characters: 9126,
      lines: 83,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.authorization-delegation.md",
      projectionRelpath: "contracts\\agents.authorization-delegation.md",
      purpose: "唯一拥有用户授权、CoreGoal、委派收窄、执行 Owner、可信目标和 Git 收口的合同。",
      plainLanguage: "把一句用户目标拆成授权、目标身份、施工范围、单次步骤和正式回读，避免权限、管理员 token 和任务 Owner 混在一起。",
      scope: ["本机工作与 external effect", "root 和 child 委派", "长期无人值守目标", "多任务施工与 Git 收口", "PRIVATE、PUBLIC 和未知目标"],
      decisions: ["当前请求是否已授权现实 effect", "是否需要 UAC 但不扩大授权", "目标是否仍是已登记目标", "谁拥有最小施工 scope", "Git、发布和 external effect 是否真正收口"],
      allowed: ["低风险本地工作直接做", "同一 active goal 内重派生步骤", "现有 upstream 定向 commit 和 normal push", "可信私有目标内按任务需要保真"],
      forbidden: ["child、shell、worktree 或 UAC 扩权", "绕过重叠 Owner", "用 timeout 或自制 evidence 恢复 Owner", "无明确门禁 force-push 或新公开", "把 trusted 当已授权"],
      process: ["解析 effect", "解析 registered target", "确认授权或 CoreGoal", "Claim 最小 scope", "派生单次能力", "执行并 read-back", "Git 收口", "Release 或 Transfer"],
      failure: ["步骤漂移：废弃并重派生", "目标扩大：建立 successor 并重新确认", "Owner 冲突：一次有界协调", "Git 非 fast-forward：停止并解决同步", "Residual 未移交：保持 lease"],
      sections: [
        { title: "授权与提权", paragraphs: ["本机可逆工作直接推进；external effect 要有明确授权。Windows Medium token 不表示管理员能力不存在，UAC 只解决 OS token。"], items: ["当前请求明确对象、内容和动作即可授权", "不自动扩到新账号或新公开面", "委派边界只能收窄", "项目规则继续拥有业务语义"] },
        { title: "CoreGoal 与步骤能力", paragraphs: ["CoreGoal 固定目标、范围、禁止项和停止条件，不冻结计划、代码或 executor。每个 effect 使用短时、单次、防重放的步骤能力。"], items: ["实现漂移不要求重新人类确认", "目标扩大才建立 successor", "步骤能力绑定 pre/post 和回滚", "四类人类因子全部丢失时不能自举"] },
        { title: "Execution Owner", paragraphs: ["Owner 只协调施工，不产生授权和事实。首次写入前从 registry 读取 binding，用 CAS 认领最小 scope。"], items: ["纯只读审计不 Claim", "已有重叠 Owner 不能绕过", "交付 accepted 不等于对方已完成", "未完 residual 必须随 checkpoint 移交"] },
        { title: "Git 与可信目标", paragraphs: ["Git 实施默认含定向提交和正常推送；个人仓库结果必须从真实默认分支可达并由远端回读。目标可信度、可见性和写授权彼此独立。"], items: ["force-push 不在默认授权", "PUBLIC 暴露检查失败时停止", "PRIVATE 不意味着可以泄露 secret", "不完整副本不能称完整备份"] }
      ],
      relation: "它拥有现实 effect 的授权和施工责任；能力合同只决定怎么做，保护合同只决定重大动作依据什么活动权威。"
    },
    {
      logicalId: "four_base_decision_context_contract",
      title: "三控制面决策上下文",
      question: "跨 .agents、Git 和 PCConfig 时去哪里取证？",
      owner: ".agents",
      sha256: ruleHashes.four_base_decision_context_contract,
      bytes: 2451,
      characters: 1449,
      lines: 26,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.four-base-decision-context.md",
      projectionRelpath: "contracts\\agents.four-base-decision-context.md",
      purpose: "跨控制面架构、运行治理和长期演化的 metadata 入口。兼容 logical id 保留旧名称，但现行只有三个控制面。",
      plainLanguage: "只有跨 Owner 的事实会改变决定时才展开全景；先拿路径、SHA 和 Owner，再按影响读正文，不恢复退役中央上下文。",
      scope: ["跨控制面架构评审", "运行治理", "全局演化", "Owner 关系和合同覆盖"],
      decisions: ["当前需要哪个控制面的事实", "是否只需 metadata 还是要展开正文", "设计、Git、机器和 external receipt 应怎样分开验证", "是否真的出现需要新基座的稳定需求"],
      allowed: ["零写获取 metadata", "按影响展开 owner 正文", "必要时联动三个 Owner"],
      forbidden: ["把兼容名称理解成第四控制面", "恢复已退役中央上下文", "复制私人正文和巨大快照", "用 catalog candidate 冒充 active", "用合同设计证明 runtime"],
      process: ["确认跨 Owner 事实会改变决定", "列出视图和 owner", "选择 operations governance 或 global evolution", "读取 primary metadata", "按影响展开 conditional", "独立验证各层"],
      failure: ["schema 无效：BLOCK", "五规则闭包不完整：BLOCK", "required owner 缺失：BLOCK", "primary 不可读：BLOCK", "修正确 Owner，不回退历史系统"],
      sections: [
        { title: "现行边界", paragraphs: ["现行控制面只有 .agents、Git 总索引和 PCConfig；具体项目继续拥有业务语义。文件名里的 four-base 只是兼容标识。"], items: [".agents：Agent 行为、授权、能力路由", "Git：仓库身份、可见性、分支、同步、发布", "PCConfig：机器路径、运行时、任务、备份、恢复", "具体项目：业务和产品结果"] },
        { title: "入口与证据", paragraphs: ["入口只返回 owner、活动和候选路径、SHA、大小和 token 估算；不复制正文、不运行动态 provider、不建共享数据库。"], items: ["先 metadata 后正文", "活动规则仍从固定 C generation 解析", "设计、Git、机器和 adapter receipt 分开验证", "普通单项目任务不机械进入全景"] },
        { title: "退役边界", paragraphs: ["历史中央系统及其冻结文档不是控制面、默认个人上下文或运行产品。备份对象存在也不会恢复它。"], items: ["不调用旧 context、beacon 或 probe", "不读取历史私人数据库和媒体", "历史命名不是新基座理由", "新基座必须有独立稳定 owner、生命周期和恢复边界"] }
      ],
      relation: "它只选择跨 Owner 证据，不提供业务答案、不授权 effect，也不证明发布完成。"
    },
    {
      logicalId: "capability_routing_contract",
      title: "能力路由",
      question: "应该用哪个 Skill、工具或代理，什么时候并行或降级？",
      owner: ".agents",
      sha256: ruleHashes.capability_routing_contract,
      bytes: 16356,
      characters: 8370,
      lines: 66,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.capability-routing.md",
      projectionRelpath: "contracts\\agents.capability-routing.md",
      purpose: "唯一拥有方法选择、上下文路由、复杂度治理、动态配置准入、reader routing、原生经济委派和按需插件语义的合同。",
      plainLanguage: "不机械套 Skill，不因工具列表短就宣布做不了；先找已有 Owner 和原生入口，再按净收益选择能力和并行方式。",
      scope: ["所有能力选择", "长任务状态重建", "README 与项目规则路由", "动态配置设计", "原生委派和插件缺口"],
      decisions: ["当前任务值不值得使用某项能力", "应读多少上下文", "是否安装运行时或建议插件", "是否并行以及选择什么代理家族", "怎样保持代码和仓库不过度膨胀"],
      allowed: ["按净收益选择方法", "需要时安装官方稳定运行时", "verified 身份下委派", "真实能力缺口时提醒精确插件", "复杂任务建立可重建 checkpoint"],
      forbidden: ["把 Skill 指令升级成硬门", "已有入口仍提示插件", "无身份 spawn", "固定默认 child 模型", "为假想未来建动态配置平台", "把 README 当默认 AI 上下文"],
      process: ["理解目标", "查 owner 和原生入口", "评估净收益与风险", "需要委派先验身份", "缺能力再装 runtime 或建议插件", "实施并分层验证"],
      failure: ["无可信身份：只关闭委派", "provider 缺失：报告受限，不造第二 provider", "child 中断：优先恢复原 session", "generation 改变或压缩：重读委派节", "catalog schema 无效：失败关闭"],
      sections: [
        { title: "方法与能力自治", paragraphs: ["目标、信息增益、延迟、耦合和可逆性决定方法。Skill、Plugin、模板和计划只是候选能力，不会扩大授权。"], items: ["先找 owner adapter、CLI/API 和 metadata", "实证缺失才降级", "任务必需 runtime 可从官方路径安装", "既有项目服从 lock、版本和 CI"] },
        { title: "耐久状态与代码", paragraphs: ["长任务必须可重建；代码优先内聚、单一事实源、显式接口和确定行为，不为假想未来建框架。"], items: ["Consumer 只依赖最小接口", "配置按真实需求逐级准入", "秘密只用 SecretRef", "完成计划和旧复盘由 Git 留史"] },
        { title: "Reader routing", paragraphs: ["人类 README 要保持人话和最新，但不是动态权威；项目规则只承载该项目真正更具体的语义。"], items: ["用户明确询问或验收需要时才读操作指南", "过期文档是待修缺陷", "嵌套规则只在子树语义不同才存在", "现场代码、测试和 provider 决定实现事实"] },
        { title: "原生经济委派", paragraphs: ["可信身份先于 0 到 10 决策。任务开始、独立支路、阻塞、重大 steer、压缩、child 完成和槽位释放都会重新判断。"], items: ["Luna：封闭可验读重工作", "Terra：强耦合实现和深调试", "Sol：最高风险、战略和终审", "Root 始终负责目标、风险和最终集成"] },
        { title: "按需插件", paragraphs: ["Skill 注入、安装、账号连接、fresh task 和 E2E 是独立事实。只有能力缺口真实影响结果时才读取插件 catalog。"], items: ["已有等价入口不提示插件", "用户同意后才安装或连接", "未知 trigger 返回 not found", "catalog schema 无效失败关闭"] }
      ],
      relation: "它选择方法和上下文，但不会产生授权、Owner 或活动权威。"
    }
  ]
};
