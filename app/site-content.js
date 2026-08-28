export const site = {
  name: "吴乐阳",
  title: "吴乐阳｜.agents 与 Skills",
  description:
    "吴乐阳的个人项目站：用专业人话介绍 .agents 的规则、能力路由、授权、保护策略、Skills 供应与验证方法。",
  url: "https://wly0829.cn"
};

export const primaryNav = [
  { label: "项目", href: "/" },
  { label: "Skills", href: "/skills" },
  { label: "想法", href: "/ideas" }
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/wlyaaaaa",
    icon: "github",
    ariaLabel: "在新窗口打开吴乐阳的 GitHub"
  },
  {
    label: "哔哩哔哩",
    href: "https://space.bilibili.com/179179701",
    icon: "bilibili",
    ariaLabel: "在新窗口打开吴乐阳的哔哩哔哩主页"
  },
  {
    label: "X",
    href: "https://x.com/wlyaaaaaaa",
    icon: "x",
    ariaLabel: "在新窗口打开吴乐阳的 X"
  },
  {
    label: "邮箱",
    href: "mailto:hello@wly0829.cn",
    icon: "mail",
    ariaLabel: "发送邮件至 hello@wly0829.cn",
    mail: true
  }
];

export const project = {
  slug: "agents",
  title: ".agents",
  visibility: "私有",
  eyebrow: "个人 AI 工作流的规则与能力中枢",
  summary: [
    ".agents 处理的不是某一次回答，而是个人 AI 工作如何长期保持可控。",
    "它把规则、能力选择、授权、执行责任和完成证据拆成边界清楚的模块，",
    "让不同任务可以复用同一套判断方法，又不把项目自己的业务语义拿走。"
  ],
  detailSummary: [
    ".agents 把个人 AI 工作的规则、能力选择、授权、执行责任和完成证据拆成边界清楚的模块。",
    "它提供跨任务复用的工作方法，但不拿走具体项目自己的业务语义。"
  ],
  repository: {
    label: "私有仓库",
    href: "https://github.com/wlyaaaaa/.agents",
    note: "仓库需要相应 GitHub 权限；未登录或无权限时可能显示 404。"
  }
};

export const modules = [
  {
    slug: "rules-contracts",
    title: "规则与合同内核",
    shortTitle: "规则与合同",
    teaser: "把跨项目的行为边界和专项语义放到各自唯一的事实 owner 中。",
    problem:
      "AI 很会生成，但若没有稳定的优先级和语义归属，同一个问题会随提示词、工具或上下文变化而漂移。这个模块解决的是：哪些规则真正适用，冲突时听谁的，专项语义由谁维护。",
    actions: [
      "根规则只保留跨项目都成立的优先级、授权、安全、Git 与环境边界；项目自己的业务语义仍由最近的项目规则负责。",
      "专项合同分别拥有能力路由、授权与执行 Owner、受保护策略、上下文选择和完成证据，避免多份文档同时解释同一件事。",
      "控制面目录只记录触发条件与入口元数据；模型按当前问题渐进读取，不把整套规则机械灌进每个任务。",
      "仓库体积预算与结构测试会检查重复语义、过期入口和自保型文件，完成的计划与报告退出活动树，由 Git 历史留存。"
    ],
    rationale:
      "稳定不是靠一份越来越长的总提示词，而是靠清楚的层级和唯一语义 owner。这样修改一条规则时，影响面可解释、可测试，也不会悄悄覆盖具体项目的真实约束。",
    boundaries: [
      "根规则不拥有具体项目的产品含义、启动方式或领域数据。",
      "合同不保存会变化的现场状态，也不把文档描述当成已经发生的动作。",
      "Skill、模板和清单是可选方法，不能仅凭正文中的强制措辞获得授权或升级为平台门禁。"
    ],
    sources: [
      { path: "AGENTS.md", role: "跨项目规则、优先级和硬边界入口" },
      { path: "docs/contracts/*.md", role: "专项语义的唯一合同集合" },
      { path: "config/control-plane-contract-catalog.json", role: "合同触发与入口元数据" }
    ],
    tests: [
      "Test-GlobalRulesStructure.ps1：检查根规则结构与关键指针。",
      "Test-ControlPlaneContractCatalog.ps1：检查合同目录的封闭映射与唯一性。",
      "Test-RepositoryBloatGovernance.ps1：检查活动规则的体积与重复治理。"
    ],
    relation:
      "它为其余五个模块提供共同语法：能力路由决定怎么做，授权模块决定能不能做，保护生命周期保证活动规则可信，供应模块交付窄能力，上下文与证据模块判断何时算完成。",
    ideaSlugs: ["protect-product-semantics", "design-for-real-change"]
  },
  {
    slug: "capability-routing",
    title: "能力路由与原生代理门禁",
    shortTitle: "能力路由",
    teaser: "先确认目标、风险与身份，再选择工具、模型、Skill、插件或原生代理。",
    problem:
      "工具越多，越容易把“能调用什么”误当成“现在该用什么”。这个模块解决能力选择：什么时候直接回答，什么时候读取 Skill、调用外部能力或并行委派，以及如何避免身份不明的代理扩散工作。",
    actions: [
      "以目标、风险、可逆性和预期净收益选择方法；初始工具列表不是能力上限，但缺口也不能靠猜测补齐。",
      "先读取能改变答案的元数据，再按需展开正文；浏览器、连接器、CLI 和插件按任务语义选用。",
      "原生代理路由先验证真实模型、思考等级、root/child 角色和活动合同，再作 0–10 个直属代理判断；0 是明确可选结果。",
      "出现独立支路、阻塞、重大转向、上下文压缩或槽位变化时重新判断，并按任务耦合程度选择 Luna、Terra 或 Sol 家族。"
    ],
    rationale:
      "能力选择本身就是专业判断。把身份验证放在委派之前、把并行收益和冲突风险一起考虑，可以获得真实加速，同时不让任务名、默认设置或历史印象冒充可信身份。",
    boundaries: [
      "路由模块不授予外部写入、发布或高权限动作，也不替代具体项目的目标。",
      "模型名称、标题、评分或自报不能证明运行身份；没有可信身份时只关闭委派，不阻塞普通工作。",
      "旧的经济路由器已经退出生产，不能作为失败时的隐式回退。"
    ],
    sources: [
      { path: "docs/contracts/agents.capability-routing.md", role: "能力选择、上下文读取和原生经济路由语义" },
      { path: "skills/native-economy-routing/SKILL.md", role: "把现行原生路由门禁放回任务注意力" },
      { path: "tools/*native_economy_gate.py", role: "验证身份、策略与委派参数" },
      { path: "tools/*native_economy_runtime.py", role: "门禁的版本化运行实现" }
    ],
    tests: [
      "Test-NativeEconomyRoutingGate.ps1：覆盖身份先于决策、家族与 effort 上限。",
      "test_*native_economy_gate.py：覆盖运行时输入、拒绝路径与兼容行为。",
      "Test-*NativeEconomyThreadBinding.ps1：覆盖既有根任务的耐久绑定与回读。"
    ],
    relation:
      "它从规则内核取得方法边界，再把准备执行的动作和影响范围交给授权模块；需要 Skill 时读取供应模块，最终把运行结果交给证据模块验收。",
    ideaSlugs: ["professional-judgment-with-boundaries", "context-is-attention"]
  },
  {
    slug: "authorization-owner",
    title: "授权与执行 Owner",
    shortTitle: "授权与 Owner",
    teaser: "把“允许做什么”“谁负责施工”“谁拥有事实”分成三件不同的事。",
    problem:
      "多人或多任务同时工作时，最危险的不是缺一个锁，而是把授权、施工责任和事实来源混为一谈。这个模块解决会影响外部系统的动作是否被允许、谁可以修改哪一部分，以及交付失败后责任如何连续。",
    actions: [
      "本机可逆、低风险且在范围内的编辑与测试直接推进；消息、远端修改、发布和付费等会影响外部系统的动作，需要先说清对象、内容和实际影响。",
      "同一目标内的验证、正常重试、发布、回读和 Git 收口可以连续完成；扩大目标、首次公开、付费、强制改写远端历史或不可逆迁移，必须重新确认。",
      "开始修改前，任务先登记自己负责的最小范围；追加、缩小或交接都留下可回读记录，真正写入前再确认当前仍由同一任务负责。",
      "Git 完成把业务结果和仓库收口分开；个人仓库的目标提交必须能从真正的默认分支找到，正常推送后再从远端确认。"
    ],
    rationale:
      "授权回答“用户允许什么”，执行 Owner 回答“当前由谁施工”，权威来源回答“哪个事实说了算”。分开之后，并发只需要避开真正冲突的写入，任务中断也能凭交接记录继续，而不必从头猜测。",
    boundaries: [
      "登记为整个项目的执行责任人，不会自动获得发布许可、管理员权限或私人正文读取权。",
      "管理员权限只改变进程能否执行命令，不会扩大用户交付的任务范围；私有目标也不等于可以任意写入。",
      "超时、自报完成或一段状态文字不能证明旧任务已经结束；仍有未交付工作时不能直接解除责任登记。"
    ],
    sources: [
      { path: "docs/contracts/agents.authorization-delegation.md", role: "授权、执行 Owner、Git 收口与可信目标语义" },
      { path: "tools/Invoke-ExecutionOwnerRegistry.ps1", role: "执行 scope 的 Claim、转移、授权匹配与释放" },
      { path: "config/protected-major-action-owner-adapters.json", role: "受保护 effect 的正式 owner adapter 登记" }
    ],
    tests: [
      "Test-ExecutionOwnerRegistry.ps1：覆盖 scope 重叠、CAS、transition、恢复与 Release。",
      "Test-AgentAutonomyPolicy.ps1：覆盖无需反复索权的范围内自治与真实门禁。",
      "Test-TrustedDestinationPolicy.ps1：区分目标可信度、可见性和写入授权。"
    ],
    relation:
      "能力路由产出精确的执行方法，本模块把方法绑定到授权与 Owner；受保护策略生命周期保证重大动作使用可信规则，证据模块负责最终回读。",
    ideaSlugs: ["professional-judgment-with-boundaries", "reconstructable-long-work"]
  },
  {
    slug: "protected-policy",
    title: "受保护策略生命周期",
    shortTitle: "保护策略",
    teaser: "让候选规则可以演进，同时确保生产使用的是签名、锚定、可回读的活动版本。",
    problem:
      "如果保护重大动作的规则本身能被普通工作区修改直接替换，保护就没有可信起点。这个模块解决候选规则如何进入活动状态、运行时如何验证活动版本，以及完整性异常时怎样停止受影响的重大动作并保留恢复链。",
    actions: [
      "规则先在工作区作为候选内容，经过受保护发布后才成为运行时可用的活动版本；文件较新不等于已经生效。",
      "固定状态入口一次核对规则包、签名、发布记录、执行入口和责任登记；只有整条链一致，模型才使用这个活动版本。",
      "候选等待发布不会降低当前活动版本，候选暂时不可用也不会删除既有活动能力；但两种状态都不能被用来猜测或恢复候选。",
      "真正执行重大动作前，还要重新确认目标、可见性、前置条件、回滚方式和结果回读；执行成功与现场结果缺一不可。"
    ],
    rationale:
      "把候选和活动状态彻底分开，允许规则正常演进，也让运行时有一个独立于工作树的可信答案。异常时只冻结受影响的重大动作，普通低风险工作不被误判为攻击。",
    boundaries: [
      "普通文件编辑、可回退重构、测试或候选差异不会仅因位置敏感自动变成重大动作。",
      "仓库里的清单、自签状态或截图不能证明生产已经生效；会变化的内部标识与运行记录也不适合作为长期文档内容。",
      "保护合同不拥有授权和执行 Owner 语义，只验证重大动作所需的活动策略与执行链。"
    ],
    sources: [
      { path: "docs/contracts/agents.protected-major-actions.md", role: "活动权威、完整性、发布与恢复语义" },
      { path: "config/protected-major-action-policy-candidate.json", role: "待验证的候选策略描述" },
      { path: "tools/protected_major_action_policy.py", role: "策略验证与受保护发布逻辑" }
    ],
    tests: [
      "test_protected_major_action_policy.py：覆盖候选、活动完整性、发布与失败关闭。",
      "Test-ProtectedPolicyFastPublish.ps1：覆盖正式发布与回读的快速路径。",
      "Test-FourBaseProtectedAuthorityRouting.ps1：覆盖受保护权威入口与合同路由。"
    ],
    relation:
      "规则内核定义哪些语义需要保护，授权模块提供精确目标与执行许可，本模块保证重大动作使用的确实是已生效规则；完成证据模块再独立确认产品结果。",
    ideaSlugs: ["verification-can-refute", "protect-product-semantics"]
  },
  {
    slug: "skills-plugins",
    title: "Personal Skills / Plugins 供应",
    shortTitle: "Skills / Plugins",
    teaser: "用窄入口交付反复需要的能力，并把源码、安装态和运行态分别验证。",
    problem:
      "当专项方法散落在提示词和个人目录中，能力会重复、失效或悄悄漂移。这个模块解决哪些 Skill/Plugin 是现行供应、源码在哪里、怎样安装到发现目录，以及如何证明新任务真的能看到它。",
    actions: [
      "唯一供应清单记录权威源码、类型、是否安装和退役项；运行环境的发现目录只负责暴露能力，不承担源码事实。",
      "事务安装器先验证目标、来源和已有占用，再切换并回读，避免普通复制形成多个真相。",
      "Skill 只描述精确触发条件和安全入口；Plugin 可以把 Skills、工具服务与 App 组合在一起，但不会因此获得额外权限。",
      "验证明确区分源码是否正确、是否安装、当前任务能否看见、全新任务能否使用和真实端到端结果；一层通过不能替代另一层。"
    ],
    rationale:
      "重复需求值得一个可发现、可维护的窄入口；一次性需求不值得制造长期 Skill。把权威源码与发现目录分开，可保持安装简单，同时让升级与回滚仍有唯一依据。",
    boundaries: [
      "Skills 不是项目，也不与 .agents 强制归属；本网站的 Skills 目录只是现行供应的只读介绍。",
      "Skill 是建议性方法，不能制造授权、提权或人类确认；插件账号也不会扩展用户原本没有的权限。",
      "已有能力入口只缺一小段功能时，优先修复原路线，不以重装公共插件或静默切换账号代替。"
    ],
    sources: [
      { path: "config/personal-skill-supply.json", role: "Personal Skill 供应的唯一清单" },
      { path: "skills/*/SKILL.md", role: "个人 Skill 的触发与边界入口" },
      { path: "plugins/*", role: "由多个能力组成的本地插件源码" }
    ],
    tests: [
      "Test-PersonalSkillSupply.ps1：核对供应清单、canonical source 与 discovery。",
      "Test-PersonalSkillJunctionInstaller.ps1：覆盖事务安装、回读和冲突拒绝。",
      "Test-PersonalSkillSemanticCuration.ps1：检查触发描述是否窄而清楚。"
    ],
    relation:
      "能力路由在真实需求出现时选择 Skill 或 Plugin；规则内核限制它们不能自己扩大权限，授权模块控制外部影响，上下文与证据模块检查全新任务是否真正可用。",
    ideaSlugs: ["context-is-attention", "design-for-real-change"]
  },
  {
    slug: "context-evidence",
    title: "上下文、健康与完成证据",
    shortTitle: "上下文与证据",
    teaser: "只读取会改变答案的上下文，并用彼此独立的证据层判断是否真的完成。",
    problem:
      "长任务容易在压缩、交接或外部状态变化后丢掉关键决定；同时，测试通过、部署成功和用户真的能用常被混成同一个“完成”。这个模块解决需要读多少上下文、怎样恢复任务，以及什么证据足以支持完成结论。",
    actions: [
      "上下文按问题渐进获取：先读项目规则与最小元数据，只有事实会改变决策时才进入相应权威来源，不做周期性全量扫描。",
      "复杂或长程工作把目标、硬边界、关键决定、当前实现和验证状态保存在正确项目产物或宿主持久任务状态中，便于压缩后重建。",
      "证据检查区分源码、测试、安装、发布、全新任务、端到端结果和用户可见验收；每层说明观察时间、来源与真实缺口。",
      "完成时既检查产品路径，也检查 Git 和外部发布回读；证据缺失或过期就明确写成未知或受阻，不用内部回执补成绿色。"
    ],
    rationale:
      "上下文的价值来自注意力分配，不来自体积。独立证据层让结论可以被推翻：如果公开页面打不开，部署日志再漂亮也不能证明产品完成；如果任务能重建，长时间工作也不必依赖一段无限增长的对话。",
    boundaries: [
      "不建立跨领域个人数据中心、统一画像或后台全量同步；专项私有问题留在独立、按需的能力中。",
      "没有某层证据不等于失败，但也不能写成已经通过；历史记录不能冒充当前现场。",
      "健康检查只回答证据是否足够，不拥有产品语义，也不能替代用户可见的自然语言路径验收。"
    ],
    sources: [
      { path: "docs/contracts/agents.evidence-health.md", role: "证据来源、新鲜度与健康判断" },
      { path: "docs/contracts/agents.verification-closeout.md", role: "完成、残留与收口语义" },
      { path: "docs/contracts/agents.four-base-decision-context.md", role: "按事件与风险读取控制面上下文" }
    ],
    tests: [
      "Test-FourBaseDecisionContext.ps1：覆盖按需上下文、空正文和触发边界。",
      "Test-ControlPlaneDoctorScope.ps1：检查健康诊断只进入明确 scope。",
      "Test-AllTestsRunner.ps1：确保测试运行器报告真实失败而非只看进程结束。"
    ],
    relation:
      "它为所有模块提供终点判断：规则是否是当前的、能力是否真的可用、Owner 是否已收口、保护发布是否有现场回读，以及产品是否通过真实入口被使用。",
    ideaSlugs: ["verification-can-refute", "reconstructable-long-work"]
  }
];

export const ideas = [
  {
    slug: "result-before-process",
    title: "结果优先于过程",
    summary: "内部动作只有在改变了真实使用结果、风险或可恢复性时，才值得占据主答案。",
    definition: "先说明用户现在能做什么、哪里仍不能做、是否需要行动，再提供会改变判断的实施信息。测试、脚本、回执和工作量是证据，不是产品本身。",
    problem: "技术任务很容易把“做了很多步骤”写成完成。用户真正关心的是功能是否可用、是否已经生效、失败能否恢复，以及还需要自己做什么。",
    use: [
      "交付网站时先报告可访问页面和真实路由，再报告构建与提交。",
      "修复故障时验证原始用户路径，而不是只重启服务或只跑单元测试。",
      "状态汇报把本地完成、发布完成、公开回读和用户动作明确分开。"
    ],
    basis: "过程可以反复变化，结果是用户持续判断价值的坐标。把证据放在结果之后，不会降低严谨度，反而能暴露“内部看似通过、产品实际未完成”的落差。",
    boundary: "不省略会改变风险、恢复或执行判断的技术事实；当用户需要审计时，仍可展开完整证据链。",
    relatedModules: ["context-evidence", "authorization-owner"]
  },
  {
    slug: "verification-can-refute",
    title: "验证要能推翻结论",
    summary: "好的验证不是寻找一个“通过”标记，而是主动检查哪些事实会证明当前判断错误。",
    definition: "先写清成功结论，再选择能够使它失败的观察：真实入口、反例、边界条件、独立回读和新鲜现场。验证如果无论发生什么都只会通过，就没有信息价值。",
    problem: "源码存在、测试通过、构建成功、部署完成和用户可访问是不同层。只选最容易通过的一层，会让结论在最重要的现实路径上失真。",
    use: [
      "发布后从正式域名直接打开每条路由，而不是只看平台部署状态。",
      "修复回归时复现原始失败输入，并保留能再次触发问题的测试。",
      "面对历史事实时重新读取当前现场，允许新证据否定旧结论。"
    ],
    basis: "可证伪验证迫使结论与真实世界连接，也让不确定性保持诚实。独立证据层不是增加流程，而是减少错误完成，让下一步修正有明确起点。",
    boundary: "验证成本应与风险成比例；低风险小改不需要穷尽所有可能，但关键结论必须至少有一条真正能推翻它的路径。",
    relatedModules: ["context-evidence", "protected-policy"]
  },
  {
    slug: "context-is-attention",
    title: "上下文价值在注意力，不在体积",
    summary: "多读并不自动更准确；真正重要的是把有限注意力留给会改变答案的证据。",
    definition: "从目标和硬边界开始，先读最小权威入口，再按风险与问题逐层展开。无关历史、整库正文和重复合同即使“可能有用”，也会稀释当前判断。",
    problem: "长上下文容易产生一种虚假的充分感：模型见过很多信息，却未必抓住当前 owner、最新状态和关键冲突，真正相关的事实反而被噪声淹没。",
    use: [
      "项目实施先读最近的项目规则，不周期性扫描所有控制面。",
      "Skill 只在触发条件成立时展开完整正文。",
      "上下文压缩后恢复目标、硬边界和关键决定，而不是从头重放全部过程。"
    ],
    basis: "注意力是推理资源。渐进披露既减少噪声，也让每次扩展都有明确理由，便于审计为什么这份材料会改变决策，并让关键冲突更早浮现。",
    boundary: "不能把“少读”当成逃避权威或省略关键证据；只要一项事实可能改变授权、风险或结果，就应进入当前注意力。",
    relatedModules: ["capability-routing", "context-evidence", "skills-plugins"]
  },
  {
    slug: "professional-judgment-with-boundaries",
    title: "AI 承担专业判断，但服从目标和硬边界",
    summary: "自治意味着主动完成安全范围内的判断和施工，不意味着替用户扩大目标。",
    definition: "AI 根据目标、风险、可逆性和预期收益选择方案，完成无需用户决定的安全修复；遇到账号、付费、公开、不可逆或真实范围变化时，把精确决定交回用户。",
    problem: "过度索权会把可完成的小事不断推回用户，过度自治又会越过目标和授权。两者都来自没有区分专业判断与所有者决定。",
    use: [
      "在已授权网站项目内自主实现、测试、提交、正常推送和回读。",
      "依赖选择与可回退修复由 AI 完成；首次公开或付费保持精确门禁。",
      "发现用户陈述与现场事实冲突时，先给证据与影响，不用无依据顺从掩盖冲突。"
    ],
    basis: "专业服务的价值在于减少不必要的协调，同时保护真正只有 owner 能决定的边界。授权应精确，但不应被拆成无穷确认。",
    boundary: "系统、平台和用户明确硬边界始终优先；可逆性也不能自动产生授权，事实不确定时不能冒充完成。",
    relatedModules: ["authorization-owner", "capability-routing"]
  },
  {
    slug: "reconstructable-long-work",
    title: "长任务应可重建",
    summary: "任务不能只活在一段不断增长的对话里；关键状态应能从正确 owner 和项目产物恢复。",
    definition: "当工作跨越较长时间、上下文压缩或交接风险上升时，保存目标、硬边界、关键决定、当前实现、验证状态和真实残留，使新一轮可以从现场继续。",
    problem: "仅依赖聊天记忆会造成重复施工、边界丢失和错误释放 Owner。另一方面，为每个小任务建立庞大状态机同样浪费。",
    use: [
      "复杂实现用短设计文档记录产品目标和不做什么。",
      "中断任务用 checkpoint 说明已修改内容、最后证据和下一步。",
      "Owner 转移时连同残留义务原子交接，不把一条“继续做”消息当成完成。"
    ],
    basis: "可重建性把连续性从模型记忆转移到可核验事实，也使压缩和分工成为正常事件，而不是重启项目；后续执行者可以据此验证自己是否仍在同一目标上。",
    boundary: "简单、短期、可逆工作不机械创建文档；耐久状态只保存会影响后续判断的内容，不复制私密正文或动态噪声。",
    relatedModules: ["context-evidence", "authorization-owner"]
  },
  {
    slug: "protect-product-semantics",
    title: "保护产品语义，而非文件形态",
    summary: "应当稳定的是用户依赖的行为、边界和恢复能力，不是某个文件、状态机或测试的永久存在。",
    definition: "重构可以替换文件和实现，只要真实产品目标、既定语义、必要安全、兼容与恢复结果保持。任何复杂结构都要由当前行为或技术边界证明价值。",
    problem: "系统容易把现有实现误当成需求，导致旧文件靠自我引用永久存活；反过来，盲目删减也会破坏用户真正依赖的行为。",
    use: [
      "完成的计划和复盘退出活动树，由版本历史保留。",
      "合并重复合同前先证明唯一 owner 和产品语义没有丢失。",
      "重写 UI 时保留真实路由、可访问性和发布链，而不保留旧组件形状。"
    ],
    basis: "文件是实现手段，产品语义才是长期契约。围绕行为验收，既能削减仓库膨胀，也能避免“更小”成为破坏功能的借口。",
    boundary: "安全、恢复、兼容或复现所需的技术结构仍可保留，但必须说明真实 consumer 与退出条件。",
    relatedModules: ["rules-contracts", "protected-policy"]
  },
  {
    slug: "design-for-real-change",
    title: "只为真实变化设计",
    summary: "抽象应服务已出现或高可信的变化轴，不为想象中的未来搭建框架。",
    definition: "只有实际重复、稳定变化点、外部服务差异或明确责任边界能降低总变更成本时，才建立适配层和复用结构。其他情况下保持直接实现。",
    problem: "面向假想扩展的架构会增加文件、配置和测试，却没有现实 consumer；真正变化到来时，它往往还需要重写。",
    use: [
      "未来模型或服务差异用窄适配器隔离，不建立全能平台。",
      "网站只有一个项目时只展示一个项目，不制造占位数据验证网格。",
      "Skill 只为反复出现的窄需求创建，一次性方法留在当前任务。"
    ],
    basis: "直接实现保留更高的信息密度。真实变化出现后再抽象，能用已知差异设计接口，也更容易验证抽象是否真的减少成本。",
    boundary: "可预见且代价巨大的外部硬约束仍应提前隔离；原则反对的是无 consumer 的复杂度，不是合理的兼容与恢复设计。",
    relatedModules: ["rules-contracts", "skills-plugins"]
  }
];

export const skills = [
  ["authorization-file-broker", "为已明确选定的文件或目录提供高权限加密、解密、校验与恢复入口。", "把批量私密文件操作绑定到精确目标、正式授权和可恢复步骤，避免普通文件工具承接最高权限动作。", "仅在用户明确要求 Password Center 处理选定文件、验证结果、续跑或恢复时使用。", "这类动作的授权和失败恢复明显不同于普通文件编辑，需要独立的安全路径。", "不接受模糊全盘范围，不输出原始密钥，也不会因为拥有管理员 token 自动扩大任务。"],
  ["chinese-asr", "处理中文与微信录音转写、时间戳、说话人分离和重要录音审计。", "把普通转写、重要录音、多人语音和云端升级条件放在同一条可核验路径中。", "出现中文录音、说话人数、逐段时间、本人归属或 ChineseASR 故障时使用。", "录音识别不仅是生成文本，还要保留不确定性、来源和回听定位。", "不凭声音猜测陌生人身份，不扩大扫描媒体库；云端处理保持明确授权。"],
  ["media-person-self", "判断用户是否出现在一张点名照片或很短的图片列表中。", "用可逆的 person:self 模板完成有界本人匹配，保留不确定结果。", "用户明确点名一张或少量照片，并询问自己是否在其中时使用。", "本人匹配需要比普通图像描述更严格的范围和隐私边界。", "不识别他人、不做批量相册整理，也不替代 OCR 或一般视觉理解。"],
  ["native-economy-routing", "在可信运行身份成立后，判断当前任务是否值得使用 0–10 个原生代理。", "根据任务耦合、验证方式、风险与并行净收益选择代理家族和思考等级。", "任务开始、出现独立支路、阻塞、重大转向、上下文压缩或槽位变化时重新判断。", "委派需要真实身份与任务语义，不能从标题、默认设置或模型自报推断。", "不制造委派授权，不保证一定派代理；身份缺失时只关闭委派。"],
  ["file-intake-router", "为混合、未知或成批输入选择合适的原生读取路线。", "识别附件、文件夹、压缩包和扫描类型，再把已知格式交给对应读取器。", "输入类型混杂、范围不清或需要先盘点归类时使用。", "先路由能避免用一个通用解析器处理所有格式，也减少不必要的全文读取。", "单个已知文件类型直接使用原生读取器，不经过这层。"],
  ["google-workspace-direct", "通过固定连接入口读取或精确操作 Gmail、Drive 与 Calendar。", "让 Google Workspace 请求复用同一账号与能力边界，并支持原生 Docs 导出。", "任务需要当前 Google 邮件、云端文件、文档或日历事实时使用。", "连接能力和账号状态会变化，需要窄入口先确认当前实际支持的动作。", "默认只读；只有入口真实支持且用户授权的精确写入才执行。"],
  ["local-secret-broker", "管理凭据中心托管的密码、密钥、访问令牌、登录和其他凭据。", "用受管引用完成查找、注入、备份、恢复、更新与退役，尽量不把明文交给模型或日志。", "任务确实需要凭据的库存、注入、恢复或生命周期操作时使用。", "凭据操作的最安全路径通常是盲填和引用，而不是复制明文。", "普通任务不展示明文；查看单项明文需要用户明确请求和最高权限验证。"],
  ["localocr", "处理批量或精确 OCR、扫描 PDF、表格、公式、坐标与印章。", "优先在本地保留版面与坐标，必要时再用原生视觉交叉判断识别失败。", "扫描件、复杂排版、批量图片或 LocalOCR 故障需要可复验读取时使用。", "OCR 的“没读出来”和“没有文字”不是同一结论，复杂文档还需要版面证据。", "一两张普通截图由原生视觉直接读取，不为简单输入启动批处理。"],
  ["llm-backend-toolkit", "在原生代理之外，为封闭、独立可验的任务调用登记的模型后端。", "提供可追踪 run id、状态与续跑能力，用于确有净收益的独立后端工作。", "任务能严格验证、允许较慢执行，且实时 registry 后端优于原生委派时使用。", "第三方或本地模型需要独立身份、运行记录和连续性，不应伪装成原生代理。", "不用于普通委派或模型选择，也不作为原生代理失败后的无条件 fallback。"],
  ["personal-health", "回答用户自己的健康、药物、检查、睡眠、活动与目标问题。", "从当前健康项目和必要的新报告中取得会改变答案的个人上下文。", "问题明确与用户本人健康有关，或需要纳入新报告、修正和设备刷新时使用。", "个人健康建议依赖最新原始证据和个体背景，不能从通用知识或旧画像推断。", "不用于与用户无关的一般健康问题，不把私密健康正文带入其他项目。"],
  ["personal-materials", "在原件路径未知或既有定位失效时，寻找少量可验证的私人非媒体原件。", "跨已获准位置返回少数候选，并核对文件身份与路径。", "用户要找具体原件，但路径未知、跨位置或 owner locator 失败时使用。", "寻找原件需要范围控制与候选验证，不能扩展成中央私人资料库。", "不处理媒体、不回答一般领域问题；已有可靠定位器时直接使用。"],
  ["project-entry-gate", "在 Git 决策前核对仓库身份、可见性、远端、分支、worktree 与同步事实。", "从 Git owner 取得会改变提交、恢复或发布路径的结构化事实。", "仓库身份、公开范围、远端、默认分支、同步、恢复或发布状态会影响决策时使用。", "目录名和当前 checkout 不能证明仓库身份，更不能证明远端与公开状态。", "准入记录是证据，不是写入或发布授权；普通可逆编辑不需要机械门禁。"],
  ["wechat-direct", "读取本地微信主/副库的点名消息、回复上下文和媒体。", "围绕一个明确联系人、群聊、朋友圈缓存或保存包完成有界读取与归档。", "用户明确点名微信对象、时间段或保存目标时使用。", "聊天上下文应当按对象与任务读取，不需要整账号同步或中央画像。", "不做全账号扫描，不猜联系人身份，不把私聊内容公开或跨领域复用。"],
  ["vault-workflow", "处理 vault-tool 加密、验证、私密发布、恢复和 Key profile。", "把 vault、keyfile、本地密码提示与恢复链放入一致的高权限工作流。", "任务明确涉及 vault 加密文件、VAULT03 或 Key profile 时使用。", "加密工件需要内容保真、密钥边界和回读证明，不能用普通文件复制代替。", "原始秘密不进入聊天、stdout 或普通文件；公开目标必须另过暴露门禁。"],
  ["md-to-pdf", "在 Windows 上把 Markdown 稳定转换为 PDF。", "通过本地 Edge、中文路径支持和可选 CSS/演示 profile 生成确定页数的 PDF。", "需要从 Markdown 交付或复现 PDF，而不依赖 Typora 时使用。", "打印引擎、字体和路径编码都会影响 PDF，需要固定的本地路线。", "只负责转换；内容结构和最终视觉验收仍由文档任务决定。"],
  ["pdf-render-safe", "在 Windows 上安全渲染并目视验证 PDF。", "使用 Poppler、高 DPI 页面、联系表和指纹避免中文路径与陈旧输出误判。", "PDF 布局、页数、印章、字体或输出新鲜度需要视觉确认时使用。", "文本提取和文件存在都不能证明页面实际可读，旧截图也可能混入新验收。", "渲染不会自动证明内容正确；仍需按任务检查版式与语义。"],
  ["control-plane-doctor", "对 .agents 及其协作控制面执行明确范围的健康、漂移、迁移和恢复检查。", "按用户点名的范围运行结构化验收，并把不同权威来源之间的差异说清。", "用户明确要求控制面健康、漂移、恢复或跨仓库验收时使用。", "这类检查跨越多个事实来源，需要严格限制读取范围与结论来源。", "不做周期性全扫，不接管业务项目，也不因一处异常自动修改其他控制面。"],
  ["mojibake-doctor", "诊断和修复中文乱码、编码混淆、BOM 损坏与双重转码。", "保留原始字节和可逆候选，判断 UTF-8、GBK、GB18030、U+FFFD 与 PUA 问题。", "文本出现乱码、替换字符、私用区字符或编码往返异常时使用。", "乱码修复如果直接覆盖原文，最容易把可恢复字节变成永久损失。", "没有字节证据时保留不确定性；不把猜测结果批量写回原文件。"],
  ["tailscale-safe-exposure", "处理仅限 Tailscale 的 Serve、Funnel、防火墙、反向端口与串流路由。", "确认 loopback 服务如何只向 tailnet 暴露，并核对 Sunshine / Moonlight 路径。", "问题明确涉及 Tailscale-only 暴露、peer 访问或相关串流路由时使用。", "私有 tailnet、局域网和公开互联网是不同边界，配置不能混用。", "不用于普通 Wi‑Fi、LAN、VPN 或公网网络问题；公开 Funnel 需要独立授权。"],
  ["token-budget-advisor", "在用户明确要求时，计算可见文本或文件的 token 并比较数值预算。", "围绕具体上下文或成本上限提供可复验的计数和取舍。", "用户明确提出 token 数量、提示大小比较或数值限制决策时使用。", "实际计数应由相应 tokenizer 或权威遥测给出，不能从任务长度凭感觉估算。", "不因任务很长自动触发，也不用估算覆盖已经完成运行的真实遥测。"]
].map(([slug, summary, purpose, trigger, why, boundary]) => ({
  slug,
  title: slug,
  summary,
  purpose,
  trigger,
  why,
  boundary
}));

export const routePaths = [
  "/",
  "/projects/agents",
  ...modules.map((item) => `/projects/agents/${item.slug}`),
  "/ideas",
  ...ideas.map((item) => `/ideas/${item.slug}`),
  "/skills",
  ...skills.map((item) => `/skills/${item.slug}`)
];

export function normalizePath(pathname = "/") {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "") || "/";
}

export function routeMeta(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return { title: "项目｜吴乐阳", description: "吴乐阳的项目入口：从 .agents 理解个人 AI 工作流的规则、能力、授权与验证。" };
  if (path === "/projects/agents") return { title: ".agents 项目总览｜吴乐阳", description: ".agents 的六个模块、公开边界、源码入口与验证方法。" };
  if (path.startsWith("/projects/agents/")) {
    const module = modules.find((item) => path.endsWith(`/${item.slug}`));
    if (module) return { title: `${module.title}｜.agents｜吴乐阳`, description: module.problem };
  }
  if (path === "/ideas") return { title: "想法｜吴乐阳", description: "关于 AI 工作、验证、上下文、长期任务和可演进设计的公开想法。" };
  if (path.startsWith("/ideas/")) {
    const idea = ideas.find((item) => path.endsWith(`/${item.slug}`));
    if (idea) return { title: `${idea.title}｜想法｜吴乐阳`, description: idea.summary };
  }
  if (path === "/skills") return { title: "Skills｜吴乐阳", description: "个人 Skills 的只读目录、用途、触发方式与边界。" };
  if (path.startsWith("/skills/")) {
    const skill = skills.find((item) => path.endsWith(`/${item.slug}`));
    if (skill) return { title: `${skill.title}｜Skills｜吴乐阳`, description: skill.summary };
  }
  return { title: "页面不存在｜吴乐阳", description: "这个地址没有对应页面。" };
}
