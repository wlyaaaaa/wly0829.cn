import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以用于当前帮助", "需要分辨", "当前不可用"];
const sourceMainCommit = "140105123955df01b02484ee900904f1762503e6";
const observedAt = "2026-09-07T20:52:45.4152792Z";
const wrapperCommand = "pwsh -NoProfile -File .\\daily-preferences.ps1";

const dailyPreferencesSnapshot = createProjectSnapshot({
  observedAt,
  label: "v0.12.0 已形成个人理解、来源证据与可靠领域回写；73 个来源、48 张当前认知卡和 185+7 项回归已聚合核对",
  boundary: "本页核对产品源码、合同与只读聚合，没有读取 CURRENT、PROFILE、私人原话或健康个体值。导入、阅读、形成理解、领域接收和回答时实际使用分别验收；48 张卡或检索非空不证明已经全面理解本人。按需增量继续有效，未来独立领域不会因为共用背景而自动创建。",
  metrics: [
    { label: "当前明示", value: "71 条" },
    { label: "当前认知卡", value: "48 张" },
    { label: "来源实例", value: "73 个" },
    { label: "源码回归", value: "185 Python + 7 Node" }
  ],
  facts: [
    { label: "项目到底形成什么", value: "形成可修正、能直接用于帮助本人的基本背景、真实经历、生活重点、价值取舍、认知和偏好。当前 71 条明示、32 条历史明示与 48 张 current 认知卡；旧认知有 138 张历史、152 张 stale。这些是存储状态，不是人格定论、阅读覆盖或理解质量分数。" },
    { label: "当前数据状态", value: "2026-09-07 只读聚合：190,266 条 current 记录、232,496 条总版本、42,230 条历史版本；schema 6、quick_check=ok、外键问题 0。本轮未展开记录正文，也没有把数据量当作已理解的材料量。" },
    { label: "当前来源", value: "73 个来源实例中 12 个 acquired_verified（来源已取得并核对）、61 个 snapshot_only（只有快照），涵盖 16 类逻辑来源。新增加的已核引用仍保留其微信原生、ASR 派生或附件身份；来源实例数量不等于独立经历、完整阅读或新事实。" },
    { label: "先形成有用理解", value: "summary 先讲典型经历的意义、核心取舍、明确评价及对当前判断的影响；detail 展开经历、推理、反例和限制；evidence 保留出处。核实是校准理解的手段，不能让默认入口只剩流程记录。" },
    { label: "按问题展开", value: "profile --index 提供摘要导航和原文候选短预览，--key 可一次读取多张完整卡与相关明示；已知键或已有足够背景时直接使用，重要矛盾才补原文。索引命中、引用关系、片段和完整阅读分别说明。" },
    { label: "领域使用与回写", value: "工作、学习、文书和健康需要本人背景时按需使用这里；有依据且可复用的新本人认识在当前任务回写并回读。专业事实、行动、对象和动态状态仍属于独立领域，未来社交与财务不因此提前建空项目。" },
    { label: "可靠回写", value: "delivery-id 固定本次投递，caller-project 与 origin-ref 保留出处，expected-current-id 阻止旧任务覆盖新更正；重试返回 idempotent，内容未变返回 no_change，版本或载荷冲突必须先读现状再判断。" },
    { label: "按需自动增量", value: "用户在任意新对话只需说“更新偏好”或同义意图，AI 就在本次对话内完成来源取得、去重导入、偏好判断、失效快照重建和自然问题回验。它不创建后台任务、服务、队列、定时器或 watcher（文件监视器）。" },
    { label: "哔哩哔哩上次专项观察", value: "2026-09-04 专项观察保留：数据库播放 3,382 条、Chrome 窗口 1,349 条，719 收藏、4 稍后看、277 带类型追番/追剧、20 点赞与 2 投币。本轮没有启动浏览器刷新；这些旧聚合继续说明数据库与平台窗口的口径差异，不冒充 2026-09-07 实时数量。" },
    { label: "自动与人工来源分开", value: "Chrome 历史与书签、Steam 本机观察可直接刷新；哔哩哔哩先从现有 Chrome 生成材料库快照再增量导入。Google Play、航旅纵横和 12306 没有新人工包时保持不变，不伪装实时刷新。" },
    { label: "当前来源取舍", value: "银行交易、京东订单、拼多多订单、美团订单和菜鸟物流 5 类尚无材料，继续保留未来范围；YouTube 与地图活动已被本人明确排除，不再当作待补来源。平台可见窗口、Steam 历史取得方式和人工包的新鲜度仍各自说明。" },
    { label: "全额退款会改写有效结局，不会抹掉历史", value: "订单只证明买过或点过，支付只补渠道旁证。成功订单或支付后来被可靠同订单链的已完成全额退款覆盖时，原下单、支付和退款事实都保留，但有效结局变成 refunded_full（已全额退款），退出普通 evidence（偏好证据）、复购计数和快照支持。部分退款、组单、多商品、跨渠道同号或关联不唯一继续保持 partial/Unknown，不猜整单。" },
    { label: "B 站移除只退役当前强信号", value: "收藏、稍后再看和追番/追剧只有在同账号、Schema/range 一致、分页完整、计数一致且成员键无重复时，缺失成员才局部退出 current 并保留历史；依赖它的推定会 stale。播放、点赞和投币属于窗口流，不按消失清退；移除从不自动解释成“不喜欢”。" },
    { label: "时间只调整排序", value: "来源、语义与状态相当时，近期证据得分更高；久远但仍有效的成功记录、跨时间复购和未被更正的本人明示不会自动过期。低频、长期没买或没有记录只表示证据较弱或 Unknown（未知），不等于不喜欢。", hero: false },
    { label: "接入结果不是推荐结果", value: "refresh 与 ingest 会分别报告 completed、no_change、partial 或 failed，以及来源、记录、缺口与失效快照；接入只更新证据和状态，不自动生成推荐。新候选仍由 Skill 与 AI 依据有效证据组织。", hero: false },
    { label: "重复刷新验收", value: "2026-09-04 的 v0.9.1 专项观察：稍后再看从 5 条变为 4 条，只退役缺失 1 条并保留历史；紧接重复刷新为 no_change、局部退役 0。该次实现盲更新对话完成三类自动来源与语义闭环，不继承为 2026-09-07 v0.12.0 的本轮 E2E。", hero: false },
    { label: "偏好增量怎样才算完成", value: "保存材料或运行 ingest 都只是中间步骤；还要回读覆盖与缺口，判断偏好新增、增强、减弱或仍未知，重建仍有充分证据的失效快照，并用普通自然问题核对现行明示、快照和证据。若语义无变化，也必须明确报告这个结论。", hero: false },
    { label: "Steam 行为边界", value: "2026-09-04 专项观察有 118 条已玩游戏、6 条已玩应用、8 条未玩游戏观察和 33 条其他应用观察；本轮未刷新 Steam。普通游戏偏好只使用已玩且分类为游戏的记录；累计启动时长不参与评分，当前免费只在其他条件相同时低 0.5 分。", hero: false },
    { label: "具体事实回读", value: "facts 现在既能说明曾下单/支付，也能回读后来可靠全额退款及 full_refund_count；普通偏好只消费仍有效结局。部分退款、组单、跨渠道同号或关联不唯一保持 partial/Unknown。", hero: false },
    { label: "来源制品与备份", value: "Chrome 与 Google Play 可由同一 Google Takeout ZIP 派生为两个独立来源 occurrence（来源出现关系）；用户投递原件和哔哩哔哩实时快照进入 PersonalData 材料库的来源投递区。数据根与这些原件都处在现有 PersonalData 自动备份范围，不另建第二套备份服务。", hero: false },
    { label: "源码验证", value: "PRIVATE main=1401051，解析版本 daily-preferences.v0.12.0、schema 6；本轮 185 项 Python 测试及 14 个子测试、7 项 Node 测试通过。新增覆盖认知详卡、引文、投递幂等、旧版本冲突、来源过滤和自然原文召回；不替代本人的真实建议取用验收。", hero: false },
    { label: "索引清洗边界", value: "本地索引在特定支付、信用卡与行程字段中掩码 email（邮箱）、独立 7–19 位数字和支付方式末四位；它不是全局匿名化，普通商品、平台、时间与偏好事实继续保真。", hero: false },
    { label: "公开展示边界", value: "公开普通产品思想、聚合状态、具体的普通 L2 偏好样例、代码、命令、失败与缺口；不复制原始聊天、账号、商家—金额—时间组合、行程起终点、访问 URL、原件路径或凭据。", hero: false }
  ],
  gaps: [
    "哔哩哔哩只能保存平台当前接口返回的可见范围；更早播放、点赞、投币和收藏的绝对完整性不能证明。登录失效时需要用户在同一 Chrome 完成验证码或扫码，代码不代解。",
    "Google Play、航空和 12306 仍是人工快照；12306 当前只有有限可见窗口。银行交易、京东、拼多多、美团和菜鸟仍是缺口或未来来源；YouTube 与地图活动已明确排除。",
    "Steam 当前免费/付费分类不能证明历史取得方式；累计启动时长可能包含未关闭的时间，因此只保留为定位事实、不参与偏好评分。",
    "现有 PersonalData 自动备份覆盖数据根与来源投递区，但项目没有独立导出、跨机器迁移或独立恢复验收入口；这不能冒充已经做过完整灾难恢复。",
    "本轮验收证明当前本机产品链和已取得数据可用，不证明平台未来接口、浏览器登录态或每次 AI 判断永不变化。"
  ]
});

const dailyPreferencesProject = {
  order: 17,
  slug: "daily-preferences",
  title: "个人理解库",
  route: "/projects/daily-preferences",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "共用本人背景、认知详卡与可靠领域回写已实现；73 个来源和 48 张当前认知卡，理解质量按真实问题验收",
  cardStatusTone: "mixed",
  ...dailyPreferencesSnapshot,
  kicker: "记住经历的意义和真实取舍，让每次帮助有依据、也能被纠正",
  searchAliases: [
    "个人理解库",
    "真实经历和价值取舍",
    "认知详卡与领域回写",
    "日常偏好与个性化推荐",
    "你怎么记住我喜欢什么",
    "偏好变了怎么纠正",
    "推荐为什么适合我",
    "订单和支付怎么算证据",
    "很久没买不等于不喜欢",
    "更新我的个人偏好",
    "B站历史收藏稍后看点赞投币追番",
    "材料保存不等于偏好增量完成",
    "准备投递增量",
    "薄快照为什么过期",
    "不建中央画像"
  ],
  repositoryNote: `PRIVATE（私有）仓库与稳定标识继续使用 daily-preferences，当前 main=${sourceMainCommit}；v0.12.0 / schema 6 在原有来源、退款、平台集合与按需增量上增加本人背景、认知详卡、原文候选、已核引用与可靠领域回写。只有一份当前共同本人理解，独立领域继续拥有专业状态。本页只读代码、产品合同和聚合，不复制私人原话、账号、财务组合、行程或健康个体值。`,
  summary: "个人理解库保存的是能继续帮助我的认识：我真实经历过什么、如今重视什么、怎样取舍，以及这些认识的依据和限制。它先用典型经历和核心判断直接交流，只有当前问题需要才展开详卡或原文；不让我每次从头解释自己，也不把旧订单、一次选择或最新自述定成人格。吃喝、购物、出行、娱乐、工具和审美推荐仍是其中的实际用途。工作、学习、文书和健康可以按需读取共同背景，再把有依据的新本人认识回写；各领域继续独立处理自己的专业事实和行动。",
  why: "只有记录会越存越多，却未必更懂人；每个领域各写一份当前档案，又容易互相矛盾。这个项目把原话、来源事实、模型判断和当前行动授权分开：认识要从完整语境、真实取舍、结果与反例中形成，既敢给有依据的评价，也能在新证据出现后改正。原件、历史版本和已签署成果继续保留，不为摘要顺畅抹掉失败或后来修正。",
  plainExample: "我可以说：“结合你已经知道的经历和取舍，帮我想想这次怎样跟同事沟通。”AI 先使用相关的核心认识给出判断；确实缺少会改变建议的背景，再打开相关完整卡或原文核对。新的可靠经历由当前任务回写，工作事实仍只取这次工作资料，不让我把同一段背景搬到几个项目里。",
  result: "我得到能直接用于当前问题的理解与建议：哪些经历和取舍相关、依据是什么、哪里是模型最倾向的判断、什么反例会改变结论。需要深入时可以回到完整详卡和原文；形成新认识后，摘要、详述、别名与证据一起更新并回读。明确要求更新来源时，仍逐来源交回真实变化与缺口；普通推荐保留熟悉、相邻和新鲜候选，最后由我决定。",
  readerStates: {
    pass: "先把相关核心认识用于当前问题，需要时才展开详卡和原文；给出判断、依据、反例与可纠正的结论。推荐场景仍交付熟悉、相邻与新鲜候选，明确更新时在当前对话刷新相应来源。导入、理解、实际取用与结果分开验收。",
    problem: "新表达与旧认识冲突时先分清语境、支持与反例，再决定是补充、临时变化、更正还是撤回；资料不足就保留 Unknown。来源部分完成、平台可见窗口或人工包未更新只影响对应部分；退款仍须可靠同订单链，部分退款或关联不唯一不猜整单。",
    unavailable: "核心依据缺失或查询入口不可用时，说明具体缺口并保留仍有依据的帮助；不把没有取得材料写成没有经历或偏好。需要刷新而哔哩哔哩登录失效时，由本人在同一 Chrome 完成登录；写入异常区分已提交状态与缓存刷新，不盲目重复。"
  },
  stateLabels,
  methodCanvas: {
    kicker: "偏好协作画布",
    headline: "先听现在怎么说，需要更新时再同步取证，最后把历史变成更多选择",
    description: "从眼前的真实问题出发，先用相关核心认识帮助本人，需要时再展开证据并形成可纠正的新理解。本人决定方向和取舍；项目保存来源、版本与回写。日常推荐和明确来源更新是这条流程中的具体分支，各自保留原有证据与行为。",
    steps: [
      { actor: "自然开口", title: "提出当前问题或直接纠正", detail: "可以讨论一次沟通、真实经历和取舍，也可以问吃什么、买哪个、住哪里，或直接更正先前说法。" },
      { actor: "形成帮助", title: "先用核心认识，再按需深入", detail: "用相关经历与取舍给出具体判断，明确支持、反例和未知；只有会改变这次帮助时才展开完整卡或原文，有依据的新本人认识在同一任务回写。" },
      { actor: "现在优先", title: "按真实语义保存表达变化", detail: "分清补充、临时取舍、事实更正与撤回；历史原话仍可能支持经复核且限定语境的认识。" },
      { actor: "推荐分支", title: "普通推荐按问题读取相关依据", detail: "保留小快照、明示和行为事实的推荐路径；没有更新意图时不扫描账号和原件，快照缺失或失效也不等于没有偏好。" },
      { actor: "按需刷新", title: "一句自然话同步更新自动来源", detail: "明确更新时复用本机 Chrome、Steam 与当前登录的哔哩哔哩；人工快照没有新包就保持原状。" },
      { actor: "按需补证", title: "只查会改变这次选择的轴", detail: "吃和喝分开，具体商品需要解释时才核对次数、状态、时间与文本变体。" },
      { actor: "推荐结果", title: "需要选东西时返回三类候选", detail: "熟悉、相邻和新鲜选择继续保留；新鲜项可以没买过，但要说明依据并标成推测，不靠同款变体凑数。" },
      { actor: "用户决定", title: "选择、拒绝或再次纠正", detail: "最终比价、购买和下单留给用户；新的明确表达进入下一次排序。" }
    ],
    columnsAriaLabel: "用户、Skill 与 AI、本地证据项目的责任边界",
    columns: [
      { title: "我表达与决定", note: "问题、纠正和最终选择", items: ["自然说出喜欢、不喜欢、理由或改主意", "决定是否准备来源增量", "选择候选、拒绝或要求单选"] },
      { title: "Skill 与 AI 协助", note: "路由、判断和候选", items: ["选择偏好入口并判断最小证据", "区分事实、推定和未知", "组织三类候选，必要时给平台与搜索词"] },
      { title: "本地项目负责", note: "记录、版本和验真", items: ["解析人工提供的来源并保存 current/history", "维护来源覆盖、缺口和可失效推定", "查询证据、核对具体事实和原件制品"] }
    ]
  },
  productPrinciples: [
    { title: "行动与认识分开判断", detail: "当前明确决定约束行动；喜好、外部事实和稳定价值判断分别比较语境、长期取舍与反例，不把最新自述或行为设为全部认识的最高证据。current/historical 是版本状态，不等于真假。" },
    { title: "事实准确，推定主动但可推翻", detail: "来源、时间、账号和记录身份必须准确；偏好判断可以大胆提出，但必须说明依据并接受纠正。" },
    { title: "买过不等于喜欢，后来全退也要沿链纠正", detail: "订单、支付和行程各自只证明自己能证明的事。可靠同订单链全额退款会让此前成功购买退出普通偏好、复购和快照支持，但原始事实仍可核对；部分退款、组单和不唯一关联保持 Unknown。支付宝、微信和信用卡只作支付旁证，不重复一笔购买。" },
    { title: "具体语义高于宽泛标签", detail: "优先保留商品、菜品、口味和规格原名；不能把农夫山泉苏打天然水/苏打水泛化成矿泉水。" },
    { title: "普通问题走快路径", detail: "已有核心认识足够就直接交流；模型按问题、证据缺口和判断后果选择索引、完整详卡或原文，不按字数或关键词强制深浅流程。" },
    { title: "时间排序，不让事实过期", detail: "其他条件相同时近期证据更靠前；久远有效成功记录和未更正明示继续保留，低频、长期未买或没有记录都不能反推不喜欢。" },
    { title: "历史负责排序，不建立白名单", detail: "熟悉选择之外必须给相邻和合理新鲜路线，不能把数据源变成只能重复购买的围栏。" },
    { title: "最终决定留给用户", detail: "除非明确要求只给一个，AI 不替用户定唯一套餐、下单或付款。" },
    { title: "实时信息用搜索接力", detail: "没有稳定比价或门店 API 不算能力失败；给最相关的 1–2 个平台和可复制关键词，不冒充权威最低价。" },
      { title: "按需自动，不持续监控", detail: "普通推荐不顺便扫描；用户明确更新时才在当前对话同步刷新可直接取得的来源，需要用户提供的数据包仍由本人决定何时更新。" },
      { title: "复用当前浏览器登录态", detail: "哔哩哔哩复用用户已经打开的 Chrome；登录失效时由用户在同一浏览器处理验证码或扫码，不另建浏览器配置或读取密码。" },
    { title: "接入不是偏好结论", detail: "材料保全和 ingest 只是中间步骤；还要判断偏好语义、重建相关快照并回验普通问题，或明确证明语义无变化。" },
    { title: "解析器清单不是来源全景", detail: "每个已承接偏好领域都要检查真实行为源或明确缺口；退役 PersonalOS 只作一次性发现线索，发现后的来源必须转成独立现行入口或缺口。" },
    { title: "Steam 按人合并、按行为取证", detail: "四个已确认登录账号按 AppID 合成同一个人的库，但只让实际玩过的游戏进入普通偏好上下文；仅观察、安装、未玩和应用都不冒充游戏偏好。" },
    { title: "只清洗无消费者标识，不模糊普通事实", detail: "本地索引对特定字段里的邮箱、长数字和支付末四位做窄掩码；这不是全局匿名化，也不能成为删掉普通商品、平台、时间或偏好语义的理由。" },
    { title: "边界按真实 Owner 分开", detail: "健康、资产、真实付款、正式材料、关系对象、媒体和工作执行继续走各自项目；偏好项目不建中央个人数据库。" }
  ],
  gallery: [],
  responsibilities: [
    "保存本人表达的版本、补充/临时/更正/撤回语义及对应证据；受影响的认知由 AI 复核，不把程序失效当作认识已被推翻",
    "在用户明确更新时同步刷新 Chrome、Steam 与当前 Chrome 中的哔哩哔哩，不建立后台同步",
    "人工接入订单、支付、Google Play、航空、铁路与 AI 对话快照，保留制品哈希、导入和记录版本",
    "在材料接入后闭合覆盖、缺口、偏好语义变化、快照重建和普通自然问题回验",
    "维护 73 个来源实例、16 类逻辑来源与 5 项尚未取得来源；明确拒绝的两类退出待办，来源数量不冒充阅读或理解质量",
    "把 Steam 多账号库按 AppID 合并，并把实际游玩、当前商店分类与未知历史取得方式分层",
    "把哔哩哔哩播放、收藏、稍后看、点赞、投币和追番分成不同证据强度，并保留平台可见范围",
    "按自然问题取相关 current 明示、有效快照和行为证据",
    "核对具体商品的订单链、有效结局、时间、文本变体和重复观察，让可靠全额退款传播到此前成功行，并保留部分退款/组单 Unknown",
    "维护自动来源与人工快照各自的覆盖、缺口、材料和刷新模式，不用一类来源冒充另一类",
    "在特定支付、信用卡和行程索引字段中掩码邮箱、独立长数字与支付末四位，同时保留普通偏好语义",
    "在打开内容前核对原件制品 SHA-256，并区分真实重读与缓存片段",
    "为 Skill 与当前 AI 提供事实，不在 Python 内伪装成推荐模型"
  ],
  exclusions: [
    "不把理解固定成人格标签，不接管领域调度、专业状态、事件图、向量数据库或第二数据库",
    "不后台同步、轮询或监控账号，也不在普通推荐时顺便刷新；自动增量只在用户当前对话明确触发",
    "不启动另一套 Chrome、安装浏览器配置、读取密码或代解验证码；哔哩哔哩只复用用户当前 Chrome",
    "不把材料已保存或 ingest 成功冒充偏好增量已完成",
    "不恢复退役 PersonalOS 的数据库、全景运行时或中央画像；旧目录只可作一次性历史发现线索",
    "不保证实时价格、最低价、门店、菜单、优惠或库存",
    "不替用户下单、付款、选择唯一套餐或修改外部平台",
    "不把订单、付款、行程或 AI 对话自动升级成喜欢；全额退款退出偏好也不等于不喜欢，部分退款、组单和不唯一关联不猜结论",
    "不因记录久远、次数少、长期没买或没有记录而自动判定过期或不喜欢",
    "不把 Steam 仅在库中、仅安装、未玩项目或应用混入普通游戏偏好，也不从当前商店分类猜历史取得方式",
    "不接管原件；照片、视频、音频、材料、健康、资产和正式文书由各自 Owner 保管",
    "不把人工快照写成实时来源，也不把平台当前可见窗口写成绝对完整历史"
  ],
  glossary: [
    { term: "current（当前）", meaning: "同一个精确偏好键下现在生效的明示、记录版本或推定；旧版本仍保留历史。" },
    { term: "historical（历史）", meaning: "保留的旧表述或记录版本；版本较旧不自动意味撤回或失去证据价值，必须结合时间、语境及明确更正判断。" },
    { term: "Preference snapshot（偏好快照）", meaning: "绑定材料或明示及 supports/contradicts/context 角色的可重建认识；来源或证据变化可能 stale，需要复核受影响的摘要和详述。" },
    { term: "Evidence role（证据角色）", meaning: "订单观察、支付旁证、行程观察和本人表达分别说明自己能证明什么，不能横向等权。" },
    { term: "Effective outcome（有效结局）", meaning: "订单/支付后来被可靠同订单链全额退款覆盖时标为 refunded_full；原事实保留，但退出普通偏好、复购和快照支持。部分退款、组单或关联不唯一保持 partial/Unknown。" },
    { term: "Recency signal（近期排序信号）", meaning: "来源、语义和状态相当时给近期记录更高分；它不删除久远有效事实，也不能把低频或无记录改写成负向偏好。" },
    { term: "Semantic completion（偏好语义闭环）", meaning: "材料接入后继续完成覆盖/缺口回读、偏好变化判断、快照重建与普通问题回验；无变化也要明确报告。" },
    { term: "AppID（Steam 应用标识）", meaning: "Steam 内容的稳定编号；多账号看到同一 AppID 时合并成一个人的统一项目，同时保留账号观察边。" },
    { term: "game observation（游戏行为观察）", meaning: "实际有游玩时长的 Steam 游戏证据；只说明行为强弱，不自动证明喜欢、所有权或历史取得方式。" },
    { term: "store price class（商店当前分类）", meaning: "Steam 官方商店在观察时给出的当前付费、免费或不可购买状态；不是历史直购、礼物、激活码、限免或家庭共享结论。" },
    { term: "conversation-on-demand refresh（对话内按需刷新）", meaning: "用户明确更新时在当前对话同步采集、导入和回验；进程结束后不留下后台服务、队列或定时器。" },
    { term: "Bilibili stream（哔哩哔哩行为流）", meaning: "播放、收藏、稍后看、点赞、投币和追番/追剧六类独立证据；强度不同，也都受平台当前可见范围限制。" },
    { term: "full / incremental / snapshot / manual", meaning: "完整权威快照、普通增量、只能说明某个截面的快照、用户直接表达四种接入模式。" },
    { term: "Source revision（来源修订）", meaning: "与某个偏好领域有关的 current 记录、来源状态、解析版本、缺口和明示共同形成的哈希。" },
    { term: "verified_artifact_cached_excerpt（制品已验真的缓存片段）", meaning: "原文件仍存在且 SHA-256 一致，但当前入口没有逐行重解析，只返回绑定到该制品的索引片段。" }
  ],
  operatingFlow: [
    { title: "直接表达或提问", detail: "自然说偏好、纠正、过去日期或本次选择问题，不需要用户知道偏好键和命令。" },
    { title: "先取 current 快路径", detail: "读取当前明示与有效快照；缺失或 stale 时继续最小证据，不把缺快照写成没有偏好。" },
    { title: "明确更新时先刷新来源", detail: "Chrome 与 Steam 读本机现状；哔哩哔哩复用当前登录的 Chrome。Google Play、航空与铁路没有新人工包就保持原状，不伪装实时刷新。" },
    { title: "按问题补证", detail: "吃喝、购物、支付、出行、Steam 游戏与哔哩哔哩按专门轴；Steam 游戏只取实际玩过的 game/demo，B 站问题只取 B 站证据，其余扩展域使用明示、通用证据或明确缺口。" },
    { title: "需要原因时核对 facts", detail: "具体商品返回原下单/支付、全额退款传播后的有效结局、时间与文本变体；facts 仍能说明曾买后来退，普通推荐则排除 refunded_full。支付旁证不重复购买，partial/Unknown 不猜整单。" },
    { title: "必要时有界回原件", detail: "先核对制品存在和 SHA-256；ChatGPT 再核消息 hash 并返回对应原文，PDF 重新抽取后做窄掩码，其他类型明确返回已验制品的缓存片段。" },
    { title: "组织选择菜单", detail: "Skill 与 AI 返回熟悉、相邻、新鲜候选；每项说明理由、取舍和推测，实时信息走搜索接力。" },
    { title: "回验并允许纠正", detail: "refresh 或 ingest 后判断新增、增强、减弱或无语义变化，重建仍有充分证据的相关快照并用普通自然问题回验；新的明确表达随时更新 current。" }
  ],
  components: [
    { name: "daily-preferences Skill", responsibility: "从自然偏好、纠正、推荐和增量请求进入正确流程。", implementation: "拥有推荐菜单、搜索接力、领域边界和用户选择权；不复制 SQLite 实现。" },
    { name: "Python CLI（命令行入口）", responsibility: "保留来源增量、状态、证据、事实、表达和原件入口，增加 profile、snapshot-batch 与已核引用接入。", implementation: "daily-preferences.v0.12.0 / schema 6；程序保证版本、引用角色、幂等和完整性，认知与建议仍由当前模型形成。" },
    { name: "PowerShell wrapper（PowerShell 启动入口）", responsibility: "让自然路由和人工维护从项目根使用同一个 Windows 入口，而不要求用户寻找 Python。", implementation: "先使用 PATH 中的 python，再查 LocalAppData 下最新 Python*，最后查 bundled runtime（随工作区提供的运行时）；三处都不存在时明确抛出 Python runtime not found，不静默换执行器。" },
    { name: "SQLite / FTS5（本地数据库 / 全文索引）", responsibility: "保存来源实例、制品、来源出现关系、导入、记录版本、明示、推定与证据关系。", implementation: "schema 6、WAL、外键、STRICT 表和 current 唯一索引；同一制品可绑定两个来源 occurrence，没有第二数据库或后台进程。" },
    { name: "CURRENT.md / PROFILE.md", responsibility: "从同一数据库生成短概览与长详档，先提供核心理解，再按需展开完整经历、推理和原话依据。", implementation: "summary/detail/evidence 同源，不手工维护第二份本人档案；SQLite 提交和两个视图的原子替换不是跨文件事务，缓存失败先查已提交状态。" },
    { name: "Live collectors（本机按需采集器）", responsibility: "在一次明确更新中读取 Chrome 历史/书签与 Steam 本机观察。", implementation: "复制 Chrome History 及 WAL/SHM 后只读查询，遍历可发现 profile；Steam 只读非秘密本地元数据并将账号缩成匿名 ref。采集器不写项目数据库。" },
    { name: "Bilibili browser collector（哔哩哔哩浏览器采集器）", responsibility: "在用户现有登录会话中取得六类当前可见行为流。", implementation: "通过当前标签页的 CDP（Chrome 开发者协议）执行带现有 Cookie 的同源 API 请求；输出稳定匿名账号 ref 与材料库快照，登录失效和接口部分失败分别报告。" },
    { name: "Snapshot parsers（来源快照解析器）", responsibility: "把哔哩哔哩、Google Takeout、航旅纵横和 12306 人工材料转成稳定记录。", implementation: "Chrome 与 Google Play 可从同一 Takeout ZIP 分开建来源 occurrence；航空保留路线与人物不确定性，铁路保留有限窗口，不把人工包写成实时接口。" },
    { name: "Steam 库与商店关联", responsibility: "把同一人的多账号游戏行为与当前公开商店分类连接，而不猜历史购买来源。", implementation: "library.jsonl 与 store appdetails JSONL 均按 AppID 建 current 记录；steam_app:<appid> 形成精确关联。游玩分钟保留为观察，不参与偏好评分；普通游戏查询过滤未玩记录与 application。" },
    { name: "窄索引清洗", responsibility: "让本地检索不需要保存某些无产品价值的联系方式和长标识，同时不牺牲普通偏好事实。", implementation: "scrub_sensitive 把邮箱和独立 7–19 位数字替换为占位；scrub_payment_method 再掩码括号内末四位。它只用于选定 parser 字段，不是全库、原件或公开页面的统一脱敏器。" },
    { name: "原件验真", responsibility: "防止缓存片段继续指向已经缺失或变字节的来源。", implementation: "先核 artifact SHA-256；ChatGPT 再核消息 content hash，PDF 重读失败明确返回不可读，其余类型标明缓存片段。" }
  ],
  usageExamples: [
    { ask: "结合你已经知道的经历和取舍，帮我想想这次怎样跟同事沟通。", effect: "先使用相关核心认识给出具体判断；必要时才展开完整卡或原文，并说明反例和未知。工作事实仍由当前工作资料决定，有依据的新本人认识在同一任务回写。", moduleSlug: "personal-understanding" },
    { ask: "我现在不太想吃辣，以后按这个推荐。", effect: "新的明确说法从现在开始生效；旧说法留作历史，相关旧推定不再参与当前推荐。", moduleSlug: "current-corrections" },
    { ask: "更新我的个人偏好，再告诉我这次哪些来源真的变了。", effect: "当前对话同步刷新 Chrome、Steam 与已登录 Chrome 中的哔哩哔哩，逐来源报告变化和范围；Google Play、航空和铁路没有新包时保持上次已核对状态。", moduleSlug: "source-coverage" },
    { ask: "今晚吃什么？吃和喝都看，不要只复述旧订单。", effect: "分别取吃喝相关明示、快照和行为事实，不读取整库私人正文。", moduleSlug: "evidence-query" },
    { ask: "为什么觉得我喜欢这个？先核对具体复购事实。", effect: "分开成功订单、非成功订单、支付旁证和本人表达，返回状态、时间与文本变体；非成功订单仍可核对交易事实，但不进入普通偏好证据、模型上下文或复购计数。", moduleSlug: "fact-verification" },
    { ask: "给我熟悉、相邻和没买过但可能适合的新东西。", effect: "AI 组织三类选择，标出推测、取舍和需要继续搜索的地方，最终由我决定。", moduleSlug: "recommendation-choice" }
  ],
  evidenceLayers: [
    { layer: "PRIVATE 源码 main", proves: `当前 main=${sourceMainCommit} 已从远端回读；v0.12.0 包含本人理解、认知卡、可靠回写、原文候选与已核引用，原有退款和 B 站集合语义继续保留。`, doesNotProve: "源码和测试不证明私人材料已充分阅读、理解已覆盖全部经历或每个领域均完成实际采用。" },
    { layer: "185 项 Python + 14 个子测试 / 7 项 Node 回归", proves: "本轮合成回归通过，覆盖当前认知、引用、来源过滤、可靠回写、平台增量与旧功能。", doesNotProve: "检索正确、字段一致和来源数量不能代替真实自然问题中的理解与帮助。" },
    { layer: "当前 SQLite 聚合", proves: "190,266 条当前记录、232,496 总版本、71 条当前明示、32 条历史明示、48 张当前认知卡；73 来源、quick_check=ok、外键 0。", doesNotProve: "卡片、记录、引用和完整性计数都不证明阅读覆盖、认知质量或领域接收完成。" },
    { layer: "2026-09-04 哔哩哔哩专项观察", proves: "旧 v0.9.1 来源快照：数据库播放 3,382 条，该次 Chrome 窗口 1,349 条；719 收藏、4 稍后看、277 追番/追剧、20 点赞与 2 投币。", doesNotProve: "这组聚合未在 2026-09-07 重采集；更早记录不保证完整，集合条件不足不得按缺失清退。" },
    { layer: "v0.9.1 基线实现盲更新对话", proves: "2026-09-04 专项证据保留：只给自然更新意图，能够自行选择当时入口、复用 Chrome、刷新三类自动来源并完成语义闭环，第二次三源均 no_change。", doesNotProve: "这次旧基线路由不继承为 v0.12.0 本轮完整 E2E，也不保证未来环境或所有认知问题相同。" },
    { layer: "当前事实与自然问题回读", proves: "B 站问题只返回该平台行为记录与明示，不再混入失效推定；工具问题命中 AI/开发与硬件系统折腾，出行经验同时命中旅行、航空/铁路和日常出行。facts 能保留先买后全退。", doesNotProve: "命中与排序仍是证据，不自动升级为本人明确喜欢；原专项回读保留 2026-09-04 观察边界，不能代表本轮所有认知和自然问题已经验收。" },
    { layer: "公开页面", proves: "只展示产品判断、聚合状态、普通 L2 样例和技术证据，没有复制原始聊天、账号、财务组合、行程路线、locator 或秘密。", doesNotProve: "公开内容不是实时个人推荐结果，也不是来源数据库副本。" }
  ],
  operationalEntrypoints: [
    { name: "初始化最小状态", command: `${wrapperCommand} init --json`, purpose: "建立 schema 6、user.current 来源与同源可重建视图；不扫描、导入或猜测任何来源。" },
    { name: "查看来源状态", command: `${wrapperCommand} status --json`, purpose: "逐来源返回覆盖、快照、缺口、材料、建议起点、模式和最近导入健康；不改业务数据或 SQLite 主文件，只读连接可能更新 -shm mtime。" },
    { name: "对话内自动增量", command: `${wrapperCommand} refresh --json`, purpose: "仅在用户明确更新时同步刷新 Chrome 与 Steam，并消费本次对话准备的哔哩哔哩当前 Chrome 快照；人工来源没有新包就保持不变。" },
    { name: "自然问题取证", command: `${wrapperCommand} evidence --query <自然问题> --limit 24 --json`, purpose: "返回与问题相关的 current 明示、有效推定和行为证据；查询连接只读。" },
    { name: "核对具体事实", command: `${wrapperCommand} facts --term <品牌> --term <品类> --json`, purpose: "统计事实角色、状态、时间与文本变体，不自动宣布喜欢。" },
    { name: "先定位相关认识", command: `${wrapperCommand} profile --query <自然主题> --index --json`, purpose: "返回摘要索引、直接匹配明示和原文候选短预览；预览不冒充完整详卡已读。" },
    { name: "读取完整详卡", command: `${wrapperCommand} profile --key <卡片键> --key <另一卡片键> --json`, purpose: "同一调用取多张已知卡与相关明示；缺键单列，旧完整 profile 路线兼容。" },
    { name: "可靠领域回写", command: `${wrapperCommand} snapshot-batch --path <JSON请求> --json`, purpose: "一次更新相关卡的摘要、详述、别名和 supports/contradicts/context 证据；绑定投递身份、来源项目、原始出处与所读现行版本。" },
    { name: "记录用户明示", command: `${wrapperCommand} record --key <偏好键> --statement <用户原话> [--effective-at <日期>]`, purpose: "保存原时间，区分 supplement/temporary/correction/withdrawal；真正更正或撤回指向确切旧表达，领域回写另带可靠投递与现行版本。" },
    { name: "人工接入增量", command: `${wrapperCommand} ingest --profile <profile> --source-id <source> --path <path> --mode incremental`, purpose: "普通补包默认 incremental；full 必须显式选择且只有无 gap 时才退出缺失旧记录。" },
    { name: "保存有据认识", command: `${wrapperCommand} snapshot --key <认识键> --value <摘要> --detail-file <复核详述> --statement-evidence <编号>:<角色>`, purpose: "至少绑定真实有效的材料记录或本人明示，可用 supports/contradicts/context。现行同键表达必须被考虑和引用，可作支持、反例或语境；经复核且限定过去的认识也可引用历史原话。领域回写再绑定投递身份和当前版本，不强制全部证据都是 current。" },
    { name: "有界回看记录", command: `${wrapperCommand} original --record-id <id> --json`, purpose: "先核对原件制品，再区分真正重读、缓存片段、缺失、漂移或不可读。" }
  ],
  evolution: [
    { date: "2026-08-31—09-04", commit: "3860c61–0b88ce9", result: "建立本地人工增量偏好证据项目并收敛到 v0.6：修正 full 默认、时间时区、来源覆盖、非成功订单、中文召回、历史区间、快照证据和原件验真；随后接入 Steam 多账号库与商店当前分类，并完成来源全景盘点。" },
    { date: "2026-09-05", commit: "3275ca7", result: "按需自动增量升级到 v0.9.1：可靠全额退款沿订单链传播，支付旁证不重复计权；B 站完整 current set 缺失成员只局部退役且不反推不喜欢。语义升级让旧推定只剩 3 个 current，深度认知重建明确留到下一轮；73 项 Python 与 7 项 Node 回归闭合。" }
  ],
  snapshotUpdateNote: "本页只在 daily-preferences 项目或 Skill 正式发布并回读后产生实质产品变化时更新。普通偏好数据增量若不改变公开产品能力、边界、证据解释或用户决策，只更新本地状态，不制造网站任务或公开消费日记。"
};

const commonModuleShape = (definition) => ({ stateLabels, ...definition });

const dailyPreferencesModules = [
  commonModuleShape({
    slug: "personal-understanding",
    shortTitle: "本人理解与领域取用",
    title: "先形成能帮助判断的认识，再按需要回到详卡和原文",
    searchAliases: ["个人理解库", "真实经历与价值观", "profile索引与完整卡", "领域回写", "原文候选不等于已读", "reviewed citations"],
    searchProjection: {
      intents: ["理解本人的经历与取舍", "为当前领域补相关背景", "从摘要展开完整认识", "把有依据的新信息回写"],
      entities: ["summary", "detail", "evidence", "profile --index", "profile --key", "source_materials", "snapshot-batch", "reviewed_citations"],
      relations: ["短长视图来自同一数据库", "卡片绑定原话或材料证据", "领域使用共同背景但独立维护专业状态", "原文候选帮助发现未整合主题"],
      failureRecovery: ["索引预览不冒充完整阅读", "证据漂移只复核相关卡", "来源角色不明保持未知", "重要矛盾沿既有原件回查"]
    },
    teaser: "默认结果是经历的意义、核心取舍和对眼前决定的帮助；有问题再展开依据，不让人先看一份处理流水。",
    status: "v0.12.0 / schema 6 已实现索引、详卡、角色引用和可靠回写；当前 48 张认知卡只是状态聚合，本轮未读取私人卡片",
    statusTone: "mixed",
    value: "在不同问题里持续使用同一份可修正的本人理解，同时保留各领域自己的专业判断和事实。",
    why: "引用长消息一次不等于读懂所有主题，原文找到了也未必形成可用判断。卡片数量、覆盖比例和检索非空都可能掩盖重要经历、反例或真实取舍仍未被用上。",
    example: "我说“结合你了解的我，帮我判断这次沟通怎么处理”。AI 先用相关核心认识给出理由；只有一个缺口真的会改变判断时，才打开那张完整卡或原文。新发现由当前任务回写，我不用另去维护几份档案。",
    result: "得到可直接交流的认识及其适用范围，必要时可展开完整经历、推理、反例、原话和来源位置；相关领域真正接收并使用后的结果另行回读。",
    readerStates: {
      pass: "核心理解能直接说明典型经历、价值取舍、当前影响和重要反例；需要时能回到同源完整卡与依据。",
      problem: "片段未覆盖长消息的其他主题、作者或派生边界不清、专业领域尚未实际采用时，保留具体缺口并只补相关证据。",
      unavailable: "当前卡、原文或领域入口不可读取时，只使用仍可靠的既有背景；未命中不表示没有经历或用户删除了材料。"
    },
    decisionImpact: [
      "本人基本情况、经历、生活重点、通用价值和偏好在这里维护；工作业务、健康专业结论和其他领域的对象/动态状态留在各领域。",
      "summary 先讲核心认识，detail 保留完整经历与推理，evidence 提供校准；核心默认内容约 100K 是上界取舍，不是阅读上限、目标填充量或自动计数门。",
      "已有可靠理解足够就直接交流；模型按问题和后果决定索引、完整卡、原文或领域入口，不用字数或关键词机械分流。",
      "材料留存不是随机抽样：记录多、语气激烈或只见一方表达不能证明现实冲突单向发生；缺少留痕也不准补造经过或动机。",
      "事实、本人此时的解释与模型最倾向的推断分开；敢给有依据的日常评价，同时说明足以推翻判断的反例，不把人写成固定标签。",
      "阅读、整合、领域接收和回答实际取用是四项不同结果。独立验收只给自然问题与正常能力环境，不预告预期事实或固定答案。"
    ],
    problem: "解决重复解释本人背景、各领域现行档案漂移、只积累证据却没有理解、摘要抹掉反例和检索计数冒充实际帮助。",
    implementation: [
      "preference_snapshots 增加 title、detail_text、aliases_json；CURRENT 与 PROFILE 从同一数据库生成，索引模式保留摘要和有限预览，--key 精确返回一张或多张完整卡。",
      "profile/evidence 的 source_materials 返回尚未进入卡片或长消息其他主题的原文候选，保留作者、派生类别、日期、命中字段、片段范围和原文编号。普通 evidence 不把未整合引用直接当成偏好。",
      "facts 按 source-id、provider、logical-source 三种不同范围过滤；规范值来自 status，非法值显式报错，合法零命中不证明全库不存在。",
      "reviewed_citations 增量接入已核微信消息、保留 ASR 片段和附件的最小引用。原生身份与原表达时间固定，独立转写使用独立来源流，不把导入时间当说话时间。",
      "original 分开 verified_owner_original、verified_derived_result 与 verified_attachment_artifact；后两种只证明结果或附件身份，不证明逐字准确、说话人身份或附件正文已读。ASR 引用只读已有结果，不启动识别。",
      "snapshot 与 snapshot-batch 以 supports / contradicts / context 绑定记录和明示，引用历史原话时显式保留语境。证据编号或角色变化必须提交复核后的详述，不静默带回旧理由。",
      "领域通过稳定入口正常读写业务数据，不直接维护内部表、不复制父库程序或整库材料；修改程序、规则或接口才进入相应源码施工边界。"
    ],
    flow: ["恢复当前问题与相关本人理解", "已有依据足够时直接判断和交流", "需要时从索引选完整卡或原文", "区分事实、解释、推断与未知", "保留重要经历、取舍、结果与反例", "领域完成自己的专业结果", "有据新认识可靠回写并回读", "用自然问题检查实际取用"],
    concepts: [{ term: "Source material（原文候选）", explanation: "用于定位可能未整合的内容，命中与已有引用都不等于完整阅读或事实认证。" }, { term: "Evidence role（证据角色）", explanation: "supports 支持、contradicts 反例、context 语境；程序核对引用，模型判断含义。" }, { term: "Shared background（共用本人背景）", explanation: "各领域按需使用同一份当前本人理解，不共享它们的专业数据库或行动状态。" }],
    boundaries: ["不复制原始聊天、完整媒体、病历、账本或领域计划到公开页面。", "不靠全库 100%、逐卡确认或问卷把交流推迟。", "不把模拟、包装、转贴或旧 AI 建议自动当成本人经历。", "既有历史原件与正式成果保留，更正主要影响后续使用。", "未来领域首次实际需要时再落实，不因产品关系图提前建空项目。"],
    failures: [{ condition: "索引有命中但重要主题未被回答", response: "沿相关完整原文与上下文补读，修正认识和取用，不让用户重述已存在材料。" }, { condition: "引用的原件或派生结果变化", response: "复核同一来源身份和当前版本，相关卡重新审阅；不把旧片段带到新结果。" }, { condition: "专业内容只停在交接意向", response: "回到独立领域的正常入口，核对实际接收结果；未闭合就明确保留缺口。" }],
    sources: [{ path: "DOMAIN_CONTRACT.md", role: "理解、证据取舍、领域职责与可靠回写" }, { path: "daily_preferences.py / schema.sql", role: "认知卡、索引、原文候选、引用角色和版本" }, { path: "source_snapshots.py", role: "已核引文接入与稳定原生身份" }, { path: "tests/test_personal_background.py / test_profile_index.py / test_reviewed_citations.py / test_source_materials.py", role: "本人背景、索引、引文与原文召回合成回归" }],
    verification: ["本轮源码套件 185 项 Python、14 个子测试与 7 项 Node 全部通过。", "只读状态与计数验证 73 来源、48 当前卡、quick_check=ok 和外键 0，没有读私人卡片。", "真实理解质量必须另以自然问题确认典型经历、评价、限制与当前帮助；本次网页测试不冒充该项完成。"],
    relation: "本模块形成默认可使用的认识；下面的表达、来源、取证、原件和推荐模块继续提供版本与依据。"
  }),
  commonModuleShape({
    slug: "current-corrections",
    shortTitle: "表达、历史与可靠纠正",
    title: "保留原话的时间和语义，不让旧任务覆盖新的更正",
    searchAliases: ["我改主意了", "补充和撤回", "current historical", "delivery-id", "current_conflict", "认知纠正"],
    searchProjection: { intents: ["记录本人当前表达", "保留过去原话", "区分补充临时更正撤回", "可靠回写避免重复与旧覆盖"], entities: ["record", "supplement", "temporary", "correction", "withdrawal", "expected-current-id", "delivery-id"], relations: ["状态版本不代表真伪", "更正引用同键确切旧表达", "稳定投递重试不新增", "来源变化只复核相关认识"], failureRecovery: ["current_conflict先重读新版本", "delivery_conflict找回原请求", "缓存失败不盲重写", "不把stale当作用户改主意"] },
    teaser: "我可以补充一件旧事、临时改变选择或明确撤回旧话；系统保留这些差别，不用一条新记录把旧认识全部推翻。",
    status: "schema 6 已实现四类表达变化、证据角色与投递版本检查；聚合 71 条 current、32 条 historical，不公开具体原话",
    statusTone: "pass",
    value: "保持连续又可纠正的理解，让不同领域的重试与并发更新不会默默制造重复事实或覆盖较新的本人表达。",
    why: "最新表达可能只是补充或临时安排，历史表达也可能仍支持长期理解；同时，旧任务拿着旧卡回写会把后来的更正覆盖。存储时间线和认知取舍必须分开。",
    example: "我说“这次为了赶时间先这样，平时还是按原来的”。AI 把它记为有语境的临时取舍，不改成永久偏好；另一个旧任务稍后回写时发现现行版本变了，会先重读再合并。",
    result: "得到保留原时间、来源和变化类别的表达，以及共同更新的摘要、详述与证据；重试、无变化和冲突有不同结果，历史原话仍可回查。",
    readerStates: { pass: "可靠投递通过现行版本检查，保存表达或相关认知并回读；相同投递重试返回 idempotent，内容未变返回 no_change。", problem: "同一投递不同载荷返回 delivery_conflict，旧任务读后有新更正返回 current_conflict；AI 先重读并判断，不只替换预期编号盲重试。", unavailable: "写入或视图替换失败时先核对实际数据库状态；提交与 CURRENT/PROFILE 替换不是一个跨文件事务，不从非零退出推断全部未发生。" },
    decisionImpact: ["current/historical/withdrawn 是存储状态，不是事实真伪或证据权重。", "supplement 默认保留未撤回旧内容；temporary 使用真实适用范围，不凭空给偏好设过期日。", "correction/withdrawal 必须用 related-statement-id 指向同键旧表达；未来生效的更正按时间生效。", "同键当前明示必须被考虑和引用，但可作反例或语境；不再一律阻断有依据的模型认识。", "历史原话可支持明确限定过去的认识；已纠正错误不再支持现行事实，仍可解释认识变化。", "程序让卡片 stale 只要求复核，不能代替模型判断旧认识已经被推翻。"],
    problem: "解决补充被当作撤回、临时选择变永久、历史原话失去语境、投递重复和旧版本静默覆盖。",
    implementation: ["preference_statements 保存 transition_kind、related_statement_id、原生生效时间、来源与投递身份；按同键时间线维护 current 与历史。", "writeback_deliveries 以 delivery_id 固定 operation、caller_project、origin_ref、payload SHA-256 与已返回结果；同一重试复用结果，不再次插入或令旧卡失效。", "expected-current-id 对 record 使用 statement_id、对 snapshot 使用 snapshot_id；尚无该键须在真实读取后声明 none/null，不混用编号。", "snapshot_evidence 与 snapshot_statement_evidence 保存 supports/contradicts/context；改编号或角色须显式提交经复核 detail。", "snapshot-batch 一次绑定各卡 expected_current_ids，保持同一投递的稳定身份；旧数组输入保留兼容。", "用户原话进入 record，模型理解进入 snapshot；程序不把助手总结改成用户明示，也不为凑一种证据类型造假记录。"],
    flow: ["读取相关当前表达或卡", "按原话区分四种变化", "保留原时间与出处", "固定投递身份和现行版本", "验证引用及证据角色", "提交相关表达/认知", "更新同源视图并回读", "用当前问题检查是否正确使用"],
    concepts: [{ term: "Idempotent（幂等）", explanation: "相同投递已经处理，不插入第二份，也不再次让卡失效；后来再次真实表达属于另一个事件。" }, { term: "Current conflict（现行版本冲突）", explanation: "读取后已经出现新的版本，必须先理解新内容再决定如何合并。" }, { term: "Statement transition（表达变化）", explanation: "补充、临时、更正与撤回是不同语义，由 AI 按本人原话判断。" }],
    boundaries: ["不从订单或助手文本自动写成本人明示。", "不同 key 的真实语义仍由 AI 判断，不靠键名机械合并。", "不删除原件或历史成果，不把同一事实跨平台复述算成独立证据。", "没有独立 history/undo 浏览命令不等于没有原话关系、撤回语义或版本保留。"],
    failures: [{ condition: "相同 delivery-id 使用不同载荷", response: "返回 delivery_conflict，找回原请求，不换一个新编号掩盖冲突。" }, { condition: "expected-current-id 与当前不同", response: "返回 current_conflict，重读最新表达或卡，AI 判断合并或重建。" }, { condition: "证据或角色改变却没有复核详述", response: "拒绝沿用旧解释；补齐本次准确的摘要、详述和证据后再提交。" }, { condition: "数据库提交后视图刷新失败", response: "先查现存记录与投递结果，再恢复同源视图，不能盲目再次 record。" }],
    sources: [{ path: "DOMAIN_CONTRACT.md", role: "四种变化、证据取舍、可靠投递和并发冲突" }, { path: "daily_preferences.py / schema.sql", role: "表达、认知、角色和writeback_deliveries实现" }, { path: "tests/test_writeback.py / test_personal_background.py", role: "幂等、冲突、历史语境和认知更新回归" }],
    verification: ["当前合成回归包含投递重试、不同载荷冲突、旧版本拒绝、明确撤回/更正、历史明示和证据角色。", "185 项 Python 与 14 个子测试通过；本轮没有向个人数据库 record、snapshot 或 ingest。"],
    relation: "它保证认识可以可靠演化；是否认同一种解释仍取决于真实语境与证据，程序状态不会替本人做决定。"
  }),
  commonModuleShape({
    slug: "source-coverage",
    shortTitle: "来源与按需增量",
    title: "新对话同步刷新自动来源，人工快照不伪装实时",
    searchAliases: ["更新我的个人偏好", "自动增量", "B站历史收藏稍后看点赞投币追番", "准备投递增量", "材料保存不等于偏好增量完成", "ingest完成以后还要做什么", "Steam多账号统一库", "遗漏了哪些偏好来源", "每个来源到哪天", "Google Play航空12306人工快照", "full incremental 区别", "来源覆盖"],
    searchProjection: {
      intents: ["对话内自动增量", "查看来源覆盖", "复用当前Chrome采集哔哩哔哩", "准备人工快照", "检查来源全景遗漏", "选择full或incremental"],
      entities: ["source instance", "live collector", "browser snapshot", "artifact occurrence", "import run", "Steam AppID", "coverage", "gap"],
      relations: ["Chrome和Steam由本机采集", "哔哩哔哩复用当前Chrome", "人工快照没有新包就保持不变", "同一Takeout制品可绑定两个来源occurrence", "import run记录mode和health", "coverage与gap共同决定快照修订"],
      failureRecovery: ["B站登录失效请用户在同一Chrome登录", "一个来源失败不阻塞其他来源", "partial不退出旧current", "Steam历史取得方式保持Unknown", "incremental不缩覆盖", "重复refresh返回no_change"]
    },
    teaser: "用户不需要准备工程命令：一句“更新偏好”会在当前对话同步刷新可直接取得的来源；需要用户提供的包仍保持人工快照，任何导入都必须继续闭合偏好语义。",
    status: "73 个来源实例：12 acquired_verified、61 snapshot_only；16 类已接入逻辑来源，5 类尚未取得、2 类明确排除；自动与人工来源各保留原刷新边界",
    statusTone: "mixed",
    value: "知道每个来源真实到哪里、缺什么、该准备什么和怎样补，不靠模糊的‘最近同步过’做决定。",
    why: "把不同账号、浏览器 profile、行为流或人工补包混在一起，会让覆盖范围、缺口和去重身份失真；反过来，把所有来源都写成“手动导入”又会隐藏当前已经可用的本机和浏览器自动增量。",
    example: "我可以说：“更新我的个人偏好。”系统会读取本机 Chrome 历史/书签和 Steam 观察，复用已登录 Chrome 取得 B 站六类行为流，再逐来源去重导入；Google Play、航空和 12306 没有新包时会明确保持旧快照。",
    result: "得到逐来源的 collection（采集）、ingest（导入）、变化计数、范围限制和 no_change/partial/failed 状态；随后再判断偏好新增、增强、减弱或无变化，重建相关快照并用普通问题回验。人工包仍按 incremental/full 合同处理。",
    readerStates: {
      pass: "refresh 对自动来源逐项返回 completed 或 no_change；人工包 ingest 也保留自己的结果。只有覆盖/缺口、语义变化、快照重建和普通问题回验闭合，或明确证明无语义变化后，偏好增量才完成。",
      problem: "一个来源 partial、平台只返回可见窗口或人工来源没有新包时，精确保留该来源状态；其他来源继续。部分有效记录可能入库并使旧快照失效，技术回执不能冒充推荐已更新。",
      unavailable: "哔哩哔哩登录失效时只请用户在同一 Chrome 登录；本机来源、格式、身份或依赖不成立时在对应来源停止，不换账号或扩大扫描。数据库提交后缓存失败时先核对再决定下一步。"
    },
    stateLabels: ["完成或无新记录", "部分完成或失败", "入口或缓存不可用"],
    decisionImpact: [
      "当前 73 个来源实例：12 acquired_verified、61 snapshot_only；覆盖本人表达、订单/支付、AI 对话、已核引用、Steam、哔哩哔哩、浏览、Google Play、航空和铁路等 16 类逻辑来源。",
      "Chrome 历史与书签从可发现 profile 直接采集；打开中的 History 会连同 WAL/SHM 做临时只读快照，Chrome 不需要退出。",
      "本机 Chrome 记录进入 browser_activity；同一 Takeout 包中的 Google Play 记录进入 google_play_activity，两类来源各自保留身份和覆盖。",
      "Steam 直接读取本机多账号观察并按 AppID 合并；只输出匿名账号 ref，不读 token、Cookie、密码或 license cache，历史取得方式继续 Unknown。",
      "哔哩哔哩复用用户当前已登录 Chrome，取得播放、收藏、稍后看、点赞、投币与追番/追剧；账号以稳定匿名 ref 绑定，账号变化不会静默混入旧来源。",
      "收藏、稍后再看与追番/追剧只有同账号、Schema/range 一致、分页完整、计数一致且成员键无重复时，缺失成员才退出 current；播放、点赞、投币仍是窗口流。",
      "719 条收藏保留用户自命名收藏夹，645 条有有界简介检索旁证；简介不冒充用户偏好原话。277 条追番/追剧已带类型，旧无类型 current 记录转为 historical。",
      "Google Play、air_travel_history 与 rail_travel_history 是人工快照：没有新包时不参与 live refresh，也不会被降级成缺失。",
      "当前 5 项未取得来源是 bank_transactions、jd_orders、pinduoduo_orders、meituan_orders、cainiao_logistics；youtube_activity / maps_activity 已明确排除，来源缺材料与用户拒绝分开。",
      "每项未取得来源继续返回 availability、priority 和 evidence；历史目录、可读旧快照、只有个人信息和无现行数据不是同一种状态。",
      "bank_transactions=no_current_material_confirmed：未核到现行银行交易材料，当前支付偏好已有支付宝、微信支付与信用卡旁证。",
      "jd_orders=personal_info_only_no_orders：现有材料只有个人信息，没有可消费订单行；不能冒充京东订单已接入。",
      "pinduoduo_orders 与 meituan_orders=no_current_order_data：当前都未核到可消费订单数据。",
      "cainiao_logistics=historical_catalog_only：只知道退役来源目录曾记录历史范围，当前独立原件仍未完成定位与核验。",
      "youtube_activity 与 maps_activity=archived_snapshot_available：有历史材料线索，但尚未进入普通偏好查询；地图全量历史位置仍不成立。",
      "普通补包默认 incremental；full 必须显式选择，且有 gap 时不会退出缺失旧 current。",
      "每个 source_id 绑定 logical source、provider 与账号别名，不能换绑。",
      "同制品同版本立即重复为 no_change；A→B→A 会恢复旧权威快照，而不是永久丢失历史版本。",
      "增量覆盖做 union（并集），无关成功补包不会清掉不可重算 gap；信用卡缺月按 current 月份重新计算，本轮补齐后已消失。",
      "同一 Google Takeout ZIP 可以分别登记为 Chrome 与 Google Play 两个 source occurrence；共享制品哈希不合并来源语义。",
      "Didi 目录只选网约车订单 TXT；淘宝、支付、信用卡、ChatGPT/Gemini、Takeout、航旅纵横 XLS 与 12306 OCR JSONL 都保留精确输入合同，扩展名不匹配时拒绝。",
      "文本按 UTF-8-sig、UTF-16、GB18030 顺序读取；Excel serial 按中国本地时间解释，文件名中的 YYYYMMDD-YYYYMMDD 或 YYYY年M月只在解析成功后补业务覆盖。",
      "最近导入健康与来源已取得状态分开，failed/partial 不会被 acquired_verified 文案掩盖。",
      "接入返回的 counts 含 records、new、updated、duplicate、artifacts 与 artifact_duplicates，另有 exact_links、retired_invalid_records、retired_missing_records 和 invalidated_snapshots；这些数字说明处理和失效，不说明推荐质量。"
      ,"材料保全与 ingest 只完成事实层；偏好层必须继续区分新增、增强、减弱和 Unknown，重建仍有充分证据的失效快照，再用普通自然问题确认 current 明示、快照和 evidence 可用。"
    ],
    problem: "解决账号混并、覆盖缩短、缺口被无关补包清除、错误 full 误退 current、同制品回滚失败和 unsupported 格式静默成功。",
    implementation: [
      "daily_preferences.py 的 refresh 在一次明确对话中串联 Chrome、Steam 与本次浏览器生成的哔哩哔哩快照；返回 conversation_on_demand 且 background_started=false。",
      "live_increment.py 只采集 Chrome History/Bookmarks 与非秘密 Steam 本机元数据，返回内存记录，不调度、不持久化项目数据库。",
      "bilibili_browser_collect.mjs 通过现有标签页 CDP 调用平台 API，分页保存六类行为流；source_snapshots.py 再把浏览器快照、Takeout、航空和铁路材料转成统一记录。",
      "B 站 current set 先验证账号、Schema、range、分页、计数和成员唯一性；条件完整才局部退役本次缺失成员并让依赖推定 stale，历史与原件不删除。",
      "PROFILE_EXTENSIONS 明确允许的扩展名与 .blob 容器；read_text 只走 UTF-8-sig→UTF-16→GB18030，最后才以 replacement fallback（替换字符回退）保留可读片段。",
      "parse_time_us 把 Excel serial 当作 +08:00 本地时间，不再先按 UTC 后多加 8 小时；declared_range_from_name 识别紧凑日期范围和中文月份。",
      "artifacts 保存 SHA-256/bytes/MIME；occurrences 保存出现位置；import_runs 保存 parser version、mode、health、计数和 gap。",
      "records 按 source/type/native/hash 保留版本，partial/full/no_change 的 current 退出语义分开。",
      "collect_paths 对显式错误扩展名整体失败；目录只筛支持类型，Didi 再筛当前真实网约车订单导出。",
      "coverage 只接纳成功解析文件的声明范围；incremental 保留旧覆盖和未解决 gap。",
      "status 返回每个来源的覆盖起止、快照时间、gap、材料、推荐 mode、重叠建议和 latest_import。",
      "status 把 5 项未取得逻辑来源映射到 source_gap_details，并另列 excluded_logical_sources，逐项给 availability、priority 与公开安全证据摘要；parser 列表不再冒充来源全集。",
      "ingest 外层结果有 completed/no_change/partial/failed 四态；单文件 import_runs 另用 success/no_change/partial/failed，不应把来源 acquired_verified、单文件 success 与整次 completed 混写。",
      "接入完成覆盖重算、关联重建和失效推定标记后先提交数据库，再写 CURRENT.md；write_current 失败不会撤销已提交记录，Python 也不会自动生成替代推定或推荐。"
      ,"特定支付方式先用 scrub_payment_method 掩码邮箱、独立 7–19 位数字和括号内末四位；信用卡正文与 Didi 搜索文本使用 scrub_sensitive。普通商品和偏好语义不因此泛化。"
      ,"偏好增量完成判断由 Skill/AI 读取 ingest、status、current 快照与自然问题证据后给出；它必须明确列出语义变化或无变化，不能把技术接入状态改名成偏好结论。"
    ],
    flow: ["用户自然表达更新意图", "复用当前 Chrome 生成哔哩哔哩快照", "同步采集 Chrome 与 Steam 本机现状", "按 source_id 校验并去重导入", "人工来源没有新包时保持快照", "更新 coverage/gap 并使受影响快照 stale", "提交 SQLite 后单独刷新 CURRENT", "逐来源返回四态、计数与限制", "判断偏好新增/增强/减弱或无变化", "重建仍有充分证据的相关快照", "用普通自然问题回验"],
    concepts: [
      { term: "source instance（来源实例）", explanation: "一个明确平台/账号/快照的独立来源身份；两个账号永远分别列。" },
      { term: "incremental（增量）", explanation: "普通带重叠补包；只增加或更新看见的记录，不把本次没带来的旧记录退出。" },
      { term: "full（完整快照）", explanation: "已确认是该来源实例完整权威截面时显式使用；有任何解析 gap 就失败关闭。" },
      { term: "gap（缺口）", explanation: "已知材料、月份、解析或覆盖问题；它与来源已取得状态分开。" }
      ,{ term: "live collector（本机按需采集器）", explanation: "只在当前对话明确触发时读取现有 Chrome/Steam 状态；返回后不留下计划任务或后台服务。" }
      ,{ term: "artifact occurrence（制品来源出现关系）", explanation: "同一字节制品在某个来源身份下的一次登记；相同 ZIP 可分别支撑 Chrome 与 Google Play，而不合并两者。" }
      ,{ term: "profile input contract（来源输入合同）", explanation: "每个 profile 接受的扩展名、容器、文本编码和时间解释；不匹配时失败，不靠猜格式继续。" }
      ,{ term: "source gap detail（来源缺口明细）", explanation: "尚未接入的逻辑来源、当前材料可用等级、优先级与证据摘要；它不等于 parser 已实现。" }
    ],
    boundaries: ["不后台同步；自动只表示当前对话按需执行。", "普通推荐不擅自刷新或导入。", "材料保全、refresh 或 ingest 成功不等于偏好增量完成。", "Google Play、航空和 12306 不伪装实时来源。", "哔哩哔哩不启动独立浏览器配置、不读取密码、不代解验证码。", "未取得来源只列缺口，不预建解析器。", "退役 PersonalOS 只作一次性来源发现线索，不恢复旧系统。", "Steam 商店当前分类不证明历史取得方式。", "窄索引清洗不是全局匿名化。"],
    failures: [
      { condition: "显式文件扩展名不属于 profile", response: "在数据库连接和任何写入前整体拒绝；合法文件与错误文件混合也不部分执行。" },
      { condition: "解析有缺口", response: "取得部分记录时整次为 partial，没有取得记录时为 failed；保存已处理计数和精确 gap，不回滚已经接纳的有效记录，full 不因缺失项退出旧 current。" },
      { condition: "source_id 换 provider 或 logical source", response: "返回 source identity conflict，保留原身份。" },
      { condition: "同一旧 artifact 重新成为权威", response: "若旧观察已不是 current 就重新解析并激活对应历史版本；连续 no_change 不清空 seen keys。" },
      { condition: "材料已经保存或 ingest 返回 completed，但尚未判断偏好语义", response: "保持增量未完成；继续核对覆盖/缺口，判断新增、增强、减弱或未知，重建有充分证据的快照并做普通问题回验，或明确证明语义无变化。" },
      { condition: "来源全景只按已有 parser 列表生成", response: "视为遗漏；按偏好领域检查现有独立原件或明确缺口，退役目录只给一次性发现线索，不把旧系统恢复成依赖。" },
      { condition: "Steam 本地库已接入但历史取得方式不可验证", response: "保留 steam_historical_acquisition_method_unverified；可继续用实际游玩形成行为证据，但不声称直购、礼物、激活码、限免或家庭共享。" },
      { condition: "哔哩哔哩登录失效或某条行为流失败", response: "登录失效时请用户在同一 Chrome 完成验证码/扫码；单流失败返回 partial 与精确 gap，其他来源和成功流继续。" },
      { condition: "收藏、稍后再看或追番/追剧 current set 不完整", response: "缺失成员不退役；账号、Schema、range、分页、计数和成员唯一性全部成立后才允许局部退出 current，且不反推不喜欢。" },
      { condition: "Google Play、航空或铁路没有新人工包", response: "保持 snapshot_only 与既有覆盖，不伪装本轮刷新，也不把来源降级成 missing。" },
      { condition: "数据库提交后 CURRENT 缓存写入失败", response: "记录、覆盖和失效推定可能已经更新；先只读核对该来源本次 import 与数据库，不将异常当成未导入后盲目重试。当前缺少区分已提交/缓存失败的正式回执。" }
      ,{ condition: "Python 三条发现路线均不存在", response: "PowerShell wrapper 明确抛出 Python runtime not found；不伪装成 status、evidence 或 ingest 成功。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现 profile、ingest、status、conversation-on-demand refresh、来源身份与回滚。" },
      { path: "live_increment.py", role: "实现 Chrome/Steam 本机只读采集、匿名账号边和无后台状态。" },
      { path: "bilibili_browser_collect.mjs", role: "复用当前 Chrome 标签页采集哔哩哔哩六类行为流并写出有界快照。" },
      { path: "source_snapshots.py", role: "解析哔哩哔哩、Google Takeout、航空和铁路快照。" },
      { path: "daily-preferences.ps1", role: "实现 PATH→LocalAppData→bundled runtime 的稳定 Windows 入口和明确失败。" },
      { path: "schema.sql", role: "定义来源、制品、导入、记录、观察与 current 约束。" },
      { path: "tests/test_refresh_increment.py", role: "覆盖重复 refresh、局部失败、账号变化、人工来源保持与来源 occurrence。" }
    ],
    verification: ["2026-09-07 只读回读 73 个来源实例，其中 12 acquired_verified、61 snapshot_only；5 类未取得，2 类明确排除。", "B 站数据库保留 3,382 条 current 播放，本次 Chrome 窗口为 1,349；current set 为 719 收藏、4 稍后再看、277 带类型追番/追剧，点赞 20、投币 2 仍是窗口观察。", "真实稍后再看 5→4 只局部退役一条；紧接重复刷新为 no_change、局部退役 0。", "73 项 Python 回归覆盖退款链、Chrome/Steam、refresh、人工来源和幂等恢复；7 项 Node 回归覆盖 B 站 current set、分页、登录与错误分类。", "同一 Takeout ZIP 分别登记为 Chrome 与 Google Play 来源，制品哈希相同但 occurrence 独立。", "连续 incremental/full 与 A→B→A 的既有幂等和恢复回归继续通过。"],
    relation: "它向证据查询提供来源身份、current 记录和缺口；只有来源修订真实变化，相关推定才失效。"
  }),
  commonModuleShape({
    slug: "evidence-query",
    shortTitle: "自然问题与最小证据",
    title: "用一句自然问题，只取会改变这次选择的证据",
    searchAliases: ["我喜欢喝什么的证据", "我平时喜欢看什么B站内容", "B站证据不要混入Steam", "我玩过哪些Steam游戏", "Steam游戏不要混入应用", "根据我的偏好怎样取证", "薄快照过期", "最小证据", "为什么订单比聊天靠前", "很久没买是不是不喜欢", "旧记录会自动过期吗", "自然问题怎么搜索"],
    searchProjection: {
      intents: ["按自然问题查偏好证据", "只取B站相关证据", "分开吃和喝", "只取实际玩过的Steam游戏", "过滤无关AI对话", "召回较老中文记录"],
      entities: ["query", "domain", "axis", "current statements", "current snapshots", "Bilibili interaction", "game observation", "store price class", "evidence role"],
      relations: ["query识别domain和axis", "domain选择logical sources", "B站行为按收藏点赞投币追番强弱排序", "Steam游戏按AppID连接商店分类", "current context按domain过滤"],
      failureRecovery: ["快照缺失继续证据查询", "B站问题不混入Steam或全库噪声", "Steam未玩和应用不进入游戏结果", "历史取得方式保持Unknown", "无匹配保留Unknown", "只读连接不修改数据库"]
    },
    teaser: "普通推荐不需要把 232,496 条记录版本塞进上下文；先用与问题相关的现行理解，必要时再取明示、行为事实和原文候选，避免噪声挤掉重要经历。",
    status: "当前全库 190,266 条 current 记录、48 张有效认知卡；查询按题取相关内容，旧 B 站/Steam 专项自然回读保留 2026-09-04 观察，不能代替本轮真实建议验收",
    statusTone: "pass",
    value: "让 AI 看见足够的连续性，而不是被整库订单、付款和聊天淹没。",
    why: "只看 top hits 会漏掉吃/喝、复购/新类别等不同轴；无条件返回全部 current 语句又会把技术取舍、增量说明和购物偏好塞进晚餐问题。",
    example: "我可以问：“我平时喜欢看什么类型的 B 站内容？”结果只纳入相关的哔哩哔哩行为、明示与有效认知。Steam、购物和整库 AI 对话不会混进来。",
    result: "得到有范围的 evidence JSON：查询词、相关明示、有效推定、带角色的候选、时间、重复次数和 locator；AI 再判断事实与推测。",
    readerStates: {
      pass: "识别到专门域时按域选来源和 current 上下文，相关旧中文具体记录仍可召回；数据库字节不变。",
      problem: "扩展域没有专门 parser/权重时只用用户明示与 AI 对话候选，明确不声称同等覆盖。",
      unavailable: "数据库不存在或不可读时返回精确失败；Skill 可依据本轮明示临时回答，但不伪造历史偏好。"
    },
    stateLabels: ["已取得相关证据", "覆盖仍有边界", "证据入口不可用"],
    decisionImpact: [
      "food、shopping、payment、ride 与 Steam entertainment 有专门词、来源与权重；beverage 另有吃喝分轴。",
      "Steam entertainment/digital 会读取 steam_games；普通游戏查询只保留 record_type 以 _played 结尾的 game/demo，application 与未玩观察退出。",
      "哔哩哔哩 entertainment 会读取 bilibili_activity；收藏、点赞、投币、稍后看和追番强于单次播放，首页推荐不作为偏好来源。",
      "travel、stay、其他 entertainment/digital、service、tool、aesthetic 已能识别并用明示/通用证据或明确缺口，但没有同等专门 parser。",
      "current statements/snapshots 按查询域过滤；无域问题才保留全量 current 上下文。",
      "ai_assistant_locator 与 Gemini mixed_activity 不参与 evidence。",
      "AI 平台消息保留用户/助手/平台作者边界；问题可能带真实本人背景，按原文语境判断，不把疑问、转贴、假设或为他人选择自动改成本人偏好。",
      "退款、关闭、取消、失败，以及后来被可靠同订单链全额退款覆盖的成功订单/支付，在 evidence 阶段退出普通偏好上下文、repeat_count 和快照支持；facts 仍保留先买后退的事实。",
      "支付宝只归一已确认的淘宝订单号变体；可靠匹配同一订单的微信/信用卡支付作旁证，不重复计权。未匹配订单但有明确品名或商户的有效支付可支持相应消费事实；泛称只支持渠道，部分退款与不唯一关联保持 Unknown。",
      "recency（近期程度）只在来源、语义和状态相当时增加最多 1 分；六年前的有效单次成功记录仍可返回，未被更正的 current 明示也不会因时间自动过期。",
      "次数少、长期未买或没有记录只表示证据较弱或 Unknown；只有本人当前明确拒绝、纠正或其他直接反证才能形成负向偏好。",
      "中文查询扫描完整相关来源，>1,000 条之后的旧精确命中不会消失；此前专项观测低于 2 秒，不代表本轮每个自然问题的耗时。",
      "真实订单权重高于长 AI 文本；Steam 累计游玩时长只保留为事实，不参与偏好评分。当前免费游戏在其他条件相同时只低 0.5 分。"
    ],
    problem: "解决上下文膨胀、无关 current 污染、中文旧记录漏召回、AI 疑问误标表达和宽泛 top hits 冒充完整偏好。",
    implementation: [
      "query_terms 从自然问题抽取中文片段/ASCII 词并补专门域词；扩展域没有词表时安全返回空补充而不崩溃。",
      "query_domains 识别 11 个当前域；Steam/游戏进入 entertainment，数字游戏也可进入 digital；relevant_logical_sources 只选择需要的来源类型。",
      "SQLite read-only URI 与 query_only 保证业务表和主文件不被查询修改；busy_timeout 只等待现有锁。只读连接仍可能更新 -shm mtime，因此不宣称严格文件系统零写。",
      "记录先按 effective outcome 过滤非成功与 refunded_full 订单链，再按 term match、source weight、recency、状态和饮料轴加权；recency=1/(1+age_days/365)，只加排序分，不设过期门槛。",
      "Steam 先过滤未玩记录；查询明确写游戏时再排除 application。playtime_minutes 不参与评分，同 AppID 只从 steam_store_metadata 补当前 store_price_class，current_free 在其他条件相同时减 0.5。",
      "Bilibili 按行为类型增加不同排序权重，并排除已失效视频；单次播放比收藏、点赞、投币、稍后看和追番更弱。",
      "当前仍保留 FTS5 表，但中文精确召回不依赖最近 1,000 条或向量库。"
    ],
    flow: ["读取 CURRENT 快路径", "识别自然问题的域和轴", "选择相关来源", "读取 current 明示/有效推定", "扫描并排序相关记录", "过滤非成功订单、无关AI内容和模板", "B站按行为强度排序", "Steam过滤未玩/应用并连接当前商店分类", "返回少量证据给 Skill/AI"],
    concepts: [
      { term: "domain（领域）", explanation: "本次问题属于吃喝、购物、支付、出行或扩展偏好的哪一类，用来缩小来源与 current 上下文。" },
      { term: "axis（选择轴）", explanation: "同一开放问题里会改变答案的独立方向，例如美食中的吃与喝。" },
      { term: "query-scoped context（按问题限定的上下文）", explanation: "只返回与当前域有关的明示和推定，再保留少量真正跨领域的交互原则。" }
      ,{ term: "game observation（游戏行为观察）", explanation: "Steam 有实际游玩时长的 game/demo 记录；游玩时长只保留为观察，不参与偏好评分，也不证明喜欢或历史取得方式。" }
    ],
    boundaries: ["不是向量检索或通用语义模型。", "命中顺序、播放、收藏、游玩时长和近期程度都不自动等于喜欢。", "B站首页推荐不进入偏好，平台可见窗口不等于完整历史。", "收藏、稍后再看、追番/追剧只有完整 current set 才按缺失局部退役；播放、点赞、投币不按消失清退。", "Steam 未玩项目、应用和账号引用不进入普通游戏上下文。", "当前商店分类不证明历史取得方式。", "非成功和 refunded_full 订单不进入普通偏好 evidence、模型上下文或复购计数；partial/Unknown 不猜。", "时间只排序，不让久远有效记录或未更正明示自动过期。", "低频、长期未买和没有记录都不等于不喜欢。", "Gemini 只让可证明作者是用户、且实际语境支持本人表达的消息进入相应证据；mixed_activity、助手和已知平台输入排除。", "没有命中保持 Unknown。"],
    failures: [
      { condition: "扩展域没有 DOMAIN_TERMS", response: "使用空补充词而不是 KeyError；仍返回该域明示/通用证据。" },
      { condition: "AI 消息含疑问、假设或替他人询问", response: "按完整语境区分已表达的本人背景和问题本身，不自动认定本人偏好；作者不明或纯助手/平台输入排除。" },
      { condition: "订单状态表示退款、关闭、取消或失败", response: "保留记录供事实核对，但从普通偏好 evidence、模型上下文与 repeat_count 排除，不反推喜欢或不喜欢。" },
      { condition: "此前成功订单后来被可靠同订单链全额退款覆盖", response: "原订单、支付和退款事实都保留，有效结局改为 refunded_full，并让依赖它的 current 推定 stale；partial/Unknown 不传播。" },
      { condition: "B 站 current set 的账号、Schema、range、分页、计数或成员唯一性不完整", response: "本轮缺失成员不退役；只有完整集合才局部退出 current，且移除不反推不喜欢。" },
      { condition: "记录很久、次数少或本轮没有命中", response: "降低或缺少排序证据，但保留有效成功记录与未更正明示；没有直接反证时保持 Unknown，不自动写成不喜欢。" },
      { condition: "Steam 项目只有观察/安装、没有实际游玩，或内容类型是应用", response: "不进入普通 Steam 游戏偏好结果；仍可留在事实层，不反推喜欢或不喜欢。" },
      { condition: "Steam 商店当前分类存在但历史取得方式不明", response: "返回当前 store_price_class，同时保持历史 acquisition Unknown，不猜直购、礼物、激活码、限免或家庭共享。" },
      { condition: "B 站问题命中其他娱乐来源", response: "只保留 bilibili_activity 的 current 明示与记录，不用 Steam、旧失效快照或全库噪声补数量。" },
      { condition: "相关中文记录早于最近 1,000 条", response: "完整扫描相关来源并按命中排序；不以截断冒充无证据。" },
      { condition: "数据库不可读", response: "只报告入口不可用，不修改数据库或改走中央画像。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现 query terms/domains/axis、只读检索、上下文过滤、排序和证据输出。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖真实订单优先、非成功证据排除、Steam 多账号/游玩/应用过滤与商店关联、ASCII、中文 >1000、扩展域与 AI 本人表达过滤。" },
      { path: "SKILL.md", role: "拥有开放题补轴、最小证据和最终推荐解释。" }
    ],
    verification: ["构造 1,001 条较新占位与第 1,002 条旧中文目标，确认旧目标仍返回。", "合成同类近期与六年前成功记录，确认近期更靠前、旧记录仍返回且 repeat_count=1。", "退款、关闭与 refunded_full 链在 facts 保留交易事实，在 evidence 和快照支持中退出；partial/Unknown 不传播。", "Steam 合成回归证明游玩时长不加分、current_free 只低 0.5 分，并过滤未玩与 application。", "当前 Steam 聚合为 118 已玩游戏、6 已玩应用、8 未玩游戏和 33 其他应用。", "当前 B 站自然问题只返回该平台记录与明示，不再引用任何已失效推定；AI/开发与出行问题也分别命中正确域。"],
    relation: "它消费来源模块的 current 事实，并把最小证据交给具体事实核对或推荐菜单；本模块不生成最终建议。"
  }),
  commonModuleShape({
    slug: "fact-verification",
    shortTitle: "具体事实与原件",
    title: "把买过、付过、后来全退和真正喜欢分开",
    searchAliases: ["买过就是喜欢吗", "付款会不会重复计算", "为什么说我喜欢这个", "复购次数", "退款关闭取消失败算偏好吗", "没有记录是不是不喜欢", "农夫山泉苏打水不是矿泉水", "模板赠品会不会算偏好"],
    searchProjection: {
      intents: ["核对具体商品事实", "区分订单付款和全额退款", "检查退款是否可靠传播", "有界回看原件"],
      entities: ["facts", "effective outcome", "refunded_full", "full_refund_count", "payment_observation", "artifact SHA-256"],
      relations: ["具体term聚合记录组", "可靠同订单链全额退款覆盖此前成功行", "支付和信用卡只作旁证不重复购买", "original先验artifact再返回内容"],
      failureRecovery: ["模板赠品过滤", "原件missing或changed不返旧片段", "ChatGPT核content hash", "非重读类型标缓存片段"]
    },
    teaser: "项目敢于推测，但一笔成功购买后来全额退款时，必须沿可靠订单链纠正有效结局；原事实不抹掉，普通偏好也不继续吃旧证据。",
    status: "全额退款传播继续有效；信用卡 1,287 消费、192 退款、32 账单是 2026-09-04 的专项观察。本轮新增未匹配有效支付的语义召回，订单旁证与独立消费事实分开",
    statusTone: "pass",
    value: "给‘为什么适合我’一个能复核的事实基础，同时保留订单状态不等于满意的边界。",
    why: "商品标题含营销词、赠品和未选口味，支付账单又可能重复同一订单，退款还可能只是凑单后的撤回。只看次数会把模板、非成功订单和付款旁证都误算成喜欢；反过来，次数少或很久没买也不能自动写成不喜欢。",
    example: "我可以问：“这笔购买后来全额退了，为什么推荐里还算我喜欢？”系统会保留曾下单、支付和退款的事实，核对是否为可靠同订单链；闭合才把有效结局改为 refunded_full，并让依赖它的推定失效。",
    result: "得到按证据角色和有效结局分开的事实组：曾买、支付旁证、后来全退、partial/Unknown、时间与变体；全退退出推荐不等于反推不喜欢。",
    readerStates: {
      pass: "具体词命中详细订单与用户现实表达时，返回事实组和时间/状态/变体，必要时在原件 SHA 一致后有界回看。",
      problem: "只有付款、非成功订单、模板、赠品或疑问时保持旁证、交易负状态或无结论，不升级喜欢；次数少、长期未买或没有记录也不升级成不喜欢。",
      unavailable: "原件缺失、字节变化、内容定位变化或不可读时返回明确状态，text 为空；不继续输出旧缓存冒充原文。"
    },
    stateLabels: ["已核对事实", "证据不能升级", "原件核对不可用"],
    decisionImpact: [
      "order_observation 只证明买过/点过；可靠同订单链全额退款会把此前成功行的 effective outcome 改为 refunded_full，退出 repeat_count 与快照支持。",
      "原订单、支付和退款继续出现在 facts，并给出 full_refund_count；退出普通 evidence 不等于生成负向偏好。部分退款、组单或关联不唯一保持 partial/Unknown。",
      "久远成功记录继续计入 facts 与可返回证据；低频、长期未买和没有记录都不是负向事实，只有本人当前拒绝/纠正或其他直接反证才支持负向偏好。",
      "支付宝只归一已确认的 T200P 淘宝订单号变体；微信与信用卡 payment_observation 只补支付渠道和消费链，不重复购买，也不参与支付宝净额求和。",
      "user_expression 只有本人现实表达候选才成立，AI 仍做最终语义判断。",
      "淘宝营销前缀、饿了么商家模板、赠品和未选‘三选一’过滤。",
      "facts 按品牌与品类词要求 all-term match，并分正向/负向状态、首末时间和变体。",
      "公开真实 L2 样例保留具体苏打水语义，不公开商家、金额、账号、路径或原始聊天。",
      "original 先核制品 SHA；ChatGPT 再核消息 content hash，PDF 从同字节制品重新抽取并做窄掩码，因此不是逐字原文；其他类型标 verified_artifact_cached_excerpt。"
    ],
    problem: "解决买过=喜欢、付款=第二次购买、非成功订单=复购、无记录=不喜欢、商品标题泛化、模板/赠品混入和原件漂移后继续输出旧片段。",
    implementation: [
      "preference_fact_text 清理淘宝营销前缀，并从饿了么商品串中筛掉非偏好模板。",
      "facts 扫描 current 与订单链状态，按 evidence role/source 分组，统计有效结局、full_refund_count、时间和文本变体；原交易事实不会因退出偏好而删除。",
      "evidence 在排序前排除退款、关闭、取消、失败与 refunded_full 行；repeat_count 只累计仍为正向有效结局的订单。",
      "退款传播只使用同源精确订单号与已确认的支付宝 T200P 变体；金额/时间不符、处理中/失败、跨支付渠道同号、部分退款、组单或候选不唯一都不传播。",
      "信用卡同源只在同币种、规范化商户、精确金额、先消费后退款且双方候选唯一时形成全额退款旁证；不生成第二次购买。",
      "original 从 records 定位 artifact，先核存在和 SHA-256；ChatGPT 再定位 conversation/node 并核 content SHA。",
      "PDF 重读异常返回 original_unreadable；XLSX/CSV/TXT/Gemini 返回已验真制品的缓存片段。"
    ],
    flow: ["先用 evidence 找候选", "确定品牌/品类词", "facts 全量核对具体记录", "分订单/付款/表达角色", "统计状态/时间/变体", "只有细节改变结论时调用 original", "向 AI 返回事实和不能证明项"],
    concepts: [
      { term: "order observation（订单观察）", explanation: "平台记录显示买过或点过；不自动表示喜欢、满意或本人使用。" },
      { term: "refunded_full（已全额退款）", explanation: "此前成功订单/支付后来被可靠同订单链的已完成全额退款覆盖；原事实保留，但普通偏好、复购和快照支持退出。" },
      { term: "payment observation（支付旁证）", explanation: "说明支付链或渠道发生过；已有详细订单时不能再当一笔购买。" },
      { term: "artifact verification（制品验真）", explanation: "重新计算原文件 SHA-256，先证明 locator 仍指向导入时同一字节。" }
    ],
    boundaries: ["正向交易状态不等于满意。", "非成功或 refunded_full 交易事实不等于喜欢或不喜欢，也不进入普通偏好 evidence。", "部分退款、组单、多商品、跨渠道同号、金额/时间不吻合或关联不唯一保持 Unknown。", "没有记录、次数少或长期未买都不等于不喜欢。", "支付只作旁证，不重复购买。", "不公开 locator、原始对话或财务组合。", "不为一次事实核对扫描新目录。"],
    failures: [
      { condition: "商家模板、赠品或未选项混入", response: "从 preference_fact_text 过滤；没有可用商品时不造事实。" },
      { condition: "订单退款、关闭、取消或失败", response: "facts 保留 matched/negative 交易事实；普通 evidence、模型上下文和 repeat_count 排除，不能据此生成喜恶推定。" },
      { condition: "已成功订单后来出现可靠同订单链全额退款", response: "标记 refunded_full、保留原始事实、退出普通 evidence/repeat_count/快照支持；依赖推定 stale。" },
      { condition: "部分退款、组单或订单链关联不唯一", response: "保持 partial/Unknown，不整单清退，也不继续把它包装成已确认成功偏好。" },
      { condition: "记录久远、低频或没有命中", response: "保留久远有效成功事实；低频或无记录只表示证据较弱/未知，没有直接反证时不生成负向偏好。" },
      { condition: "原件文件不存在", response: "返回 original_missing、text=null，不输出缓存。" },
      { condition: "原件 SHA-256 变化", response: "返回 artifact_changed、text=null；要求重新 ingest。" },
      { condition: "ChatGPT 消息定位或 content hash 变化", response: "返回 record_content_changed，不冒充同一原话。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现事实清理、facts 分组、证据角色、精确链接和 original 验真。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖具体苏打水语义、模板/赠品、订单/退款/支付角色和原件 missing/changed/valid。" },
      { path: "CURRENT.md", role: "提供当前推定中的公开普通事实摘要；原始正文不进入网页。" }
    ],
    verification: ["真实回读 1,287 条信用卡消费、192 条退款和 32 份账单摘要；旧 30 条整页 credit_statement 已退出 current，支付事实不重复购买。", "全额退款夹具证明原订单/支付/退款仍可 facts 回读，同时普通 evidence、repeat_count 与依赖快照退出。", "部分退款、组单、跨渠道同号、金额/时间不符与候选不唯一均保持 Unknown。", "六年前的单次成功记录仍可返回；一次成功耐用品、软件或行程不因无复购降为不喜欢。", "修改/删除已导入原件时 original 返回 changed/missing 且 text=null。", "有效 ChatGPT ZIP 重新打开并核消息 content hash。"],
    relation: "它把证据查询的候选变成可核对事实；推荐模块只能在这个事实边界内解释，不得升级证明力。"
  }),
  commonModuleShape({
    slug: "recommendation-choice",
    shortTitle: "推荐菜单与选择权",
    title: "把历史变成排序和探索，不变成白名单或唯一答案",
    searchAliases: ["今晚吃什么", "给我熟悉和新鲜的选择", "不要只复述订单", "根据我玩过的Steam游戏推荐", "Steam免费游戏和付费游戏怎么选", "很久没买还能推荐吗", "没有记录不要猜不喜欢", "购物推荐", "旅行住宿推荐", "数字消费与服务工具", "审美偏好", "去哪里搜什么词", "没有比价API还能推荐吗"],
    searchProjection: {
      intents: ["生成开放式推荐菜单", "基于实际玩过的Steam游戏探索", "保留新鲜探索", "给平台搜索接力", "用户保留最终决定"],
      entities: ["熟悉稳妥", "相邻探索", "合理新鲜", "game observation", "store price class", "search handoff", "Skill", "AI"],
      relations: ["历史只排序候选", "Steam实际游玩连接偏好轴", "当前商店分类帮助选择但不解释历史取得", "相邻项连接已知偏好轴", "新鲜项标推测", "实时信息交给平台搜索"],
      failureRecovery: ["证据不足标Unknown", "Steam未玩和应用不进入游戏偏好", "历史取得方式保持Unknown", "无实时API仍给搜索词", "用户未要求单选不替决定", "项目入口不可用只用本轮明示"]
    },
    teaser: "真正的个性化不是把旧订单再念一遍：熟悉选择提供稳妥，相邻选择扩展边界，新鲜选择保留好奇心，用户自己决定。",
    status: "三类菜单、搜索接力和选择权由 daily-preferences Skill 与当前 AI 拥有；Python 项目提供事实，不内置推荐模型、比价 API 或下单执行器",
    statusTone: "mixed",
    value: "推荐既有连续性，也不会越用越窄；信息不足时仍交付可执行的搜索下一步。",
    why: "只从历史挑同款会把数据变成白名单；把旧记录自动过期或把没记录解释成不喜欢，又会制造假的负向偏好。只给一个综合最优还会把用户的场景、好奇心和最终选择权藏在模型里。",
    example: "我可以说：“根据我真正玩过的 Steam 游戏，给我熟悉、相邻和新鲜三类选择。”系统从仍有效的已玩游戏事实中按问题有界取证，再给玩法或节奏相邻的候选和明确标为推测的新选择；累计启动时长不参与评分，当前免费只略低权。",
    result: "得到一份可以比较的菜单，而不是一句命令：具体内容、熟悉/相邻/推测身份、为什么适合、关键取舍、必要的粗略价格/场景和搜索接力。",
    readerStates: {
      pass: "明示与证据足够时，Skill/AI 生成至少 3 个熟悉、3 个相邻、3 个合理新鲜候选；仍有显著路线时继续列。",
      problem: "证据矛盾、过期或扩展域覆盖较弱时标注依据、推测和 Unknown，不用同款变体凑数。来源接入成功或旧推定被标 stale 都不等于菜单已重新生成；只使用仍有效的明示和证据继续判断。",
      unavailable: "项目或平台实时信息不可用时，依据本轮表达给临时候选和搜索词；不声称最低价、库存或下单成功。"
    },
    decisionImpact: [
      "3+3+3 是 Skill/AI 回答结构，不是 Python 代码自动生成的 UI 或算法。",
      "熟悉稳妥来自高把握明示/行为；相邻探索说明与哪些偏好轴相邻；新鲜项允许未出现在来源中但必须标推测。",
      "退款、关闭、取消、失败和 refunded_full 订单链不进入熟悉/相邻候选，也不增加复购强度；原交易事实仍可核对。部分退款、组单和关联不唯一保持 Unknown。",
      "时间只在其他条件相同时调整候选顺序；久远有效成功记录和未更正明示仍可支撑熟悉/相邻选择，低频或无记录保持 Unknown。",
      "Steam 熟悉证据只来自实际游玩；多账号按 AppID 合并后仍保留观察边。累计启动时长不参与评分，当前免费只在其他条件相同时低 0.5 分，且不证明历史怎样取得。",
      "每个候选比只报名词细一档：具体内容、理由、取舍，以及必要价格、场景或关键词。",
      "没有京东、淘宝、拼多多稳定比价 API 不等于无法建议；最终实时价格与跨平台比较由用户查看。",
      "餐厅优先给候选，再按需求推荐大众点评、淘宝闪购/饿了么或美团中的少量平台。",
      "除非用户明确说只给一个或直接替我选，否则不替用户下单、付款或决定唯一套餐。",
      "旅行住宿等扩展域可以基于明示和通用证据推荐，但当前不冒充专门来源解析与同等验收。"
    ],
    problem: "解决推荐只复述历史、同款变体凑数量、模型替用户单选、没有实时 API 就停工和平台无差别罗列。",
    implementation: [
      "Skill 先读 3 个仍有效的 current 推定，按会改变选择的轴调用 evidence/facts，必要时有界 original；Python evidence 排除非成功与 refunded_full，facts 仍保留先买后退。",
      "AI 将来源事实、current 明示、推定和 Unknown 分层，再生成三类候选。",
      "Steam 游戏候选先经过 played-only 与 application 过滤，再把 store_price_class 作为当前选择条件；历史 acquisition 保持 Unknown。",
      "搜索接力按品类选 1–2 个平台与可复制关键词，不遍历所有平台。",
      "Python CLI 不生成候选菜单、不搜索实时价格、不调用模型 API，也不执行下单；ingest 的 completed 和 invalidated_snapshots 只报告证据接入与旧推定失效。",
      "snapshot 保存的是 AI 已明确给定的推定文本及当前证据绑定，不是 Python 自动推导；它同样先提交 SQLite 再写 CURRENT，saved 回执与缓存写入失败须按真实阶段解释。",
      "用户的接受、拒绝和纠正只有在明确表达后才通过 record 更新 current。"
    ],
    flow: ["自然推荐请求进入 Skill", "读取 current 与最小证据", "必要时 facts/original 核对", "AI 分开事实/推定/未知", "生成熟悉/相邻/新鲜菜单", "补关键取舍和搜索接力", "用户选择或纠正"],
    concepts: [
      { term: "熟悉稳妥", explanation: "有高把握明示、长期行为或明确使用场景支撑的低风险选择。" },
      { term: "相邻探索", explanation: "在已知偏好轴旁边移动一步，既有新意又能说明为什么相邻。" },
      { term: "合理新鲜", explanation: "可能从未出现于历史，但与已知偏好或决策方式有可解释连接，并明确标成推测。" },
      { term: "search handoff（搜索接力）", explanation: "把实时门店、菜单、优惠、库存或价格交给最相关平台，并给用户可复制关键词。" }
    ],
    boundaries: ["不冒充 Python 推荐算法。", "Steam 仅观察/安装/未玩和应用不进入普通游戏偏好，当前商店分类不证明历史取得方式。", "非成功和 refunded_full 不进入普通偏好、模型上下文或复购计数；partial/Unknown 不猜。", "认知是否继续成立由 AI 复核相关来源与反例；stale 不是本人改变偏好的结论。", "久远、低频、长期未买或无记录都不自动等于过期/不喜欢。", "不承诺实时最低价。", "不替用户下单付款。", "不把历史变成白名单。", "不为扩展域虚构专门来源能力。", "用户未要求单选时保留选择权。"],
    failures: [
      { condition: "没有实时平台 API", response: "仍可根据偏好给候选、估计与经验判断，再交付 1–2 个平台和搜索词。" },
      { condition: "证据只能证明买过", response: "候选理由写成行为相邻或待探索，不写成已确认喜欢。" },
      { condition: "记录显示退款、关闭、取消或失败", response: "不进入候选上下文、复购计数或喜恶推定；只有需要解释交易时才作为负状态事实回读。" },
      { condition: "此前成功记录后来可靠全额退款", response: "有效结局改为 refunded_full 并退出候选/复购/快照支持；事实保留，不能反推不喜欢。" },
      { condition: "旧推定因退款或 B 站成员语义升级失效", response: "只使用仍有效的相关认识与事实；按实际证据复核受影响的摘要和详述，不把一次程序失效变成永久停工。" },
      { condition: "偏好很久没出现或来源里没有记录", response: "降低把握或保持 Unknown；不自动写成不喜欢，除非用户当前明确拒绝、纠正或存在其他直接反证。" },
      { condition: "Steam 项目只在库中、仅安装、未玩或属于应用", response: "不作为普通游戏候选依据；保留事实层，不用库存在性代替实际行为。" },
      { condition: "只知道 Steam 当前免费/付费", response: "可用于眼下成本比较；历史直购、礼物、激活码、限免或家庭共享继续 Unknown。" },
      { condition: "没有合理新鲜项", response: "继续寻找不同偏好轴或明确本轮证据不足；不能用同款口味变体凑数。" },
      { condition: "用户要求只给一个", response: "在现有候选和取舍上做单选，并说明决定依据；仍不执行购买。" }
    ],
    sources: [
      { path: "daily-preferences/SKILL.md", role: "定义三类菜单、搜索接力、用户选择权、平台边界和扩展领域。" },
      { path: "daily_preferences.py", role: "提供 current、refresh、evidence、facts、status、snapshot 与 original 事实接口。" },
      { path: "AGENTS.md", role: "定义历史只排序、不替用户决定和无中央画像边界。" }
    ],
    verification: ["全新自然更新对话没有点名 Skill、命令或路径，能够自行刷新三类自动来源并完成语义闭环；推荐结构仍由 Skill/AI 判断。", "当前 Steam 事实层为 118 已玩游戏、6 已玩应用、8 未玩游戏与 33 其他应用；普通游戏证据只取第一类。", "回归证明极长启动时长不增加偏好分，当前免费只在其他条件相同时低 0.5 分。", "核对每个新鲜项都有邻接依据和推测标签。", "核对搜索接力只给相关平台与可复制词，不冒充最低价或执行付款。"],
    relation: "它消费前四个模块的 current、来源、证据和具体事实；输出仍是 AI 协助的选择菜单，用户决定后才可能回到 current-corrections。"
  })
];

export const project = dailyPreferencesProject;
export const modules = dailyPreferencesModules;
export { dailyPreferencesProject, dailyPreferencesModules };
