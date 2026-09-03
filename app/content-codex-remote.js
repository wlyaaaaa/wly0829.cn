import { createProjectSnapshot } from "./project-snapshot.js";

const codexRemoteFrozenBoundary = "当前控制入口不可用且冻结：不调用 Status、Open、Close、重启、登记、回滚、dispatcher（分派器）、计划任务、Sidecar（认证侧车）、Broker（共享代理）或公网端点，也不走替代启动路径。仅可只读查看获准的具名源码、文档、测试定义与历史图片；恢复须由用户另行明确启动独立项目并重新完成端到端验收。";
const codexRemoteHistoricalFlow = "以下是已保留源码所定义的历史流程，用于理解曾经做成的能力，不是当前操作步骤；运行时冻结期间不执行、不探测，也不因旧测试或截图解除冻结。";

const codexRemoteSnapshot = createProjectSnapshot({
  observedAt: "2026-08-30T11:29:50Z",
  label: "历史真实链路、正式版本、源码与20张界面证据已确认；当前控制入口不可用且冻结",
  boundary: "历史真实链路与产品证据已形成；当前控制入口明确为不可用且冻结，禁止打开、关闭、重启或调用。恢复属于另一个明确启动的项目，并需重新完成端到端验收",
  metrics: [
    { label: "当前可用入口", value: "0" },
    { label: "当前现实操作", value: "0" },
    { label: "最后正式版", value: "v0.1.5" },
    { label: "历史图证", value: "20" }
  ],
  facts: [
    { label: "现在能不能用", value: "当前可用控制入口为 0，允许执行的现实 Remote 操作为 0：运行时明确冻结且不可用。最后正式版是 v0.1.5；20 张历史图证只说明曾经做成的产品与界面，不代表现在在线。" },
    { label: "它实际是什么", value: "手机浏览器继续同一个 Codex Desktop 任务；不是远程桌面、屏幕串流或公网 Shell" },
    { label: "主要能力", value: "任务与历史、公开进展、工具、diff、父子智能体导航、审批、引导、停止、下一轮队列、模型/上下文/额度、所有者文件工作台、安装更新回滚" },
    { label: "正式公开版本", value: "v0.1.5 / c3a07719ecbe00dbad515b3cae00fd0f33b186d2；CI run 30756063724 记录 1771 项 Vitest、370 文件 PUBLIC scan，以及 Playwright 192 项发现 / 157 通过 / 35 跳过" },
    { label: "界面证据", value: "12 张历史真实手机 UI + 7 张公开合成演示 + 1 张历史合成 QA，共 20 张" },
    { label: "历史走通结果", value: "手机、双 Web 与 Desktop 曾走通同一任务/轮次、审批、文件 SHA、子智能体、引导、队列、停止、计划问题、压缩与重连" },
    { label: "共享机制", value: "Browser → 认证 Sidecar → loopback Broker → 单一 app-server ← Codex Desktop；共享 threadId / turnId", hero: false },
    { label: "当前源码", value: "Git Owner 确认 wlyaaaaa/codex-local-remote 为 PUBLIC（公开），默认 main；观察时远端 main=94f1cfadfbba97d3cfd2b21c73fba0104ccf2cf6，本地工作树干净。", hero: false },
    { label: "正式版本证据", value: "最新正式公开版本为 v0.1.5，对应 c3a07719ecbe00dbad515b3cae00fd0f33b186d2；GitHub Actions run 30756063724 / job 91519619868 正式回读 114 个 Vitest 文件、1771 passed，PUBLIC scan 370 files，Playwright 192 discovered / 157 passed / 35 skipped。", hero: false },
    { label: "当前源码版本", value: "当前 main 的 package version 是 0.1.6-unreleased.0；它包含 v0.1.5 后的源码变化，但本页不把它写成已发布 v0.1.6。", hero: false },
    { label: "CI 分层", value: "v0.1.5 对应公开 CI 已通过；当前 main 的最新 CI run 31145586404 为 failure，因此正式 release 证据与当前源码验证状态必须分开。", hero: false },
    { label: "冻结状态", value: "当前 codex-local-remote-control Skill 明确返回 Status=不可用，并冻结 runtime：禁止 Open、Close、restart、dispatcher、计划任务、Sidecar、Broker、public endpoint 或替代启动路径。该状态高于‘本轮未探测在线’的 Unknown 表述。", hero: false },
    { label: "源码能力", value: "源码实现同一任务、steer、interrupt、DPAPI 加密 FIFO 队列、审批、模型/上下文/额度、父子智能体历史与只读导航、文件工作台、认证、SSE 重连、回环 Broker 与单一 app-server 边界。", hero: false },
    { label: "运行代与回退", value: "历史源码实现内容寻址不可变运行代、原子 current/previous 指针、兼容 Web/Sidecar 排空切换、同一幂等键续接与新 Sidecar 失败后的旧代恢复；底层变化另作显式交接。这些资产保留，但当前登记、更新、回滚、Status 与 Open 均不可调用。", hero: false },
    { label: "历史真实验收", value: "历史真实手机、双 Web 与 Desktop 曾完成同一任务/轮次、审批、文件 SHA、子智能体、引导、队列、停止、计划问题、压缩和重连验收。", hero: false },
    { label: "图像证据组成", value: "本页20张图由12张真实手机 UI、7张 PUBLIC 合成演示和1张历史合成 QA 组成；真实图只裁除私有地址栏并清除元数据，普通非敏感技术事实保留。", hero: false }
  ],
  gaps: [
    "历史真实链路与产品证据已形成，但当前控制入口不可用且冻结；页面与本轮任务没有访问任何 Remote 运行态。",
    "恢复不是普通状态检查或重启：必须由用户明确启动独立恢复项目，重新决定实现并完成 fresh E2E；静态证据、旧制品和历史成功都不能改变当前不可用状态。",
    "v0.1.5 的测试和历史真实验收只证明对应版本与场景，不自动覆盖当前 Desktop、Codex、网络或浏览器版本。",
    "当前 main 最新 CI 未闭合；它不推翻 v0.1.5 的历史正式证据，但也不能从旧 release 推导当前 main 已通过。",
    "本轮没有读取已安装 runtime-current.json、Supervisor 或 Sidecar 状态，也没有执行安装、滚动更新、回滚、显式 handoff 或无人值守接管验收。",
    "产品设计要求从子任务返回父任务并恢复阅读位置；现有源码与浏览器场景证明可进入子任务和返回父任务，但本轮没有取得精确滚动位置恢复的独立验收结果。",
    "公开合成截图证明 UI 与状态合同，不证明真实任务执行；历史真实截图也只代表拍摄时刻。",
    "文件工作台继承单一 Windows 所有者权限，不提供多用户隔离，也不能抵御同一 Windows 用户下的恶意软件。",
    "历史协议在 Desktop 未连接、订阅屏障失败、审批缺选项或请求身份不清时失败关闭；当前更早的冻结边界已禁止整条控制链，不能因为旧协议条件满足而重新启用。"
  ]
});

export const codexRemoteProject = {
  order: 9,
  slug: "codex-remote",
  title: "Codex Remote",
  route: "/projects/codex-remote",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "历史真实链路与产品证据已形成；当前控制入口不可用且冻结",
  cardStatusTone: "problem",
  ...codexRemoteSnapshot,
  searchAliases: ["手机继续Codex桌面任务", "Codex手机远程控制", "同一个Desktop任务", "手机审批和看diff", "Codex Remote", "Codex Remote怎么更新回滚", "手机查看子智能体"],
  repositoryNote: "源码位于 PUBLIC（公开）GitHub 仓库。这是社区构建的非官方 companion（配套工具），没有厂商隶属、背书或合作关系。页面直接展示真实产品名、公开版本、架构、代码、测试和历史真实手机画面；只隐藏可复用凭据、私人 tailnet 地址和实际达到三级以上且经逐值判断确属敏感的内容。当前控制入口不可用且冻结，页面不宣称在线，也不调用任何运行组件。",
  summary: "Codex Remote 曾让手机浏览器继续电脑上同一个 Codex Desktop 任务：查看进展、命令、文件改动与父子智能体，处理审批、补充要求、停止回复或排队下一件事。它不传输桌面画面，也不另开聊天；可回退运行代和共享任务设计均保留，但 Windows 接管未达到可重复恢复要求，当前控制入口不可用且冻结，本页只供理解历史产品与实现。",
  why: "长任务可能正在电脑上运行、等待审批、派出子智能体或已经改了文件。另开一个手机聊天只能复制文字，拿不到同一个任务的真实轮次、父子层级、工具、审批和文件状态；粗暴更新又可能中断正在工作的 Sidecar。Codex Remote 把移动端设计成“查看—审批—引导—排队—回读”的控制面，并把安装、采用与回滚分开。",
  plainExample: "历史场景是：父任务让两个子智能体检查代码和测试，手机可进入子任务核对结果，再返回父任务补充要求；兼容更新则由排空与精确旧代回退保护正在工作的链。现在问“能否从手机继续”，得到的当前答案是不可用、已冻结，只能查看这些静态证据，不运行状态检查或尝试一次 Open。",
  result: "页面保留一个确实形成过的移动控制产品：同一任务、轮次、公开进展、工具、文件、审批、父子智能体、模型、上下文、额度，以及所有者文件与运行代设计均可还原。当前得到的是有证据边界的只读产品参考，不是可登录、可执行或可恢复的 Remote 服务。",
  readerStates: {
    pass: "历史成功证据证明手机与电脑曾共享同一任务和轮次，并完成部分真实操作；当前只能只读还原这条链，不能把历史成功当成恢复资格。",
    problem: "源码保留断线、历史不完整、审批缺项、队列不明和新 Sidecar 失败的处理设计；Windows 接管没有形成可重复恢复，因此当前不执行这些补偿或重试。",
    unavailable: codexRemoteFrozenBoundary
  },
  productPrinciples: [
    { title: "冻结事实先于历史能力", detail: "每个直达模块都保留当前不可用边界。历史功能、测试或一次成功不能授权状态探测、安装或重启；恢复另作明确项目和新验收。" },
    { title: "两端共享同一个任务事实", detail: "手机与 Desktop 使用同一任务和轮次，不复制聊天历史制造看似同步的第二份任务。" },
    { title: "移动端只保留真正需要的控制", detail: "优先查看、审批、引导、停止、排队和回读，不把整套桌面界面机械缩小到手机。" },
    { title: "当前轮和下一轮严格分开", detail: "当前回复怎样继续、下一轮换什么模型和做什么是两种状态，不能热切换出无法解释的中间结果。" },
    { title: "界面只显示运行时真实提供的值", detail: "模型、审批选项、额度、上下文和工具状态不写死，也不为了界面完整补造按钮。" },
    { title: "待发队列不是任务记录", detail: "Web草稿只有真正派发并被同一任务接受后，才成为任务的一部分。" },
    { title: "项目任务和所有者文件是两条边界", detail: "任务工作区受项目身份约束，文件工作台使用 Windows 所有者能力；两者不能互相冒充权限。" },
    { title: "公网只看到产品接口", detail: "认证、同源和确认边界挡在前面，底层任务协议、回环服务与敏感载荷留在本机。" },
    { title: "结果不清就先回读，不自动重放", detail: "断线、重复提交或状态不确定时保留草稿和幂等身份，先确认权威状态再决定是否继续。" },
    { title: "子智能体是任务树，不是会消失的通知", detail: "运行、等待、完成和失败都留在父子层级与历史中；手机可进入只读查看，补充要求仍回到可控制的父任务。" },
    { title: "登记、采用和底层交接必须分开", detail: "新构建先成为可验证、可回退的候选；兼容 Web/Sidecar 才能滚动更新，Broker 或 app-server 变化必须显式 handoff（交接）。" },
    { title: "通用智能来自运行时，Remote 负责同任务控制", detail: "理解、推理、工具和代码执行来自已集成的 AI/智能体运行时；Codex Remote 负责把同一任务、审批、文件和恢复语义带到手机，不冒充基础智能的作者。" }
  ],
  gallery: [
    {
      src: "/media/codex-remote/01-desktop-task-overview.jpg",
      thumbnail: "/media/codex-remote/thumbs/01-desktop-task-overview.webp",
      alt: "Codex Remote 桌面三栏任务总览合成演示",
      caption: "桌面三栏把项目、任务列表、当前状态、待决策事项和额度放在同一个工作台中；内容使用公开合成数据。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明宽屏任务总览、状态层级和跨区域导航已经形成真实 UI。",
      doesNotProve: "不证明当前电脑在线、当前账号额度或真实任务内容。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/16-real-task-list.jpg",
      thumbnail: "/media/codex-remote/thumbs/16-real-task-list.webp",
      alt: "2026年7月28日 Codex Remote 真实手机任务列表",
      caption: "真实手机浏览器中的任务页：电脑在线、运行任务、当前/归档、筛选和置顶顺序共同工作；只裁掉了私有地址栏。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明任务列表和运行状态曾在真实手机浏览器中工作。",
      doesNotProve: "不证明图中任务、模型或在线状态仍是当前事实。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/02-mobile-task-home-zh.jpg",
      thumbnail: "/media/codex-remote/thumbs/02-mobile-task-home-zh.webp",
      alt: "Codex Remote 中文手机任务首页合成演示",
      caption: "中文任务首页同时展示电脑连接、运行任务、待决策提醒、搜索筛选和底部导航。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明中文移动首页的信息架构和主要触控入口。",
      doesNotProve: "不证明截图里的任务或连接状态来自当前机器。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/07-mobile-task-home-en.jpg",
      thumbnail: "/media/codex-remote/thumbs/07-mobile-task-home-en.webp",
      alt: "Codex Remote 英文手机任务首页合成演示",
      caption: "同一任务首页切换为英文，保留任务分组、状态、项目和主要操作，不是另一套页面。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明中英文切换复用同一产品结构。",
      doesNotProve: "不证明所有运行时动态值都已经翻译。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/08-real-task-runtime.jpg",
      thumbnail: "/media/codex-remote/thumbs/08-real-task-runtime.webp",
      alt: "Codex Remote 真实任务模型权限和状态界面",
      caption: "真实任务详情展示任务标识、模型、思考等级、权限模式、额度和文件活动；普通非敏感技术事实按原画面保留。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明任务参数、上下文与运行活动曾在手机端合并呈现。",
      doesNotProve: "不证明图中模型、权限、额度或任务标识仍是当前配置。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/12-real-live-worklog.jpg",
      thumbnail: "/media/codex-remote/thumbs/12-real-live-worklog.webp",
      alt: "Codex Remote 真实工作记录和引导输入界面",
      caption: "真实手机端连续呈现公开思考摘要、命令、文件编辑、阶段结论和引导输入；内部隐藏推理不进入界面。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明长任务的公开工作记录和当前轮引导曾真实可用。",
      doesNotProve: "不证明任何隐藏思维链可见，也不代表当前版本在线。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/03-mobile-conversation-zh.jpg",
      thumbnail: "/media/codex-remote/thumbs/03-mobile-conversation-zh.webp",
      alt: "Codex Remote 完整移动对话合成演示",
      caption: "任务头、回复、工具、文件修改、输入器和下一轮设置在 412×915 移动布局中保持完整。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明移动对话主流程的布局与状态层级。",
      doesNotProve: "不证明合成任务真正执行或当前服务在线。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/09-real-conversation-tools.jpg",
      thumbnail: "/media/codex-remote/thumbs/09-real-conversation-tools.webp",
      alt: "Codex Remote 真实对话工具面板",
      caption: "真实手机端的对话工具面板提供添加文件、任务目标、计划模式和上下文压缩入口，并按运行时能力显示可用状态。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明对话工具入口曾随真实任务状态工作。",
      doesNotProve: "不证明每个入口对所有运行时版本都可用。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/10-real-command-details.jpg",
      thumbnail: "/media/codex-remote/thumbs/10-real-command-details.webp",
      alt: "Codex Remote 真实命令详情和完成状态",
      caption: "手机底部抽屉展示命令原文、完成状态和有界输出，使“运行过什么”可以直接核对。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明命令详情与执行状态曾在真实任务里展开。",
      doesNotProve: "不证明截图中的命令适合再次执行或代表当前机器状态。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/04-mobile-approval-zh.jpg",
      thumbnail: "/media/codex-remote/thumbs/04-mobile-approval-zh.webp",
      alt: "Codex Remote 结构化审批合成演示",
      caption: "审批抽屉显示命令、影响文件、问题和运行时提供的允许/拒绝选项；页面不会自己猜造按钮。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明结构化审批信息与触控操作的 UI 合同。",
      doesNotProve: "不证明任何当前审批已被允许，也不代表任意请求都有可提交选项。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/11-real-diff-details.jpg",
      thumbnail: "/media/codex-remote/thumbs/11-real-diff-details.webp",
      alt: "Codex Remote 真实文件差异查看器",
      caption: "真实手机端展开项目文件的逐行 diff，保留新增、删除、路径和最新文件之间的切换。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明真实代码差异曾能在手机端核对。",
      doesNotProve: "不证明该差异已提交、已发布或仍存在于当前源码。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/05-mobile-file-diff-zh.jpg",
      thumbnail: "/media/codex-remote/thumbs/05-mobile-file-diff-zh.webp",
      alt: "Codex Remote 移动文件差异合成演示",
      caption: "公开合成数据演示完整文件 diff、上下文行和可关闭抽屉，适合说明改动而不泄露真实项目。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明安全演示中的 diff 阅读体验。",
      doesNotProve: "不证明真实仓库存在同样改动。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/06-mobile-model-controls-zh.jpg",
      thumbnail: "/media/codex-remote/thumbs/06-mobile-model-controls-zh.webp",
      alt: "Codex Remote 下一轮模型与思考设置合成演示",
      caption: "下一轮模型、思考等级和速度与当前运行参数分开；界面明确说明不会热切换正在生成的回复。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明下一轮设置与当前轮状态分离的产品设计。",
      doesNotProve: "不证明图中模型目录就是当前账号可用目录。",
      observedAt: "2026-08-02",
      sourceCommit: "PUBLIC v0.1.5"
    },
    {
      src: "/media/codex-remote/15-real-project-files.jpg",
      thumbnail: "/media/codex-remote/thumbs/15-real-project-files.webp",
      alt: "Codex Remote 真实项目文件浏览器",
      caption: "真实手机文件页提供项目选择、过滤和目录列表；图中普通目录名称不是凭据，按用户分级规则保留。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明项目文件浏览曾在真实手机端工作。",
      doesNotProve: "不证明当前 Windows 文件权限或所有磁盘都可访问。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/14-real-diagnostics.jpg",
      thumbnail: "/media/codex-remote/thumbs/14-real-diagnostics.webp",
      alt: "Codex Remote 真实连接与服务诊断",
      caption: "真实历史界面同时展示 Public access、Sidecar、Codex 服务和额度；版本与健康字样只代表截图当时。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明连接和能力诊断曾进入真实手机 UI。",
      doesNotProve: "不证明当前在线、当前版本或当前服务健康。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/13-real-account-session.jpg",
      thumbnail: "/media/codex-remote/thumbs/13-real-account-session.webp",
      alt: "Codex Remote 真实会话额度和服务能力界面",
      caption: "真实历史设置页展示登录会话、Credits、账号用量和能力可用性；普通用量事实保留，不把旧值写成当前值。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机使用画面",
      proves: "证明会话、额度和能力状态曾被统一展示。",
      doesNotProve: "不证明图中额度、到期时间或能力仍有效。",
      observedAt: "2026-07-28",
      sourceCommit: "v0.1.1-era real UI"
    },
    {
      src: "/media/codex-remote/17-real-progress-detail.jpg",
      thumbnail: "/media/codex-remote/thumbs/17-real-progress-detail.webp",
      alt: "Codex Remote 真实目标卡和步骤进度细节",
      caption: "真实手机 UI 的目标卡同时显示进行状态、当前模式和第 3/9 步，证明长任务结构可以在小屏快速查看。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机细节裁切",
      proves: "证明目标与步骤进度曾在真实移动界面出现。",
      doesNotProve: "不证明该目标仍在运行或当前产品一定使用相同步数。",
      observedAt: "2026-08-02",
      sourceCommit: "v0.1.5-era real UI"
    },
    {
      src: "/media/codex-remote/18-real-reply-queue-toggle.jpg",
      thumbnail: "/media/codex-remote/thumbs/18-real-reply-queue-toggle.webp",
      alt: "Codex Remote 真实当前回复和排队切换细节",
      caption: "真实输入控制条把发送到当前回复与排队分开，并同时保留当前模式和步骤进度。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机细节裁切",
      proves: "证明当前轮与队列路由在真实 UI 中有明确分隔。",
      doesNotProve: "不证明队列消息已经派发到 Desktop。",
      observedAt: "2026-08-02",
      sourceCommit: "v0.1.5-era real UI"
    },
    {
      src: "/media/codex-remote/19-real-composer-controls.jpg",
      thumbnail: "/media/codex-remote/thumbs/19-real-composer-controls.webp",
      alt: "Codex Remote 真实手机输入模型和发送入口细节",
      caption: "真实输入器把文本、下一轮模型选择和发送按钮放在一个小屏控制条内，不遮挡当前回复。",
      evidenceLevel: "E3",
      evidenceLabel: "真实手机细节裁切",
      proves: "证明移动输入和下一轮参数曾在真实产品中共同工作。",
      doesNotProve: "不证明截图文字已经发送，也不代表当前模型目录。",
      observedAt: "2026-08-02",
      sourceCommit: "v0.1.5-era real UI"
    },
    {
      src: "/media/codex-remote/20-demo-queued-message-actions.jpg",
      thumbnail: "/media/codex-remote/thumbs/20-demo-queued-message-actions.webp",
      alt: "Codex Remote 下一轮队列编辑合成 QA 界面",
      caption: "历史合成 QA 展示队列消息的上移、下移、编辑、删除和转为当前轮引导；底部输入器仍区分当前回复与下一轮。",
      evidenceLevel: "E1",
      evidenceLabel: "历史合成 QA",
      proves: "证明队列操作与输入路由的完整 UI 合同。",
      doesNotProve: "不证明合成消息曾进入真实 Desktop 队列或当前在线。",
      observedAt: "2026-07-26",
      sourceCommit: "synthetic UI audit"
    }
  ],
  responsibilities: [
    "在手机与 Desktop 之间保持同一任务、同一轮次和同一持久记录，而不是生成第二份聊天",
    "显示 Codex 公开提供的助手正文、推理摘要、工具、命令、文件修改、图片、子智能体、计划和最终回答",
    "把当前与归档子智能体恢复成可进入的父子任务树，保留运行、等待、完成、失败与历史完整性状态",
    "让用户在手机处理运行时实际提供的审批与结构化问题，并区分当前轮引导、停止和下一轮队列",
    "从当前运行时读取模型、思考等级、速度、权限、审批、上下文和额度，不用写死目录冒充当前状态",
    "提供注册项目、隔离无项目任务和独立所有者文件工作台，并为覆盖、永久删除等动作保留确认边界",
    "用认证 Sidecar、回环 Broker 和单一 app-server 保持公网入口与底层协议隔离",
    "把构建安装成内容寻址的不可变运行代，以原子 current/previous 指针、排空切换和精确旧 Sidecar 恢复管理更新",
    "在断线、重复提交、订阅缺失和身份不清时失败关闭，保留草稿和可恢复状态"
  ],
  exclusions: [
    "不提供远程桌面画面、任意公网 Shell、原始 app-server JSON-RPC 或匿名文件代理",
    "不显示模型隐藏的完整思维链，只展示运行时公开提供的 summary（摘要）与工具活动",
    "不在同一轮生成中热切换模型、思考等级、速度或权限；设置只影响下一轮",
    "不把 Web 的下一轮队列冒充 Desktop 原生未发送草稿；真正派发后才进入 Desktop 持久记录",
    "不让手机直接控制只读子智能体；补充要求必须回到仍可控制的父任务，由父智能体转交",
    "不把登记候选写成已经采用，不把兼容 Web/Sidecar 更新扩大成 Broker、app-server 或 Desktop 的隐式重启",
    "不猜造审批选项、模型目录、额度或当前在线状态，缺失时保持 Unknown（未验证）",
    "不公开密码、Cookie、token、认证数据库、私有 tailnet 地址或逐值判断后确属敏感的三级以上内容"
  ],
  glossary: [
    { term: "Sidecar（认证侧车服务）", meaning: "对浏览器提供登录、产品 API、SSE 事件、文件能力和领域投影；公网只到这一层。" },
    { term: "Broker（共享代理服务）", meaning: "只在本机回环上连接 Desktop、Sidecar 与单一 app-server，并维护 RPC 对应与订阅屏障。" },
    { term: "app-server（任务协议服务）", meaning: "Codex 的任务、轮次、审批、模型和事件来源；原始接口不会直接暴露公网。" },
    { term: "threadId / turnId（任务 / 轮次标识）", meaning: "证明手机与 Desktop 指向同一任务和同一轮执行的稳定身份。" },
    { term: "Work Log（公开工作记录）", meaning: "按顺序呈现公开进展、工具、命令、文件和子智能体活动，不含隐藏推理。" },
    { term: "steer（当前轮引导）", meaning: "在当前回复仍运行时追加要求；它不同于排队下一轮。" },
    { term: "outbox（加密待发队列）", meaning: "Sidecar 保存尚未派发的下一轮消息；内容以当前 Windows 用户 DPAPI 密文落盘。" },
    { term: "runtime generation（运行代）", meaning: "由运行文件内容和兼容身份共同计算 SHA-256 的不可变目录；同样内容复用同一代。" },
    { term: "current / previous pointer（当前 / 上一运行代指针）", meaning: "原子记录待采用版本、上一可回退版本及两个 manifest 哈希，不等于当前进程已经切换。" },
    { term: "drain（排空）", meaning: "更新前拒绝新写入与下一轮派发，等待已经接纳的活动结束，再签发绑定同一 update id 的回执。" },
    { term: "subagent history integrity（子智能体历史完整性）", meaning: "分别说明当前与归档记录是否读尽、部分、未知或失败，避免把短列表冒充全部历史。" },
    { term: "SSE（服务器事件流）", meaning: "浏览器接收实时任务更新的单向事件通道；断线后按事件序号续接或重读快照。" },
    { term: "CSRF（跨站请求伪造防护）", meaning: "写请求必须同时满足登录、可信来源和一次性校验，避免第三方网页借用会话操作电脑。" },
    { term: "opaque grant（不透明短时授权）", meaning: "任务正文中的本地绝对路径换成短时文件引用，避免形成可复用公网裸链接。" },
    { term: "owner file manager（所有者文件工作台）", meaning: "继承 Sidecar 当前 Windows 身份的文件能力，不是多用户沙箱。" }
  ],
  operatingFlow: [
    { title: "先确认当前冻结，不进入操作", detail: codexRemoteFrozenBoundary + " 后续条目只说明历史实现的职责与次序，不是现行执行步骤。" },
    { title: "安装先生成可回退运行代", detail: "构建与检查通过后，注册器把 Web、Sidecar、Broker 和 Windows 脚本复制到内容寻址目录，验证 manifest，再原子记录 current/previous；登记本身不打开 Remote。" },
    { title: "浏览器先通过认证入口", detail: "手机只访问 HTTPS 反向代理后的 Sidecar；登录、会话、Origin、CSRF 与限速在产品 API 之前生效。" },
    { title: "选择同一个任务或创建有界任务", detail: "已有任务按 threadId 恢复；新任务只能使用本机登记项目或隔离无项目根。" },
    { title: "Broker 完成 Desktop 订阅屏障", detail: "需要新首轮时，先让任务壳持久化并确认 Desktop 已 resume；没有 Desktop 证据就拒绝 turn/start。" },
    { title: "实时投影公开任务事件", detail: "Sidecar 将正文、公开摘要、工具、文件、审批、计划和子智能体投影为浏览器能读的产品状态。" },
    { title: "进入子任务后仍沿父子关系返回", detail: "手机从父任务打开缩进列表，进入任一仍有记录的子任务只读查看消息、工具和文件；补充要求回到父任务转交，历史不完整时明确提示。" },
    { title: "用户选择当前轮或下一轮动作", detail: "steer、interrupt、审批是当前实时动作；队列、模型和模式属于下一轮，界面明确分开。" },
    { title: "文件动作逐步确认并回读", detail: "浏览、预览、上传、编辑、移动和删除都按不透明根与相对路径执行；覆盖、永久删除需要明确选择。" },
    { title: "断线只恢复可证明的部分", detail: "SSE 用事件 ID 重连，草稿和加密队列保持；实时动作缺连接时失败关闭，不静默重放。" },
    { title: "更新只切换兼容的公网层", detail: "显式租约内先排空已接纳写入，再短切换 Web/Sidecar；浏览器以同一幂等键续接，新 Sidecar 失败则恢复旧 Sidecar。Broker 或 app-server 变化必须另走显式交接。" },
    { title: "人工取证后更新网页", detail: "只有本人明确要求时，网页才重新读取 PUBLIC Git、版本、测试和获准图片；不建立在线探针或自动刷新。" }
  ],
  components: [
    { name: "Web PWA（手机网页应用）", responsibility: "提供任务、对话、审批、文件、设置与离线草稿界面。", implementation: "React + Vite + TypeScript；中文优先、响应式、主要触控目标至少44×44 CSS像素。" },
    { name: "Sidecar（认证侧车）", responsibility: "拥有登录会话、产品 API、SSE、领域投影、队列与文件能力。", implementation: "默认仅监听本机；不记录已发送对话和文件正文，待发队列用 DPAPI 加密。" },
    { name: "Broker（共享代理）", responsibility: "让 Desktop 与 Sidecar 连接同一个 app-server 并维护订阅屏障。", implementation: "回环 WebSocket；注入 RPC id 不向产品客户端泄露，Sidecar 断开不终止 Desktop。" },
    { name: "单一 app-server", responsibility: "提供任务、轮次、模型、审批、额度和事件协议。", implementation: "由 Broker 独占；原始 WebSocket 不监听 LAN 或公网。" },
    { name: "Domain projection（领域投影）", responsibility: "把协议事件变成稳定的任务、消息、工具、文件和审批产品模型。", implementation: "浏览器只依赖项目合同，不直接依赖底层 app-server 类型；原始 reasoning 被丢弃。" },
    { name: "Turn queue（下一轮队列）", responsibility: "保存、排序、编辑和派发尚未发送的下一轮要求。", implementation: "稳定消息 id、revision、串行 claim 与幂等键；不确定状态保持 ambiguous 而不重复发。" },
    { name: "Subagent navigation（子智能体导航）", responsibility: "恢复父子层级、运行状态、当前与归档历史，并提供进入子任务与返回父任务的只读旅程。", implementation: "domain 合并 current/archived 与任务内活动，计算 depth；Web 显示完整性元数据、分页和失败提示。" },
    { name: "Immutable runtime manager（不可变运行代管理）", responsibility: "安装、选择、验证与回退 Remote 自身版本。", implementation: "RuntimeVersions/<content-sha256> + runtime-manifest.json + 原子 runtime-current.json；稳定 dispatcher 每次先验证再调用。" },
    { name: "Supervisor maintenance drain（监督器维护排空）", responsibility: "在运行中任务不动的前提下切换兼容 Web/Sidecar。", implementation: "受保护维护 capability、绑定 update id 的 drain receipt、owner/compatibility 复核与旧 Sidecar 补偿启动。" },
    { name: "Owner file manager（所有者文件工作台）", responsibility: "按当前 Windows 身份浏览和操作检测到的磁盘。", implementation: "不透明 root id + 卷内相对路径；拒绝 traversal、UNC、设备路径、ADS 与未确认覆盖。" },
    { name: "Security package（安全组件）", responsibility: "提供密码哈希、会话、限速、Origin/CSRF、下载与 Windows 路径检查。", implementation: "Secure/HttpOnly/SameSite=Strict Cookie；写入需认证和同源证据。" },
    { name: "PUBLIC demo fixtures（公开演示材料）", responsibility: "用合成任务展示界面而不复制真实主机、对话、路径或凭据。", implementation: "静态 demo.ts 与浏览器验收共享类型合同；截图不接触 Remote runtime。" }
  ],
  usageExamples: [
    { ask: "电脑上的任务还在做什么？", effect: "当前 Remote 不可用且冻结，不查询任务；历史设计可在同一任务内显示回复、工作记录、工具、文件、计划和子智能体。", moduleSlug: "same-task-control" },
    { ask: "两个子智能体分别做到哪一步，完成的那个还能看吗？", effect: "当前不连接任务树；历史设计保留当前与归档子任务、只读详情和回到父任务转交的旅程。", moduleSlug: "subagent-navigation" },
    { ask: "给正在生成的回复补一句要求。", effect: "当前冻结，不发送 steer；历史合同先核对同一 threadId、active turnId、连接和 availableActions，轮次不接受时保留文字。", moduleSlug: "conversation-control" },
    { ask: "把这条要求放到下一轮，稍后再改顺序。", effect: "当前冻结，不写或恢复队列；历史设计先加密持久化正文与下一轮设置，再按 revision 编辑、排序和删除。", moduleSlug: "conversation-control" },
    { ask: "这个命令能不能在手机批准？", effect: "当前不能通过 Remote 批准；历史界面只展示本次真实可提交选项，缺项时不造按钮。", moduleSlug: "models-approvals-context" },
    { ask: "下一轮换模型并继续。", effect: "当前冻结，不查询目录或改设置；历史设计把目录中可用的模型、思考和速度只绑定下一轮，不热改当前轮。", moduleSlug: "models-approvals-context" },
    { ask: "手机查看刚才改了哪些文件。", effect: "当前不调用文件 API；历史工作记录可打开 diff、有界预览和下载，现页只保留源码与获准历史图证。", moduleSlug: "projects-files-input" },
    { ask: "从手机给任务添加电脑里的文件。", effect: "当前冻结，不浏览或引用真实文件；历史合同将绝对路径转换为短时不透明授权，避免形成可复用公网裸链。", moduleSlug: "projects-files-input" },
    { ask: "手机为什么能看到 Desktop 的实时进展？", effect: "只读解释历史 Browser、Sidecar、loopback Broker 到单一 app-server 的共享任务与 SSE 设计；当前不连接，且它不是远程桌面。", moduleSlug: "shared-realtime-architecture" },
    { ask: "怎样更新 Codex Remote，又不打断电脑上正在跑的任务？", effect: "当前禁止安装、Status/Open、更新与回滚；本模块只解释不可变运行代、兼容排空和补偿的历史设计。恢复需用户另行明确启动独立项目，不能照旧教程再试一次。", moduleSlug: "installation-update-rollback" },
    { ask: "公网入口会不会直接暴露电脑文件和 app-server？", effect: "只读解释历史登录、同源、CSRF、限速与不透明文件授权；当前入口冻结，不登录或探测，底层协议的设计边界仍是本机回环。", moduleSlug: "security-public-access" },
    { ask: "网页断线后会不会重复发送？", effect: "历史设计按 clientUserMessageId 对账，结果不明就 ambiguous 并停重发；当前冻结，不实际连接或恢复队列。", moduleSlug: "conversation-control" },
    { ask: "Codex Remote 以前跑通过，能说明现在在线吗？", effect: "不能。当前控制入口明确不可用且冻结，不是仅缺一次在线证据；历史 release、源码测试和真实成功分别保留，不能触发运行探测或解除冻结。", moduleSlug: "versions-evidence" }
  ],
  evidenceLayers: [
    { layer: "PUBLIC source（公开源码）", proves: "main 定义 Web、Sidecar、Broker、app-server client、domain、子智能体历史、不可变运行代、更新回滚、security、queue 与 files 的实现和边界。", doesNotProve: "当前机器已安装、启动、成功更新或在线。" },
    { layer: "v0.1.5 release tests（正式版本测试）", proves: "c3a07719 的正式 CI 记录 1771 项 Vitest、370 文件 PUBLIC scan，以及 Playwright 192 项发现 / 157 通过 / 35 跳过。", doesNotProve: "当前 main、当前 Desktop 或任意网络长期稳定。" },
    { layer: "Current main CI（当前源码持续集成）", proves: "94f1cfa 的最新公开 CI run 31145586404 为 failure。", doesNotProve: "v0.1.5 的正式版本证据失效，或当前运行时在线/离线。" },
    { layer: "Historical real E2E（历史真实端到端）", proves: "真实手机、双 Web 与 Desktop 曾共享任务/轮次并走通审批、文件、子智能体、引导、队列、停止和恢复。", doesNotProve: "本轮当前在线或所有新版本继续兼容。" },
    { layer: "Current control status（当前控制状态）", proves: "现行 Skill 明确 Status=不可用且 runtime frozen；任何控制、启动、停止或重启都禁止。", doesNotProve: "产品没有做成过、源码不可读，或未来不能在独立项目中恢复。" },
    { layer: "Real mobile gallery（真实手机画廊）", proves: "12张真实手机 UI 展示任务、对话、工具、命令、diff、文件、诊断、额度和输入控制。", doesNotProve: "截图里的任务、数值、模型或健康状态仍是当前事实。" },
    { layer: "Synthetic UI gallery（合成界面画廊）", proves: "7张公开演示与1张QA图在无私人数据情况下说明完整产品表面。", doesNotProve: "合成任务真的执行过或当前服务在线。" },
    { layer: "Current Git identity（当前 Git 身份）", proves: "观察时 PUBLIC main=94f1cfad、v0.1.5=c3a07719 且 source worktree 干净。", doesNotProve: "网页会自动跟随未来提交更新。" }
  ],
  evolution: [
    { date: "2026-07-25—07-27", commit: "ed801f5–352e14d", result: "形成同一任务、手机控制、公开任务列表、审批、队列和 v0.1.0/v0.1.1 产品基线。" },
    { date: "2026-07-31—08-01", commit: "b6988c5–4ef151d", result: "补齐长对话、steer/interrupt、DPAPI 持久 FIFO 队列、修订号编辑排序删除、发送对账、Work Log、动态审批、附件、目标和所有者文件能力。" },
    { date: "2026-08-02", commit: "df9ff3c–c3a0771", result: "完成 v0.1.3—v0.1.5 的移动体验、父子智能体查看、响应式验收与公开安全边界，并让兼容 Web/Sidecar 在活动任务期间经排空和补偿回滚有界更新。" },
    { date: "2026-08-02—08-06", commit: "e7949b6–94f1cfa", result: "继续收紧共享所有权、内容寻址运行代、current/previous 指针、历史完整性、端口与显式交接边界；公开 main 保留后续源码，正式发布身份仍以 v0.1.5 为准，当前 Windows 接管方案重新启用前还需隔离完成可重复无人值守验收。" }
  ],
  operationalEntrypoints: [
    { name: "先读停止旧路线的复盘", command: "Get-Content .\\docs\\failure-postmortem-2026-08-03.md", purpose: "只读保留真实成功与不可重复恢复的证据；不执行文档中的历史控制步骤，当前入口不可用且冻结。" },
    { name: "回读 PUBLIC refs", command: "git ls-remote --heads --tags https://github.com/wlyaaaaa/codex-local-remote.git", purpose: "只读确认 main、v0.1.5 和 tag 提交；不会触碰 Remote runtime。" },
    { name: "查看产品边界", command: "Get-Content .\\docs\\feature-matrix.md", purpose: "读取注册项目、无项目任务、审批、队列、文件和失败行为的当前源码合同。" },
    { name: "查看共享架构", command: "Get-Content .\\docs\\architecture.md", purpose: "读取 Browser、Sidecar、Broker、单一 app-server、SSE 与安全边界。" },
    { name: "只读历史安装设计", command: "Get-Content .\\docs\\quickstart.md", purpose: "理解构建、登记、Open、兼容排空、Status 与回滚的历史职责；不是照做指南，冻结期间禁止调用。" },
    { name: "查看源码测试定义", command: "Get-Content .\\package.json", purpose: "只读理解 check/build/test 的组成；当前档案审阅不执行构建、测试脚本或运行组件。" },
    { name: "查看合成浏览器场景", command: "Get-Content .\\tests\\e2e\\journey.spec.ts", purpose: "只读检查 SharedRuntime（合成运行时）场景与覆盖边界，不启动浏览器测试、Desktop、Broker 或 Sidecar。" }
  ]
};

export const codexRemoteModules = [
  {
    slug: "same-task-control",
    shortTitle: "同一任务",
    title: "手机怎样继续 Desktop 上同一个任务，而不是另开一份",
    searchAliases: ["手机和桌面同一个任务", "threadId turnId一致", "Desktop不在时拒绝首轮", "手机新建项目任务"],
    searchProjection: {
      intents: ["手机继续电脑上已经运行的同一个任务", "手机新建任务后让 Desktop 订阅同一任务", "核对手机和 Desktop 是否真是同一条任务"],
      entities: ["threadId", "turnId", "rollout", "Desktop resume barrier", "single app-server", "project root"],
      relations: ["相同 threadId 和 turnId 证明两端共享任务事实", "Desktop 完成 resume 屏障后才放行手机首轮", "Broker 只协调连接而单一 app-server 拥有任务"],
      failureRecovery: ["当前入口不可用且冻结，只读静态证据而不调用运行组件", "历史设计Desktop缺席时拒绝首轮并保留任务壳", "历史设计订阅不清时回读而不重放", "历史设计Sidecar断开不终止Desktop任务"]
    },
    teaser: "历史实现用同一 threadId、turnId、单一 app-server 与 Desktop 订阅屏障维持身份；当前控制冻结，不创建、恢复或查询任务。",
    status: "当前控制入口不可用且冻结；v0.1.5 与历史真实多端验收仅证明曾经走通，源码 CI 仍按原观察单列",
    statusTone: "problem",
    value: "历史产品让离开电脑后的手机继续原任务，不因另开聊天丢掉真实进展、审批和文件状态；当前保留这项设计与真实成功证据，但不能通过 Remote 继续任务。",
    why: "仅把历史消息复制到网页并不能证明两端是同一个任务。若手机创建了第二个 app-server 或 Desktop 尚未订阅就启动首轮，两端会出现不同 task、不同 turn 和无法解释的重复执行。",
    example: "历史首轮场景中，Broker 先让手机新建的空任务壳持久化，再要求 Desktop 对同一 thread 完成 resume，全部成功才启动第一条要求。现在只读解释这条屏障，不创建任务或连接 Broker。",
    result: "可从源码与历史验收还原 threadId、turnId、rollout 和工作目录一致的任务合同；当前结果仍是控制不可用，不提供可执行入口。",
    readerStates: {
      pass: "历史成功条件：任务身份、项目根、Desktop 订阅和首轮请求全部匹配，手机与 Desktop 才进入同一个任务；当前冻结，不执行。",
      problem: "历史设计对重连、重复请求和任务壳不明先回读再判断，不重放 turn/start；当前冻结期间连这种运行态回读也不调用。",
      unavailable: codexRemoteFrozenBoundary + " 历史拒绝条件还包括 Desktop 缺席或无法证明单一 app-server，不能借此创建替代任务。"
    },
    decisionImpact: [
      "把 threadId / turnId 作为同步事实，不把相似标题当成同一任务。",
      "手机首轮必须晚于 Desktop resume 屏障。",
      "Sidecar 离线不创建第二个 app-server，也不终止 Desktop。",
      "身份不清时宁可拒绝新执行，也不制造重复任务。"
    ],
    problem: "解决手机与 Desktop 各跑一份任务、空任务壳未持久化、订阅丢失和断线后重复首轮。",
    implementation: [
      "Broker 独占一个 app-server，并把 Desktop 与 Sidecar 作为两个独立 WebSocket client。",
      "连接级 subscription 不共享，因此每端都必须显式 thread/resume。",
      "手机新任务必要时用隐藏 thread/name/set 让空壳进入持久记录。",
      "coordinator 在 Desktop resume barrier 完成前阻塞 turn/start。",
      "loaded-thread registry 合并 Desktop 与 Sidecar 的真实运行任务，不截断前三条。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "解析已登记项目或创建隔离无项目根。",
      "调用 app-server 创建或恢复 thread。",
      "必要时给空任务壳设置隐藏名称以持久化。",
      "等待 Desktop 对同一 thread 完成 resume。",
      "核对 threadId、turnId 与项目身份。",
      "放行首轮并通过 SSE 向浏览器投影事件。",
      "断线后按权威快照恢复，而不是创建替代任务。"
    ],
    concepts: [
      { term: "threadId（任务标识）", explanation: "同一持久任务的稳定身份；标题和最近时间不能替代。" },
      { term: "turnId（轮次标识）", explanation: "一次用户输入到完成回答的运行身份，用来区分当前轮和下一轮。" },
      { term: "resume barrier（恢复订阅屏障）", explanation: "Desktop 确认已经订阅任务后，手机才允许启动首轮。" },
      { term: "projectless task（无项目任务）", explanation: "在隔离、有界临时根中运行，不冒充已登记项目。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "手机不能在 Desktop 缺席时偷偷创建一条独立生产任务。",
      "Web 队列不是 Desktop 原生未发送草稿。",
      "Sidecar loss 不应让 Desktop 任务退出。",
      "页面不以截图或相似标题证明同一任务。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "Desktop 未连接", response: "拒绝手机首轮，保留任务壳和明确错误。" },
      { condition: "resume barrier 超时", response: "不调用 turn/start，等待重新取得 Desktop 订阅证据。" },
      { condition: "重复创建请求", response: "用幂等身份回读已有 thread，不再创建第二份。" },
      { condition: "Sidecar 断开", response: "Desktop 继续通过 Broker 使用现有 app-server；浏览器进入断线态。" }
    ],
    sources: [
      { path: "docs/architecture.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/architecture.md", role: "定义单一 app-server、连接级订阅、任务壳持久化和 Desktop 屏障。" },
      { path: "apps/broker/src/coordinator.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/broker/src/coordinator.ts", role: "实现 Desktop/Sidecar 协调与首轮放行。" },
      { path: "apps/broker/src/coordinator.test.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/broker/src/coordinator.test.ts", role: "验证 Desktop 缺席、屏障阻塞和 Sidecar 缺席边界。" }
    ],
    verification: [
      "v0.1.5 的 coordinator 与 thread lifecycle 测试通过。",
      "历史真实验收确认手机创建的任务出现在 Desktop，并保持相同 thread/turn。",
      "本轮只读审查没有调用 Remote runtime；当前结论为不可用且冻结，不以未验证在线替代这一明确状态。"
    ],
    relation: "它是对话控制、子智能体导航、审批、文件、实时架构与安全模块的身份基础：只有先证明手机和 Desktop 指向同一任务，后续操作和父子关系才有明确对象。"
  },
  {
    slug: "subagent-navigation",
    shortTitle: "子智能体导航",
    title: "手机怎样进入父子任务、保留完整历史，再回到父任务继续",
    searchAliases: ["手机查看Codex子智能体", "进入子任务再返回父任务", "已完成子智能体还在吗", "子智能体历史是否完整", "子任务为什么只能读", "子智能体断线后能不能操作"],
    searchProjection: {
      intents: ["从手机查看一个父任务派出的全部子智能体", "进入已完成或失败的子任务核对消息工具和文件", "返回父任务并从原阅读位置继续", "在子任务只读或断线时安全补充要求"],
      entities: ["parentThreadId", "SubagentSummary", "depth", "run state", "current and archived streams", "history integrity", "parent handoff"],
      relations: ["parentThreadId 与 depth 还原父子层级", "当前与归档流共同保留运行和终态子任务", "子任务详情只读而补充要求经父任务转交", "完整性元数据约束列表能否声称已经读尽"],
      failureRecovery: ["当前入口不可用且冻结，不连接任务树或转交要求", "历史分页未闭合时显示已获取数量而不声称全部", "历史设计父级元数据缺失时有界补读并保留未知", "历史设计连接或轮次不清时隐藏输入转交和停止", "返回父任务的路由成功不冒充精确位置验收"]
    },
    teaser: "历史任务树保留父子层级、当前/归档历史和终态记录，子任务只读、要求回父任务转交；当前冻结，不连接真实任务树。",
    status: "当前控制入口不可用且冻结；父子导航、历史完整性与只读子任务保留源码/测试，精确返回阅读位置仍缺独立验收",
    statusTone: "problem",
    value: "历史产品把每个子智能体的工作、等待、失败和终态记录保留为可回溯任务树，不让完成结果只剩一条消失的提示；当前只读查看设计与历史图证，不连接真实任务树。",
    why: "长任务会把工作分给多层子智能体。如果页面只显示最新一条活动、只查当前列表或允许手机直接向只读子任务写入，用户既会漏掉已完成结果，也可能把要求送到错误的执行边界。",
    example: "历史旅程是从父任务的子智能体面板进入已完成项，核对消息、工具和文件变更，再回父任务转交新要求；当前只能从获准静态材料理解这一旅程，不加载 Remote 任务或发送转交。",
    result: "保留终态记录、历史完整性与只读子任务的产品合同；路由返回曾有测试，精确滚动位置仍是独立缺口。当前不把历史导航能力写成可用连接。",
    readerStates: {
      pass: "历史成功条件：父子身份、当前/归档分页和详情读取闭合，才显示完整层级并支持进入/返回；当前冻结，不请求这些数据。",
      problem: "历史实现会保留已验证记录并显式标 partial（部分）、unknown（未知）或 failed（失败），后续成功页不抹掉早先风险；当前不连接运行态补页。",
      unavailable: codexRemoteFrozenBoundary + " 历史设计在父任务或轮次身份不明时也禁止直接输入、转交和停止，不能从子任务绕过。"
    },
    decisionImpact: [
      "已完成子智能体进入归档流，但不会从父任务导航中凭空消失。",
      "运行中、等待审批、已完成和失败是任务状态，不用颜色或更新时间猜测。",
      "子任务详情展示消息、公开摘要、工具和文件变更，但不直接获得控制入口。",
      "转交补充要求的 owner 是仍可控制的父任务，不是手机对子任务的旁路写入。",
      "只有第一页到末页连续闭合且来源一致时，界面才显示‘已显示全部子智能体’。"
    ],
    problem: "解决父子关系被扁平化、终态子任务丢失、短分页冒充完整历史、子任务误开放写入，以及断线时把不可执行按钮继续留在界面。",
    implementation: [
      "SubagentSummary 公开 threadId、parentThreadId、depth、state、updatedAt 与 isDirectlyControllable。",
      "domain service 合并当前与归档 thread/list 流，并从父任务内的 subAgentActivity 递归发现仍有记录的后代。",
      "缺失祖先用有界并发 thread/read 补齐；calculateDepth 与 isDescendantOf 按 parentThreadId 还原层级并防循环。",
      "Web 将 idle、running、waiting-for-approval、failed、complete 显示为空闲、运行中、等待审批、失败、已完成。",
      "X-Subagent-History-Integrity 传递 complete、partial、unknown、failed 以及 current/archived 流状态；后续成功页不能覆盖较早页的风险。",
      "子任务路由复用完整 ThreadDetail 与持久历史读取，隐藏 composer（输入器）和 Desktop 接入，只显示返回父对话。",
      "产品设计要求返回父任务时恢复滚动位置；当前源码已有任务内历史锚点保持，但现有子任务 E2E 只验证路由返回，没有单独证明跨父子路由的精确 scroll offset（滚动偏移）。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "父任务页读取子智能体第一页及历史完整性。",
      "合并 current 与 archived，补齐祖先并计算缩进层级。",
      "列表按状态显示运行中、等待审批、已完成或失败；有游标时由用户继续加载。",
      "点开子任务，读取它的消息、公开摘要、工具、文件变更和最终结果。",
      "子任务保持只读；需要补充要求时点击返回父任务，再由父智能体转交。",
      "返回父任务时恢复原阅读位置是产品合同；若当前位置证据不足，保持诚实的验收缺口。",
      "断线或身份不明时继续显示已载入记录，但禁用会产生远端影响的入口。"
    ],
    concepts: [
      { term: "parentThreadId（父任务标识）", explanation: "把一个任务连接到直接父任务；沿链可计算多层深度。" },
      { term: "history integrity（历史完整性）", explanation: "说明当前看到的是全部、部分、未知还是读取失败，不用短列表猜测完整。" },
      { term: "archived stream（归档流）", explanation: "承载已经归档的终态子任务，与当前流合并后仍可导航。" },
      { term: "read-only handoff（只读转交）", explanation: "子任务本身不接收手机输入；用户返回父任务，由父智能体决定怎样转交。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "不显示隐藏思维链，只展示 Codex 公开的消息、摘要、工具和文件活动。",
      "isDirectlyControllable 元数据不授权 Web 直接写子任务；当前产品统一回父任务。",
      "完整性 header 缺失兼容旧 Sidecar，但有下一页时仍不能声称历史完整。",
      "父任务路由返回与精确滚动位置恢复是两个证据层，前者通过不能替代后者。",
      "本轮没有访问真实任务树、当前连接或安装中的 Sidecar。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "current 或 archived 分页仍有下一页", response: "显示已获取数量和‘历史尚未确认完整’，由用户加载下一页。" },
      { condition: "历史读取失败或被截断", response: "保留已验证记录，维持 failed/partial 风险，不用后来成功页覆盖。" },
      { condition: "父级记录暂时缺失", response: "有界读取祖先；仍无法确认时保持未知，不把子任务挂到猜测的父级。" },
      { condition: "子任务需要新要求", response: "不出现直接输入框；返回仍可控制的父任务后再转交。" },
      { condition: "浏览器断线或轮次身份不清", response: "记录仍可看，输入、转交与停止入口禁用，恢复连接后重新回读。" },
      { condition: "返回父任务但位置恢复未独立验收", response: "承认当前证据只证明成功返回，补做精确滚动位置浏览器场景后再升级结论。" }
    ],
    sources: [
      { path: "docs/product-design.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/product-design.md", role: "定义父子层级、终态保留、只读转交、断线禁用与返回父任务旅程。" },
      { path: "packages/domain/src/service.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/packages/domain/src/service.ts", role: "合并当前/归档流、发现后代、补齐祖先、计算深度并生成历史完整性。" },
      { path: "apps/web/src/App.tsx", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/web/src/App.tsx", role: "呈现状态树、分页提示、子任务详情、只读边界与返回父对话入口。" },
      { path: "tests/e2e/journey.spec.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/tests/e2e/journey.spec.ts", role: "验证手机打开子智能体、读取历史内容并返回父任务的合成浏览器旅程。" }
    ],
    verification: [
      "domain projection 与 service 测试覆盖 parentThreadId、depth、当前/归档合并、祖先补读和状态折叠。",
      "api-subagent-history 与 App state 测试覆盖完整性 header、连续分页、风险累积和失败提示。",
      "Chromium journey 场景验证进入子任务、看到消息/工具/结果并返回父任务；响应式场景验证子智能体触控目标。",
      "本轮只读审查没有连接真实 Desktop/Sidecar，也没有取得精确父任务滚动位置恢复的专项 E2E。"
    ],
    relation: "它依赖同一任务模块提供稳定父子身份，读取共享架构投影的任务历史；补充要求回到对话控制模块，版本与证据模块负责标注实现、浏览器验收和当前在线之间的边界。"
  },
  {
    slug: "conversation-control",
    shortTitle: "对话控制",
    title: "当前轮怎样引导或停止，下一轮怎样安全排队",
    searchAliases: ["给正在生成的回复补充要求", "停止正在生成的Codex回复", "把消息排到下一轮", "编辑排序删除排队消息", "断线后会不会重复发送", "steer interrupt和队列有什么区别"],
    searchProjection: {
      intents: ["给正在生成的回复追加要求", "停止当前回复但保留下一轮安排", "排队并编辑排序删除下一轮消息", "断线或重启后避免重复发送"],
      entities: ["threadId", "turnId", "availableActions", "text", "queue revision", "clientUserMessageId", "连接状态", "next-turn settings"],
      relations: ["当前轮 steer 和 interrupt 绑定 active turnId 与 availableActions", "下一轮正文和设置先持久化再确认并按 FIFO 派发", "revision 保护编辑排序删除而 clientUserMessageId 用于发送对账", "正常终态放行下一项而失败终态暂停队列"],
      failureRecovery: ["当前入口不可用且冻结，不发送停止排队对账或恢复", "历史设计连接或turn不匹配时隐藏动作并保留text", "历史设计发送不明时先对账", "无法证明接收状态时ambiguous并停止自动重放", "历史设计修订冲突时重新同步而不覆盖"]
    },
    teaser: "历史实现区分当前轮 steer/interrupt 与加密持久下一轮队列；当前冻结，不能发送、排队、停止、对账或恢复。",
    status: "当前控制入口不可用且冻结；steer、interrupt 与持久队列保留源码、测试和历史实测，不是当前可用操作",
    statusTone: "problem",
    value: "历史产品把“现在补充”“现在停止”和“下一轮再做”分清，每个动作都有精确对象与防重复边界；当前不能发起、查询、恢复或重放 Remote 队列。",
    why: "运行中的 steer、停止当前回复和排队下一轮看起来都像“发一句话”，实际却改变不同状态。若不先核对轮次、能力和队列版本，断线、连点或多端编辑会造成发错轮、覆盖设置或重复执行。",
    example: "历史示例“先别改配置，只分析原因”会先核对 threadId、active turnId 和允许动作：当前轮走 steer，下一轮把正文、附件与设置存入 DPAPI 加密待发箱；断线后按 clientUserMessageId 对账，仍不明则 ambiguous。当前只解释这一状态机，不发送示例或恢复队列。",
    result: "保留精确当前轮、下一轮稳定 id/revision、加密待发与不明结果停止重放的完整设计；当前只读查看静态证据，不产生控制回执或写入。",
    readerStates: {
      pass: "历史成功条件是任务/轮次、允许动作、连接和队列 revision 一致，再执行并回读；当前冻结，这些条件不产生操作许可。",
      problem: "历史设计在修订冲突、轮次结束或回执丢失时保留正文与加密队列并对账；当前不调用运行态恢复或自动重放。",
      unavailable: codexRemoteFrozenBoundary + " 历史协议也拒绝身份或动作能力不明的请求，ambiguous 项不能自动重放。"
    },
    decisionImpact: [
      "输入事实固定包括 threadId、active turnId、availableActions、text、连接状态、queue revision、clientUserMessageId 与 next-turn settings。",
      "当前轮只有运行时真实允许时才调用 turn/steer；停止只对精确 active turnId 调用 interrupt。",
      "下一轮消息按任务 FIFO 保存，模型、思考、速度、权限和审批选择也只绑定下一轮。",
      "编辑、排序、删除和手动发送必须携带最新 revision，过期多端操作失败关闭。",
      "正常终态后才派发下一项；失败、异常结束或未知状态暂停后续队列。",
      "断线不等于失败也不等于成功；先按 clientUserMessageId 对账，ambiguous 时停止自动重放。"
    ],
    problem: "解决当前轮与下一轮语义混淆、多端同时改队列、未落盘就显示成功、断线后重复 turn/start，以及模型设置热切换造成的不可解释结果。",
    implementation: [
      "Web 根据 active turnId、availableActions.steer / interrupt 和连接状态决定显示哪些当前轮动作，不补造运行时能力。",
      "DurableTurnOutbox 在返回成功前先保护 prompt 与附件、分配稳定 clientUserMessageId、递增 revision 并原子替换 turn-outbox.json。",
      "生产运行时使用 Windows 当前用户 DPAPI；SSE 只发布不含正文的队列摘要，待发正文不写浏览器队列存储。",
      "enqueue、edit、reorder、remove、resume 与 steer 都保存幂等 receipt；revision 不匹配时返回冲突，要求重新同步。",
      "TurnQueueDispatcher 只在权威线程为 idle 且 gate 可放行时 claim FIFO 首项，turn/start 接受后才清除受保护正文。",
      "重启后用 clientUserMessageId 查询 app-server 权威任务快照；accepted、active、completed、failed、absent 与 unknown 分别收敛，无法判定则 ambiguous。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "读取 threadId、active turnId、availableActions、连接状态、输入 text 与 next-turn settings。",
      "用户选择当前轮 steer、当前轮 interrupt 或加入下一轮，界面不替用户混合三种语义。",
      "队列路径先加密持久化正文、附件、稳定 id 和 revision，再向浏览器确认已排队。",
      "后续编辑、排序或删除以 expectedRevision 做并发检查，并把新快照同步到已登录 Web/手机。",
      "当前 turn 正常完成并回到 idle 后，串行 claim FIFO 首项并携带 clientUserMessageId 启动下一轮。",
      "收到 userMessage/turn 事件后确认 accepted 与 turnId；失败终态暂停余项，正常终态继续下一项。",
      "传输中断或重启时先读 authority snapshot（权威快照）对账；结果不明就停止重放并等待显式处理。"
    ],
    concepts: [
      { term: "steer（当前轮引导）", explanation: "把补充要求送入仍在运行的精确 turn；它不创建下一轮，也不改变已完成回复。" },
      { term: "interrupt（停止当前轮）", explanation: "请求精确 active turn 停止；终态仍由 app-server 事件决定，按钮点击本身不是完成证据。" },
      { term: "queue revision（队列修订号）", explanation: "每次队列变化递增的并发版本；编辑、排序和删除只能基于最新快照。" },
      { term: "clientUserMessageId（客户端消息稳定标识）", explanation: "跨 HTTP 重试、turn/start 和重启对账使用的同一逻辑消息身份。" },
      { term: "ambiguous（发送结果不明）", explanation: "无法证明 app-server 已接收或未接收；停止自动重试，避免重复执行。" },
      { term: "DPAPI outbox（Windows 加密待发箱）", explanation: "Sidecar 用当前 Windows 用户的 DPAPI 保存未派发正文，并以原子文件承载队列状态。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "Web 队列只在已登录 Web/手机之间同步；真正派发前不会冒充 Desktop 原生未发送输入。",
      "turn/steer 返回 turnId 只证明当前轮接收；项目不向 Desktop 注入伪造用户气泡。",
      "模型、思考、速度、权限与审批设置只作用于下一轮，不热切换当前轮。",
      "断线期间审批、停止和 steer 等实时动作失败关闭；草稿和已持久化队列可保留。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "active turnId 或 availableActions 与界面缓存不一致", response: "不发送 steer/interrupt，重新读取同一任务快照并保留输入文字。" },
      { condition: "queue revision 已被另一端更新", response: "返回冲突并刷新完整 FIFO；不覆盖另一端的编辑、排序或删除。" },
      { condition: "turn/start 或 turn/steer 在响应前断线", response: "保留加密正文并按 clientUserMessageId 对账；仍无法判定时标记 ambiguous，停止自动重发。" },
      { condition: "前一轮失败或非正常结束", response: "暂停后续队列并保留原因，由用户检查后显式恢复或删除。" },
      { condition: "Sidecar 重启时只看到未确认的 queued/dispatching 状态", response: "先检查权威 thread lifecycle；没有充分证据的待发项保持暂停。" }
    ],
    sources: [
      { path: "docs/product-design.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/product-design.md", role: "定义当前回复、下一轮队列、Desktop 可见性和状态不明停止重试的产品语义。" },
      { path: "docs/architecture.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/architecture.md", role: "定义共享 thread/turn、下一轮参数、FIFO、revision、client id 与 at-most-once 偏好。" },
      { path: "docs/acceptance-todo.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/acceptance-todo.md", role: "记录 steer、interrupt、排队一次、刷新恢复与发送边界不明的历史真实验收。" },
      { path: "apps/sidecar/src/turn-outbox.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/turn-outbox.ts", role: "实现持久队列、幂等 receipt、revision、编辑排序删除、状态门与重启收敛。" },
      { path: "apps/sidecar/src/prompt-protector.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/prompt-protector.ts", role: "以 stdin 调用 Windows 当前用户 DPAPI 保护和还原待发正文，不把明文放进命令行参数。" },
      { path: "apps/sidecar/src/turn-queue-dispatcher.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/turn-queue-dispatcher.ts", role: "实现终态后派发、steer claim、clientUserMessageId 对账与 ambiguous 停止重放。" }
    ],
    verification: [
      "产品设计 6.2、架构 6 和验收 P0-03 对当前轮/下一轮、队列可见性和未知结果边界一致。",
      "turn-outbox 测试覆盖加密持久化、FIFO、幂等 enqueue、revision 冲突、编辑排序删除、steer 确认和 ambiguous 手动恢复。",
      "dispatcher 测试覆盖正常终态后启动下一项、失败终态暂停、响应丢失不重发和重启后按 client id 对账。",
      "历史真实验收证明 steer 被模型接收、interrupt 三端收敛、未发送队列刷新后恢复；本轮没有访问运行态。"
    ],
    relation: "它建立在同一任务身份之上，把用户文字准确分到当前轮或下一轮；子智能体模块只允许经父任务转交，模型审批、文件引用和实时架构分别提供设置、附件与权威事件。"
  },
  {
    slug: "models-approvals-context",
    shortTitle: "审批与上下文",
    title: "模型、审批、额度和上下文怎样保持真实，而不是写死界面",
    searchAliases: ["手机处理Codex审批", "下一轮换模型", "查看上下文和额度", "审批没有按钮怎么办"],
    searchProjection: {
      intents: ["在手机处理当前任务的真实审批", "给下一轮选择模型思考等级和速度", "查看任务上下文与账号额度", "运行时没有某项能力时知道为什么不能操作"],
      entities: ["approvalId", "available decisions", "model catalog", "reasoning effort", "service tier", "context usage", "account usage"],
      relations: ["审批按钮只来自本次请求实际提供的选项", "模型和思考选择绑定下一轮而不热切换当前 turn", "任务上下文与账号额度是不同来源和时间窗口", "未知运行时值保留原值而不补造默认"],
      failureRecovery: ["当前入口不可用且冻结，不查询模型额度或提交审批", "历史设计审批无选项时说明阻塞而不猜按钮", "历史设计模型目录缺项时保留设置并说明兼容原因", "历史设计缺额度时保持Unknown而不补零", "历史设计下一轮失败时保留用户选择"]
    },
    teaser: "历史界面分开真实模型/权限目录、审批选项、当前参数、下一轮设置、上下文和额度；当前冻结，不查询或提交。",
    status: "当前控制入口不可用且冻结；动态目录、审批、额度和压缩保留源码/测试及历史成功，不查询当前目录或提交审批",
    statusTone: "problem",
    value: "历史界面分开任务实际参数、下一轮选择、上下文和账号额度，并展示审批的真实影响；当前只能读其合同与历史界面，不通过 Remote 读取账号或操作审批。",
    why: "把一个默认模型、0%用量或固定‘允许一次’按钮写死，会让界面看起来完整却与实际运行时不一致；同一轮热切换参数还会产生无法解释的中间状态。",
    example: "历史场景中，手机改选另一个模型和标准速度，只会保存为下一轮设置，不热切换正在生成的当前轮。当前不查询模型目录，也不把历史截图中的选项当成本机可选能力。",
    result: "可还原参数、下一轮草稿、审批、上下文与额度的分层设计；未知字段不补造，当前冻结更不能被一句‘目录未查询’弱化。",
    readerStates: {
      pass: "历史成功条件：运行时目录、实际参数和下一轮选择分别可读且不混写；当前冻结，只保留对应静态证据。",
      problem: "历史设计对目录、压缩或审批回读不一致保留原选择并提示重读；当前不发起重读、压缩或审批。",
      unavailable: codexRemoteFrozenBoundary + " 历史协议对缺失模型、额度或审批选项禁用控件、保持未知，不生成默认值。"
    },
    decisionImpact: [
      "当前参数和下一轮选择使用不同字段。",
      "审批按钮完全来自本次 request 的 options。",
      "HTTP 接受压缩只表示已受理，完成必须等待事件。",
      "线程上下文与账号额度在视觉和语义上分开。"
    ],
    problem: "解决模型目录写死、当前轮被错误热切换、审批选项猜造、压缩受理冒充完成和额度/上下文混为一谈。",
    implementation: [
      "domain service 从 app-server 读取 model/list、account/read、rate limits 与 usage。",
      "thread settings read-back 保留实际模型、思考等级、速度、权限和协作模式。",
      "approval policies 与 reviewers 使用独立合同，只有可提交 options 才出现按钮。",
      "context compaction 同时处理 manual request、accepted 事件和 completed 事件。",
      "浏览器圆环显示 thread context；账号窗口与 reset time 另列。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "读取当前线程真实参数与运行状态。",
      "读取运行时模型、思考等级、速度和权限目录。",
      "在下一轮草稿中保存用户选择。",
      "当前轮完成或下一条队列派发时应用新设置。",
      "审批到达时渲染真实问题、影响和 options。",
      "提交后回读请求状态，不重复提交。",
      "额度或上下文缺失时显示 Unknown。"
    ],
    concepts: [
      { term: "current parameters（当前参数）", explanation: "正在运行或已完成轮次实际使用的模型、思考和权限。" },
      { term: "next-turn settings（下一轮设置）", explanation: "尚未应用的用户选择，只在下一轮派发时生效。" },
      { term: "approval option（审批选项）", explanation: "app-server 对本次请求明确允许提交的选择，不是 UI 自己定义。" },
      { term: "context compaction（上下文压缩）", explanation: "减少线程上下文占用；受理和真正完成是两种状态。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "不热切换当前正在生成的轮次。",
      "不使用 demo 模型列表冒充当前账号目录。",
      "没有 options 的审批只能显示原因。",
      "截图中的额度、版本和模型只代表拍摄时刻。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "模型目录不可读", response: "保留当前实际参数，禁用新的目录选择。" },
      { condition: "审批选项为空", response: "显示阻塞原因，不生成允许/拒绝按钮。" },
      { condition: "设置回读与草稿不同", response: "标记未应用并恢复权威值。" },
      { condition: "压缩只收到 accepted", response: "显示已受理，等待 completed 或失败事件。" }
    ],
    sources: [
      { path: "packages/domain/src/service.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/packages/domain/src/service.ts", role: "读取模型、账号、额度和线程服务能力。" },
      { path: "apps/web/src/approval.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/web/src/approval.ts", role: "把运行时审批合同转成用户界面。" },
      { path: "apps/web/src/context-compaction.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/web/src/context-compaction.ts", role: "区分压缩请求受理、完成和失败。" }
    ],
    verification: [
      "模型、审批、usage、thread settings 与 context compaction 均有独立测试。",
      "历史真实验收曾返回动态模型目录并完成结构化审批。",
      "公开 demo 列表只用于界面验收，页面明确不代表当前目录。"
    ],
    relation: "它建立在同一任务身份之上，并通过共享架构读取真实目录与事件；安全模块继续约束每个会产生现实影响的请求。"
  },
  {
    slug: "projects-files-input",
    shortTitle: "项目与文件",
    title: "任务项目、无项目工作区和所有者文件工作台怎样分清",
    searchAliases: ["手机浏览电脑文件", "Codex Remote文件管理", "上传文件给桌面任务", "项目任务和无项目任务"],
    searchProjection: {
      intents: ["从手机查看任务刚修改的文件和 diff", "给当前任务添加电脑文件或手机上传附件", "新建项目任务或隔离无项目任务", "在手机编辑移动或删除自己的文件"],
      entities: ["registered project", "projectless root", "owner file manager", "rootId", "relativePath", "opaque grant", "overwrite decision"],
      relations: ["项目任务 cwd 只来自已登记项目根", "无项目任务使用隔离临时根而不冒充项目", "所有者文件工作台继承 Windows 身份但与任务权限分开", "绝对路径通过短时 opaque grant 进入对话"],
      failureRecovery: ["当前入口不可用且冻结，文件浏览与写入API均不调用", "历史设计项目身份不明时拒绝创建", "历史设计路径或rootId不匹配时拒绝文件动作", "历史设计覆盖冲突等待明确选择", "历史设计删除失败保留原文件"]
    },
    teaser: "历史设计分开登记项目/无项目任务与 Windows 所有者文件工作台；当前冻结，浏览、预览、上传、编辑、移动和删除均不可调用。",
    status: "当前控制入口不可用且冻结；文件合同、操作测试和历史上传 SHA 证据保留，不通过 Remote 浏览或修改本机文件",
    statusTone: "problem",
    value: "历史产品同时提供正确项目里的任务和独立的电脑文件工作台，不把任务 cwd 当作整机权限模型；当前文件工作台随 Remote 一起冻结，连只读浏览 API 也不调用。",
    why: "项目任务需要防止根目录被替换或越界；所有者文件管理又不能因为任务不在某个项目里就失去用户本来拥有的磁盘权限。把两者混在一起会既不安全又不好用。",
    example: "历史文件场景是从已登记项目创建任务，再在独立文件页把另一磁盘的文件复制进来；同名目标需要明确覆盖选择。当前仅看这套合同与获准历史图证，不浏览、上传、复制或删除文件。",
    result: "可还原任务项目身份与 Windows 所有者文件能力的两条边界，以及覆盖、回收站和永久删除的不同确认；当前不承诺或执行任何文件操作。",
    readerStates: {
      pass: "历史成功条件：项目身份、root id、相对路径、Windows 权限和覆盖选择均成立；当前冻结，不读取文件 API 或执行动作。",
      problem: "历史设计在目标存在、文件占用、跨盘移动或短时授权过期时保留源文件并报告恢复点；当前不调用这些恢复入口。",
      unavailable: codexRemoteFrozenBoundary + " 历史协议遇到项目根替换、路径越界、磁盘未挂载或权限不足时也不自动放宽范围。"
    },
    decisionImpact: [
      "任务项目根和所有者文件根使用不同身份。",
      "浏览器只发送 opaque root id 与相对路径。",
      "同名目标默认冲突，覆盖必须明确选择。",
      "删除默认进入回收站，永久删除单独确认。"
    ],
    problem: "解决路径 traversal、junction 逃逸、绝对路径裸链、无意覆盖、永久删除误触和项目权限与电脑权限混写。",
    implementation: [
      "project access 绑定登记时的 canonical path 与目录身份；根漂移后拒绝新任务。",
      "host-files 枚举当前 Windows 身份可访问磁盘，不额外按扩展名或隐藏属性降权。",
      "路径层拒绝绝对路径、UNC、设备路径、ADS、保留名称和 ..。",
      "文本、Markdown、图片和 PDF 使用有界预览；下载仍需登录。",
      "任务正文绝对路径换成短时 opaque grant，再通过认证解析。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "选择登记项目或无项目任务。",
      "校验项目根的路径和目录身份。",
      "在文件页选择 root id 和相对路径。",
      "预览或准备上传、编辑、复制、移动。",
      "遇到同名目标时取得明确覆盖选择。",
      "删除优先进入回收站。",
      "动作完成后重新列目录并核对结果。"
    ],
    concepts: [
      { term: "registered project（已登记项目）", explanation: "由本机明确记录 canonical root 的任务工作区。" },
      { term: "opaque root id（不透明根标识）", explanation: "浏览器使用的磁盘/根引用，不直接把绝对根路径当 API 参数。" },
      { term: "path traversal（路径越界）", explanation: "使用 ..、设备路径、junction 等逃离获准根的尝试。" },
      { term: "recycle-bin deletion（回收站删除）", explanation: "默认可恢复删除；永久删除需要额外明确确认。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "文件工作台不是任务 sandbox，也不是多用户权限系统。",
      "Windows ACL、BitLocker、挂载和占用仍决定真实结果。",
      "临时文件已被系统删除时，历史消息不能恢复其字节。",
      "不公开真实私人文件内容或可复用授权。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "项目根身份漂移", response: "拒绝在该根创建新任务，要求本机重新登记。" },
      { condition: "同名目标存在", response: "返回冲突，等待明确覆盖或改名。" },
      { condition: "跨盘移动中断", response: "保留源，回读目标和临时状态后再决定。" },
      { condition: "短时文件授权过期", response: "拒绝下载，重新从已登录文件页生成。" }
    ],
    sources: [
      { path: "apps/sidecar/src/host-files.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/host-files.ts", role: "实现所有者文件枚举、路径解析、预览和写动作。" },
      { path: "apps/sidecar/src/host-files.test.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/host-files.test.ts", role: "覆盖隐藏文件、全部写操作、越界、覆盖、删除、预览与下载。" },
      { path: "apps/web/src/file-link.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/web/src/file-link.ts", role: "解析任务中的文件引用与短时授权。" }
    ],
    verification: [
      "host-files 测试覆盖 create/edit/upload/rename/copy/move/overwrite/recycle/permanent delete。",
      "历史真实验收核对过浏览器上传 PNG 的 bytes 与 SHA-256。",
      "本轮只使用公开源码和获准截图，没有访问真实本机文件 API。"
    ],
    relation: "它把任务工作区与所有者文件能力分开；共享架构负责传递操作，安全模块负责会话、路径、覆盖与删除确认。"
  },
  {
    slug: "shared-realtime-architecture",
    shortTitle: "共享架构",
    title: "Browser、Sidecar、Broker 和单一 app-server 怎样实时协作",
    searchAliases: ["Broker Sidecar架构", "为什么不是远程桌面", "手机和Desktop实时同步", "loopback app-server"],
    searchProjection: {
      intents: ["理解手机与 Desktop 为什么能共享同一任务", "查看实时消息工具和文件事件怎样到浏览器", "断线重连后怎样补齐而不猜状态", "判断为什么产品不是远程桌面或公网 Shell"],
      entities: ["Browser", "Sidecar", "loopback Broker", "single app-server", "WebSocket subscription", "SSE cursor", "thread snapshot"],
      relations: ["Desktop 与 Sidecar 是同一 app-server 的两个连接", "Broker 只协调 RPC 和订阅而不执行任务", "Sidecar 把 app-server 事件投影成浏览器产品模型", "SSE 游标失效时用权威 thread snapshot 重建"],
      failureRecovery: ["当前入口不可用且冻结，不建监听或探测任何端点", "历史设计Sidecar断开不终止Desktop", "历史设计Broker或upstream不健康时拒绝新执行", "历史设计SSE超窗时重读快照", "历史设计连接身份变化时撤销在线声明"]
    },
    teaser: "历史架构中公网只到认证 Sidecar，Broker/app-server 只在 loopback；当前链路冻结，不建监听或探测任何组件。",
    status: "当前控制入口不可用且冻结；共享架构、SSE 重连和订阅屏障保留源码/测试，不建立连接或查询端点",
    statusTone: "problem",
    value: "历史架构把同一任务的实时进展送到手机，而不传输桌面或公开底层 app-server 协议；当前只说明数据怎样流动，不运行链路或做连通性探测。",
    why: "直接把 app-server WebSocket 暴露公网会绕过产品认证和输入边界；让 Desktop 与 Sidecar 各启一个 app-server 又会生成不同任务事实。",
    example: "历史链路为手机 HTTPS → 认证 Sidecar → 本机回环 Broker → 单一 app-server，事件再由 SSE 返回手机；当前这只是架构说明，不打开这些地址或创建监听。",
    result: "保留公网入口、产品投影、共享连接与任务事实各自负责什么的完整说明；当前冻结使整条控制链不可调用，而不是只把某个端点记为未验证。",
    readerStates: {
      pass: "历史成功条件：Sidecar 会话、Broker listener、app-server 与 Desktop 订阅匹配；当前冻结，不建立连接验证。",
      problem: "历史实现对 SSE 丢段、RPC 超时或实例变化采用 reset 和权威快照；当前不为补证启动或连接任何组件。",
      unavailable: codexRemoteFrozenBoundary + " 历史协议无法证明单一 Broker/app-server 时也会拒绝新执行，不制造第二个事实源。"
    },
    decisionImpact: [
      "公网只暴露认证后的产品 API 和 SSE。",
      "Broker 不拥有 UI 投影，Sidecar 不拥有 app-server 进程。",
      "每个连接独立 resume，不能假设订阅共享。",
      "重连失败时重读快照，不用旧事件补造当前状态。"
    ],
    problem: "解决原始协议暴露、双 app-server 分叉、连接级订阅丢失、SSE 漏事件和 Sidecar 崩溃拖死 Desktop。",
    implementation: [
      "Sidecar 默认 127.0.0.1:18790，Broker 默认 127.0.0.1:18791，app-server 默认 127.0.0.1:18792。",
      "Broker 注入内部 RPC id，并在返回前恢复各客户端原始 id。",
      "Sidecar 用 domain projection 把底层事件转成稳定产品模型。",
      "SSE 事件带 process instance id 与单调 sequence；Last-Event-ID 支持续接。",
      "超出 ring buffer 时发送 reset，浏览器重新读取任务快照。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "浏览器建立 HTTPS 会话。",
      "Sidecar 验证会话、Origin、CSRF 与请求合同。",
      "Sidecar 通过回环 WebSocket 请求 Broker。",
      "Broker 路由到单一 app-server。",
      "app-server 产生任务事件。",
      "Sidecar 投影并通过 SSE 广播。",
      "浏览器按 sequence 应用或在 reset 后重读。"
    ],
    concepts: [
      { term: "loopback（本机回环）", explanation: "只允许本机进程连接的网络地址，不直接暴露 LAN 或公网。" },
      { term: "RPC correlation（请求对应）", explanation: "Broker 将多个客户端请求与正确返回一一配对。" },
      { term: "SSE sequence（事件序号）", explanation: "用于发现漏事件、重复事件和跨进程实例重连。" },
      { term: "domain projection（领域投影）", explanation: "把协议细节转成任务、消息、审批和文件等产品状态。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "Broker 与 app-server 原始 WebSocket 永远不监听公网。",
      "Sidecar 断线不应终止 Desktop。",
      "Browser 不直接依赖 app-server protocol types。",
      "截图不是 listener 或当前连接健康证明。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "SSE 事件窗口过期", response: "发送 reset，并从权威 API 重新取得快照。" },
      { condition: "Broker RPC 超时", response: "返回有界错误，不在另一个 app-server 重试。" },
      { condition: "Sidecar 进程断开", response: "浏览器进入断线态，Desktop 连接保持。" },
      { condition: "app-server 身份变化", response: "阻断新动作，重新完成连接与订阅验收。" }
    ],
    sources: [
      { path: "docs/architecture.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/architecture.md", role: "公开架构、端口、数据流、SSE 与订阅边界。" },
      { path: "apps/broker/src/runtime.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/broker/src/runtime.ts", role: "单一 app-server 与回环 listener 运行合同。" },
      { path: "apps/sidecar/src/server.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/server.ts", role: "认证 API、SSE 与产品路由。" }
    ],
    verification: [
      "Broker coordinator、websocket liveness、loaded-thread registry 与 Sidecar reconnect 均有测试。",
      "历史真实多端验收确认手机与 Desktop 同时看到同一任务事件。",
      "本轮未建立 listener，也未读取任何当前 runtime endpoint。"
    ],
    relation: "它是同一任务、子智能体、审批、文件与安全能力共用的传输骨架；安装更新模块只能在这条链的 Broker/app-server 身份不变时滚动公网层，版本证据仍不能代替当前在线回读。"
  },
  {
    slug: "installation-update-rollback",
    shortTitle: "安装与回滚",
    title: "历史安装、更新与回滚设计：当前冻结，不执行",
    searchAliases: ["Codex Remote怎么安装", "Codex Remote怎么更新", "Codex Remote更新失败怎么回滚", "运行中任务能更新Sidecar吗", "runtime-current current previous", "Broker变化为什么要显式交接"],
    searchProjection: {
      intents: ["理解Codex Remote历史安装与更新设计", "确认当前冻结不允许Status或Open", "区分登记候选与实际采用", "理解兼容Web和Sidecar排空及补偿", "了解独立恢复项目需要哪些新验收"],
      entities: ["RuntimeVersions/content-sha256", "runtime-manifest.json", "runtime-current.json", "current and previous", "maintenance drain", "update id", "idempotency key", "explicit handoff"],
      relations: ["运行文件哈希决定不可变运行代", "原子 current/previous 指针保留精确回滚祖先", "排空回执与同一 update id 绑定后才停止旧 Sidecar", "浏览器用同一幂等键跨短切换续接", "Broker或app-server变化不能伪装成Sidecar热更新"],
      failureRecovery: ["当前冻结时不执行Status Open登记回滚或替代启动", "历史设计排空超时不停止旧Sidecar", "历史设计新Sidecar失败先复核owner再补偿", "历史设计owner漂移时失败关闭", "恢复必须另行明确立项并通过隔离与真实端到端验收"]
    },
    teaser: "保留内容寻址运行代、登记/采用分离、兼容排空和精确旧代回退的历史实现；当前禁止安装、Status/Open、更新和回滚，不能照旧教程运行。",
    status: "当前控制入口不可用且冻结；安装、更新与回滚只保留历史设计和测试证据，不是待做一次在线检查的可用入口",
    statusTone: "problem",
    value: "这项历史设计试图先准备新版本、再选择采用时机，并只滚动兼容的 Web/Sidecar 来保护电脑任务。当前价值是理解这些已实现资产与接管失败的边界；不是指导现在安装、更新或重启 Remote。",
    why: "直接从可变 Git 工作树启动、覆盖正在运行的目录，或把任何更新都当成重启理由，会同时失去版本身份、回滚祖先和正在工作的 Desktop 任务。安装、选择、采用与底层交接必须是四个不同动作。",
    example: "现在问“先跑 Status，再 Open 更新一下可以吗？”答案是不可以：dispatcher 与状态入口也在冻结范围。获准只读审阅时，可以从 quickstart、发布说明和安装脚本源码还原‘候选登记 → 兼容排空 → 切换或回退’的历史设计，但不执行其中任何命令。",
    result: "得到不可变运行代、manifest、current/previous、安装与实际采用之间的证据地图，以及为什么停止旧接管路线的复盘。恢复只能成为用户明确启动的独立项目，完成新实现决策、隔离恢复矩阵和真实端到端验收；不能由本页或旧教程解除冻结。",
    readerStates: {
      pass: "当前只读审阅可确认历史源码的逐文件哈希、manifest、原子指针、排空和补偿设计；这些静态证据不是安装、采用或稳定运行 PASS。",
      problem: "历史设计在排空超时、新 Sidecar 失败和同端口间隙时保留或恢复旧代；实际 Windows 接管没有达到可重复恢复要求，所以现在不执行补偿、回滚或再次尝试。",
      unavailable: codexRemoteFrozenBoundary + " 即使目标只是 Status、Register -NoStart 或回滚待采用指针，也不属于当前只读档案审阅。"
    },
    decisionImpact: [
      "当前冻结优先于下列历史设计；不执行首次安装、依赖构建、登记、Status/Open、排空、回滚或底层交接来试探能否恢复。",
      "历史安装从已构建文件计算内容身份，不直接绑定 Git 工作树。",
      "历史 Register -NoStart 语义是安装并选择候选、不打开 Remote 或重启 Desktop；它仍有写入效果，当前不可执行。",
      "current 表示 selected（已选择待采用）运行代，不等同于当前进程已经运行该代；previous 保留精确回滚祖先。",
      "只有 Broker/Sidecar compatibility id 相同、owner 身份不变且 unknown connection 为零时，才允许 Web/Sidecar 滚动更新。",
      "历史协议把 Broker、app-server 或兼容 id 变化与普通更新分离；今天不能以‘显式 Open’替代重新立项和新验收。",
      "本页的 v0.1.5/测试证据不证明任何当前机器已安装、当前在线或无人值守接管已经验收。"
    ],
    problem: "解决可变源码被直接执行、更新覆盖回滚祖先、活动任务阻塞发布、短切换重复写入、新 Sidecar 失败后无恢复，以及把公网层修复扩大成底层 owner 重启。",
    implementation: [
      "Get-CodexLocalRemoteRuntimeVersionPlan 枚举 package.json、Broker/Sidecar/Web dist 与 Windows 脚本，记录逐文件 Size/SHA-256、源码 commit 和 dirty 状态。",
      "VersionId 是 runtime-content/v1 规范 JSON 的 SHA-256，身份同时包含 BrokerSidecarCompatibilityId；文件先复制到 .installing 临时目录，完整验证后再移动为 RuntimeVersions/<versionId>。",
      "runtime-current.json 原子记录 CurrentVersionId/Root/ManifestSha256 与 Previous 对；读取时重新验证目录名、全部文件、manifest 哈希和任务绑定。",
      "managed-config.json 保存实际 Sidecar、Broker、upstream 端口、BasePath 和任务名，Status、Open、回滚与卸载不猜默认值。",
      "Supervisor 在显式租约内捕获 selected runtime、Broker/upstream PID 与创建时间、Desktop root、runtime invocation 和 compatibility id，漂移即停止更新。",
      "旧 Sidecar 的维护入口只接受受保护 bearer capability 与 32 位十六进制 update id；排空拒绝新 mutation（写动作）和下一轮派发，等待已接纳活动归零。",
      "浏览器把 method、API path 和 body 形成逻辑 intent（意图），将同一幂等键保存在内存与可用的 session storage 中，在有界网络/503 恢复窗口复用。",
      "新 Sidecar 启动或握手失败后，事务再次核对旧运行代与 owner invariant（不变量），再启动并验证精确旧 Sidecar；owner 漂移时不会冒险补偿。",
      "Rollback-CodexLocalRemoteRuntime.ps1 验证 previous manifest 后重新登记旧代为下一次采用，返回 RunningInstanceChanged=false；它不终止当前 Desktop。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "先读冻结边界与 failure-postmortem-2026-08-03.md：历史存在真实成功，但 Windows 接管没有达到可重复恢复标准；本页不以再试一次 Open 开始。",
      "历史准备阶段包含依赖构建、密码设置和允许项目登记；当前只读取对应文档、package metadata（包元数据）和测试定义，不构建或修改安装态。",
      "历史注册器从构建文件计算内容身份，将完整文件与 manifest 放入不可变目录，再原子记录 current/previous；Register -NoStart 并非无副作用的读取命令。",
      "历史 dispatcher 区分 Status、显式 Open 与 Close；这些名字仅用于解释源码职责，冻结期间全部不调用，也不存在 Status 通过后就能 Open 的当前旅程。",
      "历史兼容更新先验证 owner/compatibility，旧 Sidecar 排空已接纳写入，再以绑定 update id 的回执控制一次短切换；这些是设计条件，不是现在要运行的步骤。",
      "源码中的浏览器复用原幂等键，新 Sidecar 握手失败则在 owner 不变时恢复精确旧代；这部分保留为可复用设计，不说明当次实际补偿已发生。",
      "历史回滚脚本验证 previous manifest 后改变下一次采用指针，并返回 RunningInstanceChanged=false；当前不执行脚本或读取已安装指针。",
      "若用户未来明确启动独立恢复项目，先重新决定实现，再按隔离 Windows 生命周期矩阵与新端到端证据判断是否可恢复；静态审阅到此结束。"
    ],
    concepts: [
      { term: "content-addressed runtime（内容寻址运行代）", explanation: "目录 id 由运行文件和兼容身份的规范清单计算；任一受管字节变化都会得到新代。" },
      { term: "selected vs active（已选择与正在运行）", explanation: "current 指针表示下一次允许采用的版本；Supervisor 当前持有的 Sidecar 可能仍是上一代。" },
      { term: "atomic pointer（原子指针）", explanation: "临时写入后用文件替换一次提交，并回读哈希，避免 current/previous 半写状态。" },
      { term: "maintenance drain（维护排空）", explanation: "先停止接纳新活动，等已接纳写入和派发完成，再允许切换进程。" },
      { term: "explicit handoff（显式交接）", explanation: "历史协议将底层 owner 变化单列，不能借兼容更新自动发生；当前冻结下连显式 Open 也不能调用，恢复另行立项。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "登记、回滚指针和实际进程切换是三个证据层，任何一个都不能冒充另一个。",
      "v0.1.5 之前已运行的 Supervisor 不会凭磁盘更新获得 drain 协议；首次采用仍遵守原安全边界。",
      "兼容滚动更新允许活动 Codex turn 继续，但不允许 unknown connection、Broker/upstream/Desktop owner 漂移。",
      "排空后的公网 listener 有短暂同端口间隙；浏览器恢复有界，超时会明确离线。",
      "回滚旧 Sidecar 也必须复核 owner；无法安全恢复时报告失败，不重启 Broker 或 Desktop 掩盖问题。",
      "当前 Windows 接管方案明确冻结、不可用；缺少可重复无人值守验收是停止旧路线的原因，不是本页获准探测或重启的任务。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "排空超时或 update id/回执不匹配", response: "旧 Sidecar 回到 serving 或保持运行，不执行停止。" },
      { condition: "浏览器在短切换时连接失败", response: "同一逻辑 mutation 在有界窗口复用同一幂等键；仍未恢复时给出明确离线结果。" },
      { condition: "新 Sidecar 启动或握手失败", response: "停止候选，复核旧代与 owner 后恢复并验证精确旧 Sidecar。" },
      { condition: "selected runtime、Broker、upstream 或 Desktop root 漂移", response: "更新失败关闭；不跨 owner 猜测补偿。" },
      { condition: "历史候选的 Broker/app-server 或 compatibility id 改变", response: "源码不允许 Sidecar-only 路线；当前冻结期间不执行任何交接，未来恢复需独立项目与新验收。" },
      { condition: "previous manifest 或指针校验失败", response: "拒绝回滚，不覆盖 current，也不触碰当前运行进程。" }
    ],
    sources: [
      { path: "docs/failure-postmortem-2026-08-03.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/failure-postmortem-2026-08-03.md", role: "真实成功、接管不可重复、停止旧路线与未来独立恢复的证据边界；优先于旧安装步骤。" },
      { path: "docs/quickstart.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/quickstart.md", role: "保留首次安装、Status/Open/Close、更新和回滚的历史设计；只能只读审阅，不能照此启动冻结组件。" },
      { path: "docs/release-notes-v0.1.5.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/release-notes-v0.1.5.md", role: "定义活动任务期间的 Sidecar drain、同一幂等键续接、失败恢复和底层 handoff 边界。" },
      { path: "scripts/windows/CodexLocalRemote.Windows.psm1", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/scripts/windows/CodexLocalRemote.Windows.psm1", role: "实现内容寻址运行代、manifest/current/previous 验证、原子指针和 Sidecar 更新补偿事务。" },
      { path: "apps/sidecar/src/maintenance.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/sidecar/src/maintenance.ts", role: "实现受保护 drain、活动租约、update id 绑定、超时恢复 serving。" },
      { path: "apps/web/src/api.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/apps/web/src/api.ts", role: "在短暂 Sidecar 恢复窗口为同一逻辑写入保留幂等键并有界重试。" }
    ],
    verification: [
      "runtime-version-package、runtime-registration-pending 与 runtime-promotion 测试覆盖内容身份、不可变安装、current/previous、待采用阻断和精确回读。",
      "sidecar-runtime-update 测试覆盖活动 turn 更新、排空失败不停止、兼容门、owner 漂移、新 Sidecar 失败恢复旧代及补偿失败边界。",
      "maintenance 与 api-idempotency 测试覆盖 drain 超时恢复、同 update id 复用、跨 Sidecar 重启的同一幂等键和有界离线终态。",
      "v0.1.5 的发布说明把上述路径列为正式能力；当前 main 最新 CI run 仍为 failure，不能把旧 release 结果升级为 current main PASS。",
      "当前冻结边界禁止 Status、Register、Open、Close、Rollback、Sidecar drain 与 Broker/app-server handoff；本次仅静态审阅，没有调用运行组件，结论是不可用而非仅未测在线。"
    ],
    relation: "它依赖共享架构区分可滚动的 Web/Sidecar 与必须显式交接的 Broker/app-server；安全模块保护维护 capability 与幂等写入，版本与证据模块约束 release、current main、安装态和当前在线结论。"
  },
  {
    slug: "security-public-access",
    shortTitle: "安全接入",
    title: "公网手机入口怎样保护审批、文件和本机任务能力",
    searchAliases: ["Codex Remote安全吗", "公网文件操作怎么保护", "CSRF和登录限速", "为什么Codex Remote不是公网Shell"],
    searchProjection: {
      intents: ["判断公网入口能访问什么不能访问什么", "从手机执行文件写入删除时需要哪些确认", "理解登录同源与 CSRF 怎样保护写请求", "确认底层 app-server 是否暴露到局域网或公网"],
      entities: ["HTTPS reverse proxy", "session cookie", "Origin", "CSRF", "idempotency key", "opaque grant", "loopback listener", "DPAPI"],
      relations: ["公网只到认证 Sidecar 而 Broker 和 app-server 只监听 loopback", "写请求同时要求登录同源 CSRF 与必要幂等键", "文件授权继承当前 Windows 用户并使用不透明根和相对路径", "可复用凭据和私人地址不进入日志源码或网页"],
      failureRecovery: ["当前入口不可用且冻结，不登录或进行运行探测", "历史设计会话过期后不续原写请求", "Origin或CSRF不匹配时拒绝mutation", "历史设计幂等结果不明不制造第二次动作", "历史设计文件确认或grant过期时重新选择目标"]
    },
    teaser: "历史公网设计用单所有者会话、限速、同源/CSRF、幂等和不透明文件授权约束请求；当前冻结，不登录或发起探测。",
    status: "当前控制入口不可用且冻结；认证、路径、会话、Markdown 与请求守卫仅保留源码/历史测试，不建立会话或访问端点",
    statusTone: "problem",
    value: "历史产品用登录、同源、幂等与明确确认约束手机操作，阻止第三方网页借用会话影响电脑；这些防护设计不代表当前开放公网服务，入口仍全部冻结。",
    why: "这个入口能够批准命令、修改文件和继续任务，风险远高于只读仪表盘。只有密码登录远远不够；写请求还必须证明来自当前产品页面并且没有被重复提交。",
    example: "历史请求守卫示例中，第三方网页诱导带 Cookie 的浏览器 POST 删除文件，仍会因 Origin、Fetch Metadata 或 CSRF 不匹配而被拒绝。当前只读解释这一合同，不向任何端点发送验证请求。",
    result: "可还原单所有者、同源、短会话、幂等与显式确认共同约束的历史公网设计；当前不提供登录或操作入口，也不接触真实密码、Cookie 或认证数据库。",
    readerStates: {
      pass: "历史成功条件是登录、会话、Origin、CSRF、幂等与目标确认全部匹配；当前冻结，条件成立也不能据此调用 Sidecar。",
      problem: "历史源码拒绝重复、过期、跨站和目标漂移请求；当前不执行探测、登录或重试来补安全/运行证据。",
      unavailable: codexRemoteFrozenBoundary + " 历史设计在认证、会话存储或请求守卫不可用时也不退化为匿名模式。"
    },
    decisionImpact: [
      "任何有效 Web 会话都等同拥有该 Windows 用户的文件操作能力。",
      "登录与每个写请求分别验证，不能只看 Cookie。",
      "待发正文加密落盘，不进日志、SSE或浏览器长期存储。",
      "真实凭据无论分级标签如何都禁止公开。"
    ],
    problem: "解决暴力登录、会话劫持、跨站写入、请求重放、路径越界、不可信 Markdown 和敏感正文落日志。",
    implementation: [
      "密码使用随机盐强哈希；session token 只保存摘要并有 idle/absolute expiry。",
      "Cookie 设置 Secure、HttpOnly、SameSite=Strict。",
      "mutating request 同时检查 authentication、Origin、Fetch Metadata、CSRF 与 idempotency key。",
      "登录按单来源和全局双重限速，指数退避并临时锁定。",
      "Markdown、工具输出、diff、SVG、文件名和链接都按不可信输入处理。",
      "队列正文用当前用户 DPAPI 加密；审计只记最小元数据。"
    ],
    flow: [
      codexRemoteHistoricalFlow,
      "浏览器提交密码并通过限速检查。",
      "Sidecar 建立短时 Secure 会话。",
      "页面为写请求取得 CSRF token 与幂等身份。",
      "请求到达后重新验证会话、来源与目标。",
      "执行精确任务、审批或文件动作。",
      "回读结果并消费幂等键。",
      "过期或退出时清理会话。"
    ],
    concepts: [
      { term: "SameSite=Strict", explanation: "浏览器不在跨站请求中发送会话 Cookie。" },
      { term: "CSRF token（跨站校验值）", explanation: "证明写请求来自当前产品页面，而不是第三方站点。" },
      { term: "idempotency key（幂等键）", explanation: "同一现实动作只允许一次，网络重试不会重复执行。" },
      { term: "DPAPI（Windows 数据保护）", explanation: "待发正文只允许当前 Windows 用户解密。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "这是单所有者产品，不提供多用户角色和租户隔离。",
      "不能抵御同一 Windows 用户下已经执行的恶意软件。",
      "反向代理或 Funnel 的安全仍需独立配置。",
      "公开网页不发布真实密码、Cookie、token、认证数据库或私有地址。"
    ],
    failures: [
      { condition: "当前入口冻结", response: codexRemoteFrozenBoundary },
      { condition: "连续登录失败", response: "指数退避并按来源/全局临时锁定。" },
      { condition: "Origin 或 CSRF 不匹配", response: "拒绝写请求，不执行副作用。" },
      { condition: "幂等键已消费", response: "返回已有结果，不重复操作。" },
      { condition: "路径或 Markdown 不可信", response: "拒绝危险路径，转义或移除主动内容。" }
    ],
    sources: [
      { path: "docs/threat-model.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/threat-model.md", role: "定义公网入口资产、攻击面、单所有者假设和已知限制。" },
      { path: "packages/security/src/request-guards.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/packages/security/src/request-guards.ts", role: "实现 Origin、Fetch Metadata、CSRF 与请求守卫。" },
      { path: "packages/security/src/session.ts", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/packages/security/src/session.ts", role: "实现会话 token 摘要、到期与撤销。" }
    ],
    verification: [
      "CI 覆盖 authentication throttling、path traversal、origin checks、unsafe Markdown 与 session expiry。",
      "PUBLIC safety 扫描阻断真实主机、密码、token、对话日志和私有路径进入源仓库。",
      "本轮20张图片逐张视觉检查；凭据承载面和私有 tailnet 地址全部排除或裁除。"
    ],
    relation: "它包住同一任务、子智能体、审批、文件、实时架构与更新维护入口；安装更新模块复用受保护 capability 与幂等边界，版本证据说明这些防护在哪个正式版本接受过验证。"
  },
  {
    slug: "versions-evidence",
    shortTitle: "版本与证据",
    title: "哪些事实证明产品做成过，哪些不能推成当前在线",
    searchAliases: ["Codex Remote跑通过吗", "v0.1.5测试证据", "20张真实界面", "不代表当前在线"],
    searchProjection: {
      intents: ["确认 Codex Remote 历史上是否真实跑通过", "区分正式版本当前 main 和当前在线", "判断截图测试与实机验收各能证明什么", "了解当前 Windows 接管方案重新启用还缺什么"],
      entities: ["v0.1.5", "c3a07719", "main=94f1cfad", "1771 tests", "historical real E2E", "current online", "Windows takeover acceptance"],
      relations: ["release 测试只证明绑定版本", "历史真实链路证明产品做成过但不证明当前在线", "current main CI 与正式 release 证据分层", "当前 Windows 接管方案重新启用前需要隔离可重复无人值守验收"],
      failureRecovery: ["当前控制入口明确不可用且冻结，不用未验证在线代替", "tag与commit不一致时只读回读refs", "截图来源不清时降为设计演示", "历史成功不解除冻结，恢复必须独立明确立项和新验收"]
    },
    teaser: "v0.1.5 的1771项测试、370文件公开扫描、Playwright 192项发现/157通过/35跳过、历史真实多端E2E和20张界面证据分层呈现；main与release身份分开。",
    status: "v0.1.5 正式证据与历史真实链路已形成；当前控制入口 Status=不可用、runtime frozen，不允许用在线探测或重启改变这一状态",
    statusTone: "mixed",
    value: "我能清楚知道产品真正做成并跑通过什么，也不会因为一张绿图、一个历史截图或一个新提交就误判现在在线。",
    why: "源码、单元测试、合成浏览器、真实手机截图、真实 Desktop E2E 和当前在线是不同证据层。把它们合成一个‘可用’标签，会同时夸大成功和掩盖缺口。",
    example: "v0.1.5 的 1771 项 Vitest 与 Playwright 157/192 通过（35 项按视口跳过）证明对应代码与合成 UI；2026-07/08 的真实手机验收证明曾经跑通。当前则已明确冻结、不可用，不是仅缺一份在线报告，所以不能再调用 Status/Open 或端点来补证。",
    result: "得到绑定版本、日期与证据类型的清楚结论：已做成和真实成功不被抹掉，当前冻结也不被降成 Unknown；只有具名静态审阅可继续，恢复必须是另行明确启动并重新验收的项目。",
    readerStates: {
      pass: "claim 与 release/tag、测试、E2E 或图片证据精确匹配时，页面明确写出能证明的范围。",
      problem: "current main、截图时间和正式版本不一致时，分层展示，不把新源码覆盖旧 release 证据。",
      unavailable: "现行控制入口明确不可用且冻结；只允许具名静态证据的只读查看。恢复需由用户另行启动独立项目并重新做端到端验收。"
    },
    decisionImpact: [
      "正式发布证据绑定 v0.1.5 / c3a07719。",
      "current main=94f1cfa 与 package version 单列，不冒充 release。",
      "真实截图标注日期，合成截图标注 demo。",
      "当前控制状态已知为不可用且冻结；历史证据不能改变它，网页取证不调用 runtime E2E。",
      "只有用户另行明确启动独立恢复项目，重新决定实现并完成隔离恢复矩阵与真实端到端验收，才可能改变当前状态；不是再试一次 Open。"
    ],
    problem: "解决 release/main 混写、测试冒充运行、合成截图冒充实机、历史实机冒充当前在线，以及把一次接管成功误写成可重复无人值守交付。",
    implementation: [
      "Git refs 与 GitHub release 现场回读提供版本身份。",
      "GitHub Actions run 30756063724 / job 91519619868 分开记录 source check、370 文件 public safety 与 Chromium E2E；Release 正文没有重复这些计数，正式计数来源是 CI 日志。",
      "Playwright SharedRuntime 明确使用合成任务，不能升级成 Desktop 实机证据。",
      "历史 acceptance 记录同一任务、审批、文件 SHA、队列、停止和重连。",
      "公开画廊为每张图写清能证明与不能证明什么，避免把合成界面或历史实机画面冒充当前在线。",
      "Windows 接管停止旧补丁路线的事实由公开复盘保留，现行控制入口同时明确冻结；未来恢复单列实现决定、隔离生命周期矩阵和新真实端到端验收。"
    ],
    flow: [
      "先确认当前入口不可用且冻结，只进行获准的具名静态审阅，不调用 dispatcher、Status 或运行端点。",
      "回读 PUBLIC main、tags 与 latest release。",
      "把产品 claim 绑定到精确版本和提交。",
      "读取测试文件、数量与 CI 结论。",
      "区分合成浏览器与真实多端验收。",
      "单列当前 Windows 接管方案的隔离可重复无人值守验收状态。",
      "逐张检查图片来源、日期、敏感值和重复。",
      "只发布与证据层匹配的结论。",
      "未来只有本人明确要求才重新取证。"
    ],
    concepts: [
      { term: "release evidence（发布证据）", explanation: "绑定公开 tag 和精确提交的构建、测试与发布记录。" },
      { term: "synthetic runtime（合成运行时）", explanation: "浏览器测试使用的固定任务和能力，不连接真实 Desktop。" },
      { term: "real-machine E2E（实机端到端）", explanation: "真实手机、Web、Desktop 和文件/审批共同走通。" },
      { term: "current online（当前在线）", explanation: "历史图证和测试不能证明实时服务；当前已明确不可用且冻结，不能为验证这个字段调用运行组件。" }
    ],
    boundaries: [
      codexRemoteFrozenBoundary,
      "不把 package=0.1.6-unreleased.0 写成已发布 v0.1.6。",
      "不把1771项测试写成当前在线证明。",
      "不把真实历史截图写成当前模型、额度或健康状态。",
      "不把源码分支、发布状态或历史截图冒充为当前在线结果。",
      "不把历史接管成功冒充为当前方案已经可重复无人值守。"
    ],
    failures: [
      { condition: "tag 与 commit 不匹配", response: "停止版本结论并重新回读 refs。" },
      { condition: "测试数来自不同提交", response: "绑定各自版本，不相加成总通过数。" },
      { condition: "截图来源或日期不清", response: "降为设计/演示或移出画廊。" },
      { condition: "当前入口冻结", response: "明确写不可用且冻结；不降成‘未验证在线’，不调用 Status、Open、runtime 或公网端点补证。" },
      { condition: "用户未来提出恢复", response: "另作明确的独立项目和实现决定，先完成隔离恢复与新端到端验收；保留历史成功，不从单次成功外推稳定性。" }
    ],
    sources: [
      { path: "docs/failure-postmortem-2026-08-03.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/failure-postmortem-2026-08-03.md", role: "区分 E1 源码/测试、E2 登记、E3 单次真实成功与 E4 可重复恢复，并记录停止旧接管路线。" },
      { path: "docs/release-notes-v0.1.5.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/release-notes-v0.1.5.md", role: "v0.1.5 产品范围与发布说明。" },
      { path: ".github/workflows/ci.yml", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/.github/workflows/ci.yml", role: "Windows source、public safety 与 Chromium 验收流程。" },
      { path: "docs/acceptance-todo.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/acceptance-todo.md", role: "历史真实手机/Desktop 同任务验收记录。" },
      { path: "GitHub Actions run 30756063724", href: "https://github.com/wlyaaaaa/codex-local-remote/actions/runs/30756063724", role: "v0.1.5 同提交测试、PUBLIC scan 与 Playwright 数量的正式 CI 回执。" }
    ],
    verification: [
      "Git refs 本轮只读回读 main=94f1cfa、v0.1.5=c3a07719。",
      "v0.1.5 的 GitHub Actions run 30756063724（attempt 2，job 91519619868）记录 114 个 Vitest 文件 / 1771 passed、370 files checked、Playwright 192 discovered / 157 passed / 35 skipped。",
      "该 CI run 没有独立上传 artifact 或签名 attestation；Release 正文也不拥有这三个计数，不能把 release 文案本身冒充计数回执。",
      "20张最终图片 SHA 全唯一，总原图约2.51 MiB，三段式 WebP 预览约0.30 MiB。",
      "历史真实链路与产品证据已形成；现行控制入口仍明确不可用且冻结，只读源码/文档审阅不能解除。可重复恢复与新端到端验收只能在另行明确启动的恢复项目中进行。",
      "本轮没有启动、查询或控制任何 Codex Remote runtime。"
    ],
    relation: "它为前八个模块标注证据强度与时间边界，防止把源码、测试、截图、历史实机验收、安装指针或单次接管成功误写成当前在线。"
  }
];

export const project = codexRemoteProject;
export const modules = codexRemoteModules;
