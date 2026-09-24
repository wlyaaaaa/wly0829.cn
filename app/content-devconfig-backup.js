import { createProjectSnapshot } from "./project-snapshot.js";

const devconfigBackupSnapshot = createProjectSnapshot({
  observedAt: "2026-09-24T05:02:11.1689322Z",
  label: "配置本地/G与微信Hot有较新完成点；H冷盘仍是前一日结果，云端进度另看",
  boundary: "9月24日05:02 UTC零写入状态回读：本地/G配置包同为本轮已验新包，微信Hot已有01:40 UTC完成的VSS时点回执；H冷备9月23日07:44 UTC完成，早于两份新G结果。配置Drive当时仍Running，微信Drive 9月20日最近一次周任务在本地哈希核对失败、未发起该次上传；网页未联网查云、运行备份或恢复。应用一致性和官方客户端恢复另验。",
  metrics: [
    { label: "配置本地/G（9月24日）", value: "2.87 GB · 生产者已验" },
    { label: "微信G热备（9月24日）", value: "145,544 文件 · 45.42 GB" },
    { label: "配置Drive", value: "9月18日已验；本次任务仍运行" },
    { label: "H冷备（9月23日）", value: "已完成 · 早于当前G" }
  ],
  facts: [
    { label: "它真正解决的事", value: "重装或换机时，把 AI 工具配置、GPG 私钥、SSH 会话、环境变量、编辑器设置和重装清单留成可检查的恢复包。9月24日本地/G当前压缩包为2,870,143,084字节；安装本体、插件、node_modules 和常见缓存仍排除，恢复者按新系统与应用版本选择回填。" },
    { label: "分层介质与职责分工", value: "9月24日零写入状态显示本地/G配置包同为 devconfig-20260923-210942-0fc73b3a.zip，2,870,143,084字节，生产者已验，状态入口未重哈希包内容。每代仍带 .sha256、.receipt.json、.manifest.json 和包内 backup-manifest.json，由 current.json 绑定成功代。9月18日已验配置Drive与当时H包哈希一致，是旧成功点；9月23日H冷备虽完成，早于9月24日新本地/G包，不能说四层同代。" },
    { label: "清单数据驱动与避坑边界", value: "备份项由 sources.psd1（PowerShell 数据文件）声明式驱动，不动脚本。它按明确路径取 PowerToys 配置、FinalShell conn\\、PixPin Config、JetBrains 设置和 Docker CLI/Desktop 小配置，排除安装本体、截图历史、插件/JDBC（数据库驱动）、规则数据库、VHDX 虚拟磁盘、镜像层与容器运行态；源码 README 中的体积对比只作早期选型说明。" },
    { label: "系统导出与重装清单自动生成", value: "备份运行时现生成注册表环境变量（用户+机器）、机器 PATH（系统路径）、20+ 自定义计划任务 XML、hosts、Wi-Fi 配置文件（含密码）与 Xshell 注册表；同时导出 scoop、winget、VS Code / Cursor / JetBrains 插件列表，让可重下内容一条命令补回。" },
    { label: "微信原应用数据独立增量流水线", value: "现存Hot成功回执于2026-09-24T01:40:05.6637527Z完成，145,544文件、45,422,871,529字节，generation=4af3e299165d4ecd942e703b91651651。默认隐藏Hot入口以-UseVss从Windows同一文件系统时点取数；回执为vss_crash_consistent、sha256_full_tree，但application_consistency=not_proven、application_recovery=not_tested。9月20日微信Drive周任务因本地复制哈希不符失败，未发起该次上传；旧云端内容本轮未读。Drive仍只消费已验静态集合，单次8G与WAL/SHM/journal保留边界不变。" },
    { label: "微信热备给冷备留下可核对交接单", value: "wechat.hot-backup-receipt.v2 绑定 generation、完整集合清单、文件数/字节、全树 SHA-256 验证及 source_follow_verified 保留结果，不输出聊天正文或文件名。PCConfig 仍按目标和 36 小时新鲜度接受它；状态查询消费生产者的验真回执，不再遍历和重哈希整库。" },
    { label: "新机恢复先看现场再动手", value: "Restore-DevConfig.ps1 默认只读核验包 SHA-256、成功回执、清单、内部路径与覆盖条件；显式执行只向隔离目标解包并完整复核文件树，保留替换前目标。Restore-WeChat.ps1 同样先检查，官方客户端关闭且覆盖得到明确选择后才复制，结果保持 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE。来源9月18日的隔离恢复已核对8,640文件、8,531,705,353字节并通过全树SHA-256，没有覆盖现用配置。账户、注册表、任务和机器路径重映射仍由 PCConfig 与实际应用验收。" },
    { label: "任务时间与三种不同的“成功”", value: "已登记时序为本机America/Los_Angeles：配置本地/G每日21:05，Drive每日22:00，微信G每日18:30，微信Drive周日20:00。9月24日05:02 UTC只读任务状态：配置本地/G和微信Hot最近任务返回0；配置Drive当时仍Running，不预判终态；微信Drive上次周任务9月20日返回1，失败发生在本地复制哈希核对，Drive未请求。旧9月18日四任务结果0只属当时，不覆盖此次失败；本轮未启停或改任务。" },
    { label: "包本身不加密，介质保护各自负责", value: "DevConfig 生成的 zip 本身可能含明文凭据，脚本没有给它再套一层加密。H 盘由 BitLocker 保护；Drive 依赖用户的私人账号与登录保护。本轮没有重新证明本地包或 G 盘的静态加密状态，所以页面不把“能访问”写成“包已加密”。" },
    {
      "label": "便于阅读的容量换算",
      "value": "9月24日本地/G配置包2,870,143,084字节，约2.87 GB；微信Hot生产回执45,422,871,529字节，约45.42 GB、145,544文件。GB为十进制；9月23日H冷备完成18集合，但比新G点早，不把冷盘成功误写为同代。",
      "hero": false
    },
  ],
  gaps: [
    "本轮只读Backup-Status的零写入结果、G盘现存wechat-hot-last.json和PCConfig既有cold-last；没有重新压缩、创建VSS、全树重哈希、访问Drive或复制H。生产回执完成不等于网页再次验真所有载荷；配置Drive本次运行终态与云端实际对象仍未知。",
    "当前来源已经增加配置包、清单、同名漂移、微信源删除和恢复事务的回归；本轮未重跑源码全套。9 月 4 日 8 个测试及当时因微信运行而跳过的分支只是历史，不再用于宣称当前所有路径通过。",
    "VSS捕获只保证文件系统时点的crash-consistent快照，不证明微信已经提交所有应用事务；手动无UseVss仍可能跨时刻读取。rclone check只核对远端与已选本地文件字节，真实客户端恢复必须另行验收。",
    "系统导出的 20+ 计划任务 XML 严禁在新电脑通配批量导入，必须配合 PCConfig 重建手册与验证工具逐项审查恢复。",
    "PCConfig 9 月 18 日收尾记录 16 个冷备集合完成，并对 G/H 微信 145,307 文件做全量哈希核对；其它集合按各自明列的完整或抽样范围验收，不一概称全量。以后 H 缺席仍跳过，保留最近成功日期；加密且锁定的在线介质不等于物理离线备份。",
    "“强哈希只留在原 state”已被随包清单和成功回执替代。现在仍需携带一整套对应代文件并通过恢复入口核验；仅有 latest 名称、可解压 CRC 或散失附属文件的旧包，都不能自动升级为完整可验证恢复集。",
    "9月18日配置包隔离恢复和16个集合备份通过，9月23日冷备回执为18集合完成；这些分属不同日期，不等于9月24日新G点已进H或整机新装已恢复。本轮没有做完整新机恢复；官方微信客户端接受、生产数据库导入、账号登录及自然启动仍待实际验收。",
  ]
});

export const devconfigBackupProject = {
  usageEntry: "双击本机 Open-BackupStatus.vbs 看图形状态，或用 Backup-Status.ps1 查看各介质；在已接入的 AI 对话中明确提出备份、微信原件保护或换机恢复，恢复默认先只读预检。",
  usageInputs: ["要保护或恢复的配置类别", "当前本地、G、H 或 Drive 可用情况", "恢复时的新机路径和目标是否已有文件"],
  order: 12,
  slug: "devconfig-backup",
  title: "DevConfig Backup",
  kicker: "重装之前知道保存了什么，恢复时不盲目覆盖",
  route: "/projects/devconfig-backup",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "本地/G配置与微信Hot有新点；H早一日，微信云同步上次失败",
  cardStatusTone: "mixed",
  ...devconfigBackupSnapshot,
  searchAliases: [
    "devconfig-backup",
    "DevConfig Backup",
    "开发环境重装备份",
    "配置备份",
    "凭据备份",
    "重装电脑还原配置",
    "新电脑一键恢复",
    "微信备份",
    "微信原应用数据",
    "rclone 云备份",
    "G盘热备",
    "H盘冷备隔离",
    "sources.psd1",
    "Restore-WeChat"
  ],
  searchProjection: {
    intents: [
      "重装电脑后怎么快速还原开发环境和凭据",
      "只备份不可再生配置而不备份几十G插件和缓存",
      "把开发配置备份到本地和Google Drive云端",
      "微信几十G聊天记录和媒体怎么增量备份防丢失",
      "排查备份计划任务没有按时运行或代理连不上",
      "重装系统后Documents路径和用户名坑怎么避开"
    ],
    entities: [
      "sources.psd1",
      "Backup-DevConfig.ps1",
      "Backup-WeChat.ps1",
      "Restore-WeChat.ps1",
      "Backup-Status.ps1",
      "Initialize-BackupNetwork.ps1",
      "robocopy",
      "G:\\80_Backup",
      "已绑定的 Google Drive remote alias（远端别名）",
      "xwechat_files（9月24日Hot回执45.42 GB）",
      "SQLite WAL / SHM"
    ],
    relations: [
      "DevConfig每个新代完整上传日期zip和latest对象，微信才用checksum逐文件增量",
      "微信G盘热备成功后发布无文件名和正文的有界回执供PCConfig判断冷备前置条件"
    ],
    failureRecovery: [
      "微信单次调用达到8G上限时停止但计划任务重试累计流量另算",
      "微信目标目录非空时拒绝直接覆盖并强制生成pre-restore备份",
      "换机按实际用户名、Documents位置与盘符重映射备份，原机布局只是恢复线索"
    ]
  },
  repositoryNote: "devconfig-backup 是 PUBLIC（公开）工具仓库。规则禁止提交真实备份包、注册表敏感导出、密钥、微信数据库或运行日志；当前 Git 文件候选通过 Assert-NoBackupArtifacts 的已知目录、扩展名和路径检查，任意正文零秘密仍由发布前公开内容门另行核对。",
  summary: "重装电脑最难找回的往往不是软件，而是设置、密钥、安装线索和应用数据。这套备份选择这些难重建内容，配置打成带清单的包，体积大的微信数据另做文件级增量；本地、G盘、云端和H冷备分别报告结果。恢复前先看计划，失败保留上一次成功副本，不把旧系统全部灌回新电脑。",
  why: "电脑真坏时，安装软件并不难，难的是找回散在几十个目录里的配置、密钥、环境变量、Wi-Fi、终端会话和应用数据。这个项目把采集、打包、热备、云端尝试、任务重建和微信回填顺序写清并自动化；恢复时仍要按版本、兼容性和现场状态选择材料，不能把旧系统原样倒进新系统。",
  plainExample: "“准备重装了。先告诉我最近哪份配置包完整、微信备到哪里，还有什么没保住；不要现在覆盖任何东西。”系统会核对各层副本和清单，给出可以隔离恢复的材料与真实缺口；新机重新登录和官方微信验收仍另做。",
  result: "得到版本化配置包及其可携带哈希/清单、微信当前与前一成功副本、各层最近尝试和最后成功状态，以及明确的恢复计划和替换前回滚点。恢复入口能逐文件验真，但不会自动导入所有旧任务、恢复登录或替我确认微信历史。",
  readerStates: {
    "pass": "只有一份配置或微信副本完整核对后才标为这一次成功；电脑本地、G 盘、云端和 H 盘分别展示自己的日期。",
    "problem": "网络或云端目标有问题时保留已经完成的本地副本；微信恢复目标已有文件时先留可回退副本，绝不直接覆盖。",
    "unavailable": "G 盘、云端账号或 H 盘暂不可用时，只把相应副本标成未完成；H 盘未解锁不触发冷拷贝，也不影响已验本地版本。"
  },
  dataSources: {
    "title": "系统从哪里采集配置，如何保障边界安全",
    "intro": "按已经登记的来源清单收设置、系统导出和微信原应用文件，公开网页只解释材料类别与恢复结果，不读取私人正文。",
    "rows": [
      {
        "source": "电脑上的应用和 AI 工具设置",
        "data": "按清单收密钥、终端会话、编辑器和应用配置；排除可重下的插件与缓存。",
        "result": "形成带文件清单的配置包；恢复时按新系统实际路径选择回填，不整包覆盖。"
      },
      {
        "source": "Windows 环境与网络设置",
        "data": "保存需要重建的系统环境、精选自动任务、Wi-Fi 和终端连接设置。",
        "result": "换机时逐项核对兼容性再恢复；旧任务不整批导入。"
      },
      {
        "source": "已装软件和扩展的名称清单",
        "data": "导出可重新安装的软件与扩展清单，而不保存全部安装程序。",
        "result": "重装时知道要补哪些软件，减少包体而不丢失选择记录。"
      },
      {
        "source": "微信原应用文件",
        "data": "包括数据库、图片和音视频；最近一次来源回执与每层副本仍各有自己的日期。",
        "result": "形成可逐文件核对的本地副本，再由云端取已验版本；真正能否读回聊天须在微信客户端确认。"
      },
      {
        "source": "已登记的云端目标",
        "data": "只使用本次绑定的 Google Drive 位置和当前网络条件。",
        "result": "上传与文件比对各自回读；目标错了或网络断开就停，不自动换账号。"
      }
    ],
    "note": "备份包可能含凭据和私人聊天，只留在可信副本位置；文件名排除和公开仓库检查不能代替逐值保护。"
  },
  responsibilities: [
    "按清单收难重建的设置和凭据，逐文件核对后生成可带走的配置包。",
    "分别把已完成配置包留在本机、G 盘和已登记的 Google Drive 目标，并各自确认是否真的到达。",
    "让微信原应用文件单独增量备份，源中真实删除在能完整读取时才跟随。",
    "恢复前先只读预览，明确执行后才解包或复制；已有目标先保留，应用能否打开再单独验。",
    "维护已经登记的 Windows 自动备份任务和启动方式，不把任务显示就绪当成文件已备好。"
  ],
  exclusions: [
    "可重新下载安装的软件、插件和缓存不挤进配置包。",
    "Docker 等程序的大型虚拟磁盘和运行中数据库不当作普通设置备份。",
    "这个项目只做本地、G 盘和云端；H 盘冷副本由 PCConfig 已有任务在解锁后处理。",
    "文件复制完整仍不等于微信官方客户端已登录并读到旧历史。",
    "真实备份包、聊天和密钥留在受保护介质，不进入公开代码仓库。"
  ],
  productPrinciples: [
    {
      "title": "先保住难重建的东西",
      "detail": "软件下载得回来，私人设置、密钥和会话往往不行。必需来源读不到时不发布看似完整的新包；包体大小随真正有用的资料变化，不为好看而删恢复材料。"
    },
    {
      "title": "本地、G 盘、云端和 H 盘各算各的",
      "detail": "电脑本地最快取，G 盘是日常第二份，Google Drive 提供异地副本；H 盘平时不在线，只在本人解锁且条件满足时由 PCConfig 冷备任务复制。一层成功不让其他层自动变绿。"
    },
    {
      "title": "微信先形成独立副本再上传",
      "detail": "默认从同一文件系统时点取得微信文件，再逐项核对；完整源中真正删除的文件才从备份中清理。文件齐全仍不证明微信数据库同一事务可用，最终要在官方客户端试读。"
    },
    {
      "title": "恢复先检查，再决定覆盖什么",
      "detail": "先验备份包和文件清单，正式操作先解到独立目录；微信还须确认客户端关闭，目标已有内容要留回退副本。复制完仍需逐应用登录和核对。"
    }
  ],
  glossary: [
    { term: "rclone（云同步工具）", meaning: "支持多云存储协议的命令行工具。配置按成功代发布包和附属校验文件；微信从已验本地集合做内容增量并在同一范围内核对删除。" },
    { term: "robocopy（Windows 健壮文件复制工具）", meaning: "Windows 文件复制工具，本项目用于受控采集与微信候选复制；单独的复制退出码不替代随后全树比对或成功指针。" },
    { term: "checksum（校验和）", meaning: "基于文件内容的哈希计算值；rclone 通过比对内容哈希决定是否传输，避免单纯依赖修改时间导致漏传或重复上传。" },
    { term: "WAL（Write-Ahead Logging，预写式日志）", meaning: "SQLite 可能把尚未合并进主库的已提交事务放在 -wal 文件里；备份规则不应过滤它，但运行中逐文件复制仍可能跨越不同写入时刻。" },
    { term: "SHM（Shared Memory，共享内存索引）", meaning: "SQLite 在 WAL 模式下使用的共享内存索引文件；本项目不将它排除，但是否可由客户端使用仍需恢复验收。" },
    { term: "fail-closed（失败关闭）", meaning: "当环境出现不可预期故障（如 binding 文件损坏、代理不可达、目标已存在非空文件）时，系统立即安全退出并阻断写入，绝不盲目降级。" },
    { term: "binding（远端别名绑定）", meaning: "保存在本地非秘密 state 中的 rclone remote 别名映射；确保云端同步只传向用户指定的准确云盘，严禁 fallback（降级）到默认第一个远端。" },
    { term: "BitLocker（Windows 驱动器加密）", meaning: "Windows 原生全盘加密技术；本项目冷备介质 H 盘默认处于锁定状态，防止物理介质丢失造成敏感凭据泄露。" },
    { term: "Task Scheduler（Windows 任务计划程序）", meaning: "Windows 系统内置的定时任务管理服务；当前驱动四个常规备份任务。首次云端补齐监控是独立临时任务，当前已禁用。" }
  ],
  operatingFlow: [
    {
      "title": "分别核对每处副本的日期",
      "detail": "状态入口把电脑本地、G 盘快速副本、云端和 H 盘冷副本各自的最后成功时间列出来。"
    },
    {
      "title": "按清单生成可核对备份",
      "detail": "只收难重建的配置和选定数据，保留清单、哈希与来源；微信文件走独立增量路线。"
    },
    {
      "title": "先验完整再发布",
      "detail": "本地与 G 成功后才更新当前指针，云端和冷盘按自己的任务另验。"
    },
    {
      "title": "恢复先预览后回填",
      "detail": "选完整日期包与新机目标，先确认路径映射、现有文件和回滚点，再逐应用验证。"
    }
  ],
  technicalOperatingFlow: [
    { title: "每日定时采集与精选打包", detail: "21:05 从声明清单生成独立候选，导出必要系统信息；检查必需源、最多三次稳定读取、文件哈希与结束时源集合，再经 7-Zip 测试，写入随包清单与成功回执。" },
    { title: "零流量本地与 G 盘热备落盘", detail: "只有完整成功代才更新current.json；配置包复制到G后再验真，成功前保留旧代。微信独立Hot任务从VSS固定时点读取、核验后切换当前与前一成功集合；快照创建失败就报告失败，不静默降为活动源复制。" },
    { title: "夜间上传一个完整新代", detail: "22:00 读取已成功且锁定的本地代，先发布日期包与附属校验文件、核对，再更新 latest 兼容别名和 current 指针。独立失败留住已有本地/G 成果，不能用本地完成提前代报云端成功。" },
    { title: "新机按兼容性选择回填", detail: "先用 Restore-DevConfig 的默认只读模式核验 SHA-256、回执、清单和解包路径，显式执行后只落入独立目标并逐文件核对；账户、注册表、任务和 home/AppData 回填仍按 PCConfig 与新系统兼容性选择。" },
    { title: "微信数据预检与安全接管", detail: "运行 Restore-WeChat.ps1 只读检查，确认官方微信关闭后，显式执行回填；若目标已有数据自动备份为 .pre-restore-* 回滚目录，最后由人工启动微信确认历史。" }
  ],
  components: [
    { name: "Backup-DevConfig.ps1", responsibility: "配置采集、系统现导出、清单生成、7z 压缩打包与分层分发（Local/Hot/Drive）。", implementation: "兼容 PowerShell 5.1/7，支持 Tier 和零写入 Plan；独立候选经稳定文件采集、结束集合检查、7z 测试与随包成功回执后，才能原子发布 current.json。失败不替换旧成功代。" },
    { name: "sources.psd1", responsibility: "配置采集与排除规则的数据驱动清单，定义散件、各工具目录、避坑黑名单与计划任务白名单。", implementation: "受限PowerShell数据文件，纯声明式数组与哈希表；新版额外排除Codex瞬态sandbox-bin和aicli-background-children协调租约，避免把不可恢复的活动状态当作配置备份。" },
    { name: "Backup-WeChat.ps1", responsibility: "微信原应用数据的独立文件级增量与可信原件保留集合收敛，支持 Hot、Local、Drive。", implementation: "默认隐藏Hot入口带-UseVss，从受约束创建的VSS时点副本捕获；只清理本次创建的快照。手动无UseVss仍是live_source。候选全树SHA-256通过后保留前一成功代；回执分别记录capture_consistency、application_consistency与application_recovery，Drive仍只消费已验本地代。" },
    { name: "Restore-WeChat.ps1", responsibility: "微信原生目录的灾难恢复总线，提供默认只读预检、目标非空回滚保护与人工在场状态标记。", implementation: "多步安全校验，支持 -Execute 与 -ReplaceExisting，返回 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE。" },
    { name: "Initialize-BackupNetwork.ps1", responsibility: "为无窗口计划任务提供网络代理自动继承与 rclone 远端绑定安全解析。", implementation: "读取注册表系统代理配置，解析 rclone-remote-binding.json，提供 fail-closed 安全保障。" },
    { name: "Setup-ScheduledTasks.ps1", responsibility: "在 Windows Task Scheduler 幂等注册 4 项常规备份任务；临时小时监控由独立安装脚本管理。", implementation: "四个任务的Action为wscript.exe，隐藏VBS优先PowerShell 7、缺失才回退5.1。微信Hot定义使用当前交互用户Highest以创建VSS，其余为Limited；注册可只更新选定已登记任务并保留原时序、设置与暂停意图。旧临时监控仍停用。" },
    { name: "Backup-Status.ps1", responsibility: "零写入查看配置包、微信、各层生产回执与任务；可选明确 LiveDrive 才查询云端元数据。", implementation: "devconfig.backup-status.v2 区分最后成功、最近尝试、已由生产者验真但未在状态查询重哈希的载荷。Backup-Plan 提供零写入差分，现有控制窗口定期展示状态，不另建常驻服务。" },
    { name: "tests/ 自动化合同套件", responsibility: "检查 Git 文件候选、Docker allowlist、本仓库 H 目标、任务代理/事务注册、rclone 内容变化 fixture 和微信恢复保护。", implementation: "当前测试覆盖候选、必需源、同名漂移、清单、保留、微信事务与恢复等边界；9 月 4 日 8 脚本仅为历史基线，本轮没有重新运行来源全套。" },
    {
      "name": "Restore-DevConfig.ps1 / Backup-Plan.ps1",
      "responsibility": "先以零写入方式解释包是否完整、会恢复哪些内容，再明确执行隔离恢复。",
      "implementation": "成功回执与外部/内部清单绑定；路径和包哈希校验通过后，执行才解包并全树回验，非空目标必须明确替换且保留前像。系统导入仍归 PCConfig。"
    },
  ],
  technicalContracts: [
    { artifact: "备份源与排除规则清单", schema: "sources.psd1 data format", owner: "sources.psd1", boundary: "声明 HomeFiles、HomeDirs、AppDataDirs、ExcludeDirs、ExcludeFiles 与 ScheduledTaskPatterns；禁止包含真实密钥正文。" },
    { artifact: "云端远端别名绑定记录", schema: "devconfig-backup.rclone-remote-binding.v1", owner: "rclone-remote-binding.json", boundary: "仅记录用户选定的 non-secret（非机密）rclone 远端别名，不展示具体私人 remote 名，也不包含 OAuth token 或凭据。" },
    { artifact: "可携带成功包与逐文件恢复清单", schema: "devconfig.package-receipt.v2 / devconfig.payload-manifest.v1 / devconfig.package-current.v2", owner: "Backup-DevConfig.ps1", boundary: "每代 .sha256、.receipt.json、.manifest.json 与包内 backup-manifest.json 共同绑定完整采集、7z 测试、包哈希和文件树；旧 state/latest.sha256 只是兼容记录，不能独立授权发布或恢复。" },
    { artifact: "云端上传完成状态凭证", schema: "devconfig.drive-upload-state.v1", owner: "last-uploaded.json", boundary: "记录已成功传至 Drive 的 SHA-256、远端别名、目录名、带日期包名与 latest_name；必须另读本轮远端对象，不能只凭任务状态声称云端已追平。" },
    { artifact: "微信 G 盘热备回执", schema: "wechat.hot-backup-receipt.v2", owner: "Backup-WeChat.ps1", boundary: "绑定完整集合清单、generation、文件数/字节、sha256_full_tree 与 source_follow_verified；不输出文件名和正文，PCConfig 仍核对目标与 36 小时新鲜度。" }
  ],
  usageExamples: [
    {
      "moduleSlug": "tiered-distribution",
      "ask": "如果家里停网了，每天晚上的备份会怎样？",
      "effect": "本地和 G 盘任务不依赖外网，仍可各自完成；Drive 任务不会拖垮它们，但会保持未完成或返回非零，等网络与远端恢复后由任务补跑。"
    },
    {
      "moduleSlug": "tiered-distribution",
      "ask": "为什么这个项目不直接往 H 盘写备份？",
      "effect": "H 盘平时不在线，只有本人解锁且介质和容量都合适时，电脑恢复任务才把已验副本复制过去；本项目自己的每日备份不直接改 H 盘。"
    },
    {
      "moduleSlug": "source-catalog",
      "ask": "JetBrains 和 VS Code 装了十几 G 插件，重装时也会打包进去吗？",
      "effect": "不会把可重新下载的插件程序都塞进包；保存个人设置和插件名称清单，重装时按清单补齐。"
    },
    {
      "moduleSlug": "source-catalog",
      "ask": "Docker 的镜像和容器也会被 DevConfig 备份吗？",
      "effect": "不会；DevConfig 只收明确列出的 CLI/Desktop 配置和 contexts，docker_data.vhdx、镜像层、容器运行态与登录数据库不属于这个包。"
    },
    {
      "moduleSlug": "wechat-native-backup",
      "ask": "微信每天发很多视频，云端任务会不会一下传几十 GB？",
      "effect": "它按内容比对并跳过未变化文件，默认再用8G限制单次云端传输；达到上限就明确本次未完成，不代表云端空间或任务重试的累计流量没有上限。"
    },
    {
      "moduleSlug": "wechat-native-backup",
      "ask": "微信正在聊天时备份，数据库会不会损坏？",
      "effect": "默认从同一文件系统时点复制微信文件，减少复制期间前后变化；这仍不能保证微信内部每条聊天都处于同一事务，最后须在官方客户端试读。"
    },
    {
      "moduleSlug": "recovery-and-tasks",
      "ask": "换了新电脑，解压备份后为什么 Xshell 和部分软件找不到配置？",
      "effect": "由当前恢复任务和PCConfig先核对新机用户名、文档目录与盘符，再处理备份里的已知路径引用并回读应用。原机E:\\Documents和10979只是旧布局；只有明确选择保留原布局时才指回E，不要求新机照搬。"
    },
    {
      "moduleSlug": "recovery-and-tasks",
      "ask": "新电脑可以把备份里的自动任务一次全装回去吗？",
      "effect": "不能照搬旧任务；逐项核对旧路径、登录身份和新机软件，再按电脑恢复说明重建。"
    }
  ],
  evidenceLayers: [
    { layer: "Source（源码与规则）", proves: "2026-09-22已回读PUBLIC main=25415061c11bfaef92535925e4a8bb950c5ceeb0。保留原可携带恢复集、事务式微信集合与只读计划，并增加Hot VSS捕获、精确快照清理、选定任务注册和瞬态配置排除；本轮未重跑源码测试。", doesNotProve: "源码不证明云端或H已补齐，也不证明新机或微信应用恢复。" },
    { layer: "Tests（隔离自动化测试）", proves: "9 月 18 日 PCConfig 来源收尾记录当前专项回归通过；旧 9 月 4 日 8 脚本的结果保留为历史。本轮网页只读取证据，没有把这些测试再执行一次。", doesNotProve: "源回归或已验文件恢复都不能代替真实新 Windows 的登录、驱动、应用兼容与微信业务验收。" },
    { layer: "Runtime（当前系统运行态）", proves: "2026-09-24T05:02:11Z零写入状态：本地/G配置包为2,870,143,084字节的同一成功代；微信Hot回执于01:40:05Z完成145,544文件、45,422,871,529字节，vss_crash_consistent、sha256_full_tree，状态入口仅校验生产者回执和manifest绑定。配置Drive当时仍Running；微信Drive最近周任务9月20日因backup_copy_hash_mismatch在本地阶段失败，未发起该次上传。", doesNotProve: "Running不等于上传成功；任务结果不证明云端实际对象、应用一致性或新机恢复。网页未联网或重哈希完整载荷。" },
    { layer: "Cold（现存冷备回执）", proves: "PCConfig cold-last于2026-09-23T07:44:11Z完成，devconfig与wechat两集合结果complete；这是独立于9月24日新G点的H冷备成果。", doesNotProve: "回执早于新G配置包与微信Hot，不能证明H当前包含这两份新点；网页没有执行或重新验证冷同步。" },
    { layer: "Recovery（恢复与容灾边界）", proves: "已发布 PCConfig 收尾证据对配置包隔离恢复的 8,640 文件、8,531,705,353 字节做全树哈希核对，并完成 H 包哈希与 G/H 微信全量验真；这一恢复层由来源 Owner 执行，不是网页本轮动作。", doesNotProve: "网页本轮没有另行执行微信复制、DriveOnly、H冷拷贝或完整新机恢复，也不证明官方客户端登录后能看到预期历史。" }
  ],
  operationalEntrypoints: [
    { name: "空白新机取得恢复工具", command: "git clone https://github.com/wlyaaaaa/devconfig-backup.git E:\\Projects\\Backups\\devconfig-backup", purpose: "从公开仓库取得脚本与当前 README；这一步只取得工具，不包含任何私人备份包。" },
    { name: "检查 G 盘候选代", command: "pwsh -File .\\Restore-DevConfig.ps1 -Archive G:\\80_Backup\\DevConfig\\latest.zip -Json", purpose: "默认零写入核对完整采集回执、包 SHA-256、内外清单、路径与目标覆盖条件。明确 -Execute 才解到隔离目标并全树验真，目标非空需 -ReplaceExisting；不导入系统设置或恢复登录。" },
    { name: "取得 PRIVATE PCConfig", command: "git clone https://github.com/wlyaaaaa/PCConfig.git E:\\PCConfig", purpose: "先恢复 GitHub 私有仓库访问再 clone；拿不到时暂停机器级设置、任务与 H 冷备阶段，不把缺失路径当入口。" },
    { name: "进入 PCConfig 恢复总入口", command: "Get-Content E:\\PCConfig\\docs\\recovery\\START_RECOVERY.md", purpose: "PCConfig 已取得后，读取机器路径、系统设置、计划任务与 H 冷备的唯一当前恢复顺序。" },
    { name: "验证计划任务重建方案", command: "node E:\\PCConfig\\tools\\validate_scheduled_task_rebuild_plan.mjs", purpose: "在注册四个项目任务前先检查现行重建方案，不通配导入旧 XML。" },
    { name: "手动执行本地与 G 盘热备", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Local,Hot", purpose: "生成经完整采集、7z 和哈希验证的本地代，把包和全部附属校验文件复制验真后发布 G 盘 current 指针；失败不提前清除上个成功代。" },
    { name: "手动触发 Google Drive 上传", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Drive", purpose: "只消费完整成功代，发布日期包与校验文件后再更新兼容别名和 current；远端每份必要文件回读一致才完成。" },
    { name: "微信数据热备增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Hot", purpose: "形成完整候选并核对，按可用源的实际保留集切换 G 当前副本、保留前一成功代；不是把离线源误判为空后直接删除。" },
    { name: "微信数据云端增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Drive", purpose: "锁定并消费已验本地微信快照，内容增量、同范围清旧和最终严格比对；默认单次 8G，DbOnly 不删除已有媒体或冒充全量。" },
    { name: "微信恢复只读安全预检", command: "powershell -File .\\Restore-WeChat.ps1 -Target <已核对的目标机微信数据目录>", purpose: "默认只读检查源是否为非空目录、路径关系/重解析点、目标状态与已知进程；不做内容哈希完整性证明。" },
    { name: "微信恢复显式回填与回滚隔离", command: "powershell -File .\\Restore-WeChat.ps1 -Execute -ReplaceExisting -Target <已核对的目标机微信数据目录>", purpose: "在确认微信关闭后安全回填数据，现有目录自动保留为 .pre-restore-* 回滚副本。" },
    { name: "查看全盘备份新鲜度与状态", command: "pwsh -File .\\Backup-Status.ps1 -NoDrive -Json", purpose: "读取各层完整回执与任务结果，不遍历原件、读取日志正文或重算整个载荷；Plan 可看候选差分。明确 LiveDrive 才查询云端，其 OAuth 刷新可能写入账户状态。" },
    { name: "重建常规自动化计划任务", command: "powershell -File .\\Setup-ScheduledTasks.ps1", purpose: "事务化注册 4 项常规任务；Action 为 wscript.exe，隐藏 VBS 优先 PowerShell 7、缺失时才用 5.1。" }
  ],
  evolution: [
    {
      "date": "2026-06–07",
      "title": "把难重建的配置留下来",
      "commit": "",
      "result": "从按来源精选采集发展为本地、G盘和云端分层保存；能重新下载的软件不挤占配置备份。",
      "evidence": [
        {
          "date": "2026-06-23—2026-07-08",
          "note": "按来源精选配置，软件可重下部分另行安装。 原记录的依据标签为“基础架构与清单数据驱动”，未附Git提交编号。"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "大体量应用数据单独处理",
      "commit": "",
      "result": "微信原应用文件采用独立增量和恢复预检，不塞进每轮配置压缩包；H由机器恢复入口承接，不新建一套冷备任务。",
      "evidence": [
        {
          "date": "2026-07-09—2026-07-27",
          "note": "备份制品与公开源码分开，H冷备由机器恢复入口负责。 原记录的依据标签为“公开制品门与冷备隔离”，未附Git提交编号。"
        }
      ]
    },
    {
      "date": "2026-09-18–09-22",
      "title": "离开旧电脑也能核验手中的备份",
      "commit": "8b40103",
      "result": "配置包自带文件清单和完整性检查，离开旧电脑仍可先验再恢复；微信先形成同一文件系统时点的副本并留前一版。云端和冷盘是否追上，以及微信客户端能否读回，仍各自验收。",
      "evidence": [
        {
          "date": "2026-08-27—2026-09-18",
          "note": "配置包与微信副本形成可携带、可隔离复验的恢复集。 原记录的依据标签为“微信恢复、远端失败关闭与热备回执”，未附Git提交编号。"
        },
        {
          "date": "2026-09-22",
          "commit": "25415061c11bfaef92535925e4a8bb950c5ceeb0",
          "note": "9月22日当时只读已发布源码与01:39 UTC完成的Hot生产回执；默认隐藏Hot增加UseVss，手动无参数仍为live_source。9月24日新恢复点属于相同机制的日常捕获，不另增阶段。"
        }
      ]
    }
  ],
  snapshotUpdateNote: "9月24日零写入状态显示本地/G配置包与微信Hot已有新点，9月23日H冷备仍是上一时点；微信Drive 9月20日最近一次任务失败于本地复制哈希核对，本次配置Drive观察时仍在运行。旧9月18日配置云端成功与恢复证据保留原日期；网页未访问云端或重哈希载荷。",
  "readerBoundary": "备份和隔离文件恢复已有证据；它不是整盘启动镜像，也不保证新电脑免登录或微信客户端已经接受历史数据。",
};

export const devconfigBackupModules = [
  {
    slug: "tiered-distribution",
    usageEntry: "在本机运行 Backup-Status.ps1 或在已接入的 AI 对话中问“昨晚每一层备份到哪一步”。",
    usageInputs: ["想看的日期或备份代", "本地、G、Drive、H 的实际可用性"],
    productFlow: [
      {
        "title": "看清哪份副本真的完整",
        "detail": "状态入口分别展示电脑本地、G 盘、云端和 H 盘可验证的版本与时间，不把一层的成功借给另一层。"
      },
      {
        "title": "核对完整版本",
        "detail": "本地先采集和验证整包，再复制并验 G；云端后来复制已完成的一代。"
      },
      {
        "title": "选真正能恢复的一份",
        "detail": "交回每处副本的完整性和缺口；云端故障不抹掉已验本地副本，旧云记录也不算本轮成功。"
      }
    ],
    readerStatus: "本地/G配置包与微信Hot已有9月24日新点；H冷盘9月23日完成，配置Drive本次仍运行，微信Drive上次周任务失败。恢复前按介质核对日期。",
    shortTitle: "分层与云校验",
    title: "本地和 G 盘先落稳，Drive 失败不拖垮热备",
    teaser: "先生成完整成功代，再分层发布；每层携带校验依据，失败不会把旧成功副本改成半成品。",
    status: "本地/G配置包9月24日已验，H冷备9月23日完成但较旧；配置Drive本次观察时运行中，云端未重读",
    statusTone: "mixed",
    relation: "这是整套灾备的介质层：先把能离线完成的本地与 G 盘副本落稳，再单独尝试云端；H 盘冷备不归这个仓库直接写。",
    value: "本机、G 盘、云端和 H 盘各有自己的成功日期。断网不抹掉本地已验副本，G 盘或冷盘暂不可用也会单独报告，不用一个绿色任务状态概括全部。",
    why: "电脑本地、G 盘、Google Drive 和 H 盘各防一种故障。一次任务显示成功，不能替四处副本都作证；只有完整配置包和清单核对后才更新当前版本。",
    example: "我问：“昨晚备份好了吗，哪一份现在能带去新电脑？”状态分别列出本地包、G 盘、云端和 H 盘的最后成功日期，微信文件另看自己的副本。",
    result: "拿到每处副本最近的完整版本、日期、最近一次尝试和缺口。较新的本地或 G 盘备份不会让云端或 H 盘自动变成同一版本；恢复时按实际介质选择。",
    problem: "防止网络离线或海外云盘受阻导致本地热备无法完成，同时防止冷备介质暴露在日常自动化写入中导致损坏。",
    readerStates: {
      "pass": "配置包和随附清单完整后，本机、G 盘及云端各自回读并标自己的日期。",
      "problem": "云端网络中断时保留已完成的本地副本，说明云端稍后仍需重试。",
      "unavailable": "云端目标身份不明或 H 盘未解锁时停对应复制，不自动改投另一账号或假报完成。"
    },
    decisionImpact: [
      "日期包及其附属清单作为一个成功代保留；current.json 是完整采集与验证的指针，latest.zip 只是兼容别名，不可凭修改时间挑包。",
      "G:\\80_Backup 作为本机可访问的日常在线热备（每日 21:05 + 登录后 20 分钟），该层不依赖公网。",
      "配置包按完整代发布，不做 zip 内部差量；先发布日期文件与校验依据，再更新兼容别名和 current。文件集合或完整性不符时拒绝把候选冒充成功代。",
      "云端复用必须针对同一完整成功代与登记目标逐项回读，不能只信本机旧 state/latest.sha256 或最近任务结果。",
      "日期包、兼容别名、附属清单和 current 指针都需匹配本地成功代；一个 zip 的大小/MD5 相同不足以单独说明完整恢复集已发布。",
      "本仓库的任务不写 H；PCConfig 的 AIRecoveryColdSync-Daily 每天机会式检查。H 人工解锁后，还需 Hot context 不超过 48 小时、DevConfig/微信各不超过 36 小时、G/H 介质身份正确、H 剩余空间高于 100 GiB 并取得写锁。",
      "条件通过后PCConfig冷备跟随G当前有效保留集：先复制并核对新增变化，再清理H中已退出的旧副本。源根离线或读不完整不按空源删除，不自动重锁H；DevConfig本地/G日期包仍按既有7份轮转，新包验真后清旧日期包。"
    ],
    implementation: [
      "G 短暂缺席沿用有界等待；独立候选、全部附属文件与成功回执验真前不替换当前指针或淘汰旧代，持续缺席保留上次成功并明确本次失败。",
      "Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。",
      "Initialize-BackupNetwork.ps1 自动从 Windows 系统代理读取当前已启用的代理配置，为后台无窗任务提供网络连通性。",
      "Resolve-ConfiguredRcloneRemote 从 state\\rclone-remote-binding.json 读取用户选定的远端别名，文件损坏或不可读时直接 fail-closed（失败关闭）。",
      "tests/Assert-HDriveSafety.ps1 通过字符串与正则合同检查本仓库脚本没有 H 目标或已退役 Usb 参数；它不是 PowerShell AST 检查。"
    ],
    flow: [
      "计划任务或手动触发 Backup-DevConfig.ps1 -Tier Local,Hot。",
      "独立 staging 经完整采集与 7z 测试后，生成日期包、SHA-256、成功回执、逐文件清单与包内 manifest。",
      "把成功代复制到 G 并回验，最后原子发布 current.json；之后才按保留策略清理旧成功日期代。",
      "22:00 Drive 任务锁定已完成的本地代，核对登记目标、完整状态与全部代文件。",
      "先上传并验真日期包及其附属文件，再发布 latest 兼容别名与 current；最后才写云端成功状态。"
    ],
    concepts: [
      { term: "Tiered Storage（分层存储）", explanation: "把同一恢复材料按本地包、G 盘在线热备、Google Drive 和 PCConfig 人工冷备分层，每层独立给出结果。" },
      { term: "Checksum Verification（校验和核验）", explanation: "比对源与目标端的内容哈希，不依赖可能产生时钟漂移的文件修改时间。" },
      { term: "Cold Backup Window（冷备窗口）", explanation: "H 平时不可用；用户人工解锁后，PCConfig 日任务才有机会在新鲜度、介质、容量和写锁门通过时复制。任务不会自动解锁或重锁 H。" }
    ],
    boundaries: [
      "DevConfig 仓库的日常脚本与四个任务不直接写 H；H 冷备由 PCConfig 的独立日任务在人工打开的介质窗口机会式执行。",
      "Google Drive 同步必须严格读取绑定的合法远端别名，禁止静默切换至未授权云盘。",
      "未通过大小与 MD5 双重校验的云端对象绝不标记为同步成功。"
    ],
    failures: [
      { condition: "Google Drive 远端 binding 文件损坏或格式错误", response: "Resolve-ConfiguredRcloneRemote 立即失败关闭，拒绝回退至第一个可用远端，防止数据错传。" },
      { condition: "夜间定时上传时网络中断、系统代理或远端预检不可用", response: "脚本写入本地日志并向 Task Scheduler 返回非零退出码，按任务策略重试；已完成的本地/G 热备不回滚。" },
      { condition: "上传后日期包或 latest.zip 的大小/MD5 不匹配", response: "本轮 Drive 标记失败并保留本地包，下次继续核对或上传；不能写成云端已完成。" }
      ,{ condition: "AIRecoveryColdSync-Daily 运行时 H 没有解锁或不可见", response: "PCConfig 写出 status=skipped 与 H_unavailable；不写 G、不写云、不自动重锁 H，也不把本轮算成完成冷备。" }
    ],
    sources: [
      { path: "Backup-DevConfig.ps1", role: "分层备份主调度脚本，处理打包、本地保留、G 盘文件复制与 Drive 同步" },
      { path: "Initialize-BackupNetwork.ps1", role: "代理环境继承与 rclone 远端 binding 安全解析" },
      { path: "Backup-Status.ps1", role: "各级介质新鲜度与计划任务执行状态汇总控制台" },
      { path: "tests/Assert-HDriveSafety.ps1", role: "本仓库 H 目标与退役 Usb 参数的字符串/正则合同检查" },
      { path: "E:\\PCConfig\\tools\\Invoke-CoreRecoveryMaintenance.ps1", role: "H 冷备的实际 owner：机会式日任务、新鲜度/介质/容量/写锁门与验真后的有效保留集源跟随" },
      {
        "path": "Backup.Common.ps1",
        "role": "稳定采集、完整集合、原子回执、受管资源锁和成功代核验"
      },
    ],
    verification: [
      "9 月 18 日来源回归与收尾证据包含 H 职责隔离和分层发布验证；网页本轮不重跑这些源码脚本。",
      "2026-09-24 05:02 UTC 的零写入状态：本地/G 同为 devconfig-20260923-210942-0fc73b3a.zip，2,870,143,084 字节，生产者已验但状态入口未重哈希全部内容。9月18日旧包 devconfig-20260917-223044-15f482e1.zip、2,918,700,657字节与 SHA-256=23175b58deb25089f07637380a99f449ead3f699cffcb83deb1bbae9255cc42c 仅是旧时点证据。",
      "PCConfig 已发布 docs/recovery/devconfig-backup-delivery-2026-09-18.md，记录9月18日配置包云端同代对象回读；本轮未执行 LiveDrive 或上传，9月24日新配置包是否到达云端仍未知，不能把旧成功当本次完成。",
      "同份 9 月 18 日来源验收记录 16 个冷备集合、H 配置包哈希与 G/H 微信完整核对；不同集合的全量、路径/大小与抽样证据分别成立，不能互相替代。9月23日新cold-last为18集合complete，devconfig/wechat两集合complete，但完成早于9月24日新G点。"
    ],
    searchAliases: [
      "分层备份架构",
      "本地热备",
      "G盘热备",
      "Google Drive备份",
      "H盘冷备隔离",
      "rclone checksum",
      "latest.zip"
    ],
    searchProjection: {
      intents: [
        "为什么备份要分本地和G盘还有Drive三层",
        "为什么日常脚本严禁直接写入H盘冷备",
        "Google Drive上传如何避免重复传相同文件",
        "没有网络时本地备份会不会报错中断"
      ],
      entities: [
        "Backup-DevConfig.ps1",
        "G:\\80_Backup\\DevConfig",
        "Google Drive (Backups/<computer-name>)",
        "rclone-remote-binding.json",
        "latest.sha256",
        "H: 驱动器"
      ],
      relations: [
        "本地打包输出zip后通过Copy-Item复制至G盘热备",
        "rclone读取binding并把每个新代完整zip上传为日期包和latest对象",
        "PCConfig日任务只在人工打开H窗口且全部门通过时先复制验真，再按G有效保留集清理H旧副本"
      ],
      failureRecovery: [
        "网络离线时Drive任务退出码触发计划任务自动重试",
        "binding损坏时立即失败关闭并等待人工修复"
      ]
    }
  },
  {
    slug: "source-catalog",
    usageEntry: "在已接入的 AI 对话中说明要保护哪些难重建设置，要求检查 DevConfig 清单；日常由备份任务按清单执行。",
    usageInputs: ["要保留的软件设置或密钥类别", "是否需要换机恢复"],
    productFlow: [
      {
        "title": "确定真正要留什么",
        "detail": "系统按来源清单选配置、私钥和导出清单，排除可重下的大型安装物和缓存。"
      },
      {
        "title": "形成可核对的恢复包",
        "detail": "重要来源缺失就不发布本轮；成功包附文件清单和完整性校验，便于换机时确认拿到的是同一份材料。"
      },
      {
        "title": "拿到选择依据",
        "detail": "交回哪些资料已被这代包含、哪些没包含；恢复时按需取用，不把包直接整机覆盖。"
      }
    ],
    readerStatus: "已形成带完整性清单的配置恢复包；必需来源读不到会使本轮备份失败，软件安装本体和明确排除内容仍不在包内。",
    shortTitle: "配置精选与避坑",
    title: "按清单保留难重建资产，每份恢复包都能核对来源和完整性",
    teaser: "安装包、插件和缓存可以再下载；配置与恢复状态按必需/可选清单采集，缺重要来源就不发一个假完整包。",
    status: "9月24日本地/G配置包同代2,870,143,084字节；旧9月18日包验真仍是历史，应用恢复另验",
    statusTone: "good",
    relation: "它是备份内容的决策中枢：明显可重建的安装本体和缓存不收，真正影响恢复的配置、凭据和状态进入候选包；恢复者再按版本与兼容性挑选。",
    value: "既不做整机镜像，也不为了追求漂亮的小数字漏掉有用状态。软件清单负责重新下载，恢复包负责保留难以重建的部分。",
    why: "安装包和插件大多还能重下，私人设置、密钥和终端连接记录更难重建。清单优先保留这些材料；它是供换机时逐项选择的包，不是一键覆盖新电脑。",
    example: "我说“重装时别把十几 G 插件都打进去，但密钥和设置不要漏”：清单保留难重建资产、导出可重装软件列表；重要来源不可读时直接失败，可选来源未安装则明确记缺席。",
    result: "得到带日期和完整性清单的配置包、要重新安装的软件列表，以及哪些来源没有收入。包可能包含凭据，只能保存在可信介质；恢复前按清单确认所选副本的来源范围。",
    problem: "防止将数十 GB 的 node_modules、浏览器缓存、软件本体与 Docker 磁盘镜像打进备份包，并防止把明文 API Key 与私钥误提交至开源仓库。",
    readerStates: {
      pass: "清单列出的必需配置都能读取，排除的安装本体、插件和缓存没有混入；采集结束再次核对来源范围和逐文件完整性后，才交回可选择恢复的这一代配置包与软件补齐清单。",
      problem: "必需来源在采集中消失、读不稳或结束时来源集合发生变化，就说明本轮缺什么并停止发布；文件读完后又被应用修改会单列说明，不能称整包来自同一时点。",
      unavailable: "必需磁盘或软件配置不可读、包或清单无法核对时，保留上次成功包并说明本轮不能形成新版本；可选软件未安装则记录缺席，不用空目录冒充已经备份。"
    },
    decisionImpact: [
      "当前本地/G成功包为2,870,143,084字节；9月18日旧包隔离恢复曾解出8,640文件共8,531,705,353字节并逐文件核对，不能拿旧恢复验收证明新包恢复通过。压缩包、解包范围与应用恢复分别说明。",
      "PowerToys 只取 AppData\\Local 下 1.3 MB 的设置，坚决不取 843 MB 的安装本体。",
      "JetBrains 剔除 10.6 GB 的 plugins 与 jdbc-drivers 目录，通过导出 txt 清单实现重装自动下载。",
      "Docker 仅备份 CLI config.json 与 Desktop 偏好，坚决排除动辄几十 GB 的 docker_data.vhdx 磁盘镜像。",
      "FinalShell 只取 conn\\ 会话，PixPin 只取 Config 剔除截图历史，Clash 剔除 34 MB 规则数据库。",
      "AI 聊天历史（如 .claude\\projects）默认排除，仅在指定 -IncludeHistory 时追加打包。",
      "实际备份包包含部分明文凭据和不可轮换的 GPG 私钥；它与公开脚本仓库是两件事，恢复和介质保护要按材料类型处理。",
      "提交前由 Assert-NoBackupArtifacts.ps1 扫描 Git 文件候选的目录、扩展名和已知数据库路径；它不替代对任意源码正文的秘密检查。"
    ],
    implementation: [
      "sources.psd1 声明采集与排除范围，区分必需和可选源；每个文件最多三次有界稳定读取，结束时核对源路径集合，记录 changed_after_capture_count，不承诺全应用同一时点。",
      "Backup-DevConfig.ps1 现生成 env-user.reg, env-machine.reg 与 path-machine.txt 注册表导出。",
      "通过 netsh wlan export profile 自动导出全部 Wi-Fi 配置文件（含密码 XML）。",
      "_manifests 目录现场执行 scoop export, winget export 与 code --list-extensions 生成软件补齐清单。",
      "tests/Assert-DockerScope.ps1 验证 Docker 采集只引用 allowlist（允许清单）的配置文件与 contexts，不递归收整个数据树。"
    ],
    flow: [
      "Backup-DevConfig.ps1 读取 sources.psd1，初始化 staging 临时目录。",
      "逐项采集用户根目录散件、SSH 会话、GPG 私钥与各 AI 工具设置。",
      "实时执行注册表导出、计划任务 XML 复制与包管理器软件清单导出。",
      "robocopy 带 /XD 与 /XF 参数执行严格黑名单过滤，过滤缓存与日志。",
      "7-Zip 检测、文件清单与成功回执闭合后才发布 current；独立候选失败不更新指针，不因漏采把旧成功包删掉。"
    ],
    concepts: [
      { term: "Data-Driven Manifest（数据驱动清单）", explanation: "配置规则与代码逻辑解耦，增删备份项只需修改 psd1 数据文件，不动任何执行脚本。" },
      { term: "Signal-to-Noise Ratio（高信噪比备份）", explanation: "优先剔除可重建的大体积二进制与缓存，同时允许真实恢复状态随使用增长；目标不是永远维持某个包体数字。" },
      { term: "Public Artifact Gate（公开制品门）", explanation: "提交前检查 Git 文件候选的已知备份目录、归档扩展名和微信数据库路径；更广的公开正文检查由网站发布门单独完成。" }
    ],
    boundaries: [
      "严格禁止把软件安装目录、IDE 插件二进制包、缓存与 node_modules 打进备份。",
      "严格禁止 Docker Desktop 的 VHDX 磁盘镜像、容器层与运行态进入配置包。",
      "真实备份包可能含明文凭据，但不得进入 Git；不可轮换的 GPG 私钥需要比普通可轮换 token 更谨慎地选择加密与介质。"
    ],
    failures: [
      { condition: "sources.psd1 存在语法错误或非 UTF-8 BOM 编码", response: "PowerShell 5.1 无法解析时本轮采集停止；先修复数据文件，再重新生成包。" },
      { condition: "Git 暂存区中误加入了备份 zip、reg 或敏感数据库文件", response: "Assert-NoBackupArtifacts.ps1 门禁测试失败，阻断任何提交与发布流程。" },
      { condition: "Docker Desktop 正在生成新的大文件或临时日志", response: "采集只读取明确列出的 CLI/Desktop 小配置和 contexts，不递归收整个 Docker 数据树。" }
    ],
    sources: [
      { path: "sources.psd1", role: "纯数据驱动的备份源清单与排除黑名单" },
      { path: "_manifests/", role: "包管理器与编辑器插件导出清单目录" },
      { path: "tests/Assert-NoBackupArtifacts.ps1", role: "提交前严查防泄密与备份产物过滤的机械安全门禁" },
      { path: "tests/Assert-DockerScope.ps1", role: "Docker 配置范围严格限定自动化断言测试" }
    ],
    verification: [
      "tests/Assert-NoBackupArtifacts.ps1 PASS，证明 Git 文件候选没有落入已知备份目录、归档/密钥容器扩展名或微信数据库路径；不证明任意文本内容零秘密。",
      "tests/Assert-DockerScope.ps1 验证 Docker 只走 allowlist（允许清单），不收整个 .docker 或 Docker Desktop 树。",
      "9 月 18 日来源曾用当时配置包做独立目标解包与全树哈希核对；9月24日新包仅由生产回执确认，本轮没有再解包或读取其中私人内容。"
    ],
    searchAliases: [
      "sources.psd1",
      "配置精选",
      "避坑指南",
      "Docker小配置",
      "JetBrains排除插件",
      "Assert-NoBackupArtifacts",
      "公开仓库安全"
    ],
    searchProjection: {
      intents: [
        "配置恢复包怎样证明重要文件没有漏采",
        "PowerToys和JetBrains备份怎么避开几十G缓存",
        "Docker Desktop哪些配置该备哪些不该备",
        "如何保证公开备份脚本仓库不泄露自己的API Key"
      ],
      entities: [
        "sources.psd1",
        "Assert-NoBackupArtifacts.ps1",
        "Assert-DockerScope.ps1",
        "docker_data.vhdx 排除",
        "JetBrains plugins 排除",
        ".gnupg 私钥",
        "_manifests/ 清单"
      ],
      relations: [
        "sources.psd1声明文件采集与排除黑名单",
        "Assert-NoBackupArtifacts机械扫描git candidates防止泄密",
        "_manifests生成scoop和winget重装导出文件"
      ],
      failureRecovery: [
        "检测到疑似凭据或zip文件时拦截git提交",
        "psd1编码非UTF-8 BOM时给出明确解析告警"
      ]
    }
  },
  {
    slug: "wechat-native-backup",
    usageEntry: "在已接入的 AI 对话中明确提出微信原生数据备份或查询 Hot 状态；实际动作由项目已安装的微信备份任务执行。",
    usageInputs: ["当前微信原件目录是否可读", "需全量媒体还是临时只要数据库", "G 或 Drive 目标状态"],
    productFlow: [
      {
        "title": "先核对微信原件是否读得全",
        "detail": "系统按现有清单检查应用目录和图片视频是否可读；临时只备数据库会明确缺少媒体。"
      },
      {
        "title": "先形成独立可核对副本",
        "detail": "从受约束的同一时间点复制文件，并逐个核对内容；整份成功后才把它设为当前备份。"
      },
      {
        "title": "按源集合同步与报告",
        "detail": "源可完整读取时传播实际删除，整根离线则保留旧副本；云端流量上限或上传未完时不报告完整成功。"
      }
    ],
    readerStatus: "9月24日微信热备保存145,544个文件，来自同一文件系统时点；H冷备仍是更早时点，云端上次周任务失败，官方客户端恢复未验。",
    shortTitle: "微信原生增量",
    title: "微信先形成验真副本，再让热备、云端跟随实际原件集合",
    teaser: "几十 GB 不反复压成整包；先复制验真，再切换当前/前一代。本人从可信原件中删除的文件可以同步退出，整根离线不会当空库。",
    status: "9月24日Hot回执145,544文件、45.42GB；9月23日H冷备完成但较旧，9月20日微信Drive任务失败于本地阶段，客户端恢复未验",
    statusTone: "good",
    relation: "把体积大、变化快的微信原应用目录从配置包里拆出来单独维护；热备结果再用有界回执交给 PCConfig 判断冷备前置条件。",
    value: "不必每次把几十 GB 重新压成一个大包；没变化的文件会跳过，单次云传输也有上限。代价是文件级副本仍需官方客户端做最终可用性验收。",
    why: "微信图片视频很大，不必每次整包重压；直接一边读正在变化的微信目录、一边上传又可能混进不同时间的文件。先建立一份可逐文件核对的本地副本，完整时才让其他副本跟上。",
    example: "我问“哪些微信文件已经在 G，旧文件会不会自己又回来”：工具回报已验的当前代与前一代，只有源根可访问且完整枚举时才传播精确删除；整个盘不见了则保留旧副本，不按空库清理。",
    result: "最近一次G盘成功记录说明已保存微信数据库、图片和音视频约45.42 GB。H盘9月23日已有完成点，但早于这份新Hot；微信Drive上次任务失败且未发起该次上传，云端实际最新内容尚未联网确认。文件齐全不等于微信客户端一定能读回聊天。",
    problem: "避免大体积微信数据阻塞配置包，也避免每次全量重传；同时防止只看任务名称或目录存在就误以为最近热备一定完成。",
    readerStates: {
      "pass": "本机文件完整核对后才设为当前备份，留一份前一版本；云端另从这份已验材料复制。",
      "problem": "云端单次流量达到上限时报告未传完，等后续任务或明确补齐；旧本机副本仍保留。",
      "unavailable": "来源磁盘读不全或目标不可达时不按空目录传播删除，也不把这次复制说成完整成功。"
    },
    decisionImpact: [
      "9月24日Hot代约45.42GB，仍采用文件级候选，不为每次增量重新压缩整个媒体库。",
      "Hot/Local 先建立独立候选再校验切换，旧成功代保留；可复用的硬链接只来自已验备份，不能把活动原件硬链接进去。",
      "Drive 先复制并核对当前本地成功集合，再在相同过滤范围内删除旧对象并严格复验；快照失败不进入云端写入，DbOnly 不清理已有媒体。",
      "默认 -MaxTransfer 8G 只限制一次脚本进程；WeChatBackup-Drive-Weekly 最多可任务级重试 5 次，每次重新获得自己的单次额度，所以累计流量和云空间仍要另看。",
      "WAL、SHM和journal继续随数据库保留。默认隐藏Hot带UseVss，只有快照真实创建并按它取数才写vss_crash_consistent；手动不带该参数明确写live_source，二者都不宣称应用一致性。",
      "Hot 成功后原子写入并回读有界 JSON 回执；PCConfig 只在回执目标匹配且不超过 36 小时时接受微信热备前置条件。",
      "WeChatDrive-Monitor-Hourly 仅用于首次补齐，当前已禁用；正常运行依赖 Hot 日任务和 Drive 周任务。"
    ],
    implementation: [
      "Backup-WeChat.ps1 支持 -Target Hot、Local、Drive；Drive 默认上传完整原应用数据，-DbOnly 只传 db_storage，-DriveFull 可覆盖该兼容开关回到完整范围。",
      "-MaxTransfer 0 会关闭单次 8G 上限，只适合明确的一次性补齐并由人持续看进度；常规定时任务保持默认上限。",
      "wechat.hot-backup-receipt.v2 绑定完整 manifest、generation、数量/字节、sha256_full_tree 与 source_follow_verified，输出不含聊天文件名和正文；状态读取回执而非重新哈希整库。",
      "WeChat-Recovery.Common.ps1 负责路径规范化、目标/进程检查、复制与回滚；WAL/SHM/journal 的保留来自备份过滤规则，而不是这个恢复模块定位数据库。",
      "Monitor-WeChatDrive.ps1 监控云端传输状态并在无活跃进程时自动续传，通过 rclone check 闭环后自我禁用。",
      "tests/Assert-WeChatIncrementalIntegrity.ps1 验证 checksum 内容变化用例，并静态检查流量上限、WAL/SHM 不被过滤和 Hot 回执字段。"
    ],
    flow: [
      "微信Hot隐藏任务以当前用户Highest启动，并传入-Target Hot -UseVss；先创建受约束的时点副本，再从该副本捕获。",
      "复制到独立候选，核对完整文件集合与 SHA-256；仅使用已验备份作为可复用字节来源。",
      "源根仍可用且集合完整时切换当前与前一成功代，发布 v2 Hot 回执；读不完整或切换失败保留旧成功状态。",
      "周日 20:00 唤醒 WeChatBackup-Drive-Weekly。",
      "按远端 binding 锁定本地成功快照，复制、核对后在同过滤范围清旧并复验；不直接边读活动微信边上传。",
      "默认传完整原应用目录；临时 -DbOnly 只传 db_storage，会失去媒体完整性。仅明确人工补齐时可用 -MaxTransfer 0 关闭单次上限。",
      "达到单次流量上限时记录未完成，不发布全量成功；正常完成还需严格集合/内容比对，之后的任务重试仍单独累计流量。"
    ],
    concepts: [
      { term: "File-by-File Incremental（逐文件增量）", explanation: "针对已压缩的多媒体大目录，按单个文件比对哈希只传变动文件，避免整包重新打包。" },
      { term: "Transfer Fuse（流量保险丝）", explanation: "限制一次 Backup-WeChat 进程的传输量；它不限制多次计划任务重试的累计流量，也不保证云盘总空间够用。" },
      { term: "WAL Co-preservation（预写式日志伴生保全）", explanation: "SQLite WAL 模式下可能有已提交事务尚未合并进主库，因此 -wal、-shm 和 journal 不应被备份过滤；一起复制仍不保证运行中快照一致。" },
      { term: "Bounded Hot Receipt（有界热备回执）", explanation: "用完整集合清单、代号、数量与全树哈希验真状态说明这次保全边界；不输出聊天正文，也不证明微信已成功登录。" }
    ],
    boundaries: [
      "原应用数据采用文件级增量；源可用且集合完整时传播实际删除，源根离线、无法读全或身份不符不当作空源。",
      "默认单次调用设置 8G 传输上限；任务重试的累计流量另算，-MaxTransfer 0 仅供人工看守的一次性补齐。",
      "-DbOnly 只是临时省流量模式，只保留 db_storage；它不能冒充包含图片、视频等媒体的完整原应用备份。",
      "伴随保留SQLite WAL与SHM；VSS只证明文件系统时点，手动live_source还可能跨时刻读取。两条路线均需实际微信客户端恢复验收。"
    ],
    failures: [
      { condition: "单次上传达到 -MaxTransfer 8G 上限", response: "rclone 停止本轮继续传输并把非完成结果交给任务；后续任务可继续，但总云空间与累计流量仍需单独观察。" },
      { condition: "robocopy 遇到占用、目标空间不足或其他错误并返回 8 以上", response: "本轮 Hot 失败且不发布新的 complete 回执；旧热备不删除，下一次任务再补。" },
      { condition: "云端目标路径不可达或网络中断", response: "保留本地静态副本并让 Drive 任务返回失败；当前小时监控已禁用，正常重试来自已登记的任务策略。" }
    ],
    sources: [
      { path: "Backup-WeChat.ps1", role: "微信原生应用数据增量备份主流水线" },
      { path: "G:\\80_Backup\\ControlPlane\\wechat-hot-last.json", role: "不含文件名或正文的微信 Hot 完成回执，供 PCConfig 冷备前置检查" },
      { path: "WeChat-Recovery.Common.ps1", role: "微信恢复路径、客户端状态、本地复制与失败回滚通用模块" },
      { path: "Monitor-WeChatDrive.ps1", role: "首次云端补齐期间的临时续传监控；完成后禁用，当前并非常规运行任务" },
      { path: "tests/Assert-WeChatIncrementalIntegrity.ps1", role: "checksum 内容变化 fixture、Hot 回执字段和部分静态接线检查" },
      { path: "tests/Assert-CloudBackupIntegrity.ps1", role: "远端对象核对与 WAL/SHM/journal 未被过滤的静态合同" }
    ],
    verification: [
      "当前来源回归覆盖微信候选、保留与同名内容漂移；网页本轮没有重新执行源测试或修改原应用数据。",
      "8G 上限、DbOnly/DriveFull 范围与 WAL/SHM 保留只有脚本/静态合同证据；本轮没有真的传满 8G，也没有运行 SQLite 一致性测试。",
      "9月18日历史Hot为145,307文件、45,218,959,121字节，当时PCConfig对G/H全量验真并修复53个同大小/时间的冷备差异；9月22日下一代为145,473文件、45,413,770,744字节。9月24日现存Hot为145,544文件、45,422,871,529字节，生产者报告VSS与全树验真；9月23日H完成回执较旧，本轮未重哈希或同步。",
      "本轮 Backup-Status -NoDrive 消费 wechat.hot-backup-receipt.v2 的完整集合和保留结果；同次状态见微信Drive最近任务9月20日因本地复制哈希不符失败、该次上传未请求。没有读取聊天正文、访问云端或把生产者此前验真冒充这次重新计算。",
      "云端最后成功采用已发布来源验收与当前小回执；网页没有重列微信远端对象、执行 rclone check 或登录客户端。"
    ],
    searchAliases: [
      "微信备份",
      "xwechat_files",
      "微信逐文件增量",
      "rclone checksum微信",
      "微信8G流量熔断",
      "SQLite WAL伴生文件",
      "WeChatBackup-Hot-Daily"
    ],
    searchProjection: {
      intents: [
        "微信几十个G的数据怎么每天快速备份到网盘",
        "微信备份为什么不用zip打包压缩",
        "正在聊微信时备份会不会导致数据库损坏",
        "微信单次8G上限和计划任务累计流量怎么算",
        "DbOnly为什么不能算完整微信备份"
      ],
      entities: [
        "Backup-WeChat.ps1",
        "xwechat_files（9月24日Hot回执45.42 GB）",
        "wechat.hot-backup-receipt.v2",
        "robocopy /E 静态快照",
        "rclone copy --checksum",
        "-MaxTransfer 8G 保险丝",
        "SQLite .db / -wal / -shm",
        "Monitor-WeChatDrive.ps1"
      ],
      relations: [
        "robocopy先向本地和G盘刷新静态快照",
        "rclone按checksum向Drive增量传输新增文件",
        "Hot成功后发布无文件名和正文的回执供PCConfig核对",
        "Monitor-WeChatDrive只在首次补齐期间使用并在完成后禁用"
      ],
      failureRecovery: [
        "每次进程达到8G上限停止但任务重试累计流量另算",
        "SQLite WAL伴生文件不被过滤但运行中复制仍不是一致快照"
      ]
    }
  },
  {
    slug: "recovery-and-tasks",
    usageEntry: "在已接入的 AI 对话中说“先预检这份 DevConfig 包恢复到新电脑”；微信恢复须另外指明原件和目标。",
    usageInputs: ["完整日期包及附属清单", "新机用户名和应用目录", "目标已有文件及想恢复的范围"],
    productFlow: [
      {
        "title": "确认这份包能用在新电脑",
        "detail": "先只读核对包与随附清单，再将旧机路径映射到新机真实用户和软件目录。"
      },
      {
        "title": "保留当前目标后选择回填",
        "detail": "明确执行和覆盖范围时解到独立目录，再逐项映射配置；微信目标非空须有回滚副本并确认客户端关闭。"
      },
      {
        "title": "逐应用重建",
        "detail": "按当前 PCConfig 手册重建任务并检查软件加载和微信登录；包完整不证明任务或应用已经可用。"
      }
    ],
    readerStatus: "配置包在独立目录还原并逐文件核对已有验收；完整新机、软件登录和微信实际使用仍未验收。",
    shortTitle: "重装恢复与调度",
    title: "选择性换机恢复、微信回滚点与事务化任务重建",
    teaser: "配置包先核验再隔离解包，微信先预检再明确回填；已有目标和任务定义都留恢复前像，应用登录另验。",
    status: "配置包隔离解包全树哈希已由来源验收；默认预检与任务恢复边界已实现，完整新机和微信应用仍未验收",
    statusTone: "warn",
    relation: "把备份材料变成一套可以逐层检查的恢复顺序；它负责工具脚本，机器路径、任务恢复次序和 H 盘冷备仍由 PCConfig 决定。",
    value: "真正出事时，包旁边的哈希与清单就能帮助检查，不必再找丢失电脑里的 state。先预览恢复计划，再解到空目录或明确替换并留回滚点，随后按 PCConfig 重建机器路径和任务；状态窗口能看过程，但关闭窗口不算取消实际备份。",
    why: "新装机最容易乱的是恢复顺序，以及旧配置仍指向原机器的位置。新用户名、Documents目录或盘符不同本身不是故障，直接照搬旧绝对路径才会让软件读错位置；微信覆盖非空目标还可能冲掉新数据。",
    example: "比如我换到一台干净电脑：AI先按清单补软件，并和PCConfig核对新机实际用户、Documents与应用目录，再把兼容配置映射过去并检查是否加载。只有我选择沿用原布局才恢复E盘指向；微信仍先预检、保留目标，实际登录后验收，旧任务逐项重建。",
    result: "得到一份先检查、再选择、最后逐应用试用的换机恢复计划。包能解开只证明文件在，不代表新机登录、微信历史和自动任务都已恢复。",
    problem: "防止重装新系统后盲目覆盖导致已有数据丢失，防止因 Documents 路径或用户名不一致导致软件配置失效。",
    readerStates: {
      "pass": "选中配置包先完整核对，再恢复到独立目录；应用与自动任务实际可用另行确认。",
      "problem": "旧路径指向不存在的用户或目录时按新电脑实际位置调整；微信目标有文件先保留可回退副本。",
      "unavailable": "清单缺失、文件损坏、来源与目标重叠或微信仍在运行时停止写入，不暗中换包或覆盖。"
    },
    decisionImpact: [
      "README 用 7 个阶段组织恢复：装基础工具、取包、补软件、选择性回填配置、逐项恢复系统设置、处理微信、最后重挂任务与远端。",
      "原机“文档”位于E:\\Documents，这是备份事实。新机先读取实际Documents位置并映射配置，只有明确保留旧布局时才重定向到E，不能把旧盘符当作恢复前提。",
      "原机用户名为10979；新机可以采用不同用户名。AI按实际用户根有界更新已知旧路径并回读，保留原文件和未解决映射，不要求本人逐条手改。",
      "Restore-WeChat.ps1 默认只读预检，显式执行时目标非空必须强制生成 .pre-restore-* 回滚目录。",
      "标记状态 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，由用户登录官方客户端确认历史，绝不用脚本退出码冒充恢复。",
      "四个常规任务的 Action 固定为 wscript.exe；隐藏 VBS 优先 PowerShell 7，找不到才用 Windows PowerShell 5.1。独立临时监控安装器才固定 5.1。"
    ],
    implementation: [
      "Restore-DevConfig 默认 Plan，要求 package-receipt.v2、payload-manifest.v1、包 SHA-256、内部路径和 manifest；Execute 先解到独立 incoming 并全树核对，才保留旧目标并切换。Restore-WeChat 另有客户端与原生目录约束，DriveOnly 仍需真实联网恢复验收。",
      "路径检查拒绝盘符根目录、source/target 相同或互为父子目录，以及任一路径或父级上的 reparse point（重解析点）。",
      "Setup-ScheduledTasks.ps1与ScheduledTask-Registration.Common.ps1支持只收敛选定的已登记任务，保留既有时序和设置；微信Hot使用当前交互用户Highest，其余Limited。临时小时监控仍由独立安装器管理，本轮未重装任何任务。",
      "注册器先拒绝别人的同名任务，保存精确 XML、动作与启停前像；任何更新或回读失败按原定义恢复，用户原来暂停的任务不能被重新启用。",
      "Hidden VBS 启动脚本（Backup-DevConfig-Hidden.vbs 等）隐藏黑框并完整保留并透传退出码。",
      "恢复测试分别验证包哈希/清单、危险路径、替换前像、逐文件内容与应用验收状态；源码回归、源 Owner 隔离恢复和网页本轮只读状态三个证据层互不替代。"
    ],
    flow: [
      "先准备Git与DevConfig源码，再按Git总索引和目标机器找到PCConfig的实际规范位置，取得获准的恢复指南。原机E:\\PCConfig只是路径线索；暂时缺这份资料只暂停依赖它的机器配置、任务与H冷备步骤。",
      "选择带对应 .sha256、.receipt.json、.manifest.json 的成功日期包；运行 Restore-DevConfig 默认只读核验，不再依赖原电脑 state/latest.sha256，散失附属文件的旧包不能冒充完整恢复集。",
      "明确 Execute 后解到独立目录并逐文件核对；需要替换非空目标时先指定 ReplaceExisting，原目标保留。再按软件清单补齐可下载组件，不自动导入所有旧系统配置。",
      "按新系统和应用版本，把home/、appdata-roaming/、appdata-local/与extra/Scoop-persist/映射到目标机器实际目录；AI核对Documents、用户名和盘符差异，处理已知引用后再看应用是否正常加载。",
      "环境变量、Xshell、Wi-Fi、hosts和任务按实际PCConfig根内docs/recovery/START_RECOVERY.md与scheduled_tasks_rebuild.md逐项处理；先运行现有任务重建计划检查，不通配导入旧XML，也不照搬原机盘符。",
      "微信先用默认 G 源或明确的 -BackupRoot 本地/USB 目录做只读预检；确认路径与客户端状态后才 Execute，最后登录官方客户端验收。-DriveOnly 仍是未完成真实联网验收的兼容路径。",
      "Local 打包时会把已有的 state/rclone-remote-binding.json 复制进包内 _manifests（只含非秘密别名，不含 OAuth/token）。新机重新执行 rclone config 后，再把这份别名选择回填到 state，运行 Setup-ScheduledTasks.ps1 并逐项查看四任务状态。"
    ],
    concepts: [
      { term: "Idempotent Task Registration（幂等任务注册）", explanation: "无论运行多少次，只更新或确保计划任务处于正确配置，不产生重复实例或脏状态。" },
      { term: "Human Acceptance Gate（人工在场验收门）", explanation: "对于专有通讯软件，文件拷贝完成不等于数据可用，必须由真人登录官方应用最终确认。" },
      { term: "Pre-restore Rollback（恢复前回滚隔离）", explanation: "在写入前把已有目标移到 .pre-restore-*；若复制失败，部分结果再移到 .failed-restore-*，随后尽力把原目录恢复。" }
    ],
    boundaries: [
      "新电脑恢复先核对实际用户、Documents与应用目录；原机E盘和10979作为旧路径线索，恢复任务负责映射与回读，不能把保持旧布局设为默认要求。",
      "严禁通配批量导入历史任务计划 XML，必须按 PCConfig 重建手册逐项核对。",
      "Restore-WeChat.ps1 在未经用户显式确认官方微信关闭前严禁写入，目标非空必须保留回滚副本。",
      "备份源与目标不能是盘根、同一路径、互为父子目录或经过重解析点；这些条件任何一个不清楚就不执行。",
      "-DriveOnly 只说明存在兼容实现，本轮没有真实联网下载恢复证据，不能替代已验的本地/G 路线。",
      "随包强哈希缺口已解决，但恢复者必须带走同一代必要文件并完整核验；7z CRC、文件名或单份旧 state 不代替成功回执与全树清单。",
      "文件复制完成仅标记 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，严禁冒充微信恢复成功。"
    ],
    failures: [
      { condition: "恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting", response: "脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。" },
      { condition: "源与目标重叠、互为父子目录、指向盘根或路径链包含重解析点", response: "预检直接拒绝；不会靠猜测选择 USB、Drive 或另一个目录。" },
      { condition: "已把旧目标移到 .pre-restore-* 后复制失败", response: "部分结果移到 .failed-restore-*，再恢复原目录；若回滚自身也失败，同时报告原始错误和回滚错误。" },
      { condition: "旧配置引用的用户名或Documents路径在目标机器上不可用", response: "当前恢复任务通过PCConfig确认实际路径并处理已知引用，回读应用加载情况；不要求改成旧盘符，未能确定的精确目标才交本人决定。" },
      { condition: "目标同名任务不是本项目的隐藏启动器", response: "注册器拒绝覆盖；不会为了让测试变绿接管别人的任务。" },
      { condition: "四个任务更新到一半失败或最终回读不一致", response: "注册器用执行前抓取的精确 XML 恢复原任务；新建任务也只有在仍匹配本次定义时才撤销。" },
      { condition: "PowerShell 7 不在 Program Files 固定路径", response: "隐藏 VBS 在启动前选择 Windows PowerShell 5.1；这是真实启动分支，不是任务运行失败后的二次重试。" }
    ],
    sources: [
      { path: "Restore-WeChat.ps1", role: "微信灾难恢复总线，提供只读预检与回滚保护" },
      { path: "WeChat-Recovery.Common.ps1", role: "路径规范化、盘根/重叠/重解析点拒绝、客户端进程检查、复制与失败回滚" },
      { path: "Setup-ScheduledTasks.ps1", role: "Windows 任务计划程序常规任务幂等注册器" },
      { path: "ScheduledTask-Registration.Common.ps1", role: "任务计划 XML 解析与安全注册通用逻辑" },
      { path: "tests/Assert-WeChatNativeRecovery.ps1", role: "预检、回滚与人工验收状态断言自动化测试" },
      { path: "tests/Assert-ScheduledTaskRegistrationSafety.ps1", role: "任务注册事务性与执行器路径安全测试" },
      {
        "path": "Restore-DevConfig.ps1",
        "role": "可携带恢复集只读核验、独立目标解包、全树比对与原目标保留"
      },
    ],
    verification: [
      "9 月 18 日来源验收已执行配置包隔离恢复，8,640 文件、8,531,705,353 字节的全树 SHA-256 一致；没有据此声称微信官方客户端已恢复。",
      "当前源测试覆盖任务所有权、精确前像、失败回滚和恢复合同；本轮只回读已发布证据，不重新注册或启停任何生产任务。",
      "本轮没有在干净 Windows 上导入注册表、Wi-Fi 或整套任务，也没有测量恢复耗时。"
    ],
    searchAliases: [
      "新机恢复指南",
      "重装两大陷阱",
      "原机Documents在E盘",
      "原机10979用户名",
      "Restore-WeChat.ps1",
      "Setup-ScheduledTasks.ps1",
      "wscript隐藏启动PowerShell7与5.1回退"
    ],
    searchProjection: {
      intents: [
        "新电脑怎么按顺序一步步把备份还原回去",
        "重装后为什么Xshell和Navicat配置都是空的",
        "微信恢复时怎样防止覆盖掉已有的新消息",
        "为什么计划任务不能用微软商店版pwsh"
      ],
      entities: [
        "Restore-WeChat.ps1",
        "Setup-ScheduledTasks.ps1",
        "ScheduledTask-Registration.Common.ps1",
        "原机E:\\Documents与新机目录映射",
        "旧用户名10979的路径映射",
        ".pre-restore-* 回滚目录",
        "wscript.exe + PowerShell 7 / 5.1 fallback"
      ],
      relations: [
        "Restore-WeChat默认只读预检并在-Execute时回填微信",
        "Setup-ScheduledTasks事务化注册4个常规任务且失败恢复原定义",
        "新机恢复按7阶段说明选择性回填并处理Documents和用户名路径"
      ],
      failureRecovery: [
        "目标非空时强制保留为.pre-restore-*回滚备份",
        "隐藏VBS启动前优先PowerShell7且缺失时选择5.1"
      ]
    }
  }
];

export const project = devconfigBackupProject;
export const modules = devconfigBackupModules;
