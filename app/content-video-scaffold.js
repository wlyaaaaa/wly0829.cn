import { createProjectSnapshot } from "./project-snapshot.js";

const videoScaffoldSnapshot = createProjectSnapshot({
  observedAt: "2026-09-03T20:29:47.9800867Z",
  label: "源项目陈旧复用缺陷已修复并发布；33 项源回归、33 项全新项目回归与 10 项本机体检通过",
  boundary: "本轮没有发送 Fish Audio 请求、生成演示视频、执行完整 4K60 渲染或人工观看成片；环境就绪、源码通过与一条真实视频完成是三层不同证据",
  metrics: [
    { label: "画布", value: "3840×2160 · 60fps" },
    { label: "命令阶段", value: "12 个" },
    { label: "源回归", value: "33 / 33" },
    { label: "环境体检", value: "10 / 10" }
  ],
  facts: [
    { label: "它真正解决的事", value: "把已经确定的文案、素材和场景设计，分阶段做成旁白踩点、可预览、可续作渲染的 4K60 视频、封面和章节；它不是自动选题或一键投稿服务。" },
    { label: "普通输入与结果", value: "每场一份 script_NN.txt，加上明确素材和人工或 AI 审阅后的 SVG（可缩放矢量图）片段；最终工作区交回 preview.html、final_output.mp4、cover.png 和 chapters.txt。" },
    { label: "当前来源", value: "PUBLIC（公开）仓库 wlyaaaaa/video-scaffold；本机维护目录 E:\\Projects\\Archives\\video-scaffold；main=origin/main=17040edc0a8f5b2a26116e204d1705cb5d6490ed，工作区干净。", hero: false },
    { label: "当前环境体检", value: "2026-09-03 本机 doctor 共 10/10 PASS：Python 3.11.9、所需 Python 包、FFmpeg/ffprobe、AV1 4K60 背景、NVENC 4K AV1 单帧、SVG seekTime(t)、一个 CUDA 设备、faster-whisper large-v3 缓存与 Fish 配置均可见。", hero: false },
    { label: "体检不是成片", value: "NVENC（NVIDIA 硬件编码器）只编码了一帧，SVG 运行时只在无头浏览器加载；Fish 只检查模型、声线与密钥已配置，没有调用网络。完整旁白、识别、场景预览、渲染、合成与观看本轮均未执行。", hero: false },
    { label: "当前软件组件", value: "playwright 1.60.0、faster-whisper 1.2.1、requests 2.34.2、moderngl 5.12.0、numpy 2.4.6、nvidia-cublas-cu12 12.9.2.10 与 nvidia-cuda-runtime-cu12 12.9.79；版本存在不等于全部真实视频路径已跑。", hero: false },
    { label: "配音与时间轴", value: "标准 TTS（文字转语音）通过 https://api.fish.audio/v1/tts 使用 s2.1-pro-free 与公开配置的云飞声线；旁白文本会离开本机。faster-whisper large-v3 在本机 CUDA float16 上生成词级时间轴。", hero: false },
    { label: "画面与编码", value: "场景 HTML 由静态 SVG、data-anim 和 data-cue 组成；Playwright 逐帧调用 seekTime(t) 截取透明 PNG，再由 FFmpeg 叠到背景并用 av1_nvenc、p6、CQ 22、10-bit yuv420p10le 编码。", hero: false },
    { label: "源修复", value: "17040ed 为音频、词级时间轴、时长表和渲染续作增加输入与输出 SHA-256 身份；脚本、音频、场景、素材、背景或渲染配置变化后不再只因旧文件存在或分片帧数正确而误复用。", hero: false },
    { label: "修复验证", value: "源仓库连续回归最终为 33/33，Python compileall 通过；init_project.py 复制出的全新项目也独立运行同一 33/33。独立实现审查在补齐场景 file:/// 素材字节身份后报告 P0=0、P1=0。", hero: false },
    { label: "真实背景资产", value: "background/background_4k.mp4 为 8,861,084 B、60 秒、3600 帧、10-bit AV1、3840×2160、60fps，SHA-256=6649aba6db11a94a6f516a2a276c33776301e71b8007dab3d850e646fb2b2a73。", hero: false },
    { label: "内容现场", value: "公开源仓库保留通用背景、模板、组件、文档和一个明确写有 SAMPLE GEAR / PLACEHOLDER 的占位素材，不包含本轮可公开展示的完整成片；旧 build_v2.py 和定制封面只作历史示例。", hero: false }
  ],
  gaps: [
    "本轮没有调用 doctor-live，因此 Fish 模型、声线、账号与网络的当前真实合成兼容性仍未验证；配置 PASS 不能替代一段实际 MP3。",
    "本轮没有从脚本走到 final_output.mp4，也没有打开 preview.html 或观看最终视频；不能把 10 项环境体检、33 项回归或单帧 NVENC 探测写成完整视频 Ready。",
    "data-cue 对重复出现的同一个词使用首个匹配位置，多字词内部时间采用线性分配；应称词级时间轴上的帧级触发，不承诺每种旁白都绝对逐字无歧义。",
    "背景文件可循环供长视频使用，但着色器中的全部噪声是否在 60 秒接缝严格连续没有本轮视觉验收，不使用“绝对无缝”作为已证结论。",
    "通用脚手架产出成片、封面和章节，不生成完整投稿元数据，也不执行上传；仓库当前没有 LICENSE 或持续集成配置，公开源码不等于已声明开源许可。"
  ]
});

export const videoScaffoldProject = {
  order: 22,
  slug: "video-scaffold",
  title: "video-scaffold",
  kicker: "本地视频制作流水线 · 源修复已发布 · 2026-09-03 20:29 UTC 核对",
  route: "/projects/video-scaffold",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "工具链就绪；真实成片仍按每期内容验收",
  cardStatusTone: "pass",
  ...videoScaffoldSnapshot,
  searchAliases: ["video-scaffold", "本地视频制作流水线", "旁白和动画同步", "4K60视频制作", "视频渲染断点续作", "做视频先预览再渲染", "第22项目"],
  repositoryNote: "video-scaffold 是公开的视频生产脚手架，源码负责本地场景、时间轴、渲染和交付检查；Fish Audio 是标准配音阶段的外部服务。网站只解释工具链与最后一次核对结果，不接收访客脚本、素材、密钥或视频，也不提供在线编辑与渲染。",
  summary: "video-scaffold 把已经确定的旁白文案、图片素材和场景设计接成一条可分段检查的视频生产线。每场旁白先生成音频和词级时间轴，人或 AI 再把审阅后的 SVG（可缩放矢量图）画面绑定到真实说出的词；长渲染开始前先构建、查越界并打开动态预览。确认后，浏览器逐帧给出画面，FFmpeg（音视频处理工具）与 NVENC（显卡硬件编码器）合成 4K60（4K、每秒 60 帧）视频，最后补旁白、可选背景音乐、封面和章节。它不替我决定选题、脚本或分镜，也不自动投稿。本轮已修复旧产物误复用问题，但没有为网页专门生成一条演示视频。",
  why: "视频制作最浪费时间的不是写一个文件，而是几分钟甚至更久的渲染完成后才发现文字越界、关键词踩点错了，或中断续作把旧场景和新场景拼在一起。这套脚手架把昂贵步骤拆开：能在浏览器里早看就先看，能用词级证据对齐就不靠目测猜秒数，需要重跑时只复用身份仍匹配的产物；任何关键层不成立，就停在对应阶段而不是交出一条看似完成的视频。",
  plainExample: "我可以说：“按这份已经确认的脚本做一条视频。每段旁白一场，念到‘核心结论’时再让重点数字出现；先把所有场景放进预览页给我看，确认后再渲染 4K60，并生成成片、封面和章节，不要自动上传。”脚手架负责把这些阶段串起来，选题、文案事实和最终审美仍由我确认。",
  result: "工作过程中会得到分场脚本、audio_NN.mp3、durations.json、srt_NN.json、prompt_NN.txt、fragment_NN.svg、scene_NN.html 和 preview.html；最终交付是 output/final_output.mp4、cover.png 与 chapters.txt。只有 verify 检查标题、音视频流、分辨率、帧率、编码、时长、封面、章节和未解析 cue 都通过，再由人实际观看，才能说这一期视频可以进入投稿环节。",
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
      { source: "raw_audio/audio_NN.mp3", data: "FFprobe 读取每段真实时长，faster-whisper 在本机 CUDA 上识别词与开始/结束秒数；音频字节和识别配置绑定时间轴与时长表。", result: "durations.json、srt_data/srt_NN.json 及对应身份文件；时间轴服务画面触发，不烧进字幕。" },
      { source: "assets/ 与 scene_html/fragment_NN.svg", data: "素材以真实 file:/// URI 写入提示词；人工或当前 AI 审阅提示词后，只保存静态 SVG 片段与动画、cue 属性。", result: "构建后的 scene_NN.html；素材字节也进入渲染续作身份，同一路径换图不会沿用旧画面分片。" },
      { source: "场景 HTML、背景与可选 bgm.mp3", data: "Playwright 按时间 t 截取透明前景帧，FFmpeg 叠到 4K 背景，NVENC 编码；背景音乐由本人提供并在旁白出现时侧链压低。", result: "video_track.mp4 和带 AAC 旁白的 final_output.mp4；没有旁白时 merge 拒绝生成静音最终交付。" },
      { source: "PROJECT_TITLE 与 chapters.json", data: "标题决定封面正文；章节用 1-based 场景编号，第一章必须从 scene 1 开始，编号唯一且递增。", result: "3840×2160 cover.png 和从 00:00 开始的 chapters.txt；它们仍需与本期内容人工核对。" }
    ],
    note: "“本地视频工作流”描述场景、识别、浏览器与渲染主要在这台电脑执行，不等于全程离线。标准 TTS 会发送旁白文本；doctor-live 也会发一条真实网络探针，只有明确需要时才运行。"
  },
  productPrinciples: [
    { title: "内容由人决定，工具链只把已经决定的内容做稳", detail: "选题、事实、脚本和画面取舍不是脚手架的自动输出。prompts 只组装旁白、可 cue 词和真实素材路径，generate() 故意不绑定任何模型；人或当前 AI 审阅后才写 SVG。" },
    { title: "昂贵渲染前，先用便宜步骤暴露错误", detail: "编号、缺文件和 cue 在 build 阶段检查，画布外文字由 lint 阻断，所有场景先进入 preview 动态网格。浏览器预览确认后才启动长渲染，避免把显卡时间花在一眼可见的问题上。" },
    { title: "画面由时间轴决定，不由机器当时跑得快不快决定", detail: "每帧先调用 seekTime(t) 把场景设置到指定时刻，再截图。随机视觉参数在 Python 端用固定种子写入属性，运行时不靠真实时钟推进，因此慢机器不会把动画节奏自行改短。" },
    { title: "复用必须证明还是同一份输入", detail: "音频绑定脚本与配音配置，时间轴和时长绑定音频，渲染分片绑定场景、素材、背景和编码配置。缺身份或哈希变化时不把旧文件冒充本期结果；旁白与识别要求明确 --force，渲染只清理可再生旧分片。" },
    { title: "完整文件不等于内容正确，环境就绪也不等于视频完成", detail: "doctor 只证明环境，单元测试只证明受控合同，verify 检查交付结构；动画节奏、信息层级、素材含义和最终观看仍需人工。每一层只回答自己能证明的问题。" },
    { title: "失败留下可继续的位置，不制造一条带病成片", detail: "合法分片可在同一输入身份下续作；少帧、无法删除的陈旧分片、未解析 cue、无旁白、缺封面或章节错误会停止。默认 cleanup 只删可再生临时物，保留时间轴和场景 HTML。" },
    { title: "制作与投稿分开", detail: "通用工作流交付视频、封面和章节，但不生成完整投稿元数据、不上传、不替人点击发布。看到 READY 以后仍要真实观看，投稿与平台状态属于后续人工动作。" }
  ],
  responsibilities: [
    "把通用运行时、背景、模板、组件、文档和测试复制成一个不夹带旧项目内容的空白视频项目。",
    "把分场脚本生成旁白，读取真实时长并建立本机词级时间轴，保留标准 TTS 的网络边界。",
    "组装带真实素材路径和可 cue 词的场景提示，由人或 AI 产出受约束的静态 SVG 片段。",
    "在长渲染前完成编号、cue、布局与动态预览检查，再按明确时间逐帧合成 4K60 视频轨。",
    "拼接旁白、可选背景音乐，生成封面和章节，并对最终视频结构做交付验证。",
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
    { term: "word timeline（词级时间轴）", meaning: "faster-whisper 输出每个词的开始和结束秒数，用来让画面在旁白说到相应词时动作。" },
    { term: "cue（旁白触发词）", meaning: "SVG 元素写入的真实发音词。构建时转换为具体延迟；没有命中就保留 data-cue-missing 并阻断。" },
    { term: "SVG（可缩放矢量图）", meaning: "每场前景的静态结构，文字、线条、图片和 data-anim 属性都写在其中，再由公共模板驱动。" },
    { term: "seekTime(t)（按时间定位画面）", meaning: "把场景设置为第 t 秒应有的状态；渲染逐帧调用它，而不是等待浏览器自己播放。" },
    { term: "Playwright（浏览器自动化工具）", meaning: "打开场景 HTML、检查布局并截取每一帧透明 PNG；无头检查不等于人工看过画面。" },
    { term: "NVENC（NVIDIA 硬件编码器）", meaning: "由显卡把逐帧画面编码为视频；当前配置使用 AV1、p6、CQ 22 和 10-bit 像素格式。" },
    { term: "sidecar identity（伴随身份文件）", meaning: "保存在生成物旁边的小型 JSON，只记录输入配置与 SHA-256，不保存脚本文本或密钥；用于判断旧产物能否复用。" }
  ],
  operatingFlow: [
    { title: "创建空白项目并先验环境", detail: "init_project.py 复制通用能力并创建空目录；先在新项目运行 test，再运行不联网的 doctor。只有确需验证 Fish 时才单独运行 doctor-live。" },
    { title: "把确认过的旁白按场拆开", detail: "写 script_01.txt、script_02.txt 等规范编号文件，设置项目标题；专业词确实需要时才给本期 Whisper 初始提示。" },
    { title: "生成旁白、时长与词级时间轴", detail: "tts 生成每场 MP3 并加入 0.2 秒场间停顿；timing 用 ffprobe 和 faster-whisper 生成时长与词序。身份不匹配时先审阅，再明确 force。" },
    { title: "让场景只包含可审阅的静态片段", detail: "prompts 注入旁白、可 cue 词与真实素材 URI；人或 AI 只保存 SVG 内部片段，不把整页 HTML、脚本或虚构路径混进去。" },
    { title: "先构建、查硬错误并看动态预览", detail: "build 解析 cue 和编号，lint 检查画布外文字，preview 把所有场景放进可循环播放的网格。人工确认节奏、层级、留白和素材后才继续。" },
    { title: "按固定时间逐帧渲染并可恢复续作", detail: "Playwright 截透明前景，FFmpeg 叠背景，NVENC 分片编码；每段和整轨都核对帧数。中断重跑只接续同一输入身份的正确分片。" },
    { title: "合成旁白并补齐封面和章节", detail: "merge 拼接旁白并按需压低 BGM，cover 生成 4K 封面，chapters 把场景组转成从 00:00 开始的目录。" },
    { title: "验证、观看，再决定是否投稿", detail: "verify 检查交付结构和 cue；人再打开最终 MP4 观看。cleanup 只在确认后清理可再生临时文件，投稿仍是独立人工动作。" }
  ],
  components: [
    { name: "项目初始化与统一入口", responsibility: "从通用仓库创建空白工作区，并让所有阶段使用同一个命令面。", implementation: "init_project.py 复制 config.py、run.ps1、pipeline/、templates/、docs/、background/、examples/、tests/ 与 v2lib.py；run.ps1 选择 Python 3.11 并进入对应模块。" },
    { name: "集中配置", responsibility: "保存画布、编码、转场、配音、识别、章节和目录的唯一当前选择。", implementation: "config.py：3840×2160、60fps、av1_nvenc、4 workers、300 帧分片、Fish s2.1-pro-free、faster-whisper large-v3/CUDA float16 及每项目标题和热词。" },
    { name: "旁白、时长与识别", responsibility: "把每场脚本变成音频、精确秒数和词级触发依据。", implementation: "pipeline/fish_tts.py、durations.py、transcribe.py；音频、时长和词级 JSON 现在都由 artifact_identity.py 绑定输入与输出哈希。" },
    { name: "场景提示、片段与组件", responsibility: "把脚本、时间轴和素材组织成可审阅的 SVG 场景，而不绑定一个固定大模型。", implementation: "pipeline/author.py、build_scene.py、components.py、v2lib.py；模板支持基础与高级 data-anim 原语，缺 cue 留下机器可审计标记。" },
    { name: "浏览器运行时与前置验收", responsibility: "在昂贵渲染前验证确定性时间函数、画布位置和全部场景的动态效果。", implementation: "templates/scene_base.html、pipeline/lint.py、preview.py；lint 的浏览器故障本身也算阻断，preview 是无声人工检查页。" },
    { name: "分片视频渲染", responsibility: "逐帧合成透明前景、背景和成片效果，控制并发并防止静默少帧。", implementation: "pipeline/render.py；按 5 秒上限分片、最多重试 2 次、每 worker 最多保留 6 个页面，正确分片在同一身份下可续作。" },
    { name: "声音与交付收尾", responsibility: "把视频轨、旁白、可选背景音乐、封面和章节组合成可检查交付。", implementation: "pipeline/merge.py、cover.py、chapters.py；BGM 侧链压低并在尾部淡出，最终视频使用 AAC 音频，章节从 scene 1 映射。" },
    { name: "最终验证与清理", responsibility: "区分文件存在、结构正确和人已观看，并保留失败后的继续位置。", implementation: "pipeline/cleanup.py 的 verify/cleanup；检查流、尺寸、帧率、编码、时长、章节与 cue，默认只清理分片、临时音频和 rendered/。" }
  ],
  usageExamples: [
    { moduleSlug: "project-bootstrap", ask: "给下一期视频建一个干净项目，先确认这台电脑能不能跑。", effect: "只向空目录复制通用模板并做本机检查；目录里已有内容就停止，普通体检也不会调用在线配音。" },
    { moduleSlug: "voice-timing", ask: "按这几段已确认旁白生成声音和词级时间，不要因为重跑把旧时间轴套到新音频。", effect: "变化的旁白和时间位置会重新生成，仍匹配的部分才复用；身份对不上就停下来说明。" },
    { moduleSlug: "scene-authoring", ask: "念到“核心结论”时数字出现，素材只用我给的这一张图。", effect: "画面会使用真实素材并跟实际说词对齐；找不到对应词或素材缺失时不进入长渲染。" },
    { moduleSlug: "preflight-preview", ask: "先把所有场景放在一页里让我看，文字越界就别继续。", effect: "先交回场景编号、关键词踩点、版面越界和动态预览；我没有确认前不启动完整 4K 渲染。" },
    { moduleSlug: "deterministic-render", ask: "昨晚渲染中断了，输入没变就接着跑；我换了图片就别混用旧分片。", effect: "输入未变时只补缺失或错误部分；场景、素材、背景、时长或编码变了，就重做受影响的旧分片。" },
    { moduleSlug: "delivery-verify", ask: "把旁白、可选音乐、封面和章节补齐，检查通过再告诉我能不能投稿。", effect: "交回成片、封面和章节并核对音视频、分辨率、帧率与时长；仍要真实观看，脚手架不会替我上传。" },
    { moduleSlug: "recovery-reuse", ask: "哪些文件可以删，哪些应该留下让我明天继续？", effect: "只清理能重新生成的分片和拼接临时文件，保留脚本、声音、时间轴、场景、最终成品和续作依据；来源对不上的旧产物不再使用。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "17040ed 的公开主分支实际包含阶段编排、SVG 运行时、渲染、交付检查和新产物身份修复。", doesNotProve: "当前 Fish 服务可用、这台电脑能完整跑一条视频，或网页已经发布。" },
    { layer: "Tests（回归）", proves: "源仓库与初始化出的全新项目分别 33/33，通过 cue、编号、交付拒绝、身份漂移、素材变更、分片续作和旧入口旁路测试。", doesNotProve: "真实 TTS 音色、Whisper 准确率、完整 4K60 性能和人工审美。" },
    { layer: "Doctor（环境体检）", proves: "观察时依赖齐全，背景、单帧 NVENC、SVG 运行时、CUDA、模型缓存与 Fish 配置可见。", doesNotProve: "Fish 网络响应、长视频稳定、成片音画正确或下一次仍不受资源争用。" },
    { layer: "Preview 与完整成片", proves: "只有本期真实 preview、render、merge、cover、chapters、verify 和最终观看才能证明这一期视频的结果。", doesNotProve: "本轮没有执行这些步骤，因此网页不展示演示成片或 READY 结论。" },
    { layer: "Git 与网页发布", proves: "源 main 远端回读证明修复已发布；网站 Pages 回读只证明本页部署。", doesNotProve: "代码发布、网页发布和视频平台投稿互不替代。" }
  ],
  operationalEntrypoints: [
    { name: "创建新项目", command: "py -3.11 E:\\Projects\\Archives\\video-scaffold\\init_project.py D:\\Videos\\my-next-video", purpose: "目标必须为空；复制通用工具、背景、文档和测试，创建脚本、素材、音频、时间轴、场景、渲染与输出目录。" },
    { name: "项目自检", command: "pwsh -File .\\run.ps1 test", purpose: "运行项目自己的离线回归；当前源和一个全新初始化项目均为 33/33。" },
    { name: "本机环境体检", command: "pwsh -File .\\run.ps1 doctor --json", purpose: "不生成视频、不发送 Fish 请求；检查依赖、背景、单帧编码、SVG、CUDA、模型缓存和配置。" },
    { name: "真实 Fish 探针", command: "pwsh -File .\\run.ps1 doctor-live", purpose: "明确需要时才发送一句“连通性测试。”并验证 MP3 后删除临时目录；本轮没有运行。" },
    { name: "逐阶段制作", command: "pwsh -File .\\run.ps1 <tts|timing|prompts|build|lint|preview|render|merge|cover|chapters>", purpose: "按当前阶段执行；修改已验收旁白或识别时使用相应 --force，不能跳过前置人工预览。" },
    { name: "最终交付检查", command: "pwsh -File .\\run.ps1 verify", purpose: "检查 final_output.mp4、cover.png、chapters.txt、视频/音频流、4K60、编码、时长差和所有 cue；只有输出 READY 才进入人工观看。" },
    { name: "清理可再生物", command: "pwsh -File .\\run.ps1 cleanup", purpose: "默认删除渲染分片、拼接临时文件和 rendered/，保留时间轴与场景 HTML；不是删除脚本、素材或最终交付的入口。" }
  ],
  evolution: [
    { date: "2026-06-27—2026-06-28", commit: "501d23e—cf7e9dc", result: "形成确定性 SVG 动效、分片渲染、音画合成、封面、章节、验证与归档骨架，并把长渲染前预览和少帧拒绝作为正式流程。" },
    { date: "2026-08-15", commit: "3f4ef22", result: "把环境体检、通用阶段、交付检查和失败语义从旧定制视频中抽成内容中立脚手架，明确环境 Ready 与一条视频 Ready 分离。" },
    { date: "2026-08-30", commit: "1ae60fd—f227e27", result: "统一稀疏和三位数场景编号，修复提示词与产物排序，并让 init_project.py 复制测试和通用入口，使新项目可先自证完整。" },
    { date: "2026-09-03", commit: "17040ed", result: "为旁白、词级时间、时长和渲染续作加入输入/输出身份；素材或配置变化不再混用旧产物，旧定制入口也不能绕过校验。" }
  ]
};

export const videoScaffoldModules = [
  {
    slug: "project-bootstrap", shortTitle: "新项目与体检", title: "先复制一个干净项目，再判断环境能不能开始",
    searchAliases: ["创建视频项目", "视频环境体检", "doctor和doctor-live区别", "新项目不要带旧素材", "显卡BUSY", "初始化视频脚手架"],
    searchProjection: { intents: ["新建空白视频项目", "检查本机视频环境", "区分本地体检与网络探针"], entities: ["init_project.py", "run.ps1", "doctor", "doctor-live", "Python 3.11", "FFmpeg", "CUDA"], relations: ["空目录接收通用运行时", "test先于doctor", "doctor-live单独发网络请求"], failureRecovery: ["非空目录拒绝覆盖", "依赖缺失为FAIL", "显存争用为BUSY", "Fish配置通过不等于网络通过"] },
    teaser: "新项目不夹带上一期内容；先测代码，再测本机环境。",
    status: "初始化与本机体检入口已实现；本轮 10/10 通过", statusTone: "pass",
    value: "开始新视频时，我得到的是一套空白但能自测的工作区，而不是复制上一期所有脚本和成片。先跑回归与环境体检，就能在写完大量内容前发现 Python、FFmpeg、浏览器、显卡、模型缓存或 Fish 配置缺失。",
    why: "旧项目残留会把素材、标题和输出混进新一期；环境缺一环又可能在长渲染时才暴露。初始化只复制通用能力，doctor 只回答机器是否具备当前条件，二者把“项目干净”和“环境能跑”分别验证。",
    example: "我可以说：“在 D:\\Videos\\my-next-video 建一个新项目，别带上一期脚本；先确认这台电脑能不能跑。”目标目录已有内容时会直接停止，不为省事覆盖旧文件。",
    result: "得到 assets、scripts、raw_audio、srt_data、scene_html、rendered、output 等空目录，以及 config、pipeline、模板、背景、文档和测试。test 与 doctor 分别返回代码和环境结果；没有产生视频内容。",
    readerStates: { pass: "新项目文件齐全，33 项回归与所需体检通过，可以进入内容准备。", problem: "显卡暂时被占用时返回 BUSY，保留已有项目，不把资源争用写成编码器缺失。", unavailable: "目标非空、Python/FFmpeg/浏览器/CUDA 或必要配置缺失时停止，并指出对应项；不自动安装大依赖或调用付费服务。" },
    decisionImpact: ["先 test 再 doctor，分别回答项目复制是否完整与机器环境是否就绪。", "doctor 不发 Fish 请求；doctor-live 才是实际网络探针。", "环境 Ready 不能替代脚本、画面、成片和人工观看。"],
    problem: "防止复制旧视频污染新项目，也防止因为一个命令返回绿色就把尚未制作的内容称为完成。",
    implementation: ["init_project.py 拒绝覆盖非空目录，复制 pipeline 整目录，因此新增 artifact_identity.py 会进入新项目。", "旧 build_v2.py 与两个定制 cover_md 模板不复制；通用 cover_base.html、scene_base.html 与 run_demo.py 保留。", "run.ps1 优先项目 .venv，其次 py -3.11，再使用 python；所有阶段从项目根运行。", "pipeline.doctor 检查 Python 包、FFmpeg/ffprobe、4K60 背景、NVENC 单帧、Playwright SVG、CUDA、模型缓存和 Fish 配置。", "NVENC 因显存不足失败时返回 BUSY；doctor-live 另行合成一句探针并立即删除临时文件。"],
    flow: ["选择一个空目标目录。", "复制通用源并创建工作目录与被忽略的密钥占位文件。", "运行 test，确认新项目自身回归。", "运行 doctor，读取本机环境结果。", "只有需要真实 Fish 证据时再单独运行 doctor-live。"],
    concepts: [{ term: "bootstrap（项目初始化）", explanation: "把通用工具复制成一份新的独立工作区，不含上一期的业务内容。" }, { term: "doctor（环境体检）", explanation: "只检查当前环境能力，不生产视频，也不证明内容完成。" }, { term: "BUSY（资源正忙）", explanation: "编码器存在，但显卡当时没有足够资源；释放已有工作后可重试，不能当缺依赖。" }],
    boundaries: ["初始化不替人确定标题、脚本、素材或场景。", "本轮没有执行 doctor-live，不声称 Fish 当前真实响应。", "项目依赖可按正式入口安装，但付费、账号和重型下载不是浏览页面时自动执行的动作。"],
    failures: [{ condition: "目标目录已有内容", response: "拒绝覆盖，要求换空目录或先由人处理现有内容。" }, { condition: "NVENC 显存压力", response: "返回 BUSY 和显存信息，不把它改写成永久不支持。" }, { condition: "Fish 配置缺失", response: "doctor 返回失败；不打印密钥值，不自动换声线或服务。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\init_project.py", role: "通用文件复制、空目录和拒绝覆盖" }, { path: "E:\\Projects\\Archives\\video-scaffold\\run.ps1", role: "统一 Python 与阶段入口" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\doctor.py", role: "本机与可选网络体检" }, { path: "E:\\Projects\\Archives\\video-scaffold\\tests\\test_workflow_readiness.py", role: "初始化与 doctor 回归" }],
    verification: ["源仓库 33/33 通过。", "从当前源码初始化出的全新项目再次 33/33，证明测试与 artifact_identity.py 被正确复制。", "2026-09-03 20:29 UTC doctor 10/10；没有运行 doctor-live。"],
    relation: "本模块只决定项目和环境能否开始；旁白模块拥有外部配音和词级时间，后续模块才形成画面与交付。"
  },
  {
    slug: "voice-timing", shortTitle: "旁白与词级时间", title: "让每段旁白有声音，也知道每个词在什么时候出现",
    searchAliases: ["Fish Audio配音", "faster-whisper词级时间轴", "旁白改了时间轴怎么办", "TTS旧音频复用", "data-cue时间来源", "场间停顿"],
    searchProjection: { intents: ["生成分场旁白", "取得每个词的时间", "修改脚本后重建音频", "避免旧时间轴"], entities: ["script_NN.txt", "audio_NN.mp3", "s2.1-pro-free", "large-v3", "durations.json", "srt_NN.json"], relations: ["脚本身份绑定音频", "音频身份绑定时长与词级JSON", "Fish外部而Whisper本地"], failureRecovery: ["旧产物无身份拒绝复用", "Fish失败硬失败", "音频变更要求timing --force", "编号不一致阻断"] },
    teaser: "配音走 Fish，词级时间在本机生成；旧结果必须仍属于当前输入。",
    status: "身份校验已发布；本轮未运行真实 Fish 或 Whisper 音频", statusTone: "mixed",
    value: "每一场脚本先得到一段旁白，再得到真实时长和词级开始/结束时间。画面不需要靠人手写“第 2.4 秒出现”，而是可以跟着旁白真正说出的词触发；脚本或音频变了，也不会再把旧结果静默套进新视频。",
    why: "旁白是视频节奏的基准。只看文件是否存在，会让改过的脚本继续使用旧声音，或让新声音沿用旧时间轴，后面所有画面都可能错位。身份文件把内容和会改变结果的配置一起绑定，变更时先停下来。",
    example: "我可以说：“把三段已确认文案生成旁白和词级时间；第二段刚改过，只重做它，别把旧时间位置套回来。”系统只复用仍与当前输入一致的声音和时间轴。",
    result: "每场得到 audio_NN.mp3、对应输出哈希和来源身份；timing 生成 durations.json、srt_NN.json 及身份。srt 记录 word/start/end，为场景构建提供触发依据，不是发布字幕。",
    readerStates: { pass: "所有脚本、音频、时长和词级结果编号一致，身份与输出哈希匹配。", problem: "脚本、模型、声线、音频或识别配置变化时说明哪层陈旧；保留旧文件但不继续用。", unavailable: "Fish 请求失败、密钥缺失、CUDA/模型不可用或编号不完整时停止当前阶段，不生成假音频或空时间轴成功。" },
    decisionImpact: ["标准配音会把旁白文本发给 Fish Audio，不能称完全离线。", "已有音频不因文件非空自动可信；身份匹配才复用。", "多次出现相同词的 cue 仍可能需要人选择更稳定的邻近词。"],
    problem: "防止脚本、旁白与时间轴三者漂移，以及将配置存在误写为真实网络或识别成功。",
    implementation: ["fish_tts.py 把脚本文本、端点、模型、声线、格式和 0.2 秒尾静音写入 audio_NN.identity.json，并回验 MP3 SHA-256。", "Fish API 请求只带当前文本、format 和 reference_id；FISH_API_KEY 来自环境变量或被忽略文件，不进入身份。", "durations.py 用 ffprobe 读取每段音频秒数，durations.json.identity.json 绑定顺序音频名称、SHA-256 和输出哈希。", "transcribe.py 使用 faster-whisper large-v3、CUDA float16、中文、batch size 16、当前 initial prompt 和词级时间；timing_NN.identity.json 绑定音频与识别配置。", "workflow 在后续读取 durations.json 前再次核对当前音频身份；Fish 需要生成而失败时直接抛错，旧文件不能让 stage_tts 假绿。"],
    flow: ["按规范编号读取非空脚本。", "普通运行先核对现有音频身份；不匹配则要求审阅并 force。", "成功配音后加入场间停顿并原子记录身份。", "按音频生成时长和本机词级时间轴。", "后续阶段再次确认时长表仍属于当前音频。"],
    concepts: [{ term: "reference voice（参考声线）", explanation: "Fish 配音使用的公开配置标识；它不是 API 密钥，也不证明服务当前可用。" }, { term: "word timestamp（词级时间）", explanation: "每个识别词的开始和结束秒数，精度服务画面触发，但仍受识别结果影响。" }, { term: "--force（明确重建）", explanation: "确认脚本、音频或识别需要变化后才重生成，防止普通重跑改掉已验收节奏。" }],
    boundaries: ["情感和停顿标记会发给 Fish，但不会直接成为 Whisper 文本。", "时间轴不是字幕烧录，也不证明专业词识别绝对正确。", "本轮只验证代码、身份回归和环境配置，没有发送旁白或加载模型做实际识别。"],
    failures: [{ condition: "旧音频没有身份或脚本变了", response: "拒绝复用，保留旧文件并提示审阅后运行 tts --force。" }, { condition: "Fish 返回错误或空内容", response: "当前阶段硬失败，即使旧 MP3 仍在也不能通过。" }, { condition: "音频或 Whisper 配置变化", response: "拒绝旧 srt 与 durations；timing --force 生成新证据。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\fish_tts.py", role: "外部旁白、尾静音与音频身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\durations.py", role: "真实时长与音频身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\transcribe.py", role: "本机词级时间与识别身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\artifact_identity.py", role: "SHA-256 与原子伴随记录" }],
    verification: ["33 项回归覆盖脚本改变、Fish 失败、音频改变、时长身份与识别身份。", "doctor 证明配置、CUDA 与 large-v3 缓存可见，不证明实际 API 或真实音频识别。", "本轮没有生成 audio_NN.mp3 或 srt_NN.json 的真实样例。"],
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
    result: "每场得到 prompt_NN.txt、fragment_NN.svg 与构建后的 scene_NN.html。data-cue 被换成精确 data-delay；找不到的词留下 data-cue-missing，不会静默回退成一条看似正常的场景。",
    readerStates: { pass: "片段已经由人或 AI 按创作指南审阅，cue 可解析，构建得到可由 seekTime(t) 驱动的场景；build 本身不校验全部 SVG 结构约束。", problem: "词重复、识别错误、素材或版式不明确时回到时间轴与原图审阅，保留具体标记。", unavailable: "没有脚本、时间轴或片段时停止构建；没有素材本身合法，generate() 未绑定模型也是设计边界，不自动选择外部服务。" },
    decisionImpact: ["prompts 不是自动场景生成，保存 fragment 才是创作动作。", "cue 必须来自真实发音，屏幕数字与旁白读法不一致时选择稳定邻近词。", "高级动效仍必须是时间 t 的纯函数，不能因预览能动就引入真实时钟。"],
    problem: "防止模型生成失控页面、素材引用凭空出现，以及动画表面正常却与旁白没有可追溯关系。",
    implementation: ["author.py 读取脚本和 srt，注入实际可用词串与素材 Path.as_uri()，没有素材时明确写无；它只生成 prompt_NN.txt。", "创作指南要求 fragment 不含外层 svg、html、style 或 script，外层 g 负责定位，带 data-anim 的内层节点不再带 transform；这些结构约束由人或 AI 审阅，当前 build 不负责完整语法门。", "build_scene.py 解析 data-cue，支持中文数字等有限变体；缺少时间轴或词未命中时写 data-cue-missing。", "scene_base.html 的 seekTime(t) 实现 type、fade、draw、count、grow、wipe、move-along 等原语。", "v2lib.py 和 components.py 提供标题、数字、表格、路径、全息、形变、粒子、流体、翻转、脉冲等静态片段生成器；随机参数在 Python 端固定。"],
    flow: ["脚本与时间轴就绪后运行 prompts。", "阅读本场旁白、可 cue 词与真实素材 URI；无素材场景可以继续。", "人或 AI 设计 SVG 片段并按结构指南审阅。", "按规范命名 fragment_NN.svg。", "build 强制脚本、时间轴与片段编号一致，解析 cue 并组合公共模板；已引用素材的存在性在渲染身份阶段检查。"],
    concepts: [{ term: "fragment（场景片段）", explanation: "只放在公共 SVG 舞台内部的本场内容，不重复整页运行时。" }, { term: "data-anim（动画原语）", explanation: "声明元素随时间如何出现、移动或变化；实际状态由 seekTime(t) 计算。" }, { term: "file URI（本地文件地址）", explanation: "把明确素材的绝对路径编码给浏览器使用；没有素材就明确写无，不虚构。" }],
    boundaries: ["组件库提供画面能力，不替人判断事实、审美和信息层级。", "多次出现同一 cue 与识别错词仍需人工选更稳定触发点。", "旧 build_v2.py 和定制封面是历史示例，不是新项目的默认创作入口。"],
    failures: [{ condition: "片段包含指南禁止的结构", response: "由人或 AI 在创作审阅中退回；当前 build 只解析 cue 和插入模板，不能冒充完整 SVG 结构校验。" }, { condition: "cue 未在时间轴找到", response: "写入 data-cue-missing 并阻断 build/verify；先修识别热词或选择真实邻近词。" }, { condition: "已引用的素材路径不存在", response: "提示阶段不虚构，渲染身份读取 file:/// 资源时会直接失败；没有引用素材的场景不因此失败。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\author.py", role: "场景提示与真实素材 URI" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\build_scene.py", role: "cue 解析与模板组合" }, { path: "E:\\Projects\\Archives\\video-scaffold\\templates\\scene_base.html", role: "确定性动画运行时" }, { path: "E:\\Projects\\Archives\\video-scaffold\\v2lib.py", role: "完整 SVG 组件与高级动效" }],
    verification: ["回归覆盖真实 URI、稀疏/三位数编号、cue 解析与缺失标记。", "doctor 在无头 Chromium 中确认 #stage=1、seekTime=function。", "本轮没有实际创作或人工观看一个新场景，不展示占位图为成片证据。"],
    relation: "本模块产出可渲染场景；前置预览模块负责低成本验收，渲染模块负责把同一时间函数变成视频帧。"
  },
  {
    slug: "preflight-preview", shortTitle: "构建与预览", title: "把编号、踩点和越界问题拦在长渲染之前",
    searchAliases: ["视频渲染前检查", "文字超出画布", "动态场景预览", "lint HARD", "preview.html", "cue缺失为什么失败"],
    searchProjection: { intents: ["渲染前检查所有场景", "发现画布外文字", "先看动画节奏", "核对场景编号"], entities: ["build", "lint", "preview", "preview.html", "data-cue-missing", "HARD finding"], relations: ["build先对齐编号和cue", "lint浏览器检查布局", "preview人工看动态", "三者先于render"], failureRecovery: ["浏览器检查失败也阻断", "文字越界回场景修", "预览无声不能验音频", "soft项由设计语境判断"] },
    teaser: "先在几秒内看全场景，别等长渲染后才发现硬错误。",
    status: "构建、布局阻断与全场景预览已实现", statusTone: "pass",
    value: "在消耗显卡时间前，我先知道每场脚本、时间轴和 SVG 是否一一对应，所有 cue 是否找到，文字是否跑出画布，并能在一页里循环查看全部动画。多数明显错误在这里修，比重新渲染整条视频便宜得多。",
    why: "静态看 SVG 很难判断动画节奏，单元测试也看不出信息层级是否舒服；反过来，直接渲染完整视频又太慢。构建、浏览器布局检查和动态预览形成一个低成本人工关口。",
    example: "我可以说：“先把 12 个场景都放到预览页；任何标题越界或关键词踩点缺失都别渲染。”系统会先交回集中预览和问题清单，长渲染仍等待确认。",
    result: "得到构建后的 scene_NN.html、无 HARD 项的布局结果和 output/preview.html。预览页展示场次、起点、时长和循环动画，但没有声音，也不包含最终转场的全部体验。",
    readerStates: { pass: "编号、cue 与每场收尾稳定帧的布局硬检查通过，人工看完所有场景并明确可进入渲染。", problem: "中途越界、soft 布局提示或审美问题交给动态预览和人判断；修改片段后重建并重新预览。", unavailable: "浏览器启动失败、场景或时长不完整时停止。背景缺失时 preview 可用纯色后备继续，但 doctor 与真实 render 仍会因缺少背景失败。" },
    decisionImpact: ["lint 的浏览器故障是阻断，不等于没有发现越界。", "preview 无声且每场独立循环，不能替代音画、转场和完整成片观看。", "人工确认是产品步骤，不由绿色测试自动代替。"],
    problem: "防止低成本可发现的问题拖到昂贵渲染后，也防止把预览页误当最终成片。",
    implementation: ["workflow.stage_build 要求 scripts、fragments 和 srt 的规范编号完全一致。", "每场 build 后扫描 data-cue-missing，任何未解析词都使整个阶段失败。", "lint.py 用 Playwright 将每场设到 max(0.5 秒, 场景时长减 0.4 秒) 的一个收尾稳定帧，再检查元素边界；画布外文字计为 HARD，中途状态仍需动态预览。", "preview.py 优先从真实 4K 背景抽一帧，为每场 scene HTML 建独立 iframe 网格；背景不存在时使用纯色后备，不因此伪装真实背景验收。", "预览页按 durations 显示起点与时长，允许缩放和暂停，但明确无声、无最终转场，只服务人工自检。"],
    flow: ["运行 build 生成所有场景 HTML。", "检查缺失 cue、编号和时长。", "运行 lint，修复每个 HARD 项。", "生成 preview.html。", "人工逐场查看节奏、留白、素材和层级，确认后再 render。"],
    concepts: [{ term: "HARD finding（硬错误）", explanation: "当前收尾稳定帧发现的画布外文字，或运行时检查失败；必须修复后才能继续。" }, { term: "preview（动态预览）", explanation: "所有场景在浏览器里缩放循环播放的无声检查页，不是最终视频；背景缺失时会用纯色后备。" }, { term: "stable frame（稳定检查帧）", explanation: "当前 lint 对每场只检查一个接近末尾的确定时刻；它不能覆盖中途越界和全部审美问题。" }],
    boundaries: ["布局检查主要阻断可确定的文字越界，不自动判断全部美感。", "全出血图片等 soft 情况需要结合设计意图，不机械判失败。", "本轮没有生成本期 preview.html，因此页面只说明能力和代码证据。"],
    failures: [{ condition: "编号或场数不一致", response: "列出缺失与多余索引，先修文件集合。" }, { condition: "浏览器无法检查", response: "lint 失败并停止，不把未运行写成 0 HARD。" }, { condition: "人工预览发现节奏问题", response: "回到 fragment 或 cue 修正，重建后再看，不直接进入 render。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\workflow.py", role: "阶段前置关系与编号/cue 阻断" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\lint.py", role: "真实浏览器布局检查" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\preview.py", role: "全场景动态预览" }],
    verification: ["回归覆盖场景数字顺序、preview 时长配对和浏览器失败阻断。", "doctor 证明浏览器运行时可加载，但不是本期视觉验收。", "本轮未打开源项目的实际 preview，因为没有本期脚本和场景。"],
    relation: "场景创作给出可检查输入；本模块决定是否值得启动长渲染，渲染模块仍需独立验证帧数与续作身份。"
  },
  {
    slug: "deterministic-render", shortTitle: "确定性渲染", title: "每帧按时间算出来，中断后也不能把新旧画面混在一起",
    searchAliases: ["4K60逐帧渲染", "NVENC少帧", "视频断点续作", "渲染分片混旧图", "seekTime逐帧", "AV1编码"],
    searchProjection: { intents: ["渲染4K60视频轨", "中断后继续渲染", "防止新旧分片混合", "检查少帧音画漂移"], entities: ["render.py", "seekTime(t)", "Playwright", "PNG", "FFmpeg", "av1_nvenc", "_chunk_NN.mp4", "_render_identity.json"], relations: ["场景时间驱动透明帧", "背景与前景叠加", "身份匹配才复用chunk", "每段和整轨都数帧"], failureRecovery: ["少帧分片重试", "输入漂移全量清旧chunk", "旧chunk删不掉硬失败", "最终帧数不符拒绝交付"] },
    teaser: "渲染速度不改动画时间；场景或素材一变，旧分片全部失效。",
    status: "输入身份与少帧保护已实现；本轮只做单帧编码体检", statusTone: "mixed",
    value: "浏览器不按真实时间自由播放，而是每截一帧前被设到准确的 t 秒。多个进程分片工作，合法分片在中断后可以继续；若场景、素材、背景或编码配置改变，旧分片不能混进新视频。",
    why: "长视频渲染可能中断，也可能因显卡会话压力让 FFmpeg 退出 0 却少写帧。只检查文件存在会造成后段画面提前、旁白仍按原时长播放；只看帧数又识别不了同样长度的旧内容。当前实现同时检查输入身份和帧数。",
    example: "我可以说：“昨晚完成了前 20 个分片，今天继续；但我换了 hero.png，用过旧图的分片必须重做。”系统会识别素材变化，不把新旧画面拼进同一成片。",
    result: "生成 output/video_track.mp4。过程中每个 _chunk_NN.mp4 必须具有预期帧数，最后拼接轨也必须等于总帧数；成功后清理分片和渲染身份，失败则保留仍属于当前身份的正确分片供续作。",
    readerStates: { pass: "当前输入身份一致，全部分片与整轨帧数正确，得到无声视频轨。", problem: "单个分片失败可重试；输入改变会放弃全部旧分片，不能只补一半。", unavailable: "背景、场景引用素材、浏览器、FFmpeg 或 NVENC 不可用，或陈旧分片无法删除时停止，不拼接不可信轨道。" },
    decisionImpact: ["video_track.mp4 设计上无声，声音在 merge 后的 final_output.mp4。", "单帧 NVENC PASS 只证明编码器入口可用，不证明长渲染稳定。", "分片身份保护同一项目续作，不是跨项目缓存或通用媒体数据库。"],
    problem: "防止渲染速度影响动画时间、显卡少帧造成持续音画漂移，以及中断恢复把旧内容混进新版本。",
    implementation: ["build_timeline 按 durations 累加全局起止时间，seekTime 接收当前场景内相对秒数。", "每 worker 使用无头 Chromium，最多缓存 6 个场景页面；透明 PNG 通过管道送给 FFmpeg。", "背景以 stream_loop 循环并按当前起点裁切，前景 overlay 后可加 vignette 与 grain，再用 av1_nvenc 编码。", "总帧按 60fps 计算；默认最多 300 帧一片、4 workers、失败重试 2 次。", "_render_identity.json 绑定场景 HTML、其中 file:/// 素材、时长、背景 SHA、画布、转场、成片效果、编码参数与实际分片边界。", "身份改变会删除全部 _chunk_*.mp4；删不掉直接失败。每片用 ffprobe 数包，最终轨再次核对总帧。"],
    flow: ["读取场景、时长与背景。", "计算总帧、分片边界和完整输入身份。", "核对已有身份与每个分片帧数。", "多个 worker 只处理缺失或错误分片。", "全部正确后无损拼接并核对整轨总帧。", "成功清理分片，保留 video_track.mp4。"],
    concepts: [{ term: "chunk（渲染分片）", explanation: "一段固定帧范围的临时视频；只有输入身份和帧数同时匹配才可续作。" }, { term: "deterministic（确定性）", explanation: "同一场景在同一 t 秒按同一规则求状态，不依赖当时浏览器跑了多久。" }, { term: "AV1（视频编码格式）", explanation: "当前硬件编码的视频格式；4K60 单帧可用不等于整条长视频已验收。" }],
    boundaries: ["本轮没有完整 render，不公布整片速度、显存峰值或稳定时长。", "背景文件可循环覆盖任意时长，但接缝是否视觉无痕仍需实际看。", "同一路径素材字节受身份保护；未通过 file:/// 引入的外部运行依赖不属于当前场景合同。"],
    failures: [{ condition: "分片少帧或 FFmpeg 非零退出", response: "删除该片并有界重试；仍失败则停止整轨拼接。" }, { condition: "输入身份变化", response: "删除全部受管旧分片，不能把旧画面和新画面拼在一起。" }, { condition: "陈旧分片无法删除或素材缺失", response: "硬失败并列出问题文件，不先写入新身份掩盖旧文件。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\render.py", role: "时间线、逐帧抓取、分片、身份、重试与帧数验证" }, { path: "E:\\Projects\\Archives\\video-scaffold\\templates\\scene_base.html", role: "seekTime(t) 画面状态" }, { path: "E:\\Projects\\Archives\\video-scaffold\\background\\background_4k.mp4", role: "当前 4K60 AV1 背景资产" }],
    verification: ["33 项回归覆盖同身份保留、场景变化、素材字节变化、素材缺失和无法删除陈旧分片。", "doctor 的 NVENC 4K AV1 单帧与 SVG 运行时通过。", "本轮没有跑完整视频轨；历史 README 的速度与无缝描述不作为当前实测。"],
    relation: "本模块只产出无声视频轨；交付模块把旁白、音乐、封面和章节合入，并执行结构验收。"
  },
  {
    slug: "delivery-verify", shortTitle: "成片与交付", title: "把视频、旁白、封面和章节收齐，再决定这一期是否可投稿",
    searchAliases: ["final_output.mp4怎么生成", "视频背景音乐自动压低", "哔哩哔哩章节", "4K封面", "verify READY", "视频没有声音"],
    searchProjection: { intents: ["合成最终有声视频", "加入背景音乐", "生成4K封面", "生成章节并验收"], entities: ["merge.py", "final_output.mp4", "cover.png", "chapters.txt", "BGM", "sidechaincompress", "verify"], relations: ["旁白与视频轨合成", "BGM随旁白压低", "章节从scene 1开始", "READY先于人工观看"], failureRecovery: ["无旁白拒绝静音成片", "封面标题占位拒绝", "章节起点错误拒绝", "音视频时长差超限失败"] },
    teaser: "成片、封面、章节缺一不可；READY 后仍要真人观看。",
    status: "交付结构检查已实现；本轮无实际成片验收", statusTone: "mixed",
    value: "渲染出的无声画面轨与分场旁白合成，按需把本人提供的背景音乐压到声音下面；同一期还得到可投稿尺寸的封面和从 00:00 开始的章节。最后一次检查直接读取媒体流和尺寸，不只看文件名。",
    why: "video_track.mp4 看起来像视频却没有声音；一个文件存在也可能分辨率、编码、帧率或时长不对。交付层把投稿前真正要带走的三件东西收齐，并把结构错误和需要人看的内容质量分开。",
    example: "我可以说：“旁白为主，背景音乐只在空隙明显；封面用本期标题，章节从开场开始。检查后再告诉我是否值得观看。”系统会收齐成片、封面和章节；没有旁白时不会交出一条静音成片冒充完成。",
    result: "得到带视频流与 AAC 音频的 final_output.mp4、3840×2160 cover.png 和 chapters.txt。verify 输出 READY 只表示结构合同通过；真正的画面、声音、字幕事实和审美仍由人观看。",
    readerStates: { pass: "三个交付文件存在且结构、流、尺寸、帧率、编码、时长、章节和 cue 检查通过。", problem: "音乐过响、封面内容或章节措辞属于人工预览问题；结构失败则回到对应生成阶段。", unavailable: "缺视频轨、旁白、标题、封面或章节时停止，不用空文件、占位标题或静音轨冒充可投稿。" },
    decisionImpact: ["BGM 是可选输入，旁白不是；没有旁白拒绝最终交付。", "verify 检查的是结构和有限时间差，不判断文案事实、音色表现或平台审核。", "项目没有上传动作，READY 后的投稿仍由本人决定。"],
    problem: "防止把无声视频轨、尺寸正确的空封面或有文件无内容的交付包误认为本期完成。",
    implementation: ["merge.concat_audio 按规范编号拼接 MP3，统一配置使其可 stream-copy。", "有 BGM 时先统一立体声，使用 sidechaincompress 在旁白出现时压低音乐，混合后限制峰值并做 1.2 秒尾淡出。", "cover.py 用 Playwright 渲染 cover_base.html；PROJECT_TITLE 不能仍为 Untitled Video。", "chapters.py 把 scene 组和累计时长转换为 MM:SS/HH:MM:SS，第一章补到 00:00，并对数量、标题长度和过近章节发警告。", "cleanup.verify 用 ffprobe 检查 final 视频/音频流、3840×2160、60fps、对应 codec、正时长、可读时的音视频时长差、封面尺寸、章节起点和未解析 cue。"],
    flow: ["确认 video_track 与所有旁白存在。", "拼接旁白并与视频合成，可选加入 BGM。", "按当前标题和可选主图生成封面。", "从 chapters.json 生成章节文本。", "运行 verify，逐项阅读结果。", "实际观看最终视频，再决定投稿。"],
    concepts: [{ term: "mux（音视频封装）", explanation: "把已经编码的视频轨和声音流放进同一个 MP4，不等同于重新设计画面。" }, { term: "sidechain ducking（侧链压低）", explanation: "旁白出现时自动降低背景音乐音量，让人声保持清楚。" }, { term: "READY（交付结构就绪）", explanation: "所有机器可查的交付合同通过；不是人工已经看完，也不是平台已经接收。" }],
    boundaries: ["通用入口不生成 publish.txt 或完整投稿文案。", "封面主图是可选设计输入，尺寸通过不代表主图或标题内容优质。", "本轮没有真实 final_output、封面、章节或人工观看结果。"],
    failures: [{ condition: "没有旁白音频", response: "merge 直接失败，不创建静音 final_output。" }, { condition: "标题仍是占位值", response: "cover 与 verify 拒绝，把本期标题补清后再生成。" }, { condition: "媒体流或时长不符", response: "保留 ffprobe 事实并回到 render/merge，不靠改文件名通过。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\merge.py", role: "旁白、BGM 与最终 MP4" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cover.py", role: "4K 封面" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\chapters.py", role: "章节目录" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cleanup.py", role: "最终交付检查" }],
    verification: ["回归用受控 ffprobe 响应验证完整交付通过，并验证无音频、占位标题和未解析 cue 必须失败。", "媒体回归主要是替身，不是本轮真实 MP4。", "完整视频 E2E 与人工观看仍为具名未验证项。"],
    relation: "渲染模块交出无声 video_track；本模块拥有最终可带走文件和结构门，恢复模块解释哪些中间结果能继续使用。"
  },
  {
    slug: "recovery-reuse", shortTitle: "复用与恢复", title: "旧产物只有身份匹配才复用，清理也只删可再生部分",
    searchAliases: ["视频项目断点恢复", "旧旁白不能复用", "清理渲染临时文件", "audio identity", "durations identity", "渲染失败继续", "cleanup保留什么"],
    searchProjection: { intents: ["继续昨天的视频制作", "判断旧音频能否复用", "清理视频临时文件", "恢复中断渲染"], entities: ["artifact_identity.py", "audio_NN.identity.json", "timing_NN.identity.json", "durations.json.identity.json", "_render_identity.json", "cleanup"], relations: ["输入与输出SHA共同决定命中", "TTS/timing漂移先停", "render漂移重做chunk", "cleanup默认保留关键中间层"], failureRecovery: ["无身份保持旧文件但拒用", "无法删陈旧chunk硬失败", "成功后原子写identity", "旧定制入口也走校验"] },
    teaser: "可继续不等于盲目沿用；先证明旧文件仍属于当前输入。",
    status: "陈旧复用根因已修复并发布", statusTone: "pass",
    value: "我可以分多次完成一条视频：已确认旁白、时间轴和合法渲染分片不必每次重做。但脚本、音频、场景、素材或配置变了，系统能指出旧结果已经不属于当前版本；清理时又不会把脚本、时间轴和场景源一起删掉。",
    why: "只靠“文件存在”复用会静默混入旧内容；完全不复用又把网络、识别和长渲染成本全部重来。最小身份文件记录输入配置与 SHA-256，既不保存正文和密钥，也能把真正相同与只是同名分开。",
    example: "我可以说：“明天接着做：没变的旁白继续用，第二场换图后重渲；清理今天的临时分片，但保留时间轴和场景。”系统会只删能重建的内容，并留下继续制作所需的材料。",
    result: "匹配的音频与时间轴直接复用；不匹配的旧文件保留并要求明确重建。渲染输入变化时只删除受管分片后重做。cleanup 默认移除 chunk、拼接辅助文件、临时主音频、render identity 和 rendered/，保留可继续工作的核心文件。",
    readerStates: { pass: "身份 schema、输入字段、输出哈希和当前文件全部匹配，复用或续作有依据。", problem: "身份缺失、损坏或任何输入漂移时说明陈旧层；TTS/timing 不自动覆写，render 只处理可再生 chunk。", unavailable: "受管旧分片无法删除、源素材缺失、身份无法原子写入或输出为空时停止，不把部分状态登记为可复用。" },
    decisionImpact: ["身份文件位于被忽略的项目工作区，不是第二个数据库或后台服务。", "SHA-256 证明字节和配置对应，不证明内容事实、音色或审美正确。", "旧项目第一次进入新版本时，缺身份的音频/时间轴需要人审后 force，不会自动为未知历史背书。"],
    problem: "在保留断点续作价值的同时，消除脚本、音频和画面更新后仍使用同名旧产物的假成功。",
    implementation: ["artifact_identity.py 只提供 SHA-256、容错读取、同目录原子 JSON 写入和输出哈希回验，没有数据库、服务或 watcher。", "audio_NN.identity.json 绑定有效脚本文本、Fish 端点/模型/声线/格式、尾静音和 MP3 输出。", "timing_NN.identity.json 绑定音频字节、Whisper 模型/设备/精度/语言/batch/线程/提示和 srt 输出。", "durations.json.identity.json 绑定数字顺序的音频名称与哈希以及时长表输出；workflow 在读取时再次核对。", "_render_identity.json 绑定场景、file:/// 素材、背景、时长、画布、转场、效果、编码和分片边界；输入变化后清除所有受管 chunk。", "旧 build_v2.py 的文件计数短路已移除，仍可执行的历史入口必须调用同一身份校验。"],
    flow: ["阶段开始时计算当前输入身份。", "读取伴随记录并回验输出字节。", "完全匹配则复用。", "TTS/timing 不匹配时保留旧文件并要求明确 force。", "render 不匹配时删除可再生受管分片；删除失败即停。", "新产物成功且非空后才原子写身份。", "交付确认后按默认 cleanup 清理临时物。"],
    concepts: [{ term: "identity（产物身份）", explanation: "回答“这份输出由哪组输入和配置产生”，不是用户身份或权限系统。" }, { term: "SHA-256（字节摘要）", explanation: "检测文件是否发生字节变化；同摘要不能证明内容语义正确或真实。" }, { term: "atomic write（原子写入）", explanation: "先写同目录临时文件再替换，避免崩溃留下半份 JSON 被误当有效记录。" }],
    boundaries: ["身份文件不包含 Fish 密钥或完整脚本文本，只保存摘要和公开配置字段。", "不为复用新增后台进程、共享缓存或跨项目服务。", "默认 cleanup 不删本人脚本、素材、最终成片；显式 reset/archive 属于旧定制示例的另一路径。"],
    failures: [{ condition: "旧输出存在但身份缺失或损坏", response: "TTS/timing 拒绝复用并提示明确 force；不自动签认历史。" }, { condition: "输出字节被改写", response: "哈希不匹配，当前伴随记录失效。" }, { condition: "陈旧渲染分片被占用无法删除", response: "停止并列出文件，不先写新身份导致后续误复用。" }],
    sources: [{ path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\artifact_identity.py", role: "共享最小身份函数" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\workflow.py", role: "后续阶段的时长身份门" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\render.py", role: "场景/素材/背景/配置续作身份" }, { path: "E:\\Projects\\Archives\\video-scaffold\\pipeline\\cleanup.py", role: "可再生临时物清理" }],
    verification: ["33 项回归覆盖 TTS、timing、durations、render 与旧入口旁路。", "全新初始化项目同样 33/33，证明修复属于脚手架而不只留在源仓库。", "独立 Terra 审查补出 file:/// 素材漏洞后复核 P0=0、P1=0。"],
    relation: "这是贯穿旁白、时间轴与渲染的恢复边界；它不新增产品阶段，只保证各阶段的复用不会改变当前视频内容。"
  }
];

export const project = videoScaffoldProject;
export const modules = videoScaffoldModules;
