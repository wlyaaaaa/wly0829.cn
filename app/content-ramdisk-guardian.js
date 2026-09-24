import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["正常工作", "发现问题", "暂不可用"];
const sourceCommit = "e058a7fd11907dfd6eafea6ee3c9821a4778e5a8";

export const ramdiskGuardianSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T12:53:00Z",
  label: "缓存盘维护正常；重建须持续压力、消费者空闲和冷却通过，窗口可暂停",
  boundary: "只读回读现行源码/任务/健康：目录和说明一致，最近任务0；没有初始化实盘、压缩镜像或重启。合作式消费者租约不能证明所有旧浏览器均已接入，驱动实际分配内存和速度提升未知。",
  metrics: [
    { label: "内存盘", value: "12 GiB · 8 GiB 缓存软上限" },
    { label: "当前空间", value: "已用0.51 GiB · 空闲11.49 GiB" },
    { label: "自动巡检", value: "登录后 · 每 15 分钟" },
    { label: "最近状态", value: "OK · 任务返回 0" }
  ],
  facts: [
    { label: "源版本", value: `PUBLIC main ${sourceCommit} 已正常推送并远端回读，源工作区干净。修复了旧容量提示、自定义盘符仍重建0号盘，以及驱动命令失败却报告完成的问题。` },
    { label: "实际磁盘与镜像", value: "2026-09-14只读识别Z: / RAMDISK / Healthy（健康），总12883849216字节、剩余12695658496字节；镜像E:\\RamdiskImage\\Z.vdf仍12874547712字节。Primo的0号Z映射、12288MB、SCSI、DMM（动态内存管理）、非临时及Load & Save（加载和保存）/Shutdown Save（关机保存）设置保留9月8日证据，本次未重证映射。" },
    { label: "任务与健康分别读取", value: "2026-09-18只读健康为正常，原RAMDisk_Code_Backup任务Ready/最近0，登录与每15分钟检查、源码与当前观察一致；已用0.51GiB、空闲11.49GiB、提交余量31.2GiB，无已登记活动消费者。无已登记消费者不等于所有应用完全没用Z，重建仍先检查合作式租约和实际证据。" },
    { label: "目录与应用接入", value: "守护器维护12个明确目录：Caches及Personal、Work、ChromeCache、ChromeCodeCache、ChromeGPUCache、360zip_temp、WeFlow，Scratch及Personal、Work，以及TEMP。Chrome的Cache、Code Cache、GPUCache现场均为指向对应Z目录的junction（目录连接）。WeFlow目录存在不单独证明其当前进程已使用该缓存。" },
    { label: "说明与自然定时运行", value: "修复后现有任务自然执行，Z:\\使用说明.md与仓库Z_使用说明.md的SHA-256同为8557ED61B35E48E522C8354A5F5CC0550903EFA2D807D92D53D573F35F6CADC9。无需复制另一套安装代码，隐藏启动器直接使用当前仓库脚本。" },
    { label: "源码与行为验证", value: "当前正式源码e058a7fd提供持续压力复核、消费者租约、冷却与效率说明；原9月8日双PowerShell静态/隔离Primo测试保留原日期。本网页未重建真实缓存盘、计算速度提升或证明自然重启后全部应用恢复。" },
    { label: "启动证据边界", value: "最近系统启动为2026-09-14T00:33:06.5Z；启动后已观察自然任务OK、卷标签正确、12目录及说明一致。快速启动关闭和Primo镜像设置保留9月8日观察；本次没有专门重启，也未验每项应用缓存和完整Primo保存恢复流程。" }
  ],
  gaps: [
    "cache-only（仅缓存）是使用约定，不是文件拦截器。误放进去的唯一数据仍可能丢失；守护器不备份、不恢复个人文件，也不会审查每个缓存的内容。",
    "不可归属内存是带共享页计数误差的估算，不能单独证明某个驱动泄漏；重建也不承诺固定释放量、固定耗时或活动应用零中断。",
    "最近一轮已恢复OK，只证明该轮没有达到告警阈值。守护器不会关闭应用、调分页文件或替所有进程解决内存压力，之后仍可能出现新的WARN。",
    "生产初始化/保存与本轮自然重启恢复未重做；已验证源码、隔离失败处理、现有安装映射和自然任务运行，分别陈述。"
  ]
});

export const ramdiskGuardianProject = {
  order: 32,
  slug: "ramdisk-guardian",
  usageEntry: "先按 DEPLOY.md 配好 Primo 内存盘并部署守护任务；日常在已接通这台电脑的 AI 对话中问“Z 盘上次巡检怎样”，AI 读取 STATUS 与日志。",
  usageInputs: ["要接入的应用","确定可丢的缓存","这次要安装、查状态还是暂停恢复"],
  title: "RamdiskGuardian",
  kicker: "内存盘只放缓存，自动重建不抢正在工作的程序",
  lead: "让 Z 盘专心放缓存，缺目录就补，内存异常有记录",
  route: "/projects/ramdisk-guardian",
  visibility: "公开仓库",
  repositoryNote: "公开仓库保存守护与部署脚本、使用说明和回归测试。本机运行日志、Primo镜像及应用缓存不随代码入库；网页根据本轮只读回读展示状态，不是实时控制台。",
  statusTone: "accent",
  badge: "工具 / 缓存守护",
  summary: "让12 GiB内存盘只放可重建的缓存，定期补齐目录、更新说明并看空间与内存余量。即使出现压力，也要连续确认、排除活动消费者并通过冷却条件，才尝试重建，避免一时波动就把正在使用的缓存清掉。现有管理窗口能看状态、暂停自动重建或停用守护；真实原件仍放在持久磁盘，工具不替误放的唯一文件做备份。",
  why: "内存盘读写快，但它占用的仍是电脑内存。过去把正式文件放进去并做镜像备份，曾发生空源覆盖备份的问题；本机还遇到过Primo删文件后仍占着历史高水位内存。现在把正式资料留在持久磁盘，只让Z承载可再生成缓存，再用容量上限、巡检和有限的重建流程处理这些具体问题。",
  plainExample: "“浏览器缓存继续用，但今天有长任务，先别自动重建内存盘。”可以在现有管理窗口暂停重建，目录维护和健康检查继续；长任务登记自己的使用租约。恢复自动模式也不清掉冷却时间，程序不会因一条警告就清盘。",
  result: "得到一块有容量预算、目录可恢复、问题有记录的缓存盘。它不接管所有应用的缓存管理，也不会把RAM Disk变成可靠文件仓库；是否值得把新缓存搬进去，要看实际工作负载是否有可感知收益。",
  cardStatus: "维护正常；自动重建可暂停，活动使用与冷却单独核对",
  cardStatusTone: "accent",
  ...ramdiskGuardianSnapshot,
  searchAliases: ["RamdiskGuardian", "Z盘", "内存盘", "缓存守护", "Primo Ramdisk", "内存不释放", "缓存目录恢复"],
  searchProjection: {
    intents: ["Z盘应该放什么缓存", "内存盘的缓存目录没了如何恢复", "内存盘WARN为什么不弹窗", "Primo删除缓存后内存不释放", "重新安装缓存盘和计划任务"],
    entities: ["RamdiskGuardian", "RAMDisk_Code_Backup", "Primo Ramdisk", "zguardian.ps1", "rxprd.exe", "Z_使用说明.md"],
    relations: ["PCConfig规定E/V/Z存储放置，RamdiskGuardian执行缓存盘守护", "Chrome通过目录连接使用Z缓存，Primo负责磁盘和镜像"]
  },
  readerStates: {"pass":"内存盘身份正确、基础目录可用，最近一轮资源检查没有达到警告条件；缓存内容仍由各应用自己生成。","problem":"资源紧张先留下安静提示。是否重建还要检查持续时间、使用者、本人暂停和冷却；失败时说明已经动过哪一步。","unavailable":"盘未出现、身份不匹配或无法确认 Primo 目标时停止重建；唯一资料若误放在内存盘，守护器无法凭空恢复。"},
  components: [
    { name: "Primo Ramdisk", responsibility: "提供内存盘和镜像加载/保存", implementation: "本机12288 MB动态内存盘、非临时、NTFS、RAMDISK卷标；镜像位于E:\\RamdiskImage\\Z.vdf。守护器使用其rxprd命令，不实现另一个磁盘驱动。" },
    { name: "zguardian.ps1", responsibility: "等待盘、补目录和说明、检查健康并处理有条件重建", implementation: "读取Get-Volume、CIM和性能计数器，维护STATUS、日志及.lasthealth；重建前解析Primo实际磁盘编号并检查命令结果。" },
    { name: "deploy.ps1 / run_hidden.vbs", responsibility: "安装现有计划任务并隐藏运行窗口", implementation: "部署需要管理员，关闭快速启动，注册登录及定期触发；VBS等待Windows PowerShell退出并传递结果。Chrome运行时跳过缓存链接调整。" },
    { name: "Z_使用说明.md", responsibility: "把使用约定放在盘根，方便直接查看", implementation: "使用SHA-256比较仓库源与盘根说明，内容变化或目标缺失时同步；不借此检查其他文件。" },
    { name: "两份PowerShell测试脚本", responsibility: "检查现有约定和恢复失败分支", implementation: "Assert-RamdiskGuardianStatic.ps1检查15项静态约定；Test-RamdiskGuardianRecovery.ps1在临时目录和假的Primo进程上执行生产恢复分支的10种情形。" }
  ],
  operationalEntrypoints: [
    { name: "先看最近健康记录", command: "Get-Content E:\\Projects\\Tools\\RamdiskGuardian\\logs\\STATUS.txt; Get-Content E:\\Projects\\Tools\\RamdiskGuardian\\logs\\guardian.log -Tail 20", purpose: "只读查看空间、可用内存、提交余量、不可归属内存估算，以及最近有没有发生重建。" },
    { name: "看计划任务是否正常执行", command: "Get-ScheduledTask RAMDisk_Code_Backup; Get-ScheduledTaskInfo RAMDisk_Code_Backup", purpose: "把Ready/Running和LastTaskResult与STATUS一起判断；0不是健康全绿的充分证据。" },
    { name: "执行一次完整守护", command: "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\RamdiskGuardian\\zguardian.ps1", purpose: "这会创建缺失目录、同步说明，并在满足阈值时尝试重建缓存盘。它不是只读健康检查；驱动命令需要管理员权限。" },
    { name: "部署或恢复计划任务", command: "E:\\Projects\\Tools\\RamdiskGuardian\\deploy.ps1", purpose: "在已创建Primo磁盘后以管理员运行；默认Z和15分钟，可选-RamDrive单字母与-IntervalMinutes。会修改快速启动、任务及适用的Chrome缓存链接。" },
    { name: "只读确认Primo磁盘编号", command: "& 'C:\\Program Files\\Primo Ramdisk\\rxprd.exe' ls", purpose: "在管理员上下文查看磁盘编号和盘符；当前0号盘为Z，不把这个编号当成所有机器和自定义盘符的固定值。" },
    { name: "验证源码和隔离恢复行为", command: "pwsh -NoProfile -File E:\\Projects\\Tools\\RamdiskGuardian\\tests\\Assert-RamdiskGuardianStatic.ps1; pwsh -NoProfile -File E:\\Projects\\Tools\\RamdiskGuardian\\tests\\Test-RamdiskGuardianRecovery.ps1", purpose: "不初始化真实内存盘，检查既有约定与成功、失败、目标不明确等恢复分支。" },
    {
      "name": "可见维护与重建暂停",
      "command": "E:\\PCConfig\\tools\\Show-StreamingMaintenance.ps1; Set-RamdiskRecoveryMode.ps1 -Mode Pause -Apply -Json",
      "purpose": "窗口只读打开；暂停只阻止自动重建，目录与健康仍维护，恢复不清冷却。"
    },
  ],
  technicalContracts: [
    { artifact: "E/V/Z放置策略", schema: "Markdown规则，无独立schema文件", owner: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", boundary: "E是现有稳定层，V是新项目/开发层，Z只接纳有界可再生成热缓存；不是批量搬迁已有项目的命令。" },
    { artifact: "缓存盘目录与阈值", schema: "zguardian.ps1中的目录数组和数值常量", owner: "RamdiskGuardian", boundary: "保留12目录、8GiB缓存软上限及原内存阈值；压力至少10秒取3次连续样本，间隔超过30秒重新确认。活动/未知消费者、暂停或冷却阻止重建，不能只靠一拍低内存触发。" },
    { artifact: "健康与执行结果", schema: "STATUS.txt / .lasthealth / guardian.log / alerts.log", owner: "Set-Health与Windows计划任务", boundary: "health.json同目录原子替换并保留previous，STATUS.txt兼容；检查任务启用、周期、观察时间、实际源码哈希和卷。WARN可完成并返回0但不是健康PASS，关键ERROR非零，日志有界轮转。" },
    { artifact: "Primo恢复命令", schema: "rxprd ls / init <index> -s / save <index> -s", owner: "Primo命令行与守护器恢复分支", boundary: "唯一盘符映射后才初始化；命令或骨架恢复失败终止本次恢复，不能继续记完成。无新增事务、服务或数据格式。" }
  ],
  evidenceLayers: [
    { layer: "源码与隔离回归", proves: "已验证源提交、15项静态约定、10种生产恢复分支夹具，并复现修复前的假完成。", doesNotProve: "不证明真实驱动重建耗时、释放内存量或活动应用恢复效果。" },
    { layer: "当前安装与只读实机状态", proves: "9月14日已回读Z卷容量、12目录、说明、镜像大小及04:03Z自然任务OK；Primo映射/镜像选项和Chrome三个连接仍为9月8日历史证据。", doesNotProve: "不证明没有其他进程内存问题，也不证明任意新应用已接入Z。" },
    { layer: "修复后的自然任务运行", proves: "现有任务直接调用当前仓库脚本，03:37轮自然执行返回0，更新后的盘根说明与源哈希一致。", doesNotProve: "该轮没有触发紧急重建，也不是一次重启恢复演练。" },
    { layer: "源码发布与网页", proves: `源main ${sourceCommit}已远端回读；README/DEPLOY对应PDF已重新生成、提取文字并逐页视觉检查。`, doesNotProve: "源仓库发布本身不证明网页部署；两种发布分别回读。" }
  ],
  productPrinciples: [{"title":"先保证丢的是缓存","detail":"正式文件留在持久磁盘，内存盘只放能重建的内容；这个约定不会自动拦住误放进去的资料。"},{"title":"有真实收益才迁入","detail":"已有高速硬盘，新应用只有在实测读写问题、可承受缓存丢失且容量有界时才值得使用内存盘。"},{"title":"警告安静记录，各应用自己清过期内容","detail":"普通警告写入状态，严重故障变化才尝试提醒；守护器不杀应用，也不替它们挑选旧缓存删除。"},{"title":"重建有条件，效果另查","detail":"先认准盘和使用者，再按步骤处理；工具报告成功不等于每个应用无感，也不等于一定释放了足够内存。"}],
  responsibilities: ["内存盘到达后补齐缓存目录和使用说明。","定期记录盘空间与主机内存，普通警告留在状态和日志，不打断当前工作。","确认持续内存压力且无人占用时，才按现有规则尝试重建指定的 Primo 缓存盘。","说明如何部署任务、接入应用缓存、暂停恢复及在自然重启后分别验收。"],
  exclusions: ["不承载正式Git仓库、唯一文档、数据库、模型、凭据或备份。", "不把系统全局TEMP/TMP、Docker/WSL和无界包缓存迁入Z。", "不做整盘定时清空，不替缓存生产者制定内容保留期。", "不保证新缓存一定更快，不保证驱动重建无感或能解决全部系统内存压力。"],
  glossary: [
    { term: "RAM Disk（内存盘）", meaning: "用物理内存提供一个磁盘。当前Primo设置可加载/保存镜像，但本项目仍只信任它保存可再生成缓存。" },
    { term: "cache-only（仅缓存）", meaning: "只放可以丢弃并重新生成的对象；这是一条使用约定，不是自动阻止正式文件写入的机制。" },
    { term: "DMM（动态内存管理）", meaning: "Primo按需分配内存的功能。本机曾观察到文件删除后驱动仍持有历史高水位占用。" },
    { term: "Unaccounted Memory（不可归属内存估算）", meaning: "总已用物理内存减去进程工作集、内核池、缓存和修改页等计数的差值。共享页可能重复计数，因此会为负，不能当作精确泄漏量。" },
    { term: "Commit Headroom（提交余量）", meaning: "Windows提交限制减去已提交字节数，用来观察还能承受多少新的内存申请。" },
    { term: "junction（目录连接）", meaning: "让应用原来的缓存路径指向另一个目录；应用仍走原路径，实际内容位于Z。" },
    { term: "scratch（临时工作区）", meaning: "只保留可再生成的测试或中间输出，结束后由创建它的工具清理。" },
    { term: "robocopy /MIR（镜像同步）", meaning: "使目标结构与源一致，也会删除目标中源端没有的内容。它已退出本项目现役备份逻辑。" }
  ],
  failures: [
    { condition: "Z在150秒内没有出现，或卷标不是RAMDISK", response: "记录ERROR并停止本轮后续盘操作；先核对实际磁盘和Primo设置，不把它直接诊断为许可证、驱动或用户数据损坏。" },
    { condition: "空间或内存达到提醒阈值", response: "保留具体数值和WARN；若不满足自动重建条件，继续保留缓存，不能因为看到WARN就立即清盘。" },
    { condition: "Primo列表没有唯一目标、命令失败或恢复说明失败", response: "重建分支记录ERROR并非零退出，不继续报告完成。已经初始化后再保存失败可能留下已清空缓存盘，需要根据失败阶段处理。" },
    { condition: "缓存生产者正在用已失效的缓存", response: "让对应应用重新加载或按它自己的恢复办法处理；守护器只补盘上目录，不能证明旧文件句柄和应用状态已恢复。" }
  ],
  sources: [
    { path: "README.md", role: "当前职责、容量预算和2026-07-23本机DMM事故背景。" },
    { path: "zguardian.ps1", role: "现役目录、阈值、健康、Primo映射及恢复执行实现。" },
    { path: "deploy.ps1", role: "部署任务、快速启动和Chrome连接的真实行为。" },
    { path: "run_hidden.vbs", role: "隐藏窗口、等待脚本结束和传递退出码。" },
    { path: "Z_使用说明.md", role: "仓库规范源，自动同步到Z根目录。" },
    { path: "DEPLOY.md", role: "安装前置、12GiB现役配置、验证与任务回退。" },
    { path: "tests/Assert-RamdiskGuardianStatic.ps1", role: "15项静态约定。" },
    { path: "tests/Test-RamdiskGuardianRecovery.ps1", role: "10个隔离恢复分支场景，执行生产代码而不初始化实盘。" },
    { path: "logs/STATUS.txt / logs/guardian.log", role: "本机运行证据，日志不入Git。" }
  ],
  technicalOperatingFlow: [
    { title: "先配置可丢的缓存使用者", detail: "Primo创建内存盘，应用接入自己的缓存目录；正式资料仍在持久磁盘。" },
    { title: "登录或定时运行", detail: "旧名RAMDisk_Code_Backup的任务通过VBS调用守护脚本，每15分钟一轮，重叠运行被忽略。" },
    { title: "找到盘并补基础目录", detail: "等待最多150秒、检查单字母盘符和RAMDISK卷标，补12个目录、同步说明并写隐藏标记。" },
    { title: "检查资源与必要恢复", detail: "读取空间与内存，持续压力复核后检查消费者、暂停、冷却与精确Primo/卷身份；满足条件才重建并回读目录、说明和命令结果，收益不足或未知不宣称有效释放。" },
    { title: "留下可读结果", detail: "STATUS保存最新状态，guardian.log保存过程；WARN静默，进入ERROR时尝试发出一次桌面提示。" }
  ],
  operatingFlow: [{"title":"先只接可丢缓存","detail":"Primo 建好 RAM 盘，应用把明确可再生缓存放 Z；正式资料仍在持久磁盘。"},{"title":"守护器定期检查","detail":"登录或周期任务等盘出现、补基础目录并留下 STATUS；普通内存警告不弹窗。"},{"title":"异常才考虑重建","detail":"持续压力、无活动消费者、未暂停和唯一磁盘身份都满足时，才尝试释放并回读收益。"},{"title":"重启后另行验证","detail":"部署、应用接入、自然启动的盘镜像恢复分开确认，脚本通过不等于每层都通过。"}],
  usageExamples: [
    { ask: "这个新缓存值得搬进Z盘吗？", effect: "先确认可重建、体积有界和实际I/O收益；大型包缓存与正式项目仍去持久开发盘。", moduleSlug: "volatile-cache-contract-and-backup-retirement" },
    { ask: "Z盘重新出现了，缓存文件夹和使用说明怎么补回来？", effect: "守护器检查卷标后补目录，用源文件哈希判断是否同步说明；不恢复旧缓存内容。", moduleSlug: "drive-arrival-sensing-and-skeleton-healing" },
    { ask: "最近有内存警告，但别一直弹窗影响我。", effect: "查看STATUS和日志中的具体阈值，WARN保持静默；任务是否执行和资源是否充足分开判断。", moduleSlug: "host-memory-telemetry-and-silent-monitoring" },
    { ask: "缓存删了，Primo占用的内存却没下来，怎么办？", effect: "先比较真实资源与估算，再检查持续压力、活动消费者和冷却；允许时才尝试重建并量化本次结果。驱动分配量未知或没证明至少1GiB改善，就保留相应未知或更长冷却，不承诺所有应用无感。", moduleSlug: "unaccounted-watchdog-and-driver-auto-release" },
    { ask: "重装后，把缓存盘和自动巡检恢复好。", effect: "先按12GiB配置Primo，再部署现有任务和适用的缓存链接；下一次自然重启再确认加载链。", moduleSlug: "installation-and-application-recovery" },
    {
      "moduleSlug": "volatile-cache-contract-and-backup-retirement",
      "ask": "镜像文件很大，是不是内存也占了这么多？现在用了内存盘到底快多少？",
      "effect": "分别显示逻辑容量、文件使用量、镜像文件分配和可取得的驱动内存。没有真实驱动读数或同条件计时就报告未知，不拿镜像大小推内存或给出虚构加速百分比。"
    },
  ],
  evolution: [
    {
      "date": "2026-06",
      "title": "先把正式文件移出易失空间",
      "commit": "",
      "result": "停止把内存盘当正式数据来源，退出旧镜像备份通道，只让可重新生成的缓存进入。",
      "evidence": [
        {
          "date": "2026-06",
          "note": "旧正式文件备份通道退役，缓存允许重建。",
          "commit": "ecd7111"
        }
      ]
    },
    {
      "date": "2026-07",
      "title": "处理内存占用不回落的真实故障",
      "commit": "",
      "result": "依据本机高水位问题把容量从32 GiB收敛到12 GiB，加入空间、主机内存和驱动占用的分项检查。",
      "evidence": [
        {
          "date": "2026-07-23",
          "note": "实际高水位故障后收敛容量，并区分资源读数与估算。",
          "commit": "a7aee97"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "title": "自动恢复要知道什么时候不该做",
      "commit": "e058a7fd11907dfd6eafea6ee3c9821a4778e5a8",
      "result": "压力需要持续确认，活动消费者和冷却条件会阻止重建；可见窗口保留暂停意图，新增缓存是否值得迁入看实际收益，不为了用满空间而扩张。"
    }
  ],
  snapshotUpdateNote: "2026-09-18只读健康确认目录、说明、现行源码和原任务正常；9月8日隔离Primo测试保留历史。没有真实重建、镜像压缩或自然重启验收，效率与占用指标按各自证据说明。",
  "readerBoundary": "Z盘是12 GiB可重建缓存，不是可靠原件库。暂停重建不等于停止健康与目录维护；误放进去的唯一文件不在本工具备份职责内。",
};

export const ramdiskGuardianModules = [
  {
    id: "volatile-cache-contract-and-backup-retirement", slug: "volatile-cache-contract-and-backup-retirement", order: 1,
    usageEntry: "在为应用配置缓存目录时，先读项目 Z_使用说明，只把可再生缓存指向 Z 盘；正式文件留持久磁盘。",
    usageInputs: ["要接入的应用","确认可丢且能重建的缓存","正式文件要保留在哪里"],
    productFlow: [{"title":"核对应用的数据去向","detail":"AI 或维护入口对照应用设置，确认选中的缓存能重建；任何唯一正文仍留在持久磁盘。"},{"title":"只迁指定缓存","detail":"按应用自己的设置把可丢内容指到 Z，不把盘镜像当备份。"},{"title":"按应用核对恢复","detail":"重启或清空后检查应用能重建；重建会影响当时正在使用缓存的程序。"}],
    readerStatus: "当前只允许有界、可重建缓存使用内存盘；它没有替唯一文件备份或自动识别误放资料的功能。",
    title: "缓存放在哪里，哪些东西不能进Z", shortTitle: "缓存准入与边界", kicker: "只放能重建的缓存，正式资料留在持久磁盘",
    teaser: "先判断值得加速的对象，再给缓存设置体积和生命周期边界。",
    value: "避免为了读写速度，把唯一资料的生存时间绑在内存盘上。",
    status: "当前使用约定", statusTone: "accent",
    why: "历史镜像备份曾在空源时覆盖目标；继续给RAM Disk补备份并不能消除它承担唯一数据的风险。当前做法直接让正式文件退出Z，只保留丢后可重建的内容。",
    example: "“我要跑一个临时测试，能用Z吗？”如果输入和代码已在E或V，Z里只是可再生成且有上限的中间输出，可以评估；如果它会成为唯一一份未提交代码，就留在持久磁盘。",
    result: "得到一块容量受限、只放可重建缓存的内存盘；每个应用仍负责清自己的旧缓存。它不再承担正式文件的备份来源。",
    problem: "这些规则不会自动阻止文件写入。误放进去的唯一资料仍可能在驱动重建时丢失，所以不能把使用约定写成自动数据保护能力。",
    readerStates: {"pass":"选中的内容能完整重建、体积有界，并有真实使用收益，才适合迁入。","problem":"缓存过多时提醒对应应用清理自己的过期内容，不由守护器盲删。","unavailable":"资料丢了不能重建，或内存盘没有实测收益，就继续放在持久磁盘。"}, stateLabels,
    decisionImpact: ["E保留既有项目和恢复锚点；新个人项目默认V:\\Personal\\Projects，而不是把现有项目强制全迁到V。", "不放正式Git仓库、唯一资料、数据库、模型和凭据；不迁系统全局TEMP/TMP、Docker/WSL或无界包缓存。", "Personal/Work仅是组织分区，共享内存盘不产生账号或数据隔离。"],
    concepts: [{ term: "cache-only（仅缓存）", explanation: "丢失可以接受，而且应用能重新生成。不是把文件改名叫缓存就满足条件。" }, { term: "缓存生产者", explanation: "实际创建缓存的应用或工具；由它判断哪些代已过期，任务成功、失败或接管时完成清理。" }],
    implementation: ["源目录数组只包含Caches、Scratch、TEMP及既有子目录，不包含退役的projects/docs/others。", "README与Z_使用说明.md解释准入；静态测试防止旧robocopy和Z_Drive_Backup逻辑重回现役。", "不实现内容分类器或全盘清空计划，8GiB是告警/恢复条件的一部分，不是自动逐文件配额。",
      "cache-efficiency入口把逻辑容量、已用、镜像逻辑/实际分配与DriverAllocatedBytes分开；无法取得可靠驱动计数时为null，SpeedupPercent没有同条件计时则unknown，不从镜像大小推内存或编造性能倍数。",],
    flow: ["确定正式输入与可再生成输出分别在哪里。", "检查体积上限、失效恢复方式和实际I/O收益。", "只让选中的输出使用Z；生产者结束时清理自己的失效内容。"],
    boundaries: ["Primo可能保存镜像，但任何Z内容都不能因此成为唯一可靠副本。", "缓存重建可能影响正在使用缓存的应用，不能承诺无感。"],
    failures: [{ condition: "发现Z里放了唯一文件", response: "在任何重置前转存并验证持久副本；守护器没有文件版本恢复能力。" }, { condition: "长期超过8GiB软上限", response: "检查各生产者自己的有效缓存和清理规则，不按目录外观盲目整盘删除。" }],
    sources: [{ path: "Z_使用说明.md", role: "盘根使用约定。" }, { path: "README.md", role: "角色与历史退役背景。" }, { path: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", role: "机器级E/V/Z放置策略。" }],
    verification: ["本轮静态检查通过，现役脚本没有旧备份通道。", "未全盘审查缓存内容，因此不宣称所有使用者都始终遵守准入。"],
    searchProjection: { intents: ["Z盘放什么", "新缓存要不要迁到内存盘", "为什么不在内存盘保存正式项目"], entities: ["cache-only", "8GiB软上限", "Z_使用说明.md", "RAMDisk_Code_Backup"], relations: ["PCConfig规定放置，应用管理自己的缓存"], failureRecovery: ["唯一文件先转存到持久磁盘并验证，超限由生产者清理失效内容"] },
    relation: "这条边界使后续缓存盘恢复可接受，但它本身不是自动拦截或备份系统。"
  },
  {
    id: "drive-arrival-sensing-and-skeleton-healing", slug: "drive-arrival-sensing-and-skeleton-healing", order: 2,
    usageEntry: "任务部署后会自动巡检；看到盘或目录问题时，在已接通这台电脑的 AI 对话中说“检查 Z 盘有没有到达并补齐缓存目录”。",
    usageInputs: ["要检查哪台电脑的内存盘","看到的缺目录或盘未出现问题"],
    productFlow: [{"title":"等盘真正出现","detail":"一轮最多等待 150 秒，盘符和卷标都匹配才继续。"},{"title":"补缺失骨架","detail":"建立基础目录、同步说明并写就绪标记。"},{"title":"读回状态","detail":"目录存在不等于镜像或自然重启已验收；失败在 STATUS 与日志中说明。"}],
    readerStatus: "缓存目录与使用说明已核对；盘没有出现时守护器不能代替驱动创建或挂载它。",
    title: "等盘出现，再补缓存目录和说明", shortTitle: "目录与说明恢复", kicker: "盘有可能来得晚，目录也可能需要重新生成",
    teaser: "等待最多150秒，核对盘符和卷标，再补12个明确目录。",
    value: "减少重启、掉盘恢复或缓存盘初始化后，需要手工补目录的工作。",
    status: "目录与说明已回读", statusTone: "accent",
    why: "计划任务开始时Primo卷可能还没出现。直接写盘会失败；只按Z这个字母操作也可能碰到意外占用。守护器先等待，再要求RAMDISK卷标。",
    example: "“Z盘回来了，但原来的缓存文件夹没了。”下一轮守护会检查盘、补齐缺失目录，把仓库说明放回根目录。旧缓存内容由Chrome等应用自己生成。",
    result: "内存盘出现后补齐基础目录和使用说明；旧缓存仍由应用重建，目录存在不等于应用已经恢复。",
    problem: "盘符缺失超过等待时间、配置不是单字母或卷标不符时，当前脚本记录ERROR，不继续操作该盘。",
    readerStates: {"pass":"盘已出现且身份符合预期，基础目录和说明就绪。","problem":"说明缺失或被改动时只同步项目说明；盘身份不符先停。","unavailable":"等不到盘时报告未到达，守护器不会替驱动凭空创建它。"}, stateLabels,
    decisionImpact: ["默认Z，ramdrive.txt可保存一个自定义英文字母；部署回到Z时清掉旧覆盖。", "每3秒等一次，上限150秒，不无限等待。", "只补约定目录和说明，不恢复旧缓存数据。"],
    concepts: [{ term: "目录骨架", explanation: "应用预期的空文件夹结构，丢失后可以重新建立。" }, { term: "卷标", explanation: "卷的名称RAMDISK，是一个防误操作检查，不是密码学设备身份证明。" }],
    implementation: ["Get-Volume读取FileSystemLabel，以OrdinalIgnoreCase比较RAMDISK，位于目录写入之前。", "12个目录为Caches、Caches/Personal、Caches/Work、三个Chrome目录、360zip_temp、WeFlow、Scratch、Scratch/Personal、Scratch/Work和TEMP。", "Z_*.md作为仓库说明源，SHA-256不同或目标缺失时复制到盘根；随后写.ramdisk_ready。", "当前说明SHA256为8557ED61B35E48E522C8354A5F5CC0550903EFA2D807D92D53D573F35F6CADC9，源与目标一致。"],
    flow: ["解析默认或自定义单字母盘符。", "等待到达，核对RAMDISK卷标。", "补缺失目录，比对并同步根说明，写就绪标记。"],
    boundaries: ["不因为看到标记就证明Primo镜像或自然重启恢复成功。", "不删除其他缓存，不确认活动进程是否重新打开文件句柄。"],
    failures: [{ condition: "盘没有出现或卷标不符", response: "查看ERROR细节并核对实际Primo配置；不直接把盘符异常推断成硬件损坏。" }, { condition: "源说明丢失", response: "记录ERROR，恢复仓库中的规范说明后再运行；不能从旧缓存猜一份新规范。" }],
    sources: [{ path: "zguardian.ps1", role: "等待、盘符检查、目录和说明同步。" }, { path: "deploy.ps1", role: "自定义盘符规范化与覆盖清理。" }, { path: "Z_使用说明.md", role: "实际同步的内容。" }],
    verification: ["15项静态断言检查配置和卷标先于目录写入。", "本轮在现有任务自然执行后，根说明哈希已跟随源更新；隔离恢复场景检查目录、说明字节和标记存在。"],
    searchProjection: { intents: ["Z盘缓存文件夹没了", "内存盘使用说明自动恢复", "开机后Z盘来得慢"], entities: ["RAMDISK", "ramdrive.txt", "150秒", ".ramdisk_ready", "Get-FileHash"], relations: ["Primo先提供卷，守护器恢复目录，应用重建内容"], failureRecovery: ["盘缺失或卷标不符时停止写入并核对实际目标"] },
    relation: "为资源巡检和驱动恢复提供基础目录；驱动和应用各自的恢复仍需单独检查。"
  },
  {
    id: "host-memory-telemetry-and-silent-monitoring", slug: "host-memory-telemetry-and-silent-monitoring", order: 3,
    usageEntry: "在已接通这台电脑的 AI 对话中问“Z 盘最近空间和内存巡检怎样”；AI 读取 STATUS 与 guardian.log，普通 WARN 不会弹窗。",
    usageInputs: ["想查看哪台电脑最近的巡检","遇到的内存或缓存症状"],
    productFlow: [{"title":"守护器定期读取","detail":"查看内存盘空间和主机内存，判断是否出现值得提醒的问题。"},{"title":"把结果留在状态里","detail":"最近一轮和过程可回看；普通警告安静记录，严重错误变化才尝试提示。"},{"title":"按时间解释","detail":"这不是实时监控；电脑关机或任务没运行时，上次正常不代表此刻正常。"}],
    readerStatus: "已有记录空间与内存压力的巡检，普通提醒保持安静；旧正常记录不代表当前每项指标仍正常。",
    title: "资源紧张有记录，普通警告不弹窗", shortTitle: "健康与静默提醒", kicker: "任务执行成功和资源充足，是两件不同的事",
    teaser: "记录空间、内存和提交余量；WARN静默，进入ERROR时提醒。",
    value: "保留排查资源问题的线索，避免普通内存波动反复打断当前工作。",
    status: "9月14日04:03Z自然巡检OK；WARN仍按设计静默", statusTone: "accent",
    why: "内存盘占用系统真实RAM。只看计划任务返回0会漏掉内存紧张；每次警告都弹窗又会干扰使用。项目把执行结果和健康状态分开，并保留警告日志。",
    example: "“我刚才看到WARN，现在还要处理吗？”先看最近一轮：9月14日04:03Z这次提交余量已回到17.2GiB，状态为OK。旧告警说明当时余量偏小，不证明Primo坏了，也不是一直有效的清盘指令。",
    result: "最近状态和过程写入可读文件；普通内存警告不弹窗，严重错误从正常转入时才尝试提醒。",
    problem: "任务返回0只能表明脚本结束。已有部分早期ERROR路径也会返回0，必须同时读取健康状态；新修复的紧急恢复失败明确返回非零。",
    readerStates: {"pass":"本轮空间和内存读数没有触发警告，记录正常。","problem":"资源紧张或部分读数失败时留下具体警告，不自动结束应用。","unavailable":"某项读数取得不到就写未知，不能把缺值解释成一切正常。"}, stateLabels,
    decisionImpact: ["可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。", "WARN写STATUS、.lasthealth和guardian.log；只有进入ERROR才写alerts.log并调用msg.exe。", "不自动关闭高内存应用，不调整分页文件；若满足紧急条件，另进入驱动重建分支。"],
    concepts: [{ term: "提交余量", explanation: "CommitLimit减CommittedBytes，是新内存申请的剩余预算，不等同于磁盘空闲或物理可用内存。" }, { term: "状态变化提醒", explanation: "上次不是ERROR、本次是ERROR才尝试提醒，包括WARN转ERROR；持续同一ERROR不重复弹。" }],
    implementation: ["Win32_PerfFormattedData_PerfOS_Memory提供AvailableMBytes、CommitLimit、CommittedBytes。", "Read-RamDiskSpace优先Get-Volume，必要时用System.IO.DriveInfo，最多尝试3次。", "guardian.log超过1MiB时轮换到guardian.log.1；这是运行日志，不是用户文件备份。", "2026-09-14T04:03:49Z记录：Z已用0.2GiB/空闲11.8GiB，可用内存30.3GiB、提交余量17.2GiB、不可归属估算-9.6GiB。"],
    flow: ["任务进入一轮巡检并采集空间。", "读取系统内存和相关估算，汇总触发的阈值。", "写入最近健康与日志，仅按ERROR状态变化发出提醒。"],
    boundaries: ["定期采样不是实时监控，电脑关机或未满足用户会话条件时不会照常执行。", "无窗启动代码和日志不单独证明每次实际桌面都从未出现窗口。"],
    failures: [{ condition: "长期提交余量偏低", response: "结合其他系统工具查实际占用；守护器不从一个数值猜进程，也不自行改系统内存配置。" }, { condition: "采样返回未知", response: "保留采集失败与缺值，不能把旧数或0顶上去宣称健康。" }],
    sources: [{ path: "zguardian.ps1", role: "空间采样、内存阈值与Set-Health。" }, { path: "logs/STATUS.txt", role: "最近一次健康快照。" }, { path: "run_hidden.vbs", role: "隐藏运行并等待退出。" }],
    verification: ["03:43Z已验收的15项静态检查保留WARN静默断言，代码输入未变，本次不机械重跑。", "9月14日04:03Z自然任务返回0，STATUS另行回读为OK；9月8日03:37Z曾返回0但STATUS为WARN，任务结果与健康状态分别判断。"],
    searchProjection: { intents: ["内存盘WARN别弹窗", "任务返回0但STATUS是WARN", "查看Z盘提交余量"], entities: ["WARN", "ERROR", "STATUS.txt", "guardian.log", "Commit Headroom", "msg.exe"], relations: ["任务执行记录与健康记录需要一起读"], failureRecovery: ["根据具体指标排查，不能把WARN直接当成清盘指令"] },
    relation: "这些读数既用于日常解释，也为下一模块的有条件驱动恢复提供输入。"
  },
  {
    id: "unaccounted-watchdog-and-driver-auto-release", slug: "unaccounted-watchdog-and-driver-auto-release", order: 4,
    usageEntry: "在已接通这台电脑的 AI 对话中说“缓存删了但内存没回来，查守护器为什么没有重建”；AI 读本轮条件，自动重建仍只在原任务满足全部门槛时发生。",
    usageInputs: ["出现“缓存删了但内存没回来”的症状","是否希望先只读解释本次为什么未重建"],
    productFlow: [{"title":"守护器确认持续异常","detail":"它自己连续采集至少三次内存压力并核对 Z 占用；条件不足就只记录。"},{"title":"排除会受影响者","detail":"它检查活动用户、未知使用者、暂停、冷却和唯一磁盘身份；任一条件不满足就不重建。"},{"title":"重建后量收益","detail":"允许时重建并恢复目录，重新采样内存；收益不足或无法证明就冷却，失败可能已清缓存。"}],
    readerStatus: "持续压力、使用者与冷却检查已有隔离验证；本轮未真实重建缓存盘，释放多少内存和应用是否受影响仍未实测。",
    title: "缓存删了却没还内存，按条件尝试重建", shortTitle: "驱动内存恢复", kicker: "先核对盘，再执行；失败明确留下结果",
    teaser: "处理本机曾出现的Primo高水位占用，不把估算当成精确泄漏诊断。",
    value: "缓存删了，电脑内存却仍很紧张时，守护器会先确认压力持续、没有人在使用内存盘，再决定是否尝试重建。",
    status: "修复后隔离回归通过", statusTone: "accent",
    why: "2026-07-23本机曾出现约1GiB文件却占着约31GiB内存、镜像约31.98GiB的情况。将盘从32GiB降到12GiB限制最大预算，重建机制则处理文件已减少而驱动仍保持高水位的情形。这个历史原因不等于每一次低内存都由Primo造成。",
    example: "“我清掉了缓存，但内存没回来。”守护器自己多次采样，再检查当前是否有人用盘、本人有没有暂停以及是否仍在等待期；任何条件不清就保留现场。全部满足才认准目标盘并尝试恢复。",
    result: "交回这次为什么没有重建，或重建每一步做了什么及内存是否真的改善。失败会暂缓再试；清空后的应用缓存可能需要重新加载。",
    problem: "清空可重建缓存仍可能打断正在使用它的应用。估算的异常不能严格证明某一个驱动泄漏，8GiB占用条件也不证明盘里绝无误放的唯一资料。",
    readerStates: {"pass":"没有满足重建条件时继续保留缓存并记录原因；达到条件且每一步都通过时再核对实际内存变化。","problem":"持续压力、当前使用者、本人暂停和等待期必须一起检查；收益不明或失败时先冷却，不反复清盘。","unavailable":"Primo 不在、目标盘认不准、权限或恢复步骤失败时报告错误；不能称已经释放内存。"}, stateLabels,
    decisionImpact: ["原资源阈值只产生候选，至少10秒3样本持续压力和其他条件全部通过才允许重建；unaccounted仍是估算，不是驱动泄漏证明。", "两种触发都要求盘已用<=8GiB；超上限保留现场并告警，不自动清盘。", "当前0号对应Z只是现场事实；自定义盘符从ls解析，不再硬编码0。同盘出现其他卷或多个匹配时零初始化。"],
    concepts: [{ term: "不可归属内存估算", explanation: "总已用物理内存扣除工作集、内核池、缓存和修改页等计数；共享页重复计数使健康历史基线约-4GiB，数值可随负载变化。" }, { term: "驱动高水位占用", explanation: "文件已经删去，但驱动仍持有曾经分配的内存；本机有历史证据，不能推断所有Primo版本和所有内存问题都相同。" }],
    implementation: ["Read-UnaccountedGB读取Available Bytes、Modified Page List Bytes、Cache Bytes、Pool Paged Bytes、Pool Nonpaged Bytes和Process(_Total)/Working Set，再与Win32_OperatingSystem的TotalVisibleMemorySize计算差值；失败返回null。", "压力谓词仍为(available<5GiB或unaccounted>=8GiB)且used<=8GiB，但触发前至少10秒取得3次连续样本，间隔超过30秒重新确认。消费者活动/证据未知、用户暂停或冷却均拒绝重建，不能用单拍判断。", "Resolve-PrimoDiskIndex从rxprd ls的编号行和卷列表解析配置盘符；要求唯一且同盘没有其他卷。", "Invoke-PrimoCommand检查实际退出码。流程为init <index> -s，等待2秒，恢复目录/说明/隐藏标记，再save <index> -s；初始化和骨架失败不继续save，任何失败都不记录release done。", "命令成功后再次读取空间和内存并记录实际值；不能证明可用内存至少改善1GiB时延长冷却到6小时，这不是承诺每次都能释放1GiB。没有自建超时服务，现有计划任务总时限为10分钟。",
      "尝试至少间隔1小时，失败暂缓1小时；实际回读无法证明至少1GiB内存改善则暂缓6小时。Set-RamdiskRecoveryMode恢复自动模式不清冷却。消费者租约绑定PID、创建时间和期限，与重建共用互斥；只证明已接入者，不承诺所有旧应用占用保护。",],
    flow: ["至少10秒取得3次连续压力样本，间隔超过30秒从头确认；同时核对Z占用。", "查活动和未知使用者、本人暂停及当前冷却期；任一条件阻断就保持原状并记原因。", "查询Primo并确认唯一磁盘编号及没有其他卷。", "初始化选中盘，恢复基础结构后保存镜像。", "失败记录ERROR并至少冷却1小时；成功后重新采样，改善不足1GiB或无法证明时冷却6小时。"],
    boundaries: ["本轮未执行真实init/save；隔离测试不能冒充实盘恢复或自然重启。", "不自动删除其他Owner缓存里的特定内容，也不重置全部系统内存。", "若初始化成功但之后失败，缓存已可能清空；ERROR不意味着所有前步骤已回滚。"],
    failures: [{ condition: "盘符无法唯一映射或同盘包含其他卷", response: "不调用init，不猜编号，保留ERROR供核对配置。" }, { condition: "init失败", response: "不调用save，不宣称完成，记录Primo退出结果。" }, { condition: "目录/说明恢复或save失败", response: "记录失败阶段；目录恢复失败不保存，save失败不宣称镜像已更新。" }],
    sources: [{ path: "zguardian.ps1", role: "计算、阈值、唯一编号解析、实际命令与恢复。" }, { path: "tests/Test-RamdiskGuardianRecovery.ps1", role: "真实生产恢复分支的10个隔离情形。" }, { path: "README.md", role: "本机历史故障与当前预算。" }],
    verification: ["旧源码的初始化失败夹具返回0且报告完成，故障已复现。", "PS7/5.1均通过：默认盘成功、自定义盘索引成功、init失败、save失败、说明恢复失败、目标不存在、重复目标、多卷、ls失败、Primo不存在。", "仅只读Primo设置和当前任务，本轮没有实盘重建E2E。"],
    searchProjection: { intents: ["Primo删除缓存后内存不释放", "Z盘驱动高水位占用", "内存盘自动重建失败"], entities: ["Primo", "DMM", "Unaccounted Memory", "rxprd.exe", "Resolve-PrimoDiskIndex"], relations: ["资源阈值决定尝试，Primo盘符映射决定对象，退出结果决定报告"], failureRecovery: ["目标不明确不初始化，初始化失败不保存，所有失败都不写完成"] },
    relation: "恢复依赖第一模块的缓存约定和下一模块的Primo/计划任务安装，不能独立承诺数据保护。"
  },
  {
    id: "installation-and-application-recovery", slug: "installation-and-application-recovery", order: 5,
    usageEntry: "先按 DEPLOY.md 配好 Primo 盘和镜像，再由管理员运行 deploy.ps1；应用缓存连接和自然重启验收分别做。",
    usageInputs: ["要在这台电脑部署守护","准备把哪个应用的可丢缓存接到内存盘","是否需要下次自然重启后验收"],
    productFlow: [{"title":"先有正确 RAM 盘","detail":"在 Primo 配置目标盘，不由守护器猜盘或创建唯一数据。"},{"title":"部署任务和目录","detail":"安装脚本建立基础目录及计划任务；应用接入另核对。"},{"title":"分层验收","detail":"读任务、STATUS、目录与应用状态；下次自然重启再看镜像加载，部署通过不等于冷启动通过。"}],
    readerStatus: "安装状态已有回读；驱动开机加载、应用缓存接入和实际收益仍分别确认，不能由目录存在推出。",
    title: "安装、应用接入和重启恢复分别确认", shortTitle: "安装与恢复", kicker: "Primo提供盘，任务维护盘，应用决定怎样使用缓存",
    teaser: "恢复12GiBPrimo配置、现有任务和缓存链接，再验证下一次自然启动。",
    value: "重装系统或任务丢失后，知道需要恢复哪些组件，也知道哪些结果还没有证明。",
    status: "安装状态已回读", statusTone: "accent",
    why: "脚本能运行不代表驱动已建盘；空文件夹存在也不代表Chrome已经接入。把驱动、定时任务、目录连接和自然重启分别检查，才能恢复完整使用路径。",
    example: "“重装后恢复 Z 盘缓存用途。”先按既有指南在 Primo 建盘，再部署任务；Chrome 等应用仍运行时先不改它们的缓存连接，完成后等一次自然重启验证盘是否自动回来。",
    result: "交回盘、任务、目录和应用缓存连接各自是否就绪；自然重启后的自动加载仍需实际观察。",
    problem: "部署会修改快速启动、注册任务并可能替换Chrome的缓存目录；它不是只读查询。普通权限、目标卷不符或Primo未建盘时，不能把部分完成报告成整套恢复。",
    readerStates: {"pass":"内存盘出现、任务按计划运行、选定应用真的把可丢缓存放进去，才算日常路径就绪。","problem":"应用仍开着就暂缓改它的缓存位置；盘未出现先完成建盘，再重跑对应部署步骤。","unavailable":"Primo 未安装或必要权限不足时不能完成部署；正式资料始终不能把内存盘当唯一来源。"}, stateLabels,
    decisionImpact: ["当前配置为12GiB，不沿用旧截图或提示中的32GiB；Primo镜像当前为Compact Image（紧凑镜像）和Shutdown Save。", "默认-RamDrive Z、-IntervalMinutes 15；非默认盘符写ramdrive.txt，回Z时清除旧覆盖。", "只在Chrome关闭时处理Default配置的Cache、Code Cache、GPUCache；不宣称自动覆盖所有浏览器Profile。", "撤销RAMDisk_Code_Backup只删除计划任务，不删Primo盘、镜像或缓存。"],
    concepts: [{ term: "非临时盘与镜像", explanation: "Primo保存磁盘配置，并按所选模式加载/保存镜像。缓存可能跨启动保留，但项目仍要求内容可丢。" }, { term: "隐藏启动器", explanation: "VBS以隐藏窗口方式启动PowerShell，等待结束后将退出码交回计划任务，不常驻另一个守护服务。" }],
    implementation: ["deploy.ps1检查管理员与RAMDISK卷标，设置HiberbootEnabled=0，注册Interactive/Highest、登录触发和重复间隔、IgnoreNew、10分钟执行时限。", "任务调用wscript.exe与仓库run_hidden.vbs；VBS从自身目录定位zguardian.ps1，等待Windows PowerShell退出并WScript.Quit传递结果。", "部署在Z可用时执行一轮完整守护，非零结果停止后续部署；Chrome运行时跳过三个缓存连接，360解压临时目录由用户在其设置中指定。", "本机三个Chrome连接已回读到Z；360设置和WeFlow进程当前实际使用路径本轮未检查，不用目录存在替代。", "回退命令为Unregister-ScheduledTask -TaskName RAMDisk_Code_Backup -Confirm:$false，只在明确停用守护器时使用。",
      "Compact-RamdiskImage是明确人工动作，核对唯一Primo编号、镜像和目标，保留候选并验证哈希后原子替换，保留1份可用回退；不为压缩重建实际驱动。自然重启能否采用新镜像仍需另验。PCConfig的Show-StreamingMaintenance显示状态/下次检查/消费者/冷却，关闭窗口不停止任务或改电源显示。",],
    flow: ["按DEPLOY.md先设置Primo驱动盘和镜像。", "管理员部署任务和基础目录，分别处理应用接入前置条件。", "读任务结果、健康日志、目录和连接；下一次自然启动再确认加载。", "若停用，仅按需要撤销任务，盘与应用连接另行处理。"],
    boundaries: ["本轮没有运行deploy.ps1、关闭Chrome、改快速启动或重启系统。", "Primo配置检查、自然周期执行和冷启动验收是不同证据。"],
    failures: [{ condition: "任务存在但Z尚未创建", response: "部署会说明部分完成；先恢复Primo配置，再执行所需后续步骤。" }, { condition: "Chrome正使用缓存目录", response: "跳过连接调整；不要为了网页展示关闭用户浏览器。" }, { condition: "任务返回0但健康ERROR", response: "以STATUS具体故障为准排查，不能只验任务返回值。" }],
    sources: [{ path: "DEPLOY.md / DEPLOY.pdf", role: "当前12GiB部署、检查与回退说明。" }, { path: "deploy.ps1 / run_hidden.vbs", role: "实际安装与调用链。" }, { path: "docs/primo_setup.png", role: "历史界面参考，容量以当前文档和实机为准。" }],
    verification: ["9月8日已回读Primo为0号Z、12288MB、非临时、镜像启用、快速启动关闭及三个Chrome连接；9月14日本次仅重证卷、目录、说明、镜像大小与自然任务状态。", "README/DEPLOY PDF分别3页/2页，本轮重新生成并核对文字、渲染页面和源哈希。", "完整自然重启恢复未在本轮重做，保留该边界。"],
    searchProjection: { intents: ["重装后恢复RamdiskGuardian", "Chrome缓存连接到Z", "恢复RAMDisk_Code_Backup计划任务", "停止内存盘守护"], entities: ["deploy.ps1", "run_hidden.vbs", "ChromeCache", "ChromeCodeCache", "ChromeGPUCache", "Primo", "HiberbootEnabled"], relations: ["Primo建盘和加载镜像，任务补骨架，Chrome通过连接使用缓存"], failureRecovery: ["未建盘先恢复Primo，Chrome运行则跳过连接；停用任务不会自动删盘"] },
    relation: "这是其余四个模块的实际运行入口，也界定驱动、脚本和应用分别负责的恢复步骤。"
  }
];

export const project = ramdiskGuardianProject;
export const modules = ramdiskGuardianModules;
