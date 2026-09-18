import { createProjectSnapshot } from "./project-snapshot.js";

const videoScaffoldSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T13:02:35.5893046Z",
  label: "可分阶段制作、听音审阅并恢复续作；本轮静态诊断 10 项通过，Fish 实际调用未复测",
  boundary: "源码、共享对齐入口与静态依赖已核对；本轮没有请求 Fish、加载语音模型、运行完整 4K60 渲染或人工观看成片，不能把这些层合成一个“全部就绪”",
  metrics: [
    { label: "画布", value: "3840×2160 · 60fps" },
    { label: "制作方式", value: "逐阶段审阅" },
    { label: "时间轴", value: "Fish / 共享对齐" },
    { label: "环境体检", value: "10 通过 · 1 未测" }
  ],
  facts: [
    { label: "它真正解决的事", value: "把已经确定的文案、素材和场景设计，分阶段做成旁白踩点、可预览、可续作渲染的 4K60 视频、封面和章节；它不是自动选题或一键投稿服务。" },
    { label: "普通输入与结果", value: "每场一份 script_NN.txt，加上明确素材和审阅后的 SVG（可缩放矢量图）片段；交回有声 preview.html、final_output.mp4、cover.png、chapters.txt，可选全片字幕，以及验证后生成的 delivery.json。" },
    { label: "当前来源", value: "PUBLIC（公开）仓库 wlyaaaaa/video-scaffold；本机维护目录 E:\\Projects\\Archives\\video-scaffold；本轮正式回读 main=origin/main=84501b04b918c8a9ec1e175b397764bf1af59bf5，工作树干净。", hero: false },
    { label: "当前环境体检", value: "2026-09-18 13:02 UTC 的 doctor 静态检查为 10 PASS、1 UNKNOWN：Python 3.11.9、Playwright 1.60.0、requests 2.34.2、FFmpeg/ffprobe、背景和模板文件、GPU 协调登记及 ChineseASR 适配入口可见；Fish route 未探测。", hero: false },
    { label: "体检不是成片", value: "普通 doctor/status/plan 不启动浏览器或 GPU，不下载模型、不读取密钥文件，也不联系 Fish。doctor-local 才做明确本地探针，doctor-live 才消耗外部账户额度；静态入口存在不证明真实语音、编码或成片成功。", hero: false },
    { label: "当前软件组件", value: "视频核心只维护 Playwright、requests 等自身依赖及锁文件，不再安装 faster-whisper、CTranslate2 或 CUDA 语音模型库。ChineseASR 的模型、解释器和权重由它自己的运行时维护；moderngl/numpy 仅在重建背景时按 requirements-background.txt 安装。", hero: false },
    { label: "配音与时间轴", value: "Fish Audio 仍经 https://api.fish.audio/v1/tts 使用 s2.1-pro-free 和云飞声线，旁白文本会离开本机。新词轴优先采用同一音频的 Fish 原生时间戳；缺失时按已确认文案调用 ChineseASR 的 Qwen3-ForcedAligner-0.6B 本地对齐，每场最长 300 秒。有效旧词轴可继续使用，不为改时间轴重新配音。", hero: false },
    { label: "画面与编码", value: "场景 HTML 由静态 SVG、data-anim 和 data-cue 组成；Playwright 逐帧调用 seekTime(t) 截取透明 PNG，再由 FFmpeg 叠到背景并用 av1_nvenc、p6、CQ 22、10-bit yuv420p10le 编码。", hero: false },
    { label: "源修复", value: "来源与输出哈希贯穿旁白、词轴、时长、场景、分片及最终交付；01、04、100 等稀疏编号在全链保留。局部场景变化只重渲受影响分片，已成功分片留至显式清理；同名、同大小或同帧数都不能代替来源一致。", hero: false },
    { label: "修复验证", value: "2026-09-03 的源仓库与新初始化工程各 33/33 是保留的历史回归，不是本轮重新运行。当前源码新增 Windows/Linux 逻辑测试和 Linux CPU 隔离短片持续集成入口，覆盖有声预览、片段导出、交付与增量复用；本轮只回读源码和静态 doctor，不把测试入口存在写成最新测试通过。", hero: false },
    { label: "真实背景资产", value: "background/background_4k.mp4 为 8,861,084 B、60 秒、3600 帧、10-bit AV1、3840×2160、60fps，SHA-256=6649aba6db11a94a6f516a2a276c33776301e71b8007dab3d850e646fb2b2a73。", hero: false },
    { label: "内容现场", value: "源仓库保留通用背景、模板、组件、文档与明确标注的占位素材，不拿它们冒充真实作品。旧 build_v2.py 与定制封面已退出活动树，历史仍在 Git；当前唯一生产入口是 run.ps1 / pipeline.workflow，不删除旧工程原件。", hero: false }
  ],
  gaps: [
    "本轮没有调用 doctor-live；Fish 账户、声线、服务可用性与原生时间戳的真实响应仍未重新验证，静态路由存在不能替代实际 MP3。",
    "本轮没有制作或打开一条真实内容视频；生产 AV1 NVENC、共享对齐、完整音画与最终观看分别保留未测状态，历史 33 项回归不能替代它们。",
    "重复词可用 data-cue-index 选择出现次数，并用 data-cue-offset 微调；模型时间和词内插值仍不是逐音素真值，必须听音审阅，不能承诺每个触发点天然无误差。",
    "背景文件可循环供长视频使用，但着色器中的全部噪声是否在 60 秒接缝严格连续没有本轮视觉验收，不使用“绝对无缝”作为已证结论。",
    "交付可以包括字幕与哈希清单，但不生成完整投稿文案或执行上传；源码已有持续集成配置，仍未声明 LICENSE，公开可读不等于已授予开源许可。"
  ]
});

export const videoScaffoldProject = {
  order: 22,
  slug: "video-scaffold",
  title: "video-scaffold",
  kicker: "本地视频制作流水线 · 先听音看画面，再渲染交付",
  route: "/projects/video-scaffold",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "有声审阅与共享对齐已实现；每期成片另行验收",
  cardStatusTone: "mixed",
  ...videoScaffoldSnapshot,
  searchAliases: ["video-scaffold", "本地视频制作流水线", "旁白和动画同步", "4K60视频制作", "视频渲染断点续作", "做视频先预览再渲染", "第22项目"],
  repositoryNote: "video-scaffold 是公开的视频生产脚手架，源码负责本地场景、时间轴、渲染和交付检查；Fish Audio 是标准配音阶段的外部服务。网站只解释工具链与最后一次核对结果，不接收访客脚本、素材、密钥或视频，也不提供在线编辑与渲染。",
  summary: "video-scaffold 把已经确定的旁白文案、图片素材和场景设计接成一条可分段检查的视频生产线。旁白优先带回 Fish 的词语时间，没有时间戳时再复用本机 ChineseASR 对齐；人或 AI 把审阅后的 SVG（可缩放矢量图）画面绑定到实际说词。在长渲染前，可以听着旁白拖动、按词跳转并改好踩点，再由浏览器逐帧给出画面，FFmpeg（音视频处理工具）和 NVENC（显卡硬件编码器）制作 4K60 视频。最终收齐旁白、可选音乐、封面、章节、可选字幕和交付清单。它不替我决定选题、事实或分镜，也不自动投稿。",
  why: "视频制作最浪费时间的不是写一个文件，而是几分钟甚至更久的渲染完成后才发现文字越界、关键词踩点错了，或中断续作把旧场景和新场景拼在一起。这套脚手架把昂贵步骤拆开：能在浏览器里早看就先看，能用词级证据对齐就不靠目测猜秒数，需要重跑时只复用身份仍匹配的产物；任何关键层不成立，就停在对应阶段而不是交出一条看似完成的视频。",
  plainExample: "我可以说：“按这份已经确认的脚本做一条视频。每段旁白一场，念到‘核心结论’时再让重点数字出现；先把所有场景放进预览页给我看，确认后再渲染 4K60，并生成成片、封面和章节，不要自动上传。”脚手架负责把这些阶段串起来，选题、文案事实和最终审美仍由我确认。",
  result: "工作过程中得到分场脚本、audio_NN.mp3、durations.json、srt_NN.json、提示词、SVG 片段、场景 HTML 和有声 preview.html；最终交回 final_output.mp4、cover.png、chapters.txt、可选 SRT/WebVTT 与 delivery.json。verify 核对来源、真实总帧、时长、音视频流及起点、封面、章节和 cue，manifest 再记录交付哈希；人工听看通过以后才进入投稿环节。",
  readerStates: {
    pass: "当前阶段的输入身份、编号与产物一致，构建和检查通过；完整视频还需依次通过人工预览、渲染、合成、verify 与真实观看。",
    problem: "脚本、音频、时间轴、素材或渲染配置发生变化时停止复用陈旧产物；cue 未命中、文字越界、分片少帧或音视频缺失会在对应阶段明确失败。",
    unavailable: "依赖、模型缓存、Fish 配置、显卡编码或素材不可用时保留已有可验证中间结果和具体原因；显存临时占用报告 BUSY，不自动结束别的 GPU 工作，也不切换到未知服务。"
  },
  dataSources: {
    title: "它接收什么，哪些内容留在本机",
    intro: "这不是从空白提示词自动长出视频的服务。输入按阶段来自本人确认的脚本、素材与场景设计；其中标准配音会把旁白文本发给 Fish Audio，其余核心制作在本机完成。",
    rows: [
      { source: "scripts/script_NN.txt", data: "每场一份已确认旁白，可含适度的 Fish 情绪或停顿标记。脚本内容、模型、声线、格式和尾部停顿共同绑定音频身份。", result: "Fish Audio 返回 raw_audio/audio_NN.mp3；密钥只从环境变量或被忽略的 secret_local.py 读取，网页不显示值。" },
      { source: "raw_audio/audio_NN.mp3", data: "FFprobe 读取真实时长；词语时间优先来自该音频的 Fish 原生时间戳，必要时把同一音频与已确认旁白交给 ChineseASR 本地对齐。音频、文案、来源与输出哈希共同约束词轴。", result: "durations.json、srt_data/srt_NN.json 及对应身份记录；词轴同时服务动画触发、有声审阅和可选字幕导出，不默认烧进视频。" },
      { source: "assets/ 与 scene_html/fragment_NN.svg", data: "素材以真实 file:/// URI 写入提示词；人工或当前 AI 审阅提示词后，只保存静态 SVG 片段与动画、cue 属性。", result: "构建后的 scene_NN.html；素材字节也进入渲染续作身份，同一路径换图不会沿用旧画面分片。" },
      { source: "场景 HTML、背景与可选 bgm.mp3", data: "Playwright 按时间 t 截取透明前景帧，FFmpeg 叠到 4K 背景，NVENC 编码；背景音乐由本人提供并在旁白出现时侧链压低。", result: "video_track.mp4 和带 AAC 旁白的 final_output.mp4；没有旁白时 merge 拒绝生成静音最终交付。" },
      { source: "PROJECT_TITLE 与 chapters.json", data: "标题决定封面正文；章节用 1-based 场景编号，第一章必须从 scene 1 开始，编号唯一且递增。", result: "3840×2160 cover.png 和从 00:00 开始的 chapters.txt；它们仍需与本期内容人工核对。" }
    ],
    note: "“本地视频工作流”描述场景、识别、浏览器与渲染主要在这台电脑执行，不等于全程离线。标准 TTS 会发送旁白文本；doctor-live 也会发一条真实网络探针，只有明确需要时才运行。"
  },
  productPrinciples: [
    { title: "内容由人决定，工具链只把已经决定的内容做稳", detail: "选题、事实、脚本和画面取舍不是脚手架的自动输出。prompts 只组装旁白、可 cue 词和真实素材路径；人或当前 AI 审阅后才保存 SVG，生产入口不暗中再选一个模型替人创作。" },
    { title: "昂贵渲染前，先用便宜步骤暴露错误", detail: "编号、缺文件和 cue 在 build 阶段检查，画布外文字由 lint 阻断，所有场景先进入 preview 动态网格。浏览器预览确认后才启动长渲染，避免把显卡时间花在一眼可见的问题上。" },
    { title: "画面由时间轴决定，不由机器当时跑得快不快决定", detail: "每帧先调用 seekTime(t) 把场景设置到指定时刻，再截图。随机视觉参数在 Python 端用固定种子写入属性，运行时不靠真实时钟推进，因此慢机器不会把动画节奏自行改短。" },
    { title: "复用必须证明还是同一份输入", detail: "音频绑定脚本与配音配置，词轴和时长绑定音频，渲染分片绑定实际覆盖的场景、素材、背景和编码配置。缺身份或哈希变化时先说明陈旧层；有效旧词轴可继续使用，重对齐不要求重新配音，局部画面变化只重做受影响分片。" },
    { title: "完整文件不等于内容正确，环境就绪也不等于视频完成", detail: "doctor 只作静态诊断，受控测试只证明合同，verify 检查结构与来源；真实语音、生产渲染、动画节奏和最终观看独立验收。任何一层未运行都不能由另一层的绿色结果代替。" },
    { title: "失败留下可继续的位置，不制造一条带病成片", detail: "合法分片可在同一输入身份下续作；少帧、无法删除的陈旧分片、未解析 cue、无旁白、缺封面或章节错误会停止。默认 cleanup 只删可再生临时物，保留时间轴和场景 HTML。" },
    { title: "制作与投稿分开", detail: "通用工作流交付视频、封面、章节、可选字幕和哈希清单，不生成完整投稿文案、不上传、不替人点击发布。READY 之后仍要真实观看，投稿回执与平台处理是后续独立动作。" }
  ],
  responsibilities: [
    "把通用运行时、背景、模板、组件、文档和测试复制成一个不夹带旧项目内容的空白视频项目。",
    "把分场脚本生成旁白，保留 Fish 原生时间戳，必要时复用 ChineseASR 对齐，并明确配音文本的网络边界。",
    "组装带真实素材路径和可 cue 词的场景提示，由人或 AI 产出受约束的静态 SVG 片段。",
    "先完成编号、cue、布局与有声预览审阅，再按明确时间逐帧合成 4K60 视频轨。",
    "拼接旁白和可选背景音乐，生成封面、章节、可选字幕与交付清单，并对当前来源和最终媒体做验证。",
    "用输入身份与输出哈希约束复用和中断续作，清理可再生产物并保留可恢复中间层。"
  ],
  exclusions: [
    "不自动决定选题、编写未经确认的事实脚本、选择素材或完成无需人审的分镜；不是一键 AI 视频生成器。",
    "不提供网页上传、在线编辑、云端渲染、自动投稿、平台回执或长期后台服务。",
    "不把占位素材、旧定制示例、环境体检、单元测试或单帧编码冒充本轮完整视频作品。",
    "不承诺 Fish 永久在线、任意 cue 都无歧义、背景绝对无缝、任意显卡都能编码，或公开仓库具有未声明的开源许可。"
  ],
  glossary: [
    { term: "TTS（文字转语音）", meaning: "把每场脚本文本交给 Fish Audio 合成旁白 MP3；这是标准流程中明确的外部网络步骤。" },
    { term: "word timeline（词级时间轴）", meaning: "每个词的开始和结束秒数；新旁白优先采用 Fish 原生时间戳，缺少时用 ChineseASR 对齐，经过审阅后用于画面触发。" },
    { term: "cue（旁白触发词）", meaning: "SVG 元素写入的真实发音词。构建时转换为具体延迟；没有命中就保留 data-cue-missing 并阻断。" },
    { term: "SVG（可缩放矢量图）", meaning: "每场前景的静态结构，文字、线条、图片和 data-anim 属性都写在其中，再由公共模板驱动。" },
    { term: "seekTime(t)（按时间定位画面）", meaning: "把场景设置为第 t 秒应有的状态；渲染逐帧调用它，而不是等待浏览器自己播放。" },
    { term: "Playwright（浏览器自动化工具）", meaning: "打开场景 HTML、检查布局并截取每一帧透明 PNG；无头检查不等于人工看过画面。" },
    { term: "NVENC（NVIDIA 硬件编码器）", meaning: "由显卡把逐帧画面编码为视频；当前配置使用 AV1、p6、CQ 22 和 10-bit 像素格式。" },
    { term: "sidecar identity（伴随身份文件）", meaning: "保存在生成物旁边的小型 JSON，只记录输入配置与 SHA-256，不保存脚本文本或密钥；用于判断旧产物能否复用。" }
  ],
  operatingFlow: [
    { title: "创建空白项目并先验环境", detail: "run.ps1 init 先暂存通用模板，再交给空目标目录；新工程先运行只读 doctor。test 是维护回归入口，不是每次制作必跑；doctor-local 和 doctor-live 分别承担明确本地探针与外部配音探针。" },
    { title: "把确认过的旁白按场拆开", detail: "按已审阅分镜写 script_01.txt、script_04.txt、script_100.txt 等真实编号并设置标题；所有阶段保持同一编号集合。需要共享对齐时，每场已知文案音频不得超过 300 秒。" },
    { title: "生成旁白、时长与词级时间轴", detail: "tts 生成 MP3、原生词语时间与 0.2 秒场间停顿；timing 优先复用有效词轴，再选 Fish 原生时间或 ChineseASR 对齐。已有但损坏的时间戳报错，不能当作缺失自动跳过；durations 可独立重建时长而不运行语音模型。" },
    { title: "让场景只包含可审阅的静态片段", detail: "prompts 注入旁白、可 cue 词与真实素材 URI；人或 AI 只保存 SVG 内部片段，不把整页 HTML、脚本或虚构路径混进去。" },
    { title: "先构建、查硬错误并看动态预览", detail: "build 校验编号、cue、重复属性、时间及动画名称，lint 检查越界；有声 preview 支持按词跳转、拖动和暂停，cue 编辑器只导出修改片段。保存后重建并听看，再启动长渲染。" },
    { title: "按固定时间逐帧渲染并可恢复续作", detail: "Playwright 截透明前景，FFmpeg 叠背景，NVENC 分片编码；逐片和整轨检查帧数及来源。输入未变接续缺片，局部场景变化只重做相关分片，成功分片保留到显式清理。" },
    { title: "合成旁白并补齐封面和章节", detail: "merge 拼接旁白并按需压低 BGM，cover 生成 4K 封面，chapters 生成从 00:00 开始的目录；需要时用 subtitles 导出全片 SRT/WebVTT。" },
    { title: "验证、观看，再决定是否投稿", detail: "verify 核对当前来源、帧数、时长与交付结构，manifest 在通过后写 delivery.json；人再实际观看。cleanup --dry-run 可先看清单，实际清理只处理已知可再生文件；投稿仍是独立人工动作。" }
  ],
  components: [
    { name: "项目初始化与统一入口", responsibility: "从通用仓库创建空白工作区，并让所有阶段使用同一个命令面。", implementation: "run.ps1 / pipeline.workflow 是唯一生产入口；init_project.py 先暂存通用模板再交到空目标。解释器按 VIDEO_PYTHON、项目 .venv、机器适配、py -3.11、系统 python 解析，旧定制入口不再在活动树。" },
    { name: "集中配置", responsibility: "保存画布、编码、转场、配音、识别、章节和目录的唯一当前选择。", implementation: "config.py 保留 3840×2160、60fps、av1_nvenc、4 workers、300 帧分片、Fish s2.1-pro-free 与云飞声线；VIDEO_TIMING_SOURCE=auto|fish|chinese-asr。机器解释器和 GPU/ASR 适配只在被忽略的 .video-machine.json 登记。" },
    { name: "旁白、时长与共享对齐", responsibility: "把每场脚本变成音频、精确秒数和词级触发依据。", implementation: "pipeline/fish_tts.py 与 fish_native.py 接收声音和原生词轴；durations.py 只读时长，transcribe.py 选择词轴或已登记 ChineseASR，artifact_identity.py 约束输入和输出。视频工程不安装自己的 Whisper。" },
    { name: "场景提示、片段与组件", responsibility: "把脚本、时间轴和素材组织成可审阅的 SVG 场景，而不绑定一个固定大模型。", implementation: "pipeline/author.py、build_scene.py、components.py、v2lib.py；模板支持基础与高级 data-anim 原语，缺 cue 留下机器可审计标记。" },
    { name: "浏览器运行时与前置验收", responsibility: "在昂贵渲染前验证确定性时间函数、画布位置和全部场景的动态效果。", implementation: "templates/scene_base.html、pipeline/lint.py、preview.py 与 serve.py；有声预览可按词定位、暂停和导出 cue 修改片段，临时 HTTP 仅绑定回环端口，关闭会话即停。" },
    { name: "分片视频渲染", responsibility: "逐帧合成透明前景、背景和成片效果，控制并发并防止静默少帧。", implementation: "pipeline/render.py 按最多 300 帧分片、4 workers 和有界重试生成视频；每 worker 至多缓存 6 个页面。分片有当前输入及输出身份，局部变化不再令无关正确分片全部失效。" },
    { name: "声音与交付收尾", responsibility: "把视频轨、旁白、可选背景音乐、封面和章节组合成可检查交付。", implementation: "pipeline/merge.py、cover.py、chapters.py 和 subtitles.py 组合旁白、BGM、封面、章节和可选 SRT/WebVTT；BGM 侧链压低，最终视频含 AAC 音频。" },
    { name: "最终验证与清理", responsibility: "区分文件存在、结构正确和人已观看，并保留失败后的继续位置。", implementation: "pipeline/cleanup.py 的 verify/cleanup 与 workflow 的 manifest 阶段；核对来源、总帧与时长、音视频起点、编码、封面、章节和字幕，再写 delivery.json。dry-run 只列已知可再生项，未知文件与原件保留。" }
  ],
  usageExamples: [
    { moduleSlug: "project-bootstrap", ask: "给下一期视频建一个干净项目，先确认这台电脑能不能跑。", effect: "只向空目录复制通用模板并做本机检查；目录里已有内容就停止，普通体检也不会调用在线配音。" },
    { moduleSlug: "voice-timing", ask: "按这几段已确认旁白生成声音和词级时间，不要因为重跑把旧时间轴套到新音频。", effect: "优先复用仍有效的词轴或 Fish 原生时间；需要本地重对齐时只处理原音频与已确认文案，不为改时间位置再次配音。" },
    { moduleSlug: "scene-authoring", ask: "“核心结论”出现两次，我要第二次才显示数字，素材只用这张图。", effect: "用出现次数和偏移指定触发位置，先在有声预览里听看；未命中、非法属性或素材缺失时不进入长渲染。" },
    { moduleSlug: "preflight-preview", ask: "先把所有场景放在一页里让我看，文字越界就别继续。", effect: "先交回编号、踩点、版面检查和有声预览；可按词跳转并导出修改片段，保存重建后再确认，不把网页编辑器当自动覆盖原件的入口。" },
    { moduleSlug: "deterministic-render", ask: "昨晚渲染中断了，输入没变就接着跑；我换了图片就别混用旧分片。", effect: "输入未变时只补缺失或错误部分；场景、素材、背景、时长或编码变了，就重做受影响的旧分片。" },
    { moduleSlug: "delivery-verify", ask: "把旁白、可选音乐、封面和章节补齐，检查通过再告诉我能不能投稿。", effect: "交回视频、封面、章节、可选字幕与验证后的哈希清单；仍需真实观看，工具不会替我上传。" },
    { moduleSlug: "recovery-reuse", ask: "哪些文件可以删，哪些应该留下让我明天继续？", effect: "只清理能重新生成的分片和拼接临时文件，保留脚本、声音、时间轴、场景、最终成品和续作依据；来源对不上的旧产物不再使用。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "84501b0 的公开主分支实际包含共享对齐、有声审阅、完整阶段来源校验、增量分片与交付清单。", doesNotProve: "当前 Fish 服务可用、这台电脑能完整跑一条视频，或网页已经发布。" },
    { layer: "Tests（回归）", proves: "2026-09-03 保留的源仓库与新工程各 33/33 只证明当时的受控合同；当前源码包含扩展测试和 CI，但本轮没有重新运行源全套或把入口存在称为最新通过。", doesNotProve: "真实 Fish 音色或时间戳、共享对齐的语音准确度、生产 4K60 性能及人工审美。" },
    { layer: "Doctor（环境体检）", proves: "2026-09-18 静态 doctor 回读依赖、背景/模板、协调登记和 ChineseASR 适配入口：10 项通过、Fish 实际路线未探测。", doesNotProve: "Fish 网络响应、长视频稳定、成片音画正确或下一次仍不受资源争用。" },
    { layer: "Preview 与完整成片", proves: "只有本期真实 preview、render、merge、cover、chapters、verify 和最终观看才能证明这一期视频的结果。", doesNotProve: "本轮没有执行这些步骤，因此网页不展示演示成片或 READY 结论。" },
    { layer: "Git 与网页发布", proves: "源 main 远端回读证明修复已发布；网站 Pages 回读只证明本页部署。", doesNotProve: "代码发布、网页发布和视频平台投稿互不替代。" }
  ],
  operationalEntrypoints: [
    { name: "创建新项目", command: "pwsh -File E:\\Projects\\Archives\\video-scaffold\\run.ps1 init D:\\Videos\\my-next-video", purpose: "目标必须为空；复制通用工具、背景、文档和测试，创建脚本、素材、音频、时间轴、场景、渲染与输出目录。" },
    { name: "项目自检", command: "pwsh -File .\\run.ps1 test", purpose: "维护时运行项目离线回归；不是每次制作都要重跑。2026-09-03 的源和新工程各 33/33 是历史证据，本轮未复跑。" },
    { name: "本机环境体检", command: "pwsh -File .\\run.ps1 doctor --json", purpose: "纯静态只读，不读取密钥文件、不启动浏览器/GPU、不请求 Fish；status/plan 可继续查看工程缺口与重跑原因。真实本地探针另用 doctor-local。" },
    { name: "真实 Fish 探针", command: "pwsh -File .\\run.ps1 doctor-live", purpose: "明确需要时才发送一句“连通性测试。”并验证 MP3 后删除临时目录；本轮没有运行。" },
    { name: "逐阶段制作", command: "pwsh -File .\\run.ps1 <tts|timing|durations|prompts|build|lint|preview|render|merge|cover|chapters|subtitles|verify|manifest>", purpose: "只运行本期需要的阶段；timing --source chinese-asr --force 可对同一音频重对齐，preview --open 启动有声审阅，不能跳过人工检查。" },
    { name: "最终交付检查", command: "pwsh -File .\\run.ps1 verify", purpose: "核对当前来源、真实总帧与时长、音视频流起点、编码/画布/帧率、PNG 封面、章节及 cue；通过后 manifest 生成 delivery.json。READY 不代表已观看或已投稿。" },
    { name: "清理可再生物", command: "pwsh -File .\\run.ps1 cleanup --dry-run", purpose: "先预览可再生临时物清单；明确 cleanup 才执行，保留原件、未知文件和最终交付。失败要说明真实残留，不假报清空。" }
  ],
  evolution: [
    { date: "2026-06-27—2026-06-28", commit: "501d23e—cf7e9dc", result: "形成确定性 SVG 动效、分片渲染、音画合成、封面、章节、验证与归档骨架，并把长渲染前预览和少帧拒绝作为正式流程。" },
    { date: "2026-08-15", commit: "3f4ef22", result: "把环境体检、通用阶段、交付检查和失败语义从旧定制视频中抽成内容中立脚手架，明确环境 Ready 与一条视频 Ready 分离。" },
    { date: "2026-08-30", commit: "1ae60fd—f227e27", result: "统一稀疏和三位数场景编号，修复提示词与产物排序，并让 init_project.py 复制测试和通用入口，使新项目可先自证完整。" },
    { date: "2026-09-03—2026-09-18", commit: "17040ed—84501b0", result: "从输入身份保护发展为全阶段可审阅交付：Fish 原生时间与共享 ChineseASR 取代自带 Whisper，有声预览、重复 cue 选择、增量分片、字幕和交付清单在同一工作流闭合，旧定制入口退出活动树。" }
  ]
};

export const videoScaffoldModules = [
  {
    slug: "project-bootstrap", shortTitle: "新项目与体检", title: "先复制一个干净项目，再判断环境能不能开始",
    searchAliases: ["创建视频项目", "视频环境体检", "doctor和doctor-live区别", "新项目不要带旧素材", "显卡BUSY", "初始化视频脚手架"],
    searchProjection: { intents: ["新建空白视频项目", "检查本机视频环境", "区分本地体检与网络探针"], entities: ["init_project.py", "run.ps1", "doctor", "doctor-live", "Python 3.11", "FFmpeg", "CUDA"], relations: ["空目录接收通用运行时", "静态诊断、本地探针和云端配音分开", "doctor-live单独发网络请求"], failureRecovery: ["非空目录拒绝覆盖", "依赖缺失为FAIL", "显存争用为BUSY", "Fish配置通过不等于网络通过"] },
    teaser: "新项目不夹带上一期内容；先测代码，再测本机环境。",
    status: "空项目初始化与静态诊断已实现；真实本地和云端探针单独运行", statusTone: "pass",
    value: "开始新视频时，我得到一套空白但能检查状态的工作区，不会复制上一期脚本和成片。普通 doctor 只看依赖和登记，status/plan 说明工程缺什么、哪些结果已过期；确需本地编码或云端配音证据时才选择对应探针，不因查状态就动用显卡或账户。",
    why: "旧项目残留会把素材、标题和输出混进新一期；环境缺一环又可能在长渲染时才暴露。初始化只复制通用能力，doctor 只回答机器是否具备当前条件，二者把“项目干净”和“环境能跑”分别验证。",
    example: "我可以说：“在 D:\\Videos\\my-next-video 建一个新项目，别带上一期脚本；先确认这台电脑能不能跑。”目标目录已有内容时会直接停止，不为省事覆盖旧文件。",
    result: "得到 assets、scripts、raw_audio、srt_data、scene_html、rendered、output 等空目录，以及 config、pipeline、模板、背景、文档和测试。test 与 doctor 分别返回代码和环境结果；没有产生视频内容。",
    readerStates: { pass: "新工程复制完整，所需静态条件可见，可以准备内容；实际浏览器、编码和配音按需要分别验证。", problem: "真实本地探针或制作阶段遇到 GPU 资源争用时报告 BUSY；普通静态 doctor 不为获得绿色结果启动显卡工作。", unavailable: "目标非空、Python/FFmpeg/浏览器/CUDA 或必要配置缺失时停止，并指出对应项；不自动安装大依赖或调用付费服务。" },
    decisionImpact: ["test 验维护代码，doctor 看静态环境，status/plan 看本期工程；三者不是每次都必须执行的全套检查。", "doctor 不发 Fish 请求；doctor-live 才是实际网络探针。", "环境 Ready 不能替代脚本、画面、成片和人工观看。"],
    problem: "防止复制旧视频污染新项目，也防止因为一个命令返回绿色就把尚未制作的内容称为完成。",
    implementation: ["init_project.py 拒绝非空目标，先暂存完整通用模板再交到新目录，不复制已生成音频、成片、密钥或 .video-machine.json。", "旧 build_v2.py 与定制封面已退出活动源树；通用 scene_base.html、cover_base.html 与隔离演示入口保留，不清理用户旧工程。", "run.ps1 按 VIDEO_PYTHON、项目 .venv、机器适配、py -3.11、系统 python 解析解释器，再统一进入 pipeline.workflow。", "doctor 只检查 Python 包、FFmpeg/ffprobe、背景/模板文件、已登记 GPU 协调及 ChineseASR 适配；不启浏览器/GPU，不读取私钥文件、不发网络请求。", "doctor-local 承担明确本地探针；doctor-live 才调用 Fish 并消耗额度。smoke/demo 的 CPU H.264 是显式隔离测试，不是生产 NVENC 失败后的自动降级。"],
    flow: ["选择一个空目标目录。", "复制通用源并创建工作目录与被忽略的密钥占位文件。", "维护变更时运行 test；开始普通制作不强制重跑整套回归。", "运行 doctor，读取本机环境结果。", "只有需要真实 Fish 证据时再单独运行 doctor-live。"],
    concepts: [{ term: "bootstrap（项目初始化）", explanation: "把通用工具复制成一份新的独立工作区，不含上一期的业务内容。" }, { term: "doctor（环境体检）", explanation: "只检查当前环境能力，不生产视频，也不证明内容完成。" }, { term: "BUSY（资源正忙）", explanation: "编码器存在，但显卡当时没有足够资源；释放已有工作后可重试，不能当缺依赖。" }],
    boundaries: ["初始化不替人确定标题、脚本、素材或场景。", "本轮没有执行 doctor-live，不声称 Fish 当前真实响应。", "项目依赖可按正式入口安装，但付费、账号和重型下载不是浏览页面时自动执行的动作。"],
    failures: [{ condition: "目标目录已有内容", response: "拒绝覆盖，要求换空目录或先由人处理现有内容。" }, { condition: "NVENC 显存压力", response: "返回 BUSY 和显存信息，不把它改写成永久不支持。" }, { condition: "明确配音时 Fish 配置缺失", response: "TTS 或明确配置探针失败，不打印密钥、不换声线或服务；静态 doctor 不读取密钥，也不假报账户可用。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\init_project.py", role: "通用文件复制、空目录和拒绝覆盖" }, { path: "E:\\Projects\\Archives\\video-scaffold\\run.ps1", role: "统一 Python 与阶段入口" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\doctor.py", role: "本机与可选网络体检" }, { path: "E:\\Projects\\Archives\\video-scaffold\\tests\\test_workflow_readiness.py", role: "初始化与 doctor 回归" }],
    verification: ["2026-09-03 历史源仓库 33/33，本轮未重新运行。", "2026-09-03 历史新初始化工程 33/33；当前源码新增隔离 smoke 与 Windows/Linux CI，入口存在不等于本轮执行。", "2026-09-18 13:02 UTC 静态 doctor 10 PASS、1 UNKNOWN；没有运行 doctor-local 或 doctor-live。"],
    relation: "本模块只决定项目和环境能否开始；旁白模块拥有外部配音和词级时间，后续模块才形成画面与交付。"
  },
  {
    slug: "voice-timing", shortTitle: "旁白与词级时间", title: "让每段旁白有声音，也知道每个词在什么时候出现",
    searchAliases: ["Fish Audio配音", "Fish原生时间戳和ChineseASR对齐", "旁白改了时间轴怎么办", "TTS旧音频复用", "data-cue时间来源", "场间停顿"],
    searchProjection: { intents: ["生成分场旁白", "取得每个词的时间", "修改脚本后重建音频", "避免旧时间轴"], entities: ["script_NN.txt", "audio_NN.mp3", "s2.1-pro-free", "Qwen3-ForcedAligner-0.6B", "durations.json", "srt_NN.json"], relations: ["脚本身份绑定音频", "音频身份绑定时长与词级JSON", "Fish原生时间优先 缺失时共享ChineseASR对齐"], failureRecovery: ["旧产物无身份拒绝复用", "Fish失败硬失败", "音频变更要求timing --force", "编号不一致阻断"] },
    teaser: "优先用配音自带的时间；缺少时本地对齐，不重复配音或再养一套语音模型。",
    status: "Fish 原生时间与 ChineseASR 按需对齐已实现；本轮未发云请求或加载模型", statusTone: "mixed",
    value: "每一场脚本先得到一段旁白，再得到真实时长和词级开始/结束时间。画面不需要靠人手写“第 2.4 秒出现”，而是可以跟着旁白真正说出的词触发；脚本或音频变了，也不会再把旧结果静默套进新视频。",
    why: "旁白是视频节奏的基准。只看文件是否存在，会让改过的脚本继续使用旧声音，或让新声音沿用旧时间轴，后面所有画面都可能错位。身份文件把内容和会改变结果的配置一起绑定，变更时先停下来。",
    example: "我可以说：“把三段已确认文案生成旁白和词级时间；第二段刚改过，只重做它，别把旧时间位置套回来。”系统只复用仍与当前输入一致的声音和时间轴。",
    result: "每场得到 MP3、来源身份与输出哈希；timing 选择有效已有词轴、同音频 Fish 时间或共享 ChineseASR 对齐，生成 word/start/end 结果。词轴用于动画、有声审阅和可选字幕；独立 durations 只读时长，不做语音推理。",
    readerStates: { pass: "所有脚本、音频、时长和词级结果编号一致，身份与输出哈希匹配。", problem: "脚本、模型、声线、音频或识别配置变化时说明哪层陈旧；保留旧文件但不继续用。", unavailable: "Fish 失败或密钥缺失时停止配音；只有需要共享对齐而解释器、模型或 GPU 不可用时阻断该路线。有效 Fish 时间不因本地 ASR 缺失而失效；损坏的已存词轴不能当缺失静默绕过。" },
    decisionImpact: ["标准配音会把旁白文本发给 Fish Audio，不能称完全离线。", "已有音频不因文件非空自动可信；身份匹配才复用。", "重复词用 data-cue-index 指定次数，词轴重建不要求 tts 重配音；模型时间仍要听音确认。"],
    problem: "防止脚本、旁白与时间轴三者漂移，以及将配置存在误写为真实网络或识别成功。",
    implementation: ["fish_tts.py 把脚本文本、端点、模型、声线、格式和 0.2 秒尾静音写入 audio_NN.identity.json，并回验 MP3 SHA-256。", "Fish 合成按当前模型、声线、格式和原生时间请求处理；密钥仅在明确 TTS 或相关配置探针时解析，非空本地值优先，空示例不会覆盖环境变量，秘密不进入身份记录。", "durations.py 用 ffprobe 读取每段音频秒数，durations.json.identity.json 绑定顺序音频名称、SHA-256 和输出哈希。", "transcribe.py 在 auto 模式优先保留绑定有效的旧词轴，再读取同音频 Fish 原生时间；确需对齐才调用已登记 ChineseASR 的 Qwen3-ForcedAligner-0.6B。传入已确认文案与音频，每场上限 300 秒，模型和依赖不属于视频工程。", "workflow 在后续读取 durations.json 前再次核对当前音频身份；Fish 需要生成而失败时直接抛错，旧文件不能让 stage_tts 假绿。"],
    flow: ["按规范编号读取非空脚本。", "普通运行先核对现有音频身份；不匹配则要求审阅并 force。", "成功配音后加入场间停顿并原子记录身份。", "独立读取时长，选择原生时间或必要的共享对齐；不因改词轴重做已接受的音频。", "后续阶段再次确认时长表仍属于当前音频。"],
    concepts: [{ term: "reference voice（参考声线）", explanation: "Fish 配音使用的公开配置标识；它不是 API 密钥，也不证明服务当前可用。" }, { term: "word timestamp（词级时间）", explanation: "每个识别词的开始和结束秒数，精度服务画面触发，但仍受识别结果影响。" }, { term: "--force（明确重建）", explanation: "确认脚本、音频或识别需要变化后才重生成，防止普通重跑改掉已验收节奏。" }],
    boundaries: ["情绪与停顿标记用于 Fish 配音；共享对齐使用适配后已确认文案，不把这些标记当作实际发音。", "词轴不默认烧录字幕，也不验证文案真伪；超 300 秒的单场对齐要求按已审阅分镜拆场，不能把时间估计当逐音素真值。", "本轮只读源码、登记与静态 doctor，没有发送旁白或加载模型。旧配音 v1 身份和有效 Whisper 词轴可继续读取，不伪造新来源。"],
    failures: [{ condition: "旧音频没有身份或脚本变了", response: "拒绝复用，保留旧文件并提示审阅后运行 tts --force。" }, { condition: "Fish 返回错误或空内容", response: "当前阶段硬失败，即使旧 MP3 仍在也不能通过。" }, { condition: "音频、文案或对齐来源改变", response: "拒绝过期词轴；明确 timing --source chinese-asr --force 可只重建时间位置，保持原配音，随后重建受影响场景。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\fish_tts.py", role: "外部旁白、尾静音与音频身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\durations.py", role: "真实时长与音频身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\transcribe.py", role: "词轴复用、Fish 原生时间与共享 ChineseASR 对齐适配" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\artifact_identity.py", role: "SHA-256 与原子伴随记录" }],
    verification: ["2026-09-03 历史 33 项回归覆盖旧脚本/音频身份；当前 test_speech_linkage.py 扩展原生词轴和共享对齐合同，本轮未重跑源全套。", "本轮静态 doctor 证明路由和适配入口存在，不证明实际 API、声线或本地语音推理成功。", "本轮没有生成 audio_NN.mp3 或 srt_NN.json 的真实样例。"],
    relation: "本模块给场景提供声音、总时长和可 cue 词；场景创作负责如何使用这些时间，渲染负责逐帧执行。"
  },
  {
    slug: "scene-authoring", shortTitle: "场景与动画", title: "把旁白、真实素材和动画规则收进可审阅的 SVG 场景",
    searchAliases: ["SVG场景怎么写", "data-cue旁白真词", "视频场景提示词", "AI生成动画片段", "seekTime动画组件", "素材file URI"],
    searchProjection: { intents: ["按旁白设计一个场景", "让画面跟词出现", "使用指定图片素材", "复用动画组件"], entities: ["prompt_NN.txt", "fragment_NN.svg", "scene_NN.html", "data-anim", "data-cue", "v2lib", "components.py"], relations: ["prompts只组装不调用模型", "人工或AI审阅SVG", "cue转换为delay", "素材URI来自真实路径"], failureRecovery: ["缺素材不虚构路径", "cue未命中阻断", "动画节点不混定位transform", "运行时随机禁止"] },
    teaser: "提示词只准备证据；真正的 SVG 片段必须由人或 AI 审阅。",
    status: "通用场景合同与组件已实现；本轮无新场景或作品", statusTone: "mixed",
    value: "旁白、可触发的真实词和本期素材被整理成每场一份提示，人或 AI 只需产出小型静态 SVG 片段。公共模板负责动画运行时，组件库负责标题、数字、路径、图表和高级效果；场景源仍能直接阅读和修改。",
    why: "让模型输出整页 HTML、CSS 和脚本，很容易重复运行时、制造不可控时钟或虚构素材路径。把职责缩成 SVG 片段后，每场内容可审阅，公共时间函数和设计契约只有一份，错误也能在构建阶段定位。",
    example: "我可以说：“第二场只用我给的 hero.png；念到‘三项变化’时画三条线，最后数字滚动到 82。”系统会把真实素材和说词时间交给场景制作，只有审阅通过的画面才进入预览。",
    result: "得到 prompt_NN.txt、fragment_NN.svg 与 scene_NN.html。data-cue-index 选择词语出现次数，data-cue-offset 添加偏移，解析后保留唯一有效延时；重复属性、未知动画、非法时间或未命中词都阻断。",
    readerStates: { pass: "片段由人或 AI 审阅，编号、cue、属性和动画合同通过，得到 seekTime(t) 驱动的场景；机器合同仍不评价全部审美和内容事实。", problem: "词重复、识别错误、素材或版式不明确时回到时间轴与原图审阅，保留具体标记。", unavailable: "缺少脚本、词轴或片段就停止。无素材场景可以成立；提示生成不暗中调用另一模型，片段仍由人或当前 AI 负责。" },
    decisionImpact: ["prompts 不是自动场景生成，保存 fragment 才是创作动作。", "cue 必须来自真实发音，屏幕数字与旁白读法不一致时选择稳定邻近词。", "高级动效仍必须是时间 t 的纯函数，不能因预览能动就引入真实时钟。"],
    problem: "防止模型生成失控页面、素材引用凭空出现，以及动画表面正常却与旁白没有可追溯关系。",
    implementation: ["author.py 读取脚本和 srt，注入实际可用词串与素材 Path.as_uri()，没有素材时明确写无；它只生成 prompt_NN.txt。", "片段不重复 html/style/script 或独立时钟，定位放外层、动画放内层；构建验证重复属性、已知动画、合法时间和 cue，内容布局与审美仍由人或 AI 审阅。", "build_scene.py 支持正常单/双引号属性、有限中文数字变体、data-cue-index 和 data-cue-offset；解析后仅有一个生效延时，未命中或非法属性明确失败。", "scene_base.html 的 seekTime(t) 实现 type、fade、draw、count、grow、wipe、move-along 等原语。", "v2lib.py 和 components.py 提供标题、数字、表格、路径、全息、形变、粒子、流体、翻转、脉冲等静态片段生成器；随机参数在 Python 端固定。"],
    flow: ["脚本与时间轴就绪后运行 prompts。", "阅读本场旁白、可 cue 词与真实素材 URI；无素材场景可以继续。", "人或 AI 设计 SVG 片段并按结构指南审阅。", "按规范命名 fragment_NN.svg。", "build 强制脚本、时间轴与片段编号一致，解析 cue 并组合公共模板；已引用素材的存在性在渲染身份阶段检查。"],
    concepts: [{ term: "fragment（场景片段）", explanation: "只放在公共 SVG 舞台内部的本场内容，不重复整页运行时。" }, { term: "data-anim（动画原语）", explanation: "声明元素随时间如何出现、移动或变化；实际状态由 seekTime(t) 计算。" }, { term: "file URI（本地文件地址）", explanation: "把明确素材的绝对路径编码给浏览器使用；没有素材就明确写无，不虚构。" }],
    boundaries: ["组件库提供画面能力，不替人判断事实、审美和信息层级。", "重复 cue 已可选择具体次数；词轴估计或词内插值的误差仍需听音与有声预览修正。", "旧定制 builder 和封面只留 Git 历史，不是当前活动入口；原工程文件不因升级被自动删除。"],
    failures: [{ condition: "片段包含指南禁止的结构", response: "重复属性、未知动画和非法时间由构建阻断，其它内容与视觉问题由人或 AI 退回修改；不把合同通过说成完整美学验收。" }, { condition: "cue 未在时间轴找到", response: "明确阻断 build/verify；先核对音频与词轴，选择真实词语、出现次数或偏移，再重建和听看。" }, { condition: "已引用的素材路径不存在", response: "提示阶段不虚构，渲染身份读取 file:/// 资源时会直接失败；没有引用素材的场景不因此失败。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\author.py", role: "场景提示与真实素材 URI" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\build_scene.py", role: "cue 解析与模板组合" }, { path: "E:\\Projects\\Archives\\video-scaffold\\templates\\scene_base.html", role: "确定性动画运行时" }, { path: "E:\\Projects\\Archives\\video-scaffold\\v2lib.py", role: "完整 SVG 组件与高级动效" }],
    verification: ["回归覆盖真实 URI、稀疏/三位数编号、cue 解析与缺失标记。", "2026-09-03 历史 doctor 曾加载 Chromium 并确认 seekTime；本轮只读静态诊断，未重跑浏览器或制作新场景。", "本轮没有实际创作或人工观看一个新场景，不展示占位图为成片证据。"],
    relation: "本模块产出可渲染场景；前置预览模块负责低成本验收，渲染模块负责把同一时间函数变成视频帧。"
  },
  {
    slug: "preflight-preview", shortTitle: "构建与预览", title: "把编号、踩点和越界问题拦在长渲染之前",
    searchAliases: ["视频渲染前检查", "文字超出画布", "动态场景预览", "lint HARD", "preview.html", "cue缺失为什么失败"],
    searchProjection: { intents: ["渲染前检查所有场景", "发现画布外文字", "先看动画节奏", "核对场景编号"], entities: ["build", "lint", "preview", "preview.html", "data-cue-missing", "HARD finding"], relations: ["build先对齐编号和cue", "lint浏览器检查布局", "preview人工看动态", "三者先于render"], failureRecovery: ["浏览器检查失败也阻断", "文字越界回场景修", "有声预览仍不是最终转场和整片验收", "soft项由设计语境判断"] },
    teaser: "先在几秒内看全场景，别等长渲染后才发现硬错误。",
    status: "构建、布局阻断、有声预览与片段导出已实现", statusTone: "pass",
    value: "消耗显卡长渲染前，我能确认脚本、词轴和 SVG 是否对应，找出缺词与文字越界，再听着旁白查看动画。预览支持按词跳转、拖动时间和暂停保留画面；需要改踩点时导出片段，保存后重建，不直接写坏原件。",
    why: "静态看 SVG 很难判断动画节奏，单元测试也看不出信息层级是否舒服；反过来，直接渲染完整视频又太慢。构建、浏览器布局检查和动态预览形成一个低成本人工关口。",
    example: "我可以说：“先把 12 个场景都放到预览页；任何标题越界或关键词踩点缺失都别渲染。”系统会先交回集中预览和问题清单，长渲染仍等待确认。",
    result: "得到场景 HTML、布局问题清单和 output/preview.html。有声预览可切换场景、按词跳转并导出 cue 修改；serve 仅临时提供回环 HTTP 依赖，Ctrl+C 结束。它仍不替代最终转场、混音和成片观看。",
    readerStates: { pass: "编号、cue 与每场收尾稳定帧的布局硬检查通过，人工看完所有场景并明确可进入渲染。", problem: "中途越界、soft 布局提示或审美问题交给动态预览和人判断；修改片段后重建并重新预览。", unavailable: "浏览器启动失败、场景或时长不完整时停止。背景缺失时 preview 可用纯色后备继续，但 doctor 与真实 render 仍会因缺少背景失败。" },
    decisionImpact: ["lint 的浏览器故障是阻断，不等于没有发现越界。", "有声预览能帮助修正说词与画面，但最终转场、背景音乐和完整媒体仍在交付后另验；导出的片段保存重建后才生效。", "人工确认是产品步骤，不由绿色测试自动代替。"],
    problem: "防止低成本可发现的问题拖到昂贵渲染后，也防止把预览页误当最终成片。",
    implementation: ["workflow.stage_build 在全链保留 01、04、100 等真实稀疏编号，scripts、fragments、srt 与时长对应关系必须一致，不按数量相等猜配对。", "每场 build 后扫描 data-cue-missing，任何未解析词都使整个阶段失败。", "lint.py 用 Playwright 将每场设到 max(0.5 秒, 场景时长减 0.4 秒) 的一个收尾稳定帧，再检查元素边界；画布外文字计为 HARD，中途状态仍需动态预览。", "preview.py 优先从真实 4K 背景抽一帧，为每场 scene HTML 建独立 iframe 网格；背景不存在时使用纯色后备，不因此伪装真实背景验收。", "预览绑定音频与真实词轴，可拖动、按词定位、切场和暂停保留状态；cue 编辑只导出新片段。preview 不带 --open 只生成文件，--open / serve 通过受控回环临时端口打开所需资源。"],
    flow: ["运行 build 生成所有场景 HTML。", "检查缺失 cue、编号和时长。", "运行 lint，修复每个 HARD 项。", "生成 preview.html。", "听着旁白逐场核对节奏、留白、素材和层级；修改片段保存并重建，确认后再 render。"],
    concepts: [{ term: "HARD finding（硬错误）", explanation: "当前收尾稳定帧发现的画布外文字，或运行时检查失败；必须修复后才能继续。" }, { term: "preview（动态预览）", explanation: "浏览器中的有声审阅入口，支持时间控制和词语定位；不是最终合成视频，也不替代完整混音与转场验收。" }, { term: "stable frame（稳定检查帧）", explanation: "当前 lint 对每场只检查一个接近末尾的确定时刻；它不能覆盖中途越界和全部审美问题。" }],
    boundaries: ["布局检查主要阻断可确定的文字越界，不自动判断全部美感。", "全出血图片等 soft 情况需要结合设计意图，不机械判失败。", "本轮没有生成本期 preview.html，因此页面只说明能力和代码证据。"],
    failures: [{ condition: "编号或场数不一致", response: "列出缺失与多余索引，先修文件集合。" }, { condition: "浏览器无法检查", response: "lint 失败并停止，不把未运行写成 0 HARD。" }, { condition: "人工预览发现节奏问题", response: "回到 fragment 或 cue 修正，重建后再看，不直接进入 render。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\workflow.py", role: "阶段前置关系与编号/cue 阻断" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\lint.py", role: "真实浏览器布局检查" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\preview.py", role: "全场景动态预览" }],
    verification: ["回归覆盖场景数字顺序、preview 时长配对和浏览器失败阻断。", "2026-09-18 静态 doctor 未启动浏览器；当前源码的隔离 smoke 覆盖真实 HTTP、有声控制与片段导出，本轮没有重新运行这些演示。", "本轮未打开源项目的实际 preview，因为没有本期脚本和场景。"],
    relation: "场景创作给出可检查输入；本模块决定是否值得启动长渲染，渲染模块仍需独立验证帧数与续作身份。"
  },
  {
    slug: "deterministic-render", shortTitle: "确定性渲染", title: "每帧按时间算出来，中断后也不能把新旧画面混在一起",
    searchAliases: ["4K60逐帧渲染", "NVENC少帧", "视频断点续作", "渲染分片混旧图", "seekTime逐帧", "AV1编码"],
    searchProjection: { intents: ["渲染4K60视频轨", "中断后继续渲染", "防止新旧分片混合", "检查少帧音画漂移"], entities: ["render.py", "seekTime(t)", "Playwright", "PNG", "FFmpeg", "av1_nvenc", "_chunk_NN.mp4", "_render_identity.json"], relations: ["场景时间驱动透明帧", "背景与前景叠加", "身份匹配才复用chunk", "每段和整轨都数帧"], failureRecovery: ["少帧分片重试", "局部场景漂移只重做受影响分片", "旧chunk删不掉硬失败", "最终帧数不符拒绝交付"] },
    teaser: "渲染速度不改动画时间；只重做受影响画面，但每片都必须证明来源正确。",
    status: "分片来源、输出哈希与少帧保护已实现；本轮未做生产编码探针", statusTone: "mixed",
    value: "浏览器不按真实时间自由播放，而是每截一帧前被设到准确的 t 秒。多个进程分片工作，合法分片在中断后可以继续；若场景、素材、背景或编码配置改变，旧分片不能混进新视频。",
    why: "渲染可能中断，也可能遇到编码退出正常却少帧的异常。只看文件存在或帧数都识别不了同样长度的旧内容；现在既核对分片来源与输出字节，也数帧，局部场景更新不必令完全无关的正确分片全部报废。",
    example: "我可以说：“昨晚完成了前 20 个分片，今天继续；但我换了 hero.png，用过旧图的分片必须重做。”系统会识别素材变化，不把新旧画面拼进同一成片。",
    result: "生成 output/video_track.mp4；每片核对实际覆盖的来源、输出 SHA-256 和帧数，整轨再次核对总帧与身份。成功分片保留到显式 cleanup，以便同源重跑或局部增量；失败不拼接不可信结果。",
    readerStates: { pass: "当前输入身份一致，全部分片与整轨帧数正确，得到无声视频轨。", problem: "单片失败可有界重试；局部场景变动只重做相关分片，背景、公共模板或编码等共享输入变化则使其影响范围内的分片失效。", unavailable: "背景、场景引用素材、浏览器、FFmpeg 或 NVENC 不可用，或陈旧分片无法删除时停止，不拼接不可信轨道。" },
    decisionImpact: ["video_track.mp4 设计上无声，声音在 merge 后的 final_output.mp4。", "静态 doctor 不证明编码可用；显式本地或 GPU smoke 才取得相应证据，单次短片仍不证明所有长渲染稳定。", "分片身份保护同一项目续作，不是跨项目缓存或通用媒体数据库。"],
    problem: "防止渲染速度影响动画时间、显卡少帧造成持续音画漂移，以及中断恢复把旧内容混进新版本。",
    implementation: ["build_timeline 按 durations 累加全局起止时间，seekTime 接收当前场景内相对秒数。", "每 worker 使用无头 Chromium，最多缓存 6 个场景页面；透明 PNG 通过管道送给 FFmpeg。", "背景以 stream_loop 循环并按当前起点裁切，前景 overlay 后可加 vignette 与 grain，再用 av1_nvenc 编码。", "总帧按 60fps 计算；默认最多 300 帧一片、4 workers、失败重试 2 次。", "_render_identity.json 绑定场景 HTML、其中 file:/// 素材、时长、背景 SHA、画布、转场、成片效果、编码参数与实际分片边界。", "复用前逐片回验来源和输出哈希，再用 ffprobe 核对帧数；局部变化只淘汰受影响分片，陈旧受管片删不掉则停止，最终轨再次核对总帧和来源。"],
    flow: ["读取场景、时长与背景。", "计算总帧、分片边界和完整输入身份。", "逐片核对覆盖输入、输出哈希和帧数，不因同名或同长度就复用。", "多个 worker 只处理缺失或错误分片。", "全部正确后无损拼接并核对整轨总帧。", "保留已验证分片与视频轨，直到明确清理；不是成功后立即丢掉全部可复用成果。"],
    concepts: [{ term: "chunk（渲染分片）", explanation: "一段固定帧范围的临时视频；该片覆盖的输入、输出字节与帧数都匹配才可复用。" }, { term: "deterministic（确定性）", explanation: "同一场景在同一 t 秒按同一规则求状态，不依赖当时浏览器跑了多久。" }, { term: "AV1（视频编码格式）", explanation: "当前硬件编码的视频格式；4K60 单帧可用不等于整条长视频已验收。" }],
    boundaries: ["本轮没有完整 render，不公布整片速度、显存峰值或稳定时长。", "背景文件可循环覆盖任意时长，但接缝是否视觉无痕仍需实际看。", "同一路径素材字节受身份保护；未通过 file:/// 引入的外部运行依赖不属于当前场景合同。"],
    failures: [{ condition: "分片少帧或 FFmpeg 非零退出", response: "删除该片并有界重试；仍失败则停止整轨拼接。" }, { condition: "输入身份变化", response: "只废弃受该输入影响的分片，公共背景或编码变更可能影响全部；不把陈旧内容拼进新成片。" }, { condition: "陈旧分片无法删除或素材缺失", response: "硬失败并列出问题文件，不先写入新身份掩盖旧文件。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\render.py", role: "时间线、逐帧抓取、分片、身份、重试与帧数验证" }, { path: "E:\\Projects\\Archives\\video-scaffold\\templates\\scene_base.html", role: "seekTime(t) 画面状态" }, { path: "E:\\Projects\\Archives\\video-scaffold\\background\\background_4k.mp4", role: "当前 4K60 AV1 背景资产" }],
    verification: ["2026-09-03 历史回归验证旧身份保护；当前源码扩展分片输出哈希与局部增量测试，本轮没有重新运行源回归或整轨制作。", "本轮静态 doctor 只确认协调登记，不调用 NVENC；2026-09-03 单帧编码结果保留历史日期，不升级为当前 PASS。", "本轮没有跑完整视频轨；历史 README 的速度与无缝描述不作为当前实测。"],
    relation: "本模块只产出无声视频轨；交付模块把旁白、音乐、封面和章节合入，并执行结构验收。"
  },
  {
    slug: "delivery-verify", shortTitle: "成片与交付", title: "收齐成片、封面、章节和可选字幕，用清单带走已验收的版本",
    searchAliases: ["final_output.mp4怎么生成", "视频背景音乐自动压低", "哔哩哔哩章节", "4K封面", "verify READY", "视频没有声音"],
    searchProjection: { intents: ["合成最终有声视频", "加入背景音乐", "生成4K封面", "生成章节并验收"], entities: ["merge.py", "final_output.mp4", "cover.png", "chapters.txt", "BGM", "sidechaincompress", "verify"], relations: ["旁白与视频轨合成", "BGM随旁白压低", "章节从scene 1开始", "READY先于人工观看"], failureRecovery: ["无旁白拒绝静音成片", "封面标题占位拒绝", "章节起点错误拒绝", "音视频时长差超限失败"] },
    teaser: "结构通过后才生成交付清单；字幕按需导出，READY 后仍要真人观看。",
    status: "交付结构检查已实现；本轮无实际成片验收", statusTone: "mixed",
    value: "渲染出的无声画面轨与分场旁白合成，按需把本人提供的背景音乐压到声音下面；同一期还得到可投稿尺寸的封面和从 00:00 开始的章节。最后一次检查直接读取媒体流和尺寸，不只看文件名。",
    why: "无声视频轨或同名旧文件看似完整，却可能不是本期内容。交付层不仅收齐成片、封面与章节，还核对来源、真实帧数、总时长和音视频起点；可选字幕验证通过后再进入哈希清单，防止带走半新半旧的一包文件。",
    example: "我可以说：“旁白为主，背景音乐只在空隙明显；封面用本期标题，章节从开场开始。检查后再告诉我是否值得观看。”系统会收齐成片、封面和章节；没有旁白时不会交出一条静音成片冒充完成。",
    result: "得到 final_output.mp4、3840×2160 cover.png、chapters.txt，以及按需生成的 SRT/WebVTT。verify 通过后 manifest 写 delivery.json，记录当前交付文件哈希与来源；READY 只表示自动结构验收，未证明人已观看或平台已接收。",
    readerStates: { pass: "必需交付和存在的可选字幕通过当前来源、帧数、时长、流与起点等检查，再生成交付清单。", problem: "音乐过响、封面内容或章节措辞属于人工预览问题；结构失败则回到对应生成阶段。", unavailable: "缺视频轨、旁白、标题、封面或章节时停止，不用空文件、占位标题或静音轨冒充可投稿。" },
    decisionImpact: ["BGM 是可选输入，旁白不是；没有旁白拒绝最终交付。", "verify 检查的是结构和有限时间差，不判断文案事实、音色表现或平台审核。", "项目没有上传动作，READY 后的投稿仍由本人决定。"],
    problem: "防止把无声视频轨、尺寸正确的空封面或有文件无内容的交付包误认为本期完成。",
    implementation: ["merge.concat_audio 按规范编号拼接 MP3，统一配置使其可 stream-copy。", "有 BGM 时先统一立体声，使用 sidechaincompress 在旁白出现时压低音乐，混合后限制峰值并做 1.2 秒尾淡出。", "cover.py 用 Playwright 渲染 cover_base.html；PROJECT_TITLE 不能仍为 Untitled Video。", "chapters.py 把 scene 组和累计时长转换为 MM:SS/HH:MM:SS，第一章补到 00:00，并对数量、标题长度和过近章节发警告。", "cleanup.verify 检查当前来源、总帧与总时长、视频/音频流时长及起点、画布/帧率/编码、PNG 封面与章节；subtitles 生成全片 SRT/WebVTT，workflow 的 manifest 只在验证通过后纳入文件并写 delivery.json。"],
    flow: ["确认 video_track 与所有旁白存在。", "拼接旁白并与视频合成，可选加入 BGM。", "按当前标题和可选主图生成封面。", "从 chapters.json 生成章节，按需要导出并验证全片字幕。", "运行 verify 逐项阅读，再用 manifest 生成当前交付文件清单。", "实际观看最终视频，再决定投稿。"],
    concepts: [{ term: "mux（音视频封装）", explanation: "把已经编码的视频轨和声音流放进同一个 MP4，不等同于重新设计画面。" }, { term: "sidechain ducking（侧链压低）", explanation: "旁白出现时自动降低背景音乐音量，让人声保持清楚。" }, { term: "READY（交付结构就绪）", explanation: "所有机器可查的交付合同通过；不是人工已经看完，也不是平台已经接收。" }],
    boundaries: ["字幕与哈希清单已经实现；完整投稿文案、上传、平台回执仍不属于此工具。", "封面主图是可选设计输入，尺寸通过不代表主图或标题内容优质。", "本轮没有真实 final_output、封面、章节或人工观看结果。"],
    failures: [{ condition: "没有旁白音频", response: "merge 直接失败，不创建静音 final_output。" }, { condition: "标题仍是占位值", response: "cover 与 verify 拒绝，把本期标题补清后再生成。" }, { condition: "媒体流或时长不符", response: "保留 ffprobe 事实并回到 render/merge，不靠改文件名通过。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\merge.py", role: "旁白、BGM 与最终 MP4" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cover.py", role: "4K 封面" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\chapters.py", role: "章节目录" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cleanup.py", role: "最终交付检查" }],
    verification: ["回归用受控 ffprobe 响应验证完整交付通过，并验证无音频、占位标题和未解析 cue 必须失败。", "当前源码含 Linux CPU 隔离短片 CI，生产 AV1 NVENC 与显式 Fish 路线独立；本轮没有执行 smoke/demo，不能把受控验证写成新真实作品。", "完整视频 E2E 与人工观看仍为具名未验证项。"],
    relation: "渲染模块交出无声 video_track；本模块拥有最终可带走文件和结构门，恢复模块解释哪些中间结果能继续使用。"
  },
  {
    slug: "recovery-reuse", shortTitle: "复用与恢复", title: "旧产物只有身份匹配才复用，清理也只删可再生部分",
    searchAliases: ["视频项目断点恢复", "旧旁白不能复用", "清理渲染临时文件", "audio identity", "durations identity", "渲染失败继续", "cleanup保留什么"],
    searchProjection: { intents: ["继续昨天的视频制作", "判断旧音频能否复用", "清理视频临时文件", "恢复中断渲染"], entities: ["artifact_identity.py", "audio_NN.identity.json", "timing_NN.identity.json", "durations.json.identity.json", "_render_identity.json", "cleanup"], relations: ["输入与输出SHA共同决定命中", "TTS/timing漂移先停", "局部变动重做相关chunk", "cleanup默认保留关键中间层"], failureRecovery: ["无身份保持旧文件但拒用", "无法删陈旧chunk硬失败", "成功后原子写identity", "唯一workflow入口阻止旧定制旁路"] },
    teaser: "可继续不等于盲目沿用；先证明旧文件仍属于当前输入。",
    status: "陈旧复用根因已修复并发布", statusTone: "pass",
    value: "我可以分多次完成一条视频：已确认旁白、时间轴和合法渲染分片不必每次重做。但脚本、音频、场景、素材或配置变了，系统能指出旧结果已经不属于当前版本；清理时又不会把脚本、时间轴和场景源一起删掉。",
    why: "只靠“文件存在”复用会静默混入旧内容；完全不复用又把网络、识别和长渲染成本全部重来。最小身份文件记录输入配置与 SHA-256，既不保存正文和密钥，也能把真正相同与只是同名分开。",
    example: "我可以说：“明天接着做：没变的旁白继续用，第二场换图后重渲；清理今天的临时分片，但保留时间轴和场景。”系统会只删能重建的内容，并留下继续制作所需的材料。",
    result: "有效音频和词轴可继续复用，重对齐不必重配音；每片验证覆盖输入、输出哈希和帧数后才复用，局部变化只重做相关片。cleanup --dry-run 先列已知可再生清单，实际清理保留原件、未知文件和最终交付，残留不能冒充成功。",
    readerStates: { pass: "身份 schema、输入字段、输出哈希和当前文件全部匹配，复用或续作有依据。", problem: "身份缺失、损坏或任何输入漂移时说明陈旧层；TTS/timing 不自动覆写，render 只处理可再生 chunk。", unavailable: "受管旧分片无法删除、源素材缺失、身份无法原子写入或输出为空时停止，不把部分状态登记为可复用。" },
    decisionImpact: ["身份文件位于被忽略的项目工作区，不是第二个数据库或后台服务。", "SHA-256 证明字节和配置对应，不证明内容事实、音色或审美正确。", "旧配音 v1 身份和绑定有效的旧 Whisper 词轴继续读取；缺身份、损坏或漂移不自动背书。需要重算只重建受影响层，不因模型路线升级强制重配音。"],
    problem: "在保留断点续作价值的同时，消除脚本、音频和画面更新后仍使用同名旧产物的假成功。",
    implementation: ["artifact_identity.py 只提供 SHA-256、容错读取、同目录原子 JSON 写入和输出哈希回验，没有数据库、服务或 watcher。", "audio_NN.identity.json 绑定有效脚本文本、Fish 端点/模型/声线/格式、尾静音和 MP3 输出。", "timing_NN.identity.json 绑定音频、已确认文案、实际词轴来源与输出；Fish 原生时间和 ChineseASR 适配明确区分，旧有效 Whisper 身份仅用于兼容读取，不再启动自带模型。", "durations.json.identity.json 绑定数字顺序的音频名称与哈希以及时长表输出；workflow 在读取时再次核对。", "渲染身份覆盖场景、素材、背景、时长、画布、转场、效果、编码和分片边界，逐片回验输出 SHA；来源变化按实际影响淘汰分片，成功分片保留到显式清理。", "旧 build_v2.py 与定制封面已从活动树移除，Git 保留历史；统一 run.ps1 / pipeline.workflow 的前置验证不再由旧计数短路绕过。"],
    flow: ["阶段开始时计算当前输入身份。", "读取伴随记录并回验输出字节。", "完全匹配则复用。", "TTS/timing 不匹配时保留旧文件并要求明确 force。", "只重做输入或字节验证失败的相关渲染分片；陈旧受管文件无法处理时停止。", "新产物成功且非空后才原子写身份。", "交付确认后按默认 cleanup 清理临时物。"],
    concepts: [{ term: "identity（产物身份）", explanation: "回答“这份输出由哪组输入和配置产生”，不是用户身份或权限系统。" }, { term: "SHA-256（字节摘要）", explanation: "检测文件是否发生字节变化；同摘要不能证明内容语义正确或真实。" }, { term: "atomic write（原子写入）", explanation: "先写同目录临时文件再替换，避免崩溃留下半份 JSON 被误当有效记录。" }],
    boundaries: ["身份文件不包含 Fish 密钥或完整脚本文本，只保存摘要和公开配置字段。", "不为复用新增后台进程、共享缓存或跨项目服务。", "cleanup 仅处理已知可再生物，可先 dry-run；原件、未知文件和最终成品保留，旧定制 reset/archive 不再是当前活动入口。"],
    failures: [{ condition: "旧输出存在但身份缺失或损坏", response: "TTS/timing 拒绝复用并提示明确 force；不自动签认历史。" }, { condition: "输出字节被改写", response: "哈希不匹配，当前伴随记录失效。" }, { condition: "陈旧渲染分片被占用无法删除", response: "停止并列出文件，不先写新身份导致后续误复用。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\artifact_identity.py", role: "共享最小身份函数" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\workflow.py", role: "后续阶段的时长身份门" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\render.py", role: "场景/素材/背景/配置续作身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cleanup.py", role: "可再生临时物清理" }],
    verification: ["2026-09-03 历史 33 项回归覆盖当时的 TTS、词轴、时长及渲染身份；当前源码列有语音联动和增量复用测试，本轮未重新执行源全套。", "2026-09-03 历史新初始化项目 33/33，不代表当前所有升级路径已重新实测。", "2026-09-03 的独立实现审查曾补出 file:/// 素材缺口并复核；该历史结论不替代当前完整视频或所有恢复路径的实际验收。"],
    relation: "这是贯穿旁白、时间轴与渲染的恢复边界；它不新增产品阶段，只保证各阶段的复用不会改变当前视频内容。"
  }
];

export const project = videoScaffoldProject;
export const modules = videoScaffoldModules;
