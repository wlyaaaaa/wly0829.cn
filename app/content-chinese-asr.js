import { createProjectSnapshot } from "./project-snapshot.js";

const chineseAsrSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T18:35:39.7717725Z",
  label: "当前源码、同日全量回归、安装脚本回归与本机运行工件可核对；离线包和本轮模型 E2E 尚未验收",
  boundary: "当前 70e3255 源码、同日 345 项全量回归与本轮 18 项安装脚本回归已核对；本机模型回执和 FireRed WSL 可读，但当前没有已构建的离线依赖包，也没有重跑私人录音或离线安装 E2E",
  metrics: [
    { label: "登记 / 可执行", value: "6 / 5" },
    { label: "回归", value: "345/345" },
    { label: "真实长音频", value: "4/4" }
  ],
  facts: [
    { label: "日常默认", value: "strict：Qwen3-ASR-1.7B + SenseVoiceSmall；quick：SenseVoiceSmall" },
    { label: "重要录音本地证据", value: "FireRedASR2-LLM + Qwen3-ASR-1.7B，必须显式选择" },
    { label: "时间线与匿名说话人", value: "Paraformer + CAM++；cluster 不是人物身份" },
    { label: "重要录音云候选", value: "Qwen Audio 3.0 ASR Flash；必须同时确认重要性和本次上传授权" },
    { label: "显式 Profile 与恢复", value: "Fun-ASR-Nano-2512 可显式执行；Whisper Large V3 只登记为 fallback/comparison，当前禁止直接转写" },
    { label: "本轮快照", value: "PUBLIC main=70e3255；345/345 单元测试用时 83.524 秒；Doctor 枚举 6 个登记 Profile，直转闭集为 5 个，显存 32607 MiB；历史真实长音频 4/4 切片" },
    { label: "模型路线", value: "当前日常模型已经固定：quick 使用 SenseVoiceSmall；strict 使用 Qwen3-ASR-1.7B 主引擎加 SenseVoiceSmall 对照。重要录音本地证据路线可显式使用 FireRedASR2-LLM 加 Qwen3-ASR-1.7B；时间线与匿名说话人使用 Paraformer 加 CAM++；明确授权的云候选是 Qwen Audio 3.0 ASR Flash。", hero: false },
    { label: "当前源码", value: "PUBLIC（公开）main 当前提交为 70e3255326ad8ba7b0e335fdf6b4a19caf0d8029；本地主检出与 origin/main 为 0/0，工作树干净。", hero: false },
    { label: "完整回归", value: "2026-08-31 本次 fresh（新鲜）验证运行 345 项单元测试，内部用时 83.524 秒，345 项全部通过。测试覆盖配置、流水线、安装恢复、长音频、批量、服务、结果写入、审计、客观音频状态、GPU 协调、云入口、说话人证据和归属投影。", hero: false },
    { label: "本机环境", value: "Doctor（环境体检）本轮现场识别到 NVIDIA GeForce RTX 5090 D、驱动 616.56、32607 MiB 显存；WinHTTP 为直连，代理环境干净。", hero: false },
    { label: "运行依赖", value: "Windows 运行环境当前是 Python 3.11.9、PyTorch / TorchAudio 2.11.0+cu128、FunASR 1.4.5、Qwen ASR 0.0.6 和 ModelScope 1.38.1；模型配置文件可读，默认快速引擎为 SenseVoice，严格模式为 Qwen3-ASR-1.7B 加 SenseVoice。", hero: false },
    { label: "安装脚本回归", value: "本轮 tests.test_scripts 的 18 项安装与入口脚本回归全部通过，覆盖核心/Qwen/FireRed setup、固定模型下载、依赖锁导出、wheelhouse 构建与校验、offline install、Smart API 和两类 smoke 脚本的静态合同。", hero: false },
    { label: "Qwen 模型回执", value: "Qwen MODEL_RECEIPT 当前为 1763 字节、SHA-256=0c43de9dd883adefb65cfa1477ad7156f749868105a554e647b47de73c841ef9，绑定 revision a04930dbe5419bfee073f7cade734f572689a3a8 的 13 个必要文件、合计 4703115105 字节；本轮确认文件都存在且大小一致。", hero: false },
    { label: "FireRed 模型回执", value: "FireRed MODEL_RECEIPT 当前为 2124 字节、SHA-256=c4effd6931c0e09d8b2caaf7f8b9f58bed370fa4a174edfc64b668dd0b48dd01，绑定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824 的 14 个必要文件、合计 18870501538 字节；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 且工作树干净。", hero: false },
    { label: "FireRed WSL", value: "FireRed WSL 当前使用 Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0 和 NumPy 2.4.2；CUDA 与 BF16 可用，WSL 约 32 GiB RAM + 8 GiB swap，当前可用量高于半精度装载门槛。", hero: false },
    { label: "模型 Registry", value: "当前模型 Registry（登记表）包含 6 个 Profile：FireRedASR2-LLM、Fun-ASR-Nano-2512、Paraformer、Qwen3-ASR-1.7B、SenseVoiceSmall 和 Whisper Large V3；其中前 5 个进入 direct transcription（直接转写）闭集，Whisper 只作 fallback/comparison 登记，pipeline 明确拒绝直接执行。", hero: false },
    { label: "说话人证据", value: "主分支已包含有界说话人证据回读、可撤销 person:self 档案和时间戳通话归属；具体且一致的上下文可在解释反对声学线索后支持 inferred（暂时推断），无法消解的歧义保持未知，profile 撤销后旧声学证据失效。", hero: false },
    { label: "媒体替换保护", value: "最新说话人证据回读会在处理前后再次核对目标媒体快照；文件被替换或改变时失败关闭，不让旧媒体证据落到新文件上。", hero: false },
    { label: "历史真实验收", value: "历史公开验收曾用超过 40 秒的中文电话录音完成四切片 FireRed + Qwen 路线，四段均 verified；相同请求续跑为 0 processed / 4 skipped，默认 strict smoke 也有独立历史通过记录。", hero: false }
  ],
  gaps: [
    "本次为了建设看板只运行全量单元测试，没有占用重模型重跑 scripts\\smoke-asr-smart.ps1；历史 E2E 仍是真实成品证据，但不能冒充本轮 fresh 模型验收。",
    "当前 offline\\manifests 只有占位文件，没有 requirements-lock.txt、wheelhouse.sha256 或 wheelhouse.json，offline\\wheelhouse 也不存在；因此当前只有恢复脚本和回归，不存在可直接拿走的本轮离线依赖包，也没有运行 install-offline smoke。",
    "本轮只核对两份模型回执自身 SHA-256、必要文件存在性与声明大小，没有重新计算约 4.7 GB Qwen 和约 18.9 GB FireRed 全部权重文件的 SHA-256，也没有触发模型 loader 的完整身份校验。",
    "现有 wheelhouse 只恢复 Windows Python 依赖，不打包模型权重，也不完整重建 FireRed 的 WSL 源码、Python 环境和模型目录；完全断网的新机还必须事先从可信备份保留这些工件，项目当前没有一键生成并验收完整离线恢复包的脚本。",
    "重要录音的 FireRed + Qwen 证据链 smoke 需要指定真实音频并实际核听，本次没有运行；云入口还需要明确本次重要录音与上传授权，也没有调用。",
    "Git Owner 仍登记一个已合并、干净、无唯一提交的旧 speaker-attribution 工作树。它不影响 main 的产品状态，但在确认没有外部任务依赖前不自动删除。",
    "模型转写、声纹分数、匿名聚类和回执都不能单独证明真实说话人、外部事实或关键语句正确；需要原音频、上下文和人工复核。",
    "真实录音 benchmark、模型组合调优和 VAD（语音活动检测）切片校准属于使用期工作，不是当前源码关闭阻断，但会影响特定录音上的实际准确率。"
  ]
});

export const chineseAsrProject = {
  order: 8,
  slug: "chinese-asr",
  title: "ChineseASR",
  route: "/projects/chinese-asr",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "中文转写、长录音续跑和可复核结果包已经实现",
  cardStatusTone: "pass",
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
  summary: "ChineseASR 不是把中文录音丢给模型，再换回一段真假难辨的顺口文字。它交付的是能搜索、能接着处理、还能回到原音频复核的转写包：默认保留正文、原始输出、风险和失败证据；需要逐段时间线、匿名说话人或本人线索时，再明确选择对应路线。Python（运行语言）依赖、固定模型工件和离线重建也分开管理。普通录音默认留在本机；只有重要性与本次上传授权同时成立，才会进入独立云候选路线。姓名、数字、承诺和争议语句始终以原音频为准。",
  why: "中文录音最麻烦的不只是一两个错字。模型可能在静音、杂音、方言、专有名词或长音频交界处“补”出很通顺却不存在的话；机器重装、断网或模型文件损坏，又可能让同一个入口悄悄换了环境。如果不把录音指纹、模型版本、失败证据、依赖锁和模型工件身份绑在结果旁边，事后既找不到疑点，也无法确认恢复或重跑是不是仍走同一条路线。",
  plainExample: "比如我说“把这段两小时会议录音转成可复核文字，中断后别从头来”。系统会按连续分段保存进度，保留已经完成的片段；恢复后只补缺失或失效部分，再交付可读正文、两路原始结果、风险位置和回听入口。它不会因为文字读起来顺，就把缺段或单路失败藏起来。",
  result: "最后拿到两类互不冒充的结果：一类是与原录音绑定的正文、原始 JSON、审计、质量字段和恢复入口；另一类是可核对的运行环境、固定模型工件与离线依赖材料。模型工件是可校验的文件身份，不是凭据。系统能说明“这份结果由哪个输入和流程生成、恢复后是否仍是同一依赖与模型身份”，但下载、安装、回执或模型自信都不能证明真实录音已经转对，关键内容仍要人工回听。",
  readerStates: {
    pass: "音频可读、目标模式可用且任务完成时，返回正文和结构化证据包；严格模式保留两路模型结果与风险判断，时间位置只在对应引擎真实提供时出现。",
    problem: "某个引擎失败、两路分歧、检测到疑似幻觉或长音频只有部分完成时，保留可用片段但明确标为 provisional（暂定）或需要复核，不把降级结果冒充完整成功。",
    unavailable: "模型、GPU（图形处理器）、音频解码、任务服务、依赖工件或必要授权不可用时，返回具体阻断位置和已有任务身份；环境损坏时按依赖与模型两条恢复链处理，不反复提交录音，也不自动上传云端。"
  },
  productPrinciples: [
    { title: "原音频始终是真相来源", detail: "转写首先是搜索和回听导航，不是录音真实性、说话人身份或法律事实认证。" },
    { title: "流畅不等于可靠", detail: "模型越能生成通顺文字，越要把不确定、分歧和疑似内容变成可定位的复核清单。" },
    { title: "交付的是结果包，不是孤立正文", detail: "正文、时间位置、原始结果、风险、失败和恢复入口共同绑定同一音频。" },
    { title: "长录音可以暂停和继续", detail: "每个分段都能核对和恢复，中断只补缺失部分，不把两小时任务当成一次容易超时的命令。" },
    { title: "默认路线不能被安装变化偷偷改掉", detail: "日常、严格、重要录音和时间线模式各有清楚含义；新增模型必须显式接入，不能改变旧请求。" },
    { title: "恢复能力必须在故障前制备", detail: "依赖 wheelhouse、校验清单和模型缓存都不会在断网后凭空出现；先冻结、校验和保存，再用离线安装与真实 smoke 验收。" },
    { title: "普通录音本地优先", detail: "只有录音确实重要且本次上传得到明确授权，才进入一次云候选；文件较长或批量不构成上传理由。" },
    { title: "声音线索不等于人物身份", detail: "匿名说话人、本人声学线索和真实身份分开。具体且一致的来源或句义可以支持可撤销推断，即使声学线索相反也须把理由讲清；上下文互相冲突或没有可用依据时才保持未知。" },
    { title: "部分成功也要诚实有用", detail: "可用片段、暂定结果、失败位置和无法运行分别返回，不把降级或空文本冒充完整成功。" }
  ],
  responsibilities: [
    "提供中文单文件、长音频和文件夹批量转写的统一入口",
    "维护 quick（快速）与 strict（严格）等模式和可替换模型 Profile（配置档案）",
    "维护异步任务、状态查询、缓存去重、取消、期限和断点续跑",
    "维护 Python/CUDA 依赖、固定模型工件、校验回执和离线环境重建入口",
    "生成正文、原始结果、审计、指标、manifest（清单）和客观音频结果",
    "提供时间线、匿名说话人聚类和有边界的本人声纹线索",
    "维护本地优先、重要录音显式云授权、秘密盲注入和 GPU 资源协调边界"
  ],
  exclusions: [
    "不把自动转写当成录音真实性、说话人身份或法律事实认证",
    "不保证模型输出逐字正确；关键姓名、数字、承诺和争议语句仍需回听原音频",
    "不把匿名 Speaker 1 / Speaker 2 直接映射成真实人物",
    "不把依赖 wheelhouse 当成模型权重备份，也不把安装、下载或 Doctor 通过当成真实录音 E2E",
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
    { term: "wheelhouse（离线轮包仓库）", meaning: "按依赖锁提前下载的 Python 安装包集合；用于断网重建环境，不包含 Qwen、FireRed 等模型权重。" },
    { term: "dependency lock（依赖锁）", meaning: "从一套已通过检查的环境冻结出的精确 Python 包版本，并记录 Python 版本；它是构建离线轮包的输入。" },
    { term: "MODEL_RECEIPT（模型回执）", meaning: "绑定固定模型仓库、revision、必要文件路径、字节数和 SHA-256 的清单；漂移会阻止装载，但回执本身不是模型备份。" },
    { term: "evidence receipt（证据回执）", meaning: "把内容文件、大小、指纹、模型身份和状态绑定起来的一致性清单；不是数字签名或可信时间戳。" },
    { term: "GPU broker（图形处理器协调器）", meaning: "串行管理重模型对显卡的占用，防止两个任务同时抢显存并拖垮桌面。" },
    { term: "SecretRef（秘密引用）", meaning: "只引用受管密钥，不把密钥值放进命令、日志、Git 或模型上下文。" },
    { term: "E2E（端到端验证）", meaning: "使用真实音频从入口跑到最终文件并检查用户可见结果；单元测试和 Doctor 不能替代它。" }
  ],
  operatingFlow: [
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
    { name: "模型 Registry", responsibility: "集中声明引擎、版本、能力、运行方式和默认角色。", implementation: "configs/models.yaml 是唯一配置面；quick/strict 默认和显式 profile 不由脚本临时改写。" },
    { name: "安装与恢复工件", responsibility: "重建 Windows Python/CUDA 环境、固定模型身份和可选 FireRed WSL 运行时。", implementation: "setup/download 脚本、dependency lock、wheelhouse checksum 与 MODEL_RECEIPT 分层工作；离线依赖包不冒充模型备份。" },
    { name: "音频前端", responsibility: "读取、校验和规范音频，为不同引擎提供一致输入。", implementation: "src/zh_asr/audio_frontend.py 负责格式、语音区间和输入身份。" },
    { name: "转写 Pipeline", responsibility: "组织主引擎、对照引擎、降级、文本和状态。", implementation: "src/zh_asr/pipeline.py 与 adapters 组合模型，不把某个模型写死为全部场景。" },
    { name: "Smart API 与 job 服务", responsibility: "异步提交、状态查询、期限、取消和复用。", implementation: "src/zh_asr/service.py 加 scripts/asr-smart.ps1；调用方短等待，重任务继续由本地服务监管。" },
    { name: "长音频引擎", responsibility: "连续切片、manifest、分段状态和断点续跑。", implementation: "src/zh_asr/long_audio.py 保证时间线闭合，并把分段结果交给仲裁层。" },
    { name: "批量转写", responsibility: "按文件组织任务并复用已加载模型。", implementation: "src/zh_asr/batch.py 与 transcribe-folder.ps1 避免每个文件重复冷启动。" },
    { name: "审计与风险规则", responsibility: "检测分歧、静音出字、模板废话、重复和格式异常。", implementation: "audit.py、risk_rules.py、strict_writer.py 分别保存风险、疑似标记和复核队列。" },
    { name: "客观结果 Sidecar", responsibility: "把执行、覆盖、质量与语音结果分开。", implementation: "audio_outcome.py 生成结构化 sidecar，避免空文本直接被解释为无语音。" },
    { name: "说话人证据", responsibility: "提供匿名聚类、时间线和有边界的本人声音线索。", implementation: "speaker_evidence.py 与 speaker_attribution.py 组合声学、声道和调用方上下文；方向一致可推断，声学冲突可由具体一致的上下文解释，无法消解才 unknown。结果不升为身份确认。" },
    { name: "证据回执", responsibility: "绑定内容文件、指纹、大小、引擎身份和状态。", implementation: "result_writer.py 与 metadata.py 生成自包含一致性清单，但不冒充外部签名。" },
    { name: "GPU 与进程控制", responsibility: "防止重模型互抢资源，并回收超时或失联进程。", implementation: "gpu_broker.py、process_control.py 和本地任务生命周期共同控制显存与进程树。" },
    { name: "专业云入口", responsibility: "只为明确的重要录音提供一次受控云候选。", implementation: "asr-professional-cloud.ps1 同时要求重要性和本次上传授权，密钥由 SecretRef 注入固定 worker。" }
  ],
  usageExamples: [
    { moduleSlug: "models-modes", ask: "把这段微信语音转成文字。", effect: "使用本地日常转写，返回可读正文、原始结果和风险提示；普通请求不会触发云上传。" },
    { moduleSlug: "installation-recovery", ask: "新电脑没有网络，怎样把原来的 ChineseASR 环境恢复起来？", effect: "先核对预存依赖包与完整性，再重建 Windows 环境；模型缓存、模型回执和 FireRed WSL 分开确认。最后必须实际跑一次模型，才会告诉我哪条转写路线真的可用。" },
    { moduleSlug: "audit-evidence", ask: "这段会议很重要，尽量降低看似通顺的错话。", effect: "使用严格双路转写，保留两份结果的分歧、风险标记和需要回听的句段；必要时再明确选择更重的证据路线。" },
    { moduleSlug: "long-batch", ask: "把两小时录音处理完，中断后别从头来。", effect: "按连续时间分段保存进度，中断后只补缺失或失效片段，不重复完成部分。" },
    { moduleSlug: "long-batch", ask: "把这个文件夹的录音都转写。", effect: "批量入口复用已加载模型，逐文件生成独立结果与失败状态，不用一个文件失败拖垮全部。" },
    { moduleSlug: "speaker-attribution", ask: "告诉我哪一段可能是我说的。", effect: "结合本人声音线索、声道、联系人、对话角色和句义，给出带支持与反对理由的暂时推断；具体一致的上下文可解释声学冲突，依据不足或上下文彼此矛盾才保持未知，任何结果都不是身份认证。" },
    { moduleSlug: "audit-evidence", ask: "这段录音是不是完全没人说话？", effect: "只有处理完整且有规范负向证据时才说没有检测到语音；空文本、缺段或失败都保持无法判断。" },
    { moduleSlug: "task-routing", ask: "模型卡住了，我要不要再提交一次？", effect: "先查询原任务到底还在跑、已经失败还是被服务重启打断；客户端等超时不等于任务失败。只有明确需要时才重试，旧队列不会自动复活，长音频仍沿原稳定输出目录续作。" },
    { moduleSlug: "runtime-privacy", ask: "这是一段重要录音，本次可以上传云端再给我一个候选。", effect: "只有“确实重要”和“这一次允许上传”同时成立，才打开固定云入口；云门、密钥入口或网络缺失时只关闭云候选，本地证据链和失败记录仍各自保留。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码层）", proves: "当前 main 中实际存在的模型路由、任务、审计、边界和测试实现。", doesNotProve: "本机已经安装、服务正在运行或真实录音效果正确。" },
    { layer: "Unit tests（单元测试层）", proves: "345 个受控场景的逻辑、媒体替换失败关闭、结构和回归当前通过。", doesNotProve: "真实 GPU 模型加载、音频质量、端到端耗时和人工听感。" },
    { layer: "Doctor（环境体检层）", proves: "GPU、核心依赖、模型配置和本机缓存入口当前可被识别。", doesNotProve: "每个 profile 都完成真实推理，也不证明服务没有运行期故障。" },
    { layer: "Dependency artifacts（依赖工件层）", proves: "requirements lock、wheelhouse checksum 和离线安装可把一套 Windows Python 依赖重建并通过 pip check/Doctor。", doesNotProve: "模型权重、FireRed WSL 或真实录音推理可用；当前本机也尚未生成这套离线包。" },
    { layer: "Model receipt（模型回执层）", proves: "固定仓库/revision 下必要模型文件的路径、大小与 SHA-256 可逐项核对。", doesNotProve: "权重已被备份、GPU 能装载、输出准确或完整 ASR 场景通过。" },
    { layer: "Runtime smoke（运行冒烟层）", proves: "指定入口、真实样本、模型和最终文件从头到尾能够完成。", doesNotProve: "对任意录音准确，或所有重要语句已经人工核听。" },
    { layer: "Historical real E2E（历史真实端到端）", proves: "超过 40 秒中文电话录音的四切片 FireRed + Qwen 路线曾全部 verified，续跑复用了四段结果。", doesNotProve: "本轮模型、任意私人录音或每个字仍然正确。" },
    { layer: "Content receipt（内容回执层）", proves: "输入、模型、输出文件、指纹和状态在一个结果包内一致。", doesNotProve: "外部真实性、可信时间戳、说话人身份或文字事实正确。" },
    { layer: "Benchmark（基准评测层）", proves: "固定语料和 truth（人工真值）下的字错率、风险和模型对比。", doesNotProve: "用户下一段录音具有相同声学条件和准确率。" },
    { layer: "Human review（人工复核层）", proves: "关键片段已回到原音频核听并被人确认。", doesNotProve: "未听部分或不同原件也正确。" }
  ],
  evolution: [
    { date: "2026-07-06", commit: "a280a54–ad37f35", result: "从本地中文转写脚手架演化为双模型严格模式、模型 Registry、批量入口、审计与风险规则、基准评测、依赖锁/checksum wheelhouse 离线安装、异步 API 和长音频断点续跑的第一版完整产品；模型权重始终是独立工件。" },
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
    { name: "在线安装与固定模型下载", command: "scripts\\install-torch-cu128-direct.ps1 → setup-core.ps1 / setup-qwen.ps1 / setup-firered.ps1 → download-models.ps1 -Engine <engine>", purpose: "建立 Windows 核心环境与可选 FireRed WSL，并按固定 revision 下载模型；下载成功仍须后续 smoke。" },
    { name: "构建离线依赖工件", command: "scripts\\export-lock.ps1 → build-wheelhouse.ps1 → verify-wheelhouse.ps1", purpose: "在联网且已验证的环境中冻结依赖、下载 wheel 并生成校验清单；不包含模型权重。" },
    { name: "离线重建 Windows 环境", command: "scripts\\install-offline.ps1 -Venv .venv-offline-smoke", purpose: "校验 wheelhouse 后无索引安装、pip check 并运行 Doctor；仍需单独恢复模型/FireRed 工件并跑真实 smoke。" },
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
    searchAliases: ["服务重启后录音任务会自动重跑吗", "ASR任务中断后去哪看", "长录音重试会不会换输出目录", "同一个录音为什么没有重复跑", "转写任务超时要不要重新提交"],
    searchProjection: {
      intents: ["提交一段录音并稍后查进度", "恢复中断的转写任务", "判断超时后是否应该重提", "取消一条仍在运行的任务"],
      entities: ["Smart API", "job id", "jobs.json", "request fingerprint", "稳定输出目录"],
      relations: ["音频内容 SHA-256 与请求语义生成 fingerprint", "fingerprint 绑定 job key 和长音频恢复目录", "持久任务历史记录终态但不恢复可执行队列"],
      failureRecovery: ["服务重启把未完成任务标成 service_restarted", "interrupted 任务不自动重跑", "长音频失败或取消后显式重试复用原目录", "等待超时先查原 job 而不是再提交"]
    },
    teaser: "把提交、查进度、取消、超时和服务重启后的续作收进同一任务入口，避免因为等得久就把一段大录音重复跑好几份。",
    status: "Smart API、任务生命周期和缓存完整性已有源码与单测；本次未重跑真实模型 smoke",
    statusTone: "mixed",
    value: "无论是短语音、两小时录音还是一整个文件夹，都能先拿到一个稳定任务身份。后续查进度、恢复或取消只认这一项，不用盯着黑窗口猜后台还活不活，也不会因为客户端等超时就顺手再开一份。",
    why: "ASR 可能要加载数 GB 模型并跑上几分钟。若调用端一超时就直接重发，两份任务很容易同时抢 GPU、覆盖输出，甚至把其实仍在处理的任务误判成失败。任务身份和终态必须独立于那次等待窗口保存下来。",
    example: "比如我问“服务重启后，这段录音会不会自己重新跑？”系统会明确告诉我：原来排队或运行中的任务会留下“服务已重启”的失败终态，不会在后台偷偷复活。我确认需要继续后再显式重试，新任务仍按同一音频内容与请求指纹找到稳定输出目录，并复用长音频里已经验证有效的分段。",
    result: "得到一条与音频内容和请求绑定、跨服务重启仍可查询的任务记录：当前阶段、开始与更新时间、稳定输出位置、错误、缓存状态、是否中断、是否需要显式重试，以及最终正文与证据文件。旧终态能回读，但陈旧队列不会自动执行。",
    readerStates: {
      pass: "输入和服务可用时返回稳定 job id，任务在后台受监管运行，完成后输出完整文件清单。",
      problem: "客户端等待超时但服务端任务仍在时继续查询；任务期限、租约或子进程失败时结束对应任务并保留具体错误。",
      unavailable: "服务、音频或模型配置无法建立任务时在启动前阻断，不生成假 job，也不盲目回退到未声明模型。"
    },
    decisionImpact: [
      "先查询任务状态，再决定等待、恢复或重新提交。",
      "request fingerprint（请求指纹）包含音频内容 SHA-256 与请求语义；只改修改时间不改变它，内容改变即使大小和时间相同也会改变它。",
      "相同输入和请求复用验证过的结果；输入内容、模型或请求身份改变时必须新建任务。",
      "客户端 Timeout（等待超时）与服务端失败分开表达。",
      "terminal（终态）任务写入持久历史；重启时未完成记录被标成 interrupted / service_restarted，不自动重新排队。",
      "long-strict 失败或取消后的显式重试产生新 job id，但复用同一稳定输出目录，让 manifest 验证后只补缺失分段。",
      "取消、期限和租约丢失会回收完整子进程树。",
      "外部观察只返回有界状态，不公开私人正文或内部目录扫描结果。"
    ],
    problem: "解决重模型任务阻塞调用方、重复提交、任务身份丢失、缓存错配、调用端超时被误判为服务端失败，以及后台进程失联后无法恢复的问题。",
    implementation: [
      "scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待。",
      "src/zh_asr/service.py 维护 job 状态、队列、期限、状态查询与 observer projection。",
      "job key 绑定音频绝对路径、内容 SHA-256、模式、已解析引擎、模型配置、设备、切片参数和调用方绑定，缓存命中前验证关键制品。",
      "jobs.json 持久化有界任务历史；服务启动时保留已完成终态，把遗留 queued / running 记录转换为明确的 service_restarted 失败。",
      "long-strict 输出目录由稳定 request fingerprint 派生；失败或取消后的显式重试不会换目录，旧 manifest 和收据仍须重新验证。",
      "process_control.py 维护子进程树和终止边界，避免只结束父进程留下 GPU worker。",
      "状态投影不反射调用方任意标识，也不暴露提示、音频或转写正文。"
    ],
    flow: [
      "规范并验证输入路径，计算输入身份和请求语义。",
      "检查服务健康和当前活跃任务，不以进程名代替 job 状态。",
      "计算 job key；命中已验证完成结果时返回 cache hit。",
      "未命中则先把新 job 写入持久任务历史，再启动对应 CLI 子进程。",
      "调用方在 WaitSec 内轮询，超时只返回 job 身份。",
      "服务持续监管期限、取消和子进程退出。",
      "完成后校验输出并把状态原子更新为 succeeded、failed、canceled 或 blocked。",
      "若服务重启，回读终态供查询；遗留未完成记录只标 interrupted，不恢复执行，长音频必须由调用方显式重试后在稳定目录内续跑。"
    ],
    concepts: [
      { term: "Smart API", explanation: "把预检、任务提交、短等待和状态观察组合成一个稳定入口。" },
      { term: "job key", explanation: "绑定输入与请求语义的幂等键，防止同一重任务重复运行。" },
      { term: "request fingerprint（请求指纹）", explanation: "由音频内容 SHA-256、模型与请求参数等组成；不是只看文件大小或修改时间。" },
      { term: "terminal history（终态历史）", explanation: "把 succeeded、failed、canceled、blocked 等任务保存到 jobs.json 供重启后查询，但不把旧队列重新执行。" },
      { term: "stable recovery directory（稳定恢复目录）", explanation: "long-strict 按请求指纹固定的输出目录；显式重试可验证并复用其中已完成分段。" },
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
      { condition: "服务在 queued 或 running 时重启", response: "持久记录转成 service_restarted 终态并注明自动重跑关闭；用户或调用方核对后才显式提交新的 job。" },
      { condition: "long-strict 失败或取消后重试", response: "创建新 job id，但复用同一 request fingerprint 对应的稳定输出目录；manifest 与收据验证通过的分段才跳过。" },
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
      "service 回归明确覆盖终态 jobs.json 持久化、遗留未完成任务转 service_restarted 且不自动重跑、long-strict 失败/取消后复用稳定目录，以及同大小同修改时间但内容不同仍产生不同 fingerprint。",
      "Doctor 当前确认代理环境干净、GPU 与模型配置可读。",
      "本次未运行真实 strict smoke，因此模块保持 mixed，不把单测冒充 E2E。"
    ],
    relation: "本模块决定任务是否被正确创建和监管；模型与模式模块决定跑什么，长音频模块决定怎样分段，审计模块决定怎样解释结果。"
  },
  {
    slug: "models-modes",
    shortTitle: "模型与模式",
    title: "模型 Registry、quick / strict 模式与显式路由",
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
    value: "一眼就能看清 quick 用 SenseVoiceSmall，strict 用 Qwen3-ASR-1.7B + SenseVoiceSmall，证据级本地路线用 FireRedASR2-LLM + Qwen3-ASR-1.7B，时间线用 Paraformer + CAM++。登记表还会把“只供比较”和“当前能直接转写”分开，避免看到 Whisper 的名字就误以为它已有正式入口。",
    why: "如果模型版本、参数与默认选择散落在脚本各处，装一个新模型或升级一个包，就可能让同一句命令突然换了声音：耗时翻倍、结果风格变化，甚至开始更容易幻觉，却没人说得清到底换了什么。默认角色必须集中、显式而且可回读。",
    example: "比如我问“Whisper Large V3 能直接转写这段录音吗？”系统会直说：不能。它目前只登记为 fallback/comparison（备用比对），流水线不允许直接转写；不会因为配置表里出现这个名字就装作能跑，也不会偷偷换成另一台引擎交差。",
    result: "真正执行时，结果会写清实际模型 ID、版本、分工角色、设备与模式；若点名了只登记、不可直接执行的 Profile（配置项），就收到明确的 registered-only（仅登记）拒绝。默认路线、显式选择和备用比较各有各的账。",
    readerStates: {
      pass: "模式引用的模型属于直接转写闭集，且配置、依赖和权重身份可用时，按固定角色执行并记录实际模型。",
      problem: "主引擎失败而对照引擎成功时保留暂定文本和失败证据，不把单路回退称为完整 strict。",
      unavailable: "模型仅登记为对照、或配置/依赖/权重身份不满足时阻断该路线，不猜相近模型、不自动下载并改默认。"
    },
    decisionImpact: [
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
      "Doctor 当前枚举六个登记 Profile，并确认 FunASR、Qwen ASR、PyTorch 已安装；登记数量不等于可直接执行数量。",
      "config.py 当前直接转写闭集为5个；test_config验证whisper-large-v3带is_whisper且不进入该闭集，pipeline在加载前拒绝它。",
      "config、pipeline、Qwen identity、FireRed worker 等单元回归包含在 345 项通过结果中。",
      "Registry 静态回读确认 Fun-ASR-Nano revision=05201c46…、Paraformer revision=v2.0.4；本次未分别加载或运行它们，精确配置不冒充推理E2E。",
      "本次没有对六个 profile 分别运行真实录音，实际速度与准确率仍以具名 benchmark 为准。"
    ],
    relation: "模型与模式模块声明要运行的精确 profile；安装与恢复模块负责让对应依赖、模型工件和隔离运行时可重建，入口、长音频、审计和说话人模块只能在这两层共同成立的能力范围内工作。"
  },
  {
    slug: "installation-recovery",
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
    status: "安装与离线脚本、固定模型身份及 18 项脚本回归当前通过；本机两份模型回执和 FireRed WSL 可读，但本轮没有生成 wheelhouse（离线轮包仓库）、执行 offline install（离线安装）或重跑模型 E2E（端到端验证）",
    statusTone: "mixed",
    value: "电脑重装、换机、断网或模型目录损坏时，我能看出缺的是 Python 依赖、模型工件，还是 FireRed 的 WSL 环境与容量，而不是像无头苍蝇一样把整个项目全部重装。每一层都有自己的产物、校验和下一项验收。",
    why: "ASR 要真正可用，源码、Python 包、CUDA 构建、数十 GB 模型文件和可选 WSL 环境必须同时对得上。只留 Git 仓库会丢模型，只留 wheelhouse（离线轮包仓库）会丢权重；看到 MODEL_RECEIPT（模型回执）也只说明登记的模型身份，不证明文件已经备份。混在一起，往往折腾到最后一步才发现缺件，或让损坏权重继续产出不可复现结果。",
    example: "比如我问“新电脑暂时没网，怎样把 ChineseASR 恢复到能跑严格转写？”系统会先核对预存的依赖锁、离线轮包与校验清单，重建 Windows 虚拟环境；再单独确认 Qwen 模型缓存与回执。若还需要 FireRed，就继续检查 WSL 中的源码、运行时、模型回执和存储容量。最后必须跑默认 strict 冒烟；重要证据路线还要另跑 FireRed + Qwen 冒烟并人工核听。",
    result: "得到一份分层体检：Windows 中实际安装的 Python/CUDA 依赖、离线包校验、Qwen/FireRed 固定 revision（修订标识）与必要文件身份、FireRed WSL 的存储容量和运行时状态，以及冒烟/E2E 是否真的完成。WSL 容量不是显存，模型工件也不是凭据；缺哪一层就只把对应路线标为 unavailable（不可用），不会拿环境检查冒充转写成功。",
    readerStates: {
      pass: "依赖 lock 与 wheelhouse 校验一致、离线或在线安装通过 pip check/Doctor、模型回执完整且实际模型 smoke 成功时，才把对应转写路线标为可用；重要录音还要独立 E2E 和人工核听。",
      problem: "依赖、模型或 WSL 只有部分恢复时保留已通过层的证据，精确指出缺件；日常 SenseVoice 或 Qwen 路线可独立成立，不为修 FireRed 改写默认组合。",
      unavailable: "没有预制离线包或模型备份、checksum/receipt 漂移、固定源码不干净、CUDA/WSL 容量不足时拒绝装载受影响路线，不联网猜版本、不拿相近模型顶替。"
    },
    decisionImpact: [
      "新机在线安装与断网恢复使用同一模型 Registry，但依赖获取方式不同。",
      "项目要求 Python >=3.11；Windows 当前环境是 3.11.9，FireRed WSL 当前环境是 3.12.3。",
      "Windows PyTorch/TorchAudio 从 CUDA 12.8 index 安装；在线脚本不固定精确 torch 版本，离线可复现性由健康环境导出的 lock 和 wheelhouse 承担。",
      "requirements-core 固定 FunASR 1.4.5，Qwen runtime 固定 qwen-asr 0.0.6；FireRed 在 WSL 中使用自己的一组精确依赖和 PyTorch/TorchAudio 2.10.0+cu128。",
      "Qwen 和 FireRed 只接受固定 repository/revision 与规范 MODEL_RECEIPT，文件缺失、大小或 SHA-256 漂移都在模型加载前失败关闭。",
      "wheelhouse 只保存 Windows Python wheel，不包含模型权重、私人录音、输出、FireRed WSL venv 或源码 checkout。",
      "setup、download、Doctor、unit test、runtime smoke 与真实录音 E2E 是不同证据层，不能互相代替。",
      "模型替换后先重建固定身份与工件，再跑 strict、Smart smoke；FireRed 证据路线还需 evidence smoke 与人工核听。"
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
      "runtime/firered_worker.py 在哈希大权重和加载前同时验证固定源码 HEAD/干净工作树、模型回执、WSL 配置容量和当前可用容量；半精度与 FP32 使用不同门槛。"
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
      "模型下载、环境体检和源码测试都不能替代真实音频 E2E；重要录音还必须人工核听。"
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
      { path: "E:\\Projects\\Tools\\ChineseASR\\requirements-core.txt", role: "Windows 核心依赖与 FunASR 1.4.5" },
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
      "Source：PUBLIC main=70e3255326ad8ba7b0e335fdf6b4a19caf0d8029，README、architecture、Registry、requirements 与完整安装/下载/离线脚本已逐项核对。",
      "Unit tests：2026-08-31 本轮 .venv\\Scripts\\python.exe -m unittest -v tests.test_scripts 运行 18 项并全部通过；它验证脚本合同，不下载 wheel、不装模型也不跑音频。",
      "Full regression：同一轮 .venv\\Scripts\\python.exe -m unittest discover -s tests -q 运行 345 项，用时 83.524 秒并全部通过；仍不等于真实模型 E2E。",
      "Runtime Doctor：Windows 当前为 Python 3.11.9、PyTorch/TorchAudio 2.11.0+cu128、FunASR 1.4.5、Qwen ASR 0.0.6、ModelScope 1.38.1；RTX 5090 D 驱动 616.56、32607 MiB，六个引擎可枚举。",
      "Model artifacts：Qwen receipt 为 1763 B / SHA-256 0c43de9dd883adefb65cfa1477ad7156f749868105a554e647b47de73c841ef9，13 项声明合计 4703115105 B；FireRed receipt 为 2124 B / SHA-256 c4effd6931c0e09d8b2caaf7f8b9f58bed370fa4a174edfc64b668dd0b48dd01，14 项声明合计 18870501538 B。本轮确认所有声明路径存在、文件大小一致。",
      "FireRed runtime：WSL Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2，CUDA/BF16 可用；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 且工作树干净，当前内存高于半精度门槛。",
      "Unverified：本轮未逐字节重算两组全部权重 SHA-256、未加载模型、未运行 strict/evidence smoke，也未用私人录音做 E2E；MODEL_RECEIPT 当前只到回执自身哈希、路径存在和大小回读。",
      "Offline gap：offline/manifests 当前只有 .gitkeep，requirements-lock.txt、python-version.txt、wheelhouse.sha256、wheelhouse.json 与 offline/wheelhouse 均不存在；因此未运行 verify-wheelhouse 或 install-offline smoke，不能声称完整断网恢复已就绪。"
    ],
    relation: "本模块承接模型与模式模块的精确 profile，把依赖、权重和 FireRed WSL 恢复成可执行候选；只有再通过入口模块的真实 smoke、长音频执行与审计证据，候选环境才成为可用 ASR 路线。"
  },
  {
    slug: "long-batch",
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
    status: "长音频、仲裁和批量模型复用已有完整单测；本次未运行两小时真实录音",
    statusTone: "mixed",
    value: "两小时录音跑到一半中断，不必把前面全部推倒重来；文件夹批量里即使有一个坏文件，其他已经完成的结果也不会跟着消失。我还能看见时间线有没有漏段，而不是只拿到一篇看似完整的长文。",
    why: "模型通常有输入时长或显存上限，硬塞超长音频可能直接失败。若只按固定长度一刀切，又会把句子截断、漏掉交界内容；没有 manifest（分段清单），中断后更分不清哪些片段刚刚完成、哪些还是旧配置留下的结果。",
    example: "比如我说“把这段两小时录音从中断处接着跑”。假设第 17 段失败，系统会保留前面已经通过和后续已成功的片段；修复原因后，它认准同一录音与配置，只补失效片段，再重新生成整体正文与覆盖证据，不把旧配置的片段混进来。",
    result: "得到一份从 0 覆盖到原音频结束的分段清单：每段用了哪条引擎、当前状态与输出、可恢复检查点、聚合正文、覆盖结论和失败片段列表。哪里缺口一目了然，部分完成就继续标为部分完成。",
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
    title: "双模型分歧、可选本地仲裁、客观结果与证据回执",
    searchAliases: ["转写结果先看哪个文件", "正文有疑似怎么回听", "听不清是不是没有人说话", "ASR回执能证明文字是真的吗", "两路模型说法不一样看哪里", "strict复核队列在哪里", "Ollama仲裁什么时候启用", "LLM会不会读取音频或改写原始结果"],
    searchProjection: {
      intents: ["按顺序阅读严格转写成品", "定位并回听疑似或听不清片段", "比较两路模型分歧与依据", "显式启用本地不确定片段仲裁", "验证结果包有没有被替换", "用人工真值做 benchmark"],
      entities: ["*.strict.md", "*.strict.audit.json", "*.strict.review.json", "*.strict.receipt.json", "两路 *.raw.json", "Ollama 11434", "uncertain_only", "merged audit / metrics"],
      relations: ["strict 正文先读再进入 audit", "audit 分歧生成 review queue", "Ollama只读不确定片段的结构化audit证据", "仲裁只写merged audit和metrics而不覆盖raw", "receipt 绑定路径大小和 SHA-256", "长音频 manifest 和 metrics 解释覆盖与耗时"],
      failureRecovery: ["疑似标记按 review 时间或 chunk 回听原音频", "Ollama未启用或不可用时基础双ASR链照常完成", "仲裁响应无效时保留原始分歧和低置信结论", "听不清保持未知而不改写成静音", "回执不一致使 evidence unavailable"]
    },
    teaser: "正文、两路原始结果、风险审计与文件回执各司其职；长音频还能按需让本地 Ollama 解释疑点，但它不听音频，也不改原始证据。",
    status: "审计、objective sidecar 和回执逻辑单测通过；真实录音结论仍需逐条核听",
    statusTone: "mixed",
    value: "除了正文，我还能迅速找到两路模型听得不一样的地方，分清空白更像无语音还是处理不完整，并核对结果文件有没有被替换或缺失。双 ASR 仍拿不准时，可以明确打开本地 Ollama，让它只解释结构化分歧；它既不读取音频，也不能替我改掉 raw（原始）结果。",
    why: "一段顺滑文字可能来自真实语音，也可能是模型补全；一片空白可能真的没有语音，也可能是解码、模型或覆盖失败。把这些状态压成一个“成功/失败”，错误就会直接溜进后续材料；让 LLM 默认介入或覆盖 raw JSON，又会把一次猜测伪装成原始证据，还让基础转写依赖额外的 GPU 常驻服务。",
    example: "比如我问“转写结果先看哪里？”系统会先给我可读正文；遇到 `[疑似] 150 万` 这样的标记，再展示主引擎、对照引擎各自听成什么。当前路线若有分段时间线，还会给出对应回听位置；默认日常正文并不承诺时间戳。若我为长音频明确开启本地 Ollama，它也只解释被标出的结构化分歧并把意见追加到审计里；最终仍由我回听原音频定稿。",
    result: "阅读顺序很明确：先看 `*.strict.md` 正文，再看 `*.strict.audit.md` / `*.strict.audit.json` 的两路分歧和依据，以及 `*.strict.review.json` 的复核队列；两路 `*.raw.json` 始终原样保留。长音频另有 `manifest.json` 与 `metrics.json`。评测总会生成 `review.md`，但只有提供人工 truth（真值）时才生成 `benchmark.md` 和 `benchmark.json`。`*.strict.receipt.json` 用路径、大小、SHA-256 与 bundle hash 检查文件是否被换过，不证明文字真实；Ollama 未启用或不可用时，基础双 ASR 仍保留原分歧。",
    readerStates: {
      pass: "执行、覆盖、质量和内容制品都闭合时返回 verified 的一致性结果；若显式启用仲裁，只对不确定 chunk 追加有来源的解释，人工核听边界不变。",
      problem: "存在分歧、低置信、失败引擎、缺段或可疑模式时列入 review；本地仲裁即使给出偏好，也不能覆盖 raw 证据或自动定稿。",
      unavailable: "缺少原始结果、回执、输入身份或必要 sidecar 时不从旧 Markdown 猜状态；Ollama 未运行或响应无效只关闭可选仲裁，基础双 ASR 结果和复核队列继续保留。"
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
      "risk_rules.py 定义静音出字、模板废话、异常重复、繁体残留和格式风险。",
      "audit.py 汇总主/对照原始结果、错误和风险。",
      "audio_outcome.py 正交表达 execution、coverage、quality 和 objective outcome。",
      "strict_writer.py 分开写 `*.strict.md`、audit Markdown/JSON、结构化 review JSON、两路 raw JSON、objective sidecar 和 receipt。",
      "arbitration.py 从 `configs/models.yaml` 读取默认关闭的 `llm_arbitration`；启用时使用本地 `http://127.0.0.1:11434/api/chat`、主模型 `qwen-main-v1:latest`、fallback `qwen3.6-27b-256k:latest`、`uncertain_only` 与 `keep_alive=0`，仅传结构化分歧证据。",
      "长音频另写 `manifest.json` 与 `metrics.json` 解释分段覆盖、状态和耗时；评测 / benchmark 另写 `review.md` 与 benchmark 成品，解释优先复核项和 truth 对比。",
      "metadata.py 与回执绑定输入、模型、六项严格内容制品、相对路径、大小、SHA-256 和 bundle hash。"
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
      "audit、risk rules、audio outcome、result writer 和 metadata 单元测试包含在本次 345 项通过结果中。",
      "strict writer 与 benchmark 测试覆盖成品文件名、两路 raw、review 投影、静音出字、空文本、partial coverage、回执损坏、模型失败和 truth 对齐。",
      "test_arbitration.py 与 test_config.py 覆盖默认关闭、Ollama 主模型 qwen-main-v1:latest、fallback qwen3.6-27b-256k:latest、结构化请求、`uncertain_only`、`keep_alive=0`、有效 JSON 解析和无效响应回退；本轮没有调用真实 Ollama 模型。",
      "没有任何自动测试能够代替关键片段人工核听，页面明确保留该缺口。"
    ],
    relation: "模型、长音频和说话人模块产生的所有结果最终都经过本模块；可选 Ollama 只在长音频不确定 chunk 上增加一层不覆盖原证据的解释。模块向用户说明证据强度，但不负责决定真实人物、外部事实或最终文字真值。"
  },
  {
    slug: "speaker-attribution",
    shortTitle: "说话人与归属",
    title: "时间线、匿名说话人、person:self 线索与可撤销归属",
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
    value: "多人录音里，我能先看见不同声音分别在哪些时间段出现；证据充分时，再得到“可能是本人”的有理由推断。Speaker 1 只是匿名分组，绝不会因为排在第一就被直接写成某个人。",
    why: "声学聚类只知道“这里有几个不同声音”，不知道真实姓名；同一个人换设备、换通道或换环境，声纹分数也会变化。若只靠一道阈值，或者用同一份录音既建档又验证，很容易把错误身份写进正式材料。",
    example: "比如我问“Speaker 1 是不是本人？”在双声道通话里，如果对应声道、已知联系人、对话角色、句义与独立留出的本人声音线索都指向同一方向，系统才给出带理由的暂定归属；只要上下文互相矛盾，或声学分数落在歧义带又没有别的可靠依据，就明确保持 Unknown（未知）。",
    result: "得到逐段时间、匿名 cluster（聚类组）、候选角色、支持与反对依据、归属状态和证据缺口。结论始终是可撤销推断，不是身份认证；旧声纹档案被删除或替换后，依赖它的旧证据会自动失效。",
    readerStates: {
      pass: "时间区间有效且有可用方向性依据时，输出带理由的 inferred（暂时推断）；不要求声学、声道与上下文每一项同时具备，也不把推断提升为身份确认。",
      problem: "声学线索反对，但来源、联系人、对话角色或句义判断具体且彼此一致时，保留双方理由并说明为何暂采用上下文，结论仍可撤销。上下文本身冲突，或只有相互矛盾、处于歧义带的声学线索而无其他可用依据时，才返回 unknown（未知）。",
      unavailable: "缺少有效起止时间、无法把依据绑定到片段，或所有方向性线索都不可用时，保留匿名和未知；profile 不可用只使该声学分支失效，其他有效上下文仍可单独判断。"
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
      "speaker evidence 与 attribution 回归包含在本次 345 项全量通过结果中。",
      "configs/models.yaml 静态回读确认 CAM++ speaker verification revision=v1.0.0、threshold=0.31；本轮未加载真实私人 profile，也未把阈值冒充身份认证。",
      "fixtures 覆盖双声道、单声道 unknown、无时间戳、零长度时间和冲突证据；另有具体对话理由覆盖弱声纹反证、单声道歧义分数仍可由上下文判断，以及上下文本身冲突必须 unknown 的用例。",
      "本次没有读取任何私人声纹档案或录音，也没有执行人物身份判断。"
    ],
    relation: "本模块消费模型或 Paraformer 的时间线和审计结果；它只增加可解释人物线索，不能提高原转写文本本身的准确性。"
  },
  {
    slug: "runtime-privacy",
    shortTitle: "运行与边界",
    title: "本地运行、GPU 协调、专业云入口与公开边界",
    searchAliases: ["普通录音会上传云端吗", "重要录音怎样授权云转写", "两个语音模型抢显卡怎么办", "ASR密钥会不会写进日志", "云转写失败会不会冒充本地结果"],
    searchProjection: {
      intents: ["只在本机转写普通录音", "为一段重要录音授权一次云候选", "协调多个重 GPU 任务", "确认公开仓库不会带入私人结果"],
      entities: ["LocalGpuBroker", "SecretRef", "Alibaba Cloud Model Studio（阿里云百炼）", "qwen-audio-3.0-asr-flash", "127.0.0.1", "CloudUploadAuthorized"],
      relations: ["普通任务默认本地", "重要性与本次上传授权共同打开云入口", "SecretRef 只注入固定 worker", "GPU lease 串行重模型"],
      failureRecovery: ["缺少任一云门就上传前 blocked", "GPU 冲突等待而不抢占", "云失败保持本地证据独立", "broker 身份失败时不取得密钥"]
    },
    teaser: "普通录音默认留在本机，重模型通过 GPU 协调器排队；只有明确标为重要并授权这一次上传，才会打开独立云候选入口。",
    status: "本地依赖与 GPU Doctor 通过；云入口只完成源码与单测验证，本次没有上传或付费调用",
    statusTone: "mixed",
    value: "日常录音不会因为更长或想追求更强模型就悄悄上传。我可以明确选择本地证据链，也可以对一段重要录音逐次授权一个云候选，并看清这一次到底有没有离开本机。",
    why: "音频可能含有私人对话，GPU 又是多个本地项目共享的稀缺资源。没有清楚边界，脚本可能擅自上传、把密钥写进参数，或让几个重模型同时抢显存把机器拖垮。这里把本地执行、GPU 排队、云上传和公开仓库边界逐层分开。",
    example: "比如我问“普通录音会上传云端吗？”答案是默认不会：普通任务走本地路线。只有我明确说“这是重要录音，本次允许上传”，专业入口才会准备切片、通过 SecretRef 取得鉴权并调用固定云模型；重要性、逐次上传授权、云门或网络少一项，都只关闭这次云路线。",
    result: "得到一份清楚的数据流回执：本次是否留在本地、重模型是否经过 GPU 租约、有没有发生云上传、使用了哪个云模型与哪些切片、输出落在哪里、失败属于哪一层。云门、SecretRef、网络或限流出问题时，只有云候选不可用；本地转写与已保存的本地证据继续成立，不会被一起关掉。",
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
      "qwen_audio3_broker_worker.py 只接受固定请求结构和 SecretRef 注入，唯一 provider 为 Alibaba Cloud Model Studio（阿里云百炼），同步 API model id 固定 `qwen-audio-3.0-asr-flash`。",
      "音频先在本机转为 16 kHz mono WAV，再切成最长 180 秒片段，通过 HTTPS Base64 同步接口逐段发送；`qwen-audio-3.0-asr-flash-filetrans` 需要公网文件 URL，当前未接入。",
      "outputs、models、私人评测、wheelhouse 和录音由 Git ignore 与公开门排除。"
    ],
    flow: [
      "根据请求选择本地或专业云路线。",
      "本地路线检查代理、GPU、依赖和模型。",
      "重模型取得 GPU 租约并启动受管进程。",
      "云路线在读取音频前验证重要性、上传授权和 broker。",
      "本地切片后只向阿里云百炼 `qwen-audio-3.0-asr-flash` 同步接口发送最长 180 秒的 Base64 片段；filetrans 路线保持未接入。",
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
      "云入口的精确数据目的地是阿里云百炼同步模型 qwen-audio-3.0-asr-flash；需要公网 URL 的 qwen-audio-3.0-asr-flash-filetrans 不属于当前能力。",
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
      "源码与测试固定 Alibaba Cloud Model Studio / qwen-audio-3.0-asr-flash、180 秒本地切片、HTTPS Base64 和一次有界重试；这些静态/测试事实不证明本轮云调用成功。",
      "本次没有调用云端、没有上传音频、没有消费密钥或额度，也没有运行重模型真实 smoke。"
    ],
    relation: "安装与恢复模块先提供可执行依赖和模型工件；本模块再为所有路线施加 GPU、进程、网络与隐私边界。它不决定正文质量，但决定某条处理路线是否允许执行、数据去了哪里。"
  }
];

export const project = chineseAsrProject;
export const modules = chineseAsrModules;
