export const systemHomeHero = {
  eyebrow: "个人 AI 协作系统",
  title: "AI 如何协助我完成工作",
  paragraphs: [
    "通用 AI 与智能体能力负责理解自然语言、推理、研究、阅读图片与文档、使用工具、编写和运行代码、操作浏览器，以及组织并行协作。这些是系统使用的外部生产力，不是个人项目开发出来的基础智能。",
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
  { id: "system-cases", label: "真实工作" },
  { id: "system-automations", label: "自动协作" },
  { id: "system-dependencies", label: "系统组成" },
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
    rules: "先确认真实项目和现有修改；项目拥有业务做法；并行不能覆盖别人；源码、测试、安装、发布和用户可用分别验证。",
    result: "根因、实现改动、相关测试、真实使用结果、仍未闭合的部分、提交或恢复位置。",
    value: "调查、研究、实现、测试和真实使用属于同一个目标；只有这项需求确实需要时，才继续提交、发布或外部交付。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "github-index", "project-entry-gate", "all-projects", "verification", "human-review"],
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
    title: "只凭一段记忆，也能回到真正的照片、录音或文件",
    request: "“找去年在餐厅拍的那组照片，还有我忘了放在哪的延保合同。先给少量最可能的原件，不要全盘扫描，也不要复制或移动文件。”",
    systems: ["通用 AI 与智能体能力", "个人媒体定位（personal-media）", "非媒体原件定位（personal-materials）", "当前目录与索引", "真实原件"],
    rules: "先把时间、地点、人物、文件角色和内容线索拆开；已有精确路径直接读原件，只有位置未知或旧定位失效时才扩大到获准范围；零匹配只说明本轮没找到。",
    result: "少量核对过的候选、可直接打开的原件位置、每项为什么匹配、实际检查范围、仍需本人确认的候选和没有覆盖的地方。",
    value: "系统帮助从模糊记忆回到原件，但不复制一套中央资料库，也不把搜索结果冒充原件本身。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "materials", "media", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "自然线索",
        title: "先弄清记得的到底是什么",
        body: "把一句模糊描述拆成时间范围、地点、人物关系、媒体类型、文件角色和可能出现的文字；已经知道路径时不再启动发现流程。",
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
        body: "媒体和非媒体入口分别给出少量候选；系统再核对路径、文件角色、时间、大小、必要的预览和原件状态，排除同名、缓存或已失效定位。",
        items: [
          ["候选", "只返回最有区分力的少量结果"],
          ["核对", "路径、时间、角色、预览与必要指纹"],
          ["未知", "目录未覆盖、原盘离线或索引比原件旧"]
        ]
      },
      {
        number: "03",
        kicker: "直接可用的原件",
        title: "交回能打开的东西，而不是一段猜测",
        body: "结果按可信度列出可直接打开的原件和匹配理由；需要浏览时建立不复制原件字节的临时目录。没有找到时说明真正查过哪里和下一条最有价值线索。",
        items: [
          ["原件入口", "真实路径、临时浏览目录或少量候选"],
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
    systems: ["通用 AI 与智能体能力", "WeChatDirect", "材料库", "媒体库", "ChineseASR", "LocalOCR"],
    rules: "只读取明确会话和时间范围；消息关系与本地原件必须能够对应；原音频和扫描件高于识别结果；第三人私人内容不进入公开页面。",
    result: "可编辑纪要、决定与待办、消息与附件引用、录音时间位置、人名和数字复核表、来源缺口与矛盾项。",
    value: "它保留聊天顺序、回复关系和原件位置，不把一堆材料压成无法追溯来源的 AI 摘要。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "materials", "media", "wechat", "localocr", "chinese-asr", "chinese-asr-skill", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "具名上下文与原件",
        title: "先把聊天和附件关系找对",
        body: "WeChatDirect 只读取明确联系人或群的有界窗口，保留消息顺序、方向、回复关系和媒体关系；材料库和媒体库只在需要时打开对应原件。",
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
        body: "ChineseASR 规范化音频、处理长录音、保留时间位置和分歧；LocalOCR 读取扫描页、表格和版面。通用 AI 再把文本、语音和附件放回同一时间线。",
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
    dependencyIds: ["general-ai", "agents", "rules", "skills", "materials", "localocr", "documents-skill", "pdf-skill", "document-output-choice", "verification", "human-review"],
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
    dependencyIds: ["general-ai", "agents", "rules", "skills", "pcconfig", "timeaudit", "timeaudit-skill", "verification", "human-review"],
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
    dependencyIds: ["general-ai", "agents", "rules", "skills", "pcconfig", "runtime-startup", "recovery-backup", "password-center", "protected-data", "github-index", "all-projects", "verification", "human-review"],
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
    rules: "急症和红旗优先；报告事实、医生意见、本人陈述、外部资料和 AI 分析分开；新数据先保全和验证，不能自动改写当前健康底色；最终选择属于本人。",
    result: "健康时间线、变化与趋势、证据质量、方案收益与风险、停止或复查条件、待问医生的问题、仍缺资料和最低成本下一步。",
    value: "它不把健康协作缩成一次“第二意见”，而是让低频、分散、质量不同的个人证据在需要时进入同一项决策。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "password-center", "materials", "localocr", "personal-health", "personal-health-skill", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "当前健康底色与新证据",
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
        title: "外部数据先退出网络，再进入判断",
        body: "明确刷新已登记设备时，凭据只穿过受保护入口；取得数据后先完整保全原始页、清单与哈希，再离线核对来源、分页、时间覆盖和质量。通用 AI 随后结合当前权威资料解释变化、风险和真实选项。",
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
    label: "跨设备继续",
    title: "人离开电脑，复杂的 AI 工作不必断线",
    request: "“我已经出门了，用手机看看电脑上的任务做到哪；如果它需要决定，我在手机上回答，完成后把结果文件和真实交付状态给我。”",
    systems: ["通用 AI 与智能体能力", "Codex Remote", "当前项目", "安全接入", "GitHub 总索引"],
    rules: "必须连接同一个桌面任务、轮次和文件状态；手机不是第二个执行者；审批仍由本人决定；断线和派发不明不自动重放。",
    result: "同一个任务现在做到哪里、改了哪些文件、正在等什么决定、这一轮完成了什么、下一条要求是否已经排队，以及原项目的真实交付状态。",
    value: "手机入口、电脑连接、任务同步、身份验证、断线续接和文件操作组成一套个人维护的连续工作产品；它不是另外复制一份聊天。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "github-index", "all-projects", "codex-remote", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "同一任务身份",
        title: "先确认手机接的是电脑上那一项工作",
        body: "打开入口并登录后，手机读取电脑端已经存在的任务和历史；进入时核对任务、当前回复、工作目录和项目，确认接回的是同一项工作，而不是重新创建一份。",
        items: [
          ["任务", "同一持久任务和当前轮次"],
          ["项目", "原工作区、文件和真实项目身份"],
          ["连接", "本人登录，手机和电脑只控制同一份任务状态"]
        ]
      },
      {
        number: "02",
        kicker: "移动控制与重连",
        title: "看进展、补要求、审批和处理文件",
        body: "手机持续接收进展、工具活动、文件变化、待回答问题和审批。可以补充当前要求、停止、排队下一轮或打开指定文件；短暂断线后从最后收到的位置补齐，不必从头开始。",
        items: [
          ["当前轮", "进展、命令、文件和待处理问题"],
          ["人类决定", "审批、停止、补充要求和下一轮"],
          ["断线恢复", "保留草稿和待办，从最后位置继续"]
        ]
      },
      {
        number: "03",
        kicker: "回到项目结果",
        title: "手机只是连续性入口，不替项目证明完成",
        body: "最终文件、测试、提交和发布仍属于原任务和原项目；如果一条手机要求是否送达无法确认，就先停下来核对，避免重复发送或让两份任务同时改同一件事。",
        items: [
          ["轮次结果", "做成了什么、还缺什么和下一步"],
          ["项目证据", "真实文件、测试、提交和发布状态"],
          ["恢复", "桌面继续、入口重连或回到原生本地工作"]
        ]
      }
    ]
  },
  {
    id: "learning-collaboration",
    label: "研究与学习",
    title: "把一个陌生问题研究明白，并能迁移到新场景",
    request: "“把这个陌生概念讲到我能用自己的话解释，并能迁移到另一个场景；我不理解或不同意的地方再一起改。”",
    systems: ["通用 AI 与智能体能力", "用 AI 把一件事学明白", "权威资料入口", "必要的最小验证"],
    rules: "人决定问题、节奏和停止；来源变化先查当前资料；没有反馈不猜已经掌握；问题只帮助理解，不评分；文字不能证明时才做最小验证。",
    result: "一份可集中阅读的人话材料、可靠来源、用户反馈后的修订、可选问题、仍未知处和下一步最值得理解的内容。",
    value: "AI 承担研究、解释和修正，人保留方向和最终判断；没有课程后台、打卡、进度百分比或自动续课。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "learning-project", "verification", "human-review"],
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
    dependencyIds: ["general-ai", "agents", "rules", "skills", "all-projects", "cacb", "verification", "human-review"],
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
      process: "证据新鲜且没有变化就直接 no-op；只展开新增、变化、失败、未知或公开暴露风险，并在责任明确、可分离、可验证时做最小修复。",
      delivery: "按责任源给出 PASS、ATTENTION、BLOCK，说明证据新鲜度、实际修复、保留的并发工作、复杂度取舍和下一次真实触发点。"
    },
    {
      id: "website-snapshot",
      group: "computer",
      cadence: "每周",
      title: "个人系统网页快照更新",
      focus: "在治理事实收敛后，对照真实项目、规则和 Skills，检查 System、项目、规则与能力页面是否已经产生实质失真。",
      process: "没有会改变读者判断的变化就不改；有变化才更新对应快照与说明，并完成内容、构建、公开检查和真实页面验收。",
      delivery: "交回明确 no-op，或已验证的新快照、修改范围、发布结果与公网回读；不因时间戳、格式或仅哈希变化制造更新。"
    }
  ]
};

export const systemProjectInventory = {
  observedAt: "2026-08-31T16:22:53.6677663Z",
  total: 48,
  publicCount: 27,
  privateCount: 21,
  localCloneCount: 45,
  remoteOnlyCount: 3,
  detailedPageCount: 10,
  identitySha256: "sha256:5dcdadb63d6c6763a295daf6b30570983cb00b3fd7da1e617495fb14fbfc87ba",
  mappingSha256: "sha256:5119f090d277c94a28a68c13e4607dfabf4b7d720ce07b9e5d73e7227376fbd2",
  description: "这里的数量来自本次 GitHub 项目总账快照，不是永久常量。项目目录提供可深入阅读的完整参考，其余身份与系统角色由项目总账承载。"
};

const projectLedgerHref = "/projects/github-index/repository-ledger";

export const systemProjectDomains = [
  {
    id: "ai-work",
    number: "01",
    title: "AI 协作与能力运行",
    summary: "把一句自然需求送进正确的 AI 工作入口，组织规则、工具、后端与协作者，再把结果交回同一目标。",
    ordinaryRequest: "“把这项工作做完；能独立调查的并行，但不要互相覆盖，失败也不要静默换一条路线。”",
    collaboration: "规则与能力中心先收窄目标和边界，合适的工作入口负责执行，主任务统一比较证据、合并结果并处理失败。",
    delivery: "明确的能力路线、可追踪执行、失败分类、统一验收和可以继续的任务位置。",
    unavailable: "某个入口不可用时只停止依赖它的支路，保留已经完成的工作并说明缺口；不静默换路线冒充原结果。",
    assets: [
      { id: "agents", title: "AI 协作规则与能力中心", repo: ".agents", role: "让 AI 知道听谁的、能做什么、该用哪种能力、多个协作者怎样不互相覆盖，以及何时需要停下来交给人。", kind: "核心基座", href: "/projects/agents" },
      { id: "ai-cli-profile-manager", title: "AI 命令行工作入口", repo: "ai-cli-profile-manager", role: "把多套 AI 命令行入口的启动、Profile（配置档）、隔离、体检和真实连接测试收在一起。", kind: "工作能力", href: projectLedgerHref },
      { id: "ai-workbench-playbook", title: "AI 工作台使用手册", role: "把 Skills、插件、浏览器、工作树和长期任务的实测方法整理成可复用说明。", kind: "使用指南", href: projectLedgerHref },
      { id: "llm-backend-toolkit", title: "额外 AI 长任务执行器", repo: "llm-backend-toolkit", role: "把范围封闭、可客观验收的长任务变成可追踪作业，只返回紧凑结果和证据。", kind: "工作能力", href: projectLedgerHref },
      { id: "message-ai-gateway", title: "消息型 AI 工作入口", role: "把现成的消息型智能体网关接到本机工具，并维护启动、自愈、版本和更新边界。", kind: "集成与运维", href: projectLedgerHref },
      { id: "local-ai-runtime", title: "本地 AI 运行环境", role: "保存本地推理端点、模型别名、上下文策略和客户端配置的可复现基线；当前精确运行状态仍回到机器事实。", kind: "运行环境", href: projectLedgerHref }
    ]
  },
  {
    id: "machine-and-remote",
    number: "02",
    title: "电脑、服务与跨设备",
    summary: "知道电脑现在怎样、程序怎样启动、故障怎样回放，以及人离开电脑后怎样继续同一项工作。",
    ordinaryRequest: "“昨晚电脑为什么卡？如果我出门了，怎样继续这项任务；重装后又怎样恢复？”",
    collaboration: "电脑配置中心提供当前机器与恢复事实，历史项目提供过去证据，显示、远程与修复项目分别完成自己的现实动作。",
    delivery: "机器与历史证据、安全修复、实体或远端使用结果，以及不影响当前工作的恢复路径。",
    unavailable: "历史缺采、设备离线或远端未实测时保留 Unknown，不用重启替代诊断，也不把主机运行冒充实体或对端可用。",
    assets: [
      { id: "codex-local-remote", title: "跨设备继续 AI 任务", repo: "codex-local-remote", role: "在手机浏览器里继续桌面上同一项任务、审批、文件和队列，不复制第二份聊天。", kind: "工作能力", href: "/projects/codex-remote" },
      { id: "emerald-veil", title: "空闲屏幕保护层", repo: "emerald-veil", role: "电脑闲置时使用可逆、点击穿透的原生动态覆盖层，减少静态画面暴露。", kind: "桌面能力", href: projectLedgerHref },
      { id: "meshclip-kit", title: "跨设备剪贴板与文件", repo: "meshclip-kit", role: "把现成的私有组网与跨设备服务配置成可诊断、可恢复的文字和文件通道；当前配对与在线状态另行验证。", kind: "集成能力", href: projectLedgerHref },
      { id: "pc-panel-hub", title: "电脑状态副屏", repo: "PC-Panel-Hub", role: "把性能、媒体和可操作告警放到两块职责不同的实体副屏上。", kind: "工作能力", href: "/projects/pc-panel-hub" },
      { id: "pcconfig", title: "电脑配置与恢复中心", repo: "PCConfig", role: "回答机器现在怎样、改动会影响什么、程序从哪里启动、重装后怎样恢复。", kind: "核心基座", href: "/projects/pcconfig" },
      { id: "proxy-clean", title: "代理断开后的网络修复", repo: "ProxyClean", role: "代理异常退出后诊断并清理残留网络状态，让 Windows 回到可验证的直连。", kind: "修复工具", href: projectLedgerHref },
      { id: "ramdisk-guardian", title: "高速缓存守护", repo: "RamdiskGuardian", role: "让内存盘只承载可重建缓存，并在异常占用或结构损坏时安全重建。", kind: "缓存守护", href: projectLedgerHref },
      { id: "scripts", title: "电脑常用动作", repo: "Scripts", role: "把声音、微信双开、卡键、网络和热备等高频小问题收成可重复的一键动作。", kind: "工具集合", href: projectLedgerHref },
      { id: "sunshine-remote-streaming", title: "远程使用高性能电脑", repo: "sunshine-remote-streaming", role: "把现成的串流主机、客户端和传输层配置成手机可用的远程工作站，同时守住画质、输入、显示和网络边界。", kind: "集成与运维", href: projectLedgerHref },
      { id: "timeaudit", title: "电脑黑匣子", repo: "TimeAudit", role: "持续记录电脑状态，让卡顿、耗电、崩溃和时间去向可以事后回放。", kind: "证据系统", href: "/projects/timeaudit" }
    ]
  },
  {
    id: "materials-and-wechat",
    number: "03",
    title: "材料、微信与原件",
    summary: "让聊天、录音、扫描件和文件有界进入当前工作，同时一直保留它们与真实原件的关系。",
    ordinaryRequest: "“找回那份材料，把这段微信和录音整理清楚；人名、数字和没听清的地方不要猜。”",
    collaboration: "材料与微信入口先找到有界原件，语音和扫描项目保留时间、页码与风险，通用 AI 再把多种材料组织成同一项工作。",
    delivery: "可打开的原件、回复与媒体关系、带时间位置的文字、版面结构、引用和待确认项。",
    unavailable: "原件不在当前覆盖、附件丢失或识别失败时明确实际检查范围与待确认项，不用摘要补齐缺失事实。",
    assets: [
      { id: "chinese-asr", title: "中文语音理解", repo: "ChineseASR", role: "把录音变成可搜索、可定位、可复核的文字，而不是只吐一段无法回听的稿。", kind: "工作能力", href: "/projects/chinese-asr" },
      { id: "local-ocr", title: "本地文档理解", repo: "LocalOCR", role: "把截图、扫描件和复杂 PDF 转成可核对的文字、表格、公式、版面和坐标。", kind: "工作能力", href: projectLedgerHref },
      { id: "personal-materials", title: "个人材料查找", repo: "personal-materials", role: "用一句普通话找回少量原件候选，选中后重新核对再打开。", kind: "资料入口", href: projectLedgerHref },
      { id: "wechat-history-ai-bridge", title: "微信记录安全接入", repo: "wechat-history-ai-bridge", role: "把现成本地微信接口整理成 AI 可有界读取、可探活、可校验的接入层。", kind: "集成能力", href: projectLedgerHref },
      { id: "wechat-direct", title: "微信工作材料入口", repo: "WeChatDirect", role: "按指定账号和对象读取本机微信上下文，保留回复、媒体和可重放增量关系。", kind: "资料入口", href: projectLedgerHref }
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
      { id: "md-triple-tactics-talent-solver", title: "规则仿真与策略报告", repo: "md-triple-tactics-talent-solver", role: "用真实规则和大规模仿真寻找更稳策略，再自动生成报告和视频。", kind: "研究制作", href: projectLedgerHref },
      { id: "typora-theme-pack", title: "写作与 PDF 视觉", repo: "typora-theme-pack", role: "让 Markdown 在编辑、个人阅读和专业导出时保持一致的视觉语言。", kind: "写作工具", href: projectLedgerHref },
      { id: "video-scaffold", title: "本地视频制作流水线", repo: "video-scaffold", role: "把文案、配音、词级时间轴、动画和高分辨率合成串成可重复生产的流程。", kind: "工作能力", href: projectLedgerHref }
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
    unavailable: "缺少原件、当前状态或本人反馈时，只保留该领域的未知和待办，不跨领域复制资料或替本人推进。",
    assets: [
      { id: "ai-coach", title: "AI 学习协作", repo: "ai-coach", role: "先读原始材料，再按用户实际反馈继续，避免反复从零讲或自动推进。它与公开的通用学习方法有关，但不是同一个项目身份。", kind: "长期协作", href: projectLedgerHref },
      { id: "ai-llm-job-prep", title: "学习材料库", repo: "ai-llm-job-prep", role: "把课程原件、总结和可打印知识地图组织成可复核的学习底稿。", kind: "学习资料", href: projectLedgerHref },
      { id: "career-development", title: "个人发展协作", role: "把方向、学习、项目表达和长期准备放在同一条可持续推进的工作线上；私人事实不进入首页。", kind: "长期协作", href: projectLedgerHref },
      { id: "formal-materials", title: "文书和材料制作", role: "把合同、说明、申请、事件材料和附件整理成可编辑、可打印、可核验、可恢复的正式成品，并把材料制作、本人操作和接收方处理分开说明。", kind: "文书与材料", href: projectLedgerHref },
      { id: "personal-health", title: "个人健康协作", repo: "personal-health", role: "先用处理后的健康底色回答，需要时才回原件或做一次前台设备更新。", kind: "长期协作", href: "/projects/personal-health" }
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
      { id: "work-delivery-copilot", title: "工作交付副驾驶", repo: "work-delivery-copilot", visibility: "PRIVATE", role: "把用户明确选中的需求、会议记录、规则和表格，整理成来源可追溯、跨文档口径一致、来源变化后能说明影响范围的交付包。", kind: "本地优先的持续工作交付工具", href: projectLedgerHref },
      { id: "wly0829-cn", title: "当前网站呈现仓库", repo: "wly0829.cn", role: "只负责把项目、规则、Skills 和公开安全事实呈现成当前网站；它计入总账，但不作为一个被介绍的项目。", kind: "呈现基础设施", href: "/", presentationOnly: true },
      { id: "wlyaaaaa", title: "GitHub 公开入口", repo: "wlyaaaaa", role: "把主要公开项目和个人站点放到 GitHub 首页，负责发现，不承担运行。", kind: "公开入口", href: projectLedgerHref }
    ]
  },
  {
    id: "backup-and-secrets",
    number: "07",
    title: "凭据、备份与恢复",
    summary: "让凭据可以在不暴露明文的情况下被使用，也让配置、密文和本地伴生资产在事故后可以恢复。",
    ordinaryRequest: "“让程序使用账号但别把秘密交给 AI；把真正不可再生的配置备份好，并证明能够恢复。”",
    collaboration: "凭据入口负责盲用，电脑配置中心保存恢复关系，加密工具与各类备份项目分别保存密文、配置、记忆和伴生文件。",
    delivery: "不含秘密的使用结果、分层备份、完整清单与指纹、远端回读和不覆盖冲突的恢复位置。",
    unavailable: "密钥、恢复因子、原备份或目标身份不足时停止精确恢复，不显示秘密、不覆盖冲突文件，也不声称备份可用。",
    assets: [
      { id: "ai-memory-backup-a", title: "项目记忆备份", role: "保存跨项目持久记忆的私人恢复副本，不保存原始会话。", kind: "恢复资产", href: projectLedgerHref },
      { id: "ai-memory-backup-b", title: "AI 工作配置、能力与记忆备份", role: "把选定配置、Skills、记忆与能力入口保存在本地热备和私人远端，供换机恢复。", kind: "恢复资产", href: projectLedgerHref },
      { id: "devconfig-backup", title: "开发环境重装备份", repo: "devconfig-backup", role: "只收真正不可再生的配置和恢复清单，让换机或重装不从零开始。", kind: "恢复资产", href: projectLedgerHref },
      { id: "ai-memory-backup-c", title: "AI 工作区配置与可读笔记备份", role: "保存外部 AI 工作区的选定配置和人类可读笔记，不复制原始对话。", kind: "恢复资产", href: projectLedgerHref },
      { id: "key", title: "加密密钥备份", repo: "Key", role: "只保存密文，让关键恢复材料有独立私人副本；首页不读取或解密内容。", kind: "加密备份", href: projectLedgerHref },
      { id: "openclaw-backup", title: "消息智能体恢复备份", role: "把消息型智能体网关的配置与工作区保存在独立私人恢复链里。", kind: "恢复资产", href: projectLedgerHref },
      { id: "public-project-private-backup", title: "公开项目的私有文件备份", repo: "public-project-private-backup", role: "把不能公开但值得恢复的本地文件，连同指纹和清单保存到独立私人备份库。", kind: "恢复资产", href: projectLedgerHref },
      { id: "steam-millennium-config-backup", title: "Steam 个性化配置备份", repo: "steam-millennium-config-backup", role: "为重装保留主题、插件清单和关键界面配置的公开安全快照。", kind: "恢复资产", href: projectLedgerHref },
      { id: "vault-tool", title: "本地加密保险库", repo: "vault-tool", role: "在本机把任意文件装进可验证、可备份、可选择性恢复的加密容器。", kind: "加密工具", href: projectLedgerHref }
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
      { id: "health-longevity", title: "健康协作早期方案", repo: "HealthLongevity", role: "保留早期健康工程结构与交付模板，现行健康协作由独立入口承接。", kind: "历史参考", href: projectLedgerHref },
      { id: "human-alignment-dataset", title: "加密时间胶囊", role: "保留一份不可读的加密时间胶囊，不参与日常 AI 工作，也不从文件名推断内容。", kind: "历史参考", href: projectLedgerHref },
      { id: "personal-knowledge-base", title: "中央知识库迁移参考", repo: "PersonalKnowledgeBase", role: "保留早期集中式方案的教训和迁移结论，提醒当前系统直接走健康、材料、微信、语音和扫描等独立入口。", kind: "迁移参考", href: projectLedgerHref },
      { id: "personal-os-retired", title: "个人系统历史设计参考", repo: "PersonalOS-Retired", role: "保留曾经的系统设计、问题教训和未来重新评估条件，不作为当前运行入口。", kind: "历史参考", href: projectLedgerHref },
      { id: "wechat-direct-private-archive", title: "微信读取工具早期版本", role: "保留公开前版本与迁移依据，现行能力由微信工作材料入口承接。", kind: "迁移参考", href: projectLedgerHref }
    ]
  }
];

const privateProjectSourceDigests = {
  "ai-workbench-playbook": "5053832ab68270f00be22325b7889199ad7454be812e03880e92dd68cdb4c5fe",
  "message-ai-gateway": "8e5de0096247f1175b59a57e0f94487a86fc356703625ec693310ea485aeb164",
  "local-ai-runtime": "eb3fb89fcfec4f2343a7fb5edbbf2e3d17dc68cc2422d9a712391b763356f01b",
  "career-development": "e850873a91e7fa504e6b07c82e39c3d790767fbdcfbcbe127d7bb8ec4167feb3",
  "formal-materials": "d7ee4166428ce9693707b475e930a74b059b81610a1084eec495864ef258578d",
  "ai-memory-backup-a": "c040c5a65fdb91143944def084d1a1d1dd16973552fecf60ad94b70e2e11de91",
  "ai-memory-backup-b": "c52d549dad47c53914941e3df71dbcc76c687c895a13a1faab73c90760c4f549",
  "ai-memory-backup-c": "2f2561db3b4df99fbf11e8e54f5159369d32b3845ead50544e29dad9bba1d502",
  "openclaw-backup": "ee7ee37eb61d9452cd1c4dc1f2bbf6dc9e392bc8b1961cb3b841defc7a909ec3",
  "human-alignment-dataset": "2ad69c4a23750c55f10d0063f8e6ff2986ebac140ecbf04824db7328cb6acab6",
  "wechat-direct-private-archive": "f914c90f659820612b0ce431fecdf4050589e1bc94230f268d519fc96e239fcb"
};

export const systemProjectSourceMap = systemProjectDomains.flatMap((domain) => domain.assets.map((asset) => ({
  assetId: asset.id,
  domainId: domain.id,
  sourceIdentity: asset.repo ? `repo:${asset.repo}` : `sha256:${privateProjectSourceDigests[asset.id]}`,
  evidence: "GitHub 总索引与项目当前 README / AGENTS",
  observedAt: systemProjectInventory.observedAt
})));

export const systemDependencyNodes = [
  {
    id: "general-ai",
    lane: "capability",
    title: "通用 AI 与智能体能力",
    subtitle: "理解、推理、搜索、视觉与文档、工具和代码、浏览器、并行协作",
    href: "#general-ai",
    detail: "它提供智能生产力，但不知道个人项目、资料、电脑和授权的长期事实。个人系统负责连接、约束和验证，不把这些基础能力冒充自研。"
  },
  {
    id: "agents",
    lane: "governance",
    title: "AI 协作规则与能力中心（.agents）",
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
    id: "collaboration-hooks",
    lane: "governance",
    title: "协作运行钩子（Hooks）",
    subtitle: "在任务进入和创建协作者前，把真实宿主身份与活动规则带进运行现场",
    href: "/skills/native-economy-routing",
    searchAliases: ["Hook 创建子代理前核对身份", "宿主钩子怎样让规则生效"],
    detail: "对话开始或子代理启动时先注入已经核验的身份与当前规则；真正创建协作者前再复核一次。Hook 只验证身份、规则和参数，不替 AI 决定开多少协作者，也不扩大授权。"
  },
  {
    id: "skills",
    lane: "governance",
    title: "自然语言能力入口（Skills）",
    subtitle: "当前公开选择的领域能力入口",
    href: "/skills",
    detail: "Skills 把普通请求约束成有触发、流程、依赖、失败和边界的领域入口。公开目录只是当前选择，不等于全部现役和按需能力。"
  },
  {
    id: "pcconfig",
    lane: "machine",
    title: "PCConfig",
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
    detail: "先区分同机重装、换机、系统盘故障或仅 PE，再按不破坏原盘的顺序恢复；BIOS 记录、启动介质、备份、任务 Ready 和文件复制都只是中间证据，最终还要自然启动并确认应用真正看见数据。"
  },
  {
    id: "protected-data",
    lane: "machine",
    title: "受保护数据与加密库（Vault）",
    subtitle: "加密对象、版本换挡、最后可用版本和只读恢复",
    href: "/projects/pcconfig/protected-data",
    detail: "允许受保护数据产品旁路升级和失败回退，但源码或合成验收样本通过不等于正式安装、真实因子和故障恢复已经验收。"
  },
  {
    id: "google-workspace",
    lane: "external",
    title: "邮件、云盘与日历",
    subtitle: "固定账号的收件箱、Drive 文件和日历事件可以按需进入任务",
    href: "/skills/google-workspace-direct",
    detail: "可以直接用普通要求查收件箱、云端硬盘或日历；默认只读，明确授权后只执行入口已支持的精确写入，不静默换账号、浏览器或第二条服务路线。"
  },
  {
    id: "scheduled-events",
    lane: "external",
    title: "定时与事件触发",
    subtitle: "按时间，或由支持的 Gmail、Slack、GitHub 事件启动任务",
    href: "https://learn.chatgpt.com/docs/automations",
    detail: "定时任务可在后台运行；符合条件的 Web / Mobile 账号还能监听新邮件、指定频道消息或 PR 活动。账号、计划和工作区设置决定实际可用性。"
  },
  {
    id: "notifications",
    lane: "external",
    title: "主动通知与待处理提醒",
    subtitle: "工作需要注意时，通过当前账号可用的桌面、Activity、push、email 或 SMS 渠道提醒",
    href: "https://learn.chatgpt.com/docs/notifications",
    detail: "通知类别和渠道由当前表面、账号与设置决定；email 是可能的可配置渠道，不写成每个任务都保证发送邮件。"
  },
  {
    id: "timeaudit",
    lane: "machine",
    title: "TimeAudit",
    subtitle: "工作站时间、性能和故障历史",
    href: "/projects/timeaudit",
    detail: "提供有界历史与覆盖质量，不诊断因果。通用 AI 必须结合当前现场、事件和配置事实形成与反驳诊断假设。"
  },
  {
    id: "timeaudit-skill",
    lane: "machine",
    title: "电脑历史诊断入口（timeaudit-diagnostics）",
    subtitle: "把普通故障描述变成有界时间窗、覆盖质量与诊断证据",
    href: "/skills/timeaudit-diagnostics",
    detail: "它读取 TimeAudit 的最短必要摘要并保留因果限制；没有历史数据只说明证据缺失，不等于电脑当时健康。"
  },
  {
    id: "panel-hub",
    lane: "machine",
    title: "PC Panel Hub",
    subtitle: "实体副屏上的持续状态、任务和有限事件",
    href: "/projects/pc-panel-hub",
    detail: "指标代理、可信度、渲染、传输、事件调度、告警恢复和看门狗是个人维护的产品主体；主机心跳不能替代实体像素验收。"
  },
  {
    id: "github-index",
    lane: "projects",
    title: "GitHub 总索引",
    subtitle: "全部项目身份、公开性、远端、工作树、同步和发布",
    href: "/projects/github-index",
    detail: "拥有完整项目资产事实，而不是项目目录中的精选入口。能传输、内容适合公开和用户授权发布是三个不同判断。"
  },
  {
    id: "project-entry-gate",
    lane: "projects",
    title: "项目身份入口（project-entry-gate）",
    subtitle: "确认仓库、公开性、分支、远端、工作树与同步状态",
    href: "/skills/project-entry-gate",
    detail: "只有这些 Git 事实会改变当前决定时才进入；它提供继续、先处理或停止的证据，不产生发布授权。"
  },
  {
    id: "all-projects",
    lane: "projects",
    title: "全部 GitHub 项目资产",
    subtitle: "本次总账覆盖全部仓库身份与系统角色",
    href: "/projects/github-index",
    detail: "每个项目都进入上方能力版图；项目目录只提供可深入阅读的完整参考，不为尚无独立页面的资产生成空白占位卡。"
  },
  {
    id: "codex-remote",
    lane: "projects",
    title: "Codex Remote",
    subtitle: "个人维护的跨设备任务连续性产品",
    href: "/projects/codex-remote",
    detail: "实现移动 Web、本机中介、共享任务协调、认证、重连、队列、文件操作和 Windows 生命周期；手机继续同一项任务，而不是复制聊天。"
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
    lane: "projects",
    title: "AI 辅助学习",
    subtitle: "权威研究、人话材料、反馈修订和最小验证",
    href: "/projects/learning",
    detail: "AI 承担研究、解释和修正，人决定方向、深度和停止。没有监督、打卡、进度百分比或自动续课。"
  },
  {
    id: "materials",
    lane: "personal",
    title: "材料库",
    subtitle: "位置未知时返回少量核对过的非媒体原件",
    href: "/skills/personal-materials",
    detail: "不全盘扫描、不复制原件，也不另建一套中心数据库；路径已知时直接使用真实原件。"
  },
  {
    id: "media",
    lane: "personal",
    title: "个人媒体原件定位",
    subtitle: "按自然线索找到照片、视频、录音或临时浏览目录",
    href: "/skills/personal-media",
    detail: "只负责找到、打开或建立不复制原件字节的临时浏览目录；不移动、分类、删除或上传媒体，也不把未来整理与恢复能力冒充成本入口已经做到。"
  },
  {
    id: "wechat",
    lane: "personal",
    title: "微信上下文与单会话归档",
    subtitle: "具名聊天、回复关系、媒体绑定和可重放增量",
    href: "/skills/wechat-direct",
    detail: "既能回答一个明确联系人或群的当前问题，也能为该具名会话建立首次归档、完整性清单和可重放增量；语音和附件继续绑定原消息并交给对应项目，不后台同步整个账号。"
  },
  {
    id: "localocr",
    lane: "personal",
    title: "LocalOCR",
    subtitle: "扫描 PDF、表格、公式、印章和版面",
    href: "/skills/localocr",
    detail: "保留页码、坐标和未确认项。普通清晰图片不机械 OCR，原件始终高于识别结果。"
  },
  {
    id: "documents-skill",
    lane: "personal",
    title: "可编辑文档能力（documents）",
    subtitle: "创建、修订、批注 Word 文书并逐页检查真实版面",
    href: "/skills/documents",
    detail: "保留 DOCX 的样式、表格、页眉页脚、修订和批注；结构正确不能替代最后一轮逐页渲染验收。"
  },
  {
    id: "pdf-skill",
    lane: "personal",
    title: "PDF 读写与表单能力（pdf）",
    subtitle: "同时核对内容结构、字段值、页面控件、显示外观和逐页版面",
    href: "/skills/pdf",
    detail: "页面看见值不等于表单字段已经正确写入；默认保留交互性，只有明确要求才压平。"
  },
  {
    id: "document-materials-skill",
    lane: "personal",
    title: "文书和材料制作",
    subtitle: "从真实原件和当前材料状态进入合同、说明、申请、事件材料或提交包",
    href: "/skills/document-materials",
    detail: "先核对原件、事实、解释、待确认项和未知，再生成可编辑文书、PDF 或材料包；材料生成、本人操作、平台收到和接收方处理始终分开。"
  },
  {
    id: "document-output-choice",
    lane: "personal",
    title: "按成品形态选择文档或 PDF 能力",
    subtitle: "可编辑 Word、交互 PDF、静态 PDF 可以单独使用，也可以组合",
    href: "#system-skill-family-make-documents",
    detail: "扫描识别只在原件需要时进入；Word 与 PDF 不是固定先后关系，系统按最终成品、修订、表单和逐页验收要求选择。"
  },
  {
    id: "chinese-asr",
    lane: "personal",
    title: "ChineseASR",
    subtitle: "带时间位置、风险审计和断点续跑的中文转写包",
    href: "/projects/chinese-asr",
    detail: "处理长音频、多路线分歧、可疑句和局部失败；姓名、数字、承诺和争议语句仍以原音频为准。"
  },
  {
    id: "chinese-asr-skill",
    lane: "personal",
    title: "中文录音任务入口（chinese-asr）",
    subtitle: "把自然请求送进正确转写、时间位置、说话人或复核模式",
    href: "/skills/chinese-asr",
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
    detail: "它把普通健康问题送到当前证据、权威研究和领域项目；最终采用、停止与高风险选择仍由本人决定。"
  },
  {
    id: "verification",
    lane: "evidence",
    title: "如何确认工作真的完成",
    subtitle: "原件、测试、安装、发布、新任务、真实端到端验证和用户验收",
    href: "#evidence",
    detail: "AI 的解释、实现和动作先是候选；结果闭合到哪一层，就只声明哪一层。"
  },
  {
    id: "human-review",
    lane: "evidence",
    title: "人的最终判断",
    subtitle: "验收、纠正、改变方向、继续或停止",
    href: "#evidence-human",
    detail: "系统把结果和依据交回来；人保留目标、价值取舍和高风险选择，不因没有反馈而被自动推进。"
  }
];

export const systemDependencyLanes = [
  { id: "capability", number: "01", title: "通用能力", description: "提供理解、研究和执行能力，不冒充个人开发成果。" },
  { id: "governance", number: "02", title: "治理与入口", description: "个人规则和 Skills 决定能力怎样进入真实任务。" },
  { id: "external", number: "03", title: "外部服务与事件", description: "邮件、云盘、日历、定时与事件触发把云端现场主动带进任务。" },
  { id: "machine", number: "04", title: "电脑、服务与恢复", description: "机器、服务、秘密、历史和实体运行事实。" },
  { id: "projects", number: "05", title: "项目与连续性", description: "全部项目资产、长期产品、验证与跨设备工作。" },
  { id: "personal", number: "06", title: "资料与个人领域", description: "原件与领域事实保持独立，按当前问题有界进入。" },
  { id: "evidence", number: "07", title: "结果与人类验收", description: "每一层分别证明，最终由人决定继续或停止。" }
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
      "注意力先保留目标、现有工作、关键未知和真实验收"
    ],
    delivery: [
      "进入正确项目后的最小必要改动",
      "没有覆盖别人工作的实现与真实使用结果",
      "仍未确认的部分、恢复入口和是否需要本人决定"
    ],
    willNot: [
      "不会把旧计划、旧报告或记忆当成当前要求",
      "不会用全局习惯覆盖项目自己的业务规则",
      "不会为了省事覆盖已有修改、遗漏禁止项或把未知说成已完成"
    ],
    href: "/rules/?rule=agents_root_rules",
    entryLabel: "查看全局根规则"
  },
  {
    id: "active-and-recoverable",
    ruleId: "protected_major_actions_contract",
    number: "02",
    title: "重大动作先预演，失败留在安全旧状态",
    summary: "真正高影响、难恢复或需要本人在场的动作，先在隔离但等价的环境里完整预演，再绑定精确目标和切换前状态。失败时不破坏原来可用的版本。",
    ordinaryRequest: "“把这套规则升级到新版本；先证明每一步和回退都可用，再切换。任何核对失败都留在当前安全版本。”",
    inputs: [
      "准备执行的精确动作、目标对象和现实影响",
      "切换前可用状态、恢复材料和明确回退条件",
      "预演结果，以及是否确实需要本人在场验证"
    ],
    collaboration: [
      "AI 根据真实影响、可逆性和证据判断继续、暂停还是补预演",
      "受保护入口把执行绑定到精确目标、版本和切换前状态",
      "只有现实重大动作确实需要时，才进入已登记的人类验证入口"
    ],
    delivery: [
      "执行前预览、继续或暂停的明确理由",
      "完成后的真实回读，以及仍然可用的回退版本",
      "失败时保留的安全旧状态和下一次可重试条件"
    ],
    willNot: [
      "不会因为出现某个关键词就机械升级为重大动作",
      "不会把管理员确认当成用户授权或人类验收",
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
    title: "授权可以持续，施工范围必须收窄",
    summary: "用户已经说清楚的目标不会因为换一轮对话或增加协作者而失效；但每个协作者只能处理自己负责的最小范围，不能顺手扩大目标。",
    ordinaryRequest: "“这个网站通过检查后直接发布，别反复问同一件事；但不要覆盖别人正在做的修改。”",
    inputs: [
      "用户已经明确的目标、对象、动作和禁止项",
      "当前有哪些任务或协作者正在修改哪些范围",
      "真实仓库、远端、公开属性和发布目标"
    ],
    collaboration: [
      "多个协作者分别认领不重叠的最小范围",
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
    title: "代码、电脑、规则，各找自己的事实",
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
      "对应 Skill 或项目提供有边界的真实读取、执行与失败语义",
      "只有支路独立、可验且不会互相覆盖时才并行，主任务统一验收"
    ],
    delivery: [
      "已经选中的能力路线和实际完成结果",
      "原件、时间位置、页码、测试或现实回读等可核对依据",
      "失败、降级、未知和仍需本人决定的内容"
    ],
    willNot: [
      "不会要求用户先背内部能力名称",
      "不会因为初始工具列表短就直接宣布做不了",
      "不会机械套用所有 Skills、重复安装同类能力",
      "不会为了显得在并行而开启没有独立价值的协作者"
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
      { slug: "personal-materials", name: "非媒体原件定位", technicalName: "personal-materials", summary: "路径未知或失效时，在获准位置返回少量合同、报告或其他非媒体原件并重新核对。", href: "/skills/personal-materials" },
      { slug: "wechat-direct", name: "具名微信上下文", technicalName: "wechat-direct", summary: "读取一个明确联系人或群的小段上下文、回复关系和相关媒体；明确需要时才做单对象增量归档。", href: "/skills/wechat-direct" },
      { slug: "google-workspace-direct", name: "固定办公账号入口", technicalName: "google-workspace-direct", summary: "通过登记的同一账号读取邮件、云盘和日历；明确写入只使用现有的精确操作。", href: "/skills/google-workspace-direct" }
    ]
  },
  {
    id: "understand-evidence",
    number: "02",
    title: "读懂声音、扫描件和个人证据",
    requests: [
      "“把这段两小时录音转成带时间位置的文字，没听清的不要猜。”",
      "“读这份扫描合同里的金额表格和盖章页；这批混合附件先分清该怎么读。”",
      "“结合我当前健康事实回答这个问题，新报告先别自动覆盖。”"
    ],
    inputs: [
      "一个明确文件、短列表或与当前问题有关的附件子集",
      "原音频、原图、原报告和当前健康事实",
      "需要精确到时间、页码、坐标或本人判断的真实问题"
    ],
    collaboration: "先由附件分流选择保留结构最多的读取方式；录音、扫描件、本人判断和健康事实分别进入自己的能力，最后由通用 AI 组织成可理解的回答。",
    delivery: [
      "带时间位置的转写、匿名说话人范围和不确定性",
      "可回到页码、表格或坐标核对的扫描结果",
      "具名媒体中本人候选的位置或语音时间段",
      "区分个人事实、原始报告、医生意见、AI 分析和未知的健康回答"
    ],
    willNot: [
      "不会把语音或文字识别结果抬高成原件本身",
      "不会因空结果就声称没有声音或没有文字",
      "不会扫描整个媒体库、建立人物库或识别其他人",
      "不会自动诊断、改药或用新报告静默覆盖当前健康事实"
    ],
    members: [
      { slug: "file-intake-router", name: "混合附件分流", technicalName: "file-intake-router", summary: "先看清 Word、表格、PDF、图片、压缩包或文件夹结构，再交给保留信息最多的读取器。", href: "/skills/file-intake-router" },
      { slug: "chinese-asr", name: "中文录音理解", technicalName: "chinese-asr", summary: "把中文录音变成带时间位置的文字，保留任务续跑、匿名说话人和本人语音判断的证据边界。", href: "/skills/chinese-asr" },
      { slug: "localocr", name: "扫描件与版面识别", technicalName: "localocr", summary: "读取扫描 PDF、表格、公式、印章和版面，保留页码、结构、坐标和空结果语义。", href: "/skills/localocr" },
      { slug: "media-person-self", name: "具名媒体中的本人判断", technicalName: "media-person-self", summary: "只判断指定照片或录音中是否支持本人候选，并返回可复核的位置、覆盖范围和未知。", href: "/skills/media-person-self" },
      { slug: "personal-health", name: "个人健康上下文", technicalName: "personal-health", summary: "用当前个人健康事实回答问题；新报告或设备数据先采集、核对和审核，再决定是否更新。", href: "/skills/personal-health" }
    ]
  },
  {
    id: "make-documents",
    number: "03",
    title: "交付文档与私人事务材料",
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
      { slug: "work-delivery", name: "工作交付副驾驶", technicalName: "work-delivery", summary: "把明确选中的需求、会议记录、规则和表格整理成来源可追溯、跨文档口径一致的交付包；来源变化时标记旧结果并说明哪些需要重做。", href: "/skills/work-delivery" },
      { slug: "document-materials", name: "文书和材料制作", technicalName: "document-materials", summary: "核对当前材料状态和真实原件，制作合同、说明、申请、事件材料或提交包，并把生成、本人操作、平台收到和接收方处理分开。", href: "/skills/document-materials" },
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
    id: "enter-and-refresh-projects",
    number: "05",
    title: "安全进入项目，并把结果送到正确位置",
    requests: [
      "“进入网站项目补上全文搜索，保留别人未提交的修改，确认仓库和分支后再发布。”",
      "“这个项目发布后，如果个人看板因此会说错话，就安排一次对应更新。”"
    ],
    inputs: [
      "准确的仓库身份、目标工作树和准备进行的 Git 动作",
      "当前分支、远端、公开性、同步状态和其他未提交工作",
      "来源项目正式发布后的提交、变化路径和它为何会改变看板事实"
    ],
    collaboration: "项目入口先提供真实 Git 现场，但不产生发布授权；来源项目正式发布后，只有看板会实质失真时才安排一次独立更新。",
    delivery: [
      "明确的继续、先处理再继续或停止判断",
      "保留其他修改后的定向提交和真实远端回读",
      "达到实质阈值时的一次看板更新；不需要更新时保持网站不变"
    ],
    willNot: [
      "不会把仓库检查结果当成用户授权",
      "不会覆盖混合工作树中的其他修改",
      "不会因注释、格式、时间戳或仅指纹变化打扰网站",
      "不会为同一个项目和同一提交重复安排更新"
    ],
    members: [
      { slug: "project-entry-gate", name: "Git 项目身份入口", technicalName: "project-entry-gate", summary: "在身份、公开性、分支、远端或同步状态会改变决定时，取得当前仓库真实现场。", href: "/skills/project-entry-gate" },
      { slug: "personal-panel-refresh", name: "个人看板实质更新判断", technicalName: "personal-panel-refresh", summary: "来源项目发布后，只有现有页面会因此变得实质错误时，才安排一次独立网站更新。", href: "/skills/personal-panel-refresh" }
    ]
  },
  {
    id: "use-and-protect-secrets",
    number: "06",
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
    number: "07",
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
  }
];

export const systemEvidenceLayers = [
  { id: "source", title: "原件与来源", proves: "输入、事实和引用能回到真实来源。", doesNotProve: "不证明处理过程和最终结论正确。", searchAliases: ["原始来源能证明什么"] },
  { id: "test", title: "项目测试", proves: "行为在明确的测试条件下符合预期。", doesNotProve: "不证明已经安装、接入、真实运行或网页已经发布。", searchAliases: ["源码或构建通过能不能证明网页发布", "测试通过不等于发布"] },
  { id: "install", title: "安装与接入", proves: "目标环境已经接入这项能力。", doesNotProve: "不证明新的自然任务会自动找到它。" },
  { id: "fresh", title: "新任务发现", proves: "新的普通请求能够找到并正确选择入口。", doesNotProve: "不证明真实对象已经产出预期结果。" },
  { id: "runtime", title: "现实运行", proves: "真实对象、工具或服务产生了预期输出。", doesNotProve: "不证明完整用户路径已经闭合。" },
  { id: "e2e", title: "真实端到端", proves: "从自然请求到最终结果的整条现实路径能够完成。", doesNotProve: "不自动覆盖其他环境、账号或任务类型。" },
  { id: "publish", title: "按需发布与回读", proves: "需要发布时，结果已进入正确目标并重新读取。", doesNotProve: "本地任务不必经过此层，也不等于用户已经满意。", searchAliases: ["网页发布与公网回读", "发布后怎样确认真的更新"] },
  { id: "human", title: "用户验收", proves: "本次结果和体验真正满足当前目标。", doesNotProve: "不代表它对所有人、所有场景都成立。" }
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
