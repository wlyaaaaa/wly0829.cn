import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  "observedAt": "2026-09-24T04:52:42Z",
  "label": "四套备份仍各自恢复；Gemini兼容任务补齐Antigravity桌面与CLI轻量状态，历史介质证据保留日期",
  "boundary": "2026-09-24 只读回读发现桌面会话 G 当前点已到 9 月 24 日（1,983 文件），H 冷盘仍在 9 月 23 日（1,928 文件）；需要较新会话时不能把 H 当作与 G 同点。两份指针及所选清单可读，不等于本轮重新逐对象哈希、实际恢复或新机登录通过。Codex 轻量 PRIVATE Git 只更新配置/记忆白名单载荷，备份机制未因快照提交改变；Gemini/Claude/OpenClaw 旧证据保持原日期，未读取冻结项目业务。",
  "metrics": [
    {
      "label": "AI工具",
      "value": "Codex · Gemini · Claude · OpenClaw"
    },
    {
      "label": "Codex对话G点",
      "value": "G 当前 1,983 文件 · 9.11 GB"
    },
    {
      "label": "轻量调度",
      "value": "3个任务 · 4套备份"
    },
    {
      "label": "恢复边界",
      "value": "文件副本、登录与应用可用分开验"
    }
  ],
  "facts": [
    {
      "label": "四套工具各保存什么",
      "value": "Codex保存小型规则/配置/记忆/技能，另有会话与数据库专线；Gemini保存配置、项目清单与Antigravity可读成果；Claude保存各项目memory目录，私有Git只选Markdown；OpenClaw保存指定配置文件与过滤后的工作区，另有官方状态归档。它们不共用一份数据清单，也不自动互相恢复。"
    },
    {
      "label": "Gemini、Claude与OpenClaw的G快照",
      "value": "9月9日22:08Z读取ai-memory.g-hot-snapshot.v1元数据：Gemini127文件/181,152字节，完成于05:10:06Z；Claude36文件/76,727字节，保存点日期8月21日05:20Z；OpenClaw186文件/2,840,710字节，保存点日期9月1日03:20Z。三份目录文件数与字节总量和manifest一致；没有重新逐字节哈希所有正文。旧点可以因内容相同而复用，不能只凭日期断言任务失败。"
    },
    {
      "label": "三套私有Git引用回读",
      "value": "Gemini=e3413caca7edbcf1ba9cf79d004ed26c080dbcbf，Claude=1fcc03dff6b0d5bbfa7c3a02a570d31308332b8e，OpenClaw=9359383c62008bc59e96d5891496b738c950a7b1；本轮本地工作树干净且远端引用同值。Claude第一次Git读取遇到TLS瞬断，随后GitHub引用接口回读成功。引用一致不等于应用恢复通过，也不证明各层载荷逐字相同。"
    },
    {
      "label": "OpenClaw两条恢复材料",
      "value": "定时backup-openclaw.ps1保存config与workspace；backup-config.ps1则调用官方backup create --no-include-workspace --verify，保存含私人状态的官方归档。9月3日224,287,339字节归档和暂存恢复是历史证据；没有自动激活，也没有把工作区暗算进该归档。"
    },
    {
      "label": "次机安装、自动备份与冷介质",
      "value": "2026-09-12T04:27Z由PCConfig既有Manage-CodexDataBackup.ps1 Status -ReadOnly回读：ready，已安装来源c7e02a79b7922780eeae37a312d159319422c9ac且文件摘要匹配；09:00原定时任务Ready、最近返回0。热与USB冷点同为20260912T010007Z-79c363c0，323文件、407,005,388字节，readback_verified=true、cold_matches_hot=true。本轮读取既有元数据，未重新哈希全部对象。"
    },
    {
      "label": "次机安全云支路",
      "value": "同次Owner回读：安全层31文件、266,762字节；backup/secondary-laptop的远端引用dcff123c91b40ab9f9c6ddc5b2a5eea809325011与本地一致。它只保存安全配置投影、规则参考、记忆与自定义技能；该引用不证明云端含原始会话或全部私人配置。"
    },
    {
      "label": "次机恢复副本已有可读证据",
      "value": "9月10日既存pcconfig.codex-data-restore-test.v1回执为pass，来源点20260910T035042Z-acd75878：验证209个session文件、208条thread记录并重映射208个路径；隔离app-server列出139项，选定任务读到12轮，read_from_isolated_copy=true。未启动新回合、未复制凭据、未输出私人正文，探针与测试副本已清理。本轮只读该旧回执，不升级为登录或新回合续作通过。"
    },
    {
      "label": "源版本与本轮修复",
      "value": "Codex轻量备份来源本地干净main=4934cada2be8b4baa6b395dc14a0e589eaa312f2，远端同值；相对前次正式来源，新提交只更新配置、记忆与清单等白名单载荷，备份脚本及恢复合同未改。桌面两点保留与H随G有效点收敛仍由旧实现承担；本轮未核次机安装，也未重新采集其他三套工具。",
      "hero": true
    },
    {
      "label": "小文件源清单",
      "value": "Codex小文件规模保留2026-09-08T08:16:34Z的DryRun（试运行）观察：243文件、2,656,388字节；当时私有仓库因保留历史而有713文件、5,711,701字节。这是Codex自己的旧观察，不是四套备份总量，也不是固定容量上限。",
      "hero": true
    },
    {
      "label": "G 最新会话点与活动源不同",
      "value": "2026-09-24T04:50Z 只读 G current 与所选 manifest：点 20260924T041509Z-89eabfd3，1,983 文件、9,112,477,677 字节，指针于 04:16:22Z 发布，标注 VSS 崩溃一致性。独立源 Inspect 同时见活动源 1,989 文件、9,129,573,276 字节；活动源比恢复点多不等于捕获缺陷，两者时刻与集合不同。本轮未重哈希全部对象或恢复。9 月 18 日旧同点回读仅作历史。",
      "hero": true
    },
    {
      "label": "两条备份管道各自保留历史",
      "value": "桌面轻量备份先写当前本地/G快照并核验，再同步私有GitHub；仅桌面仓库复制启用ProtectHistory，保留指定较大raw_memories、已有rollout_summaries与backup-only历史。次机profile保存精确当前选中版本及删除，默认保留2份安全快照；云失败不抹掉已校验的新本地结果，也不推进云成功回执。",
      "hero": true
    },
    {
      "label": "运行中的会话从 E 卷快照读取",
      "value": "Invoke-CodexConversationBackup.ps1 在 E:\\Data\\AppData\\Codex 所在卷创建 VSS（卷影复制服务）时间点副本，捕获标注 vss_crash_consistent（崩溃一致性）。它减少活动文件复制时间错位，不承诺应用层事务已全部提交、零 I/O 开销或恢复到故障前最后一秒。",
      "hero": true
    },
    {
      "label": "去重、校验与保留期限",
      "value": "会话文件按 SHA-256（安全哈希算法 256 位）存入 CAS（内容寻址存储）对象池，单个对象按内容复用；每个点有 manifest、closure，引用对象校验通过才切换 current.json。桌面无 profile（设备配置档）Hot（热备）现在固定保留当前及前一完整点，先验证两点再清过期点与无引用对象；轻量本地与 G 快照的 30 份策略没有被本次会话改动替换。副驾驶配置档继续使用独立保留入口。内容相同的 G 快照仍复用，设备与备份类型各按自己的保留策略。",
      "hero": true
    },
    {
      "label": "实际任务状态",
      "value": "9月9日22:07Z只读回读：Codex Memory Backup最近05:05:02Z、Gemini Memory Backup最近05:10:01Z、共享OpenClaw Memory Backup最近05:20:01Z，均Ready/enabled/0；三个轻量任务实际承载四套备份，共享任务先Claude后OpenClaw，两段都会尝试并传播首个非零。Codex会话另有21:15日任务，最近04:15Z结果0；PCConfig冷备另行负责。调度时刻按America/Los_Angeles，运行结果时间按UTC。",
      "hero": true
    },
    {
      "label": "H 冷盘与数据边界",
      "value": "2026-09-24T04:50Z 只读 H current 与所选 manifest：仍为 20260923T041507Z-44b79c2e，1,928 文件、8,772,433,265 字节，H 指针于 9 月 23 日 06:49:40Z 发布并标注 cold_readback_verified=true。冷盘当前比 G 少一个捕获点；旧 H 点的回读不证明 9 月 24 日 G 点已复制到 H，本轮未同步介质或实做恢复。",
      "hero": true
    }
  ],
  "gaps": [
    "Codex桌面 G 当前为 9 月 24 日恢复点，H 冷盘当前为 9 月 23 日恢复点；选较新会话应先核实际介质和点。网页只读指针、选中清单与已有回执，不重新读取全部对象；任一点都不证明新机登录、应用续作或四套工具共享完整历史。",
    "本轮只读脚本、任务与小元数据；Codex9月7日合成去重/隔离恢复、OpenClaw既有脚本与官方归档/暂存证据保留原日期。没有重新执行生产VSS、完整对象重验、四套工具的新机恢复或登录。",
    "raw_memories 大小保护仅避免较小当前文件覆盖私有仓库的大版本；同等或更大的错误正文仍需人判断，轻量 G 快照保存的是当次源内容。",
    "桌面会话已实现并实际完成两点保留与无引用对象清理；H只保留G有效点引用的集合。大型数据库仍会产生变化对象，有界历史不等于无限历史或零增长。",
    "会话 Restore 先生成文件副本；轻量恢复按文档把配置、记忆和技能放回运行根。两者都不自动注册服务、设置全局环境或恢复登录，新机器是否可用仍需应用层验证。",
    "Gemini与Claude当前没有专用自动还原器，按选定版本及原相对路径恢复文件后，仍要重新核对应用、项目路径与登录；Claude云副本仅Markdown，不能用它代替本地/G中memory目录的全部文件。",
    "Gemini与Claude在云同步阶段会再读当前来源，且Claude的云选择范围更窄；不能把G的SHA-256回读扩成三层同一时刻同一字节。OpenClaw云复制才明确使用已完成的本地/G快照。",
    "OpenClaw官方归档不含工作区；定时文件选择也不是原生状态目录全量镜像。归档校验、暂存恢复、离线激活与真实消息恢复各自验收。"
  ]
});

export const codexMemorySnapshot = Object.freeze({
  ...baseSnapshot,
  ...{
  "generation": "四套AI工作区的分层备份与恢复",
  "sourceCommit": "4934cada2be8b4baa6b395dc14a0e589eaa312f2",
  "sourceRoot": "E:\\Projects\\Backups\\codex-memory",
  "physicalCodexHome": "E:\\Data\\AppData\\Codex",
  "hotRoot": "G:\\80_Backup\\ControlPlane\\AIMemory\\Codex",
  "conversationHotRoot": "G:\\80_Backup\\ControlPlane\\AIMemory\\CodexConversations",
  "conversationColdRoot": "H:\\80_自动备份区\\ControlPlane\\AIMemory\\CodexConversations\\cold-payload",
  "currentPointId": "20260924T041509Z-89eabfd3",
  "conversationFileCount": 1983,
  "conversationTotalSizeBytes": 9112477677,
  "liveSourceFileCount": 1771,
  "liveSourceTotalSizeBytes": 7840035917,
  "memoryFileCount": 243,
  "memoryTotalSizeBytes": 2656388,
  "scheduledTasks": [
    {
      "taskName": "Codex Memory Backup",
      "trigger": "每日 20:05 与 22:05",
      "launcher": "tools/codex_memory_backup_hidden.vbs",
      "script": "tools/backup-codex-memory.ps1",
      "runLevel": "Limited（普通权限）",
      "lastRunUtc": "2026-09-09T05:05:02Z",
      "lastResult": 0
    },
    {
      "taskName": "CodexConversationBackup-Hot-Daily",
      "trigger": "每日 21:15",
      "launcher": "tools/codex_conversation_hot_hidden.vbs",
      "script": "tools/Invoke-CodexConversationBackup.ps1 -Mode Hot -Execute -Json",
      "runLevel": "Highest（最高权限）",
      "lastRunUtc": "2026-09-09T04:15:02Z",
      "lastResult": 0
    },
    {
      "taskName": "AIRecoveryColdSync-Daily",
      "owner": "PCConfig",
      "trigger": "既有冷备调度",
      "mode": "完整复制并校验G有效点；FinalizeCold发布H指针后清理H独有旧点与无引用对象",
      "currentHAvailable": true,
      "lastRunResult": "9月14日只读原生G/H元数据确认同点20260913T112054Z-1d51dc2b、7279文件；H于9月13日23:57:45Z完成source_follow_valid_points，保留2点。未重读任务定义或重新执行冷备。"
    },
    {
      "taskName": "Gemini Memory Backup",
      "owner": "OpenClawGateway",
      "trigger": "每日20:10、22:10",
      "launcher": "tools/gemini_memory_backup_hidden.vbs",
      "script": "tools/backup-gemini-memory.ps1",
      "lastRunUtc": "2026-09-09T05:10:01Z",
      "lastResult": 0
    },
    {
      "taskName": "OpenClaw Memory Backup",
      "owner": "OpenClawGateway",
      "trigger": "每日20:20、22:20",
      "launcher": "tools/memory_backup_hidden.vbs",
      "script": "先backup-memory.ps1，后backup-openclaw.ps1；传播首个非零",
      "lastRunUtc": "2026-09-09T05:20:01Z",
      "lastResult": 0
    }
  ],
  "sourceComponents": [
    {
      "role": "Codex小型状态与完整会话",
      "root": "E:\\Projects\\Backups\\codex-memory",
      "codeObservation": "PRIVATE main=4934cada 已远端回读且本地同值；新提交是白名单配置与记忆载荷快照，没有改会话备份引擎。桌面两点保留、H随G有效点收敛及离线冷盘配置解析属于较早实现；来源发布、次机安装字节与真实恢复分别留证"
    },
    {
      "role": "Gemini、Claude、OpenClaw定时备份及OpenClaw官方恢复",
      "root": "E:\\Projects\\Tools\\OpenClawGateway",
      "commit": "aa4f9f1390c68605b5d8135f4077967bf86e0708"
    }
  ]
},
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const codexMemoryProject = {
  usageEntry: "在已接入 AI 工作区备份项目的本机 AI 对话中点名 Codex、Gemini、Claude 或 OpenClaw，并说明要检查备份还是恢复哪类材料；正式恢复先到空目录核对。",
  usageInputs: ["具体应用与目标机器", "要找的配置、项目记忆或会话", "本地、G、H 或私有 Git 中可用的版本"],
  ...codexMemorySnapshot,
  ...{
  "order": 21,
  "slug": "codex-memory",
  "title": "AI 工作区备份与恢复",
  "kicker": "Codex、Gemini、Claude与OpenClaw的配置、记忆、工作区与分层恢复",
  "route": "/projects/codex-memory",
  "visibility": "私有仓库",
  "statusTone": "warn",
  "cardStatus": "四套分别备份 · Codex G 比 H 冷盘新一个点 · 应用恢复独立验收",
  "cardStatusTone": "warn",
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
    "会话与配置分离",
    "AI工作区备份与恢复",
    "AI配置备份",
    "Gemini Memory Backup",
    "Claude项目记忆恢复",
    "OpenClaw工作区恢复"
  ],
  "searchProjection": {
    "intents": [
      "Codex重装电脑后怎么快速恢复配置记忆和历史对话",
      "为什么不能用Git直接备份70G的Codex目录",
      "raw_memories文件被意外写小怎么防止记忆丢失",
      "Codex运行时数据库被占用怎么无损备份对话",
      "排查Codex对话备份计划任务运行状态与空间占用",
      "重装后恢复四套AI工作环境",
      "恢复Gemini配置和工作成果",
      "找回Claude项目memory",
      "恢复OpenClaw配置工作区和官方归档"
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
      "cold-payload\\objects\\sha256",
      "Gemini",
      "Antigravity",
      "Claude",
      "OpenClaw",
      "backup-gemini-memory.ps1",
      "backup-memory.ps1",
      "backup-openclaw.ps1"
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
  "repositoryNote": "这是四套现有备份的统一使用说明，保留codex-memory的既有网址。Codex源由独立PRIVATE仓库维护；Gemini、Claude和OpenClaw的现役备份脚本来自PUBLIC OpenClawGateway，它们的载荷仍进入各自私有目标。页面不复制真实记忆、会话、账号、令牌或备份正文；组合展示不迁移或合并源仓库。",
  "summary": "我在Codex、Gemini、Claude和OpenClaw里积累的设置、项目记忆和工作成果，各有一条适合它的备份与恢复路线。Codex的小文件进入私有Git历史，原始对话、附件与数据库另走G/H会话快照；Gemini兼容备份任务保存配置和Antigravity桌面／CLI的轻量可读成果，不启动已退役的Gemini模型命令，Claude保存项目记忆，OpenClaw保存配置、工作区及独立官方归档。重装、配置改坏或要找回旧工作时，先选对材料和版本，再按那套工具的恢复方式取回。四套范围不同，不承诺全部聊天、登录和运行状态都能一键回来；原来的仓库、任务和数据保持独立。",
  "why": "不同AI工具把重要材料放在不同位置。只备份安装包会漏掉记忆和工作成果，整目录无差别复制又会混进缓存、登录与活动数据库。这里把实际保存范围、每层结果和恢复顺序放在一起解释，让我知道手上的副本能恢复什么，哪一部分还需官方登录、重装依赖或应用验证。",
  "plainExample": "我要换电脑，先把AI工作环境里重要的东西找回来。先恢复Codex配置和技能、Gemini项目清单与可读成果、Claude各项目记忆；OpenClaw配置和工作区按原来源分别回填，官方归档先恢复到新暂存目录。需要旧Codex对话时，再把选定会话点还原到空目录。最终逐个确认应用能加载、路径正确、登录有效和工作可继续，不用“文件已复制”代替全部恢复。",
  "result": "得到按工具与时间区分的小型状态版本、G快照、Codex完整会话恢复点，以及OpenClaw官方归档和可检查的暂存副本。每套都说明本地、G、私有Git或H实际完成到哪里，恢复哪些文件、哪些需重新登录或重装，避免拿错版本和混合覆盖现有工作。",
  "readerStates": {
    "pass": "选中的设置、记忆或会话在相应副本中核对完整后，说明本机、G 盘、私有云或 H 盘分别到哪一步；恢复后还要看应用能不能真正使用。",
    "problem": "云端失败或冷盘落后时，已经验过的本机副本仍保留；任务显示成功、文件存在或旧日期都不能单独证明新机应用可用。",
    "unavailable": "某个应用来源、私有备份位置或完整恢复点缺失时，只停这一套恢复；不把另一款 AI 工具的副本混过来，也不覆盖正在使用的目录。"
  },
  "productPrinciples": [
    {
      "title": "每款 AI 工具按真实范围找回",
      "detail": "Codex 会话有专门的大文件恢复点；Gemini 和 Claude 主要保留可读项目资料；OpenClaw 的日常工作区与官方状态归档互补。缺失的登录或旧聊天不会被其他备份名称补出来。"
    },
    {
      "title": "小设置和大对话分开保存",
      "detail": "配置、技能和项目笔记适合版本对比；正在变化的会话与数据库用独立本地恢复点。副机使用自己的备份位置，云端只保存明确选出的安全文本，不能代替完整私有配置。"
    },
    {
      "title": "历史版本留得住，当前删除也算数",
      "detail": "需要保留的旧记忆可从历史找回；但最新备份要反映真实当前文件，不把本人已删的内容又并进来。旧版更大也不代表内容更正确。"
    },
    {
      "title": "笔记本不用台式机的备份路径",
      "detail": "两台电脑各自确认来源磁盘、热副本、冷介质和云端位置；身份或目录重叠时停下，不能照抄另一台机器的盘符。"
    },
    {
      "title": "保留最近点，清理前先验完整",
      "detail": "当前和前一恢复点先证明确实完整，再收起更旧且无人在用的文件；清理与新备份不能互相抢写。"
    },
    {
      "title": "备份对话时不强制退出 Codex",
      "detail": "从同一时间点的文件副本读取已选会话，可在工作期间运行；仍会占用磁盘，也不能承诺故障前最后一秒或应用内部事务完全一致。"
    },
    {
      "title": "先在空目录验副本，再决定启用",
      "detail": "选定恢复点先核对，再复制到独立空目录。能读旧对话、恢复配置、完成登录和启动新任务是不同结果，逐项回读。"
    },
    {
      "title": "H 盘没接上就说冷备还没完成",
      "detail": "冷盘不可用时保留 G 盘已有结果；接上磁盘后仍要等原任务或明确同步，再核对 H 盘自己的恢复点。"
    },
    {
      "title": "成功要说清是哪一层",
      "detail": "本地复制、G 盘文件、私有云提交、H 盘副本和应用实际恢复各有自己的时间与结果；同样内容沿用旧点可以合理，但一条绿色任务结果不能代替全部。"
    }
  ],
  "responsibilities": [
    "按明确清单保存 Codex 设置、技能和记忆，并核对本地、G 盘及私有仓库各自结果。",
    "另存完整 Codex 会话、附件和选定状态，避免与小型设置备份混在一起。",
    "让会话恢复点可逐文件验证；H 盘可用时由既有冷备任务复制并独立核对。",
    "恢复会话先写到新的空目录，保留当前正在使用的 Codex。",
    "使用已有自动备份任务，不再为每款 AI 工具造一套常驻服务。",
    "分别保存 Gemini 可读项目成果、Claude 项目记忆、OpenClaw 设置和工作区，并写清各自不包含什么。"
  ],
  "exclusions": [
    "轻量设置备份不包含登录凭据、完整原始会话和大型运行缓存。",
    "完整会话备份也只覆盖明确选中的文件，不是整个应用目录的无差别复制。",
    "把文件还原到空目录不会直接替换当前程序或恢复官方登录。",
    "这次网页只说明已有状态，不触发新的大量备份或实际恢复。",
    "Gemini 不保原始聊天与媒体；Claude 云端只保项目文字记忆，不是完整应用。",
    "OpenClaw 日常设置副本与官方状态归档范围不同，恢复后还要另验网关和消息。",
    "另一套独立密码库和最高权限恢复材料不混进 AI 工作区备份。"
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
      "effect": "已登记的备份任务从同一时间点读取选中会话，核对完整后才更新 G 盘恢复点；不用为了备份退出当前工作。"
    },
    {
      "moduleSlug": "content-addressed-storage-cold-sync",
      "ask": "很多备份都有相同附件，能不能少存几份？",
      "effect": "相同附件只保留一份内容，变化的文件仍另存；H 盘副本另等实际连接、复制和核对。"
    },
    {
      "moduleSlug": "isolated-disaster-recovery",
      "ask": "把上周的会话恢复出来，先不要动现在的 Codex。",
      "effect": "指定点位和专用空目录，核验后重建原目录和文件名。先检查这份副本，再判断是否需要应用层恢复。"
    },
    {
      "moduleSlug": "gemini-workspace-memory",
      "ask": "把 Gemini 和 Antigravity 里保存的项目说明、笔记与设置找回来。",
      "effect": "从选定的本地或私有云版本恢复可读文件，核对项目位置和应用能否加载；旧聊天和登录不在这份备份里。"
    },
    {
      "moduleSlug": "claude-project-memory",
      "ask": "把这个 Claude 项目以前保存的长期记忆找回来。",
      "effect": "先选正确项目和版本，保留新机现有文件后回填；若要非文字附件须查本地或 G 盘，云端文字笔记不代表完整聊天。"
    },
    {
      "moduleSlug": "openclaw-workspace-recovery",
      "ask": "OpenClaw 设置改坏了，先找一份能检查的恢复材料。",
      "effect": "日常设置副本与官方状态归档分别找；先恢复到新的空目录，核对版本、登录和工作区，再决定是否让现有网关切换。"
    }
  ],
  "operatingFlow": [
    {
      "title": "查清选中应用实际保存了什么",
      "detail": "系统列出这次能找回的配置、项目记忆或会话，以及哪类登录和原始聊天不在备份里。"
    },
    {
      "title": "选一个可验证版本",
      "detail": "先看时间、清单、对象完整性及所在介质，网络失败与本地成功分别记录。"
    },
    {
      "title": "恢复到隔离位置",
      "detail": "先验包或点，再还原到空目录并保留目标现有内容。"
    },
    {
      "title": "回到真实应用验收",
      "detail": "核对路径、官方登录、应用加载及真实旧任务或消息；文件恢复成功只完成其中一层。"
    }
  ],
  technicalOperatingFlow: [
    {
      "title": "先认工具、材料与恢复目标",
      "detail": "确定是Codex配置/会话、Gemini可读工作成果、Claude项目记忆，还是OpenClaw配置/工作区/官方状态。读取各自来源配置和选定版本，不用统一整目录镜像。"
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
    },
    {
      "title": "按各自方式回填并验应用",
      "detail": "Codex会话与OpenClaw官方归档先恢复独立副本；其余小文件按原相对路径选择性回填。先保留当前文件，再核对项目路径、依赖、官方登录、配置加载和一次真实工作结果。"
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
      "implementation": "Publish-GHotSnapshot计算清单与SHA-256，复用相同快照并更新ai-memory.g-hot-current.v1指针；桌面保留30份，次机配置档保留当前及前一份。先完成并核对本地热快照，再尝试云端同步。"
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
    },
    {
      "name": "OpenClawGateway/tools/private-backup-settings.ps1",
      "responsibility": "读取三套现役消费者的本机路径配置",
      "implementation": "openclaw_gateway.private_backup_settings.v1；gemini_memory与claude_memory各5个键，openclaw有6个键，共16个必填路径键。OPENCLAW_PRIVATE_BACKUP_SETTINGS可覆盖本机配置位置，缺键或路径形态不成立就失败，不输出实际私有值。"
    },
    {
      "name": "OpenClawGateway/tools/g-hot-snapshot.ps1 / git-cloud-sync.ps1",
      "responsibility": "三套轻量消费者的G内容回读与私有Git同步",
      "implementation": "G保存ai-memory.g-hot-snapshot.v1，逐文件长度/SHA-256核对，相同内容复用，最多30份。Git先检查main是否落后或分叉，正常push后ls-remote回读；网络/TLS错误按30/120/300/900秒有限退避，认证或状态错误不按网络重试。它与Codex独立实现同类目标，不宣称两份脚本完全相同。"
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
      "boundary": "point_id、closure_sha256、published_utc、capture_semantics；9月12日05:41Z G/H均指向20260912T041508Z-8cec9794，两盘实际闭包SHA-256同为5c91d9e48222258aae5fd54d8adcdf4f37ad697fc63d21ef2710f57bb1fc7acc，清单哈希也逐盘匹配。"
    },
    {
      "artifact": "校验、恢复和运行进度",
      "schema": "codex.conversation-backup.validation.v1 / codex.conversation-backup.receipt.v1 / codex.conversation-backup.progress.v1",
      "owner": "Invoke-CodexConversationBackup.ps1",
      "boundary": "Validate读取并哈希指定Hot或Cold点；加-ReadOnly不写进度且无需提权。Restore需要-Execute与显式空目录，拒绝活动根、备份/状态根及其子目录和reparse point（重解析点）；旧主机身份不是只读核验和隔离恢复的前提。"
    },
    {
      "artifact": "H 冷备",
      "schema": "cold-payload + H current.json + cold-last.json",
      "owner": "PCConfig AIRecoveryColdSync-Daily / 本项目 FinalizeCold",
      "boundary": "已有冷任务负责增量复制；H 上闭包与对象校验通过才发布 H 指针，不直接复制 G 指针。H 不可用不等于最新冷备完成。"
    },
    {
      "artifact": "Codex次机主机配置档",
      "schema": "codex.memory-backup.profile.v1 / codex.conversation-backup.profile.v1",
      "owner": "backup-codex-memory.ps1 / Invoke-CodexConversationBackup.ps1；机器绑定由PCConfig管理",
      "boundary": "显式-ConfigPath绑定主机、用户、物理Codex根、独立hot/cold/state路径与卷唯一ID。轻量云支路必须为backup/<profile_id>并保持纯数据；会话profile不能同时覆盖CodexHome/HotRoot/ColdRoot/StateRoot/PCConfigManifestPath。"
    },
    {
      "artifact": "次机安全配置与回执",
      "schema": "codex.safe-config-projection.v1 / codex.memory-backup.manifest.v1 / codex.memory-backup.receipt.v1",
      "owner": "project-safe-codex-config.py / backup-codex-memory.ps1",
      "boundary": "Python3.11+标准库解析TOML，只保留已允许字段，未知内容仅列omitted_key_paths；残余疑似秘密使投影失败。清单保留原/备份相对路径、restore_mode、length及sha256；完整成功回执须本地热快照已核验且新读远端引用等于HEAD。"
    },
    {
      "artifact": "次机会话点有界清理",
      "schema": "codex.conversation-backup.receipt.v1；mode=prune",
      "owner": "Invoke-CodexConversationBackup.ps1",
      "boundary": "显式Prune需profile及-Execute，KeepPoints范围2–1000、默认2；桌面Hot在已有互斥锁内自动保留2点，不另选KeepPoints。先核验当前和保留点、标准目录形态与未变指针，再删除过期点及未引用对象；与Hot/SyncCold互斥。回执给删除点/对象数与字节，不重写current指针。"
    },
    {
      "artifact": "Gemini/Claude/OpenClaw路径适配",
      "schema": "openclaw_gateway.private_backup_settings.v1",
      "owner": "OpenClawGateway/tools/private-backup-settings.ps1",
      "boundary": "只定义source_root或config_root/workspace_root、snapshot_root、hot_snapshot_root、cloud_repo、log_file；真实值留在本机，不建立一个新的中央配置源。"
    },
    {
      "artifact": "OpenClaw官方归档与恢复暂存",
      "schema": "openclaw_backup_result.v1 / openclaw_restore_stage_result.v1",
      "owner": "OpenClawGateway/tools/backup-config.ps1 / restore-config.ps1",
      "boundary": "include_workspace=false；创建须官方verified，恢复先verify并且目标尚不存在，activation_performed=false、activation_required=true。"
    }
  ],
  "evidenceLayers": [
    {
      "layer": "现行源码与历史实现证据",
      "proves": "2026-09-24 已回读 Codex PRIVATE main=4934cada2be8b4baa6b395dc14a0e589eaa312f2，本地同值且干净；本次新提交仅更新白名单配置、记忆与清单载荷，未改备份脚本。9 月 12 日次机配置档与 9 月 14 日离线冷盘解析仍是历史实现证据；其他三套脚本保留原观察。",
      "doesNotProve": "源码和文档不证明本轮又执行过生产备份或应用恢复。"
    },
    {
      "layer": "三套源回归",
      "proves": "Codex9月7日G快照、Git分支、3点去重/隔离恢复与任务规格测试保留为历史；本轮未重跑。OpenClaw现有Gemini选择、G回读、Git同步、配置/恢复和共享启动器测试可独立复现。",
      "doesNotProve": "源码与合成恢复不证明四套工具已在新电脑登录、加载并继续工作。"
    },
    {
      "layer": "任务与生产元数据",
      "proves": "9月9日22:07—22:08Z的3个轻量任务及Codex会话任务Ready/enabled/0、四套G元数据及当时H不可用均保留为历史。9月12日05:41Z曾补充当时桌面G/H同点7167文件；2026-09-14新回读原生回执为同点20260913T112054Z-1d51dc2b、7279文件、51104813027字节，Hot/Cold保留均complete；其他三套任务、Git引用及备份观察日期不更新，未读正文。当前指针与清单另见9月24日局部观察；未重验旧任务或全量载荷。",
      "doesNotProve": "未重新哈希全部生产对象，也未检测应用打开恢复内容的结果。"
    },
    {
      "layer": "H原生冷备回执与历史介质观察",
      "proves": "9月14日只读H原生cold-last：9月13日23:57:45Z complete/readback_verified=true、7279文件/51104813027字节，current与G同为20260913T112054Z-1d51dc2b，H有效点保留2份。9月12日05:41Z介质在场与7167文件旧点只证明当时结果；该次同点由各盘原生回执证明，不从PCConfig总回执推断。当前指针与清单另见9月24日局部观察；未重验旧任务或全量载荷。",
      "doesNotProve": "完整对象校验由所属时点原生冷回执报告；网页本轮只回读指针和小元数据，没有重读全部对象，也不证明新机器登录、应用恢复或新回合续作。"
    },
    {
      "layer": "官方归档与应用恢复",
      "proves": "OpenClaw旧官方归档已校验且曾恢复到新暂存目录；Codex旧合成点可隔离还原。",
      "doesNotProve": "未完成本轮OpenClaw离线激活或四套工具的新机应用验收；登录、真实消息和原会话续接不由文件存在推断。"
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
      "purpose": "逐一读取指定点的哈希对象；默认写本地validate-progress.json，加-ReadOnly则不写进度。可用-PayloadStore Cold选择冷副本，不因指针存在就跳过完整核验。"
    },
    {
      "name": "恢复到空目录",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -Mode Restore -PointId latest -DestinationRoot <专用空目录> -Execute -Json",
      "purpose": "核验点后恢复原目录与文件名，再校验结果；不切换活动应用。"
    },
    {
      "name": "次机安全文本备份",
      "command": "pwsh -NoProfile -File .\\tools\\backup-codex-memory.ps1 -ConfigPath <memory-profile.json> -ReceiptPath <receipt.json>",
      "purpose": "使用机器负责人已绑定的配置档，先形成本地已验快照，再更新独立安全云支路；这是实际备份入口，网页刷新不执行。"
    },
    {
      "name": "只读核验指定冷点",
      "command": "pwsh -NoProfile -File .\\tools\\Invoke-CodexConversationBackup.ps1 -ConfigPath <conversation-profile.json> -Mode Validate -PayloadStore Cold -ReadOnly -Json",
      "purpose": "逐对象哈希核对完整冷点，不写进度。恢复时可换为-Mode Restore并指定新的空目录与-Execute；不要求旧主机身份，仍须先识别真实介质路径。"
    },
    {
      "name": "次机冷复制与有界保留",
      "command": "在既有PCConfig入口使用SyncCold；需要明确清理时调用-Mode Prune -PayloadStore Hot|Cold -KeepPoints 2 -Execute并提供同一-ConfigPath",
      "purpose": "SyncCold复制并核验G有效保留点，发布H指针并收敛H独有点/对象，最后才报告完整成功；Prune仅清理过期点和保留点不再引用的对象。两者都是实际写入，由已有机器Owner调度或精确调用，不因网页检查自动执行。"
    },
    {
      "name": "Gemini选择预检",
      "command": "在OpenClawGateway运行pwsh -NoProfile -File tools/backup-gemini-memory.ps1 -DryRun",
      "purpose": "只生成所选清单；本轮未运行该入口或读取清单中的私人文件名。"
    },
    {
      "name": "Gemini、Claude小文件恢复",
      "command": "从选定本地/G快照或私有Git版本按原相对路径复制到对应来源根",
      "purpose": "Gemini回填选定配置和可读成果；Claude按project/memory匹配项目，非Markdown从本地/G取回。保留现有目标后再操作，登录与应用另验。"
    },
    {
      "name": "OpenClaw官方归档",
      "command": "在OpenClawGateway运行pwsh -NoProfile -File tools/backup-config.ps1 -Json",
      "purpose": "真实写私人归档；显式不含工作区，本轮没有执行。"
    },
    {
      "name": "OpenClaw新目录暂存恢复",
      "command": "在OpenClawGateway运行pwsh -NoProfile -File tools/restore-config.ps1 -From <归档> -Target <尚不存在的新目录> -Json",
      "purpose": "官方验证后只恢复暂存副本，不停止网关或自动激活。"
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
      "meaning": "桌面无profile路径仅对私有仓库memories/raw_memories.md实施大小保留；次机配置档保存当前选中版本。这不是所有文件、备份层的通用完整性保证。"
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
  "snapshotUpdateNote": "2026-09-24只读回读：桌面G为9月24日点，H仍为9月23日点，恢复选择应按实际介质和点；当前没有执行冷同步或恢复。桌面bc574f8的Hot自动两点保留、eeb2158的H有效点收敛是较早实现，本轮轻量Git 4934cada仅更新白名单载荷。旧次机、其他三套工具、测试与恢复证据保留原日期；源文档开头的additive/no-GC旧叙述不覆盖已发布实现。",
  "dataSources": {
    "title": "具体保存什么，分别放在哪里",
    "intro": "先选 Codex、Gemini、Claude 或 OpenClaw，以及想找的设置、项目记忆还是对话；各应用只保存其清单列出的材料，登录与应用效果另验。",
    "rows": [
      {
        "source": "Codex 设置、技能和记忆",
        "data": "保存本人选定的程序设置、个人能力和笔记；不把认证凭据与庞大原始对话塞进这份小型备份。",
        "result": "本机、G 盘和私有仓库分别给版本；副机云端只保允许公开到该私有目标的安全文本，完整私有设置仍从本地恢复。"
      },
      {
        "source": "Codex 对话和附件",
        "data": "选择原始会话、附件与相关应用状态，从同一时间点的文件副本读取，不包含登录凭据或整个运行目录。",
        "result": "形成可核对的 G 盘恢复点；H 盘可用时另做冷副本，恢复先去空目录。"
      },
      {
        "source": "每份备份的时间和文件清单",
        "data": "读取文件数量、完整性与任务最近结果，不打开私人会话正文来展示状态。",
        "result": "分别知道源文件、已备份文件和 H 盘当前是否可用。"
      },
      {
        "source": "Gemini 与 Antigravity 项目成果",
        "data": "保存项目清单、设置、笔记与可读成果，排除原始聊天、数据库和媒体。",
        "result": "换机时按项目位置回填并核对应用能否加载，登录另办。"
      },
      {
        "source": "Claude 各项目记忆",
        "data": "本地/G 保存选中项目记忆目录，私有仓库只保文字笔记。",
        "result": "找回项目记忆；若需要其他附件先查本地副本，完整聊天与程序安装不在其中。"
      },
      {
        "source": "OpenClaw 设置、工作区与官方归档",
        "data": "日常保存点名设置和工作区；官方归档按它自己的范围保存原生状态，两者不互相顶替。",
        "result": "先恢复到独立目录，再核对版本、登录、网关与真实消息。"
      }
    ]
  }
},
  "kicker": "找回 AI 工作材料，而不是复制旧登录态",
  "summary": "换电脑、改坏配置或要找回旧任务时，先知道手里哪份备份能恢复什么。Codex 的设置与完整对话分别保存，Gemini／Antigravity 的轻量设置和成果、Claude 项目记忆、OpenClaw 配置与工作区也各按原有来源备份。这里把几条路线放在一起解释，不合并它们的任务和数据，也不承诺全部聊天、登录和运行状态一键回来。",
  "readerBoundary": "配置、记忆、附件和数据库的覆盖不同；恢复先到隔离目录并验证，账号在新设备重新登录。本地成功、G／H成功与私有Git成功各自成立。",
  "evolution": [{"date":"2026-07","title":"先保住容易丢的小文件","commit":"","result":"保存设置、规则和项目记忆，留下私有Git版本与独立G副本，避免换机只剩软件安装包。"},{"date":"2026-08","title":"完整对话不再混进轻量配置备份","commit":"","result":"原始会话、附件与数据库另走一致性恢复点，内容去重后保存到G／H；恢复先到空目录验证，不直接覆盖活动应用。"},{"date":"2026-09","title":"让各套 AI 的恢复范围说得清","commit":"","result":"不同工具仍沿独立来源和任务，云端失败不抹去已完成本地副本；轻量成果纳入Antigravity桌面／CLI，登录、活动程序和整机恢复继续独立验收。"}],
};

export const codexMemoryModules = [
  {
    "slug": "config-memory-whitelist-sync",
    usageEntry: "在已接入的 AI 对话中说要备份或找回 Codex 设置、Skills 或记忆，并指出是哪台电脑。",
    usageInputs: ["目标电脑和 Codex 配置根", "要保护的配置或记忆类别"],
    productFlow: [
      { title: "选白名单", detail: "系统按当前主机登记挑选小型配置与记忆，不把认证和庞大会话混进这条线。" },
      { title: "先存本地与 G", detail: "形成并核对本地/G 副本，再按私有云分支和远端状态处理同步。" },
      { title: "回读每层", detail: "说明新本地点、云端是否真的收到及排除项；网络失败保留已验本地结果，不说整套 Codex 已备份。" },
    ],
    "shortTitle": "白名单与防截断",
    "title": "Codex配置、技能和记忆的白名单备份",
    "subtitle": "桌面历史保留与次机安全文本投影分别维护",
    "teaser": "备份小文件，保留历史记忆，并核对私有 Git 推送",
    "order": 1,
    "status": "9月12日次机已安装字节、安全层31文件与独立云引用已回读；旧桌面测试保留原日期",
    "statusTone": "accent",
    "relation": "负责配置、安装技能和记忆文件；长期规则的规范源仍是 E:\\.agents。",
    "value": "把选定的小文件保存在 G 快照与私有 Git 历史里。需要恢复配置或找旧记忆时有明确版本，不把庞大会话库混进这条链。",
    "why": "配置和记忆小、适合版本对比；会话数据库大且持续变化，需要另一条快照路径。保留分工可避免某一条链失败时误报全部完成。",
    "example": "我说：“这台笔记本也要备份 Codex 设置和项目记忆，别混进台式机的副本。”系统按笔记本自己的保存位置先核对本地和 G 盘；云端失败不会抹掉已验本地结果。",
    "result": "得到这台电脑的设置与记忆副本，以及私有云端是否真的收到的单独结果。换机时选择文件回填后，还要确认 Codex 登录和实际工作能继续。",
    "problem": "避免把数据库/缓存塞入 Git，同时减少较小 raw_memories 覆盖私有历史的风险。",
    "readerStates": {
      "pass": "选中的小文件在本地/G 核对后，私有云是否收到另给结论。",
      "problem": "云端落后或冲突时保留已验本地副本，不拿更大的旧记忆直接覆盖现有内容。",
      "unavailable": "来源或私有仓库不可读时停对应副本，明确哪些材料仍留在本机。"
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
      "桌面复制到仓库时才用ProtectHistory：较小raw_memories和已有rollout_summaries不覆盖，backup-only记忆不删。次机配置档精确保存当前白名单及删除，不启用这条历史并入规则。",
      "桌面本地/G轻量快照保留30份，相同内容复用。次机profile（主机配置档）保留2份安全快照，精确暂存本轮输出及删除；与profile会话点的显式Prune（清理）分别管理。",
      "Get-CurrentSystemGitProxyUri只为当前Git调用读取系统代理，不持久化端口；桌面重试为30/120/300/900秒，次机配置档默认2/5秒并从首次网络请求使用当前系统代理。"
    ],
    "flow": [
      "桌面解析登记E盘来源；次机显式-ConfigPath验证主机、用户、现存物理Codex根与backup/<profile_id>支路，再按各自白名单选文件。",
      "把当前文件写成本地快照、G 快照并核验。",
      "本地热快照先核验，随后检查Git远端状态；桌面仓库实施历史保留，次机用精确输出集更新专用数据支路；并发已暂存内容会使本次操作停止。",
      "fetch检查分支，behind/diverged或云端网络失败时停止对应云动作，已校验的新本地热快照保留；只有fresh remote（新读远端引用）匹配HEAD才更新次机完整成功回执。",
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
      "2.53 MiB/243文件是9月8日桌面清单，不是其容量上限。次机安全云投影另有明确准入：允许文本扩展名、单文件至多5MiB、总选中文件至多25MiB；完整私有恢复层不因此被视为云端已保存。",
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
      },
      {
        "path": "tools\\project-safe-codex-config.py",
        "role": "次机TOML安全投影；未知字段不进入云配置参考"
      }
    ],
    "verification": [
      "9月7日两个版本的备份调用和本地 fixture（合成输入）验证通过：G 快照、ahead-clean、behind、diverged、push-rejected、post-receive-rewind。",
      "9月8日08:16Z桌面DryRun为243文件、2,656,388字节。次机9月12日Owner回读安全层31文件、266,762字节及独立云支路引用一致；本轮未触发新生产备份。"
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
    },
    readerStatus: "配置、技能与记忆已有分机器的备份证据；轻量副本不包含完整对话，应用登录与恢复使用仍另验。"
  },
  {
    "slug": "vss-conversation-hot-backup",
    usageEntry: "在已接入的 AI 对话中明确请求检查或执行 Codex 会话热备；执行需要项目已登记的管理员备份入口。",
    usageInputs: ["目标 Codex 会话来源", "G 盘是否可用", "需要的新点时间"],
    productFlow: [
      { title: "先确认执行条件", detail: "检查现有点、G 介质和权限，普通状态查询不新建快照。" },
      { title: "取得同一时间点文件", detail: "执行时从 E 卷快照读取纳入的会话、附件和状态文件，并写对象与清单。" },
      { title: "只发布完整点", detail: "所有引用对象校验后才更新 G 当前指针；快照之后的新对话待下次，数据库事务与应用加载仍需另验。" },
    ],
    "shortTitle": "使用中也能备份旧会话",
    "title": "Codex运行期会话快照与 G 热备",
    "subtitle": "从各自主机配置绑定的物理卷捕获会话及状态",
    "teaser": "继续使用 Codex，也能形成明确时间的会话备份点",
    "order": 2,
    "status": "9月24日 G 当前 1,983 文件，H 仍是9月23日 1,928 文件；指针与清单可读，完整对象及新机应用恢复未在本轮重验",
    "statusTone": "accent",
    "relation": "负责原始对话、附件、生成图像和应用状态。桌面与轻量配置分线；次机profile额外纳入选定私有配置、agents、memories和skills，云端安全投影仍独立。",
    "value": "Codex 仍可继续工作，夜间任务从同一时间点留下选定对话和附件；文件全部核对后才把新恢复点标成当前，之后的新对话等下次。",
    "why": "Codex 正在使用时，对话文件和数据库会变化，逐个直接复制可能前后不一致。夜间任务从同一时间点读取所选文件，再核对完整性；它仍只能恢复到那一刻。",
    "example": "我继续写代码，夜间备份取得当时的会话文件并保存到 G 盘；只有这一点的文件都核对完整，才把它标成最新。之后的新对话要等下一次。",
    "result": "得到带时间和文件清单的 Codex 会话恢复点。它不保证故障前最后一秒，也不因为文件可复制就证明应用内部所有操作都已保存。",
    "problem": "减少活动数据复制时点不一致和文件占用导致的失败，并保留可检查的失败结果。",
    "readerStates": {
      "pass": "同一时间点选出的会话文件在 G 盘完整核对后，才发布新的恢复点。",
      "problem": "执行权限不足时停在检查，不把只读状态查询当成已经备份。",
      "unavailable": "G 盘缺席或未解锁时这次热备不能进行，旧完整点仍照原状态保留。"
    },
    "decisionImpact": [
      "捕获语义明确为 vss_crash_consistent，不能升级为数据库事务和应用全部正常。",
      "覆盖 sessions、archived_sessions、thread backups、attachments、dictation、状态数据库、会话索引、生成图像/visualizations 与自动化状态。",
      "排除诊断日志库、临时缓存、插件、worktrees 和 auth，不为日志体积增大扩大备份范围。",
      "桌面G是登记、已解锁的完整BitLocker加密卷；次机profile核对自己的来源/热/冷卷唯一身份、所需加密状态及路径隔离。主机不匹配、介质不符或目录重叠时停止，不写到桌面默认路径。"
    ],
    "implementation": [
      "Hot使用Global\\CodexConversationBackupV1互斥锁并立即尝试取得；已有运行返回conversation_backup_already_running。创建VSS前检查vss-active.json，创建后登记准确shadow_id与卷；finally只清除此卷影及匹配记录，清理失败继续报错，并释放本次互斥锁。",
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
      "排除 auth、cache、plugins、worktrees、链接和诊断日志数据库；纳入的会话/数据库之外不声称全盘备份。",
      "SQLite数据库及被选中的WAL/SHM按同一VSS点作为文件保存；Restore回读文件哈希，不执行数据库SQL修复，也不证明事务全部提交。打开恢复副本后的SQLite状态、索引和应用加载需要单独验证。"
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
      "历史9月12日05:41Z G/H当时点同为20260912T041508Z-8cec9794，7167文件、49,655,464,859字节；指针、清单与闭包逐盘回读匹配。9月9日G旧点7016文件及当时H不可用均为历史；本次未重验全部对象。",
      "9月7日三个人工点及9月8日任务规格为旧桌面证据。次机9月12日PCConfig只读回执为已安装字节匹配、自然任务0、热/USB冷点相同323文件；本轮未重新创建VSS或哈希全部对象。"
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
    },
    readerStatus: "已有运行期间保存完整对话恢复点的功能；9月24日已核对G盘当前指针与清单，H盘仍是较早的恢复点。本轮没有重新验证全部对象或新机应用恢复。"
  },
  {
    "slug": "content-addressed-storage-cold-sync",
    usageEntry: "在已接入的 AI 对话中查询某个 Codex 会话备份点是否已到 G 或 H；H 冷备由 PCConfig 的既有任务处理。",
    usageInputs: ["要找的点位或日期", "G 与 H 介质状态"],
    productFlow: [
      {
        "title": "先查 G 盘这份会话是否完整",
        "detail": "系统核对这份会话用到的每个文件与清单；相同附件可共用一份保存，变动的数据库仍需新副本。"
      },
      {
        "title": "H 可用时再同步",
        "detail": "现有冷任务复制点所需对象，校验 H 端完整后才发布 H 指针并清理可退役旧对象。"
      },
      {
        "title": "说明真正完成到哪",
        "detail": "H 未连接时明确跳过；指针更新但清理未完成也只报告已完成阶段。"
      }
    ],
    "shortTitle": "相同文件去重与冷备",
    "title": "Codex会话内容去重、点校验与 H 冷备",
    "subtitle": "按完整文件内容复用对象，各介质分别校验",
    "teaser": "相同对象复用；H 没连接就明确冷备未完成",
    "order": 3,
    "status": "9月14日回读桌面G/H同点、两点保留与H随G收敛完成回执；9月7日合成测试保留原日期",
    "statusTone": "accent",
    "relation": "负责会话点的存储与核验；PCConfig拥有既有跨盘调度，引擎的FinalizeCold/SyncCold可追加复制完整热备点，再独立校验冷点。次机profile另有明确的有界清理。",
    "value": "相同内容只存一份，每个历史点保留自己的文件清单；H 在可用时独立校验，避免复制了指针却没有完整对象。",
    "why": "相同附件没必要在每一份会话备份里重存；但变动的数据库仍会占新空间。冷盘上的点只有文件齐全且自己通过核对，才算一份独立副本。",
    "example": "两份对话都用过同一张图片，G 盘可共用那张图片的保存文件。H 盘没接上就说明冷备未完成；接上后按现有任务复制并检查，不因目录出现就说可以恢复。",
    "result": "知道 G 盘和 H 盘各有哪些完整会话点；H 盘真实核对通过后才称那处冷副本可用。",
    "problem": "减少重复文件占用，避免不完整对象集被当成可用备份点。",
    "readerStates": {
      "pass": "这份会话所需文件齐全，H 盘再独立核对完成时各自标成功。",
      "problem": "H 盘未接不影响已验 G 点，只把冷副本标为未完成。",
      "unavailable": "任何引用文件缺失或损坏时停这份点的恢复，说明具体缺口。"
    },
    "decisionImpact": [
      "去重粒度是完整文件；相同字节复用，变化后的大数据库会占新空间。",
      "点清单发布后不由正常备份就地修改，哈希用于检出差异，不是对所有损坏的免疫保证。",
      "桌面无profile的Hot自动保留当前与前一点，验证后删除过期点和无引用对象；次机配置档仍可显式Prune。H在完整复制核验G有效保留集合后清理H独有旧点和对象，最新恢复不会并回源中已删文件。",
      "H 不可用时跳过；连接介质本身不会新增即时触发器。"
    ],
    "implementation": [
      "Get-ObjectPath 使用 SHA-256 哈希前两位分目录，其余哈希定位对象。",
      "Test-CodexConversationPoint 核对 schema、清单/闭包哈希、计数/字节和每个独有对象。",
      "Validate范围是选定Hot或Cold点引用的对象，不是全盘检查；默认写本地进度，-ReadOnly则不写进度，两者均不修改对象。",
      "FinalizeCold/SyncCold核验G当前及全部有效点，复制缺少对象并独立验证H；先发布H current，再清理H独有点和无引用对象，回读剩余集合后才写cold_retention_status=complete。较新捕获失败不妨碍复制已有完整旧点。"
    ],
    "flow": [
      "按完整文件内容算 SHA-256。",
      "同哈希对象存在且有效则复用，否则写入新对象并回读。",
      "生成该点的 manifest/closure，引用对象完整才更新 G current。",
      "现有 PCConfig 冷任务在 H 可用时增量复制 cold-payload，不直接复制 G 指针。",
      "H点校验通过后发布H指针，再清H独有点及无引用对象并回读；全部完成才报告冷备成功，中途失败保留实际已完成阶段。"
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
      "桌面Hot固定两点保留仍须容纳当前及前一点引用的对象；次机Prune仅适用于匹配的已绑定存储。保留点先完整验证，目录形态、指针或清单变化则拒绝清理。",
      "H写入阶段允许未完成复制；点校验后发布指针，随后收敛H独有旧点和对象，剩余集合回读完成才发完整成功回执。指针已更新本身不证明后续清理完成。"
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
      "9月7日三个人工点的dedup_verified与restore_verified均为true，仅作旧测试证据；9月12日正式源码已新增冷点复制与profile清理，本轮未运行新测试或生产对象核验。",
      "历史9月12日05:41Z G/H当时指针同为20260912T041508Z-8cec9794，实际清单/闭包哈希分别匹配；H原生cold-last于05:22:41Z complete/readback_verified=true，7167文件/49,655,464,859字节。9月8日同点和9月9日H不可用仅保留历史；本次只读小元数据，没有重复全对象校验或执行冷同步。"
    ],
    "searchAliases": [
      "内容寻址存储",
      "CAS会话去重",
      "不可变闭包清单",
      "H盘冷备管道",
      "桌面增量存储与次机有界回收"
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
    },
    readerStatus: "已有内容去重和冷副本独立核对；最近两块备份盘一致的记录保留原日期，未连接的冷盘不会被当作已更新。"
  },
  {
    "slug": "isolated-disaster-recovery",
    usageEntry: "在已接入的 AI 对话中指定 Codex 备份 PointId 和全新空目录，要求先恢复副本并查看旧任务。",
    usageInputs: ["可验证的备份点", "空恢复目录", "要核查的旧对话或设置"],
    productFlow: [
      {
        "title": "先验材料再选择空目录",
        "detail": "系统确认恢复点所需文件都在、目标是空目录，避免把旧材料盖到现役 Codex 上。"
      },
      {
        "title": "只还原隔离副本",
        "detail": "按原相对路径恢复并核对文件，不覆盖正在使用的 Codex。"
      },
      {
        "title": "再验应用能力",
        "detail": "从副本查旧任务并核对登录、配置和新任务能否运行；文件可读不等于应用已全部恢复。"
      }
    ],
    "shortTitle": "隔离恢复与调度",
    "title": "Codex先恢复到空目录，再验证应用可用",
    "subtitle": "点校验、文件还原与当前环境分别处理",
    "teaser": "保留现在的 Codex，先检查历史文件副本",
    "order": 4,
    "status": "9月10日次机隔离副本可列任务并读12轮；未启动新回合，9月12日只读旧回执",
    "statusTone": "accent",
    "relation": "把选定会话点重建为可检查的文件副本，不自动切换或启动恢复后的 Codex。",
    "value": "找回旧 Codex 对话时先验一份完整恢复点，复制到空目录，原来正在用的程序不被覆盖；文件可读、登录和新任务可继续分别验收。",
    "why": "直接恢复到正在变化的应用目录，会覆盖新文件或混合版本。先还原副本能保留现场并明确恢复结果。",
    "example": "“从最近一份完整对话备份恢复到空目录，先让我确认旧任务能不能找回来。”AI核对恢复点和文件完整性，在隔离目录恢复并用副本列出任务、读回对话；原来正在使用的目录保留。能看到旧对话不等于应用已经登录或新任务能继续运行。",
    "result": "先得到一个在空目录中可核对的旧对话副本，现役 Codex 目录不被覆盖。能列出旧任务仍不等于应用已经登录，或新电脑可以继续那项工作。",
    "problem": "防止历史文件直接覆盖当前运行根，防止与备份池/状态目录混写。",
    "readerStates": {
      "pass": "备份点完整，空目录恢复文件并逐项核对后，报告文件层完成；应用是否可用再试。",
      "problem": "目标恰是正在使用的 Codex 目录时拒绝覆盖，改选独立空目录。",
      "unavailable": "备份不完整、目标已有文件或链接到受保护位置时停下并指出原因。"
    },
    "decisionImpact": [
      "Restore 要求 -Execute 与显式 DestinationRoot。",
      "拒绝当前活动根及子目录、Hot/Cold/State 根及子目录；已有目录须为空且非 reparse point。",
      "先完整核验点，再写目标文件，写后核验；未完成的目标不能算恢复成功。",
      "桌面仍由原有轻量20:05/22:05与会话21:15任务经VBS隐藏启动。次机配置、安装与既有隐藏调度归PCConfig的Manage-CodexDataBackup.ps1，不在备份引擎另建服务。"
    ],
    "implementation": [
      "Resolve-PointId 选择指定点或 latest，Test-CodexConversationPoint 校验点与对象。",
      "Invoke-RestorePoint拒绝受保护目标，验证后重读manifest防止读入变化。只读校验及隔离恢复不要求旧主机身份；仍须现场确定实际介质路径并保持目录隔离，不能把原盘符当成新机已绑定。",
      "Copy-ObjectToFile 按清单恢复原始相对路径与内容并校验。",
      "恢复进度写本地restore-progress.json，采用codex.conversation-backup.progress.v1；返回includes_configuration明确该点是否包含profile私有配置。不会把配置文件存在等同登录或新回合续作。"
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
      "Restore只重建选中Hot或Cold点纳入的文件；桌面点不包含轻量管道全部配置，次机profile可含选定私有配置。它不安装程序、注册服务、设置全局变量或恢复登录；安全云投影也不能原样替代config.toml。",
      "次机9月10日旧回执证明隔离副本可列出139项任务并读选定任务12轮；未复制凭据或启动新回合。当前新机登录、新回合续作仍未验，不用文件可读替代全部E2E（端到端验证）。"
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
    },
    readerStatus: "笔记本曾在隔离副本中列出任务并读回旧对话；没有启动新一轮工作，文件还原不等于应用已完全接续。"
  },
  {
    "slug": "gemini-workspace-memory",
    usageEntry: "在已接入的 AI 对话中说要找回 Gemini 或 Antigravity 的项目说明、笔记和设置，并指定目标机器。",
    usageInputs: ["应用和项目", "本地/G 或私有 Git 版本", "新机器目标目录"],
    productFlow: [
      { title: "选可读成果", detail: "按登记清单找项目文件，说明原始聊天和媒体是否不在范围。" },
      { title: "先恢复副本", detail: "挑一个已核验版本，保留新机现有文件后按相对目录回填。" },
      { title: "确认能接着工作", detail: "核对项目引用、应用加载和官方登录；云上只有可读文件时不承诺整段会话回来。" },
    ],
    "shortTitle": "Gemini配置与成果",
    "title": "Gemini配置、项目清单与可读工作成果",
    "order": 5,
    "teaser": "保留Gemini与Antigravity中可回填的配置和可读成果，原始会话与媒体不在这条链里。",
    "status": "现役脚本、最近任务0和G元数据已读；本轮未做新机恢复",
    "statusTone": "mixed",
    "relation": "这是Gemini自己的文件选择与恢复边界；与Codex会话库、Claude记忆和OpenClaw状态分别保存。",
    "value": "换电脑后能找回 Gemini 和 Antigravity 的项目清单、设置与可读工作笔记；原始聊天、媒体和登录状态不在这份副本里。",
    "why": "可读成果与原始会话不是同一类材料。把配置、笔记和工作输出保存为小文件，便于检查版本与选择性恢复；把全部应用目录当成已备份，会误以为登录和会话也能回来。",
    "example": "我说“把Gemini和Antigravity里保存的项目说明、笔记与设置找回来”。先选本地/G快照或私有Git版本，按原目录关系复制到目标Gemini根，核对项目路径和应用加载；不会声称恢复了不在清单里的旧聊天。",
    "result": "找回 Gemini 或 Antigravity 的项目清单、设置和可读笔记；回填后还要在当前应用里确认能看到。原始聊天和登录状态不在这份材料里。",
    "problem": "防止遗漏小型工作成果、把旧点当新状态，以及用文件备份冒充完整会话或登录恢复。",
    "readerStates": {
      "pass": "选中的项目文件在本机/G 有可核对副本，私有云是否收到另算；恢复后应用确实能加载再说可用。",
      "problem": "云端失败保留本机副本；保存期间来源又变化时说明几个副本并非同一时刻。",
      "unavailable": "来源目录或选定私有仓库不存在时停这条线，不猜另一个账号。"
    },
    "decisionImpact": [
      "只选当前脚本实现的路径与扩展名，不从“工作区备份”推断全量聊天。",
      "本地与G各保留30份；私有Git提供提交历史，当前专用工作树会按本轮选择重建。",
      "恢复是按原相对路径复制文件，当前没有Gemini专用自动还原器；先保留现有文件，之后重核安装、项目路径、登录与应用结果。"
    ],
    "implementation": [
      "backup-gemini-memory.ps1读取gemini_memory登记路径。db51ae7保留projects.json、config/**及Antigravity桌面状态，同时纳入antigravity-cli/settings.json、annotations/*.pbtxt，以及桌面/CLI各自brain下的*.md和*.metadata.json。不复制整棵CLI目录。",
      "选择后排除.system_generated、scratch、tmp、history、原始conversations、db/sqlite/sqlite3/jsonl/log及媒体/二进制；CLI cache、crashes、updater、builtin、bin、implicit、presence、knowledge排除。OAuth、credential/creds、token、secret、auth、google_accounts.json和.env类文件名也排除；这是有界选择规则，不是任意敏感内容识别器，真实载荷不进网页。",
      "先Copy-SelectedFiles形成时间戳本地快照，再Publish-GHotSnapshot逐文件核对G；同内容可复用，最多30份。云阶段先检查main/远端状态，再清理专用工作树并从当前来源再次复制选中文件，写README和MANIFEST。",
      "Git按变更提交，仍会无条件核对或补推已有超前提交；最终远端OID一致才报告云完成。云失败抛出异常，已完成本地/G仍保留。"
    ],
    "flow": [
      "读取这一套已登记路径，生成非空选择清单。",
      "复制本地时间戳快照并核对G副本。",
      "确认专用私有Git状态，重建本轮可读文件集合，提交并回读远端。",
      "恢复时选择一个版本，保留当前目标文件后按相对路径回填。",
      "重核项目引用、应用加载和官方登录；原始会话/媒体不在完成范围。"
    ],
    "concepts": [
      {
        "term": "Antigravity brain（工作成果目录）",
        "explanation": "这里只收Markdown和metadata.json等可读成果，不把该目录名字当作完整会话库。"
      },
      {
        "term": "MANIFEST（文件清单）",
        "explanation": "列出所选文件与总字节；它与G逐文件SHA-256回读及Git引用分别证明不同层。"
      }
    ],
    "boundaries": [
      "不读或发布真实正文、账号和令牌；实际备份保持在原私有目标。",
      "Gemini 兼容任务沿用原名，只复制所选状态，不调用退役Gemini模型命令；文件备份不等于启动模型、恢复登录或重新运行旧产品。",
      "源文件在本地/G完成后还可能变化，云阶段重新读源，不宣称原子跨介质快照。",
      "新机自动登录、完整聊天恢复和应用兼容未在本轮验收。"
    ],
    "failures": [
      {
        "condition": "未选出文件或路径配置缺失",
        "response": "返回明确错误，不创建空备份冒充完成。"
      },
      {
        "condition": "远端落后、分叉或认证错误",
        "response": "停止Git层；网络/TLS可有界退避，状态冲突不能靠重试或强推解决。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\OpenClawGateway\\tools\\backup-gemini-memory.ps1",
        "role": "实际选择、三层分发及恢复说明生成"
      },
      {
        "path": "tools/private-backup-settings.ps1 / g-hot-snapshot.ps1 / git-cloud-sync.ps1",
        "role": "路径契约、G内容验证与私有Git回读"
      },
      {
        "path": "tools/test-gemini-memory-backup.ps1",
        "role": "合成选择与排除回归"
      }
    ],
    "verification": [
      "9月9日22:07Z任务最近05:10:01Z为Ready/enabled/0；22:08Z G元数据127文件、181152字节与实际目录计数/字节一致，completed_utc=05:10:06Z。",
      "私有Git本地/远端均为e3413caca7edbcf1ba9cf79d004ed26c080dbcbf；未读取正文、重新备份或还原。",
      "2026-09-18只读已发布OpenClawGateway db51ae7与同次选择回归定义，确认CLI新增范围和秘密/历史排除；本轮未运行新备份或恢复，不能把9月9日G元数据证明扩大到新增CLI文件。",
    ],
    "searchAliases": [
      "Gemini Memory Backup",
      "Gemini恢复",
      "Antigravity备份",
      "Gemini项目清单"
    ],
    "searchProjection": {
      "intents": [
        "找回Gemini配置和项目说明",
        "恢复Antigravity可读工作成果"
      ],
      "entities": [
        "Gemini",
        "Antigravity",
        "projects.json",
        "backup-gemini-memory.ps1"
      ],
      "relations": [
        "可读状态与原始会话分开",
        "本地G与私有Git分别验收"
      ],
      "failureRecovery": [
        "源不可用停止",
        "云失败保留本地G",
        "按原相对路径回填"
      ]
    },
    readerStatus: "脚本、最近任务结果和备份元数据已核对；可恢复的是选定配置与可读成果，新机加载本轮未验收。"
  },
  {
    "slug": "claude-project-memory",
    usageEntry: "在已接入的 AI 对话中点名 Claude 项目，说明要找哪份项目记忆。",
    usageInputs: ["具体项目", "本地/G 或私有 Git 版本", "是否需要非 Markdown 附件"],
    productFlow: [
      {
        "title": "按项目找到对应记忆",
        "detail": "系统在备份中定位这一个 Claude 项目的记忆目录，不混入其他项目。"
      },
      {
        "title": "依介质选材料",
        "detail": "电脑本地和 G 盘副本可含完整目录；私有云仓库只保存文字笔记，若要找附件仍须检查本地副本。"
      },
      {
        "title": "回填并验收",
        "detail": "保留目标文件后恢复选定项目，确认 Claude 实际加载；原始聊天和登录不由记忆备份恢复。"
      }
    ],
    "shortTitle": "Claude项目记忆",
    "title": "Claude项目记忆按项目保存与恢复",
    "order": 6,
    "teaser": "保存每个项目的memory，避免同名MEMORY.md互相覆盖；本地/G与云端的文件范围不同。",
    "status": "共享任务最近返回0；G与私有Git元数据已读，新机应用恢复未验",
    "statusTone": "mixed",
    "relation": "Claude记忆在共享OpenClaw Memory Backup任务中先运行，成果仍写自己的快照和私有Git，不混入OpenClaw工作区。",
    "value": "项目目录损坏或换电脑时，能找到Claude为各项目保存的长期说明和记忆，并放回对应项目的位置。它保留项目层级，不把几个同名MEMORY.md堆到一个目录。完整对话、项目源码和官方登录需要各自材料，不能由这份记忆副本代替。",
    "why": "Claude 的项目笔记和完整聊天不同。电脑本地可保存整个项目记忆目录，私有云只保文字笔记；只看云端会漏掉其他附件。",
    "example": "我说“把这个项目之前的Claude记忆找回来”。先定位备份中的项目/memory目录，选版本并保留目标现有文件，再按原项目映射回填。若还需要memory里的非Markdown附件，优先检查本地/G，不能只看云仓库。",
    "result": "得到这个项目的记忆版本，并核对当前 Claude 是否真的加载；附件从本机或 G 盘找，登录和旧聊天另查。",
    "problem": "防止项目间记忆重名覆盖、云副本范围被夸大，以及把共享任务码误当成单个消费者的全部证据。",
    "readerStates": {
      "pass": "项目记忆确实存在并已保存，恢复后 Claude 能识别这个项目时才称可用。",
      "problem": "云端失败时本机副本仍可用，共享备份任务其他部分也要分别看结果。",
      "unavailable": "没有该项目记忆或私有目标不可读时明确说缺少，不创建空目录冒充恢复。"
    },
    "decisionImpact": [
      "本地/G递归复制memory目录；云端只同步*.md，两者不假装同样完整。",
      "云目录按project/memory保留，当前仍存在的各项目内Markdown使用镜像同步；不把未处理的旧项目目录自动判作已清除。",
      "没有专用自动还原器；恢复前确认新旧项目路径映射，先留目标副本，再回填并让Claude实际读取。"
    ],
    "implementation": [
      "backup-memory.ps1读取claude_memory五个路径键，枚举source_root下项目目录中的memory；找不到来源或任何memory目录时退出1。",
      "本地时间戳目录保持project/memory层级并复制全部内容，轮换30份；G使用ai-memory.g-hot-snapshot.v1逐文件SHA-256回读，同内容可复用旧点。",
      "云端先检查main与远端关系，移除旧根目录Markdown布局但保留README；逐当前项目以robocopy *.md /MIR同步到project/memory，退出码>=8视为失败。源在这一步被再次读取，不是直接拿G快照覆盖。",
      "memory_backup_hidden.vbs先等待Claude结束，再等待OpenClaw结束；两段都尝试，Claude非零时优先返回它，否则返回OpenClaw结果。没有新增Claude独立计划任务。"
    ],
    "flow": [
      "枚举实际项目memory目录并形成项目分组。",
      "复制本地时间戳副本，核对G并轮换。",
      "按项目将Markdown送入私有Git，提交和回读。",
      "共享启动器继续尝试OpenClaw，并组合退出码。",
      "恢复选定项目记忆，核对新路径和Claude加载结果。"
    ],
    "concepts": [
      {
        "term": "project/memory（项目记忆层级）",
        "explanation": "每个项目保留自己的memory目录，不让多个MEMORY.md互相覆盖。"
      },
      {
        "term": "共享任务返回码",
        "explanation": "同一调度顺序运行两个独立消费者，第一项失败不阻止第二项尝试，但最终不会报成全成功。"
      }
    ],
    "boundaries": [
      "不是Claude完整环境、登录、项目代码或原始聊天备份。",
      "本地/G可能包含非Markdown，私有Git不包括这些文件；需要时按实际介质选恢复材料。",
      "本轮没有打开记忆正文或在新电脑执行恢复。"
    ],
    "failures": [
      {
        "condition": "没有项目memory目录",
        "response": "退出1，说明没有可备份来源。"
      },
      {
        "condition": "某个项目robocopy失败",
        "response": "Git层失败并保留已完成本地/G；共享启动器仍继续尝试OpenClaw。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\OpenClawGateway\\tools\\backup-memory.ps1",
        "role": "Claude项目选择、两种文件范围及Git结果"
      },
      {
        "path": "tools/memory_backup_hidden.vbs",
        "role": "Claude后接OpenClaw的真实顺序和首个非零传播"
      }
    ],
    "verification": [
      "9月9日22:07Z共享任务最近05:20:01Z为Ready/enabled/0。22:08Z读取G保存点36文件、76727字节，旧点时间为8月21日05:20Z；源实现允许同内容复用，未重新哈希正文。",
      "Claude私有Git本地干净；首次Git远端读取TLS失败，随后GitHub引用接口确认1fcc03dff6b0d5bbfa7c3a02a570d31308332b8e同值。"
    ],
    "searchAliases": [
      "Claude Memory Backup",
      "Claude项目记忆备份",
      "Claude MEMORY.md恢复"
    ],
    "searchProjection": {
      "intents": [
        "找回Claude项目记忆",
        "为什么Claude云备份只有Markdown"
      ],
      "entities": [
        "Claude",
        "memory",
        "backup-memory.ps1",
        "memory_backup_hidden.vbs"
      ],
      "relations": [
        "项目层级隔离同名记忆",
        "共享调度不合并数据"
      ],
      "failureRecovery": [
        "云失败保留G",
        "非Markdown从本地G取回",
        "按目标项目映射恢复"
      ]
    },
    readerStatus: "项目记忆的备份元数据和共享任务结果已核对；完整聊天不在此范围，新电脑是否加载记忆仍未验收。"
  },
  {
    "slug": "openclaw-workspace-recovery",
    usageEntry: "在已接入的 AI 对话中说明 OpenClaw 是配置损坏、工作区丢失还是需要官方状态归档恢复。",
    usageInputs: ["目标 OpenClaw 环境", "日常快照或官方归档", "当前网关是否仍运行"],
    productFlow: [
      { title: "选对恢复材料", detail: "日常配置/工作区快照与官方原生归档分别查，不用小文件冒充完整状态。" },
      { title: "先解到新暂存目录", detail: "官方归档先验证再恢复到空目录，保留当前环境及其路径。" },
      { title: "决定是否激活并验消息", detail: "核对版本、认证、网关、模型与渠道后才离线激活；暂存成功或任务退出码不足以证明真实消息可用。" },
    ],
    "shortTitle": "OpenClaw恢复",
    "title": "OpenClaw配置、工作区与官方归档分别恢复",
    "order": 7,
    "teaser": "日常文件快照与官方状态归档互补；先验证材料和暂存副本，再决定是否激活。",
    "status": "定时G与私有Git元数据已读；官方归档与暂存沿用旧验收，未激活恢复",
    "statusTone": "mixed",
    "relation": "网关、渠道、模型和运行修复仍由OpenClawGateway负责；这里解释备份文件与恢复材料，任务和源仓库保持独立。",
    "value": "改坏设置、重装或迁移OpenClaw时，我可以找回配置和工作区中的人格说明、记忆、技能与脚本；还可以用官方归档恢复原生状态到一个新目录，先检查再决定启用。两种材料各自有范围，官方归档明确不含工作区，不能靠一个“恢复成功”提示把缺的部分略过。",
    "why": "OpenClaw 的日常设置和工作区，与官方归档保存的应用状态不同。配置损坏时先找对材料、暂存检查，再决定是否激活，免得把仍可用的网关盖掉。",
    "example": "我说“OpenClaw配置改坏了，先帮我找一份能检查的恢复材料”。先取某次config/workspace快照；若要还原原生状态，先校验官方归档并解到全新暂存目录。当前网关保持不动，检查版本、工作区和登录后再明确执行离线激活。",
    "result": "得到按日期分开的设置和工作区副本，或在全新目录里可检查的官方归档副本。当前网关不会因“文件已解开”就自动切换；登录、模型与消息链另验。",
    "problem": "防止把普通文件复制、官方归档校验、暂存恢复和现役激活混成一项成功。",
    "readerStates": {
      "pass": "日常副本各自核对；官方归档先验完整并解到空目录，只报告这一层完成。",
      "problem": "云端失败保留本地副本；官方归档没有工作区时另从日常副本找。",
      "unavailable": "材料不齐或目标目录不为空时停止恢复，不覆盖当前网关。"
    },
    "decisionImpact": [
      "定时脚本只选择openclaw.json、auth-profiles.json、config.yml和.env，不是config_root全量镜像。",
      "workspace排除node_modules、.git、.openclaw-repair、.clawhub及package-lock.json；依赖和被排除材料另行恢复。",
      "官方backup-config.ps1使用--no-include-workspace；要完整恢复工作体验，必须分别确认工作区与官方状态材料。",
      "restore-config.ps1只暂存，不停止网关、不覆盖当前配置、不自动激活。当前没有四套工具统一的一键恢复器。"
    ],
    "implementation": [
      "backup-openclaw.ps1读取openclaw组六个路径键；先验证配置根、工作区根和私有Git，再把四类存在的配置文件复制到config，workspace用过滤后的robocopy生成本地快照。",
      "本地/G各轮换30份，G以文件长度和SHA-256核对。云端先检查main与远端状态，然后严格从已经完成的configSnapshot/workspaceSnapshot复制；配置文件在本轮快照缺失时清除云端对应旧文件，workspace按同一快照镜像。",
      "backup-config.ps1调用openclaw backup create --output <archive> --no-include-workspace --verify --json，要求verified=true、includeWorkspace=false、assets非空、返回归档位于指定目录且真实存在。",
      "restore-config.ps1先调用官方backup verify，再以backup restore --target <新目录>恢复；目标必须尚不存在，恢复后检查非空文件集，返回openclaw_restore_stage_result.v1、activation_performed=false、activation_required=true。",
      "官方归档可包含私人配置和凭据，保存于原私人归档根；页面不读取它们。完整离线激活按同版本官方恢复流程独立处理，不能把文件名清单当作已验证认证可用。"
    ],
    "flow": [
      "选择日常config/workspace快照或官方状态归档。",
      "日常备份先完成本地/G，再从同一快照更新私有Git。",
      "官方恢复先verify，要求全新目录，再还原并核对非空结果。",
      "检查版本、工作区、路径、依赖及认证，保留当前环境后才决定离线激活。",
      "独立核对网关、模型、渠道与真实消息结果，不以暂存成功代替。"
    ],
    "concepts": [
      {
        "term": "staging-only（只恢复到暂存区）",
        "explanation": "生成一个可检查的恢复副本，当前运行配置和网关没有被切换。"
      },
      {
        "term": "include_workspace=false",
        "explanation": "官方归档显式不包含工作区，不能用它的验证结果替代工作区副本。"
      }
    ],
    "boundaries": [
      "不展示配置正文、账号、令牌、私有端点或真实归档。",
      "没有重新创建备份、还原真实材料、激活网关或发送消息。",
      "自动恢复登录、原消息和完整原生状态需按官方归档及应用实测，不由四个配置文件或定时任务0保证。"
    ],
    "failures": [
      {
        "condition": "robocopy退出码>=8或本地快照为空",
        "response": "停止对应备份，不向云端发布假成功。"
      },
      {
        "condition": "归档校验失败或目标已存在",
        "response": "拒绝暂存恢复；不覆盖当前网关或现有目录。"
      },
      {
        "condition": "暂存完成但激活未执行",
        "response": "明确返回activation_required=true，应用恢复保持未验。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\OpenClawGateway\\tools\\backup-openclaw.ps1",
        "role": "四配置文件、工作区选择与同快照三层分发"
      },
      {
        "path": "tools/backup-config.ps1 / restore-config.ps1",
        "role": "官方无工作区归档、校验和只暂存恢复"
      },
      {
        "path": "tools/test_backup_config.ps1 / test_restore_config.ps1",
        "role": "归档/新目标与不激活的隔离合同测试"
      }
    ],
    "verification": [
      "9月9日22:08Z G元数据186文件、2840710字节与实际目录计数/字节一致，保存点仍为9月1日03:20Z；同内容可复用旧点。私有Git本地/远端同9359383c62008bc59e96d5891496b738c950a7b1、工作树干净为05:05Z独立历史观察。",
      "9月3日224287339字节官方归档和全新暂存恢复保留历史通过证据；未进行本轮真实恢复或激活。"
    ],
    "searchAliases": [
      "OpenClaw Backup",
      "OpenClaw工作区备份",
      "OpenClaw官方归档恢复"
    ],
    "searchProjection": {
      "intents": [
        "找回OpenClaw配置与工作区",
        "OpenClaw归档恢复为什么还要激活"
      ],
      "entities": [
        "OpenClaw",
        "backup-openclaw.ps1",
        "backup-config.ps1",
        "restore-config.ps1",
        "activation_performed"
      ],
      "relations": [
        "日常工作区快照与官方归档互补",
        "暂存与激活分开"
      ],
      "failureRecovery": [
        "云失败保留本地G",
        "官方校验先于还原",
        "目标已存在拒绝"
      ]
    },
    readerStatus: "配置和工作区副本已有记录，官方归档可在新目录暂存；本轮没有激活恢复或证明网关重新可用。"
  }
];

export const project = codexMemoryProject;
export const modules = codexMemoryModules;
