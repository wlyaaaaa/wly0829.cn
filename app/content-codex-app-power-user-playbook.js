import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  observedAt: "2026-09-07T23:48:00Z",
  label: "实践手册与模板已核对；PDF 示例修复后真实导出通过",
  boundary: "这是可阅读、修改和复用的非官方指南，不是另一个运行中的助手、规则引擎或备份服务。本次核对全部文档与示例，修复了 PDF 示例的复杂路径和默认目录问题，并用虚构文档实际验收；没有改动用户当前 Codex 规则、插件或备份。",
  metrics: [
    { label: "规则起点", value: "可修改的 AGENTS 模板" },
    { label: "能力选择", value: "工作树 · 浏览器 · 扩展" },
    { label: "状态整理", value: "运行目录 · 源码 · 备份" },
    { label: "可运行例子", value: "Markdown 转 PDF" }
  ],
  facts: [
    { label: "真实交付", value: "README、docs/capability-map.md、templates/AGENTS.public.md、一个 md-to-pdf SKILL.md 和配套 Python 脚本。源码没有完整可安装插件 manifest，也没有自动执行这些文字规则的服务。" },
    { label: "PDF 入口现状", value: "build_docs_pdf.py 默认处理当前目录中的 Markdown，也可用 --dir 和 --docs 指定。Python 3.10+、Markdown 包和已安装的 Windows Edge/Chrome 是前提；缺 Markdown 会显示安装指引。" },
    { label: "本次真实修复", value: "原示例在含中文、空格和单引号的目录导出 0/1；修复后相同文件导出 1/1。还在 C 盘文档目录、E 盘临时目录的条件下验证了默认无参数导出，生成可解析的一页 PDF。" },
    { label: "回归与来源", value: "4 项回归测试通过，涵盖复杂路径、无关文件保留、失败/无输出/无效输出/超时、目标同卷替换和默认目录。PUBLIC wlyaaaaa/codex-app-power-user-playbook，master：c4e657be544156380ab5baeef0f275611e03a2d2，远端已回读。" }
  ],
  gaps: [
    "手册中的能力建议需要在所用 Codex 环境里核验；仓库存在一个示例，不证明用户当前任务已经安装并能发现该 Skill 或插件。",
    "三类持久状态与白名单备份是组织方法，本仓库不提供备份同步器、计划任务、自动恢复或历史文件防缩水服务。",
    "PDF 示例使用本机 Windows 浏览器发现路径；本次没有建设 macOS/Linux 兼容，也不把它记成现有 Windows 功能的故障。",
    "脚本检查浏览器退出、新输出、大小和 PDF 文件头；正式文档还要检查实际页数、提取文字与版式。本次一页样例通过，不证明任意复杂文档都无需复核。"
  ]
});

export const codexAppPowerUserPlaybookSnapshot = Object.freeze({
  ...baseSnapshot, generation: "非官方实践指南 · 可复用规则模板 · 一个真实 PDF 示例",
  sourceCommit: "c4e657be544156380ab5baeef0f275611e03a2d2",
  sourceRoot: "E:\\Projects\\Archives\\codex-app-power-user-playbook",
  runtimeFacts: { sourceType: "documentation-and-code-example", publicTemplatePath: "templates/AGENTS.public.md", capabilityMapPath: "docs/capability-map.md", scriptExamplePath: "examples/plugins/md-pdf-toolkit/scripts/build_docs_pdf.py", pythonTestsPassed: 4, pythonTestsFailed: 0, pdfComplexPathAccepted: true, crossVolumeDefaultExportAccepted: true, pdfPages: 1, installablePluginManifest: false, backupServiceProvided: false },
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const codexAppPowerUserPlaybookProject = {
  order: 27, slug: "codex-app-power-user-playbook", title: "Codex App Power User Playbook",
  kicker: "把一次有效的 AI 协作方法，整理成下次还能用的办法",
  route: "/projects/codex-app-power-user-playbook", visibility: "公开仓库",
  statusTone: "pass", cardStatus: "实践指南可复用；PDF 示例已修复并实际验证", cardStatusTone: "pass",
  ...codexAppPowerUserPlaybookSnapshot,
  summary: "这是一份 Codex App 的非官方实用手册。我遇到重复工作时，可以从中选一段适合自己的规则或方法：什么时候开工作树、怎样让 AI 真正验证成果、如何把反复使用的步骤做成 Skill（可复用操作说明），以及规则源码、应用数据和备份应该各放哪里。仓库还给了一个能实际运行的 Markdown 转 PDF 例子。",
  why: "一次对话里说清楚了，不代表下一次还记得；直接把整份私人配置公开，又可能带出不该分享的内容。手册把可迁移的方法写成可编辑模板和小例子，供使用者按自己的环境选择，而不是整套照搬。",
  plainExample: "我每次都让 AI 把说明文档转成 PDF，不想每回重说步骤。可以参考仓库里的 Skill 和脚本：选好目录、执行转换、核对本次文件和页面，再把稳定做法留在自己的能力源码里。下次在新任务验证入口可见后，才把它当可用能力。",
  result: "得到可阅读的能力地图、可修改的 AGENTS 模板、组织长期资料的建议和一个可运行示例。读完或复制文件本身不会自动替换当前规则，也不会创建后台任务或备份。",
  repositoryNote: "这是 MIT 许可的非官方公共指南。模板使用通用说明，实际机器路径、账号和可复用凭据应由使用者按真实环境处理；模板不是此机器的活动规则权威，也不授权自动覆盖既有 AGENTS.md。",
  readerStates: { pass: "选中的方法在自己的环境经过实际验证后，成为可重复使用的流程。", problem: "示例、安装或真实使用失败时，修对应文件和方法，再重新验证。", unavailable: "当前环境没有某能力时明确说明；文档提到它不等于已经安装或可用。" },
  productPrinciples: [
    { title: "拿来调整，避免整份照搬", detail: "模板给出协作、验证和外部动作判断的起点；用户自己的目标、项目规则和已授权范围仍要逐项结合。" },
    { title: "有成果，也有验证", detail: "写出代码不等于跑通，生成文件不等于看过页面。选择能证明这次结果的检查，报告真实缺口。" },
    { title: "能力源码和应用数据分开", detail: "自己长期维护的规则与脚本放稳定源码位置；应用运行目录包含会话、配置、缓存等不同价值的数据，不能笼统当垃圾或整盘推到 Git。" },
    { title: "小例子必须能独立使用", detail: "示例不依赖其他项目的偶然文件。PDF 流程只需要说明过的 Python 包和已安装浏览器，不借用户私有工具路径。" }
  ],
  dataSources: {
    title: "使用者提供什么，手册帮助整理什么",
    intro: "文档不自动采集任何机器状态。使用者给出实际任务、约束和环境，再选择对应模板或例子。",
    rows: [
      { source: "真实任务与协作偏好", data: "希望 AI 做什么、何时继续、哪些外部影响已获授权。", result: "改成适用于自己项目的文字规则，不把通用示例当新权限。" },
      { source: "当前工具与安装环境", data: "实际可见的工作树、浏览器、Skill、插件和自动化入口。", result: "按照能力地图选择方法，并在当前或新任务验证可用性。" },
      { source: "准备保留的规则与应用数据", data: "长期源码、运行目录中的有价值资料，以及可进入私人备份的明确文件集。", result: "形成三类责任清晰的保存方式；同步与恢复由实际备份项目执行。" },
      { source: "示例中的 Markdown 文件", data: "明确目录内的文档或 --docs 选中的文件。", result: "经独立浏览器打印为相邻 PDF，再检查文字和页面。" }
    ]
  },
  operatingFlow: [
    { title: "从一个真实重复问题开始", detail: "选一件有价值的事，例如稳定导出 PDF；不要为了拥有框架而扩建系统。" },
    { title: "选模板或能力方法", detail: "根据任务选择文字规则、工作树、审查、浏览器或小 Skill，适配已有环境。" },
    { title: "运行并检查真实结果", detail: "用本次命令、产物和页面验证，区分源码存在、安装到位、新任务可见与实际完成。" },
    { title: "把稳定做法放回自己的来源", detail: "修复应回到对应 Skill 或脚本；长期源码与应用运行数据分别保存，备份由自己的明确方案负责。" }
  ],
  usageExamples: [
    { ask: "我希望 AI 别问小事，但关键外部动作要有明确授权。", effect: "参考 AGENTS 模板写下适用规则，结合已有授权，不整份覆盖当前配置。", moduleSlug: "global-agents-template-and-execution-rules" },
    { ask: "主目录里有未提交改动，这次实验怎么隔开？", effect: "按能力地图使用工作树，完成后审查差异并验证成果。", moduleSlug: "engineering-capability-routing-and-verification" },
    { ask: "把这几份 Markdown 转成 PDF，文件名有中文和空格。", effect: "运行现有示例脚本，独立临时目录打印，检查本次输出后替换目标。", moduleSlug: "self-contained-skills-and-plugins-pattern" },
    { ask: "哪些东西是我自己的长期规则，哪些只是应用运行数据？", effect: "分开源码、运行目录与私人备份；明确保留哪些资料，不把会话和缓存混进公共仓库。", moduleSlug: "three-tier-durable-state-and-memory-backup" },
    { ask: "我想分享这套方法，但不想带出私密配置。", effect: "分享通用模板和示例，逐项核对真实载荷；敏感值不因为藏在注释里就可以公开。", moduleSlug: "public-safety-boundary-and-sanitization" }
  ],
  components: [
    { name: "templates/AGENTS.public.md", responsibility: "可编辑的行为模板", implementation: "协作偏好、授权判断、能力选择和验证建议，作为文字起点。" },
    { name: "docs/capability-map.md", responsibility: "能力地图", implementation: "工作树、审查、浏览器、Skills、Plugins、Automations 和 Hooks 的适用场景与核验方法。" },
    { name: "README 的 Durable State Pattern", responsibility: "保存责任说明", implementation: "区分应用运行目录、长期源码和私人白名单备份；本仓库不实现同步。" },
    { name: "examples/skills/md-to-pdf/SKILL.md", responsibility: "PDF 示例操作说明", implementation: "说明依赖、目录、选择文件、输出核对和真实页面检查。" },
    { name: "examples/plugins/md-pdf-toolkit/scripts/build_docs_pdf.py", responsibility: "可独立运行的示例", implementation: "Markdown 到 HTML，独立 Edge/Chrome profile（浏览器配置目录）打印，新 PDF 在目标同卷暂存后替换。" }
  ],
  technicalContracts: [
    { artifact: "行为与能力说明", schema: "Markdown 文档；没有额外机器协议", owner: "AGENTS.public.md / capability-map.md", boundary: "模板由使用者调整；文字不形成自动拦截器或当前执行权限。" },
    { artifact: "PDF 命令行入口", schema: "--dir <directory> · --docs <file...>", owner: "build_docs_pdf.py", boundary: "未给 --dir 使用当前目录；逐文件转换，整体成功要求所有所选文档成功。" },
    { artifact: "示例验证", schema: "python -m unittest discover -s tests -v", owner: "tests/test_pdf_example.py", boundary: "检查可复现故障与文件保留行为；不冒充跨平台或完整文档质量保证。" }
  ],
  evidenceLayers: [
    { layer: "文档与代码阅读", proves: "来源确实提供所述模板、指南和脚本，且没有额外服务或插件安装包。", doesNotProve: "不证明读者环境已应用这些建议。" },
    { layer: "本次 4 项回归", proves: "复杂路径、默认目录、错误输出和旧文件保留的受控场景通过。", doesNotProve: "不证明所有浏览器版本或全部 PDF 内容正确。" },
    { layer: "真实 Windows PDF 导出", proves: "含中文、空格、单引号的虚构文档生成一页 PDF；实际渲染与文字检查通过。", doesNotProve: "不证明一个新任务已经发现此 Skill，也不证明实际插件安装。" }
  ],
  responsibilities: ["提供可调整的规则和能力选择方法。", "给出运行目录、长期源码和私人备份的组织建议。", "维护可独立运行的 PDF 示例与必要修复。"],
  exclusions: ["不是 OpenAI 官方文档，不代表每个版本都具备完全相同入口。", "不替换当前活动规则，不实现风险拦截或授权服务。", "不安装新插件，不创建备份、定时任务或恢复系统。", "不把模板组织名称编造成版本化机器 schema。"],
  operationalEntrypoints: [
    { name: "阅读并调整模板", command: "templates/AGENTS.public.md", purpose: "先对照当前规则和需求，再选择适用段落。" },
    { name: "查阅能力地图", command: "docs/capability-map.md", purpose: "按任务判断方法，查证当前环境能力。" },
    { name: "准备 PDF 依赖", command: "python -m pip install Markdown", purpose: "使用 Python 3.10+ 和本机 Edge/Chrome。" },
    { name: "导出明确目录", command: "python examples/plugins/md-pdf-toolkit/scripts/build_docs_pdf.py --dir \"<directory>\" --docs \"<a.md>\" \"<b.md>\"", purpose: "--docs 可省略；--dir 省略则处理当前目录。含空格时保留参数两侧引号。" },
    { name: "运行回归", command: "python -m unittest discover -s tests -v", purpose: "检查示例的路径、失败和文件保留行为。" }
  ],
  evolution: [
    { date: "2026-07", result: "将实践经验整理为公开模板、能力地图和自包含 PDF 示例，并补充运行数据与长期来源的区分。" },
    { date: "2026-09", result: "用真实文件复核 PDF 示例；修复复杂目录和默认入口，保留已有成果并补充依赖说明。" }
  ],
  glossary: [{ term: "Playbook（实践手册）", meaning: "可按真实任务选择的方法，不是替人执行的后台系统。" }, { term: "Worktree（工作树）", meaning: "同一 Git 仓库的另一份工作目录，用于隔开并行或实验改动。" }, { term: "Runtime home（应用运行目录）", meaning: "含配置、会话、缓存和其他运行数据，不能全部当成易失缓存。" }, { term: "Plugin（插件）", meaning: "可组合多类能力的包；本仓库只有组织示例，未提供完整可安装包。" }],
  searchAliases: ["Codex App Power User Playbook", "Codex实践手册", "AGENTS模板", "工作树", "能力地图", "Markdown转PDF示例"],
  searchProjection: { intents: ["把重复AI工作做成可复用方法", "Codex的规则和运行数据怎么分别保存", "用中文文件名导出PDF"], entities: ["AGENTS.public.md", "capability-map.md", "build_docs_pdf.py", "Skills", "Plugins"], relations: ["文字指导与实际执行分开验证"], failureRecovery: ["失败回到所属示例修复", "旧PDF不被失败输出替换"] }
};

export const codexAppPowerUserPlaybookModules = [
  {
    id: "global-agents-template-and-execution-rules", slug: "global-agents-template-and-execution-rules", order: 1,
    title: "协作规则模板", shortTitle: "规则模板", route: "/projects/codex-app-power-user-playbook/global-agents-template-and-execution-rules",
    teaser: "用可编辑的文字说明自己希望怎样协作", kicker: "AGENTS 模板", status: "文档已核对", statusTone: "pass",
    value: "让常用偏好和验证要求有一个明确起点，减少每次重复说明。",
    why: "只写“认真一点”很难落地；列清何时直接做、何时缺少决定、怎样验证，比笼统要求有用。",
    example: "希望 AI 能自主完成普通修改和测试，但发消息、发布或破坏性操作必须有明确意图。我挑选模板里的相关段落，按现有项目规则调整。",
    result: "得到适合自己项目的文字约定；它只在被正确放置、当前环境读取后才可能影响行为。",
    problem: "模板和现有规则冲突时需要合并取舍，不能一条复制命令覆盖长期维护的内容。",
    readerStates: { pass: "规则对应真实需求，当前任务能读取并遵循。", problem: "实际行为不符时先查作用域和原文，再修规则或执行路径。", unavailable: "仅有下载文件时不声称已经生效。" },
    decisionImpact: ["公开模板是起点，不是此机器的活动规则来源。", "高风险和外部影响需要明确授权；已有授权不能被模板重新变成逐次审批。", "不要求公开隐藏思考，交付简洁理由与验证结果。"],
    implementation: ["AGENTS.public.md 以 Collaboration Style、Execution Rules、Capability Routing、Skills And Plugins、Durable State Layout、Verification 和 Public Safety 组织文字。", "模板建议使用用户偏好语言、充分信息时直接推进、缺关键事实时说明，测试与产物验证分别检查。这里没有 agents.public-rules.v1 之类可执行 schema 或拦截实现。"],
    flow: ["明确重复出现的需求", "选择适用段落", "与现有规则合并", "在新实际任务验证"],
    concepts: [{ term: "规则作用域", explanation: "文件位置和当前执行环境决定它适用于哪些任务。" }],
    boundaries: ["复制模板不产生新权限，也不保证所有模型始终执行正确。"],
    failures: [{ condition: "规则冲突或未被读取", response: "查明当前作用域后修正，保留用户原意。" }],
    sources: [{ path: "templates/AGENTS.public.md", role: "完整可编辑示例" }],
    verification: ["本次阅读完整模板；没有覆盖用户当前 AGENTS 或伪称新任务已应用。"],
    relation: "决定协作方式，具体工具能力仍要在环境中验证。",
    searchProjection: { intents: ["写一份AI协作规则", "别问小事但保留关键授权", "模板是否已经生效"], entities: ["AGENTS.public.md", "Verification", "Execution Rules"], relations: ["文字模板按项目适配"], failureRecovery: ["不覆盖已有规则", "先查作用域"] }
  },
  {
    id: "engineering-capability-routing-and-verification", slug: "engineering-capability-routing-and-verification", order: 2,
    title: "按任务选择能力并验证", shortTitle: "能力地图", route: "/projects/codex-app-power-user-playbook/engineering-capability-routing-and-verification",
    teaser: "工作树、审查、浏览器和自动化各有用途", kicker: "实际方法选择", status: "手册方法已核对", statusTone: "pass",
    value: "帮助使用者选择合适方法，并说清怎样知道它真的有用。",
    why: "所有任务都直接改主目录容易冲突；每次都开复杂流程也浪费时间。先看任务是否需要隔离、登录状态或持续执行。",
    example: "主目录有其他改动，本次想试一个新界面。用工作树隔开，完成后对照基线审查，并在浏览器看实际页面和交互。",
    result: "获得针对这次任务的方式和验证证据，而不是一份必须全做的工具清单。",
    problem: "能力在某个版本或会话里不可见时，手册名称不能代替实际能力发现。",
    readerStates: { pass: "所选方法支持真实任务，结果经过相应检查。", problem: "测试与实际页面冲突时继续定位，不能只择绿灯汇报。", unavailable: "入口不存在则披露这一能力缺口，不假称已经调用。" },
    decisionImpact: ["工作树用于并行、复现或实验隔离；审查针对实际基线差异。", "浏览器用于实际 UI/登录状态检查；本机默认浏览器由当前环境和用户选择决定，不受示例偏好覆盖。", "Automations（自动任务）先说明频率、停止条件、目标与可写范围；Hooks（事件钩子）保持小而可理解。"],
    implementation: ["capability-map.md 分别解释 Core Engineering、Browser And UI、Skills、Plugins、Durable State、Automations、Hooks 与公开分享。", "验证可使用测试、类型检查、构建、lint、文档渲染和页面检查；选择对应证据，不是每个任务强制跑全套。", "技能安装、当前任务可见、新任务可见和真实工作成功分别确认；Subagent（子代理）适合明确可独立的分支。"],
    flow: ["看任务和当前状态", "选择必要能力", "执行实际工作", "用相关证据复核", "报告结果与缺口"],
    concepts: [{ term: "Review（审查）", explanation: "围绕可行动问题、文件与行号评价真实改动。" }],
    boundaries: ["手册没有实现浏览器控制器、任务调度器或多代理系统。"],
    failures: [{ condition: "环境没有声明的能力", response: "先验证可用入口，失败明确披露，不由文档推定运行事实。" }],
    sources: [{ path: "docs/capability-map.md", role: "能力与场景说明" }],
    verification: ["本次核对文档与仓库组成；未创建额外自动化、工作树或浏览器登录动作。"],
    relation: "与规则模板配合，能力选取仍服务于用户目标。",
    searchProjection: { intents: ["什么时候该开工作树", "安装插件后怎么验证可用", "界面修改要检查什么"], entities: ["Worktree", "Review", "Skills", "Plugins", "Automations", "Hooks"], relations: ["能力选择对应真实场景与验证"], failureRecovery: ["可见不等于验收", "有失败就报告影响"] }
  },
  {
    id: "self-contained-skills-and-plugins-pattern", slug: "self-contained-skills-and-plugins-pattern", order: 3,
    title: "可复用方法与 PDF 示例", shortTitle: "PDF 示例", route: "/projects/codex-app-power-user-playbook/self-contained-skills-and-plugins-pattern",
    teaser: "说明、脚本和验证放在一起，例子必须真的能跑", kicker: "自包含例子", status: "复杂路径与默认入口实际通过", statusTone: "pass",
    value: "展示如何把重复文档任务写成操作说明，并提供一份可以直接运行的脚本。",
    why: "如果一个 Skill 依赖另一个项目偶然存在的脚本，复制以后就会失效。示例应带齐所需代码，并清楚说明依赖。",
    example: "把这个目录的几份 Markdown 转成彩色 PDF，文件名里有中文、空格或单引号。脚本读取选中文件，后台打印，生成各自相邻 PDF；失败保留原 PDF。",
    result: "获得实际 PDF 和逐文件结果。Skills/Plugins 的组织方法可参考，但仓库没有完整插件 manifest，不能直接宣称“插件已安装”。",
    problem: "没有浏览器、Python Markdown 包或文档时会失败；文字说明不能代替这些实际前提。",
    readerStates: { pass: "选中文档都产生本次 PDF，退出码为 0。", problem: "有文档缺失或导出失败，汇总数量和非零退出，不覆盖已有成果。", unavailable: "没有 Windows Edge/Chrome 或 Markdown 依赖时给出安装/环境说明。" },
    decisionImpact: ["--dir 省略用当前目录；--docs 只选择该目录中的明确文档，不再找脚本旁不存在的三个固定文件。", "直接传浏览器参数列表，路径不进入 PowerShell 字符串拼接。", "临时 HTML 不写固定名称到文档目录，避免覆盖并删除用户自己的同名文件。"],
    implementation: ["markdown 包把标题、表格、fenced_code（围栏代码块）、列表和目录语法转成 HTML；示例内置绿色 A4 CSS。它不是语义中性的 universal original（通用原版）排版。", "find_edge 按四个 Windows Edge/Chrome 安装位置查找。每次打印使用独立 TemporaryDirectory 与 user-data-dir、--headless=new、--no-first-run、--no-pdf-header-footer。Path.as_uri 形成文件 URL。", "subprocess.run 直接使用参数列表、120 秒 timeout（超时）和 CREATE_NO_WINDOW；新输出必须存在、超过 1024 字节且以 %PDF- 开头。", "PDF 从临时目录复制到目标同卷的 mkstemp 文件，再 os.replace；失败不发布新目标，finally 仅清本次暂存。该脚本不解析全部 PDF 语义，页面和文本需额外验证。"],
    flow: ["读取明确目录和文件列表", "Markdown 转 HTML", "独立浏览器 profile 打印", "检查本次文件", "同卷暂存并替换", "逐文件报告与实际页面验证"],
    concepts: [{ term: "自包含", explanation: "代码就在示例中，只依赖文档已列明的外部运行环境。" }, { term: "独立 profile", explanation: "不借用户正在使用的浏览器配置处理打印。" }],
    boundaries: ["Windows 示例；未证明 macOS/Linux 支持。", "本次没有安装 Skill 或完整插件到 Codex。"],
    failures: [{ condition: "浏览器退出非零、无输出、无效文件或超时", response: "返回失败，已有 PDF 保留。" }, { condition: "缺 Markdown 包", response: "提示 python -m pip install Markdown 并退出 2。" }],
    sources: [{ path: "examples/skills/md-to-pdf/SKILL.md", role: "操作说明" }, { path: "examples/plugins/md-pdf-toolkit/scripts/build_docs_pdf.py", role: "实际脚本" }, { path: "tests/test_pdf_example.py", role: "本次修复的回归" }],
    verification: ["相同中文/空格/单引号样例：修复前 0/1，修复后 1/1。", "另以 E 盘临时目录和 C 盘目标验证默认无参数导出；生成一页 PDF，渲染与提取文字通过。"],
    relation: "把手册的复用和验证原则落到一个真实可运行的例子。",
    searchProjection: { intents: ["中文空格文件名转PDF", "不带参数运行PDF示例", "导出失败保留旧文件"], entities: ["build_docs_pdf.py", "Markdown", "Edge", "--dir", "--docs", "CREATE_NO_WINDOW"], relations: ["独立浏览器打印后同卷原子替换"], failureRecovery: ["旧PDF不冒充新成果", "缺依赖显示指引"] }
  },
  {
    id: "three-tier-durable-state-and-memory-backup", slug: "three-tier-durable-state-and-memory-backup", order: 4,
    title: "运行数据、长期源码与私人备份", shortTitle: "资料与备份", route: "/projects/codex-app-power-user-playbook/three-tier-durable-state-and-memory-backup",
    teaser: "先分清各自价值，再决定怎样保存", kicker: "持久状态的组织方法", status: "文档方法；本仓库不执行备份", statusTone: "unknown",
    value: "帮助使用者区分自己长期维护的内容与应用运行产生的数据。",
    why: "把整个运行目录当源码，会混入会话、数据库和缓存；把它全当缓存删除，又会丢掉配置与有价值的历史。",
    example: "我想整理 Codex 的长期资料。把自己写的规则和脚本留在源码仓库；应用目录继续归应用管理；需要留存的少量文件再按明确名单进入私人备份。",
    result: "得到保存责任清晰的方案；实际复制、同步和恢复由选定的备份工具与目标执行。",
    problem: "当前文件比备份更短，不应直接认为旧内容已经无价值；需按本人意图保留或处理历史。",
    readerStates: { pass: "源码和备份各有明确内容集与验证方法。", problem: "原文、备份或任务状态不一致时先核对，不盲目覆盖。", unavailable: "尚未实现备份执行器时只能说方案已写，不能说已自动保全。" },
    decisionImpact: ["Runtime home 可含配置、安装态、会话、记忆、数据库与缓存，不能一概叫易失缓存。", "长期源码放规则、手册、Skill/插件源和必要证据；不在应用缓存里开发唯一副本。", "私人备份建议白名单，并排除认证资料、原始会话、JSONL 日志、数据库/缓存等不属于该例子范围的载荷；具体真实备份策略仍归对应 owner。"],
    implementation: ["README 的 Durable State Pattern 与 capability-map 的同名章节定义三个责任位置；没有 durable-state.three-tier.v1 schema。", "文档建议保留 backup-only 的更丰富历史记忆、避免自引用 manifest 反复变更、无内容变化时跳过 Git 提交与推送。", "验证计划备份要同时看任务状态、结果码、日志、本地快照和远端 Git；仅看到计划任务存在不能判成功。本仓库没有该调度或同步代码。"],
    flow: ["识别应用管理的数据", "挑出长期人工维护来源", "选择私人备份内容和目标", "由实际工具执行", "核对本地与远端结果"],
    concepts: [{ term: "白名单", explanation: "明确选择哪些文件进入这份备份，而不是复制整个运行目录。" }],
    boundaries: ["是可选组织方法，不是自动备份或防缩水保护实现。", "不改变现有独立备份项目的完整性要求。"],
    failures: [{ condition: "只有任务配置，没有成功输出", response: "保留未验证，不称为完成备份。" }],
    sources: [{ path: "README.md", role: "持久状态方法" }, { path: "docs/capability-map.md", role: "备份建议与验证" }],
    verification: ["已核对源码中没有备份执行器；本次未修改实际备份目标或调度。"],
    relation: "帮助保存可复用能力，具体数据生命周期仍由应用与备份项目负责。",
    searchProjection: { intents: ["Codex运行目录能不能整个放Git", "规则源码与应用数据怎么分", "备份文件变短怎么办"], entities: ["Runtime Home", "Long-Term Source Repo", "Private Memory Backup Repo", "whitelist"], relations: ["方法说明和真实备份执行分开"], failureRecovery: ["保留有价值历史", "任务存在不等于备份成功"] }
  },
  {
    id: "public-safety-boundary-and-sanitization", slug: "public-safety-boundary-and-sanitization", order: 5,
    title: "公开分享与外部动作判断", shortTitle: "分享边界", route: "/projects/codex-app-power-user-playbook/public-safety-boundary-and-sanitization",
    teaser: "分享可复用方法，先核对实际载荷和授权", kicker: "文字指导的边界", status: "公共模板与指南", statusTone: "unknown",
    value: "提醒使用者分享方法时检查真实内容，外部动作应符合本人已经明确的意图。",
    why: "私人规则可能含账号或可复用凭据；一条看似无害的复制命令也可能覆盖已有规则。只靠“模板是公开的”不能判断目标动作。",
    example: "我想把一套协作方法公开给别人。先把适用段落做成通用例子，检查是否夹带私人正文和密钥；发布到哪、发布哪些文件也要明确。",
    result: "形成读者能适配的公共材料，并保留实际发布或修改范围；不是自动运行的拦截服务。",
    problem: "敏感性按真实值判断，普通非敏感技术路径或名字不应被说成一律禁止公开；模板建议使用占位符主要为了可移植。",
    readerStates: { pass: "内容和目标清楚、授权覆盖后，按实际项目流程完成。", problem: "发现可复用凭据或私人载荷时，处理该具体内容。", unavailable: "目标或授权确实不明时说明缺口，不靠模板给自己新权限。" },
    decisionImpact: ["分享模板和例子前检查实际内容，不直接发布未经整理的私人操作手册。", "删除、重置、账号设置、发消息和公开发布有不同影响，不能由文字示例替代当前授权。", "已有明确授权继续有效，不把所有提交和推送都变成新确认。"],
    implementation: ["AGENTS.public.md 的 Execution Rules 和 Public Safety、capability-map 的 Public Repository Safety 提供人工/AI 阅读指导。", "没有凭据扫描服务、自动动作阻断器或授权状态机；指南是否被采用及怎样执行取决于当前任务环境。", "公开项目的实现、版本和一般路径可按真实价值保留；密钥、令牌和私人正文不能因为在配置、注释或旧文件中而忽略。"],
    flow: ["明确目标与要分享的材料", "阅读实际载荷", "保留可复用方法并处理具体私密值", "按授权完成真实动作", "核对目标结果"],
    concepts: [{ term: "外部动作", explanation: "会发消息、修改远端或公开内容的真实操作，需要对应的明确意图。" }],
    boundaries: ["文字指导不是机器防御产品，也不是本机活动权限规则。"],
    failures: [{ condition: "发现真实凭据或未明确目标", response: "停止依赖该内容的公开动作并处理具体问题，不扩成全仓安全工程。" }],
    sources: [{ path: "templates/AGENTS.public.md", role: "文字模板" }, { path: "docs/capability-map.md", role: "公开使用建议" }],
    verification: ["本次公开变更仅含修复脚本、虚构回归与说明；真实用户规则和任务数据未复制。"],
    relation: "贯穿手册复用和示例分享，服从当前实际项目与授权。",
    searchProjection: { intents: ["分享AGENTS模板不要带秘密", "哪些外部动作需要明确授权", "普通本地路径是不是都不能公开"], entities: ["AGENTS.public.md", "Public Safety", "external effect", "credentials"], relations: ["公开载荷与动作授权分别判断"], failureRecovery: ["只处理具体私密值", "模板不产生新权限"] }
  }
];

export const project = codexAppPowerUserPlaybookProject;
export const modules = codexAppPowerUserPlaybookModules;
