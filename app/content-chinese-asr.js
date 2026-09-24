import { createProjectSnapshot } from "./project-snapshot.js";

const chineseAsrSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T13:30:47.6674815Z",
  label: "听写有界恢复、文件质量复核与共享文案对齐已实现；默认模型不因升级自动改变",
  boundary: "9 月 17 日来源完成公开短音频、42 秒分段、双模型、对齐及异常进程回收验收；本轮只读确认听写任务运行、入口匹配和对齐工件存在，没有开麦、注入文字或运行模型。模型一致、完整覆盖和文件回执都不等于逐字准确。",
  metrics: [
    { label: "登记 / 可执行", value: "6 / 5" },
    { label: "9 月 17 日来源回归", value: "482 项 · 1 跳过" },
    { label: "历史长音频分段", value: "4/4" }
  ],
  facts: [
    { label: "桌面听写", value: "Win+H / Ctrl+Win+H 显示并录音、再次隐藏并暂停；现在只有一个 200×75 实际像素面板，优先 MTT1337 VDD，未接入时用 PHLC34B 物理主屏，不再同时开两个小窗。约 600 ms 停顿、20 秒上限或手动暂停提交整段，仍非逐字流式；Esc 取消未输入部分，不自动发送。" },
    { label: "听写部署证据", value: "2026-09-18 13:30 UTC 的 Status 确认 ChineseASR Dictation 已安装且 Running，中文听写.lnk 存在、归属和绿色图标匹配。任务运行不证明模型已准备或麦克风已连上；普通启动任务只加载宿主，用户入口 Start/Restart 才是开始录音动作。本轮未触发任何录音、停启或焦点输入。", hero: false },
    { label: "日常默认", value: "文件 baseline / strict：Qwen3-ASR-1.7B + SenseVoiceSmall；quick：SenseVoiceSmall；桌面听写单独使用 Qwen3-ASR-1.7B，不加入双模型等待或 LLM 润色。" },
    { label: "重要录音本地证据", value: "high_quality 文件候选：FireRedASR2-LLM + Qwen3-ASR-1.7B，须显式选择；公开样例通过与安装成功都不自动提升为默认。" },
    { label: "时间线与匿名说话人", value: "Paraformer + CAM++；cluster 不是人物身份" },
    { label: "云候选的两种用途", value: "Qwen Audio 3.0 ASR Flash；Important（重要录音）与 QualityReview（存疑转写质量复核）二选一，均须本次上传授权。普通质量复核保持 purpose=quality_review，不被伪装成重要录音。" },
    { label: "显式 Profile 与恢复", value: "Fun-ASR-Nano-2512 可显式执行；Whisper Large V3 只登记为 fallback/comparison，当前禁止直接转写" },
    { label: "本轮快照", value: "正式来源为 ed060fa；9 月 17 日来源全套执行 482 项，0 失败、0 错误，1 项因可选公开中文 VAD fixture 缺失而跳过。来源另有公开音频与异常退出验收；本轮只读 Status 和 alignment-info，没有把旧 45 项、376 项或新 482 项计作网页重跑。", hero: false },
    { label: "复用已有转写", value: "transcript-readback 以原音 SHA-256 读取已完成的本地任务及 outputs/cloud-jobs 中保留的云结果；不读原音、不启动模型、不重新上传。云结果只证明块级范围，timestamp_granularity=chunk、quality.status=unknown，不冒充逐句时间或逐字正确。", hero: false },
    { label: "模型路线", value: "文件保留 baseline 与显式 high_quality 两套命名配置，显式引擎优先；新增对齐与质量复核不改变桌面听写和 quick。候选只有在同语料、同指标、独立带真值样本比较满足要求后才可明确切换 strict 默认，并保留可回退配置。", hero: false },
    { label: "当前源码", value: "PUBLIC main=origin/main=ed060fa00d1281b44f691ea4038453fce4f975e8，正式回读工作树干净。现役源码包含有界听写模型进程、单面板、文件质量复核、VAD 边界切分、固定模型生命周期和独立已知文案对齐；不是尚未实现的计划。", hero: false },
    { label: "完整回归", value: "9 月 17 日来源 482 项回归无失败/错误、1 个可选 fixture 跳过；PCConfig 的 64 项 GPU Broker 与 63 项配置/恢复合同、chinese-asr Skill 供应健康分别通过。9 月 5 日 376 项与 33 项定向、9 月 9 日 45 项听写回归保留原日期，互不相加，也不替代真实推理。", hero: false },
    { label: "本机环境", value: "2026-08-31 Doctor（环境体检）现场识别到 NVIDIA GeForce RTX 5090 D、驱动 616.56、32607 MiB 显存；WinHTTP 为直连，代理环境干净。", hero: false },
    { label: "运行依赖", value: "Windows 核心依赖更新为 FunASR 1.4.14、NumPy 1.26.4，满足 FunASR 的 NumPy <2 兼容约束。Qwen ASR 0.0.6、Torch/TorchAudio 2.11.0+cu128、Transformers 4.57.6 维持；Python 3.11.9 与 ModelScope 1.38.1 继承 2026-08-31 环境观察。听写额外依赖 sounddevice 0.5.6、pystray 0.19.5、Pillow >=10。", hero: false },
    { label: "安装脚本回归", value: "2026-08-31 的 tests.test_scripts 共 18 项安装与入口回归通过，覆盖 setup、固定模型下载、依赖锁/wheelhouse、offline install、Smart API 与 smoke 静态合同；这是历史证据，不是本轮重新制备离线工件。", hero: false },
    { label: "Qwen 模型回执", value: "2026-08-31 Qwen MODEL_RECEIPT 观察为 1763 字节、SHA-256=0c43de9dd883adefb65cfa1477ad7156f749868105a554e647b47de73c841ef9，绑定 revision a04930dbe5419bfee073f7cade734f572689a3a8 的 13 个必要文件、合计 4703115105 字节；该次确认文件都存在且大小一致；本轮未重读模型工件。", hero: false },
    { label: "FireRed 模型回执", value: "2026-08-31 FireRed MODEL_RECEIPT 观察为 2124 字节、SHA-256=c4effd6931c0e09d8b2caaf7f8b9f58bed370fa4a174edfc64b668dd0b48dd01，绑定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824 的 14 个必要文件、合计 18870501538 字节；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 且工作树干净。", hero: false },
    { label: "FireRed WSL", value: "2026-08-31 FireRed WSL 观察为 Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2，CUDA/BF16 可用，约 32 GiB RAM + 8 GiB swap。9 月 17 日来源真实 FireRed 路线验收另成立；本轮没有重新读取可用内存或加载模型。", hero: false },
    { label: "模型 Registry", value: "当前模型 Registry（登记表）包含 6 个 Profile：FireRedASR2-LLM、Fun-ASR-Nano-2512、Paraformer、Qwen3-ASR-1.7B、SenseVoiceSmall 和 Whisper Large V3；其中前 5 个进入 direct transcription（直接转写）闭集，Whisper 只作 fallback/comparison 登记，pipeline 明确拒绝直接执行。", hero: false },
    { label: "说话人证据", value: "主分支已包含有界说话人证据回读、可撤销 person:self 档案和时间戳通话归属；具体且一致的上下文可在解释反对声学线索后支持 inferred（暂时推断），无法消解的歧义保持未知，profile 撤销后旧声学证据失效。", hero: false },
    { label: "媒体替换保护", value: "最新说话人证据回读会在处理前后再次核对目标媒体快照；文件被替换或改变时失败关闭，不让旧媒体证据落到新文件上。", hero: false },
    { label: "历史真实验收", value: "历史公开验收曾用超过 40 秒的中文电话录音完成四切片 FireRed + Qwen 路线，4/4 段均 verified；相同请求续跑为 0 processed / 4 skipped，默认 strict smoke 也有独立历史通过记录。", hero: false },
    {
      "label": "共享已知文案对齐",
      "value": "2026-09-18 13:30 UTC alignment-info 只读返回 Qwen3-ForcedAligner-0.6B@c7cbfc2048c462b0d63a45797104fc9db3ad62b7、weights_present=true、单场最多300秒；给已确认文案定位，lexical_truth_verified=false，不重新配音或启动双模型。",
      "hero": false
    },
  ],
  gaps: [
    "9月9日只读音频设备枚举已发现DJI输入端点，取代9月5日未连接的旧观察；没有打开麦克风或采集声音，因此仍未验个人语音与真实按键。指定设备缺失时仍提示连接、不换其他麦克风；入口和图标属性正确也不等于个人使用已通过。",
    "Qwen/FireRed 大权重和 WSL 精确容量保留原观察；本轮只读确认对齐器固定目录存在、听写任务运行以及离线工件仍缺失，没有重算全部模型哈希或启动推理。",
    "9 月 17 日公开音频验收覆盖单模型听写、high_quality 短音频、42 秒两切片 FireRed+Qwen、Qwen 对齐、Smart/API 及异常 worker 回收；它证明集成，不是代表性中文准确率评测，也不证明个人麦克风、口音或按键到上屏体验。",
    "2026-09-18 只读确认 offline/manifests 的 requirements-lock.txt、python-version.txt、wheelhouse.sha256、wheelhouse.json 与 offline/wheelhouse 均不存在；因此仍没有可携带的当前离线依赖包，更没有完成断网新机安装。",
    "2026-08-31 只核对两份模型回执自身 SHA-256、必要文件存在性与声明大小，没有重新计算约 4.7 GB Qwen 和约 18.9 GB FireRed 全部权重文件的 SHA-256，也没有触发模型 loader 的完整身份校验。",
    "现有 wheelhouse 只恢复 Windows Python 依赖，不打包模型权重，也不完整重建 FireRed 的 WSL 源码、Python 环境和模型目录；完全断网的新机还必须事先从可信备份保留这些工件，项目当前没有一键生成并验收完整离线恢复包的脚本。",
    "重要录音的 FireRed + Qwen 证据链 smoke 需要指定真实音频并实际核听，本次没有运行；云入口需明确重要录音或质量复核用途及本次上传授权，本轮没有调用。",
    "Git Owner 仍登记一个已合并、干净、无唯一提交的旧 speaker-attribution 工作树。它不影响 main 的产品状态，但在确认没有外部任务依赖前不自动删除。",
    "模型转写、声纹分数、匿名聚类和回执都不能单独证明真实说话人、外部事实或关键语句正确；需要原音频、上下文和人工复核。",
    "VAD 边界切分和质量复核已实现；仍缺代表性独立留出语料的模型提升证据。来源公开短样例不满足默认模型切换的质量门，当前 baseline 不变。"
  ]
});

export const chineseAsrProject = {
  order: 8,
  slug: "chinese-asr",
  usageEntry: "说话打字从 Win+H 小窗开始；已有录音交给 ChineseASR 文件任务入口；已有文案的逐词时间另走对齐入口。",
  usageInputs: ["听写时当前要输入的位置", "文件任务的录音与快看或重要复核的目的", "逐词对齐时已确认的文案和对应音频"],
  title: "ChineseASR",
  route: "/projects/chinese-asr",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "听写、质量复核和文案对齐已实现；个人体验另验",
  cardStatusTone: "mixed",
  ...chineseAsrSnapshot,
  searchAliases: [
    "把中文录音变成可复核文字",
    "录音转写中断以后怎么继续",
    "ASR结果怎样回到原音频复核",
    "转写回执能不能证明内容正确",
    "录音里谁说了哪句话",
    "普通录音会不会被上传",
    "新电脑断网后怎么恢复ChineseASR",
    "模型文件损坏后怎样核对和重建"
  ],
  repositoryNote: "源代码位于 PUBLIC（公开）GitHub（代码托管平台）仓库；模型权重、私人录音、转写结果、声纹向量、云端请求和本机缓存不进入仓库，也不进入本页。",
  summary: "ChineseASR 处理三类事情：对着电脑说话，把文字输入正在编辑的地方；把会议、微信语音等已有录音变成可以阅读和回听核对的文字；给已经确认的旁白文案标出每个词在声音里的时间，方便视频对齐画面。日常输入强调响应速度，重要录音保留两套识别结果和疑点；需要区分发言人时另加时间线与匿名分组，不把声音相似当成身份。",
  why: "录音里有用的信息很难快速查找，手动听写又慢；名字、金额和一句否定词错了，还可能改变整段意思。日常说话打字不需要等两套模型，而要核对的重要录音需要保留原声音、分歧和位置。这个项目把这些需求分开，避免所有声音都走同一条又慢又难解释的流程。",
  plainExample: "“把这段会议录音整理成文字，标出金额、日期和两套识别不一致的地方，让我能点回去听。”交回的是可读转写、疑点位置和原音频关联，不是一份不说明依据的润色稿。只是想说话打字时，按 Win+H 打开单个听写面板即可。",
  result: "说话打字时，文字进入当前可编辑应用，不自动发送。处理文件时，得到转写正文、已有时间位置、两路结果和需要回听的疑点；长任务保留已完成片段。已有文案对齐时，只得到每个词的起止时间与覆盖结果，不重复配音，也不把对齐成功说成文字本身正确。",
  readerStates: {
    "pass": "说话打字会在焦点仍正确时把文字放进当前应用；处理录音则交回可读文字和实际得到的时间位置。重要录音另列两路识别差异和要回听的地方。",
    "problem": "只有部分片段完成、两路不一致或一条识别路线失败时，保留可用结果并标明暂定与复核点，不冒充整段正确。",
    "unavailable": "麦克风、音频、模型或运行环境不可用时说明停在哪一步，沿原任务或固定安装入口接续；不反复重传同一录音，也不自动上传云端。"
  },
  productPrinciples: [
    {
      "title": "本人控制文字落点",
      "detail": "听写只向当时选中的输入位置送文字，不自动润色或发送；焦点改变就停，已经输入的字由本人检查修改。"
    },
    {
      "title": "换默认模型先比真实错误",
      "detail": "同一份参考声音要比较错字、关键内容、静音乱出字、复核负担和耗时；候选在小样本更好，不等于对所有录音更准。"
    },
    {
      "title": "原音频比顺畅文字更可靠",
      "detail": "转写主要帮助找回和回听；流畅、相似或模型一致都不替代关键句的原音核听。"
    },
    {
      "title": "分歧留给人复核",
      "detail": "数字、否定和关键意思有疑点时标出相应声音，不用第三份模型意见或自动润色盖掉原结果。"
    },
    {
      "title": "正文和证据一起交",
      "detail": "结果同时说明用了哪份音频、哪里有时间位置、哪些部分暂定，以及失败后从哪里继续。"
    },
    {
      "title": "长录音能从中断处接上",
      "detail": "只复用与这份原音和当前设置一致的已完成片段，仍要检查整段时间有无漏掉。"
    },
    {
      "title": "安装变化不偷偷改默认路线",
      "detail": "额外模型要明确选择；真正切换默认前保存原设置和回退点，不覆盖后来独立发生的配置变化。"
    },
    {
      "title": "离线恢复要提前备齐",
      "detail": "依赖安装材料和模型文件分别保全；断网后缺哪一层就说哪一层，目录或回执存在不代表真实可用。"
    },
    {
      "title": "云端只在这次明确获准时使用",
      "detail": "普通任务本地优先。重要录音或存疑质量复核要明确选择用途并获得这次上传许可，长度与批量不产生许可。"
    },
    {
      "title": "不同声音不等于真实身份",
      "detail": "匿名发言组、声音线索和现实归属分别说明；相互冲突时保留理由和可撤销的不确定性。"
    },
    {
      "title": "部分成功也要诚实交付",
      "detail": "已完成片段、暂定文字、失败位置与无法运行是不同状态，空白不自动证明原音没说话。"
    },
    {
      "title": "位置、完整与字词正确分开",
      "detail": "文案对齐只给词语时间，文件完整只说明材料未丢；两者都不验证文案逐字正确。"
    }
  ],
  responsibilities: [
    "让本人用一个小面板说话打字，能暂停、取消，并在输入框变动时停止自动输入。",
    "把指定的短语音、长录音或文件夹变成可查询进度的转写任务。",
    "按用途提供快速初稿、重要录音双路核对、可选额外本地模型与现成文案逐词对齐。",
    "保留长录音已完成片段，中断后沿同一录音和设置续作，不因等待结束重复开任务。",
    "把正文、原始识别、时间位置、疑点和恢复状态一同交付，重要内容能回到原音复核。",
    "多人录音先用匿名声音组表示发言，真实身份另取证且允许撤回。",
    "分开维护依赖和模型工件的安装恢复；模型更新先比较同一材料，不因下载完成而换默认路线。",
    "普通录音留在本地；明确选择云端时逐次核对上传授权，运行时协调显卡占用。"
  ],
  exclusions: [
    "转写帮助阅读和回听，不证明录音真实、说话人身份或争议事实。",
    "关键姓名、数字、否定和承诺仍要听原音；两路文字相同也可能一起错。",
    "匿名“说话人1”不会自动变成某个真实人的名字。",
    "源码、离线依赖或模型登记存在，不代表模型文件已经备份、在当前机器装好或真实录音已经验收。",
    "普通录音、文件夹批量或录音较长，都不会自动上传云端。",
    "公开页不放私人录音、转写正文、声音特征、模型权重或密钥。",
    "当前主目标是中文听写、录音复核和文案对齐，不把它描述成通用语音助手或音频剪辑工具。"
  ],
  glossary: [
    { term: "ASR（自动语音识别）", meaning: "把语音信号转换为文字的流程；识别成功不等于文字已被人工核实。" },
    { term: "quick（快速模式）", meaning: "使用单一快速引擎完成普通转写，速度优先，审计和交叉验证较少。" },
    { term: "strict（严格模式）", meaning: "由主引擎和对照引擎分别转写，再保留分歧、风险和复核线索的默认高可靠模式。" },
    { term: "Profile（模型配置档案）", meaning: "把模型身份、版本、运行方式、能力和边界集中登记，避免散落在脚本里。" },
    { term: "Smart API（智能任务接口）", meaning: "先做检查和路由，再把重任务放入本地任务服务；调用方可以查询而不是一直阻塞。" },
    { term: "job（任务记录）", meaning: "一次转写的稳定身份，包含状态、输入、模式、输出和错误；调用超时不等于任务失败。" },
    { term: "job key（任务幂等键）", meaning: "由输入和请求语义生成的稳定指纹，用于复用已验证结果并阻止同一任务重复运行。" },
    { term: "manifest（清单）", meaning: "列出输入、分段、模型、输出、指纹和状态的结构化索引，用于恢复与核对。" },
    { term: "raw JSON（原始模型结果）", meaning: "尽量不改写的模型返回值；它与整理后的正文分开保存，便于追查。" },
    { term: "audit（审计结果）", meaning: "记录模型分歧、静音出字、异常重复、繁体残留、超长无标点等风险信号。" },
    { term: "objective outcome（客观音频结果）", meaning: "把执行是否完成、覆盖是否完整、质量是否足够和是否检测到语音分开表达。" },
    { term: "provisional（暂定结果）", meaning: "仍有可读文本，但主证据引擎失败或证据不完整；不能当成已验证结果。" },
    { term: "arbitration（仲裁）", meaning: "当多路模型结果不同或某一路失败时，按固定规则保留正文、疑似标记和复核队列。" },
    { term: "chunk（音频分段）", meaning: "长音频处理时的一段连续时间区间；所有分段必须覆盖原时间线且不能静默漏段。" },
    { term: "resume（断点续跑）", meaning: "在相同输入、配置和任务清单下复用已完成分段，只补做缺失或失效部分。" },
    { term: "diarization（说话人分离）", meaning: "把不同声音聚为匿名说话人，不直接判断真实姓名。" },
    { term: "person:self（本人声纹档案）", meaning: "仅在本机保存、可替换和可撤销的本人声音向量；它始终是推断线索，不是身份证明。" },
    { term: "held-out（留出样本）", meaning: "未参与建立声纹档案的另一段录音，用来减少拿同一原件自证的风险。" },
    { term: "wheelhouse（离线轮包仓库）", meaning: "按依赖锁提前下载的 Python 安装包集合；用于断网重建环境，不包含 Qwen、FireRed 等模型权重。" },
    { term: "dependency lock（依赖锁）", meaning: "从一套已通过检查的环境冻结出的精确 Python 包版本，并记录 Python 版本；它是构建离线轮包的输入。" },
    { term: "MODEL_RECEIPT（模型回执）", meaning: "绑定固定模型仓库、revision、必要文件路径、字节数和 SHA-256 的清单；漂移会阻止装载，但回执本身不是模型备份。" },
    { term: "evidence receipt（证据回执）", meaning: "把内容文件、大小、指纹、模型身份和状态绑定起来的一致性清单；不是数字签名或可信时间戳。" },
    { term: "GPU broker（图形处理器协调器）", meaning: "按工作类型管理显卡租约：OCR 与 ASR 可并行，Ollama 与两者互斥，同类任务仍串行。共享协调器不等于所有 GPU 工作只能排成一队。" },
    { term: "SecretRef（秘密引用）", meaning: "只引用受管密钥，不把密钥值放进命令、日志、Git 或模型上下文。" },
    { term: "E2E（端到端验证）", meaning: "使用真实音频从入口跑到最终文件并检查用户可见结果；单元测试和 Doctor 不能替代它。" }
  ],
  operatingFlow: [{"title": "先选用途", "detail": "直接听写处理当前一句；已有文件成为可查任务；文案对齐只找词语时间，不重新配音。"}, {"title": "核对输入和运行条件", "detail": "确认文件或麦克风、实际模型及本地环境；重要录音用两路结果对照，长录音保存已完成片段。"}, {"title": "正文与疑点一起交付", "detail": "给转写、时间位置及关键数字、否定句等回听处；匿名说话人不自动变成真实身份。"}, {"title": "从原任务继续", "detail": "模型或环境不可用时保留成果和错误；专业云入口只在本次明确选择并获准上传后使用。"}],
  technicalOperatingFlow: [
    { title: "先分清直接听写还是处理录音", detail: "直接说话打字走独立桌面听写：点好输入框、唤起小窗、录音与停顿输入，焦点冲突时主动复制；不生成文件任务。以下持久任务与证据步骤用于已有录音文件。" },
    { title: "先确认运行环境", detail: "正常任务先核对 Python/CUDA、模型配置和固定回执；新机、断网或环境损坏时先进入安装与恢复路线，不用半残环境直接跑录音。" },
    { title: "再确认输入和目标", detail: "固定音频文件、输入指纹、语言、普通或重要录音、快速或严格模式，以及是否需要时间线和说话人线索。" },
    { title: "做音频预处理和任务去重", detail: "检查格式与可读性，必要时规范为 16 kHz 单声道；根据输入和请求生成 job key，已有相同任务时复用而不重复跑模型。" },
    { title: "选择处理路线", detail: "普通快速任务走 SenseVoice；高可靠任务走 Qwen 主引擎加 SenseVoice 对照；显式需求才选择 FireRed、Paraformer 或专业云入口。" },
    { title: "执行或恢复任务", detail: "短音频进入异步 job；长音频生成连续分段清单，已完成片段在相同身份下可断点续跑。" },
    { title: "生成正文和证据层", detail: "分别保存整理正文、原始结果、审计、指标、objective sidecar（客观结果侧车文件）和 manifest，不让某一层覆盖另一层。" },
    { title: "处理分歧与身份线索", detail: "把模型分歧、疑似幻觉、匿名说话人和 person:self 线索放进可复核结构；证据不足时保持 unknown（未知）。" },
    { title: "交付并说明边界", detail: "返回可打开文件、任务状态、复核清单和恢复入口；环境重建另交付依赖与模型身份检查结果，关键事实仍要求回到原音频核听。" }
  ],
  components: [
    { name: "桌面听写", responsibility: "从指定麦克风采音，用一个可重定位面板控制，并把整句文字送入经过核对的应用焦点。", implementation: "dictation.py、audio/vad/windows 与 dictation_worker.py 使用独立 configs/dictation.yaml；UI、麦克风与原生模型调用隔离，匿名管道内传音频，模型操作有期限和有限恢复，不写录音/正文历史。" },
    { name: "模型 Registry", responsibility: "集中声明引擎、版本、能力、运行方式和默认角色。", implementation: "configs/models.yaml 是唯一配置面；quick/strict 默认和显式 profile 不由脚本临时改写。" },
    { name: "安装与恢复工件", responsibility: "重建 Windows Python/CUDA 环境、固定模型身份和可选 FireRed WSL 运行时。", implementation: "setup/download、wheelhouse 与模型回执继续分层；model_lifecycle.py 增加固定对齐器恢复、显式上游查询、同口径候选比较及 CAS 配置切换/回退，不自动下载升级。" },
    { name: "音频前端", responsibility: "读取、校验和规范音频，为不同引擎提供一致输入。", implementation: "src/zh_asr/audio_frontend.py 负责格式、语音区间和输入身份。" },
    { name: "转写 Pipeline", responsibility: "组织主引擎、对照引擎、降级、文本和状态。", implementation: "src/zh_asr/pipeline.py 与 adapters 组合模型，不把某个模型写死为全部场景。" },
    { name: "Smart API 与 job 服务", responsibility: "异步提交、状态查询、期限、取消和复用。", implementation: "src/zh_asr/service.py 加 scripts/asr-smart.ps1；调用方短等待，重任务继续由本地服务监管。" },
    { name: "长音频引擎", responsibility: "连续切片、manifest、分段状态和断点续跑。", implementation: "long_audio.py 按 VAD 附近边界切片但保留原完整时间线，实际上下文重叠计入各模型长度上限；身份包含代码、模型锁、配置、输入和调用绑定，旧分段不能静默混用。" },
    { name: "批量转写", responsibility: "按文件组织任务并复用已加载模型。", implementation: "src/zh_asr/batch.py 与 transcribe-folder.ps1 避免每个文件重复冷启动。" },
    { name: "审计与风险规则", responsibility: "检测分歧、静音出字、模板废话、重复和格式异常。", implementation: "audit、risk_rules、strict_writer 保留原文；quality.review.json/html 增加带上下文音频的分歧复核，SenseVoice 仅在不是现有两路且确有待核片段时补听，不改写 raw 或成为第三票。" },
    { name: "客观结果 Sidecar", responsibility: "把执行、覆盖、质量与语音结果分开。", implementation: "audio_outcome.py 生成结构化 sidecar，避免空文本直接被解释为无语音。" },
    { name: "说话人证据", responsibility: "提供匿名聚类、时间线和有边界的本人声音线索。", implementation: "speaker_evidence.py 与 speaker_attribution.py 组合声学、声道和调用方上下文；方向一致可推断，声学冲突可由具体一致的上下文解释，无法消解才 unknown。结果不升为身份确认。" },
    { name: "证据回执", responsibility: "绑定内容文件、指纹、大小、引擎身份和状态。", implementation: "result_writer.py 与 metadata.py 生成自包含一致性清单，但不冒充外部签名。" },
    { name: "GPU 与进程控制", responsibility: "防止重模型互抢资源，并回收超时或失联进程。", implementation: "短租约绑定模型 worker 的 PID 与创建时间，默认 120 秒、20 秒续期；监督进程消失时仅回收该任务模型/WSL 子进程，正常退出不误报租约丢失，不用重启调度器抢占合法任务。" },
    { name: "专业云入口", responsibility: "为明确的重要录音或已选定的存疑本地转写提供一次受控云候选。", implementation: "asr-professional-cloud.ps1 要求 Important / QualityReview 用途二选一及 CloudUploadAuthorized，密钥由 SecretRef 注入固定 worker。" },
    {
      "name": "已知文案对齐",
      "responsibility": "给现成音频和已确认文字定位逐词时间，供视频等消费者复用。",
      "implementation": "alignment-info 为只读元数据；align 沿用音频前处理、Qwen固定对齐器和受监督worker，完整覆盖与输入双重哈希通过后才原子交付，不做词汇真实性认证。"
    },
  ],
  usageExamples: [
  {
    "moduleSlug": "desktop-dictation",
    "ask": "我想直接对电脑说话，把这段话打进当前文档。",
    "effect": "打开单个听写面板，用Qwen识别；可以开始、暂停和取消尚未输入的片段。不会自动发送，已经输入的内容也不会被取消键倒退删除。"
  },
  {
    "moduleSlug": "task-routing",
    "ask": "把这条微信语音转成文字，先给我能快速读的初稿。",
    "effect": "按明确语音文件使用快速路线；需要更严谨核对时再走双模型，不把单路初稿说成已复核。"
  },
  {
    "moduleSlug": "models-modes",
    "ask": "这次更看重核对准确性，告诉我用了哪两个模型。",
    "effect": "默认文件路线为Qwen3-ASR与SenseVoice，分别保留结果和分歧；选择更重模型时明确使用哪条路线，不悄悄替换。"
  },
  {
    "moduleSlug": "long-batch",
    "ask": "这场会议很长，中断了别从头重跑。",
    "effect": "连续时间位置与已完成片段保留，恢复只处理未完成部分；文件夹任务逐项报告结果，不用某一文件成功掩盖其他失败。"
  },
  {
    "moduleSlug": "audit-evidence",
    "ask": "把金额、日期和两份结果说法不同的位置挑出来，让我回听。",
    "effect": "保留未经擅自改写的识别结果和相应声音位置，人工确认才能解决关键分歧；高置信度不等于听审完成。"
  },
  {
    "moduleSlug": "speaker-attribution",
    "ask": "这段讨论大概有几种声音，各自说了什么？",
    "effect": "给匿名分组和时间线；同一声音的归属可以后续修正，但不会仅凭聚类自动认定真实姓名。"
  },
  {
    "moduleSlug": "known-text-alignment",
    "ask": "旁白已经录好，文案也确认了，帮我找出每个词的时间。",
    "effect": "只运行强制对齐，返回词和起止时间；输入变化、覆盖不足或超时保留上一份成功输出，不重新配音。"
  },
  {
    "moduleSlug": "installation-recovery",
    "ask": "准备换识别模型，先比较；新版本不好就回到旧版。",
    "effect": "模型和环境先作为候选验证，再明确切换；旧工件与可用环境保留，下载完成不能代替质量验收。"
  },
  {
    "moduleSlug": "runtime-privacy",
    "ask": "这段录音只在本机处理，不要上传。",
    "effect": "使用满足条件的本地路线；资源或依赖不足时如实停止，不静默上传或换成未授权模型。"
  }
],
  evidenceLayers: [
    { layer: "听写部署与公开样本", proves: "本轮 13:30 UTC 只读确认任务 Running、开始菜单和图标归属正确；9 月 17 日来源公开音频验收另含单模型听写与有界异常恢复。", doesNotProve: "DJI Mic Mini 已连接、个人口音准确率、真实按键输入已验收、零延迟或整体端到端耗时。" },
    { layer: "Source（源码层）", proves: "当前 main 中实际存在的模型路由、任务、审计、边界和测试实现。", doesNotProve: "本机已经安装、服务正在运行或真实录音效果正确。" },
    { layer: "Unit tests（单元测试层）", proves: "9 月 17 日来源全套执行 482 项，0 失败/错误，1 个可选中文 VAD fixture 跳过；本轮未重跑。旧 376、33、45 项保留各自日期，不累加作覆盖规模。", doesNotProve: "真实 GPU 模型加载、音频质量、端到端耗时和人工听感。" },
    { layer: "Doctor（环境体检层）", proves: "本轮只读 alignment-info 识别到固定 Qwen3-ForcedAligner 目录、工件存在与 300 秒上限；其余 GPU/环境沿原观察，不把文件存在说成此次模型加载成功。", doesNotProve: "每个 profile 都完成真实推理，也不证明服务没有运行期故障。" },
    { layer: "Dependency artifacts（依赖工件层）", proves: "requirements lock、wheelhouse checksum 和离线安装可把一套 Windows Python 依赖重建并通过 pip check/Doctor。", doesNotProve: "模型权重、FireRed WSL 或真实录音推理可用；当前本机也尚未生成这套离线包。" },
    { layer: "Model receipt（模型回执层）", proves: "固定仓库/revision 下必要模型文件的路径、大小与 SHA-256 可逐项核对。", doesNotProve: "权重已被备份、GPU 能装载、输出准确或完整 ASR 场景通过。" },
    { layer: "Runtime smoke（运行冒烟层）", proves: "9 月 17 日来源真实公开音频覆盖 high_quality 短样例、42 秒两片、FireRed+Qwen、强制对齐、正常 Smart/API 以及监督进程异常后的 worker/租约回收。", doesNotProve: "对任意录音准确，或所有重要语句已经人工核听。" },
    { layer: "Historical real E2E（历史真实端到端）", proves: "超过 40 秒中文电话录音的四切片 FireRed + Qwen 路线曾全部 verified，续跑复用了四段结果。", doesNotProve: "本轮模型、任意私人录音或每个字仍然正确。" },
    { layer: "Content receipt（内容回执层）", proves: "输入、模型、输出文件、指纹和状态在一个结果包内一致。", doesNotProve: "外部真实性、可信时间戳、说话人身份或文字事实正确。" },
    { layer: "Benchmark（基准评测层）", proves: "固定语料和 truth（人工真值）下的字错率、风险和模型对比。", doesNotProve: "用户下一段录音具有相同声学条件和准确率。" },
    { layer: "Human review（人工复核层）", proves: "关键片段已回到原音频核听并被人确认。", doesNotProve: "未听部分或不同原件也正确。" }
  ],
  evolution: [
    {
      "date": "2026-07–08",
      "commit": "",
      "title": "先让已有录音变成可追溯的文字",
      "result": "先形成本地单文件、双模型核对、批量和长录音续作，再补齐离线环境准备与有界任务观察；重要录音的云端增强须明确选择和上传许可，识别为空也不能当成没有说话。",
      "evidence": [
        {
          "date": "2026-07-06",
          "note": "本地转写、双模型、异步任务、长音频续作和离线依赖形成；模型权重单独保全。",
          "commit": "a280a54–ad37f35"
        },
        {
          "date": "2026-07-08—07-25",
          "note": "资源协调与有界任务观察。",
          "commit": "89d0cd2–282989a"
        },
        {
          "date": "2026-07-29—08-02",
          "note": "FireRed本地路线及独立授权的云端候选。",
          "commit": "c788100–eeb41d0"
        },
        {
          "date": "2026-08-09—08-17",
          "note": "空文本按执行、覆盖与质量分开解释。",
          "commit": "a2c0b2b–b596098"
        },
        {
          "date": "2026-08-21",
          "note": "批量复用已加载模型，同时保留逐文件失败边界。",
          "commit": "07516fa"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "commit": "",
      "title": "把日常说话打字与文件复核分开",
      "result": "日常输入采用单Qwen减少等待，文件保持可复核路线；匿名声音分组与可撤销归属单独处理，不把声音特征当身份证明。",
      "evidence": [
        {
          "date": "2026-08-24",
          "note": "匿名声音、可撤销本人线索和来源上下文分开，单声道歧义不强认身份。",
          "commit": "fe11e0c–cfcc7a7"
        },
        {
          "date": "2026-08-27—08-28",
          "note": "任务、缓存与说话人证据回读形成更明确的失败边界。",
          "commit": "7bd1dd4–8792432"
        },
        {
          "date": "2026-08-30—08-31",
          "note": "读取证据时再次核对目标音频，变化则停止，避免证据错配。",
          "commit": "70e3255"
        }
      ]
    },
    {
      "date": "2026-09-17",
      "commit": "",
      "title": "能回听问题，也能安全换模型",
      "result": "长录音按片段保留进度，疑点对应原声音；候选先比较再激活，旧版本可回退。听写统一为一个小面板，并给准备、识别和恢复设置实际期限。",
      "evidence": [
        {
          "date": "2026-09-17",
          "note": "当前候选已保留模型生命周期与质量维护的来源描述；未提供独立阶段提交编号，真实模型与听写验收仍按技术层各自证据。"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "commit": "ed060fa · 已知文案对齐入口",
      "title": "已有旁白不必再识别或重新配音",
      "result": "给视频等调用方提供独立对齐：输入确认文案和已有音频，返回词级时间，复用ASR模型管理；对齐仍不证明文案逐字正确。"
    }
  ],
  operationalEntrypoints: [
    { name: "桌面听写安装与生命周期", command: "scripts\\dictation.ps1 -Mode Install / Status / Stop / Start / Uninstall", purpose: "Install 安装听写依赖、登记登录自启并立即启动；Status 读状态；Stop/Start 停启；Uninstall 移除登录自启但保留项目和模型。运行中接管 Win+H，退出或托盘暂停快捷键后交还系统行为。" },
    { name: "环境体检", command: "E:\\Projects\\Tools\\ChineseASR\\scripts\\doctor.ps1", purpose: "检查代理、GPU、模型配置、依赖和缓存入口，不运行完整转写。" },
    { name: "在线安装与固定模型下载", command: "scripts\\install-torch-cu128-direct.ps1 → setup-core.ps1 / setup-qwen.ps1 / setup-firered.ps1 → download-models.ps1 -Engine <engine>", purpose: "建立 Windows 核心环境与可选 FireRed WSL，并按固定 revision 下载模型；下载成功仍须后续 smoke。" },
    { name: "构建离线依赖工件", command: "scripts\\export-lock.ps1 → build-wheelhouse.ps1 → verify-wheelhouse.ps1", purpose: "在联网且已验证的环境中冻结依赖、下载 wheel 并生成校验清单；不包含模型权重。" },
    { name: "离线重建 Windows 环境", command: "scripts\\install-offline.ps1 -Venv .venv-offline-smoke", purpose: "校验 wheelhouse 后无索引安装、pip check 并运行 Doctor；仍需单独恢复模型/FireRed 工件并跑真实 smoke。" },
    { name: "日常智能转写", command: "scripts\\asr-smart.ps1 -Audio <file> -Mode strict -WaitSec 15 -Json", purpose: "提交本地严格任务并返回 job 状态，适合作为 AI 和脚本的默认入口。" },
    { name: "长音频严格模式", command: "scripts\\asr-smart.ps1 -Audio <file> -Mode long-strict -WaitSec 15 -Json", purpose: "按连续时间线分段并支持相同身份下断点续跑。" },
    { name: "文件夹批量", command: "scripts\\transcribe-folder.ps1 -InputDir <folder>", purpose: "复用模型处理多个文件，每个文件保留独立结果和失败状态。" },
    { name: "默认端到端冒烟", command: "scripts\\smoke-asr-smart.ps1 -Json", purpose: "使用固定真实样本验证 strict 入口到最终文件；会实际运行本地模型。" },
    { name: "只读已有转写", command: "python -B -m zh_asr transcript-readback --audio-sha256 <原音SHA-256>", purpose: "复用完成态本地任务和保留云结果；不读原音、不启模型，云块时间与质量 Unknown 分开表达。" },
    { name: "存疑转写云质量复核", command: "scripts\\asr-professional-cloud.ps1 -Audio <已选录音> -QualityReview -CloudUploadAuthorized -Json", purpose: "仅当前选定的存疑本地转写及本次上传授权成立时调用，与 -Important 互斥，不自动启动本地双引擎。" },
    { name: "证据级冒烟", command: "scripts\\smoke-evidence-asr.ps1 -Audio <file> -Json", purpose: "验证 FireRed + Qwen 每个分段及证据回执，需要指定重要录音并人工核听。" },
    { name: "全量单元测试", command: ".venv\\Scripts\\python.exe -m unittest discover -s tests -q", purpose: "验证不依赖真实重模型的逻辑、结构、失败路径和回归。" }
  ],
  "kicker": "说话打字、录音转文字，以及给旁白找准时间",
  "readerBoundary": "本地识别和文案对齐已有实现；Whisper仍是配置占位。关键名字、数字和承诺需要回听；云端上传须单独授权，真实个人听写体验与各模型实测按技术层分别说明。",
  "operatingChoices": {
    "title": "按这次声音任务选路线",
    "intro": "先看要打字、快速看内容、核对重要录音，还是给现成文案找时间。括号内是当前配置的模型身份；它们各有用途，不是效果排行榜，本页没有重新加载全部模型作实测。",
    "rows": [
      {
        "need": "对电脑说话直接打字",
        "choice": "本地单模型听写（Qwen3-ASR-1.7B）",
        "result": "尽快把一句话放进当前输入位置。",
        "boundary": "焦点变了会停下；不自动润色或发送。"
      },
      {
        "need": "先快速知道录音讲什么",
        "choice": "快速本地初稿（SenseVoiceSmall）",
        "result": "先取得一份可阅读的文字。",
        "boundary": "只有一路结果，不等于重要内容已复核。"
      },
      {
        "need": "会议或重要录音需要核对",
        "choice": "两路本地识别（Qwen3-ASR-1.7B 与 SenseVoiceSmall）",
        "result": "交回两份结果、分歧与回听位置。",
        "boundary": "两路相同也要回听关键姓名、金额和否定句。"
      },
      {
        "need": "明确要更强的本地对照",
        "choice": "另选 FireRedASR2-LLM 与 Qwen 对照",
        "result": "保留这次额外路线自己的识别结果。",
        "boundary": "要明确选择且依赖可用；不会自动接管日常路线。"
      },
      {
        "need": "明确比较另一中文模型",
        "choice": "可选 Fun-ASR-Nano-2512",
        "result": "取得该模型独立的转写用于这次比较。",
        "boundary": "安装或模型名不会自行改变默认路线。"
      },
      {
        "need": "找句子时间并区分不同声音",
        "choice": "时间与匿名发言分组（Paraformer，必要时加 CAM++ 线索）",
        "result": "得到句子位置和不同声音的匿名分组。",
        "boundary": "说话人编号不是已确认人名，归属可撤回。"
      },
      {
        "need": "已有旁白和确认文案，只需词语秒数",
        "choice": "已知文案对齐（Qwen3-ForcedAligner-0.6B）",
        "result": "返回词语在录音中的起止时间。",
        "boundary": "不重新配音或核对文案真假；单段当前不超过五分钟。"
      },
      {
        "need": "本地不足，考虑一次云端识别",
        "choice": "独立云候选（Qwen Audio 3.0 ASR Flash）",
        "result": "在明确用途和这次上传授权下取得云结果。",
        "boundary": "录音更长或两路有分歧，都不会自动授权上传。"
      },
      {
        "need": "想用 Whisper Large V3",
        "choice": "目前只是登记的配置",
        "result": "明确告知现在无法直接运行。",
        "boundary": "它不是本地失败后的自动备用。"
      }
    ]
  },
};

export const chineseAsrModules = [
  {
    "slug": "desktop-dictation",
    usageEntry: "点好要输入的文本框，用 Win+H 唤起听写小窗。",
    usageInputs: ["当前可编辑位置", "要口述的句子"],
    productFlow: [{"title": "系统核对并处理", "detail": "小窗收这一句，停顿后由本地单模型识别；输入前再看焦点，焦点变化则停下并保留最近文本供主动复制。"}, {"title": "交付与接续", "detail": "得到编辑框文字，不自动发送；取消只丢尚未输入片段，已输入内容不会撤销。"}],
    "readerStatus": "听写已有公开音频运行与故障恢复证据；本轮只检查入口，个人麦克风、口音和文字上屏体验没有重新测试。",
    "shortTitle": "说话打字",
    "title": "对电脑说话，直接把文字输入当前应用",
    "searchAliases": [
      "Win+H语音输入怎么用",
      "Ctrl+Win+H",
      "中文听写开始菜单",
      "听写时切换窗口会不会输错",
      "Esc会撤销已经输入的文字吗",
      "DJI麦克风不支持16kHz",
      "听写面板优先VDD否则主屏",
      "听写暂停后释放显存"
    ],
    "searchProjection": {
      "intents": [
        "在Windows输入框说话打字",
        "从开始菜单唤起已有听写小窗",
        "切换麦克风并继续听写",
        "暂停听写并取回最近文字"
      ],
      "entities": [
        "Win+H",
        "Ctrl+Win+H",
        "DJI Mic Mini",
        "Qwen3-ASR-1.7B",
        "PHLC34B",
        "MTT1337",
        "ChineseASR Dictation"
      ],
      "relations": [
        "一个面板优先MTT1337否则PHLC34B",
        "停顿后整句识别再核对原输入焦点",
        "暂停保留内存模型并释放GPU租约"
      ],
      "failureRecovery": [
        "焦点改变时停止自动输入并保留主动复制",
        "指定麦克风缺席时不换另一设备",
        "Esc取消未输入部分且保留已输入文字",
        "停止或退出后沿同一入口重新启动，不恢复旧录音历史"
      ]
    },
    "teaser": "停顿后把整句文字放进原输入框；面板只显示一份，模型卡住有期限和恢复，换焦点或取消不把迟到文字塞进别处。",
    "status": "本轮只读任务与入口匹配；来源已验单模型公开音频和有界恢复，个人麦克风体验未重验",
    "statusTone": "mixed",
    "value": "用一个小面板控制开始、暂停和取消，让说话变成当前文档里的文字；单Qwen识别，不等待文件复核的第二套模型。",
    "why": "说话打字最怕文字落进另一个窗口、麦克风被悄悄切换，或点了收起却仍在录音。这个入口将显示、采音、识别和输入落点分开，让本人能随时暂停和取消；它不为追求顺口而自动润色或回车发送。",
    "example": "“这段邮件我想口述，识别好先放进编辑框，不要发送。”在当前编辑位置启动听写，文字分段输入；窗口焦点变了就停止后续输入，自己检查后再决定发送。",
    "result": "得到当前应用中的文字和面板状态；取消只丢弃尚未提交的片段，不能撤销已经输入的字。",
    "readerStates": {
      "pass": "录音按钮变绿表示正在采音；有效语句识别完成、原焦点仍合适时输入整句文字。本人控制下一段、暂停和最后发送。",
      "problem": "焦点变化或管理员窗口拒绝输入时停止自动输入，保留托盘复制入口；Esc取消未输入内容，已输入部分继续留在应用里。",
      "unavailable": "指定麦克风缺席、采音丢帧、模型或GPU资源不可用时显示具体问题，不改用另一麦克风或云端，不把空识别和坏声音送进输入框。"
    },
    "decisionImpact": [
      "开始菜单“中文听写”通知同一个托盘进程，已有实例时不会再开一份。",
      "麦克风按钮只切录音与暂停；×隐藏并暂停、继续完成尾句；托盘退出才真正结束程序。",
      "录音和最近文本只留内存，主动复制才写剪贴板；需要持久文件、逐段审计或恢复历史时使用文件转写路线。",
      "登录预载模型不自动开麦；暂停保留内存模型但释放显存及租约，再次唤起仍须等待实际资源就绪。",
      "单个Qwen3-ASR-1.7B用于听写，不改变文件quick/strict的模型选择，不承诺逐字流式或固定端到端延迟。",
      "模型准备、GPU被合法文件任务占用和指定麦克风断开分别显示；等待保留内存音频，可Esc取消，不能为掩盖争用抢租约或偷偷切换设备。",
    ],
    "problem": "防止永久停在准备中、模型调用拖住界面、迟到文字进入错误焦点、缺设备误录别的麦克风，以及收起后无意继续录音。",
    "implementation": [
      "桌面入口 scripts/dictation.ps1 维护独立托盘进程，不进入文件 Smart API 的 job 队列；dictation.py 组织采音、分句、推理与取消，dictation_audio.py 处理输入设备，dictation_windows.py 维护 Win+H/Esc、焦点检查和文字注入。开始菜单中文听写.lnk经Start-Dictation.vbs隐藏调用Start；已运行时用同会话Start事件通知原窗口执行快捷键同一动作，未运行时由现有任务启动并最多等待30秒，不另建实例。",
      "configs/dictation.yaml：16 kHz、silence_ms=600、min_speech_ms=240、max_chunk_sec=20；默认指定 DJI Mic Mini，input_device: null 才跟随 Windows 默认输入。hotwords 当前为空，避免不清晰声音触发术语复读；轻量 WebRTC VAD（语音活动检测）保留语句前后缓冲，无有效语音或空识别时不输入。",
      "dictation_windows.py 当前面板为 200×75 实际像素；优先 MTT1337 VDD，缺席时用 PHLC34B 物理主屏，只保留一份面板并在显示变化时重定位。旧图层素材自身的 160×60 不代表实际窗口大小。",
      "麦克风按钮只切录音/暂停，×隐藏并暂停且完成尾句；小箭头或右键显示设备刷新和复制入口。登录只预载内存，不自动开麦；暂停保留内存模型并释放 GPU，真正退出才释放模型。",
      "设备菜单随 DPI 缩放，主面板按实际像素固定；选定麦克风下次录音重新枚举，缺设备不改用另一麦克风。本机 preferences.json 保存选择，不修改 Windows 默认设备。若同一设备不接受16kHz，尝试它报告的原生采样率；按实际采样率分句，再用resample_poly把完整语句转成模型要求的16kHz。采音丢帧或采样率未准备好时取消尚未输入内容，不把坏声音当成功。",
      "听写直接使用Qwen3-ASR-1.7B，不做双模型等待或LLM润色；模型预载内存，录音推理时通过LocalGpuBroker申请ASR租约，暂停将模型放回内存并释放显存。",
      "音频和最近文本不保存为历史；outputs/dictation/runtime.log仅记录错误、耗时和字数，preferences.json只保存本机麦克风选择。",
      "scripts/dictation.ps1的Install安装依赖、创建ChineseASR Dictation登录任务并启动；Status只读状态，Start/Stop控制现有进程，Uninstall移除登录自启但保留项目和模型。",
      "dictation_worker.py 把原生模型调用放入常驻受监督子进程，匿名管道传内存音频；加载180秒、操作60秒、预热40秒、停车20秒。启动最多恢复一次，未返回的一句确认进程已退出后最多重试一次；预热超时重载但不重复预热，反复失败转为可操作错误。",
    ],
    "flow": [
      "本人点好输入框，从快捷键或开始菜单唤起同一听写进程。",
      "重新枚举指定麦克风；设备支持时以16kHz采音，否则使用同设备原生采样率，再把整句转为16kHz。",
      "在当前选定的一个屏上显示 200×75 面板；采音留内存，VAD 判断有效语句，不重复开两套控制窗。",
      "约600ms停顿、20秒上限或手动暂停后，以单个Qwen模型识别整句。",
      "输入前再次核对焦点与取消状态；不合适就停下自动输入，保留最近完整文本供主动复制。",
      "暂停或隐藏后停录并处理允许的尾句，释放显存；退出结束程序并交还快捷键，下一次重新开始。"
    ],
    "concepts": [
      {
        "term": "VAD（语音活动检测）",
        "explanation": "判断这一段是否含有效语音，保留句内及前后缓冲；无语音或空识别不会输入文字。"
      },
      {
        "term": "原生采样率",
        "explanation": "麦克风实际支持的采音频率；同设备不接受16kHz时先按支持值录制，再转换完整语句。"
      },
      {
        "term": "单面板的显示选择",
        "explanation": "MTT1337 已接入时优先显示，否则回到 PHLC34B 物理主屏；这是同一次听写的唯一控制窗，不是双屏并行录音。"
      },
      {
        "term": "最近完整文本",
        "explanation": "只为本次主动复制保留在内存中的识别结果，不是跨退出保存的聊天或录音档案。"
      }
    ],
    "boundaries": [
      "默认指定DJI Mic Mini，input_device=null才跟随Windows默认输入；没有设备时不静默换麦。",
      "尚无逐字流式输出，不做自动润色、双模型复核或自动发送。",
      "×隐藏并暂停与退出程序不同；Esc不撤销已经送进应用的文字。",
      "两个显示器按硬件型号而非DISPLAY编号选择，未接入目标不显示；这不改变显示拓扑。",
      "9月9日DJI端点被枚举到不等于已经开麦、验证个人口音或测得按键到上屏延迟。"
    ],
    "failures": [
      {
        "condition": "听写焦点变化或管理员窗口拒绝输入",
        "response": "停止自动输入，不把迟到文字送到新焦点；通过托盘主动复制最近文本，再由本人选择粘贴位置。"
      },
      {
        "condition": "听写按 Esc 或退出",
        "response": "取消尚未输入部分并停麦克风，已输入文字保留；退出交还系统 Win+H。"
      },
      {
        "condition": "指定麦克风未连接",
        "response": "提示连接指定设备，不切换到其他麦克风；检查配置或连接后再开始。"
      },
      {
        "condition": "同一麦克风不接受16kHz",
        "response": "尝试该设备报告的原生采样率，再转换整句；采音丢帧或采样率未准备好时取消未输入内容。"
      },
      {
        "condition": "模型或GPU租约不可用",
        "response": "保留明确错误和当前控制入口，不绕过显卡协调器、换模型或上传云端。"
      },
      {
        "condition": "屏幕接回、断开或分辨率改变",
        "response": "按硬件型号重新定位目标小窗，同一次录音与选择继续共享；未接入的目标不显示。"
      },
      {
        "condition": "真正退出或程序中断",
        "response": "结束本次内存会话；沿Start或开始菜单重开，旧录音和文字没有可恢复的文件任务记录。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\scripts\\dictation.ps1",
        "role": "听写安装、自启动与停启状态"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\dictation.py",
        "role": "采音分句、推理、焦点保护与取消"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\dictation_windows.py",
        "role": "Windows 快捷键、托盘与文字注入"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\configs\\dictation.yaml",
        "role": "独立听写模型、指定设备、分句与单面板显示优先级"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\dictation_audio.py",
        "role": "设备枚举、采音、原生采样率与重采样"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\dictation_vad.py",
        "role": "有效语音检测与缓冲"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\tests\\test_dictation_windows.py",
        "role": "输入保护、单面板重定位与控制回归"
      }
    ],
    "verification": [
      "PUBLIC main=12eb64e93586b8fce8a4d2b9750c4d097b78ae5a，本次只读远端回读仍同值；新增网页模块不代表新增源码能力。",
      "2026-09-09原观察：ChineseASR Dictation已安装且Running，开始菜单中文听写.lnk目标与图标匹配，DJI输入端点可枚举；未打开麦克风。",
      "2026-09-09三个听写测试模块45项通过、1.225秒；9月7日71通过/1跳过、9月5日完整376项及公开短音频各保留原日期，不叠加为新全套。",
      "个人口音、DJI 麦克风采音、真实快捷键、200×75 实际桌面位置、焦点切换与管理员窗口输入，本轮均未重验；任务 Running 和来源测试不替代使用结果。"
    ],
    "relation": "桌面听写负责实时采音和应用输入；文件入口与任务模块负责已有录音、持久任务和文件结果。二者复用已有模型适配器与GPU协调，但输入、输出和恢复生命周期分别验收。"
  },
  {
    "slug": "task-routing",
    usageEntry: "把已有录音文件交给 ChineseASR，并按同一任务查看进度。",
    usageInputs: ["要转写的音频或文件夹", "快看或重要复核等用途"],
    productFlow: [{"title": "系统核对并处理", "detail": "核对音频与请求，同一任务复用身份；短音频等待结果，长音频复用已验片段。"}, {"title": "交付与接续", "detail": "交回状态和输出位置；本次等待结束不等于任务超时，服务重启后的失败须明确重试。"}],
    "readerStatus": "已有录音任务提交、进度查询、取消与结果复用功能；能否成功转写仍要看这份录音和本次实际结果。",
    "shortTitle": "入口与任务",
    "title": "录音文件入口与可恢复任务",
    "searchAliases": [
      "服务重启后录音任务会自动重跑吗",
      "ASR任务中断后去哪看",
      "长录音重试会不会换输出目录",
      "同一个录音为什么没有重复跑",
      "转写任务超时要不要重新提交"
    ],
    "searchProjection": {
      "intents": [
        "提交一段录音并稍后查进度",
        "恢复中断的转写任务",
        "判断超时后是否应该重提",
        "取消一条仍在运行的任务"
      ],
      "entities": [
        "Smart API",
        "job id",
        "jobs.json",
        "request fingerprint",
        "稳定输出目录"
      ],
      "relations": [
        "音频内容 SHA-256 与请求语义生成 fingerprint",
        "fingerprint 绑定 job key 和长音频恢复目录",
        "持久任务历史记录终态但不恢复可执行队列"
      ],
      "failureRecovery": [
        "服务重启把未完成任务标成 service_restarted",
        "interrupted 任务不自动重跑",
        "长音频失败或取消后显式重试复用原目录",
        "等待超时先查原 job 而不是再提交"
      ]
    },
    "teaser": "已有录音把提交、查进度、取消、超时和服务重启后的续作收进同一任务入口，避免因为等得久就把一段大录音重复跑好几份。",
    "status": "文件 Smart API（智能任务接口）、任务生命周期和缓存完整性保留既有证据；真实转写仍按具体输入验收",
    "statusTone": "mixed",
    "value": "已有短语音、长录音或文件夹先返回稳定任务身份，后续按同一项查进度、恢复或取消，不因等待超时另开重复任务。桌面听写有独立的小窗和输入流程，不进入这里的文件任务队列。",
    "why": "录音处理可能需要几分钟；如果一次等待结束就重交同一文件，会有两份任务抢资源、覆盖结果。项目先保存这次任务，再让人按原任务查进度。",
    "example": "比如我问“服务重启后，这段录音会不会自己重新跑？”系统会明确告诉我：原来排队或运行中的任务会留下“服务已重启”的失败终态，不会在后台偷偷复活。我确认需要继续后再显式重试，新任务仍按同一音频内容与请求指纹找到稳定输出目录，并复用长音频里已经验证有效的分段。",
    "result": "得到这段录音当前在等、在跑、已完成还是失败，以及已经生成的文件和继续入口。服务重启不会偷偷重跑；本次等待超时也不代表底层任务已结束。",
    "readerStates": {
      "pass": "录音和服务可用时返回一个可继续查询的任务，完成后交回正文及对应证据。",
      "problem": "等待结束时先查原任务；任务本身失败则保留真实错误和已完成部分。",
      "unavailable": "音频、服务或指定模型无法启动时说明原因，不生成假任务，也不暗换另一模型。"
    },
    "decisionImpact": [
      "先查询任务状态，再决定等待、恢复或重新提交。",
      "request fingerprint（请求指纹）包含音频内容 SHA-256 与请求语义；只改修改时间不改变它，内容改变即使大小和时间相同也会改变它。",
      "相同输入和请求复用验证过的结果；输入内容、模型或请求身份改变时必须新建任务。",
      "客户端 Timeout（等待超时）与服务端失败分开表达。",
      "terminal（终态）任务写入持久历史；重启时未完成记录被标成 interrupted / service_restarted，不自动重新排队。",
      "long-strict 失败或取消后的显式重试产生新 job id，但复用同一稳定输出目录，让 manifest 验证后只补缺失分段。",
      "取消、期限和租约丢失会回收完整子进程树。",
      "外部观察只返回有界状态，不公开私人正文或内部目录扫描结果。"
    ],
    "problem": "解决重模型任务阻塞调用方、重复提交、任务身份丢失、缓存错配、调用端超时被误判为服务端失败，以及后台进程失联后无法恢复的问题。",
    "implementation": [
      "scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待。",
      "src/zh_asr/service.py 维护 job 状态、队列、期限、状态查询与 observer projection。",
      "job key 绑定音频绝对路径、内容 SHA-256、模式、已解析引擎、模型配置、设备、切片参数和调用方绑定，缓存命中前验证关键制品。",
      "jobs.json 持久化有界任务历史；服务启动时保留已完成终态，把遗留 queued / running 记录转换为明确的 service_restarted 失败。",
      "long-strict 输出目录由稳定 request fingerprint 派生；失败或取消后的显式重试不会换目录，旧 manifest 和收据仍须重新验证。",
      "process_control.py 维护子进程树和终止边界，避免只结束父进程留下 GPU worker。",
      "状态投影不反射调用方任意标识，也不暴露提示、音频或转写正文。"
    ],
    "flow": [
      "规范并验证输入路径，计算输入身份和请求语义。",
      "检查服务健康和当前活跃任务，不以进程名代替 job 状态。",
      "计算 job key；命中已验证完成结果时返回 cache hit。",
      "未命中则先把新 job 写入持久任务历史，再启动对应 CLI 子进程。",
      "调用方在 WaitSec 内轮询，超时只返回 job 身份。",
      "服务持续监管期限、取消和子进程退出。",
      "完成后校验输出并把状态原子更新为 succeeded、failed、canceled 或 blocked。",
      "若服务重启，回读终态供查询；遗留未完成记录只标 interrupted，不恢复执行，长音频必须由调用方显式重试后在稳定目录内续跑。"
    ],
    "concepts": [
      {
        "term": "Smart API",
        "explanation": "把预检、任务提交、短等待和状态观察组合成一个稳定入口。"
      },
      {
        "term": "job key",
        "explanation": "绑定输入与请求语义的幂等键，防止同一重任务重复运行。"
      },
      {
        "term": "request fingerprint（请求指纹）",
        "explanation": "由音频内容 SHA-256、模型与请求参数等组成；不是只看文件大小或修改时间。"
      },
      {
        "term": "terminal history（终态历史）",
        "explanation": "把 succeeded、failed、canceled、blocked 等任务保存到 jobs.json 供重启后查询，但不把旧队列重新执行。"
      },
      {
        "term": "stable recovery directory（稳定恢复目录）",
        "explanation": "long-strict 按请求指纹固定的输出目录；显式重试可验证并复用其中已完成分段。"
      },
      {
        "term": "observer projection",
        "explanation": "只返回上层决策所需状态，不暴露私人正文和内部实现细节。"
      },
      {
        "term": "lease（租约）",
        "explanation": "证明当前 worker 仍拥有任务的短时状态；丢失后不能继续写结果。"
      }
    ],
    "boundaries": [
      "只监听本机回环地址，不作为带认证的远程服务。",
      "cache hit 只复用相同输入与请求的已验证制品。",
      "调用端超时不自动复制任务。",
      "状态接口不返回私人转写正文或声纹数据。"
    ],
    "failures": [
      {
        "condition": "客户端等待超时",
        "response": "返回 job id 和查询入口；先读任务状态，不立即重发。"
      },
      {
        "condition": "服务在 queued 或 running 时重启",
        "response": "持久记录转成 service_restarted 终态并注明自动重跑关闭；用户或调用方核对后才显式提交新的 job。"
      },
      {
        "condition": "long-strict 失败或取消后重试",
        "response": "创建新 job id，但复用同一 request fingerprint 对应的稳定输出目录；manifest 与收据验证通过的分段才跳过。"
      },
      {
        "condition": "缓存文件缺失或指纹不一致",
        "response": "缓存失效并重新执行，不返回部分旧结果。"
      },
      {
        "condition": "worker 超期、取消或租约丢失",
        "response": "结束任务进程树并记录终态，保留可安全恢复的任务证据。"
      },
      {
        "condition": "服务端口被其他程序占用",
        "response": "明确报告身份冲突，不结束未知进程也不抢端口。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\scripts\\asr-smart.ps1",
        "role": "日常智能提交、短等待与状态入口"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\service.py",
        "role": "异步 job、状态、期限、缓存和 observer projection"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\process_control.py",
        "role": "子进程树生命周期与终止"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\tests\\test_service.py",
        "role": "服务、缓存、状态和失败路径回归"
      }
    ],
    "verification": [
      "2026-08-31 的全量 345 项单元测试通过，其中 service、process control、observer projection 和 scripts 均进入回归。",
      "service 回归明确覆盖终态 jobs.json 持久化、遗留未完成任务转 service_restarted 且不自动重跑、long-strict 失败/取消后复用稳定目录，以及同大小同修改时间但内容不同仍产生不同 fingerprint。",
      "Doctor 当前确认代理环境干净、GPU 与模型配置可读。",
      "本次未运行真实 strict smoke，因此模块保持 mixed，不把单测冒充 E2E。"
    ],
    "relation": "本模块决定任务是否被正确创建和监管；模型与模式模块决定跑什么，长音频模块决定怎样分段，审计模块决定怎样解释结果。"
  },
  {
    slug: "models-modes",
    usageEntry: "说明是快速初稿、重要录音复核、说话打字还是已有文案对齐。",
    usageInputs: ["音频或实时场景", "所需复核强度和时间线", "云端时的单次上传选择"],
    readerStatus: "已有快速初稿、双模型核对和明确选择的其他路线；Whisper目前只有登记，不能直接转写，也不会自动成为后备。",
    shortTitle: "模型与用途",
    title: "快速初稿、双模型核对和专门对齐，分别选什么",
    searchAliases: ["普通转写到底用哪个模型", "严格模式两路模型是什么", "装了新模型会不会偷偷换默认", "FireRed和Qwen什么时候一起用", "Whisper能不能直接转写", "登记模型和可执行引擎有什么区别"],
    searchProjection: {
      intents: ["选择快速或严格转写", "确认一次结果实际用了哪个模型", "为重要录音选择本地证据路线", "比较新增模型但不改默认", "判断Whisper是否可直接执行"],
      entities: ["SenseVoiceSmall", "Qwen3-ASR-1.7B", "FireRedASR2-LLM", "FunAudioLLM/Fun-ASR-Nano-2512", "Paraformer@v2.0.4", "Whisper Large V3"],
      relations: ["quick 对应 SenseVoiceSmall", "strict 对应 Qwen 主引擎与 SenseVoice 对照", "FireRed 加 Qwen 是显式重要录音证据路线", "Registry登记Profile不等于direct transcription可执行", "Whisper is_whisper标记把它排除在直接转写闭集外"],
      failureRecovery: ["主引擎失败时降为 provisional", "两路都失败时输出听不清", "未知 profile 启动前失败", "Whisper直接请求明确拒绝而不改走相近模型", "实际 runtime 身份不符时回执失效"]
    },
    teaser: "把每个模型的身份、版本、能力与分工集中登记；日常快慢路线保持稳定，新装更强模型也不会暗中改掉默认结果。",
    status: "Registry 登记 6 个 Profile，直接转写闭集 5 个；quick/strict 固定，Whisper Large V3 仅 fallback/comparison、当前不可直接执行",
    statusTone: "mixed",
    value: "我按用途选路线：对电脑说话打字用 Qwen3-ASR-1.7B；先快速看录音内容用 SenseVoiceSmall；要核对重要文字用 Qwen 与 SenseVoice 两路。明确要求更强的本地对照时可选 FireRedASR2-LLM 加 Qwen，Fun-ASR 是可明确选择的另一中文路线；多人录音的分段可用 Paraformer，确认文案配时间用 Qwen3-ForcedAligner。普通录音不会因安装新模型而自动改路线或上传云端。",
    why: "不同用途需要不同速度和复核强度；装了新模型不等于它该接管日常任务。固定当前默认和实际执行身份，才能知道这次结果是怎样来的。",
    example: "“先快速知道这段语音讲什么；需要正式引用的部分再严谨核对。”第一轮用 SenseVoiceSmall 出初稿；复核时用 Qwen3-ASR-1.7B 主识别、SenseVoice 对照，把分歧连到原音。若我只要给确认过的旁白标词语秒数，则改用对齐入口，不重新识别文案。",
    result: "每次交回实际使用的模型、初稿或双路文字、需要回听的差异与时间位置；对齐任务另给逐词秒数。Whisper Large V3 目前只有登记，不能直接执行，也不是失败后的自动备选；云端专业识别须另行明确选择并满足本次上传条件。",
    readerStates: {
      pass: "所选本地模型、文件和运行条件都可用时，按这次用途执行，并在结果中写明实际用了哪一套；双路复核会保留两份结果和差异。",
      problem: "Qwen 主识别失败而 SenseVoice 有结果时，只交暂定文字和失败原因，不能称为两路已经核对；重要词句仍要回听。",
      unavailable: "所选权重或运行环境缺失时只暂停对应路线。Whisper 当前不能直接转写，不会用相近模型顶替，也不会自行下载、换默认或上传。"
    },
    productFlow: [
      { title: "先说要做什么", detail: "听写、快速初稿、严谨核对、多人分段和已知文案对齐的输入与输出不同；先按真实请求选择路线。" },
      { title: "公开实际模型选择", detail: "听写用 Qwen；快速初稿用 SenseVoice；默认严格文件转写用 Qwen 与 SenseVoice。FireRed 加 Qwen、Fun-ASR 与 Paraformer 仅在相应用途明确选择且依赖可用时运行。" },
      { title: "交回文字、时间与疑点", detail: "结果记录实际模型和完成层级。双路有分歧就给回听位置；对齐只给确认文案在声音中的词语时间，不证明文案本身正确。" }
    ],
    decisionImpact: [
      "桌面听写只用原有 Qwen3-ASR-1.7B，不做双模型复核或自动润色，也没有更换或下载另一 ASR 模型；文件 quick/strict 默认角色维持。",
      "兼容依赖可由 AI 自主更新；新增或替换模型需要可靠、明确的中文效果、速度与兼容改进证据，不因新版本或宣传换模，没有定时模型下载服务。",
      "普通默认不因新模型安装而漂移。",
      "quick 与 strict 的质量和成本边界明确。",
      "证据级、时间线和备用模型必须显式选择。",
      "Registry 当前登记 6 个 Profile，但 list_transcription_engine_names 只返回 5 个可直接执行引擎；数量不能互相冒充。",
      "Whisper Large V3 是 fallback/comparison 设计记录，当前 pipeline 看到 is_whisper=true 会在模型加载前明确拒绝。",
      "每次结果记录实际引擎，而不是只记录模式名。",
      "模型失败影响状态和证据等级，不只影响一段错误文本。"
    ],
    problem: "解决模型配置漂移、默认路线暗改、同名模型版本不清、主/对照角色混乱，以及模型失败后仍被显示为完整双模型成功的问题。",
    implementation: [
      "configs/models.yaml 声明模型 id、适配器、版本、能力和设备要求。",
      "config.py 读取并验证模型配置；未知引擎直接失败。",
      "config.py 分开 list_engine_names（全部登记）与 list_transcription_engine_names（排除 is_whisper 的直接转写闭集）。",
      "pipeline.py 按 quick、strict 和显式参数组织主/对照引擎；build_model 在加载前拒绝 is_whisper Profile。",
      "adapters 分离 Qwen、FunASR 与 FireRed 的运行差异。",
      "fun-asr-nano 使用 ModelScope hub、funasr-automodel、GPU 与 trust_remote_code=true，固定 revision 05201c46…；Paraformer 固定 v2.0.4，并显式携带 VAD/PUNC/CAM++ aliases。",
      "qwen_identity.py 对 Qwen runtime 与模型身份做精确约束。"
    ],
    flow: [
      "解析模式和显式引擎参数。",
      "从 Registry 取得精确 profile。",
      "检查 Profile 是否进入 direct transcription 闭集；Whisper registered-only 请求在加载前停止。",
      "检查依赖、权重、设备和输入能力。",
      "为主引擎和对照引擎创建独立原始输出。",
      "把实际身份和执行状态写入结果。",
      "交给仲裁与审计层生成正文和复核结论。"
    ],
    concepts: [
      { term: "Registry", explanation: "模型配置的唯一登记表，决定 id、角色、适配器和边界。" },
      { term: "primary engine（主引擎）", explanation: "严格模式主要正文候选的来源。" },
      { term: "secondary engine（对照引擎）", explanation: "独立转写同一输入，用于发现分歧和疑似幻觉。" },
      { term: "profile", explanation: "一个精确模型及其运行合同，不是模糊产品别名。" },
      { term: "registered-only profile（仅登记配置）", explanation: "为了记录备用/对照身份而保留在 Registry，但当前没有直接转写执行路径；Whisper Large V3 属于这一类。" }
    ],
    boundaries: [
      "Fun-ASR-Nano、FireRed 和 Paraformer 可按各自显式路线执行但不会接管 quick/strict；Whisper 仅登记为备用/对照，当前不能直接转写。",
      "Fun-ASR-Nano 精确身份为 FunAudioLLM/Fun-ASR-Nano-2512@05201c46f1c38592b1567f857c0d56eab3d0d8ef；Paraformer 精确身份为 iic/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-pytorch@v2.0.4。",
      "模型安装成功不等于真实音频 E2E 通过。",
      "对照模型不是投票多数，也不自动证明主模型错误。",
      "云模型与本地模型分属不同授权和证据边界。"
    ],
    failures: [
      { condition: "未知模型或配置字段错误", response: "启动前失败并指出精确 profile，不选择相近模型。" },
      { condition: "用户直接请求 Whisper Large V3", response: "返回 fallback/comparison only 的明确不可用结果；不加载模型、不生成假转写，也不静默改走另一个引擎。" },
      { condition: "主引擎失败、对照成功", response: "保留对照文本但标为 provisional，并记录主引擎错误。" },
      { condition: "两路都失败", response: "输出听不清或失败状态，不生成貌似完整正文。" },
      { condition: "结果声明的模型与实际 runtime 不同", response: "证据回执验证失败，结果不能升级为 verified。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml", role: "模型 Registry 与默认角色" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\config.py", role: "配置加载与验证" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\pipeline.py", role: "quick / strict 流水线" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_config.py", role: "Whisper fallback-only标记与直接转写闭集回归" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\qwen_asr.py", role: "Qwen ASR 适配器" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\funasr.py", role: "SenseVoice、Paraformer 与 FunASR 适配" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\firered_worker.py", role: "FireRed 隔离 worker 适配" }
    ],
    verification: [
      "2026-08-31 Doctor 枚举六个登记 Profile，并确认 FunASR、Qwen ASR、PyTorch 已安装；登记数量不等于可直接执行数量。",
      "config.py 当前直接转写闭集为5个；test_config验证whisper-large-v3带is_whisper且不进入该闭集，pipeline在加载前拒绝它。",
      "config、pipeline、Qwen identity、FireRed worker 等单元回归包含在 2026-08-31 的 345 项通过结果中。",
      "Registry 静态回读确认 Fun-ASR-Nano revision=05201c46…、Paraformer revision=v2.0.4；本次未分别加载或运行它们，精确配置不冒充推理E2E。",
      "本次没有对六个 profile 分别运行真实录音，实际速度与准确率仍以具名 benchmark 为准。"
    ],
    relation: "模型与模式模块声明要运行的精确 profile；安装与恢复模块负责让对应依赖、模型工件和隔离运行时可重建，入口、长音频、审计和说话人模块只能在这两层共同成立的能力范围内工作。"
  },
  {
    slug: "installation-recovery",
    usageEntry: "安装、升级、换机或模型加载失败时，要求核对依赖和固定模型。",
    usageInputs: ["遇到的安装或加载故障", "这次要使用的识别用途"],
    productFlow: [{"title": "系统核对并处理", "detail": "分清 Python、显卡、固定权重及特殊环境缺哪层，只恢复当前路线所需部分并核对真实装载。"}, {"title": "交付与接续", "detail": "用小样本确认运行与回退点；下载完成或目录存在不等于模型可用。"}],
    readerStatus: "已有模型安装、比较、切换和回退入口；完整离线安装包仍缺失，不能据模型目录存在就说断网换机可恢复。",
    shortTitle: "安装与恢复",
    title: "安装、模型工件与离线恢复",
    searchAliases: ["新电脑怎么安装ChineseASR", "断网后怎样重建ASR环境", "MODEL_RECEIPT能证明什么", "Qwen和FireRed模型坏了怎么恢复", "wheelhouse里有没有模型权重", "换模型后要跑哪些验收"],
    searchProjection: {
      intents: ["在新电脑安装同一套本地ASR", "断网重建Windows Python环境", "核对Qwen或FireRed模型是否损坏", "恢复FireRed WSL隔离环境", "替换模型后重新验收"],
      entities: ["Python virtual environment", "CUDA 12.8", "requirements-lock.txt", "wheelhouse.sha256", "MODEL_RECEIPT.json", "FireRed WSL"],
      relations: ["dependency lock生成wheelhouse", "checksum清单约束离线wheel文件", "MODEL_RECEIPT绑定固定revision与必要模型文件", "Windows离线安装与模型权重恢复是两条链", "FireRed源码运行时和模型工件共同决定可装载性"],
      failureRecovery: ["缺少lock时先在联网健康环境重新冻结", "wheel缺失或SHA不符时拒绝离线安装", "模型revision大小或SHA漂移时拒绝装载", "WSL容量或当前可用内存不足时装载前阻断", "Doctor通过后仍需模型smoke和真实场景E2E"]
    },
    teaser: "把新机安装、断网重建与模型抢修拆成三组可核对工件：依赖包、固定模型缓存与回执、FireRed WSL（Windows Linux 子系统）运行时；下载完还得跑真实冒烟。",
    status: "固定模型、候选比较及配置切换/回退已实现；本轮确认对齐权重目录存在，完整离线包仍缺失",
    statusTone: "mixed",
    value: "升级或换机前，我能分清缺的是 Python 依赖、固定权重还是 FireRed 的 WSL。想换默认模型时，先用相同参考语料比较错误与复核代价，再明确切换并留回退点；不会因为下载完成、目录存在或公开分数更高，就偷偷换掉日常路线。",
    why: "源码、运行依赖与模型文件是三种东西；只保留其中一份，换机或断网时可能到最后才发现根本跑不起来。先查缺的层，再恢复。",
    example: "比如我问“新电脑暂时没网，怎样把 ChineseASR 恢复到能跑严格转写？”系统会先核对预存的依赖锁、离线轮包与校验清单，重建 Windows 虚拟环境；再单独确认 Qwen 模型缓存与回执。若还需要 FireRed，就继续检查 WSL 中的源码、运行时、模型回执和存储容量。最后必须跑默认 strict 冒烟；重要证据路线还要另跑 FireRed + Qwen 冒烟并人工核听。",
    result: "交回这台机器哪些识别路线真的能运行、缺哪些依赖或模型文件、恢复后是否通过小段真实声音检查。想换默认模型时还会交回同材料比较与可回退的配置决定；只下载完成不能算可用。",
    readerStates: {
      "pass": "运行依赖、对应模型文件和一次实际试跑都通过后，才把这条路线标为可用；重要录音的质量仍需单独回听。",
      "problem": "只修好一部分时保留已经核对的结果，指出缺的层；修额外路线不会顺手改掉日常路线。",
      "unavailable": "离线安装材料、模型文件或必要系统环境缺失时，只停受影响路线，不猜版本或找相似模型顶替。"
    },
    decisionImpact: [
      "桌面听写用 scripts/dictation.ps1 -Mode Install 安装额外依赖、创建 ChineseASR Dictation 登录自启并立即启动；Status/Stop/Start 读回与停启，Uninstall 移除登录自启、保留项目和模型。",
      "requirements-core.txt 固定 FunASR 1.4.14 与 NumPy 1.26.4，满足 NumPy <2；requirements-dictation.txt 增加 sounddevice 0.5.6、pystray 0.19.5、Pillow >=10。Qwen ASR 0.0.6、Torch 2.11.0+cu128、Transformers 4.57.6 维持。",
      "新机在线安装与断网恢复使用同一模型 Registry，但依赖获取方式不同。",
      "项目要求 Python >=3.11；Windows 当前环境是 3.11.9，FireRed WSL 当前环境是 3.12.3。",
      "Windows PyTorch/TorchAudio 从 CUDA 12.8 index 安装；在线脚本不固定精确 torch 版本，离线可复现性由健康环境导出的 lock 和 wheelhouse 承担。",
      "requirements-core 固定 FunASR 1.4.14 与 NumPy 1.26.4，Qwen runtime 固定 qwen-asr 0.0.6；FireRed 在 WSL 中使用自己的一组精确依赖和 PyTorch/TorchAudio 2.10.0+cu128。",
      "Qwen 和 FireRed 只接受固定 repository/revision 与规范 MODEL_RECEIPT，文件缺失、大小或 SHA-256 漂移都在模型加载前失败关闭。",
      "wheelhouse 只保存 Windows Python wheel，不包含模型权重、私人录音、输出、FireRed WSL venv 或源码 checkout。",
      "setup、download、Doctor、unit test、runtime smoke 与真实录音 E2E 是不同证据层，不能互相代替。",
      "模型候选先用独立配置跑同语料 baseline/high_quality 评测，比较通过且输入/代码/配置仍匹配后才明确 activate-profile；旧权重和运行依赖独立保留，回退不覆盖后来修改的默认引擎。"
    ],
    problem: "解决代码都在但环境跑不起来、断网后才发现依赖或模型没预存、模型目录部分损坏却仍被加载、FireRed WSL 因版本或存储容量漂移在重载时失败，以及换模型只改配置却没有重新验收真实转写的问题。",
    implementation: [
      "pyproject.toml 要求 Python >=3.11；install-torch-cu128-direct.ps1 创建项目 .venv，从 CUDA 12.8 index 安装 PyTorch/TorchAudio 并现场打印 CUDA 可用性和设备。",
      "setup-core.ps1 安装 requirements-core.txt、editable（可编辑）项目，依次运行 pip check 和 zh_asr doctor；镜像不能满足时回退官方 PyPI。",
      "setup-qwen.ps1 在同一 Windows .venv 安装 qwen-asr==0.0.6；download-models.ps1 从 ModelScope 获取 Qwen/Qwen3-ASR-1.7B 固定 revision a04930dbe5419bfee073f7cade734f572689a3a8。",
      "qwen_identity.py 定义 13 个规范必要文件及其固定字节数/SHA-256；MODEL_RECEIPT 还绑定 schema、repository 和 revision，adapter 在 Qwen3ASRModel.from_pretrained 前验证 runtime、回执与实际文件。",
      "setup-firered.ps1 在 Ubuntu WSL 的 /opt/chineseasr/firered/.venv 建隔离环境，固定 FireRedASR2S commit 4e7d9aaf4482a47cec1724807026b9b151926eb5，验证 imports 与 CUDA 并回读 BF16 支持；Windows 默认模型配置不被改写。",
      "FireRed WSL 依赖由 requirements-firered.txt 精确约束，含 Transformers 5.1.0、NumPy 2.4.2 等；Torch/TorchAudio 固定 2.10.0+cu128 并单独安装。",
      "download-models.ps1 从 Hugging Face 获取 FireRedTeam/FireRedASR2-LLM 固定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824，并为 14 个必要文件原子生成带路径、大小和 SHA-256 的 MODEL_RECEIPT。",
      "export-lock.ps1 从已通过 pip check 的 Windows .venv 运行 pip freeze --exclude-editable，输出 requirements-lock.txt 与 python-version.txt。",
      "build-wheelhouse.ps1 把 torch 系依赖送到 CUDA 12.8 index，其余包送到 PyPI，写出 wheelhouse.sha256 和 wheelhouse.json；后者记录 lock SHA-256、每个文件大小与 SHA-256。",
      "verify-wheelhouse.ps1 对 checksum 清单逐项检查文件存在与 SHA-256；install-offline.ps1 默认先验证，再用 --no-index --find-links 安装精确 lock，安装本地源码并运行 pip check 与 Doctor。",
      "runtime/firered_worker.py 在哈希大权重和加载前同时验证固定源码 HEAD/干净工作树、模型回执、WSL 配置容量和当前可用容量；半精度与 FP32 使用不同门槛。",
      "model_lifecycle 的 compare 验相同音频/真值/指标、独立样本规模、无重复或无效数据；纯合成、跳过案例或未改善拒绝提升。activate-profile 用当前代码/配置身份只切 strict 两个默认引擎并保存switch.json；rollback拒绝覆盖后来改变的默认值，保留无关设置。权重、运行依赖和驻留进程仍需各自恢复。",
    ],
    flow: [
      "联网健康环境先用 install-torch-cu128-direct.ps1、setup-core.ps1 建立 Windows 基线；需要 strict 时再 setup-qwen.ps1，需要 FireRed 时另建 WSL 隔离环境。",
      "按显式 engine 下载固定模型；Qwen 和 FireRed 生成/验证 MODEL_RECEIPT，SenseVoice、Paraformer 等常规模型进入 Git 忽略的 ModelScope 缓存。",
      "在环境已通过 pip check/Doctor 后运行 export-lock.ps1，冻结精确包版本与 Python 版本。",
      "运行 build-wheelhouse.ps1 下载全部 wheel，生成 checksum 与 JSON manifest；verify-wheelhouse.ps1 立即做一次独立校验。",
      "把 wheelhouse、manifests、项目源码和模型/FireRed 工件作为不同恢复对象保存；Git 仓库只保存源码、脚本和小型 manifest，不保存大文件。",
      "断网时先验证 checksum，再由 install-offline.ps1 创建新的 venv、无索引安装、安装本地源码并运行 pip check/Doctor；正常验收不使用 SkipVerify。",
      "恢复 Qwen 时核对固定 revision、13 项必要文件和回执；恢复 FireRed 时再核对 14 项权重、固定源码 commit、干净工作树、WSL Python/CUDA 与内存门槛。",
      "同一 adapter 替换模型时先更新 Registry 与身份合同，再下载工件；新增不同 runtime 时新增 adapter，不在旧 profile 下伪装。",
      "最后运行默认 strict 与 smoke-asr-smart；FireRed + Qwen 还运行 smoke-evidence-asr 并核对每段 verified、非空 raw、dtype、无 engine_failure，关键语句人工回听。"
    ],
    concepts: [
      { term: "dependency lock（依赖锁）", explanation: "从一套健康环境冻结的精确 Python 包版本；online requirements 中的下限不能替代它。" },
      { term: "wheelhouse（离线轮包仓库）", explanation: "为 lock 预下载的 Python wheel 集合；它让 pip 在断网时安装，但不含模型权重。" },
      { term: "checksum manifest（校验清单）", explanation: "wheelhouse.sha256 逐文件验哈希，wheelhouse.json 另记录 lock 哈希、文件大小和 SHA-256。" },
      { term: "MODEL_RECEIPT（模型回执）", explanation: "绑定模型仓库、固定 revision、规范文件列表、字节数和 SHA-256；它验证已有工件，不负责备份工件。" },
      { term: "pinned revision（固定修订）", explanation: "精确锁定模型或源码版本，防止同一名称在恢复后实际变成另一份内容。" },
      { term: "runtime smoke（运行冒烟）", explanation: "实际加载模型并从入口生成最终制品；比安装、Doctor 和单元测试更接近可用性。" }
    ],
    boundaries: [
      "offline/wheelhouse、models、输出与私人音频都被 Git 忽略；公开仓库不是灾备载体。",
      "当前离线脚本只重建 Windows Python 环境；它不离线创建 FireRed WSL venv、克隆固定源码或恢复任何模型权重。",
      "MODEL_RECEIPT 不是模型文件、备份、数字签名或真实推理证明；只有工件仍在时才能逐项校验。",
      "verify-wheelhouse 校验清单内文件的存在与 SHA-256，不证明 Python ABI、GPU 驱动或新机器硬件兼容；必须实际 install smoke。",
      "FireRed 半精度至少要求 28 GiB RAM、34 GiB RAM+swap，启动时至少 18 GiB MemAvailable、22 GiB MemAvailable+SwapFree；FP32 对应 40/48 GiB 与 36/44 GiB。",
      "当前 32 GiB WSL RAM + 8 GiB swap 是这台机器的验证配置，不是所有硬件的统一承诺。",
      "模型下载、环境体检和源码测试都不能替代真实音频 E2E；重要录音还必须人工核听。",
      "模型目录缺失或损坏时先验真再修复，wheelhouse不包含大型模型权重；源码、安装包和现有样本通过不能声称完整断网恢复已经验收。原权重与运行依赖仍需按模型清单分别准备和核对。",
    ],
    failures: [
      { condition: "断网时没有 requirements-lock 或 wheelhouse", response: "明确判定无法离线重建 Python 环境；回到有网络且已验证的健康环境制备工件，不从未知缓存猜版本。" },
      { condition: "wheel 文件缺失或 SHA-256 不一致", response: "verify-wheelhouse 失败并阻断安装；从可信源重新构建或恢复完整 wheelhouse，不使用 SkipVerify 绕过正常验收。" },
      { condition: "offline pip install、pip check 或 Doctor 失败", response: "保留失败包与错误，丢弃这次未通过的 venv，使用已验证 lock/wheelhouse 重建；不改变模型默认路由。" },
      { condition: "Qwen receipt、runtime 版本或 13 项必要文件漂移", response: "在模型 loader 前失败关闭；从固定 revision 重取或从可信备份恢复，并重新生成/核验规范回执。" },
      { condition: "FireRed 模型回执、固定源码 HEAD 或干净工作树不符", response: "拒绝加载；恢复固定 14 项权重与 pinned checkout，不在被修改源码上继续证据路线。" },
      { condition: "FireRed WSL 配置总量不足", response: "先调整 .wslconfig；在没有重要 WSL/Docker 任务时执行 wsl --shutdown 后重新启动，再复核容量。" },
      { condition: "FireRed 配置足够但当前可用内存不足", response: "关闭或等待占用进程后重试，不把临时争用误报为模型损坏，也不让 OOM 后反复装载。" },
      { condition: "模型更换后 Doctor 通过但 smoke 失败", response: "该 profile 仍为 unavailable/provisional；回到固定工件、adapter 与实际输出排查，不能把下载成功写成 ASR 场景可用。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\pyproject.toml", role: "Python >=3.11 与项目安装入口" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\requirements-core.txt", role: "Windows 核心依赖、FunASR 1.4.14 与 NumPy 1.26.4" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\requirements-qwen.txt", role: "Qwen ASR runtime 0.0.6" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\requirements-firered.txt", role: "FireRed WSL 精确 Python 依赖" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml", role: "六引擎 Registry、固定 revision 与运行门" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\install-torch-cu128-direct.ps1", role: "Windows CUDA 12.8 PyTorch/TorchAudio 安装" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\setup-core.ps1", role: "Windows 核心 venv、pip check 与 Doctor" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\setup-qwen.ps1", role: "固定 Qwen runtime 安装" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\setup-firered.ps1", role: "FireRed WSL 隔离环境与固定源码" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\download-models.ps1", role: "固定模型下载与 MODEL_RECEIPT 生成" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\export-lock.ps1", role: "依赖锁与 Python 版本导出" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\build-wheelhouse.ps1", role: "离线 wheel 下载与 checksum/JSON manifest" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\verify-wheelhouse.ps1", role: "离线工件逐文件 SHA-256 校验" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\install-offline.ps1", role: "无索引安装、pip check 与 Doctor" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\qwen_identity.py", role: "Qwen 13 项模型工件和 runtime 身份失败关闭" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\runtime\\firered_worker.py", role: "FireRed 14 项工件、源码、容量与装载验证" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_scripts.py", role: "setup、下载、wheelhouse、offline install 与 smoke 脚本回归" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\docs\\architecture.md", role: "模型身份、WSL 容量、数据流与替换验收边界" }
    ],
    verification: [
      "2026-08-31 安装恢复基线：PUBLIC main=70e3255326ad8ba7b0e335fdf6b4a19caf0d8029，README、architecture、Registry、requirements 与完整安装/下载/离线脚本已逐项核对。",
      "Unit tests：2026-08-31 本轮 .venv\\Scripts\\python.exe -m unittest -v tests.test_scripts 运行 18 项并全部通过；它验证脚本合同，不下载 wheel、不装模型也不跑音频。",
      "2026-08-31 Full regression 历史观察：同一轮 .venv\\Scripts\\python.exe -m unittest discover -s tests -q 运行 345 项，用时 83.524 秒并全部通过；仍不等于真实模型 E2E。",
      "2026-08-31 Runtime Doctor 历史观察：Windows 当时为 Python 3.11.9、PyTorch/TorchAudio 2.11.0+cu128、FunASR 1.4.5、Qwen ASR 0.0.6、ModelScope 1.38.1；RTX 5090 D 驱动 616.56、32607 MiB，六个引擎可枚举。",
      "Model artifacts：Qwen receipt 为 1763 B / SHA-256 0c43de9dd883adefb65cfa1477ad7156f749868105a554e647b47de73c841ef9，13 项声明合计 4703115105 B；FireRed receipt 为 2124 B / SHA-256 c4effd6931c0e09d8b2caaf7f8b9f58bed370fa4a174edfc64b668dd0b48dd01，14 项声明合计 18870501538 B。2026-08-31 确认所有声明路径存在、文件大小一致；本轮不重验模型工件。",
      "FireRed runtime：WSL Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2，CUDA/BF16 可用；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 且工作树干净，当前内存高于半精度门槛。",
      "Unverified：本轮未逐字节重算两组全部权重 SHA-256、未加载模型、未运行 strict/evidence smoke，也未用私人录音做 E2E；MODEL_RECEIPT 当前只到回执自身哈希、路径存在和大小回读。",
      "2026-09-18 本轮只读确认 requirements-lock.txt、python-version.txt、wheelhouse.sha256、wheelhouse.json 和 offline/wheelhouse 均不存在；没有运行离线安装，也不能把模型工件目录当成可携带离线包。"
    ],
    relation: "本模块承接模型与模式模块的精确 profile，把依赖、权重和 FireRed WSL 恢复成可执行候选；只有再通过入口模块的真实 smoke、长音频执行与审计证据，候选环境才成为可用 ASR 路线。"
  },
  {
    slug: "long-batch",
    usageEntry: "提交长录音或明确文件夹，要求连续转写或批量处理。",
    usageInputs: ["要处理的长录音或文件夹范围", "是否需要连续时间线与重要复核"],
    productFlow: [{"title": "系统核对并处理", "detail": "按原音时间连续分段，在同一身份下复用已验片段；坏文件单独记录，不拖掉其他完成结果。"}, {"title": "交付与接续", "detail": "交回完成、漏段、失败和待续范围；一篇拼接长文不充当覆盖证明。"}],
    readerStatus: "已有长录音分段续作和逐文件处理；公开短样例走通过两段，不代表两小时录音的质量已经验收。",
    shortTitle: "长音频与批量",
    title: "连续时间线、长音频断点续跑与文件夹批量",
    searchAliases: ["两小时录音中断后接着跑", "长录音漏了一段怎么办", "文件夹批量转写一个坏文件怎么办", "manifest怎么判断哪些片段完成", "录音切片交界会不会重复"],
    searchProjection: {
      intents: ["把长录音分段转写", "中断后只补缺失分段", "批量转写一个文件夹", "检查时间线有没有漏段"],
      entities: ["chunk", "overlap", "manifest.json", "metrics.json", "transcript.md"],
      relations: ["manifest 绑定输入内容与模型配置", "chunk 状态聚合成整体覆盖", "overlap 减少断句但聚合必须去重", "批量共享模型但每个文件独立输出"],
      failureRecovery: ["chunk 失败保留其他分段", "manifest 身份不一致拒绝续跑", "gap 或越界使完整覆盖失败", "损坏文件不拖垮整个批次"]
    },
    teaser: "长录音切成连续片段稳稳跑完并支持断点续作；批量转写复用已加载模型，但每个文件各算各的，坏一个不拖垮整批。",
    status: "VAD 边界、局部恢复与逐文件隔离已实现；来源已验 42 秒两片，未以此宣称两小时质量通过",
    statusTone: "mixed",
    value: "两小时录音跑到一半中断，不必把前面全部推倒重来；文件夹批量里即使有一个坏文件，其他已经完成的结果也不会跟着消失。我还能看见时间线有没有漏段，而不是只拿到一篇看似完整的长文。",
    why: "一段过长的声音可能超过模型能一次处理的范围，随意切开又会断句或漏掉交界。逐段记录时间和完成状态，才能从中断处可靠继续。",
    example: "比如我说“把这段两小时录音从中断处接着跑”。假设第 17 段失败，系统会保留前面已经通过和后续已成功的片段；修复原因后，它认准同一录音与配置，只补失效片段，再重新生成整体正文与覆盖证据，不把旧配置的片段混进来。",
    result: "交回连续录音哪些时间段已经完成、哪些还缺，及可以阅读的合并正文。只有时间覆盖和各段身份都核对完，才称整段完成。",
    readerStates: {
      "pass": "每段都属于同一录音和设置、时间没有空洞时，交回完整合并结果。",
      "problem": "个别段失败时保留其余成功内容和缺口，整段仍标为部分完成。",
      "unavailable": "原音、时长或旧分段身份对不上时不拿旧结果拼接，先恢复正确任务。"
    },
    decisionImpact: [
      "续跑前验证输入、模型和分段计划是否相同。",
      "分段必须从 0 连续覆盖到音频结束。",
      "局部失败不会被整体成功状态吞掉。",
      "批量共享模型，不共享文件结果和错误。",
      "聚合负向结论要求所有 child 证据都闭合。"
    ],
    problem: "解决模型时长上限、长任务中断重做、切片交界漏字、旧分段错复用、批量重复加载模型，以及单个文件失败拖垮整个批次的问题。",
    implementation: [
      "long_audio.py 按 VAD 附近边界形成连续时间线；general quality 默认最长 60 秒、最短 20 秒、边界搜索 5 秒，FireRed 建议 35 秒、硬上限 40 秒且包含重叠，不删掉未检测到语音的原区间。",
      "arbitration.py 聚合双模型结果与分段风险。",
      "batch.py 复用 Qwen 批量输入能力并隔离失败项；短音频正常批处理，长文件转可恢复分段，坏文件不会吞掉邻居结果。",
      "chunk overlap 可配置，但覆盖与边界必须进入结果证据。",
      "复用绑定输入、模型锁、代码、配置与调用身份；单引擎失败保留 provisional 内容，但不作为完整 strict 缓存。只在文本与重叠音频时间共同支持时去重，不删除真实重复说话。"
    ],
    flow: [
      "读取音频总时长和目标模型上限。",
      "生成连续 chunk 与必要 overlap。",
      "写入任务 manifest 和每段预期身份。",
      "按顺序或受控队列运行每段主/对照引擎。",
      "失败时记录分段终态，不删除已完成内容。",
      "续跑时验证旧制品后只补缺失段。",
      "重新仲裁并检查 0 到结尾覆盖。"
    ],
    concepts: [
      { term: "chunk", explanation: "长音频中的连续时间区间，带开始、结束和输入身份。" },
      { term: "overlap（重叠）", explanation: "相邻分段共享的一小段音频，用于减少切断语句；聚合时必须去重。" },
      { term: "manifest", explanation: "分段计划、状态、模型与输出的唯一恢复清单。" },
      { term: "partial（部分完成）", explanation: "有可用分段，但整体覆盖或证据未闭合。" }
    ],
    boundaries: [
      "断点续跑只接受同一输入和配置身份。",
      "成功分段不自动让整体任务变成成功。",
      "重叠区不应在最终正文中重复。",
      "批量模型复用不允许一个文件读取另一个文件的私人正文。"
    ],
    failures: [
      { condition: "某个 chunk 模型失败", response: "保留其他段，标出时间区间和引擎错误，整体降为 partial。" },
      { condition: "manifest 与当前输入不一致", response: "拒绝复用旧段，防止把另一文件或旧模型结果拼入。" },
      { condition: "时间线出现 gap 或越界", response: "客观覆盖验证失败，不得输出 no_speech_detected 或完整成功。" },
      { condition: "批量中的一个文件损坏", response: "该文件单独失败，其余文件继续并保留独立结果。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\long_audio.py", role: "分段、manifest、续跑和覆盖" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\arbitration.py", role: "分段和双模型仲裁" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\batch.py", role: "批量模型复用与逐文件隔离" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\transcribe-folder.ps1", role: "Windows 文件夹批量入口" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_long_audio.py", role: "长音频边界、恢复和覆盖回归" }
    ],
    verification: [
      "long_audio、arbitration、batch 进入2026-08-31 的 345 项通过的全量单测。",
      "覆盖验证测试包含 gap、overlap、子证据和旧 manifest 身份场景。",
      "9 月 17 日来源 42 秒两切片 FireRed+Qwen、Qwen 对齐与正常 API 有真实公开音频验收；旧四切片结果保留历史，长篇个人录音与准确率仍未由本轮验证。"
    ],
    relation: "本模块复用入口模块的 job 和模型模块的 profile；最终分段结果必须交给审计证据模块，涉及说话人时再交给归属模块。"
  },
  {
    slug: "audit-evidence",
    usageEntry: "要求标出重要录音里的数字、否定句和双模型分歧供回听。",
    usageInputs: ["要复核的原录音", "姓名、金额、日期等重点（如有）"],
    productFlow: [{"title": "系统核对并处理", "detail": "比较两路识别，将疑点连回原音时间；可听到的才据声音修正，不以流畅润色遮盖分歧。"}, {"title": "交付与接续", "detail": "正文和疑点清单并存；原音缺失或仍听不清时保留未知。"}],
    readerStatus: "已有带原音频的分歧复核页和片段笔记；能核对文件对应关系，不等于识别文字已经逐字正确。",
    shortTitle: "疑点与回听",
    title: "找出需要回听的字句，而不是把分歧自动润色掉",
    searchAliases: ["转写结果先看哪个文件", "正文有疑似怎么回听", "听不清是不是没有人说话", "ASR回执能证明文字是真的吗", "两路模型说法不一样看哪里", "strict复核队列在哪里", "Ollama仲裁什么时候启用", "LLM会不会读取音频或改写原始结果"],
    searchProjection: {
      intents: ["按顺序阅读严格转写成品", "定位并回听疑似或听不清片段", "比较两路模型分歧与依据", "显式启用本地不确定片段仲裁", "验证结果包有没有被替换", "用人工真值做 benchmark"],
      entities: ["*.strict.md", "*.strict.audit.json", "*.strict.review.json", "*.strict.receipt.json", "两路 *.raw.json", "Ollama 11434", "uncertain_only", "merged audit / metrics"],
      relations: ["strict 正文先读再进入 audit", "audit 分歧生成 review queue", "Ollama只读不确定片段的结构化audit证据", "仲裁只写merged audit和metrics而不覆盖raw", "receipt 绑定路径大小和 SHA-256", "长音频 manifest 和 metrics 解释覆盖与耗时"],
      failureRecovery: ["疑似标记按 review 时间或 chunk 回听原音频", "Ollama未启用或不可用时基础双ASR链照常完成", "仲裁响应无效时保留原始分歧和低置信结论", "听不清保持未知而不改写成静音", "回执不一致使 evidence unavailable"]
    },
    teaser: "先读正文，再点开值得回听的差异；数字、否定和实际声音一起核对，补充模型或可选 LLM 都不能替我改掉原始证据。",
    status: "本地质量复核页、片段笔记绑定与比较门已实现；原始证据完整不等于文字真值",
    statusTone: "mixed",
    value: "把两套识别结果、数字和否定句的疑点连回原音频；需要时人工听审，让重要内容有依据地修正。",
    why: "顺滑的一句话也可能是模型补出来的；空白可能是真的安静，也可能是没识别到。要把重要数字和否定句留在原声音旁边复核，不能用润色掩盖疑点。",
    example: "“这里到底说的是十五还是五十？把两套结果和对应声音留给我看。”先列出真实分歧与时间位置，听不清就保留未知，不用语境顺口改成某一个数。",
    result: "拿到原结果、疑点和可回听位置；人工结论与模型输出分别保留，可重新核对。",
    readerStates: {
      "pass": "录音与两路原结果都在，能把重要文字与回听位置对应起来时，交回可核对正文和疑点。",
      "problem": "两路不一致、关键句可疑或只有一路成功时把文字标为待复核；可选解释不能覆盖原始结果。",
      "unavailable": "原音或原始结果缺失时不从旧文档猜回证据；可选的补充解释不可用，也不影响已有本地识别结果。"
    },
    decisionImpact: [
      "静音出字和模板废话进入高风险复核。",
      "空文本不再自动等于无语音。",
      "主引擎失败会改变证据等级。",
      "LLM 仲裁默认关闭；只有显式启用且 chunk 带 flags、needs_review 或低相似度时才触发。",
      "仲裁只读结构化 audit 证据、不读音频，只写 merged audit / metrics；两路 raw ASR JSON 永不被它覆盖。",
      "本地 Ollama 不可用或返回无效 JSON 时保留原始分歧和人工复核队列，基础转写不依赖它成功。",
      "内容文件与回执不一致时 verified 自动失效。",
      "阅读从 `*.strict.md` 开始，不让用户先钻进 raw JSON。",
      "`*.strict.audit.md` / `.json` 解释两路分歧，`*.strict.review.json` 与长流程 `review.md` 把最值得回听的位置排成队列。",
      "receipt 只核对路径、大小、SHA-256、语义声明和 bundle hash；关键姓名、数字和争议句仍必须回到原音频核听。"
    ],
    problem: "解决流畅幻觉、空文本误判、双模型分歧被隐藏、结果文件被替换后仍显示通过，以及结构化回执被误当成外部真实性证明的问题。",
    implementation: [
      "risk_rules.py 保留静音出字、异常重复、繁体与格式等风险；实际差异比较另保留小数点、正负号、否定与关键项，正常说出的“字幕”“点赞”不单独成为删除或改写理由。",
      "audit.py 汇总主/对照原始结果、错误和风险。",
      "audio_outcome.py 正交表达 execution、coverage、quality 和 objective outcome。",
      "strict_writer 分开写正文、audit、review、raw、客观结果和 receipt；quality.review.json/html 再呈现上下文音频、时间和补充识别。复核失败只降低质量状态，不删除原正文、raw 或原审计。",
      "arbitration.py 从 `configs/models.yaml` 读取默认关闭的 `llm_arbitration`；启用时使用本地 `http://127.0.0.1:11434/api/chat`、主模型 `qwen-main-v1:latest`、fallback `qwen3.6-27b-256k:latest`、`uncertain_only` 与 `keep_alive=0`，仅传结构化分歧证据。 它不读取音频，不覆盖主转写与原审计；merged audit / metrics 只保存这份补充判断，响应无效不妨碍基础双 ASR 结果交付。",
      "长音频 manifest/metrics 记录覆盖、身份和耗时；评测同时分开普通 CER、关键符号错误、静音出字、错误放行与复核负担，不能用整段高相似度掩盖金额或否定差异。",
      "metadata.py 与回执绑定输入、模型、六项严格内容制品、相对路径、大小、SHA-256 和 bundle hash。",
      "质量HTML只播放本地音频，SenseVoice仅在不是原两路且有复核片段时补听；笔记导出绑定该片段和审计哈希，不能误用于别的录音。复核失败、quality_result.needs_review=null或lexical_truth_verified=false均保持明确，不伪装为没有疑点。",
    ],
    flow: [
      "日常先打开 `outputs.final` 指向的 `*.strict.md`，阅读正文并保留其中的 `[疑似]` / `[听不清]` 标记。",
      "遇到标记、关键姓名数字或争议句时，打开 `*.strict.audit.md` 或 `*.strict.audit.json`，比较主/对照原文、相似度、规则命中、错误和选择依据。",
      "长音频只有在配置显式启用时，才把带 flags、needs_review 或低相似度的 chunk audit 送给本地 Ollama；调用在 ASR chunk 处理之后进行，`keep_alive=0` 让模型用完卸载。",
      "把仲裁决定追加到 merged audit / metrics，同时保留两路 strict raw JSON；Ollama 失败、缺失或响应不可解析时不改写基础结果。",
      "再读 `*.strict.review.json` 的结构化队列，按可用时间区间回到原音频逐项核听；评测 / benchmark 的聚合复核队列另看 `review.md`。",
      "需要追查模型到底返回什么时，分别打开主引擎和对照引擎的两路 `*.raw.json`，不把 raw 直接当最终稿。",
      "用 `*.strict.receipt.json` 复核六项内容制品的相对路径、字节数、SHA-256、引擎声明和 bundle hash；任何不一致都使 evidence unavailable，但一致仍不证明文字正确。",
      "长音频继续读 `manifest.json` 的输入/模型/切片/每段状态和 `metrics.json` 的耗时、相似度、风险；有人工 truth 的评测再读 `benchmark.md` 与 `benchmark.json`。",
      "只有执行、覆盖、质量和正式负向证据都闭合时才判断无语音；否则保持 indeterminate 或 speech_detected_but_not_transcribable。"
    ],
    concepts: [
      { term: "strict transcript（严格正文）", explanation: "`*.strict.md` 是给人先读的最终候选；其中的疑似和听不清标记不得被静默删掉。" },
      { term: "strict audit（严格审计）", explanation: "Markdown 便于阅读，JSON 便于机器处理；两者保存两路原文、分歧、规则命中、错误和选择依据。" },
      { term: "review projection（复核投影）", explanation: "`*.strict.review.json` 是单份严格结果的结构化队列；评测 / benchmark 的 `review.md` 再按 P0/P1/P2 汇总最值得人工复核的位置。" },
      { term: "objective outcome", explanation: "只表达音频内容的客观状态，不混入执行和覆盖失败。" },
      { term: "indeterminate（无法确定）", explanation: "当前证据不足，不能断言有语音或无语音。" },
      { term: "evidence receipt", explanation: "列出六项严格内容制品的相对路径、大小、SHA-256、声明与 bundle hash；它不是签名、可信时间戳、文字真值或事实认证。" },
      { term: "review queue（复核队列）", explanation: "按风险收集需要回听的句段，而不是让用户从头听完整录音。" },
      { term: "evidence-only arbitration（只读证据仲裁）", explanation: "可选本地 LLM 只看不确定 chunk 的两路文字、相似度、规则和上下文，结论进入 audit / metrics；它不听音频、不改 raw，也不替代人工核听。" }
    ],
    boundaries: [
      "SHA-256 一致只能证明字节未变，不能证明文字正确。",
      "verified 回执不能替代原音频和人工核听。",
      "Ollama 仲裁默认关闭；没有它时基础链必须稳定，启用它也不能把 LLM 偏好当成原始证据或最终真值。",
      "`keep_alive=0` 避免模型长期驻留 GPU；仲裁在 ASR chunk 完成后运行，不与两路 ASR 同时争抢资源。",
      "低分、空文本和失败必须分别表达。",
      "公开仓库不包含任何用户结果包。"
    ],
    failures: [
      { condition: "正文存在但主证据引擎失败", response: "保留文本但标为 provisional，并列出 evidence failure。" },
      { condition: "正文出现 `[疑似]`", response: "保留标记，按 audit 的两路原文和 review 时间/chunk 回听原音频；人工确认前不把候选润色成确定事实。" },
      { condition: "正文出现 `[听不清]`", response: "查看两路 raw、执行错误和客观结果，再回听原音频；它表示当前不能可靠转写，不等于没有语音。" },
      { condition: "空文本且覆盖或执行不完整", response: "返回 indeterminate，不宣称无语音。" },
      { condition: "回执引用的文件缺失、大小或指纹不符", response: "证据状态降为 unavailable，要求重新生成或恢复。" },
      { condition: "两路模型对关键句冲突", response: "保留两路原始输出、audit 依据和时间位置，进入人工回听；没有时间戳时按长音频 chunk 或原文上下文定位并保留未知。" },
      { condition: "显式启用仲裁但本地 Ollama 不可达或响应不是有效 JSON", response: "只把该 chunk 的仲裁标为不可用或低置信，保留两路 raw、原 audit 与人工复核队列；不重启服务、不覆盖正文，也不让基础长音频任务失败。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\audit.py", role: "双模型审计与风险汇总" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\risk_rules.py", role: "幻觉和格式风险规则" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\audio_outcome.py", role: "执行、覆盖、质量和客观结果" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\strict_writer.py", role: "strict 正文、audit、review、raw 与 receipt 成品写入" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\result_writer.py", role: "内容制品与 sidecar 写入" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\metadata.py", role: "输入、模型和制品身份" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\benchmark.py", role: "人工 truth 对齐、指标与 benchmark/review 成品" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\arbitration.py", role: "默认关闭的本地 Ollama evidence-only 仲裁、结构化请求与失败回退" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml", role: "llm_arbitration、uncertain_only、模型、11434 与 keep_alive=0 配置" }
    ],
    verification: [
      "audit、risk rules、audio outcome、result writer 和 metadata 单元测试包含在2026-08-31 的 345 项通过结果中。",
      "strict writer 与 benchmark 测试覆盖成品文件名、两路 raw、review 投影、静音出字、空文本、partial coverage、回执损坏、模型失败和 truth 对齐。",
      "test_arbitration.py 与 test_config.py 覆盖默认关闭、Ollama 主模型 qwen-main-v1:latest、fallback qwen3.6-27b-256k:latest、结构化请求、`uncertain_only`、`keep_alive=0`、有效 JSON 解析和无效响应回退；本轮没有调用真实 Ollama 模型。",
      "没有任何自动测试能够代替关键片段人工核听，页面明确保留该缺口。"
    ],
    relation: "模型、长音频和说话人模块产生的所有结果最终都经过本模块；可选 Ollama 只在长音频不确定 chunk 上增加一层不覆盖原证据的解释。模块向用户说明证据强度，但不负责决定真实人物、外部事实或最终文字真值。"
  },
  {
    slug: "speaker-attribution",
    usageEntry: "多人录音要求区分发言段；标本人时再明确提出。",
    usageInputs: ["要区分发言人的录音", "是否还要判断其中有无本人（如需要）"],
    productFlow: [{"title": "系统核对并处理", "detail": "先把不同声音按时间组成匿名组，真实身份另取证；相似声音不等于本人已确认。"}, {"title": "交付与接续", "detail": "交回分组与不确定性；证据不足保持匿名，后来纠正可撤回归属。"}],
    readerStatus: "已有匿名声音分组和可撤回归属线索；当前证据仍是推断，不能证明说话人的真实身份。",
    shortTitle: "发言人与时间",
    title: "区分不同声音，并允许以后纠正归属",
    searchAliases: ["录音里哪一段是我说的", "Speaker1是不是本人", "匿名说话人能不能证明身份", "单声道声纹分不清怎么办", "通话里有几个人说话"],
    searchProjection: {
      intents: ["查看逐句时间与匿名说话人", "判断哪些句子可能是本人", "估计参与人数但保留不可靠边界", "撤销旧本人声纹线索"],
      entities: ["Paraformer", "CAM++", "speaker cluster", "person:self profile", "held-out evidence"],
      relations: ["时间戳句段关联匿名 cluster", "留出声纹与声道联系人句义共同归属", "profile 指纹变化使旧声学证据失效", "cluster 数不等于真实人数"],
      failureRecovery: ["只有 Speaker 编号时保持匿名", "同源样本不能自证", "单声道歧义带且无其他可用依据时返回 unknown", "声学与上下文冲突时保留两侧依据，具体一致的上下文可支持可撤销推断"]
    },
    teaser: "先把不同声音匿名分开，再结合声道、声纹、联系人和上下文做有理由、可撤销的本人推断；证据打架时就保留未知。",
    status: "说话人投影与 2–3 来源本人档案单测通过；它仍是推断线索，不是身份认证",
    statusTone: "mixed",
    value: "把不同声音的发言按时间组织，帮助阅读多人讨论；匿名分组与本人明确确认的归属分开，错误归属可撤回。",
    why: "不同声音的分组不能告诉人名；同一个人换麦克风或环境，声音特征也会变。要把匿名发言、声音线索和现实归属分开。",
    example: "“把会议按不同发言人分段，先叫说话人1、2，不要猜你不知道的名字。”系统给匿名声音分组和相应文字，后续明确修正只影响已指定的归属。",
    result: "得到分段时间线、匿名声音组和有来源的归属记录；不是自动识别人名或证明身份。",
    readerStates: {
      "pass": "能确定声音片段和可靠上下文时，交回带理由、允许纠正的暂定归属；匿名分组仍保留。",
      "problem": "声音线索和聊天语境不一致时说明各自依据，不能只靠一个相似分数猜姓名。",
      "unavailable": "时间段或来源证据不能对应原音时只保留匿名组，无法确定的人保持未知。"
    },
    decisionImpact: [
      "Speaker 编号永远不是人物姓名。",
      "同原件 enrollment 不参与对外自证。",
      "本人 profile 只允许一个当前版本，替换后旧证据失效。",
      "单声道混音使用更宽风险带。",
      "有具体理由且彼此一致的上下文可暂时压过相反声学线索，必须同时保留反对依据并说明原因，结论仍为 inferred。",
      "无法消解的冲突、零长度时间或缺少时间戳时保持 unknown；不能把所有声学冲突一律写成不可归属。"
    ],
    problem: "解决匿名聚类被误当身份、拿同一录音建立和验证声纹、profile 撤销后旧结论继续有效、单声道边界分数强行归属，以及不同证据冲突却没有解释的问题。",
    implementation: [
      "Paraformer 可输出逐句时间和 CAM++ 匿名聚类。",
      "Paraformer 固定 `iic/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-pytorch@v2.0.4`；按需 person:self speaker verification 固定 CAM++ model revision v1.0.0、文件 campplus_cn_common.bin、阈值 0.31。",
      "speaker_evidence.py 建立唯一、私有、可替换的 person:self profile，并区分 enrollment 与 held-out。",
      "多参考模式只接受 2–3 个不同来源，生成有界质心而不是无限画像库。",
      "speaker_attribution.py 组合声学、声道、联系人、角色和句义依据；方向一致可给 inferred，方向冲突时仅在 contextual roles 唯一且有具体理由时采用上下文，否则 unknown。",
      "profile 指纹进入证据；删除或替换后旧声学证据不再参与归属。"
    ],
    flow: [
      "取得带时间位置的匿名说话人片段。",
      "按需加载当前 person:self profile，不扫描媒体库。",
      "判断当前片段是否与 enrollment 同源。",
      "计算声学分数和歧义带。",
      "合并调用方提供的声道、联系人、对话角色和句义依据。",
      "记录支持、反对与未知。",
      "输出可解释的 inferred 或 unknown；使用声纹证据时另绑定当前 profile 指纹。"
    ],
    concepts: [
      { term: "diarization", explanation: "把声音聚成匿名说话人；它回答“声音是否像不同人”，不回答姓名。" },
      { term: "person:self", explanation: "本机唯一、可替换的本人声纹线索档案。" },
      { term: "held-out", explanation: "来自另一原件的留出样本，用于避免同源自证。" },
      { term: "ambiguity band（歧义带）", explanation: "阈值附近不稳定的分数范围，落入时不做确定归属。" }
    ],
    boundaries: [
      "只处理具名录音任务，不扫描整个个人媒体库。",
      "声纹向量和私人上下文永不进入公开仓库或网页。",
      "归属是可撤销推断，不是生物识别认证。",
      "不能识别其他未知人物，也不建设中央人脸/声纹服务。"
    ],
    failures: [
      { condition: "只有 Speaker 编号", response: "保持匿名，不映射真实姓名。" },
      { condition: "profile 已撤销或指纹变化", response: "旧声学证据失效，其他独立上下文证据单独保留。" },
      { condition: "单声道混音分数接近阈值", response: "该分数进入更宽歧义带，不单独支持归属；仍可使用其他具体、有效的上下文，全部依据不足时才 unknown。" },
      { condition: "声学与具体上下文冲突", response: "同时记录两侧证据；只有上下文本身具体且一致时才说明为何暂时压过声学，并标为可撤销 inferred，否则 unknown。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\speaker_evidence.py", role: "person:self profile、留出证据和撤销" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\speaker_attribution.py", role: "上下文与声学证据组合投影" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_speaker_evidence.py", role: "profile、同源、留出和撤销回归" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_speaker_attribution.py", role: "双声道、单声道、时间线和冲突回归" }
    ],
    verification: [
      "speaker evidence 与 attribution 回归包含在2026-08-31 的 345 项全量通过结果中。",
      "configs/models.yaml 静态回读确认 CAM++ speaker verification revision=v1.0.0、threshold=0.31；本轮未加载真实私人 profile，也未把阈值冒充身份认证。",
      "fixtures 覆盖双声道、单声道 unknown、无时间戳、零长度时间和冲突证据；另有具体对话理由覆盖弱声纹反证、单声道歧义分数仍可由上下文判断，以及上下文本身冲突必须 unknown 的用例。",
      "本次没有读取任何私人声纹档案或录音，也没有执行人物身份判断。"
    ],
    relation: "本模块消费模型或 Paraformer 的时间线和审计结果；它只增加可解释人物线索，不能提高原转写文本本身的准确性。"
  },
  {
    slug: "runtime-privacy",
    usageEntry: "处理前说明用本地路线；确需云端时逐次明确上传范围。",
    usageInputs: ["本次原音和用途", "本地或云端选择", "云端时的单次授权"],
    productFlow: [{"title": "系统核对并处理", "detail": "日常录音在本地受管运行；更长或更重要不会自动授权上传，云端请求单独记录。"}, {"title": "交付与接续", "detail": "说明这次是否离开本机、模型是否真运行及失败位置，不把本地失败静默改成云处理。"}],
    readerStatus: "已有本地运行、资源协调与明确授权后的云端入口；本轮未运行模型或上传录音，普通本地请求不会自动上云。",
    shortTitle: "运行与边界",
    title: "本地运行、GPU 协调、专业云入口与公开边界",
    searchAliases: ["普通录音会上传云端吗", "重要录音怎样授权云转写", "两个语音模型抢显卡怎么办", "ASR密钥会不会写进日志", "云转写失败会不会冒充本地结果"],
    searchProjection: {
      intents: ["只在本机转写普通录音", "为一段重要录音授权一次云候选", "协调多个重 GPU 任务", "确认公开仓库不会带入私人结果"],
      entities: ["LocalGpuBroker", "SecretRef", "Alibaba Cloud Model Studio（阿里云百炼）", "qwen-audio-3.0-asr-flash", "127.0.0.1", "CloudUploadAuthorized"],
      relations: ["普通任务默认本地", "重要或质量复核用途与本次上传授权共同打开云入口", "SecretRef 只注入固定 worker", "OCR与ASR可并行但Ollama与二者互斥", "同类GPU任务仍串行"],
      failureRecovery: ["缺少任一云门就上传前 blocked", "GPU 冲突等待而不抢占", "云失败保持本地证据独立", "broker 身份失败时不取得密钥"]
    },
    teaser: "普通录音默认留在本机，GPU 协调器按工作类型安排租约：OCR 与 ASR 可并行，Ollama 与两者互斥，同类仍串行。只有明确选择重要录音或存疑转写质量复核，并授权这一次上传，才打开云候选入口。",
    status: "短进程租约与异常 worker 回收有来源真实验收；本轮不运行 GPU、云调用或壁纸观测",
    statusTone: "mixed",
    value: "日常录音不会因为更长或想追求更强模型就悄悄上传。我可以明确选择本地证据链，也可以对一段重要录音逐次授权一个云候选，并看清这一次到底有没有离开本机。",
    why: "录音可能含私人对话，几个本地模型也会争用同一块显卡。项目明确区分本地处理、显卡等待和这一次是否上传，避免悄悄换路线或泄露凭据。",
    example: "我问“普通录音会上传吗？”答案是不会。若我明确要求对一段重要录音使用云端，并授权这次上传，项目才尝试固定云路线；授权或网络条件不齐时只停云端部分，本地已有结果仍在。",
    result: "交回这次音频留在本机还是已实际上传、使用哪条识别路线、结果放在哪里，以及失败停在哪一步。云端不可用不会抹掉已保存的本地转写。",
    readerStates: {
      "pass": "本地运行条件满足时按本地路线处理；只有本次云用途和上传许可都明确时才执行云候选。",
      "problem": "显卡忙、网络失败或云端限流时保留已有本地结果和具体原因，按可行条件再继续。",
      "unavailable": "凭据、模型或运行环境不可用时只阻断受影响路线，不露出秘密或自行换到别的服务。"
    },
    decisionImpact: [
      "普通、批量和长音频默认不上传。",
      "Important 与 QualityReview 必须且只能选一个，CloudUploadAuthorized 仍独立必需。",
      "密钥不进入命令行、请求文件、日志和转写结果。",
      "OCR 与 ASR 可以各持一份租约并行；同类任务仍串行，Ollama 活跃请求或会话与二者互斥，不绕过 Broker 抢占未知工作负载。",
      "网络和云失败不会污染本地证据链。",
      "公开仓库只保留源码、测试与文档。"
    ],
    problem: "解决音频隐私边界不清、云上传被默认触发、密钥泄露、GPU 并发冲突、服务进程失控，以及公开仓库误纳入模型权重、用户音频和生成结果的问题。",
    implementation: [
      "听写采用常驻受监督模型子进程，空闲权重留 RAM，录音与推理申请自己的 GPU 租约；加载 180 秒、激活/推理 60 秒、预热 40 秒、停车 20 秒均有上限。准备失败可点麦克风重试，不要求重启 Windows。",
      "听写音频与识别结果不保存为历史文件；outputs/dictation/runtime.log 只记运行错误、耗时与字数，最近完整文本仅供本次托盘主动复制。",
      "默认 pipeline 和 Smart API 使用本机模型与本机回环服务。",
      "ASR 租约最多 120 秒并每 20 秒续租；真实模型 worker 接管 PID/创建时间身份，监督进程消失时 watchdog 清理本任务 WSL 后代。无法查询进程不是已死证明，旧六小时请求也不能重新占用数小时。",
      "OCR/ASR 可跨族并行、同族串行，Ollama 重型请求与二者互斥；合法文件作业占用时听写保留内存音频并显示真实阻断，可 Esc 取消。辅助进程隐藏，不暂停 Wallpaper Engine 或创建广泛 Python/WSL 播放规则。",
      "FireRed worker 隔离在专用运行环境，不改变默认模型。",
      "asr-professional-cloud.ps1 在读音频前要求 Important / QualityReview 二选一及 CloudUploadAuthorized；重要路线写 importance=important，质量复核写 purpose=quality_review 且不写 importance。",
      "qwen_audio3_broker_worker.py 只接受固定请求结构和 SecretRef 注入，唯一 provider 为 Alibaba Cloud Model Studio（阿里云百炼），同步 API model id 固定 `qwen-audio-3.0-asr-flash`。",
      "云音频仍本地转 16 kHz mono 并切成最长 180 秒，通过固定同步 Base64 HTTPS 入口发送；成功块可保存复用，已经发出但结果不明的请求不能盲重试重复计费，filetrans 路线仍未接入。",
      "transcript_readback.py 同时检索已保留本地 job 与完成态云结果，核对 schema、purpose、成功状态、原音哈希、每块范围和输出字节；完整云块只形成 chunk 时间粒度，quality 保持 unknown，不因更新日期更近就优先。",
      "普通质量复核不会自动再启动 FireRed/Qwen 双引擎；只有仍影响理解的分歧才按需要回核原音和本地结果，重要证据路线继续保留本地证据链与人工核听。",
      "outputs、models、私人评测、wheelhouse 和录音由 Git ignore 与公开门排除。"
    ],
    flow: [
      "根据请求选择本地或专业云路线。",
      "本地路线检查代理、GPU、依赖和模型。",
      "重模型取得 GPU 租约并启动受管进程。",
      "云路线在读取音频前验证唯一用途、上传授权与固定 worker 的 broker 绑定。",
      "本地切片后只向阿里云百炼 `qwen-audio-3.0-asr-flash` 同步接口发送最长 180 秒的 Base64 片段；filetrans 路线保持未接入。",
      "密钥只注入固定子进程环境。",
      "执行结果写入被 Git 忽略的本地输出。",
      "失败后返回本地后备或精确恢复条件。"
    ],
    concepts: [
      { term: "local-first（本地优先）", explanation: "默认音频和模型推理都留在本机；云是独立显式路线。" },
      { term: "GPU lease（显卡租约）", explanation: "绑定工作类型、持有者和有效期的可回收许可；同类互斥，OCR/ASR 可共存，Ollama 与两者互斥。" },
      { term: "SecretRef", explanation: "引用密钥而不让模型或命令得到明文。" },
      { term: "cloud upload authorization（本次云上传授权）", explanation: "仅针对当前选定录音、明确用途和当前一次上传，不是长期默认同意。" }
    ],
    boundaries: [
      "云入口不能由普通模式、文件夹批量或音频长度隐式触发。",
      "云入口的精确数据目的地是阿里云百炼同步模型 qwen-audio-3.0-asr-flash；需要公网 URL 的 qwen-audio-3.0-asr-flash-filetrans 不属于当前能力。",
      "任何输出都不能包含 API Key。",
      "本地 API 只监听 127.0.0.1。",
      "项目不结束未知 GPU 任务，也不通过强占资源制造成功。",
      "公开仓库不包含私人 payload 与模型权重。"
    ],
    failures: [
      { condition: "缺少用途、同时选两个用途或缺少本次上传授权", response: "在读取和上传前返回 blocked，不调用 broker；普通质量复核不能通过假报重要性绕过用途检查。" },
      { condition: "Secret Broker 或固定 worker 身份失败", response: "不取得密钥、不上传，建议使用本地路线。" },
      { condition: "同类 GPU 租约占用或 Ollama 活跃请求/会话冲突", response: "受影响任务保持 blocked 或等待；OCR 与 ASR 的允许共存不被当成冲突，也不绕过租约。" },
      { condition: "云网络、限流或 5xx", response: "保留已成功块与本地证据；先区分未发出、明确失败和结果不明，后者不盲重发。取消就是终止，不自动再申请模型或因子授权。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\gpu_broker.py", role: "GPU 租约与服务协调" },
      { path: "E:\\PCConfig\\tools\\local_gpu_broker\\broker.py", role: "OCR/ASR 分类共存、同类串行与 Ollama 互斥的所属实现；本轮只读源码，未调用服务" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\proxy_guard.py", role: "代理环境与本地请求边界" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\asr-professional-cloud.ps1", role: "重要录音显式云入口" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\qwen_audio3_broker_worker.py", role: "固定云 worker 与密钥消费" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\docs\\public-release.md", role: "公开仓库内容与生成物边界" }
    ],
    verification: [
      "2026-08-31 Doctor 确认 GPU、代理、FunASR、Qwen ASR、PyTorch 和模型目录可读；本轮只做源码与定向合成回归。",
      "GPU broker、proxy guard、professional cloud script 和 broker worker 回归包含在 2026-08-31 的 345 项通过结果中。",
      "源码与测试固定 Alibaba Cloud Model Studio / qwen-audio-3.0-asr-flash、180 秒本地切片、HTTPS Base64 和一次有界重试；这些静态/测试事实不证明本轮云调用成功。",
      "9 月 17 日来源 482 项回归与真实监督进程异常退出/worker租约回收通过，PCConfig 64 项 Broker 与 63 项配置恢复测试分别通过。本轮仅只读任务和对齐元数据，未把静态壁纸配置审计称为逐帧连续播放证明。",
      "本次没有调用云端、没有上传音频、没有消费密钥或额度，也没有运行重模型真实 smoke。"
    ],
    relation: "安装与恢复模块先提供可执行依赖和模型工件；本模块再为所有路线施加 GPU、进程、网络与隐私边界。它不决定正文质量，但决定某条处理路线是否允许执行、数据去了哪里。"
  },
  {
    "slug": "known-text-alignment",
    usageEntry: "给已有音频和确认文案，要求标出逐词起止时间。",
    usageInputs: ["现成音频", "对应且已确认的文案"],
    productFlow: [{"title": "系统核对并处理", "detail": "核对输入对应后只按声音找词语时间，检查覆盖、顺序与输入是否变化，不重新判断文案真假。"}, {"title": "交付与接续", "detail": "交回词语秒数及原件身份；超长、覆盖不全或模型不可用时保留旧输出。"}],
    "readerStatus": "已有把确认文案对齐到音频的入口和公开音频验收；本轮只核对模型文件，没有重新执行，对齐也不验证文案真假。",
    "shortTitle": "文案与音频对齐",
    "title": "已有音频和确认文案，只找每个词在声音中的位置",
    "searchAliases": [
      "视频旁白怎样生成词语时间",
      "已有文案不重新识别或配音",
      "Qwen强制对齐300秒"
    ],
    "searchProjection": {
      "intents": [
        "把确认文案定位到音频时间",
        "复用ChineseASR给视频做踩点",
        "只重对齐不重新配音"
      ],
      "entities": [
        "alignment-info",
        "zh_asr align",
        "Qwen3-ForcedAligner-0.6B",
        "zh_asr.alignment-entry.v1"
      ],
      "relations": [
        "音频与UTF8文案共同绑定逐词秒数",
        "视频工程复用同一模型而不维护第二份ASR"
      ],
      "failureRecovery": [
        "超300秒按审阅分镜拆场",
        "输入改变或覆盖不全保留旧成功结果",
        "取消后不自动重试"
      ]
    },
    "teaser": "视频已经配好旁白，或手头已有确认文本时，只借用一个共享对齐器找踩点。它找位置，不证明稿子真的说对了。",
    "status": "固定对齐器与共享入口已实现，来源有公开音频验收；本轮只读确认工件存在，未运行模型",
    "statusTone": "mixed",
    "value": "我不用为改动画踩点再花一次配音费用，也不用让视频项目安装另一套语音识别。把一段现成音频和已确认文案交过来，就能取得词语出现的秒数，同时知道有没有漏对齐、来源有没有变。",
    "why": "重新识别可能把已经确认的名字和措辞改掉，按字数平均分配时间又会错过停顿和语速变化。这里把“说了什么”的确认与“这句话在哪一秒”分开，只处理后一个问题。",
    "example": "“这段旁白已经满意，请给确认过的稿子标词语时间，别重新配音。”项目将原音与文案对齐，交回每个词从哪一秒到哪一秒；单段超过五分钟就按真实声音拆分，不能按文字长度猜时间。",
    "result": "得到每个词在现成音频中的起止时间，附音频与文案的版本依据。覆盖不全或输入中途变化时保留旧结果；对齐成功仍不证明文案本身说得对。",
    "readerStates": {
      "pass": "原音和文案对应、时间顺序与覆盖都核对后，交回完整词语时间轴。",
      "problem": "词语漏对、秒数异常或输入变了时不覆盖旧成果，说明具体缺口。",
      "unavailable": "模型或显卡不可用、任务取消或超时，只停本次对齐；不下载、不上传或改走听写。"
    },
    "decisionImpact": [
      "这个入口接收已给出的文字，不负责证明声音逐字对应；重要内容仍要另行识别或人工核听。",
      "单场最长 300 秒，超长按已审阅分镜拆分，不能按字符比例猜时间。",
      "默认 cuda:0 与既有GPU协调器；CPU必须显式 --device cpu，仍有子进程期限和清理。",
      "输出不能指向音频或文案原件；失败与取消不覆盖上份成功结果。"
    ],
    "problem": "解决视频重复安装语音模型、只改时间却重新付费配音、按字数猜踩点，以及半份或错误来源时间轴覆盖已接受成果的问题。",
    "implementation": [
      "命令 python -B -m zh_asr alignment-info 只读配置与路径，不加载模型；align 接收一个音频、UTF-8 --text-file、--output 与 --timeout-sec。",
      "当前 Qwen/Qwen3-ForcedAligner-0.6B 固定 revision=c7cbfc2048c462b0d63a45797104fc9db3ad62b7，模型位于 models/aligner 对应版本目录，artifact_lock=configs/model-locks/qwen3-forced-aligner-0.6b.json，runtime qwen-asr=0.0.6。",
      "现有音频前处理在本任务临时目录转 PCM，沿用受监督可终止 worker 和 GPU 短租约，不建立新监听口、后台服务或双模型转写任务。",
      "先核验模型及对齐覆盖/时间范围，写入前重新核对音频与文本 SHA-256；只有完整成功才原子替换输出。",
      "fetch-aligner/verify-aligner 由既有 model_lifecycle 明确执行：只从不可变锁恢复缺文件，异常已安装字节不被重新生成哈希批准。"
    ],
    "flow": [
      "确认已经接受的文案和对应音频，单场不超过 300 秒。",
      "用 alignment-info 查看当前适配和工件；文件存在不等于此次推理通过。",
      "明确调用 align，取得原件指纹并在独立临时目录准备 PCM。",
      "核验固定模型，取得合法进程租约，执行有期限的对齐。",
      "核对覆盖、秒数和两份原件仍未变化，再原子交回 JSON。",
      "消费者按词轴做预览、动画或字幕，重要词句仍听音验收；失败保留旧成果。"
    ],
    "concepts": [
      {
        "term": "forced alignment（强制对齐）",
        "explanation": "给模型声音和已知文字，找文字的位置；不是重新识别，更不认证文字真伪。"
      },
      {
        "term": "lexical_truth_verified=false",
        "explanation": "这份结果没有证明词汇本身正确，哪怕覆盖完整、哈希一致、时间单调。"
      },
      {
        "term": "原子交付",
        "explanation": "完整结果先核对，最后一次替换目标；半成品、超时或被修改的输入不能覆盖旧成功文件。"
      }
    ],
    "boundaries": [
      "不重新生成配音、不启动双模型或桌面听写，不增加另一套模型清单。",
      "不自动下载或升级权重、不上传音频，不把CPU当GPU失败后的静默退路。",
      "对齐不替代Paraformer的匿名说话人分离，也不构成人物身份确认。",
      "模型锁不是权重备份，完整新机恢复仍需相应依赖与模型工件。"
    ],
    "failures": [
      {
        "condition": "模型或权重缺失",
        "response": "本次对齐不可用，按现有固定锁恢复流程处理；原音频、文案和旧词轴保持不变。"
      },
      {
        "condition": "单场超过300秒",
        "response": "明确拒绝，按审阅后的分镜切成真实音频段，不从文字长度伪造分段位置。"
      },
      {
        "condition": "输入改变、覆盖不全或时间异常",
        "response": "不替换输出，报告具体覆盖/身份问题并保留上次成功成果。"
      },
      {
        "condition": "取消、超时或租约丢失",
        "response": "终止本次受管worker与相关临时物，不自动重试或占用他人资源。"
      }
    ],
    "sources": [
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\docs\\known-text-alignment.md",
        "role": "输入、原子输出、词汇真值与300秒边界的当前产品合同"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\docs\\quality-and-model-maintenance.md",
        "role": "对齐模型生命周期、固定锁、质量与实际验收分层"
      },
      {
        "path": "E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml",
        "role": "唯一模型、运行时、对齐目录和时长配置"
      }
    ],
    "verification": [
      "2026-09-18 13:30:47 UTC 本轮 alignment-info 为 read_only=true，返回固定Qwen对齐器目录、weights_present=true、max_audio_sec=300；未加载或重哈希权重。",
      "9月17日来源收尾记录真实公开音频Qwen3-ForcedAligner和文件流程验收通过；本轮没有重跑，也不把该短样例视作任意旁白零误差保证。",
      "取消、输入变化、覆盖检查和进程清理的源码合同与真实音频证据分别成立，最终消费者仍需听音预览。"
    ],
    "relation": "本模块让 video-scaffold 等已有音频与确认文案的调用方复用 ChineseASR 对齐能力；模型、原件与时间证据留在此处，画面编排和最终成片验收仍归视频工程。"
  },
];

export const project = chineseAsrProject;
export const modules = chineseAsrModules;
