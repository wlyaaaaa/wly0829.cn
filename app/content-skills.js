import { generatedPanelFacts } from "./panel-facts.generated.js";
import { skillUsage } from "./content-skill-guides.js";

const retainedERules = generatedPanelFacts.authority;
const currentSkillSupply = generatedPanelFacts.skills.supplyEvidence || {
  sourceCommit: generatedPanelFacts.sourceCommit,
  observedAtBeijing: generatedPanelFacts.observedAt
};

function skill(definition) {
  return {
    provenance: "个人维护的能力入口",
    sourceKind: "personal_install",
    availability: "available",
    statusTone: "mixed",
    sourceState: `供给 source ${currentSkillSupply.sourceCommit.slice(0, 7)} 的规范源码校验通过；本页保留的字节与指纹仍按此前快照，不在本轮重取`,
    installState: "canonical junction 已安装",
    transactionState: "供应来源与安装检查通过；本轮回执未返回独立供应事务层",
    currentTaskState: "本轮宿主回执未知",
    freshTaskState: "新任务回执未知",
    endToEndState: "按场景验收",
    evidenceObservedAt: `供给来源与安装：${currentSkillSupply.observedAtBeijing}；此前字节快照：${generatedPanelFacts.observedAt}；项目场景按各项原记录`,
    evidenceBasis: `本次 Personal Skill supply（个人能力供应）仅核对 source/install；旧 ${retainedERules.releaseId} release ${retainedERules.gitCommit.slice(0, 7)} 规则参考和各项既有项目/Provider（固定服务入口）证据保留原日期，不作为当前规则身份。独立事务未返回，current/fresh/E2E 未重验，保留来源字节不冒充本次重取`,
    evidenceSourceCommit: currentSkillSupply.sourceCommit,
    supplyEvidenceCommand: "E:\\.agents\\tools\\Test-PersonalSkillSupply.ps1 -RequireInstalled -NoExternalEvidence -Json",
    ...definition,
    ...skillUsage[definition.slug]
  };
}

export const skills = [
  skill({
    slug: "personal-media",
    sourceBytes: 6721,
    sourceSha256: "048a031ea7322c131f93f0c747dd28b8135e0fae20711a165b326e5e88289830",
    name: "personal-media",
    title: "个人媒体检索与录音片段定位",
    status: "已安装 / 回归通过",
    maturity: "A",
    summary: "用画面、地点、文字或录音内容查找本机受管照片、视频和录音，核对原件后打开或建立临时浏览文件夹；已经选中的录音还可复用现有转写，指出某段话从几分几秒开始。",
    useWhen: ["已经选中录音，想知道某段内容在什么时间位置", "记得画面、地点、文字、录音内容或大致日期，但不知道原件路径", "需要打开少量真实媒体原件", "需要把一组查询结果放进临时文件夹浏览", "需要明确区分图片、视频和音频"],
    avoidWhen: ["查找 Word、PDF 等非媒体原件", "按人物大范围扫描媒体库", "删除、修改或上传媒体", "重建第二套索引、服务或后台任务"],
    inputs: ["1 到 4 个能出现在内容中的区分词", "可选地点、描述、分类、媒体类型和日期", "明确要求完整集合时才使用 all"],
    outputs: ["录音中的实际起止时间、命中词、少量 ASR 摘录、时间精度与覆盖范围", "少量可读候选和绝对原件路径", "媒体类型、已知日期、地点、分类和匹配依据", "按请求创建的同卷 hardlink 浏览目录", "零命中时的真实过滤条件和覆盖缺口"],
    flow: ["把用户原话压缩成最小可靠过滤条件", "用 SQLite 条件和 FTS 执行小结果 search", "核对权威原件定位记录确实指向现存原件", "需要浏览时创建 task-unique hardlink 文件夹", "身份问题只把选中的少量原件交给 person:self 能力", "用户不再需要时只清理那个受管浏览目录", "录音片段定位使用 locate-audio，核验当前原件后复用 ChineseASR 已有 hash 绑定时间结果，不启动模型或播放音频", "已有 pending job 就接着同一任务等待；没有可用时间戳且已授权处理时，只对这段录音补本地 Paraformer 句级时间，再重试原定位"],
    boundaries: ["私密项默认隐藏，只有用户明确要求才包含", "地点只表示已复核的拍摄现场，文字里的地名走 query", "不使用当前没有证据的人物过滤", "不读取完整 NDJSON、全盘扫描或复制媒体进知识库", "浏览清理绝不删除原件", "达到 limit 只说明前 N 条，只有显式 --all 才能声称完整匹配集合", "现场地点未登记不能静默降成文字 query；只保留本人给出的其他可靠条件", "录音时间相对原始音轨，匿名说话人不是身份，ASR 摘录不是逐字音频证明；locate-audio 不提供视频片段定位", "明确只读请求只报告时间缺口；不会为导航上传录音、处理目录或猜时间戳", "媒体项目另有手机两次连接/三阶段、手机删除反向收敛和真实云同步；本 Skill 仍只检索、定位和受管浏览，不连接/清空手机、上传或删除原件"],
    dependencies: ["V:\\Personal\\Projects\\personal-media", "E:\\Media\\_manifests\\personal-media-current\\catalog.sqlite3", "E:\\Pictures、E:\\Videos 与 E:\\Music 当前原件根；录音平铺 E:\\Music\\录音，音乐/铃声在 Music 根"],
    tests: "2026-09-05 的55项回归（53通过、2真机项跳过）只保留为历史。媒体项目 fb75ce0 的来源Owner汇总记录2026-09-13T23:21Z已回读4230项云端对象（Photos 3473、Drive 757），来源102项本地测试通过；这些属于项目云同步与维护验收，不是本检索Skill执行了上传。手机采用两次连接、三阶段流程，当前最终回写回执未在本轮重验，不能沿用旧“仍待连接”结论。Skill源码/安装、自然检索和真实手机结果分别取证。",
    sourcePath: "E:\\.agents\\skills\\personal-media\\SKILL.md",
    endToEndState: "本地 search、browse 和 clean 契约已验",
    evidenceSourceCommit: "9d4ccaa0f97351ee2cdd7e9a09e98bd731a54092",
    sourceState: "2026-09-22逐段核对已发布 .agents 9d4ccaa0f97351ee2cdd7e9a09e98bd731a54092 的规范Skill原文，bytes/SHA绑定该Git blob；未读取未提交候选，未以源码核对刷新业务运行证据。",
    readerStatus: "查找、临时浏览与清理有既有验证；录音定位是否有可用时间戳按选中原件核对。本页没有重新处理手机或运行云同步。",
  }),
  skill({
    slug: "personal-materials",
    sourceBytes: 5749,
    sourceSha256: "a8a42075a65179038b23f89022e5b8e270b2abd60d9f373583c085918e472fc4",
    name: "personal-materials",
    title: "非媒体原件与文内位置查找",
    status: "已安装 / 回归通过",
    maturity: "A",
    summary: "忘了合同、报告放在哪里，或想知道某句话在第几页、哪一段时，它先找到并核对选中的真实原件，再给路径或带位置的小段摘录。AI 阅读默认不弹桌面应用；本人要求打开时才打开。",
    useWhen: ["非媒体原件位置未知、原有定位失效，或需要在登记来源内有界查找", "已经选定一份文件，需要定位特定内容的 PDF 页、Word 段落/表格或文本行", "需要给 AI 一条现场核验过的原件路径，而无需启动桌面阅读器"],
    avoidWhen: ["照片、视频、录音或其他视听媒体", "已知可靠文件位置而且只需直接阅读；要找选中文件的页、段或行时仍可使用本能力", "需要判断材料专业含义或执行领域动作，而不是找原件或文内位置", "要求全盘扫描、后台索引或批量复制原件"],
    inputs: ["对材料名称、时间、版本角色、用途或原生目录的普通描述", "可选的已登记来源提示；不要求用户重复系统已经知道的本机路径或内部 ID"],
    outputs: ["find/discover 的少量候选和真实覆盖范围", "inspect/inspect-discovered 返回现场核验路径、大小与 SHA-256，不写索引或启动应用", "locate-content 返回绑定当前原件版本的页码、段落/表格位置或行号，以及有界摘录、格式与覆盖限制", "本人明确要求打开时，才记录核验/登记状态并启动默认应用"],
    flow: ["可靠原件定位已知时直接用原生 reader（文件读取器），跳过再次查找", "没有候选时才用 find；已有候选直接核验，位置确实未知且登记不足才在获准来源执行 discover", "选中后用 inspect 或 inspect-discovered 只读核验路径；AI 从该精确原件继续读取", "问某段内容在哪里时直接对已选原件运行 locate-content，不额外重复 inspect", "PDF 文本层返回页码，DOCX 返回正文段落或表格单元格，TXT/Markdown 返回行号", "没有可提取文字时，仅针对这个原件复用 PDF/LocalOCR；不能执行就明确定位缺口", "只有本人要求在桌面打开才运行 open/open-discovered；需要登记但不弹窗时显式 --no-launch"],
    boundaries: ["措辞不匹配时，依据本人已有线索换用内容词、文件名词或来源提示，在同一获准范围继续有界搜索；不编造事实、不扩大账号/设备/根、不重复原查询，无剩余有效线索就报告实际覆盖和缺口", "照片、视频、录音及其他视听媒体始终交给 personal-media", "候选 token、material key 和内部来源 ID 不进入面向用户的回答", "项目只保存最小 locator/metadata SQLite（定位与元数据数据库）及与原件绑定、可删除重建的文字，不保存原件字节、人物事件或跨领域画像", "discover 最多选择 8 个来源，全部来源共享 2500 个文件和总计 8 秒的预算，每来源最多 12 层，并且不跟随链接", "不复制、移动、改写或删除原件；hash 漂移、来源根变化或文件状态变化都失败关闭", "inspect 与 inspect-discovered 是零写核验；open --no-launch 仍写状态，不能当只读替代", "locate-content 自行核验被选原件，不登记发现候选、不启动应用，也不建全库正文索引", "Word 段落编号不是打印页码；PDF 文本层不覆盖图片内文字，局部零命中不能证明全文件没有内容", "提取/OCR 结果须绑定当前原件 hash 和实际页/区域，已有绑定结果可复用"],
    dependencies: ["个人材料查找项目（私有源码）", "personal-materials.handoff.v1 与项目最小 locator/metadata SQLite（定位与元数据数据库）"],
    tests: "2026-09-07 来源 main 1425c7f；tests/test_materials.py 的 66 项回归通过，用时 57.35 秒，覆盖只读核验和选定文件定位。本网站任务没有访问私人原件，实际文件/默认应用结果仍独立。",
    sourcePath: "E:\\.agents\\skills\\personal-materials\\SKILL.md",
    endToEndState: "默认只读核验与文内定位由当前源码合同证明；本网页任务没有打开或提取私人原件，真实具体文件结果不在此宣称通过",
    readerStatus: "只读核验与文内定位已经实现并有合成回归；这次网页修复没有读取私人原件，具体文件能否找到、文字覆盖到哪里要在实际请求中确认。",
  }),
  skill({
    slug: "wechat-direct",
    currentTaskState: "本轮只核对已发布代码、Skill与合成回归，未读取真实消息或媒体",
    freshTaskState: "当前新自然请求的context/导出/媒体真实结果未由本网站任务重验",
    evidenceObservedAt: "来源与Skill于2026-09-18核对：WeChatDirect0.2.1 / 53b7c0b；历史消息与归档记录仍按原日期",
    sourceBytes: 9944,
    sourceSha256: "090ece3e623fafb2c8adb34e6cd906f782d84e5b4619fec3f7e0dd0d648b4bda",
    name: "wechat-direct",
    title: "微信上下文与具名归档",
    status: "已安装 / 回归通过",
    maturity: "A",
    summary: "读指定微信对话与回复、语音和附件，长消息按同一版本分段读完；需要时导出选定窗口或维护一个具名归档。包做出来、可独立验真和内容已经齐全分别说明。中断先看原事务，后来下载好的本地媒体可以定向补，不重扫全账号。",
    useWhen: ["回答某个联系人或群的当前/历史上下文，或找一条消息附近的对话","把已选消息整理成一份可继续阅读和分析的聊天包，保留媒体与上下文，需要时再附网页阅读版","打开有原生定位和校验证据的图片、表情、语音、视频或文件","为本人点名的一个联系人或群保存以后能继续更新的归档","查看某个账号当前本地朋友圈缓存","更新本人理解或具名项目材料时，先发现哪些微信会话发生变化","在大群里先查看本人参与，再补充影响含义的回复"],
    avoidWhen: ["一次同步整个账号", "后台持续同步", "没有明确联系人或范围", "把聊天材料复制到第二数据库"],
    inputs: ["联系人或群名", "账号、时间范围或消息线索", "归档时的单一具名目标"],
    outputs: ["按原生顺序与真实发送者角色排列的小窗口、回复和可用历史提示", "默认 conversation.json、media/、ai-context.md 导出，以及按需 HTML", "图片DAT V1/V2解码、原PNG/GIF/WXGF表情、WAV语音及本机精确定位的视频/文件，附真实缺口", "具名对象增量归档、完整历史发送者统计或当前朋友圈缓存",
      "长文本完整哈希与分段位置、部分交付摘要、同一导出的恢复检查和具名媒体修复结果",],
    flow: ["直接选择现有CLI的context、export-context、media-open、sync-contact、moments或preserve，参数不清先读该命令help","context从最小窗口开始，使用固定query游标或around定位附近；读取senderRoleCounts、selfObservation与availableHistoryHint，不把窗口self=0推成从未说话","显式导出或打开媒体时按原生MD5/索引定位、解码并核对，不从相邻目录猜文件","原生表情在显式export-context/media-open中可沿同条CDN记录补取并核MD5/size/decoder；--local-only严格禁网络","具名sync-contact第一次取本机当前可见完整历史，后续沿同目录增量，旧历史/游标或后到媒体才full-reconcile","旧归档下次同对象同步先验真，再按sender_identity_reconcile重核发送者；已无源旧消息保留正文与原归属证据并标未重核","朋友圈未点名账号时分别读primary和secondary并分开说明，不用auto或根据昵称猜账号","需要保全证据时才preserve；它与普通context、具名归档各自有界","changes 按固定时间窗分别发现主副账号的变化候选；当前会话表发现不等于全部历史变动检查","context --self-only 可先分页读本人消息与身份未决项，保留引用目标和 selectionScope；必要时用普通 context --around 补读他人上下文",
      "遇到segmentedFields沿message-part的原哈希与偏移续读；源变化就重新取上下文，不拼接不同版本。导出读取status/delivery/hasMore，packageCreated与exit0不自动当内容完整。",
      "具名repair-media只补本地媒体/WAV；archive_recovery_required先recover-export只读检查，明确complete/rollback才修改，未知旧锁和外来文件保留。",],
    boundaries: ["一次只处理一个明确联系人或群，不做全账号同步、第二数据库或后台任务","context只用本机；sync-contact/preserve不自动请求远端表情；--local-only拒绝所有网络补取","发送者按同分片Name2Id和账号原生承诺解析，openim与非文本消息保留真实角色，长ID作为字符串","旧原生消息已不存在时，不伪造身份重新核验成功；原正文和归属证据仍保留","noChange和普通增量都核对媒体与WAV哈希，状态无变化不省略完整性核验","复杂WXGF分区或透明度缺证继续明确gap，不把仅能读部分画面称完整还原","小窗口self=0不是整个聊天本人从未发言；完整历史结论使用同对象归档manifest的统计","已知事务有明确恢复入口，两个目录重命名不是全局原子；未知旧锁/半成品不自动接管。缓存未命中保持缺口，语音转写仍交给ChineseASR。","changes 保留新会话、隐藏会话、时间未知项及晚于窗口结束的候选；不能据此声称已发现旧消息补入、撤回或全部历史删除","读取从来源项目按账号和联系人保存的实际阅读位置继续；发现、采集、阅读与理解分别完成，最近一条引用不等于已读边界","self-only 不是全群覆盖；未知发送者仍是缺口，当前窗口没有本人消息不证明历史上从未参与"],
    dependencies: ["E:\\Projects\\Tools\\WeChatDirect", "中文 ASR 用于语音媒体"],
    tests: "2026-09-07 PUBLIC main 96b0fb6；137 项测试与 32 个子测试通过，用时 3.49 秒。网站任务没有读取真聊天、打开真实媒体或新建归档；旧3个归档/6032条仅是2026-09-01历史观察。",
    sourcePath: "E:\\.agents\\skills\\wechat-direct\\SKILL.md",
    endToEndState: "137项与32子测试通过；真聊天、媒体解码、显式CDN取回及当前具名归档仍以各自真实回读为准",
    productProcesses: [
    {
        "title": "理解一条消息和前后关系",
        "request": "看看昨天那句话前后怎么聊的，相关语音和图片也一起看。",
        "input": "告诉 AI 一个联系人或群，再给大致时间或消息线索；同名对象有歧义时补清是哪一个。",
        "action": "AI 先读够回答问题的一小段，按原顺序串起谁说了什么、回复指向哪条消息，以及会影响意思的附件。长消息接着读完；大群可以先找本人的发言，再补周围对话。",
        "result": "你会得到能看懂前因后果的说明、实际读过的范围和相关图片或语音；缺的附件会单列。",
        "boundary": "这一小段没有你的发言，只能说明这段；不能推成整个群都没有。发送者不明时保留不明，语音要变成文字时交给中文转写。"
    },
    {
        "title": "导出一段聊天或长期保存一个会话",
        "request": "把这个群目前电脑上能看到的完整历史留成归档，以后接着更新。",
        "input": "点名唯一联系人或群，并说明只要一段时间的阅读包，还是要同一对象以后继续更新的完整归档。",
        "action": "选定窗口会整理成带顺序、回复关系和可用附件的阅读包；具名归档首次保存电脑上当前可见的该会话历史，以后沿原归档补新消息和后来才取得的本地附件。",
        "result": "你会得到选定聊天包或可继续更新的本地归档，并看到哪些文字或附件已收齐、哪些还缺；包本身可以单独校验。",
        "boundary": "文件生成或校验通过不证明微信原始历史全部齐全。默认只用本机内容；只有明确打开或导出某个表情时才可能按该消息已有地址补取，要求全本地就保留缺口。"
    },
    {
        "title": "查看电脑当前缓存的朋友圈",
        "request": "看看这个联系人现在本机能读到的朋友圈。",
        "input": "点名发布者或自己的朋友圈；如果主副账号都可能有结果，AI 会分别检查并标明来源。",
        "action": "AI 只读取这台电脑当前缓存的对应内容。你明确要留下快照或更新它时，才保存当前缓存。",
        "result": "你会看到目前能读到的内容、来自哪个账号和覆盖到哪里。",
        "boundary": "没缓存不代表对方没发过。此时只需本人在正确账号打开该资料页，再让 AI 重读；不会自动点赞、评论或切账号。"
    },
    {
        "title": "更新理解前先找变化的会话",
        "request": "按最近的微信变化更新我的个人理解，别每次重读所有聊天。",
        "input": "说明本次要更新的时间和用途；之前读到哪里由接收项目自己的记录提供。",
        "action": "AI 分别找两个账号里近期有变化迹象的会话，再按已读位置读相关消息。只有接收项目实际理解并保存了变化，才把这一段记作已读。",
        "result": "你会知道哪些会话只是候选、实际读了什么，以及个人理解新增、更正或没有变化的内容。",
        "boundary": "近期会话表不能发现所有旧消息补入、撤回和历史删除。找到、读完和理解正确是三件事；这不会建立整个微信账号的后台归档。"
    },
    {
        "title": "中断或附件缺失后接着做",
        "request": "这份归档上次中断了，把后来下载到本机的附件补进去。",
        "input": "指出原来的账号、联系人或群和同一份归档位置。",
        "action": "AI 先检查原归档和未完事务，确认能恢复才完成或退回那次更新；补附件时只找该会话后来可用的本地文件。",
        "result": "你会得到仍可用的旧内容、这次确实恢复或补齐的部分，以及尚缺的文件。",
        "boundary": "缺少可信恢复记录或发现外来文件时停在现状，不把半成品说成成功，也不覆盖别人的内容；补附件不会重扫全部聊天或擅自联网。"
    }
],
    readerStatus: "已发布读取、导出、具名归档与恢复功能并有合成回归；这次没有读取真聊天、打开真实媒体或新建归档，当前账号和附件是否可读取另看实际结果。",
  }),
  skill({
    slug: "google-workspace-direct",
    evidenceBasis: "已发布 .agents e734251 中 google-workspace-direct 当前原文及 PCConfig Google provider v1.2.0 的零网络 Status；Gmail/Drive 旧业务证据保留原日期。typed Tasks 入口与真实 OAuth、远端业务效果分层，活动 E171 只决定资料规则。",
    currentTaskState: "2026-09-24核对当前正式 Skill 与 PCConfig 零网络 Status；没有读取真实邮件、验证码、文件或任务，也未重做 OAuth 或任务写入。",
    evidenceObservedAt: "Gmail/Drive 网页业务基线观察于2026-09-20 11:43（中国时间）；2026-09-24核对当前已发布 Skill 与 PCConfig provider 零网络 Status。日期各指不同证据，不代表 Tasks 在线授权或任何服务的业务效果本次已验。",
    evidenceSourceCommit: "156387f2bdc92ebb43aca9e10509518e206fe8e8",
    sourceState: "当前规范 Skill 已发布并包含 Gmail、Drive 与 Google Tasks；PCConfig Status显示 active_services=gmail,drive,tasks、Calendar frozen、zero_network=true。Tasks OAuth 与远端账号核对仍为 Unknown。",
    sourceBytes: 8042,
    sourceSha256: "d73b6c3f14a8a17ad69fe311a7f6b6e94a541337511842acf0a9fbfd47dfc4ab",
    name: "google-workspace-direct",
    title: "Google 邮件、云盘与待办固定入口",
    status: "Gmail/Drive 旧验收保留 / Tasks 入口已登记、在线授权未验",
    maturity: "A-",
    summary: "在本人既有 Google 账号中找邮件和云盘文件，也能按任务列表读取、创建、修改、完成或整理 Google Tasks；明确写入对象和动作后沿同一连接处理并回读。Tasks 首次可能需要本人在同账号前台补 OAuth 授权；日历保持冻结。",
    useWhen: ["按条件查邮件并读取实际正文或同一线程","查找、读取或导出Drive文件","查找任务列表和任务，或明确创建、更新、完成、移动及删除一项待办","本人明确要找刚刚发来的Gmail验证码","需要原生Google文档导出或普通TXT/DOCX/PDF正文","已明确授权发送、回复、上传、修改或分享，而且当前 Google 入口确实支持这个动作"],
    avoidWhen: [
      "切换其他账号",
      "不说明就改用别的账号、浏览器或外部连接",
      "当前 Google 入口没有提供这项写操作",
      "Google Photos、Admin 或支付",
      "把已登记 Tasks 入口当作 OAuth 已授权或远端任务操作已完成的证明；日历仍冻结"
    ],
    inputs: ["邮件/文件的窄查询、对象 ID 或时间范围；Tasks 的列表与任务线索", "写操作时的精确对象、内容和动作授权；首次 Tasks 缺 scope 时由本人完成同账号前台同意"],
    outputs: ["最小必要邮件正文、线程或文件结果；验证码注明服务、收件时间及未解决的冲突", "任务列表、任务和分页覆盖；due_date 只表示日期", "原生文档导出", "写操作的 Provider 回执与 read-back", "普通存储文件经固定 Provider 的 DriveDownload 下载后的原生读取结果"],
    flow: ["已知任务直接走对应窄入口；gmail_read.py search按实际请求取得正文，不把只含ID/主题的搜索页当成读过邮件，也不先枚举所有工具。","选择固定 Provider 的精确 operation","读取实际需要的正文和上下文后完成当前请求；写操作仅在用户确切授权及已暴露能力内执行，同一线程回复、附件与最终对象分别回读。","原生文档必须走 Drive export","Google Tasks 先列任务列表取得准确 ID，再分页读取或取得目标任务；更新仅 PATCH 指定字段，完成/移动/删除使用精确 ID 和明确动作授权","Tasks 缺 OAuth 范围时由本人同账号前台授权后再读回；这项等待不影响已有 Gmail/Drive 任务","写入前核对 Provider 能力和授权","按同一 Provider read-back","Drive已知名称先准确找；只有当前完整搜索结果确实未命中才扩大条件，不能把第一页或最多五个候选当成所有文件。","“Gmail验证码”沿现有gmail_read入口看最近10分钟、相同服务及当前上下文；首次未见时每5秒查看、至少等待120秒并做最后一次回读，不重复算旧码，也不把过期邮件混成新验证码。","发生投递不确定时回读原对象和回执，不盲目重新发送；验证码候选须由当前任务读正文判明用途，不自动完成账号登录或真人验证。"],
    boundaries: [
      "不落中央库",
      "不自动同步",
      "不换账号或第二 Provider",
      "删除、发送和公开分享仍需精确授权；Google Tasks typed 入口已登记但本轮未验在线 OAuth 或任务结果，日历仍冻结。",
      "Tasks 的 due_date 不是带时刻的提醒；可读隐藏状态但没有虚构的隐藏写入。Tasks 授权缺失只暂停 Tasks，不抹去 Gmail/Drive 既有连接。",
      "MCP 只暴露元数据或没有 drive_download，不等于固定 Provider 没能力；普通文件可走已登记 CLI DriveDownload",
      "普通文件用 files.get?alt=media，原生 Google Docs 必须 files.export；不能混用或切换第二 Provider",
      "取用本人背景、邮件或私人样本前消费 PCConfig 的同一 B2 资料状态与原截止；screen/factor 仅表示业务分类，不另建锁屏期、任务期或 MCP 期。独立 MCP 与本机共用该记录，连接认证不免资料检查；有效期内按需取用，到期或主动锁定后停止，取消只结束本次未完成请求。 邮件主题、正文和验证码均按私人内容处理，Drive按实际内容判断，不按扩展名降级。",
      "不因这个Skill存在而启动轮询服务、同步库或第二账号连接；有限等待只发生在本次明确验证码请求内。"
    ],
    dependencies: ["PCConfig 的 google-workspace.primary Provider", "已登记 OAuth 绑定"],
    tests: "Gmail/Drive 旧网页基线观察于2026-09-20 11:43中国时间，原业务结果未重演。2026-09-24 PCConfig provider v1.2.0 零网络 Status 显示 active_services=gmail,drive,tasks、Calendar frozen、credential_state_present=true；oauth_authorized、oauth_scope_attested、account_binding_metadata_match、remote_account_identity_checked 均为 null。typed Tasks 实现与合同可核，在线 OAuth、实际任务读取和写入仍 Unknown。",
    sourcePath: "E:\\.agents\\skills\\google-workspace-direct\\SKILL.md",
    endToEndState: "在线身份本轮未复核",
    technicalSections: [
      {
        "title": "同一次验证码请求怎样继续",
        "paragraphs": [
          "Gmail 验证码沿既有来源说明；Google Tasks 是当前已发布的另一项 typed 能力，不参与取验证码。“验证码”默认最近10分钟，不先反问类别；服务未指定时选最新相关码，旧引用/过期/不相关邮件排除。",
          "candidates_require_review只是候选。AI读取正文后直接给码、服务和接收时间；候选全不合适就累计--exclude-id继续。同一回执已返回非空deadline_utc时必须传原--deadline-utc，不能重新开始120秒等待。",
          "首次确认无合适新消息后每5秒刷新、至少等120秒，到期最后查一次；新候选即时返回。只有no_new_candidate_after_wait才说等候后未收到。本人停止或真实工具故障可以提前结束，“不是这个/新的呢”排除旧消息立即刷新，修Skill本身不取验证码。"
        ],
        "commands": [
          "# 本次有界等待\npython -B E:\\.agents\\skills\\google-workspace-direct\\scripts\\gmail_read.py wait",
          "# 排除已核候选并保留原截止\npython -B E:\\.agents\\skills\\google-workspace-direct\\scripts\\gmail_read.py wait --exclude-id <已核消息ID> --deadline-utc <原返回截止>"
        ]
      },
      {
        "title": "正文、分页和写入的精确接口",
        "paragraphs": [
          "gmail_read.py search一次取正文，只定位才--metadata-only；已有消息ID用read或gmail_get_message，需要往来才get_thread。原始gmail_search只有ID。Drive已知ID直接get，名称用drive_find.py精确名称，完整未命中才放宽，默认最多5个候选；不完整/分页范围限制“全部、最新、唯一”等结论。",
          "只读瞬时传输故障最多重试一次，账号/权限/schema错误原样说明；不静默换账号。相关CLI可复用-StdinJsonLines。回复用GmailReply/GmailDraftReply保留原线程，附件用-AttachmentPaths，按references/reply-and-attachments.md核对象、大小、原草稿与回读；effect_unknown不重发。",
          "明确目标和动作的写入直接按实际支持能力办理，不增加逐步确认；取邮件主题、验证码和私人文件都消费同一现役资料期。安装/零网络配置/旧业务快照不证明本轮OAuth与业务成功。"
        ],
        "commands": []
      },
      {
        "title": "Google Tasks 的列表、写入与当前证据",
        "paragraphs": [
          "先 TasksListTaskLists 确认列表 ID，再 TasksList/TasksGet；列表保留 PageToken、UpdatedMin、完成/隐藏及 assignment metadata。due_date 是日期，不是带时刻的 deadline。",
          "TasksCreate/TasksUpdate/TasksComplete/TasksMove/TasksDelete 都要精确列表和任务 ID；写入沿 -ActionAuthorizationConfirmed，删除还需 -Force。Update 只 PATCH 点名字段，Move 用明确 parent/previous ID；隐藏只有只读状态。",
          "Tasks 首次缺 scope 返回 tasks_oauth_reauthorization_required；本人通过同账号前台 Start-GoogleWorkspaceOAuthEnrollment.ps1 完成同意后再读回，不代点授权页。2026-09-24 零网络 Status 不证明 OAuth 已授权、远端身份匹配或真实任务结果；Calendar 仍冻结。"
        ],
        "commands": ["pwsh -NoProfile -File E:\\PCConfig\\tools\\Invoke-GoogleWorkspaceProvider.ps1 -Action TasksListTaskLists -BindingId google-workspace.primary -Json"]
      }
    ],
    readerStatus: "Gmail/Drive 的旧业务证据保留原日期；Google Tasks 的正式入口已登记，本轮没有实际授权、读取或写入任务。首次使用可能需要本人在同账号完成授权；日历仍冻结。"
  }),
  skill({
    slug: "chinese-asr",
    sourceBytes: 3892,
    sourceSha256: "08ad6624b95c29b09191e65556b5194b33669c49e42b71a9a4fda846c4fb064a",
    name: "chinese-asr",
    title: "中文录音转写与说话人证据",
    status: "已安装 / 正式环境回归通过",
    maturity: "A",
    summary: "三种请求分开处理：直接说话打字，用Qwen3-ASR-1.7B；先快看录音内容，可用SenseVoiceSmall初稿；重要词句要核对时，默认让Qwen与SenseVoice分别识别并保留分歧。已经有录音和确认文案，只需配字幕或画面时可用Qwen强制对齐器找词语时间，不重新识别或配音。完整模型分工在ChineseASR项目中，云端另按精确上传授权。",
    useWhen: [
      "需要中文录音全文，或能回听定位的文字",
      "需要区分录音中不同的匿名声音",
      "需要判断某个精确片段是否支持本人说话",
      "重要录音需要两份独立转写与原音频复核",
      "普通转写有影响理解的疑点，且选定录音已明确授权云质量复核",
      "已有文稿和对应音频，只需词语时间用于配音或字幕",
      "需要在本机应用实时中文听写，或排查 Win+H"
    ],
    avoidWhen: [
      "扫描整个音频库",
      "把模型分出的声音组直接当作真实人数或姓名",
      "把自动转写当作逐字准确的证明",
      "等待超时后重复提交同一录音任务"
    ],
    inputs: ["一个具名音频或视频音轨", "模式、时间范围和必要的说话人证据边界", "云路线需要明确双开关授权"],
    outputs: ["转写文本；所选模式支持时附时间戳，需要时附匿名 cluster","objective sidecar 与 job 状态","本人归属的精确句段、覆盖范围和不确定性","已存时间结果的实际时间、timestamp_granularity、质量、覆盖与原件/artifact绑定","同一云入口明确的 important_evidence 或 quality_review purpose、分块范围和保存结果","align-only返回绑定音频/稿件的词级时间与质量，不产生第二份ASR正文，lexical_truth_verified=false","桌面听写只处理这次麦克风会话，明确手动发送、暂停与实际目标应用，不建立录音档案"],
    flow: ["查找某段录音时间时先用 transcript-readback 或媒体库 locate-audio，核对已存结果与当前原件 hash","已返回定位缺口且允许补时，只对选中录音走本地 quick + paraformer，复用同一 job；导航不要求云上传或重跑目录","普通录音走 strict","长录音走 long-strict","说话人先聚类再对精确句段做 held-out attribution","重要录音按授权进入唯一云路线","以原音频为权威复核结果","现行 strict 默认 Qwen3-ASR 主引擎加 SenseVoice 交叉检查；quick 可选 SenseVoice 或明确的 Fun-ASR-Nano，具体默认仍读 configs/models.yaml","需要句级时间和匿名说话人时明确 quick/paraformer；重要录音本地交叉证据用 long-strict、fireredasr2-llm 与 qwen3-asr-1.7b，300秒逻辑分块和1秒重叠，FireRed内部片段最多35秒","重要录音的授权云转写与本地双引擎证据分开；job、manifest 和每个 chunk 的 evidence_status 均 verified 才说明本地引擎链完整，不保证逐字准确","已知稿对时明确使用Qwen强制对齐入口，校验UTF-8稿件和实际音频hash；单片≤300秒，长内容沿源项目要求按场景分割，不复用另一段的时间。","严格或高质量双引擎输出要读差异与人工复核材料；两个模型一致也不是逐字正确证明。桌面听写沿独立现有入口，不为普通听写调用云或额外LLM。"],
    boundaries: ["原音频始终高于转写", "云失败不能伪装成本地成功", "其他说话人保持匿名", "空文本和超时不能自动解释为没有内容", "云请求必须在 -Important 与 -QualityReview 中选择一个，并有 -CloudUploadAuthorized；质量复核不是重要证据，也不额外要求两条本地引擎先失败", "已明确的精确云授权跨续作与后代持续有效；不按任意录音数量或反复本地失败自加门", "复用 qwen-audio-3.0-asr-flash 及现有 SecretRef；不创建公网文件 URL、不切 Provider、不让云模型成为普通默认", "云块时间只能帮助定位大段，不等于句级时间、说话人归属或逐字正确；API 成功也不证明人名与文字正确", "media.objective-result.v1 将执行、覆盖、质量与结果分开；只有绑定原音频、请求、模型和完整区间的有效否定证据，才能声称 no_speech_detected；空文本仍可能是无法转写或 indeterminate（无法判断）", "本人声音按精确句段做留出样本比较并结合已知声道、对话角色与语境；一条句段不能代表整个匿名簇，语音向量与内部得分不回传"],
    dependencies: ["E:\\Projects\\Tools\\ChineseASR", "模型 registry", "LocalGpuBroker", "本地私有 person:self profile"],
    tests: "来源9月17日482项回归（1项跳过）以及已知稿对齐/高质量链/听写的分层证据由ChineseASR项目保留；本次只读规范Skill与已发布源码，没有读私人录音、开麦克风、启动权重或发云请求。",
    sourcePath: "E:\\.agents\\skills\\chinese-asr\\SKILL.md",
    endToEndState: "主要模型链有历史真实证据；当前时间戳复用与质量复核不因 Skill 存在就冒充本轮录音 E2E",
    productProcesses: [
    {
        "title": "先看初稿，或认真核对重要录音",
        "request": "先知道录音大意；重要的人名和承诺要核准。",
        "input": "选中一份录音或视频音轨，并说明要快速看内容，还是要对关键话语做更仔细的本地核对。",
        "action": "快速初稿可用 SenseVoice；普通认真转写由 Qwen3-ASR-1.7B 识别，并让 SenseVoice 独立对照。明确要另一条高质量本地路线时，用 FireRedASR2-LLM 与 Qwen 对照。AI 会保留两份结果不一致和需要回听的地方。",
        "result": "你会得到可阅读或搜索的文字，以及关键分歧、听不清的片段和实际覆盖范围；只有所选处理方式能给时间时才附时间。",
        "boundary": "等待读回同一份任务，不因等待时间到就重做。两套模型意见一致也不证明逐字正确，人名、金额和承诺仍以原录音核对。"
    },
    {
        "title": "找录音里一句话的时间",
        "request": "那句关于改期的话从几分几秒开始？",
        "input": "一份已经选中的原录音和几句能识别那段话的内容线索。",
        "action": "AI 先查看这份原录音已有的时间结果；有未完任务就沿原任务继续。确实没有时间且允许补处理时，只对这一份录音用本地 Paraformer 补句级时间。",
        "result": "你会拿到起止时间、相关文字和时间精度，同时知道哪些内容仍未覆盖。",
        "boundary": "明确只读时只报告时间缺口；不会为定位一句话上传录音或处理整个目录。时间位置也不能单独证明文字和说话人都正确。"
    },
    {
        "title": "已有文案，只需给字幕找时间",
        "request": "稿子已经定了，帮我把每句话对到录音上。",
        "input": "对应音频和已确认的文字稿；不需要再说一遍全文转写需求。",
        "action": "AI 用现有 Qwen 对齐能力寻找稿中词语在音频里的起止位置；录音太长时按实际内容分段处理。",
        "result": "你会得到可用于字幕或画面的词语时间，以及对齐是否可靠的说明。",
        "boundary": "把稿子对到时间不等于重新核实稿子逐字正确，也不会生成配音。稿子与声音不合时先指出冲突。"
    },
    {
        "title": "区分声音，或核对本人说过哪几句",
        "request": "这里有几个人说话？哪些句子能确认是我说的？",
        "input": "点名一份录音和要核对的时间范围；已有本人独立样本由现有项目提供。",
        "action": "AI 先利用仍适用于这份原录音的证据，把不同声音暂时分组；要判断本人时，再按实际说话句段和独立样本比较，并结合已知声道与对话关系。",
        "result": "你会看到哪些句段支持是本人、支持不是本人或仍无法判断，以及实际测过的时间范围。",
        "boundary": "声音分组不是实名或确定人数，一句话不能替同组其余句子作证；不会从这份待判断录音现场建立本人样本。"
    },
    {
        "title": "明确允许后做云端复核",
        "request": "这段重要录音也用云端复核一下，保留和本地结果的分歧。",
        "input": "点名录音、复核目的，并明确允许这份内容上传；录音重要与允许上传是两个决定。",
        "action": "AI 沿现有云端转写路线处理这份录音，把云端与本地结果分别保存和比较，必要时回听原音频。",
        "result": "你会得到云端实际处理结果、与本地不一致的地方和仍需本人或原音频核实的关键内容。",
        "boundary": "云端处理成功不证明人名、逐字文字或说话人正确；云端给的大段时间也不能冒充精确句子时间。失败不改写本地证据。"
    },
    {
        "title": "直接对电脑说话打字",
        "request": "我想在当前输入框里用中文听写。",
        "input": "当前麦克风和目标输入位置；这条路线不需要先选一份录音文件。",
        "action": "桌面听写使用独立的 Qwen 本地路径，本人可以暂停，最后是否发送由本人控制。",
        "result": "你会在实际输入位置看到识别出的文字；入口故障时得到明确的停步原因。",
        "boundary": "不会为了普通听写等待另一模型、自动上传、润色或建立录音档案；文件转写与桌面听写的故障分开处理。"
    }
],
    readerStatus: "主要模型链有来源任务的真实音频证据；本次没有读私人录音、开麦克风或启动模型。转写准确、时间覆盖与本人声音归属在具体录音中分别核对。",
  }),
  skill({
    slug: "timeaudit-diagnostics",
    name: "timeaudit-diagnostics",
    title: "电脑卡顿、当前健康与内存证据",
    status: "已安装 / 历史查询有已验记录 / 新入口本轮未实测",
    statusTone: "mixed",
    maturity: "A",
    summary: "刚刚卡了一下、想知道 TimeAudit 现在是否正常，或需要回看一段内存和硬件记录时，AI 会选择对应的只读入口，把同一时间窗的证据、当前状态和缺口分开。本人用了哪些应用或看了多久屏幕由个人活动查询回答，不由性能采样推算。",
    useWhen: [
      "刚刚发生卡顿、冻结或响应迟缓，需要把历史、原生内存和 Windows 事件对到同一时段",
      "询问 TimeAudit 当前组件、原生日志、备份与最近自动恢复结果是否健康",
      "想按一段时间查看处理器、显卡、内存、磁盘、网络或游戏画面的历史变化",
      "只想看 Windows 已保存的内存记录，或确认那段时间有没有记录"
    ],
    avoidWhen: [
      "要自动启动、停止、修复或重新配置采集器和服务",
      "要通过这个聚合入口读取活动正文、逐进程明细或原始事件消息",
      "把一次峰值、调度抖动或最大进程直接当成根因",
      "把过长的历史拆成大量查询来绕过读取上限"
      ,"查询本人应用或屏幕使用总量；该问题走个人理解库的活动事实入口"
    ],
    inputs: [
      "症状、发生时刻或尽可能窄的时间范围；具名时段使用带时区的起止",
      "要看当前健康、历史指标、综合事件，还是只看原生内存证据",
      "确需测量采集器自身开销时明确这一问题"
    ],
    outputs: [
      "同一请求时段内 TimeAudit、原生内存和 Windows 事件的独立状态、聚合与缺口",
      "当前健康的组件、封闭原生日志、备份和最近watchdog结果；可选两秒采集器开销",
      "精确历史窗口、样本、内部空档、有效游戏帧及不可用测量",
      "实用诊断结论、候选原因与下一项有依据的检查；root_cause_established=false保持明确"
    ],
    flow: [
      "先按问题选择综合事件、当前健康、单项历史或原生内存入口",
      "核对返回schema/owner、实际时间范围、隐私标记、来源状态和evidence_gaps",
      "分别解释当前样本与历史覆盖；局部来源不可用时保留其他有效来源",
      "以实际聚合支持候选原因，交回关键证据、反证、缺口与下一步，不执行修复"
    ],
    boundaries: ["TimeAudit 只是可选历史证据，不单独证明根因", "单次窗口最多 168 小时，不网格化暴力查询", "provider 为速度与语义稳定只返回聚合；进程、路径、标题等字段类别并非天然敏感，可由其他合适路线在有价值时使用", "不调用 Grafana、db_audit、PCConfig cursor 或采集控制入口", "provider unavailable/stale/empty 时回到普通诊断，不把缺数据写成健康"],
    dependencies: [
      "E:\\PCConfig\\tools\\Get-ComputerStutterDiagnostic.ps1",
      "E:\\Projects\\Tools\\TimeAudit\\timeaudit_health.py 与 timeaudit_diagnostic_summary.py",
      "E:\\PCConfig\\tools\\Get-MemoryFreezeEvidence.ps1",
      "TimeAudit 的 TIMEAUDIT_DIAGNOSTIC_SUMMARY_CONTRACT.md、DIAGNOSTICS_OPERATIONS.md；PCConfig 的 docs/recovery/memory-freeze-diagnostics.md"
    ],
    tests: "2026-08-31 12:13（中国时间）历史查询：TimeAudit 44a842e，--hours 1 返回 timeaudit.diagnostic-summary.v1、status=ok、coverage=fresh、3702样本、最新年龄约0.77秒、8个privacy flag均false；12项provider合同测试属于该来源证据，不随网页刷新日期更新。",
    sourcePath: "E:\\.agents\\skills\\timeaudit-diagnostics\\SKILL.md",
    sourceState: "2026-09-24核对已发布 .agents e734251 的规范 Skill；它只负责性能与诊断，个人应用/屏幕使用问题交现有活动事实入口。原历史查询保留原日期，新入口本次未运行。",
    currentTaskState: "2026-09-24核对当前已发布 Skill 的职责边界，没有运行综合诊断、健康或内存入口。2026-09-08历史来源任务的冻结窗与修复后样本仍属于原日期。",
    freshTaskState: "历史来源任务发布和回读不等于此次全新任务自主选择并完成查询",
    evidenceObservedAt: `当前 Skill 来源/安装供应回读：${generatedPanelFacts.observedAt}；一小时真实查询现场：2026-08-31 12:13（中国时间）`,
    evidenceSourceCommit: "a3477df3339878f53de8122311682134cb12fd1b",
    evidenceBasis: `当前 .agents source ${generatedPanelFacts.sourceCommit.slice(0, 7)}、活动 ${retainedERules.releaseId} 中可发现的 TimeAudit diagnostics Skill、TimeAudit PUBLIC main 44a842e 的 provider/contract/tests，以及既有一小时真实聚合查询；个人应用/屏幕使用由个人活动来源查询。源码、安装、provider 现场与因果结论保持分层。`,
    endToEndState: "2026-09-08现有固定诊断入口已真实回读：冻结窗3600条GPU异常仍保留，修复后180条完整有效；最初触发原因未知，未做游戏验收，也未把这次精确命令调用冒充新的自然语言盲验",
    productProcesses: [
    {
        "title": "刚卡顿时对齐同一时段的证据",
        "request": "刚才电脑卡了十几秒，能看出什么吗？",
        "input": "说出症状和大致发生时间即可；AI 选择最短够用的时间窗。",
        "action": "AI 把已保存的性能历史、Windows 事件和内存记录对到同一时段。最近事件可另外看现在的状态；旧事件不会拿此刻的正常状态代替当时。",
        "result": "你会知道哪些证据支持一种可能解释、哪些反对或缺失，以及最值得继续检查的一步。",
        "boundary": "峰值或同时发生的事件只是线索，不自动算根因。历史范围和读取量有上限；记录被截断就明说，不通过反复查询绕过。"
    },
    {
        "title": "确认记录工具现在是否正常",
        "request": "TimeAudit 现在正常吗？会不会自己太占资源？",
        "input": "说明是问当前健康，还是还想了解它此刻的资源开销。",
        "action": "AI 检查采集组件、最近留下的日志、备份和上次自动恢复结果。只有问开销时，才额外做一次短时测量。",
        "result": "你会得到具体哪部分正常、降级或无法检查；问开销时也会看到测量覆盖了哪些进程。",
        "boundary": "程序还在运行或端口能连接不等于采集健康。短时开销未覆盖所有独立组件，查不到的进程不能写成零开销。"
    },
    {
        "title": "回看一项历史指标",
        "request": "昨晚游戏卡的那段，帧率和机器负载是什么样？",
        "input": "给出时段和关注的指标，不必自己写数据库查询。",
        "action": "AI 先看那段是否真的有记录，再解释有效的处理器、显卡、内存、磁盘、网络或游戏画面更新数据。",
        "result": "你会得到带时间范围的变化和实际样本数量，也会看到资料不足以回答的部分。",
        "boundary": "没有游戏画面数据可能是没在运行游戏，也可能是采集失败；温度或电力没有记录不能写成零值或正常。"
    },
    {
        "title": "只检查内存相关记录",
        "request": "只看电脑内存记录有没有覆盖刚才那次卡顿。",
        "input": "发生时段，或直接说只想看记录覆盖。",
        "action": "AI 只读已有的系统内存记录，把实际覆盖与同一采样时刻的内存压力放在一起。",
        "result": "你会知道那段时间是否连续有记录、有哪些内存信号、哪里是空档。",
        "boundary": "一段记录横跨该时间，不等于每时每刻都有样本。单个最大进程或一项抖动也不足以认定卡顿原因。"
    }
],
    technicalSections: [
      {
        "title": "四条入口及其各自结果",
        "paragraphs": [
          "综合结果接受pcconfig.computer-stutter-diagnostic.v1，owner=pcconfig:computer-stutter-diagnostics，status为ok/partial/unavailable。核对请求窗口、逐来源状态、所有隐私标记和assessment.evidence_gaps；root_cause_established=false是设计边界。",
          "明确窗口同时传AfterUtc（不含起点）与UntilUtc（包含终点），时间必须带时区；SkipLive跳过当前快照，旧事件会自动跳过。原生段与事件读取也有限额，截断不得称覆盖完整。"
        ],
        "commands": [
          "# 综合卡顿诊断\n& E:\\PCConfig\\tools\\Get-ComputerStutterDiagnostic.ps1 -Minutes 15 -Json",
          "# 具名历史时段\n& E:\\PCConfig\\tools\\Get-ComputerStutterDiagnostic.ps1 -AfterUtc <带时区起点> -UntilUtc <带时区终点> -SkipLive -Json",
          "# 当前完整健康\n& E:\\Projects\\Tools\\TimeAudit\\.venv\\Scripts\\python.exe -B E:\\Projects\\Tools\\TimeAudit\\timeaudit_health.py",
          "# 历史指标\n& E:\\Projects\\Tools\\TimeAudit\\.venv\\Scripts\\python.exe -B E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py --hours 3",
          "# 原生内存事件\n& E:\\PCConfig\\tools\\Get-MemoryFreezeEvidence.ps1 -Minutes 15 -Json",
          "# 仅原生内存覆盖\n& E:\\PCConfig\\tools\\Get-MemoryFreezeEvidence.ps1 -CoverageOnly -Json"
        ]
      },
      {
        "title": "健康、开销与历史不能互相替代",
        "paragraphs": [
          "timeaudit.runtime-health.v1 / timeaudit:runtime-health的degraded和退出码2是有效诊断结果。--core-only比完整健康窄；--include-overhead只追加两秒、精确主采集器及子进程的测量，RSS相加不等于独占物理内存。PID存在或端口打开不证明采集健康。",
          "历史入口接受timeaudit.diagnostic-summary.v1 / timeaudit:diagnostic-history，支持--after-utc/--until-utc；检查bounds、coverage、gaps、counts与隐私标记。原生内存接受pcconfig.memory-freeze-evidence.v1 / pcconfig:memory-freeze-diagnostics；读取器在Windows PowerShell内聚合后才跨兼容边界，反序列化计数器字符串不是日志损坏。",
          "fresh只证明覆盖请求终点，仍须检查内部空档；rolling_coverage与旧会话尾段分开。System_CollectionGap不是已经证明的睡眠，挂起/恢复、锁屏和熄屏含义不同。FPS、平均FPS和单帧时间也不能互换。调度抖动不是内核 DPC/ISR 延迟，最大进程或绝对池大小也不能直接指认根因。"
        ],
        "commands": []
      },
      {
        "title": "失败、范围与证据日期",
        "paragraphs": [
          "一个Provider无效、缺失或超时时舍弃它的输出，其他独立来源仍可使用；不反复重试或扩大到原始活动记录。此入口不调用db_audit.py、Grafana或Invoke-TimeAuditAnomalyIncrement.ps1，不启停采集器、任务、Docker、网络或电源。",
          "历史备份清单核对不等于本次全文件hash或新的恢复演练。页面原有2026-08-31与2026-09-08记录保持原时间；本次按已发布 Skill e734251 对齐职责边界，综合健康与原生内存入口没有在本次网页任务运行。"
        ],
        "commands": []
      }
    ],
    sourceBytes: 6696,
    sourceSha256: "00ba711564a4ab5f42ed54f70042eba822a77dd6b202cbad5fb7ec962fc0d69e",
    readerStatus: "历史查询有带日期的真实使用记录；综合卡顿、当前健康与原生内存入口已在发布原文确认，但本次没有运行，不能据这页判断电脑此刻正常。",
  }),
  skill({
    slug: "cockpit",
    name: "cockpit",
    title: "看驾驶舱",
    status: "已安装 / 读状态与登记",
    maturity: "A",
    summary: "问电脑和项目现在好不好、有没有要我处理的，AI 先读驾驶舱背后的摘要，讲清偏差、要我做的事、我问的那件和今天该知道的变化。做事时带来的新自动任务、数据来源或长期项目状态，也在同一次改动里登记进驾驶舱。",
    useWhen: [
      "问电脑和项目现在怎么样、有没有要处理的事",
      "解释备份、自动任务等某一块为什么不是正常状态",
      "把新的长期事项加进驾驶舱，或核实一条已完成事项后关闭"
    ],
    avoidWhen: [
      "全机巡检",
      "替代出错项目自己的修复",
      "在网页上停任务、删条目、锁资料或结束授权"
    ],
    inputs: [
      "要了解的电脑、项目或驾驶舱栏目，以及具体问题",
      "当前任务带来的新长期事项、负责人、时间和完成标准"
    ],
    outputs: [
      "偏差、要我做的事、所问现状和今天变化的简明结论",
      "仅相关来源的明细、观察时间和缺口",
      "新长期事项的登记、可核实的关闭条件及驾驶舱二级页"
    ],
    flow: [
      "先读总灯、要你做、知道就行与 AI 在跟的摘要",
      "只调出与问题相关的一块核对标准、来源和观察时间",
      "来源中断超过十分钟时单列缺口，不直接当成故障",
      "说明具体行动和完成标准，AI 在跟只报条数",
      "当前工作新增长期事项时顺手登记；一页放不下先拆二级页",
      "已有事项达到完成标准后，AI 核实并关闭"
    ],
    boundaries: [
      "只按登记标准判断正常；未设标准、未接通、资料锁着分别说明",
      "今天有提交不代表已上线，上线结论看发布回执",
      "顶层只有一个驾驶舱，优先使用其二级页",
      "同一个问题只说一次，正常状态简短带过",
      "修复交给对应项目；驾驶舱网页不直接控制任务或删除事项"
    ],
    dependencies: [
      "驾驶舱摘要及各块来源数据",
      "PCConfig 的状态投影和事项登记入口",
      "个人网站 /cockpit/ 与相关二级页"
    ],
    tests: "公开作者源给出驾驶舱读取和登记的普通请求、八条判断边界及示例；本轮仅接目录和导航，不运行全机巡检、事项写入或状态刷新。",
    sourcePath: "E:\\.agents\\skills\\cockpit\\SKILL.md",
    currentTaskState: "本轮未刷新驾驶舱或写入事项",
    freshTaskState: "本轮未重放新对话驾驶舱查询",
    endToEndState: "目录接线不证明本次真实状态；来源回执按对应项目核对",
    technicalSections: [
      {
        title: "来源判断与事项生命周期",
        paragraphs: [
          "先摘要后相关明细；要你做、知道就行、AI在跟各自保留含义。只认登记标准，来源断开超过十分钟单列缺口，旧记录保留观察时间。",
          "事项需写清人话、负责人、时间和通过标准；只有 AI 核实后关闭。每条、每块、整页可复制给 AI 的说明，技术细节指向本机条目，网页不执行停任务或删除。",
          "本轮文案依据 content/jia 的 skill-cockpit 作者页，使用记录与例子保持各自证据角色；没有读取或修改私人事项。"
        ],
        commands: []
      }
    ]
  }),
  skill({
    slug: "localocr",
    name: "localocr",
    title: "图像理解与精确 OCR 分工",
    status: "已安装 / 三条自然请求验收已通过",
    maturity: "A",
    summary: "处理图片时先看用户真正要什么：只描述场景就用原生视觉；要逐字、坐标、表格或本地处理就用 LocalOCR；既要看画面又要抄文字时，两条路线独立取证并分开呈现。",
    useWhen: ["准确抄写图片里的小字、浅色字或关键数字", "扫描 PDF、多页图片、表格、公式、印章、版面或坐标", "既要描述场景又要准确复制文字", "源像素必须留在本机处理"],
    avoidWhen: ["只需要描述普通照片里的场景、物体、活动、颜色或纹理", "把原生视觉当逐字正确证明", "把 OCR 当场景描述模型", "把空文本直接理解成没有文字", "等待时间到就重复启动同一份识别任务"],
    inputs: ["一张或多张图片、PDF 或明确文件夹", "想要的结果：场景描述、精确文字或两者", "是否要求全部本地处理，以及可选 engine、版面模式和输出格式"],
    outputs: ["场景请求的原生视觉观察","精确 OCR 文字、坐标、置信度、表格和版面结构","API、TXT、Markdown 与 JSON 中确定性的 display_summary（人话状态摘要）","分开的视觉观察、精确文字、识别状态、不确定与冲突","多页任务已经完成页面的检查点、各页覆盖与未完成范围；部分页面有输出不等于整批成功"],
    flow: ["先按请求结果选择原生视觉、LocalOCR 或两路", "只看场景时直接检查原图，不启动 LocalOCR", "精确文字与结构请求走本机 OCR", "混合请求让两条路线独立读取同一原图", "按视觉观察、精确文字、识别状态和冲突合并答案", "复用返回的 job 和 output，区分 deadline、broker、配置和识别失败", "ocr_smart.ps1复用或启动127.0.0.1:18665；auto对每个页面先运行普通OCR，只对有具体薄弱、表格或公式证据的页面升级VL，保留同页第一次结果。要结构化块、HTML表格和坐标时明确structure，不靠全批平均值选一路。", "当前普通PP-OCRv6保留方向与文本行处理，平面截图关闭文档展平；模型Profile在localocr/model_profiles.json选择", "OCR、VL和Structure共享可终止温热worker；同模型复用、换模型重建。取消、执行期限或GPU租约丢失是当前任务的终态，停止worker，不再自动换另一模型继续。"],
    boundaries: ["原生视觉负责场景理解，不是逐字正确证明","LocalOCR 负责精确文字证据，不是场景描述模型","两路冲突时保留分歧并复核原图区域，不静默覆盖","明确要求全部本地时不把源像素交给原生视觉","display_summary 只投影客观状态，不替代原始 OCR 或 objective sidecar","不把 timeout 124 当 OCR 失败，不把空文本当否定结论","GPU 由当前 PCConfig 兼容策略调度：一路 OCR 可与一路 ASR 并行，同类及 Ollama 互斥；普通冲突不创建持久排队任务","health.active_jobs 是忙闲依据；字段缺失是Unknown。400为输入/配置、409为已有任务、503为Broker/租约、504为执行期限；复用返回的准确job位置，不因外层124盲重试","no_text_detected 需要完整执行/覆盖、足够质量、已验证的非空否定证据及原件/请求/模型/配置绑定；普通空TXT或cache_hit不是无文字证明","自动OCR→VL失败时保留的一次OCR只是部分证据；关键字仍需回到原图区域，独立视觉纠正另标原件hash与rect，不能覆盖原始OCR","18666属于ChineseASR，不能作为OCR后备端口；端口冲突由机器事实入口核对","近乎纯色且完成像素/覆盖检查的空页可以有合格无文字证据；普通空TXT、损坏图片或模型没输出仍是Unknown。","模型安装与升级走已验证candidate/current/previous发行，不在活动环境中原地拼依赖；版本配置与真实同输入验收分别核对。"],
    dependencies: ["E:\\Projects\\Tools\\LocalOCR", "WSL Python", "PaddleOCR", "LocalGpuBroker"],
    tests: "原三条自然请求验收保留其来源日期；9月17日Owner175项回归（174通过、1跳过）与9项真实OCR/结构/多页接受结果由项目页独立展示。存在少数字符替换及分层耗时，本页没有重跑图片或把模型通过说成逐字零错。",
    sourcePath: "E:\\.agents\\skills\\localocr\\SKILL.md",
    currentTaskState: "本轮网站任务只核对来源提交、供应状态和公开展示，没有处理新的图片或启动 OCR 模型",
    freshTaskState: "来源 Owner 已用实现盲自然请求分别验收场景只走视觉、精确文字走 OCR、混合请求分离两类证据",
    evidenceObservedAt: "Skill 供应、.agents 与 LocalOCR 远端 main 回读：2026-09-02 12:17（中国时间）",
    evidenceBasis: ".agents source 31278a0 的 LocalOCR Skill、openai.yaml 与自治回归，LocalOCR PUBLIC main acc6d15 的 display_summary 实现/测试，以及来源 Owner 的三条实现盲用户路径；source、install、产品代码、历史真实 OCR 与本轮网站取证保持分层。",
    endToEndState: "场景只用原生视觉、精确文字用 LocalOCR、混合请求分开视觉观察/精确文字/识别状态/冲突的三条用户路径已验",
    readerStatus: "场景、精确文字与混合请求有既有验收；当前页面保留少数字符错误和耗时边界，本次没有重新识别图片，关键文字仍回到原图核对。",
  }),
  skill({
    slug: "personal-health",
    sourceBytes: 3183,
    sourceSha256: "4de570eeeea8b9b7a0a9f1bcba35e4653e221693d0d439750a356f00048bdd3c",
    name: "personal-health",
    title: "个人健康上下文",
    status: "已安装 / 回归通过",
    maturity: "A",
    summary: "回答本人的健康、用药、过敏、检查、趋势、睡眠和活动问题，并在收到新报告或明确刷新设备数据时更新当前健康事实。",
    useWhen: ["问题取决于本人的当前健康资料", "需要解释新检查报告", "需要刷新已登记健康设备数据", "高风险健康建议需要结合权威医学资料"],
    avoidWhen: ["与本人无关的通用健康问题", "恢复旧中央个人系统", "把模型建议写成医生结论", "建立持续后台同步"],
    inputs: ["健康问题、新报告或明确纠正", "设备刷新时的已登记数据入口"],
    outputs: ["基于 CURRENT 的当前回答", "事实、医生意见、模型建议和未知的明确分层", "经 Health Owner 审核的更新"],
    flow: ["普通问题先读完整 CURRENT，够回答就直接用；不额外读旧记忆、原件或项目资料", "高风险和治疗决定结合个人事实核对当前权威医学指导", "新报告、更正或冲突才进入项目规则，读取 SOURCES 与最小必要原件，复核后更新受影响现行段落", "明确刷新 Fitbit 或其他已登记设备时，走项目前台采集、限定范围验真、新摘要和 Health Owner 同任务审阅", "共同本人背景会改变回答时才按个人理解库合同读取；有依据的新背景或更正在同任务回写并回读", "测量、报告/医生结论、本人表述、模型建议与真正未知分别保留"],
    boundaries: ["不读旧记忆代替 CURRENT", "不建中央画像", "不自动持续同步", "不把建议和事实混写", "健康 CURRENT 已能回答时保持快路径，不为每个健康问题额外加载本人理解库", "报告、药物、医学状态和具体健康建议留在健康项目；共同背景分支不复制病历、设备原始数据或另一份本人档案"],
    dependencies: ["个人健康项目的 CURRENT", "高风险问题的权威医学来源"],
    tests: "2026-08-31 项目当前 112 项合成回归通过；它不代表真实账号或医学 E2E。供应元数据已修复并通过 320 字符预算与 quick validation。",
    sourcePath: "E:\\.agents\\skills\\personal-health\\SKILL.md",
    productProcesses: [
    {
        "title": "结合本人现有资料回答健康问题",
        "request": "结合我的情况，这份结果意味着什么？",
        "input": "说出本次症状、问题或选定报告；系统已有的健康事实不需要重新报文件位置。",
        "action": "AI 先读健康项目已整理的现行情况，足够回答就直接使用。涉及治疗或较高风险时，再核对当前权威医学资料，把测量结果、医生结论、本人说法和 AI 的判断分开。",
        "result": "你会得到与本人情况相关的解释、影响决定的未知点和低负担的下一步。",
        "boundary": "出现紧急危险信号时优先说明该怎么办，不等设备刷新。AI 不代替面诊、诊断或处方，也不把没证据的事实填成确定。"
    },
    {
        "title": "把新报告或更正并入现行情况",
        "request": "这份新报告纠正了以前那项结论。",
        "input": "指出新报告或具体更正，以及它会影响哪一个正在讨论的问题。",
        "action": "AI 只在需要时核对相关原件、日期、版本和旧记录，交给健康项目审阅，再更新受影响的现行说明。",
        "result": "你会知道改正了什么、依据是什么、哪处仍有冲突；未被推翻的旧资料继续保留。",
        "boundary": "不会用一份新报告覆盖整份健康档案。共同生活背景只在影响回答时才取用，病历和医疗判断仍留在健康项目。"
    },
    {
        "title": "明确刷新已登记的健康设备",
        "request": "把我已接入的健康设备数据更新一下，再看看这件事。",
        "input": "说明要刷新哪项已登记设备或平台，以及本次想回答的问题。",
        "action": "AI 沿设备现有前台入口采集并保全原始结果，只核对本次判断需要的部分，再生成新的健康摘要供健康项目审阅。",
        "result": "你会看到哪些事实已经更新、哪些数据只是保存下来还不足以判断，以及实际失败或缺口。",
        "boundary": "不要求本人重复提供已登记路径或做工程设置。采集失败不会让不完整数据覆盖现行情况，也不会建立持续后台同步。"
    }
],
    readerStatus: "入口与合成流程已实现；这页只说明产品方法，不展示或重新核对本人健康记录，实际回答要使用那次任务取得的现行资料。",
  }),
  skill({
    slug: "daily-preferences",
    name: "daily-preferences",
    title: "个人理解库与可纠正建议",
    status: "已安装 / 多来源自然查询已发布 / 覆盖与语义逐题核对",
    statusTone: "mixed",
    maturity: "A-",
    sourceKind: "personal_install",
    summary: "把本人经历、取舍与偏好连同可核的消费、出行和设备使用事实放在同一份可纠正的理解库里。普通问答按问题读相关认识和来源；复杂问题再展开原文，不默认全库刷新。手机与云端复用电脑上的同一库，专业事实和行动仍由对应领域负责。",
    useWhen: ["查询、补充或纠正本人的基本情况、真实经历、生活重点、通用价值取舍与偏好","按期间查询已知消费、行踪、手机或电脑使用以及安装软件事实","希望吃喝、购物、旅行、娱乐、工具或审美建议能结合本人已有经历，并解释为什么","某个领域任务需要共同本人背景，或产生有依据、值得以后使用的新认识或更正","用户明确要求更新偏好、按最新资料理解自己或准备投递增量","希望在手机或云端使用、补充和纠正电脑上的同一份本人背景"],
    avoidWhen: ["不相关的普通问题，不加载本人整库", "专业医学、财务计划、工作状态、正式材料或他人关系资料由相应领域维护", "把最新口述自动当作已证事实、把模型评价/模拟经历写成本人真实经历", "因为准备共同背景就提前启动尚未建立的社交或财务项目", "卡号、密码、登录、真实付款或未经授权的外部动作"],
    inputs: ["本人当下原话、补充、更正或改变想法，并保留出处、时间与语境", "事实查询所问的期间、设备或来源；已有数据按问题选取，不要求本人背来源清单", "当前问题需要的核心认识、摘要索引、完整详卡、现行/历史明示及原文候选", "本机 Chrome、Steam 与本人当前已登录 Chrome 中哔哩哔哩的按需更新", "本人投递的具名平台、订单、支付或对话材料；既有原件保持所属来源位置", "领域回写的稳定 delivery-id、来源项目、原始出处与 expected-current-id"],
    outputs: ["同源 CURRENT 短入口与 PROFILE 完整详档：先说明核心经历、价值与判断意义，再按需展开细节和原文","按来源和期间核对的消费、出行或活动事实；手机/电脑覆盖、每日变化、主要应用、GPS 停留/移动/空档分别说明","保留摘要、完整详述、别名和支持/反例/语境证据的可纠正认识","supplement（补充）、temporary（临时表达）、correction（更正）、withdrawal（撤回）各自明确的表达版本；旧内容不会因新表述就自动被抹掉","相关领域已经实际取用的最小本人背景，以及有依据新认识的同任务回写与回读","开放式推荐仍给每域至少 3 个熟悉稳妥、3 个相邻探索、3 个明确推测的新鲜选择，说明具体内容、适合理由与取舍","按需刷新逐来源报告采集/导入变化、语义变化和受影响卡片；重复无变化可返回 no_change","当前来源覆盖、真实缺口与日期；原文命中、程序通过和全面理解不会互相冒充","电脑 MCP 返回同一库中的相关认识、实际回写结果和可继续的位置；确有离线或转交需要时才生成独立阅读文件"],
    flow: [
      "取用本人背景、邮件或私人样本前消费 PCConfig 的同一 B2 资料状态与原截止；screen/factor 仅表示业务分类，不另建锁屏期、任务期或 MCP 期。独立 MCP 与本机共用该记录，连接认证不免资料检查；有效期内按需取用，到期或主动锁定后停止，取消只结束本次未完成请求。 AI 按问题、已有上下文、缺口和后果选择读取深度，不靠字数或关键词固定分流。",
      "整体理解先用核心认识和典型经历概括；需要更多细节时读 profile --index 摘要导航，已知键可直接 profile --key 多卡完整读取",
      "source_materials 是原文候选；需要判断时沿 original 读必要原话与上下文，区分本人说法、转贴、假设和旧 AI 建议",
      "普通自然问题按需要发现来源；明确来源可不靠关键词逐页看 facts，长文默认先预览，需要完整证据时再读 full/original，不能把命中当全文已读",
      "活动问题按所问期间分别读手机与电脑覆盖、每日变化和主要应用；GPS 单独说明停留、移动和空档，设备时长不相加为人的净注意力；安装软件清单只按最新已观察导出解释",
      "领域读取/回写遵从DOMAIN_CONTRACT；共同背景在这里，专业事实仍归领域。领域新结果实质改变共同理解时，由产出结果的任务在阶段交付前回写并回读，不依赖上游扫描或用户抽查；无共同变化则不凑记录。",
      "有新表达时按实际语义区分补充、临时、更正或撤回；更正/撤回指向确切旧表达，同一重试沿用 delivery-id 并核对 expected-current-id",
      "结合真实依据形成 snapshot 摘要/详卡，证据角色区分 supports、contradicts、context；相关现行表达必须被考虑，但不强迫作为支持",
      "证据或卡片失效后复核新旧含义，显式重写受影响详述并回读，保留未被推翻的内容，不停在“已记录”",
      "按提示词选择微信等动态材料及新导出；plan比较实际阅读位置，collect取齐选定窗口，AI读正文和必要上下文、整合或确认无变化后再complete",
      "更新只在本人要求、AI针对真实缺口询问并拿到快照、或手机接入三种触发下进行；普通问答不重采来源，理解库没有定时周更",
      "大群可先读本人参与并补必要对方上下文；真实阅读范围、未取得引用与未读媒体分别保留，不能把收齐或只读本人当作全群已理解",
      "ingest/refresh列出变化记录、退役记录和新失效卡；profile --pending-review取回旧详述，由AI显式复核回写",
      "请求涉及Chrome/Steam/哔哩哔哩时沿既有自动入口；人工来源没有新包就维持原快照",
      "普通补包用 incremental，只有同来源完整权威快照才用 full；新增、增强、减弱或无语义变化都要继续解释",
      "订单/支付、退款、收藏和使用分别判断，事实与偏好推断分开；最后用真实自然问题核对结果能否被当前任务使用",
      "手机或云端经已接通的电脑 MCP 调用同一来源的查询、记录、更正和按需更新接口；已知任务按实际需要读规则与 Skill",
      "旧两份 Google Drive 阅读快照停止日常生成、上传与回读；需要离线或转交文件时仍可显式使用 tools/export_mobile_context.py --output-dir"
    ],
    boundaries: [
  "最新表述的 current 只是版本状态，不是通用最高证据；行动授权、当前自述、事实和稳定推断分层",
  "旧表达只有明确更正/撤回及其关联依据改变时才影响支持；补充默认保留未撤回的旧内容",
  "索引摘要、原文候选或命中数量不等于完整原文已读、全语义已整合或身份事实已认证",
  "支付旁证可靠关联订单时不重复计权；未匹配但有明确品名/商户的有效支付可支持消费事实和可推翻偏好，泛称只证明渠道",
  "可靠同订单链全额退款使原成功行退出普通偏好和复购计数，原事实保留；部分退款、组单或关联不唯一仍为 partial/Unknown",
  "收藏、稍后看、追番追剧只在同账号完整 current set 时局部退役；播放、点赞、投币不因窗口消失清退，移除也不反推不喜欢",
  "Steam的game/demo区分实际游玩与已分类但未玩/仅安装的库内选择；后者只是较弱证据，同条件-1，游玩分钟不加分，当前免费-0.5；问未玩时排除已玩，问游戏时排除application，历史取得方式保持Unknown",
  "一次成功耐用品、软件或行程仍是正向事实；低频、久远、长期未买和没有记录都不自动等于不喜欢",
  "更新只在当前请求内发生，不建后台同步、服务、队列、全生活时间线、向量库或第二数据库",
  "手机与电脑应用时长分别按覆盖解释，不相加为净注意力；2026-09-23前 AppUsage 后台时长失真，不作使用强度或排行，受影响旧认识已撤回或修订",
  "GPS 旧空档原因未知；缺少日期原件、未知记录类型或单位保留 partial，不用已有来源个数推出全历史已读",
  "不存在稳定比价 API 不阻止估价或公开搜索，但不冒充实时最低价；除本人要求唯一选择外，保留选择菜单，不代下单付款",
  "领域共用本人背景不重建旧中央调度，也不复制医学记录、财务账本、工作业务事实或另一份本人档案",
  "原件与数据根仍走现有 PersonalData 保全；没有独立跨机恢复验收，不把程序完成说成全面了解本人",
  "表达时间、事情时期、当时选择与后来反省分别保留；开始/不再须有前后依据，职责内行为不自动写成私人善意，影响含义的角色/时期在概括与详述均保留",
  "手机连接失败按实际错误处理，不因入口来自手机或未逐项测过而预先判定能力不足；同库访问不等于继承另一任务或最高权限",
  "本人资料取用按当前活动资料规则的一份共享 B2 资料期和原截止，不先读私库判断是否应验证。取消只结束本次请求；资料期失效后不复用私人上下文。普通领域判断和样本/作者边界不变；PCConfig P1/P2 已安装复验，P3 真实加密合成实验已独立通过；正式生产 P3、真实资料迁移与生产关闭仍独立核验。",
  "日常理解允许结合生活过程、上下文与反例形成有依据、可修正的推定，不因单件记录未独立证明就永久悬置；推断必须与原话及亲见事实分开，不能虚构来源。",
  "同一认识的摘要保留仍有效的长期主题、当前理由和冲突，不能让最近一处纠错抹掉整张卡的其他意思；实际回答是否用到重要认识单独验收。"
],
    dependencies: ["daily-preferences 私有项目的稳定入口与 DOMAIN_CONTRACT", "现有单一 SQLite、同源 CURRENT/PROFILE、相关详卡和原文证据定位", "需要更新哔哩哔哩时本人当前已登录的外部 Chrome", "专业领域的实际读取/回写入口；材料与媒体原件由各自项目保管"],
    tests: "历史基线：2026-09-07 PRIVATE main 1401051 的185项 Python、14子测试、7项 Node；2026-09-08批次另有15/15定向测试。当前 PRIVATE main 9802ed2 为 daily-preferences.v0.18.0/schema 6，来源任务追加后完整 Python 542项通过并有有限自然查询验收。2026-09-24只读 status 为147来源实例，仍缺 bank_transactions、pinduoduo_orders、cainiao_logistics；京东/美团已按范围接入。2026-09-08的190,266 current/232,496 总记录、72/67 明示及48/194/152认知卡仅为历史聚合，不冒充今天数据。542项与自然任务支持当前链条，仍不证明全库全文已读或未来每题正确。",
    sourcePath: "E:\\.agents\\skills\\daily-preferences\\SKILL.md",
    sourceBytes: 10357,
    sourceSha256: "b2b8421682f62fba74fa78e3b62cfcb21a719f60effa617432a2771d2780f030",
    sourceState: "当前 .agents 已发布 main e734251 的规范 Skill 含按需个人活动/来源查询与三种更新触发；项目 PRIVATE main 9802ed2 的自然查询和来源状态由来源任务另行验收。",
    installState: "canonical junction 已安装并指向唯一源码",
    currentTaskState: "2026-09-24定向核对已发布 Skill 与项目来源任务回执；网站没有重采私人来源、写入本人认识或测试每种手机使用。",
    freshTaskState: "项目已核有限自然问答与真实来源链，单次导入和542项回归仍不代表完整语义集成或未来逐题正确",
    evidenceObservedAt: "2026-09-24：Skill 来源和项目只读 status/验收文档分别核对；旧记录数量仍只属于原观察时点。",
    evidenceSourceCommit: "a3477df3339878f53de8122311682134cb12fd1b",
    evidenceBasis: "已发布 .agents e734251 中现行 Skill、活动 E171 资料规则、daily-preferences PRIVATE main 9802ed2 的来源/自然查询验收；源码、安装、实际来源覆盖与语义效果分层。",
    endToEndState: "手机和云端复用已接通的电脑 MCP；本轮没有用真实私人库写入证明每种手机任务。原两份云端文件的历史交付继续留作历史证据，不再是日常最新来源",
    readerStatus: "来源任务已核真实来源链与有限自然问题；本页没有重新读取私人原文或代表全部历史已被理解。手机、电脑与 GPS 的期间空档，旧 AppUsage 时长失真和未接入来源仍按实际问题说明。",
  }),
  skill({
    slug: "explain-to-me",
    name: "explain-to-me",
    title: "向本人讲明白",
    status: "已安装 / 真实理解效果随任务验收",
    maturity: "B+",
    summary: "当 AI 的解释太绕、背景没交代清楚，或我直接说没听懂时，它利用已有的具体理解反馈，把眼前问题重新讲明白；先修好这次说明，再把有用教训合入以后会读的资料。专业判断仍由当前任务负责。",
    useWhen: ["需要向本人解释当前事实、判断、方案或文书", "本人反馈没听懂、表达太绕或没有说人话", "明确的理解反馈值得用于以后的说明"],
    avoidWhen: ["模仿本人聊天口吻", "代替领域任务作专业判断", "直接撰写正式文书正文", "为了每次回答额外开一个模型改写"],
    inputs: ["真实问题、当前人物和事情、已知事实、专业判断与必要背景", "本人已经给出的具体理解反馈和适用语境；有影响的未知才继续问"],
    outputs: ["能理解当前问题的说明，保留事实、理由、不确定性与实际下一步", "有长期用途时，由当前 AI 实际合入并重读的说明教训；没有保存就不声称已经保存"],
    flow: ["当前任务先负责事实、专业判断和具体处理办法", "需要理解反馈时运行 expression.py explain，只读说明指南，不读取本人聊天样本", "同任务已读且上下文足够时复用；没有固定字数、顺序或必须举例的模板", "没听懂时回到原问题，补清人物、事情、判断和必要背景，不让本人挑抽象讲解套路", "收到有价值的明确纠正时，先改当次说明，再按项目 AGENTS 合并语境、适用范围和例外，校验并重读"],
    boundaries: [
  "不从本人发言样本推定讲解偏好",
  "理解库拥有本人背景，领域拥有专业事实和知识状态，按缺口取用而不复制画像",
  "文书正文按文书规范写，解释文书时才使用这个方向",
  "偏好不明时问具体事实或保持未确认，不把猜测写成长期偏好",
  "反馈保存由当前 AI 完成，读取命令不是后台自动学习器；本人的实际理解与认可须另外验收"
],
    dependencies: ["V:\\Personal\\Projects\\personal-expression\\expression.py explain", "E:\\PersonalData\\个人表达\\explain-to-me.md；仅在真实说明任务中按需读取"],
    tests: "personal-expression PRIVATE main 9b174a94375119ee7578b5eb4eaa8e74dabc33f5 的 6 项虚构资料回归已由来源验收；此次只读当前 Skill 与安装链接，没有读取私人反馈或运行真实说明任务。程序形状检查不证明本人已经听懂。",
    sourcePath: "E:\\.agents\\skills\\explain-to-me\\SKILL.md",
    sourceBytes: 1647,
    sourceSha256: "ee4fee60adaa5bd38e005aabf7d45b93dbb3714e5202ca12385e8e8f5031d8fe",
    sourceState: "当前规范 Skill 正文已逐段核对，来源提交早于 2026-09-08T08:00:42Z 冻结截止",
    installState: "用户发现目录是指向 E 盘同名 canonical source（规范源码）的 Junction（目录联接），正文 SHA-256 一致",
    currentTaskState: "本任务正常能力元数据可见，正文已读；未运行 expression.py explain 或读取私人反馈",
    freshTaskState: "未取得新自然请求无提示选中说明入口的验收",
    endToEndState: "真实重讲、反馈写回与本人理解认可未由本网页任务验收",
    evidenceObservedAt: `供应采集：${generatedPanelFacts.observedAt}；Skill 语义与链接核对：2026-09-08T08:06Z—08:18Z；来源截止：2026-09-08T08:00:42Z`,
    evidenceBasis: "当前 Skill bytes/SHA、直接发现链接和来源项目虚构回归分别核对；源、安装、当前可见、无提示路由和本人理解效果分开"
  }),
  skill({
    slug: "reply-as-me",
    evidenceSourceCommit: "83db4ff5c274c309207340114af02bdd9ea99758",
    name: "reply-as-me",
    title: "替本人拟消息",
    status: "已安装 / 真实表达效果随任务验收",
    maturity: "B+",
    summary: "当前任务已经弄清我想表达的意思、沟通目的和分寸后，它把消息写得自然、合适。首次拟写先读已有改稿教训，语料按场景选用；我纠正时先改当前稿，再保存有用教训。它不替我定策略，也不发送。",
    useWhen: ["按已经确定的意思代拟或润色普通消息","本人纠正代拟稿的措辞或分寸","有具体用途，需要按近期或历史窗口补充表达语料"],
    avoidWhen: ["尚未确定战略、战术或真实行动意图却要求它自行决定", "直接撰写正式文书正文", "追求人格克隆、相似度评分或堆砌口头禅", "自动发送消息、全账号扫描或把 AI 草稿当成本人原话"],
    inputs: ["当前任务已定意思、战略和战术，以及会影响措辞的真实前后消息", "首次或纠正时必读的 reply-guide.md；按需选取的同场景本人语料", "调用方已经读过且确实影响含义的图片、语音或动画语境，不只提供一段策略摘要"],
    outputs: ["忠于既定含义、可直接修改的自然消息草稿", "明确反馈后的当次修订，以及确实保存、校验并重读的长期教训", "缺少匹配样本时明确 reference_limited（参考有限），仍可按已定意思拟写"],
    flow: [
      "当前任务先确定事实、行动意图、沟通目的和关系分寸",
      "首次拟写或处理纠正前，先核同一共享资料期再读reply-guide.md；screen/factor只作业务分类，日常协助与独立MCP均消费同一记录。已读未更新且资料期仍有效可复用，指南更新后重读；到期/主动锁定停止取用，取消只结束当前请求。",
      "需要样本时运行 expression.py scenes，再用 reply --scene 读取一份相关场景，不另开模型改写",
      "缺少匹配样本时保留指南、说明参考有限，继续依据既定意思拟稿",
      "保留必要原消息与已知媒体语境，不移植旧样本的人名、日期、地点或事件",
      "纠正先解决当前稿，再按项目 AGENTS 合并教训或按有界窗口补语料，校验和重读；发送留在调用方的独立动作与授权边界"
    ],
    boundaries: [
  "不自行改变策略，不增承诺、道歉、邀约或亲密程度；普通措辞自主决定，只有会改变意思或结果的疑问才问",
  "允许改善旧说法，不追求复刻；普通办事消息按事情本身表达",
  "本人原话、本人修订与 AI 草稿保持不同来源，AI 草稿即使被发送也不自动成为本人样本",
  "只在当前用途与已有范围允许时由现有微信/材料入口补读，不扫描全账号",
  "反馈和语料维护由当前 AI 完成，不建自动学习服务；格式校验不能证明作者身份或表达合适",
  "本人认可、真实媒体特别是动画语境下的效果，以及跨任务无提示路由仍须实际验收",
  "本人资料取用按当前活动资料规则的一份共享 B2 资料期和原截止，不先读私库判断是否应验证。取消只结束本次请求；资料期失效后不复用私人上下文。普通领域判断和样本/作者边界不变；PCConfig P1/P2 已安装复验，P3 真实加密合成实验已独立通过；正式生产 P3、真实资料迁移与生产关闭仍独立核验。"
],
    dependencies: ["V:\\Personal\\Projects\\personal-expression\\expression.py 的 scenes / reply --scene", "E:\\PersonalData\\个人表达\\reply-guide.md 与按场景选择的私人语料；本网页不读取正文", "有界补读时复用当前微信、材料或媒体能力"],
    tests: "2026-09-09 回读 personal-expression PRIVATE main cb9d635d9dbf606a8f729f9746b46227b2737ac1 的只读样本合同；6 项虚构回归是此前 9b174a9 的读取器证据。当前 Skill 已读回字节与安装入口，未读取真实语料、拟写私人回复或进行身份判断。",
    sourcePath: "E:\\.agents\\skills\\reply-as-me\\SKILL.md",
    sourceBytes: 3176,
    sourceSha256: "88659657d9326e5c1ad71fab321a2f4165dabe49c0bdc5e63052bd031ab8ccef",
    sourceState: "本轮定向核对 .agents 已发布 main 83db4ff5c274c309207340114af02bdd9ea99758 中的规范 Skill 原文；未采用进行中的未提交修改。",
    installState: "用户发现目录是指向 E 盘同名 canonical source（规范源码）的 Junction（目录联接），正文 SHA-256 一致",
    currentTaskState: "本轮核对已发布 Skill 与相关活动合同并修正网页说明；未处理私人业务材料或运行真实能力任务。",
    freshTaskState: "未取得新自然请求无提示选中拟消息入口的验收",
    endToEndState: "真实消息草稿、反馈写回、媒体语境与本人表达认可未由本网页任务验收",
    evidenceObservedAt: "2026-09-22：已发布 Skill 正文与活动 E166 合同定向核对；安装、运行与既有业务测试保留各自原观察，不由本轮文字核对刷新。",
    evidenceBasis: "已发布 main 83db4ff 的 skills/reply-as-me/SKILL.md 与活动 E166 相关合同；正文、源码身份与安装/运行/E2E各自区分，未将文字核对当成业务验收。"
  }),
  skill({
    slug: "report-page",
    name: "report-page",
    title: "汇报网页",
    status: "已安装 / 本地网页交付",
    maturity: "A",
    summary: "要展开说明的汇报、请我裁定和长回答，AI 把文字、数字和最合适的图做成白底绿色本地网页：先说结论，再逐项讲清。决策卡让我点选并写说明，一次生成答复粘回对话；简单完成回执和短状态直接在对话里说。",
    useWhen: [
      "需要展开说明的汇报、进度或长回答",
      "有几件事要我裁定，做成有后果说明的决策卡",
      "图、媒体或文档放在页面上更便于理解与判断"
    ],
    avoidWhen: [
      "一句话完成回执或短状态，且没有明确要网页",
      "发布到互联网或替代个人网站",
      "在普通网页里保存密码、密钥和恢复码"
    ],
    inputs: [
      "要讲清的问题、结论、核对过的事实和数字来源",
      "确定做法的选项、各自后果与单列的 AI 建议",
      "明确选择的本地图片、媒体或文件路径"
    ],
    outputs: [
      "经自检的本地 HTML、可读图表和需要时的决策卡",
      "每题的我的说明与整页固定格式答复",
      "页面链接和少量结论；长期开出的决定回到对应项目记录"
    ],
    flow: [
      "先查事实并逐项形成内容文件，选择帮助理解的图",
      "用现有生成命令负责版式、配色、转义和图表",
      "在 Chrome 按代表宽度自检，失败时修正而不交已通过标签",
      "通过后按北京时间命名，存到本地汇报目录，由根会话打开",
      "我点选并填写说明，一次生成答复粘回对话",
      "AI 逐条处理答复；有说明时以说明为准，旧临时页按现有生命周期清理"
    ],
    boundaries: [
      "子代理默认交文字和链接，由根会话决定要不要网页、是否打开",
      "私人照片、视频和录音只引用原文件，不复制成附件或缩略图",
      "页面不替代长期决定记录，不自行对外发布",
      "找不到浏览器或自检未完成时不能报自检通过",
      "本机打开按钮已停用，现役入口保留复制路径、复制原文和页内预览",
      "普通技术取舍由 AI 决定，不为了流程形式制造决策卡"
    ],
    dependencies: [
      "report-page 内容文件、生成模板与自检命令",
      "本人 Chrome 的本地页面验收",
      "E:\\Documents\\AI汇报"
    ],
    tests: "公开作者源区分现存页面使用证据、开发自检和说不准的交互；代表宽度自检覆盖内容结构、决策卡、字号、溢出、媒体与脚本，找不到浏览器不报通过。本轮仅接技能目录，没有生成或打开新汇报页。",
    sourcePath: "E:\\.agents\\skills\\report-page\\SKILL.md",
    currentTaskState: "本轮未生成或打开汇报页",
    freshTaskState: "本轮未重放生成与浏览器自检",
    endToEndState: "网页生成和答复使用有既有证据；当前任务实际页面另验",
    technicalSections: [
      {
        title: "生成、自检与答复",
        paragraphs: [
          "AI 写内容文件，现有命令生成、检查、存放和打开。代表宽度为390、960、1280、1920像素，半屏再以1.5倍字号检查；字段、卡片编号、说明框、DOM、脚本、溢出与媒体代表交互各自核对。",
          "页面答复第一行是标题，每题一行，最后整体补充。有说明时以说明为准；矛盾、误选或没听懂时下一轮讲清，不能替我改选择。",
          "临时页面按现有14天生命周期清理，决定原话归对应长期记录。历史本机打开程序和按钮已停用，保留复制路径、复制原文和页内预览。"
        ],
        commands: []
      }
    ]
  }),
  skill({
    slug: "document-materials",
    name: "document-materials",
    registryName: "personal-formal-documents",
    title: "文书和材料制作",
    status: "已安装 / 2.0.1 虚构生成链已验 / 真实事项未运行",
    maturity: "A-",
    summary: "把必要原件整理成合同、说明、申请、通知、售后材料或附件包，同时生成可编辑文档和 PDF 并逐页检查；文件做完、本人签完、真正递送和对方处理会分开记录。",
    useWhen: ["已有明确目标、接收对象和必要原件，需要形成正式可编辑文书", "需要同源 DOCX、PDF、附件清单或自包含材料包", "需要逐页核对、签名图片存在性与可见性、版本冻结和后续状态留痕", "需要判断当前究竟是已生成、本人已签、可递送、已递送、已收件还是已处理"],
    avoidWhen: ["只修改一个已知 Word/PDF 文件，直接使用文档或 PDF 能力", "只需要找到原件，进入个人材料查找", "持续变化的需求、项目评审与执行跟踪，进入工作交付", "通用翻译、随手文案、普通消息或他人的事务", "没有原件或事实依据就补写内容", "把本地生成、签名或 ready 状态写成外部现实结果", "未经精确授权递送、付款、撤回或联系外部对象"],
    inputs: ["当前事项的目标、接收对象、期限、状态和下一步", "最小必要原件、已确认事实、来源说明与真正未知", "输出格式、附件、签名要求和接收渠道", "需要外部动作时对精确对象、版本、内容和动作的授权"],
    outputs: ["可继续编辑的 DOCX、同源 PDF 和核过附件", "绑定输入、审计、逐页彩色/灰度图与所需签名快照的自包含材料包", "内容、页码、页面边缘、签名图片存在性与可见性、精确文件集合与哈希验收", "produced（已生成）、signed（本人已签）、ready_for_delivery（已具备递送条件）、delivered（已递送）、received（已收件）、handled（已处理）的分层状态", "独立的 counterparty_signed_returned（对方签回）记录、下一步与恢复点"],
    flow: ["判断是否应进入本项目", "读取当前事项并只取必要原件", "分开事实、来源说明、未知和本人决定", "冻结DOCX/PDF、附件、签名和渠道方案", "生成同源成品", "按屏幕或打印用途重读正文与逐页检查：非打印PDF采用彩色层级，打印才另验灰度；历史原件不重着色", "形成自包含ready_for_delivery材料包", "现实动作完成后分别回读递送、收件、处理和对方签回", "中断后先核对最近材料包再继续", "相关本人背景来自个人理解库；形成有依据的新本人信息或更正时按同一合同回写与回读"],
    boundaries: ["私人事实、原件、草稿、签名、成品和回执不进入公开 Git", "整包输入固定不等于每条事实来源已机械闭合，真正未知继续保留", "自动字段/页面验收不等于整篇语义和语气已审完", "本人签名与对方签回相互独立", "ready_for_delivery 明确 delivered=false", "不建立数据库、后台服务、队列或第二套材料系统", "正式文书字段绑定本次明确输入；本人理解库后续更正不追改已经签署、递送或保留为证据的历史成果", "具体事项与处理状态仍由文书项目维护，不复制另一份现行本人档案"],
    dependencies: ["受保护的当前材料状态与原件", "正式文书与材料生成、逐页渲染和校验入口", "必要时的原件定位、消息上下文、录音转写或扫描识别能力"],
    tests: "Skill 快速校验、canonical junction（规范目录联接）与供应事务检查通过；2026-09-01 的 2.0.1 基线保留 526 pass、6 skip、101 subtests，以及隔离 wheel 两个入口用 Microsoft Word + Poppler 完成的虚构 plan/build/verify。本轮只重跑通用文书 32 pass，没有运行真实个人材料或外部递送 E2E。",
    sourceLocatorVisibility: "withheld",
    sourcePath: "withheld:document-materials",
    publicSourceLabel: "个人 Skill 供应链中的“文书和材料制作”入口",
    sourceBytes: 2681,
    sourceSha256: "6c86770191a0895d87eba2fd1657b5f08c0d905bf5581bf9181024898403f0ae",
    sourceState: `文书和材料制作 Skill 内容已正式回读；当前 .agents source ${generatedPanelFacts.sourceCommit.slice(0, 7)}、活动 ${retainedERules.releaseId} 与供应安装现场另行回读，各层分开说明`,
    installState: "canonical junction 已安装并与规范源码一致",
    currentTaskState: "历史安装验收只使用完全虚构样张；本批未制作或递送真实个人材料",
    freshTaskState: "安装后的全新 Sol Max 任务已发现“文书和材料制作”入口；发现通过不等于真实事项执行通过",
    evidenceObservedAt: `当前供应链：${generatedPanelFacts.observedAt}；实现与隔离安装验收：2026-09-01`,
    evidenceSourceCommit: generatedPanelFacts.sourceCommit,
    evidenceBasis: `文书和材料制作 Skill 当前说明、.agents source ${generatedPanelFacts.sourceCommit.slice(0, 7)}、活动 ${retainedERules.releaseId}、公开范围内 ${generatedPanelFacts.skills.publicInstallIntentCount} 个 active install intent、供应事务检查通过、实现项目 PRIVATE main 3ab7fb4、全仓/聚焦回归与隔离 wheel 虚构验收；供应、实现和真实事项证据保持分层。`,
    endToEndState: "PASS（完全虚构安装后 plan/build/verify）；真实个人材料、真实签名和外部递送 E2E 为 not_run"
  }),
  skill({
    slug: "work-delivery",
    name: "work-delivery",
    title: "工作支持与交付",
    status: "已安装 / 工作支持已扩展 / 真实工作价值待验",
    maturity: "B+",
    summary: "真实工作中的资料理解、沟通、决策、评审和成品交付，先在现有项目选择最有用的做法。本人选定2–5份资料并希望保留版本与来源关系后，还须满足二者之一：需要多种一致成品，或者本轮只要PRD但资料明确还会变化，才进入持续来源交付包；一次性问题与文件直接完成。",
    useWhen: [
      "有具体真实工作事项，需要理解资料、准备沟通、判断方案、组织评审或交付结果",
      "本人选定 2–5 份资料并希望保留版本与来源关系；需要多种一致成品，或者本轮只要 PRD 但这些资料明确还会继续变化",
      "已有交付包需要沿原 ID 继续更新",
      "工作任务需要相关真实经历与协作取舍，或产生值得回写的本人认识"
    ],
    avoidWhen: ["只编辑一次单个 Word、PPT 或表格", "没有用户明确选择来源就扫描目录、账号或旧对话", "学习、个人发展或私人文书材料", "未经精确授权发送、发布、审批、建任务或修改外部系统"],
    inputs: [
      "普通工作支持先接收具体事项、当前沟通和已有材料；只有持续来源交付包分支要求2–5份明确来源",
      "持续交付包分支：用户明确选择的 2–5 份需求、会议记录、规则、表格或其他工作资料",
      "持续交付包分支：新持续事项的稳定且非空 package ID、标题和目标；已有交付包使用原 ID 进入更新命令",
      "持续交付包分支：每条候选事实或假设的值、类别、原文证据、动作和非空决定理由",
      "持续交付包分支：本轮实际需要的 docx、pptx、xlsx 格式；只要 PRD 时只请求 docx"
    ],
    outputs: [
      "普通工作分支直接交付这次需要的解释、沟通建议、决策或评审判断，无需先建立交付包",
      "来源覆盖、已确认事实、假设、冲突、未知、质量状态和唯一待决定事项",
      "PRD.md、manifest.json、traceability.csv、产品需求文档.docx、项目评审.pptx、执行跟踪表.xlsx 中本轮实际请求且质量允许的文件",
      "来源变化后的自动重新绑定、过期事实、过期 build 和下一版决定"
    ],
    flow: [
      "先明确实际工作问题，按项目 AGENTS 选择资料理解、沟通、决策、评审或制品路径；不把所有问题强制做成交付包；交付包入口同时要求本人选择2–5份来源并保留版本/来源关系，以及多种一致产物或本轮只要PRD但资料明确继续变化。",
      "需要本人通用背景时按个人理解库 DOMAIN_CONTRACT 读取相关内容；有依据的新认识在当前任务回写并回读",
      "读取项目当前 AGENTS.md 和稳定入口，不在 Skill 里复制实现",
      "新持续 PRD 使用一个 work-delivery.batch.v1 请求提交 package ID、标题、目标、2–5 份明确来源、证据事实和所需格式",
      "尽早交回来源覆盖、关键事实、冲突/缺口与拟采用结构；较长处理或外部等待时给出有依据的区间 ETA（预计完成时间）或下一检查点",
      "把事实、假设、冲突和未知分开，只让用户处理真正需要决定的项目",
      "只有 SQLite 重建的 canonical manifest 报告 quality.status=ready 才调用正式 Office 构建；手写 ready 被拒绝",
      "只要 PRD 时只请求 docx，不等待或启动 PPTX/XLSX",
      "已有 package ID 通过 update-source、impact、review、build、verify 和 artifacts 继续",
      "来源更新时唯一原文自动重新绑定，消失或不唯一的事实和引用变化的旧 build 才过期"
    ],
    boundaries: ["一次性单文件或无持续来源关系的普通文本 PRD 直接使用现成文档、演示或表格能力，不增加交付包", "当前正式输出只有 PRD.md、manifest.json、traceability.csv、产品需求文档.docx、项目评审.pptx、执行跟踪表.xlsx；没有现成项目计划、周报或汇报", "可靠输入仍以本地文本、Markdown 和 CSV 为主；其他格式先由相应能力读取或导出", "AI 分析在项目外，Skill 与项目核心都不内置模型或扫描器", "普通 2–5 份来源尽早给出覆盖、关键事实、冲突/缺口与结构；较长处理或外部等待时按资料长度、冲突、输出与进展给出有依据的时间区间或下一检查点；最终时间按同模型同质量直接基线判断", "事实确认后的确定性 PRD.md + DOCX 目标不超过 15 秒；机械时间不冒充整个工作提速", "缺目标、范围、需求、异常、验收、证据或存在关键冲突时，quality 不得 ready，正式 Office builder 保持 0", "没有交付包导出、SQLite 备份、数据库丢失恢复或跨机器迁移", "外部发送、发布、审批、建任务、邀请和修改复用当前请求或长期明确授权已覆盖的精确目标与动作，并要求项目确有已验证操作；出现新的目标、动作、范围或效果边界时才确认", "共同本人背景不能冒充已确认业务证据；工作事实、交付状态与专业判断留在工作项目，不另维护本人档案", "没有具体事项时不虚构公司、职位、任务或预建台账"],
    dependencies: ["PRIVATE work-delivery-copilot 项目", "work-delivery.batch.v1 规范请求", "现有文档、演示文稿和电子表格运行时作为正式产物构建依赖"],
    tests: "2026-09-07 source main 57bf3c6 已扩大为工作支持与交付，当前项目回归由主项目证据说明。0.2.0 的 37 项测试、两套合成 Office E2E 与 2026-09-01 无路线提示的 draft 阻断验收保留为历史；它们不证明新广义工作场景的实际价值或真实总用时。",
    sourcePath: "E:\\.agents\\skills\\work-delivery\\SKILL.md",
    sourceBytes: 3706,
    sourceSha256: "8c8c389f350fdad9f92c5c546c7cdf0f69cd130cbdcacdd30cdf068373b288a1",
    sourceState: "本轮按独立终审定向核对已发布 .agents main 156387f 的规范Skill原文：持续来源交付的两个同时条件，以及多产物/单PRD未来变化的OR分支。未读取或采用未提交施工。",
    installState: "canonical junction 已安装并与规范源码一致",
    currentTaskState: "本轮修正网站已有说明的来源遗漏或冲突；未执行该能力的真实业务、策略变更、验证码获取或对端测试。",
    freshTaskState: "2026-09-01 fresh Sol Max 的持续交付包路由与 draft 阻断是历史证据；广义工作支持不沿用为本轮 E2E",
    evidenceObservedAt: "2026-09-22：已发布156387f的定向语义核对；安装和历史业务测试保留原观察，未由文字修复升级为当前运行验收。",
    evidenceSourceCommit: "156387f2bdc92ebb43aca9e10509518e206fe8e8",
    evidenceBasis: "已发布156387f skills/work-delivery/SKILL.md；本轮范围为持续来源交付的两个同时条件，以及多产物/单PRD未来变化的OR分支。内容与源身份已核对，安装、运行、新任务和真实端到端证据分别保留，未虚报重测。",
    endToEndState: "既有持续来源包的合成 Office 与无提示 draft 阻断有历史通过；真实工作、首次真实来源变化和同模型同质量时间价值仍为 not_run / baseline_required"
  }),
  skill({
    slug: "learning",
    name: "career-development",
    title: "学习方法技能",
    status: "已安装 / 项目入口",
    maturity: "A",
    summary: "我说要上课、接着学、没听懂或觉得不对，AI 先读学习项目的规则和当前状态，找到今天该讲哪一课，按当天讲义开讲，讲完把学到哪写回去。它只管我的学习、练习、反馈和接续。",
    useWhen: [
      "安排自己的学习路线、讲义和课程",
      "接着上次上课、做练习或确认现在停在哪",
      "没听懂、凭直觉觉得讲义不对，要求重讲和纠错"
    ],
    avoidWhen: [
      "真实工作事项和交付",
      "合同、协议、通知等正式文书",
      "替别人排课，或维护拿来举例的其他项目"
    ],
    inputs: [
      "今天要学的问题、接着上次讲的请求，或具体没听懂的句子",
      "本次练习、反馈或更正；已有当前状态不用从旧计划恢复"
    ],
    outputs: [
      "当天完整讲义与一段一段的讲解、追问和练习",
      "这一课完成没有、日期和分钟，以及下次从哪里继续",
      "有依据的讲义纠错和受影响内容一起修正"
    ],
    flow: [
      "先读学习项目规则，再完整读当前状态",
      "只读当天和当前问题需要的讲义与材料",
      "先说今天讲清什么问题，拿真实请求或只读项目实例解释",
      "讲一小段后停下来让我复述，再按理解追问",
      "核对技术质疑的证据，修改当前讲义和同类错误",
      "下课前说明完成情况，写回当前进度和下一课接续"
    ],
    boundaries: [
      "读取我的学习记录前核对个人资料解锁状态",
      "讲课、写讲义和审稿的模型按学习项目规则，环境做不到时如实说明",
      "技术对错由老师按证据判断；个人经历、目标、花钱、授权和对外动作由我决定",
      "其他项目只读作例子，不改、不跑、不维护",
      "不把整套资料一次读进来，不从旧计划接任务"
    ],
    dependencies: [
      "学习项目的规则、当前状态与当天讲义",
      "E:\\.agents\\skills\\career-development\\SKILL.md"
    ],
    tests: "本项按已公开作者源的学习入口与边界接线；本轮仅核对现役安装清单和网页数据，不重放真实上课、练习或进度写回。",
    sourcePath: "E:\\.agents\\skills\\career-development\\SKILL.md",
    currentTaskState: "本轮未重放真实上课与进度写回",
    freshTaskState: "本轮未在全新学习对话验收",
    endToEndState: "作者源保留既有课程方法；真实课堂结果不由目录接线证明",
    technicalSections: [
      {
        title: "规范入口和网页别名",
        paragraphs: [
          "网站 /skills/learning/ 对应现役 career-development；发现与安装使用 personal-skill-supply.json 的规范名称。入口先读学习项目规则和当前状态，真实模型安排、讲义和课堂验收由学习项目拥有。",
          "本轮来源限已有公开作者文案 sources/pages/skill-learning/page.json；没有读取个人讲义、学习记录或项目私有材料，也没有把一次安装核对当作课堂端到端结果。"
        ],
        commands: []
      }
    ]
  }),
  skill({
    slug: "documents",
    name: "documents",
    title: "可编辑 Word 文书与逐页验收",
    status: "宿主已集成 / 本轮未跑真实文档",
    statusTone: "mixed",
    maturity: "A-",
    provenance: "宿主集成能力",
    sourceKind: "host_integrated",
    capabilityId: "host:documents",
    evidenceSourceCommit: null,
    summary: "创建、编辑、修订或批注 DOCX时，先按文档用途选结构和样式，再把成品渲染为逐页图片检查裁切、重叠、字体、表格与页眉页脚；只有最后一轮逐页目检通过才交付可编辑文书。",
    useWhen: [
      "创建或局部编辑Word/DOCX，并保留原模板与可编辑结构",
      "整理批注、修订与清洁版，或比较两个文档版本",
      "维护目录、编号、脚注、交叉引用、公式、节布局、合并文档或表格转换",
      "制作Word表单内容控件，或按要求限制编辑",
      "检查可访问性，按需处理文本遮盖、元数据或水印",
      "把已验收DOCX导入原生Google Docs；每个有意义编辑批次都逐页验收"
    ],
    avoidWhen: ["只需要普通纯文本回答", "只读 PDF 而不处理 Word 文档", "只抽出文字或检查文件内部结构，就说整页版面已经通过", "用户只要最终 DOCX 时交付内部 PNG 或调试 PDF"],
    inputs: ["目标内容、受众、用途与输出格式", "可选模板、参考 DOCX 或必须保留的原结构", "需要修订、批注、表单或 Google Docs 导入时的精确要求"],
    outputs: ["可编辑 DOCX", "需要时的修订、批注、表单或原生 Google Docs 成品", "内部逐页 PNG 目检与结构检查结果"],
    flow: ["有模板或参考时保留原结构与风格；新文档无明确视觉方向时仅在选择器可用且本人未拒绝时提供模板，取消/缺失/失败就继续", "先让标题和开篇清楚说明主题、用途、读者行动与事实依据，不用模板示例虚构作者经历", "发现宿主 workspace 依赖", "按模板或文档类型固定结构与样式 token", "创建或做最小局部编辑", "渲染全部页面为 PNG", "逐页检查并修复后重新渲染", "只交付用户要求的最终文档", "普通编辑用python-docx；修订、批注、超链接或字段需要时用包内OOXML工具，修改后仍重新渲染", "目录、页码、SEQ/REF/PAGEREF等域可能有陈旧显示，分别检查逻辑引用与最终渲染；合并文档、节布局和表格跨页由对应任务入口处理", "用户要求原生可编辑公式时保留OMML；未要求原生/可编辑，且满足“无可靠OMML路径”或“复杂展示公式需要更稳定跨渲染保真”任一条件时，可用MathJax高分辨率图像；明确它不是原生公式，并保留原表示方式和实际验收"],
    boundaries: ["bundle（随宿主发布的能力包）版本只记录本次观察，不作为未来准入", "每个有意义的编辑批次后重新渲染并逐页检查", "Google Docs 新文档先生成并验收本地 DOCX，再走原生导入", "渲染失败先按 packaged renderer 日志诊断；尚未完成逐页目检就如实保留缺口", "只用 workspace dependency loader 返回的运行时与 bundle LibreOffice；不因为 bundled 渲染失败就切到本机另一份 Office", "Google Docs 定向 DOCX 导入前先清除 Word 标题边框残留并回验；原生导入能力与外部写入授权仍独立成立", "用户只要 DOCX 时只交付所需最终文件，逐页 PNG 与调试 PDF 留在内部", "批注常不出现在无界面PDF导出中，必须额外核对comments.xml、锚点、关系和内容类型；单靠页面图不能证明批注存在", "接受修订、删除批注、去元数据、加编辑限制或压平公式都按实际要求执行，不为美观丢失原文、审阅历史或可编辑性"],
    dependencies: ["Codex bundled workspace dependencies", "宿主当前 documents capability（文档能力）"],
    tests: "本任务正常能力清单与当前宿主源文件可发现；没有创建、修改或渲染真实制品，Current/Fresh/E2E 保持 Unknown",
    sourcePath: "host:documents",
    observedSourcePath: "E:\\Data\\AppData\\Codex\\plugins\\cache\\openai-primary-runtime\\documents\\26.904.11930\\skills\\documents\\SKILL.md",
    sourceBytes: 42428,
    sourceSha256: "9fcc13c3cc34746b134d4ecf4a3c96c9f464d59944fcc99862b2e69ac953f19e",
    evidenceSourceCommit: null,
    sourceState: "当前宿主规范源文件已读取并核对 SHA-256；版本只是观察，不作未来准入",
    installState: "宿主已集成；按稳定能力发现，不以 bundle 版本准入",
    transactionState: "宿主集成能力不经过个人 Skill 安装事务",
    currentTaskState: "本轮未创建或编辑真实 DOCX",
    freshTaskState: "Fresh task（全新任务）回执 Unknown（未知）",
    endToEndState: "真实文档创建、渲染与逐页验收 E2E 本轮 Unknown",
    evidenceObservedAt: "2026-09-07：宿主当前 bundle 26.904.11930 的真实源文件与本任务能力清单",
    evidenceBasis: "宿主集成 documents capability（文档能力）的源码身份只由结构化来源字段记录；宿主版本不成为准入，本轮没有真实文档 E2E。",
    supplyEvidenceCommand: "Codex workspace dependency loader（工作区依赖发现入口）",
    productProcesses: [
    {
        "title": "新建文档，或只改需要改的部分",
        "request": "按这份参考写一份可编辑的 Word，只改现有文档中的相关段落。",
        "input": "提供内容或现有 Word，说明读者、用途、改动范围；有模板或参考就交给 AI。",
        "action": "AI 先读原结构和样式，尽量只改必要文字与表格。新文档会先讲清主题和读者要做什么；没有指定外观且模板选择可用时，可以选择模板。每次重要修改后都生成全部页面图检查。",
        "result": "你会得到能继续编辑的 Word，最后一轮每页都核过字体、裁切、表格与跨页。",
        "boundary": "模板选择取消或不可用时仍可继续；参考样例不会变成凭空编造的事实。能打开文件或抽出文字不等于版面通过。"
    },
    {
        "title": "审阅、比较和整理版本",
        "request": "比较这两版，保留批注；再给我一份要求的清洁版。",
        "input": "给出明确的旧版、新版，以及批注和修订哪些要保留、哪些要接受或移除。",
        "action": "AI 检查正文差异和审阅记录，需要时逐页比较视觉变化；批注还会检查它指向哪里。只有你明确要清洁版时，才按要求处理修订和批注。",
        "result": "你会得到具体改动说明，以及保留审阅痕迹或整理完成的 Word；需要单独差异文件时才另交付。",
        "boundary": "页面图可能看不到批注，因此不能据图说批注不存在。比较外观也不能代替判断条款和业务含义；最终文件仍需逐页核对。"
    },
    {
        "title": "保留可导航、可继续修改的文档结构",
        "request": "把目录、脚注、引用和表格整理好，公式仍要能编辑。",
        "input": "给出选中文档及需要保留的章节、引用、公式、合并顺序或表格转换目标。",
        "action": "AI 按用途维护标题层级、目录、编号、脚注、内部跳转和交叉引用；需要时把表格与电子表格互转。明确要求可编辑公式时保留 Word 的原生公式结构。",
        "result": "你会得到能导航、引用仍对应正文且可以继续修改的文件；表格转换按要求另给目标文件。",
        "boundary": "目录和页码可能需要更新后才显示新位置，AI 会分别查内部关系和最终页面。若原生公式路线不可用会说明；改用图片公式时会明确它不能在 Word 里像公式那样编辑。"
    },
    {
        "title": "制作能填写的表单并限定编辑范围",
        "request": "让对方只填这些字段，其他内容不要改。",
        "input": "现有文档、真实字段内容，以及允许别人修改的范围。",
        "action": "AI 把需要填写的地方做成 Word 真正可操作的字段；你要求限制编辑时，再设置只读、只允许批注或只填表单的范围。",
        "result": "你会得到可填写且编辑范围符合请求的 Word，并检查字段内容和页面效果。",
        "boundary": "画一张空白表格不等于可填写表单；限制编辑也不等于加密文件或授权密码访问。"
    },
    {
        "title": "改善辅助阅读与文档可用性",
        "request": "帮我看看这份 Word 对使用屏幕阅读器的人是否容易读。",
        "input": "一份文档及其实际读者和使用方式。",
        "action": "AI 检查标题层级、图片说明、真正的表头和链接文字，按实际含义修正，随后重新检查页面。",
        "result": "你会得到已发现的问题、确实修好的部分，以及仍需要人判断的图片或结构含义。",
        "boundary": "自动检查不等于整份文档已通过所有无障碍标准；文件名不能代替图片说明，错误表头也不能机械标记。"
    },
    {
        "title": "按明确目的制作可转交的副本",
        "request": "给我一份遮住指定姓名并去掉作者信息的副本。",
        "input": "精确原文、要处理的文字或模式，以及是否还要清理元数据或增删水印。",
        "action": "AI 保留原件，在副本里处理明确指定的文字、作者信息或水印，再搜索文字并逐页检查外观。",
        "result": "你会得到按本次范围处理的最终 Word，并知道还有哪些对象未覆盖。",
        "boundary": "文字处理不能自动清除图片、图表、嵌入文件或旧修订里藏着的同样内容；不能据一次搜索宣称全部隐藏信息已清除。"
    },
    {
        "title": "交付原生 Google 文档",
        "request": "把这份 Word 变成可继续在线编辑的 Google 文档。",
        "input": "已确认内容或参考 Word，以及明确的在线文档目标和写入授权。",
        "action": "AI 先制作并逐页检查同一份本地 Word，清理可能带到在线文档里的标题边框，再通过现有 Google Drive 导入为原生文档。",
        "result": "你会得到实际创建的 Google 文档；本地制作、视觉检查和在线导入分别有结果。",
        "boundary": "导入能力不可用时只交代这个缺口，不能把本地 Word 说成已经在线创建。内部页面图和调试 PDF 不会当额外成品交付。"
    }
],
    technicalSections: [
      {
        "title": "文档包的使用前提和设计选择",
        "paragraphs": [
          "使用宿主workspace依赖入口返回的Node/Python与包目录；builder写在可写工作区，不放受管依赖目录。只使用该包的LibreOffice绝对路径，不能因失败换用本人桌面安装。源码路径与26.904.11930只是本次来源身份，不是未来版本门。",
          "新文档无模板、参考或视觉方向且list_artifact_templates可用、本人未拒绝时提供一次选择；选择取消/失败/缺失继续。模板模式按template-distill.md与template-create.md保存原模板及task-local artifact.md，不套通用设计覆盖模板。",
          "无更具体要求时，新建为Letter 8.5×11英寸纵向，正文约11–12pt。标题/副标题/各级标题与页眉用黑色；Word Title样式不带下划线、底边框或装饰线。表格按比较/记录用途设置宽度、浅灰D9D9D9边框与真实表头，不固定会裁切的行高；保留真实内容优先于页数或装饰。",
          "首次真正create/edit authoring前只运行一次mark_artifact_operation_started；只读不运行。该记录不是内容或页面验收。"
        ],
        "commands": [
          "# 开始制作的宿主记录\nnode container_tools/mark_artifact_operation_started.mjs --operation-kind create --expected-output-count 1 --output-format docx",
          "# 最后一轮完整渲染\npython render_docx.py <input.docx> --output_dir <本次页面目录>"
        ]
      },
      {
        "title": "审阅、结构与可编辑公式",
        "paragraphs": [
          "普通局部编辑使用python-docx；修订、批注、关系、超链接与字段使用包内OOXML工具并重新渲染。批注检查comments.xml、锚点、rels及content-types；PNG不可靠显示全部批注。",
          "包内tasks分别拥有multi_doc_merge、style_lint_normalize、forms_content_controls、captions_crossrefs、footnotes_endnotes、navigation_internal_links、fields_update与toc_workflow。对应scripts含content_controls.py、captions_and_crossrefs.py、insert_ref_fields.py、internal_nav.py、fields_materialize.py、flatten_ref_fields.py；xlsx_to_docx_table.py与docx_table_to_csv.py按tasks/tables_spreadsheets.md处理表格互转。完整参数在同一宿主包，不用System概述冒充参考。",
          "用户要求native/editable或现有文档已用原生公式时，优先经过测试的OMML，并核对Word与LibreOffice。未要求原生/可编辑，并且“没有可靠OMML路径”或“复杂展示公式需要更稳定跨渲染表现”至少一项成立时，可用MathJax→SVG→高分辨率透明PNG；如实说明图像不可原生编辑，不留原始LaTeX或以普通文字冒充结构公式。"
        ],
        "commands": [
          "# 移除批注的清洁副本\npython scripts/comments_strip.py <input.docx> --out <无批注副本.docx>",
          "# 接受修订的清洁副本\npython scripts/accept_tracked_changes.py <input.docx> --mode accept --out <接受修订副本.docx>",
          "# 逐页版本差异\npython scripts/render_and_diff.py <旧版.docx> <新版.docx> --outdir <差异目录>",
        ]
      },
      {
        "title": "可访问性、转交副本与编辑范围",
        "paragraphs": [
          "a11y_audit检查标题级别、图片descr、表头标记与链接文字；高严重度问题可使其非零退出。自动alt from_filename只提供基线，不代替描述实际图片；first_row只有真实表头才能启用。它不是完整 WCAG 合规证明，仍需按文档实际语义复核。",
          "redact_docx.py在单个w:p内匹配并默认使用等长遮盖，副本处理，模式必须精确；默认涉及页眉页脚和脚注尾注，批注需显式include_comments。图片文字、嵌入对象、图表与删除修订仍须另查，不能用文本节点遮盖保证全清。",
          "privacy_scrub.py清理作者、rsid和相应元数据；set_protection.py按请求设置read-only/comments/forms；watermark_add.py与watermark_audit_remove.py处理水印。每种都按任务明确目的操作，不把它们组成每个Word的强制流水线，最终仍重新渲染检查。"
        ],
        "commands": [
          "# 可访问性报告\npython scripts/a11y_audit.py <input.docx> --out_json <report.json>",
          "# 确认表头后的定向修正\npython scripts/a11y_audit.py <input.docx> --fix_table_headers first_row --out <新副本.docx>",
          "# 精确文本遮盖\npython scripts/redact_docx.py <input.docx> --output <新副本.docx> --pattern <精确模式>"
        ]
      },
      {
        "title": "Google导入、最终交付与真实状态",
        "paragraphs": [
          "Google Docs目标先运行google_docs_title_sanitize.py生成sanitized.docx，再--check；用这一份完成渲染与原生导入。正式Google Drive import_document的upload_mode=native_google_docs；没有插件或导入动作时单独报告该依赖未完成。",
          "render_docx.py生成全部page-N.png，最后一轮逐页100%检查，不能抽样交付；包含公式、脚注、表格跨页、字体、间距与页眉页脚。LibreOffice stderr不单独判失败，要看实际页面/PDF与日志；渲染存在也不证明文字与事实正确。",
          "只交请求的最终制品；内部PNG和调试PDF不主动变成交付。当前宿主能力可发现、源码SHA已核，但本网页任务没有运行真实文档创建、渲染、导入、可访问性修复或其他操作，业务E2E保持Unknown。"
        ],
        "commands": [
          "# 导入前标题清理\npython scripts/google_docs_title_sanitize.py <input.docx> --out <sanitized.docx>",
          "# 标题清理回验\npython scripts/google_docs_title_sanitize.py <sanitized.docx> --check"
        ]
      }
    ],
  }),
  skill({
    slug: "pdf",
    name: "pdf",
    title: "PDF 读写、表单与逐页验收",
    status: "宿主已集成 / 本轮未跑真实 PDF",
    statusTone: "mixed",
    maturity: "A-",
    provenance: "宿主集成能力",
    sourceKind: "host_integrated",
    capabilityId: "host:pdf",
    evidenceSourceCommit: null,
    summary: "读取、生成、检查或填写 PDF 时，同时核对内容结构与真实页面；交互表单还要检查 AcroForm（PDF 表单字段树）、页面控件、字段值和外观流，不能用“画面看见值”冒充字段已经正确写入。",
    useWhen: [
      "读取或审阅版面重要的 PDF",
      "制作正式 PDF",
      "填写仍可继续修改的 PDF 表单",
      "需要逐页检查裁切、重叠、字体、表格或页码"
    ],
    avoidWhen: ["只需编辑 DOCX 源文书", "只看文本提取就判断版面正确", "未经明确要求把可编辑表单压平", "把旧页面图或成功退出码当成本轮 PDF 验收"],
    inputs: ["PDF 原件或要生成的内容与版式要求", "表单字段名、目标值和是否明确要求压平", "页数、关键文本、交互性与视觉验收条件"],
    outputs: ["读取结果、生成 PDF 或已填写表单", "字段树、页面控件、字段值与外观的一致性检查", "全部页面的 PNG 目检结论"],
    flow: ["读取结构与页数", "按任务选择生成、提取或表单路线", "表单同时核对字段树和页面控件", "写入后重新打开并验证逻辑值", "渲染全部页面检查真实外观", "只交付最终 PDF"],
    boundaries: ["bundle 版本只记录本次观察，不作为未来准入", "视觉通过不能替代表单字段树和逻辑值检查", "默认保留表单交互性；只有用户明确要求才压平", "每次有意义更新后重新渲染并检查全部页面"],
    dependencies: ["Codex bundled workspace dependencies", "Poppler", "reportlab、pdfplumber 与 pypdf", "宿主当前 pdf capability（PDF 能力）"],
    tests: "本任务正常能力清单与当前宿主源文件可发现；没有创建、修改或渲染真实制品，Current/Fresh/E2E 保持 Unknown",
    sourcePath: "host:pdf",
    observedSourcePath: "E:\\Data\\AppData\\Codex\\plugins\\cache\\openai-primary-runtime\\pdf\\26.904.11930\\skills\\pdf\\SKILL.md",
    sourceBytes: 7269,
    sourceSha256: "9e429bfc5ada20ccf25a531484e3dcc5da59811d936a7cc5dfd23dbf2dfadd31",
    evidenceSourceCommit: null,
    sourceState: "当前宿主规范源文件已读取并核对 SHA-256；版本只是观察，不作未来准入",
    installState: "宿主已集成；按稳定能力发现，不以 bundle 版本准入",
    transactionState: "宿主集成能力不经过个人 Skill 安装事务",
    currentTaskState: "本轮未读取、生成或填写真实 PDF",
    freshTaskState: "Fresh task（全新任务）回执 Unknown（未知）",
    endToEndState: "真实 PDF 读写、表单与逐页验收 E2E 本轮 Unknown",
    evidenceObservedAt: "2026-09-07：宿主当前 bundle 26.904.11930 的真实源文件与本任务能力清单",
    evidenceBasis: "宿主集成 pdf capability（PDF 能力）的源码身份只由结构化来源字段记录；宿主版本不成为准入，本轮没有真实 PDF E2E。",
    supplyEvidenceCommand: "Codex workspace dependency loader（工作区依赖发现入口）"
  }),
  skill({
    slug: "md-to-pdf",
    transactionState: `供应事务检查通过；供应采集于${generatedPanelFacts.observedAt}，未重跑真实PDF转换或渲染`,
    installState: "保留原供应安装观察；本轮未重新运行已发布统一启动入口，不宣称新版已安装并实测。",
    evidenceBasis: "已发布 main 83db4ff 的 plugins/md-pdf-toolkit/skills/md-to-pdf/SKILL.md 与活动 E166 相关合同；正文、源码身份与安装/运行/E2E各自区分，未将文字核对当成业务验收。",
    currentTaskState: "本轮核对已发布 Skill 与相关活动合同并修正网页说明；未处理私人业务材料或运行真实能力任务。",
    evidenceObservedAt: "2026-09-22：已发布 Skill 正文与活动 E166 合同定向核对；安装、运行与既有业务测试保留各自原观察，不由本轮文字核对刷新。",
    evidenceSourceCommit: "83db4ff5c274c309207340114af02bdd9ea99758",
    sourceState: "本轮定向核对 .agents 已发布 main 83db4ff5c274c309207340114af02bdd9ea99758 中的规范 Skill 原文；未采用进行中的未提交修改。",
    sourceSha256: "b981c44fe740ae4b3ea3617597757aaeb29ddfc1b194d189f1aafa8863e1cb5f",
    sourceBytes: 3022,
    name: "md-to-pdf",
    title: "Markdown 导出 PDF",
    status: "正式源码已更新 / 当前入口运行待验",
    statusTone: "mixed",
    maturity: "A",
    provenance: "本地维护插件",
    summary: "通过PCConfig登记Host Python与统一Playwright核心，在Windows将Markdown转换成可核验PDF。单篇/批量共用资源检查、分页/文字约束、源hash重验与原子替换；Edge CLI fallback已移除。",
    useWhen: ["Markdown 需要正式 PDF", "需要指定视觉样式或演示版式", "需要实际页数符合要求，或控制哪里换页", "中文文件名和路径必须稳定"],
    avoidWhen: ["需要修改原 Markdown 正文", "把渲染成功当语义验收", "绕过现有文档样式约束"],
    inputs: [
      "Markdown绝对路径、PDF绝对输出路径",
      "按需要的--css-file、--profile、--document-style-policy preserve|ignore|reject",
      "可选--expected-pages与重复--require-text；明确可信需求才--allow-network/--allow-scripts"
    ],
    outputs: [
      "通过解析、页数、可提取文字与源一致性检查后原子替换的PDF",
      "源Markdown/CSS未变、资源完整与失败保旧的结果",
      "版面敏感时继续pdf-render-safe的稳定报告与页面目检"
    ],
    flow: [
      "Invoke-MdPdfToolkit.ps1 convert或batch解析PCConfig注册Host Python，复用pdf_export_core.py。",
      "默认neutral；legacy-green只用于既有兼容文档，品牌/项目CSS由消费者拥有。",
      "样式策略默认preserve，保留media等属性；代码和HTML注释示例不当真style，真实PDF_PAGE_BREAK/page-break标记生效。",
      "资源只从选定Markdown/CSS roots读取；HTTP/HTTPS与文档JavaScript默认阻断，缺失或被阻断资源导致失败。",
      "Playwright保持本地Edge/Chrome进程至page.pdf()完成；单篇与批量同核，不使用Edge CLI fallback。",
      "暂存输出必须可解析、非加密且至少一页；expected-pages/require-text通过并重验源hash后才原子替换。",
      "PDF输出不得与Markdown/CSS同一文件；验证失败或源漂移保留上一份已接受PDF。",
      "生成后对版面敏感文档逐页验收；转换成功不替代语义或视觉审查。"
    ],
    boundaries: [
      "转换不改Markdown/CSS原件、不依赖Typora许可",
      "远程资源/文档脚本仅可信实际需求下显式允许，不静默放宽",
      "无Edge CLI fallback，不以弱资源或PDF检查降级",
      "真实页数约束不要求人工分页标记，旧输出不冒充本轮",
      "转换不授权commit/push/email/upload/share，秘密不得藏入CSS/注释/元数据"
    ],
    dependencies: [
      "md-pdf-toolkit统一PowerShell启动器",
      "PCConfig登记的Host Python与Playwright",
      "本地Edge/Chrome与PDF解析依赖"
    ],
    tests: "正式源码cdb09b1将单篇/批量转换收敛到统一核心，并包含资源、样式、页数/文本、源一致性与失败保旧回归。本轮仅核对已发布源码和Skill原文，没有重跑源测试或生成真实PDF；历史回归不升级为新入口当前运行PASS。",
    sourcePath: "E:\\.agents\\plugins\\md-pdf-toolkit\\skills\\md-to-pdf\\SKILL.md",
    endToEndState: "本轮未执行新版真实转换/渲染与逐页目检；已发布源码不等于当前运行或视觉验收通过。"
  }),
  skill({
    slug: "pdf-render-safe",
    transactionState: `供应事务检查通过；供应采集于${generatedPanelFacts.observedAt}，未重跑真实PDF转换或渲染`,
    installState: "保留原供应安装观察；本轮未重新运行已发布统一启动入口，不宣称新版已安装并实测。",
    evidenceBasis: "已发布 main 83db4ff 的 plugins/md-pdf-toolkit/skills/pdf-render-safe/SKILL.md 与活动 E166 相关合同；正文、源码身份与安装/运行/E2E各自区分，未将文字核对当成业务验收。",
    currentTaskState: "本轮核对已发布 Skill 与相关活动合同并修正网页说明；未处理私人业务材料或运行真实能力任务。",
    evidenceObservedAt: "2026-09-22：已发布 Skill 正文与活动 E166 合同定向核对；安装、运行与既有业务测试保留各自原观察，不由本轮文字核对刷新。",
    evidenceSourceCommit: "83db4ff5c274c309207340114af02bdd9ea99758",
    sourceState: "本轮定向核对 .agents 已发布 main 83db4ff5c274c309207340114af02bdd9ea99758 中的规范 Skill 原文；未采用进行中的未提交修改。",
    sourceSha256: "6b55e5cd3f75fba1b6052ccd2ddb286b8658434f97783b9360359a90788af691",
    sourceBytes: 2717,
    name: "pdf-render-safe",
    title: "PDF 安全渲染与目检",
    status: "正式源码已更新 / 当前入口运行待验",
    statusTone: "mixed",
    maturity: "A",
    provenance: "本地维护插件",
    summary: "通过PCConfig登记Host Python从不可变PDF快照渲染独立generation，完整后原子发布稳定report；源漂移或失败保留旧报告，同prefix锁防止混写，默认保留当前和上一代。",
    useWhen: [
      "需要逐页检查PDF布局",
      "先看全部页面总览，再放大密集或可疑页",
      "需要确认页面图来自同一份 PDF，失败时还可继续看上一份报告",
      "文件名是中文、只看部分页面，或需要明确区分前后两次页面图片"
    ],
    avoidWhen: [
      "只需要核对纯文本而不看布局",
      "用来路不明的程序冒充正式页面渲染器",
      "删除其他任务、未知文件或历史平铺输出"
    ],
    inputs: [
      "PDF路径、output-dir与prefix",
      "dpi、pages和可选contact-sheet；高DPI选页使用不同prefix",
      "需要长期保留旧报告路径时显式--keep-stale"
    ],
    outputs: [
      "稳定<prefix>_report.json及其选中的完整generation",
      "generation内逐页PNG与可选contact sheet的实际路径",
      "snapshot/source SHA、字节、源页数、选页、renderer/version、DPI、尺寸和逐页hash",
      "成功、失败保旧、同prefix竞争或清理warning的独立结果"
    ],
    flow: [
      "Invoke-MdPdfToolkit.ps1 render使用PCConfig注册Host Python。",
      "取得同output-dir/prefix的非阻塞文件锁；竞争失败，不混写。",
      "先复制不可变临时PDF快照，report input_sha256/bytes绑定实际渲染副本。",
      "用真实Poppler和有界timeout生成唯一generation及可选contact sheet。",
      "核验完整输出，并在发布前重新计算源hash；源变化保留旧报告。",
      "完整generation生成后原子切换稳定report；读者沿report实际路径读取，不猜平铺文件名。",
      "失败的未发布generation清理；成功后默认保留当前与最新上一代。",
      "只把该prefix已识别更旧generation送Windows回收站；未知/legacy平铺文件不动，清理失败warning不撤销已接受report，--keep-stale保留历史路径。",
      "先150DPI全量总览，再用不同prefix选页高DPI检查；通常交付PDF而非内部图片。"
    ],
    boundaries: [
      "渲染快照与源二次hash分开，源漂移不发布新结果",
      "稳定report只指向完整generation，失败不覆盖旧报告",
      "同prefix并发采用非阻塞锁；Poppler必须是真实可执行文件",
      "默认当前加上一代，不删除未知文件或legacy平铺输出，不建后台清理",
      "渲染仅证明栅格化；语义完整性、文字提取和页数合同另验"
    ],
    dependencies: [
      "md-pdf-toolkit统一启动器与PCConfig登记Host Python",
      "真实Poppler可执行文件",
      "Pillow与PDF解析依赖"
    ],
    tests: "正式源码cdb09b1包含不可变快照、独立generation、源漂移保旧、原子report、同prefix锁及保留/回收边界回归。本轮只读已发布原文与实现身份，未重跑源测试、真实页面渲染或目检；旧平铺输出验收不作为新generation链运行证明。",
    sourcePath: "E:\\.agents\\plugins\\md-pdf-toolkit\\skills\\pdf-render-safe\\SKILL.md",
    endToEndState: "本轮未执行新版真实转换/渲染与逐页目检；已发布源码不等于当前运行或视觉验收通过。"
  }),
  skill({
    slug: "mojibake-doctor",
    name: "mojibake-doctor",
    title: "中文乱码诊断与修复",
    status: "已安装 / 回归通过",
    statusTone: "pass",
    maturity: "A",
    summary: "诊断 UTF-8、GBK、GB18030、BOM、替换字符、私用区和双重转码，并以预览、备份和原子替换完成可逆修复。",
    useWhen: [
      "中文显示成乱码",
      "怀疑原编码或文件开头的编码标记损坏",
      "出现替换符号或异常私用字符",
      "文件可能被错误转换过两次编码"
    ],
    avoidWhen: [
      "没有原始文件字节，只剩可能已损坏的复制文本",
      "信息已丢失却要求猜出原字",
      "顺着目录链接修改另一个未经确认的源文件"
    ],
    inputs: ["精确文件或目录", "可选编码线索"],
    outputs: ["scan 和 diagnosis", "默认只读 repair plan", "apply 后的 verify 结果和原字节 backup"],
    flow: ["读取 raw bytes", "scan 和 diagnose", "先 preview", "显式 apply", "重新读取并 verify"],
    boundaries: ["单文件 hash-pinned transaction", "原字节 backup", "atomic replace", "信息丢失时回到 Git、备份或重新生成"],
    dependencies: ["本地 Python"],
    tests: "12 项 Python 测试和专门 Skill 测试通过。",
    sourcePath: "E:\\.agents\\skills\\mojibake-doctor\\SKILL.md",
    endToEndState: "主要修复路径已验",
    technicalSections: [
      {
        "title": "诊断怎样决定能不能写",
        "paragraphs": [
          "scan、diagnose、repair预览和verify都只读，写入是精确单文件、源hash固定的事务。必须有当前文件授权、严格可逆解码、当前SHA与诊断一致、候选hash与计划一致、原字节备份和原子替换。",
          "检测只剥离有界、完全可逆的GB18030→UTF-8链，并要求标准常用汉字评分有实质改善，不拿某项目词表作授权。两汉字候选可报中置信，但不能凭字节消除语义巧合，因此不自动修。",
          "带BOM的UTF-16会分类与扫描，不自动重写；无BOM UTF-16与GB18030可能无法仅凭字节区分。GB18030归一必须明确--normalize-from gb18030。U+FFFD可能已经丢失信息，应找Git/备份/重新生成，不能猜回原字。"
        ],
        "commands": [
          "# 扫描与诊断\npython scripts/mojibake_doctor.py scan --path <精确目录> --output <scan.json>\npython scripts/mojibake_doctor.py diagnose --path <精确文件> --output <repair-plan.json>",
          "# 已知GB18030来源才归一\npython scripts/mojibake_doctor.py diagnose --path <精确文件> --output <plan.json> --normalize-from gb18030",
          "# 先预览，再执行及核验\npython scripts/mojibake_doctor.py repair --plan <plan.json>\npython scripts/mojibake_doctor.py repair --plan <plan.json> --apply\npython scripts/mojibake_doctor.py verify --plan <plan.json>"
        ]
      },
      {
        "title": "备份与恢复不会覆盖后来修改",
        "paragraphs": [
          "备份默认在CODEX_HOME\\MojibakeDoctor\\transactions，配置数据根为CODEX_SQLITE_HOME时使用该根；两者都无稳定根则显式--transaction-root，不回退一次性或系统盘位置。",
          "restore先核manifest与原备份hash，在替换前再次核当前candidate hash；观察后有人修改了文件就停止恢复，保留双方，不能用“回到原件”覆盖新改动。递归不跟junction、symlink或reparse point。",
          "中文.ps1保留UTF-8 BOM；Markdown/JSON/YAML/SKILL.md用UTF-8无BOM。普通中文不是乱码证据，GB18030能解码不证明含义正确；不支持文件明确skipped。诊断报告留本地，只在需要时显示片段。"
        ],
        "commands": [
          "# 按原事务恢复\npython scripts/mojibake_doctor.py restore --manifest <transaction.json>"
        ]
      }
    ],
    readerStatus: "本地诊断和可逆修复有回归证据；本次没有修真实文件。当前文件是否可无损修复，要由原字节、诊断计划与写前核验决定。",
  }),
  skill({
    slug: "browser-control-continuity",
    evidenceSourceCommit: "156387f2bdc92ebb43aca9e10509518e206fe8e8",
    name: "browser-control-continuity",
    title: "浏览器连续操作与本地预览",
    status: "已安装 / Fresh 自然路由已验 / 真实浏览证据分层",
    statusTone: "pass",
    maturity: "B+",
    sourceKind: "personal_install",
    summary: "默认接着本人现有外部 Chrome 工作。遇到登录页，先复用已登录会话或选择匹配的已保存账号，保留已填表单；遇到升级断连、本地预览、异步表单或上传假完成时，再按真实缺口恢复和回读。填充、登录、上传与最终提交各自验证。",
    useWhen: [
      "已授权网站操作停在登录页，需要选择 Chrome 已保存账号或继续云端安全登录交接",
      "需要真实浏览本地 HTML，或本人未另选浏览器时应复用外部 Chrome",
      "浏览控制工具报错或缺少运行文件，需要保住原标签页与登录态",
      "表单下拉项依赖前一层异步加载，连续点击会丢状态",
      "需要逐个上传文件并确认页面真正进入成功态",
      "点击提交后必须从新生成的平台记录核对字段和附件",
      "一次跨项目浏览故障已经完成真实恢复，需要判断是否沉淀可复用教训"
    ],
    avoidWhen: ["页面专属字段、收件人、业务规则或提交内容，应留在所属项目", "现有浏览控制能力确实不可用时，不能自造另一套浏览器控制工具", "想用本地恢复权限绕过登录、验证码、网站权限或外部动作授权", "用未经核对的猜测冒充通用故障结论", "需要任意下载第三方二进制或覆盖现有运行文件"],
    inputs: ["当前受管浏览 Provider 的原生操作说明", "现有标签页、控制会话与页面的实时状态", "运行缺口报错中精确的 canonical browser scripts 目录", "用户明确选择的单个上传文件和目标表单", "真实失败、最小恢复与最终页面回读证据"],
    outputs: ["保留或重新接管的同一已登录标签页，必要时同 Profile（浏览器配置档）的新标签页", "当前Host四个运行路径的精确修复、二次无改动与可回退回执；临时兼容文件按实际引用保留或清理", "逐文件 authoritative success（权威成功态）与精确附件数回读", "提交前字段快照、提交后平台记录与实际附件核对", "达到真实证据阈值后原位更新且带退出条件的跨项目浏览教训"],
    flow: [
      "先复用有效登录态；本地 Chrome 登录表单点击用户名或密码框，保留已自动填入内容，否则观察建议弹窗并选择与当前任务匹配的账号行，不点管理密码",
      "弹窗属于 Chrome 界面，DOM 未见不等于没有；用当前提供方支持的界面观察与操作，只有焦点和弹窗已确认才用键盘，不盲按方向键或猜自动填充接口",
      "填入后只看可靠的非秘密填充信号或授权登录结果；密码圆点、单独 :autofill 或被遮盖工具返回空值不能证明成功，不复制字段值或在填充后导出可能含秘密的页面结构",
      "验证码已有获授权获取/填入通道，且当前浏览Provider和适用规则允许时，沿该通道继续；验证码提示本身不触发一律交回本人。设备本地验证、通行密钥、二维码、CAPTCHA、同意或设备批准确实要求本人时才停在该步，完成后沿同页接续。云端浏览器使用自身安全登录交接，不继承本地Chrome或应用内浏览器会话。",
      "默认外部 Chrome，先检查本人现有配置和标签页；用户明确另选时服从选择",
      "本地 HTML 首次导航走已有 HTTP 开发/预览服务；必要临时服务只绑定 127.0.0.1，保留 PID/session、就绪期限与准确清理路径",
      "浏览运行缺口先读当前 App 的 .codex-plugin/plugin.json，核对 service/files、manifest executable、installer 及四条 appServerRuntimePaths，不相信版本号、.tmp、旧 globals 或 latest 别名",
      "允许的本地修复先保存 allowed_origins；latest 无法替换时保留别名，使用当前 Host 旁安装器生成的 extension-host-config.json，设置 manifest path、恢复 origins 并回读",
      "旧Host配置仍指向存在的旧文件时，Inspect比对当前App配置；RepairHostConfig只更新codexCliPath、nodePath、nodeReplPath、browserClientPath，保留channel、代理、未知字段与浏览器现场，重复执行already_current；RollbackHostConfig只在修复后hash仍匹配时回退",
      "先读当前受管浏览能力的原生说明并列出现有受控标签页",
      "控制重置后优先重新取得同一标签页；锁定页保留为备份，只有继续价值更高时才在同一已登录 Profile 新开标签",
      "运行文件缺失时先走官方刷新；无支持路线且满足同官方包族、只补缺失、禁止覆盖时，先 Inspect 再 Repair",
      "helper只补精确缺失的受管官方运行文件，不覆盖既有目标；AppX只读源复制只取字节，不搬运加密元数据，并逐一回读SHA-256",
      "JavaScript内核重置不会刷新MCP Provider已初始化的运行路径，子任务也可能继承旧环境；改好路径后重新连接宿主MCP，或从更新GUI中的新任务真实读取Chrome标签页，不能靠再reset一次证明恢复",
      "当前登记Host配置仍引用临时运行文件时保留文件与receipt（回执）；官方安装已补齐或登记配置不再引用时才Cleanup，避免刚恢复又断开",
      "有专用文件选择器接口时先等待再点击；没有时只点一次上传并立即看真实屏幕，先处理已出现的 Windows 文件对话框，不因界面树漏报而反复点击，再回读页面文件名",
      "每个文件要求页面 authoritative success 与精确文件名回读后才继续",
      "异步控件按实时依赖一层层展开，下一层标签出现后再选择",
      "提交前重读关键字段、附件数与文件名；提交后打开平台记录再次核对",
      "只沉淀会改变后续决定的已核实故障/恢复或本人明确要求，记录触发、范围、证据和退出条件；替换旧指导，不保存私人页面或日志"
    ],
    boundaries: [
      "已保存账号选择不是索取密码明文；账号确实歧义时才问，不任意选择第一项",
      "当前提供方不能操作 Chrome 建议弹窗时，只说明该限制；有获授权 Password Center 凭据才走既有盲填，否则保留准确步骤给本人",
      "指令发现、真实弹窗选择、可靠填入和网站登录分别验收；只填充测试不提交，空表单测试必须先目视确认真正为空",
      "云端会话不继承本地密码、Cookie、扩展、文件或密码中心；不导出凭据或新建本地到云端中继",
      "这是受管浏览能力之上的连续性层，不是第二浏览器客户端、原始自动化服务器或授权旁路",
      "优先保护已填写、已登录和用户拥有的标签页，不先重载、导航或关闭",
      "文件名、100% 进度或页面跳转都不是成功；必须读取页面成功态和最终记录",
      "临时恢复只补精确缺失文件，核对 source/target SHA-256 一致，不覆盖现有目标，并在原生路径恢复后清理",
      "本地恢复本身不产生登录、传输、上传、验证码取用/填入、删除或提交授权；已有精确授权与当前Provider允许的验证码通道可继续，不能禁用验证或换控制面绕过真实本人步骤。",
      "不公开标签页正文、附件名、平台记录 ID、截图、秘密或临时回执内容",
      "跨项目浏览机制归本 Skill，页面字段与业务含义归具体项目",
      "browser-disconnected 表示新会话也无法读取标签页；stale-debugger-unattached 表示新会话正常、仅旧页脱离调试，保留旧页并用同 Profile 新页，不反复 claim/reset",
      "status=ready 只说明 source 路线，不证明可执行健康；临时缓存恢复是官方 source/install 修复之后的窄后备",
      "纯文件生成不启动预览服务；独立 HTML 保持独立文件，临时预览结束只清本任务进程，不建常驻服务"
    ],
    dependencies: ["当前宿主提供的 managed browser Provider（受管浏览能力）", "同一官方 bundled browser package family（浏览器包族）的完整旧版本，仅用于有界缺失文件恢复", "scripts/Invoke-BrowserControlContinuity.ps1 的 Inspect、RepairHostConfig、RollbackHostConfig、Repair、Cleanup", "当前任务 E 盘临时目录中的恢复 receipt"],
    tests: "当前source/install/transaction供应验证通过；2974ba2与2ee0118增加AppX字节复制、四路径配置漂移修复、幂等与对应回退测试。它们验证本地恢复机制；具体连接恢复、真实上传和最终平台提交仍分别取证，本网页刷新不重放业务提交。",
    sourcePath: "E:\\.agents\\skills\\browser-control-continuity\\SKILL.md",
    sourceBytes: 17290,
    sourceSha256: "19055972113c5099e6aab8cf43c92bc41f614ee6539c0bafaeb2c18162380835",
    sourceState: "本轮按独立终审定向核对已发布 .agents main 156387f 的规范Skill原文：验证码已有授权获取/填入通道与真实本人步骤的区分。未读取或采用未提交施工。",
    installState: "canonical junction 已安装，source 与 quick validation 通过",
    currentTaskState: "本轮修正网站已有说明的来源遗漏或冲突；未执行该能力的真实业务、策略变更、验证码获取或对端测试。",
    freshTaskState: "此前自然路由有历史验收；本轮没有新建浏览会话验收当前安装恢复",
    evidenceObservedAt: "2026-09-22：已发布156387f的定向语义核对；安装和历史业务测试保留原观察，未由文字修复升级为当前运行验收。",
    evidenceBasis: "已发布156387f skills/browser-control-continuity/SKILL.md；本轮范围为验证码已有授权获取/填入通道与真实本人步骤的区分。内容与源身份已核对，安装、运行、新任务和真实端到端证据分别保留，未虚报重测。",
    endToEndState: "旧真实任务的标签页保留、上传成功态与提交回读继续是历史证据；当前安装修复必须另以所选浏览器的新会话与只读标签页核对闭合",
    productProcesses: [
    {
        "title": "先确定网页操作对结果是否必要",
        "request": "请在真实网页完成这件事，并核对最后结果。",
        "input": "说明最终要做的事，以及是否明确要求真实网页、交互或线上提交。",
        "action": "明确要网站操作时，AI 使用当前可控制的浏览器完成并读回结果；只要生成文件时，才根据质量需要决定是否额外预览。本人没指定别的浏览器时，先复用现有 Chrome 和标签页。",
        "result": "你会得到实际页面操作与核对结论，或已完成文件和仍未验证的页面行为。",
        "boundary": "AI 自己想预览不会给你增加新要求；浏览器出了问题也不能把原本必须完成的线上操作改称可选。"
    },
    {
        "title": "登录时先利用已经有的账号状态",
        "request": "继续这个登录页，试试我已经保存的账号。",
        "input": "目标网站和账号，以及本次已授权的登录动作；已有填好的表单会保留。",
        "action": "AI 先看是否已登录。确需登录时，在本机 Chrome 观察保存账号建议并选择匹配的一项；如果当前浏览能力操作不了建议，再看是否有已授权的密码中心直接填入路线。",
        "result": "你会分别知道账号建议是否选中、表单是否可靠填好、网站是否真的登录；密码不会交给模型。",
        "boundary": "同名账号不能猜。看到密码圆点不足以证明登录成功；可通过现有授权通道取得验证码时继续，真正需要本人操作的验证则停在原页等待。云端浏览器不继承本机登录。"
    },
    {
        "title": "控制中断时先保留当前页面",
        "request": "刚才浏览器控制断了，表单别丢，接着完成。",
        "input": "现有页面、已经填写或上传的内容、实际错误与最终目标。",
        "action": "AI 先找回原标签页，判断问题出在控制工具、连接、单个页面还是网站。修复后回到原动作；确实不能在原页继续时，也先保留它，再决定是否值得在同一登录环境开新页。",
        "result": "你会得到恢复后的真实网页结果；仍不能继续时会保留当前工作、具体错误和下一次接续条件。",
        "boundary": "修好控制工具不等于表单已提交，新页可操作也不等于旧事务恢复。不会为局部故障直接重置整个浏览器或反复重复失败动作。"
    },
    {
        "title": "填表、上传与提交分别验收",
        "request": "把这份材料上传并提交，确认平台里真的有。",
        "input": "要填的准确内容、精确文件和外部提交的实际授权。",
        "action": "AI 等页面上一层选择完成再选下一层，一次上传一个文件。每个文件真正显示成功后，重读关键字段与附件清单；提交后打开平台生成的记录再核对。",
        "result": "你会得到实际保存的字段、附件数量和文件名，缺一项会说明哪一步未完成。",
        "boundary": "仅看到文件名、上传进度到头或页面跳转都不足以证明成功。补件、撤回或重新提交各按真实平台能力与精确授权处理，不重复点击来试恢复。"
    },
    {
        "title": "需要时查看本地网页实际效果",
        "request": "把这个本地 HTML 打开看看布局和交互。",
        "input": "具体网页文件或项目，以及希望检查的页面行为。",
        "action": "AI 先使用项目已有的开发或预览入口；确需临时预览时启动一段可关闭的本机服务，再用浏览器看真实页面。",
        "result": "你会得到实际页面观察。预览结束后只关闭本任务启动的服务；要继续看时会保留明确停止方式。",
        "boundary": "只要生成文件时不自动开服务，独立 HTML 仍以原文件交付；不改浏览器保护设置来强行预览。"
    }
],
    technicalSections: [
      {
        "title": "当前能力发现先于操作与不可用结论",
        "paragraphs": [
          "第一次浏览动作或宣称不可用前，完整读取当前catalog中选定Provider Skill：外部Chrome为chrome:control-chrome，明确选择应用内才browser:control-in-app-browser；截断正文需补齐。浏览连续性Skill不能代替Provider自己的说明。",
          "执行工具可能叫node_repl js/mcp__node_repl__js，不只搜索browser/chrome名字；先返回精简候选再读选定schema。js_reset与模块路径助手不是执行工具。当前没有执行能力只能说明该缺口，桌面点击工具存在也不授权换控制面。",
          "外部Chrome未运行时使用已有受管能力启动/重连，保留profile与标签；browser-client.getDefault或应用内偏好不替本人选择。文件工作可用API/连接器满足语义请求，但本人指定UI行为就仍需真实UI结果。"
        ],
        "commands": []
      },
      {
        "title": "一般故障恢复与已知修复配方的关系",
        "paragraphs": [
          "按实际调用区分发现、调用、依赖、Provider初始化/transport、单页、网页与业务动作。参数错误不等于坏安装，健康安装也不等于活会话。修前明确改哪一层、保留什么、必要撤销路径与什么观察能检验假设。",
          "调用参数修正、状态变化或有依据恢复才重试；无变化失败应重审原因，不按固定次数堆修复。必要时删除已证无价值的坏层；保留标签、未存内容、登录和无关任务，不为局部故障重置profile、全局网络或整机升级。",
          "取不到策略/配置与明确策略拒绝是不同事实；前者可诊断实际依赖，后者不能靠换面绕过。修复要回到最初用户动作，留下准确错误、已试方法与下一支持路径，而不是用新tab可控证明旧事务恢复。",
          "现有四运行路径与同包族补缺文件、回执和清理是已知窄分支，使用时读references/runtime-recovery.md且服从当前原生Provider。临时本地服务优先端口0，限定就绪期限并只停本任务会话。保留教训只用已验证、影响未来选择的触发/范围/证据/退出条件，不保存私人页面或临时ID。"
        ],
        "commands": []
      }
    ],
  }),
  skill({
    slug: "cloud-asset-channel",
    name: "cloud-asset-channel",
    title: "省流量的云端素材",
    status: "已安装 / 云端审图未启用",
    maturity: "B",
    summary: "同一文件预计让 AI 读两次以上，或一批文件处理流量明显超过文件本身时，把点名文件传到 Cloudflare R2 一份，让能在云里读取的 AI 使用同一版本；本机只收文字结论。上传、版本核对和云端命令任务有入口，正式云端审图仍须通过校准。",
    useWhen: [
      "同一批网站图要审、复核好几轮",
      "以后按需更新还要继续使用的素材",
      "查询本任务流量、云端空间或清理确定没用的云副本"
    ],
    avoidWhen: [
      "只读一次的文件",
      "密码、密钥、恢复码、身份证件和银行卡照片",
      "把上传成功当成正式审图验收，或在云上画图"
    ],
    inputs: [
      "明确点名的文件、用途，以及哪位 AI 会反复读取",
      "要保留、替换或清理的版本状态和实际任务范围"
    ],
    outputs: [
      "绑定本机内容指纹的素材网址和版本登记",
      "云端任务的文字结论与受理状态，失败时的具体缺口",
      "本任务实际上传与下载记录、另列的网络实测和容量提醒"
    ],
    flow: [
      "先判断重复读取是否值得走云端通道",
      "核对点名文件的内容指纹，已有同样内容时复用",
      "上传到 Cloudflare R2，登记路径、指纹、大小、用途、网址和状态",
      "给 AI 使用前重核本机版本；变化时传新版、旧版标已被替换",
      "云端命令任务在云里读素材，本机从文字收件箱取回结论",
      "收尾按状态清理没用的云副本，保留仍有引用的版本并记录流量"
    ],
    boundaries: [
      "正式云端审图未通过校准，当前关闭；命令接通不代表审图可以启用",
      "Codex 本机不能直接收网址图，不下载再上传来冒充省流量",
      "Claude 的本机复核每张图一次读完、一次答完；画图仍在本机",
      "只用 Wrangler 已有网页授权，不新建 API 令牌、不经手密钥原文",
      "不改代理或网络设置，不降低图片质量，不盲目重复提交",
      "云副本无固定过期；有用继续留，只按明确状态清理"
    ],
    dependencies: [
      "Cloudflare R2 桶 wly-ai-assets 与 https://ai.wly0829.cn/",
      "Wrangler 现有网页授权、素材登记表与文字收件箱",
      "Codex 云端命令任务及真实读者能力"
    ],
    tests: "公开作者源区分上传、逐字节核对、去重、删除和记账的开发回执与真实任务验收；旧版云端命令读者已接通，自报 GPT-5.6 Sol，正式审图未通过校准，新版 GPT-6.1 Sol 命令读者待升级。",
    sourcePath: "E:\\.agents\\skills\\cloud-asset-channel\\SKILL.md",
    currentTaskState: "本轮未提交云端任务、上传或删除素材",
    freshTaskState: "新版 GPT-6.1 Sol 命令读者待升级",
    endToEndState: "上传与文字收件箱有既有证据；正式审图关闭，真实任务验收另列",
    technicalSections: [
      {
        title: "版本、流量与读者证据",
        paragraphs: [
          "对象按 SHA-256 内容指纹命名并保留扩展名；每次使用前核对本机版本。同内容去重，改动形成新版本，已被替换或确定没用且无其他引用的云副本按状态清理。",
          "公开作者源保留旧版云端命令读者自报 GPT-5.6 Sol，GPT-6.1 Sol 接线待升级；正式审图必须另通过校准，网站图当前由 Claude Opus 终审。",
          "每个任务记录本机实际上传、下载及网络实测；目标流量不超过所用内容版本大小之和的2倍，超过2.5倍提醒核对重复传输，未观测的失败重试不记作零。容量接近免费10GB时提醒查看付款，10GB不是硬上限。"
        ],
        commands: []
      }
    ]
  }),
  skill({
    slug: "media-person-self",
    name: "media-person-self",
    title: "具名媒体中的本人判断",
    status: "已安装 / 图像已验 / 语音复用",
    maturity: "B",
    summary: "需要判断一张指定照片里的人是不是我，或一段指定录音、视频音轨里有没有我的声音时，它只比较这几个明确文件，分别给出图像框或语音时间段和不确定性；不会扫描媒体库，也不会识别其他人。",
    useWhen: [
      "判断本人是否出现在一张明确照片中",
      "指出照片中疑似本人的人脸位置",
      "判断一段选定录音或视频音轨中的精确片段是否支持本人说话",
      "只处理一个文件或很短的明确列表"
    ],
    avoidWhen: ["扫描相册、目录或整个媒体库", "识别或命名其他人", "建立人脸或声纹库", "把相似度当身份认定", "凭一小段声音就把同一组所有话都算作本人说的"],
    inputs: ["一个具名媒体或很短的显式列表", "私有可撤销 face template 或 held-out voice profile", "语音需要精确时间戳句段和最小已绑定上下文"],
    outputs: ["图像的 present、not detected、no face 或 unknown", "face index、bounding box 或精确音频时间段", "self、other、unknown 的覆盖范围和一句可反驳依据"],
    flow: ["照片使用固定 YuNet 检测和 SFace 比较，按官方未调阈值与唯一可撤销本人模板形成候选框", "录音或视频先运行 ChineseASR 的 speaker-evidence-readback，只对具名原件核hash，不加载模型或返回转写", "已有当前有效证据只回答列出的精确时间区间，并保留覆盖缺口", "没有有效证据才交给 ChineseASR，使用Paraformer时间戳、匿名簇和每簇最多两条清晰句段的held-out（留出样本）证据", "结合已有声道、对话角色与语境，逐句输出self/other/unknown；一条比较不能替未测句段作证", "视觉与语音独立报告；视频只检查音轨，除非另行选定少量静帧"],
    boundaries: ["不暴露模板向量、声纹或内部相似度", "不命名其他人", "不复制或修改源媒体", "不从文件名、时间接近或目录推断身份", "删除或替换 profile 会改变未来判断", "图片仅接受最多20张明确文件并逐一处理，音频/视频一次一个；不跟随目录、通配符或相册", "inferred_self_not_detected只表示已比较人脸未命中；no_face_detected、解码失败、遮挡或模糊不能证明本人不存在"],
    dependencies: ["本地 YuNet 与 SFace", "私有 person:self face template", "ChineseASR 的 Paraformer、时间戳和 held-out voice profile"],
    tests: "照片 adapter 8 项测试通过；语音链复用中文 ASR 的既有句段证据能力，Skill 自身仍缺少一组独立语音回归。",
    sourcePath: "E:\\.agents\\skills\\media-person-self\\SKILL.md",
    endToEndState: "照片路径已验；并发候选不计入",
    readerStatus: "照片适配已有8项测试，语音复用ChineseASR句段证据；Skill仍缺独立语音回归。本次没有比较真实照片或录音，判断始终限定实际测试位置。",
  }),
  skill({
    slug: "local-secret-broker",
    sourceBytes: 16148,
    sourceSha256: "f13b41e0e7ed8fe45f42e60e8690fad08bb23038c87df7f56a296e2dca70e7e2",
    name: "local-secret-broker",
    title: "密码库、程序凭据与本人限时授权",
    status: "独立密码中心已交付 / 当前安装检查有两项非 current",
    maturity: "A",
    summary: "本人可以从完整密码中心程序包打开选定密码库，在本地搜索、查看、复制或维护账号；AI需要给脚本或网页使用秘密时，让密码中心直接交给指定目标。私人资料解锁与有限时长接管另有各自入口、期限和结果，不能用打开密码库代替。当前程序已有正式交付和真实界面操作证据，长期自然使用仍逐项核对。",
    useWhen: [
      "本人想直接打开一份密码库，或查某个服务是否保存了账号或密码",
      "让本人在本地查看或复制一个明确账号字段",
      "让浏览器或程序使用指定凭据，模型不接收明文",
      "执行凭据备份、恢复或轮换",
      "原电脑不可用，要从带来的已登记密码库或备份恢复",
      "本人明确查看一项账号/密码，或一次查看一整张银行卡",
      "维护凭据、导入正式Google密码快照，或核对需保留的来源与副本",
      "确认当前哪些私人资料可访问、原定期限到什么时候",
      "本人明确要求在现有窗口办理有限时长授权",
      "私人资料需要同一共享解锁或主动锁定，先区分规则与运行链当前是否就绪"
    ],
    avoidWhen: ["把密码放进聊天、命令参数、系统环境或普通文件", "未明确请求就揭示明文", "绕过实际需要本人完成的验证、通行密钥或网站人机检查", "设备处于不可信状态"],
    inputs: ["目标服务、账号或 SecretRef", "一个精确 operation", "需要明文时的明确请求和人类因子"],
    outputs: [
  "仅元数据的查找结果与候选名称，只有status=pass、found=false才证明未找到",
  "精确程序注入或浏览器盲填结果，不含密码、银行卡值或访问令牌",
  "本人验证后的本地窗口可显示一个指定账号/密码字段或一整张银行卡记录，明文不进入模型、stdout或JSON",
  "创建、更新、导入、退役、恢复和加密备份各自的真实回读及失败状态",
  "无限制授权的实际范围、原截止、取消/撤销状态；不输出因子秘密",
  "共享资料状态、视图就绪和关闭结果，或明确尚未验证的运行缺口"
],
    flow: [
  "本人明确申请限时授权时，直接运行已安装Invoke-OwnerTakeover.ps1 -Operation Open -Json；Codex只携带当前宿主真实HostTaskId，其他入口不借用。Codex本人验证完成后由宿主沿同一session/request回读消费，其他宿主按实际现役入口核对；不手工串联准备/激活/检查，也不先走下文凭据整链。",
  "网站登录先复用有效会话，或由 browser-control-continuity 选择本地 Chrome 已保存账号；不要因看见登录页就覆盖已填表单或调用密码中心",
  "Password Center 凭据确实需要时才走登记 Browser Bridge 盲填，模型不接收密码且桥本身不提交；该桥不因此获得云端浏览器访问能力",
  "从已安装的C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-SecretBroker.ps1进入；E盘同名入口只是兼容转发，不绕开安装manifest和固定运行时",
  "账号是什么、有没有这项等问题先Lookup，不先List/Discover/Audit；不唯一时只返回最多五个候选名",
  "沿所需reference选择单一动作，复用仍有效的当前身份，不反复预检",
  "Reveal -LocalDisplay需明确字段和一次已登记真人因子；银行卡号、有效期、CVV作为一个加密对象一次显示，不分三次验证",
  "远程会话不能显示普通查看窗口时，仍走Reveal -LocalDisplay并使用-CopyOnly遮盖面板；账号、密码或银行卡字段按明确选择复制到Broker所在电脑的剪贴板，不改走Copy/AgentCopy，不向模型返回明文",
  "程序用AgentSecretRef注入登记目标；浏览器用AgentLogin或精确HTTPS页面的AgentCardFill，Bridge不提交、不向模型回读字段值",
  "精确Set/Update的新值已在当前任务时仅用匿名继承stdin与Runtime能力，不落argv、环境、文件、剪贴板或日志；人工新值用本地界面",
  "变更原子回读、备份与审计；只有Invalid/Revoked/Expired表明需更新，超时、限流或权限不足不证明凭据错误",
  "精确载体恢复由现有RecoverRegisteredCarrier准备请求和新运行绑定，先验证备份再处理所需因子；恢复成功但备份部分失败时仅Backup该carrier_id，不重放恢复",
  "必要保护判断走 ApplyProtectedJudgment：允许、独立锁屏或本人验证由合格主体按具体语境选择，不按动作类别自动隔离",
  "仅独立的设备/入侵保护邀请，才在正式邀请前用StatusVerificationReadiness检查四类软件，PrepareVerificationInvitation后从真实可见邀请起10分钟，显示Passkey/TOTP/Recovery/Account并按正式RecoverDeviceTrust恢复；普通隐私访问不用此入口。",
  "独立设备保护的新软件故障按原事件记录和实际耗时处理；普通验证的五分钟只结束未完成请求，不冻结原有资料期、不自动重试。",
  "当前活动资料规则规定本机与已认证 MCP 消费同一共享 B2 资料期、原截止与真实视图；取消仅结束本次未完成请求，不撤回其他有效期。到期、主动锁定或重启使旧期失效，再按实际状态安全关闭。P1/P2 已正式安装复验，P3 有真实加密合成实验，P4 的 E/G/H 包与离线合成恢复已有来源证据；物理另一台电脑的真人恢复、真实资料迁移和长期使用仍分别验收。",
  "StatusPersonalEnvironment等旧名称只作共同状态/检查/锁定/解锁的兼容入口，不从mode=active、连接或文件可读猜权限。Windows锁屏不充当资料因子，资料期不免除单项密码明文验证。",
  "资料验证成功且所需视图就绪才取用；取消、超时或技术失败分别记录，可信取消后不换因子、不重开，迟到回调不能复活已经终结的请求。"
],
    boundaries: [
      "秘密值不进入公开面板",
      "管理员权限令牌不扩大授权",
      "device untrusted（设备不可信）时失败关闭",
      "载体 ID 只从 PCConfig 登记读取，恢复不依赖旧 C Policy/CoreGoal，也不覆盖仍可读旧备份",
      "替换设备上的恢复码按备份验证，不要求事先已有本地密码数据库；本网站不执行或接收任何秘密",
      "银行卡盲填只支持一个标准autocomplete字段组和本次精确HTTPS目标，填入成功不证明付款或提交",
      "Microsoft默认密码同时是Windows登录密码，标为never_inject，不自动填入浏览器或系统界面",
      "Google密码管理器是独立来源；正式CSV仅按已绑定账号导入增改，移除记录为pending_removed，不自动删除本地密文或回写Google；成功与E/G回读后处理精确导出清理",
      "BitLocker全部恢复项只在专用本地窗口经一次真人因子显示，不循环Reveal、不复制全部、不向模型返回；生产隔离与只读恢复查看是独立能力",
      "同主体官方更新、Bridge失联或超时本身不是设备不可信；device_untrusted仍阻止普通秘密动作，恢复由独立受保护入口负责",
      "查看与复制是不同结果；普通远控客户端可看和点遮盖面板，复制仅写Broker主机剪贴板，远控剪贴板同步仍需另证，不承诺跨设备Codex/ChatGPT投递",
      "合理身份疑点不要求50%阈值；锁屏与最高权限验证独立，普通Hook超时或组件故障不会自动把设备变为不可信",
      "不同运行框架可由自己的适配器核验真实消息或工具调用判断产物；缺少Codex专用字段不阻断无关工作，也不产生最高权限身份",
      "本人主动限时授权不要求事先通过指定模型审批，仍不改变平台要求、真实账号和设备能力；旧已颁发期限不能因改默认或重连延长。",
      "当前 Skill 以活动资料专题的一份共享 B2 资料期为准；旧屏锁/冻结名称只在兼容入口或历史说明中保留。PCConfig P1/P2 正式安装、P3 加密合成实验、P4 离线合成恢复各有证据；这些结果不外推到物理另一台电脑真人恢复、真实资料迁移或长期自然使用。"
    ],
    dependencies: ["PCConfig Password Center（密码中心）", "KDBX 或相应秘密权限来源", "活动保护策略"],
    tests: "历史限时接管与共享资料 P1/P2 安装证据保留原时间。PCConfig §9.5.35 记录密码中心正式综合桌面 epoch299/775 项与 E/G/H 2215 文件完整包回读；安装版私有桌面已有有效全局授权开库、精确搜索和剪贴板 50 条显示。当前只读安装 Inspect 返回 update_available：750 项中 748 current、2 noncurrent 为 secret_broker registry 与并发 dirty catalog，manifest anchor 匹配；不能说当前安装全量 current。本人外观签收、长期自然使用及物理另一台设备真人恢复仍未验。",
    sourcePath: "E:\\.agents\\skills\\local-secret-broker\\SKILL.md",
    endToEndState: "受保护场景按需验收",
    productProcesses: [
    {
        "title": "本人直接打开一份密码库",
        "request": "我自己打开密码库，找一个账号并改一下。",
        "input": "选择已经交付的密码中心程序和一份现有密文库；载体盘符可以变化。",
        "action": "先检查程序包是否完整，再打开‘密码中心.exe’。本人选择一种已登记的验证方法，通过后只进入这份库的独立窗口，可搜索、查看并在窗口内复制、添加、修改或删除记录。",
        "result": "你会看到这份库的实际内容和每次保存结果；程序也维护本地加密备份。",
        "boundary": "缺组件就报告软件缺口，不要求先做设备恢复或登录 Git。关闭窗口、锁屏或换库后需重验；这次开库不会顺手建立资料期或全局授权。"
    },
    {
        "title": "查账号是否存在，或让程序使用密码",
        "request": "有没有这个网站的账号？如果有，帮我在已授权页面登录。",
        "input": "服务或账号名称、具体用途及目标网站或程序；只查是否存在时给普通名称线索即可。",
        "action": "AI 先只查不含密码的候选，确定唯一记录。网站已有登录状态或保存账号可先复用；确需密码中心时，由它把秘密直接填进已授权目标，模型不看明文。",
        "result": "你会知道记录是否找到、是否填入，以及网站是否实际登录；这些结果分开核对。",
        "boundary": "同名对象先分清，失败不自动说明密码错。填入工具不替你点击提交，也不因此把本机密码带进云端浏览器。"
    },
    {
        "title": "本人查看或复制一项秘密",
        "request": "在本机给我看这个账号的用户名和密码。",
        "input": "明确选中一个账号、一个字段或一张银行卡；有同名记录时先确定是哪一项。",
        "action": "本人完成这一次所需验证后，本地窗口展示选中内容。一个互联网账号可一起显示用户名和密码，一张银行卡可作为一项展示；需要复制时在本机遮盖面板操作。",
        "result": "明文只留在本地窗口或本机剪贴板，不进入 AI、聊天或工具回执。",
        "boundary": "查看和复制是不同结果，本机复制不证明远程电脑收到了。磁盘恢复密码使用另一个专用窗口并重新验证，不把所有记录循环显示。"
    },
    {
        "title": "更新账号或从已有备份恢复",
        "request": "更新这个账号；旧电脑不能用了就从现有备份恢复。",
        "input": "精确记录及新值，或已登记的备份与目标环境；本人新值只在本地界面输入。",
        "action": "更新只改变选中记录，保存后核对并加密备份。恢复先验证备份和必要的本人验证，再把新运行环境接上；独立程序打开一份库与整台设备的恢复分别处理。",
        "result": "你会得到记录保存、实际使用、备份与恢复各自的结果，旧可读副本和失败原因也会保留。",
        "boundary": "恢复成功但补备份失败，只重做备份，不重放恢复。来源快照少了一项也不自动删本地密码。"
    },
    {
        "title": "解锁私人资料供当前任务使用",
        "request": "这次请结合我的私人资料回答。",
        "input": "明确本次资料用途；现有访问状态和文件位置由资料入口核对。",
        "action": "本人通过现有资料验证后，建立本机与已认证电脑连接共用的一段资料期限。若正在查看选定密码，也可在同一次验证里明确加上资料访问。",
        "result": "你会知道资料访问是否生效、到什么时候，以及实际所需资料是否能读取。",
        "boundary": "资料期限不等于可以显示每个密码或修改设备。取消只结束本次未完请求，已有期限不因此撤销；到期或主动锁定后停止私人读取。某些真实文件迁移和恢复路径仍须另验。"
    },
    {
        "title": "本人给当前任务一段限时接管授权",
        "request": "给这个任务一段明确的限时授权。",
        "input": "本人明确要授权当前任务，并决定真实范围和持续时间。",
        "action": "AI 直接打开现有授权窗口，由本人填时长并完成验证；随后从同一请求核对实际生效的授权和原截止。",
        "result": "你会得到真实生效的类型、范围与截止；窗口打开本身不算授权成功。",
        "boundary": "资料解锁不会自动升级为接管。取消只结束当前申请；重连不会延长旧期限，各项业务还需核准实际目标和结果。"
    }
],
    technicalSections: [
      {
        "title": "独立完整包与综合安装入口",
        "paragraphs": [
          "独立密码库首选已交付完整包的根入口密码中心.exe。G/H是载体角色，不绑定永久盘符；PCConfig或Git取回完整程序与密文后同样可用，但Git不是解锁依赖。先核对本地完整性，缺组件不通过假设备登记修补。",
          "独立窗口仅管理本人选中的库，提供搜索、添加、查看内复制、编辑、删除及自动加密本地备份。Recovery完全离线；TOTP依赖已登记独立验证端和当前六位码，软件未部署明示未就绪，不能拿二维码或另一因子代替。Passkey/Account也按真实提供方核验，按钮可点或登录成功页不算完成。",
          "窗口关闭、锁屏或换库后重新验证，不产生全局授权。独立包不包含资料授权、无限制授权或剪贴板历史；这些由本机综合入口承担。具体正式交付路径与条件由PCConfig docs/recovery/password-center-m2-operations.md第2节拥有。",
          "本机综合入口使用受保护ProgramData安装、manifest、ACL与固定运行时；E盘同名Broker只是兼容转发。软件、已安装、本人认证、打开密码库和实际使用分别留证，本网页未启动独立密码库。"
        ],
        "commands": [
          "# 日常综合入口\nC:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Open-SecretBrokerPersonalEntry.ps1",
          "# 规范Broker\npwsh -NoProfile -File C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-SecretBroker.ps1 <明确动作参数>"
        ]
      },
      {
        "title": "精确查找、显示与资料组合",
        "paragraphs": [
          "普通账号名称先Lookup -Query -SearchAll -PasswordlessOnly，一次核对candidate_count与每个候选，选中后只消费它的reference。平台名优先互联网账号不等于授权选银行卡；重复条目不证明多个账号。仅status=pass且found=false才证明没找到。已确立ID可用精确Lookup。",
          "Reveal -RevealField Account -LocalDisplay把同一互联网账号用户名与密码一起显示；BankCard也是一个原子对象。Password/Username单字段仍支持。远程复制加-CopyOnly，不能改走Copy/AgentCopy。普通Reveal实际渲染即完成该显示，不等独立窗口关闭；存储成功不能当登录成功。",
          "未明确因子的新human_required请求使用四选一，不从AI默认或Owner记录推定本人选择；RetireSource/RetireCredential可按精确有效owner/runtime authority-admin路径办理，无需再加一轮。OpenBitLockerRecoveryView即使有owner/runtime证据仍要新的本人因子。",
          "Reveal选择器可明确附加唯一共享资料期，沿同一小时输入和原截止；不先VerifyPersonalEnvironment再Reveal。可信取消/拒绝/超时是本次终态，技术故障在原请求有效边界内修复接续，迟到回调不能复活旧请求。"
        ],
        "commands": [
          "# 按普通名称查找\npwsh -NoProfile -File C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-SecretBroker.ps1 -Action Lookup -Query <本人名称线索> -SearchAll -PasswordlessOnly -Json"
        ]
      },
      {
        "title": "操作参考与不能混淆的证据",
        "paragraphs": [
          "单一权限表位于E:\\PCConfig\\docs\\contracts\\pcconfig.secret-broker.md第4.5节；owner takeover、runtime证明与新真人因子分列。按当前请求读Skill references/credential-operations.md、browser-bridge.md、authority-and-trust.md、imports-and-sources.md或bitlocker.md，不把它们串成每次必跑链。",
          "已有精确Set/Update新值只走匿名继承stdin的-AgentSecretFromStdin -AuthorityFactor Runtime，不落命令行、环境变量、文件、剪贴板或日志。其他秘密操作也只给本地或登记目标，不向模型回传。Microsoft默认密码兼为Windows登录密码且never_inject；Google导入、载体恢复、BitLocker查看与三个独立加密域继续遵守原技术边界。",
          "当前活动Codex接管公开路径是一次Open后由Hook自动回读消费；不手工串联Configure/Prepare/Activate/Status/Check，不追加指定模型批准。必要后代沿原请求与截止，业务成功由实际结果证明。独立设备邀请的软件readiness、真实Shown十分钟与普通资料请求五分钟不是同一计时器。"
        ],
        "commands": []
      }
    ],
    evidenceSourceCommit: "e59f0bbc87fc691c1204181503afa818f87213f8",
    sourceState: "2026-09-24核对 .agents 已发布规范 Skill 与 PCConfig 正式交付记录；当前安装 Inspect 为 update_available，两项并发登记内容未 current。源码、正式安装、真实界面和后续自然使用分别记载。",
    readerStatus: "独立密码中心已有正式程序包和开库、搜索、复制的本地真实操作证据；这次网页更新没有打开本人库或使用因子。当前安装检查有两项非 current，长期自然使用与换机真人恢复仍需各自验收。",
  }),
  skill({
    slug: "authorization-file-broker",
    sourceBytes: 9465,
    sourceSha256: "522935d77e00e86cd55e87b19a194825b702b441e2e101685f47c7fe157a4e6f",
    name: "authorization-file-broker",
    title: "最高权限文件加解密与本地编辑",
    status: "本地查看编辑实现已安装 / 真实文件操作未验",
    maturity: "A",
    summary: "本人明确要由 Password Center（密码中心）的最高权限验证来处理选定文件时，这个入口支持加密、整包校验、解密和中断恢复，也能在本地查看或编辑包内一份文本。原件保留，编辑另存为新的已验证文件包；模型不接收文本、密码或密钥。自己用密码或密钥文件控制的库仍走独立 Vault。",
    useWhen: [
      "批量加密明确文件或目录",
      "验证加密包而不把明文写到普通文件",
      "解密到明确目标",
      "中断后继续已授权任务",
      "明确查看或编辑选定包内一个 UTF-8 文本；实际操作需经现有本人验证，真实文件效果逐次验收"
    ],
    avoidWhen: ["扫描磁盘寻找文件", "分析文件语义", "覆盖已存在冲突文件", "删除原文件或加密包"],
    inputs: ["精确源路径和目标；.pcaf 是目录式文件包", "AuthorizationFileEncrypt、Verify、Decrypt、View 或 Edit；查看编辑可给包内 MemberPath", "编辑必须给新的 OutputPath；本人使用既有最高权限因子"],
    outputs: ["加密 bundle 或恢复目录", "不含内容和 key 的 receipt", "冲突与未处理项", "只在本地窗口显示的文本，或另存并验证的新目录包", "status、saved、verified、source_bundle_preserved、plaintext_returned 分别说明结果"],
    flow: ["解析精确对象", "取得最高权限能力", "执行 Encrypt、Verify 或 Decrypt", "中断时从 authenticated state 恢复", "正式 read-back", "调用固定SecretBroker的AuthorizationFileEncrypt/Verify/Decrypt，后续状态和恢复沿同一已认证bundle或operation id", "独立RecoverFromPrivateGit换机恢复只取回本域加密root envelope；新设备创建自己的运行密钥，下一次事务仍使用当前有效因子", "AuthorizationFileView/Edit 只打开已认证索引中的一个UTF-8文本成员；未给MemberPath时本人在本地选择", "编辑保留原包，只在新目录包改选定成员；经过认证恢复与明文哈希验证后才报告saved/verified"],
    boundaries: ["内容和 key 不进入聊天、stdout 或 JSON", "不覆盖冲突", "不删除源", "不扩大到未点名路径", "目录递归拒绝symlink、junction和reparse point，读取中源变化视为失败；不扫描电脑发现文件", "本域有独立随机根、bundle key和每文件key，不与凭据KDBX或Vault共用根、密钥、载荷或运行依赖", "已有恢复文件只有经认证元数据与明文hash证明完全相同时才幂等复用；不同内容保留并报冲突", "加密和校验不授权上传、同步、备份、迁移或删除；这些动作分别依精确授权处理", ".pcaf不变为新的单文件格式；非文本成员仅在本人明确导出时走Decrypt到指定目录", "查看/编辑的根与原文保留在受保护Broker进程，不交普通外部进程；取消、格式不支持、输出冲突、保存或验证失败都不是成功", "文件包内的Vault制品不会被自动再次解密，实际Vault操作仍走独立入口"],
    dependencies: ["Password Center", "活动最高权限链"],
    tests: "既有6项与本地 View/Edit 专项测试保留各自原日期。2026-09-24 PCConfig 只读安装 Inspect 显示 authorization_file_broker.py 与 authorization_file_local_ui.py 两项 source/installed 字节一致且 current=true；整套安装仍 update_available，原因是另外两份 registry。网页任务没有打开真实加密包、运行本人因子或做物理另一台电脑的真人恢复。",
    sourcePath: "E:\\.agents\\skills\\authorization-file-broker\\SKILL.md",
    endToEndState: "文件域安装字节与来源一致；本地 UTF-8 查看/编辑的真实选中文件、本人因子及保存结果仍需实际任务验收",
    technicalSections: [
      {
        "title": "正式安装与内容操作分别验收",
        "paragraphs": [
          "E:\\PCConfig兼容入口转发到C:\\ProgramData\\PCConfig\\AuthorityHost受保护安装；只改源码模块不是部署。沿现有独立密码中心正式installer，保留manifest/ACL/anchor并比对选中已安装模块与来源。",
          "authorization_file_deployment.test.py使用manifest固定Python，在该已安装模块上运行虚构fixtures；它证明安装和数据操作，不证明真实登记因子已走通。source、installed-runtime、human-factor与replacement-device recovery结果各自保留，聚合源回归已含6/5/12基本套件，不能再相加计数。",
          "本轮只读安装 Inspect 已证明文件域后端与本地 UI 的安装字节和来源一致；没有开真实本地窗口、用本人因子或换机恢复。安装 current 不证明选定文件的操作成功。"
        ],
        "commands": []
      },
      {
        "title": "五内容操作和重入条件",
        "paragraphs": [
          "AuthorizationFileEncrypt接受明确SelectedPath与新OutputPath；Verify只验证不落明文；Decrypt仅写明确目录；View/Edit只解析认证索引中一个UTF-8成员，省略MemberPath由本人在本地选择。Edit必须新OutputPath、保留源包与其他成员，并核明文hash后才saved/verified。",
          ".pcaf是目录包，不变成单文件格式。complete标签本身不足，already_complete前仍重认证bundle key/index/object集合与当前选中源事实；中断续跑也重新核对源及已完成对象。",
          "不覆写并发新建的冲突文件；只有认证元数据和明文hash证明相同才幂等复用。目录递归在规范化前拒绝词法路径上的symlink/junction/reparse point，读前后校验身份，源变化失败。恢复根、bundle key、文件key与KDBX/Vault独立。",
          "替代设备的RecoverFromPrivateGit只恢复本域密文根envelope，新设备仍生成自己的device/runtime key，下一次文件事务继续当前因子；不能从恢复资产推出当前操作已授权或运行已完成。"
        ],
        "commands": []
      }
    ],
    evidenceSourceCommit: "e59f0bbc87fc691c1204181503afa818f87213f8",
    sourceState: "2026-09-24核对 .agents 已发布规范 Skill 与 PCConfig 文件域两项安装字节；整套安装当前 update_available，局部文件 current 不代表全部配置 current 或真实文件操作完成。",
    readerStatus: "加密、检查、恢复与本地 UTF-8 查看/编辑已有正式入口；查看编辑的后端和本地窗口安装字节已核对。这次没有处理真实文件或使用本人因子，实际显示与保存结果仍要在请求中验收。",
  }),
  skill({
    slug: "vault-workflow",
    sourceBytes: 7552,
    sourceSha256: "d9e95140c3c4cc2979801ba33a95dad6dfad97ecb7ce450e5c2ad5d71a9f5eb1",
    name: "vault-workflow",
    title: "本地文件加密、查看与备份",
    status: "已安装 / 隔离回归已验",
    maturity: "A",
    summary: "把指定文件加密、在本机查看或修改，再按需取回或做私人密文备份。密码只在本地输入；默认保留原件，改密码保留另一槽位，导出遇到同名冲突不覆盖。AI读取明确状态与恢复计划，不接收秘密，也不把预演、写入和远端回读混成成功。",
    useWhen: ["不打开原文地检查库结构与环境", "在本机查看或编辑指定库里的支持文本", "核对精确密文的私人备份", "明确要求把指定私有仓库的说明文件改成安全占位文字", "将选中的文件或目录加密为新密文，或明确导出到指定目录", "核对一份指定密文的密码，或按格式支持范围更换它的密码", "将密文装入图片载体或从图片取回密文"],
    avoidWhen: ["把它当 Password Center（密码中心）", "把密码交给模型或命令行参数", "向未经确认的公开位置发布密文或资料", "把预演、路径存在或关闭窗口当成保存完成"],
    inputs: ["明确的模式、操作意图和目标库；LocalView/LocalEdit 要求 VaultFile", "本人只在本地输入密码，按库要求选择精确密钥文件", "远端写入还需明确的私人目标、路径和制品", "Encrypt使用InputPath/新OutputPath；DecryptExport明确输出目录；Hide/Unhide分别指定CoverFile/StegoFile及新输出"],
    outputs: ["不含原文的元数据、建议与实际效果状态", "本地窗口中的支持文本，或明确的 saved／未保存／取消结果", "普通密文发布与真实README保护分别核对最终分支及内容字节；已存在安全占位只证明占位，不冒充新密文上传或密码验证", "保留源文件的新加密库、仅写到明确目录的导出文件、或新的图片载体/取回密文"],
    flow: ["先分清仅检查、本地读写还是远端动作", "检查模式只读结构和环境，不自动执行建议", "本地读写明确目标，本人提供所需凭据；不捕获会打印明文的CLI查看输出", "保存前检查成员、原KDF（密码派生参数）和槽位容量；不能保真则停止", "普通发布核对默认分支密文字节；README保护固定来源、保留已有库，真实更新后回读分支、完整占位和密文。响应丢失先查原操作，效果未知不重放。", "Encrypt不删输入；DecryptExport只写明确目录并保留同名冲突", "ChangePassword只支持VAULT03，保持当前KDF并只重加密本次密码解锁槽；其他槽不变", "VerifyPassword只验证一次并丢弃内存原文，不建立可复用授权会话；下一次需要凭据的操作重新在本地输入", "Hide/Unhide仅封装或取回密文，不解密，不弹密码或最高权限因子",
      "容量或共享密钥文件变化先看credential-plan，rebuild生成独立新副本；recovery-check虚构自测不解密真实库。",],
    boundaries: ["密码和原文不返回模型；本地查看编辑不把原文落盘，明确导出除外", "PromptOnly只采集并丢弃输入，不验证密码或自动找库", "编辑不静默更换密钥文件、KDF或丢弃未解锁槽", "回退失败须保留失败状态和密文恢复副本，不能被下一次操作洗成成功", "与密码中心及其最高权限文件入口各自独立", "DecryptExport是明确导出的原文落盘例外，仅可写指定输出目录；其他查看/编辑原文仍不落盘", "WhatIf的planned只说明请求计划，不能证明路径、格式、密码或操作已完成",
      "文本和JSON元数据都只读，精确VaultFile不回退默认库；Encrypt保留输入，DecryptExport逐文件无覆盖提交并报告部分写入，ChangePassword只重加密当前VAULT03槽。VerifyPassword不产生可复用会话。",],
    dependencies: ["vault-tool 的本地容器与加密实现", "PowerShell 适配脚本和本地 Tk 图形界面", "仅远端动作依赖 GitHub 私人目标与现有 gh 工具"],
    tests: "既有41项虚构文件回归保留为历史；f524c18另有六项文件操作的虚构用例；2026-09-12本轮10项通过，覆盖路径冲突、未选槽位、一次性密码验证和取消，真实密码框、私人远端和换机恢复不由隔离测试代替。",
    sourcePath: "E:\\.agents\\skills\\vault-workflow\\SKILL.md",
    endToEndState: "隔离样例已验；真实私人操作未验"
  }),
  skill({
    slug: "project-entry-gate",
    name: "project-entry-gate",
    title: "Git 项目身份入口",
    status: "已安装 / 回归通过",
    statusTone: "pass",
    maturity: "A",
    summary: "在准备改代码、提交、推送、发布或恢复仓库前，它先确认我究竟在哪个仓库，这个仓库是公开还是私有，当前分支和远端是什么，有没有未提交或未同步的改动，以及现在能不能安全继续。它只提供事实，不替用户授权推送。 进入项目维护或准备公开内容时，也会发现已有私有配套文档；收尾分别核对真正修改过的每个仓库，避免公开项目提交了而链接背后的私有修改遗失。",
    useWhen: ["不确定眼前的代码目录实际属于哪个仓库","准备恢复、迁移、推送或发布","需要确认仓库是公开还是私有、默认分支是否正确","同一仓库有多个工作目录，或本地与远端不同步","进入项目维护或准备PUBLIC内容，需要定位已有私有配套文档"],
    avoidWhen: ["已经明确仓库身份、只做普通可逆本地编辑", "把仓库检查结果误当成本人已经授权推送", "Git 动态事实不会改变当前决定却仍做全量扫描"],
    inputs: ["要检查的 GitHub 仓库 owner/repo（仓库所有者或命名空间 / 仓库名，例如 wlyaaaaa/wly0829.cn）", "可选的本地工作树或目标分支", "这次只需缓存、实时 GitHub 信息、刷新远端引用，还是完整发布检查"],
    outputs: ["真实本地仓库路径、远端地址、公开性、当前分支、上游分支、工作树、未提交改动和同步状态","明确的继续、先处理再继续或停止建议；它本身不产生用户授权","私有配套状态、规范入口和未解决的映射问题；本地没有指针不等于PRIVATE配套不存在"],
    flow: ["先判断当前决定需要多新的 Git 事实","调用 Git Owner 的 admission（准入检查）","只检查本次指定的工作树或分支","把事实结果与用户授权分开","真正发布前再次用完整 publication profile（发布检查）回读","按Get-ProjectPrivateCompanion既有入口发现真实配套，只读精确必要文档，不扫描整个私人仓库。","所有实际改动仓库，包括链接指向的配套，分别验证、定向提交、normal push与默认分支回读；只读发现不会自动产生写权或新提交。"],
    boundaries: ["仅仅出现一个绝对路径不会自动触发","cached（缓存）事实不能冒充 live（实时）事实","decision（建议结果）不会自动授予 push（推送）权限","仓库公开风险不清楚时停止发布","网络读回失败不自动当作身份冲突；未知保持未知，不能猜另一个仓库替代。","私有映射与私人正文不因PUBLIC工程需要就进入公开仓库；公开说明仍保留真正有用的非秘密身份与状态。"],
    dependencies: ["E:\\GitHub总索引", "Git 和 GitHub metadata"],
    tests: "Skill 和 Provider fixture 通过，覆盖 identity、visibility、target、sync、dirty、no-upstream 和 public exposure。",
    sourcePath: "E:\\.agents\\skills\\project-entry-gate\\SKILL.md",
    endToEndState: "真实仓库 admission 已多次使用",
    technicalSections: [
      {
        "title": "需要多新的Git事实才取哪一种",
        "paragraphs": [
          "Get-ProjectAdmission.ps1返回github-local-index.project-admission.v1，包含local root、remote、visibility、branch/upstream、worktrees、dirty、sync和transport。LiveMetadata只取GitHub元数据不fetch；RefreshRefs取新远端引用；ForPublication同时需要两者。Fetch只是兼容两项同时做，不是默认。",
          "精确目标用TargetWorktree或TargetRef。source_git_read_failed与target_git_read_failed是未读到证据，不是成功读取后身份不符；只按正确执行身份或已核精确repo路径修正，不改remote或全局放宽Git trust。",
          "维护先Get-ProjectPrivateCompanion -Repo，可选RepoPath；准备公开即使无映射也解析登记私有目标。本地没指针不证没材料，改动过的每个实际仓库包括链接配套分别收口；dirty不证活跃施工。PCConfig只在机器事实改变决定时参与，见到绝对路径不是触发。"
        ],
        "commands": [
          "# 按需项目事实\npwsh -NoProfile -File E:\\GitHub总索引\\tools\\Get-ProjectAdmission.ps1 -Repo <owner/name> -Json",
          "# 查既有私有配套\npwsh -NoProfile -File E:\\GitHub总索引\\tools\\Get-ProjectPrivateCompanion.ps1 -Repo <owner/name> -Json"
        ]
      },
      {
        "title": "Owner参数错误不是另一个人在施工",
        "paragraphs": [
          "每次只给一种前置：AuthorizeAction/RenewLease使用ExpectedBindingId；结构Claim/Release使用新鲜精确项目Inspect返回的ExpectedProjectFingerprint；明确恢复模式使用ExpectedRevision。保持真实task/harness/runtime/scope，每个变更包括续租都有说明有界责任的Reason。",
          "error_category=invocation_precondition要求修正参数，不证明竞争Owner，也不授权重复同错、另StatePath、借身份或恢复接管。设计计划和admission建议都不产生实施或发布授权；未知身份只暂停依赖该身份的动作，安全只读诊断继续。"
        ],
        "commands": []
      }
    ],
    readerStatus: "仓库事实入口有回归和既有真实使用；仓库、分支与远端是动态状态，真正推送前仍读取那次目标的现场事实。",
  }),
  skill({
    slug: "tailscale-safe-exposure",
    evidenceBasis: "已发布156387f skills/tailscale-safe-exposure/SKILL.md；本轮范围为当前有效策略、指定peer排他访问、正反对端与业务层证据，以及中断恢复。内容与源身份已核对，安装、运行、新任务和真实端到端证据分别保留，未虚报重测。",
    currentTaskState: "本轮修正网站已有说明的来源遗漏或冲突；未执行该能力的真实业务、策略变更、验证码获取或对端测试。",
    evidenceObservedAt: "2026-09-22：已发布156387f的定向语义核对；安装和历史业务测试保留原观察，未由文字修复升级为当前运行验收。",
    evidenceSourceCommit: "156387f2bdc92ebb43aca9e10509518e206fe8e8",
    sourceState: "本轮按独立终审定向核对已发布 .agents main 156387f 的规范Skill原文：当前有效策略、指定peer排他访问、正反对端与业务层证据，以及中断恢复。未读取或采用未提交施工。",
    sourceSha256: "51cf2c8dc0554292bf5ad33990e20232d5cf8c57e1b26709b107ad8fb34b3eb6",
    sourceBytes: 10226,
    name: "tailscale-safe-exposure",
    title: "只向指定 Tailscale 设备开放服务",
    status: "已安装 / 环境条件型",
    maturity: "B",
    summary: "让本机服务按明确范围经Tailscale访问，并区分直连与中继。tailnet-only只表示没有直接开放到普通公网，不等于仅指定peer能访问；排他访问须核对当前ACL/grants全部适用允许规则的并集、精确服务入口和真实允许/拒绝对端证据。缺策略或对端证据保持Unknown，不靠一条窄防火墙规则或一次ping宣称完成。",
    useWhen: [
      "只允许同一 Tailscale 私有网络内的指定设备访问本机服务",
      "需要把防火墙限制到确切设备和端口",
      "检查反向端口或仅本机可见服务的暴露范围",
      "需要分清 Sunshine/Moonlight 连接是直连还是中继"
    ],
    avoidWhen: ["普通 LAN、Wi-Fi 或 VPN 问题", "未经明确要求就把本地服务公开到互联网", "把允许访问的设备放宽成所有地址", "一次修改多个机制和端口"],
    inputs: [
      "精确service、process、protocol、对外port、已验证peer与方向，以及允许改变的机制；Serve入口端口与loopback后端端口分开",
      "本机与peer身份、监听器、Serve/Funnel handlers及Windows ActiveStore有效防火墙基线，须保留的其他设置和可恢复preimage",
      "需要证明仅指定peer访问时，通过已有获授权管理入口取得当前Tailnet ACL/grants策略、版本/时间与身份映射，不使用旧副本作动态权威",
      "排他访问需要应允许和应拒绝的已验证peer，以及被测peer在线、同一服务健康和可执行验收的独立依据"
    ],
    outputs: [
      "目标端口的preimage、精确配置差异、实际readback和rollback结果；不重置无关规则",
      "涉及排他访问时，policy、allowed_peer_acceptance、denied_peer_acceptance与业务交互分别报告；缺证返回policy_evidence_unknown或对应unknown",
      "配置、服务健康、监听器、有效策略、真实对端连接的独立证据，以及direct/DERP/Peer Relay路径分类和延迟",
      "拒绝是否确由访问控制造成的证据；离线、故障、查询失败或超时不冒充拒绝成功，公开报告不带设备身份或整份策略"
    ],
    flow: [
      "核对本地节点、目标peer、地址、接口、进程、protocol/port与方向；保存精确资源preimage、必须保留项和停止条件。",
      "读取tailscale status、serve/funnel status、目标TCP/UDP监听进程与Windows ActiveStore实际合成规则和profile启用状态；PersistentStore存在不代替有效策略。",
      "已确认loopback服务可选单端口Serve；已有Tailscale/all-interface监听先查实际边界，不叠加掩盖；确需直接监听才配置精确interface/remote-address/protocol/port/application。",
      "仅指定peer访问时，沿已有授权管理入口读取当前Tailnet策略和版本，核同一来源身份、目标节点/服务与实际对外port；不能混用Serve入口port和loopback后端port。",
      "按官方策略语义核对全部适用ACL/grants允许集合的并集，包括宽泛来源、通配目标、组/标签、共享节点与设备姿态。窄allow不抵消其他宽泛allow；不新造策略求值器。",
      "缺策略读取、身份映射或权限则policy_evidence_unknown，不宣称排他可达，不自动建凭据或放宽策略。确需策略变更时核对精确对象的授权，保存原状，用官方检查及tests accept/deny并回读生效版本，保留无关规则。",
      "一次仅变更已确认机制与端口，随后按原基线回读精确差异和相应AllowFunnel状态；身份/readback/验收失败按预存方案只回滚本次变更。",
      "从应允许的已验证peer连接同一真实服务，再从应拒绝的已验证peer验证拒绝；拒绝证据还要证明peer在线、同一服务正常和非故障原因，timeout或离线不是访问控制拒绝。",
      "分别给出policy、allowed_peer_acceptance、denied_peer_acceptance及业务交互结果。官方静态策略tests不代替真实连接，一个peer成功也不证明其他peer被拒。",
      "tailscale ping只观察direct/DERP/Peer Relay与延迟，不证明服务授权；Funnel公开面按实际端口与目标独立核对。",
      "按实际执行用户与会话解释结果。中断时比较原状、期望结果与当前精确资源，已被他人改动则保留；恢复失败保留未完成标记，下一次写入先处理它。"
    ],
    boundaries: [
      "tailnet-only不等于仅指定peer可达；本机精确防火墙、监听器或ping不能替代有效ACL/grants策略证据",
      "允许范围取全部适用规则并集，不能用窄allow抵消宽泛来源/通配目标/共享节点等其他allow；不自造策略求值器",
      "缺策略/身份/权限保留policy_evidence_unknown，不临时造凭据、放宽策略或声明排他访问完成",
      "policy、allowed_peer_acceptance、denied_peer_acceptance、真实业务交互分别验收；静态策略通过不等于对端或业务通过",
      "拒绝测试必须另有peer在线、同一服务健康及非故障原因依据；超时、离线或查询失败不证明被拒",
      "默认禁Funnel；明确授权的公开目标须单独按端口和实际效果判断，Tailnet策略正确不证明公网入口符合目标",
      "禁止宽泛Any/LocalSubnet/interface或允许全部再排除；不重置Serve，不改无关Funnel/防火墙或重启受保护服务",
      "策略与peer证据留在所属来源，公共报告不复制设备身份、IP、账号、令牌或整份策略；更新按真实能力，不加精确版本准入或监控",
      "Windows有效策略看ActiveStore与profile；SYSTEM或未取得的观测不冒充桌面用户或对端验收",
      "Sunshine/Moonlight先读项目规则；网络诊断不擅改HDR、分辨率、刷新率、拓扑或sunshine.conf，真实串流仍独立验收",
      "中断恢复只处理预览并保存过的精确资源；他人后续修改保留，恢复失败不清未完成状态，也不扩大扫描对象"
    ],
    dependencies: [
      "Tailscale CLI与现有获授权策略管理入口",
      "精确服务、当前策略和已验证的允许/拒绝对端",
      "Windows有效防火墙状态与必要的现有提权路径"
    ],
    tests: "本轮只读取已发布156387f的完整Skill原文，确认指定peer策略、允许/拒绝对端与业务分层要求；未读取真实Tailnet策略、改防火墙或连接任何peer。旧CLI存在记录不证明当前策略或排他访问通过，也未新跑独立Skill回归。",
    sourcePath: "E:\\.agents\\skills\\tailscale-safe-exposure\\SKILL.md",
    endToEndState: "policy、allowed_peer_acceptance、denied_peer_acceptance与业务交互本轮均未实测，保持Unknown；一个peer可达、ping成功或静态策略通过不能互相替代。",
    technicalSections: [
      {
        "title": "Sunshine已有诊断、计划与维护入口",
        "paragraphs": [
          "先读Sunshine项目规则，本Skill只处理tailnet路径与最小暴露。Get-SunshineHealth默认只看健康，需要网络才IncludeNetwork；verify-path-lite -NoWrite按最后成功pong区分Direct/DERP/Peer Relay，显式选择peer才PhoneTailscaleIp，host-only不证手机可达。",
          "协商文本、否定语句、失败或超时不是直连。Funnel按启用端口与实际转发目标归属，其他端口有Funnel不证明Sunshine公开，配置存在也不产生授权。",
          "PCConfig Show-StreamingMaintenance.ps1显示状态与最近/下次检查，并提供明确暂停/恢复；不增常驻服务。repair-stream默认计划，真正改动必须Apply，Tailscale重启另需AllowNetworkRestart。网络诊断不擅改HDR、分辨率、刷新率、拓扑、sunshine.conf或放松GPU/会话证据。"
        ],
        "commands": [
          "# Sunshine只读健康\nGet-SunshineHealth.ps1 -Json",
          "# 需要时附网络观察\nGet-SunshineHealth.ps1 -IncludeNetwork -Json",
          "# 只读路径专项\nverify-path-lite.ps1 -NoWrite -Json",
          "# 默认只生成计划；-Apply才执行，网络重启还须-AllowNetworkRestart\n.\\repair-stream.ps1"
        ]
      },
      {
        "title": "meshclip现有诊断与中断恢复",
        "paragraphs": [
          "先由GitHub总索引解析wlyaaaaa/meshclip-kit当前项目根，再进入其scripts/doctor.ps1 -Summary、scripts/recover.ps1与控制中心；不复制动态设备地址或业务实现到本Skill。严格诊断、本地生成文件校验与真实双机传输分别验收。",
          "Windows看ActiveStore合成规则和profile启用状态，不以PersistentStore配置存在当已生效；按真实执行用户/会话解释观测。恢复只对保存过原状的精确资源比较preimage/expected/current，保留后来他改，恢复失败不清未完成标记，下一次写前先结清。"
        ],
        "commands": []
      }
    ],
  })
];

export const excludedSkills = [];
