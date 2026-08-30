export const codexRemoteProject = {
  order: 9,
  slug: "codex-remote",
  title: "Codex Remote",
  route: "/projects/codex-remote",
  visibility: "公开仓库",
  statusTone: "mixed",
  searchAliases: ["手机继续Codex桌面任务", "Codex手机远程控制", "同一个Desktop任务", "手机审批和看diff", "Codex Remote"],
  repositoryNote: "源码位于 PUBLIC（公开）GitHub 仓库。这个页面直接展示 Codex Remote 的真实产品名、公开版本、架构、代码、测试和历史真实手机画面；只隐藏可复用凭据、私人 tailnet 地址和实际达到三级以上且经逐值判断确属敏感的内容。当前在线状态没有在本轮验证，因此页面不宣称在线。",
  summary: "Codex Remote 让我离开电脑后，用手机浏览器继续电脑上正在进行的同一个 Codex Desktop 任务。手机上能看任务进展、命令和文件改动，处理真实审批，补充当前要求，停止回复，或把下一件事排到后面；也能在明确确认下浏览和操作自己的文件。它不传输桌面画面，也不另开一份聊天。",
  why: "长任务可能正在电脑上运行、等待审批或已经改了文件。另开一个手机聊天只能复制文字，拿不到同一个任务的真实轮次、工具、审批和文件状态。Codex Remote 把移动端设计成“查看—审批—引导—排队—回读”的控制面，并在身份、连接或结果不清时拒绝动作。",
  plainExample: "例如电脑上的任务正在改项目并等待一条命令审批。我在手机上先看命令会影响什么、刚改了哪些文件，再选择这次真实提供的审批选项并补充一个条件；如果当前回复已经快结束，就把下一件事放进可编辑队列。网络中断时先回读状态，不会自动重复发送。",
  result: "我得到一个移动优先但仍以 Desktop 为同一任务事实面的控制台：任务、轮次、公开进展、工具、文件、审批、子智能体、模型、上下文和额度保持可核对；文件工作台另行提供有确认边界的所有者文件操作。无法确认 Desktop 订阅、权限或请求身份时，产品明确拒绝，不猜造成功。",
  readerStates: {
    pass: "Desktop 与 Sidecar 连接同一个回环 Broker、任务订阅屏障完成且请求身份匹配时，手机和 Desktop 继续同一个任务与轮次。",
    problem: "网络抖动、审批缺少可提交选项、队列状态不确定或文件目标冲突时，保留草稿和真实状态，给出精确可恢复动作，不重复提交。",
    unavailable: "Desktop、Broker、Sidecar、会话或文件授权证据不足时，仅拒绝受影响操作；不启动第二个任务、不公开底层接口，也不把历史截图冒充当前在线。"
  },
  heroFacts: [
    { label: "它实际是什么", value: "手机浏览器继续同一个 Codex Desktop 任务；不是远程桌面、屏幕串流或公网 Shell" },
    { label: "共享机制", value: "Browser → 认证 Sidecar → loopback Broker → 单一 app-server ← Codex Desktop；共享 threadId / turnId" },
    { label: "主要能力", value: "任务与历史、公开进展、工具、diff、子智能体、审批、引导、停止、下一轮队列、模型/上下文/额度、所有者文件工作台" },
    { label: "正式公开版本", value: "v0.1.5 / c3a07719ecbe00dbad515b3cae00fd0f33b186d2；记录 1771 项测试、public-safety 与 Chromium 响应式验收" },
    { label: "当前公开源码", value: "PUBLIC main=94f1cfadfbba97d3cfd2b21c73fba0104ccf2cf6；package=0.1.6-unreleased.0，不能写成已发布 v0.1.6" },
    { label: "本页证据边界", value: "12 张历史真实手机 UI + 7 张公开合成演示 + 1 张历史合成 QA；本轮未调用 Remote runtime，不代表当前在线" }
  ],
  productPrinciples: [
    { title: "两端共享同一个任务事实", detail: "手机与 Desktop 使用同一任务和轮次，不复制聊天历史制造看似同步的第二份任务。" },
    { title: "移动端只保留真正需要的控制", detail: "优先查看、审批、引导、停止、排队和回读，不把整套桌面界面机械缩小到手机。" },
    { title: "当前轮和下一轮严格分开", detail: "当前回复怎样继续、下一轮换什么模型和做什么是两种状态，不能热切换出无法解释的中间结果。" },
    { title: "界面只显示运行时真实提供的值", detail: "模型、审批选项、额度、上下文和工具状态不写死，也不为了界面完整补造按钮。" },
    { title: "待发队列不是任务记录", detail: "Web草稿只有真正派发并被同一任务接受后，才成为任务的一部分。" },
    { title: "项目任务和所有者文件是两条边界", detail: "任务工作区受项目身份约束，文件工作台使用 Windows 所有者能力；两者不能互相冒充权限。" },
    { title: "公网只看到产品接口", detail: "认证、同源和确认边界挡在前面，底层任务协议、回环服务与敏感载荷留在本机。" },
    { title: "结果不清就先回读，不自动重放", detail: "断线、重复提交或状态不确定时保留草稿和幂等身份，先确认权威状态再决定是否继续。" }
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
    "让用户在手机处理运行时实际提供的审批与结构化问题，并区分当前轮引导、停止和下一轮队列",
    "从当前运行时读取模型、思考等级、速度、权限、审批、上下文和额度，不用写死目录冒充当前状态",
    "提供注册项目、隔离无项目任务和独立所有者文件工作台，并为覆盖、永久删除等动作保留确认边界",
    "用认证 Sidecar、回环 Broker 和单一 app-server 保持公网入口与底层协议隔离",
    "在断线、重复提交、订阅缺失和身份不清时失败关闭，保留草稿和可恢复状态"
  ],
  exclusions: [
    "不提供远程桌面画面、任意公网 Shell、原始 app-server JSON-RPC 或匿名文件代理",
    "不显示模型隐藏的完整思维链，只展示运行时公开提供的 summary（摘要）与工具活动",
    "不在同一轮生成中热切换模型、思考等级、速度或权限；设置只影响下一轮",
    "不把 Web 的下一轮队列冒充 Desktop 原生未发送草稿；真正派发后才进入 Desktop 持久记录",
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
    { term: "SSE（服务器事件流）", meaning: "浏览器接收实时任务更新的单向事件通道；断线后按事件序号续接或重读快照。" },
    { term: "CSRF（跨站请求伪造防护）", meaning: "写请求必须同时满足登录、可信来源和一次性校验，避免第三方网页借用会话操作电脑。" },
    { term: "opaque grant（不透明短时授权）", meaning: "任务正文中的本地绝对路径换成短时文件引用，避免形成可复用公网裸链接。" },
    { term: "owner file manager（所有者文件工作台）", meaning: "继承 Sidecar 当前 Windows 身份的文件能力，不是多用户沙箱。" }
  ],
  currentState: {
    observedAt: "2026-08-30T11:29:50Z",
    label: "产品、公开版本、源码、历史真实多端使用与20张界面证据均已确认；本轮未调用运行时，页面不代表当前在线",
    facts: [
      "Git Owner 确认 wlyaaaaa/codex-local-remote 为 PUBLIC（公开），默认 main；观察时远端 main=94f1cfadfbba97d3cfd2b21c73fba0104ccf2cf6，本地工作树干净。",
      "最新正式公开版本为 v0.1.5，对应 c3a07719ecbe00dbad515b3cae00fd0f33b186d2；该版本记录 1771 项测试、public-safety 和 Chromium 六视口验收通过。",
      "当前 main 的 package version 是 0.1.6-unreleased.0；它包含 v0.1.5 后的源码变化，但本页不把它写成已发布 v0.1.6。",
      "源码实现任务、队列、审批、模型/上下文/额度、子智能体、文件工作台、认证、SSE 重连、回环 Broker 与单一 app-server 边界。",
      "历史真实手机、双 Web 与 Desktop 曾完成同一任务/轮次、审批、文件 SHA、子智能体、引导、队列、停止、计划问题、压缩和重连验收。",
      "本页20张图由12张真实手机 UI、7张 PUBLIC 合成演示和1张历史合成 QA 组成；真实图只裁除私有地址栏并清除元数据，普通非敏感技术事实保留。"
    ],
    gaps: [
      "本轮遵守只读边界，没有启动、关闭、重启、查询或访问任何 Remote 组件，因此不能声明当前在线。",
      "v0.1.5 的测试和历史真实验收只证明对应版本与场景，不自动覆盖当前 Desktop、Codex、网络或浏览器版本。",
      "公开合成截图证明 UI 与状态合同，不证明真实任务执行；历史真实截图也只代表拍摄时刻。",
      "文件工作台继承单一 Windows 所有者权限，不提供多用户隔离，也不能抵御同一 Windows 用户下的恶意软件。",
      "Desktop 未连接、订阅屏障失败、审批没有选项或请求身份不清时，相关动作会失败关闭；网页不会补造结果。"
    ]
  },
  operatingFlow: [
    { title: "浏览器先通过认证入口", detail: "手机只访问 HTTPS 反向代理后的 Sidecar；登录、会话、Origin、CSRF 与限速在产品 API 之前生效。" },
    { title: "选择同一个任务或创建有界任务", detail: "已有任务按 threadId 恢复；新任务只能使用本机登记项目或隔离无项目根。" },
    { title: "Broker 完成 Desktop 订阅屏障", detail: "需要新首轮时，先让任务壳持久化并确认 Desktop 已 resume；没有 Desktop 证据就拒绝 turn/start。" },
    { title: "实时投影公开任务事件", detail: "Sidecar 将正文、公开摘要、工具、文件、审批、计划和子智能体投影为浏览器能读的产品状态。" },
    { title: "用户选择当前轮或下一轮动作", detail: "steer、interrupt、审批是当前实时动作；队列、模型和模式属于下一轮，界面明确分开。" },
    { title: "文件动作逐步确认并回读", detail: "浏览、预览、上传、编辑、移动和删除都按不透明根与相对路径执行；覆盖、永久删除需要明确选择。" },
    { title: "断线只恢复可证明的部分", detail: "SSE 用事件 ID 重连，草稿和加密队列保持；实时动作缺连接时失败关闭，不静默重放。" },
    { title: "人工取证后更新网页", detail: "只有本人明确要求时，网页才重新读取 PUBLIC Git、版本、测试和获准图片；不建立在线探针或自动刷新。" }
  ],
  components: [
    { name: "Web PWA（手机网页应用）", responsibility: "提供任务、对话、审批、文件、设置与离线草稿界面。", implementation: "React + Vite + TypeScript；中文优先、响应式、主要触控目标至少44×44 CSS像素。" },
    { name: "Sidecar（认证侧车）", responsibility: "拥有登录会话、产品 API、SSE、领域投影、队列与文件能力。", implementation: "默认仅监听本机；不记录已发送对话和文件正文，待发队列用 DPAPI 加密。" },
    { name: "Broker（共享代理）", responsibility: "让 Desktop 与 Sidecar 连接同一个 app-server 并维护订阅屏障。", implementation: "回环 WebSocket；注入 RPC id 不向产品客户端泄露，Sidecar 断开不终止 Desktop。" },
    { name: "单一 app-server", responsibility: "提供任务、轮次、模型、审批、额度和事件协议。", implementation: "由 Broker 独占；原始 WebSocket 不监听 LAN 或公网。" },
    { name: "Domain projection（领域投影）", responsibility: "把协议事件变成稳定的任务、消息、工具、文件和审批产品模型。", implementation: "浏览器只依赖项目合同，不直接依赖底层 app-server 类型；原始 reasoning 被丢弃。" },
    { name: "Turn queue（下一轮队列）", responsibility: "保存、排序、编辑和派发尚未发送的下一轮要求。", implementation: "稳定消息 id、revision、串行 claim 与幂等键；不确定状态保持 ambiguous 而不重复发。" },
    { name: "Owner file manager（所有者文件工作台）", responsibility: "按当前 Windows 身份浏览和操作检测到的磁盘。", implementation: "不透明 root id + 卷内相对路径；拒绝 traversal、UNC、设备路径、ADS 与未确认覆盖。" },
    { name: "Security package（安全组件）", responsibility: "提供密码哈希、会话、限速、Origin/CSRF、下载与 Windows 路径检查。", implementation: "Secure/HttpOnly/SameSite=Strict Cookie；写入需认证和同源证据。" },
    { name: "PUBLIC demo fixtures（公开演示材料）", responsibility: "用合成任务展示界面而不复制真实主机、对话、路径或凭据。", implementation: "静态 demo.ts 与浏览器验收共享类型合同；截图不接触 Remote runtime。" }
  ],
  usageExamples: [
    { ask: "电脑上的任务还在做什么？", effect: "打开同一 thread，查看当前回复、公开 Work Log、工具、文件修改、计划和子智能体状态。" },
    { ask: "这个命令能不能在手机批准？", effect: "只显示 app-server 为本次请求提供的真实选项；没有选项时说明阻塞，不猜按钮。" },
    { ask: "给正在生成的回复补一句要求", effect: "使用当前轮 steer；若这轮不再接受引导，保留文本并建议放到下一轮。" },
    { ask: "下一轮换模型并继续", effect: "先把要求加入队列，再选择运行时当前提供的模型、思考等级和速度；不改当前轮。" },
    { ask: "手机查看刚才改了哪些文件", effect: "从工作记录或文件变更打开 diff、最新文件和有界预览，必要时下载。" },
    { ask: "从手机给任务添加电脑里的文件", effect: "使用对话工具选择所有者文件引用；绝对路径换成短时授权，不形成公网裸链接。" },
    { ask: "网页断线后会不会重复发送", effect: "草稿与队列保持稳定 id 和 revision；状态不清时标记 ambiguous，先回读再决定，不自动重发。" },
    { ask: "这20张图能否证明现在在线", effect: "不能。真实图证明产品曾在手机上工作，合成图证明 UI；当前在线需要另一次明确运行验收。" }
  ],
  evidenceLayers: [
    { layer: "PUBLIC source（公开源码）", proves: "main 定义 Web、Sidecar、Broker、app-server client、domain、security、queue 与 files 的实现和边界。", doesNotProve: "当前机器已安装、启动或在线。" },
    { layer: "v0.1.5 release tests（正式版本测试）", proves: "c3a07719 记录 1771 项测试、public-safety 与 Chromium 六视口验收通过。", doesNotProve: "当前 main、当前 Desktop 或任意网络长期稳定。" },
    { layer: "Historical real E2E（历史真实端到端）", proves: "真实手机、双 Web 与 Desktop 曾共享任务/轮次并走通审批、文件、子智能体、引导、队列、停止和恢复。", doesNotProve: "本轮当前在线或所有新版本继续兼容。" },
    { layer: "Real mobile gallery（真实手机画廊）", proves: "12张真实手机 UI 展示任务、对话、工具、命令、diff、文件、诊断、额度和输入控制。", doesNotProve: "截图里的任务、数值、模型或健康状态仍是当前事实。" },
    { layer: "Synthetic UI gallery（合成界面画廊）", proves: "7张公开演示与1张QA图在无私人数据情况下说明完整产品表面。", doesNotProve: "合成任务真的执行过或当前服务在线。" },
    { layer: "Current Git identity（当前 Git 身份）", proves: "观察时 PUBLIC main=94f1cfad、v0.1.5=c3a07719 且 source worktree 干净。", doesNotProve: "网页会自动跟随未来提交更新。" }
  ],
  evolution: [
    { date: "2026-07-25—07-27", commit: "ed801f5–352e14d", result: "形成同一任务、手机控制、公开任务列表、审批、队列和 v0.1.0/v0.1.1 产品基线。" },
    { date: "2026-07-31—08-01", commit: "b6988c5–4ef151d", result: "补齐持久队列、长对话、Work Log、动态审批、附件、目标和所有者文件能力。" },
    { date: "2026-08-02", commit: "df9ff3c–c3a0771", result: "完成 v0.1.3—v0.1.5 的移动体验、真实状态呈现、响应式验收和公开安全边界。" },
    { date: "2026-08-02—08-06", commit: "e7949b6–94f1cfa", result: "继续收紧共享所有权、端口、交接与证据边界；公开 main 保留后续源码，但正式发布身份仍以 v0.1.5 为准。" }
  ],
  operationalEntrypoints: [
    { name: "回读 PUBLIC refs", command: "git ls-remote --heads --tags https://github.com/wlyaaaaa/codex-local-remote.git", purpose: "只读确认 main、v0.1.5 和 tag 提交；不会触碰 Remote runtime。" },
    { name: "查看产品边界", command: "Get-Content .\\docs\\feature-matrix.md", purpose: "读取注册项目、无项目任务、审批、队列、文件和失败行为的当前源码合同。" },
    { name: "查看共享架构", command: "Get-Content .\\docs\\architecture.md", purpose: "读取 Browser、Sidecar、Broker、单一 app-server、SSE 与安全边界。" },
    { name: "SOURCE 静态验收", command: "pnpm check", purpose: "运行格式、lint、typecheck、单测、构建和公开安全检查；它只产生源码证据，不代表当前在线。" },
    { name: "合成浏览器验收", command: "pnpm test:e2e", purpose: "使用 SharedRuntime 合成数据验证六个 viewport；不会启动真实 Desktop、Broker 或 Sidecar。" }
  ]
};

export const codexRemoteModules = [
  {
    slug: "same-task-control",
    shortTitle: "同一任务",
    title: "手机怎样继续 Desktop 上同一个任务，而不是另开一份",
    searchAliases: ["手机和桌面同一个任务", "threadId turnId一致", "Desktop不在时拒绝首轮", "手机新建项目任务"],
    teaser: "用同一 threadId、turnId、单一 app-server 与 Desktop 订阅屏障维持任务身份；不能安全续接时拒绝首轮。",
    status: "源码、v0.1.5 测试和历史真实多端验收均有证据；本轮未验证当前在线",
    statusTone: "mixed",
    value: "离开电脑后，我能继续原任务，不会因为手机端另开聊天而丢掉真实进展、审批和文件状态。",
    why: "仅把历史消息复制到网页并不能证明两端是同一个任务。若手机创建了第二个 app-server 或 Desktop 尚未订阅就启动首轮，两端会出现不同 task、不同 turn 和无法解释的重复执行。",
    example: "手机新建一个已登记项目任务。Broker 先让空任务壳持久化，再要求 Desktop 对同一 thread 完成 resume；只有这两步都成功，手机的第一条要求才真正启动。",
    result: "得到同一 threadId、turnId、rollout 与工作目录可核对的任务；Desktop 缺席或屏障失败时，手机明确收到拒绝。",
    readerStates: {
      pass: "任务身份、项目根、Desktop 订阅和首轮请求全部匹配时，手机与 Desktop 进入同一个任务。",
      problem: "重连、重复请求或任务壳状态不清时，先回读任务与轮次，不直接重放 turn/start。",
      unavailable: "Desktop 不在或 Broker 不能证明单一 app-server 时，手机首轮失败关闭，Desktop 现有任务不被终止。"
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
      "手机不能在 Desktop 缺席时偷偷创建一条独立生产任务。",
      "Web 队列不是 Desktop 原生未发送草稿。",
      "Sidecar loss 不应让 Desktop 任务退出。",
      "页面不以截图或相似标题证明同一任务。"
    ],
    failures: [
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
      "本轮只读审查未调用 Remote runtime，因此当前在线保持未验证。"
    ],
    relation: "它是审批、文件、实时架构与安全模块的身份基础：只有先证明手机和 Desktop 指向同一任务，后续操作才有明确对象。"
  },
  {
    slug: "models-approvals-context",
    shortTitle: "审批与上下文",
    title: "模型、审批、额度和上下文怎样保持真实，而不是写死界面",
    searchAliases: ["手机处理Codex审批", "下一轮换模型", "查看上下文和额度", "审批没有按钮怎么办"],
    teaser: "模型与权限来自运行时目录；审批只显示本次真实选项；当前参数、下一轮选择、线程上下文和账号额度分开。",
    status: "动态目录、审批、额度和压缩有源码与测试；历史真实任务曾走通，当前目录未查询",
    statusTone: "mixed",
    value: "我能知道当前任务实际用什么、下一轮准备改什么、还剩多少上下文，以及手机上的审批到底会影响什么。",
    why: "把一个默认模型、0%用量或固定‘允许一次’按钮写死，会让界面看起来完整却与实际运行时不一致；同一轮热切换参数还会产生无法解释的中间状态。",
    example: "当前轮正在使用一个模型与高思考等级。我在手机选择另一个模型和标准速度，界面只把它记为下一轮设置；当前轮仍按原参数完成。",
    result: "得到当前运行参数、下一轮草稿、审批选项、线程上下文和账号额度分层显示的控制面；缺失数据保持 Unknown。",
    readerStates: {
      pass: "运行时目录、当前线程参数与下一轮选择都可读时，界面同时展示且不混写。",
      problem: "目录刷新、压缩或审批提交后回读不一致时，保留原选择并提示重新读取。",
      unavailable: "运行时没有提供模型、额度或审批选项时，相关控件禁用或显示未知，不生成默认值。"
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
      "不热切换当前正在生成的轮次。",
      "不使用 demo 模型列表冒充当前账号目录。",
      "没有 options 的审批只能显示原因。",
      "截图中的额度、版本和模型只代表拍摄时刻。"
    ],
    failures: [
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
    teaser: "任务从已登记项目或隔离无项目根启动；文件工作台另按当前 Windows 身份提供浏览、预览、上传、编辑、移动与删除。",
    status: "文件合同、路径检查与完整操作测试存在；历史真实手机曾上传并核对 SHA，本轮未访问本机文件",
    statusTone: "mixed",
    value: "我既能让任务在正确项目里工作，也能从手机处理电脑文件；两者边界清楚，不把任务 cwd 当作整个电脑的权限模型。",
    why: "项目任务需要防止根目录被替换或越界；所有者文件管理又不能因为任务不在某个项目里就失去用户本来拥有的磁盘权限。把两者混在一起会既不安全又不好用。",
    example: "我从登记的项目创建任务，同时在独立文件页浏览另一个磁盘，把一个文件复制到项目目录；若目标已存在，产品先让我选择是否覆盖。",
    result: "得到两个明确表面：任务工作区绑定项目身份，文件工作台绑定 Windows 所有者身份；路径、覆盖和删除都有可回读结果。",
    readerStates: {
      pass: "项目身份、root id、相对路径、Windows 权限和覆盖选择都满足时，执行文件动作并回读结果。",
      problem: "目标存在、文件被占用、跨盘移动或短时授权过期时，保留源文件并说明可恢复动作。",
      unavailable: "项目根被替换、路径越界、磁盘未挂载或权限不足时，仅拒绝对应动作，不自动放宽范围。"
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
      "文件工作台不是任务 sandbox，也不是多用户权限系统。",
      "Windows ACL、BitLocker、挂载和占用仍决定真实结果。",
      "临时文件已被系统删除时，历史消息不能恢复其字节。",
      "不公开真实私人文件内容或可复用授权。"
    ],
    failures: [
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
    teaser: "公网只到认证 Sidecar；Broker 与 app-server 均在 loopback，Desktop 与 Sidecar 保持独立连接和各自订阅。",
    status: "共享架构、SSE 重连和订阅屏障有源码与测试；当前运行实例未查询",
    statusTone: "mixed",
    value: "我可以从手机看实时任务，又不需要把 app-server 原始协议或 Windows 桌面画面直接暴露公网。",
    why: "直接把 app-server WebSocket 暴露公网会绕过产品认证和输入边界；让 Desktop 与 Sidecar 各启一个 app-server 又会生成不同任务事实。",
    example: "手机通过 HTTPS 打开任务，Sidecar 接收经过认证的请求并通过回环连接 Broker；Broker 把 RPC 发给同一个 app-server，事件再经 Sidecar 的 SSE 投影返回手机。",
    result: "得到一条分层、可失败关闭的实时链：公网入口、产品投影、共享连接与任务事实各自有明确 owner。",
    readerStates: {
      pass: "Sidecar 会话、Broker listener、app-server 和 Desktop subscription 都匹配时，实时动作进入同一任务。",
      problem: "SSE 丢段、Broker RPC 超时或连接实例变化时，先 reset 并读取权威快照。",
      unavailable: "Broker/app-server 无法证明单一实例时，拒绝新的执行请求，已存在 Desktop 任务保持自身状态。"
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
      "Broker 与 app-server 原始 WebSocket 永远不监听公网。",
      "Sidecar 断线不应终止 Desktop。",
      "Browser 不直接依赖 app-server protocol types。",
      "截图不是 listener 或当前连接健康证明。"
    ],
    failures: [
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
    relation: "它是同一任务、审批、文件与安全能力共用的传输骨架；版本证据只说明这条链曾被验证，不能代替当前在线回读。"
  },
  {
    slug: "security-public-access",
    shortTitle: "安全接入",
    title: "公网手机入口怎样保护审批、文件和本机任务能力",
    searchAliases: ["Codex Remote安全吗", "公网文件操作怎么保护", "CSRF和登录限速", "为什么Codex Remote不是公网Shell"],
    teaser: "单所有者密码会话、双重限速、Secure Cookie、Origin/CSRF、幂等、DPAPI 队列和不透明文件授权共同失败关闭。",
    status: "安全包、路径、会话、Markdown 与请求守卫有源码和测试；本轮未读取真实密码、Cookie或端点",
    statusTone: "pass",
    value: "手机端可以做真正有影响的操作，但第三方网页、匿名请求和重放请求不能借用我的浏览器会话操作电脑。",
    why: "这个入口能够批准命令、修改文件和继续任务，风险远高于只读仪表盘。只有密码登录远远不够；写请求还必须证明来自当前产品页面并且没有被重复提交。",
    example: "一个外部网页诱导浏览器 POST 删除文件。即使浏览器带着登录 Cookie，请求仍因 Origin、Fetch Metadata 和 CSRF 不匹配被拒绝。",
    result: "得到单所有者、同源、短会话和显式确认共同约束的公网入口；敏感 payload 和凭据不进入日志或公开仓库。",
    readerStates: {
      pass: "登录、会话、Origin、CSRF、幂等与目标确认都匹配时，Sidecar 执行精确动作。",
      problem: "重复、过期、跨站或目标漂移请求被拒绝，并保留可安全重试的状态。",
      unavailable: "认证、会话存储或请求守卫不可用时，所有写动作失败关闭；不退化到匿名模式。"
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
      "这是单所有者产品，不提供多用户角色和租户隔离。",
      "不能抵御同一 Windows 用户下已经执行的恶意软件。",
      "反向代理或 Funnel 的安全仍需独立配置。",
      "公开网页不发布真实密码、Cookie、token、认证数据库或私有地址。"
    ],
    failures: [
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
    relation: "它包住同一任务、审批、文件和实时架构的所有公网入口；版本证据说明这些防护在哪个正式版本接受过验证。"
  },
  {
    slug: "versions-evidence",
    shortTitle: "版本与证据",
    title: "哪些事实证明产品做成过，哪些不能推成当前在线",
    searchAliases: ["Codex Remote跑通过吗", "v0.1.5测试证据", "20张真实界面", "不代表当前在线"],
    teaser: "v0.1.5 的1771项测试、六视口Chromium、历史真实多端E2E和20张界面证据分层呈现；main与release身份分开。",
    status: "v0.1.5 正式证据闭合；current main 只作为公开源码身份展示，本轮当前在线未验证",
    statusTone: "mixed",
    value: "我能清楚知道产品真正做成并跑通过什么，也不会因为一张绿图、一个历史截图或一个新提交就误判现在在线。",
    why: "源码、单元测试、合成浏览器、真实手机截图、真实 Desktop E2E 和当前在线是不同证据层。把它们合成一个‘可用’标签，会同时夸大成功和掩盖缺口。",
    example: "v0.1.5 的 1771 项测试与 Chromium 通过，证明该 release 的代码和合成 UI；2026-07/08 的真实手机验收证明产品确实跑通过；本轮没有调用 runtime，所以当前在线仍不能由前两者推出。",
    result: "得到绑定到版本、提交、日期和证据类型的结论：做成过的能力可以明确展示，当前未验证的状态也不会被包装。",
    readerStates: {
      pass: "claim 与 release/tag、测试、E2E 或图片证据精确匹配时，页面明确写出能证明的范围。",
      problem: "current main、截图时间和正式版本不一致时，分层展示，不把新源码覆盖旧 release 证据。",
      unavailable: "缺当前 runtime 验收时，仅停止当前在线声明，保留已做成产品与历史证据。"
    },
    decisionImpact: [
      "正式发布证据绑定 v0.1.5 / c3a07719。",
      "current main=94f1cfa 与 package version 单列，不冒充 release。",
      "真实截图标注日期，合成截图标注 demo。",
      "当前在线必须有本轮 runtime E2E，历史证据不能代替。"
    ],
    problem: "解决 release/main 混写、测试冒充运行、合成截图冒充实机、历史实机冒充当前在线和 commit 流水账膨胀。",
    implementation: [
      "Git refs 与 GitHub release 现场回读提供版本身份。",
      "CI workflow 分开 source check、public safety 与 Chromium E2E。",
      "Playwright SharedRuntime 明确使用合成任务，不能升级成 Desktop 实机证据。",
      "历史 acceptance 记录同一任务、审批、文件 SHA、队列、停止和重连。",
      "公开画廊为每张图写清能证明与不能证明什么，避免把合成界面或历史实机画面冒充当前在线。"
    ],
    flow: [
      "回读 PUBLIC main、tags 与 latest release。",
      "把产品 claim 绑定到精确版本和提交。",
      "读取测试文件、数量与 CI 结论。",
      "区分合成浏览器与真实多端验收。",
      "逐张检查图片来源、日期、敏感值和重复。",
      "只发布与证据层匹配的结论。",
      "未来只有本人明确要求才重新取证。"
    ],
    concepts: [
      { term: "release evidence（发布证据）", explanation: "绑定公开 tag 和精确提交的构建、测试与发布记录。" },
      { term: "synthetic runtime（合成运行时）", explanation: "浏览器测试使用的固定任务和能力，不连接真实 Desktop。" },
      { term: "real-machine E2E（实机端到端）", explanation: "真实手机、Web、Desktop 和文件/审批共同走通。" },
      { term: "current online（当前在线）", explanation: "必须由本轮当前运行时回读证明，历史证据不能代替。" }
    ],
    boundaries: [
      "不把 package=0.1.6-unreleased.0 写成已发布 v0.1.6。",
      "不把1771项测试写成当前在线证明。",
      "不把真实历史截图写成当前模型、额度或健康状态。",
      "不公开内部生命周期 bookkeeping，也不把未验证状态包装成当前结果。"
    ],
    failures: [
      { condition: "tag 与 commit 不匹配", response: "停止版本结论并重新回读 refs。" },
      { condition: "测试数来自不同提交", response: "绑定各自版本，不相加成总通过数。" },
      { condition: "截图来源或日期不清", response: "降为设计/演示或移出画廊。" },
      { condition: "当前在线没有本轮证据", response: "明确写未验证，不调用 runtime 补证。" }
    ],
    sources: [
      { path: "docs/release-notes-v0.1.5.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/release-notes-v0.1.5.md", role: "v0.1.5 产品范围与发布说明。" },
      { path: ".github/workflows/ci.yml", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/.github/workflows/ci.yml", role: "Windows source、public safety 与 Chromium 验收流程。" },
      { path: "docs/acceptance-todo.md", href: "https://github.com/wlyaaaaa/codex-local-remote/blob/main/docs/acceptance-todo.md", role: "历史真实手机/Desktop 同任务验收记录。" }
    ],
    verification: [
      "Git refs 本轮只读回读 main=94f1cfa、v0.1.5=c3a07719。",
      "v0.1.5 记录 1771 tests、370-file public scan 与 157 Playwright 场景。",
      "20张最终图片 SHA 全唯一，总原图约2.51 MiB，三段式 WebP 预览约0.30 MiB。",
      "本轮没有启动、查询或控制任何 Codex Remote runtime。"
    ],
    relation: "它为前五个模块标注证据强度与时间边界，防止把源码、测试、截图或历史实机验收误写成当前在线。"
  }
];

export const project = codexRemoteProject;
export const modules = codexRemoteModules;
