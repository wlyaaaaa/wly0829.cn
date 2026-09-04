import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可直接使用", "需要确认", "当前不可用"];

const wechatDirectSnapshot = createProjectSnapshot({
  observedAt: "2026-09-01T04:24:24.7471576Z",
  label: "3 个完成态具名归档共保存 6032 条消息，3/3 独立验真通过；PUBLIC main、无正文 Doctor 与回归也已核对",
  metrics: [
    { label: "完成态归档", value: "3 个" },
    { label: "已保存消息", value: "6032 条" },
    { label: "语音 / 派生", value: "3 + 3 个文件" },
    { label: "独立验真", value: "3 / 3" }
  ],
  facts: [
    { label: "当前现实归档", value: "当前已有 3 个完成态具名联系人归档，manifest 合计 6032 条消息、3 个原始语音文件和 3 个派生文件；3/3 verify-export 成功。三份归档都保留明确 gap，最新 manifest 时间为 2026-08-25T22:23:16.8259403Z；这些聚合不读取聊天正文或联系人身份。" },
    { label: "当前公开版本", value: "WeChatDirect v0.1.0；PUBLIC main=488353629098f24535784c1663159d7570ae96f1，工作树与远端 main 同步且干净。", hero: false },
    { label: "当前环境体检", value: "Windows + Python 3.14 的无正文 Doctor 成功；两个账号槽位、两个来源配置文件、两个本地状态文件、加密依赖、压缩依赖与语音解码器均报告可用。" },
    { label: "聊天读取边界", value: "一次只解析一个明确联系人或群的有界窗口；最多扫描 500 条、返回 80 条，保留消息方向、群成员标签、回复目标、媒体关系、实际时间范围与可见历史缺口。" },
    { label: "具名自动增量", value: "sync-contact 首次保存该对象当前设备可见的完整本地历史；之后同一命令用来源指纹、增量游标和默认 1 天重叠窗口合并变化，不建立全账号同步或后台任务。" },
    { label: "回复与媒体", value: "图片、视频、文件、表情和语音都保留与原消息的资源关系；当前真正可打开和复制的精确字节路径主要是 VoiceInfo 语音，其他媒体明确标为不可打开或尚未处理。" },
    { label: "输出与验真", value: "联系人和朋友圈导出都包含 ai-context.md、context.md、JSONL 记录、manifest.json、state.json 与 last-run.json；只有联系人导出另写当前可打开的 VoiceInfo 语音，朋友圈只保留媒体关系与缺口。verify-export 独立重算哈希、数量、账号绑定和派生关系。" },
    { label: "实现规模", value: "当前仓库有 13 个跟踪文件、3 个产品 Python 模块、3 个测试模块和 8 个公开命令；主 CLI 使用 Python 3.14，语音派生路径默认使用 Python 3.11 + pilk。", hero: false },
    { label: "注意力边界", value: "日常默认只给 AI 最近最多 80 条、128 KiB 的 ai-context.md；更早事实只搜索 context.md 或 messages.jsonl 的命中附近，不把整份档案反复塞入模型。", hero: false },
    { label: "运行形态", value: "项目直接读取本机数据库快照，不依赖 WeFlow、HTTP helper、第二数据库、服务、队列、daemon、watcher 或计划任务。", hero: false }
  ],
  gaps: [
    "本次网页快照没有读取任何真实微信聊天、朋友圈正文或媒体，也没有运行一个具名联系人的现场 E2E；源码、Doctor 和合成回归不能证明当前某段真实历史完整可读。",
    "当前设备可见的本地数据库和朋友圈缓存不是微信远端全历史；旧消息、已清缓存媒体或未缓存朋友圈目标可能真实存在但本轮不可见。",
    "图片、视频、文件和表情目前可以保留消息资源关系与缺口，但没有通用本地字节打开实现；不能把这些关系写成附件已经导出。WeChatDirect 只把精确微信语音派生为 WAV，转写另交 ChineseASR。",
    "完成态档案可以用同一命令重放，来源漂移也会保留上一个完整提交点；但首次同步硬崩溃留下的无 state 半成品、陈旧 .sync.lock 和目录级自动修复尚未实现，verify-export 只验真不修复。"
  ]
});

export const wechatDirectProject = {
  order: 18,
  slug: "wechat-direct",
  title: "WeChatDirect",
  route: "/projects/wechat-direct",
  visibility: "公开仓库",
  repositoryUrl: "https://github.com/wlyaaaaa/WeChatDirect",
  statusTone: "mixed",
  cardStatus: "3 个完成态具名归档已保存 6032 条消息并全部独立验真；当前远端全历史和非语音附件仍有明确缺口",
  cardStatusTone: "pass",
  ...wechatDirectSnapshot,
  kicker: "把微信上下文、回复和附件变成可核对的工作材料",
  searchAliases: [
    "WeChatDirect是什么",
    "微信上下文和具名归档",
    "Windows本地只读微信工具"
  ],
  repositoryNote: "源码位于 PUBLIC（公开）仓库 wlyaaaaa/WeChatDirect。页面公开产品设计、命令、数据结构、实现、测试、失败和当前无正文环境体检；不读取或展示真实聊天正文、朋友圈正文、联系人身份、媒体原件、数据库位置、解密材料、账号承诺值、导出目录或凭据。",
  summary: "当我问“对方上次在微信里怎么说”“这条回复对应哪句话”“语音和附件在哪里”时，WeChatDirect 会在这台电脑已经可见的微信数据中，只读取一个明确联系人或群的小范围上下文，保留消息顺序、谁发的、回复关系和相关媒体。需要长期保留时，它还能只为这个具名对象建立可重放的本地档案；以后我再次要求更新时，命令才自动合并新增内容。它不会同步整个账号，也不会改写微信或猜测缺失内容。",
  why: "微信里的工作事实常分散在文字、引用回复、图片、语音和文件之间。只复制几句文字会丢掉“回复的是谁、附件属于哪条消息、当前窗口是不是完整历史”；同时有主号和副号时，按名字随便选一个账号还可能拿错来源。这个项目先把账号、对象、时间范围和原件关系钉牢，再让 AI 处理少量真正相关的内容。",
  plainExample: "我可以问：“项目群里对方最后确认的交付时间是什么？顺便告诉我那句‘可以’到底在回复哪条。”工具会先确认是主号还是副号里的哪个群，再只读取够回答问题的一小段聊天；最后把时间、说话人、原回复和能否打开的语音一起交回来，找不到唯一对象或附件打不开就明说，不拿相邻文件猜。",
  result: "我会得到两种清楚分开的结果：一次问题得到带账号、对象、实际时间范围、发送者、回复和媒体缺口的小上下文；长期保留得到可搜索的人类档案、给 AI 的小上下文、完整结构记录、当前可打开的语音媒体、来源指纹、游标、哈希清单和最近运行回执。无法唯一选账号、目标不存在、非语音附件打不开或来源在读取时变化，都会明确说明。恢复从最后一个完整提交点开始；首次硬崩溃留下的半成品仍是当前具名缺口。",
  readerStates: {
    pass: "一次查询交回已绑定账号、对象和实际范围的可读上下文，不把小窗口冒充全历史。更新具名档案时交回新增/更新结果；即使来源没变，也先核对清单与状态、结构记录和两份全文，全部一致才报告没有变化。",
    problem: "账号或联系人重名、引用目标不在当前窗口、媒体暂时打不开、群成员标签缺失或来源正在变化时，返回候选和具体 gaps，只扩大会改变答案的范围。",
    unavailable: "配置、身份承诺、本地数据库、索引或导出状态不成立时停止对应读取；来源没变但本地档案损坏也不会报告成功。保留已有导出和恢复点，不换账号、不扫整个目录，也不覆盖不同字节或补猜。"
  },
  stateLabels,
  methodCanvas: {
    kicker: "微信材料工作流",
    headline: "从一句普通问题到可核对结果，WeChatDirect 怎样工作",
    description: "先锁定账号和对象，再读取最小上下文；只有用户明确要长期保存时才建立单对象档案。聊天、朋友圈、媒体和保全各自保留真实边界。",
    steps: [
      { actor: "明确问题", title: "说清要找谁、找什么", detail: "点名联系人或群，以及要核对的事实、时间或关键词；普通问题不先同步整个账号。" },
      { actor: "绑定身份", title: "只接受唯一账号和对象", detail: "聊天可在主号、副号中自动查找；多处匹配就返回候选。朋友圈始终要求明确账号，不从昵称或头像猜。" },
      { actor: "只读取证", title: "复制稳定快照再读取", detail: "源数据库和数据库写入日志都保持只读，临时快照通过完整性检查后才查询；读取期间持续变化会失败关闭。" },
      { actor: "恢复关系", title: "把回复、发送者和媒体放回原消息", detail: "文字不脱离原来的发送方向和引用目标；所有媒体保留资源关系，当前只有精确绑定的语音字节可实际打开，其他类型明确留下不可用缺口。" },
      { actor: "交付结果", title: "回答一次，或更新一个具名档案", detail: "一次问题返回小上下文；明确归档时首次保存完整本地历史，后续使用游标和重叠窗口自动合并增量。" },
      { actor: "验真恢复", title: "哈希、清单和缺口一起交回", detail: "导出可独立验真；冲突、缓存缺失、媒体不可用和恢复条件保留在回执中，不把部分结果写成完整。" }
    ],
    columnsAriaLabel: "用户、WeChatDirect 与刻意不建设的边界",
    columns: [
      { title: "我决定", note: "对象、目的与保存范围", items: ["点名账号、联系人或群和真正要回答的问题", "决定只看一次、建立增量档案或生成明确保全包", "决定是否打开媒体、转写语音、扩大窗口或执行全量重核"] },
      { title: "WeChatDirect 负责", note: "身份、关系与可恢复结果", items: ["绑定来源身份，读取稳定的本地只读快照", "保留消息方向、群成员、回复、媒体、时间和缺口", "生成可搜索档案、增量状态、哈希清单和验真回执"] },
      { title: "刻意不做", note: "避免失控与第二套系统", items: ["不登录、不联网补历史、不自动点开朋友圈或操作微信", "不做全账号同步、后台任务、中央数据库或检索增强生成系统", "不按文件名、昵称、群名或模型感觉猜身份和媒体"] }
    ]
  },
  productPrinciples: [
    { title: "先点名对象，再读取内容", detail: "一次工作只绑定一个账号中的一个联系人或群；范围不清时先返回候选，不能靠“看起来最像”决定来源。" },
    { title: "先回答小问题，不先建大系统", detail: "普通问题使用最小有用窗口；只有明确提出长期保存，才为一个具名对象建立档案。不存在默认全账号同步。" },
    { title: "关系和原件比摘要更重要", detail: "谁说的、回复哪条、附件属于哪条消息和媒体是否真能打开，都会改变含义；产品保留这些关系后才交给 AI。" },
    { title: "本机可见范围就是事实边界", detail: "当前设备数据库和朋友圈缓存不等于微信远端全历史。未命中只说明当前覆盖没有看到，不能宣称对方没发过或主页为空。" },
    { title: "自动增量，但不后台同步", detail: "重复执行同一具名档案命令会用来源指纹、游标和重叠窗口合并新变化；自动指的是可重放命令，不是常驻任务。" },
    { title: "缺口和结果一起保存", detail: "打不开的媒体、缺失的引用、未知发送者、缓存未命中和不完整覆盖都进入结果；系统不为追求一份漂亮摘要而静默丢弃它们。" },
    { title: "有原始字节才谈派生", detail: "当前只有与消息唯一绑定的微信语音能取得原始字节与内容指纹；可播放的 WAV 音频明确记录它来自哪份 SILK 原始语音，其他媒体只保留关系和缺口，不能冒充已导出。" },
    { title: "输出必须能独立验真", detail: "档案、结构记录、媒体、状态和 manifest（清单）互相绑定；verify-export 会重算哈希、数量、路径和派生关系。" },
    { title: "注意力比全量灌入更值钱", detail: "AI 默认只读最近最多 80 条、128 KiB 的小上下文；旧事实按命中位置局部读取，不让完整档案淹没当前问题。" },
    { title: "失败时停在可恢复位置", detail: "来源变化、身份冲突、锁冲突或状态不一致会停止提交新状态；已有档案继续保留，下一步由明确重试、重核或补缓存触发。" }
  ],
  responsibilities: [
    "读取一个具名联系人或群的最小有用聊天上下文，并说明实际时间与本地可见范围",
    "严格区分主号和副号，绑定来源身份承诺，遇到多匹配时返回候选而不是猜",
    "保留 self / other / group member / system 等发送者角色、群成员标签和回复目标",
    "把图片、视频、文件、表情和语音与原消息精确关联；当前只打开精确绑定的语音字节，其他媒体保留可核对缺口",
    "为一个明确对象建立首次完整本地档案，并用可重放命令自动合并后续增量",
    "按明确账号读取或刷新当前本机朋友圈缓存，不冒充远端全历史",
    "生成自包含保全包、导出 manifest、状态与哈希回执，并独立验证现有导出",
    "在来源、身份、索引、媒体或状态不成立时给出具体缺口和恢复动作"
  ],
  exclusions: [
    "不修改微信数据库，不自动登录、切号、联网补历史、访问远端朋友圈主页或操作点赞评论",
    "不默认同步整个账号，不建立服务、队列、后台任务、第二数据库、中央人物画像或检索增强生成系统",
    "不把联系人昵称、头像、窗口标题、文件名或群名当成账号和媒体身份依据",
    "不把当前小窗口 self=0 写成用户从未说过话，也不把朋友圈缓存未命中写成对方没有内容",
    "不把不可解析正文、控制载荷、通话状态或打不开媒体伪造成普通文字和语音文件",
    "不公开真实聊天、朋友圈、联系人、媒体、数据库位置、解密材料、账号承诺、导出路径或凭据",
    "不把语音解码冒充语音转写；需要文字时另行使用 ChineseASR",
    "不把源码、Doctor 或合成测试冒充当前真实会话已读取成功",
    "不把完成态重放写成任意崩溃都能自动断点续跑，也不声称可以把档案恢复回微信"
  ],
  glossary: [
    { term: "Bounded context（有界上下文）", meaning: "只读取明确账号、对象、时间和数量范围内的消息；结果同时说明实际扫描和返回范围。" },
    { term: "Account identity commitment（账号身份承诺）", meaning: "账号原生身份的 SHA-256 承诺；用于确认本次来源仍是同一账号，不在回执里暴露真实身份。" },
    { term: "Sender role（发送者角色）", meaning: "消息来自本人、对方、群成员、系统还是仍未知；窗口内没看到本人消息不等于全历史没有。" },
    { term: "Quote target（回复目标）", meaning: "一条引用或回复实际指向的原消息；目标不在窗口时会精确回查，仍找不到就保留缺口。" },
    { term: "Locator（媒体定位凭据）", meaning: "由同一账号、同一消息结果生成的精确媒体定位；不能跨账号使用，也不能靠目录扫描替代。" },
    { term: "Source fingerprint（来源指纹）", meaning: "只根据相关数据库文件的大小、时间和目录组合形成的变更指纹；用于快速判断一个对象是否可能有变化，不读取正文。" },
    { term: "Incremental cursor（增量游标）", meaning: "记录已处理消息的 sortSeq 与时间位置；单来源可用排序游标，多来源退回有界时间重叠。" },
    { term: "Full reconcile（全量重核）", meaning: "用户明确要求时重新扫描该对象全部本地历史，用于旧历史变化、游标重置、无时间记录或后来可用的媒体。" },
    { term: "Current local Moments cache（当前本机朋友圈缓存）", meaning: "这台电脑此刻保留的朋友圈条目，不是远端主页，也不承诺历史完整。" },
    { term: "Manifest（导出清单）", meaning: "绑定账号、对象、范围、记录数量、文件路径、字节数、哈希、来源指纹和已知缺口的自验真说明。" },
    { term: "Preservation bundle（保全包）", meaning: "用户明确要求时生成的自包含聊天窗口、回复关系、账号/时间/原生身份、哈希和可用媒体集合。" },
    { term: "Replayable increment（可重放增量）", meaning: "相同对象、账号和输出目录再次显式执行会从最后一个完整 state 合并变化；首次硬崩溃无 state 半成品并不会自动修复。" }
  ],
  operatingFlow: [
    { title: "先明确普通问题还是长期保存", detail: "查一句话、时间或附件先走 context；只有用户明确要保留一个联系人或群，才走 sync-contact。" },
    { title: "解析唯一账号和对象", detail: "聊天的 auto 会在两个隔离槽位中寻找唯一匹配；朋友圈始终要求明确 primary 或 secondary。多匹配或不匹配直接返回。" },
    { title: "准备稳定的只读快照", detail: "直接读取本机配置中的加密来源，复制并解密到临时目录、合并数据库写入日志，再做完整性检查和只读查询；源持续变化就停止。" },
    { title: "还原消息与媒体语义", detail: "解析正文、发送者、群成员、引用目标和媒体关系；控制载荷、未知类型和不可打开项目都保留为明确缺口。" },
    { title: "生成小上下文或档案", detail: "一次问题返回有界结构结果；归档同时生成给 AI 的小窗口、人类完整档案、结构记录、当前可打开语音、增量状态与完整性清单。" },
    { title: "再次执行只合并变化", detail: "来源未变时不重新扫描源库消息，但仍核对已导出全文、结构记录、清单和状态绑定；变化时按排序游标或默认 1 天时间重叠抓取。当前可打开的语音媒体按内容哈希复用。" },
    { title: "完整性清单先于增量状态", detail: "记录、档案和 AI 小上下文先原子写入，完整性清单先发布，增量状态再成为下一次续作点；来源中途变化时不提交。" },
    { title: "需要时验真、重核或补缓存", detail: "已有导出可以独立重算哈希和数量；旧历史或媒体缺口显式执行全量重核；朋友圈未缓存时只提示在同一账号手动打开目标后重试。" }
  ],
  components: [
    { name: "wechat-direct Skill", responsibility: "把聊天问题、单对象归档、朋友圈和保全请求路由到正确命令。", implementation: "普通问题先读最小窗口；归档权限只覆盖用户点名的一个联系人或群，语音转写转交 ChineseASR。" },
    { name: "wechat_cli.py", responsibility: "提供 8 个公开命令、账号/对象解析、结果投影、导出、增量、保全、Doctor 与验真。", implementation: "限制扫描和输出，使用原子文件替换、目录锁、manifest/state 双阶段提交和明确 ProductError。" },
    { name: "wechat_source.py", responsibility: "直接读取 WeChat 本机加密 SQLite 与缓存，并恢复消息、联系人、群成员、朋友圈和媒体关系。", implementation: "DPAPI（Windows 数据保护接口）解开本机配置载体，临时解密数据库与 WAL，quick_check 后以 query_only 查询；不依赖 HTTP helper。" },
    { name: "voice_decode.py", responsibility: "把精确绑定的 WeChat SILK 语音派生为 WAV。", implementation: "独立 Python 3.11 + pilk 路径；原始 SILK 不被替换，WAV 记录 derivedFromSha256。" },
    { name: "accounts.json", responsibility: "保存 primary / secondary 两个隔离槽位的本机来源入口与身份承诺。", implementation: "不保存微信密钥明文；真实文件留在本机并限制 ACL，示例只提供占位结构。" },
    { name: "联系人导出", responsibility: "保存一个对象的可搜索全档、AI 小上下文、结构记录、当前可打开媒体、清单、状态和运行回执。", implementation: "messages.jsonl 是合并事实层；context.md 面向人；ai-context.md 最多 80 条和 128 KiB；当前可打开的语音按 SHA-256 去重复用，其他媒体保留关系与缺口。" },
    { name: "朋友圈导出", responsibility: "保存一个明确账号当前本机可见的朋友圈缓存快照。", implementation: "重复刷新会加入、更新或删除与当前缓存不再一致的条目；状态始终写明 current_local_cache_only。" },
    { name: "WeChatDirect-private-archive（公开前历史档案）", responsibility: "只保存公开版本形成前的历史与迁移依据；该 PRIVATE 仓库已经归档。", implementation: "它不生产当前读取、具名归档、增量或恢复行为，也不再是现役消费者或独立项目卡。现在这些能力只由 PUBLIC WeChatDirect 负责。" },
    { name: "测试与公开命令合同", responsibility: "验证来源读取、CLI、公开 Doctor/验真、增量、回复、媒体、账号隔离和恢复边界。", implementation: "3 个测试模块当前完成 50 项测试与 2 个子测试；它们使用合成数据，不包含真实聊天正文。" }
  ],
  usageExamples: [
    { ask: "查一下对方上次在微信里确认的交付时间。", effect: "只读取这个联系人或群里够回答问题的一小段，保留谁发给谁和实际覆盖时间；没找到就说明查到了哪里，不自动翻完整个账号。", moduleSlug: "bounded-chat-context" },
    { ask: "把这个项目群持续保存下来，以后只补新增内容。", effect: "第一次保存当前设备可见的完整本地历史；以后重复同一命令自动合并新增或更新消息，并保留增量游标、来源指纹和运行回执。", moduleSlug: "named-chat-archive" },
    { ask: "他这句“可以”回复的是哪条？语音和附件关系也一起核对。", effect: "沿微信原本的回复关系找到被引用消息；当前能精确打开的语音会保留原件并生成可播放版本，其他附件只报告属于哪条消息和为什么暂时打不开。", moduleSlug: "reply-media-relations" },
    { ask: "看看副号里这个人最近发的朋友圈。", effect: "只读取我点名的副号和这台电脑当前已经缓存的内容；没缓存时提示我在同一个账号里手动打开对方主页后再试，不假装访问了远端完整主页。", moduleSlug: "moments-local-cache" },
    { ask: "主号和副号都有同名联系人，别拿错。", effect: "自动账号选择会返回两个候选并停止；账号身份、联系人原生身份和已有档案状态必须一致，不能按昵称、头像或窗口猜。", moduleSlug: "account-source-identity" },
    { ask: "把昨晚这段聊天、引用关系和当前能打开的语音做成一份保全包。", effect: "生成自包含消息文件、完整性清单和媒体目录；SILK 原始语音与可播放 WAV 分开记录，图片、文件等不可打开项目留在缺口中。", moduleSlug: "preservation-verification" },
    { ask: "上次完整归档以后又有新消息，怎样继续？", effect: "再次保存同一个对象时，会从最后一次完整结果继续合并新增和更新；账号、来源或旧档案对不上就停止，第一次崩溃留下的半成品也不会冒充可续跑状态。", moduleSlug: "named-chat-archive" }
  ],
  evidenceLayers: [
    { layer: "PUBLIC source（公开源码）", proves: "8 个命令、只读数据库快照、账号绑定、上下文、增量、朋友圈、媒体、保全和验真机制真实存在。", doesNotProve: "当前某个真实联系人、群、朋友圈或媒体现在可读。" },
    { layer: "README + Skill（使用合同）", proves: "普通问题、单对象归档、朋友圈、媒体与明确保全的自然语言路线和禁止项已说明。", doesNotProve: "文档本身不能替代代码行为或现场结果。" },
    { layer: "50 tests + 2 subtests", proves: "合成数据下的身份冲突、回复、媒体、缓存、增量、原子提交、快速路径完整性、来源漂移和导出验真回归通过。", doesNotProve: "真实微信版本、真实本机数据库结构、当前私有正文或媒体完整性。" },
    { layer: "Doctor（无正文环境体检）", proves: "当前 Windows、Python 3.14、依赖、两个配置槽位所需文件和语音解码器可用。", doesNotProve: "Doctor 不打开数据库，也不证明账号身份承诺、聊天正文或现场导出成功。" },
    { layer: "Git Owner（Git 事实责任方）", proves: "PUBLIC main=4883536，默认分支、远端、工作树和发布身份已回读一致。", doesNotProve: "Git 同步不能证明当前 WeChat 客户端、缓存或个人内容状态。" },
    { layer: "Live named-object E2E（具名对象现场验收）", proves: "只有用户点名对象后的真实 context / sync / media / verify 回执，才能证明该次本地可见范围和输出。", doesNotProve: "一个对象成功不能证明全账号或微信远端全历史完整。" }
  ],
  evolution: [
    { date: "2026-08-30", commit: "7f9488f—7da69ae", result: "WeChatDirect-private-archive 已归档为只保留公开前历史与迁移依据的旧库，不再生产现役行为；读取、具名归档与恢复语义转由 PUBLIC WeChatDirect 承接。随后发布 PUBLIC v0.1.0，并补齐未知消息缺口、跨分片身份冲突和私聊身份加载性能：本机只读上下文、朋友圈、语音媒体、单对象增量归档、保全、验真和失败关闭形成初始公开基线。" },
    { date: "2026-09-01", commit: "4883536", result: "修正非语音媒体与崩溃恢复的公开边界，并让联系人无变化快速路径在返回成功前重验 manifest 自哈希、manifest/state 绑定、档案文件哈希/大小和记录数。" }
  ],
  operationalEntrypoints: [
    { name: "聊天上下文", command: "wechat-direct context --account auto --contact \"<联系人或群>\"", purpose: "读取一个有界窗口并返回发送者、回复、媒体、实际范围和缺口。" },
    { name: "具名增量归档", command: "wechat-direct sync-contact --account primary --contact \"<联系人或群>\"", purpose: "首次保存完整本地历史，之后同一命令可重放增量。" },
    { name: "补充重核入口", command: "wechat-direct sync-contact --account primary --contact \"<对象>\" --full-reconcile", purpose: "这是 sync-contact 的显式补充模式：旧历史变化、游标重置、无时间记录或历史语音后来可用时重新核对该对象。" },
    { name: "朋友圈缓存", command: "wechat-direct moments --account primary --contact \"<联系人>\"", purpose: "读取明确账号当前本机缓存，不访问远端主页。" },
    { name: "朋友圈快照", command: "wechat-direct sync-moments --account primary --self", purpose: "建立或刷新明确账号当前本机可见的朋友圈缓存快照；被缓存淘汰的条目会从刷新结果移除。" },
    { name: "精确语音媒体", command: "wechat-direct media-open --account primary --locator \"<voice-locator>\" --output \"<文件>\"", purpose: "当前实际打开精确绑定的 VoiceInfo 语音；输出必须不存在，其他媒体类型保留关系与不可打开缺口。" },
    { name: "明确保全", command: "wechat-direct preserve --account primary --contact \"<对象>\" --lookback-days 1 --output \"<目录>\"", purpose: "生成一个自包含聊天窗口、回复关系、媒体和哈希清单。" },
    { name: "无正文环境体检", command: "py -3.14 wechat_cli.py doctor", purpose: "检查平台、Python、依赖、配置入口和语音解码器，不打开聊天数据库或输出路径。" },
    { name: "导出验真", command: "wechat-direct verify-export --output \"<导出目录>\"", purpose: "不打开源数据库，重算 v1 联系人或朋友圈导出的清单、状态、文件和媒体关系。" },
    { name: "开发回归", command: "py -3.14 -m pytest -q", purpose: "这是源码验证入口，不是产品命令；运行当前 50 项测试与 2 个子测试，不读取真实微信数据。" }
  ],
  snapshotUpdateNote: "本页是 2026-09-01 首次全量核对后发布的 WeChatDirect 快照。以后只有公开源码、命令、行为、失败边界、测试、当前无正文环境体检或已获准的现场证据发生会改变使用判断的实质变化时，才把新事实合并进现有页面；普通提交、重构、时间戳或私人聊天变化不自动改写网站，也不追加更新日志。"
};

export const wechatDirectModules = [
  {
    slug: "bounded-chat-context",
    shortTitle: "聊天上下文",
    title: "只读一个明确对象的最小有用聊天上下文",
    searchAliases: ["查某个人上次在微信说了什么", "查微信聊天上下文", "微信关键词附近消息", "微信小窗口不是全历史", "微信消息谁发的", "微信群成员标签", "微信聊天实际时间范围"],
    searchProjection: {
      intents: ["读取一个明确联系人或群的近期微信上下文", "按关键词或时间定位消息附近", "判断当前窗口有没有看到本人发言", "保留小窗口与全历史的边界"],
      entities: ["context", "primary", "secondary", "auto", "senderRole", "returnedSenderRoleCounts", "availableHistoryHint"],
      relations: ["账号槽位绑定一个来源身份", "联系人或群绑定一个原生会话", "返回消息属于有界请求窗口", "窗口发送者计数不代表全历史"],
      failureRecovery: ["多账号多对象匹配时返回候选", "关键词未命中时不扩大到全账号", "窗口为空时返回可见历史提示", "输出超过 512 KiB 时缩小请求范围"]
    },
    teaser: "context 命令最多扫描 500 条并返回 80 条，把实际窗口、发送者角色、回复、媒体和 gaps 一起交回。",
    status: "源码、50 项回归与 2 个子测试已核对；本次网页刷新没有读取真实具名会话",
    statusTone: "mixed",
    value: "问一句微信事实时，不需要先导出整个账号，也不会得到一段脱离账号、对象、时间和附件关系的裸文字。",
    why: "一条消息的含义可能取决于谁发的、回复哪条、附件是什么，以及当前窗口是不是完整历史。只按关键词抄一句，容易把群成员、本人、系统消息和引用目标混在一起。",
    example: "我问“项目群里最后是谁同意周五交付？”工具只翻这个群里够回答问题的一段，把说话人、时间和那句回复指向的原消息一起给我；主号、副号里都有同名群时，它先列候选，绝不蒙一个。",
    result: "得到一份不超过 512 KiB 的结构结果：唯一账号与对象、请求和实际时间范围、扫描/返回数量、发送者计数、消息、引用目标、媒体类型、可见历史提示、缺口与整体 SHA-256。",
    readerStates: {
      pass: "账号和对象唯一，窗口可读，影响问题的发送者、引用和媒体关系都已返回。",
      problem: "对象重名、引用目标在窗口外、群成员标签不全或媒体打不开时，保留候选和缺口，并只扩大必要范围。",
      unavailable: "账号配置、身份承诺、本地消息库、时间索引或输出边界不成立时停止，不换来源补猜。"
    },
    stateLabels,
    decisionImpact: [
      "聊天默认从最小窗口开始，不先创建全量档案。",
      "auto 只有唯一匹配时才选择账号；多匹配必须由用户决定。",
      "返回窗口的 self=0 只表示这段没有观察到本人消息，不代表全历史没有。",
      "空窗口仍说明当前会话是否存在更早或更新的本地可见消息。",
      "私聊引用目标可按 server id 回查；群聊目标超出当前扫描窗口时仍可能只返回缺口。",
      "只有会改变答案的媒体才需要进一步打开或转写。"
    ],
    problem: "解决错账号、错对象、截断上下文、发送者混淆、小窗口冒充全历史和附件关系丢失。",
    implementation: [
      "_resolve_contact 在 primary / secondary 槽位中按当前联系人目录解析唯一对象，contact_ambiguous 返回公开安全候选。",
      "_context_result 校验扫描与返回上限，按 since / until / lookback / around / contains 形成有界窗口。",
      "_sender_receipt 保留 self、other、system、unknown 与群成员标签；文件传输助手只加标签，不改写原生角色。",
      "返回 scannedSenderRoleCounts、returnedSenderRoleCounts、selfObservation、availableHistoryHint 与 gaps。",
      "Canonical JSON（规范 JSON）计算 manifestSha256；超过 512 KiB 直接 context_output_too_large。"
    ],
    flow: [
      "读取两个隔离账号槽位的公开安全配置结构。",
      "解析唯一联系人或群，失败时返回未命中或候选。",
      "按请求时间与上限从稳定只读快照取消息。",
      "围绕关键词或时间锚点选择最多 80 条。",
      "补全发送者、回复目标和媒体缺口。",
      "写出带实际范围与哈希的 JSON，不修改任何源数据。"
    ],
    concepts: [
      { term: "Bounded context（有界上下文）", explanation: "账号、对象、时间和返回数量都明确的一小段消息，不代表远端或本地全历史。" },
      { term: "Sender role（发送者角色）", explanation: "self、other、system 或 unknown；群聊还单独解析成员标签。" },
      { term: "availableHistoryHint", explanation: "窗口为空时说明当前本机是否仍知道更早、更晚或不可读消息存在。" },
      { term: "manifestSha256", explanation: "对本次规范结果计算的整体内容指纹，用于确认回执没有静默变化。" }
    ],
    boundaries: [
      "最多扫描 500 条、返回 80 条，默认回看 7 天。",
      "不自动把窗口扩大到整个联系人、群或账号。",
      "当前设备本地可见范围不等于微信远端全历史。",
      "群聊窗口外引用目标没有接入内部锚点设计，不能承诺全部回复都会补回。",
      "不把真实联系人、聊天正文或媒体复制到网页。"
    ],
    failures: [
      { condition: "多个账号或对象精确匹配", response: "返回 contact_ambiguous 候选，等待用户选定，不取第一项。" },
      { condition: "关键词或时间锚点未命中", response: "返回明确锚点缺口；只在用户需要时调整窗口。" },
      { condition: "回复目标或媒体不在当前可见范围", response: "保留 quote_target_missing / media_not_openable 等 gaps，不伪造正文。" },
      { condition: "消息库缺索引或输出过大", response: "停止对应请求，缩小范围或修复源级索引后重试。" }
    ],
    sources: [
      { path: "README.md · context", role: "自然语言用途、命令示例与小窗口边界。" },
      { path: "wechat_cli.py · _resolve_contact / _context_result", role: "唯一对象解析、窗口选择、发送者、回复和结果合同。" },
      { path: "wechat_source.py · fetch_messages", role: "分片消息读取、内容投影、索引与媒体关系。" },
      { path: "tests/test_wechat_cli.py", role: "对象歧义、窗口角色、引用目标、媒体缺口和空窗口回归。" }
    ],
    verification: [
      "test_exact_contact_ambiguity_never_picks_first 验证多匹配不猜。",
      "test_context_keeps_native_ids_quote_target_and_media_gap 验证消息、引用和媒体缺口。",
      "test_empty_context_reports_that_older_local_history_exists 验证空窗口不冒充全历史为空。",
      "真实可用性仍需用户点名对象后的 context E2E，本次网页刷新未执行。"
    ],
    relation: "这是一次性问题的默认入口；需要长期保存时进入“具名增量归档”，需要打开附件时进入“回复与媒体关系”。"
  },
  {
    slug: "named-chat-archive",
    shortTitle: "具名增量归档",
    title: "一个联系人或群的首次全量与自动增量归档",
    searchAliases: ["微信单联系人自动增量", "微信群增量归档", "sync-contact", "微信首次完整本地历史", "微信ai-context", "微信归档游标"],
    searchProjection: {
      intents: ["首次导出一个微信联系人或群", "重复命令自动合并微信增量", "给 AI 最近小上下文而保留完整档案", "重新核对一个对象全部本地历史"],
      entities: ["sync-contact", "messages.jsonl", "context.md", "ai-context.md", "state.json", "manifest.json", "sortSeq"],
      relations: ["首次运行绑定完整本地历史", "后续运行绑定同一账号对象输出目录", "messages.jsonl 合并新旧消息", "state 在 manifest 发布后提交"],
      failureRecovery: ["从最后完整 manifest/state 重放", "身份或对象变化时拒绝续写", "来源未变仍校验完整导出文本与状态绑定", "旧历史变化时显式 full reconcile", "首次硬崩溃无 state 半成品与陈旧锁不自动修复"]
    },
    teaser: "sync-contact 第一次保存该对象当前设备可见的完整本地历史；以后重复同一命令会自动重放并合并增量。",
    status: "首次全量、增量、无变化快速路径、来源变化和提交顺序均有合成回归；本页未读取真实档案正文",
    statusTone: "mixed",
    value: "长期合作对象的聊天可以持续更新，而不需要每次全量导出、复制旧媒体或把完整历史交给 AI。",
    why: "只保存一次会漏掉后续内容；每次全量重做又慢、重复且容易在中断时留下半成品。真正可用的归档需要知道自己处理到哪里、来源是否变化、哪些是新增或更新，以及怎样验证提交完成。",
    example: "我说“把这个供应商群持续保存下来”。第一次会保存当前设备能看到的完整本地历史；下周再说同一句，档案只补新消息、更新过的内容和后来能打开的语音，旧内容不会整包重抄。",
    result: "得到一个稳定目录：完整人类档案、AI 小上下文、messages.jsonl、当前可打开的语音、manifest、state 和 last-run；每次回执说明模式、新增/更新/总数、媒体复用、发送者缺口和增量覆盖边界。恢复从最后完整 manifest/state 开始，首次硬崩溃半成品不冒充可续跑。",
    readerStates: {
      pass: "有变化时完成增量合并，manifest 与 state 指向同一完整结果；无变化时也先验证清单自哈希、账号/对象/来源绑定、JSONL 哈希和数量、两份全文的哈希与字节数，再返回 noChange 并更新运行回执。",
      problem: "多分片、无时间旧消息、历史修改或媒体后来可用时，普通增量只说明覆盖边界，并提示 full reconcile。",
      unavailable: "输出目录未初始化、身份不一致、并发或陈旧锁、来源在读取时变化、导出全文损坏或 manifest/state 不一致时停止提交；不覆盖不同字节来强行修好快速路径，没有旧 state 时需要人工核对半成品。"
    },
    stateLabels,
    decisionImpact: [
      "第一次归档必须覆盖该对象全部本地可见历史，不允许用时间参数伪造完整档案。",
      "后续重复命令就是自动增量，不需要 watcher 或计划任务。",
      "单消息来源优先使用 sortSeq 游标；多来源退回时间重叠并明确无时间记录边界。",
      "AI 只默认读取最近最多 80 条、128 KiB，完整档案仍可按需搜索。",
      "当前可打开的语音按内容哈希复用；后来可用的历史语音可在增量窗口或 full reconcile 中补齐。",
      "full reconcile 会更新或补充同身份记录，但不会把来源里后来消失的旧归档记录自动删除。",
      "完成态可以确定性重放，但首次硬崩溃无 state、陈旧锁和目录级 repair 尚未实现；verify-export 只验真不修复。"
    ],
    problem: "解决一次性导出很快过期、全量重复成本高、来源漂移覆盖旧提交点、身份串档和把完整历史反复灌入模型；同时明确暴露首次硬崩溃恢复仍未闭环。",
    implementation: [
      "state.json 固定 wechat-direct-contact-sync.v1、账号身份承诺、联系人原生身份、游标、水位、来源指纹和消息数量。",
      "messages.jsonl 用 server id；没有 server id 时用本地 id、时间、sortSeq 与发送者计算稳定合并键。",
      "默认 overlapSeconds=86400，允许 0 到 31 天；单分片且目录不变时使用 sortSeqReplayFloor。",
      "来源指纹未变时先再取一次指纹确认稳定，重验 manifest 自哈希及其与 state 的账号、身份承诺、联系人、来源指纹和数量绑定；messages.jsonl 核对 SHA-256 与记录数，context.md 和 ai-context.md 分别核对完整 SHA-256 与字节数。全部一致才返回 sourceMetadataFastPath/noChange 并只更新 last-run。",
      "档案和 AI 小上下文原子写入，manifest 先于 state；state 是下一次增量的提交标记。",
      ".sync.lock 阻止两个写者同时更新同一输出目录；当前不会自动判断或清除陈旧锁。",
      "快速返回已经包含导出全文与结构记录的完整哈希核对，不只是看文件存在或数量；独立 verify-export 另核整个导出的路径、媒体与派生关系，不应把两者的覆盖范围混为一谈。"
    ],
    flow: [
      "首次解析账号与对象，拒绝带 since / until 的伪完整导出。",
      "建立输出目录锁并计算与该对象相关的来源指纹。",
      "选择 full、incremental 或 explicit full_reconcile 模式。",
      "无变化候选先复核来源指纹、清单/状态绑定及已导出全文和记录；通过则只更新 last-run，不重扫源库消息。",
      "抓取候选，按稳定消息键合并现有 JSONL。",
      "只复制新增、更新或需要重试且当前真正 openable 的语音，已存在哈希文件直接复用。",
      "生成完整 context.md 与有界 ai-context.md。",
      "先写 manifest，再写 state 和 last-run，最后释放锁。"
    ],
    concepts: [
      { term: "First full snapshot（首次完整快照）", explanation: "第一次保存该对象当前设备可见的全部本地历史；它仍不等于微信远端全历史。" },
      { term: "sortSeq cursor（排序游标）", explanation: "单一消息来源下按 WeChat 排序序号继续，能包含没有 createTime 的新增消息。" },
      { term: "Overlap window（重叠窗口）", explanation: "从上次最后时间向前回看一段，默认 1 天，用于吸收迟到或变化记录。" },
      { term: "Source metadata fast path（来源元数据快速路径）", explanation: "相关源文件指纹重复核对未变时，不重新扫描源库消息；先重验本地导出全文、结构记录、清单与状态绑定，全部一致后才确认无变化并更新回执。" }
    ],
    boundaries: [
      "权限只覆盖用户点名的一个联系人或群，不扩到全账号。",
      "首次本地完整不代表远端完整，也不补设备上已经不存在的历史。",
      "多分片普通增量不能保证抓到没有时间的旧记录；需要 full reconcile。",
      "没有 resume、repair、restore/import 或恢复回微信命令；首次硬崩溃无 state 目录不会自动接管。",
      "归档目录留在本机，不进入公开网站或 Git。"
    ],
    failures: [
      { condition: "首次输出目录已有未知内容", response: "返回 sync_output_not_initialized，不覆盖用户文件。" },
      { condition: "账号、联系人或状态身份不一致", response: "返回 sync_identity_mismatch，保留原档案并要求使用原对象或新目录。" },
      { condition: "同一目录已有运行锁", response: "返回 sync_already_running_or_stale_lock；先确认旧进程与锁状态，不并发写。" },
      { condition: "来源在读取期间发生变化", response: "返回 source_changed_during_sync_retry，不提交新 state；下次从旧完整状态重试。" },
      { condition: "来源没变，但本地导出文本、记录或清单绑定漂移", response: "按实际位置返回 sync_context_sha256_mismatch、sync_ai_context_sha256_mismatch、sync_records_sha256_mismatch 或 sync_manifest_state_mismatch 等精确错误；不返回 noChange，也不默默覆盖不同字节。" },
      { condition: "需要覆盖旧历史变化", response: "用户显式使用 --full-reconcile，重新核对该对象全部本地可见历史。" },
      { condition: "首次同步硬崩溃后有文件但没有 state", response: "返回 sync_output_not_initialized；当前必须人工核对或移走半成品后重建。" },
      { condition: ".sync.lock 来自已退出进程", response: "当前仍按锁冲突停止；不能无条件删除，也没有自动陈旧锁修复。" }
    ],
    sources: [
      { path: "README.md · sync-contact", role: "首次全量、自动增量、AI 小上下文与 full reconcile 使用边界。" },
      { path: "wechat_cli.py · command_sync_contact", role: "游标、重叠、合并、媒体、manifest/state 提交和回执实现。" },
      { path: "wechat_source.py · contact_source_fingerprint", role: "与单对象相关的无正文来源变化指纹。" },
      { path: "tests/test_wechat_cli.py · contact sync", role: "首次、增量、游标、原子提交和来源变化回归。" }
    ],
    verification: [
      "test_contact_sync_is_full_then_bounded_incremental_ai_context 验证首次完整与 AI 小窗口。",
      "test_contact_sync_changed_source_replays_indexed_cursor_and_merges 验证来源变化后的游标合并。",
      "test_manifest_is_published_before_state_commit_marker 验证提交顺序。",
      "test_contact_sync_does_not_commit_when_source_changes_during_read 验证漂移失败关闭。",
      "test_contact_fast_path_rejects_hash_size_count_and_state_drift 覆盖无变化候选的清单自哈希、全文字节、记录数与状态绑定漂移；CLI 回归另验证 context、ai-context 和 JSONL 内容变化不能返回 noChange。",
      "当前没有硬杀进程后半成品自动恢复测试，因为该能力尚未实现。"
    ],
    relation: "它消费“聊天上下文”同一账号与对象语义，调用“回复与媒体关系”复制当前可打开的语音并保留其他媒体缺口；完整提交点、增量重放、全量重核和崩溃恢复缺口都由本模块统一说明。"
  },
  {
    slug: "reply-media-relations",
    shortTitle: "回复与媒体",
    title: "让回复和所有媒体关系属于正确消息，实际字节只取可证语音",
    searchAliases: ["微信语音和原消息怎样关联", "微信回复关系", "微信引用原消息", "微信图片语音文件关联", "media-open", "微信SILK转WAV", "微信附件精确定位"],
    searchProjection: {
      intents: ["找到一条微信回复指向的原消息", "核对图片视频表情文件与原消息的资源关系", "打开精确语音并派生 WAV", "保全消息与当前可打开媒体的来源关系"],
      entities: ["quote", "platformMessageId", "locator", "media_manifest", "SILK", "WAV", "derivedFromSha256"],
      relations: ["回复消息指向平台消息标识", "媒体定位绑定账号消息和源记录", "导出媒体绑定内容 SHA-256", "WAV 派生自原始 SILK 哈希"],
      failureRecovery: ["引用目标缺失时保留 quote gap", "媒体不可打开时不扫描目录猜测", "语音格式不支持时保留原始字节", "需要文字时把 WAV 交给 ChineseASR"]
    },
    teaser: "所有媒体先保留同一账号、同一消息的资源关系；当前 reader 真正能打开字节的是唯一 VoiceInfo 语音。回复目标按平台标识回查，语音原始字节与派生 WAV 分开保存。",
    status: "引用与所有媒体关系、VoiceInfo 语音打开和派生已有合成回归；非语音媒体字节打开及群聊窗口外引用补取尚未实现",
    statusTone: "mixed",
    value: "AI 不会只看一段脱离附件和引用的文字；原回复和所有媒体仍属于正确消息。当前语音可以独立核对，图片、视频、文件和表情则诚实显示关系与不可打开状态。",
    why: "微信中的“可以”“按这个来”常是在回复另一条消息；语音和附件也可能才是关键事实。按文件名或附近时间猜媒体，会把别的聊天文件绑进来，错误比缺失更难发现。",
    example: "群里有人只回了句“没问题”，我想知道他究竟同意哪份方案。工具会沿微信自己的回复关系找回原消息；若这条还带语音，就保留原始语音并另做一份可播放文件，图片或附件暂时打不开则把缺口原样交回来。",
    result: "得到消息、引用目标、媒体类型、openable 状态和关系缺口；当前只有精确语音会得到 locator、原始字节数与 SHA-256，归档还记录语音文件路径、复用情况和 WAV 的 derivedFromSha256。",
    readerStates: {
      pass: "引用目标可定位；媒体关系已绑定原消息，当前需要的语音能精确打开且原始与派生哈希闭合。",
      problem: "群聊引用目标不在扫描窗口、非语音媒体只有关系、群成员标签缺失或语音解码失败时保留具体 gap。",
      unavailable: "locator 账号不匹配、源文件越界、媒体哈希冲突或语音不是受支持 SILK 时停止，不从目录或文件名寻找替代。"
    },
    stateLabels,
    decisionImpact: [
      "回复关系是答案证据，不被压缩成普通文本前缀。",
      "图片、视频、文件、表情和语音都保留 messageNativeId 与 mediaId。",
      "当前可打开的语音按内容 SHA-256 保存和复用，不因文件名不同复制多份。",
      "media-open 的目标必须不存在，避免静默覆盖用户已有文件。",
      "语音解码和语音转写是两步；WeChatDirect 只负责可追溯地生成 WAV。"
    ],
    problem: "解决引用上下文丢失、媒体串错消息、同一附件重复复制、语音派生不可追溯和失败项目被静默忽略。",
    implementation: [
      "_attach_quote_targets 先在扫描窗口找平台消息标识，缺失时用同一会话精确回查。",
      "DirectWeChatReader 为资源关系和 VoiceInfo 语音生成账号绑定 locator；当前 open_locator 只实现精确语音字节。",
      "_sync_message_media 只对 openable 语音按 payload SHA-256 建 media/<前两位>/<hash> 路径，已有文件先重算哈希。",
      "SILK 语音原始文件保留；独立 voice_decode.py 通过 pilk 生成 24 kHz WAV。",
      "派生记录包含 path、bytes、sha256 与 derivedFromSha256；verify-export 会再次核对关系。"
    ],
    flow: [
      "从消息记录取得引用标识和媒体 manifest。",
      "在同一会话查找回复目标，找不到就记录 gap。",
      "非语音媒体保存资源关系和 not_openable / unprocessed 缺口。",
      "对精确 VoiceInfo 语音验证 locator 与当前账号、源记录和本地文件一致。",
      "读取语音原始字节、计算 SHA-256 并按需派生 WAV。",
      "把成功、不可用与派生关系写回消息和导出清单。"
    ],
    concepts: [
      { term: "Quote target（回复目标）", explanation: "当前消息引用的原始平台消息，不是模型根据文字猜出的上下文。" },
      { term: "Locator（媒体定位凭据）", explanation: "绑定账号、数据库记录和媒体种类的精确定位值，只能在同一来源使用。" },
      { term: "SILK", explanation: "微信语音常见的原始编码；保全时原样保存，不用 WAV 替代原件。" },
      { term: "derivedFromSha256", explanation: "证明 WAV 等派生文件来自哪份原始媒体哈希。" }
    ],
    boundaries: [
      "当前只有精确绑定的 VoiceInfo 语音具有字节打开实现；其余媒体不能宣传为已导出。",
      "只打开会改变当前答案或用户明确要求保存的语音。",
      "通话事件只是状态，不是可供转写的语音文件。",
      "语音转写属于 ChineseASR，不进入 WeChatDirect 源码或归档状态。",
      "真实媒体和 locator 不进入网站。"
    ],
    failures: [
      { condition: "回复目标不在当前可见消息中", response: "精确回查同一会话；仍缺失则保留 quote_target_missing。" },
      { condition: "媒体记录存在但字节不可打开", response: "标注 media_not_openable / open_failed，不扫描目录猜替代文件。" },
      { condition: "目标文件已存在", response: "media_output_already_exists，要求新路径，不覆盖。" },
      { condition: "语音格式或解码器不可用", response: "保留原始 SILK 与 voiceWavGap；不伪造 WAV 或转写。" }
    ],
    sources: [
      { path: "wechat_cli.py · _attach_quote_targets", role: "回复目标回查和 gap 语义。" },
      { path: "wechat_source.py · resolve_locator / open_locator", role: "媒体定位绑定与原始字节读取。" },
      { path: "wechat_cli.py · command_media_open / _sync_message_media", role: "显式打开、哈希去重和语音派生。" },
      { path: "voice_decode.py", role: "独立 SILK → WAV 派生入口。" }
    ],
    verification: [
      "test_context_keeps_native_ids_quote_target_and_media_gap 验证引用与媒体缺口。",
      "test_media_open_writes_only_explicit_destination 验证不覆盖。",
      "test_media_open_decodes_voice_only_when_explicit 验证语音派生必须显式。",
      "test_verify_export_requires_media_hash_size_and_relation 验证原始/派生关系。"
    ],
    relation: "聊天和归档都复用本模块；语音需要文字时把派生 WAV 交给 ChineseASR，但各自保留独立证据和失败状态。"
  },
  {
    slug: "moments-local-cache",
    shortTitle: "朋友圈缓存",
    title: "明确账号下的当前本机朋友圈缓存",
    searchAliases: ["微信朋友圈本地缓存", "sync-moments", "朋友圈副号", "朋友圈目标未缓存", "朋友圈缓存快照", "朋友圈不是远端全历史"],
    searchProjection: {
      intents: ["读取一个明确账号的当前朋友圈缓存", "查看指定联系人最近缓存的朋友圈", "保存和刷新当前缓存快照", "处理目标不在本机缓存"],
      entities: ["moments", "sync-moments", "primary", "secondary", "self", "current_local_cache_only", "targetCacheStatus"],
      relations: ["朋友圈请求必须绑定显式账号", "self 绑定来源证明的账号作者身份", "联系人可来自当前联系人目录或缓存发布者", "刷新结果替换为当前缓存集合"],
      failureRecovery: ["未指定账号时分别请求主副号", "重名联系人返回候选", "目标未缓存时提示同账号手动打开主页", "缓存淘汰条目从新快照移除"]
    },
    teaser: "moments 与 sync-moments 只读取明确账号当前设备可见的 sns 缓存；缓存未命中不是空主页，刷新也不保留已淘汰条目。",
    status: "显式账号、自身身份、缓存发布者、未命中下一步和快照替换均有合成回归；未读取真实朋友圈正文",
    statusTone: "mixed",
    value: "可以把当前电脑已经看见的朋友圈内容有界交给当前工作，同时不会把主号、副号或远端完整性混在一起。",
    why: "朋友圈不是普通聊天目录：账号自己的身份可能不在会话列表，当前缓存里的发布者也可能没有聊天会话。若只查 session 或默认 auto，容易漏人、串号并把缓存未命中误写成没有内容。",
    example: "我说“看看副号里小王最近发的朋友圈”。工具只看副号在这台电脑上已经缓存的内容；能找到人但没有正文时，它会提示我回到副号手动打开小王主页后再试，不把“本机没缓存”说成“他什么都没发”。",
    result: "得到账号、对象、请求窗口、实际可见截止、扫描/匹配/返回数量、targetCacheStatus、缓存是否还有更多、条目、媒体缺口和清单哈希；同步目录明确写 current_local_cache_only。",
    readerStates: {
      pass: "显式账号与对象唯一，当前缓存中存在目标条目，返回和保存范围明确。",
      problem: "发布者只在缓存出现、同名、多账号都可能存在、媒体未打开或缓存发生淘汰时，保留候选、状态和变化。",
      unavailable: "目标不在当前本机缓存时返回可行动缺口；不自动打开主页、切账号、联网补历史或宣称主页为空。"
    },
    stateLabels,
    decisionImpact: [
      "朋友圈始终显式指定 primary 或 secondary；自然请求没给账号时分别读取并标注两份结果。",
      "self 使用来源账号作者身份承诺，不从昵称或头像推断。",
      "发布者目录组合联系人、未登记联系人和当前缓存，不建立持久人物索引。",
      "sync-moments 保存当前缓存快照，缓存已淘汰条目会从新快照移除。",
      "target_not_in_current_local_cache 只触发一次同账号手动打开后重试。"
    ],
    problem: "解决朋友圈作者目录不完整、主副号串用、缓存未命中冒充空内容和旧缓存条目长期残留。",
    implementation: [
      "_resolve_moments_subject 强制显式账号，并组合 source-proven self、完整联系人目录和当前缓存发布者。",
      "list_moments 对指定人会扫描完整当前缓存后再应用 limit，避免目标在后部时被错误截断。",
      "moments 返回 target_cached / target_not_in_current_local_cache / account_cache_read。",
      "sync-moments 用当前集合与旧 JSONL 比较 new / updated / removed，输出完整替换快照。",
      "来源指纹只覆盖 sns.db 与 contact.db 元数据；无变化时走快速路径。"
    ],
    flow: [
      "要求明确账号和 self / contact 选择。",
      "从账号身份、联系人目录和当前缓存解析唯一发布者。",
      "在请求窗口内扫描本机 sns 缓存。",
      "投影发布者标签、文字、媒体和 gaps。",
      "一次读取返回有界 JSON；同步则与旧快照比较变化。",
      "写出 current_local_cache_only 状态、清单和最近回执。"
    ],
    concepts: [
      { term: "Explicit account（显式账号）", explanation: "朋友圈不接受 auto；每份结果必须明确属于主号或副号。" },
      { term: "targetCacheStatus", explanation: "目标已缓存、目标不在当前缓存，或正在读取账号整体缓存。" },
      { term: "Current cache replacement（当前缓存替换）", explanation: "刷新后档案准确代表当前可见集合；被缓存淘汰的旧条目不继续冒充可见。" },
      { term: "Source-proven self", explanation: "从配置绑定的账号原生身份推导本人朋友圈作者，不从显示名称猜。" }
    ],
    boundaries: [
      "只读取当前设备缓存，不访问远端朋友圈主页或补历史。",
      "不自动切号、点击、点赞、评论或输入。",
      "联系人/群会话不是完整朋友圈作者目录。",
      "真实朋友圈正文、发布者和媒体不进入网站。"
    ],
    failures: [
      { condition: "没有明确账号", response: "命令返回 moments_explicit_account_required；自然语言入口分别对主副号执行。" },
      { condition: "同名发布者", response: "返回 contact_ambiguous 候选，不按第一项选择。" },
      { condition: "目标不在当前缓存", response: "提示在同一账号手动打开该目标朋友圈后重试，不宣称为空。" },
      { condition: "刷新期间缓存变化", response: "返回 source_changed_during_sync_retry，不提交新的 state。" }
    ],
    sources: [
      { path: "README.md · moments / sync-moments", role: "当前缓存、显式账号与手动补缓存边界。" },
      { path: "wechat_cli.py · _resolve_moments_subject", role: "self、联系人和缓存发布者的唯一解析。" },
      { path: "wechat_cli.py · command_sync_moments", role: "当前集合替换、增删改和导出清单。" },
      { path: "tests/test_wechat_cli.py · moments", role: "身份、缓存未命中、跨账号和淘汰回归。" }
    ],
    verification: [
      "test_moments_self_uses_source_account_identity 验证本人身份来自来源账号。",
      "test_moments_self_cache_miss_requests_same_account_profile_open 验证缓存未命中下一步。",
      "test_moments_rejects_implicit_cross_account_selection 验证不跨账号猜。",
      "test_moments_sync_replaces_items_evicted_from_current_cache 验证快照替换。"
    ],
    relation: "朋友圈与聊天共享账号身份和媒体读取，但拥有独立的缓存范围、对象解析与同步状态，不能用聊天档案替代。"
  },
  {
    slug: "account-source-identity",
    shortTitle: "账号与只读源",
    title: "两个隔离账号、来源身份承诺与只读数据库快照",
    searchAliases: ["微信主号副号怎样防止拿错", "微信主号副号隔离", "微信账号身份承诺", "WeChatDirect只读数据库", "DPAPI微信配置", "微信加密SQLite快照", "WeChatDirect Doctor"],
    searchProjection: {
      intents: ["区分主号副号微信来源", "确认本机 WeChatDirect 环境是否就绪", "只读打开加密微信数据库", "阻止错误账号配置读取"],
      entities: ["accounts.json", "primary", "secondary", "expected_source_identity_sha256", "DPAPI", "SQLCipher", "WAL", "Doctor"],
      relations: ["配置槽位绑定加密配置和本地状态", "来源身份绑定 SHA-256 承诺", "数据库复制到临时快照后查询", "Doctor 只检查入口不打开正文"],
      failureRecovery: ["身份承诺不匹配时读取前停止", "账号目录歧义时停止", "源持续变化时放弃快照", "Doctor 失败只报告当前缺失依赖"]
    },
    teaser: "primary / secondary 只是两个严格隔离的配置槽位；每次读取先核对来源身份承诺，再在临时目录准备通过完整性检查的只读快照。",
    status: "当前无正文 Doctor 成功：Windows、Python 3.14、两个槽位所需文件、加密/压缩依赖和语音解码器可用",
    statusTone: "pass",
    value: "同名联系人、双开微信和本机加密数据库不会因为“看起来像”而串到另一个账号；源数据库也不会为了读取而被改写。",
    why: "主号、副号可能有相同昵称和联系人；真实数据库仍在写入，直接解密查询也可能得到不一致页面。若身份和快照不先闭合，后面的消息再完整也可能来自错账号或半写状态。",
    example: "主号和副号里都有人叫“小王”，我只说一句“别拿错”。工具会先让我确定账号，再核对这个账号与本地资料确实是一套；身份有一点对不上就停，不会因为头像和昵称很像便把两边聊天拼起来。",
    result: "得到一个不暴露身份明文的 accountIdentityCommitment、稳定 snapshot cutoff 和只读连接；Doctor 另行给出平台、Python、依赖、配置文件数量和语音解码器状态。",
    readerStates: {
      pass: "账号槽位、配置载体、本地状态、身份承诺和唯一账号目录一致；临时快照完整性检查通过。",
      problem: "依赖或语音解码器缺失时 Doctor 分项报告；不影响纯文字能力的缺口不冒充整个产品不可用。",
      unavailable: "身份承诺错误、配置无法解密、目录歧义、数据库页/HMAC/WAL 失败或源持续变化时读取前停止。"
    },
    stateLabels,
    decisionImpact: [
      "primary / secondary 是配置身份，不从窗口、头像或昵称推断和修复。",
      "配置不保存微信密钥明文，真实路径与承诺值只留本机。",
      "源数据库与 WAL 不被写入；所有查询发生在临时快照。",
      "Doctor 不打开数据库正文，也不输出路径或密钥。",
      "某个依赖缺失只影响对应能力，例如 voiceDecoder unavailable 不等于文字上下文不可用。"
    ],
    problem: "解决双账号串源、凭据明文、读写源数据库、活动 WAL 导致不一致和把体检冒充真实读取。",
    implementation: [
      "accounts.json 固定两个槽位，每个提供 config_path、local_state_path 和两个来源身份承诺。",
      "Windows DPAPI 解开 Local State 中的本机 AES key，再解开 dbPath、decryptKey 与 myWxid。",
      "load_direct_source_identity 只接受一个与原生身份匹配的 db_storage 账号根。",
      "EncryptedPageCodec 使用 PBKDF2 256000 轮、AES 与 HMAC 准备加密 SQLite 页面并合并已提交 WAL。",
      "快照复制前后比较源文件大小和 mtime，最多 3 次；通过 PRAGMA quick_check 后只读 query_only。"
    ],
    flow: [
      "解析命令行、环境、本地设置或默认 accounts.json。",
      "校验两个账号槽位和必需身份承诺。",
      "使用当前 Windows 用户的 DPAPI 解开本机保护配置。",
      "锁定唯一账号目录并生成身份承诺。",
      "复制或解密数据库，合并 WAL，比较前后签名。",
      "quick_check 通过后以 query_only 打开；任务结束清理临时目录。"
    ],
    concepts: [
      { term: "DPAPI（Windows 数据保护接口）", explanation: "让配置载荷只能由当前 Windows 用户在本机解开，不把密钥明文写入项目。" },
      { term: "Account identity commitment（账号身份承诺）", explanation: "原生微信身份的 SHA-256；验证同一来源而不公开真实 wxid。" },
      { term: "WAL（数据库预写日志）", explanation: "SQLite 尚未合并进主文件的已提交页面；快照需要一并处理才能保持一致。" },
      { term: "query_only", explanation: "SQLite 连接明确禁止写入，所有查询都针对临时快照。" }
    ],
    boundaries: [
      "真实 config、Local State、数据库路径、wxid、解密 key 和承诺值不进入网页或 Git。",
      "只有当前 Windows 用户有权访问的本人设备数据属于来源。",
      "Doctor 证明文件和依赖入口存在，不证明数据库身份或聊天读取成功。",
      "主 CLI 只支持 Windows 和 Python 3.14+。"
    ],
    failures: [
      { condition: "配置或 Local State 不可解密", response: "DirectCredentialError，读取前停止，不输出值。" },
      { condition: "账号目录零个或多个匹配", response: "local source account directory is ambiguous，不猜目录。" },
      { condition: "页面、HMAC、WAL 或 quick_check 失败", response: "SnapshotCopyError / EncryptedPageError，不查询部分快照。" },
      { condition: "源在三次快照期间持续变化", response: "bounded snapshot retries 失败，稍后重试，不写源。" }
    ],
    sources: [
      { path: "accounts.example.json", role: "两个隔离槽位和身份承诺的公开结构。" },
      { path: "wechat_source.py · load_direct_source_identity", role: "DPAPI、配置解密和唯一账号根。" },
      { path: "wechat_source.py · EncryptedPageCodec / DirectWeChatReader", role: "页面解密、WAL、临时快照与只读连接。" },
      { path: "wechat_cli.py · command_doctor", role: "无正文环境体检与局部可用状态。" }
    ],
    verification: [
      "当前 Doctor 返回 success、configuredAccounts=2、所需文件 2/2、依赖与 voiceDecoder available。",
      "test_reader_rejects_wrong_source_identity_commitment_before_reads 验证身份不匹配在正文前失败。",
      "test_account_config_requires_both_identity_commitments 验证两个承诺必需。",
      "test_doctor_is_body_free_and_requires_windows 验证 Doctor 不打开正文且限制平台。"
    ],
    relation: "所有聊天、朋友圈、媒体和归档模块都以这里的账号身份与稳定快照为前提；它只建立可信来源，不拥有聊天语义。"
  },
  {
    slug: "preservation-verification",
    shortTitle: "保全与验真",
    title: "明确窗口保全、完整导出和独立验真",
    searchAliases: ["微信聊天保全包怎样验真", "微信聊天保全包", "preserve微信", "verify-export", "微信导出manifest", "微信媒体哈希", "微信导出完整性"],
    searchProjection: {
      intents: ["保全一段明确微信聊天和媒体", "验证联系人归档是否完整", "验证朋友圈导出是否完整", "核对语音派生文件来源"],
      entities: ["preserve", "verify-export", "manifest.json", "messages.json", "messages.jsonl", "moments.jsonl", "SHA-256"],
      relations: ["保全包绑定一个有界聊天窗口", "联系人导出绑定 state 和 manifest", "媒体记录绑定文件哈希和消息", "派生 WAV 绑定原始 SILK 哈希"],
      failureRecovery: ["目标存在时拒绝覆盖", "临时目录失败时清理", "manifest/state 不一致时验真失败", "媒体路径越界或符号链接逃逸时拒绝"]
    },
    teaser: "preserve 只在用户明确要求时生成自包含窗口；verify-export 不读源数据库，独立重算联系人或朋友圈 v1 导出的身份、文件、数量、哈希和媒体关系。",
    status: "保全包、原子目录、联系人/朋友圈验真、路径 containment 和媒体派生关系均有合成回归",
    statusTone: "pass",
    value: "重要聊天可以留下独立可读、可核对的材料；普通增量档案也能在不重新访问微信源的情况下确认没有文件被换掉或漏写。",
    why: "只复制屏幕截图或一堆媒体会丢失账号、对象、时间、回复与原消息关系；只有文件存在也不能证明清单、状态和媒体仍是一套。",
    example: "我明确要求“把昨晚这段聊天、回复关系和当前能打开的语音做成保全包”。完成后会得到消息、清单和媒体目录；打不开的图片、视频或文件仍留着关系和缺口，只有整包写完整才正式出现，不会把半成品交给我。",
    result: "保全包包含 messages.json、manifest.json 和 media；普通联系人/朋友圈导出可由 verify-export 返回 success 或精确错误列表、记录数和核对媒体数。",
    readerStates: {
      pass: "清单、状态、档案、结构记录、媒体字节、数量和派生关系全部一致。",
      problem: "部分媒体不可打开或语音解码失败时，保全仍保留消息与 gap；验真会明确哪一层不一致。",
      unavailable: "目标已存在、临时目录残留、路径越界、哈希/大小/数量/身份绑定不一致时不宣布成功。"
    },
    stateLabels,
    decisionImpact: [
      "preserve 只由明确保全请求触发，不把普通问答自动升级成证据包。",
      "保全包与 sync 导出是两种产品：前者有界自包含，后者可持续增量。",
      "原始消息先保存；当前可打开的 SILK 语音保留原件，WAV 只是带来源哈希的派生文件。",
      "verify-export 不需要账号配置或源数据库，可以在恢复后独立验真。",
      "任何错误都以列表返回，不能用其余文件通过来掩盖一个不一致。"
    ],
    problem: "解决截图式保全缺关系、半完成目录冒充成品、导出文件被替换、state/manifest 串档和派生媒体失去来源。",
    implementation: [
      "preserve 先调用 context 得到账号、对象、窗口、消息、引用和 gaps。",
      "所有文件写入 <target>.incomplete，完成 messages 与 manifest 后用目录 replace 原子发布。",
      "媒体记录 messageNativeId、mediaId、kind、locatorSha256、bytes、sha256 与 derivedPaths。",
      "verify-export 只接受 wechat-direct-contact-export.v1 与 wechat-direct-moments-export.v1，不把 preserve 当增量导出。",
      "验真限制所有相对路径留在导出根，拒绝反斜杠、冒号、..、绝对路径和符号链接逃逸。"
    ],
    flow: [
      "确认用户明确要求保全或验证哪一个现有导出。",
      "保全先取得有界聊天和精确媒体；验证先读取导出 manifest。",
      "逐个核对账号、对象、范围、记录数、文件大小和 SHA-256。",
      "检查媒体文件、消息关系与语音派生来源。",
      "保全全部写入临时目录后一次发布；验证汇总全部错误。",
      "返回成功清单哈希，或失败字段和可恢复动作。"
    ],
    concepts: [
      { term: "Self-contained bundle（自包含保全包）", explanation: "离开源数据库后仍能理解账号、对象、时间、消息、回复、媒体与缺口。" },
      { term: ".incomplete", explanation: "尚未完成的临时文件或目录；只有全部写完后才原子替换成正式目标。" },
      { term: "Path containment（路径约束）", explanation: "清单里的每个文件都必须解析在导出根内，不能借相对路径或链接逃出。" },
      { term: "Independent verification（独立验真）", explanation: "不打开微信源，只依赖导出本身重算身份绑定、文件和关系。" }
    ],
    boundaries: [
      "保全目标必须由用户明确点名且尚不存在。",
      "verify-export 不接受 preserve 目录，因为两者合同不同。",
      "媒体不可用时保留 gap，不从其他目录补同名文件。",
      "保全成品含真实私人内容，只留本机，不进入网站或 PUBLIC Git。"
    ],
    failures: [
      { condition: "目标或 .incomplete 已存在", response: "拒绝覆盖，先由用户判断旧目录用途。" },
      { condition: "保全过程任一步失败", response: "清理本轮 .incomplete，原目标仍不存在，不留下半成品。" },
      { condition: "导出路径越界或符号链接逃逸", response: "verify-export 返回路径错误，不读取外部文件。" },
      { condition: "哈希、大小、数量、账号或派生关系不一致", response: "返回 failed 和完整 errors，不局部判 PASS。" }
    ],
    sources: [
      { path: "wechat_cli.py · command_preserve", role: "有界自包含保全和原子目录发布。" },
      { path: "wechat_cli.py · command_verify_export", role: "联系人/朋友圈导出独立验真合同。" },
      { path: "tests/test_wechat_cli.py · preservation", role: "消息、媒体、语音派生和 manifest 回归。" },
      { path: "tests/test_public_commands.py · verify-export", role: "路径、身份、哈希、数量和派生关系回归。" }
    ],
    verification: [
      "test_explicit_preservation_bundle_is_self_contained 验证保全自包含。",
      "test_verify_export_accepts_contact_and_moments_without_writes 验证两类导出。",
      "test_verify_export_rejects_fixed_file_symlink_escape 验证路径逃逸失败。",
      "test_verify_export_rejects_cross_account_state 与媒体关系测试验证绑定。"
    ],
    relation: "保全消费“聊天上下文”和“回复与媒体”；verify-export 验证“具名增量归档”和“朋友圈缓存”的正式输出，但不替代源端重放。"
  }
];

export const project = wechatDirectProject;
export const modules = wechatDirectModules;
