import { ruleOverviews } from "./content-rule-guides.js";
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
  || !Number.isInteger(generatedPanelFacts?.skills?.publicInstallIntentCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.publicRegisteredCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.publicInactiveIntentCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.retiredSkillCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.personalSelectedCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.hostIntegratedCount)
  || !Number.isInteger(generatedPanelFacts?.skills?.selectedPublicCount)
  || generatedPanelFacts.skills.selectedPublicCount !== generatedPanelFacts.skills.personalSelectedCount + generatedPanelFacts.skills.hostIntegratedCount
  || generatedPanelFacts.skills.hostIntegratedDiscovery !== "not_rerun_by_agents_snapshot_refresh"
  || !generatedPanelFacts?.integrity?.payloadSha256
) {
  throw new Error("panel facts are missing or invalid; run npm run refresh:snapshot before build");
}

export const panelSnapshot = generatedPanelFacts;
const activeRuleSourcePath = (logicalId) => {
  const releasePath = panelSnapshot.ruleBinding.find((binding) => binding.logicalId === logicalId)?.releasePath;
  if (!releasePath) throw new Error(`current rule binding is missing: ${logicalId}`);
  return releasePath;
};
const activeRulesCatalogPath = panelSnapshot.authority.releaseRecordPath.replace(/release\.json$/, "rules-catalog.json");
const currentValidationDetail = (prefix) => panelSnapshot.validation.rows.find((row) => row.layer.startsWith(prefix))?.detail || "本轮没有取得这一层的当前证据。";
const activeRuleCount = panelSnapshot.ruleBinding.length;
const activeRuleBytes = panelSnapshot.ruleBinding.reduce((total, binding) => total + binding.bytes, 0);
const localOwnerObservation = Object.freeze({
  observedAt: "2026-09-01T04:58:47.0201761Z",
  releaseId: "E98",
  gitCommit: "e1c1e3644b6c3d2c74eeb2fd0a469444e81c7290",
  pointerRevision: 6,
  previousReleaseId: "E97",
  ruleCount: 5,
  ruleBytes: 85390,
  rulesetSha256: "2fcb55e00a416352cc680d0bb25dd9744703cb455f1d6508e249c0a68890c7a8",
  registered: 42,
  passed: 38,
  failed: 0,
  timedOut: 0,
  crossOwnerSkipped: 4,
  activeIntent: 28,
  skillTransactions: 39,
  unfinished: 0,
  invalid: 0,
  contractPassed: 36,
  contractTotal: 36,
  findings: 0
});

const agentsSnapshot = createProjectSnapshot({
  observedAt: panelSnapshot.observedAt.replace("（中国时间）", ":00+08:00").replace(" ", "T"),
  label: `${panelSnapshot.authority.releaseId} 活动规则与能力供应；${localOwnerObservation.releaseId} 历史完整回归`,
  boundary: `本轮按各来源的实际观察时间核对，当前活动规则为 ${panelSnapshot.authority.releaseId}。完整本地回归 ${localOwnerObservation.passed} pass、${localOwnerObservation.failed} fail 只属于 ${localOwnerObservation.releaseId} commit ${localOwnerObservation.gitCommit.slice(0, 7)}，另 ${localOwnerObservation.crossOwnerSkipped} 项为 cross-owner skip（跨责任源跳过）；不把旧结果继承给 ${panelSnapshot.authority.releaseId}`,
  metrics: [
    { label: "活动规则", value: `${panelSnapshot.authority.releaseId} · ${activeRuleCount}/${activeRuleCount}` },
    { label: "能力供应", value: `${panelSnapshot.skills.publicInstallIntentCount} 项` },
    { label: "全量回归", value: "未重跑" },
    { label: "合同覆盖", value: panelSnapshot.validation.rows.find((row) => row.layer.startsWith("Contract coverage"))?.status === "pass" ? "已验证" : "未闭合" }
  ],
  facts: [
    { label: "当前活动规则", value: `${panelSnapshot.authority.releaseId} · release commit ${panelSnapshot.authority.gitCommit.slice(0, 7)} · ruleset ${panelSnapshot.authority.rulesetSha256.slice(0, 8)}…；current pointer revision ${panelSnapshot.authority.pointerRevision}，previous=${panelSnapshot.authority.previous?.release_id || "无"}` },
    { label: "活动规则闭包", value: `当前 ${activeRuleCount}/${activeRuleCount} 份规则共 ${activeRuleBytes} bytes；每份活动文件与 release descriptor 的 bytes/SHA 必须一致，source 差异只作未激活候选，不能替代当前指针` },
    { label: "本地回归边界", value: `${localOwnerObservation.releaseId} 的历史完整回归不证明 ${panelSnapshot.authority.releaseId} 的全量回归；跨责任源跳过项不折算成失败或通过` },
    { label: "个人能力供应", value: "active install intent 只说明供应目标；安装事务、当前任务、全新任务和真实场景验收仍分别取证" },
    { label: "合同覆盖边界", value: "当前状态与发现项见验证层；某次覆盖通过也不代表后来新增合同自动登记。规则、授权、能力、Git 与机器事实继续由各自责任源解释" },
    { label: "产品能力", value: "自然语言目标可接到真实项目、规则、Skills 与工具；源码、测试、安装、发布、恢复和用户结果分层回读" },
    { label: "个人资料访问与操作者判断分开", value: "私人资料只看一份共享个人资料期：本机、GUI、AI 与已认证电脑 MCP 都消费同一状态和原截止，连接、管理员权限或换入口不会另发一段许可。当前默认 8 小时，可填 0.5～72 小时小数；新消息、换模型、后代和服务重开都不滑动续期，电脑重启、真实到期或本人明确锁定才使旧期资料失效。取消、拒绝或五分钟等待超时只结束这次尚未完成的验证，不撤销另一段仍有效资料期。失效后停止新的私人取用、复用与披露，并按机器实际状态安全关闭；第三方仍占用时如实写“关闭中”，不强杀、不假报已锁。个人理解库、背景经历和表达样本只用于已获许可的理解与表达，不再作为操作者身份核验来源；独立入侵、设备与磁盘保护仍走自己的判断与邀请。账号连接、模型能力和管理员权限都不自动授予 codex-root、秘密明文或磁盘权。规则生效也不等于每个真人、客户端和重启场景都完成新验收。", hero: false },
    { label: "当前规则与源码分层", value: `活动规则仍是 ${panelSnapshot.authority.releaseId} release commit=${panelSnapshot.authority.gitCommit}；current pointer revision ${panelSnapshot.authority.pointerRevision}，previous=${panelSnapshot.authority.previous?.release_id || "无"}，正式规则主题 ruleset=${panelSnapshot.authority.rulesetSha256}。当前源码 main=${panelSnapshot.sourceCommit}，branch=${panelSnapshot.sourceBranch}，${panelSnapshot.sourceSync}；源码 main 不能冒充尚未发布的下一代 E release。`, hero: false },
    { label: "当前聚焦验证与历史完整回归", value: `当前 ${panelSnapshot.authority.releaseId} commit ${panelSnapshot.authority.gitCommit} 已由活动 release Inspect 与完整发布文件哈希确认；专用 release validator 的当前状态单独按下方验证层显示，失败不能被这两层通过掩盖。当前活动规则还明确跨运行框架的能力映射、共享个人资料期、独立最高权限登记，以及受保护判断的常规 Sol High+ / 升级 Astra High+ 两档；重大后果或相关实质疑点须升级，宿主已证明合格的根可自判。资料验证五分钟请求窗口与独立保护十分钟邀请分别计算；模型与思考投入按任务质量、用户明确限制和真实支持范围选择，根或父的型号与档位不是经济硬上限。规则语义、安装检查与真实场景验收分别成立；本人理解库和浏览恢复仍来自独立更新的 Skill source。没有重跑整个 Local 测试集。最近完整观察仍为 ${localOwnerObservation.observedAt} 的 ${localOwnerObservation.releaseId} commit ${localOwnerObservation.gitCommit.slice(0, 12)}：${localOwnerObservation.passed} pass、${localOwnerObservation.failed} fail、${localOwnerObservation.timedOut} timeout，另 ${localOwnerObservation.crossOwnerSkipped} 项跨责任源跳过；合同覆盖 ${localOwnerObservation.contractPassed}/${localOwnerObservation.contractTotal}、finding ${localOwnerObservation.findings}。历史结果不升级为 ${panelSnapshot.authority.releaseId} 全量通过，短时验收也不证明长程永不偏离。`, hero: false },
    { label: "Skill 供应快照", value: `当前 Skill 供应快照于 ${panelSnapshot.observedAt} 回读公开范围内 ${panelSnapshot.skills.publicInstallIntentCount} 个 active install intent；selected public=${panelSnapshot.skills.selectedPublicCount}。Source/install/transaction 通过仍不替代 current task、fresh task 或领域 E2E。`, hero: false },
    { label: "供给与展示口径", value: `公开范围登记${panelSnapshot.skills.publicRegisteredCount}项：${panelSnapshot.skills.publicInstallIntentCount}个安装意图、${panelSnapshot.skills.publicInactiveIntentCount}个停装项，另列${panelSnapshot.skills.retiredSkillCount}个已退役入口。公开目录选${panelSnapshot.skills.personalSelectedCount}个个人入口和${panelSnapshot.skills.hostIntegratedCount}个宿主集成能力，共${panelSnapshot.skills.selectedPublicCount}项。安装、展示与真实可用数量不能互相代换。`, hero: false },
    { label: "工作树热备", value: "工作树热备 source/合同存在；2026-09-07 只读观察确认 G 卷 Healthy/OK，且 G:\\80_Backup\\ControlPlane\\agents-hot-mirror-status.json 存在。该回执最后镜像时间为 2026-07-30T20:30:07-07:00、robocopy exit=1，当时记录 source HEAD=c96dbf1、dirty=21。", hero: false }
  ],
  gaps: [
    "2026-09-08T08:12:57Z管理员完整观察与PCConfig登记89/89一致，但均没有AgentsHotMirror-Daily或Sync-AgentsHotMirror动作。该名称仍只出现在.agents可选installer中；此镜像最后回执早于当前source，最新覆盖未证，不推断其他现役备份失败，也不自动安装旧入口。"
  ]
});

const agentsRegistration = panelProjectRegistry.projects.find((item) => item.id === "agents" && item.enabled);
if (!agentsRegistration || agentsRegistration.presentation_mode !== "real_dashboard") {
  throw new Error("panel project registry must contain enabled .agents in real_dashboard mode");
}

export { panelProjectRegistry };

export const project = {
  usageEntry: "在已接入本机共同规则的 AI 工作对话中，直接说出要完成的事、项目和限制；本网页用于读懂规则与证据，实际工作仍在对话和对应工具里进行。",
  usageInputs: ["本次想达到的结果和项目", "不能改变的限制或已经做过的步骤", "涉及私人资料或外部发布时的具体范围"],
  order: agentsRegistration.order,
  slug: "agents",
  title: agentsRegistration.title,
  route: agentsRegistration.route,
  visibility: agentsRegistration.source.visibility === "PRIVATE" ? "私有仓库" : "公开仓库",
  repositoryNote: "仓库不向匿名访客开放；本面板完整介绍它的产品、规则、模块和真实验证状态。",
  cardStatus: `当前 ${panelSnapshot.authority.releaseId} 已激活；最近完整回归仍为 ${localOwnerObservation.releaseId} 历史观察`,
  cardStatusTone: "pass",
  ...agentsSnapshot,
  summary: "我不想每次重新教AI怎样理解目标、找事实、保护资料和处理并发，也不想规则反过来限制合理工作。.agents把这些共同约定组织起来：普通授权内工作直接做，有疑问去正确项目查，重要动作按实际条件处理，最后拿文件、页面和现实结果验收。具体项目继续决定自己的业务，不把所有资料和功能装进一个中央系统。",
  why: "个人 AI 任务常常一句话就横跨代码仓库、电脑配置、私有资料、外部服务和多个并发任务。没有一套共同规则，最容易出现改错项目、越过授权、覆盖别人修改，或者拿测试绿灯冒充用户已经能用。",
  plainExample: "我可以直接说：“把个人项目网站修好并发布，别覆盖其他任务的修改。”网站项目决定页面和测试，Git 总索引确认仓库、主分支与远端，.agents 判断动作是否已获授权、哪些工作值得并行。最后会分别告诉我构建是否通过、远端是否收到、公网能否打开；少一层证据，就不会说整件事已经完成。",
  result: "我拿到的是一条能追溯的交付链：事实各有来源，写入各有负责人，外部动作有明确授权；失败时知道停在哪、怎样继续，收工时也能分清本地完成、远端完成和用户真正可用。",
  readerStates: {
    pass: "目标、事实来源、授权、各自修改范围和验收方式都清楚时，任务直接推进，并分别回读本地、远端和用户能看到的结果。",
    problem: "哪里冲突或验证失败，就只停那一步，说明原因和继续办法；不依赖它的工作照常推进。",
    unavailable: "拿不到关键现场证据时，对应结论明确写成 Unknown（证据不足）；不猜路径、不脑补授权，也不拿本地成功冒充远端或用户可用。"
  },
  technicalSections: [{
    title: "独立审查与软件兼容的完整条件",
    paragraphs: [
      "长程任务在实质方案变化、压缩后重规划、同类失败循环和阶段交付前，复用一路独立子代理检查需求来源及可删实现；只拦自加目标、流程或假设，不砍真实功能，不靠缩权、限制代理或反复让用户审批工程选择治复杂化。",
      "官方更新不能只因版本号变化就被拒绝。版本、build（构建号）和版本化安装路径用于观察、复现与已测发布，不作为一般软件更新的永久准入门。兼容判断依真实稳定产品身份、签名或主体、公开接口、配置结构、事件和实际能力；更新后只暂停实测缺失的能力，普通工作继续。API或文件格式版本、锁文件、测试夹具以及用户明确选择的固定运行版仍可以严格约束；接口未知不等于通过，也不凭新版本号判失败。"
    ]
  }],
  productPrinciples: [
    {
      "title": "私人资料按一段真实期限使用",
      "detail": "本机和已连接的电脑入口共用同一段资料访问期限，当前默认 8 小时，可由本人选择 0.5～72 小时。取消或错过一次验证只结束那次请求；真正到期、本人锁定或电脑重启时才停止新的私人取用。个人经历和表达样本只在获准任务中帮助理解，不用来猜谁在操作。"
    },
    {
      "title": "换客户端也要认清真实电脑与权限",
      "detail": "AI 从电脑、桌面或已连接的外部客户端工作时，都查同一套当前规则和实际设备。某个客户端缺工具只影响那条操作；连接成功、管理员权限或模型很强，不等于能查看秘密或保护磁盘。"
    },
    {
      "title": "普通协作与最高权限分别成立",
      "detail": "Windows锁屏和私人资料解锁是不同动作，明确请求各走现有入口，不先派模型审批。只有独立入侵疑虑、设备或磁盘等重点判断，才核对已登记主体与实际模型资格。取消一次验证不新建另一套冻结；资料真实到期或本人锁定时停止新的私人取用，实际关闭结果另行回读。"
    },
    {
      "title": "共享桌面按本次动作交接",
      "detail": "文件范围不同的任务仍可能争用同一个 Chrome、鼠标键盘和前台窗口。操作前确认目标并协调占用，用完即交还；不把一次桌面操作变成永久接管电脑，也不耽误无冲突的文件工作。"
    },
    {
      "title": "把任务留下的文件也收好",
      "detail": "下载、生成、解包或复制文件时先知道用途和去向；做完后检查本任务所有落点，只保留确实还要本机使用的成品、维护资产或恢复材料。归位优先移动，临时图、失败输出和 Codex 自有目录也不能漏。原件、他人文件、在用状态不动；清理受阻继续处理并说明精确残留，不把主产物成功说成已经收完。"
    },
    {
      "title": "理解真实原意，也敢指出错误前提",
      "detail": "错字、口误和转写误差能从上下文还原时直接继续；只有会改变结果的歧义才问。AI 可以据证质疑不合适的中间要求并提出更好办法，但不能借此覆盖本人更正或删掉已经确认的功能。"
    },
    {
      "title": "短时流程在有效窗口内办完",
      "detail": "验证码将到、登录正在确认时，AI 留在当前流程主动跟进可读来源，收到后趁有效继续。等待方式由真实能力和窗口决定；不会刚开始等就设一个任意延后的任务后离开，窗口结束或来源不可读则说明真实缺口。"
    },
    {
      "title": "临时绕通不等于依赖已修好",
      "detail": "如果目标确实依赖另一个项目的缺陷，当前页面或应用跑通后，AI 仍应在已有授权与精确施工范围内修复或正式交接那个依赖。没有修好时，告诉我具体影响和接手状态，不把内部报告当成收敛。"
    },
    {
      "title": "人定结果，AI 选办法",
      "detail": "本人说清目标和限制，AI 负责研究、实施与验收，可以改进不合适的中间办法。运行环境会核对真实身份和工具调用条件，但不会替 AI 选方案，也不会替本人授权。"
    },
    {
      "title": "哪件事由谁掌握事实",
      "detail": "具体功能问项目，仓库与发布问 GitHub 总索引，电脑路径与恢复问 PCConfig。旧报告或模型记忆可提供线索，不能代替现在的现场。已冻结项目只有本人明确提出具体需求时才处理这次范围。"
    },
    {
      "title": "明确过的授权不反复索要",
      "detail": "同一目标和范围内持续推进；只有目标、账号、公开面、付费、秘密或不可逆边界变化时，才重新判断。"
    },
    {
      "title": "临时本人授权要亲自发起并设截止",
      "detail": "本人在当前 Codex 对话提出限时授权后，AI 才调出可见窗口；本人选择范围、时长并完成验证。默认只作用于当前对话，扩大到所有对话须本人主动选择；后续续聊不会重开或延长原截止。"
    },
    {
      "title": "两种验证倒计时分别看",
      "detail": "私人资料的单次验证邀请和独立设备保护有不同期限。本人可以选择已经登记的通行密钥、动态码、恢复码或账号验证；取消一条邀请不会把另一段仍有效的资料访问一起撤掉。"
    },
    {
      "title": "并行提高质量，但不覆盖别人",
      "detail": "互不依赖的工作可以并行；重叠写入用最小施工范围协调，已有改动始终保留。"
    },
    {
      "title": "完成必须分层证明",
      "detail": "源码、测试、安装、发布和用户真正可用各自证明不同事情，任何一层都不能冒充整件事完成。"
    },
    {
      "title": "来源更新后，只修会说错的页面",
      "detail": "一个项目或个人能力发布并核对之后，只检查对应页面会不会因此误导。已有网站任务负责时把更新交给它；没有负责的任务才新建一次独立网站工作。"
    },
    {
      "title": "清理任务文件时保留可恢复办法",
      "detail": "先确认文件确属本次任务、可以删除且没有唯一内容。若执行环境在命令启动前明确拒绝删除，才对同一文件改用 Windows 回收站并核对结果；占用、权限或路径错误仍按原问题处理。"
    },
    {
      "title": "Git 提交和工作文件副本各保一层",
      "detail": "私有 Git 保留已提交历史，G 盘镜像只保存当时的工作文件和未提交修改。它会在目标原地覆盖和删除，失败后必须看实际文件；目前最新覆盖仍未核实。"
    },
    {
      "title": "不知道就保留未知",
      "detail": "证据不足只停止受影响步骤，说明缺什么和怎样恢复；不依赖该问题的安全工作继续。"
    },
    {
      "title": "先检查目标有没有被悄悄加码",
      "detail": "长任务在方案变化、反复失败和交付前，请独立视角核对新增要求是否真来自本人。删掉无依据的环节，已确认的功能和质量不因此减少。"
    },
    {
      "title": "注意力质量高于上下文数量",
      "detail": "先保住目标、边界、最新证据、未知和验收，再读取会改变判断的细节；既不漏掉关键事实，也不靠堆文件和日志制造理解假象。"
    },
    {
      "title": "自然能力要用自然请求验收",
      "detail": "需要证明 AI 会自己选路时，给全新评估者普通用户目标，不泄露 Skill、工具或预期路线；同时检查它是否自主选对能力，以及用户最后是否真的拿到正确结果。"
    },
    {
      "title": "软件更新后看实际还能不能用",
      "detail": "官方更新不会仅因版本号不同就把工作全停下；只对确实缺失的接口或功能暂停对应路线。已知不兼容要说明，不能因为名字更新就猜通过。"
    },
    {
      "title": "普通本地工作不虚构对抗者",
      "detail": "本机现有用户、文件、进程、软件和私人账号空间默认可信；除非用户明确提出安全任务，不额外制造攻击模型、审计链或守护服务，正确性、可靠性和恢复仍单独做好。"
    },
    {
      "title": "私人问题直接进入对应小入口",
      "detail": "健康、私人事务文书、微信、材料、录音和扫描分别走自己的边界，不恢复中央个人画像或默认全景上下文。"
    }
  ],
  responsibilities: [
    "让不同项目的 AI 工作遵守同一套基本约定，并先听这次用户的要求和项目自己的规则。",
    "记住原范围内已经明确的授权；多人或多个任务同时改文件时，先确认各自负责哪一部分。",
    "按实际任务选择已经接入的工具、个人能力和可独立完成的协作任务。",
    "遇到可能改变设备、资料或不可恢复数据的重要动作，区分模型判断、本人验证、真实执行和最后恢复。",
    "需要检查时只查点名的问题，告诉我电脑、仓库和规则各自能证明什么。",
    "登记来源更新后，只检查对应网站说明是否需要跟着改，不把一次小变化扩成整站重做。",
    "任务结束时说明交付结果；仍有后续工作时留下接手线索。",
    "管理个人 Skills 的来源、安装和真实可用状态，包括浏览器中断后的续作。",
    "为还没提交的规则文件提供 G 盘工作副本，并明确它最近是否真的覆盖了本次修改。",
    "长任务始终核对用户原意；发现自加要求或多余实现时纠正，完整功能和真实验收仍保留。"
  ],
  exclusions: [
    "仓库身份、远端提交和网站发布结果由 GitHub 总索引核对。",
    "电脑路径、程序、计划任务、备份和恢复结果由 PCConfig 核对。",
    "具体项目自己解释业务内容、数据和怎样才算测试通过。",
    "它不收集成一份中央私人档案，也不重启已经退役的旧个人上下文系统。"
  ],
  glossary: [
    { term: "Agent（智能体）", meaning: "负责理解目标、选择方法、调用工具并交付结果的 AI 执行单元。" },
    { term: "Fact Owner（事实责任源）", meaning: "某类动态事实的唯一负责来源；文档可以指路，但不能代替它的现场回读。" },
    { term: "Project rule（项目规则）", meaning: "项目目录中的 AGENTS 规则，拥有该项目的业务语义、命令、兼容和发布边界。" },
    { term: "Control plane（控制面）", meaning: "维护一类跨项目规则或动态事实的系统；当前只有 .agents、Git 和 PCConfig 三个。" },
    { term: "E release（E 规则版本）", meaning: `递增 E 代号、PRIVATE main commit、规范文件集合 bytes/SHA 和 ruleset SHA 的不可复用绑定；当前是 ${panelSnapshot.authority.releaseId}。` },
    { term: "Canonical source（规范源码）", meaning: "E:\\.agents 当前可编辑规则源码；dirty 或未激活提交不是 current release。" },
    { term: "Current pointer（当前指针）", meaning: "E:\\.agents\\releases\\current-rules.json，原子指向 current/previous release。" },
    { term: "Ruleset SHA（完整规则集合指纹）", meaning: "按当代发布描述符把所有规范文件身份、路径、字节数和SHA-256绑定在一起，不把兼容文本排除在完整性检查之外。" },
    { term: "Release record（版本记录）", meaning: "记录版本、提交、完整文件描述符、集合指纹与远端回读；v3覆盖目录规定的正式主题、兼容引用和入口模板，历史v1/v2依原格式解释。" },
    { term: "Recovery-only C history（仅恢复的 C 盘历史）", meaning: "旧 generation、Publisher、签名、anchor、manifest、ledger 和回执可读保留，但不是当前权威或运行依赖。" },
    { term: "Runtime root（运行根）", meaning: "当前唯一 Codex 根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 已是指向它的兼容 junction（目录联接），不是第二副本。任务临时目录位于 E:\\Cache\\Codex\\Temp\\<task-id>。" },
    { term: "Activator（激活器）", meaning: "唯一执行测试、PRIVATE main 回读、五哈希、UAC CAS、pointer 切换和 ACL/read-back 的本地工具。" },
    { term: "CoreGoalCommitment（历史目标承诺）", meaning: "旧集中目标执行方案使用的承诺记录。现行规则不再要求普通任务建立它；用户已明确的目标与授权仍按原范围持续，实现方案可以调整。" },
    { term: "StepCapability（历史单步能力）", meaning: "旧方案使用的短时动作凭据。现行普通工作不以这套产品为前提，真实外部动作仍由对应入口核对目标、授权、期限与结果。" },
    { term: "无限制授权（OwnerTakeover）", meaning: "本人通过已登记验证方式，对明确范围颁发有限期限的自有规则优先授权；使用原截止，取消不影响其他已生效授权。" },
    { term: "Human-factor rehearsal（真人因子前演练）", meaning: "因子、邀请或保护产品发生实现、安装或接口变化时，按影响面验证同一生产链；日常使用只核对本次所选方式。没有指定时可选择健康的登记方式，指定方式故障不能静默改用另一种。" },
    { term: "Execution Owner（施工责任）", meaning: "协调哪个任务正在改哪个最小 scope；它不产生用户授权、管理员权限或业务事实。" },
    { term: "Durable explicit user authorization（耐久明确用户授权）", meaning: "用户已明确给出的长期授权在冻结 goal/scope 内跨轮次、压缩、root、全部后代和新顶层任务持续有效，不要求同轮重述。" },
    { term: "Lifecycle resolver（任务生命周期解析器）", meaning: "固定只读入口，证明任务是否真正 terminal、是否 archived、是否仍有 goal/queue/residual；标题、超时和归档标记不能替代。" },
    { term: "RecoverRelease / RecoverReleaseClaim（恢复释放 / 恢复并认领）", meaning: "需要证明宿主终态或接续在途责任时，按真实生命周期、命令和检查点证据恢复；无残余时释放，有残余时交给真实接续任务。日常治理中没有明确当前施工证据的遗留占用可直接治理释放，不必先取得这些接续证据。" },
    { term: "threadId / clientThreadId（真实任务标识 / 创建中回执）", meaning: "只有真实 threadId 可用于任务管理和归档；clientThreadId 只证明创建已受理。" },
    { term: "Complete goal（已完成目标）", meaning: "goal 的关闭状态；它不再构成 open residual，但仍须分别确认 queue、pending transaction、Owner 和 follow-up 都已收口。" },
    { term: "Scope（施工范围）", meaning: "Owner 认领的最小文件、模块或责任边界。不同活动任务的 scope 不能重叠。" },
    { term: "CAS（比较后交换）", meaning: "只有所选比较条件仍一致才提交变更。普通 Owner 变更优先比较本项目 bindings 指纹，恢复仍按精确全局 revision；动作核对精确 binding，避免无关项目变化造成误失效或并发覆盖。" },
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
    {
      "title": "对齐本次任务",
      "detail": "AI 将这轮要求与已做的事放在一起，区分真正想要的结果、已有授权和随时可调整的做法。"
    },
    {
      "title": "找对规则和事实",
      "detail": "AI 核对当前活动规则、项目约定及真正负责仓库或电脑事实的来源，只取这次决定需要的部分。"
    },
    {
      "title": "在授权范围内完成",
      "detail": "AI 按需要调用已接入的能力、协调文件责任和并行工作；关键权限或事实不足时只停相应步骤。"
    },
    {
      "title": "分层交付",
      "detail": "交回实际产物与可用结果，分别说明测试、安装、发布、恢复和未知项，不用一张通过回执代替整件事。"
    }
  ],
  technicalOperatingFlow: [
    { title: "先确认我到底要什么", detail: "先核对活动规则、这轮请求和最近的项目规则，把用户要的结果、更正和授权与 AI 暂定的实现方案分开。对话压缩、任务交接、连续失败或准备扩架构时，先找回原意，不沿着旧清单继续跑偏。" },
    { title: "让事实回到负责它的地方", detail: "业务听具体项目，仓库与发布听 Git 总索引，电脑路径、任务和恢复听 PCConfig，Agent 行为听 .agents；旧报告和模型记忆只能提供线索，不能替代现场。" },
    { title: "选合适的方法和并行度", detail: "能直接完成就直接做，需要专业能力就调用对应 Skill 或工具。无论任务长短，只要支路互不依赖、可以单独验收且并行净收益为正，就可以交给子代理；只有真实写冲突、授权冲突或资源争用才减并发或串行。" },
    { title: "确认能不能做、谁来改", detail: "外部动作先确认授权；已经明确的 durable grant（耐久授权）不要求同轮重述，前提成立就真实调用，并以现场的 deny、unavailable 或 error 为准。开始写入前，只认领自己需要的最小范围，避免覆盖并发修改。" },
    { title: "做完一层，验一层", detail: "长程任务到了实质方案变化、压缩重规划、失败循环或阶段交付点，由独立子代理检查有没有偷加目标，主线继续不冲突的工作。源码、测试、安装、发布、全新任务和用户结果分别取证；只删无依据增量，不停已授权目标，也不把短时通过说成永远稳定。" },
    { title: "来源发布后，只检查对应页面", detail: "登记来源发布并正式回读后，personal-panel-refresh 只判断对应快照和直接派生页面是否会因此说错。已有网站任务必须实时为 active 且当前 scope 覆盖这次发布，才把有来源、有时间的增量并入同一稳定批次；否则才新建 fresh projectless 任务。" },
    { title: "把结果说清楚", detail: "先用自然语言说明实际做成了什么、怎么用、有什么边界、还需不需要我操作，再给出会改变判断的技术证据。" }
  ],
  components: [
    { name: "全局根规则", responsibility: "跨项目优先级、E rules authority、事实 Owner、授权、Git 与验证总原则。", implementation: `${panelSnapshot.authority.releaseId} release AGENTS.md 是当前默认入口；dirty source 不是活动规则。` },
    { name: "合同 Catalog", responsibility: "根据触发 metadata 找到正确合同、Owner、Provider、schema 和 validator。", implementation: "Catalog 只做路由，不加载正文、不运行 Provider，也不决定是否授权。" },
    { name: "三控制面上下文", responsibility: "跨 .agents、Git 和 PCConfig 时提供最小 metadata 视图。", implementation: "按 Owner/DocumentId 选择 documents（主选文档）与 conditional_documents（条件文档）；条件项不预读正文或哈希，明确选择后才提升。旧视图只作兼容导航，不是两道必经门。" },
    { name: "E rules activator", responsibility: "证明并激活 current/previous E release。", implementation: "测试、PRIVATE main commit/remote readback、五哈希、UAC expected-pointer CAS、ACL 和正式回读；不创建后台组件。" },
    { name: "E release store", responsibility: "只保存当前和上一代两份已验证规则，以便原子激活与回退。", implementation: `当前 store 仅保留 current=${panelSnapshot.authority.releaseId} 与 previous=${panelSnapshot.authority.previous?.release_id || "无"}；更早 E 代留在 PRIVATE Git 历史，不在活动 store 堆积。release record、current pointer 与两代目录由 SYSTEM-owned 封闭 ACL 保护。` },
    { name: "运行与临时目录", responsibility: "让 AI 工作台的唯一运行根、数据库和任务临时文件位于 E 数据/缓存盘，同时保留旧入口兼容。", implementation: "当前唯一 Codex 根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 已是指向该根的 junction（目录联接），不是第二副本。任务 temp 使用 E:\\Cache\\Codex\\Temp\\<task-id>。" },
    { name: "长期目标与无限制授权", responsibility: "同一目标正常持续；本人需要临时接管时通过独立入口办理，不把两种生命周期混成固定紧急窗口。", implementation: "现行用户授权专题直接定义目标范围、持续同意、实际外部目标与回读，不要求普通工作先建立CoreGoal或单步能力。本人限时接管由PCConfig现役Open入口与宿主消费链负责；默认8小时、允许0.5～72小时小数，默认当前对话，扩大范围须明确选择，续作保持原截止。" },
    { name: "Execution Owner Registry", responsibility: "协调多个任务对项目最小 scope 的 Claim、Add、Transfer、Release 和恢复。", implementation: "普通变更使用 ExpectedProjectFingerprint 局部 CAS，动作使用 ExpectedBindingId 与 v2 封装；全局 revision 和追加式变更记录继续保留。治理时，没有明确当前施工或在途证据的遗留占用按精确范围 Release -GovernanceRelease，保留检查点与未完事实；这不证明进程停止或业务完成。需要实际接续执行时，RecoverRelease / RecoverReleaseClaim 仍按真实证据与精确全局 CAS 办理。" },
    { name: "原生代理路由门", responsibility: "验证 model（模型）、effort、root/child 身份、E release/commit/ruleset 和合同 SHA 后才允许 spawn。", implementation: "现有 UserPromptSubmit/SubagentStart 注入身份与用户原意提醒，PreToolUse 创建前复核；续写日志带第二 UUID 时按准确 turn_id 找当前回合，不按历史模型或文件新旧猜测。它不替模型选择 0–10、家族或 scope。" },
    { name: "Personal Skill 供应链", responsibility: "维护 Skill canonical source（能力唯一源码）、安装意图、发现 junction（目录联接）、事务回滚，以及 source、install、current、fresh、E2E 五层状态证据。", implementation: "一个 registry（登记表）、两个 canonical roots（唯一维护根目录）、事务 installer（安装器）和 recovery capsule（恢复胶囊）；transaction 是 install 层的事务证据，不另冒充一种可用状态。" },
    { name: "Browser Control Continuity（浏览控制连续性）", responsibility: "在受管浏览控制重置、运行文件缺失、异步表单或上传假完成时保留用户现场并完成真实回读。", implementation: "默认外部Chrome，本地HTML先HTTP；核对当前官方manifest/Host/installer，保留allowed_origins与不可替换的latest别名。旧Host配置指向仍存在的旧运行文件时，先与当前App配置比对，只更新四个运行路径，保留channel、代理与其他字段；二次执行保持不变，回退只消费对应修复回执。官方路线确不可用才补精确缺失的官方运行文件；从AppX复制只复制字节并验哈希。JavaScript重置不能刷新旧MCP Provider环境，恢复要由重新连接或更新GUI中的新任务验证；配置仍引用临时文件时不清理。上传和最终提交另行回读。" },
    { name: "发布后对应快照收口", responsibility: "登记来源发布完成后，只判断它对应的 wly0829.cn 快照和直接派生表面是否失真，并避免多个发布 Owner 竞争或把事件扩成全站复核。", implementation: "personal-panel-refresh 先要求 live status=active 且 current Owner scope 覆盖 publication transaction，再把 source identity + read-back commit + paths + observedAt + active generation 绑定为一个有界增量。同一 Owner 合并多个来源，在输入、E 代际、Registry revision 和负责表面仍匹配时复用证据；连贯编辑与聚焦检查完成后，一个稳定批次只运行一次最终完整门。预览使用可控后台会话和就绪期限。" },
    { name: ".agents 工作树热备", responsibility: "保存 E:\\.agents 当前工作树与未提交改动的 G 盘恢复点，补足 PRIVATE Git 只保存提交历史的边界。", implementation: "固定 E→G 路径、G 卷健康门、全局互斥、受限 robocopy 镜像、状态 JSON 和可选每日无窗口任务；不复制 .git，不访问 H。" },
    { name: "Control Plane Doctor（控制面诊断）", responsibility: "只检查这次问题需要的控制面，分别回答结构是否健康、所选 Git 目标是否已具备收口条件。", implementation: "-Owner 与 -CheckId 在接触提供器路径前收窄范围；默认 Cached/zero_write，不 fetch。显式 Live 才可能写本地 Git 引用，并在结果中明示；诊断不修复、不安装、不提交或推送。" },
    { name: "最小充分实现与测试", responsibility: "先确认提议结果来自用户目标或真实质量需要，再比较同一完整验收下的生命周期成本；独立审查只拦无依据增量，不能把预算或反膨胀变成产品停工门。", implementation: "user_intent_over_implementation + requirement_inflation_review + complete_acceptance_floor；复杂度失败先删自造层及只维护废层的测试，没有等价更小实现时接受必要复杂度并按实测净增量调整基线，保留自主修复、重建与委派。" }
  ],
  usageExamples: [
    {
      "ask": "按你已经了解的习惯帮我整理这份方案；需要用私人材料时，先处理这次资料访问。",
      "effect": "先核对本次共享资料状态和原截止；已经解锁且所需资料可读时，直接取最小相关背景，不因换到本机、手机或MCP再验证一次。确实未解锁时才沿已有入口请本人验证；取消只结束这次请求，不撤回另一段仍有效资料期，也不拿私人背景辨认来者。",
      "moduleSlug": "protected-policy"
    },
    {
      "ask": "我换到手机对话了，继续用电脑里的规则和工具把这份文档改好。",
      "effect": "先确认当前客户端真的连到那台电脑，再读取这项工作需要的规则和文件，使用已经接入的工具完成并回看结果；不会因此新开一个本机 Codex 对话。",
      "moduleSlug": "capability-routing"
    },
    {
      "ask": "我已经允许这项受保护操作，模型够强就可以直接当最高权限吗？",
      "effect": "型号够强只证明判断资格。系统仍分别核对独立登记的主体、本人判断、精确目标与授权；需要本人验证时给出真实窗口和恢复入口，不以一次连接成功替代这些证据。",
      "moduleSlug": "protected-policy"
    },
    {
      "ask": "这几个方案你自己比较，选一个对我最划算的。",
      "effect": "我会拿到推荐方案、关键取舍和足够的验证依据；AI 自己决定调查、工具和验证深度，不机械套模板。",
      "moduleSlug": "capability-routing"
    },
    {
      "ask": "先把这个故障稳定复现，找到根因后修掉，再跑相关回归。",
      "effect": "我会看到真实复现、根因、限定范围内的修复和相关回归结果，不会用跳过测试制造绿灯。",
      "moduleSlug": "context-evidence"
    },
    {
      "ask": "互不影响的部分就并行做，但别让两个任务改到同一处。",
      "effect": "独立且可验收的支路会按净收益并行，不限于长任务；真正会写冲突的临界区才串行，最后由当前任务统一合并。",
      "moduleSlug": "capability-routing"
    },
    {
      "ask": "这次只帮我查清问题，不要改任何东西。",
      "effect": "我会得到只读事实、证据和缺口；系统不认领排他施工范围，也不产生外部写入。",
      "moduleSlug": "authorization-owner"
    },
    {
      "ask": "只看看 Git 总索引有没有问题，别刷新远端引用，也不要顺手修。",
      "effect": "只读现有仓库登记和已保存的状态，分别说明账本是否健康、现在能否收口；远端资料过旧会明说，不偷偷联网刷新或修复。",
      "moduleSlug": "context-evidence"
    },
    {
      "ask": "给当前这个对话开一段无限制授权，之后只按我明确说的做，办完就撤销。",
      "effect": "本人填写具体有限时长并完成已登记验证后，回读本次实际范围、原截止和撤销状态。模型、后代和重新连接不自动延长；平台要求和真实工具能力仍不能伪造。",
      "moduleSlug": "authorization-owner"
    },
    {
      "ask": "这一步确实需要我确认，但先把确认后的执行和失败恢复都演练通。",
      "effect": "这次明确要求演练，就按实际影响面先核对执行与失败恢复，再呈现所选可用方式的正式邀请；普通日常验证不重复整套演练。未指定方式时可选健康登记方式，指定方式故障则先修好。独立保护邀请的十分钟从真实可见时起算；软件故障修复后重新给完整窗口，但不延长已有资料或接管授权。",
      "moduleSlug": "protected-policy"
    },
    {
      "ask": "别用以前的报告猜，重新看现场再回答。",
      "effect": "我会得到来自当前活动规则、最近项目规则、当前负责的事实来源、Git 状态和现行源码的结论；旧材料只作线索。",
      "moduleSlug": "rules-contracts"
    },
    {
      "ask": "我有一批还没提交的 .agents 修改，电脑出问题后还能从 G 盘找回什么？",
      "effect": "先核对 G 盘实际文件、上次复制时间和日志，再从私有仓库找回已提交历史；没有新鲜副本证据的修改如实标为未知。",
      "moduleSlug": "working-tree-hot-mirror"
    },
    {
      "ask": "检查通过后只提交这次改的文件，正常推送，别碰工作区里别人的修改。",
      "effect": "只把本次文件放进提交，保留其他任务未提交内容；推送后查远端主分支是否真的收到。",
      "moduleSlug": "authorization-owner"
    },
    {
      "ask": "这个项目刚发布，个人网站需要跟着改吗？",
      "effect": "先核对项目已正式发布，再看网站对应介绍会不会因此说错；确有变化才交给正在负责网站的任务或新建一次有界更新，不让来源任务空等。",
      "moduleSlug": "context-evidence"
    },
    {
      "ask": "公开项目里有些被 Git 忽略的私有配置和文档不能丢，帮我安全保留下来。",
      "effect": "只搬确实需要保存的私有文件；先在受保护的配套仓库核对副本与远端，再切换本地入口。任何一步失败保留原件。",
      "moduleSlug": "authorization-owner"
    },
    {
      "ask": "这个 Skill 文件已经写好了，为什么当前任务或新任务还是看不到？",
      "effect": "分别查看能力原件、安装、当前对话能否找到、新对话能否找到和一次真实使用；指出卡住的环节，只修那一步。",
      "moduleSlug": "skills-plugins"
    },
    {
      "ask": "浏览器控制刚断了，别丢掉我已经填好的表单；恢复后把附件和最终提交结果核对清楚。",
      "effect": "系统先保住并恢复同一个已登录标签页，异步控件逐层等待，附件逐个核对页面成功态，提交后再从平台记录回读字段与附件；文件名、100% 进度或一次跳转都不算完成。",
      "moduleSlug": "skills-plugins"
    },
    {
      "ask": "把这版规则正式启用，保留上一版退路；未提交草稿绝不能混进去。",
      "effect": "只用已经提交并核对完整的规则版本启用，旧版仍留作恢复；未提交草稿不进入生效版本，启用成功也不等于所有应用都已测试。",
      "moduleSlug": "protected-policy"
    },
    {
      "ask": "Hook 到底负责检查什么，最后是谁决定开几个子代理？",
      "effect": "运行环境先核对模型和任务身份、创建前再查条件；AI 根据工作能否独立完成及实际收益决定是否邀请协作任务，不按固定数量派。",
      "moduleSlug": "capability-routing"
    },
    {
      "ask": "继续把这个项目做完整，功能和质量都别砍，也别把你的临时方案变成我的新要求。",
      "effect": "AI 可以自主补功能、修 bug 和选择实现；长程关键节点由独立子代理检查自加目标与可删结构。现有入口够用就复用，只有真实缺口才增加最小实现，我会拿到完整产品而不是多一套审批。",
      "moduleSlug": "capability-routing"
    },
    {
      "ask": "别把内部路线告诉验收者，看看它能不能自己找对能力并交出结果。",
      "effect": "给全新评估者普通用户要求，同时检查它有没有自行选对工具以及交付物是否正确；预先点名工具的测试只说明指定路线能运行。",
      "moduleSlug": "capability-routing"
    }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "当前源码或规则候选写了什么。", doesNotProve: "已经安装、发布或运行。" },
    { layer: "Test（测试）", proves: "某个明确行为在指定环境通过回归。", doesNotProve: "生产入口和用户路径已经生效。" },
    { layer: "Install（安装）", proves: "制品、junction 或运行时已经落到目标位置。", doesNotProve: "新任务能发现，或场景 E2E 成功。" },
    { layer: "Publish（发布）", proves: "制品通过正式发布链进入目标。", doesNotProve: "网页、服务或用户操作真实可用。" },
    { layer: "Fresh task（全新任务）", proves: "安装之后启动的新任务能发现目标能力。", doesNotProve: "每一种真实输入都正确。" },
    { layer: "End to end（端到端）", proves: "真实输入走完整路径并得到用户可见结果。", doesNotProve: "所有未来输入和环境都不会失败，或长程任务永不偏离用户原意。" },
    { layer: "User acceptance（用户验收）", proves: "产品结果确实解决了用户当前问题。", doesNotProve: "内部实现没有可继续优化的空间。" }
  ],
  evolution: [
    {
      "date": "2026-06–07",
      "title": "先让不同任务按同一目标合作",
      "result": "建立共同规则与能力入口，随后加入按需只读诊断和专题导航；普通任务不用每次重教，也不必先读整套规则。",
      "evidence": [
        {
          "date": "2026-06-30",
          "note": "第一版共同规则与Skills。",
          "commit": "7a7d476"
        },
        {
          "date": "2026-07-09",
          "note": "只读诊断进入现有控制面。",
          "commit": "38d83f7"
        },
        {
          "date": "2026-07-10",
          "note": "合同目录开始支持按问题取所需正文。",
          "commit": "30cee72"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "授权、并发施工和模型身份分别核对",
      "result": "高影响动作开始有明确授权依据，并发任务按实际修改范围分工，子代理按宿主真实身份核对；这些是不同责任，不能凭一个强模型或管理员入口包办。",
      "evidence": [
        {
          "date": "2026-07-31",
          "note": "当时建立的集中Authority属于历史生产链，后续已退役。",
          "commit": "95028c4"
        },
        {
          "date": "2026-08-13",
          "note": "范围化执行Owner用于避免并发覆盖。",
          "commit": "94e6e3a"
        },
        {
          "date": "2026-08-15",
          "note": "宿主身份绑定进入原生委派。",
          "commit": "ecc2064"
        },
        {
          "date": "2026-08-26",
          "note": "当时CoreGoal与人类因子整合的历史阶段；不能据此恢复已退役的目标执行链。",
          "commit": "472ab3a"
        }
      ]
    },
    {
      "date": "2026-08",
      "title": "退出旧集中平台，活动规则有清楚退路",
      "result": "旧的集中规则系统退出当前工作，现行规则改用一整套可核对的发布版本；未发布草稿与已生效规则分开，上一版仍保留恢复依据。",
      "evidence": [
        {
          "date": "2026-08-21",
          "note": "退出历史第四基座，业务不归中央个人系统。",
          "commit": "6f6e1ab"
        },
        {
          "date": "2026-08-22",
          "note": "清理活动面和无消费者内容。",
          "commit": "9498615"
        },
        {
          "date": "2026-08-29",
          "note": "E release替代C盘旧发布链；当时仍在进行的运行根迁移只作历史观察。",
          "commit": "157060f–31009aa"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "title": "长任务不能丢掉原意和剩余责任",
      "result": "授权在原范围内跨接续保留，未完成责任随检查点交接；并发使用局部状态核对，已证依赖缺陷要收口。产品功能不因减复杂被砍，代码、测试与用户实际可用仍分别验证。",
      "evidence": [
        {
          "date": "2026-08-25",
          "note": "归档任务的施工责任可按证据接续。",
          "commit": "325d6a7"
        },
        {
          "date": "2026-08-30",
          "note": "公开分级、耐久授权与跨项目协调的历史规则；旧长期占用条件以现行规则为准。",
          "commit": "464564b–185503e"
        },
        {
          "date": "2026-08-31—09-04",
          "note": "用户原意、自然能力验收、依赖收口与来源快照进入长期协作。",
          "commit": "d32210b–c5684d7"
        },
        {
          "date": "2026-09-04—09-06",
          "note": "E101–E118时期形成局部Owner CAS和短时流程；当时根/父模型上限已被后续规则替代。",
          "commit": "c5684d7–59f2728"
        }
      ]
    },
    {
      "date": "2026-09-19–09-22",
      "title": "按真实问题读规则，按质量选择方法",
      "result": "按问题读需要的共同规则；私人资料共用原到期时间，本人限时授权直接走独立窗口。协作模型按任务、许可与真实能力选择；规则已生效仍不等于电脑功能和实际使用已验收。",
      "evidence": [
        {
          "date": "2026-09-22",
          "commit": "83db4ff5c274c309207340114af02bdd9ea99758",
          "note": "本轮Inspect核实活动E166，并完整读取Codex适配及共享资料生命周期；这里只证明现行规则语义，不替代PCConfig机器实现证据。"
        }
      ]
    }
  ],
  operationalEntrypoints: [
    { name: "活动 E 规则", command: "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json", purpose: "核验current/previous、提交、完整规则文件集合与指针；正式阅读专题和兼容文件分别展示。" },
    { name: "合同导航", command: "E:\\.agents\\tools\\Get-ControlPlaneContractCatalog.ps1 -All -Json", purpose: "查看合同 Owner、触发 metadata、Provider 和 validator。" },
    { name: "三控制面视图", command: "E:\\.agents\\tools\\Get-FourBaseDecisionContext.ps1 -List -Json", purpose: "列出兼容视图与合同元数据；按 Owner/DocumentId 选择真正需要的文档。" },
    { name: "有界零写诊断", command: "E:\\.agents\\tools\\Invoke-ControlPlaneDoctor.ps1 -Owner git -CheckId project_admission_index -Json", purpose: "只查 Git 总索引，默认不 fetch，分别返回健康与收口结论。" },
    { name: "本人主动申请限时接管", command: "Invoke-OwnerTakeover.ps1 -Operation Open", purpose: "这是PCConfig已安装入口的稳定动作名，实际安装位置由PCConfig解析；本人填时长并验证后，由宿主沿同一请求消费真实范围与原截止。网页不调用该动作，也不再把旧CoreGoal检查列为当前入口。" },
    { name: "Skill 供应", command: "E:\\.agents\\tools\\Test-PersonalSkillSupply.ps1 -RequireInstalled -NoExternalEvidence -Json", purpose: "验证 source、install 和 transaction，不冒充 fresh task 或 E2E。" },
    { name: "本地回归", command: "E:\\.agents\\tests\\Invoke-AllTests.ps1 -Scope Local -Parallel -Json", purpose: "运行登记为本地安全的测试，跨 Owner 项明确 skip。" }
  ],
  "kicker": "同一套协作约定，让 AI 听懂、做完并说清结果",
  "readerBoundary": "规则生效不代表所有电脑功能和真实场景都已验收。共享资料期已有此前安装证据，但正式私人资料迁移、备份独立恢复和实际安全关闭仍有缺口；完整机器证据按原日期保留。",
};

export const modules = [
  {
    slug: "rules-contracts",
    usageEntry: "在已接入活动 E 规则的 AI 对话中说出项目和具体问题，请它按当前规则处理。",
    usageInputs: ["项目名称与目标", "这轮更正或限制"],
    productFlow: [
      {
        "title": "先说清本次要求与项目",
        "detail": "AI 先核对这轮原话、活动规则和项目自身约定，找到这件事由谁解释。"
      },
      {
        "title": "把事实交给正确来源",
        "detail": "代码仓库的发布状态查 GitHub 总索引，电脑路径和任务查 PCConfig，具体功能问所属项目；旧报告只作线索。"
      },
      {
        "title": "交回决定与冲突",
        "detail": "说明能继续的动作、确切依据；若两份有效来源冲突，只暂停受影响的判断并指出下一处取证入口。"
      }
    ],
    shortTitle: "规则与合同",
    title: "规则、合同与事实 Owner",
    teaser: "先弄清这次该听谁的、现场事实该去哪里查；遇到冲突就指出责任来源，不把几份旧材料硬拼成答案。",
    status: "已落地并处于活动规则中",
    statusTone: "pass",
    value: "AI 不会拿上个月的报告当今天的现场，也不会跑到错误仓库执行一套看似正确的命令；业务、Git、机器和 Agent 规则各回到真正负责它们的来源。",
    why: "一项任务里常会同时出现这轮新要求、项目自己的规矩、全局规则、历史说明和当前状态。解释权不清楚，AI 就可能让旧计划盖过用户更正，或用通用做法盖过项目真实验收。",
    example: "我会直接说：“按这个项目自己的测试把问题修好，别拿上个月的报告当现状；如果发布状态和电脑状态对不上，就分别查清。”系统先读这轮要求和最近的项目规则，需要仓库事实才查 Git，需要机器事实才查 PCConfig；我拿到的是各来源的当前结论，不是一份拼出来的故事。",
    result: "任务会从有效规则和当前事实出发。若两个来源真的冲突，系统只停受影响的判断，告诉我冲突在哪里、该由谁裁定，以及其余工作还能不能继续。",
    readerStates: {
      "pass": "这次要求、项目约定和现场事实对得上时，按项目自己的方式继续。",
      "problem": "两份来源确实冲突时只停依赖它的步骤，说明应该由谁核实。",
      "unavailable": "必要规则或现场暂时读不到时写清无法判断，不让旧报告冒充现在。"
    },
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
      { term: "Project rule nonoverride（项目规则通常不覆盖）", explanation: "全局规则不能改写具体项目的业务语义、命令或兼容约束。授权合同拥有两项窄例外：PUBLIC 个人数据分级及项目收紧 L1/L2 默认的授权条件；既有耐久明确授权的解释，项目不能把它降为不存在或要求同轮重述。" },
      { term: "渐进读取", explanation: "先确认 metadata 是否相关，再读取必要正文，不把全部合同机械灌进每个任务。" }
    ],
    boundaries: [
      "README 和操作指南面向人，不是执行规则或动态权威",
      "catalog 只能选择候选正文，不能证明某个 effect 已发生",
      "全局规则不能以统一为理由覆盖项目业务与测试；项目若要收紧 L1/L2 公开默认，必须有真实需要和用户对精确项目、范围、限制的明确授权",
      "兼容文件名和历史命名不能恢复已经退役的控制面；本人已冻结的项目，批量“全部完善”也默认不读代码、不主动维护；之后明确提出该项目的具体需求，就只处理这次范围，不需要额外解除口令，也不恢复日常维护。目录、服务或备份仍存在，不等于允许主动改动。"
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
    relation: "这个模块决定从哪里开始和应该读什么；能力路由决定怎样做，授权与 Owner 决定谁可以做，保护策略决定重大动作依据哪一代规则。",
    readerStatus: "当前共同规则已经生效，任务可按问题找到正确的项目与事实来源；这不代表每个项目的实际功能都已验收。"
  },
  {
    slug: "capability-routing",
    usageEntry: "在同一 AI 工作对话中说出目标与允许的工具或模型限制；实际工具由当前宿主可用能力决定。",
    usageInputs: ["期望完成的结果", "质量、时间、费用或模型限制"],
    productFlow: [
      {
        "title": "先核对真正要交付的结果",
        "detail": "AI 把用户要求和自己临时提出的做法分开，保留必须完成的功能与验收。"
      },
      {
        "title": "选择实际可用办法",
        "detail": "AI 核对当前工具与身份，比较自己完成和有界并行；仅在允许且值得时派子任务。"
      },
      {
        "title": "检查做成没有",
        "detail": "完成后核对用户能看到的结果、清理任务文件；能力或独立审查不可用就说明精确缺口，不借其他路线冒充。"
      }
    ],
    shortTitle: "能力路由",
    title: "能力、方法与原生代理路由",
    teaser: "我只需说清要做成什么；AI 自己选工具、方法和并行度，既不把临时方案变成新需求，也不借“简化”砍掉产品功能。",
    status: "已落地；身份门禁与路由回归通过",
    statusTone: "pass",
    value: "我只说要完成什么，AI 在获准范围内选工具、安排可独立验收的协作，并在长任务里守住原目标；生成文件也由它归位，不把清理留给我。",
    why: "任务一长，临时方案很容易被越写越像硬需求；但一味压缩实现，又可能把真正要用的功能一起删掉。这套路由只拦没有依据的新增层，保留 AI 自主研究、补功能、修复、重建和委派的空间。",
    example: "我说：“把这个项目做完整；如果你想到一个新数据库，先看它是否真为这次功能所需。能各自做完并验收的部分可以并行。”AI 会保留原目标，选择现有工具或合适的协作方式，发现多余环节就纠正。",
    result: "我拿到完整功能和实际验收结果。AI 会说明用了什么办法、哪些并行工作已经核对；工具或协作身份缺失时只停相应路线，不把原目标交还给我自己处理。",
    readerStates: { pass: "原意、授权和质量边界清楚后，AI 自主完善、修复、重建并选择 0–10 个子代理；同样能完整验收时，采用总成本更低的实现。", problem: "新增目标或技术层没有用户意图、必要实现或真实质量依据时，只移除那部分并换简单路线；主目标继续，自造复杂度出错先删层。", unavailable: "可信身份缺失时只关闭委派，普通工作继续；独立审查确实不可用时明确写出未独立审查，不用自审冒充，也不另造审查平台。" },
    searchAliases: [
      "Hook到底检查什么，谁决定开几个代理",
      "UserPromptSubmit和SubagentStart有什么区别",
      "PreToolUse为什么不能替代前置判断",
      "什么时候需要实现盲测",
      "不点名Skill怎么验AI会自己选路",
      "点名工具的测试算不算盲测",
      "Codex官方更新后为什么不能看版本号准入",
      "功能不删怎样选择最小充分实现",
      "长任务怎样防止模型自造需求",
      "完善项目是否包括补功能和修复bug"
    ],
    searchProjection: {
      intents: ["Hook 到底检查什么以及谁决定 0–10", "什么时候需要 implementation-blind fresh E2E", "怎样证明 AI 在没有路线提示时自己选对能力", "Codex 官方更新后怎样保持能力连续", "不删产品功能时怎样选择最小充分实现", "新增技术层需要什么证据", "长任务怎样防止计划和测试自造需求", "完善项目时AI能否自主补功能和修复bug"],
      entities: ["UserPromptSubmit / SubagentStart", "PreToolUse / verified identity", "route_selected_without_hint / directed_execution_test", "package family", "user_intent_over_implementation / requirement_inflation_review", "complete_acceptance_floor", "minimum_sufficient_implementation_guard", "complexity_failure_collapse"],
      relations: ["UserPromptSubmit和SubagentStart在判断前验真并提醒原意，AI决定数量和家族而Hook不调度", "PreToolUse只在spawn前复核TOCTOU", "稳定主体与事件能力发现高于版本路径", "用户目标和明确更正高于可替换方案", "独立长程审查只拦自加目标不砍功能", "同一验收下短路线满足就禁止无依据长路线；本人拥有的规则、Skill、工具、项目或依赖损坏时，修复或正式替换到真实入口，保留有用功能、数据和兼容并验收，不能一次性绕过后遗忘", "必要复杂度没有等价小实现时按实测净增量调整基线继续", "自造复杂度失败先删层而不是加门"],
      failureRecovery: ["可信身份缺失时只关闭委派并继续普通任务", "创建前身份或上限漂移时取消本次spawn后重判", "盲测点名路线时降为directed execution test后重测", "自加目标或无证据技术层被禁止时继续已授权简单路径", "自造复杂度失败时先删除或绕开该层", "官方更新缺失精确能力时只降级受影响路线"]
    },
    decisionImpact: [
      "简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。",
      "root 的 UserPromptSubmit 与 child 的 SubagentStart 在任何 0–10 判断前注入 verified model、effective effort、role、turn hash 和当前 E identity。",
      "AI 根据任务语义、独立可验性、质量、墙钟、冲突、资源和 slots 自主决定 0–10、家族与 effort；Hook 不做调度。",
      "PreToolUse 只在真实创建前复核现场身份、当前候选支持、用户限制、参数和上下文继承；它不替AI选型，也不能取代判断前的可信身份。",
      "只有完全没有 Hook 或身份注入的旧 root 才复用同一任务中用户已经给出的自然语言 model/effort 确认；确认层规范化别名，thread binding 只写 canonical ID，child 不继承。E identity 换代只刷新快照、重读并重派生，不重复确认。",
      "实现者知道内部答案可能污染验收时，AI 主动安排 implementation-blind fresh E2E，而不是等用户说出“盲测”。",
      "测试自然语言自主路由时，提示不点名 Skill、tool、plugin、provider、内部路径或预期路线，同时验 route_selected_without_hint 和用户可见结果。",
      "版本、build（构建号）和版本化安装路径用于观察、复现与已测发布，不作为一般软件更新的永久准入门。兼容判断依真实稳定产品身份、签名或主体、公开接口、配置结构、事件和实际能力；更新后只暂停实测缺失的能力，普通工作继续。API或文件格式版本、锁文件、测试夹具以及用户明确选择的固定运行版仍可以严格约束；接口未知不等于通过，也不凭新版本号判失败。",
      "所有项目、root、后代、新对话和压缩续作都区分用户目标/更正与可换方案；计划、代码、测试、草稿和审查不产生新需求。现行工程与交付规则明确：从用户的具体做法还原真实目标、必要约束和成功结果，比较实际效果与总成本后自主选方法，不受现有代码、计划或沉没成本锁定，也不为理论最优无限寻优。",
      "先问结果是否来自用户意图、必要实现或真实质量，再比较同一完整验收；“完善项目”包括自主补功能，实施中指出 bug 默认修复，明确只问或不改时除外。",
      "长程实质范围/方案变更、压缩后重规划、同类失败循环和阶段交付前复用一路独立子代理审查；审查指出需求来源与可删实现，不凭代码量、耗时或偏好砍功能。",
      "新增实现须对应当前具体未满足项；无依据增量属于 prohibited_unjustified_complexity（禁止的无依据复杂度），换简单路径继续，不缩权、不限制重建与委派，也不把工程选择甩给用户。",
      "Agent 自造复杂度导致失败时先删层，并删改只维护废层的测试；用户已确认的删除不能被模型以恢复或安全名义撤销，整个来源根离线仍只表示本次不可用。"
    ],
    problem: "工具、Skills、插件和模型很多，真正困难的不只是选哪个，还要防止两种错误：借反膨胀删掉真实产品需求，或把产品复杂误当成可以无限增加技术层的理由。固定模板会让简单任务膨胀；自造层失败后继续叠门又会把工程成本和等待转嫁给用户。",
    implementation: [
      "cross_harness_common_contract（跨运行框架共同合同）要求在实际执行地点运行同一 E resolver（规则解析器），读取已验证根和目录链规则；云端客户端不把本机路径解释成云端路径，不另存手机规则。各宿主使用自己的 adapter（适配器），Codex 日志、Hook、字段和工具名不是其他框架日常工作的前置条件。判断产物可绑定该宿主真实 assistant（助手）消息或 tool call（工具调用），不要求必须是 final（最终回复）。",
      "semantic_capability_mapping（能力语义映射）按当前宿主真实 shell、MCP、脚本、浏览器和协作能力完成目标。Codex 专用工具、Hook、CODEX_* 环境和 App 任务身份不是其他宿主普通施工的前提；缺哪个能力只关闭对应动作，不静默启动 Codex 代替用户选择。",
      "shared_execution_resources（共享执行资源）按一次真实操作协调前台桌面、浏览器会话与鼠标键盘；开始前观察目标、结束即交还，无冲突文件工作继续。",
      "quality_first_model_routing_v1 允许在本人已授权且宿主真实支持的候选内，按质量与完成任务总成本选择型号和思考投入；必要时可高于根或父。旧模型基值加法、根/父组合分数和同型号不得升档不再作为现行准入，用户明确的型号、厂商、预算与思考限制继续传给后代。",
      "model intuition precedence 让模型根据目标、风险、信息增益、延迟、耦合、可逆性和净收益选择方法。",
      "task_file_lifecycle_cleanup（任务文件收口）覆盖所有项目、根和后代下载/生成/复制/解包的全部类型文件；落盘前确定用途，下载归E:\\Downloads，自产临时物归E:\\Cache\\Codex\\Temp\\<task-id>或确需的项目工作区。归位优先移动，必须先复制时核对目标可用及引用后删除本任务可处置源副本。",
      "用完、阶段结束和交付前检查本任务所有真实落点，包括Codex自有目录、工具固定输出、预览图、失败产物与空目录。只保留有明确消费者且确需本机副本的交付/维护/恢复材料，说明暂留理由与退出条件；不按年龄或目录整库清理，不动原件、其他任务和在用状态。",
      "清理失败不算收口。只有进程启动前的Codex命令层blocked by policy/Rejected才沿授权合同对同一已核验路径改用Windows回收站并回读；普通占用、权限或路径失败不套用，仍受阻则说明精确残留、原因和下一处理条件，不新建后台清理器。",
      "Skill、Plugin、模板和计划默认只是建议性制品，不能凭正文里的 MUST 自行升级为硬门。",
      "初始工具列表不是能力上限；先查 owner adapter、固定 CLI/API 和当前 metadata，确认实质缺口后才降级或建议插件。",
      "Codex UserPromptSubmit与SubagentStart在各自真实宿主上下文核对model、effective effort、根/父子关系、turn hash、E版本及完整集合指纹。专用元数据只决定相应原生能力，不成为其他宿主普通实现的前提，不从标题或自行声明产生身份。",
      "同 task 的续写日志可能在原 UUID 后附第二 UUID。现行 runtime 按准确 session_id/turn_id 在规范会话根定位对应 turn_context（回合上下文），核对会话身份；旧 locator 缺本回合时转到匹配续写文件，不按文件时间或历史模型推断当前身份。",
      "收到可信身份后由 AI 按任务语义与净收益选择 0–10 个子代理，以及实际支持且获准的 GPT-6 Luna、Sol、Astra、effort、scope 和 fork；稳定 Hook 只验证身份、E rules 与参数，不选择也不创建。新支路、阻塞、更正、压缩、子任务终止或槽位释放会改变选择时重判；无新证据不逐工具重算。受保护判断尚未完成时，只等待依赖它的精确敏感披露或不可逆终步，不相关的思考、可逆修复、测试、验证与恢复继续。",
      "根先比较自己直接完成与根子协作：根可亲自研究、设计、实现、验证和交付。按子任务剩余难度选完整组合：GPT-6 Luna 可做范围清楚且可验证的完整实现、测试、排障或研究；GPT-6 Sol 可做复杂设计、完整子系统、跨模块调试和审查；GPT-6 Astra 用于仍需额外能力、困难支路有效并行或必要独立反证。型号与effort分别判断，父子可带证据双向讨论；比较交接、执行、往返、审阅、冲突、等待和返工的未来总投入，不把已花的根成本或名义 token 单价当任务费用。",
      "非OpenAI根默认自行工作，不创建自身、同谱系Flash或其他第三方子代理；只有适用的用户OpenAI委派许可才进入该候选范围，仍可选择不派。普通创建与续聊直接用openai_child，显式传准确角色、模型、思考档位、任务名与正文，不传fork_turns；不能借spawn_agent、AICLI或后台任务绕行。受限桥接child继续受原父任务许可约束，需要再分工由原父任务安排。",
      "受保护判断的专用桥接与普通经济委派分开：非OpenAI根缺对应资格且确需判断时，常规用GPT-6 Sol High专用角色、升级用GPT-6 Astra High专用角色，直接调用openai_child并只传agent_type/model/reasoning_effort/task_name/message五字段；两档同步返回持久判断及原生证据定位，不混入wait_ms、thread_id、reply_to、fork_turns或其null占位。旧父会话的工具定义可能尚未更新，真实不可用只局部处理；专用入口不授予普通OpenAI委派许可或实际effect权。",
      "同一目标由一个主任务负责战略、关键决策与最终验收；独立顶层任务必须有可独立交付的成果、责任必要与正净收益。项目数量、工作量、槽位已满或当前不能 Claim 都不单独成立。",
      "time_sensitive_response_flow 在验证码或登录确认的真实短窗口内主动跟进已可读来源，按能力、成本和剩余窗口选择现成等待或有界查询；不能刚开始等待就用任意延后定时任务代替，也不推广为数小时常驻或全局轮询。",
      "用户原意可从上下文可靠还原时容纳错字和转写误差；错误前提、伪需求或不合适做法须据证质疑并给替代，歧义只有影响目标/授权/结果时才问。已确认功能和本人明确更正仍保留。",
      "cross_owner_dependency_budget 先用最小因果证据区分 A 自身问题和依赖 B 缺陷；确有影响时沿已有授权修复 B 的精确范围或正式交接。A 局部成功不取消 B 义务，未修原因、影响和接手状态必须向本人披露，不接管无关业务。",
      "PreToolUse 在真实 spawn 或 openai_child 调用前重建现场身份，复核当前支持、适用用户许可、参数与上下文继承；SubagentStart 再以真实 child turn context 绑定结果。根/父档位不另作硬上限。",
      "完全无 Hook 的旧 root 可以把同一任务中用户已有的自然语言 model/effort 确认规范化为 canonical ID，写入并回读同一 CODEX_THREAD_ID 的 user_attested_verified；E identity 换代时重读、重派生并刷新快照，不重复索要确认，规则撤销该路径时失败关闭；宿主身份恢复后优先用宿主，child 从不借父绑定。",
      "blind acceptance detection 在内部测试不能代表自然语言、UI、provider、模型或恢复结果时，给 fresh evaluator 最小充分的用户可见目标和正常环境，不给 diff、根因、修复线索与无关项目细节。",
      "natural intent blind routing E2E 保持正常能力 metadata 可见，但提示只说自然用户目标；验收同时检查无提示选路和可见结果，点名路线只记录为 directed execution test。",
      "版本、build（构建号）和版本化安装路径用于观察、复现与已测发布，不作为一般软件更新的永久准入门。兼容判断依真实稳定产品身份、签名或主体、公开接口、配置结构、事件和实际能力；更新后只暂停实测缺失的能力，普通工作继续。API或文件格式版本、锁文件、测试夹具以及用户明确选择的固定运行版仍可以严格约束；接口未知不等于通过，也不凭新版本号判失败。 Codex专属Hook另外依赖稳定package family、signer/principal、bridge key与精确事件，当前目录缺项只停受影响委派。",
      "同一官方主体更新或 optional metadata 缺失不触发 step-up/BLOCK；只有精确 event 或 capability 现场不存在时关闭对应能力，普通项目不受影响。",
      "change_surface_validation 按现实风险和 diff 影响面选择 focused 或 standard 验证；E rules 快速发布目标 180 秒内并分列测试、Git、push/readback、UAC activation 墙钟。",
      "product_requirement_complexity_authority 与 user_intent_over_implementation 把用户结果和可换方案分开；模型自造的企业治理、安全/恢复目标、理论风险和未来需求不属于用户要求。",
      "requirement_inflation_review 在长程实质节点用独立子代理审查原意、更正、提议结果、自加目标/流程/假设、现有能力和可删实现；主线继续不冲突工作，审查复用，不逐工具派单或定时轮询。",
      "minimum_sufficient_implementation_guard 冻结完整功能和真实质量而非实现；新增结构必须对应当前未满足项，未来猜想、惯例、最佳实践、额度或审查偏好不能举证。它只约束方法，不是产品停工门；有依据且没有等价更小实现时接受必要复杂度并按实测净增量调整基线继续。",
      "complexity_failure_collapse 因新增层/状态/证明链失败时先删层或绕开，并同步删改只维护废实现的测试和文档；不能继续叠保护、回执和后备状态。恢复服从用户语义，不替用户撤销已确认的删除或其他操作。",
      "现有项目/宿主持久状态分开保留用户结果、更正、授权、可推翻方案和完成/剩余结果。压缩、交接、更正、反复失败或扩架构前先恢复原意，再读必要代码；不保存隐藏推理或为此新建台账、服务、数据库。"
    ],
    flow: [
      "理解自然语言目标、更正与真实质量，把它们和可替换方案分开；不把猜想写成验收",
      "查询已有 Owner、原生入口和当前能力 metadata；实证缺口出现前不安装第二套路线",
      "root 由 UserPromptSubmit、child 由 SubagentStart 在 0–10 判断前取得可信身份与当前 E identity",
      "AI 评估独立可验性、质量、墙钟、写入冲突、资源和 slots，自主决定 0–10、家族、effort 与 scope",
      "root 派出 child 后继续战略、依赖、风险和不冲突工作，不把等待冒充进展",
      "每次真实创建前由PreToolUse复核现场身份、当前支持、用户限制和参数；事实变化则取消本次创建并重新判断，不扩大授权。",
      "能力确实缺失时才安装官方运行时或提出精确插件；任务确需新软件时，主驾驶默认装到 E 盘现有合适目录；安装器或系统组件必须使用固定位置时沿原生路线并说明，不借此迁移已有安装。官方更新只按稳定主体、事件和能力现场局部降级",
      "长程实质变更、压缩重规划、失败循环和阶段交付前独立审查：先确认是不是用户要的结果，再比较完整验收下的实现总成本",
      "短路线满足同一验收就直接采用；不满足时只增加解决已证缺口的最小技术层",
      "新增层导致失败先删层及只维护废层的测试；用户目标继续，不靠缩权、少用代理或新增审批治理复杂度",
      "实现知识可能污染验收时，另给 fresh evaluator 最小自然目标和正常环境，不暴露内部答案",
      "最后分别验证能力可用、route_selected_without_hint、用户可见结果与剩余 Unknown；定向测试单列，短时通过不外推长期稳定，目标完成即结束",
      "交付前收起所需文件并清理本任务无意义落地物，回读删除源已消失且保留结果仍可用；仍需暂留或实际受阻的精确范围如实说明"
    ],
    concepts: [
      { term: "Advisory artifact", explanation: "提供方法和入口，但不会自动取得更高优先级、授权或施工 Owner。" },
      { term: "能力显著性", explanation: "metadata 先把可能相关的能力放回注意力，正文仍按当前问题的净收益渐进读取。" },
      { term: "身份先于委派", explanation: "代理名称和模型自报不算身份；没有可信身份时只关闭委派，主任务继续。" },
      { term: "Hook（宿主钩子）", explanation: "宿主在固定事件点注入或复核可信事实；它不调度代理、不创建 child、不产生授权。" },
      { term: "UserPromptSubmit / SubagentStart", explanation: "前者为 root 请求，后者为 child 启动；都必须在该代理进行 0–10 判断前提供自己的 verified identity。" },
      { term: "PreToolUse", explanation: "真实创建前再次核对身份、用户限制、候选支持和参数；不能代替模型判断或变成第一次取得身份。" },
      { term: "Implementation-blind fresh E2E", explanation: "让不知道 diff、根因和预期路线的新评估者，按最小用户目标走正常产品路径。" },
      { term: "Natural-intent blind routing", explanation: "提示不点名能力路线，正常 metadata 仍可见；同时验证 AI 自己选路和最终用户结果。" },
      { term: "Directed execution test", explanation: "明确告诉模型使用哪个 Skill、tool 或 provider 的定向测试，只证明该路线能执行，不证明自主路由。" },
      { term: "Official update continuity", explanation: "官方同主体更新以稳定 package family、签名、事件和当前能力发现延续，不把易变版本号或安装路径当身份。" },
      { term: "Complete acceptance floor（完整验收底线）", explanation: "固定用户结果与真实质量，不固定模型方案；功能、好用、正确、可靠、恢复、性能、可维护、现有兼容和已证扩展轴不因瘦身丢失。" },
      { term: "Requirement inflation review（反需求膨胀审查）", explanation: "长程实质节点独立检查需求来源及可删实现，只拦模型自加目标、流程和假设，不砍用户功能或收窄模型自治。" },
      { term: "Minimum sufficient implementation（最小充分实现）", explanation: "满足完整验收所需的最少技术层、节点、状态和人工步骤；不是靠删产品功能获得的表面简单，也不把必要复杂度或预算变成停工理由。" },
      { term: "Complexity failure collapse（复杂度失败收缩）", explanation: "Agent 新增的层导致失败时，先删除或绕开该层再重判；不能继续给长路线叠证明和保护结构。" },
      { term: "证据式降级", explanation: "只有入口真实缺失、失败或策略阻断时才换路线，不因想象中的风险先降级。" }
    ],
    boundaries: [
      "能力发现不会扩大用户授权",
      "账号、插件、管理员权限令牌和子代理都不能绕过 Owner（责任源）或 effect（外部现实动作）边界",
      "不为假想未来预装动态配置服务、兼容层或第二套 Provider（服务入口）",
      "后代继承用户明确的范围、厂商、型号、预算与思考限制，并核对真实可用候选；根/父当前型号与档位不构成经济上限。原生跨型号或档位采用无历史或有限历史上下文，实际身份与档位不得按名称或比较规则改写。",
      "Hook 提供可信身份、原意提醒和创建前复核；0–10、家族、方案、分工与验收由 AI 决定",
      "旧 root thread binding 仅用于宿主完全无 Hook 或注入，只保存 canonical ID；E 代际变化不使已成立的用户确认失效，child 不继承且不能覆盖冲突的宿主身份",
      "不依赖 Stop Hook；回执缺失不能阻塞普通工具或最终答复",
      "app version、build、versioned executable path、update epoch 和 optional metadata 不能成为准入门",
      "盲测不是每次机械执行；客观需要时也不能因省上下文或反膨胀而跳过",
      "测试提示点名 Skill、tool、plugin、provider、内部路径或预期路线时不得称为 blind routing E2E",
      "反膨胀不删除或降级用户功能、真实质量与已证扩展点；完善项目不被缩成只修 bug，也不靠缩权、限代理/对话数或逐项审批维持简单",
      "无依据目标或技术层只禁止相应增量，换简单路径继续；独立审查不可用如实报告，不以自审冒充，不新建审查平台",
      "入口提醒生效、当前行为与长期稳定性分别证明；字符串检查、全绿报告或短时 E2E 不证明长程永不偏离"
    ],
    failures: [
      { condition: "任务文件清理失败或仍被使用", response: "不把主产物成功当作清理完成；保留在用和必要恢复材料，继续处理可处置项。命令层启动前明确拒绝才用同目标回收站后备，真实残留给出路径、理由与下一条件。" },
      { condition: "委派身份不可验证", response: "停止 spawn，但继续本地调查、实现、测试和答复。" },
      { condition: "PreToolUse 发现身份、家族、effort、参数或 fork 已漂移", response: "取消这一次 spawn，回到当前身份和任务范围重判，不扩大授权。" },
      { condition: "旧 root 没有 Hook，且同一任务中不存在用户对 model/effort 的明确自然语言确认", response: "不建立对话绑定、不猜身份；主任务继续，只有委派不可用。" },
      { condition: "provider 缺失或账号不可用", response: "报告确切缺口，不伪造第二 provider 或静默换账号。" },
      { condition: "盲测提示泄露 Skill、工具、Provider 或预期路线", response: "把该结果降为定向执行证据，用新的独立上下文和纯自然意图重新验收。" },
      { condition: "官方更新后某个精确 event 或 capability 不存在", response: "只关闭受影响的 Hook 或能力并报告缺口；不因版本号或路径变化阻塞普通项目。" },
      { condition: "子代理中断", response: "先判断旧上下文和执行状态是否仍有接续价值：同一子任务且事实仍准确时恢复原会话；旧事实失效或独立新工作更适合新上下文时，先核清并停止或交接原任务，再在原许可内新建。部分结果不冒充完成。" },
      { condition: "提议目标或技术层没有用户意图、必要实现或真实质量依据", response: "禁止无依据增量，保留完整用户目标，回到现有入口或更短路线继续；不把“还可以更全面”加入完成条件。" },
      { condition: "Agent 新增的服务、状态机、证明链或验证层导致任务失败", response: "先移除或绕开该复杂度，并删改只维护废实现的测试；恢复用户原意后仅为当前真实缺口补最小实现，不限制模型修复、重建或委派。" }
    ],
    sources: [
      { path: activeRuleSourcePath("capabilities_runtime_contract"), role: "活动能力与运行方式专题" },
      { path: activeRuleSourcePath("codex_adapter_contract"), role: "活动原生身份、模型与思考选择、OpenAI许可和上下文接续" },
      { path: activeRuleSourcePath("engineering_delivery_contract"), role: "活动用户目标、相称实现、独立审查与交付语义" },
      { path: "E:\\.agents\\skills\\native-economy-routing\\SKILL.md", role: "把活动委派门禁恢复到注意力的窄入口" },
      { path: "E:\\.agents\\tools\\codex_native_economy_gate.py", role: "稳定 Hook bridge；只核对事件、受管 runtime 指纹和调用边界" },
      { path: "E:\\.agents\\tools\\codex_native_economy_runtime.py", role: "原有宿主事件的身份注入、原意提醒、准确续写回合定位和创建前复核" },
      { path: "E:\\.agents\\tests\\test_codex_native_economy_gate.py", role: "准确 turn_id 续写定位、缺失身份时仍提醒原意及身份读取回归" },
      { path: "E:\\.agents\\tests\\Test-AttentionFidelityPolicy.ps1", role: "实现盲测、自然意图路由、无提示选路与定向测试边界回归" },
      { path: "E:\\.agents\\tests\\Test-AgentRuntimeCompatibility.ps1", role: "官方更新稳定主体、版本路径非准入和能力局部降级回归" },
      { path: "E:\\.agents\\config\\on-demand-plugin-catalog.json", role: "只有实证能力缺口时读取的插件 metadata" }
    ],
    verification: [
      "NativeEconomyRoutingGate 的验证对象包括判断前可信身份、同版E规则、当前候选支持与用户限制，以及PreToolUse创建前复核；本页不把规则发布当成所有真实委派路径已经重测。",
      "AgentRuntimeCompatibility 验证官方同主体更新以稳定 package/signature/event/capability 连续，app version 和 versioned path 不参与准入",
      "AgentAutonomyPolicy 与 AttentionFidelityPolicy 验证模型主动识别盲测、提示不泄露路线、route_selected_without_hint 和 directed_execution_test 的证据边界",
      `当前 ${panelSnapshot.authority.releaseId} 根规则与能力合同已在 ${panelSnapshot.authority.gitCommit} 发布激活；本轮快照重新运行活动 release validator、合同覆盖和 Skill 供应验证。E118 曾采用四档模型与根/父双上限，E167 曾恢复质量优先的候选边界；当前 ${panelSnapshot.authority.releaseId} 延续质量优先原则，按真实支持与许可在 GPT-6 Luna、Sol、Astra 中比较剩余难度和完成总成本，受保护判断按 Sol High+ 常规、Astra High+ 升级分档。独立责任判断、局部 Owner CAS、依赖收口和短时流程继续按各自当前合同处理。历史上限与旧型号岗位不能继续当作当前规则；本次没有重跑完整 Local 回归，不把 ${localOwnerObservation.releaseId} 38/0 当作本代全量通过。`,
      "2026-09-02 安装 Inspect 回读 active_verified；runtime SHA-256=a67b98955b854bad5f2c22ba057d621bf6ae0e1598181bf2eaa8301002b9a530，UserPromptSubmit/SubagentStart/PreToolUse 三事件 trusted、enabled 且 additionalContextLimit=0。现有提醒已到达真实子代理，不代表所有长程任务从此不会偏离。",
      "implementation-blind fresh E2E 只有在 fresh evaluator 未获得 diff、根因或路线提示，并真实走完用户路径后才成立",
      "natural-intent blind routing E2E 必须同时证明 AI 自己选择了正确路线和用户可见结果正确；只命中工具或只得到答案都不完整",
      "聚焦 Hook、合同和定向执行回归只能证明对应机制，不冒充某个真实自然语言任务的盲测结果"
    ],
    relation: "能力路由决定怎样做、是否并行和怎样验收；Hook 只为该判断提供可信身份并在创建前复核。它不产生用户授权、Execution Owner 或 E release，这些分别由授权和保护合同拥有。",
    readerStatus: "已有按需求选工具、协调协作者和保留原意的机制；身份与路由检查通过，不等于每种工具的真实任务都已走通。"
  },
  {
    slug: "authorization-owner",
    usageEntry: "在已接入规则的 AI 对话里说明要改什么项目、最终会影响哪里；长期授权可沿原范围使用。",
    usageInputs: ["目标项目与具体动作", "已有授权或本轮新增限制", "可能影响的账号、公开目标或文件"],
    productFlow: [
      { title: "说出动作和影响", detail: "AI 区分普通可逆修改、已有授权的外部动作与真正扩大的目标。" },
      { title: "确认由谁施工", detail: "写入前核对当前文件或项目的实际责任范围，保留并发任务的成果。" },
      { title: "执行并回读", detail: "在已获准范围内完成；若授权、施工占用或目标身份不符，只停对应写入并说明怎样接续。" },
    ],
    shortTitle: "授权与 Owner",
    title: "长期授权、无限制授权与施工责任",
    teaser: "同一目标不反复索权，多个任务不互相覆盖；本人主动限时授权按真实范围和截止生效，不再固定24小时。",
    status: "当前活动授权规则已核验；本人限时接管沿现役unrestricted入口办理，真实范围、原截止与执行结果分别回读。本网页没有重做本人验证因子。",
    statusTone: "pass",
    value: "无论当前是 Codex 还是通过电脑 MCP 工作，它都使用该运行框架自己的真实任务身份。它同时解决两个麻烦：已经明确允许的事不必每一步重新问；并发任务又不能因为拿到大目标，就随意扩大到别的文件、账号或外部动作。",
    why: "“把网站发布好”不等于任何子代理都能改任何仓库。两项任务若碰到同一文件，还可能互相覆盖、各自声称完成，或者在交接时把未收尾的义务丢掉。",
    example: "“这个网站修好后发布到原地址，别每次再问，也别盖掉其他任务。”这项原范围授权继续有效。另有明确需要时，我可以申请一段限时授权，自己填写时长并验证；它不靠模型自报身份或打开窗口就成立。",
    result: "普通任务持续推进，谁改什么和未完成义务清楚。限时授权返回真实范围、原到期时间和撤销状态；取消本次申请不会撤回其他有效权限，也不会替我执行下一项业务。",
    readerStates: {
  "pass": "原目标授权和施工范围明确时继续；限时授权另外以真实本人验证、范围和原截止为准。",
  "problem": "目标扩大或并发冲突只暂停对应修改；有效期不会随重连延期。",
  "unavailable": "缺实际账号、工具或本人验证时不假报权限，已经可做的普通工作继续。"
},
    searchProjection: {
  "intents": [
    "同一目标已经授权为什么还反复问",
    "当前对话怎样申请无限制授权和撤销",
    "限时授权如何保持原截止",
    "谁正在修改这个范围",
    "怎样保留未完工作与私有配套"
  ],
  "entities": [
    "durable explicit user authorization",
    "durable goal scope / registered target",
    "Execution Owner / CAS",
    "external effect / threadId",
    "public project private companion",
    "ignored untracked material",
    "PRIVATE manifest / default-branch read-back",
    "rollback rename / local-only link"
  ],
  "relations": [
    "用户授权不等于 UAC 或 Agent 身份",
    "目标和授权由本人确定，实际外部动作重新核对已登记目标与当前条件",
    "Execution Owner 协调写入范围但不制造授权",
    "有 residual 的旧 Owner 通过 checkpoint 转给真实 successor",
    "PUBLIC worktree只筛明确ignored材料",
    "PRIVATE远端hash回读先于替换原件",
    "local link必须继续不进入PUBLIC staging"
  ],
  "failureRecovery": [
    "重叠 Owner 按所属运行框架核查；保留有明确当前施工证据的范围，治理中的未知遗留占用按精确范围释放；实际接续另核对在途操作",
    "目标或执行入口变化时停止使用旧依据，重读当前事实后只在原授权范围内继续",
    "真实工具返回 deny 或 unavailable 时按现场结果停止",
    "PRIVATE target可见性或远端回读失败时保留原件",
    "link进入PUBLIC status时回滚rename并停止",
    "非 fast-forward时保留双方改动并停止推送"
  ]
},
    decisionImpact: ["本机低风险可逆操作可直接继续。", "用户明确标记的长期授权在冻结 goal/scope 内跨轮次、压缩、root、全部 child/后代和新顶层任务持续有效。", "前提成立时必须真实调用一次，不因通用工具说明、缓存失败或 AI 预判再次索权。", "system/developer、实际 deny/step_up/needs_evidence/action-time confirmation 与现场身份、CAS、target、read-back 失败仍有效。", "用户私人账号空间在没有 public/share 信号时与本机私密目标等价可信。", "PUBLIC 个人数据只有 L3+ 才进入可能敏感审查，L1/L2 不因属于个人数据而删改。", "PUBLIC 项目的有价值 ignored 私有材料不是自动丢弃物；没有现成 PRIVATE 远端覆盖时，应在不打开已推送版本正文的前提下收敛进唯一 PRIVATE companion。", "重叠 Owner 按所属运行框架核查；日常治理没有明确施工或在途证据的遗留占用默认释放。", "治理释放使用自己的真实身份、新鲜项目指纹和逐范围 Release -GovernanceRelease，保留检查点与未完事实，不制造宿主终态或业务完成结论。", "实际接续在途执行仍需真实生命周期、命令与事务证据；RecoverReleaseClaim 不是日常治理结束未知占用的前置。", "只有真实 threadId 可归档，clientThreadId 只是创建中回执。", "complete goal 是关闭状态；来源任务仍须确认无 follow-up、queue、pending transaction 和 Owner residual 才可逆归档。"],
    problem: "用户说要完成一件事，不等于任何代理都能对任何对象执行所有动作。系统必须区分用户授权、操作系统权限、最高权限身份、目标是否仍是原目标、施工范围是否被别人占用，以及动作完成后是否有正式回读。",
    implementation: [
  "harness_owner_identity（运行框架施工身份）明确区分 HarnessId、RuntimeId、OwnerTaskId；无可取用任务 ID 的宿主可为当前执行单元生成一次稳定协作 ID。它不冒充宿主 ID 或最高权限，也不在每次重连时重建。 PUBLIC git status与check-ignore还需确认本地链接仍被忽略、未跟踪和未暂存；skip-worktree不替代忽略或安全迁移。",
  "harness_execution_lease（施工租约）用于无法由本机生命周期解析器覆盖的宿主：Claim 回读有限 LeaseSeconds，到期停止新动作授权；精确 binding CAS 可续期，旧动作封装不延期。失联与到期都不代表完成，检查点和剩余责任必须保留。",
  "确需恢复无生命周期接口的在途执行时，等待旧动作授权失效，核清真实命令、工作区及事务，再用 InFlightObservationJson 与新鲜 revision 执行 RecoverReleaseClaim；未知在途结果不得填零。日常治理仅释放遗留占用时不以这些接续证据或租约到期为前置。",
  "低风险、可逆、范围内的本机读取、编辑和测试直接推进；消息、外部写入、发布、部署和付费需要明确授权。",
  "durable explicit user authorization 在冻结 goal/scope 内跨轮次、压缩、root、全部后代和新顶层任务持续有效；项目只能定义客观 precondition，不能把它降为 absent 或要求同轮重述。",
  "durable authorization attempt once 要求前提成立后真实调用一次 adapter/tool；只有实际 unavailable、deny、step_up、needs_evidence、action-time confirmation、error 或现场证据失败才决定本次结果。",
  "用户的目标、范围、禁止项和停止条件与可换实现分开；现行授权专题已移除CoreGoalCommitment与StepCapability作为普通工作前提，不据此声称PCConfig相关产品已经迁移或正式数据已经处理。",
  "owner_takeover_authorization 的规范类型是 unrestricted，用户可见名“无限制授权”；本人仍填写具体有限时长，默认当前对话，明确选择才扩到全局。真实本人验证后，在原范围与截止内，本人指令可优先于自有全局、项目、模型路由与AI审批规则；不覆盖系统/开发者/平台，不伪造能力或结果。旧emergency_conversation_authorization仅是迁移中的历史接口名，不再保留固定24小时。",
  "本人主动要求“无限制授权”、紧急授权或本人接管时，直接调用已安装 Invoke-OwnerTakeover.ps1 -Operation Open；Open 回执明确 grant_type=unrestricted，并返回本次应用配对与请求。本人在独立窗口填写有限时长并完成已登记因子；验证完成后由原生 Hook 按当前宿主绑定自动消费现役授权，不要求模型手工串联 Configure/Prepare/Activate/Status/Check。",
  "真实产品沿同一session/request/original expires_at消费；续聊、换模型、后代和局部执行不滑动续期，撤销/到期不从旧回执复活。本人验证只有Passkey、TOTP、Recovery、Account四类；Google/Microsoft是Account提供方，Passkey不是操作系统指纹/PIN的别名。源码已去掉窗口可见的机器ID，绑定仍在内部验证；具体scope与消费链以实际Status为准。",
  "已登记目标的reference固定原目标身份，live resolution说明当前可用动作、前提、回退与回读；实际副作用前重新核对。二者都不产生用户授权，也不证明动作已经发生。",
  "scope（施工范围）按实际负责的工作划分；scoped execution owner（范围化施工责任）先Inspect，普通Claim/Add/Expand等优先用ExpectedProjectFingerprint比较本项目完整bindings；AuthorizeAction按ExpectedBindingId回验当前task/project/scope/action，返回v2单次封装。旧revision兼容，恢复仍要求精确全局CAS；纯只读审计不需要排他绑定。",
  "日常治理按所属运行框架作相称核查；只有明确的当前施工或在途操作证据才保留占用。active 标签、未到期租约、缺少回执或接口、未知状态都不独立构成长占理由。治理者用自己的真实身份和新鲜项目指纹，逐精确范围 Release -GovernanceRelease 并回读剩余绑定，保留原检查点与未完事实，不宣称宿主终态、进程已停或业务已验收。冻结、暂停与不推送要求继续有效。",
  "实际接续执行仍按所属运行框架核对生命周期和在途效果。固定 Codex resolver 只覆盖对应本机 Codex；读取物理 CODEX_HOME，兼容目录须验证指向同一根，不能借另一框架的同名任务或本机不存在证明终态。已有 clean terminal 且无残余时可 RecoverRelease，有真实接续责任时带 checkpoint 使用 RecoverReleaseClaim；这些恢复门不是治理释放的前置。",
  "来源创建的顶层任务只有取得真实 threadId，且正式完成/停止后无 follow-up、queue、pending transaction 或 Owner residual，才由来源可逆归档；complete goal 已关闭，不算 open residual。",
  "当前已认证账号属于用户、目标默认私人且没有 public/share 信号时，私人账号空间与本机、workspace 和 BitLocker 盘同属 default trusted target（默认可信目标）；可信不等于已授权写入。",
  "PUBLIC 个人数据按唯一 L1–L5 表判断最终载荷整体；没有达到 L3+ 的正面证据时默认按 L2，项目不能靠自写规则把 L1/L2 变成受限内容。",
  "进入项目维护或准备PUBLIC内容前，按project-entry-gate向Git Owner发现现存私有配套文档。PUBLIC伴随材料仅处理Git明确ignored、未跟踪且有保留价值的本地材料，先copy/hash与PRIVATE默认分支回读，再用可回滚rename和ignored链接保留原入口，不把秘密或私有映射送入公开仓库。",
  "链接配套仓库是实际改动的另一来源；收尾必须覆盖本任务真正修改的所有仓库，各自验证、定向提交、normal push和默认分支回读。只读到链接或修改PUBLIC仓库，不自动授权修改配套正文；未修改仓库不为了“全收口”制造提交。",
  "Git完成与业务完成分别报告；授权实施默认包含定向提交、正常推送和默认分支回读。本轮明确只本地、不提交或不推送时按该范围验收，不把已排除动作记作未完义务。"
],
    flow: [
  "解析现实 effect 和目标",
  "判断当前请求或既有 durable grant 是否已明确覆盖精确动作",
  "本人明确申请限时接管时直接用已安装Open入口，填写时长并完成一次本人验证；由宿主沿同一请求读取真实范围与原截止。模型不手工串联内部Status或Check，不先派额外模型批准，也不反复重开窗口。取消只结束本次申请。",
  "前提成立时真实调用一次，并保留实际 tool result 分类",
  "解析 registered target 的当前状态和允许动作",
  "Inspect Owner；实际施工保留并协调，日常治理的未知遗留占用可直接按精确范围释放；需要接续执行时另外核清生命周期与在途责任，再领取最小 scope",
  "只使用已授权且现场条件成立的精确动作入口，不额外要求建立旧目标账本或步骤能力",
  "在副作用边界重读目标事实后执行",
  "若目标是PUBLIC ignored私有伴随材料，先筛候选并现场重验唯一PRIVATE companion，再按复制/远端回读/可回滚替换/link状态链执行",
  "取得 owner receipt、read-back 和必要的 Git 收口",
  "释放 Owner，或将未完 residual 连同 checkpoint 原子移交"
],
    concepts: [
  {
    "term": "CoreGoal（历史方案）",
    "explanation": "旧集中目标执行方案的名称，现行普通授权不依赖它。目标与明确授权继续有效，不因实现调整重复确认；真正扩大范围才重新判断。"
  },
  {
    "term": "无限制授权（OwnerTakeover）",
    "explanation": "本人验证后对明确范围授予一段有限期限的自有规则优先权；不是固定24小时，不滑动续期，不是平台权限或另一电脑的授权。"
  },
  {
    "term": "Durable explicit user authorization（耐久明确用户授权）",
    "explanation": "用户已明确、持续同意的窄授权；在冻结边界内不要求 root、child 或 successor 同轮重述。"
  },
  {
    "term": "Attempt once（真实尝试一次）",
    "explanation": "所有前提满足后必须实际调用 adapter/tool 一次；unavailable、failed 与 dispatch-unconfirmed 由真实结果区分。"
  },
  {
    "term": "步骤能力（历史方案）",
    "explanation": "旧方案用于绑定一次动作的凭据；现行普通工作沿各产品真实入口核对授权、目标与回读，不要求另外建立这套能力。"
  },
  {
    "term": "Execution Owner",
    "explanation": "协调谁在改哪一块，不替代事实 Owner，也不产生用户授权或管理员权限。"
  },
  {
    "term": "Registered target",
    "explanation": "reference 证明目标是谁，live resolution 说明现在能做什么；两者都不证明动作已发生。"
  },
  {
    "term": "Public personal data classification（公开个人数据分级）",
    "explanation": "跨项目唯一的 L1–L5 表；只有 L3+ 才进入个人数据可能敏感审查。"
  },
  {
    "term": "Project publication restriction authority（项目公开限制授权）",
    "explanation": "项目收紧 L1/L2 默认时，必须有真实项目需要和用户对精确项目、范围、限制的明确授权；项目自写不成立。"
  },
  {
    "term": "Source task auto archive（来源任务自动归档）",
    "explanation": "来源只在真实 threadId 已解析、任务终态且无后续、队列、pending transaction 或 Owner residual 时执行可逆 archive。"
  },
  {
    "term": "Private companion（私有伴随仓库）",
    "explanation": "为一个PUBLIC项目保存Git明确忽略但有价值的私有材料的唯一已登记PRIVATE目标；映射和本机指针不进入PUBLIC提交。"
  }
],
    boundaries: [
      "UAC（Windows 管理员确认）只提升 Windows 进程权限，不扩大任务授权",
      "耐久授权不覆盖 system/developer/platform、实际 deny/step_up/needs_evidence/action-time confirmation，也不扩大目标、账号、公开面、付费、秘密或不可逆边界",
      "限时接管只消费本人实际选择的范围与原截止；必要后代沿同一引用执行，不另颁更长期限，新对话或另一电脑不自动继承。它不伪造密码学、外部工具能力或结果，也不把候选当活动规则。",
      "子代理、shell、worktree 和插件不能绕过已有重叠 Owner",
      "force-push、新公开面、付费和不可恢复动作不在默认收敛授权内",
      "PRIVATE 或可信目标不等于已经授权写入",
      "L1/L2 不受个人数据公开限制；真实 secret、第三人授权、许可和 external effect 授权仍是独立边界",
      "PRIVATE companion不接管tracked/unignored候选，不用skip-worktree、硬链接或改公开.gitignore隐藏内容，也不迁移可重建cache、活数据库和大制品"
    ],
    failures: [
  {
    "condition": "本次限时授权过期、撤销或会话/范围不匹配",
    "response": "停止消费这份临时优先权，保留普通已授权工作的真实范围；不换编号、借另一对话或重写原截止。"
  },
  {
    "condition": "本人取消或验证未成功",
    "response": "结束本次未完成请求，不自动重开、换因子或撤回其他有效授权；只有之后明确新请求才重新办理。"
  },
  {
    "condition": "目标或 executor 漂移",
    "response": "停止使用已变化的目标或执行依据，现场重读后确认原授权是否仍覆盖；只继续确实可做的部分，不用旧回执追认新对象。"
  },
  {
    "condition": "发现重叠 Owner",
    "response": "按所属运行框架核查真实施工；仍在工作的 Owner 只发一次有界请求。日常治理没有明确施工证据的遗留占用直接按精确范围释放，保留检查点，不用 active 标签或接口缺失长期挡住工作。"
  },
  {
    "condition": "长期授权已覆盖但平台结果未知",
    "response": "真实调用一次；按 unavailable、deny、step_up、needs_evidence、error 或 dispatch-unconfirmed 的实际结果收口，不靠预判。"
  },
  {
    "condition": "旧任务已归档但有 open goal 或 turn_aborted",
    "response": "保留旧任务归档。治理释放不需要唤醒它或虚构接续者；确需接续已有执行时，核清宿主、在途操作和检查点后按 RecoverReleaseClaim 交给真实接续任务。"
  },
  {
    "condition": "Git 非 fast-forward",
    "response": "停止推送并解决同步，不使用 force-push掩盖冲突。"
  },
  {
    "condition": "任务仍有 residual",
    "response": "普通施工收尾记录 checkpoint 并转交真实接续任务；治理释放可保留未完材料而结束占用，两者都不能把未完业务宣称完成。"
  },
  {
    "condition": "PRIVATE companion可见性、copy/hash、commit/push、default-branch/hash回读或local link状态任一步失败",
    "response": "远端回读前不替换原件；替换后失败则用同卷rollback rename恢复原件，移除有问题的link并保持PUBLIC状态不含候选。"
  }
],
    sources: [
  {
    "path": activeRuleSourcePath("authorization_contract"),
    "role": "当前长期授权、本人主动限时授权及精确动作边界"
  },
  {
    "path": "E:\\.agents\\tools\\Invoke-ExecutionOwnerRegistry.ps1",
    "role": "Owner CAS、scope transition 和 action authorization 入口"
  },
  {
    "path": "E:\\.agents\\tests\\Test-ExecutionOwnerRegistry.ps1",
    "role": "Owner claim、冲突、移交和恢复回归"
  },
  {
    "path": "E:\\PCConfig\\tools\\Invoke-OwnerTakeover.ps1",
    "role": "本人接管产品的源码定位；当前已安装入口与宿主消费链由PCConfig核验，网页不运行验证或用源码存在证明安装成功。"
  },
  {
    "path": "E:\\PCConfig\\docs\\design\\owner-takeover.implementation.pending.md",
    "role": "当前实现记录中的真实普通MCP入口、安装epoch218、本人验证及后代期限验收；不消费其中其他对话的授权"
  }
],
    verification: [
  "当前活动 release 描述符确认授权专题路径、SHA-256和字节来自同一完整集合。",
  "ExecutionOwnerRegistry 聚焦回归验证 Claim/Add/Transfer/Release、RecoverRelease/RecoverReleaseClaim、complete goal 与 archived lifecycle 语义",
  "2026-09-02 的 E98/CoreGoalV2 固定24小时检查仅是旧实现历史，不描述当前 OwnerTakeover。2026-09-19 来源先记录 Open→本人 Passkey→Status 正向链、子 PowerShell 和管理员期限传递；随后 357d0d8 把默认8小时、0.5～72小数输入与共享 B2 前置正式安装到 AuthorityHost epoch220 并复验。本网站不重验本人因子，也不继承源任务实际授权。",
  "当前活动规则仍要求私有配套先完成 PRIVATE 默认分支与字节回读，再以可回滚替换保留原入口；本网页没有执行迁移。",
  "Git 结果必须另由 Git owner 现场确认 default branch、remote 和 push read-back"
],
    relation: "这个模块决定谁被允许做哪一步；能力路由只推荐方法，保护策略只证明重大动作使用哪一代规则。",
    readerStatus: "已明确的授权可以在原范围继续使用；限时接管另由本人填写时长并验证，本网页没有重新办理授权。"
  },
  {
    slug: "protected-policy",
    usageEntry: "在本机已接入 PCConfig 与活动规则的 AI 对话中明确说出资料访问或设备保护需求；具体本人验证使用现有入口。",
    usageInputs: ["要访问的资料或要保护的设备范围", "当前操作目标与紧急程度"],
    productFlow: [
      { title: "分清需求", detail: "AI 区分普通资料期限、主动锁屏、本人接管与真正的设备或磁盘保护。" },
      { title: "检查适用资格与状态", detail: "只在需要的保护判断里核对已登记主体、真实验证和恢复条件；普通任务继续。" },
      { title: "告知实际结果", detail: "分别说明规则已生效、资料是否可用、保护动作是否执行及怎样恢复；取消一次验证不被说成全部恢复。" },
    ],
    shortTitle: "保护策略",
    title: "规则生效、资料解锁与重点保护，分别证明",
    teaser: "规则发布不解锁私人资料，资料解锁不产生密码或磁盘权限；本人取消本次验证，也不把其他已经生效的授权一起撤掉。",
    status: `${panelSnapshot.authority.releaseId} current 已验证；previous=${panelSnapshot.authority.previous?.release_id || "无"}，C 盘生产读者为 0`,
    statusTone: "mixed",
    value: "重要操作不能靠一句“通过”把全部状态混在一起。规则看哪一版已生效；需要私人资料时核对共享解锁和截止；密码、设备与磁盘动作另看自己的真实因子和条件。普通代码工作不因此一律等待最高模型。",
    why: "如果取消一次验证就把另一份有效授权也撤掉，人会反复受打扰；如果规则校验通过就当作资料、密码或磁盘都能操作，又会越过实际权限。把这些结果分开，才能知道哪些工作可以继续、哪一步确实还要本人处理。",
    example: "“我取消了刚才那次本人确认，之前获准查看的资料还在有效期吗？”系统只结束被取消的请求，核对原来的到期时间；真正到期或本人锁定后，所有已连接入口停止新的私人资料读取。",
    result: "我会知道目前生效的是哪套规则、私人资料是否仍在原期限内，以及设备或磁盘保护是否另需本人办理。取消一次验证不等于全部撤销，某层尚在关闭或证据不足也会明说。",
    readerStates: {
  "pass": "当前活动版本有效；私人资料只在共享期有效且视图就绪时使用，独立特殊动作仍按自己的权限。",
  "problem": "取消只终止本次验证；到期或主动锁定先停私人交付，再安全关闭。占用未释放时报告正在关闭，不冒充已锁。",
  "unavailable": "运行实现、状态或物理视图未知时停止依赖它的私人动作，普通工程与最小恢复继续。"
},
    searchProjection: {
  "intents": [
    "当前活动规则到底是哪一版",
    "怎样发布新规则并保留上一版回退",
    "真人确认前必须演练哪些路线",
    "四类因子演练为何不能只用mock",
    "dirty source 为什么不能冒充 current",
    "C 盘旧规则故障会不会阻塞现在"
  ],
  "entities": [
    "E release",
    "current pointer",
    "previous release",
    "release record",
    "ruleset SHA",
    "expected-preimage CAS",
    "PRIVATE main"
  ],
  "relations": [
    "一版目录绑定正式专题、兼容文本与入口模板",
    "当前和上一版按完整文件集合验证",
    "资料解锁与规则生效分别判断",
    "来源草稿不能覆盖活动版"
  ],
  "failureRecovery": [
    "任何完整发布文件不符就保留可验证版本",
    "取消不重放，不改变其他有效资料或接管截止",
    "关闭未完成不冒充资料已锁"
  ]
},
    decisionImpact: [`Rules 页面当前显示 ${panelSnapshot.authority.releaseId}，不再显示 generation 79 或 candidate/productionActivation。`, "dirty source 是未激活施工，不能覆盖 frozen release。", "C Authority unavailable 不再阻塞 Hook、spawn、Skill、Owner CAS 或普通项目。", "小而已知的规则 diff 可走 change-surface fast validation；触及保护/身份/Owner 等边界自动回标准路径。", "普通Windows锁屏与私人资料解锁是不同动作；资料只消费同一有效共享期，取消不撤回另一有效期。需要独立设备或磁盘保护判断时，才使用其登记主体和实际模型资格。"],
    problem: "如果网页把 dirty source 当 current，就会把未完成施工冒充规则；如果继续读取 C Authority，又会让已退役平台影响当前任务。模块必须同时展示 E current、source candidate 和 C recovery-only 三层。",
    implementation: [
  "当前活动release按同版rules-catalog.json读取共同约定与九个职责专题；完整发布集合另含目录和入口模板，路径、字节和SHA-256全部核验，数量来自已验证描述符。E166不再生成六份旧主题拼接别名；历史版本仍按它自己的集合验证和回退。",
  "Invoke-EAgentRulesRelease.ps1是现役Inspect/Prepare/Activate/Rollback入口；规范源、已提交远端、候选与current/previous分开。准备和网络操作不长期占用指针锁，最终比较当前指针和实际受影响输入，冲突不覆盖。 实际 current/previous 指针位于 releases/current-rules.json，版本目录与指针分别核验。",
  "受保护目录及指针保持真实ACL与发布记录验证。公开页只读取已激活同版集合，未提交来源可以作为候选说明，但不能生成当前规则。旧v1/v2依各自完整集合验证，不强制伪装成新目录。",
  "此前E82–E118逐步加入原文语义保真、有限任务上下文、明确跨项目责任、局部CAS与快速发布。这些是历史阶段，不代表当前仍固定五文件或把180秒观察目标当资格门；现行规则发布专题拥有最新条件。",
  "资料访问按当前活动规则的一份共享 B2 状态与原截止处理：本机、GUI、AI及已认证 MCP 不再分别签发偏好屏锁期、任务因子期和 MCP 独立期。取消或超时只结束本次未完成请求，原有有效资料期不被撤回；到期、本人主动锁定或重启才使旧期失效。PCConfig 的 P1/P2 状态、统一时长和消费者已完成正式安装复验，P3 真实加密合成实验也已通过；这些证据仍不证明正式生产部署、真实资料迁移、P4 恢复、生产物理视图关闭或真实私人资料使用。",
  "personal_environment_privacy由PCConfig唯一资料记录持有。旧StatusPersonalEnvironment、CheckPersonalDataAccess、LockPersonalEnvironment、VerifyPersonalEnvironment只是共享状态/检查/锁定/解锁的兼容入口，不分别维护frozen位或授权库。",
  "资料期的当前默认由PCConfig读取，小时输入规范默认8、允许0.5–72小数并明示分钟与截止。只改本次不改默认，改默认不改变已颁发期。重启、原到期或新锁定使旧访问失效，重开界面/模型/服务不滑动续期。",
  "未解锁而确需私人资料时，本地四选一或现有手机TOTP直接办理；不先派模型批准或做两次因子。验证真实成功、视图就绪才可读，等待本身不撤回另一有效资料期。",
  "取消、拒绝、超时和技术失败分别记录；本次未完成验证只结束自身，五分钟是已显示请求的期限，不再是冻结倒计时。可靠取消不自动重试、重开或换因子，迟到成功不能复活已取消请求。",
  "资料到期/主动锁定先撤销共享期，停止私人取用、旧上下文复用和新结果交付，再释放本产品句柄、保存已确认写入并关闭指定目录。第三方仍占用时报告正在关闭；不强杀、不丢未保存内容、不暗延期限，全部目标关闭才报告已锁。",
  "已认证MCP与本机消费同一资料期，不再用连接授权推导个人资料可读。目录外文件、云端、索引、记忆及先前私人上下文也不能绕过资料锁定；通用工程、非私密状态、机械密文备份和独立密码/恢复/本人接管入口继续按各自条件工作。",
  "确认本机真实新输入缺应有Hook时，旧codex_missing_hook_freeze名称映射到同一个资料锁定事件。投递未定为未知，同一持续缺失不反复失效新授权；MCP没有本机Hook不因此触发锁定。Windows屏锁是桌面动作，不是资料解锁因子。",
  "最高权限主体仍独立登记，当前为codex-root；常规受保护判断需真实GPT-6 Sol High+或Astra High+宿主证据，重大后果与相关实质疑点升级至Astra High+。宿主已证明合格的根可自判，目标/授权/关键事实未变时可复用有效判断；标题、模型自述、用户型号声明及因子均不伪造模型证据。判断资格、主体登记、授权与执行分别核对。",
  "疑虑判断依据当前连续原话、目的与已合法可用现场，不为辨人读取个人理解库、表达样本、聊天或健康财务档案。口误、偏好改变、资料未加载与工具故障本身不证明非本人。",
  "本人无限制授权使用 OwnerTakeover 直接入口，不先要求保护判断、CoreGoal或指定模型批准。Passkey/TOTP/Recovery/Account为四类本人验证，Google/Microsoft是Account提供方；操作系统PIN或指纹不是独立类别。",
  "独立设备/磁盘保护分别核对合格判断、实际授权、精确目标和恢复条件。正式可见邀请后有完整十分钟；普通刷新、重连、取消或人的超时不重置，只有真实软件故障修复并重新呈现可用邀请才重新计时，且不延长原资料或接管权限。",
  "日常验证只核对本次所选可用方式和必要状态；未指定时可选任一健康登记方式，明确指定的路径故障必须先修复，不静默换因子。因子、邀请或保护产品发生实现/安装/接口变化时，才按真实影响面做生产等价回归；因子可合成，相关执行与恢复沿同一生产函数。",
  "环境隔离只映射文件、注册表、任务、互斥及签名/因子根的位置，不能改候选控制流来制造PASS。E规则激活不走本人因子产品；UAC只授Windows临时写能力，规则异常不自动改变设备信任或触发磁盘动作。",
  "当前保护与资料专题已统一：普通取消只结束本次未完成请求，不撤销另一段有效资料期。网页仍把规则发布、PCConfig P1/P2 安装、P3 合成加密实验、正式生产部署、真实资料迁移、P4 恢复和实际安全关闭分层验收，不把前一层通过冒充整链完成。"
],
    flow: [
  "核验当前活动版本及同版完整文件集合。",
  "按普通工程、私人资料或独立特殊动作选择相应入口。",
  "私人资料核对共享解锁、原截止、开机/锁定代次和实际视图。",
  "取消只结束本次请求；到期/主动锁定停止私人交付并安全关闭。",
  "重点保护单独核对合格判断、真实因子、目标与恢复结果。",
  "保存已证结果与Unknown，不从旧状态或来源草稿宣称全部通过。"
],
    concepts: [
  {
    "term": "活动规则",
    "explanation": "已发布并激活的同版集合，不能由源码草稿或标题替代。"
  },
  {
    "term": "正式专题与发布文件",
    "explanation": "专题用于按问题阅读，完整性校验覆盖同代目录列出的真实发布文件和入口模板。当前不再生成旧主题拼接别名，历史版本按当时集合核验，不能混成当前主题。"
  },
  {
    "term": "共享资料期",
    "explanation": "本机与已认证MCP消费同一解锁和原截止；连接本身不授资料权限。"
  },
  {
    "term": "正在关闭",
    "explanation": "私人交付已停止，但指定目录或句柄尚未完全关闭；不是已锁成功。"
  },
  {
    "term": "生产等价演练",
    "explanation": "使用相同候选和生产执行链，只替换因子与隔离位置，实际本人、设备和物理动作仍独立验收。"
  }
],
    boundaries: [
  "普通代码与非私密状态不受资料锁定阻断。",
  "资料解锁不授密码明文、恢复、本人接管或磁盘权限；反向也不自动延长资料期。",
  "取消不复活已失效期，也不授权继续本人刚取消的业务。",
  "关闭尚未完成必须明确，不能追回已经交付第三方的明文。",
  "规则错误、网络或程序故障不自动构成设备入侵，也不建立新安全平台。"
],
    failures: [
  {
    "condition": "本次资料验证取消或超时",
    "response": "终止本次未完成请求；原有效期资料继续到原截止，不自动重开或锁盘。"
  },
  {
    "condition": "到期或主动锁定后有第三方占用",
    "response": "先停止私人取用和交付，报告正在关闭及真实占用；保存已确认写入，不丢用户未保存内容。"
  },
  {
    "condition": "活动文件、视图或当前绑定不一致",
    "response": "只停止依赖它的动作，保留原件与明确未知，不从旧active或能读文件猜解锁。"
  },
  {
    "condition": "资料规则与来源旧句冲突",
    "response": "沿拥有该语义的同版资料专题说明，列出尚未统一的来源与未验运行层，不擅自修来源项目或宣布全绿。"
  }
],
    sources: [
  {
    "path": activeRulesCatalogPath,
    "role": "同版正式专题、兼容引用及模板目录"
  },
  {
    "path": activeRuleSourcePath("privacy_data_contract"),
    "role": "共享资料解锁、取消、到期与安全关闭的当前定义"
  },
  {
    "path": activeRuleSourcePath("protected_actions_contract"),
    "role": "独立重点判断与设备/磁盘执行、因子及演练；资料取消语义以当前共享个人资料专题为准"
  },
  {
    "path": "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1",
    "role": "活动版本准备、激活、回退与只读校验"
  },
  {
    "path": "E:\\PCConfig\\tools\\personal_environment.py",
    "role": "资料生命周期实现；本轮仍见未提交候选，不作已安装验收"
  }
],
    verification: [
  `本轮 Inspect 确认 ${panelSnapshot.authority.releaseId}、${panelSnapshot.authority.gitCommit} 与 ruleset ${panelSnapshot.authority.rulesetSha256}；${panelSnapshot.authority.releaseFileCount} 个完整发布文件与 ${panelSnapshot.authority.primaryTopicCount} 个正式专题分别校验。`,
  "当前源码、安装、真实解锁视图与第三方占用下关闭尚未在本网页任务独立验收。已有规则与来源测试不替代本人验证、磁盘保护、重启或新会话实测。",
  "旧日期的工具、模型和设备验收留作历史；没有重跑的场景不批量更新日期或声称通过。"
],
    relation: "本模块解释活动E规则与独立重点保护；用户授权归授权专题，施工责任归协作专题，Git与交付归工程专题，原生型号和分工归Codex适配。旧CoreGoal不再作为普通授权前提。",
    readerStatus: "当前规则版本已核验。资料是否仍可使用、重要设备动作能否执行，要分别看共享期限和对应产品的实际状态。"
  },
  {
    slug: "skills-plugins",
    usageEntry: "在已接入能力目录的 AI 对话中直接描述用途，或在本站 Skills 页查入口；具体运行仍由对应工具完成。",
    usageInputs: ["要做的事和材料类型", "是否已有指定 Skill、插件或账号"],
    productFlow: [
      { title: "按用途找入口", detail: "AI 在当前目录中找真实可用能力，告诉你需要的材料、账号或本机环境。" },
      { title: "执行对应工作", detail: "取得所需授权后由实际 Skill、工具或连接器处理，不把能找到入口当成已安装且能完成。" },
      { title: "读回结果", detail: "交回文件或操作结果；来源、安装、当前任务与真实使用分别说明，缺一个只标该层缺口。" },
    ],
    shortTitle: "Skills / Plugins",
    title: "个人 Skills 与插件供应链",
    teaser: "一份清单管住能力的唯一源码和安装入口，再把 source、install、current、fresh、E2E 五层分别验清；浏览连续性仍以真实页面和平台回读为准。",
    status: "供应源码、安装和事务当前通过；运行 E2E（端到端验证）不能由安装推断",
    statusTone: "mixed",
    value: "它让我能按用途找回已经保留的能力：把选定图片放大到指定尺寸、分析一份 Windows 卡顿轨迹，或读取指定 .NET 方法的字符串。查清实际入口、运行条件和证据后再使用，不需要记住脚本名。它也防止同一个 Skill 出现几份漂移源码，或看见文件夹就被说成已经可用；每一层只证明自己的事。",
    why: "一个能力写好了，不代表当前对话能找到它，也不代表它能在真实任务里工作。这里帮我按用途找到正确工具，并分清来源、安装、当前可见、下次新任务可见和实际完成。",
    example: "我可以说：“以前把图片放清楚的工具在哪？把这张图做成指定尺寸。”系统先查现有用途清单，确认原图、画幅和目标，再用已有工具交回新 PNG，原图保留。如果我问“这个 Skill 已经写好，为什么新任务看不到”，才逐层检查源码、安装、当前任务、全新任务与真实场景，说明具体缺口和恢复入口。",
    result: "问“以前让图片更清楚的工具在哪”时，会拿到真实入口、要提供的原图与目标尺寸，以及已有使用证据；实际运行才会产生新图片。工具找不到或新任务仍看不到时，会指出具体卡在哪一步。",
    readerStates: {
      "pass": "工具来源、安装和这次实际使用各有结果；只把已证实的那一步说成成功。",
      "problem": "目录指错、安装中断或新任务找不到时，说明受影响的入口和恢复办法，不把全部能力都说坏了。",
      "unavailable": "唯一来源或安装位置读不到时，明确说现在无法确认；旧文件或旧测试不能证明它今天可用。"
    },
    searchProjection: {
      intents: ["Skill 文件有了为什么新任务仍看不到", "怎样安装或恢复个人 Skill", "浏览器控制断开后怎样保留旧标签页继续", "上传到100%为什么还不能说成功", "如何区分源码安装和真实可用", "退役 Skill 为什么不会被残留目录复活"],
      entities: ["personal-skill-supply registry", "canonical source", "junction", "transaction installer", "recovery capsule", "browser controlled tab / authoritative success", "fresh task", "E2E"],
      relations: ["Registry 声明安装意图而 junction 只负责发现", "canonical source 与用户发现目录不是两份源码", "source、install、current task、fresh task 和 E2E 分层证明", "浏览 Skill 调用宿主管理的 Provider 而不复制浏览器客户端", "插件可以供应 Skill 但二者不是同一层"],
      failureRecovery: ["Source 映射漂移时不从用户目录反向复制", "安装事务中断时按 recovery capsule rollback 或 reconcile", "浏览控制重置时先恢复同一标签页并重新读页面", "上传进度不等于成功时读取权威状态和最终记录", "当前任务无回执时保持 Unknown", "退役残留只清理发现路径而不恢复能力"]
    },
    decisionImpact: ["Source（源码）、quick validation（快速校验）、junction（目录联接）和 transaction（安装事务）全部通过才算安装层健康。", "Current task（当前任务）、Fresh task（全新任务验证）和 E2E（端到端验证）没证据时显示 Unknown（证据不足）。", `当前公开范围内${panelSnapshot.skills.publicInstallIntentCount}个安装意图与${panelSnapshot.skills.selectedPublicCount}个公开条目分别回读；公开项中个人入口${panelSnapshot.skills.personalSelectedCount}个、宿主集成${panelSnapshot.skills.hostIntegratedCount}个。browser-control-continuity的既有fresh自然路由只证明当时场景，不证明未来任意浏览任务。`, "安装中断时按 recovery capsule（恢复胶囊）回滚或 reconcile（收敛修复）。", "退役 Skill 的目录或旧测试不能让它重新出现。"],
    problem: "Skill 源码、用户目录可发现性、当前任务注入和真实自然语言 E2E 是不同事实。如果只看文件存在或 junction 存在就声称能力可用，最终会得到一份看起来很满、实际无法判断的清单。",
    implementation: [
      "E:\\.agents\\skills 与 plugins 是 canonical source；personal-skill-supply.json 是名称、来源和 install 意图的唯一 registry。",
      "用户目录只保存由事务 installer 创建的同名 junction，不允许手工维护第二份源。",
      "安装事务记录 intent、applied、pre-image 和 recovery capsule；回滚不依赖当前 registry，避免 registry 漂移后无法恢复。",
      "可用状态分成 source、install、current task、fresh task 和 end-to-end 五层；transaction 单独记录 install 过程与恢复，不冒充第六种可用状态。",
      "browser-control-continuity 只叠在当前 managed browser Provider 之上：保留受控标签页，登录先复用已有会话，再在本地 Chrome 选择匹配的已保存账号；普通填充不读取密码，弹窗选择、填充结果和登录成功分开证明。云端浏览器按自己的安全登录交接，不能假定拥有本地密码、Cookie 或扩展。必要时用受限 helper 补三个缺失运行文件，上传与提交分别要求页面/平台回读。",
      "外部提供但已经真实接入且有持续价值的能力可以进入面板，来源必须与个人维护区分。有复用价值的小工具不用各自立项：比如我说“以前让图片变清楚的工具在哪”，系统先按用途查现有清单，交回真实入口、需要什么环境、已有验证与备份，再按当前任务使用。图片超分改善观感，不能恢复未知真实细节；用过的工具和一次性过程文件按各自用途保留或清理。",
      "这里还包括资料搜索与核查、文档/表格/演示制作、数据处理与可视化、代码执行、浏览器和桌面操作，以及通过已连接账号使用的外部服务。它们按实际任务组合：给出问题与材料，选择必要入口，交回可编辑文件、图表、图片或真实操作结果。通用模型、原生工具和个人项目各自贡献不同部分；可发现的工具、已连接账号和具体任务验收仍分开判断。",
      "状态探针也是工具能力：读取电脑、服务、连接和端口的当前状态，或分析明确选定的系统轨迹，交回观测、异常与证据缺口。探针响应只证明所测的一层；接口通、程序启动和真实工作成功分别判断，不靠多跑检查制造健康结论。",
      "活动能力规则中的 local_tool_catalog_route（本机工具清单路由）只保留稳定入口：E:\\Tools\\LocalToolbox\\catalog.json。按用途查找用 E:\\Tools\\LocalToolbox\\Find-LocalTool.ps1 -Query '图片变清楚' -Json；它按关键词匹配，返回用途、实际入口、入口是否存在、说明、验证与备份，不执行工具、不采集、不联网。清单掌握工具事实，E 不复制工具型号或文件哈希。",
      "2026-09-14清单有9项：3个独立工具（图片超分、Windows轨迹分析、.NET方法字符串检查）、1条既有Codex打开做法、5个现有能力指针。新增可见一次性任务等待由PCConfig运行模块承接：能看检查状态并停止，排队提醒不等于AI已接到或业务完成。正式 Skill 和壁纸项目继续由各自来源维护；查询未命中或入口不存在时如实说明，不能把目录当全机工具的完整清单。",
      "选定工具的源码、必要运行依赖、许可和恢复说明已保留在固定工具目录，并保存 G:\\80_Backup\\Tools\\LocalToolbox\\lightweight-tools-20260909T062945Z.zip：42,880,045 bytes，SHA-256=3efe2caf405a643f82238d7611e5b8fe94c7cfe7b20dc6cb4e39678a11cbf6ac。这份9月9日包的大小与哈希只证明当时保留集，不证明9月14日新指针已加入旧包；当时4个正式能力指针也不代表对应项目全量入包，H冷副本未在本模块独立验证。轨迹分析器保全了源码与依赖，本轮未新采集或分析系统活动。三个独立工具的输入、输出与边界如下：",
      "图片超分入口 E:\\Tools\\ImageSuperResolution\\Invoke-ImageSuperResolution.ps1 接收本地 PNG/JPG/JPEG、全新 PNG 输出路径与 Width/Height；Real-ESRGAN ncnn Vulkan v0.2.0 先以 general（柔和绘画质感）或 anime（更锐利线条）模型真实放大4倍，再缩至指定尺寸。依赖 Vulkan GPU 与 LocalGpuBroker 串行租约；比例差超过约0.2%先另行扩图或裁切，已有目标拒绝覆盖，原图保持只读。清晰度改善不证明未知细节真实。",
      "Windows轨迹入口 E:\\Tools\\WindowsTraceAnalyzer\\runtime\\trace-analyzer.exe 只分析明确选中的 ETL（Windows事件轨迹文件），在标准输出汇总CPU、RPC、DPC/ISR（驱动中断处理）耗时和DWM（桌面合成器）事件间隔；可选第二个PID参数会在轨迹同目录写.focus.json。依赖Windows/.NET 10与TraceEvent 3.2.6；--collect的新15秒内核采集是另一项有授权的诊断，查工具不触发采集。画面刷新卡顿与鼠标键盘响应分开，汇总不能单独证明根因。",
      ".NET方法入口 E:\\Tools\\DotNetMethodStrings\\Get-MethodStringLiterals.ps1 使用 AssemblyPath、TypeName、MethodName 精确选择程序集、类型和方法，以JSON列出IL（中间语言）里的字符串常量。PowerShell 7独立进程加载选定程序集，结束释放且不修改原文件；不遍历电脑上的程序集。固定目录的示例程序集验收是2026-09-09历史事实，本轮没有读取真实程序或重新运行。",
      "图像生成与编辑也是系统可用的外部能力：描述画面或提供参考图，可通过当前宿主的 image_gen 入口生成封面、改背景和细节，并继续迭代；.agents 负责按需求选择和衔接，不开发基础图像模型，也不为每次模型换代另建项目。",
      "2026-09-09 已核对 OpenAI 官方图像生成文档，API 示例包括 gpt-image-2.5-sunburst 与 gpt-image-2.5-flare，支持文字生成与已有图像编辑。当前宿主的工具元数据证明图像入口可用，但没有暴露其实际后台型号；官方 API 型号、宿主工具接入与一次真实生成结果分别陈述，本轮没有为介绍能力额外生成图片。官方参考：https://developers.openai.com/api/docs/guides/image-generation"
    ],
    flow: [
      "从 registry 读取 active、inactive 和 retired 声明",
      "验证每个 canonical source 的 SKILL、编码和 frontmatter",
      "验证 discovery junction 精确指向 source",
      "检查是否存在 unfinished 或损坏的安装事务",
      "按宿主回执分别判断 current、fresh 和 E2E，不从 install 倒推",
      "浏览工作还分别核对同一标签页、异步控件、逐文件成功态与提交后平台记录",
      "新增或恢复时走事务 installer，失败时用 capsule 预览并回滚"
    ],
    concepts: [
      { term: "Canonical source", explanation: "唯一可维护正文；用户目录只是发现链接，不是第二份源码。" },
      { term: "Install intent", explanation: "registry 要求安装，不等于宿主已经注入，也不等于场景 E2E 已通过。" },
      { term: "Fresh task", explanation: "在安装完成之后启动的另一个任务真实看见该能力，不能由当前任务或旧回执替代。" },
      { term: "Authoritative success（权威成功态）", explanation: "页面或最终平台记录实际确认成功；文件名、100% 进度和导航都不能替代。" },
      { term: "Recovery capsule", explanation: "记录固定 roots、目标、source 和 pre-image，使 registry 漂移时仍能安全恢复。" }
    ],
    boundaries: [
      "不手工创建或修补 discovery junction",
      "源文件通过不能证明安装、任务注入或真实 E2E",
      "本地浏览 runtime 恢复不授权登录、上传、验证码、删除或最终提交",
      "退役 Skill 不会因历史目录或测试存在而恢复",
      "插件分发单位和 Skill 触发入口不是同一层"
    ],
    failures: [
      { condition: "Source 缺失或映射漂移", response: "供应验证 BLOCK，不从用户目录反向复制成新 source。" },
      { condition: "安装事务中断", response: "通过最新 recovery capsule 先预览，再执行 rollback 或在 desired state 完整满足时 reconcile。" },
      { condition: "当前任务没有回执", response: "显示 unknown，而不是把 install=true 翻译成已启用。" }
      ,{ condition: "浏览运行文件缺失", response: "先走官方刷新；只有同官方包族、只补精确缺失且不覆盖现有目标时，才用 Inspect→Repair，并在真实连接回读后凭 receipt Cleanup。" }
      ,{ condition: "上传显示文件名或100%，提交后发生导航", response: "仍不称为完成；逐个读取页面成功态，并从最终平台记录核对关键字段、附件数和文件名。" }
    ],
    sources: [
      { path: "E:\\.agents\\config\\personal-skill-supply.json", role: "个人 Skill 名称、source、kind 和 install 意图的唯一 registry" },
      { path: "E:\\.agents\\skills", role: "个人维护 Skills 的 canonical root（唯一维护根目录）" },
      { path: "E:\\.agents\\plugins", role: "插件提供 Skills 的 canonical root（唯一维护根目录）" },
      { path: "E:\\.agents\\docs\\personal-skill-supply-recovery.md", role: "事务安装、回滚、reconcile，以及五层可用状态与安装事务证据说明" }
      ,{ path: "E:\\.agents\\skills\\browser-control-continuity\\SKILL.md", role: "浏览标签页恢复、异步控件、逐文件成功态、提交回读与教训沉淀边界" }
      ,{ path: "E:\\.agents\\skills\\browser-control-continuity\\scripts\\Invoke-BrowserControlContinuity.ps1", role: "同官方包族三个精确缺失文件的 Inspect、Repair、哈希回读和 Cleanup helper" }
    ],
    verification: [
      "PersonalSkillSupply 验证 registry、source、junction 和事务",
      "2026-09-04 历史供应回读 29 个 active install intent、41/41 terminal transaction；当前数量以本页生成快照为准；browser-control-continuity source/install 通过，来源 Owner 的 fresh 自然路由验收通过",
      "网站任务未执行未来浏览站点、文件上传、最终提交或 helper 修复，不把供应/路由证明冒充新的页面 E2E",
      "PersonalSkillAutonomy 与 SemanticCuration 验证 metadata 是否窄而有用",
      "Current task、fresh task 和 E2E 必须来自对应宿主回执；本快照未取得的显示 unknown"
    ],
    relation: "Skills 供应提供窄能力入口，能力路由决定何时使用；授权合同继续约束它产生的现实 effect。",
    readerStatus: "能力说明与安装关系已核对，能据此找到现有入口；新任务是否能发现它、实际使用是否成功仍各自验证。"
  },
  {
    slug: "context-evidence",
    usageEntry: "在原 AI 任务中说“接着做”并指出目标，或点名只读诊断的项目与检查范围。",
    usageInputs: ["原目标和已完成部分", "想确认的状态层或项目", "是否仅检查、不修复"],
    productFlow: [
      {
        "title": "恢复本次目标",
        "detail": "AI 把原要求、更正、授权、未完成项与旧方案分开，不靠摘要猜当前状态。"
      },
      {
        "title": "向实际来源求证",
        "detail": "按问题查看项目、代码仓库或电脑的当前状态；若要求只检查，就明确是否会刷新远端信息。"
      },
      {
        "title": "说明能否接续",
        "detail": "给出证据日期、完成与未知层；冲突或来源读不到时只暂停依赖它的结论。"
      }
    ],
    shortTitle: "任务接续与完成判断",
    title: "接着上次的工作，查清事实和完成状态",
    teaser: "只读取会改变当前判断的上下文，分别回答“系统是否健康”和“Git 现在能否收口”；任务再长也能接着做，各层成果不互相冒充。",
    status: `当前 ${panelSnapshot.authority.releaseId} 身份与完整发布文件已回读；本次聚焦验证和 ${localOwnerObservation.releaseId} 历史 38/0 完整回归分层，${panelSnapshot.authority.releaseId} 全量 Local 未重跑`,
    statusTone: "mixed",
    searchAliases: ["本地构建通过为什么还不能说完成", "任务压缩后怎样恢复现场", "三控制面什么时候需要", "证据过期应该标什么", "source test install publish怎样分层"],
    value: "它既避免无关上下文拖乱任务，也避免拿代码、测试或部署命令成功代替真正可用。已经冻结的项目不会被批量维护带回施工；本人删除文件后，受管备份也应跟随有效保留集，避免旧副本反复复活。压缩或交接先恢复原意、更正和授权，再继续。",
    why: "长任务会经历对话压缩、换人接手和外部状态变化；源码、测试、安装、发布、公网与用户结果又各自证明不同事情。只看摘要或一个 PASS，很容易在过期前提上继续忙。",
    example: "我可以说：“只检查 Git 总索引，别刷新引用，也别修。”系统只做这项零写诊断，分别告诉我结构是否健康、现在能否收口。换一个问题——“本地构建通过了，为什么公网还打不开？”——它会保留“本地通过”和“公网失败”两个结论，并指出下一步缺哪项回读。",
    result: "我会看到这次查了哪些真实来源、有没有改动，以及本地、远端和用户结果各自到哪一步。若备份或另一项目资料读不到，就保留那一层未知和下一次核对入口，不拿摘要补空白。",
    readerStates: { pass: "所需事实来源可读、各层证据一致时，形成一份能继续接手的当前结论。", problem: "摘要、源码、运行状态或外部回读冲突时，以现场责任源为准，把冲突层单独列出，只停依赖它的判断。", unavailable: "必要来源读不到时，对应结论标成 Unknown 或明确阻断；不恢复退役中央系统，也不从旧摘要猜现状。" },
    searchProjection: {
      intents: ["只检查一个控制面且不要写入", "Doctor健康与收口为什么是两个结论", "本地构建通过为什么还不能说完成", "对话压缩或任务交接后怎样恢复现场", "跨规则仓库和机器怎样只取必要事实", "证据过期时应该标什么", "怎样区分当前规则与历史测试"],
      entities: ["三控制面", "metadata / checkpoint", "evidence layer / read-back", "source / test / install / publish", "fresh task / E2E / Unknown"],
      relations: ["用户结果和明确更正高于可替换方案", "摘要只作线索而现场 Owner 决定当前事实", "source、test、install、publish、fresh task 与 E2E 互不代替", "历史完整回归不继承到新的release identity", "短时通过不证明长程永不漂移"],
      failureRecovery: ["压缩交接或扩架构前恢复用户原意并修正冲突方案", "证据过期时降为历史或Unknown", "跨控制面schema无效时修复正确Owner而不恢复中央资料库", "只有受影响结论停止而独立工作继续"]
    },
    decisionImpact: ["普通单项目问题不进入全景控制面。", "跨 Owner（责任源）决策先读 metadata（元数据），再展开必要正文。", "证据缺失或过期时降为 Unknown（证据不足），而不是 PASS（通过）。", "设计、Git、机器运行和外部 read-back（正式回读）分开验证。", "压缩、交接、更正、反复失败或扩架构前恢复原意；有冲突改方案而不改用户要求。", `当前 ${panelSnapshot.authority.releaseId} 活动身份、聚焦验证与 ${localOwnerObservation.releaseId} 历史完整回归各自成立；短时通过不能外推长程永不偏离。`],
    problem: "长任务会压缩，多个 owner 会变化，同一结论又可能来自文档、源码、测试、运行时或外部回执。系统必须让重要状态可重建，同时防止把摘要、历史命名或某一层 PASS 当成全部完成。",
    implementation: [
      "现行只有三个控制面：.agents、Git 总索引和 PCConfig；具体项目拥有业务事实。兼容名称不会创造第四个控制面。本人已冻结的项目，批量“全部完善”也默认不读代码、不主动维护；之后明确提出该项目的具体需求，就只处理这次范围，不需要额外解除口令，也不恢复日常维护。目录、服务或备份仍存在，不等于允许主动改动。",
      "上下文按责任来源与DocumentId区分直接资料和按需条件资料；不因返回路径就提前读取所有正文或运行动态Provider。完整发布文件验真与按任务阅读正式主题是两件事，必要原文不足就补条件和例外。",
      "具名Skill就绪问题可用Doctor -SkillName，只看该入口supply_health与verification_coverage。源码/安装/事务健康和current/fresh/E2E覆盖分别说明；未知覆盖不把健康供应判坏，也不宣称已可用。普通状态问题不以全仓测试为前提。",
      "Control Plane Doctor（控制面诊断）是另一条按需聚合入口。-Owner可选agents、git、pcconfig及其组合；默认全选三个Owner以兼容旧调用。-CheckId再收窄为skill_supply、pcconfig_drift、project_admission_agents、project_admission_pcconfig、project_admission_index；未知项或越出Owner范围在接触提供器路径前就拒绝，未选Owner不读不启动。排除pcconfig时，Skill供应使用-NoExternalEvidence避免间接读机器证据。",
      "Doctor默认-Freshness Cached，Git admission不fetch，返回mode=read_only、write_mode=zero_write。只有明确-Freshness Live且选中Git admission才传-Fetch，可能更新本地.git引用，结果明示mode=read_with_local_git_metadata_write、write_mode=local_git_metadata_write；它仍不改工作树、不安装、不修改任务、不commit或push。",
      "agents.control-plane-doctor.v1同时返回status（控制面健康）与convergence_status（所选Git目标收口准备度）。schema、身份、路径等结构失败可使health=block；缓存、可见性未知、并发dirty或公开冲突可使health=warn而convergence仍block。非Git提供器convergence_status=not_applicable，进程只在health=block时非零退出，退出0不是收口许可。",
      "诊断回执用selected_check_ids、providers_invoked、freshness_mode、write_mode公开实际取证成本；默认每个提供器60秒、stdout/stderr合计262144字节上限，无窗口运行，超时、过量输出、无效UTF-8/JSON或合同不符都返回明确错误，不把原始私有载荷转发给页面。",
      "长任务在现有项目或宿主持久状态中分开保存用户结果、更正、授权、可推翻方案、已完成和剩余结果；计划、摘要、代码与审查不能成为新需求。简单工作不建文档，也不为重建状态增加台账、服务或数据库。",
      "证据层包括合同设计、源码、测试、安装、运行、发布、fresh task、E2E 和用户可见结果，互不冒充。",
      "仓库膨胀治理把完成计划和历史复盘留给 Git，活动树只保留当前 source（源码）、contract（合同）、config（配置）和行为回归。backup_source_follow_deletion（备份跟随有效保留集）由活动三控制面合同定义：受管 G 备份跟随登记上游，H 跟随 G，新增、修改、删除都收敛到当前有效保留集；源根正常可读且没有已知归位解释时，已消失项按本人删除处理，不逐件追问或从下游复活。卷离线、锁定、读取失败或备份不完整不能当空源；完整读清保留视图并复制核验新增/修改后，才清理旧副本，纯删除也要收敛。必要的有界版本和短期删除缓冲仍由所属入口保留；不盲镜像整盘、不误删独立原件、不新增服务或自动锁盘。PCConfig 拥有机器映射、任务配置、卷锁和恢复路由，各上游拥有保留视图；本次网页规则取证没有执行 G/H 同步或验证所有链路。"
    ],
    flow: [
      "判断跨控制面事实是否真的会改变当前决定",
      "先选择会改变决定的Owner或DocumentId；主选和条件文档分开，条件项不预读正文或哈希",
      "分别调用 Git、机器或业务 provider 取得动态事实",
      "只需健康/漂移诊断时先冻结Owner和CheckId范围，用默认Cached零写入口；分别读取status与convergence_status。确需现场refs且允许本地Git元数据写入时才显式选择Live，修复则退出Doctor交回真实Owner",
      "将每个结论标记为活动事实、设计原则或解释示例",
      "按证据层记录 PASS、FAIL、BLOCK、SKIP 或 unknown",
      "压缩、交接、更正、失败循环或扩架构前先恢复原意，再读必要规则、Owner、工作树和证据；长程实质重规划按活动合同安排独立审查"
    ],
    concepts: [
      { term: "三控制面", explanation: ".agents 管 Agent，Git 控制面管仓库，PCConfig 管机器；具体项目仍独立拥有业务。" },
      { term: "Control Plane Doctor（控制面诊断）", explanation: "选择Owner和检查项后按需调用提供器；默认零写，输出健康和收口两个答案，不是后台门禁或自动修复器。" },
      { term: "Health / convergence（健康 / 收口准备度）", explanation: "前者判断结构与证据合同是否正常，后者判断所选Git目标是否现在能收口；健康警告、退出0都不能把收口阻断升级成通过。" },
      { term: "Durable state（可重建状态）", explanation: "现有状态分开保留用户结果、更正、授权与可换方案；恢复先重锚原意，不保存隐藏推理，也不为此新建台账。" },
      { term: "Evidence layer", explanation: "每层只证明自己的事。代码存在不证明安装，部署成功不证明用户路径可用。" },
      { term: "Unknown", explanation: "没有当前证据时的诚实状态，不是自动 PASS，也不等于永久不可用。" }
    ],
    boundaries: [
      "普通单项目问题不机械进入三控制面全景",
      "Doctor默认不fetch；显式Live可能写本地Git引用，必须明示，不能继续称zero_write",
      "Doctor不修复、安装junction、修改工作树或计划任务，也不commit/push；需要修复时使用所属项目的独立授权流程",
      "兼容 ID 不会恢复已退役的第四基座或中央个人上下文",
      "checkpoint 不保存秘密、隐藏推理和无关私人内容",
      "测试、receipt 和状态字段不能代替用户看得见的产品验收；短时 E2E 不能证明长程永不偏离原意"
    ],
    failures: [
      { condition: "Doctor的Owner/CheckId无效或检查项超出所选Owner", response: "在任何提供器路径读取或进程启动前拒绝；缩小到正确范围，不自动补成全量检查。" },
      { condition: "健康为warn但Git收口为block", response: "保留两个结论及精确原因；补所需现场证据或处理对应冲突，不把诊断退出0当作可以发布。" },
      { condition: "诊断提供器缺失、超时、输出越界或合同无效", response: "标记受影响提供器与健康阻断，不修复或扩大读取范围；真实Owner修复后仅重验必要项。" },
      { condition: "视图 owner 或 primary 缺失", response: "失败关闭跨控制面结论，修复正确 owner 的 catalog 或路径。" },
      { condition: "摘要、计划或当前方案与用户原意冲突", response: "恢复用户目标、更正及授权，修正方案而不是用户要求；必要动态事实仍向规则、Git、机器或业务 Owner 回读。" },
      { condition: "证据过期", response: "降为历史或 unknown，重新执行最小必要 read-back。" }
    ],
    sources: [
      { path: "E:\\.agents\\docs\\contracts\\agents.context-sources.md", role: "三控制面架构和渐进上下文合同" },
      { path: "E:\\.agents\\tools\\Get-FourBaseDecisionContext.ps1", role: "零正文 metadata 视图入口" },
      { path: "E:\\.agents\\tools\\Invoke-ControlPlaneDoctor.ps1", role: "Owner/CheckId前置选择、默认零写、有界调用与健康/收口双结论" },
      { path: "E:\\.agents\\tests\\Test-ControlPlaneDoctorScope.ps1", role: "未选Owner零调用、CheckId范围、Cached/Live写入语义与双结论回归" },
      { path: "E:\\.agents\\config\\repository-bloat-budget.json", role: "活动树大小、历史路径和例外退出条件" }
    ],
    verification: [
      "FourBaseDecisionContext 保留兼容视图，按 Owner/DocumentId 区分主选与条件文档；只为选中 E 文档 Resolve，条件项不预读正文或哈希",
      "2026-09-02T19:55:45Z 真实只读运行Doctor -Owner git -CheckId project_admission_index：仅调用该1项，freshness=cached、write_mode=zero_write、health=warn、convergence=warn，原因cached_observation；没有运行Live或修复。Test-ControlPlaneDoctorScope另有health=warn/convergence=block与未选Owner零调用的隔离回归，本次未重跑该测试。",
      "E118 延续当前仓库验证边界；跨控制面上下文按所选文档渐进读取，条件项不预读。安装 state 与 source_current 分开；源码候选变化不让已验证安装失效，Unknown 也不等于历史从未验收。命令层拒绝删除的回收站后备仍只覆盖已授权精确目标。",
      "Cross-control coverage（跨控制面覆盖）在项目当前快照中闭合且无 finding；以后新增合同仍必须单独回归",
      `refresh snapshot 没有重跑当前 source 的 full Local 回归；验证矩阵中的完整 38/0 仍只属于 ${localOwnerObservation.releaseId} 历史观察。当前 ${panelSnapshot.authority.releaseId} 由完整发布文件 release identity、source/remote 与正式 pointer 回读证明，二者不能互相替代。`
    ],
    relation: "这个模块把其他模块的结论放进正确证据层，并保证长任务和更新快照时不会靠记忆续写；工作树镜像的文件恢复生命周期由独立模块说明。",
    readerStatus: "已有从原目标、项目与证据接续工作的规则；本轮核验了活动规则，没有重跑全部工具和项目。"
  },
  {
    slug: "working-tree-hot-mirror",
    usageEntry: "这是 .agents 的历史热镜像能力；需要找回未提交规则文件时，在已接入本机的 AI 对话中提出恢复检查，由 PCConfig 与镜像状态分别核对。",
    usageInputs: ["故障前的大致时间", "要找的规则文件或修改", "可用的 G 盘与 Git 历史"],
    productFlow: [
      { title: "先确认恢复材料", detail: "AI 查看 G 盘、最后回执、日志和实际文件，确认这次镜像是否真的覆盖目标时间。" },
      { title: "比较两种来源", detail: "已提交历史从私有 Git 取，未提交文件从已核对的 G 盘副本比较，不直接覆盖当前生效的规则文件。" },
      { title: "谨慎恢复", detail: "交回可恢复文件和缺口；原地镜像失败可能已部分改变 G，现有每日任务和最新覆盖不能凭旧回执宣称正常。" },
    ],
    shortTitle: "工作树热备",
    title: ".agents 工作树 E→G 热镜像与恢复",
    teaser: "PRIVATE Git 保存已提交历史；G 盘热镜像补充保存工作树和未提交文件，但当前最新覆盖仍是 Unknown，也不等于实时或完整仓库备份。",
    status: "可选热镜像源码与历史状态存在；受管任务当前无此入口，最新这份镜像覆盖未证",
    statusTone: "mixed",
    searchAliases: ["未提交的agents工作树怎样热备", "G盘agents热镜像", "AgentsHotMirror任务", "热备和Git历史有什么不同", "从G盘恢复agents工作树"],
    value: "Git 负责已经提交的历史；G 盘镜像在成功执行并有新鲜回执时，能再提供一份当前工作树文件。恢复时两者可以互补，但本页没有证据证明每日任务正在跑，也不能保证最新改动已经进去。",
    why: "私有代码仓库能找回已经提交的规则，但救不了还在写、没提交的修改。G 盘这份工作文件副本为故障恢复提供另一条线索；它只是某次复制的结果，不能当成当前规则或实时备份。",
    example: "遇到故障，我会问：“我那批还没提交的规则修改，G 盘现在到底还能找回哪些？”系统先核对 G 卷、镜像时间、日志和实际文件，再从 PRIVATE Git 取回提交历史，只把确认过的 G 工作树文件叠加进去。我得到的是可用文件清单和不确定项，不是“实时备份、完整恢复”的空头保证。",
    result: "我会得到 G 盘实际还能读到哪些未提交文件、最后复制时间和哪些内容仍不确定。复制中断可能已经改了 G 盘的一部分，不能只看旧的成功记录；现有每日任务和最新覆盖仍未得到确认。",
    readerStates: {
      "pass": "这一次复制完成且目标文件可核对时，说明该次 G 盘副本可用，不外推下一次或实时覆盖。",
      "problem": "复制中断时先看 G 盘实际文件，再决定能叠加什么；旧成功记录不能证明失败前的副本保持原样。",
      "unavailable": "G 盘不在、目标路径不符或任务没有运行证据时，明确说最新副本无法确认，不改从其他未登记磁盘取。"
    },
    searchProjection: {
      intents: ["热备未提交的agents工作树", "从G盘恢复当前规则源码文件", "检查AgentsHotMirror每日任务", "区分Git历史与工作树镜像"],
      entities: ["AgentsHotMirror-Daily", "E:\\.agents → G:\\80_Backup\\ControlPlane\\.agents", "robocopy /MIR", "agents.hot-mirror-status.v1", "source HEAD / dirty count"],
      relations: ["PRIVATE Git保存提交历史而G热镜像保存当前工作树", "热镜像排除.git和临时附件", "G热备不触碰H冷备", "状态回执不证明任务已安装"],
      failureRecovery: ["热备任务缺失或回执陈旧时保持Unknown", "G卷不健康或互斥超时且未开始复制时不改镜像文件", "robocopy退出码>=8或中断时G可能已部分覆盖或删除，保留E源并检查日志和实际目标", "旧成功状态不证明失败后的G完整，恢复先核对实际文件再叠加"]
    },
    decisionImpact: ["固定 source/destination 之外不允许 /MIR。", "PRIVATE Git 与 G 热镜像互不冒充；H 不在自动链中。", "原地/MIR不是原子代际切换，也没有previous或自动rollback；开始复制后的失败可能已覆盖或删除目标文件。", "旧状态回执不能证明当前工作树已覆盖，也不能证明失败后的旧G镜像完整。", "每日任务是可选安装层，当前受管登记无此名称或动作；不据旧installer恢复任务，源码/测试存在也不能证明当前安装。"],
    problem: "解决未提交工作只有一个故障域、镜像目标漂移、并发镜像互相覆盖、陈旧回执冒充当前覆盖，以及热备越界复制 Git 历史或 H 冷备的问题。",
    implementation: [
      "Sync-AgentsHotMirror.ps1 只接受固定 E:\\.agents 与 G:\\80_Backup\\ControlPlane\\.agents，先验证 G 卷 Healthy/OK，再取得 Global\\CodexAgentsHotMirrorLock，最多等待 30 分钟。",
      "镜像使用有界 robocopy /MIR、/COPY:DAT、/DCOPY:DAT、/XJ、/R:2、/W:3、/MT:8；排除 .git、临时目录、pytest cache 和 Codex Remote 附件，退出码 >=8 才失败。",
      "/MIR在固定G目录原地执行，既覆盖变化文件，也删除源端已不存在的目标项；没有独立staging、previous代际、原子切换或失败回滚。>=8或进程中断时必须把G视为待核对的部分结果，不能承诺旧副本未变。",
      "仅robocopy退出码低于8且非ListOnly时写agents.hot-mirror-status.v1，记录时间、固定源/目标、模式、exit、source Git HEAD、dirty entry count与排除项。失败先抛错，不更新成功状态JSON，已有旧状态可能留存；追加日志与实际文件才帮助判断这次做过什么。脚本不做全树hash/零差异验收。",
      "可选 AgentsHotMirror-Daily 为每日20:30、StartWhenAvailable=true、Limited交互用户、wscript无窗口、IgnoreNew、3次/10分钟重试、2小时上限且 WakeToRun=false；明确不写 H。"
    ],
    flow: ["只读检查G卷、任务、最后状态和本次日志", "验证固定E/G路径并取得全局互斥；此时失败尚未修改镜像文件", "在G目标原地运行/MIR，允许覆盖和删除；中断不回滚", "退出码低于8才写status v1；失败则保留E源并检查G实际部分结果", "恢复先从PRIVATE Git取得提交历史", "核对镜像时间、源HEAD、日志和实际文件后，再比较并叠加G工作树文件"],
    concepts: [
      { term: "Working-tree hot mirror（工作树热镜像）", explanation: "保存当前文件和未提交状态的固定 E→G 镜像；不是 Git 仓库副本。" },
      { term: "Hot mirror status（热镜像状态回执）", explanation: "记录一次镜像的时间、HEAD、dirty 数、排除项和 robocopy 结果；不是最新覆盖或任务安装证明。" },
      { term: "robocopy /MIR（目录镜像）", explanation: "在目标原地复制、覆盖并删除多余项，让目标趋近源；没有事务回滚，失败可能留下部分变化，因此只允许固定路径。" }
    ],
    boundaries: ["不复制 .git、临时目录、pytest cache 和附件", "不访问或写入 H 冷备", "不创建第二规则权威", "不从旧回执推断当前已覆盖或失败后的旧G完整", "原地镜像不保留上一代、不保证原子快照、不提供失败回滚；一次 /MIR 没有先完成新增/修改复制核验再清理的独立阶段，E131 保留集同步要求与当前实现缺口分别陈述", "未核对时间、HEAD、失败日志和实际文件前不把G镜像覆盖回E"],
    failures: [
      { condition: "G 卷不健康、不可用或镜像互斥超时", response: "不运行 robocopy；保留 E 源和既有 G 镜像，报告精确门禁。" },
      { condition: "robocopy返回8或更高，或执行中断", response: "判本次镜像失败或未完成，保留E源与日志；G可能已部分复制、覆盖或删除，旧成功JSON也可能仍在。先核对实际目标，不把它称为完整旧恢复点，不盲目反向覆盖E。" },
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
      "2026-09-08零写核对：G卷Healthy/OK，历史status仍在；源installer的精确任务名确为AgentsHotMirror-Daily。PCConfig当前89个登记项既无此名称，也无Sync-AgentsHotMirror动作；08:12:57Z管理员完整观察与89/89定义一致，不是由普通权限单次未找到推断全机状态。",
      "历史 status 最后镜像时间为 2026-07-30、HEAD=c96dbf1、dirty=21；因此当前安装和最新工作树覆盖保持 Unknown。"
    ],
    relation: "Git 历史由 PRIVATE 仓库负责；本模块只补未提交工作树恢复层。context-evidence 模块负责判断这份回执属于哪一证据层，PCConfig 机器备份和 H 冷备不由本模块替代。",
    readerStatus: "保留了未提交文件的镜像实现与旧记录，但当前没有证明每日镜像正在执行，也不知道最新修改是否已经进入副本。"
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
  releaseInventory: panelSnapshot.releaseInventory || [],
  rules: ruleOverviews.map((rule) => ({ ...rule, ...currentRuleBinding(rule.logicalId) }))
};
