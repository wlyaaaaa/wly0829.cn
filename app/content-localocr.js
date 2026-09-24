import { createProjectSnapshot } from "./project-snapshot.js";

const localOcrSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T13:26:35.257416Z",
  label: "逐页增强与可回滚版本已验，当前按需停机；合成识别通过不代表任意文字无误",
  boundary: "本轮只读核对已激活环境、9 月 17 日验收回执与当前源码，不运行 OCR。真实切换/回滚、Windows 首次识别与缓存复用已有来源证据，最终服务按设计停止；旧采购表的标题遗漏与 O/0 错读仍保留，新两页 VL 样例也有“请/清”错字。",
  metrics: [
    { label: "识别路线", value: "3 条" },
    { label: "正式输出", value: "TXT · MD · JSON" },
    { label: "9 月 17 日普通回归", value: "174 通过 · 1 跳过" },
    { label: "9 月 17 日合成验收", value: "9 案例 · 3 路线" }
  ],
  facts: [
    { label: "日常提字", value: "ocr → ppocrv6-medium：PP-OCRv6_medium；保留方向与文本行处理，平面截图默认关闭形变矫正。" },
    { label: "困难文档", value: "vl → paddleocr-vl-1.6：PaddleOCR-VL-1.6；可显式选择。auto 先普通 OCR，再根据逐页空结果、低置信度或表格/公式内容信号只增强问题页，保留首轮文字与坐标，不按文件名猜版式。" },
    { label: "结构化解析", value: "structure → pp-structure-v3：PP-StructureV3 + PP-OCRv5；表格、公式、印章和区域处理需显式选择，图表识别当前关闭。" },
    { label: "当前源码", value: "PUBLIC（公开）仓库 wlyaaaaa/LocalOCR，正式回读 main=origin/main=3a4bf13eb95beac540ce11b323e48ba53c1459db，工作树干净。开发源码与正式运行的冻结 app 快照分离，未发布修改不会自动进入现役服务。", hero: false },
    { label: "项目依赖声明", value: "项目 0.7.0，Python >=3.10；声明 paddlepaddle-gpu>=3.3.1,<3.5、paddleocr==3.7.0、paddlex==3.7.2，正式锁文件为 requirements/runtime-paddle-cu129.lock.txt。当前实装为 WSL Python 3.12、Paddle GPU 3.4.0/cu129、PaddleOCR 3.7.0，不把依赖允许区间当实际安装值。", hero: false },
    { label: "执行入口", value: "Windows有界入口为ocr_smart.ps1，直接API入口为ocr_once.ps1；拖入start.bat或调用start.ps1通过PowerShell 7.3+的pwsh进入localocr.cli。中文/空格路径转换为WSL路径，批处理固定Windows CRLF行尾。CLI（命令行）与API继续共用OCRService、自动增强、执行监管和输出合同。", hero: false },
    { label: "服务与资源", value: "固定本机 127.0.0.1:18665；一个可替换的 warm worker（温热推理进程）；同模型复用、换模型回收。默认整次请求期限 300 秒，最大 7200 秒，服务进程树内存上限 30,000,000,000 字节。", hero: false },
    { label: "当前模型配置", value: "localocr/model_profiles.json 声明 3 个具体 profile（模型配置档），由 model_registry.py 解析；显式模型选择不被自动分流改写。普通 OCR 配置的能力标签含形变矫正，但 use_doc_unwarping=false，不能把支持标签当成已开启。", hero: false },
    { label: "正式结果身份", value: "任务与缓存同时绑定原件内容、请求语义、逐页路由、具体模型配置、实际权重、实现和运行库。正式 TXT/MD/JSON 与 media.objective-result.v1 客观文件按请求隔离并复验；逐页原子检查点可作为超时/中断后的部分证据，不自动升级为完整结果或自动续跑。", hero: false },
    { label: "坐标含义", value: "PDF/TIFF 的实际页数/帧数先独立计数。当前逐页 PDF 渲染按 profile 的 216 DPI、24,000,000 像素上限选实际比例，JSON 保留页码、真实渲染尺寸、比例与坐标空间；旧兼容函数默认 scale=2.0。文字与识别后几何严格配对，非线性矫正空间不能冒充原图点坐标。", hero: false },
    { label: "没有文字的判断", value: "生产者可根据独立证据形成 no_text_detected，但未保存时仍不是可采纳的持久验真结果；调用方只有在完成、完整、充分及证据保存/字节/身份复验均成立后，才把它作为已验证的无字结论。内置证据主要限于近乎均匀图片。", hero: false },
    { label: "本机安装元数据", value: "本轮 inspect 回读 /root/localocr-runtimes/current → /root/localocr-runtimes/paddle-3.4.0-20260917；实际源码位于该版本 app，Python 3.12、localocr 0.7.0、Paddle 3.4.0、PaddleOCR 3.7.0、PaddleX 3.7.2、pypdfium2 5.11.0、FastAPI 0.139.0、uvicorn 0.50.0、httpx 0.28.1、psutil 7.2.2。只读取元数据，未导入模型。", hero: false },
    { label: "模型配置字节", value: "冻结源码 SHA-256=471a4216e880a95ab6bb4fbbb39d34b8a5a3bdb49caaa3fd21eee40554fb18e9；profile 文件=c8bb75868078f66ffa46cd5e75e8c4799f2708475e5f8527d71e08b118797073。实际模型指纹：OCR=db0365ca76890841dc1239b77a8e51e8b7feea1e72f6a9a591496b344f2125b7；VL=e57bafebef2dd975e7a588f3ba6fc6377c05cca999ae4cd1ee619d415bea5f7e；Structure=6be66ded72be6667f7f949ed8d3f01987c75169dc19254d6409e2f96b10ea74b。", hero: false },
    { label: "普通回归与波动", value: "9 月 17 日 07:39 UTC 候选验收：依赖、175 项普通测试（174 通过、1 跳过，41.814 秒）和 9 个禁用结果缓存的合成质量案例通过，输入/运行身份稳定，总计 325.768 秒。本轮读取 acceptance/acceptance.json、quality.json 与 unit.log，没有重新运行。9 月 3 日首次 RSS 恢复 ConnectionResetError 仍是历史异常，不声称已证明根因。", hero: false },
    { label: "实际结构样例", value: "保留 9 月 3 日采购表及原始输出供复核：structure / pp-structure-v3 读出 1 页、六列五条商品与合计 112,500.00 元，约 27 秒。9 月 17 日新增 9 个合成案例覆盖普通/旋转/小字/空白、两帧 TIFF、VL 图/PDF、结构表格与自动表格路由；不是同一旧采购表复跑，也不是现实文档准确率排行榜。", hero: false },
    { label: "样例不是无错证书", value: "旧采购表虽然 completed/complete，Markdown 仍漏 figure_title，原始 text_lines 把 PO 读成 P0，quality=unknown。9 月 17 日两页 VL 样例 CER=0.01333，关键字段齐全但把“请保留”读成“清保留”；其余通过阈值不能抹掉这处字符错误。", hero: false },
    { label: "样例输出字节", value: "原图 67,474 B，SHA-256=a4715280b4818eaad9d11361e77eb1698cb7c47dc06da66d97fbcae580938410；实际 Markdown 1,030 B，SHA-256=08bee52074af89a00b503d2f89e77ec8bc75fb3ff7e190e95c64c0f4341e86d3；正式 JSON 71,158 B，SHA-256=9166e6012c0e30e9e392367e4dfb08ee6a8c9290d8e07cfd3e4cedcb1d695527。", hero: false },
    { label: "服务现场的范围", value: "9 月 17 日 Windows E2E 回执绑定 3a4bf13：真实切换到 Paddle 3.4.0，回滚到保留的 3.3.1 冻结环境，再恢复新版本；首次普通 OCR 27.951 秒，复用同一已验输出 1.284 秒，均为 1/1 页。停止入口一度因错误 WslTimeoutSec=20 参数未执行，改用允许的 10 后释放、重启回读成功，最终 stopped_on_demand。本轮 9 月 18 日 13:20 UTC /health 拒绝连接，符合按需停止状态，不冒称在线或故障已根治。", hero: false }
  ],
  gaps: [
    "真实采购表样例已揭示具体输出缺口：figure_title 被过滤出正文，标题中的 O 被读为 0；JSON 的 text_lines 与 excluded_regions 保留了复核线索，不能把它缩成泛泛的“模型可能出错”。",
    "当前按需停止，下一次任务仍要现场启动并核对身份。来源已完成真实重启与释放验收，但本轮没有启动服务或推理；旧样例完成后不可达的历史不再代表缺少现行恢复证据。",
    "普通回归第一次出现一次 RSS 越界后的恢复 ConnectionResetError，聚焦与完整复验均通过；波动原因本轮未定，不宣称已根治或长期稳定。",
    "auto 不再按文件名分流；它依据实际逐页 OCR 质量和结构信号增强，仍不是保证理解所有版式。structure 继续必须显式选择，复杂表格和公式准确性仍需原图验证。",
    "模型置信度和整页质量不是逐字正确率。小字、浅色字、姓名、日期、金额、公式与表格对应关系仍需回到原图复核；结果文件的哈希只证明对应关系与字节一致。",
    "当前导出是 TXT、Markdown 和 JSON，不是直接生成可编辑 Word、Excel 或可搜索 PDF；后续编辑和排版由对应文档工具完成。",
    "版本化安装、激活和实机回滚已经验收；完整断网新机还需要事先保留 WSL、系统依赖、Python 包和权重，现有联网候选安装器不是一份全离线恢复包。",
    "本轮不进行私人材料批量扫描、跨模型重型基准或真实离线重装；这些结果不能由源码、单元测试或一个合成样例替代。"
  ]
});

export const localOcrProject = {
  usageEntry: "把图片、扫描 PDF 或文件夹拖到本机 LocalOCR 的 start.bat；在已接入 LocalOCR 的 AI 对话中也可指定原件和结果要求，由 ocr_smart.ps1 接住有界识别。",
  usageInputs: ["本次明确的图片、扫描 PDF 或文件夹", "只提文字，还是保留表格、公式、区域", "目录是否递归及关键字段"],
  order: 4,
  slug: "localocr",
  title: "LocalOCR",
  kicker: "从截图和扫描页取出文字，保留行列、坐标与没看清的地方",
  route: "/projects/localocr",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "本地提字、文档结构解析与可复核结果已经实现",
  cardStatusTone: "pass",
  ...localOcrSnapshot,
  searchAliases: ["LocalOCR", "本地文字识别", "图片提字", "扫描件转文字", "表格识别", "复杂文档解析", "OCR结果怎么看", "第4项目"],
  repositoryNote: "LocalOCR 是独立的公开本机工具，源码位于 wlyaaaaa/LocalOCR。模型推理由本机 Windows 与 WSL 中的环境完成，网站只展示产品、实际使用方式和最后一次核对的证据，不接收访客文件，也不是在线 OCR 服务。公开样例使用项目的合成材料，不代表私人文件或任意文档的识别效果。",
  summary: "LocalOCR 把截图、拍照页和扫描文件里的文字变成可检索、可复制的结果；需要表格、公式或版面关系时，也保留行列、阅读顺序和位置。普通截图先用文字识别，复杂版面再用专门模型。它不会替你解读合同含义，也不会因为输出为空就断言原图没有字。",
  why: "直接复制不了的文字需要识别，但只得到一大段文本常常丢掉金额所在列、脚注位置或多栏阅读顺序。这个工具把文字和原页面位置一起交回，并指出哪些页没处理完、哪些字还需要回看。",
  plainExample: "“把这几张扫描表格里的文字提出来，保留每一行对应的金额；看不清的地方标出来。”先处理实际扫描页，返回文字和位置；若文件本来就有可提取文本，则先用原生文档读取，不多跑一遍OCR。",
  result: "拿到可复制的文字和可对照原图的位置说明；选择表格或公式时还会保留它们的关系。工具会说明处理了哪些页、哪些字不确定，关键数字仍要回原图核对。需要程序处理时也有结构化结果文件。",
  readerStates: {
    pass: "处理完成时返回实际输出文件、按页文字、识别方式和质量说明；需要结构时保留表格、公式或区域信息，便于继续使用并对照原图。",
    problem: "字小、低对比、布局复杂或首轮结果不足时，自动模式可以在本机增强；仍读不清、只完成部分或模型失败就说明具体问题，初步文字与正式完成结果分开。",
    unavailable: "原件打不开、环境不可用、端口不是本服务或显卡资源冲突时，返回明确原因和现有任务位置，不输出假结果，不擅自上传云端，也不反复创建同一任务。"
  },
  dataSources: {
    "title": "它读哪些文件，交回什么",
    "intro": "只读取这次明确选中的图片、扫描 PDF 或文件夹；每个结果都能回到对应原件和页面，不会后台扫描私人目录。",
    "rows": [
      {
        "source": "截图和普通图片",
        "data": "PNG、JPG/JPEG、WebP、BMP、TIF/TIFF 中的文字像素，包括界面文字、纸张照片和中英文混排内容。",
        "result": "文字块、位置、顺序和识别分数；纯粹描述景物或颜色时可以直接看图，不必启动文字识别。"
      },
      {
        "source": "指定的 PDF 文件",
        "data": "先核对实际页数，再逐页把扫描部分转成可识别的图；已有可读文字的 PDF 优先直接读取。",
        "result": "按页交回文字和版面位置，关键数字仍要对照同一原页。"
      },
      {
        "source": "明确选定的文件夹",
        "data": "只处理支持的图片和 PDF，按请求决定是否递归子目录；每个文件分别选择识别路线，共享整次请求的期限。",
        "result": "逐文件输出与对应身份，不把一个目录变成长期资料库或持续同步任务。"
      },
      {
        "source": "表格、公式和版面明确的材料",
        "data": "只有明确要求保留行列、公式或区域时才选结构解析。",
        "result": "交回可读表格和结构化文件；识别到印章不等于证明真伪，公式文字也不等于推导正确。"
      }
    ],
    "note": "“全部处理留在本机”是可明确提出的要求。若同时需要场景理解和逐字抄写，AI 可以在获准的处理范围内分别看原图与读取 OCR 证据，再分开说明观察、文字、状态和冲突；LocalOCR 本身不调用外部视觉模型。"
  },
  productPrinciples: [
    {
      "title": "先按任务选工具，不让每张图都跑重模型",
      "detail": "只想知道照片里有什么时，直接看图通常足够；需要逐字文字、批量处理、表格、坐标或全本地执行时才用 LocalOCR。已经有文字层的数字文档先走原生读取，避免把清楚的文字重新变成有误差的图片识别。"
    },
    {
      "title": "普通页面先轻量读，困难页再加强",
      "detail": "按页面实际内容决定是否提高识别强度，只处理看不清的问题页；本人明确指定模型时保留该选择。要表格结构须另说清，不会被自动路线暗中替换。"
    },
    {
      "title": "保留原始识别，不把顺口的改写当成读到了",
      "detail": "原始文字、页码、坐标和分数是复核依据。AI 看原图后若发现某个浅色小字有误，应把更正与具体区域单独说明，不能覆盖原始 OCR 或声称引擎自动读对；无法判断就保留未知。"
    },
    {
      "title": "一份结果要同时说清做完没、读全没、可信到哪",
      "detail": "任务完成、页面覆盖、结果质量和有没有检测到文字是不同问题。空文本可能是图片无字，也可能是模型没读出来；只有相应独立证据成立才给出没有文字的窄结论。"
    },
    {
      "title": "重复请求先看旧结果，等待超时先找原任务",
      "detail": "同一文件和要求只有在旧结果完整且对应当前版本时才复用。窗口等待超时不表示后台已停；先查原任务再决定等、取消或重新处理。"
    },
    {
      "title": "识别任务不能把电脑一直占住",
      "detail": "需要显卡时使用现有资源协调；超时、取消或资源冲突只处理本次识别，不为了排队额外建立一套长期后台任务。"
    },
    {
      "title": "升级先验独立版本",
      "detail": "新版先在旁边试真实样例，再决定是否切换；旧版须仍能实际打开和识别，只有目录或一次健康响应不能证明可回退。"
    }
  ],
  galleryPresentation: {
    kicker: "同一张合成原图与一次真实运行",
    title: "看得见表格恢复，也看得见标题遗漏与错字",
    description: "第一张是项目合成采购表原图，第二张是 2026 年 9 月 3 日真实输出的可读排版。表格和合计未经手工补写，标题遗漏、PO 读成 P0 与质量未知保留；这不是新版本复跑或准确率宣传图。",
    prefetchAdjacentFull: false
  },
  gallery: [
    { src: "/media/localocr/sample-table-original.webp", alt: "合成采购表原图，六列五行商品，标题编号为 PO-2026-0712", categoryLabel: "合成输入 · 不是私人订单", caption: "项目原有的 900×600 合成采购表，包含标题、六列表格、五条商品和合计；展示图与 9 月 3 日推理原件解码像素一致，未用新合成测试替换这份历史证据。", proves: "说明这次识别实际收到的像素、文字和表格布局。", doesNotProve: "它本身是输入，不是识别成功或准确率证据。", originalSha256: "a4715280b4818eaad9d11361e77eb1698cb7c47dc06da66d97fbcae580938410", originalBytes: 67474, width: 900, height: 600, displayBytes: 24266, displaySha256: "f447631806fbe26406a963d2cf87942ad03e7893db6ced3bd0608c60a34d0c22", displayNote: "WebP（网页图像格式）无损显示副本；保持 900×600 尺寸，解码后的 RGBA（红绿蓝及透明度）像素与来源 PNG 逐字节相同。来源身份仍保留原 PNG 的 SHA-256 和字节数。" },
    { src: "/media/localocr/sample-table-output.webp", alt: "2026年9月3日 LocalOCR 实际表格输出，旁注标题遗漏及 O 被识别成 0", categoryLabel: "真实输出 · 附实际缺口", caption: "六列、五条商品和合计保留，但 Markdown 没有原图标题；原始 text_lines 把标题 PO 读成 P0。1/1 页处理完成，质量仍为 unknown，不是逐字无错。", proves: "这张合成表经过本机 pp-structure-v3 得到了当前展示的表格和合计；排版没有补写 OCR 漏掉的标题。", doesNotProve: "任意文档准确、标题完整、原始行无错或其他模型已验收。", originalSha256: "999d71b8bf29cbb11f4fad06a3fc45cd4c7336ffa0be0060615c61afa65a3ff1", originalBytes: 54785, width: 1080, height: 744, displayBytes: 20348, displaySha256: "966777c0a89a56a54a93c766418ca9060470daf7cef11be3d052497828cddd9a", displayNote: "WebP（网页图像格式）无损显示副本；保持 1080×744 尺寸，解码后的 RGBA（红绿蓝及透明度）像素与来源 PNG 逐字节相同。来源身份仍保留原 PNG 的 SHA-256 和字节数。" }
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
    {
      "title": "先判断是否真的需要识字",
      "detail": "系统检查输入是否已经有可直接读取的文字；只有图片或扫描部分才交给本地文字识别。"
    },
    {
      "title": "按内容选择识别",
      "detail": "普通图片先提字，复杂页面或明确结构需求使用相应本地路线，显式选择优先。"
    },
    {
      "title": "拿到内容和状态",
      "detail": "交回文字、结构文件、页码位置及覆盖和质量说明；超时先查原任务。"
    },
    {
      "title": "对照原件使用",
      "detail": "关键姓名、数字、公式和表格关系回看原图；识别不清或模型不可用时保留缺口，不把空结果判成无字。"
    }
  ],
  technicalOperatingFlow: [
    { title: "先把原件和目标说具体", detail: "指定本次文件或文件夹，说清只要文字，还是需要表格、公式、印章区域和坐标；需要严格本地处理时一并说明，目录递归单独选择。" },
    { title: "确认入口可用，而不是只看进程还在", detail: "正常调用入口读取本服务健康与活跃任务；无服务时使用现有启动入口，忙碌或身份不符时返回具体状态，不抢占别的程序端口。" },
    { title: "固定本次输入，再决定识别方式", detail: "规范路径并独立核对页/帧数，绑定输入、实际模型与运行身份；auto 先 OCR，再据逐页质量和结构信号判断，显式模型始终优先。" },
    { title: "先查能否复用，确有需要再推理", detail: "已有相同请求的正式结果时复验文件、大小、哈希与客观结果文件；不满足条件才执行。一个目录的所有文件共享本次期限，不按文件无限延长。" },
    { title: "按页提字、必要时本地增强", detail: "按页有界渲染与识别，auto 仅将问题页转本地 VL，并保留首轮文字/坐标；超时或中断可留下原子部分证据。显式结构需求单独执行，增强失败不能把初步输出提升为完整成功。" },
    { title: "同时交回内容和读懂它的说明", detail: "保存 TXT、Markdown、JSON 与客观状态文件，返回精确结果路径；人话摘要说明文字块、覆盖、质量、分数、增强和警告，不能替代原始文字。" },
    { title: "对照原图后再用于下一件事", detail: "核对姓名、数字、日期、公式与表格关系；需要后续写文书或做表格时把经复核结果交给对应工具，而不是让识别引擎顺带替人作事实判断。" }
  ],
  components: [
    { name: "Windows 入口与服务识别", responsibility: "接住拖入文件、自然语言调用和有界等待，区分不存在、忙碌和错误服务。", implementation: "start.bat、start.ps1、ocr_smart.ps1、ocr_once.ps1、start_server.ps1；固定本机 18665，18666 不是后备端口。" },
    { name: "输入分流与模型配置", responsibility: "分开文件枚举、自动路线、显式模型和困难结果增强。", implementation: "router.py、smart_router.py、difficulty.py、model_registry.py、model_profiles.json；由 service.py 执行实际增强。" },
    { name: "三类识别适配器", responsibility: "分别完成普通文字、复杂文档和完整结构解析，并统一输出字段。", implementation: "engines/ppocrv6.py、engines/vl.py、engines/structure.py；保留原始结果并补齐文档块和坐标，不把模型选择写死在入口。" },
    { name: "PDF 页面与坐标", responsibility: "把指定 PDF 的页面变成可识别图片，明确页尺寸、渲染比例与坐标所属空间。", implementation: "pdf_utils.py 与适配器独立核对真实页/帧数；iter_input_pages 默认 216 DPI、24M 像素上限，每次只保留一张临时渲染页。JSON 记录实际比例和尺寸，不混用原 PDF 点、渲染像素与非线性矫正空间。" },
    { name: "结果与客观状态", responsibility: "同时交付可读文件、程序结构及有证据约束的识别结论。", implementation: "outputs.py、objective_result.py；display_summary 只投影现有字段，正式结果按请求隔离。" },
    { name: "执行服务与任务复用", responsibility: "让 CLI/API 共享同一执行方式，检查缓存、活跃任务、原件变化与正式结果提交。", implementation: "service.py、job_registry.py、checkpoints.py、server.py；实际模型工件、冻结实现与运行库参与身份，失败的逐页证据与成功缓存分离，取消终态不可自动重试。" },
    { name: "监督执行与显卡协调", responsibility: "在同模型复用的同时保留期限、取消、内存和进程回收。", implementation: "runtime.py、gpu_broker.py、gpu_probe.py；管理本服务进程树，不把上限施加到整台电脑。" },
    { name: "只读观察与重建入口", responsibility: "让调用方知道阶段、进度与结果状态，并能按当前环境配置重建。", implementation: "observer.py 只投影运行状态；install_wsl.sh 创建锁定依赖和冻结 app 的候选，manage_runtime.py 提供 inspect/validate/activate/rollback。current/previous 分开，模型预下载需明确选择，不在安装末尾自动加载。" }
  ],
  usageExamples: [
    {
      "moduleSlug": "input-routing",
      "ask": "把这张截图里的文字复制出来，文件留在本机。",
      "effect": "直接指定原图和本地处理要求，普通提字先走轻量路线；返回原始文字与识别状态，不自动上传，也不为一个截图扫描整个目录。"
    },
    {
      "moduleSlug": "input-routing",
      "ask": "这份多栏文档很复杂，但我想明确使用某个模型。",
      "effect": "显式模型选择优先于自动路线；引擎与模型不匹配时直接说明，不静默改成另一个模型冒充完成。"
    },
    {
      "moduleSlug": "document-structure",
      "ask": "把采购表读成表格，保留型号、数量和金额对应关系。",
      "effect": "明确选择结构解析，保留行列、文字行、阅读顺序和区域位置；输出后按原图核对对应关系，不只交回一长串文字，也不直接宣称生成了 Excel。"
    },
    {
      "moduleSlug": "results-evidence",
      "ask": "这个空结果到底是没有字，还是没读出来？",
      "effect": "分别查看页面是否真的处理了、是否整页覆盖和模型有没有可靠地检测到文字；证据不够就说无法判断。"
    },
    {
      "moduleSlug": "results-evidence",
      "ask": "分数很高，可这个浅色型号看起来不对。",
      "effect": "定位原图上那一小块重新核对；更正另列，原始识别保留，高平均分不代替关键字符。"
    },
    {
      "moduleSlug": "jobs-cache",
      "ask": "刚才窗口等超时了，这份扫描件还在处理吗？",
      "effect": "先查返回的任务标识和活跃任务；正在跑就继续查或明确取消，已完成且结果有效就复用，不因窗口超时盲目重交。"
    },
    {
      "moduleSlug": "runtime-resources",
      "ask": "识别卡住了，但别把其他本地模型一起停掉。",
      "effect": "先定位本次任务，再使用精确取消或执行期限回收它自己的推理进程；资源冲突与服务问题分别说明，不结束未知程序。"
    },
    {
      "moduleSlug": "installation-recovery",
      "ask": "换电脑后，要怎样恢复这套本地文字识别？",
      "effect": "先核对可用的程序、模型文件和旧版恢复材料，在独立环境试样例后才切换；全离线新机还要额外准备安装材料。"
    }
  ],
  evidenceLayers: [
    { layer: "源码与配置", proves: "当前公开主分支实际包含的输入、三条模型路线、输出、任务和资源处理逻辑。", doesNotProve: "某台机器已装齐依赖、每个模型正在运行或任意图片识别准确。" },
    { layer: "普通单元回归", proves: "9 月 17 日普通回归 174 通过、1 跳过，覆盖分流、几何、结果与任务合同；本轮只读回执，没有重新执行。", doesNotProve: "真实显卡加载、模型准确率、长文档耗时和新机恢复效果。" },
    { layer: "依赖与健康现场", proves: "本轮 inspect 确认已选择的冻结代码、Paddle 3.4.0、依赖与模型指纹和接受回执相符；服务按需停止，在线状态不由安装存在推定。", doesNotProve: "所有登记模型均已加载，也不证明当前文件完成识别。" },
    { layer: "真实合成样例", proves: "9 月 17 日九个合成案例及 Windows 首次/缓存请求有真实结果，切换与回滚有独立身份回读；旧采购表原图和输出仍以原日期保留。", doesNotProve: "私人文档、不同布局和每一个关键字都正确；一个样例不是全模型基准。" },
    { layer: "文件与原件复核", proves: "结果对应本次输入、请求与模型，保存字节可核对；对照检查能确认被检查的具体区域。", doesNotProve: "未检查部分正确、原件事实真实、印章真实或外部机构认可。" }
  ],
  operationalEntrypoints: [
    { name: "日常本机入口", command: "E:\\Projects\\Tools\\LocalOCR\\ocr_smart.ps1 '<明确文件或目录>' -Engine auto", purpose: "正常先看服务与任务状态，再提交有界识别；需要结构时显式 -Engine structure，需要具体模型时指定 -Model。" },
    { name: "一次性命令行", command: "pwsh -NoProfile -File E:\\Projects\\Tools\\LocalOCR\\start.ps1 '<明确文件或目录>' --engine auto --timeout-sec 300", purpose: "拖拽/单次入口要求PowerShell 7.3+；与API共用OCRService和正式输出，退出时关闭自己的执行服务。" },
    { name: "只看服务状态", command: "GET http://127.0.0.1:18665/health", purpose: "核对本服务身份、active_jobs、驻留模型与显卡探测状态；active_jobs 缺失视为未知。" },
    { name: "查询或取消指定任务", command: "GET /jobs/<job_key> ; POST /jobs/<job_key>/cancel", purpose: "两条均使用本机 18665；先按返回标识定位，取消只针对明确任务，不能当成停止其他服务的入口。" },
    { name: "普通回归", command: "scripts/run_in_wsl.sh -m unittest discover -s tests -q", purpose: "验证非重型逻辑；需要跨模型真实集成时才单独评估 tests/run_tests.py --allow-heavy，不能把它当健康检查。" },
    { name: "重建环境", command: "wsl -d Ubuntu -e bash /mnt/e/Projects/Tools/LocalOCR/scripts/install_wsl.sh <unique-candidate-name>", purpose: "创建锁定依赖与固定源码的独立候选，不覆盖 current、不自动激活或预热。模型预下载与 validate --allow-heavy 需明确重型范围，通过后停止现有服务再切换；rollback 使用旧环境自己的已验证回执。" },
    { name: "按需释放显卡资源", command: "E:\\Projects\\Tools\\LocalOCR\\release_resources.ps1", purpose: "只有别的显卡任务确实需要资源时才释放；日常连续识别保留温热模型，避免反复冷启动。" }
  ],
  evolution: [
    {
      "date": "2026-07-12—2026-07-29",
      "title": "从能识别，到能看见任务怎样执行",
      "commit": "c8fa63a—ad5cad4",
      "result": "从拖入一张图取得文字，发展到能查看任务进度、服务是否忙，以及复杂页面需要怎样加强；出错不只剩一个空窗口。"
    },
    {
      "date": "2026-08-17—2026-08-27",
      "title": "从有文字，到知道是否读全读对",
      "commit": "8191be3—9c49193",
      "result": "开始分开说明处理完没有、页是否齐全和文字是否可信；表格、页码和位置也一起保留，不拿整齐排版代替内容正确。"
    },
    {
      "date": "2026-09-01—2026-09-17",
      "title": "从一次输出，到逐页复核和可回滚升级",
      "commit": "acc6d15—3a4bf13",
      "result": "重复识别先核对可复用结果，升级环境先试独立候选并保留旧版；重要字段仍可逐页回看，完整离线新机恢复另需材料。"
    }
  ],
  "readerBoundary": "识别结果能回原图核对，但不保证逐字正确。已有文字的数字文档先直接读取；需要显卡的识别方式若无法运行，会说明原因，不暗中改用另一种方式。空白结果和未处理完的页面仍保留不确定性。",
  "operatingChoices": {
    "title": "不同页面，使用不同识别方式",
    "intro": "不用根据文件名猜模型。先看页面真实内容和需要的结果，自动升级也只处理问题页。",
    "rows": [
      {
        "need": "截图、平面扫描和普通表单",
        "choice": "普通提字：PP-OCRv6_medium",
        "result": "把文字行和位置交回来，适合截图、平面扫描和表单。",
        "boundary": "默认不做可能拉坏清晰页面的形变矫正；模型支持不等于全部增强已开启。"
      },
      {
        "need": "公式、多栏、复杂表格和复杂PDF",
        "choice": "复杂文档：PaddleOCR-VL-1.6",
        "result": "帮助处理多栏、公式等普通提字不足的页面；自动路线只加强问题页。",
        "boundary": "文件名不决定升级，高模型置信度也不能替代关键文字回看。"
      },
      {
        "need": "明确要表格HTML、版面块、印章或区域",
        "choice": "明确要结构：PP-StructureV3＋PP-OCRv5",
        "result": "把表格、文字顺序和页面区域分开保留，方便按原图核对。",
        "boundary": "结构块存在不说明每个单元格都读对；结果仍绑定实际输入和页数。"
      },
      {
        "need": "Word、Excel或有文字层的PDF",
        "choice": "已有文字层时先直接读取文档",
        "result": "先取得 Word、Excel 或数字 PDF 本来就有的文字，只把其中的扫描图片交给识别。",
        "boundary": "文档理解与专业判断仍由对应任务承担。"
      }
    ]
  },
};

export const localOcrModules = [
  {
    slug: "input-routing", shortTitle: "输入与识别路线", title: "从指定原件到合适的本地识别方式",
    usageEntry: "在本机已接入 LocalOCR 的 AI 对话中指定原件，或用“日常本机入口” ocr_smart.ps1 传入明确路径。",
    usageInputs: ["图片、扫描 PDF 或目录", "递归范围", "想要文字、复杂版面还是指定模型"],
    productFlow: [
      {
        "title": "检查原件与可读内容",
        "detail": "系统核对文件类型、页数和实际内容；已有文字层先直接取用，扫描图才进入识别。"
      },
      {
        "title": "选择本地路线",
        "detail": "AI 核对实际文件与已登记模型，普通页面先轻量提字，复杂或显式结构需求按对应路线处理。"
      },
      {
        "title": "拿到可追溯结果",
        "detail": "交回实际用过的模型、文字及输出位置；文件不支持或本地模型不可用时说明原因，不暗中上传或全库扫描。"
      }
    ],
    searchAliases: ["截图提取文字", "扫描PDF怎么识别", "本地图片识字", "自动OCR怎么选模型", "只在本机处理图片", "文件夹批量OCR", "指定OCR模型"],
    searchProjection: { intents: ["指定一张图片提字", "处理一个扫描PDF", "批量读取明确文件夹", "选择本地模型"], entities: ["图片", "扫描PDF", "ocr_smart.ps1", "OCRService", "auto", "ppocrv6-medium", "paddleocr-vl-1.6"], relations: ["原生文字层先于OCR", "普通OCR低置信度转本地VL", "显式模型选择优先"], failureRecovery: ["端口身份错误停止", "active_jobs缺失保持未知", "增强失败保留partial", "引擎与模型冲突不改写"] },
    teaser: "明确读哪个文件、要文字还是结构；普通内容先提字，不够再本地增强。",
    status: "三条路线与统一执行已实现", statusTone: "pass",
    value: "我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。",
    why: "一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。",
    example: "我可以说：“把这份多栏 PDF 的文字读出来并保留版面，文件留在本机。”系统会固定这一个输入并选择合适路线；如果给的是文件夹，也只处理本次明确要求的范围。",
    result: "返回对应文件的结果路径、实际引擎与模型、选择原因，以及是否发生增强。遇到不支持的文件、模型冲突、活跃任务或服务身份不符，会说明原因，不交回来自另一条未知路线的结果。",
    readerStates: { pass: "输入范围与路线明确，按请求执行并返回实际模型和输出。", problem: "自动提字不足时可以本地增强；增强失败保留首轮初步证据，但不标完成。", unavailable: "原件不可读、模型冲突或服务不是 LocalOCR 时停止相应请求，不抢端口、不换云服务。" },
    decisionImpact: ["普通看图不强制 OCR，数字文档有文字层时优先原生读取。", "复杂程度取实际页内容与识别证据，不由文件名判断；只增强问题页，不把整份文档重跑重模型。", "显式模型优先；结构解析需要单独选择，不是自动增强的第三级。", "文件名或目录含中文、空格时仍用同一拖拽入口；它需要PowerShell 7.3+，旧Windows PowerShell 5.1不属于该入口的支持环境。入口传参已通过隔离检查，文字能否读全、读准仍需核对实际结果。"],
    problem: "防止范围不明的批处理、轻重模型误用、显式选择被改写，以及客户端调用脚本与真实服务行为不一致。",
    implementation: [
      "router.py 枚举支持的图片和 PDF；是否递归由 recursive 参数决定，不默认扩大目录范围。",
      "Smart Router v5 预路由让 auto 先 OCR；difficulty.py 结合逐页空结果、低置信度及表格/公式内容信号，service.py 只增强对应问题页。",
      "同一任务保留增强前文字与几何；显式模型不参加自动替换，Structure 不是自动流程的隐含第三层。",
      "model_registry.py 解析 profile（具体模型配置），核对引擎匹配；显式模型不被自动选择覆盖。",
      "start.bat使用pwsh，start.ps1声明PowerShell 7.3+；路径回调将Windows盘符转换为/mnt/<盘符>，Git固定start.bat为CRLF，避免中文批处理被异常解析。其后的localocr.cli继续共用OCRService、增强与输出合同，模型路线没有改变。",
      "ocr_smart.ps1 预览路线并验证服务健康，以 active_jobs 作为忙碌依据；缺字段为 readiness_unknown，不能当空闲。"
    ],
    flow: ["固定本次文件、目录递归范围与希望得到的结果。", "优先检查原生可读内容；需要图片文字证据时进入 LocalOCR。", "核对路径、类型、明确引擎与模型配置。", "普通提字或复杂文档路线执行，必要时根据首轮结果增强。", "交回实际路线与文件，不把预检建议当最终模型身份。"],
    concepts: [{ term: "auto（自动选择）", explanation: "按当前可解释规则选 ocr 或 vl；不是无条件选择最重模型，也不包含 structure。" }, { term: "explicit model（明确模型）", explanation: "用户明确指定某个配置时按它执行；冲突要说明，不能静默改写。" }, { term: "route（实际识别路线）", explanation: "记录最终引擎、原因、信号与增强过程，方便解释与复核。" }],
    boundaries: ["支持的是明确文件和目录，不是私人库后台扫描。", "仅需场景描述时由原生视觉处理；全本地要求下不向外部视觉服务发送像素。", "普通 OCR、VL 和 Structure 的适用范围不能互相冒充。"],
    failures: [{ condition: "输入不支持或不可读", response: "返回明确的输入或读取错误，不制造空白成功结果。" }, { condition: "显式引擎与模型不匹配", response: "拒绝该组合，让调用方修正配置；不私自换模型。" }, { condition: "本地增强失败", response: "保留首轮 partial（初步结果）与失败原因，整体仍为失败，不能写入成功缓存。" }, { condition: "端口是另一个服务", response: "报告 non-LocalOCR service，停止提交；不把 18666 当自动后备。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\router.py", role: "支持类型与输入枚举" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\smart_router.py", role: "自动与显式路线" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\difficulty.py", role: "困难度依据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "实际增强与统一执行" }, { path: "E:\\Projects\\Tools\\LocalOCR\\ocr_smart.ps1", role: "Windows 有界入口与服务识别" }],
    verification: ["2026-09-07，376a777的24项Windows调用回归通过，4.210秒；另经真实start.bat、pwsh与已确认wsl.exe替身验证中文空格路径完整传递，0.458秒。检查在模型执行前结束，没有重验OCR效果或服务在线。原CLI/API共用、显式选择和增强合同继续保留。", "模型注册、分流与调用脚本行为有独立单元测试；当前机器测试与运行证据见总览技术层。", "9 月 17 日禁用缓存的九例质量回执包含 auto_table，实际表格关键单元格通过；这个合成案例不证明任意版面都能正确选路。"],
    relation: "这个模块决定如何进入任务；表格与版面模块解释结构需求，结果与复核模块解释如何读返回值，任务与运行模块处理复用和故障。",
    readerStatus: "已有图片、扫描PDF和文件夹的本地识别入口；会按要求说明实际路线，具体文字仍以本次原件核对。"
  },
  {
    slug: "document-structure", shortTitle: "表格与版面", title: "把行列、公式与页面位置一起保留下来",
    usageEntry: "在 LocalOCR 请求中明确说“保留表格行列、公式或区域”，并指定原件。",
    usageInputs: ["有结构的图片或扫描 PDF", "需保留的列、公式、印章区域或页码"],
    productFlow: [
      {
        "title": "识别哪些关系不能丢",
        "detail": "系统从页面找出表头、行列、公式和区域，再选择能保留这些关系的识别路线。"
      },
      {
        "title": "逐页还原可见关系",
        "detail": "系统按实际模型解析页面，保存表格块、文字行、顺序和位置。"
      },
      {
        "title": "回到原页核对",
        "detail": "取得可读和结构文件后核对关键单元格；不把整齐排版当金额正确，也不宣称生成 Excel。"
      }
    ],
    searchAliases: ["采购表格识别", "扫描表格保留行列", "PDF多栏阅读顺序", "公式识别", "印章区域", "OCR坐标为什么对不上", "PP-StructureV3"],
    searchProjection: { intents: ["提取采购表行列", "读取多栏论文", "识别公式与印章区域", "核对PDF坐标"], entities: ["PP-StructureV3", "PP-OCRv5", "PaddleOCR-VL-1.6", "table HTML", "render_scale", "bbox", "polygon"], relations: ["structure显式选择", "PDF先渲染再识别", "原始文字行与结构块并存", "像素坐标不是PDF点坐标"], failureRecovery: ["结构丢失回原图核对", "公式错误保留原输出", "坐标按渲染尺寸匹配", "不把印章识别当鉴真"] },
    teaser: "提取文字之外，还要保留表格行列、阅读顺序、公式和原图位置。",
    status: "结构字段与解析路线已实现", statusTone: "mixed",
    value: "当一行文字必须和另一列数字对应时，只把字读出来还不够。结构解析保留表格、公式、区域和阅读顺序，让我能继续整理材料，并按同一页的图像位置核对每一处内容。",
    why: "采购表、双栏文档和公式页容易被普通提字打散。这个模块把结构作为明确结果需求：模型负责还原可见关系，原图负责最终复核，不把一段流畅文本当作表格已经准确恢复。",
    example: "我可以说：“把采购订单的商品、型号、数量、单价和金额按行列保留下来。”系统会检查列数、商品与数字对应关系和合计；识别出来的数字仍要回到原图核对，不能直接当成正确业务金额。",
    result: "拿到可阅读的表格、公式和页面位置，也有供程序处理的结构化文件；商品与金额关系可回原页核对。它不直接生成 Excel，也不能凭识别到印章就判断真假。",
    readerStates: { pass: "结构与文字一起返回，可以按页和区域核对。", problem: "行列、阅读顺序、公式或坐标有误时保留原始输出并回原图检查，不静默改写。", unavailable: "结构模型或输入不支持时返回明确失败；普通提字的结果不能冒充结构解析成功。" },
    decisionImpact: ["表格和版面必须明确提出，auto 不自动进入 structure。", "PDF 坐标属于实际渲染像素，按对应页的比例与尺寸核对；做过非线性矫正时不能伪称可以直接映射原图。", "图表识别当前关闭；印章区域识别不证明印章真伪。"],
    problem: "防止表格行列被拼成无关系的文本、公式信息被过度简化，以及把不同坐标空间混用导致复核指错区域。",
    implementation: [
      "pp-structure-v3 profile 使用 PP-StructureV3 + PP-OCRv5；当前 PaddleOCR 结构接口不能把普通 OCRv6 配置直接套入该路线。",
      "use_table_recognition、use_formula_recognition、use_seal_recognition、use_region_detection 与 format_block_content 已开启，use_chart_recognition=false。",
      "engines/structure.py 保留版面、表格 HTML、公式、印章、区域和原始 OCR 行，避免只保留展示文本而丢掉独立位置证据。",
      "engines/vl.py 为复杂 PDF 提供视觉语言解析；VL 与显式 Structure 是不同选择，不用一个模型名称覆盖所有文档场景。",
      "正常 iter_input_pages 采用 216 DPI 和 24M 像素上限逐页渲染并删除上一临时页，独立 input_page_count 验 PDF 页/TIFF 帧；旧显式物化函数默认 scale=2.0，不能当当前所有结果的固定比例。",
      "普通 OCR 对平面截图默认关闭文档形变矫正；VL 与 Structure 的文档配置仍开启，复核时应核对实际坐标所属图像空间。",
      "保留的 9 月 3 日采购表 figure_title 因 figure 标签进入 excluded_regions，Markdown 漏标题且 text_lines 把 PO 读成 P0；当前标签过滤代码仍有该条件，新的表格合成测试没有证明这张旧图已修复。"
    ],
    flow: ["说明需要表格、公式、印章区域或复杂版面，而不只说提字。", "选择 VL 或显式 Structure，核对实际 profile。", "PDF 逐页渲染，图片按其对应输入空间处理。", "保留结构块、原始文字行、顺序与位置，生成可读和结构化输出。", "按原页核对行列、公式、边界与坐标，不以表格看着整齐代替正确性。"],
    concepts: [{ term: "table HTML（表格结构标记）", explanation: "保存行列关系的模型输出，可供后续转换；格式存在不代表单元格内容正确。" }, { term: "reading order（阅读顺序）", explanation: "文档块应按什么顺序阅读；多栏和复杂布局下仍需核对。" }, { term: "rendered pixels（渲染像素）", explanation: "PDF 被转成图片后的坐标单位，与原 PDF 的点坐标不同。" }],
    boundaries: ["只有输出中实际存在的结构才可宣称提取成功，不能从模型能力标签猜结果。", "不保证恢复任意复杂表格，也不代替公式推导或印章鉴真。", "没有直接生成 Word、Excel 或可搜索 PDF 的现行导出入口。"],
    failures: [{ condition: "表格合并或阅读顺序错误", response: "保留原始结构与文字行，按原图校对；下游转换不得掩盖不确定性。" }, { condition: "框的位置对不上 PDF", response: "先核对页码、render_scale、渲染尺寸和矫正空间，不直接把像素框作为 PDF 点坐标。" }, { condition: "模型未加载或结构解析失败", response: "保留明确错误；若另选普通提字，应注明能力降级和本次实际输出。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\engines\\structure.py", role: "结构与原始文字保留" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\engines\\vl.py", role: "复杂文档路线" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\pdf_utils.py", role: "页面渲染与坐标" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\model_profiles.json", role: "实际结构选项" }, { path: "E:\\Projects\\Tools\\LocalOCR\\tests\\test_structure.py", role: "结构字段回归" }],
    verification: ["源码与配置已核对表格、公式、印章、区域开启而图表关闭的实际状态。", "test_structure.py 与相关输出测试验证字段、文字行和坐标保留，不代表真实模型对任意文档准确。", "9 月 3 日采购表保留六列五条商品和合计，却漏标题并有 PO/P0 错字；9 月 17 日结构表格的九个单元格及自动表格案例通过，两个不同样例不能相互改写结果。"],
    relation: "输入路线决定何时选择结构解析；本模块拥有结构含义，结果模块拥有输出身份与质量解释，后续文档排版由独立工具完成。",
    readerStatus: "已有保留表格、公式、区域和阅读顺序的解析功能；行列与关键数字仍需回到原页检查。"
  },
  {
    slug: "results-evidence", shortTitle: "结果与复核", title: "拿到文字后，怎样知道读全了、读对了没有",
    usageEntry: "拿到 LocalOCR 结果后，在同一 AI 任务中说出要核对的字段、页码或疑问。",
    usageInputs: ["这次结果文件或任务标识", "原图与关键字段"],
    productFlow: [
      {
        "title": "先读结果状态",
        "detail": "分别看执行完成、覆盖页数、识别质量和空结果依据。"
      },
      {
        "title": "对照原图定位",
        "detail": "按页和区域核对姓名、数字或浅色小字；必要更正独立记录。"
      },
      {
        "title": "留下已确认与仍不确定的字",
        "detail": "交回原始识别、对照原图后的更正和未确认项；文件完整性检查或高分都不能代替关键字符复核。"
      }
    ],
    searchAliases: ["OCR空结果有没有文字", "识别置信度高仍然错字", "OCR结果先看哪个文件", "浅色小字识别", "结果哈希校验", "display_summary"],
    searchProjection: { intents: ["读懂OCR输出", "判断空结果含义", "复核重要字符", "核对输出与原件"], entities: ["TXT", "Markdown", "JSON", "display_summary", "media.objective-result.v1", "coverage", "quality", "no_text_detected"], relations: ["执行覆盖质量相互独立", "空文本不等于无字", "高平均分不等于逐字正确", "原始结果与人工更正分开"], failureRecovery: ["indeterminate保留未知", "低置信度回原图", "缺失sidecar不接受无字结论", "源文件改变不提交旧结果"] },
    teaser: "先看人话状态，再看正文和原图；空文本、低分与处理失败不是同一回事。",
    status: "输出与客观状态合同已实现", statusTone: "pass",
    value: "我既需要复制出来的文字，也需要知道它来自哪一页、哪里可能漏了、什么还不能判断。这个结果层把可读内容与检查依据一起交回来，使一份空白文件或看似很高的分数不会替我作错误结论。",
    why: "模型可能没读出浅色小字，也可能只处理了部分页面；若最后只显示“成功”或“没有文字”，我会误用结果。这里先分清执行、覆盖、质量和文字检测，再说明各自证据，保留具体字符的复核责任。",
    example: "我可以说：“识别分数很高，但这个型号最后一位我还是看不清。”系统会指出对应页面和区域，让我回到原图复核；若需要更正，会把更正单独记录，不改写原始识别结果。",
    result: "可以选便于复制的纯文字、便于看表格的排版文件，或带页码位置的结构化文件；另有说明告诉我是否读全、哪里不确定。关键字仍须对照原图。",
    readerStates: { pass: "内容、位置和质量说明都可读取，正式文件与输入身份一致。", problem: "低置信度、部分覆盖或关键字分歧如实保留；摘要帮助定位，不能抹掉原始错误。", unavailable: "缺少有效结果文件或证据绑定时不能宣称已验证；普通空结果保持无法判断。" },
    decisionImpact: ["先看 display_summary（人话状态摘要），再读正文、坐标与客观文件。", "ok=true、空 TXT、空 blocks 或 cache_hit 都不能单独证明原图无字。", "原生视觉的场景解释和 OCR 的精确文字证据独立保留，冲突时回查原图。"],
    problem: "防止空结果被误报为无字、执行完成被误报为正确，以及手工更正覆盖了原始识别证据。",
    implementation: [
      "outputs.py 输出按页 TXT、保留结构的 Markdown、含位置/顺序/类型的 JSON；display_summary 是对既有客观字段的确定性投影，不修改结论。",
      "objective_result.py 分开 execution.status、coverage.status、quality.status、objective_outcome 与 failure；文字检测结论只在 text_detected、no_text_detected、indeterminate 中选择。",
      "生产者可以在独立检测证据成立时形成 no_text_detected；未保存时 evidence.verification_status 仍为 not_persisted。调用方只有在 completed、complete、sufficient、verified 及实际非空负向证据文件的字节和身份复验全部成立后，才采纳为已验证的持久结论或正式缓存；当前内置检测证据主要限于近乎均匀图片。",
      "客观文件使用 media.objective-result.v1，复核 schema、size_bytes、SHA-256、原件、请求、模型、配置与所有正式输出绑定；旧式缺文件结果不能补猜成已验证。",
      "输入快照、独立页/帧计数和实际运行身份约束结果提交；每页原子检查点只作部分证据。完整覆盖、无排除范围与独立负向证据全部成立才支持无字结论，图像均匀提示本身不够。",
      "若独立视觉复核更正某个关键区域，更正单列绑定原始 source hash（原件指纹）和 rect（区域），不得覆盖 OCR 原始文件或冒充引擎自动结果。"
    ],
    flow: ["先读摘要：执行到哪、覆盖怎样、是否低置信或增强。", "选择 TXT/Markdown/JSON 中适合下一步的文件。", "用页码与区域找到关键字，并核对同一原图。", "遇到空结果，检查独立负向证据，而不是只看文字长度。", "把确认、更正与未知分开，保留原始识别和实际输出路径。"],
    concepts: [{ term: "coverage（处理覆盖）", explanation: "本次实际页/帧是否全部处理，不是正文逐字完整。9 月 3 日采购表 1/1 页 complete 仍漏标题；9 月 17 日两页 VL 完整覆盖仍有“请/清”错字。" }, { term: "quality（结果质量）", explanation: "依据当前证据判断是否足以解释结果；不能简单当作逐字准确率。结构块未提供可用置信度时可以保持 unknown，即使原始文字行有高分。" }, { term: "indeterminate（无法确定）", explanation: "当前证据不能支持确定结论；失败、部分处理或普通空结果都不能伪装成无字。" }],
    boundaries: ["内容正确性与字节完整性不同；哈希通过不证明文字或原件事实正确。", "原始文字、结构化文件与另行复核更正保持独立。", "识别到印章或姓名不证明真实性或人物身份。"],
    failures: [{ condition: "空 TXT 或空 blocks", response: "检查执行、覆盖、质量和独立证据；条件不全就保持 indeterminate。" }, { condition: "模型平均分高但关键字有疑问", response: "回原图核对精确区域，不让平均值覆盖细小错误。" }, { condition: "客观文件缺失、哈希或身份不一致", response: "拒绝正式复用或无字结论，保留错误与原件定位。" }, { condition: "原件在处理过程中变化", response: "不提交旧结果；固定最终原件后再决定是否重新处理。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\outputs.py", role: "内容文件与人话摘要" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\objective_result.py", role: "客观结果与负向证据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "输入快照与提交检查" }, { path: "E:\\Projects\\Tools\\LocalOCR\\tests\\test_objective_result.py", role: "空结果、质量与证据回归" }, { path: "sample-table-actual.md", href: "/media/localocr/sample-table-actual.md", download: "sample-table-actual.md", role: "下载 2026 年 9 月 3 日真实 Markdown 原文件（UTF-8），保留表格与合计而未补写标题；这是历史可复核产物，不是当前版本复跑。" }, { path: "sample-table-actual.json", href: "/media/localocr/sample-table-actual.json", role: "9 月 3 日实际 JSON 原样副本，可核对 P0、被排除的标题及质量未知和页覆盖；与后来合成测试分开。" }],
    verification: ["源码审查确认人话摘要不改写客观结论，空结果条件与普通错误分开。", "合成单元测试覆盖负向证据、损坏、缺失、低置信度和实际字节绑定；这不能替代原图人工复核。", "重要数字和小字必须由真实样本逐区复看；没有复看的部分不能声称已经确认。"],
    relation: "这个模块解释结果能信到哪；任务复用模块据同一合同检查缓存，下游材料与文档工具只消费明确有效的内容。",
    readerStatus: "已有文字、结构、位置和质量说明的结果文件；空白或高分都不能直接证明读全、读对。"
  },
  {
    slug: "jobs-cache", shortTitle: "任务与复用", title: "不重复跑同一份材料，也不把旧结果套到新原件上",
    usageEntry: "在同一 LocalOCR 对话中提供刚才返回的任务标识，先问“现在进行到哪”；不要仅凭等待窗口超时重新提交。",
    usageInputs: ["原任务标识或原件", "本次识别要求", "继续等待还是取消的选择"],
    productFlow: [
      { title: "先找原任务", detail: "系统查询活跃状态和已保存结果，确认原件及请求是否仍相同。" },
      { title: "按真实状态处置", detail: "在跑则继续查询或精确取消；正式结果完整有效则直接复用。" },
      { title: "必要时才重试", detail: "中断或输入改变才重新执行，并区分部分证据、缓存和完整结果。" },
    ],
    searchAliases: ["OCR超时要不要重试", "重复扫描件不要重跑", "OCR任务进度", "缓存命中是什么意思", "OCR任务取消", "cache_hit", "active_localocr_task"],
    searchProjection: { intents: ["查询刚才的识别任务", "复用相同输入结果", "取消一个任务", "判断超时后是否重交"], entities: ["job_key", "job_registry.py", "cache_hit", "active_localocr_task", "partial", "output_files"], relations: ["输入内容和请求生成任务身份", "正式结果完整性决定复用", "客户端退出不等于服务端结束", "活动冲突不隐式排队"], failureRecovery: ["先查询原任务", "失效缓存重新判断", "增强失败不进成功缓存", "返回409时不要盲重提"] },
    teaser: "查询、取消、复验与结果复用有同一套身份；窗口超时不是重交信号。",
    status: "任务定位与结果复验已实现", statusTone: "pass",
    value: "同一份资料已经处理过时，能复用就不再等模型；正在处理时，我能知道它在哪一步，而不是反复按提交。这个模块把原件、请求和结果对在一起，让省时不会变成拿错旧文件。",
    why: "文件同名不代表内容相同，输出还在也不代表它完整。客户端窗口超时还可能留下正在执行的工作；如果不先定位任务就重试，会重复占用显卡，还可能混淆两次结果。",
    example: "我可以问：“刚才那份扫描件等超时了，现在要不要重新提交？”系统会先查原任务：仍在处理就继续等待或由我取消，已经完成就直接读取结果，确实中断才明确说明。它不会因为窗口等超时就重复跑一份。",
    result: "先得到原任务现在是处理中、完成还是中断；完整旧结果能核对时直接取回，否则才决定重新识别。部分页面证据可以帮助排查，但不是任何故障都能自动续跑。",
    readerStates: {
      "pass": "旧结果与这份文件和要求确实相同、文件完整时直接复用。",
      "problem": "等待窗口超时先查原任务，取消或中断后留下状态，不盲重交。",
      "unavailable": "任务仍占资源或连终态都无法确认时停止新提交，先核对现场。"
    },
    decisionImpact: ["使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。", "相同请求仍需复核输出，缓存命中只代表可复用。", "当前已有逐页原子检查点和部分证据读取；它们不等于任意长 PDF 自动断点续跑，更不能在用户取消后自动重试。"],
    problem: "防止重复执行、旧结果错配、坏缓存被接受，以及等待期限与执行期限混为一谈。",
    implementation: [
      "任务身份绑定源路径/内容、请求语义、逐页路由、具体 profile、实际权重、实现/运行库和输出目录；开发源码改变不自动改变已激活冻结版本。",
      "service.py 在正式写盘前后维护任务状态，复用时检查客观文件及所有输出的非空大小和 SHA-256，不只判断文件存在。",
      "正式文件名包含请求身份；无哈希同名 TXT/MD/JSON 仅供兼容展示，不能作为缓存或原件身份依据。",
      "server.py 暴露 /jobs/<job_key> 与指定 cancel 入口；active_localocr_task 返回 409，调用方应读取原任务，不隐式新建队列。",
      "增强或执行失败可以保存首轮文字与 checkpoints.py 的逐页部分证据，仍是 partial 而非完整成功缓存；取消响应标 terminal/non-retryable。",
      "observer.py 提供只读阶段、模型、页进度和耗时投影；这不是另一套任务调度，也不提供 OCR token 生成速率。",
      "OCRService 初始化调用 job_registry.recover_abandoned：复核遗留锁对应的进程身份，确认执行者已死亡才将 running 标成 failed / owner_exited 并清除占用；活任务不会仅因运行时间长被接管，不产生页级自动续跑。",
      "若失败终态本身无法写入，service.py 保留恢复锁并记录 terminal_persistence_failure；health 返回 not-ready / job_state_persistence_failed，后续请求以 503 拒绝，不能把状态未落盘的服务继续当正常执行器。"
    ],
    flow: ["从本次原件与请求确定任务身份。", "复验已有结果，完整有效时直接复用。", "已有活跃任务时返回明确定位，不并发重交。", "确需新执行时由同一服务负责处理与状态。", "超时或中断后先查原任务和文件，再决定等待、精确取消或有界重试。"],
    concepts: [{ term: "request identity（请求身份）", explanation: "输入、模型和请求参数的组合，防止同名文件或不同模型共享错误结果。" }, { term: "formal output（正式输出）", explanation: "本次请求完成并通过相应检查的结果路径；与兼容显示副本和 partial 初步证据不同。" }, { term: "observer（只读观察）", explanation: "让调用方看阶段、模型与时间，不替它创建或重新执行任务。" }],
    boundaries: ["客户端 timeout（等待超时）不证明服务端任务终止。", "不承诺永久任务档案或跨任意故障的自动续跑。", "write_outputs=false 不登记正式写盘任务与结果缓存，内存证据不能冒充已保存证据。"],
    failures: [{ condition: "HTTP 409 / active_localocr_task", response: "读取已返回的 job_key 和查询入口，不盲目重复提交。" }, { condition: "输出丢失、为空或指纹不匹配", response: "不接受缓存命中，保留原件与请求依据后重新判断执行。" }, { condition: "客户端 exit 124", response: "先回查服务端任务状态；不能仅凭退出码认定识别失败。" }, { condition: "增强失败但有首轮文字", response: "明确为 partial，不把这些文件提升为正式成功结果。" }, { condition: "服务崩溃遗留 running 与锁", response: "下次启动核对进程身份；已死亡的执行标 owner_exited 并解除占用，活执行保留，不自动重跑。" }, { condition: "任务终态无法写入", response: "保留恢复锁与原始/落盘错误，health 标不可继续接单；先修复实际存储问题，不以进程存在或盲重提掩盖。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\job_registry.py", role: "任务身份与缓存复验" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\service.py", role: "正式结果提交与初步证据" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\server.py", role: "查询和精确取消" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\observer.py", role: "只读观察" }],
    verification: ["任务、输出、观察和进程测试分别覆盖当前行为；普通测试不能证明真实长文档的恢复速度。", "重跑同一合成请求可验证复用，但不能据此推导任意私人原件准确率。", "现行源码含逐页检查点、取消终态和缓存工件身份合同；9 月 17 日 Windows 同源普通 OCR 的首次与 cache_hit 输出哈希一致，不代表私人长文档或自动逐页续跑已经验收。"],
    relation: "结果与复核模块定义什么才算有效结果，本模块决定是否复用；运行与资源模块负责活动执行和终止边界。",
    readerStatus: "已有任务定位和结果复验功能，可避免重复提交；旧结果只有仍对应同一原件与运行条件才复用。"
  },
  {
    slug: "runtime-resources", shortTitle: "运行与资源", title: "识别可以重，但等待、显存和进程必须可控",
    usageEntry: "在本机 LocalOCR 对话中点名要查询或取消的识别任务；服务状态可用项目“只看服务状态”入口查看。",
    usageInputs: ["任务标识", "具体超时、卡住或显卡冲突现象"],
    productFlow: [
      {
        "title": "先查任务实际状态",
        "detail": "系统确认本次识别是否仍在运行、是否占用显卡，以及服务是否真是 LocalOCR；只看进程名不够。"
      },
      {
        "title": "只管自己的资源",
        "detail": "同模型可复用进程；期限、取消或故障只处理本服务对应任务。"
      },
      {
        "title": "看清停止结果",
        "detail": "交回成功文件或精确冲突和清理状态；别的本地模型或听写任务不会因此被当成应停对象。"
      }
    ],
    searchAliases: ["OCR显卡冲突", "OCR卡住怎么停", "18665", "GPU租约", "OCR服务内存", "识别超时", "释放OCR显存"],
    searchProjection: { intents: ["查询识别服务是否可用", "终止明确卡住的识别任务", "解释显卡冲突", "释放模型资源"], entities: ["127.0.0.1:18665", "active_jobs", "LocalGpuBroker", "warm worker", "300秒", "7200秒", "30GB"], relations: ["同模型温热复用", "换模型回收进程", "整次请求共享期限", "租约丢失结束执行"], failureRecovery: ["409活动或资源冲突", "503协调器不可用", "504执行超期", "只取消指定job", "不停止其他服务"] },
    teaser: "本机服务、温热模型与显卡协调共同工作；出错时只处理本次明确任务。",
    status: "监督执行与回收已实现", statusTone: "pass",
    value: "我可以连续识别几份材料而不让模型每次冷启动，也可以在明确任务卡住时让它结束。显卡、内存和等待时间都有可解释的边界，不会因为一个识别请求顺手停掉其他本地工作。",
    why: "只限制窗口等待会留下后台推理，只看进程存在又不知道任务是否健康。这个运行层把服务、推理进程、显卡资格和任务期限分开管理，并把冲突、超期、取消与模型错误交回调用方。",
    example: "我可以说：“这次识别卡住了，取消它，但别影响听写。”系统只取消这个已确认任务。PCConfig允许OCR和ASR各一份跨类并行；已有同类OCR或Ollama占用时才报告冲突，不自动排队、不结束其他程序抢资源。",
    result: "识别正常就交回文件；卡住、取消或显卡冲突时给出准确任务和清理状态。服务在、显卡可用、模型已加载与这份文件已读完是四件不同事。",
    readerStates: {
      "pass": "取得资源并在期限内完成后交回实际文件，同一种模型可复用已加载进程。",
      "problem": "取消、超时或内存不足时只结束本次识别，留下具体原因。",
      "unavailable": "显卡或本机服务不可用时停这条路线，不暗中换云端或结束其他程序。"
    },
    decisionImpact: ["health.active_jobs 是忙碌事实源，缺失即未知。", "300 秒默认期限覆盖整次请求和加载，不是每页或每文件各给 300 秒。", "显卡未探测、模型未驻留和显卡不可用不能混写。", "当前机器调度策略允许一份OCR与一份ASR同时持有资格；两份OCR仍互斥，Ollama与这两类外部任务互斥。不据此推断任意模型都可并行或全都互斥，也不把源码策略冒充本轮真实并发验收。"],
    problem: "防止冷启动反复、模型抢资源、调用端退出后遗留推理，以及粗暴停止服务误伤其他任务。",
    implementation: [
      "server.py 默认只监听 127.0.0.1:18665；18666 已有其他产品用途，不是可猜测的后备端口。",
      "runtime.py 维护一个受监督 warm worker（温热推理进程）；同模型复用，模型切换时重建，协调层不直接导入 Paddle。",
      "gpu_broker.py在GPU探测、模型导入、加载和推理前向现有LocalGpuBroker申请localocr/localocr-cli租约，失去资格只结束相应执行。PCConfig 912b1af的broker.py把OCR与ASR分成两个固定家族，跨家族可并行，同家族及Ollama会话/请求与外部租约互斥；本轮没有启动模型重测该并发路径。",
      "DEFAULT_TIMEOUT_SEC=300，MAX_TIMEOUT_SEC=7200；DEFAULT_MEMORY_LIMIT_BYTES=30_000_000_000，限制本服务进程树而不是整机其他程序。",
      "执行监管处理明确取消、期限、进程异常和后代回收；服务重用不是新增持久队列，重复请求冲突不自动排队。",
      "HTTP 400 表示输入/配置错误，409 表示活跃任务或资源冲突，503 表示协调器或租约失败，504 表示执行期限；必须保留 detail 和任务定位。"
    ],
    flow: ["读取本服务身份与 active_jobs。", "确认本次任务及显卡资源资格。", "复用同模型进程或按需切换模型。", "按整次请求期限与进程树内存上限监管。", "成功交回结果；取消或故障结束对应执行并说明原因。"],
    concepts: [{ term: "lease（资源使用资格）", explanation: "现有协调器确认当前任务可使用显卡；不是永久占有权，丢失后必须停止。" }, { term: "execution deadline（执行期限）", explanation: "服务端真正执行的总时限，与 HTTP 传输和调用脚本等待不同。" }, { term: "loaded_models（驻留模型）", explanation: "当前进程已加载的模型，不等于所有登记模型都通过真实推理验收。" }],
    boundaries: ["当前服务是本机入口，不是带远程访问授权的公网产品。", "只对明确本次任务和本服务进程树执行回收。", "常规连续识别保留温热进程；确需给其他任务让资源时才释放，避免冷启动抖动。"],
    failures: [{ condition: "gpu_status=not_probed", response: "说明尚未进行显卡任务或探测，不解释成 CPU 降级或显卡故障。" }, { condition: "显卡冲突或协调器不可用", response: "返回 409/503 与实际原因，不绕过现有资源协调。" }, { condition: "执行期限、取消或内存越界", response: "结束相应推理进程及受管后代，保留明确错误，不把窗口退出当完成。" }, { condition: "服务健康缺 active_jobs", response: "保持 readiness_unknown，不按空闲继续提交。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\runtime.py", role: "温热进程、期限与回收" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\gpu_broker.py", role: "现有显卡协调" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\server.py", role: "本机服务与状态" }, { path: "E:\\Projects\\Tools\\LocalOCR\\release_resources.ps1", role: "按需资源释放" }],
    verification: ["普通生命周期与调用入口测试验证受控的取消、期限、回收和身份行为，不冒充真实极端显卡压力测试。", "当前按需服务状态与9月17日合成样例是不同证据；本轮只回读运行元数据和来源验收，技术总览分别列出。", "没有为网页验收重启电脑、停止其他模型或修改常驻配置。"],
    relation: "输入模块通过本机入口进入，任务模块提供明确定位；本模块控制真正执行与资源，结果质量仍回到结果复核模块。",
    readerStatus: "已有识别进程监管、取消与资源回收；资源冲突会明确返回，不靠结束其他工作来抢占显卡。"
  },
  {
    slug: "installation-recovery", shortTitle: "安装与恢复", title: "升级先验候选，出问题能回到真正验证过的旧版本",
    usageEntry: "在已接入 LocalOCR 的本机 AI 对话中明确提出升级或换机恢复，并说明现役版本与可用模型材料；这属于维护流程。",
    usageInputs: ["当前安装状态与候选版本", "可用模型、网络和旧版回执", "要验证的实际样例"],
    productFlow: [
      {
        "title": "保留可用现役",
        "detail": "先检查当前运行版、模型和已验旧版；没有理由不改现役。"
      },
      {
        "title": "在独立候选里试新版本",
        "detail": "先验依赖和真实合成样例；缺模型文件就停在候选，不覆盖现在可用的版本。"
      },
      {
        "title": "切换后做一次真实请求",
        "detail": "确认没有正在处理的文件后切换，再用 Windows 入口读回结果；失败只回到确实通过检查的旧版。"
      }
    ],
    searchAliases: ["LocalOCR怎么安装", "OCR换机恢复", "离线OCR模型", "WSL识别环境", "模型缓存恢复", "PaddleOCR版本", "本地识别环境坏了"],
    searchProjection: { intents: ["重建本地OCR环境", "核对当前模型与依赖", "判断能否离线使用", "验证安装后真实可用"], entities: ["WSL", "Ubuntu", "localocr-runtimes/current 与 previous", "pyproject.toml", "model_profiles.json", "install_wsl.sh", "download_models.py"], relations: ["源码依赖模型运行分层", "缓存可用不等于离线重建包", "隔离候选先验收再激活", "安装后需要真实样例"], failureRecovery: ["缺模型先定位配置", "依赖错误不盲升级", "不把API存活当已恢复", "未验证离线重建保持明确缺口"] },
    teaser: "把代码、依赖和模型身份作为同一运行版本管理；能回滚升级，不等于已有断网新机的一键恢复包。",
    status: "Paddle 3.4.0 新版本与 3.3.1 保留版本之间真实切换、回滚、恢复已验；全离线新机仍未验", statusTone: "mixed",
    value: "升级识别引擎不应顺手改坏正在工作的环境。我先得到一份独立候选，确认依赖、逻辑和实际合成识别都合格才切换；旧环境保留自己的代码和验收依据，失败时能检查后回退，而不是只留一个不知道能否运行的目录。",
    why: "能克隆源码不代表能加载模型，模型目录存在也不代表依赖兼容；一个可响应的服务甚至可能尚未运行过显卡任务。恢复必须回到真实文件与样例，不能用“安装成功”三个字代替可用结果。",
    example: "我说“试试新版本，但别把能用的旧版弄坏”：系统创建候选并给出质量与身份回执，通过后才停原服务切换；旧版有有效回执才能回滚。网络或模型不足时停在候选阶段，现役环境不被覆盖。",
    result: "知道当前哪一版实际能识别、上一版能否回退，以及新版本在真实样例上是否通过。已有切换和回退验收仍按原日期说明；全新离线电脑从零恢复还需要另备系统与模型文件。",
    readerStates: {
      "pass": "新版本在独立环境里通过实际样例，旧版也确实可回退后才切换，并用 Windows 入口再读一次文件。",
      "problem": "候选失败就保留现役版本；旧目录没有有效验证时不宣称可回滚。",
      "unavailable": "缺依赖、模型文件或显卡条件时停在相应步骤，源码目录存在不等于恢复成功。"
    },
    decisionImpact: ["开发源码与已激活 app 分离，不在 current 中 pip upgrade 或覆盖仍被旧版本引用的权重；需要改动就创建新候选。", "模型全部预热是重型动作，不是普通健康检查。", "完全离线恢复需要提前保留完整工件；当前脚本本身要联网。"],
    problem: "防止把源码、依赖、模型缓存、服务在线和实际识别合并成一个失真的恢复结论。",
    implementation: [
      "pyproject.toml 为 localocr 0.7.0，Python >=3.10；GPU 依赖允许 >=3.3.1,<3.5，而当前锁定和实装为 Paddle 3.4.0/cu129、PaddleOCR 3.7.0、PaddleX 3.7.2，声明和安装分别核对。",
      "install_wsl.sh 创建 /root/localocr-runtimes/<unique-candidate>，按运行锁文件装依赖并固定 app 源码；Python safe-path 与该版本 PYTHONPATH 隔离开发目录，数据 cwd 和输出位置仍保留原项目。",
      "安装不加载 GPU 模型也不自动激活。缺模型时明确 download_models.py --allow-heavy，再 validate --allow-heavy 分别验依赖、逻辑和禁用缓存的合成质量；任何源码/依赖/权重变化使验收失效。",
      "权重不重复复制到每个 venv，profile 的实际 artifact_paths 参与指纹。新权重独立版本目录，不覆盖仍被 current/previous 引用的文件；模型缓存存在、成功加载和实际识别分开。",
      "manage_runtime.py inspect 返回真实代码和解释器；activate/rollback 在服务停止且接收方自己的回执仍匹配时切换 current/previous 原子链接。Windows 入口仍为 PowerShell 7.3+ 和同一有界 wrapper，不由旧可编辑开发安装冒充现役版本。",
      "当前没有能由本轮证据证明的完整离线重建包，也没有把所有 Python 依赖、WSL 系统和模型权重打成已验收的单个恢复工件。"
    ],
    flow: ["先 inspect 当前与 previous、实际代码/依赖/模型，不按最新修改时间猜版本。", "确需升级时创建唯一候选，保留现役环境与原件，不向 current 原地安装。", "按需要准备独立权重，分别验证依赖、普通测试和真实合成质量；缺工件就停在候选。", "无在途任务后停止自己的服务，验当前候选回执再原子切换；真实 Windows 请求和缓存结果另外核对。", "需要回滚则由旧版自身验收依据批准切换，再核对实际运行；没有证据的旧目录不能当恢复保证。"],
    concepts: [{ term: "venv（Python 独立环境）", explanation: "隔离项目依赖的现有运行目录，不是模型权重的替代品。" }, { term: "model cache（模型缓存）", explanation: "本机保存的模型文件；存在性、可加载与识别效果是三层不同证据。" }, { term: "smoke test（小样例运行检查）", explanation: "让指定文件经真实入口走到结果，验证一条具体路线；不是全面准确率基准。" }],
    boundaries: ["不因为网站内容建设就运行 install_wsl.sh 或重型全模型预热。", "已缓存模型的本地推理不等于断网新机可以从零安装。", "恢复版本以项目配置与兼容证据为准，不无依据永久钉死其他机器配置。"],
    failures: [{ condition: "Python 包或模型配置不兼容", response: "保留实际版本与异常，定位对应依赖/适配器，不盲目批量升级。" }, { condition: "模型缓存缺失", response: "按已选模型定位所需工件；取得模型与是否运行重型预热分开判断。" }, { condition: "服务在线但模型任务没跑通", response: "仅报告服务可达，继续把模型路线标成未验收。" }, { condition: "只有源码却要求完全离线恢复", response: "明确还缺依赖、WSL 和模型工件，不虚构已存在的恢复包。" }],
    sources: [{ path: "E:\\Projects\\Tools\\LocalOCR\\pyproject.toml", role: "当前依赖声明" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\install_wsl.sh", role: "联网安装路径" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\download_models.py", role: "显式重型预热" }, { path: "E:\\Projects\\Tools\\LocalOCR\\scripts\\run_in_wsl.sh", role: "WSL 运行入口" }, { path: "E:\\Projects\\Tools\\LocalOCR\\localocr\\model_profiles.json", role: "具体模型与选项" },
      {
        "path": "E:\\Projects\\Tools\\LocalOCR\\scripts\\manage_runtime.py",
        "role": "真实解释器/源码身份与 validate、activate、rollback 入口"
      },
      {
        "path": "E:\\Projects\\Tools\\LocalOCR\\docs\\UPGRADING.md",
        "role": "独立候选、验收、原子激活与由旧版本自证的回滚合同"
      },],
    verification: ["9 月 17 日冻结环境验收 174 普通通过/1 跳过、九个合成质量案例全部满足各自门槛；VL 两页案例仍有 1.33% 字符错误，质量通过不等于零错。", "windows-end-to-end.json 绑定 3a4bf13，真实 Paddle 3.4.0→3.3.1→3.4.0 切换及代码身份、普通 OCR 首次 27.951 秒/缓存 1.284 秒、停止和重启通过；最终按需停止。本轮只读这些回执与当前元数据。", "当前 acceptance/quality/Windows-E2E 回执 SHA-256 分别为 4204f7d2291f205c799dfb6fc6a016cdfb06c2b365a1eeff682bec823ea7b757、a34aef982c321e28e951afa9d0efea815632f4d1050018d08e635332c3c88953、55156bed06e712ad3c87d3f1c99241046e4341204c057c3c1f55199cabf98d62；它们不证明干净断网新机或任意真实文档质量。"],
    relation: "本模块恢复可执行环境；输入路线决定实际任务，运行层管理资源，最终仍由输出与原图复核证明用户拿到了什么。",
    readerStatus: "新旧识别环境之间的实际切换、回退和恢复已验收；完全离线的新电脑安装仍未验证。"
  }
];

export const project = localOcrProject;
export const modules = localOcrModules;
