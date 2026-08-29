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
  generatedPanelFacts?.schema !== "wly.panel-facts.v2"
  || generatedPanelFacts?.generatedBy !== "scripts/refresh-panel-snapshot.mjs"
  || !generatedPanelFacts?.authority?.releaseId
  || !Array.isArray(generatedPanelFacts?.ruleBinding)
  || generatedPanelFacts.ruleBinding.some((binding) => !/^[a-f0-9]{64}$/.test(binding?.sourceSha256 || "") || !Number.isInteger(binding?.sourceBytes) || typeof binding?.sourceMatchesRelease !== "boolean" || !binding?.releasePath)
  || !Array.isArray(generatedPanelFacts?.validation?.rows)
  || !Array.isArray(generatedPanelFacts?.validation?.failures)
  || !Number.isInteger(generatedPanelFacts?.skills?.activeInstallIntent)
  || !generatedPanelFacts?.integrity?.payloadSha256
) {
  throw new Error("panel facts are missing or invalid; run npm run refresh:snapshot before build");
}

export const panelSnapshot = generatedPanelFacts;
const currentValidationDetail = (prefix) => panelSnapshot.validation.rows.find((row) => row.layer.startsWith(prefix))?.detail || "本轮没有取得这一层的当前证据。";

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
  summary: `当前活动规则为 ${panelSnapshot.authority.releaseId}：绑定 PRIVATE main 提交 ${panelSnapshot.authority.gitCommit.slice(0, 7)}、五文件 ruleset ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…，前代为 ${panelSnapshot.authority.previous?.release_id || "无"}。C 盘 generation、Publisher、anchor 和 ledger 只作恢复材料，不再参与准入。项目同时管理 24 个 active Skill 安装意图（公开看板收录 22 个）与三个控制面协作。`,
  why: "个人 AI 工作会同时跨越代码仓库、本机配置、私有资料、外部服务和多个并行任务。没有统一边界时，最容易改错项目、扩大授权、覆盖其他任务，或者把测试通过误报成用户已经能用。",
  plainExample: "例如我说“重建并发布个人项目网站”。它先让网站项目决定页面内容和测试方式，让 Git 总索引确认公开仓库、主分支和远端，让 .agents 判断哪些动作已经得到允许以及能否并行；构建、推送和公网打开分别验证。任何一步没完成，都不能用上一层的成功冒充整个任务已经完成。",
  result: "我最终会得到一条可以追溯的工作链：每个事实来自正确项目，每个写入有人负责，每个外部动作有明确授权，失败时知道从哪里恢复，结束时能区分本地完成、远端完成和用户真正可用。",
  readerStates: {
    pass: "目标、事实来源、授权、施工范围和验证层都明确时，任务继续执行并分别回读本地、远端和用户可见结果。",
    problem: "只停止发生冲突或验证失败的那一步，明确失败位置、原因和恢复线索；其他不依赖该问题的安全工作可以继续。",
    unavailable: "把对应事实标记为 Unknown（证据不足），不猜路径、不猜授权，也不把本地成功冒充成远端或用户可用。"
  },
  heroFacts: [
    { label: "当前活动规则", value: `${panelSnapshot.authority.releaseId} · PRIVATE main ${panelSnapshot.authority.gitCommit.slice(0, 7)} · ruleset ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…；current pointer revision ${panelSnapshot.authority.pointerRevision}，previous=${panelSnapshot.authority.previous?.release_id || "无"}` },
    { label: "规则与模块", value: `同一 ${panelSnapshot.authority.releaseId} release 的 5 份规则；项目总览加 6 个模块；Rules 与 Skills 是独立全局入口` },
    { label: "个人能力供应", value: "供应清单 24 个 active install intent；公开看板收录 22 个，2 个私人或冻结项不列名称" },
    { label: "三控制面", value: ".agents 管行为、授权和能力；GitHub 总索引管仓库与发布事实；PCConfig 管机器事实与恢复" },
    { label: "运行与临时目录", value: "AI 工作台运行根和本地数据库已迁到 E 数据盘，C 盘只留兼容 junction、没有第二副本；任务 temp 统一进入 E 缓存盘的独立 task 目录" },
    { label: "本轮模型与委派", value: `根任务使用 gpt-5.6-sol / max；四条审计支路分别使用 2 个 Luna Max、1 个 Terra Max、1 个 Sol Max。模型身份、${panelSnapshot.authority.releaseId} 规则身份和每条审计结论分别回读，不用名称冒充验证` },
    { label: "C 盘旧链", value: "旧 generation、Publisher、签名、anchor、manifest、ledger 和回执全部只读保留；不是权威、fallback、Owner 证明或运行依赖" }
  ],
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
    { term: "E release（E 规则版本）", meaning: `递增 E 代号、PRIVATE main commit、五份规范 bytes/SHA 和 ruleset SHA 的不可复用绑定；当前是 ${panelSnapshot.authority.releaseId}。` },
    { term: "Canonical source（规范源码）", meaning: "E:\\.agents 当前可编辑规则源码；dirty 或未激活提交不是 current release。" },
    { term: "Current pointer（当前指针）", meaning: "E:\\.agents\\releases\\current-rules.json，原子指向 current/previous release。" },
    { term: "Ruleset SHA（五规则总指纹）", meaning: "按固定 logical id 顺序绑定五份文件 path、bytes 和 SHA 的总指纹。" },
    { term: "Release record（版本记录）", meaning: "绑定 E 代号、Git commit、五文件描述符、ruleset、远端包含和发布时 source clean 的 JSON。" },
    { term: "Recovery-only C history（仅恢复的 C 盘历史）", meaning: "旧 generation、Publisher、签名、anchor、manifest、ledger 和回执可读保留，但不是当前权威或运行依赖。" },
    { term: "Runtime root（运行根）", meaning: "AI 工作台配置和本地数据库的唯一 E 盘根；C 盘只保留兼容 junction，不保存第二副本。" },
    { term: "Activator（激活器）", meaning: "唯一执行测试、PRIVATE main 回读、五哈希、UAC CAS、pointer 切换和 ACL/read-back 的本地工具。" },
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
    { name: "全局根规则", responsibility: "跨项目优先级、E rules authority、事实 Owner、授权、Git 与验证总原则。", implementation: `${panelSnapshot.authority.releaseId} release AGENTS.md 是当前默认入口；dirty source 不是活动规则。` },
    { name: "合同 Catalog", responsibility: "根据触发 metadata 找到正确合同、Owner、Provider、schema 和 validator。", implementation: "Catalog 只做路由，不加载正文、不运行 Provider，也不决定是否授权。" },
    { name: "三控制面上下文", responsibility: "跨 .agents、Git 和 PCConfig 时提供最小 metadata 视图。", implementation: "两个零正文视图，先返回路径、SHA、大小和 Owner，再按影响展开。" },
    { name: "E rules activator", responsibility: "证明并激活 current/previous E release。", implementation: "测试、PRIVATE main commit/remote readback、五哈希、UAC expected-pointer CAS、ACL 和正式回读；不创建后台组件。" },
    { name: "E release store", responsibility: `保存 immutable E80–${panelSnapshot.authority.releaseId} 规则版本、release record 和 current pointer。`, implementation: "SYSTEM-owned 封闭 ACL；普通用户和 Administrators 只读执行。" },
    { name: "运行与临时目录", responsibility: "把 AI 工作台运行根、数据库和任务临时文件从系统盘移到 E 数据/缓存盘。", implementation: "运行根只有一份，C 盘仅兼容 junction；每个任务使用独立 E 缓存目录，结束只清自己的命名空间。" },
    { name: "CoreGoal 授权", responsibility: "把一次人类确认固定为长期目标，同时允许实现、修复和恢复继续推进。", implementation: "CoreGoalCommitment 加每个现实 effect 的短时单次 StepCapability。" },
    { name: "Execution Owner Registry", responsibility: "协调多个任务对项目最小 scope 的 Claim、Add、Transfer、Release 和恢复。", implementation: "Expected revision CAS 加 append-only transition journal。" },
    { name: "原生代理路由门", responsibility: "验证 model（模型）、effort、root/child 身份、E release/commit/ruleset 和合同 SHA 后才允许 spawn。", implementation: "宿主事件注入身份，创建前再检查 TOCTOU；它不替模型选择 0–10、家族或 scope。" },
    { name: "Personal Skill 供应链", responsibility: "维护 Skill canonical source（能力唯一源码）、安装意图、发现 junction（目录联接）、事务回滚和六层证据。", implementation: "一个 registry（登记表）、两个 canonical roots（唯一维护根目录）、事务 installer（安装器）和 recovery capsule（恢复胶囊）。" },
    { name: "Control Plane Doctor", responsibility: "按用户点名的 Owner 做只读健康、漂移、迁移和恢复检查。", implementation: "只调用被选中的 Provider；需要修复时退出 Doctor 并交给真实 Owner。" },
    { name: "测试与复杂度预算", responsibility: "统一登记本地与跨 Owner 测试，并限制活动树中的文件、字节和历史副本。", implementation: "Test registry、Local/Cross-owner scope 和 repository bloat budget。" }
  ],
  usageExamples: [
    { ask: "比较几个方案，给我净收益最好的一个。", effect: "模型自己选择调查、工具和验证深度，不机械套头脑风暴模板。" },
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
    { date: "2026-08-29", commit: "157060f–2940443", result: "退役 C 盘规则 Publisher/Authority 生产链，建立 E release、跨项目 coordination、差异驱动快速验证和分阶段墙钟回执；随后把 AI 工作台运行根、数据库与任务 temp 迁到 E 数据/缓存盘，C 盘只留兼容 junction。" }
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
    example: "例如项目规则要求使用自己的验收脚本，而全局习惯偏好另一套测试。这个模块会让项目规则继续决定本项目怎么验收，而不是用全局偏好替换。",
    result: "任务会从正确规则和事实来源开始；来源冲突无法同时满足时会明确停止并说明冲突，不会拼接一个看似合理的答案。",
    readerStates: { pass: "项目规则、全局规则和事实责任源一致时，按项目真实命令继续。", problem: "规则或来源冲突时停止受影响步骤，列出冲突双方和需要谁裁定。", unavailable: "必要规则或事实责任源不可读时，依赖它的结论保持未知；不拿旧报告或记忆补齐。" },
    decisionImpact: ["项目有更具体规则时，优先按项目规则执行。", "需要 Git 或机器动态事实时，改去对应控制面现场读取。", "只有当前问题真正触发时才展开专项合同。", "来源冲突无法同时满足时停止，不用猜测拼接。"],
    problem: "当全局要求、项目规则、历史文档和现场状态同时存在时，必须有一套稳定方法判断谁拥有事实、哪一层优先，否则模型会把旧报告当规则、用全局原则覆盖项目业务，或者一次性加载所有材料后丢失注意力。",
    implementation: [
      "根规则只保留跨项目元规则和硬边界；保护、授权、三控制面和能力选择分别下沉到专项合同。",
      "项目根到当前目录链上的最近规则拥有业务语义、真实命令、兼容和发布边界；全局规则只能取交集或收紧。",
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
    teaser: "根据任务价值选择工具、Skill、插件、运行时和并行方式，而不是机械套流程。",
    status: "已落地；身份门禁与路由回归通过",
    statusTone: "pass",
    value: "避免每个任务都套同一流程、错过现成能力，或为了看起来复杂而引入不需要的插件、运行时和子代理。",
    why: "读取文件、转写录音、修复代码和跨项目审计需要的能力不同。机械套同一流程会变慢、用错工具，也可能把本可独立的工作全部串行。",
    example: "例如同时处理录音转写和网站内容审计：录音交给中文语音识别，内容审计由独立代理完成；如果两项会改同一文件，则不并行写入。",
    result: "每个任务使用与目标匹配的工具和并行方式；没有实际收益时不安装插件、不新建运行时，也不开多余代理。",
    readerStates: { pass: "能力、授权和并发收益明确时，选择最合适的工具或代理并继续。", problem: "出现写冲突、资源争用或收益不足时，减少并发、改为串行或直接使用主任务。", unavailable: "所需能力确实不存在或入口不可用时，报告精确缺口；不静默换账号、换模型或伪装完成。" },
    decisionImpact: ["简单问题可以直接完成。", "存在稳定窄能力时改走对应 Skill（能力入口）或 Owner（责任源）入口。", "独立支路有质量或时间净收益时决定 0–10 个子代理。", "原路线真实缺失或失败后才降级，不先假设做不了。"],
    problem: "工具、Skills、插件和模型很多，真正困难的不是有没有，而是当前任务是否值得使用、会不会扩大范围、是否有更直接的 owner 入口，以及并行是否真的节省时间。固定模板会让简单任务膨胀，也会让复杂任务错过可用能力。",
    implementation: [
      "model intuition precedence 让模型根据目标、风险、信息增益、延迟、耦合、可逆性和净收益选择方法。",
      "Skill、Plugin、模板和计划默认只是建议性制品，不能凭正文里的 MUST 自行升级为硬门。",
      "初始工具列表不是能力上限；先查 owner adapter、固定 CLI/API 和当前 metadata，确认实质缺口后才降级或建议插件。",
      "原生委派先验证 model（模型）、effective effort（实际思考等级）、root/child role、E release、Git commit、五文件 ruleset 和合同 SHA，再判断 0 到 10 个直属代理。",
      "change_surface_validation 按现实风险和 diff 影响面选择 focused 或 standard 验证；E rules 快速发布目标 180 秒内并分列测试、Git、push/readback、UAC activation 墙钟。",
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
      "账号、插件、管理员权限令牌和子代理都不能绕过 Owner（责任源）或 effect（外部现实动作）边界",
      "不为假想未来预装动态配置服务、兼容层或第二套 Provider（服务入口）",
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
      "NativeEconomyRoutingGate 验证 E identity 先行、家族/effort 上限和触发重判",
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
    statusTone: "pass",
    value: "防止“用户让我做事”被误解成任何代理都能对任何对象任意写，也防止多个任务同时改同一范围或任务结束时遗失未完成义务。",
    why: "用户同意一个目标，不等于所有代理都能无限扩大范围；多个任务同时修改同一文件，也可能互相覆盖或各自误报完成。",
    example: "例如用户要求重建并发布网站。当前任务可以编辑、测试和正常推送这个网站，但不能因此去改另一个仓库；若另一个任务正在改同一文件，必须先解决施工范围冲突。",
    result: "每一步都能回答谁获得了什么授权、谁正在改哪一块、是否完成远端回读；未完成义务会随检查点移交，不会在任务结束时消失。",
    readerStates: { pass: "目标、授权和施工范围明确且没有重叠 Owner 时，执行、验证和正常收口可以连续推进。", problem: "发现重叠施工、目标扩大或步骤事实漂移时，停止对应写入并重新协调或派生步骤。", unavailable: "授权事实或 Owner registry（施工登记表）不可验证时，外部写入和受保护动作停止；只读调查可以继续。" },
    decisionImpact: ["本机低风险可逆操作可直接继续。", "外部现实动作未授权时停止。", "有重叠 Owner 时不绕过，先协调或等待一次。", "目标扩大时建立 successor，不拿旧授权硬套。", "有 residual 时必须带 checkpoint 移交，不能直接完成。"],
    problem: "用户说要完成一件事，不等于任何代理都能对任何对象执行所有动作。系统必须区分用户授权、操作系统权限、最高权限身份、目标是否仍是原目标、施工范围是否被别人占用，以及动作完成后是否有正式回读。",
    implementation: [
      "低风险、可逆、范围内的本机读取、编辑和测试直接推进；消息、外部写入、发布、部署和付费需要明确授权。",
      "CoreGoalCommitment 冻结目标、范围、禁止项和停止条件，不冻结计划、代码、执行器或后续 epoch。",
      "每个现实步骤使用短时、单次、防重放的步骤能力，绑定 effect、目标、pre/post、回滚和 executor。",
      "scoped execution owner（范围化施工责任）用 expected revision CAS（预期修订号比较后交换）认领最小 scope（施工范围）；纯只读审计不需要排他绑定。",
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
      "UAC（Windows 管理员确认）只提升 Windows 进程权限，不扩大任务授权",
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
      `${panelSnapshot.authority.releaseId} release descriptor 确认授权合同路径、SHA 和 bytes 来自同一 ruleset`,
      "ExecutionOwnerRegistry 聚焦回归验证 Claim/Add/Transfer/Release 语义",
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
    example: `当前 ${panelSnapshot.authority.releaseId} 根据 change surface 选择快速或标准验证；通过 PRIVATE main 回读和五文件 SHA/ruleset 后，再用同一 UAC expected-pointer CAS 激活。快速路线不能修改保护合同、Activator、ACL、Hook、Owner Registry 或身份/授权边界。`,
    result: `我得到 ${panelSnapshot.authority.releaseId}、commit ${panelSnapshot.authority.gitCommit.slice(0, 7)}、五文件 path/SHA/bytes、ruleset、pointer revision ${panelSnapshot.authority.pointerRevision}、previous ${panelSnapshot.authority.previous?.release_id || "无"} 和 source checkout 状态；C 盘只剩历史材料。`,
    readerStates: { pass: "E current pointer、release record、五文件闭包和 remote-main 可达性验证时，按当前 E release 工作。", problem: "source dirty 或已进入下一候选时，活动 E release 继续有效，同时把未激活路径和当前源码测试单独标为 repair。", unavailable: "E pointer 或五文件哈希不可验证时只关闭依赖规则身份的动作，保留 current/previous；绝不回退到 C 盘。" },
    decisionImpact: [`Rules 页面当前显示 ${panelSnapshot.authority.releaseId}，不再显示 generation 79 或 candidate/productionActivation。`, "dirty source 是未激活施工，不能覆盖 frozen release。", "C Authority unavailable 不再阻塞 Hook、spawn、Skill、Owner CAS 或普通项目。", "小而已知的规则 diff 可走 change-surface fast validation；触及保护/身份/Owner 等边界自动回标准路径。", "人类因子是否需要仍由最高权限智能体按现实影响判断。"],
    problem: "如果网页把 dirty source 当 current，就会把未完成施工冒充规则；如果继续读取 C Authority，又会让已退役平台影响当前任务。模块必须同时展示 E current、source candidate 和 C recovery-only 三层。",
    implementation: [
      "Invoke-EAgentRulesRelease.ps1 是唯一 activator/reader，current-rules.json 记录 current/previous、pointer revision 和 release record commitment。",
      `每代 release 固定五份 logical id、relative path、bytes、SHA、PRIVATE main commit 和 ruleset SHA；当前 ${panelSnapshot.authority.releaseId} 绑定 ${panelSnapshot.authority.gitCommit.slice(0, 7)} 与 ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…。`,
      "release 目录和 pointer 关闭 ACL 继承，由 SYSTEM 拥有；普通/管理员编辑器只读执行，Activator 临时写后恢复封闭 ACL。",
      "E82 新增非常见英文中文括注、系统级反膨胀、语义保真和 projectless 默认；E83 增加 coordination_id 跨项目精确 scope；E84–E86 增加 change-surface validation、FastRelease 确定性回执与分阶段墙钟预算；E87 完成运行根与任务临时目录迁移语义；E88 扩展未来模型家族和 Ultra 路由；E89 明确 CI 只在影响交付、发布、兼容或用户决策时运行，否则不跑、不设门。",
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
      `本轮根任务为 gpt-5.6-sol / max，实际创建 2 个 Luna Max、1 个 Terra Max 和 1 个 Sol Max 审计支路；四条支路只读审计同一网站目标，写入仍由根任务统一集成`
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
    example: "例如新增 Token 预算能力：先登记唯一源码和安装意图，再创建发现入口；随后必须由全新任务实际发现并计算一次，才能分别证明安装和使用路径。",
    result: "每个能力都会显示源码、安装、当前任务、全新任务和端到端证据；某一层缺失时只标记该层未知，不用绿色总状态掩盖。",
    readerStates: { pass: "源码、安装事务和对应运行证据各自通过时，只把已证明的层标成通过。", problem: "发现源码漂移、安装事务未闭合或新任务不可发现时，只阻断该能力的对应层并给出恢复入口。", unavailable: "唯一源码或安装 Provider（现场读取器）不可用时，该 Skill（能力）显示不可用或未知；不从旧回执和残留目录倒推正常。" },
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
    teaser: "只加载会改变决定的事实，并把设计、源码、运行、发布和用户结果分开证明。",
    status: "三控制面视图与 36/36 合同覆盖均通过",
    statusTone: "pass",
    value: "避免一次加载过多上下文让模型注意力丢失，也避免用“代码存在”“测试通过”或“部署返回成功”代替用户真正能用。",
    why: "长任务会经历压缩、交接和外部状态变化；源码、测试、安装、发布和用户可见结果又分别证明不同事情。把它们混在一起最容易误报完成。",
    example: "例如网站本地构建通过，但 GitHub Pages 在 Linux 上因中文路径失败。这个模块会保留“本地构建通过”和“公网发布失败”两个独立结论，而不是宣称网站已完成。",
    result: "任务在压缩或交接后仍能从正确来源恢复；完成报告会明确每层已证明什么、还缺什么，以及用户现在能否真正使用。",
    readerStates: { pass: "所需责任源可读且各证据层一致时，形成可重建的当前结论并继续任务。", problem: "摘要、源码、运行态或外部回读冲突时，以现场责任源为准，并把冲突层单独标出。", unavailable: "某个必要责任源不可读时，只把依赖它的结论标成 Unknown（证据不足）或阻断；不恢复退役中央系统补答案。" },
    decisionImpact: ["普通单项目问题不进入全景控制面。", "跨 Owner（责任源）决策先读 metadata（元数据），再展开必要正文。", "证据缺失或过期时降为 Unknown（证据不足），而不是 PASS（通过）。", "设计、Git（版本管理系统）、机器运行和外部 read-back（正式回读）分开验证。"],
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
      "Cross-control coverage（跨控制面覆盖）当前为 36/36，finding_count=0；以后新增合同仍必须单独回归",
      `当前 source 的 fresh full Local 结果见验证矩阵；它只证明当前施工回归，不替代 ${panelSnapshot.authority.releaseId} frozen release identity。`
    ],
    relation: "这个模块把其他五个模块的结论放进正确证据层，并保证长任务和更新快照时不会靠记忆续写。"
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
      question: "日常任务先遵循什么，哪一类事实由谁负责？",
      owner: ".agents",
      sha256: currentRuleBinding("agents_root_rules").sha256,
      bytes: currentRuleBinding("agents_root_rules").bytes,
      characters: currentRuleBinding("agents_root_rules").characters,
      lines: currentRuleBinding("agents_root_rules").lines,
      sourcePath: "E:\\.agents\\AGENTS.md",
      releaseRelativePath: "AGENTS.md",
      purpose: "所有任务的默认总入口。它定义 E 规则权威、指令优先级、事实 Owner、模型自治、授权总边界、Git 与验证习惯，以及私人领域固定路由。",
      plainLanguage: "当前规则只认 E:\\.agents 的 E release；先确认谁拥有答案，再在安全边界内把事情办完，不拿旧 C 盘材料、流程或全局规则冒充当前结果。",
      why: "一个任务可能同时出现用户本轮要求、项目规则、全局默认和旧记录。没有固定优先级，AI 会把旧计划当现行命令，或者用全局习惯覆盖项目真实做法。",
      example: `例如当前先验证 ${panelSnapshot.authority.releaseId}、commit ${panelSnapshot.authority.gitCommit.slice(0, 7)} 和五文件 ruleset，再读取项目规则；C Authority 即使 unavailable 也不能阻塞普通任务或原生委派。`,
      result: "AI 会从同一 E release、正确项目规则和事实来源开始；冲突不能同时满足时停止相关动作，旧 C 盘 generation、Publisher 或 epoch 不再成为 fallback。",
      readerStates: { pass: "E release、当前请求、最近项目规则和事实责任源一致时，按项目真实流程继续执行。", problem: "规则冲突无法同时满足时，停止受影响动作并说明冲突、owner 和恢复入口。", unavailable: "E release 或必要事实来源不可读时，不用 C 盘历史和旧计划补齐；依赖它的动作停止，普通安全工作保留。" },
      scope: ["所有项目任务和无项目任务", "root（根代理）与 child（子代理）", "具体项目规则之外的跨项目元规则"],
      decisions: [
        "E 代号、PRIVATE main commit、五文件 SHA 和 ruleset 是否构成当前活动规则",
        "system（系统指令）、developer（开发者指令）、本轮用户、最近项目规则、全局规则和记忆之间怎样排序",
        "Agent、Git、机器和业务事实分别回到哪个 Owner",
        "什么工作直接推进，什么动作需要授权或进入受保护合同",
        "怎样保留已有改动、分层验证并收口个人仓库",
        "健康、微信、录音、扫描件、秘密和 Vault 应走哪条窄入口"
      ],
      allowed: ["范围内低风险本机工作直接推进", "E identity 可信时按净收益选择 0–10 个原生代理", "授权已明确时完成验证、发布和回读", "保留 dirty work 并定向提交"],
      forbidden: ["读取 C 盘历史作为规则权威或准入", "用全局规则覆盖项目业务", "把历史报告或记忆当活动权威", "无可信身份时委派", "用测试或字段冒充产品结果", "恢复已退役中央个人上下文"],
      process: ["Inspect 当前 E release 并核对五文件闭包", "读取最近项目规则", "确定目标与事实 Owner", "按触发读取专项合同", "实施并分层验证", "用人话报告现实结果"],
      failure: ["规则冲突无法同时满足时停止并说清冲突", "委派身份缺失只关闭委派，主任务继续", "授权不清时停止外部 effect，但继续安全调查", "Git 未收口时分别报告业务和 Git 状态"],
      sections: [
        { title: "优先级与事实 Owner（责任源）", paragraphs: ["活动规则只来自同一 E release：递增 E 代号、PRIVATE main commit、五文件 bytes/SHA 和 ruleset SHA。dirty source 与 C 盘历史都不是活动规则。"], items: [".agents：Agent（智能体）行为、授权、E rules release、能力路由和个人 Skills（能力入口）", "Git 控制面：仓库身份、可见性、分支、同步和发布", "PCConfig：机器路径、运行时、任务、备份和恢复", "AI 工作台运行根/数据库在 E 数据盘，C 盘只留兼容 junction；任务 temp 在 E 缓存盘独立目录", "具体项目：业务、领域数据、启动和测试"] },
        { title: "模型自治与复杂度", paragraphs: ["模型按照目标、风险、信息增益、可逆性和净收益选方法；原生委派在 E identity 可信后按任务语义选择 Luna/Terra/Sol 与 0–10。"], items: ["Skill（能力入口）和模板默认是建议，不是硬门", "官方 App 版本和 versioned path 不得成为准入", "只抽象真实重复和 owner（责任方）边界", "长任务保留可重建状态，短任务不制造文档债"] },
        { title: "授权、Git 与验证", paragraphs: ["本机可逆工作直接做；外部 effect（现实动作）需要明确授权。E release 激活是 UAC expected-preimage CAS，不经过旧 Publisher、人类因子或 CoreGoal。"], items: ["不覆盖用户已有改动", "force-push（强制推送）不在默认授权内", "source（源码）、test（测试）、install（安装）、publish（发布）、fresh task（全新任务验证）与 E2E（端到端验证）独立", "个人仓库必须由远端默认分支回读"] },
        { title: "私人领域与供应", paragraphs: ["中央个人知识入口已退役；持续需求通过健康、微信、原件、录音、OCR、秘密和 Vault 等小型独立入口处理。"], items: ["Personal Skills 的 source 只在 E:\\.agents\\skills 和 plugins", "用户目录只是 discovery junction", "动态事实由真实 owner 现场提供", "新规则原位升级，不堆补丁"] }
      ],
      relation: `它是 ${panelSnapshot.authority.releaseId} 默认入口；其余四份规则分别拥有 E release/重大动作保护、授权、跨控制面取证和能力选择的完整语义。`
    },
    {
      logicalId: "protected_major_actions_contract",
      title: "重大动作保护",
      question: "高影响动作什么时候允许、暂停、拒绝或进入恢复？",
      owner: ".agents",
      sha256: currentRuleBinding("protected_major_actions_contract").sha256,
      bytes: currentRuleBinding("protected_major_actions_contract").bytes,
      characters: currentRuleBinding("protected_major_actions_contract").characters,
      lines: currentRuleBinding("protected_major_actions_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.protected-major-actions.md",
      releaseRelativePath: "docs\\contracts\\agents.protected-major-actions.md",
      purpose: "唯一拥有 Agent 侧重大动作判断、E 规则 release 和真人因子前生产等价 rehearsal 的合同；动态机器状态仍回到各自 Owner。",
      plainLanguage: "现行规则只认 E:\\.agents PRIVATE main 的递增 E release。C 盘 generation、Publisher、签名、anchor、manifest、ledger 和回执全部只作恢复材料，不能准入、fallback 或阻塞普通工作。",
      why: "规则必须可编辑，也必须能明确证明当前是哪五份字节。把可编辑工作树直接当活动规则会漂移；继续维护 C Publisher 又会让规则链膨胀、阻塞普通任务并与真正 Owner 过度耦合。",
      example: `当前 ${panelSnapshot.authority.releaseId} 根据 change surface 选择 fast 或 standard lane，再完成 PRIVATE main readback、五文件 hash 和 UAC current/previous 切换；fast lane 复用同一硬门。`,
      result: `我能直接看到 ${panelSnapshot.authority.releaseId}、commit、五文件 SHA、ruleset、current pointer 和 previous；活动规则可回退且不可被普通编辑器直接改写。`,
      readerStates: { pass: "E release pointer、PRIVATE main commit、五文件闭包和 ACL/read-back 验证时，按该 E 代规则继续。", problem: "source dirty 或下一候选尚未激活时，current E release 保持不变；dirty 不成为活动规则。", unavailable: "E current pointer 或五文件哈希不可验证时，只关闭依赖规则身份的动作并保留 current/previous；不得回退到 C 盘。" },
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
      question: "授权覆盖到哪里，谁可以施工，怎样证明动作完成？",
      owner: ".agents",
      sha256: currentRuleBinding("authorization_delegation_contract").sha256,
      bytes: currentRuleBinding("authorization_delegation_contract").bytes,
      characters: currentRuleBinding("authorization_delegation_contract").characters,
      lines: currentRuleBinding("authorization_delegation_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.authorization-delegation.md",
      releaseRelativePath: "docs\\contracts\\agents.authorization-delegation.md",
      purpose: "唯一拥有用户授权、CoreGoal、委派收窄、Execution Owner、跨项目 coordination_id、可信目标、E rules 精确 scope release 与 Git 收口的合同。",
      plainLanguage: "把一句用户目标拆成授权、目标身份、施工范围、单次步骤和正式回读；E release、Owner CAS、UAC 和人类因子各自证明不同事情，C 盘历史不能参与 Owner 恢复。",
      why: "用户同意完成一个目标，不代表任意代理都能扩大到其他仓库；多个任务同时修改同一范围，也会覆盖彼此工作或丢失未完成事项。",
      example: "例如用户要求刷新并发布网站。本轮对象、内容和发布动作已经明确，因此可完成编辑、定向提交、normal push、Pages 部署和公网回读；effect 边界仍要实时重验 PUBLIC 目标与默认分支。",
      result: "每一步都能回答谁获得了什么授权、谁正在修改哪一块、远端是否真的收到结果；未完成事项必须移交或继续持有，不能直接消失。",
      readerStates: { pass: "授权、目标和施工范围都明确时，同一目标内继续实施、验证、正常推送和正式回读。", problem: "Owner 冲突、目标扩大或步骤事实变化时，停止对应写入并重新协调或取得新确认。", unavailable: "授权事实或施工登记不可验证时，外部写入停止；不会用管理员权限、子代理或超时猜测替代授权。" },
      scope: ["本机工作与 external effect（外部现实动作）", "root（根代理）和 child（子代理）委派", "长期无人值守目标", "多任务施工与 Git 收口", "PRIVATE（私有）、PUBLIC（公开）和未知目标"],
      decisions: ["当前请求是否已授权现实 effect", "是否需要 UAC 但不扩大授权", "目标是否仍是已登记目标", "谁拥有最小施工 scope", "显式跨项目目标是否使用同一 coordination_id 且逐项目隔离", "E rules release 的变化对应哪些精确 logical-id scope", "Git、发布和 external effect 是否真正收口"],
      allowed: ["低风险本地工作直接做", "同一 active goal 内重派生步骤", "现有 upstream 定向 commit 和 normal push", "可信私有目标内按任务需要保真"],
      forbidden: ["child（子代理）、shell（命令行）、worktree（工作树）或 UAC（管理员确认）扩权", "绕过重叠 Owner（施工责任）", "用 timeout（超时）或自制 evidence（证据）恢复 Owner", "无明确门禁 force-push（强制推送）或新公开", "把 trusted（可信目标）当已授权"],
      process: ["解析 effect（外部现实动作）", "解析 registered target（已登记目标）", "确认授权或 CoreGoal（长期目标授权）", "Claim（认领）最小 scope（施工范围）", "执行边界重验目标", "执行并 read-back（正式回读）", "Git/Pages 收口", "Release（释放）或 Transfer（移交）"],
      failure: ["步骤漂移：废弃并重派生", "目标扩大：建立 successor 并重新确认", "Owner 冲突：一次有界协调", "E release scope 与五文件 descriptor 不符：拒绝激活", "Git 非 fast-forward：停止并解决同步", "Residual 未移交：保持 lease"],
      sections: [
        { title: "授权与提权", paragraphs: ["本机可逆工作直接推进；external effect（外部现实动作）要有明确授权。Windows Medium integrity（中等完整性权限）不表示管理员能力不存在，UAC（Windows 管理员确认）只解决操作系统进程权限。"], items: ["当前请求明确对象、内容和动作即可授权", "实际 publish/deploy 边界重新解析 registered target", "不自动扩到新账号或新公开面", "委派边界只能收窄", "项目规则继续拥有业务语义"] },
        { title: "CoreGoal 与步骤能力", paragraphs: ["CoreGoal 固定目标、范围、禁止项和停止条件，不冻结计划、代码或 executor。每个 effect 使用短时、单次、防重放的步骤能力。"], items: ["实现漂移不要求重新人类确认", "目标扩大才建立 successor", "步骤能力绑定 pre/post 和回滚", "四类人类因子全部丢失时不能自举"] },
        { title: "Execution Owner", paragraphs: ["Owner 只协调施工，不产生授权和事实。默认一个任务只持有一个项目；用户明确跨项目目标时用同一 coordination_id 逐项目 Claim 精确 scope，各项目仍独立 CAS、授权、回读和 Release。"], items: ["纯只读审计不 Claim", "禁止 whole_project 与授权串用", "child 不继承 coordination", "已有重叠 Owner 不能绕过", "未完 residual 必须随 checkpoint 移交"] },
        { title: "E release、Git 与可信目标", paragraphs: ["E rules release 从同一 commit 的五个 descriptor 推导精确 scope；Git 实施默认含定向提交和正常推送，个人仓库结果必须从真实默认分支可达并由远端回读。"], items: ["E activation 不消费 CoreGoal 或旧 Publisher 权限", "force-push 不在默认授权", "PUBLIC 暴露检查失败时停止", "PRIVATE 不意味着可以泄露 secret", "不完整副本不能称完整备份"] }
      ],
      relation: "它拥有现实 effect 的授权、施工责任、E release 精确 scope 和 Git/Pages 收口；能力合同决定怎么做，保护合同决定 E release 与重大动作保护。"
    },
    {
      logicalId: "four_base_decision_context_contract",
      title: "三控制面决策上下文",
      question: "跨 .agents、Git 和 PCConfig 时去哪里取证？",
      owner: ".agents",
      sha256: currentRuleBinding("four_base_decision_context_contract").sha256,
      bytes: currentRuleBinding("four_base_decision_context_contract").bytes,
      characters: currentRuleBinding("four_base_decision_context_contract").characters,
      lines: currentRuleBinding("four_base_decision_context_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.four-base-decision-context.md",
      releaseRelativePath: "docs\\contracts\\agents.four-base-decision-context.md",
      purpose: "跨控制面架构、运行治理和长期演化的 metadata 入口。兼容 logical id 保留旧名称，但现行只有三个控制面。",
      plainLanguage: "只有跨 Owner（责任源）的事实会改变决定时才展开全景；规则事实从同一 E release 读取，Git 和机器事实回到各自 Owner，绝不读取 C 盘旧 authority 补上下文。",
      why: "Agent 规则、Git 仓库和本机配置分别由不同项目维护。把所有事实塞进一个总库会过期，也会让一个项目越权解释另一个项目。",
      example: "例如发布本机服务时，仓库是否公开从 Git 总索引读取，端口和计划任务从 PCConfig 读取，AI 的授权规则从 .agents 读取。",
      result: "任务只读取会改变决定的那部分事实，并保留每条结论的责任来源；某个来源不可读时只阻断依赖它的结论，不回退到旧中央系统。",
      readerStates: { pass: "所需控制面都可读时，按责任来源组合最小上下文并继续当前决定。", problem: "不同责任源给出矛盾事实时，分别保留并交给真正 Owner 复核，不把它们合成一个答案。", unavailable: "某个必要控制面不可读或 schema（数据结构）无效时，依赖它的跨项目结论阻断；不恢复历史中央系统补数据。" },
      scope: ["跨控制面架构评审", "运行治理", "全局演化", "Owner 关系和合同覆盖"],
      decisions: ["当前需要哪个控制面的事实", "是否只需 metadata 还是要展开正文", "设计、Git、机器和 external receipt 应怎样分开验证", "是否真的出现需要新基座的稳定需求"],
      allowed: ["零写获取 metadata", "从 E current release 读取规则路径与 SHA", "按影响展开 owner 正文", "必要时联动三个 Owner"],
      forbidden: ["把兼容名称理解成第四控制面", "读取 C 盘旧 authority/generation/Publisher/epoch", "恢复已退役中央上下文", "复制私人正文和巨大快照", "用 dirty source 冒充 E current", "用合同设计证明 runtime"],
      process: ["确认跨 Owner（责任源）事实会改变决定", "列出视图和 owner（责任方）", "选择 operations governance（运行治理）或 global evolution（全局演化）", "读取 primary metadata（主要元数据）", "按影响展开 conditional（条件内容）", "独立验证各层"],
      failure: ["schema 无效：BLOCK", "E release 五规则闭包不完整：BLOCK", "required owner 缺失：BLOCK", "primary 不可读：BLOCK", "修正确 Owner，不回退 C 盘或历史中央系统"],
      sections: [
        { title: "现行边界", paragraphs: ["现行控制面只有 .agents、Git 总索引和 PCConfig；具体项目继续拥有业务语义。文件名里的 four-base 只是兼容标识。"], items: [".agents：Agent 行为、授权、能力路由", "Git：仓库身份、可见性、分支、同步、发布", "PCConfig：机器路径、运行时、任务、备份、恢复", "具体项目：业务和产品结果"] },
        { title: "入口与证据", paragraphs: ["入口只返回 Owner（责任源）、E release path、content SHA、大小和 Token（模型计数单位）估算；不复制无关正文、不运行动态 Provider（现场读取器）、不建共享数据库。"], items: ["先 metadata（元数据）后正文", "活动规则从同一 E release 解析", "dirty source 不是 current", "设计、Git（版本管理系统）、机器和 Adapter receipt（适配器回执）分开验证", "普通单项目任务不机械进入全景"] },
        { title: "退役边界", paragraphs: ["历史中央系统及其冻结文档不是控制面、默认个人上下文或运行产品。备份对象存在也不会恢复它。"], items: ["不调用旧 context、beacon 或 probe", "不读取历史私人数据库和媒体", "历史命名不是新基座理由", "新基座必须有独立稳定 owner、生命周期和恢复边界"] }
      ],
      relation: "它只选择跨 Owner 证据，不提供业务答案、不授权 effect，也不证明发布完成。"
    },
    {
      logicalId: "capability_routing_contract",
      title: "能力路由",
      question: "应该用哪个 Skill、工具或代理，什么时候并行或降级？",
      owner: ".agents",
      sha256: currentRuleBinding("capability_routing_contract").sha256,
      bytes: currentRuleBinding("capability_routing_contract").bytes,
      characters: currentRuleBinding("capability_routing_contract").characters,
      lines: currentRuleBinding("capability_routing_contract").lines,
      sourcePath: "E:\\.agents\\docs\\contracts\\agents.capability-routing.md",
      releaseRelativePath: "docs\\contracts\\agents.capability-routing.md",
      purpose: "唯一拥有方法选择、上下文路由、复杂度治理、动态配置准入、reader routing、原生经济委派和按需插件语义的合同。",
      plainLanguage: "不机械套 Skill（能力入口），不因工具列表短就宣布做不了；先找已有 Owner 和原生入口。原生委派先验证 model/effort/root 与同一 E release identity，再按任务语义选择 0–10 个 Luna/Terra/Sol 后代。",
      why: "不同任务需要的工具和并行程度不同。机械套同一流程会用错能力、重复安装工具，或开出很多代理却没有人负责最终结果。",
      example: `例如本次刷新网页时，${panelSnapshot.authority.releaseId} 内容、快速刷新、移动端和发布准备四条只读审计支路分别交给 2 个 Luna Max、1 个 Terra Max 和 1 个 Sol Max；gpt-5.6-sol / max 根任务同时重建快照并统一写入，避免冲突。`,
      result: "任务会在可信 E identity 下选择真正有收益的工具、上下文、代理家族和数量；C Authority unavailable 不再影响委派，root 始终负责方向、合并和最终验收。",
      readerStates: { pass: "能力身份、授权和净收益明确时，选择对应工具或代理并继续，主任务保留最终责任。", problem: "出现写冲突、资源争用、结果不可独立验收或收益不足时，减少并发、改为串行或由主任务直接完成。", unavailable: "委派身份或目标能力不可用时，只关闭该次委派或能力路线；主任务继续安全工作并报告真实缺口。" },
      scope: ["所有能力选择", "长任务状态重建", "README 与项目规则路由", "动态配置设计", "原生委派和插件缺口"],
      decisions: ["当前任务值不值得使用某项能力", "应读多少上下文", "是否安装运行时或建议插件", "可信 model/effort/role/E release identity 是否成立", "应并行 0–10 个代理以及选择 Luna/Terra/Sol 哪个家族", "怎样保持代码和仓库不过度膨胀"],
      allowed: ["按净收益选择方法", "需要时安装官方稳定运行时", "verified 身份下委派", "真实能力缺口时提醒精确插件", "复杂任务建立可重建 checkpoint"],
      forbidden: ["把 Skill 指令升级成硬门", "已有入口仍提示插件", "无身份 spawn", "固定默认 child 模型", "派出高于父级 effort 或超过 Ultra 绝对上限的后代", "用顶层 task 绕过 native 拒绝", "因 C Authority unavailable 关闭 E rules 委派", "为假想未来建动态配置平台", "把 README 当默认 AI 上下文"],
      process: ["理解目标", "查 owner 和原生入口", "确认宿主或用户绑定的 model/effort/root 与 E release identity", "完整读取同 E release 的原生经济路由节", "按任务语义和 slots 决定 0–10 与家族", "缺能力再装 runtime 或建议插件", "root 与 child 并行实施并分层验证"],
      failure: ["无可信身份：只关闭委派", "E identity 变化或压缩：重读 11 条强门禁", "Provider（服务入口）缺失：报告受限，不造第二 Provider", "child（子代理）中断：优先恢复原 session（会话）", "C Authority unavailable：不影响此路径", "catalog schema（目录数据结构）无效：失败关闭"],
      sections: [
        { title: "方法与能力自治", paragraphs: ["目标、信息增益、延迟、耦合和可逆性决定方法。Skill、Plugin、模板和计划只是候选能力，不会扩大授权。"], items: ["先找 owner adapter、CLI/API 和 metadata", "实证缺失才降级", "任务必需 runtime 可从官方路径安装", "既有项目服从 lock、版本和 CI"] },
        { title: "耐久状态与代码", paragraphs: ["长任务必须可重建；代码优先内聚、单一事实源、显式接口和确定行为，不为假想未来建框架。"], items: ["Consumer 只依赖最小接口", "配置按真实需求逐级准入", "秘密只用 SecretRef", "完成计划和旧复盘由 Git 留史"] },
        { title: "Reader routing（读者路由）", paragraphs: ["人类 README（说明文档）要保持人话和最新，但不是动态权威；项目规则只承载该项目真正更具体的语义。"], items: ["用户明确询问或验收需要时才读操作指南", "过期文档是待修缺陷", "嵌套规则只在子树语义不同才存在", "现场代码、测试和 Provider（事实入口）决定实现事实"] },
        { title: "原生经济委派", paragraphs: ["现行 11 条规则先绑定 model、effective effort、root/child role 与 E release/commit/ruleset/合同 SHA，再做 0 到 10 决策；任务开始、独立支路、阻塞、steer、压缩、child 完成和槽位释放都重判。"], items: ["gpt-5.6-luna：封闭可验、读重和确定性工作", "gpt-5.6-terra：强耦合实现、深调试和架构审查", "gpt-5.6-sol：最高难度、风险、战略与终审", "宿主返回的其他 verified 模型归更强的未来模型家族，不维护型号白名单", "Sol 与未来模型可在父级上限内使用 High/XHigh/Max/Ultra；Luna/Terra 保持 Max", "家族与 effort 只能向下收窄，Root 持续负责目标、风险和最终集成"] },
        { title: "按需插件", paragraphs: ["Skill 注入、安装、账号连接、fresh task 和 E2E 是独立事实。只有能力缺口真实影响结果时才读取插件 catalog。"], items: ["已有等价入口不提示插件", "用户同意后才安装或连接", "未知 trigger 返回 not found", "catalog schema 无效失败关闭"] }
      ],
      relation: "它选择方法、上下文和 native 代理家族/数量，但不会产生授权、Owner 或 E release；这些分别由授权和保护合同拥有。"
    }
  ]
};
