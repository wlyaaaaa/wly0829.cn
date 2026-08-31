import { createProjectSnapshot } from "./project-snapshot.js";

const cacbSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T04:13:00Z",
  label: "评测产品结构与 task-handle 绑定已在源码形成；当前提交 CI lint 未闭合，本页不发布受测配置结果",
  boundary: "当前 PRIVATE main 已前进到 59b0b5c，最新四个 CI job 都在 lint 门失败；旧提交的 focused/full 测试证据不自动继承，本页不发布受测配置结果或比较结论",
  metrics: [
    { label: "核心模块", value: "47" },
    { label: "数据合同", value: "25" },
    { label: "连续案例", value: "10" }
  ],
  facts: [
    { label: "当前源码", value: "Git Owner 回读 PRIVATE main=59b0b5c9706e76b8abc2d910af484b9d13237009，工作树干净，本地与远端引用 0/0。" },
    { label: "成品范围", value: "当前源树包含 233 个跟踪文件，其中 47 个 Python 核心模块、25 个 schema、59 个 test_*.py 测试文件，以及 6 份报告/模板文件；数量不代表这些文件可原样公开。" },
    { label: "问题库结构", value: "当前核心使用 10 个连续案例组成一次完整 episode（评测回合），覆盖实现、诊断、连续性、证据和恢复。" },
    { label: "任务身份绑定", value: "最新提交要求 WorkerHandle 同时绑定原始 task id；即使 run id 相同，只要 task id 不同也会拒绝借用旧 handle。" },
    { label: "当前验证边界", value: "当前提交最新四个 GitHub CI job 全部失败，失败门位于 lint；因此当前 commit 的完整测试结论保持 Unknown（证据不足）。" },
    { label: "公开证据范围", value: "PRIVATE 源保留冻结任务、私有验证与原始证据；公开页完整说明产品、提交、验证范围和明确缺口，但不复制受测配置或比较结果。", hero: false }
  ],
  gaps: [
    "当前提交没有一份绿色 CI 或本轮完整本地回归，因此不能把旧提交的 focused/full 记录继承为当前可验证。",
    "项目当前规则明确既有方法与评估有效性仍需复核；任何历史比较结论都不能直接作为公开选择依据。",
    "本轮没有启动新的受测执行、没有调用云端接口、没有运行本地重型推理，也没有生成新的受测结果。",
    "私有 holdout、原始执行记录和隐藏失败正文不会进入网页，公开读者无法从本页复算私有结果。",
    "单次执行即使验证通过，也只证明精确任务、精确配置和精确版本，不证明普遍能力。"
  ]
});

export const cacbProject = {
  order: 7,
  slug: "cacb",
  title: "CACB Agent 能力基准",
  route: "/projects/cacb",
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "评测产品框架、隔离执行和核心验证链已形成",
  cardStatusTone: "pass",
  ...cacbSnapshot,
  searchAliases: ["模型当前能不能在指定harness用", "官方价格和本地实测成本", "基准失败怎么归因", "缺失外部证据不能填0", "模型证据卡和综合判断报告", "三种执行路线怎么选", "本地GPU和云API执行有什么区别", "取消超时后怎样确认清理"],
  repositoryNote: "源码位于 PRIVATE（私有）仓库，因此本页不提供仓库跳转。页面完整展示已经做成的评测产品、设计取舍、架构与当前验证边界；私有任务样本、隐藏答案、原始执行记录、机器快照和任何受测配置比较结果都不进入网页。",
  summary: "CACB 用同一套真实工程任务，检查一套 Agent 执行方式究竟有没有把事情做完。它把证据分成两条车道：一条核对精确 model（模型）、provider（提供方）、version（版本）和 harness（执行环境）当前公开的官方能力、可用性、价格及可比外部证据；另一条只记录本地 Codex 在冻结任务中的真实执行与验证。执行层明确区分 executor union（执行器联合类型）的三条路线：native_managed 是宿主管理的原生任务，local_async_job 是 Toolkit/AICLI 驱动的本地异步任务，cloud_api_async_job 是经指定 provider API（提供方接口）运行的云端异步任务；三者共享任务与验收语义，却绝不互借身份、谱系或终态回执。先判断是否具备资格，再看任务能力与经济性，最后才形成精确范围内的路由建议；任何一条缺证据都保持未知，不填成零，也不与另一条混算。",
  why: "一次任务看似完成，可能只是写了总结、留下半成品、借用了旧文件，或因执行环境失败而没有真正接受检验。不同执行路线还会带来完全不同的宿主身份、网络传输、GPU 占用和清理责任；若把它们都写成“调用一个 Agent”，就无法判断问题发生在哪一层。CACB 把任务、输入、workspace、执行路线、终态、产物和验证证据锁在同一条链上，避免把“回答得像完成”或“换了传输仍沿用旧身份”误当成真实能力。",
  plainExample: "例如我要判断某个精确模型是否值得在当前 Codex harness 中承担一类工程任务。研究车道先核对官方是否支持该模型、当前 provider 和 version、可用地区或账号条件、公开价格以及外部比较是否真的可比；本地车道再用冻结任务测它在当前环境里做出了什么。两条证据分别成表，先过资格门，再讨论能力和经济性；缺价格或外部证据时写未知，不把空白当成零。",
  result: "我得到三份互相引用但不混写的交付：model evidence card（模型证据卡）记录精确身份、执行路线与当前官方/外部证据，benchmark report（基准报告）记录本地任务实测、路线专属终态回执与失败平面，comprehensive judgment report（综合判断报告）按资格→能力→经济性→范围内路由建议说明最终判断和未知。底层模型、provider 和通用智能来自外部产品；CACB 的交付是任务冻结、执行合同、证据绑定、验证与判断框架，不冒充这些智能能力的研发者。",
  readerStates: {
    pass: "执行路线通过接入门，官方外证身份闭合、本地任务证据闭合且二者范围可比时，分别生成模型证据卡与基准报告，再形成有条件的综合判断。",
    problem: "产物错误、越界修改、任务未完成、路线身份或清理证据矛盾、价格口径不可比或外部证据对象不一致时，分别标出受影响车道和失败平面。",
    unavailable: "缺少精确身份、当前官方能力/价格、路线接入证据、完整产物、终态或验收输入时保留无法判断；缺项不填零，也不阻断其他已闭合层的独立说明。"
  },
  cardMetrics: [
    { label: "核心模块", value: "47" },
    { label: "数据合同", value: "25" },
    { label: "连续案例", value: "10" }
  ],
  heroFacts: [
    { label: "成品范围", value: "233 个跟踪文件，其中有 47 个 Python 核心模块、25 个 schema（数据合同）、59 个测试文件与 6 份报告/模板文件" },
    { label: "问题库结构", value: "当前核心使用 10 个连续案例组成一次完整 episode（评测回合），覆盖实现、诊断、连续性、证据和恢复" },
    { label: "隔离、验证与执行路线", value: "每次执行独立 workspace；同一任务合同显式覆盖 native_managed、local_async_job、cloud_api_async_job，冻结输入、隐藏 verifier、范围审计、路线专属终态与归档 hash 分层绑定" },
    { label: "任务身份绑定", value: "WorkerHandle 同时绑定原始 task id 与 run id；任一身份不同都拒绝借用旧 handle 或旧证据" },
    { label: "当前源码", value: "PRIVATE main=59b0b5c9706e76b8abc2d910af484b9d13237009；工作树干净，远端引用 0/0；最新提交补强 WorkerHandle 与原始任务绑定" },
    { label: "当前验证边界", value: "当前提交最新四个 GitHub CI job 全部在 lint 门失败；因此本页不把旧提交的 162/928 项测试记录写成当前验证结论" }
  ],
  productPrinciples: [
    { title: "同一结论必须来自同一版本", detail: "任务、输入、允许范围和验收标准先被冻结，不能边跑边换题再比较结果。" },
    { title: "每次尝试都从干净工作区开始", detail: "旧文件、其他候选和上一次执行不能提供借来的成功，也不能污染本次失败。" },
    { title: "验收真实产物，不相信完成声明", detail: "固定验证器检查文件、行为、测试、修改范围和终态，回答得像完成没有证据价值。" },
    { title: "隐藏检查不规定唯一实现", detail: "验证器只检查目标性质和边界，不向参与者泄露答案，也不把参考实现当成唯一正确路线。" },
    { title: "整条证据必须属于同一次执行", detail: "身份、任务、工作区、动作、产物和终态彼此绑定，旧回执不能跨版本或跨候选复用。" },
    { title: "失败先归到正确层", detail: "能力问题、题目缺陷、执行环境故障和证据不足分别记录，不把基础设施中断算成能力差。" },
    { title: "证据不完整就不下结论", detail: "单次通过只证明精确任务、配置和版本；缺终态或缺验证时保持无法判定。" },
    { title: "当前官方外证与本地实测分车道", detail: "模型、提供方、版本、harness、能力、可用性、价格与可比外证单独核验；本地任务测量只说明真实执行，不互相补空白。" },
    { title: "先过资格，再谈能力和经济性", detail: "资格不成立时不进入路由建议；能力与成本分别保留口径，缺失数据保持未知而不是归零。" },
    { title: "三份交付各有责任", detail: "模型证据卡回答测的是谁，基准报告回答本地做成什么，综合判断报告才回答精确范围内怎样选。" },
    { title: "统一任务语义，不伪装统一传输", detail: "三条执行路线共享冻结目标、workspace、产物与 verifier，但 host、provider、transport、lineage 和 cleanup 证据始终显式保留。" },
    { title: "路线按用途选择，不静默替换", detail: "原生路线测宿主管理的真实任务，本地路线测精确本机模型制品，云端路线测指定 provider API 下的 Codex harness；任一路线失败都不能换模型或换传输补跑成成功。" },
    { title: "非原生不等于少一项能力", detail: "native lineage 只对 native_managed 必须成立；本地与云端写 not_applicable 是正确身份语义，不加分也不扣分。" },
    { title: "云端付费授权逐次绑定", detail: "配置好 provider、通过设计审查或完成上一次调用，都不授权下一次付费尝试；每次真实调用都要有该 attempt 的明确授权。" },
    { title: "评测帮助人选择，不替人决定", detail: "结果不会自动改写全局模型、能力路由、授权或项目 Owner 的现实选择。" },
    { title: "通用智能是被检验的能力，不是本项目自研", detail: "理解、推理、工具和代码执行来自已集成的外部 AI/智能体能力；CACB 负责冻结任务、绑定身份、验证产物、归因失败和管理证据。" }
  ],
  responsibilities: [
    "把现实工程能力拆成可冻结、可复现、可验证的问题库与案例合同",
    "为每次执行创建唯一 workspace，并把任务输入、执行身份和允许范围绑定到同一证据链",
    "用确定性 verifier 检查真实文件、行为、测试和终态，而不是相信参与者的完成声明",
    "把能力问题、任务问题、执行环境问题和证据不足分开，避免错误归因",
    "保存可重放的 manifest、receipt、hash 和归档，使结果能被独立复核",
    "用 schema 约束证据包和报告结构，避免不同执行路线各写一套口径",
    "把精确模型/提供方/版本/harness 的当前官方能力、可用性、价格和可比外证，与本地 Codex 真实测量分成两条证据车道",
    "按资格、能力、经济性和范围内路由建议分层，避免一个局部结果越级替代整体选择",
    "分别交付模型证据卡、基准报告和综合判断报告，保留缺失项而不归零、不混算",
    "用同一 worker.start / wait / cancel / result 生命周期承载三类执行路线，同时保留各自 host、provider、transport、lineage 和 cleanup 证据",
    "为新增执行方式提供 onboarding（接入验收），先冻结身份与能力等价路径，再用宿主回执和同一 verifier 预演，绝不自动替用户做选择",
    "在本地路线串行管理 LocalGpuBroker lease，在云端路线逐 request 绑定输入分类、usage 回执与流关闭，在原生路线绑定 parent/spawn/child 谱系"
  ],
  exclusions: [
    "本公开页不展示受测配置名单、比较结果、数字结论或先后顺序",
    "不公开私有任务变体、隐藏答案、原始执行记录、系统提示或机器快照",
    "不把速度、消耗或工具次数当成正确性的替代品",
    "不把官方宣传、价格表或外部比较冒充本地任务实测，也不让本地单次结果替代当前官方可用性研究",
    "不把能力、经济性、外部指标或缺失项混成一个看似完整的数字；缺证据保持未知",
    "不因一次执行成功或失败就宣称长期稳定能力",
    "不把 native_managed、local_async_job 与 cloud_api_async_job 写成同一种传输，也不允许静默 fallback（后备替换）",
    "不因 provider 已配置、schema 已存在或预演通过就推定已获云端付费授权；每次付费 attempt 都单独确认",
    "不把外部模型、provider 或通用智能写成 CACB 自研能力；项目只拥有评测合同、执行适配、证据与验证",
    "不自动改写全局能力路由、授权、安全边界或项目 Owner 决策",
    "不作为后台服务、自动测试队列、定时任务或持续同步系统"
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
    { term: "contamination（污染）", meaning: "任务或隐藏验证内容被参与者事先看见，导致结果失去解释力。" }
  ],
  currentState: {
    observedAt: "2026-08-31T04:13:00Z",
    label: "三类执行合同、task-handle 绑定与路线专属证据边界已在源码形成；当前提交 CI lint 未闭合，本页不发布受测结果",
    facts: [
      "Git Owner 回读 PRIVATE main=59b0b5c9706e76b8abc2d910af484b9d13237009，工作树干净，本地与远端引用 0/0。",
      "当前源树包含 233 个跟踪文件，其中 47 个 Python 核心模块、25 个 schema、59 个 test_*.py 测试文件，以及 6 份报告/模板文件；数量不代表这些文件可原样公开。",
      "最新提交要求 WorkerHandle 同时绑定原始 task id；即使 run id 相同，只要 task id 不同也会拒绝借用旧 handle。",
      "当前 source-backed（源码可追溯）worker contract 明确定义 native_managed、local_async_job 与 cloud_api_async_job：共用冻结任务和终态语义，分别保留原生谱系、本地 Toolkit/AICLI + GPU lease、云端 provider request/stream 证据。",
      "三类路线都要先过精确身份、workspace、工具策略、verifier、终态与清理门；native lineage 只对原生路线必需，本地与云端的 not_applicable 不构成能力缺口。",
      "当前提交最新四个 GitHub CI job 全部失败，失败门位于 lint；因此当前 commit 的完整测试结论保持 Unknown（证据不足）。",
      "PRIVATE 源保留冻结任务、私有验证与原始证据；公开页完整说明产品、提交、验证范围和明确缺口，但不复制受测配置或比较结果。"
    ],
    gaps: [
      "当前提交没有一份绿色 CI 或本轮完整本地回归，因此不能把旧提交的 focused/full 记录继承为当前可验证。",
      "项目当前规则明确既有方法与评估有效性仍需复核；任何历史比较结论都不能直接作为公开选择依据。",
      "本轮没有启动新的受测执行、没有调用云端接口、没有运行本地重型推理，也没有生成新的受测结果。",
      "源码中的路线、schema 和 synthetic（合成）验证只证明框架边界，不证明任一精确 provider/model/profile 当前可执行；正式接入仍需本机 preflight（预演）与宿主回执。",
      "配置存在不等于授权存在：云端真实调用仍需逐 attempt 的明确付费授权；清理无法确认时不得立即提交替代任务。",
      "私有 holdout、原始执行记录和隐藏失败正文不会进入网页，公开读者无法从本页复算私有结果。",
      "单次执行即使验证通过，也只证明精确任务、精确配置和精确版本，不证明普遍能力。"
    ]
  },
  operatingFlow: [
    { title: "定义能力问题", detail: "先把现实需求写成可以验收的任务家族，说明什么是完整结果、允许什么、禁止什么。" },
    { title: "建立当前官方与外部证据车道", detail: "对精确模型、provider、version 和 harness 核对官方能力、可用条件、价格日期与单位，并审查外部证据的任务、环境和口径是否可比。" },
    { title: "冻结任务与验证材料", detail: "固定可见 fixture、案例顺序、schema、隐藏 verifier 和版本 hash；执行开始后不原地改题。" },
    { title: "选择并接入执行路线", detail: "按要测的现实路径选择 native_managed、local_async_job 或 cloud_api_async_job；新 harness 先冻结身份/能力映射、跑无结论预演并证明同一 verifier 能读取产物。" },
    { title: "创建唯一 workspace", detail: "每个执行配置取得独立目录；任务 cwd 必须覆盖所有输出，路径越界或共享写入失败关闭。" },
    { title: "绑定身份、输入与范围", detail: "用 host（宿主）证据绑定实际执行身份、任务 capsule、workspace 和允许工具；原生取 parent/spawn/child 谱系，本地取 job/profile/artifact/lease，云端取 provider/profile/endpoint/request，不能靠参与者自报。" },
    { title: "启动并有界等待", detail: "start 先验证绑定再返回 handle；wait 只读取状态，不因一次轮询到期虚构 timeout。原生等待宿主任务，本地轮询 Toolkit/AICLI job，云端同时绑定 request/stream 事件。" },
    { title: "执行连续 episode", detail: "同一任务按固定顺序完成整组案例，保留恢复、压缩和终态证据；中断优先恢复同一 session/job/workspace，不合并不同尝试的半成品。" },
    { title: "确认取消、超时与清理", detail: "cancel 只是请求；只有原生无活跃后代、本地进程树与 GPU lease 已释放、或云端流关闭且 provider 终态可观察，才能写 cancelled/timed_out。" },
    { title: "运行确定性验证", detail: "验证器在参与者之外重放测试、检查文件和范围；隐藏材料不进入候选进程。" },
    { title: "分类失败平面", detail: "分别记录能力、任务、执行环境和证据问题；证据不足保持 Unknown（未验证）。" },
    { title: "分别生成两条证据交付", detail: "模型证据卡只写精确身份与当前官方/可比外证；基准报告只写本地冻结任务、真实产物、测量与失败平面，缺项不填零。" },
    { title: "形成分层综合判断", detail: "综合判断报告按资格、能力、经济性和范围内路由建议逐层引用前两份交付；不能比较的口径保持并列或未知。" },
    { title: "归档并生成可公开说明", detail: "先把产物、trace、receipt 和 hash 收入项目归档，再从中筛选不含私有样本与受测比较结果的结构化说明。" }
  ],
  components: [
    { name: "Question bank（问题库）", responsibility: "拥有案例、任务家族、可见输入、隐藏检查和版本边界。", implementation: "JSON 合同 + Python 生成/加载器；任务改变进入新版本，不回写旧证据。" },
    { name: "Campaign freezer（评测冻结器）", responsibility: "把问题库、episode、seed、fixture 和 verifier 固定成一次不可漂移的 campaign。", implementation: "manifest 与逐文件 hash 共同定义输入身份。" },
    { name: "Workspace manager（工作区管理）", responsibility: "创建、验证、归档每次执行的唯一目录。", implementation: "检查 cwd 祖先关系、任务 capsule、路径范围和归档完整性。" },
    { name: "Worker contract（执行合同）", responsibility: "定义参与者可见任务、允许工具、终态和产物要求。", implementation: "单一连续 episode；缺案例、pending 或 interrupted 不形成完整结果。" },
    { name: "Executor union（执行器联合类型）", responsibility: "用一个显式类型承载三条真实执行路线，不抹平 transport 与生命周期差异。", implementation: "native_managed、local_async_job、cloud_api_async_job 共用 envelope/handle/status/result 语义，各自扩展身份、提交、清理和失败证据。" },
    { name: "Native managed executor（原生受管执行器）", responsibility: "测量宿主管理的原生 Codex task，包括单 worker 或已冻结的原生编排处理。", implementation: "原生 transport；host 的 parent/spawn/child rollout 与 turn context 证明 lineage，终态需宿主确认且无活跃后代。" },
    { name: "Local async executor（本地异步执行器）", responsibility: "在精确本机模型制品必须进入测量时，通过 Toolkit/AICLI 与 Codex CLI 运行任务。", implementation: "job id 绑定 backend/profile/model/artifact/quantization/template/engine；LocalGpuBroker 串行 lease，终态需进程树、workspace 和 lease 清理回执。" },
    { name: "Cloud API async executor（云端接口异步执行器）", responsibility: "在指定非原生 provider API 需要接受同一 Codex harness 验证时承载调用。", implementation: "Responses transport 绑定 provider/profile/model/endpoint、request/stream 与 usage 事件；只发送 participant-public，隐藏 verifier 留在本地，并逐 attempt 核对付费授权。" },
    { name: "Harness onboarding gate（执行环境接入门）", responsibility: "证明新执行方式能接收同一任务、产出同一种可验 artifact，并提供可信宿主证据。", implementation: "冻结身份和 capability map，做代表性 dry-run（预演），根侧重算 workspace/log/trace/artifact hash，再确认同一 verifier 无专用捷径即可读取。" },
    { name: "Identity & evidence binding（身份与证据绑定）", responsibility: "把实际执行身份、任务、workspace、动作和终态绑定到同一回执。", implementation: "host receipt、manifest hash 与单次消费规则防止跨执行借证。" },
    { name: "Deterministic verifier（确定性验证器）", responsibility: "检查候选文件、隐藏属性、测试和范围变化。", implementation: "验证器独立进程、硬超时、隐藏材料隔离和结果 hash。" },
    { name: "Failure classifier（失败分类器）", responsibility: "区分能力、任务、执行环境与证据问题。", implementation: "不把 timeout、missing evidence、invalid harness 或未完成统一写成失败。" },
    { name: "Schema & report layer（数据合同与报告层）", responsibility: "把证据包、案例、归档和说明约束成可重放格式。", implementation: "25 个 schema 与报告模板；公开说明保留产品结构和验证事实，私有 payload、受测配置与比较结果不进入网页。" },
    { name: "Model evidence card（模型证据卡）", responsibility: "记录精确模型、提供方、版本、harness 与当前官方能力、可用性、价格和可比外证。", implementation: "每条事实带官方来源、观察日期、单位、适用条件和可比性；缺项保持 Unknown。" },
    { name: "Benchmark report（基准报告）", responsibility: "记录本地 Codex 冻结任务中的真实执行、产物、验证、消耗口径与失败平面。", implementation: "只消费同一次 run 的本地证据，不用官方说明或外部结果填补本地未测项。" },
    { name: "Comprehensive judgment report（综合判断报告）", responsibility: "把资格、能力和经济性转成精确范围内的路由建议。", implementation: "逐层引用前两份交付，不混算不同口径，不把缺失证据归零，也不自动改写全局路由。" },
    { name: "Fast model flow（快速接入流）", responsibility: "为新执行配置准备 workspace、完成门和盲化审阅包。", implementation: "准备、完成检查、证据包与代表选择分开，不由参与者 final answer 直接放行。" }
  ],
  usageExamples: [
    { moduleSlug: "question-bank", ask: "给一套新的 Agent 执行方式做可复现验收", effect: "为它准备同一版本的任务和独立工作区，完成后由参与者之外的固定验收检查真实产物。" },
    { moduleSlug: "deterministic-verification", ask: "为什么任务回答完成了却没有结果", effect: "检查每个案例是否真正结束、产物是否存在、验收是否闭合；缺任何一层都不相信完成总结。" },
    { moduleSlug: "failure-reporting", ask: "这次失败是能力问题还是执行环境问题", effect: "把产物错误、任务缺陷、身份/权限/工具故障和证据缺失分别归因，不把基础设施中断算成能力差。" },
    { moduleSlug: "identity-evidence", ask: "换一个执行方式能否沿用同一套验证", effect: "先比较它能否接收同一任务并产出同一种可验结果，再做代表性预演；验收真正兼容后才接入。" },
    { moduleSlug: "identity-evidence", ask: "这次应该走原生、本地还是云 API 执行？", effect: "先明确要测的是宿主原生任务、精确本机模型制品，还是指定 provider API 下的 Codex harness；路线标签、身份来源和接入门随选择一起冻结，不做静默替换。" },
    { moduleSlug: "identity-evidence", ask: "接入新的 harness 前要证明什么？", effect: "冻结精确身份与能力等价路径，读取真实 host receipt，重算 workspace 与 artifact hash，并证明同一 verifier 能验收后才允许进入正式样本。" },
    { moduleSlug: "campaign-workspace", ask: "怎样防止旧执行记录污染新结果", effect: "每次使用全新工作区和执行身份，旧产物、旧回执和上次未完成状态都不能借给新结果。" },
    { moduleSlug: "campaign-workspace", ask: "本地模型执行时 GPU 怎样排队和释放？", effect: "提交前检查 LocalGpuBroker 与活动请求，独占取得 lease；结束时必须确认进程树消失、请求归零、模型清理与 lease 释放，再写终态。" },
    { moduleSlug: "campaign-workspace", ask: "云 API 取消后为什么不能立刻重跑？", effect: "本地进程退出还不够；request stream 与可观察的 provider job 都要关闭。若远端清理无法确认，状态保持 cleanup_unconfirmed，先阻断替代提交。" },
    { moduleSlug: "failure-reporting", ask: "怎样保留失败样本供以后诊断", effect: "执行结束后归档代码、过程回执和失败原因并核对完整性，再释放临时工作区。" },
    { moduleSlug: "identity-evidence", ask: "某个模型现在到底能不能在这个 harness 里用？", effect: "模型证据卡核对精确模型、provider、version、harness、当前官方能力和可用条件；本地是否做成任务仍交给独立基准报告。" },
    { moduleSlug: "failure-reporting", ask: "官方价格和本地实测成本为什么要分开？", effect: "官方价目按日期、单位和适用条件记录，本地消耗按冻结任务真实测量；综合判断只在口径可比时讨论经济性。" },
    { moduleSlug: "failure-reporting", ask: "缺失外部证据能不能填 0？", effect: "不能。缺项保持 Unknown，并在综合判断中说明它阻断哪一层；不把未知写成零，也不与本地能力证据混算。" }
  ],
  evidenceLayers: [
    { layer: "Current official and external evidence（当前官方与外部证据）", proves: "在给定观察日，精确模型、提供方、版本和 harness 的官方能力、可用条件、价格口径及外部证据可比性。", doesNotProve: "不证明该配置在本地 Codex 冻结任务中真实做成了什么，也不填补本地未测项。" },
    { layer: "Local Codex measurement（本地 Codex 测量）", proves: "同一次冻结任务的身份、workspace、真实产物、验证、消耗口径与失败平面。", doesNotProve: "不自动证明当前官方可用性、公开价格或其他 benchmark 与本地任务可比。" },
    { layer: "Source（源码）", proves: "PRIVATE main 包含问题库、campaign、workspace、verifier、证据、归档和报告实现。", doesNotProve: "当前所有执行路线都可用或任何受测配置已形成结论。" },
    { layer: "Schemas（数据合同）", proves: "25 个 schema 约束任务、执行、证据、归档和报告字段。", doesNotProve: "每个 producer 都已生成完全合格的实例。" },
    { layer: "Executor contract（执行器合同）", proves: "当前源码把三类执行路线、共同生命周期和路线专属 identity/lineage/cleanup 字段写成可审计合同。", doesNotProve: "某个精确模型、provider、profile 或 endpoint 已通过本机接入或能够立即启动。" },
    { layer: "Route terminal receipt（路线终态回执）", proves: "一次精确 run 的提交、状态、artifact、终态与清理属于同一执行；本地还绑定 GPU lease，云端还绑定 request/stream。", doesNotProve: "可以把回执借给另一条路线、另一个 task，或把配置存在当成下一次付费授权。" },
    { layer: "Onboarding evidence（接入证据）", proves: "宿主预演已证明 identity、workspace、artifact、terminal 和同一 verifier 的兼容路径。", doesNotProve: "正式 episode 已运行、产生了受测结论，或外部模型/通用智能属于 CACB 自研。" },
    { layer: "Historical focused tests（历史核心回归）", proves: "e6f7581 观察代的 11 个核心测试文件曾有 162 项通过。", doesNotProve: "这些结果适用于当前 59b0b5c，或当前完整执行链已经闭合。" },
    { layer: "Current CI（当前持续集成）", proves: "59b0b5c 的四个最新 job 都在 lint 门失败，当前提交没有绿色 CI。", doesNotProve: "受测能力失败，或所有测试逻辑都错误。" },
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
    searchAliases: ["同一个题怎么公平复现", "任务是不是谜语人", "隐藏验证会不会泄露答案", "现实工程问题怎么进入问题库"],
    searchProjection: {
      intents: ["把现实工程需求写成可完成的评测任务", "判断题目是否依赖作者私有知识", "设计不限定实现的隐藏验收"],
      entities: ["question bank", "task family", "fixture", "holdout", "oracle", "provenance"],
      relations: ["可见输入必须足以独立完成任务", "隐藏检查只验证行为属性而不泄露答案", "任务变化创建新版本而不改写旧证据"],
      failureRecovery: ["作者知识缺失时补齐上下文或撤题", "隐藏检查过拟合代码形状时改验行为", "来源许可不清时拒绝进入正式问题库"]
    },
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
      "question bank、public cases 与 release focused tests 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "私有 holdout 内容未读取到网页项目。",
      "完整跨代问题库路径仍受完整回归缺口约束。"
    ],
    relation: "向 campaign 模块提供冻结案例；verifier 模块消费隐藏验收属性。"
  },
  {
    slug: "campaign-workspace",
    shortTitle: "隔离执行",
    title: "Campaign 冻结、三路线执行与独立 workspace",
    teaser: "把整组案例、fixture、顺序和验证版本冻结，再让原生受管、本地异步或云端 API 异步路线在唯一 workspace 中执行；三者共享任务语义，但提交、轮询、恢复和清理证据各自闭合。",
    status: "campaign / workspace / archive 与三类 executor 合同已有源码；当前提交的 CI lint 门仍未闭合，本页未启动任何路线",
    statusTone: "pass",
    searchAliases: ["每次测试怎么用干净工作区", "中断后能不能换workspace继续", "旧产物污染新结果", "十个案例连续episode", "原生任务怎样提交和等待", "本地模型GPU lease怎样释放", "云API request stream怎样关闭", "cleanup unconfirmed为什么不能重跑"],
    searchProjection: {
      intents: ["为一次评测冻结任务并创建独立工作区", "在三类执行路线中提交并有界读取状态", "判断中断后能否精确恢复", "确认取消超时和清理真正闭合", "防止旧产物或不同尝试拼接", "理解本地GPU与云端请求的资源流"],
      entities: ["campaign", "workspace", "episode", "WorkerHandle", "native_managed", "local_async_job", "cloud_api_async_job", "cleanup_unconfirmed"],
      relations: ["每次执行只属于一个唯一workspace", "start返回的handle同时绑定task和run", "wait只是有界状态读取而不是自动判超时", "同一episode的案例按固定顺序连续完成", "本地终态绑定进程树与GPU lease清理", "云端终态绑定request stream和provider job关闭", "临时workspace只有归档校验后才能释放"],
      failureRecovery: ["输出越界时启动前拒绝执行", "案例中断时整次episode保持不完整", "能精确恢复时复用同一session或job和workspace", "无法精确恢复时创建新的完整尝试", "本地进程或GPU lease未清理时保持不可用", "云端远程关闭不可观察时标记cleanup_unconfirmed并阻断替代提交"]
    },
    value: "我能用同一冻结任务比较三种真实执行路线，又清楚知道每条路线怎样启动、怎样看进度、何时算终态、资源是否清干净；共享目录、旧文件或不同尝试都不能污染结果。",
    why: "直接在同一仓库反复运行会留下缓存和旧产物；把一次 wait 到期写成 timeout、只结束本地进程却留下 GPU lease 或远端请求、或中断后换 workspace 继续，都会让证据无法解释。",
    example: "一次连续 episode 中，本地任务收到取消请求。只有 AICLI/Codex 进程树消失、LocalGpuBroker lease 释放、workspace 末态 hash 和回执完成后，才记录 cancelled；若这些条件不齐，保持 cleanup_unconfirmed，而不是立刻换路线重跑。",
    result: "得到 campaign manifest、唯一 workspace、WorkerHandle、连续 episode、路线专属终态回执和项目归档之间的一一对应关系；原生还给出宿主任务终态，本地给出 job/GPU 清理证据，云端给出 request/stream 与 provider 清理证据。",
    readerStates: {
      pass: "workspace 唯一、输入 hash 匹配、路径在允许根内，所有案例终态闭合且该 executor 的进程、后代、GPU lease 或远端请求清理证据完整。",
      problem: "发现共享文件、跨目录写入、半次执行拼接、终态早报或资源未释放时，整次结果无效但保留诊断。",
      unavailable: "无法恢复同一 session/job/workspace，或 provider 侧关闭不可观察时，不提交替代执行；前者创建新的完整尝试，后者先保持路线不可用直至清理可确认。"
    },
    decisionImpact: [
      "每个执行配置使用唯一目录。",
      "三条路线共用 start / wait / cancel / result 语义，但不共用身份或清理回执。",
      "start 只在所有绑定通过后返回 handle，wait 只给状态快照。",
      "workspace 是临时施工区，不是唯一归档。",
      "中断优先精确恢复，不合并 partial。",
      "原生终态要求宿主确认且无活跃后代；本地终态要求进程树和 GPU lease 清理；云端终态要求流与可观察远端任务关闭。",
      "清理前先归档并验证 hash。"
    ],
    problem: "解决旧产物污染、共享写入、路径越界、不同尝试拼接、轮询误判、资源泄漏、远端请求悬挂和临时 workspace 丢失。",
    implementation: [
      "campaign.py 冻结 episode manifest 与 fixture。",
      "task_workspace.py 创建、校验和封装 workspace。",
      "task_workspace_archive.py 在终态后归档代码、trace 和 receipt。",
      "models.py 定义 worker.start(envelope)、wait(handle, deadline)、cancel(handle) 与 result(handle) 的共同类型；result 只接受带完整 receipt 的终态。",
      "native_managed 由宿主提交原生 task，轮询宿主状态并绑定 parent/spawn/child lineage；取消或超时后必须确认宿主终态和没有活跃后代。",
      "local_async_job 由 Toolkit/AICLI 提交 Codex CLI job，按 job id 轮询；任务在本地 workspace 中产出 artifact，重型执行由 LocalGpuBroker 串行，结束时确认进程树、活动请求、模型清理和 lease 释放。",
      "cloud_api_async_job 在本地 workspace 运行 Codex harness，经绑定的 Responses transport 发出 provider request；每个请求与 usage 事件配对，hidden verifier 和 independent confirmation（独立确认）始终留在本地。",
      "workspace containment 检查 cwd 与输出根祖先关系；所有路线先归档 artifact/trace/receipt/validity reason 并回读 hash，才允许释放临时目录。"
    ],
    flow: [
      "冻结 campaign。",
      "选择 executor_kind，并验证它的接入状态、精确身份和授权边界。",
      "为执行配置创建 workspace。",
      "复制并校验 fixture。",
      "用 start 提交 envelope；只有绑定验证通过才接收 WorkerHandle。",
      "用 wait 在建议检查时间做有界状态读取；到达一次 deadline 不自行发明 timeout。",
      "原生路线等待 host task；本地路线在取得 LocalGpuBroker lease 后运行 Toolkit/AICLI job；云端路线只向已绑定 provider 发送 participant-public request。",
      "顺序执行完整 episode，并把 artifact 留在唯一 workspace。",
      "确认每个案例终态。",
      "中断时优先恢复同一 session/job/workspace；不能精确续作时整次重开，不拼接 partial。",
      "需要停止时调用 cancel，并继续观察到路线专属清理闭合；清理不可确认就保持 cleanup_unconfirmed。",
      "归档产物与证据。",
      "证明归档后再清理临时目录。"
    ],
    concepts: [
      { term: "campaign（评测活动）", explanation: "同一问题库版本、执行规则和验证器组成的一次比较边界。" },
      { term: "capsule（任务胶囊）", explanation: "hash 绑定的任务输入与最小读取合同。" },
      { term: "WorkerHandle（执行句柄）", explanation: "start 返回的 task id + run id + provider id 绑定；身份不同就不能继续 wait、cancel 或取 result。" },
      { term: "terminal state（终态）", explanation: "completed、partial、blocked、failed、timed_out 或 cancelled；后两者只有清理已确认才成立。" },
      { term: "cleanup_unconfirmed（清理未确认）", explanation: "取消或超时已发生，但仍不能证明进程、GPU lease、request stream 或远端 job 已终止；此时路线保持不可用。" },
      { term: "LocalGpuBroker（本地 GPU 仲裁器）", explanation: "串行分配本地重型模型 lease，防止两个受测任务绕过 owner 同时占用 GPU。" },
      { term: "provider request（提供方请求）", explanation: "云端路线经唯一绑定 endpoint 发出的调用；只携带参与者公开输入，hidden control 不离开本机。" }
    ],
    boundaries: [
      "workspace 不进入网站，也不作为长期事实源。",
      "不同尝试不能 best-of 选优后拼接。",
      "native、local 与 cloud 之间不继承 handle、lineage、artifact 或 cleanup receipt，也不做静默 fallback。",
      "云端 provider HTTPS 是 runner-side transport，不等于参与者获得任意联网、connector、远程 Git 或继续委派能力。",
      "配置好云端 provider 不授权调用；每个真实付费 attempt 在提交前单独绑定明确授权，先前 attempt 的授权不可复用。",
      "本地 GPU 路线不消耗云端 paid-attempt 授权，但仍必须经过资源 owner、兼容性和 broker 门。",
      "当前网页不启动、取消或清理任何评测 workspace、GPU lease 或云端 request。"
    ],
    failures: [
      { condition: "输出路径不在 workspace 内", response: "启动前拒绝执行。" },
      { condition: "某案例缺失或 interrupted", response: "整次 episode 保持 incomplete。" },
      { condition: "一次 wait 到期但 executor 仍在运行", response: "只返回当前状态和下次建议检查时间，不写 timed_out。" },
      { condition: "原生取消后仍有活跃后代", response: "不写 cancelled，继续保持取消请求或清理未确认状态。" },
      { condition: "本地进程树、活动请求或 GPU lease 未释放", response: "路线保持 cleanup_unconfirmed；不启动另一个重型任务。" },
      { condition: "云端 stream 已断但 provider job 终态不可观察", response: "不把本地退出当远端清理；路线保持不可用且不立即替代提交。" },
      { condition: "归档 hash 不匹配", response: "保留 workspace，不释放唯一内容。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/campaign.py", role: "Campaign 冻结与 manifest" },
      { path: "PRIVATE source · src/cacb/task_workspace.py", role: "Workspace 创建与 containment" },
      { path: "PRIVATE source · src/cacb/task_workspace_archive.py", role: "终态归档与 hash" },
      { path: "PRIVATE source · src/cacb/models.py", role: "WorkerHandle、状态机与 start/wait/cancel/result 共同合同" },
      { path: "PRIVATE source · docs/WORKER_CONTRACT.md", role: "三类 executor、终态和路线专属 cleanup 语义" },
      { path: "PRIVATE source · docs/LOCAL_CODEX_COMPATIBILITY.md", role: "本地 Codex、工具循环、恢复和 LocalGpuBroker 门" },
      { path: "PRIVATE source · src/cacb/cloud_api_worker.py", role: "云端 request/usage/terminal machine-event 解析边界" },
      { path: "PRIVATE source · protocols/single-worker-episode.md", role: "连续 episode 合同" }
    ],
    verification: [
      "campaign、task_workspace 与 task_workspace_archive focused tests 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "当前源码与 cross-executor contract test 明确覆盖 native_managed、local_async_job、cloud_api_async_job 及 native_lineage=not_applicable 语义；这只是 source contract，不是本轮 runtime 验收。",
      "没有创建真实受测任务、取得 GPU lease 或调用外部执行器。",
      "完整 native formal-run 路径仍有跨代 fixture 缺口。"
    ],
    relation: "消费问题库并冻结共同 envelope；身份与证据模块决定三条路线的精确 binding 和接入资格，本模块负责 start/wait/cancel/result、workspace、资源与归档生命周期，再把唯一执行容器和路线终态交给 verifier 与失败报告。"
  },
  {
    slug: "identity-evidence",
    shortTitle: "身份与证据",
    title: "三类 executor 的实际身份、谱系与接入证据",
    teaser: "把谁执行、为何选择这条路线、host/provider/transport 是什么、是否需要 native lineage，以及任务、workspace、动作和终态怎样归属，绑定为不可跨执行借用的证据。",
    status: "三类 executor identity/schema 与共同接入原则已有源码；部分历史 native envelope 在完整回归中未闭合",
    statusTone: "mixed",
    searchAliases: ["当前模型provider版本到底是什么", "某模型在这个harness里现在能不能用", "模型证据卡包含什么", "task id和run id为什么都要绑定", "官方能力和本地实测怎么分开", "native local cloud三种executor怎么选", "非原生为什么没有native lineage", "新harness接入要过什么门"],
    searchProjection: {
      intents: ["确认被研究和被测量的是哪个精确配置", "在原生本地云端三类执行路线间做用途判断", "核对当前官方能力可用性与价格证据", "证明新harness可接收同一任务并被同一verifier验收", "把本地任务身份动作产物和终态绑定", "判断native lineage是否适用"],
      entities: ["model", "provider", "harness", "transport", "native lineage", "executor_kind", "WorkerHandle", "onboarding gate"],
      relations: ["模型证据卡记录当前官方与外部证据", "本地证据绑定同一次task和run", "native_managed必须有parent spawn child谱系", "local_async_job绑定artifact profile engine与broker lease", "cloud_api_async_job绑定provider endpoint request与stream", "非原生路线的native lineage为not_applicable", "官方可用性研究不能替代本地任务实测"],
      failureRecovery: ["模型或harness身份不精确时不进入资格判断", "requested effective attested不一致时失败关闭", "task或run不匹配时拒绝借用旧handle", "新harness缺host receipt时保持研究状态", "宿主证据缺失时保持Unknown而不靠参与者自报", "provider或transport漂移时创建新binding而不继承旧证据"]
    },
    value: "我能先判断该测宿主原生任务、精确本机模型还是指定云端 provider，再确认这条路线真的使用了声明的模型、harness 和 transport；非原生路线不会冒充原生子代理，一次执行证据也不会借给另一次。",
    why: "参与者可以写错自己的身份，别名可能换了模型，profile 可能换了 endpoint，宿主事件也会随版本变化；只看最终文本无法证明任务、workspace、动作和终态属于同一次执行，更无法证明 native lineage 对这条路线是否适用。",
    example: "一个云端任务产出了完整文件，但 effective provider 或 endpoint 与请求绑定不同。即使任务内容正确，系统也会保留产物供诊断、关闭这次身份资格，并拒绝把它改写成 native_managed 或借用原生 receipt。",
    result: "得到 requested/effective/attested identity（请求/实际/证明身份）、executor_kind、host/provider/transport、lineage applicability（谱系适用性）、task、workspace、action、terminal 和 artifact 的一条 hash-bound（hash 绑定）证据链，并明确这条路线通过了哪一层接入门。",
    readerStates: {
      pass: "路线已通过接入门，请求/实际/证明身份、任务、workspace、动作、终态和适用的 lineage 全部匹配，证据可单次消费。",
      problem: "模型、provider、profile、transport、task、lineage 或 cleanup 任一层矛盾时标记具体 failure plane，不删除诊断产物，也不换路线补证。",
      unavailable: "宿主不提供必要 receipt、新 harness 没有真实 preflight，或 provider 终态不可观察时只保留证据不足状态，不用参与者文字、设计 schema 或旧配置补齐。"
    },
    decisionImpact: [
      "宿主回执优先于自报身份。",
      "native_managed 只在宿主能证明原生 parent/spawn/child lineage 时成立。",
      "local_async_job 明确是 Toolkit/AICLI + Codex CLI 本地任务，不是原生 child；它绑定精确 artifact、quantization、tokenizer/template、engine、profile 与 broker lease。",
      "cloud_api_async_job 明确是指定 provider 的 Responses 任务，不是原生 child；它绑定 provider/profile/model/endpoint、request/stream 和 machine events。",
      "本地与云端路线的 native_lineage=not_applicable 是正确语义，不增加也不减少能力。",
      "任务输入与 workspace 同时绑定。",
      "动作范围逐条检查，未执行的外层 envelope 不算动作。",
      "新增 harness 先证明等价能力路径和同一 verifier 兼容，不用专用验收捷径。",
      "证据只能用于精确执行和版本。"
    ],
    problem: "解决身份自报、原生谱系冒领、provider/profile/transport 漂移、跨执行借证、任务输入漂移、动作范围不明和终态假完成。",
    implementation: [
      "evidence.py 与 model_evidence.py 管证据结构与状态。",
      "model-evidence-card schema 把 executor_kind 固定为 native_managed、local_async_job 或 cloud_api_async_job，并分别约束 lineage applicability。",
      "native_managed 选择于要测真实宿主原生 Codex 行为且宿主能提供权威 rollout 时；host receipt 绑定 model、effort、agent_type、provider、harness、parent/spawn/child 与 turn context，用户得到原生 task handle、artifact 和终态/清理回执。",
      "local_async_job 选择于要测精确本机模型制品及其 Codex 工具循环时；Toolkit job id 与 AICLI machine events 绑定 backend/profile/model、artifact digest、quantization、tokenizer/chat template、serving engine、loopback transport、sandbox、LocalGpuBroker lease 和 fallback=false，用户得到本地 artifact、verifier 摘要与完整清理 receipt。",
      "cloud_api_async_job 选择于非原生模型必须在指定 provider API 下接受同一 Codex harness 时；Toolkit/AICLI job 与 receipt id 绑定 provider/profile/model/revision、endpoint class/path fingerprint、Responses transport、request/stream id、machine events、privacy policy 和 fallback=false，用户得到本地 artifact、sanitized report（净化报告）与请求/终态证据。",
      "harness onboarding 先冻结 identity + capability/equivalent-path map，再读取 host-owned preflight receipt、根侧重算 workspace/log/trace/artifact hash，并证明同一 frozen verifier 能验收；通过才允许正式样本。",
      "manifest / receipt schema 约束 identity、workspace 与 terminal；云端 paid-attempt authorization hash 只绑定当前一次真实付费尝试，旧授权、provider 配置或 synthetic test 都不可复用。",
      "canonical action parser 把受支持动作还原为可审计语义。",
      "binding hash 防止别名或不同执行路线复用旧证据。"
    ],
    flow: [
      "先说明要测的现实对象：宿主原生任务、精确本机模型制品，或指定云端 provider 的 Codex harness。",
      "冻结 executor_kind、requested identity、harness、transport、no-fallback 和比较基线。",
      "新 harness 运行代表性 dry-run，读取 host receipt 并确认同一 verifier 能消费 artifact；未通过只保留候选状态。",
      "记录宿主或受信适配器的 effective 与 attested identity。",
      "原生路线核对 parent/spawn/child rollout；本地路线核对 job/profile/artifact/engine/lease；云端路线核对 provider/endpoint/request/stream。",
      "绑定任务 capsule 和 workspace。",
      "采集动作与终态。",
      "规范化可审计动作。",
      "核对 artifact 与 manifest。",
      "核对路线专属 cleanup 与 authorization 证据。",
      "生成单次证据 commitment。"
    ],
    concepts: [
      { term: "attestation（证明）", explanation: "由宿主或受信适配器提供的执行事实，不是参与者自述。" },
      { term: "executor_kind（执行器类型）", explanation: "决定任务由宿主原生、本机异步 job 还是云端 API job 承载，也是身份、传输与清理合同的分支。" },
      { term: "requested / effective / attested identity（请求/实际/证明身份）", explanation: "分别记录想调用谁、实际运行谁、宿主或 provider 能证明谁；三者矛盾就失败关闭。" },
      { term: "native lineage（原生谱系）", explanation: "宿主提供的 parent/spawn/child 与 rollout 关系；只对 native_managed 必需，非原生路线明确写 not_applicable。" },
      { term: "onboarding gate（接入门）", explanation: "新 harness 在正式使用前证明身份、能力等价路径、workspace/artifact/terminal receipt 与同一 verifier 兼容的预演。" },
      { term: "envelope（动作信封）", explanation: "宿主记录的一次工具调用及参数外壳。" },
      { term: "binding hash（绑定指纹）", explanation: "把身份、任务、workspace 和版本组合成不可混用的内容指纹。" }
    ],
    boundaries: [
      "网页不展示原始宿主日志或任务密文。",
      "缺 native lineage 对非原生执行不自动算失败；反过来，非原生 receipt 绝不能证明 native_managed。",
      "云端请求只允许 participant-public 与必要 harness protocol；hidden control、oracle、raw rollout、私有证据、secret 和无关私有来源不得发送给 provider。",
      "云端真实付费 attempt 必须逐次明确授权；本地 GPU 与原生 task 不消费这个 paid-attempt gate，但仍服从各自 owner、资源和执行授权。",
      "宿主版本字面量不是永久 allowlist；真正绑定的是当前发现的身份、协议、能力与 receipt。",
      "底层模型、provider、理解、推理和代码能力属于外部 AI/平台；CACB 自己只实现接入、评测、证据与验证框架。"
    ],
    failures: [
      { condition: "身份或任务不匹配", response: "标记 infra invalid（执行证据无效）。" },
      { condition: "native_managed 缺 parent/spawn/child 谱系", response: "原生身份门失败，不得改写为普通成功或借用另一次 rollout。" },
      { condition: "本地 artifact/profile/engine 与 runtime receipt 不一致", response: "停止资格判断，保留 workspace 供诊断；不得换成本地别名、原生或云端 fallback。" },
      { condition: "云端 requested/effective/attested provider、model 或 endpoint 不一致", response: "关闭本次身份资格并保留 request audit；不得继承 native receipt。" },
      { condition: "新 harness 只有静态 profile、没有 host preflight receipt", response: "保持 draft/research 状态，不进入正式样本。" },
      { condition: "云端没有当前 attempt 的付费授权", response: "不发 provider request；已配置账号、旧授权或设计验证都不能补足。" },
      { condition: "动作无法规范化", response: "只关闭受影响的执行证据，不猜行为。" },
      { condition: "终态缺失", response: "保持 incomplete，尝试同 session 恢复。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/evidence.py", role: "证据状态与 commitment" },
      { path: "PRIVATE source · src/cacb/model_evidence.py", role: "执行身份和证据卡" },
      { path: "PRIVATE source · docs/WORKER_CONTRACT.md", role: "三类 executor union、identity、lineage 与 compatibility gate" },
      { path: "PRIVATE source · docs/HARNESS_ONBOARDING.md", role: "新 harness 的 profile、host preflight 与同一 verifier 接入门" },
      { path: "PRIVATE source · docs/LOCAL_CODEX_COMPATIBILITY.md", role: "本地 artifact、Codex tool loop 与 GPU 身份门" },
      { path: "PRIVATE source · src/cacb/cloud_api_worker.py", role: "云端 provider/request/usage/privacy/terminal 的严格证据解析" },
      { path: "PRIVATE source · schemas/model-evidence-card.schema.json", role: "三类 executor 与 lineage applicability 合同" },
      { path: "PRIVATE source · schemas/episode-manifest.schema.json", role: "Episode manifest 合同" },
      { path: "PRIVATE source · schemas/worker-receipt.schema.json", role: "执行回执合同" }
    ],
    verification: [
      "model evidence workflow 与 worker contract focused tests 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "current cross-executor design contract 与 schemas 在源码层显式区分 native_managed、local_async_job、cloud_api_async_job，并要求 requested/effective/attested identity；这不证明任何具体配置已完成本机接入。",
      "完整 native identity envelope 测试当前存在跨代失败，页面没有升级为全绿。",
      "未读取或复制任何真实原始执行日志。"
    ],
    relation: "先为 campaign/workspace 选择并冻结精确 executor binding，再把路线专属 host/provider/transport/lineage/authorization 证据交给执行生命周期；verifier 只接受同一 task/run/workspace 的匹配 artifact，失败报告再按 identity、transport、harness、cleanup 或 model-task 平面归因。"
  },
  {
    slug: "deterministic-verification",
    shortTitle: "确定性验证",
    title: "参与者之外的隐藏验证与范围审计",
    teaser: "验证器在隔离进程中检查文件、行为、测试、隐藏属性和修改范围；不把最终回答或进程退出当成成功。",
    status: "Verifier、公开案例和 CLI 核心路径存在；本页不执行私有 holdout",
    statusTone: "pass",
    searchAliases: ["回答说完成为什么还没结果", "怎样验证真实产物", "隐藏检查会不会限定写法", "越界修改怎么发现"],
    searchProjection: {
      intents: ["验证Agent是否真的交付了可运行产物", "检查候选是否越过允许文件范围", "用隐藏属性避免只针对公开测试"],
      entities: ["verifier", "hidden property", "sandbox", "artifact", "scope audit", "replay"],
      relations: ["验证器运行在参与者之外", "公开测试通过仍要检查隐藏属性和修改范围", "最终回答与进程退出不能替代产物验证"],
      failureRecovery: ["verifier指纹漂移时进入新版本", "候选访问隐藏材料时标记污染", "验证超时后终止子进程并保留具体状态"]
    },
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
      "public cases、question bank release 和 verify-related focused paths 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "完整外部执行 adapter 的若干测试仍失败，未被本模块 PASS 覆盖。",
      "本轮没有运行私有 holdout，也没有生成新的受测配置比较结果。"
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
    searchAliases: ["官方价格和本地实测成本为什么分开", "缺失外部证据能不能填0", "基准报告和综合判断报告有什么区别", "资格能力经济性怎样形成路由建议", "失败是模型还是环境"],
    searchProjection: {
      intents: ["区分能力任务执行环境和证据失败", "分别生成模型证据卡与本地基准报告", "按资格能力经济性形成范围内路由建议", "处理价格或外部证据缺失"],
      entities: ["failure plane", "model evidence card", "benchmark report", "comprehensive judgment report", "qualification", "economics", "Unknown"],
      relations: ["模型证据卡回答精确身份和当前官方外证", "基准报告回答本地真实任务表现", "综合判断按资格到能力到经济性引用两条车道", "缺失证据保持Unknown而不归零"],
      failureRecovery: ["基础设施失败时不形成能力结论", "价格口径不可比时并列呈现而不混算", "证据文件缺失或指纹不符时保留blocker", "任务缺陷进入新版本后重新完整评测"]
    },
    value: "我能知道一次执行到底哪里出了问题，并保留足够证据修任务或执行环境，而不是只看到红灯。",
    why: "把 timeout、权限、身份缺失、题目缺陷和候选代码错误都写成“能力失败”，会直接污染后续判断。",
    example: "如果官方页面能确认某精确模型在目标 harness 可用，却没有当前价格，而本地 episode 又因 workspace 权限失败，两条车道分别写：官方资格可确认、价格未知；本地执行环境无效、没有能力结论。未知不填零，基础设施失败也不冒充能力差。",
    result: "得到模型证据卡、基准报告和综合判断报告三份交付：前两份各守自己的证据车道，后一份按资格→能力→经济性→范围内路由建议引用它们，并列出所有未知和重验条件。",
    readerStates: {
      pass: "证据闭合后，报告准确写出任务范围、结果、失败平面和不能推导的结论。",
      problem: "能力或任务失败时保留逐案例事实，不被一个总结果覆盖。",
      unavailable: "证据不足时报告只写 Unknown 和重验条件，不生成受测比较结论。"
    },
    decisionImpact: [
      "基础设施问题不转成能力问题。",
      "任务缺陷进入新版本，不回写旧结果。",
      "当前官方能力、可用性、价格和可比外证与本地 Codex 测量分开保存，不用一条车道补另一条空白。",
      "先判断资格，再说明能力与经济性，最后才给精确范围内的路由建议；任何缺失证据都不归零。",
      "先归档，后释放临时 workspace。",
      "公开报告只含安全聚合与可复现元数据。"
    ],
    problem: "解决失败归因混乱、历史重写、证据丢失、报告口径漂移和私有内容外泄。",
    implementation: [
      "failure state 在 campaign/evaluator/finalizer 间保持枚举语义。",
      "task_workspace_archive 保存代码、trace、receipt 与 validity reason。",
      "export / report schema 约束公开安全输出。",
      "公开报告只解释产品与证据边界，不消费受测配置比较结果。"
    ],
    flow: [
      "核对精确模型、provider、version、harness 与官方证据观察日。",
      "把当前能力、可用性、价格单位和外部可比性写入模型证据卡。",
      "收集案例与终态。",
      "验证 evidence closure。",
      "判定 failure plane。",
      "归档产物与 hash。",
      "把本地任务实测和失败平面写入基准报告。",
      "按资格、能力、经济性和适用范围生成综合判断报告。",
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
      "官方说明、外部 benchmark 与本地 Codex 任务证据不得合并成一条来源；仅在身份、任务、环境和计量口径可比时建立关系。",
      "能力结论、经济性和路由建议是不同层；缺价格、缺外证或缺本地测量时保留 Unknown，不填零、不混算。",
      "报告建议不自动改变全局规则或能力路由。"
    ],
    failures: [
      { condition: "证据文件缺失或 hash 不符", response: "报告保持证据不足并保留 blocker。" },
      { condition: "官方能力、价格或外部证据已过期", response: "只把对应模型证据卡字段降为 Unknown，按当前官方来源重查；不删除仍有效的本地任务证据。" },
      { condition: "官方价格与本地消耗口径不可比", response: "分别保留单位、日期和条件，不换算、不混算，也不据此形成经济性结论。" },
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
      "workspace archive、worker contract 与 public report schema 核心回归在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "完整 report/finalization 历史路径仍有失败，页面保留 mixed。",
      "网站内容没有复制任何私有报告正文或受测比较结果。"
    ],
    relation: "消费 verifier 和身份证据，形成可复核说明；公开报告保留结论的精确范围和证据边界。"
  }
];

export const project = cacbProject;
export const modules = cacbModules;
