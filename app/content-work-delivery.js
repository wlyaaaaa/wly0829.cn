import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以正式构建", "需要确认", "当前不可用"];
const sourceMainCommit = "76521682176b00333fdf579746d4fbcfea88103e";
const implementationCommit = "c815ea3daa04d4012200419fa989a9808ab7be36";

const workDeliverySnapshot = createProjectSnapshot({
  observedAt: "2026-09-14T04:25:13.404623Z",
  label: "交付引擎保持 0.2.0；现实工作包总数未知，37项回归、隔离安装、合成Office与实现盲路线证据保留2026-09-01，现实价值尚无新验收",
  boundary: "现有合成证据证明0.2.0的确定性状态、质量门和输出。来源CLI按选定交付包和数据库工作，没有全局工作包总账；本轮未读取真实包，默认目录不存在也不能推出全局数量为0。9月1日验收未包含真实工作、真实来源变化、同模型同质量直接基线或数据库恢复，时间价值仍是baseline_required（需要基线）。",
  metrics: [
    { label: "正式输出", value: "6 个文件" },
    { label: "现实工作包总数", value: "Unknown（未知）" },
    { label: "历史真实变化验收", value: "0" },
    { label: "历史恢复验收", value: "0" }
  ],
  facts: [
    { label: "现实结果与历史验收", value: "产品固定生成6个正式文件；本轮没有全局真实工作包数量证据，总数保持Unknown（未知）。9月1日两套完全合成Office场景中的真实来源变化E2E和备份恢复验收均为0，这是验收范围，不代表现实没有工作包；时间价值仍是baseline_required。" },
    { label: "什么时候进入", value: "真实工作中的材料理解、沟通、决策、评审与交付都可进入既有项目。轻量支持直接完成；只有明确选入 2–5 份会继续变化的来源，且需要一致产物或持续维护 PRD 时，才建立交付包。" },
    { label: "共用本人背景", value: "相关时从个人理解库读取真实经历、生活重点与取舍；有依据的新本人认识在当前任务回写并回读。工作资料、业务事实、事项和交付仍由本项目负责，个人背景不能冒充已确认业务证据。" },
    { label: "当前正式输出", value: "只有 PRD.md、manifest.json、traceability.csv、产品需求文档.docx、项目评审.pptx、执行跟踪表.xlsx 六个文件；当前没有现成项目计划、周报或汇报产物。" },
    { label: "质量与一致性", value: "SQLite（本地状态库）拥有当前事实修订与 build；正式 Office 入口重建 canonical manifest（规范清单）并拒绝手写 ready、事实漂移、过期 build 和跨目录覆盖。" },
    { label: "失败时已经写入什么", value: "事实确认后的确定性 batch 以 15 秒为时间门，分别在状态提交、核心文件生成和 Office 生成后检查。超时表示时间验收失败，不自动撤销已经提交的包或文件；同一 build 的文件逐个替换，也不是跨文件原子事务。", hero: false },
    { label: "来源变化", value: "新版本中原文仍唯一存在就自动 rebound（重新绑定）；原文消失或匹配不唯一才把事实标为 stale（已过期），引用变化的旧 build 同时过期。" },
    { label: "源码与历史验收", value: `PRIVATE main ${sourceMainCommit}；0.2.0 实现 ${implementationCommit}。2026-09-01历史验收：37/37测试与Ruff通过，隔离wheel、两套合成Office E2E和实现盲自然路由已分层核对；本轮未重跑。`, hero: false },
    { label: "价值与缺口", value: "合成场景证明功能、质量和安装闭包，不证明真实工作节省时间；现有验收没有覆盖同模型同质量直接处理基线、真实工作包、真实来源变化、导出备份或数据库丢失恢复。本轮不扫描私人工作包补计总数。" },
    { label: "中国工作默认", value: "默认简体中文、Asia/Shanghai、YYYY-MM-DD 与人民币 CNY；使用需求方、产品、研发、测试、负责人、评审人等角色，并按背景、目标、范围、角色与流程、需求、指标、异常、验收、待确认组织 PRD。", hero: false }
  ],
  gaps: [
    "FactReviewEvent（事实审阅事件）记录前后状态、证据和非空理由，但没有 actor（操作人）字段，不能机械回答是谁做了这次决定。",
    "当前变更影响粒度是受影响事实与整个旧 build；还没有精确到某个 Office 文件、某个 ArtifactBlock（产物块）或某个页面/工作表的局部影响图。",
    "可靠输入仍以本地文本、Markdown 和 CSV 为主；DOCX、PDF、邮件和在线文档需要先由相应能力读取或导出，再作为明确文件进入。",
    "AI 对来源的分析、事实提取和判断在项目外完成；仓库负责确定性保存、质量门、构建和验收，不内置模型或声称自动理解任意材料。",
    "公开 artifacts 调用负责核对 current build 并生成文件；Office 重新导入、PPT 几何重叠、XLSX 公式和全部页面/工作表查看属于合成验收与测试证据，不是每次 builder 调用自动执行的产品门。",
    "15 秒时间门在各阶段已写入后检查，不提供整次回滚；核心与 Office 文件也逐个替换，没有跨文件原子事务。超时或替换中断后必须核对实际已提交状态，不能从非零退出推断全部未发生。",
    "时间结论仍为 baseline_required：没有同模型、同思考强度、相近输入和同质量的直接处理基线。",
    "9月1日验收没有包含真实工作或真实来源变化E2E；本轮未取得新的现实验收，不能据此断言现实没有工作。两套完全合成Office场景不能替代现实价值和真人判断。",
    "没有交付包导出、SQLite 备份、数据库丢失恢复或跨机器迁移入口；Git 只能恢复源码，不能恢复真实工作包。"
  ]
});

const workDeliveryProject = {
  order: 16,
  slug: "work-delivery",
  usageEntry: "普通工作问题直接在对话中处理；只有几份持续变化的来源要反复支撑 PRD、评审或跟踪文件时，才建立现有交付包。",
  usageInputs: ["本次工作目标与想要的结果", "需要建包时选定的 2 至 5 份资料", "本轮所需的文件格式"],
  title: "工作支持与交付",
  route: "/projects/work-delivery",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "0.2.0一致交付与质量门已在合成场景验证；现实工作包总数未知，真实价值尚无新验收",
  cardStatusTone: "mixed",
  ...workDeliverySnapshot,
  kicker: "先解决眼前工作，需要时再维护成套交付",
  searchAliases: [
    "工作交付副驾驶",
    "持续交付包怎样保持多种文件一致",
    "来源版本改变后怎样进入下一版",
    "会议纪要和指标表生成一致交付包",
    "PRD评审PPT执行跟踪同一事实版本",
    "交付包来源追溯和过期判断"
  ],
  repositoryNote: `实现位于 PRIVATE（私有）仓库 work-delivery-copilot，当前 main 为 ${sourceMainCommit}；0.2.0 行为实现在 ${implementationCommit} 闭合，73f92f1 记录原有实现盲自然路由 E2E，57bf3c6 将既有项目明确为工作支持与交付，并接入相关本人背景；7652168 将进度要求统一为及时事实反馈与有依据的时间区间，移除固定五分钟及准确 ETA 承诺；没有改变 0.2.0 交付引擎字节，旧合成验证保持原观察时间。公开页保留产品合同、数据关系、CLI（命令行入口）、版本、测试、失败、恢复缺口和完全合成图片；不公开任何真实公司资料、工作数据库或交付包。`,
  summary: "工作中的资料理解、沟通、决策、评审和交付都由这个既有项目承接。一个普通工作问题可以直接讨论、判断并交付结果；不需要为了得到一封回复或一份文件先建交付包。当一项工作依赖几份持续变化的需求说明、会议记录、规则或表格时，再进入已有交付引擎：冻结来源版本，分开事实、假设、冲突与未知，从同一事实修订版生成一致成品，来源变化后只复核真正受影响的部分。相关本人背景从个人理解库按需取用，业务事实仍来自当前选定工作资料。",
  why: "分别维护需求文档、评审材料和执行表时，同一个日期、范围、负责人、指标或验收口径很容易出现多个版本。更危险的是来源已经变化，旧成品看起来仍然完整，却没人知道它引用了失效证据。这个项目把来源版本、决定理由、正式构建和变更影响放在一条可核对的本地链里。",
  plainExample: "我可以说：“用这份立项说明、评审纪要和执行计划做一套交付材料；先把互相冲突的日期、范围和负责人列出来，这一轮只生成 PRD。”项目会先告诉我三份来源覆盖了什么、哪些事实可以采用、哪些仍要决定；确认后只生成本轮需要的 PRD 和追溯清单，不提前制作评审演示或执行表。",
  result: "轻量工作支持直接交回分析、沟通建议或本轮请求的单件文件。进入交付包并请求完整输出时，得到六个可追溯且口径一致的文件：PRD.md、manifest.json、traceability.csv、产品需求文档.docx、项目评审.pptx 和执行跟踪表.xlsx；只要 PRD 时不等待另外两类 Office 文件。不同事实版本各用自己的目录，同一版本可以重新生成，不会互相覆盖。我还会知道来源、已确认事实、假设与冲突、哪些结果已经过期，以及本轮真正写到了哪一步。",
  readerStates: {
    "pass": "普通工作先交回可用的分析、沟通建议或单件文件；需要交付包时，事实确认后只生成这轮点名的文件，并说明哪些格式已做成、哪些还没做。",
    "problem": "关键事实缺来源、互相冲突或资料已经换版时先交待确认草稿。生成超时也要先看实际留下的文件，不能凭报错认定什么都没发生。",
    "unavailable": "资料、保存状态或某种 Office 制作环境不可用时保留已完成的来源、判断和文件，说明停在哪一步；不重复建包或把预览当正式成品。"
  },
  stateLabels,
  methodCanvas: {
    "kicker": "工作交付怎样保持一致",
    "headline": "只用这次选定的资料，让本轮文件说同一版事实",
    "description": "普通工作可以直接分析和交付；只有几份资料会持续变化、多个文件必须口径一致时，才建立可追溯的交付包。AI负责理解，项目负责记住来源、决定与真实文件状态。",
    "steps": [
      {
        "actor": "先判断",
        "title": "这件事真的需要交付包吗",
        "detail": "一次回复或单件文件直接做；资料会换版且多份成品要一致时才保存包。"
      },
      {
        "actor": "本人选资料",
        "title": "只用这次点名的几份文件",
        "detail": "选择当前有用的立项、纪要或计划，其他目录和旧对话不顺手读取。"
      },
      {
        "actor": "AI核对",
        "title": "先说清事实、冲突和未知",
        "detail": "把日期、金额、范围、负责人等逐项指回原文；资料多或有冲突时说明真实进展和下一检查点，不拿模板猜。"
      },
      {
        "actor": "本人取舍",
        "title": "只决定真正未定的问题",
        "detail": "需要人的选择才问；已有确认和证据由项目保存，不反复让人录入。"
      },
      {
        "actor": "项目验收",
        "title": "确认这一版已可正式制作",
        "detail": "项目自己检查来源、事实和待办是否一致；外部文件自称“已通过”不能跳过这一步。"
      },
      {
        "actor": "按需交付",
        "title": "只生成这轮需要的文件",
        "detail": "需求文档、评审演示和执行表从同一版事实制作；只要 PRD 时不等待其他格式。"
      },
      {
        "actor": "资料换版",
        "title": "只重看受影响的结论",
        "detail": "能在新版唯一找到的原话继续用；失去依据的结论和旧文件标过期，保留历史版本。"
      }
    ],
    "columnsAriaLabel": "本人、AI与工作交付项目的责任边界",
    "columns": [
      {
        "title": "本人提供与决定",
        "note": "目标、选定资料和真实冲突",
        "items": [
          "说明工作目标与这次要交的文件",
          "确需建包时明确选定几份当前资料",
          "在真实冲突或取舍上作决定"
        ]
      },
      {
        "title": "AI协助",
        "note": "理解和专业判断",
        "items": [
          "从选定资料提炼候选事实并指出原文",
          "解释冲突、缺口和可采用的结构",
          "根据实际进展说明何时能交，不把机械通过说成真实价值"
        ]
      },
      {
        "title": "项目负责",
        "note": "版本、一致性与恢复点",
        "items": [
          "保存来源版本和决定理由",
          "确认正式制作条件并从同一事实版生成请求的文件",
          "资料变动后标出过期部分和已完成文件"
        ]
      }
    ]
  },
  productPrinciples: [
    {
      "title": "值得持续追溯时才建包",
      "detail": "普通分析与单件文件直接完成；只有来源会持续变化、成品口径必须一致时才增加交付包。"
    },
    {
      "title": "日常工作默认符合中文环境",
      "detail": "默认简体中文、中国时区和人民币；需求文档涵盖目标、范围、流程、异常和验收，Word、演示与表格可在常用办公软件中打开。精确格式留在技术层。"
    },
    {
      "title": "来源由本人明确选择",
      "detail": "第一次只用本轮点名的少量资料，不扫描同目录、邮箱、账号或旧对话。"
    },
    {
      "title": "先说事实，再做成品",
      "detail": "先交回来源覆盖、关键事实、冲突和未知；重要问题没解决时，排版再好也只是待确认草稿。"
    },
    {
      "title": "多种文件共用一版事实",
      "detail": "需求文档、评审演示和执行表不能各自手改出不同日期或范围。"
    },
    {
      "title": "正式制作条件由项目自己核对",
      "detail": "项目从保存的事实和来源计算是否可制作；手工标成“已通过”或偷偷改动证据不会放行。"
    },
    {
      "title": "决定留有前后原因",
      "detail": "确认、驳回、退回和重新定位来源都保留变化与理由；当前记录尚不能冒充完整的多人审批审计。"
    },
    {
      "title": "资料变化只影响相关部分",
      "detail": "原话在新版里仍唯一可找到就继续用；消失或不唯一才让相关结论待审。"
    },
    {
      "title": "新旧版本各在自己的目录",
      "detail": "下一版不覆盖旧成品；同一当前版本可以重新生成自己的文件，不把部分新旧文件混成一套。"
    },
    {
      "title": "功能证明与真实省时分开",
      "detail": "合成材料能生成和检查，只证明这些功能；真实工作值不值得采用，要拿同等质量的直接做法比较。"
    },
    {
      "title": "时间成本决定是否收窄",
      "detail": "若建立追溯包反而让首次交付或后续改版更慢，就退回更窄的工作流或单一成品，不因形式专业强行保留。精确比较门槛留在技术依据。"
    },
    {
      "title": "恢复不了就直说",
      "detail": "交付包可以保存当前过程，但目前缺数据库丢失后的正式恢复能力；源代码无法反推出真实工作状态。"
    }
  ],
  gallery: [
    {
      src: "/media/work-delivery/fictional-prd-page.webp",
      alt: "完全虚构的内部审批效率优化项目产品需求文档代表页",
      caption: "完全虚构的 PRD 代表页：同一个 build 显示目标、范围、验收、事实状态和来源定位。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成输出",
      proves: "证明 0.2.0 的 DOCX 构建器能把 canonical manifest 中的确认事实、事实修订号和证据定位组织成可读页面。",
      doesNotProve: "不证明 AI 已正确理解真实工作、整份 PRD 的专业质量、全部页面版面或任何真实项目已经完成。",
      observedAt: "2026-09-01",
      sourceCommit: implementationCommit
    },
    {
      src: "/media/work-delivery/fictional-review-slide.webp",
      alt: "完全虚构的项目评审关键事实页",
      caption: "完全虚构的项目评审页：10 条事实、确认状态和同一事实修订版集中呈现。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成输出",
      proves: "证明 PPTX 构建器能从同一规范清单读取关键事实、类型和确认状态，并形成一页可读评审表。",
      doesNotProve: "不证明真实评审已经召开、所有幻灯片均无版面问题、事实获得组织批准或项目可以上线。",
      observedAt: "2026-09-01",
      sourceCommit: implementationCommit
    },
    {
      src: "/media/work-delivery/fictional-execution-tracker.webp",
      alt: "完全虚构的执行跟踪表工作表",
      caption: "完全虚构的执行跟踪表：执行事项、负责人、日期、状态、关联事实和验收备注来自同一 build。",
      evidenceLevel: "E1",
      evidenceLabel: "公开合成输出",
      proves: "证明 XLSX 构建器能把同一事实修订版投影为可维护的执行跟踪工作表，并保留关联事实 ID。",
      doesNotProve: "不证明真实负责人接受任务、状态会自动更新、外部任务系统已连接、公式覆盖全部场景或真实团队已经使用。",
      observedAt: "2026-09-01",
      sourceCommit: implementationCommit
    }
  ],
  responsibilities: [
    "普通工作问题直接协助理解、沟通、决策和单件交付；确实需要持续追溯时才建包。",
    "只保存本人选定的几份资料和这次版本，不读无关目录。",
    "把准备进入成品的日期、金额、范围与负责人对回原文，保留确认、假设、冲突和未知。",
    "正式制作条件由项目核对，不能靠手写“已通过”或一份漂亮草稿放行。",
    "从同一版事实生成本轮要的需求文档、评审演示、跟踪表及必要追溯文件。",
    "资料换版时只重新看真正受影响的结论，旧成品保留但会标明是否过期。",
    "制作中断先核对实际留下的文件与最近可靠版本，再交回继续位置。"
  ],
  exclusions: [
    "一次性回复、单件 Word 或表格不强制建包；学习、私人正式材料等仍走所属项目。",
    "不扫描未选的目录、账号、邮件、在线文档、仓库或旧对话。",
    "不为交付包再建一个 AI 模型、全文搜索服务、监听器或第二份业务状态库。",
    "不声称能生成尚未实现的计划、周报或其他未请求文件。",
    "不自动发送、审批、邀请、建任务、发布或修改外部系统。",
    "合成测试和文件生成速度不等于已在真实工作里节省时间。",
    "源码和安装包不能恢复丢失的真实交付包；缺备份时如实说明。"
  ],
  glossary: [
    { term: "Package（交付包）", meaning: "围绕一个持续工作事项保存来源、事实修订、决定、构建、追溯和变化影响的本地状态。" },
    { term: "SourceSnapshot（来源快照）", meaning: "本人明确选入的一份资料在某个版本的不可变内容、SHA-256 和元数据；新版本不覆盖旧版本。" },
    { term: "EvidenceSpan（证据片段）", meaning: "一个事实对应的原文片段与系统计算定位；文本用行列和字符范围，CSV 还记录行列。" },
    { term: "Fact revision（事实修订版）", meaning: "每次事实、审阅或来源绑定变化后的统一修订号，所有正式成品都绑定一个确定修订版。" },
    { term: "Canonical manifest（规范清单）", meaning: "从 SQLite 当前 build 重建的唯一正式清单；调用方手写文件不能替代。" },
    { term: "rebound（重新绑定）", meaning: "原文在新来源版本中仍唯一存在时，把证据自动指向新快照而不要求再次确认。" },
    { term: "stale（已过期）", meaning: "事实证据已失效或旧 build 引用发生变化，不能继续作为当前正式版本。" },
    { term: "baseline_required（需要基线）", meaning: "功能可以通过，但没有同模型同质量直接处理对照，不能声称已经节省总时间。" }
  ],
  operatingFlow: [{"title": "先判断工作类型", "detail": "沟通、分析或单件文件直接处理；持续来源与多种交付物才建立包。"}, {"title": "固定选定版本并核对事实", "detail": "只读本人选的资料，区分已确认事实、假设、冲突和未知；日期、金额及负责人不凭印象补齐。"}, {"title": "从同一事实版做本轮文件", "detail": "先生成可追溯的核心内容，只制作此次需要的 DOCX、演示或表格，其他格式以后可补。"}, {"title": "来源变动时有界重做", "detail": "新版本只影响相关判断与旧构建，保留以前版本；交回当前文件、验收状态和仍需决定的问题。"}],
  technicalSections: [{ title: "正式构建的状态合同", paragraphs: ["正式入口从 SQLite 当前规范事实重建 manifest；手写 quality.status=ready，或改动 goal、fact、evidence、hash，均不能代替质量门。"] }],
  technicalOperatingFlow: [
    { title: "判断是否需要交付包", detail: "普通工作支持直接完成，单文件调用对应制品能力；只有持续来源 + 多种交付物，或确定会更新的 PRD 才进入包引擎。" },
    { title: "创建稳定 package", detail: "一次 batch 提交稳定 ID、标题、目标、2–5 份来源、候选事实和本轮所需格式；重复 ID 在写入前拒绝。" },
    { title: "冻结来源与证据", detail: "保存字节、SHA-256、来源版本和系统计算定位；未选文件不被枚举或读取。" },
    { title: "确认事实与理由", detail: "事实、假设、冲突和未知分别处理；每次真实状态变化追加审阅事件。" },
    { title: "构建并核对核心文件", detail: "生成 PRD.md、manifest.json 和 traceability.csv，质量不 ready 时只保留待确认草稿。" },
    { title: "生成所需 Office 文件", detail: "公开 artifacts 入口从 SQLite 核对 current build；只请求 DOCX 时不启动 PPTX/XLSX。" },
    { title: "来源变化后做影响", detail: "先 update-source，再 impact；自动重新绑定唯一原文，标记真正失效事实与旧 build。" },
    { title: "确认下一版与恢复点", detail: "只读 verify 当前 manifest，处理新增问题后用新 build ID 生成下一版，旧目录保持不变。" }
  ],
  components: [
    { name: "work-delivery Skill", responsibility: "从自然工作请求判断是否进入持续交付包。", implementation: "只做发现、边界判断和稳定入口说明；不复制 SQLite、质量门或 Office 实现。" },
    { name: "统一 CLI 与 batch schema", responsibility: "让新包、逐步更新、影响、验证和正式成品走一个公开入口。", implementation: "work-delivery.batch.v1 一次提交稳定 ID、2–5 份来源、证据事实和格式；PowerShell 入口与 Python CLI 共用同一实现。" },
    { name: "WorkDeliveryStore", responsibility: "拥有 Package、SourceSnapshot、EvidenceSpan、Fact、ReviewEvent、ArtifactBuild 与 ChangeSet。", implementation: "单个 SQLite 保存 current/history；package 默认 zh-CN、Asia/Shanghai、CNY，money/date/datetime 使用结构化值，决定事件追加写入。" },
    { name: "DeliveryCompiler", responsibility: "从当前事实修订生成 PRD、追溯与规范清单。", implementation: "质量门检查目标、必填章节、证据、关键冲突和 stale；语义 hash 与事实修订绑定。" },
    { name: "正式 Office builders", responsibility: "从同一规范清单生成 DOCX、PPTX 和 XLSX。", implementation: "公开 artifacts 入口先核对 database + build；内部 builder 要求进程内 canonical binding，并固定正式输出目录。" },
    { name: "验收与隔离 wheel", responsibility: "证明源码、安装闭包、三类 Office、变化影响和复杂度边界。", implementation: "37 项测试、Ruff 和两套合成场景在 artifacts 之后执行 Office 重新导入与公式/几何检查；这些是验收证据，不是每次 builder 自动步骤。wheel 携带 schema、样本和 builders。" }
  ],
  usageExamples: [
    { ask: "我有立项说明、评审纪要和执行计划，先建一个可持续更新的交付包。", effect: "只纳入我明确选择的三份来源，并先交回覆盖范围、冲突和准备采用的结构。", moduleSlug: "package-sources" },
    { ask: "哪些事实能正式采用？这个金额、日期和表格行列能不能回到原文？", effect: "逐条给出原文位置、采用理由、冲突和未知，并明确当前还没有记录审阅者身份。", moduleSlug: "evidence-quality" },
    { ask: "确认后只生成 PRD；评审和执行表下一轮再要。", effect: "只生成与当前事实版本一致的 PRD 和追溯清单，项目评审与执行跟踪表留到我明确需要时。", moduleSlug: "consistent-deliverables" },
    { ask: "执行计划换成新版了，告诉我哪些事实和旧文件真的过期。", effect: "仍能在新版中唯一找到原文的事实会继续沿用；已经消失或出现歧义的事实及相关旧文件会明确标为过期。", moduleSlug: "source-change-next-version" },
    { ask: "现在到底完成到哪一层？失败后能从哪里继续，是否已经证明省时间？", effect: "分别说明功能、文件生成、真实工作、时间对照和数据库恢复是否做过，并交回最近可靠的继续位置。", moduleSlug: "value-state-recovery" }
  ],
  evidenceLayers: [
    { layer: "源码与产品合同", proves: `PRIVATE main ${sourceMainCommit} 确认 0.2.0 的数据关系、统一入口、质量门、正式输出和明确不做项；行为实现闭合于 ${implementationCommit}。`, doesNotProve: "源码存在不证明当前安装、Office 运行时、真实工作或 Pages 已生效。" },
    { layer: "37 项源码回归与 Ruff", proves: "2026-09-01 加载 Office 运行时后 37/37 测试通过，Ruff 通过，覆盖核心、质量门、CLI、不可覆盖、安装闭包和构建失败语义。", doesNotProve: "测试样本不能证明任意公司材料都能被正确分析。" },
    { layer: "隔离 wheel", proves: "安装包脱离源码目录仍携带稳定 CLI、schema、两个样本和三个正式 builder。", doesNotProve: "wheel 不能恢复已有真实 SQLite，也不证明自然语言一定选对入口。" },
    { layer: "两套合成 Office E2E", proves: "两个完全合成场景都从 SQLite current build 生成 DOCX/PPTX/XLSX，并完成重导入、几何和公式检查。", doesNotProve: "合成场景不证明真实工作价值、真实来源变化或真人采用。" },
    { layer: "当前实现盲自然路由 E2E", proves: "fresh Sol Max 未获 Skill、工具或内部路线提示，自主选择 work-delivery，只读 3/3 指定来源，建立唯一 package，确认 27 条事实与 39 条追溯；5 条待确认中的 4 条阻断正式交付，quality 保持 draft，只生成三个 core files，Office builder 为 0，current build verify 通过且旧 build stale。", doesNotProve: "约 12 分 12 秒可见墙钟和 0.043 秒成功 batch 核心不证明真实工作提速；本次也没有正式 DOCX/PPTX/XLSX E2E。" },
    { layer: "三张公开合成图片", proves: "当前 PRD、评审页和执行跟踪表的可视化形式与同一 manifest 语义一致。", doesNotProve: "图片不是产品 UI，不证明全部页面、动态操作或真实项目。" },
    { layer: "真实工作与恢复", proves: "当前只能证明尚未运行：时间状态为 baseline_required，真实工作、真实变化、导出备份和恢复均未闭合。", doesNotProve: "Unknown 和 not_run 不能升级为失败或通过。" }
  ],
  operationalEntrypoints: [
    { name: "一次新建交付包", command: "work-delivery batch --request <request.json>", purpose: "单进程提交稳定 package ID、2–5 份来源、候选事实和本轮所需格式。" },
    { name: "来源更新", command: "work-delivery update-source --database <db> --package <id> --source-key <key> --file <file>", purpose: "生成新 SourceSnapshot 与 ChangeSet，不覆盖旧来源；文件也可作为位置参数传入。" },
    { name: "查看影响", command: "work-delivery impact --database <db> --package <id> --change-set <id>", purpose: "返回重新绑定事实、过期事实和过期 build。" },
    { name: "只读核对", command: "work-delivery verify --database <db> --build <id>", purpose: "逐字段比较持久化 manifest 与 SQLite 当前规范事实。" },
    { name: "正式 Office 构建", command: "work-delivery artifacts --database <db> --build <id>", purpose: "只接受 verify 可通过的 current build，并在原目录生成请求的 Office 文件。" }
  ],
  evolution: [
    {
      "date": "2026-08-31",
      "title": "避免几份交付材料各说各话",
      "commit": "",
      "result": "把选定来源、事实、假设和冲突放在同一版本，需求文档、评审与跟踪文件由共同事实生成。",
      "evidence": [
        {
          "date": "2026-08-31",
          "note": "来源、证据、事实与变化影响进入同一最小核心。",
          "commit": "21c12e3"
        }
      ]
    },
    {
      "date": "2026-09-01",
      "title": "来源改了，知道哪些旧结果要重看",
      "commit": "",
      "result": "旧成品保留，新来源只让真正受影响的事实和构建失效；只要PRD就不等待演示和表格，未确认问题不被手写成功状态掩盖。",
      "evidence": [
        {
          "date": "2026-08-31—09-01",
          "note": "质量门、批量入口和Office生成回到实际用户路径。",
          "commit": "c9c5dfa–406c3f1"
        },
        {
          "date": "2026-09-01",
          "note": "0.2.0一致构建与来源重新绑定已有合成验收；不证明现实工作提速或数据库丢失恢复。",
          "commit": "c815ea3–73f92f1"
        }
      ]
    },
    {
      "date": "2026-09-05–09-12",
      "title": "不是每件工作都值得先建一个包",
      "commit": "7652168",
      "result": "普通沟通、判断和一次性文件直接完成；只有来源会持续变化、需要保持多份输出一致时才进入成套流程。专业事实与共同本人背景分工，阶段汇报说实际进展。"
    }
  ],
  snapshotUpdateNote: "本页只在 work-delivery-copilot 或 work-delivery Skill 的正式发布与回读产生实质产品变化时更新。再次刷新会重新读取当前 PRIVATE main、Skill、源码合同、测试和合成验收；真实工作、时间基线和恢复能力没有新证据时继续明确保留为未完成。",
  "readerBoundary": "普通沟通和单件文件不必建交付包。持续来源模式可以生成六种文件，但真实来源冲突未解决时保留草稿；实际工作提速和数据丢失恢复仍无本轮证明。",
};

const commonModuleShape = (definition) => ({ ...definition, stateLabels });

const workDeliveryModules = [
  commonModuleShape({
    slug: "package-sources",
    usageEntry: "说清这件工作要交付什么，并点名持续使用的几份资料。",
    usageInputs: ["稳定的事项目标", "本人选定的 2 至 5 份来源", "本轮真正需要的格式"],
    readerStatus: "已有把选定的2至5份资料建成持续交付包的功能；当前输入主要是本地文字和表格文本，不自动读取未选文件。",
    shortTitle: "交付包与来源",
    title: "先判断是否值得建包，再冻结本人明确选择的来源",
    searchAliases: ["怎么建立持续更新的交付包", "只读取我选中的资料", "package ID重复怎么办", "需求说明会议纪要指标表一起处理", "一次性PRD要不要建库", "中国工作环境默认值是什么"],
    searchProjection: {
      intents: ["创建持续工作交付包", "明确选择少量来源", "判断一次性任务绕过", "拒绝重复 package ID"],
      entities: ["Package", "SourceSnapshot", "package ID", "work-delivery.batch.v1", "2-5 sources", "SQLite"],
      relations: ["package拥有source snapshots", "source snapshot保存hash和version", "batch创建唯一package", "一次性文件绕过package"],
      failureRecovery: ["重复ID写入前拒绝", "未选文件保持隔离", "来源不可读停止该包", "已有包走更新入口"]
    },
    teaser: "交付包不是一个文件夹：它只在持续来源关系成立时出现，并只保存本人本次明确选择的 2–5 份资料。",
    status: "0.2.0 已提供稳定 batch 新建、逐步 CLI、不可变来源版本与未选文件隔离；输入类型仍以本地文本、Markdown 和 CSV 为主",
    statusTone: "mixed",
    value: "同一件工作要反复使用几份会变化的资料时，先由我明确选定2至5份文件及目标，并保存它们本轮的版本。以后补充判断或修改交付物，都能回到这一组来源。",
    why: "每次重新建一套或顺手读同目录其他文件，会让事实和旧成品的版本分叉，也可能把无关资料带入结果。",
    example: "我可以说：“只用这份立项说明、评审纪要和执行计划建交付包，同目录其他文件不要读。”项目会固定这三份来源，并先交回覆盖范围和冲突。",
    result: "得到这件工作明确选定的资料版本和可继续的交付包；这一步还不是读完材料、确认事实或生成正式文件。",
    readerStates: {
      pass: "目标和选定的2至5份文件都清楚且可读时，保存这一件工作的来源版本和初始判断，再告知下一步。保存来源不等于已经生成文件。",
      problem: "文件数量、内容或标识不合要求时，在加入新事实前指出具体问题；同一工作已有交付包就从原包继续。",
      unavailable: "无法读文件或保存状态时保留原件。若超时发生在保存之后，先查看原包实际是否已建立，再继续后续步骤，避免重复新建。"
    },
    productFlow: [{ title: "先判断是否真的需要包", detail: "AI 判断这件事是否依赖多份会变化的资料；一次性工作直接交付，确需建包才进入版本保存。" }, { title: "保存本轮版本", detail: "只保存选中的文件与来源关系，不顺带读取同目录资料；告诉我哪些已保存、哪些仍要分析。" }, { title: "交回可接续的包", detail: "说明本轮冻结了哪些版本、接下来要核对哪些事实。来源数量或身份不合要求时不留下半成品，改正选择后再开始。" }],
    decisionImpact: ["一次性单文件、普通文本 PRD、学习和私人正式材料绕过。", "来源必须是本人本次明确选择的 2–5 份文件。", "同一 package ID 第二次 batch 是明确错误。", "已有包用 update-source、impact、review、build、verify 和 artifacts 继续。", "默认简体中文、Asia/Shanghai、YYYY-MM-DD 与人民币 CNY；中国企业角色和 PRD 章节结构是当前产品合同，不是调用方随意显示文本。", "正式输出使用标准 OOXML，兼顾 WPS 与 Microsoft Office；核心不保存个人/公司配置分支。", "DOCX/PDF、邮件和在线文档当前先经对应能力读取或导出。"],
    problem: "解决随机重建、来源范围失控、未选文件混入和一个事项出现两套状态的问题。",
    implementation: ["work-delivery.batch.v1 在写库前校验 package、sources、facts 和 build。", "run_batch 的 store._transaction 一起提交新包、来源、事实和审阅；随后才检查第一次 15 秒时间门，超时不会回滚已经提交的事务。", "Package 保存标题、目标、locale、timezone、currency 和 fact revision；默认值为 zh-CN、Asia/Shanghai 与 CNY。", "SourceSnapshot 保存 source key、名称、provider label、版本、字节数、SHA-256 和 supersedes。", "文本支持 UTF-8 与 GB18030；CSV 后续由证据层计算行列。", "标准 OOXML 输出使用 YYYY-MM-DD 与中国企业常用角色/章节语义，兼顾 WPS 与 Microsoft Office。", "单个 SQLite 是唯一状态库，没有 watcher、后台同步或第二数据库。"],
    flow: ["判断持续来源关系", "选择2–5份资料", "给稳定package ID", "校验完整batch", "创建package", "冻结来源字节与hash", "返回当前包和下一步"],
    concepts: [
      { term: "Package ID（交付包标识）", explanation: "一个持续工作事项的稳定非空身份；不是每次运行重新生成的临时编号。" },
      { term: "SourceSnapshot（来源快照）", explanation: "一份已选资料在某次导入时的不可变版本；新版本通过 supersedes 关系接续。" },
      { term: "Provider label（来源标签）", explanation: "说明文件怎样进入；当前只是惰性追溯标签，不是账号连接器。" },
      { term: "China defaults（中国工作默认值）", explanation: "简体中文、Asia/Shanghai、YYYY-MM-DD、人民币 CNY、中国企业角色和完整 PRD 章节结构；它们影响事实解释与成品，而不是装饰性格式。" }
    ],
    boundaries: ["只读本人明确选择的资料", "不扫描目录或账号", "不做任意Office输入解析", "不建立多人协作或云租户", "一次性文件不建包"],
    failures: [
      { condition: "Package ID 已存在", response: "任何新事实写入前拒绝，使用原 package 的更新入口。" },
      { condition: "来源少于 2 或多于 5", response: "schema 校验失败，不创建数据库或半成品。" },
      { condition: "来源在读取中变化", response: "导入失败；重新选择当前文件，不把两个版本拼成一个快照。" },
      { condition: "新包事务提交后的时间检查失败", response: "返回时间失败，但该稳定 ID、来源和事实可能已持久化；先核对原包，再从已存在状态继续，不用新建命令重复导入。" }
    ],
    sources: [
      { path: "PRIVATE product contract · user path", role: "进入条件、2–5份来源和绕过边界" },
      { path: "PRIVATE source · batch.py", role: "batch schema、预校验、稳定ID和原子新建" },
      { path: "PRIVATE source · store.py", role: "Package与SourceSnapshot持久化" }
    ],
    verification: ["重复 ID 在新增事实前拒绝。", "未选文件不被枚举或读取。", "中文文件名与 GB18030 来源可追溯。", "schema/example 与 live parser 一致。", "任意 Office、邮件和在线来源仍为当前 gap。"],
    relation: "本模块形成稳定 package 和来源版本；证据、事实和正式质量由下一模块拥有。"
  }),
  commonModuleShape({
    slug: "evidence-quality",
    usageEntry: "让 AI 先核对材料里的日期、范围、金额和负责人再成稿。",
    usageInputs: ["这次要形成的工作判断或文件", "只有实际冲突需要本人取舍时才给明确选择"],
    readerStatus: "已有核对金额日期、引用、冲突与审阅的功能，可区分草稿和正式构建；审阅记录仍缺少操作者身份字段。",
    shortTitle: "证据与质量门",
    title: "把事实、假设、冲突和未知分开，再由 SQLite 计算能否正式构建",
    searchAliases: ["事实能回到哪段原文", "金额日期时间怎么保存", "CSV行列证据定位", "手写ready为什么被拒绝", "审阅理由和操作人", "关键冲突为什么只出草稿"],
    searchProjection: {
      intents: ["核对事实来源", "审阅事实和假设", "判断quality ready", "查看审阅历史与缺口"],
      entities: ["EvidenceSpan", "Fact", "FactReviewEvent", "money", "date", "datetime", "CSV locator", "quality.status"],
      relations: ["fact绑定evidence spans", "review event追加前后状态", "quality由current facts计算", "canonical manifest从SQLite重建"],
      failureRecovery: ["缺证据只出draft", "关键冲突阻断formal", "手写ready拒绝", "actor未知明确保留"]
    },
    teaser: "正式文件之前先过事实门：证据定位、结构化值、确认理由、关键冲突、范围、异常和验收都要能从当前状态解释。",
    status: "typed money/date/datetime、CSV 行列、追加审阅理由与 canonical quality gate 已实现；审阅事件仍不记录 actor",
    statusTone: "mixed",
    value: "AI把准备写进交付物的金额、日期、范围和负责人逐项对回选定原文，再分清已确认事实、假设、互相冲突的说法和仍未知的事。我能看到哪些问题还需决定，避免把猜测写成正式结论。",
    why: "日期或金额只要和原文对不上，就可能让几份文件一起引用一个错误值。项目必须自行核对事实和未决冲突，而不是接受外部写入的“已通过”。",
    example: "我可以问：“这条预算和日期能写进正式文件吗？请指出它们分别来自哪里，冲突先别替我决定。”项目会把金额、日期和表格位置对应回原文；关键冲突没解决时只交草稿。",
    result: "得到每条结论的来源位置、确认理由、冲突与缺项，以及这一轮只能交草稿还是可以生成正式文件的判断。决定由这件工作的负责人作出，工具不会因为外部文件自称通过就接受。",
    readerStates: {
      pass: "重要结论都能回到当前资料，目标、范围、异常处理和验收写清楚，关键冲突也已解决时，才说明可以制作正式文件。",
      problem: "依据缺失、重要结论待确认、资料已换版或说法冲突时，交回草稿和具体待决定项。",
      unavailable: "当前资料或已保存的事实不可读时，保留原文件并暂停正式制作；外部写一张‘已通过’清单不能替代核对。"
    },
    productFlow: [{ title: "把候选结论对回原文", detail: "AI列出金额、日期、范围等结论，并指出每一项来自选定文件的哪里。" }, { title: "处理冲突再决定能否正式制作", detail: "负责人确认重要事实与取舍；缺依据或冲突未解时只交草稿和待决定项。" }, { title: "交回能采用的口径", detail: "已确认事实进入同一版交付依据；原话对不上或关键问题未决时明确停在草稿，不制造正式 Office 文件。" }],
    decisionImpact: ["money/date/datetime 保存规范类型和 value_data，不只保存显示文字。", "文本证据保存偏移、行列和原文；CSV 定位精确到行列。", "确认、驳回、退回和 source-rebound 追加 FactReviewEvent。", "每个真实状态变化要求非空 reason，并保留 evidence before/after。", "当前事件 schema 没有 actor，不能称为完整多人审计。", "AI 分析在项目外；核心只接收明确登记的事实、证据与决定。", "正式入口从 SQLite 重建 manifest v2，调用方不能自报 ready。"],
    problem: "解决无来源结论、金额日期口径漂移、审阅历史被覆盖和 quality 状态可伪造的问题。",
    implementation: ["EvidenceSpan 由系统验证 quote 与来源字节一致，并计算 locator。", "FactValueType 支持 text、money、date、datetime；结构化字段严格校验。", "FactReviewEvent 保存 action、previous/current status、stale、revision、reason 和 evidence IDs。", "DeliveryCompiler 计算 missing goal/sections、unconfirmed、stale、evidence 和 conflicts。", "expected_manifest 从 current build、package、facts 与 evidence 重建，verify 逐字段比较持久化文件。"],
    flow: ["登记候选事实", "绑定证据原文", "规范化类型值", "确认/驳回/保留假设", "追加理由与前后证据", "计算质量缺口", "生成draft或ready", "正式入口再次重建manifest"],
    concepts: [
      { term: "Typed fact（结构化事实）", explanation: "金额、日期和带时区时间分别保存机器可比较字段与人类显示值。" },
      { term: "FactReviewEvent（事实审阅事件）", explanation: "一次状态或证据变化的追加记录；当前包含理由但不包含操作人。" },
      { term: "Canonical manifest（规范清单）", explanation: "公开入口从 SQLite 重建的唯一正式事实投影，不能由调用方手写替代。" }
    ],
    boundaries: ["没有 actor 字段", "责任角色仍是原文/文本值", "AI 判断不在核心内", "没有字段级权限或多人审批", "质量门不证明真实业务采用"],
    failures: [
      { condition: "Quote 不在来源或偏移不匹配", response: "登记前失败，不保存伪造 EvidenceSpan。" },
      { condition: "关键事实冲突或缺必填章节", response: "quality 保持 draft，列出字段和证据，不启动正式 Office。" },
      { condition: "调用方修改 ready manifest", response: "SQLite 重建结果不一致，verify 和 artifacts 明确拒绝。" }
    ],
    sources: [
      { path: "PRIVATE source · models.py", role: "结构化事实、build与review event值对象" },
      { path: "PRIVATE source · store.py", role: "证据、事实、追加审阅和冲突查询" },
      { path: "PRIVATE source · compiler.py", role: "质量门与canonical manifest" }
    ],
    verification: ["手写 ready、goal/fact/evidence/hash 漂移均拒绝。", "money/date/datetime 与 CSV 行列回归通过。", "审阅事件追加且保留前后证据。", "关键冲突只生成标记草稿。", "actor 缺口由数据类与表结构现场确认。"],
    relation: "本模块决定当前 build 是否可信；通过后，下一模块才能从同一规范清单生成正式文件。"
  }),
  commonModuleShape({
    slug: "consistent-deliverables",
    usageEntry: "确认事实后，说这轮只要 PRD，或指定还需评审演示与跟踪表。",
    usageInputs: ["本轮要 PRD、Word、演示或执行表中的哪些文件", "需要特别保留的内容或格式要求（如有）"],
    readerStatus: "已有从同一份事实生成文档、演示与执行表的功能，并通过合成材料验收；整组文件替换仍可能部分完成。",
    shortTitle: "同版多种交付物",
    title: "六个正式文件使用同一事实修订，不同构建不混用目录",
    searchAliases: ["PRD评审PPT执行表保持一致", "当前能生成哪些正式文件", "只生成PRD不要PPT", "Office文件为什么不能换目录", "隔离wheel包含哪些builder", "项目计划周报是否支持"],
    searchProjection: {
      intents: ["生成一致交付物", "只构建请求格式", "核对正式输出集合", "拒绝跨build覆盖"],
      entities: ["PRD.md", "manifest.json", "traceability.csv", "DOCX", "PPTX", "XLSX", "build directory", "wheel"],
      relations: ["六文件绑定same build", "Office builders读取canonical manifest", "docx-only跳过pptx/xlsx", "output directory绑定build id"],
      failureRecovery: ["builder生成失败不晋升暂存文件", "逐文件替换中断可能留下部分成品", "目录冲突拒绝", "manifest漂移停止", "缺runtime保留core files"]
    },
    teaser: "当前正式输出严格是三类追溯文件和三类 Office 文件；不存在项目计划、周报、汇报或调用方自行追加的第七个正式文件。",
    status: "0.2.0 已闭合公开 artifacts 入口、内部 canonical binding、三类 Office、跨构建不可覆盖、统一 CLI 与隔离 wheel；同一构建允许重生成，完整重导入/几何/公式/视觉检查由合成验收执行",
    statusTone: "pass",
    value: "当关键事实确认后，需求文档、评审演示和执行表从同一版事实生成，日期、范围、指标和负责人不会各说各话。我可以只要本轮真正需要的一种文件，之后再从同一版补齐其他格式。",
    why: "如果需求文档、演示和表格各自制作，或写进别的版本目录，资料和结论很容易混用；同一版事实要先过质量门，再按需生成。",
    example: "我可以说：“事实已经确认，这一轮只要 PRD；评审演示和执行表以后再做。”项目只生成本轮需要的 PRD 与追溯材料，之后仍能从同一事实版本补齐其余交付物。",
    result: "完整请求会交回PRD正文、来源与事实清单、追溯表、Word需求文档、评审演示和执行跟踪表六份文件；只要PRD时交回对应子集。每一版单独保存。若制作或写入中断，会逐个说明哪些文件已成、哪些仍缺，不能把部分完成说成整套成功。",
    readerStates: {
      pass: "这一版事实已确认，来源清单与保存状态一致时，先准备请求的文件，再逐份写入这一版目录；全部写完才交回完整文件集。",
      problem: "来源清单与当前事实不一致，或文件写到别的版本目录时先停。制作或逐份写入中断后，逐个查看实际文件：可能有些已更新，有些仍是旧版。",
      unavailable: "制作 Word、演示或表格所需环境缺失时，保留已有 PRD、来源与追溯文件和待办，不把预览说成正式 Office 成品。"
    },
    productFlow: [{ title: "先核对正式制作条件", detail: "AI 核对所选来源的当前事实版与质量状态；有关键冲突或缺证据时停在待确认草稿。" }, { title: "从同一版事实制作并逐份核对", detail: "所有请求格式先准备，再写入这版专属目录；有中断就逐个报告实际成品。" }, { title: "拿到可追溯的版本", detail: "交回本轮文件和来源追溯；某个生成器失败时说明已完成与待补格式，不能把暂存文件说成已正式交付。" }],
    decisionImpact: ["正式输出只包括 PRD.md、manifest.json、traceability.csv、产品需求文档.docx、项目评审.pptx、执行跟踪表.xlsx。", "当前没有现成项目计划、周报或汇报产物。", "artifacts 公开入口只接受 database + current build ID。", "内部 builder 要求同一进程的 canonical binding，不能作为第二公开入口。", "新事实修订使用新 build 和独立目录；同一 current build 可重生成文件。", "PRD-only 不启动 PPTX/XLSX builder。", "暂存减少生成失败造成的半成品，但逐文件 os.replace 不提供跨文件回滚或整包原子性。", "每次 artifacts 调用不自动执行 Office 重新导入、PPT 几何、XLSX 公式和全部页面/工作表查看；这些结论来自两套合成验收和测试。", "wheel 携带两个合成场景、schema 和三个 builder，脱离源码目录可运行。"],
    problem: "解决跨成品口径漂移、绕过质量门、其他构建目录被覆盖和安装后缺 builder 的问题；临时区避免生成失败就直接留下成品，但不提供后续逐文件替换的整组回滚。",
    implementation: ["DeliveryCompiler 依次写 PRD.md、manifest.json 和 traceability.csv，各用同目录临时文件替换；三文件与 SQLite 状态不构成一个跨文件事务。", "artifacts.py verify persisted manifest，再解析所请求 formats。", "DOCX builder 使用 python-docx；PPTX/XLSX builder 使用工作区 Node packages。", "所请求 builder 在临时 staging 并行生成，全部返回后依次检查各文件非空并 os.replace 到所属 build 目录；没有跨文件事务或替换失败回滚。", "两套合成 acceptance 和 tests 在构建后重新导入 Office，检查 PPT 几何、XLSX 公式和全部页面/工作表；公开 artifacts 命令本身不自动运行这整套验收。"],
    flow: ["选择current build", "重建并核对manifest", "确认quality ready", "确认输出目录属于build", "生成请求格式到临时区", "依次检查文件非空并单文件替换", "全部替换后返回实际文件", "按验收需要另行重导入/视觉检查", "只读verify规范状态"],
    concepts: [
      { term: "ArtifactBuild（产物构建）", explanation: "绑定 package、事实修订、semantic hash、状态、时间和唯一输出目录的一次正式构建。" },
      { term: "Canonical binding（规范绑定）", explanation: "内部 builder 只接受本进程由公开入口生成的规范清单引用，用来防止误走实现脚本。" },
      { term: "OOXML（Office 开放文档格式）", explanation: "DOCX、PPTX 与 XLSX 的标准文件结构，可被 Microsoft Office 与 WPS 读取。" }
    ],
    boundaries: ["不提供任意模板商城", "不支持现成计划/周报/汇报", "预览QA留在正式目录外", "每次builder不自动完成重导入/几何/公式/全页检查", "内部环境绑定不是授权或安全证明", "视觉合成不等于真实内容正确"],
    failures: [
      { condition: "正式目录指向另一个 build", response: "在写 Office 文件前拒绝，两个 build 都保持不变。" },
      { condition: "任一 builder 在生成阶段失败", response: "不晋升本轮暂存 Office；保留核心文件与精确错误。" },
      { condition: "生成完成后逐文件检查或替换失败", response: "之前已替换的文件不会自动撤销；核对所属 build 和各文件实际状态，再决定重生成，不能把部分输出称为完整包。" },
      { condition: "调用方只请求 docx", response: "只构建产品需求文档.docx，不启动或等待 PPTX/XLSX。" }
    ],
    sources: [
      { path: "PRIVATE source · compiler.py", role: "core files、quality和不可覆盖build" },
      { path: "PRIVATE source · artifacts.py", role: "公开Office入口、staging与正式目录绑定" },
      { path: "PRIVATE artifact builders", role: "DOCX/PPTX/XLSX与视觉/重导入检查" }
    ],
    verification: ["三种输出从同一 manifest 生成并重新导入。", "已有 builder 失败回归证明生成阶段不晋升暂存文件，不证明逐文件替换失败能回滚。", "跨 build 目录重定向被拒绝。", "每个直接 builder 都要求 canonical binding。", "隔离 wheel 携带样本、schema 和 builder。"],
    relation: "本模块形成当前正式文件；来源一旦变化，下一模块决定哪些事实和旧 build 还能继续使用。"
  }),
  commonModuleShape({
    slug: "source-change-next-version",
    usageEntry: "说某份需求或纪要换版了，请核对以前结论哪些受影响。",
    usageInputs: ["哪份资料发生变化", "新文件或已保存的新版本"],
    readerStatus: "资料换版后可保留仍有唯一原文的结论，并标出失效事实；影响范围目前到整次构建，尚不能精确到每份文件或段落。",
    shortTitle: "来源变化与下一版",
    title: "唯一原文自动重新绑定，真正失效的事实和旧 build 才过期",
    searchAliases: ["来源变了哪些文件要重做", "原文还在为什么不用重新确认", "同一句出现两次怎么办", "旧build什么时候stale", "变更影响能到文件哪一层", "怎样生成下一版"],
    searchProjection: {
      intents: ["更新来源版本", "查看变化影响", "自动重新绑定证据", "决定是否生成下一版"],
      entities: ["ChangeSet", "source-rebound", "rebound facts", "stale facts", "stale builds", "impact"],
      relations: ["new snapshot supersedes old", "unique quote rebound evidence", "missing/ambiguous quote stales fact", "changed fact stales referencing build"],
      failureRecovery: ["相同字节无change set", "唯一原文自动恢复", "多处匹配保持stale", "旧build只读保留"]
    },
    teaser: "来源更新不是全文重做：先比较每个证据原文，能唯一找到就接到新版本，找不到或不唯一才要求重新确认。",
    status: "精确 rebound、stale fact、stale build 与未关联事实隔离已实现；影响仍只到事实和整个 build，未到单文件/单块",
    statusTone: "mixed",
    value: "一份立项说明或执行计划换版后，只重看真正受到影响的结论。原话在新版中还能唯一找到，就把旧结论接到新位置；原话消失或出现多处歧义，才标明要重新判断。",
    why: "把所有事实一起过期会制造重复劳动；反过来，只重新生成文件却不标旧结果，会让失效证据继续被引用。",
    example: "我可以说：“执行计划换成新版了，告诉我哪些结论还能用、哪些文件要重做。”仍能唯一找到原文的事实会接到新版；被删除或出现歧义的事实及相关旧文件会明确标为过期。",
    result: "得到新旧资料的差异、仍能沿用的结论、已失效的结论，以及哪些旧版交付物不能再当当前版使用。处理新增问题后另存新版本；目前影响范围能指出整次构建，尚不能精确到某一页或表格单元。",
    readerStates: {
      pass: "新资料读得完整，旧结论引用的原话在新版中仍唯一可找到时，自动接到新位置；真正失去依据的结论及引用它的旧交付版本才标为过期。",
      problem: "原话消失、出现多个相同位置或新旧说法冲突时，保留两版资料和待确认结论，只让负责人处理对应事实。",
      unavailable: "新版资料不能可靠读取或保存更新失败时，继续保留上一可靠版本，不假装已经完成换版。"
    },
    productFlow: [{ title: "先比较新旧资料", detail: "AI 核对选定来源的新旧内容，完全没变就保持现状。" }, { title: "只重看失去依据的结论", detail: "原话仍唯一可找的自动接续；消失或有歧义的标待审，并指出受影响的旧交付版本。" }, { title: "确认下一版的范围", detail: "交回仍有效、待审和已过期的部分；有歧义的原话由相关负责人重新确认后才进入新构建，旧目录保持可查。" }],
    decisionImpact: ["相同字节更新是 no-op，不制造 change set 或 stale。", "原文在新版本中唯一存在时创建新 EvidenceSpan 并 source-rebound。", "原文消失或出现多个匹配时事实 stale。", "只把引用 changed facts 的 current build 标为 stale。", "未关联事实保持 fresh，不要求重复确认。", "当前 impact 只报告 facts 与 whole builds；没有文件、block、页面或工作表级影响。", "下一版仍需处理新增冲突并通过同一 quality gate。"],
    problem: "解决一改全废、旧证据继续冒充当前、无关事实被误改和重新生成冒充影响分析的问题。",
    implementation: ["update_source 先读取新字节、计算 hash，并创建 superseding SourceSnapshot。", "每个旧 EvidenceSpan 的 quote 在新内容中做精确非重叠匹配。", "唯一匹配创建新 locator 并替换 fact_evidence。", "失效/重绑定都追加 review event 与新的 fact revision。", "changed fact IDs 反查 ArtifactBlock/Build，把引用变化的 current build 标 stale。", "ChangeSet 分表保存 impacted、rebound 和 build IDs。"],
    flow: ["选择新来源版本", "比对内容hash", "创建新snapshot", "逐证据查唯一原文", "自动rebound或标stale", "更新fact revision", "标记相关old build", "查看impact并决定下一版"],
    concepts: [
      { term: "ChangeSet（变更集）", explanation: "一次来源版本变化的结构化结果，分别记录重新绑定事实、过期事实和过期 build。" },
      { term: "rebound（重新绑定）", explanation: "旧原文在新版本中仍唯一存在，证据换到新 SourceSnapshot，事实保持有效。" },
      { term: "stale build（过期构建）", explanation: "引用发生变化事实的旧构建；文件仍保留，但不能再作为当前正式版本。" }
    ],
    boundaries: ["只做精确原文匹配，不做语义相似重绑", "多处匹配不猜", "影响不精确到单Office文件", "旧build不自动删除", "来源更新不自动生成下一版"],
    failures: [
      { condition: "新来源与旧版本字节相同", response: "返回 no-op，不创建人工变化或过期记录。" },
      { condition: "旧原文在新版本出现多次", response: "事实保持 stale，要求明确新证据，不按第一个匹配猜测。" },
      { condition: "更新事务中断", response: "SQLite 回滚，current snapshot、facts 和 builds 保持上一可靠状态。" }
    ],
    sources: [
      { path: "PRIVATE source · store.py update_source", role: "快照更新、精确匹配、rebound、stale和事务" },
      { path: "PRIVATE source · acceptance.py", role: "两套合成来源变化与未关联事实回归" },
      { path: "PRIVATE tests · core change tests", role: "真实失效、唯一重绑、无关事实隔离和旧build过期" }
    ],
    verification: ["真实失效事实和旧 build 同时 stale。", "唯一原文自动 rebound 且保持有效。", "未关联事实不被误改。", "显式重新确认可绑定当前来源版本。", "事实/整 build 之外的影响粒度仍未实现。"],
    relation: "本模块决定旧结果是否还能用；最终时间价值、失败恢复和未闭合证据由下一模块统一说明。"
  }),
  commonModuleShape({
    slug: "value-state-recovery",
    usageEntry: "问这套交付现在能否使用、节省了什么，或数据库丢失后怎样恢复。",
    usageInputs: ["要评估的交付事项或具体问题"],
    readerStatus: "合成资料已走通文件生成与检查；尚未证明真实工作省时，真实交付包数据库丢失后的恢复也未闭合。",
    shortTitle: "状态、价值与恢复",
    title: "分别报告功能、质量、安装、合成验收、真实价值和数据库恢复",
    searchAliases: ["工作交付现在完成到哪一层", "是否真的节省工作时间", "baseline required是什么意思", "构建失败后怎么恢复", "数据库丢了能从Git恢复吗", "两套合成E2E能证明什么"],
    searchProjection: {
      intents: ["判断当前成熟度", "比较时间价值", "从失败或中断继续", "理解备份恢复缺口"],
      entities: ["functional pass", "quality ready", "isolated wheel", "synthetic E2E", "baseline_required", "SQLite recovery", "current/stale"],
      relations: ["tests不等于real work", "synthetic E2E不等于time value", "current build可verify", "database loss无法Git restore"],
      failureRecovery: ["builder失败保留core", "stale build只读保留", "baseline缺失不报节省", "database丢失报告不可恢复"]
    },
    teaser: "一盏总绿灯会误导：0.2.0 的功能、质量、安装和合成输出已通过，但真实工作、真实变更、时间基线与数据库恢复仍未完成。",
    status: "37/37、Ruff、隔离 wheel、两套合成 Office E2E 通过；真实工作价值和恢复闭环为 baseline_required / not_run",
    statusTone: "mixed",
    value: "看清这套交付工具目前实际证明了什么：能否生成并检查文件，是否在真实工作中省时，出了错能从哪里继续，数据库丢失后还能否恢复。每一层有各自证据，不因为一次测试通过就说全部可用。",
    why: "文件生成得快，不代表包括 AI 分析在内的整件工作更快；保存过程的状态库，也不代表它丢失后就能恢复。两层都要如实核验。",
    example: "我可以问：“这套工具现在只是测试通过，还是已经在真实工作里证明省时间？上次生成超时后要不要重来？”当前证据只证明合成材料能生成，尚未用真实工作比较时间；超时后先核对已经写出的文件和原包，再决定从哪里继续。数据库丢失也不能靠 Git 猜回真实交付包。",
    result: "得到最近可靠的来源与交付版本、失败发生在哪一步、已经留下哪些文件，以及下一步怎样继续。合成材料已验文件生成；真实工作是否省时、交付包数据库丢失后的恢复仍缺证明。",
    readerStates: {
      pass: "本轮需要的文件与当前事实一致且各自检查完成时，只报告已证实的层级，并给出文件和可继续的位置。",
      problem: "事实未确认、资料过期或制作失败时，说明停在哪一步。超时和逐份写入失败可能已经留下部分新状态或文件，要先查实际结果再接续。真实省时价值仍需与直接做法比较。",
      unavailable: "保存交付包事实的数据库丢失且没有备份时，明确这份真实工作包不能恢复；旧文档或源码不能反推出完整状态。"
    },
    productFlow: [{ title: "看这轮实际完成到哪一步", detail: "分别核对来源与事实、文件生成、文件检查和真实工作使用证据。" }, { title: "失败先找已有结果", detail: "超时或中断后先读回交付包和已写文件，再从可靠位置继续；没有数据库备份时如实说明恢复缺口。" }, { title: "交回分层结论", detail: "逐层说明能否生成、能否复核、是否在真实工作中省时及能否恢复；一层通过不替其他层作保证。" }],
    decisionImpact: ["37/37 测试与 Ruff 在 2026-09-01 基线通过；本轮仅合同改动，没有重跑 Office。", "隔离 wheel 脱离源码目录完成安装闭包。", "两套合成 Office E2E 证明三类文件、重导入、几何与公式检查。", "当前实现盲自然路由 E2E 在无 Skill、工具和内部路线提示时自主选择 work-delivery，覆盖 3/3 指定来源，确认 27 条事实和 39 条追溯。", "5 条待确认中的 4 条阻断正式交付，quality 保持 draft，只生成 PRD.md、manifest.json、traceability.csv，Office builder 为 0；这证明路由和质量门，不是正式 Office E2E。", "约 12 分 12 秒可见墙钟包含 AI 分析与人工式判断，0.043 秒成功 batch 核心只表示确定性写入；两者都不能替代同模型同质量直接基线。", "首次建立交付包时，用户只做三类动作：明确选择资料、处理冲突/待确认、确认生成；不得重复录入已有事实。", "同模型、同 Token 量与同质量下，初次构建总墙钟不得超过直接基线的 1.25 倍；完成第一次来源变化时累计人工时间不得高于直接基线，变更轮墙钟目标不超过直接重做的 0.75 倍。", "如果直接文件能力同样能处理变化和一致性，就只保留窄工作流；受控 Agent 不优于确定性流程就保留确定性流程；真实工作只稳定复用一种产物就收窄到该产物。", "没有同模型同质量直接基线，时间状态必须 baseline_required。", "9月1日验收未覆盖真实工作、真实来源变化、导出备份、数据库恢复或跨机器迁移；不代表这些现实对象全局不存在。"],
    problem: "解决把源码、测试、安装、合成输出、真实价值和恢复能力互相冒充的问题。",
    implementation: ["acceptance.py 分开 functional、complexity、timing 和 per-scenario checks。", "没有合法 direct baseline 时 timing 返回 baseline_required，程序仍以可区分状态退出。", "run_batch 从请求预校验开始计时，在 SQLite 状态事务提交后、core 构建后和 Office 构建后分别调用 _enforce_mechanical_budget；超过 15 秒抛 MechanicalStageTimeoutError，CLI 非零退出，不补做事务或文件回滚。", "ArtifactBuild 保存 current/stale、semantic hash、fact revision 与 output directory。", "verify 只读比较当前 SQLite 与 persisted manifest，不检查每种 Office 成品的全部像素或语义。", "builder 生成阶段使用 staging，正式文件逐个替换；跨文件中断恢复仍依赖原包和实际文件核对。", "当前没有 export/backup/restore command、后台镜像或跨机器迁移。"],
    flow: ["读取current package", "检查facts与quality", "verify current build", "生成请求artifacts", "分别记录test/install/E2E", "核对首轮1.25倍/变更轮0.75倍/累计人工时间", "判断继续窄工作流、确定性流程或单产物路线", "报告real work状态", "交回恢复点或不可恢复结论"],
    concepts: [
      { term: "baseline_required（需要基线）", explanation: "功能可用，但缺少可比的直接处理对照；不能计算或宣称相对时间收益。" },
      { term: "Recovery point（恢复点）", explanation: "最近可读来源快照、事实修订、current build 与持久化 manifest；数据库仍须存在。" },
      { term: "Synthetic E2E（合成端到端）", explanation: "完全虚构来源走完整产品链；证明流程和成品，不证明真实业务采用。" },
      { term: "Implementation-blind routing（实现盲路由）", explanation: "评测只给自然工作意图和正常能力信息，不透露 Skill、工具、项目路径或预期路线；同时检查是否自主选对入口和用户可见结果。" },
      { term: "Time-value gate（时间价值门）", explanation: "用同模型同质量直接处理基线比较首轮总墙钟、变更轮总墙钟和累计人工时间；不达标就收窄产品。" }
    ],
    boundaries: ["测试不替代真实工作", "机械时间不包含AI分析", "当前盲路由 draft 不冒充正式Office E2E", "没有合法direct baseline不计算相对收益", "任一正式时间硬门失败就收窄而非放行", "Git不备份SQLite运行数据", "没有导出恢复或跨机器迁移"],
    failures: [
      { condition: "质量门未 ready", response: "保留待确认 PRD、来源和事实，列出阻断，不生成正式 Office。" },
      { condition: "Office builder 生成阶段失败", response: "清理本轮 staging，不晋升这次暂存文件；已生成核心文件和原包状态保留。若失败已在替换阶段，另核对可能存在的部分成品。" },
      { condition: "确定性 batch 超过 15 秒", response: "时间门失败并非整次未写入：状态提交后可能只有包和事实，core 后已有核心文件，Office 后可能已有所请求成品。先核对原稳定 ID、构建和文件，再从已发生状态继续。" },
      { condition: "首轮、变更轮或累计人工时间不达标", response: "验收失败；减少步骤、退回确定性窄工作流或只保留真实稳定复用的单一产物。" },
      { condition: "SQLite 数据库丢失", response: "明确真实 package、来源快照、决定历史和 build 记录当前无法从 Git 恢复。" }
    ],
    sources: [
      { path: "PRIVATE source · acceptance.py", role: "功能、复杂度、时间和合成场景分层" },
      { path: "PRIVATE source · batch.py / artifacts.py", role: "15秒检查的真实时点、已提交状态与逐文件替换边界" },
      { path: "PRIVATE tests · 37 cases", role: "源码、CLI、正式入口、wheel与失败恢复" },
      { path: "PRIVATE README · current acceptance", role: "0.2.0 当前证据、历史路由和未完成项" }
    ],
    verification: ["37 项测试全部通过，Ruff 通过。", "隔离 wheel 完成两个合成 acceptance 与三类 Office 构建。", "两套合成场景分别完成来源变化影响。", "当前实现盲自然路由证明 route_selected_without_hint、3/3 来源边界、draft 质量门、builder=0、current verify 与旧 build stale。", "时间在无 direct baseline 时保持 baseline_required。", "真实工作、真实来源变化和数据库恢复仍为 not_run。"],
    relation: "这是当前产品证据的终点：交回真实完成层、缺口、恢复点和下一决定，不把未验证层冒充成已完成。"
  })
];

export const project = workDeliveryProject;
export const modules = workDeliveryModules;
export { workDeliveryProject, workDeliveryModules };
