export const chineseAsrProject = {
  order: 4,
  slug: "chinese-asr",
  title: "ChineseASR",
  route: "/projects/chinese-asr",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "中文转写、长录音续跑和可复核结果包已经实现",
  cardStatusTone: "pass",
  snapshotBoundary: "当前 70e3255 源码与 345 项单元回归已核对；历史真实四切片 E2E 可回读，但本轮没有用私人录音重跑模型，也不把自动文字当成事实认证",
  repositoryNote: "源代码位于 PUBLIC（公开）GitHub（代码托管平台）仓库；模型权重、私人录音、转写结果、声纹向量、云端请求和本机缓存不进入仓库，也不进入本页。",
  summary: "ChineseASR 把一段中文录音变成一份能搜索、能继续处理、能回到原音频人工复核的转写包，而不是只吐出一段看似通顺的文字。默认结果保留正文、原始输出、风险和失败证据；需要逐段时间线、匿名说话人或本人线索时再显式选择对应路线。中断后可以接着跑，普通录音默认留在本机。姓名、数字、承诺和争议语句仍以原音频为准。",
  why: "中文录音最危险的问题不是单纯“识别错一个字”，而是模型在静音、噪声、方言、专有名词或长音频切片处生成看似通顺的错误内容。普通结果还可能只有正文而没有完整逐句时间线；如果不保留输入指纹、模型版本、失败证据和可选定位路线，事后既不知道错在哪里，也无法判断重跑是否真的更可靠。",
  plainExample: "例如我说“把这段两小时会议录音整理成可复核纪要，中断后别从头来”。它会按连续分段处理，保留已经完成、失败和需要重跑的片段；默认交付正文、原始结果、风险与恢复入口。如果我还要求逐段定位和匿名说话人，再显式加入 Paraformer 时间线。产品本身没有内置音频播放器或保证可点击跳转。",
  result: "我最终会得到一个与原录音绑定的转写包：默认包含可读正文、模型与参数身份、原始 JSON、审计和质量字段、失败或疑似内容以及恢复入口；时间位置、匿名说话人和本人线索只在所选路线真实提供时加入。系统能证明的是“这份结果由哪个输入和流程生成、哪里有风险”；原录音仍是真相来源，关键内容仍需人工回听。",
  readerStates: {
    pass: "音频可读、目标模式可用且任务完成时，返回正文和结构化证据包；严格模式保留两路模型结果与风险判断，时间位置只在对应引擎真实提供时出现。",
    problem: "某个引擎失败、两路分歧、检测到疑似幻觉或长音频只有部分完成时，保留可用片段但明确标为 provisional（暂定）或需要复核，不把降级结果冒充完整成功。",
    unavailable: "模型、GPU（图形处理器）、音频解码、任务服务或必要授权不可用时，返回具体阻断位置和已有任务身份；不反复提交同一录音，也不自动把普通录音上传云端。"
  },
  cardMetrics: [
    { label: "引擎", value: "6" },
    { label: "回归", value: "345/345" },
    { label: "真实长音频", value: "4/4" }
  ],
  heroFacts: [
    { label: "日常默认", value: "strict：Qwen3-ASR-1.7B + SenseVoiceSmall；quick：SenseVoiceSmall" },
    { label: "重要录音本地证据", value: "FireRedASR2-LLM + Qwen3-ASR-1.7B，必须显式选择" },
    { label: "时间线与匿名说话人", value: "Paraformer + CAM++；cluster 不是人物身份" },
    { label: "重要录音云候选", value: "Qwen Audio 3.0 ASR Flash；必须同时确认重要性和本次上传授权" },
    { label: "其他显式 Profile", value: "Fun-ASR-Nano-2512、Whisper Large V3；已登记但都不是默认" },
    { label: "本轮快照", value: "PUBLIC main=70e3255；345/345 单元测试用时 83.035 秒；Doctor 识别 6 个引擎与 32607 MiB 显存；历史真实长音频 4/4 切片，续跑 0 processed / 4 skipped" }
  ],
  productPrinciples: [
    { title: "原音频始终是真相来源", detail: "转写首先是搜索和回听导航，不是录音真实性、说话人身份或法律事实认证。" },
    { title: "流畅不等于可靠", detail: "模型越能生成通顺文字，越要把不确定、分歧和疑似内容变成可定位的复核清单。" },
    { title: "交付的是结果包，不是孤立正文", detail: "正文、时间位置、原始结果、风险、失败和恢复入口共同绑定同一音频。" },
    { title: "长录音可以暂停和继续", detail: "每个分段都能核对和恢复，中断只补缺失部分，不把两小时任务当成一次容易超时的命令。" },
    { title: "默认路线不能被安装变化偷偷改掉", detail: "日常、严格、重要录音和时间线模式各有清楚含义；新增模型必须显式接入，不能改变旧请求。" },
    { title: "普通录音本地优先", detail: "只有录音确实重要且本次上传得到明确授权，才进入一次云候选；文件较长或批量不构成上传理由。" },
    { title: "声音线索不等于人物身份", detail: "匿名说话人、本人声学线索和真实身份分开；证据冲突或单声道歧义时保持未知。" },
    { title: "部分成功也要诚实有用", detail: "可用片段、暂定结果、失败位置和无法运行分别返回，不把降级或空文本冒充完整成功。" }
  ],
  responsibilities: [
    "提供中文单文件、长音频和文件夹批量转写的统一入口",
    "维护 quick（快速）与 strict（严格）等模式和可替换模型 Profile（配置档案）",
    "维护异步任务、状态查询、缓存去重、取消、期限和断点续跑",
    "生成正文、原始结果、审计、指标、manifest（清单）和客观音频结果",
    "提供时间线、匿名说话人聚类和有边界的本人声纹线索",
    "维护本地优先、重要录音显式云授权、秘密盲注入和 GPU 资源协调边界"
  ],
  exclusions: [
    "不把自动转写当成录音真实性、说话人身份或法律事实认证",
    "不保证模型输出逐字正确；关键姓名、数字、承诺和争议语句仍需回听原音频",
    "不把匿名 Speaker 1 / Speaker 2 直接映射成真实人物",
    "不在普通、批量或仅因音频较长的情况下自动上传云端",
    "不上传或公开私人录音、转写正文、声纹向量、模型权重和 API Key（接口密钥）；本地结果只按明确任务生成、保存和交付，由用户掌控",
    "不以英文、多语种字幕生产、音频剪辑或通用语音助手作为当前主目标"
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
    { term: "evidence receipt（证据回执）", meaning: "把内容文件、大小、指纹、模型身份和状态绑定起来的一致性清单；不是数字签名或可信时间戳。" },
    { term: "GPU broker（图形处理器协调器）", meaning: "串行管理重模型对显卡的占用，防止两个任务同时抢显存并拖垮桌面。" },
    { term: "SecretRef（秘密引用）", meaning: "只引用受管密钥，不把密钥值放进命令、日志、Git 或模型上下文。" },
    { term: "E2E（端到端验证）", meaning: "使用真实音频从入口跑到最终文件并检查用户可见结果；单元测试和 Doctor 不能替代它。" }
  ],
  currentState: {
    observedAt: "2026-08-31T11:59:37.2566597Z",
    label: "当前源码、345 项单元测试与本机依赖已闭合；历史真实 E2E 可回读，本轮没有重跑录音模型",
    facts: [
      "当前日常模型已经固定：quick 使用 SenseVoiceSmall；strict 使用 Qwen3-ASR-1.7B 主引擎加 SenseVoiceSmall 对照。重要录音本地证据路线可显式使用 FireRedASR2-LLM 加 Qwen3-ASR-1.7B；时间线与匿名说话人使用 Paraformer 加 CAM++；明确授权的云候选是 Qwen Audio 3.0 ASR Flash。",
      "PUBLIC（公开）main 当前提交为 70e3255326ad8ba7b0e335fdf6b4a19caf0d8029；本地主检出与 origin/main 为 0/0，工作树干净。",
      "2026-08-31 本次 fresh（新鲜）验证运行 345 项单元测试，内部用时 83.035 秒，345 项全部通过。测试覆盖配置、流水线、长音频、批量、服务、结果写入、审计、客观音频状态、GPU 协调、云入口、说话人证据和归属投影。",
      "Doctor（环境体检）现场识别到 NVIDIA GeForce RTX 5090 D、驱动 610.88、32607 MiB 显存；WinHTTP 为直连，代理环境干净。",
      "FunASR、Qwen ASR 和 PyTorch 均已安装；模型配置文件可读，默认快速引擎为 SenseVoice，严格模式为 Qwen3-ASR-1.7B 加 SenseVoice。",
      "当前模型 Registry（登记表）公开六个显式引擎：FireRedASR2-LLM、Fun-ASR-Nano-2512、Paraformer、Qwen3-ASR-1.7B、SenseVoiceSmall 和 Whisper Large V3；登记不代表每个引擎本次都跑过真实音频。",
      "主分支已包含有界说话人证据回读、可撤销 person:self 档案、时间戳通话归属、单声道歧义失败关闭和 profile 撤销后旧证据失效。",
      "最新说话人证据回读会在处理前后再次核对目标媒体快照；文件被替换或改变时失败关闭，不让旧媒体证据落到新文件上。",
      "历史公开验收曾用超过 40 秒的中文电话录音完成四切片 FireRed + Qwen 路线，四段均 verified；相同请求续跑为 0 processed / 4 skipped，默认 strict smoke 也有独立历史通过记录。"
    ],
    gaps: [
      "本次为了建设看板只运行全量单元测试，没有占用重模型重跑 scripts\\smoke-asr-smart.ps1；历史 E2E 仍是真实成品证据，但不能冒充本轮 fresh 模型验收。",
      "重要录音的 FireRed + Qwen 证据链 smoke 需要指定真实音频并实际核听，本次没有运行；云入口还需要明确本次重要录音与上传授权，也没有调用。",
      "Git Owner 仍登记一个已合并、干净、无唯一提交的旧 speaker-attribution 工作树。它不影响 main 的产品状态，但在确认没有外部任务依赖前不自动删除。",
      "模型转写、声纹分数、匿名聚类和回执都不能单独证明真实说话人、外部事实或关键语句正确；需要原音频、上下文和人工复核。",
      "真实录音 benchmark、模型组合调优和 VAD（语音活动检测）切片校准属于使用期工作，不是当前源码关闭阻断，但会影响特定录音上的实际准确率。"
    ]
  },
  operatingFlow: [
    { title: "先确认输入和目标", detail: "固定音频文件、输入指纹、语言、普通或重要录音、快速或严格模式，以及是否需要时间线和说话人线索。" },
    { title: "做音频预处理和任务去重", detail: "检查格式与可读性，必要时规范为 16 kHz 单声道；根据输入和请求生成 job key，已有相同任务时复用而不重复跑模型。" },
    { title: "选择处理路线", detail: "普通快速任务走 SenseVoice；高可靠任务走 Qwen 主引擎加 SenseVoice 对照；显式需求才选择 FireRed、Paraformer 或专业云入口。" },
    { title: "执行或恢复任务", detail: "短音频进入异步 job；长音频生成连续分段清单，已完成片段在相同身份下可断点续跑。" },
    { title: "生成正文和证据层", detail: "分别保存整理正文、原始结果、审计、指标、objective sidecar（客观结果侧车文件）和 manifest，不让某一层覆盖另一层。" },
    { title: "处理分歧与身份线索", detail: "把模型分歧、疑似幻觉、匿名说话人和 person:self 线索放进可复核结构；证据不足时保持 unknown（未知）。" },
    { title: "交付并说明边界", detail: "返回可打开文件、任务状态、复核清单和恢复入口；关键事实要求回到原音频核听。" }
  ],
  components: [
    { name: "模型 Registry", responsibility: "集中声明引擎、版本、能力、运行方式和默认角色。", implementation: "configs/models.yaml 是唯一配置面；quick/strict 默认和显式 profile 不由脚本临时改写。" },
    { name: "音频前端", responsibility: "读取、校验和规范音频，为不同引擎提供一致输入。", implementation: "src/zh_asr/audio_frontend.py 负责格式、语音区间和输入身份。" },
    { name: "转写 Pipeline", responsibility: "组织主引擎、对照引擎、降级、文本和状态。", implementation: "src/zh_asr/pipeline.py 与 adapters 组合模型，不把某个模型写死为全部场景。" },
    { name: "Smart API 与 job 服务", responsibility: "异步提交、状态查询、期限、取消和复用。", implementation: "src/zh_asr/service.py 加 scripts/asr-smart.ps1；调用方短等待，重任务继续由本地服务监管。" },
    { name: "长音频引擎", responsibility: "连续切片、manifest、分段状态和断点续跑。", implementation: "src/zh_asr/long_audio.py 保证时间线闭合，并把分段结果交给仲裁层。" },
    { name: "批量转写", responsibility: "按文件组织任务并复用已加载模型。", implementation: "src/zh_asr/batch.py 与 transcribe-folder.ps1 避免每个文件重复冷启动。" },
    { name: "审计与风险规则", responsibility: "检测分歧、静音出字、模板废话、重复和格式异常。", implementation: "audit.py、risk_rules.py、strict_writer.py 分别保存风险、疑似标记和复核队列。" },
    { name: "客观结果 Sidecar", responsibility: "把执行、覆盖、质量与语音结果分开。", implementation: "audio_outcome.py 生成结构化 sidecar，避免空文本直接被解释为无语音。" },
    { name: "说话人证据", responsibility: "提供匿名聚类、时间线和有边界的本人声音线索。", implementation: "speaker_evidence.py 与 speaker_attribution.py 组合声学、声道和调用方上下文；冲突时回到 unknown。" },
    { name: "证据回执", responsibility: "绑定内容文件、指纹、大小、引擎身份和状态。", implementation: "result_writer.py 与 metadata.py 生成自包含一致性清单，但不冒充外部签名。" },
    { name: "GPU 与进程控制", responsibility: "防止重模型互抢资源，并回收超时或失联进程。", implementation: "gpu_broker.py、process_control.py 和本地任务生命周期共同控制显存与进程树。" },
    { name: "专业云入口", responsibility: "只为明确的重要录音提供一次受控云候选。", implementation: "asr-professional-cloud.ps1 同时要求重要性和本次上传授权，密钥由 SecretRef 注入固定 worker。" }
  ],
  usageExamples: [
    { ask: "把这段微信语音转成文字。", effect: "使用本地日常转写，返回可读正文、原始结果和风险提示；普通请求不会触发云上传。" },
    { ask: "这段会议很重要，尽量降低看似通顺的错话。", effect: "使用严格双路转写，保留两份结果的分歧、风险标记和需要回听的句段；必要时再明确选择更重的证据路线。" },
    { ask: "把两小时录音处理完，中断后别从头来。", effect: "按连续时间分段保存进度，中断后只补缺失或失效片段，不重复完成部分。" },
    { ask: "把这个文件夹的录音都转写。", effect: "批量入口复用已加载模型，逐文件生成独立结果与失败状态，不用一个文件失败拖垮全部。" },
    { ask: "告诉我哪一段可能是我说的。", effect: "结合本人声音线索、声道、联系人、对话角色和句义；证据冲突或单声道歧义时明确说无法确认。" },
    { ask: "这段录音是不是完全没人说话？", effect: "只有处理完整且有规范负向证据时才说没有检测到语音；空文本、缺段或失败都保持无法判断。" },
    { ask: "模型卡住了，我要不要再提交一次？", effect: "先看现有任务和恢复标识；仍在运行就继续观察，超时或失败沿原任务恢复，不盲目复制重任务。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码层）", proves: "当前 main 中实际存在的模型路由、任务、审计、边界和测试实现。", doesNotProve: "本机已经安装、服务正在运行或真实录音效果正确。" },
    { layer: "Unit tests（单元测试层）", proves: "345 个受控场景的逻辑、媒体替换失败关闭、结构和回归当前通过。", doesNotProve: "真实 GPU 模型加载、音频质量、端到端耗时和人工听感。" },
    { layer: "Doctor（环境体检层）", proves: "GPU、核心依赖、模型配置和本机缓存入口当前可被识别。", doesNotProve: "每个 profile 都完成真实推理，也不证明服务没有运行期故障。" },
    { layer: "Runtime smoke（运行冒烟层）", proves: "指定入口、真实样本、模型和最终文件从头到尾能够完成。", doesNotProve: "对任意录音准确，或所有重要语句已经人工核听。" },
    { layer: "Historical real E2E（历史真实端到端）", proves: "超过 40 秒中文电话录音的四切片 FireRed + Qwen 路线曾全部 verified，续跑复用了四段结果。", doesNotProve: "本轮模型、任意私人录音或每个字仍然正确。" },
    { layer: "Content receipt（内容回执层）", proves: "输入、模型、输出文件、指纹和状态在一个结果包内一致。", doesNotProve: "外部真实性、可信时间戳、说话人身份或文字事实正确。" },
    { layer: "Benchmark（基准评测层）", proves: "固定语料和 truth（人工真值）下的字错率、风险和模型对比。", doesNotProve: "用户下一段录音具有相同声学条件和准确率。" },
    { layer: "Human review（人工复核层）", proves: "关键片段已回到原音频核听并被人确认。", doesNotProve: "未听部分或不同原件也正确。" }
  ],
  evolution: [
    { date: "2026-07-06", commit: "a280a54–ad37f35", result: "从本地中文转写脚手架演化为双模型严格模式、模型 Registry、批量入口、审计与风险规则、基准评测、离线安装、异步 API 和长音频断点续跑的第一版完整产品。" },
    { date: "2026-07-08—07-25", commit: "89d0cd2–282989a", result: "修正本地端口与 GPU 串行，增加安全 observer projection（观察投影），让上层可以读取有界状态而不是直接暴露内部任务目录。" },
    { date: "2026-07-29—08-02", commit: "c788100–eeb41d0", result: "加入 FireRed 证据级本地路线及完整回执，并建立仅重要录音、仅本次明确授权才可调用的 Qwen Audio 云候选；不兼容说话人模型被主动禁用。" },
    { date: "2026-08-09—08-17", commit: "a2c0b2b–b596098", result: "收紧音频来源、刷新显式 FunASR profile，并把空文本改造成执行、覆盖、质量和客观音频结果正交表达，避免失败被解释成无语音。" },
    { date: "2026-08-21", commit: "07516fa", result: "文件夹批量开始复用已加载模型，减少重复冷启动，同时保留每个文件独立的任务和失败边界。" },
    { date: "2026-08-24", commit: "fe11e0c–cfcc7a7", result: "建立失败关闭的说话人归属投影、可撤销 person:self 声纹线索、时间戳通话上下文和 2–3 来源的有界多参考档案；单声道歧义不再被强行赋予身份。" },
    { date: "2026-08-27—08-28", commit: "7bd1dd4–8792432", result: "完成任务生命周期、缓存完整性、云失败路由、文本规范和说话人证据回读加固；当前 main 进入维护与真实使用校准阶段。" },
    { date: "2026-08-30—08-31", commit: "70e3255", result: "补上说话人证据读取期间的目标媒体快照复核：文件被替换或改变时立即失败关闭，避免证据与目标错配。" }
  ],
  operationalEntrypoints: [
    { name: "环境体检", command: "E:\\Projects\\Tools\\ChineseASR\\scripts\\doctor.ps1", purpose: "检查代理、GPU、模型配置、依赖和缓存入口，不运行完整转写。" },
    { name: "日常智能转写", command: "scripts\\asr-smart.ps1 -Audio <file> -Mode strict -WaitSec 15 -Json", purpose: "提交本地严格任务并返回 job 状态，适合作为 AI 和脚本的默认入口。" },
    { name: "长音频严格模式", command: "scripts\\asr-smart.ps1 -Audio <file> -Mode long-strict -WaitSec 15 -Json", purpose: "按连续时间线分段并支持相同身份下断点续跑。" },
    { name: "文件夹批量", command: "scripts\\transcribe-folder.ps1 -InputDir <folder>", purpose: "复用模型处理多个文件，每个文件保留独立结果和失败状态。" },
    { name: "默认端到端冒烟", command: "scripts\\smoke-asr-smart.ps1 -Json", purpose: "使用固定真实样本验证 strict 入口到最终文件；会实际运行本地模型。" },
    { name: "证据级冒烟", command: "scripts\\smoke-evidence-asr.ps1 -Audio <file> -Json", purpose: "验证 FireRed + Qwen 每个分段及证据回执，需要指定重要录音并人工核听。" },
    { name: "全量单元测试", command: ".venv\\Scripts\\python.exe -m unittest discover -s tests -q", purpose: "验证不依赖真实重模型的逻辑、结构、失败路径和回归。" }
  ]
};

export const chineseAsrModules = [
  {
    slug: "task-routing",
    shortTitle: "入口与任务",
    title: "输入检查、Smart API 与可恢复任务",
    teaser: "统一处理文件身份、音频预检、job key、异步提交、状态观察、缓存复用、期限和取消，让上层不因重模型阻塞，也不因一次超时重复运行同一录音。",
    status: "Smart API、任务生命周期和缓存完整性已有源码与单测；本次未重跑真实模型 smoke",
    statusTone: "mixed",
    value: "我可以用同一种方式提交短录音、长录音或批量任务，并在几秒内拿到稳定 job 身份；后续查询、恢复或取消都围绕同一任务，不用猜进程是否还活着。",
    why: "ASR 可能加载数 GB 模型并运行数分钟。若命令行超时就直接重发，容易同时运行两份任务、抢占 GPU、覆盖输出或把仍在处理误判为失败。",
    example: "我提交一段 40 分钟录音，15 秒内只收到 running（运行中）和 job id。稍后查询同一 id 获取进度；再次提交相同文件与模式时命中相同 job key，而不是新建另一份重任务。",
    result: "得到一个与输入和请求绑定的任务记录：当前阶段、开始与更新时间、输出位置、错误、缓存状态、是否可以恢复，以及最终正文与证据文件。",
    readerStates: {
      pass: "输入和服务可用时返回稳定 job id，任务在后台受监管运行，完成后输出完整文件清单。",
      problem: "客户端等待超时但服务端任务仍在时继续查询；任务期限、租约或子进程失败时结束对应任务并保留具体错误。",
      unavailable: "服务、音频或模型配置无法建立任务时在启动前阻断，不生成假 job，也不盲目回退到未声明模型。"
    },
    decisionImpact: [
      "先查询任务状态，再决定等待、恢复或重新提交。",
      "相同输入和请求复用验证过的结果；输入或模型身份改变时必须新建任务。",
      "客户端 Timeout（等待超时）与服务端失败分开表达。",
      "取消、期限和租约丢失会回收完整子进程树。",
      "外部观察只返回有界状态，不公开私人正文或内部目录扫描结果。"
    ],
    problem: "解决重模型任务阻塞调用方、重复提交、任务身份丢失、缓存错配、调用端超时被误判为服务端失败，以及后台进程失联后无法恢复的问题。",
    implementation: [
      "scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待。",
      "src/zh_asr/service.py 维护 job 状态、队列、期限、状态查询与 observer projection。",
      "job key 绑定输入文件身份、模式、引擎和输出语义，缓存命中前验证关键制品。",
      "process_control.py 维护子进程树和终止边界，避免只结束父进程留下 GPU worker。",
      "状态投影不反射调用方任意标识，也不暴露提示、音频或转写正文。"
    ],
    flow: [
      "规范并验证输入路径，计算输入身份和请求语义。",
      "检查服务健康和当前活跃任务，不以进程名代替 job 状态。",
      "计算 job key；命中已验证完成结果时返回 cache hit。",
      "未命中则创建 job 并启动对应 CLI 子进程。",
      "调用方在 WaitSec 内轮询，超时只返回 job 身份。",
      "服务持续监管期限、取消和子进程退出。",
      "完成后校验输出并把状态原子更新为 succeeded、failed 或 blocked。"
    ],
    concepts: [
      { term: "Smart API", explanation: "把预检、任务提交、短等待和状态观察组合成一个稳定入口。" },
      { term: "job key", explanation: "绑定输入与请求语义的幂等键，防止同一重任务重复运行。" },
      { term: "observer projection", explanation: "只返回上层决策所需状态，不暴露私人正文和内部实现细节。" },
      { term: "lease（租约）", explanation: "证明当前 worker 仍拥有任务的短时状态；丢失后不能继续写结果。" }
    ],
    boundaries: [
      "只监听本机回环地址，不作为带认证的远程服务。",
      "cache hit 只复用相同输入与请求的已验证制品。",
      "调用端超时不自动复制任务。",
      "状态接口不返回私人转写正文或声纹数据。"
    ],
    failures: [
      { condition: "客户端等待超时", response: "返回 job id 和查询入口；先读任务状态，不立即重发。" },
      { condition: "缓存文件缺失或指纹不一致", response: "缓存失效并重新执行，不返回部分旧结果。" },
      { condition: "worker 超期、取消或租约丢失", response: "结束任务进程树并记录终态，保留可安全恢复的任务证据。" },
      { condition: "服务端口被其他程序占用", response: "明确报告身份冲突，不结束未知进程也不抢端口。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\asr-smart.ps1", role: "日常智能提交、短等待与状态入口" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\service.py", role: "异步 job、状态、期限、缓存和 observer projection" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\process_control.py", role: "子进程树生命周期与终止" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_service.py", role: "服务、缓存、状态和失败路径回归" }
    ],
    verification: [
      "本次全量 345 项单元测试通过，其中 service、process control、observer projection 和 scripts 均进入回归。",
      "Doctor 当前确认代理环境干净、GPU 与模型配置可读。",
      "本次未运行真实 strict smoke，因此模块保持 mixed，不把单测冒充 E2E。"
    ],
    relation: "本模块决定任务是否被正确创建和监管；模型与模式模块决定跑什么，长音频模块决定怎样分段，审计模块决定怎样解释结果。"
  },
  {
    slug: "models-modes",
    shortTitle: "模型与模式",
    title: "模型 Registry、quick / strict 模式与显式路由",
    teaser: "把模型身份、版本、运行方式、能力和默认角色集中登记；日常模式保持稳定，新增或安装更强模型不会自动改变默认结果。",
    status: "quick=SenseVoiceSmall；strict=Qwen3-ASR-1.7B + SenseVoiceSmall；其他 Profile 仅显式选择",
    statusTone: "mixed",
    value: "我能直接看到 quick 使用 SenseVoiceSmall、strict 使用 Qwen3-ASR-1.7B + SenseVoiceSmall、证据级本地路线使用 FireRedASR2-LLM + Qwen3-ASR-1.7B、时间线使用 Paraformer + CAM++；升级一个模型不会悄悄改变所有旧任务。",
    why: "如果模型名、参数和默认选择散落在脚本里，安装新模型或换版本可能让相同命令产生完全不同结果，也无法解释某次转写为什么更快、更慢或更容易幻觉。",
    example: "我只说“严格转写”时，系统固定使用 Qwen3-ASR-1.7B 主引擎和 SenseVoice 对照；即使机器已经安装 Fun-ASR-Nano 或 FireRed，也不会自动替换默认组合。",
    result: "得到带明确模型 id、版本、角色、设备和模式的转写结果；显式选择和默认路径可以分别审计。",
    readerStates: {
      pass: "模式引用的模型配置、依赖和权重身份可用时，按固定角色执行并记录实际模型。",
      problem: "主引擎失败而对照引擎成功时保留暂定文本和失败证据，不把单路回退称为完整 strict。",
      unavailable: "模型配置、依赖或权重身份不满足时阻断该路线，不猜相近模型、不自动下载并改默认。"
    },
    decisionImpact: [
      "普通默认不因新模型安装而漂移。",
      "quick 与 strict 的质量和成本边界明确。",
      "证据级、时间线和备用模型必须显式选择。",
      "每次结果记录实际引擎，而不是只记录模式名。",
      "模型失败影响状态和证据等级，不只影响一段错误文本。"
    ],
    problem: "解决模型配置漂移、默认路线暗改、同名模型版本不清、主/对照角色混乱，以及模型失败后仍被显示为完整双模型成功的问题。",
    implementation: [
      "configs/models.yaml 声明模型 id、适配器、版本、能力和设备要求。",
      "config.py 读取并验证模型配置；未知引擎直接失败。",
      "pipeline.py 按 quick、strict 和显式参数组织主/对照引擎。",
      "adapters 分离 Qwen、FunASR 与 FireRed 的运行差异。",
      "qwen_identity.py 对 Qwen runtime 与模型身份做精确约束。"
    ],
    flow: [
      "解析模式和显式引擎参数。",
      "从 Registry 取得精确 profile。",
      "检查依赖、权重、设备和输入能力。",
      "为主引擎和对照引擎创建独立原始输出。",
      "把实际身份和执行状态写入结果。",
      "交给仲裁与审计层生成正文和复核结论。"
    ],
    concepts: [
      { term: "Registry", explanation: "模型配置的唯一登记表，决定 id、角色、适配器和边界。" },
      { term: "primary engine（主引擎）", explanation: "严格模式主要正文候选的来源。" },
      { term: "secondary engine（对照引擎）", explanation: "独立转写同一输入，用于发现分歧和疑似幻觉。" },
      { term: "profile", explanation: "一个精确模型及其运行合同，不是模糊产品别名。" }
    ],
    boundaries: [
      "Fun-ASR-Nano、FireRed、Paraformer 和 Whisper 都不会自动接管 quick/strict 默认。",
      "模型安装成功不等于真实音频 E2E 通过。",
      "对照模型不是投票多数，也不自动证明主模型错误。",
      "云模型与本地模型分属不同授权和证据边界。"
    ],
    failures: [
      { condition: "未知模型或配置字段错误", response: "启动前失败并指出精确 profile，不选择相近模型。" },
      { condition: "主引擎失败、对照成功", response: "保留对照文本但标为 provisional，并记录主引擎错误。" },
      { condition: "两路都失败", response: "输出听不清或失败状态，不生成貌似完整正文。" },
      { condition: "结果声明的模型与实际 runtime 不同", response: "证据回执验证失败，结果不能升级为 verified。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml", role: "模型 Registry 与默认角色" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\config.py", role: "配置加载与验证" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\pipeline.py", role: "quick / strict 流水线" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\qwen_asr.py", role: "Qwen ASR 适配器" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\funasr.py", role: "SenseVoice、Paraformer 与 FunASR 适配" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\adapters\\firered_worker.py", role: "FireRed 隔离 worker 适配" }
    ],
    verification: [
      "Doctor 当前列出六个可用引擎，并确认 FunASR、Qwen ASR、PyTorch 已安装。",
      "config、pipeline、Qwen identity、FireRed worker 等单元回归包含在 345 项通过结果中。",
      "本次没有对六个 profile 分别运行真实录音，实际速度与准确率仍以具名 benchmark 为准。"
    ],
    relation: "模型与模式模块向入口模块提供可执行 profile，向审计模块提供模型身份；长音频和说话人模块只能在这里声明的能力范围内工作。"
  },
  {
    slug: "long-batch",
    shortTitle: "长音频与批量",
    title: "连续时间线、长音频断点续跑与文件夹批量",
    teaser: "把超过单模型处理上限的录音分成连续区间，逐段运行并可恢复；批量任务复用已加载模型，但每个文件仍有独立身份、结果和失败边界。",
    status: "长音频、仲裁和批量模型复用已有完整单测；本次未运行两小时真实录音",
    statusTone: "mixed",
    value: "长录音中断后不必从头重跑，文件夹里一个坏文件也不会让其他结果消失；我还能知道原时间线是否有漏段。",
    why: "模型通常有输入时长或显存上限。简单按固定长度切开会切断句子、漏掉交界内容；没有 manifest 时，中断后也不知道哪些片段已完成、哪些输出属于旧配置。",
    example: "两小时会议被切成有重叠的连续分段。第 17 段失败后，前 16 段和后续成功段都保留；修复模型后在相同输入与配置下只补第 17 段，再重新生成整体正文和覆盖证据。",
    result: "得到覆盖 0 到原音频结束的分段清单、每段引擎状态与输出、可恢复 checkpoint（检查点）、聚合正文、覆盖结论和失败片段列表。",
    readerStates: {
      pass: "所有分段连续、身份一致且完成时生成完整聚合结果，并证明时间覆盖闭合。",
      problem: "部分分段失败时保留成功内容和明确缺口，整体状态为 partial 或 provisional。",
      unavailable: "无法取得音频时长、旧 manifest 身份不一致或分段边界损坏时拒绝续跑旧结果，重新建立正确任务。"
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
      "long_audio.py 建立分段计划、manifest、续跑和整体状态。",
      "arbitration.py 聚合双模型结果与分段风险。",
      "batch.py 在一个批次内复用模型 runtime，同时为每个输入生成独立上下文。",
      "chunk overlap 可配置，但覆盖与边界必须进入结果证据。",
      "旧输出只有在输入、模型和请求身份一致时才可复用。"
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
      "long_audio、arbitration、batch 进入本次 345 项通过的全量单测。",
      "覆盖验证测试包含 gap、overlap、子证据和旧 manifest 身份场景。",
      "真实长音频耗时、切片效果和回听质量本次未重新验收。"
    ],
    relation: "本模块复用入口模块的 job 和模型模块的 profile；最终分段结果必须交给审计证据模块，涉及说话人时再交给归属模块。"
  },
  {
    slug: "audit-evidence",
    shortTitle: "审计与证据",
    title: "双模型分歧、风险规则、客观结果与证据回执",
    teaser: "把“程序运行成功”“覆盖完整”“文字质量足够”“检测到语音”和“关键内容已人工核听”拆开；正文、原始结果、审计和回执各自保留。",
    status: "审计、objective sidecar 和回执逻辑单测通过；真实录音结论仍需逐条核听",
    statusTone: "mixed",
    value: "我不仅能读到转写，还能快速找到可能错的地方、知道某个空结果到底是无语音还是处理失败，并能核对文件是否被替换或缺失。",
    why: "一段流畅文字可能来自真实语音，也可能来自模型补全；一个空文本可能是没有语音，也可能是解码、模型或覆盖失败。把这些状态压成一个成功/失败会让错误结论进入后续分析。",
    example: "一段静音输入让某模型生成模板句。审计层记录 speech evidence（语音证据）不足和静音出字风险，正文标为疑似；另一段空文本但覆盖不完整则返回 indeterminate，而不是“没有人说话”。",
    result: "得到正文、raw JSON、audit、metrics、objective sidecar、manifest 和 evidence receipt；每层说明能证明什么、不能证明什么。",
    readerStates: {
      pass: "执行、覆盖、质量和内容制品都闭合时返回 verified 的一致性结果，但仍保留人工核听边界。",
      problem: "存在分歧、低置信、失败引擎、缺段或可疑模式时列入 review，并把整体证据等级降级。",
      unavailable: "缺少原始结果、回执、输入身份或必要 sidecar 时不从旧 Markdown 猜状态，也不输出确定负向结论。"
    },
    decisionImpact: [
      "静音出字和模板废话进入高风险复核。",
      "空文本不再自动等于无语音。",
      "主引擎失败会改变证据等级。",
      "内容文件与回执不一致时 verified 自动失效。",
      "关键姓名、数字和争议句必须回到时间位置核听。"
    ],
    problem: "解决流畅幻觉、空文本误判、双模型分歧被隐藏、结果文件被替换后仍显示通过，以及结构化回执被误当成外部真实性证明的问题。",
    implementation: [
      "risk_rules.py 定义静音出字、模板废话、异常重复、繁体残留和格式风险。",
      "audit.py 汇总主/对照原始结果、错误和风险。",
      "audio_outcome.py 正交表达 execution、coverage、quality 和 objective outcome。",
      "result_writer.py 分开写正文、raw、audit、review 和 sidecar。",
      "metadata.py 与回执绑定输入、模型、制品、大小和 SHA-256。"
    ],
    flow: [
      "读取两路原始模型输出和执行状态。",
      "运行风险规则并比较分歧。",
      "分别计算执行、覆盖和质量。",
      "只在负向证据闭合时判断无语音。",
      "生成正文和需要复核的位置。",
      "写入所有内容制品和回执。",
      "状态查询时重新验证回执覆盖的文件。"
    ],
    concepts: [
      { term: "objective outcome", explanation: "只表达音频内容的客观状态，不混入执行和覆盖失败。" },
      { term: "indeterminate（无法确定）", explanation: "当前证据不足，不能断言有语音或无语音。" },
      { term: "evidence receipt", explanation: "制品一致性清单，不是签名、可信时间戳或事实认证。" },
      { term: "review queue（复核队列）", explanation: "按风险收集需要回听的句段，而不是让用户从头听完整录音。" }
    ],
    boundaries: [
      "SHA-256 一致只能证明字节未变，不能证明文字正确。",
      "verified 回执不能替代原音频和人工核听。",
      "低分、空文本和失败必须分别表达。",
      "公开仓库不包含任何用户结果包。"
    ],
    failures: [
      { condition: "正文存在但主证据引擎失败", response: "保留文本但标为 provisional，并列出 evidence failure。" },
      { condition: "空文本且覆盖或执行不完整", response: "返回 indeterminate，不宣称无语音。" },
      { condition: "回执引用的文件缺失、大小或指纹不符", response: "证据状态降为 unavailable，要求重新生成或恢复。" },
      { condition: "两路模型对关键句冲突", response: "保留两路原始输出和时间位置，进入人工回听。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\audit.py", role: "双模型审计与风险汇总" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\risk_rules.py", role: "幻觉和格式风险规则" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\audio_outcome.py", role: "执行、覆盖、质量和客观结果" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\result_writer.py", role: "内容制品与 sidecar 写入" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\metadata.py", role: "输入、模型和制品身份" }
    ],
    verification: [
      "audit、risk rules、audio outcome、result writer 和 metadata 单元测试包含在本次 345 项通过结果中。",
      "测试覆盖静音出字、空文本、partial coverage、回执损坏和模型失败。",
      "没有任何自动测试能够代替关键片段人工核听，页面明确保留该缺口。"
    ],
    relation: "模型、长音频和说话人模块产生的所有结果最终都经过本模块；它向用户解释证据强度，但不负责决定真实人物或外部事实。"
  },
  {
    slug: "speaker-attribution",
    shortTitle: "说话人与归属",
    title: "时间线、匿名说话人、person:self 线索与可撤销归属",
    teaser: "先区分匿名说话人，再把有限的本人声纹、声道、联系人、对话角色和句义组合成可解释、可撤销的线索；证据冲突时保持 unknown。",
    status: "说话人投影与 2–3 来源本人档案单测通过；它仍是推断线索，不是身份认证",
    statusTone: "mixed",
    value: "当录音里有多个人时，我能看到谁在什么时间段说话，并在证据足够时得到“可能是本人”的有理由判断；不再把 Speaker 1 直接写成某个人。",
    why: "匿名聚类只知道声音不同，不知道姓名；同一人的设备、通道、环境变化也会影响声纹分数。若只靠一个阈值或同一录音自测，很容易把错误身份写进后续材料。",
    example: "一段双声道通话里，右声道与已知角色、联系人和句义都指向本人，留出声纹也支持，因此输出有界归属；另一段单声道混音只得到边界分数，则保持 unknown。",
    result: "得到逐段时间、匿名 cluster、候选角色、支持与反对依据、attribution status（归属状态）和 gap；旧声纹档案被删除或替换后，依赖它的旧证据自动失效。",
    readerStates: {
      pass: "独立声学线索与具体上下文一致且时间区间有效时，输出带理由的可撤销归属。",
      problem: "声纹、声道和上下文冲突或分数落入歧义带时保留所有证据并返回 unknown。",
      unavailable: "没有时间线、可用 profile 或调用方上下文时只保留匿名说话人，不猜真实身份。"
    },
    decisionImpact: [
      "Speaker 编号永远不是人物姓名。",
      "同原件 enrollment 不参与对外自证。",
      "本人 profile 只允许一个当前版本，替换后旧证据失效。",
      "单声道混音使用更宽风险带。",
      "有具体理由的上下文可压过声学线索，但必须说明原因。",
      "冲突、零长度时间或缺少时间戳时保持 unknown。"
    ],
    problem: "解决匿名聚类被误当身份、拿同一录音建立和验证声纹、profile 撤销后旧结论继续有效、单声道边界分数强行归属，以及不同证据冲突却没有解释的问题。",
    implementation: [
      "Paraformer 可输出逐句时间和 CAM++ 匿名聚类。",
      "speaker_evidence.py 建立唯一、私有、可替换的 person:self profile，并区分 enrollment 与 held-out。",
      "多参考模式只接受 2–3 个不同来源，生成有界质心而不是无限画像库。",
      "speaker_attribution.py 组合声学、声道、联系人、角色和句义依据。",
      "profile 指纹进入证据；删除或替换后旧声学证据不再参与归属。"
    ],
    flow: [
      "取得带时间位置的匿名说话人片段。",
      "按需加载当前 person:self profile，不扫描媒体库。",
      "判断当前片段是否与 enrollment 同源。",
      "计算声学分数和歧义带。",
      "合并调用方提供的声道、联系人、对话角色和句义依据。",
      "记录支持、反对与未知。",
      "输出可解释归属或 unknown，并绑定 profile 指纹。"
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
      { condition: "单声道混音分数接近阈值", response: "进入更宽歧义带并返回 unknown。" },
      { condition: "声学与具体上下文冲突", response: "同时记录两侧证据；只有上下文本身具体且一致时才说明暂时压过声学，否则 unknown。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\speaker_evidence.py", role: "person:self profile、留出证据和撤销" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\speaker_attribution.py", role: "上下文与声学证据组合投影" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_speaker_evidence.py", role: "profile、同源、留出和撤销回归" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\tests\\test_speaker_attribution.py", role: "双声道、单声道、时间线和冲突回归" }
    ],
    verification: [
      "speaker evidence 与 attribution 回归包含在本次 345 项全量通过结果中。",
      "fixtures 覆盖双声道、单声道 unknown、无时间戳、零长度时间和冲突证据。",
      "本次没有读取任何私人声纹档案或录音，也没有执行人物身份判断。"
    ],
    relation: "本模块消费模型或 Paraformer 的时间线和审计结果；它只增加可解释人物线索，不能提高原转写文本本身的准确性。"
  },
  {
    slug: "runtime-privacy",
    shortTitle: "运行与边界",
    title: "本地运行、GPU 协调、专业云入口与公开边界",
    teaser: "普通任务默认完全本地；重模型通过 GPU 协调器串行。只有明确标为重要并授权本次上传的录音才进入独立云入口，密钥通过 SecretRef 注入固定 worker。",
    status: "本地依赖与 GPU Doctor 通过；云入口只完成源码与单测验证，本次没有上传或付费调用",
    statusTone: "mixed",
    value: "日常转写不会因为模型更强或录音更长就悄悄上传；我能在需要时明确选择本地证据链或一次云候选，并知道各自的数据去向。",
    why: "音频可能包含私人对话，GPU 又是共享稀缺资源。没有边界时，脚本可能在后台上传、把密钥写进参数，或让多个模型同时抢显存导致系统不可用。",
    example: "普通会议录音走本地 strict。只有我明确说“这是重要录音，本次允许上传”时，专业脚本才准备切片、取得 SecretRef 并调用固定云模型；任一条件缺失都在读取或上传前阻断。",
    result: "得到清楚的数据流与执行回执：是否本地、是否用 GPU、是否取得租约、是否发生云上传、云模型和切片、输出位置、失败类型和本地后备路线。",
    readerStates: {
      pass: "本地依赖和 GPU 可用时运行本地路线；云入口只有双重声明、固定 worker 与密钥盲注入都通过时执行一次。",
      problem: "GPU 冲突、网络、限流或云 5xx 时保留本地任务和失败原因，最多给出有界重试建议。",
      unavailable: "Secret Broker、运行时绑定、GPU 或模型不可用时阻断受影响路线，不暴露密钥、不静默切换云或其他模型。"
    },
    decisionImpact: [
      "普通、批量和长音频默认不上传。",
      "重要性声明与本次上传授权缺一不可。",
      "密钥不进入命令行、请求文件、日志和转写结果。",
      "重 GPU 任务通过租约串行，不抢占未知工作负载。",
      "网络和云失败不会污染本地证据链。",
      "公开仓库只保留源码、测试与文档。"
    ],
    problem: "解决音频隐私边界不清、云上传被默认触发、密钥泄露、GPU 并发冲突、服务进程失控，以及公开仓库误纳入模型权重、用户音频和生成结果的问题。",
    implementation: [
      "默认 pipeline 和 Smart API 使用本机模型与本机回环服务。",
      "gpu_broker.py 在重模型运行前取得有界租约。",
      "FireRed worker 隔离在专用运行环境，不改变默认模型。",
      "asr-professional-cloud.ps1 要求 Important 和 CloudUploadAuthorized 两个显式门。",
      "qwen_audio3_broker_worker.py 只接受固定请求结构和 SecretRef 注入。",
      "outputs、models、私人评测、wheelhouse 和录音由 Git ignore 与公开门排除。"
    ],
    flow: [
      "根据请求选择本地或专业云路线。",
      "本地路线检查代理、GPU、依赖和模型。",
      "重模型取得 GPU 租约并启动受管进程。",
      "云路线在读取音频前验证重要性、上传授权和 broker。",
      "密钥只注入固定子进程环境。",
      "执行结果写入被 Git 忽略的本地输出。",
      "失败后返回本地后备或精确恢复条件。"
    ],
    concepts: [
      { term: "local-first（本地优先）", explanation: "默认音频和模型推理都留在本机；云是独立显式路线。" },
      { term: "GPU lease（显卡租约）", explanation: "在限定时间内独占重 GPU 工作负载的可回收许可。" },
      { term: "SecretRef", explanation: "引用密钥而不让模型或命令得到明文。" },
      { term: "cloud upload authorization（本次云上传授权）", explanation: "仅针对当前重要录音和当前一次上传，不是长期默认同意。" }
    ],
    boundaries: [
      "云入口不能由普通模式、文件夹批量或音频长度隐式触发。",
      "任何输出都不能包含 API Key。",
      "本地 API 只监听 127.0.0.1。",
      "项目不结束未知 GPU 任务，也不通过强占资源制造成功。",
      "公开仓库不包含私人 payload 与模型权重。"
    ],
    failures: [
      { condition: "缺少重要性或本次上传授权", response: "在读取和上传前返回 blocked，不调用 broker。" },
      { condition: "Secret Broker 或固定 worker 身份失败", response: "不取得密钥、不上传，建议使用本地路线。" },
      { condition: "GPU 租约冲突", response: "任务保持 blocked 或等待，不并发抢显存。" },
      { condition: "云网络、限流或 5xx", response: "记录失败并保持本地证据独立；只建议有界重试一次。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\gpu_broker.py", role: "GPU 租约与服务协调" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\src\\zh_asr\\proxy_guard.py", role: "代理环境与本地请求边界" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\asr-professional-cloud.ps1", role: "重要录音显式云入口" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\scripts\\qwen_audio3_broker_worker.py", role: "固定云 worker 与密钥消费" },
      { path: "E:\\Projects\\Tools\\ChineseASR\\docs\\public-release.md", role: "公开仓库内容与生成物边界" }
    ],
    verification: [
      "本次 Doctor 确认 GPU、代理、FunASR、Qwen ASR、PyTorch 和模型目录可读。",
      "GPU broker、proxy guard、professional cloud script 和 broker worker 回归包含在 345 项通过结果中。",
      "本次没有调用云端、没有上传音频、没有消费密钥或额度，也没有运行重模型真实 smoke。"
    ],
    relation: "本模块给所有其他模块提供资源与隐私边界；它不决定正文质量，但决定某条处理路线是否允许执行、数据去了哪里。"
  }
];

export const project = chineseAsrProject;
export const modules = chineseAsrModules;
