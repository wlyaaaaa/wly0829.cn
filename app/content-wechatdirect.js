import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可直接使用", "需要确认", "当前不可用"];

const wechatDirectSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T19:58:00Z",
  label: "有界阅读、完整文本分段与可恢复导出已完善；旧归档数量和缺口保留原日期",
  boundary: "本轮从0.2.1正式源码、Skill与环境合同重建差分，没有读取聊天正文或新增归档。4归档/7934消息与12 PNG仍属于9月14日观察；导出文件存在、包完整性与来源内容完整是三层证据。",
  metrics: [
    { label: "9月14日完成态归档", value: "4 个" },
    { label: "9月14日已保存消息", value: "7934 条" },
    { label: "9月14日物化媒体", value: "12 个 PNG · 语音未见" },
    { label: "独立验真", value: "历史 3/3 · 本轮未重跑" }
  ],
  facts: [
    { label: "当前归档聚合", value: "2026-09-14只读登记导出根的4份manifest/state/last-run：合计7934条消息，4份最近回执success且manifest绑定一致，最新清单修改时间2026-09-10T09:31:53Z。4份均有缺口，unavailableMediaCount合计2329，未标名群成员消息合计1925，unknownSenderCount为0。文件元数据共12个PNG，未见原始语音或派生WAV；未读消息、联系人或媒体内容，也未新跑verify-export。9月1日6032条、3个语音+3个派生及3/3验真的历史证据不改写为本次结果。" },
    { label: "当前公开版本", value: "WeChatDirect v0.2.1，PUBLIC main 53b7c0b1b460a26a4b04db8d5f0d2278f97dbc36。已安装入口为E:\\Projects\\Tools\\WeChatDirect\\.venv\\Scripts\\wechat-direct.exe；本轮只读源码与已登记入口，不把安装、环境检查或包存在当成真实会话已经读取。", hero: false },
    { label: "当前环境体检", value: "doctor --environment-only不读取账号设置，分别检查文字、图片/WXGF、语音和实际执行身份；主路线Python3.14，语音通过Python3.11、pilk与FFmpeg/ffprobe。环境可用不是账号资料可读，9月14日两个账号槽位的旧体检保留原日期。" },
    { label: "聊天读取边界", value: "一次只解析一个明确联系人或群的有界窗口；最多扫描 500 条、返回 80 条，保留消息方向、群成员标签、回复目标、媒体关系、实际时间范围与可见历史缺口。" },
    { label: "先发现值得阅读的变化", value: "changes按明确起止时间，从primary、secondary或both的当前SessionTable读取会话候选，不读正文、不复制库。两个账号分列，保留隐藏会话、时间未知项及扫描后继续变化的项，不以条数截断；完整只针对当前会话表，不证明已消失会话或旧消息修订都已检测。" },
    { label: "只看本人参与", value: "context --self-only先按原生发送者筛出本人及归属未定的消息，再解码正文；游标继续固定同一筛选。适合先找自己在大群说过什么，但不等于已读全群；需要别人的前后回应时，再用普通context --around补读。" },
    { label: "具名自动增量", value: "sync-contact 首次保存该对象当前设备可见的完整本地历史；之后同一命令用来源指纹、增量游标和默认 1 天重叠窗口合并变化，不建立全账号同步或后台任务。" },
    { label: "分页与零命中", value: "context 用 continuation 固定账号身份、聊天、时间上界和搜索条件；not_found_in_page 只说本页未命中，读尽范围才能报告窗口未命中，无法解析的正文保持 indeterminate_content_gaps。around 先取离锚点最近的消息，再按时间排序。" },
    { label: "有限网络物化", value: "context 只读本机；显式 export-context / media-open 可使用该条表情消息已有的原生 CDN，核对 MD5、大小与图片解码。--local-only 可禁止网络；归档与保全不自动补取远端表情，不搜索或拼造地址。" },
    { label: "发送方向与消息含义", value: "发送者只按消息所在分片的Name2Id与账号原生身份承诺解释，含@openim非文字消息；长serverId/nativeId以字符串返回。转账、红包、位置分享和系统模板按原生结构投影；撤回只表示发生撤回，不恢复正文。“拍一拍”归为system（系统事件），不计成本人撰写的发言或校准样本。" },
    { label: "回复与媒体", value: "图片、表情、语音、视频和文件都保留每次出现的位置与原消息关系；图片按原生 MD5 / hardlink.db 定位并解码，表情可保留动画，视频和文件仅交付本机原生索引能精确定位的字节。找到路径、可物化与实际可读分别表示。" },
    { label: "输出与验真", value: "export-context与preserve可保留选定窗口完整文本和可用媒体；packageCreated及exit0只证明包生成，必须另看status、delivery、引用媒体/失败WAV和hasMore。partial仍可使用与验真；verify-export不补齐源内容、不把缺失附件说成完整。" },
    { label: "实现规模", value: "2026-09-09核对3faf4d2：28个跟踪文件、7个非测试Python模块、14个tests/*.py与10个公开命令，包含changes及export-context。来源投影与上下文43项/6子测试通过，耗时0.85秒；changes另2项通过，耗时0.49秒；9月7日137项/32子测试仍为原全套证据。主CLI用Python3.14，语音派生默认Python3.11+pilk。", hero: false },
    { label: "注意力边界", value: "日常默认只给 AI 最近最多 80 条、128 KiB 的 ai-context.md；更早事实只搜索 context.md 或 messages.jsonl 的命中附近，不把整份档案反复塞入模型。", hero: false },
    { label: "运行形态", value: "项目直接读取本机数据库快照，不依赖 WeFlow、HTTP helper、第二数据库、服务、队列、daemon、watcher 或计划任务。", hero: false }
  ],
  gaps: [
    "本次网页快照没有读取任何真实微信聊天、朋友圈正文或媒体，也没有运行一个具名联系人的现场 E2E；源码、Doctor 和合成回归不能证明当前某段真实历史完整可读。",
    "当前设备可见的本地数据库和朋友圈缓存不是微信远端全历史；旧消息、已清缓存媒体或未缓存朋友圈目标可能真实存在但本轮不可见。",
    "图片、表情、视频和文件只有原生索引、内容身份及实际解码通过才交付；WXGF 复杂分区或透明度关系无法证明时保留缺口，不把首帧冒充完整动图。WeChatDirect 的语音 WAV 派生与 ChineseASR 的转写仍分开。",
    "新导出替换有同级.wechat-transaction与recover-export检查/rollback/complete；两个目录重命名仍有崩溃窗口，不是全文件系统原子事务。未知旧.sync.lock、外来文件或身份冲突不能直接删除；已提交事务不回滚成旧版，硬断电和真实客户端恢复仍另验。"
  ]
});

export const wechatDirectProject = {
  order: 19,
  slug: "wechat-direct",
  usageEntry: "说出微信主号或副号、联系人或群及要弄清的问题；最近变化先查看候选会话，长期保存才对一个具名对象执行归档。",
  usageInputs: ["微信账号和要看的联系人或群", "记得的时间、原话或回复线索（如有）", "要一次阅读还是长期归档的选择"],
  title: "WeChatDirect",
  route: "/projects/wechat-direct",
  visibility: "公开仓库",
  repositoryUrl: "https://github.com/wlyaaaaa/WeChatDirect",
  statusTone: "mixed",
  cardStatus: "长文本可读完整，导出缺口可见；中断恢复与定向补媒体已有入口",
  cardStatusTone: "pass",
  ...wechatDirectSnapshot,
  kicker: "读懂微信上下文，需要时保留完整对话材料",
  searchAliases: [
    "WeChatDirect是什么",
    "微信上下文和具名归档",
    "Windows本地只读微信工具"
  ],
  repositoryNote: "源码位于 PUBLIC（公开）仓库 wlyaaaaa/WeChatDirect。页面公开产品设计、命令、数据结构、实现、测试、失败和当前无正文环境体检；不读取或展示真实聊天正文、朋友圈正文、联系人身份、媒体原件、数据库位置、解密材料、账号承诺值、导出目录或凭据。",
  summary: "想知道群里最后怎么决定的、那句“可以”回复了谁，或附件属于哪条消息时，它读取指定微信对话的必要前后文，把文字、引用、语音、图片和文件对应起来。需要长期保存才维护这个联系人或群的归档。导出缺了哪些媒体会直说，中断先查原记录，后来下载好的附件可以定向补，不必重扫整个账号。",
  why: "微信里的工作事实常分散在文字、引用回复、图片、语音和文件之间。只复制几句文字会丢掉“回复的是谁、附件属于哪条消息、当前窗口是不是完整历史”；同时有主号和副号时，按名字随便选一个账号还可能拿错来源。这个项目先把账号、对象、时间范围和原件关系钉牢，再让 AI 处理少量真正相关的内容。",
  plainExample: "我可以问：“项目群里对方最后确认的交付时间是什么？顺便告诉我那句‘可以’到底在回复哪条。”工具会先确认是主号还是副号里的哪个群，再只读取够回答问题的一小段聊天；最后把时间、说话人、原回复和能否打开的语音一起交回来，找不到唯一对象或附件打不开就明说，不拿相邻文件猜。",
  result: "问一次聊天问题时，得到账号、对象、时间、说话人、原回复和可用附件所在的小段上下文；明确归档时，得到这个联系人或群的本机可见历史、后来变化和缺口。文件做出来、附件能打开、导出能独立验真与微信远端历史完整是不同结果；中断先检查原归档，不扩成全账号重扫。",
  readerStates: {
    "pass": "一次问题只交回这个账号和对象实际读到的小段，不冒充全历史。具名归档即使没有新消息，也会先检查已保存文件确实仍完整。",
    "problem": "账号或对象重名、回复超出窗口、附件打不开或来源正在变化时说明候选与缺口，只扩大真正影响答案的范围。",
    "unavailable": "账号身份、本机聊天来源或已有导出无法核对时停下受影响读取，保留旧包和恢复位置；不猜另一个账号或覆盖不同内容。"
  },
  stateLabels,
  methodCanvas: {
    "kicker": "从微信问题到可核对结果",
    "headline": "先确认是哪一个账号和对象，再读够回答问题的聊天",
    "description": "普通提问只读一段必要上下文；明确要长期保存才给一个具名联系人或群建档。文字、回复、媒体和朋友圈都只说明本机实际可见范围。",
    "steps": [
      {
        "actor": "问题范围",
        "title": "锁定这次要问的人和事",
        "detail": "点名主号或副号、联系人或群，以及记得的时间或原话；普通问题不先保存整个账号。"
      },
      {
        "actor": "账号身份",
        "title": "同名时先分清",
        "detail": "只有唯一对象才继续；朋友圈始终要明确账号，不靠昵称或头像猜。"
      },
      {
        "actor": "本机读取",
        "title": "从稳定的本机副本看聊天",
        "detail": "先确认资料能可靠读取，不改动微信自己的数据库；来源边读边变化就停下。"
      },
      {
        "actor": "还原关系",
        "title": "把原回复和附件放回消息旁边",
        "detail": "保留谁发的、回复哪一句、图片或语音属于哪条；打不开的文件照样说明缺口。"
      },
      {
        "actor": "按用途交付",
        "title": "回答一次，或更新一个具名档案",
        "detail": "一次问题只给小窗口；长期保存才交出当前电脑可见的对象历史，之后只合并真正变化。"
      },
      {
        "actor": "验真与继续",
        "title": "文件和缺口都核对",
        "detail": "已有导出能离线确认有无被换掉；中断或媒体后来可用时只处理这一个归档。"
      }
    ],
    "columnsAriaLabel": "用户、WeChatDirect 与来源边界",
    "columns": [
      {
        "title": "本人决定",
        "note": "账号、对象与保存范围",
        "items": [
          "点名要看哪个账号、联系人或群",
          "选择只回答一次、长期归档或做明确保全",
          "必要时选择是否看媒体、扩大窗口或重新核对旧历史"
        ]
      },
      {
        "title": "项目负责",
        "note": "真实关系与可恢复结果",
        "items": [
          "核对账号身份并只读本机可见聊天",
          "保留消息顺序、发送者、回复和附件关系",
          "交出能独立核对的归档和实际缺口"
        ]
      },
      {
        "title": "不越过的范围",
        "note": "不猜也不代操作微信",
        "items": [
          "不自动登录、切号、点赞或补远端历史",
          "不默认同步整个账号或建立中央人物库",
          "不按昵称、文件名或 AI 猜测给消息和附件定身份"
        ]
      }
    ]
  },
  productPrinciples: [
    {
      "title": "先点名对象，再读聊天",
      "detail": "一次只看一个账号里的一个联系人或群；重名时先分清，不靠看起来最像决定。"
    },
    {
      "title": "小问题先用小窗口",
      "detail": "问一次事实只读够回答的一段；长期保存一个对象要本人明确提出，不做默认全账号同步。"
    },
    {
      "title": "聊天关系比摘要重要",
      "detail": "谁说的、回复哪句、附件在哪条消息上，都可能改变意思；先还原这些关系，再交给 AI 判断。"
    },
    {
      "title": "本机看见多少就说多少",
      "detail": "电脑聊天与朋友圈缓存不是微信远端全部历史，未命中只说明这次实际范围。"
    },
    {
      "title": "再次执行只合并实际变化",
      "detail": "同一具名归档可更新，不常驻后台；来源没变也会检查已导出文件是否仍完整。"
    },
    {
      "title": "缺口跟结果一起交",
      "detail": "附件打不开、回复缺失或说话人未定都会列出，不为了漂亮摘要静默丢掉。"
    },
    {
      "title": "附件必须真能打开",
      "detail": "先证明文件属于这条消息，再看真实格式和内容；动画、缩略图与原件不同，不能拿邻近文件顶替。"
    },
    {
      "title": "归档可在离开微信后核对",
      "detail": "文本、附件和清单要互相对应；只有文件存在，不代表这些材料没有变化或缺失。"
    },
    {
      "title": "注意力留给当前问题",
      "detail": "AI 默认读少量相关消息，旧事实沿命中位置补上下文，不把整段历史塞给一次问答。"
    },
    {
      "title": "失败先保留原归档",
      "detail": "账号不符、来源变化或文件状态冲突时不覆盖已保存内容，按真实原因重试、重核或补缓存。"
    },
    {
      "title": "包做出来不等于内容齐全",
      "detail": "可打开的文件之外，仍可能缺语音、图片或引用；交付先说明实际覆盖，再谈是否完整。"
    }
  ],
  responsibilities: [
    "只读一个明确联系人或群的相关聊天，并说明这次真正覆盖的时间。",
    "区分主号和副号；同名或多处匹配时列出候选，不自作主张选一边。",
    "按原顺序保留谁说的、群成员、回复目标和每个附件属于哪条消息。",
    "图片、语音、视频和文件能打开才给实际内容；打不开也保留消息关系与缺口。",
    "明确要求长期保存时，只给一个具名对象建立本机可见历史，并在之后合并变化。",
    "按明确账号读取当前电脑已缓存的朋友圈，不当成远端全部历史。",
    "为重要聊天做可核对的保全包，并能在不重读微信的情况下检查已有导出。",
    "账号、来源、附件或归档状态有问题时说明失败位置与继续办法。"
  ],
  exclusions: [
    "不修改微信自己的数据库，也不自动登录、切号、联网补旧消息或点赞评论。",
    "不默认保存整个账号，也不建立后台同步、第二份聊天数据库或中央人物画像。",
    "昵称、头像、群名或附件文件名不能代替账号、消息与媒体身份。",
    "这次窗口里没看到本人发言，不等于从未发言；电脑没缓存朋友圈，也不等于对方没发布。",
    "打不开的附件、未知类型或通话状态不伪装成普通文字和语音文件。",
    "公开网页不展示真实聊天、朋友圈、联系人、媒体或解密材料。",
    "语音能读取不等于已经转成文字；需要转写时交给 ChineseASR。",
    "代码、环境检查和合成测试不证明这次已成功读取真实会话。",
    "已知中断可以按原记录恢复；不能声称所有崩溃都能自动续，也不把档案写回微信。"
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
  operatingFlow: [{"title": "先锁定账号与对象", "detail": "同名对象不能靠猜；需要补最近变化先列候选，再选一个会话读必要前后文。"}, {"title": "把对话关系读完整", "detail": "本机只读快照还原消息顺序、发送者、原回复和可打开媒体，未知身份与附件缺口一起交回。"}, {"title": "按用途决定是否保存", "detail": "一次问题只返回小上下文；明确长期保存才维护这个联系人或群的全文与增量档案。"}, {"title": "中断按原记录恢复", "detail": "核对原事务和已有归档；后来可用的媒体可定向补，不把一个对象的缺口变成全账号重扫。"}],
  technicalOperatingFlow: [
    { title: "先发现变化，再选定本次要读什么", detail: "要补最近变化时，changes只列当前会话候选及时间缺口；选定对象后再读context。想先看自己在大群说过什么，可筛本人参与，再围绕命中补对方回应。只有明确要长期保存一个联系人或群，才走sync-contact。" },
    { title: "解析唯一账号和对象", detail: "聊天的 auto 会在两个隔离槽位中寻找唯一匹配；朋友圈始终要求明确 primary 或 secondary。多匹配或不匹配直接返回。" },
    { title: "准备稳定的只读快照", detail: "直接读取本机配置中的加密来源，复制并解密到临时目录、合并数据库写入日志，再做完整性检查和只读查询；源持续变化就停止。" },
    { title: "还原消息与媒体语义", detail: "解析正文、发送者、群成员、引用目标和媒体关系；控制载荷、未知类型和不可打开项目都保留为明确缺口。" },
    { title: "生成小上下文或档案", detail: "一次问题返回有界结构结果；归档同时生成给 AI 的小窗口、人类完整档案、结构记录、当前可打开语音、增量状态与完整性清单。" },
    { title: "再次执行只合并变化", detail: "来源未变时不重新扫描源库消息，但仍核对已导出全文、结构记录、清单和状态绑定；变化时按排序游标或默认 1 天时间重叠抓取。当前可打开的媒体按内容哈希复用，出现位置不被去重抹掉。" },
    { title: "完整性清单先于增量状态", detail: "先在候选目录准备并验证替换结果，保存同级事务记录，再执行目录替换；两次重命名不称全局原子。清单与状态一致后才成为新续作点，异常先检查recover-export而不是删除锁。" },
    { title: "需要时验真、重核或补缓存", detail: "已有导出可以独立重算哈希和数量；旧历史或媒体缺口显式执行全量重核；朋友圈未缓存时只提示在同一账号手动打开目标后重试。" }
  ],
  components: [
    { name: "wechat-direct Skill", responsibility: "把聊天问题、单对象归档、朋友圈和保全请求路由到正确命令。", implementation: "普通问题先读最小窗口；归档权限只覆盖用户点名的一个联系人或群，语音转写转交 ChineseASR。" },
    { name: "wechat_cli.py", responsibility: "提供有界聊天、长字段分段、具名归档、便携阅读包、环境检查、媒体定向修复与离线验真。", implementation: "CLI按字节和消息范围限制输出，message-part沿原哈希/偏移续读；写出保留候选、前像和同级事务，recover-export检查后明确选择完成或回滚，不把包生成和来源完整混同。" },
    { name: "wechat_source.py", responsibility: "直接读取 WeChat 本机加密 SQLite 与缓存，并恢复消息、联系人、群成员、朋友圈和媒体关系。", implementation: "DPAPI只在本机打开配置，临时解密SQLite并验证WAL校验和，仅合并已提交前缀；query_only查询，不向源库checkpoint或修改WAL。来源改变拒绝拼接不同版本。" },
    { name: "voice_decode.py", responsibility: "把精确绑定的 WeChat SILK 语音派生为 WAV。", implementation: "独立 Python 3.11 + pilk 路径；原始 SILK 不被替换，WAV 记录 derivedFromSha256。" },
    { name: "accounts.json", responsibility: "保存 primary / secondary 两个隔离槽位的本机来源入口与身份承诺。", implementation: "不保存微信密钥明文；真实文件留在本机并限制 ACL，示例只提供占位结构。" },
    { name: "联系人导出", responsibility: "保存一个对象的可搜索全档、AI 小上下文、结构记录、当前可打开媒体、清单、状态和运行回执。", implementation: "messages.jsonl 是合并事实层；context.md 面向人；ai-context.md 最多 80 条和 128 KiB；当前可打开的语音按 SHA-256 去重复用，其他媒体保留关系与缺口。" },
    { name: "朋友圈导出", responsibility: "保存一个明确账号当前本机可见的朋友圈缓存快照。", implementation: "重复刷新会加入、更新或删除与当前缓存不再一致的条目；状态始终写明 current_local_cache_only。" },
    { name: "WeChatDirect-private-archive（公开前历史档案）", responsibility: "只保存公开版本形成前的历史与迁移依据；该 PRIVATE 仓库已经归档。", implementation: "它不生产当前读取、具名归档、增量或恢复行为，也不再是现役消费者或独立项目卡。现在这些能力只由 PUBLIC WeChatDirect 负责。" },
    { name: "测试与公开命令合同", responsibility: "验证来源读取、CLI、公开 Doctor/验真、增量、回复、媒体、账号隔离和恢复边界。", implementation: "14个测试模块；9月7日全套137项/32子测试，9月9日定向45项/6子测试；它们使用合成数据，不包含真实聊天正文。" }
  ],
  usageExamples: [
    { ask: "最近一周哪些聊天有变化？先看看我在大群里参与了什么。", effect: "先按明确账号列当前会话候选，再对选定群筛本人及归属未定的消息；引用目标保留，需要他人回应时围绕时间补读。候选发现不会自动变成全账号正文采集。", moduleSlug: "bounded-chat-context" },
    { ask: "查一下对方上次在微信里确认的交付时间。", effect: "只读取这个联系人或群里够回答问题的一小段，保留谁发给谁和实际覆盖时间；没找到就说明查到了哪里，不自动翻完整个账号。", moduleSlug: "bounded-chat-context" },
    { ask: "把这个项目群持续保存下来，以后只补新增内容。", effect: "第一次保存当前设备可见的完整本地历史；以后重复同一命令自动合并新增或更新消息，并保留增量游标、来源指纹和运行回执。", moduleSlug: "named-chat-archive" },
    { ask: "他这句“可以”回复的是哪条？语音和附件关系也一起核对。", effect: "沿微信原本的回复关系找到被引用消息；当前能精确打开的语音会保留原件并生成可播放版本，其他附件只报告属于哪条消息和为什么暂时打不开。", moduleSlug: "reply-media-relations" },
    { ask: "看看副号里这个人最近发的朋友圈。", effect: "只读取我点名的副号和这台电脑当前已经缓存的内容；没缓存时提示我在同一个账号里手动打开对方主页后再试，不假装访问了远端完整主页。", moduleSlug: "moments-local-cache" },
    { ask: "主号和副号都有同名联系人，别拿错。", effect: "自动账号选择会返回两个候选并停止；账号身份、联系人原生身份和已有档案状态必须一致，不能按昵称、头像或窗口猜。", moduleSlug: "account-source-identity" },
    { ask: "把昨晚这段聊天、引用关系和当前能打开的语音做成一份保全包。", effect: "生成可独立核对的消息、附件和清单；原始语音与可播放版本分开记录，暂时打不开的图片或文件仍列为缺口。", moduleSlug: "preservation-verification" },
    { ask: "上次完整归档以后又有新消息，怎样继续？", effect: "再次保存同一个对象时，会从最后一次完整结果继续合并新增和更新；账号、来源或旧档案对不上就停止，第一次崩溃留下的半成品也不会冒充可续跑状态。", moduleSlug: "named-chat-archive" },
    {
      "moduleSlug": "named-chat-archive",
      "ask": "这个已保存的聊天里有几条语音后来才下载好，只补这些附件，别重扫全历史。",
      "effect": "对同一账号、对象和归档定向repair-media，可再限定消息和类型；复用本地缓存或派生WAV，保留还未取得的缺口，不去CDN补全整个账号。"
    },
    {
      "moduleSlug": "bounded-chat-context",
      "ask": "这条很长的消息别只给我开头，把这一条读完整，旁边无关聊天不用展开。",
      "effect": "先取有界上下文，再按返回的分段位置续读同一条消息，核对完整文字哈希；消息中途变化则重新读取，不拼接两个版本。"
    },
  ],
  evidenceLayers: [
    { layer: "PUBLIC source（公开源码）", proves: "当前正式源码包含context、message-part、export-context、具名同步、repair-media、recover-export、环境Doctor、临时会话检查与verify-export；机制存在不替代真实账号读取。", doesNotProve: "当前某个真实联系人、群、朋友圈或媒体现在可读。" },
    { layer: "README + Skill（使用合同）", proves: "普通问题、单对象归档、朋友圈、媒体与明确保全的自然语言路线和禁止项已说明。", doesNotProve: "文档本身不能替代代码行为或现场结果。" },
    { layer: "9月7日137 tests + 32 subtests；9月9日45 tests + 6 subtests", proves: "合成数据下的身份冲突、回复、媒体、缓存、增量、原子提交、快速路径完整性、来源漂移和导出验真回归通过。", doesNotProve: "真实微信版本、真实本机数据库结构、当前私有正文或媒体完整性。" },
    { layer: "Doctor（无正文环境体检）", proves: "环境检查分别说明文字/图片/WXGF/语音及实际解释器身份；本次未读取账号设置或重测所有真实媒体。", doesNotProve: "Doctor 不打开数据库，也不证明账号身份承诺、聊天正文或现场导出成功。" },
    { layer: "Git Owner（Git 事实责任方）", proves: "PUBLIC main=3faf4d2，2026-09-09默认分支、远端、工作树和发布身份回读一致。", doesNotProve: "Git 同步不能证明当前 WeChat 客户端、缓存或个人内容状态。" },
    { layer: "Live named-object E2E（具名对象现场验收）", proves: "只有用户点名对象后的真实 context / sync / media / verify 回执，才能证明该次本地可见范围和输出。", doesNotProve: "一个对象成功不能证明全账号或微信远端全历史完整。" }
  ],
  evolution: [
    {
      "date": "2026-08-30",
      "title": "把几句聊天还原成可理解的上下文",
      "commit": "",
      "result": "明确账号、对象、时间和回复关系，文字与媒体关联保留；需要完整具名历史时才沿那个对象归档，不默认扫描全账号。",
      "evidence": [
        {
          "date": "2026-08-30",
          "note": "旧私有库仅保留公开前历史；当前读取、具名归档、媒体和恢复由公开实现承接。",
          "commit": "7f9488f—7da69ae"
        }
      ]
    },
    {
      "date": "2026-09-01",
      "title": "没有新消息也要确认旧材料仍完整",
      "commit": "",
      "result": "无变化返回前核对归档记录与媒体，读取成功、媒体可用和历史覆盖分别给证据，不拿一个空窗口推断全局结论。",
      "evidence": [
        {
          "date": "2026-09-01",
          "note": "无变化返回前仍核对已保存归档，媒体缺口与崩溃续作边界分开。",
          "commit": "4883536"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "title": "长消息、缺媒体和中断都能继续处理",
      "commit": "53b7c0b",
      "result": "长文本按同一版本分段，导出明确部分完成；已知中断与后来补齐的本地媒体有定向恢复入口，不用重跑全账号或覆盖外来修改。"
    }
  ],
  operationalEntrypoints: [
    { name: "发现变化候选", command: "wechat-direct changes --account both --since \"<起始时间>\" --until \"<固定截止时间>\"", purpose: "只读当前会话表并按账号分列候选；不读取正文、不承诺所有历史修订均被检测。" },
    { name: "本人参与筛选", command: "wechat-direct context --account primary --contact \"<群>\" --self-only", purpose: "先按原生身份读取本人及归属未定项，仍保留分页和引用；对方回应需普通around上下文补读。" },
    { name: "聊天上下文", command: "wechat-direct context --account auto --contact \"<联系人或群>\"", purpose: "读取一个有界窗口并返回发送者、回复、媒体、实际范围和缺口。" },
    { name: "具名增量归档", command: "wechat-direct sync-contact --account primary --contact \"<联系人或群>\"", purpose: "首次保存完整本地历史，之后同一命令可重放增量。" },
    { name: "补充重核入口", command: "wechat-direct sync-contact --account primary --contact \"<对象>\" --full-reconcile", purpose: "这是 sync-contact 的显式补充模式：旧历史变化、游标重置、无时间记录或历史语音后来可用时重新核对该对象。" },
    { name: "朋友圈缓存", command: "wechat-direct moments --account primary --contact \"<联系人>\"", purpose: "读取明确账号当前本机缓存，不访问远端主页。" },
    { name: "朋友圈快照", command: "wechat-direct sync-moments --account primary --self", purpose: "建立或刷新明确账号当前本机可见的朋友圈缓存快照；被缓存淘汰的条目会从刷新结果移除。" },
    { name: "跨项目阅读包", command: "wechat-direct export-context --account primary --contact \"<对象>\" --output \"<新目录>\" [--local-only] [--html]", purpose: "交付同一有序消息页、媒体和引用；可用 continuation 继续同一查询，HTML 不参与默认 AI 阅读依赖。" },
    { name: "精确消息媒体", command: "wechat-direct media-open --account primary --locator \"<media-locator>\" --output \"<文件>\" --local-only", purpose: "只物化该消息原生定位的媒体，目标必须不存在；报告实际格式、质量、local/remote、字节与哈希。" },
    { name: "明确保全", command: "wechat-direct preserve --account primary --contact \"<对象>\" --lookback-days 1 --output \"<目录>\"", purpose: "生成一个自包含聊天窗口、回复关系、媒体和哈希清单。" },
    { name: "无正文环境体检", command: "py -3.14 wechat_cli.py doctor", purpose: "检查平台、Python、依赖、配置入口和语音解码器，不打开聊天数据库或输出路径。" },
    { name: "导出验真", command: "wechat-direct verify-export --output \"<导出目录>\"", purpose: "不打开源数据库，重算 v1 联系人或朋友圈导出的清单、状态、文件和媒体关系。" },
    { name: "开发回归", command: "py -3.14 -m pytest -q", purpose: "这是源码验证入口，不是产品命令；运行当前合成回归；本页保留2026-09-09定向45项与6个子测试通过证据，不读取真实微信数据。" },
    {
      "name": "无账号环境检查与临时会话检查",
      "command": "wechat-direct doctor --environment-only; wechat-direct temp-status --root <本任务临时根>",
      "purpose": "先排除环境依赖问题，不读账号；临时清理另需精确非活动会话及--clean，不跨任务清扫。"
    },
    {
      "name": "具名导出恢复与本地媒体补全",
      "command": "wechat-direct recover-export --output <明确归档>; wechat-direct repair-media --account <账号> --contact <对象> --output <同一归档>",
      "purpose": "前者默认只检查，明确complete/rollback才改变；后者只尝试本地媒体，不重扫历史或调用CDN。"
    },
  ],
  snapshotUpdateNote: "2026-09-14只读刷新归档规模与Doctor（环境体检）：2个账号配置有效、依赖和语音解码器可用。9月9日changes候选发现、本人参与筛选、群内精确引用、原生系统事件及45项/6子测试仍保留原日期；本轮未打开聊天数据库、读取私人正文或执行归档同步。",
  "readerBoundary": "本机缓存和一次消息窗口不等于完整历史。长消息按同一版本继续读；朋友圈缺缓存不表示没有内容，生成材料包也不表示所有原媒体已经齐全。",
};

export const wechatDirectModules = [
  {
    slug: "bounded-chat-context",
    usageEntry: "说明账号、联系人或群，以及要问的那段微信事实。",
    usageInputs: ["微信账号和要看的联系人或群", "时间、关键词或本人参与线索（如有）"],
    productFlow: [{"title": "系统核对并处理", "detail": "先从会话变化或本人参与定位小范围，再读足够前后文和原回复，不导出整个账号。"}, {"title": "交付与接续", "detail": "交回说话人、时间、回复及媒体缺口；对象不唯一或范围不足时停下补线索，不猜是谁。"}],
    shortTitle: "聊天上下文",
    title: "只读一个明确对象的最小有用聊天上下文",
    searchAliases: ["查某个人上次在微信说了什么", "查微信聊天上下文", "微信关键词附近消息", "微信小窗口不是全历史", "微信消息谁发的", "微信群成员标签", "微信聊天实际时间范围"],
    searchProjection: {
      intents: ["读取一个明确联系人或群的近期微信上下文", "按关键词或时间定位消息附近", "判断当前窗口有没有看到本人发言", "保留小窗口与全历史的边界"],
      entities: ["changes", "context", "--self-only", "primary", "secondary", "auto", "senderRole", "returnedSenderRoleCounts", "availableHistoryHint"],
      relations: ["账号槽位绑定一个来源身份", "联系人或群绑定一个原生会话", "返回消息属于有界请求窗口", "窗口发送者计数不代表全历史"],
      failureRecovery: ["多账号多对象匹配时返回候选", "关键词未命中时不扩大到全账号", "窗口为空时返回可见历史提示", "输出超过 512 KiB 时缩小请求范围"]
    },
    teaser: "先用changes发现当前变化候选，再对明确对象读取有界上下文；可以先筛本人参与，缺少他人回应时再补读。",
    status: "9月9日来源投影、上下文与候选发现45项及6子测试通过，Doctor成功；真实具名会话未读取",
    statusTone: "mixed",
    value: "问一句微信事实时，不需要先导出整个账号。要补最近变化，可以先按明确账号与时间列出当前会话候选，再选要读的联系人或群；时间未知和扫描后又变化的会话也会保留，不把漏项说成无变化。要先找自己在大群说过什么，可筛本人及归属未定的发言，继续带着同一筛选翻页；需要别人的回应时再围绕命中补读。最终得到带账号、对象、时间、引用与附件关系的上下文，账号不明确或来源不可读就保留缺口。",
    why: "一条消息的含义可能取决于谁发的、回复哪条、附件是什么，以及当前窗口是不是完整历史。只按关键词抄一句，容易把群成员、本人、系统消息和引用目标混在一起。",
    example: "我问“项目群里最后是谁同意周五交付？”工具只翻这个群里够回答问题的一段，把说话人、时间和那句回复指向的原消息一起给我；主号、副号里都有同名群时，它先列候选，绝不蒙一个。",
    result: "交回这次确实读到的一小段聊天：账号、联系人或群、时间范围、说话人、原回复和附件可用性。若只有小窗口或有遗漏，会说明实际范围，不能当整段历史。",
    readerStates: {
      pass: "账号和对象唯一，窗口可读，影响问题的发送者、引用和媒体关系都已返回。",
      problem: "对象重名、引用目标在窗口外、群成员标签不全或媒体打不开时，保留候选和缺口，并只扩大必要范围。",
      unavailable: "账号配置、身份承诺、本地消息库、时间索引或输出边界不成立时停止，不换来源补猜。"
    },
    stateLabels,
    decisionImpact: [
      "coverage.hasMore 与 continuation 决定是否还需续查；游标固定账号、聊天、时间范围和搜索条件，每次调用仍是独立本地快照，不宣称历史跨页永不变化。",
      "not_found_in_page 不等于请求窗口未命中；末页 not_found_in_remaining_window 只说明剩余范围，存在正文解码缺口时不能说从未说过。",
      "coverage.returnedAllScanned 明确展示是否包含所有扫描消息；关键词附近的小窗口不是完整历史，continuation.purpose 分开继续找命中与普通翻页。",
      "聊天默认从最小窗口开始，不先创建全量档案。",
      "auto 只有唯一匹配时才选择账号；多匹配必须由用户决定。",
      "返回窗口的 self=0 只表示这段没有观察到本人消息，不代表全历史没有。",
      "空窗口仍说明当前会话是否存在更早或更新的本地可见消息。",
      "私聊与群聊引用目标均可按原生server id精确回查；源中缺失或无法读取时仍保留缺口，不保证全部回复都能补回。",
      "只有会改变答案的媒体才需要进一步打开或转写。"
    ],
    problem: "解决错账号、错对象、截断上下文、发送者混淆、小窗口冒充全历史和附件关系丢失。",
    implementation: [
      "changes固定discovery.requestedWindow.untilS；按明确primary/secondary/both独立读取当前SessionTable，保留隐藏会话、时间未知项和observed_after_until候选。completeScope只覆盖当前表，historicalChangeDetection明确不检测已消失会话、旧消息补入/撤回、正文或标签修订。",
      "--self-only在fetch_messages解码前按当前分片发送者方向筛self/unknown，selectionScope与coverage.senderScope均为self_messages_and_unresolved_senders。v2游标绑定selfOnly，续查不能改变筛选；v1普通游标继续兼容。引用目标按原生ID补取，不把筛选结果当作全群上下文。",
      "_resolve_contact 在 primary / secondary 槽位中按当前联系人目录解析唯一对象，contact_ambiguous 返回公开安全候选。",
      "_context_result 校验扫描与返回上限，按 since / until / lookback / around / contains 形成有界窗口。",
      "_sender_receipt 保留 self、other、system、unknown 与群成员标签；文件传输助手只加标签，不改写原生角色。",
      "返回 scannedSenderRoleCounts、returnedSenderRoleCounts、selfObservation、availableHistoryHint 与 gaps。",
      "Canonical JSON（规范 JSON）计算 manifestSha256；超过 512 KiB 直接 context_output_too_large。",
      "context --byte-limit限制32–512KiB终端JSON，普通continuation负责其余消息；segmentedFields仅是长字段预览，message-part绑定同一显式账号/对象、偏移和whole-text hash续读。source_changed要求重新context，不能跨版本拼接；便携export-context仍保存选定全文。",
    ],
    flow: [
      "读取两个隔离账号槽位的公开安全配置结构。",
      "解析唯一联系人或群，失败时返回未命中或候选。",
      "按请求时间与上限读取一个本地快照；--around 优先取最靠近锚点的消息，再按时间排序，续查上界固定但每页快照独立。",
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
      "changes完整不等于历史变化完整；self-only完整不等于全群上下文完整；精确引用回查仍受本机可读范围约束。",
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
    relation: "这是一次性问题的默认入口；需要长期保存时进入“具名增量归档”，需要打开附件时进入“回复与媒体关系”。",
    readerStatus: "已有指定账号和对象的聊天读取、变化发现与引用处理；本轮未读取真实会话，实际缺口由所选窗口返回。"
  },
  {
    slug: "named-chat-archive",
    usageEntry: "明确要求长期保存一个具名联系人或群的微信历史。",
    usageInputs: ["明确账号和一个联系人或群", "希望保存当前可见历史或更新既有归档"],
    productFlow: [{"title": "系统核对并处理", "detail": "首次保存该对象本机可读历史，之后沿同一游标合并变化和仍可打开的媒体。"}, {"title": "交付与接续", "detail": "交回全文、可用附件、增量状态与缺口；来源不变仍核对已有导出，中断先恢复原事务。"}],
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
    example: "我说“把这个供应商群持续保存下来”。第一次会保存当前设备能看到的完整本地历史；下周再说同一句，档案只补新消息、更新过的内容和后来能在本机打开的媒体，旧内容不会整包重抄。",
    result: "得到这个具名联系人或群在当前电脑能看到的消息、可读档案、附件与更新状态。写入中断时旧完整档案仍在；后来能打开的媒体可定向补。微信远端从未取得的内容不会因此出现。",
    readerStates: {
      "pass": "有变化就合并新内容；没有变化也先核对旧档案、附件和清单仍是一套，再报告无变化。",
      "problem": "旧消息后来修改、无时间记录或媒体后来能读时，普通增量会说明覆盖不足，需对这个对象明确重核。",
      "unavailable": "目录已有未知内容、账号不符、来源变化或导出文件不一致时停下，不覆盖原包硬修。"
    },
    stateLabels,
    decisionImpact: [
      "第一次归档必须覆盖该对象全部本地可见历史，不允许用时间参数伪造完整档案。",
      "后续重复命令就是自动增量，不需要 watcher 或计划任务。",
      "单消息来源优先使用 sortSeq 游标；多来源退回时间重叠并明确无时间记录边界。",
      "AI 只默认读取最近最多 80 条、128 KiB，完整档案仍可按需搜索。",
      "当前可打开的语音按内容哈希复用；后来可用的历史语音可在增量窗口或 full reconcile 中补齐。",
      "full reconcile 会更新或补充同身份记录，但不会把来源里后来消失的旧归档记录自动删除。",
      "已知目录替换中断先recover-export只读检查，明确rollback或complete；未知旧锁和外来内容不自动接管。verify-export只验证包，repair-media只补具名本地媒体，不证明微信远端全历史完整。"
    ],
    problem: "避免更新半途毁掉原档案、为了补几条语音重扫全部历史，以及把已生成包误称为资料齐全；冲突保留原状态和明确恢复入口。",
    implementation: [
      "state.json 固定 wechat-direct-contact-sync.v1、账号身份承诺、联系人原生身份、游标、水位、来源指纹和消息数量。",
      "messages.jsonl 用 server id；没有 server id 时用本地 id、时间、sortSeq 与发送者计算稳定合并键。",
      "默认 overlapSeconds=86400，允许 0 到 31 天；单分片且目录不变时使用 sortSeqReplayFloor。",
      "旧说话人语义的完成态档案在下次对同一对象运行 sync-contact 时，先验原档，再以 sender_identity_reconcile 重核当前本机可见历史；其他聊天不扫描、不改写。源中已不存在的旧消息保留正文与原证据，显示身份未重核并计数。",
      "来源指纹未变时先再取一次指纹确认稳定，重验 manifest 自哈希及其与 state 的账号、身份承诺、联系人、来源指纹和数量绑定；messages.jsonl 核对 SHA-256 与记录数，context.md 和 ai-context.md 分别核对完整 SHA-256 与字节数。全部一致才返回 sourceMetadataFastPath/noChange 并只更新 last-run。",
      "sync-contact、sync-moments、repair-media先暂存并验证完整候选，通过同级.wechat-transaction记录准备、前像和替换状态；两次目录rename有独立中断状态。recover-export只读检查后按明确动作complete/rollback，已提交状态不能再回滚，身份或外来修改冲突保留。",
      ".sync.lock 阻止两个写者同时更新同一输出目录；当前不会自动判断或清除陈旧锁。",
      "快速返回已经包含导出全文与结构记录的完整哈希核对，不只是看文件存在或数量；独立 verify-export 另核整个导出的路径、媒体与派生关系，不应把两者的覆盖范围混为一谈。"
    ],
    flow: [
      "首次解析账号与对象，拒绝带 since / until 的伪完整导出。",
      "建立输出目录锁并计算与该对象相关的来源指纹。",
      "选择 full、incremental 或 explicit full_reconcile 模式。",
      "无变化候选先复核来源指纹、清单/状态绑定及已导出全文和记录；通过则只更新 last-run，不重扫源库消息。",
      "抓取候选，按稳定消息键合并现有 JSONL。",
      "复制本次新增、更新或需重试且在本机可打开的精确媒体，已存在哈希文件先验真再复用；普通增量和 noChange 都核对已声明媒体及 WAV 的哈希与大小。",
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
      "有具名媒体修复和导出事务恢复，但没有把档案导入回微信的restore/import，也不自动删除未知.sync.lock或接管无依据旧目录。",
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
      "0.2.1来源定义了目录替换中断、完成/回滚、媒体修复和冲突回归；本网页未强杀真实归档、重读聊天或演练真实断电。"
    ],
    relation: "同一账号与对象贯穿上下文、归档与媒体；本模块拥有增量续作、定向本地补媒体与已知事务恢复，原微信数据库始终只读。",
    readerStatus: "已有具名聊天首次保存、增量更新和无变化复核；本页未读档案正文，完整历史仍限本机实际可见范围。"
  },
  {
    slug: "reply-media-relations",
    usageEntry: "问一句“可以”回复了谁，或某个语音和文件属于哪条消息。",
    usageInputs: ["选定会话", "想核对的回复原话或附件线索"],
    productFlow: [{"title": "系统核对并处理", "detail": "按真实消息顺序连接引用目标、发送者与附件；打不开的媒体保留位置和失败说明，不从邻近文件猜。"}, {"title": "交付与接续", "detail": "交回可继续阅读的小窗口或档案包；回复目标不明时保留未知。"}],
    shortTitle: "回复、媒体与阅读包",
    title: "按消息顺序交付原回复、可读媒体和可继续阅读的包",
    searchAliases: ["微信语音和原消息怎样关联", "微信图片表情能不能读", "export-context", "微信阅读包", "WXGF动图", "转账红包状态", "企业联系人发送方向"],
    searchProjection: {
      intents: ["理解一句回复指向的原消息", "读取同消息图片表情语音视频文件", "把有序上下文交给另一个项目", "区分转账与红包状态"],
      entities: ["export-context", "conversation.json", "media-open", "hardlink.db", "VoiceInfo", "WXGF", "materializable", "requiresNetwork", "frameCount"],
      relations: ["每次媒体出现绑定原消息", "MD5与原生索引定位文件", "实际导出字节绑定SHA-256", "WAV由同一SILK派生", "HTML复用同一阅读包"],
      failureRecovery: ["原生身份或MD5不符时保留缺口", "缩略图不冒充原图", "复杂WXGF不取首帧假装完整", "已有目录和incomplete都保留并拒绝覆盖"]
    },
    teaser: "一条消息的意思常在它引用的文字和附件里。现在可把有序消息、真实可读媒体及缺口交给 AI；HTML 只是可选查看方式。",
    status: "当前源码已核对，137项/32子测试保留9月7日证据；本轮没有打开真实微信媒体、访问 CDN 或重做归档",
    statusTone: "mixed",
    value: "消费项目看到的是同一顺序的聊天和真正能查看的附件，不用从文件名、占位文字或一堆无关系文件猜意思。",
    why: "文件去重不应抹掉表情在对话里出现多次的语境，找到本地路径也不意味着图片可解码。来源、出现位置、实际字节和质量必须分别保留。",
    example: "我说“把这段讨论和其中的图片交给另一个项目继续看”。它给出有序消息页、原回复和能打开的图片或表情；读不到的附件明说原因，有下一页就沿原查询继续，而不是替我猜图里写了什么。",
    result: "交回按消息顺序阅读的聊天和实际能打开的图片、语音或文件；每个附件都能回到原消息。打不开或不知来源的项目保留缺口，不拿文件名猜内容。",
    readerStates: {
      "pass": "消息与附件的实际内容核对后，一起交给需要继续工作的项目。",
      "problem": "某条回复或附件缺失时，交回仍可读的部分、缺口和下一页位置，不冒充全历史。",
      "unavailable": "来源或附件身份不能核对时只停这部分，不拼造地址或泄露解密材料。"
    },
    stateLabels,
    decisionImpact: [
      "context 只查本机；显式 export-context / media-open 才可物化同条表情自带的原生 CDN，--local-only 可禁止。sync-contact 与 preserve 不自动向远端补表情。",
      "图片按消息 MD5 与 hardlink.db 精确定位；V1/V2 DAT 使用身份一致的既有保护配置在进程内解码，密钥不进入包、终端或 Git。",
      "表情保留 PNG/GIF 等真实格式和每次出现。WXGF 依赖现有 ffmpeg/ffprobe，只在分区与帧数可证明时转成 PNG 或保持动作的 GIF。",
      "VoiceInfo 保留 SILK，按需派生 WAV；通话事件仍只是状态。视频和文件仅在原生 MD5 索引找到实际本机文件时交付。",
      "openable=null、materializable=true 表示找到候选但尚未证明可读；实际成功才能升级。requiresNetwork 说明是否需要原生远端物化。",
      "转账正文按原生结算子类型投影，红包单独识别；程序解释消息格式，不代替支付平台的现实结算核对。"
    ],
    problem: "解决引用失联、媒体占位冒充已读、动图丢动作、发送方向错误和跨项目交付只剩 HTML 的问题。",
    implementation: [
      "wechat_source.py 负责原生引用、分片 Name2Id、消息类型投影和账号绑定 locator；长 serverId/nativeId 始终以字符串返回。@openim 文字与非文字方向优先取当前分片的本人原生身份。",
      "wechat_media.py 沿消息原生索引定位与物化；wechat_image.py 校验 DAT 解码和图片，wechat_wxgf.py 验证封装分区、视频流与帧数，不猜完整动画。",
      "表情远端只使用同条消息已有地址，并核对原生 MD5、声明大小和图片解码；失败保留原 gap，不搜索替代图片。",
      "export-context 使用与 context 相同的范围、锚点和游标，将实际媒体写入新目录，重复字节可复用，每次消息位置不去重。",
      "wechat_render.py 可选生成引用同一媒体的 HTML；AI 默认读取 JSON/Markdown 与媒体文件，不需要浏览器、服务或源数据库 locator。",
      "repair-media只对一个明确账号/contact/output归档补本地媒体或派生WAV，--message-id/--kind进一步收窄；不重扫聊天、不请求CDN，不改原增量游标。单语音派生失败单独记录，不抹掉已可用消息与其他附件。",
    ],
    flow: ["固定账号、对象和查询窗口", "按原生消息顺序读取正文与引用", "验证每条媒体的原生来源", "按请求进行本地或原生表情物化", "核对实际格式、字节与质量", "生成新阅读包并保留逐项缺口", "有后续内容时沿原游标继续"],
    concepts: [
      { term: "Materialization（物化）", explanation: "从已绑定原生来源取得实际可读文件；找到路径只是候选，不能先宣布打开成功。" },
      { term: "Occurrence（出现位置）", explanation: "同一张图或表情在不同消息中各有语境，字节可以复用，位置和关系不能被去重抹掉。" },
      { term: "WXGF", explanation: "微信图像封装；复杂分区或透明度关系未证明时保持缺口，不把首帧冒充完整动图。" }
    ],
    boundaries: ["媒体含义必须实际阅读后由消费项目与 AI 判断。", "不扫描模糊文件名、不搜索或拼造媒体地址。", "阅读包不携带源数据库 locator、私有 URL 或解密参数。", "输出与同名 .incomplete 必须不存在；已有内容不自动接管或覆盖。", "转写、说话人归属和媒体库入库均属于另外明确的任务。"],
    failures: [
      { condition: "原生 MD5、大小或实际格式不匹配", response: "拒绝该媒体并保留原消息和 gap；不以相邻文件或网络搜索替换。" },
      { condition: "WXGF 多分区或透明度关系不能证明", response: "返回不可解缺口，不静默裁成一帧。" },
      { condition: "只找到缩略图", response: "按 thumbnail 质量交付，不标成 original。" },
      { condition: "阅读包只有部分内容可读", response: "返回 partial、每项失败和 continuation；失败回执的 retryable / nextAction 不扩大账号、聊天或写入范围。" }
    ],
    sources: [{ path: "wechat_source.py", role: "原生消息、引用、身份、转账与红包投影" }, { path: "wechat_media.py / wechat_image.py / wechat_wxgf.py", role: "原生定位、DAT与WXGF物化和字节验证" }, { path: "wechat_render.py / wechat_cli.py", role: "阅读包、可选HTML与范围化CLI" }, { path: "tests/test_reading_package.py / test_context_paging.py / test_sender_identity.py", role: "有序交付、分页和分片身份回归" }],
    verification: ["9月7日合成套件137项与32个子测试通过，覆盖图片、动画、原生媒体、阅读包、分页、发送方向及归档完整性。", "没有读取真实微信正文或媒体，没有访问表情 CDN，没有执行个人归档或媒体库入库。"],
    relation: "聊天上下文确定最小范围；本模块交付其中真正可读的消息、引用和媒体。长期归档及独立保全继续使用各自的状态与验真合同。",
    readerStatus: "已有交付有序聊天、回复和可读附件的功能；本轮没有重新打开真实媒体或补取远端附件。"
  },
  {
    slug: "moments-local-cache",
    usageEntry: "明确账号和联系人，请查看电脑当前已经缓存的朋友圈。",
    usageInputs: ["primary 或 secondary 账号", "联系人和所需范围"],
    productFlow: [{"title": "系统核对并处理", "detail": "只读本机当前缓存并说明覆盖；没缓存时可在同一账号手动打开目标后再试。"}, {"title": "交付与接续", "detail": "交回实际可见内容与缺口；不称远端全部历史已取得，也不混主副号。"}],
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
    result: "得到这个明确账号在当前电脑已缓存的朋友圈内容、实际可见时间和缺口。没有本机缓存时会提示在同一账号手动打开目标后再试，不说对方没有发布。",
    readerStates: {
      "pass": "账号和发布者能唯一对应、电脑里确实有相关缓存时，交回实际可见部分。",
      "problem": "发布者重名、媒体未缓存或本机缓存变化时保留候选和缺口。",
      "unavailable": "本机尚无这名发布者的缓存时说明如何手动取得，不自动打开主页或联网补历史。"
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
    relation: "朋友圈与聊天共享账号身份和媒体读取，但拥有独立的缓存范围、对象解析与同步状态，不能用聊天档案替代。",
    readerStatus: "已有按明确账号读取本机朋友圈缓存的功能；本轮未读真实正文，本机无缓存不代表对方没有发布。"
  },
  {
    slug: "account-source-identity",
    usageEntry: "读取微信前先指明主号或副号与对象，或让 auto 只在唯一匹配时选。",
    usageInputs: ["指定主号、副号，或允许唯一匹配时自动选定", "要读的联系人或群"],
    productFlow: [{"title": "系统核对并处理", "detail": "核对账号来源，复制本机加密库到临时位置完成只读快照和完整性检查，源库变化时停止。"}, {"title": "交付与接续", "detail": "交回与正确账号绑定的上下文；多匹配、解密或快照失败时不借另一账号补空。"}],
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
    status: "环境检查可独立于账号运行；文字/图片与Python3.11语音分别验收",
    statusTone: "pass",
    value: "同名联系人、双开微信和本机加密数据库不会因为“看起来像”而串到另一个账号；源数据库也不会为了读取而被改写。",
    why: "主号、副号可能有相同昵称和联系人；真实数据库仍在写入，直接解密查询也可能得到不一致页面。若身份和快照不先闭合，后面的消息再完整也可能来自错账号或半写状态。",
    example: "主号和副号里都有人叫“小王”，我只说一句“别拿错”。工具会先让我确定账号，再核对这个账号与本地资料确实是一套；身份有一点对不上就停，不会因为头像和昵称很像便把两边聊天拼起来。",
    result: "得到已核对的微信账号和一份稳定、只读的本机资料副本，后续查询才会使用它。账号或来源对不上时停下，不泄露账号解密信息，也不混主副号。",
    readerStates: {
      "pass": "账号和本机来源能唯一对应，临时读取副本完整，才开始读消息。",
      "problem": "依赖或语音解码器缺失时分别报告；只影响相关功能，不说全部微信读取都坏了。",
      "unavailable": "账号目录不唯一、配置不可读或本机资料正在变化时先停，不能猜一个相似账号。"
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
      "EncryptedPageCodec验证加密页面与WAL校验和，只合并已提交WAL前缀，保留源数据库/WAL只读；不以临时快照成功推断原会话或远端内容完整。",
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
    relation: "所有聊天、朋友圈、媒体和归档模块都以这里的账号身份与稳定快照为前提；它只建立可信来源，不拥有聊天语义。",
    readerStatus: "已有分开两个账号并核对来源的机制；文字、图片与语音依赖分别检查，账号不明确时不猜。"
  },
  {
    slug: "preservation-verification",
    usageEntry: "要求给一段重要聊天做可核对的独立保全或验真。",
    usageInputs: ["明确账号、对象与需要保全的时间窗口", "是新保全、验真已有包还是补缺失媒体"],
    productFlow: [{"title": "系统核对并处理", "detail": "按选定范围保存文字、关系、可用媒体和清单；发布前核对文件数、内容指纹与增量状态。"}, {"title": "交付与接续", "detail": "交回完整、部分或待恢复的真实状态；已有导出可离线验真，缺媒体可定向补，不把生成成功当源内容完整。"}],
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
    result: "得到一份包含所选聊天、回复关系和当前能打开附件的材料包，另有清单说明缺什么。已有包可独立核对是否仍完整；部分附件缺失会保留实际消息与缺口。",
    readerStates: {
      "pass": "文字、附件与清单能一一对上时，才称这份包可独立核对。",
      "problem": "某张图或语音打不开时仍保留消息和缺口，不把附件空白说成整段聊天不存在。",
      "unavailable": "目标已有内容或文件身份、数量不符时不覆盖，也不宣布保全成功。"
    },
    stateLabels,
    decisionImpact: [
      "preserve 只由明确保全请求触发，不把普通问答自动升级成证据包。",
      "保全包与 sync 导出是两种产品：前者有界自包含，后者可持续增量。",
      "原始消息先保存；当前可打开的 SILK 语音保留原件，WAV 只是带来源哈希的派生文件。",
      "preserve 只物化当前本机媒体；export-context 是另一个面向 AI 的有序阅读包，两者不能用同一份 verify-export 结果互证。",
      "verify-export 不需要账号配置或源数据库，可以在恢复后独立验真。",
      "任何错误都以列表返回，不能用其余文件通过来掩盖一个不一致。"
    ],
    problem: "解决截图式保全缺关系、半完成目录冒充成品、导出文件被替换、state/manifest 串档和派生媒体失去来源。",
    implementation: [
      "preserve 先调用 context 得到账号、对象、窗口、消息、引用和 gaps。",
      "包先在具名候选目录写完并验证，再发布；替换已有归档复用明确事务恢复。packageCreated=true和exit0不等于全部所选内容可用，status=partial、delivery与hasMore必须独立读取。",
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
      { term: ".incomplete", explanation: "尚未完成的候选目录；只有验证后才可替换正式目标。跨两个目录重命名不是全局原子，已知中断按事务恢复，未知旧目录不自动删除。" },
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
    relation: "保全消费“聊天上下文”和“回复与媒体”；verify-export 验证“具名增量归档”和“朋友圈缓存”的正式输出，但不替代源端重放。",
    readerStatus: "已有明确窗口保全和导出文件独立验真的功能，并用合成材料测试；这不证明微信未取得的远端历史也已保存。"
  }
];

export const project = wechatDirectProject;
export const modules = wechatDirectModules;
