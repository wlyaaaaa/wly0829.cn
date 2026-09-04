import { createProjectSnapshot } from "./project-snapshot.js";

const devconfigBackupSnapshot = createProjectSnapshot({
  observedAt: "2026-09-04T10:00:00+08:00",
  label: "本地零流量包与 G 盘在线热备正常，Google Drive 远端绑定已配置；8 套源码测试全通，换机全量还原待人工在场验收",
  boundary: "这是 PUBLIC（公开）工具仓库、近期执行回执与本地快照的核对状态。脚本健全、离线测试通过与任务成功不等于真实新电脑已完成全量恢复演练，云端恢复未联网验收",
  metrics: [
    { label: "配置精选体积", value: "约 65 MB（原始十多 GB）" },
    { label: "微信原应用数据", value: "约 38 GB（逐文件增量）" },
    { label: "分层灾备介质", value: "本地 · G 盘在线 · Drive 海外" },
    { label: "计划任务调度", value: "4 个定时 + 1 个自愈" }
  ],
  facts: [
    { label: "它真正解决的事", value: "面向系统崩溃、硬盘物理损坏或换新电脑时的极速开发环境灾备：只备份真正不可再生的配置、API Key（应用接口密钥）、GPG（GNU 隐私保护）私钥、SSH（安全外壳协议）会话与系统偏好，剔除 IDE（集成开发环境）插件、node_modules（代码依赖包）、包管理器缓存等可重下内容；原始一锅端十多 GB，精选后仅约 170 MB，压缩打包后仅约 65 MB。" },
    { label: "分层介质与职责分工", value: "本地生成 out\\devconfig-*.zip 零流量应急；G:\\80_Backup 作为在线热备承担日常主力计划任务（每天 21:05 + 登录后 20 分钟），支持开机补跑与 3 次重试；Google Drive 走 rclone（云同步工具）在 SHA-256（安全哈希算法）变化且有网时增量上传，保留 3 份日期包加一份 latest.zip；H 盘是默认 BitLocker（Windows 驱动器加密）锁定的冷备，仅由 PCConfig（电脑配置中心）人工维护窗口从 G 刷新，日常计划任务严禁直接写入 H 盘。" },
    { label: "清单数据驱动与避坑边界", value: "备份项由 sources.psd1（PowerShell 数据文件）声明式驱动，不动脚本。明确避坑：PowerToys 取 AppData\\Local（1.3M）而非安装目录（843M）；FinalShell 只取 conn\\ 而非 JRE（Java 运行环境）；PixPin 取 Config 而非 203M 截图 History；Clash 剔除 34M 可重下规则数据库；JetBrains 剔除 10.6G 插件与 JDBC（数据库驱动）；Docker 仅保留 CLI 与 Desktop 偏好，坚决排除 VHDX 虚拟磁盘、镜像层与运行态。" },
    { label: "系统导出与重装清单自动生成", value: "备份运行时现生成注册表环境变量（用户+机器）、机器 PATH（系统路径）、20+ 自定义计划任务 XML、hosts、Wi-Fi 配置文件（含密码）与 Xshell 注册表；同时导出 scoop、winget、VS Code / Cursor / JetBrains 插件列表，让可重下内容一条命令补回。" },
    { label: "微信原应用数据独立增量流水线", value: "约 38 GB 微信原应用数据（含图片视频等媒体）单独由 Backup-WeChat.ps1 管理。采用 robocopy（Windows 健壮文件复制工具）刷新静态快照 + rclone copy --checksum（校验和对比）逐文件增量同步，不走大包压缩；设置 8G 单次上传流量熔断保护，完整保留 SQLite（轻量嵌入式数据库）WAL（预写式日志）与 SHM（共享内存索引）伴生文件。" },
    { label: "新机安全恢复与两大陷阱防范", value: "Restore-WeChat.ps1 默认只读预检，关闭官方客户端后显式执行回填，目标已有文件时强制保留为 .pre-restore-* 回滚目录；执行完成后标记 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE（复制完成待人工验收），由用户登录官方客户端确认历史，不盲目声称恢复完成。防范两大陷阱：必须重定向 Documents 至 E:\\Documents，且 Windows 用户名必须保持 10979。" },
    { label: "网络代理继承与任务自愈调度", value: "Initialize-BackupNetwork.ps1 让无窗口计划任务自动继承当前用户已启用的 Windows 代理，不写死代理 IP；后台 Drive 任务独立调度，离线不阻断本地与 G 盘热备；小时级监控任务在首次内容校验通过后自动禁用。" }
  ],
  gaps: [
    "本项目仅验证了本地、G 盘热备与合成 fixture（测试夹具）的安全逻辑，未对 Google Drive 远端发起真实联网端到端下载还原验收。",
    "微信备份的 rclone check 仅证明云端与本地文件哈希一致，不证明运行中复制时微信无底层未提交写入，也不替代官方微信客户端实际登录检验。",
    "系统导出的 20+ 计划任务 XML 严禁在新电脑通配批量导入，必须配合 PCConfig 重建手册与验证工具逐项审查恢复。",
    "H 盘冷备链路依赖人工维护窗口与物理介质解锁，日常计划任务不包含任何直写 H 盘逻辑。"
  ]
});

export const devconfigBackupProject = {
  order: 12,
  slug: "devconfig-backup",
  title: "DevConfig Backup",
  kicker: "开发配置与凭据分层备份 · 极精简灾难恢复 · 2026-09-04 核对",
  route: "/projects/devconfig-backup",
  visibility: "公开仓库",
  statusTone: "good",
  cardStatus: "本地与 G 盘热备在线、测试全通；云端远端绑定就绪，真实重装验收由人工在场完成",
  cardStatusTone: "good",
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
      "Google Drive (wlyaaaaaa@gmail.com:)",
      "xwechat_files (~38GB)",
      "SQLite WAL / SHM",
      "10979 用户名"
    ],
    relations: [
      "sources.psd1清单驱动Backup-DevConfig收集约170MB纯配置",
      "本地out目录压缩为约65MB并同步至G盘在线热备",
      "rclone通过checksum比对增量上传Google Drive并保留3份历史",
      "Backup-WeChat通过robocopy快照和rclone逐文件增量备份38GB微信数据",
      "Restore-WeChat默认只读预检并在覆盖前生成回滚保护目录",
      "PCConfig统一管理H盘离线冷备，本项目计划任务只写本地与G盘，绝不接触或写入H盘"
    ],
    failureRecovery: [
      "Google Drive远端binding损坏或代理不可达时失败关闭并重试",
      "微信上传超过8G流量保险丝时自动熔断防止异常死循环",
      "微信目标目录非空时拒绝直接覆盖并强制生成pre-restore备份",
      "Windows Store版pwsh无法被计划任务调用时回退为系统自带powershell 5.1",
      "换新电脑后重定向Documents至E盘且保持10979用户名防止路径失效"
    ]
  },
  repositoryNote: "devconfig-backup 是 PUBLIC（公开）工具仓库。仓库内严格禁止提交任何真实备份包、注册表敏感导出、密钥、微信数据库或运行日志；由 tests/Assert-NoBackupArtifacts.ps1 机械执行提交前安全门禁。",
  summary: "这是面向“极端意外下快速重装新机”的灾备工具。它坚决拒绝全盘一锅端的几十 GB 垃圾缓存，而是只备份真正不可再生的开发配置、API Key、GPG 私钥、SSH 会话与系统偏好，精选后打包仅约 65 MB；同时为约 38 GB 的微信原生应用数据建立独立的逐文件增量与预检回滚流水线。",
  why: "电脑重装最痛苦的不是重新下载安装包，而是在几十个隐蔽目录下找回各家 AI 凭据、SSH 密码、GPG 密钥、环境变量、Wi-Fi 密码与微信聊天记录。如果做整盘镜像，动辄几十上百 GB 且全是缓存包；如果完全不备，一旦硬盘损坏或换新机就要花几天重新配置。本项目把不可再生核心精选压缩到约 65 MB，分层存入本地、G 盘与云端，重装时半小时满血复原。",
  plainExample: "平时电脑每晚 21:05 自动把最新精选配置打成约 65 MB 的 zip 包存入本地并同步至 G 盘热备，有网时自动增量上传海外 Google Drive；换新机时只需 7 步：解压包、回填配置、双击导入注册表与 Wi-Fi、执行微信预检回填，立即满血继续工作。",
  result: "获得零流量本地包、G 盘在线热备与 Google Drive 云端三层冗余架构，外加完整的重装恢复清单与微信防覆盖回滚保护；不把单纯的脚本存在或哈希比对冒充官方客户端已经完成最终恢复。",
  readerStates: {
    pass: "当前已证的是本地 out\\latest.zip 生成正常、G 盘 80_Backup 热备在线、Google Drive 远端绑定已固化且 SHA 变化才传，微信 8G 熔断与预检回滚机制就绪，8 套源码测试全部通过。",
    problem: "若 rclone 远端绑定损坏或网络代理不可达，Drive 任务将 fail-closed（失败关闭）并触发任务重试；若目标已存在非空微信目录，恢复脚本拒绝覆盖并强制生成 .pre-restore-* 回滚副本。",
    unavailable: "当 G 盘脱机、Google Drive 鉴权失效或本地目标磁盘写保护时，停止对应层备份并上报 Task Scheduler（任务计划程序）退出码；严禁在缺少人工在场的情况下直接尝试写入 H 盘冷备。"
  },
  dataSources: {
    title: "系统从哪里采集配置，如何保障边界安全",
    intro: "系统通过 sources.psd1 数据驱动清单枚举本机配置文件、注册表环境与系统配置，并调用 rclone/robocopy 执行分层分发；公开仓库绝不包含任何真实备份包、密钥、注册表导出或聊天数据库。",
    rows: [
      { source: "用户主目录与 AppData（sources.psd1）", data: "按清单精确采集 .gnupg、.docker、AI/Agent 配置、VS Code/JetBrains 用户设置与终端会话；剔除 node_modules、缓存与 plugins。", result: "把十多 GB 的原始开发环境精选压制为约 170 MB，打包后仅约 65 MB。" },
      { source: "Windows 系统注册表与网络配置", data: "现导出 HKCU/HKLM 环境变量、系统 PATH、20+ 计划任务 XML、Wi-Fi 配置文件（含密码）与 Xshell 注册表。", result: "在新电脑上一键双击或通过 netsh/reg 导入，瞬间还原机器系统上下文。" },
      { source: "包管理器与扩展导出清单（_manifests）", data: "现场执行 scoop export、winget export、code --list-extensions 与已安装软件注册表枚举。", result: "生成重装补齐清单，让可重下内容一条命令批量装回，无需把安装包打进备份。" },
      { source: "微信原生应用目录（xwechat_files）", data: "单独采集约 38 GB 微信原生数据，含 db_storage、聊天数据库、图片与音视频媒体，伴随 WAL/SHM 日志文件。", result: "robocopy 刷新静态快照后由 rclone 按内容 checksum 逐文件增量同步，不走大包压缩，支持 8G 流量熔断。" },
      { source: "rclone 远端配置与 Windows 代理环境", data: "读取非秘密的 rclone-remote-binding.json 绑定固定远端别名，无窗口任务自动继承当前用户系统代理。", result: "确保后台 Drive 任务只传向指定 Google Drive 目标，代理失效或 binding 损坏时立即失败关闭。" }
    ],
    note: "本仓库严格遵守公开安全红线，所有 out/、staging/、state/、logs/ 目录与 *.zip、*.reg、*.kdbx 敏感文件均受 .gitignore 与 Assert-NoBackupArtifacts 机械保护。"
  },
  cardMetrics: [
    { label: "配置精选体积", value: "约 65 MB" },
    { label: "微信原应用数据", value: "约 38 GB" },
    { label: "分层灾备介质", value: "本地 · G 盘 · Drive" },
    { label: "计划任务调度", value: "4 个定时 + 1 个自愈" }
  ],
  responsibilities: [
    "负责从 sources.psd1 数据驱动采集核心开发配置、凭据与系统设置，生成约 65 MB 的精简灾备压缩包。",
    "负责本地 out/、G 盘 80_Backup 在线热备与 Google Drive 云端的多级分层分发与双重校验和核对。",
    "负责约 38 GB 微信原应用数据的独立逐文件增量备份、8G 流量保险丝与 SQLite WAL 伴生日志保全。",
    "负责提供新电脑重装 7 步恢复流水线、两大陷阱避坑防范与微信只读预检回滚机制。",
    "负责 Windows 计划任务的幂等注册、PowerShell 5.1 兼容启动与无窗口网络代理自动继承。"
  ],
  exclusions: [
    "不备份软件安装本体、IDE 插件二进制（如 JetBrains 10.6GB plugins）、npm 全局包或 node_modules 等可重下内容。",
    "不将 Docker Desktop 的 VHDX 虚拟磁盘（如 docker_data.vhdx）、镜像层或容器运行态数据库打入配置包。",
    "日常脚本与计划任务严禁直接写入 H 盘冷备；H 盘冷备由 PCConfig 在人工在场维护窗口统一从 G 盘刷新。",
    "不把 rclone 或 robocopy 复制成功冒充微信官方客户端已经验收通过，不自动关闭或启动官方微信。",
    "公开 Git 仓库绝不收纳任何真实 zip 包、注册表敏感导出、API Key、GPG 密钥或微信聊天数据。"
  ],
  productPrinciples: [
    {
      title: "只备真正不可再生的资产，拒绝膨胀",
      detail: "可重新下载的软件安装包、VS Code/JetBrains 插件、npm 模块和各类临时缓存一律剔除；只留 API Key、私钥、配置文件与重装清单，让原本十几 GB 的臃肿包缩减至约 65 MB，既省流量又确保分钟级解压恢复。"
    },
    {
      title: "分层存储各司其职，冷热严格隔离",
      detail: "本地包零流量保底，G 盘承担在线日常自动热备，Google Drive 提供异地容灾；H 盘是默认 BitLocker 锁定的物理冷备，必须由 PCConfig 在人工在场维护窗口统一同步，日常自动化任务绝不触碰冷备介质。"
    },
    {
      title: "微信数据独立通道，增量兼顾一致性",
      detail: "微信 38GB 数据以媒体为主，压缩收益极低且极度耗时，因此采用 robocopy 静态快照结合 rclone checksum 逐文件增量同步；严格保全 SQLite 的 WAL/SHM 伴生文件，并设置 8G 上传熔断上限。"
    },
    {
      title: "恢复默认只读预检，绝不盲目覆盖",
      detail: "灾难恢复时 Restore-WeChat.ps1 默认仅输出只读环境检查，显式执行时若目标非空强制留存 .pre-restore-* 回滚目录；执行完毕标记待人工验收状态，由用户登录官方客户端确认历史，绝不用脚本返回值冒充业务恢复。"
    }
  ],
  glossary: [
    { term: "rclone（云同步工具）", meaning: "支持多云存储协议的命令行同步工具；本项目用于在网络就绪时将配置包与微信数据增量同步至 Google Drive。" },
    { term: "robocopy（Windows 健壮文件复制工具）", meaning: "Windows 自带的多线程文件复制工具；本项目用于在本地为活跃目录创建静态快照并镜像同步至 G 盘热备。" },
    { term: "checksum（校验和）", meaning: "基于文件内容的哈希计算值；rclone 通过比对内容哈希决定是否传输，避免单纯依赖修改时间导致漏传或重复上传。" },
    { term: "WAL（Write-Ahead Logging，预写式日志）", meaning: "SQLite 数据库的持久事务日志（-wal 文件）；未合并进主库的已提交数据保存在此，备份时必须与主数据库一同完整复制。" },
    { term: "SHM（Shared Memory，共享内存索引）", meaning: "SQLite 在 WAL 模式下的共享内存索引文件（-shm 文件）；虽可重建但伴随复制能避免冷启动时的索引重建冲突。" },
    { term: "fail-closed（失败关闭）", meaning: "当环境出现不可预期故障（如 binding 文件损坏、代理不可达、目标已存在非空文件）时，系统立即安全退出并阻断写入，绝不盲目降级。" },
    { term: "binding（远端别名绑定）", meaning: "保存在本地非秘密 state 中的 rclone remote 别名映射；确保云端同步只传向用户指定的准确云盘，严禁 fallback（降级）到默认第一个远端。" },
    { term: "BitLocker（Windows 驱动器加密）", meaning: "Windows 原生全盘加密技术；本项目冷备介质 H 盘默认处于锁定状态，防止物理介质丢失造成敏感凭据泄露。" },
    { term: "Task Scheduler（Windows 任务计划程序）", meaning: "Windows 系统内置的定时任务管理服务；负责驱动每日热备、夜间云端增量上传与自愈监控。" }
  ],
  operatingFlow: [
    { title: "每日定时采集与精选打包", detail: "每晚 21:05 计划任务唤醒 Backup-DevConfig.ps1，按 sources.psd1 复制不可再生文件，现生成注册表与任务 XML，调用 7-Zip 打成 devconfig-YYYYMMDD-HHMMSS.zip 并生成 latest.zip。" },
    { title: "零流量本地与 G 盘热备落盘", detail: "本地保存至少 3 份历史日期包；随后自动向 G:\\80_Backup\\WLY 镜像同步，并向 G:\\80_Backup\\WeChat 刷新微信原应用数据快照，全程不消耗外网流量。" },
    { title: "夜间网络就绪增量上云", detail: "每晚 22:00 计划任务唤醒 Drive 备份；若检测到网络连通且 SHA-256 相比上次上传有变动，调用 rclone 增量同步至 Google Drive，核对大小与 MD5 后写入成功时间戳。" },
    { title: "新机重装极速解包回填", detail: "在新机器上从 G 盘或 Drive 取回 latest.zip 解压，将 home 回填至用户根目录，appdata 回填至 AppData，双击导入注册表环境变量与 Xshell 会话，一键运行 netsh 导入 Wi-Fi。" },
    { title: "微信数据预检与安全接管", detail: "运行 Restore-WeChat.ps1 只读检查，确认官方微信关闭后，显式执行回填；若目标已有数据自动备份为 .pre-restore-* 回滚目录，最后由人工启动微信确认历史。" }
  ],
  components: [
    { name: "Backup-DevConfig.ps1", responsibility: "配置采集、系统现导出、清单生成、7z 压缩打包与分层分发（Local/Hot/Drive）。", implementation: "PowerShell 5.1 兼容脚本，支持 -Tier 参数灵活组合，内置 7z 退出码容错与哈希比对。" },
    { name: "sources.psd1", responsibility: "配置采集与排除规则的数据驱动清单，定义散件、各工具目录、避坑黑名单与计划任务白名单。", implementation: "受限 PowerShell 数据文件，纯声明式数组与哈希表，修改无需变动脚本逻辑。" },
    { name: "Backup-WeChat.ps1", responsibility: "约 38 GB 微信原生应用数据的独立增量备份流水线，支持 Hot（热备）与 Drive（云端）。", implementation: "封装 robocopy 静态镜像与 rclone copy --checksum，内置 8G 流量熔断保护与 WAL 文件保全。" },
    { name: "Restore-WeChat.ps1", responsibility: "微信原生目录的灾难恢复总线，提供默认只读预检、目标非空回滚保护与人工在场状态标记。", implementation: "多步安全校验，支持 -Execute 与 -ReplaceExisting，返回 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE。" },
    { name: "Initialize-BackupNetwork.ps1", responsibility: "为无窗口计划任务提供网络代理自动继承与 rclone 远端绑定安全解析。", implementation: "读取注册表系统代理配置，解析 rclone-remote-binding.json，提供 fail-closed 安全保障。" },
    { name: "Setup-ScheduledTasks.ps1", responsibility: "在 Windows Task Scheduler 幂等注册 4 项核心备份任务与 1 项自愈监控任务。", implementation: "使用 powershell.exe 原生注册任务，配置开机补跑与失败自动重试策略。" },
    { name: "Backup-Status.ps1", responsibility: "本地、G 盘热备、Google Drive 远端与计划任务健康度的综合状态查询控制台。", implementation: "一键汇总各级备份文件大小、新鲜度、上次成功时间戳与最近运行日志。" },
    { name: "tests/ 自动化安全契约套件", responsibility: "提交前严查防泄露门禁、Docker 范围、H 盘冷备隔离与微信增量完整性。", implementation: "8 套独立 PowerShell 测试脚本，涵盖 Assert-NoBackupArtifacts、Assert-HDriveSafety 等。" }
  ],
  technicalContracts: [
    { artifact: "备份源与排除规则清单", schema: "sources.psd1 data format", owner: "sources.psd1", boundary: "声明 HomeFiles、HomeDirs、AppDataDirs、ExcludeDirs、ExcludeFiles 与 ScheduledTaskPatterns；禁止包含真实密钥正文。" },
    { artifact: "云端远端别名绑定记录", schema: "devconfig-backup.rclone-remote-binding.v1", owner: "rclone-remote-binding.json", boundary: "仅记录用户选定的 non-secret（非机密）rclone 远端别名（如 wlyaaaaaa@gmail.com:）；严禁包含 OAuth token 或凭据。" },
    { artifact: "本地最新打包哈希凭证", schema: "latest.sha256 format", owner: "Backup-DevConfig.ps1", boundary: "记录本次打包生成的 SHA-256 哈希值与带时间戳的文件名，作为比对云端是否需要同步的基准。" },
    { artifact: "云端上传完成状态凭证", schema: "devconfig.drive-upload-state.v1", owner: "last-uploaded.json", boundary: "记录已成功传至 Drive 的 SHA-256、远端别名、目录名、带日期包名与 latest_name，确保幂等续传。" }
  ],
  usageExamples: [
    { moduleSlug: "tiered-distribution", ask: "如果家里停网了，每天晚上的备份会失败报错吗？", effect: "不会报错卡死；21:05 的本地包与 G 盘热备是纯本地零流量操作正常完成；22:00 的 Drive 任务检测到无网会自动跳过并在开机联网后补跑。" },
    { moduleSlug: "tiered-distribution", ask: "为什么自动化任务不能直接往 H 盘写备份？", effect: "H 盘是默认 BitLocker 锁定的冷备介质，专用于防物理盗窃与极端勒索病毒；日常自动化严禁接触冷备，仅由 PCConfig 人工维护窗口从 G 刷新。" },
    { moduleSlug: "source-catalog", ask: "JetBrains 和 VS Code 装了十几 G 插件，重装时也会打包进去吗？", effect: "不会；sources.psd1 严格排除了 plugins 和 extensions 目录，只备份 keymap 与设置，同时导出插件清单 txt，重装时一条命令自动重装插件。" },
    { moduleSlug: "source-catalog", ask: "Docker 的镜像和容器也会被 DevConfig 备份吗？", effect: "不会；DevConfig 仅备份不到 1MB 的 config.json 和偏好设置，几个 G 的 docker_data.vhdx 虚拟磁盘和运行态数据库坚决排除在备份之外。" },
    { moduleSlug: "wechat-native-backup", ask: "微信每天发很多视频，每天上云会不会把我的 Google Drive 额度打爆？", effect: "不会；微信备份采用逐文件增量比对，已上传的文件直接跳过；且脚本默认开启 -MaxTransfer 8G 流量保险丝，单次上传达到上限即安全熔断。" },
    { moduleSlug: "wechat-native-backup", ask: "微信正在聊天时备份，数据库会不会损坏？", effect: "微信备份会完整复制 SQLite 的 -wal 与 -shm 伴生日志文件，保留已提交事务；但运行中复制仍存在底层未刷盘风险，因此恢复后必须由用户登录官方客户端亲自确认。" },
    { moduleSlug: "recovery-and-tasks", ask: "换了新电脑，解压备份后为什么 Xshell 和部分软件找不到配置？", effect: "注意两大陷阱：必须将新电脑的“文档”重定向到 E:\\Documents（旧系统固化位置），且新建 Windows 用户名必须保持 10979，否则绝对路径会全部失效。" },
    { moduleSlug: "recovery-and-tasks", ask: "新电脑可以直接把备份里的任务计划 XML 全部导入吗？", effect: "严禁通配批量导入；旧任务中可能含有历史已退役的路径或 H 盘写入脚本，必须参照 PCConfig 的恢复手册逐项核对后重建。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码与规则）", proves: "PUBLIC main 稳定提交 b545c90；包含完整采集、系统导出、微信增量、网络代理继承、安全恢复脚本与 sources.psd1 数据清单。", doesNotProve: "源码提交不证明新机器已完成端到端灾难恢复演练，也不证明云端所有历史对象完整无缺。" },
    { layer: "Tests（隔离自动化测试）", proves: "8 套 PowerShell 自动化测试通过全部断言，严密验证了公开防泄露门禁、Docker 小范围采集、H 盘冷备隔离、无窗口任务代理继承与微信预检回滚。", doesNotProve: "测试运行在本地沙箱 fixture 中，不模拟真实硬盘物理损坏、停电或网络完全中断等灾难现场。" },
    { layer: "Runtime（当前系统运行态）", proves: "2026-09-04 回读本地 out\\latest.zip 与多份日期归档健全；G:\\80_Backup\\WLY 热备在线；Windows 计划任务注册正常且最近运行退出码均为 0；Google Drive 远端绑定已配置。", doesNotProve: "计划任务最近成功不证明未来永远不会遇到网络断开或磁盘写满；云端文件哈希一致不代表官方微信客户端免登录直接可用。" },
    { layer: "Recovery（恢复与容灾边界）", proves: "Restore-WeChat.ps1 在目标存在时能够可靠创建 .pre-restore-* 回滚目录，两大致命陷阱已在技术文档与清单中明确警示。", doesNotProve: "不证明用户在重装后可以跳过官方微信的扫码登录与设备验证，不承担微信官方反作弊或账号安全风险。" }
  ],
  operationalEntrypoints: [
    { name: "手动执行本地与 G 盘热备", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Local,Hot", purpose: "零流量快速生成本地 latest.zip 并镜像同步至 G 盘在线热备目录。" },
    { name: "手动触发 Google Drive 上传", command: "powershell -File .\\Backup-DevConfig.ps1 -Tier Drive", purpose: "仅在 SHA 发生变动且网络通畅时增量上传 Drive；可加 -Force 强制重新校验上传。" },
    { name: "微信数据热备增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Hot", purpose: "通过 robocopy /E 快速向 G:\\80_Backup\\WeChat 刷新原生目录，零流量保全原应用数据。" },
    { name: "微信数据云端增量同步", command: "powershell -File .\\Backup-WeChat.ps1 -Target Drive", purpose: "通过 rclone copy --checksum 逐文件校验增量上传云端，默认 8G 流量熔断保护。" },
    { name: "微信恢复只读安全预检", command: "powershell -File .\\Restore-WeChat.ps1 -Target E:\\Documents\\xwechat_files", purpose: "默认只读检查备份源完整性、目标目录状态与已知进程，绝不产生任何磁盘写入。" },
    { name: "微信恢复显式回填与回滚隔离", command: "powershell -File .\\Restore-WeChat.ps1 -Execute -ReplaceExisting -Target E:\\Documents\\xwechat_files", purpose: "在确认微信关闭后安全回填数据，现有目录自动保留为 .pre-restore-* 回滚副本。" },
    { name: "查看全盘备份新鲜度与状态", command: "powershell -File .\\Backup-Status.ps1", purpose: "综合控制台：一键输出计划任务结果、本地/G盘包新鲜度、Drive 上次成功时间与最新日志。" },
    { name: "重建常规自动化计划任务", command: "powershell -File .\\Setup-ScheduledTasks.ps1", purpose: "在当前 Windows 计算机上幂等注册 4 项核心备份任务，固定兼容 powershell.exe。" }
  ],
  evolution: [
    { date: "2026-06-23—2026-07-08", commit: "基础架构与清单数据驱动", result: "建立 sources.psd1 数据驱动采集核心，分离可重下软件，建立本地、G 盘与 Google Drive 三层备份体系。" },
    { date: "2026-07-09—2026-07-27", commit: "安全防泄露门禁与冷备隔离", result: "建立 Assert-NoBackupArtifacts 机械门禁杜绝密钥进仓库；明确 H 盘为冷备介质并禁止计划任务直写；引入无窗口代理继承。" },
    { date: "2026-08-27—2026-08-31", commit: "微信原生恢复预检与回滚闭环", result: "实现 Restore-WeChat 只读预检与 .pre-restore-* 回滚保护；强化 rclone 远端 binding 失败关闭；完善 8 套自动化安全契约测试。" }
  ],
  snapshotUpdateNote: "本页绑定 2026-09-04 的 PUBLIC 源提交 b545c90、真实运行态回读与 8 套自动化测试证据。后续仅在备份源范围、分层架构、微信增量策略或恢复安全边界发生实质变动时刷新；本仓库不收录任何真实密钥或备份压缩包。"
};

export const devconfigBackupModules = [
  {
    slug: "tiered-distribution",
    shortTitle: "分层与云校验",
    title: "本地零流量、G 盘在线热备与 Google Drive 云端校验和分层架构",
    teaser: "本地包零流量兜底，G 盘承担日常自动主力，Google Drive 在 SHA 变化且有网时增量同步；H 盘冷备由 PCConfig 统一维护，日常严禁直写。",
    status: "生产运行态正常；G 盘热备在线，Drive 绑定就绪且 SHA 变化才传，H 盘严格冷备隔离",
    statusTone: "good",
    relation: "作为整套灾备的基础介质层，为所有配置包与清单提供本地零流量秒级还原、局域网在线热备与跨地域异地容灾。",
    value: "目标体验非常确定：平时无感自动备份，不耗费白天网速；换机时有本地和局域网快速包，极端意外时有跨国云盘保底。",
    why: "若只把备份存本地，电脑硬盘损坏时全军覆没；若每次备份都无脑往海外云盘上传，每天几十上百兆的重复数据极耗带宽且容易因网络波动中断；若直接把冷备移动硬盘常挂在系统上，又面临勒索病毒与误删风险。",
    example: "每天 21:05 本地任务自动打包并同步至 G 盘（全程零外网流量）；22:00 云端任务唤醒，自动读取系统代理，比对本地与云端哈希；如果今天配置毫无变动，直接跳过上传，真正做到省心无感。",
    result: "形成“本地秒解压 + G 盘局域网热备 + Google Drive 跨国云备”三级梯度，各层互不阻塞，杜绝因网络故障拖垮本地热备的隐患。",
    problem: "防止网络离线或海外云盘受阻导致本地热备无法完成，同时防止冷备介质暴露在日常自动化写入中导致损坏。",
    readerStates: {
      pass: "本地 out\\latest.zip 生成正常，G:\\80_Backup\\WLY 热备在线，Google Drive 绑定已固化且比对 SHA-256 成功才传输，测试全通。",
      problem: "若网络中断或代理失效，Drive 任务安全退出并上报 Task Scheduler 退出码等待重试，不影响已落盘的本地与 G 盘热备。",
      unavailable: "若 rclone-remote-binding.json 损坏或被篡改，Drive 上传流程 fail-closed（失败关闭）拒绝盲目降级，防止将敏感配置误传至未授权远端。"
    },
    decisionImpact: [
      "本地 out/ 保留至少 3 份时间戳历史包（devconfig-YYYYMMDD-HHMMSS.zip）与一份 latest.zip，本地解压零流量秒级完成。",
      "G:\\80_Backup 作为日常计划任务主力（每日 21:05 + 登录后 20 分钟），局域网直连且全程不耗费公网流量。",
      "Google Drive 云端备份在每日 22:00 唤醒，仅当本地与云端 SHA-256 不一致且网络连通时增量上传。",
      "rclone 上传后必须对带日期包和 latest.zip 分别核对远端大小与 MD5（信息摘要算法），双重一致才算上传成功。",
      "H 盘冷备默认 BitLocker 锁定，日常脚本与计划任务严禁直写，仅由 PCConfig 在人工维护窗口从 G 盘刷新。"
    ],
    implementation: [
      "Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。",
      "Initialize-BackupNetwork.ps1 自动从 Windows 系统代理读取当前已启用的代理配置，为后台无窗任务提供网络连通性。",
      "Resolve-ConfiguredRcloneRemote 从 state\\rclone-remote-binding.json 读取用户选定的远端别名，文件损坏或不可读时直接 fail-closed（失败关闭）。",
      "tests/Assert-HDriveSafety.ps1 静态 AST 检查确保所有脚本不含任何 H 盘写路径或已退役的 Usb 参数。"
    ],
    flow: [
      "计划任务或手动触发 Backup-DevConfig.ps1 -Tier Local,Hot。",
      "7-Zip 完成配置打包并生成 latest.zip，计算并记录 latest.sha256。",
      "调用 robocopy 镜像同步至 G:\\80_Backup\\WLY，淘汰超出数量的历史包。",
      "22:00 计划任务触发 -Tier Drive，比对当前 latest.sha256 与上次上传记录 last-uploaded.json。",
      "若哈希变化，调用 rclone 增量上传并核对远端 MD5 与大小，写入 last-drive-success.txt。"
    ],
    concepts: [
      { term: "Tiered Storage（分层存储）", explanation: "将数据按访问频次、恢复速度与灾难级别分别存放于本地 SSD、局域网机械硬盘与海外对象存储。" },
      { term: "Checksum Verification（校验和核验）", explanation: "比对源与目标端的内容哈希，不依赖可能产生时钟漂移的文件修改时间。" },
      { term: "Cold Backup Isolation（冷备物理隔离）", explanation: "通过全盘加密与物理离线切断勒索病毒或自动化故障的写入通道。" }
    ],
    boundaries: [
      "日常脚本与计划任务严禁直接写入 H 盘冷备；冷备仅在人工在场维护窗口由 PCConfig 执行。",
      "Google Drive 同步必须严格读取绑定的合法远端别名，禁止静默切换至未授权云盘。",
      "未通过大小与 MD5 双重校验的云端对象绝不标记为同步成功。"
    ],
    failures: [
      { condition: "Google Drive 远端 binding 文件损坏或格式错误", response: "Resolve-ConfiguredRcloneRemote 立即失败关闭，拒绝回退至第一个可用远端，防止数据错传。" },
      { condition: "夜间定时上传时网络完全中断或系统代理不可用", response: "脚本静默退出并向 Task Scheduler 返回非零退出码，触发系统级定时重试，不影响已完成的本地热备。" },
      { condition: "云端已存在同名但 MD5 不匹配的历史包", response: "记录云端哈希冲突告警，拒绝覆盖历史包，上报异常等待人工介入。" }
    ],
    sources: [
      { path: "Backup-DevConfig.ps1", role: "分层备份主调度脚本，处理打包、本地保留、G 盘镜像与 Drive 同步" },
      { path: "Initialize-BackupNetwork.ps1", role: "代理环境继承与 rclone 远端 binding 安全解析" },
      { path: "Backup-Status.ps1", role: "各级介质新鲜度与计划任务执行状态汇总控制台" },
      { path: "tests/Assert-HDriveSafety.ps1", role: "冷备隔离与禁止直写 H 盘静态 AST 安全检查" }
    ],
    verification: [
      "tests/Assert-HDriveSafety.ps1 静态检查通过，确认无直写 H 盘与已退役 Usb 参数。",
      "本地 out/latest.zip 与多份日期包真实存在，G:\\80_Backup\\WLY 在线热备就绪。",
      "state\\last-drive-success.txt 记录上次成功上传时间戳，状态文件验证幂等性。"
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
        "G:\\80_Backup\\WLY",
        "Google Drive (Backups/WLY)",
        "rclone-remote-binding.json",
        "latest.sha256",
        "H: 驱动器"
      ],
      relations: [
        "本地打包输出zip后通过robocopy镜像至G盘热备",
        "rclone读取binding文件增量上传Google Drive",
        "PCConfig拥有H盘离线冷备维护，本项目流水线不向H盘写入任何数据"
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
    title: "清单数据驱动、170MB 级不可再生配置精选与公开安全门禁",
    teaser: "声明式 sources.psd1 驱动采集；精准避开 PowerToys、JetBrains、Docker 等动辄 GB 级的插件与缓存大坑；机械测试杜绝敏感凭据泄露进 Git。",
    status: "数据驱动规则生效；精选配置约 170 MB（打包后约 65 MB），测试机械拦截敏感数据",
    statusTone: "good",
    relation: "定义哪些核心资产必须保留、哪些垃圾必须丢弃，是把十几 GB 原始环境压缩至约 65 MB 的决策中枢与公开安全屏障。",
    value: "彻底摆脱动辄几十 GB 的整盘镜像与垃圾缓存包，让备份包保持在数十 MB 级别，同时生成可一键还原软件的完整清单。",
    why: "重装新电脑时，软件本身和插件完全可以一键重下，真正丢失就再也找不回的是 API Key、自建 SSH 会话、GPG 私钥与调教好的快捷键。通过 sources.psd1 建立精确白名单与黑名单，把原始数十 GB 的垃圾剔除至约 170 MB；并在公开仓库强制运行 Assert-NoBackupArtifacts 检查，杜绝任何密钥外泄。",
    example: "PowerToys 只备份 AppData\\Local 下 1.3 MB 的配置文件，绝不碰 843 MB 的安装主目录；Docker 只取 CLI 的 config.json 和偏好设置，坚决排除 20+ GB 的 docker_data.vhdx 磁盘镜像；JetBrains 剔除 10.6 GB 的插件与 JDBC 驱动，同时导出插件列表供重装时一键补齐。",
    result: "获得仅约 65 MB 的极致紧凑备份包，上传云端仅需十几秒；同时生成完整的 scoop/winget 导出清单，重装时一条命令补齐全部软件，公开发布 100% 安全。",
    problem: "防止将数十 GB 的 node_modules、浏览器缓存、软件本体与 Docker 磁盘镜像打进备份包，并防止把明文 API Key 与私钥误提交至开源仓库。",
    readerStates: {
      pass: "sources.psd1 解析正常，精准排除 node_modules、缓存与 Docker 磁盘镜像，Assert-NoBackupArtifacts 门禁检测 100% 通过。",
      problem: "若用户在 sources.psd1 中写错了语法（如在受限语言中使用分号），测试与入口解析将报错拦截，防止生成残缺备份包。",
      unavailable: "若 Git 暂存区中误加入了 *.zip、*.reg 或敏感数据库文件，提交前安全检查直接 fail-closed（失败关闭）阻断提交并告警。"
    },
    decisionImpact: [
      "核心数据比对：原始十多 GB 精选后仅约 170 MB，压缩打包仅约 65 MB。",
      "PowerToys 只取 AppData\\Local 下 1.3 MB 的设置，坚决不取 843 MB 的安装本体。",
      "JetBrains 剔除 10.6 GB 的 plugins 与 jdbc-drivers 目录，通过导出 txt 清单实现重装自动下载。",
      "Docker 仅备份 CLI config.json 与 Desktop 偏好，坚决排除动辄几十 GB 的 docker_data.vhdx 磁盘镜像。",
      "FinalShell 只取 conn\\ 会话，PixPin 只取 Config 剔除截图历史，Clash 剔除 34 MB 规则数据库。",
      "AI 聊天历史（如 .claude\\projects）默认排除，仅在指定 -IncludeHistory 时追加打包。",
      "提交前由 Assert-NoBackupArtifacts.ps1 机械扫描 Git candidates，严禁真实 zip、密钥或敏感数据库进入公开仓库。"
    ],
    implementation: [
      "sources.psd1 使用受限 PowerShell 数据语法，声明式组织 HomeFiles, HomeDirs, AppDataDirs, ExcludeDirs 等数组。",
      "Backup-DevConfig.ps1 现生成 env-user.reg, env-machine.reg 与 path-machine.txt 注册表导出。",
      "通过 netsh wlan export profile 自动导出全部 Wi-Fi 配置文件（含密码 XML）。",
      "_manifests 目录现场执行 scoop export, winget export 与 code --list-extensions 生成软件补齐清单。",
      "tests/Assert-DockerScope.ps1 保证 Docker 采集严格限定在白名单小文件内，绝不蔓延至镜像层。"
    ],
    flow: [
      "Backup-DevConfig.ps1 读取 sources.psd1，初始化 staging 临时目录。",
      "逐项采集用户根目录散件、SSH 会话、GPG 私钥与各 AI 工具设置。",
      "实时执行注册表导出、计划任务 XML 复制与包管理器软件清单导出。",
      "robocopy 带 /XD 与 /XF 参数执行严格黑名单过滤，过滤缓存与日志。",
      "调用 7-Zip 高压缩比打包，完成后清理 staging 临时区。"
    ],
    concepts: [
      { term: "Data-Driven Manifest（数据驱动清单）", explanation: "配置规则与代码逻辑解耦，增删备份项只需修改 psd1 数据文件，不动任何执行脚本。" },
      { term: "Signal-to-Noise Ratio（高信噪比备份）", explanation: "剔除所有容易重新下载的大体积二进制与缓存，只保存手工配置的核心状态与凭据。" },
      { term: "Public Safety Gate（公开安全门禁）", explanation: "提交前运行自动化脚本扫描 Git 候选集，遇到任何凭据、密钥或归档包直接阻断提交。" }
    ],
    boundaries: [
      "严格禁止把软件安装目录、IDE 插件二进制包、缓存与 node_modules 打进备份。",
      "严格禁止 Docker Desktop 的 VHDX 磁盘镜像、容器层与运行态进入配置包。",
      "严格禁止任何真实明文密钥、API Key、注册表敏感导出文件被暂存或提交进 Git 仓库。"
    ],
    failures: [
      { condition: "sources.psd1 存在语法错误或非 UTF-8 BOM 编码", response: "PowerShell 5.1 解析失败，脚本立即中断并给出具体语法与代码页提示。" },
      { condition: "Git 暂存区中误加入了备份 zip、reg 或敏感数据库文件", response: "Assert-NoBackupArtifacts.ps1 门禁测试失败，阻断任何提交与发布流程。" },
      { condition: "Docker Desktop 正在生成新的大文件或临时日志", response: "robocopy 黑名单规则自动拦截，确保 staging 目录仅保留小配置。" }
    ],
    sources: [
      { path: "sources.psd1", role: "纯数据驱动的备份源清单与排除黑名单" },
      { path: "_manifests/", role: "包管理器与编辑器插件导出清单目录" },
      { path: "tests/Assert-NoBackupArtifacts.ps1", role: "提交前严查防泄密与备份产物过滤的机械安全门禁" },
      { path: "tests/Assert-DockerScope.ps1", role: "Docker 配置范围严格限定自动化断言测试" }
    ],
    verification: [
      "tests/Assert-NoBackupArtifacts.ps1 全部 PASS，确认 Git 索引内零备份产物与零凭据。",
      "tests/Assert-DockerScope.ps1 验证 Docker 采集仅限小于 1MB 的偏好文件。",
      "真实生成的备份包体积约 65 MB，验证排除规则对 GB 级垃圾目录的拦截效果。"
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
        "为什么备份包只有65MB这么小",
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
    title: "38GB 原生数据逐文件增量、8G 流量熔断与 WAL 持久一致性保障",
    teaser: "约 38 GB 原应用数据不走整包压缩，采用 robocopy 快照与 rclone checksum 逐文件增量同步；保留 SQLite WAL/SHM 伴生文件，内置 8G 流量熔断保险丝。",
    status: "增量同步稳定运行；静态快照与 WAL 伴生日志保全，8G 上传保险丝就绪",
    statusTone: "good",
    relation: "为高频变化且体积庞大的核心社交与工作通讯资产提供专属通道，不阻断轻量配置包并保全数据库一致性。",
    value: "让微信几十 GB 的珍贵历史既不需要每次痛苦压缩几小时，也不会因为边聊边备份导致数据库损坏或跑爆云盘流量。",
    why: "微信聊天记录与音视频媒体文件高达数十 GB，且媒体文件本身已经是高度压缩的有损格式，再做 zip 打包不仅耗费数小时 CPU，压缩率还接近 0；如果直接直传使用中的微信目录，微信随时在写入导致“边传边改”，甚至可能造成上传的数据库不一致损坏。",
    example: "日常聊了一整天产生 500 MB 新图片和文字消息，夜间备份时 robocopy 在本地几秒内同步快照，rclone 仅将这 500 MB 的新增文件上传至 Google Drive，其余 37.5 GB 已上传文件全数跳过，几分钟内轻松收尾。",
    result: "彻底免除大包压缩的漫长等待与磁盘空间双倍占用，让 38 GB 级重型聊天软件实现轻量、平滑、零压力的每日自动增量备份。",
    problem: "防止大体积微信数据阻塞日常配置备份，防止无脑全量打包跑爆海外流量，并确保正在运行的 SQLite 数据库事务完整。",
    readerStates: {
      pass: "本地快照刷新正常，rclone check 比对通过，单次传输未触发 8G 流量封顶，WAL 伴生日志完整保留。",
      problem: "单次增量传输量超过 8G 阈值时触发安全熔断机制，脚本暂停上传并提示用户人工确认，防止异常死循环吞噬云端流量。",
      unavailable: "若微信官方进程正在执行独占性大版本数据库升级或目标驱动器满，任务安全中断并记录日志，绝不破坏现有备份快照。"
    },
    decisionImpact: [
      "约 38 GB 原生 xwechat_files 数据不走压缩打包，避免耗尽 CPU 且无压缩收益。",
      "robocopy 镜像先在本地与 G 盘刷新静态快照，杜绝运行中直传导致的边传边改。",
      "Google Drive 采用 rclone copy --checksum 逐文件比对哈希增量，仅传输新增与变动文件。",
      "设置 -MaxTransfer 8G 默认流量保险丝，防范异常情况下无限循环跑满云存储额度。",
      "严格伴随复制 SQLite 的 -wal 与 -shm 伴生文件，尊重底层持久化规范，不将运行中复制冒充一致性快照。",
      "WeChatDrive-Monitor-Hourly 小时监控任务仅用于首次同步，校验通过后自动禁用。"
    ],
    implementation: [
      "Backup-WeChat.ps1 编排本地快照与云端增量，支持 -Target Hot,Drive 与 -MaxTransfer 参数。",
      "WeChat-Recovery.Common.ps1 统一管理 xwechat_files 目录布局识别与 SQLite 伴生文件定位。",
      "Monitor-WeChatDrive.ps1 监控云端传输状态并在无活跃进程时自动续传，通过 rclone check 闭环后自我禁用。",
      "tests/Assert-WeChatIncrementalIntegrity.ps1 验证校验和比对、流量限制与 WAL 伴生文件的完整性。"
    ],
    flow: [
      "计划任务唤醒 Backup-WeChat.ps1 -Target Hot。",
      "robocopy /E 快速向 G:\\80_Backup\\WeChat 镜像复制增量，几秒内完成本地落盘。",
      "周日 20:00 唤醒 WeChatBackup-Drive-Weekly。",
      "rclone 读取远端 binding，逐文件计算 checksum 并比对 Google Drive 远端。",
      "若单次传输达到 8GB 触发熔断保护；正常完成则运行 rclone check 做抽样核对。"
    ],
    concepts: [
      { term: "File-by-File Incremental（逐文件增量）", explanation: "针对已压缩的多媒体大目录，按单个文件比对哈希只传变动文件，避免整包重新打包。" },
      { term: "Transfer Fuse（流量保险丝）", explanation: "设置硬性传输字节上限，防止网络重试或目录异常时无限消耗昂贵的云端流量。" },
      { term: "WAL Co-preservation（预写式日志伴生保全）", explanation: "SQLite WAL 模式下事务日志未合并入主库，必须与 .db 主库一同同步才能避免丢数据。" }
    ],
    boundaries: [
      "不将约 38 GB 的微信原应用数据打包为单个 zip，全流程采用逐文件增量模式。",
      "单次增量上传设置 8G 流量熔断保护，防止异常死循环吞噬云端额度。",
      "必须伴随复制 SQLite WAL 与 SHM 文件，不把运行中复制冒充官方一致性快照。"
    ],
    failures: [
      { condition: "单次上传传输量超过 -MaxTransfer 8G 阈值", response: "rclone 自动触发熔断并退出，脚本发出高优先级告警，等待用户人工核查。" },
      { condition: "微信正在执行独占性大版本数据库升级或锁库", response: "robocopy 遇到占用文件记录重试，超时后安全退出，绝不产生残损文件写入热备。" },
      { condition: "云端目标路径不可达或网络中断", response: "保留本地静态快照，小时级监控任务在后续窗口自动探测并断点续传。" }
    ],
    sources: [
      { path: "Backup-WeChat.ps1", role: "微信原生应用数据增量备份主流水线" },
      { path: "WeChat-Recovery.Common.ps1", role: "微信目录结构、SQLite 伴生文件与备份源定位通用模块" },
      { path: "Monitor-WeChatDrive.ps1", role: "微信云端上传自愈监控与自动禁用脚本" },
      { path: "tests/Assert-WeChatIncrementalIntegrity.ps1", role: "增量传输、校验和与 WAL 文件完整性测试套件" }
    ],
    verification: [
      "tests/Assert-WeChatIncrementalIntegrity.ps1 全部 PASS，验证增量策略与 WAL 伴生逻辑。",
      "G:\\80_Backup\\WeChat\\xwechat_files 真实存在且文件数量与本地一致。",
      "rclone copy --checksum 在第二次干跑时返回 0 字节传输，验证幂等增量机制。"
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
        "如何防止微信备份一次性跑掉几十G流量"
      ],
      entities: [
        "Backup-WeChat.ps1",
        "xwechat_files (~38GB)",
        "robocopy /E 静态快照",
        "rclone copy --checksum",
        "-MaxTransfer 8G 保险丝",
        "SQLite .db / -wal / -shm",
        "Monitor-WeChatDrive.ps1"
      ],
      relations: [
        "robocopy先向本地和G盘刷新静态快照",
        "rclone按checksum向Drive增量传输新增文件",
        "Monitor-WeChatDrive在首次同步完成后自愈并自动禁用"
      ],
      failureRecovery: [
        "传输达到8G时触发熔断保护停止上传",
        "SQLite WAL伴生文件随主库一同复制避免事务丢失"
      ]
    }
  },
  {
    slug: "recovery-and-tasks",
    shortTitle: "重装恢复与调度",
    title: "新机 7 步恢复清单、两大重装陷阱防范与 PowerShell 5.1 调度总线",
    teaser: "7 步极简灾难恢复流水线；牢记 Documents 位于 E 盘与用户名必须是 10979 两大避坑；Restore-WeChat 只读预检回滚与系统任务计划原生调度。",
    status: "恢复脚本与调度套件就绪；预检回滚机制健全，两大恢复陷阱已在技术文档中明确规避",
    statusTone: "good",
    relation: "把分散的配置包与增量数据转换为新机器上可落地的生产力，是决定整个灾备系统能否真正生效应急的终极交付层。",
    value: "让换电脑或重装系统从数天的混乱排错，变成可以在半小时内胸有成竹、按部就班走完的确定性工程。",
    why: "系统崩溃或新装机后，很多人不知道先装什么后回填什么，导致环境变量冲突；更常见的是忽视了路径陷阱：重装后 Documents 默认指向 C 盘导致大量软件读不到工程，或者新机器换了用户名导致所有硬编码绝对路径全部失效；微信直接无脑覆盖更有冲掉最新数据的风险。",
    example: "在新机桌面打开终端，先用 scoop/winget 导入补齐软件；解压 latest.zip 回填 home 和 appdata；把 Documents 指向 E:\\Documents；双击导入 env-user.reg 还原环境变量；运行 Restore-WeChat 只读预检确认无误后显式回填，登录微信确认聊天记录完整，半小时满血复活。",
    result: "彻底消除了换新电脑或系统灾难时“无从下手、提心吊胆、反复返工”的心理负担，把数天的混乱排障压缩为确定性的半小时标准化作业。",
    problem: "防止重装新系统后盲目覆盖导致已有数据丢失，防止因 Documents 路径或用户名不一致导致软件配置失效。",
    readerStates: {
      pass: "Restore-WeChat 预检顺利通过，无活跃冲突进程，回滚目录创建机制正常，计划任务使用 powershell.exe 稳定注册。",
      problem: "若新机器用户名与原系统（10979）不一致，或 Documents 未正确重定向，部分硬编码绝对路径软件可能报错，需人工执行文本替换或目录重定向。",
      unavailable: "若恢复目标目录已存在非空文件且未指定 -ReplaceExisting，恢复脚本拒绝继续写入并 fail-closed（失败关闭），确保绝不意外抹除现场文件。"
    },
    decisionImpact: [
      "新电脑极速 7 步恢复 SOP（标准作业程序）：装工具→解压最新包→回填目录→导入注册表与网络→预检微信→重挂任务。",
      "避坑陷阱 1：旧系统将“文档”重定向至 E:\\Documents，重装后必须重新定向，否则 Xshell/Navicat 会读到空目录。",
      "避坑陷阱 2：Windows 新用户名必须保持 10979，防止硬编码绝对路径的大量软件与脚本失效。",
      "Restore-WeChat.ps1 默认只读预检，显式执行时目标非空必须强制生成 .pre-restore-* 回滚目录。",
      "标记状态 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，由用户登录官方客户端确认历史，绝不用脚本退出码冒充恢复。",
      "计划任务必须使用 powershell.exe（Windows PowerShell 5.1），解决 Store 版 pwsh 无法被 Task Scheduler 调用的系统缺陷。"
    ],
    implementation: [
      "Restore-WeChat.ps1 提供 -Execute, -ReplaceExisting 与 -BackupRoot 参数，多重防御覆盖事故。",
      "Setup-ScheduledTasks.ps1 配合 ScheduledTask-Registration.Common.ps1 幂等注册 4 项定时任务与监控任务。",
      "Hidden VBS 启动脚本（Backup-DevConfig-Hidden.vbs 等）隐藏黑框并完整保留并透传退出码。",
      "tests/Assert-WeChatNativeRecovery.ps1 模拟预检、回滚目录生成与非空目录保护逻辑。"
    ],
    flow: [
      "新电脑安装 Scoop、Winget、VS Code、PowerShell 与 rclone。",
      "取回 latest.zip 解压，将 home/ 与 appdata/ 回填至当前用户目录。",
      "重定向“文档”到 E:\\Documents，并验证当前用户名是否为 10979。",
      "双击导入 env-user.reg、env-machine.reg 与 xshell.reg，导入 Wi-Fi 配置文件。",
      "运行 Restore-WeChat.ps1 执行只读预检，确认微信关闭后显式回填，登录官方客户端核对历史。",
      "运行 Setup-ScheduledTasks.ps1 挂上日常定时任务，恢复自动化运行。"
    ],
    concepts: [
      { term: "Idempotent Task Registration（幂等任务注册）", explanation: "无论运行多少次，只更新或确保计划任务处于正确配置，不产生重复实例或脏状态。" },
      { term: "Human Acceptance Gate（人工在场验收门）", explanation: "对于专有通讯软件，文件拷贝完成不等于数据可用，必须由真人登录官方应用最终确认。" },
      { term: "Pre-restore Rollback（恢复前回滚隔离）", explanation: "在向目标目录写入前，将已有目录重命名归档为 .pre-restore-*，确保恢复可逆。" }
    ],
    boundaries: [
      "新电脑恢复严禁跳过 Documents 重定向至 E:\\Documents 与用户名 10979 核验两大致命陷阱。",
      "严禁通配批量导入历史任务计划 XML，必须按 PCConfig 重建手册逐项核对。",
      "Restore-WeChat.ps1 在未经用户显式确认官方微信关闭前严禁写入，目标非空必须保留回滚副本。",
      "文件复制完成仅标记 COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE，严禁冒充微信恢复成功。"
    ],
    failures: [
      { condition: "恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting", response: "脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。" },
      { condition: "新机用户名与旧系统不匹配或 Documents 位于 C 盘", response: "文档与清单明确提示人工修改路径映射或重定向文档目录，防止软件配置加载为空。" },
      { condition: "Windows 任务计划无法拉起 Microsoft Store 版 pwsh", response: "注册器固定使用系统内置 powershell.exe（PowerShell 5.1）作为执行环境。" }
    ],
    sources: [
      { path: "Restore-WeChat.ps1", role: "微信灾难恢复总线，提供只读预检与回滚保护" },
      { path: "Setup-ScheduledTasks.ps1", role: "Windows 任务计划程序常规任务幂等注册器" },
      { path: "ScheduledTask-Registration.Common.ps1", role: "任务计划 XML 解析与安全注册通用逻辑" },
      { path: "tests/Assert-WeChatNativeRecovery.ps1", role: "预检、回滚与人工验收状态断言自动化测试" },
      { path: "tests/Assert-ScheduledTaskRegistrationSafety.ps1", role: "任务注册事务性与执行器路径安全测试" }
    ],
    verification: [
      "tests/Assert-WeChatNativeRecovery.ps1 全部 PASS，验证只读预检与 .pre-restore-* 回滚生成。",
      "tests/Assert-ScheduledTaskRegistrationSafety.ps1 验证任务使用原生 powershell.exe 且无弹窗。",
      "系统导出的注册表与 Wi-Fi XML 经语法校验无损坏，可直接双击或经由 netsh 还原。"
    ],
    searchAliases: [
      "新机恢复指南",
      "重装两大陷阱",
      "Documents在E盘",
      "10979用户名",
      "Restore-WeChat.ps1",
      "Setup-ScheduledTasks.ps1",
      "PowerShell 5.1计划任务兼容"
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
        "powershell.exe (5.1)"
      ],
      relations: [
        "Restore-WeChat默认只读预检并在-Execute时回填微信",
        "Setup-ScheduledTasks幂等注册4个常规任务与自愈监控",
        "新机恢复严格按7步流程推进并规避两大路径陷阱"
      ],
      failureRecovery: [
        "目标非空时强制保留为.pre-restore-*回滚备份",
        "Store版pwsh失败时自动回退系统内置powershell.exe"
      ]
    }
  }
];

export const project = devconfigBackupProject;
export const modules = devconfigBackupModules;
