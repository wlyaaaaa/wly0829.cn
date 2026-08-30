export const cacbProject = {
  order: 7,
  slug: "cacb",
  title: "CACB Agent 能力基准",
  route: "/projects/cacb",
  visibility: "私有仓库",
  statusTone: "mixed",
  repositoryNote: "源码位于 PRIVATE（私有）仓库，因此本页不提供仓库跳转。这里策展展示已经做成的评测产品、公开安全的架构与当前验证边界；私有任务样本、隐藏答案、原始执行记录、机器快照和任何受测配置比较结果都不进入网页。",
  summary: "CACB 是一套可复现的 Agent 能力评测产品：它把真实工程任务整理成冻结的问题库，为每次执行创建独立 workspace（工作区），绑定任务与执行身份，用不依赖参与者自述的 verifier（验证器）检查产物，再把成功、能力问题、执行环境问题和证据不足分开记录。",
  why: "一次任务看似完成，可能只是写了总结、留下半成品、借用了旧文件，或因执行环境失败而没有真正接受检验。CACB 把任务、输入、workspace、终态、产物和验证证据锁在同一条链上，避免把“回答得像完成”误当成真实能力。",
  plainExample: "例如我要检查一套新的 Agent 执行配置能否完成长程工程任务。CACB 先复制同一份冻结任务到独立 workspace，执行期间不泄露隐藏答案；结束后由固定验证器重放测试、核对文件范围和终态。如果只是基础设施中断，它不会把结果写成能力失败。",
  result: "我得到一套可复用产品：问题库、任务模板、隔离 workspace、身份和输入绑定、确定性验证、失败分类、证据归档与报告发布边界。网页只解释这套产品，不发布受测配置结果。",
  readerStates: {
    pass: "任务身份、冻结输入、独立 workspace、终态、产物和验证器全部匹配时，生成可追溯的能力证据包。",
    problem: "产物错误、越界修改、未完成或验证失败时，保留具体失败平面，不用一个总标签吞掉原因。",
    unavailable: "身份、workspace、终态或验证输入缺失时只保留证据不足状态，等待同一执行恢复或重新取得完整证据。"
  },
  heroFacts: [
    { label: "成品范围", value: "47 个 Python 核心模块、25 个 schema（数据合同）、59 个测试文件与 6 份报告/模板文件；网页只取经筛选的框架事实" },
    { label: "问题库结构", value: "当前核心使用 10 个连续案例组成一次完整 episode（评测回合），覆盖实现、诊断、连续性、证据和恢复" },
    { label: "隔离与验证", value: "每次执行独立 workspace；冻结输入、隐藏 verifier、范围审计、终态与归档 hash 分层绑定" },
    { label: "当前源码", value: "PRIVATE main=e6f7581d7d119b94b4df508df2d51c972cd9b73f；工作树干净，远端引用 0/0" },
    { label: "当前回归", value: "与公开产品结构直接相关的 11 个测试文件共 162 项全部通过；完整 928 项集合当前并非全绿" },
    { label: "展示与更新", value: "页面不展示受测配置名单或比较结果；manual_owner_only，仅在本人明确要求时更新，不存在 Skill/Source 自动刷新" }
  ],
  responsibilities: [
    "把现实工程能力拆成可冻结、可复现、可验证的问题库与案例合同",
    "为每次执行创建唯一 workspace，并把任务输入、执行身份和允许范围绑定到同一证据链",
    "用确定性 verifier 检查真实文件、行为、测试和终态，而不是相信参与者的完成声明",
    "把能力问题、任务问题、执行环境问题和证据不足分开，避免错误归因",
    "保存可重放的 manifest、receipt、hash 和归档，使结果能被独立复核",
    "用 schema 约束证据包和报告结构，避免不同执行路线各写一套口径",
    "为新增执行方式提供 onboarding（接入验收），但不自动替用户做选择"
  ],
  exclusions: [
    "本公开页不展示受测配置名单、比较结果、数字结论或先后顺序",
    "不公开私有任务变体、隐藏答案、原始执行记录、系统提示或机器快照",
    "不把速度、消耗或工具次数当成正确性的替代品",
    "不因一次执行成功或失败就宣称长期稳定能力",
    "不自动改写全局能力路由、授权、安全边界或项目 Owner 决策",
    "不作为后台服务、自动测试队列、定时任务或持续同步系统",
    "不因 Source、规则、Skill 或报告变化自动刷新网页"
  ],
  glossary: [
    { term: "Benchmark（能力基准）", meaning: "用冻结任务和统一验证方法产生可复核证据；不是宣传性榜单。" },
    { term: "question bank（问题库）", meaning: "定义任务目标、可见输入、允许行为、验收属性和隐藏检查的一组版本化案例。" },
    { term: "episode（评测回合）", meaning: "在同一连续执行中按固定顺序完成整组案例，用来观察长程连续性。" },
    { term: "workspace（工作区）", meaning: "一次执行唯一的隔离目录；参与者只能在这里产生候选产物。" },
    { term: "fixture（固定测试材料）", meaning: "每个执行配置收到字节一致的公开输入，避免任务内容漂移。" },
    { term: "holdout（隐藏验证材料）", meaning: "参与者不可见、只由验证器消费的检查数据，防止针对答案硬编码。" },
    { term: "verifier（验证器）", meaning: "在参与者之外运行的确定性检查器，核对产物、范围、行为和终态。" },
    { term: "manifest（清单）", meaning: "记录任务、版本、workspace、文件 hash 和执行约束的机器可读合同。" },
    { term: "receipt（回执）", meaning: "证明某个动作、身份或终态真实发生，并绑定到本次执行。" },
    { term: "fail-closed（失败关闭）", meaning: "证据不完整或身份不匹配时不生成能力结论，不靠猜测补齐。" },
    { term: "contamination（污染）", meaning: "任务或隐藏验证内容被参与者事先看见，导致结果失去解释力。" },
    { term: "manual snapshot（人工快照）", meaning: "只有本人明确要求时才重新取证、判断和发布的页面状态。" }
  ],
  currentState: {
    observedAt: "2026-08-30T06:40:00Z",
    label: "评测产品框架与核心公开结构回归通过；完整私有执行链仍有跨代合同未闭合，本页不发布受测结果",
    facts: [
      "Git Owner 回读 PRIVATE main=e6f7581d7d119b94b4df508df2d51c972cd9b73f，工作树干净，本地与远端引用 0/0。",
      "当前源树包含 233 个跟踪文件，其中 47 个 Python 核心模块、25 个 schema、59 个 test_*.py 测试文件，以及 6 份报告/模板文件；数量不代表这些文件可原样公开。",
      "问题库、campaign（评测活动）、workspace 隔离、worker contract（执行合同）、fast flow（快速准备/验收）、接入验收、公开案例、归档和报告 schema 的 11 个核心测试文件共 162 项，本轮全部通过。",
      "完整测试共收集 928 项，但当前不是全绿；失败集中在跨代冻结标识、原生身份 envelope、外部执行 adapter 和部分报告不变量，不能被核心 162 项覆盖。",
      "PRIVATE 源保留冻结任务、私有验证与原始证据；网页只消费经逐项筛选的框架事实、提交、数量、验证范围和明确缺口，不复制受测配置或结果。",
      "本页由本人本轮明确要求创建；今后 Source、规则、Skill、提交或测试变化都不会自动创建网站任务。"
    ],
    gaps: [
      "完整 928 项测试集合当前没有闭合，因此不能把所有历史执行路线描述为当前可验证。",
      "本轮没有启动新的受测执行、没有调用云端接口、没有运行本地重型推理，也没有生成新的受测结果。",
      "私有 holdout、原始执行记录和隐藏失败正文不会进入网页，公开读者无法从本页复算私有结果。",
      "单次执行即使验证通过，也只证明精确任务、精确配置和精确版本，不证明普遍能力。",
      "manual_owner_only 意味着页面可能长期保持同一快照；只有本人明确要求时才复核。"
    ]
  },
  operatingFlow: [
    { title: "定义能力问题", detail: "先把现实需求写成可以验收的任务家族，说明什么是完整结果、允许什么、禁止什么。" },
    { title: "冻结任务与验证材料", detail: "固定可见 fixture、案例顺序、schema、隐藏 verifier 和版本 hash；执行开始后不原地改题。" },
    { title: "创建唯一 workspace", detail: "每个执行配置取得独立目录；任务 cwd 必须覆盖所有输出，路径越界或共享写入失败关闭。" },
    { title: "绑定身份、输入与范围", detail: "用 host（宿主）证据绑定实际执行身份、任务 capsule、workspace 和允许工具，不能靠参与者自报。" },
    { title: "执行连续 episode", detail: "同一任务按固定顺序完成整组案例，保留恢复、压缩和终态证据，不合并不同尝试的半成品。" },
    { title: "运行确定性验证", detail: "验证器在参与者之外重放测试、检查文件和范围；隐藏材料不进入候选进程。" },
    { title: "分类失败平面", detail: "分别记录能力、任务、执行环境和证据问题；证据不足保持 Unknown（未验证）。" },
    { title: "归档并生成可公开说明", detail: "先把产物、trace、receipt 和 hash 收入项目归档，再从中筛选不含私有样本与受测比较结果的结构化说明。" }
  ],
  components: [
    { name: "Question bank（问题库）", responsibility: "拥有案例、任务家族、可见输入、隐藏检查和版本边界。", implementation: "JSON 合同 + Python 生成/加载器；任务改变进入新版本，不回写旧证据。" },
    { name: "Campaign freezer（评测冻结器）", responsibility: "把问题库、episode、seed、fixture 和 verifier 固定成一次不可漂移的 campaign。", implementation: "manifest 与逐文件 hash 共同定义输入身份。" },
    { name: "Workspace manager（工作区管理）", responsibility: "创建、验证、归档每次执行的唯一目录。", implementation: "检查 cwd 祖先关系、任务 capsule、路径范围和归档完整性。" },
    { name: "Worker contract（执行合同）", responsibility: "定义参与者可见任务、允许工具、终态和产物要求。", implementation: "单一连续 episode；缺案例、pending 或 interrupted 不形成完整结果。" },
    { name: "Identity & evidence binding（身份与证据绑定）", responsibility: "把实际执行身份、任务、workspace、动作和终态绑定到同一回执。", implementation: "host receipt、manifest hash 与单次消费规则防止跨执行借证。" },
    { name: "Deterministic verifier（确定性验证器）", responsibility: "检查候选文件、隐藏属性、测试和范围变化。", implementation: "验证器独立进程、硬超时、隐藏材料隔离和结果 hash。" },
    { name: "Failure classifier（失败分类器）", responsibility: "区分能力、任务、执行环境与证据问题。", implementation: "不把 timeout、missing evidence、invalid harness 或未完成统一写成失败。" },
    { name: "Schema & report layer（数据合同与报告层）", responsibility: "把证据包、案例、归档和说明约束成可重放格式。", implementation: "25 个 schema 与报告模板；网页只消费经筛选的框架事实，私有 payload、受测配置与结果不进入网页。" },
    { name: "Fast model flow（快速接入流）", responsibility: "为新执行配置准备 workspace、完成门和盲化审阅包。", implementation: "准备、完成检查、证据包与代表选择分开，不由参与者 final answer 直接放行。" }
  ],
  usageExamples: [
    { ask: "给一套新 Agent 执行方式做可复现验收", effect: "生成同一问题库的独立 workspace 和输入 manifest，完成后由固定 verifier 检查真实产物。" },
    { ask: "为什么任务回答完成了却没有结果", effect: "检查所有案例终态、workspace 和验证回执；缺失或 interrupted 保持不完整，而不是相信总结。" },
    { ask: "这次失败是能力问题还是执行环境问题", effect: "把产物错误、任务缺陷、身份/权限/工具问题和证据缺失分到不同 failure plane（失败平面）。" },
    { ask: "换一个执行外壳能否沿用同一套验证", effect: "先做 capability map（能力映射）和代表 dry-run（预演），只有同一 verifier 能读取产物时才接入。" },
    { ask: "怎样防止旧执行记录污染新结果", effect: "新 run 使用新 workspace、manifest、nonce 和归档；旧 evidence 不能跨 binding（绑定）复用。" },
    { ask: "怎样保留失败样本供以后诊断", effect: "终态后先归档代码、trace、回执与失败原因并校验 hash，再释放临时 workspace。" },
    { ask: "我要在网页上解释 CACB", effect: "只展示产品架构、流程、验证边界和当前测试事实，不输出私有任务或受测比较结论。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "PRIVATE main 包含问题库、campaign、workspace、verifier、证据、归档和报告实现。", doesNotProve: "当前所有执行路线都可用或任何受测配置已形成结论。" },
    { layer: "Schemas（数据合同）", proves: "25 个 schema 约束任务、执行、证据、归档和报告字段。", doesNotProve: "每个 producer 都已生成完全合格的实例。" },
    { layer: "Focused tests（核心回归）", proves: "11 个与公开产品结构直接相关的测试文件共 162 项通过。", doesNotProve: "跨代 formal-run、外部 adapter 和全部私有路径全绿。" },
    { layer: "Full regression（完整回归）", proves: "本轮实际收集并运行 928 项，暴露了跨代与执行合同缺口。", doesNotProve: "失败都属于核心产品缺陷，或可以被忽略。" },
    { layer: "Private evidence（私有证据）", proves: "项目可以保留冻结输入、hidden verifier、raw trace 和归档链。", doesNotProve: "这些私有内容适合公开或应复制到网页。" },
    { layer: "Git identity（Git 身份）", proves: "观察时 PRIVATE main、HEAD、origin/main 和干净工作树一致。", doesNotProve: "页面会随未来 commit 自动更新。" }
  ],
  evolution: [
    { date: "2026-08-08—08-13", commit: "连续评测证据链", result: "从问题库和单次验证扩展为连续 episode、workspace 隔离、身份回执、任务 capsule、归档与可复现报告框架。" },
    { date: "2026-08-14", commit: "ce29323–bb14d37", result: "补充多执行方式接入、公共任务合同与无效输入隔离，使同一验证器可检查不同执行路线的工作产物。" },
    { date: "2026-08-15—08-16", commit: "8a911fe–e6f7581", result: "收紧执行身份、终态、公开报告 schema 和已知有效性边界，保留可诊断证据而不把不完整结果升级成结论。" }
  ],
  operationalEntrypoints: [
    { name: "准备问题库 campaign", command: "python scripts/prepare_campaign.py --help", purpose: "从版本化问题库创建冻结 manifest、fixture 与验证目录。" },
    { name: "快速准备执行", command: "python -m cacb.fast_model_flow --help", purpose: "为一个或一批新执行配置生成独立 workspace 和完成门材料。" },
    { name: "验证候选 workspace", command: "python scripts/verify_arm.py --help", purpose: "在参与者之外运行确定性验证并生成结构化摘要。" },
    { name: "核心产品回归", command: "python -m pytest -q <11 focused test files>", purpose: "验证问题库、campaign、workspace、worker contract、fast flow、接入、归档和公开 schema。" },
    { name: "完整回归", command: "python -m pytest -q", purpose: "检查所有历史和当前执行路线；当前存在已明确披露的未闭合项。" }
  ]
};

export const cacbModules = [
  {
    slug: "question-bank",
    shortTitle: "问题库",
    title: "现实任务如何变成可复现的问题库",
    teaser: "把工程实现、诊断、连续性、证据和恢复要求写成版本化案例；可见输入足够完成任务，隐藏检查只负责验收。",
    status: "问题库、公开案例与版本化加载器有源码和核心回归；私有变体不进入网页",
    statusTone: "pass",
    value: "我能反复用同一任务边界检验不同 Agent 执行方式，而不是每次临时出题、临时改验收。",
    why: "题目太依赖作者记忆会变成猜谜；把隐藏答案直接给参与者又失去检验价值。问题库必须同时做到可完成和不可针对。",
    example: "一个仓库修复案例向参与者提供代码、测试和目标，但不提供隐藏断言；验证器最后检查行为而不是特定实现写法。",
    result: "得到带任务家族、输入、约束、验收属性、版本和 provenance（来源）的案例合同。",
    readerStates: {
      pass: "可见信息足够、隐藏检查实现无关且版本冻结时，案例进入问题库。",
      problem: "任务含作者私有知识、只能匹配一种写法或验证不稳定时，案例返回设计审查。",
      unavailable: "缺 fixture、schema 或 verifier 时不创建正式 campaign。"
    },
    decisionImpact: [
      "先定义可观察行为，再选择验证方式。",
      "可见任务必须能从 workspace 自行完成。",
      "隐藏检查只验性质，不泄露答案。",
      "任务变化创建新版本，不改写旧证据。"
    ],
    problem: "解决临时出题、作者知识依赖、隐藏答案泄露、验证器过拟合和版本漂移。",
    implementation: [
      "question_bank.py 管理案例身份、任务家族和版本。",
      "public_cases / public_cases_v2 提供公开安全案例结构。",
      "CASE_CATALOG 与 JSON schema 说明可见/隐藏边界。",
      "source lock 绑定公共设计来源与时间。"
    ],
    flow: [
      "提出现实能力问题。",
      "设计可见 fixture 和目标。",
      "定义实现无关的隐藏属性。",
      "做污染与可完成性检查。",
      "冻结版本、schema 和 hash。",
      "纳入 campaign 生成器。"
    ],
    concepts: [
      { term: "task family（任务家族）", explanation: "一组共享现实能力但实现形式不同的案例。" },
      { term: "oracle（验收真值）", explanation: "验证器用于判断属性是否满足的隐藏依据。" },
      { term: "provenance（来源）", explanation: "说明任务灵感、许可、时间和改写关系。" }
    ],
    boundaries: [
      "网页不公开私有变体、seed 或 oracle。",
      "案例不是记忆题或平台私有约定题。",
      "公开 anchor 只说明设计，不等于正式私有案例。"
    ],
    failures: [
      { condition: "任务只有作者知道答案", response: "移除或补齐可见上下文。" },
      { condition: "隐藏检查依赖固定代码形状", response: "改为验证行为属性。" },
      { condition: "来源或许可不清楚", response: "不进入可发布问题库。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/question_bank.py", role: "问题库与校准规则" },
      { path: "PRIVATE source · config/question-bank.v1.json", role: "版本化产品合同" },
      { path: "PRIVATE source · docs/CASE_CATALOG.md", role: "案例家族与边界" },
      { path: "PRIVATE source · tests/test_question_bank_release.py", role: "问题库发布回归" }
    ],
    verification: [
      "question bank、public cases 与 release focused tests 本轮通过。",
      "私有 holdout 内容未读取到网页项目。",
      "完整跨代问题库路径仍受完整回归缺口约束。"
    ],
    relation: "向 campaign 模块提供冻结案例；verifier 模块消费隐藏验收属性。"
  },
  {
    slug: "campaign-workspace",
    shortTitle: "隔离执行",
    title: "Campaign 冻结、独立 workspace 与连续 episode",
    teaser: "把整组案例、fixture、顺序和验证版本冻结，再为每次执行复制唯一 workspace；不同尝试不共享半成品。",
    status: "campaign / workspace / archive 核心路径 162 项 focused 集合内通过",
    statusTone: "pass",
    value: "我能确认每次执行面对的是同一任务，又不会因为共享目录、旧文件或不同尝试拼接而污染结果。",
    why: "直接在同一仓库反复运行会留下缓存和旧产物；中断后换 workspace 继续也会让证据无法解释。",
    example: "一次十案例 episode 中途暂停，只有同一 session 和 workspace 能继续；无法精确恢复时，新 workspace 必须从头运行整组案例。",
    result: "得到 campaign manifest、唯一 workspace、连续 episode、终态和归档之间的一一对应关系。",
    readerStates: {
      pass: "workspace 唯一、输入 hash 匹配、路径在允许根内且所有案例终态闭合。",
      problem: "发现共享文件、跨目录写入或半次执行拼接时，整次结果无效但保留诊断。",
      unavailable: "无法恢复同一 session/workspace 时，只能创建新的完整尝试。"
    },
    decisionImpact: [
      "每个执行配置使用唯一目录。",
      "workspace 是临时施工区，不是唯一归档。",
      "中断优先精确恢复，不合并 partial。",
      "清理前先归档并验证 hash。"
    ],
    problem: "解决旧产物污染、共享写入、路径越界、不同尝试拼接和临时 workspace 丢失。",
    implementation: [
      "campaign.py 冻结 episode manifest 与 fixture。",
      "task_workspace.py 创建、校验和封装 workspace。",
      "task_workspace_archive.py 在终态后归档代码、trace 和 receipt。",
      "workspace containment 检查 cwd 与输出根祖先关系。"
    ],
    flow: [
      "冻结 campaign。",
      "为执行配置创建 workspace。",
      "复制并校验 fixture。",
      "顺序执行完整 episode。",
      "确认每个案例终态。",
      "归档产物与证据。",
      "证明归档后再清理临时目录。"
    ],
    concepts: [
      { term: "campaign（评测活动）", explanation: "同一问题库版本、执行规则和验证器组成的一次比较边界。" },
      { term: "capsule（任务胶囊）", explanation: "hash 绑定的任务输入与最小读取合同。" },
      { term: "terminal state（终态）", explanation: "案例明确 passed 或 failed；pending、missing、interrupted 都不算终态。" }
    ],
    boundaries: [
      "workspace 不进入网站，也不作为长期事实源。",
      "不同尝试不能 best-of 选优后拼接。",
      "当前网页不启动或清理任何评测 workspace。"
    ],
    failures: [
      { condition: "输出路径不在 workspace 内", response: "启动前拒绝执行。" },
      { condition: "某案例缺失或 interrupted", response: "整次 episode 保持 incomplete。" },
      { condition: "归档 hash 不匹配", response: "保留 workspace，不释放唯一内容。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/campaign.py", role: "Campaign 冻结与 manifest" },
      { path: "PRIVATE source · src/cacb/task_workspace.py", role: "Workspace 创建与 containment" },
      { path: "PRIVATE source · src/cacb/task_workspace_archive.py", role: "终态归档与 hash" },
      { path: "PRIVATE source · protocols/single-worker-episode.md", role: "连续 episode 合同" }
    ],
    verification: [
      "campaign、task_workspace 与 task_workspace_archive focused tests 本轮通过。",
      "没有创建真实受测任务或调用外部执行器。",
      "完整 native formal-run 路径仍有跨代 fixture 缺口。"
    ],
    relation: "消费问题库；向身份绑定和 verifier 提供唯一执行容器。"
  },
  {
    slug: "identity-evidence",
    shortTitle: "身份与证据",
    title: "实际执行身份、输入、动作与终态怎样绑定",
    teaser: "把谁执行、拿到什么任务、在哪个 workspace、做了哪些动作、最后怎样结束，绑定为不可跨执行借用的证据。",
    status: "证据 schema 与核心 binding 路径存在；部分历史 native envelope 在完整回归中未闭合",
    statusTone: "mixed",
    value: "我能区分“这个配置真的完成了任务”和“报告里自称完成”，也不会把一次执行证据借给另一次。",
    why: "参与者可以写错自己的身份，宿主事件也会随版本变化；只看最终文本无法证明任务、workspace 和动作属于同一次执行。",
    example: "执行返回完整文件，但 host receipt 显示任务 capsule 或 workspace 不匹配。系统保留产物供诊断，却不形成能力结论。",
    result: "得到 identity、task、workspace、action、terminal 和 artifact 的一条 hash-bound（hash 绑定）证据链。",
    readerStates: {
      pass: "宿主身份、任务、workspace、动作和终态全部匹配，证据可单次消费。",
      problem: "某层矛盾时标记具体 failure plane，不删除诊断产物。",
      unavailable: "宿主不提供必要证据时只保留证据不足状态，不用参与者文字补齐。"
    },
    decisionImpact: [
      "宿主回执优先于自报身份。",
      "任务输入与 workspace 同时绑定。",
      "动作范围逐条检查，未执行的外层 envelope 不算动作。",
      "证据只能用于精确执行和版本。"
    ],
    problem: "解决身份自报、跨执行借证、任务输入漂移、动作范围不明和终态假完成。",
    implementation: [
      "evidence.py 与 model_evidence.py 管证据结构与状态。",
      "manifest / receipt schema 约束 identity、workspace 与 terminal。",
      "canonical action parser 把受支持动作还原为可审计语义。",
      "binding hash 防止别名或不同执行路线复用旧证据。"
    ],
    flow: [
      "记录宿主实际身份。",
      "绑定任务 capsule 和 workspace。",
      "采集动作与终态。",
      "规范化可审计动作。",
      "核对 artifact 与 manifest。",
      "生成单次证据 commitment。"
    ],
    concepts: [
      { term: "attestation（证明）", explanation: "由宿主或受信适配器提供的执行事实，不是参与者自述。" },
      { term: "envelope（动作信封）", explanation: "宿主记录的一次工具调用及参数外壳。" },
      { term: "binding hash（绑定指纹）", explanation: "把身份、任务、workspace 和版本组合成不可混用的内容指纹。" }
    ],
    boundaries: [
      "网页不展示原始宿主日志或任务密文。",
      "缺 native lineage（原生谱系）对非原生执行不自动算失败。",
      "宿主版本字面量不是永久 allowlist。"
    ],
    failures: [
      { condition: "身份或任务不匹配", response: "标记 infra invalid（执行证据无效）。" },
      { condition: "动作无法规范化", response: "只关闭受影响的执行证据，不猜行为。" },
      { condition: "终态缺失", response: "保持 incomplete，尝试同 session 恢复。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/evidence.py", role: "证据状态与 commitment" },
      { path: "PRIVATE source · src/cacb/model_evidence.py", role: "执行身份和证据卡" },
      { path: "PRIVATE source · schemas/episode-manifest.schema.json", role: "Episode manifest 合同" },
      { path: "PRIVATE source · schemas/worker-receipt.schema.json", role: "执行回执合同" }
    ],
    verification: [
      "model evidence workflow 与 worker contract focused tests 本轮通过。",
      "完整 native identity envelope 测试当前存在跨代失败，页面没有升级为全绿。",
      "未读取或复制任何真实原始执行日志。"
    ],
    relation: "绑定 campaign/workspace 的真实执行；verifier 只接受匹配证据。"
  },
  {
    slug: "deterministic-verification",
    shortTitle: "确定性验证",
    title: "参与者之外的隐藏验证与范围审计",
    teaser: "验证器在隔离进程中检查文件、行为、测试、隐藏属性和修改范围；不把最终回答或进程退出当成成功。",
    status: "Verifier、公开案例和 CLI 核心路径存在；本页不执行私有 holdout",
    statusTone: "pass",
    value: "我得到的是能重放的客观验收，而不是对参与者文案的主观印象。",
    why: "参与者可以看见公开测试并针对写法硬编码；验证器若和候选代码同进程，也可能泄露 oracle 或被修改。",
    example: "候选通过公开测试，但修改了禁止目录。隐藏 verifier 会让这次执行失败，并把范围问题与功能问题分开。",
    result: "得到外部进程、硬超时、隐藏材料隔离、属性检查、范围变化和 hash 回读组成的验证摘要。",
    readerStates: {
      pass: "候选在隔离 verifier 中满足公开与隐藏属性，且修改范围正确。",
      problem: "功能、隐藏属性或范围任一失败时返回具体案例与 failure plane。",
      unavailable: "verifier 版本、输入或 hash 不匹配时不执行判定。"
    },
    decisionImpact: [
      "验证器不信任候选代码。",
      "隐藏材料不进入候选环境。",
      "检查行为属性而非固定实现。",
      "验证摘要不能冒充宿主身份回执。"
    ],
    problem: "解决公开测试过拟合、oracle 泄露、候选篡改验证、超时失控和越界修改。",
    implementation: [
      "evaluator.py 管 case verification 与状态。",
      "public_cases_v2 定义可发布的案例行为。",
      "verify_arm.py 提供已完成 workspace 的外部验证入口。",
      "结果包含 workspace/verifier hash 与逐案例状态。"
    ],
    flow: [
      "确认 campaign 与 verifier 身份。",
      "复制只读验证材料。",
      "在候选之外启动验证。",
      "运行公开与隐藏属性检查。",
      "审计文件范围和终态。",
      "写验证摘要与 hash。"
    ],
    concepts: [
      { term: "hidden property（隐藏属性）", explanation: "不暴露答案、但可客观检查的行为条件。" },
      { term: "sandbox（隔离环境）", explanation: "限制候选访问 oracle、控制文件和无关路径。" },
      { term: "replay（重放）", explanation: "使用同一输入、版本和验证器再次得到可解释结果。" }
    ],
    boundaries: [
      "本页不公开 oracle、seed 或私有失败正文。",
      "验证摘要不证明宿主 identity 或工具事件。",
      "合理等价实现必须能通过，不要求复制参考代码。"
    ],
    failures: [
      { condition: "Verifier hash 漂移", response: "结果不比较，进入新版本。" },
      { condition: "候选访问隐藏材料", response: "标记污染并拒绝结果。" },
      { condition: "硬超时", response: "终止 verifier 子进程并记录 timeout。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/evaluator.py", role: "验证器与案例状态" },
      { path: "PRIVATE source · src/cacb/public_cases_v2.py", role: "公开安全案例实现" },
      { path: "PRIVATE source · scripts/verify_arm.py", role: "外部验证 CLI" },
      { path: "PRIVATE source · schemas/case-artifact-v2.schema.json", role: "案例产物合同" }
    ],
    verification: [
      "public cases、question bank release 和 verify-related focused paths 本轮通过选定核心集合。",
      "完整外部执行 adapter 的若干测试仍失败，未被本模块 PASS 覆盖。",
      "没有在网页任务中运行私有 holdout。"
    ],
    relation: "消费问题库隐藏属性和 workspace 产物；输出给失败分类与报告层。"
  },
  {
    slug: "failure-reporting",
    shortTitle: "失败与报告",
    title: "失败平面、证据归档与可复现报告框架",
    teaser: "把能力、任务、执行环境和证据问题分开，先保存可重放 evidence，再生成 schema-backed（schema 约束）的公开安全说明。",
    status: "归档、failure semantics 与公开 report schema 的核心回归通过；完整历史报告链存在未闭合项",
    statusTone: "mixed",
    value: "我能知道一次执行到底哪里出了问题，并保留足够证据修任务或执行环境，而不是只看到红灯。",
    why: "把 timeout、权限、身份缺失、题目缺陷和候选代码错误都写成“能力失败”，会直接污染后续判断。",
    example: "执行因 workspace 权限失败，没有产生可验证产物。报告把它记为执行环境问题，不形成能力结论；修好后运行新的完整 episode。",
    result: "得到失败分类、逐案例状态、证据 hash、归档位置、已知限制和可重放命令组成的报告框架。",
    readerStates: {
      pass: "证据闭合后，报告准确写出任务范围、结果、失败平面和不能推导的结论。",
      problem: "能力或任务失败时保留逐案例事实，不被一个总结果覆盖。",
      unavailable: "证据不足时报告只写 Unknown 和重验条件，不生成受测比较结论。"
    },
    decisionImpact: [
      "基础设施问题不转成能力问题。",
      "任务缺陷进入新版本，不回写旧结果。",
      "先归档，后释放临时 workspace。",
      "公开报告只含安全聚合与可复现元数据。"
    ],
    problem: "解决失败归因混乱、历史重写、证据丢失、报告口径漂移和私有内容外泄。",
    implementation: [
      "failure state 在 campaign/evaluator/finalizer 间保持枚举语义。",
      "task_workspace_archive 保存代码、trace、receipt 与 validity reason。",
      "export / report schema 约束公开安全输出。",
      "manual-only 网站快照只读取框架事实，不消费受测结果。"
    ],
    flow: [
      "收集案例与终态。",
      "验证 evidence closure。",
      "判定 failure plane。",
      "归档产物与 hash。",
      "生成 schema-backed 报告。",
      "应用 public/private 边界。",
      "列出重验触发。"
    ],
    concepts: [
      { term: "failure plane（失败平面）", explanation: "能力、任务、执行环境或证据问题所在的责任层。" },
      { term: "infra invalid（执行证据无效）", explanation: "基础设施或身份链不满足，不能形成能力结论。" },
      { term: "schema-backed report（数据合同报告）", explanation: "字段、状态和限制由机器合同约束的报告。" }
    ],
    boundaries: [
      "网页不展示任何受测配置结果或数字比较。",
      "私有 raw trace、prompt、holdout 和机器快照不公开。",
      "报告建议不自动改变全局规则或能力路由。"
    ],
    failures: [
      { condition: "证据文件缺失或 hash 不符", response: "报告保持证据不足并保留 blocker。" },
      { condition: "任务本身有缺陷", response: "撤出受影响案例并创建新版本。" },
      { condition: "公开输出含私有 payload", response: "PUBLIC gate 阻断，不做界面隐藏式补救。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/task_workspace_archive.py", role: "执行归档与 hash" },
      { path: "PRIVATE source · src/cacb/export.py", role: "公开安全导出" },
      { path: "PRIVATE source · schemas/public-run-report.schema.json", role: "公开报告数据合同" },
      { path: "PRIVATE source · docs/REPORTING_STANDARD.md", role: "失败、证据和限制写法" }
    ],
    verification: [
      "workspace archive、worker contract 与 public report schema 核心回归本轮通过。",
      "完整 report/finalization 历史路径仍有失败，页面保留 mixed。",
      "网站内容没有复制任何私有报告正文或受测比较结果。"
    ],
    relation: "消费 verifier 和身份证据，形成可复核说明；manual snapshot 决定网页何时重新取证。"
  }
];

export const project = cacbProject;
export const modules = cacbModules;
