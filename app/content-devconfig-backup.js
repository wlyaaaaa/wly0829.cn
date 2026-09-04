import { createProjectSnapshot } from "./project-snapshot.js";

const devconfigBackupSnapshot = createProjectSnapshot({
  observedAt: "2026-09-04T17:03:00Z",
  label: "本地与 G 盘最近成功；配置 Drive 日任务失败后探针已恢复，但远端仍落后一代；H 当前不可用并正常跳过",
  boundary: "这是 PUBLIC（公开）源码、任务与备份元数据的只读核对。当前包、G 盘和探针结果不等于新电脑已恢复，也不等于 Drive 已补齐或 H 冷备已完成",
  metrics: [
    { label: "当前配置包", value: "1,911.3 MB" },
    { label: "G 盘微信热备", value: "41.89 GB" },
    { label: "本仓库四任务", value: "3 成功 · 1 失败" },
    { label: "临时云监控", value: "已禁用" }
  ],
  facts: [
    { label: "它真正解决的事", value: "真到重装或换机时，不必再去几十个工具目录里考古。它把 AI 工具配置、GPG（GNU 隐私保护）私钥、SSH（安全外壳协议）会话、环境变量、编辑器设置和重装清单收成一份恢复候选包；当前包为 1,911.3 MB。安装本体、插件、node_modules（代码依赖包）和常见缓存继续排除，恢复时再按版本、兼容性和现场状态选择性回填。" },
    { label: "分层介质与职责分工", value: "本地生成 out\\devconfig-*.zip；G:\\80_Backup\\DevConfig 是日常在线热备，最近一次 Local/Hot（本地/热备）任务成功。本地与 G 盘各留 7 份日期包和 latest.zip。配置 Drive 日任务最近返回 1；当前只读探针已可达，但远端 latest 仍是 9 月 2 日，本地/G 已到 9 月 3 日。本仓库不直写 H；PCConfig 的 AIRecoveryColdSync-Daily 会在每日窗口机会式检查，只有 H 人工解锁且所有前置门通过才复制。" },
    { label: "清单数据驱动与避坑边界", value: "备份项由 sources.psd1（PowerShell 数据文件）声明式驱动，不动脚本。它按明确路径取 PowerToys 配置、FinalShell conn\\、PixPin Config、JetBrains 设置和 Docker CLI/Desktop 小配置，排除安装本体、截图历史、插件/JDBC（数据库驱动）、规则数据库、VHDX 虚拟磁盘、镜像层与容器运行态；源码 README 中的体积对比只作早期选型说明。" },
    { label: "系统导出与重装清单自动生成", value: "备份运行时现生成注册表环境变量（用户+机器）、机器 PATH（系统路径）、20+ 自定义计划任务 XML、hosts、Wi-Fi 配置文件（含密码）与 Xshell 注册表；同时导出 scoop、winget、VS Code / Cursor / JetBrains 插件列表，让可重下内容一条命令补回。" },
    { label: "微信原应用数据独立增量流水线", value: "当前 G 盘有 41.89 GB、142,693 个微信原应用文件。Backup-WeChat.ps1 用 robocopy（Windows 健壮文件复制工具）先刷新静态副本，再让 rclone copy --checksum（按内容校验）只传变化文件；8G 单次传输上限避免一次异常重传失控，SQLite（轻量嵌入式数据库）的 WAL（预写式日志）、SHM（共享内存索引）和 journal 伴生文件不会被过滤，但运行中复制仍不等于数据库一致快照。" },
    { label: "微信热备给冷备留下可核对交接单", value: "G 盘热备成功后会原子写入并回读 wechat.hot-backup-receipt.v1 回执，只记录完成时间、目标绑定、robocopy 退出码和排除项数量，不输出文件名或正文。PCConfig 用不超过 36 小时的回执判断热备够不够新，再决定人工冷备窗口能否继续。" },
    { label: "新机恢复先看现场再动手", value: "Restore-WeChat.ps1 默认只读预检；确认官方客户端关闭后才显式执行。目标非空时必须选择 -ReplaceExisting，原目录会先保留为 .pre-restore-* 回滚点。复制结束只返回 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE（复制完成待人工验收），还要登录官方微信确认历史。Documents 需要重新指向 E:\\Documents；用户名可以沿用 10979，也可以在恢复后重映射硬编码路径。" },
    { label: "四个常规任务，临时监控已经退场", value: "当前四个常规任务都已注册：配置本地/G 盘、配置 Drive、微信 G 盘和微信 Drive；最近结果是 3 个成功、配置 Drive 1 个失败。用于首次云端补齐的 WeChatDrive-Monitor-Hourly 不是第五个常规任务，当前已禁用；无窗口 Drive 任务会继承当前用户的 Windows 代理，失败时返回非零交给任务重试。" }
  ],
  gaps: [
    "最近一次 DevConfigBackup-Drive-Daily 返回 1；2026-09-04 17:31Z 只读预检已经恢复可达，但远端 latest 仍对应 9 月 2 日完整包，比本地/G 的 9 月 3 日新代落后一代。本轮没有上传或修改云端对象。",
    "8 个源码测试脚本通过，但本轮因官方微信正在运行，原生恢复测试的合成 Execute（执行）分支按设计跳过；测试不能替代真实恢复。",
    "微信备份的 rclone check 仅证明云端与本地文件哈希一致，不证明运行中复制时微信无底层未提交写入，也不替代官方微信客户端实际登录检验。",
    "系统导出的 20+ 计划任务 XML 严禁在新电脑通配批量导入，必须配合 PCConfig 重建手册与验证工具逐项审查恢复。",
    "PCConfig 的 AIRecoveryColdSync-Daily 已启用；最近一次因 H_unavailable 返回 skipped。H 人工解锁后仍要满足 Hot context 不超过 48 小时、DevConfig/微信热备各不超过 36 小时、介质身份、100 GiB 停写线和写锁等条件。"
  ]
});

export const devconfigBackupProject = {
  order: 12,
  slug: "devconfig-backup",
  title: "DevConfig Backup",
  kicker: "开发配置、微信热备与选择性换机恢复 · 2026-09-04 核对",
  route: "/projects/devconfig-backup",
  visibility: "公开仓库",
  statusTone: "warn",
  cardStatus: "本地/G 最近成功；Drive 可达但落后一代，H 当前不可用并跳过；完整换机未实机验收",
  cardStatusTone: "warn",
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
      "换新电脑一键恢复开发配置和微信数据",
      "只备份不可再生配置而不备份几十G插件和缓存",
      "把开发配置备份到本地和Google Drive云端",
      "微信几十G聊天记录和媒体怎么增量备份防丢失",
      "排查备份计划任务没有按时运行或代理连不上",
      "避免全盘镜像几十G的大垃圾",
      "重装系统后Documents路径和用户名坑怎么避开"
    ],
    entities: [
      "sources.psd1",
      "Backup-DevConfig.ps1",
      "Backup-WeChat.ps1",
      "Restore-WeChat.ps1",
      "Backup-Status.ps1",
      "Initialize-BackupNetwork.ps1",
      "rclone 1.68+",
      "robocopy",
      "G:\\80_Backup",
      "已绑定的 Google Drive remote alias（远端别名）",
      "xwechat_files（当前约 41.89 GB）",
      "SQLite WAL / SHM",
      "10979 用户名"
    ],
    relations: [
      "sources.psd1清单驱动Backup-DevConfig生成当前约1.91GB选择性恢复候选包",
      "本地out目录生成当前约1.91GB恢复候选包并复制到G盘在线热备",
      "DevConfig每个新代完整上传日期zip和latest对象，微信才用checksum逐文件增量",
      "Backup-WeChat通过robocopy快照和rclone逐文件增量备份当前约41.89GB微信数据",
      "微信G盘热备成功后发布无文件名和正文的有界回执供PCConfig判断冷备前置条件",
      "Restore-WeChat默认只读预检并在覆盖前生成回滚保护目录",
      "PCConfig统一管理H盘离线冷备，本项目计划任务只写本地与G盘，绝不接触或写入H盘"
    ],
    failureRecovery: [
      "Google Drive远端binding损坏或代理不可达时失败关闭并重试",
      "微信单次调用达到8G上限时停止但计划任务重试累计流量另算",
      "微信目标目录非空时拒绝直接覆盖并强制生成pre-restore备份",
      "wscript隐藏启动器优先Program Files下的PowerShell7且缺失时选择5.1",
      "换新电脑后重定向Documents至E盘且保持10979用户名防止路径失效"
    ]
  },
  repositoryNote: "devconfig-backup 是 PUBLIC（公开）工具仓库。仓库内严格禁止提交任何真实备份包、注册表敏感导出、密钥、微信数据库或运行日志；由 tests/Assert-NoBackupArtifacts.ps1 机械执行提交前安全门禁。",
  summary: "这是给系统重装和换机留后路的工具：它不做整机镜像，而是把难重建的开发配置、凭据、系统导出和安装清单收进恢复候选包，同时把当前 41.89 GB 的微信原应用数据放到独立增量通道。明显可重下的插件、依赖、缓存与 Docker 大盘继续排除，但当前配置包已是 1,911.3 MB，不能再沿用早期 65 MB 的宣传数字。",
  why: "电脑真坏时，安装软件并不难，难的是找回散在几十个目录里的配置、密钥、环境变量、Wi-Fi、终端会话和应用数据。这个项目把采集、打包、热备、云端尝试、任务重建和微信回填顺序写清并自动化；恢复时仍要按版本、兼容性和现场状态选择材料，不能把旧系统原样倒进新系统。",
  plainExample: "比如我准备重装电脑：先查看本地和 G 盘哪份包最新，再按清单装回软件、选择性回填 home 与 AppData、重新映射 Documents 和硬编码用户名；微信先跑只读预检，确认没有运行中客户端和覆盖冲突后才复制，最后由我登录官方微信验收。",
  result: "得到可核对的本地包、G 盘在线热备、独立的 Drive 路线、四个常规任务，以及微信热备回执和恢复前回滚点；哪一层失败就明确停在哪一层，不把文件复制、测试通过或绑定存在冒充整机恢复完成。",
  readerStates: {
    pass: "当前已证的是本地 1,911.3 MB latest.zip 与 G 盘配置/微信热备最近一次成功，微信热备回执回读为 complete；8 个源码测试脚本返回通过。",
    problem: "若 rclone 远端绑定损坏或网络代理不可达，Drive 任务将 fail-closed（失败关闭）并触发任务重试；若目标已存在非空微信目录，恢复脚本拒绝覆盖并强制生成 .pre-restore-* 回滚副本。",
    unavailable: "当 G 盘脱机、Google Drive 鉴权失效或本地目标磁盘写保护时，对应层返回未完成；H 未人工解锁时 PCConfig 日任务只写 skipped/H_unavailable，不尝试冷拷贝。"
  },
  dataSources: {
    title: "系统从哪里采集配置，如何保障边界安全",
    intro: "系统通过 sources.psd1 数据驱动清单枚举本机配置文件、注册表环境与系统配置，并调用 rclone/robocopy 执行分层分发；公开仓库绝不包含任何真实备份包、密钥、注册表导出或聊天数据库。",
    rows: [
      { source: "用户主目录与 AppData（sources.psd1）", data: "按清单采集 .gnupg、.docker、AI/Agent 配置、VS Code/JetBrains 用户设置与终端会话；剔除 node_modules、缓存与 plugins。", result: "最近一次 History=False 任务从 5,657.16 MB staging 生成 1,911.3 MB 包；它是较完整的恢复候选，不是固定数十 MB 的极简包。" },
      { source: "Windows 系统注册表与网络配置", data: "运行时导出 HKCU/HKLM 环境变量、系统 PATH、白名单计划任务 XML、Wi-Fi 配置文件（含密码）与 Xshell 注册表。", result: "这些材料供恢复时逐项核对并导入；计划任务 XML 不能通配批量恢复。" },
      { source: "包管理器与扩展导出清单（_manifests）", data: "现场执行 scoop export、winget export、code --list-extensions 与已安装软件注册表枚举。", result: "生成重装补齐清单，让可重下内容一条命令批量装回，无需把安装包打进备份。" },
      { source: "微信原生应用目录（xwechat_files）", data: "当前 G 盘副本为 41.89 GB、142,693 个文件，包含数据库、图片与音视频媒体，WAL/SHM/journal 伴生文件不被过滤。", result: "G 盘热备成功后还会发布不含文件名或正文的回执；Drive 路线按内容 checksum 逐文件同步，并有 8G 单次传输上限。" },
      { source: "rclone 远端配置与 Windows 代理环境", data: "读取非秘密的 rclone-remote-binding.json 绑定固定远端别名，无窗口任务继承当前用户系统代理。", result: "绑定损坏时不会改投其他远端；最近日任务虽失败，当前只读预检已恢复，但远端 latest 仍落后本地/G 一代。" }
    ],
    note: "本仓库严格遵守公开安全红线，所有 out/、staging/、state/、logs/ 目录与 *.zip、*.reg、*.kdbx 敏感文件均受 .gitignore 与 Assert-NoBackupArtifacts 机械保护。"
  },
  responsibilities: [
    "负责从 sources.psd1 数据驱动采集开发配置、凭据与系统设置；当前生成约 1.91 GB 的选择性恢复候选包。",
    "负责本地 out/、G 盘 80_Backup 在线热备与 Google Drive 云端的多级分层分发与双重校验和核对。",
    "负责当前约 41.89 GB 微信原应用数据的独立逐文件增量备份、8G 流量保险丝、SQLite 伴生文件保留和不含正文的热备回执。",
    "负责提供新电脑重装 7 步恢复流水线、两大陷阱避坑防范与微信只读预检回滚机制。",
    "负责 Windows 计划任务的事务化注册、wscript 隐藏启动、PowerShell 7 优先/5.1 回退与无窗口网络代理继承。"
  ],
  exclusions: [
    "不备份软件安装本体、IDE 插件二进制（如 JetBrains 10.6GB plugins）、npm 全局包或 node_modules 等可重下内容。",
    "不将 Docker Desktop 的 VHDX 虚拟磁盘（如 docker_data.vhdx）、镜像层或容器运行态数据库打入配置包。",
    "本仓库脚本与四个任务不写 H；PCConfig 日任务只在人工解锁窗口且新鲜度、介质、容量和写锁门通过时执行冷拷贝。",
    "不把 rclone 或 robocopy 复制成功冒充微信官方客户端已经验收通过，不自动关闭或启动官方微信。",
    "公开 Git 仓库绝不收纳任何真实 zip 包、注册表敏感导出、API Key、GPG 密钥或微信聊天数据。"
  ],
  productPrinciples: [
    {
      title: "优先保留难重建资产，也接受有价值的恢复状态",
      detail: "可重新下载的软件安装包、VS Code/JetBrains 插件、npm 模块和常见缓存继续剔除；AI 工具配置、Scoop persist 与其他恢复状态会随实际使用增长。当前包约 1.91 GB，价值在于边界清楚、可选择性恢复，不以追求某个固定小体积牺牲可用材料。"
    },
    {
      title: "分层存储各司其职，冷热严格隔离",
      detail: "本地包零流量保底，G 盘承担日常在线热备，Google Drive 提供异地副本。H 平时不可用；用户人工解锁后，PCConfig 的日任务才会在新鲜度、介质、容量与写锁门通过时机会式复制，本仓库任务本身不写 H。"
    },
    {
      title: "微信数据独立通道，增量兼顾一致性",
      detail: "当前约 41.89 GB 微信数据以媒体为主，整包反复压缩收益低，因此采用 robocopy 静态副本结合 rclone checksum 逐文件增量；WAL/SHM/journal 不被过滤，8G 上限约束单次传输，但这些都不把运行中副本升级成一致数据库快照。"
    },
    {
      title: "恢复默认只读预检，绝不盲目覆盖",
      detail: "灾难恢复时 Restore-WeChat.ps1 默认仅输出只读环境检查，显式执行时若目标非空强制留存 .pre-restore-* 回滚目录；执行完毕标记待人工验收状态，由用户登录官方客户端确认历史，绝不用脚本返回值冒充业务恢复。"
    }
  ],
  glossary: [
    { term: "rclone（云同步工具）", meaning: "支持多云存储协议的命令行同步工具。配置包按新代完整上传两个 zip 对象；微信才是逐文件 checksum 增量。" },
    { term: "robocopy（Windows 健壮文件复制工具）", meaning: "Windows 自带的多线程文件复制工具；本项目用于采集目录，并为微信 Hot/Drive 路线复制新增和变化文件。配置 zip 到 G 盘使用的是 Copy-Item。" },
    { term: "checksum（校验和）", meaning: "基于文件内容的哈希计算值；rclone 通过比对内容哈希决定是否传输，避免单纯依赖修改时间导致漏传或重复上传。" },
    { term: "WAL（Write-Ahead Logging，预写式日志）", meaning: "SQLite 可能把尚未合并进主库的已提交事务放在 -wal 文件里；备份规则不应过滤它，但运行中逐文件复制仍可能跨越不同写入时刻。" },
    { term: "SHM（Shared Memory，共享内存索引）", meaning: "SQLite 在 WAL 模式下使用的共享内存索引文件；本项目不将它排除，但是否可由客户端使用仍需恢复验收。" },
    { term: "fail-closed（失败关闭）", meaning: "当环境出现不可预期故障（如 binding 文件损坏、代理不可达、目标已存在非空文件）时，系统立即安全退出并阻断写入，绝不盲目降级。" },
    { term: "binding（远端别名绑定）", meaning: "保存在本地非秘密 state 中的 rclone remote 别名映射；确保云端同步只传向用户指定的准确云盘，严禁 fallback（降级）到默认第一个远端。" },
    { term: "BitLocker（Windows 驱动器加密）", meaning: "Windows 原生全盘加密技术；本项目冷备介质 H 盘默认处于锁定状态，防止物理介质丢失造成敏感凭据泄露。" },
    { term: "Task Scheduler（Windows 任务计划程序）", meaning: "Windows 系统内置的定时任务管理服务；当前驱动四个常规备份任务。首次云端补齐监控是独立临时任务，当前已禁用。" }
  ],
  operatingFlow: [
    { title: "每日定时采集与精选打包", detail: "每晚 21:05 计划任务唤醒 Backup-DevConfig.ps1，按 sources.psd1 复制不可再生文件，现生成注册表与任务 XML，调用 7-Zip 打成 devconfig-YYYYMMDD-HHMMSS.zip 并生成 latest.zip。" },
    { title: "零流量本地与 G 盘热备落盘", detail: "本地与 G:\\80_Backup\\DevConfig 各保存 7 份日期包和 latest.zip；微信另由 Hot 日任务增量到 G:\\80_Backup\\WeChat\\xwechat_files，全程不依赖外网。" },
    { title: "夜间上传一个完整新代", detail: "每次 Local 都因时间戳与 MANIFEST 生成新 zip 和 SHA-256；22:00 的 Drive 任务通常完整上传日期包与同内容 latest.zip，再逐个核对大小和 MD5。只有同一代、同一目标对象已经核对一致时才跳过。" },
    { title: "新机按兼容性选择回填", detail: "从 G 盘或 Drive 取回 latest.zip 后，先看新系统与工具版本，再选择性回填 home/AppData；环境变量、Wi-Fi、Xshell 和任务按 PCConfig 恢复手册逐项处理，不把旧包整锅覆盖。" },
    { title: "微信数据预检与安全接管", detail: "运行 Restore-WeChat.ps1 只读检查，确认官方微信关闭后，显式执行回填；若目标已有数据自动备份为 .pre-restore-* 回滚目录，最后由人工启动微信确认历史。" }
  ],
  components: [
    { name: "Backup-DevConfig.ps1", responsibility: "配置采集、系统现导出、清单生成、7z 压缩打包与分层分发（Local/Hot/Drive）。", implementation: "兼容 PowerShell 5.1 与 7，支持 -Tier 组合；7z 非零会让本轮失败、保留旧包并跳过分发，不把警告码装成成功。" },
    { name: "sources.psd1", responsibility: "配置采集与排除规则的数据驱动清单，定义散件、各工具目录、避坑黑名单与计划任务白名单。", implementation: "受限 PowerShell 数据文件，纯声明式数组与哈希表，修改无需变动脚本逻辑。" },
    { name: "Backup-WeChat.ps1", responsibility: "当前约 41.89 GB 微信原应用数据的独立增量备份流水线，支持 Hot（热备）与 Drive（云端）。", implementation: "封装 robocopy 静态副本与 rclone copy --checksum，内置 8G 单次传输上限；Hot 成功后发布并回读有界 JSON 回执。" },
    { name: "Restore-WeChat.ps1", responsibility: "微信原生目录的灾难恢复总线，提供默认只读预检、目标非空回滚保护与人工在场状态标记。", implementation: "多步安全校验，支持 -Execute 与 -ReplaceExisting，返回 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE。" },
    { name: "Initialize-BackupNetwork.ps1", responsibility: "为无窗口计划任务提供网络代理自动继承与 rclone 远端绑定安全解析。", implementation: "读取注册表系统代理配置，解析 rclone-remote-binding.json，提供 fail-closed 安全保障。" },
    { name: "Setup-ScheduledTasks.ps1", responsibility: "在 Windows Task Scheduler 幂等注册 4 项常规备份任务；临时小时监控由独立安装脚本管理。", implementation: "四个任务的 Action 是 wscript.exe；隐藏 VBS 优先调用 Program Files 下的 PowerShell 7，找不到时才回退 Windows PowerShell 5.1。当前临时监控任务已禁用。" },
    { name: "Backup-Status.ps1", responsibility: "本地、G 盘热备、Google Drive 远端与计划任务健康度的综合状态查询控制台。", implementation: "一键汇总各级备份文件大小、新鲜度、上次成功时间戳与最近运行日志。" },
    { name: "tests/ 自动化合同套件", responsibility: "检查 Git 文件候选、Docker allowlist、本仓库 H 目标、任务代理/事务注册、rclone 内容变化 fixture 和微信恢复保护。", implementation: "8 个 PowerShell 测试脚本；各自只证明对应断言，不证明真实灾难恢复、8G 传输或 SQLite 一致性。" }
  ],
  technicalContracts: [
    { artifact: "备份源与排除规则清单", schema: "sources.psd1 data format", owner: "sources.psd1", boundary: "声明 HomeFiles、HomeDirs、AppDataDirs、ExcludeDirs、ExcludeFiles 与 ScheduledTaskPatterns；禁止包含真实密钥正文。" },
    { artifact: "云端远端别名绑定记录", schema: "devconfig-backup.rclone-remote-binding.v1", owner: "rclone-remote-binding.json", boundary: "仅记录用户选定的 non-secret（非机密）rclone 远端别名，不展示具体私人 remote 名，也不包含 OAuth token 或凭据。" },
    { artifact: "本地最新打包哈希凭证", schema: "latest.sha256 format", owner: "Backup-DevConfig.ps1", boundary: "记录本次打包生成的 SHA-256 与带时间戳文件名，用来冻结本轮上传对象；它不是 zip 内部差量索引。" },
    { artifact: "云端上传完成状态凭证", schema: "devconfig.drive-upload-state.v1", owner: "last-uploaded.json", boundary: "记录已成功传至 Drive 的 SHA-256、远端别名、目录名、带日期包名与 latest_name；当前日任务失败时不能据此声称远端健康。" },
    { artifact: "微信 G 盘热备回执", schema: "wechat.hot-backup-receipt.v1", owner: "Backup-WeChat.ps1", boundary: "只记录完成时间、目标、robocopy 退出码和排除项数量，不输出 payload 文件名或正文；PCConfig 要求该回执不超过 36 小时。" }
  ],
  usageExamples: [
    { moduleSlug: "tiered-distribution", ask: "如果家里停网了，每天晚上的备份会怎样？", effect: "本地和 G 盘任务不依赖外网，仍可各自完成；Drive 任务不会拖垮它们，但会保持未完成或返回非零，等网络与远端恢复后由任务补跑。" },
    { moduleSlug: "tiered-distribution", ask: "为什么这个项目不直接往 H 盘写备份？", effect: "H 的解锁、介质身份、新鲜度、容量、写锁和冷拷贝都由 PCConfig 统一判断。它的日任务可以每天醒来检查，但 H 没在人工窗口解锁时只写 skipped；DevConfig 自己的任务从不碰 H。" },
    { moduleSlug: "source-catalog", ask: "JetBrains 和 VS Code 装了十几 G 插件，重装时也会打包进去吗？", effect: "不会把插件目录本体装进包；sources.psd1 排除 plugins/extensions，保留用户设置并导出插件清单，恢复时再按清单重新安装。" },
    { moduleSlug: "source-catalog", ask: "Docker 的镜像和容器也会被 DevConfig 备份吗？", effect: "不会；DevConfig 只收明确列出的 CLI/Desktop 配置和 contexts，docker_data.vhdx、镜像层、容器运行态与登录数据库不属于这个包。" },
    { moduleSlug: "wechat-native-backup", ask: "微信每天发很多视频，云端任务会不会一下传几十 GB？", effect: "它按内容比对并跳过未变化文件，默认再用 8G 限制单次传输；达到上限会让本轮任务失败或停止，不代表云端额度永远不会被用完。" },
    { moduleSlug: "wechat-native-backup", ask: "微信正在聊天时备份，数据库会不会损坏？", effect: "脚本不会过滤 SQLite 的 -wal、-shm 和 journal，但运行中逐文件复制仍可能跨越不同写入时刻；它只能保留更多持久状态，不能保证数据库一致或客户端一定可用。" },
    { moduleSlug: "recovery-and-tasks", ask: "换了新电脑，解压备份后为什么 Xshell 和部分软件找不到配置？", effect: "先把“文档”重新指向 E:\\Documents；用户名沿用 10979 可以直接兼容，换用户名也可以，但必须有界重映射或替换已知硬编码路径。" },
    { moduleSlug: "recovery-and-tasks", ask: "新电脑可以直接把备份里的任务计划 XML 全部导入吗？", effect: "严禁通配批量导入；旧任务中可能含有历史已退役的路径或 H 盘写入脚本，必须参照 PCConfig 的恢复手册逐项核对后重建。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码与规则）", proves: "PUBLIC main 提交 a067b58；包含采集、系统导出、微信增量、网络代理、恢复脚本、sources.psd1 以及与当前行为一致的人类恢复入口。", doesNotProve: "源码提交不证明新机器已完成端到端灾难恢复演练，也不证明云端或 H 的对象已经补齐。" },
    { layer: "Tests（隔离自动化测试）", proves: "8 个 PowerShell 测试脚本返回通过，覆盖公开仓库文件候选、Docker 采集范围、H 盘隔离、任务代理、事务化任务注册和微信增量/恢复合同。", doesNotProve: "本轮官方微信正在运行，原生恢复测试的合成 Execute 分支按设计跳过；测试也不模拟真实硬盘损坏或完整换机。" },
    { layer: "Runtime（当前系统运行态）", proves: "2026-09-04 回读本地与 G:\\80_Backup\\DevConfig 各 7 份日期包，latest.zip 为 1,911.3 MB；G 盘微信热备为 41.89 GB，Hot 回执为 complete；四个常规任务最近 3 成功/1 失败，临时监控已禁用。随后只读 Drive preflight 已恢复可达，但远端 latest 仍是 9 月 2 日，落后本地/G 一代。", doesNotProve: "网络探针可达不证明新代已上传；本地和 G 盘成功也不证明新电脑恢复已经完成。" },
    { layer: "Recovery（恢复与容灾边界）", proves: "源码与隔离测试定义了默认只读预检、路径冲突拒绝、.pre-restore-* 回滚点和失败后的原目录恢复；PCConfig 冷备任务当前因 H_unavailable 明确跳过。", doesNotProve: "本轮没有执行微信复制、DriveOnly、H 冷拷贝或完整新机恢复，也不证明官方客户端登录后能看到预期历史。" }
  ],
  operationalEntrypoints: [
    { name: "手动执行本地与 G 盘热备", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Local,Hot", purpose: "生成本地 latest.zip，并把日期包与 latest.zip 复制到 G 盘在线热备目录。" },
    { name: "手动触发 Google Drive 上传", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Drive", purpose: "把 latest.sha256 指向的完整日期 zip 上传为日期包和 latest.zip；同一对象已验证一致时才跳过。" },
    { name: "微信数据热备增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Hot", purpose: "通过 robocopy /E 快速向 G:\\80_Backup\\WeChat 刷新原生目录，零流量保全原应用数据。" },
    { name: "微信数据云端增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Drive", purpose: "通过 rclone copy --checksum 逐文件校验增量上传云端，默认 8G 流量熔断保护。" },
    { name: "微信恢复只读安全预检", command: "powershell -File .\\Restore-WeChat.ps1 -Target E:\\Documents\\xwechat_files", purpose: "默认只读检查源是否为非空目录、路径关系/重解析点、目标状态与已知进程；不做内容哈希完整性证明。" },
    { name: "微信恢复显式回填与回滚隔离", command: "powershell -File .\\Restore-WeChat.ps1 -Execute -ReplaceExisting -Target E:\\Documents\\xwechat_files", purpose: "在确认微信关闭后安全回填数据，现有目录自动保留为 .pre-restore-* 回滚副本。" },
    { name: "查看全盘备份新鲜度与状态", command: "powershell -File .\\Backup-Status.ps1", purpose: "综合控制台：一键输出计划任务结果、本地/G盘包新鲜度、Drive 上次成功时间与最新日志。" },
    { name: "重建常规自动化计划任务", command: "powershell -File .\\Setup-ScheduledTasks.ps1", purpose: "事务化注册 4 项常规任务；Action 为 wscript.exe，隐藏 VBS 优先 PowerShell 7、缺失时才用 5.1。" }
  ],
  evolution: [
    { date: "2026-06-23—2026-07-08", commit: "基础架构与清单数据驱动", result: "建立 sources.psd1 数据驱动采集核心，分离可重下软件，建立本地、G 盘与 Google Drive 三层备份体系。" },
    { date: "2026-07-09—2026-07-27", commit: "安全防泄露门禁与冷备隔离", result: "建立 Assert-NoBackupArtifacts 机械门禁杜绝密钥进仓库；明确 H 盘为冷备介质并禁止计划任务直写；引入无窗口代理继承。" },
    { date: "2026-08-27—2026-08-31", commit: "微信恢复、远端失败关闭与热备回执", result: "实现 Restore-WeChat 只读预检与 .pre-restore-* 回滚保护，强化 rclone 远端 binding 失败关闭，并让 G 盘 Hot 成功后发布供 PCConfig 消费的有界回执。" }
  ],
  snapshotUpdateNote: "本页绑定 2026-09-04 的 PUBLIC 源提交 a067b58、只读运行态回读与 8 个测试脚本证据。后续仅在备份源范围、分层架构、微信增量策略、任务启动链或恢复边界发生实质变动时刷新；本仓库不收录任何真实密钥或备份压缩包。"
};

export const devconfigBackupModules = [
  {
    slug: "tiered-distribution",
    shortTitle: "分层与云校验",
    title: "本地和 G 盘先落稳，Drive 失败不拖垮热备",
    teaser: "本地包与 G 盘最近成功；配置 Drive 日任务虽失败，当前只读探针已恢复，但远端仍落后一代。PCConfig 冷备日任务当前因 H 不可用正常跳过。",
    status: "本地/G 到 9 月 3 日；Drive latest 仍是 9 月 2 日；H 冷备 status=skipped / H_unavailable",
    statusTone: "warn",
    relation: "这是整套灾备的介质层：先把能离线完成的本地与 G 盘副本落稳，再单独尝试云端；H 盘冷备不归这个仓库直接写。",
    value: "断网或远端出问题时，本地热备不会陪着一起失败；查看状态时也能直接知道是本地、G 盘、Drive 还是 PCConfig 冷备卡住。",
    why: "若只把备份存本地，电脑硬盘损坏时全军覆没；若每次备份都无脑往海外云盘上传，每天几十上百兆的重复数据极耗带宽且容易因网络波动中断；若直接把冷备移动硬盘常挂在系统上，又面临勒索病毒与误删风险。",
    example: "比如我问“昨晚备份到底成没成”：状态页会告诉我 Local/Hot 任务为 0、本地和 G 盘各有 7 份日期包；同时明确告诉我 Drive 日任务为 1，而不是用“绑定存在”把云端写成正常。",
    result: "得到彼此独立的本地、G 盘、Drive 和 PCConfig 冷备结果。当前可依赖的是本地/G 新代；Drive 能连但尚未补齐，H 没解锁所以没有执行冷拷贝。",
    problem: "防止网络离线或海外云盘受阻导致本地热备无法完成，同时防止冷备介质暴露在日常自动化写入中导致损坏。",
    readerStates: {
      pass: "本地 out\\latest.zip 与 G:\\80_Backup\\DevConfig 最近一次任务成功，各有 7 份日期包；上传成功时仍必须分别核对日期包和 latest.zip。",
      problem: "若网络中断或代理失效，Drive 任务安全退出并上报 Task Scheduler 退出码等待重试，不影响已落盘的本地与 G 盘热备。",
      unavailable: "若 rclone-remote-binding.json 损坏、远端不存在或预检不可达，Drive 流程 fail-closed（失败关闭），不会改投第一个可用远端；H 不可用时 PCConfig 冷备返回 skipped，而不是伪造成功。"
    },
    decisionImpact: [
      "本地 out/ 与 G:\\80_Backup\\DevConfig 各保留 7 份时间戳历史包（devconfig-YYYYMMDD-HHMMSS.zip）与一份 latest.zip。",
      "G:\\80_Backup 作为本机可访问的日常在线热备（每日 21:05 + 登录后 20 分钟），该层不依赖公网。",
      "每次 Local 都把当前时间写进 MANIFEST.txt 并生成新文件名/新 SHA-256；通常每个新代都会完整上传约 1.91 GB 的日期 zip 和同内容 latest.zip，不是 zip 内部差量。",
      "只有 state、远端目录、日期名与 latest 名都匹配，而且两个远端对象的大小/MD5 都与同一已验证本地包一致时，Drive 才能跳过这个对象。",
      "rclone 上传后必须对带日期包和 latest.zip 分别核对远端大小与 MD5（信息摘要算法），双重一致才算上传成功。",
      "本仓库的任务不写 H；PCConfig 的 AIRecoveryColdSync-Daily 每天机会式检查。H 人工解锁后，还需 Hot context 不超过 48 小时、DevConfig/微信各不超过 36 小时、G/H 介质身份正确、H 剩余空间高于 100 GiB 并取得写锁。",
      "条件通过时冷拷贝是 additive_no_mirror（只增量添加、不镜像删除），不自动重锁 H；DevConfig 只在新文件复制并通过 SHA-256/大小/存在性核对后，才按 allowlist 清理旧日期包。"
    ],
    implementation: [
      "Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。",
      "Initialize-BackupNetwork.ps1 自动从 Windows 系统代理读取当前已启用的代理配置，为后台无窗任务提供网络连通性。",
      "Resolve-ConfiguredRcloneRemote 从 state\\rclone-remote-binding.json 读取用户选定的远端别名，文件损坏或不可读时直接 fail-closed（失败关闭）。",
      "tests/Assert-HDriveSafety.ps1 通过字符串与正则合同检查本仓库脚本没有 H 目标或已退役 Usb 参数；它不是 PowerShell AST 检查。"
    ],
    flow: [
      "计划任务或手动触发 Backup-DevConfig.ps1 -Tier Local,Hot。",
      "7-Zip 完成配置打包并生成 latest.zip，计算并记录 latest.sha256。",
      "脚本用 Copy-Item 把日期包与 latest.zip 复制到 G:\\80_Backup\\DevConfig，再淘汰超过 7 份的日期包。",
      "22:00 计划任务触发 -Tier Drive，读取 latest.sha256 指向的不可变日期包，再把 state 中的代际与目标绑定一起比较。",
      "新代用两次 rclone copyto 完整上传日期包和 latest.zip；随后分别核对远端大小与 MD5，全部一致才写 last-drive-success.txt。"
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
      { path: "E:\\PCConfig\\tools\\Invoke-CoreRecoveryMaintenance.ps1", role: "H 冷备的实际 owner：机会式日任务、新鲜度/介质/容量/写锁门与 additive_no_mirror 复制" }
    ],
    verification: [
      "tests/Assert-HDriveSafety.ps1 字符串/正则检查通过，确认本仓库没有 H 目标与已退役 Usb 参数。",
      "本地 out/latest.zip 与 G:\\80_Backup\\DevConfig 各有 7 份日期包，最近更新时间为 2026-09-03 21:11（本机时区）。",
      "DevConfigBackup-Drive-Daily 最近返回 1；当前 preflight（预检）已恢复为成功，但远端只有 8 月 31 日、9 月 1 日、9 月 2 日三代，latest 与 9 月 2 日同字节/MD5，本地/G 的 9 月 3 日包尚未上传。",
      "AIRecoveryColdSync-Daily 已启用且最近返回 0，但 cold-last.json 明确是 status=skipped、warning=H_unavailable；返回 0 不等于发生了冷拷贝。"
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
        "PCConfig日任务只在人工打开H窗口且全部门通过时执行additive_no_mirror冷拷贝"
      ],
      failureRecovery: [
        "网络离线时Drive任务退出码触发计划任务自动重试",
        "binding损坏时立即失败关闭并等待人工修复"
      ]
    }
  },
  {
    slug: "source-catalog",
    shortTitle: "配置精选与避坑",
    title: "清单决定收什么、丢什么；当前包是 1.91 GB 恢复候选",
    teaser: "sources.psd1 驱动采集，继续避开插件、依赖、缓存和 Docker 大盘；当前清单比早期更广，最近包不是 65 MB，而是 1,911.3 MB。",
    status: "当前 History=False 任务采集 5,657.16 MB，压缩为 1,911.3 MB；公开仓库文件候选门通过",
    statusTone: "good",
    relation: "它是备份内容的决策中枢：明显可重建的安装本体和缓存不收，真正影响恢复的配置、凭据和状态进入候选包；恢复者再按版本与兼容性挑选。",
    value: "既不做整机镜像，也不为了追求漂亮的小数字漏掉有用状态。软件清单负责重新下载，恢复包负责保留难以重建的部分。",
    why: "插件和安装包大多能重下，配置、密钥、终端会话与系统导出更难重建。当前清单还包含较完整的 AI 工具配置和 Scoop persist，所以包体比早期大得多；这不是“一键覆盖包”，而是给懂现场的人选择性恢复的材料。",
    example: "PowerToys 只备份 AppData\\Local 下 1.3 MB 的配置文件，绝不碰 843 MB 的安装主目录；Docker 只取 CLI 的 config.json 和偏好设置，坚决排除 20+ GB 的 docker_data.vhdx 磁盘镜像；JetBrains 剔除 10.6 GB 的插件与 JDBC 驱动，同时导出插件列表供重装时一键补齐。",
    result: "获得当前约 1.91 GB 的版本化恢复候选包和 scoop/winget/扩展清单。公开仓库只收脚本与文档；实际包可能含明文凭据，留在可信本地、G 盘或私人 Drive，恢复时按材料类型决定是否加密和回填。",
    problem: "防止将数十 GB 的 node_modules、浏览器缓存、软件本体与 Docker 磁盘镜像打进备份包，并防止把明文 API Key 与私钥误提交至开源仓库。",
    readerStates: {
      pass: "sources.psd1 可由 PowerShell 5.1 解析，node_modules、常见缓存与 Docker 大盘保持排除；Assert-NoBackupArtifacts 检查的 Git 文件候选没有命中已知备份目录、归档扩展名或微信数据库路径。",
      problem: "若用户在 sources.psd1 中写错了语法（如在受限语言中使用分号），测试与入口解析将报错拦截，防止生成残缺备份包。",
      unavailable: "若 Git 暂存区中误加入了 *.zip、*.reg 或敏感数据库文件，提交前安全检查直接 fail-closed（失败关闭）阻断提交并告警。"
    },
    decisionImpact: [
      "最近一次正常 History=False 任务的 staging 为 5,657.16 MB，压缩包为 1,911.3 MB；早期 170/65 MB 只属于历史规模。",
      "PowerToys 只取 AppData\\Local 下 1.3 MB 的设置，坚决不取 843 MB 的安装本体。",
      "JetBrains 剔除 10.6 GB 的 plugins 与 jdbc-drivers 目录，通过导出 txt 清单实现重装自动下载。",
      "Docker 仅备份 CLI config.json 与 Desktop 偏好，坚决排除动辄几十 GB 的 docker_data.vhdx 磁盘镜像。",
      "FinalShell 只取 conn\\ 会话，PixPin 只取 Config 剔除截图历史，Clash 剔除 34 MB 规则数据库。",
      "AI 聊天历史（如 .claude\\projects）默认排除，仅在指定 -IncludeHistory 时追加打包。",
      "实际备份包包含部分明文凭据和不可轮换的 GPG 私钥；它与公开脚本仓库是两件事，恢复和介质保护要按材料类型处理。",
      "提交前由 Assert-NoBackupArtifacts.ps1 扫描 Git 文件候选的目录、扩展名和已知数据库路径；它不替代对任意源码正文的秘密检查。"
    ],
    implementation: [
      "sources.psd1 使用受限 PowerShell 数据语法，声明式组织 HomeFiles, HomeDirs, AppDataDirs, ExcludeDirs 等数组。",
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
      "调用 7-Zip 打包并发布 latest.zip；staging 不在打包后删除，而是在下一次采集开始时删除并重建。"
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
      "2026-09-03 的实际包为 1,911.3 MB，证明当前清单已远大于早期约 65 MB 示例。"
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
        "为什么当前备份包已经接近2GB",
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
    shortTitle: "微信原生增量",
    title: "41.89 GB 微信热备、逐文件增量与可核对交接回执",
    teaser: "微信原应用数据不走整包压缩；robocopy 刷新静态副本，rclone 按内容增量并限制单次 8G。WAL/SHM/journal 不漏掉，但运行中复制仍不是一致快照。",
    status: "G 盘 Hot 最近成功并发布回执；微信 Drive 周任务最近返回 0，云端恢复未验收",
    statusTone: "good",
    relation: "把体积大、变化快的微信原应用目录从配置包里拆出来单独维护；热备结果再用有界回执交给 PCConfig 判断冷备前置条件。",
    value: "不必每次把几十 GB 重新压成一个大包；没变化的文件会跳过，单次云传输也有上限。代价是文件级副本仍需官方客户端做最终可用性验收。",
    why: "微信聊天记录与音视频媒体文件高达数十 GB，且媒体文件本身已经是高度压缩的有损格式，再做 zip 打包不仅耗费数小时 CPU，压缩率还接近 0；如果直接直传使用中的微信目录，微信随时在写入导致“边传边改”，甚至可能造成上传的数据库不一致损坏。",
    example: "比如我问“昨晚微信热备有没有真落到 G 盘”：除了看任务返回 0，还能读到 schema、完成时间、目标和 robocopy 退出码匹配的回执；回执明确不包含聊天文件名或正文。",
    result: "得到当前 41.89 GB 的 G 盘原生目录副本、按内容增量的 Drive 路线和一张可由 PCConfig 消费的热备交接单；仍保留“运行中复制不等于数据库一致”的边界。",
    problem: "避免大体积微信数据阻塞配置包，也避免每次全量重传；同时防止只看任务名称或目录存在就误以为最近热备一定完成。",
    readerStates: {
      pass: "WeChatBackup-Hot-Daily 最近返回 0；G 盘副本为 41.89 GB / 142,693 文件，wechat.hot-backup-receipt.v1 回读为 complete。",
      problem: "单次 Drive 传输达到 8G 上限时，本轮 rclone 不再继续无限传输并返回结果给任务；需要看日志和后续任务是否补齐。",
      unavailable: "若 robocopy 返回 8 以上、回执无法原子发布或 Drive 目标不可达，本轮对应层失败；旧副本保留，但不能据此声称这次增量完整。"
    },
    decisionImpact: [
      "当前 41.89 GB 原生 xwechat_files 数据不走单个压缩包，避免每次重新打包整个媒体目录。",
      "Hot 路线用 robocopy /E 直接增量到 G 盘；Drive 路线先刷新本地静态副本，避免上传期间继续读取正在变化的源目录。",
      "Google Drive 采用 rclone copy --checksum 逐文件比对哈希增量，仅传输新增与变动文件。",
      "默认 -MaxTransfer 8G 只限制一次脚本进程；WeChatBackup-Drive-Weekly 最多可任务级重试 5 次，每次重新获得自己的单次额度，所以累计流量和云空间仍要另看。",
      "严格伴随复制 SQLite 的 -wal 与 -shm 伴生文件，尊重底层持久化规范，不将运行中复制冒充一致性快照。",
      "Hot 成功后原子写入并回读有界 JSON 回执；PCConfig 只在回执目标匹配且不超过 36 小时时接受微信热备前置条件。",
      "WeChatDrive-Monitor-Hourly 仅用于首次补齐，当前已禁用；正常运行依赖 Hot 日任务和 Drive 周任务。"
    ],
    implementation: [
      "Backup-WeChat.ps1 支持 -Target Hot、Local、Drive；Drive 默认上传完整原应用数据，-DbOnly 只传 db_storage，-DriveFull 可覆盖该兼容开关回到完整范围。",
      "-MaxTransfer 0 会关闭单次 8G 上限，只适合明确的一次性补齐并由人持续看进度；常规定时任务保持默认上限。",
      "Write-HotReceipt 发布 wechat.hot-backup-receipt.v1，并回读 schema、状态、目标和 robocopy 退出码；payload_names_emitted 与 payload_content_read 固定为 false。",
      "WeChat-Recovery.Common.ps1 负责路径规范化、目标/进程检查、复制与回滚；WAL/SHM/journal 的保留来自备份过滤规则，而不是这个恢复模块定位数据库。",
      "Monitor-WeChatDrive.ps1 监控云端传输状态并在无活跃进程时自动续传，通过 rclone check 闭环后自我禁用。",
      "tests/Assert-WeChatIncrementalIntegrity.ps1 验证 checksum 内容变化用例，并静态检查流量上限、WAL/SHM 不被过滤和 Hot 回执字段。"
    ],
    flow: [
      "计划任务唤醒 Backup-WeChat.ps1 -Target Hot。",
      "robocopy /E 向 G:\\80_Backup\\WeChat\\xwechat_files 复制新增和变化文件，返回 0–7 才进入回执发布。",
      "脚本原子写入 G:\\80_Backup\\ControlPlane\\wechat-hot-last.json 并立即回读；回读不一致则本轮任务失败。",
      "周日 20:00 唤醒 WeChatBackup-Drive-Weekly。",
      "rclone 读取远端 binding，逐文件计算 checksum 并比对 Google Drive 远端。",
      "默认传完整原应用目录；临时 -DbOnly 只传 db_storage，会失去媒体完整性。仅明确人工补齐时可用 -MaxTransfer 0 关闭单次上限。",
      "若单次传输达到 8G 上限，本轮停止继续传输；任务级重试可能继续累计传输。正常完成后运行 rclone check 做内容级单向核对。"
    ],
    concepts: [
      { term: "File-by-File Incremental（逐文件增量）", explanation: "针对已压缩的多媒体大目录，按单个文件比对哈希只传变动文件，避免整包重新打包。" },
      { term: "Transfer Fuse（流量保险丝）", explanation: "限制一次 Backup-WeChat 进程的传输量；它不限制多次计划任务重试的累计流量，也不保证云盘总空间够用。" },
      { term: "WAL Co-preservation（预写式日志伴生保全）", explanation: "SQLite WAL 模式下可能有已提交事务尚未合并进主库，因此 -wal、-shm 和 journal 不应被备份过滤；一起复制仍不保证运行中快照一致。" },
      { term: "Bounded Hot Receipt（有界热备回执）", explanation: "只证明一次 Hot 复制的时间、目标和退出码已回读，不输出 payload 名称或正文，也不证明微信客户端已经可恢复。" }
    ],
    boundaries: [
      "不将当前约 41.89 GB 的微信原应用数据打包为单个 zip，Hot 与 Drive 都采用文件级增量。",
      "默认单次调用设置 8G 传输上限；任务重试的累计流量另算，-MaxTransfer 0 仅供人工看守的一次性补齐。",
      "-DbOnly 只是临时省流量模式，只保留 db_storage；它不能冒充包含图片、视频等媒体的完整原应用备份。",
      "必须伴随复制 SQLite WAL 与 SHM 文件，不把运行中复制冒充官方一致性快照。"
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
      "tests/Assert-WeChatIncrementalIntegrity.ps1 PASS，验证 checksum 的同大小同时间内容变化用例，以及 Hot 回执所需字段存在。",
      "8G 上限、DbOnly/DriveFull 范围与 WAL/SHM 保留只有脚本/静态合同证据；本轮没有真的传满 8G，也没有运行 SQLite 一致性测试。",
      "G:\\80_Backup\\WeChat\\xwechat_files 当前为 41.89 GB / 142,693 文件；本轮没有重新证明它与正在运行的源目录逐项一致。",
      "Hot 回执完成时间为 2026-09-03 18:30（本机时区），目标匹配 G 盘微信路径，robocopy_exit 为 3。"
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
        "xwechat_files (当前约41.89GB)",
        "wechat.hot-backup-receipt.v1",
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
    shortTitle: "重装恢复与调度",
    title: "选择性换机恢复、微信回滚点与事务化任务重建",
    teaser: "README 把恢复整理成 7 个阶段，但不是一键脚本：软件、配置、系统导出和微信各自验收；四个常规任务更新前先保存原定义，失败时恢复。",
    status: "恢复说明与任务注册合同已就绪；完整新机恢复未实机验收，本轮微信 Execute 分支因客户端运行而跳过",
    statusTone: "warn",
    relation: "把备份材料变成一套可以逐层检查的恢复顺序；它负责工具脚本，机器路径、任务恢复次序和 H 盘冷备仍由 PCConfig 决定。",
    value: "真出事时不必凭记忆乱拷：先装基础工具，再选择性回填配置，单独处理系统导出和微信，最后重建任务并逐项看结果。",
    why: "系统崩溃或新装机后，很多人不知道先装什么后回填什么，导致环境变量冲突；更常见的是忽视了路径陷阱：重装后 Documents 默认指向 C 盘导致大量软件读不到工程，或者新机器换了用户名导致所有硬编码绝对路径全部失效；微信直接无脑覆盖更有冲掉最新数据的风险。",
    example: "比如我换到一台干净电脑：先用清单补软件，再检查哪些 home/AppData 配置与新版本兼容；Documents 重新指向 E:\\Documents，用户名不同就重映射旧绝对路径。微信先预检，复制后再登录官方客户端；计划任务最后按 PCConfig 清单逐项重建。",
    result: "得到一条可暂停、可回滚、可逐层验收的恢复路径。它避免盲目覆盖，但没有承诺固定耗时，也没有把文档步骤、合成测试或文件复制冒充整机恢复成功。",
    problem: "防止重装新系统后盲目覆盖导致已有数据丢失，防止因 Documents 路径或用户名不一致导致软件配置失效。",
    readerStates: {
      pass: "四个任务定义、同名任务所有权检查、XML 前像与失败回滚的隔离测试通过；Restore-WeChat 默认预检合同通过。",
      problem: "若新机器用户名与原系统（10979）不一致，或 Documents 未正确重定向，部分硬编码绝对路径软件可能报错，需人工执行文本替换或目录重定向。",
      unavailable: "若微信仍在运行、备份源不可用，或目标非空且未指定 -ReplaceExisting，恢复脚本拒绝写入；本轮测试正因为官方微信在运行而没有执行合成复制分支。"
    },
    decisionImpact: [
      "README 用 7 个阶段组织恢复：装基础工具、取包、补软件、选择性回填配置、逐项恢复系统设置、处理微信、最后重挂任务与远端。",
      "避坑陷阱 1：旧系统将“文档”重定向至 E:\\Documents，重装后必须重新定向，否则 Xshell/Navicat 会读到空目录。",
      "避坑陷阱 2：沿用用户名 10979 可保持旧绝对路径；使用新用户名时必须在恢复后重映射或替换这些路径。",
      "Restore-WeChat.ps1 默认只读预检，显式执行时目标非空必须强制生成 .pre-restore-* 回滚目录。",
      "标记状态 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，由用户登录官方客户端确认历史，绝不用脚本退出码冒充恢复。",
      "四个常规任务的 Action 固定为 wscript.exe；隐藏 VBS 优先 PowerShell 7，找不到才用 Windows PowerShell 5.1。独立临时监控安装器才固定 5.1。"
    ],
    implementation: [
      "Restore-WeChat.ps1 默认 Plan（预检），提供 -Execute、-ReplaceExisting、人工指定本地/USB 原生目录的 -BackupRoot，以及尚未完成真实联网恢复验收的 -DriveOnly。",
      "路径检查拒绝盘符根目录、source/target 相同或互为父子目录，以及任一路径或父级上的 reparse point（重解析点）。",
      "Setup-ScheduledTasks.ps1 配合 ScheduledTask-Registration.Common.ps1 注册 4 个常规任务；临时小时监控由 Install-WeChatDriveMonitor.ps1 独立管理。",
      "注册器先拒绝不属于本项目的同名任务，再抓取四个目标的精确 XML 前像；逐项更新和回读失败时恢复原定义，避免留下半套任务。",
      "Hidden VBS 启动脚本（Backup-DevConfig-Hidden.vbs 等）隐藏黑框并完整保留并透传退出码。",
      "tests/Assert-WeChatNativeRecovery.ps1 验证默认预检、路径/目标保护和人工验收状态；本轮客户端运行时不会强行执行合成复制。"
    ],
    flow: [
      "新电脑安装 Scoop、Winget、VS Code、PowerShell 与 rclone。",
      "取回 latest.zip 解压，按新系统版本与现场兼容性选择性回填 home/ 与 appdata/。",
      "重定向“文档”到 E:\\Documents；用户名不同则先规划旧绝对路径的重映射或替换。",
      "按 PCConfig 恢复手册逐项审查环境变量、Xshell、Wi-Fi 与其他系统导出，不通配导入旧任务 XML。",
      "微信源可以是默认 G 热备，也可以通过 -BackupRoot 明确指定本地/USB 原生目录；-DriveOnly 仍属于未完成真实联网验收的兼容路径。",
      "运行 Restore-WeChat.ps1 只读预检，确认源/目标路径安全且微信关闭后显式回填，再登录官方客户端核对历史。",
      "运行 Setup-ScheduledTasks.ps1 挂上日常定时任务，恢复自动化运行。"
    ],
    concepts: [
      { term: "Idempotent Task Registration（幂等任务注册）", explanation: "无论运行多少次，只更新或确保计划任务处于正确配置，不产生重复实例或脏状态。" },
      { term: "Human Acceptance Gate（人工在场验收门）", explanation: "对于专有通讯软件，文件拷贝完成不等于数据可用，必须由真人登录官方应用最终确认。" },
      { term: "Pre-restore Rollback（恢复前回滚隔离）", explanation: "在写入前把已有目标移到 .pre-restore-*；若复制失败，部分结果再移到 .failed-restore-*，随后尽力把原目录恢复。" }
    ],
    boundaries: [
      "新电脑恢复要先处理 Documents 指向和用户名路径兼容：可以沿用 10979，也可以明确重映射，不得默默忽略。",
      "严禁通配批量导入历史任务计划 XML，必须按 PCConfig 重建手册逐项核对。",
      "Restore-WeChat.ps1 在未经用户显式确认官方微信关闭前严禁写入，目标非空必须保留回滚副本。",
      "备份源与目标不能是盘根、同一路径、互为父子目录或经过重解析点；这些条件任何一个不清楚就不执行。",
      "-DriveOnly 只说明存在兼容实现，本轮没有真实联网下载恢复证据，不能替代已验的本地/G 路线。",
      "文件复制完成仅标记 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，严禁冒充微信恢复成功。"
    ],
    failures: [
      { condition: "恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting", response: "脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。" },
      { condition: "源与目标重叠、互为父子目录、指向盘根或路径链包含重解析点", response: "预检直接拒绝；不会靠猜测选择 USB、Drive 或另一个目录。" },
      { condition: "已把旧目标移到 .pre-restore-* 后复制失败", response: "部分结果移到 .failed-restore-*，再恢复原目录；若回滚自身也失败，同时报告原始错误和回滚错误。" },
      { condition: "新机用户名与旧系统不匹配或 Documents 位于 C 盘", response: "文档与清单明确提示人工修改路径映射或重定向文档目录，防止软件配置加载为空。" },
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
      { path: "tests/Assert-ScheduledTaskRegistrationSafety.ps1", role: "任务注册事务性与执行器路径安全测试" }
    ],
    verification: [
      "tests/Assert-WeChatNativeRecovery.ps1 返回 PASS，但本轮因官方微信正在运行，合成 Execute 复制分支按设计 SKIP；真实客户端恢复仍未验收。",
      "tests/Assert-ScheduledTaskRegistrationSafety.ps1 在隔离 mock 中验证四任务精确目标、非 owner 冲突拒绝、XML 前像、失败回滚和最终回读。",
      "本轮没有在干净 Windows 上导入注册表、Wi-Fi 或整套任务，也没有测量恢复耗时。"
    ],
    searchAliases: [
      "新机恢复指南",
      "重装两大陷阱",
      "Documents在E盘",
      "10979用户名",
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
        "E:\\Documents 重定向",
        "10979 用户名固化",
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
