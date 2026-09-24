import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以继续制作", "需要修正", "当前不可用"];
const sourceCommit = "b7d33e5f735bfd46fca241b5a3f33559f4068604";

const documentMaterialsSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T21:12:47.825Z",
  label: "电子阅读采用彩色层级，打印才另验灰度；原有生成、签名、递送与恢复证据分开保留",
  boundary: "此次只核对9月18日已发布的媒介设计规则，没有新制作材料或重跑历史回归。本页没有读取真实事项正文、原件载荷、签名图或个人结果；实际事项数量与外部递送状态保持 Unknown（未知），未读取不等于数量为 0。公开安全的产品状态、已核实数量、路径类别、组件、哈希机制、命令、测试、失败和恢复事实正常展示，只逐值省略具体命中 L3+ 或可复用秘密的载荷。",
  metrics: [
    { label: "正式成品", value: "3 类" },
    { label: "虚构验收", value: "1 页 · 10 文件" },
    { label: "真实事项数量", value: "Unknown（未知）" },
    { label: "本轮外部递送", value: "未执行" }
  ],
  facts: [
    { label: "当前产品结果", value: "当前可生成 3 类正式成品：可编辑 DOCX、同源 PDF 和自包含附件包。完全虚构链已验收 1 页与 10 文件包；本轮未读取真实事项，也未执行外部递送，不能据此判断现实事项或递送总数。" },
    { label: "什么时候使用", value: "已经有明确目标、接收对象和必要原件，需要形成合同、说明、申请、通知、回复、售后材料或附件包时进入；只改单文件、只找原件或持续维护工作交付时直接分流。" },
    { label: "当前本地能力", value: "严格输入经过 plan、build、verify 后生成 3 类同源成品：DOCX、PDF、附件包和对应逐页审计；当前通用 CLI 只自动推进 produced（已生成）、signed（本人已签）与 ready_for_delivery（已具备递送条件），始终 delivered（已递送）=false。" },
    { label: "能直接辨认的交付文件", value: "通用文书按用途输出中文名，例如 正式说明.docx/PDF、合同协议.docx/PDF；附件使用 附件01_标题.扩展名，保留中文并替换 Windows 禁用字符，标题片段最长 80 字符。原件名称和字节不被改写。" },
    { label: "9月7日增量验证（保留历史）", value: "b7d33e5 的通用文书实现与 32 项合成回归已核对；旧 2.0.1 全仓、隔离 wheel、1 页/10 文件示例仍保留 2026-09-01 观察时间。本轮没有生成真实材料或执行外部递送。", hero: false },
    { label: "本人背景与事实归属", value: "相关共同背景按需取自个人理解库，可靠更正在当前任务回写；文书采用的字段仍绑定本次明确输入，父库更正不追改已签署、已递送的版本或历史证据。" },
    { label: "当前完整性", value: "v3 release 封存规范化输入、文档、附件、结构审计、逐页彩色/灰度渲染和所需签名快照；精确文件集合复制到空目录后仍可独立 verify。" },
    { label: "现实状态", value: "已生成、本人已签、已具备递送条件、已递送、已收件、已处理必须分别回读；对方签回是另一条独立事实，前一步不能自动推出后一步。" },
    { label: "实现版本与历史验收", value: "2.0.1实现与b7d33e5的32 项通过的通用文书回归保留9月7日观察；526项全仓、6项环境跳过、101个子测试与Ruff仍是9月1日基线。本轮只读的f0a3c283207267ca584fd6fcd2ffbb67fac47fe2改变媒介设计要求，不把这些历史测试重新认证为当前全仓结果。", hero: false },
    { label: "安装后虚构验收", value: "隔离 wheel 的两个控制台入口均真实携带 Word 导出资源，并用 Microsoft Word + Poppler 完成完全虚构的 plan → build → verify；1/1 页彩色和灰度审计通过，材料包状态为已具备递送条件，但没有发生递送。" }
  ],
  gaps: [
    "本轮没有读取真实个人材料、真实签名或现实回执，也没有执行真实制作与递送 E2E；合成结果不能证明任一真实事项当前可完成。",
    "facts[].source_note 仍是可选说明：当前可以固定整包输入，但不能机械证明每条事实分别来自哪份原件、本人陈述或其他依据。",
    "自动化能核对字段、结构、正文存在、页码、彩色/灰度页面、附件与哈希；DOCX 会匹配签名资产的精确哈希，PDF 只要求图像对象计数至少为 1，不能证明该对象就是签名、位置正确或最终可见。没有绑定 AI 或人工整篇语义审阅回执，也不能证明事实主线、语气和请求事项已经完整审过。",
    "通用 CLI 没有实现 delivered、received、handled 或 counterparty_signed_returned；这些只由当前事项和现实来源推进。",
    "签名是规范图片资产与 SHA-256 绑定，不是证书签名、可信时间戳或对方同意证明；manifest digest 也是内容摘要，不是数字签名。",
    "v3 release 可以完整复制到空目录后独立复验，但没有自动备份、后台恢复或可续传 mirror；2.0.0 的 v2 release 只按其历史实际携带内容验证并返回 non-self-contained 限制。"
  ]
});

const documentMaterialsProject = {
  order: 6,
  slug: "document-materials",
  usageEntry: "直接说明要做合同、说明、申请、通知或材料包，并给必要事实与原件；只改一个 Word/PDF 时直接处理该文件。",
  usageInputs: ["当前事项目标、接收对象和用途", "本次已有或新提供的必要原件", "本人已知事实及输出、签名或递送要求"],
  title: "文书和材料制作",
  route: "/projects/document-materials",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "2.0.1 的虚构 DOCX/PDF、逐页审计和自包含材料包已验；真实材料与外部状态按事项单独回读",
  cardStatusTone: "mixed",
  ...documentMaterialsSnapshot,
  kicker: "把原件和要求做成可以实际使用的材料",
  searchAliases: [
    "文书和材料制作",
    "把原件整理成正式文书",
    "制作可编辑合同和PDF",
    "售后申请和附件包",
    "文书生成签名递送状态",
    "对方签回哪个版本",
    "材料制作中断后继续"
  ],
  repositoryNote: "实现位于 PRIVATE（私有）仓库。本公开页保留版本、命令语义、文件结构、状态、失败、测试和完全虚构样张；不提供匿名源码跳转，也不公开真实个人载荷或内部维护入口。",
  summary: "已有事情经过、必要原件和接收要求时，把它们整理成合同、说明、申请、通知、回复或附件包，同时给出可继续编辑的 Word 和对应 PDF。内容、附件、版面和签名都要核对；电子阅读按需要用彩色层级，打印时再验灰度。文件做好、本人签好、实际送出和对方处理分别记录，不把电脑上的成品当成现实进展。 只改一个 Word 或 PDF 时直接处理该文件，不为一次修改建立完整材料包。",
  why: "同一事项往往同时存在原始记录、旧草稿、核对后的成品、签名版、递送版、回执和对方返回版本。只按文件名继续会用错版本；把“文件生成成功”写成现实进展，又会造成漏签、重复递送或错误判断。这个项目把原件、成品、完整性证据和现实步骤拆开，发生中断时仍能从最近一次核对状态继续。",
  plainExample: "我可以说：“维修服务没有按约完成，请把购买记录、沟通事实和退款要求整理成可编辑申请、PDF 和附件清单；不确定的地方先列出来。”项目会先核对原件和冲突，再交给我一份可继续修改的文书、一份同内容 PDF 和附件清单。它会说明材料是否需要签名、现在能否递送；没有真实发送和收件证据时，不会说对方已经收到。",
  result: "我会得到可继续编辑的 DOCX、同一内容版本的 PDF、核对过的附件与自包含材料包，以及当前精确状态、下一步和恢复点。若原件、内容、签名、版面或现实回读不足，我得到的是保留下来的旧版本、具体失败位置、真正未知和一个需要决定的问题，而不是一份看似完整但无法使用的成品。",
  readerStates: {
    "pass": "本次事项、必要原件和接收要求核对后，用同一内容生成可编辑版、PDF 与附件；正文和页面逐项检查。签名最终是否清楚可见仍看实际页面，不让自动检查越级保证。",
    "problem": "原件冲突、日期金额不清、附件缺失、签名不符或某页排版失败时保留上次可用版本和具体问题；文件准备好也不等于已经递送。",
    "unavailable": "某份原件、制作或逐页查看工具暂不可用时只暂停相关步骤，保留已核对的内容、旧成品和继续位置，不从旧草稿猜事实。"
  },
  stateLabels,
  methodCanvas: {
    "kicker": "文书怎样从原件走到可递送材料",
    "headline": "固定当前事项，做成同内容文件，再逐页核对现实进展",
    "description": "文件制作和现实递送分开。项目能核对本地成品是什么、附件是否齐；发送、收到、处理或对方签回，仍要各自有现实证据。",
    "steps": [
      {
        "actor": "先分流",
        "title": "这次真的需要正式材料包吗",
        "detail": "只改单个 Word 或 PDF 就直接编辑；只找原件走材料查找，持续工作交付走工作项目。"
      },
      {
        "actor": "固定事项",
        "title": "明确要给谁、为了解决什么",
        "detail": "核对目标、接收对象、期限、已有版本和下一步，不让别的事项或旧草稿混进来。"
      },
      {
        "actor": "核对原件",
        "title": "事实与真正未知分开",
        "detail": "只取必要的购买、沟通等材料；日期、金额或说法冲突时先列出，不靠模板补猜。"
      },
      {
        "actor": "决定成品",
        "title": "先定内容、附件和签名要求",
        "detail": "确认要一份怎样的文书、交付给谁，电子阅读还是打印，以及本人是否需要签名。"
      },
      {
        "actor": "同源生成",
        "title": "一次形成可编辑版与固定版",
        "detail": "Word 与 PDF 使用同一份确认内容，附件按序放入并再次核对；新版本不覆盖旧成品。"
      },
      {
        "actor": "逐页检查",
        "title": "内容、页面和签名各自过关",
        "detail": "重读正文，查看页码、裁切、颜色或打印效果；有签名时看最终页面是否真的清楚可见。"
      },
      {
        "actor": "交付前冻结",
        "title": "形成能带走和重新核对的包",
        "detail": "文书、附件和检查材料齐全才标为可递送；少一件或多混进一件就不放行。"
      },
      {
        "actor": "现实回读",
        "title": "送出、收到和处理分别证明",
        "detail": "“可递送”还没有送出。发送、对方收件、处理与签回各看对应记录；中断从已核对版本继续。"
      }
    ],
    "columnsAriaLabel": "本人、文书制作项目与现实接收方的责任边界",
    "columns": [
      {
        "title": "本人提供与决定",
        "note": "目标、原件和现实授权",
        "items": [
          "说明事项、接收对象和必要材料",
          "确认真正未定的事实与是否需要签名",
          "决定是否递送、撤回或联系外部对象"
        ]
      },
      {
        "title": "项目负责",
        "note": "同源成品与可恢复版本",
        "items": [
          "用同一内容生成 Word、PDF 与附件包",
          "逐页检查文字、排版和签名可见性",
          "保留明确版本、失败位置及下一步"
        ]
      },
      {
        "title": "外部结果另核对",
        "note": "文件离开电脑之后",
        "items": [
          "发送记录只证明已经送出",
          "对方或平台确认才证明收到",
          "处理结果与对方签回还需各自证据"
        ]
      }
    ]
  },
  productPrinciples: [
    {
      "title": "已有合适入口就不绕路",
      "detail": "只改单文件、只找原件或处理持续工作资料，各有现成入口；这里承接真正需要正式文书与附件包的事项。"
    },
    {
      "title": "整包固定不等于每句话都有来源",
      "detail": "输入和附件能作为同一版保存，但目前仍不能自动证明每条事实都逐一来自哪份原件；重要说法要实际核对。"
    },
    {
      "title": "事实、未知和本人决定分开",
      "detail": "原件互相冲突先说明，文字通顺不能让推测或尚未决定的请求变成已确认事实。"
    },
    {
      "title": "电子版与打印版共用内容",
      "detail": "Word、PDF 和附件的意思相同；屏幕阅读需要清楚的彩色层级，确实要打印时再检查纸面与灰度，不强制每次做两版。"
    },
    {
      "title": "逐页查看是交付步骤",
      "detail": "PDF 能打开，不代表正文、页码、裁切和签名都可用；最终签名位置与清晰度要看实际页面。"
    },
    {
      "title": "自动检查不替代整篇审阅",
      "detail": "机器可以发现缺文件、字段或页面问题，不能保证整篇事实主线、语气和请求事项已审好。"
    },
    {
      "title": "本地签名只属于这一版本",
      "detail": "一张签名图不等于电子证书、对方签名、可信时间或外部接收。"
    },
    {
      "title": "可递送还没有递送",
      "detail": "接收对象、渠道和文件固定后才能说材料已具备递送条件；真正送出要另有动作证据。"
    },
    {
      "title": "现实进展逐级确认",
      "detail": "送出、对方收到、实际处理与对方签回各有自己的来源，不能凭前一步推下一步。"
    },
    {
      "title": "材料包可复制核对，但没有自动备份",
      "detail": "完整包能带到另一处重新验真；目前没有后台备份或可续传镜像，不把复制成功写成灾备完成。"
    }
  ],
  gallery: [
    {
      src: "/media/document-materials/fictional-after-sales-page.webp",
      alt: "完全虚构的售后处理与退款申请单页生成演示",
      caption: "完全虚构，仅作生成与排版演示：2.0.1 通过 Microsoft Word 生成同源 DOCX/PDF，并由 Poppler 渲染后完成 1/1 页彩色与灰度检查。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明当前通用管线曾真实生成可读的一页正式材料，页码、正文和页面边缘验收通过。",
      doesNotProve: "不证明任何真实个人事项、真实签名、全部材料类型、外部递送或处理结果。",
      observedAt: "2026-09-01",
      sourceCommit: "3ab7fb45718a98bd8e0ae1e0dee14b5c31cf22bc"
    }
  ],
  responsibilities: [
    "从这次事项与必要原件形成可执行的文书制作方案。",
    "从同一份确认内容生成可编辑 Word、对应 PDF 与附件包。",
    "按实际要求分开无需签名、待本人签名、已签和可递送版本。",
    "重读正文并逐页检查可读性、裁切、页码和最终签名可见性；自动检查能证明的范围如实说明。",
    "把通过检查的文件与附件固定成可带走、可再次核对的版本，不覆盖旧版。",
    "把已生成、已签、可递送、已送出、已收到、已处理和对方签回分别报告。",
    "中断后先核对最近可用的包与现实记录，再从准确位置继续。"
  ],
  exclusions: [
    "单文件编辑、只找原件和持续工作交付仍用各自入口，不为一次修改建整包。",
    "不靠旧路径、模糊文件名或程序日志猜当事事实与现实进展。",
    "代码通过测试、文件生成或电脑里有签名图片，都不等于已递送、收到或处理。",
    "对方签回不等于本人已签、款项已付或事项已解决。",
    "不自动发送、付款、撤回或联系外部对象，这些动作按具体授权处理。",
    "公开页不展示私人原件、签名图、回执正文或秘密值；可公开的产品状态和技术边界照常说明。",
    "不建立中央材料数据库、后台同步、服务队列或提醒中心。",
    "文书项目负责成品制作，工作或其他领域仍负责自己的业务判断。"
  ],
  glossary: [
    { term: "Current matter（当前事项）", meaning: "围绕一个明确目标保存当前原件、已确认事实、未知、决定、状态、下一步和恢复点的可读记录。" },
    { term: "Immutable build（不可覆盖构建）", meaning: "由一个 build ID 固定的输入、DOCX/PDF、附件、审计和 manifest；同名构建不会被覆盖。" },
    { term: "ready_for_delivery（已具备递送条件）", meaning: "递送版本、对象、渠道、附件和指纹已锁定；它明确不表示递送动作发生。" },
    { term: "Self-contained release（自包含材料包）", meaning: "离开原 build 目录仍带齐输入、成品、附件、审计、逐页图和所需签名快照，可在空目录复制后独立核对。" },
    { term: "Manifest digest（清单内容摘要）", meaning: "对清单内容计算的 SHA-256，用于发现意外变化；它不是数字签名或恶意篡改防护。" },
    { term: "Page read-back（逐页读回）", meaning: "把 PDF 每页渲染为彩色和灰度图，检查页面数、墨迹、边缘、页码并把每页哈希写回审计。" },
    { term: "counterparty_signed_returned（对方签回）", meaning: "对方返回的完整签署版本及来源记录；它与本人签名、收件和处理状态相互独立。" },
    { term: "Legacy v2（历史 v2）", meaning: "2.0.0 形成的旧 release；新工具继续核对它实际携带的文件，但明确说明它没有 v3 自包含闭包。" }
  ],
  operatingFlow: [{"title": "固定这一次事项", "detail": "先判断是否只改单文件，再核对目的、接收对象、事实、原件、期限和需要本人决定的空白。"}, {"title": "同源制作与逐页核对", "detail": "确认内容后生成可编辑 Word、对应 PDF 和必要附件，按电子阅读或打印用途逐页看版面与签名。"}, {"title": "交付可递送的版本", "detail": "文件和附件齐全才冻结自包含材料包；生成、本人已签与可以递送是不同状态。"}, {"title": "现实结果另行回读", "detail": "递送、收件、处理和对方签回各要实际依据；中断从已核对版本继续，不把电脑成品说成对方收到。"}],
  technicalOperatingFlow: [
    { title: "选对入口", detail: "先判断是否只改单文件、只找原件、需要持续工作交付，或确实要形成正式文书和材料包。" },
    { title: "固定当前事项", detail: "明确目标、接收对象、期限、现有版本、当前状态、必要原件和下一步。" },
    { title: "区分事实与未知", detail: "核对参与方、日期、金额、附件和来源说明；缺失项不通过模板或模型补猜。" },
    { title: "形成制作计划", detail: "检查严格输入，固定文书用途、输出类型、签名要求、附件、渠道和递送边界。" },
    { title: "生成同源 DOCX/PDF", detail: "优先使用 Microsoft Word 导出固定版，缺失时明确使用本地 fallback；内部角色代码不进入对外正文。" },
    { title: "审计内容和页面", detail: "重读所有输出字段，检查结构、页码、彩色/灰度页面、签名可见性和每个文件哈希。" },
    { title: "发布递送前材料包", detail: "只有全部机械验收通过才形成 v3 release；build 与 release 都不可覆盖，ready 仍 delivered=false。" },
    { title: "现实动作另行回读", detail: "递送、收件、处理和对方签回分别绑定现实来源；材料改变或中断时从新的 build 或最近核对 release 继续。" }
  ],
  components: [
    { name: "文书和材料制作 Skill", responsibility: "从自然请求选择最小产品路线和必要原件。", implementation: "只在需要正式文书/材料包时进入；单文件、原件查找和工作交付直接分流。" },
    { name: "严格输入与 plan", responsibility: "固定事项、参与方、收件方、渠道、事实、请求、附件和签名要求。", implementation: "版本化 JSON schema 加日期、唯一 ID、普通文件和签名 profile 校验；输入只解析一次后规范化封存。" },
    { name: "DOCX/PDF 生成器", responsibility: "从同一内容生成可编辑版和固定版。", implementation: "A4 Word 文档优先用打包的无窗口 Word exporter；不可用时显式进入 ReportLab fallback。" },
    { name: "内容与逐页审计", responsibility: "证明输出字段、结构、页码、彩色/灰度页面和签名图片未漂移。", implementation: "DOCX/PDF 重新提取文字，Poppler 逐页渲染，彩色/灰度页面分别哈希并执行墨迹/边缘检查。" },
    { name: "v3 自包含 release", responsibility: "冻结一个可独立核对的递送前材料包。", implementation: "精确集合包含输入、文档、附件、审计、逐页图、签名快照和 build manifest；缺文件、多文件、路径越界或摘要不符都失败。" },
    { name: "当前事项与现实来源", responsibility: "拥有递送之后的现实状态与对方签回。", implementation: "本地 CLI 不生成后三个状态；只有可保留的现实记录或本人明确说明才能推进。" }
  ],
  usageExamples: [
    { ask: "先核对这些购买记录，哪些事实能写、哪些还不确定？", effect: "固定当前事项和最小原件，分开已确认事实、来源说明、未知与需要本人决定的内容。", moduleSlug: "current-matter-sources" },
    { ask: "把核对后的内容制作成可编辑文书和同一内容的 PDF。", effect: "从同一份确认内容生成 DOCX、PDF 和附件清单，避免两个版本各写各的；内部代码不会进入对外正文。", moduleSlug: "editable-docx-pdf" },
    { ask: "逐页检查这个材料包，确认复制到另一目录后仍然完整。", effect: "重读正文、检查页码和彩色/灰度页面，再核对复制后的文件是否齐全、字节是否一致。", moduleSlug: "page-audit-release" },
    { ask: "这份材料需要本人签名吗？现在能不能递送？", effect: "核对签名要求和实际页面，告诉我现在是文件已生成、本人已签，还是已经具备递送条件；它不会替我发送。", moduleSlug: "signature-delivery-version" },
    { ask: "已经发出去了，对方收到、处理或签回了吗？", effect: "分别核对发送、收件、处理和对方签回的现实证据；哪一步没有证据，就停在哪一步。", moduleSlug: "reality-readback-recovery" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: `PRIVATE main ${sourceCommit} 定义 2.0.1 的输入、生成、审计、签名和 v2/v3 verify 语义。`, doesNotProve: "不证明任何真实原件、真实签名、接收渠道或现实结果可用。" },
    { layer: "Focused tests（聚焦回归）", proves: "32 项通用文书回归覆盖四类材料、输入漂移、closure、灰度页、v2兼容、wheel资源和不可覆盖。", doesNotProve: "合成 fixture 不能证明真实内容质量或外部动作。" },
    { layer: "Full repository tests（全仓回归）", proves: "2026-09-01 基线 526 项通过、6 项环境性跳过、101 个子测试通过；本轮只重跑通用文书 32 项，不宣称当前提交全仓已复验。", doesNotProve: "跳过项、真实设备和外部平台仍需各自验收。" },
    { layer: "Installed wheel synthetic E2E（隔离安装虚构端到端）", proves: "2.0.1 wheel 的两个入口都携带真实资源，并用 Microsoft Word + Poppler 完成虚构 plan/build/verify。", doesNotProve: "不证明离线依赖恢复、真实用户材料或外部递送。" },
    { layer: "Gallery（画廊）", proves: "一页完全虚构样张来自当前生成器，并已完成彩色/灰度逐页审计。", doesNotProve: "不证明全部材料类型、真实签名或整篇语义已经由本人接受。" },
    { layer: "Real matter E2E（真实事项端到端）", proves: "若未来执行，可证明当前原件、语义审阅、签名、材料包和现实状态真实成立。", doesNotProve: "本轮没有运行，因此当前状态是 not_run。" }
  ],
  operationalEntrypoints: [
    { name: "形成制作计划", command: "formal-plan --request <request.json> --out <plan.json>", purpose: "核对严格输入并返回输出、签名和递送边界，不生成文书。" },
    { name: "生成与逐页验收", command: "formal-build --request <request.json> --output-root <output> --build-id <id>", purpose: "生成不可覆盖 build；全部机械验收通过时再形成自包含 v3 release。" },
    { name: "独立核对材料包", command: "formal-verify --root <build-or-release-root>", purpose: "只读核对清单、精确文件集合、哈希、内容、页面、签名和状态；v2 会明确返回历史限制。" }
  ],
  evolution: [
    {
      "date": "2026-08–09",
      "title": "把散落原件整理成同一份成品",
      "commit": "",
      "result": "从当前事项与必要原件出发，同源生成可编辑文书和PDF；不确定事实先列出来，不通过漂亮排版掩盖冲突。",
      "evidence": [
        {
          "date": "2026-08-31",
          "note": "同源DOCX/PDF、签名和递送前版本形成。",
          "commit": "fe7edc3"
        }
      ]
    },
    {
      "date": "2026-09",
      "title": "从文件能打开，走到材料真的能交付",
      "commit": "",
      "result": "逐页检查、签名与附件核对进入制作流程，材料包可复制到独立位置重新验证；生成、签署、可递送与对方实际处理分开。电子阅读和打印按用途选择，不强制每次做两套。",
      "evidence": [
        {
          "date": "2026-09-01",
          "note": "2.0.1补齐页面核对、自包含材料包和独立复制复验；历史测试不升级为本轮新验收。",
          "commit": "3ab7fb45718a98bd8e0ae1e0dee14b5c31cf22bc"
        }
      ]
    }
  ],
  snapshotUpdateNote: "本页是 2026-09-01 首次 source-first 全量快照。以后只有用途、输入/输出、签名、审计、release、状态、恢复或真实 E2E 发生会改变用户判断的实质变化时才原位更新；私人材料变化、普通重构、时间戳和哈希漂移不生成更新日志。",
  "readerBoundary": "只改单个文件可以直接处理，只找原件则先去材料查找。缺附件、签名或接收证据时保留准确状态；已有签署版本和原件不为改样式而覆盖。",
};

const documentMaterialsModules = [
  {
    slug: "current-matter-sources",
    usageEntry: "说明当前要解决的事项，并点名必要原件。",
    usageInputs: ["事项目标和接收对象", "本次必要的新文件或事实（如有）", "确有期限时的截止要求"],
    productFlow: [{"title": "系统核对并处理", "detail": "只把会改变本次判断的材料固定下来，核对日期、金额与各方说法；旧草稿和别的事项不自动混入。"}, {"title": "交付与接续", "detail": "交回制作依据及需要本人决定的空白；原件或事实不足时先列缺口，不用模板猜。"}],
    shortTitle: "事项与原件",
    title: "先固定当前事项、必要原件、事实与真正未知",
    searchAliases: ["原件里的日期和草稿不一致怎么办", "先核对材料再写文书", "当前事项和必要原件", "事实来源和未知怎样分开", "我只想找到原件"],
    searchProjection: {
      intents: ["判断是否应进入文书制作", "固定当前事项和最小原件", "区分事实来源未知和决定", "处理原件冲突"],
      entities: ["current matter", "request", "participants", "recipient", "channel", "facts", "attachments", "source_note"],
      relations: ["当前事项拥有目标状态和下一步", "输入快照绑定本次生成内容", "附件绑定显式路径与哈希", "单条来源说明仍可能缺失"],
      failureRecovery: ["专门入口存在时继续原入口", "原件冲突时停止成稿", "缺来源保持未知", "只找原件时转个人材料查找"]
    },
    teaser: "当前事项先回答为什么做、给谁、何时、已有哪一版和缺什么；生成器只接收显式输入和普通文件，不扫描私人目录。",
    status: "当前已能固定一次输入并重读所有成品字段；逐条事实来源和整篇语义审阅仍需额外核对",
    statusTone: "mixed",
    value: "在写第一句话前先确定这次真正要解决什么、哪些原件会改变判断、哪些内容仍未知，避免旧草稿和别的事项混入。",
    why: "同一事项可能跨多个版本和附件；金额、日期、接收对象或本人决定只要有一项错，后面的版式再漂亮也没有用。",
    example: "我可以说：“购买记录和旧草稿写的日期不一样，先把冲突标出来，别急着成稿。”系统会把两个日期及各自来源并排交回；确认前不替我选一个。",
    result: "得到一个规范输入与制作计划：目标、参与方、接收对象、渠道、事实、请求、附件、签名要求、未知和下一步彼此分开。",
    readerStates: {
      pass: "目标、接收对象、必要原件和输入字段一致，可冻结本次制作计划。",
      problem: "原件冲突、事实缺来源、日期金额不清或需要本人决定时，保留现有材料并列出唯一问题，不开始正式构建。",
      unavailable: "当前事项或关键原件不可读时只暂停对应步骤，不扫描其他目录或从旧对话补猜。"
    },
    stateLabels,
    decisionImpact: [
      "单文件编辑、原件查找和工作交付在入口处直接分流。",
      "请求文件只解析一次，生成与封存使用同一规范值；源文件中途变化不会混入当前 build。",
      "参与方、接收方、渠道、日期、事实、请求和附件都属于输出驱动字段，变化后旧成品验证失败。",
      "整包输入被固定不等于每条事实来源机械闭合；source_note 缺失时继续显示 gap。"
    ],
    problem: "解决错事项、错版本、来源冲突、字段漂移和把推测或未决定内容写成事实。",
    implementation: [
      "严格 request schema 约束事项类型、唯一 ID、日期、参与方、收件方、渠道、事实、请求、附件和签名字段。",
      "普通文件与附件都显式传入；链接、缺失文件、重复 ID、空字段和无效日期失败关闭。",
      "生成前把已经解析的 request 规范化写入 input snapshot，避免再次复制变化后的源文件。",
      "附件在复制后重新核对 source SHA-256 与 content SHA-256。",
      "当前 source_note 可选，自动化没有 per-fact provenance（逐事实来源）强门。"
    ],
    flow: ["判断入口", "读取当前事项", "只打开必要原件", "列出事实、来源说明、未知和决定", "核对接收对象、渠道、附件与签名要求", "输出 plan 或明确阻断"],
    concepts: [
      { term: "Current matter（当前事项）", explanation: "一个目标下当前有效的原件、状态、决定、未知、期限和恢复点，不是全局个人资料。" },
      { term: "Input snapshot（输入快照）", explanation: "实际用于生成的规范请求副本；其哈希、大小和内容与 build manifest 绑定。" },
      { term: "source_note（来源说明）", explanation: "某条事实的简短依据说明；当前可选，因此不能据此宣称每条事实都已逐一溯源。" },
      { term: "Output-driving field（输出驱动字段）", explanation: "参与方、收件方、渠道、日期、事实、请求或附件等会改变最终文书的字段。" }
    ],
    boundaries: ["不读取真实私人目录作为默认上下文", "不把旧草稿或缓存当当前事实", "不替用户完成仍需本人决定的内容", "不把输入哈希冒充逐事实来源闭合"],
    failures: [
      { condition: "原件或当前事项冲突", response: "停止正式构建，列出冲突字段与各自来源，等待明确选择。" },
      { condition: "附件缺失、链接或哈希变化", response: "拒绝接入当前 build；保留原件和上次核对版本。" },
      { condition: "源 request 在解析后变化", response: "当前 build 仍封存并使用已解析值；变化内容只能进入新 build。" },
      { condition: "只需要找原件或改单文件", response: "绕过本项目，进入对应的最短能力。" }
    ],
    sources: [
      { path: "PRIVATE source · formal-document-input schema", role: "严格输入字段、类型和签名要求" },
      { path: "PRIVATE source · formal_documents.py", role: "单次解析、附件与输入快照实现" },
      { path: "PRIVATE tests · test_formal_documents.py", role: "输出字段漂移、TOCTOU 和四类材料回归" }
    ],
    verification: ["五类输出字段修改并重算摘要后均被 verify 拒绝。", "request 在解析后变化时，输入快照与成品仍保持原已解析值。", "相对路径、链接、重复 ID 和缺失附件失败关闭。", "真实事项和逐事实来源 E2E 本轮未运行。"],
    relation: "本模块提供 plan 的可信输入；下一模块只消费这份规范值，不重新扫描或猜事实。",
    readerStatus: "已有固定当前事项、输入和成品字段的功能；每条事实是否有依据、整篇是否准确仍需实际审阅。"
  },
  {
    slug: "editable-docx-pdf",
    usageEntry: "要求同一份内容同时得到可编辑 Word 和对应 PDF。",
    usageInputs: ["这次已确认的内容或要改的段落", "要附上的材料（如有）", "主要用于屏幕阅读还是打印"],
    productFlow: [{"title": "系统核对并处理", "detail": "从同一规范内容生成两种格式，电子版核对层级与导航，确有打印需求再检查纸面效果。"}, {"title": "交付与接续", "detail": "交回可编辑 DOCX、固定版 PDF 与附件；导出或字体有问题时保留原内容，重新核对页面。"}],
    shortTitle: "DOCX 与 PDF",
    title: "从同一规范内容生成可编辑 DOCX、PDF 与附件",
    searchAliases: ["怎样同时生成Word和PDF", "把售后记录做成可编辑申请", "合同说明申请材料怎么生成", "Word导出失败怎么办", "电子版打印版内容一致"],
    searchProjection: {
      intents: ["生成可编辑文书和PDF", "生成四类通用正式材料", "核对电子版与固定版同源", "处理Word不可用"],
      entities: ["formal-plan", "formal-build", "DOCX", "PDF", "attachments", "Microsoft Word", "ReportLab", "build ID"],
      relations: ["plan冻结输出要求", "DOCX与PDF消费同一输入", "附件复制绑定原哈希", "build ID绑定不可覆盖目录"],
      failureRecovery: ["同名build拒绝覆盖", "Word不可用时显式fallback", "正文读回缺失时不release", "字段变化需新build"]
    },
    teaser: "plan 只定义制作路线；build 才生成 A4 DOCX、PDF、附件和清单。Word 是首选导出器，备用引擎会在 manifest 中明确记录。",
    status: "四类通用材料和隔离安装后的虚构样张都已完成同源生成与复验；真实个人材料本轮未运行",
    statusTone: "pass",
    value: "同一份确认内容得到可编辑DOCX、固定版PDF和按序附件，电子版与打印版不各自手改内容。电子阅读用有实际层级与导航作用的彩色设计；确有打印用途时另做适合纸面的版本，不强制每次交付两版。",
    why: "分别修改 Word 和 PDF 最容易让日期、请求、附件编号和签名块漂移；覆盖旧输出又会失去可恢复版本。",
    example: "我可以说：“把核对后的退款申请做成可编辑版和打印版，两个版本内容必须一致。”系统会从同一份确认内容生成 DOCX 和 PDF；若本机缺少正常导出条件，会说明改用了什么方式以及仍需复核什么。",
    result: "得到这次确认内容的可编辑 Word、同内容 PDF 和按序附件，知道使用了哪条导出路线。新版本不覆盖旧文件；导出失败时保留已经核对的输入和旧版。",
    readerStates: {
      "pass": "文字与附件从同一版内容生成并读回一致后，进入逐页检查。",
      "problem": "Word、PDF 或附件有一项失败时保留输入和旧版，不把临时文件当可递送成品。",
      "unavailable": "生成 PDF 的环境不可用时说明这一环缺口，不拿旧 PDF 冒充本轮输出。"
    },
    stateLabels,
    decisionImpact: ["四类材料都实际通过同一 build→verify 合成回归。", "内部 document role 与 channel enum 不进入对外正文，页面显示人话类型。", "2.0.1 wheel 包含唯一 Word exporter 资源；兼容构建与新入口共用同一实现。", "Word 首选路线和 ReportLab fallback 在 manifest 中分开，不能互相冒充。"],
    problem: "解决电子/打印版本分叉、内部代码泄露、旧输出覆盖和安装后静默缺资源。",
    implementation: ["A4 DOCX 使用宋体正文、黑体标题、页脚页码与统一边距。", "Word exporter 作为 package resource 随 wheel 安装，并以 CREATE_NO_WINDOW 执行。", "Word 导出失败时生成 ReportLab PDF，并把失败原因写入 export.warning。", "DOCX 与 PDF 重新提取正文，逐项核对所有输出驱动字段。", "build 与 release 都通过临时同卷目录完成后原子晋升。"],
    flow: ["验证 plan", "创建唯一 build 临时目录", "封存规范输入与附件", "生成 DOCX", "导出 PDF 或显式 fallback", "重读字段与签名", "写 build manifest 并原子晋升"],
    concepts: [
      { term: "DOCX", explanation: "可继续编辑、修订和批注的 Word 文档；结构正确仍须逐页检查。" },
      { term: "PDF", explanation: "固定版面输出；它来自同一规范内容，不是另手工维护的一份正文。" },
      { term: "Build ID（构建标识）", explanation: "一次不可覆盖制作的稳定名字；同名存在就拒绝覆盖。" },
      { term: "Fallback（备用引擎）", explanation: "Word 不可用时使用的本地 PDF 路线；manifest 会保留引擎和警告。" }
    ],
    boundaries: ["只生成明确请求的当前事项", "不把能打开写成内容正确", "不覆盖既有build或release", "备用引擎不冒充Word输出", "不自动执行外部递送"],
    failures: [
      { condition: "同名 build 或 release 已存在", response: "拒绝覆盖；使用新 build ID 或继续核对既有版本。" },
      { condition: "Word 导出不可用", response: "显式记录 warning 并尝试本地 fallback；fallback 也失败则停止。" },
      { condition: "DOCX/PDF 缺输出字段", response: "正文读回失败，不形成 ready_for_delivery（已具备递送条件）材料包。" },
      { condition: "附件复制哈希不同", response: "删除本轮临时目录，原件与旧构建保持不变。" }
    ],
    sources: [
      { path: "PRIVATE source · formal_documents.py", role: "DOCX/PDF、附件、导出与不可覆盖构建" },
      { path: "PRIVATE source · packaged Word exporter", role: "wheel 内 Word 固定版导出" },
      { path: "PRIVATE tests · four-type build/verify", role: "四类材料、Word/fallback 与隔离安装回归" }
    ],
    verification: ["四类通用材料均完成合成 build→verify。", "隔离 wheel 两个入口都以 2.0.1 真实使用 Microsoft Word + Poppler。", "DOCX 不含内部角色代码或原始渠道 enum。", "真实个人正文和真实打印验收本轮未运行。"],
    relation: "本模块形成 produced（已生成）或 signed（本人已签）的 build；逐页审计和自包含 release 由下一模块决定是否可进入 ready_for_delivery（已具备递送条件）。",
    readerStatus: "四类通用材料的同源文档和PDF生成已用虚构样张验收；真实个人材料本轮没有制作。"
  },
  {
    slug: "page-audit-release",
    usageEntry: "材料做好后，要求逐页核对并冻结可带走的包。",
    usageInputs: ["要核对的这份构建或材料包", "屏幕阅读或打印的实际用途"],
    productFlow: [{"title": "系统核对并处理", "detail": "逐页查看内容、页码、可读性、签名和每个文件；机械检查齐全后冻结自包含版本。"}, {"title": "交付与接续", "detail": "交回已验包和清单；页面或附件不合格就保留旧版与具体失败位置，不冒充可递送。"}],
    shortTitle: "逐页验收与材料包",
    title: "按阅读或打印用途逐页检查，再冻结自包含材料包",
    searchAliases: ["怎样逐页检查文书", "PDF页码和灰度怎么验", "哪一个材料包可以独立验真", "材料包复制到空目录恢复", "旧v2材料包还能验证吗"],
    searchProjection: {
      intents: ["逐页检查DOCX和PDF", "形成自包含递送前材料包", "空目录复制后独立验证", "读取旧v2限制"],
      entities: ["page rendering", "grayscale", "page number", "manifest", "v3 release", "exact set", "legacy v2", "formal-verify"],
      relations: ["PDF生成逐页彩色artifact", "彩色页生成灰度artifact", "build manifest绑定全部文件", "v3 release复制完整closure"],
      failureRecovery: ["渲染器不可用不release", "缺页多页文件失败", "空目录复制可verify", "v2返回non-self-contained限制"]
    },
    teaser: "ready_for_delivery（已具备递送条件）不由一个布尔值决定：正文、结构、页码、彩色/灰度页面、签名快照、附件与精确文件集合全部可重新核对，才形成 v3 release。",
    status: "当前材料包复制到空目录后仍能完整核对；缺文件、多文件、路径越界或内容变化都会明确失败",
    statusTone: "pass",
    value: "材料包离开原构建目录仍能证明自己带齐了什么、每页长什么样和有没有被换掉。先分清这份材料是在屏幕上读，还是要打印：屏幕版检查彩色层级、定位与字号，打印版再检查灰度可读性。原始证据不为配色改动。",
    why: "只有 DOCX/PDF 文件不够：输入、附件、逐页证据和签名来源缺一项，换机或复制后就无法解释成品怎样产生。",
    example: "我可以说：“逐页检查这份材料，彩色和黑白打印都不能裁字；再复制到一个空目录确认附件没有漏。”我会拿到逐页检查结果、发现的问题，以及复制后仍能独立核对的完整材料包。",
    result: "得到逐页检查结果和一份可带走的完整材料包：文书、附件、必要签名与核对清单都能再次验真。任何页面或附件不合格时只保留待修改版本。",
    readerStates: {
      "pass": "正文、页面和附件都核对后，材料包复制到别处仍能重新验证，才称本地可递送。",
      "problem": "页码、裁切、灰度、签名或文件集合有问题时指出具体页与材料，保留待修改版本。",
      "unavailable": "页面无法渲染时不把结构检查当成肉眼检查通过。"
    },
    stateLabels,
    decisionImpact: ["每页彩色与灰度图都是 manifest 可追溯 artifact，不是临时截图。", "可见页码逐页匹配；空白和边缘裁切使用 ink/edge 启发式检查。", "墨迹和边缘通过不证明签名身份、位置、对比度或未被遮挡；实际渲染页是进一步视觉核对的输入。", "自动化仍不能证明整篇语气和事实主线已由AI或人工审阅。", "v2 release继续可读，但明确返回legacy_v2_non_self_contained和limitations。", "复制到空目录后完整verify不等于已有自动备份或断点续传。"],
    problem: "解决“能打开就算完成”、递送包缺输入/审计、复制后无法复验和旧格式被新工具无版本破坏。",
    implementation: ["DOCX/PDF结构审计与全部输出字段读回先运行。", "现有v3自动管线由Poppler按DPI渲染每页彩色PNG，再生成L模式灰度辅助制品。9月18日媒介设计规则要求非打印成品采用彩色，打印才以灰度可读性作为用途验收；生成了灰度辅助图不表示交付黑白PDF，也不证明新版配色已经实际完成。本轮没有改渲染器或重做样张。", "逐页记录大小、SHA-256、墨迹覆盖、边缘暗度和可见页码。", "v3 release按build manifest复制所有closure并拒绝额外文件。", "formal-verify在release根重跑嵌入build验证和当前结构/页面检查。", "v2/v3共享兼容schema；v2只按历史实际携带内容通过并返回限制。"],
    flow: ["重读DOCX/PDF正文", "检查结构和页码", "渲染全部彩色页", "生成并检查灰度页", "写审计与每页哈希", "复制完整closure到release", "核对精确文件集合", "空目录复制后独立verify"],
    concepts: [
      { term: "Closure（闭包）", explanation: "独立解释和验证成品所需的输入、输出、附件、审计、页面和签名快照完整集合。" },
      { term: "Exact set（精确集合）", explanation: "release 只允许 manifest 列出的文件；缺文件和额外文件都会让验证失败。" },
      { term: "Grayscale artifact（灰度页制品）", explanation: "由每张彩色渲染页转换的L模式页面，用于检查打印灰度下的墨迹和边缘。" },
      { term: "legacy_v2_non_self_contained", explanation: "历史v2仍可验证其真实携带内容，但没有v3输入、审计、灰度页和签名closure。" }
    ],
    boundaries: ["ink/edge不是整篇语义审阅或签名可见性证明", "渲染成功不证明签名正确且清楚可见", "灰度辅助制品不等于黑白交付要求：非打印PDF必须彩色，打印版本另验；同源不等于同版式，不强制两版，原件及已签署历史不改。", "manifest digest不是数字签名", "普通复制恢复不等于可续传mirror", "v2限制不会被静默升级"],
    failures: [
      { condition: "页面渲染器不可用", response: "page audit标为unavailable，只保留build，不形成release。" },
      { condition: "页码、灰度或页面边缘失败", response: "记录精确页码和失败腿，修复后重新完整构建。" },
      { condition: "release缺文件或有额外文件", response: "formal-verify失败，既有源和另一份副本不被删除。" },
      { condition: "v2历史材料包", response: "核对其DOCX/PDF、附件、状态和摘要，并返回缺少自包含closure的明确limitations。" }
    ],
    sources: [
      { path: "PRIVATE source · formal_documents.py", role: "内容读回、逐页审计、closure复制和v2/v3验证" },
      { path: "PRIVATE source · audit.py", role: "结构、页面、墨迹和边缘检查" },
      { path: "PRIVATE tests · self-contained release", role: "空目录恢复、缺/多文件和legacy兼容回归" }
    ],
    verification: ["v3 release在原build删除后从空目录副本verify通过。", "删除输入或新增unexpected文件均失败。", "无可见页码PDF被拒绝，灰度页必须为L模式并重新审计。", "旧v2材料包通过有限验证且返回明确limitations。", "人工整篇语义审阅回执仍为gap。",
      "2026-09-18从正式f0a3c28的AGENTS、AGENT_ENTRY与设计合同回读屏幕彩色/打印灰度分工；规则发布只证明制作与验收要求改变，未生成个案材料、读取原件或重跑历史样张。",],
    relation: "通过本模块才产生ready_for_delivery候选；是否签名以及本地状态由下一模块说明。",
    readerStatus: "材料包复制到空目录后仍能核对完整性；内容与真实页面也要逐页检查，不能只凭文件清单完整。"
  },
  {
    slug: "signature-delivery-version",
    usageEntry: "说明这份文件需不需要本人签名，并问现在能否递送。",
    usageInputs: ["这份文件需不需要本人签名", "准备采用的递送方式（若已决定）"],
    productFlow: [{"title": "系统核对并处理", "detail": "分开无需签、待本人签、已签和锁定可递送的版本，不用一张签名图替代实际步骤。"}, {"title": "交付与接续", "detail": "交回当前精确状态及下一步；未签或版本已改时不沿用旧的可递送结论。"}],
    shortTitle: "签名与递送版本",
    title: "把本人签名、无需签名和可递送版本准确分开",
    searchAliases: ["这份材料只是生成还是已签名", "不需要本人签名怎么办", "哪一个PDF可以递送", "签名图片是否可信", "ready不等于已发送"],
    searchProjection: {
      intents: ["判断是否需要本人签名", "核对签名资产和成品", "形成ready_for_delivery版本", "避免把ready写成delivered"],
      entities: ["signature profile", "asset SHA-256", "produced", "signed", "ready_for_delivery", "delivered false", "release"],
      relations: ["profile signer绑定请求签署人", "签名图片嵌入DOCX/PDF", "signed描述本地成品", "ready绑定接收对象渠道附件"],
      failureRecovery: ["签署人不符停止", "签名资源缺失停止", "无需签名保持produced", "ready后仍等待外部授权"]
    },
    teaser: "签名是一个独立制作步骤：需要时核对规范 profile 和图片 hash，不需要时明确保持 produced（已生成）；两种情况都要经过完整审计才能进入 ready_for_delivery（已具备递送条件）。",
    status: "已能核对签署人、签名资产来源与 DOCX 同图哈希；PDF 当前只有图像对象数量检查，签名最终可见性仍需逐页核对",
    statusTone: "mixed",
    value: "用户能知道当前版本到底是已生成、本人已签还是已经锁定可递送，而不会把一张签名图误写成外部结果。",
    why: "签署人、签名资产、日期和最终 PDF 只要错一项，就可能用错版本；反过来，不需要签名的材料也不能伪造 signed（本人已签）状态。",
    example: "我可以问：“这份申请需要我签名吗，现在能不能发？”系统会先核对接收要求和实际页面：无需签名的材料在内容与版面通过后可进入待递送；需要签名的材料还要确认签名属于本人、位置正确且清楚可见。",
    result: "知道这份本地文件是刚生成、无需签、待本人签、已签还是已锁定可递送；这些状态都不等于实际送出。",
    readerStates: {
      "pass": "不需签名的版本，或确需签名且已核对本人签名与页面的版本，完成其他检查后才标为可递送。",
      "problem": "签名人、图片来源或最终可见性对不上时保留待核，不用图片存在代替已签。",
      "unavailable": "必要签名材料或页面检查不可用时暂停签名与可递送步骤，不造占位签名。"
    },
    stateLabels,
    decisionImpact: ["signature.required=false保持produced，不伪造signed。", "required=true必须profile姓名完全匹配并封存profile/asset快照。", "DOCX要求找到精确asset SHA-256；PDF当前仅要求pdf_image_count>=1，没有把该对象与签名资产、最终位置或可见性绑定。", "自动化signed/ready状态与实际渲染页上的签名可见性是不同证据，不应相互替代。", "本地签名不证明对方签名、递送、收到或处理。", "外部递送仍需明确对象、版本、渠道和动作授权。"],
    problem: "解决错签、漏签、占位签名、无需签名却标signed和把ready误报成已发送。",
    implementation: ["signature profile与图片必须是普通可读文件且同目录受控。", "profile.person.name与request signer_name完全匹配。", "build封存profile与asset并再次解析快照。", "_docx_embedded_hashes 对 word/media 内嵌媒体做完整 SHA-256 匹配；_pdf_image_count 仅合计 pypdf 每页 images 数量，要求至少 1，不检查它是否就是签名或是否实际可见。", "audit_rendered_page 对彩色和灰度页检查墨迹覆盖及边缘暗度；这不是签名位置、遮挡或可读性识别。", "build state为produced或signed；release只把delivery改为ready_for_delivery并固定delivered=false。"],
    flow: ["读取签名要求", "核对profile与签署人", "验证签名图片", "生成DOCX/PDF", "匹配DOCX资产并统计PDF图像对象", "封存签名快照", "完成当前机械逐页审计", "形成ready release并说明签名可见性证据边界"],
    concepts: [
      { term: "produced（已生成）", explanation: "文书已生成和核对，但没有声明本人签名已固定。" },
      { term: "signed（本人已签）", explanation: "本地成品包含核对过的本人签名资产；不表示其他人签名或外部动作。" },
      { term: "ready_for_delivery（可递送）", explanation: "确切版本、接收对象、渠道、附件和指纹已锁定，delivered仍为false。" },
      { term: "Signature asset（签名资产）", explanation: "受profile管理并以SHA-256绑定的签名图片；不是证书签名或可信时间戳。" }
    ],
    boundaries: ["不生成占位签名", "PDF图像对象计数不证明签名身份、位置或最终可见性", "不把图片hash称为密码学签名", "不把本人签名称为对方签回", "不把ready称为已递送", "不自动执行外部动作"],
    failures: [
      { condition: "profile姓名与请求不一致", response: "构建前失败，不选择其他签名图片。" },
      { condition: "签名图片不可读或越出profile目录", response: "停止签名腿，保留request和旧版本。" },
      { condition: "DOCX没有匹配签名资产，或PDF图像对象为0", response: "当前机械检查失败，不形成release；PDF对象数大于0也不能反向证明签名可见。" },
      { condition: "PDF有图片但签名位置或可见性尚未核实", response: "保留渲染页供核对，明确签名视觉证据仍未闭合；现行CLI没有专门识别这一缺口的自动检查。" },
      { condition: "无需签名", response: "明确保持produced；通过审计后仍可ready，但不写signed。" }
    ],
    sources: [
      { path: "PRIVATE source · formal_documents.py", role: "签名profile、asset封存与状态" },
      { path: "PRIVATE source · signature helpers", role: "签名图片嵌入和规范路径" },
      { path: "PRIVATE tests · signature/readback", role: "签署人、图片hash、produced/signed/ready回归" }
    ],
    verification: ["签署人不匹配和直接注入图片路径均失败。", "签名profile和asset快照被纳入v3 closure。", "合成签名测试核对docx_asset_verified=true与pdf_image_count>=1；这只证明当前机械条件，不证明PDF签名像素、身份或位置正确。", "无需签名build保持produced且不含占位线。", "渲染器不可用的回归保持ready_for_delivery=false且不生成release。", "真实签名和外部递送E2E本轮未运行。"],
    relation: "本模块只负责本地签名和递送版本；递送之后的现实状态必须进入下一模块回读。",
    readerStatus: "已能核对签署人和签名资产；PDF中的签名是否清晰、位置正确仍需看真实页面，图片数量不够证明。"
  },
  {
    slug: "reality-readback-recovery",
    usageEntry: "文件送出后，提供真实回执并问对方是否收到或处理。",
    usageInputs: ["本次递送版本", "发送、收件、处理或签回证据"],
    productFlow: [{"title": "系统核对并处理", "detail": "逐层核对现实动作与对应文件版本，中断先查已有回执和最近释放的包。"}, {"title": "交付与接续", "detail": "分别报告递送、收件、处理、对方签回；一个回执不能推成全部完成，也不盲目重复递送。"}],
    shortTitle: "现实回读与恢复",
    title: "递送、收件、处理和对方签回分别回读，中断从核对版本继续",
    searchAliases: ["已经递送对方收到没有", "对方签回的是哪个版本", "收到回执以后怎么记录", "文书制作中断后恢复", "材料包复制到新目录", "避免重复递送"],
    searchProjection: {
      intents: ["回读递送收件处理状态", "记录对方签回版本", "从自包含release恢复", "避免重复外部动作"],
      entities: ["delivered", "received", "handled", "counterparty_signed_returned", "receipt", "restore", "limitations", "authorization"],
      relations: ["ready不推出delivered", "delivered不推出received", "received不推出handled", "counterparty signed return独立于六状态"],
      failureRecovery: ["没有现实来源保持unknown", "复制release后先verify", "v2显示legacy限制", "外部动作不确定先回读不重放"]
    },
    teaser: "本地管线到 ready_for_delivery（已具备递送条件）即停止；delivered（已递送）、received（已收件）、handled（已处理）和 counterparty_signed_returned（对方签回）由当前事项与现实记录拥有。v3 release 可以复制到空目录复验，但没有自动备份或续传服务。",
    status: "六个阶段和对方签回已能分别表达；自动工具只负责本地前三步，后三步与签回仍由现实记录推进",
    statusTone: "mixed",
    value: "用户不会因为文件已经做好就重复递送，也不会把一张回执或对方签回扩大成所有事情已经完成。",
    why: "外部动作可能失败、延迟或只有部分回读；中断后若只看生成日志，很容易再次制作或再次发送同一版本。",
    example: "我可以问：“材料已经发出，对方到底是收到了、处理了，还是已经签回？”系统会分别核对发送记录、收件确认、处理结果和签回文件，只报告证据真正支持的那一步。",
    result: "交回送出、对方收到、实际处理和签回各自有无证据，以及当前版本、下一步和从哪里恢复。现有材料包可以复制到空位置再核对，但不会自行备份或替人递送。",
    readerStates: {
      "pass": "每一步现实状态都有对应版本的真实记录，材料包本身也可独立核对，才从已确认位置继续。",
      "problem": "只有发送但未确认收件，或回执与版本不符时保留已证实的一层，其余未知，不重复动作。",
      "unavailable": "外部渠道、事项记录或完整包不可用时只停受影响步骤，不从制作日志猜对方已经收到。"
    },
    stateLabels,
    decisionImpact: ["produced（已生成）只表示生成；signed（本人已签）只表示本人签名；ready_for_delivery（已具备递送条件）只表示版本锁定。", "delivered（已递送）必须有动作记录，received（已收件）必须有接收确认，handled（已处理）必须有实质结果来源。", "counterparty_signed_returned（对方签回）保存完整签回文件、来源、时间和 hash，是独立事件。", "当前通用 CLI 不实现后三阶段或签回，网页把它们标为现实合同而非已运行自动化。", "v3 普通复制 + verify 可恢复，但没有自动备份或断点续传 mirror。", "外部递送、付款、撤回或联系必须有精确授权；结果不确定时先回读。"],
    problem: "解决生成日志冒充现实、状态跨级、对方签回混同、重复递送和换目录后无法继续。",
    implementation: ["事项记录按produced→signed→ready_for_delivery→delivered→received→handled分层。", "对方签回记录完整文件、来源、时间、大小和SHA-256，不进入自动状态推进。", "v3 release exact-set在普通复制到空目录后由formal-verify重算。", "v2 release返回legacy scope和limitations，不被新工具无提示否定。", "通用CLI没有后台监听、状态抓取或自动外部动作。"],
    flow: ["从ready材料包开始", "经精确授权执行递送", "保存动作记录", "等待接收确认", "记录处理来源", "对方签回另存", "复制或中断后先verify", "从最近核对状态继续"],
    concepts: [
      { term: "delivered（已递送）", explanation: "有证据证明确切版本的递送动作发生；不表示对方收到。" },
      { term: "received（已收件）", explanation: "对方或平台确认收到；不表示审阅、同意或处理。" },
      { term: "handled（已处理）", explanation: "实质处理结果有来源支持；不推出未记录的额外结论。" },
      { term: "Recovery point（恢复点）", explanation: "最近一次通过验证的build/release和当前现实状态；中断后从这里继续。" }
    ],
    boundaries: ["现实状态不由本地日志自动晋级", "对方签回不等于事项解决", "普通复制恢复不等于自动备份", "不重复未知结果的外部动作", "真实个人回执不进入网页"],
    failures: [
      { condition: "只有ready，没有递送记录", response: "保持ready和delivered=false；等待授权或现实回读。" },
      { condition: "已递送但无接收确认", response: "只记录delivered，received保持Unknown。" },
      { condition: "复制后缺文件、额外文件或hash变化", response: "verify失败，保留源和副本，补齐后重新核对。" },
      { condition: "外部结果不确定", response: "先查当前记录，不自动重放递送、付款、撤回或联系。" }
    ],
    sources: [
      { path: "PRIVATE product contract · formal matters", role: "六阶段与对方签回的现实语义" },
      { path: "PRIVATE source · formal_documents.py", role: "produced/signed/ready、v3复制复验和v2限制" },
      { path: "PRIVATE tests · restore/legacy", role: "空目录复验、exact-set和v2兼容回归" }
    ],
    verification: ["v3 release复制到空目录且原build删除后verify通过。", "缺文件和额外文件均失败。", "v2历史release通过有限验证并返回non-self-contained限制。", "真实delivered/received/handled/签回和断点续传E2E本轮未运行。"],
    relation: "这是本地制作与现实工作的分界线；项目到这里交回确切状态和下一步，不替外部对象行动。",
    readerStatus: "已生成、已签与可递送有本地工具支持；是否真正送达、被接收、处理或签回仍由对应现实记录确认。"
  }
];

export const project = documentMaterialsProject;
export const modules = documentMaterialsModules;
export { documentMaterialsProject, documentMaterialsModules };
