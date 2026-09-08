import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  "observedAt": "2026-09-08T08:17:27Z",
  "label": "日常备份已生成新点；G 与 H 保存同一份 6,898 文件的对话恢复点",
  "boundary": "源码截止2026-09-08T08:00:42Z；实际只读采集在08:11—08:17Z。最新点创建于04:15:08Z，6,898文件、77,376,044,970字节，H于06:44Z完成独立校验。采集时活动源另有6,923文件，两者不是同一时间点。三个源测试套件沿用9月7日验收；本轮没有重抓VSS、重新读取全部72.06GiB对象或做新机器恢复。",
  "metrics": [
    {
      "label": "配置与记忆",
      "value": "243 文件 · 2.53 MiB 源清单"
    },
    {
      "label": "最新对话备份点",
      "value": "6,898 文件 · 72.06 GiB"
    },
    {
      "label": "历史存储",
      "value": "相同文件复用 · 会话对象不自动清理"
    },
    {
      "label": "恢复方式",
      "value": "先恢复到空目录 · 保留当前环境"
    }
  ],
  "facts": [
    {
      "label": "源版本与本轮修复",
      "value": "冻结PRIVATE（私有）main为77c1a4011c8cd49dfd06f69614cbb9cb0ef034f1，远端回读同值、工作区干净。相对8e50e19的两个提交只有例行备份载荷变化；工具与恢复文档未变，仍从实际CODEX_HOME所在的E卷捕获，不把载荷更新写成程序升级。"
    },
    {
      "label": "小文件源清单",
      "value": "2026-09-08T08:16:34Z的DryRun（试运行）选中243文件、2,656,388字节（2.53MiB）。这是采集时待备份的小文件，不是08:00:42Z的冻结正文，也不是私有库完整历史或固定容量上限。当前仓库MANIFEST保留历史后为713文件、5,711,701字节，与当次源清单分别计算。"
    },
    {
      "label": "G 最新会话点与活动源不同",
      "value": "G current.json指向20260908T041508Z-d14c3a16，04:20:33Z发布；manifest为6,898文件、77,376,044,970字节（72.06GiB）。08:11Z的活动源Inspect为6,923文件、77,555,687,374字节（72.23GiB）。Inspect只盘点活动源，不核验已备份对象；快照后新增或变化内容要等下一次热备。"
    },
    {
      "label": "两条备份管道各自保留历史",
      "value": "轻量备份先把当前选中文件写成本地快照并在 G 盘核验，再同步私有 GitHub。只有复制到私有仓库时启用 ProtectHistory：较小的 memories/raw_memories.md 不覆盖已有大版本，已有 rollout_summaries 文件不被就地覆盖，backup-only 记忆历史保留。当前源快照仍可记录缩小后的文件；大小比较不能判断正文是否正确。"
    },
    {
      "label": "运行中的会话从 E 卷快照读取",
      "value": "Invoke-CodexConversationBackup.ps1 在 E:\\Data\\AppData\\Codex 所在卷创建 VSS（卷影复制服务）时间点副本，捕获标注 vss_crash_consistent（崩溃一致性）。它减少活动文件复制时间错位，不承诺应用层事务已全部提交、零 I/O 开销或恢复到故障前最后一秒。"
    },
    {
      "label": "去重、校验与保留期限",
      "value": "会话文件按 SHA-256（安全哈希算法 256 位）存入 CAS（内容寻址存储）对象池，单个对象按内容复用；每个点有 manifest、closure，引用对象校验通过才切换 current.json。会话点与对象只增不自动 GC（垃圾回收）；轻量本地与 G 快照保留 30 份，内容相同的 G 快照复用。两条保留策略不同。"
    },
    {
      "label": "实际任务状态",
      "value": "Codex Memory Backup以当前用户普通权限每日20:05、22:05执行，最近2026-09-08T05:05:01Z返回0。CodexConversationBackup-Hot-Daily每日21:15以Highest（最高权限）执行，最近04:15:01Z返回0；任务规格回读通过。PCConfig冷任务06:30:01Z启动、返回0，06:54:56Z完成。日期按UTC表示，调度时刻按本机时区。"
    },
    {
      "label": "H 冷盘与数据边界",
      "value": "H当前可读。06:44:26Z的原生cold回执为complete、readback_verified=true，指向与G相同的20260908T041508Z-d14c3a16。网页本轮另比对两端manifest与closure：SHA-256分别同为40bb55a5b4955cc8f5dd39b4efb3d976bfe9218abbed011f798165f4b9b84e74、7d00b1bb033b41e7bc56c64a68416b7e9e6a150ef3fce9f08cddbf020fab516a。完整对象验证是原任务证据，本轮只重读小元数据；auth.json、缓存与原始会话仍不进入轻量Git路径。"
    }
  ],
  "gaps": [
    "G/H已经追平04:15:08Z这一点，不包含之后新产生的会话；H日后离线时仍会按原有调度跳过，不承诺实时同步。",
    "9月7日合成数据去重/隔离恢复、白名单/Git异常分支与任务规格测试保留为原日期证据。本轮读取自然备份的正式回执和元数据，没有重抓生产VSS、全量对象重验或换机后打开Codex。",
    "raw_memories 大小保护仅避免较小当前文件覆盖私有仓库的大版本；同等或更大的错误正文仍需人判断，轻量 G 快照保存的是当次源内容。",
    "会话对象没有自动清理策略，变化后的大型数据库会形成新对象，长期容量仍会增长。",
    "会话 Restore 先生成文件副本；轻量恢复按文档把配置、记忆和技能放回运行根。两者都不自动注册服务、设置全局环境或恢复登录，新机器是否可用仍需应用层验证。"
  ]
});

export const codexMemorySnapshot = Object.freeze({
  ...baseSnapshot,
  ...{
  "generation": "Codex 配置记忆与会话分流备份",
  "sourceCommit": "77c1a4011c8cd49dfd06f69614cbb9cb0ef034f1",
  "sourceRoot": "E:\\Projects\\Backups\\codex-memory",
  "physicalCodexHome": "E:\\Data\\AppData\\Codex",
  "hotRoot": "G:\\80_Backup\\ControlPlane\\AIMemory\\Codex",
  "conversationHotRoot": "G:\\80_Backup\\ControlPlane\\AIMemory\\CodexConversations",
  "conversationColdRoot": "H:\\80_自动备份区\\ControlPlane\\AIMemory\\CodexConversations\\cold-payload",
  "currentPointId": "20260908T041508Z-d14c3a16",
  "conversationFileCount": 6898,
  "conversationTotalSizeBytes": 77376044970,
  "liveSourceFileCount": 6923,
  "liveSourceTotalSizeBytes": 77555687374,
  "memoryFileCount": 243,
  "memoryTotalSizeBytes": 2656388,
  "scheduledTasks": [
    {
      "taskName": "Codex Memory Backup",
      "trigger": "每日 20:05 与 22:05",
      "launcher": "tools/codex_memory_backup_hidden.vbs",
      "script": "tools/backup-codex-memory.ps1",
      "runLevel": "Limited（普通权限）",
      "lastRunUtc": "2026-09-08T05:05:01Z",
      "lastResult": 0
    },
    {
      "taskName": "CodexConversationBackup-Hot-Daily",
      "trigger": "每日 21:15",
      "launcher": "tools/codex_conversation_hot_hidden.vbs",
      "script": "tools/Invoke-CodexConversationBackup.ps1 -Mode Hot -Execute -Json",
      "runLevel": "Highest（最高权限）",
      "lastRunUtc": "2026-09-08T04:15:01Z",
      "lastResult": 0
    },
    {
      "taskName": "AIRecoveryColdSync-Daily",
      "owner": "PCConfig",
      "trigger": "既有冷备调度",
      "mode": "增量复制 cold-payload；由 FinalizeCold 校验 H 后发布指针",
      "currentHAvailable": true,
      "lastRunResult": "2026-09-08T06:30:01Z启动返回0；06:54:56Z complete，H对话点06:44:26Z完成独立回读"
    }
  ]
},
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const codexMemoryProject = {
  ...codexMemorySnapshot,
  ...{
  "order": 20,
  "slug": "codex-memory",
  "title": "Codex Memory Backup",
  "kicker": "备份 Codex 配置、记忆和历史对话",
  "route": "/projects/codex-memory",
  "visibility": "私有仓库",
  "statusTone": "accent",
  "cardStatus": "日常备份正常 · G/H已保存同一对话点",
  "cardStatusTone": "accent",
  "cardMetrics": [
    {
      "label": "配置与记忆",
      "value": "243 文件 · 2.53 MiB 源清单"
    },
    {
      "label": "最新对话备份点",
      "value": "6,898 文件 · 72.06 GiB"
    },
    {
      "label": "历史存储",
      "value": "相同文件复用 · 会话对象不自动清理"
    },
    {
      "label": "恢复方式",
      "value": "先恢复到空目录 · 保留当前环境"
    }
  ],
  "searchAliases": [
    "codex-memory",
    "Codex Memory Backup",
    "Codex记忆备份",
    "Codex对话备份",
    "AI记忆灾备",
    "Codex会话恢复",
    "第20项目",
    "CODEX_HOME备份",
    "双轨灾备架构",
    "会话与配置分离"
  ],
  "searchProjection": {
    "intents": [
      "Codex重装电脑后怎么快速恢复配置记忆和历史对话",
      "为什么不能用Git直接备份70G的Codex目录",
      "raw_memories文件被意外写小怎么防止记忆丢失",
      "Codex运行时数据库被占用怎么无损备份对话",
      "排查Codex对话备份计划任务运行状态与空间占用"
    ],
    "entities": [
      "backup-codex-memory.ps1",
      "Invoke-CodexConversationBackup.ps1",
      "Install-CodexConversationBackupTask.ps1",
      "g-hot-snapshot.ps1",
      "E:\\Data\\AppData\\Codex",
      "G:\\80_Backup\\ControlPlane\\AIMemory",
      "H:\\80_自动备份区\\ControlPlane\\AIMemory",
      "wlyaaaaa/codex-memory",
      "raw_memories.md",
      "vss_crash_consistent",
      "cold-payload\\objects\\sha256"
    ],
    "relations": [
      "轻量配置与记忆由backup-codex-memory同步到GitHub私有仓库和G盘热快照",
      "原始会话与大型数据库由Invoke-CodexConversationBackup通过VSS卷影提取到BitLocker加密G盘并冷同步H盘",
      "恢复时强制阻断写入活动的CODEX_HOME以防损坏运行中数据库"
    ],
    "failureRecovery": [
      "当raw_memories体积变小时自动保留更大的历史版本防止清空",
      "当Git远端分叉或落后时自动fail-closed拒绝强推",
      "当H盘脱机时自动跳过冷备不阻塞日常热备"
    ]
  },
  "repositoryNote": "源仓库 wlyaaaaa/codex-memory 为 PRIVATE（私有），存放备份脚本和选定的小文件历史；网页只解释产品、拓扑与元数据，不发布记忆正文、历史会话或登录文件。原始会话对象仅进入登记的本地 G/H 备份路径，GitHub 不是会话数据中转站。",
  "summary": "这套工具替我保留两类东西：规则、配置、记忆和已安装技能放进私有 GitHub 与 G 盘的小文件快照；历史对话、附件、生成图片和数据库另存到 G 盘。备份对话时可以继续使用 Codex。找回历史对话时，先恢复到单独空目录；换机要还原配置、记忆和技能时，则按原相对路径把选定的小文件副本放回实际 CODEX_HOME，再核对应用是否可用。H盘冷备是第三份副本；9月8日的既有冷任务已把同一对话点复制并独立校验，快照以后新增的内容仍要等下一次。",
  "why": "只保存配置，换机后还找不到旧对话；直接复制正在写入的整个 Codex 目录，又会混入缓存、登录文件，并可能得到不同时间的数据库和索引。项目把小文件版本历史与大体积会话快照分开维护，并让本地备份、云端同步、冷盘复制各自给出结果。",
  "plainExample": "我想把上周一段对话找回来，又不想动现在正在工作的 Codex。工具可以把选定备份点还原到一个空文件夹，保留原来的目录和文件名，并核对文件哈希。这个结果是一份可检查的历史文件副本；它不会自动替换当前环境，也不代表新机器已经登录或能立即继续原对话。",
  "result": "得到小文件版本、明确时间的对话恢复点，以及可先检查的历史副本。恢复方式分两条：会话脚本还原到空目录；轻量配置、记忆和技能按文档复制回实际运行根。每条链分别显示是否完成，登录和应用能否继续使用另外核验。恢复速度取决于数据量和磁盘。",
  "readerStates": {
    "pass": "我能看到小文件版本和明确时间的会话备份点，各自标明是否完成。会话恢复交回已核验的空目录副本；轻量恢复则把选定配置、记忆和技能放回运行根，再确认应用加载结果。",
    "problem": "H不可用时当轮冷备明确未完成；源文件继续变化时，活动源清单与上一备份点分别列出，不把当前源数量当成已经备份的数量。",
    "unavailable": "Hot（热备）和 VssProbe（卷影探测）需要管理员权限及 -Execute。Restore（恢复）需 -Execute 和专用空目录，不能覆盖活动 CODEX_HOME 及其子目录。"
  },
  "productPrinciples": [
    {
      "title": "配置和对话分别保存",
      "detail": "小文件适合 Git 版本历史，大体积会话和数据库走本地快照。两条备份可以各自成功或失败，结果分开报告。"
    },
    {
      "title": "较小记忆不轻易覆盖历史",
      "detail": "私有仓库保留较大的 raw_memories.md 和已有 rollout_summaries；这是有限的保留规则，不把文件更大当成内容一定更正确。"
    },
    {
      "title": "备份时继续工作",
      "detail": "会话热备从 VSS 时间点副本读取，无须强制退出 Codex；会使用磁盘资源，也不承诺应用一致性和零卡顿。"
    },
    {
      "title": "先恢复副本，再决定启用",
      "detail": "会话 Restore 只写独立空目录，拒绝活动运行根和备份/状态目录。轻量恢复沿用文档，把选定的小文件副本按相对路径复制回运行根。两种路径都把文件还原与应用实际可用分开验收。"
    },
    {
      "title": "冷盘未到就明确未完成",
      "detail": "H 不可用时现有冷任务跳过，保留 G 结果；插盘本身不是触发器，要等原有调度或明确运行冷同步。"
    }
  ],
  "responsibilities": [
    "按白名单备份配置、安装技能与记忆，保留私有 Git 的历史记忆并验证远端提交。",
    "从 E 卷 VSS 副本捕获原始会话、附件和状态，用 CAS 去重写入 G。",
    "维护点清单、闭包、原子指针与独立 H 校验入口；跨盘复制由已有 PCConfig 冷任务负责。",
    "将选定会话点还原到独立空目录，核验文件而不替换活动应用。",
    "通过既有 VBS 启动器与两个日常任务运行，输出任务、进度和回执。"
  ],
  "exclusions": [
    "轻量 Git 路径排除 auth.json、installation_id、原始 sessions/JSONL、SQLite/WAL/SHM、运行态、模型和插件缓存。",
    "会话备份排除诊断日志库、缓存、插件、worktrees 和链接目标；不是整个 CODEX_HOME 的无差别镜像。",
    "会话 Restore 不复制轻量 Git 管道的全部内容，也不会把当前环境改成恢复版本。",
    "本轮网页验收只检查生产元数据与任务，不触发大体积生产备份、真实恢复或冷盘挂载。"
  ],
  "usageExamples": [
    {
      "moduleSlug": "config-memory-whitelist-sync",
      "ask": "重装前，我的 Codex 设置、技能和记忆有副本吗？",
      "effect": "先看轻量任务结果与私有库版本；需要时运行现有备份入口。G 快照和私有 Git 是否完成分开核对。"
    },
    {
      "moduleSlug": "vss-conversation-hot-backup",
      "ask": "正在使用 Codex，旧对话还能在后台备份吗？",
      "effect": "现有最高权限任务从 E 卷 VSS 副本读取原始会话，完成对象回读后发布 G 点；不要求退出前台应用。"
    },
    {
      "moduleSlug": "content-addressed-storage-cold-sync",
      "ask": "很多备份都有相同附件，能不能少存几份？",
      "effect": "内容相同的文件复用同一哈希对象。文件变了仍要保存新对象；冷盘连接后由既有冷任务同步并校验。"
    },
    {
      "moduleSlug": "isolated-disaster-recovery",
      "ask": "把上周的会话恢复出来，先不要动现在的 Codex。",
      "effect": "指定点位和专用空目录，核验后重建原目录和文件名。先检查这份副本，再判断是否需要应用层恢复。"
    }
  ],
  "operatingFlow": [
    {
      "title": "确定来源与备份类型",
      "detail": "解析登记的 E 盘 CODEX_HOME；小文件走白名单，会话及数据库走 VSS。"
    },
    {
      "title": "先形成可核验的本地结果",
      "detail": "轻量当前源复制成本地/G 快照；会话先写对象、点清单和闭包，引用对象校验完成才更新 G 指针。"
    },
    {
      "title": "分别收口私有云与冷盘",
      "detail": "轻量仓库保留历史后 fetch 检查分支，再 commit/push 并 ls-remote 回读；冷盘由现有 PCConfig 任务复制和 H 独立校验，离线则跳过。"
    },
    {
      "title": "需要时恢复文件副本",
      "detail": "指定 PointId 与空 DestinationRoot；先完整校验点，再还原文件并回读。当前应用不被替换。"
    }
  ],
  "components": [
    {
      "name": "backup-codex-memory.ps1",
      "responsibility": "轻量白名单、历史保留与私有 Git 同步",
      "implementation": "Resolve-CodexMemorySource 解析物理根；Copy-SelectedFiles 的 ProtectHistory 只用于仓库副本；Get-GitMainSyncState 检查 behind/diverged，Sync-GitMain 推送已超前提交并 ls-remote 回读。"
    },
    {
      "name": "g-hot-snapshot.ps1",
      "responsibility": "当前小文件快照与 G 回读",
      "implementation": "Publish-GHotSnapshot 计算清单与 SHA-256，复用相同快照、更新 ai-memory.g-hot-current.v1 指针；本地与 G 轻量快照保留 30 份。"
    },
    {
      "name": "Invoke-CodexConversationBackup.ps1",
      "responsibility": "会话快照、对象池、点校验和文件恢复",
      "implementation": "以 8MB 缓冲区读取对象；VSS 精确绑定登记 E 卷；Write-AtomicBytes 写穿并原子替换元数据，Test-CodexConversationPoint 校验清单、闭包、每个独有对象。"
    },
    {
      "name": "Install-CodexConversationBackupTask.ps1 与 VBS 启动器",
      "responsibility": "会话日任务计划、安装和规格回读",
      "implementation": "Plan/Inspect 暴露实际规格；会话任务每日 21:15、Highest，经 wscript.exe 隐藏启动。轻量日任务每日 20:05/22:05 以普通权限运行。"
    },
    {
      "name": "tools/test-codex-memory-backup.ps1 等三个源测试入口",
      "responsibility": "本地回归验证",
      "implementation": "覆盖轻量源清单、G 快照、Git 超前/落后/分叉/拒推/远端回退，以及三个人工点的去重与恢复、任务计划；不执行生产重备份。"
    }
  ],
  "technicalContracts": [
    {
      "artifact": "轻量 MANIFEST.json",
      "schema": "sourceRoot / totalSizeBytes / files",
      "owner": "tools/backup-codex-memory.ps1",
      "boundary": "DryRun 清单描述当次源文件；仓库 MANIFEST 描述备份仓库小文件集合。文件数和大小是观察结果，没有 2.5MB 固定上限。"
    },
    {
      "artifact": "G 轻量快照与指针",
      "schema": "ai-memory.g-hot-snapshot.v1 / ai-memory.g-hot-current.v1",
      "owner": "tools/g-hot-snapshot.ps1",
      "boundary": "独立重新读取并核验复制结果后发布；与 Git 推送分开收口。"
    },
    {
      "artifact": "会话点清单与闭包",
      "schema": "codex.conversation-backup.manifest.v1 / codex.conversation-backup.closure.v1",
      "owner": "tools/Invoke-CodexConversationBackup.ps1",
      "boundary": "files 包含相对路径、length 和 sha256；闭包绑定 manifest_sha256、file_count 和 total_size_bytes，当前源 Inspect 不能代替点校验。"
    },
    {
      "artifact": "会话 current.json",
      "schema": "codex.conversation-backup.pointer.v1",
      "owner": "G:/80_Backup/ControlPlane/AIMemory/CodexConversations/current.json",
      "boundary": "字段为 point_id、closure_sha256、published_utc、capture_semantics。最新点的闭包哈希为 4bb807b1a7cb0b7cbacb2d5d8c2ae0160e66bf150c6c18eb5d8980824804ca67。"
    },
    {
      "artifact": "校验、恢复和运行进度",
      "schema": "codex.conversation-backup.validation.v1 / codex.conversation-backup.receipt.v1 / codex.conversation-backup.progress.v1",
      "owner": "Invoke-CodexConversationBackup.ps1",
      "boundary": "Validate 读取并哈希对象，同时写本地进度；Restore 需要 -Execute，目标不能是活动根或备份/状态根及其子目录，已有目标必须为空且不是 reparse point。"
    },
    {
      "artifact": "H 冷备",
      "schema": "cold-payload + H current.json + cold-last.json",
      "owner": "PCConfig AIRecoveryColdSync-Daily / 本项目 FinalizeCold",
      "boundary": "已有冷任务负责增量复制；H 上闭包与对象校验通过才发布 H 指针，不直接复制 G 指针。H 不可用不等于最新冷备完成。"
    }
  ],
  "evidenceLayers": [
    {
      "layer": "当前源与文档修复",
      "proves": "冻结PRIVATE main 77c1a40已远端回读；工具与文档仍为8e50e19代码输入，后续两个提交只有备份载荷。E卷快照、白名单、对象池和恢复入口真实存在。",
      "doesNotProve": "源码和文档不证明本轮又执行过生产备份或应用恢复。"
    },
    {
      "layer": "三套源回归",
      "proves": "9月7日完成G快照、五类Git同步分支、3点dedup_verified/restore_verified与任务计划测试；本次仅重新盘点243文件源清单和任务规格。",
      "doesNotProve": "合成点恢复不证明真实72.06GiB数据已在新电脑打开，也不证明零卡顿或恢复速度。"
    },
    {
      "layer": "任务与生产元数据",
      "proves": "9月8日两条日常任务最近返回0；G/H指向同一6898文件点，活动源采集时另为6923文件。",
      "doesNotProve": "未重新哈希全部生产对象，也未检测应用打开恢复内容的结果。"
    },
    {
      "layer": "H 介质状态",
      "proves": "本次Inspect为h_available=true；H原生cold回执complete/readback_verified=true，与G清单和闭包哈希一致。",
      "doesNotProve": "完整对象校验属于06:44Z原任务；本次小元数据比较不证明新机器应用恢复，也不代表未来点已同步。"
    }
  ],
  "operationalEntrypoints": [
    {
      "name": "恢复轻量配置、记忆和技能",
      "command": "按 README.md 的 Restore 说明，将选定私有仓库版本中的小文件按原相对路径复制到实际 CODEX_HOME（当前 E:\\Data\\AppData\\Codex）；排除 .git、tools、.local-snapshots、logs",
      "purpose": "例如 config.toml 回运行根、memories 回同名子目录、skills 回同名子目录。它是手工文件复制路径，不调用会话 -Mode Restore，没有那个入口的活动根拒绝规则；会改变目标文件，应先核对当前内容和版本，再核对登录、配置加载和技能是否实际可用。"
    },
    {
      "name": "轻量清单预检",
      "command": "pwsh -NoProfile -File .\\tools\\backup-codex-memory.ps1 -DryRun",
      "purpose": "只列当次白名单源文件；加 -ManifestPath 可把清单写到选定位置，不提交或推送。"
    },
    {
      "name": "轻量备份",
      "command": "pwsh -NoProfile -File .\\tools\\backup-codex-memory.ps1",
      "purpose": "当前源写本地/G 快照，仓库历史保留后按 Git 状态正常推送并远端回读。"
    },
    {
      "name": "源盘点与点指针检查",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -Mode Inspect -Json",
      "purpose": "只读输出当前源文件数/字节数、当前 G 点标识与 H 是否可用；不验证 G 对象完整性。"
    },
    {
      "name": "会话任务规格",
      "command": "pwsh -NoProfile -File .\\tools\\Install-CodexConversationBackupTask.ps1 -Mode Inspect -Json",
      "purpose": "只读检查实际任务是否匹配计划及最近返回码。"
    },
    {
      "name": "会话热备（管理员）",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -Mode Hot -Execute -Json",
      "purpose": "实际创建登记 E 卷 VSS，写入 G 点并核验；有真实磁盘与管理员副作用。"
    },
    {
      "name": "完整核验最新 G 点",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -Mode Validate -Json",
      "purpose": "逐一读取哈希对象；不改备份对象，但会写本地 validate-progress.json。"
    },
    {
      "name": "恢复到空目录",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -Mode Restore -PointId latest -DestinationRoot <专用空目录> -Execute -Json",
      "purpose": "核验点后恢复原目录与文件名，再校验结果；不切换活动应用。"
    }
  ],
  "glossary": [
    {
      "term": "VSS（卷影复制服务）",
      "meaning": "从一个数据卷的时间点副本读取正在变化的文件，减少跨文件复制时点不一致。"
    },
    {
      "term": "vss_crash_consistent（崩溃一致性）",
      "meaning": "捕获标记描述类似异常停机时可见的磁盘状态；不代表应用已完成所有事务，恢复后仍可能需要数据库自身恢复和应用验收。"
    },
    {
      "term": "CAS（内容寻址存储）",
      "meaning": "按文件内容的 SHA-256 定位对象，相同内容复用，不同内容保留新对象。"
    },
    {
      "term": "小文件不覆盖大文件",
      "meaning": "本项目只对私有仓库 memories/raw_memories.md 实施大小保留，不是所有文件、所有备份层的通用完整性保证。"
    },
    {
      "term": "fail-closed（失败关闭）",
      "meaning": "Git 远端状态不满足同步条件或点校验失败时停止相应动作，不强推或发布未经核验的指针。"
    },
    {
      "term": "BitLocker（Windows 驱动器加密技术）",
      "meaning": "本项目要求 G 是已登记、已解锁且完整加密的备份卷；磁盘加密与文件是否备份成功分别核验。"
    }
  ],
  "evolution": [
    {
      "date": "2026-07",
      "result": "建立小文件白名单、静默日任务、私有 Git 版本历史与可回读的 G 快照；明确远端落后/分叉时停止以及只保留近期轻量快照。"
    },
    {
      "date": "2026-08",
      "result": "会话与轻量配置分流：运行期 VSS、内容寻址 G/H 存储、点校验和隔离恢复形成独立路径；物理来源迁到 E 盘。"
    },
    {
      "date": "2026-09",
      "result": "Git 临时传输失败支持读取当时系统代理并按 30/120/300/900 秒间隔有限重试，不固定代理端口。"
    }
  ],
  "snapshotUpdateNote": "当前源与测试观察于 2026-09-07；最新 G 点保留其 04:15 的创建时间。页面分别展示活动源盘点、已发布点、合成测试、任务状态与未完成的冷备/应用恢复。",
  "dataSources": {
    "title": "具体保存什么，分别放在哪里",
    "intro": "来源是 E:\\Data\\AppData\\Codex。规则和个人能力的规范源仍由 E:\\.agents 拥有；这里负责备份运行环境里的选定副本。",
    "rows": [
      {
        "source": "Codex 规则、配置、安装技能与记忆文件",
        "data": "AGENTS.md、config.toml、version.json、Chrome 原生宿主配置、browser/computer-use 配置、选定 vendor_imports、memories 和 skills。",
        "result": "当前源快照写入本地与 G；私有 Git 历史另保留较大的 raw_memories 和已存在的 rollout_summaries。"
      },
      {
        "source": "Codex 原始会话和应用状态",
        "data": "sessions、archived_sessions、thread backups、附件、听写历史、会话 JSONL 索引、非诊断日志 SQLite 数据、生成图片/visualizations 和自动化状态；排除 reparse point、auth、cache、plugins、worktrees 和诊断日志数据库。",
        "result": "从同一次 E 卷 VSS 快照取数，按文件内容写入 G 的对象池并生成恢复点；不推送 GitHub。"
      },
      {
        "source": "备份清单、指针与任务状态",
        "data": "G 点的文件数/字节数和哈希、当前源 Inspect 汇总、计划任务最后返回码；不读取或展示会话正文。",
        "result": "分别判断源有多少、已保存多少、任务是否执行以及 H 是否可用。"
      }
    ]
  }
}
};

export const codexMemoryModules = [
  {
    "slug": "config-memory-whitelist-sync",
    "shortTitle": "白名单与防截断",
    "title": "配置、技能和记忆的白名单备份",
    "subtitle": "当前源快照与私有仓库历史分别维护",
    "teaser": "备份小文件，保留历史记忆，并核对私有 Git 推送",
    "order": 1,
    "status": "9月7日白名单/G快照/Git分支回归通过；9月8日日常轻量任务最近返回0",
    "statusTone": "accent",
    "relation": "负责配置、安装技能和记忆文件；长期规则的规范源仍是 E:\\.agents。",
    "value": "把选定的小文件保存在 G 快照与私有 Git 历史里。需要恢复配置或找旧记忆时有明确版本，不把庞大会话库混进这条链。",
    "why": "配置和记忆小、适合版本对比；会话数据库大且持续变化，需要另一条快照路径。保留分工可避免某一条链失败时误报全部完成。",
    "example": "我今天改了 Codex 设置，晚间任务先保存当次源文件，再更新私有仓库。若 raw_memories 变小，仓库保留旧大版本并在日志注明；G 当次快照仍记录当前源内容。",
    "result": "得到当次源快照、带历史保留的小文件仓库和独立 Git 远端回读。换机或重装需要还原这些内容时，按相对路径将选定的配置、memories 和 skills 复制回实际 CODEX_HOME，排除 .git、tools、.local-snapshots、logs；文件放回不等于登录和应用使用已验收。",
    "problem": "避免把数据库/缓存塞入 Git，同时减少较小 raw_memories 覆盖私有历史的风险。",
    "readerStates": {
      "pass": "白名单扫描完成，大版本尺寸核验通过，G 盘快照写入且 Git 私有库推送成功，ls-remote 回读一致。",
      "problem": "当前 raw_memories.md 比私有仓库里的版本小，仓库保留旧大版本并写明日志；当次 G 快照仍记录当前源文件，不把两个结果混为一谈。",
      "unavailable": "若 Git 远端处于落后（Behind）或分叉（Diverged）状态，脚本 fail-closed 退出，提示人工核对冲突。"
    },
    "decisionImpact": [
      "AGENTS.md、config.toml、version.json、Chrome/native/browser/computer-use 配置、选定 vendor_imports、memories/**、skills/** 构成源白名单。",
      "auth、installation_id、原始 sessions/JSONL、SQLite/WAL/SHM、cache、plugins 等排除。",
      "私有仓库只在相应历史保留条件满足时保留旧记忆；当前源快照和私有历史不混淆。",
      "Git 分支状态和远端回读是云端完成条件，不抹掉独立的 G 结果。"
    ],
    "implementation": [
      "轻量恢复沿用 README.md Restore 的手工复制说明：从选定私有仓库版本恢复相对路径到实际物理 CODEX_HOME，排除 .git、tools、.local-snapshots、logs。这个路径没有会话恢复器的活动根阻断；覆盖前先核对当前目标与选定版本。",
      "Copy-SelectedFiles 第一次写 .local-snapshots 不带 ProtectHistory，随后 Publish-GHotSnapshot 写 G 并回读。",
      "复制到仓库时才用 ProtectHistory：较小 raw_memories 不覆盖，已有 rollout_summaries 不覆盖，backup-only 记忆不删。",
      "本地/G 轻量快照保留 30 份，相同 G 内容复用；会话对象池的只增策略不适用于此处。",
      "Get-CurrentSystemGitProxyUri 仅为当前 Git 调用读取系统代理；NetworkRetryDelaysSeconds 为 30/120/300/900 秒。"
    ],
    "flow": [
      "解析登记 E 盘来源，按白名单挑选文件。",
      "把当前文件写成本地快照、G 快照并核验。",
      "复制到私有仓库时实施历史保留，移除已被跟踪但违反白名单的运行缓存。",
      "fetch 检查分支，behind/diverged 停止提交与推送；G 已完成的快照仍保留。",
      "有实质变更才提交；已有本地超前提交即使无新文件变化也推送，ls-remote 必须与 HEAD 一致。"
    ],
    "concepts": [
      {
        "term": "Memory Truncation Guard（记忆截短保留）",
        "explanation": "只比较指定文件大小并保留仓库中的大版本；不承诺自动识别正文损坏。"
      },
      {
        "term": "Dynamic Proxy Fallback（动态代理重试）",
        "explanation": "临时传输失败时取当前系统代理，仅注入本次 Git 命令，不改持久端口配置。"
      }
    ],
    "boundaries": [
      "2.53 MiB/243 文件是本轮源清单，没有 5MB 或 2.5MB 永久限制。",
      "大小比较只保护指定记忆文件的私有仓库副本，不能判断等大/更大正文正确性。",
      "auth.json 与原始会话不在白名单；文件名过滤不等于自动检查所有正文里的秘密。"
    ],
    "failures": [
      {
        "condition": "本地分支落后于远端或与远端产生分叉",
        "response": "脚本打印 Local main is behind/diverged 错误并抛出异常，拒绝执行任何提交与推送。"
      },
      {
        "condition": "当前 raw_memories.md 文件体积缩水",
        "response": "保留原备份中的较大文件，打印告警日志，防止损坏的本地状态污染备份库。"
      }
    ],
    "sources": [
      {
        "path": "tools\\backup-codex-memory.ps1",
        "role": "白名单同步与 Git 严格核验主脚本"
      },
      {
        "path": "tools\\g-hot-snapshot.ps1",
        "role": "G 盘热快照与 current.json 原子指针维护辅助脚本"
      },
      {
        "path": "tools\\test-codex-memory-backup.ps1",
        "role": "白名单准入、黑名单剔除与 Git 边界回归测试"
      }
    ],
    "verification": [
      "9月7日两个版本的备份调用和本地 fixture（合成输入）验证通过：G 快照、ahead-clean、behind、diverged、push-rejected、post-receive-rewind。",
      "9月8日08:16Z的DryRun为243文件、2,656,388字节；没有触发新生产备份。"
    ],
    "searchAliases": [
      "轻量白名单同步",
      "raw_memories反截断",
      "backup-codex-memory.ps1",
      "Git提交前严格核对",
      "私有云端备份"
    ],
    "searchProjection": {
      "intents": [
        "怎样把Codex的自定义Skill和长期记忆备份到私有GitHub",
        "为什么不能直接git add所有的Codex文件",
        "备份时提示raw_memories尺寸变小是怎么回事"
      ],
      "entities": [
        "backup-codex-memory.ps1",
        "g-hot-snapshot.ps1",
        "test-codex-memory-backup.ps1",
        "raw_memories.md",
        "config.toml",
        "chrome-native-hosts-v2.json"
      ],
      "relations": [
        "白名单处理规则、配置、安装技能与记忆，会话走独立本地快照",
        "ProtectHistory只用于仓库副本，G当前快照与私有历史分别保留"
      ],
      "failureRecovery": [
        "出现Git分叉时fail-closed人工核对",
        "记忆文件异常缩水时保持历史备份不动"
      ]
    }
  },
  {
    "slug": "vss-conversation-hot-backup",
    "shortTitle": "VSS会话热备",
    "title": "运行期会话快照与 G 热备",
    "subtitle": "从登记 E 卷的 VSS 副本捕获会话及状态",
    "teaser": "继续使用 Codex，也能形成明确时间的会话备份点",
    "order": 2,
    "status": "G/H最新点为6898文件/72.06GiB；本轮读取自然任务回执与元数据，没有重抓生产VSS",
    "statusTone": "accent",
    "relation": "负责原始对话、附件、生成图像和应用状态，与轻量配置备份分开。",
    "value": "不强制关闭 Codex，从同一卷影副本采集会话数据，并把已校验文件组成一个可恢复点。",
    "why": "活动目录中的数据库、WAL、索引会同时变化，直接逐个复制可能时点不齐，也可能遇到共享冲突。VSS 提供时间点视图，但仍须标明崩溃一致性。",
    "example": "我继续写代码，已有夜间任务从 E 卷创建 VSS 副本，把新增或变化文件写入 G 对象池。只有点和对象校验通过，current 才指向新点；快照之后新增的对话要等下一次。",
    "result": "得到一个带创建时间、文件清单与哈希的会话点；它恢复到该点，不保证故障前最后一刻，更没有零卡顿保证。",
    "problem": "减少活动数据复制时点不一致和文件占用导致的失败，并保留可检查的失败结果。",
    "readerStates": {
      "pass": "VSS 创建、对象写入与回读完成后，发布点和 current 指针。",
      "problem": "Hot 未提供 -Execute 或缺管理员身份时明确拒绝，不会自动换成 Inspect。",
      "unavailable": "登记 G 卷缺席、未解锁或不符合登记/完整加密条件时停止热备。"
    },
    "decisionImpact": [
      "捕获语义明确为 vss_crash_consistent，不能升级为数据库事务和应用全部正常。",
      "覆盖 sessions、archived_sessions、thread backups、attachments、dictation、状态数据库、会话索引、生成图像/visualizations 与自动化状态。",
      "排除诊断日志库、临时缓存、插件、worktrees 和 auth，不为日志体积增大扩大备份范围。",
      "G 是登记、已解锁的完整 BitLocker 加密卷；文件写入是否成功另做哈希回读。"
    ],
    "implementation": [
      "VssProbe -Execute 只探测登记 E 卷快照创建及释放；Hot -Execute 才捕获会话。",
      "以 8MB 缓冲区处理文件，VSS 身份回读绑定登记的物理卷。",
      "Write-AtomicBytes 写穿/回读元数据，所有引用对象通过验证才发布指针。",
      "进度写入 LocalApplicationData/CodexConversationBackup 和 G；输出阶段、字节数、文件数、速度与 ETA，不输出正文。"
    ],
    "flow": [
      "管理员执行 -Mode Hot -Execute 并检查登记 G 介质。",
      "在 E:\\Data\\AppData\\Codex 所在卷创建并核验 VSS。",
      "枚举快照会话/附件/状态白名单，计算文件内容哈希。",
      "写入新增对象、manifest 与 closure，完整回读引用对象。",
      "发布 current 后释放此次 VSS；失败不提前把新点设为完成。"
    ],
    "concepts": [
      {
        "term": "VSS Crash-Consistent Snapshot（卷影崩溃一致性快照）",
        "explanation": "时间点磁盘视图，不是应用一致性承诺；恢复后的数据库和应用仍需验证。"
      },
      {
        "term": "Hot backup（运行期热备）",
        "explanation": "应用保持运行时采集副本；会消耗 I/O 和空间，不等于前台性能完全不受影响。"
      }
    ],
    "boundaries": [
      "需要管理员及 -Execute；不能由普通 Inspect 结果推出已经新建了快照。",
      "排除 auth、cache、plugins、worktrees、链接和诊断日志数据库；纳入的会话/数据库之外不声称全盘备份。"
    ],
    "failures": [
      {
        "condition": "缺少执行参数或管理员身份",
        "response": "返回 execute_required 或管理员要求，停止相应动作。"
      },
      {
        "condition": "G 介质状态不符合要求",
        "response": "停止当前热备，保留已有恢复点；由介质所有者恢复条件后再重试。"
      }
    ],
    "sources": [
      {
        "path": "tools\\Invoke-CodexConversationBackup.ps1",
        "role": "VSS 卷影抓取与全量会话灾备核心实现"
      },
      {
        "path": "tools\\codex_conversation_hot_hidden.vbs",
        "role": "用于任务计划程序的静默无窗启动包装器"
      },
      {
        "path": "tools\\test-codex-conversation-backup.ps1",
        "role": "合成点去重、校验和隔离恢复测试；不测试生产 VSS 性能"
      }
    ],
    "verification": [
      "9月8日G/H点manifest为6898文件、77376044970字节；08:11Z活动源Inspect为6923文件、77555687374字节，两者分别标注。",
      "9月7日三个人工点验证去重和文件恢复，本次任务规格回读 matches_spec=true；不把这些当作本轮生产 VSS 或应用恢复证据。"
    ],
    "searchAliases": [
      "VSS热快照",
      "vss_crash_consistent",
      "70GB对话备份",
      "G盘会话热备",
      "运行期免退出备份"
    ],
    "searchProjection": {
      "intents": [
        "Codex正在使用时怎样备份历史会话",
        "为什么复制Codex会话数据库会提示文件被占用",
        "排查VSS卷影会话备份任务是否成功执行"
      ],
      "entities": [
        "Invoke-CodexConversationBackup.ps1",
        "codex_conversation_hot_hidden.vbs",
        "thread_history_1.sqlite",
        "sessions",
        "vss_crash_consistent"
      ],
      "relations": [
        "VSS提供同一时间点的会话文件视图",
        "原始会话对象只存本地登记G/H路径而不推送GitHub"
      ],
      "failureRecovery": [
        "非管理员权限运行时安全拒绝并提示提权",
        "G盘未解锁时安全等待杜绝脏写入"
      ]
    }
  },
  {
    "slug": "content-addressed-storage-cold-sync",
    "shortTitle": "CAS去重与冷备",
    "title": "内容去重、点校验与 H 冷备",
    "subtitle": "按完整文件内容复用对象，各介质分别校验",
    "teaser": "相同对象复用；H 没连接就明确冷备未完成",
    "order": 3,
    "status": "9月7日合成点去重/恢复通过；9月8日G/H最新点相同，H正式完成回执已读回",
    "statusTone": "accent",
    "relation": "负责 G/H 会话数据的存储与核验，跨盘复制由已有 PCConfig 冷任务执行。",
    "value": "相同内容只存一份，每个历史点保留自己的文件清单；H 在可用时独立校验，避免复制了指针却没有完整对象。",
    "why": "重复保存未变化的大文件会浪费空间。文件内容寻址能复用相同对象，但数据库一旦变化会产生新对象，容量仍增长。",
    "example": "两次快照引用同一张附件图片时复用同一对象。H 未连接时冷任务按设计跳过；连接后等现有调度或明确执行同步，先复制 cold-payload，再验证 H 闭包并发布 H 指针。",
    "result": "得到能核对文件和历史点的会话对象池，以及在 H 真实校验完成后才成立的冷副本。",
    "problem": "减少重复文件占用，避免不完整对象集被当成可用备份点。",
    "readerStates": {
      "pass": "点闭包及每个引用对象校验通过；H 完成独立校验后才算该介质完成。",
      "problem": "H 缺席时保持冷备未完成，不影响已存在的 G 点。",
      "unavailable": "点/对象缺失或哈希不符，停止该点验证或恢复并报告错误。"
    },
    "decisionImpact": [
      "去重粒度是完整文件；相同字节复用，变化后的大数据库会占新空间。",
      "点清单发布后不由正常备份就地修改，哈希用于检出差异，不是对所有损坏的免疫保证。",
      "会话对象/点没有自动 GC；轻量快照的 30 份保留是另一条策略。",
      "H 不可用时跳过；连接介质本身不会新增即时触发器。"
    ],
    "implementation": [
      "Get-ObjectPath 使用 SHA-256 哈希前两位分目录，其余哈希定位对象。",
      "Test-CodexConversationPoint 核对 schema、清单/闭包哈希、计数/字节和每个独有对象。",
      "Validate 范围是选定点引用的对象，不是全盘检查；它写本地进度但不修改对象。",
      "FinalizeCold 在 H 独立哈希全部引用对象，通过后才写 H current.json 与 cold-last.json。"
    ],
    "flow": [
      "按完整文件内容算 SHA-256。",
      "同哈希对象存在且有效则复用，否则写入新对象并回读。",
      "生成该点的 manifest/closure，引用对象完整才更新 G current。",
      "现有 PCConfig 冷任务在 H 可用时增量复制 cold-payload，不直接复制 G 指针。",
      "H 点校验通过后发布 H 指针；中途失败保持未完成状态。"
    ],
    "concepts": [
      {
        "term": "Content-Addressed Storage（内容寻址存储）",
        "explanation": "一种数据存储模式，文件的存储路径直接由其内容的哈希值决定，内容变则路径变，内容同则天然去重。"
      },
      {
        "term": "Bit Rot Defense（静默位翻转防御）",
        "explanation": "长期冷备介质可能因磁性或电荷衰减导致个别位翻转，通过强制性的 SHA-256 闭包校验和可以在恢复前及时发现数据损坏。"
      }
    ],
    "boundaries": [
      "会话对象只增会持续占空间，容量是现实边界。",
      "H 写入阶段允许存在尚未完成的复制，只有全部校验完成才把指针设为可用；不是“任何半成品都不会写盘”。"
    ],
    "failures": [
      {
        "condition": "H 不可用",
        "response": "既有冷任务记录 H_unavailable 并跳过；本轮只读检查不能代替该任务的执行回执。"
      },
      {
        "condition": "点或对象哈希不符",
        "response": "Test-CodexConversationPoint 返回 point_closure_invalid、current_pointer_closure_mismatch 或 content_object_invalid 等相应错误；不发布成功指针。"
      }
    ],
    "sources": [
      {
        "path": "tools\\Invoke-CodexConversationBackup.ps1",
        "role": "CAS 对象写入、闭包校验与 FinalizeCold 逻辑"
      },
      {
        "path": "CONVERSATION_BACKUP.md",
        "role": "对话冷热备架构、CAS 拓扑与存储规范说明"
      },
      {
        "path": "tools\\test-codex-conversation-backup.ps1",
        "role": "对象去重、清单原子切换与校验测试"
      }
    ],
    "verification": [
      "9月7日三个人工点的dedup_verified与restore_verified均为true，代码输入未变化。",
      "本轮读取G/H相同点、清单/闭包哈希与06:44Z正式cold完成回执；没有重新哈希全部生产对象，也没有另外执行冷同步。"
    ],
    "searchAliases": [
      "内容寻址存储",
      "CAS会话去重",
      "不可变闭包清单",
      "H盘冷备管道",
      "纯增量零GC"
    ],
    "searchProjection": {
      "intents": [
        "几十G的Codex会话记录怎么去重存放防止爆盘",
        "为什么H盘冷备任务提示H_unavailable是正常的",
        "怎样校验备份会话的SHA-256哈希是否完好"
      ],
      "entities": [
        "cold-payload\\objects\\sha256",
        "current.json",
        "manifest.json",
        "closure.json",
        "AIRecoveryColdSync-Daily"
      ],
      "relations": [
        "CAS复用字节相同的文件对象，变化后的大文件仍占新空间",
        "H离线是冷备未完成，介质可用后由现有调度同步"
      ],
      "failureRecovery": [
        "H盘脱机时自动跳过保持静默",
        "哈希不符时抛出异常阻断指针推进"
      ]
    }
  },
  {
    "slug": "isolated-disaster-recovery",
    "shortTitle": "隔离恢复与调度",
    "title": "先恢复到空目录，再验证应用可用",
    "subtitle": "点校验、文件还原与当前环境分别处理",
    "teaser": "保留现在的 Codex，先检查历史文件副本",
    "order": 4,
    "status": "合成点隔离文件恢复与任务规格验证通过；未做新机器应用验收",
    "statusTone": "accent",
    "relation": "把选定会话点重建为可检查的文件副本，不自动切换或启动恢复后的 Codex。",
    "value": "找回历史对话时，先还原到空目录，保留正在使用的 Codex。要恢复配置、记忆和技能，则使用单独的小文件复制说明放回运行根；两条恢复路径有不同输入和写入范围。",
    "why": "直接恢复到正在变化的应用目录，会覆盖新文件或混合版本。先还原副本能保留现场并明确恢复结果。",
    "example": "我指定 -PointId latest 和一个专用空目录，执行 -Mode Restore -Execute。工具先验证完整点，随后按原路径还原并回读文件；耗时受对象数量、体积和磁盘速度影响。",
    "result": "会话 Restore 返回明确点位的目录树与恢复回执，不覆盖活动 CODEX_HOME。轻量恢复则按文档将 config.toml、memories 和 skills 等选定小文件放回运行根。两者都需要进一步确认应用能否使用；合成会话恢复为9月7日证据，本次只重读状态。",
    "problem": "防止历史文件直接覆盖当前运行根，防止与备份池/状态目录混写。",
    "readerStates": {
      "pass": "选定点完整核验，目标文件还原与回读完成，返回恢复回执。",
      "problem": "目标是活动 CODEX_HOME 或其子目录，返回 live_codex_home_restore_forbidden。",
      "unavailable": "备份点不完整、目标非空/链接或处于受保护备份/状态根内时，停止并说明具体原因。"
    },
    "decisionImpact": [
      "Restore 要求 -Execute 与显式 DestinationRoot。",
      "拒绝当前活动根及子目录、Hot/Cold/State 根及子目录；已有目录须为空且非 reparse point。",
      "先完整核验点，再写目标文件，写后核验；未完成的目标不能算恢复成功。",
      "日常调度仍是原有两任务：轻量 20:05/22:05、会话 21:15，通过 VBS 隐藏启动。"
    ],
    "implementation": [
      "Resolve-PointId 选择指定点或 latest，Test-CodexConversationPoint 校验点与对象。",
      "Invoke-RestorePoint 拒绝受保护目标，验证后重新读取 manifest 防止读入变化。",
      "Copy-ObjectToFile 按清单恢复原始相对路径与内容并校验。",
      "恢复进度写本地 restore-progress.json，采用 codex.conversation-backup.progress.v1。"
    ],
    "flow": [
      "提供点位、空目标和 -Execute。",
      "检查活动根/备份根/状态根边界与目录形态。",
      "验证清单、闭包与全部引用对象。",
      "按相对路径创建文件并回读校验。",
      "返回文件恢复结果；应用启用、登录和服务配置继续独立验证。"
    ],
    "concepts": [
      {
        "term": "DestinationRoot（恢复目标目录）",
        "explanation": "本次还原文件的专用空位置，不能与活动运行根或备份/状态目录混用。"
      },
      {
        "term": "WScript Silent Launcher（WScript 静默启动器）",
        "explanation": "VBS 用窗口样式 0 启动后台 PowerShell，保留既有任务调度，无需另建守护服务。"
      }
    ],
    "boundaries": [
      "会话 Restore 只重建本点纳入的文件；不恢复轻量管道全部配置，不安装程序/注册服务/设置全局变量。",
      "新机器仍需重新登录并验证 Codex 能读恢复内容；本轮没有这项 E2E（端到端）结果。"
    ],
    "failures": [
      {
        "condition": "目标为活动 CODEX_HOME 或子目录",
        "response": "live_codex_home_restore_forbidden，停止恢复。"
      },
      {
        "condition": "目标不为空或是链接",
        "response": "restore_destination_not_empty 或 restore_destination_reparse_forbidden，停止写入。"
      }
    ],
    "sources": [
      {
        "path": "tools\\Invoke-CodexConversationBackup.ps1",
        "role": "隔离恢复模式与安全门禁断言核心实现"
      },
      {
        "path": "tools\\Install-CodexConversationBackupTask.ps1",
        "role": "Windows 计划任务静默注册器"
      },
      {
        "path": "tools\\test-codex-conversation-task.ps1",
        "role": "任务计划调度与权限等级验证测试"
      }
    ],
    "verification": [
      "三个合成点的文件恢复与哈希验证通过；不代表生产对象或新机器应用恢复。",
      "任务 Plan/Inspect 匹配 CodexConversationBackup-Hot-Daily、Highest、每日 21:15，最近返回 0。"
    ],
    "searchAliases": [
      "隔离目录恢复",
      "活动根防覆盖断言",
      "Invoke-CodexConversationBackup",
      "双计划任务调度",
      "无窗静默执行"
    ],
    "searchProjection": {
      "intents": [
        "怎样把备份的历史Codex会话恢复出来查看",
        "为什么Codex恢复脚本拒绝直接恢复到E盘AppData目录",
        "如何配置Codex备份在后台静默运行不弹黑窗"
      ],
      "entities": [
        "Invoke-CodexConversationBackup.ps1",
        "Install-CodexConversationBackupTask.ps1",
        "CodexConversationBackup-Hot-Daily",
        "DestinationRoot",
        "CanonicalCodexHome"
      ],
      "relations": [
        "强制隔离目录恢复避免破坏当前正在运行的Codex工作环境",
        "双任务静默调度实现零打扰无感灾备"
      ],
      "failureRecovery": [
        "目标为活动根时主动阻断保护现场",
        "非空目录拒绝覆盖防止混合污染"
      ]
    }
  }
];

export const project = codexMemoryProject;
export const modules = codexMemoryModules;
