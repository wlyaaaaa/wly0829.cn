import { createProjectSnapshot } from "./project-snapshot.js";

const pcconfigSnapshot = createProjectSnapshot({
  observedAt: "2026-09-24T05:03:35Z",
  label: "综合密码桌面已安装并完成定向使用回读；机器、备份与恢复仍各按自己的证据判断",
  boundary: "9月24日定向回读 PCConfig main=bf8959f：密码中心综合桌面与 E/G/H 完整包此前已安装，安装版在已有授权下实际开库、精确搜索并显示剪贴板记录。当前只读安装检查为 update_available：750 文件中 2 份 Registry 与源码有差异，不能说整套现在全量 current；本人外观签收和长期自然使用也尚未完成。整机硬件、任务、Veeam 镜像、受保护数据 P5–P7 与其它恢复范围仍保留各自原观察日期。",
  metrics: [
    { label: "配置地图", value: "14 项目 · 164 键" },
    { label: "恢复任务", value: "16组冷备完成 · 副机USB未接" },
    { label: "密码中心", value: "综合桌面已安装 · 恢复仍分层验收" },
    { label: "设备角色", value: "1 主工作站 · 1 副驾驶" }
  ],
  facts: [
    { label: "来源版本与独立验收", value: "2026-09-24T04:49Z 定向读回 PUBLIC 页面对应的 PRIVATE PCConfig main=bf8959f063efb6e0c1e3966312a5e6157752f4f8；当前工作树的 secret_catalog.json 另有并发未提交修改，未纳入事实。密码中心软件 d9e5b86、主机安装 epoch299 与 E/G/H 完整包有 Owner 分层回执；安装版开库、精确搜索和剪贴板 50 条显示通过，但本人外观签收与长期自然使用未被测试代替。系统镜像首份作业/介质、受保护数据正式迁移与 P4 恢复仍按各自缺口；整机硬件和任务数量不由本次推为新鲜。", hero: false },
    { label: "配置地图", value: "本轮源登记14个项目、164个配置键（snapshot_generation=34）、89个环境变量、64段PATH、11个受管软件和18个恢复锚点；23启动项仍是既有登记基线。主机管理员完整读取94项任务，正式账本也已对齐94项；恢复用途计划57项是另一套语义范围。" },
    { label: "开发存储", value: "V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过" },
    { label: "恢复任务", value: "2026-09-07历史只读回读：11 个核心恢复任务均 Ready、最近结果 0；14 组 G 来源存在、9 个必需集合 fresh（新鲜）；该次H首次冷备已登记但当时离线；最新H状态见本轮核心恢复回读" },
    { label: "秘密恢复", value: "10/10 项在三条恢复路线一致；G 路 20 份、PRIVATE 路 65 份快照，跨度 33 天" },
    { label: "受保护数据", value: "P0 当前选择器、自然启动与时限已经闭合；SafeSwitch manifest、后续版本和正式数据仍按各自证据分层" },
    { label: "双机角色", value: "WLY 是主工作站，LAPTOP-E48N0DRJ 是副驾驶；前者提供环境与算力，后者日常远控并保留自己的网络、Codex、规则和轻量项目。2026-09-09已从真实副机回读用户与SYSTEM两种执行身份、MCP服务和恢复胶囊。" },
    { label: "配置与启动规模", value: "2026-09-09源Registry（登记表）为14项目/164配置键，第34代生成于20:17:31.354Z；89环境变量、64段PATH、11受管软件和18恢复锚点。启动快照23项、原观察2026-09-05T20:53:09Z；本轮主机完整现场与正式账本均为94项，定义差异为0。", hero: false },
    { label: "任务登记后续投影", value: "tasks.json已通过正式task-scan管线发布94项，generation_id=task-scan-20260909t221121454-e3f172644f2143e0；恢复计划已于2026-09-09 20:08:17 UTC更新为9阶段57项，与当前用途目录hash一致，validator无错误。34项必需、8项可选、11项安装后手工、3项等待用户、1项只观察；主机MCP两项维护任务由共享Install重建。", hero: false },
    { label: "开发存储回读", value: "开发存储回读 V 盘 299.9 GiB、Z 盘 12 GiB；17 个恢复锚点的 5/5 检查通过。", hero: false },
    { label: "核心恢复任务", value: "来源Owner在2026-09-18T07:57:11Z交付记录中确认16组H冷备成功；DevConfig ZIP及携带清单在本地/G/Drive/H回读一致，隔离恢复8640文件/8531705353字节全树SHA-256通过。微信G/H145307文件/45218959121字节，H中53个等长同时间但内容不同的文件已修复并逐文件核验。网页只消费既有验收，没有再次备份或覆盖生产恢复。", hero: false },
    { label: "秘密恢复回读", value: "既有2026-09-01 Secret恢复证据为10/10项在三条路线一致，G路20份、PRIVATE路65份快照、覆盖33天；本轮核对密码中心15/15安装文件与源一致，没有重新恢复秘密，旧数量不作为今日实测。公开回执不返回秘密原文。", hero: false },
    { label: "稳定机器投影", value: "已发布硬件基线为v9；当前来源登记14个项目与18个恢复锚点，包含Emerald Veil的Windows桌面和锁屏恢复入口。C盘用户配置inventory（清单）有26项；稳定投影于2026-09-10已发布，登记与文件存在都不替代应用可用性。", hero: false },
    { label: "主工作站硬件基线", value: "稳定投影 v9 原观察于 2026-09-10T22:46:30.9789881Z：AMD Ryzen 9 9950X3D（16 核 / 32 线程）、64 GiB 内存（2 × 32 GiB，6200 MT/s）、NVIDIA GeForce RTX 5090 D（nvidia-smi 回读 32607 MiB，驱动 616.64）与 Windows 11 专业工作站版 25H2 / 10.0.26200；这是原基线，不是今日重采。", hero: false },
    { label: "恢复介质", value: "恢复介质 Registry 当前 16 项资产通过校验，0 error、0 warning；BIOS/UEFI 文字基线在 E 源、E 镜像和 G 热备三份同 SHA-256，F 有救急速查，文档引用的 20 个照片路径均存在且本次未读取照片内容。", hero: false },
    { label: "电脑角色", value: "PCConfig 现登记两种电脑角色：WLY 主工作站与 1 台副驾驶/备用笔记本 LAPTOP-E48N0DRJ；后者有独立 host identity 门、健康 Provider、远控/网络基线、恢复任务、writer 状态机和 USB 世代设计。", hero: false },
    { label: "副驾驶恢复现场", value: "2026-09-24T05:03:35Z 副机正式只读状态为 ready_usb_not_connected：当前热对话点 20260923T130007Z-5d62cd52，约16.1小时；USB不在场，cold_pointer=null、cold_matches_hot=false，不伪造新冷备。今日安全 Git 阶段 pass 且远端 OID 相同，conversation 阶段 not_due。Windows 恢复任务 Ready、最近结果0；独立周一07:15语义巡检当前 PAUSED。旧 9 月 18 日文件数与旧冷点仅作当日历史，新机恢复仍未验。", hero: false },
    { label: "P0 状态记录", value: "本轮读取到的公开状态仍绑定2026-09-03T03:07:57Z：revision 68、normal、active=LKG、trusted_control=true、recovery_status=null；该次自然启动61718 ms、deadline_met=true。它是已有状态记录，不是本轮自然启动验收，也不能抵消当前安装清单invalid（无效）。", hero: false },
    { label: "Drift 现场", value: "2026-09-09 22:12:59Z WLY Administrator（管理员）完整回读：7 pass、0 warn、1 block，complete_visibility=true；任务定义94/94，added/removed/changed均0，运行时、开发存储、核心恢复与重建计划通过。仅保留OllamaStable32100在9月8日22:04:04Z的LastTaskResult=1；同一Start-LocalGpuBroker入口的SelfHeal在9月9日22:11:01Z结果0，32100/32101的版本接口均0.33.1。当前可达不抹去历史失败，也不证明模型生成已验收。", hero: false },
    { label: "Codex Home 现役落点", value: "AI 工作台当前唯一运行根是 E:\\Data\\AppData\\Codex；C:\\Users\\10979\\.codex 只是指向它的兼容 junction，不存在第二份活动 Codex Home。", hero: false },
    { label: "个人数据当前副本", value: "PersonalDataReplica-Hot-Daily先让资料库与媒体库更新当前清单，再镜像五个E→G映射，最后同步媒体恢复包。既有最新回执为2026-09-09T09:12:07.6331218Z，整体与镜像complete、五映射post_verified=true、errors=[]；本轮只读回执。覆盖、重命名和删除跟随原件；Media/Packages排除，专用恢复包保留。", hero: false },
    { label: "电脑 MCP", value: "主副机MCP均以SYSTEM服务维持各自18793/18794前端，真实桌面由登录用户worker处理；登录前已有SYSTEM维护，不代表可操纵不存在的用户桌面。9月15日共享源码c507f62的23工具、四项输出合同、合成窗口/PNG/错误和两路维护已分别回读；本轮真实主机规则、文件读取与SYSTEM进程检查正常，但不外推到每种手机客户端或物理冷启动。", hero: false },
    { label: "独立保护安装", value: "2026-09-09已有管理员ContainmentInspect为installed、tasks_present=2；本轮完整任务视野仍确认两项存在，密码中心15/15安装一致。源登记production_enabled_untriggered，安装或任务存在不证明本轮触发过物理保护。", hero: false },
    { label: "Password Center", value: "Owner 2026-09-24 UTC 记录综合桌面安装 epoch299 的 775 项锚一致、2215 文件完整包在 E/G/H 入口 check0；安装版在已有有效授权下开库、精确搜索并显示 50 条剪贴板。04:59Z 再做只读安装 Inspect 为 update_available：750 文件中 748 与当前源码一致，secret_broker.json 与并发未提交 secret_catalog.json 两份 Registry 不一致，锚仍匹配且零写入；不把旧交付回执说成当前全量一致。本人外观签收与长期自然使用仍未完成。", hero: false },
    { label: "授权文件", value: "2026-09-24T04:59Z 只读安装 Inspect 对 authorization_file_broker.py 与 authorization_file_local_ui.py 分别返回 current=true；本地 UTF-8 查看/编辑实现存在于安装字节。整套 Password Center Inspect 仍是 update_available，不能借两文件一致宣称全套 current；以前 6/6 合成测试保留原日期，本轮未处理真实选中文件或进行真人恢复。", hero: false }
  ],
  gaps: [
    "电脑MCP运行数据尚无登记的独立备份；Git不包含应用身份、刷新令牌数据库或客户端登录态，同机SYSTEM迁移副本也不是独立备份。数据丢失后需重新登记与授权，本页不把源码部署称为登录恢复。",
    "任务台账已从89项对齐到94项，补全已安装的MCP及维护、两项独立BitLocker任务和真实Governance触发器；Windows PowerShell台账从5.1.26100.9168对齐5.1.26100.9278。这里只更新事实来源，没有改动实际任务或服务；Ollama历史失败仍保留。",
    "OllamaStable32100上次运行2026-09-08 15:04:04、结果1；当前32100接口仍能返回0.33.1。历史任务失败与服务当前可响应分别保留，未运行生成、加载模型或重启。",
    "Google Password Manager 没有稳定逐条 API 或 changefeed；当前只支持官方完整导出快照，reconciliation 状态仍为 missing，不能称实时双向同步。",
    "银行卡桥已安装并通过结构回归，本次没有真实支付页面的用户可见 E2E；不能声称真实付款表单已经验收。",
    "授权文件本轮核对新增View/Edit发布源码，2026-09-09安装15/15和此前6/6合成测试保留为历史；没有调用最高权限入口处理真实选择文件。当前runtime（运行链）与自然用户E2E仍未在本轮复核。正式入口没有独立preview/dry-run（预览/只预演）动作，以显式SelectedPath/OutputPath为输入，在执行链内部生成有界计划。",
    "PRIVATE Git 恢复路径已安装且状态就绪，本次没有执行干净新机恢复演练；同机重装、换机、系统盘故障和仅 PE 四条路径因此仍需在真实事件中分别完成端到端回读。",
    "9月18日四处DevConfig包与16组H冷备已经闭合；隔离还原、数据库完整性和备份集校验仍不等于整机新装恢复。H本次在线，不能把在线冷备描述成物理离线或异地灾备。",
    "本轮只读回读确认 C 兼容 junction 精确指向 E 唯一根；4d17554 已删除五个完成使命的 Codex Home 迁移脚本与测试，当前没有可再次调用的迁移产品。历史 cutover（切换）只解释现役落点与恢复依据，未来若要再次迁移必须建立新的具名目标和验收。",
    "PersonalDataReplica-Hot-Daily的最新五映射回执绑定2026-09-09T09:12:07.6331218Z；只证明该轮完成，不证明任务之间持续一致或手机端已经恢复。",
    "SafeSwitch当前Inspect报告install_manifest_invalid：8月23日旧版安装清单缺少现检查器要求的字段，且绑定的是旧registry版本；已装EXE与registry的bytes/hash仍与旧清单一致，未发现文件损坏证据。旧rev68启动记录不能替代新版本安装与恢复验收，不能修改清单来冒充已升级。",
    "Workspace 只完成零网络绑定检查，尚未证明远端 OAuth（账号授权）和具体动作本次可用。",
    "P0 v2 尚无安装根和自然重启证据，只能称源码候选。",
    "Vault V2 当前只到 protected_install_effect_source_ready（受保护安装动作源码已准备），没有 installer read-back（安装器回读），不能称已安装。",
    "受保护数据 Vault V2 的 P5–P7 仍是隔离样例；正式数据动作未授权，正式数据路径也没有被触碰。这与已安装的 Password Center 综合桌面不同。",
    "Recovery kit 的 BIOS/UEFI 核心设置记录是 present_verified（材料存在且指纹已核对），CPU/内存生效语义来自 user_confirmed（用户确认）；它不等于完整原生 Profile，也没有证明保存设置后的自然重启。WEPE 隐藏分区是 present_observed（现场观察到），只能说明能进入 PE；内部盘识别与网络 smoke 尚未验证。",
    "副机2026-09-24T05:03Z只读状态显示新热对话点约16.1小时，安全Git远端已对齐，USB缺席使当前冷点未形成；Windows恢复任务 Ready 与独立周检 PAUSED 分开。9月18日旧文件数和冷点保留原日期；真实新机恢复、物理冷启动、公司单服务转接和NVMe外置接管仍未验。",
    "原台式机 GM7000 通过 NVMe 硬盘盒在笔记本识盘、持续读取、跨机 BitLocker 解锁、ReFS Dev Drive VHDX 挂载与重型能力检查尚未做真实端到端演练。",
    "副驾驶本地项目 V:\\Projects\\ai-engineering-lab 无远端且不在恢复胶囊；未建立 PRIVATE Git 或加密导出前仍是单机故障风险。",
  "9月19日Owner另确认：恢复介质导出尚无覆盖整包启动文件的完整更新/回滚，CoreRecovery也尚未接入新设计要求的未推送工程成果保全；两项来源缺口未解决，不把旧引导包或Git远端当成完整新方案。Veeam 首份真实加密镜像和恢复介质仍未验；Macrium 已卸载，卸载后的重启也已完成。"
  ]
});

export const pcconfigProject = {
  usageEntry: "在已接入这台电脑 PCConfig 的 AI 对话中说明机器问题、目标设备和想得到的结果；需要本人验证时沿电脑现有可见入口办理。",
  usageInputs: ["当前设备或故障场景", "涉及的软件、文件、服务或目标卷", "是只检查、修复，还是准备恢复"],
  order: 3,
  slug: "pcconfig",
  title: "PCConfig",
  route: "/projects/pcconfig",
  searchAliases: ["PCConfig能管理哪些机器事实", "PCConfig怎样换机重装", "PCConfig有哪些受保护能力", "PCConfig如何恢复本机配置"],
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "16组冷备已核对；MCP、私人访问和双机恢复分层说明",
  cardStatusTone: "mixed",
  ...pcconfigSnapshot,
  repositoryNote: "源代码位于 PRIVATE（私有）GitHub（代码托管平台）仓库；本页完整公开产品思想、机器配置结构、普通技术事实、入口、失败和验证，只排除可复用凭据以及经活动全局分级确认需要保留的 L3+ 具体载荷。",
  summary: "电脑上的程序为什么没启动、配置放在哪里、备份能找回什么，以及人在外面怎样操作家里的电脑，都可以从 PCConfig 查起。它分别管理主工作站和备用笔记本的机器事实，连接现有诊断、维护、密码中心与恢复入口；先认清这次是哪台电脑、哪一项出了问题，再处理对应部分，不把两台电脑做成相互覆盖的镜像。",
  why: "电脑配置散在目录、软件、服务和计划任务里；同一个盘符或端口换一台电脑就可能指向别的东西。只复制整台旧电脑会带来不合适的驱动和登录状态，只靠代码仓库又找不回普通文件。PCConfig 帮我确认这台电脑当前装在哪里、怎样启动、备份在哪，出了问题按什么顺序恢复。",
  plainExample: "“昨晚备份好像没跑。先查是哪一步没完成，告诉我现在还有哪份可用副本，别为了检查再备份一遍。”系统会核对实际任务和对应备份记录，区分没有触发、执行失败、介质不在和已经成功；需要修复时再使用那项已有入口。",
  result: "拿到针对这台电脑的明确答案：哪里正常、哪里出错、已完成什么、从哪份材料恢复，以及下一步会改哪些东西。需要远程维护时返回真实命令或文件结果；涉及桌面、本人验证或换机时，分别说明还需要用户和设备完成什么。",
  readerStates: {
    "pass": "当前电脑、相关设置和真实运行结果都查得清楚时，按顺序处理，并分别确认文件、程序、自动启动和实际使用。",
    "problem": "发现目录换了、任务失败或备份不完整时，只暂停受影响的部分，保留改动前状态并给出修复入口。",
    "unavailable": "目标磁盘、程序或受保护入口暂时读不到时，明确说这一层无法判断；不拿旧路径猜测，也不把部分文件复制当成整机恢复。"
  },
  productPrinciples: [
    {
      "title": "远程对话只操作选中的真实电脑",
      "detail": "已连接的 AI 客户端可以调用这台电脑已有的文件、脚本和桌面工具；连接本身不会新建一个本机 AI 对话。普通文件任务能直接做就直接做，桌面操作只在实际需要且有可用会话时使用。"
    },
    {
      "title": "先看电脑真实状况，再动配置",
      "detail": "记录表只负责导航，不能冒充当前状态；真正要改什么，先由 Windows、安装根、任务或项目配置现场证明。"
    },
    {
      "title": "先认清是哪台电脑，再套方案",
      "detail": "台式机和副驾驶笔记本各有自己的路径、任务、端口与规则入口；host mismatch 只表示这条配置不适用，不能把另一台机器的账本生搬过来。"
    },
    {
      "title": "各个项目管好自己的业务参数",
      "detail": "PCConfig 只管机器路径、端口、任务、运行时与恢复关系，不把项目业务配置收走形成第二份真相。"
    },
    {
      "title": "每一次改动都留好退路",
      "detail": "动手前记下目标、原状态、影响对象与对应回滚入口，改完再现场回读；能回退不等于承诺固定几秒内完成回退。"
    },
    {
      "title": "大灾恢复必须一步一步来",
      "detail": "先恢复磁盘、网络和基础运行时，再接回项目、任务、启动项与私密配置，不拿整包覆盖冒充捷径。"
    },
    {
      "title": "秘密能跑通任务，不必先露给人看",
      "detail": "凭据通过引用和受保护调用完成任务，不进入聊天、终端、命令行或普通文件。"
    },
    {
      "title": "文件加密只碰本次亲手选中的范围",
      "detail": "授权文件域把文件当作不透明字节，只递归用户点名的目录；不扫描整盘、不理解正文，也不自动删除、上传、备份或并入凭据库。"
    },
    {
      "title": "每一层单独验收，互不顶包",
      "detail": "源码、安装、运行、恢复、自然重启和用户可用分别回读，绝不拿文件存在或任务就绪冒充真实结果。"
    },
    {
      "title": "看不全时诚实说不知道",
      "detail": "找不到、读取失败和真的不存在是不同结果。私人资料在本人获准的原期限内才能使用；一次验证取消不撤销仍有效的旧期限，真正到期或锁定才停止新访问。锁 Windows 屏幕、拿密码明文、限时本人授权和保护设备分别办理。"
    },
    {
      "title": "用到了才查，不建臃肿后台",
      "detail": "眼前任务需要时才读取机器事实，不新增全机后台扫描、自动更新或常驻治理层。"
    },
    {
      "title": "维护软件先避开正在使用的工作",
      "detail": "已登记的 Python 更新只在适合且电脑空闲时办理；正在用就等，失败保留旧版和恢复线索。单纯查看状态不会顺手安装更新。"
    }
  ],
  responsibilities: [
    "记录并核对这台电脑的目录、磁盘、端口、软件位置和本地数据来源。",
    "把登记与电脑当前状态对照，指出哪些确实变了，哪些只是暂时看不全。",
    "管理 Windows 开机与登录任务、受管软件和快捷方式的恢复顺序。",
    "电脑突然卡住时留下可分析的内存记录；后台等待有状态、可停止，结果送回原任务。",
    "分别管理主工作站和副驾驶笔记本的连接、日常能力和故障接管材料。",
    "核对本地、G 盘和 H 盘备份各自实际保存了什么，换机时按依赖一步步恢复。",
    "让密码在受保护位置保存，并只交给点名的程序或固定账号操作。",
    "对本人明确选中的文件提供加密、完整性核对、中断续作和不覆盖原件的恢复。",
    "承接需要本人确认的机器动作，并把程序升级、加密数据和恢复状态分开说明。"
  ],
  exclusions: [
    "具体项目自己决定业务行为、源码修改和项目验收。",
    "仓库身份、公开性和远端发布结果交给 GitHub 总索引。",
    "跨项目 AI 的行为规则与能力选择交给当前共同规则。",
    "密码和恢复秘密不写进登记表、聊天或普通日志，只经受保护入口使用。",
    "本人选中的普通文件不会被拿去当密码查找来源；文件加密与密码中心、整套加密文件库各有独立恢复办法。",
    "账本、测试或程序安装只证明一层，不能单独宣称整台电脑已恢复。",
    "不会后台复制两台电脑的全部驱动、应用数据和登录状态。",
    "不会因为目录看着不整齐就搬动文件或长期扫描整台电脑。"
  ],
  glossary: [
    { term: "PCConfig（电脑配置与恢复中心）", meaning: "这台电脑的机器事实索引、受控变更入口和恢复中心；它记录怎么找到、验证和恢复配置，不接管项目业务。" },
    { term: "Owner（责任源）", meaning: "对一类事实或动作拥有最终解释权的来源。PCConfig 只拥有机器事实，具体项目仍拥有业务含义。" },
    { term: "Registry（结构化登记表）", meaning: "保存稳定索引、恢复关系和安全元数据的 JSON（结构化数据格式）文件；它通常不是现场运行状态。" },
    { term: "Provider（现场读取器）", meaning: "从 Windows、安装根或真实服务读取当下状态的只读入口。" },
    { term: "Source of truth（真实配置源）", meaning: "某个配置真正生效的文件、任务、服务或运行时；PCConfig 快照只能引用它，不能反向取代它。" },
    { term: "Projection（稳定投影）", meaning: "从现场事实中筛出长期有意义、公开安全且可版本化的一层薄快照。" },
    { term: "Drift（漂移）", meaning: "登记事实与现场观察不一致；它可以是故障，也可以只是尚未刷新，必须看匹配检查的语义。" },
    { term: "Evidence status（证据状态）", meaning: "pass（已证明）、fail（已证明不满足）或 unknown（当前无法证明）；unknown 永远不能折算为通过。" },
    { term: "Read-back（正式回读）", meaning: "执行后再从真实 Owner 读取最终状态，而不是只相信命令退出码或旧回执。" },
    { term: "Preimage（变更前像）", meaning: "写入前保存并验证的原状态，用于失败后恢复到精确已知状态。" },
    { term: "CAS（比较后交换）", meaning: "只有当前 revision（修订号）仍等于预期值时才写入，避免并发覆盖。" },
    { term: "Task Scheduler（Windows 计划任务服务）", meaning: "计划任务是否存在、启用和最近怎样运行的现场权威；Registry 只保存恢复投影。" },
    { term: "Managed software（受管软件）", meaning: "已登记状态与更新 Adapter（适配器）的本机组件；未知组件不会被猜测或自动安装。" },
    { term: "SecretRef（秘密引用标识）", meaning: "让程序使用某个秘密但不把明文交给模型、终端或日志的稳定引用。" },
    { term: "Authorization file bundle（授权文件包）", meaning: "只包含用户明确选择文件的密文对象、加密索引、恢复状态和无正文回执；来源文件默认保留。" },
    { term: "DPAPI（Windows 数据保护接口）", meaning: "把本地敏感材料绑定到指定 Windows 身份的系统加密能力。" },
    { term: "Google Workspace Provider（谷歌办公服务入口）", meaning: "把固定账号的Gmail、Drive和Google Tasks收敛为明确类型化动作的本机入口；Calendar在这条路线冻结，不代表其他客户端的日历能力。" },
    { term: "AuthorityHost（旧 C 盘规则权威服务）", meaning: "第 79 代旧链曾用于验证规则、签名、账本和执行 Adapter；该 C 盘规则链已经决定退役，不再作为新规则的当前权威。" },
    { term: "CoreGoal（历史目标授权）", meaning: "只保留既有 P0 引用的兼容与恢复；禁止新目标或步骤，不再作为普通凭据操作、登记载体恢复或 E 规则发布的前置条件。" },
    { term: "LKG（最后确认可用版本）", meaning: "Last Known Good 的缩写；版本切换失败时可回到的最后一个已证明健康版本。" },
    { term: "Recovery Carrier（恢复载体）", meaning: "保存一份完整加密恢复集的已登记介质；只有载体或只有因子都不足以恢复原文。" },
    { term: "E2E（端到端验证）", meaning: "真实输入从用户入口经过完整链路，最终得到可见且可回读的结果。" },
    { term: "Host-scoped（主机限定）", meaning: "一份账本或 Provider 只有在实时机器身份满足条件时才解释现场；在其他电脑上只能作为设计和恢复导航。" },
    { term: "Recovery capsule（恢复胶囊）", meaning: "副驾驶笔记本的目标状态、窄用户文件、世代闭合和恢复入口；它防止空白新机覆盖旧来源，不是整机镜像。" }
  ],
  operatingFlow: [
    {
      "title": "先认当前电脑",
      "detail": "系统先确认实际在主工作站、副驾驶笔记本还是换机现场，防止把另一台电脑的路径当成本机事实。"
    },
    {
      "title": "找到机器事实",
      "detail": "AI 只读取这件事相关的路径、程序、任务、备份或保护状态，并分清登记与现场。"
    },
    {
      "title": "由对应入口处理",
      "detail": "需要改变项目配置、软件或恢复资料时，交给实际负责人；重要动作先固定目标和可回退材料。"
    },
    {
      "title": "看实际结果",
      "detail": "分别回读配置、程序运行、备份和用户可用性；查不全就说明哪层未知，不猜测机器健康。"
    }
  ],
  technicalOperatingFlow: [
    { title: "先确认当前是哪台设备", detail: "读取实时计算机名与用户根，区分 WLY 主工作站、副驾驶笔记本和临时 NVMe 接管；主机不匹配就返回不适用，不加载另一台机器的现场路径。" },
    { title: "先确认问题属于机器层", detail: "只有当前决定依赖本机路径、端口、运行时、任务、启动、备份或恢复事实时才进入 PCConfig；项目业务问题继续回到项目本身。" },
    { title: "定位唯一 Owner 和真实配置源", detail: "用最小 Registry 找到对应文件、任务、服务或 Provider；旧报告和人类指南只负责导航。" },
    { title: "现场观察并分离证据状态", detail: "读取 Provider、Windows 现场和安装根，把明确不匹配写成 fail，把无法读取写成 unknown，不用缓存补齐。" },
    { title: "先生成有回滚的变更计划", detail: "路径迁移、任务注册、软件更新或受保护动作先固定 target、preimage、依赖、回滚和验证命令；高风险写入走正式授权入口。" },
    { title: "由真实 Owner 执行", detail: "项目配置先由项目改，软件由组件 Adapter 更新，任务由注册事务变更，秘密只通过盲填或盲注入使用；明确选择的文件只交给独立授权文件域，不进入凭据发现或普通 Vault。" },
    { title: "逐层 Read-back", detail: "分别核对源码、测试、安装、任务或服务运行、恢复可用性、重启结果和用户可见结果；上一层成功不能替下一层。" },
    { title: "保留缺口并给出恢复入口", detail: "通过就说明证据范围；发现问题就保留原状或回滚；无法运行就给出精确 unknown、影响和下一次取证入口。" }
  ],
  components: [
    { name: "机器事实 Registry", responsibility: "登记磁盘、路径、配置键、任务、运行时、启动、恢复和受保护产品的稳定结构。", implementation: "当前仓库有47份Registry，含双机MCP独立配置；动态值仍由匹配Provider或Windows现场裁定。" },
    { name: "现场 Provider", responsibility: "以闭合 schema（数据结构合同）读取运行时、磁盘、启动项、端口、任务和安装态。", implementation: "主要使用 PowerShell（Windows 自动化终端）入口，输出有界 JSON，不返回秘密值或原始任务参数。" },
    { name: "稳定机器投影", responsibility: "保存长期有意义的硬件、系统、磁盘与关键运行时薄快照。", implementation: "规范 SHA-256（文件指纹）、版本链、原子替换和 no-change（无变化不重写）语义；当前 Registry 为版本 9。" },
    { name: "项目配置快照", responsibility: "为路径、端口、模型和本地数据源提供跨项目导航。", implementation: "164个登记键使用inspect、期望哈希、dry-run（只预演）、apply（正式应用）和mark-stale（标记陈旧）事务。" },
    { name: "任务与启动链", responsibility: "维护计划任务恢复投影、用途目录、启动快照和无窗口父进程合同。", implementation: "Task Scheduler 是运行权威；任务 XML、原始 Action 和敏感参数不进入公开回执。" },
    { name: "受管软件路由", responsibility: "把组件别名解析到自己的状态与更新 Adapter。", implementation: "当前目录登记 11 个组件；behind 才更新，equal 不重装，ahead 不降级，unknown 直接停止。" },
    { name: "原生内存故障记录", responsibility: "在突然卡住前留下可追查的系统提交量、内核池和进程内存趋势。", implementation: "Windows PLA每5秒采样、60秒分段；事件任务维护循环限额和前三次会话尾段。PerfMon与Task Scheduler可查看和停止；不依赖AI或数据库。" },
    { name: "可见一次性等待", responsibility: "手头工作完成后，让一个明确后台条件有可查看、可停止的等待入口。", implementation: "项目只读probe交给Tkinter窗口；终态最多一次官方queue，runtime记录与单实例锁保留真实投递结果。停止不取消底层业务，排队不等于AI接到。" },
    { name: "CoreRecovery（核心恢复）", responsibility: "组织重装或换机时的恢复顺序、热备/冷备衔接、任务重建和选择性验收。", implementation: "Inspect 零正文读取；Hot 原子发布小型上下文；Cold只消费已验证Hot，按登记保留集复制验真后清理退出集合的H副本。" },
    { name: "副驾驶笔记本健康与接管", responsibility: "维护备用笔记本的角色、远控、Tailscale、防火墙、运行时和台式机故障接管边界。", implementation: "唯一健康 Provider 只在 LAPTOP-E48N0DRJ 上读取现场；WLY 调用固定返回 host_mismatch，不建立第二份主工作站机器事实。" },
    { name: "副驾驶恢复胶囊", responsibility: "让笔记本重装、换机或丢盘后从独立世代恢复，同时防止空白新机覆盖旧数据。", implementation: "ProgramData 受保护任务、三态 writer 门、7 天周期、2 世代、本地 rollback 与加密 USB 分层；普通文件覆盖 Desktop/Documents/Downloads，排除已确认由主机保全的微信副本；Codex 历史和配置另由同任务接入的 codex-memory 引擎备份。" },
    { name: "双机电脑 MCP", responsibility: "把已授权对话中的文件、脚本、桌面和跨机维护交给实际目标电脑，并回读结果。", implementation: "共享SYSTEM服务前端与监督器、用户会话worker、命名管道和按需Admin/SYSTEM任务；两机独立配置/凭据/部署，断连按原request_id查询，不重放动作。" },
    { name: "Secret Broker（秘密代理）", responsibility: "集中管理秘密的发现、盲用、恢复集和设备信任，不把明文交给调用者。", implementation: "运行库在仓库外加密保存；公开 Registry 只保存 SecretRef、策略和无秘密入口。" },
    { name: "Password Center（密码中心）", responsibility: "把凭据查找、来源冲突、创建更新替换退役、完整 Chrome CSV、因子管理、盲用、综合桌面与跨机恢复接成可回读的产品。", implementation: "网站凭据在加密库中，项目秘密留在原 Owner；一份完整有效 PRIVATE Git Recovery Set（私有恢复集）加一个因子可走独立新机恢复，不依赖 G 同时在线。已安装的综合桌面把密码类别、手机状态和剪贴板放在同一窗口；银行卡原子保存与盲填。本地受控复制每次写入起计 1800 秒，普通关窗不提前清除。" },
    { name: "Authorization File Broker（授权文件代理）", responsibility: "把用户明确选择的文件或目录计划成可续作、可校验、可无覆盖恢复的加密包。", implementation: "独立随机域根、包密钥和逐文件密钥；AES-256-GCM 分块对象、加密 state/index、原子输出与无正文 receipt（回执）。不新增服务、数据库或后台任务。" },
    { name: "Browser Bridge（浏览器桥）", responsibility: "把网站登录和银行卡填充限定到用户当前确认的精确网页目标。", implementation: "1.4.0 launcher-verified；AgentCardFill 只对唯一 HTTPS 支付表单使用一次性能力，同时填入卡号、有效期和 CVV，不提交页面。" },
    { name: "Codex 恢复与现役落点", responsibility: "保存对话恢复点，并让应用与恢复工具都解析同一个物理 Codex Home。", implementation: "对话备份使用 VSS、内容寻址、逐对象 SHA-256 与 pointer-last；当前唯一根是 E:\\Data\\AppData\\Codex，C 只保留兼容 junction。迁移已完成，专用迁移脚本和测试在 4d17554 退役，不再作为当前动作入口。" },
    { name: "个人数据当前副本", responsibility: "用现有每日任务把本人原件、领域清单、G 副本和媒体恢复包按当前状态接起来。", implementation: "PCConfig 的 Sync-PersonalReplicasToG.ps1 先调用资料/媒体各自的 sync-current，再按五映射镜像 E→G，最后调用媒体 recovery-sync；任一步失败保留 partial/failed，五映射完成也不能吞掉领域维护失败。G→H按其登记有效保留集独立复制并回读，确认来源稳定后清理H退出集合的副本；离线或读取失败不当成空源。" },
    { name: "固定 Google Workspace Provider", responsibility: "固定账号的邮件、云盘及其明确读写；Calendar为冻结兼容面，不属于当前可调用服务。", implementation: "凭据用 DPAPI 保存；入口没有通用网址、方法或请求体透传，状态检查可做到 zero-network（零网络）。" },
    { name: "Protected-policy retirement", responsibility: "证明旧 C 盘规则运行面、Publisher consumer、worker 与任务已经退役，同时保留历史恢复材料和独立产品。", implementation: "Retirement Registry 当前有 37 个 source dependency，固定状态入口仍为 retired 且零 mutation；当前 validator 因 independent_product_installer 尚未进入分类 allowlist 而失败，不能继续把旧 36 项 PASS 冒充当前。" },
    { name: "受保护数据连续性", responsibility: "提供版本换挡、最高权限因子、加密保险库、恢复载体和隔离恢复设计。", implementation: "P0–P7（八个严格串行阶段）各有独立完成证据；源码、安装、真实数据迁移和重启验收不能互相冒充。" },
    { name: "漂移与验收", responsibility: "把策略结论和证据结论分开，让失败与 unknown 可定位。", implementation: "稳定 check id、bounded output（有界输出）和按 area/check 精确选择；验证器不会自动修复业务 Owner。" }
  ],
  usageExamples: [
    {
      "moduleSlug": "remote-computer-mcp",
      "ask": "我在手机上，帮我找出电脑文档里那一段，再运行现成脚本检查结果。",
      "effect": "先看这个手机或网页客户端是否真的提供电脑连接；有对应工具才从指定主机读取段落并执行已获准检查。旧桌面验收不能证明手机原生应用现在也开放同样工具。"
    },
    {
      "moduleSlug": "machine-facts",
      "ask": "这台主工作站的处理器、内存、显卡和开发工具到底是什么版本？",
      "effect": "交回机器登记里的具体型号与软件版本，并标上原观察日期；若要判断今天是否仍是这个版本，再查当前电脑。"
    },
    {
      "moduleSlug": "machine-facts",
      "ask": "我要把一个本地服务换到固定端口。",
      "effect": "先检查动态端口范围、系统排除段、现有监听和登记冲突；通过后立即绑定并回到项目真实配置源验证，不把预检当成预留。"
    },
    {
      "moduleSlug": "machine-facts",
      "ask": "这个项目准备从 E 盘搬到 V 盘。",
      "effect": "先确认仓库状态、路径消费者、计划任务、快捷方式、回滚和目标盘健康；复制验证后再切引用，不把移动和永久删除混在一起。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "PCConfig 里登记了哪些电脑，它们分别做什么？",
      "effect": "先按实时主机身份区分 WLY 主工作站与唯一副驾驶笔记本；只展示各自职责、稳定入口和未知，不把一台机器的盘符、任务或规则套到另一台。"
    },
    {
      "moduleSlug": "memory-diagnostics",
      "ask": "电脑突然卡住，重开后正常了，能查卡住前的内存吗？",
      "effect": "按故障时间读取Windows原生内存记录、上一会话尾段与事件，区分应用、内核池和系统提交增长；日志缺口和断电尾部仍明确未知，不结束程序或把最大占用当根因。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "这件事只差后台处理完，能在完成时提醒原任务继续吗？",
      "effect": "AI 做完手头工作后，可为这一项明确条件打开可见等待窗口；能看正在等什么、下次何时查、也能停。条件满足时只提醒原任务一次，提醒已排队还须等原任务真实接收。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "把本机已登记的开发工具安全升级。",
      "effect": "先告诉我现在装的版本、目标版本和两者关系：已经最新就不动，确实落后才备份、更新并现场回读；来源不明或安装通道不一致时直接停下，不拿猜测升级。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "为什么某个计划任务没有按预期工作？",
      "effect": "把“任务是否存在、上次是否报错、真正负责的程序有没有完成”分开回答，并指出该修哪一层；任务显示就绪并不等于业务已经成功，也不会把完整执行命令或 XML 一股脑暴露出来。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "台式机重启停在登录界面，我还能用 ToDesk 连上吗？",
      "effect": "先看开机服务和本次启动记录，不为了测试去结束远控；机器侧正常后，仍须由另一台设备在真实重启后试一次登录前连接。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "登录后微信只开了一个，怎么补回双开？",
      "effect": "微信启动器只补到两个健康顶层实例，不会无上限多开；进程数量仍不能代替账号是否登录的确认。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "第二路 WeFlow 读不到了，怎么恢复？",
      "effect": "先看第二路自己的持久配置、本地接口与当前资料库身份。配置目录缺失就停，不在临时盘新建空库；接口能打开也只说明服务在，不能替代账号和资料库确认。"
    },
    {
      "moduleSlug": "runtime-startup",
      "ask": "本地模型、OCR 和语音任务会不会一起抢显卡？",
      "effect": "先看哪些工作正在占用显卡；文字识别与语音识别可各跑一份，同类任务和本地模型按现有规则等待或报告冲突，结束时只释放自己的资源。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "离开台式机时，副驾驶笔记本能不能独立工作？",
      "effect": "在笔记本现场检查 Tailscale、ToDesk、FlyingBird、开发工具、WSL2/Docker 和精确防火墙；台式机代理或数据库不可达时只标出依赖，不开放 LAN/公网替代。"
    },
    {
      "moduleSlug": "drift-acceptance",
      "ask": "PCConfig 现在到底健康吗？",
      "effect": "返回一张分区诊断单：哪些已经证明一致、哪些确实不一致、哪些因为证据不够仍未知，以及是否需要关注、该由哪个责任源处理；不会用一个总绿灯盖住局部问题。"
    },
    {
      "moduleSlug": "drift-acceptance",
      "ask": "为什么任务数量对不上，是故障还是权限看不全？",
      "effect": "同时告诉我账本数量、这次实际看见的数量和视野是否完整。只看见一部分时保留未知，不会直接宣布任务丢了；只有完整的只读现场才能判定真实漂移。"
    },
    {
      "moduleSlug": "drift-acceptance",
      "ask": "只检查核心恢复，不要跑整套验收。",
      "effect": "只运行核心恢复对应的登记检查并返回这一区域的结果；名称写错或没有匹配项时一个检查都不启动，也不会把没查的区域写成通过。"
    },
    {
      "moduleSlug": "recovery-backup",
      "ask": "重装系统或换机后恢复主要日常环境。",
      "effect": "先辨认电脑、磁盘和可用备份，再依次恢复 Windows、项目、个人设置、自动任务与登录；最后以正常开机和应用里真的看到旧数据收口。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "台式机坏了，能不能把原 NVMe 接到笔记本继续工作？",
      "effect": "用笔记本自己的 Windows 启动，把原 GM7000 只当数据盘；只读确认分区和 E/V 锚点，按实际根继续 Git、文档和项目，不改写台式机 Registry，也不假定重型 GPU 能力可继承。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "副驾驶笔记本重装后怎样恢复，又不让空白新机覆盖旧备份？",
      "effect": "先从已核对的旧副本生成恢复预览，空白新机在真正可用前不反向写旧备份；文件、账号和应用都验收后才重新开启自动备份。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "副驾驶笔记本硬盘坏了或恢复 U 盘不在，能恢复到什么程度？",
      "effect": "Git 恢复有远端的项目，独立加密 U 盘分别恢复普通胶囊内已覆盖的文件/策略，以及 codex-memory 独立恢复点中的 Codex 历史与私有配置；U 盘不在保持 unknown/等待，本机同盘 rollback 不能冒充灾备。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "让一个程序使用凭据，但不要把密码发给我。",
      "effect": "核对点名的程序与账号后，由受保护入口直接交给目标程序；普通答复只说使用结果，不出现密码。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "找出这个项目现在该用哪条凭据，并把我指定的旧凭据替换掉。",
      "effect": "先只显示候选的名称、用途、来源、健康和冲突；目标唯一且确实可写时，才替换我点名的旧项。新凭据加密保存、实际程序试用和恢复集回读都成功后才报完成；某个来源暂时离线不会被擅自删除。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "把 Google 密码管理器新导出的完整 CSV 增量导入，已有的别乱删。",
      "effect": "区分新增、保持和待复核，CSV 缺失项不删除；加密写入、回读和恢复集更新都成功后才清理这份一次性明文 CSV。它不是逐条 API、双向同步或自动修改 Google 密码管理器。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "我换了验证设备，想登记新因子并撤销旧因子。",
      "effect": "使用仍有效的已登记因子确认精确对象；登记、轮换或撤销后回读新的绑定，使旧会话和旧能力失效。失败只暂停当前请求，不能据此把设备改成不受信，四类全失也不能自行补造人类根。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "原电脑坏了，G 盘不在，只靠私有 Git 恢复集还能重建密码中心吗？",
      "effect": "设计路线会在干净新设备核对登记的 PRIVATE 恢复集和每项完整性，用一个仍有效的因子恢复，并为新设备生成自己的密钥，不复制旧私钥，也不依赖已退役平台。当前安装与恢复集虽已就绪，但本次没有做真实新机演练，不能把这条路线写成已经恢复成功。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "找出这封邮件，把我确认的回复交给固定 Google 账号发送。",
      "effect": "先找准邮件、显示待发内容；本人确认后由已绑定账号发送一次，结果不明先查已发送记录，不重复发。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "把这个文件上传到固定 Google 云盘，并只分享给我点名的人。",
      "effect": "先核对文件、云端文件夹和收件人；上传后查云端对象。分享另按这次点名的对象执行，不因上传成功就自动扩大可见范围。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "这个本机入口现在还能改日历吗？",
      "effect": "当前这条Google本机路线登记了Gmail、Drive和Google Tasks，Calendar已冻结；本轮零网络状态只证明配置及凭据文件存在，不证明Tasks OAuth或实际远端动作已通过。其他客户端的日历能力另行判断。"
    },
    {
      "moduleSlug": "authorization-files",
      "ask": "把我选中的这些文件和这个目录加密；中断后接着做，并确认以后能恢复。",
      "effect": "只处理点名的文件，保留原件，失败后按已核对进度继续；加密和恢复各查实际文件。新查看编辑窗口仍缺自然用户验收，不能借此宣称已可日常使用。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "在这个支付页填我选中的银行卡，但不要替我提交。",
      "effect": "确认唯一 HTTPS 页面和一组标准支付字段后，用一次性能力原子盲填卡号、有效期与 CVV；模型看不到值，提交按钮仍由用户决定。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "两台电脑之间怎样恢复账号和凭据，能不能直接复制登录状态？",
      "effect": "不能复制旧会话、Cookie、Token、密码或设备身份密钥；要在目标电脑重新登录，非秘密配置按新路径重建，秘密只从原本负责它们的凭据入口恢复。"
    },
    {
      "moduleSlug": "recovery-backup",
      "ask": "系统损坏后把 Codex 对话恢复回来。",
      "effect": "先选 G 盘或已验 H 盘的完整会话点，恢复到空目录并实际读回；备份存在不等于新系统已能继续工作。"
    },
    {
      "moduleSlug": "recovery-backup",
      "ask": "把 G 盘资料和照片另存到 H 盘前，还需要做什么？",
      "effect": "普通文件按它们原来的格式复制，H 盘须在场并解锁，复制后核对。密码库和加密文件库各走自己的保护入口；上一次完成不证明这一次已同步。"
    },
    {
      "moduleSlug": "remote-computer-mcp",
      "ask": "从副驾驶看看主机哪里出问题，需要管理员权限就用现有维护入口。",
      "effect": "先确认连接的是主机，再用普通工具检查；确需更高机器权限时走已经登记的维护入口，长操作沿同一个编号查询结果。真实登录前冷启动仍需另验。"
    },
    {
      "moduleSlug": "secondary-laptop",
      "ask": "副机每周到底备份了什么，现在U盘里的那份完整吗？",
      "effect": "在副机核对本地和 U 盘副本的时间、文件范围与完整性；明确哪些目录没包含。每周巡检只是找新的可行动问题，不会代替真正备份。"
    },
    {
      "moduleSlug": "secrets-providers",
      "ask": "把我点名的这条密码复制到主机，我来粘贴。",
      "effect": "精确验证后显示远控可操作的遮盖面板，报告主机复制次数或取消/到期；先粘贴再关窗，不能把主机剪贴板写入说成另一台设备已经收到。"
    },
    {
      "moduleSlug": "protected-actions",
      "ask": "系统要求确认是本人，我来验证；请告诉我设备和磁盘现在能恢复到哪一步。",
      "effect": "通过现有登记方式实际验证，再分别回读设备信任、秘密使用与必要的正常启动恢复。可见邀请才开始本次十分钟；普通取消不自动锁盘。准备、锁数据卷、重启和数据盘解锁是不同结果，代码或旧安装记录不代替真实执行。"
    },
    {
      "moduleSlug": "protected-data",
      "ask": "我想升级存私人文件的应用；先看看坏了能不能退回旧版，别直接动我的文件。",
      "effect": "先核对现装程序、旧版和恢复记录。眼下检查工具认不出旧安装格式，应先停在核实与修复，不能直接切换或说已具备可靠回退。"
    },
    {
      "moduleSlug": "protected-data",
      "ask": "我用于找回加密文件的一种验证方式丢了，能不能换掉？",
      "effect": "先确认还有另一种可用的恢复方式，再在受保护入口处理替换。当前已证的小型测试范围只支持恢复码，不能承诺真实文件库的多种验证方式已上线。"
    },
    {
      "moduleSlug": "protected-data",
      "ask": "我想打开加密文件库，找到一份文件并预览。",
      "effect": "这是完整产品的目标；目前正式文件库没有完成安装与真实使用验收，所以先说明尚无可用日常入口，不显示一个假“打开”按钮。"
    },
    {
      "moduleSlug": "protected-data",
      "ask": "旧电脑坏了，只剩一份备份和我的验证方式，能把文件找回来吗？",
      "effect": "先核对备份是否完整、验证方式是否仍有效，以及是否有真正能在空目录打开文件的恢复程序。独立恢复真实文件尚未验收，不能拿设计或合成样例承诺可以找回。"
    },
    {
      "moduleSlug": "protected-data",
      "ask": "如果以后把旧文件放进加密库，热备和冷备该怎样验？",
      "effect": "目标是只导入我点名的文件，保留旧原件，并从两份备份各自找回代表文件。当前只有测试材料，不执行真实迁移或备份，也不删除旧文件。"
    },
    {
      "moduleSlug": "owner-takeover",
      "ask": "给当前对话两小时本人授权，我自己验证，不扩到其他对话。",
      "effect": "直接打开现有窗口，按本人选择范围和实际验证结果生效；原截止不随续聊延长，取消只终止这次申请。"
    }
  ],
  evidenceLayers: [
    { layer: "Registry（登记层）", proves: "已登记 Owner、路径引用、恢复关系、schema 和验证入口。", doesNotProve: "现场值仍相同、任务正在运行或消费者已加载。" },
    { layer: "Provider（现场层）", proves: "本次观察时 Windows、安装根或服务返回了什么。", doesNotProve: "登记快照已刷新，也不授权任何写入。" },
    { layer: "Source / Test（源码与测试层）", proves: "当前实现和指定 fixture（隔离样例）覆盖了哪些行为。", doesNotProve: "正式安装态、计划任务、真实账号或真实数据已经可用。" },
    { layer: "Install（安装层）", proves: "制品、ACL（访问控制权限）、任务或快捷方式已落到目标并回读。", doesNotProve: "一次真实启动、重启或业务请求已经成功。" },
    { layer: "Runtime（运行层）", proves: "任务、服务、Adapter 或 Provider 在本次现场能够运行。", doesNotProve: "备份内容完整，或所有项目业务都恢复。" },
    { layer: "Recovery（恢复层）", proves: "精确 preimage、备份集或隔离目录能按合同恢复并校验。", doesNotProve: "换机、全部私人数据或未抽样对象已经恢复。" },
    { layer: "Reboot（重启层）", proves: "自然 Windows 重启后的启动任务、selector 和时限结果。", doesNotProve: "未来每次启动都不会受硬件或外部依赖影响。" },
    { layer: "User acceptance（用户验收层）", proves: "用户要解决的现实问题已经得到可用结果。", doesNotProve: "所有低优先级差异已经消失，或系统不再需要维护。" }
  ],
  evolution: [
    {
      "date": "2026-07",
      "title": "先查清电脑现在怎样",
      "result": "把路径、端口、磁盘、运行环境和任务整理成可查的机器事实；配置变化先确认影响范围与退路，记录表不能代替现场状态。",
      "evidence": [
        {
          "date": "2026-07-09—07-10",
          "note": "机器事实登记、漂移检查和中文恢复导航。",
          "commit": "5be0221–1359298"
        },
        {
          "date": "2026-07-12—07-25",
          "note": "资源协调、存储与固定端口检查进入变更前判断。",
          "commit": "cddf2d1–f841453"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "配置、秘密与机器保护各有入口",
      "result": "热备、冷备、计划任务和启动恢复开始相互衔接；凭据通过专门入口使用，机器保护单独处理，文件存在、程序已安装和真正可恢复分别说明。",
      "evidence": [
        {
          "date": "2026-07-26—07-30",
          "note": "秘密代理、核心恢复与稳定机器投影形成。",
          "commit": "8799324–5a9eb5a"
        },
        {
          "date": "2026-07-31—08-08",
          "note": "当时集中保护链及固定账号入口的早期阶段；旧集中平台随后退役，独立产品继续保留。",
          "commit": "50f71fc–edb3cef"
        }
      ]
    },
    {
      "date": "2026-08",
      "title": "两台电脑各自工作，不复制整台旧机器",
      "result": "备用笔记本有自己的网络、运行环境、健康与恢复登记；一台机器的路径和任务不套到另一台，原NVMe接管保留为需要实机验证的路线。",
      "evidence": [
        {
          "date": "2026-08-11—08-16",
          "note": "副驾驶健康、恢复账本与关键启动链形成。",
          "commit": "bc933c3–04fc78d"
        }
      ]
    },
    {
      "date": "2026-08",
      "title": "加密数据先保住退路，再换版本",
      "result": "版本切换、恢复因子、日常文件使用和独立恢复被拆成可以分别验收的部分；先证明旧结果仍能找回，再采用新版本。后续加密文件库和正式迁移的设计、源码、安装与真实数据效果始终分开。",
      "evidence": [
        {
          "date": "2026-08-18—08-23",
          "note": "P0换挡器和因子保险库形成，源码通过不等于正式数据恢复。",
          "commit": "1a4d030–f879e5f"
        },
        {
          "date": "2026-08-24—08-27",
          "note": "CoreGoal时代的耐久目标和P3/P4候选属于历史，不表示当前旧平台仍在运行。",
          "commit": "8753374–d3d8d00"
        },
        {
          "date": "2026-08-28",
          "note": "恢复内核、因子、目标与文件应用的分工及P5–P7后续设计；候选不升级为现役。",
          "commit": "0fffc15–c63d804"
        }
      ]
    },
    {
      "date": "2026-08-29",
      "title": "退役旧集中执行链，独立产品保留",
      "result": "旧的集中规则执行系统已退出日常工作；密码中心、磁盘保护和各恢复能力仍走自己的入口。历史材料只用于理解和找回，不再替当前系统发命令。",
      "evidence": [
        {
          "date": "2026-08-29",
          "note": "旧protected-policy runtime正式退役，历史材料与独立产品分别保留。",
          "commit": "ec98fb1–6922bdb"
        }
      ]
    },
    {
      "date": "2026-08-30–09-01",
      "title": "从保住文件走向恢复日常环境",
      "result": "密码中心增加独立恢复和精确银行卡使用，Codex对话接入G/H恢复点；重装按固件、Windows、项目、配置、启动和实际应用逐层完成。Codex Home迁移完成后，专用迁移工具退出日常入口。",
      "evidence": [
        {
          "date": "2026-08-30—08-31",
          "note": "密码中心、Codex对话恢复与完整换机旅程共同推进。",
          "commit": "9449bad–f9245a1"
        },
        {
          "date": "2026-09-01",
          "note": "已完成的Codex Home迁移工具退役，当前文件副本转由既有精确备份任务维护。",
          "commit": "4d17554–3fae514"
        }
      ]
    },
    {
      "date": "2026-09-09–09-18",
      "title": "人在外面也能检查和维护真实电脑",
      "result": "电脑MCP承接手机对话和两机工具调用，区分登录前维护、登录后桌面与断线后查询原请求；副机部署可升级回退，文件与各层备份分别验真，物理冷启动和整机恢复仍另验。",
      "evidence": [
        {
          "date": "2026-09-09",
          "note": "双向维护、SYSTEM与登录用户边界、副机恢复和主机遮盖复制；当时尚未完成的实机场景不能由工具回读补证。",
          "commit": "540f6d0–c932297"
        }
      ]
    },
    {
      "date": "2026-09-19",
      "title": "无限制授权与后续恢复设计分开",
      "commit": "",
      "result": "本人主动的临时接管沿现有验证入口，只在真实授权范围和原期限内生效；新恢复与个人资料生命周期方案仍按源码、安装和真实使用分别说明，不把设计稿当运行事实。"
    }
  ],
  operationalEntrypoints: [
    { name: "电脑 MCP 状态", command: "E:\\PCConfig\\tools\\remote-computer-mcp\\Manage-RemoteComputerMCP.ps1 -Action Status", purpose: "只读核对SYSTEM服务、登录用户worker、回环监听与OAuth；副机使用自身deployment.manager_path及config_path，MaintenanceStatus另读两路按需任务。" },
    { name: "内存故障记录状态", command: "E:\\PCConfig\\tools\\Invoke-MemoryFreezeDiagnostics.ps1 -Mode Status -Json", purpose: "只读返回原生采样、自动接续、限额、最近维护和界面入口；不读取用户采样数字或启停记录。" },
    { name: "机器事实漂移", command: "E:\\PCConfig\\tools\\Test-PCConfigDrift.ps1 -NoWrite -Json", purpose: "零写入比较登记与现场，并分别给出策略状态和证据状态。" },
    { name: "稳定机器投影", command: "E:\\PCConfig\\tools\\Invoke-StableMachineProjection.ps1 -Action Read -Json", purpose: "读取版本化、公开安全的稳定机器事实，不触发 live publish（现场发布）。" },
    { name: "运行时现场", command: "E:\\PCConfig\\tools\\Get-RuntimeInventory.ps1 -Json", purpose: "读取 PowerShell、系统权限与编码相关的当前运行时事实。" },
    { name: "开发存储健康", command: "E:\\PCConfig\\tools\\Get-DevStorageHealth.ps1 -Json", purpose: "检查 V 开发盘和 Z 缓存盘的挂载、文件系统、目录骨架和恢复锚点。" },
    { name: "固定端口预检", command: "E:\\PCConfig\\tools\\Test-LocalServicePort.ps1 -Port <port> -ProjectId <project_id> -Key <stable_key> -Json", purpose: "检查动态范围、排除段、监听和 Owner 冲突；它不会预留端口。" },
    { name: "受管软件目录", command: "E:\\PCConfig\\tools\\Invoke-ManagedSoftware.ps1 -List -Json", purpose: "列出已登记组件和自己的状态/更新路由，不探测未知组件。" },
    { name: "启动快照比较", command: "E:\\PCConfig\\tools\\Invoke-StartupSnapshotMaintenance.ps1 -Action Inspect -Json", purpose: "比较五个登录启动 surface（来源面）；差异只作信息，不自动修复。" },
    { name: "核心恢复观察", command: "E:\\PCConfig\\tools\\Invoke-CoreRecoveryMaintenance.ps1 -Mode Inspect -Json", purpose: "只读任务和根路径元数据，不枚举个人文件名或内容。" },
    { name: "副驾驶笔记本健康", command: "<当前 PCConfig checkout>\\tools\\Get-SecondaryLaptopHealth.ps1 -Json", purpose: "只在精确副驾驶主机读取远控、网络、工具、任务和恢复状态；其他主机返回 not_applicable/host_mismatch。" },
    { name: "秘密代理状态", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action Status -Json", purpose: "验证安全核心和恢复闭环，回执固定不返回明文。" },
    { name: "凭据安全查找", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action Lookup -Query <明确名称或用途> -Json", purpose: "只定位安全元数据与候选；不 Reveal、不因查到候选就取得写权限。" },
    { name: "凭据恢复覆盖", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action RecoverySetStatus -Json", purpose: "查看恢复集覆盖、载体状态与最近验证，不执行恢复或显示秘密。" },
    { name: "授权文件工作流", command: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1 -Action <AuthorizationFileEncrypt|AuthorizationFileVerify|AuthorizationFileDecrypt> -Json", purpose: "只对明确选择路径执行加密、无明文落地校验或无覆盖恢复；Encrypt 传 SelectedPath/OutputPath，Verify 传 InputPath，Decrypt 传 InputPath/OutputPath。" },
    { name: "Workspace 绑定", command: "E:\\PCConfig\\tools\\Get-GoogleWorkspaceProviderBinding.ps1 -Json", purpose: "零网络读取固定绑定与凭据文件存在性；不解密、不证明远端授权。" },
    { name: "Workspace 动作预演", command: "E:\\PCConfig\\tools\\Invoke-GoogleWorkspaceProvider.ps1 -Action <已登记写动作> <精确参数> -DryRun -Json", purpose: "本地校验选定Gmail/Drive/Tasks动作，不解密、不刷新令牌、不联网；正式写入另需ActionAuthorizationConfirmed，破坏性动作还需Force。Calendar冻结时在访问凭据和网络前拒绝。" },
    { name: "旧 policy 退役状态", command: "E:\\PCConfig\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1 -Json", purpose: "固定返回 retired、历史保留和 E rules replacement；不再读取 C 盘活动代际。" },
    { name: "按区域验收", command: "E:\\PCConfig\\tools\\Invoke-PCConfigAcceptance.ps1 -NoWrite -Area <area> -Json", purpose: "只运行选定 area（验收区域）的登记检查；未运行项不进入结果。" }
  ],
  "kicker": "查清电脑状态，改动可退回，故障有恢复路线",
  "readerBoundary": "文件与配置备份已有各自验证；新的Veeam镜像引擎已安装，但首份镜像、作业和恢复介质未完成。系统侧AI引导已有隔离安装证据，整机恢复与新资料生命周期不能称已验。",
  "operatingChoices": {
    "title": "电脑出问题时，从哪条路开始",
    "intro": "先区分要找文件、恢复系统、重新进入AI，还是本人临时接管；一条路线通过不能代替另一条。",
    "rows": [
      {
        "need": "检查文件、配置和应用数据是否保住",
        "choice": "现有G热备、H冷备与对应项目恢复",
        "result": "查看具体备份包、清单和成功范围，必要时先隔离恢复。",
        "boundary": "不是系统镜像，不保证免登录或应用已接受所有数据。"
      },
      {
        "need": "Windows本身损坏或系统盘要更换",
        "choice": "系统镜像恢复（Veeam）",
        "result": "先核对是否真正做出了可用镜像和启动恢复介质；仅安装备份程序还不能还原电脑。",
        "boundary": "首份加密镜像、自动作业和恢复介质尚未完成。"
      },
      {
        "need": "Windows恢复后，原开发环境还没有接好",
        "choice": "独立的 AI 快速恢复入口",
        "result": "先用现有恢复材料重新进入 AI，再按新电脑的实际盘符找回项目和设置。",
        "boundary": "入口能启动不等于模型、账号和整机环境都已恢复。"
      },
      {
        "need": "我要在有限时间内亲自指定后续操作",
        "choice": "无限制授权（本人限时接管）",
        "result": "填写时长和范围，完成本人验证后按原截止使用。",
        "boundary": "不预先要求指定模型批准，不替代平台和真实设备能力，也不自动解锁私人资料。"
      }
    ]
  },
};

export const pcconfigModules = [
  {
    slug: "machine-facts",
    usageEntry: "在已接入 PCConfig 的 AI 对话中说明要找的程序、目录或端口；也可要求“只查现场”。",
    usageInputs: ["当前电脑", "目标程序、路径或端口", "要查询还是准备迁移"],
    productFlow: [
      {
        "title": "找到这件事的机器记录",
        "detail": "系统定位目标程序或端口的登记位置和实际所在，先看有没有别的软件依赖它。"
      },
      {
        "title": "比对登记与现场",
        "detail": "AI 核对实际端口占用或路径引用；若要迁移，先列出会受影响的程序和回退办法。"
      },
      {
        "title": "交回可用位置",
        "detail": "给出当前可证的路径或冲突；现场读不到就保持未知，不因旧账本存在而建议直接移动。"
      }
    ],
    shortTitle: "机器事实",
    title: "机器事实、路径与配置导航",
    teaser: "说清“这台电脑现在到底怎样、配置在哪、改动会碰到谁”，并在选路径、端口和开发存储前做一次现场防撞检查。",
    status: "机器事实可读，开发存储 5/5 通过，稳定投影为版本 9；TimeAudit 增量消费者已有合同与定向测试，本轮未证明 weekly 现场运行",
    statusTone: "mixed",
    searchAliases: ["TimeAudit异常会直接改变稳定机器投影吗", "PCConfig异常游标什么时候推进", "每周机器维护怎样消费TimeAudit摘要"],
    searchProjection: {
      intents: ["查看本机配置在哪里", "确认当前主机和设备角色", "迁移项目路径", "检查固定端口", "判断笔记本能否接管台式机", "消费TimeAudit增量异常并决定是否重查稳定事实"],
      entities: ["WLY 主工作站", "磁盘与盘符", "V 开发盘", "Z 可重建缓存", "项目配置键", "稳定机器投影", "TimeAudit anomaly cursor", "projection_recheck_recommended"],
      relations: ["主机身份决定机器事实", "项目配置源投影到 PCConfig", "路径关联项目和任务消费者", "端口同时受系统范围和监听约束", "TimeAudit只给异常摘要和重查建议", "PCConfig live provider独立裁定投影是否变化"],
      failureRecovery: ["host mismatch 不套用另一台机器", "现场不可读保持 Unknown", "快照更新失败标记 stale", "TimeAudit来源不可用或payload非法时游标不推进", "迁移失败保留源路径和回滚"]
    },
    value: "像看一张会核对现场的电脑地图：程序在哪、端口有没有被占、哪些任务还指着旧目录，改变前先看会影响谁。性能异常只是提示再查，不直接改写机器配置。",
    why: "搬了一个目录或改了一个端口，软件、计划任务和快捷方式可能还指着旧位置；短时发热也不代表机器配置已经改变。这里先查真正的占用和依赖，再给出能用的目标。",
    example: "比如我说“把这个本地服务换到一个固定端口”。系统先查动态端口范围、系统排除段、现有监听和其他项目登记；只有没有冲突，才把候选交回项目自己的配置源真正绑定并验证。若现场读不到或发现占用，就直接说清是哪一层挡住，不拿常见端口碰运气。",
    result: "我能知道这个端口或目录现在由谁使用、能否改动、会影响哪些程序。电脑现场读不到时就停在无法判断，不拿常用盘符或旧记录冒充当前事实；短时异常只提示另查。",
    readerStates: {
      "pass": "实际占用和依赖都查清后，给出可用目标，再由所属项目修改并验证。",
      "problem": "发现端口被占、目录仍被任务引用或磁盘有问题时，停止这处改动并指出冲突。",
      "unavailable": "现场查不到时保留未知；历史性能异常只建议重查，不直接写成硬件已经变化。"
    },
    decisionImpact: [
      "机器配置值先回到项目、服务或任务的真实配置源，PCConfig 快照只负责导航。",
      "稳定投影回答的是最后一次配置基线，不是此刻负载或今天刚重采的配置；型号、版本和观察时间必须一起读取，真实升级决定再核对对应 live Provider（现场读取器）。",
      "路径迁移必须同时具备 source（源路径）、target（目标路径）、消费者、preimage（变更前像）、rollback（回滚）和 verification（验证）。",
      "固定端口在所有实时门禁通过后仍须立即真实 bind（绑定），预检不是预留。",
      "短生命周期服务直接绑定端口 0，由操作系统分配，不建立无意义的固定登记。",
      "V 是开发层，Z 只放可重建有界缓存；唯一源码、数据库和正式备份不能放进 Z。",
      "PCConfig 只持有 TimeAudit 增量 cursor 与有界 decision receipt；原始时序、进程、窗口标题和异常 payload 不进入稳定机器状态。",
      "只有成功 `(after, until]` 窗口才推进游标；unavailable、非法 payload 和相同边界分别保持旧游标或严格 no-op。",
      "TimeAudit 只建议是否重查，`Invoke-StableMachineProjection.ps1` 必须重新读取 PCConfig live 稳定事实后独立决定 no_change 或 published。",
      "需要移动文件、调整配置或排查某个路径的影响时，query_project_impact.mjs 按精确 path/config-key/target-id 返回登记的项目、依赖、验证与恢复入口；先规范化盘符、分隔符及点路径。不扫描私人原件、不执行下游更新；没有命中只表示登记未覆盖，不能当作没有影响。"
    ],
    problem: "机器事实既有长期稳定信息，也有每次都可能变化的现场状态。把两者混在一份静态文档里，会让旧路径、旧端口或旧运行时继续被误用；反过来持续扫描整机又会制造隐私、延迟和第二事实源。",
    implementation: [
      "44 份 Registry 分别保存 machine、drives、folders、path owners、project config keys、dependencies、runtimes 和恢复关系；每类都有明确 schema 和 validator（校验器）。",
      "稳定机器 Provider 只采集硬件、系统、固定卷和关键运行时，明确排除序列号、网络标识、负载、温度、进程、秘密和原始时序。",
      "稳定投影用规范哈希、previous 链和同目录原子替换；payload（有效数据）不变时返回 no_change，不刷新 mtime（文件修改时间）。",
      "本页精确机器配置来自已发布stable_machine_projection v9：observed_at_utc=2026-09-10T22:46:30.9789881Z，generated_at_utc=2026-09-10T22:46:36.5028554Z，canonical_sha256=sha256:3c5b6aef743ce651069a3b365c2eafd88f830d230675cdb2951f4edc8408cc34；这是来源维护的配置基线，本轮网页没有重新采集硬件。",
      "主工作站为 x64 Gigabyte X870E AORUS PRO ICE；主板同型号，BIOS 为 American Megatrends F4b、发布日期 2025-02-21。CPU 是 AMD Ryzen 9 9950X3D 16-Core Processor，AM5、16 个物理核、32 个逻辑处理器。",
      "内存安装量 68719476736 bytes（64 GiB），两个 Asgard VAM5UH64C32BG-DVALWA 模块，各 34359738368 bytes（32 GiB）；额定与配置速率均为 6200 MT/s（每秒百万次传输），分别在 P0 CHANNEL A/B。",
      "Windows 基线为 Microsoft Windows 11 专业工作站版，25H2、version=10.0.26200、build_number=26200、edition_id=ProfessionalWorkstation、64 位、Client 安装；install_date_utc=2025-08-14T21:47:17Z。该投影没有单列补丁 UBR，不能从另一运行时的版本尾号推造系统补丁号。",
      "主独显为 NVIDIA GeForce RTX 5090 D：权威显存来自 nvidia-smi，为 32607 MiB；权威驱动 616.64，Windows 驱动 32.0.16.1664，VBIOS 98.02.31.40.2c。AMD Radeon(TM) Graphics 集显驱动为 32.0.21045.5002，独立显存字段未提供，不能填成 0 或算成第二块 NVIDIA GPU。",
      "同一显示适配器清单还记录 LIANLI USB Secondary Display-60hz（16.14.0.914），以及 GameViewer Virtual Display Adapter（15.6.5.199）、OrayIddDriver Device（17.50.19.949）、Virtual Display Driver（11.30.4.434）三项虚拟显示；六条显示记录不等于六块可用于模型计算的显卡。",
      "同次稳定基线的十个开发运行时是 Docker CLI 29.7.2、.NET SDK 10.0.303、Git 2.55.0.windows.3、Go 1.26.5、Node.js 26.4.0、Ollama 0.33.1、PowerShell Core 7.6.4、Python 3.14.7、Windows PowerShell 5.1.26100.9278、WSL 2.6.3.0；这里的精确版本只服务基线复原，不成为永久升级门。",
      "项目配置快照当前有164个键、第34代。update请求绑定Registry期望哈希、单一project id、唯一key集和项目Owner验证；投影失败时mark_stale，不保留伪current。",
      "目录 Registry 和路径 Owner Registry 各登记 57 项；项目路径依赖 Registry 汇总 15 个项目。普通任务只读取命中的有界条目，不加载整份依赖表。",
      "generated_publication_pipelines 把 inventory、task scan、项目依赖、任务重建和用途目录限定到各自 allowlist、checkpoint 与 current pointer；机器生成物不能越界写叙事或替代源 Owner。",
      "端口 Provider 同时读取 IPv4/IPv6 动态范围、排除段、listener 和登记冲突，available、blocked、unknown 使用不同退出码。",
      "开发存储 Provider 单独判断 V 与 Z；Z 降级不会自动阻断健康的 V 项目，当前现场摘要为 pass=5、warn=0、block=0。",
      "Invoke-TimeAuditAnomalyIncrement.ps1 调用 TimeAudit 的 `timeaudit.pcconfig-anomaly-digest.v1` Provider，只在 `%LOCALAPPDATA%\\PCConfig\\stable-machine` 保存 `pcconfig.timeaudit-anomaly-cursor.v1` 和有界 consumption receipt。",
      "weekly `PCConfig Governance Check` 复用现有维护路径：先消费增量，再固定运行一次稳定投影 publisher；若增量同时建议重查，罕见的第二次 publisher 调用严格 no-op，不新增高频任务。"
    ],
    flow: [
      "判断当前问题是否真的依赖机器事实",
      "从 Registry 定位 Owner、真实配置源和只读入口",
      "运行匹配 Provider 取得本次现场观察",
      "需要变更时冻结 source、target、消费者、preimage、rollback 和 verification",
      "先由项目 Owner 修改并验收真实配置",
      "再用期望哈希事务更新 PCConfig 快照或稳定投影",
      "每周维护按上次成功 cursor 向 TimeAudit 请求最长 168 小时的 `(after, until]` 聚合窗口；验证 owner/profile/schema/coverage、异常和重查建议。",
      "成功窗口写 bounded receipt 并推进 cursor；source unavailable、非法 payload 或同一时间边界不推进、不重写。只有明确 recommendation 才额外 Inspect 一次 live stable provider。",
      "从项目与现场两端分别回读"
    ],
    concepts: [
      { term: "Registry（结构化登记表）", explanation: "提供稳定键、Owner、来源和验证入口；它不是现场真相，也不能单独证明消费者已加载。" },
      { term: "Stable projection（稳定投影）", explanation: "只保存长期有意义且公开安全的机器事实，版本化记录真正变化，不做实时监控。" },
      { term: "Mark stale（标记陈旧）", explanation: "保留 last-known value（最后已知值），但明确撤销“这是当前值”的声明。" },
      { term: "Port preflight（端口预检）", explanation: "判断候选端口此刻是否适合尝试绑定；它没有锁定端口，因此检查后必须立即 bind。" },
      { term: "Move gate（迁移门禁）", explanation: "只有源、目标、依赖、风险、回滚和验证全部明确，才允许从复制验证推进到切换引用。" },
      { term: "Dev Drive（开发盘）", explanation: "V 盘的开发层；适合可恢复的仓库、worktree（隔离工作树）、包缓存和构建输出，不是独立物理备份。" },
      { term: "TimeAudit anomaly cursor（异常消费游标）", explanation: "PCConfig 自己保存的最后成功时间边界；它让每周维护只消费新窗口，失败不越过证据缺口，相同窗口不重复写。" }
    ],
    boundaries: [
      "不递归扫描整个 C 盘，只看会改变当前决定的候选",
      "不保存环境变量值、完整依赖 payload、序列号、网络身份或秘密",
      "project_config_keys 快照不反向修改项目真实配置",
      "稳定投影不记录进程、负载、温度、空闲空间或时序数据",
      "VHD（虚拟磁盘文件）位于 E 盘，不构成独立故障域",
      "目录不整齐不是迁移理由，移动和永久删除不能放在同一操作",
      "TimeAudit digest 不进入 stable_machine_projection.json，也不证明温度、磁盘或硬件配置发生稳定变化。",
      "增量消费不新建数据库、控制面或高频任务，不查询 TimeAudit 原始行，也不在来源不可用时重启它。"
    ],
    failures: [
      { condition: "Provider 或 Registry schema 失败", response: "对应事实保持 unknown，阻断依赖该事实的迁移或配置决定；旧报告不能补齐。" },
      { condition: "项目配置源已改变但快照无法安全更新", response: "优先把命中键标记为 stale；标记也失败则保留原文件并报告哈希或锁冲突。" },
      { condition: "端口预检通过但真实 bind 失败", response: "停止服务启动，重新探测；不自动退回 8000 等常见默认端口。" },
      { condition: "稳定投影 live payload 不完整或含禁入字段", response: "在替换 current 前失败，保留最后一个已验证的 v9 current；失败采集不能覆盖既有投影。" },
      { condition: "生成投影 staging、manifest 或 current 不闭合", response: "保留旧 current 与 checkpoint，不把 .incoming 或部分 registry 拼进现行配置地图。" },
      { condition: "V 或 Z 恢复锚点不可读", response: "只阻断依赖该盘的工作；不自动创建同名空盘覆盖恢复线索。" },
      { condition: "TimeAudit source unavailable、窗口非法或 digest schema / payload 不合约", response: "写有界 unavailable 结果但不推进 cursor、不调用稳定投影 publisher，也不尝试重启 TimeAudit。" },
      { condition: "同一 `(after, until]` 边界被重复调用", response: "返回 no_new_window，cursor 与 receipt 不重写；weekly 路径不会因此重复发布。" },
      { condition: "异常建议重查但 live stable provider 返回无变化", response: "保留 anomaly receipt，稳定投影严格 no_change；摘要不能覆盖 live provider 的裁定。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\folders.json", role: "57 个登记目录及其用途边界" },
      { path: "E:\\PCConfig\\registries\\path_owners.json", role: "57 个路径 Owner 与依赖事实来源" },
      { path: "E:\\PCConfig\\registries\\project_path_dependencies.json", role: "15 个项目的路径依赖汇总" },
      { path: "E:\\PCConfig\\registries\\project_config_keys.json", role: "路径、端口、模型和数据源的非权威快照目录" },
      { path: "E:\\PCConfig\\registries\\stable_machine_projection.json", role: "版本化稳定机器投影 current" },
      { path: "E:\\PCConfig\\registries\\generated_publication_pipelines.json", role: "机器生成 Registry/报告的 allowlist、checkpoint 与 current 边界" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.path-project-config.md", role: "路径与项目配置事务合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.stable-machine-projection.md", role: "稳定字段、禁入项、版本与发布语义" },
      { path: "E:\\PCConfig\\tools\\Invoke-TimeAuditAnomalyIncrement.ps1", role: "有界增量窗口、cursor、receipt、recommendation 与 publisher 调用边界" },
      { path: "E:\\PCConfig\\tools\\timeaudit_anomaly_increment.test.ps1", role: "成功推进、unavailable 不推进、同边界 no-op 与重查建议回归" },
      { path: "E:\\PCConfig\\docs\\governance\\local_service_port_policy.md", role: "固定端口实时门禁" },
      { path: "E:\\PCConfig\\docs\\governance\\move_gate.md", role: "迁移、回滚与删除分离" },
      { path: "E:\\PCConfig\\docs\\governance\\dev_storage_policy.md", role: "E/V/Z 放置和恢复关系" }
    ],
    verification: [
      "Get-DevStorageHealth.ps1 -Json 于 2026-08-29 返回 5 项 pass、0 warn、0 block",
      "Get-RuntimeInventory.ps1 -Json 当前 exit 0 且返回 pcconfig.runtimes.v1",
      "Invoke-StableMachineProjection.ps1 -Action Read -Json 读取入口对应已发布版本9；本轮只读registry与dbb30ee，投影生成于2026-09-10，是稳定配置基线而非瞬时运行状态",
      "validate_project_config_keys.mjs 验证键、敏感级别、来源、快照状态和事务字段",
      "test_local_service_port.test.ps1 覆盖动态范围、排除段、listener、登记冲突和 unknown",
      "stable_machine_projection.test.ps1 覆盖禁入字段、原子回读、变化链和重复 no-op",
      "d4480abc 的合同与 focused test 已定义 TimeAudit 增量消费者；本网页审计没有把测试存在冒充 weekly 任务本轮已运行或稳定投影发生变化。"
    ],
    relation: "这个模块回答“机器配置在哪里、现在是什么”；TimeAudit 增量摘要只提醒它何时值得重新读一次现场，不提供稳定事实本身。运行时与启动模块负责“它怎样启动和运行”，恢复模块负责“故障后怎样重建”，本人验证与设备保护模块负责“什么时候需要本人证明、秘密何时暂停，以及独立磁盘保护怎样恢复”。",
    readerStatus: "机器配置与路径已有可查询记录，开发存储检查通过；硬件异常是否已触发每周自动复核，本轮仍未证明。"
  },
  {
    "slug": "memory-diagnostics",
    usageEntry: "电脑卡住后，在已接入 PCConfig 的 AI 对话中提供发生时间，要求读取“内存卡顿诊断”；这是只读分析入口。",
    usageInputs: ["卡顿或断电的大致时间", "是否已重启", "希望排查的程序线索"],
    productFlow: [
      { title: "圈定故障时间", detail: "先把现象和重启时间对齐，避免拿现在的进程榜解释过去。" },
      { title: "读当时记录", detail: "读取上一会话尾段、内存计数和 Windows 事件，比较进程与系统内存变化。" },
      { title: "交回可能原因", detail: "列出有证据的增长线索和缺口；未保存的断电尾段不能补猜，也不会自动结束进程。" },
    ],
    "shortTitle": "内存故障取证",
    "title": "内存耗尽与突然卡住时，留下可追查的记录",
    "teaser": "即使AI、数据库或网络不可用，Windows仍按固定间隔留下内存与进程证据；恢复后按故障时间查，而不是只看当前任务管理器。",
    "status": "2026-09-14 02:55 UTC只读现场：原生收集器运行、自动接续启用、最近维护结果0；自然开机与硬断电尾部仍未验",
    "statusTone": "mixed",
    "value": "电脑突然卡住甚至只能断电时，事后再打开任务管理器往往已经看不到当时是谁占用了内存。这项能力让Windows自己记录系统内存、内核池和进程私有内存的变化，故障后按时间与当时PID追查。它独立于Codex、TimeAudit、Docker和网络，既不会杀进程，也不会为了取证重启电脑。",
    "why": "系统提交量耗尽可能来自某个应用、内核池或其他来源；一个进程此刻占用最多，不能证明它造成了之前的卡死。只扩大分页文件只能增加余量，持续保留故障前后的数字，才能区分真正增长的来源。",
    "example": "“刚才电脑突然卡住，重开后又正常了。看看卡住前是谁的内存在涨，先别结束程序。”系统先对齐发生时间，读取上一会话留下的尾段、邻近内存记录和Windows事件，比较进程私有字节、系统提交量与内核池变化；日志缺失时说清缺口，不把当前排行榜当根因。",
    "result": "给我故障前后能读到的内存变化、当时相关程序和仍缺的时段。它帮助缩小原因，不会自行结束程序；突然断电前尚未写下的最后一小段可能找不回来。",
    "readerStates": {
      "pass": "故障时段确有记录时，比较当时程序和整机内存的变化，只对证据支持的原因下结论。",
      "problem": "日志损坏或某类内存突然增长时，说明具体疑点与接下来的检查，不靠重启掩盖。",
      "unavailable": "没有当时记录或断电尾段丢失时直接说明，保留现有材料，不猜哪个程序造成卡顿。"
    },
    "searchProjection": {
      "intents": [
        "电脑突然卡住后追查内存",
        "查内存耗尽时哪个进程在增长",
        "停止内存故障记录",
        "查看断电前的记录",
        "恢复内存采样"
      ],
      "entities": [
        "PCConfig-MemoryDiagnostics",
        "PCConfig Memory Diagnostics",
        "Windows PLA",
        "BLG",
        "系统提交量",
        "内核池",
        "进程PID",
        "perfmon",
        "previous-sessions"
      ],
      "relations": [
        "Windows原生记录独立于AI和TimeAudit",
        "进程实例结合当时PID归因",
        "循环日志与上次会话尾段分开保留",
        "停止收集器与禁用自动接续分别控制"
      ],
      "failureRecovery": [
        "硬断电尾部可能丢失",
        "安装失败恢复原生配置",
        "停止后分段回调不复活收集器",
        "最多三个会话尾段",
        "缺日志不推断正常"
      ]
    },
    "decisionImpact": [
      "系统提交量、内核池和进程私有内存共同判断；最高占用不等于内存泄漏。",
      "采样在Windows原生性能收集器中持续进行，短脚本只做开机接续和分段后的限额清理。",
      "记录是有界故障证据，不是全机活动库；不读取命令行、窗口标题、聊天或文件正文。",
      "PerfMon（性能监视器）停止当前记录；要重启后仍停用，使用Stop或同时禁用对应任务。",
      "4,320段是数量上限，不是保证保留三天；硬断电可能损坏当前段或丢失未落盘尾部。"
    ],
    "problem": "故障发生后现场容易消失；把记录放进依赖数据库、网络或AI的链条，还可能与业务一起停止。因此Windows原生收集器保留必要数字，AI在故障发生后才读取和判断，机器稳定配置与诊断时序保持分开。",
    "implementation": [
      "tools/Invoke-MemoryFreezeDiagnostics.ps1管理Install、Start、Stop、Status、Uninstall；唯一原生收集器为PCConfig-MemoryDiagnostics，根目录任务为PCConfig Memory Diagnostics。",
      "PLA（Windows性能日志与警报）每5秒记录Committed Bytes、Commit Limit、Available MBytes、Pool Paged/Nonpaged Bytes、Pages Output/sec、Page Reads/sec、Paging File使用率，以及Process实例的Private Bytes、Working Set、ID Process。",
      "收集器将BLG（Windows二进制性能日志）写入E:\\Data\\Diagnostics\\MemoryFreeze\\rolling，每60秒或16MiB封存一段，递增序号避免覆盖同名旧段。",
      "同一SYSTEM任务在开机延迟30秒和分段关闭时运行memory_freeze_maintenance.vbs；无额外轮询器，任务IgnoreNew（忽略重复实例）、限2分钟、失败最多重试3次，不要求用户登录。",
      "Windows原生DataManager（日志保留管理器）按最旧优先清理，rolling限1024MiB或4320段；当前段、清理过程与文件系统预分配允许少量暂时超额。",
      "从停止状态启动前，previous-sessions另存上一会话最新15段、最多64MiB，只留最近三个会话；先保留尾段，再清理循环区。后续启动仍可能淘汰超过三份的旧会话。",
      "维护错误写last-maintenance-error.txt，成功重试不覆盖它；该文件不存在仅表示未记录到维护错误。install-preimage.json保存最近安装前的任务/收集器配置，安装失败按前像恢复，独立于采样数据。",
      "perfmon.exe的“数据收集器集→用户定义”显示运行状态、间隔和位置；taskschd.msc显示任务启用、最近运行与开机触发。Stop先禁用维护任务，再停止本收集器；完成回调不会复活已停止收集器。",
      "故障后优先读取previous-sessions与Windows System/Application/Resource-Exhaustion事件，再读rolling邻近关闭段；用relog导出指定计数器，核对数值、时间跨度和PID。Import-Counter曾对有效文件报错，不能据此认定日志已坏。",
      "Get-ComputerStutterDiagnostic.ps1将TimeAudit有界摘要、原生内存黑匣子和Windows事件按同一时间窗交回，保留每条来源的覆盖和未知。TimeAudit当前心跳、原生BLG存在与故障根因不能互证；只读取故障判断所需范围，不重启或结束业务程序。",
    ],
    "flow": [
      "记录异常及断电时刻并统一到UTC",
      "只读Status确认采样状态与保存位置",
      "选上一会话尾段和故障邻近已关闭BLG",
      "用relog读取必要计数器并结合Windows事件",
      "按当时PID比较私有内存、系统提交与内核池趋势",
      "交回原因排序、覆盖缺口与有依据的下一步"
    ],
    "concepts": [
      {
        "term": "System commit（系统提交量）",
        "explanation": "Windows已承诺提供后备存储的内存总量；应与提交上限和各来源趋势一起看。"
      },
      {
        "term": "Kernel pool（内核池）",
        "explanation": "内核和驱动使用的内存，分别查看分页池与非分页池，不能全部归因给应用。"
      },
      {
        "term": "BLG（Windows二进制性能日志）",
        "explanation": "保存计数器随时间变化的原生文件；文件存在不等于数值与故障时段可读。"
      }
    ],
    "boundaries": [
      "不依赖Codex、TimeAudit、Docker或网络，不读取私人正文。",
      "不杀进程、不重启电脑、不重置显示；记录不会自动修复内存泄漏。",
      "硬断电的活跃段和未落盘尾部可能损坏或丢失；不承诺保住最后一秒。",
      "停止与卸载保留日志；日志清理由具体诊断和已有保留策略负责。",
      "PID与时间共同归因，进程实例后缀可能复用。",
      "本轮没有读取用户采样数字、运行relog或进行启停/断电演练。"
    ],
    "failures": [
      {
        "condition": "原生安装或配置回读失败",
        "response": "按install-preimage恢复原任务和收集器；回滚失败单独报告，不把部分安装当可用。"
      },
      {
        "condition": "收集器手动停止后收到分段完成事件",
        "response": "回调保持停止；只有明确Start或仍启用的下一次开机任务才接续。"
      },
      {
        "condition": "维护失败或任务结果非零",
        "response": "保留最近错误与实际状态，先诊断阶段和代码；无错误文件不能反推没有丢样。"
      },
      {
        "condition": "非分页池突增而应用占用不解释系统提交",
        "response": "转向内核池与驱动取证，不能把当前进程排行当成原因。"
      },
      {
        "condition": "硬断电后最后日志不可读",
        "response": "使用已关闭分段和保存的会话尾段，明确缺失范围，不补成正常或根因已找到。"
      }
    ],
    "sources": [
      {
        "path": "E:\\PCConfig\\docs\\recovery\\memory-freeze-diagnostics.md",
        "role": "用途、数据类别、原生GUI、停止语义、限额、断电边界和恢复流程"
      },
      {
        "path": "E:\\PCConfig\\tools\\Invoke-MemoryFreezeDiagnostics.ps1",
        "role": "配置、安装回滚、Status和独立启停入口"
      },
      {
        "path": "E:\\PCConfig\\tools\\memory_freeze_maintenance.vbs",
        "role": "一次性事件维护、旧会话尾段保留、限额和最后失败"
      }
    ],
    "verification": [
      "2026-09-14 02:55 UTC只读Status返回installed=true、collector_state=running、automatic_start_enabled=true、last_maintenance_result=0、last_maintenance_error=null。",
      "同次现场回读采样5秒、分段60秒、1024MiB和4320段，与源码定义一致；当前日志路径存在于状态输出，但本轮没有读取计数器数值。",
      "源码与运行状态、关闭段可读、停止不复活、新Start保留尾段、真实开机和硬断电尾部是不同证据。本轮未新验后五项，不把running或任务结果0当成全部通过。"
    ],
    "relation": "机器事实模块拥有稳定硬件与配置投影；本模块拥有内存故障时序、采样生命周期及故障后读回。TimeAudit提供更广历史信号，Windows轨迹分析器处理明确选定的ETL；它们不替代本模块独立的原生BLG记录，也不形成第二个监控项目。",
    readerStatus: "9月14日已确认内存记录程序在运行；故障前的记录可用于追查，但突然断电前最后一段和自然开机接续尚未实测。"
  },
  {
    slug: "runtime-startup",
    usageEntry: "在已接入 PCConfig 的 AI 对话中点名软件、启动项或计划任务及当前电脑。",
    usageInputs: ["软件或任务名称", "开机、登录或手动启动场景", "期望服务实际完成的事"],
    productFlow: [
      {
        "title": "区分启动发生在哪一段",
        "detail": "系统查看问题出在开机服务、登录后任务还是手动打开的程序，不用“任务就绪”概括三种情况。"
      },
      {
        "title": "查配置和真实运行",
        "detail": "AI 分开核对路径、任务身份、最近结果、服务状态及所属项目回执。"
      },
      {
        "title": "修复并验使用",
        "detail": "有权限且目标清楚时由对应安装器修复；最后报告程序是否真实可用，任务显示就绪不足以证明远控或消息链成功。"
      }
    ],
    shortTitle: "运行与启动",
    title: "运行时、受管软件、启动项与计划任务",
    teaser: "理清工具版本、环境和开机任务，并说清台式机未登录时的 ToDesk、登录后的微信双开与 WeFlow 各自怎样检查和恢复。",
    status: "2026-09-09管理员完整现场与正式账本94/94项，任务定义差异0；MCP及维护和两项独立保护已登记。重建计划57项通过，Ollama历史失败与随后同入口成功、当前接口可达分别保留",
    statusTone: "mixed",
    searchProjection: {
      intents: ["检查运行时版本", "排查计划任务", "恢复登录启动链", "主工作站登录前远控", "恢复微信双开和WeFlow第二实例", "安全升级受管软件", "判断离线时哪些能力可用"],
      entities: ["PowerShell 运行时", "受管软件 Adapter", "启动来源面", "Task Scheduler", "业务 Owner 回执", "无窗口 launcher", "ToDesk PreLogin Watchdog", "WeChat AutoStart", "WeFlow Secondary Watchdog", "primary-16000"],
      relations: ["软件状态决定是否更新", "任务定义和业务结果分层", "项目先恢复再注册任务", "启动项依赖当前用户和机器", "ToDesk不依赖交互登录", "微信双开不证明两个账号登录", "WeFlow持久profile不证明命名资料库身份"],
      failureRecovery: ["unknown 不自动安装", "任务 Ready 不冒充业务成功", "任务注册失败恢复 XML preimage", "启动差异只按真实影响处理", "不结束ToDesk验证看门狗", "第二profile缺失不创建空库"]
    },
    value: "软件装上只是第一步；这里还看它能否启动、上次任务有没有完成、断电或重装后按什么顺序接回。远控、微信和消息服务各自报告真实可用性。",
    why: "运行时路径会变，环境变量可能同时出现在两个作用域，登录启动和计划任务又不是一套机制。只看文件存在，会漏掉执行命令错误、运行身份不对、任务被禁用或最近结果非零；只看任务显示 Ready（就绪），也证明不了微信、远控或消息接口真的可用。",
    example: "比如我问“台式机重启后停在登录界面，我还能用 ToDesk 连回来吗？”系统会检查开机即运行的 SYSTEM 服务、独立看门狗和本次启动回执，并且不会为了试错去结束 ToDesk。即使机器侧链路都正常，也只说明本机准备好了；真正的登录前接入仍要在自然重启后由另一台设备实际连一次才能确认。",
    result: "拿到这个程序现在装在哪里、开机或登录后是否会启动、最近一次是否完成，以及真正的远控或消息功能是否可用。读不到现场时写明无法判断，不把“任务就绪”当成已经连上。",
    readerStates: {
      "pass": "启动设置与程序运行一致时，再看这项服务是否真的完成本来要做的事。",
      "problem": "文件还在但任务已停、身份或命令不对，或服务没有完成工作时，分别指出是哪一层。",
      "unavailable": "计划任务或程序状态读不到时说无法判断，不把它写成不存在或成功。"
    },
    decisionImpact: [
      "运行时当前值只信 Get-RuntimeInventory；冻结 Registry 只用于 drift 比较。",
      "受管软件只有 behind 才更新，equal 不重装，ahead 不降级，unknown 和 channel_mismatch 停止。",
      "登录启动快照差异默认 informational（仅供参考），不会自动关闭或修复应用。",
      "Task Scheduler 是任务运行权威，瞬时 Ready/Running 不进入稳定 drift。",
      "无交互任务必须由验证过的父级 hidden launcher 创建无可见控制台的子进程。",
      "ToDesk 的事故是服务重启后从 Auto（自动）退回 Demand（按需），让无人登录的主机失联；开机 SYSTEM 看门狗只恢复已签名的既定服务，返回 healthy/repaired（健康/已修复）元数据，不读取远控账号或密码，也不结束 ToDesk 来做验证。",
      "微信双开在用户登录后触发，只补足两个健康顶层实例；已有两个时不再启动。冲突任务不覆盖、旧快捷方式可回退；两个进程只证明启动成功，扫码和两个账号登录仍需微信自身确认。",
      "WeFlow 第二实例的可用性依赖持久 profile（配置目录），不能放在重启会丢失的缓存盘；看门狗只重连既定实例。目录缺失就停止而不是生成空库，接口能读只证明连续性，按账号名读消息还要单独确认 active-library（当前资料库身份）。",
      "LocalGpuBroker 统一拥有客户端 32100 与内部 Ollama backend（后端）32101；OCR（文字识别）与 ASR（语音识别）可各持一份租约并行，避免语音输入无故等待 OCR。两份同类任务仍互斥，Ollama 会话/请求与任一外部租约也互斥；不是所有 GPU 工作全面放开并行。",
      "TURZX看护曾因RTSS的帧率挂钩进入Windows PowerShell而崩溃。恢复RTSS时只恢复powershell.exe的应用排除，保留其他程序配置；若发送仍中断，继续由TURZX检查发送和自动恢复，不把排除文件存在当作实体小屏已经正常。",
      "任务存在、exit 0 或 receipt 文件存在都不能单独证明业务成功。",
      "计划任务重建清单只是恢复数据。旧 authorization 字段不再签发或阻断授权；每项仍按当前用户目标、依赖和原生入口执行。ChineseASR Dictation 的 Install 会注册并启动托盘，Status 才是只读核对，恢复时不能混用。",
      "电脑日常小故障沿现有精确入口处理：微信只补健康实例，音频只选择已登记目标，卡住的修饰键只释放按键；鼠标主题被系统悄悄重置时自动恢复，守护进程退出后原任务补启；本人改选主题或恢复Windows原生方案时退出。显示拓扑恢复和 Xiaomi Share 看门狗各保留独立开关与回读。主屏 OLED 黑屏工具只是等待稳定版的历史恢复点，来源Owner于9月12日回传本人确认：修复后指针、HS2与白窗相关症状未再出现，机器记录也有KB5124008等更新和后续多次重启；这不是长期不复发保证，不能据旧源码重新安装或覆盖已退役补偿。",
      "音响突然没声时，默认音频入口把Console（系统）、Multimedia（媒体）、Communications（通话）三个角色切到脚本选定的Realtek HD Audio 2nd output，再逐角色回读；设置调用成功但回读不一致仍报postcondition_failed。Ctrl/Alt/Shift/Win像卡住时，按键工具只发送这五类修饰键的松开事件，不重启应用。",
      "主题切换、登录或睡眠回来后鼠标样式丢失，CursorSchemeGuard会核对受管方案再修复；本人改选另一方案时它自动退出，原生路径重新稳定时也会退役补偿入口，不要求人记得长期清理。显示拓扑恢复则只处理已证的单活屏NVIDIA/IDD竞态；它可能重启精确GPU并请各显示Owner恢复窗口，条件不匹配只等待，不能当通用黑屏按钮。",
      "FlyingBird登录前由隐藏S4U任务启动GUI控制进程，Helper服务提供SYSTEM网络Core；用户登录后只交接GUI、保留Core网络，首次交互启动静默到托盘。本人主动关闭后不自动重试拉起，开始菜单仍用厂商原生单实例入口；自然冷启动仍待独立验收。",
      "Xiaomi Share入口在MiService正常时只补一个签名有效的交互界面；服务不运行留给厂商恢复，多个界面或身份不符就停止。可选每次启动只展示一次，并等三屏布局健康后放到主屏；界面活着不证明手机文件已经传完。",
  "本机主Python可在原有每周治理中自动更新同一3.14系列的稳定补丁；正在被应用或MCP使用就等空闲，不终止程序，不跨次版本，也不顺带升级所有pip包。"
    ],
    problem: "版本、路径、权限、环境、启动面和任务结果经常被压成一个“环境是否正常”的问题，导致自动重装、误删启动项或用旧任务结果猜当前状态。PCConfig 必须把每个运行面分开，并只让真实 Owner 解释业务结果。",
    implementation: [
      "一次性等待入口为E:\\PCConfig\\tools\\Invoke-CodexTaskWakeup.ps1 -JobPath <明确job.json>，由codex_task_wakeup.py的Tkinter（Python图形界面）窗口执行；共用层归PCConfig，probe（只读条件检查）及上传、备份等业务仍归所属项目。",
      "窗口可见后才开始监测，显示条件、运行状态、最近/下次检查、目标任务与结果；立即检查只执行一次probe，停止或关闭只停止监测，不停止底层上传、备份或业务。取消不排队，已提交消息不能撤回。",
      "Job JSON绑定job_id/title/condition/thread_id/interval_seconds/deadline_utc/probe_command/message；probe_command使用绝对argv数组，返回waiting/ready/failed/cancelled之一。每次probe和queue均限60秒；waiting继续，ready/failed/超时最多尝试一次官方codex queue。",
      "同名.runtime.json仅存本次状态与投递结果；Windows内核生存期锁只允许一个活动窗口，退出自动释放。已终结、投递失败或回执不明均不自动重试，避免重复通知；业务evidence不复制进共用状态。",
      "官方queue命令只把说明排入原任务，通知声明它不是新用户指令或授权。排队成功、引导接受、模型收到和业务完成分别判断；当前未接通直接引导，用户已取消该接入建设，不把它列为待做功能。",
      "LocalToolbox当前将该入口登记为受管指针，代码仍由PCConfig保存，不另建工具项目、服务、端口或定时任务。恢复按原项目入口和清单备份找回；再次启动先读原运行记录，不自动重投已尝试通知。",
      "运行时 Provider 返回 Windows、PowerShell Core（跨平台 PowerShell）和 Windows PowerShell 的路径、版本、架构与编码事实；路径多候选时使用当前 PSHOME 的唯一 executable（可执行文件）。",
      "managed_software_catalog 当前登记 11 个组件，每个条目只给 status/update Adapter，不允许自由命令字符串或缓存 last_observed。",
      "Invoke-ManagedSoftware 只接受本轮 Adapter 的 JSON；空输出返回 invalid_receipt，不再从已有 ResultPath 文件拾取旧成功回执。ResultPath 只是输出镜像，不能证明本次更新发生。",
      "local_gpu_broker/broker.py 按 localocr/localocr-cli 与 chineseasr/chineseasr-cli 两个闭集分组，跨组可并行、组内互斥；公开 leases 分列租约，旧 lease 在并行时返回 shared（共享忙碌）以兼容旧消费者。Ollama session 或活跃请求仍阻断外部租约，其他外部工作继续要求清理资源。",
      "Windows 入口集中在 PCConfig/tools：Invoke-WeChatDualLaunch.ps1、Set-DefaultAudio.ps1、Release-StuckModifierKeys.ps1、Install-CursorSchemeGuard.ps1、Invoke-DisplayTopologyRecovery.ps1、Invoke-XiaomiShareWatchdog.ps1；Documents/Downloads 与软件清单热备也由各自既有任务调用本目录脚本。恢复先找对应入口和任务，不能重建一个独立脚本项目。",
      "音频脚本对三种Windows音频角色执行后置核验；按键脚本只调用keybd_event KEYUP释放Ctrl、Alt、Shift、左右Win。CursorSchemeGuard监听设置/恢复/会话返回，并每2秒核对静态指针图像以发现无通知重置；每6小时维护、默认168小时探测原生路径。唯一PCConfig Cursor Scheme Guard任务使用Interactive/Limited、登录加1分钟重复触发、IgnoreNew，仅缺进程时补启；用户改选或原生恢复后自行退役。",
      "FlyingBird-PreLogon-Autostart为开机15秒S4U/Limited隐藏任务；FlyingBird-Interactive-Handoff为登录5秒Interactive/Limited隐藏任务。后者只等待仍有线程的Session 0 GUI退出，不停止Core，再启动交互GUI；厂商Run项去重，autoLaunch=false/silentLaunch=true。2026-09-10已有手工预登录、登录交接、原生快捷方式唤醒同PID验收；这不替代自然AtStartup。",
      "Invoke-DisplayTopologyRecovery默认Inspect；Repair才可能处理精确GPU、PHLC34B、MTT1337、TUR0000与联力设备的已证单活屏竞态，并分开报告拓扑、RTSS配置和壁纸FPS回读。Xiaomi入口也默认Inspect，Repair/Install/Uninstall分别拥有具体效果和同名任务所有权检查。这轮仅读取这些已发布源码，没有调用任何修复、安装、声音、按键或显示动作。",
      "RTSS恢复来源是tools/rtss-powershell.cfg：[Hooking]下EnableHooking=0，只对应Profiles/powershell.exe.cfg。安装前保存该单文件前像，安装后核对bytes/hash，并用RTSS接口回读AppDetectionLevel=0；实际挂钩驻留、异常退出与TURZX持续发送仍各自验证。需要重载时只处理既定RTSS入口，不调用整个显示恢复链，也不结束ToDesk。",
      "PrimaryOledBlackout 的 Ctrl+Win+R/开始菜单切换只针对 PHLC34B 实体主屏，本地遮罩与捕获光标副本保留远控；登录 --listen 只监听，--restore/--quit 都会改变现场。9 月 5 日登记明确有输入法及屏保闪烁、等待业务稳定版，本轮不触显示、ToDesk、Sunshine 或全局光标。",
      "更新流程固定为 Resolve → Status → Backup → Preflight → Update → Wait → Verify；目标版本在安装前 pin（精确固定），安装后强制相等。",
      "环境变量索引当前记录 89 个变量元数据和 64 个 PATH（可执行搜索路径）条目，与概览同口径；Probe-EnvVar 只返回存在性、作用域和差异，不返回任何值。",
      "runtimes.json 原观察于 2026-08-30T04:15:42.320175-07:00：PowerShell Core 7.6.4 位于 C:\\Program Files\\PowerShell\\7\\pwsh.exe，Windows PowerShell 5.1.26100.9278 位于 C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe。前者 console/pipeline/default code page 均为 65001；后者 console 为 65001、pipeline 为 20127、.NET default 为 936，Windows ANSI/OEM 为 936。编码差异必须由相应通道处理，不能因为都叫 PowerShell 就假设一致。",
      "启动快照只覆盖当前用户/机器 Run 与用户/公共 Startup 文件夹五个 surface，不复制 Task Scheduler，也不覆盖服务、驱动和 packaged app。",
      "2026-09-08历史Get-StartupInventory live回读23个启动项，其中22 enabled、1 disabled；版本化 startup_snapshot 仍是维护基线，不能覆盖当前现场。",
      "2026-09-01 原快照的 tasks Registry 有 87 项；10 个核心恢复任务当时均为 Ready、最近结果 0，并由 CoreRecovery 3/3 验收分层回读。",
      "正式task-scan已发布94项，generation_id=task-scan-20260909t221121454-e3f172644f2143e0；管理员现场94项、增删改差异0，MCP、两维护和两独立保护及真实Governance触发器已收敛。9阶段57项恢复用途计划已更新并验证current，不能与全部现场任务混算。ChineseASR Dictation仍先恢复环境/麦克风，再由项目Install重建；Status不启动听写。",
      "主工作站 ToDesk 链为官方 ToDesk.exe -autostart on → ToDesk_Service → ToDesk PreLogin Watchdog。任务使用 AtStartup（系统启动）、SYSTEM/ServiceAccount/Highest，每 2 分钟兜底；wscript.exe 以窗口样式 0 拉起 PowerShell，安装根是 C:\\ProgramData\\PCConfig\\ToDeskPreLoginWatchdog。只在 C:\\Program Files\\ToDesk\\ToDesk.exe 路径和官方签名都匹配时修复 Auto、非延迟与 Running；服务自身崩溃优先由 SCM（服务控制管理器）恢复。",
      "WeChat AutoStart 以当前交互用户 / Limited（受限权限）在登录后延迟 30 秒，经 wscript.exe → Invoke-PowerShellHidden.vbs → E:\\PCConfig\\tools\\Invoke-WeChatDualLaunch.ps1；只启动官方 Weixin.exe，忽略子进程与零线程/零句柄幽灵，补到两个顶层实例后连续稳定 15 秒。桌面与开始菜单沿用同一幂等入口。",
      "wechat_dual_autostart.json 的 2026-08-08 升级记录为腾讯签名 WeChat 4.1.12.26，零实例起步到 2 个、已有 2 个时 launched_count=0；同时记录 5031/16000 的 health、sessions、contacts 为 200 且既有数据库密钥指纹未变。这里只复述无秘密连续性结论，不保存指纹值，也不宣称今日重测或以后所有版本兼容。",
      "WeFlow Secondary Watchdog 在登录后延迟 60 秒、每 15 分钟检查第二实例；端口 16000 固定绑定 C:\\Users\\10979\\AppData\\Local\\WeFlowProfiles\\primary-16000，与默认 5031 分开。heartbeat 只对该实例使用 -NoProxyServer/-HiddenLaunch，不依赖固定代理端口、不改变系统代理；显式目录不存在即返回失败，不让 Electron 新建空 profile。",
      "WeFlow 登记证据来自 2026-08-06 的 current-session（当次会话）观察：持久目录进程绑定、16000 health/sessions/contacts、任务受控重启与 LastTaskResult=0 已记录；WeFlow 26.7.3 没有外部 metadata-only（仅元数据）当前账号接口，所以人类可读账号标签仍未知。旧 Z 缓存路径已不再是活动绑定，也不是灾难恢复副本。",
      "OllamaStable32100 与 SelfHeal 任务负责 Broker/内部 backend 的登录启动和幂等恢复；启动前先验当前宿主内存、NVIDIA GPU/显存、命令和模型路径，失败时不创建日志目录或进程。",
      "governance check 只调用登记的 zero-write Provider 和稳定 publisher；同一非 current fingerprint 只有首次或变化时产生 attention。",
      "现有Show-StreamingMaintenance窗口联合查看Sunshine与RamdiskGuardian的健康、新鲜度、最近/下次检查及活动消费者/冷却；控制原有循环或未来触发，不新增后台服务。打开不改电源、网络、显示或驱动，关闭窗口不停止已登记任务。",
  "主Python由registries/host_python.json登记，python/python3/py是Invoke-ManagedSoftware的同一目标别名，不改系统PATH。仅python获无人值守更新例外且automatic_patch_updates=true时生效；原PCConfig Governance Check独立执行Invoke-HostPythonGovernance.ps1。升级前核对进程使用并保留解释器副本，固定版本交WinGet，完成后检查版本、标准库和第三方包指纹；失败或中断留下python-update-hold.json，停止后续自动重试，不声称已自动回滚。不改Codex自带运行时或重建项目venv，但依赖主解释器的venv下次启动会消费兼容补丁。"
    ],
    flow: [
      "用别名或任务名定位受管条目和业务 Owner",
      "读取 live runtime、startup 或 Scheduler 现场",
      "把配置签名、瞬时状态、LastTaskResult 和 Owner receipt 分开",
      "需要更新时先固定 current/target/relation 和回滚材料",
      "GPU 请求先取得 Broker lease（租约）并通过当前宿主能力门；OCR 与 ASR 可跨家族并行，同家族和 Ollama 仍互斥；结束或失败后各自释放，不影响另一份合法租约",
      "需要注册任务时保存 exact XML preimage 或 absent",
      "重装主工作站时先恢复 PCConfig、PowerShell 和厂商签名 ToDesk，再按专属安装器重建并只读 Verify；不能把副驾驶笔记本的远控账本当成这条 SYSTEM 登录前链的证据",
      "恢复微信官方客户端和 PCConfig 的 Invoke-WeChatDualLaunch.ps1 后，按双开安装器回读任务与快捷方式；账号由用户重新确认。恢复 WeFlowBridge 与原持久 profile 后，再验证 16000 绑定、health/sessions/contacts 和资料库身份",
      "执行后回读路径、版本、Principal、trigger、Settings 和业务 receipt",
      "将确定故障、提醒和 unknown 分别收口"
    ],
    concepts: [
      { term: "Runtime（运行时）", explanation: "真正执行脚本或程序的本机环境，包括 executable 路径、版本、架构和编码通道。" },
      { term: "Relation（版本关系）", explanation: "installed 与 target 的 behind、equal、ahead、unknown 或 channel_mismatch；它直接决定是否允许更新。" },
      { term: "Startup surface（启动来源面）", explanation: "Run 注册表或 Startup 文件夹中的一个独立来源；跨来源同名项不会被错误去重。" },
      { term: "Task signature（任务稳定签名）", explanation: "恢复所需的 enabled、Action、trigger、重试和执行限制等配置，不包含 Ready/Running 瞬时状态。" },
      { term: "LastTaskResult（最近运行结果）", explanation: "Scheduler 的最近返回码；信息码与真实失败要分类，非零也要结合业务 Owner 回读。" },
      { term: "Hidden launcher（无窗口父启动器）", explanation: "从最外层就不创建可见控制台的启动链；Task Scheduler 的 Hidden 复选框不能单独证明这一点。" },
      { term: "LocalGpuBroker（本地 GPU 调度代理）", explanation: "统一仲裁 Ollama、OCR、ASR 与模型资源；只允许一份 OCR 和一份 ASR 并行，同类任务及 Ollama/外部任务保持互斥。" }
    ],
    boundaries: [
      "环境变量、PATH、任务 Action、参数、XML 和日志按实际值判断：普通名称、路径、结构、状态和失败事实可以公开；只省略其中确含 L3+ 私人正文或可复用凭据的具体值",
      "不自动建立无人值守软件更新任务",
      "不因为 startup 新增、删除或启停变化就生成故障或待办",
      "不从 provider 名称猜管理员需求；安装范围由本次 status Adapter 回读",
      "不重装 equal 但 degraded 的组件，只报告健康缺口",
      "不在宿主能力门失败时启动 Broker、Ollama 或重型项目，也不把临时宿主观察写回主工作站基线",
      "不结束 ToDesk 做看门狗验收，不读取或展示远控密码，不以用户登录后手工触发替代登录前异机接入",
      "微信双开不注入、不修改客户端、不坐标点击；双实例、接口健康、命名账号身份与自然重启四种证据分别保留",
      "WeFlow profile 恢复由账号与内容 Owner 负责；PCConfig 只管理任务和路径，不把持久目录或旧缓存当作已验证加密备份",
      "具体任务为何成功仍由所属项目定义"
    ],
    failures: [
      { condition: "完整权限现场与 Registry 不同", response: "保留精确差异并标明观察时间；不把历史 task-scan 冒充当前闭合，也不把 runtime health PASS 反推成定义一致。" },
      { condition: "2026-08-28 的历史 LastTaskResult=4", response: "保留为带日期的旧回执；2026-09-03的rev68自然启动记录在61718 ms内返回deadline_met=true，不再把历史失败算进当前健康。" },
      { condition: "启动快照比现场少 3 项", response: "当前归类为 informational_only；无需自动刷新、关闭应用或要求用户确认，下次真实维护可吸收为新基线。" },
      { condition: "环境变量 registry/process 读取失败", response: "对应项 exists=null、diff_status=unknown；不把读取失败写成 absent。" },
      { condition: "组件 status 为 unknown 或通道不匹配", response: "不备份、不安装、不降级，返回稳定错误码和 Owner 入口。" },
      { condition: "LocalGpuBroker backend 已活动或 lease 被占用", response: "组件更新和新的重型任务等待或停止，不终止现有 Owner；读取 Broker 状态后从原 lease 恢复，不另开直接 backend。" },
      { condition: "任务注册 read-back 不一致", response: "自动恢复 exact XML preimage 并再次核对；回滚失败单独 fail closed。" },
      { condition: "ToDesk SYSTEM 任务普通权限不可见", response: "返回 task_read_permission_required、task.exists=null；只读升级到完整权限核验，不据此重装、删任务或停止服务。同次启动的任务结果和新鲜回执缺一不可。" },
      { condition: "ToDesk 服务路径或签名不匹配", response: "看门狗停止修复并返回精确异常，不接管未知程序；保留现有远控和账号配置。" },
      { condition: "微信只剩一个健康实例或存在幽灵进程", response: "启动器仅补足缺口，等待稳定后才报成功；零线程/零句柄进程不计数，扫码或登录失败交回微信，不反复启动凑数量。" },
      { condition: "WeFlow 持久目录缺失、接口不可读或命名账号未知", response: "缺目录时不启动空库；接口异常与资料库身份未知分别报告。只恢复经 Owner 确认的原 profile，不能从端口或 profile 文件名猜账号。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\runtimes.json", role: "冻结运行时投影" },
      { path: "E:\\PCConfig\\docs\\runtime\\codex-task-wakeup.md", role: "可见一次性等待、停止、通知与恢复语义" },
      { path: "E:\\PCConfig\\tools\\codex_task_wakeup.py", role: "窗口、只读probe、单实例状态、一次官方queue投递" },
      { path: "E:\\PCConfig\\registries\\managed_software_catalog.json", role: "11 个受管组件与 Adapter 路由" },
      { path: "E:\\PCConfig\\registries\\env_var_index.json", role: "变量名称、作用域和 PATH 顺序元数据" },
      { path: "E:\\PCConfig\\registries\\startup_snapshot.json", role: "五个登录启动来源面的维护快照" },
      { path: "E:\\PCConfig\\registries\\tasks.json", role: "计划任务稳定恢复投影" },
      { path: "E:\\PCConfig\\registries\\task_purpose_catalog.json", role: "任务用途、Owner 和验证入口" },
      { path: "E:\\PCConfig\\registries\\scheduled_task_rebuild_plan.json", role: "分阶段任务重建计划" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.managed-software-routing.md", role: "受控更新状态机" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.scheduled-tasks.md", role: "Scheduler 权威、无窗口和事务回滚合同" },
      { path: "E:\\PCConfig\\docs\\recovery\\todesk_prelogin_watchdog.md", role: "主工作站登录前远控、SYSTEM 看门狗、恢复入口与自然重启验收边界" },
      { path: "E:\\PCConfig\\tools\\Install-ToDeskPreLoginWatchdog.ps1", role: "ToDesk Install/Verify/Remove（安装/只读验证/移除）、固定安装根和精确回滚" },
      { path: "E:\\PCConfig\\registries\\wechat_dual_autostart.json", role: "官方客户端、双开启动器、快捷方式、升级与未重启证据" },
      { path: "E:\\PCConfig\\docs\\recovery\\wechat_dual_autostart.md", role: "登录延迟、健康实例计数、账号边界和旧快捷方式恢复" },
      { path: "E:\\PCConfig\\tools\\Install-WeChatDualAutostart.ps1", role: "微信双开专属安装/验证/移除入口" },
      { path: "E:\\PCConfig\\registries\\weflow_secondary_watchdog.json", role: "16000 持久配置、任务、当次会话连续性与账号未知" },
      { path: "E:\\PCConfig\\docs\\recovery\\weflow_secondary_watchdog.md", role: "profile 缺失拒绝、静默启动、接口验证与灾备区别" },
      { path: "E:\\PCConfig\\tools\\Install-WeFlowSecondaryWatchdog.ps1", role: "第二实例专属安装/只读验证/移除入口" },
      { path: "E:\\PCConfig\\tools\\local_gpu_broker\\broker.py", role: "32100/32101 入口、OCR/ASR 跨组并行与同组/Ollama 互斥" },
      { path: "E:\\PCConfig\\tools\\local_gpu_broker\\Test-HeavyRuntimeHostCapability.ps1", role: "重型运行前的当前宿主能力门" },
  {
    "path": "E:\\PCConfig\\docs\\contracts\\pcconfig.managed-software-routing.md",
    "role": "主Python同系列稳定补丁、空闲窗口、失败暂停和原任务管理边界"
  }
    ],
    verification: [
      "2026-09-14只读核对任务等待源码、说明及LocalToolbox入口；清单记有可见窗口、停止和官方排队实测，本网页未重新启动检查器或发送消息。投递回执不能证明模型接收；直接引导未实现。",
      "2026-09-01 Get-StartupInventory.ps1 -Json 同次回读 21 个启动项：20 enabled、1 disabled；当时配置 Registry 登记 87 个任务，不能与 2026-09-02 后续 89 项来源投影混成同一观察。",
      "2026-09-01 原快照：10 个核心恢复任务当时均为 Ready、最近结果 0；CoreRecovery 3/3 验收通过。最新备份范围与任务计数见换机与恢复模块，不把旧观察当今日状态。",
      "本轮读到的P0记录仍绑定2026-09-03：rev68为normal、active=LKG、trusted=true、recovery_status=null；该次自然启动61718 ms、deadline_met=true",
      "2026-09-08T08:12:34Z的Get-StartupInventory.ps1 -Json覆盖23个启动项",
      "Invoke-StartupSnapshotMaintenance.ps1 -Action Inspect -Json 当前返回 changes_observed，但 action_required=false、confirmation_required=false",
      "本次完整性补写只读取 ToDesk/微信/WeFlow 的当前合同、登记与安装器源码，没有触发安装、重启、任务运行或真实登录；ToDesk 的登录前异机接入、微信 AtLogOn 和 WeFlow 自然重启不新增 E2E（端到端）通过声明。",
      "微信 2026-08-08 的双实例与两路 API 升级证据、WeFlow 2026-08-06 的持久 profile 与当前会话证据按原时间保留；自然重启字段仍为未验收，不能用旧会话结果补齐。",
      "2026-08-31 Test-LocalGpuBroker.ps1 返回 ok=true、lease=null、active_ollama_requests=0、ollama_version=0.33.1；这是当前 Broker 状态，不证明每个重型项目已运行",
      "validate_managed_software_catalog.mjs、validate_env_var_index.mjs 与对应回归覆盖 catalog、环境元数据和闭合状态机",
  "2026-09-19T15:05:13Z正式只读Status返回主Python3.14.7、目标3.14.7、stable/equal、healthy、automatic_patch_updates=true；14:33Z原维护结果current，update_attempted=false。本网页未运行更新、安装或升级第三方包；需要空闲的更新分支没有在此轮重放。"
    ],
    relation: "机器事实模块告诉它们在哪里；本模块证明怎样启动和运行；恢复模块在系统重建后按顺序重新接上这些运行链；漂移结果又成为整体验收的输入。",
    readerStatus: "已核对的计划任务与登记一致，软件启动和上次执行分别有记录；任务存在不代表远控、微信或模型任务已经成功。"
  },
  {
    slug: "drift-acceptance",
    usageEntry: "在已接入 PCConfig 的 AI 对话中说“只检查”并点名机器事实区域；需修复时另说明具体目标。",
    usageInputs: ["检查区域，例如任务、运行时或恢复", "当前机器", "是否只读"],
    productFlow: [
      { title: "选最小检查", detail: "AI 先确定本次决定依赖哪类机器事实，不为一个小问题全机扫描。" },
      { title: "分开状态与证据", detail: "读取登记、现场可见范围及检查结果，明确差异、证据不足和未检查。" },
      { title: "交回下一步", detail: "具体差异交相应负责人修；看不全时提供重查入口，不把未知写成故障或通过。" },
    ],
    shortTitle: "漂移与验收",
    title: "机器事实漂移、证据状态与分区验收",
    teaser: "回答“账本和电脑现场到底对不对得上、证据够不够、真有问题该找谁修”，并支持只查眼前关心的一项。",
    status: "2026-09-09 22:12 UTC管理员完整现场7pass、0warn、1block；94任务对94账本、定义差异0，运行时/重建计划/核心恢复通过；仅Ollama历史失败保留，同入口随后结果0且当前接口可达",
    statusTone: "mixed",
    searchProjection: {
      intents: ["检查 PCConfig 当前是否健康", "比较登记与现场", "只验一个恢复区域", "区分故障和证据不足", "定位计划任务差异", "判断是否需要修复"],
      entities: ["pcconfig.drift.v2", "status", "evidence_status", "稳定 check ID", "acceptance area", "tasks.live_match", "bounded evidence"],
      relations: ["策略处置和执行证据双轴", "Registry 与 live Provider 比较", "验收 area 关联 Owner check", "任务定义漂移与运行健康分离", "unknown 不能折算为 pass"],
      failureRecovery: ["部分可见保持 unknown", "selector 不存在时零检查启动", "Provider 超时保留阻断原因", "真实不匹配交回事实 Owner", "旧报告不补齐当前证据"]
    },
    value: "想知道“PCConfig 到底健不健康”“为什么任务数对不上”或“只检查核心恢复”时，系统会把明确不一致、暂时看不全和仅需提醒分开，给出稳定的检查名、第一手证据与真正负责的模块，而不是只亮一个总绿灯，或把一大串日志甩给人自己猜。",
    why: "登记可能陈旧，现场读取也可能因为权限、设备离线或 Provider（现场读取器）失败而不完整。把“看不全”都写成故障会诱发误修，把未知写成通过又会埋雷；每次把所有验收从头跑到底，也会浪费时间并触发无关依赖。这里把处置级别和证据结论拆开，还允许精确点名检查区域。",
    example: "比如账本记着 87 个计划任务，而当前普通用户视角只看到 84 个。系统不会马上喊“丢了 3 个任务”，而是告诉我这次视野不完整、任务定义差异仍待确认，同时把已经看见的任务运行结果单独检查。只有取得完整的只读现场后，才会把定义差异判成一致或不一致。",
    result: "得到一张可行动的检查单：哪些和登记一致、哪些确实不符、哪些因为权限或设备不在线还看不全，以及应由哪个项目修。这个检查本身不擅自改配置。",
    readerStates: {
      "pass": "只对这次点名并完整检查的机器部分说已证一致，附上实际看到的范围。",
      "problem": "看见具体差异时指出影响和处理入口，修好后再查同一项。",
      "unavailable": "权限不足、设备离线或读取超时时标成无法确认，不算通过，也不拿空结果说设备不存在。"
    },
    decisionImpact: [
      "status=pass|warn|block 表示当前处置级别，evidence_status=pass|fail|unknown 表示证据结论；两条轴必须同时读。",
      "真实不匹配是 fail；完整性不足是 unknown；已证明但只需提醒的陈旧证据可以是 warn/fail，不能靠一个颜色覆盖语义。",
      "任务定义 tasks.live_match 与任务运行结果 tasks.runtime_health 独立；定义可见性不足不等于任务业务失败，LastTaskResult 信息码也不自动算失败。",
      "Test-PCConfigDrift -NoWrite 与 Get-DevStorageHealth 是 zero-write（零写入）；acceptance 的 NoWrite 不改 PCConfig 报告/Registry，但被选 Owner check 可能创建并删除有界临时产物。",
      "acceptance selector 采用 area 与 check ID 的精确交集；任一不存在或交集为空时，在启动任何检查前返回 selection error。",
      "只运行会改变本次决定的 area/check；未选项不进入 selected_items 或 results，也不能被写成通过。",
      "任务差异只返回有界 task key、计数和 changed_fields 字段名，不返回完整 Action、参数、trigger 或旧/新值。",
      "验收结论只证明机器事实证据，不反向拥有 Git admission、Skill 供应、项目业务状态或公开发布。"
    ],
    problem: "旧式健康检查容易把命令 exit 0 当全局 PASS、把权限不足当对象不存在、把任务定义和业务结果混在一起，或者为了“完整”每次运行全套脚本。这样既会误修，又无法从结果恢复。漂移与验收层必须保留稳定 ID、双状态、精确选择、超时和有界证据，才能在现场变化时仍给出同一种可理解答案。",
    implementation: [
      "Test-PCConfigDrift.ps1 -NoWrite 输出 pcconfig.drift.v2：每个 check 有稳定 id、domain、status、evidence_status、message 与有界 evidence，summary 分别汇总策略计数和证据计数。",
      "当前检查集包括 registry.schema、tasks.live_match、tasks.runtime_health、tasks.path_integrity、runtimes.live_match、drives.dev_storage 与 recovery.core_contract；新增检查必须保留 owner、状态域和输出边界。",
      "tasks.live_match 在完整可见时比较 registry_count、observed_count、added/removed/changed；最多返回 20 条清理后的 task key 和 changed_fields 名称，超出以 *_truncated 标记。",
      "tasks.runtime_health 只评估 managed-core 的 LastTaskResult 与可选结构化 Owner receipt；Scheduler 状态码、真实失败、历史已恢复结果和外部 Owner unknown 分开计数。",
      "runtimes.live_match 调当前运行时 Provider；drives.dev_storage 调 V/Z 健康 Provider；recovery.core_contract 同时核对 manifest、任务 Inspect 与维护 Inspect，不用一个文件代替整条合同。",
      "acceptance_checklist.json 登记 area、check ID、blocking、命令、超时、隐私边界、trigger 和 acceptance；Invoke-PCConfigAcceptance 只执行 selector 交集并返回 selected_items。",
      "selector 支持数组或逗号分隔、大小写不敏感但必须精确匹配；未知 area/check、空交集或 checklist schema 错误都 selection.status=error、exit 1、零检查启动。",
      "每个 owner check 的 stdout、stderr、超时和 exit code 被转换为 pass/fail/unknown 与简短 output_excerpt；原始大日志、秘密和完整任务定义不进入公共结果。",
      "按需排障先消费结构化摘要；只有一个 check fail/unknown 时才读取它指向的 owner 证据，避免加载整份历史报告或无关机器状态。",
      "验收器不自动修复：Registry 漂移交 Registry Owner，任务交任务/项目 Owner，运行时交 PCConfig/组件 Adapter，恢复数据与秘密继续走各自专用入口。"
    ],
    flow: [
      "先写清当前决定依赖哪类机器事实：任务、运行时、开发盘、恢复、秘密入口或完整收尾。",
      "选择最小入口：快速 drift 摘要、单个 live Provider，或 acceptance 的精确 area/check；不为普通项目收尾机械全跑。",
      "读取 execution_status 与 selection；selector 错误时确认零检查已启动，再修正名称而不是解释空结果。",
      "逐项同时读 status 和 evidence_status：pass/pass 是已证，warn/fail 是已证但只需关注，warn/unknown 是证据不足，block/unknown 是关键证据无法成立。",
      "核对 evidence 的观察范围、complete_visibility、计数、截断和时间；不拿旧 Registry 或旧报告补现场缺口。",
      "把 tasks.live_match、runtime_health、path_integrity 等相邻但不同结论分开，不用一个通过项覆盖另一个未知。",
      "明确差异时转给对应 Owner，带上稳定 check ID、最小 evidence 和重新验证入口；验收器不直接修改真实配置。",
      "修复后重新运行同一精确 check/area；只有当前证据转为 pass 才收口，未选择或无法运行的项继续保持未知。"
    ],
    concepts: [
      { term: "Drift（漂移）", explanation: "登记、合同或稳定投影与当前现场不一致；它可能是需修故障，也可能只是快照尚未刷新。" },
      { term: "Status（处置状态）", explanation: "pass、warn、block 表示当前应继续、关注或停止的策略结论，不等于证据真假本身。" },
      { term: "Evidence status（证据状态）", explanation: "pass、fail、unknown 表示当前证明满足、证明不满足或无法证明；unknown 永远不是 pass。" },
      { term: "Stable check ID（稳定检查标识）", explanation: "跨版本保持含义的检查名，用于定向选择、Owner 交接和修复后重验。" },
      { term: "Area selector（区域选择器）", explanation: "只运行某一产品区域的检查；与 check ID 同时给出时取精确交集。" },
      { term: "Complete visibility（完整可见性）", explanation: "当前身份能看到足够完整的系统对象；普通用户的部分任务列表不能证明定义一致或缺失。" },
      { term: "Bounded evidence（有界证据）", explanation: "只返回会改变判断的计数、稳定字段和有限差异，避免泄露完整参数或淹没注意力。" },
      { term: "NoWrite（不改权威状态）", explanation: "不改 PCConfig Registry/报告；acceptance 中的 Owner check 仍可能按合同创建并删除有界临时验证产物。" }
    ],
    boundaries: [
      "不把 schema 正确、命令 exit 0、文件存在或一个 check PASS 推成全机健康",
      "不把权限不足、Provider 超时、设备离线或上游未执行写成 absent 或 fail",
      "不把 unknown 折算为 pass，也不因 status=warn 就隐去 evidence_status=fail/unknown",
      "不把任务定义漂移、任务运行结果、业务 Owner 回执和历史结果混成一个状态",
      "不在 selector 无效时启动任何检查，不把未选择项放进结果或总数",
      "不输出完整任务 XML、Action、路径参数、旧/新敏感值、原始日志或秘密",
      "不让验收器自动修改 Registry、注册任务、迁移路径、恢复秘密、推送 Git 或执行外部写入",
      "不周期性全扫；只有机器事实或恢复状态会改变当前决定时才触发对应检查"
    ],
    failures: [
      { condition: "tasks.live_match complete_visibility=false", response: "保持 warn/unknown，显示 registry/observed 计数和有界候选；只有提升后的完整只读扫描能判定真实漂移。" },
      { condition: "Provider、Registry 或 owner validator 超时/失败", response: "对应 check 保持 unknown 并列出依赖与重试入口；其他已完成检查仍保留自身结论。" },
      { condition: "Registry 与完整现场明确不同", response: "标记 fail，并按风险选择 warn/block；修复真实来源或刷新 owning snapshot 后重跑同一 check。" },
      { condition: "任务非零结果是 Scheduler 状态码", response: "按分类保留为运行状态，不自动算业务失败；有 Owner receipt 时再判断业务结论。" },
      { condition: "area/check selector 拼错或交集为空", response: "selection error、exit 1、selected_items=[]，不执行 fallback 全套验收。" },
      { condition: "检查输出超过边界或含不允许字段", response: "截断或拒绝该证据并保持 unknown；不能为了给结论公开完整任务参数或日志。" },
      { condition: "修复后只看到旧报告变绿", response: "重新调用当前 Provider/同一 check；旧报告只能解释历史，不能关闭当前漂移。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.drift-acceptance.md", role: "双状态、稳定 ID、选择器、有界证据与 Owner 边界合同" },
      { path: "E:\\PCConfig\\tools\\Test-PCConfigDrift.ps1", role: "机器事实与恢复合同的现场只读 drift 汇总" },
      { path: "E:\\PCConfig\\registries\\acceptance_checklist.json", role: "area、check、blocking、超时、隐私与验收登记" },
      { path: "E:\\PCConfig\\tools\\Invoke-PCConfigAcceptance.ps1", role: "精确 selector、超时和有界结果的 acceptance runner" },
      { path: "E:\\PCConfig\\tools\\Get-DevStorageHealth.ps1", role: "V/Z 开发存储 zero-write Provider" },
      { path: "E:\\PCConfig\\tools\\Get-RuntimeInventory.ps1", role: "当前运行时事实 Provider" },
      { path: "E:\\PCConfig\\tools\\invoke_acceptance_checks.test.ps1", role: "selector、超时、unknown、未启动项和输出边界回归" },
      { path: "E:\\PCConfig\\tools\\test_pcconfig_drift.test.ps1", role: "drift 双状态、任务差异、历史结果和零写入回归" }
    ],
    verification: [
      "2026-08-31T17:49:27Z Test-PCConfigDrift.ps1 -NoWrite -Json 返回 schema=pcconfig.drift.v2、execution_status=completed、summary=6 pass/1 warn/0 block，证据为 6 pass/0 fail/1 unknown",
      "同次唯一 attention 是 tasks.live_match=warn/unknown：registry_count=87、observed_count=84、complete_visibility=false；它是部分可见性，不是已证明任务丢失",
      "同次 tasks.runtime_health、tasks.path_integrity、runtimes.live_match、drives.dev_storage 与 recovery.core_contract 均 pass/pass；两条 Scheduler 状态码未被误分类成失败",
      "drives.dev_storage 回读 5 pass、0 warn、0 block；CoreRecovery 维护状态 ready、warnings=0、当时Cold=additive_no_mirror、Git/云payload写入禁止；这是旧观察，当前Cold已按登记有效保留集验真后清理H旧副本",
      "先前精确 core_recovery area 验收返回 manifest_contract、maintenance_inspect、task_contract 三项 PASS；只证明该 area，不代表未选择区域",
      "invoke_acceptance_checks.test.ps1 与 test_pcconfig_drift.test.ps1 分别覆盖 selector 零启动、超时/unknown、有界输出和 drift 双状态；测试证据不替代当前 live Provider"
    ],
    relation: "机器事实、运行时、恢复、副驾驶、秘密和受保护数据模块各自产生 Owner 证据；本模块只负责把这些证据按稳定 ID、双状态和精确选择组合成可行动结论。它不接管修复，也不把项目/Git/Skill 的上游验收吞进 PCConfig。",
    readerStatus: "已有检查机器配置差异的入口。旧模型任务失败、后来同入口成功和当前能连接分别保留，不合成一个全机健康结论。"
  },
  {
    slug: "recovery-backup",
    usageEntry: "在已接入 PCConfig 的 AI 对话中说明是同机重装、换机还是故障恢复，先要求恢复清单；实际磁盘操作另按现场核对。",
    usageInputs: ["旧机与新机状况", "可用备份盘、启动介质和账号", "希望保留的项目与数据"],
    productFlow: [
      {
        "title": "先识别还能用的设备和副本",
        "detail": "系统只读核对实际物理盘、能打开的备份和登录条件，旧盘符与文件夹名字不能当作恢复成功。"
      },
      {
        "title": "列出恢复顺序",
        "detail": "把系统安装、驱动、已保存代码、未提交文件、个人设置和登录方式分开，说明每一步缺什么。"
      },
      {
        "title": "按层恢复并实测",
        "detail": "实际执行需确认目标和回退；交回应用能否启动、旧数据是否可用及最后备份后的缺口，不能凭 ISO 或目录存在宣称完成。"
      }
    ],
    shortTitle: "换机与恢复",
    title: "换机、重装、备份与恢复",
    teaser: "从主板设置、启动介质和认盘开始，一步步接回项目、账号、开机任务与应用数据；备份只是原料，电脑真正能用才算验收。",
    status: "16组H冷备与四处最新ZIP完成；隔离恢复通过，整机新装未验",
    statusTone: "mixed",
    searchAliases: [
      "BIOS", "UEFI", "主板设置", "换机 BIOS", "重装 BIOS", "启动U盘", "WEPE", "WinPE", "Q-Flash Plus", "Windows ISO",
      "驱动导出", "重装后恢复驱动", "C盘用户配置", "换机后恢复项目", "重新登录", "自然启动验收", "present_verified", "G到H备份",
      "BIOS和换机重装有什么关系", "换主板或重装前 BIOS 要留什么", "重装 Windows 后怎么把电脑恢复回来"
    ],
    searchProjection: {
      intents: ["重装 Windows 后恢复电脑", "换机后恢复项目和配置", "系统盘故障只读救援", "从 PE 开始恢复", "重建 Hot 和 Cold 备份"],
      entities: ["BIOS/UEFI", "WEPE/WinPE", "F 启动 U 盘", "G Hot", "H Cold", "项目与用户配置", "计划任务与启动项", "H 内硬链接"],
      relations: ["恢复来源决定可恢复范围", "盘符按现场重新识别", "项目和运行时先于任务", "应用可见性晚于文件复制", "普通恢复不替代 P0–P7"],
      failureRecovery: ["识盘前不 clean 或 format", "驱动不兼容改用官方来源", "H 未返回", "源变化保留旧 H", "应用看不到数据保持未完成", "恢复后重新建立备份"]
    },
    value: "先告诉我哪份文件和配置备份完整，再区分是否需要恢复Windows。现有G/H资料路线已能验真；新的Veeam系统镜像只到引擎安装，不能假装已有可恢复镜像。Windows起来后，独立AI引导入口帮助按实际盘符接续，不要求旧开发环境先完好。 无论同机重装、换机、系统盘故障还是只有 PE，先认清机器和磁盘，不格式化唯一副本；实际恢复还要检查自然启动及应用内数据是否可见。",
    why: "有系统安装盘、能进入恢复界面，或看到备份目录，都不等于旧电脑能原样回来。磁盘、驱动、个人文件、登录和应用状态要按顺序确认；慌乱中直接清盘反而可能毁掉唯一材料。",
    example: "“系统盘可能要换。先列出哪份资料已经保住，系统镜像有没有真正生成，以及Windows装好后怎么重新进入AI。”得到分层清单：可用文件副本、镜像与介质的未完成项、独立引导包和需要重新登录或验证的步骤；本次不格式化或运行还原。",
    result: "知道能恢复到哪一步、该用哪份包、还缺什么。文件恢复、系统镜像、AI入口和应用实际可用各给结论，未完成项不会被旧备份成功盖住。",
    readerStates: {
      "pass": "先认准物理磁盘和备份，再逐层安装、回填、登录；最终用正常启动和应用里真实可见的旧数据确认。",
      "problem": "某一层失败就停在那一层，保留旧盘与已验证副本，不靠后续步骤掩盖缺口。",
      "unavailable": "只有启动 U 盘，或备份盘未接上、未解锁、账号不可用时，先做安全的只读识别，不格式化或猜盘符。"
    },
    decisionImpact: [
      "同机重装：若主板与 BIOS 没有重置或升级，不为重装 Windows 额外刷写 BIOS；先保护现有数据盘，再按旧机器基线重认盘符和配置。",
      "换机或换主板：旧板的超频、固件包和驱动不能直接套到新板；BIOS 文字记录只帮助理解旧机器，目标机必须按自己的型号、PCB revision 和兼容清单重建。",
      "系统盘故障：先只读确认物理盘、分区、BitLocker 和可用副本；不要因 Windows 起不来就先 clean、format、改分区或修 BCD。",
      "只有 PE：F 只提供 UEFI/WEPE 启动与救急导航，不是完整数据包；先验证内部盘和网络，能进 PE 不能升级成“可恢复”。",
      "GitHub 与官方网络只能重建已发布源码、软件和非秘密默认环境；未推送改动、私人文件、聊天、密码和原样登录态必须来自其他已核验来源。",
      "G是在线Hot（热备）来源，H是人工解锁窗口中的Cold（冷备）来源。15组包括PersonalData、PersonalMedia、RecoveryKit和LocalToolbox；只消费G中有效备份。2026-09-14 00:11:27 UTC H回执complete、15组无warning；稍后本机尝试因H不可用跳过，不把最后尝试覆盖成最后成功。本网页未复制原件。",
      "重装后要恢复已选桌面和锁屏图片，可从Emerald Veil现有项目入口重新应用并验证；它随项目位置解析图片，换机无需沿用旧盘符。Wallpaper Engine与原有泡泡配置保持各自职责，原电脑的变更前备份只用于本机回滚；图片设置通过仍不等于新机锁屏实看已经验收。",
      "普通资料和媒体可从已核验的原生 G/H 副本选择性恢复，不要求先加密成 Carrier（恢复载体）。真正的 Password Center/SecretBroker（秘密代理）恢复集与 P0–P7 载荷仍走各自正式入口，需要对应完整恢复集与有效因子；普通复制、程序安装或只有因子不能替代这条凭据恢复链。",
      "同一文件在 G 有多个硬链接入口时，H 只独立复制一份字节，再在 H 内共享；G/H 仍各有自己的数据，不是跨盘链接。Cold按已登记G有效集合先复制验真、再删除H中已退出的旧副本，不盲镜像整盘，至少留100GiB；暂存复制前后核对源文件，正式替换 H 目标前若检测到来源变化，就保留旧目标、记录 warning（警告）并待来源稳定后重跑。",
      "G 的个人副本会随 E 当前内容同步覆盖、重命名和删除；H现按G有效保留集清理退出路径；普通同名更新不提供上一版历史。Codex会话与核心恢复上下文各保留当前和上一份，密码恢复集跟随所属入口的14天有效集，不能泛化成删除所有历史。个人资料和媒体必须有 36 小时内的完整五映射回执，Hot 闭合上下文须在 48 小时内；目录存在或任务退出码为 0 不能代替这些证据。重复 Packages（恢复包目录）已从日常来源排除，专用手机包、云候选和精选分类保持原分工。",
      "实际完成必须经过自然启动、应用打开、账号与数据可见、必要业务动作，以及恢复后重新建立备份；复制、hash 或任务 Ready 都只是中间证据。"
    ],
    problem: "过去的恢复说明更像一组名词和入口：知道有 CoreRecovery、BIOS、项目路径和任务计划，却无法从“我现在是同机重装还是换机”一路走到“应用真的能用”。完整恢复必须把场景分流、来源选择、破坏性动作禁区、依赖顺序、证据等级和用户可见验收串成一条连续旅程。",
    implementation: [
  "现行入口按四种事故分流：同机重装保留硬件/数据盘并重建 Windows；换机重新建立硬件、盘符和驱动映射；系统盘故障优先保护可读介质；仅 PE 先把机器恢复到可登录、联网并能由 AI 接管。",
  "恢复来源分工固定：F 是启动/救急 U 盘；G 是在线 Hot；H 是人工 Cold；Git 只重建正常仓库与公开安全元数据；P0–P7 处理需要 Carrier 与有效因子的受保护数据。介质存在不等于内容完整。",
  "Recovery kit（恢复材料包）当前登记 16 项资产，校验器为 0 error、0 warning。UEFI 启动 F 可进入 PE 是 user_confirmed；隐藏 WEPE 分区为 present_observed，内部盘与网络 smoke 尚未验。Windows ISO、ADK/WinPE、驱动和 BIOS 包各有独立版本、路径、hash 与兼容边界。",
  "BIOS/UEFI 文字基线覆盖 Gigabyte X870E AORUS PRO ICE 的 CPU、内存、启动与 PCIe 核心设置；E 源、E 镜像和 G 热备三份同 SHA-256，F 保留救急速查，20 个照片引用路径存在但照片内容不进入本页。native profile（原生配置档）未找到。",
  "Windows 当前观察到 F4b；F 根的 GIGABYTE.bin 与 fan 属于 F4b 救急材料，F12 是稳定归档，F13b 是 beta/archive-only（测试版仅归档）。刷写前必须现场确认精确主板、PCB revision、目标文件、hash、BitLocker/启动恢复条件和稳定供电；本模块从不自动刷写。",
  "只有 BIOS reset（重置）或明确升级后需要恢复设置时，才人工应用照片中已确认的核心项；未拍外围菜单保持“未验证的默认候选”。保存、重启、进入 Windows 后再读稳定机器投影，不能用 user_confirmed 替代 post-boot read-back（启动后回读）。",
  "WEPE/WinPE 先用 list disk / list volume 等只读观察识别物理盘、卷、文件系统、BitLocker 和安装目标；盘符按卷角色、内容锚点与现场重新映射，不能把旧 C/E/G/H 字母当设备身份。决定前禁止 clean、format、分区重建和 BCD 改写。",
  "驱动先恢复存储、芯片组、LAN、Wi-Fi、蓝牙、RAID/USB 等关键链；现有系统驱动导出含 230 个 package（驱动包），是匹配新硬件后可选择导入的候选，不保证换板兼容，也不替代厂商当前驱动。",
  "基础系统可登录联网后，从可信 GitHub clone PCConfig、.agents 和 GitHub 总索引三个控制面；再按稳定机器投影 v9 和现场 Provider 重建 PowerShell、Git、Node.js、Python、Go、.NET、WSL、Docker、Ollama 等实际需要的运行时。",
  "项目与用户层使用 17 个恢复锚点、15 个项目路径关系和 26 项 C 盘用户配置 inventory 做导航；先安装工具，再选择性恢复配置并按新盘符改引用，不整包灌回 AppData、cache、旧 session、旧 executable 或陈旧 PATH。",
  "任务恢复用途计划已更新为9阶段57项并与目录hash匹配，完整现场任务与正式账本已94/94对齐；启动项旧现场与登记快照23项。恢复时仍先核对实际任务和启动项，接好项目、解释器、账号与配置，再按rebuild_required、optional、manual_after_install、hold_for_user和vendor-owned边界重建；identity使用task_path + task_name并保留exact preimage。",
  "登录与秘密最后分层处理：GitHub/客户端重新登录，SecretRef 只盲用不出明文。普通 PersonalData/PersonalMedia 保持原生备份格式；只有真正的 Password Center/SecretBroker RecoverySets（凭据恢复集）和 P0–P7 Carrier 走各自正式恢复入口，通用复制器不接管。恢复文件、恢复登录态和应用确认是三个不同结果。",
  "应用验收后才在新系统重新建立备份：发布 G Hot 上下文，并在用户提供 H 解锁窗口后用已验证 Hot 建 Cold。Hot 原子切换 current；Cold 重验卷身份、BitLocker、至少 107374182400 bytes（100 GiB）余量、48 小时时效和 closure，采用加法复制，不使用 /MIR，不自动解锁或回锁 H。",
  "core_recovery.json当前16组Cold为DevConfig、微信、软件环境、Documents与本地存档、Downloads、TimeAudit、Codex记忆、其他AI记忆、Codex对话闭包、Docker自定义镜像、PersonalData、PersonalMedia、RecoveryKit、LocalToolbox、Ollama模型与Steam/Millennium。LocalToolbox从既有G:\\80_Backup\\Tools\\LocalToolbox进入H:\\80_自动备份区\\Tools\\LocalToolbox，沿原冷备任务；旧AI课程不再列为当前独立组。Documents保留_SavedGames，Downloads保留非空_AlternateRoots；_PersonalRoots、缓存和登记的隔离/暂存与旧救援根不进入有效集合。WSL源码/home恢复作为软件环境的具名恢复对象单独验收，不伪装成第17组。",
  "PersonalData 与 PersonalMedia 均为 required，共用 PersonalDataReplica-Hot-Daily 的 personal-data.replica-receipt.v1：全局 complete、五映射完整且不超过 36 小时才算 fresh（新鲜）。Hot 将新鲜度冻结进 closure；enforce（强制要求）集合不新鲜时 Cold 在任何 H 载荷写入前停止。其他无独立任务/回执的有效 G 集合仍可机会式复制，存在不等于新鲜。",
  "复制按本次运行内的 NTFS 文件身份识别 hardlink（硬链接）：每组共享字节先在 H 建独立首副本，其他 H 路径再链接到它；映射不跨运行持久保存、不建后台索引，也绝不跨 G/H 链接。暂存复制或建链前后重验源身份、长度、精确修改时间与属性，正式替换 H 目标前检测到来源变化就记 warning，保留旧 H 目标及其外部硬链接；这不是发布后再核验，也不是对所有普通文件逐个做 SHA-256 验真。",
  "普通映射使用source_follow_verified_prune：完整读取G当前有效集合，复制新增和变化后，核对H文件存在性、大小、精确修改时间、属性及G源稳定性，再删除H独有旧副本。已登记保留glob（路径匹配规则）与CORE_RECOVERY、AI memory等子集合由各自Owner管理；不按父映射误删。来源变化、读取失败或回读不一致时，该映射零删除并返回warning；内容寻址集合仍由专属闭包入口验真和清理。",
  "RecoveryKit 整树从 G 进入 H 的 90_人工保留区，但 CORE_RECOVERY 只走已验证上下文闭包，避免重复；Codex 对话由其Owner维护当前与上一恢复点及其有效对象；逐对象SHA-256回读H closure后发布H current.json，再按G有效点/对象清理H旧副本。首次 H 恢复还须调用现有 Invoke-PasswordCenterColdBackup.ps1 正式入口处理 RecoverySets，通用 Cold 不作 raw copy（直接字节复制）。",
  "现役 PersonalDataReplica-Hot-Daily 已由 PCConfig 承接；同步前调用 personal-materials/materials.py sync-current 与 personal-media/personal_media.py sync-current，同步后调用后者 recovery-sync --execute。五个 E→G 映射继续传播覆盖、重命名与删除，Media/Packages 排除。后置复核逐项给出剩余复制量、源/目标数量、额外文件与目录；有缺口就返回具体失败，不用整体 robocopy 退出码掩盖。",
  "9月18日Owner已完成16组H冷备，无普通集合warning；最新DevConfig包devconfig-20260917-223044-15f482e1.zip为2918700657字节，SHA-256=23175b58deb25089f07637380a99f449ead3f699cffcb83deb1bbae9255cc42c，本地/G/Drive/H一致。隔离还原8640文件8531705353字节，主库和备份库完整性通过；没有覆盖原用户目录或做整机恢复。",
  "Owner重验主机微信G/H均145307文件、45218959121字节，大小/时间相同但SHA不同的53个H对象已经由来源原子修复、G未改；这修复的是此前可能假通过的散列缺口。本次双流全量hash、恢复阶段和旧COPY_COMPLETE_AWAITING_HUMAN仍分层：可读取的备份不自动表示微信客户端业务已恢复。",
  "WSL源码/home工作区归档3848文件2819435821字节，tar.gz为1020519817字节、SHA-256=a436e246f7103ab939a7692072895f0c5ad847d38fcda53b60172c324dcbbacf；隔离解包逐普通文件hash、POSIX mode及符号链接通过。C:个人目录隔离恢复511文件36755949字节、抽样10对象及4跳过分别有证据。",
  "五个个人资料根核验数量、集合及有界样本hash；Owner扫描361537文件、671997162829字节，不能把这描述成所有大文件全量内容hash。整机程序重装、账号重新授权、各业务真实恢复与离线PE仍单独验收。",
  "2026-09-19系统镜像Owner已改用Veeam Agent for Microsoft Windows Free 13.1.1.700；官方签名与服务Running由源记录验证。Macrium Reflect Home 10.0.8843 试用版已卸载，卸载后的重启已完成；旧Macrium包装仅留原型，不是现役镜像路线。",
  "Veeam当前只有安装与只读Inspect，首份镜像、每日备份作业、恢复介质和H层镜像接入尚未完成。28天全备与日增量是设计，不是已运行任务；license/job/image/media未检查，退出0也不证明备份存在。",
  "FastRecovery把官方Windows x64 Codex CLI 0.154.0放在独立系统侧入口，已有桌面快捷方式及G/H恢复包。自己的CODEX_HOME/PATH/临时目录不依赖旧E/V或Node/Python环境；这是命令行引导，不是桌面App整套恢复。",
  "G/H包17个载荷与13项清单各有验证，H-only安装到新C测试目录及PowerShell5/7自检已有源证据；E/V未物理断开，没有整机H-only还原。官方账号已配置，但真实模型探测返回用量限制且未产生答复/工具调用；没有自动换模型。",
  "镜像README是当前引擎责任源，FastRecovery旧段落仍称Macrium的内容未同步；导出恢复包更新缺口和未提交工作区/Git bundle覆盖仍未收口。网页不以改清单、伪造镜像或运行备份来消除这些缺口。"
],
    flow: [
      "先回答是哪一种场景：同机重装、换机/换板、系统盘故障，还是只有 PE；记录现存机器、网络、可读磁盘、F/G/H、GitHub 权限和 P0–P7 Carrier。",
      "在任何写入前只读识别物理盘和卷：核对型号、容量、文件系统、BitLocker、恢复锚点与数据角色；建立本次盘符映射，不沿用旧字母猜测。",
      "若涉及 BIOS reset、升级或换板，先确认主板与 PCB revision、当前 BIOS 和供电；同板未变则保持现状，换板不套旧值，需要恢复时只手工应用已确认核心基线。",
      "验证 UEFI 启动链、WEPE/WinPE、Windows ISO 和目标盘；能进 PE 之后仍须分别验证内部盘与网络，未作决定前不 clean、不 format、不重分区、不改 BCD。",
      "安装 Windows 到已确认目标，先装存储/芯片组/网络等关键驱动；230 包导出按硬件兼容选择，缺驱动时优先使用精确主板/设备的官方当前版本。",
      "取得本人 GitHub 与客户端访问权，clone PCConfig、.agents、GitHub 总索引；验证 remote、identity、visibility、branch，Git 不恢复 worktree、未推送或未提交内容。",
      "按现场路径核对稳定盘位、现登记18个锚点和15个项目关系，OLED历史锚点等待业务稳定版；copy-first（先复制）、验证 target、改消费者引用，再决定旧路径是否退役。",
      "从官方来源安装当前兼容运行时和软件，按真实安装路径重建非秘密环境变量与 PATH；公共软件、AI、模型、OCR/ASR 放在依赖链后段。",
      "从 26 项 C 用户配置清单中按 Owner 选择恢复；Documents、Downloads、微信、存档保持原生格式，登录态、秘密、浏览器/聊天数据库不作为普通配置整包导入。",
      "依赖齐全后核对当前9阶段57项恢复计划及实际任务定义，再检查启动项；只恢复现役且前置条件满足的项，不从旧XML复活退役任务。",
      "重新登录 GitHub、Codex 和必要应用；普通资料和媒体从已核验的原生副本选择恢复，SecretRef/Password Center 凭据与真正 P0–P7 载荷分别走其正式入口，不把整个媒体库当作必须加密的凭据域。",
      "自然启动 Windows 与关键应用，核对任务/启动链、项目打开、账号、Documents/Downloads/微信或应用数据可见和必要业务动作；把需登录、unknown 与失败项保留为独立结果。",
      "发布恢复后的稳定机器投影和必要 lifecycle event（生命周期事件），重建 G Hot；H 可用时再建立 Cold 并核对回执，使下一次恢复不依赖旧机器快照。"
    ],
    concepts: [
      { term: "BIOS/UEFI（主板固件设置）", explanation: "Windows 启动前的主板设置层。文字基线帮助人工恢复确认过的核心项，但不是可导入 Profile，也不自动刷写。" },
      { term: "PCB revision（主板电路板版本）", explanation: "同一商品名下的硬件修订版；刷 BIOS 和选驱动前必须现场确认，支持页路径不能替代板上标识。" },
      { term: "WEPE/WinPE（Windows 预安装环境）", explanation: "系统无法登录时用于识盘、联网、安装或修复的轻量环境；能启动不等于内部盘、网络和备份都可用。" },
      { term: "CoreRecovery（核心恢复）", explanation: "重装/换机后的恢复范围、来源、任务和 Hot/Cold 关系的主观察入口；不是磁盘镜像，也不读取私人 payload 正文。" },
      { term: "Hot（在线热备）", explanation: "G 上持续可访问的恢复上下文与已登记数据副本；完整写入 staging 并回读后才原子更新 current。" },
      { term: "Cold（人工冷备）", explanation: "H 上由用户提供解锁窗口的独立副本；只消费已验证 Hot，不反向改写 G，也不自动解锁或回锁。" },
      { term: "Closure（闭合清单）", explanation: "把规范文件名、schema、长度和 SHA-256 绑在一起，避免 current 指向不完整的一组文件。" },
      { term: "Selective restore（选择性恢复）", explanation: "备份可以宽，恢复只取经过 Owner、新硬件兼容和新系统验证的必要对象，不整包覆盖。" },
      { term: "present_verified / present_observed / user_confirmed（材料证据三种边界）", explanation: "前者证明材料存在且通过指纹检查；observed 只证明现场看见；user_confirmed 保存用户确认的生效语义。三者都不能替代未执行的自然重启或新机端到端验收。" },
      { term: "Recovery checkpoint（恢复检查点）", explanation: "每一层完成后可回读、可停下并继续的耐久状态，而不是一次长命令的临时输出。" }
    ],
    boundaries: [
      "不把 BIOS 变成独立模块；它只在同板设置丢失、明确升级或换板判断中作为恢复旅程的一步",
      "不自动刷写 BIOS，不根据文件较新、支持页 Rev. 1.0 线索或照片中的 Q-Flash 进度决定活动版本",
      "只读识盘完成前不 clean、format、改分区或 BCD；旧盘符不等于设备身份",
      "F 启动 U 盘不等于 G/H 数据备份，Windows ISO、WEPE 启动和应用数据恢复是三层证据",
      "现有CoreRecovery仍排除Git工作区、未推送提交和bundle，因而新设计要求的本地独有工程成果尚未获得这条恢复链覆盖。不能用仓库能clone代替未推送内容保全；需由来源Owner连同生产者和恢复入口一起补齐。",
      "不递归复制整个 AppData，不把浏览器登录态或原始聊天数据库写入仓库",
      "不新增云上传、不切换账号、不读取活动 OAuth 私密内容",
      "230 个导出驱动包不保证换板或新系统兼容；关键驱动仍须按目标硬件和官方来源筛选",
      "普通 PersonalData/PersonalMedia 原生 G 副本属于 Cold 范围；通用复制器不接管真正 P0–P7 Carrier 或 Password Center/SecretBroker RecoverySets、因子与正式数据动作",
      "备份存在、任务 exit 0、文件复制或 hash 通过都不单独证明应用恢复",
      "冷备不使用/MIR或裸盘镜像；先完整读取有效保留集、复制并核验新增变化，再按元数据身份/存在性和源稳定性清理H旧副本。源离线、锁定或读不完整不等于空源，失败保留可恢复状态；跨盘独立复制，H内可共享硬链接且至少留100GiB",
      "9月18日已验证16组H文件冷备；9月14日15组记录保留为历史，之后新增内容是否已进入H仍看对应成功记录。系统镜像、凭据恢复和新机实际还原分别验收。 2026-09-05首次H备份与卷身份验收仍是历史证据，不替代之后任一新备份。",
      "永久删除和秘密恢复按活动 E 规则、既有用户授权与独立产品入口处理，不从操作名称统一追加审批或新 CoreGoal"
    ],
    failures: [
      { condition: "PE 能启动但看不到内部盘或网络", response: "保持 present_observed，不格式化 U 盘或内盘；先补存储/网络驱动和只读 smoke，仍不可见就停止该来源的恢复。" },
      { condition: "旧盘符与新机器不一致", response: "按物理盘、卷、文件系统、容量和恢复锚点重建映射，再更新项目/任务消费者；不创建同名字母空盘掩盖缺失。" },
      { condition: "主板 PCB revision 或当前 BIOS 无法确认", response: "不刷写、不导入旧设置；只保留文字基线与候选包，待现场确认精确板号、版本、文件、hash 和供电。" },
      { condition: "BIOS 设置已按记录填写但未做保存重启", response: "保持 user_confirmed 历史语义，当前恢复仍未完成；进入 Windows 后重新读取稳定机器投影并做稳定性验收。" },
      { condition: "导出驱动与目标硬件不兼容", response: "跳过该包，优先安装精确硬件的官方当前驱动；不因 230 包清单完整就强行批量安装。" },
      { condition: "CoreRecovery 当前区域检查", response: "2026-09-03 的 manifest_contract、maintenance_inspect 和 task_contract 三项均 PASS；Inspect 报告 11 个任务、14 个 G→H 计划集合、2 个独立 Owner 和 9 个 required 集合 fresh。它证明合同与来源可观察，不覆盖真实 H 复制或新机应用验收。" },
      { condition: "H 锁定、缺失或卷身份不符", response: "Cold 返回 skipped 或 fail，既不写入介质，也不自动解锁、锁卷或改变设备信任。" },
      { condition: "Hot closure 或时效不满足", response: "Cold 不复制，也不用进程成功值或旧 current 补齐。" },
      { condition: "必需的个人副本回执不完整、非 complete 或超过 36 小时", response: "个人资料/媒体保持未证明新鲜；Cold 在 H 载荷写入前停止，不用目录存在或任务退出码 0 代替完整五映射回执。" },
      { condition: "暂存复制或建链前后核对发现 G 来源变化", response: "在正式替换 H 目标前停止该文件发布，该集合记录 warning，只清本次临时名，保留原有 H 目标和其外部硬链接；待 G 稳定后沿同一入口重跑，不称本轮完整冷备。" },
      { condition: "复制中断或校验失败", response: "保留逐项结果、旧 current（当前完整状态）和 source（恢复来源）；不切消费者，不清旧路径。" },
      { condition: "任务或启动项定义已恢复但自然启动失败", response: "区分身份、Action、权限、依赖和应用 Owner 结果；不靠手动点开一次或旧 LastTaskResult 冒充自然启动通过。" },
      { condition: "应用数据已复制但客户端不可见", response: "保持恢复未完成，回到应用 Owner 做原生打开、账号、数据格式和一致性验证。" }
    ],
    sources: [
  {
    "path": "E:\\PCConfig\\registries\\core_recovery.json",
    "role": "核心恢复 scope、备份集合、外部 Owner 和成功条件"
  },
  {
    "path": "E:\\PCConfig\\registries\\recovery_kit.json",
    "role": "F/G/H 恢复介质、UEFI/WEPE、Windows ISO、230 包驱动导出、BIOS/驱动归档及证据状态"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\bios-settings.md",
    "role": "照片固化的 BIOS/UEFI 核心基线、F4b/F12/F13b 边界与恢复后回读要求；不包含照片原件"
  },
  {
    "path": "E:\\PCConfig\\registries\\project_restore_anchors.json",
    "role": "17 个开发存储恢复锚点"
  },
  {
    "path": "E:\\PCConfig\\registries\\projects.json",
    "role": "15 个项目及当前路径导航"
  },
  {
    "path": "E:\\PCConfig\\registries\\c_user_config_inventory.json",
    "role": "26 项 C 盘用户配置及选择性恢复分层"
  },
  {
    "path": "E:\\PCConfig\\registries\\scheduled_task_rebuild_plan.json",
    "role": "9阶段57项恢复用途计划、恢复决定与授权边界"
  },
  {
    "path": "E:\\PCConfig\\registries\\project_restore_anchors.json",
    "role": "当前18个恢复锚点，包含Emerald Veil桌面和锁屏图片的可搬迁项目入口"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\runtime_restore_order.md",
    "role": "运行时恢复顺序及RTSS对Windows PowerShell的精确排除、验证和单文件回滚"
  },
  {
    "path": "E:\\PCConfig\\tools\\rtss-powershell.cfg",
    "role": "只供powershell.exe恢复的RTSS应用排除配置，不覆盖其他程序profile"
  },
  {
    "path": "E:\\PCConfig\\registries\\startup_snapshot.json",
    "role": "版本化启动维护基线；本轮23项由live Provider回读"
  },
  {
    "path": "E:\\PCConfig\\registries\\stable_machine_projection.json",
    "role": "版本 9 的硬件、磁盘和运行时稳定基线"
  },
  {
    "path": "E:\\PCConfig\\registries\\backup_media_structure.json",
    "role": "Hot/Cold 介质结构导航"
  },
  {
    "path": "E:\\PCConfig\\registries\\acceptance_checklist.json",
    "role": "分区域验收入口，当前 core_recovery 精确选择三项"
  },
  {
    "path": "E:\\PCConfig\\docs\\contracts\\pcconfig.core-recovery.md",
    "role": "CoreRecovery、Hot/Cold 和选择性恢复合同"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\core_recovery_maintenance.md",
    "role": "冷备唯一维护入口、新鲜度、硬链接、增量保留与回执边界；集合以当前Registry为准"
  },
  {
    "path": "E:\\PCConfig\\tools\\Invoke-CoreRecoveryMaintenance.ps1",
    "role": "Inspect/Hot/Cold 实现、源变化拒绝发布与 H 内硬链接复制"
  },
  {
    "path": "E:\\PCConfig\\tools\\Invoke-PasswordCenterColdBackup.ps1",
    "role": "首次 H 恢复的独立凭据恢复集 Cold 入口，不由通用复制器接管"
  },
  {
    "path": "E:\\PCConfig\\tools\\Sync-PersonalReplicasToG.ps1",
    "role": "五映射当前副本、领域 sync-current、媒体恢复包与具体后置核验"
  },
  {
    "path": "E:\\PCConfig\\docs\\contracts\\pcconfig.recovery-privacy.md",
    "role": "迁移、秘密与私人 payload 边界"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\START_RECOVERY.md",
    "role": "同机重装、换机、系统盘故障与仅 PE 的第一入口和来源分流"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\scheduled_tasks_rebuild.md",
    "role": "项目/运行时先于任务的九阶段人类恢复说明"
  },
  {
    "path": "E:\\PCConfig\\docs\\recovery\\private_config_restore.md",
    "role": "重新登录、SecretRef、Password Center 与 P0–P7 分层"
  },
  {
    "path": "E:\\PCConfig\\tools\\system-image\\README.md",
    "role": "现役Veeam安装、Macrium退役及首镜像/介质/作业未完成的责任源"
  },
  {
    "path": "E:\\PCConfig\\tools\\fast-recovery\\README.md",
    "role": "系统侧CodexCLI、G/H引导包与隔离安装；其中旧镜像引擎段落不覆盖system-image责任源"
  },
  {
    "path": "E:\\PCConfig\\tools\\fast-recovery\\RECOVERY_START.md",
    "role": "Windows已恢复后的独立AI入口接续，非自动分区或整盘恢复执行"
  }
],
    verification: [
  "2026-08-31 现场：PCConfig PRIVATE main=origin/main=d4480abc17574177b91e52b0aff9aebd30583f58，worktree clean；node tools\\validate_recovery_kit.mjs 返回 16 assets、0 error、0 warning",
  "2026-09-09历史主机与远端main回读a69d632913af73c5003ffb960bfa153892704283，包含台账修复893b46c与Health合同说明更正；副机21:54UTC的c932297仍为当时观察。原stable_machine_projection候选现已随dbb30ee发布为v9，本轮正式源码3f31a73另有局部复核。a04914d、ff424738与33fc459保留为9月8日历史修复证据，当前硬件基线不被dirty投影覆盖。",
  "2026-09-03T16:12:48Z 只读 CoreRecovery Inspect 返回 pcconfig.core_recovery_observation.v2、status=ready、warnings=[]：11 个任务均 Ready/最近结果 0，14 组 G 来源存在、H 路径均不可见，9 个 required 集合 fresh，另有 2 个独立 Owner；不枚举 payload 名称或正文",
  "2026-09-03T16:14:09Z 的 Invoke-PCConfigAcceptance.ps1 -NoWrite -Area core_recovery -Json 返回 3 PASS、0 fail、0 unknown、0 blocking_unresolved；只有合同、只读观察和任务定义检查，不执行备份或恢复",
  "2026-09-07 最新个人副本回执整体/镜像 complete：PersonalData、Pictures、Videos、Music、Media 的源/目标数量分别为 329780、20331、378、3854、66538，五映射 post_verified=true、剩余复制/额外文件/额外目录均0、errors=[]；仅读取无正文回执，不重新运行复制。",
  "Invoke-StableMachineProjection.ps1 -Action Read -Json 返回 projection_version=6；project_restore_anchors、projects 与 c_user_config_inventory 分别登记 17、15、26 项",
  "scheduled_task_rebuild_plan.json当前9阶段57项，2026-09-09 21:55 UTC validator通过、0错误/警告；21:58管理员Drift确认用途目录hash匹配。2026-09-08的23启动项保留为历史现场，清单均不替代自然启动验收。",
  "BIOS 文字记录的 E 源、E 镜像与 G 热备三份 SHA-256 均为 2FE3B5C7…B0E21B；F 救急速查存在。20 个引用照片路径只做存在性检查，本次未读取照片",
  "BIOS 核心基线为 present_verified，CPU/内存生效为 user_confirmed；native_profile_status=not_found，PCB revision、保存后自然重启和完整外围菜单仍未独立验证",
  "F 的 UEFI→PE 启动由用户确认；WEPE 隐藏分区仅 present_observed，内部 Windows 磁盘可见和网络可用的 PE smoke 仍未执行",
  "2026-09-14只读H cold-last.json：完成时间00:11:27.9766678Z，15/15集合complete、warnings=[]、普通retention全部complete，SHA-256=0e30feb26c398b32f0983d6ae9bd3485cb669a48e977f4c4a0e2c21f4aca0883。Codex closure点20260913T112054Z-1d51dc2b、7279文件/51104813027 bytes、readback_verified=true。稍后本机00:34:30Z回执skipped/H_unavailable，哈希不同是不同尝试，不能宣称两份同轮一致；新机恢复未验。",
  "来源工程已通过隔离复制、只读目标替换、硬链接保留与源变化测试；core_recovery_maintenance.test.ps1 同时覆盖 Inspect、Hot、Cold、closure、时效、卷身份和中断回执。本轮只读复核对应源码与测试范围，未重跑Cold或个人数据复制；必要指南修复后另用既有Hot在2026-09-08T08:21:59Z（历史）更新四文件上下文41832字节，context=3ac53e2400b07076403fff1ac5a87d8a2ad99479a7a6fb1d02abc4044edc2498，源指南与G正文哈希一致。这不制造新的H或新机恢复验收",
  "build_scheduled_task_rebuild_plan.test.mjs 与 validate_scheduled_task_rebuild_plan.test.mjs 覆盖任务恢复投影",
  "acceptance runner 的精确 area/check selector、超时、unknown 和有界输出由 invoke_acceptance_checks.test.ps1 验证",
  "9月18日Owner完成15项PowerShell来源套件在5.1和7各一次、WSL脚本11项、Windows窗口2项、微信11项，以及16组冷备/四处同包/隔离还原/数据库完整性。网页没有重复运行这些备份或来源套件，真实整机恢复仍未验。",
  "2026-09-19回读PCConfig PUBLIC-safe源06411c880b7a75a9d652adb9c645c73241b2da0c及远端main一致，以上安装/包/模型限制来自Owner的当日实际记录。没有重装软件、触发镜像、创建任务或重复模型请求。"
],
    relation: "本模块是 PCConfig 从机器断点回到可用电脑的完整旅程：机器事实模块提供主板、磁盘、盘符、锚点和项目路径；运行时与启动模块提供软件、任务和自然启动链；秘密模块负责重新登录与 SecretRef；受保护数据模块继续独立承担 P0–P7 Carrier、因子和正式数据恢复。BIOS/UEFI 归这条恢复旅程，不另拆模块。",
    readerStatus: "文件与配置已有经过核对的备份和隔离还原记录；系统镜像尚未形成完整恢复链，整台新电脑恢复也未验收。"
  },
  {
    slug: "secondary-laptop",
    usageEntry: "在已接入 PCConfig 的 AI 对话中明确说“副驾驶笔记本”，并说明是日常接续还是笔记本自身恢复。",
    usageInputs: ["要继续的项目、遇到的问题或恢复目标", "恢复时希望使用的外接介质（如果有）"],
    productFlow: [
      {
        "title": "确认当前电脑和用途",
        "detail": "先确认要处理的是哪台电脑。可以在副驾驶本机工作，也可以从主机使用已经接通的电脑连接；连接后核对返回的机器与用户身份，实际恢复和日常接续分别处理。"
      },
      {
        "title": "按实际机器取证",
        "detail": "连接可用时，直接在副机只读核对它自己的任务、文件和恢复状态。连接失败才说明本次只能参考账本的历史记录，不能拿主机状态代替副机现场，也不把两台电脑的路径套在一起。"
      },
      {
        "title": "继续或恢复",
        "detail": "日常先做本机可做的文档与轻量工作；恢复先预览材料与冲突，再按实际目标回填并验登录，不说副机是主机完整镜像。"
      }
    ],
    shortTitle: "副驾驶笔记本",
    title: "副驾驶笔记本、跨设备接管与独立恢复",
    teaser: "为一台真实登记的 Windows副驾驶笔记本划清远控、轻量开发与原NVMe固态硬盘的接管路线，并给它自己的健康检查、恢复胶囊和防覆盖流程。",
    status: "新热对话点与安全Git有只读回读，USB未接；恢复任务Ready，独立周检暂停",
    statusTone: "mixed",
    searchProjection: {
      intents: ["查看副驾驶笔记本能做什么", "离开台式机继续工作", "检查笔记本健康", "重装副电脑并恢复", "台式机坏后用笔记本接管", "笔记本丢盘后恢复"],
      entities: ["LAPTOP-E48N0DRJ", "ToDesk", "Tailscale", "FlyingBird", "CodexRecovery-SecondaryLaptop", "恢复胶囊 USB", "原台式机 GM7000 NVMe"],
      relations: ["台式机主工作站与笔记本副驾驶分工", "主机身份决定账本和 Provider 是否适用", "本地 rollback 与独立 USB 灾备分层", "Git 项目与无远端项目恢复方式不同", "原 NVMe 临时接管不改写台式机事实"],
      failureRecovery: ["host_mismatch 返回 not_applicable", "断网时不开放 LAN 或公网替代", "空白新机保持 writer 冻结", "U 盘不在保持正常等待", "NVMe 接管未验不冒充可用", "无远端项目明确保全或接受丢失"]
    },
    value: "离开家时用笔记本远控主机；主机不可达时，用笔记本自己的网络、账号、规则和轻量项目继续工作。它有独立的文件胶囊与Codex历史恢复点，换机先验证旧副本，再允许新机器开始备份，避免空白新机盖掉唯一历史。",
    why: "主工作站一旦远控失灵、主板或电源故障，工作就可能中断；笔记本自身重装或丢盘也是另一类事故。把两台电脑做成全盘镜像，会把错误驱动、登录态、硬件配置和损坏状态一起复制；只靠 Git 又覆盖不了未入库文件、设备服务、网络边界与恢复写入门。副驾驶需要自己的角色、现场健康、数据范围和恢复生命周期。",
    example: "“主机现在连不上，先看看我在笔记本还能继续哪些文档和轻量项目，别把它当成主机的完整镜像。”先读副机真实状态和已保全内容，缺少的账号或项目明确列出。原台式机NVMe外置接管仍是另需真机演练的事故路线。",
    result: "我会知道笔记本今天还能做哪些工作、远控和网络是否可用、最近的本地与外接盘副本各到哪一天。最近一次本地与私有云已有成功记录，USB 当时没接；这不等于整机换新后已经验收。",
    readerStates: {
      "pass": "在笔记本本机，或从主机连接并确认返回身份确为副机后，分别检查网络、工具、备份和当前文件；这些就绪后可以继续笔记本能独立做的工作。",
      "problem": "远控、任务或恢复材料有一处不符，只停需要它的操作，保留已有文件和原恢复状态。",
      "unavailable": "笔记本连接失败、返回身份不符、USB 未接或主机硬盘未装入时，只说明对应部分未知；账本历史和主机自身状态都不能替代缺少的副机现场。"
    },
    decisionImpact: [
      "WLY 是主工作站，承担 canonical E/V/Z、G 在线备份和本地重型 GPU/OCR/ASR；LAPTOP-E48N0DRJ 是副驾驶/备用终端，不复制主机职责。",
      "日常远控以 ToDesk 为主，Moonlight/Sunshine 只作备用；双机发现和精确访问走 Tailscale，不为方便开放普通 LAN 或公网。",
      "主机不可达时不等待台式机 AuthorityHost、密码中心或 E 盘：使用副机自己的网络、Codex 登录、规则与按需项目。断网时本地文件和工具按实际继续，云端 Codex 不承诺离线可用；主机恢复后按 Git 与各数据来源协调新增工作。",
      "笔记本可以有自己的 WSL2、Docker 和开发工具，但 Docker 登录自启关闭、Kubernetes 不启用，重型能力必须按当前宿主重新验收。",
      "PCConfig PRIVATE Git 同步版本化账本和恢复源码，不同步实时机器状态、用户文件、登录态或秘密，也不把一台机器的盘符写成另一台事实。",
      "普通恢复胶囊覆盖登记的 Desktop、Documents、Downloads 与窄 Codex 策略束，明确排除由主机完整保全的 Documents/xwechat_files 和 Documents/WeChat Files。副机自己的 Codex 历史、附件、索引、SQLite 数据库和私有配置另由 codex-memory 独立恢复点覆盖；有远端的项目重新 clone，无远端项目仍须独立副本或明确接受丢失。",
      "本地 rollback cache 与笔记本 C: 在同一物理故障域，只帮助同机回滚；只有独立、已绑定且加密的 USB 世代能承担笔记本丢盘/换机介质角色。",
      "台式机 NVMe 外置接管只把原盘作为数据与工作区来源；不从外置盘启动 Windows，不恢复台式机任务/驱动，也不改写 WLY Registry。",
      "需要访问公司或家庭某个服务时，给出明确目标、协议与端口；现有双机维护入口按实际网络接通该目标，并在用完或离开网络后撤销。当前公司通路未启用、未实测，不自动发布整个网段。",
      "Windows 恢复任务每天 09:00、21:00 检查：普通胶囊本地/U盘各按7天周期，Codex 对话满12小时采集并分别重试云端和USB阶段。独立每周语义巡检只看新问题、漂移和恢复覆盖，不触发备份或恢复；2026-09-24 当前原生 automation.toml 仍配置北京时间周一 07:15、gpt-5.6-luna/max，但 status=PAUSED，不能说它正在自动巡检。Windows 恢复任务仍 Ready、最近结果0；两个调度状态分开。",
      "换机按新设备实际架构、用户根、项目盘、显示器与 OEM 能力重建；胶囊不是 Windows 启动盘，先准备可启动系统、网络和账号，不为重装格式化保存唯一胶囊的 U 盘。"
    ],
    problem: "副驾驶不是“装了几个软件的第二台电脑”。它同时涉及两台主机的事实隔离、日常远控、端口和防火墙、可离线的工具基线、跨设备数据来源、笔记本自身灾备、空白新机防覆盖，以及台式机故障时的临时 NVMe 接管。漏掉任一层，都可能把远控可用误写成可恢复，把源码测试误写成设备健康，或让新机第一次备份覆盖唯一旧世代。",
    implementation: ["唯一登记的笔记本主机为 LAPTOP-E48N0DRJ，角色是 secondary-laptop。只有计算机名精确匹配、活动用户根为 C:\\Users\\wly 且本地规则入口存在时，副驾驶账本和该主机 Codex 入口才适用；其他主机返回 not_applicable/host_mismatch。","副驾驶稳定职责包含 ToDesk 日常远控、Tailscale 双机通道、FlyingBird 服务、可选 Moonlight；台式机代理 7892 只经 tailnet Serve 使用，PostgreSQL 45432 只读测试入口和笔记本 SSH 22/RDP 3389 只允许登记的台式机 Tailscale 对端。","WLY 主工作站自己的 RDP 3389 暴露由 rdp_tailscale_exposure Registry 单独管理，只允许登记的同用户 Tailscale peers，并保留 ToDesk 与既有 Serve/Funnel；它与笔记本入站规则不能互相复制。","笔记本默认阻止入站；精确防火墙只接受 Tailscale 接口上的登记对端。公司网段转接未激活，宽泛 Tailscale-In 规则在系统或 Tailscale 更新后须重新确认未被启用。","副驾驶 IPv4/IPv6 TCP active/persistent 动态范围登记为 49152–65535，旧 MaxUserPort=15000 应保持移除；Codex localhost:1455 再现 10013 时重查范围、排除段和真实 listener，不用循环重启 WinNAT 或新增普通 excluded range 掩盖根因。","运行基线登记 Git/LFS、VS Code、Python/uv、Temurin JDK 21、Maven、psql、WSL2 Ubuntu 24.04 与 Docker Desktop。Docker 使用 WSL2/Linux 容器、关闭登录自启和 Kubernetes；WSL/Docker 停止是正常状态，健康检查不会为验证启动它们。","Get-SecondaryLaptopHealth.ps1 是唯一只读健康入口：检查 role.machine、远控/网络/防火墙、recovery.task/local/usb、BitLocker、WinRE、WSL2、Docker、空间、工具和 PCConfig Git。它不联网、不提权、不启动服务、不解锁 U 盘、不触发备份或写健康快照。","健康入口已内置一次完整 Audit，载荷失败/未知纳入同一结论，不能用世代元数据替代强校验。SYSTEM 用于读取机器与恢复链时，HKCU、PATH、WSL/Docker 和交互桌面字段仍属于实际用户；本轮另从用户会话定向补读，没有重复全审计。","恢复内核安装在管理员保护的 C:\\ProgramData\\CodexRecovery\\secondary-laptop；唯一任务 CodexRecovery-SecondaryLaptop 每天 09:00 和 21:00 以 S4U + Highest 运行，恰好一个 System32 wscript.exe //B //NoLogo Action，再调用受保护 pwsh，全链不得引用普通用户可写代码。","任务信任链覆盖 ProgramData 祖先、安装根、launcher、Backup 脚本、settings、deployment manifest、runtime receipt、实际 pwsh 和 Windows Task Scheduler 定义；reparse、非可信 Owner 或可替换叶文件都阻断，不能只检查安装根 ACL。","writerState 固定为 restore_pending → restored_unaccepted → writer_activated。新机和重装默认禁用任务；-Force 不能越门。Mark 与 Activate 在两个进程中重新验证同一个 current、generation、manifest、closure、exact set、长度和 SHA-256，最后由用户确认才启用 writer。","普通文件本地与 USB 都用原子世代和 current.json，默认保留2个已验证世代、各满7天更新。新代复用上个已验证备份的未变内容，只复制新增/变化项，不链接活动原件；源删除不进入最新恢复集，过期世代释放无引用内容。USB未接入、未解锁或未绑定正常等待，不推进其成功时间。","周检当前配置为每周一07:15、Asia/Shanghai、gpt-5.6-luna/max，但原生自动化状态为PAUSED；职责模板CODEX_WEEKLY_AUDIT.md从ProgramData及真实源码消费，不能把暂停任务写成正在巡检。9月15日已统一旧10:00账本与失效路径问题。恢复审计仍只读，MCP每周治理按本人9月14日限定授权，在正式版本变化并验证后顺序升级/回退；不恢复主机暂停任务，无新版不重装不重启。观察到的Luna/MAX只是该次任务配置，不是产品身份或永久上限。 换机仍须完成Codex登录、机器绑定与恢复验收，再通过正式自动化入口查同名任务并更新或创建，回读新机调度与实际模型；不复制旧automation ID、原始配置或整棵.codex。","USB 首次绑定只接受 BusType=USB、稳定卷/磁盘身份、BitLocker FullyEncrypted + Protection On 且路径无 reparse；绑定本身不备份，只有 writer_activated 后显式 CreateInitialBackup 才写第一个世代。","胶囊对用户文件只做 Desktop、Documents、Downloads 的非破坏性合并；同名和敏感候选先预览。它不复制整棵 AppData、旧驱动/OEM/电源计划、浏览器或 Codex 登录态、活动 WSL/Docker VHDX、密码、Token、Cookie、私钥或设备身份密钥。","Documents 内的兼容 junction 不会把 Pictures/Music/Videos 自动纳入。2026-09-09 现役世代包含 Desktop 19、Documents 17697、Downloads 279 个文件及 3 个 CodexPolicy 对象；Documents captureState=degraded，按策略跳过 1 项、跳过 reparse 3 项。强校验只证明实际纳入的 17998 个文件、5655187424 bytes 完整，未覆盖位置仍由其来源独立保全。","普通胶囊的 Codex 策略仍只有不可自动加载的三项惰性束：唯一规则正文、worker 定义和 [agents] 两键投影，恢复时语义合并到唯一目标。完整私有配置与应用数据由独立 codex-memory profile（主机配置档）负责；两层不能互相冒充完整覆盖，也不整棵复制旧 Codex home 来跳过登录。","副机共享引擎来源为 PRIVATE wlyaaaaa/codex-memory，活动根 C:\\ProgramData\\CodexRecovery\\codex-data\\secondary-laptop；Manage-CodexDataBackup.ps1 的 Plan/Install/Update 管理部署，Status/Verify -ReadOnly 只读检查。主机 main 根数据与副机 backup/secondary-laptop 安全云分支隔离，同一 CodexRecovery-SecondaryLaptop 隐藏任务承接，不新建服务或调度器。 c5914cf共享引擎已修复USB缺席时误阻断本地的问题；原任务满12小时采集Codex数据，普通恢复胶囊仍按自己的7天周期，不新增任务或守护进程。","安全云层只含惰性规则、TOML白名单投影、记忆与自定义agent/skill文件，逐文件回读后正常推送并核对远端OID。私有层用VSS一致性恢复点保存sessions、archived_sessions、附件、索引、SQLite与WAL、自动化状态和完整本地配置；本地conversations与独立加密USB的codex-data分别验证，USB还含safe-settings及自带工具/profile/导航的recovery-kit。","副机数据本地与在场正确USB各保留当前加上一份已验证回滚点，清理过期point和无引用对象；源删除同步到最新恢复集及云分支，旧回滚不并回当前。超过36小时未成功、连接介质落后/身份变化、散列损坏或新增来源未覆盖须关注；USB缺席保留旧cold日期，云失败不能抹掉已验证本地结果，也不能推进云成功回执。 9月18日USB未接，本地与安全Git完成，旧USB冷点仍按原成功时间保留。","恢复先验证选定来源，物化到空的隔离目录，重映射普通与\\\\?\\ Windows路径，再检查SQLite和隔离Codex app-server能否列出并读取历史任务；不启动旧任务，不加载旧auth、queue、goals或活动config。新机选择性激活仍须停止活动写入、重建路径及官方登录，并完成整机验收。","副驾驶重装顺序是 Windows/网络 → Git 与 PCConfig 账本 → Tailscale/ToDesk/FlyingBird → 经确认用户文件 → 开发工具 → 人工重建 WSL/Docker → 可选 Moonlight → 精确防火墙 → 整体验收 → writer 激活。账号与设备配对在目标机重新完成。","跨品牌恢复使用 START_FOR_CODEX.md 与 desired.yaml；没有 V: 就选实际项目根，按目标架构安装稳定兼容运行时，Windows Home 的 WSL2 不要求完整 Hyper-V 角色。旧 AMD/OEM 驱动、电源、显示器编号和身份不迁移；本机 AMD 性能浮层、游戏内叠加与自有快捷键的禁用在换机或更新后按真实厂商复核。","MCP 生命周期由副机活动 config 与受保护 manager 回读，具体架构见电脑 MCP 模块。公司/家庭单个 TCP 服务按 company_network_quick_start.md 复用 MaintenancePowerShell 与 Windows PortProxy，监听仅绑定转接端 Tailscale 地址，精确防火墙仅允许指定对端；保持 HTTPS 主机名/SNI 和证书校验。UDP、多个目标和原始来源地址要求另作适配，当前没有公司服务目标或活跃转发。 9月15日两机23工具及四项输出合同已完成部署和合成场景回读，当前依赖0.8.5；实际冷启动、当前客户端全部写工具和公司现场效果仍分别未验。","台式机故障接管默认由笔记本自己的 Windows 启动，原 Predator GM7000 只作为数据盘；动态根记为 DesktopDataRoot，原 E/V 可按需读取或挂载，Z 重建，G 默认不挂载。缺少原机应用、服务或登录态不阻断 Git/文档接管。","启动 LocalGpuBroker、Ollama、本地模型、LocalOCR 或 ChineseASR 前必须对笔记本当前硬件运行重型能力检查；不满足就零启动、零目录创建，普通 Codex、Git 和文档继续，不把临时宿主观察写回 WLY 稳定投影。","2026-09-18T13:00:59Z副机只读回读ready_usb_not_connected：已安装源摘要匹配，原任务Ready、最近complete；安全配置16文件114909字节remote OID=112ebde654f5629a3e9223ae0046ca5d4548bcdc；热对话点20260918T130027Z-f81447f4为145文件226154889字节，manifest=b8583e924267b82715db58ecca202865d6cff750898ed7ec57592d22f5a24716，closure=6110dd1401f98e94dc5b478399c7020042cdb25612a9a3e7f004ea0ea7944072，vss_crash_consistent。此次状态核对元数据与已安装源码，不重做全载荷hash。","最后USB冷点仍20260912T010007Z-79c363c0，323文件407005388字节，2026-09-12T01:00:39Z完成；manifest=857298a0597730876ae13b86c6382232a982e3a1c211d9a6696a5cb6df7bfbe7，旧safe31文件与recovery-kit9文件分别留证。曾通过同点物化、SQLite integrity_check和隔离官方app-server旧任务只读验收；不带auth/queue/goals恢复，不执行旧任务，物理换机仍未验。"],
    flow: [
      "先确认现实目标：日常离开主机继续工作、笔记本自身重装/换机、笔记本磁盘故障，还是台式机非硬盘故障后的临时接管。",
      "在实际执行端回读计算机名和用户根；只有精确命中 LAPTOP-E48N0DRJ/C:\\Users\\wly 才消费副驾驶 live Provider。在主机上使用已登记的 secondary_laptop MCP，让对端执行同样的身份和现场核验；连接失败才退回带日期账本，不能在主机本地加载副机路径。",
      "日常使用先验证 Tailscale、ToDesk/FlyingBird、精确防火墙和所需开发工具；台式机代理、数据库或远控不可达时，列出依赖并继续本地可做的 Git、文档和轻量开发。",
      "笔记本重装或换机时先保持恢复任务 Disabled 与 writerState=restore_pending，从 USB 胶囊 current 指向的已提交世代读取 START_FOR_CODEX、desired、snapshot、manifest 和 closure。",
      "生成一页恢复预览，分成自动执行、需要登录/配对、冲突/跳过；用户集中确认后，非破坏性恢复已覆盖的普通文件和窄策略；Codex历史及私有配置另从独立恢复点隔离验证后选择性激活，已确认主机拥有的微信副本不恢复。",
      "从 PRIVATE PCConfig 刷新账本；Git-backed 项目重新 clone。对每个无远端 V 项目选择 PRIVATE Git、加密导出或明确接受丢失，不把它们假装包含在胶囊。",
      "按目标机重新安装工具、Tailscale、ToDesk、FlyingBird；人工重建 WSL2/Docker，只从停机导出或 Owner-aware 导出恢复不可再生数据。",
      "重新登录 Codex、Tailscale、ToDesk、FlyingBird、浏览器和其他身份应用；秘密只经凭据 Owner、Provider 或 SecretRef，不复制旧 session。",
      "恢复文件后以真实胶囊来源标记 restored_unaccepted；检查服务、工具、精确防火墙、文件和仍缺项目，用户确认整体可用后再 Activate writer。",
      "writer 激活后才绑定/验证独立 USB，并显式创建初始世代；未接入或未解锁时保留正常等待，本地 rollback 继续但不冒充灾备。",
      "台式机故障接管时，用笔记本自己的 Windows 启动并取消任何初始化/格式化提示；只读识别原 GM7000、分区和锚点，从 DesktopDataRoot 工作。",
      "需要 V 项目时先只读检查 Dev Drive VHDX，再在 V: 空闲且确需写入时挂载；不恢复 Z，不默认挂 G，不把临时盘符写回 PCConfig。",
      "接管结束前提交或备份新增工作，停止外置盘消费者，卸载 VHDX 并安全弹出；原盘装回 WLY 后再以原机现场重建 E/V/Z、任务、运行时和备份结论。"
    ],
    concepts: [
      { term: "Host-scoped ledger（主机限定账本）", explanation: "只有主机身份和用户根同时匹配时才解释该设备现场；在别的电脑上只能作为设计与恢复导航。" },
      { term: "Secondary laptop（副驾驶笔记本）", explanation: "承担远控、轻量开发和应急接管的备用 Windows 设备，不是台式机硬件、任务和盘符的镜像。" },
      { term: "Health Provider（健康读取器）", explanation: "一次只读检查设备角色、网络、运行时、任务和恢复链；它不修复、不联网，也不启动或备份。" },
      { term: "Recovery capsule（恢复胶囊）", explanation: "由目标状态、窄用户文件、惰性 Codex 策略、世代 manifest 和恢复入口组成的笔记本重建包。" },
      { term: "Writer state（备份写入者状态）", explanation: "控制空白/未验新机何时可以开始覆盖性风险最低的后续备份；只有用户验收后才激活。" },
      { term: "Local rollback cache（本机回滚副本）", explanation: "与笔记本系统盘同故障域的快速回退材料，不能替代独立 USB 灾备。" },
      { term: "USB generation（USB 恢复世代）", explanation: "写入已绑定加密介质、经 exact-set/长度/SHA-256 验证后由 current 指向的完整版本。" },
      { term: "External NVMe takeover（原盘外置接管）", explanation: "把故障台式机的原 NVMe 接到笔记本，只作为数据与工作区来源，不从它启动或把笔记本改写成主机。" },
      { term: "DesktopDataRoot（原台式机数据根）", explanation: "外接后按现场得到的临时根，不把临时盘符固化回台式机 Registry。" },
      { term: "Heavy-runtime gate（重型运行能力门）", explanation: "在临时宿主上启动 GPU 模型/OCR/ASR 前重新检查内存、GPU、命令和资源路径，不继承台式机能力声明。" }
    ],
    boundaries: [
      "不把副驾驶账本变成跨主机全局规则，不从机器名称之外的猜测加载 C:\\Users\\wly 或 V:\\GitHub\\PCConfig",
      "不后台同步两台电脑的完整磁盘、AppData、任务、注册表、驱动、登录态或秘密",
      "不把 PCConfig Git checkout 或源码测试冒充笔记本当前服务、任务、BitLocker、WinRE、USB 或远控健康",
      "不把 ToDesk 当通用端口隧道，不为 7892 开 Funnel，不把 SSH/RDP 放宽到 LAN、公网、整个 tailnet 或公司网段",
      "只读检查不启动 WSL、Docker、服务、备份、重启或 USB 解锁；需要机器完整视野时使用现有管理员/SYSTEM 读取入口，再按实际用户补读用户级字段",
      "不让 restore_pending 或 restored_unaccepted 的新机运行备份，即使使用 -Force",
      "不把同盘 local cache 称为换机/丢盘备份，不在 USB 未绑定/未加密时写用户世代",
      "不整棵复制旧 Codex home 或迁移 auth、Cookie、Token、密码、设备密钥来跳过登录；历史对话、数据库与完整私有配置只走 codex-memory 一致性备份和隔离恢复，正文不进入网页或巡检上下文",
      "不热拷 WSL ext4.vhdx 或 Docker VHDX；不可再生内容只从停机/Owner-aware 导出恢复",
      "不从外置 GM7000 启动 Windows，不初始化、格式化、修复分区或重建 EFI/BCD",
      "不因临时盘符、笔记本硬件或任务变化更新 WLY 的 canonical Registry",
      "不假定 NVMe 硬盘盒已购入、兼容或验收，不假定笔记本可挂 ReFS VHDX 或解锁跨机 BitLocker"
    ],
    failures: [
      { condition: "在 WLY 或其他非目标主机调用健康入口", response: "返回 not_applicable/host_mismatch，只报告当前主机名；不读取或套用副驾驶路径和现场结论。" },
      { condition: "Tailscale、ToDesk 或 FlyingBird 不可用", response: "区分双机发现、远控和本地工作；不开放 LAN/公网、不切未登记代理，本地 Git/文档能力按实际继续。" },
      { condition: "台式机代理 7892 或 PostgreSQL 45432 不可达", response: "只暂停依赖它的代理或只读测试路径，不把笔记本整体判坏，也不新增公开端口。" },
      { condition: "BitLocker/WinRE 在普通会话不可读，或 SYSTEM 看不到用户级状态", response: "通过已有管理员/SYSTEM 入口补机器只读证据，用户字段回到实际登录会话；只标记真正未读取的字段，不能把权限视野差异写成未安装或故障。" },
      { condition: "恢复任务定义正确但 ACL 或信任链不可读", response: "保持 block/unknown，不把安装根看起来正常写成安全；不得启用任务。" },
      { condition: "恢复 U 盘未接入、未解锁或未绑定", response: "返回正常等待，不告警、不自动解锁、不推进 USB 成功时间；本地副本仍不升级为灾备。" },
      { condition: "新机数据已复制但尚未整体验收", response: "保持 restored_unaccepted 和任务 Disabled；继续验证服务、文件、登录、项目与防火墙，不能提前激活 writer。" },
      { condition: "胶囊 current、manifest、closure 或 payload 不一致", response: "停止恢复/激活，保留旧世代与来源；调用方声明的 generation id 或 digest 不能补齐真实证据。" },
      { condition: "V 盘无远端项目没有独立导出", response: "明确列为单机故障风险，选择 PRIVATE Git、加密导出或接受丢失；不声称胶囊或 PCConfig Git 已覆盖。" },
      { condition: "外接 NVMe 出现初始化/格式化提示或身份不清", response: "取消写入，只读核对磁盘、分区和锚点；无法确认就停止接管并保留原盘。" },
      { condition: "笔记本不满足重型 GPU 能力门", response: "LocalGpuBroker、模型、OCR/ASR 零启动；普通 Codex、Git 和文档继续，必要时使用已授权云能力。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\recovery\\副驾驶笔记本账本.md", role: "副驾驶角色、日常能力、网络边界、运行基线和 host-scoped 事实" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.secondary-laptop-health.md", role: "唯一健康 Provider 的检查 ID、证据双轴、正常例外与隐私边界" },
      { path: "E:\\PCConfig\\tools\\Get-SecondaryLaptopHealth.ps1", role: "副驾驶笔记本只读健康入口；主机不匹配时提前返回" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\README.md", role: "受保护安装、任务、writer 状态机、USB 世代和恢复命令合同" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\config\\desired.yaml", role: "副驾驶目标软件、WSL/Docker、启动、网络、数据和人工动作基线" },
      {"path": "E:\\PCConfig\\tools\\secondary-laptop-recovery\\scripts\\Manage-CodexDataBackup.ps1", "role": "副机Codex部署、原任务集成、hot/cold/安全云层及只读Status/Verify"},
      {"path": "E:\\PCConfig\\tools\\secondary-laptop-recovery\\scripts\\Test-CodexDataRestore.py", "role": "隔离恢复的SQLite、路径重映射及Codex旧任务读取验收"},
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\config\\settings.json", role: "恢复 profile、7 天周期、2 世代保留、本地根和三类用户文件范围" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\templates\\START_FOR_CODEX.md", role: "新机先冻结 writer、恢复预览、两阶段验收和激活顺序" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\templates\\CODEX_WEEKLY_AUDIT.md", role: "Luna Max 周检的可重建职责与无变化静默边界" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-recovery\\scripts\\Get-RecoveryReadiness.ps1", role: "任意新机路径与品牌的覆盖/漂移预检，不备份、不解锁、不代替强校验" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-access\\Deploy-SecondaryLaptopMcp.ps1", role: "副机共享服务准备、原路径依赖升级、回滚与 Check" },
      { path: "E:\\PCConfig\\tools\\secondary-laptop-access\\company_network_quick_start.md", role: "明确单个服务的按需接通、对端验收和精确撤销，当前未激活" },
      { path: "E:\\PCConfig\\docs\\recovery\\nvme_enclosure_takeover.md", role: "台式机非硬盘故障时的原 NVMe 外置接管与结束流程" },
      { path: "E:\\PCConfig\\docs\\recovery\\codex_login_10013.md", role: "副驾驶 localhost 1455 与动态端口范围的持久修复/复核边界" },
      { path: "E:\\PCConfig\\registries\\rdp_tailscale_exposure.json", role: "WLY 主工作站 RDP 的独立 Tailscale-only 对端、规则与保留入口" },
      { path: "E:\\PCConfig\\tools\\test_secondary_laptop_recovery.test.ps1", role: "恢复胶囊、writer、USB、ACL、任务和负例的离线回归" }
    ],
    verification: ["2026-09-09 21:48–21:54 UTC 经 secondary_laptop 真实回读：ComputerContext 确认目标规则与 SYSTEM/Session 0；普通 PowerShell 为 C:\\Users\\wly 用户，PS7.6.4；双机 Status/MaintenanceStatus 均通过。这取代旧 WLY host_mismatch 作为当前副机证据。","2026-09-12 04:27 UTC 只读副机 Status：installed=true、source_commit=c7e02a79b7922780eeae37a312d159319422c9ac、source_digest=match、ready；自然09:00任务result=0。对话本地与USB同point=20260912T010007Z-79c363c0，323文件/407005388 bytes，USB在场、cold_matches_hot=true；这是现存收据与安装源码核对，本轮没有重新全量散列。","同次现存安全配置收据为31文件/266762 bytes，2026-09-12 01:00:24Z完成，backup/secondary-laptop的local/remote OID均dcff123c91b40ab9f9c6ddc5b2a5eea809325011、fresh_remote_matches_head=true。各层各保留2点，本次观察不替代以后的云端或介质可用性。","2026-09-10 restore-validation.json既有隔离恢复收据pass：来源point=20260910T035042Z-acd75878，209份session文件、208索引路径重映射，隔离app-server列出139任务并读出指定任务12轮；未启动新轮次、未复制凭据、未输出私密正文，探针与物化副本已清理。整机换机、活动程序恢复与原盘接管仍分别未验。","2026-09-14只读副机原自动化与ProgramData模板：原任务ACTIVE、gpt-5.6-luna/max、周一07:15；账本10:00及原prompt的旧三路径约束尚与新模板冲突。Windows任务仍Ready/S4U/Highest、09:00/21:00；活动settings为7天、2代、writer_activated。只读取配置和任务元数据，未改自动化、未触发备份或新机恢复。","2026-09-12实际任务Ready，09:00/21:00触发、S4U/Highest、writer_activated、普通胶囊7天/2代；独立自动化“副电脑恢复胶囊每周语义巡检”为ACTIVE、gpt-5.6-luna/max、周一10:00。调度、自然备份和历史隔离恢复是三类独立证据。另发现旧周检模板仍只允许三条Funnel映射，与已授权六条冲突；来源Owner已将该口径修正为按正式账本、受保护运行时和relay登记逐项匹配，随21a0fbd发布；随后来源Owner已用既有维护入口原子安装该模板，SHA=f9bf21a3649eec0dafb15d2b379e0647b37d49129fa7dcea475d750a9ff6e3a1，15个manifest文件长度与hash全部通过；任务、服务、路由不变。d1dc393同时修复缺席USB被过早读取的问题，已安装脚本SHA=819feb8e8c8e035e3576c02e8e6ee2b476352d7681446c8d805f39efb6f75650，状态ready_usb_not_connected、source_digest=match、Readiness metadata_consistent且unknowns=[]；未重新运行副机备份。","2026-09-09 21:51:08Z SYSTEM 健康入口内置 Audit v2 完成：classification=NORMAL、needs_attention=false、local_integrity=pass、usb_integrity=pass、usb_state=connected；本地与 USB 同世代 20260910-042501-edddf4ec，CodexPolicy 各 3 项 complete。此次只读，没有触发备份或恢复。","既有最近本地成功时间为 2026-09-09T20:30:25.6890715Z，USB 为 20:35:15.601958Z；各回执确认 17998 文件、5655187424 bytes、sha256-size-presence-exact-set。Documents 仍有具名跳过，不能把这组有效载荷说成整个用户目录。","CodexRecovery-SecondaryLaptop 在2026-09-09历史观察中 Ready/enabled、S4U/Highest 隐藏链通过，最近自动运行 2026-09-09 21:00 +08:00、result=0，下次 9月10日09:00 +08:00；writerState=writer_activated、7天周期、保留2世代。任务最近运行时间与后来已有备份回执分别记录。","SYSTEM Health 原摘要为 15 pass/5 warn/0 block，含用户视野差异；21:54 UTC 用户会话补读 Ubuntu-24.04/WSL2、Docker 4.86.0.236216/AutoStart=false/无 com.docker.service、python/uv/mvn/psql 均可解析、代理启用。没有把补读拼装成一次新的全健康 PASS；AMD 交互浮层本轮未复核。","恢复源码固定 profileId=secondary-laptop、writerState 默认 restore_pending、backupIntervalDays=7、generationRetentionCount=2，dataSources 仅 Desktop/Documents/Downloads","健康合同覆盖 ToDesk/Tailscale/FlyingBird、精确防火墙、CodexRecovery-SecondaryLaptop、local/USB 世代、BitLocker/WinRE、WSL2/Docker、空间、工具与 Git；Provider 明确零网络、零写入","源账本与恢复模板已到远端 main=c93229716d0859246b1f2963bd4f60d8e63eb16c（2026-09-09 21:54 UTC ls-remote 回读）；副机 checkout 同提交且干净。源码、当前胶囊完整性、Luna 周检登记、新机恢复与物理冷启动分别验收。","原 GM7000 通过硬盘盒的真实识盘、持续读取、跨机 BitLocker、ReFS Dev Drive VHDX 挂载和重型能力尚未做端到端演练","9月15日副机账本与现场配置证明每周07:15及ProgramData入口收敛；9月18日13:00Z状态证明原恢复任务、本地对话和安全Git完成、USB未接。元数据/源码检查不替代全载荷hash或新机验收。"],
    relation: "机器事实模块保留主机身份与盘符事实，运行时模块解释单机软件/任务，普通恢复模块负责 WLY 主工作站重装链，秘密模块负责目标设备重新登录与 SecretRef；本模块独立拥有副驾驶产品角色、双机网络、笔记本恢复胶囊和原 NVMe 临时接管。它不复制这些模块，也不把笔记本变成第二个主工作站。",
    readerStatus: "最近记录显示笔记本本地备份和安全云副本正常，外接备份盘未连接；换机和外接主机原盘接管尚未实测。"
  },
  {
    slug: "secrets-providers",
    usageEntry: "在已接入 PCConfig 的 AI 对话中点名要查的凭据用途或固定 Google 动作；需要明文时由现有受保护界面处理。",
    usageInputs: ["精确账号或服务用途", "要查找、替换还是使用", "目标设备或远端对象"],
    productFlow: [
      {
        "title": "先找正确来源",
        "detail": "AI 只列安全的名称、用途与冲突，避免把同名账号或旧导入误认成当前值。"
      },
      {
        "title": "只向指定程序交付所需凭据",
        "detail": "目标与授权核对后，通过受保护的凭据引用或固定服务入口完成，不在聊天里显示秘密。"
      },
      {
        "title": "看效果和恢复线",
        "detail": "分别回读加密保存、消费者实际使用与恢复副本；网络失败或远端结果不明时不自动重复写入。"
      }
    ],
    shortTitle: "秘密与服务入口",
    title: "Password Center（密码中心）与固定 Google 服务入口",
    teaser: "从找对凭据、更新与恢复，到固定Google账号的邮件、云盘和任务操作，默认盲用秘密；日历在这条本机路线中冻结，结果各自回读。",
    status: "Password Center 综合桌面有已安装实用回读；当前安装 Inspect 提示两份 Registry 更新可用，固定 Workspace 远端实读本次未复核",
    statusTone: "mixed",
    searchAliases: ["让程序用密码但不显示", "凭据来源冲突怎么处理", "创建更新替换退役凭据", "Chrome密码完整CSV替换导入", "在密码中心同一窗口找账号、笔记和剪贴板", "更换验证因子", "PRIVATE Git跨机恢复密码中心", "盲填银行卡但不要提交", "固定Workspace账号怎样读写邮件云盘，为什么日历不可用", "Workspace写入超时能不能重试", "换电脑后能不能复制登录状态", "SecretRef怎样恢复"],
    searchProjection: {
      intents: ["查找和整理凭据", "处理来源冲突", "创建更新替换退役凭据", "完整CSV单向增量导入", "登记轮换撤销因子", "让程序使用凭据但不显示", "盲填银行卡但不提交", "在新设备恢复密码中心", "读写固定Workspace账号", "恢复 SecretRef"],
      entities: ["SecretRef", "Secret Broker", "Password Center", "source_id", "Recovery Set", "RecoverFromPrivateGit", "google-workspace.primary / v1.2.0", "Gmail / Drive / Tasks · Calendar冻结", "只读MCP和类型化CLI", "effect_unknown", "Browser Bridge", "CurrentUser DPAPI"],
      relations: ["来源发现不授权修改", "CSV缺失只待复核", "精确凭据变更更新恢复集", "一个PRIVATE Git载体加一个因子恢复新设备", "秘密绑定精确执行目标", "账号绑定限制Provider动作", "设备变化要求重新登录", "Browser Bridge只绑定唯一网页", "MCP只读不等于CLI没有写能力"],
      failureRecovery: ["冲突不覆盖或删除", "凭据不可用暂停对应动作", "scope不匹配不换账号", "网络失败不判凭据失效", "效果未知先回读不盲重放", "旧登录态不跨设备复制", "Reveal缺新鲜因子时零字段返回"]
    },
    value: "按用途找到正确账号，让点名的程序或网页在受保护入口使用它；AI 不需要看到密码明文。邮件和云盘写入另查实际远端结果，私人资料期限不由连接状态代替。",
    why: "同名账号可能保存在不同地方，旧导入少一项也不代表本人要删；网络出错更不等于密码错了。这里先找准来源和目标，再让指定程序或账号完成这一次动作。",
    example: "比如我说“打开密码中心，找出这个项目正在用的凭据，把我点名的旧项换掉，并确认以后换机还能恢复”。已安装桌面可先按类别和名称找条目；系统再核对来源与冲突，目标唯一且可写时才精确替换。加密写入、消费者实际试用与恢复集回读完成后才报告更新收口；任何一步不确定都保留原状态和具体缺口。",
    result: "查找只显示凭据名称、用途和来源；替换后再确认加密保存、目标程序能用，以及恢复材料跟上。邮件和云盘各查实际远端结果，写入是否成功不明时先回看目标，不重复发送。",
    readerStates: {
      "pass": "目标和来源唯一、授权成立，且保存、实际使用和恢复副本都核对后，才说这次变更完成。",
      "problem": "同名冲突、只读来源或目标账号不对时先停；远端写入结果不明时先查对象，不自动重发。",
      "unavailable": "本人验证、设备或服务入口不可用时保留原值并说明缺什么，绝不把密码改放聊天或日志。"
    },
    decisionImpact: [
      "日常在已安装的综合窗口选择密码库后，可按账号密码、API 密钥、银行卡、笔记、BitLocker 等类别找条目并办理准确的查看、编辑或删除；剪贴板页按完全相同的内容分组，显示实际复制次数，手机页查看已绑定设备状态。顶部个人资料与无限制授权各显示自己的剩余时间；是否需要本人因子仍由原正式入口决定。安装版已经实际开库、精确搜索和显示剪贴板，外观本人签收与长期自然使用另验。",
      "默认完成“使用秘密”，不默认 Reveal（显示明文）。",
      "我可以说“把这条密码复制到主机，让我粘贴到目标应用”。唯一目标与本次因子通过后打开遮盖面板；先粘贴、再关窗。取消、到期或复制失败会如实说明，复制到主机不代表另一台设备的剪贴板已收到。",
      "想找一条凭据时可按名称、用途、来源、账号、站点、项目和健康查询；Discover（发现）只读取安全元数据，并显示 Owner、可读/可写能力、冲突和最后验证。发现不到或来源临时离线都不是删除指令。",
      "需要新建、更新、替换或退役时，先让用户看清唯一目标和预期影响；候选经加密写入、回读、消费者试用、恢复集更新后才完成。任何一步失败都保留可回滚前像或明确部分完成，不能吞掉冲突。",
      "浏览器密码以本人明确选定的 Chrome 完整 CSV（逗号分隔导出文件）为来源，按网址与用户名保留唯一登录记录；明确全量替换时只替换 Browser Imports，其他类别保留。加密写入、回读和备份成功后才清理一次性明文文件。旧 Google 增量仅是兼容入口，不宣称浏览器密码实时双向同步。",
      "更换验证设备时，可以登记、轮换、撤销或重新绑定因子；Passkey（通行密钥）、TOTP（动态口令）、Recovery（恢复因子）、Account（账号因子）是四类，Google/Microsoft 只是 Account 的提供方。成功后旧会话/能力失效并回读，单次取消、超时或因子不可用只暂停当前动作。",
      "原电脑或 G 热盘不在时，完整、当前且验证通过的 PRIVATE Git Recovery Set 本身就是 Password Center 的独立恢复载体；一个有效因子可恢复到干净新设备，生成新密钥、登记新运行时并重新发布恢复集。它不是复制旧会话，也不需要所有介质同时在线；本页没有把就绪状态冒充真实新机演练。",
      "拿到登记的 G/H 载体时，可以直接说“从这份载体恢复密码中心”。入口先验证所选载体、版本和目标，再在本地取得有效因子，恢复缺失或前像一致的项并重绑新运行时。恢复回读前失败会回滚；回读后重新备份失败则保留已恢复结果、明确 partial，只重试该载体备份，不要求重新恢复或重复输入因子。",
      "AgentLogin（浏览器盲填）只匹配精确 tab、origin 和 frame；AgentSecretRef 只匹配登记 executable、参数目标或受控输入通道。",
      "固定 Workspace Provider 只有一个 binding，动作不能在运行时选择其他账号。",
      "2026-09-24 零网络 Status：Provider kind=pcconfig-google-workspace-direct、version=1.2.0、binding id=google-workspace.primary，Gmail/Drive/Tasks 为活动服务，Calendar 冻结；凭据状态文件存在，但 OAuth 授权、Tasks scope 和远端账号身份均未在本轮回读。",
      "比如“把这段大视频接着传到选定云盘文件夹，别重新建一份”，Drive从服务端确认的偏移续传，并核对最终SHA-256；“把选中的照片放进这个相册”，Photos核对本地文件哈希、逐项返回媒体和相册结果。断线或创建效果未知先查原操作，不把上传字节成功当成相册里已经有内容。",
      "Photos使用独立google-photos.primary绑定及自己的OAuth，Workspace已登录不能证明Photos已授权。它只读取/整理本应用创建的媒体与相册，不承诺全账号相册访问，没有删除媒体、删除相册、分享或原生归档入口。",
      "Gmail可查邮件、读取指定正文/附件、草稿、发送及精确标签；Drive可查/下载/导出/上传/更新/续传、目录移动和定向分享；Google Tasks 可按明确清单查任务、创建、更新、完成、移动或删除。due_date 是日期，不是假定几点截止。Calendar兼容实现被冻结。本轮零网络 Status 不证明 Tasks 已获 OAuth scope 或任一远端动作验收通过。",
      "MCP（模型上下文协议）只暴露十个读取工具，但同一 Provider 的 CLI（命令行入口）另有类型化写入。每个写动作必须明确对象和内容，-DryRun（只预演）可先零网络校验；-ActionAuthorizationConfirmed 表明本次写授权，破坏性动作还需 -Force。CLI 能写不等于只读 MCP 被授权代写。",
      "发邮件、分享文件或修改日程若超时，返回 effect_unknown（效果未知）表示“可能已经发生”，先用读取入口核对真实对象再处理，不自动重发、重邀或重删。",
      "OAuth enrollment（账号授权登记）只在前台进行一次，callback（回调）使用随机 loopback 端口与 PKCE（授权码保护）。",
      "换电脑、重装或从台式机切到副驾驶时，非秘密配置可以按新路径重建，但 DPAPI 状态、账号 session 和设备信任不跨机复制；目标设备必须重新登录或从正式 Recovery Set 恢复。",
      "Secret Broker 状态通过不证明每个外部网站、账号、网络请求或授权文件真实操作当前都成功。"
    ],
    problem: "凭据系统常见两个极端：要么所有自动化都能读明文，要么秘密封得太深，真实任务无法使用；通用网络入口还会把一个固定账号动作扩大成任意账号和任意请求。",
    implementation: [
  "运行时数据库、密钥包和恢复材料位于 Git 仓库外并加密；PCConfig source 只保存策略、SecretRef、无秘密 Registry 和测试。",
  "网站账号进入 E:\\Data\\PCConfig\\SecretBroker\\pcconfig-secrets.kdbx；API 与项目凭据仍由原 Owner 保存并通过稳定 SecretRef 使用。source_id（稳定来源标识）关联来源 Owner、写能力、去重键、冲突策略与回滚边界；Windows/浏览器受保护来源仍归各自 Provider，不因 Discover 得到候选就变成可写来源。",
  "Create/Update/Replace/Retire（创建/更新/替换/退役）是产品生命周期，不是四个任意自由命令；Invoke-SecretBroker 的具体入口包括 Set、Update、Swap、RetireSource 与 RetireCredential，按实际目标绑定 preimage（变更前像）和消费者。网络、超时、限流、服务端失败与确定性认证失败分开，只有后者才能改变凭据健康。",
  "浏览器密码现以本人选定的 Chrome 完整 CSV 为来源，按网址与用户名区分登录；明确全量替换只作用于 Browser Imports，Google 增量路径保留历史兼容。没有稳定逐条浏览器密码 API 或 changefeed；源文件只有在加密写入、回读和恢复集更新成功后才删除。",
  "Password Center 因子与设备信任、短会话和网络可用性分别判断；因子登记/轮换/撤销后必须回读新绑定、使旧会话与旧能力无效。因子不能覆盖完整性失败，四类全部丢失不能自行登记替代人类根。P1 测试保险库仅支持 Recovery 的现状由受保护数据模块单列，不能反推成密码中心只有一种因子。",
  "RecoverFromPrivateGit 从 Registry 固定的 PRIVATE remote / secret-broker-backup 分支 fresh clone（全新拉取），读取远端当前 Recovery Set manifest（恢复集清单），验证逐资产 SHA-256 与 epoch；仅补缺项或精确匹配 preimage 的项。一次有效因子解封后以自签名、runtime-bound（运行时绑定）的登记请求建立新设备/合格智能体，新私钥在新设备生成，旧运行时私钥不导出。",
  "PRIVATE Git 与 RegisteredCarrier 两条恢复入口都独立于旧 C Policy、Publisher、MajorAction 和 CoreGoal。RecoverRegisteredCarrier -Query <carrier_id> 直接准备版本化请求，InputPath 为高级替代且与 Query 互斥；旧 C 请求明确要求迁移。载体、当前版本与目标先预检，因子随后在本地核验，不要求空白新机预先有密码库。",
  "RegisteredCarrier 恢复可选择 Recovery、TotpQr、Passkey、Google 或 Microsoft；沿用原加密备份格式及历史版本。恢复本地回读完成前失败，恢复文件内容/存在性并维持私有 ACL（访问控制）；完成后 Recovery Set 再发布失败返回 partial，Backup -Query <carrier_id> 从受信设备重试该载体，不进入旧 C 发布链或全载体同步。",
  "AgentSecretRef 把 SecretRef 绑定到登记 executable、argv（参数）或 stdin（标准输入）目标；目标 hash、参数位置和调用方都必须匹配。",
  "Reveal 只允许用户明确点名的单个字段或一张原子银行卡记录，经唯一命中、受信设备、健康运行时和所需权限校验后在受控本地窗口显示；逐字段复制禁用剪贴板历史/云同步。每次实际写入从原授权期限内重新计时 1800 秒，普通关窗不提前清除，失效仍撤销本次复制；旧清理任务不得清除后来的同值复制。秘密不得进入模型、聊天、stdout、JSON、日志或普通文件；BitLocker 批量恢复查看仍是独立边界。",
  "Reveal -LocalDisplay -CopyOnly 复用同一字段授权与 DPAPI 交接，提供独立遮盖面板；个人入口“遮盖复制单条”走相同路径，不借用兼容 Copy 或 AgentCopy。浅色底、白色字段卡、绿色“复制到主机”按钮，成功后显示“再次复制”和“完成”，失败在原到期时间内可重试，Esc 关闭，高对比度服从系统配色。",
  "遮盖面板的控件只含固定遮盖文字，可由通用远控观察；原明文窗口仍排除捕获。值只进入短生命周期内部对象与受控主机剪贴板，禁历史/云同步；每次写入从实际复制起计 1800 秒，普通关窗不提前清理，明确授权失效仍撤销。host_clipboard_written/copy_count 只证明主机行为，remote_clipboard_confirmed=false 仍表示控制端未由机器确认；没有另一台 Codex/ChatGPT 直接接收秘密的通道。",
  "Secret Broker status 当前明确 plaintext_returned=false、key_project_touched=false、remote_fetch_performed=false，安全核心和 product closure（产品闭环）均 pass。",
  "当前唯一 optional gap 是外部密码管理器缺少逐条公开 API；它不会把核心状态改写为失败，也不会授权抓取浏览器数据库。",
  "Workspace credential state 使用 CurrentUser DPAPI；状态检查只看固定路径和文件存在性，不解密，2026-08-29 返回 configured、credential_state_present=true、credential_state_decrypted=false、zero_network=true。",
  "pcconfig-google-workspace-direct v1.2.0 固定使用google-workspace.primary；当前活动服务为Gmail、Drive和Google Tasks，Calendar冻结并从暴露工具中移除。MCP只读工具保留Gmail/Drive既有入口，并加入Tasks清单/任务读取；CLI 的TasksCreate/Update/Complete/Move/Delete按精确对象与授权执行。Status的zero_network=true、oauth_authorized=null、oauth_scope_attested=null，不能证明任务真实读写或当前登录。",
  "副驾驶普通胶囊排除密码、Token、Cookie、私钥、设备身份密钥、Codex登录态和raw config.toml，只保存[agents]两键投影；完整私有配置与历史由独立codex-memory恢复层保全，账号仍在目标机重新登录。",
  "Provider当前暴露Gmail（邮件）、Drive（云盘）与Google Tasks（任务）的closed action allowlist（固定操作清单），没有通用URL、HTTP method（请求方法）、body或账号透传；发送、删除、上传、分享与任务变更分别核对确切授权。",
  "Gmail 读取为 GmailSearch、GmailGetMessage、GmailGetThread、GmailGetAttachment、GmailListLabels；写入为 GmailSend、GmailDraftCreate、GmailDraftUpdate、GmailDraftSend、GmailDraftDelete、GmailTrash、GmailRestore、GmailDelete、GmailModifyLabels。正文默认不读，-IncludeBody 才取，单消息上限 256 KiB、单线程 1 MiB；附件按精确 attachment id 单独下载，归档是移除 INBOX 标签而非删除。",
  "Drive 读取为 DriveSearch、DriveGet、DriveListPermissions、DriveDownload、DriveExport、DriveAbout；写入为 DriveGenerateIds、DriveUpload、DriveUpdate、DriveCreateFolder、DriveMoveParents、DriveShare、DriveUnshare、DriveTrash、DriveRestore、DriveDelete。DriveAbout只给容量配额，预生成ID让未知创建按同一ID恢复，移动必须明确增删的父目录。普通文件走 files.get?alt=media；Google Docs 走 files.export，格式限定 txt/md/pdf/docx 与匹配扩展名，写本地输出使用同目录临时文件和原子提交，不获准 Overwrite（覆盖）就保留已存在目标。",
  "Google Tasks 读取为 TasksListTaskLists、TasksList、TasksGet；写入为 TasksCreate、TasksUpdate、TasksComplete、TasksMove、TasksDelete。列表使用精确清单ID和分页，due_date 是日期而非几点截止；Update 只 PATCH 明确提供的标题、备注或日期，Move 使用明确父任务/前序任务，不凭隐藏状态发明 Hide 写入。缺 tasks scope 时只 Tasks 动作要求重新授权，既有 Gmail/Drive 授权不因此作废。",
  "Calendar兼容源码仍保留原有独立邀请、ETag版本匹配、no-change不通知及起止校验，但当前整条本机Calendar路线冻结；这些历史实现不授权读取、创建、邀请、删除或测试日历。日历恢复须由本人明确提出该项目的新请求，不扩大成所有客户端日历能力不可用。",
  "DriveShare 只面向精确用户邮箱与 reader/commenter/writer（读取/评论/编辑）角色，返回 permission id 并通过 DriveListPermissions 回读；DriveUnshare 再按该 id 撤销。没有 anyone/public（任何人/公开）分享、所有权转移或任意权限载荷。邮件收件人、对象 id、标签、路径与日程范围都由各自类型化参数校验。",
  "固定HTTP超时90秒、响应上限67108864 bytes（64 MiB）；Gmail附件和Drive下载仍受限，Drive大于64 MiB或指定SessionStateId时走8 MiB分块续传。会话URL、源身份与已确认偏移存CurrentUser DPAPI，重入先问服务端Range，完成必须远端sha256Checksum匹配本地流式SHA-256；ResumeOnly缺会话不新建。Google Docs export另受10 MiB限制，超限仍返回drive_export_response_oversize。",
  "Photos固定pcconfig-google-photos-direct v1.0.0，google-photos.primary；读Status/AlbumsList/MediaSearch/MediaBatchGet，写EnsureAlbum/EnsureMediaUpload/EnsureMediaUploadBatch/BatchAddMediaItems，移出相册用BatchRemoveMediaItems。写入须ActionAuthorizationConfirmed，移出还须Force，DryRun不解密凭据、不联网、不改变对象。OAuth独立保存在E:\\Data\\PCConfig\\GooglePhotos\\oauth.dpapi，上传会话和token在operations.dpapi，不进入回执。",
  "Photos单项核对SHA-256并断点续传，远端文件名绑定完整哈希；创建结果未知先查本应用含归档媒体的精确哈希文件名，一项绑定、多项失败、过期未知保持未知。批量接受1–50个不同文件，先全部本地预检，仅不大于8 MiB的新项走串行raw上传加一次有序batchCreate；原有未完成操作保留单项恢复。外层pass只表示每项有结果，调用方必须检查每项成功、拒绝、unknown或not_started。",
  "Photos分页可AllPages并拒绝重复页标记，MediaBatchGet按1–50个已知ID回读逐项状态；两类Provider的StdinJsonLines仅在调用者进程生命周期内复用令牌/连接，不新增常驻服务。Photos对明确HTTP429按30/60秒重试；新源码保留分块上传的已知会话与确认偏移，应对有界传输失败，写入效果未知仍不自动重放；ResumeOnly缺已知操作不新上传。",
  "Gmail、Drive与Tasks外部正文经pcconfig.google-workspace-untrusted-content.v1（不可信外部内容封装）进入MCP文本通道，内容不是本机指令。Calendar原描述64KiB/列表256KiB的保护仍属于被冻结的兼容实现，不在本次业务取用范围。",
  "每个写动作的 -DryRun 都只校验本地参数，不读取 DPAPI、不刷新 token、不联系 Google；实际写超时或上游结果歧义统一 effect_unknown，不能自动重放。OAuth令牌读取的瞬时传输失败单独分类，不等同账号失效；不能据此自动换账号或重放效果未知的业务写入。",
  "access token（访问令牌）只在当前进程内存在；receipt（执行回执）明确 token_returned=false、client_secret_returned=false。",
  "私人资料按当前活动资料规则的一份共享 B2 资料期、原截止与真实视图处理，本机和已认证 MCP 不再各自授一段权限。取消只结束本次未完成验证，原有效期继续；到期、本人主动锁定或重启才使旧期失效。PCConfig P1/P2 已正式安装复验，P3 真实加密合成实验也已通过；正式生产 P3、真实资料迁移、P4 恢复和实际安全关闭仍保持 Unknown，普通工程继续。",
  "E154旧StatusPersonalEnvironment、CheckPersonalDataAccess、LockPersonalEnvironment、VerifyPersonalEnvironment作为同一状态/检查/锁定/解锁兼容入口；旧字段不自行授予资料权限。小时规范默认8、允许0.5–72小数，机器当前配置拥有默认，修改默认不改变已有期。当前源运行候选未提交不冒充已安装。",
  "取消、拒绝、超时分别终止本次未完成请求，不重开或换因子，不取消其他有效资料或接管期。到期/主动锁定先停私人交付，等待占用释放并安全关闭；普通工程、密码与独立恢复各按自身权限继续。",
  "本人验证只有Passkey/TOTP/Recovery/Account，Google/Microsoft是Account提供方。Passkey不是指纹/PIN的同义词；没有先锁屏再验证两次的资料流程。独立设备保护十分钟邀请不被普通资料取消重写。"
],
    flow: [
      "先区分请求是安全查找/来源整理、凭据与因子变更、使用 SecretRef、浏览器盲填、独立跨机恢复，还是执行固定账号动作；各路线不得静默合并",
      "凭据查找先返回安全元数据和冲突；精确变更或完整 CSV 导入再核对 source_id、写能力、目标、preimage 与恢复集，缺失项只待复核",
      "用固定 SecretRef、网页目标或 binding 定位精确 Owner 和动作",
      "先确认当前设备、用户身份、运行时和设备信任；设备变化时把旧 DPAPI/session 视为不可直接继承",
      "需要人类因子时冻结精确 action 与 target，由最高权限策略选择当前有效已登记因子",
      "SecretRef/Provider 分支只在受保护进程内解密或刷新短时凭据，再盲填、盲注入或执行类型化动作",
      "完成后回执只返回 action、状态和有界错误码，不返回凭据或 token",
      "明确复制时在遮盖面板完成主机复制并先粘贴，再关闭；核对复制次数、取消或到期结果，远端接收另凭实际控制端确认",
      "凭据变更完成前验证加密写入、消费者结果与恢复集；办公写入异常先回读指定远端对象，effect_unknown 不自动重放",
      "换机恢复时在目标设备重新登录；SecretRef、账号状态和普通 Vault 各走自己的恢复流程"
    ],
    concepts: [
      { term: "SecretRef（秘密引用标识）", explanation: "稳定指向一个秘密的名字；调用者使用它，不知道也不接收秘密值。" },
      { term: "Blind injection（盲注入）", explanation: "秘密直接进入登记程序的受控输入，不经过模型、终端、环境变量、日志或剪贴板。" },
      { term: "Binding（固定绑定）", explanation: "把 Provider、账号身份、scope、状态路径和端点固定在 Registry 中，动作不能临时换账号。" },
      { term: "OAuth（账号授权协议）", explanation: "用户在官方页面同意固定 scope，Provider 用授权码换取并安全保存 refresh token（刷新令牌）。" },
      { term: "PKCE（授权码保护）", explanation: "给一次 OAuth 流程绑定 code verifier（校验秘密），降低授权码被截获后复用的风险。" },
      { term: "Typed action（类型化动作）", explanation: "当前每个Gmail/Drive/Tasks操作都有固定参数，不能构造任意网络请求、换账号或借兼容实现调用被冻结Calendar。" },
      { term: "Source id（稳定来源标识）", explanation: "同一凭据来源的稳定身份；用它区分发现、只读 Provider、可写 Owner 与冲突，不靠显示名称或扫描是否命中作删除判断。" },
      { term: "Recovery Set（恢复集）", explanation: "完整加密资产、清单、哈希和代际形成的可验证闭包；Password Center 的当前 PRIVATE Git 完整恢复集可独立承担跨机恢复，代码仓库本身不等于数据恢复集。" },
      { term: "Effect unknown（效果未知）", explanation: "发出写请求后没得到可信终态；可能已经生效，必须先读取真实对象，不是可以自动重试的“没执行”。" },
      { term: "Device trust（设备信任）", explanation: "某项秘密是否允许在当前 Windows 身份与设备使用的独立事实；复制文件、管理员权限或旧登录态不能继承。" },
      { term: "google-workspace.primary", explanation: "PCConfig v1.2.0 唯一固定的 Workspace binding id；它绑定一个既定账号，但公开页不披露账号值。" }
    ],
    boundaries: [
      "不在仓库、模型上下文、stdout、JSON、日志或普通剪贴板保存秘密；单项本地 Reveal 的受控复制从每次实际写入起计 1800 秒，普通关窗不提前清除，授权失效仍撤销",
      "不把 Cookie、浏览器 profile、会话数据库或完整环境文件作为导入源",
      "Gmail、Drive与Tasks的元数据、正文及各写操作分别证明；Calendar当前冻结，保留历史实现不代表可以调用、启用或维护。本轮没有联网取邮件、文件或任务，不能宣称OAuth当前可用。",
      "不静默切换到另一个账号、公共 connector（连接器）或第三方 CLI",
      "不在两台电脑之间复制浏览器/Codex session、DPAPI 密文、Cookie、Token、私钥或设备身份密钥来跳过重新登录",
      "MCP 只读、CLI 类型化读写与远端实际验收分开；有写入口不等于已获本次写授权，也不等于当前远端可用",
      "响应/Gmail附件/Drive下载上限64 MiB，Google Docs导出另有10 MiB；Drive大文件仅走固定8 MiB分块续传，Photos仅走固定上传端点，不变成任意请求或账号入口",
      "发现不到来源、CSV 缺失、网络错误或凭据服务暂不可用都不能自动删除、退役或替换凭据",
      "验证码、CAPTCHA 和网站确认继续由用户完成"
    ],
    failures: [
      { condition: "Secret Broker 状态无法验证", response: "冻结秘密使用，返回 failed/partial 或精确 unavailable；不从旧回执或 Registry 推断可用。" },
      { condition: "Workspace binding 仅 configured", response: "当前零网络检查只证明固定配置与 state file 存在，不证明 OAuth scope、远端账号身份或某个动作可用。" },
      { condition: "换机后旧 credential state 文件存在", response: "不尝试从文件存在推断可解密或已登录；在目标设备重新 enrollment，或按 Secret Broker 的 RegisteredCarrier 与有效因子恢复。" },
      { condition: "网络错误、超时或限流", response: "报告 transport failure，不把凭据标成无效，也不自动更换账号或重复写操作。" },
      { condition: "来源冲突、只读来源或凭据目标不唯一", response: "只显示安全元数据和冲突，保留原凭据；取得精确可写对象后再进入变更，不用发现结果授权覆盖。" },
      { condition: "完整 CSV 缺少旧项或导入中断", response: "缺失项进入待复核而非删除；加密写入、回读与恢复集未完成前保留原导出文件，不把部分结果称为同步完成。" },
      { condition: "因子取消、超时或 provider 不可用", response: "暂停当前请求，保留原设备信任，不自动切换另一因子；撤销/轮换只有在新绑定和旧能力失效均回读后才完成。" },
      { condition: "PRIVATE Git 恢复集分叉、hash/epoch 不符或新设备绑定失败", response: "停止恢复并保留可回滚前像；不借缺失的 G 拼装半份恢复集、不恢复旧私钥，也不调用退役规则发布器补授权。" },
      { condition: "Workspace 写请求返回 effect_unknown", response: "先通过同一已支持Gmail/Drive/Tasks读取核实精确目标，未确定前不重发、重复分享或删除；Calendar冻结不提供重试通道，真实影响未知单列。" },
      { condition: "附件/文件超过 64 MiB，或 Docs 导出超过 10 MiB", response: "按传输或导出大小边界返回具体失败；Docs 的 drive_export_response_oversize 不是 scope 或权限错误，不换账号重试。" },
      { condition: "scope 多、少、重复或账号身份不符", response: "OAuth enrollment 在持久化前 fail closed，既有 enrolled record 不被重复导入覆盖。" },
      { condition: "Reveal 命中不唯一或缺少新鲜因子", response: "不返回任何字段，不降级为批量列表或侧路文件。" },
      { condition: "遮盖复制取消、到期、失败或远端未收到", response: "保留真实 outcome 与复制次数；有效期内可重试主机复制，过期重新发起。窗口启动、关闭或主机写入都不能冒充控制端已粘贴成功。" },
      { condition: "外部逐条凭据 API 不可用", response: "保留 optional gap；不抓浏览器数据库，也不把可发现元数据误作可写来源。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\registries\\secret_broker.json", role: "SecretRef、运行时和安全边界 Registry" },
      { path: "E:\\PCConfig\\registries\\secret_source_governance.json", role: "来源 Owner、Provider 保护存储分类、读写能力与发现不授权变更" },
      { path: "E:\\PCConfig\\registries\\google_workspace_provider.json", role: "固定 Workspace binding、scope、端点与无秘密元数据" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.secret-broker.md", role: "秘密使用、恢复、信任与零明文产品合同" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.password-center-m2.md", role: "Password Center 用户体验、SecretRef、银行卡盲填与产品域隔离合同" },
      { path: "E:\\PCConfig\\docs\\recovery\\password-center-m2-operations.md", role: "安全查找、完整 CSV、因子生命周期、G/H 与 PRIVATE Git 新设备恢复入口" },
      { path: "E:\\PCConfig\\tools\\Install-PasswordCenterIndependent.ps1", role: "独立密码中心安装态 Inspect（只读回读），不消费旧 C Policy" },
      { path: "E:\\PCConfig\\tools\\secret_broker.py", role: "凭据生命周期、恢复集与 action_recover_from_private_git 的实际实现" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.google-workspace-provider.md", role: "固定账号 Provider、OAuth 和类型化动作合同" },
      {"path": "E:\\PCConfig\\docs\\contracts\\pcconfig.google-photos-provider.md", "role": "独立Photos账号、应用创建内容范围、单项/批量上传和中断恢复合同"},
      {"path": "E:\\PCConfig\\registries\\google_photos_provider.json", "role": "Photos固定binding、v1.0.0、受管端点、8MiB分块与DPAPI位置"},
      {"path": "E:\\PCConfig\\tools\\Invoke-GooglePhotosProvider.ps1", "role": "Photos类型化读取/写入、ResumeOnly、DryRun与进程内JSONL入口"},
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1", role: "正式秘密代理与受保护入口" },
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.copy-panel.test.ps1", role: "遮盖面板、真实合成剪贴板、原明文窗口与安装入口的隔离回归；不读取生产秘密" },
      { path: "E:\\PCConfig\\tools\\Invoke-GoogleWorkspaceProvider.ps1", role: "当前Gmail/Drive/Tasks类型化分发与Calendar前置冻结拒绝" },
      { path: "E:\\PCConfig\\tools\\GoogleWorkspaceDirectProvider.psm1", role: "固定账号读写、输入范围、大小/超时、DryRun 与 effect_unknown 语义" },
      { path: "E:\\PCConfig\\tools\\Start-GoogleWorkspaceMcp.ps1", role: "十个只读 stdio MCP 工具的固定入口" }
    ],
    verification: [
  "Invoke-SecretBroker.ps1 -Action Status -Json 当前 exit 0、status=pass、security_core_status=pass、product_closure_status=pass",
  "同次 Secret Broker 回执为 0 critical failure、1 optional gap，并明确 plaintext_returned=false、remote_fetch_performed=false",
  "2026-09-24零网络 Status 返回 services=gmail/drive/tasks/calendar、active_services=gmail/drive/tasks、frozen_services=calendar、provider_version=1.2.0；凭据状态存在但OAuth授权、scope与远端账号身份均为null。本网页没有联网验证具体任务效果。",
  "Registry 精确绑定 provider kind=pcconfig-google-workspace-direct、version=1.2.0、binding=google-workspace.primary；MCP ListTools 只应返回当前登记的只读工具，本轮未用它冒充远端读取。",
  "binding status 明确 credential_state_decrypted=false；因此本页不把 configured 写成 OAuth 或 live API 验收",
  "本次内容补全只从稳定产品合同、来源 Registry 和入口源码还原查找、生命周期、CSV、因子与 RecoverFromPrivateGit；没有查询实际凭据、读取明文 CSV、举行因子仪式、执行恢复或发送任何 Google 写请求。",
  "2026-09-07 独立 Password Center Inspect 返回 current、9/9 current、manifest_anchor_matches=true、retired_c_policy_used=false、mutations_performed=false。secret_broker.py 源/安装 SHA-256 同为 b1f77a60612056f6a51a0079bd2bcb718063b87773de8f43419a5fe6360bce82；现有 10/10 恢复覆盖仍是历史证据，不冒充新设备实机恢复。",
  "2026-09-09 21:54 UTC当前独立安装为15/15 current、manifest_anchor_matches=true、plaintext_returned=false；Invoke-SecretBroker.ps1源/安装SHA-256同为953ae830bade54ddc8a81639c12180f95465c8fe65643f22fc1597e713bc7e2e，包含遮盖复制实现。本轮只读，没有使用真实密码、因子或剪贴板；隔离UI/复制测试与用户在具体远控通道的实际确认仍分别记录。",
  "secret_broker.test.py、secret_authority.test.py 与 secret_device_trust.test.py 覆盖授权、原子回读、恢复和负例",
  "61455ba 的 secret_broker.recovery.test.py 定义真实 KeePass/加密备份、DPAPI、卷身份、新运行时重绑、历史版本、前置拒绝、失败回滚和备份单独重试的隔离集成验证；硬件/账号响应可合成。本网页轮只读源码与安装态，不重新加密、恢复或举行因子交互，更不宣称另一台实机已经验收。",
  "invoke_google_workspace_provider.test.ps1 覆盖 closed action、大小边界、账号/scope 绑定、写入授权和无秘密回执",
  "2026-09-12核对已发布e8210b2及后续至fdd440b：Workspace新增Drive续传、容量/ID/目录动作与会话复用；Photos独立Provider及单项/批量恢复已有源码和模拟HTTP测试定义。本轮不解密OAuth、不上传、不创建云对象，当前dirty Photos工作不计入已发布能力；真实账号授权和各远端动作保持单独验收。",
  "本轮对照活动 E156 与 PCConfig 当前 main=b08e21f6：无限制授权入口、B2 P1/P2 共享生命周期和统一时长已完成正式安装复验；P3 真实加密合成实验已完成并清理，但真实私人资料、正式生产部署、P4 恢复与生产安全关闭仍未完成。没有读取凭据、邮件、私人原件或触发验证、资料解锁、锁屏或锁盘；规则、源码、安装、视图和关闭继续分别说明。"
],
    relation: "本模块覆盖凭据查找、来源、变更、因子、盲用和独立恢复，以及固定 Google 账号的具体读写。Password Center 的 PRIVATE Git Recovery Set 不等于普通文件库的代码仓库或 P5–P7 Carrier；授权文件的独立包状态机仍由下一模块说明，只复用既有最高权限因子选择，不共享数据根或密钥。",
    readerStatus: "凭据管理入口已有安装与使用证据；邮件和云盘本轮只核对连接配置，没有重新读取远端内容。正式资料迁移仍有未完成项。"
  },
  {
    slug: "authorization-files",
    usageEntry: "在已接入 PCConfig 的 AI 对话中点名文件，说明要加密、核验、恢复，或查看、修改某个加密包里的文本。查看编辑程序已安装，由现有入口打开本地窗口；这次网页核对没有代你操作真实文件。",
    usageInputs: ["明确选择的原文件或受保护文件", "想执行的动作与输出位置", "需要时的本人验证"],
    productFlow: [
      {
        "title": "核对选择和目标是否安全",
        "detail": "受保护入口只展开这次点名的文件，先拒绝链接、目标与来源重叠或已存在的不同内容。"
      },
      {
        "title": "在受保护入口办理",
        "detail": "先核对文件、输出位置和当前权限，需要时由本人验证。查看或修改时先确认完整加密包，再在本地窗口选一个 UTF-8 文本；正文只在该窗口显示，不交给 AI。其他文件可按明确要求恢复到指定目录。"
      },
      {
        "title": "核对结果",
        "detail": "加密和恢复后核对实际文件；编辑保存为另一份新加密包并重新校验，原包保留。取消、目标冲突或校验失败就说明未保存，关掉窗口不等于保存成功。"
      }
    ],
    shortTitle: "授权文件",
    title: "明确选择文件的加密、恢复与本地查看编辑",
    teaser: "只加密本次亲手选中的文件、目录和输出；中断后能续跑，恢复前先核验，遇到同名不同内容绝不覆盖，正文与密钥不交给模型。",
    status: "加密、恢复与本地文本查看编辑均有已发布源码；9月24日核对文件处理与窗口程序已安装且与源码一致，真实用户文件操作本轮未验",
    statusTone: "mixed",
    searchAliases: ["批量加密明确选择的文件", "加密到一半怎样继续", "校验授权文件包", "解密恢复但不覆盖已有文件", "文件被篡改后拒绝恢复", "授权文件不是Vault也不是SecretRef"],
    searchProjection: {
      intents: ["加密明确选择的文件或目录", "中断后继续文件加密", "验证加密包而不落地明文", "恢复到新目录且不覆盖冲突文件"],
      entities: ["Authorization File Broker", "SelectedPath / OutputPath", "AES-256-GCM", "domain / bundle / file key", "resume state / index.enc", "AuthorizationFileVerify / Decrypt"],
      relations: ["明确选择生成有界计划", "Password Center只提供因子而不合并文件域", "每文件每块独立认证", "来源与密文包默认都保留", "恢复冲突不覆盖"],
      failureRecovery: ["输入越界或含联接点时创建前拒绝", "中断复用已认证state续作", "来源变化只失败对应项", "密文索引篡改拒绝明文落地", "相同目标幂等跳过而不同内容停止"]
    },
    value: "只处理本人点名的文件，处理中断可按已有进度继续；恢复前先验副本，不覆盖已有不同内容。想看或改包内的一份文本，可以在本地窗口完成，并另存经过核验的新加密包。",
    why: "给明确选中的文件加密时，最怕中断后重头来、密文坏了直到恢复才发现，或把同名原件直接覆盖。这个入口只处理本次点名的路径，保存进度、核对文件，再在不伤原件的前提下恢复。",
    example: "我说：“只加密这个目录和这两个文件，输出到指定位置；中断后接着做，恢复时别盖掉已有文件。”系统先确认这些路径真的属于本次选择；文件读到一半改变或目标冲突就停下，已有原件保留。",
    result: "加密后得到可逐项核对的副本；恢复到指定位置时不覆盖不同内容；查看文本只在本地窗口呈现，编辑则得到一份重新验证的新加密包。程序已经安装，这次没有执行真人验证或读写你的实际文件，因此不替某次操作预报成功。",
    readerStates: {
      "pass": "本人点名的文件和输出经核对、加密副本完整时才报告完成；恢复后确认目标文件，编辑后确认新包保存与校验成功且原包保留。",
      "problem": "原文件变化、选择范围碰撞、密文损坏或恢复目标已有不同内容时，停在受影响文件并保留原件。",
      "unavailable": "受保护入口、本人验证或加密所需材料不可用时暂停动作，保留已有进度，不改借密码库的密钥。"
    },
    decisionImpact: [
      "只处理用户本次明确点名的路径和输出；不自动扫描 Downloads、Documents、整盘或仓库集合。",
      "来源文件和授权包默认都保留；删除、上传、同步、备份和迁移均是独立动作。",
      "既有最高权限策略选择已登记因子；文件域使用自己的随机 domain/bundle/file keys、session、index、receipt 和 recovery，不与凭据数据库、Key/Vault 或 P0–P7 合并。",
      "Source/Test、Install、Runtime、真实最高权限验证和自然用户 E2E 是五层独立证据；本次没有用前两层冒充后三层。",
      "比如“打开这个加密包里的说明让我看，把我改好的内容保存成另一份加密包”。先验证完整包和精确成员，再在同一受保护进程的本地窗口显示；取消不创建输出，编辑只保存到尚不存在的新目录，原包与未改成员保留。正文不进入AI、JSON、标准输出、明文临时文件或对外复制剪贴板。",
    ],
    problem: "解决明确选择被扩大、中断重做、来源版本混合、密文篡改、恢复覆盖冲突和文件域与凭据/Vault 混线。",
    implementation: [
      "受保护 Invoke-SecretBroker.ps1 暴露 AuthorizationFileEncrypt、AuthorizationFileVerify、AuthorizationFileDecrypt、AuthorizationFileView 和 AuthorizationFileEdit；Encrypt 只接收 SelectedPath/OutputPath，Verify 接收 InputPath，Decrypt 接收 InputPath/OutputPath。",
      "AuthorizationFileView接受InputPath及可选MemberPath；AuthorizationFileEdit另需不存在的新OutputPath。authorization_file_local_ui.py先验完整包与认证索引，再选择单一文本成员，严格UTF-8、可保留BOM、无NUL且最大64 MiB。目录包凭manifest识别，不靠.pcaf后缀猜格式；Vault单文件不适用。",
      "查看/编辑与已授权domain root在同进程内完成；本地Win32窗口禁止向外复制/剪切，允许用户粘入修改。保存只替换新副本内的选定成员，重验整包、解密回查修改哈希、原子提交新目录后再验证；失败清理本次候选，原包不替换。取消或保存结果只返回有界元数据，不返回明文或密钥。",
      "plan_explicit_inputs 有界展开明确路径，拒绝 symlink、junction/reparse point、特殊条目、输出位于来源内部和大小写折叠碰撞；默认上限 10000 文件、100 GiB。",
      "随机 256-bit domain root 下每包生成 bundle key、每文件生成 file key；AES-256-GCM 保护根封装、密钥、state、index 和默认 4 MiB 内容块，AAD 绑定 operation/item/chunk/length。",
      "每完成一个文件原子更新加密 resume state；全部完成后生成 index.enc、记录 index/object hashes 并删除 state。同一 selection digest 与 operation 可继续，completed 重入返回 already_complete。",
      "Verify 逐块解密到进程内重算长度/SHA-256而不物化明文；Decrypt 先核对象与 GCM tag，再写同目录临时文件并原子换入。相同大小/哈希目标记 already_restored，不同内容返回 restore_conflict。",
      "Recovery Set 只把域根 envelope 当 opaque asset 恢复；不自动上传、同步或备份密文包。复用现有运行库，不新增服务、数据库、daemon、任务或全盘扫描器。"
    ],
    flow: ["接收精确 SelectedPath/InputPath/OutputPath", "生成有界计划、选择指纹、数量和总字节", "冻结精确 action/target 并完成最高权限因子", "Encrypt 创建或打开独立域根并逐块写包", "中断时以认证 state 只续未完成项", "Verify 无明文落地校验", "Decrypt 完整通过后原子恢复且不覆盖冲突", "返回无正文/密钥的状态回执"],
    concepts: [
      { term: "Authorization file domain（授权文件域）", explanation: "只处理明确选择文件的独立产品域；复用最高权限授权，但不属于凭据、Key/Vault 或 P0–P7。" },
      { term: "Authorization file bundle（授权文件包）", explanation: "manifest、密钥封装、分块密文、加密索引和无正文回执组成的目录；来源默认不删。" },
      { term: "Resume state（续作状态）", explanation: "用包密钥认证加密的逐文件进度；中断后只继续未完成项，完整完成后删除。" },
      { term: "AES-GCM（带完整性校验的加密）", explanation: "每个密文块同时提供机密性和认证，块身份、序号和长度进入 AAD。" }
    ],
    boundaries: ["模型不读取、解析、摘要、分类或发送文件正文；明确授权的本地查看/编辑只在受保护进程中解释所选UTF-8文本", "不搜索未点名目录发现候选", "拒绝symlink/junction/reparse point和读取期间变化", "来源与包默认不删不上传不自动备份", "不同内容绝不覆盖", "与SecretRef/Key/Vault/P0–P7不共享根、session、index或recovery"],
    failures: [
      { condition: "输入为空、不可用、越界或含重解析点", response: "创建包前拒绝，不扩大选择、不跟随链接。" },
      { condition: "输出位于来源内部、路径碰撞或已有不匹配包", response: "返回精确 conflict，保留来源与输出。" },
      { condition: "加密中断", response: "保留 manifest、key envelope、已完成对象和加密 state；同一选择/operation 只续未完成项。" },
      { condition: "来源读取前后变化", response: "该项返回 source_changed，不把两个版本混成完成。" },
      { condition: "index、key envelope、object hash 或 GCM tag 被改动", response: "Verify/Decrypt 返回精确失败项，拒绝明文落地；partial 不升级整包 pass。" },
      { condition: "恢复目标已有不同内容", response: "返回 restore_conflict 并保留双方；只有大小和 SHA-256 均相同才记 already_restored。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\tools\\Invoke-SecretBroker.ps1", role: "AuthorizationFileEncrypt/Verify/Decrypt/View/Edit 受保护入口" },
      {"path": "E:\\PCConfig\\tools\\authorization_file_local_ui.py", "role": "同进程本地UTF-8查看编辑、64MiB边界、验证新加密副本与保留原包"},
      {"path": "E:\\PCConfig\\tools\\authorization_file_local_ui.test.py", "role": "本地查看编辑的取消、原包保留、二进制拒绝与Win32控件测试定义"},
      {"path": "E:\\PCConfig\\tools\\authorization_file_entry.test.py", "role": "最高权限入口及有界回执的合成测试定义"},
      { path: "E:\\PCConfig\\tools\\authorization_file_broker.py", role: "显式计划、AES-GCM 分块、resume/index/receipt、verify 与无覆盖恢复" },
      { path: "E:\\PCConfig\\tools\\authorization_file_broker.test.py", role: "独立域根、往返、中断续作、幂等恢复、篡改和来源变化合成测试" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.password-center-m2.md", role: "最高权限因子复用与授权文件/SecretRef/Key/Vault 域隔离" }
    ],
    verification: [
      "Source：authorization_file_broker.py 实现显式选择、4 MiB AES-256-GCM、独立 keys、加密 state/index、metadata-only receipt、verify 与无覆盖 decrypt。",
      "Test：2026-08-31 合成 temp 数据 6/6 PASS，覆盖空文件/同名叶子、中断续作、幂等恢复、篡改拒绝、来源变化和 output-inside-source。",
      "Install：2026-09-09 21:54 UTC Install-PasswordCenterIndependent Inspect为current、15/15 source=installed、manifest_anchor_matches=true；本文件source/installed SHA-256均为5eb7b3e59099ccde45804824d3edef03ced8abfab3ff8a3cbc1252db65123854。",
      "Install：2026-09-24 04:59 UTC的正式安装Inspect确认authorization_file_broker.py与authorization_file_local_ui.py均current=true、源与安装字节一致；整套安装750项中的两份Registry差异另列，不把局部安装一致写成全量current。",
      "Runtime/E2E：本次未消费最高权限因子、未打开独立域根或处理真实选择；Encrypt/Verify/Decrypt及View/Edit的自然用户端到端仍未在本轮实跑。38861a0已发布本地查看编辑源码，entry与UI测试定义覆盖取消、UTF-8/二进制边界、旧包保留、新副本回查和隐藏Win32控件；旧2026-09-09安装15/15保留为历史，新增UI安装由9月24日逐文件Inspect单独证明。"
    ],
    relation: "secrets-providers 只提供既有最高权限因子选择，不能读取文件正文或合并根；本模块独立拥有随机 keys、数据、session、index、receipt 和 recovery。CoreRecovery 只引用其恢复入口，Recovery Set 只恢复域根 envelope。",
    readerStatus: "选定文件加密、续作、恢复及包内文本查看编辑已有实现，文件处理和窗口程序已核对安装一致；真实用户文件操作和相应本人验证仍须在实际请求中验收。"
  },
  {
    slug: "protected-actions",
    searchAliases: ["PCConfig受保护动作", "PCConfig受保护操作", "本人验证与设备保护"],
    usageEntry: "在已接入 PCConfig 的本机 AI 对话中说明为什么被要求确认本人，或指出担心哪台电脑的资料需要保护；若确需本人验证，系统会给出可见邀请，由你亲自完成。",
    usageInputs: [
      "发生了什么，以及涉及哪台电脑或磁盘",
      "你现在能否使用已登记的本人验证方式",
      "如果电脑无法正常启动，手头是否有对应恢复材料"
    ],
    shortTitle: "本人验证与设备保护",
    title: "需要确认本人或保护电脑时，会发生什么",
    teaser: "需要核实操作者时，通过本人验证决定是否恢复设备信任；必要的独立磁盘保护分别核对目标、恢复材料、可见邀请和实际结果。",
    status: "代码和较早的安装检查表明这些入口已建立；本轮没有实际请本人验证、锁磁盘或重启。当前规则对普通与重大判断分两档，旧实现是否完全吻合仍待现场验收。",
    statusTone: "mixed",
    searchProjection: {
      "intents": [
        "系统要求确认本人时怎样验证",
        "设备不受信为什么暂停秘密使用",
        "十分钟从邀请可见还是不受信开始",
        "磁盘准备与实际锁卷重启有什么不同",
        "本人回来后怎样恢复正常启动和设备信任",
        "旧平台退役是否影响独立保护"
      ],
      "entities": [
        "本人验证",
        "设备信任",
        "ApplyProtectedJudgment",
        "RecoverDeviceTrust",
        "可见邀请",
        "BitLocker",
        "系统恢复启动",
        "正常TPM启动恢复",
        "历史Cpolicy退役"
      ],
      "relations": [
        "普通验证取消不自动锁盘",
        "可见邀请才起600秒",
        "准备系统恢复启动与到期数据卷锁定分别执行",
        "真实因子与回读才恢复设备信任",
        "旧会话不复活且数据卷解锁另验"
      ],
      "failureRecovery": [
        "因子/恢复覆盖/卷身份不成立只停相应动作",
        "执行中同启动不能假报取消",
        "正常启动恢复失败保留恢复依据",
        "源码和旧安装不冒充真人生产E2E"
      ]
    },
    value: "这项功能把“确认是本人”和“保护设备”分开处理。需要核实身份时，相关密码和秘密使用先暂停，本人通过已有方式完成验证；确实需要设备保护时，再按独立条件准备和执行磁盘保护。删仓库、重装系统等动作也要判断真实后果，但不会仅凭动作名称自动锁盘。",
    why: "本人需要知道为什么被要求验证、怎样继续，以及验证完成后究竟恢复了什么。删除数据和重装电脑可能无法撤销；设备保护又会改变下次开机和数据盘访问，所以判断、本人验证、实际执行与恢复必须分别说清楚。",
    example: "“系统要求确认是本人，我来完成验证；请告诉我现在能恢复什么。”AI会使用现有已登记方式，让本人实际操作并核对结果。若只是设备待验证，就确认设备与秘密使用是否恢复；若已经进入恢复启动，还要先用既有恢复材料回到系统，再办理设备恢复和正常启动设置回读，不能把所有层一并说成好了。",
    result: "拿到分层结果：本人验证是否成功、设备是否重新受信、秘密使用是否恢复、磁盘保护只是准备还是已经执行、正常启动是否恢复，以及数据盘还需怎样解锁。流程错误、取消或恢复材料不足都留下具体状态；不会返回秘密明文，也不会把“已准备”或“已请求重启”说成所有磁盘已经锁住。",
    readerStates: {
      "pass": "本人完成真实验证后，分别核对设备信任和秘密使用是否恢复。改过系统启动保护时，还要核对正常启动恢复；数据盘解锁不由一句“验证成功”代替。",
      "problem": "疑点、缺少授权或恢复条件，会让相关步骤暂停。需本人验证时使用真实可用入口；软件故障、人的取消与超时分别处理。",
      "unavailable": "指定验证方式、恢复材料、目标身份或执行入口不可用时，保留当前状态和恢复线索，只停止依赖它的部分。网页已写出流程，不代表当前安装的全部分支都已验收。"
    },
    decisionImpact: [
      "现行规则E170分别处理Windows锁屏、共享资料期、本人接管、设备信任与独立磁盘保护；任何一个成功都不自动授予另一个权限。",
      "ApplyProtectedJudgment核验已登记codex-root、宿主真实Astra High+判断、精确设备/目标、授权epoch、签名与nonce。型号资格不等于principal或effect授权，普通MCP和管理员令牌不继承。",
      "b08e21f6的enter_untrusted仅设awaiting_invitation和空deadline；prepare_verification_invitation只绑定准备事件。begin_verification_invitation才以invitation_visible_utc+600秒生成deadline，并保留同一事件的幂等性。",
      "只要求本人验证且未选择containment时，状态可为verification_pending；恢复覆盖不足为blocked_recovery_coverage，不因此自动加密或执行磁盘动作。",
      "已发布Host准备阶段仅接受既定C:系统卷及Tpm+RecoveryPassword保护器组合；manage-bde -forcerecovery移除正常TPM启动路径并保留恢复密码，回读后才armed。不能写成完全不改变任何保护器。",
      "执行阶段只在已核准事件与到期条件下继续；对符合条件的数据卷Write-VolumeCache、Disable-BitLockerAutoUnlock和Lock-BitLocker -ForceDismount，系统卷通过恢复启动处理。不会自动新增加密或更改恢复密码。",
      "请求shutdown /r /t 0 /f之后仍为executing、awaiting-recovery-boot、system_volume_locked=false；后续启动证据与终态完成必须回读，不从命令返回零推定整机保护已完成。",
      "正式取消绑定新的信任epoch、事件、设备和恢复证明。系统保护已armed时恢复TpmProtector并核对；同启动的executing拒绝在线取消，已进入新启动先收稳终态再恢复正常启动。",
      "E170要求日常只核所选可用方式，维护变化才做生产等价验收；真实软件故障修复并重新呈现邀请后给完整窗口，不延长已有授权。b08旧实现注释仍提四路ready，end_invitation_fault只补故障经过秒数；本轮未证明当前安装已与新规范完全一致。",
      "旧Cpolicy退役、38项依赖、6个任务与Codex Home迁移是历史技术事实；不能代替此独立本人验证/设备/磁盘保护链的说明或验收。"
    ],
    problem: "避免在身份待核实期间继续提供秘密，或把邀请、设备受信、资料解锁、磁盘准备、锁卷、重启请求和恢复成功混成一个状态；同时保留本人可以实际返回正常使用的独立恢复路径。",
    implementation: [
      "所读b08e21f6的ApplyProtectedJudgment是旧未分档接口，核验已登记codex-root、真实Astra High+、精确设备/目标、授权epoch、签名与nonce。E170另定义常规Sol High+与升级Astra High+；不能从新规范推出这个旧安装接口已支持两档。型号资格与principal、effect授权仍分开。",
      "保护判断输入保留adapter_id、host_event、artifact_id/artifact_sha256及judgment；真实assistant-message或tool-call证据与既有运行时签名、nonce、设备和授权epoch共同核验。秘密暂停和旧能力撤销不能由脚本关键词代替合格判断。",
      "enter_untrusted接受first_untrusted_utc只为旧调用兼容，不启动deadline；awaiting_invitation、preparation、visible invitation与containment_requested分开。visible事件匹配后，deadline固定为可见时刻加十分钟。",
      "bitlocker_containment_authorization.py对准备/执行、邀请更新和取消使用分离的签名请求，核对精确设备、事件/epoch、目标卷与恢复覆盖；旧请求不能跨事件、跨设备或重放成新能力。",
      "Invoke-PrepareContainment复核唯一C:系统卷、稳定身份、Protection On及受支持Tpm/RecoveryPassword组合，执行manage-bde -forcerecovery C:后确认TPM路径已移除、恢复保护器仍在，再提交armed。中断重入依prepare_started及真实回读处理。",
      "Invoke-ExecuteContainment重新核对managed_volumes与执行journal；先锁Windows会话，再逐数据卷刷新缓存、停用自动解锁并ForceDismount锁卷。已处理卷按稳定ID记录，保护已停用的非系统卷不在这里重新启用或加密。",
      "执行器请求一次快速强制重启，journal保留执行boot ID、逐卷结果与重启尝试；恢复启动前仍报告awaiting-recovery-boot，重启重试有上限。Complete-TerminalBeforeBitLockerEnumeration先依据新启动完成终态，避免后续枚举或恢复把旧执行重复做一遍。",
      "Invoke-CancelContainment消费有效的新epoch取消请求；必要时Add-BitLockerKeyProtector -TpmProtector，并确认恰好一个正常TPM启动保护器且恢复密码仍可核对，才complete-cancellation。这个函数不负责数据卷解锁或重新启用auto-unlock。",
      "软件故障期间状态保留fault_event_id并阻止正常执行推进；b08 end_invitation_fault将实际故障经过秒数加到旧deadline。现行E170的重新完整邀请窗口是规范要求，当前安装实现是否已满足仍需其Owner验收，不能从本次静态阅读推定。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：独立密码中心当前安装15个文件，包括secret_device_trust.py、bitlocker_containment_authorization.py、Invoke-BitLockerContainmentHost.ps1、Get-BitLockerRecoveryCoverage.ps1与secret_source_governance.json；2026-09-09 21:54 UTC Inspect为current、15/15同哈希、manifest_anchor_matches=true、mutations_performed=false。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：PCConfig Governance Check（机器治理检查）现有每周入口已增加 BitLocker 实际密钥材料核验和 PRIVATE 远端恢复备份新鲜度检查；只返回零秘密状态，不以保护器 ID 对得上替代密钥内容正确。该源码更新不是本次重新触发真实恢复或保护流程。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：registries/protected_policy_retirement.json 是退役结构化事实源；E 盘 PCConfig 的 Get-ProtectedPolicyAuthorityStatus.ps1 返回 retired 摘要。旧 C 历史目录里的同名入口不是当前 Owner。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：现行protected_policy_retirement登记38个source dependency，状态入口为retired、mutations_performed=false。当时修复前曾返回protected_policy_retirement_dependency_classification_invalid；纠正现有分类并补登遗漏测试后，官方管理员验收通过，没有放宽校验器或改变独立产品。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：机器收敛回执证明旧任务 absent、无匹配 service/worker，P0 boot recovery、Password Center 和 BitLocker 未改。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：旧 C policy tree、generation 79 和 ledgers 没有物理删除，仍可作为恢复/审计材料。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：Codex Home 历史迁移曾以 staging、最终增量、ACL/链接 manifest、原子切换、C 兼容 junction 与 rollback 闭合；当前 E 是唯一运行根，C junction 精确指向 E。4d17554 已删除五个迁移脚本/测试，当前没有该事务入口。",
      "历史机器/退役记录（沿原观察，不代表本轮新验）：E rules 的 current/previous、UAC activation 和 Rules 页面由 .agents 拥有，不再由 PCConfig 安装或发布。",
      "历史退役取证流程（不是普通使用步骤）：从 E 盘 PCConfig Owner 读取 protected-policy retirement Registry 与 status=retired；核对当前38个source/machine dependency（源码/机器依赖）的去向分类；当时修正一处已有分类名并补入遗漏的既有文档测试，没有放宽校验器或恢复旧平台；确认 6 个退役任务在 Task Scheduler 中 absent；确认无匹配旧 service、worker 或可执行 Publisher 路径；核对 Secret Broker、Password Center、BitLocker、P0–P7 未被改变；遇到新机器动作时定位其具名 Owner、精确授权、preimage、rollback 与 read-back；没有专用入口就停止，不回退旧 CoreGoal；保留历史 tree、generation 79 和 ledgers，不恢复生产读者；以后每次漂移检查继续验证退役不反弹"
    ],
    flow: [
      "验证同一设备的合格判断、principal、授权epoch及请求签名；需要保护时暂停秘密使用并使旧会话/能力失效。",
      "新设备hold进入awaiting_invitation；准备事件固定event ID，不计时，不从first_untrusted_utc派生期限。",
      "ConfirmVerificationInvitation证明邀请真实可见后绑定600秒期限；verification-only与containment_requested分支分开，缺恢复覆盖只阻断磁盘准备。",
      "固定Host Prepare核对系统卷、恢复保护器及受支持启动方式，设置下次恢复启动并真实回读后armed。",
      "期限与事件仍有效才进入Execute；按journal和当前卷身份执行数据卷关闭及重启请求，保留部分完成与失败状态。",
      "新boot ID形成后先完成终态，不在旧执行中重复枚举或重启；系统卷状态由恢复启动证据单独证明。",
      "有效本人恢复/取消请求使用新信任epoch；必要时恢复TPM正常启动并回读后cancelled，数据卷解锁与自动解锁另行处理。",
      "普通验证取消、真实故障补时、资料期、本人接管及独立保护各自保留状态，不互相复活或延长。"
    ],
    concepts: [
      {
        "term": "本人验证",
        "explanation": "由本人实际使用一种已登记方式提供证明；打开窗口、模型确信或管理员权限都不是验证成功。"
      },
      {
        "term": "设备信任与秘密暂停",
        "explanation": "设备是否允许继续使用秘密，与服务在线、Windows桌面锁屏或普通资料解锁不同；恢复需要正式证明与状态回读。"
      },
      {
        "term": "可见邀请起点",
        "explanation": "可核对邀请真正显示给本人后才开始十分钟，准备和首次不受信标记不提前计时。"
      },
      {
        "term": "恢复启动准备",
        "explanation": "让系统盘下一次开机需要已有恢复材料；它会改变正常TPM启动路径，却不表示正在运行的系统盘已经锁住。"
      },
      {
        "term": "正常启动恢复",
        "explanation": "在适用恢复事务中重新建立并核对TPM启动方式；不等于数据盘已经解锁或所有权限恢复。"
      },
      {
        "term": "历史参考：Protected policy retirement（规则平台退役）",
        "explanation": "旧 C 盘规则生产读者、Publisher、consumer、任务和 worker 退出，历史材料保留。"
      },
      {
        "term": "历史参考：Frozen historical compatibility（冻结历史兼容）",
        "explanation": "数据结构仍可读取旧记录，但禁止创建新 goal/step 或执行旧 consumer。"
      },
      {
        "term": "历史参考：Retirement override（退役覆盖）",
        "explanation": "对旧 Registry 历史字段施加现行禁止语义，避免历史 production_enabled 被误执行。"
      },
      {
        "term": "历史参考：Independent product（独立产品）",
        "explanation": "Secret Broker、BitLocker、P0 等有自己的 Owner、状态和验收，不由规则退役连带删除。"
      },
      {
        "term": "历史参考：Specific machine action（具名机器动作）",
        "explanation": "只有一个明确目标、专用执行入口、preimage、回滚和回读的机器变更；管理员权限本身不创造通用动作授权。"
      }
    ],
    boundaries: [
      "只管理当前明确登记、身份稳定且恢复材料覆盖成立的受保护卷，不自动加密新卷或创造恢复密码。",
      "本人验证、普通资料解锁、Windows锁屏与无限制授权相互独立；取消一条普通验证不自动触发盘锁或撤回其他有效期。",
      "准备和执行是不同现实效果；强制卸载与重启会中断应用，网页说明不能代替本人在场、合格授权或真实恢复。",
      "只恢复系统TPM正常启动不等于解锁数据卷或重启自动解锁；已有明文交付也不能追回。",
      "所需入口或恢复依据不足时停在该层；普通工程和无关可逆工作继续，不造通用管理员执行器。",
      "历史及独立产品边界：不提供通用 shell、任意管理员执行器、第二规则系统、第二队列或后台守护服务",
      "历史及独立产品边界：智能体名称、提示词、管理员权限令牌或复制密钥不能继承最高权限身份",
      "历史及独立产品边界：紧急授权不覆盖 system/developer/platform，不伪造密码学或外部事实，也不补足缺失 Carrier/因子",
      "历史及独立产品边界：活动规则发布、受保护机器动作和 P0 各自拥有执行与账本，CoreGoal 不内嵌它们",
      "历史及独立产品边界：不因旧平台退役就删除手工 BitLocker 恢复、Secret Broker、Password Center 或 P0 boot recovery；已完成且无当前消费者的迁移工具应退役",
      "历史及独立产品边界：source test、registry 状态或 P0 health 不能单独证明两个真实 consumer 的 effect",
      "历史及独立产品边界：未提交 source 和 concurrent dirty work 不计入 installed current"
    ],
    failures: [
      {
        "condition": "邀请还没真实显示或事件对不上",
        "response": "保持待邀请/失败状态，不从首次不受信标记开始倒计时，也不拿重连伪造新事件。"
      },
      {
        "condition": "所选因子或邀请软件故障",
        "response": "按现行规则修复指定路径，区分人的取消/超时；原授权不延长。当前机器的故障窗口实现未由本页重新验收。"
      },
      {
        "condition": "恢复材料缺失、目标卷变化或系统启动保护方式不受支持",
        "response": "阻断对应磁盘准备/执行并保留秘密暂停及恢复入口，不修改成另一种保护方式来凑通过。"
      },
      {
        "condition": "本人取消验证页面",
        "response": "只结束该验证请求，不假报设备已受信或磁盘准备已撤销；恢复/撤销走自己的有效证明和回读。"
      },
      {
        "condition": "执行或重启请求失败",
        "response": "保留journal中的已发生动作和未完成项；不把部分卷处理、一次退出码或准备态当成整机保护完成。"
      },
      {
        "condition": "已经executing且仍在同一次启动中请求取消",
        "response": "不能在线假装回到未执行；先按现有恢复启动路线回到可恢复状态，再核对终态和正式取消。"
      },
      {
        "condition": "正常TPM启动恢复回读失败",
        "response": "保持cancelling或明确失败，不清掉恢复依据、不报告正常启动已恢复。"
      },
      {
        "condition": "历史退役/迁移核查：任一退役任务重新出现",
        "response": "retirement acceptance 失败，停止旧路线并由 PCConfig Owner 删除/禁用后回读。"
      },
      {
        "condition": "历史退役/迁移核查：E 盘退役 Owner 返回 active/candidate",
        "response": "视为退役回归，必须恢复固定 retired 输出，不能把 C 链当当前 authority。"
      },
      {
        "condition": "历史退役/迁移核查：旧 C 历史入口返回 integrity failure",
        "response": "如实显示旧入口的 global-shim-invalid，但不把它升级成 E rules 或普通任务 blocker，也不尝试恢复旧 Publisher。"
      },
      {
        "condition": "历史退役/迁移核查：Secret Broker 或 BitLocker 被退役误伤",
        "response": "回滚对应 PCConfig 变更并恢复独立产品，不恢复旧 policy runtime。"
      },
      {
        "condition": "历史退役/迁移核查：当前机器动作没有专用 Owner 或回滚入口",
        "response": "保持未执行并报告缺口；不调用旧 CoreGoal、Publisher、任意管理员命令或旁路任务。"
      },
      {
        "condition": "历史退役/迁移核查：未来再次提出 Codex Home 迁移",
        "response": "不得调用已退役脚本；先建立新的具名目标、Owner、preimage、停写边界、回滚和验收，再决定是否实现。"
      },
      {
        "condition": "历史退役/迁移核查：物理历史材料缺失",
        "response": "报告恢复证据损失；不能为补材料重新启用 Publisher 或 consumer。"
      }
    ],
    sources: [
      {
        "path": "E:\\PCConfig\\docs\\contracts\\pcconfig.secret-broker.md",
        "role": "已发布b08e21f6第96–108行：设备信任、验证邀请、独立磁盘保护与恢复边界；旧资料期口径不覆盖E170"
      },
      {
        "path": "E:\\PCConfig\\tools\\secret_device_trust.py",
        "role": "已发布b08e21f6：awaiting_invitation、可见邀请600秒、故障补时与取消状态机"
      },
      {
        "path": "E:\\PCConfig\\tools\\bitlocker_containment_authorization.py",
        "role": "已发布b08e21f6：事件、设备、恢复覆盖与准备/执行/取消签名请求"
      },
      {
        "path": "E:\\PCConfig\\tools\\Invoke-BitLockerContainmentHost.ps1",
        "role": "已发布b08e21f6：619准备、790执行、909锁数据卷、929重启请求、1005取消和1094回读"
      },
      {
        "path": "E:\\.agents\\releases\\E170\\docs\\contracts\\agents.protected-actions.md",
        "role": "当前规范：判断资格、所选因子、可见邀请、软件故障窗口和独立产品边界"
      },
      {
        "path": "E:\\PCConfig\\registries\\protected_policy_retirement.json",
        "role": "历史退役依据：退役对象、保留对象、状态入口和验收规则"
      },
      {
        "path": "E:\\PCConfig\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1",
        "role": "历史退役依据：固定 retired 状态入口"
      },
      {
        "path": "E:\\PCConfig\\tools\\Test-ProtectedPolicyRetirement.ps1",
        "role": "历史退役依据：依赖、任务缺席、独立产品保留和零 mutation 验收"
      },
      {
        "path": "E:\\PCConfig\\registries\\core_goal_v2.json",
        "role": "历史退役依据：frozen historical compatibility 与 inactive policy consumer"
      },
      {
        "path": "E:\\PCConfig\\registries\\bitlocker_containment.json",
        "role": "历史退役依据：旧 policy coupling 的 effective retirement override"
      },
      {
        "path": "E:\\GitHub总索引\\docs\\contracts\\git.protected-major-actions.md",
        "role": "Git重大动作、五种语义结果、本人因子与实际Git效果的边界；Git适配器不自行改变设备信任或触发磁盘保护"
      }
    ],
    verification: [
      "本轮仅git show已发布b08e21f6与读取E170规范，核对代码和公开安全合同；没有读PCConfig dirty候选，没有调用本人因子、锁屏/锁盘、备份、重启或恢复。",
      "b08源码中的可见邀请起点已核实；四路ready/故障补时等旧实现与E170规范分别陈述，未确认当前安装是否已完整更新。",
      "保留的历史证据（不作本轮保护E2E）：E 盘 PCConfig Get-ProtectedPolicyAuthorityStatus 当前返回 retired、production_activation=false、reason=protected_policy_retired、historical_state_preserved=true",
      "保留的历史证据（不作本轮保护E2E）：旧 C 盘历史 Provider 原入口当前返回 active_integrity_failure / global-shim-invalid；按现行 E 规则合同它不是权威、准入、fallback 或 Owner 证明",
      "保留的历史证据（不作本轮保护E2E）：2026-09-08当时必要修复33fc459将安装器归入现有independent_product_only，并补登既有文档边界测试为negative_dependency_test_only；官方管理员Test-ProtectedPolicyRetirement返回PASS、38依赖/6退役任务，文档回归4/4通过。未扩校验器、执行安装、修改BitLocker或重启保护平台",
      "保留的历史证据（不作本轮保护E2E）：机器收敛回执证明 6 个目标任务 absent、无匹配 service/worker，P0 boot recovery、Password Center 和 BitLocker 未改",
      "保留的历史证据（不作本轮保护E2E）：2026-09-01原源码观察为3fae514305862a0eafefdcbedb233436094c3efe，彼时main/origin一致且clean；当时截止与必要修复提交见本页当前快照。4d17554 已退役完成使命的迁移工具；当时只读回读确认 C:\\Users\\10979\\.codex LinkType=Junction、Target=E:\\Data\\AppData\\Codex，且 E 目标存在。",
      "保留的历史证据（不作本轮保护E2E）：PersonalDataReplica-Hot-Daily 已存在、启用、Ready，最近结果 0；最新 personal-data.replica-receipt.v1 于 2026-08-31 16:25:27（本机时间）回读五个映射均 complete/post_verified=true、copy/extra=0、errors=0、payload_content_read=false。"
    ],
    relation: "本模块说明本人验证、设备信任、秘密暂停与独立磁盘保护/取消。密码中心日常凭据、普通资料期、本人接管、P0–P7加密数据恢复和规则发布各自负责；旧Cpolicy退役仅是这里保留的技术史，不是当前产品主体。",
    readerStatus: "这次页面只说明现有流程和证据。本人验证、设备保护、磁盘动作及恢复各要以当时真实界面和机器结果为准；当前规则的两档模型资格不能由旧安装记录代证。",
    productFlow: [
      {
        "title": "先看为什么要确认",
        "detail": "AI 说明哪项资料或设备操作暂时不能继续，以及原因；普通网络故障、程序报错或取消一次验证，不会自行变成“电脑不可信”。"
      },
      {
        "title": "由合格 AI 判断后果",
        "detail": "AI 先核对这次动作会改变什么、还能否恢复。普通受保护判断至少由 GPT-6 Sol High 完成；涉及重大不可逆后果，尤其设备与磁盘保护的最终决定，至少由 GPT-6 Astra High 完成。型号资格由运行系统核实，判断也不代替本人授权。"
      },
      {
        "title": "本人看见邀请并亲自验证",
        "detail": "确实需要时，屏幕显示要确认的事和现有验证方式；你选择已登记方式完成。十分钟从这次邀请真实可见时算起，软件故障、本人取消与超时分别记录。"
      },
      {
        "title": "保护磁盘前先确认找得回来",
        "detail": "若判断需要进一步保护，系统先告诉你针对哪块磁盘、恢复材料是否可靠，以及下次启动可能进入什么画面。准备系统盘恢复启动与真正锁定数据盘是不同动作。"
      },
      {
        "title": "只有条件仍成立才执行",
        "detail": "邀请期限届满且仍需保护时，系统重新核对目标，可能锁定 Windows 会话、锁住适用的数据盘并请求重启。每一项都要看真实结果；请求重启不等于电脑已经重新启动。"
      },
      {
        "title": "本人回来后逐项恢复",
        "detail": "按正式恢复方式重新进入电脑，再分别检查设备是否重新受信、秘密能否使用、数据盘是否可读、下次开机是否回到正常路线；一项恢复不自动完成其他项。"
      },
      {
        "title": "取消和未完成项明白写出",
        "detail": "取消一次邀请只结束那次请求，不自动解除已经执行的磁盘保护，也不延长其他资料或接管期限；系统列出还需要你做什么。"
      }
    ],
    productSections: [
      {
        "title": "谁来判断：合格不是只看一个角色名",
        "paragraphs": [
          "常规判断可由 GPT-6 Sol High 或更高思考档位完成，GPT-6 Astra High 及以上也可以。若当前主任务本身已具备相应资格，就可以自己判断，不必每一步再派一个子代理。",
          "改变授权或信任根、增删或替换关键密钥与验证方式、不可逆地丢失唯一数据、向新接收方交出不可追回的高敏感资料，以及设备和磁盘保护的最终决定，都必须由 GPT-6 Astra High 及以上判断。即使 Sol 没有疑虑，实际后果达到这些条件也要升级。与当前授权、目标或重大后果有关的实质疑点，同样需要升级。",
          "资格必须由运行系统证明真实型号和思考档位。叫“合格子代理”、模型自称够格，或者只是管理员，都不算证明。目前登记的最高权限主体是 codex-root；模型判断合格仍不等于获准执行任意动作。"
        ]
      },
      {
        "title": "常见动作分别会怎样处理",
        "cases": [
          {
            "situation": "删除 GitHub 仓库",
            "behavior": "先核对究竟删哪个仓库、本人是否授权、还剩哪些副本和恢复办法，再作重大动作判断。若将丢失唯一且无法恢复的数据，必须由 Astra 判断。是否进一步要求本人验证，由实际判断决定；Git 工具执行删除，本模块提供验证能力，删除请求本身不触发设备锁盘。"
          },
          {
            "situation": "清理生成文件或一份本地副本",
            "behavior": "先确认它属于本次工作、确实可处置、可重建或有可靠副本，没有未保存内容。满足普通可逆清理条件就按原授权处理；若所谓“副本”其实是唯一原件，判断随真实后果改变。不会看见“删除”二字就一律要求最高验证。"
          },
          {
            "situation": "重装、重置电脑或格式化磁盘",
            "behavior": "先查清会擦掉哪些数据、是否影响加密恢复材料与系统恢复入口。涉及不可逆数据损失或恢复根变化时由 Astra 判断，执行仍交给当前负责系统安装或恢复的项目。讨论重装方法、只读检查和普通修复不会被当成已经获准擦盘，也不会自动启动独立锁盘流程。"
          },
          {
            "situation": "查资料、改代码、测试或正常推送",
            "behavior": "已授权的普通工作沿原入口继续。它发生在重要仓库里，并不因此自动变成危险动作；真实改变公开范围、暴露敏感资料或产生不可逆后果时，再判断具体影响。"
          },
          {
            "situation": "资料到期、主动锁屏或取消验证",
            "behavior": "资料到期处理资料访问，主动锁屏处理 Windows 会话，取消只结束这次验证。它们不是同一个开关，不能据此自动推导设备已不可信、磁盘应锁定，或其他已生效授权全部撤销。"
          },
          {
            "situation": "出现与操作者或隐私侵入有关的真实疑点",
            "behavior": "暂停与疑点有关的资料取用和不可逆步骤，由 Astra 作独立判断；不先读取私人档案来“考身份”，也不必等到取得入侵实锤。只有另行判断需要设备保护，才进入下面的验证邀请和独立磁盘流程；无关可逆工作仍可继续。"
          }
        ]
      },
      {
        "title": "判断会返回五种结果",
        "cases": [
          {
            "situation": "可以继续（allow）",
            "behavior": "现有授权、目标和条件足以支持这次动作。执行工具仍检查具体目标与有效期，执行后还要读取真实结果；判断允许不等于动作已经成功。"
          },
          {
            "situation": "先由本人验证（step_up）",
            "behavior": "这一步要先完成适用的本人验证，再按同一目标继续。可用方式是已登记的 Passkey、TOTP、Recovery 或 Account；Google/Microsoft 属于 Account 的提供方。没有指定时可选正常方式；指定方式有故障就修复它，不能偷偷替换。"
          },
          {
            "situation": "不允许执行（deny）",
            "behavior": "当前请求或条件不允许该动作，停在动作之前，并说明可公开说明的具体障碍。不能换个脚本绕过去。"
          },
          {
            "situation": "还缺事实（needs_evidence）",
            "behavior": "先取得会改变判断的那份证据，例如精确目标或恢复副本是否存在。资料没查到不是已经拒绝，也不能靠换更强模型猜出事实。"
          },
          {
            "situation": "存在篡改疑点（suspected_tamper）",
            "behavior": "相关动作和披露保持停止，交由适用的核验、保护与恢复入口处理。这是判断状态，不表示磁盘保护已经执行；是否保护、执行到哪一步仍另行核对。"
          }
        ]
      }
    ]
  },
  {
    slug: "protected-data",
    searchAliases: ["受保护数据", "PCConfig受保护数据", "加密文件恢复", "加密文件应用升级恢复"],
    usageEntry: "在已接入 PCConfig 的 AI 对话中说“先查我的加密文件应用现在能否升级或找回文件，不要修改正式数据”，并指出是哪台电脑。当前可得到状态核对；真正升级须先解决安装与检查工具不一致，完整文件库还没有现役入口。",
    usageInputs: [
      "是准备升级，还是应用/电脑已经损坏",
      "涉及哪台设备与哪份加密文件",
      "已知的旧版和恢复副本位置；本人验证材料只在受保护入口使用"
    ],
    productFlow: [
      {
        "title": "先看现在能否打开旧文件",
      "detail": "系统分别确认当前程序能否打开原文件、旧版是否仍可回退，以及恢复副本里是否真的有这批文件。"
      },
      {
        "title": "确认现在有什么可用",
      "detail": "现装旧版与当前检查工具不匹配时，给出具体差异并保留现有文件和旧程序；这轮不能直接升级或把过去的成功当成今天可用。"
      },
      {
        "title": "条件齐备才换版",
        "detail": "将来只有旧版能打开文件、新版在独立位置通过读写和重开检查，才切换；新版失败仍保留旧版。当前检查缺口未解决前不能把这一步说成可执行。"
      },
      {
        "title": "损坏后按真实材料找回",
        "detail": "目标恢复路线需要完整副本和一种本人验证，在另一个空目录先确认能读文件；这条正式文件恢复路线尚未交付，材料缺失时明确告知不能恢复。"
      },
      {
        "title": "拿到可行动结论",
        "detail": "答复列出已证可用、仍待核实和目前做不到的事，以及下一步应由维护项目修正什么；不因源码或样例存在就说文件已找回。"
      }
    ],
    shortTitle: "加密文件恢复",
    title: "加密文件应用升级或损坏后，怎样保住文件",
    teaser: "先查目前还能不能安全打开旧文件，再决定能否升级；完整文件库和换机恢复尚未交付。",
    status: "旧版的升级保护有历史运行记录，但现装格式与当前检查工具不一致；完整加密文件库和独立恢复仍未交付。",
    statusTone: "problem",
    searchProjection: {
      "intents": [
        "查询加密文件应用现在能否升级",
        "升级失败后找回旧文件",
        "旧电脑损坏后确认恢复材料",
        "查看加密文件库是否能用",
        "确认备份是否真能打开文件"
      ],
      "entities": [
        "加密文件应用",
        "当前旧版",
        "可回退旧版",
        "加密文件",
        "恢复副本",
        "本人验证",
        "独立恢复目录"
      ],
      "relations": [
        "升级前先证明旧版和恢复副本可用",
        "新版失败仍保留旧版",
        "恢复副本与本人验证都需要",
        "文件导出普通目录后离开加密保护",
        "完整文件库尚未投入日常使用"
      ],
      "failureRecovery": [
        "当前检查工具不匹配则停止升级",
        "恢复材料不齐就不能承诺找回原文",
        "应用入口坏了也不覆盖旧文件",
        "仅有源码或测试不能说真实文件已恢复"
      ]
    },
    value: "这项能力要保护存放私人文件的加密应用：更新程序失败时，仍能回到能打开旧文件的版本；电脑或应用损坏时，最终能凭一份完整的加密恢复副本和本人验证，在另一处先把文件读出来。目前只有旧版升级保护的历史记录和小型测试范围，完整文件库与独立找回真实文件的流程尚不能日常使用。",
    why: "最怕的是升级把唯一能打开文件的旧程序覆盖了，或换机时只剩一堆无法解开的加密文件。因此，每次切换前要先证明旧版、备份和找回方法真的可用；证明不了就保持现状，把不能做的步骤说清楚。",
    example: "我可以说：“先查这套存私人文件的应用现在能否安全升级；如果新版打不开，旧版和文件还能回来吗？先别碰正式文件。”系统会检查已有版本与恢复记录。目前安装格式和检查工具对不上，答复应停在这个缺口，不能直接替我切换。",
    result: "现在我能拿到的是：当前安装与旧版记录是否一致、手头恢复材料还缺什么，以及能否开始下一步的明确结论。若检查仍不匹配，升级会停下；我不会被告知完整文件库已可打开，或单靠一个备份目录就能在新电脑找回真实文件。",
    readerStates: {
      "pass": "只有当前版本、旧版回退和新版本都经过实际打开、写入与再次打开的检查，才会切换；结果列出哪一版真正可用。",
      "problem": "新版本检查失败就保留旧版和原文件；若当前安装与检查工具不一致，先由维护项目修正并重新核对，不做正式切换。",
      "unavailable": "找不到完整恢复副本、本人验证方式或能打开文件的程序时，明确说尚不能恢复；现有文件保留，不把设计图或测试样例当成找回成功。"
    },
    decisionImpact: [
      "现在可先询问版本与恢复材料的状态；现装旧版和当前检查工具不匹配，未核实前不开始新的升级。",
      "升级要先验旧版能读文件，再验新版能写、关闭后重开；新版失败时旧版与原文件保持可用。",
      "将来在另一台电脑找回加密文件，需要一份完整恢复副本和一种仍有效的本人验证方式，只有程序源码或其中一项材料都不够。",
      "完整文件库的浏览、搜索、编辑和独立换机恢复还没有正式可用的现场结果；本页不能当成这些功能的启动按钮。",
      "明确导出到普通文件夹的副本会离开加密保护；热备和冷备也须分别证明能实际找回文件，不能只看复制完成。"
    ],
    problem: "避免一次程序升级或设备损坏，把唯一可用的解密路径和原文件一起失去；当前首先要解决已安装旧版与现行检查工具不一致的问题。",
    implementation: [
      "P0 v1 在固定 ProgramData root 使用 immutable slot、一个 control.json、journal/receipt 和公开零秘密 status；selector 以 revision CAS 和同卷原子替换更新。",
      "control 只有 normal、trial、read_only_recovery 三种 mode，绑定 active、LKG、rollback 和 manifest hash；每次 launch/health/recovery 都重新核验完整闭包。",
      "公开状态仍绑定2026-09-03T03:07:57Z：revision 68、mode=normal、trusted_control=true、active=LKG、rollback distinct、recovery_status=null；该次启动61718 ms、deadline_met=true，未重做自然启动。",
      "2026-08-27 的 196468 ms 超时与 2026-08-28 的 rev66、57656 ms、deadline_met=false、LastTaskResult=4 都只作为带日期的历史回执保留，不代表当前状态。",
      "正式 boot-deadline-recovery operation 先把 current 恢复为第 68 版 normal、active=LKG；随后新的自然启动闭合 boot acceptance，历史失败回执不再代表当前启动状态。",
      "P0 vNext RecoveryKernel 设计旁路安装到 v2 root，但继续使用唯一 v1 state/slots；2026-08-29 v2 public status root absent（安装根不存在），所以仍是 source candidate（源码候选版本）。",
      "P1 v1 的 protected_data_key_factors.json 明确 supported_factor_types=[recovery-code-v1]；安装目标为 C:\\ProgramData\\PCConfig\\ProtectedDataKeyFactors\\v1，状态目标为 %LOCALAPPDATA%\\PCConfig\\ProtectedDataKeyFactors\\v1\\test-vault，范围只是小型隔离测试保险库。登记目标不是本轮安装/解锁证明，也不等于 Password Center 的四类因子支持。",
      "P1 每个 vault 使用独立 32-byte 主密钥与 AES-256-GCM 测试正文；每个恢复码实例有 256-bit 随机秘密与 RSA-3072 接收密钥，PBKDF2-HMAC-SHA-512 正式 600000 次派生后加密私钥，主密钥以 RSA-OAEP-SHA-256 分别封装。add/revoke/replace/rotate/reregister（新增/撤销/替换/轮换/重新登记）绑定精确 action、expected epoch、nonce 与最长 120 秒证明；撤销/替换后必须还有可新进程解锁的有效因子，principal（智能体主体）不计为恢复路径。",
      "vNext 设计中的 AuthorityVault 将提供 Passkey、TOTP、Recovery、Account 四类同接口因子，成功只交付进程内 opaque session（不透明会话）；四类是目标，不是 P1 v1 支持集。Google/Microsoft 始终只是 Account provider（账号提供方）。",
      "RecoveryFactorHost 是独立的恢复候选，不是现役 P1 v1 的四类支持证明：Registry 当前 lifecycle=candidate_only、actual_install_state=not_installed、production_activation=false；它只适配现有 RegisteredCarrier/因子解封，不拥有因子 Registry、root key（根密钥）或第二恢复根。默认 Plan（计划）只核验源码，Execute（执行）固定 refused_candidate_only。",
      "RecoveryFactorHost 固定五个窄操作 describe-factors、verify-factor、unwrap-local、unwrap-carrier、rewrap（列因子、验证、解封本机、解封载体、重新封装）；一次选中因子成功只产生进程内 pre-root-read-only（控制面重建前只读）会话，grant（授权票据）首次尝试就消费。rewrap 属于后续可写阶段，其取消、失败或不可用不关闭已存在只读会话。",
      "四类恢复适配严格区分本机与新机：totp-local 的六位码只验证本机受保护 verifier（校验器）；totp-seed 使用用户选定 Authenticator seed/QR；Passkey 要求已验证的 WebAuthn PRF（通行密钥派生能力），新机还须同步凭据或在场硬件凭据；Account 只调用选定 Google/Microsoft 的一次前台登录和指定 remote recovery object（远端恢复对象）。网络失败只暂停该实例，不换因子、不改设备信任。",
      "安全文件库唯一 successor 源码入口是 Open-ProtectedDataVault.ps1 → 已安装 ProtectedDataSafeSwitch.exe recovery-launch --trigger normal-open → 当前不可变 P0 slot 的 recover-read-only controller（只读恢复控制器）→ ProtectedDataRecoveryUI.exe → 共享 ProtectedDataVault.Browser → ProtectedDataVault.RecoveryBridge → formal V2。启动器不再签发旧 V1 DPAPI 令牌或直接拉起旧 GUI；源码路由不证明安装态入口已切换。",
      "Browser 使用白底、绿色主交互和深绿盾牌图标，小/中/大视图与名称/修改时间/大小升降序；文件夹优先，虚拟化分页避免一次实例化 100000 项。单击选中后自动预览，打开/导出必须用户点名；UI 通过继承匿名管道请求有界 list/find/inspect/open-stream/read-stream/export，不接收主密钥、因子材料或正式 vault 路径。",
      "图片预览只留内存，源上限 64 MiB；视频首帧用本会话临时文件和 WPF MediaPlayer（媒体播放器），源上限 128 MiB、调用返回前删除，不用 Windows Shell 缩略图或持久明文缓存。当前视频证据仅 synthetic-valid-mp4-fixture-only，production_video_thumbnail_verified=false，不能称真实视频已验收。",
      "P3/P4 Vault V2 使用 AES-GCM（带完整性校验的分块加密）、单一对象/索引引擎、opaque lease（不透明租约）和恢复 Bridge；读取流一次最多保留 1 MiB 明文，EOF（读到结尾）后才确认完整 hash。",
      "Vault V2 的 v2-index/current.p3i 是唯一加密单调 revision root（索引修订根）；对象与搜索使用 256 个不可变 hash shard（哈希分片），namespace（命名空间）listing（目录清单）最多 100000 项。cursor（分页游标）绑定 vault、命名空间、revision、排序和偏移，过期/跨域/篡改拒绝；旧 vault.json 或 manifest.current.p3m 只触发 v2_implicit_migration_refused，不隐式打开、迁移或删除旧数据。",
      "Vault V2 Registry 当前 lifecycle=protected_install_effect_source_ready，并要求 production_state_source=installer-inspect-readback-only；这不是 installed current。",
      "Formal V2 固定安装根 C:\\ProgramData\\PCConfig\\ProtectedDataVaultFormal\\v1，正式 vault 为其 vault 子目录；受保护安装 formal_v2_product_install 与初始登记 formal_v2_initial_enrollment 是不同单次步骤。source Execute 固定拒绝；只有 installer Inspect 的固定根、manifest 和制品哈希正式回读才能证明安装，不能使用任意测试根。",
      "主入口失效时的恢复侧车候选先独立核对 P0 slot manifest、完整文件集合和逐文件 hash，再核对同一 release closure（版本闭包）、因子 projection（投影）、载体 manifest 与 envelope（密钥封装）。正常模式尝试 active→LKG→rollback，trial/只读恢复优先 LKG→rollback→active；无完整侧车则 no_verified_recovery_sidecar，不把 P0 normal 状态当成恢复入口已安装。",
      "隔离恢复先验证一份 current Carrier 的真实身份、签名/哈希、epoch、factor envelope、加密索引和对象闭包，建立 PreRootReadOnlySession；正常 Authority、Publisher、P2/CoreGoal、Agent launcher 或主 GUI 都不是 pre-root 条件。post-root（重建后写入阶段）才重绑新设备/智能体与 envelope，不复制旧私钥；该阶段不可用仍保留已验证只读浏览/点名导出。",
      "P4 首次产品验收目标是在全新隔离目录完整验证核心数据库、索引与元数据，再实际解密约 2–5 GiB（默认 3 GiB）代表文件；不为首次验收解密数百 GB。后续 P5–P7 的热冷快照则要求全密文闭包校验和各自代表对象回读，两种范围不能互相替代。",
      "P5–P7 Registry 当前 status=fixture_replica_acceptance_only、formal_data_action_authorized=false、formal_data_paths_touched=false，明确没有正式数据迁移。",
      "P5 设计先冻结 legacy plaintext import precondition manifest（旧明文导入前提清单），含有限来源身份、相对路径、字节数、SHA-256、consumer（使用方）和回滚；再把 Vault V2 formal pre-state（导入前状态）、精确清单与 adapter（适配器）身份绑定到 expected post-import commitment（预期导入后承诺）。唯一 Vault V2 adapter 在一次流式导入中 hash/写入/提交/回读，输出新 current-index revision/SHA-256，不产生第二套 P5 archive 或 current index。",
      "P7 只复制 Vault V2 immutable committed ciphertext snapshot（已提交不可变密文快照）到同一承诺的 hot replica（热副本）和 cold Carrier（冷载体）。单流比较 source/destination（源/目标）SHA-256，只有 sealed closure（完整封存闭包）可见；中断只续作同一目标 staging journal（暂存进度），不重新加密、不从旧明文重建快照。",
      "冷 Carrier 分成小型 factor-envelope-closure（因子封装闭包）与大体积 ciphertext-snapshot（密文快照）；RegisteredCarrierV2 的 128 MiB 上限只约束前者，不能把整个文件库嵌进去。热、冷副本各自完整校验密文闭包后，还必须分别恢复到不同全新 non-reparse（无重解析链接）目录，并由 Vault V2 adapter 解密一个代表对象，返回各自绑定 snapshot commitment、object_id 与 plaintext_sha256 的恢复回执。",
      "P6 在新设备从一份完整 current ciphertext_cold_carrier（密文冷载体）与一个有效因子先完成上述隔离只读恢复，再生成新设备 local envelope（本机封装）、登记合格智能体并使旧能力失效。仅载体、仅因子、错 vault/generation/hash、provider unavailable（提供方不可用）都是负例；不能在成功因子后要求第二次验证。",
      "P5 切换后的旧明文只标 readonly_migration_rollback（只读迁移回退）；新 hot/cold closure、独立 restore（恢复）回执、代表对象、fresh P0–P4 acceptance（当前验收）、容量和性能证据全部齐备后，旧备份也仅能成为 retirement_candidate（退役候选）。永久删除、替换或清空仍需新的精确不可逆授权，当前 fixture 不执行任何正式数据动作。",
      "vNext 四角色是 RecoveryKernel、AuthorityVault、GoalJournal 和 VaultApp；跨角色只保留因子→opaque session、goal step→产品命令/回执、Carrier→隔离恢复回执。"
    ],
    flow: [
      "构建闭合 candidate manifest（候选版本清单）和不可变 payload（版本载荷）",
      "在旁路 slot 完整写入、flush、hash read-back",
      "运行 pre health 的写入、关闭、重开、读取与 preimage 恢复",
      "原子写 trial selector 并从 stable selector 运行 post health",
      "成功写 normal、新 LKG 并保留旧 rollback；失败恢复旧 LKG",
      "需要灾难恢复时用一份 Carrier 加一个因子进入隔离目录",
      "需要更换因子时先用仍有效实例授权并验证替代路径，提交新代际后撤销旧能力；不以智能体登记充当恢复因子，不删除最后路径",
      "日常打开候选安全文件库后，按命名空间浏览、搜索、排序和预览；导出由用户点名，并明确普通目标离开保护范围",
      "主入口故障时先验证恢复侧车、载体与选定因子，在独立目录建立只读会话；后续设备重绑失败不回收已验证读取能力",
      "验证核心数据库、索引、元数据和代表性对象",
      "未来 P5 只从精确获准清单流式导入 Vault V2 并回读唯一新索引；P7 复制同一已提交密文快照，再从热、冷副本各自独立恢复和读取代表对象",
      "只有全部正式证据成立后才切入口、观察并讨论旧路径退役"
    ],
    concepts: [
      { term: "P0–P7（八阶段恢复路线）", explanation: "从安全换挡、因子、目标授权、保险库、单 Carrier 恢复，到正式迁移、新设备恢复和旧路径退役的严格顺序。" },
      { term: "Selector（版本选择器）", explanation: "唯一 control 状态，决定 active、LKG、rollback 和当前 mode；不能分散到多个权威指针。" },
      { term: "LKG（最后确认可用版本）", explanation: "经过 health 证明、切换失败时可恢复的版本；active 不自动等于 LKG。" },
      { term: "Read-only recovery（只读恢复）", explanation: "任何可写版本都无法证明时的安全模式，只说明缺失条件和可验证候选，不恢复 normal 写入。" },
      { term: "Recovery Carrier（恢复载体）", explanation: "包含完整 current 密文、manifest、身份和 epoch 的独立恢复集；盘符或介质名称本身不是身份。" },
      { term: "Opaque lease（不透明租约）", explanation: "授权进程短时使用保险库能力，但不暴露主密钥或可复制的明文凭据。" },
      { term: "Pre-root read-only（控制面重建前只读）", explanation: "载体与一个有效因子已完成密码学核验后，先开放独立目录里的读取；正常授权服务、主 GUI 或后续设备登记暂不可用不取消这份读取能力。它当前仍需候选安装与真实恢复验收。" },
      { term: "Snapshot closure（快照完整闭包）", explanation: "一个已提交 Vault V2 索引及它引用的全部密文对象和元数据；热冷副本复制同一闭包，不能分别生成一套新加密权威。" },
      { term: "Fixture-only（仅隔离样例）", explanation: "只证明测试目录和合成数据路径，不能宣传为正式安装、真实因子、真实 Carrier 或正式数据恢复。" }
    ],
    boundaries: [
      "P0 不修改活动规则、Publisher、正式数据、主密钥或因子",
      "保险库 source 不接触正式数据，正式迁移前旧明文保持原 Owner 和只读回退",
      "Carrier 撤销登记不等于自动擦除介质字节，最后恢复路径不得无替代删除",
      "P1 v1 只有 Recovery 实例支持；四类恢复 Host、正式安全文件库、主入口故障恢复与 P5–P7 各按自己的候选/安装/E2E 证据判断，不互相借名升级状态",
      "主入口或单次因子失败只暂停访问，不因此写 device_untrusted（设备不受信）、锁盘、触发 BitLocker 或重启",
      "用户明确导出的 external_delivery_plaintext（外部交付明文）不设 AI 自动 TTL（到期删除）；会话临时明文另按精确任务、哈希、无打开句柄与非唯一副本条件处理，不建后台清理器",
      "未做真实 reboot receipt 时不宣称三分钟启动恢复验收完成",
      "物理断电未实测时只称 durable-write 强制终止矩阵，不冒充物理断电测试",
      "P5–P7 当前禁止正式 data action、删除、迁移、备份写入、恢复或外部交付"
    ],
    failures: [
      { condition: "当前 P0 selector", response: "public status 显示 normal、trusted、active=LKG 且有独立 rollback，说明当前选择器有可用证据。" },
      { condition: "P0 boot task 返回当前失败", response: "按新回执重新判断并保留 rev68 当前可用版本；2026-08-28 的历史 LastTaskResult=4 不得代替当前结果。" },
      { condition: "候选版本切换前后健康检查失败或超时", response: "恢复旧 LKG；旧 LKG 也不能证明时写 read_only_recovery（只读恢复），并拒绝业务写入。" },
      { condition: "control current 损坏", response: "只接受完整验证的 previous preimage；不能靠猜测选择 newest slot。" },
      { condition: "v2 RecoveryKernel root absent（安装根不存在）", response: "只称 source candidate（源码候选版本），不称 side-by-side installed（并行版本已安装）、fresh read-back（全新回读）或 reboot verified（重启已验证）。" },
      { condition: "RecoveryFactorHost source 或 fixture 通过", response: "仍保持 candidate_only/not_installed；没有正式安装、真实因子和 Carrier E2E 时，不得称四类恢复入口可用，更不能覆盖 P1 v1 仅支持 recovery-code-v1 的事实。" },
      { condition: "撤销会删掉 P1 最后一条有效恢复路径", response: "拒绝提交，保持原 state epoch（状态代际）和规范哈希不变；替代因子先通过新进程解锁验收，不能靠同名凭据或 principal 数量证明可恢复。" },
      { condition: "只剩 Carrier 或只剩因子，或解封闭包不匹配", response: "失败关闭、不返回原文；完整载体和一个可验证有效因子缺一不可。六位 TOTP 不是新设备 seed，Account 离线也不自动换其他因子。" },
      { condition: "pre-root 已成功而 post-root provider 不可用", response: "保留原只读会话和用户点名导出入口，暂停新设备写入/重封装；不重复因子、不撤回已经验证的读取，也不谎称设备登记完成。" },
      { condition: "当前 P0 槽没有完整 recovery sidecar（恢复侧车）", response: "返回 no_verified_recovery_sidecar；P0 选择器正常只证明可用版本，不证明独立恢复入口已安装。保留候选和缺失条件，不直接改现役槽。" },
      { condition: "安全文件库导出到普通目录", response: "由用户明确选择并说明明文已离开保护范围；导出冲突不静默覆盖，用户导出不纳入自动清理。" },
      { condition: "热或冷任一副本只有复制回执，缺独立恢复/代表对象回读", response: "P5–P7 正式交付仍关闭，旧明文和旧备份原样保留；合成复制样例、历史容量下界或另一副本通过不能补齐缺口。" },
      { condition: "P0 source Inspector 返回 install_manifest_invalid", response: "明确显示当前源码检查器无法验证旧安装 manifest；保留 selector/LKG 可用事实，不把检查器 BLOCK 夸大成数据损坏，也不自动重装。" },
      { condition: "Vault V2 source/fixture 通过", response: "仍不等于 protected install、真实因子、Carrier、重启或故障恢复 E2E。" },
      { condition: "P5–P7 正式授权为 false", response: "保持 fixture-only；formal_data_paths_touched=false，禁止以设计或测试推动真实数据迁移。" }
    ],
    sources: [
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-product-roadmap.md", role: "P0–P7 冻结产品结果、顺序和 vNext 收敛" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-safe-switch.md", role: "P0 selector、health、启动恢复和验收合同" },
      { path: "E:\\PCConfig\\registries\\protected_data_safe_switch.json", role: "P0 source、root、task、预算和 closed mode Registry" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-key-factors.md", role: "P1 v1 Recovery 支持集、因子/智能体生命周期与最后恢复路径" },
      { path: "E:\\PCConfig\\registries\\protected_data_key_factors.json", role: "recovery-code-v1、隔离状态根、加密参数与动作证明范围" },
      { path: "C:\\ProgramData\\PCConfig\\ProtectedDataSafeSwitch\\v1\\public\\status.json", role: "P0 当前零秘密 selector 状态" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-vault-v2-engine.md", role: "Vault V2 engine、对象、索引、lease 与 consumer 边界" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-vault-gui.md", role: "安全文件库日常场景、唯一 Browser、只读正常打开候选与导出边界" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-vault-v2-formal.md", role: "固定安装根、正式安装/登记、source Execute 拒绝与唯一 Inspect 证据" },
      { path: "E:\\PCConfig\\tools\\Open-ProtectedDataVault.ps1", role: "经已安装 P0 normal-open 的唯一源码启动入口" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-recovery-factor-host.md", role: "四类候选、pre-root/post-root、单载体、侧车和主入口失效边界" },
      { path: "E:\\PCConfig\\registries\\recovery_factor_host.json", role: "candidate_only、not_installed 与 production_activation=false 生命周期证据" },
      { path: "E:\\PCConfig\\registries\\protected_data_vault_v2_formal.json", role: "Vault V2 source/install lifecycle Registry" },
      { path: "E:\\PCConfig\\registries\\protected_data_p5_p7_delivery_v3.json", role: "P5–P7 fixture、正式授权和真实路径触碰状态" },
      { path: "E:\\PCConfig\\docs\\contracts\\pcconfig.protected-data-p5-p7-delivery-v3.md", role: "Vault V2 唯一导入、热冷闭包、各自独立恢复、容量/性能与旧路径保留" }
    ],
    verification: [
      "P0 public status 于 2026-08-29 可读取 schema pcconfig.protected-data-safe-switch.public-status.v1、mode=normal、revision=68、trusted_control=true",
      "当前状态回读 active_equals_lkg=true、rollback_distinct=true，并与项目 currentState 的 rev68 自然启动事实一致",
      "fresh Test-PCConfigDrift 返回 runtime_health=pass、failure_last_result_count=0、recovered_historical_count=0",
      "boot-latest.json本轮读取的已有记录为第68版normal/LKG、61718 ms、deadline_met=true、recovery_status=null，记录时间2026-09-03T03:07:57Z；不是今日启动结果",
      "C:\\ProgramData\\PCConfig\\ProtectedDataSafeSwitch\\v2\\public\\status.json 当前不存在，明确阻止 installed-v2 声明",
      "recovery_factor_host.json 当前 lifecycle.state=candidate_only、actual_install_state=not_installed、install_execution_permitted=false；只证明源码边界已登记",
      "protected_data_key_factors.json 明确 supported_factor_types 只有 recovery-code-v1；这是当前 v1 实现支持集，不是四类适配或本轮安装、真实解锁的证明。",
      "安全文件库合同仅记录 V2 10000 项搜索、100000 项列表、六种排序、stream/crash 与合成 UI/video 验收；本次没有运行正式 normal-open、真实视频或任何写操作，production_video_thumbnail_verified=false 继续保留。",
      "独立恢复合同和候选描述主入口/P2/Publisher 不作为 pre-root 前提、post-root 失败保留只读会话；本次没有请求真实 Passkey/TOTP/Recovery/Account，没有读取 envelope/载体内容，没有执行主入口故障或单载体恢复 E2E。",
      "Install-ProtectedDataSafeSwitch.ps1 -Mode Inspect 当前返回 protected_data_safe_switch_install_manifest_invalid；旧安装文件仍与旧 manifest 一致，但当前 source Registry 的 release/字段合同已前进",
      "Vault V2 Registry 只允许 installer inspect read-back 作为 production state source；source acceptance 不能替代",
      "P5–P7 Registry 当前 formal_data_action_authorized=false、formal_data_paths_touched=false",
      "P5–P7 fixture 只证明合成密文单流复制、断点恢复、闭包拒绝和代表对象回执绑定；真实 Vault V2 导入、新索引、热冷各自隔离恢复、容量/吞吐与旧路径退役条件均不由 fixture 补齐。",
      "protected_data_safe_switch.test.py、p0_boot_deadline_recovery.test.ps1 和 VaultV2Acceptance 分别覆盖 selector/crash、deadline 窄恢复和加密对象/索引负例"
    ],
    relation: "本人验证与设备保护模块说明设备信任、秘密暂停和独立磁盘状态，不向本模块授予通用步骤能力。本模块仍拥有P0–P7版本、保险库、Carrier与真实数据恢复的独立入口和回读；普通CoreRecovery不能替代加密恢复，也不能由设备恢复成功推定本模块完成。",
    readerStatus: "目前适合查询旧版与恢复材料状态。现装旧版和当前检查工具不匹配，完整文件库及独立恢复仍不可作为日常入口。"
  },
  {
    "slug": "remote-computer-mcp",
    usageEntry: "在实际支持并已连接“让 AI 操作电脑”的电脑 MCP 客户端中，说明要操作主机还是副驾驶笔记本；手机原生 ChatGPT 应用的这类连接尚无可用证据。",
    usageInputs: ["目标电脑", "要读或操作的应用", "当前客户端、登录或网络情况"],
    productFlow: [
      {
        "title": "先确认这条连接真正能做什么",
        "detail": "系统查看当前客户端是否已连到指定电脑，并是否真的提供本次所需的读取、脚本或桌面工具。"
      },
      {
        "title": "逐项核对通路和权限",
        "detail": "AI 区分连接成功、目标电脑在线、工具可调用和私人资料仍在许可期限内，缺一项只停相关动作。"
      },
      {
        "title": "完成并回读",
        "detail": "仅对指定设备执行可用动作，交回文件、屏幕或应用实际结果；链路断开、登录受阻或工具未开放时指出停点。"
      }
    ],
    "shortTitle": "手机与双机维护",
    "title": "电脑 MCP：手机操作、双机维护与登录前恢复",
    "teaser": "在已接通的对话里读电脑文档、运行脚本或操作桌面；主副电脑还能互相维护。系统服务负责未登录时的维护，桌面操作仍交给真实登录用户。",
    "status": "23工具与主机实际执行已回读；客户端权限、桌面和冷启动分别验",
    "statusTone": "mixed",
    "searchAliases": [
      "手机操作电脑",
      "电脑 MCP 怎么用",
      "Chat 极高 Pro 电脑文件",
      "Chat 和 Work Codex 额度",
      "手机电脑文档脚本浏览器"
    ],
    "searchProjection": {
      "intents": [
        "手机读取电脑文档",
        "远程执行本机脚本",
        "操作外部 Chrome 和基础表单",
        "核对电脑 MCP 是否正常",
        "恢复 MCP 连接",
        "在已接通 Chat 中选择极高或 Pro",
        "主副电脑互相检查和维护",
        "Windows 尚未登录时维护电脑",
        "断连后查询同一次维护结果"
      ],
      "entities": [
        "WLY",
        "电脑 MCP",
        "ChatGPT Chat",
        "ChatGPT Work",
        "Windows-MCP",
        "Tailscale Funnel",
        "OAuth",
        "ComputerContext",
        "ReadDocument",
        "Windows Credential Manager",
        "LAPTOP-E48N0DRJ",
        "main_desktop",
        "secondary_laptop",
        "MaintenancePowerShell",
        "PCConfigRemoteComputerMCPSecondary"
      ],
      "relations": [
        "对话模型负责推理而电脑执行工具",
        "Chat 用量与 Work/Codex 独立",
        "同一 E resolver 提供当前规则",
        "MCP 登录不继承 codex-root",
        "桌面操作占用真实前台",
        "SYSTEM 服务在登录前提供维护入口",
        "普通桌面工具由登录用户会话执行",
        "两机共享源码但各自部署和恢复"
      ],
      "failureRecovery": [
        "电脑关机或断网时连接不可用",
        "锁屏时不承诺桌面操作",
        "规则校验失败只关闭规则依赖动作",
        "缺宿主专用接口时检查现成脚本或桌面路径",
        "恢复只补本服务映射不清空其他 Tailscale 配置"
      ]
    },
    "value": "在当前确实接入电脑工具的对话里，AI 可以读取选定电脑的文件、运行已获准的检查或操作可用桌面。连接、桌面登录和私人资料许可分别成立；登录前只做当时可用的有限维护。",
    "why": "人在外面也可能需要从自己的电脑读文件、运行现有检查，或在登录前做有限维护。连接到电脑、能操作桌面和获准读私人资料是不同条件；这里按本次客户端真实提供的工具逐项完成。",
    "example": "我说：“从主机读这份项目说明的第二节，再运行现有检查命令；不要修改文件。”客户端确实开放这两项工具时交回电脑上的结果。若桌面尚未登录，只能做仍可用的系统维护，不会编造截图。",
    "result": "得到选定电脑的文件片段、命令或页面结果；后台维护需要等待时会给一个可继续查询的编号。连上服务只是第一步，命令是否结束、文件是否真读到和桌面是否可操作仍分开确认。",
    "readerStates": {
      "pass": "目标电脑在线、当前客户端真的提供这次所需工具且权限有效时，执行后返回电脑上的实际结果。",
      "problem": "一个工具暂不可用时先找已经接入的合适入口；若动作结果不明，按原编号查，不盲重做。",
      "unavailable": "客户端未开放工具、电脑断线或桌面未登录时指出哪层缺失；登录前的有限维护可能仍可用，但不会借连接获得最高权限。"
    },
    "decisionImpact": [
      "模型推理留在用户选择的 ChatGPT 对话，文件与应用动作发生在 WLY；不会因此启动本机 Codex 任务。",
      "模型、思考档、读写工具和用量限制由本次实际客户端与账号决定，不能把Extra High、Pro或某个工作模式当成永久产品身份，也不能把任何档位说成无限量；调用本机工具不自动创建Codex任务。",
      "手机可继续用原有海外代理 VPN，不需要同时启用手机 Tailscale；OpenAI 服务器经公网 HTTPS 调用电脑入口。",
      "两机都要 Windows 已启动、联网且服务可用；维护入口已部署为登录前 SYSTEM 服务，普通桌面操作仍要实际用户登录、桌面可交互。物理重启后的未登录验收尚未完成。主机 keep_awake=true，副机为 false；均不阻止主动关机或休眠。",
      "先用 ComputerContext 确认目标。副机连接主机叫 main_desktop，主机连接副机叫 secondary_laptop；主机使用当前 E 规则，副机使用自己的唯一全局规则，不能互相冒充。",
      "需要管理员或 SYSTEM 时使用同一连接中的 MaintenancePowerShell（维护命令工具）；长任务返回编号，断线后查原编号，不重复提交。普通工具不暗中提权，MCP 登录或 Windows 系统权限不等于 codex-root。",
      "Git 同步共享源码，部署入口更新真实服务；只拉取代码不能算升级完成。副机独立保存配置、凭据和回滚版本，主机失联不要求先恢复主机密码中心才能普通工作。",
      "GUI（图形界面）连续动作需要多次往返；优先用已有脚本减少无意义点击，没有同任务对照计时就不编造快慢倍数。",
      "当前会话没有列出已配置的MCP工具时，先核对原连接并通过现有配置调用入口复用官方app-server；工具已提交而结果丢失时保留unknown；已有维护request_id就查询原编号，其他工具先核对原动作结果，不能重复执行。",
      "MCP运行数据目前没有登记的独立备份。应用身份、刷新令牌数据库和客户端登录态不能靠Git恢复；同机用户与SYSTEM两份身份只服务迁移/回滚，不是一份独立备份。数据丢失后需要重新登记和授权。"
    ],
    "problem": "MCP（模型上下文协议）连接成功只证明入口可达，不能证明文件位置、浏览器结果、客户端采纳规则、最高权限或所有网站兼容。页面必须把协议、机器执行、真实任务、客户端选择和恢复分别说明。",
    "implementation": ["机器登记为 registries/remote_computer_mcp.json；源码 E:\\PCConfig\\tools\\remote-computer-mcp，运行根 E:\\Data\\RemoteComputerMCP，临时根 E:\\Cache\\RemoteComputerMCP，专用测试目录 E:\\Data\\RemoteComputerMCP\\Tests。主服务监听127.0.0.1:18793；新备用relay在同一service-front生命周期内只绑定登记Tailscale地址/18796、只接受登记副机peer并转发回18793，替代主机旧portproxy，未新增Windows服务；副机自身loopback portproxy与Funnel保持独立原样。Tailscale地址晚到或监听意外关闭时，同一进程按1秒起步、最多30秒退避重新绑定，失败不阻塞主入口；停止会关闭监听及已有转发连接。正式Remove先核对主配置绑定并移除该监听注册，再重载现有服务和清精确防火墙，失败恢复配置与防火墙，不能仅删旧portproxy冒充移除。2026-09-11 主公网入口改为 https://mcp.wly0829.cn/mcp，由 Cloudflare 固定隧道提供；/mcp/ 连接页提供主、副与主机备用地址，密钥保持不变。","主机 PCConfigRemoteComputerMCP 与副机 PCConfigRemoteComputerMCPSecondary 都为 Auto/非延迟/LocalSystem 服务。boot_service.py 监督 Session 0 中的 server.py --service-front；主机在同一进程与监听器内按访问域名提供独立的主、备用 OAuth 认证，复用原维护入口。原登录任务仍为 --session-worker，通过同一命名管道执行普通用户工具，不新增桌面 worker。","invoke_configured_mcp_tool.py通过短期codex app-server --stdio的mcpServer/tool/call复用当前用户MCP配置/OAuth，不启动模型或新任务、不复制token、不改审批。连接starting仅有界等待，失败保留官方startupStatus及认证原因；调用已提交而回执丢失返回unknown/do_not_replay=true/退出码3，queued或running须以原request_id查结果。源码a88df8e已正式回读，当前任务未借此重启服务或重放维护。","服务复用 Windows-MCP 0.8.5、FastMCP 4.0.3、mcp 2.2.0、authlib 1.8.0 与 uvicorn 0.52.4。ReadDocument 使用 pypdf 6.18.0、python-docx 1.2.0、openpyxl 3.1.5，对文本行、DOCX 段落、PDF 页和 XLSX 指定工作表行作有界读取。","固定 OAuth 客户端 ID 为 https://chatgpt.com/oauth/client.json，client secret（客户端密钥）留空，token endpoint auth method（令牌端点认证方式）为 none，scope（作用域）为 desktop:control；端点由元数据发现。入口密码与 OpenAI 密码独立，由 Password Center 管理，凭据存在 Windows Credential Manager；不返回或复制到聊天、源码。","两端静态 Codex OAuth 客户端分别为 codex-secondary-laptop 与 codex-main-desktop，连接名为 main_desktop 与 secondary_laptop；回调登记 http://127.0.0.1/callback，只允许临时端口变化，换码绑定本次完整回调与 PKCE S256。issuer（令牌签发方）与回调 iss 精确匹配所选入口及末尾斜杠，DCR/CIMD 关闭。2026-09-11，ChatGPT 新主入口完成授权、自动刷新与管理员/SYSTEM 调用；副机 main_desktop 使用经副机中转主机的地址，完成原生 OAuth 和全新任务的普通/SYSTEM 验收。两机也已实际验收原 Bearer 凭据的管理员/SYSTEM 维护。","主机每次 initialize（初始化）或 server/discover（服务发现）握手经唯一 E 校验入口返回完整已验证根规则、E 代号、Git commit 和规则集哈希；ComputerContext 在任务开始、续作或压缩后按需读取合同、目录链规则和 Skill 元数据。普通工具不重复握手，也不把规则失败扩大成全部工具不可用。","副机使用 host_scoped_rule_file，核对 LAPTOP-E48N0DRJ、规则所属 C:\\Users\\wly、实际运行 SID 与 C:\\Users\\wly\\.codex\\AGENTS.md。已登记 SYSTEM/Session 0 前端可读取规则所属用户的这一个文件，不加载或仿造主机 E release。规则返回与客户端采纳仍是两层证据。","跨运行框架的普通 Owner 使用 HarnessId、RuntimeId、OwnerTaskId 的真实三元组。既有 Work 验收已经领过精确 scope 并写回文档；它不依赖伪造 CODEX_THREAD_ID，也不继承 codex-root。 已认证电脑 MCP 与本机、GUI、AI 消费同一 B2 资料期和原截止；MCP 的连接认证仍独立存在，但不会另建资料期或免除资料检查。本机 Codex 借 MCP 也没有旁路；SYSTEM 进程、Windows 管理员、MCP OAuth 登录和模型档位都不产生 codex-root、秘密明文或磁盘保护权。","原 22 工具保留，maintenance.enabled=true 后增加 MaintenancePowerShell：run/result/status 与 administrator/system 两路按需任务复用原 MCP/OAuth；主机任务为 PCConfig Remote Computer MCP Maintenance Admin/SYSTEM，副机为 PCConfig Secondary MCP Maintenance Admin/SYSTEM，均无触发器、不唤醒机器。管理员任务使用 S4U/Highest，可做未登录本地维护，但不携带交互登录的网络凭据或 EFS 能力。","维护命令超时 1–3600 秒、单次等待 0–30 秒，两路各自排队并一次性消费 request_id；结果返回实际 SID、退出码与完成状态，Unicode 输出按 UTF-8 保留。每路输出上限 65536 字符，超时终止进程树；已完成请求正文清除，结果保留供断线查询，超过一天在下次提交时清理。客户端白名单只约束工具调用，不是同一 Windows 用户之间的隔离。","共享监督器每 10 秒检查，单次超时 3 秒、启动宽限 60 秒，连续 3 次失败才重启前端，退避最多 30 秒；SCM（Windows 服务管理器）对监督器自身故障按 5/15/30 秒恢复。用户未登录是正常状态；Stop 有意停止，不立即拉起；超时或断连不重放用户动作。","副机活动根为 C:\\ProgramData\\PCConfig\\RemoteComputerMCP\\secondary-boot，独立 source、python、.venv、config/runtime.json 与 maintenance 都由本机绑定。Deploy-SecondaryLaptopMcp.ps1 的 Prepare/Update/Check 负责首次准备、同机更新和只读状态；换机重绑实际身份、路径与 Tailscale。副机自身 MCP 在 127.0.0.1:18794，通过其 /computer/mcp 公网 Funnel 提供。另有 /main-computer/mcp 经两机私网中转到主机；两类路径共用副机现有 Funnel，凭据与执行目标各自独立。","2026-09-11 已完成两轮受控故障演练：主机 Cloudflare 主动停止、主公网实际返回 530 / 1033；经副机公网的普通命令 3/3 成功。17:44（北京时间）另轮由同一公网备用入口以管理员核对停止状态，再以 SYSTEM 成功启动 Cloudflare，主入口恢复。备用连接针对主入口连接故障，不能恢复关机的主机，也不自动切换或重放结果未知的命令。","依赖更新先在临时环境验证并备好离线材料，再停止原服务、在原 .venv 路径创建生产环境；失败恢复配套源码、配置、依赖并用共享 manager 恢复服务，成功只保留一个可用回滚版本。同源且无需重建依赖时不重启；凭据与 refresh 原地保留。","Install 验证归属、基础解释器与维护任务，经本机私有管道把同一应用身份迁入 SYSTEM Credential Manager，保留原用户存储用于回滚，refresh 路径不变。失败恢复旧任务与运行状态，只移除本次新建对象。基础 Python、数据卷和规则入口须在登录前可用；venv 启动器或 Codex MSIX 私有路径不能当 SCM 基础解释器。","E:\\Data\\RemoteComputerMCP 当前未登记独立恢复备份；用户与SYSTEM Credential Manager中的应用身份、oauth-refresh.sqlite3和各客户端登录态不在Git恢复范围。同机身份迁移副本不等于跨介质备份；源码部署和真实登录恢复分别验收。","Install 仍恢复隐藏 PowerShell 窗口的上游窄修复；Start 只启动已安装服务。补丁仅回补已知依赖中的三个窗口标志，上游原生修复出现后自动跳过，不改变工具参数和输出。应用身份或 refresh 丢失时经本机 SetupCredentials 与各客户端 OAuth 重新登记，Git 与 Password Center 恢复不自动证明这些状态已恢复。","电脑MCP（让AI调用本机工具的连接协议）是模型无关的Windows执行入口；用户在当次客户端提供的模型和档位里选择。源码服务器提供23工具，是否在会话中暴露读取/写入/执行由账号、客户端、运行模式和连接授权共同决定，不能把Extra High、Pro或Chat/Work名称写成永久产品能力。连接本身不创建本机Codex任务；实际额度由对应产品现行计划决定。","2026-09-18官方ChatGPT开发者模式说明把自定义MCP应用支持范围与账号计划分开，并标为web可用、移动端尚未支持；具体写工具可用性也随计划/模式区分。手机网页、原生App和已配置的其他客户端不能互证。网站只承诺已有服务器和本次实际工具，不由旧测试外推所有手机Chat/Pro写能力。","当前23工具包括规则、文件、PowerShell、浏览器、PDF/Office、等待及两路按需维护；9月15日四项结构化输出合同已在两机真实目录与合成窗口验收。逐字段目录只证明接口存在，不证明当前客户端暴露全部动作、每个格式业务完成或物理冷启动通过。"],
    "flow": [
      "在实际支持自定义 MCP 的账号界面连接固定服务器并独立完成 OAuth",
      "确认实际目标 WLY 或副驾驶的开机、联网、系统服务与桌面状态",
      "ComputerContext 核对目标规则、Windows 身份与任务所需项目上下文",
      "选用现成文件/脚本入口，确需界面时协调真实桌面并观察目标",
      "维护任务返回 queued/running 时保存 request_id，查询同一次结果，再回读真实文件、页面或服务",
      "清理本任务临时文件与程序；断连后先核对当前规则、绑定和结果再续作"
    ],
    "concepts": [
      {
        "term": "ComputerContext（电脑上下文）",
        "explanation": "返回实际电脑当前已验证规则和按需项目上下文，不授予最高权限，也不保证客户端语义服从。"
      },
      {
        "term": "ReadDocument（文档片段读取）",
        "explanation": "只返回指定文本行、段落、PDF 页或工作表行；扫描件 OCR 与复杂版式保真仍按真实需要调用既有专业入口。"
      },
      {
        "term": "Tailscale Funnel（公网转发）",
        "explanation": "让 OpenAI 服务器访问固定 HTTPS 入口；连接仍由应用自己的 OAuth 验证，不能把转发配置当成登录。"
      }
    ],
    "boundaries": [
      "既有 2026-09-09 Work 验收记录检查的是 E122；03:52 UTC 的客户端样本为 E124；该批主机样本当时使用 E127，当前活动规则另由 Rules 页的 verified current E release 给出，副机仍是独立主机规则。每条样本保留自己的身份与版本，不升级为手机 Chat、极高或 Pro 的独立实测。 独立MCP会话按本身的准确授权操作实际电脑，不冒充本机Codex任务或受保护根；发生共享冻结后不得继续引用私人上下文。",
      "所引官方MCP帮助仍将通用自定义接入列为web-only（仅网页），手机原生入口未列支持；Pro套餐的read/fetch（读取/获取）与Business/Enterprise/Edu的完整write/modify（写入/修改）范围也分别说明。Pro模型模式与Pro订阅不是同一概念；连接成功、选到某模型或套餐标签都不能单独证明该对话开放脚本、桌面或写入动作。实际已接通界面与本页Work/Codex经MCP结果分别核验。",
      "文件、脚本与代表性文档已有真实结果；复杂模板、扫描 OCR、每种文档格式仍按具体需求验证。",
      "外部 Chrome 和本机基础附件表单已验收；12315 等真实站点的登录、验证码、异步控件与业务提交结果没有本轮证据。",
      "双机 Codex 连接、普通命令与维护入口已有真实证据；其他账号、手机插件创建界面、锁屏桌面、断网恢复和同模型性能对照未在本次重新验证。物理重启后尚未登录时的跨机调用仍待独立验收。",
      "前台窗口、鼠标键盘与用户共用，操作前协调；元素树缺项时可用截图观察，但须按实际缩放比例换算坐标。",
      "源码、服务健康、协议握手、实际任务与用户使用效果分开，不能用端口通或工具数量代替完成。"
    ],
    "failures": [
      {
        "condition": "Codex 原生浏览器或 computer-use 不能由普通 Node 直接启动",
        "response": "保留精确错误；现有 MCP 桌面已完成浏览器操作，按实际任务选现成替代入口，不扩大为电脑不能操作。"
      },
      {
        "condition": "服务不健康或恢复后 Tailscale 映射缺失",
        "response": "先按本机活动配置检查系统服务、交互 worker、维护任务、回环端口与 OAuth；再增量恢复 /computer 及两条 /.well-known 映射。副机只恢复 tailnet Serve；保留其他转发，禁止 reset 整个 Funnel。"
      },
      {
        "condition": "域名、端口或账号连接改变",
        "response": "同步核对机器登记、OAuth 回调和 Password Center 精确来源，再由对应账号重新授权；不把旧令牌或可达性当作新连接成功。"
      },
      {
        "condition": "长 GUI 流程往返较多",
        "response": "使用现成脚本或合并独立命令减少往返；测量真实流程耗时后再比较路线，不先判整个能力不值得用。"
      }
    ],
    "sources": [
      { path: "E:\\PCConfig\\tools\\secondary-laptop-access\\invoke_configured_mcp_tool.py", role: "复用现有配置/OAuth的短期官方app-server调用、原结果查询和禁止重放" },
      { path: "E:\\PCConfig\\tools\\remote-computer-mcp\\Manage-PrivateRelay.ps1", role: "备用传输状态、旧转发退役、精确监听移除与失败回滚" },
      {
        "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md",
        "role": "真实 Work 任务结果、时间样本、客户端边界与维护恢复入口"
      },
      {
        "path": "E:\\PCConfig\\registries\\remote_computer_mcp.json",
        "role": "当前机器路径、端口、固定入口、OAuth 客户端与凭据来源登记，不含可复用凭据值"
      },
      {
        "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\server.py",
        "role": "规则握手、ComputerContext、ReadDocument 与工具服务实现"
      },
      {
        "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\Manage-RemoteComputerMCP.ps1",
        "role": "按本机 ConfigPath 管理开机服务、交互 worker 与管理员/SYSTEM 维护任务"
      },
      { "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\boot_service.py", "role": "SYSTEM 监督、服务前端、健康恢复与普通工具不重放" },
      { "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\session_bridge.py", "role": "登录用户命名管道与真实桌面工具执行" },
      { "path": "E:\\PCConfig\\tools\\remote-computer-mcp\\Invoke-RemoteMaintenance.ps1", "role": "按需双队列、实际身份、Unicode 输出、超时与结果查询" },
      { "path": "E:\\PCConfig\\registries\\remote_computer_mcp.secondary_laptop.json", "role": "副机端口、独立规则与凭据标识、活动部署和回滚来源" },
      { "path": "E:\\PCConfig\\tools\\secondary-laptop-access\\README.md", "role": "副机实际部署、共享依赖升级、恢复与未验冷启动边界" },
      {
        "path": "GPT-5.6 in ChatGPT",
        "href": "https://help.openai.com/en/articles/20001354-gpt-5-6-in-chatgpt",
        "role": "官方说明 Chat 与 Work/Codex 用量分开；极高和 Pro 取决于账号套餐，Pro 也有自身使用限额"
      },
      {
        "path": "Developer mode and MCP apps",
        "href": "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt-beta",
        "role": "官方 MCP 接入与客户端支持说明；具体账号和手机界面仍以实际入口为准"
      }
    ],
    "verification": ["2026-09-14本次只读Manage-PrivateRelay Status回读WLY/service_front_direct、peer_binding_verified=true、legacy_portproxy_absent=true、direct_listener_present=true、firewall_matches=true、listener_present=true、ip_helper_required=false；peer_acceptance仍requires_remote_probe，只证明本机入口与精确防火墙，未重跑对端业务或故障注入。","源提交 9bfc0d8 实现登录前服务，b3bd30e 修复维护 Unicode 输出，6f211c3/4d50ef1 补齐副机部署、依赖更新与恢复；本轮只读核对这些来源和两机活动服务，没有重启、安装或故障注入。","2026-09-09 21:49 UTC 两机各运行一次 Status/MaintenanceStatus：healthy=true、maintenance_healthy=true、interactive_ready=true，Auto/LocalSystem、Session 0 单监听和用户会话均可回读，两路维护任务 pass、无触发器、WakeToRun=false。","2026-09-09 21:48 UTC 当前 Codex 经 secondary_laptop 的 ComputerContext 返回 LAPTOP-E48N0DRJ、host_scoped_rule_file_verified、S-1-5-18/Session 0；普通 PowerShell 返回 C:\\Users\\wly 的真实用户身份与 PowerShell 7.6.4。随后通过 SYSTEM 维护入口读取副机恢复状态，证明此连接确实执行于目标电脑。","副机 Owner 已记录共享 worker hang、front exit、front hang、supervisor exit 四类故障恢复及 SYSTEM/23 工具/用户管道回归通过；这些已有验收未在本轮重放，也不能替代物理重启后的 no-user（尚无用户登录）跨机验收。","2026-09-09T03:52:32.5352360Z 根任务通过当前已连接电脑 MCP 调用 ComputerContext，实际返回 verified E124；PowerShell 实际返回7.6.4、6×7=42、websiteSourceExists=true、exit=0。此证据是Codex客户端→MCP→WLY，只证明这条当前只读路径，不称手机Chat/极高/Pro验收。","2026-09-09 03:34 UTC 本机 Status 为 healthy=true、任务 Running、127.0.0.1 单监听。源 README 历史协议验收保留 22 工具，E122 根经旧 initialize、新 discover 与固定 HTTPS 返回；不改写成手机端采纳测试。","2026-09-09 Work 代表任务完成中文文件创建/读回/清理、命令与现成脚本、文本/DOCX/PDF/XLSX 片段、已有外部 Chrome 导航、临时表单下拉/勾选/附件/提交及 SHA-256 回读；未启动本机 Codex 模型代做。","该 Work 调用样本：文档片段约 0.91–1.23 秒；单次点击/输入约 1.5–5.7 秒；整套表单约 123 秒含观察与模型轮间处理。握手 0.49–0.81 秒是本机客户端样本；二者均不冒充手机或同任务 Codex 性能对照。","Chat/Extra High/Pro 属于有官方用量依据的使用例子；本轮没有独立读取实际客户端模型与思考档位，没有重新验收手机插件安装、第二账号或所有网站。","本轮主机ComputerContext、FileSystem/PowerShell与SYSTEM维护只读检查实际成功；保留9月11日特定客户端、9月15日两机23工具与四项输出合同的原日期证据，不外推到每个手机App、模型或写工具。"],
    "relation": "PCConfig 拥有这台电脑的服务、端口、任务、凭据来源与恢复；.agents 拥有活动规则、授权及协作语义；对话客户端拥有实际模型、额度和能力支持；具体项目继续解释自己的文件与业务。",
    readerStatus: "电脑端工具与主机实际执行已有验证；当前客户端是否提供相应工具、能否操作桌面和断电后接回仍分别确认。"
  },
  {
    "slug": "owner-takeover",
    usageEntry: "在当前 Codex 对话直接说“我要给这个任务两小时无限制授权”或说明你需要的时长。AI 打开现有接管窗口，你在窗口里填写时长并亲自验证；不用自己运行命令。验证后仍在原任务继续，并沿用原来的到期时间。",
    usageInputs: ["本次接管要做的事", "0.5～72 小时内的具体时长", "现有已登记验证方式"],
    productFlow: [
      {
        "title": "窗口显示这次授权的边界",
        "detail": "本人可见的窗口显示范围、时长和预计截止；若要把授权扩大到其他对话，必须由本人主动选择；AI 不代填或续期。"
      },
      {
        "title": "验证后按原截止使用",
        "detail": "通过现有方式确认后，宿主消费真实范围和固定截止，不因换会话或重开程序重新计时。"
      },
      {
        "title": "到期或取消分别处理",
        "detail": "任务报告已完成动作；到期停止相应权限，取消未完成的一次验证不会抹去其他仍有效的资料期。"
      }
    ],
    "shortTitle": "无限制授权",
    "title": "本人主动接管：填一次时长，按原截止办理",
    "teaser": "需要暂时让自己的明确指令优先时，直接用现有窗口验证；不是请另一个AI批准，也不是永久或固定24小时授权。",
    "status": "无限制授权统一小时输入与 B2 P1/P2 共享生命周期已正式安装复验；P3 真实加密合成实验已通过，真实资料迁移与生产部署仍未完成",
    "statusTone": "mixed",
    "value": "我想在明确的一段时间内亲自决定后续操作，而不是被自己以前写下的规则反复挡住。这个入口让我选择范围、填写时长并完成一次本人验证；之后AI仍要讲清风险、保留原件和协调其他工作，但不再把额外模型批准当成第二道门。",
    "why": "直接说“无限授权”不能证明实际权限成立；反过来，已经明确请求本人验证，也不该先要求一份还没有的授权。独立入口解决这个循环，同时避免一次许可在重连或换模型后偷偷变成永久。",
    "example": "“给当前对话开两小时本人授权，我自己验证；别扩到其他对话。”打开窗口后我只需核对范围、填写时长和验证。系统再读回同一请求的真实结果，两小时到了或我撤销后停止使用，不重开窗口续期。",
    "result": "拿到是否已生效、作用范围和准确截止；取消、失败、过期和撤销分别说明。对话或后代做出的文件/命令结果还要各自回读，授权成立不是业务已经完成。",
    "readerStates": {
      "pass": "本人验证实际成功，范围和原期限匹配，才消费本次限时授权。",
      "problem": "取消终止本次申请，不撤回别的有效授权；效果未知先查询原请求，不自动再次弹窗。",
      "unavailable": "缺本人验证条件、实际工具或对应会话时说明具体缺口，不借另一机器或对话身份。"
    },
    "decisionImpact": [
      "本人主动入口不用先派指定模型或建立CoreGoal；四类本人验证任选已有可用方式。",
      "默认当前对话，扩大为本机全部对话需要明确选择；时间由本人填写，旧已颁发期不因新默认改变。",
      "自有规则可在真实授权范围内被本人明确指令覆盖；系统/开发者/平台要求、密码学事实与真实工具能力不能伪造。",
      "同一授权保持原截止，必要执行链不另颁一个更长窗口；新对话和另一电脑不自动继承。",
      "私人资料解锁、密码明文与设备保护是独立用途，限时授权不自动重开资料。"
    ],
    "problem": "避免用户主动授权被循环审批，同时防止会话串线、隐式扩范围和重复验证造成错误权限。",
    "implementation": [
      "已安装入口为C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-OwnerTakeover.ps1，正式Open自动生成应用配对与请求；内部引用不显示在用户窗口，也不是原生聊天线程ID。",
      "Codex调用者只传当前宿主提供的HostTaskId；MCP不借用Codex身份。Open完成必要Windows提权并启动独立窗口，不新建计划任务，不把管理员能力当本人验证。",
      "当前正式安装窗口直接使用共享时长控件：默认 8 小时，可填写 0.5～72 小时小数并显示规范化分钟与预计截止；默认范围当前对话，global 只有本人主动选择才生效。修改默认不改写已经颁发的原截止。",
      "本人操作结束后以同一SessionRef/RequestId查询Status；正常路径不串行重复Check/CheckHost、readiness或同步等待Configure。响应丢失先查原请求，不重复弹窗。",
      "Passkey、TOTP、Recovery、Account是四类本人验证；Google/Microsoft是Account提供方。Passkey是WebAuthn凭据，不是指纹/PIN别名；窗口已打开和因子真实成功分别记录。",
      "原授权及其截止由owner_takeover_runtime和Broker保存，必要本地子进程/MCP维护链消费同一session/request/expires_at。会话错配、过期、撤销或已有终态在效果前拒绝，不从旧回执复活。",
      "B2 前置正式安装完成 AuthorityHost epoch220 并回读 32/32 文件一致；窗口不显示内部配对/请求/线程号但保留内部绑定。取消/超时/失败是独立结果，可信取消不自动重试，也不撤销另一段仍有效的 B2 资料期。",
      "临时接管优先级不降低协作质量：AI仍独立判断方案、说明真正风险与正在工作的Owner，用户了解后明确继续则执行可执行范围，并承担保全、恢复和实际验收。"
    ],
    "flow": [
      "本人明确申请限时授权。",
      "用现有Open进入独立窗口，不先要求另一个AI审批。",
      "本人填写有限时长和范围并完成一次已登记验证。",
      "查询同一请求Status，核对真实范围、原截止和终态。",
      "授权内继续工作并回读效果；到期、撤销或取消按各自语义收口。"
    ],
    "concepts": [
      {
        "term": "应用配对与原生线程",
        "explanation": "配对引用用于这个产品防串线，原生线程由实际宿主提供；不是让本人复制核对的一堆编号。"
      },
      {
        "term": "原截止",
        "explanation": "本次真实验证后颁发的期限；续聊、后代和重新连接不延长。"
      },
      {
        "term": "Open / Status",
        "explanation": "打开本次本人操作与读取其结果，既有两个正常入口；读状态不会重新验证。"
      }
    ],
    "boundaries": [
      "本网站不签发授权，也不读取源任务的真实因子或消费其许可。",
      "没有永久、固定 24 小时或按消息滑动续期；新表单默认 8 小时、合法范围 0.5～72 小时，扩大到 global 须本人主动选择。",
      "不伪造平台能力、会话绑定、验证、密码学或外部执行事实。",
      "B2 P1/P2 共享生命周期与统一时长已正式安装复验；P3 真实加密合成实验另有独立验收，真实私人资料迁移、正式生产部署和生产安全关闭仍未完成。"
    ],
    "failures": [
      {
        "condition": "本人取消或请求超时",
        "response": "只终止本次未完成请求，不自动改因子重开；原有其他有效授权继续到原截止。"
      },
      {
        "condition": "配对、线程或原截止不匹配",
        "response": "停止消费此授权，不换编号或继承另一对话。"
      },
      {
        "condition": "调用回执丢失",
        "response": "先读同一请求状态和已产生效果，不盲重复验证或操作。"
      }
    ],
    "sources": [
      {
        "path": "E:\\PCConfig\\tools\\Invoke-OwnerTakeover.ps1",
        "role": "现行Open/Status、独立窗口与宿主绑定源码"
      },
      {
        "path": "E:\\PCConfig\\tools\\owner_takeover_runtime.py",
        "role": "有限期、取消、撤销与结果状态"
      },
      {
        "path": "E:\\PCConfig\\docs\\design\\owner-takeover.implementation.pending.md",
        "role": "来源Owner19日安装、实际本人链及纠错记录；只取工程结论"
      },
      {
        "path": "E:\\.agents\\releases\\E154\\docs\\contracts\\agents.authorization.md",
        "role": "本人主动入口和有限范围的现行语义"
      }
    ],
    "verification": [
      "2026-09-19 来源 Owner 先记录正式 Open、本人 Passkey、Status 及真实普通子 PowerShell 和管理员期限传递；随后 357d0d8 将统一 0.5～72 小时时长、默认 8 小时与 B2 P1/P2 共享生命周期完成正式安装复验。",
      "B2 前置安装回读 AuthorityHost epoch220、32/32 文件一致；安装版相关后端/消费者/权限与合成资料回归、共享 UI 和密码中心连续交互已有来源验收。物理新机、正式生产 P3、真实私人资料迁移、P4 恢复和全部客户端真人体验仍未被这些结果证明。",
      "本网站只读回读 PCConfig 当前 main=b08e21f6 与活动 E156；没有重复验证本人、颁发授权、读取私人正文或调用高权限业务。"
    ],
    "searchProjection": {
      "intents": [
        "给当前对话申请两小时本人授权",
        "取消本人验证会不会撤回其他授权",
        "限时授权怎样保持原截止"
      ],
      "entities": [
        "OwnerTakeover",
        "无限制授权",
        "Open",
        "Status",
        "Passkey",
        "TOTP",
        "Recovery",
        "Account"
      ],
      "relations": [
        "本人主动验证不同于AI疑虑判断",
        "授权生效不同于动作完成",
        "同一请求保持原截止"
      ],
      "failureRecovery": [
        "取消不自动重试",
        "过期撤销不复活",
        "错配不借其他会话"
      ]
    },
    "relation": "本模块拥有本人主动限时授权的产品用法与运行证据；.agents解释授权语义，秘密模块负责凭据，资料共享期与独立设备保护分别办理。",
    readerStatus: "限时授权窗口与共同资料期限已有安装验证；本人须实际填写范围和时长并完成验证，授权成立不等于后续业务已经办完。"
  }
];

export const project = pcconfigProject;
export const modules = pcconfigModules;
