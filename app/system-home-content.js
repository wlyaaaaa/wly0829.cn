export const systemHomeHero = {
  eyebrow: "个人 AI 协作系统",
  title: "AI 如何协助我完成工作",
  paragraphs: [
    "通用 AI 与智能体能力负责理解自然语言、推理、研究、阅读图片与文档、生成和编辑图像、使用工具、编写和运行代码、操作浏览器，以及组织并行协作。这些外部生产力由模型和平台提供，也是这套系统可以使用的能力；个人项目负责把它们接到实际工作里。",
    "我建设的个人系统把这些能力接到全部项目、现行规则、Skills（能力入口）、资料与媒体入口、电脑现场和外部服务。它让 AI 不必每次重新猜文件在哪里、项目怎样运行、哪些动作不能越界，也不用把每个工具临时拼起来。",
    "最后交回的不只是回答，而是已经完成的工作、可以核对的依据、没有确认的部分，以及中断、换机或失败后能够继续和恢复的位置。"
  ],
  roles: [
    {
      id: "natural-request",
      title: "从一句自然要求开始",
      body: "说清想完成什么，给出现有材料或项目，并说明不能越过的边界；不要求先记住任何工具名。"
    },
    {
      id: "real-context",
      title: "系统自己找到正确现场",
      body: "按这件事读取对应项目、规则、Skills、资料、电脑或外部服务，再选择需要的能力完成工作。"
    },
    {
      id: "usable-result",
      title: "结果带着依据一起回来",
      body: "交回可继续使用的成品、来源、未确认项、保存位置、恢复点，以及是否还需要本人决定。"
    }
  ]
};

export const systemHomeChapters = [
  { id: "system-workflows", label: "真实工作" },
  { id: "system-dependencies", label: "系统组成" },
  { id: "system-automations", label: "自动协作" },
  { id: "system-project-atlas", label: "项目版图" },
  { id: "system-rule-stories", label: "规则与能力" },
  { id: "evidence", label: "验证" }
];

export const systemScenarios = [
  {
    id: "project-work",
    label: "完成真实需求",
    title: "在现有项目里，把一个真实需求做到可用",
    request: "“给现有网站补上项目内全文搜索：项目外只搜项目，进入项目后只搜这个项目的内容。保留别人还没提交的修改，桌面和手机都按真实路径验收。”",
    systems: ["通用 AI 与智能体能力", "AI 协作规则与能力中心（.agents）", "目标项目的规则", "项目身份总账（GitHub 总索引）", "目标项目", "自然语言能力入口（Skills）与工具"],
    rules: "先明确用户要的结果和现有修改，把用户原意与可替换方案分开；实质长程节点由独立子代理检查是否偷加目标或复杂层，但不能砍掉用户功能。并行不覆盖别人，源码、发布与实际可用分别说明。",
    result: "根因、实现改动、相关测试、真实使用结果、仍未闭合的部分、提交或恢复位置。",
    value: "调查、研究、实现、测试和真实使用属于同一个目标；只有这项需求确实需要时，才继续提交、发布或外部交付。",
    stages: [
      {
        number: "01",
        kicker: "项目与问题现场",
        title: "先弄清真正要改什么",
        body: "定位正确仓库、工作树和项目规则，读取现有实现、失败表现、已有测试和并发修改。只有机器事实会改变方案时才进入 PCConfig。",
        items: [
          ["真实项目", "远端、默认分支、工作树和现有改动"],
          ["问题证据", "复现条件、错误、失败路径和当前用户体验"],
          ["产品边界", "要解决什么、不能破坏什么、怎样才算能用"]
        ]
      },
      {
        number: "02",
        kicker: "通用能力与个人系统",
        title: "研究、实现并互相复核",
        body: "通用 AI 负责理解、推理、搜索、代码和工具操作；AI 协作规则与能力中心（.agents）组织规则、授权、上下文和并行协作；目标项目决定具体实现与测试方式。",
        items: [
          ["研究", "查当前资料、追踪调用链、比较多个解释"],
          ["施工", "只改必要范围，保留其他人的未提交工作"],
          ["复核", "独立检查根因、边界、回归和复杂度"]
        ]
      },
      {
        number: "03",
        kicker: "可用结果",
        title: "从代码走到真实使用",
        body: "先跑与改动相称的验证，再走一次自然语言或真实界面路径。需要发布时才继续到默认分支和公网回读；不需要发布时保留明确本地结果。",
        items: [
          ["交付", "实现、说明、测试、使用结果和真实缺口"],
          ["证据", "哪一层已通过，哪一层仍未运行"],
          ["连续性", "提交、断点、回滚或下一步接续位置"]
        ]
      }
    ]
  },
  {
    id: "find-personal-originals",
    label: "找资料和媒体",
    title: "用一段记忆，找到最可能的照片、录音或文件原件",
    request: "“找去年在餐厅拍的那组照片，还有我忘了放在哪的延保合同。先给少量最可能的原件，不要全盘扫描，也不要复制或移动文件。”",
    systems: ["通用 AI 与智能体能力", "个人媒体定位（personal-media）", "非媒体原件定位（personal-materials）", "当前目录与索引", "真实原件"],
    rules: "先把时间、地点、人物、文件角色和内容线索拆开；已有精确路径直接读原件。媒体按目录与预览证据核对，非媒体在位置未知时先给隐藏路径的候选，只有选中后才重算大小和 SHA-256；零匹配只说明本轮没找到。可信文件管理器中原件不存在则代表本人已删除，正确产品不应从旧索引或恢复副本复活。",
    result: "媒体得到带预览、精选或原件入口的少量候选；非媒体先得到隐藏真实路径的候选卡，选中后才交回通过大小与 SHA-256 验真的原件位置、匹配依据、实际检查范围和覆盖缺口。本人在可信文件管理器删除原件后，两套来源都会在下一次日常同步精确退役登记与派生恢复状态，不再返回待恢复候选。",
    value: "只说记得的时间、地点或内容，先得到少量最可能的照片或文件，再核对原件。没找到会说明查过哪里；本人已经删除的文件不会被旧索引重新当成待恢复文件。材料项目只保留查找所需的位置、版本和文件信息，不复制原件，也不建立跨领域的中央资料库。",
    stages: [
      {
        number: "01",
        kicker: "自然线索",
        title: "先弄清记得的到底是什么",
        body: "先分清要找的是照片、录音还是文档，再整理记得的时间、地点、画面或文件里的关键词。已经知道文件位置时直接读取，不再绕一遍查找。",
        items: [
          ["时间与地点", "去年、某个月、餐厅、旅行或设备来源"],
          ["对象与角色", "照片、录音、合同、报告或附件"],
          ["边界", "明确获准位置、是否只读和不允许发生的动作"]
        ]
      },
      {
        number: "02",
        kicker: "候选与原件核对",
        title: "让索引缩小范围，再回到真实文件",
        body: "照片和录音按已有目录、时间、说明与预览缩小范围。文档位置未知时先看名称、所属目录、版本和文件状态，给出少量候选；这一步不预读正文、不计算文件校验值，也先不展开真实路径。",
        items: [
          ["候选", "只返回最有区分力的少量结果"],
          ["媒体核对", "目录、时间、类型、已有说明和必要预览"],
          ["非媒体候选", "标题、来源、原生容器、版本角色和文件状态；真实路径先隐藏"],
          ["未知", "目录未覆盖、原盘离线或索引比原件旧"]
        ]
      },
      {
        number: "03",
        kicker: "直接可用的原件",
        title: "交回能打开的东西，而不是一段猜测",
        body: "选中文档候选后，再确认原件确实存在、来自正确位置，核对大小与 SHA-256，交回可用的文件位置供 AI 阅读；本人明确要在桌面看文档时才打开。媒体按需预览或打开，照片也可以放进不复制原件字节的临时浏览目录。已选文档能继续找有关段落，录音可用已有转写定位到时间段；缺少内容或时间信息时说清具体缺口。",
        items: [
          ["媒体入口", "预览、真实路径或临时浏览目录"],
          ["非媒体入口", "选中后核对文件状态、大小与 SHA-256，再返回真实位置"],
          ["匹配理由", "哪条记忆线索被哪项事实支持"],
          ["下一步", "本人确认、接入离线介质或补一个更具体线索"]
        ]
      }
    ]
  },
  {
    id: "wechat-work-record",
    label: "微信工作材料",
    title: "聊天、语音、图片和附件，整理成可以继续办事的材料",
    request: "“把昨晚这段微信聊天、对方发的语音和附件整理成纪要。人名、数字和待办不要猜，没听清的单独列出来。”",
    systems: ["通用 AI 与智能体能力", "WeChatDirect 绑定的消息与媒体关系", "ChineseASR", "LocalOCR"],
    rules: "只读取明确会话和时间范围；消息关系与本地原件必须能够对应；原音频和扫描件高于识别结果；第三人私人内容不进入公开页面。",
    result: "可编辑纪要、决定与待办、消息与附件引用、录音时间位置、人名和数字复核表、来源缺口与矛盾项。",
    value: "它保留聊天顺序、回复关系和原件位置，不把一堆材料压成无法追溯来源的 AI 摘要。",
    stages: [
      {
        number: "01",
        kicker: "具名上下文与原件",
        title: "先把聊天和附件关系找对",
        body: "WeChatDirect 读取明确联系人或群的有界窗口，保留原生发送方向、回复目标和每次媒体出现的位置；图片、表情、语音、视频与文件只有原生索引、字节身份和实际解码通过才交付。默认上下文只读本机；显式导出或打开具名表情时才可沿该消息已有 CDN 取回并核验，也可要求全本地。",
        items: [
          ["消息", "原生顺序、发送方向与回复关系"],
          ["媒体", "语音、图片和文件与消息精确绑定"],
          ["缺口", "附件丢失、缓存未命中或来源无法确认"]
        ]
      },
      {
        number: "02",
        kicker: "语音与版面理解",
        title: "转写、识别并建立复核队列",
        body: "先检查是否已有绑定原音的转写与时间段，能够复用就不重跑模型。需要新处理时由 ChineseASR 转写并保留时间位置和分歧；LocalOCR 读取扫描页、表格和版面。通用 AI 再把文字、语音与附件放回原消息关系中，时间未提供时不猜时间戳。",
        items: [
          ["语音", "正文、时间位置、可疑句和待回听项"],
          ["扫描件", "页码、表格、坐标与无法确认的版面"],
          ["分歧", "人名、金额、日期和承诺单独核对"]
        ]
      },
      {
        number: "03",
        kicker: "可复核交付",
        title: "纪要能回到每一份原件",
        body: "最终材料把结论、待办、引用和未确认项分开。一个识别入口失败时可以降级交付；两个入口都失败时明确写听不清或无法读取。",
        items: [
          ["纪要", "重点、决定、责任人和待办"],
          ["引用", "消息位置、录音时间与附件页码"],
          ["复核", "高风险字段和相互冲突的内容"]
        ]
      }
    ]
  },
  {
    id: "document-delivery",
    label: "交付一份文档",
    title: "混合附件、扫描页和乱码文本，整理成逐页验收过的成品",
    request: "“把这批 Word、表格、扫描 PDF 和乱码文本整理成一份中文说明，再导出 PDF。原件不要覆盖，每一页都检查，发现看不清或互相冲突的地方单独列出。”",
    systems: ["通用 AI 与智能体能力", "混合附件分流（file-intake-router）", "扫描件与版面识别（LocalOCR）", "乱码诊断（mojibake-doctor）", "文档生成与 PDF 逐页验收"],
    rules: "先按真实文件类型选择保留结构最多的读取方式；乱码从原始字节诊断；扫描识别绑定页码和版面；源内容、生成文件、渲染页面和语义验收分别核对。",
    result: "结构化源文档、当前 PDF、页数与源文件指纹、完整页面总览、可疑页清单、冲突与未确认项，以及不会覆盖原件的恢复位置。",
    value: "它不是把文本拼成一个文件，而是让来源、转换、版面和最终阅读体验都能重新核对。",
    stages: [
      {
        number: "01",
        kicker: "文件分流与原件保护",
        title: "先决定每种材料应该怎样读",
        body: "清点当前文件、格式、页数和指纹；原生文档保留结构读取，复杂扫描件进入版面识别，乱码文件先检查原始字节链，不把错误显示后的复制文本当原件。",
        items: [
          ["清单", "Word、表格、数字 PDF、扫描页、图片和纯文本"],
          ["读取路线", "原生结构优先，只有必要内容才进入识别"],
          ["原件", "不覆盖、不用陈旧输出替代当前输入"]
        ]
      },
      {
        number: "02",
        kicker: "理解、组织与生成",
        title: "把不同来源组织成一份可继续编辑的说明",
        body: "通用 AI 对齐标题、表格、页码、引用和冲突，先形成可复核源稿；确认结构后再按用途、样式和页数要求生成当前 PDF。",
        items: [
          ["内容", "主题结构、引用、表格和未确认项"],
          ["冲突", "金额、日期、版本和来源差异单独保留"],
          ["生成", "源稿、目标样式、页数要求和本轮输出绑定"]
        ]
      },
      {
        number: "03",
        kicker: "逐页可见验收",
        title: "能打开不等于已经可以交付",
        body: "把全部 PDF 页面渲染成总览，检查空白、裁切、错位、乱码、页数和关键文本；可疑页再提高分辨率。语义仍由人和原件判断，页面图不能替代内容正确。",
        items: [
          ["全量目检", "全部页缩略总览和具体可疑页"],
          ["回归", "页数、关键文本、源指纹和当前输出"],
          ["交付", "成品、源稿、问题清单和可恢复的上一版"]
        ]
      }
    ]
  },
  {
    id: "pc-diagnosis",
    label: "排查电脑故障",
    title: "电脑现在正常，也能追查昨晚为什么卡",
    request: "“昨晚十点半电脑突然卡了两三次，现在又正常了。帮我判断最可能是什么原因，不要只看当前任务管理器，也不要重启。”",
    systems: ["通用 AI 与智能体能力", "TimeAudit", "timeaudit-diagnostics", "PCConfig", "Windows 现场工具"],
    rules: "先确认故障时间和数据覆盖；历史相关性、当前现场和原因判断分开；不允许用重启代替诊断；处理前后必须可比较、可回退。",
    result: "故障时段、覆盖质量、多个竞争假设、支持与反对证据、已排除项、安全处理、下次复发应保留的现场。",
    value: "通用 AI 负责形成和比较诊断假设，本地项目提供过去与现在的证据；两者共同工作，避免单看峰值或只给通用建议。",
    stages: [
      {
        number: "01",
        kicker: "故障与证据质量",
        title: "先证明这段历史能不能用",
        body: "从自然语言确定最短必要时间窗，检查采集是否覆盖、是否经历睡眠或关机、最大数据空档和帧率样本是否一致。没有历史数据不等于当时健康。",
        items: [
          ["时间窗", "发生时刻、持续时间和主观症状"],
          ["覆盖", "样本、新鲜度、空档与睡眠边界"],
          ["限制", "有界摘要不提供具体进程身份"]
        ]
      },
      {
        number: "02",
        kicker: "假设与交叉检查",
        title: "历史信号、当前现场与推理一起工作",
        body: "TimeAudit 提供 CPU、GPU、内存、磁盘、网络、帧率和活动状态；PCConfig 与系统现场核对配置、任务、驱动和近期变化；通用 AI 比较内存换页、磁盘延迟、热或功耗限制、网络抖动等解释。",
        items: [
          ["历史证据", "时间对齐的硬件、流畅度和活动信号"],
          ["当前证据", "机器配置、事件、任务和是否仍可复现"],
          ["竞争假设", "支持、反证和下一项最有区分力的检查"]
        ]
      },
      {
        number: "03",
        kicker: "故障诊断单",
        title: "给出原因排序，而不是一张监控截图",
        body: "结果列出最可能原因、支持与反对证据、已排除项、现在是否需要处理，以及低成本可回退的处理方案。若证据不够，只缩小问题范围。",
        items: [
          ["判断", "最可能的原因及置信边界"],
          ["处理", "不影响当前使用的安全修复和验证"],
          ["续证", "下次复发需要自动保留的现场"]
        ]
      }
    ]
  },
  {
    id: "full-recovery",
    label: "重装与恢复",
    title: "重装或换机后，把工作环境一层一层真正接回来",
    request: "“把原来的开发环境、任务、项目和私密配置恢复到可用状态。秘密不要出现在回执里，必须告诉我哪些还要登录或等自然重启验证。”",
    systems: ["通用 AI 与智能体能力", "电脑配置与恢复（PCConfig）", "项目身份总账（GitHub 总索引）", "凭据中心（Password Center）", "受保护数据与加密库（Vault）", "项目恢复入口"],
    rules: "先验证备份和恢复载体；恢复顺序服从真实依赖；原件和回滚保留；凭据优先盲用；复制、安装、启动、登录和用户可用分别验收。",
    result: "已恢复环境、项目、任务与数据，秘密可用状态，待登录、待自然重启和不可恢复项，备份后的数据缺口，以及完整回滚路径。",
    value: "它不是“一键装软件”，而是一份能回答工作系统是否真正恢复的依赖计划和分层验收。",
    stages: [
      {
        number: "01",
        kicker: "资产与恢复前提",
        title: "先认清机器、磁盘和真正可用的恢复来源",
        body: "先区分同机重装、换机/换板、系统盘故障还是只能进入 PE；核对主板与 BIOS/UEFI、物理磁盘、加密状态、备份时间、仓库身份和恢复因子。只读识盘完成前不格式化，也不沿用旧盘符猜设备。",
        items: [
          ["机器", "主板、BIOS/UEFI、PE、网络、物理磁盘与目标系统盘"],
          ["数据", "文档、下载、微信、存档、应用配置和数据库"],
          ["秘密", "Password Center、Vault、加密数据和恢复条件"]
        ]
      },
      {
        number: "02",
        kicker: "按依赖重建",
        title: "从 Windows 和驱动，到项目、任务和登录",
        body: "确认目标盘后安装系统和关键驱动，再恢复三个控制面与兼容运行时，按真实位置重建 PATH 和非秘密配置；项目、用户配置、数据库与工具就绪后，再分类恢复计划任务、自启动、账号和受保护数据。",
        items: [
          ["基础系统", "Windows、关键驱动、运行时、虚拟化、容器与开发存储"],
          ["项目", "远端身份、本地副本、数据库、面板与工具"],
          ["运行链", "计划任务、自启动、外部探针和绝对路径"]
        ]
      },
      {
        number: "03",
        kicker: "分层验收",
        title: "装回去不等于已经恢复",
        body: "分别验证文件、表结构、数据数量、当前写入、任务身份、应用登录、用户可见结果和回滚入口。需要重启、登录或实体观察的部分保持待验。",
        items: [
          ["已可用", "真实运行和用户路径已回读"],
          ["待行动", "需本人登录、授权或自然重启的项目"],
          ["数据缺口", "最后备份之后无法恢复的范围"]
        ]
      }
    ]
  },
  {
    id: "health-collaboration",
    label: "健康协作",
    title: "把病历、报告、设备数据和沟通记录组织成可行动的健康协作",
    request: "“结合我现有病历、这次检查、设备趋势和医生沟通，帮我看哪些变化值得处理、两个方案怎样比较、下一次该问什么。”",
    systems: ["通用 AI 与智能体能力", "个人健康证据与安全决策", "健康协作入口（personal-health）", "材料与扫描入口", "受保护凭据入口", "权威资料研究"],
    rules: "急症和红旗优先；报告事实、医生意见、本人陈述、外部资料和 AI 分析分开。新数据先完整保存并核对，不能未经判断就改掉已经确认的健康资料；最终选择属于本人。",
    result: "健康时间线、变化与趋势、证据质量、方案收益与风险、停止或复查条件、待问医生的问题、仍缺资料和最低成本下一步。",
    value: "它不把健康协作缩成一次“第二意见”，而是让低频、分散、质量不同的个人证据在需要时进入同一项决策。",
    stages: [
      {
        number: "01",
        kicker: "已有健康资料与新证据",
        title: "先用已有事实，再决定是否刷新",
        body: "普通问题先使用已处理的当前健康事实。只有新报告、设备数据、病历、医嘱或录音会改变判断时，才读取原件或明确启动一次前台刷新。",
        items: [
          ["已有事实", "病史、检查、趋势和已确认边界"],
          ["新原件", "报告、影像、设备数据、医嘱、订单或录音"],
          ["来源状态", "时间、完整性、质量与当前适用范围"]
        ]
      },
      {
        number: "02",
        kicker: "保全、验证与研究",
        title: "先完整保存新数据，再检查能不能用于判断",
        body: "需要取新设备数据时，使用已登记的账号连接，凭据不进入聊天。数据先完整保存，再离线核对来源、有没有漏页、覆盖哪段时间以及质量是否足够；AI 随后结合当前权威资料，解释变化、风险和可选做法。",
        items: [
          ["原始保全", "分页、清单、大小、哈希和精确续跑"],
          ["证据三态", "可用于当前判断、需要复核、本轮不可用"],
          ["权威研究", "适用范围、利益关系、冲突和未知"]
        ]
      },
      {
        number: "03",
        kicker: "人类决定",
        title: "把健康信息变成问题和选择",
        body: "结果把事实、意见、AI 分析、红旗、收益、风险、替代方案和未知分开；只有现实相关且质量足够的最小结论才可能更新当前健康底色。",
        items: [
          ["时间线", "真正变化了什么，哪些只是测量差异"],
          ["选择", "方案、风险、停止条件和可逆下一步"],
          ["沟通", "下次问医生的问题与仍需补充的原件"]
        ]
      }
    ]
  },
  {
    id: "remote-continuity",
    label: "手机用电脑",
    title: "人在外面，也能让 AI 用自己的电脑办事",
    request: "比如我在手机上说：“找到电脑上的那份方案，读一下第二节，改好后存回去。”ChatGPT 负责理解和推理，电脑 MCP（工具连接协议）把文件、命令和桌面操作交给家里的电脑，结果再回到这段对话。",
    systems: ["手机上的 ChatGPT", "电脑 MCP", "同一套电脑规则与个人 Skills", "电脑上的项目和原件"],
    rules: "电脑需要开机、联网并登录 Windows，操作桌面还需要解锁。每个任务读取电脑当前规则，写入遵守对应项目的实际负责人和授权；使用另一款客户端不会自动取得最高权限。",
    result: "收到读到的内容、实际改好的文件、命令结果或操作后的截图；失败会指出断在连接、程序还是具体页面，重新连接后先核对已经完成的部分。",
    value: "在已开放所需电脑工具的 Chat（聊天）对话里，可以选账号提供的 Extra High（极高）或 Pro 档位。推理使用 Chat 自己的模型用量，不占 Work（工作）与 Codex 的共享额度，也无需为本地工具操作再启动一个 Codex 模型任务；可以把当前支持的查资料等任务放到这里；改文件和执行命令仍以实际开放的工具权限为准。",
    stages: [
      {
        number: "01",
        kicker: "手机提出要求",
        title: "用顺手的聊天界面，接到自己的电脑",
        body: "在已经接通“电脑 MCP”的账号里选好模型，说清要处理什么。手机可以保留原来的 VPN；OpenAI 服务器通过已认证的 HTTPS 入口调用电脑，Codex 窗口不必一直打开。",
        items: [
          ["入口", "已经连接的 ChatGPT 账号与电脑 MCP"],
          ["模型", "使用账号实际提供的极高或 Pro 等档位"],
          ["用量", "Chat 有自己的限制；切换到 Work 后按 Work 计量"]
        ]
      },
      {
        number: "02",
        kicker: "在真实电脑上执行",
        title: "文件、程序和个人理解库仍用原来那一份",
        body: "查文件、读文档片段、运行脚本或操作现有桌面软件，都发生在这台电脑上。需要了解我的经历和取舍时，也通过 MCP 读取、补充同一份个人理解库，不必另维护两份手机阅读快照。",
        items: [
          ["资料", "本机文件、指定文档片段和原项目目录"],
          ["操作", "现成命令、脚本、浏览器与桌面软件"],
          ["本人背景", "同一份理解库，按当前问题读取和回写"]
        ]
      },
      {
        number: "03",
        kicker: "把实际结果带回来",
        title: "看文件和操作结果，卡住就从现场继续",
        body: "Work 已实际跑通文件读写、命令、文档片段、外部 Chrome 和基础表单；Chat 是否能执行同样的操作，取决于该账号开放的工具。具体模型和手机原生入口以实际界面为准；遇到连接中断，先检查文件和任务状态，再接着完成，避免重做已经成功的操作。",
        items: [
          ["成功", "读回文件内容、保存位置、退出码或操作截图"],
          ["中断", "先检查已执行结果，再续做未完成部分"],
          ["桌面", "操作会使用鼠标键盘；断网或关机会中断连接"]
        ]
      }
    ]
  },
  {
    id: "learning-collaboration",
    label: "研究与学习",
    title: "把一个陌生问题研究明白，并能迁移到新场景",
    request: "“把这个陌生概念讲到我能用自己的话解释，并能迁移到另一个场景；我不理解或不同意的地方再一起改。”",
    systems: ["通用 AI 与智能体能力", "AI 协作学习", "权威资料入口", "必要的最小验证"],
    rules: "人决定问题、节奏和停止；来源变化先查当前资料；没有反馈不猜已经掌握；问题只帮助理解，不评分；文字不能证明时才做最小验证。",
    result: "一份可集中阅读的人话材料、可靠来源、用户反馈后的修订、可选问题、仍未知处和下一步最值得理解的内容。",
    value: "AI 承担研究、解释和修正，人保留方向和最终判断；没有课程后台、打卡、进度百分比或自动续课。",
    stages: [
      {
        number: "01",
        kicker: "先找准当前问题",
        title: "先判断真正需要理解什么",
        body: "先看现在真正卡在哪里：是概念没懂、事实不清、缺少例子，还是不知道怎样选择；再查当前一手资料，决定这次讲到什么深度，不预先写死整套课程。",
        items: [
          ["问题", "真实困惑、使用场景和理解深度"],
          ["来源", "当前权威资料、版本和适用范围"],
          ["结构", "前置、例子、反例和迁移场景"]
        ]
      },
      {
        number: "02",
        kicker: "人话终稿与对话修订",
        title: "先交完整材料，再让反馈改变讲法",
        body: "AI 先产出可以独立阅读的终稿；用户自然复述、质疑或补充经验；AI 再判断是资料错、讲法错、转写错，还是确有知识缺口。",
        items: [
          ["讲义", "现实意思、理由、例子、专业名词和边界"],
          ["反馈", "复述、反对、疑问和真实经验"],
          ["修订", "原地更正，不把责任推给学习者"]
        ]
      },
      {
        number: "03",
        kicker: "迁移与停止",
        title: "形成能够继续使用的判断",
        body: "必要时通过新场景或小实验检查迁移；没有反馈时停止，不生成下一篇；最终保留当前断点、已确认内容、仍未知处和下一份必要材料。",
        items: [
          ["迁移", "换一个真实场景仍能解释和判断"],
          ["验证", "只有文字不足时做最小真实检查"],
          ["连续性", "轻量断点，不复制第二份课程正文"]
        ]
      }
    ]
  },
  {
    id: "ai-capability-evidence",
    label: "验证 AI 能力",
    title: "用真实任务判断一种 AI 工作方式是否可靠",
    request: "“我想换一种 AI 工作方式来做复杂代码任务。拿几类真实任务试，不看它自己说完成了没有；告诉我哪些确实做成、哪些失败、证据够不够。”",
    systems: ["通用 AI 与智能体能力", "真实任务能力基准（CACB）", "隔离工作区", "独立验证器", "证据归档"],
    rules: "开始前固定任务、输入和验收办法；每次尝试使用独立工作区；AI 说“完成了”不算结果，必须检查真实文件和行为；中断时优先接回同一次尝试，无法精确接回就整轮重做。",
    result: "哪些类型的任务确实做成、实际文件和行为证据、失败发生在哪一层、环境是否影响结果、这份结论能用到什么范围，以及目前仍不能下的判断。",
    value: "它不是排行榜，而是把不同 AI 工作方式放到相同真实任务和验收条件下，用实际产物回答“靠不靠谱、哪里不可靠、证据够不够”。",
    stages: [
      {
        number: "01",
        kicker: "同题、同条件",
        title: "先把要做的事和怎样验收定清楚",
        body: "同一轮比较使用相同问题、输入、执行顺序和检查办法；每次尝试在自己的临时副本里完成，不能把前一次的文件或修改混进来。",
        items: [
          ["真实任务", "跨文件开发、故障修复、持续状态和研究工作"],
          ["运行条件", "任务、工作副本和验收版本属于同一次尝试"],
          ["相互隔离", "不会污染其他尝试，也不会直接改原项目"]
        ]
      },
      {
        number: "02",
        kicker: "实际产物与独立检查",
        title: "先看真实文件和行为，再听它怎样解释",
        body: "AI 完成任务后，另一套检查只看实际文件、测试、行为和修改范围。是 AI 没做成、运行环境出问题、任务本身有缺陷，还是证据不够，会分别说明。",
        items: [
          ["实际结果", "代码、文件、状态、操作记录和失败"],
          ["独立检查", "重新核对真实行为和修改范围"],
          ["分开归因", "能力、环境、任务和证据问题不混成一个分数"]
        ]
      },
      {
        number: "03",
        kicker: "保存结果与有限结论",
        title: "把每次实际发生的结果保存下来，再决定能说什么",
        body: "无论成功、失败还是中断，都保存本次文件、检查结果和工作区状态；无法确认是否完整接回时整轮重做。最后只报告证据真正支持的能力和限制。",
        items: [
          ["保留", "最终文件、操作记录、检查结果和工作区状态"],
          ["报告", "各类任务做成了什么、失败在哪里"],
          ["边界", "哪些结论现在成立，哪些还需要更多验证"]
        ]
      }
    ]
  }
];

export const systemActiveAutomations = {
  observedAt: "2026-08-31",
  groups: [
    { id: "mobile", label: "01–05", title: "云端定时协作（手机接收）", description: "云端定时或事件任务持续整理、监控并提醒，手机是接收结果和继续协作的入口。" },
    { id: "computer", label: "06–07", title: "电脑端自动治理（本机执行）", description: "电脑端任务进入真实项目、规则、Git 与发布现场，持续治理和更新。" }
  ],
  items: [
    {
      id: "important-mail",
      group: "mobile",
      cadence: "每小时",
      title: "重要邮件提醒",
      focus: "检查自上次成功运行后新到的 Gmail 邮件，也识别三个 QQ 邮箱转发件的原始发件人、主题和收件邮箱。",
      process: "按原始邮件、线程和同一事件去重，只保留任务、截止日期、账单、行程变更、账号事件和重要人工邮件；验证码、促销和普通更新直接略过。",
      delivery: "只有出现新的重要邮件才提醒：说明谁发来、主题、为什么重要、金额或期限和下一步；没有重要变化就保持安静。"
    },
    {
      id: "github-major-change",
      group: "mobile",
      cadence: "每小时",
      title: "GitHub 重大变更监控",
      focus: "把当前 GitHub 状态与上一次检查比较，关注仓库新增、消失、改名、可见性、归档状态和默认分支。",
      process: "普通 commit、push、PR、Issue 和 CI 失败不打扰；网站仓库更新后，继续核对 wly0829.cn 是否真的换成新版本。",
      delivery: "只报告会改变项目身份或公网结果的变化，以及网站更新成功、仍是旧版、无法访问或明显异常；无重大变化不通知。"
    },
    {
      id: "daily-priorities",
      group: "mobile",
      cadence: "每日",
      title: "每日重点简报",
      focus: "覆盖 AI 产品、本地模型与硬件、AI 编程、职业发展、科技商业、中国政治经济与全球重大事件。",
      process: "从新闻、发布、实测、模型对比、工具教程、趋势和机会中去重降噪，优先保留真正会改变判断或行动的内容。",
      delivery: "每条都说明发生了什么、为什么重要、对我有什么影响；需要时给出来源与不确定性，而不是只罗列标题。"
    },
    {
      id: "github-daily",
      group: "mobile",
      cadence: "每日",
      title: "GitHub 每日日报",
      focus: "统计北京时间当天 00:00 至运行时，GitHub 上当前可见的仓库、commit、PR、Issue 和重大身份变化。",
      process: "区分正常开发与明显自动 commit，按仓库统计并给出 TOP 5；同时核对网站仓库的新 commit 与公网版本，无法确认就明确写未知。",
      delivery: "交回 30 秒内能读完的数字、仓库排行、重要变化和 1–3 句工作总结；本地未 push 的 commit 不算进去。"
    },
    {
      id: "weekly-reading",
      group: "mobile",
      cadence: "每周",
      title: "每周精选文章",
      focus: "从过去两周的新文章中选择一篇可免费阅读全文、符合 AI、技术、职业、商业与全球局势兴趣的高价值内容。",
      process: "完整阅读原文后再判断，不靠标题或摘要，不选付费墙，也不重复近期已经推荐过的文章。",
      delivery: "交回标题、作者、日期、来源与链接，以及核心逻辑、最值得记住的事实、推荐理由和可以采取的启发或行动。"
    },
    {
      id: "three-base-governance",
      group: "computer",
      cadence: "每周",
      title: "三基座与 GitHub 持续治理",
      focus: "核对 .agents、PCConfig、GitHub 总索引和全部仓库的责任、规则、机器事实、分支、同步、发布与既有备份回执。",
      process: "证据新鲜且没有变化就保持不变；只展开新增、变化、失败、未知或公开暴露风险，并在责任明确、可分离、可验证时做最小修复。",
      delivery: "告诉我哪些地方正常、哪里有问题、这次修了什么、依据是什么时候的，以及还卡在哪里、是否需要我操作。保留别人正在做的工作，说明为何采用这次修法。"
    },
    {
      id: "website-snapshot",
      group: "computer",
      cadence: "每周",
      title: "个人系统网页快照更新",
      focus: "先核对项目、规则和能力的实际变化。网页说明仍准确就不改；用途、状态或限制变了，才更新相关说明，再检查系统总览是否需要一起改。必须由本人点名更新的页面继续遵守原约定。",
      process: "按本人选择的模型和思考强度执行，并核对实际使用的身份。分别查清新增、改变、退出或仍不确定的产品与技术事实，在原位置更新受影响的项目、规则、能力和系统说明。提交记录和文件变化只帮助找到线索，不替 AI 判断该写什么。",
      delivery: "说明改了哪些页、哪些保持不变、哪些因证据不足暂未改，并交回核对过的快照。只有符合本人当前发布安排时才上线，并重新打开网站确认；否则保留本地候选。"
    }
  ]
};

export const systemProjectInventory = {
  observedAt: "2026-09-09T05:12:19.7074638Z",
  total: 49,
  publicCount: 25,
  privateCount: 24,
  localCloneCount: 45,
  remoteOnlyCount: 4,
  identitySha256: "sha256:2f38a7e1fb9383c4990dd8fc1c4aaefcd84f2143b5682c45c333fad8a76a158f",
  mappingSha256: "sha256:19448212b9b07ad63637149f476ab2f9c9f1997be0d15cdd603a6ba7406bfb1a",
  description: "本轮 GitHub 共 49 个仓库，媒体项目已纳入私有 Git；原有 44 个本地副本加上已核对的媒体仓库为 45 个，4 个仍仅在远端。一份展示页可以整理多个实际来源，展示项目数与仓库数不相等；这里记录观察时刻，不声称后台实时更新。网站自身只负责呈现这些信息。"
};

const projectLedgerHref = "/projects/github-index/repository-ledger";

export const systemProjectDomains = [
  {
    id: "ai-work",
    number: "01",
    title: "AI 协作与能力运行",
    summary: "把一句自然需求送进正确的 AI 工作入口，组织规则、工具、后端与协作者，再把结果交回同一目标。",
    ordinaryRequest: "“把这项工作做完；能独立调查的并行，但不要互相覆盖，失败也不要静默换一条路线。”",
    collaboration: "规则与能力中心先明确用户目标和边界，合适的工作入口负责执行，主任务比较证据、合并结果并处理失败，不借技术方案缩小用户需求。",
    delivery: "明确的能力路线、可追踪执行、失败分类、统一验收和可以继续的任务位置。",
    unavailable: "某个入口不可用时只停止依赖它的支路，保留已经完成的工作并说明缺口；不静默换路线冒充原结果。",
    assets: [
      { id: "agents", title: "AI 协作规则与能力中心", repo: ".agents", role: "让 AI 知道听谁的、能做什么、该用哪种能力、多个协作者怎样不互相覆盖，以及何时需要停下来交给人。", kind: "核心基座", href: "/projects/agents" },
      { id: "ai-cli-profile-manager", title: "AI 命令行工作入口", repo: "ai-cli-profile-manager", role: "把多套 AI 命令行入口的启动、Profile（配置档）、隔离、体检、真实连接测试和可恢复 Codex 任务收在一起。", kind: "工作能力", href: "/projects/ai-cli-profile-manager" },
      { id: "llm-backend-toolkit", title: "额外 AI 长任务执行器", repo: "llm-backend-toolkit", role: "把范围封闭、可客观验收的长任务变成可追踪作业，只返回紧凑结果和证据。", kind: "工作能力", href: "/projects/llm-backend-toolkit" },
      { id: "message-ai-gateway", title: "消息型 AI 网关", repo: "OpenClawGateway", role: "维护本机网关的启动、自愈、模型成本、版本、受控更新与恢复边界；Telegram 与飞书已配置，但本轮消息进出闭环仍是 0/2 未验，Google Chat 当前关闭。", kind: "集成与运维", href: "/projects/openclaw-gateway" },
    ]
  },
  {
    id: "machine-and-remote",
    number: "02",
    title: "电脑、服务与跨设备",
    summary: "知道电脑现在怎样、程序怎样启动、故障怎样回放，也分清哪些跨设备能力可用、待验或已经冻结。",
    ordinaryRequest: "比如我问：“昨晚电脑为什么卡？出门后有哪些远程能力现在真能用，哪些还待验或已经停用；重装后又该从哪里恢复？”",
    collaboration: "电脑配置中心提供当前机器与恢复事实，历史项目提供过去证据，显示、远程与修复项目分别完成自己的现实动作。",
    delivery: "机器与历史证据、安全修复、实体或远端使用结果，以及不影响当前工作的恢复路径。",
    unavailable: "历史缺采、设备离线或远端未实测时保留 Unknown，不用重启替代诊断，也不把主机运行冒充实体或对端可用。",
    assets: [
      { id: "codex-local-remote", title: "跨设备任务连续性的历史产品", repo: "codex-local-remote", role: "曾让手机继续桌面上的同一任务、审批、文件和队列；当前入口已冻结，只保留设计与历史验收证据。", kind: "历史能力", href: "/projects/codex-remote" },
      { id: "emerald-veil", title: "桌面壁纸与空闲屏幕保护", repo: "emerald-veil", role: "保存选定的 Windows 桌面与锁屏背景，便于重装后恢复；电脑空闲六分钟时显示原生泡泡，输入后退出。壁纸恢复、泡泡运行和远程使用分别核对，实际屏幕与远程体验尚未全部验收。", kind: "桌面能力", href: "/projects/emerald-veil" },
      { id: "meshclip-kit", title: "跨设备剪贴板与文件", repo: "meshclip-kit", role: "把现成的私有组网与跨设备服务配置成可诊断、可恢复的文字和文件通道；当前没有可用 KDE 对端，真实双机传输尚未验收。", kind: "集成能力", href: "/projects/meshclip-kit" },
      { id: "pc-panel-hub", title: "电脑状态副屏", repo: "PC-Panel-Hub", role: "把性能、媒体和可操作告警放到两块职责不同的实体副屏上。", kind: "工作能力", href: "/projects/pc-panel-hub" },
      { id: "pcconfig", title: "电脑配置与恢复中心", repo: "PCConfig", role: "回答机器现在怎样、改动会影响什么、程序从哪里启动、重装后怎样恢复；电脑 MCP 也让手机或云端 AI 使用这台电脑的文件、命令和桌面。", kind: "核心基座", href: "/projects/pcconfig" },
      { id: "proxy-clean", title: "代理断开后的网络修复", repo: "ProxyClean", role: "诊断代理退出后的残留设置，默认只清失效的本机端口；明确选择直连时才清理所列活动代理。没有健康物理默认出口时保留路由。", kind: "修复工具", href: "/projects/proxyclean" },
      { id: "ramdisk-guardian", title: "高速缓存守护", repo: "RamdiskGuardian", role: "恢复缓存盘目录、记录内存与空间状态，并在既定阈值下重建驱动缓存；重建会清空缓存，不保护误放的唯一文件。当前定时任务运行，提交余量偏低的警告保留。", kind: "缓存守护", href: "/projects/ramdisk-guardian" },
      { id: "sunshine-remote-streaming", title: "远程使用高性能电脑", repo: "sunshine-remote-streaming", role: "管理串流主机、显示兜底、窗口回迁和网络诊断；当前不把服务在线冒充手机直连、流畅度、显示故障转移或远程冷开机已经验收。", kind: "集成与运维", href: "/projects/sunshine-remote-streaming" },
      { id: "timeaudit", title: "电脑黑匣子", repo: "TimeAudit", role: "持续记录电脑状态，让卡顿、耗电、崩溃和时间去向可以事后回放。", kind: "证据系统", href: "/projects/timeaudit" }
    ]
  },
  {
    id: "materials-and-wechat",
    number: "03",
    title: "材料、微信与原件",
    summary: "让聊天、录音、扫描件和文件有界进入当前工作，同时一直保留它们与真实原件的关系。",
    ordinaryRequest: "“找回那份材料，把这段微信和录音整理清楚；我在可信文件管理器删掉的原件就当本人不要，不要再从索引或恢复包复活。”",
    collaboration: "材料与微信入口先找到有界原件，语音和扫描项目保留时间、页码与风险，通用 AI 再把多种材料组织成同一项工作。",
    delivery: "可打开的原件、回复与媒体关系、带时间位置的文字、版面结构、引用和待确认项。",
    unavailable: "原件不在当前覆盖、附件丢失或识别失败时明确实际检查范围与待确认项，不用摘要补齐缺失事实。",
    assets: [
      { id: "chinese-asr", title: "中文语音理解", repo: "ChineseASR", role: "把录音变成可搜索、可定位、可复核的文字，也提供 Win+H 麦克风听写与焦点变化后的输入保护。", kind: "工作能力", href: "/projects/chinese-asr" },
      { id: "local-ocr", title: "本地精确文字识别", repo: "LocalOCR", role: "把截图、扫描件和复杂 PDF 转成可核对的文字、表格、公式、版面和坐标，并用 display_summary（人话状态摘要）说明覆盖、质量、置信度和警告。", kind: "工作能力", href: "/projects/localocr" },
      { id: "personal-materials", title: "个人材料查找", repo: "personal-materials", role: "9 月 7 日只读盘点完成 37 个登记来源，记录 45,123 个非媒体路径条目，其中 35 个精确登记、45,088 个按需发现。inspect 验真后交回定位供 AI 阅读，明确要求桌面查看才打开；已选定文档可继续定位相关段落。本人删除精确原件后，现有日常同步只退役该出现记录与独有派生内容。", kind: "资料入口", href: "/projects/personal-materials" },
      { id: "personal-media", title: "个人媒体整理与恢复", repo: "personal-media", visibility: "PRIVATE", role: "9 月 5 日目录记录 20,312 张照片、376 个视频和 3,851 个音频；精选 1,145 张照片、37 个视频都在手机包与云候选中。本地保留、云候选和手机资格分别决定，普通新增不自动进手机。电脑端手机包已恢复为 6,262 项，手机曾多写的 163 项仍待下次连接后精确清理。", kind: "媒体原件与恢复", href: "/projects/personal-media" },
      { id: "wechat-history-ai-bridge", title: "WeFlow 微信接口接入", repo: "wechat-history-ai-bridge", role: "为 WeFlow 提供账号与消息读取契约、接口自检和有界静默启动；现役微信日常入口仍由独立 WeChatDirect 承担。健康响应不等于真实聊天读取通过。", kind: "集成能力", href: "/projects/wechat-history-ai-bridge" },
      { id: "wechat-direct", title: "微信工作材料入口", repo: "WeChatDirect", role: "按指定账号和对象读取本机微信上下文并维护具名归档；当前 3 个完成态归档共保存 6032 条消息，3/3 独立验真通过，同时保留回复、媒体、可重放增量与显式 gap。", kind: "资料入口", href: "/projects/wechat-direct" }
    ]
  },
  {
    id: "documents-and-creation",
    number: "04",
    title: "文档、媒体与专项制作",
    summary: "把真实规则、文稿、声音和视觉素材组织成可以复核、重复生产的文档、报告或视频。",
    ordinaryRequest: "“把这些材料整理成一份能交付的文档，再生成逐页检查过的 PDF 或一段同步准确的视频。”",
    collaboration: "原生读取器保留文档结构，扫描与乱码入口处理特殊材料，文档、PDF 和视频工具分别负责生成与视觉验收。",
    delivery: "可编辑源稿、视觉样式、当前成品、页面或时间轴验收、来源与不能证明的部分。",
    unavailable: "源文件、字体、渲染或媒体链不完整时保留可编辑中间结果和具体问题，不复用旧输出冒充本轮成品。",
    assets: [
      { id: "md-triple-tactics-talent-solver", title: "规则仿真与策略报告", repo: "md-triple-tactics-talent-solver", role: "保留规则仿真、策略报告和早期视频制作流程的历史参考；已有材料不代表当前仍在持续运行。", kind: "历史资产", href: projectLedgerHref },
      { id: "typora-theme-pack", title: "写作与 PDF 视觉", repo: "typora-theme-pack", role: "让 Markdown 在编辑、个人阅读和专业导出时保持一致的视觉语言。", kind: "写作工具", href: "/projects/typora-theme-pack" },
      { id: "video-scaffold", title: "本地视频制作流水线", repo: "video-scaffold", role: "把已确认文案、Fish 配音、本机词级时间轴、审阅后的 SVG、渲染前预览、输入安全的 4K60 分片续作和成片交付串成一条可复核流程。", kind: "工作能力", href: "/projects/video-scaffold" }
    ]
  },
  {
    id: "personal-collaboration",
    number: "05",
    title: "个人事务与长期协作",
    summary: "健康、学习、个人发展和正式材料等项目分别保留自己的当前事实、证据与反馈，再把需要本人决定的部分交回来。",
    ordinaryRequest: "“先读我真正提供的材料，再结合当前资料帮我推进；没有我的反馈，不要假设已经理解或自动替我决定。”",
    collaboration: "每个领域项目独立保存自己的事实与证据，通用 AI 负责研究、解释和比较，最终方向、采用与停止仍由本人决定。",
    delivery: "分阶段材料、问题与选择、当前证据、反馈后的修订，以及明确由本人决定的下一步。",
    unavailable: "缺少必要原件或当前事实时，说明哪些判断还不能做。已经说清并授权的工作继续完成；只有需要本人选择、反馈或实际操作的那一步才等待，并说清在等什么。各领域的私人资料仍分别管理。",
    assets: [
      { id: "career-development", title: "AI 协助学习", role: "围绕权威资料、人话解释、交流后重查和少量不计分问题帮助理解；这里只介绍可复用方法，不展示私人学习主题或进度。", kind: "学习方法", href: "/projects/learning" },
      { id: "formal-materials", title: "文书和材料制作", role: "从当前事项和必要原件生成同源 DOCX/PDF、自包含材料包与逐页证据，并把本人签名、可递送、递送、收件、处理和对方签回分别说明。", kind: "文书与材料", href: "/projects/document-materials" },
      { id: "personal-health", title: "个人健康协作", repo: "personal-health", role: "先用处理后的健康底色回答，需要时才回原件或做一次前台设备更新。", kind: "长期协作", href: "/projects/personal-health" },
      { id: "daily-preferences", title: "个人理解库", repo: "daily-preferences", visibility: "PRIVATE", role: "把本人的经历、生活重点和真实取舍整理成能补充、纠正的共用背景。说一句“结合最近微信和新资料更新一下”，就从已读位置继续，读过必要上下文后修订认识，保留仍未读的范围。手机和云端通过已接通的电脑 MCP 读写同一份理解库；需要离线或转交时才导出。有具体疑点时，也可只读相关背景辅助核对；资料不能认证身份，待验证的新说法不自动改写原有认识。工作、学习、文书和健康各自负责专业判断。", kind: "共用本人背景", href: "/projects/daily-preferences", entryLabel: "进入完整项目页" },
      { id: "personal-expression", title: "个人表达：讲明白和拟消息", repo: "personal-expression", visibility: "PRIVATE", role: "把事情讲给我听，也帮我把已经确定的意思写成自然消息。指出难懂或别扭之处后，先改好当前回答，再保留有用反馈供下次参考。有具体疑点且需要核对时，也可只读既有表达作参考，不认证身份、不收录待验证的新说法。专业判断和沟通策略仍由当前任务负责；这里只讲解或拟稿，不发送。", kind: "解释与表达支持", href: "/projects/personal-expression" }
    ]
  },
  {
    id: "projects-and-delivery",
    number: "06",
    title: "项目资产、研究与交付",
    summary: "管理项目身份、工作树、验证、研究结论、发布和远端回读，让代码存在不冒充产品已经可用。",
    ordinaryRequest: "“先确认这个仓库是谁、现在在哪个分支；用真实任务验证能力，通过后再发布并从目标重新读取。”",
    collaboration: "项目总账确认身份与远端，具体项目拥有实现和测试，能力基准只给有限验证结论，公开入口负责最终呈现。",
    delivery: "全部项目身份、修改与验证边界、有限结论、正确远端、发布回读和公开入口。",
    unavailable: "缺失的 Git 事实只阻断依赖它的分支、同步或发布；目标已确认且不依赖该缺口的本地工作继续，提交存在不会冒充已经发布。",
    assets: [
      { id: "codex-agent-model-benchmark", title: "真实任务能力基准（CACB）", repo: "codex-agent-model-benchmark", role: "用同一任务和可复核结果比较不同 AI 工作方式，不把一次回答或当前有问题的评分当结论。", kind: "研究验证", href: "/projects/cacb" },
      { id: "github-local-index", title: "项目身份与发布总账", repo: "github-local-index", role: "先弄清仓库是谁、在哪里、能否公开、工作树和远端怎样，再谈修改与发布。", kind: "核心基座", href: "/projects/github-index" },
      { id: "work-delivery-copilot", title: "工作支持与交付", repo: "work-delivery-copilot", visibility: "PRIVATE", role: "支持真实工作中的理解、沟通、决策、评审与交付；轻量事项直接完成，需要持续来源版本和一致产物时才建立交付包。相关本人背景由个人理解库提供，业务事实与工作结果仍由本项目负责；六个正式文件、质量门、现实价值与恢复缺口分别说明。", kind: "真实工作支持与持续交付", href: "/projects/work-delivery" },
      { id: "wly0829-cn", title: "当前网站呈现仓库", repo: "wly0829.cn", role: "只负责把项目、规则、Skills 和公开安全事实呈现成当前网站；它计入总账，但不作为一个被介绍的项目。", kind: "呈现基础设施", href: "/", presentationOnly: true },
      { id: "wlyaaaaa", title: "GitHub 公开入口", repo: "wlyaaaaa", role: "把主要公开项目和个人站点放到 GitHub 首页，负责发现，不承担运行。", kind: "公开入口", href: "https://github.com/wlyaaaaa", entryLabel: "打开 GitHub 主页" }
    ]
  },
  {
    id: "backup-and-secrets",
    number: "07",
    title: "凭据、备份与恢复",
    summary: "保住 AI 工作区和电脑配置，再把敏感恢复材料分开保管。工作现场、私人伴生文件与密钥各有自己的恢复办法。",
    ordinaryRequest: "“让程序使用账号但别把秘密交给 AI；把真正不可再生的配置备份好，并证明能够恢复。”",
    collaboration: "AI 工作区备份汇总四套现有恢复路径，公开项目的私有文件另存。最高权限体系与 Key 的 VAULT03 密码库分开保管不同部分，电脑配置中心记录恢复关系。",
    delivery: "不含秘密的使用结果、分层备份、完整清单与指纹、远端回读和不覆盖冲突的恢复位置。",
    unavailable: "密钥、恢复因子、原备份或目标身份不足时停止精确恢复，不显示秘密、不覆盖冲突文件，也不声称备份可用。",
    assets: [
      { id: "ai-memory-backup-b", title: "AI 工作区备份与恢复", role: "把 Codex、Gemini、Claude 与 OpenClaw 的四套现有备份放在一起查阅：各自保存配置、记忆、可读成果或工作区，恢复时仍按各自范围和入口执行。Codex 完整会话另有 G/H 恢复点；同页展示不表示四套数据被合成一份备份。", kind: "恢复资产", href: "/projects/codex-memory" },
      { id: "devconfig-backup", title: "开发环境重装备份", repo: "devconfig-backup", role: "把开发配置、凭据和恢复清单整理成可选择回填的备份包，分别维护本地、G 盘和 Drive 结果。本地与 G 盘已有同一新包，Drive 仍保留上一代，各自按真实备份时间核对；微信回填先预检并保留回滚点，云端与原生恢复各自验收，官方客户端是否可用仍需实际确认。", kind: "恢复资产", href: "/projects/devconfig-backup" },
      { id: "key", title: "Key：分开保管的另一份恢复材料", repo: "Key", role: "用 VAULT03 和独立密码加密保管敏感密钥、恢复码、备用码等材料。最高权限体系与 Key 各保管一部分，分别解锁、互不替代；单拿一边不等于掌握全部恢复材料。这是两条保管线组成的双保险。", kind: "密码加密与私人备份", href: "/projects/vault-tool/private-backup", entryLabel: "了解密文备份与恢复" },
      { id: "public-project-private-backup", title: "公开项目的私有文件备份", repo: "public-project-private-backup", role: "公开项目的源码照常发布，已排除出公开 Git、但确有恢复价值的本地配置或材料另存私人备份。每份副本保留对应项目、原相对位置和指纹，恢复时能找回正确文件；它不是把整个公开仓库再复制一遍。有持续用途的小工具另由本机轻量工具清单按用途找回；源码、必要依赖与恢复说明已保存到 G 盘备份。现有正式能力只保留指针，由所属项目继续维护；一次性过程文件仍清理。", kind: "恢复资产", href: projectLedgerHref },
      { id: "steam-millennium-config-backup", title: "Steam 个性化配置备份", repo: "steam-millennium-config-backup", role: "每周保存白名单中的界面配置、插件清单和主题选项；重装后手工合并恢复，插件私有设置与程序资源另行处理。", kind: "恢复资产", href: "/projects/steam-millennium-config-backup" },
      { id: "vault-tool", title: "本地文件加密与恢复", repo: "vault-tool", role: "把明确文件和子目录加密保存，按需在本机查看或取回；区分合并、密码与密钥文件、库维护、双密码层、图片载体和私人密文备份。", kind: "加密工具", href: "/projects/vault-tool" }
    ]
  },
  {
    id: "history-and-recovery",
    number: "08",
    title: "历史与迁移参考",
    summary: "早期方案与迁移材料继续保留设计教训、迁移结论和恢复依据，但不作为当前工作入口。",
    ordinaryRequest: "“以前为什么这样设计，后来为什么改成独立入口？如果将来遇到同类问题，哪些结论仍然值得保留？”",
    collaboration: "当前项目继续承担现实工作；历史与迁移参考只提供旧设计、问题教训、替代入口和恢复线索，不回到运行路径。",
    delivery: "可追溯的历史决定、迁移原因、现行入口、恢复材料和明确的当前适用范围。",
    unavailable: "历史材料不完整时只说明已知范围；它不能替当前项目、当前规则或现实运行状态回答。",
    assets: [
      { id: "health-longevity", title: "健康协作早期方案", repo: "HealthLongevity", role: "早期项目只保留工程结构与交付经验，不再拥有写入；现役健康协作由 personal-health 与 Health Owner 承接。", kind: "历史参考", href: projectLedgerHref },
      { id: "human-alignment-dataset", title: "加密时间胶囊", repo: "human-alignment-dataset-001", role: "保留一份不可读的加密时间胶囊，不参与日常 AI 工作，也不从文件名推断内容。", kind: "历史参考", href: projectLedgerHref },
      { id: "wechat-direct-private-archive", title: "微信读取工具早期版本", role: "PRIVATE 仓库已归档，只保留公开前历史与迁移依据，不生产现役行为；读取、具名归档和恢复由 PUBLIC WeChatDirect 承接。", kind: "迁移参考", href: projectLedgerHref }
    ]
  }
];

const privateProjectSourceDigests = {
  "career-development": "e850873a91e7fa504e6b07c82e39c3d790767fbdcfbcbe127d7bb8ec4167feb3",
  "formal-materials": "d7ee4166428ce9693707b475e930a74b059b81610a1084eec495864ef258578d",
  "ai-memory-backup-b": "c52d549dad47c53914941e3df71dbcc76c687c895a13a1faab73c90760c4f549",
  "wechat-direct-private-archive": "f914c90f659820612b0ce431fecdf4050589e1bc94230f268d519fc96e239fcb",
};

export const systemProjectSourceMap = systemProjectDomains.flatMap((domain) => domain.assets.map((asset) => ({
  assetId: asset.id,
  domainId: domain.id,
  sourceIdentity: asset.repo ? `repo:${asset.repo}` : `sha256:${privateProjectSourceDigests[asset.id]}`,
  evidence: asset.id === "ai-memory-backup-b" ? "Codex、Gemini、Claude 与 OpenClaw 四套现有备份的独立源码、清单与恢复合同" : asset.id === "personal-media" ? "PRIVATE Git main 与元数据快照；媒体字节仍由本地原件和恢复副本保管" : "GitHub 总索引与项目当前 README / AGENTS",
  observedAt: systemProjectInventory.observedAt
})));

export const systemDependencyNodes = [
  {
    id: "direct-input",
    lane: "inputs",
    title: "提示词、附件与已知路径",
    subtitle: "大多数工作直接使用本次请求给出的文字、文件或明确位置",
    href: "#system-workflows",
    linkLabel: "查看真实工作场景",
    detail: "已知材料直接交给合适的读取器，不先绕到材料查找，也不为了定位建立第二份长期副本；工具所需临时文件不改变原件身份。只有非媒体文件位置未知或旧定位失效时，才调用原件查找。"
  },
  {
    id: "mixed-file-intake",
    lane: "inputs",
    title: "混合附件分流（file-intake-router）",
    subtitle: "一批材料格式混杂、包含压缩包或扫描类型不明时，先选择最能保留结构的读取方式",
    href: "/skills/file-intake-router",
    linkLabel: "Skill：混合附件分流",
    detail: "先识别文件真实类型、组合关系和扫描形式，再分别交给文档、表格、PDF、图片、OCR 或压缩包读取器；单个已知文件直接进入对应能力，不为它额外建立总入口。"
  },
  {
    id: "mojibake-repair",
    lane: "inputs",
    title: "乱码诊断与可逆修复（mojibake-doctor）",
    subtitle: "从原始字节判断编码链，先给修复预览，再决定是否替换",
    href: "/skills/mojibake-doctor",
    linkLabel: "Skill：乱码诊断与可逆修复",
    detail: "扫描、诊断和修复预览保持只读；只有精确文件已获准、当前指纹仍匹配并保留了原字节备份时，才原子替换。出现不确定编码或替换冲突就保留原件并停止。"
  },
  {
    "id": "general-ai",
    "lane": "capability",
    "title": "理解与研究",
    "subtitle": "把问题讲清楚，把依据找齐",
    "detail": "阅读文字、图片和附件，拆解问题、比较方案，检索并核对资料。最后交回有依据的解释和建议，把事实、推测与仍不确定的地方说清。",
    "searchHref": "#system-node-general-ai",
    "searchAliases": [
      "理解问题",
      "资料研究",
      "方案比较",
      "阅读图片"
    ]
  },
  {
    "id": "image-creation",
    "lane": "capability",
    "title": "图像创作",
    "subtitle": "从一句想法到可修改的画面",
    "detail": "描述画面或提供参考图，生成插画、封面、壁纸与设计预览；调整构图、配色、背景和局部细节，按反馈继续修改，交回可使用的图片。",
    "searchHref": "#system-node-image-creation",
    "searchAliases": [
      "图片生成",
      "图像编辑",
      "做封面",
      "画海报",
      "改图片背景",
      "GPT Image",
      "设计预览"
    ]
  },
  {
    "id": "document-creation",
    "lane": "capability",
    "title": "文档制作",
    "subtitle": "把材料变成能交付的文件",
    "detail": "把零散资料整理成报告、文档、表格和演示稿，调整结构、措辞与版式；检查页面和图表，交回可编辑文件及需要的 PDF。",
    "searchHref": "#system-node-document-creation",
    "searchAliases": [
      "制作报告",
      "做PPT",
      "制作表格",
      "文案",
      "排版"
    ]
  },
  {
    "id": "data-analysis",
    "lane": "capability",
    "title": "数据分析",
    "subtitle": "从数字里找规律，把结论画出来",
    "detail": "清理与计算数据，比较不同情形，制作图表或交互可视化。交回分析结果、计算依据和可复用文件，缺失数据不会被补成事实。",
    "searchHref": "#system-node-data-analysis",
    "searchAliases": [
      "数据分析",
      "图表可视化",
      "数据清理"
    ]
  },
  {
    "id": "code-and-tools",
    "lane": "capability",
    "title": "代码与工具",
    "subtitle": "把重复步骤交给程序",
    "detail": "编写、运行和修复代码，调用接口、脚本和状态探针，检查结果。以前用过的小工具可以按用途找回，拿到入口、使用条件与备份；找到以后再按任务执行。",
    "searchHref": "#system-node-code-and-tools",
    "searchAliases": [
      "代码执行",
      "状态探针",
      "本机轻量工具",
      "图片变清楚",
      "以前用过的工具"
    ]
  },
  {
    "id": "browser-operation",
    "lane": "capability",
    "title": "浏览器操作",
    "subtitle": "在真实网页上查找与办理",
    "detail": "阅读网页、搜索信息、填写表单、上传指定文件，延续已有标签页中的工作。用网页最终显示的内容和提交记录核对结果，让查资料与实际办理连起来。",
    "searchHref": "#system-node-browser-operation",
    "searchAliases": [
      "浏览器",
      "网页操作",
      "填写表单",
      "上传文件"
    ]
  },
  {
    "id": "computer-operation",
    "lane": "capability",
    "title": "电脑操作",
    "subtitle": "看见界面，也能动手处理",
    "detail": "查看屏幕，点击、输入并操作桌面应用，配合文件和命令处理电脑问题；需要诊断时查看运行状态或分析指定轨迹。交回实际变化、处理结果和仍未确认的部分。",
    "searchHref": "#system-node-computer-operation",
    "searchAliases": [
      "computer use",
      "电脑操作",
      "桌面控制",
      "画面卡",
      "轨迹分析"
    ]
  },
  {
    "id": "task-collaboration",
    "lane": "capability",
    "title": "任务协作",
    "subtitle": "让复杂工作持续推进",
    "detail": "把目标拆成可完成的步骤，安排能独立进行的工作并行处理，保留进度与断点，再汇总和检查结果。主任务始终负责最终交付，按你的反馈调整方向。",
    "searchHref": "#system-node-task-collaboration",
    "searchAliases": [
      "任务规划",
      "并行协作",
      "子代理",
      "断点续作"
    ]
  },
  {
    id: "agents",
    lane: "governance",
    title: "AI 协作治理与能力供应（.agents）",
    subtitle: "AI 工作治理、授权、能力使用和协作",
    href: "/projects/agents",
    detail: "决定事实该向谁读取、多个智能体怎样分工、现实动作是否已获授权，以及怎样分层说明完成；它不提供基础智能，也不替具体项目回答业务事实。"
  },
  {
    id: "rules",
    lane: "governance",
    title: "5 份现行规则",
    subtitle: "根规则、重大动作、授权协作、决策上下文和能力路由",
    href: "/rules",
    detail: "规则约束什么时候继续、暂停、调用能力和怎样验收。它们不产生事实或智能，而是让强能力在不同项目里保持同一做事边界。"
  },
  {
    id: "execution-owner",
    lane: "governance",
    displayOrder: 90,
    title: "施工责任（Execution Owner）",
    subtitle: "每次写入前确认谁在改哪一块，防止多个任务同时覆盖同一文件、模块或责任范围",
    links: [
      { href: "/projects/agents/authorization-owner", label: "查看 Owner 机制" },
      { href: "/rules/?rule=authorization_delegation_contract", label: "规则：授权与委派" }
    ],
    searchAliases: ["多个 AI 同时改一个文件怎么办", "谁正在修改这个文件", "防止多个任务互相覆盖"],
    searchDetail: "写前认领最小施工范围；重叠拒绝、逐次复核，未完成义务必须正式转交。",
    compactSearch: "最小 scope Claim 重叠拒绝 task scope revision 只读复核 checkpoint Transfer Recover",
    searchText: "多个 AI 同时修改一个文件或模块时怎样防止覆盖，谁持有施工范围，冲突如何停止或移交",
    detail: "纯只读调查不需要认领。第一次专属写入前，任务以 CAS（比较后交换）认领最小施工范围；每次写入再核对本次动作、任务、范围、绑定和登记表修订号。发现重叠时只停止对应写入，其他不冲突工作继续；任务结束时，无未完事项就释放范围，有断点或残余义务就连同检查点正式移交或恢复给真实接续任务。它只协调施工，不产生用户授权或业务事实。"
  },
  {
    id: "durable-task-state",
    lane: "governance",
    displayOrder: 91,
    title: "长任务状态与断点接续",
    subtitle: "压缩、中断或交接后，从正确项目和 Owner 恢复目标、边界、决定、当前实现与验证位置",
    href: "/projects/agents/context-evidence",
    linkLabel: "查看上下文与完成证据",
    searchAliases: ["长任务中断后怎么继续", "对话压缩后怎样恢复现场", "任务交接断点和当前状态"],
    detail: "摘要只作为线索，真实状态仍留在拥有它的项目、Owner 和现场证据里；接续时重新读取会改变决定的当前来源。必要来源不可读时，只把受影响结论标为未知或阻断，不恢复中央数据库补答案，也不保存隐藏推理。"
  },
  {
    id: "collaboration-hooks",
    lane: "governance",
    title: "协作运行钩子（Hooks）",
    subtitle: "在任务进入和创建协作者前，把真实宿主身份与活动规则带进运行现场",
    href: "/skills/native-economy-routing",
    linkLabel: "Skill：原生代理协作路由",
    searchAliases: ["Hook 创建子代理前核对身份", "宿主钩子怎样让规则生效"],
    detail: "对话开始或子代理启动时先注入已经核验的身份与当前规则；真正创建协作者前再复核一次。Hook 只验证身份、规则和参数，不替 AI 决定开多少协作者，也不扩大授权；身份或规则无法验证时只关闭本次委派，主任务的普通工作继续。"
  },
  {
    id: "skills",
    lane: "governance",
    title: "自然语言能力入口（Skills）",
    subtitle: "当前公开选择的领域能力入口",
    href: "/skills",
    linkLabel: "查看全部 Skills",
    detail: "Skills 把普通请求约束成有触发、流程、依赖、失败和边界的领域入口。公开目录只是当前选择，不等于全部现役和按需能力。"
  },
  {
    id: "pcconfig",
    lane: "machine",
    title: "电脑事实与恢复控制面（PCConfig）",
    subtitle: "电脑、路径、端口、运行、软件、任务、备份和恢复",
    href: "/projects/pcconfig",
    detail: "它是机器事实地图和恢复中心；项目仍拥有自己的业务配置，PCConfig 只保存机器关系、验证入口与恢复顺序。"
  },
  {
    id: "password-center",
    lane: "machine",
    title: "凭据中心（Password Center）",
    subtitle: "凭据元数据、盲填与盲注入、受控显示和恢复",
    href: "/projects/pcconfig/secrets-providers",
    detail: "让程序完成登录与调用，又不必把密码或令牌交给普通聊天、命令行和文件。机器安装、备份和恢复事实仍由 PCConfig 提供。"
  },
  {
    id: "runtime-startup",
    lane: "machine",
    title: "运行、任务与自启动",
    subtitle: "运行时、受管软件、端口、计划任务和登录启动",
    href: "/projects/pcconfig/runtime-startup",
    detail: "把软件存在、任务定义、最近运行结果和业务真正完成分开观察；启动链失败时能找到精确任务、身份和恢复入口。"
  },
  {
    id: "recovery-backup",
    lane: "machine",
    title: "换机、重装、备份与恢复",
    subtitle: "从 BIOS/UEFI、PE 识盘和驱动，到项目、任务、登录与应用可见",
    href: "/projects/pcconfig/recovery-backup",
    detail: "先区分同机重装、换机、系统盘故障或仅 PE，再按不破坏原盘的顺序恢复。普通资料与媒体可用已核验的原生 G/H 副本，只有真正凭据和受保护载荷才走各自正式加密恢复入口；G→H 有 14 组来源，H 在 9 月 5 日已完成首次备份验收，9 月 9 日 03:10 UTC 的冷备也已完成。之后的新增量仍要另次备份。BIOS记录、启动介质、任务Ready和复制分别证明各自一层，最终还要自然启动并确认应用真正看见数据。"
  },
  {
    id: "protected-data",
    lane: "machine",
    title: "受保护数据与加密库（Vault）",
    subtitle: "加密对象、版本换挡、最后可用版本和只读恢复",
    href: "/projects/pcconfig/protected-data",
    detail: "现役版本选择器可以在切换失败时退回最后确认可用版本；下一代恢复内核、加密库和正式数据迁移仍是候选，不称已经安装或已经恢复。源码和合成样本通过，只证明对应实现路径，不证明真实因子、正式数据、重启或故障恢复已经验收。"
  },
  {
    id: "google-workspace",
    lane: "external",
    title: "邮件、云盘与日历",
    subtitle: "固定账号的收件箱、Drive 文件和日历事件可以按需进入任务",
    href: "/skills/google-workspace-direct",
    linkLabel: "Skill：邮件、云盘与日历",
    detail: "可以直接用普通要求查收件箱、云端硬盘或日历；默认只读，明确授权后只执行入口已支持的精确写入，不静默换账号、浏览器或第二条服务路线。"
  },
  {
    id: "message-ai-gateway",
    lane: "external",
    title: "消息型 AI 网关的运维与渠道验收（OpenClaw​Gateway）",
    subtitle: "本机网关可以维护；Telegram 与飞书已配置但本轮消息闭环仍是 0/2，Google Chat 当前关闭",
    href: "/projects/openclaw-gateway",
    linkLabel: "查看 OpenClawGateway",
    searchAliases: ["OpenClawGateway", "Telegram 飞书 Google Chat 消息交办"],
    detail: "这是本人主动发起工作的设计入口，不是定时任务或结果通知。它维护消息接入、启动、自愈、模型成本、版本、受控更新和恢复；当前Telegram渠道未运行、处于recovering（恢复中）且connected=false（未连接），飞书为running/starting（运行中/启动中），两条渠道的消息 E2E 都未完成，付费 Live（真实调用）也没有执行。绝不拿源码或端口替代实际结果。"
  },
  {
    id: "scheduled-events",
    lane: "external",
    title: "定时与事件触发",
    subtitle: "按时间，或由支持的 Gmail、Slack、GitHub 事件启动任务",
    href: "https://learn.chatgpt.com/docs/automations",
    detail: "定时任务可在后台运行；符合条件的网页或移动端账号还能监听新邮件、指定频道消息或 PR 活动。账号、计划和工作区设置决定实际可用性。"
  },
  {
    id: "notifications",
    lane: "external",
    title: "主动通知与待处理提醒",
    subtitle: "工作需要注意时，通过当前账号可用的桌面、Activity（活动中心）、push（推送）、email（电子邮件）或 SMS（短信）渠道提醒",
    href: "https://learn.chatgpt.com/docs/notifications",
    detail: "通知类别和渠道由当前表面、账号与设置决定；电子邮件只是可能的可配置渠道，不写成每个任务都保证发送邮件。"
  },
  {
    id: "timeaudit",
    lane: "machine",
    title: "电脑历史与有界诊断（TimeAudit）",
    subtitle: "工作站时间、性能、故障历史与有界诊断入口",
    links: [
      { href: "/projects/timeaudit", label: "进入项目" },
      { href: "/skills/timeaudit-diagnostics", label: "Skill：有界电脑历史诊断" }
    ],
    detail: "项目保存过去证据，Skill 把普通故障描述收窄成最短必要时间窗和覆盖质量；通用 AI 再结合当前现场比较原因。没有历史数据只表示证据缺失，不等于电脑当时健康。"
  },
  {
    id: "panel-hub",
    lane: "machine",
    title: "实体副屏状态与事件（PC Panel Hub）",
    subtitle: "实体副屏上的持续状态、任务和有限事件",
    href: "/projects/pc-panel-hub",
    detail: "无需打开网页，也能持续看见电脑状态、任务和有限告警；指标代理、可信度、渲染、传输、事件调度、告警恢复和看门狗是个人维护的产品主体。它不替代历史诊断，主机心跳也不能替代实体像素验收。"
  },
  {
    id: "remote-computer-mcp",
    lane: "machine",
    title: "手机与云端操作电脑（电脑 MCP）",
    subtitle: "让正在聊天的 AI 使用这台 Windows 电脑",
    href: "/projects/pcconfig/remote-computer-mcp",
    detail: "手机发出要求，ChatGPT 等客户端负责推理，电脑执行文件、文档片段、脚本与桌面操作，再返回实际结果。电脑需开机联网并登录，桌面操作还需解锁；复用当前电脑规则与个人 Skill，能力和权限按真实接口判断。"
  },
  {
    id: "companion-laptop",
    lane: "machine",
    title: "副驾驶笔记本（待实机验收）",
    subtitle: "登记为台式机的日常副电脑、远程入口和应急接管候选",
    links: [
      { href: "/projects/pcconfig/machine-facts", label: "查看机器事实" },
      { href: "/projects/pcconfig/recovery-backup", label: "查看恢复方法" }
    ],
    detail: "已经有单独的主机清单、只读健康入口和恢复源码与材料；但当前在 WLY 台式机上只会得到 host mismatch（主机不匹配），目标笔记本、恢复 U 盘和外置 NVMe 接管都还没有完成真机验收。它现在是一套可检查的接管方案，不能写成已经能替台式机承接工作。"
  },
  {
    id: "cross-device-files",
    lane: "machine",
    title: "设备间文字与文件（MeshClip Kit）",
    subtitle: "在自己的 Windows 笔记本和台式机之间传递剪贴板内容与明确文件",
    href: "#system-project-asset-meshclip-kit",
    linkLabel: "查看跨设备文件项目",
    detail: "用于在自己的 Windows 笔记本与台式机之间传递文字和文件，保留发送方、接收方和失败说明。当前没有可用 KDE 对端，本轮尚未验证真实双机传输；Android 与手机也仍待验证。文件通道不传桌面画面，也不能证明远程控制、高性能应用或同一项 AI 任务已经接续。"
  },
  {
    id: "remote-workstation",
    lane: "machine",
    title: "远程使用高性能电脑（Sunshine / Moonlight）",
    subtitle: "从手机或笔记本接入台式机画面、输入和高性能应用",
    href: "/projects/sunshine-remote-streaming",
    linkLabel: "查看 Sunshine 远程串流",
    links: [
      { href: "/projects/sunshine-remote-streaming", label: "查看 Sunshine 远程串流项目" },
      { href: "/skills/tailscale-safe-exposure", label: "Skill：具名设备的最小远程接入" }
    ],
    detail: "主机、客户端、显示、输入、网络路径和真实交互分别验收；配置存在或设备在线不等于画面、控制和应用已经可用。它不同于设备间文件传输，也不同于 Codex Remote 的任务级连续性。"
  },
  {
    id: "github-index",
    lane: "projects",
    title: "项目身份与发布总账（GitHub 总索引）",
    subtitle: "全部项目身份、公开性、远端、工作树、同步和发布",
    href: "/projects/github-index",
    detail: "拥有全部仓库身份与本地副本事实，而不是项目目录中的精选入口。能传输、内容适合公开和用户授权发布始终是三个不同判断；动态数量由下方项目版图统一说明。"
  },
  {
    id: "project-entry-gate",
    lane: "projects",
    title: "项目身份入口（project-entry-gate）",
    subtitle: "只有 Git 事实会改变当前决定时，才做精确入场检查",
    href: "/skills/project-entry-gate",
    linkLabel: "Skill：Git 项目身份入口",
    detail: "从 GitHub 总索引读取仓库、公开性、默认分支、远端、工作树和同步状态，交回继续、先处理或停止的证据；它不产生提交或发布授权。"
  },
  {
    id: "work-delivery",
    lane: "projects",
    title: "工作支持与交付",
    subtitle: "支持眼前的工作事项，需要持续来源版本时再形成一致交付包",
    links: [
      { href: "/projects/work-delivery", label: "查看完整项目" },
      { href: "/skills/work-delivery", label: "Skill：工作支持与交付" }
    ],
    detail: "真实工作中的理解、沟通、判断、评审和交付都能进入现有项目，轻量支持直接完成；需要持续来源版本和一致产物时，才保存选定来源、结构化事实、审阅与质量状态，形成六个固定文件。相关本人背景可来自个人理解库，业务事实仍由工作项目负责。关键冲突未解决时保留草稿，质量未就绪不生成正式 Office 成品；一次性单文件直接使用相应能力，不扫描未选资料。"
  },
  {
    id: "ai-cli-entry",
    lane: "projects",
    title: "AI 命令行工作入口（AI CLI Profile Manager）",
    subtitle: "把多套命令行入口的启动、配置档、隔离、体检和真实连接测试放在一起",
    href: "/projects/ai-cli-profile-manager",
    linkLabel: "查看 AI 命令行项目",
    detail: "它负责选择并启动明确的命令行工作入口，保存可恢复的配置和隔离边界；启动成功不等于远端账号、模型或目标任务已经可用，仍要做当次连接和现实任务验证。"
  },
  {
    id: "local-ai-runtime",
    lane: "projects",
    title: "本地 AI 运行环境",
    subtitle: "由 PCConfig 管理本机推理入口、启动恢复与显卡资源调度",
    href: "/projects/pcconfig/runtime-startup",
    linkLabel: "查看本地运行环境",
    detail: "它提供机器上的本地推理能力和客户端接入事实；配置文件或模型文件存在不证明服务此刻在线、性能合格或特定任务适用，精确状态仍回到机器现场。"
  },
  {
    id: "llm-backend-job",
    lane: "projects",
    title: "额外 AI 后端任务入口（llm-backend-toolkit）",
    subtitle: "只把范围封闭、答案可独立检查的任务交给当前登记的额外后端",
    links: [
      { href: "#system-project-asset-llm-backend-toolkit", label: "查看项目版图" },
      { href: "/skills/llm-backend-toolkit", label: "Skill：额外 AI 后端工具箱" }
    ],
    detail: "每项任务保留作业、结果和回执，再由主任务用独立标准验收；后端失败不会静默换路线，也不会让后端自报替代最终判断。边界不清、影响高或无法独立验证的工作留在主任务。"
  },
  {
    id: "codex-remote",
    lane: "projects",
    title: "跨设备任务连续性的历史产品（Codex Remote）",
    subtitle: "曾真实运行；当前入口冻结，只保留设计与证据",
    href: "/projects/codex-remote",
    detail: "历史版本实现过移动网页、本机中介、共享任务、认证、重连、队列、文件操作和 Windows 运行生命周期；当前控制入口不可用且冻结，网页不做状态探测。若将来恢复，必须另行重建 Windows 接管并完成真实端到端验收。"
  },
  {
    id: "cacb",
    lane: "projects",
    title: "真实任务能力基准（CACB）",
    subtitle: "隔离执行、确定性验证、终态归档和有限结论",
    href: "/projects/cacb",
    detail: "检查复杂任务实际完成了什么、哪里失败和证据是否足够；不是排行榜，证据未闭合时也不会形成可靠评分结论。"
  },
  {
    id: "learning-project",
    lane: "personal",
    title: "AI 辅助学习",
    subtitle: "权威研究、人话材料、反馈修订和最小验证",
    href: "/projects/learning",
    detail: "AI 承担研究、解释和修正，人决定方向、深度和停止。没有监督、打卡、进度百分比或自动续课。"
  },
  {
    id: "career-development",
    lane: "personal",
    title: "个人发展与长期学习协作",
    subtitle: "把方向、学习、项目实践和用户反馈保存在一条可持续推进的工作线上",
    href: "#system-project-asset-career-development",
    linkLabel: "查看项目版图",
    detail: "项目保留当前目标、断点和已经确认的反馈，AI 负责研究、教学和技术判断；它与公开的通用学习方法不共享状态，首页也不公开私人经历、求职策略或个人结果。"
  },
  {
    id: "materials",
    lane: "inputs",
    title: "位置未知时的非媒体原件查找",
    subtitle: "先查登记定位；只有位置确实未知时才有界发现，选中后再验真",
    links: [
      { href: "/projects/personal-materials", label: "进入个人材料查找完整项目页" },
      { href: "/skills/personal-materials", label: "Skill：非媒体原件查找" }
    ],
    searchHref: "/projects/personal-materials",
    searchAliases: ["个人材料查找", "非媒体原件定位", "忘了文件放在哪里", "材料在文件管理器删了", "我自己删的文件不用恢复"],
    detail: "9 月 7 日有界只读盘点完成 37/37 个来源、45,123 个非媒体路径条目，其中 35 个精确登记、45,088 个按需发现；没有读取正文、计算原件哈希或写库。8,310 个媒体文件和 2,591 个更深目录按范围跳过。有界发现仍最多 8 个来源、2500 个文件、8 秒。候选隐藏路径，选中后只读验真并交回定位，明确要求桌面查看才打开；locate-content 可定位已选文档的有关段落。查询不触发同步，日常任务负责精确退役本人已删除的原件记录。"
  },
  {
    id: "media",
    lane: "inputs",
    title: "个人媒体整理、检索与恢复",
    subtitle: "项目负责完整媒体生命周期，Skill 负责从一句普通请求进入查找入口",
    links: [
      { href: "/projects/personal-media", label: "进入个人媒体整理与恢复完整项目页" },
      { href: "/skills/personal-media", label: "Skill：个人照片、视频与录音检索" }
    ],
    searchHref: "/projects/personal-media",
    searchAliases: ["个人媒体整理与恢复", "找照片视频音频", "精选照片和视频", "媒体在文件管理器删了", "删除原件后退出手机恢复包和云候选", "手机照片双盘保全", "手机恢复包", "云端候选"],
    detail: "9 月 5 日目录记录 20,312 张照片、376 个视频和 3,851 个音频（3,844 段录音、6 个音乐、1 个铃声），精选 1,145 张照片和 37 个视频。项目拥有可重建目录、视觉分类、本地接入、手机 E/G 双盘保全、6,262 项且低于 60 GB 的手机包与 6,500 项 upload=0 云候选；本地保留、云候选和手机资格分别决定。locate-audio 可验真已选原音并复用既有转写定位时间段。电脑端包已纠正，手机多出的 163 项仍待连接后清理；不把计划或源码通过当作手机已经完成。"
  },
  {
    id: "wechat-bridge",
    lane: "inputs",
    title: "WeFlow 微信接口接入（wechat-history-ai-bridge）",
    subtitle: "显式使用 WeFlow 时，按账号、范围和返回证据正确取数",
    href: "/projects/wechat-history-ai-bridge",
    linkLabel: "查看微信接入项目",
    detail: "WeFlow 提供本地数据与 HTTP 服务，本项目提供取数契约、自检和有界静默启动；并有只核验已取得文件集的回读工具。当前日常微信 Skill 走独立 WeChatDirect。两条路线不能互证，接口健康不等于具名会话已读取。"
  },
  {
    id: "wechat-direct",
    lane: "inputs",
    title: "微信工作材料与具名归档（WeChatDirect）",
    subtitle: "读取明确对象的聊天、回复关系和媒体，也能维护一个具名会话的可重放增量",
    links: [
      { href: "/projects/wechat-direct", label: "进入 WeChatDirect 完整项目页" },
      { href: "/skills/wechat-direct", label: "Skill：微信上下文与单会话归档" }
    ],
    detail: "当前已有 3 个完成态具名归档，共保存 6032 条消息、3 个原始语音文件和 3 个派生文件，3/3 独立验真通过；三份都保留明确 gap。一次问题仍只读取明确联系人或群的有界窗口，需要长期保存时才更新该具名归档；不后台同步整个账号，也不把本地可见范围冒充微信远端全历史。"
  },
  {
    id: "localocr",
    lane: "inputs",
    title: "图像场景与精确文字分工（LocalOCR）",
    subtitle: "按结果选择原生视觉、精确 OCR 或两路独立执行",
    links: [
      { href: "#system-project-asset-local-ocr", label: "查看项目版图" },
      { href: "/skills/localocr", label: "Skill：图像理解与精确 OCR 分工" }
    ],
    detail: "只描述场景、物体或活动时直接看原图，不启动 LocalOCR；逐字抄写、小字、坐标、表格、公式、印章、批量或全本地请求进入 LocalOCR。混合请求让视觉与 OCR 独立读取同一原图，再把场景观察、精确文字、识别状态和冲突分开；display_summary 只解释 OCR 状态，不替代原始文字、坐标或客观结果侧车。"
  },
  {
    id: "documents-skill",
    lane: "personal",
    title: "可编辑文档能力（documents）",
    subtitle: "创建、修订、批注 Word 文书并逐页检查真实版面",
    href: "/skills/documents",
    linkLabel: "Skill：可编辑文档能力",
    detail: "需要可继续编辑、修订、批注或保留复杂 Word 结构时使用；保留样式、表格和页眉页脚，结构正确仍不能替代最后一轮逐页渲染验收。"
  },
  {
    id: "pdf-skill",
    lane: "personal",
    title: "PDF 读写与表单能力（pdf）",
    subtitle: "同时核对内容结构、字段值、页面控件、显示外观和逐页版面",
    href: "/skills/pdf",
    linkLabel: "Skill：PDF 读写与表单",
    detail: "需要读取、填写交互表单或交付固定版面时使用；页面看见值不等于字段已经正确写入，默认保留交互性，只有明确要求才压平。"
  },
  {
    id: "document-materials-skill",
    lane: "personal",
    title: "文书和材料制作",
    subtitle: "从真实原件和当前材料状态进入合同、说明、申请、事件材料或提交包",
    links: [
      { href: "/projects/document-materials", label: "进入文书和材料制作完整项目页" },
      { href: "/skills/document-materials", label: "Skill：文书和材料制作" }
    ],
    searchHref: "/projects/document-materials",
    searchAliases: ["文书和材料制作", "制作DOCX和PDF材料包", "递送收件处理状态", "对方签回哪个版本", "材料生成平台收到接收方处理"],
    detail: "先核对当前事项、必要原件、事实、来源说明、待确认项和未知，再生成同源 DOCX/PDF、自包含材料包与逐页彩色/灰度证据；produced（已生成）、signed（本人已签）、ready_for_delivery（已具备递送条件）、delivered（已递送）、received（已收件）、handled（已处理）和 counterparty_signed_returned（对方签回）始终分开。"
  },
  {
    id: "chinese-asr",
    lane: "personal",
    title: "中文录音转写与桌面听写（ChineseASR）",
    subtitle: "录音生成可复核结果包，Win+H 听写逐停顿输入",
    href: "/projects/chinese-asr",
    detail: "文件路线处理长音频、分歧与局部失败；听写不自动发送，焦点变化后停输并可手动复制。个人麦克风实测待完成；关键内容仍由本人核对。"
  },
  {
    id: "chinese-asr-skill",
    lane: "personal",
    title: "中文录音任务入口（chinese-asr）",
    subtitle: "把自然请求送进正确转写、时间位置、说话人或复核模式",
    href: "/skills/chinese-asr",
    linkLabel: "Skill：中文录音任务入口",
    detail: "项目拥有语音处理实现，Skill 只负责选择本次真正需要的模式、输入和失败语义；两者不能互相冒充。"
  },
  {
    id: "personal-health",
    lane: "personal",
    title: "个人健康证据与安全决策",
    subtitle: "当前证据、风险、选项、未知和人类决定",
    href: "/projects/personal-health",
    detail: "把已有健康底色、新报告、设备数据和当前医学信息组织成可行动协作；不替人诊断、改药或自动改写当前健康事实。"
  },
  {
    id: "personal-health-skill",
    lane: "personal",
    title: "健康协作入口（personal-health）",
    subtitle: "已有事实优先，必要时才回原件或做一次前台刷新",
    href: "/skills/personal-health",
    linkLabel: "Skill：个人健康上下文",
    detail: "它把普通健康问题送到当前证据、权威研究和领域项目；最终采用、停止与高风险选择仍由本人决定。"
  },
  {
    id: "daily-preferences-skill",
    lane: "personal",
    title: "个人理解库入口（daily-preferences）",
    subtitle: "按当前问题理解本人，事实、推定和纠正分开",
    href: "/skills/daily-preferences",
    linkLabel: "Skill：个人理解库",
    searchAliases: ["了解我", "本人背景", "真实经历", "生活重点", "价值取舍", "认知", "吃什么", "购物", "出行旅行", "审美偏好", "我改主意"],
    detail: "查询、补充和纠正本人的基本信息、真实经历、生活重点、价值取舍、认知与偏好。按问题决定读取深度，旧材料结合发生时间和当时角色判断；明确事实和可推翻推定分开，不把行为直接写成喜欢。手机或云端通过已接通的电脑 MCP 查询、补充和纠正同一份理解库；只有确有离线或转交需要时才导出阅读文件。它为独立领域提供本人背景，接收有依据的回写；有具体疑点时只读必要旧背景辅助核对，待验证的新说法不回写。背景不作身份因子，专业判断和现实行动仍由对应领域负责。"
  },
  {
    id: "personal-expression",
    lane: "personal",
    title: "个人表达：讲给我听与替我拟消息",
    subtitle: "解释参考理解反馈，拟稿参考与当前场景有关的本人表达",
    href: "/projects/personal-expression",
    searchAliases: ["把事情讲明白", "我没听懂", "替我拟消息", "帮我回一句", "explain-to-me", "reply-as-me"],
    detail: "两种用途使用分开的参考资料：解释要让我理解，不模仿聊天口吻；拟消息先由当前任务确定意思和策略，再写出自然、可改的草稿。本人原话、他人语境、AI 草稿和本人修改分清保存，有价值的反馈先用于改好当前结果，再供下一次参考。本人背景仍由个人理解库提供，微信原件仍由微信项目负责。有具体疑点时，上游可只读相关旧表达辅助核对；保留作者和来源，不靠相似口吻认证身份，待验证的新说法、反馈与改稿不写成本人样本。读取和反馈机制已实现；后续真实任务主动补充资料并再次用好，以及动画上下文效果，仍需真实使用验证；不等于已经证明长期自动学习，也不会自动发送。"
  },
  {
    id: "verification",
    lane: "evidence",
    title: "如何确认工作真的完成",
    subtitle: "原件、测试、安装、发布、新任务、真实端到端验证和用户验收",
    href: "#evidence",
    linkLabel: "查看验证说明",
    detail: "原件、测试、安装、运行、发布、真实端到端和用户验收分别证明，不能互相替代；结果闭合到哪一层，就只声明哪一层。实现知识可能污染验收时，用不知道修法的新任务只接收自然要求，同时检查它是否自己选对入口、用户可见结果是否正确。"
  },
  {
    id: "human-review",
    lane: "evidence",
    title: "人的最终判断",
    subtitle: "验收、纠正、改变方向、继续或停止",
    href: "#evidence-human",
    linkLabel: "查看用户验收说明",
    detail: "系统交回结果和依据，本人保留目标、价值取舍和重要选择。已经明确授权的工作继续做；遇到需要本人选择、反馈或实际操作的步骤，才停下说明具体在等什么。健康、学习等任务各自明确的停止条件继续有效。"
  }
];

export const systemDependencyLanes = [
  { id: "inputs", number: "01", title: "输入与原件", description: "已知材料直接进入当前任务；位置未知时才查找，扫描件、微信和媒体按内容类型进入专用读取。" },
  { id: "capability", number: "02", title: "通用能力", description: "AI 工作环境自带的模型与工具，也是系统的一部分。它们能与自己的资料、项目配合，按当前接入的能力完成工作。" },
  { id: "governance", number: "03", title: "规则与能力入口", description: "个人规则、Hook 和 Skills 决定能力怎样安全进入真实任务。" },
  { id: "external", number: "04", title: "外部服务与触发", description: "邮件、云盘、日历、定时与事件把外部现场主动带进任务。" },
  { id: "machine", number: "05", title: "电脑、运行与恢复", description: "机器、服务、秘密、历史、换机恢复和实体运行事实。" },
  { id: "projects", number: "06", title: "项目、交付与跨设备", description: "全部项目资产、长期产品、工作交付、验证与跨设备连续性。" },
  { id: "personal", number: "07", title: "文档与个人领域", description: "文档、语音、健康与正式材料各自保留原件、事实和决定边界。" },
  { id: "evidence", number: "08", title: "验证与人的决定", description: "每一层分别证明，最终由人决定继续或停止。" }
];

export const systemRuleStories = [
  {
    id: "facts-first",
    ruleId: "agents_root_rules",
    number: "01",
    title: "先听当前目标和项目规则",
    summary: "当前要求决定方向，目标项目决定具体业务做法，活动规则补上跨项目边界。系统先保住目标、禁止项和已有工作，再选择方法。",
    ordinaryRequest: "“把这个网站修好，保留别人已有的修改；能自动完成的直接做，最后告诉我真实缺口。”",
    inputs: [
      "本轮真正要完成的目标、优先级和不能破坏的东西",
      "离当前文件最近的项目规则、现有实现和未提交修改",
      "只会改变当前决定的事实、未知和验收要求"
    ],
    collaboration: [
      "用户当前要求决定方向，目标项目决定具体做法",
      "AI 协作规则与能力中心只补充通用授权、协作和验证边界",
      "注意力先保留目标、现有工作、关键未知和真实验收",
      "先保留这次真正需要的功能、用法、正确性、恢复和维护要求；已经证明的扩展需要也不能遗漏。能用更少组件完成同样结果时，选择更直接的做法",
      "增加服务、数据库、状态记录或验证步骤前，先指出现有做法具体缺什么；没有实际缺口就不加"
    ],
    delivery: [
      "进入正确项目后的最小必要改动",
      "没有覆盖别人工作的实现与真实使用结果",
      "仍未确认的部分、恢复入口和是否需要本人决定"
    ],
    willNot: [
      "不会把旧计划、旧报告或记忆当成当前要求",
      "不会用全局习惯覆盖项目自己的业务规则",
      "不会为了省事覆盖已有修改、遗漏禁止项或把未知说成已完成",
      "不会为显得完整新增 watcher、数据库或重复文档，也不会为了压缩而丢掉例外、停止条件和优先级",
      "自造技术层、状态或证明链反而阻塞同一目标时，先删除或绕开这层复杂度，不继续叠加 guard、回执或备用流程"
    ],
    href: "/rules/?rule=agents_root_rules",
    entryLabel: "查看全局根规则"
  },
  {
    id: "active-and-recoverable",
    ruleId: "protected_major_actions_contract",
    number: "02",
    title: "普通工作直接做，确有疑点再核对本人",
    summary: "已授权的正常工作直接推进。普通聊天中若出现具体疑点，也先判断现有信息是否足够，确有需要才参考相关既有背景与表达；这些资料不能认证身份。需要本人验证时走现有验证入口，规则升级则另有可回退的版本切换。",
    ordinaryRequest: "“已经允许的工作直接做，不用每次打断我；真有需要核对本人的情况，再按实际情境处理，别靠一句话或口头禅下结论。”",
    inputs: [
      "准备执行的精确动作、目标对象和现实影响",
      "切换前可用状态、恢复材料和明确回退条件",
      "预演结果，以及是否确实需要本人在场验证"
    ],
    collaboration: [
      "具备判断资格的 AI 先看当前语境和信息缺口；只有补证会改变结论时才查相关本人背景或表达样本，不要求每轮查两库或重复派代理",
      "受保护入口把执行绑定到精确目标、版本和切换前状态",
      "达到需要本人验证的条件就使用已登记入口，不能为了继续查背景拖延处理；验证前先完成对应的生产等价预演",
      "规则升级保留固定版本、指纹、原子切换与回读；这条发布路径不需要真人因子"
    ],
    delivery: [
      "当前动作已完成，还是需要本人验证的清楚说明",
      "完成后的真实回读，以及仍然可用的回退版本",
      "失败时保留的安全旧状态和下一次可重试条件"
    ],
    willNot: [
      "不会因为出现某个关键词就机械升级为重大动作",
      "不会把相似口吻、知道个人经历或资料未命中当成身份认证，也不会在待验证时将新说法、反馈和改稿写成本人基准",
      "不会把管理员确认当成用户授权或人类验收",
      "不会把 E 规则激活混入真人验证路径",
      "不会让未经核对的草稿、目标或恢复材料进入切换",
      "不会在没有回退路径时破坏原来可用的状态"
    ],
    href: "/rules/?rule=protected_major_actions_contract",
    entryLabel: "查看重大动作保护"
  },
  {
    id: "authorization-and-ownership",
    ruleId: "authorization_delegation_contract",
    number: "03",
    title: "已经允许的工作继续做，多人协作不互相覆盖",
    summary: "用户已经说清楚的目标不会因为换一轮对话或增加协作者而失效；但每个协作者只能处理自己负责的最小范围，不能顺手扩大目标。",
    ordinaryRequest: "“这个网站通过检查后直接发布，别反复问同一件事；但不要覆盖别人正在做的修改。”",
    inputs: [
      "用户已经明确的目标、对象、动作和禁止项",
      "当前有哪些任务或协作者正在修改哪些范围",
      "真实仓库、远端、公开属性和发布目标"
    ],
    collaboration: [
      "修改前先确认谁负责哪些范围，每次动手仍要核对当前授权和负责关系，不能拿旧登记去覆盖别人的工作",
      "手机 Work、其他 MCP 客户端和电脑任务使用同一套协作规则，各自登记真实运行环境与任务身份；换界面不等于取得另一个任务的负责人权限",
      "手机断线或忘记交还时，有限租约到期会停止新的写入授权；接手前仍要核对原命令是否在运行、留下哪些改动与未完成部分，不能把失联当作已经结束",
      "只有相互冲突的修改需要停下，其他工作照常继续。完成后交还责任；没做完的部分连同断点、已有结果和下一步正式交接",
      "外部发布、消息、删除或其他现实动作仍使用对应的明确授权",
      "执行完成后从真实远端或目标重新读取，而不是只相信命令成功"
    ],
    delivery: [
      "合并后的唯一结果和每一项现实动作的真实回读",
      "谁处理了哪一部分，以及是否仍有未移交工作",
      "提交、发布、恢复和下一位接续者能够继续的位置"
    ],
    willNot: [
      "不会让子代理、命令行或管理员权限扩大用户授权",
      "不会让两个任务同时覆盖同一批文件",
      "不会因标题、超时或没有新消息就判断一个任务已经结束",
      "还有后续、队列、未完成事务或未移交工作时，不会把任务归档"
    ],
    href: "/rules/?rule=authorization_delegation_contract",
    entryLabel: "查看授权与委派"
  },
  {
    id: "right-source",
    ruleId: "four_base_decision_context_contract",
    number: "04",
    title: "项目、Git、电脑和规则，各找自己的事实",
    summary: "个人系统不是一个把所有内容复制进去的总数据库。它知道什么时候该问规则、仓库、电脑或具体项目，再把几处事实组合成一个判断。",
    ordinaryRequest: "“这项功能代码已经发布，为什么我的电脑上还是用不了？”",
    inputs: [
      "项目当前实现和业务验收方式",
      "仓库中的版本、分支、远端和发布事实",
      "电脑上的路径、运行时、任务、端口和恢复事实"
    ],
    collaboration: [
      "AI 协作规则与能力中心负责 AI 行为、授权和能力怎样使用",
      "GitHub 总索引负责仓库身份、同步和发布现场",
      "PCConfig 负责电脑、运行、任务和恢复现场",
      "具体项目继续负责产品是否真正可用"
    ],
    delivery: [
      "问题究竟落在代码、发布、机器接入还是项目运行",
      "不同来源之间的矛盾和各自负责的修复入口",
      "能继续的部分、被哪项缺失事实阻断的部分"
    ],
    willNot: [
      "不会让一个来源越权替另一个来源回答",
      "不会把设计文档、提交存在或服务运行冒充用户可用",
      "不会复制全部私人正文建立新的中央个人数据库"
    ],
    href: "/rules/?rule=four_base_decision_context_contract",
    entryLabel: "查看三控制面决策上下文"
  },
  {
    id: "intent-to-capability",
    ruleId: "capability_routing_contract",
    number: "05",
    title: "说目标就够了，系统自己选能力",
    summary: "用户不需要先知道 Skill、工具或代理的名称。系统从目标、材料、风险和现场能力出发，选择最小但足够的正式路线。",
    ordinaryRequest: "“把这段微信聊天、语音和扫描附件整理成纪要；人名、数字和没听清的地方不要猜。”",
    inputs: [
      "普通语言描述的目标和希望得到的结果",
      "这次明确提供的聊天、文件、图片、录音或项目现场",
      "隐私、时间、成本、可逆性和是否需要外部动作"
    ],
    collaboration: [
      "通用 AI 负责理解、推理、研究和组织结果",
      "对应能力或项目负责实际读取和操作，说明能处理哪些对象、失败时会发生什么",
      "先明确怎样才算这件事真正办好。现有或原生入口已经满足时，直接使用，不增加另一套连接程序、服务、状态记录或验证流程",
      "只有支路独立、可验且不会互相覆盖时才并行，主任务统一验收",
      "需要确认普通新任务也会用时，让不知道修法的另一个 AI 按正常请求实际试一次，只给它正常可见的能力，不提前告诉正确路线"
    ],
    delivery: [
      "已经选中的能力路线和实际完成结果",
      "原件、时间位置、页码、测试或现实回读等可核对依据",
      "需要盲测时，同时证明新任务自己选对入口和用户可见结果真实正确",
      "失败、降级、未知和仍需本人决定的内容"
    ],
    willNot: [
      "不会要求用户先背内部能力名称",
      "不会因为初始工具列表短就直接宣布做不了",
      "不会机械套用所有 Skills、重复安装同类能力",
      "不会为了显得在并行而开启没有独立价值的协作者",
      "不会用最佳实践、企业级或未来可能需要证明新增技术层；自造复杂度导致失败时先删除或绕开该层",
      "不会把提示里已经点名 Skill 或工具的测试冒充实现盲测"
    ],
    href: "/rules/?rule=capability_routing_contract",
    entryLabel: "查看能力路由"
  }
];

export const systemSkillFamilies = [
  {
    id: "find-context",
    number: "01",
    title: "找到资料和对话",
    requests: [
      "“找去年在餐厅拍的那组照片，或者那份我忘了放在哪的合同。”",
      "“看看对方上次在微信里承诺什么时候交付，再从固定云盘找最新版附件。”"
    ],
    inputs: [
      "真正记得的时间、地点、联系人、标题或内容线索",
      "明确联系人、群、账号或必要时间范围",
      "只在位置未知或旧定位失效时扩大到获准范围"
    ],
    collaboration: "媒体、非媒体材料、微信和办公账号各保留自己的原件与读取入口；通用 AI 只把当前任务需要的少量结果放在一起。",
    delivery: [
      "少量经过核对、可以直接打开的真实原件",
      "带时间、回复关系和媒体关系的聊天上下文",
      "来自固定账号的邮件、云盘或日历结果",
      "没有找到时实际检查过的范围和真实覆盖缺口"
    ],
    willNot: [
      "不会把零匹配写成电脑或账号里绝对没有",
      "不会全盘扫描、同步整个微信账号或建立第二个索引",
      "不会静默换用另一个办公账号或浏览器会话",
      "不会复制、移动或删除原件"
    ],
    members: [
      { slug: "personal-media", name: "个人媒体定位", technicalName: "personal-media", summary: "按自然线索找到照片、视频和录音原件，也能建立不复制原件字节的临时浏览目录。", href: "/skills/personal-media" },
      { slug: "personal-materials", name: "非媒体原件定位", technicalName: "personal-materials", summary: "先查项目登记的位置与版本；位置未知时，在获准范围内找少量候选。选中后才核对原件大小和 SHA-256，交回经过核对的文件位置；明确要在桌面查看时才打开。", href: "/skills/personal-materials" },
      { slug: "wechat-direct", name: "具名微信上下文", technicalName: "wechat-direct", summary: "读取一个明确联系人或群的小段上下文、回复关系和相关媒体；明确需要时才做单对象增量归档。", href: "/skills/wechat-direct" },
      { slug: "google-workspace-direct", name: "固定办公账号入口", technicalName: "google-workspace-direct", summary: "通过登记的同一账号读取邮件、云盘和日历；明确写入只使用现有的精确操作。", href: "/skills/google-workspace-direct" }
    ]
  },
  {
    id: "understand-evidence",
    number: "02",
    title: "读懂材料、个人事实与日常偏好",
    requests: [
      "“把这段两小时录音转成带时间位置的文字，没听清的不要猜。”",
      "“读这份扫描合同里的金额表格和盖章页；这批混合附件先分清该怎么读。”",
      "“结合我当前健康事实回答这个问题，新报告先别自动覆盖。”",
      "“今天吃什么？我改主意了，最近不想吃辣，也想试点新鲜的。”",
      "“按我平时的取舍推荐一个周末景点和住宿，再给两个工具或数字服务选择，说明为什么。”"
    ],
    inputs: [
      "一个明确文件、短列表或与当前问题有关的附件子集",
      "原音频、原图、原报告和当前健康事实",
      "需要精确到时间、页码、坐标或本人判断的真实问题",
      "用户本人当前明示，以及会改变这次吃喝、购物、支付消费、旅行住宿、娱乐、数字服务、工具或审美选择的最小证据"
    ],
    collaboration: "先由附件分流选择保留结构最多的读取方式；录音、扫描件、本人判断、健康事实和日常偏好分别进入自己的能力。偏好路线先尊重当前明示，再用薄快照和最小证据排序；具体复购或原因需要时先核对事实，最后由通用 AI 组织成可理解、可纠正的回答。",
    delivery: [
      "带时间位置的转写、匿名说话人范围和不确定性",
      "可回到页码、表格或坐标核对的扫描结果",
      "具名媒体中本人候选的位置或语音时间段",
      "区分个人事实、原始报告、医生意见、AI 分析和未知的健康回答",
      "说明具体内容、依据、取舍和推测边界的熟悉、相邻与新鲜日常选择"
    ],
    willNot: [
      "不会把语音或文字识别结果抬高成原件本身",
      "不会因空结果就声称没有声音或没有文字",
      "不会扫描整个媒体库、建立人物库或识别其他人",
      "不会自动诊断、改药或用新报告静默覆盖当前健康事实",
      "不会把旧消费记录写成固定人格，也不会建立中央画像或后台同步"
    ],
    members: [
      { slug: "file-intake-router", name: "混合附件分流", technicalName: "file-intake-router", summary: "先看清 Word、表格、PDF、图片、压缩包或文件夹结构，再交给保留信息最多的读取器。", href: "/skills/file-intake-router" },
      { slug: "chinese-asr", name: "中文录音理解", technicalName: "chinese-asr", summary: "把中文录音变成带时间位置的文字，保留任务续跑、匿名说话人和本人语音判断的证据边界。", href: "/skills/chinese-asr" },
      { slug: "localocr", name: "图像场景与精确文字分工", technicalName: "localocr", summary: "按请求选择原生视觉、LocalOCR 或两路独立执行；分开保留场景观察、精确文字、识别状态、坐标、空结果语义与冲突。", href: "/skills/localocr" },
      { slug: "media-person-self", name: "具名媒体中的本人判断", technicalName: "media-person-self", summary: "只判断指定照片或录音中是否支持本人候选，并返回可复核的位置、覆盖范围和未知。", href: "/skills/media-person-self" },
      { slug: "personal-health", name: "个人健康上下文", technicalName: "personal-health", summary: "用当前个人健康事实回答问题；新报告或设备数据先采集、核对和审核，再决定是否更新。", href: "/skills/personal-health" },
      { slug: "daily-preferences", name: "个人理解库", technicalName: "daily-preferences", summary: "按问题使用本人的经历和真实取舍，也能按提示词吸收微信等动态材料与新导出，复核受影响认识并从实际阅读位置继续。事实、推定和纠正分开，日常推荐与领域回写继续保留。", href: "/skills/daily-preferences" }
    ]
  },
  {
    id: "make-documents",
    number: "03",
    title: "交付文档与正式材料",
    requests: [
      "“把这几份需求、会议记录、规则和表格整理成口径一致的 PRD、评审材料和执行表；来源变化时告诉我哪些要重做。”",
      "“根据现有合同和材料准备一份可编辑文书，把制作完成、本人操作和外部回执分开。”",
      "“把这份 Word 文档修订好，保留批注，并逐页检查表格和页眉页脚。”",
      "“填写这份 PDF 表单，既检查页面显示，也核对真实字段值。”",
      "“把这篇中文 Markdown 导出成规定页数的 PDF，并检查每一页。”",
      "“这份文件打开后中文乱码，先判断能不能无损修复。”"
    ],
    inputs: [
      "用户明确选中的 2–5 份需求、会议记录、规则或表格，以及这次要交付给谁",
      "当前事实、唯一状态来源、原件、目标用途与外部动作边界",
      "Word、PDF、Markdown 或乱码文件的当前原件与目标格式",
      "修订、批注、字段、样式、页数和逐页验收要求",
      "乱码文件的原始字节，而不是已经错误显示的复制文本"
    ],
    collaboration: "工作交付入口先分开事实、假设、冲突和未知，并让多份成品引用同一事实版本；文书入口再区分材料制作和现实状态，Word、PDF、逐页渲染与乱码修复完成具体成品。",
    delivery: [
      "来源可追溯、跨文档口径一致的 PRD、评审材料与执行表，以及来源变化后的影响范围",
      "DOCX（可编辑 Word 文档）、已验收 PDF 或按要求保留交互性的表单",
      "文书制作、本人操作、平台或外部状态的独立结论",
      "完整页面总览图、可疑页、字段或具体页码问题",
      "乱码修复计划、原字节备份和修复后的重新验证"
    ],
    willNot: [
      "不会因为目标文件已经存在就把旧输出当成本轮成品",
      "不会把能渲染等同于内容语义正确",
      "不会把文书生成写成本人已经操作或外部已经处理",
      "不会后台扫描材料，也不会自动发送、审批或让一次性单文件编辑绕远路",
      "未经精确授权不会提交、付款、撤回或联系外部机构",
      "不会在编码链不明确时批量改写文件",
      "不会把私人正文和个人结果带进公开页面"
    ],
    members: [
      { slug: "work-delivery", name: "工作支持与交付", technicalName: "work-delivery", summary: "支持真实工作中的沟通、判断、评审和交付；需要持续来源版本与一致产物时才建交付包。Skill 负责路由，完整产品、质量门、六个固定文件与恢复缺口进入项目页。", href: "/skills/work-delivery" },
      { slug: "document-materials", name: "文书和材料制作", technicalName: "document-materials", summary: "从当前事项和必要原件生成同源 DOCX/PDF、逐页证据与自包含材料包，并把本人签名、可递送、递送、收件、处理和对方签回分别记录。", href: "/skills/document-materials" },
      { slug: "documents", name: "可编辑 Word 文书", technicalName: "documents", summary: "创建、修订、批注或导入 DOCX，并在每次有意义编辑后逐页检查真实版面。", href: "/skills/documents" },
      { slug: "pdf", name: "PDF 读写、表单与逐页验收", technicalName: "pdf", summary: "同时核对 PDF 内容结构、表单字段、页面控件、显示外观和逐页版面。", href: "/skills/pdf" },
      { slug: "md-to-pdf", name: "Markdown 转 PDF", technicalName: "md-to-pdf", summary: "按文档用途和分页要求生成 PDF，并核对源文件指纹、页数、中文文本和当前输出。", href: "/skills/md-to-pdf" },
      { slug: "pdf-render-safe", name: "PDF 逐页视觉验收", technicalName: "pdf-render-safe", summary: "把全部页面做成总览图，再单独检查可疑页，发现裁切、空白、错位和陈旧页面图。", href: "/skills/pdf-render-safe" },
      { slug: "mojibake-doctor", name: "中文乱码诊断与修复", technicalName: "mojibake-doctor", summary: "从原始字节判断乱码链，默认只给修复预览；确认可逆后才带备份原子替换。", href: "/skills/mojibake-doctor" }
    ]
  },
  {
    id: "diagnose-machine",
    number: "04",
    title: "查清电脑和连接为什么不对",
    requests: [
      "“昨晚十点半电脑突然卡了几次，现在正常；不要重启，帮我追查最可能原因。”",
      "“检查规则、Git 和 PCConfig 哪一处发生了漂移。”",
      "“只让我的具名设备访问这个本机服务，并从对端实际验收。”"
    ],
    inputs: [
      "尽可能窄的故障时间、症状和当前现场",
      "需要检查的责任来源，而不是默认全扫",
      "精确服务、协议、端口和经过核对的目标设备"
    ],
    collaboration: "历史聚合负责过去发生过什么，控制面体检负责把异常归到正确项目，远程接入能力只处理具名设备和精确端口；通用 AI 比较多个原因并选择下一项检查。",
    delivery: [
      "时间窗覆盖质量、相关信号、竞争原因和下一项安全检查",
      "按规则、Git、PCConfig 分开的正常、警告和阻塞",
      "配置、服务、监听器和对端真实连接四层验收，以及失败后的回滚"
    ],
    willNot: [
      "不会把相关性或一次峰值冒充确定根因",
      "不会把没有历史数据写成电脑当时健康",
      "只读诊断不会顺手重启服务、任务或采集器",
      "不会为了远程可用改成公网或全端口暴露"
    ],
    members: [
      { slug: "timeaudit-diagnostics", name: "有界电脑历史诊断", technicalName: "timeaudit-diagnostics", summary: "用最短必要时间窗读取覆盖质量、性能和状态聚合，辅助诊断但不把相关信号冒充根因。", href: "/skills/timeaudit-diagnostics" },
      { slug: "control-plane-doctor", name: "三个控制面只读体检", technicalName: "control-plane-doctor", summary: "只检查点名的规则、Git 或 PCConfig，把漂移、警告和阻塞交给真正负责的项目。", href: "/skills/control-plane-doctor" },
      { slug: "tailscale-safe-exposure", name: "具名设备的最小远程接入", technicalName: "tailscale-safe-exposure", summary: "只为精确服务、端口和设备建立最小接入，并分别回读配置和真实对端连接。", href: "/skills/tailscale-safe-exposure" }
    ]
  },
  {
    id: "continue-browser-work",
    number: "05",
    title: "在浏览器里恢复并完成表单工作",
    requests: [
      "“这个在线表单已经填了一半，浏览控制刚断了；保留登录态和现有内容，恢复后继续。”",
      "“这些附件要一个个上传；每个都确认页面真正成功，提交后再从平台记录核对。”"
    ],
    inputs: [
      "已经填到一半的网页、现有标签页和登录状态",
      "这次要填写的内容、上传的附件，以及哪些步骤已完成",
      "用户明确选择的文件与已经授权的外部动作",
      "当前遇到的问题和最终要完成的操作；技术连接信息由 AI 自行检查"
    ],
    collaboration: "宿主受管浏览能力负责实际页面操作，browser-control-continuity 负责保留标签页、恢复控制、观察异步控件、逐文件确认和提交后回读；页面字段、收件人和业务规则仍由所属项目负责。",
    delivery: [
      "恢复或保留的同一已登录页面",
      "每个上传文件的权威成功态与精确附件数",
      "提交前字段快照，以及提交后平台记录的实际字段和附件回读",
      "必要时只补精确缺失文件、可凭回执清理的临时运行兼容恢复"
    ],
    willNot: [
      "不会把文件名、100% 进度或页面跳转冒充成功",
      "不会为了恢复控制先关闭、刷新或覆盖已有用户状态",
      "不会用本地 runtime 恢复绕过登录、验证码、上传或最终提交授权",
      "不会把附件名、标签页正文、平台记录 ID 或页面专属业务规则写进通用 Skill"
    ],
    members: [
      { slug: "browser-control-continuity", name: "浏览器任务恢复、上传与提交回读", technicalName: "browser-control-continuity", summary: "在受管浏览中保留旧标签页，恢复运行缺口，按异步依赖继续操作，逐个核对上传成功，并从最终平台记录验证提交结果。", href: "/skills/browser-control-continuity" }
    ]
  },
  {
    id: "enter-and-refresh-projects",
    number: "06",
    title: "安全进入项目，并把结果送到正确位置",
    requests: [
      "“进入网站项目补上全文搜索，保留别人未提交的修改，确认仓库和分支后再发布。”",
      "“这个项目升级了，如果网页说明因此不准确，也一起更新；已有任务正在改网页时合到一起，别重复做。”"
    ],
    inputs: [
      "准确的仓库身份、目标工作树和准备进行的 Git 动作",
      "当前分支、远端、公开性、同步状态和其他未提交工作",
      "来源项目正式发布后的提交、变化路径和它为何会改变看板事实"
    ],
    collaboration: "AI先查清仓库、分支和已有改动，是否发布仍按本人授权。来源更新后，只检查对应说明和直接受影响的系统内容；如果已有任务确实正在更新网站并负责本次发布，就交给它合并。没有合适的任务才另行安排。每份更新保留来源、版本、变化文件、观察时间和生效代际，安排已接收也不代表更新已完成。",
    delivery: [
      "明确的继续、先处理再继续或停止判断",
      "保留其他修改后的定向提交和真实远端回读",
      "达到实质阈值时给现有发布 Owner 的一次对应快照增量，或无 Owner 时的一个新任务",
      "多个来源增量合并成一个稳定候选，只运行一次最终完整门、正常推送和 Pages/公网回读；不需要更新时保持网站不变"
    ],
    willNot: [
      "不会把仓库检查结果当成用户授权",
      "不会覆盖混合工作树中的其他修改",
      "不会因注释、格式、时间戳或仅指纹变化打扰网站",
      "不会为同一个项目和同一提交重复安排更新",
      "不会凭标题、更新时间或历史负责记录复用非 active 任务",
      "不会在已有合格活动网站发布 Owner 时再开竞争任务，也不会把安排受理冒充完成",
      "不会把一次来源事件扩成全站复核，或把预览服务当前台长任务等待"
    ],
    members: [
      { slug: "project-entry-gate", name: "Git 项目身份入口", technicalName: "project-entry-gate", summary: "在身份、公开性、分支、远端或同步状态会改变决定时，取得当前仓库真实现场。", href: "/skills/project-entry-gate" },
      { slug: "personal-panel-refresh", name: "个人看板实质刷新与发布合并", technicalName: "personal-panel-refresh", summary: "来源发布并确认后，只检查它对应的网页说明。已经负责本次网站更新的活动任务合并处理，保留来源和版本依据；没人负责时才另行安排，收到任务不等于网页已经更新。", href: "/skills/personal-panel-refresh" }
    ]
  },
  {
    id: "use-and-protect-secrets",
    number: "07",
    title: "使用秘密，并保护指定文件",
    requests: [
      "“让程序使用这个账号，不要把密码交给 AI 或写进命令。”",
      "“把我点名的文件夹加密并验证能恢复，遇到同名文件不要覆盖。”",
      "“检查独立加密库的私有备份是否能从远端回读。”"
    ],
    inputs: [
      "精确服务、账号、秘密引用或操作",
      "用户明确点名的文件、目录、加密包和恢复位置",
      "需要时由本人在本机完成的人类验证或密码输入"
    ],
    collaboration: "账号与访问凭据、最高权限控制的文件加密、独立加密库分属三个互不混用的产品；每个入口只处理自己的秘密、密钥和恢复链。",
    delivery: [
      "不暴露明文的凭据使用或盲填结果",
      "可验证、可续跑的加密包或恢复目录",
      "不含秘密内容的状态、冲突、回读和恢复回执"
    ],
    willNot: [
      "不会把密码、令牌、密钥或恢复码放进聊天、参数、日志和普通文件",
      "不会在三个加密与凭据领域之间混用密钥或恢复根",
      "不会扫描用户未点名的位置寻找要加密的文件",
      "不会覆盖冲突文件、删除源文件或把私有制品发到公开目标"
    ],
    members: [
      { slug: "local-secret-broker", name: "本地凭据使用", technicalName: "local-secret-broker", summary: "查找、盲填或盲注入本机凭据；只有明确要求并完成验证时才在本地显示一个指定字段。", href: "/skills/local-secret-broker" },
      { slug: "authorization-file-broker", name: "最高权限文件加解密", technicalName: "authorization-file-broker", summary: "只处理用户点名的路径，支持加密、无明文验证、续跑和不覆盖冲突文件的恢复。", href: "/skills/authorization-file-broker" },
      { slug: "vault-workflow", name: "独立加密库与密钥工作流", technicalName: "vault-workflow", summary: "密码只由本人在本机输入；写入前检查和预演，发布后从私有远端重新核对加密制品。", href: "/skills/vault-workflow" }
    ]
  },
  {
    id: "coordinate-ai-work",
    number: "08",
    title: "让多个 AI 协作，但不失控",
    requests: [
      "“内容、界面和测试可以并行，但不要让多个协作者改同一块，最后由当前任务统一验收。”",
      "“让另一条已登记的 AI 路线复核这组有固定答案的分类，失败不要静默换后端。”",
      "“我主动问配额或文本用量时，再给我权威状态；拿不到就说不知道。”"
    ],
    inputs: [
      "可以独立验收的子任务、验收标准和互不冲突的范围",
      "当前可用的协作入口、资源、隐私边界和真实身份",
      "只有用户明确提出的配额或文本计量问题"
    ],
    collaboration: "原生协作者用于当前任务内部的并行支路；额外 AI 后端只接受封闭且有独立验收器的任务；配额与文本计量是单独的按需查询。",
    delivery: [
      "每条支路的结果、依据、失败和仍需主任务判断的部分",
      "可追踪的额外后端任务和由主任务完成的独立验收",
      "用户明确询问时的权威配额或文本计量结果，以及未计入边界"
    ],
    willNot: [
      "不会把高影响、边界含糊或无法验收的工作交给外部支路",
      "不会让协作者扩大授权或高于主任务的工作范围",
      "不会在一条路线失败后静默换成另一条并冒充原结果",
      "不会因为对话看起来很长就自动查配额，也不会用字符或旧记录猜结果"
    ],
    members: [
      { slug: "native-economy-routing", name: "原生代理协作路由", technicalName: "native-economy-routing", summary: "Hook 先在任务进入和创建前核对宿主身份与活动规则；随后按独立性、写冲突和真实收益决定是否并行，主任务继续负责集成。", href: "/skills/native-economy-routing" },
      { slug: "llm-backend-toolkit", name: "额外 AI 后端工具箱", technicalName: "llm-backend-toolkit", summary: "只把范围封闭、可独立验收的任务交给当前登记的额外后端，并保存任务与结果回执。", href: "/skills/llm-backend-toolkit" },
      { slug: "token-budget-advisor", name: "配额与文本计量", technicalName: "token-budget-advisor", summary: "仅在用户明确询问时读取权威配额或文本计量；官方入口不可得时返回未知，不自行换算或猜测。", href: "/skills/token-budget-advisor" }
    ]
  },
  {
    id: "explain-and-draft",
    number: "09",
    title: "把事情讲明白，把消息写自然",
    requests: [
      "“我还是没听懂。按我现在的问题，把发生了什么、和我有什么关系讲清楚。”",
      "“意思已经确定了，帮我写成一条自然的微信消息，我看过再发。”"
    ],
    inputs: [
      "当前要解释的事情，或已经确定的回复意思和策略",
      "与这次沟通有关的理解反馈、本人表达和对方语境；缺少时直接说明"
    ],
    collaboration: "当前任务负责事实和专业判断。解释时参考我怎样更容易理解；拟消息时参考当前场景有关的本人表达。两类参考分开使用，个人理解库和微信项目各自保留原有职责。",
    delivery: [
      "能理解当前事情、影响和下一步的解释",
      "保持既定意思、自然且可修改的消息草稿",
      "先用于改好本次结果、再供下次参考的有价值反馈"
    ],
    willNot: [
      "解释不等于模仿我的聊天口吻，拟稿不代替当前任务决定策略",
      "不会把AI草稿保存成本人原话，也不会自动发送消息",
      "读取和反馈机制存在，不等于已证明后续每次都能主动补读或长期自动学习"
    ],
    members: [
      { slug: "explain-to-me", name: "向我解释", technicalName: "explain-to-me", summary: "结合理解反馈把当前事情讲明白；先改好这次解释，再保留有用教训。", href: "/skills/explain-to-me" },
      { slug: "reply-as-me", name: "替我拟回复", technicalName: "reply-as-me", summary: "按已经确定的意思和策略，参考有关表达写出自然、可改的消息；不自动发送。", href: "/skills/reply-as-me" }
    ]
  }
];

export const systemEvidenceLayers = [
  { id: "source", title: "原件与来源", proves: "输入、事实和引用能回到真实来源。", doesNotProve: "处理过程和最终结论也正确。", searchAliases: ["原始来源能证明什么"] },
  { id: "test", title: "项目测试", proves: "行为在明确的测试条件下符合预期。", doesNotProve: "程序已经安装、真实运行，或网页已经发布。", searchAliases: ["源码或构建通过能不能证明网页发布", "测试通过不等于发布"] },
  { id: "install", title: "安装与接入", proves: "目标环境已经接入这项能力。", doesNotProve: "新的自然请求能自动找到并选用它。" },
  { id: "fresh", title: "新任务发现", proves: "新的普通请求能够找到并正确选择入口。", doesNotProve: "真实对象已经产出预期结果。" },
  { id: "runtime", title: "现实运行", proves: "真实对象、工具或服务产生了预期输出。", doesNotProve: "从提出要求到拿到可用结果的每一步都成功。" },
  { id: "e2e", title: "真实端到端", proves: "从自然请求到最终结果的整条现实路径能够完成。", doesNotProve: "换一个环境、账号或任务类型仍会得到同样结果。" },
  { id: "publish", title: "按需发布与回读", proves: "需要发布时，结果已进入正确目标并重新读取；仅本地任务不必经过此层。", doesNotProve: "本人已经满意结果。", searchAliases: ["网页发布与公网回读", "发布后怎样确认真的更新"] },
  { id: "human", title: "用户验收", proves: "本次结果和体验真正满足当前目标。", doesNotProve: "换个人或换个场景仍满足需求。" }
];

export const systemDirectoryIntroductions = [
  {
    id: "projects",
    label: "项目",
    title: "想深入了解一个长期产品",
    body: "进入项目可以继续看它为什么存在、平时怎样使用、当前状态、完整工作流和技术证据；GitHub 总索引仍承载全部仓库身份。",
    href: "/projects"
  },
  {
    id: "rules",
    label: "规则",
    title: "想知道 AI 为什么继续、暂停或要求人决定",
    body: "进入规则可以看事实向谁读取、什么动作需要保护、多人怎样不互相覆盖，以及做到哪一步才算真正完成。",
    href: "/rules"
  },
  {
    id: "skills",
    label: "Skills",
    title: "已经有一个目标，想找到直接可用的能力",
    body: "进入 Skills 可以按现实需求找到触发方式、所需输入、处理流程、交付结果和失败边界；不知道名称时仍可以直接描述问题来搜索。",
    href: "/skills"
  }
];
