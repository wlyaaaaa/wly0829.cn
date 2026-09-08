import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["正常工作", "发现问题", "暂不可用"];
const sourceCommit = "c12821ac26c0ede830d8ddb1cbc00d56e57dbdb3";

export const ramdiskGuardianSnapshot = createProjectSnapshot({
  observedAt: "2026-09-08T03:29:50.946Z",
  label: "缓存盘和定时任务正常运行；提交余量偏低，静默 WARN 保留",
  boundary: "Z 只放可再生成缓存。重建会清空缓存，可能让活动应用重新加载；本轮验证了修复后的隔离恢复流程，没有重建实盘或重启电脑。",
  metrics: [
    { label: "内存盘", value: "12 GiB · 8 GiB 缓存软上限" },
    { label: "当前空间", value: "已用 0.1 GiB · 空闲 11.9 GiB" },
    { label: "自动巡检", value: "登录后 · 每 15 分钟" },
    { label: "最近状态", value: "WARN · 任务返回 0" }
  ],
  facts: [
    { label: "源版本", value: `PUBLIC main ${sourceCommit} 已正常推送并远端回读，源工作区干净。修复了旧容量提示、自定义盘符仍重建0号盘，以及驱动命令失败却报告完成的问题。` },
    { label: "实际磁盘与镜像", value: "Windows 当前识别 Z: / RAMDISK / NTFS，总量12883849216字节、剩余12782698496字节。Primo只读列表确认0号盘对应Z，设置12288 MB、SCSI、DMM（动态内存管理）、非临时盘；镜像E:\\RamdiskImage\\Z.vdf启用Load & Save（加载和保存）与Shutdown Save（关机保存）。当前镜像12874547712字节，不能沿用2026-07-23清理后约0.1GiB的历史大小。" },
    { label: "任务与健康分别读取", value: "RAMDisk_Code_Backup 当前Ready（等待下次运行），以登录触发并每PT15M重复，Interactive（用户登录会话）/Highest（最高权限）、IgnoreNew（忽略重叠运行）、执行上限PT10M。最近启动2026-09-08T03:22:28Z、返回0；STATUS记录于03:22:33Z，仍为WARN：提交余量1.5GiB低于4GiB，可用内存13.6GiB，不可归属内存估算-0.6GiB。" },
    { label: "目录与应用接入", value: "守护器维护12个明确目录：Caches及Personal、Work、ChromeCache、ChromeCodeCache、ChromeGPUCache、360zip_temp、WeFlow，Scratch及Personal、Work，以及TEMP。Chrome的Cache、Code Cache、GPUCache现场均为指向对应Z目录的junction（目录连接）。WeFlow目录存在不单独证明其当前进程已使用该缓存。" },
    { label: "说明与自然定时运行", value: "修复后现有任务自然执行，Z:\\使用说明.md与仓库Z_使用说明.md的SHA-256同为8557ED61B35E48E522C8354A5F5CC0550903EFA2D807D92D53D573F35F6CADC9。无需复制另一套安装代码，隐藏启动器直接使用当前仓库脚本。" },
    { label: "源码与行为验证", value: "15项原生静态断言，以及10个隔离恢复场景，均在PowerShell 7和Windows PowerShell 5.1通过。旧脚本在初始化失败时仍报告完成的场景已复现；修复后初始化、保存、目录/说明恢复或Primo缺失均报ERROR，且不继续报告完成。目录恢复失败和初始化失败都不会继续保存镜像。" },
    { label: "启动证据边界", value: "快速启动HiberbootEnabled=0，Primo非临时盘和镜像设置已回读。最近系统启动为2026-09-03T03:06:55.5Z；本轮没有自然重启后的完整恢复演练，不能用当前盘存在或测试通过代替该证据。" }
  ],
  gaps: [
    "cache-only（仅缓存）是使用约定，不是文件拦截器。误放进去的唯一数据仍可能丢失；守护器不备份、不恢复个人文件，也不会审查每个缓存的内容。",
    "不可归属内存是带共享页计数误差的估算，不能单独证明某个驱动泄漏；重建也不承诺固定释放量、固定耗时或活动应用零中断。",
    "当前提交余量偏低的WARN仍存在。守护器不会关闭应用、调分页文件或替所有进程解决内存压力。",
    "生产初始化/保存与本轮自然重启恢复未重做；已验证源码、隔离失败处理、现有安装映射和自然任务运行，分别陈述。"
  ]
});

export const ramdiskGuardianProject = {
  order: 31,
  slug: "ramdisk-guardian",
  title: "RamdiskGuardian",
  kicker: "让 Z 盘专心放缓存，缺目录就补，内存异常有记录",
  lead: "让 Z 盘专心放缓存，缺目录就补，内存异常有记录",
  route: "/projects/ramdisk-guardian",
  visibility: "公开仓库",
  statusTone: "accent",
  badge: "工具 / 缓存守护",
  summary: "把电脑的12 GiB内存盘当作可重建缓存区使用：登录后和每15分钟补齐缓存目录、更新使用说明，并检查空间与内存余量。遇到符合条件的驱动内存异常时，尝试重建缓存盘；普通WARN只记日志，真正的ERROR状态变化才提醒。",
  why: "内存盘读写快，但它占用的仍是电脑内存。过去把正式文件放进去并做镜像备份，曾发生空源覆盖备份的问题；本机还遇到过Primo删文件后仍占着历史高水位内存。现在把正式资料留在持久磁盘，只让Z承载可再生成缓存，再用容量上限、巡检和有限的重建流程处理这些具体问题。",
  plainExample: "“我想把浏览器缓存放在Z盘，重启后别让我自己补文件夹；有点内存紧张也别一直弹窗。”完成Primo和缓存路径配置后，守护器会等待盘出现、补好目录和说明。空间或内存到提醒线时留下可查的WARN；若达到自动重建条件，它会核对实际Primo磁盘再尝试清空重建，失败则明确报错。正式代码和文档一直留在E或V，浏览器缓存可以重新生成。",
  result: "得到一块有容量预算、目录可恢复、问题有记录的缓存盘。它不接管所有应用的缓存管理，也不会把RAM Disk变成可靠文件仓库；是否值得把新缓存搬进去，要看实际工作负载是否有可感知收益。",
  cardStatus: "Z盘正常 · 定时任务正常 · 提交余量偏低，静默WARN",
  cardStatusTone: "accent",
  ...ramdiskGuardianSnapshot,
  searchAliases: ["RamdiskGuardian", "Z盘", "内存盘", "缓存守护", "Primo Ramdisk", "内存不释放", "缓存目录恢复"],
  searchProjection: {
    intents: ["Z盘应该放什么缓存", "内存盘的缓存目录没了如何恢复", "内存盘WARN为什么不弹窗", "Primo删除缓存后内存不释放", "重新安装缓存盘和计划任务"],
    entities: ["RamdiskGuardian", "RAMDisk_Code_Backup", "Primo Ramdisk", "zguardian.ps1", "rxprd.exe", "Z_使用说明.md"],
    relations: ["PCConfig规定E/V/Z存储放置，RamdiskGuardian执行缓存盘守护", "Chrome通过目录连接使用Z缓存，Primo负责磁盘和镜像"]
  },
  readerStates: {
    quick: "它把Z当成有上限的缓存区，自动补目录和说明，记录空间与内存异常。正式文件另存，所以丢缓存可以重建。",
    product: "日常由现有计划任务运行。普通资源不足静默记录；盘缺失、对象不匹配或重建失败会报错。缓存生产者仍负责自己的清理。",
    technical: "下面分别列出准入约定、目录恢复、健康阈值、驱动重建和安装恢复；运行快照与代码测试不能互相代替。"
  },
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
    { name: "验证源码和隔离恢复行为", command: "pwsh -NoProfile -File E:\\Projects\\Tools\\RamdiskGuardian\\tests\\Assert-RamdiskGuardianStatic.ps1; pwsh -NoProfile -File E:\\Projects\\Tools\\RamdiskGuardian\\tests\\Test-RamdiskGuardianRecovery.ps1", purpose: "不初始化真实内存盘，检查既有约定与成功、失败、目标不明确等恢复分支。" }
  ],
  technicalContracts: [
    { artifact: "E/V/Z放置策略", schema: "Markdown规则，无独立schema文件", owner: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", boundary: "E是现有稳定层，V是新项目/开发层，Z只接纳有界可再生成热缓存；不是批量搬迁已有项目的命令。" },
    { artifact: "缓存盘目录与阈值", schema: "zguardian.ps1中的目录数组和数值常量", owner: "RamdiskGuardian", boundary: "12个明确目录；缓存软上限8GiB，可用内存提醒8GiB/重建条件5GiB，提交余量提醒4GiB，不可归属内存提醒4GiB/重建条件8GiB。" },
    { artifact: "健康与执行结果", schema: "STATUS.txt / .lasthealth / guardian.log / alerts.log", owner: "Set-Health与Windows计划任务", boundary: "记录带时间的状态；WARN静默，进入ERROR时提醒。重建失败返回非零；其余健康错误可能仍返回0，因此必须读STATUS。" },
    { artifact: "Primo恢复命令", schema: "rxprd ls / init <index> -s / save <index> -s", owner: "Primo命令行与守护器恢复分支", boundary: "唯一盘符映射后才初始化；命令或骨架恢复失败终止本次恢复，不能继续记完成。无新增事务、服务或数据格式。" }
  ],
  evidenceLayers: [
    { layer: "源码与隔离回归", proves: "已验证源提交、15项静态约定、10种生产恢复分支夹具，并复现修复前的假完成。", doesNotProve: "不证明真实驱动重建耗时、释放内存量或活动应用恢复效果。" },
    { layer: "当前安装与只读实机状态", proves: "Primo的Z映射、12GiB容量、镜像设置、Chrome三个目录连接、任务和最新静默WARN均已回读。", doesNotProve: "不证明没有其他进程内存问题，也不证明任意新应用已接入Z。" },
    { layer: "修复后的自然任务运行", proves: "现有任务直接调用当前仓库脚本，03:22轮自然执行返回0，更新后的盘根说明与源哈希一致。", doesNotProve: "该轮没有触发紧急重建，也不是一次重启恢复演练。" },
    { layer: "源码发布与网页", proves: `源main ${sourceCommit}已远端回读；README/DEPLOY对应PDF已重新生成、提取文字并逐页视觉检查。`, doesNotProve: "本网站候选仍在本地，源仓库发布不等于网页已发布。" }
  ],
  productPrinciples: [
    { title: "先保证丢的是缓存", detail: "正式项目和唯一资料留在持久磁盘；Z不再承担备份源。这个使用约定使缓存盘重建可接受，却不会自动拦住误放进去的资料。" },
    { title: "有真实收益才用内存盘", detail: "本机已有高速NVMe。只有真实计时说明细碎I/O是瓶颈、应用能承受缓存失效且体积有界时，才新增Z使用者。" },
    { title: "提醒分级，清理各自负责", detail: "WARN写日志，ERROR状态变化提醒；守护器不杀进程，也不逐个判断和删除别人的缓存，过期内容由生产者收口。" },
    { title: "重建有条件，结果如实返回", detail: "沿用既有资源阈值，先核对实际盘符和Primo编号，再检查每一步；失败不写成成功。估算和命令成功都不等于固定的性能收益。" }
  ],
  responsibilities: ["维持缓存盘的目录骨架与根使用说明。", "记录盘空间、可用内存、提交余量和不可归属内存估算。", "按既有条件尝试释放Primo驱动高水位占用，恢复缓存骨架。", "提供可复现的安装、计划任务、Chrome缓存接入和回退说明。"],
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
  operatingFlow: [
    { title: "先配置可丢的缓存使用者", detail: "Primo创建内存盘，应用接入自己的缓存目录；正式资料仍在持久磁盘。" },
    { title: "登录或定时运行", detail: "旧名RAMDisk_Code_Backup的任务通过VBS调用守护脚本，每15分钟一轮，重叠运行被忽略。" },
    { title: "找到盘并补基础目录", detail: "等待最多150秒、检查单字母盘符和RAMDISK卷标，补12个目录、同步说明并写隐藏标记。" },
    { title: "检查资源与必要恢复", detail: "读取空间和内存；满足重建条件时解析实际Primo编号，初始化、补目录/说明/标记并保存镜像，任一步失败明确记录。" },
    { title: "留下可读结果", detail: "STATUS保存最新状态，guardian.log保存过程；WARN静默，进入ERROR时尝试发出一次桌面提示。" }
  ],
  usageExamples: [
    { ask: "这个新缓存值得搬进Z盘吗？", effect: "先确认可重建、体积有界和实际I/O收益；大型包缓存与正式项目仍去持久开发盘。", moduleSlug: "volatile-cache-contract-and-backup-retirement" },
    { ask: "Z盘重新出现了，缓存文件夹和使用说明怎么补回来？", effect: "守护器检查卷标后补目录，用源文件哈希判断是否同步说明；不恢复旧缓存内容。", moduleSlug: "drive-arrival-sensing-and-skeleton-healing" },
    { ask: "最近有内存警告，但别一直弹窗影响我。", effect: "查看STATUS和日志中的具体阈值，WARN保持静默；任务是否执行和资源是否充足分开判断。", moduleSlug: "host-memory-telemetry-and-silent-monitoring" },
    { ask: "缓存删了，Primo占用的内存却没下来，怎么办？", effect: "检查资源和估算；达到既有条件时，守护器核对对应磁盘并尝试重建，失败明确报错，活动应用可能要重新加载。", moduleSlug: "unaccounted-watchdog-and-driver-auto-release" },
    { ask: "重装后，把缓存盘和自动巡检恢复好。", effect: "先按12GiB配置Primo，再部署现有任务和适用的缓存链接；下一次自然重启再确认加载链。", moduleSlug: "installation-and-application-recovery" }
  ],
  evolution: [
    { date: "2026-06", commit: "ecd7111", result: "停止把内存盘当正式文件来源，退役旧备份通道，转为有界可再生成缓存。" },
    { date: "2026-07-23", commit: "a7aee97", result: "本机DMM高水位故障后，容量从32GiB降到12GiB，并加入资源阈值与不可归属内存估算驱动的恢复。" },
    { date: "2026-08 至 2026-09", commit: sourceCommit, result: "保留静默WARN，补盘符/卷标检查，再让恢复使用实际Primo编号并如实处理失败；部署和恢复说明回到当前12GiB配置。" }
  ],
  snapshotUpdateNote: "页面依据2026-09-08的源版本、只读磁盘/任务回读和隔离恢复验证。当前WARN、本轮未做实盘重建与自然重启的边界仍保留；网站仅本地候选。"
};

export const ramdiskGuardianModules = [
  {
    id: "volatile-cache-contract-and-backup-retirement", slug: "volatile-cache-contract-and-backup-retirement", order: 1,
    title: "缓存放在哪里，哪些东西不能进Z", shortTitle: "缓存准入与边界", kicker: "只放能重建的缓存，正式资料留在持久磁盘",
    teaser: "先判断值得加速的对象，再给缓存设置体积和生命周期边界。",
    value: "避免为了读写速度，把唯一资料的生存时间绑在内存盘上。",
    status: "当前使用约定", statusTone: "accent",
    why: "历史镜像备份曾在空源时覆盖目标；继续给RAM Disk补备份并不能消除它承担唯一数据的风险。当前做法直接让正式文件退出Z，只保留丢后可重建的内容。",
    example: "“我要跑一个临时测试，能用Z吗？”如果输入和代码已在E或V，Z里只是可再生成且有上限的中间输出，可以评估；如果它会成为唯一一份未提交代码，就留在持久磁盘。",
    result: "Z拥有12GiB容量预算和8GiB缓存软上限；每个生产者负责自己的失效缓存，守护器不再复制旧projects/docs/others或写旧备份目录。",
    problem: "这些规则不会自动阻止文件写入。误放进去的唯一资料仍可能在驱动重建时丢失，所以不能把使用约定写成自动数据保护能力。",
    readerStates: { pass: "对象可完全重建、体积有界，真实计时表明使用Z有价值。", problem: "缓存超软上限会告警，由生产者清理自己的已失效对象。", unavailable: "对象不能承受缓存丢失、盘暂时不可用或没有实际收益，就保持原位。" }, stateLabels,
    decisionImpact: ["E保留既有项目和恢复锚点；新个人项目默认V:\\Personal\\Projects，而不是把现有项目强制全迁到V。", "不放正式Git仓库、唯一资料、数据库、模型和凭据；不迁系统全局TEMP/TMP、Docker/WSL或无界包缓存。", "Personal/Work仅是组织分区，共享内存盘不产生账号或数据隔离。"],
    concepts: [{ term: "cache-only（仅缓存）", explanation: "丢失可以接受，而且应用能重新生成。不是把文件改名叫缓存就满足条件。" }, { term: "缓存生产者", explanation: "实际创建缓存的应用或工具；由它判断哪些代已过期，任务成功、失败或接管时完成清理。" }],
    implementation: ["源目录数组只包含Caches、Scratch、TEMP及既有子目录，不包含退役的projects/docs/others。", "README与Z_使用说明.md解释准入；静态测试防止旧robocopy和Z_Drive_Backup逻辑重回现役。", "不实现内容分类器或全盘清空计划，8GiB是告警/恢复条件的一部分，不是自动逐文件配额。"],
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
    title: "等盘出现，再补缓存目录和说明", shortTitle: "目录与说明恢复", kicker: "盘有可能来得晚，目录也可能需要重新生成",
    teaser: "等待最多150秒，核对盘符和卷标，再补12个明确目录。",
    value: "减少重启、掉盘恢复或缓存盘初始化后，需要手工补目录的工作。",
    status: "目录与说明已回读", statusTone: "accent",
    why: "计划任务开始时Primo卷可能还没出现。直接写盘会失败；只按Z这个字母操作也可能碰到意外占用。守护器先等待，再要求RAMDISK卷标。",
    example: "“Z盘回来了，但原来的缓存文件夹没了。”下一轮守护会检查盘、补齐缺失目录，把仓库说明放回根目录。旧缓存内容由Chrome等应用自己生成。",
    result: "有基础目录、当前使用说明与隐藏的.ramdisk_ready标记；这不等于应用缓存已经热起来，也不等于所有应用已完成恢复。",
    problem: "盘符缺失超过等待时间、配置不是单字母或卷标不符时，当前脚本记录ERROR，不继续操作该盘。",
    readerStates: { pass: "卷可见、卷标匹配，基础目录和根说明可用。", problem: "说明缺失或内容变化时会同步；遇到目标不符先停止并说明。", unavailable: "超过150秒仍无盘时，守护器不能替Primo挂载或创建驱动设备。" }, stateLabels,
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
    title: "资源紧张有记录，普通警告不弹窗", shortTitle: "健康与静默提醒", kicker: "任务执行成功和资源充足，是两件不同的事",
    teaser: "记录空间、内存和提交余量；WARN静默，进入ERROR时提醒。",
    value: "保留排查资源问题的线索，避免普通内存波动反复打断当前工作。",
    status: "当前静默WARN", statusTone: "accent",
    why: "内存盘占用系统真实RAM。只看计划任务返回0会漏掉内存紧张；每次警告都弹窗又会干扰使用。项目把执行结果和健康状态分开，并保留警告日志。",
    example: "“我看到WARN，需要立刻关东西吗？”先看是哪条阈值：最新快照是提交余量1.5GiB低于4GiB，可用内存13.6GiB。它说明系统继续申请内存的余量偏小，但不证明Primo坏了，也不意味着应立即清盘。",
    result: "STATUS.txt显示最近状态和数值，guardian.log保留过程；WARN不新增弹窗，ERROR从上一状态转入时才尝试通过msg.exe提醒一次。",
    problem: "任务返回0只能表明脚本结束。已有部分早期ERROR路径也会返回0，必须同时读取健康状态；新修复的紧急恢复失败明确返回非零。",
    readerStates: { pass: "本轮指标没有触发警告，记录OK。", problem: "资源达到提醒阈值或采集部分失败，记录具体WARN，不自动杀应用。", unavailable: "卷查询失败记录WARN；系统内存查询失败也记录WARN；不可归属计数器读取失败返回未知，不能把缺值当正常。" }, stateLabels,
    decisionImpact: ["可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。", "WARN写STATUS、.lasthealth和guardian.log；只有进入ERROR才写alerts.log并调用msg.exe。", "不自动关闭高内存应用，不调整分页文件；若满足紧急条件，另进入驱动重建分支。"],
    concepts: [{ term: "提交余量", explanation: "CommitLimit减CommittedBytes，是新内存申请的剩余预算，不等同于磁盘空闲或物理可用内存。" }, { term: "状态变化提醒", explanation: "上次不是ERROR、本次是ERROR才尝试提醒，包括WARN转ERROR；持续同一ERROR不重复弹。" }],
    implementation: ["Win32_PerfFormattedData_PerfOS_Memory提供AvailableMBytes、CommitLimit、CommittedBytes。", "Read-RamDiskSpace优先Get-Volume，必要时用System.IO.DriveInfo，最多尝试3次。", "guardian.log超过1MiB时轮换到guardian.log.1；这是运行日志，不是用户文件备份。", "当前03:22:33Z记录：Z已用0.1GiB/空闲11.9GiB，可用内存13.6GiB、提交余量1.5GiB、不可归属估算-0.6GiB。"],
    flow: ["任务进入一轮巡检并采集空间。", "读取系统内存和相关估算，汇总触发的阈值。", "写入最近健康与日志，仅按ERROR状态变化发出提醒。"],
    boundaries: ["定期采样不是实时监控，电脑关机或未满足用户会话条件时不会照常执行。", "无窗启动代码和日志不单独证明每次实际桌面都从未出现窗口。"],
    failures: [{ condition: "长期提交余量偏低", response: "结合其他系统工具查实际占用；守护器不从一个数值猜进程，也不自行改系统内存配置。" }, { condition: "采样返回未知", response: "保留采集失败与缺值，不能把旧数或0顶上去宣称健康。" }],
    sources: [{ path: "zguardian.ps1", role: "空间采样、内存阈值与Set-Health。" }, { path: "logs/STATUS.txt", role: "最近一次健康快照。" }, { path: "run_hidden.vbs", role: "隐藏运行并等待退出。" }],
    verification: ["本轮15项静态检查保留WARN静默断言。", "计划任务03:22自然执行返回0，STATUS仍为WARN；两条事实分别展示。"],
    searchProjection: { intents: ["内存盘WARN别弹窗", "任务返回0但STATUS是WARN", "查看Z盘提交余量"], entities: ["WARN", "ERROR", "STATUS.txt", "guardian.log", "Commit Headroom", "msg.exe"], relations: ["任务执行记录与健康记录需要一起读"], failureRecovery: ["根据具体指标排查，不能把WARN直接当成清盘指令"] },
    relation: "这些读数既用于日常解释，也为下一模块的有条件驱动恢复提供输入。"
  },
  {
    id: "unaccounted-watchdog-and-driver-auto-release", slug: "unaccounted-watchdog-and-driver-auto-release", order: 4,
    title: "缓存删了却没还内存，按条件尝试重建", shortTitle: "驱动内存恢复", kicker: "先核对盘，再执行；失败明确留下结果",
    teaser: "处理本机曾出现的Primo高水位占用，不把估算当成精确泄漏诊断。",
    value: "系统可用内存危急，或出现较大不可归属内存估算时，沿用既有条件尝试释放缓存盘驱动占用。",
    status: "修复后隔离回归通过", statusTone: "accent",
    why: "2026-07-23本机曾出现约1GiB文件却占着约31GiB内存、镜像约31.98GiB的情况。将盘从32GiB降到12GiB限制最大预算，重建机制则处理文件已减少而驱动仍保持高水位的情形。这个历史原因不等于每一次低内存都由Primo造成。",
    example: "“临时文件删完了，Z占用不大，电脑内存还是紧张。”守护器看到可用内存低于5GiB，或者不可归属内存估算达到8GiB，并确认Z已用不超过8GiB时，才进入恢复。它从Primo列表找准配置盘符对应的编号，初始化后补回目录和说明，再保存镜像；失败说明停在哪一步。",
    result: "得到明确的恢复过程与结果日志。成功后重新采集资源，记录重建发生过；释放多少内存、花多久以及应用是否要重新加载，由实际运行决定。",
    problem: "清空可重建缓存仍可能打断正在使用它的应用。估算的异常不能严格证明某一个驱动泄漏，8GiB占用条件也不证明盘里绝无误放的唯一资料。",
    readerStates: { pass: "没有达到重建条件，保持缓存并继续记录。", problem: "达到既有条件且目标明确时尝试恢复，完成后记录WARN说明本轮发生重建。", unavailable: "Primo缺失、无权限、列表不能唯一映射、命令或目录恢复失败时，ERROR并非零退出。" }, stateLabels,
    decisionImpact: ["不可归属估算>=4GiB提醒，>=8GiB是一个重建条件；可用内存<5GiB是另一个，二者为或。", "两种触发都要求盘已用<=8GiB；超上限保留现场并告警，不自动清盘。", "当前0号对应Z只是现场事实；自定义盘符从ls解析，不再硬编码0。同盘出现其他卷或多个匹配时零初始化。"],
    concepts: [{ term: "不可归属内存估算", explanation: "总已用物理内存扣除工作集、内核池、缓存和修改页等计数；共享页重复计数使健康历史基线约-4GiB，数值可随负载变化。" }, { term: "驱动高水位占用", explanation: "文件已经删去，但驱动仍持有曾经分配的内存；本机有历史证据，不能推断所有Primo版本和所有内存问题都相同。" }],
    implementation: ["Read-UnaccountedGB读取Available Bytes、Modified Page List Bytes、Cache Bytes、Pool Paged Bytes、Pool Nonpaged Bytes和Process(_Total)/Working Set，再与Win32_OperatingSystem的TotalVisibleMemorySize计算差值；失败返回null。", "重建条件为(available<5GiB 或 unaccounted>=8GiB) 且 used<=8GiB，未知输入不能满足对应判断。", "Resolve-PrimoDiskIndex从rxprd ls的编号行和卷列表解析配置盘符；要求唯一且同盘没有其他卷。", "Invoke-PrimoCommand检查实际退出码。流程为init <index> -s，等待2秒，恢复目录/说明/隐藏标记，再save <index> -s；初始化和骨架失败不继续save，任何失败都不记录release done。", "命令成功后再次读取空间和内存并记录实际值；它不检查一个固定释放量，也没有自建超时服务，现有计划任务总时限为10分钟。"],
    flow: ["读取资源，判断两个触发条件与缓存占用。", "查询Primo并确认唯一磁盘编号。", "初始化选中盘，恢复基础结构后保存镜像。", "失败记录ERROR并返回非零；成功采样并记录本轮发生了重建。"],
    boundaries: ["本轮未执行真实init/save；隔离测试不能冒充实盘恢复或自然重启。", "不自动删除其他Owner缓存里的特定内容，也不重置全部系统内存。", "若初始化成功但之后失败，缓存已可能清空；ERROR不意味着所有前步骤已回滚。"],
    failures: [{ condition: "盘符无法唯一映射或同盘包含其他卷", response: "不调用init，不猜编号，保留ERROR供核对配置。" }, { condition: "init失败", response: "不调用save，不宣称完成，记录Primo退出结果。" }, { condition: "目录/说明恢复或save失败", response: "记录失败阶段；目录恢复失败不保存，save失败不宣称镜像已更新。" }],
    sources: [{ path: "zguardian.ps1", role: "计算、阈值、唯一编号解析、实际命令与恢复。" }, { path: "tests/Test-RamdiskGuardianRecovery.ps1", role: "真实生产恢复分支的10个隔离情形。" }, { path: "README.md", role: "本机历史故障与当前预算。" }],
    verification: ["旧源码的初始化失败夹具返回0且报告完成，故障已复现。", "PS7/5.1均通过：默认盘成功、自定义盘索引成功、init失败、save失败、说明恢复失败、目标不存在、重复目标、多卷、ls失败、Primo不存在。", "仅只读Primo设置和当前任务，本轮没有实盘重建E2E。"],
    searchProjection: { intents: ["Primo删除缓存后内存不释放", "Z盘驱动高水位占用", "内存盘自动重建失败"], entities: ["Primo", "DMM", "Unaccounted Memory", "rxprd.exe", "Resolve-PrimoDiskIndex"], relations: ["资源阈值决定尝试，Primo盘符映射决定对象，退出结果决定报告"], failureRecovery: ["目标不明确不初始化，初始化失败不保存，所有失败都不写完成"] },
    relation: "恢复依赖第一模块的缓存约定和下一模块的Primo/计划任务安装，不能独立承诺数据保护。"
  },
  {
    id: "installation-and-application-recovery", slug: "installation-and-application-recovery", order: 5,
    title: "安装、应用接入和重启恢复分别确认", shortTitle: "安装与恢复", kicker: "Primo提供盘，任务维护盘，应用决定怎样使用缓存",
    teaser: "恢复12GiBPrimo配置、现有任务和缓存链接，再验证下一次自然启动。",
    value: "重装系统或任务丢失后，知道需要恢复哪些组件，也知道哪些结果还没有证明。",
    status: "安装状态已回读", statusTone: "accent",
    why: "脚本能运行不代表驱动已建盘；空文件夹存在也不代表Chrome已经接入。把驱动、定时任务、目录连接和自然重启分别检查，才能恢复完整使用路径。",
    example: "“重装后恢复原来的Z缓存配置。”先在Primo建12GiB、NTFS、RAMDISK卷标的非临时动态盘并设置镜像，再以管理员运行deploy.ps1。Chrome开着时脚本会跳过链接调整，关闭Chrome后再处理这一步；360临时目录按指南设置。",
    result: "有现有登录/15分钟任务、基础目录，以及满足前置条件的Chrome缓存连接。最后留到一次自然重启确认Primo自动加载，不为网页验收打断当前工作。",
    problem: "部署会修改快速启动、注册任务并可能替换Chrome的缓存目录；它不是只读查询。普通权限、目标卷不符或Primo未建盘时，不能把部分完成报告成整套恢复。",
    readerStates: { pass: "Primo和Z可用，任务配置正确，所需应用连接已逐项核实。", problem: "Chrome仍运行时跳过缓存连接；Z未出现时先完成任务等部署，再提示建盘后重新运行。", unavailable: "未安装Primo或没有管理员上下文，部署/驱动操作无法完成；缓存资料不应成为唯一恢复来源。" }, stateLabels,
    decisionImpact: ["当前配置为12GiB，不沿用旧截图或提示中的32GiB；Primo镜像当前为Compact Image（紧凑镜像）和Shutdown Save。", "默认-RamDrive Z、-IntervalMinutes 15；非默认盘符写ramdrive.txt，回Z时清除旧覆盖。", "只在Chrome关闭时处理Default配置的Cache、Code Cache、GPUCache；不宣称自动覆盖所有浏览器Profile。", "撤销RAMDisk_Code_Backup只删除计划任务，不删Primo盘、镜像或缓存。"],
    concepts: [{ term: "非临时盘与镜像", explanation: "Primo保存磁盘配置，并按所选模式加载/保存镜像。缓存可能跨启动保留，但项目仍要求内容可丢。" }, { term: "隐藏启动器", explanation: "VBS以隐藏窗口方式启动PowerShell，等待结束后将退出码交回计划任务，不常驻另一个守护服务。" }],
    implementation: ["deploy.ps1检查管理员与RAMDISK卷标，设置HiberbootEnabled=0，注册Interactive/Highest、登录触发和重复间隔、IgnoreNew、10分钟执行时限。", "任务调用wscript.exe与仓库run_hidden.vbs；VBS从自身目录定位zguardian.ps1，等待Windows PowerShell退出并WScript.Quit传递结果。", "部署在Z可用时执行一轮完整守护，非零结果停止后续部署；Chrome运行时跳过三个缓存连接，360解压临时目录由用户在其设置中指定。", "本机三个Chrome连接已回读到Z；360设置和WeFlow进程当前实际使用路径本轮未检查，不用目录存在替代。", "回退命令为Unregister-ScheduledTask -TaskName RAMDisk_Code_Backup -Confirm:$false，只在明确停用守护器时使用。"],
    flow: ["按DEPLOY.md先设置Primo驱动盘和镜像。", "管理员部署任务和基础目录，分别处理应用接入前置条件。", "读任务结果、健康日志、目录和连接；下一次自然启动再确认加载。", "若停用，仅按需要撤销任务，盘与应用连接另行处理。"],
    boundaries: ["本轮没有运行deploy.ps1、关闭Chrome、改快速启动或重启系统。", "Primo配置检查、自然周期执行和冷启动验收是不同证据。"],
    failures: [{ condition: "任务存在但Z尚未创建", response: "部署会说明部分完成；先恢复Primo配置，再执行所需后续步骤。" }, { condition: "Chrome正使用缓存目录", response: "跳过连接调整；不要为了网页展示关闭用户浏览器。" }, { condition: "任务返回0但健康ERROR", response: "以STATUS具体故障为准排查，不能只验任务返回值。" }],
    sources: [{ path: "DEPLOY.md / DEPLOY.pdf", role: "当前12GiB部署、检查与回退说明。" }, { path: "deploy.ps1 / run_hidden.vbs", role: "实际安装与调用链。" }, { path: "docs/primo_setup.png", role: "历史界面参考，容量以当前文档和实机为准。" }],
    verification: ["当前Primo为0号Z、12288MB、非临时、镜像启用，快速启动关闭；任务和三个Chrome连接已回读。", "README/DEPLOY PDF分别3页/2页，本轮重新生成并核对文字、渲染页面和源哈希。", "完整自然重启恢复未在本轮重做，保留该边界。"],
    searchProjection: { intents: ["重装后恢复RamdiskGuardian", "Chrome缓存连接到Z", "恢复RAMDisk_Code_Backup计划任务", "停止内存盘守护"], entities: ["deploy.ps1", "run_hidden.vbs", "ChromeCache", "ChromeCodeCache", "ChromeGPUCache", "Primo", "HiberbootEnabled"], relations: ["Primo建盘和加载镜像，任务补骨架，Chrome通过连接使用缓存"], failureRecovery: ["未建盘先恢复Primo，Chrome运行则跳过连接；停用任务不会自动删盘"] },
    relation: "这是其余四个模块的实际运行入口，也界定驱动、脚本和应用分别负责的恢复步骤。"
  }
];

export const project = ramdiskGuardianProject;
export const modules = ramdiskGuardianModules;
