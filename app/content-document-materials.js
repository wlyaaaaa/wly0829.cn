import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以继续制作", "需要修正", "当前不可用"];
const sourceCommit = "3ab7fb45718a98bd8e0ae1e0dee14b5c31cf22bc";

const documentMaterialsSnapshot = createProjectSnapshot({
  observedAt: "2026-09-01T08:34:22.061Z",
  label: "2.0.1 源码、全仓回归、隔离 wheel 与完全虚构生成链已核对；本轮未读取真实个人材料，也未执行任何外部递送",
  boundary: "本页没有读取真实事项正文、原件载荷、签名图或个人结果；实际事项数量与外部递送状态保持 Unknown（未知），未读取不等于数量为 0。公开安全的产品状态、已核实数量、路径类别、组件、哈希机制、命令、测试、失败和恢复事实正常展示，只逐值省略具体命中 L3+ 或可复用秘密的载荷。",
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
    { label: "当前完整性", value: "v3 release 封存规范化输入、文档、附件、结构审计、逐页彩色/灰度渲染和所需签名快照；精确文件集合复制到空目录后仍可独立 verify。" },
    { label: "现实状态", value: "已生成、本人已签、已具备递送条件、已递送、已收件、已处理必须分别回读；对方签回是另一条独立事实，前一步不能自动推出后一步。" },
    { label: "当前版本证据", value: `PRIVATE main ${sourceCommit}；产品版本 2.0.1；全仓 526 项通过、6 项环境性跳过、101 个子测试通过，其中通用文书 32 pass，Ruff 通过。`, hero: false },
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
  title: "文书和材料制作",
  route: "/projects/document-materials",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "2.0.1 的虚构 DOCX/PDF、逐页审计和自包含材料包已验；真实材料与外部状态按事项单独回读",
  cardStatusTone: "mixed",
  ...documentMaterialsSnapshot,
  kicker: "从真实材料到可编辑文书、核过 PDF 和可恢复材料包",
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
  summary: "当我已经有明确目标、接收对象和一组必要原件，需要把它们整理成合同、说明、申请、通知、回复、售后材料或附件包时，用这个项目；只改单个 Word/PDF 时直接绕过，只找原件时进入个人材料查找。它从当前事项和最小原件开始，生成同源 DOCX 与 PDF，核对内容、附件、签名资产、页码、灰度和版本，并提供逐页渲染结果。最终签名是否清楚、位置是否正确仍须看实际页面，不能只看图片数量；已生成、本人已签、可递送、已递送、已收件、已处理与对方签回分别记录。",
  why: "同一事项往往同时存在原始记录、旧草稿、核对后的成品、签名版、递送版、回执和对方返回版本。只按文件名继续会用错版本；把“文件生成成功”写成现实进展，又会造成漏签、重复递送或错误判断。这个项目把原件、成品、完整性证据和现实步骤拆开，发生中断时仍能从最近一次核对状态继续。",
  plainExample: "例如我说：“维修服务没有按约完成，请把购买记录、沟通事实和退款要求整理成可编辑申请、PDF 和附件清单。”项目先区分已确认事实、来源说明、真正未知和需要本人决定的内容，再从同一输入生成 DOCX 与 PDF，逐页检查正文、附件、页码和打印灰度。无需本人签名就明确停在 produced（已生成）；材料包完整核验后只能写 ready_for_delivery（已具备递送条件）。没有真实递送回读时，绝不写成已送达。",
  result: "我会得到可继续编辑的 DOCX、同一内容版本的 PDF、核对过的附件与自包含材料包，以及当前精确状态、下一步和恢复点。若原件、内容、签名、版面或现实回读不足，我得到的是保留下来的旧版本、具体失败位置、真正未知和一个需要决定的问题，而不是一份看似完整但无法使用的成品。",
  readerStates: {
    pass: "当前事项、必要原件、输出规格和接收要求一致时，生成同源 DOCX/PDF、材料包及结构、正文、页码、彩色/灰度逐页和哈希证据。自动检查通过只证明各自范围；签名最终可见性与整篇表达仍按实际页面审阅结果说明。",
    problem: "原件冲突、日期金额不清、附件缺失、签名不匹配或页面检查失败时，保留最近核对成品并指出失败位置。只有 PDF 图片计数通过却未核实签名可见时，也要明确这项缺口；现实回读不足不跨级推进。",
    unavailable: "当前事项、关键原件、Word/PDF 生成器、页面渲染器、签名资产或接收渠道不可用时，只暂停受影响步骤；保留原件、草稿、核过成品和恢复点，不用旧缓存或日志补猜。"
  },
  stateLabels,
  methodCanvas: {
    kicker: "文书制作画布",
    headline: "先固定当前事项与必要原件，再生成、逐页核对并记录现实进展",
    description: "产品把内容制作与现实动作分开：本地管线证明文书和材料包当前是什么，事项记录证明后来实际发生了什么。",
    steps: [
      { actor: "先判入口", title: "单文件、原件查找和持续工作分别绕过", detail: "只改单个 Word/PDF 直接用文档能力；只找原件进入个人材料查找；持续变化的需求、项目评审与执行跟踪进入工作交付。" },
      { actor: "读取事项", title: "明确目标、接收对象、期限和当前状态", detail: "先知道要形成什么、交给谁、现在已有哪一版和下一步是什么，不为同一事项另建第二份状态。" },
      { actor: "只取必要原件", title: "核对参与方、日期、金额、附件和来源", detail: "显式绑定输入与附件，不扫描无关目录；来源冲突和真正未知单独保留。" },
      { actor: "冻结方案", title: "确定结构、DOCX/PDF、签名和渠道", detail: "在生成前明确文书用途、正文结构、附件清单、是否需要本人签名以及接收对象和渠道。" },
      { actor: "同源生成", title: "一次生成可编辑版和固定版", detail: "DOCX 与 PDF 来自同一规范输入；附件复制后重新核对哈希，内部角色代码不会进入对外成品。" },
      { actor: "完整验收", title: "重读正文并检查每一页", detail: "自动核对输出字段、页码、页面数、墨迹、边缘和文件指纹，并保留彩色/灰度页。签名资产哈希和 PDF 图片计数是机械证据，签名在最终页面上的位置与可见性仍须看渲染结果。" },
      { actor: "冻结材料包", title: "形成可独立复验的递送前版本", detail: "v3 release 携带输入、文档、附件、审计、逐页图和所需签名快照；额外或缺失文件都会失败。" },
      { actor: "现实回读", title: "递送、收件、处理和签回分别记录", detail: "本地 ready_for_delivery（已具备递送条件）不表示已经递送；每一步只由真实记录推进，中断从最近一次核对版本继续。" }
    ],
    columnsAriaLabel: "用户、文书制作项目和现实接收方的责任边界",
    columns: [
      { title: "我提供与决定", note: "目标、原件与现实动作", items: ["说明目标、接收对象、期限和必要原件", "确认真正未知、是否需要签名和最终表达", "明确授权递送、撤回、付款或联系外部对象"] },
      { title: "项目负责", note: "同源成品与可恢复证据", items: ["生成 DOCX/PDF、附件包和精确版本清单", "核对正文、页码、彩色/灰度页面、DOCX 签名资产哈希与 PDF 图像对象，并说明可见性缺口", "保留自包含 release、失败位置、下一步与恢复点"] },
      { title: "外部现实负责", note: "递送之后发生什么", items: ["递送记录证明动作发生", "对方或平台记录证明收到", "处理结果和对方签回分别由各自来源证明"] }
    ]
  },
  productPrinciples: [
    { title: "已有专门入口就继续原入口", detail: "项目只承接需要形成正式文书与材料包的当前任务；不接管单文件编辑、原件查找或持续工作交付。" },
    { title: "整包输入已固定，不等于逐事实来源已闭合", detail: "规范输入与附件会被封存；单条 source_note 目前仍可选，因此页面不把整包哈希写成每条事实都已逐一溯源。" },
    { title: "事实、来源说明、未知和本人决定分开", detail: "输入冲突时先停下来说明；文字流畅不能把缺失来源、推测或尚未决定的请求变成已确认事实。" },
    { title: "电子版和打印版来自同一内容", detail: "DOCX、PDF 与附件包不分别手改；改变规范输入就产生新的不可覆盖 build。" },
    { title: "逐页验收是产品步骤", detail: "能打开 PDF 不等于能递送；正文、页码、空白、裁切、边缘、彩色/灰度和签名可见性都影响成品是否可用。当前自动化检查墨迹与边缘，并不识别哪张图是签名；最终可见性要看渲染页。" },
    { title: "自动检查不冒充整篇判断", detail: "字段和页面回归能发现机械漂移，但当前没有绑定 AI/人工整篇语义审阅回执，最终内容判断仍须明确完成。" },
    { title: "本人签名只证明本地版本", detail: "签名图片与规范资产哈希绑定；它不是证书签名、可信时间戳、对方签名或外部接收证明。" },
    { title: "ready_for_delivery（已具备递送条件）只表示版本已经锁定", detail: "接收对象、渠道、附件和文件指纹已固定后才能进入该状态；它始终不等于 delivered（已递送）。" },
    { title: "现实状态逐级、签回另行记录", detail: "delivered（已递送）、received（已收件）、handled（已处理）不能由本地输出推导；counterparty_signed_returned（对方签回）也不等于本人签名或事项已经解决。" },
    { title: "材料包可独立复验，但不造后台系统", detail: "v3 release 可以完整复制到空目录后验证；当前没有自动备份、数据库、服务、队列或断点续传镜像。" }
  ],
  gallery: [
    {
      src: "/media/document-materials/fictional-after-sales-page.png",
      alt: "完全虚构的售后处理与退款申请单页生成演示",
      caption: "完全虚构，仅作生成与排版演示：2.0.1 通过 Microsoft Word 生成同源 DOCX/PDF，并由 Poppler 渲染后完成 1/1 页彩色与灰度检查。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成演示",
      proves: "证明当前通用管线曾真实生成可读的一页正式材料，页码、正文和页面边缘验收通过。",
      doesNotProve: "不证明任何真实个人事项、真实签名、全部材料类型、外部递送或处理结果。",
      observedAt: "2026-09-01",
      sourceCommit
    }
  ],
  responsibilities: [
    "从当前事项、接收对象和最小必要原件形成可执行制作方案",
    "从同一规范输入生成可编辑 DOCX、固定版 PDF 和附件包",
    "按需要核对本人签名资产并把签名版本与未签版本分开",
    "重读所有输出字段，核对结构、页码、彩色/灰度页、DOCX 签名资产与 PDF 图像对象；最终签名可见性按实际渲染页另行说明",
    "形成不可覆盖、自包含、精确文件集合的 ready_for_delivery release",
    "把已生成、本人已签、可递送、已递送、已收件、已处理和对方签回分别说明",
    "中断或复制后从最近一次核对材料包恢复并独立 verify"
  ],
  exclusions: [
    "不把单文件编辑、原件查找、需求计划或普通写作绕进本项目",
    "不从仓库、旧路径、模糊文件名或内部日志猜私人事实与现实状态",
    "不把源码、测试、生成成功、签名图片或本地可递送状态写成已经递送、收到或处理",
    "不把对方签回写成本人签名、收件、履行、付款或事项解决",
    "不自动发送、付款、撤回或联系外部对象；这些动作仍需精确授权",
    "不公开具体命中 L3+ 的个人载荷、签名图、回执正文或可复用秘密；公开安全的状态、数量、路径类别、哈希机制、组件、失败和结果边界正常保留",
    "不建立中央个人数据库、RAG、后台同步、服务、队列或提醒中心"
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
  operatingFlow: [
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
    { ask: "把核对后的内容制作成可编辑文书和同源 PDF。", effect: "先形成 plan，再生成 DOCX/PDF 与附件；内部代码不会出现在对外正文。", moduleSlug: "editable-docx-pdf" },
    { ask: "逐页检查这个材料包，确认复制到另一目录后还能验真。", effect: "重读正文、检查页码和彩色/灰度页面，并按精确文件集合验证 v3 release。", moduleSlug: "page-audit-release" },
    { ask: "这份材料需要本人签名吗？现在能不能递送？", effect: "核对签名要求与规范资产；区分 produced（已生成）、signed（本人已签）和 ready_for_delivery（已具备递送条件），仍不执行递送。", moduleSlug: "signature-delivery-version" },
    { ask: "已经发出去了，对方收到、处理或签回了吗？", effect: "从现实来源分别回读 delivered（已递送）、received（已收件）、handled（已处理）和 counterparty_signed_returned（对方签回）；没有证据就保持未知。", moduleSlug: "reality-readback-recovery" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: `PRIVATE main ${sourceCommit} 定义 2.0.1 的输入、生成、审计、签名和 v2/v3 verify 语义。`, doesNotProve: "不证明任何真实原件、真实签名、接收渠道或现实结果可用。" },
    { layer: "Focused tests（聚焦回归）", proves: "32 项通用文书回归覆盖四类材料、输入漂移、closure、灰度页、v2兼容、wheel资源和不可覆盖。", doesNotProve: "合成 fixture 不能证明真实内容质量或外部动作。" },
    { layer: "Full repository tests（全仓回归）", proves: "526 项通过、6 项环境性跳过、101 个子测试通过，说明现有兼容功能未因本轮修复回退。", doesNotProve: "跳过项、真实设备和外部平台仍需各自验收。" },
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
    { date: "2026-08-31", commit: "fe7edc3", result: "形成中性正式事项 v2 的 plan/build/verify、DOCX/PDF、签名和 ready_for_delivery 主链。" },
    { date: "2026-09-01", commit: sourceCommit, result: "升级 2.0.1：封闭输出字段漂移、wheel Word 资源、页码与彩色/灰度验收、自包含 v3 release、空目录复验和 v2 限制兼容；全仓 526 项通过。" }
  ],
  snapshotUpdateNote: "本页是 2026-09-01 首次 source-first 全量快照。以后只有用途、输入/输出、签名、审计、release、状态、恢复或真实 E2E 发生会改变用户判断的实质变化时才原位更新；私人材料变化、普通重构、时间戳和哈希漂移不生成更新日志。"
};

const documentMaterialsModules = [
  {
    slug: "current-matter-sources",
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
    example: "购买记录写着一个日期，旧草稿又写着另一个日期。系统不挑看起来更顺的版本，而是固定两份来源、标出冲突并等待确认；只在事实闭合后进入制作。",
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
    relation: "本模块提供 plan 的可信输入；下一模块只消费这份规范值，不重新扫描或猜事实。"
  },
  {
    slug: "editable-docx-pdf",
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
    value: "不用分别手改电子版和打印版：一份规范内容同时得到可继续编辑的 DOCX、固定版 PDF 与按序附件。",
    why: "分别修改 Word 和 PDF 最容易让日期、请求、附件编号和签名块漂移；覆盖旧输出又会失去可恢复版本。",
    example: "同一份退款申请先生成 A4 DOCX，再由 Word 导出 PDF；若当前机器没有 Word，才用明确记录的本地 fallback，两个版本仍按同一字段重读。",
    result: "得到不可覆盖 build：规范输入、DOCX、PDF、附件、导出引擎、签名记录、审计清单和每个文件 SHA-256。",
    readerStates: {
      pass: "四类输入之一通过计划，DOCX/PDF 和附件从同一值生成，字段读回一致，可进入逐页验收。",
      problem: "Word、备用引擎、附件复制或正文读回有一项失败时保留临时/旧构建，不形成递送版本。",
      unavailable: "两个 PDF 引擎或文档依赖都不可用时保留 plan 和输入快照，不用旧 PDF 冒充本轮输出。"
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
    relation: "本模块形成 produced（已生成）或 signed（本人已签）的 build；逐页审计和自包含 release 由下一模块决定是否可进入 ready_for_delivery（已具备递送条件）。"
  },
  {
    slug: "page-audit-release",
    shortTitle: "逐页验收与材料包",
    title: "重读正文、检查彩色与灰度页面，再冻结自包含材料包",
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
    value: "材料包离开原构建目录仍能证明自己带齐了什么、每页长什么样和有没有被换掉。",
    why: "只有 DOCX/PDF 文件不够：输入、附件、逐页证据和签名来源缺一项，换机或复制后就无法解释成品怎样产生。",
    example: "完全虚构的一页申请生成后，系统重读正文，确认第1页页码，保存彩色与灰度页面并检查墨迹和边缘；release 复制到一个空目录后仍能独立通过。",
    result: "得到精确文件集合：输入、DOCX、PDF、附件、三类审计、逐页彩色/灰度图、所需签名快照、build manifest 和 release manifest。",
    readerStates: {
      pass: "所有字段和页面通过，v3 release 精确集合可在空目录独立 verify，可进入 ready_for_delivery（已具备递送条件）。",
      problem: "内容、页码、空白、边缘、灰度、签名、哈希、缺文件或多文件有问题时，只保留 build 和失败证据，不发布 release。",
      unavailable: "渲染器或结构读取器不可用时，机械逐页腿保持 unavailable；不把结构测试冒充视觉通过。"
    },
    stateLabels,
    decisionImpact: ["每页彩色与灰度图都是 manifest 可追溯 artifact，不是临时截图。", "可见页码逐页匹配；空白和边缘裁切使用 ink/edge 启发式检查。", "墨迹和边缘通过不证明签名身份、位置、对比度或未被遮挡；实际渲染页是进一步视觉核对的输入。", "自动化仍不能证明整篇语气和事实主线已由AI或人工审阅。", "v2 release继续可读，但明确返回legacy_v2_non_self_contained和limitations。", "复制到空目录后完整verify不等于已有自动备份或断点续传。"],
    problem: "解决“能打开就算完成”、递送包缺输入/审计、复制后无法复验和旧格式被新工具无版本破坏。",
    implementation: ["DOCX/PDF结构审计与全部输出字段读回先运行。", "Poppler按DPI渲染每页彩色PNG，再生成L模式灰度PNG。", "逐页记录大小、SHA-256、墨迹覆盖、边缘暗度和可见页码。", "v3 release按build manifest复制所有closure并拒绝额外文件。", "formal-verify在release根重跑嵌入build验证和当前结构/页面检查。", "v2/v3共享兼容schema；v2只按历史实际携带内容通过并返回限制。"],
    flow: ["重读DOCX/PDF正文", "检查结构和页码", "渲染全部彩色页", "生成并检查灰度页", "写审计与每页哈希", "复制完整closure到release", "核对精确文件集合", "空目录复制后独立verify"],
    concepts: [
      { term: "Closure（闭包）", explanation: "独立解释和验证成品所需的输入、输出、附件、审计、页面和签名快照完整集合。" },
      { term: "Exact set（精确集合）", explanation: "release 只允许 manifest 列出的文件；缺文件和额外文件都会让验证失败。" },
      { term: "Grayscale artifact（灰度页制品）", explanation: "由每张彩色渲染页转换的L模式页面，用于检查打印灰度下的墨迹和边缘。" },
      { term: "legacy_v2_non_self_contained", explanation: "历史v2仍可验证其真实携带内容，但没有v3输入、审计、灰度页和签名closure。" }
    ],
    boundaries: ["ink/edge不是整篇语义审阅或签名可见性证明", "渲染成功不证明签名正确且清楚可见", "灰度页不表示强制黑白输出", "manifest digest不是数字签名", "普通复制恢复不等于可续传mirror", "v2限制不会被静默升级"],
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
    verification: ["v3 release在原build删除后从空目录副本verify通过。", "删除输入或新增unexpected文件均失败。", "无可见页码PDF被拒绝，灰度页必须为L模式并重新审计。", "旧v2材料包通过有限验证且返回明确limitations。", "人工整篇语义审阅回执仍为gap。"],
    relation: "通过本模块才产生ready_for_delivery候选；是否签名以及本地状态由下一模块说明。"
  },
  {
    slug: "signature-delivery-version",
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
    example: "申请无需本人签名，build 保持 produced（已生成）；内容和页面通过后形成 ready_for_delivery（已具备递送条件）材料包。另一份协议要求本人签名，就先核对 profile 姓名和签名图片，匹配 DOCX 内的精确 hash，并检查 PDF 是否有图像对象；还要看实际渲染页上的签名位置与可见性，其他插图不能替它作证。",
    result: "得到 produced（已生成）或 signed（本人已签）的确切本地版本，以及 ready_for_delivery（已具备递送条件）材料包；状态里仍明确 delivered（已递送）=false。",
    readerStates: {
      pass: "明确无需签名，或所需资产、DOCX 内同图哈希及 PDF 图像对象数量通过，并且当前机械逐页审计通过时，CLI 可形成 ready release；这个状态不自动证明最终 PDF 中签名清楚可见。",
      problem: "签署人不符、资产缺失、profile 路径越界、DOCX 找不到同一资产或 PDF 没有图像对象时不 release。只有图片计数通过但未核实是哪张图、位置或可见性时，仍须保留这项待核，不能称签名视觉通过。",
      unavailable: "规范签名资产或页面检查不可用时暂停签名/ready步骤，不生成占位签名。"
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
    relation: "本模块只负责本地签名和递送版本；递送之后的现实状态必须进入下一模块回读。"
  },
  {
    slug: "reality-readback-recovery",
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
    example: "材料包已经 ready_for_delivery（已具备递送条件）并由本人递送，事项记录只推进到 delivered（已递送）；对方邮件确认收到后才进入 received（已收件）；后来返回签署文件则单独记录 counterparty_signed_returned（对方签回），仍不自动写 handled（已处理）。",
    result: "得到逐层现实状态、每层来源、当前版本、真正未知、下一步和恢复点；v3材料包可复制到新空目录后独立验证。",
    readerStates: {
      pass: "每个现实状态都有绑定确切版本的来源，或v3 release复制后完整verify；可以从当前状态继续。",
      problem: "只有本人报告、缺回执、状态冲突、v2限制或复制不完整时保留已确认层和Unknown，不重复动作。",
      unavailable: "外部渠道、事项记录或完整release不可用时暂停受影响步骤，保留原件和已有成品，不从构建日志推断现实。"
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
    relation: "这是本地制作与现实工作的分界线；项目到这里交回确切状态和下一步，不替外部对象行动。"
  }
];

export const project = documentMaterialsProject;
export const modules = documentMaterialsModules;
export { documentMaterialsProject, documentMaterialsModules };
