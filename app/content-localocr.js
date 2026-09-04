import { createProjectSnapshot } from "./project-snapshot.js";

const localOcrSnapshot = createProjectSnapshot({
  observedAt: "2026-09-03T03:42:35.8277553Z",
  label: "公开源码、安装元数据、普通回归与一个真实结构样例已核对；样例错漏与服务回读边界仍明确保留",
  boundary: "本轮采购表结构识别完成，但正文漏标题、原始行将 PO 读成 P0；质量仍为未知。服务曾响应健康检查，后续回读不可达，不声称持续在线",
  metrics: [
    { label: "识别路线", value: "3 条" },
    { label: "正式输出", value: "TXT · MD · JSON" },
    { label: "普通回归", value: "146 通过 · 1 跳过" },
    { label: "真实样例", value: "1 张采购表" }
  ],
  facts: [
    { label: "日常提字", value: "ocr → ppocrv6-medium：PP-OCRv6_medium；保留方向与文本行处理，平面截图默认关闭形变矫正。" },
    { label: "困难文档", value: "vl → paddleocr-vl-1.6：PaddleOCR-VL-1.6；复杂 PDF 可直接进入，普通识别的空结果或明显低置信度可触发本地增强。" },
    { label: "结构化解析", value: "structure → pp-structure-v3：PP-StructureV3 + PP-OCRv5；表格、公式、印章和区域处理需显式选择，图表识别当前关闭。" },
    { label: "当前源码", value: "PUBLIC（公开）仓库 wlyaaaaa/LocalOCR，main=e0a2fff37ac289b43b5643002a8b49351a27e8bb；2026-09-03 03:25 UTC 本地主检出干净，与 origin/main 为 0/0。", hero: false },
    { label: "项目依赖声明", value: "项目版本 0.6.0；pyproject.toml 固定 PaddlePaddle GPU 3.3.1 与 PaddleOCR 3.7.0；WSL（Windows 的 Linux 子系统）安装脚本使用 cu129 包源，Python 环境位于 /root/localocr-venv。声明、安装和真实推理分别核验。", hero: false },
    { label: "执行入口", value: "Windows 调用入口 ocr_smart.ps1、直接 API 入口 ocr_once.ps1 与单次 start.ps1 / localocr.cli；CLI（命令行入口）与 API 共用 OCRService、自动增强、执行监管和输出合同。", hero: false },
    { label: "服务与资源", value: "固定本机 127.0.0.1:18665；一个可替换的 warm worker（温热推理进程）；同模型复用、换模型回收。默认整次请求期限 300 秒，最大 7200 秒，服务进程树内存上限 30,000,000,000 字节。", hero: false },
    { label: "当前模型配置", value: "localocr/model_profiles.json 声明 3 个具体 profile（模型配置档），由 model_registry.py 解析；显式模型选择不被自动分流改写。普通 OCR 配置的能力标签含形变矫正，但 use_doc_unwarping=false，不能把支持标签当成已开启。", hero: false },
    { label: "正式结果身份", value: "每次请求绑定输入内容、请求语义、模型配置、分流策略与输出目录；正式 TXT/MD/JSON 和 media.objective-result.v1 客观结果文件使用请求隔离路径。无哈希的同名文件只是兼容显示副本。", hero: false },
    { label: "坐标含义", value: "JSON 保留页码、块类型、阅读顺序、分数及 bbox/polygon；PDF 页默认按 render_scale=2.0 渲染，坐标属于渲染图片像素，不能直接当成原 PDF 点坐标。", hero: false },
    { label: "没有文字的判断", value: "生产者可根据独立证据形成 no_text_detected，但未保存时仍不是可采纳的持久验真结果；调用方只有在完成、完整、充分及证据保存/字节/身份复验均成立后，才把它作为已验证的无字结论。内置证据主要限于近乎均匀图片。", hero: false },
    { label: "本机安装元数据", value: "本轮在 WSL 通过安装元数据读取：Python 3.12.3、paddlepaddle-gpu 3.3.1、paddleocr 3.7.0、pypdfium2 5.11.0、fastapi 0.139.0、uvicorn 0.50.0、python-multipart 0.0.32、psutil 7.2.2、httpx 0.28.1、starlette 1.3.1；该读取未导入模型。", hero: false },
    { label: "模型配置字节", value: "3 个模型配置档；model_profiles.json SHA-256=17211f1206f022f7dcb4e2ec07bb8fc61ab87f9c1daf5d681c76c12a97fd74b9。配置存在不证明三条路线都在本轮完成推理。", hero: false },
    { label: "普通回归与波动", value: "unittest discover 第二次完整运行共 147 项：146 通过、1 跳过，内部 38.953 秒、外层墙钟 46.268 秒。第一次 147 项中出现 1 个 RSS 恢复测试 ConnectionResetError、1 跳过；该测试随后聚焦通过，完整复验也通过，没有改源码或隐去首次错误。", hero: false },
    { label: "实际结构样例", value: "2026-09-03 经 ocr_smart.ps1 对合成 sample_table.png 显式运行 structure / pp-structure-v3；1/1 页、六列五条商品记录与合计 112,500.00 元已对照。job 记录从 03:29:10.964 UTC 到 03:29:38 UTC，约 27 秒，不含完整外层启动等待。", hero: false },
    { label: "样例不是无错证书", value: "本次实际结果为 completed、coverage=complete、text_detected，但 quality=unknown / confidence_unavailable。标题被标为 figure_title 后进入 excluded_regions，最终 Markdown 没有标题；text_lines[0] 将原图 PO-2026-0712 读成 P0-2026-0712。页面完成不表示正文逐字完整。", hero: false },
    { label: "样例输出字节", value: "原图 67,474 B，SHA-256=a4715280b4818eaad9d11361e77eb1698cb7c47dc06da66d97fbcae580938410；实际 Markdown 1,030 B，SHA-256=08bee52074af89a00b503d2f89e77ec8bc75fb3ff7e190e95c64c0f4341e86d3；正式 JSON 71,158 B，SHA-256=9166e6012c0e30e9e392367e4dfb08ee6a8c9290d8e07cfd3e4cedcb1d695527。", hero: false },
    { label: "服务现场的范围", value: "样例完成后的只读健康检查曾返回 HTTP 200、service=localocr、api_version=0.6.0、gpu_status=ready，加载 structure / pp-structure-v3，active_jobs=0；报告 GPU 为 NVIDIA GeForce RTX 5090 D，峰值服务内存 3,361,484,800 B。后续健康和 job 请求连接被拒绝，因此仅确认这次运行成功，不确认持续常驻在线。", hero: false }
  ],
  gaps: [
    "真实采购表样例已揭示具体输出缺口：figure_title 被过滤出正文，标题中的 O 被读为 0；JSON 的 text_lines 与 excluded_regions 保留了复核线索，不能把它缩成泛泛的“模型可能出错”。",
    "本轮服务先不可达，由正常入口拉起并完成一个样例，随后曾健康、再回读不可达；没有为网站增设保活服务或排查常驻链，持续在线与下一次请求状态仍须现场确认。",
    "普通回归第一次出现一次 RSS 越界后的恢复 ConnectionResetError，聚焦与完整复验均通过；波动原因本轮未定，不宣称已根治或长期稳定。",
    "自动分流不是先理解全部页面：复杂 PDF 的首轮选择使用文件名关键词，随后才检查普通 OCR 的空结果和置信度；structure 不参加自动分流。",
    "模型置信度和整页质量不是逐字正确率。小字、浅色字、姓名、日期、金额、公式与表格对应关系仍需回到原图复核；结果文件的哈希只证明对应关系与字节一致。",
    "当前导出是 TXT、Markdown 和 JSON，不是直接生成可编辑 Word、Excel 或可搜索 PDF；后续编辑和排版由对应文档工具完成。",
    "安装脚本需要联网取得系统依赖、Python 包与缺失模型；已缓存模型可供本地推理，但当前没有经本轮干净新机验证的完整离线重建包。",
    "本轮不进行私人材料批量扫描、跨模型重型基准或真实离线重装；这些结果不能由源码、单元测试或一个合成样例替代。"
  ]
});

export const localOcrProject = {
  order: 4,
  slug: "localocr",
  title: "LocalOCR",
  kicker: "本地文字识别与文档解析 · 2026-09-03 03:42 UTC 样例观察",
  route: "/projects/localocr",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "本地提字、文档结构解析与可复核结果已经实现",
  cardStatusTone: "pass",
  ...localOcrSnapshot,
  searchAliases: ["LocalOCR", "本地文字识别", "图片提字", "扫描件转文字", "表格识别", "复杂文档解析", "OCR结果怎么看", "第4项目"],
  repositoryNote: "LocalOCR 是独立的公开本机工具，源码位于 wlyaaaaa/LocalOCR。模型推理由本机 Windows 与 WSL 中的环境完成，网站只展示产品、实际使用方式和最后一次核对的证据，不接收访客文件，也不是在线 OCR 服务。公开样例使用项目的合成材料，不代表私人文件或任意文档的识别效果。",
  summary: "LocalOCR 把截图、扫描件和复杂 PDF 变成可复制、可搜索、可回到原图核对的文字与文档结构。我指定一个文件或文件夹，说明要提字还是保留表格和版面，它在本机选择相应识别方式，交回按页文字、表格或公式结构、位置与识别状态。读不清、处理不全和没有检测到文字会分开说明。本轮采购表已读出行列和合计，但仍有标题遗漏和字符错读，不能把处理完成当成逐字正确。",
  why: "图片里的字不能直接复制；扫描表格即使被读成一长串文字，也可能丢掉行列关系。LocalOCR 把提字和结构解析做成可重复的本机流程，同时留下原件、页码、位置与质量依据，让我能继续整理资料，并知道哪些地方还必须自己核对。",
  plainExample: "在已经配置 LocalOCR 的这台电脑上，我可以直接向 AI 说：“把这张采购表的文字和行列读出来，保留商品型号、数量、单价与金额的位置。”手动使用时，把图片、PDF 或文件夹拖到本机安装目录的 start.bat。普通提字使用默认方式；需要表格、公式、印章或区域时明确选择结构解析，是否包含子目录由本次请求决定。",
  result: "我拿到三种可继续使用的文件：按页纯文字 TXT、便于阅读和保留结构的 Markdown、供程序读取的 JSON；另有说明执行、覆盖、质量与未知项的客观结果文件。关键字段有位置可回到原图核对。它不会直接交付 Word 或 Excel，也不会把“文件生成了”当成“每个字都正确”。",
  readerStates: {
    pass: "处理完成时返回实际输出文件、按页文字、识别方式和质量说明；需要结构时保留表格、公式或区域信息，便于继续使用并对照原图。",
    problem: "字小、低对比、布局复杂或首轮结果不足时，自动模式可以在本机增强；仍读不清、只完成部分或模型失败就说明具体问题，初步文字与正式完成结果分开。",
    unavailable: "原件打不开、环境不可用、端口不是本服务或显卡资源冲突时，返回明确原因和现有任务位置，不输出假结果，不擅自上传云端，也不反复创建同一任务。"
  },
  dataSources: {
    title: "它读哪些文件，交回什么",
    intro: "输入来自我本次指定的文件，不是后台扫描整个电脑。下面区分真实输入、实际处理的数据，以及我能拿走的结果。",
    rows: [
      { source: "截图和普通图片", data: "PNG、JPG/JPEG、WebP、BMP、TIF/TIFF 中的文字像素，包括界面文字、纸张照片和中英文混排内容。", result: "文字块、位置、顺序和识别分数；纯粹描述景物或颜色时可以直接看图，不必启动文字识别。" },
      { source: "指定的 PDF 文件", data: "把每页渲染成图片后读取文字和版面；多页结果保留页码与渲染尺寸。已经有可读文字层的数字 PDF 通常先用原生文本读取。", result: "按页文字及相应结构；位置是渲染后的图片像素，复核时必须对准同一页、同一尺寸。" },
      { source: "明确选定的文件夹", data: "只处理支持的图片和 PDF，按请求决定是否递归子目录；每个文件分别选择识别路线，共享整次请求的期限。", result: "逐文件输出与对应身份，不把一个目录变成长期资料库或持续同步任务。" },
      { source: "表格、公式和版面明确的材料", data: "显式结构解析读取表格行列、公式块、印章区域、阅读顺序和区域位置；普通提字并不自动等价于结构恢复。", result: "Markdown 中的表格/公式内容与 JSON 结构证据；印章识别不是鉴真，公式读出不是推导或正确性证明。" }
    ],
    note: "“全部处理留在本机”是可明确提出的要求。若同时需要场景理解和逐字抄写，AI 可以在获准的处理范围内分别看原图与读取 OCR 证据，再分开说明观察、文字、状态和冲突；LocalOCR 本身不调用外部视觉模型。"
  },
  productPrinciples: [
    { title: "先按任务选工具，不让每张图都跑重模型", detail: "只想知道照片里有什么时，直接看图通常足够；需要逐字文字、批量处理、表格、坐标或全本地执行时才用 LocalOCR。已经有文字层的数字文档先走原生读取，避免把清楚的文字重新变成有误差的图片识别。" },
    { title: "先用较轻的方式，不够再增强；明确选择始终有效", detail: "普通截图和扫描 PDF 默认先提字；复杂 PDF 的文件名提示或首轮低置信度可以引导本地增强。明确选了模型就按该选择执行，不静默换模型。表格和版面结构是单独的明确需求，不把它藏在“自动”二字里。" },
    { title: "保留原始识别，不把顺口的改写当成读到了", detail: "原始文字、页码、坐标和分数是复核依据。AI 看原图后若发现某个浅色小字有误，应把更正与具体区域单独说明，不能覆盖原始 OCR 或声称引擎自动读对；无法判断就保留未知。" },
    { title: "一份结果要同时说清做完没、读全没、可信到哪", detail: "任务完成、页面覆盖、结果质量和有没有检测到文字是不同问题。空文本可能是图片无字，也可能是模型没读出来；只有相应独立证据成立才给出没有文字的窄结论。" },
    { title: "重复请求先核对结果，等待超时先找原任务", detail: "相同输入与请求的结果通过文件、大小和哈希检查后才复用；输入、模型或请求变了就不是同一份结果。客户端等不及不代表后台已停，先查原任务，再决定等待、取消或有界重试。" },
    { title: "识别任务不能把电脑拖成失控的后台工作", detail: "模型通过现有显卡协调器取得资源，一个受监督进程负责推理；超期、取消、资源资格丢失或内存越界时结束对应工作。资源不可用就说明冲突，不为排队或重试再建一套后台系统。" }
  ],
  galleryPresentation: {
    kicker: "同一张合成原图与一次真实运行",
    title: "看得见表格恢复，也看得见标题遗漏与错字",
    description: "第一张是项目合成采购表原图，第二张是本轮实际输出的可读排版。表格和合计未经手工补写；标题遗漏、PO 读成 P0 与质量未知同时保留。这不是准确率宣传图。",
    prefetchAdjacentFull: false
  },
  gallery: [
    { src: "/media/localocr/sample-table-original.png", alt: "合成采购表原图，六列五行商品，标题编号为 PO-2026-0712", categoryLabel: "合成输入 · 不是私人订单", caption: "项目原有的 900×600 合成采购表，包含标题、六列表格、五条商品记录和合计。公开副本与本次推理原件逐字节相同。", proves: "说明这次识别实际收到的像素、文字和表格布局。", doesNotProve: "它本身是输入，不是识别成功或准确率证据。", originalSha256: "a4715280b4818eaad9d11361e77eb1698cb7c47dc06da66d97fbcae580938410", originalBytes: 67474, width: 900, height: 600 },
    { src: "/media/localocr/sample-table-output.png", alt: "本次 LocalOCR 实际表格输出，旁注明确披露标题遗漏和 O 被识别成 0", categoryLabel: "真实输出 · 附实际缺口", caption: "六列、五条商品和合计保留，但 Markdown 没有原图标题；原始 text_lines 把标题 PO 读成 P0。1/1 页处理完成，质量仍为 unknown，不是逐字无错。", proves: "这张合成表经过本机 pp-structure-v3 得到了当前展示的表格和合计；排版没有补写 OCR 漏掉的标题。", doesNotProve: "任意文档准确、标题完整、原始行无错或其他模型已验收。", originalSha256: "999d71b8bf29cbb11f4fad06a3fc45cd4c7336ffa0be0060615c61afa65a3ff1", originalBytes: 54785, width: 1080, height: 744 }
  ],
  responsibilities: [
    "接收本次指定图片、PDF 或文件夹，规范路径并明确递归范围，保留输入与输出的对应关系。",
    "提供日常提字、困难文档增强和显式结构解析三条本地路线，保留实际模型与选择原因。",
    "交回可读、可复制、可编程处理且可对照原图的文字与结构，不抹掉模型原始分歧。",
    "把执行、覆盖、质量、空结果和失败分开描述，并用一条人话摘要帮助先看懂状态。",
    "在相同请求下复验并复用结果，提供指定任务查询、取消、超时和资源冲突处理。",
    "维护当前依赖、模型配置与本机启动方式，使环境损坏或换机时有明确重建入口。"
  ],
  exclusions: [
    "不负责整库查找、照片归类、文书事实判断或后续成品排版；原件查找回到“个人材料查找”，照片视频回到“个人媒体整理与恢复”，文书产出交给“文书和材料制作”与相应文档工具。",
    "不自动生成可编辑 Word、Excel 或可搜索 PDF；不会把识别出的文字当成原件真实性、印章真伪或公式正确性的证明。",
    "不公开接收文件、不提供公网识别 API、不自动上传私人输入，也不引入身份识别或无人值守全库扫描。",
    "不因平均分高、缓存命中或测试通过，就承诺任何输入逐字准确；重要字段保留人工复核入口。"
  ],
  glossary: [
    { term: "OCR（文字识别）", meaning: "从图片像素中识别文字；与直接读取数字文档的文字层不同，会受字大小、对比度和版面影响。" },
    { term: "VL（视觉语言识别）", meaning: "这里指本地 PaddleOCR-VL 文档路线，不是任意云端视觉聊天服务。" },
    { term: "profile（模型配置档）", meaning: "绑定引擎、适配器、模型版本和选项的具体配置；一个引擎族与一个具体配置不是同一个概念。" },
    { term: "bbox / rect / polygon（兼容区域 / 矩形 / 多边形）", meaning: "bbox 是兼容区域字段，在普通 OCR 中可能仍是多边形；统一矩形使用 rect，多边形使用 polygon。PDF 结果属于渲染像素，矫正后还应核对实际图像空间。" },
    { term: "objective sidecar（客观结果伴随文件）", meaning: "独立保存执行、覆盖、质量、证据绑定和文字检测结论的 JSON；它不替代正文，也不是外部鉴定。" },
    { term: "job key（任务标识）", meaning: "由源文件内容、请求和模型等身份生成的结果定位；不能仅靠文件名判断任务相同。" },
    { term: "cache hit（结果复用命中）", meaning: "已保存结果通过当前完整性和身份检查，可以省去重复推理；不意味着文字百分之百正确。" },
    { term: "warm worker（温热推理进程）", meaning: "同一模型可留在进程中供后续请求复用；模型切换、取消或执行故障会触发对应回收。" },
    { term: "LocalGpuBroker（本地显卡协调器）", meaning: "现有机器能力负责协调 LocalOCR 与其他重模型的显卡使用，不由这个网页创建。" }
  ],
  operatingFlow: [
    { title: "先把原件和目标说具体", detail: "指定本次文件或文件夹，说清只要文字，还是需要表格、公式、印章区域和坐标；需要严格本地处理时一并说明，目录递归单独选择。" },
    { title: "确认入口可用，而不是只看进程还在", detail: "正常调用入口读取本服务健康与活跃任务；无服务时使用现有启动入口，忙碌或身份不符时返回具体状态，不抢占别的程序端口。" },
    { title: "固定本次输入，再决定识别方式", detail: "规范路径、检查支持类型并生成输入快照与请求身份。自动方式先按文件类型和复杂 PDF 文件名提示选择，显式模型始终优先。" },
    { title: "先查能否复用，确有需要再推理", detail: "已有相同请求的正式结果时复验文件、大小、哈希与客观结果文件；不满足条件才执行。一个目录的所有文件共享本次期限，不按文件无限延长。" },
    { title: "按页提字、必要时本地增强", detail: "普通提字结果为空或明显低置信度时，未固定模型的自动请求可以转本地 VL；明确结构需求直接走结构解析。增强失败只保留初步证据，整体仍说明失败。" },
    { title: "同时交回内容和读懂它的说明", detail: "保存 TXT、Markdown、JSON 与客观状态文件，返回精确结果路径；人话摘要说明文字块、覆盖、质量、分数、增强和警告，不能替代原始文字。" },
    { title: "对照原图后再用于下一件事", detail: "核对姓名、数字、日期、公式与表格关系；需要后续写文书或做表格时把经复核结果交给对应工具，而不是让识别引擎顺带替人作事实判断。" }
  ],
  components: [
    { name: "Windows 入口与服务识别", responsibility: "接住拖入文件、自然语言调用和有界等待，区分不存在、忙碌和错误服务。", implementation: "start.bat、start.ps1、ocr_smart.ps1、ocr_once.ps1、start_server.ps1；固定本机 18665，18666 不是后备端口。" },
    { name: "输入分流与模型配置", responsibility: "分开文件枚举、自动路线、显式模型和困难结果增强。", implementation: "router.py、smart_router.py、difficulty.py、model_registry.py、model_profiles.json；由 service.py 执行实际增强。" },
    { name: "三类识别适配器", responsibility: "分别完成普通文字、复杂文档和完整结构解析，并统一输出字段。", implementation: "engines/ppocrv6.py、engines/vl.py、engines/structure.py；保留原始结果并补齐文档块和坐标，不把模型选择写死在入口。" },
    { name: "PDF 页面与坐标", responsibility: "把指定 PDF 的页面变成可识别图片，明确页尺寸、渲染比例与坐标所属空间。", implementation: "pdf_utils.py 与各适配器组合；默认 render_scale=2.0，JSON 明示 rendered_pdf_pixels、rendered_width、rendered_height。" },
    { name: "结果与客观状态", responsibility: "同时交付可读文件、程序结构及有证据约束的识别结论。", implementation: "outputs.py、objective_result.py；display_summary 只投影现有字段，正式结果按请求隔离。" },
    { name: "执行服务与任务复用", responsibility: "让 CLI/API 共享同一执行方式，检查缓存、活跃任务、原件变化与正式结果提交。", implementation: "service.py、job_registry.py、server.py；增强失败的首轮结果留在 partial/<job_key>，不能变成成功缓存。" },
    { name: "监督执行与显卡协调", responsibility: "在同模型复用的同时保留期限、取消、内存和进程回收。", implementation: "runtime.py、gpu_broker.py、gpu_probe.py；管理本服务进程树，不把上限施加到整台电脑。" },
    { name: "只读观察与重建入口", responsibility: "让调用方知道阶段、进度与结果状态，并能按当前环境配置重建。", implementation: "observer.py；scripts/run_in_wsl.sh、install_wsl.sh、download_models.py 与 pyproject.toml；观察不是另一套调度器。" }
  ],
  usageExamples: [
    { moduleSlug: "input-routing", ask: "把这张截图里的文字复制出来，文件留在本机。", effect: "直接指定原图和本地处理要求，普通提字先走轻量路线；返回原始文字与识别状态，不自动上传，也不为一个截图扫描整个目录。" },
    { moduleSlug: "input-routing", ask: "这份多栏文档很复杂，但我想明确使用某个模型。", effect: "显式模型选择优先于自动路线；引擎与模型不匹配时直接说明，不静默改成另一个模型冒充完成。" },
    { moduleSlug: "document-structure", ask: "把采购表读成表格，保留型号、数量和金额对应关系。", effect: "明确选择结构解析，保留行列、文字行、阅读顺序和区域位置；输出后按原图核对对应关系，不只交回一长串文字，也不直接宣称生成了 Excel。" },
    { moduleSlug: "results-evidence", ask: "这个空结果到底是没有字，还是没读出来？", effect: "分别查看执行、覆盖、质量和独立证据；普通空结果保持无法判断，只有窄范围负向证据通过检查才说没有检测到文字。" },
    { moduleSlug: "results-evidence", ask: "分数很高，可这个浅色型号看起来不对。", effect: "定位原图区域独立复看；如果更正，单列更正内容、原图指纹和区域，保留原始 OCR 不变。平均分高不能代替关键字符核对。" },
    { moduleSlug: "jobs-cache", ask: "刚才窗口等超时了，这份扫描件还在处理吗？", effect: "先查返回的任务标识和活跃任务；正在跑就继续查或明确取消，已完成且结果有效就复用，不因窗口超时盲目重交。" },
    { moduleSlug: "runtime-resources", ask: "识别卡住了，但别把其他本地模型一起停掉。", effect: "先定位本次任务，再使用精确取消或执行期限回收它自己的推理进程；资源冲突与服务问题分别说明，不结束未知程序。" },
    { moduleSlug: "installation-recovery", ask: "换电脑后，要怎样恢复这套本地文字识别？", effect: "按现有 WSL、Python 依赖、模型配置和缓存入口重建，再分别验证服务、单元逻辑与真实样例；没有预备完整工件时不能把联网安装脚本说成离线一键恢复。" }
  ],
  evidenceLayers: [
    { layer: "源码与配置", proves: "当前公开主分支实际包含的输入、三条模型路线、输出、任务和资源处理逻辑。", doesNotProve: "某台机器已装齐依赖、每个模型正在运行或任意图片识别准确。" },
    { layer: "普通单元回归", proves: "受控输入下的分流、结构字段、结果语义、任务生命周期与调用入口合同。", doesNotProve: "真实显卡加载、模型准确率、长文档耗时和新机恢复效果。" },
    { layer: "依赖与健康现场", proves: "实际读取到的包版本、服务身份和活跃状态；尚未探测显卡与显卡不可用是两回事。", doesNotProve: "所有登记模型均已加载，也不证明当前文件完成识别。" },
    { layer: "真实合成样例", proves: "指定合成原图经过实际入口和指定模型后，生成了可打开、可对照的结果。", doesNotProve: "私人文档、不同布局和每一个关键字都正确；一个样例不是全模型基准。" },
    { layer: "文件与原件复核", proves: "结果对应本次输入、请求与模型，保存字节可核对；对照检查能确认被检查的具体区域。", doesNotProve: "未检查部分正确、原件事实真实、印章真实或外部机构认可。" }
  ],
  operationalEntrypoints: [
    { name: "日常本机入口", command: "E:\\Projects\\Tools\\LocalOCR\\ocr_smart.ps1 '<明确文件或目录>' -Engine auto", purpose: "正常先看服务与任务状态，再提交有界识别；需要结构时显式 -Engine structure，需要具体模型时指定 -Model。" },
    { name: "一次性命令行", command: "E:\\Projects\\Tools\\LocalOCR\\start.ps1 '<明确文件或目录>' --engine auto --timeout-sec 300", purpose: "与 API 共用 OCRService 和正式结果语义；退出时关闭自己的执行服务。" },
    { name: "只看服务状态", command: "GET http://127.0.0.1:18665/health", purpose: "核对本服务身份、active_jobs、驻留模型与显卡探测状态；active_jobs 缺失视为未知。" },
    { name: "查询或取消指定任务", command: "GET /jobs/<job_key> ; POST /jobs/<job_key>/cancel", purpose: "两条均使用本机 18665；先按返回标识定位，取消只针对明确任务，不能当成停止其他服务的入口。" },
    { name: "普通回归", command: "scripts/run_in_wsl.sh -m unittest discover -s tests -q", purpose: "验证非重型逻辑；需要跨模型真实集成时才单独评估 tests/run_tests.py --allow-heavy，不能把它当健康检查。" },
    { name: "重建环境", command: "wsl -d Ubuntu -e bash /mnt/e/Projects/Tools/LocalOCR/scripts/install_wsl.sh", purpose: "联网安装系统/Python 依赖并预热模型，会改变环境且运行重型工作；不是浏览网页或普通状态检查时自动执行的命令。" },
    { name: "按需释放显卡资源", command: "E:\\Projects\\Tools\\LocalOCR\\release_resources.ps1", purpose: "只有别的显卡任务确实需要资源时才释放；日常连续识别保留温热模型，避免反复冷启动。" }
  ],
  evolution: [
    { date: "2026-07-12—2026-07-29", commit: "c8fa63a—ad5cad4", result: "从本机拖入识别发展到有界 Windows 入口、服务健康检查、任务观察和困难 OCR 的本地 VL 增强，使执行过程可定位而不只得到一段文字。" },
    { date: "2026-08-17—2026-08-27", commit: "8191be3—9c49193", result: "把空结果、覆盖、质量和负向证据分开；补上正式结果复验、结构与坐标保真、执行监管，并纠正平面截图不应默认形变矫正的取舍。" },
    { date: "2026-09-01", commit: "acc6d15—e0a2fff", result: "在保留原始证据的同时加入人话状态摘要，并统一说明当前 CLI、API 与自动增强的真实行为，让结果先可读、再可深入复核。" }
  ]
};

export const localOcrModules = [
  {
    slug: "input-routing", shortTitle: "输入与识别路线", title: "从指定原件到合适的本地识别方式",
    searchAliases: ["截图提取文字", "扫描PDF怎么识别", "本地图片识字", "自动OCR怎么选模型", "只在本机处理图片", "文件夹批量OCR", "指定OCR模型"],
    searchProjection: { intents: ["指定一张图片提字", "处理一个扫描PDF", "批量读取明确文件夹", "选择本地模型"], entities: ["图片", "扫描PDF", "ocr_smart.ps1", "OCRService", "auto", "ppocrv6-medium", "paddleocr-vl-1.6"], relations: ["原生文字层先于OCR", "普通OCR低置信度转本地VL", "显式模型选择优先"], failureRecovery: ["端口身份错误停止", "active_jobs缺失保持未知", "增强失败保留partial", "引擎与模型冲突不改写"] },
    teaser: "明确读哪个文件、要文字还是结构；普通内容先提字，不够再本地增强。",
    status: "三条路线与统一执行已实现", statusTone: "pass",
    value: "我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。",
    why: "一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。",
    example: "“把这张截图里的文字提出来；这份多栏 PDF 用增强方式；这个文件夹不要包括子目录。”三种请求都先固定明确输入，再选择路线，不把文件夹入口变成全盘搜索。",
    result: "返回对应文件的结果路径、实际引擎与模型、选择原因，以及是否发生增强。遇到不支持的文件、模型冲突、活跃任务或服务身份不符，会说明原因，不交回来自另一条未知路线的结果。",
    readerStates: { pass: "输入范围与路线明确，按请求执行并返回实际模型和输出。", problem: "自动提字不足时可以本地增强；增强失败保留首轮初步证据，但不标完成。", unavailable: "原件不可读、模型冲突或服务不是 LocalOCR 时停止相应请求，不抢端口、不换云服务。" },
    decisionImpact: ["普通看图不强制 OCR，数字文档有文字层时优先原生读取。", "复杂 PDF 首轮分流看文件名关键词，不是先理解全部版面。", "显式模型优先；结构解析需要单独选择，不是自动增强的第三级。"],
    problem: "防止范围不明的批处理、轻重模型误用、显式选择被改写，以及客户端调用脚本与真实服务行为不一致。",
    implementation: [
      "router.py 枚举支持的图片和 PDF；是否递归由 recursive 参数决定，不默认扩大目录范围。",
      "smart_router.py 对普通图片与 PDF 先选 ocr；复杂 PDF 文件名出现 table/formula/layout/multi/论文/公式/表格/多栏/课件 等提示时可直接选 vl。",
      "service.py 在 auto 且未指定 model 时检查普通 OCR 的空结果和低置信度；difficulty.py 提供困难度依据，触发本地 VL 增强。",
      "model_registry.py 解析 profile（具体模型配置），核对引擎匹配；显式模型不被自动选择覆盖。",
      "CLI 与 API 共用 OCRService，因此 start.ps1 / localocr.cli 同样使用当前增强与执行监管；这不是调用脚本独有能力。",
      "ocr_smart.ps1 预览路线并验证服务健康，以 active_jobs 作为忙碌依据；缺字段为 readiness_unknown，不能当空闲。"
    ],
    flow: ["固定本次文件、目录递归范围与希望得到的结果。", "优先检查原生可读内容；需要图片文字证据时进入 LocalOCR。", "核对路径、类型、明确引擎与模型配置。", "普通提字或复杂文档路线执行，必要时根据首轮结果增强。", "交回实际路线与文件，不把预检建议当最终模型身份。"],
    concepts: [{ term: "auto（自动选择）", explanation: "按当前可解释规则选 ocr 或 vl；不是无条件选择最重模型，也不包含 structure。" }, { term: "explicit model（明确模型）", explanation: "用户明确指定某个配置时按它执行；冲突要说明，不能静默改写。" }, { term: "route（实际识别路线）", explanation: "记录最终引擎、原因、信号与增强过程，方便解释与复核。" }],
    boundaries: ["支持的是明确文件和目录，不是私人库后台扫描。", "仅需场景描述时由原生视觉处理；全本地要求下不向外部视觉服务发送像素。", "普通 OCR、VL 和 Structure 的适用范围不能互相冒充。"],
    failures: [{ condition: "输入不支持或不可读", response: "返回明确的输入或读取错误，不制造空白成功结果。" }, { condition: "显式引擎与模型不匹配", response: "拒绝该组合，让调用方修正配置；不私自换模型。" }, { condition: "本地增强失败", response: "保留首轮 partial（初步结果）与失败原因，整体仍为失败，不能写入成功缓存。" }, { condition: "端口是另一个服务", response: "报告 non-LocalOCR service，停止提交；不把 18666 当自动后备。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\router.py", role: "支持类型与输入枚举" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\smart_router.py", role: "自动与显式路线" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\difficulty.py", role: "困难度依据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "实际增强与统一执行" }, { path: "E:\\Projects\\Tools\\LocalOCR\\ocr_smart.ps1", role: "Windows 有界入口与服务识别" }],
    verification: ["来源独立审查已核对 e0a2fff 的 CLI/API 共用路径、显式选择和增强条件。", "模型注册、分流与调用脚本行为有独立单元测试；当前机器测试与运行证据见总览技术层。", "文件名提示只是规则信号，不是复杂版面准确识别的实测证据。"],
    relation: "这个模块决定如何进入任务；表格与版面模块解释结构需求，结果与复核模块解释如何读返回值，任务与运行模块处理复用和故障。"
  },
  {
    slug: "document-structure", shortTitle: "表格与版面", title: "把行列、公式与页面位置一起保留下来",
    searchAliases: ["采购表格识别", "扫描表格保留行列", "PDF多栏阅读顺序", "公式识别", "印章区域", "OCR坐标为什么对不上", "PP-StructureV3"],
    searchProjection: { intents: ["提取采购表行列", "读取多栏论文", "识别公式与印章区域", "核对PDF坐标"], entities: ["PP-StructureV3", "PP-OCRv5", "PaddleOCR-VL-1.6", "table HTML", "render_scale", "bbox", "polygon"], relations: ["structure显式选择", "PDF先渲染再识别", "原始文字行与结构块并存", "像素坐标不是PDF点坐标"], failureRecovery: ["结构丢失回原图核对", "公式错误保留原输出", "坐标按渲染尺寸匹配", "不把印章识别当鉴真"] },
    teaser: "提取文字之外，还要保留表格行列、阅读顺序、公式和原图位置。",
    status: "结构字段与解析路线已实现", statusTone: "mixed",
    value: "当一行文字必须和另一列数字对应时，只把字读出来还不够。结构解析保留表格、公式、区域和阅读顺序，让我能继续整理材料，并按同一页的图像位置核对每一处内容。",
    why: "采购表、双栏文档和公式页容易被普通提字打散。这个模块把结构作为明确结果需求：模型负责还原可见关系，原图负责最终复核，不把一段流畅文本当作表格已经准确恢复。",
    example: "“把采购订单的商品、型号、数量、单价和金额按行列保留下来。”明确选择 structure 后，检查输出表格是否仍有六列、商品与数字是否对应，再核对合计；识别出来的数字不自动成为正确的业务金额。",
    result: "得到 Markdown 中的表格或公式内容，以及 JSON 中的块类型、原始文字行、位置和阅读顺序。PDF 结果还保留渲染页尺寸，便于回到同一页面；不是直接产生 Excel，也不是印章鉴定。",
    readerStates: { pass: "结构与文字一起返回，可以按页和区域核对。", problem: "行列、阅读顺序、公式或坐标有误时保留原始输出并回原图检查，不静默改写。", unavailable: "结构模型或输入不支持时返回明确失败；普通提字的结果不能冒充结构解析成功。" },
    decisionImpact: ["表格和版面必须明确提出，auto 不自动进入 structure。", "PDF 坐标属于渲染后的像素，需要同页、同尺寸和正确的矫正空间。", "图表识别当前关闭；印章区域识别不证明印章真伪。"],
    problem: "防止表格行列被拼成无关系的文本、公式信息被过度简化，以及把不同坐标空间混用导致复核指错区域。",
    implementation: [
      "pp-structure-v3 profile 使用 PP-StructureV3 + PP-OCRv5；当前 PaddleOCR 结构接口不能把普通 OCRv6 配置直接套入该路线。",
      "use_table_recognition、use_formula_recognition、use_seal_recognition、use_region_detection 与 format_block_content 已开启，use_chart_recognition=false。",
      "engines/structure.py 保留版面、表格 HTML、公式、印章、区域和原始 OCR 行，避免只保留展示文本而丢掉独立位置证据。",
      "engines/vl.py 为复杂 PDF 提供视觉语言解析；VL 与显式 Structure 是不同选择，不用一个模型名称覆盖所有文档场景。",
      "pdf_utils.py 默认 render_scale=2.0，把 PDF 逐页渲染成图片；rendered_pdf_page_metadata 给出 image_pixels、尺寸和比例，不宣称原生 PDF 点坐标。",
      "普通 OCR 对平面截图默认关闭文档形变矫正；VL 与 Structure 的文档配置仍开启，复核时应核对实际坐标所属图像空间。",
      "本轮采购表的 figure_title 被 _is_non_text_label 按标签分词中的 figure 排除到 excluded_regions；Markdown 只输出 blocks，所以标题未进入正文。text_lines 仍有标题但把 PO 读成 P0，不能把这个缺口说成整页完全没有处理。"
    ],
    flow: ["说明需要表格、公式、印章区域或复杂版面，而不只说提字。", "选择 VL 或显式 Structure，核对实际 profile。", "PDF 逐页渲染，图片按其对应输入空间处理。", "保留结构块、原始文字行、顺序与位置，生成可读和结构化输出。", "按原页核对行列、公式、边界与坐标，不以表格看着整齐代替正确性。"],
    concepts: [{ term: "table HTML（表格结构标记）", explanation: "保存行列关系的模型输出，可供后续转换；格式存在不代表单元格内容正确。" }, { term: "reading order（阅读顺序）", explanation: "文档块应按什么顺序阅读；多栏和复杂布局下仍需核对。" }, { term: "rendered pixels（渲染像素）", explanation: "PDF 被转成图片后的坐标单位，与原 PDF 的点坐标不同。" }],
    boundaries: ["只有输出中实际存在的结构才可宣称提取成功，不能从模型能力标签猜结果。", "不保证恢复任意复杂表格，也不代替公式推导或印章鉴真。", "没有直接生成 Word、Excel 或可搜索 PDF 的现行导出入口。"],
    failures: [{ condition: "表格合并或阅读顺序错误", response: "保留原始结构与文字行，按原图校对；下游转换不得掩盖不确定性。" }, { condition: "框的位置对不上 PDF", response: "先核对页码、render_scale、渲染尺寸和矫正空间，不直接把像素框作为 PDF 点坐标。" }, { condition: "模型未加载或结构解析失败", response: "保留明确错误；若另选普通提字，应注明能力降级和本次实际输出。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\engines\\structure.py", role: "结构与原始文字保留" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\engines\\vl.py", role: "复杂文档路线" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\pdf_utils.py", role: "页面渲染与坐标" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\model_profiles.json", role: "实际结构选项" }, { path: "E:\\Projects\\Tools\\LocalOCR\\tests\\test_structure.py", role: "结构字段回归" }],
    verification: ["源码与配置已核对表格、公式、印章、区域开启而图表关闭的实际状态。", "test_structure.py 与相关输出测试验证字段、文字行和坐标保留，不代表真实模型对任意文档准确。", "本轮真实 structure 样例保留六列、五条商品和合计；Markdown 漏标题，text_lines[0] 把 PO 读成 P0；quality=unknown / confidence_unavailable。原图与输出都公开展示，不伪称逐字准确。"],
    relation: "输入路线决定何时选择结构解析；本模块拥有结构含义，结果模块拥有输出身份与质量解释，后续文档排版由独立工具完成。"
  },
  {
    slug: "results-evidence", shortTitle: "结果与复核", title: "拿到文字后，怎样知道读全了、读对了没有",
    searchAliases: ["OCR空结果有没有文字", "识别置信度高仍然错字", "OCR结果先看哪个文件", "浅色小字识别", "结果哈希校验", "display_summary"],
    searchProjection: { intents: ["读懂OCR输出", "判断空结果含义", "复核重要字符", "核对输出与原件"], entities: ["TXT", "Markdown", "JSON", "display_summary", "media.objective-result.v1", "coverage", "quality", "no_text_detected"], relations: ["执行覆盖质量相互独立", "空文本不等于无字", "高平均分不等于逐字正确", "原始结果与人工更正分开"], failureRecovery: ["indeterminate保留未知", "低置信度回原图", "缺失sidecar不接受无字结论", "源文件改变不提交旧结果"] },
    teaser: "先看人话状态，再看正文和原图；空文本、低分与处理失败不是同一回事。",
    status: "输出与客观状态合同已实现", statusTone: "pass",
    value: "我既需要复制出来的文字，也需要知道它来自哪一页、哪里可能漏了、什么还不能判断。这个结果层把可读内容与检查依据一起交回来，使一份空白文件或看似很高的分数不会替我作错误结论。",
    why: "模型可能没读出浅色小字，也可能只处理了部分页面；若最后只显示“成功”或“没有文字”，我会误用结果。这里先分清执行、覆盖、质量和文字检测，再说明各自证据，保留具体字符的复核责任。",
    example: "“识别分数很高，但这个型号最后一位我看不清。”先读摘要定位警告，再看 JSON 中相应文字与区域，回到原图独立复核；需要更正时单独说明，不把原始 OCR 改成看起来一直正确。",
    result: "TXT 适合复制，Markdown 适合阅读结构，JSON 适合程序处理与位置复核；客观结果文件说明执行、覆盖、质量和不确定性。结果对应关系可验，但关键字准确性、原件真实性和外部事实仍是不同问题。",
    readerStates: { pass: "内容、位置和质量说明都可读取，正式文件与输入身份一致。", problem: "低置信度、部分覆盖或关键字分歧如实保留；摘要帮助定位，不能抹掉原始错误。", unavailable: "缺少有效结果文件或证据绑定时不能宣称已验证；普通空结果保持无法判断。" },
    decisionImpact: ["先看 display_summary（人话状态摘要），再读正文、坐标与客观文件。", "ok=true、空 TXT、空 blocks 或 cache_hit 都不能单独证明原图无字。", "原生视觉的场景解释和 OCR 的精确文字证据独立保留，冲突时回查原图。"],
    problem: "防止空结果被误报为无字、执行完成被误报为正确，以及手工更正覆盖了原始识别证据。",
    implementation: [
      "outputs.py 输出按页 TXT、保留结构的 Markdown、含位置/顺序/类型的 JSON；display_summary 是对既有客观字段的确定性投影，不修改结论。",
      "objective_result.py 分开 execution.status、coverage.status、quality.status、objective_outcome 与 failure；文字检测结论只在 text_detected、no_text_detected、indeterminate 中选择。",
      "生产者可以在独立检测证据成立时形成 no_text_detected；未保存时 evidence.verification_status 仍为 not_persisted。调用方只有在 completed、complete、sufficient、verified 及实际非空负向证据文件的字节和身份复验全部成立后，才采纳为已验证的持久结论或正式缓存；当前内置检测证据主要限于近乎均匀图片。",
      "客观文件使用 media.objective-result.v1，复核 schema、size_bytes、SHA-256、原件、请求、模型、配置与所有正式输出绑定；旧式缺文件结果不能补猜成已验证。",
      "service.py 对输入做临时快照并在提交前检查原件变化；发生变化时不把旧识别结果提交到新原件名下。",
      "若独立视觉复核更正某个关键区域，更正单列绑定原始 source hash（原件指纹）和 rect（区域），不得覆盖 OCR 原始文件或冒充引擎自动结果。"
    ],
    flow: ["先读摘要：执行到哪、覆盖怎样、是否低置信或增强。", "选择 TXT/Markdown/JSON 中适合下一步的文件。", "用页码与区域找到关键字，并核对同一原图。", "遇到空结果，检查独立负向证据，而不是只看文字长度。", "把确认、更正与未知分开，保留原始识别和实际输出路径。"],
    concepts: [{ term: "coverage（处理覆盖）", explanation: "本次应处理的页或区域是否被处理，不是正文逐字完整。本轮样例 1/1 页 complete，标题仍未进入 Markdown，因此不能据这个字段认定无遗漏。" }, { term: "quality（结果质量）", explanation: "依据当前证据判断是否足以解释结果；不能简单当作逐字准确率。结构块未提供可用置信度时可以保持 unknown，即使原始文字行有高分。" }, { term: "indeterminate（无法确定）", explanation: "当前证据不能支持确定结论；失败、部分处理或普通空结果都不能伪装成无字。" }],
    boundaries: ["内容正确性与字节完整性不同；哈希通过不证明文字或原件事实正确。", "原始文字、结构化文件与另行复核更正保持独立。", "识别到印章或姓名不证明真实性或人物身份。"],
    failures: [{ condition: "空 TXT 或空 blocks", response: "检查执行、覆盖、质量和独立证据；条件不全就保持 indeterminate。" }, { condition: "模型平均分高但关键字有疑问", response: "回原图核对精确区域，不让平均值覆盖细小错误。" }, { condition: "客观文件缺失、哈希或身份不一致", response: "拒绝正式复用或无字结论，保留错误与原件定位。" }, { condition: "原件在处理过程中变化", response: "不提交旧结果；固定最终原件后再决定是否重新处理。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\outputs.py", role: "内容文件与人话摘要" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\objective_result.py", role: "客观结果与负向证据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "输入快照与提交检查" }, { path: "E:\\Projects\\Tools\\LocalOCR\\tests\\test_objective_result.py", role: "空结果、质量与证据回归" }, { path: "sample-table-actual.md", href: "/media/localocr/sample-table-actual.md", download: "sample-table-actual.md", role: "下载本轮实际 Markdown 原文件（UTF-8），用支持 Markdown 的编辑器打开；保留表格与合计，未补写漏掉的标题。需要直接看效果，可查看总览中的实际输出图片。" }, { path: "sample-table-actual.json", href: "/media/localocr/sample-table-actual.json", role: "本轮实际 JSON 原样副本：可以核对 text_lines 中的 P0、excluded_regions 中的标题，以及质量未知和页覆盖字段。" }],
    verification: ["源码审查确认人话摘要不改写客观结论，空结果条件与普通错误分开。", "合成单元测试覆盖负向证据、损坏、缺失、低置信度和实际字节绑定；这不能替代原图人工复核。", "重要数字和小字必须由真实样本逐区复看；没有复看的部分不能声称已经确认。"],
    relation: "这个模块解释结果能信到哪；任务复用模块据同一合同检查缓存，下游材料与文档工具只消费明确有效的内容。"
  },
  {
    slug: "jobs-cache", shortTitle: "任务与复用", title: "不重复跑同一份材料，也不把旧结果套到新原件上",
    searchAliases: ["OCR超时要不要重试", "重复扫描件不要重跑", "OCR任务进度", "缓存命中是什么意思", "OCR任务取消", "cache_hit", "active_localocr_task"],
    searchProjection: { intents: ["查询刚才的识别任务", "复用相同输入结果", "取消一个任务", "判断超时后是否重交"], entities: ["job_key", "job_registry.py", "cache_hit", "active_localocr_task", "partial", "output_files"], relations: ["输入内容和请求生成任务身份", "正式结果完整性决定复用", "客户端退出不等于服务端结束", "活动冲突不隐式排队"], failureRecovery: ["先查询原任务", "失效缓存重新判断", "增强失败不进成功缓存", "返回409时不要盲重提"] },
    teaser: "查询、取消、复验与结果复用有同一套身份；窗口超时不是重交信号。",
    status: "任务定位与结果复验已实现", statusTone: "pass",
    value: "同一份资料已经处理过时，能复用就不再等模型；正在处理时，我能知道它在哪一步，而不是反复按提交。这个模块把原件、请求和结果对在一起，让省时不会变成拿错旧文件。",
    why: "文件同名不代表内容相同，输出还在也不代表它完整。客户端窗口超时还可能留下正在执行的工作；如果不先定位任务就重试，会重复占用显卡，还可能混淆两次结果。",
    example: "“刚才那份扫描件等超时了，现在是不是要再来一次？”先按返回的 job key 查询；仍在运行就等待或明确取消，已完成且文件校验通过就直接读结果。若服务曾异常退出，下次启动会核对遗留任务，已死亡执行被标为中断失败并解除占用，仍活着的任务不会仅因耗时长被抢走；这不是逐页自动续跑。",
    result: "我得到明确任务定位、实际结果路径、复用状态或具体错误；结果以内容、请求和配置为单位，而不是只看文件名。它不承诺页级断点续跑，也不会把所有失败请求放进后台无限重试队列。",
    readerStates: { pass: "正式文件与身份通过复验后直接复用；新请求按明确任务执行。", problem: "客户端超时先查任务；重启后核对已死亡的遗留执行并标 owner_exited，保留失败状态，不自动重跑。", unavailable: "活跃任务或显卡冲突会返回定位；如果连任务终态都不能写入，就保留恢复占用并停止接单，不以进程仍在冒充健康。" },
    decisionImpact: ["使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。", "相同请求仍需复核输出，缓存命中只代表可复用。", "当前有任务查询和结果复用，不等于长 PDF 可从任意页自动续跑。"],
    problem: "防止重复执行、旧结果错配、坏缓存被接受，以及等待期限与执行期限混为一谈。",
    implementation: [
      "job_registry.py 把源路径、文件内容、请求语义、分流版本、模型 profile 和输出目录纳入任务身份。",
      "service.py 在正式写盘前后维护任务状态，复用时检查客观文件及所有输出的非空大小和 SHA-256，不只判断文件存在。",
      "正式文件名包含请求身份；无哈希同名 TXT/MD/JSON 仅供兼容展示，不能作为缓存或原件身份依据。",
      "server.py 暴露 /jobs/<job_key> 与指定 cancel 入口；active_localocr_task 返回 409，调用方应读取原任务，不隐式新建队列。",
      "自动增强失败时首轮结果只保存到 partial/<job_key>，整体仍失败且不提交正式成功缓存。",
      "observer.py 提供只读阶段、模型、页进度和耗时投影；这不是另一套任务调度，也不提供 OCR token 生成速率。",
      "OCRService 初始化调用 job_registry.recover_abandoned：复核遗留锁对应的进程身份，确认执行者已死亡才将 running 标成 failed / owner_exited 并清除占用；活任务不会仅因运行时间长被接管，不产生页级自动续跑。",
      "若失败终态本身无法写入，service.py 保留恢复锁并记录 terminal_persistence_failure；health 返回 not-ready / job_state_persistence_failed，后续请求以 503 拒绝，不能把状态未落盘的服务继续当正常执行器。"
    ],
    flow: ["从本次原件与请求确定任务身份。", "复验已有结果，完整有效时直接复用。", "已有活跃任务时返回明确定位，不并发重交。", "确需新执行时由同一服务负责处理与状态。", "超时或中断后先查原任务和文件，再决定等待、精确取消或有界重试。"],
    concepts: [{ term: "request identity（请求身份）", explanation: "输入、模型和请求参数的组合，防止同名文件或不同模型共享错误结果。" }, { term: "formal output（正式输出）", explanation: "本次请求完成并通过相应检查的结果路径；与兼容显示副本和 partial 初步证据不同。" }, { term: "observer（只读观察）", explanation: "让调用方看阶段、模型与时间，不替它创建或重新执行任务。" }],
    boundaries: ["客户端 timeout（等待超时）不证明服务端任务终止。", "不承诺永久任务档案或跨任意故障的自动续跑。", "write_outputs=false 不登记正式写盘任务与结果缓存，内存证据不能冒充已保存证据。"],
    failures: [{ condition: "HTTP 409 / active_localocr_task", response: "读取已返回的 job_key 和查询入口，不盲目重复提交。" }, { condition: "输出丢失、为空或指纹不匹配", response: "不接受缓存命中，保留原件与请求依据后重新判断执行。" }, { condition: "客户端 exit 124", response: "先回查服务端任务状态；不能仅凭退出码认定识别失败。" }, { condition: "增强失败但有首轮文字", response: "明确为 partial，不把这些文件提升为正式成功结果。" }, { condition: "服务崩溃遗留 running 与锁", response: "下次启动核对进程身份；已死亡的执行标 owner_exited 并解除占用，活执行保留，不自动重跑。" }, { condition: "任务终态无法写入", response: "保留恢复锁与原始/落盘错误，health 标不可继续接单；先修复实际存储问题，不以进程存在或盲重提掩盖。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\job_registry.py", role: "任务身份与缓存复验" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "正式结果提交与初步证据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\server.py", role: "查询和精确取消" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\observer.py", role: "只读观察" }],
    verification: ["任务、输出、观察和进程测试分别覆盖当前行为；普通测试不能证明真实长文档的恢复速度。", "重跑同一合成请求可验证复用，但不能据此推导任意私人原件准确率。", "当前实现的边界是任务定位与有效结果复用，未把其他项目的页级续跑能力复制为 LocalOCR 承诺。"],
    relation: "结果与复核模块定义什么才算有效结果，本模块决定是否复用；运行与资源模块负责活动执行和终止边界。"
  },
  {
    slug: "runtime-resources", shortTitle: "运行与资源", title: "识别可以重，但等待、显存和进程必须可控",
    searchAliases: ["OCR显卡冲突", "OCR卡住怎么停", "18665", "GPU租约", "OCR服务内存", "识别超时", "释放OCR显存"],
    searchProjection: { intents: ["查询识别服务是否可用", "终止明确卡住的识别任务", "解释显卡冲突", "释放模型资源"], entities: ["127.0.0.1:18665", "active_jobs", "LocalGpuBroker", "warm worker", "300秒", "7200秒", "30GB"], relations: ["同模型温热复用", "换模型回收进程", "整次请求共享期限", "租约丢失结束执行"], failureRecovery: ["409活动或资源冲突", "503协调器不可用", "504执行超期", "只取消指定job", "不停止其他服务"] },
    teaser: "本机服务、温热模型与显卡协调共同工作；出错时只处理本次明确任务。",
    status: "监督执行与回收已实现", statusTone: "pass",
    value: "我可以连续识别几份材料而不让模型每次冷启动，也可以在明确任务卡住时让它结束。显卡、内存和等待时间都有可解释的边界，不会因为一个识别请求顺手停掉其他本地工作。",
    why: "只限制窗口等待会留下后台推理，只看进程存在又不知道任务是否健康。这个运行层把服务、推理进程、显卡资格和任务期限分开管理，并把冲突、超期、取消与模型错误交回调用方。",
    example: "“这次识别卡住了，取消它，但别影响其他模型。”先从活跃任务确认本次 job，再精确取消；若是显卡协调器报告别的任务正在使用资源，就说明冲突，不通过结束未知进程抢资源。",
    result: "正常时复用当前模型；故障时返回明确错误与任务定位，并回收对应推理进程。服务健康、显卡已探测、模型已驻留、文件已识别四件事分别展示，不合成一盏含糊的总绿灯。",
    readerStates: { pass: "获得资源后在期限内处理，同模型可复用已加载进程。", problem: "取消、超期、内存越界或显卡资格丢失时结束对应执行，保留具体状态。", unavailable: "资源协调器不可用或端口不是本服务时停止依赖路径，不静默转 CPU、换端口或终止其他服务。" },
    decisionImpact: ["health.active_jobs 是忙碌事实源，缺失即未知。", "300 秒默认期限覆盖整次请求和加载，不是每页或每文件各给 300 秒。", "显卡未探测、模型未驻留和显卡不可用不能混写。"],
    problem: "防止冷启动反复、模型抢资源、调用端退出后遗留推理，以及粗暴停止服务误伤其他任务。",
    implementation: [
      "server.py 默认只监听 127.0.0.1:18665；18666 已有其他产品用途，不是可猜测的后备端口。",
      "runtime.py 维护一个受监督 warm worker（温热推理进程）；同模型复用，模型切换时重建，协调层不直接导入 Paddle。",
      "gpu_broker.py 在 GPU 探测、模型导入、加载与推理前要求现有 LocalGpuBroker 资格；失去租约时终止相应执行。",
      "DEFAULT_TIMEOUT_SEC=300，MAX_TIMEOUT_SEC=7200；DEFAULT_MEMORY_LIMIT_BYTES=30_000_000_000，限制本服务进程树而不是整机其他程序。",
      "执行监管处理明确取消、期限、进程异常和后代回收；服务重用不是新增持久队列，重复请求冲突不自动排队。",
      "HTTP 400 表示输入/配置错误，409 表示活跃任务或资源冲突，503 表示协调器或租约失败，504 表示执行期限；必须保留 detail 和任务定位。"
    ],
    flow: ["读取本服务身份与 active_jobs。", "确认本次任务及显卡资源资格。", "复用同模型进程或按需切换模型。", "按整次请求期限与进程树内存上限监管。", "成功交回结果；取消或故障结束对应执行并说明原因。"],
    concepts: [{ term: "lease（资源使用资格）", explanation: "现有协调器确认当前任务可使用显卡；不是永久占有权，丢失后必须停止。" }, { term: "execution deadline（执行期限）", explanation: "服务端真正执行的总时限，与 HTTP 传输和调用脚本等待不同。" }, { term: "loaded_models（驻留模型）", explanation: "当前进程已加载的模型，不等于所有登记模型都通过真实推理验收。" }],
    boundaries: ["当前服务是本机入口，不是带远程访问授权的公网产品。", "只对明确本次任务和本服务进程树执行回收。", "常规连续识别保留温热进程；确需给其他任务让资源时才释放，避免冷启动抖动。"],
    failures: [{ condition: "gpu_status=not_probed", response: "说明尚未进行显卡任务或探测，不解释成 CPU 降级或显卡故障。" }, { condition: "显卡冲突或协调器不可用", response: "返回 409/503 与实际原因，不绕过现有资源协调。" }, { condition: "执行期限、取消或内存越界", response: "结束相应推理进程及受管后代，保留明确错误，不把窗口退出当完成。" }, { condition: "服务健康缺 active_jobs", response: "保持 readiness_unknown，不按空闲继续提交。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\runtime.py", role: "温热进程、期限与回收" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\gpu_broker.py", role: "现有显卡协调" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\server.py", role: "本机服务与状态" }, { path: "E:\\Projects\\Tools\\LocalOCR\\release_resources.ps1", role: "按需资源释放" }],
    verification: ["普通生命周期与调用入口测试验证受控的取消、期限、回收和身份行为，不冒充真实极端显卡压力测试。", "本轮服务健康与合成样例属于不同证据；技术总览分别列出。", "没有为网页验收重启电脑、停止其他模型或修改常驻配置。"],
    relation: "输入模块通过本机入口进入，任务模块提供明确定位；本模块控制真正执行与资源，结果质量仍回到结果复核模块。"
  },
  {
    slug: "installation-recovery", shortTitle: "安装与恢复", title: "环境损坏或换电脑时，怎样把本地识别恢复到可用",
    searchAliases: ["LocalOCR怎么安装", "OCR换机恢复", "离线OCR模型", "WSL识别环境", "模型缓存恢复", "PaddleOCR版本", "本地识别环境坏了"],
    searchProjection: { intents: ["重建本地OCR环境", "核对当前模型与依赖", "判断能否离线使用", "验证安装后真实可用"], entities: ["WSL", "Ubuntu", "localocr-venv", "pyproject.toml", "model_profiles.json", "install_wsl.sh", "download_models.py"], relations: ["源码依赖模型运行分层", "缓存可用不等于离线重建包", "重型预热需显式选择", "安装后需要真实样例"], failureRecovery: ["缺模型先定位配置", "依赖错误不盲升级", "不把API存活当已恢复", "未验证离线重建保持明确缺口"] },
    teaser: "源码、Python 依赖、模型缓存与真实识别分别恢复、分别验证。",
    status: "现有安装入口可查，完整离线重建仍有边界", statusTone: "mixed",
    value: "换机或环境坏了时，我需要知道缺的是代码、依赖、模型还是服务，而不是凭旧对话拼命令。这个模块把现有安装路径与验证顺序讲清楚，也明确哪些离线承诺当前并没有做成。",
    why: "能克隆源码不代表能加载模型，模型目录存在也不代表依赖兼容；一个可响应的服务甚至可能尚未运行过显卡任务。恢复必须回到真实文件与样例，不能用“安装成功”三个字代替可用结果。",
    example: "“这台新电脑要恢复 LocalOCR，现在只有源码。”先核对 Windows/WSL 与显卡运行条件，再按现有脚本安装依赖、取得所选模型；分别运行普通回归、健康检查和有界真实样例，缺少网络或模型就说明具体缺口。",
    result: "得到明确的源码与配置身份、依赖状态、模型准备情况、服务状态和真实样例结果。当前提供的是现有联网安装与本地缓存使用路线，不把尚未验收的全离线新机恢复写成一键完成。",
    readerStates: { pass: "依赖、模型、服务与指定样例分别通过后，可以说该路线在这台机器上可用。", problem: "版本冲突、缺模型或样例失败时定位对应层，保留当前环境与错误，不用无关升级掩盖。", unavailable: "缺少必要依赖、模型、显卡条件或联网安装条件时明确停止该层；源码存在不冒充恢复完成。" },
    decisionImpact: ["优先复用现有环境和已下载模型，不为刷新网页重装。", "模型全部预热是重型动作，不是普通健康检查。", "完全离线恢复需要提前保留完整工件；当前脚本本身要联网。"],
    problem: "防止把源码、依赖、模型缓存、服务在线和实际识别合并成一个失真的恢复结论。",
    implementation: [
      "pyproject.toml 声明 localocr 0.6.0、Python >=3.10、PaddlePaddle GPU 3.3.1、PaddleOCR 3.7.0 及 PDF/HTTP/进程依赖；配置声明不自动证明本机安装值。",
      "scripts/install_wsl.sh 在 WSL Ubuntu 中安装系统包、创建 /root/localocr-venv，从指定包源安装 cu129 Paddle 与 PaddleOCR，并以可编辑方式安装项目。",
      "该脚本最终调用 download_models.py --allow-heavy 预热 OCR、VL、Structure；预热通过现有监督执行与显卡资格串行运行，不是下载文件列表就算完成。",
      "模型缓存入口为 /root/.paddlex/official_models/，具体模型/profile 的唯一项目配置为 localocr/model_profiles.json。恢复时要区分缓存文件与运行时已驻留模型。",
      "scripts/run_in_wsl.sh 设置当前 WSL 所需运行环境，再执行 CLI 或普通单元测试；Windows 调用脚本保留启动与等待的分层超时。",
      "当前没有能由本轮证据证明的完整离线重建包，也没有把所有 Python 依赖、WSL 系统和模型权重打成已验收的单个恢复工件。"
    ],
    flow: ["核对当前机器、源码位置和依赖声明，不先重装。", "区分缺代码、缺环境、缺模型和服务异常。", "确需重建时采用现有安装路径，缺网络或工件就说明。", "先普通回归与健康，再按明确范围验证真实样例。", "记录本次可用路线与未验证边界，保留后续恢复所需原始工件。"],
    concepts: [{ term: "venv（Python 独立环境）", explanation: "隔离项目依赖的现有运行目录，不是模型权重的替代品。" }, { term: "model cache（模型缓存）", explanation: "本机保存的模型文件；存在性、可加载与识别效果是三层不同证据。" }, { term: "smoke test（小样例运行检查）", explanation: "让指定文件经真实入口走到结果，验证一条具体路线；不是全面准确率基准。" }],
    boundaries: ["不因为网站内容建设就运行 install_wsl.sh 或重型全模型预热。", "已缓存模型的本地推理不等于断网新机可以从零安装。", "恢复版本以项目配置与兼容证据为准，不无依据永久钉死其他机器配置。"],
    failures: [{ condition: "Python 包或模型配置不兼容", response: "保留实际版本与异常，定位对应依赖/适配器，不盲目批量升级。" }, { condition: "模型缓存缺失", response: "按已选模型定位所需工件；取得模型与是否运行重型预热分开判断。" }, { condition: "服务在线但模型任务没跑通", response: "仅报告服务可达，继续把模型路线标成未验收。" }, { condition: "只有源码却要求完全离线恢复", response: "明确还缺依赖、WSL 和模型工件，不虚构已存在的恢复包。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\pyproject.toml", role: "当前依赖声明" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\install_wsl.sh", role: "联网安装路径" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\download_models.py", role: "显式重型预热" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\run_in_wsl.sh", role: "WSL 运行入口" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\model_profiles.json", role: "具体模型与选项" }],
    verification: ["来源审查核对当前安装脚本确实联网安装并在最后执行显式重型预热；本轮不运行它。", "已声明依赖、实际已安装版本、当前健康与真实样例分别记录，不相互冒充。", "干净新机、完全离线重建与全模型性能基准仍未在本轮验证。"],
    relation: "本模块恢复可执行环境；输入路线决定实际任务，运行层管理资源，最终仍由输出与原图复核证明用户拿到了什么。"
  }
];

export const project = localOcrProject;
export const modules = localOcrModules;
