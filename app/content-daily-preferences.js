import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以直接推荐", "需要分辨", "当前不可用"];
const sourceMainCommit = "4bcc37c295ba0476d4965eb5cd47244dd4b38654";
const behaviorCommit = "821ee49ae954549f16dd454a5f9ef81c80be7180";
const observedAt = "2026-09-01T16:10:23.5268669Z";
const wrapperCommand = "pwsh -NoProfile -File .\\daily-preferences.ps1";

const dailyPreferencesSnapshot = createProjectSnapshot({
  observedAt,
  label: "v0.6 源码、40 项回归、10 个来源迁移与 6 个当前推定已经核对",
  boundary: "这是人工增量的最后核对状态，不是后台实时画像。当前价格、门店、菜单、优惠和未来偏好仍在每次请求时确认；5 类逻辑来源尚未取得，信用卡来源仍有 1 个已知缺月。",
  metrics: [
    { label: "当前明示", value: "16 条" },
    { label: "当前推定", value: "6 条" },
    { label: "来源实例", value: "11 个" },
    { label: "源码回归", value: "40/40 pass" }
  ],
  facts: [
    { label: "项目到底保存什么", value: "保存 16 条 current 明示、6 个 current 推定、历史表述、来源实例、行为记录版本与证据关系；不保存一份不可推翻的完整人格。" },
    { label: "当前数据状态", value: "54,283 个 current（当前）记录键保持不变；61,388 条记录含历史版本；75 份来源制品仍在原处，项目只保留索引与定位。" },
    { label: "当前来源", value: "11 个来源实例中有 9 个 acquired_verified（来源已取得并核对）、2 个 snapshot_only（只有快照）；10 个非人工来源已收敛到解析版本 daily-preferences.v0.6。" },
    { label: "当前缺口", value: "bank transactions（银行交易）、京东订单、拼多多订单、美团订单与菜鸟物流 5 类逻辑来源尚未取得；信用卡来源有 1 个已知缺月；最近一次导入没有 failed（失败）或 partial（部分完成）。" },
    { label: "事实与推定", value: "订单只证明买过或点过，支付只补渠道旁证，行程只证明发生过；用户当前同 key（偏好键）明示优先，推定必须绑定 current 证据并可随来源或纠正失效。" },
    { label: "接入结果不是推荐结果", value: "ingest 分别返回 completed（本次接入完成）、no_change（没有新解析记录）、partial（部分完成）或 failed（失败），并列出文件/记录计数、gaps 与失效推定数量。接入只更新证据和状态，不自动生成新推荐；新候选仍由 Skill 与 AI 依据有效证据组织。", hero: false },
    { label: "当前性能", value: "40/40 源码回归通过；真实 54,283 个 current 记录上，证据查询观察约 1.2–1.5 秒，这不是 SLO（服务目标）；中文具体词会检查完整相关来源，不再只看最近 1,000 条。", hero: false },
    { label: "v0.6 数据修正", value: "1,749 条微信支付 Excel 本地时间全部纠正，其中 841 条回到正确日历日；迁移前后 current 键零增零减，数据库 integrity_check=ok、外键 finding=0。" },
    { label: "数据与整页时间", value: "CURRENT 数据层最后写于 2026-09-01T14:20:46.3506127Z；整页 observedAt 是后来完成 source main、实现盲请求、内容接线与终审的时间，两者不互相冒充。", hero: false },
    { label: "索引清洗边界", value: "本地索引在特定支付、信用卡与行程字段中掩码 email（邮箱）、独立 7–19 位数字和支付方式末四位；它不是全局匿名化，普通商品、平台、时间与偏好事实继续保真。", hero: false },
    { label: "公开展示边界", value: "公开普通产品思想、聚合状态、具体的普通 L2 偏好样例、代码、命令、失败与缺口；不复制原始聊天、账号、商家—金额—时间组合、行程起终点、原件路径或凭据。", hero: false }
  ],
  gaps: [
    "旅行、住宿、娱乐、数字消费、服务、工具和审美已经能自然路由并使用明示/通用证据，但专门 parser（解析器）、排序权重与同等回归目前只有吃喝、购物、支付和出行。",
    "Gemini 快照进入来源覆盖和版本状态，但记录标为 mixed_activity（混合活动），当前 evidence（证据查询）会过滤它；不能把它写成已经参与推荐。",
    "ChatGPT ZIP 会在制品 SHA-256 后继续核消息 content hash 并返回对应原文；PDF 从同字节制品重新抽取后还会掩码邮箱与 7–19 位数字，因此不是逐字原文。XLSX、CSV、TXT 和 Gemini 明确返回已验制品的缓存片段。",
    "支付与详细订单可以按精确 correlation key（关联键）建立关系，但推荐证据当前仍由 Skill 与 AI 判断其旁证角色；没有把付款计入订单 repeat_count（重复次数）。",
    "权威 full（完整快照）若解析为零记录会失败关闭并保留旧 current；尚未为每个平台证明‘有效空快照’的独立语义。",
    "历史已经按时间相邻区间保存，但没有面向用户的 history（历史查询）或 withdraw（撤回）命令。",
    "ingest、record 和 snapshot 都先提交 SQLite，再刷新 CURRENT.md。缓存写入失败可能发生在业务数据已经提交之后；当前没有明确的 db_committed/cache_stale 分层回执，不能把错误当作整次未记录后盲目重复写入。",
    "75 份现存来源制品足以重放非人工记录层；CURRENT 只能从尚存 SQLite 重建。用户明示、推定及其历史没有独立恢复输入，完整 SQLite 丢失恢复尚未建立；项目也没有正式导出、备份或跨机器迁移入口。"
  ]
});

const dailyPreferencesProject = {
  order: 15,
  slug: "daily-preferences",
  title: "日常偏好与个性化推荐",
  route: "/projects/daily-preferences",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "v0.6 已闭合来源、证据、纠正和可推翻推定；推荐继续由当前 AI 组织，实时平台信息按次确认",
  cardStatusTone: "mixed",
  ...dailyPreferencesSnapshot,
  kicker: "让每次选择记得我，但不把过去变成固定答案",
  searchAliases: [
    "日常偏好与个性化推荐",
    "你怎么记住我喜欢什么",
    "偏好变了怎么纠正",
    "推荐为什么适合我",
    "订单和支付怎么算证据",
    "准备投递增量",
    "薄快照为什么过期",
    "不建中央画像"
  ],
  repositoryNote: `实现位于 PRIVATE（私有）仓库 daily-preferences，当前 main 为 ${sourceMainCommit}；v0.6 行为闭合于 ${behaviorCommit}，随后四个 docs-only（仅文档）提交只保存当前验收、修正格式、澄清动态 main/窄索引清洗/只读边界，并保留三条 evaluator（验收代理）的宿主回执边界。公开页保留产品判断、解析版本、聚合状态、命令、数据关系、40 项测试、v0.6 迁移、失败和恢复缺口；具体偏好只选一个会改变理解的普通 L2 事实链，不复制原始私人正文或 L3+ 载荷。`,
  summary: "这个项目保存的不是一份“我是什么样的人”的总画像，而是：我现在明确说了什么，哪些行为事实支持或反驳某个判断，这条推定何时应该失效。普通问题先读一份很小的当前快照，需要解释时才查相关证据。推荐同时给熟悉稳妥、相邻探索和有依据的新鲜尝试，我可以随时用一句纠正改变后续排序。",
  why: "没有这条能力，AI 要么每次从零猜，要么把旧订单、付款和对话压成永久标签。买过不等于喜欢，同一订单的付款也不等于又买了一次，曾经喜欢更不代表现在。这个项目把事实、推定、当前表达和未知分开，让连续性不会牺牲可纠正性。",
  plainExample: "例如我问“今晚吃什么”，并补一句“最近不想太辣”。能力入口先以这句最新明示为准，再分别补查“吃”和“喝”的相关证据；只有需要解释复购理由时，才核对具体商品、成功与关闭次数、时间和文本变体。结果同时给熟悉、相邻和新鲜选择，需要当前门店、菜单或优惠时再附合适平台和可复制关键词。",
  result: "推荐时，我得到一组可以自己选择的候选，写清具体内容、适合理由、关键取舍与推测，必要时附搜索接力。补来源时得到的则是接入状态、处理计数、缺口和已失效推定数量，不是一份新菜单；表达或改主意被成功记录后，下一次推荐才按新的 current 排序，旧表述留作历史。",
  readerStates: {
    pass: "推荐请求由 Skill/AI 根据当前明示和有效证据交付熟悉、相邻与新鲜候选；记录或接入请求则交回 recorded/recorded_historical 或 completed/no_change 及具体计数。保存证据、更新缓存与生成推荐是不同结果，不互相冒充。",
    problem: "接入部分完成或失败时列出已处理记录、gaps 与失效推定，不把 acquired_verified 来源标签当作本轮导入成功。新旧表达、事实或推定冲突时分开解释，失效推定不继续用于当前推荐。",
    unavailable: "查询入口不可用时只依据本轮表达给临时候选；写入出错则先区分数据库未提交还是提交后缓存刷新失败，保留已发生结果并核对原记录，不盲重写。不把缺快照说成没有偏好，也不扩大扫描。"
  },
  stateLabels,
  methodCanvas: {
    kicker: "偏好协作画布",
    headline: "先听现在怎么说，再查会改变选择的事实，最后把历史变成更多选择",
    description: "用户负责表达、纠正和选择；本地项目负责来源、记录、版本与证据；Skill 与当前 AI 负责解释证据、生成候选和给搜索接力。三层不互相冒充。",
    steps: [
      { actor: "自然开口", title: "提出选择或直接纠正", detail: "可以问吃什么、买哪个、住哪里，也可以直接说最近不想吃辣、以后更看重少维护。" },
      { actor: "现在优先", title: "最新同 key 明示成为 current", detail: "带日期的旧表述进入历史；较新的当前表达不会被旧订单或推定覆盖。" },
      { actor: "快路径", title: "先读很小的当前快照", detail: "普通请求不扫描账号和原件；快照缺失或失效也不等于没有偏好。" },
      { actor: "按需补证", title: "只查会改变这次选择的轴", detail: "吃和喝分开，具体商品需要解释时才核对次数、状态、时间与文本变体。" },
      { actor: "AI 组织", title: "返回熟悉、相邻和新鲜候选", detail: "新鲜项可以没买过，但必须说明邻接依据并标成推测；不靠同款变体凑数。" },
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
    { title: "现在说的优先", detail: "用户当前同 key 的明示高于旧表述、订单和推定；回顾过去不会偷偷覆盖现在。" },
    { title: "事实准确，推定主动但可推翻", detail: "来源、时间、账号和记录身份必须准确；偏好判断可以大胆提出，但必须说明依据并接受纠正。" },
    { title: "买过不等于喜欢", detail: "订单、支付、行程和聊天各自只证明自己能证明的事；支付旁证不进入订单重复次数。" },
    { title: "具体语义高于宽泛标签", detail: "优先保留商品、菜品、口味和规格原名；不能把农夫山泉苏打天然水/苏打水泛化成矿泉水。" },
    { title: "普通问题走快路径", detail: "先用薄快照；只有理由、冲突、过度概括、索引过期或原件细节会改变答案时才补证。" },
    { title: "历史负责排序，不建立白名单", detail: "熟悉选择之外必须给相邻和合理新鲜路线，不能把数据源变成只能重复购买的围栏。" },
    { title: "最终决定留给用户", detail: "除非明确要求只给一个，AI 不替用户定唯一套餐、下单或付款。" },
    { title: "实时信息用搜索接力", detail: "没有稳定比价或门店 API 不算能力失败；给最相关的 1–2 个平台和可复制关键词，不冒充权威最低价。" },
    { title: "人工增量，不持续监控", detail: "普通推荐不顺便扫描或导入；只有用户准备补材料时才逐来源说明范围、缺口和模式。" },
    { title: "只清洗无消费者标识，不模糊普通事实", detail: "本地索引对特定字段里的邮箱、长数字和支付末四位做窄掩码；这不是全局匿名化，也不能成为删掉普通商品、平台、时间或偏好语义的理由。" },
    { title: "边界按真实 Owner 分开", detail: "健康、资产、真实付款、正式材料、关系对象、媒体和工作执行继续走各自项目；偏好项目不建中央个人数据库。" }
  ],
  gallery: [],
  responsibilities: [
    "保存用户 current 与 historical 表述，并让相关旧推定失效",
    "人工接入订单、支付、行程和 AI 对话来源，保留制品哈希、导入和记录版本",
    "按自然问题取相关 current 明示、有效快照和行为证据",
    "核对具体商品的正向/负向状态、时间范围、文本变体和重复观察",
    "维护 11 个来源实例的覆盖、缺口、材料和补包模式",
    "在特定支付、信用卡和行程索引字段中掩码邮箱、独立长数字与支付末四位，同时保留普通偏好语义",
    "在打开内容前核对原件制品 SHA-256，并区分真实重读与缓存片段",
    "为 Skill 与当前 AI 提供事实，不在 Python 内伪装成推荐模型"
  ],
  exclusions: [
    "不建立统一人格、中央认知、事件图、向量数据库或第二数据库",
    "不后台同步、轮询、监控账号，也不在普通推荐时顺便导入",
    "不保证实时价格、最低价、门店、菜单、优惠或库存",
    "不替用户下单、付款、选择唯一套餐或修改外部平台",
    "不把订单、付款、行程或 AI 对话自动升级成喜欢或满意",
    "不接管原件；照片、视频、音频、材料、健康、资产和正式文书由各自 Owner 保管",
    "不把扩展领域的自然路由写成已有同等 parser、权重和测试"
  ],
  glossary: [
    { term: "current（当前）", meaning: "同一个精确偏好键下现在生效的明示、记录版本或推定；旧版本仍保留历史。" },
    { term: "historical（历史）", meaning: "过去曾经有效、但不再代表现在的表述或记录版本；可解释变化，不覆盖 current。" },
    { term: "Preference snapshot（偏好快照）", meaning: "绑定来源修订和 current 证据的可重建推定；来源或用户明示变化后会 stale。" },
    { term: "Evidence role（证据角色）", meaning: "订单观察、支付旁证、行程观察和本人表达分别说明自己能证明什么，不能横向等权。" },
    { term: "full / incremental / snapshot / manual", meaning: "完整权威快照、普通增量、只能说明某个截面的快照、用户直接表达四种接入模式。" },
    { term: "Source revision（来源修订）", meaning: "与某个偏好领域有关的 current 记录、来源状态、解析版本、缺口和明示共同形成的哈希。" },
    { term: "verified_artifact_cached_excerpt（制品已验真的缓存片段）", meaning: "原文件仍存在且 SHA-256 一致，但当前入口没有逐行重解析，只返回绑定到该制品的索引片段。" }
  ],
  operatingFlow: [
    { title: "直接表达或提问", detail: "自然说偏好、纠正、过去日期或本次选择问题，不需要用户知道偏好键和命令。" },
    { title: "先取 current 快路径", detail: "读取当前明示与有效快照；缺失或 stale 时继续最小证据，不把缺快照写成没有偏好。" },
    { title: "按问题补证", detail: "吃喝、购物、支付、出行按专门轴；旅行住宿等扩展域先用明示和通用证据，不冒充专门解析器。" },
    { title: "需要原因时核对 facts", detail: "具体商品按品牌与品类词返回匹配、正向/负向状态、首末时间与变体；模板和赠品过滤。" },
    { title: "必要时有界回原件", detail: "先核对制品存在和 SHA-256；ChatGPT 再核消息 hash 并返回对应原文，PDF 重新抽取后做窄掩码，其他类型明确返回已验制品的缓存片段。" },
    { title: "组织选择菜单", detail: "Skill 与 AI 返回熟悉、相邻、新鲜候选；每项说明理由、取舍和推测，实时信息走搜索接力。" },
    { title: "纠正或准备增量", detail: "新的明示更新 current；准备补数据时，status 只读返回覆盖、缺口、材料、重叠起点和模式。实际 ingest 后另报完成/无变化/部分完成/失败、计数和失效推定，不把准备清单或接入成功写成新推荐已生成。" }
  ],
  components: [
    { name: "daily-preferences Skill", responsibility: "从自然偏好、纠正、推荐和增量请求进入正确流程。", implementation: "拥有推荐菜单、搜索接力、领域边界和用户选择权；不复制 SQLite 实现。" },
    { name: "Python CLI（命令行入口）", responsibility: "提供 init、ingest、status、evidence、facts、record、snapshot 与 original 八个动作。", implementation: "主要使用 Python 标准库；信用卡 PDF 文本读取依赖 pypdf。" },
    { name: "PowerShell wrapper（PowerShell 启动入口）", responsibility: "让自然路由和人工维护从项目根使用同一个 Windows 入口，而不要求用户寻找 Python。", implementation: "先使用 PATH 中的 python，再查 LocalAppData 下最新 Python*，最后查 bundled runtime（随工作区提供的运行时）；三处都不存在时明确抛出 Python runtime not found，不静默换执行器。" },
    { name: "SQLite / FTS5（本地数据库 / 全文索引）", responsibility: "保存来源实例、制品、导入、记录版本、明示、推定与证据关系。", implementation: "schema v1、WAL、外键、STRICT 表和 current 唯一索引；没有第二数据库或后台进程。" },
    { name: "CURRENT.md", responsibility: "让普通推荐快速读取 current 明示、有效推定和来源覆盖。", implementation: "SQLite 提交后，再通过临时文件与 os.replace 原子替换缓存；文件替换不和数据库构成同一事务，失败时数据库可能已更新而缓存仍旧。它可重建，不是原件或数据库备份。" },
    { name: "Profile parsers（来源解析器）", responsibility: "把 9 类已实现导出格式转成稳定记录。", implementation: "淘宝、淘宝闪购/饿了么、支付宝、微信支付、信用卡、滴滴网约车、ChatGPT、Gemini JSON 与 Gemini HTML；旁系 Didi 导出不冒充支持。" },
    { name: "窄索引清洗", responsibility: "让本地检索不需要保存某些无产品价值的联系方式和长标识，同时不牺牲普通偏好事实。", implementation: "scrub_sensitive 把邮箱和独立 7–19 位数字替换为占位；scrub_payment_method 再掩码括号内末四位。它只用于选定 parser 字段，不是全库、原件或公开页面的统一脱敏器。" },
    { name: "原件验真", responsibility: "防止缓存片段继续指向已经缺失或变字节的来源。", implementation: "先核 artifact SHA-256；ChatGPT 再核消息 content hash，PDF 重读失败明确返回不可读，其余类型标明缓存片段。" }
  ],
  usageExamples: [
    { ask: "我现在不太想吃辣，以后按这个推荐。", effect: "记录新的 current，旧同 key 表述进入历史，相关推定 stale。", moduleSlug: "current-corrections" },
    { ask: "准备投递增量，逐个来源告诉我现在到哪里。", effect: "不扫描、不导入，也不改业务数据或 SQLite 主文件；只读连接可能更新 -shm mtime。随后返回 11 个来源实例的覆盖、缺口、材料、重叠起点和模式。", moduleSlug: "source-coverage" },
    { ask: "今晚吃什么？吃和喝都看，不要只复述旧订单。", effect: "分别取吃喝相关明示、快照和行为事实，不读取整库私人正文。", moduleSlug: "evidence-query" },
    { ask: "为什么觉得我喜欢这个？先核对具体复购事实。", effect: "分开订单、支付旁证和本人表达，返回状态、时间与文本变体，不把一次购买升级成喜欢。", moduleSlug: "fact-verification" },
    { ask: "给我熟悉、相邻和没买过但可能适合的新东西。", effect: "Skill 与 AI 组织三类选择，标出推测、取舍与搜索接力，最终决定留给用户。", moduleSlug: "recommendation-choice" }
  ],
  evidenceLayers: [
    { layer: "PRIVATE 源码 main", proves: `当前 main ${sourceMainCommit} 包含 current acceptance（当前验收）；v0.6 行为 commit ${behaviorCommit} 拥有入口、数据关系、失败语义和 40 项回归。`, doesNotProve: "源码与验收文档存在不证明公开页已经部署，也不替代本轮数据库和自然请求现场回读。" },
    { layer: "40 项原生回归", proves: "覆盖导入幂等/回滚、Didi 错格式防误退、覆盖与缺口、乱序历史、中文旧记录召回、AI 表达过滤、快照证据和原件漂移。", doesNotProve: "合成夹具不能证明每个平台未来导出格式、每类偏好或每个推荐都正确。" },
    { layer: "当前 v0.6 数据迁移", proves: "10 个非人工来源迁移成功；54,283 个 current 键零漂移，1,749 条微信时间纠正，6 个推定按新证据重建，integrity_check=ok、外键 0。", doesNotProve: "一次迁移不是正式备份恢复产品，也不证明未来增量始终可取得。" },
    { layer: "当前来源与事实核对", proves: "11 个来源实例、75 份制品、1 个已知缺月和 5 类未取得来源被明确区分；具体苏打水事实链由订单状态、时间、变体与用户纠正共同形成。", doesNotProve: "订单成功不等于每次满意，付款旁证不等于再次购买。" },
    { layer: "当前三条实现盲自然请求", proves: "宿主回执把三条 evaluator 固定为 gpt-5.6-sol / max / child、fork_turns=none，三条均收到 terminal final；公开页不展示 task id 或原始私人输出。它们未获 Skill、命令、路径或内部路线提示，分别自主完成吃喝推荐、逐来源增量准备和苏打水事实核对：推荐交付熟悉/相邻/新鲜菜单与搜索接力；增量列出 11 个来源和 5 个未取得来源，不扫描、不导入、不改业务数据或 SQLite 主文件；事实核对把 51 条订单、44 成功、7 关闭、支付生命周期旁证和本人表达分开。", doesNotProve: "这三条请求不证明所有偏好域、未来平台导出、实时价格、门店可用性、严格的文件系统零写或每次 AI 判断都正确；SQLite 只读连接可能更新 -shm mtime，事实核对也只能证明长期成功复购支持高可能推定，不能升级为本人已经明确说喜欢。" },
    { layer: "公开页面", proves: "只展示产品判断、聚合状态、普通 L2 样例和技术证据，没有复制原始聊天、账号、财务组合、行程路线、locator 或秘密。", doesNotProve: "公开内容不是实时个人推荐结果，也不是来源数据库副本。" }
  ],
  operationalEntrypoints: [
    { name: "初始化最小状态", command: `${wrapperCommand} init --json`, purpose: "建立 schema v1、user.current 来源与可重建 CURRENT；不扫描、导入或猜测任何来源。" },
    { name: "查看来源状态", command: `${wrapperCommand} status --json`, purpose: "逐来源返回覆盖、快照、缺口、材料、建议起点、模式和最近导入健康；不改业务数据或 SQLite 主文件，只读连接可能更新 -shm mtime。" },
    { name: "自然问题取证", command: `${wrapperCommand} evidence --query <自然问题> --limit 24 --json`, purpose: "返回与问题相关的 current 明示、有效推定和行为证据；查询连接只读。" },
    { name: "核对具体事实", command: `${wrapperCommand} facts --term <品牌> --term <品类> --json`, purpose: "统计事实角色、状态、时间与文本变体，不自动宣布喜欢。" },
    { name: "记录用户明示", command: `${wrapperCommand} record --key <偏好键> --statement <用户原话> [--effective-at <日期>]`, purpose: "最新同 key 表述成为 current，回顾过去只进入历史。" },
    { name: "人工接入增量", command: `${wrapperCommand} ingest --profile <profile> --source-id <source> --path <path> --mode incremental`, purpose: "普通补包默认 incremental；full 必须显式选择且只有无 gap 时才退出缺失旧记录。" },
    { name: "保存推定", command: `${wrapperCommand} snapshot --key <偏好键> --value <推定> --evidence-record-id <current-id>`, purpose: "至少绑定一条 current 证据；同 key 已有 current 明示时拒绝推定。" },
    { name: "有界回看记录", command: `${wrapperCommand} original --record-id <id> --json`, purpose: "先核对原件制品，再区分真正重读、缓存片段、缺失、漂移或不可读。" }
  ],
  evolution: [
    { date: "2026-08-31—09-01", commit: `3860c61–${sourceMainCommit.slice(0, 7)}`, result: `建立本地人工增量偏好证据项目，并在 ${behaviorCommit.slice(0, 7)} 把错误 full 默认、Didi 误退、时间时区、覆盖缺口、回滚、中文召回、AI 表达、历史区间、快照证据和原件验真收敛到 v0.6；随后迁移 10 个来源、重建 6 个推定并在 current acceptance 原位保存聚合验收。` }
  ],
  snapshotUpdateNote: "本页只在 daily-preferences 项目或 Skill 正式发布并回读后产生实质产品变化时更新。普通偏好数据增量若不改变公开产品能力、边界、证据解释或用户决策，只更新本地状态，不制造网站任务或公开消费日记。"
};

const commonModuleShape = (definition) => ({ stateLabels, ...definition });

const dailyPreferencesModules = [
  commonModuleShape({
    slug: "current-corrections",
    shortTitle: "当前、历史与纠正",
    title: "最新明示先成为现在，旧偏好留下历史",
    searchAliases: ["我改主意了", "以后按这个推荐", "以前喜欢现在不喜欢", "current historical", "为什么推定过期", "最新表达优先"],
    searchProjection: {
      intents: ["记录当前偏好", "带日期回顾过去", "纠正旧推定", "解释快照失效"],
      entities: ["preference_key", "current", "historical", "stale", "source_revision"],
      relations: ["同key最新明示成为current", "旧表述成为historical", "用户明示让同领域推定stale", "current明示阻断同key推定"],
      failureRecovery: ["旧日期不覆盖现在", "同时间最后写入胜出", "数据库不可写时不冒充记录成功", "没有history命令时技术层保留缺口"]
    },
    teaser: "用户不需要学习命令或偏好键；一句自然纠正就应比几年前的订单和旧推定更重要。",
    status: "v0.6 已让每个精确偏好键形成相邻、不重叠的历史区间；16 条明示 current，6 个推定 current",
    statusTone: "pass",
    value: "让推荐连续记得过去，又允许用户随时改变主意，不被旧标签锁住。",
    why: "只追加记录而不分 current/history，会让矛盾表述同时生效；只覆盖旧值又无法解释偏好何时变化。",
    example: "先说“以前喜欢重辣”，后来明确“现在只想吃微辣”。较新的表述成为 current；旧表述有结束时间并保留历史，相关 food 推定退出 current。",
    result: "得到一条明确时间线：现在生效什么、过去曾经是什么、哪条推定因用户纠正或来源变化失效。",
    readerStates: {
      pass: "新表述成为当前时返回 recorded，按生效时间重建同 key 时间线并使同领域推定 stale；较早表述返回 recorded_historical。两者都表示记录结果，不表示已经生成下一份推荐。",
      problem: "带日期的表述早于 current 时只进入历史；同一自然范围若用了不同 key，当前实现不会自动语义合并。",
      unavailable: "数据库提交前失败时不能声称已记录；CURRENT 缓存刷新失败却可能发生在提交之后，此时明示与失效状态已经保存、缓存可能仍旧。先核对数据库，不把错误理解成未写入后再次 record；当前没有分层回执或撤回/历史查询命令。"
    },
    stateLabels: ["已记录", "分清当前与历史", "记录或缓存不可用"],
    decisionImpact: [
      "同一个 preference_key 只有一个 current；历史按 effective_from 排序，相邻区间不重叠。",
      "回顾过去只改变历史，不覆盖现在。",
      "当前同 key 明示存在时，snapshot 返回 blocked_by_current_statement。",
      "用户明示使同领域推定 stale，而不是修改来源事实。",
      "当前实现按精确 key 判断同范围；key 命名本身仍由 Skill/AI 正确选择。",
      "历史保存在数据库中，尚无 history、withdraw 或 undo 产品命令。"
    ],
    problem: "解决旧偏好压过当前表达、矛盾记录同时生效、回顾过去误改现在和推定不随纠正失效。",
    implementation: [
      "preference_statements 保存 key、原话、上下文、effective_from/effective_to、current/historical 与 supersedes。",
      "每次 record 后按时间和 statement_id 重建同 key 全部相邻区间，最后一条成为 current。",
      "新 current 明示使相同 key 或相同领域前缀的 current snapshot stale。",
      "user.current 来源覆盖随明示的最早/最晚生效时间更新。",
      "CURRENT.md 投影 current 明示、有效推定与来源覆盖，不复制完整历史；record_statement 先 connection.commit，再调用 write_current，两步不是同一事务。"
    ],
    flow: ["用户自然表达或带日期回顾", "Skill 选择稳定 preference_key", "record 写入表述", "按时间重建同 key 时间线", "判断是否成为 current", "必要时让同领域推定 stale", "提交 SQLite", "单独原子替换 CURRENT 缓存", "返回 recorded 或 recorded_historical"],
    concepts: [
      { term: "preference_key（偏好键）", explanation: "让同一具体偏好在多次表达中保持稳定身份；它不是人格标签。" },
      { term: "effective time（生效时间）", explanation: "这句话描述何时开始成立；回顾过去可以显式给日期。" },
      { term: "stale（已失效）", explanation: "推定所依赖的来源修订或用户表达已经变化，不能继续作为 current。" }
    ],
    boundaries: ["不从订单自动写入用户明示。", "不同 key 的语义冲突不自动合并。", "不删除历史原话。", "没有撤回和历史浏览入口。", "CURRENT 是快照，不是完整时间线。"],
    failures: [
      { condition: "生效时间无法解析", response: "返回 invalid effective time，不写入。" },
      { condition: "旧日期晚录入", response: "记录为 historical，结束于下一条表述的起点，不覆盖 current。" },
      { condition: "同 key 已有 current 明示却请求推定", response: "返回 blocked_by_current_statement，不插入 snapshot。" },
      { condition: "数据库提交后的缓存刷新失败", response: "明示可能已保存、相关推定可能已 stale，而 CURRENT 仍旧；先只读核对原记录和数据库状态，再处理缓存，不盲目重复 record。当前没有明确 db_committed/cache_stale 回执。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现 record、时间线重建、同领域快照失效与 CURRENT 刷新。" },
      { path: "schema.sql", role: "定义明示和快照的 current 唯一约束、历史状态与证据关系。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖最新表述、回溯日期、乱序时间线、同 key 明示阻断推定和同领域失效。" }
    ],
    verification: ["乱序写入 2026、2024、2025 三条表述，最终形成 2024→2025→2026 的相邻时间线。", "验证回溯日期不覆盖 current。", "验证 food 新明示只让 food 推定 stale，shopping 保持 current。", "验证同 key current 明示使推定不新增任何业务表记录。"],
    relation: "它是产品的人类权威入口：来源与证据可以支持推定，但不能压过这里的 current 明示。"
  }),
  commonModuleShape({
    slug: "source-coverage",
    shortTitle: "来源与人工增量",
    title: "按来源实例手动增量，先把覆盖和缺口说清",
    searchAliases: ["准备投递增量", "每个来源到哪天", "ChatGPT两个账号", "Gemini快照", "full incremental 区别", "缺哪个月", "订单导入", "来源覆盖"],
    searchProjection: {
      intents: ["查看来源覆盖", "准备人工增量", "选择full或incremental", "分开账号和快照"],
      entities: ["source instance", "profile", "artifact", "import run", "coverage", "gap"],
      relations: ["source instance绑定provider和account alias", "artifact由SHA-256识别", "import run记录mode和health", "coverage与gap共同决定快照修订"],
      failureRecovery: ["错误扩展名在建库前拒绝", "partial不退出旧current", "incremental不缩覆盖", "完整快照可回到旧artifact"]
    },
    teaser: "用户说准备补数据以后，系统先做不扫描、不导入、不改业务数据的状态答复；不同账号、不同快照和不同缺口从不合并成一句‘已经全了’。",
    status: "11 个来源实例；9 个来源已取得核对、2 个只有快照；10 个非人工来源已迁移到 v0.6，最近导入没有失败",
    statusTone: "mixed",
    value: "知道每个来源真实到哪里、缺什么、该准备什么和怎样补，不靠模糊的‘最近同步过’做决定。",
    why: "把不同账号或补包混在一起，会让覆盖日期、缺口和去重身份失真；默认 full 更可能把未随补包提供的旧记录误判为消失。",
    example: "用户说准备投递增量。status 分别列 ChatGPT 两个账号、Gemini 两个快照、订单、支付、信用卡与滴滴，并给每个实例的材料、截止、缺口、重叠起点和模式；现在不扫描或写入。",
    result: "准备阶段得到逐来源的清单和缺口，不发生接入；用户提供材料后才 ingest。实际接入回执列 completed/no_change/partial/failed、文件与记录计数、gaps、退出旧记录和失效推定数量。普通补包默认 incremental，完整权威快照才显式 full；失效旧推定不等于已生成新推定或推荐。",
    readerStates: {
      pass: "完成本轮接入返回 completed；复用同版本制品且符合无变化条件时返回 no_change。两者都要看 counts、gaps 和 invalidated_snapshots；no_change 仍可记录导入与刷新缓存，不等于零写入，也不表示推荐菜单已经更新。",
      problem: "有解析缺口且取得部分记录时返回 partial，没有取得记录则为 failed；回执保留已处理计数和具体 gaps。部分有效记录仍可能入库并使旧推定失效，只是不因不完整 full 把本次缺失的旧 current 退出。",
      unavailable: "格式、来源身份、原件或依赖不成立时在相应阶段停止，不换来源或扫描其他目录。数据库已提交、随后 CURRENT 刷新失败时，接入状态可能已经保存，须先核对而非重导；不能一律说旧状态完全没变。"
    },
    stateLabels: ["完成或无新记录", "部分完成或失败", "入口或缓存不可用"],
    decisionImpact: [
      "当前 11 个来源实例：9 acquired_verified、2 snapshot_only；另有 5 类逻辑来源尚未取得。",
      "5 类来源分别是 bank_transactions、jd_orders、pinduoduo_orders、meituan_orders 与 cainiao_logistics；页面直接给出名字，不把‘5 类’留成谜语。",
      "普通补包默认 incremental；full 必须显式选择，且有 gap 时不会退出缺失旧 current。",
      "每个 source_id 绑定 logical source、provider 与账号别名，不能换绑。",
      "同制品同版本立即重复为 no_change；A→B→A 会恢复旧权威快照，而不是永久丢失历史版本。",
      "增量覆盖做 union（并集），无关成功补包不会清掉不可重算 gap；信用卡缺月按 current 月份重新计算，可在补齐后消失。",
      "Didi 目录只选网约车订单 TXT，旁系公交、货运、代驾和个人资料不进入 ride source。",
      "精确输入合同为：淘宝 .xlsx/.blob，淘宝闪购 .xlsx，支付宝 .csv，微信支付 .xlsx，信用卡 .pdf，Didi .txt，ChatGPT/Gemini .zip/.blob；显式文件扩展名不匹配时整体拒绝。",
      "文本按 UTF-8-sig、UTF-16、GB18030 顺序读取；Excel serial 按中国本地时间解释，文件名中的 YYYYMMDD-YYYYMMDD 或 YYYY年M月只在解析成功后补业务覆盖。",
      "最近导入健康与来源已取得状态分开，failed/partial 不会被 acquired_verified 文案掩盖。",
      "接入返回的 counts 含 records、new、updated、duplicate、artifacts 与 artifact_duplicates，另有 exact_links、retired_invalid_records、retired_missing_records 和 invalidated_snapshots；这些数字说明处理和失效，不说明推荐质量。"
    ],
    problem: "解决账号混并、覆盖缩短、缺口被无关补包清除、错误 full 误退 current、同制品回滚失败和 unsupported 格式静默成功。",
    implementation: [
      "9 个 profile 处理淘宝、淘宝闪购/饿了么、支付宝、微信支付、信用卡、Didi 网约车、ChatGPT、Gemini JSON 和 Gemini HTML。",
      "PROFILE_EXTENSIONS 明确允许的扩展名与 .blob 容器；read_text 只走 UTF-8-sig→UTF-16→GB18030，最后才以 replacement fallback（替换字符回退）保留可读片段。",
      "parse_time_us 把 Excel serial 当作 +08:00 本地时间，不再先按 UTC 后多加 8 小时；declared_range_from_name 识别紧凑日期范围和中文月份。",
      "artifacts 保存 SHA-256/bytes/MIME；occurrences 保存出现位置；import_runs 保存 parser version、mode、health、计数和 gap。",
      "records 按 source/type/native/hash 保留版本，partial/full/no_change 的 current 退出语义分开。",
      "collect_paths 对显式错误扩展名整体失败；目录只筛支持类型，Didi 再筛当前真实网约车订单导出。",
      "coverage 只接纳成功解析文件的声明范围；incremental 保留旧覆盖和未解决 gap。",
      "status 返回每个来源的覆盖起止、快照时间、gap、材料、推荐 mode、重叠建议和 latest_import。",
      "ingest 外层结果有 completed/no_change/partial/failed 四态；单文件 import_runs 另用 success/no_change/partial/failed，不应把来源 acquired_verified、单文件 success 与整次 completed 混写。",
      "接入完成覆盖重算、关联重建和失效推定标记后先提交数据库，再写 CURRENT.md；write_current 失败不会撤销已提交记录，当前也没有自动生成替代推定或推荐。"
      ,"特定支付方式先用 scrub_payment_method 掩码邮箱、独立 7–19 位数字和括号内末四位；信用卡正文与 Didi 搜索文本使用 scrub_sensitive。普通商品和偏好语义不因此泛化。"
    ],
    flow: ["用户先说准备增量", "status 只读列来源实例，不改业务数据或 SQLite 主文件", "用户提供精确材料", "按 profile 与 source_id 校验", "计算 artifact SHA-256 并解析", "保存 import 与记录版本", "更新 coverage/gap并使受影响推定stale", "提交SQLite后单独刷新CURRENT", "返回接入四态、计数、缺口与失效推定数量"],
    concepts: [
      { term: "source instance（来源实例）", explanation: "一个明确平台/账号/快照的独立来源身份；两个账号永远分别列。" },
      { term: "incremental（增量）", explanation: "普通带重叠补包；只增加或更新看见的记录，不把本次没带来的旧记录退出。" },
      { term: "full（完整快照）", explanation: "已确认是该来源实例完整权威截面时显式使用；有任何解析 gap 就失败关闭。" },
      { term: "gap（缺口）", explanation: "已知材料、月份、解析或覆盖问题；它与来源已取得状态分开。" }
      ,{ term: "profile input contract（来源输入合同）", explanation: "每个 profile 接受的扩展名、容器、文本编码和时间解释；不匹配时失败，不靠猜格式继续。" }
    ],
    boundaries: ["不后台同步。", "普通推荐不导入。", "未取得来源只列缺口，不预建解析器。", "窄索引清洗不是全局匿名化，也不修改或覆盖原件。", "Gemini snapshot 不声称连续增量。", "权威空 full 尚无独立平台语义，当前失败关闭。"],
    failures: [
      { condition: "显式文件扩展名不属于 profile", response: "在数据库连接和任何写入前整体拒绝；合法文件与错误文件混合也不部分执行。" },
      { condition: "解析有缺口", response: "取得部分记录时整次为 partial，没有取得记录时为 failed；保存已处理计数和精确 gap，不回滚已经接纳的有效记录，full 不因缺失项退出旧 current。" },
      { condition: "source_id 换 provider 或 logical source", response: "返回 source identity conflict，保留原身份。" },
      { condition: "同一旧 artifact 重新成为权威", response: "若旧观察已不是 current 就重新解析并激活对应历史版本；连续 no_change 不清空 seen keys。" },
      { condition: "数据库提交后 CURRENT 缓存写入失败", response: "记录、覆盖和失效推定可能已经更新；先只读核对该来源本次 import 与数据库，不将异常当成未导入后盲目重试。当前缺少区分已提交/缓存失败的正式回执。" }
      ,{ condition: "Python 三条发现路线均不存在", response: "PowerShell wrapper 明确抛出 Python runtime not found；不伪装成 status、evidence 或 ingest 成功。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现 profile、collect_paths、ingest、coverage、status 与回滚。" },
      { path: "daily-preferences.ps1", role: "实现 PATH→LocalAppData→bundled runtime 的稳定 Windows 入口和明确失败。" },
      { path: "schema.sql", role: "定义来源、制品、导入、记录、观察与 current 约束。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖默认增量、格式整体拒绝、Didi 防误退、coverage/gap、三连幂等与 A→B→A。" }
    ],
    verification: ["在数据库副本重读全部 10 个非人工来源，current 54,283→54,283、missing/extra 0。", "验证 10 个来源 parser version 均为 v0.6，最近导入无 failed/partial。", "连续三次 full 同 artifact 保持 2 个 current；A→B→A 恢复 A。", "用坏文件名声明大日期范围，确认 failed 不扩大 coverage；补正常 incremental 后旧 gap 仍保留。", "补齐信用卡缺月后确认可重算 gap 消失。"],
    relation: "它向证据查询提供来源身份、current 记录和缺口；只有来源修订真实变化，相关推定才失效。"
  }),
  commonModuleShape({
    slug: "evidence-query",
    shortTitle: "自然问题与最小证据",
    title: "用一句自然问题，只取会改变这次选择的证据",
    searchAliases: ["我喜欢喝什么的证据", "根据我的偏好怎样取证", "薄快照过期", "最小证据", "为什么订单比聊天靠前", "自然问题怎么搜索"],
    searchProjection: {
      intents: ["按自然问题查偏好证据", "分开吃和喝", "过滤无关AI对话", "召回较老中文记录"],
      entities: ["query", "domain", "axis", "current statements", "current snapshots", "evidence role"],
      relations: ["query识别domain和axis", "domain选择logical sources", "source weight与term match排序", "current context按domain过滤"],
      failureRecovery: ["快照缺失继续证据查询", "无匹配保留Unknown", "扩展域只用明示/通用证据", "只读连接不修改数据库"]
    },
    teaser: "普通推荐不需要把 61,388 条记录塞进上下文；先用 current 快照，再只取与这次问题有关的明示、推定和行为事实。",
    status: "真实 54,283 个 current 记录上观察约 1.2–1.5 秒（不是 SLO）；中文不再截断最近 1,000 条，AI 对话只保留本人现实偏好候选",
    statusTone: "pass",
    value: "让 AI 看见足够的连续性，而不是被整库订单、付款和聊天淹没。",
    why: "只看 top hits 会漏掉吃/喝、复购/新类别等不同轴；无条件返回全部 current 语句又会把技术取舍、增量说明和购物偏好塞进晚餐问题。",
    example: "“今晚吃什么”识别 food 域，返回 food 与真正跨请求的 current 上下文、有效 food 推定和订单事实；shopping/payment 特定 current 不进入本轮。",
    result: "得到有范围的 evidence JSON：查询词、相关明示、有效推定、带角色的候选、时间、重复次数和 locator；AI 再判断事实与推测。",
    readerStates: {
      pass: "识别到专门域时按域选来源和 current 上下文，相关旧中文具体记录仍可召回；数据库字节不变。",
      problem: "扩展域没有专门 parser/权重时只用用户明示与 AI 对话候选，明确不声称同等覆盖。",
      unavailable: "数据库不存在或不可读时返回精确失败；Skill 可依据本轮明示临时回答，但不伪造历史偏好。"
    },
    stateLabels: ["已取得相关证据", "覆盖仍有边界", "证据入口不可用"],
    decisionImpact: [
      "food、shopping、payment、ride 有专门词、来源与权重；beverage 另有吃喝分轴。",
      "travel、stay、entertainment、digital、service、tool、aesthetic 已能识别并用明示/通用证据，但没有同等专门 parser。",
      "current statements/snapshots 按查询域过滤；无域问题才保留全量 current 上下文。",
      "ai_assistant_locator 与 Gemini mixed_activity 不参与 evidence。",
      "AI 用户消息只有通过本人现实偏好候选规则才标 user_expression；假设、替他人和普通疑问过滤。",
      "中文查询扫描完整相关来源，>1,000 条之后的旧精确命中不会消失；当前实测仍低于 2 秒。",
      "真实订单权重高于长 AI 文本，每类来源仍有结果上限。"
    ],
    problem: "解决上下文膨胀、无关 current 污染、中文旧记录漏召回、AI 疑问误标表达和宽泛 top hits 冒充完整偏好。",
    implementation: [
      "query_terms 从自然问题抽取中文片段/ASCII 词并补专门域词；扩展域没有词表时安全返回空补充而不崩溃。",
      "query_domains 识别 11 个当前域；relevant_logical_sources 只选择需要的来源类型。",
      "SQLite read-only URI 与 query_only 保证业务表和主文件不被查询修改；busy_timeout 只等待现有锁。只读连接仍可能更新 -shm mtime，因此不宣称严格文件系统零写。",
      "记录按 term match、source weight、recency、状态和饮料轴加权；结果按来源限额与事实文本去重。",
      "当前仍保留 FTS5 表，但中文精确召回不依赖最近 1,000 条或向量库。"
    ],
    flow: ["读取 CURRENT 快路径", "识别自然问题的域和轴", "选择相关来源", "读取 current 明示/有效推定", "扫描并排序相关记录", "过滤无关AI内容和模板", "返回少量证据给 Skill/AI"],
    concepts: [
      { term: "domain（领域）", explanation: "本次问题属于吃喝、购物、支付、出行或扩展偏好的哪一类，用来缩小来源与 current 上下文。" },
      { term: "axis（选择轴）", explanation: "同一开放问题里会改变答案的独立方向，例如美食中的吃与喝。" },
      { term: "query-scoped context（按问题限定的上下文）", explanation: "只返回与当前域有关的明示和推定，再保留少量真正跨领域的交互原则。" }
    ],
    boundaries: ["不是向量检索或通用语义模型。", "命中顺序不自动等于喜欢强度。", "扩展域覆盖不与四个专门域等同。", "Gemini 当前不参与推荐证据。", "没有命中保持 Unknown，不造人格标签。"],
    failures: [
      { condition: "扩展域没有 DOMAIN_TERMS", response: "使用空补充词而不是 KeyError；仍返回该域明示/通用证据。" },
      { condition: "AI 消息是疑问、假设或替他人询问", response: "不标 user_expression，也不进入当前候选。" },
      { condition: "相关中文记录早于最近 1,000 条", response: "完整扫描相关来源并按命中排序；不以截断冒充无证据。" },
      { condition: "数据库不可读", response: "只报告入口不可用，不修改数据库或改走中央画像。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现 query terms/domains/axis、只读检索、上下文过滤、排序和证据输出。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖真实订单优先、ASCII、中文 >1000、扩展域与 AI 本人表达过滤。" },
      { path: "SKILL.md", role: "拥有开放题补轴、最小证据和最终推荐解释。" }
    ],
    verification: ["构造 1,001 条较新占位与第 1,002 条旧中文目标，确认旧目标仍返回。", "购物查询同时放本人明确表达与替朋友疑问，只保留前者为 user_expression。", "7 个扩展域自然问题逐一运行 evidence，不崩溃并保持域标识。", "真实库多域查询观察约 1.2–1.5 秒，current 记录与数据库主文件 bytes 在只读前后保持一致；该观察不是 SLO。"],
    relation: "它消费来源模块的 current 事实，并把最小证据交给具体事实核对或推荐菜单；本模块不生成最终建议。"
  }),
  commonModuleShape({
    slug: "fact-verification",
    shortTitle: "具体事实与原件",
    title: "把买过、付过和真正喜欢分开，再核对具体事实",
    searchAliases: ["买过就是喜欢吗", "付款会不会重复计算", "为什么说我喜欢这个", "复购次数", "成功关闭订单", "农夫山泉苏打水不是矿泉水", "模板赠品会不会算偏好"],
    searchProjection: {
      intents: ["核对具体商品事实", "区分订单与付款", "统计成功关闭和变体", "有界回看原件"],
      entities: ["facts", "order_observation", "payment_observation", "user_expression", "artifact SHA-256", "locator"],
      relations: ["具体term聚合记录组", "订单repeat_count来自订单", "支付只作旁证", "original先验artifact再返回内容"],
      failureRecovery: ["模板赠品过滤", "原件missing或changed不返旧片段", "ChatGPT核content hash", "非重读类型标缓存片段"]
    },
    teaser: "项目敢于推测，但不允许把一次购买、一次付款或一句疑问直接写成长期喜欢；具体结论先回到具体商品和记录状态。",
    status: "facts 可核对 51 条农夫山泉苏打水观察、44 条正向状态、7 条关闭、2023-07—2026-07 与 10 种文本/规格变体",
    statusTone: "pass",
    value: "给‘为什么适合我’一个能复核的事实基础，同时保留订单状态不等于满意的边界。",
    why: "商品标题含营销词、赠品和未选口味，支付账单又可能重复同一订单。只看次数会把模板、关闭订单和付款旁证都误算成喜欢。",
    example: "“农夫山泉苏打天然水/苏打水”按品牌+品类核到 51 条淘宝订单观察，其中 44 条为正向交易状态、7 条关闭，覆盖三年并有 10 种规格变体；再结合用户明确纠正，才形成强推定。",
    result: "得到分证据角色的事实组：匹配、正向/负向、首末时间、文本变体和代表记录；仍然明确哪些事实不能证明满意。",
    readerStates: {
      pass: "具体词命中详细订单与用户现实表达时，返回事实组和时间/状态/变体，必要时在原件 SHA 一致后有界回看。",
      problem: "只有付款、关闭订单、模板、赠品或疑问时保持旁证/负向/无结论，不升级喜欢。",
      unavailable: "原件缺失、字节变化、内容定位变化或不可读时返回明确状态，text 为空；不继续输出旧缓存冒充原文。"
    },
    stateLabels: ["已核对事实", "证据不能升级", "原件核对不可用"],
    decisionImpact: [
      "order_observation 只证明买过/点过；repeat_count 只来自详细订单的相同事实文本。",
      "payment_observation 只补支付渠道与消费链，不进入订单重复次数。",
      "user_expression 只有本人现实表达候选才成立，AI 仍做最终语义判断。",
      "淘宝营销前缀、饿了么商家模板、赠品和未选‘三选一’过滤。",
      "facts 按品牌与品类词要求 all-term match，并分正向/负向状态、首末时间和变体。",
      "公开真实 L2 样例保留具体苏打水语义，不公开商家、金额、账号、路径或原始聊天。",
      "original 先核制品 SHA；ChatGPT 再核消息 content hash，PDF 重新抽取后做窄掩码，其他类型标 verified_artifact_cached_excerpt。"
    ],
    problem: "解决买过=喜欢、付款=第二次购买、关闭=成功、商品标题泛化、模板/赠品混入和原件漂移后继续输出旧片段。",
    implementation: [
      "preference_fact_text 清理淘宝营销前缀，并从饿了么商品串中筛掉非偏好模板。",
      "facts 扫描 current 记录，按 evidence role/source 分组，统计匹配、正向、负向、时间和文本变体。",
      "record_links 只在不同来源 correlation_key 完全一致且长度足够时建立 same_consumption_chain。",
      "original 从 records 定位 artifact，先核存在和 SHA-256；ChatGPT 再定位 conversation/node 并核 content SHA。",
      "PDF 重读异常返回 original_unreadable；XLSX/CSV/TXT/Gemini 返回已验真制品的缓存片段。"
    ],
    flow: ["先用 evidence 找候选", "确定品牌/品类词", "facts 全量核对具体记录", "分订单/付款/表达角色", "统计状态/时间/变体", "只有细节改变结论时调用 original", "向 AI 返回事实和不能证明项"],
    concepts: [
      { term: "order observation（订单观察）", explanation: "平台记录显示买过或点过；不自动表示喜欢、满意或本人使用。" },
      { term: "payment observation（支付旁证）", explanation: "说明支付链或渠道发生过；已有详细订单时不能再当一笔购买。" },
      { term: "artifact verification（制品验真）", explanation: "重新计算原文件 SHA-256，先证明 locator 仍指向导入时同一字节。" }
    ],
    boundaries: ["正向交易状态不等于满意。", "payment link 当前不自动压制候选，只由 Skill/AI解释旁证。", "variant_count 当前是返回变体数，超过 limit 的总数命名待改。", "不公开 locator、原始对话或财务组合。", "不为一次事实核对扫描新目录。"],
    failures: [
      { condition: "商家模板、赠品或未选项混入", response: "从 preference_fact_text 过滤；没有可用商品时不造事实。" },
      { condition: "原件文件不存在", response: "返回 original_missing、text=null，不输出缓存。" },
      { condition: "原件 SHA-256 变化", response: "返回 artifact_changed、text=null；要求重新 ingest。" },
      { condition: "ChatGPT 消息定位或 content hash 变化", response: "返回 record_content_changed，不冒充同一原话。" }
    ],
    sources: [
      { path: "daily_preferences.py", role: "实现事实清理、facts 分组、证据角色、精确链接和 original 验真。" },
      { path: "tests/test_daily_preferences.py", role: "覆盖具体苏打水语义、模板/赠品、订单/支付角色和原件 missing/changed/valid。" },
      { path: "CURRENT.md", role: "提供当前推定中的公开普通事实摘要；原始正文不进入网页。" }
    ],
    verification: ["真实 facts 返回 51/44/7、三年范围与 10 个当前返回变体。", "合成淘宝记录验证活动价前缀、量勺和 QQ 糖不会混入苏打水事实。", "合成饿了么记录验证模板和三选一过滤。", "修改/删除已导入 XLSX，original 分别返回 artifact_changed/original_missing 且 text=null。", "有效 ChatGPT ZIP 重新打开并核消息 content hash。"],
    relation: "它把证据查询的候选变成可核对事实；推荐模块只能在这个事实边界内解释，不得升级证明力。"
  }),
  commonModuleShape({
    slug: "recommendation-choice",
    shortTitle: "推荐菜单与选择权",
    title: "把历史变成排序和探索，不变成白名单或唯一答案",
    searchAliases: ["今晚吃什么", "给我熟悉和新鲜的选择", "不要只复述订单", "购物推荐", "旅行住宿推荐", "数字消费与服务工具", "审美偏好", "去哪里搜什么词", "没有比价API还能推荐吗"],
    searchProjection: {
      intents: ["生成开放式推荐菜单", "保留新鲜探索", "给平台搜索接力", "用户保留最终决定"],
      entities: ["熟悉稳妥", "相邻探索", "合理新鲜", "search handoff", "Skill", "AI"],
      relations: ["历史只排序候选", "相邻项连接已知偏好轴", "新鲜项标推测", "实时信息交给平台搜索"],
      failureRecovery: ["证据不足标Unknown", "无实时API仍给搜索词", "用户未要求单选不替决定", "项目入口不可用只用本轮明示"]
    },
    teaser: "真正的个性化不是把旧订单再念一遍：熟悉选择提供稳妥，相邻选择扩展边界，新鲜选择保留好奇心，用户自己决定。",
    status: "三类菜单、搜索接力和选择权由 daily-preferences Skill 与当前 AI 拥有；Python 项目提供事实，不内置推荐模型、比价 API 或下单执行器",
    statusTone: "mixed",
    value: "推荐既有连续性，也不会越用越窄；信息不足时仍交付可执行的搜索下一步。",
    why: "只从历史挑同款会把数据变成白名单；只给一个综合最优又把用户的场景、好奇心和最终选择权藏在模型里。",
    example: "购物问题不只列复购品：同时给熟悉补给、基于少维护/可立即使用轴的相邻新品，以及没买过但有合理邻接的新类别；每项说明理由、取舍和搜索词。",
    result: "得到一份可以比较的菜单，而不是一句命令：具体内容、熟悉/相邻/推测身份、为什么适合、关键取舍、必要的粗略价格/场景和搜索接力。",
    readerStates: {
      pass: "明示与证据足够时，Skill/AI 生成至少 3 个熟悉、3 个相邻、3 个合理新鲜候选；仍有显著路线时继续列。",
      problem: "证据矛盾、过期或扩展域覆盖较弱时标注依据、推测和 Unknown，不用同款变体凑数。来源接入成功或旧推定被标 stale 都不等于菜单已重新生成；只使用仍有效的明示和证据继续判断。",
      unavailable: "项目或平台实时信息不可用时，依据本轮表达给临时候选和搜索词；不声称最低价、库存或下单成功。"
    },
    decisionImpact: [
      "3+3+3 是 Skill/AI 回答结构，不是 Python 代码自动生成的 UI 或算法。",
      "熟悉稳妥来自高把握明示/行为；相邻探索说明与哪些偏好轴相邻；新鲜项允许未出现在来源中但必须标推测。",
      "每个候选比只报名词细一档：具体内容、理由、取舍，以及必要价格、场景或关键词。",
      "没有京东、淘宝、拼多多稳定比价 API 不等于无法建议；最终实时价格与跨平台比较由用户查看。",
      "餐厅优先给候选，再按需求推荐大众点评、淘宝闪购/饿了么或美团中的少量平台。",
      "除非用户明确说只给一个或直接替我选，否则不替用户下单、付款或决定唯一套餐。",
      "旅行住宿等扩展域可以基于明示和通用证据推荐，但当前不冒充专门来源解析与同等验收。"
    ],
    problem: "解决推荐只复述历史、同款变体凑数量、模型替用户单选、没有实时 API 就停工和平台无差别罗列。",
    implementation: [
      "Skill 先读 current 快照，按会改变选择的轴调用 evidence/facts，必要时有界 original。",
      "AI 将来源事实、current 明示、推定和 Unknown 分层，再生成三类候选。",
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
    boundaries: ["不冒充 Python 推荐算法。", "不承诺实时最低价。", "不替用户下单付款。", "不把历史变成白名单。", "不为扩展域虚构专门来源能力。", "用户未要求单选时保留选择权。"],
    failures: [
      { condition: "没有实时平台 API", response: "仍可根据偏好给候选、估计与经验判断，再交付 1–2 个平台和搜索词。" },
      { condition: "证据只能证明买过", response: "候选理由写成行为相邻或待探索，不写成已确认喜欢。" },
      { condition: "没有合理新鲜项", response: "继续寻找不同偏好轴或明确本轮证据不足；不能用同款口味变体凑数。" },
      { condition: "用户要求只给一个", response: "在现有候选和取舍上做单选，并说明决定依据；仍不执行购买。" }
    ],
    sources: [
      { path: "daily-preferences/SKILL.md", role: "定义三类菜单、搜索接力、用户选择权、平台边界和扩展领域。" },
      { path: "daily_preferences.py", role: "提供 current、evidence、facts、status、snapshot 与 original 事实接口。" },
      { path: "AGENTS.md", role: "定义历史只排序、不替用户决定和无中央画像边界。" }
    ],
    verification: ["实现盲自然请求必须在没有点名 Skill/命令/路径时自行选路，并交付三类菜单而非唯一答案。", "核对每个新鲜项都有邻接依据和推测标签。", "核对搜索接力只给相关平台与可复制词，不冒充最低价。", "核对输出没有写入偏好、扫描来源、下单或付款。"],
    relation: "它消费前四个模块的 current、来源、证据和具体事实；输出仍是 AI 协助的选择菜单，用户决定后才可能回到 current-corrections。"
  })
];

export const project = dailyPreferencesProject;
export const modules = dailyPreferencesModules;
export { dailyPreferencesProject, dailyPreferencesModules };
