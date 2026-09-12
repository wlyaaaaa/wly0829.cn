import { createProjectSnapshot } from "./project-snapshot.js";

const OBSERVED_AT = "2026-09-05T10:39:36.6907174+00:00";
const SOURCE_MAIN_COMMIT = "383eb85421048a9812902f4c5f2d098cbff1f8a5";
const SOURCE_OBSERVED_AT = "2026-09-09T04:59:04.9572845Z";
const SOURCE_RECEIPT = "personal-media-current-acceptance.v1";
const SOURCE_RECEIPT_SHA256 = "d2fa41ac8b23ea382502ca222482c87660b8299f5a61e2f2b4a89fa00a89b6be";

const current = Object.freeze({
  catalogRows: 24539,
  visualRows: 20688,
  imageRows: 20312,
  videoRows: 376,
  audioRows: 3851,
  recordingRows: 3844,
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
  recoveryItems: 6262,
  recoveryBytes: 56999686276,
  cloudCandidates: 6500,
  cloudBytes: 72534594298,
  tests: 55,
  skipped: 2,
  sourceFiles: 7
});

const bytesToGiB = (value) => `${(value / 1024 ** 3).toFixed(1)} GiB`;

const personalMediaSnapshot = createProjectSnapshot({
  observedAt: SOURCE_OBSERVED_AT,
  label: `9月5日规模基线：${current.imageRows.toLocaleString("zh-CN")} 张照片、${current.videoRows.toLocaleString("zh-CN")} 个视频、${current.audioRows.toLocaleString("zh-CN")} 个音频可检索；精选 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频；手机恢复包低于 60 GB；旧数据观察的云候选为 upload=0；当前正式阶段见下方说明`,
  boundary: `GitHub 私有仓库与 main 已回读；源码和整理元数据有私人版本保存，媒体原件仍在本地与异卷副本中；本页规模与恢复数量是下述原观察，未重新盘点当前整理后的全库。媒体数量和 ${current.tests} 项测试沿用 ${SOURCE_RECEIPT} 的原观察日期，新增元数据导出另有 4 项合成回归；本页未连接手机、执行清理或上传 Google Photos，10 张画廊资源保持不变。`,
  metrics: [
    { label: "照片（9/5）", value: `${current.imageRows.toLocaleString("zh-CN")} 张` },
    { label: "视频（9/5）", value: `${current.videoRows.toLocaleString("zh-CN")} 个` },
    { label: "音频（9/5）", value: `${current.audioRows.toLocaleString("zh-CN")} 个` },
    { label: "精选（9/5）", value: `${current.selectedRows.toLocaleString("zh-CN")} 项` }
  ],
  facts: [
    { label: "本地实施与未完范围", value: "来源Owner确认7990eed包含普通视频52件E/G扁平归位、图片首轮19,851→4,186的本地原件删除检查点，不代表四库全部处理完成。后续数据仍在推进，尚未更新正式metadata基线；最近完整G回读为2026-09-12T01:32:06Z，此后定向退出与实际G手机包变化仍待最终metadata和全镜像收口，不能称旧ZIP载荷全部清除。手机清空/回写未验，163项旧待清仍须重连。", hero: false },
    { label: "正式源码与当前阶段", value: "2026-09-12 04:22 UTC 回读 PRIVATE main=7990eed73c68d0bd1f827ee99015622423ec2754。正式合同已转入四库本地分批去留、必要文字承接及索引/备份收口；独立命名/目录迁移暂停但未取消，云端真删除/重传另阶段，不连接手机。代码已有跨库哈希复用、就地登记和Photos/Drive执行入口，不能再把旧零上传观察说成永远没有上传能力。另有未发布改动，不进入本页能力。", hero: false },
    { label: "9月5日目录基线", value: `9月5日一个可删除重建的 SQLite 目录合计定位 ${current.catalogRows.toLocaleString("zh-CN")} 个原件：${current.imageRows.toLocaleString("zh-CN")} 张照片、${current.videoRows.toLocaleString("zh-CN")} 个视频和 ${current.audioRows.toLocaleString("zh-CN")} 个音频；音频按 authority locator 分为 ${current.recordingRows.toLocaleString("zh-CN")} 段录音、${current.musicRows} 个音乐文件、${current.ringtoneRows} 个铃声。数据库不保存媒体字节。` },
    { label: "精选的旧观察与新边界", value: `9月5日旧精选观察为照片/视频两处入口： ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片、${current.selectedVideoRows} 个视频，共 ${current.selectedRows.toLocaleString("zh-CN")} 项、${bytesToGiB(current.selectedBytes)}；当时E/G两盘逐项SHA-256与catalog一致。现行合同保留照片精选，普通视频归E:\\Videos根目录，不再设视频精选目录；普通视频52件E/G扁平归位已由来源确认，照片独立目录迁移仍暂停。` },
    { label: "截图文字与画面认知", value: `截图细项保留 2026-09-02 观察：${current.screenshotImageRows.toLocaleString("zh-CN")} 张中，${current.screenshotOcrEvidenceRows.toLocaleString("zh-CN")} 张带 OCR 证据，${current.screenshotVisibleTextRows.toLocaleString("zh-CN")} 张有 visible_text；这不是本轮新增截图覆盖率。当前检索已把确认的处理链/旧路径/哈希移回 provenance（来源说明），真实技术文字与不确定文本保留，避免内部痕迹污染内容召回。` },
    { label: "三种保留分别决定", value: "本地 keeper（保留原件）、Google Photos 云候选和手机携带/恢复资格分别审查。普通新增不会自动进入手机包；严格精选沿用既有资格，普通内容须明确 phone-recovery 及理由。本轮没有合格精选或手机增量为 0 都是正常结果。" },
    { label: "当前手机真实缺口", value: "9月5日电脑端恢复包曾纠正为6,262项，之后本地清理继续改变实际包；此前误将本地keeper自动当作手机增量，手机曾写到6,425项。多出的 163 项已固定为下次连接时按精确路径、大小和 SHA-256 清理，当前未连接、未执行，不能声称手机已经纠正。" },
    { label: "候选集合不自动补齐", value: "9月5日手机资格6,385项中计划选入6,262，123项未选原因Unknown；云资格6,589项中选入6,500，89项未选原因Unknown。当时1,182项精选均在两种计划中；这些历史差额不自动补齐、不猜成无价值，也不当作整理后现行资格。" },
    { label: "录音片段定位", value: "选定录音后，locate-audio 复核原音 SHA-256，复用 ChineseASR 已保留的时间段，返回原音起点下的起止时间、逐词覆盖和有限片段；查询不播放、不启动模型、不写库。缺时间时只给单件本地 ASR 接续，视频内部定位仍未提供。" },
    { label: "9月5日手机恢复包", value: `${current.recoveryItems.toLocaleString("zh-CN")} 项、${bytesToGiB(current.recoveryBytes)}，仍低于 60 GB 产品上限；录音不进入手机最小恢复包。` },
    { label: "云端候选", value: `${current.cloudCandidates.toLocaleString("zh-CN")} 项、${bytesToGiB(current.cloudBytes)}；这是9月5日upload=0历史基线；不用于判断后续上传是否发生。当前正式源码已有执行入口，云全量与手机闭环未在本页验收。` },
    { label: "检索与耗时边界", value: "查询直接使用 SQLite 条件/FTS，返回逐词命中字段、有限片段与范围；当前 source 明确取消 750/250 ms 硬门，不为几秒级耗时牺牲 AI 所需含义和证据。旧精确查询 239 ms 仅是历史观测，不是当前验收阈值。" },
    { label: "源码边界", value: `只有 personal_media.py 与 phone_file_preserve_clear.py 两个生产模块；无服务、队列、后台任务或第二数据库。`, hero: false },
    { label: "GitHub 私有仓库", value: `wlyaaaaa/personal-media，repository id=1362211796，PRIVATE、默认 main。${SOURCE_OBSERVED_AT} 通过 Git Owner 的实时可见性元数据和 GitHub ref API 核对，本地干净 HEAD 与远端 main 均为 ${SOURCE_MAIN_COMMIT}。`, hero: false },
    { label: "私人版本保存什么", value: "源码、测试、说明与 metadata/current.zip 的无损元数据快照进入 PRIVATE Git；快照保留重建种子、清单、分类、标签、描述、原路径和内容 SHA-256。照片、视频、音频、活动 SQLite 与缓存不进入 Git，仍由原有本地与异卷恢复路径负责。", hero: false },
    { label: "验收", value: `2026-09-05 的 ${current.tests} 项媒体验收为 0 失败/错误、${current.skipped} 项真机测试跳过；它不覆盖后来新增的 Git 元数据导出。2026-09-09 在 ${SOURCE_MAIN_COMMIT.slice(0, 8)} 上另跑 4 项 MetadataSnapshotTests 合成回归通过，未读取或导出真实私人元数据。`, hero: false },
    { label: "当前代承诺", value: `${SOURCE_RECEIPT} completed=${OBSERVED_AT}，SHA-256=${SOURCE_RECEIPT_SHA256}；catalog=2268d65ca0ce83c4cc7157dd3346993bbd01863fa6eb9bc8dc7e966f41e38636，seed=7745e2a9fbe7872b51f1e0d751436c1aaba694077e6209f8360b21ab339f78f0，phone-plan=3f406f31af445ac2226ff61a33c87df7f0758a2a555cb2513954f5746b85ba7a，cloud-plan=d897ab66d54baae235831ce30359030e5a3c5f1621af2430684e7cea805fb607。以上数据制品摘要来自该次封印；9月9日只读 status 核对24,539行与quick_check=ok，不声称全库原件逐项重验。`, hero: false },
    { label: "当前技术路径", value: "catalog=E:\\Media\\_manifests\\personal-media-current\\catalog.sqlite3；seed=E:\\Media\\_manifests\\personal-media-current\\seed\\keeper-search-index.ndjson；phone-plan=E:\\Media\\_manifests\\personal-media-current\\phone-recovery-plan.ndjson；cloud-plan=E:\\Media\\_manifests\\personal-media-current\\cloud-candidates.ndjson；phone-runs=E:\\Media\\_manifests\\phone-shared-full-preserve-successor-v2\\runs；phone-E=E:\\Media\\PhoneSharedFullPreserve；phone-G=G:\\80_Backup\\PersonalMedia\\PhoneSharedFullPreserve；phone-package=G:\\80_Backup\\PersonalMedia\\PhoneMediaRecovery\\2026-08-25；G canonical mirrors=G:\\80_Backup\\PersonalMedia\\Pictures、G:\\80_Backup\\PersonalMedia\\Videos、G:\\80_Backup\\PersonalMedia\\Music\\录音、G:\\80_Backup\\PersonalMedia\\Music\\音乐、G:\\80_Backup\\PersonalMedia\\Music\\铃声。", hero: false },
    { label: "历史七份源文件承诺", value: "AGENTS.md=eea75e071354233adb8780c5639959eb696067e16197945d6378a19bda1be903；README.md=dd60c27ceeac7edc75d2275786442e41220949a098703aaffb27278211e4e7a9；personal_media.py=7bba1e85cd5a7b3ec085191027cbc7bea63824411c8cf2ddf4314191f6506283；phone_file_preserve_clear.py=0ee1b280c5bad9d27dbc483e35faaa5089d6e5c82d1ec791d315dd47dc1200bc；test_personal_media.py=a44d7f3bd4eb30380fe3b356dc4aafdacb10b6cea9ba60310e53a8894a074523；test_phone_file_preserve_clear.py=edc51d9e12a5c1b873852161e8349328ad2a4a7edfa2092c5a68b73416320c34；acceptance.ps1=57b6898cb7063f7d1f7428f55b6acb0221679195a262cf37e3d9a31e00e20a4e。这七份承诺在 2026-09-07 核对一致，README 当时为 20,288 字节。2026-09-09 新增私有 Git 与元数据导出后，现行源码以新的 main 提交为准；这份旧回执继续证明其原版本，不再声称与当前全部源码哈希一致。", hero: false },
    { label: "回收站与来源退役", value: "手机相册 .globalTrash 是本人已删除原件，既不计入新共享文件保全，也不因图片看起来有用而重新入库或加入手机/云候选。本人在文件管理器删除正式原件后，查询只跳过，既有每日任务再同步目录与恢复面。", hero: false },
    { label: "现有每日备份关系", value: "PCConfig 已发布源 912b1af 的当前映射是 E:\\Media → G:\\80_Backup\\PersonalMedia\\Media，明确排除 Packages；G:\\80_Backup\\PersonalMedia\\Packages 属于个人媒体的专用恢复路径，不能把主镜像成功当作它已经同步。任务先维护两库清单，再执行五组镜像，最后运行媒体 recovery-sync；不连接手机或上传云。2026-09-07 已将 README 的旧范围说明对齐这份 PCConfig 映射；仅文档和其承诺更新，9/5 代码测试、目录、恢复计划及实机日期保持不变。", hero: false },
    { label: "备份任务与现有回执", value: "2026-09-07T20:16:52Z 的 PCConfig Inspect 回读该日常任务 enabled / Ready、最近结果 0；既有回执完成于 2026-09-07T02:14:53.7634544-07:00，五映射 post_verified=true、errors=[]，Media 源/目标各 66,538 条且差额 0。此处复用既有有界回执，本轮未运行备份；五映射通过也不能覆盖另一步 failed/partial。", hero: false }
  ],
  gaps: [
    "本人删除原件后，查询只跳过不存在的结果；现有每日备份任务依次更新两库清单、完成 E→G 镜像、同步实际手机包。源根或卷不可访问时不按全库已删除处理，恢复连接后使用同一路径继续；没有新增删除保护、恢复队列或计划任务。",
    "电脑端恢复包曾于9月5日纠正，现行包继续随本地清理收敛；手机仍有163项错误新增待下次连接精确清理；双盘保全成功不代表这一端已经清空或恢复到正确范围。",
    "本轮没有连接手机；双盘保全、精确清理和恢复写回只展示已实现合同与现行回执，不宣称当前设备动作已经发生。",
    "手机 backup receipt 当前固定 h_cold_backup=not_used_current_h_health_warning；双盘只指 E/G 两份异卷回读，不表示 H 冷备或第三份离线副本已经参与。",
    "9月5日云候选清单的upload=0保留原观察；页面不据此推断后续账号状态，也不把候选、相册名或恢复计划冒充Google Photos已上传结果。",
    "正式源码7990eed已有cloud-reconcile与cloud-sync，通过现有PCConfig提供者处理Photos及Drive；默认预览不调用提供者。当前阶段在本地实施，云真删/重传后续；未读取账号或云端状态，不把代码存在冒充全量完成。",
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
  visibility: "GitHub 私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "四库本地整理持续推进；图片首轮已完成，最终目录、G副本与历史载荷收口仍未完",
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
  repositoryNote: `PRIVATE wlyaaaaa/personal-media，默认 main；源码、测试、说明与无损元数据快照已有 GitHub 私人版本保存，本地和远端已回读 ${SOURCE_MAIN_COMMIT}。媒体原件与大体积恢复包仍由本地和 G 盘保管，私有仓库不显示面向未知访客的 GitHub 跳转按钮。网页只说明公开安全的产品与技术事实，不复制私人元数据正文；既有 10 张授权照片资源保持不变。`,
  summary: "按记得的时间、地点、画面或已有文字，找到照片、视频和音频。值得重看的直接移入“精选”，不另存一份，也不为凑数量硬选。手机新文件先在两块盘上备份并核对，再离线分类、去重；备份和手机恢复包跟随现有计划任务更新。你自己删了原件就是删了，不用通知 AI。本地候选、Photos照片/视频与Drive录音分别管理；当前先完成本地整理，云端真删/重传后续。",
  why: "媒体最容易同时出现三种问题：想用时找不到；好照片淹没在分类目录里；换机或手机故障后只剩零散副本。把所有东西复制到第二套库、持续后台同步或自动上传又会制造更多状态。这个项目选择一个可重建目录、职责清楚的既有模块和逐次有界处理；同时把文件管理器中的原件现状当作本人决定，而不是让旧索引或恢复包反过来支配原件。",
  plainExample: "我可以说：“先把小米 15 Pro 里这批旅行照片和视频备份到两块盘，确认安全后马上告诉我；连接还在时优先清空和已经就绪的差异回写，其余离线整理，不要上传云端。”系统逐项核对两份副本，分别说明数据安全、手机是否可拔及未完成项；再判断画面、质量和重复关系，把保留原件放回当前目录，并更新手机恢复包和本地云候选。",
  result: `我得到一组能回到原件的结果：检索候选带着日期、地点、类别和匹配依据；照片精选提供值得主动重看的原件入口，普通视频归视频根，不再设视频精选目录；分类决定说明保留或退出原因；手机保全说明双盘是否完成、手机是否清空；恢复包说明当前可写回范围。云端部分得到面向 Google Photos 的本地候选清单和相册计划；正式源码已有默认预览、显式执行的Photos/Drive入口；当前云端阶段未完成验收，执行能力不等于云端已备份。`,
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
      { actor: "手机入口", title: "E/G 双盘逐项保全", detail: "两个异卷副本bytes与SHA-256回读通过后及时报告数据安全；连接仍在时优先精确清空和已就绪差异回写，分别报告可拔与未完项。" },
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
    { title: "一个精选入口，照片和视频仍各归其库", detail: `精选不是第二份媒体，也不是固定配额。照片保留 E:\\Pictures\\精选，普通视频归视频根；9月5日的照片/视频精选数量是旧观察。本人手筛留下者保留，其他取舍继续按实际价值与近重复证据，不借精选标准删除手筛保留件。` },
    { title: "文件管理器删除就是本人决定", detail: "原件删了就是删了，无须通知 AI。查询与状态只读；现有 PersonalDataReplica-Hot-Daily 依次调用两库 sync-current、五组 E→G 镜像和 recovery-sync --execute，让索引、备份与恢复包跟随当前文件，不从旧副本恢复原件。" },
    { title: "媒体库拥有统一检索，OCR 只是证据提供者", detail: "画面中的场景、事件和审美价值由视觉认知负责，逐字文字由 LocalOCR 负责；两类证据进入同一媒体条目与 SQLite/FTS，而不是再建一个 OCR 库。现有截图文字已能支持真实查询，老库只应按真实查询缺口增量补齐。" },
    { title: "私人来源不是公开禁区", detail: "普通个人照片按活动公开分级属于 L2；页面逐值处理真实 L3+ 与秘密，不因来源是个人媒体库就整类删除。" },
    { title: "本地新增一次只接一个已复核文件", detail: "ingest-file 必须显式 --execute，并可绑定 expected SHA-256；新 keeper 与等价视频容器变体使用不同合同，不从任意目录自动扩张来源。" },
    { title: "音频沿用既有分类与 ASR 定位", detail: "9月5日3,851个音频按真实locator分为E:\\Music\\录音3,844、E:\\Music\\音乐6、E:\\Music\\铃声1；此后录音持续清理，旧数不代表现行规模。目录直接消费既有分类、时间、原件和可用 ASR 文字，不为接管所有权重新分类或重跑 ASR。对应 G 异卷副本继续保留。" },
    { title: "先保全，再整理", detail: "手机连接最昂贵的是占用设备和丢失风险；双盘回读完成先报告数据安全，连接仍在时优先完成精确清空和已就绪差异回写，再离线做视觉判断与索引重建。提前拔线留下精确待办，不把备份完成当成手机全流程完成。" },
    { title: "分类必须回答内容意义", detail: "移动到目录不是分类。画面意义、质量、精确/高度近重复、时间和类别必须先形成决定；无法判断就保留待复核。" },
    { title: "三个产品面同次收口", detail: "一次成功验收的全局增量会依次更新本机目录、G 盘手机恢复计划和 Google Photos upload=0 候选；这三份文件不是跨文件原子事务，中途失败时以 candidate-refresh、plan-status 与 acceptance 识别半状态并重跑缺失刷新。" },
    { title: "可以拔了不等于清空了", detail: "双盘保全与手机端删除是两种独立状态；任何答复都必须准确说明哪一步完成。" },
    { title: "云操作跟随实际授权阶段", detail: "本地保留、手机携带与云端集合分别决定。当前只在本地实施，云端真删除/重传另阶段；后续已获准范围内的正常增量不重复索要每批批准，扩大账号、来源或公开面仍须另行处理。" },
    { title: "速度约束技术复杂度", detail: "小批量普通归档不为一次批次新建模块、schema、状态机或全库回归；19 张普通截图从保全到可检索目标低于 4 分钟。" }
  ],
  responsibilities: [
    "按地点、文字、描述、类别、媒体类型与日期组合查找真实照片、视频和录音",
    "保留照片精选；普通视频在视频根，特殊视频独立一层；本人手筛留下者不因不够精选再删除",
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
    { term: "精选", meaning: "值得本人主动重看的照片一级分类，不设数量配额、不另存副本。现行合同不再设置视频精选目录；历史两类精选计数保留原观察日期。" },
    { term: "File-manager deletion（文件管理器删除）", meaning: "用户自己删原件即生效；查询跳过失效路径，既有计划任务维护清单与派生副本，不增加确认、保护或自动恢复流程。" },
    { term: "upload=0", meaning: "只进入云端候选清单，表示该清单观察时没有执行上传，不代表永久缺少上传能力或后续状态。" }
  ],
  operatingFlow: [
    { title: "先判查询类型", detail: "现场拍摄地点用 place；图片中出现的地名、文件名、录音文字和普通描述用 query；类型、分类与日期按用户线索叠加。" },
    { title: "直接查当前目录", detail: "SQLite 条件与全文索引返回少量结果；普通请求不读取完整 NDJSON，不扫描整盘。" },
    { title: "需要浏览才建临时目录", detail: "在 E 盘受管 browse 根创建 task-unique hardlink；原件仍只有一份，目录可精确清理。" },
    { title: "本地独立文件走显式 ingest", detail: "普通暂存输入位于三个canonical根之外；--register-existing可对中心内明确原件就地登记。两条路线均携带描述并可绑定expected SHA-256。新 keeper 写入 canonical 与 G 恢复副本，等价视频变体先核对 E/G keeper 和 demuxed stream。" },
    { title: "手机先做双盘保全", detail: "只取得尚未由其他来源负责的新共享文件；分别写入 E 与 G，逐项回读 bytes/SHA-256。" },
    { title: "离线做视觉决定", detail: "机械预检合并 occurrence、检查可打开性和技术缓存；联系表一次决定 keeper、类别、时间、描述和近重复关系。" },
    { title: "把值得重看的原件移入精选", detail: "照片精选不设配额，普通视频留在视频根；本人手筛留下者保留，不因不够精选再删除。独立命名和目录迁移当前暂停，完成与否单独回读。" },
    { title: "事务应用本批决定", detail: "phone-apply 要求 review 精确覆盖本批唯一哈希；失败回滚数据库并清理本批新建链接。" },
    { title: "同步三面计划", detail: "刷新本机目录、G手机恢复包与本地云候选；恢复同步默认dry-run。当前本地阶段不做云操作，后续既有授权范围内的增量不逐批重复索要批准。" },
    { title: "让备份和恢复包跟随当前文件", detail: "sync-current 维护 SQLite、重建种子和既有候选；原 E→G 备份负责镜像，recovery-sync 维护固定手机包和现存视频的格式变体。读取入口不做这些写入，离线后下次从当前集合重新同步即可。" }
  ],
  components: [
    { name: "personal_media.py", responsibility: "当前目录、检索、临时浏览、分类、独立本地接入、批次应用、恢复包、云候选与按需元数据导出。", implementation: "目录与状态核心使用 Python stdlib + SQLite/FTS；图片打开/缩略使用 Pillow，视频/音频使用 ffmpeg/ffprobe。snapshot-metadata 只读选定元数据、只写无损 ZIP，不上传或改动原件。项目不新增常驻进程；现有 PersonalDataReplica-Hot-Daily 调用维护和恢复包同步入口，不触发 Git 推送。" },
    { name: "phone_file_preserve_clear.py", responsibility: "手机共享文件捕获、E/G 双盘保全、逐项回读和精确清理。", implementation: "只处理明确共享边界；删除前再次核对精确路径、大小和哈希，不递归删目录。" },
    { name: "catalog.sqlite3", responsibility: "保存可重建的当前媒体定位与检索字段。", implementation: "9月5日基线有24,539个媒体原件记录，后续清理持续改变目录；数据库不保存照片、视频或录音字节。" },
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
    { artifact: "云候选与刷新回执", schema: "personal-media-cloud-candidate-manifest.v1 / cloud-candidate-current.v1 / product-candidate-refresh.v1", owner: "refresh_product_candidates 写；cloud-status 只读", boundary: "旧候选header的upload_authorized/performed=false只描述该本地清单。正式源码另有同一SQLite中的cloud_object/cloud_membership和cloud-sync状态，不能由候选零上传字段推断账号侧从未上传。" },
    { artifact: "独立本地文件接入回执", schema: "personal-media-ingest-file-receipt.v1", owner: "ingest-file", boundary: "绑定 source/keeper SHA、canonical/G locator、source retirement 和候选新增数；cloud_upload 固定 0，失败不能冒充完整收口。" }
  ],
  usageExamples: [
    { ask: "找我在新加坡现场拍的照片。", effect: "按已经核对的拍摄地点筛选，返回少量仍存在的原件、已知日期、类别和匹配理由。", moduleSlug: "search-browse" },
    { ask: "在刚才选中的录音里，找一下谈到交付时间的那段，告诉我从几分几秒开始。", effect: "先核对同一原音，再复用已有转写时间段，交回起止时间、有限片段与覆盖缺口；没有可用时间戳就明确说明，不能按文字长度猜时间，也不会因查询自动重跑识别。", moduleSlug: "search-browse" },
    { ask: "这批截图哪些该留，哪些是重复或没意义？", effect: "先排除缓存并整理重复关系，再用少量联系表一起判断主体、信息价值、画质、类别和是否已有更完整版本。", moduleSlug: "classification" },
    { ask: "把这一个已经看过的本地照片、视频或录音接入媒体库。", effect: "核对文件身份、类别和时间后写入正式原件目录与 G 盘恢复副本，并同步更新目录、手机恢复包和未上传的云端候选；同内容的视频变体只保留恢复关系。", moduleSlug: "local-ingest" },
    { ask: "手机里的新照片先安全拿出来，我要尽快拔线。", effect: "先复用两库已有可靠字节并补齐E/G，及时报告数据安全；连接期间优先精确清空与已就绪差异回写，分别报告可拔和未完项。", moduleSlug: "phone-preservation" },
    { ask: "现在手机恢复包能恢复多少？", effect: "只读返回当前计划数量、大小、是否低于 60 GB 和缺口；默认不改包。", moduleSlug: "phone-recovery" },
    { ask: "哪些照片准备以后传 Google Photos？", effect: "先预览选定集合与相册关系，不调用提供者；实际云操作按后续已获准阶段进行，当前本地实施不做云删上传。", moduleSlug: "cloud-candidates" }
  ],
  evidenceLayers: [
    { layer: "GitHub 私有来源与元数据快照", proves: `Git Owner 实时元数据和 GitHub ref API 于 ${SOURCE_OBSERVED_AT} 确认 PRIVATE main=${SOURCE_MAIN_COMMIT}，与干净本地一致；4 项虚构导出回归通过。`, doesNotProve: "没有执行真实快照导出或从远端恢复演练；Git 保存元数据不证明媒体原件已备份到 GitHub，也不能从 SHA-256 还原丢失图片。" },
    { layer: "项目规则与 README", proves: "定义媒体 Owner、双盘保全、分类、三面收口、速度与不自动上传边界。", doesNotProve: "文字说明不证明当前目录、恢复包或设备在线。" },
    { layer: "两个生产模块", proves: "现行源码实现目录、检索、浏览、批次视觉决定、双盘回读、恢复计划与精确清理。", doesNotProve: "代码存在不证明本轮连接了手机或执行了外部动作。" },
    { layer: "独立本地文件接入", proves: "ingest-file 为新 keeper 和同视频流容器变体分别定义输入、E/G read-back、目录事务、来源退休与三面候选刷新。", doesNotProve: "入口存在不证明任意未复核文件都应接入，也不证明一次中断可以自动回滚所有外部文件动作。" },
    { layer: SOURCE_RECEIPT, proves: `2026-09-05 的 ${current.tests} 项测试 0 失败/错误、精确查询 ${current.queryWallMs} ms、恢复包 ${current.recoveryItems} 项且低于 60 GB、云候选 ${current.cloudCandidates} 项且未授权上传。`, doesNotProve: `${current.skipped} 项指定真机测试未运行；旧回执不证明新增元数据导出、当前 Git 版本的完整回归或所有原件今天仍可打开。` },
    { layer: "既有媒体数据与历史源码承诺", proves: `2026-09-09 03:40 的只读核对中，${current.sourceFiles} 个旧源码文件仍与 SHA-256=${SOURCE_RECEIPT_SHA256} 的回执一致，status 为 24,539 行与 quick_check=ok。后来新增 Git 元数据能力的源码由 ${SOURCE_MAIN_COMMIT} 单独定位。`, doesNotProve: "不把旧源码承诺继承为新增能力的完整验收；手机在线、163 项清理和 Google Photos 上传仍未验收。" },
    { layer: "用户授权的实拍画廊", proves: "当前选择的原图真实存在，能够展示旅行、日常和其他视觉类别的画面质量。", doesNotProve: "少量好照片不证明整个媒体库均已逐张人工审美验收。" },
    { layer: "真机与云端动作", proves: "实际设备双盘保全、精确清理、恢复写回或云上传在对应动作后分别有结果。", doesNotProve: "任何一层不能替代另一层，也不能由页面或测试预先宣布完成。" }
  ],
  operationalEntrypoints: [
    { name: "就地登记已有媒体原件", command: "py -3 personal_media.py ingest-file --source <已在媒体中心的原件> --register-existing --expected-sha256 <SHA-256> --category <类别> --description <说明> --execute", purpose: "只用于已明确复核的中心内文件，保留原件位置；不可与等价变体退休合用，E/G与目录结果仍分别核对。" },
    { name: "预览云端期望集合", command: "py -3 personal_media.py cloud-reconcile [--full] [--execute]", purpose: "按当前集合计算Photos和Drive期望对象及相册关系；execute只维护本地状态，不调用云提供者。" },
    { name: "预览或执行选定云端工作", command: "py -3 personal_media.py cloud-sync --target <photos|drive|all> [--limit 100] [--execute]", purpose: "默认只预览，execute才通过PCConfig提供者工作。当前本地阶段不消费云写授权；代码存在不证明云全量完成。" },
    { name: "按需保存整理元数据", command: "py -3 personal_media.py snapshot-metadata --output metadata/current.zip", purpose: "只读重建种子及清单、手机计划、云候选和存在时的候选刷新/手机待清理清单，以 personal-media-metadata-snapshot.v1 保存每文件字节与 SHA-256。原文保真、同内容输出字节不变；源在读取中变化或压缩包超过 100 MiB 时保留旧快照并报错。命令不联网，定向提交和 PRIVATE Git 推送是后续独立动作。" },
    { name: "从所选元数据版本重建目录", command: "py -3 personal_media.py catalog-build --seed <恢复目录>/seed/keeper-search-index.ndjson --db <恢复目录>/catalog.sqlite3", purpose: "先在空目录解压所需 Git 版本的 metadata/current.zip，按 snapshot.json 核对文件；换目录时只调整恢复副本 index-manifest.json 的 index.path。确认原件根可访问并核对重建查询后才切现行目录，不覆盖更新数据、不自动执行旧清理清单。移动或改名不改变未修改文件的哈希；编辑或重编码可能改变，单凭哈希不能恢复媒体字节。" },
    { name: "按线索搜索", command: "py -3 personal_media.py search --place <现场地点> --media-type image --limit 12", purpose: "返回少量可读候选；普通请求不用 all，也不扫描整盘。" },
    { name: "建立临时浏览目录", command: "py -3 personal_media.py browse <过滤条件> --browse-root <受管同卷根> --name <任务名> --limit <数量>", purpose: "创建同卷 hardlink 供浏览，不复制原件字节。" },
    { name: "清理临时浏览目录", command: "py -3 personal_media.py clean --folder <精确受管目录>", purpose: "只删除该浏览入口；目录混入非受管内容时拒绝。" },
    { name: "定位选定录音内容", command: "py -3 personal_media.py locate-audio --sha256 <原音SHA-256> --query <原文线索> --limit 5", purpose: "只读复用同原音的已有 ASR 时间段，返回范围和有限片段；不启动识别、不播放，不支持视频内部定位。" },
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
    { name: "查看云候选聚合状态", command: "py -3 personal_media.py cloud-status", purpose: "只读汇总本地Photos/Drive期望对象及集合关系的synced、pending、unknown、failed、paused数量、上传/待传字节及退出状态；provider_status_source=local_state_only，不访问账号、不上传，不能替代远端回读。" },
    { name: "重建当前目录", command: "py -3 personal_media.py catalog-build --replace", purpose: "从当前代原子 seed 重建可删除 SQLite，并由 acceptance.ps1 重新验收。" }
  ],
  evolution: [
    { date: "2026-08-23—08-24", commit: "milestone-01", result: "形成独立本机的照片、视频与音频统一检索和临时浏览产品。" },
    { date: "2026-08-25", commit: "milestone-02", result: "建立手机新增共享文件的 E/G 双盘保全、可拔线节点，以及本机、手机恢复包、云候选三面收口。" },
    { date: "2026-08-26—08-27", commit: "milestone-03", result: "完成两个生产模块边界、精确/高度近重复治理、可重建单一目录与恢复包反膨胀。" },
    { date: "2026-08-30", commit: "milestone-04", result: "形成 current acceptance、单一 catalog、手机恢复计划与 upload=0 云候选的联合验收。" },
    { date: "2026-09-02—09-05", commit: SOURCE_RECEIPT, result: `保留唯一精选入口和全部 1,182 项精选资格；本地目录现为 24,539，云候选 6,500 且 upload=0，电脑端手机包保持 6,262 项。新增只读录音片段定位和检索来源说明清理，普通 keeper 不再自动进入手机包；手机误增 163 项保持明确待清理。55 项测试运行、2 项真机测试跳过，未连接手机。` }
  ],
  galleryPresentation: {
    variant: "photo-showcase personal-media-gallery",
    kicker: "10 张实拍照片",
    title: "旅行中留下的画面",
    description: "七座城市，十张实拍。保留横竖构图，单击查看高清大图。",
    prefetchAdjacentFull: false
  },
  gallery: [
    {
      "src": "/media/personal-media/01-singapore-tree-well.webp",
      "thumbnail": "/media/personal-media/thumbs/01-singapore-tree-well.webp",
      "categoryLabel": "新加坡",
      "alt": "从圆形天井仰望树冠，石墙与绿叶构成框景",
      "caption": "沿着石墙，抬头看树。",
      "originalSha256": "440c90890c26f7ccf14495134e6673bfb06abf380b69de93c2258d258ed52439",
      "originalBytes": 10396415,
      "width": 2560,
      "height": 1920,
      "originalWidth": 4096,
      "originalHeight": 3072,
      "displayBytes": 1680364,
      "displaySha256": "af6d25b5d4afdfe86ea0ce9f9dfaeebfb72e24ddd27fdf86d3445870923499cc",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/02-hong-kong-harbor-lights.webp",
      "thumbnail": "/media/personal-media/thumbs/02-hong-kong-harbor-lights.webp",
      "categoryLabel": "香港",
      "alt": "维港夜间楼群与红色灯光在水面的倒影",
      "caption": "维港的灯，落在水里。",
      "originalSha256": "8f25a73f62165e02da020ecd267601fd21636b99a3e956a094b4e99ba1d7d459",
      "originalBytes": 4239666,
      "width": 2560,
      "height": 1920,
      "originalWidth": 8192,
      "originalHeight": 6144,
      "displayBytes": 545080,
      "displaySha256": "fa1b98ad91867b2e3b8d2c473f871e4aab980e0df4fa8d4b68203f618d42233f",
      "displayNote": "由现有 JPEG 显示副本缩放为长边 2560 像素的 WebP（网页图像格式）；保留完整构图、方向与原有色彩配置，属于有损 8 位显示，非无损或 HDR（高动态范围）等价；HEIC 来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/03-beijing-lantern-corridor.webp",
      "thumbnail": "/media/personal-media/thumbs/03-beijing-lantern-corridor.webp",
      "categoryLabel": "北京",
      "alt": "成排红灯笼沿长廊向远处延伸，下方是游人",
      "caption": "走进一整条红灯笼。",
      "originalSha256": "cf73efa47d65ed27b4ae1e85fc56667b9e56c463c9731f2c66431564ecce8e43",
      "originalBytes": 10547500,
      "width": 1928,
      "height": 2560,
      "originalWidth": 6144,
      "originalHeight": 8160,
      "displayBytes": 505050,
      "displaySha256": "145d935825effae19c6042ba028d9a7d08e8d367c2a96e4056a2b5c0e24d377c",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/04-shanghai-sunset-skyline.webp",
      "thumbnail": "/media/personal-media/thumbs/04-shanghai-sunset-skyline.webp",
      "categoryLabel": "上海",
      "alt": "日落时分的陆家嘴三座高楼、东方明珠与黄浦江",
      "caption": "傍晚，从高处看陆家嘴。",
      "originalSha256": "02584ec62d4fe3a77003f37b81d58e0f2436e643c5a66abb04f160550a4cb74f",
      "originalBytes": 6987972,
      "width": 2560,
      "height": 1920,
      "originalWidth": 4096,
      "originalHeight": 3072,
      "displayBytes": 531852,
      "displaySha256": "dbc9f2219cb8374a24f6856bc0b317eda82342581dbb6aa4d90846ccc07a6309",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/05-singapore-palm-street.webp",
      "thumbnail": "/media/personal-media/thumbs/05-singapore-palm-street.webp",
      "categoryLabel": "新加坡",
      "alt": "棕榈步行街两侧店屋通向远处金色穹顶",
      "caption": "店屋、棕榈和远处的金顶。",
      "originalSha256": "ed0ada67f8523bf73e90185f8d7d4fdfa4622498fd65a9c91787217f975e4115",
      "originalBytes": 14659205,
      "width": 2560,
      "height": 1920,
      "originalWidth": 8192,
      "originalHeight": 6144,
      "displayBytes": 715226,
      "displaySha256": "44dff890fd0f57e1799f4a0bf743d0c28a72ee4260b98fe693f0c6aa9149eeb7",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/06-singapore-sea-and-sky.webp",
      "thumbnail": "/media/personal-media/thumbs/06-singapore-sea-and-sky.webp",
      "categoryLabel": "新加坡",
      "alt": "蓝色海面、大片云层与阳光倒影",
      "caption": "海面把天空接了下来。",
      "originalSha256": "745cb711b65641062e53dc5f79a14d185e042474b9529ee9b96ac107c1937cec",
      "originalBytes": 16297747,
      "width": 2560,
      "height": 1920,
      "originalWidth": 5792,
      "originalHeight": 4344,
      "displayBytes": 247252,
      "displaySha256": "a9c57e621f5ea8ccaabf517d04fafc4f2d0fc5cf37cb595531613fc4fe6e64a5",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/07-hong-kong-golden-atrium.webp",
      "thumbnail": "/media/personal-media/thumbs/07-hong-kong-golden-atrium.webp",
      "categoryLabel": "香港",
      "alt": "商场中庭悬挂金色球形装置，楼层曲线向上延展",
      "caption": "中庭里的金色星球。",
      "originalSha256": "a810b90d2c89d585a7f2d2ed9b5adf4dab9155cb25d51c1dbd7116fd6ad307f6",
      "originalBytes": 4261466,
      "width": 1920,
      "height": 2560,
      "originalWidth": 6144,
      "originalHeight": 8192,
      "displayBytes": 624760,
      "displaySha256": "04ff98fd3f30d9f5c7458657a71e6b351fd6612db4be5f19e439e75c2aa78ea4",
      "displayNote": "由现有 JPEG 显示副本缩放为长边 2560 像素的 WebP（网页图像格式）；保留完整构图、方向与原有色彩配置，属于有损 8 位显示，非无损或 HDR（高动态范围）等价；HEIC 来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/08-chongqing-cable-car.webp",
      "thumbnail": "/media/personal-media/thumbs/08-chongqing-cable-car.webp",
      "categoryLabel": "重庆",
      "alt": "索道缆车经过跨江桥前，近处是层叠传统屋顶",
      "caption": "缆车穿过桥与层层屋顶。",
      "originalSha256": "2a88a9f5f653f098ea6fd62bb3cf7347c16a0a726e1fac36a14f0d403cb0e167",
      "originalBytes": 2762779,
      "width": 2560,
      "height": 1920,
      "originalWidth": 4096,
      "originalHeight": 3072,
      "displayBytes": 803368,
      "displaySha256": "a8698433790b2647b715e6cb839d93f9d135f64a33c0d2ed93b5727e92eeabda",
      "displayNote": "由现有 JPEG 显示副本缩放为长边 2560 像素的 WebP（网页图像格式）；保留完整构图、方向与原有色彩配置，属于有损 8 位显示，非无损或 HDR（高动态范围）等价；HEIC 来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/09-wuxi-blue-hour-water-town.webp",
      "thumbnail": "/media/personal-media/thumbs/09-wuxi-blue-hour-water-town.webp",
      "categoryLabel": "无锡",
      "alt": "蓝调傍晚的水乡建筑和河面灯光倒影",
      "caption": "天还没黑，河边已经亮灯。",
      "originalSha256": "1990afa60bed00ff694ab67bf0a5b9e9bf5b3a5ad002f3f0114921bb7f3097db",
      "originalBytes": 10726082,
      "width": 2560,
      "height": 1920,
      "originalWidth": 8192,
      "originalHeight": 6144,
      "displayBytes": 480720,
      "displaySha256": "a03dd97b1fb9698d065f06033683982361f4bc74c52f351303be329d09fdd8d7",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
    },
    {
      "src": "/media/personal-media/10-kunming-lakeside-gulls.webp",
      "thumbnail": "/media/personal-media/thumbs/10-kunming-lakeside-gulls.webp",
      "categoryLabel": "昆明",
      "alt": "晴天湖岸的海鸥掠过水面与栏杆，远处是城市岸线",
      "caption": "湖岸边，海鸥从眼前飞过。",
      "originalSha256": "cfe48dc969064eabf78a4198b799dc4aaa5f89e0e8179a1f1b595ec6fa73acac",
      "originalBytes": 2817558,
      "width": 2560,
      "height": 1920,
      "originalWidth": 4032,
      "originalHeight": 3024,
      "displayBytes": 421582,
      "displaySha256": "1d03756c6a2e7f5d2c77815fb14d90173892ffe4aacd1f47e36c148bf3be8a78",
      "displayNote": "由现有 JPG 原图缩放为长边 2560 像素的 WebP（网页图像格式）有损显示副本；保留完整构图、方向与原有色彩配置，来源原件保存在媒体库。"
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
      relations: ["现场地点使用已复核 place", "可见文字和普通描述使用 query", "SQLite 结果必须仍有现存原件", `9月5日历史精选观察为${current.selectedRows.toLocaleString("zh-CN")}项；现行不再设视频精选目录`, "可信 canonical 原件缺失应表示本人主动退役", "browse hardlink 与原件共享字节"],
      failureRecovery: ["地点未登记不降级成文字猜测", "零命中只说明当前过滤与目录覆盖", "失效候选不占结果上限，查询不写库；清单与备份由现有计划维护", "混入非受管内容的浏览目录拒绝清理"]
    },
    teaser: "不需要记路径，也不需要把全部媒体复制进另一套库；地点、描述、类别、类型和日期足够把结果缩成一小组原件。",
    status: `9月5日目录基线${current.catalogRows.toLocaleString("zh-CN")}个keeper已核对，后续清理继续改变目录；旧查询 ${current.queryWallMs} ms 仅为历史观测，当前无几秒级耗时完成门；浏览目录使用同卷 hardlink`,
    statusTone: "pass",
    value: "把“我记得那张照片/那段录音，但不知道在哪”变成少量现存原件和一个可以直接看的临时目录。选定一段录音后，还能借助已有转写定位其中的话，拿到可回听的起止时间。",
    why: "媒体路径、相册和命名常常与人的记忆方式不同；整库浏览太慢，第二次复制又会扩大容量和重复治理。",
    example: "我可以说：“找我在新加坡现场拍的照片。”系统按已核对的拍摄地点查找；若问的是写着地名的截图，就按图片文字查，不混为拍摄地点。选中录音后也可以说：“找谈到交付时间的那段，告诉我从几分几秒开始。”它会核对原音并返回已有时间段，不按全文长度估算。",
    result: "返回媒体类型、已知日期、地点、类别、匹配依据与原件；需要批量浏览时得到同卷 hardlink 文件夹，清理后原件不受影响。录音内定位另给从原音起点计算的起止时间、有限转写片段、逐词命中及质量/覆盖说明；片段不是逐字原音引文，说话人仍只是匿名分组。",
    readerStates: {
      pass: "找到仍存在的原件和匹配依据；临时浏览链接与原件是同一文件。录音定位在复核原音后返回已有时间段，不播放、不启动模型、不写目录。",
      problem: "结果达到上限、地点未登记、日期未知或私密标记未被本次请求包含时，说明实际范围。录音片段低置信、只覆盖部分或有线索未命中时保留缺口，不把零命中当作从未说过。",
      unavailable: "目录、原件或浏览链接不可用时只停止对应动作。选定录音没有可复用时间戳时，只说明单件本地转写接续；当前查询不自动重跑识别，也不提供视频内部定位。"
    },
    decisionImpact: ["普通请求默认返回小结果；只有用户明确要求完整集合才用 all。", "取消几秒级耗时硬门；先保证命中依据、内容、来源、时间和未知足够让 AI 正确判断，只有纯性能优化才以显著减少端到端耗时为目标。", "place 只表示已复核的现场地点，不能从文件名或图片文字推断。", `2026-09-02 截图观察的 OCR 证据 ${current.screenshotOcrEvidenceRows.toLocaleString("zh-CN")}/${current.screenshotImageRows.toLocaleString("zh-CN")}，结构化 visible_text ${current.screenshotVisibleTextRows.toLocaleString("zh-CN")}/${current.screenshotImageRows.toLocaleString("zh-CN")}；空值不等于没有文字。`, "LocalOCR 负责精确文字，视觉认知负责场景与意义；当前真实文字查询已经可用，所以不对 1.58 万张截图无差别重跑。以后只对新截图和真实未命中的有界候选补齐，并继续写回同一媒体条目。", "当前没有人物证据，不能用 person 做全库检索。", "9月5日基线的3,851个音频分为3,844段录音、6个音乐和1个铃声；当前录音数量随本地清理变化。目录直接消费各自既有分类、时间、原件与可用 ASR 定位，不重新分类或重跑 ASR。", "音频缺少 ASR 时只降低文字 query 召回，不影响按类型、日期、既有分类或原件定位，也不把缺文字写成音频不存在。", "默认 search 只验 authority locator 当前存在，不计算 SHA-256；精确字节身份需要对选中原件单项计算并与返回的 content_sha256 比较。", "browse --verify-hash 只证明 source 与新 hardlink 字节相同，不自动把两者与 catalog content_sha256 比较。", "浏览目录只是入口，原件字节不复制。"],
    problem: "解决自然记忆与文件路径不一致、整库浏览成本高、临时导出重复占空间和旧 locator 指向缺失文件。",
    implementation: ["SQLite 保存结构化日期、地点、类别、类型、描述、visible_text 与全文索引。", "search 直接使用条件/FTS，不加载完整 NDJSON。", "历史截图文字来自 exact_localocr、逐项证据和少量原生视觉文字；原观察中2,184条旧OCR结果位于description，其中sufficient 982、low_confidence 1,202；此后原件清理改变现行条目，不能当作最新覆盖数量。LocalOCR objective sidecar 尚未成为全库统一绑定。", "录音行消费既有分类与 ASR 绑定文字，不触发音频模型；ASR 缺失时其他结构化轴继续可查。", "候选返回前要求 source.authority_locator 是现存本地文件。", "browse 在 E 盘受管根创建 task-unique hardlink，可选对小集合逐项核对哈希。", "clean 只接受精确受管目录并拒绝非受管内容。"],
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
    verification: [`现行验收的精确查询返回 2 项；旧观测 ${current.queryWallMs} ms 只作历史，不再有 750/250 ms 完成门。`, "隔离回归证明查询/状态不改库，维护清理缺失项，空手机计划只清固定桶内派生文件，重复同步无额外删除，离线根不批删。", "复制数据库只刷新自己目录的种子，不沿旧绝对指针回写原库；JPEG 按真实图片打开性识别，不被 ffprobe 的视频流字段误分成视频。", `精选 ${current.selectedRows.toLocaleString("zh-CN")} 项保留原有 E/G 与 catalog 哈希证据；补齐后以当前计划与实际包回读核对，不把本地准备冒充手机写回或云上传。`, "画廊是媒体库的公开展示样本，不冒充完整精选集合。"],
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
    status: `9月5日分类基线：${current.visualRows.toLocaleString("zh-CN")} 个照片/视频 keeper；当时精选入口为 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频。普通分类还包括屏幕截图 15,829，旅行与活动 1,927，日常生活 863，收藏与娱乐 713，工作与学习 424，文档与凭证 396，创作与编辑 57；另有“色情图片”“色情视频”两个真实分类能力，具体个人载荷与当前数量不在公开页复制`,
    statusTone: "pass",
    value: "让媒体库保留真正值得再看、使用或承载回忆的原件。当前四库分别是媒体、非媒体材料、个人理解与个人表达：有用文字可可靠交给原有领域或后两库，原图没有独立价值时可以退出；没有新增意义就不硬建卡，也不将混入图库的他人内容当作本人经历。各库保持独立，手筛图片和全部视频的保留边界不变。",
    why: "文件名、目录和拍摄时间不足以判断裁切版、连拍、截图、模糊图和更好版本的关系；纯哈希也只能发现字节完全相同。",
    example: "我可以问：“这批截图哪些值得留，哪些只是缓存、重复图或已经有更完整版本？”系统会先整理重复关系，再把少量候选放在一张联系表里一起判断，交回保留或退出的理由。",
    result: `每个唯一哈希得到 keeper/退出、主类、可选 secondary、时间、描述和重复关系；值得主动重看的原件还能进入唯一精选入口。9月5日精选观察为 ${current.selectedImageRows.toLocaleString("zh-CN")} 张照片和 ${current.selectedVideoRows} 个视频；现行只保留照片精选入口，不设配额；成功完成 catalog commit、seed 与 candidate refresh 后，当前目录和两套计划才是一致收口。`,
    readerStates: {
      pass: "review 精确覆盖本批所有唯一哈希，视觉决定完整，事务提交后 keeper 定位与三面计划一致。",
      problem: "画面看不清、近重复关系不确定、唯一性或恢复责任未证明时保留原件/候选并只打开少量原图复核。",
      unavailable: "文件不可打开、联系表缺失或 review 状态不对时不开始应用；SQLite commit 前失败会 rollback 并清理本批新 E/G links。commit 后 seed 或 candidate refresh 失败会保留已验 keeper 与已提交 catalog，必须重跑刷新和 acceptance，不能声称全流程原子回滚。"
    },
    decisionImpact: ["照片已采用精选、生活与回忆、收藏与作品、资料原图、色情图片五入口方案；独立命名和目录迁移暂停，资料原图不是无意义截图兜底库。", "保留的色情图片全部进入本地手机包，色情视频不进，普通视频按需选择；这三种规则不混成统一keeper资格。", "精确重复退出仍要核对唯一性、引用和恢复责任。", "高度近重复是视觉判断，不由相似分数自动删除。", "照片精选不设上下限；好看、独特回忆或不可替代价值须有实际依据。本人手筛的图片及全部视频留下者保留，不用精选门槛二次淘汰。", "照片精选只移动原件、不复制；普通视频归视频根，不再设精选视频入口。本人手筛留下者优先保留；独立目录迁移暂停，不能写成全库已迁完。", "phone-apply 的 near_duplicate_of 只允许本批 group，并要求指向本批 keeper；不能直接把新文件关联到既有 catalog keeper。", "跨批近重复需要另行人工核对并通过现有精确入口处理，当前没有同等自动关系命令。", "默认小批量快速路径只适用于不超过 100 个可打开对象；每张联系表最多 25 个，只重验本批变化。超过 100 时重新按真实规模规划，不能沿用 4 分钟目标。", "分类完成前不把移动到根目录称为完成。", "“色情图片”“色情视频”两个分类身份公开保留，具体个人载荷与当前数量逐值处理。"],
    problem: "解决精确重复、裁切/连拍近重复、缓存、模糊失误、类别混乱和只移动不理解内容。",
    implementation: ["机械预检按 SHA-256 合并 occurrence 并检查可打开性与技术缓存。", "contact sheet 每张最多 25 个对象，避免逐文件重复工具调用。", "review.json 要求 PASS_NATIVE_VISUAL_REVIEW 并精确覆盖本批唯一哈希。", "phone-apply 在 SQLite commit 前异常时 rollback 并清理本批新 E/G hardlink；commit 后再原子刷新 current seed、phone plan、cloud plan 与 receipt，这些文件之间不构成单一事务。", "只对联系表看不清的个别原图单开。必要文字承接复用所属领域与理解/表达库的既有入口，不复制中央库；正式原件退出、手机包派生退出、旧ZIP/硬链接路径清理与物理空间释放分别记录。最近完整G回读后仍有定向退出，最终metadata、全量G与旧载荷收口各自待完成。"],
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
    status: "ingest-file强制--execute；普通输入在canonical根外，新增--register-existing可将媒体根内明确原件就地登记，不能同时退休等价变体。本轮只核对正式代码，未执行真实接入",
    statusTone: "mixed",
    value: "让 E 卷暂存区或其他同卷位置中、已经人工复核的一个媒体文件，不必伪装成手机批次，也不必为一次接入新建脚本和第二索引。",
    why: "本地新增文件可能已经完成视觉判断，但不属于手机 capture；视频还可能只是同一画面/音轨的另一种容器。若一律当新 keeper，会重复浏览和恢复；若直接删除，又会失去可恢复字节和关系。",
    example: "我可以说：“这个本地 MP4 看起来只是现有视频的另一种封装，核对后再接入，别重复保存两份正式原件。”系统会比较实际视频内容；确认相同后只把变体留作恢复材料并记录关系，无法确认就不动来源文件。",
    result: "新 keeper 得到 canonical 原件、G 异卷副本、目录记录、重建种子和更新后的手机/云候选；等价视频变体得到 G 恢复副本、与 keeper 的等价关系和已退休来源状态。失败时得到精确停在哪一层。",
    readerStates: {
      pass: "输入仍匹配 expected SHA-256，目标无冲突，canonical/G/目录读回通过，来源退休后种子和候选计划完成刷新。",
      problem: "类别、时间、secondary、keeper 身份或视频流等价关系不充分时停止接入；先补一个真正会改变归类或重复决定的事实。",
      unavailable: "source 与 E canonical 不同卷、ffprobe、E/G 根、当前目录、目标路径或候选刷新不可用时停止对应步骤并报告现存副本；新 keeper 当前没有跨卷 copy fallback，不改走手机入口，也不自动上传。"
    },
    decisionImpact: [
      "命令必须显式 --execute；没有只写计划后自动接入的后台路径。",
      "整理顺序在新增、复查和续作中相同：无意义退出，精确/高度近重复择优，再按全库统一严格标准判断精选；不因一批新媒体要交付就凑精选。",
      "裁剪、压缩、水印、边框和轻微界面变化不自动构成独立价值；不同凭据状态、重要文字或场景信息仍须保留。",
      "普通输入须在E媒体中心之外并可与目标建hardlink；--register-existing仅对中心内已选择原件就地登记，不能退休等价变体。两者均不支持C/G异卷source直接接入。",
      "新 keeper 需要 category；日期可明确选择，也可保留时间未知。普通新增默认不进入手机包，明确 --phone-recovery 与 --phone-recovery-reason 才赋予普通内容手机资格。",
      "等价视频变体必须绑定现役 keeper SHA-256，并证明 demuxed video stream 完全相同。",
      "新 keeper 分别刷新本地目录、手机计划与 upload=0 云候选；计划变化按各自资格判断，普通 keeper 不自动增加手机项，录音不进入手机包。",
      "SQLite 与 E/G 文件动作不是一个跨文件系统原子事务；入口逐层 read-back，但中断后仍要按现存副本和 receipt 恢复。"
    ],
    problem: "解决非手机本地新增、一次性脚本膨胀、同视频流容器重复、源文件退休无恢复副本和目录/恢复计划不同步。",
    implementation: [
      "解析source并核对E同卷；普通路线拒绝canonical根内文件，--register-existing则要求原件已在媒体根内且不与等价变体参数并用。计算size/SHA-256，expected_sha256存在时必须匹配；就地登记保留原件路径。",
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
    boundaries: ["不批量扫描目录。", "普通暂存接入不接受canonical根内文件；已在媒体中心的明确原件可以 --register-existing 就地登记，不移动原件。", "新 keeper 不支持跨卷 source copy fallback。", "不靠文件名宣布视频等价。", "不把 --execute 扩张成云上传或手机删除授权。", "不声称跨 E/G/SQLite 的绝对原子回滚。"],
    failures: [
      { condition: "输入 SHA-256 与预期不同", response: "在创建 canonical/G/目录状态前失败，要求重新确认当前字节。" },
      { condition: "新 keeper source 与 E canonical 不同卷", response: "os.link 失败并保留 source；当前先把已复核文件放到 E 卷明确暂存位置再重试，不能把异卷 copy 说成已支持。" },
      { condition: "新 keeper 没有 category 或目标已有不同字节", response: "拒绝接入，不覆盖目标，也不退休 source。" },
      { condition: "等价 keeper 不存在、E/G read-back 失败或视频流不同", response: "不建立等价关系，不复制/退休变体。" },
      { condition: "目录提交后 seed/候选刷新失败", response: "保留已经读回的 canonical/G 字节和具名失败位置；按当前目录与 receipt 恢复，不把部分状态冒充完整收口。" }
    ],
    sources: [{ path: "personal_media.py", role: "ingest-file、新 keeper、等价容器变体、seed 与候选刷新" }, { path: "test_personal_media.py", role: "隔离临时根中的新 keeper、E/G、catalog、来源退休、候选刷新与等价视频容器专项回归" }, { path: "README.md", role: "精确命令、输入、回读、半状态恢复与依赖说明" }],
    verification: ["源码和 README 均要求 --execute、一个 source、description 与可选 expected SHA-256。", "专项回归证明新 keeper 的 E canonical、G 副本、catalog、source 退休、current seed、手机计划和 cloud plan 同次刷新。", "专项回归证明等价视频的 E/G keeper、相同 demuxed stream、G 原始容器变体、关系写回和 source 退休。", `2026-09-05 的 ${SOURCE_RECEIPT} 运行 ${current.tests} 项测试、0 失败/错误，并闭合当时代承诺；不继承为后来 Git 元数据能力的完整回归。`],
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
    example: "我可以说：“先把手机这批新文件安全保存到两块盘，确认后马上告诉我可以拔线。”系统先按内容核验并复用媒体/材料库已有原件，只补缺少的E/G字节，再逐项回读；连接仍在时优先精确清空与已就绪差异回写。图片视频离线整理，文档和压缩包交给对应项目；可拔、清空和回写分别说明。",
    result: "双盘完成后及时得到数据安全结果；连接仍在时优先完成已保全来源的精确清空和已就绪恢复包差异回写，再分别说明可拔、清空与回写状态。提前断开或本批判断未就绪才留下精确待办，不能用备份完成替代另外两项。",
    readerStates: {
      pass: "所有纳入范围内容都有E/G字节回读；数据安全、精确清空、已就绪差异回写和可拔状态分别报告。连接仍在时优先完成手机依赖步骤，提前断开才留精确待办。",
      problem: "副本缺失、哈希不一致、远端变化或删除中断时保留已取得副本和精确路径状态，不继续扩大删除。",
      unavailable: "手机、ADB、目标异卷或来源边界不可用时停止捕获/清理；不动现有本地原件，不用恢复出厂设置替代。"
    },
    decisionImpact: ["固定设备 model=2410DPN6CC，serial SHA-256=0a1ebafeb85915caf5f0181167f15ed264f6d9776215c183df0d9fb9dcb34a0b；共享 profile 固定为 0 / 999。", "由另一来源 Owner 负责的共享根、恢复包 Images/Videos、Android/应用私有/系统边界和 .nomedia 不进入保全分母；其他 regular files 包括非媒体与技术 cache 先保全。", "每次 capture 分配 fresh、不可复用 run-id；manifest 与 frozen delete plan 互相绑定哈希。", "最多尝试 3 个稳定 generation；远端事实漂移或 stale artifact 要求 fresh capture。", "双盘回读完成及时通知数据安全；清空、已就绪差异回写与可拔状态分别报告，优先完成仍依赖手机的步骤，不能默认为下次。", "当前 h_cold_backup=not_used_current_h_health_warning；E/G 双保全不冒充 H 冷备或三副本。", "删除只允许精确文件，不递归目录；单一全局锁和 no-clobber 文件写入阻止并发/覆盖旧代。", "phone-prepare 只消费 manifest 中图片/视频 kind=media；文档不进视觉批次，手机录音自动归位/索引当前仍未证明。"],
    problem: "解决长时间占用手机、单盘副本假安全、备份与清空混淆、系统边界误收和递归删除风险。",
    implementation: ["Device 要求唯一在线设备、model=2410DPN6CC、serial SHA-256=0a1ebafeb85915caf5f0181167f15ed264f6d9776215c183df0d9fb9dcb34a0b 与 profile 0/999 均匹配。", "REMOTE_FACT_SCRIPT 用 NUL framing 返回 path/status/size/mtime/hash，并按 64 项与 24 KiB 命令上限分批，避免路径字符破坏解析。", "capture对纳入分母的regular files最多取得3代稳定远端事实，先按SHA-256合并出现位置并查询媒体/材料库已核验原件；已有内容复用并补E/G缺口，每个真正新增哈希只pull一次。每个来源仍保留自己的路径、时间和精确清空责任，manifest/delete plan继续绑定本次run。", "protect-to-g 写 G 异卷；verify-backup 把 manifest、delete plan、设备身份、E/G bytes/SHA 全部绑定到 receipt。", "delete 要求同一当前设备、有效 backup receipt、精确 run-id 与 --execute，再核对路径/大小/哈希后逐文件删除；不删除目录。", "全局 lock、防覆盖 write_json_once 与 fresh run root 共同避免并发和旧 artifact 被静默复用。"],
    flow: ["识别手机共享边界", "排除其他 Owner 与系统区域", "批量取得远端事实", "写 E 副本", "写 G 副本", "逐项回读", "及时报告数据安全", "优先精确清空与已就绪差异回写", "分别报告可拔与未完项"],
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
    status: `9月5日恢复包基线${current.recoveryItems.toLocaleString("zh-CN")}项、${bytesToGiB(current.recoveryBytes)}，当时under_60gb=true；当前包随本地清理变化，最终收口未完`,
    statusTone: "pass",
    value: "手机损坏、换机或清空后，从有容量上限、逐项可核对的包恢复当前选定照片和视频。保留的色情图片全部加入，色情视频不加入，普通视频按需；文档和录音不加入。包随最终保留集增删，实际手机还要在下次连接后单独清理与回写。",
    why: "把全部媒体无差别回灌会超过手机容量，也会把录音、缓存和不再选择的对象带回去；只有目录没有实际字节又不能恢复。",
    example: "我可以问：“现在这份手机恢复包能恢复多少照片和视频，还缺什么？”系统先只读核对计划、容量和实际文件；确认无误后，只有我明确要求执行才补齐缺失内容。",
    result: "第一层得到计划项数、字节、容量门和 catalog 资格；第二层得到 G 实际包的 existing_size_match/missing 聚合计数与补齐结果。dry-run 不列每个缺失路径；目标冲突才具名 target。两层分开，包外内容保持不动。",
    readerStates: {
      pass: "recovery-status 先证明计划与 catalog 一致且低于 60 GB；recovery-sync dry-run 再证明 G 目标 size-match=全部、missing=0，执行时已有目标还会做 SHA-256 read-back。",
      problem: "缺项时 dry-run 返回 aggregate missing 计数，目标已存在但 size 冲突时具名 target 并失败；计划/资格漂移由 recovery-status 收敛或失败关闭。本人删除原件时，只退出与该 catalog 哈希、固定目标和同一文件身份精确匹配的恢复项；不匹配实体保留为冲突。",
      unavailable: "G 盘、计划或选定原件不可用时停止恢复同步；保留已有恢复包，不用旧成功回执冒充当前。"
    },
    decisionImpact: ["恢复包只含按实际规则选择的照片/视频；保留的色情图片全部加入、色情视频全部排除、普通视频按需，文档与录音不加入。", "录音从不进入手机最小恢复包。", "60 GB 是当前产品上限。", "recovery-sync 默认 dry-run。", "固定包目录跟随当前清单，包外内容和 E 原件不动；用户删原件无需由 AI 代删或通知 AI。"],
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
      { condition: "一个新增候选会让包超过 60 GB", response: "只跳过该新增项，并在 candidate-refresh receipt 记录 phone_skipped_capacity；保持现行封印包，不为纳入它删除未知原件。若既有/最终计划本身已经越界，status/refresh才整体失败。已明确全部纳入的色情图片若与容量发生真实冲突，须说明实际数量和处理方案，不能用自动跳过把“全部”改成抽选；当前未声明出现这一冲突。" },
      { condition: "计划项缺失", response: "dry-run 只返回 missing 聚合数；--execute 对全部缺项逐一核验 source 后补齐。需要具体路径时从已授权的 plan/目标范围另行有界查看。" },
      { condition: "G 盘不可用", response: "返回 unavailable，保留 E 原件和现有计划；不声称恢复包当前可用。" },
      { condition: "包外文件存在", response: "保持原样并单独报告，不作为同步删除目标。" }
    ],
    sources: [{ path: "personal_media.py", role: "recovery-status 与 recovery-sync" }, { path: "phone-recovery-plan.ndjson", role: "当前恢复计划" }, { path: SOURCE_RECEIPT, role: "项数、字节与 60 GB 验收" }],
    verification: [`9月5日计划${current.recoveryItems.toLocaleString("zh-CN")}项、${current.recoveryBytes.toLocaleString("en-US")} B，under_60gb=true；当时${current.selectedRows}项精选全部覆盖，不能据此承诺清理后的现行包数量。`, "真实执行已将精选名称同步到包内，并移除旧分类别名；随后以同一清单重复同步检查无额外复制或删除。", "隔离回归覆盖预览/执行、变化项哈希、只清固定桶、空计划、重复运行及源离线。实际 G 包就绪仍不代表已写回手机。"],
    relation: "它消费分类后的照片/视频 keeper；不拥有云端上传，也不改变本机 canonical 原件。"
  }),
  commonModule({
    slug: "cloud-candidates",
    shortTitle: "云端候选与同步",
    title: "本地期望、云端对象与相册关系分别核对",
    searchAliases: ["Google Photos", "Google Drive录音", "云端候选", "cloud-reconcile", "cloud-sync", "upload=0", "相册异常消失"],
    searchProjection: {
      intents: ["预览媒体上云还差什么", "分别核对Photos照片视频和Drive录音", "解释相册消失或部分上传为什么暂停"],
      entities: ["cloud-reconcile", "cloud-sync", "cloud_object", "cloud_membership", "Google Photos", "Google Drive", "upload=0"],
      relations: ["本地候选不等于云端对象", "对象字节和相册关系分别维护", "当前本地阶段不做云删上传"],
      failureRecovery: ["已建相册ID消失保留未知不重建", "上传身份未知先回读而不清零", "部分结果和配额暂停各自保留"]
    },
    teaser: "照片视频到Photos、录音到Drive；先预览选定工作，再按当前授权阶段执行，部分成功和未知远端身份各自保留。",
    status: "7990eed正式源码已有执行入口；当前本地阶段，云真删/重传及全量结果未在本页验收",
    statusTone: "mixed",
    value: "本地整理不被云故障打断。整理后的照片和视频以Google Photos恢复集加“其他归档”覆盖本地保留集，PSD明确排除；录音进入Google Drive“我的云端硬盘”根目录的“录音”，沿用本地分类，不再把照片视频复制到Drive。需要云端恢复时，分清计划内容、已传字节、缺失关系和当前不能继续的步骤；本轮仍不执行云操作。",
    why: "本地候选不是账号侧备份，上传了字节也不等于已经进入正确相册。网络中断后若把未知对象当作没上传，或在旧相册消失时直接重建，容易产生重复和错误外部状态。",
    example: "我说“先看看这批整理后的照片和录音上云还差什么”。系统预览Photos与Drive各自工作，不调用上传；进入获准云阶段后再按选定范围执行，遇到已建相册消失就明确暂停相关部分，不擅自重建补传。",
    result: "得到本地期望集合、云对象、相册关系与实际执行结果的分层说明。旧候选清单仍可只读查看；云端全量、真删除/重传和手机回写是否完成分别以对应实测为准。",
    readerStates: {
      pass: "预览返回选定范围与待办而不调用提供者；获准执行时分别记录对象和相册关系结果，已上传对象先补关系，再处理新字节。",
      problem: "部分成功、配额暂停、对象身份未知或已建相册异常消失时保存精确缺口，不把整批当成功，也不盲目重传。",
      unavailable: "本地期望不完整、来源不可读或现有PCConfig提供者不可用时，只停止受影响步骤；不猜账号、不另建云入口，不让云故障改动本机原件。"
    },
    decisionImpact: [
      "当前正式阶段是本地去留与索引/备份收口；云端真删除和重传后续，不在网页刷新时执行。",
      "后续已获准范围内的正常云增量不逐批重复索要批准；扩大来源、账号或公开面仍按真实授权处理。",
      "照片/视频走Photos恢复集与其他归档，PSD排除且不另投Drive或自动转码；两类色情保留内容全部归云端恢复集的同名相册，不按季度拆。录音走Drive根目录的录音集合并沿用本地分类，不进手机恢复包或Photos。旧Photos清除不顺带删除Drive录音；音乐、铃声和文档不扩入本次云范围。",
      "本地保留、手机资格与云端资格分别判断，不能用一个keeper标记自动填满所有集合。",
      "可信原件删除仍由现有本地维护收敛候选；云端真实删除不是本地索引删除的同义词。",
      "旧upload=0字段只说明对应本地候选观察，不证明后续账号侧从未发生上传。"
    ],
    problem: "解决候选冒充备份、对象与相册混为一谈、部分上传中断后重复传输、旧相册身份丢失以及云故障拖住本地整理。",
    implementation: [
      "cloud-candidates.ndjson继续保存本地逐项候选与相册计划，candidate-refresh记录本地刷新；cloud-status只读，不启动同步。",
      "cloud-reconcile根据当前目录和选定范围建立本地期望对象与关系；--execute也只写本地SQLite，不调用提供者。",
      "cloud-sync默认返回DRY_RUN_PROVIDER_NOT_CALLED；显式--execute才经现有PCConfig提供者工作，并先拒绝缺失或不完整的本地期望状态。",
      "同一SQLite内的cloud_object与cloud_membership分别保存内容对象和集合关系，不新建第二媒体库。已有上传身份不因相册消失而清零。",
      "Photos先核对远端对象与已存相册ID，先补已上传对象的相册关系，再按相册分组处理小文件，批次大小1至50；保留每项部分结果，配额限制暂停受影响工作。",
      "已建相册ID不存在或歧义时记unknown并阻塞该集合，不自行重建补传；上传身份不明时保留不确定性，先回读而非猜未上传。",
      "云操作使用可复用的提供者会话并在结束关闭；cloud-reconcile、候选更新、上传字节、相册归属和真实删除各有不同效果。"
    ],
    flow: ["完成本地分类与去重", "按真实范围预览期望集合", "当前阶段允许时写本地期望", "预览云工作且不调用提供者", "进入获准云阶段后回读远端身份", "先补已有对象的集合关系，再有界处理新字节", "分别报告完成、部分、暂停与未知"],
    concepts: [
      { term: "Cloud candidate（云端候选）", explanation: "本地计划，不等于目标账号已有字节。" },
      { term: "Desired state（期望状态）", explanation: "本次范围内应存在的内容对象及集合关系，先在本地表达。" },
      { term: "Membership（集合关系）", explanation: "已上传对象与相册的关联，和对象字节分别维护。" },
      { term: "External read-back（外部回读）", explanation: "从现有目标提供者核对真实对象与相册身份；本地清单和命令成功不能代替。" }
    ],
    boundaries: ["预览不上传。", "本次网页核对不连接账号或执行云动作。", "不把旧零上传记录写成永久产品限制。", "不让云故障改变本机原件。", "不在网页复制候选原始清单。", "当前实现存在不证明云端全量和手机恢复完成。"],
    failures: [
      { condition: "本地期望缺失或不完整", response: "cloud-sync执行前拒绝，先通过现有cloud-reconcile核对该范围。" },
      { condition: "已建相册ID消失或存在多个身份", response: "保留unknown与现有上传身份，暂停相关集合，不盲目重建或补传。" },
      { condition: "配额、网络或部分对象失败", response: "保留逐项结果和暂停原因；已上传对象先核对关系，不把整个批次重传或报告全部完成。" },
      { condition: "候选与原件漂移", response: "本地维护先收敛清单；真实云删除/重传按独立阶段与实际能力处理。" }
    ],
    sources: [{ path: "AGENTS.md / USER_REQUIREMENTS.md", role: "当前用户阶段、集合用途与实际授权边界" }, { path: "personal_media.py", role: "候选、cloud-reconcile、cloud-sync与同库状态" }, { path: "cloud-candidates.ndjson", role: "本地外部计划，非账号侧回读" }, { path: SOURCE_RECEIPT, role: "9月5日候选数量和零上传历史证据" }],
    verification: [`9月5日本地候选${current.cloudCandidates.toLocaleString("zh-CN")}项、${current.cloudBytes.toLocaleString("en-US")} B及upload=0仅保留原观察。`, "2026-09-12只读核对7990eed正式函数、CLI分流和用户阶段；没有执行提供者或真实云端回读。", "当前工作树未发布的cloud_upload相关改动不属于本页已发布能力；云全量、相册最终收敛和手机实际回写仍需来源各自验收。"],
    relation: "它消费媒体整理后的集合，与本地原件和手机恢复分开；当前阶段先完成本地工作，云端结果按实际后续动作核验。"

  })
];

export const project = personalMediaProject;
export const modules = personalMediaModules;
export { personalMediaProject, personalMediaModules };
