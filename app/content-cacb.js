import { createProjectSnapshot } from "./project-snapshot.js";

const cacbSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T04:13:00Z",
  label: "三类执行合同、task-handle 绑定与路线专属证据边界已在源码形成；当前提交 CI lint 未闭合，本页不发布受测结果",
  boundary: "历史分数、名次和旧比较结论当前都不能直接作为选择依据：59b0b5c 的现行 V11R1 入口要求 C1–C10 与 24 个 canonical slots，但 PRODUCT_DESIGN、MODEL_EVIDENCE_SEMANTICS 和 ROUTING_DECISION_FRAMEWORK 仍残留 8-case/八条计分合同；方法与评分基数未统一。REPORTING_STANDARD 已写 C1–C10/10-row，文中的 eight 指除 C5/C7 外其余八个离线案例，legacy bridge 也明确 unranked。最新四个 CI job 仍停在 lint 门，旧测试不继承；本页不发布受测配置结果。",
  metrics: [
    { label: "当前可采用比较", value: "0" },
    { label: "连续案例", value: "10" },
    { label: "计划槽", value: "24" },
    { label: "冲突基数", value: "8 ↔ 10" }
  ],
  facts: [
    { label: "当前能不能拿来选", value: "当前可采用的受测配置比较、分数或排名为 0。产品框架、10 个连续案例和 24 个计划槽已经存在，但 8-case 与 10-case 评分合同冲突、当前 CI lint 未闭合，所以现实选择必须等待方法与验证重新统一。" },
    { label: "当前源码与成品范围", value: "PRIVATE main=59b0b5c9706e76b8abc2d910af484b9d13237009，工作树干净、远端引用 0/0；233 个跟踪文件中有 47 个 Python 核心模块、25 个 schema、59 个测试文件与 6 份报告/模板文件" },
    { label: "问题库与任务绑定", value: "当前核心用 10 个连续案例组成一次 episode，覆盖实现、诊断、连续性、证据和恢复；每次执行独立 workspace，WorkerHandle 同时绑定原始 task id 与 run id" },
    { label: "三类执行路线", value: "同一任务合同显式覆盖 native_managed、local_async_job、cloud_api_async_job；三者共享冻结输入与 verifier，却分别绑定原生谱系、本地 job/GPU lease、云端 request/stream 和路线专属 cleanup" },
    { label: "确定性硬门 + Sol Max 仲裁强审", value: "根侧 verifier 独占 identity、validity、eligibility、safety 与 PASS/FAIL；每个已合格样本再由 fresh exact gpt-5.6-sol / max 隐藏参与者身份，基于完整任务和候选产物做独立六维质量复核，形成可引用、可反驳的推定能力/推定质量" },
    { label: "额度/费用探针", value: "1 题短探针与 10 题全探针各使用固定临时 namespace 和第二阶段精确 cleanup；只帮助观察宿主 UI，永不进入 formal ledger、score、ranking 或 report progress", hero: false },
    { label: "选择与当前验证边界", value: "现行 V11R1/C1–C10/24-slot 入口与仍写 8-case 的旧设计和评分合同相互冲突，因此历史分数、排名和比较当前不可采用；机械与强审冲突仍不平均，最新四个 CI job 也停在 lint 门" },
    { label: "当前源码", value: "Git Owner 回读 PRIVATE main=59b0b5c9706e76b8abc2d910af484b9d13237009，工作树干净，本地与远端引用 0/0。", hero: false },
    { label: "成品范围", value: "当前源树包含 233 个跟踪文件，其中 47 个 Python 核心模块、25 个 schema、59 个 test_*.py 测试文件，以及 6 份报告/模板文件；数量不代表这些文件可原样公开。", hero: false },
    { label: "任务身份绑定", value: "最新提交要求 WorkerHandle 同时绑定原始 task id；即使 run id 相同，只要 task id 不同也会拒绝借用旧 handle。", hero: false },
    { label: "执行路线合同", value: "当前 source-backed（源码可追溯）worker contract 明确定义 native_managed、local_async_job 与 cloud_api_async_job：共用冻结任务和终态语义，分别保留原生谱系、本地 Toolkit/AICLI + GPU lease、云端 provider request/stream 证据。", hero: false },
    { label: "路线证据门", value: "三类路线都要先过精确身份、workspace、工具策略、verifier、终态与清理门；native lineage 只对原生路线必需，本地与云端的 not_applicable 不构成能力缺口。", hero: false },
    { label: "盲质量复核", value: "当前源码把盲质量复核定义为独立生命周期：每个已合格样本对应一个 fresh gpt-5.6-sol / max task、唯一 session、host turn-context receipt、单样本 bundle 和受约束 judgment；六维 rubric 合计 1000 个方法点，但本页不展示任何候选所得分。", hero: false },
    { label: "盲审包边界", value: "blind bundle（盲审包）只允许冻结任务、验收、工具边界、根侧 correctness basis（正确性依据）、可见 fixture/test 与候选 artifact；参与者身份、harness、AA、price、mechanical score、ranking 和其他候选答案在进入 judge 前失败关闭。", hero: false },
    { label: "额度费用探针", value: "config/probes 当前有 1 题短版和 10 题完整版两份固定提示词；每份都把执行与删除拆成两条消息，使用独立固定 namespace，不生成测量回执、不写账本，也不进入分数或排名。", hero: false },
    { label: "最终选择合同", value: "final_selection_release 当前要求机械证据、盲审证据、source commitment、host receipt 与 bundle/rubric generation（合同代）彼此兼容；部分覆盖只保留 pending，不得通过 best-of 或拼接不同尝试生成正式次序。", hero: false },
    { label: "方法合同冲突", value: "当前 V11R1 README 与 AGENTS 要求 24 个 canonical Codex slots、每次 C1–C10 全部终态；PRODUCT_DESIGN 仍写八案例，MODEL_EVIDENCE_SEMANTICS/ROUTING_DECISION_FRAMEWORK 仍固定 case_count=8 与八条 per_case_scores。REPORTING_STANDARD 已对齐 ordered ten-row、case_count=10、weight=0.1；其中 other eight 是除 C5/C7 两个联网例外以外的八个离线案例，legacy bridge 明确 unranked。当前设计/评分合同仍未完全统一。", hero: false },
    { label: "三类执行身份", value: "原生任务、本地异步作业和云 API 异步作业分别保留请求、实际和宿主证明的身份。模型、思考等级、运行框架、提供方和传输绑定必须与冻结任务一致；配置存在不等于已经接入或形成有效样本。这里说明身份验证方法，不列受测配置名单。", hero: false },
    { label: "首报采样策略", value: "first-report sampling policy（首报采样规则）预先固定每种配置采用第一份有效样本，或按明定规则取中位代表。额外有效尝试保留供审查，不事后挑最高结果，也不拼接部分尝试；其他执行框架的补充结果保持独立范围。", hero: false },
    { label: "当前验证边界", value: "当前提交最新四个 GitHub CI job 全部失败，失败门位于 lint；因此当前 commit 的完整测试结论保持 Unknown（证据不足）。", hero: false },
    { label: "公开证据范围", value: "PRIVATE 源保留冻结任务、私有验证与原始证据；公开页完整说明产品、提交、验证范围和明确缺口，但不复制受测配置或比较结果。", hero: false }
  ],
  gaps: [
    "当前提交没有一份绿色 CI 或本轮完整本地回归，因此不能把旧提交的 focused/full 记录继承为当前可验证。",
    "项目当前规则明确既有方法与评估有效性仍需复核；V11R1 的 C1–C10/24-slot 与旧 8-case 评分合同冲突未解决前，即使 CI 变绿，任何历史比较结论也不能作为公开选择依据。",
    "V11 Registry 的 orchestration collaboration 仍写 descendants_allowed=true，而 NATIVE_RUN_OPERATOR/PRODUCT_DESIGN 把正式 arm 定义为 direct-only、无后代；身份合同没有统一前，编排 slot 不能写成已合格。",
    "本轮没有启动新的受测执行、没有调用云端接口、没有运行本地重型推理，也没有生成新的受测结果。",
    "本轮没有为任何受测配置启动 fresh Sol Max 盲审、没有执行额度/费用探针，也没有形成新的 final-selection manifest；页面只发布源码可证明的方法与边界。",
    "源码中的路线、schema 和 synthetic（合成）验证只证明框架边界，不证明任一精确 provider/model/profile 当前可执行；正式接入仍需本机 preflight（预演）与宿主回执。",
    "配置存在不等于授权存在：云端真实调用仍需逐 attempt 的明确付费授权；清理无法确认时不得立即提交替代任务。",
    "私有 holdout、原始执行记录和隐藏失败正文不会进入网页，公开读者无法从本页复算私有结果。",
    "单次执行即使验证通过，也只证明精确任务、精确配置和精确版本，不证明普遍能力。"
  ]
});

export const cacbProject = {
  order: 33,
  slug: "cacb",
  usageEntry: "在负责 CACB 项目的 AI 对话中说想检验哪种工程能力、怎样才算做成，并先问现有题目和规则是否足以开跑。当前评分口径冲突、CI 尚未跑完，不能据此进行完整配置比较；公开网页不接收任务。",
  usageInputs: ["要检验的工程任务或能力", "本人在意的完成结果与禁止边界"],
  title: "CACB Agent 能力基准",
  route: "/projects/cacb",
  visibility: "私有仓库",
  statusTone: "mixed",
  readerBoundary: "评测框架已经形成，但题目数量与评分规则尚未统一，自动检查也未全部通过。当前不能采用旧分数或名次比较配置；这里展示方法和证据，不启动新评测。",
  cardStatus: "评测产品框架已形成；方法与评分有效性仍需复核，历史比较结论当前不可采用",
  cardStatusTone: "mixed",
  ...cacbSnapshot,
  searchAliases: ["模型当前能不能在指定harness用", "官方价格和本地实测成本", "基准失败怎么归因", "缺失外部证据不能填0", "模型证据卡和综合判断报告", "三种执行路线怎么选", "本地GPU和云API执行有什么区别", "取消超时后怎样确认清理", "模型盲评分和盲质量复核", "盲审能不能改变PASS或资格", "一题和十题额度费用探针", "探针结果为什么不进排行榜", "机械分盲审和最终选择怎样分工", "为什么页面没有候选分数和名次"],
  repositoryNote: "源码位于 PRIVATE（私有）仓库，因此本页不提供仓库跳转。页面完整展示已经做成的评测产品、设计取舍、架构与当前验证边界；私有任务样本、隐藏答案、原始执行记录、机器快照和任何受测配置比较结果都不进入网页。",
  summary: "CACB 是一套 Agent 工程能力评测台：用同版真实任务、隔离的工作位置和实际文件，核对这次有没有做成、证据是否可信，再由独立评审解释合格产物的质量。原生、本机和云端执行各自保留身份与结束证据；材料齐全且口径一致时才可能形成身份卡、基准报告和适用选择。当前方法与评分基数仍有 8 对 10 的冲突，最新 CI 也停在 lint，因此没有可采用的完整配置比较、分数或名次。",
  why: "AI 说代码修好了，可能只留下回答、半成品或上次运行的文件。CACB 用同一道可验收的工程题、彼此隔开的工作目录和真实产物，核对这次究竟由谁执行、做成什么、哪里失败。这样才能分清能力问题、题目问题和运行环境问题。",
  plainExample: "假如我要检验 AI 会不会真修代码，而不是只会说“已经解决”：给它一个小项目、失败现象和明确目标，再检查它留下的代码、诊断说明和测试结果。本页会说明怎样让每次尝试拿到同一份输入、待在自己的目录里，以及缺哪项证据就必须写未完成；它不在网页上启动新评测，也不拿旧分数冒充当前排名。",
  result: "目前可以对已记录的一次有界样本交回实际文件、执行身份、检查结果和阻断原因，也能说明现有问题库与三条执行路线怎样工作。方法口径冲突且 CI 尚未完整通过，不能取得可采用的完整配置比较。只有同版样本、客观检查与独立质量复核都齐全后，才会分别形成模型证据卡、基准报告和综合判断报告。公开页不展示受测配置、分数或名次。",
  readerStates: {
    "pass": "将来只有同版任务、实际产物、执行身份和独立检查都闭合，才可以比较；合格产物的质量意见另行保存，不能替它补发客观通过。",
    "problem": "当前方法口径冲突和 CI 缺口仍阻断正式完整比较。即使某次文件看起来做成了，题目、身份、边界或质量证据有冲突时也分别指出，不拿一项替另一项作保证。",
    "unavailable": "拿不到这次任务真实由谁执行、是否结束、文件是否可验，或缺少必需的独立评审时，只交已知事实、阻断原因和下一步，不把缺项算成零分。"
  },
  productPrinciples: [
    {
      "title": "先固定题，再看结果",
      "detail": "参与者要看到相同的目标和允许范围；题目或验收改版就作为新一轮，不能边跑边改。"
    },
    {
      "title": "每次只算自己的产物",
      "detail": "工作目录彼此隔开，旧文件、别人的成功和中断后的拼接不能替这次完成任务。"
    },
    {
      "title": "真实文件先过客观检查",
      "detail": "先看程序行为、禁止范围和任务结束状态，答复说“完成了”不足以通过。"
    },
    {
      "title": "质量意见有自己的位置",
      "detail": "客观条件通过后，才让独立评审解释这一份实现是否稳健、清楚、便于维护；它不能改写客观结果。"
    },
    {
      "title": "匿名也要给足材料",
      "detail": "评审要看到完整题目、验收依据和实际文件，但看不到作者、其他候选及比较信号。"
    },
    {
      "title": "题目允许不同的好解法",
      "detail": "隐藏检查验证行为和边界，不要求所有人照抄参考代码，也不把答案提前交给参与者。"
    },
    {
      "title": "一份证据对应一次执行",
      "detail": "执行者、输入、工作目录、文件和结束状态必须互相对得上；旧回执不能借给新尝试。"
    },
    {
      "title": "先说明为什么失败",
      "detail": "代码没做对、题目本身有缺陷、执行环境坏了或证据拿不到，是不同问题。"
    },
    {
      "title": "缺项保持未知",
      "detail": "单次成功不能证明长期稳定，样本或检查未齐时不能用零分或猜测补齐。"
    },
    {
      "title": "外部资料与本机实测分开",
      "detail": "官方能力、可用性和价格需要当前来源；本地任务只证明这次真实执行，两者不能互相填空。"
    },
    {
      "title": "三类结果分开交付",
      "detail": "身份卡说明测的是谁，基准报告说明实际任务做成什么，综合判断才讨论在证据允许的范围内怎样选。当前完整报告尚未通过方法与 CI 门。"
    },
    {
      "title": "三条路线保留真实差异",
      "detail": "原生、本机和云端可用同一任务目标，但它们的身份、结束和清理证据各自核对；失败不静默换路线。"
    },
    {
      "title": "探针不混进正式成绩",
      "detail": "短探针先回答能否看到额度和费用，确有需要再用较长版本；观察完只清理它自己的临时内容。"
    },
    {
      "title": "每次付费和最终选择由人决定",
      "detail": "云端付费执行逐次核对授权；报告不会自动改写模型设置、权限或用户决定。"
    },
    {
      "title": "外部 AI 是受测对象",
      "detail": "理解、推理和代码执行来自已接入的 AI；CACB 自身负责题目、隔离、证据与验证。"
    }
  ],
  responsibilities: [
    "把真实工程问题整理成有明确输入、目标和边界的题，并固定版本，便于以后复查。",
    "让每次尝试使用独立目录，保留实际执行者、任务、文件与停止状态的对应关系。",
    "独立检查真实代码、行为和禁止修改范围；只有客观条件通过的产物才进入匿名质量复核。",
    "让独立评审只看一份完整题目与产物，说明实现质量；评审意见不能改写客观检查。",
    "把能力不足、题目缺陷、运行环境故障和证据不足分开报告。",
    "原生、本机和云端执行分别核对身份、完成和清理；一种路线失败不伪装成另一种成功。",
    "短探针只观察宿主显示的额度、费用与耗时，随后清理，不混入正式能力结果。",
    "证据齐全且同版时才形成模型身份、真实任务结果和适用选择的三层报告；目前完整比较仍被已知缺口阻断。"
  ],
  exclusions: [
    "公开页不列出受测配置名单、实际分数、名次或比较结论，也不公开私有题目、隐藏检查和原始执行记录。",
    "不拿速度、花费、工具次数或一段自称完成的回答替代真实文件验收。",
    "匿名质量意见不能替代身份、客观正确性和允许范围的检查。",
    "一题或十题额度费用探针不计入正式成绩；未核实的费用不能用于选择结论。",
    "官方说明、外部评测和这台机器上的真实任务分开看；不同口径的数字不混成一个总分。",
    "没有完整同版样本时不先排部分名次，也不借旧结果、别次文件或另一执行路线补空。",
    "云端付费执行要核对每次实际授权；一次已配置或已预演不自动授权下一次调用。",
    "评测不在后台自行运行，也不自动改写用户的模型、权限或现实选择。"
  ],
  glossary: [
    { term: "Benchmark（能力基准）", meaning: "用冻结任务和统一验证方法产生可复核证据；不是宣传性榜单。" },
    { term: "question bank（问题库）", meaning: "定义任务目标、可见输入、允许行为、验收属性和隐藏检查的一组版本化案例。" },
    { term: "episode（评测回合）", meaning: "在同一连续执行中按固定顺序完成整组案例，用来观察长程连续性。" },
    { term: "workspace（工作区）", meaning: "一次执行唯一的隔离目录；参与者只能在这里产生候选产物。" },
    { term: "fixture（固定测试材料）", meaning: "每个执行配置收到字节一致的公开输入，避免任务内容漂移。" },
    { term: "holdout（隐藏验证材料）", meaning: "参与者不可见、只由验证器消费的检查数据，防止针对答案硬编码。" },
    { term: "verifier（验证器）", meaning: "在参与者之外运行的确定性检查器，核对产物、范围、行为和终态。" },
    { term: "identity-blind judge（身份盲评审）", meaning: "每个合格样本独占的 fresh Sol Max 质量复核任务；知道任务和证据，不知道参与者及比较上下文。" },
    { term: "rubric（评分量表）", meaning: "六个固定质量维度及各自上限；它约束解释和证据引用，不授予身份、资格或硬门裁决权。" },
    { term: "quota/cost probe（额度/费用探针）", meaning: "独立于正式基准的一题或十题固定任务，用于观察宿主额度、费用与耗时；完成后按第二条消息清理。" },
    { term: "final selection（最终选择）", meaning: "核对机械 lane、盲审 lane、host receipt、bundle 与代表样本是否同代且完整；不是公开排行榜生成器。" },
    { term: "manifest（清单）", meaning: "记录任务、版本、workspace、文件 hash 和执行约束的机器可读合同。" },
    { term: "receipt（回执）", meaning: "证明某个动作、身份或终态真实发生，并绑定到本次执行。" },
    { term: "fail-closed（失败关闭）", meaning: "证据不完整或身份不匹配时不生成能力结论，不靠猜测补齐。" },
    { term: "contamination（污染）", meaning: "任务或隐藏验证内容被参与者事先看见，导致结果失去解释力。" }
  ],
  operatingFlow: [{"title": "先把现实任务固定", "detail": "明确什么算做成、哪些行为不能做，并固定题目、材料、隐藏检查和版本。现有方法口径冲突与 CI 缺口必须先解决，才谈得上正式比较。"}, {"title": "具备条件后隔离执行", "detail": "每次尝试拿独立工作区，核对执行者实际身份与输入；中断优先沿原任务续，取消后还要确认停止。"}, {"title": "先查产物，再看质量", "detail": "独立验收代码、行为和边界；合格样本才交匿名独立评审，评审意见不能改写客观检查。"}, {"title": "证据齐全才作判断", "detail": "分别交身份卡、基准结果和有范围的综合判断；当前不能发布受测配置排名或分数。"}],
  technicalOperatingFlow: [
    {
      "title": "定义要检验的能力",
      "detail": "先把现实需求写成能验收的任务，说明完整结果是什么、允许怎样做、哪些边界不能跨越。"
    },
    {
      "title": "核对真实模型和可比较的外部资料",
      "detail": "确认精确模型、提供方、版本、运行方式与当前可用条件；价格保留日期和单位，外部结果只有任务、环境与口径可比时才采用。"
    },
    {
      "title": "把题目和验收固定在同一版",
      "detail": "固定参与者能看到的材料、案例顺序、结果结构、独立隐藏检查与版本指纹；开始执行后不原地改题，也不把隐藏答案交给参与者。"
    },
    {
      "title": "按要测的实际使用方式选路线",
      "detail": "分别选择原生宿主管理、本机异步任务或云端API任务。新接法先核对身份与能力，做不产生比较结论的预演，证明同一验收器可以读取结果。"
    },
    {
      "title": "每次尝试使用自己的空工作区",
      "detail": "每个受测配置取得独立目录，全部输出留在本次范围内；跨目录或与别的尝试共享写入时停止，不借旧产物完成新题。"
    },
    {
      "title": "把实际身份和输入对应起来",
      "detail": "由宿主实际记录证明执行者，而非模型自报。原生路线保留父子关系；本地保留任务、配置、模型制品和显卡占用；云端保留提供方、配置、端点和请求，每条都绑定同一输入与允许工具。"
    },
    {
      "title": "提交以后，按原任务查询",
      "detail": "启动先核对绑定再返回任务编号；后续等待只读状态。一轮等待结束不等于底层任务超时，三条路线分别读取各自真实执行状态。"
    },
    {
      "title": "在同一次尝试中完成连续案例",
      "detail": "按固定顺序执行整组题，保留压缩、接续和最终状态；中断优先恢复同一个会话、任务和目录，不拼接不同尝试的半成品。"
    },
    {
      "title": "取消也要确认真正停止",
      "detail": "收到取消请求不算结束：原生任务要确认没有活跃后代，本地要确认进程与显卡占用释放，云端要确认流关闭和提供方终态。没有这份证据就保留清理未确认。"
    },
    {
      "title": "独立检查真实产物",
      "detail": "在参与者之外重跑规定检查，核对文件、行为、测试、身份、资格、范围和最终状态；给出客观通过或失败，隐藏验收材料不进入受测进程。"
    },
    {
      "title": "合格产物再进入独立盲审",
      "detail": "每份合格样本交给一个全新的Sol Max任务，核实真实模型与回合身份；它拿到完整题目、正确性依据和这一份产物，但不知道参与者是谁，也不看其他候选答案。"
    },
    {
      "title": "质量判断逐项指回证据",
      "detail": "分别评任务正确性、要求覆盖、证据质量、稳健性、安全与范围、清晰与可维护性；每项同时指向候选产物和题目依据。质量意见不能改写客观检查的结果。"
    },
    {
      "title": "只想看额度或费用时，另做临时观察",
      "detail": "一题短版先确认宿主界面能否观察额度、费用和耗时；确有需要再用十题全版。两者都在各自专用临时目录内，不进入正式样本、分数或名次。"
    },
    {
      "title": "观察结束后单独清理本次目录",
      "detail": "先核对界面与临时结果，再发独立清理指令，只移除这一份探针目录；目录原本已经存在就不覆盖，清理确认后才可复用相同入口。"
    },
    {
      "title": "失败归因与两类评分分别复核",
      "detail": "区分能力不足、题目问题、执行环境、证据缺失和盲审错误。机械结果从封存输入重算，盲审则重新核对评审材料、回执、判断和引用，不让两类证据互相补空白。"
    },
    {
      "title": "样本齐全且同版，才进入最终选择",
      "detail": "全部必需样本必须使用兼容的材料与评分规则，任务和会话不跨样本复用；客观检查和盲审证据都完整后才选择代表。部分集合继续等待，不先排一个临时总名次。"
    },
    {
      "title": "先交两份独立事实报告",
      "detail": "模型证据卡说明精确身份、官方条件与可比外证；基准报告说明本地真实任务、机械检查、盲审质量、测量和失败。缺项保持未知，不在两份报告间借证。"
    },
    {
      "title": "再形成有适用范围的综合判断",
      "detail": "综合判断报告按资格、能力、经济性和适用任务分别引用前两份交付；口径不能比较就并列说明，不混成一个貌似完整的数字。"
    },
    {
      "title": "保全原始依据，再生成公开说明",
      "detail": "源码归档、题目材料、执行记录、真实身份回执、机械结果、原始盲审和内容指纹一起保存。公开只说明方法、边界与适合公开的汇总，不展示受测配置分数或名次。"
    }
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
    { name: "Sol Max blind & arbitration review（Sol Max 盲审与仲裁强审）", responsibility: "隐藏参与者身份，对每个已经通过身份、有效性、资格和硬门的单一样本做独立六维语义复核，形成可引用、可反驳的推定能力/推定质量。", implementation: "一个 fresh gpt-5.6-sol / max task 对应一个 sample/task/session；judge 只收完整冻结任务、验收、工具边界、正确性依据和候选 artifact。" },
    { name: "Blind bundle & receipt binding（盲审包与回执绑定）", responsibility: "证明 judge 看见的材料、实际模型/effort、输出 schema 和 judgment 属于同一次单样本复核。", implementation: "bundle、case/artifact manifest、source commitment、turn context、host receipt、task/session 与 judgment 都以 SHA-256 互相绑定；复用或漂移即拒绝。" },
    { name: "Quota/cost probes（额度/费用探针）", responsibility: "用固定 1 题或 10 题离线任务帮助观察宿主 UI 中的额度、费用与耗时。", implementation: "short/full 各有固定 namespace；执行阶段最多一次最小修正，第二条消息只精确删除对应目录，且不生成 ledger/score/ranking 记录。" },
    { name: "Scoring & final selection（评分与最终选择）", responsibility: "重放机械证据、验证独立盲审证据，并只从同一兼容代的完整集合中选择代表。", implementation: "机械 envelope 不接受手填总数；生产选择禁用 legacy composite（旧复合）捷径，拒绝 partial、best-of、混代 bundle/rubric 或复用 task/session。" },
    { name: "Failure classifier（失败分类器）", responsibility: "区分能力、任务、执行环境与证据问题。", implementation: "不把 timeout、missing evidence、invalid harness 或未完成统一写成失败。" },
    { name: "Schema & report layer（数据合同与报告层）", responsibility: "把证据包、案例、归档和说明约束成可重放格式。", implementation: "25 个 schema 与报告模板；公开说明保留产品结构和验证事实，私有 payload、受测配置与比较结果不进入网页。" },
    { name: "Model evidence card（模型证据卡）", responsibility: "记录精确模型、提供方、版本、harness 与当前官方能力、可用性、价格和可比外证。", implementation: "每条事实带官方来源、观察日期、单位、适用条件和可比性；缺项保持 Unknown。" },
    { name: "Benchmark report（基准报告）", responsibility: "记录本地 Codex 冻结任务中的真实执行、产物、验证、消耗口径与失败平面。", implementation: "只消费同一次 run 的本地证据，不用官方说明或外部结果填补本地未测项。" },
    { name: "Comprehensive judgment report（综合判断报告）", responsibility: "把资格、能力和经济性转成精确范围内的路由建议。", implementation: "逐层引用前两份交付，不混算不同口径，不把缺失证据归零，也不自动改写全局路由。" },
    { name: "Fast model flow（快速接入流）", responsibility: "为新执行配置准备 workspace、完成门和盲化审阅包。", implementation: "准备、完成检查、证据包与代表选择分开，不由参与者 final answer 直接放行。" }
  ],
  usageExamples: [
    { moduleSlug: "question-bank", ask: "一套新的 Agent 执行方式，怎么做可复现验收？", effect: "页面会说明怎样给它同一版本的任务和独立工作区，再由没有参与作答的固定验收检查真实文件与行为。" },
    { moduleSlug: "deterministic-verification", ask: "任务明明回答“完成了”，为什么还是没有结果？", effect: "逐项看它是否真的结束、产物是否存在、验收是否通过；少任何一层，页面都会把缺口说清楚，而不是相信完成总结。" },
    { moduleSlug: "blind-quality-review", ask: "硬检查通过后，怎样再看工程质量？", effect: "每份合格产物交给不知道参与者身份的独立强审，只看冻结任务、验收依据和候选文件，并要求每个判断都指回具体证据。" },
    { moduleSlug: "blind-quality-review", ask: "盲审觉得质量很好，能不能把失败改成通过？", effect: "不能。客观硬门继续决定样本有没有资格，盲审只解释已经合格产物的质量，两个结论不会互相篡改。" },
    { moduleSlug: "failure-reporting", ask: "这次失败是能力问题还是执行环境问题", effect: "把产物错误、任务缺陷、身份/权限/工具故障和证据缺失分别归因，不把基础设施中断算成能力差。" },
    { moduleSlug: "identity-evidence", ask: "换一种执行方式，还能沿用同一套验证吗？", effect: "先看它能否接收同一任务、留下同一种可核对结果，再做一次代表性预演；真正兼容后才算接入。" },
    { moduleSlug: "identity-evidence", ask: "这次应该走原生、本地还是云端执行？", effect: "先说明三条路线分别在测什么、结果由谁产生；选定后全程保留真实身份，某条路线失败也不会偷偷换成另一条。" },
    { moduleSlug: "identity-evidence", ask: "接入一种新的执行器前，要先证明什么？", effect: "它必须能接收同一任务、留下可追溯的真实产物，并被同一个验收方法检查；做不到就只保留为候选，不进入正式样本。" },
    { moduleSlug: "campaign-workspace", ask: "怎样防止旧执行记录污染新结果", effect: "每次使用全新工作区和执行身份，旧产物、旧回执和上次未完成状态都不能借给新结果。" },
    { moduleSlug: "campaign-workspace", ask: "本地模型执行时，显卡怎样排队和释放？", effect: "开始前确认没有别的任务占用，结束后确认进程、请求和显存都已经退场；释放情况说不清，就先不启动下一份样本。" },
    { moduleSlug: "campaign-workspace", ask: "云端任务取消后，为什么不能立刻重跑？", effect: "电脑上的进程停了还不代表云端请求已经结束；远端结果仍不明确时，页面会保留“清理未确认”，避免第二次提交变成重复执行。" },
    { moduleSlug: "native-orchestration", ask: "一个根智能体怎样拆任务、派帮手并收口？", effect: "页面展示根怎样先确定每个直接帮手的独立职责，再处理冲突、整合文件并完成总体验收；这份结果与单智能体执行分开看。" },
    { moduleSlug: "quota-cost-probes", ask: "什么时候只试 1 题，什么时候再看 10 题？", effect: "先用一个很小的任务确认宿主界面能否观察到额度、费用和耗时；确实需要更完整样本时才跑十题，两者都不产生正式分数。" },
    { moduleSlug: "quota-cost-probes", ask: "观察完额度和费用，临时文件怎么清？", effect: "先保留那一小块临时目录供人核对，确认结束后只删这次探针自己的目录，不顺手清理项目或其他任务。" },
    { moduleSlug: "failure-reporting", ask: "怎样保留失败样本供以后诊断", effect: "执行结束后归档代码、过程回执和失败原因并核对完整性，再释放临时工作区。" },
    { moduleSlug: "identity-evidence", ask: "某个模型现在到底能不能在这条执行路线里用？", effect: "先核对提供方、版本、执行方式和当前可用条件；若这些证据齐全，可形成身份与资格材料。真正做成工程任务仍要另看实际产物，当前完整配置比较尚未可用。" },
    { moduleSlug: "failure-reporting", ask: "官方价格和本地实测成本为什么要分开？", effect: "官方价目按日期、单位和适用条件记录，本地消耗按冻结任务真实测量；综合判断只在口径可比时讨论经济性。" },
    { moduleSlug: "failure-reporting", ask: "缺失外部证据能不能填 0？", effect: "不能。页面会直接写“还不知道”，并说明这项缺口会挡住哪一层结论；未知既不等于零，也不能拿本地证据代填。" },
    { moduleSlug: "failure-reporting", ask: "硬证据齐了，但少一份独立质量复核，还能排总名次吗？", effect: "不能。页面保留已经核对好的样本和明确缺口，但整组选择继续等待，不拿旧意见或别的样本补空位。" }
  ],
  evidenceLayers: [
    { layer: "Current official and external evidence（当前官方与外部证据）", proves: "在给定观察日，精确模型、提供方、版本和 harness 的官方能力、可用条件、价格口径及外部证据可比性。", doesNotProve: "不证明该配置在本地 Codex 冻结任务中真实做成了什么，也不填补本地未测项。" },
    { layer: "Local Codex measurement（本地 Codex 测量）", proves: "同一次冻结任务的身份、workspace、真实产物、验证、消耗口径与失败平面。", doesNotProve: "不自动证明当前官方可用性、公开价格或其他 benchmark 与本地任务可比。" },
    { layer: "Deterministic verifier（确定性验证）", proves: "精确身份、资格、硬边界、终态和候选产物在冻结 verifier 下得到可重放 PASS/FAIL，机械 lane 可从 sealed archive 重算。", doesNotProve: "可见产物的架构、证据表达、稳健性与可维护性已经得到独立质量复核。" },
    { layer: "Identity-blind Sol review（身份盲 Sol 复核）", proves: "一个 fresh exact Sol Max task 对单一样本按六维 rubric 给出候选+案例材料双引用的质量判断，并由 bundle/receipt/judgment hash 绑定。", doesNotProve: "参与者 identity、validity、eligibility、PASS/FAIL 或 safety gate；它也不是真理裁判。" },
    { layer: "Quota/cost probe（额度/费用探针）", proves: "固定 1 题或 10 题离线任务在独立 namespace 内执行，并可供当场观察宿主额度、费用、耗时和临时验证状态。", doesNotProve: "正式样本、能力分、稳定成本、report progress、routing correction 或排名；清理前目录仍明确存在。" },
    { layer: "Final-selection binding（最终选择绑定）", proves: "机械与盲审 raw lanes、host receipt、bundle/rubric generation、代表样本和完整覆盖满足同一兼容合同。", doesNotProve: "网页可以公开候选分数、名次或排行榜，也不自动改写模型路由。" },
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
    { date: "2026-08-08—08-13", title: "从单次测试，发展成可复现的评测台", commit: "连续评测证据链", result: "从有固定答案的单题，发展到能保存连续任务、独立工作位置、实际执行者和结果依据的评测框架。" },
    { date: "2026-08-14", title: "同一套验收开始比较不同执行路线", commit: "ce29323–bb14d37", result: "原生、本机和云端路线开始使用同一工程题与验收方式；各次运行仍保留自己的身份和产物，不互借成功。" },
    { date: "2026-08-15—08-16", title: "从做没做成，扩展到盲审和证据兼容", commit: "8a911fe–e6f7581", result: "增加单份匿名质量意见和独立的额度费用观察，并规定只有同版、完整证据才能选择；现有方法与 CI 缺口仍使完整比较不可采用。" }
  ],
  operationalEntrypoints: [
    { name: "准备问题库 campaign", command: "python scripts/prepare_campaign.py --help", purpose: "从版本化问题库创建冻结 manifest、fixture 与验证目录。" },
    { name: "快速准备执行", command: "python -m cacb.fast_model_flow --help", purpose: "为一个或一批新执行配置生成独立 workspace 和完成门材料。" },
    { name: "验证候选 workspace", command: "python scripts/verify_arm.py --help", purpose: "在参与者之外运行确定性验证并生成结构化摘要。" },
    { name: "盲审、探针与最终选择合同回归", command: "python -m pytest -q tests/test_sol_max_blind_judge.py tests/test_sol_max_judge_batch.py tests/test_quota_cost_probe_prompts.py tests/test_final_selection_release.py", purpose: "验证单样本盲化、exact Sol Max host receipt、两阶段零账本探针和同代最终选择边界。" },
    { name: "核心产品回归", command: "python -m pytest -q <11 focused test files>", purpose: "验证问题库、campaign、workspace、worker contract、fast flow、接入、归档和公开 schema。" },
    { name: "完整回归", command: "python -m pytest -q", purpose: "检查所有历史和当前执行路线；当前存在已明确披露的未闭合项。" }
  ]
};

export const cacbModules = [
  {
    slug: "question-bank",
    usageEntry: "在 CACB 项目的 AI 对话中说明一个真实工程难题，请它先判断能否做成可复查的题。",
    usageInputs: ["真实工程场景和想得到的产物", "不能跨越的操作边界"],
    productFlow: [{"title": "系统核对并处理", "detail": "固定参与者可见材料和独立检查，开跑后不原地改题或把隐藏答案交给执行者。"}, {"title": "交付与接续", "detail": "交回版本化题目与适用边界；标准不完整时先修题，不拿临时印象评分。"}],
    readerStatus: "已有现实任务的问题库和版本化案例，并通过核心测试；本页不展开私有题目，也未启动新评测。",
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
    example: "我要比较两种 AI 能不能真修好同一个仓库。它们看到相同的代码、失败现象和目标，却看不到隐藏检查；最后只看程序行为是否修对，不要求两边写成同一种样子。",
    result: "得到一份可以重复使用的工程题：参与者会看到什么、要做成什么、哪些地方不能碰、怎样独立检查。题目标准不全时先修题，不进入正式评测。",
    readerStates: {
      "pass": "题目给出做事所需信息，检查只看行为与边界，版本固定后可进入已收录问题库。",
      "problem": "若答案只在出题者脑中、只能接受一种写法或结果无法复查，先修题。",
      "unavailable": "缺题目输入、可运行检查或版本依据时，不创建正式评测。"
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
    relation: "向 campaign 模块提供冻结案例；deterministic verifier 消费隐藏验收属性并拥有 PASS/FAIL，blind-quality-review 只消费已过门样本的完整可见任务、正确性依据和候选 artifact。"
  },
  {
    slug: "campaign-workspace",
    usageEntry: "在 CACB 项目的 AI 对话中说：想用已收录的工程题筹备一轮复查，请先告诉我当前能否正式运行、每次尝试怎样隔离。",
    usageInputs: ["想检验的能力或已收录题目", "想看的执行路线（如已有选择）"],
    productFlow: [{"title": "先核对能否正式运行", "detail": "检查题目版本、执行路线与当前方法是否足以比较；评分口径冲突和 CI 缺口未解决时只交准备结论，不启动正式比较。"}, {"title": "条件具备时隔离执行", "detail": "同一输入分别交给选定路线，每次写自己的空目录；通过任务身份查看进度和终态。"}, {"title": "交付与接续", "detail": "交回独立产物与状态；跨目录写入、旧产物混用或清理未确认时停下，不进入比较。"}],
    readerStatus: "已有把同一任务分给不同执行路线并隔离保存的机制；当前代码检查仍有未闭合项，完整正式执行本轮未运行。",
    shortTitle: "隔离执行",
    title: "Campaign 冻结、三路线执行与独立 workspace",
    teaser: "把整组案例、fixture、顺序和验证版本冻结，再让原生受管、本地异步或云端 API 异步路线在唯一 workspace 中执行；三者共享任务语义，但提交、轮询、恢复和清理证据各自闭合。",
    status: "campaign / workspace / archive 与三类 executor 合同已有源码；当前提交的 CI lint 门仍未闭合，本页未启动任何正式路线",
    statusTone: "mixed",
    searchAliases: ["每次测试怎么用干净工作区", "中断后能不能换workspace继续", "原生任务怎样提交和等待", "本地模型GPU lease怎样释放", "云API request stream怎样关闭", "cleanup unconfirmed为什么不能重跑"],
    searchProjection: {
      intents: ["为一次评测冻结任务并创建独立工作区", "在三类执行路线中提交并有界读取状态", "判断中断后能否精确恢复", "确认取消超时和清理真正闭合", "防止旧产物或不同尝试拼接"],
      entities: ["campaign", "workspace / episode", "WorkerHandle", "native_managed", "local_async_job", "cloud_api_async_job", "cleanup_unconfirmed"],
      relations: ["每次执行只属于一个唯一workspace", "start返回的handle同时绑定task和run", "同一episode按固定顺序完成", "本地终态绑定进程树和GPU lease", "云端终态绑定request stream和provider job"],
      failureRecovery: ["案例中断时整次episode保持不完整", "能精确恢复时复用同一session或job和workspace", "无法精确恢复时创建新的完整尝试", "本地或云端资源未清理时保持不可用"]
    },
    value: "条件具备时，同一道题可以在彼此隔开的目录中交给不同执行路线；每次都能查到自己的任务、文件和结束状态。当前方法与 CI 缺口仍阻断完整配置比较。",
    why: "如果第二次尝试读到第一次留下的文件，就无法知道是谁做成的；任务停在电脑端，也不一定代表外部执行或资源已经真正结束。",
    example: "我取消了一次云端任务，电脑上的进度已经停了，却还不能马上重跑。页面会把“本地已停”和“云端是否真正结束”分开显示；只要后一项说不清，就保留清理未确认，免得第二次提交把同一件事做两遍。",
    result: "当前可以核对一轮正式比较需要哪些冻结题目、隔离目录、执行身份和停止证据，并说明阻断原因。待方法与 CI 问题解决后，单次运行才可交回各自的真实产物和状态；目录混用、任务未结束或清理说不清时不能参加比较。",
    readerStates: {
      "pass": "在具备正式运行条件后，每次尝试都有自己的输入、目录、文件和已确认的结束状态，才成为可检查样本。",
      "problem": "旧文件混入、写到别人的目录、只完成部分题目或资源未停稳时，保留诊断并判这次尝试不可比较。",
      "unavailable": "原任务无法继续或外部是否结束不可核实时，说明未决状态；不会偷偷换一条路线补做成成功。"
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
      "冻结 formal campaign。",
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
      "探针只读取提示词内固定数据，不读对话历史、工作区记忆、父/兄弟目录、Git、.agents 或 .codex，不联网、不安装依赖、不调用其他 AI/API。",
      "探针输出只能留在固定 namespace；它不是 formal sample、benchmark evidence、cost receipt 或 routing input。",
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
    relation: "消费问题库并冻结共同 envelope；身份与证据模块决定三条 executor 的精确 binding 和接入资格。本模块只负责 formal start/wait/cancel/result、workspace、资源与归档生命周期，再把唯一执行容器和路线终态交给 deterministic verifier。原生编排和额度/费用探针各由独立模块说明。"
  },
  {
    slug: "native-orchestration",
    usageEntry: "在 CACB 项目的 AI 对话中说明要看单个根模型做题，还是看它调度直接子代理的协作结果。",
    usageInputs: ["同一道工程题或要检验的能力", "单独执行或协作路线的选择"],
    productFlow: [{"title": "系统核对并处理", "detail": "按选定路线启动并记录真实父子关系，协作成果还需看分解、并发冲突和最终整合。"}, {"title": "交付与接续", "detail": "交回这一路线的实际产物和谱系；不能把子代理合作结果算作单模型独立完成。"}],
    readerStatus: "已有分别评估单人完成与带协作者完成的设计和实现；本轮没有新的完整协作验收，不能把两者写成已合格成绩。",
    shortTitle: "原生编排",
    title: "Sol Max 根编排、角色专属交付与独立结果",
    teaser: "把 Sol Max 作为根战略者，单独评测它怎样分解、尽早派发、选择零到四个直接子代理、并发推进、处理冲突、整合产物和完成最终验证。",
    status: "原生编排 source 合同存在；当前 CI lint 未闭合且本轮没有 fresh orchestration E2E，两个 arm 均不能写成已合格结果",
    statusTone: "mixed",
    searchAliases: ["Sol Max根智能体怎样编排直接子代理", "原生单工作者和多代理结果为什么分开", "编排子代理能不能继续派后代", "零个子代理算不算有效选择", "role specific capsule为什么需要"],
    searchProjection: {
      intents: ["评测Sol Max根的任务分解和整合", "冻结零到四个直接子代理选择", "区分单工作者与原生编排结果", "验证根与child的角色专属交付"],
      entities: ["native orchestration arm", "phase S / phase E", "root selection", "role-specific commitment", "authority dispatch manifest", "child lineage"],
      relations: ["根先终态提交选择再由Authority发布", "child不复用root capsule", "编排结果与Sol单工作者分开", "root负责冲突整合和最终验证"],
      failureRecovery: ["role-specific交付不闭合时失败关闭", "第五个child或后代调用被拒绝", "替补重试或额外回合使证据无效", "未形成根最终验证时保持incomplete"]
    },
    value: "同一道题可以区分一个 AI 独自完成，和它分配工作给直接助手后完成。比较时要看实际分工、冲突处理和最后整合，合作产物不能算成单独完成。",
    why: "如果助手继续找帮手、失败后任意换人，或把团队成果记在单个执行者名下，就无法解释真实能力和责任。",
    example: "我想知道“一个 AI 带几名直接帮手”和“一个 AI 独自做”会怎样不同。先核对两条路线是否都能用同一道题留下完整证据；条件具备后，再分别看帮手实际做了什么、根怎样解决冲突和验收。当前不能据此发布完整配置比较。",
    result: "具备运行条件并完成两条独立尝试后，才能分别看到独自完成与协作完成了什么、谁做了哪一步、哪里中断。当前完整比较仍受方法与 CI 缺口阻断。",
    readerStates: {
      "pass": "当根任务、直接助手的身份与交付、冲突处理和最后验收都能回查时，协作样本才成立。",
      "problem": "实际派发、助手身份或整合证据对不上时，这条协作尝试不能算通过。",
      "unavailable": "需要的角色交付或整轮实际运行证据不齐时保留待验；单独执行路线另按自己的证据判断。"
    },
    decisionImpact: ["编排与单工作者是独立完整样本。", "零个child合法但根必须给具体不派发理由。", "最多四个直接child且禁止后代、替补、重复和模型失败后重试。", "CACB只报告冻结arm证据，不创建全局路由、Hook或默认策略。"],
    problem: "解决共享胶囊造成授权冲突、编排调用漂移、后代扩张、替补掩盖失败和多模型能力冒充单模型能力。",
    implementation: ["native_orchestration.py 冻结精确 Sol/max 根、允许 child 身份、最大四个、fork_turns=none、无后代预算和 selection/dispatch/attempt/resolution schema。", "NativeOrchestrationOperator 把 S 选择和 E 执行分开；Authority 只在 selection 终态后发布 child plans、reader、prelaunch receipt 与 manifest。", "实际 call id 只从 raw evidence 学得；每个执行 child 必须有唯一 call→started→output→depth-one lineage，未启动计划只能标 unused。"],
    flow: ["冻结 orchestration arm 与共同 campaign", "Sol Max root在S阶段提交零到四个选择并终态", "Authority校验后发布角色专属child材料", "同一root在E阶段按序直接派发", "回读每个child原始lineage和产物", "root处理冲突并最终验证", "独立发布编排resolution"],
    concepts: [{ term: "native orchestration arm（原生编排路线）", explanation: "以Sol Max为根、直接原生子代理为有界执行者的独立完整样本。" }, { term: "role-specific commitment（角色专属任务承诺）", explanation: "根和每个child分别绑定的任务、身份、plan hash、reader和receipt；child不复用根胶囊。" }, { term: "phase S / E（选择/执行阶段）", explanation: "先让根在无派发时冻结选择，再由Authority发布精确材料后执行，避免边选边改证据。" }],
    boundaries: ["不创建全局路由或默认subagent策略", "不让child继续委派", "不把编排结果并入Sol单工作者", "不允许第五个child、替补、重复或额外回合", "网页不启动任何真实arm"],
    failures: [{ condition: "root/child的capsule、identity、reader、receipt或lineage不闭合", response: "整条arm失败关闭，不回退成单工作者成功。" }, { condition: "出现第五个child、后代、替补或重试", response: "拒绝dispatch或resolution，保留违反冻结边界的raw evidence。" }, { condition: "根未解决冲突或未形成最终验证", response: "保持incomplete，不挑最好子产物冒充整体完成。" }],
    sources: [{ path: "PRIVATE source · src/cacb/native_orchestration.py", role: "Sol Max根、零到四个直接child、两阶段选择/派发与证据聚合" }, { path: "PRIVATE source · docs/NATIVE_RUN_OPERATOR.md", role: "role-specific capsule、Authority dispatch、lineage和失败关闭" }, { path: "PRIVATE source · docs/PRODUCT_DESIGN.md", role: "编排衡量对象、与单工作者分报及不激活全局路由" }],
    verification: ["native orchestration focused tests 在 e6f7581 历史观察代曾存在；该证据不继承到当前 59b0b5c。", "59b0b5c 固定两个独立完整样本 arm、精确 Sol/max 根、零到四个直接 child、role-specific delivery、无后代/替补/重试和分开报告。", "当前 CI 仍在 lint 门失败且本轮未跑 fresh orchestration E2E，因此不发布合格结果。"],
    relation: "消费 question-bank 与 campaign 的冻结输入、identity-evidence 的精确身份和 workspace；独立编排终态交给 deterministic-verification，不影响 blind-quality-review 的单样本盲化边界。"
  },
  {
    slug: "quota-cost-probes",
    usageEntry: "在 CACB 项目的 AI 对话中说只想观察宿主额度、费用或耗时，请先判断一题短探针是否够用。",
    usageInputs: ["想观察额度、费用还是耗时", "是否有必须使用较长探针的原因"],
    productFlow: [{"title": "系统核对并处理", "detail": "先看一题能否得到可观察数据，必要时才运行十题版；探针与正式评测分开。"}, {"title": "交付与接续", "detail": "交回当场观察和精确清理回执；探针不进入能力分数，原目录已存在时不覆盖。"}],
    readerStatus: "已有小任务观察额度和耗时的方法；本轮未运行，没有新的费用、耗时或清理结果。",
    shortTitle: "额度费用探针",
    title: "1题/10题宿主观察与第二阶段精确清理",
    teaser: "在不创建正式样本、账本或分数的前提下，用一个或十个固定离线任务观察宿主界面的额度、费用与耗时；观察完成后用第二条消息只删除固定临时目录。",
    status: "short/full prompt 与合同测试存在；本轮未实际运行探针，没有新的额度、费用、耗时或cleanup现场",
    statusTone: "mixed",
    searchAliases: ["什么时候用一题短探针", "什么时候用十题全探针", "探针为什么不进排行榜", "探针跑完怎样精确删除", "namespace存在为什么停止"],
    searchProjection: {
      intents: ["用一题观察最小额度费用路径", "用十题观察连续宿主表现", "完成后第二阶段精确清理", "防止探针污染正式基准"],
      entities: ["short probe", "full probe", "fixed namespace", "host UI observation", "exact cleanup"],
      relations: ["短探针固定1题而全探针固定10题", "探针退出formal campaign和ledger", "执行与cleanup分两条消息", "namespace存在时拒绝覆盖"],
      failureRecovery: ["短探针一次最小修正后失败就停止", "全探针单题失败保留并继续固定其余题", "cleanup目标扩大时拒绝删除", "观察完成前保留目录"]
    },
    value: "我可以先用很小、固定的任务观察宿主怎样显示额度、费用和耗时，再决定是否值得启动正式基准；这次观察不会被误算成模型能力结果。",
    why: "为了观察额度和费用而临时运行的小任务，不能占用正式评测目录、反复重试或顺手删掉别的内容。",
    example: "我只想先看看一个新模型大概消耗多少额度和费用。它会做一次固定的小转换，让我在宿主界面里看清真实消耗；我确认完后再单独清掉这次临时目录，不把探针结果塞进排行榜。",
    result: "实际执行探针后，得到这一次宿主显示的额度、费用或耗时，以及哪些数字无法可靠换算；再单独核对只清理本次临时目录。它不产生能力结论。当前页面没有重新运行探针。",
    readerStates: {
      "pass": "临时位置原本为空，小任务完成、宿主显示结果已观察，随后只清理这一次内容时，探针才闭合。",
      "problem": "小任务失败就保留真实失败，不能反复抽样挑最好的结果。",
      "unavailable": "临时位置已有内容或无法精确清理时停止，不覆盖或扩大删除范围。"
    },
    decisionImpact: ["只观察额度/费用/耗时时不启动formal campaign。", "先用1题确认最小路径，需要连续十任务观察才用10题。", "执行和删除必须分成两条消息。", "探针永不进入正式账本、分数、排名、报告进度或路由修正。"],
    problem: "解决轻量观察污染正式基准、旧目录覆盖、循环重试挑结果和清理范围失控。",
    implementation: ["universal-quota-cost-short-v1.md 固定一个标准库JSON转换任务、一次最小修正和short namespace。", "universal-quota-cost-full-v1.md 固定十个同结构任务与aggregate验证；每题最多一次最小修正，失败保留真实状态。", "两份prompt都把执行和cleanup拆开；cleanup禁止通配符、git clean、项目清理、父目录或兄弟目录删除。"],
    flow: ["确认目的只是宿主观察", "选择1题或10题固定prompt", "确认对应namespace不存在", "执行并保留临时产物", "观察宿主UI与verifier", "发送第二条exact cleanup", "删除成功后结束且不进入正式链"],
    concepts: [{ term: "short probe（短探针）", explanation: "一个固定离线任务，用最小工作量观察宿主额度、费用、耗时和执行路径。" }, { term: "full probe（全探针）", explanation: "十个固定任务加汇总验证，用于较完整的连续宿主观察，仍不是基准样本。" }, { term: "probe namespace（探针命名空间）", explanation: "short/full各自唯一固定临时目录；存在时拒绝覆盖，观察后由第二条消息精确删除。" }],
    boundaries: ["不读对话历史、父兄弟目录、Git、.agents或.codex", "不联网、不安装依赖、不调用其他AI/API", "不写formal receipt/ledger/score/ranking", "不自动清理或扩大删除", "网页不运行任何探针"],
    failures: [{ condition: "固定namespace已存在", response: "立即停止，不覆盖、不改名；先完成上一轮观察与原第二条cleanup。" }, { condition: "1题一次最小修正后仍失败", response: "停止并保留真实失败与目录，不循环重试。" }, { condition: "10题中一题仍失败", response: "保留该题失败并继续其余固定题，不选优或重抽样。" }, { condition: "cleanup目标不精确或扩大到父目录", response: "拒绝删除，只接受当前工作目录下exact short/full namespace。" }],
    sources: [{ path: "PRIVATE source · config/probes/universal-quota-cost-short-v1.md", role: "1题短探针、固定namespace与第二阶段清理" }, { path: "PRIVATE source · config/probes/universal-quota-cost-full-v1.md", role: "10题全探针、逐题失败保留、汇总与精确清理" }, { path: "PRIVATE source · tests/test_quota_cost_probe_prompts.py", role: "两阶段、零回执、零账本与exact cleanup回归" }],
    verification: ["两份 probe prompt 与 focused tests 在 e6f7581 历史观察代已经存在；该证据不继承到当前 59b0b5c。", "当前 source 固定 short=1题、full=10题、各自namespace、每题最多一次最小修正和独立cleanup消息。", "本轮未运行任何probe，因此没有新的宿主额度、费用、耗时或cleanup结果。"],
    relation: "这是退出 formal campaign 的独立宿主观察工具；完成cleanup后流程结束，不进入 campaign-workspace、deterministic-verification、blind-quality-review 或 failure-reporting 的正式结果。"
  },
  {
    slug: "identity-evidence",
    usageEntry: "在 CACB 项目的 AI 对话中问：这一次工程题的结果真由哪条路线和哪个实际配置产生？",
    usageInputs: ["要核对的某次尝试或产物"],
    readerStatus: "已有核对谁实际执行、用哪条路线和留下哪些结果的机制；部分历史执行证据仍不完整，不能借别次记录补齐。",
    shortTitle: "身份与证据",
    title: "三类 executor 的实际身份、谱系与接入证据",
    teaser: "把谁执行、为何选择这条路线、host/provider/transport 是什么、是否需要 native lineage，以及任务、workspace、动作和终态怎样归属，绑定为不可跨执行借用的证据。",
    status: "三类 executor identity/schema 与共同接入原则已有源码；部分历史 native envelope 在完整回归中未闭合",
    statusTone: "mixed",
    searchAliases: ["当前模型provider版本到底是什么", "某模型在这个harness里现在能不能用", "模型证据卡包含什么", "task id和run id为什么都要绑定", "官方能力和本地实测怎么分开", "native local cloud三种executor怎么选", "非原生为什么没有native lineage", "新harness接入要过什么门"],
    searchProjection: {
      intents: ["确认被研究和被测量的是哪个精确配置", "读取V11R1二十四槽身份矩阵", "在原生本地云端三类执行路线间做用途判断", "核对当前官方能力可用性与价格证据", "证明新harness可接收同一任务并被同一verifier验收", "判断native lineage是否适用"],
      entities: ["model", "provider", "harness", "transport", "native lineage", "executor_kind", "WorkerHandle", "onboarding gate"],
      relations: ["模型证据卡记录当前官方与外部证据", "本地证据绑定同一次task和run", "native_managed必须有parent spawn child谱系", "local_async_job绑定artifact profile engine与broker lease", "cloud_api_async_job绑定provider endpoint request与stream", "非原生路线的native lineage为not_applicable", "官方可用性研究不能替代本地任务实测"],
      failureRecovery: ["模型或harness身份不精确时不进入资格判断", "requested effective attested不一致时失败关闭", "task或run不匹配时拒绝借用旧handle", "新harness缺host receipt时保持研究状态", "宿主证据缺失时保持Unknown而不靠参与者自报", "provider或transport漂移时创建新binding而不继承旧证据"]
    },
    value: "同一道任务可以交给宿主里的原生 AI 助手、本机指定模型，或指定云端服务。先确认这一轮真正由谁执行、用了哪条连接、在哪个独立工作区留下结果；执行者自报的名字不能代替实际执行证据。",
    why: "一次结果写着某个模型名，仍可能由另一配置或旧任务产生。必须让执行者、任务和真实文件互相对得上。",
    example: "一个云端任务把文件做完了，实际执行来源却和我指定的不一样。页面会保留文件供排查，同时明确写“身份不合格、不能参加比较”；内容看着正确，也不能借另一条路线的证明蒙混过关。",
    result: "对一份已有尝试，可以核对实际执行者、执行路线、留下的文件和是否真正结束；对不上时留下排查材料，并明确不能拿它参加正式比较。",
    productFlow: [
      { title: "读取这次尝试的真实记录", detail: "从宿主任务与隔离工作区核对原生、本机或云端路线及实际模型身份，不采信执行者自报。" },
      { title: "对照实际执行与结束证据", detail: "核对启动者、真实模型、任务、工作区、留下的文件和终态；云端任务还要知道服务端是否确实结束。" },
      { title: "决定能否用于比较", detail: "全部对上才把这次结果交给客观检查；有矛盾就保留诊断材料并说明哪个环节不可信。" }
    ],
    readerStates: {
      pass: "实际模型、执行路线、这次任务和文件都能互相对应，且能确认执行和清理结束时，才把这份结果送去比较。",
      problem: "声明的模型、服务、任务或清理结果对不上时，写明矛盾发生在哪一层并保留文件供排查；不借另一条路线的记录补证。",
      unavailable: "宿主或云端服务不给必要的执行、结束证明时，标明证据不足；参与者自述和旧配置不能代替本次结果。"
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
      "config/arms/v11.registry.json 把每个执行配置的 model、effort、harness、provider、transport 与 fallback=false 绑定在一起；单工作者与根编排分别定义，不把多模型合作算成某个模型的独立能力。",
      "配置准入、本机接入、正式样本和可采用结论是不同阶段。当前方法/评分冲突未解决，任何启动配置都不能单独形成比较结论；公开页不列受测名单或逐配置状态。",
      "首报代表按冻结的 first-valid 或中位代表规则选择，额外尝试只作审查证据；禁止事后挑高、拼接不完整尝试或把其他框架的补充结果混入原比较范围。",
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
      { path: "PRIVATE source · schemas/worker-receipt.schema.json", role: "执行回执合同" },
      { path: "PRIVATE source · config/arms/v11.registry.json", role: "24 canonical slots、C1–C10、精确模型/effort/harness/provider 与 launch state" },
      { path: "PRIVATE source · config/formal-sampling.v1.json", role: "第一份有效样本与固定中位代表的首报采样规则" }
    ],
    verification: [
      "model evidence workflow 与 worker contract focused tests 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "current cross-executor design contract 与 schemas 在源码层显式区分 native_managed、local_async_job、cloud_api_async_job，并要求 requested/effective/attested identity；这不证明任何具体配置已完成本机接入。",
      "v11.registry.json 当前 nominal_slot_count=24、episode.case_count=10；这里只公开配置绑定方法、十案例合同与验证边界，不展示受测身份矩阵或候选结果。",
      "完整 native identity envelope 测试当前存在跨代失败，页面没有升级为全绿。",
      "未读取或复制任何真实原始执行日志。"
    ],
    relation: "先为 campaign/workspace 选择并冻结精确 executor binding，再把路线专属 host/provider/transport/lineage/authorization 证据交给执行生命周期；deterministic verifier 只接受同一 task/run/workspace 的匹配 artifact 并拥有样本资格。对已合格样本，identity 模块还要为 blind-quality-review 提供 fresh exact Sol Max 的实际 turn context、唯一 task/session 与 host receipt；这些 judge 身份证据不能反向证明参与者身份。失败报告再按 identity、transport、harness、cleanup、judge-contract 或 model-task 平面归因。"
  },
  {
    slug: "deterministic-verification",
    usageEntry: "让负责 CACB 的 AI 核对某次尝试真正留下的代码或文件，判断任务是否做成。",
    usageInputs: ["要核对的某次尝试或隔离工作区"],
    readerStatus: "已有独立检查任务产物和允许范围的工具；本轮未运行私有验证样本，不产生新的通过结果。",
    shortTitle: "确定性验证",
    title: "身份、资格、硬边界与真实产物的确定性验证",
    teaser: "根侧验证器在隔离进程中检查 participant identity（参与者身份）、sample validity（样本有效性）、eligibility（资格）、文件、行为、测试、隐藏属性、修改范围和终态，给出可重放 PASS/FAIL；它不把最终回答、进程退出或后续盲审意见当成成功。",
    status: "Verifier、公开案例和 CLI 核心路径存在；本页不执行私有 holdout",
    statusTone: "pass",
    searchAliases: ["回答说完成为什么还没结果", "怎样验证真实产物", "隐藏检查会不会限定写法", "越界修改怎么发现", "谁决定样本identity validity eligibility", "谁拥有PASS FAIL和safety gate", "盲审能不能推翻确定性验证", "机械分怎样从sealed replay重算"],
    searchProjection: {
      intents: ["验证Agent是否真的交付了可运行产物", "决定样本身份有效性资格和硬门", "检查候选是否越过允许文件范围", "用隐藏属性避免只针对公开测试", "区分确定性PASS FAIL与后续推定质量证据", "从sealed archive重算机械证据"],
      entities: ["deterministic verifier", "identity / validity / eligibility", "hard gate / safety gate", "hidden property / sandbox", "artifact / scope audit", "sealed replay", "mechanical lane", "PASS / FAIL"],
      relations: ["验证器运行在参与者之外", "身份资格硬边界和PASS FAIL由根侧确定性门拥有", "公开测试通过仍要检查隐藏属性和修改范围", "最终回答与进程退出不能替代产物验证", "盲质量复核只接收已经过门的样本且不能反向改门", "机械证据必须从封存归档和冻结verifier重算而不能手填"],
      failureRecovery: ["verifier指纹漂移时进入新版本", "候选访问隐藏材料时标记污染", "验证超时后终止子进程并保留具体状态", "身份终态或资格缺失时样本不进入盲审", "机械envelope与sealed replay不一致时拒绝评分而不采纳展示数值"]
    },
    value: "先用与参赛者隔离的检查工具核对同一道任务有没有做对：产物是否来自合格的一次执行，功能和隐藏条件是否满足，有没有碰不允许修改的地方。检查通过后，才把这一份实际文件送去独立质量评审。",
    why: "漂亮的最终回答或公开测试通过，都不能证明真实文件满足全部要求；若候选还能改检查工具，结果也不可信。",
    example: "候选产物写得很漂亮，测试也像是过了，可它偷偷改了明确禁止触碰的目录。硬检查会直接把这一项判为不合格，不让它进入质量比较；后面的好评再高，也不能把越界洗成通过。",
    result: "对一份身份已核准的实际产物，得到能重复核对的通过或失败：哪个功能或禁止范围出了问题。客观通过只说明这道题的固定条件满足，质量仍需另看。",
    productFlow: [
      { title: "先核身份和任务", detail: "确保检查的是这次指定执行留下的文件，任务输入和允许修改范围与冻结题目一致。" },
      { title: "独立检查真实产物", detail: "运行公开及隐藏的行为检查，核对禁止范围和完成状态，给每项可重放的通过或失败证据。" },
      { title: "再决定是否进入质量评审", detail: "客观资格不成立就保留具体失败，不让之后的好评把失败改成通过。" }
    ],
    readerStates: {
      pass: "这次身份和题目输入一致，真实文件通过公开及隐藏的行为检查，也没有越过允许修改的范围时，交回客观通过结果；实现质量另行评审。",
      problem: "功能、隐藏条件、文件归属或允许范围有任何一项失败时，指出具体题目和原因；后续好评不能改变这一结果。",
      unavailable: "检查工具、题目输入或这次执行证据对不上时，暂停判定和正式质量评审，不猜一个通过结果。"
    },
    decisionImpact: [
      "验证器不信任候选代码。",
      "隐藏材料不进入候选环境。",
      "检查行为属性而非固定实现。",
      "验证摘要不能冒充宿主身份回执。",
      "identity、validity、eligibility、safety gate 与 PASS/FAIL 是本层独占裁决面。",
      "blind review 产生的是可反驳推定质量证据，不能升级无效或失败样本。",
      "机械 lane 必须从同一 sealed archive、frozen verifier 和 source commitment 重放；展示字段和自洽 hash 不能替代真实输入。"
    ],
    problem: "解决公开测试过拟合、oracle 泄露、候选篡改验证、超时失控和越界修改。",
    implementation: [
      "evaluator.py 管 case verification 与状态。",
      "public_cases_v2 定义可发布的案例行为。",
      "verify_arm.py 提供已完成 workspace 的外部验证入口。",
      "结果包含 workspace/verifier hash 与逐案例状态。",
      "sol_max_blind_judge 的机械 envelope builder 会重新读取 sealed archive、participant replay、case material 与 artifact commitment，拒绝调用者手填或换包。"
    ],
    flow: [
      "确认 campaign 与 verifier 身份。",
      "复制只读验证材料。",
      "在候选之外启动验证。",
      "运行公开与隐藏属性检查。",
      "审计文件范围和终态。",
      "写验证摘要、机械 evidence envelope 与 hash。",
      "只有 identity、validity、eligibility、hard gate 和终态全部闭合的样本，才向 blind-quality-review 发出单样本复核资格。"
    ],
    concepts: [
      { term: "hidden property（隐藏属性）", explanation: "不暴露答案、但可客观检查的行为条件。" },
      { term: "sandbox（隔离环境）", explanation: "限制候选访问 oracle、控制文件和无关路径。" },
      { term: "replay（重放）", explanation: "使用同一输入、版本和验证器再次得到可解释结果。" },
      { term: "eligibility（资格）", explanation: "样本的精确身份、比较基线、终态、工具/范围和确定性证据闭合后，才允许进入对应报告或盲质量复核。" },
      { term: "mechanical lane（机械证据车道）", explanation: "从封存 participant archive 和冻结 verifier 可重复重算的客观证据；不接受参与者声明、盲审意见或手填总数。" }
    ],
    boundaries: [
      "本页不公开 oracle、seed 或私有失败正文。",
      "验证摘要不证明宿主 identity 或工具事件。",
      "合理等价实现必须能通过，不要求复制参考代码。",
      "blind-quality-review 不能创建或修改 identity、validity、eligibility、PASS/FAIL、hard safety gate。",
      "确定性 PASS 不等于“所有质量维度完美”；它只说明冻结验收和硬边界成立，质量推定另由独立盲审解释。"
    ],
    failures: [
      { condition: "Verifier hash 漂移", response: "结果不比较，进入新版本。" },
      { condition: "候选访问隐藏材料", response: "标记污染并拒绝结果。" },
      { condition: "硬超时", response: "终止 verifier 子进程并记录 timeout。" },
      { condition: "盲审给出正面意见但 deterministic gate 失败", response: "保留意见作非正式诊断但不赋予资格、不改 PASS/FAIL，也不进入最终选择。" },
      { condition: "机械 score envelope 能自洽但无法从 sealed evaluator input 重算", response: "拒绝该 lane；不接受重算 hash 后的手填数值。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/evaluator.py", role: "验证器与案例状态" },
      { path: "PRIVATE source · src/cacb/public_cases_v2.py", role: "公开安全案例实现" },
      { path: "PRIVATE source · scripts/verify_arm.py", role: "外部验证 CLI" },
      { path: "PRIVATE source · schemas/case-artifact-v2.schema.json", role: "案例产物合同" },
      { path: "PRIVATE source · src/cacb/sol_max_blind_judge.py", role: "根侧 gate 与 sealed mechanical replay 对盲审/机械 lane 的边界" }
    ],
    verification: [
      "public cases、question bank release 和 verify-related focused paths 在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "完整外部执行 adapter 的若干测试仍失败，未被本模块 PASS 覆盖。",
      "mechanical envelope 与 blind gate contract tests 在 e6f7581 历史观察代已经存在；历史结果不继承到当前 59b0b5c，当前 CI 仍停在 lint。",
      "本轮没有运行私有 holdout，也没有生成新的受测配置比较结果。"
    ],
    relation: "消费问题库隐藏属性、identity/terminal host evidence 和唯一 workspace 产物，输出 identity、validity、eligibility、hard gate、PASS/FAIL 与可重放机械 lane 给失败分类和报告层；只有 eligible 样本才把完整冻结任务、正确性依据与候选 artifact 投影交给 blind-quality-review。后者只能增加可反驳的推定质量/推定能力证据，不能回写本层。"
  },
  {
    slug: "blind-quality-review",
    usageEntry: "对一次已通过客观检查的尝试，要求 CACB 再核对实现质量与维护性。",
    usageInputs: ["要复核的单份已通过样本（有多个时）"],
    readerStatus: "已有让独立评审只看单一样本及依据的实现；当前代码检查与完整评审仍有缺口，本轮没有新的质量判断。",
    shortTitle: "Sol Max 盲审",
    title: "Sol Max 盲审与仲裁强审",
    teaser: "隐藏参与者身份，对已经过硬门的产物做独立六维质量复核。盲审隔离 provenance（参与者来源）、harness（执行环境）、price（价格）、mechanical score（机械分）、rank（名次）和 other candidates（其他候选）；仲裁模型强审则用 fresh exact gpt-5.6-sol / max 做高强度语义复核，产出可引用、可反驳的推定能力/推定质量。",
    status: "单样本 blind bundle、六维 rubric、fresh exact Sol Max host receipt 与 batch binding 已有源码；当前提交 CI 仍停在 lint，本页没有运行或公开任何候选 judgment",
    statusTone: "mixed",
    searchAliases: ["模型盲评分是怎么做的", "盲质量复核看哪些东西", "盲审推定能力是什么意思", "推定质量证据能不能反驳", "为什么每个样本都要新Sol Max task", "盲审为什么不能看到模型和价格", "盲审能不能改PASS FAIL", "为什么不公开盲审分数排名"],
    searchProjection: {
      intents: ["在确定性PASS后独立复核可见产物质量", "从冻结任务和候选artifact形成可反驳推定能力证据", "确认盲审没有参与者或比较上下文泄露", "证明每个样本使用fresh exact Sol Max task", "核对六维判断是否同时引用候选与案例材料", "区分盲质量证据与身份资格PASS FAIL"],
      entities: ["identity-blind judge", "gpt-5.6-sol / max", "fresh task", "blinded bundle", "host turn context / judge receipt", "six-dimension rubric", "presumptive quality evidence", "candidate artifact / case material"],
      relations: ["每个eligible样本独占一个fresh Sol Max task和session", "judge只看冻结任务验收工具边界正确性依据和候选artifact", "参与者provenance harness AA price mechanical points ranking和其他候选被隔离", "六个维度都必须同时引用candidate artifact和case material", "bundle host receipt output schema judgment和raw lanes由hash绑定", "盲审形成可反驳推定质量证据但不能改identity validity eligibility PASS FAIL safety", "最终选择只接受完整同代盲审集合"],
      failureRecovery: ["样本未过deterministic gate时不创建formal blind review", "实际model或effort不是exact Sol Max时拒绝receipt", "task session receipt或turn context复用时拒绝整个assignment", "judge可见材料泄露provenance或比较字段时失败关闭", "dimension缺候选或案例证据引用时拒绝judgment", "bundle artifact case material或receipt hash漂移时重建新revision而不覆盖旧包", "必需样本盲审不齐时final selection保持pending"]
    },
    value: "客观检查通过后，还要有人独立看这份实现是否容易维护、失败时说得清楚、证据是否扎实。评审者只看单个匿名样本的完整题目、验收依据和实际文件，不知道作者是谁，也不看其他候选成绩；Sol Max 的质量判断仍是可追问的意见，不能改写客观通过条件。",
    why: "评审如果先看到作者、价格或别人的成绩，容易带着先入之见；只看最终回答又没有足够材料判断实现质量。",
    example: "两个实现都过了同一套硬检查，但一个只把表面结果凑出来，另一个把失败路径和后续维护也处理清楚。独立评审看不到作者和其他候选，只根据自己收到的任务、验收依据与文件指出具体差别；它能解释质量高低，却不能改写前面的客观通过结果。",
    result: "在样本先通过客观检查并完成一次真实匿名复核后，得到这份实现的质量判断、理由和对应题目与文件依据。它是可追问的意见，不能更改前面的客观结果；材料不足就保持未评。",
    productFlow: [
      { title: "只接收客观检查合格的单个样本", detail: "把这一份题目、验收依据和实际文件组成完整评审材料，隐去作者和其他候选信息。" },
      { title: "独立判断六个质量方面", detail: "评审者逐项给出结论与理由，引用题目和实际产物；不能只凭最终回答或空泛印象。" },
      { title: "保留意见的边界", detail: "来源泄露、依据缺失或材料串到别次任务时拒绝这份评审；客观检查结果仍按原证据保留。" }
    ],
    readerStates: {
      pass: "客观检查先通过、匿名材料完整，指定的独立评审只看这一份题目与产物，质量理由都能回查时，才保存这份可质疑的意见。",
      problem: "作者身份泄露、评审材料串到别次任务、理由找不到题目或文件依据时，拒绝这份意见；已成立的客观检查结果仍保留。",
      unavailable: "样本尚不合格，或缺评审者身份、完整题目与产物时，明确显示质量意见待补，不用零分假装评审已经做过。"
    },
    decisionImpact: [
      "盲审只在 deterministic identity、validity、eligibility、hard gate 和 PASS/FAIL 已完成后开始。",
      "推定质量/推定能力 evidence 可以被具体反例、缺失 artifact、新的确定性重放或另一份合格独立复核反驳；它不被说成真理。",
      "一个样本对应一个 fresh gpt-5.6-sol / max task、唯一 session、唯一 host receipt 和唯一 judgment。",
      "judge 看见完整冻结任务、acceptance requirements、allowed tool boundary、root evaluator correctness basis、visible tests/fixtures 与 candidate artifacts。",
      "judge 不看 participant provenance、model/harness identity、AA、price、mechanical points、ranking、其他候选或其他答案。",
      "六维 rubric 是 task correctness 350、requirement coverage 200、evidence quality 150、robustness 120、safety and scope 100、clarity and maintainability 80；这些是方法上限，不是公开候选结果。",
      "每个维度必须同时引用一条 candidate artifact 和一条 case material，并给出可定位理由。",
      "盲审不能创建或改变 identity、validity、eligibility、PASS/FAIL、safety gate、ranking eligibility 或任何 protected boundary。",
      "raw mechanical lane 与 raw blind lane 分开归档；生产报告/选择不得调用已弃用的历史 composite helper。",
      "机械证据与仲裁强审发生质量分歧时不平均成一个看似确定的总数；硬门不变，分歧、证据引用和 revalidation trigger（重验触发）显式保留。",
      "公开页不显示任何受测配置的 judgment score、total、rank、pairwise comparison 或 leaderboard。"
    ],
    problem: "解决机械 PASS 后仍缺架构/证据/稳健性解释、reviewer 受模型与价格先验污染、跨候选相对比较、评审任务复用、证据引用空泛和主观意见越权改硬门。",
    implementation: [
      "sol_max_blind_judge.py 定义 blinded-artifact bundle v5、blinding policy v5、六维 rubric v2、judgment v3 与 exact gpt-5.6-sol / max identity contract。",
      "root 从 sealed archive 重建冻结 task/acceptance/tool boundary/correctness basis 与可见 candidate answer projection；caller 不能替换成更容易的任务或手填 artifact commitment。",
      "sol_max_judge_batch.py 先生成只要求 READY 的空 fresh-task dispatch；捕获实际 session_meta 与 turn_context 后才写 create-new host receipt、构造 bundle 和 judge-visible payload。",
      "forbidden-value 与 provenance-label scan 排除参与者、harness、AA、price、mechanical score、ranking 和其他答案通道；candidate artifact 被当作 untrusted evidence（不可信证据），不是 judge 指令。",
      "bundle_sha256、case_material_hashes、artifact_hashes、source_commitment_sha256、host_turn_context_sha256、judge_receipt_sha256 与 bound output schema 共同阻断换包。",
      "judgment validator 固定六维顺序、整数范围、total 重算，并要求每维同时引用 bundle 内的 candidate_artifact 和 case_material。",
      "final_selection_release 只接受 unique task/session、完整同代 bundle/rubric 与 raw lane；任一 required sample 缺盲审就保持 pending，不构造正式次序。",
      "contract module 本身不启动模型、API、candidate code 或网络；实际 dispatcher、host evidence capture、归档和最终选择由 root coordinator 拥有。"
    ],
    flow: [
      "根侧先完成 participant identity、sample validity、eligibility、hard gate 与 PASS/FAIL。",
      "从 sealed archive 重放 verifier，并投影完整 frozen case material 与 candidate artifact；生成 source commitment。",
      "构造 participant/harness/AA/price/mechanical/ranking 等 forbidden values，并扫描所有 judge-visible 字段。",
      "为一个 sample 规划一个全新空 gpt-5.6-sol / max task；初始只要求 READY，不提前暴露候选包。",
      "从实际 host JSONL 捕获唯一 session、agent path、turn context、model 和 effort，写 create-new host runtime receipt。",
      "把单一样本 bundle、receipt 与 bound JSON output schema 投递给对应 judge；不附 batch、其他样本或历史 judgment。",
      "judge 按六维分别推定可见质量，每维引用 candidate artifact 与 case material，只返回 schema 对象。",
      "根侧重验 blinding、bundle/judgment/receipt/hash、任务/session 唯一性、维度顺序与 total。",
      "分别归档 host receipt、turn-context evidence、raw mechanical lane 与 raw blind judgment；盲审不能回写 deterministic ledger。",
      "只有所有 required samples 在同一 contract generation 完整闭合，final selection 才能消费；否则保持 pending。"
    ],
    concepts: [
      { term: "rebuttable presumptive evidence（可反驳的推定证据）", explanation: "从完整冻结任务和可见产物推定架构、证据、稳健性与可维护性；结论必须引用可检查事实，并允许被新证据或反例推翻。" },
      { term: "arbitration-strength review（仲裁模型强审）", explanation: "由独立 exact Sol Max 对主观质量和证据分歧做高强度语义复核；只增加可引用推定证据，无权覆盖 identity、eligibility、deterministic PASS/FAIL 或 safety。" },
      { term: "fresh judge task（全新评审任务）", explanation: "只处理一个样本、没有旧候选上下文的 exact gpt-5.6-sol / max task；task、session、receipt 都不可复用。" },
      { term: "blinded bundle（身份盲审包）", explanation: "含完整任务/验收/工具边界/正确性依据和候选 artifact，但不含参与者来源、harness、价格、机械分、排名或其他答案。" },
      { term: "dual evidence citation（双类证据引用）", explanation: "每个质量维度都要同时引用 candidate artifact 与 frozen case material，防止只凭感觉给结论。" },
      { term: "raw lane（原始证据车道）", explanation: "机械重放和 Sol 盲审分别保存原始、可重验产物；最终选择可以检查二者，但不能把一个缺口用另一个补齐。" }
    ],
    boundaries: [
      "盲审不是 identity provider、validity verifier、eligibility gate、PASS/FAIL owner、safety authority 或真理裁判。",
      "quality judgment 只能解释 bundle 内可见证据；不得使用外部先验、联网研究、价格、AA、机械分、排名或其他候选。",
      "safety_and_scope 维度只评估 artifact 中可见的边界纪律，不能签发或撤销真实 safety gate。",
      "一个 judge 不得看到 batch、另一个 sample、另一个 answer 或先前 judgment，也不得继续委派。",
      "rubric 方法与 schema 可公开，任何受测配置实际 dimension score、total、rank 和 leaderboard 不公开。",
      "没有 fresh exact Sol Max host evidence 时保持 unavailable；不能用 prompt 自称、静态配置或旧 receipt 补齐。",
      "质量推定即使正面，也不能救回 deterministic FAIL；即使负面，也不能篡改已经记录的机械 PASS，只能作为独立解释。",
      "机械与强审冲突不做算术平均、不制造总分；保留 hard gate、quality disagreement 和 pending，等待新的同代证据。"
    ],
    failures: [
      { condition: "样本未通过 identity/validity/eligibility/hard gate", response: "不创建 formal blind review；保留 deterministic failure plane。" },
      { condition: "host turn context 不是 gpt-5.6-sol 或 effort 不是 max", response: "拒绝 receipt 和 bundle，盲质量 lane 保持 unavailable。" },
      { condition: "task、session、turn-context 文件或 receipt 在样本间复用", response: "拒绝 assignment set；每个样本必须重新创建独立 judge。" },
      { condition: "judge-visible 文本出现 participant provenance、harness、AA、price、mechanical score、ranking 或其他答案", response: "blinding scan 失败关闭，不做文字替换式掩盖。" },
      { condition: "某维只引用候选或只引用案例材料", response: "judgment schema 拒绝；补齐真实 bundle 内双类证据后创建新 revision。" },
      { condition: "bundle、artifact、case material、source commitment、receipt 或 judgment hash 漂移", response: "拒绝换包；保留旧 revision，按新 evidence 生成 create-new successor。" },
      { condition: "required sample 的盲审缺失或合同代不同", response: "final selection 整体保持 pending，不输出 rank，不拿旧 judgment 或其他样本补位。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/sol_max_blind_judge.py", role: "单样本盲审、六维 rubric、blinding、bundle/judgment/receipt/hash 合同" },
      { path: "PRIVATE source · src/cacb/sol_max_judge_batch.py", role: "fresh task wave、actual host turn context、唯一 task/session 与 judge-only payload" },
      { path: "PRIVATE source · src/cacb/final_selection_release.py", role: "同代 raw lanes、unique judge assignments 与 incomplete-no-ranking 最终选择门" },
      { path: "PRIVATE source · tests/test_sol_max_blind_judge.py", role: "信息完整、身份隔离、双引用、sealed replay 与不可手填机械 lane 回归" },
      { path: "PRIVATE source · tests/test_sol_max_judge_batch.py", role: "fresh exact Sol Max host receipt、唯一任务/session 与单样本 payload 回归" },
      { path: "PRIVATE source · tests/test_final_selection_release.py", role: "机械/盲审分车道、同代选择与 pending 不归零合同" }
    ],
    verification: [
      "sol_max_blind_judge、sol_max_judge_batch 与 final-selection focused tests 在 e6f7581 历史观察代已经存在；该历史证据不继承到当前 59b0b5c，当前 CI 仍在 lint 门失败。",
      "当前源码静态合同明确 required judge model=gpt-5.6-sol、effort=max、exactly_one_sample=true、fresh_task=true，并禁止 judge 改 identity/validity/PASS/FAIL/eligibility/safety gate。",
      "本轮没有启动任何受测样本的 judge task、没有读取 private judgment/raw rollout，也没有生成或公开候选分数、比较或名次。"
    ],
    relation: "上游 deterministic-verification 独占 identity、validity、eligibility、hard gate、PASS/FAIL 和 sealed mechanical lane；identity-evidence 提供 judge 自身 fresh exact Sol Max 的实际 host receipt；campaign-workspace 提供唯一 source archive。盲审模块只增加可反驳的推定质量/推定能力 raw lane，并把证据与 hash 交给 failure-reporting/final selection；它不回写上游，也不消费 quota/cost probe。"
  },
  {
    slug: "failure-reporting",
    usageEntry: "在 CACB 项目的 AI 对话中问某次尝试为何没完成、现在能凭哪些结果判断。",
    usageInputs: ["要解释的某次尝试或失败现象"],
    readerStatus: "已有分开报告任务失败、证据缺失和质量分歧的机制；完整报告链仍未闭合，不据不完整材料作比较结论。",
    shortTitle: "失败与选择",
    title: "失败归因、机械/强审分车道与最终选择",
    teaser: "把能力、任务、执行环境、机械验证、Sol Max 仲裁强审和证据问题分开，先保存可重放 raw lanes，再验证同代兼容性。机械与强审冲突不平均：硬门保持，质量分歧或 pending 显式保留；公开页不展示候选分数、名次或排行榜。",
    status: "失败语义、归档、机械 envelope、blind judgment 与 final-selection compatibility gate 已有源码；当前 CI lint 未闭合，完整报告链仍有已披露缺口",
    statusTone: "mixed",
    searchAliases: ["官方价格和本地实测成本为什么分开", "基准报告和综合判断报告有什么区别", "失败是模型还是环境", "机械分盲审最终选择怎么分工", "机械与Sol Max强审冲突怎么办", "盲审缺一份为什么最终选择pending", "为什么公开页没有候选排行榜", "额度费用探针失败进不进报告"],
    searchProjection: {
      intents: ["区分能力任务执行环境盲审和证据失败", "理解机械证据与推定质量证据的职责", "验证最终选择是否使用完整同代样本", "保留机械与仲裁强审的质量分歧", "分别生成模型证据卡与本地基准报告", "按资格能力经济性形成范围内路由建议", "处理价格外部证据或blind lane缺失", "确保公开说明没有候选分数名次排行榜"],
      entities: ["failure plane", "mechanical lane", "Sol Max arbitration review", "raw judgment / final selection", "contract generation / pending", "model evidence card", "benchmark / comprehensive report", "qualification / economics / Unknown"],
      relations: ["deterministic verifier拥有identity eligibility hard gate和PASS FAIL", "机械lane从sealed replay重算", "Sol Max强审提供可反驳推定能力推定质量", "机械与强审冲突不平均且不改硬门", "最终选择要求完整同代bundle rubric和唯一task session", "缺blind judgment时整代pending不排名", "quota cost probe永不进入formal ledger或report progress", "公开页面不展示候选分数名次leaderboard"],
      failureRecovery: ["基础设施失败时不形成能力结论", "机械envelope不能重算时拒绝展示数值", "blind judgment缺证据或hash不符时只关闭盲审lane", "机械与强审分歧时保留hard gate等待同代复核", "required sample缺失时final selection保持pending", "价格口径不可比时并列呈现而不混算", "证据文件缺失或指纹不符时保留blocker", "探针失败只保留临时诊断并按第二阶段清理"]
    },
    value: "比较没有完成时，先分清任务没做对、执行环境或身份出了问题，还是独立评审缺材料。客观检查说明题目和硬边界是否通过；Sol Max 的匿名评审说明实现质量怎样；最终选择只在同一套必需证据齐全时形成。",
    why: "代码没做对、题目有缺陷、环境中断和身份说不清，不能统一算成能力差；缺少一份质量意见也不能先发半张榜。",
    example: "一组样本的文件和硬检查都齐了，偏偏少一份独立质量复核。我问“能不能先发排行榜”，答案仍是不行：已经核对好的结果会保留，缺的那份也清楚列出，但整组选择继续等待，不拿旧意见补位，也不先放出半张榜。",
    result: "现在可对具体一次尝试交回已知产物、失败类别、证据缺口和继续条件。只有完整同版样本与独立评审都齐全，才进一步形成正式报告和适用选择；目前不发布配置比较或排名。",
    productFlow: [
      { title: "逐次解释失败", detail: "把任务本身失败、环境或执行身份问题、客观检查未过和质量意见分歧分开记录。" },
      { title: "只汇总同一代完整材料", detail: "检查所需样本、客观结果、匿名评审和代表规则是否齐全且属于同一套标准。" },
      { title: "交回可用的判断", detail: "证据齐全才形成对应比较；不齐时保留已有材料、准确列出待补项，不用旧意见填空。" }
    ],
    readerStates: {
      pass: "方法口径冲突解除、同一套标准所需样本及客观与独立质量证据都齐全时，才形成相应比较判断。当前这些条件尚未全部满足。",
      problem: "题目、身份、客观结果或质量解释互相冲突时，按每个样本写出事实和阻碍，不用一个平均数盖过去。",
      unavailable: "任何必需样本或执行、检查、评审证据缺失时，只交回已知结果、未知项与补验条件，不发表受测配置的比较结论。"
    },
    decisionImpact: [
      "基础设施问题不转成能力问题。",
      "任务缺陷进入新版本，不回写旧结果。",
      "当前官方能力、可用性、价格和可比外证与本地 Codex 测量分开保存，不用一条车道补另一条空白。",
      "机械 score 只来自 deterministic sealed replay；Sol Max 强审只提供可反驳推定质量/推定能力，两条 raw lanes 互不补证。",
      "机械与强审冲突不平均成总分：hard gate 和 PASS/FAIL 保持，quality disagreement、pending 与 revalidation trigger 显式保留。",
      "final selection 只做同代兼容与代表选择，不发明分数；禁止 partial merge、best-of、旧 judgment 补位和 task/session 复用。",
      "1 题/10 题额度费用探针的完成、失败、UI 观察和 cleanup 都不进入 formal report、score、ranking 或 routing correction。",
      "先判断资格，再说明能力与经济性，最后才给精确范围内的路由建议；任何缺失证据都不归零。",
      "先归档，后释放临时 workspace。",
      "公开报告只含安全聚合与可复现元数据；本网页进一步排除所有候选分数、名次、比较表和 leaderboard。"
    ],
    problem: "解决失败归因混乱、历史重写、证据丢失、报告口径漂移和私有内容外泄。",
    implementation: [
      "failure state 在 campaign/evaluator/finalizer 间保持枚举语义。",
      "task_workspace_archive 保存代码、trace、receipt 与 validity reason。",
      "sol_max_blind_judge 从 sealed archive 重建 mechanical source commitment 与 envelope，且生产报告/选择禁用 deprecated compose_dual_score 历史 helper。",
      "sol_max_blind_judge 与 sol_max_judge_batch 分别验证 blind bundle/judgment 和 fresh exact Sol Max task/session/host receipt。",
      "final_selection_release 重验 source archive、mechanical envelope、blind judgment、bundle/rubric generation、unique assignments 与 representative policy；缺完整覆盖就 pending。",
      "config/first-report-policy.v1.json 把代表选择和额外有效样本的 audit-only（仅审计）保留写成显式兼容合同，不做 best-of。",
      "export / report schema 约束公开安全输出。",
      "公开报告只解释产品与证据边界，不消费受测配置比较结果。"
    ],
    flow: [
      "核对精确模型、provider、version、harness 与官方证据观察日。",
      "把当前能力、可用性、价格单位和外部可比性写入模型证据卡。",
      "收集案例与终态。",
      "从 sealed archive 重算 deterministic mechanical lane，验证 identity、validity、eligibility、hard gate 和 PASS/FAIL。",
      "验证每个 eligible sample 的 fresh Sol Max host receipt、blind bundle、六维 judgment 和双类证据引用。",
      "分别归档 raw mechanical envelope 与 raw blind judgment，不做 composite 平均。",
      "判定 failure plane。",
      "归档产物与 hash。",
      "核对 required samples 是否使用同一 bundle/rubric contract generation、unique task/session 和冻结代表规则；不完整就保持 final-selection pending。",
      "把本地机械实测、可反驳推定质量、质量分歧、pending 和失败平面写入基准报告。",
      "按资格、能力、经济性和适用范围生成综合判断报告。",
      "应用 public/private 边界。",
      "列出重验触发。"
    ],
    concepts: [
      { term: "failure plane（失败平面）", explanation: "能力、任务、执行环境或证据问题所在的责任层。" },
      { term: "infra invalid（执行证据无效）", explanation: "基础设施或身份链不满足，不能形成能力结论。" },
      { term: "schema-backed report（数据合同报告）", explanation: "字段、状态和限制由机器合同约束的报告。" },
      { term: "mechanical evidence envelope（机械证据信封）", explanation: "从封存任务、participant replay 和冻结 verifier 重算并 hash 绑定的客观 lane；展示值不能由调用者手填。" },
      { term: "quality disagreement（质量分歧）", explanation: "deterministic hard gate 与仲裁强审关注面不同，或两份合格质量证据不一致；系统保留分歧，不算术平均、不偷改 PASS/FAIL。" },
      { term: "contract generation（合同代）", explanation: "bundle schema、blinding policy、rubric、judgment schema、mechanical basis 与选择规则的兼容组合；不同代不能混排。" },
      { term: "representative selection（代表选择）", explanation: "按冻结政策从每个 treatment 的合格证据中选定唯一报告代表；不是挑最高分，也不删除未选审计证据。" }
    ],
    boundaries: [
      "网页不展示任何受测配置的 mechanical score、blind dimension score、total、rank、pairwise comparison、leaderboard 或数字比较。",
      "私有 raw trace、prompt、holdout 和机器快照不公开。",
      "官方说明、外部 benchmark 与本地 Codex 任务证据不得合并成一条来源；仅在身份、任务、环境和计量口径可比时建立关系。",
      "能力结论、经济性和路由建议是不同层；缺价格、缺外证或缺本地测量时保留 Unknown，不填零、不混算。",
      "Sol Max 仲裁强审只能处理主观质量与证据分歧；不能覆盖 identity、eligibility、deterministic PASS/FAIL、hard safety gate 或 protected boundary。",
      "机械与强审证据不得平均成一个掩盖冲突的总数；final selection 只消费合同允许的独立 raw lanes。",
      "探针结果和 cleanup 状态不进入正式报告；它们只属于当场宿主观察。",
      "报告建议不自动改变全局规则或能力路由。"
    ],
    failures: [
      { condition: "证据文件缺失或 hash 不符", response: "报告保持证据不足并保留 blocker。" },
      { condition: "官方能力、价格或外部证据已过期", response: "只把对应模型证据卡字段降为 Unknown，按当前官方来源重查；不删除仍有效的本地任务证据。" },
      { condition: "官方价格与本地消耗口径不可比", response: "分别保留单位、日期和条件，不换算、不混算，也不据此形成经济性结论。" },
      { condition: "机械 evidence envelope 无法从 sealed source 重算", response: "机械 lane 关闭并记录 blocker；不接受自洽 hash 或手填显示值。" },
      { condition: "Sol Max judgment 缺 fresh host receipt、双类证据引用或 bundle binding", response: "只关闭 blind lane，保留 deterministic 事实；required sample 因此使 final selection pending。" },
      { condition: "机械硬门与仲裁强审质量解释冲突", response: "hard gate 和 PASS/FAIL 保持；单列 quality disagreement、证据引用与重验触发，不平均、不覆盖。" },
      { condition: "required samples 不齐、bundle/rubric 代不同或 judge task/session 复用", response: "拒绝 final selection 次序，整代保持 pending。" },
      { condition: "额度/费用探针任务失败或 namespace 尚未清理", response: "只保留临时诊断并执行 exact 第二阶段 cleanup；不写正式 report 或分数。" },
      { condition: "任务本身有缺陷", response: "撤出受影响案例并创建新版本。" },
      { condition: "公开输出含私有 payload", response: "PUBLIC gate 阻断，不做界面隐藏式补救。" }
    ],
    sources: [
      { path: "PRIVATE source · src/cacb/task_workspace_archive.py", role: "执行归档与 hash" },
      { path: "PRIVATE source · src/cacb/export.py", role: "公开安全导出" },
      { path: "PRIVATE source · src/cacb/sol_max_blind_judge.py", role: "sealed mechanical envelope、独立 blind judgment 与 deprecated composite 边界" },
      { path: "PRIVATE source · src/cacb/final_selection_release.py", role: "同代 raw lanes、代表策略、unique assignments 与 incomplete-no-ranking 门" },
      { path: "PRIVATE source · config/first-report-policy.v1.json", role: "每 treatment 代表、额外样本 audit-only 与非 best-of 选择合同" },
      { path: "PRIVATE source · schemas/public-run-report.schema.json", role: "公开报告数据合同" },
      { path: "PRIVATE source · docs/REPORTING_STANDARD.md", role: "失败、证据和限制写法" }
    ],
    verification: [
      "workspace archive、worker contract 与 public report schema 核心回归在 e6f7581 历史观察代曾通过；该证据不继承到当前 59b0b5c。",
      "完整 report/finalization 历史路径仍有失败，页面保留 mixed。",
      "mechanical/blind/final-selection focused contracts 在 e6f7581 历史观察代已经存在；历史结果不继承到当前 59b0b5c，当前 CI 仍停在 lint。",
      "网站内容没有复制任何私有报告正文或受测比较结果。"
    ],
    relation: "消费 deterministic-verification 的 identity/eligibility/PASS/FAIL 与 mechanical raw lane，消费 blind-quality-review 的可反驳推定质量 raw judgment，并从 campaign/identity 模块重验 source archive、host receipt 和 unique task/session。final selection 只核对同代完整性与代表规则；quota/cost probe 永不进入。公开报告保留硬门、质量分歧、pending 和重验触发，但排除所有候选分数、名次与排行榜。"
  }
];

export const project = cacbProject;
export const modules = cacbModules;
