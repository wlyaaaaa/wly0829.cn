export const systemHomeHero = {
  eyebrow: "个人 AI 协作系统",
  title: "AI 如何协助我完成工作",
  paragraphs: [
    "通用 AI 与智能体能力负责理解自然语言、推理、研究、阅读图片与文档、使用工具、编写和运行代码、操作浏览器，以及组织并行协作。这些是系统使用的外部生产力，不是个人项目开发出来的基础智能。",
    "我建设的个人系统把这些能力接到全部项目、现行规则、Skills、资料与媒体入口、电脑现场和外部服务。它让 AI 不必每次重新猜文件在哪里、项目怎样运行、哪些动作不能越界，也不用把每个工具临时拼起来。",
    "最后交回的不只是回答，而是已经完成的工作、可以核对的依据、没有确认的部分，以及中断、换机或失败后能够继续和恢复的位置。"
  ],
  roles: [
    {
      id: "general-ai",
      title: "通用 AI 与智能体能力",
      body: "理解、推理、搜索、视觉与文档理解、工具和代码执行、浏览器操作与并行协作。"
    },
    {
      id: "personal-system",
      title: "个人系统提供真实现场",
      body: "资料、媒体、电脑、全部项目、规则、Skills、长期状态、执行入口和恢复方法。"
    },
    {
      id: "usable-result",
      title: "结果可以继续使用",
      body: "成品、来源、证据、未确认项、保存位置、恢复点和是否还需要人决定。"
    }
  ]
};

export const systemScenarios = [
  {
    id: "project-work",
    label: "AI 开发项目",
    title: "从一句产品目标，到真正能用的项目改动",
    request: "“先复现这个问题，修复并根治；能并行的并行，不要覆盖现有修改，最后让我真实用一次。”",
    systems: ["通用 AI 与智能体能力", ".agents", "项目规则", "GitHub 总索引", "目标项目", "必要的 Skills 与工具"],
    rules: "先确认真实项目和现有修改；项目拥有业务做法；并行不能覆盖别人；源码、测试、安装、发布和用户可用分别验证。",
    result: "根因、实现改动、相关测试、真实使用结果、仍未闭合的部分、提交或恢复位置。",
    value: "不是生成一段代码，也不是看到测试通过就停；系统把研究、实现、复核、现实使用和必要的交付收在同一目标里。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "github-index", "all-projects", "verification", "human-review"],
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
        body: "通用 AI 负责理解、推理、搜索、代码和工具操作；.agents 组织规则、授权、上下文和并行协作；目标项目决定具体实现与测试方式。",
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
    id: "wechat-work-record",
    label: "微信工作材料",
    title: "聊天、语音、图片和附件，整理成可以继续办事的材料",
    request: "“把昨晚这段微信聊天、对方发的语音和附件整理成纪要。人名、数字和待办不要猜，没听清的单独列出来。”",
    systems: ["通用 AI 与智能体能力", "WeChatDirect", "材料库", "媒体库", "ChineseASR", "LocalOCR"],
    rules: "只读取明确会话和时间范围；消息关系与本地原件必须能够对应；原音频和扫描件高于识别结果；第三人私人内容不进入公开页面。",
    result: "可编辑纪要、决定与待办、消息与附件引用、录音时间位置、人名和数字复核表、来源缺口与矛盾项。",
    value: "它保留聊天顺序、回复关系和原件位置，不把一堆材料压成无法追溯来源的 AI 摘要。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "materials", "media", "wechat", "localocr", "chinese-asr", "verification", "human-review"],
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
    id: "pc-diagnosis",
    label: "电脑故障排查",
    title: "电脑现在正常，也能追查昨晚为什么卡",
    request: "“昨晚十点半电脑突然卡了两三次，现在又正常了。帮我判断最可能是什么原因，不要只看当前任务管理器，也不要重启。”",
    systems: ["通用 AI 与智能体能力", "TimeAudit", "timeaudit-diagnostics", "PCConfig", "Windows 现场工具"],
    rules: "先确认事故时间和数据覆盖；历史相关性、当前现场和原因判断分开；不允许用重启代替诊断；处理前后必须可比较、可回退。",
    result: "事故窗口、覆盖质量、多个竞争假设、支持与反对证据、已排除项、安全处理、下次复发应保留的现场。",
    value: "通用 AI 负责形成和比较诊断假设，本地项目提供过去与现在的证据；两者共同工作，避免单看峰值或只给通用建议。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "pcconfig", "timeaudit", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "事故与证据质量",
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
        kicker: "事故诊断单",
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
    label: "重装与完整恢复",
    title: "重装或换机后，把工作环境一层一层真正接回来",
    request: "“把原来的开发环境、任务、项目和私密配置恢复到可用状态。秘密不要出现在回执里，必须告诉我哪些还要登录或等自然重启验证。”",
    systems: ["通用 AI 与智能体能力", "PCConfig", "GitHub 总索引", "Password Center", "受保护数据与 Vault", "项目恢复入口"],
    rules: "先验证备份和恢复载体；恢复顺序服从真实依赖；原件和回滚保留；凭据优先盲用；复制、安装、启动、登录和用户可用分别验收。",
    result: "已恢复环境、项目、任务与数据，秘密可用状态，待登录、待自然重启和不可恢复项，备份后的数据缺口，以及完整回滚路径。",
    value: "它不是“一键装软件”，而是一份能回答工作系统是否真正恢复的依赖计划和分层验收。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "pcconfig", "password-center", "github-index", "all-projects", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "资产与恢复前提",
        title: "先确认能够恢复什么",
        body: "核对网络、磁盘、备份时间、文件哈希、全部仓库身份、加密载体和有效恢复因子。软件可以重建，未备份的聊天、密码和个人文件不能凭空恢复。",
        items: [
          ["环境", "系统首登、网络、磁盘与恢复介质"],
          ["数据", "文档、下载、微信、存档、应用配置和数据库"],
          ["秘密", "Password Center、Vault、加密数据和恢复条件"]
        ]
      },
      {
        number: "02",
        kicker: "按依赖重建",
        title: "从底座到项目，再到计划任务",
        body: "恢复控制面和兼容运行时，按真实安装位置重建 PATH 与非秘密配置；恢复项目、容器、数据库、仪表盘和外部探针后，再分类重建计划任务、自启动与登录前恢复。",
        items: [
          ["底座", "运行时、虚拟化、容器、端口与开发存储"],
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
    systems: ["通用 AI 与智能体能力", "个人健康证据与安全决策", "personal-health", "材料与扫描入口", "受保护数据入口", "权威资料研究"],
    rules: "急症和红旗优先；报告事实、医生意见、本人陈述、外部资料和 AI 分析分开；新数据先保全和验证，不能自动改写当前健康底色；最终选择属于本人。",
    result: "健康时间线、变化与趋势、证据质量、方案收益与风险、停止或复查条件、待问医生的问题、仍缺资料和最低成本下一步。",
    value: "它不把健康协作缩成一次“第二意见”，而是让低频、分散、质量不同的个人证据在需要时进入同一项决策。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "materials", "localocr", "personal-health", "verification", "human-review"],
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
        body: "受保护入口取得数据后保存原始页、清单与哈希；离线验证来源、分页、时间覆盖和数据质量；通用 AI 再结合当前权威资料解释变化、风险和真实选项。",
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
    label: "跨设备继续工作",
    title: "人离开电脑，复杂的 AI 工作不必断线",
    request: "“我已经出门了，用手机看看电脑上的任务做到哪；如果它需要决定，我在手机上回答，完成后把结果文件和真实交付状态给我。”",
    systems: ["通用 AI 与智能体能力", "Codex Remote", "当前项目", "安全接入", "GitHub 总索引"],
    rules: "必须连接同一个桌面任务、轮次和文件状态；手机不是第二个执行者；审批仍由本人决定；断线和派发不明不自动重放。",
    result: "同一个任务的进展、工具活动、文件变化、审批、当前轮结果、下一轮队列和最终项目交付回读。",
    value: "移动 Web、本机中介、共享任务协调、认证、重连、队列和文件操作是个人维护的连续性产品；它不是外部工作环境自带的远程功能。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "github-index", "all-projects", "codex-remote", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "同一任务身份",
        title: "先确认手机接的是电脑上那一项工作",
        body: "显式打开入口并登录，手机读取桌面端已加载任务与历史；进入任务后核对同一任务、轮次、目录和项目，不复制第二份聊天。",
        items: [
          ["任务", "同一持久任务和当前轮次"],
          ["项目", "原工作区、文件和真实项目身份"],
          ["会话", "认证、订阅屏障和唯一任务拥有者"]
        ]
      },
      {
        number: "02",
        kicker: "移动控制与重连",
        title: "看进展、补要求、审批和处理文件",
        body: "手机持续接收公开进展、工具活动、文件变化、结构化提问和审批。可以引导当前回复、停止、排队下一轮或打开明确文件；断线后用事件游标恢复。",
        items: [
          ["当前轮", "进展、命令、文件和待处理问题"],
          ["人类决定", "审批、停止、补充要求和下一轮"],
          ["断线恢复", "保留草稿与队列，从持久状态重新收敛"]
        ]
      },
      {
        number: "03",
        kicker: "回到项目结果",
        title: "手机只是连续性入口，不替项目证明完成",
        body: "最终文件、测试、提交和发布仍属于原任务和原项目；派发结果不明时停止自动重试，避免重复消息或产生第二个工作拥有者。",
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
    label: "AI 协助学习",
    title: "资料研究、讲解、反馈和验证，围绕一个真实问题反复修正",
    request: "“把这个陌生概念讲到我能用自己的话解释，并能迁移到另一个场景；我不理解或不同意的地方再一起改。”",
    systems: ["通用 AI 与智能体能力", "用 AI 把一件事学明白", "权威资料入口", "必要的最小验证"],
    rules: "人决定问题、节奏和停止；来源变化先查当前资料；没有反馈不猜已经掌握；问题只帮助理解，不评分；文字不能证明时才做最小验证。",
    result: "一份可集中阅读的人话材料、可靠来源、用户反馈后的修订、可选问题、仍未知处和下一步最值得理解的内容。",
    value: "AI 承担研究、解释和修正，人保留方向和最终判断；没有课程后台、打卡、进度百分比或自动续课。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "learning-project", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "权威研究与能力依赖",
        title: "先判断真正需要理解什么",
        body: "读取唯一当前节点，判断概念、事实、例子还是选择缺口，查当前一手资料并确定这次需要学到的深度，不冻结完整课程表。",
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
    label: "AI 能力验证",
    title: "复杂任务到底有没有做成，交给可复查证据回答",
    request: "“这个新的 AI 运行组合适不适合做复杂项目？别只看宣传或自报完成，告诉我它实际完成了什么、哪里失败、证据够不够。”",
    systems: ["通用 AI 与智能体能力", "CACB Agent 能力基准", "隔离工作区", "独立验证器", "证据归档"],
    rules: "任务、输入、执行规则和验证版本冻结；每个样本使用独立工作区；模型自述不算完成；中断优先恢复同一会话，不能恢复就整轮重跑；现有评分问题不得包装成可靠排名。",
    result: "任务族能力、完成证据、失败平面、环境问题、证据时效、成本与仍不能下的结论；不生成混合营销分。",
    value: "CACB 不是一句缩写或排行榜，而是一套让真实工程任务、候选产物、确定性重放和终态归档属于同一次执行的验证产品。",
    dependencyIds: ["general-ai", "agents", "rules", "skills", "all-projects", "cacb", "verification", "human-review"],
    stages: [
      {
        number: "01",
        kicker: "冻结任务与隔离执行",
        title: "每次尝试从同一任务、独立工作区开始",
        body: "冻结问题、输入、顺序、执行规则和验证版本；每个样本只在自己的临时工作区施工，拒绝跨工作区写入和混合两次执行。",
        items: [
          ["任务族", "跨文件实现、故障修复、持久状态和研究"],
          ["身份", "任务、工作区、运行组合和验证版本绑定"],
          ["隔离", "候选产物不能污染别的样本或源仓库"]
        ]
      },
      {
        number: "02",
        kicker: "候选产物与独立验证",
        title: "完成声明不能替代真实文件和行为",
        body: "通用 AI 完成连续复杂任务；根侧证据与参与者之外的验证器重放候选产物。基础设施失败、能力失败、任务设计问题和缺证据分别归类。",
        items: [
          ["候选", "代码、状态、轨迹、工具回执和失败"],
          ["重放", "确定性检查真实文件、行为和修改范围"],
          ["分类", "能力、环境、数据和验证问题不混为一个分数"]
        ]
      },
      {
        number: "03",
        kicker: "终态归档与有限结论",
        title: "先收回证据，再决定能说什么",
        body: "成功、失败、中断和阻塞都归档产物并回读哈希；缺题或恢复不精确时整轮重跑；输出能力、限制、时效和成本，不把当前有问题的评分写成公开排名。",
        items: [
          ["归档", "产物、回执、轨迹、哈希和工作区终态"],
          ["报告", "白名单字段、任务族结果和失败层"],
          ["边界", "哪些主张成立，哪些现在仍不能下"]
        ]
      }
    ]
  }
];

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
    title: ".agents",
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
    id: "skills",
    lane: "governance",
    title: "Skills",
    subtitle: "当前公开选择的自然语言能力入口",
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
    title: "Password Center",
    subtitle: "凭据元数据、盲填与盲注入、受控显示和恢复",
    href: "/projects/pcconfig/secrets-providers",
    detail: "让程序完成登录与调用，又不必把密码或令牌交给普通聊天、命令行和文件。机器安装、备份和恢复事实仍由 PCConfig 提供。"
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
    detail: "拥有完整项目资产事实，而不是首页十个精选项目。能传输、内容适合公开和用户授权发布是三个不同判断。"
  },
  {
    id: "all-projects",
    lane: "projects",
    title: "全部 GitHub 项目",
    subtitle: "当前现场安全聚合；精选项目另有完整介绍",
    href: "/projects/github-index",
    detail: "新仓库天然进入项目资产总账，但未形成公开语义和证据前不生成占位卡。项目目录只展示 owner 已选择并完整建设的代表产品。"
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
    title: "真实任务能力基准",
    subtitle: "隔离执行、确定性验证、终态归档和有限结论",
    href: "/projects/cacb",
    detail: "检查复杂任务实际完成了什么、哪里失败和证据是否足够；不是排行榜，也不会把当前有问题的评分包装成可靠结论。"
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
    detail: "不全盘扫描、不复制原件，也不恢复中央知识库；路径已知时直接使用真实原件。"
  },
  {
    id: "media",
    lane: "personal",
    title: "媒体库",
    subtitle: "按自然线索查找照片、视频和录音原件",
    href: "/skills/personal-media",
    detail: "可以打开原件或建立临时浏览目录，不修改、上传或按人物扫描整个媒体库。"
  },
  {
    id: "wechat",
    lane: "personal",
    title: "WeChatDirect",
    subtitle: "具名聊天、回复关系和相关媒体",
    href: "/skills/wechat-direct",
    detail: "只处理一个明确联系人或群的有界上下文，不后台同步整个账号；语音和附件再交给对应项目。"
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
    id: "chinese-asr",
    lane: "personal",
    title: "ChineseASR",
    subtitle: "带时间位置、风险审计和断点续跑的中文转写包",
    href: "/projects/chinese-asr",
    detail: "处理长音频、多路线分歧、可疑句和局部失败；姓名、数字、承诺和争议语句仍以原音频为准。"
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
    id: "verification",
    lane: "evidence",
    title: "如何确认工作真的完成",
    subtitle: "原件、测试、安装、发布、新任务、真实端到端验证和用户验收",
    href: "#evidence",
    detail: "每一层只证明自己的事。AI 的解释、实现和动作先是候选，闭合到哪一层就只声明哪一层。"
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
  { id: "machine", number: "03", title: "电脑与恢复", description: "机器、秘密、历史和实体运行事实。" },
  { id: "projects", number: "04", title: "项目与连续性", description: "全部项目资产、长期产品、验证与跨设备工作。" },
  { id: "personal", number: "05", title: "资料与个人领域", description: "原件与领域事实保持独立，按当前问题有界进入。" },
  { id: "evidence", number: "06", title: "结果与人类验收", description: "每一层分别证明，最终由人决定继续或停止。" }
];

export const systemDependencyRelations = [
  { id: "ai-rules", from: "general-ai", to: "rules", type: "constrained-by", label: "能力按个人规则使用", detail: "规则约束事实来源、授权、停止条件、并行、现实动作和完成口径；不提供智能本身。" },
  { id: "agents-rules", from: "agents", to: "rules", type: "owns", label: "活动规则与协作方式", detail: ".agents 发布并验证同一活动规则闭包，并在任务中应用授权、Owner 与协作边界。" },
  { id: "ai-skills", from: "general-ai", to: "skills", type: "uses", label: "理解并使用领域入口", detail: "通用 AI 读取 Skill 的触发、流程、依赖和边界，再判断是否调用。" },
  { id: "skills-context", from: "skills", to: "materials", type: "invokes", label: "按需找到非媒体原件", detail: "只有位置未知或旧定位失效时才进入材料库。" },
  { id: "skills-media", from: "skills", to: "media", type: "invokes", label: "按自然线索找到媒体", detail: "返回少量真实照片、视频或录音，不修改或全库扫描。" },
  { id: "skills-wechat", from: "skills", to: "wechat", type: "invokes", label: "读取具名微信上下文", detail: "限定一个联系人或群以及必要时间范围。" },
  { id: "skills-machine", from: "skills", to: "pcconfig", type: "invokes", label: "取得机器与恢复事实", detail: "机器问题、秘密使用或恢复任务才进入 PCConfig。" },
  { id: "pcconfig-password", from: "pcconfig", to: "password-center", type: "provides", label: "安装、盲用与恢复事实", detail: "Password Center 自己拥有凭据产品语义，PCConfig 提供机器与恢复关系。" },
  { id: "pcconfig-timeaudit", from: "pcconfig", to: "timeaudit", type: "provides", label: "机器和运行现场", detail: "TimeAudit 拥有历史数据，PCConfig 提供当前机器与恢复事实。" },
  { id: "timeaudit-panel", from: "timeaudit", to: "panel-hub", type: "conditional", label: "条件：需要历史帧率或诊断状态", detail: "PC Panel Hub 可读取有界帧率与状态，但不复制 TimeAudit 长期数据库。" },
  { id: "github-projects", from: "github-index", to: "all-projects", type: "provides", label: "仓库身份、工作树与发布事实", detail: "GitHub 总索引定义全部项目资产现场；项目目录只是精选解释。" },
  { id: "projects-remote", from: "all-projects", to: "codex-remote", type: "conditional", label: "条件：跨设备继续同一任务", detail: "Codex Remote 读取同一桌面任务和项目上下文，不成为第二个执行者。" },
  { id: "projects-cacb", from: "all-projects", to: "cacb", type: "conditional", label: "条件：明确验证复杂任务能力", detail: "CACB 只在评测场景冻结任务和候选产物，不是全部项目的总闸门。" },
  { id: "media-asr", from: "media", to: "chinese-asr", type: "provides", label: "具名录音原件", detail: "转写结果始终绑定原音频、时间位置和审计状态。" },
  { id: "wechat-asr", from: "wechat", to: "chinese-asr", type: "conditional", label: "条件：会话包含需要处理的语音", detail: "只处理与明确消息关系绑定的语音媒体。" },
  { id: "materials-ocr", from: "materials", to: "localocr", type: "conditional", label: "条件：原件是扫描件或复杂版面", detail: "路径已知或原生文档可读时不强制经过材料库或 OCR。" },
  { id: "ocr-health", from: "localocr", to: "personal-health", type: "conditional", label: "条件：扫描健康原件会改变判断", detail: "识别内容先保留来源和质量，不自动写入当前健康事实。" },
  { id: "projects-verification", from: "all-projects", to: "verification", type: "evidence", label: "项目测试、运行、发布与回读", detail: "项目和现实工具提供各自能证明的证据，不能互相升级。" },
  { id: "context-verification", from: "materials", to: "verification", type: "evidence", label: "原件、来源和未确认项", detail: "真实原件和领域来源提供可追溯依据。" },
  { id: "verification-human", from: "verification", to: "human-review", type: "delivers", label: "成品、证据、未知和下一步", detail: "页面说明已经做成什么、还缺什么以及人是否需要行动。" }
];

export const systemEvidenceLayers = [
  { id: "source", title: "原件与来源", meaning: "输入、事实和引用可回到真实来源。" },
  { id: "test", title: "项目测试", meaning: "行为在精确测试条件下通过，不代表已经安装。" },
  { id: "install", title: "安装与接入", meaning: "目标机器已经接入能力，不代表新任务自然可用。" },
  { id: "fresh", title: "新任务发现", meaning: "新的自然任务能够找到并正确使用入口。" },
  { id: "runtime", title: "现实运行", meaning: "真实对象、工具或服务产生了预期结果。" },
  { id: "publish", title: "发布与回读", meaning: "结果进入正确远端或公网，并从目标重新读取。" },
  { id: "human", title: "用户验收", meaning: "自然语言路径和最终体验真正满足目标。" }
];

export const systemDirectoryIntroductions = [
  {
    id: "rules",
    label: "规则",
    title: "让强能力长期可靠地替我工作",
    body: "规则保护事实来源、授权、重大动作、协作和完成口径。它们不是智能来源，也不是让访客背的合同，而是每次工作中真实生效的五个承诺。",
    href: "/rules"
  },
  {
    id: "projects",
    label: "项目",
    title: "保存长期工具、数据、状态和恢复入口",
    body: "全部 GitHub 项目属于个人系统；项目拥有业务语义、代码和证据。当前项目目录只展示已经完整建设并值得公开说明的代表产品。",
    href: "/projects"
  },
  {
    id: "skills",
    label: "Skills",
    title: "把普通需求送到正确能力",
    body: "Skills 把自然语言约束成有触发、流程、依赖、失败和边界的入口。公开目录是当前选择，不等于所有现役和按需能力。",
    href: "/skills"
  }
];
