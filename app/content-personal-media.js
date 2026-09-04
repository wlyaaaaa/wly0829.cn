import { createProjectSnapshot } from "./project-snapshot.js";

const OBSERVED_AT = "2026-09-03T00:20:15.9437585+00:00";
const SOURCE_RECEIPT = "personal-media-current-acceptance.v1";
const SOURCE_RECEIPT_SHA256 = "eaedb81b012a77f6da303c361b862aad4a4a8faac66b7e2618cbed36e5e8d72f";

const current = Object.freeze({
  catalogRows: 24360,
  visualRows: 20530,
  imageRows: 20154,
  videoRows: 376,
  audioRows: 3830,
  recordingRows: 3823,
  musicRows: 6,
  ringtoneRows: 1,
  selectedImageRows: 1145,
  selectedVideoRows: 37,
  selectedRows: 1182,
  selectedBytes: 25145231785,
  screenshotImageRows: 15823,
  screenshotOcrEvidenceRows: 6440,
  screenshotVisibleTextRows: 4287,
  queryWallMs: 239,
  queryWallLimitMs: 750,
  queryProcessLimitMs: 250,
  recoveryItems: 6262,
  recoveryBytes: 56999686276,
  cloudCandidates: 6342,
  cloudBytes: 72384351875,
  tests: 45,
  skipped: 2,
  sourceFiles: 7
});

const bytesToGiB = (value) => `${(value / 1024 ** 3).toFixed(1)} GiB`;

const personalMediaSnapshot = createProjectSnapshot({
  observedAt: OBSERVED_AT,
  label: `${current.imageRows.toLocaleString("zh-CN")} 张照片、${current.videoRows.toLocaleString("zh-CN")} 个视频、${current.audioRows.toLocaleString("zh-CN")} 个音频可检索；精选 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频；手机恢复包低于 60 GB；云端仍为 upload=0`,
  boundary: `本页读取了 ${SOURCE_RECEIPT}、项目规则、人类入口、两个生产模块和测试结构，并把用户明确授权的实拍原图作为画廊。${current.skipped} 项需要指定真机的受保护清理测试本轮未运行；因此源码与当前目录通过不冒充手机已经连接、清空或云端已经上传。`,
  metrics: [
    { label: "照片", value: `${current.imageRows.toLocaleString("zh-CN")} 张` },
    { label: "视频", value: `${current.videoRows.toLocaleString("zh-CN")} 个` },
    { label: "音频", value: `${current.audioRows.toLocaleString("zh-CN")} 个` },
    { label: "精选", value: `${current.selectedRows.toLocaleString("zh-CN")} 项` }
  ],
  facts: [
    { label: "当前目录", value: `一个可删除重建的 SQLite 目录当前合计定位 ${current.catalogRows.toLocaleString("zh-CN")} 个原件：${current.imageRows.toLocaleString("zh-CN")} 张照片、${current.videoRows.toLocaleString("zh-CN")} 个视频和 ${current.audioRows.toLocaleString("zh-CN")} 个音频；音频按 authority locator 分为 ${current.recordingRows.toLocaleString("zh-CN")} 段录音、${current.musicRows} 个音乐文件、${current.ringtoneRows} 个铃声。数据库不保存媒体字节。` },
    { label: "当前精选", value: `产品只有一个“精选”入口，物理上分别落在 E:\\Pictures\\精选与 E:\\Videos\\精选两个同类型主文件夹，不混装、不设数量上限或下限，也没有子目录。当前为 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片、${current.selectedVideoRows} 个视频，共 ${current.selectedRows.toLocaleString("zh-CN")} 项、${bytesToGiB(current.selectedBytes)}；E/G 两盘 ${current.selectedRows.toLocaleString("zh-CN")}/${current.selectedRows.toLocaleString("zh-CN")} 逐项 SHA-256 与 catalog 一致。` },
    { label: "截图文字与画面认知", value: `${current.screenshotImageRows.toLocaleString("zh-CN")} 张截图图片中，${current.screenshotOcrEvidenceRows.toLocaleString("zh-CN")} 张（40.7%）带现有 OCR 证据，${current.screenshotVisibleTextRows.toLocaleString("zh-CN")} 张（27.1%）已把文字结构化到 visible_text；另有旧 OCR 文字仍位于 description。媒体库负责统一检索和画面语义，LocalOCR 只提供精确文字证据；当前不为低价值截图无差别重跑全库。` },
    { label: "手机恢复包", value: `${current.recoveryItems.toLocaleString("zh-CN")} 项、${bytesToGiB(current.recoveryBytes)}，仍低于 60 GB 产品上限；录音不进入手机最小恢复包。` },
    { label: "云端候选", value: `${current.cloudCandidates.toLocaleString("zh-CN")} 项、${bytesToGiB(current.cloudBytes)}；upload=0，当前没有上传授权，也没有发生上传。` },
    { label: "性能", value: `现行 acceptance 外层精确查询墙钟 ${current.queryWallMs} ms，低于 ${current.queryWallLimitMs} ms 目标；进程内小结果目标低于 ${current.queryProcessLimitMs} ms，由单元 perf_counter 独立验收。大结果成本只允许随真实返回或 hardlink 数量增长；日常查询不读取完整 NDJSON。` },
    { label: "源码边界", value: `只有 personal_media.py 与 phone_file_preserve_clear.py 两个生产模块；无服务、队列、后台任务或第二数据库。`, hero: false },
    { label: "验收", value: `${current.tests} 项测试 0 失败、0 错误；${current.skipped} 项指定真机清理测试跳过；验收绑定的 ${current.sourceFiles} 个源码文件当前哈希仍一致。`, hero: false },
    { label: "当前代承诺", value: `${SOURCE_RECEIPT} completed=${OBSERVED_AT}，SHA-256=${SOURCE_RECEIPT_SHA256}；catalog=2d8fdd3f9c44d866fa3ea1b198102aaea4d16182cae2b579338850ce80f0d9c3，seed=9de9cb15052b04d6ea9a73697ea67ab7057f829717db598b6d47d96046f95223，phone-plan=432176949c4db3787d98d38f9e255012d8d943c98b4bd365ac02fbdef8af1cd4，cloud-plan=419978012fde158d6e59e0355d2cbd5d0653184186bbe626ab8ec06c8cd35a9c。`, hero: false },
    { label: "当前技术路径", value: "catalog=E:\\Media\\_manifests\\personal-media-current\\catalog.sqlite3；seed=E:\\Media\\_manifests\\personal-media-current\\seed\\keeper-search-index.ndjson；phone-plan=E:\\Media\\_manifests\\personal-media-current\\phone-recovery-plan.ndjson；cloud-plan=E:\\Media\\_manifests\\personal-media-current\\cloud-candidates.ndjson；phone-runs=E:\\Media\\_manifests\\phone-shared-full-preserve-successor-v2\\runs；phone-E=E:\\Media\\PhoneSharedFullPreserve；phone-G=G:\\80_Backup\\PersonalMedia\\PhoneSharedFullPreserve；phone-package=G:\\80_Backup\\PersonalMedia\\PhoneMediaRecovery\\2026-08-25；G canonical mirrors=G:\\80_Backup\\PersonalMedia\\Pictures、G:\\80_Backup\\PersonalMedia\\Videos、G:\\80_Backup\\PersonalMedia\\Music\\录音、G:\\80_Backup\\PersonalMedia\\Music\\音乐、G:\\80_Backup\\PersonalMedia\\Music\\铃声。", hero: false },
    { label: "七份源文件承诺", value: "AGENTS.md=354837b94408215e7458ebb220662eb60c4595e3e35438acb227040da0814a02；README.md=606105f17bd38ee2a465c3d7d57db59a49b39fc20cf55113e54812e52ca9532d；personal_media.py=488a70550c0951ed0a885d1f528b13d750e8ff483ff2ce42bc064a8eabe2a72c；phone_file_preserve_clear.py=02534519e8b746fa69e6855eaace467517d06f99259f30be678c9f2f2e3203cb；test_personal_media.py=09969d59fb88de2f95972081c7e277ef1da8049f86d71118a9e7de9a598b3739；test_phone_file_preserve_clear.py=681d656f7d15b2a8a77e67078d7ea1a8e2776e1aeb8c39337f9cbb75675507d9；acceptance.ps1=21a30000dd626610d18c77e55cd517336dd8294fa91834abdee7c01bdbc2adca。", hero: false },
    { label: "现有每日备份关系", value: "PersonalDataReplica-Hot-Daily 每日按本机时间 02:10 运行，复用五组 E→G 镜像；E:\\Media 整体对应 G:\\80_Backup\\PersonalMedia\\Media，没有单独排除 Packages。任务先维护两库已登记清单，再镜像，最后同步 G 上的手机恢复包；不连接手机、不上传云。旧命名的 G:\\80_Backup\\PersonalMedia\\Packages 是已有归档位置，不冒充当前这条镜像路径或本次回读。", hero: false }
  ],
  gaps: [
    "本人删除原件后，查询只跳过不存在的结果；现有每日备份任务依次更新两库清单、完成 E→G 镜像、同步实际手机包。源根或卷不可访问时不按全库已删除处理，恢复连接后使用同一路径继续；没有新增删除保护、恢复队列或计划任务。",
    "本轮没有连接手机；双盘保全、精确清理和恢复写回只展示已实现合同与现行回执，不宣称当前设备动作已经发生。",
    "手机 backup receipt 当前固定 h_cold_backup=not_used_current_h_health_warning；双盘只指 E/G 两份异卷回读，不表示 H 冷备或第三份离线副本已经参与。",
    "云候选清单仍是 upload=0；页面不把候选、相册名或恢复计划冒充 Google Photos 已上传结果。",
    "当前项目没有 Google Photos 上传执行器、账号连接或外部回读；自动增量只处理本次允许的 new_hashes，不自动补齐历史歧义候选。",
    "当前目录没有全库人物证据；只能在用户选定少量原图后回答可逆的 person:self 问题，不能宣传人物搜索。",
    "phone-apply 的 review 覆盖、pre-commit 回滚和 post-commit seed/candidate 恢复目前缺少直接 fault-injection 专项回归；三份候选/receipt 文件也不是跨文件原子事务。",
    "无法打开、内容意义不明或近重复关系不确定的对象保留为待复核，不因自动化或页面美观直接退出原件。",
    "画廊证明这些实拍原图与当前视觉选择，不证明全部地点、类别、设备或媒体库覆盖都具有相同画质。"
  ]
});

const stateLabels = ["成功时", "发现问题时", "入口不可用时"];

const personalMediaProject = {
  order: 1,
  slug: "personal-media",
  title: "个人媒体整理与恢复",
  route: "/projects/personal-media",
  visibility: "本地私有项目",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: `${current.imageRows.toLocaleString("zh-CN")} 张照片、${current.videoRows.toLocaleString("zh-CN")} 个视频、${current.audioRows.toLocaleString("zh-CN")} 个音频已形成可检索目录`,
  cardStatusTone: "mixed",
  ...personalMediaSnapshot,
  kicker: "让照片、视频与音频真正可找、可看、可精选、能恢复，也尊重本人删除",
  searchAliases: [
    "个人媒体整理与恢复",
    "找照片视频录音",
    "按地点找旅行照片",
    "手机照片双盘保全",
    "照片分类和去重",
    "手机恢复包",
    "Google Photos 候选",
    "临时浏览照片",
    "精选照片和视频",
    "文件管理器删了就不要恢复",
    "原件不见了就当我不要了",
    "删除原件后退出手机恢复包和云候选"
  ],
  repositoryNote: "这是一个本地私有项目，没有公开 GitHub 仓库按钮。公开页完整说明产品、路径、组件、流程、测试、失败和恢复边界；普通个人照片不因来自私人媒体库而默认排除，具体 L3+ 值与可复用秘密仍逐值处理。",
  summary: "按记得的时间、地点、画面或已有文字，找到照片、视频和音频。值得重看的直接移入“精选”，不另存一份，也不为凑数量硬选。手机新文件先在两块盘上备份并核对，再离线分类、去重；备份和手机恢复包跟随现有计划任务更新。你自己删了原件就是删了，不用通知 AI。云端只准备候选，不自动上传。",
  why: "媒体最容易同时出现三种问题：想用时找不到；好照片淹没在分类目录里；换机或手机故障后只剩零散副本。把所有东西复制到第二套库、持续后台同步或自动上传又会制造更多状态。这个项目选择一个可重建目录、两个职责清楚的模块和逐次有界处理；同时把文件管理器中的原件现状当作本人决定，而不是让旧索引或恢复包反过来支配原件。",
  plainExample: "当前手机接入针对已绑定的小米 15 Pro（Android，设备型号 2410DPN6CC）；通过 ADB（Android 调试连接）读取它已登记的 0/999 两个共享文件区，不是任意手机通用入口。照片、视频和共享文档等在范围内，系统与应用私有数据不在范围内。例如手机新增旅行照片和视频，先把新共享文件逐项写入 E 盘本次副本和 G 盘异卷副本，回读大小与 SHA-256 通过就立即告诉我可以拔线。随后根据画面意义、质量、重复、类别和时间决定保留内容，归入当前照片/视频根，并同步手机恢复包和未上传的云端候选。",
  result: `我得到一组能回到原件的结果：检索候选带着日期、地点、类别和匹配依据；精选入口展示 ${current.selectedImageRows.toLocaleString("zh-CN")} 张值得主动重看的照片和 ${current.selectedVideoRows} 个视频；分类决定说明保留或退出原因；手机保全说明双盘是否完成、手机是否清空；恢复包说明当前可写回范围。云端部分得到面向 Google Photos 的本地候选清单和相册计划；当前项目尚无上传入口，批准候选也不等于这里已经能够上传，更不表示云端已备份。`,
  readerStates: {
    pass: "返回真实现存原件，或完成双盘保全、分类、恢复计划和云候选的对应步骤；每一步只声明自己真正闭合的结果。",
    problem: "重复、画面意义、质量、时间、地点、来源或恢复责任有歧义时保留候选与证据，缩小到需要人工判断的少量对象，不扩大成整库重做。",
    unavailable: "目录、原件、同卷硬链接、手机、异卷副本或计划文件不可用时只停止受影响步骤，保留已完成副本和精确缺口；不自动上传、不递归删除、不恢复出厂设置。"
  },
  stateLabels,
  methodCanvas: {
    kicker: "个人媒体全链路",
    headline: "先找到真实原件，再分类；本地新增与手机保全走各自精确入口",
    description: "查找、本地独立增量、手机双盘保全、分类和恢复是不同结果。它们共用同一批原件与可重建目录，但不互相冒充完成。",
    steps: [
      { actor: "自然请求", title: "用地点、描述、类别、类型或日期找", detail: "只把用户真正提供的线索变成最小过滤条件；现场地点与图片中出现的地名分开处理。" },
      { actor: "原件目录", title: "返回少量可核对候选", detail: "SQLite 条件与全文索引定位照片、视频和录音；authority locator 必须仍指向现存原件。" },
      { actor: "本地新增", title: "精确接入一个已复核文件", detail: "新 keeper source 目前必须能与 E canonical 建 hardlink（实践上同为 E 卷）；ingest-file 核对 SHA-256、媒体探测、类别和时间，写 G 恢复副本。等价视频容器变体另走 stream 等价合同。" },
      { actor: "视觉整理", title: "一次判断保留、类别与近重复", detail: "小批量最多 25 个对象组成一张联系表，把注意力留给画面意义、质量和主版本选择。" },
      { actor: "手机入口", title: "E/G 双盘逐项保全", detail: "两个异卷副本 bytes 与 SHA-256 回读通过后立即结束手机占用；清空状态另行报告。" },
      { actor: "三面收口", title: "本机、手机恢复包与云候选一起更新", detail: "keeper 进入当前目录；手机包保持不超过 60 GB；云端只写 upload=0 候选。" }
    ],
    columnsAriaLabel: "用户、个人媒体项目与外部目标之间的责任边界",
    columns: [
      { title: "用户只需提供", note: "自然线索和最终授权", items: ["想找什么、现场地点、类别、类型或日期", "近重复或意义难判时的最终选择", "云端上传、扩大来源或不可逆外部删除的精确授权"] },
      { title: "项目负责", note: "原件、证据与恢复", items: ["一个目录统一定位照片、视频和录音", "视觉分类、精确/高度近重复治理与 canonical 归位", "双盘保全、手机恢复计划和 upload=0 云候选"] },
      { title: "明确不做", note: "不制造第二套媒体系统", items: ["不另建服务、队列、计划任务或第二数据库", "不自动上传、不递归删除、不恢复出厂设置", "不从文件名猜人物，也不把分类结果升级成私人事实结论"] }
    ]
  },
  productPrinciples: [
    { title: "原件优先，不建第二相册", detail: "SQLite 只保存可重建定位与检索字段；照片、视频、录音字节继续留在 E:\\Pictures、E:\\Videos 与 E:\\Music\\录音。" },
    { title: "一个精选入口，照片和视频仍各归其库", detail: `精选不是第二份媒体，也不是固定配额。${current.selectedImageRows.toLocaleString("zh-CN")} 张照片直接移动到 E:\\Pictures\\精选，${current.selectedVideoRows} 个视频直接移动到 E:\\Videos\\精选；只按好看、独特回忆或不可替代价值判断，近重复取强者。` },
    { title: "文件管理器删除就是本人决定", detail: "原件删了就是删了，无须通知 AI。查询与状态只读；现有 PersonalDataReplica-Hot-Daily 依次调用两库 sync-current、五组 E→G 镜像和 recovery-sync --execute，让索引、备份与恢复包跟随当前文件，不从旧副本恢复原件。" },
    { title: "媒体库拥有统一检索，OCR 只是证据提供者", detail: "画面中的场景、事件和审美价值由视觉认知负责，逐字文字由 LocalOCR 负责；两类证据进入同一媒体条目与 SQLite/FTS，而不是再建一个 OCR 库。现有截图文字已能支持真实查询，老库只应按真实查询缺口增量补齐。" },
    { title: "私人来源不是公开禁区", detail: "普通个人照片按活动公开分级属于 L2；页面逐值处理真实 L3+ 与秘密，不因来源是个人媒体库就整类删除。" },
    { title: "本地新增一次只接一个已复核文件", detail: "ingest-file 必须显式 --execute，并可绑定 expected SHA-256；新 keeper 与等价视频容器变体使用不同合同，不从任意目录自动扩张来源。" },
    { title: "音频沿用既有分类与 ASR 定位", detail: "3,830 个音频按真实 locator 分为 E:\\Music\\录音 3,823、E:\\Music\\音乐 6、E:\\Music\\铃声 1；目录直接消费既有分类、时间、原件和可用 ASR 文字，不为接管所有权重新分类或重跑 ASR。对应 G 异卷副本继续保留。" },
    { title: "先保全，再整理", detail: "手机连接最昂贵的是占用设备和丢失风险；双盘回读完成就先结束连接，视觉判断与索引重建全部离线继续。" },
    { title: "分类必须回答内容意义", detail: "移动到目录不是分类。画面意义、质量、精确/高度近重复、时间和类别必须先形成决定；无法判断就保留待复核。" },
    { title: "三个产品面同次收口", detail: "一次成功验收的全局增量会依次更新本机目录、G 盘手机恢复计划和 Google Photos upload=0 候选；这三份文件不是跨文件原子事务，中途失败时以 candidate-refresh、plan-status 与 acceptance 识别半状态并重跑缺失刷新。" },
    { title: "可以拔了不等于清空了", detail: "双盘保全与手机端删除是两种独立状态；任何答复都必须准确说明哪一步完成。" },
    { title: "云端永远需要单独批准", detail: "项目可以生成候选与相册名，但没有用户查看清单并明确授权，就不会上传。" },
    { title: "速度约束技术复杂度", detail: "小批量普通归档不为一次批次新建模块、schema、状态机或全库回归；19 张普通截图从保全到可检索目标低于 4 分钟。" }
  ],
  responsibilities: [
    "按地点、文字、描述、类别、媒体类型与日期组合查找真实照片、视频和录音",
    `维护唯一精选入口：当前 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片与 ${current.selectedVideoRows} 个视频直接位于各自媒体库的“精选”主文件夹`,
    "创建同卷 hardlink 临时浏览目录，并只清理受管浏览链接，不删除原件",
    "通过 ingest-file 接入一个已经人工复核的本地照片、视频或录音，或证明并退休一个内容等价的视频容器变体",
    "对新增媒体做可打开性、画面意义、质量、精确/高度近重复、类别与时间判断",
    "把 keeper 归位到 E:\\Pictures、E:\\Videos 与 E:\\Music\\录音，并重建单一当前目录",
    "手机两个共享 profile 下的新 regular files（媒体、文档、ZIP、未知扩展名与技术缓存）先写入 E/G 两份异卷副本并逐项回读，再按类型离线分流",
    "维护不超过 60 GB 的手机照片/视频恢复包和 upload=0 的云端候选"
  ],
  exclusions: [
    "不把 Word、PDF、ZIP 等手机非媒体文件接入媒体 catalog；它们仍先进入 E/G 防丢保全与精确清理分母，之后交 personal-materials 或所属业务入口",
    "不建立人物全库扫描、人物索引或中央画像；少量选定原图的本人判断走独立能力",
    "不自动上传 Google Photos，也不把候选清单冒充云端完成",
    "不递归删除手机目录、不恢复出厂设置、不处理联系人、短信、聊天、账号、应用私有或系统数据",
    "不把技术缓存、缩略图、中间产物或可重建派生物冒充 keeper 原件",
    "不为了批次回放新增服务、队列、第二数据库或长期后台状态"
  ],
  glossary: [
    { term: "Keeper（保留原件）", meaning: "经过可打开性、意义、质量与重复关系判断后，仍承担浏览、唯一性或恢复价值的照片、视频或录音。" },
    { term: "Canonical root（规范原件根）", meaning: "照片、视频和录音当前应归位的唯一原件中心：E:\\Pictures、E:\\Videos 与 E:\\Music\\录音。" },
    { term: "Authority locator（权威原件定位）", meaning: "当前目录中指向现存原件的定位记录；返回候选前仍要确认真实文件存在。" },
    { term: "Exact duplicate（精确重复）", meaning: "完整内容 SHA-256 相同；可以合并 occurrence，但仍要核对唯一性、引用和恢复责任。" },
    { term: "Near duplicate（高度近重复）", meaning: "画面或内容非常接近但字节不同；必须根据主体、清晰度、裁切、时间和版本价值人工判断。" },
    { term: "Contact sheet（联系表）", meaning: "把最多 25 个视觉对象排成一张总览，让一次视觉判断覆盖整批，而不是逐张重复打开。" },
    { term: "Hardlink browse folder（硬链接浏览目录）", meaning: "同卷下指向同一原件字节的临时浏览入口；创建和清理都不复制或删除原件。" },
    { term: "精选", meaning: "值得本人主动重看的照片或视频集合；照片与视频各自留在自己的媒体库主文件夹，产品上只有一个入口，不设数量配额，也不复制原件。" },
    { term: "File-manager deletion（文件管理器删除）", meaning: "用户自己删原件即生效；查询跳过失效路径，既有计划任务维护清单与派生副本，不增加确认、保护或自动恢复流程。" },
    { term: "upload=0", meaning: "只进入云端候选清单，当前没有上传授权，也没有实际上传。" }
  ],
  operatingFlow: [
    { title: "先判查询类型", detail: "现场拍摄地点用 place；图片中出现的地名、文件名、录音文字和普通描述用 query；类型、分类与日期按用户线索叠加。" },
    { title: "直接查当前目录", detail: "SQLite 条件与全文索引返回少量结果；普通请求不读取完整 NDJSON，不扫描整盘。" },
    { title: "需要浏览才建临时目录", detail: "在 E 盘受管 browse 根创建 task-unique hardlink；原件仍只有一份，目录可精确清理。" },
    { title: "本地独立文件走显式 ingest", detail: "输入必须位于三个 canonical 根之外并携带描述；可选绑定 expected SHA-256。新 keeper 写入 canonical 与 G 恢复副本，等价视频变体先核对 E/G keeper 和 demuxed stream。" },
    { title: "手机先做双盘保全", detail: "只取得尚未由其他来源负责的新共享文件；分别写入 E 与 G，逐项回读 bytes/SHA-256。" },
    { title: "离线做视觉决定", detail: "机械预检合并 occurrence、检查可打开性和技术缓存；联系表一次决定 keeper、类别、时间、描述和近重复关系。" },
    { title: "把值得重看的原件移入精选", detail: "照片和视频分别进入各自库的精选主文件夹，按可靠时间与已确认信息重命名；不复制、不设配额，仍由同一 catalog 定位。" },
    { title: "事务应用本批决定", detail: "phone-apply 要求 review 精确覆盖本批唯一哈希；失败回滚数据库并清理本批新建链接。" },
    { title: "同步三面计划", detail: "刷新本机目录、G 手机恢复包与 Google Photos upload=0 候选；恢复同步默认 dry-run，云端仍等待单独授权。" },
    { title: "让备份和恢复包跟随当前文件", detail: "sync-current 维护 SQLite、重建种子和既有候选；原 E→G 备份负责镜像，recovery-sync 维护固定手机包和现存视频的格式变体。读取入口不做这些写入，离线后下次从当前集合重新同步即可。" }
  ],
  components: [
    { name: "personal_media.py", responsibility: "当前目录、检索、临时浏览、分类、独立本地接入、批次应用、恢复包与云候选。", implementation: "目录与状态核心使用 Python stdlib + SQLite/FTS；图片打开/缩略使用 Pillow，视频/音频使用 ffmpeg/ffprobe。项目不新增常驻进程；现有 PersonalDataReplica-Hot-Daily 调用维护和恢复包同步入口。" },
    { name: "phone_file_preserve_clear.py", responsibility: "手机共享文件捕获、E/G 双盘保全、逐项回读和精确清理。", implementation: "只处理明确共享边界；删除前再次核对精确路径、大小和哈希，不递归删目录。" },
    { name: "catalog.sqlite3", responsibility: "保存可重建的当前媒体定位与检索字段。", implementation: "当前 24,360 个 keeper；数据库不保存照片、视频或录音字节。" },
    { name: "按代原子替换的 current seed 与计划", responsibility: "重建目录，并分别表达手机恢复与云端候选。", implementation: "keeper-search-index.ndjson 会在增量收口时原子重写并推进 current_seed SHA，不是跨增量字节不变；它只作当前代重建种子，手机/云 NDJSON 是外部计划，三者都不参与日常查询或成为第二 current 索引。" },
    { name: "联系表与 review.json", responsibility: "把一批视觉判断压成一个完整、可复核决定。", implementation: "每张最多 25 个对象；状态必须为 PASS_NATIVE_VISUAL_REVIEW，且覆盖本批全部唯一哈希。" },
    { name: "受管画廊与浏览目录", responsibility: "让人查看真实结果但不复制媒体库。", implementation: "网页画廊使用用户授权的实拍原图和轻量缩略图；本机临时浏览使用同卷 hardlink。" }
  ],
  technicalContracts: [
    { artifact: "当前 SQLite 目录", schema: "personal-media.catalog.v1 / PRAGMA user_version=1", owner: "catalog-build、ingest-file、phone-apply 写；search/browse/plan 读", boundary: "只保存定位、分类、检索和关系；原件字节在 canonical roots。音频 locator→library_location 固定为录音/E_Music_Recordings、音乐/E_Music、铃声/E_Music_Ringtones，越界或声明漂移失败关闭。meta 绑定 current seed path/hash/rows。" },
    { artifact: "检索、导出与临时浏览", schema: "personal-media-search-index-entry.v1 / search-result.v1 / search-index-manifest.v1 / catalog-status.v1 / managed-hardlink-browse.v2", owner: "personal_media.py", boundary: "search 只验 locator 存在；精确字节需单项哈希。browse manifest 绑定 source/link，clean 遇非受管内容拒绝。" },
    { artifact: "手机视觉决定与应用", schema: "personal-media-phone-review.v1 / personal-media-phone-apply-receipt.v1", owner: "phone-prepare 生成 review；AI/用户补决定；phone-apply 消费", boundary: "review 必须 PASS_NATIVE_VISUAL_REVIEW 并覆盖本批唯一哈希；pre-commit 可回滚，post-commit seed/候选刷新不是跨文件原子事务。" },
    { artifact: "手机捕获、冻结删除与回执", schema: "phone-shared-user-files-capture.v2 / frozen-delete-plan.v2 / backup-verification.v2 / deletion-receipt.v2", owner: "phone_file_preserve_clear.py", boundary: "绑定 model、serial hash、profile、fresh run、manifest/plan hash、E/G read-back；stale artifact、残留 quarantine 或身份漂移均不能 PASS。" },
    { artifact: "手机恢复计划与同步", schema: "personal-media-phone-recovery-current.v1 / personal-media-recovery-sync-receipt.v1", owner: "candidate refresh 写计划；recovery-status 验结构/catalog；recovery-sync 比实际包", boundary: "低于 60 GB；录音不进入；execute 按当前清单补齐、更新并清理固定 Images/Videos 桶，不碰 E 原件或桶外内容。" },
    { artifact: "云候选与刷新回执", schema: "personal-media-cloud-candidate-manifest.v1 / cloud-candidate-current.v1 / product-candidate-refresh.v1", owner: "refresh_product_candidates 写；cloud-status 只读", boundary: "header 固定 upload_authorized/performed=false；命令只返回聚合，逐项/相册在 NDJSON，当前没有上传执行器。" },
    { artifact: "独立本地文件接入回执", schema: "personal-media-ingest-file-receipt.v1", owner: "ingest-file", boundary: "绑定 source/keeper SHA、canonical/G locator、source retirement 和候选新增数；cloud_upload 固定 0，失败不能冒充完整收口。" }
  ],
  usageExamples: [
    { ask: "找我在新加坡现场拍的照片。", effect: "用已复核 place 过滤图片，返回少量现存原件、已知日期、类别和匹配依据。", moduleSlug: "search-browse" },
    { ask: "这批截图哪些该留，哪些是重复或没意义？", effect: "一次机械预检加少量联系表，统一决定 keeper、secondary、类别、时间与精确/高度近重复。", moduleSlug: "classification" },
    { ask: "把这一个已经看过的本地照片/视频/录音接入媒体库。", effect: "显式核对输入哈希、媒体流、类别和时间，写入 canonical 与 G 恢复副本并同次刷新目录、手机恢复包和 upload=0 云候选；等价视频容器变体只保留恢复副本与关系后退休来源。", moduleSlug: "local-ingest" },
    { ask: "手机里的新照片先安全拿出来，我要尽快拔线。", effect: "完成 E/G 双盘逐项回读后立即报告可以拔线；手机端是否清空单独说明。", moduleSlug: "phone-preservation" },
    { ask: "现在手机恢复包能恢复多少？", effect: "只读返回当前计划数量、大小、是否低于 60 GB 和缺口；默认不改包。", moduleSlug: "phone-recovery" },
    { ask: "哪些照片准备以后传 Google Photos？", effect: "读取 upload=0 候选和相册计划；没有查看清单并明确批准就不上传。", moduleSlug: "cloud-candidates" }
  ],
  evidenceLayers: [
    { layer: "项目规则与 README", proves: "定义媒体 Owner、双盘保全、分类、三面收口、速度与不自动上传边界。", doesNotProve: "文字说明不证明当前目录、恢复包或设备在线。" },
    { layer: "两个生产模块", proves: "现行源码实现目录、检索、浏览、批次视觉决定、双盘回读、恢复计划与精确清理。", doesNotProve: "代码存在不证明本轮连接了手机或执行了外部动作。" },
    { layer: "独立本地文件接入", proves: "ingest-file 为新 keeper 和同视频流容器变体分别定义输入、E/G read-back、目录事务、来源退休与三面候选刷新。", doesNotProve: "入口存在不证明任意未复核文件都应接入，也不证明一次中断可以自动回滚所有外部文件动作。" },
    { layer: SOURCE_RECEIPT, proves: `${current.tests} 项测试 0 失败/错误、精确查询 ${current.queryWallMs} ms、恢复包 ${current.recoveryItems} 项且低于 60 GB、云候选 ${current.cloudCandidates} 项且未授权上传。`, doesNotProve: `${current.skipped} 项指定真机测试本轮未运行；回执也不证明所有原件今天仍可打开。` },
    { layer: "当前源码与代际哈希回读", proves: `验收绑定的 ${current.sourceFiles} 个源码/规则/测试文件，以及 catalog/current seed/phone plan/cloud plan，均与 SHA-256=${SOURCE_RECEIPT_SHA256} 的 ${SOURCE_RECEIPT} 一致。`, doesNotProve: "当前代一致不代表手机在线、云端已上传或每个原件都刚刚人工打开。" },
    { layer: "用户授权的实拍画廊", proves: "当前选择的原图真实存在，能够展示旅行、日常和其他视觉类别的画面质量。", doesNotProve: "少量好照片不证明整个媒体库均已逐张人工审美验收。" },
    { layer: "真机与云端动作", proves: "实际设备双盘保全、精确清理、恢复写回或云上传在对应动作后分别有结果。", doesNotProve: "任何一层不能替代另一层，也不能由页面或测试预先宣布完成。" }
  ],
  operationalEntrypoints: [
    { name: "按线索搜索", command: "py -3 personal_media.py search --place <现场地点> --media-type image --limit 12", purpose: "返回少量可读候选；普通请求不用 all，也不扫描整盘。" },
    { name: "建立临时浏览目录", command: "py -3 personal_media.py browse <过滤条件> --browse-root <受管同卷根> --name <任务名> --limit <数量>", purpose: "创建同卷 hardlink 供浏览，不复制原件字节。" },
    { name: "清理临时浏览目录", command: "py -3 personal_media.py clean --folder <精确受管目录>", purpose: "只删除该浏览入口；目录混入非受管内容时拒绝。" },
    { name: "接入一个本地 keeper", command: "py -3 personal_media.py ingest-file --source <已复核文件> --expected-sha256 <SHA-256> --category <类别> --description <说明> [--formation-date YYYY-MM-DD] [--tag <标签>] --execute", purpose: "写入 canonical 与 G 恢复副本、更新目录并刷新手机/云候选；源文件最终退休。" },
    { name: "退休等价视频容器变体", command: "py -3 personal_media.py ingest-file --source <变体视频> --expected-sha256 <SHA-256> --equivalent-keeper-sha256 <keeper SHA-256> --description <说明> [--tag <标签>] --execute", purpose: "只有 E/G keeper 与 demuxed video stream 完全核对后，保留 G 变体恢复副本与关系并退休来源。" },
    { name: "确认是否需要 fresh 捕获", command: "py -3 personal_media.py phone preserve-clear plan", purpose: "没有 run-id 时只返回 CAPTURE_REQUIRED，不列 live 候选，也不捕获、复制或删除。" },
    { name: "读取既有冻结计划", command: "py -3 personal_media.py phone preserve-clear plan --run-id <run-id>", purpose: "只读核对该 fresh run 的 manifest、delete plan 与边界；stale/invalid artifact 要求重新 capture。" },
    { name: "快速查看一次手机 run 的已记录状态", command: "py -3 personal_media.py phone preserve-clear status --run-id <run-id>", purpose: "只读汇总 capture/plan/backup/delete artifact 是否存在及 JSON 内已记录的 safe_to_disconnect、phone_clear_complete；不验 embedded hash 或当前 E/G 字节，也不判断 stale，完整 artifact 验真必须运行 plan --run-id。" },
    { name: "捕获到 E 盘并冻结计划", command: "py -3 personal_media.py phone preserve-clear capture", purpose: "取得本次新共享文件、写入独立 E 副本并返回 immutable run-id；尚未完成 G 双保全。" },
    { name: "写入 G 异卷副本", command: "py -3 personal_media.py phone preserve-clear protect-to-g --run-id <run-id>", purpose: "按冻结计划写 G 副本；仍需 verify-backup 才能宣布双盘保全完成。" },
    { name: "核验双盘并允许拔线", command: "py -3 personal_media.py phone preserve-clear verify-backup --run-id <run-id>", purpose: "逐项回读 E/G bytes 与 SHA-256；PASS 后才可以报告可以拔线。" },
    { name: "精确清理手机文件", command: "py -3 personal_media.py phone preserve-clear delete --run-id <run-id> --execute", purpose: "另行核对精确路径、大小、哈希和冻结计划后删除；不递归删目录，也不表示恢复出厂。" },
    { name: "准备视觉批次", command: "py -3 personal_media.py phone-prepare --run-id <本次运行>", purpose: "一次机械预检并生成每张最多 25 个对象的联系表。" },
    { name: "应用视觉决定", command: "py -3 personal_media.py phone-apply --review <review.json>", purpose: "事务应用完整 review，并在同次收口更新目录、恢复包与云候选。" },
    { name: "同步当前清单", command: "py -3 personal_media.py sync-current", purpose: "现有每日备份任务调用的本地维护：只按当前原件清理索引、种子和既有候选，不连接手机、不上传云、不自动填补其他历史候选。" },
    { name: "查看手机恢复状态", command: "py -3 personal_media.py recovery-status", purpose: "只读返回当前封印计划、数量、大小与缺口。" },
    { name: "同步手机恢复包", command: "py -3 personal_media.py recovery-sync [--execute]", purpose: "默认只预览；执行才补齐或更新计划内文件、移除固定 Images/Videos 桶内过时派生文件，不碰 E 原件或包外文件。" },
    { name: "查看云候选聚合状态", command: "py -3 personal_media.py cloud-status", purpose: "只读验证本地清单并返回 items/bytes/upload_authorized/upload_performed 聚合；逐项和相册在清单文件中，命令不上传。" },
    { name: "重建当前目录", command: "py -3 personal_media.py catalog-build --replace", purpose: "从当前代原子 seed 重建可删除 SQLite，并由 acceptance.ps1 重新验收。" }
  ],
  evolution: [
    { date: "2026-08-23—08-24", commit: "milestone-01", result: "形成独立本机的照片、视频与音频统一检索和临时浏览产品。" },
    { date: "2026-08-25", commit: "milestone-02", result: "建立手机新增共享文件的 E/G 双盘保全、可拔线节点，以及本机、手机恢复包、云候选三面收口。" },
    { date: "2026-08-26—08-27", commit: "milestone-03", result: "完成两个生产模块边界、精确/高度近重复治理、可重建单一目录与恢复包反膨胀。" },
    { date: "2026-08-30", commit: "milestone-04", result: "形成 current acceptance、单一 catalog、手机恢复计划与 upload=0 云候选的联合验收。" },
    { date: "2026-09-02", commit: SOURCE_RECEIPT, result: `完成不设配额的精选整理：${current.selectedImageRows.toLocaleString("zh-CN")} 张照片、${current.selectedVideoRows} 个视频分别直放各自精选主文件夹，E/G ${current.selectedRows.toLocaleString("zh-CN")}/${current.selectedRows.toLocaleString("zh-CN")} 哈希一致；随后实现可信文件管理器删除的目录/G/手机包/云候选收敛，以 ${current.tests} 项测试、${current.queryWallMs} ms 精确查询、6262/6262 恢复包 size-match 和 upload=0 重新封印当前代。生产 24,360 个 locator 全部存在，本轮真实退役为 0。` }
  ],
  galleryPresentation: {
    variant: "photo-showcase",
    kicker: "10 张公开视觉样本",
    title: "从目录到原图：十个画质与题材不同的旅行瞬间",
    description: "这十张照片是从媒体库中按画面质量、构图、色彩和题材选出的公开展示样本，与文件管理器中的完整精选集合不完全相同，也不是第二个精选入口。卡片只加载轻量预览，单击后显示字节未改写的完整原图。",
    prefetchAdjacentFull: false
  },
  gallery: [
    {
      src: "/media/personal-media/01-singapore-night-garden.jpg",
      thumbnail: "/media/personal-media/thumbs/01-singapore-night-garden.webp",
      categoryLabel: "新加坡 · 夜色与滨水花园",
      alt: "夜色中的滨水花园、蓝色树形灯光、玻璃温室与水面倒影",
      caption: "蓝色灯光、温室轮廓与水面倒影把城市夜色拉开成完整层次。",
      originalSha256: "f22fd6bc8b1e223ad460fb5cd937d5a1987e9e6f60154e85938b696fa4f02cac",
      originalBytes: 9421889,
      width: 8192,
      height: 6144,
      thumbnailPosition: "50% 48%"
    },
    {
      src: "/media/personal-media/02-wuxi-blue-hour-water-town.jpg",
      thumbnail: "/media/personal-media/thumbs/02-wuxi-blue-hour-water-town.webp",
      categoryLabel: "无锡 · 蓝调水乡",
      alt: "蓝调时刻的江南水乡、拱桥、游船、白墙黑瓦与水面灯影",
      caption: "暮色把桥、船、粉墙和灯影收进同一种安静的蓝。",
      originalSha256: "1990afa60bed00ff694ab67bf0a5b9e9bf5b3a5ad002f3f0114921bb7f3097db",
      originalBytes: 10726082,
      width: 8192,
      height: 6144,
      thumbnailPosition: "50% 50%"
    },
    {
      src: "/media/personal-media/03-guangzhou-city-dinner.jpg",
      thumbnail: "/media/personal-media/thumbs/03-guangzhou-city-dinner.webp",
      categoryLabel: "旅行与活动 · 城市餐桌",
      alt: "日光下临窗餐桌上的海鲜、小火锅和玩偶，与窗外江景和广州塔同框",
      caption: "临窗的一顿饭：广州塔与江景、餐桌上的海鲜和玩偶留在同一张照片里。",
      originalSha256: "63041fc9747f543d258841a02a185d7b6c211fc65078ac013455bed5ad8712e4",
      originalBytes: 7849273,
      width: 3072,
      height: 4096,
      thumbnailPosition: "50% 44%"
    },
    {
      src: "/media/personal-media/04-singapore-city-night-roads.jpg",
      thumbnail: "/media/personal-media/thumbs/04-singapore-city-night-roads.webp",
      categoryLabel: "新加坡 · 城市夜路",
      alt: "夜间高楼之间交错的立交道路、车灯与城市灯光",
      caption: "道路曲线从画面底部穿进高楼，把城市纵深完整带出来。",
      originalSha256: "a2f061c217aad0109de496f7678346586b1c3d57e94bdad2b7d1cb096bdaf0ec",
      originalBytes: 9562070,
      width: 6144,
      height: 8192,
      thumbnailPosition: "50% 55%"
    },
    {
      src: "/media/personal-media/05-singapore-tropical-canopy.jpg",
      thumbnail: "/media/personal-media/thumbs/05-singapore-tropical-canopy.webp",
      categoryLabel: "新加坡 · 热带花园",
      alt: "阳光下伸展的巨大树冠、蓝天、花卉与多层热带绿植",
      caption: "树冠撑满画面，阳光从枝叶间落进花与热带绿意。",
      originalSha256: "dc1c82ae6484d17be8fec2f678a9eb85107793df410773535bfdf704472383e2",
      originalBytes: 19920377,
      width: 6144,
      height: 8160,
      thumbnailPosition: "50% 42%"
    },
    {
      src: "/media/personal-media/06-singapore-harbor-from-air.jpg",
      thumbnail: "/media/personal-media/thumbs/06-singapore-harbor-from-air.webp",
      categoryLabel: "新加坡 · 高空港湾",
      alt: "夜间从飞机上俯瞰的港湾、海面船灯与远处城市灯光",
      caption: "冷暖船灯散在深色海面上，像旅程结束前的一张星图。",
      originalSha256: "55459150d7b03d5444219c86cd729ad880ee0a11c12ec24234c6a357e785f705",
      originalBytes: 7806916,
      width: 8192,
      height: 6144,
      thumbnailPosition: "50% 48%"
    },
    {
      src: "/media/personal-media/07-singapore-sculpture-skyline.jpg",
      thumbnail: "/media/personal-media/thumbs/07-singapore-sculpture-skyline.webp",
      categoryLabel: "新加坡 · 雕塑与天际线",
      alt: "橙红色公共雕塑与灰蓝色金融区高楼天际线",
      caption: "高饱和的橙红前景把灰蓝城市切出鲜明节奏。",
      originalSha256: "3e8a8b937c55df7aef2e118a01251fd04c64d7b6e49b44b7e724963a06ad613c",
      originalBytes: 14758949,
      width: 8192,
      height: 6144,
      thumbnailPosition: "50% 50%"
    },
    {
      src: "/media/personal-media/08-changi-jewel-rain-vortex.jpg",
      thumbnail: "/media/personal-media/thumbs/08-changi-jewel-rain-vortex.webp",
      categoryLabel: "新加坡 · 樟宜雨漩涡",
      alt: "樟宜 Jewel 室内瀑布、环形绿植、多层建筑与紫色台阶",
      caption: "垂直水幕贯穿多层花园，绿色和紫色把空间感推到最高。",
      originalSha256: "d69fcf82ace66197788291400e8ba1b5ab5398a8caccba6781d5298e38ec138b",
      originalBytes: 11394993,
      width: 6144,
      height: 8192,
      thumbnailPosition: "50% 44%"
    },
    {
      src: "/media/personal-media/09-shanghai-rainbow-sculpture.jpg",
      thumbnail: "/media/personal-media/thumbs/09-shanghai-rainbow-sculpture.webp",
      categoryLabel: "上海 · 彩虹雕塑",
      alt: "城市广场上流动形态的彩虹色公共雕塑与规整建筑背景",
      caption: "彩虹色曲线和规整建筑形成一张轻快、干净的城市画面。",
      originalSha256: "dd59269861d808bf6932e4d91b2533e44f60563c3027c68f2ccf509935a08194",
      originalBytes: 5597192,
      width: 4096,
      height: 3072,
      thumbnailPosition: "50% 52%"
    },
    {
      src: "/media/personal-media/10-singapore-rainforest-stream.jpg",
      thumbnail: "/media/personal-media/thumbs/10-singapore-rainforest-stream.webp",
      categoryLabel: "新加坡 · 雨林溪流",
      alt: "热带雨林中穿过苔石、落叶与多层植被的浅溪流",
      caption: "溪流形成天然引导线，把苔石、落叶和层层绿意串在一起。",
      originalSha256: "bd6424f558cb3f9b4e40238d8f0ec614e7366b19a74fa996967bf2bd7f254d6b",
      originalBytes: 20396920,
      width: 6144,
      height: 8192,
      thumbnailPosition: "50% 54%"
    }
  ],
  snapshotUpdateNote: "本页在个人媒体项目的查找、分类、手机保全、恢复、云候选、公开画廊或用户决策边界发生实质变化时更新。普通媒体增量只更新本地目录和计划；如果产品能力与公开解释仍然成立，不把每张新增照片变成网站更新日志。"
};

const commonModule = (definition) => ({ ...definition, stateLabels });

const personalMediaModules = [
  commonModule({
    slug: "search-browse",
    shortTitle: "查找与临时浏览",
    title: "一句描述回到真实照片、视频或录音",
    searchAliases: ["找照片", "地点搜索", "旅行照片", "截图文字 OCR", "图片认知", "LocalOCR", "文件管理器删了就不要恢复", "删除原件后退出恢复包", "浏览文件夹", "硬链接目录", "place query 区别", "FTS 媒体搜索"],
    searchProjection: {
      intents: ["按现场地点找照片", "按文字描述或截图 OCR 找媒体", "按画面语义找图片", "查看精选照片和视频", "本人删除原件后退出目录与恢复面", "按日期类别和类型过滤", "建立可清理的临时浏览目录"],
      entities: ["catalog.sqlite3", "authority_locator", "place", "query", "category", "media_type", "browse_root"],
      relations: ["现场地点使用已复核 place", "可见文字和普通描述使用 query", "SQLite 结果必须仍有现存原件", `唯一精选入口当前包含 ${current.selectedRows.toLocaleString("zh-CN")} 项`, "可信 canonical 原件缺失应表示本人主动退役", "browse hardlink 与原件共享字节"],
      failureRecovery: ["地点未登记不降级成文字猜测", "零命中只说明当前过滤与目录覆盖", "失效候选不占结果上限，查询不写库；清单与备份由现有计划维护", "混入非受管内容的浏览目录拒绝清理"]
    },
    teaser: "不需要记路径，也不需要把全部媒体复制进另一套库；地点、描述、类别、类型和日期足够把结果缩成一小组原件。",
    status: `${current.catalogRows.toLocaleString("zh-CN")} 个 keeper 可检索；acceptance 外层墙钟 ${current.queryWallMs} ms（目标 <${current.queryWallLimitMs} ms），进程内小结果目标 <${current.queryProcessLimitMs} ms；浏览目录使用同卷 hardlink`,
    statusTone: "pass",
    value: "把“我记得那张照片/那段录音，但不知道在哪”变成少量现存原件和一个可以直接看的临时目录。",
    why: "媒体路径、相册和命名常常与人的记忆方式不同；整库浏览太慢，第二次复制又会扩大容量和重复治理。",
    example: "说“找我在新加坡现场拍的照片”，系统用已复核 place 过滤图片；说“找图片里写着新加坡的截图”，则用 query，不把文字出现地点冒充拍摄现场。",
    result: "返回媒体类型、已知日期、地点、类别、匹配依据与原件；需要批量浏览时得到同卷 hardlink 文件夹，清理后原件不受影响。",
    readerStates: {
      pass: "候选 authority locator 指向现存原件；浏览目录的每个链接仍与原件是同一文件。",
      problem: "结果达到 limit、地点未登记、日期未知或私密标记未被本次请求包含时，明确过滤条件与仍可能漏掉的范围。",
      unavailable: "目录身份、SQLite、原件或同卷 hardlink 不可用时停止该次查询/浏览；不改走全盘扫描或第二索引。"
    },
    decisionImpact: ["普通请求默认返回小结果；只有用户明确要求完整集合才用 all。", `精确小结果宿主墙钟目标 <${current.queryWallLimitMs} ms，进程内目标 <${current.queryProcessLimitMs} ms；大结果耗时只允许随真实返回/hardlink 数量增长。`, "place 只表示已复核的现场地点，不能从文件名或图片文字推断。", `截图图片现有 OCR 证据 ${current.screenshotOcrEvidenceRows.toLocaleString("zh-CN")}/${current.screenshotImageRows.toLocaleString("zh-CN")}，结构化 visible_text ${current.screenshotVisibleTextRows.toLocaleString("zh-CN")}/${current.screenshotImageRows.toLocaleString("zh-CN")}；空值不等于没有文字。`, "LocalOCR 负责精确文字，视觉认知负责场景与意义；当前真实文字查询已经可用，所以不对 1.58 万张截图无差别重跑。以后只对新截图和真实未命中的有界候选补齐，并继续写回同一媒体条目。", "当前没有人物证据，不能用 person 做全库检索。", "3,830 个音频分为 3,823 段录音、6 个音乐和 1 个铃声；目录直接消费各自既有分类、时间、原件与可用 ASR 定位，不重新分类或重跑 ASR。", "音频缺少 ASR 时只降低文字 query 召回，不影响按类型、日期、既有分类或原件定位，也不把缺文字写成音频不存在。", "默认 search 只验 authority locator 当前存在，不计算 SHA-256；精确字节身份需要对选中原件单项计算并与返回的 content_sha256 比较。", "browse --verify-hash 只证明 source 与新 hardlink 字节相同，不自动把两者与 catalog content_sha256 比较。", "浏览目录只是入口，原件字节不复制。"],
    problem: "解决自然记忆与文件路径不一致、整库浏览成本高、临时导出重复占空间和旧 locator 指向缺失文件。",
    implementation: ["SQLite 保存结构化日期、地点、类别、类型、描述、visible_text 与全文索引。", "search 直接使用条件/FTS，不加载完整 NDJSON。", "历史截图文字来自 exact_localocr、逐项证据和少量原生视觉文字；2,184 条旧 OCR 结果仍在 description，其中 sufficient 982、low_confidence 1,202。LocalOCR objective sidecar 尚未成为全库统一绑定。", "录音行消费既有分类与 ASR 绑定文字，不触发音频模型；ASR 缺失时其他结构化轴继续可查。", "候选返回前要求 source.authority_locator 是现存本地文件。", "browse 在 E 盘受管根创建 task-unique hardlink，可选对小集合逐项核对哈希。", "clean 只接受精确受管目录并拒绝非受管内容。"],
    flow: ["压缩成最小可靠过滤条件", "执行 SQLite 条件/FTS", "确认原件仍存在", "返回少量候选", "需要时创建同卷 hardlink", "使用后精确清理浏览目录"],
    concepts: [
      { term: "place（现场地点）", explanation: "已人工复核为实际拍摄现场的地点证据。" },
      { term: "query（文字线索）", explanation: "普通描述、文件名、可见文字或录音/ASR 文字线索，不等于现场地点。" },
      { term: "FTS（全文检索）", explanation: "SQLite 内的快速文字召回；它与类型、类别、日期等结构化过滤一起使用。" },
      { term: "LocalOCR", explanation: "本地批量或精确文字识别能力；它提供逐字文字证据，不替代图片场景与审美判断，也不拥有第二套媒体目录。" }
    ],
    boundaries: ["不全盘扫描。", "不使用没有证据的人物过滤。", "不默认包含被标为 private 的结果。", "不复制原件进入知识库。", "清理浏览目录不删除原件。"],
    failures: [
      { condition: "place 未登记", response: "报告该现场地点当前没有复核证据；只使用用户另外提供的可靠过滤，不偷偷改成 query。" },
      { condition: "返回数等于 limit", response: "表述为前 N 条或至少 N 条，不宣称完整集合。" },
      { condition: "可信规范原件已由本人删除", response: "当前查询跳过该路径，不代用户删除或触发同步；现有每日任务移除失效索引与候选，并使 G 镜像和实际手机包跟随当前文件集合。" },
      { condition: "浏览目录混入外部文件", response: "clean 拒绝整个目录，保留原件和外部内容等待精确处理。" }
    ],
    sources: [{ path: "personal_media.py", role: "search、browse、clean、过滤与当前目录实现" }, { path: "catalog.sqlite3", role: "当前可重建定位与全文索引" }, { path: "test_personal_media.py", role: "查询、stale locator、limit、浏览、清理、路径与性能回归" }],
    verification: [`现行 acceptance 精确查询返回 2 项，外层墙钟 ${current.queryWallMs} ms；进程内目标 ${current.queryProcessLimitMs} ms 是另一种口径。`, "隔离回归证明查询/状态不改库，维护清理缺失项，空手机计划只清固定桶内派生文件，重复同步无额外删除，离线根不批删。", "复制数据库只刷新自己目录的种子，不沿旧绝对指针回写原库；JPEG 按真实图片打开性识别，不被 ffprobe 的视频流字段误分成视频。", `精选 ${current.selectedRows.toLocaleString("zh-CN")} 项保留原有 E/G 与 catalog 哈希证据；补齐后以当前计划与实际包回读核对，不把本地准备冒充手机写回或云上传。`, "画廊是媒体库的公开展示样本，不冒充完整精选集合。"],
    relation: "它是日常入口；分类与恢复改变目录内容，查询只消费当前目录，不拥有手机和云端动作。"
  }),
  commonModule({
    slug: "classification",
    shortTitle: "分类、质量与去重",
    title: "先看懂画面和重复关系，再决定原件去留",
    searchAliases: ["照片怎么分类", "照片怎样分类", "精选照片和视频", "好看的照片", "有回忆的照片", "截图分类", "精确重复", "近重复", "无意义照片", "contact sheet", "keeper"],
    searchProjection: {
      intents: ["判断新增媒体是否保留", "把值得主动重看的原件加入精选", "区分精确与高度近重复", "按画面意义分类", "快速处理小批量截图和照片"],
      entities: ["keeper", "occurrence", "content_sha256", "contact_sheet", "review.json", "category", "secondary"],
      relations: ["多个 occurrence 可共享一个内容哈希", "精确重复由 SHA-256 证明", "近重复需要视觉决定", "review 必须覆盖本批全部唯一哈希"],
      failureRecovery: ["不可打开对象保留缺口", "视觉不确定不自动退出", "review 漏项拒绝应用", "事务失败回滚数据库和本批链接"]
    },
    teaser: "分类不是把文件移动到一个目录；它必须说明画面是什么、是否值得留、哪个版本更好，以及退出后还能从哪里恢复。",
    status: `${current.visualRows.toLocaleString("zh-CN")} 个照片/视频 keeper；其中唯一精选入口为 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频。普通分类还包括屏幕截图 15,829，旅行与活动 1,927，日常生活 863，收藏与娱乐 713，工作与学习 424，文档与凭证 396，创作与编辑 57；另有“色情图片”“成人视频”两个真实分类能力，具体个人载荷与当前数量不在公开页复制`,
    statusTone: "pass",
    value: "让媒体库保留真正有浏览、唯一性或恢复价值的原件，同时不让重复、缓存和失误图淹没查找结果。",
    why: "文件名、目录和拍摄时间不足以判断裁切版、连拍、截图、模糊图和更好版本的关系；纯哈希也只能发现字节完全相同。",
    example: "一批 19 张普通截图先合并 occurrence、排除技术缓存，再在一张联系表里同时判断主体、信息价值、画质、类别和是否被更完整版本替代。",
    result: `每个唯一哈希得到 keeper/退出、主类、可选 secondary、时间、描述和重复关系；值得主动重看的原件还能进入唯一精选入口。当前精选为 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频，不设配额；成功完成 catalog commit、seed 与 candidate refresh 后，当前目录和两套计划才是一致收口。`,
    readerStates: {
      pass: "review 精确覆盖本批所有唯一哈希，视觉决定完整，事务提交后 keeper 定位与三面计划一致。",
      problem: "画面看不清、近重复关系不确定、唯一性或恢复责任未证明时保留原件/候选并只打开少量原图复核。",
      unavailable: "文件不可打开、联系表缺失或 review 状态不对时不开始应用；SQLite commit 前失败会 rollback 并清理本批新 E/G links。commit 后 seed 或 candidate refresh 失败会保留已验 keeper 与已提交 catalog，必须重跑刷新和 acceptance，不能声称全流程原子回滚。"
    },
    decisionImpact: ["精确重复退出仍要核对唯一性、引用和恢复责任。", "高度近重复是视觉判断，不由相似分数自动删除。", "精选不设上下限；好看、独特回忆或不可替代价值任一足够强即可，视频没有合适内容时可以为 0。", "精选只移动原件，不复制；照片和视频仍分别位于自己的精选主文件夹。", "phone-apply 的 near_duplicate_of 只允许本批 group，并要求指向本批 keeper；不能直接把新文件关联到既有 catalog keeper。", "跨批近重复需要另行人工核对并通过现有精确入口处理，当前没有同等自动关系命令。", "默认小批量快速路径只适用于不超过 100 个可打开对象；每张联系表最多 25 个，只重验本批变化。超过 100 时重新按真实规模规划，不能沿用 4 分钟目标。", "分类完成前不把移动到根目录称为完成。", "“色情图片”“成人视频”两个分类身份公开保留，具体个人载荷与当前数量逐值处理。"],
    problem: "解决精确重复、裁切/连拍近重复、缓存、模糊失误、类别混乱和只移动不理解内容。",
    implementation: ["机械预检按 SHA-256 合并 occurrence 并检查可打开性与技术缓存。", "contact sheet 每张最多 25 个对象，避免逐文件重复工具调用。", "review.json 要求 PASS_NATIVE_VISUAL_REVIEW 并精确覆盖本批唯一哈希。", "phone-apply 在 SQLite commit 前异常时 rollback 并清理本批新 E/G hardlink；commit 后再原子刷新 current seed、phone plan、cloud plan 与 receipt，这些文件之间不构成单一事务。", "只对联系表看不清的个别原图单开。"],
    flow: ["机械预检", "合并 occurrence", "隔离技术缓存", "生成联系表", "一次视觉决定", "补看少量原图", "事务应用", "增量验证目录与计划"],
    concepts: [
      { term: "Occurrence（出现位置）", explanation: "同一内容在来源或暂存中的一个路径；多个 occurrence 不等于多个不同原件。" },
      { term: "Primary / secondary（主类 / 次级主题）", explanation: "主类决定主要浏览入口；截图等对象还可保留一个真实次级主题。" },
      { term: "Native visual review（原生视觉复核）", explanation: "直接根据联系表和必要原图判断画面，不从文件名或元数据猜内容。" }
    ],
    boundaries: ["不从路径或文件名猜人物与画面。", "不把相似度分数当删除授权。", "near_duplicate_of 只编码本批内关系；跨批近重复仍是独立缺口。", "≤100 个可打开对象才进入默认小批量快速路径；超过后不冒充 19 图/4 分钟验收。", "不重复审计未变化的完整媒体库。", "不为一批媒体增加模块、schema 或长期服务。"],
    failures: [
      { condition: "对象不可打开", response: "标记缺口并保留来源，不自动当成无意义内容退出。" },
      { condition: "review 漏掉唯一哈希", response: "phone-apply 在写入前整体拒绝，不留下分类。" },
      { condition: "catalog 已提交但 seed/phone/cloud refresh 中断", response: "保留已验 canonical/G keeper 与 catalog；用 current seed/candidate receipt/plan-status 识别哪一面陈旧，重跑 refresh 与 acceptance，不回删已提交原件。" },
      { condition: "近重复没有明确更好版本", response: "两者都保留或进入待复核，不以容量为由强删。" },
      { condition: "新对象疑似与既有 catalog keeper 跨批近重复", response: "phone-apply 不直接写该关系；保留新对象与证据，另行打开既有 keeper 做人工比较，再选择精确接入/退出路线。" },
      { condition: "小批量超过速度目标", response: "停止扩写工程，报告真实外部/工具 blocker；不再加回执或全库扫描。" }
    ],
    sources: [{ path: "personal_media.py", role: "phone-prepare、phone-apply、分类与事务" }, { path: "AGENTS.md", role: "小批量快速路径与反膨胀边界" }, { path: "test_personal_media.py", role: "查询、plan_status、ingest-file 与 recovery-sync 回归；当前仍没有直接 phone_apply fault-injection 用例" }],
    verification: ["审查时既有测试没有直接调用 phone_apply；review 全覆盖、pre-commit rollback 与 post-commit refresh 目前按源码和历史批次证据说明，专项 fault-injection 回归仍是缺口。", "现行 2026-08-25 增量把 118 个 occurrence 收敛为 63 个唯一哈希并完成视觉治理。", "19 张普通截图从双盘保全到可检索的产品目标低于 4 分钟。"],
    relation: "它决定什么进入当前目录；查找消费 keeper，手机与恢复模块分别提供来源和后续恢复责任。"
  }),
  commonModule({
    slug: "local-ingest",
    shortTitle: "独立本地文件接入",
    title: "一个已复核文件，精确进入原件中心与两套恢复计划",
    searchAliases: ["本地媒体怎么接入", "ingest-file", "单个照片入库", "单个视频入库", "单个录音入库", "等价视频容器", "退休重复视频变体"],
    searchProjection: {
      intents: ["接入一个已复核本地媒体文件", "绑定输入预期哈希", "把新 keeper 写入 canonical 与 G", "退休内容等价的视频容器变体"],
      entities: ["ingest-file", "source", "expected_sha256", "category", "equivalent_keeper_sha256", "video_stream_sha256", "canonical_locator", "candidate-refresh"],
      relations: ["新 keeper 同时进入 canonical 和 G recovery", "等价变体必须与现役 keeper 的 demuxed stream 相同", "目录写入后刷新 seed recovery 和 cloud candidates", "source 只在 E/G 与目录步骤完成后退休"],
      failureRecovery: ["输入哈希变化立即停止", "keeper E/G 读回失败不退休变体", "目标冲突不覆盖", "文件系统与 SQLite 非原子步骤保留精确失败位置"]
    },
    teaser: "手机不是唯一入口。一个已经人工看过的本地照片、视频或录音，可以单独接入；同一视频流的另一种容器也能保留恢复副本后退出浏览库。",
    status: "现行 ingest-file 只接受 canonical 根之外的一个现存文件并强制 --execute；新 keeper 与等价视频容器变体有两套独立合同，本轮网页建设没有执行真实接入",
    statusTone: "mixed",
    value: "让 E 卷暂存区或其他同卷位置中、已经人工复核的一个媒体文件，不必伪装成手机批次，也不必为一次接入新建脚本和第二索引。",
    why: "本地新增文件可能已经完成视觉判断，但不属于手机 capture；视频还可能只是同一画面/音轨的另一种容器。若一律当新 keeper，会重复浏览和恢复；若直接删除，又会失去可恢复字节和关系。",
    example: "例如我已经确认一个本地 MP4 是现有 keeper 的另一种封装。入口先核对输入 SHA-256、现役 keeper 的 E/G 字节和两者 demuxed video stream；相同才把变体复制到 G 的 Variants 恢复区、记录关系并退休来源文件。",
    result: "新 keeper 得到 canonical 原件、G 异卷副本、目录记录、重建种子和更新后的手机/云候选；等价视频变体得到 G 恢复副本、与 keeper 的等价关系和已退休来源状态。失败时得到精确停在哪一层。",
    readerStates: {
      pass: "输入仍匹配 expected SHA-256，目标无冲突，canonical/G/目录读回通过，来源退休后种子和候选计划完成刷新。",
      problem: "类别、时间、secondary、keeper 身份或视频流等价关系不充分时停止接入；先补一个真正会改变归类或重复决定的事实。",
      unavailable: "source 与 E canonical 不同卷、ffprobe、E/G 根、当前目录、目标路径或候选刷新不可用时停止对应步骤并报告现存副本；新 keeper 当前没有跨卷 copy fallback，不改走手机入口，也不自动上传。"
    },
    decisionImpact: [
      "命令必须显式 --execute；没有只写计划后自动接入的后台路径。",
      "输入必须在 E:\\Pictures、E:\\Videos 与 E:\\Music\\录音之外，且新 keeper 必须能与 E canonical 建 hardlink；现行实现不支持 C/G 等异卷 source 直接接入。",
      "新 keeper 需要 category；日期可明确选择，也可保留时间未知。",
      "等价视频变体必须绑定现役 keeper SHA-256，并证明 demuxed video stream 完全相同。",
      "新 keeper 与非音频候选会刷新手机恢复和 upload=0 云候选；录音不进入手机恢复包。",
      "SQLite 与 E/G 文件动作不是一个跨文件系统原子事务；入口逐层 read-back，但中断后仍要按现存副本和 receipt 恢复。"
    ],
    problem: "解决非手机本地新增、一次性脚本膨胀、同视频流容器重复、源文件退休无恢复副本和目录/恢复计划不同步。",
    implementation: [
      "解析 source 并拒绝 canonical 根内文件；计算 size/SHA-256，expected_sha256 存在时必须匹配。",
      "ffprobe 判断 video/audio；新 keeper 用 category、secondary 和可选 formation-date 选择 canonical 目录。",
      "新 keeper 用 os.link 在 E canonical 建 hardlink，因此 source 必须与目标同卷；随后向 G 精确复制并回读，事务写入 media/meta 后退休 source。",
      "等价变体先核对 keeper 当前存在、keeper E/G SHA-256 与两边 demuxed stream；再把变体精确复制到 G Variants、记录关系、退休 source 并更新 retired 状态。",
      "两条路线都刷新 current seed 与 product candidates，写最小 ingest receipt；cloud_upload 固定为 0。"
    ],
    flow: ["选择一个已复核 source", "绑定预期哈希和说明", "探测媒体类型", "选择新 keeper 或等价变体合同", "E/G read-back", "写目录与关系", "退休 source", "刷新 seed 和两套候选", "写 receipt"],
    concepts: [
      { term: "Independent local increment（独立本地增量）", explanation: "不属于手机 capture、但已经明确选择的单个媒体文件。" },
      { term: "Demuxed video stream（解复用视频流）", explanation: "从容器中抽出的实际视频流哈希；相同才支持‘只是容器不同’的等价判断。" },
      { term: "Content-equivalent variant（内容等价变体）", explanation: "字节和容器不同，但已证明视频流与现役 keeper 相同；保留恢复副本和关系，不再作为第二个 keeper 浏览。" }
    ],
    boundaries: ["不批量扫描目录。", "不接入 canonical 根内文件。", "新 keeper 不支持跨卷 source copy fallback。", "不靠文件名宣布视频等价。", "不把 --execute 扩张成云上传或手机删除授权。", "不声称跨 E/G/SQLite 的绝对原子回滚。"],
    failures: [
      { condition: "输入 SHA-256 与预期不同", response: "在创建 canonical/G/目录状态前失败，要求重新确认当前字节。" },
      { condition: "新 keeper source 与 E canonical 不同卷", response: "os.link 失败并保留 source；当前先把已复核文件放到 E 卷明确暂存位置再重试，不能把异卷 copy 说成已支持。" },
      { condition: "新 keeper 没有 category 或目标已有不同字节", response: "拒绝接入，不覆盖目标，也不退休 source。" },
      { condition: "等价 keeper 不存在、E/G read-back 失败或视频流不同", response: "不建立等价关系，不复制/退休变体。" },
      { condition: "目录提交后 seed/候选刷新失败", response: "保留已经读回的 canonical/G 字节和具名失败位置；按当前目录与 receipt 恢复，不把部分状态冒充完整收口。" }
    ],
    sources: [{ path: "personal_media.py", role: "ingest-file、新 keeper、等价容器变体、seed 与候选刷新" }, { path: "test_personal_media.py", role: "隔离临时根中的新 keeper、E/G、catalog、来源退休、候选刷新与等价视频容器专项回归" }, { path: "README.md", role: "精确命令、输入、回读、半状态恢复与依赖说明" }],
    verification: ["源码和 README 均要求 --execute、一个 source、description 与可选 expected SHA-256。", "专项回归证明新 keeper 的 E canonical、G 副本、catalog、source 退休、current seed、手机计划和 cloud plan 同次刷新。", "专项回归证明等价视频的 E/G keeper、相同 demuxed stream、G 原始容器变体、关系写回和 source 退休。", `本轮正式 ${SOURCE_RECEIPT} 运行 ${current.tests} 项测试、0 失败/错误，且所有 current commitments 重新闭合。`],
    relation: "它是手机之外的单文件入口；完成后仍回到同一个当前目录、手机恢复候选和 upload=0 云候选，不建立第二套媒体库。"
  }),
  commonModule({
    slug: "phone-preservation",
    shortTitle: "手机双盘保全",
    title: "先逐项写入两个异卷副本，再让手机尽快离线",
    searchAliases: ["手机照片保全", "可以拔了", "双盘备份", "手机清空", "preserve-clear", "E G SHA-256"],
    searchProjection: {
      intents: ["取得手机两个共享 profile 的新增 regular files", "证明双盘副本完成", "区分可以拔线与手机清空", "精确删除已保全文件"],
      entities: ["phone shared files", "E copy", "G copy", "bytes", "SHA-256", "quarantine", "clear state"],
      relations: ["每个新共享文件同时需要 E/G 回读", "双盘通过产生可以拔线状态", "手机删除需要独立精确核对", "保全完成后分类离线继续"],
      failureRecovery: ["任一副本失败不宣布可以拔线", "删除中断先收稳隔离状态", "未删除明确留到下次连接", "系统与应用私有边界不纳入分母"]
    },
    teaser: "手机连接只做不可替代的全共享文件捕获和精确清理；媒体、文档、ZIP、未知扩展名与技术缓存都先防丢保全，视觉判断、语义分流、索引和恢复计划不占用这根线。",
    status: "现行流程要求 E/G 两份异卷副本逐项回读；本轮没有连接手机，指定真机清理测试保持跳过",
    statusTone: "mixed",
    value: "把手机故障和断线风险压到最短时间，同时保留每个共享文件是否已经双重保全、是否已经从手机清理的可核对状态；非媒体不进入媒体 catalog，但不会因此被漏掉保全。",
    why: "边连手机边做视觉分类、全库去重和索引，会让连接时间变长；把‘备份完成’和‘手机清空’混成一个状态，又会制造误删或误报。",
    example: "223 个 regular files 先用有界批量快照把远端事实往返降到少量批次；逐文件 pull、E/G 回读和删除前最终核对仍保留。图片/视频后续进入视觉批次，文档/ZIP 等只保全后移交各自 Owner。",
    result: "成功时先得到‘可以拔了’；若继续清理，再得到每个精确路径的删除/隔离结果。未开始或未完成删除时明确保留待下次连接。",
    readerStates: {
      pass: "所有纳入分母的新共享文件都有 E/G 两份 bytes 与 SHA-256 回读；可以拔线。手机清理若执行，还要有独立精确结果。",
      problem: "副本缺失、哈希不一致、远端变化或删除中断时保留已取得副本和精确路径状态，不继续扩大删除。",
      unavailable: "手机、ADB、目标异卷或来源边界不可用时停止捕获/清理；不动现有本地原件，不用恢复出厂设置替代。"
    },
    decisionImpact: ["固定设备 model=2410DPN6CC，serial SHA-256=0a1ebafeb85915caf5f0181167f15ed264f6d9776215c183df0d9fb9dcb34a0b；共享 profile 固定为 0 / 999。", "由另一来源 Owner 负责的共享根、恢复包 Images/Videos、Android/应用私有/系统边界和 .nomedia 不进入保全分母；其他 regular files 包括非媒体与技术 cache 先保全。", "每次 capture 分配 fresh、不可复用 run-id；manifest 与 frozen delete plan 互相绑定哈希。", "最多尝试 3 个稳定 generation；远端事实漂移或 stale artifact 要求 fresh capture。", "双盘回读完成就先通知可以拔线；清空是第二个结果，不能由保全推断。", "当前 h_cold_backup=not_used_current_h_health_warning；E/G 双保全不冒充 H 冷备或三副本。", "删除只允许精确文件，不递归目录；单一全局锁和 no-clobber 文件写入阻止并发/覆盖旧代。", "phone-prepare 只消费 manifest 中图片/视频 kind=media；文档不进视觉批次，手机录音自动归位/索引当前仍未证明。"],
    problem: "解决长时间占用手机、单盘副本假安全、备份与清空混淆、系统边界误收和递归删除风险。",
    implementation: ["Device 要求唯一在线设备、model=2410DPN6CC、serial SHA-256=0a1ebafeb85915caf5f0181167f15ed264f6d9776215c183df0d9fb9dcb34a0b 与 profile 0/999 均匹配。", "REMOTE_FACT_SCRIPT 用 NUL framing 返回 path/status/size/mtime/hash，并按 64 项与 24 KiB 命令上限分批，避免路径字符破坏解析。", "capture 对所有纳入分母的 regular files 最多获取 3 代稳定远端事实；每个文件 pull 到 fresh run 的 E 副本并冻结 manifest/delete plan。", "protect-to-g 写 G 异卷；verify-backup 把 manifest、delete plan、设备身份、E/G bytes/SHA 全部绑定到 receipt。", "delete 要求同一当前设备、有效 backup receipt、精确 run-id 与 --execute，再核对路径/大小/哈希后逐文件删除；不删除目录。", "全局 lock、防覆盖 write_json_once 与 fresh run root 共同避免并发和旧 artifact 被静默复用。"],
    flow: ["识别手机共享边界", "排除其他 Owner 与系统区域", "批量取得远端事实", "写 E 副本", "写 G 副本", "逐项回读", "报告可以拔线", "按独立授权精确清理"],
    concepts: [
      { term: "Preservation denominator（保全分母）", explanation: "本次真正由手机共享来源负责、尚未由其他来源承担的新文件集合。" },
      { term: "Dual preservation（双重保全）", explanation: "同一文件在 E/G 两个异卷上都完成 bytes 与 SHA-256 回读。" },
      { term: "Clear state（清空状态）", explanation: "手机端精确文件是否已隔离/删除的独立结果；与双盘保全分开。" },
      { term: "Quarantine recovery（隔离恢复）", explanation: "同一 plan-hash 的隔离文件存在且 bytes/hash 匹配时，重跑删除会完成清理并记录 RECOVERED_QUARANTINE_DELETED；不匹配且源缺失时先尽力移回源再失败，残留 quarantine 永远不能 PASS。" }
    ],
    boundaries: ["不处理联系人、短信、聊天、账号、应用私有和系统数据。", "非媒体共享文件只做防丢保全/清理，之后交材料 Owner，不接入媒体 catalog。", "技术 cache 先保全再精确清理，但不进 cloud/phone recovery；只有 .nomedia 作为可再生对象直接排除。", "phone-prepare 只消费图片/视频；手机录音自动增量归位仍是 Unknown。", "不递归删目录。", "不恢复出厂设置。", "不让分类与索引占用手机连接。"],
    failures: [
      { condition: "E 或 G 任一回读失败", response: "不宣布可以拔线；保留成功副本并只重试失败对象。" },
      { condition: "删除前远端文件变化", response: "停止该对象删除，保留本地副本和新远端事实。" },
      { condition: "删除在隔离后中断", response: "重跑同一 run：隔离字节与 plan hash 匹配时完成删除并记 RECOVERED_QUARANTINE_DELETED；隔离不匹配且源缺失时先尽力移回源再失败。最终扫描仍有任何 quarantine 就不能 PASS。" },
      { condition: "用户拔线前未开始删除", response: "正常结束保全，明确手机清空待下次连接。" }
    ],
    sources: [{ path: "phone_file_preserve_clear.py", role: "手机捕获、双盘回读和精确清理" }, { path: "test_phone_file_preserve_clear.py", role: "来源边界、批量快照、回读与删除保护回归" }, { path: "AGENTS.md", role: "可以拔线节点与手机占用边界" }],
    verification: [`${current.tests} 项总测试中 0 失败/错误；${current.skipped} 项指定真机受保护删除测试因本轮无设备而跳过。`, "回归覆盖恢复包根、Android/系统边界和 .nomedia 排除。", "真实设备墙钟仍需下一次连接复验。"],
    relation: "它只把手机新共享文件安全带到本地；分类、当前目录和恢复计划由后续离线模块继续。"
  }),
  commonModule({
    slug: "phone-recovery",
    shortTitle: "手机恢复包",
    title: "只把手机真正应该拥有的照片和视频封装成可核对恢复计划",
    searchAliases: ["手机恢复包", "手机照片怎么恢复", "删掉原件后退出恢复包", "我自己删的照片不要恢复", "60GB 恢复计划", "recovery-status", "recovery-sync", "录音不进手机", "换机恢复照片"],
    searchProjection: {
      intents: ["查看当前手机恢复范围", "确认是否低于 60GB", "试算或执行补齐", "解释录音和包外文件边界"],
      entities: ["phone-recovery-plan.ndjson", "G recovery package", "60GB", "photos", "videos", "audio exclusion", "dry-run"],
      relations: ["当前 keeper 选择生成恢复计划", "recovery-status 只验计划结构与 catalog 资格", "recovery-sync dry-run 才比较 G 实际包大小与缺项", "录音不进入手机最小恢复包", "本人删除 canonical 原件后对应恢复项应退出", "执行以当前清单维护固定包，桶外内容不动"],
      failureRecovery: ["超过 60GB 阻断封印", "缺项先 dry-run", "普通无关包外文件不自动删除", "本人删除后由既有日常任务按当前集合退出恢复项，不加删除确认或恢复台账"]
    },
    teaser: "恢复不是把整个媒体库塞回手机；它只封装照片和视频中的当前选择，并把容量、缺项和不承担范围说清。",
    status: `${current.recoveryItems.toLocaleString("zh-CN")} 项、${bytesToGiB(current.recoveryBytes)}，under_60gb=true`,
    statusTone: "pass",
    value: "手机损坏、换机或清空后，能够从一份有容量上限、逐项可核对的包恢复最重要照片和视频，而不是临时挑文件。",
    why: "把全部媒体无差别回灌会超过手机容量，也会把录音、缓存和不再选择的对象带回去；只有目录没有实际字节又不能恢复。",
    example: "先运行 recovery-status 证明计划结构、项数、字节和 catalog 资格仍成立；再运行 recovery-sync 默认 dry-run，才比较 G 实际包的 size-match 与 missing，确认后加 --execute 补齐缺失文件。",
    result: "第一层得到计划项数、字节、容量门和 catalog 资格；第二层得到 G 实际包的 existing_size_match/missing 聚合计数与补齐结果。dry-run 不列每个缺失路径；目标冲突才具名 target。两层分开，包外内容保持不动。",
    readerStates: {
      pass: "recovery-status 先证明计划与 catalog 一致且低于 60 GB；recovery-sync dry-run 再证明 G 目标 size-match=全部、missing=0，执行时已有目标还会做 SHA-256 read-back。",
      problem: "缺项时 dry-run 返回 aggregate missing 计数，目标已存在但 size 冲突时具名 target 并失败；计划/资格漂移由 recovery-status 收敛或失败关闭。本人删除原件时，只退出与该 catalog 哈希、固定目标和同一文件身份精确匹配的恢复项；不匹配实体保留为冲突。",
      unavailable: "G 盘、计划或选定原件不可用时停止恢复同步；保留已有恢复包，不用旧成功回执冒充当前。"
    },
    decisionImpact: ["恢复包只含选定照片/视频。", "录音从不进入手机最小恢复包。", "60 GB 是当前产品上限。", "recovery-sync 默认 dry-run。", "固定包目录跟随当前清单，包外内容和 E 原件不动；用户删原件无需由 AI 代删或通知 AI。"],
    problem: "解决换机前临时挑选、恢复包超容量、录音与手机职责混淆、计划和实际文件分离以及同步误删。",
    implementation: ["phone-recovery-plan.ndjson 保存当前选定照片/视频的唯一哈希、大小、源路径、目标路径和相册；总量仍须 <=60GB。", "recovery-status 只核对计划格式、计数、当前目录资格，不证明实际 G 包齐全。", "recovery-sync 默认预览现存、缺项与过时文件，--execute 才同步固定 G 包。", "未变化文件按大小和修改时间复用；新建/变化项核对原件与落地哈希，优先使用 G 标准副本硬链接，再原子替换目标。", "目标集合来自当前计划；只清固定 Images/Videos 桶内不再需要的派生文件，保留桶外内容，不删除 E 原件。", "正式当前库按现存视频引用清理 G 格式变体，不保存独立退役队列。", "现有每日任务先维护两库清单、再镜像 E→G、最后同步手机包；维护失败不会倒改已经成功的镜像结果。"],
    flow: ["从 keeper 选择照片/视频", "计算容量并生成计划", "recovery-status 验计划和 catalog", "recovery-sync dry-run 比较 G 实际包", "按需 execute 补齐", "对已有/新文件做哈希回读", "重新报告"],
    concepts: [
      { term: "Sealed plan（封印计划）", explanation: "一组精确选定、带恢复责任的照片/视频清单；变化后必须重新验收。" },
      { term: "Under 60 GB", explanation: "恢复包当前硬上限，保证新手机仍有现实可写回空间。" },
      { term: "Package-external file（包外文件）", explanation: "固定 Images/Videos 受管桶以外的文件；同步保留它们。桶内已不在当前清单的文件属于过时派生项，会在执行同步时移除。" }
    ],
    boundaries: ["不恢复文档、联系人、短信、聊天、账号或应用数据。", "不把录音放进手机包。", "不删除固定桶外的文件或 E 原件。", "用户删除原件后，由既有任务按当前文件与计划同步退出对应恢复项。", "不把计划存在冒充实际文件齐全，更不冒充手机已写回。"],
    failures: [
      { condition: "一个新增候选会让包超过 60 GB", response: "只跳过该新增项，并在 candidate-refresh receipt 记录 phone_skipped_capacity；保持现行封印包，不为纳入它删除未知原件。若既有/最终计划本身已经越界，status/refresh 才整体失败。" },
      { condition: "计划项缺失", response: "dry-run 只返回 missing 聚合数；--execute 对全部缺项逐一核验 source 后补齐。需要具体路径时从已授权的 plan/目标范围另行有界查看。" },
      { condition: "G 盘不可用", response: "返回 unavailable，保留 E 原件和现有计划；不声称恢复包当前可用。" },
      { condition: "包外文件存在", response: "保持原样并单独报告，不作为同步删除目标。" }
    ],
    sources: [{ path: "personal_media.py", role: "recovery-status 与 recovery-sync" }, { path: "phone-recovery-plan.ndjson", role: "当前恢复计划" }, { path: SOURCE_RECEIPT, role: "项数、字节与 60 GB 验收" }],
    verification: [`现行计划 ${current.recoveryItems.toLocaleString("zh-CN")} 项、${current.recoveryBytes.toLocaleString("en-US")} B，under_60gb=true；${current.selectedRows} 项精选全部覆盖，原有候选未减少。`, "真实执行已将精选名称同步到包内，并移除旧分类别名；随后以同一清单重复同步检查无额外复制或删除。", "隔离回归覆盖预览/执行、变化项哈希、只清固定桶、空计划、重复运行及源离线。实际 G 包就绪仍不代表已写回手机。"],
    relation: "它消费分类后的照片/视频 keeper；不拥有云端上传，也不改变本机 canonical 原件。"
  }),
  commonModule({
    slug: "cloud-candidates",
    shortTitle: "云端候选",
    title: "先把候选与相册计划讲清，再单独决定是否上传",
    searchAliases: ["Google Photos", "云端候选", "删掉原件后退出云候选", "我自己删的媒体不要上云", "upload=0", "相册计划", "cloud-status", "不自动上传"],
    searchProjection: {
      intents: ["查看准备上传的媒体", "确认当前没有上传", "理解相册候选与旧候选退出", "决定是否需要另行批准"],
      entities: ["cloud-candidates.ndjson", "upload=0", "album", "candidate", "Google Photos", "authorization"],
      relations: ["分类 keeper 生成云候选", "候选绑定计划相册名", "upload=0 表示未授权未上传", "本人删除 canonical 原件后候选应退出", "不再满足选择条件的候选退出"],
      failureRecovery: ["候选漂移先更新清单", "用户删除原件由既有每日维护退出目录与旧候选，不在查询时执行删除", "未明确授权不上传", "云端不可用不影响本机目录", "上传结果必须独立回读"]
    },
    teaser: "云端在这套产品里是一个等待决定的恢复面，不是默认同步目标；候选生成和真正上传始终隔着一次人工查看与明确授权。",
    status: `${current.cloudCandidates.toLocaleString("zh-CN")} 项、${bytesToGiB(current.cloudBytes)}；cloud_upload_authorized=false，cloud_upload_performed=false`,
    statusTone: "mixed",
    value: "提前整理哪些照片/视频值得进入 Google Photos 以及放进哪个相册，同时避免后台自动上传错误内容或把网络失败影响本机整理。",
    why: "如果每次分类后自动上传，错误类别、近重复和暂不想公开到云端的内容会立即变成外部状态；完全不做候选又会在需要恢复时临时筛选。",
    example: "分类完成后先运行 cloud-status，只回读清单结构、候选项数、总字节和 upload_authorized/performed=false。逐项候选与相册计划保存在 cloud-candidates.ndjson，需要用户另外查看该清单；陈旧退出数量在 candidate-refresh.json。",
    result: "直接命令得到候选项数、字节和当前授权/上传状态；明确查看本地清单后才能看到逐项候选与相册计划。当前项目没有 Google 上传执行器，结论是本地候选已形成、外部上传尚未实现也未发生。",
    readerStates: {
      pass: "本地候选 header/body 与当前 catalog 资格一致，全部 upload=0；cloud-status 只证明清单结构、项数、字节和零上传状态。",
      problem: "旧候选不再满足选择条件、相册名冲突或清单漂移时原位修正候选，不触发上传；本人直接删除规范原件后，对应 upload=0 本地候选在下一次维护收敛中退出。",
      unavailable: "本地候选文件、header/body 或 catalog 资格不成立时 cloud-status 失败；当前项目本来就没有 Google 账号/网络上传执行器，不能把该缺失写成一次偶发运行故障。"
    },
    decisionImpact: ["cloud-status 只读且只返回聚合状态，不返回逐项/相册。", "逐项候选与相册计划在 cloud-candidates.ndjson；陈旧退出计数在 candidate-refresh.json。", "本人在可信文件管理器删除 canonical 原件后，对应 upload=0 候选应自动退出且不需要另行通知；现有日常同步已经覆盖。", "新增只来自本次显式复核的 new_hashes 与候选标记，不自动回填其他历史歧义空缺；历史来源类不会否决已经复核的精选。", "upload=0 是候选状态，不是失败。", "当前项目没有上传执行器；未来外部上传必须先看清单、精确授权并回读。"],
    problem: "解决自动上传越界、分类错误立即外部化、云端与本机故障耦合、旧候选无限累积和候选冒充已上传。",
    implementation: ["cloud-candidates.ndjson 保存 header、逐项候选和相册计划。", "只对本次明确复核的 new_hashes 与候选标记新增条目，不自动回填其他历史歧义项；已精选照片和视频均可加入，旧来源类别不额外拦截。", "现有每日任务维护失效条目与相册，计数在 candidate-refresh.json；没有另建常驻同步器。", "cloud-status 只读验证 header/body 与 catalog，并输出 status/items/bytes/path/zero-upload 聚合。", "生产项目没有 Google 上传命令或账号连接，本轮没有任何云端写入。"],
    flow: ["完成分类/去重", "筛选本次允许 new_hashes", "生成或退出本地候选", "写相册计划与 refresh receipt", "cloud-status 回读聚合", "用户另行查看逐项清单", "若未来建立外部上传路线则重新授权与回读"],
    concepts: [
      { term: "Cloud candidate（云端候选）", explanation: "本地计划中可能上传的媒体，不表示账号侧已经存在。" },
      { term: "Album plan（相册计划）", explanation: "候选未来进入的相册分组；需要在上传前由用户检查。" },
      { term: "External read-back（外部回读）", explanation: "真实上传后从目标账号重新确认结果；本地清单和命令成功不能替代。" }
    ],
    boundaries: ["不自动上传。", "不把 upload=0 写成失败。", "不让云端故障改变本机原件。", "不在网页复制候选原始清单。"],
    failures: [
      { condition: "没有明确上传授权", response: "保持 upload=0，正常结束候选更新。" },
      { condition: "候选与 keeper 漂移", response: "刷新/退出候选并重新回读，不把陈旧清单继续使用。" },
      { condition: "本地候选 header/body 或 catalog 资格漂移", response: "cloud-status 失败，先刷新本地清单；不触发任何外部动作。" },
      { condition: "用户希望真正上传", response: "当前项目返回 uploader_not_implemented（上传器未实现）的产品缺口；不得把 upload=0 清单或未来设计冒充已具备上传能力。" }
    ],
    sources: [{ path: "personal_media.py", role: "cloud-status 与候选刷新" }, { path: "cloud-candidates.ndjson", role: "upload=0 外部计划" }, { path: SOURCE_RECEIPT, role: "候选项数、字节与零 external effect" }],
    verification: [`现行本地清单 ${current.cloudCandidates.toLocaleString("zh-CN")} 项、${current.cloudBytes.toLocaleString("en-US")} B。`, "验收回执 cloud_upload_authorized=false、cloud_upload_performed=false。", "plan_status 回归覆盖 header/body/catalog 漂移；当前没有上传执行器或真实云端回读。"],
    relation: "它是分类后的可选外部恢复面；没有人类决定时仍保持本地计划，不接管本机目录或手机恢复。"
  })
];

export const project = personalMediaProject;
export const modules = personalMediaModules;
export { personalMediaProject, personalMediaModules };
