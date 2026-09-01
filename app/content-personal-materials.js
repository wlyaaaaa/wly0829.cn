import { createProjectSnapshot } from "./project-snapshot.js";

// These three values are replaced only after the parallel source repair has
// finished and its current evidence has been read back. Keeping them loud
// prevents a provisional source state from becoming a published snapshot.
const SOURCE_COMMIT = "08a3b0df5e999615c127e401e84b35b04a8752cb";
const TEST_RESULT = "37 项合成回归全部通过（33.30 秒）；Ruff 静态检查通过";
const OBSERVED_AT = "2026-09-01T07:09:34.800Z";

// Product limits live together so a future source-backed change can be
// calibrated once instead of being hunted through the narrative.
const limits = Object.freeze({
  skillCandidates: "4",
  cliDefaultCandidates: "5",
  maxCandidates: "10",
  discoverySources: "8",
  discoveryFiles: "2500",
  discoveryDepth: "12",
  discoverySeconds: "8"
});

const personalMaterialsSnapshot = createProjectSnapshot({
  observedAt: OBSERVED_AT,
  label: `四条产品链已有源码实现；${TEST_RESULT}；真实材料现场未在本页读取`,
  boundary: "本轮只核对项目规则、README、源码、schema 与测试，不打开实际 SQLite、原件、来源登记、内部选择凭据或候选；因此不声明当前覆盖数量，也不把源码状态冒充一次真实查找已经成功。",
  metrics: [
    { label: "产品模块", value: "4 个" },
    { label: "默认候选", value: `${limits.skillCandidates} 个` },
    { label: "发现来源", value: `${limits.discoverySources} 个` },
    { label: "文件 / 时间", value: `${limits.discoveryFiles} / ${limits.discoverySeconds} 秒` }
  ],
  facts: [
    {
      label: "使用入口",
      value: "已有可靠原件定位时由当前业务直接打开；只有位置未知、需要跨获准位置查找，或旧定位失效时才进入本项目。"
    },
    {
      label: "登记查找",
      value: `Skill 默认只取最多 ${limits.skillCandidates} 个已登记非媒体候选；候选阶段保留来源、标题、版本角色与关系，但不向用户公开真实路径或内部标识。`
    },
    {
      label: "即时发现",
      value: `没有合适登记候选且位置确实未知时，最多选择 ${limits.discoverySources} 个获准来源，共享 ${limits.discoveryFiles} 个文件、每源 ${limits.discoveryDepth} 层和 ${limits.discoverySeconds} 秒上限；选择前不读正文、不算哈希。`
    },
    {
      label: "选中后验真",
      value: "只有明确选中一项后才读取该文件字节，重新核对大小、SHA-256、来源根和文件身份；变化、冲突或核验失败时不登记、不打开。"
    },
    {
      label: "存储与后台",
      value: "项目只使用内置最小 SQLite（轻量元数据索引）保存定位与可重建文字；原件复制量为 0，也没有常驻后台进程或全盘扫描。"
    },
    {
      label: "源码证据",
      value: `PRIVATE main ${SOURCE_COMMIT}；${TEST_RESULT}。源码与测试证明实现合同，不证明当前登记来源、真实原件或本轮自然请求已经通过。`
    }
  ],
  gaps: [
    "本页没有读取实际索引，因此当前登记来源、材料数量、覆盖状态和来源缺口均不从网页推断。",
    "本页没有执行真实自然请求、选择候选或打开原件，因此当前端到端可用性仍须在用户真正需要时按精确范围验证。",
    "实际来源不可达、定位漂移、文件变化或启动器失败时，只影响该次路线；页面不把局部失败扩大成材料不存在。",
    "有界发现逐项消费文件系统枚举，达到上限时命中的具体子集可能随系统枚举顺序变化；它证明本次检查范围，不提供稳定的全目录排序。",
    "打开前虽会再次核对同一文件，但 Windows os.startfile（默认应用入口）只能接收路径，不能接收已核验文件句柄；SQLite 与外部文件系统也不能组成一个原子事务，最后一次复验到路径被消费之间仍有极小窗口。"
  ]
});

const personalMaterialsProject = {
  order: 12,
  slug: "personal-materials",
  title: "个人材料查找",
  route: "/projects/personal-materials",
  visibility: "私有仓库",
  repositoryUrl: null,
  statusTone: "mixed",
  cardStatus: "已实现登记查找、有界发现、选中后验真和精确接入；真实索引覆盖按每次请求单独说明",
  cardStatusTone: "mixed",
  ...personalMaterialsSnapshot,
  kicker: "路径未知时，从一句普通话回到真正的非媒体原件",
  searchAliases: [
    "个人材料查找",
    "忘了文件放在哪里",
    "找回非媒体原件",
    "旧文件路径失效",
    "跨几个位置找文件",
    "不全盘扫描找原件",
    "找到以后重新核对再打开"
  ],
  repositoryNote: "实现项目是 PRIVATE（私有）仓库。本公开页只说明项目规则、产品流程、源码结构与验证边界，不读取或发布实际 SQLite 内容、来源根、账号或设备登记、材料标题、候选、内部标识、真实路径、文件指纹、正文或个人结果。",
  summary: "这个项目只解决一件很具体的事：我知道要找的是哪份非媒体材料，却忘了它放在哪里，或者旧定位已经失效。它先从已登记范围返回少量候选；仍找不到时，才在获准来源里做一次有上限的即时发现。只有明确选中一项后，它才读取那一个文件、重新核对并用系统默认应用打开真正原件。",
  why: "现实材料常散在不同项目、设备或保存位置中。同名文件、草稿、签字版、交付版和回执容易混淆；反过来，为了避免遗漏而扫描整台电脑、复制全部文件或建立中央个人知识库，又会制造更大的维护和判断问题。需要的是一条短路线：只在位置未知时查少量候选，并在打开前证明选中的仍是那一份文件。",
  plainExample: "例如我说“帮我找那份延保合同，我忘了放哪了”。系统先查已登记非媒体索引，给出少量不含真实路径的候选，并保留来源、时间、版本角色和所在容器等区分信息。若没有合适候选，它才在与这句话最相关的获准目录里查看文件名和目录名。选中一项后重新计算大小与 SHA-256，匹配才打开；不匹配就停下来说明变化。",
  result: "我最终得到的是已经重新核对、能够打开的真正原件，以及它来自哪个登记来源、属于哪个版本、何时完成核验。若没有找到，我得到实际检查过的来源、文件和目录范围、触发的上限、未搜索部分与已知缺口，而不是一句无法复核的“没有”。",
  readerStates: {
    pass: "返回少量可区分候选；选中一项后，当前大小、SHA-256、来源根与文件身份重新核对通过，真正原件被打开或明确完成只验真。",
    problem: "没有合适候选、出现多个难以区分的版本、达到发现上限，或文件在选择前后发生变化时，保留实际范围与失败原因；只补一个真正有区分力的线索，不扩大成全盘扫描。",
    unavailable: "索引身份不符、获准来源不可访问、旧定位失效、内部选择凭据过期、文件缺失或默认启动器失败时，停止受影响的步骤；不猜路径、不改写原件，也不把局部不可用说成材料不存在。"
  },
  stateLabels: ["找到并选中时", "没有合适候选或原件变化时", "来源或验证入口不可用时"],
  methodCanvas: {
    kicker: "原件查找画布",
    headline: "先走最短路线；只有位置未知时才找，只有选中一项后才读字节",
    description: "这条流程把“找到候选”和“证明它仍是那份原件”分开。用户只需描述目标并在歧义时选择；项目负责限制范围、保留版本差异和在打开前重新验真。",
    steps: [
      { actor: "先判入口", title: "已有可靠定位就直接打开", detail: "当前业务已经知道原件在哪里时不绕行；照片、视频、录音和其他视听媒体统一交给 personal-media。" },
      { actor: "快速查找", title: "先查已登记非媒体索引", detail: `用同一句普通描述返回最多 ${limits.skillCandidates} 个候选，保留来源、标题、时间、版本角色、容器和原生关系。` },
      { actor: "必要时发现", title: "没有合适候选才看获准目录", detail: `按请求挑选最多 ${limits.discoverySources} 个相关来源，在 ${limits.discoveryFiles} 个文件、${limits.discoveryDepth} 层和 ${limits.discoverySeconds} 秒的共同上限内只看名称与文件元数据。` },
      { actor: "明确选择", title: "只从少量候选中选一项", detail: "候选阶段不把真实路径和内部标识交给用户；若版本仍不能区分，先补一条能改变选择的线索。" },
      { actor: "重新验真", title: "只读取选中的一个文件", detail: "重新核对大小、SHA-256、来源根与选择前后的文件身份；任何漂移或冲突都停止登记和打开。" },
      { actor: "交回结果", title: "打开原件，或说明精确缺口", detail: "成功时交回已核验原件；未命中、截止或不可用时交回实际范围、原因和下一条最有价值的线索。" }
    ],
    columnsAriaLabel: "用户、个人材料查找项目与刻意不建设部分的责任边界",
    columns: [
      { title: "用户只需提供", note: "目标与必要选择", items: ["用普通话描述材料、用途、时间或版本线索", "候选仍有歧义时，从少量结果中确认一项或补一个新线索", "决定是否只验真、不启动阅读器，或是否获准增加一个精确来源"] },
      { title: "项目负责", note: "范围、身份与结果", items: ["优先查登记索引，必要时才做有界即时发现", "隐藏候选真实路径和内部标识，保留来源原生证据", "只对选中项计算哈希、登记定位并打开，失败时返回范围与恢复条件"] },
      { title: "刻意不做", note: "避免第二套个人系统", items: ["不处理照片、视频、录音等媒体，也不替领域项目解释材料含义", "不全盘扫描、不后台索引、不复制、移动、改写或删除原件", "不建立人物关系、事件图、重要性、画像、跨来源推断或中央个人知识库"] }
    ]
  },
  productPrinciples: [
    { title: "可靠定位永远优先", detail: "已知精确路径时由当前业务直接打开；本项目只补位置未知、跨获准位置查找或旧定位失效这一段。" },
    { title: "定位原件，不解释人生", detail: "项目只负责来源、版本、定位、哈希与可打开状态；材料属于哪个案件、健康问题或工作决定，继续由对应领域负责。" },
    { title: "少量可区分胜过全量列表", detail: "候选必须帮助选择，而不是把所有相似文件倒给用户。版本角色、来源容器、时间和原生关系比堆数量更有价值。" },
    { title: "发现与验真分两步", detail: "即时发现只看名称、目录和文件元数据；只有选择一项后才读完整字节计算哈希，既控制耗时，也避免无目的读取。" },
    { title: "零命中只代表本轮范围", detail: "没有候选不等于其他账号、设备、离线介质或未获准位置不存在原件；结果必须带着已搜索与未搜索范围回来。" },
    { title: "原生证据决定版本语义", detail: "草稿、签字版、交付版、回执和精确重复只从来源自带名称、关系与相同 SHA-256 判断，不根据模型感觉补齐现实状态。" },
    { title: "原件留在原处", detail: "索引只保存最小定位元数据和可删除重建的绑定文字；接入、查找和打开都不复制、移动、改写或删除原件。" },
    { title: "媒体只有一个责任项目", detail: "照片、视频、音频和录音全部交给 personal-media；材料项目从接入、发现、查找和打开四个入口一致拒绝媒体。" },
    { title: "失败停在可复核的位置", detail: "来源根变化、候选变化、哈希漂移、身份冲突或启动失败都返回精确原因；不靠重试、猜路径或部分提交制造一个看似成功的结果。" },
    { title: "最小本地索引不是中央知识库", detail: "项目内 SQLite（轻量数据库）只承载来源、定位、版本、原生关系和绑定文字；没有跨领域画像、后台同步、事件图或所有私人问题的统一入口。" }
  ],
  responsibilities: [
    "用自然语言在已登记非媒体索引中返回少量、可区分的原件候选",
    "没有合适登记候选且位置确实未知时，在获准来源内做一次有文件数、深度、时间和来源数上限的即时发现",
    "在候选阶段隐藏真实路径和内部标识，保留来源、容器、时间、版本角色与原生关系",
    "只对明确选中的文件重新核对大小、SHA-256、来源根和文件身份，再登记并打开",
    "通过精确交接接收来源与定位元数据，并现场拒绝大小、哈希、schema 或媒体边界不一致的对象",
    "零命中、截止、缺失、漂移或入口不可用时，返回实际检查范围、失败原因和下一条有效恢复线索"
  ],
  exclusions: [
    "不处理照片、视频、录音及其他视听媒体；这些原件只走 personal-media",
    "不替诉讼、健康、工作或其他领域判断材料的意义、结论、重要性和现实状态",
    "不建立人物、事件、关系、画像、跨来源推断或中央个人知识库",
    "不默认扫描整台电脑、全部账号或所有登记来源，也不跟随目录链接",
    "不复制、移动、改写、删除原件，也不把 OCR（光学字符识别）或提取文字冒充原件",
    "不把零命中、索引状态、测试或迁移回执冒充用户已经拿到真实原件"
  ],
  glossary: [
    { term: "Locator（原件定位记录）", meaning: "指向真实非媒体原件的位置与版本身份；每次打开前仍须现场核对，旧记录不能替代当前文件。" },
    { term: "Registered lookup（已登记查找）", meaning: "只查询项目内已经精确接入的来源、材料、版本、关系和绑定文字，不遍历原件目录。" },
    { term: "Bounded discovery（有界发现）", meaning: "没有合适登记候选时，在少量获准来源内按文件名、原生目录名和 stat（文件元数据）即时查找。" },
    { term: "Selection credential（内部选择凭据）", meaning: "把发现候选绑定到来源根、相对位置、大小和修改时间的内部数据；不作为用户可见结果，也不是永久定位。" },
    { term: "SHA-256", meaning: "选中后对完整文件字节计算的内容指纹；完全相同的 SHA-256 才能证明精确字节重复。" },
    { term: "SQLite（轻量数据库）", meaning: "项目内置的最小定位与文字索引；它不保存原件字节，也不是跨领域中央知识库。" },
    { term: "Coverage（覆盖状态）", meaning: "来源明确声明 complete、partial 或 unknown，并附带缺口；它描述登记范围，不承诺整台设备或全部账号。" },
    { term: "Native evidence（来源原生证据）", meaning: "来源自身提供的标题、目录、时间、版本角色和关系；草稿、签字、交付或回执只从这些事实判断。" },
    { term: "Derived text（可重建文字）", meaning: "绑定到一份已选非媒体原件的原生文字、OCR 或提取文字；可以删除重建，不获得高于原件的事实地位。" }
  ],
  operatingFlow: [
    { title: "先决定是否绕过", detail: "已有可靠 locator（原件定位记录）直接打开；媒体转 personal-media；只有位置未知、跨来源或旧定位失效才继续。" },
    { title: "查已登记索引", detail: `以用户原话执行快速查找，默认只取 ${limits.skillCandidates} 个结果；优先已验证定位，再使用与原件绑定的可重建文字帮助召回。` },
    { title: "判断是否需要发现", detail: "已有合适候选就不扫描目录；只有无合适候选且位置真正未知时，用同一句描述为来源机械排序。" },
    { title: "执行一次有界发现", detail: `最多选择 ${limits.discoverySources} 个获准目录，共享 ${limits.discoveryFiles} 个文件、每源 ${limits.discoveryDepth} 层、总计 ${limits.discoverySeconds} 秒；跳过媒体、链接和无法读取项。` },
    { title: "让用户只面对少量差异", detail: "展示来源、标题、原生容器、时间、版本角色和文件大小；真实路径、内部标识与内部选择凭据不进入用户答复。" },
    { title: "选中后重新验真", detail: "完整读取这一个文件计算 SHA-256，并在提交前后复核 stat 与来源根；身份冲突或中途变化时回滚。" },
    { title: "打开或交回缺口", detail: "匹配时用系统默认应用打开；失败时区分未登记、缺失、哈希漂移、来源根变化、启动失败、截止和未搜索来源。" }
  ],
  components: [
    { name: "materials.py 命令入口", responsibility: "承载初始化、精确接入、登记查找、有界发现、选中验真、打开和最小状态读取。", implementation: "单个 Python 模块与标准库实现，不需要服务、队列、后台任务或专用运行时。" },
    { name: "项目内最小 SQLite", responsibility: "保存来源、材料定位、版本、原生关系、可打开状态和绑定文字。", implementation: "严格 schema、应用身份与版本号防止把外部数据库误当成本项目；它不是跨域个人知识库。" },
    { name: "personal-materials.handoff.v1", responsibility: "让上游业务只交接经过明确选择的一小组非媒体来源与原件。", implementation: "字段白名单、大小与 SHA-256 现场核对、事务写入；任何不一致对象整体拒绝，原件字节复制量为 0。" },
    { name: "自然语言匹配", responsibility: "把普通请求与来源、标题、原生标识、版本角色和绑定文字进行有界匹配。", implementation: "去除常见请求词并使用短语与中文二元片段评分；结果仍由来源原生证据解释，不让分数决定现实语义。" },
    { name: "有界文件名发现", responsibility: "在未登记位置中只寻找少量可能的非媒体原件。", implementation: `按请求路由来源，共享 ${limits.discoverySources} 个来源、${limits.discoveryFiles} 个文件、${limits.discoveryDepth} 层和 ${limits.discoverySeconds} 秒上限；选择前不读正文、不计算文件哈希。` },
    { name: "选中后完整性提交", responsibility: "证明发现候选在选择、读取和登记期间没有换成另一份文件。", implementation: "来源根承诺、相对位置、文件句柄 stat、完整 SHA-256、提交前后复核与身份冲突回滚共同闭合。" }
  ],
  usageExamples: [
    { ask: "帮我找那份延保合同，我忘了放哪了。", effect: "先查已登记索引，返回少量不含真实路径的候选；已有明确版本时可以直接进入选中后验真。", moduleSlug: "registered-lookup" },
    { ask: "登记候选都不对，在我已经允许的几个目录里再找一次。", effect: "用同一句描述选择最相关来源，只看文件名、目录名和文件元数据，并说明真正扫描的范围、截止与未搜索来源。", moduleSlug: "bounded-discovery" },
    { ask: "打开第二个候选，但先确认它没有被替换。", effect: "只读取所选文件，重新核对大小、SHA-256、来源根和文件身份；匹配才打开，漂移则停止并说明原因。", moduleSlug: "verified-open" },
    { ask: "把这份已经确认的非媒体原件加入以后可查的范围。", effect: "只接受精确交接包，现场核对 schema、来源、大小和哈希；元数据进入最小索引，原件继续留在原处。", moduleSlug: "exact-intake" }
  ],
  evidenceLayers: [
    { layer: "Project rules（项目规则）", proves: "产品只负责定位、核验和打开非媒体原件，并明确媒体、领域语义、原件保护和零命中边界。", doesNotProve: "不证明代码已经实现，也不证明当前来源可访问。" },
    { layer: "README（人类入口）", proves: "普通人可以理解何时使用、先 find 还是 discover、选中后怎样打开，以及不会发生什么。", doesNotProve: "README 不是运行时事实，也不能替代源码和真实请求。" },
    { layer: "Source and schema（源码与结构）", proves: `PRIVATE main ${SOURCE_COMMIT} 定义命令、限额、SQLite 表、状态、事务、媒体拒绝和完整性检查。`, doesNotProve: "不证明当前数据库内容、登记范围、设备挂载或系统默认启动器可用。" },
    { layer: "Automated tests（自动回归）", proves: `${TEST_RESULT}；用于核对身份冲突、回滚、路径隐藏、范围报告、有界发现、来源根绑定、媒体拒绝和初始化身份。`, doesNotProve: "合成临时文件不能证明真实私人材料或自然请求已经成功。" },
    { layer: "Skill route（能力入口）", proves: "当前能力说明会在位置未知、跨获准位置或 locator 失效时选择本项目，并把媒体和可靠定位分流。", doesNotProve: "Skill source、安装、当前任务发现与真实端到端结果必须分别验证。" },
    { layer: "Natural request E2E（自然请求端到端）", proves: "一条真实普通描述能自行进入正确路线，找到、选择、重新验真并打开真正原件。", doesNotProve: "一次成功不代表未登记位置、其他账号、离线设备或所有材料类型均已覆盖。" },
    { layer: "User acceptance（用户验收）", proves: "返回的确实是用户要找、可继续使用的那份原件，范围和等待成本也可接受。", doesNotProve: "不会把一次个人确认外推为全部来源的永久正确性。" }
  ],
  operationalEntrypoints: [
    { name: "初始化最小索引", command: "python materials.py init", purpose: "只在项目索引尚不存在时建立空 schema；已有合法索引会原样返回 ready，外部或损坏数据库不会被覆盖。" },
    { name: "查已登记材料", command: "python materials.py find --text \"<普通描述>\" --limit 4", purpose: "优先从已登记非媒体索引返回少量候选，不遍历原件目录。" },
    { name: "有界即时发现", command: "python materials.py discover --text \"<同一普通描述>\" --limit 4", purpose: "只有无合适登记候选且位置未知时，查看获准目录的文件名与原生目录名。" },
    { name: "验真登记候选", command: "python materials.py inspect --id \"<内部材料标识>\"", purpose: "重新核对一份已登记原件的大小与 SHA-256，但不启动阅读器。" },
    { name: "打开登记候选", command: "python materials.py open --id \"<内部材料标识>\"", purpose: "核验通过后用系统默认应用打开真正原件。" },
    { name: "打开发现候选", command: "python materials.py open-discovered --token \"<内部选择凭据>\"", purpose: "只对选中的发现候选读取完整字节、登记定位并打开。" },
    { name: "精确接入", command: "python materials.py intake --file \"<personal-materials.handoff.v1.json>\"", purpose: "接收一小组经过明确选择并已携带预期大小与哈希的非媒体原件元数据。" },
    { name: "读取最小状态", command: "python materials.py status", purpose: "只返回四表计数、background_process=false 和 original_bytes_copied=0；它不是覆盖证明、查找结果或真实端到端验收。" }
  ],
  evolution: [
    { date: "2026-08-24", commit: "milestone-01", result: "建立最小非媒体来源、定位、版本、关系与哈希索引，以及先核验再打开的产品主链。" },
    { date: "2026-08-25", commit: "milestone-02", result: "接入有界来源并改善长自然语言请求匹配，让用户不需要先记住路径或内部标识。" },
    { date: "2026-08-26—2026-08-27", commit: "milestone-03", result: "把照片、视频、音频和录音完整移交 personal-media，并让接入、查找、发现和打开一致拒绝媒体。" },
    { date: "2026-08-30", commit: "milestone-04", result: "把发现候选绑定到各自来源根，补齐数据库身份拒绝、选择期间文件变化检测、身份冲突回滚和稳定材料身份。" },
    { date: "2026-09-01", commit: SOURCE_COMMIT, result: `${TEST_RESULT}；可靠性修复已正常推送 PRIVATE main，并从远端默认分支回读同一提交。` }
  ],
  snapshotUpdateNote: "本页只在项目的用途、查找路线、限额、失败语义、媒体边界、完整性保证或用户应该怎样使用发生实质变化时更新。实际来源、材料、候选、路径、内部选择凭据和索引计数从不进入公开快照；仅提交、测试数或时间变化而产品含义不变时，不重写产品正文。"
};

const personalMaterialsModules = [
  {
    slug: "registered-lookup",
    shortTitle: "已登记查找",
    title: "先查已登记的非媒体原件，不先遍历文件目录",
    searchAliases: ["已登记材料怎么快速找", "find材料", "材料候选为什么隐藏路径", "签字版交付版怎么区分", "同一材料多个版本", "找文件先查索引"],
    searchProjection: {
      intents: ["用普通描述查已登记非媒体原件", "区分草稿签字交付与回执版本", "确认候选阶段为何隐藏真实路径", "解释登记索引零命中的实际范围"],
      entities: ["find", "sources", "materials", "material_relations", "material_text", "logical_id", "version_role", "open_state"],
      relations: ["verified_locator 只承载当前 verified 记录", "unverified_source_evidence 承载未验证的来源元数据与绑定文字证据", "known_locator_gap 承载 missing hash_mismatch not_openable", "登记候选进入 verified-open 后才打开"],
      failureRecovery: ["已知定位缺口不冒充 verified", "零命中返回已搜索与未搜索范围", "派生文字命中仍要回到原件验真", "数据库身份不符时拒绝读取和覆盖"]
    },
    teaser: "用一句普通描述匹配已登记来源、标题、原生标识、版本角色和绑定文字，优先返回已有可靠定位的少量候选。",
    status: `登记查找已把 verified_locator、unverified_source_evidence 与 known_locator_gap 三阶段分开；版本区分、路径隐藏、零命中范围和媒体过滤已有源码与测试结构；${TEST_RESULT}；真实索引未在本页读取。`,
    statusTone: "mixed",
    value: "绝大多数已接入材料不需要扫描目录：先从小索引拿到可区分候选，再决定是否验真打开。",
    why: "同一材料可能有草稿、签字版、交付版、回执或完全相同的副本。只按文件名排序会把版本混在一起；直接公开路径又会在尚未选择时暴露不必要的私人位置。登记查找先把候选缩小，并保留来源原生差异。",
    example: "用户描述一份已经接入过的合同。查找结果只显示少量标题、来源、原生容器、版本角色、时间、大小、最后核验状态和关系；如果某两个文件 SHA-256 完全相同，可以标为精确重复，但不能把签字包推断成平台已收到。",
    result: "得到少量可比较候选和明确的登记搜索范围。候选还不是最终原件证明；选中后继续进入重新验真，零命中则说明哪些来源和材料记录确实被查询。",
    readerStates: {
      pass: "verified_locator 只返回 open_state=verified 的少量匹配项；来源、版本角色、时间、容器、重复与关系足以选择，真实路径和内部标识仍不进入用户答复。",
      problem: "没有 verified 匹配时，才依次使用未验证的来源元数据与绑定文字证据，或进入 known_locator_gap；missing、hash_mismatch、not_openable 会带着原状态返回，不能被写成已验证。",
      unavailable: "最小 SQLite（轻量数据库）不存在、应用身份不符或只读连接失败时，不读取外部数据库猜结果；停止查找并说明需要恢复的项目入口。"
    },
    stateLabels: ["有清晰登记候选时", "零命中或版本仍歧义时", "登记索引不可读取时"],
    decisionImpact: [
      "用户不用先回忆绝对路径或内部材料 ID，只需描述目标。",
      "登记候选与发现候选分开：已有定位优先，不为每次查询遍历文件系统。",
      "查找阶段本身表达证据强度：verified、未验证来源证据（来源/材料元数据、search_text 或绑定文字）和已知定位缺口不会混在同一个“已找到”标签里。",
      "完全相同字节、逻辑版本和来源原生关系分别表达，不把“相似”写成“同一份”。",
      "零命中自动携带已搜索与未搜索范围，不能被解释成其他设备或位置不存在。"
    ],
    problem: "解决路径遗忘、同名文件、版本混淆、旧定位优先级和候选阶段不必要暴露真实位置。",
    implementation: [
      "从 sources、materials、material_relations 和 material_text 读取登记事实；媒体历史行在查询前过滤。",
      "第一阶段只匹配 open_state=verified，并把 lookup_stage 标为 verified_locator；missing、hash_mismatch 和 not_openable 绝不进入这一阶段。",
      "没有 verified 匹配时才查 open_state=unverified 的来源名、标题、原生 ID、版本字段、材料 search_text 与 material_text，并标为 unverified_source_evidence；即使没有 material_text，来源原生元数据仍可形成未验证候选。",
      "material_text 只接收 native、ocr 或 extracted 三类可重建文字；它们可以帮助召回，但不能替代当前原件验真。",
      "查询文本去除常见请求词，并结合完整短语、拉丁词和中文二元片段计算有界匹配分。",
      `find 命令默认返回 ${limits.cliDefaultCandidates} 个、允许 1–${limits.maxCandidates} 个；个人 Skill 为减少选择成本固定请求最多 ${limits.skillCandidates} 个。`,
      "候选卡提供来源、标题、容器、逻辑与版本身份、时间、指纹、大小、状态、精确重复次数和原生关系，但不包含 locator。",
      "搜索范围记录已查非媒体材料数、来源样本、未搜索来源数和实际命中来源。"
    ],
    flow: [
      "确认请求属于非媒体原件且没有可靠 locator；否则直接分流或绕过。",
      "把用户原话规范为搜索签名，不要求用户翻译成内部字段。",
      "按 verified_locator → unverified_source_evidence → known_locator_gap 的顺序搜索，前一阶段有结果就不混入较弱阶段。",
      `按分数、来源时间和稳定材料身份排序，只保留最多 ${limits.skillCandidates} 个候选。`,
      "返回候选、查找阶段、搜索范围与零命中说明；不在这一步打开原件。"
    ],
    concepts: [
      { term: "Registered index（登记索引）", explanation: "只包含明确接入的来源和非媒体原件定位，不是整盘文件清单。" },
      { term: "Logical family（逻辑版本族）", explanation: "同一现实材料的多个来源原生版本；它与相同字节副本不是同一概念。" },
      { term: "Exact duplicate（精确重复）", explanation: "只有完整 SHA-256 相同才成立；标题相同或迁移回执不能证明。" },
      { term: "Hash-bound text（哈希绑定文字）", explanation: "OCR、提取或原生文字与一份精确原件身份绑定；只帮助召回，引用仍回到原件。" },
      { term: "Search scope（搜索范围）", explanation: "本次实际查询的登记材料与来源，以及未查询部分；零命中必须与它一起解释。" },
      { term: "Lookup stage（查找阶段）", explanation: "verified_locator 只含 verified；unverified_source_evidence 只含 unverified 的来源元数据或绑定文字证据；known_locator_gap 只含 missing、hash_mismatch 或 not_openable。" }
    ],
    boundaries: [
      "已有可靠路径直接打开，不先经过登记查找。",
      "只查询非媒体原件；照片、视频、音频和录音始终由 personal-media 处理。",
      "候选不向用户暴露真实路径、内部 ID 或内部选择凭据。",
      "绑定文字不拥有高于原件的证据地位，也不进入人物、事件或领域判断。",
      "来源覆盖是 complete、partial 或 unknown 的登记声明，不等于整台电脑。"
    ],
    failures: [
      { condition: "零命中", response: "返回 not_found、登记搜索阶段、实际材料数量、来源样本、未搜索来源与缺口；只说明本轮登记索引没有合适候选。" },
      { condition: "指定来源没有可用登记项", response: "不静默扩大到其他来源；显示空范围并等待更正来源或明确进入发现。" },
      { condition: "只有旧的未验证文字命中", response: "明确标为派生文字召回，不能跳过原件验真，也不能把文字内容直接当当前原件。" },
      { condition: "只有已知定位缺口命中", response: "返回 known_locator_gap 和原 open_state；missing、hash_mismatch、not_openable 只能帮助恢复，不能称 verified_locator。" },
      { condition: "数据库身份不符", response: "拒绝连接，不初始化或覆盖外部字节；由项目入口恢复正确的最小 SQLite。" }
    ],
    sources: [
      { path: "README.md", role: "定义普通请求、候选路径隐藏、find 优先和零命中范围。" },
      { path: "materials.py", role: "实现 query signature、匹配评分、候选卡、来源范围和 find 命令。" },
      { path: "schema.sql", role: "定义来源、材料、原生关系、绑定文字和可打开状态。" },
      { path: "tests/test_materials.py", role: "覆盖自然查询、版本区分、路径隐藏、零命中与媒体历史行过滤。" }
    ],
    verification: [
      "用虚构临时材料验证普通长描述能命中正确版本，并确认候选 JSON 不含 locator。",
      "验证完全相同 SHA-256 与同逻辑版本族分别统计，不互相冒充。",
      "分别构造 verified、unverified、missing、hash_mismatch、not_openable，确认三个 lookup_stage 严格分层且缺口从不标成 verified_locator。",
      "验证零命中返回来源范围、未搜索数量与缺口，而不是空对象或绝对不存在。",
      "验证媒体历史行既不能成为来源，也不能通过 find 返回或打开。",
      "真实产品验收必须从自然请求开始，并最终选中、重新验真、打开一份真实原件；单元测试不能替代。"
    ],
    relation: "这是主入口。候选清楚时进入“验真再打开”；没有合适登记候选且位置真正未知时才进入“有界发现”。“精确接入”持续为本模块提供小而可信的来源与版本事实。"
  },
  {
    slug: "bounded-discovery",
    shortTitle: "有界发现",
    title: "没有合适候选时，才在获准来源里即时查文件名",
    searchAliases: ["不知道文件在哪怎么有界搜索", "discover材料", "最多搜索几个来源", "发现为什么不读正文", "发现为什么不算哈希", "零命中不是不存在"],
    searchProjection: {
      intents: ["登记候选不合适时做一次有界发现", "按普通描述选择最相关获准来源", "解释发现为何不读正文和不算哈希", "报告零命中截止与未搜索来源"],
      entities: ["discover", "filesystem-directory", "searched_sources", "unsearched_source_count", "files_examined", "directories_examined", "cutoff_reason"],
      relations: ["同一请求为获准来源机械排序", "所有选中来源共享文件与时间预算", "文件名原生目录名与 stat 形成发现候选", "选中候选交给 verified-open 重新验真"],
      failureRecovery: ["来源根不可访问时标记未搜索", "目录或目录项读取错误进入显式 gap", "达到文件或时间上限时保留截止原因", "截止子集不冒充稳定完整排序"]
    },
    teaser: "按同一句自然描述选择最相关的少量来源，在全局机械上限内只查看文件名、原生目录名和 stat；不预扫描、不持续索引。",
    status: `来源路由、增量有界枚举、目录读取 gap、共同预算、媒体跳过、链接拒绝、未搜索来源摘要和候选来源根绑定已有源码与测试结构；${TEST_RESULT}；真实来源未在本页扫描。`,
    statusTone: "mixed",
    value: "在不知道位置时仍能扩大一次搜索范围，但扩大过程可预期、可说明、不会变成后台全盘索引。",
    why: "登记索引有意保持小而精确，必然不能覆盖每一份尚未接入的文件。直接递归所有登记目录会耗时、读取过量并把“查一次”变成持续维护。发现因此只在真正需要时运行一次，并让所有来源共享硬上限。",
    example: "登记候选都不是目标。系统用原请求中的材料名、用途或来源线索给已批准目录排序，只选最相关来源。遍历时不跟随链接、不打开正文、不计算 SHA-256，遇到媒体直接跳过；达到文件数或时间上限就停止，并列出没有搜索的来源。",
    result: "得到少量尚未登记的候选及其来源、原生容器、时间、大小和类型；候选仍不含真实路径，哈希与重复状态明确标为“选择后才计算”。",
    readerStates: {
      pass: "在选中的获准来源与共同上限内找到少量非媒体候选；用户可见结果只说明来源、容器、时间和大小，内部选择凭据仅在执行层传给下一步，不进入答复；此时仍不登记、不读正文。",
      problem: "零命中、目录读取错误或达到文件、深度、时间上限时，列出每个来源实际检查的文件/目录数、目录 gap 样本、截止原因、媒体跳过数和未搜索来源摘要。",
      unavailable: "来源根缺失、不可访问、已转交媒体项目，或全部预算在到达该来源前耗尽时，标记该来源未搜索；不改用未获准路径。"
    },
    stateLabels: ["有发现候选时", "零命中或达到上限时", "来源根不可用时"],
    decisionImpact: [
      "只有登记查找没有合适结果时才付出文件系统遍历成本。",
      "来源数量、文件数、深度和总时间共同封顶，多个来源不会各自得到一份无限预算。",
      "选择前不读取正文和完整字节，不把一次搜索变成批量内容摄取。",
      "未搜索来源与截止原因显式返回，用户知道零命中到底能说明什么。"
    ],
    problem: "解决未知位置下需要扩大查找、但不能全盘扫描、持续索引、跟随链接或无边界读取文件的问题。",
    implementation: [
      "只选择登记为 filesystem-directory 的非媒体来源，并排除已经退役的媒体来源身份。",
      "先用请求与来源显示名、范围说明、来源键和根定位做机械相关性排序；有强来源词时只选同强度候选。",
      `最多选择 ${limits.discoverySources} 个来源；所有来源共享 ${limits.discoveryFiles} 个文件和 ${limits.discoverySeconds} 秒，单来源递归深度最多 ${limits.discoveryDepth}。`,
      "使用 os.scandir 的增量迭代器，在取得每一个下一目录项前检查文件与时间预算；不会先把整个目录读入内存或排序后才截断。",
      "遍历不跟随符号链接；只读取目录项、文件名、相对目录和 stat，媒体扩展名或 MIME 类型直接跳过。",
      "目录无法打开或某个目录项无法读取时，累计 directory_gap_count，并返回有限的相对目录、gap、错误类型样本与额外数量。",
      "候选只保存内部选择凭据、标题、来源、原生容器、版本元数据和选择前状态；路径、哈希和重复信息不在此时计算。"
    ],
    flow: [
      "确认 find 没有合适候选，并且用户确实不知道位置。",
      "取获准文件目录来源；显式来源提示存在时只保留匹配来源。",
      "按请求线索给来源排序，选择最相关的有界子集，并记录未选原因。",
      "公平分配剩余文件预算，逐项枚举文件名与目录名；在请求下一个目录项前达到任一全局上限就立即停止。",
      "去掉已经登记的定位和全部媒体，只保留少量最高分候选。",
      "返回候选、逐来源扫描报告、未搜索来源摘要和共同限制；不写入索引。"
    ],
    concepts: [
      { term: "Source routing（来源路由）", explanation: "根据当前请求选择最相关的已获准来源，而不是每次扫遍所有来源。" },
      { term: "Global budget（共同预算）", explanation: "多个来源共享文件数与总时间限制，不能每个来源重新获得完整额度。" },
      { term: "stat（文件元数据）", explanation: "文件大小、修改时间和身份字段；发现阶段用它描述候选，但不读完整内容。" },
      { term: "Cutoff（截止）", explanation: "达到文件数、时间或进入来源前预算已耗尽；必须写明原因，不能冒充完整搜索。" },
      { term: "Unsearched source（未搜索来源）", explanation: "因请求路由、显式来源提示或全局预算没有进入的登记来源；零命中时必须保留。" }
    ],
    boundaries: [
      "只在已登记且获准的文件目录来源内工作，不接受临时猜出的新根目录。",
      "不跟随链接，不读取文件正文，不计算候选哈希，不建立持续索引。",
      "照片、视频、音频、录音和退役媒体来源全部跳过并转 personal-media。",
      "候选阶段不输出真实路径；内部选择凭据只用于下一步验真。",
      "零命中只覆盖本次实际选中来源和共同上限，不外推其他账号、设备或离线介质。",
      "枚举为了按预算立即停止，不先对全目录排序；一旦截止，本次看到的具体子集可能受 Windows 文件系统枚举顺序影响，不能称稳定完整列表。"
    ],
    failures: [
      { condition: "来源根不可访问", response: "该来源标为 searched=false 和 root_not_openable；继续与否只取决于剩余已获准来源，不猜替代路径。" },
      { condition: "目录或目录项无法读取", response: "继续处理其余可读部分，并返回 directory_gap_count、有限 gap 样本、错误类型和额外 gap 数；零命中不能越过这些缺口。" },
      { condition: "达到共同文件或时间上限", response: "立即停止，记录 cutoff_reason、已检查文件/目录数和剩余未搜索来源；结果仍可返回，但不能称完整。" },
      { condition: "发现的都是媒体", response: "统计跳过数量，不返回媒体候选；需要媒体原件时转 personal-media。" },
      { condition: "没有任何候选", response: "返回 not_found、所有逐来源报告与未搜索摘要；建议补一个能改变来源路由或文件名匹配的线索。" }
    ],
    sources: [
      { path: "AGENTS.md", role: "限定未知位置、获准范围、媒体所有权、无全盘扫描和零命中语义。" },
      { path: "README.md", role: "解释 discover 的选择条件、共同上限、选择前不读正文/哈希和未搜索来源摘要。" },
      { path: "materials.py", role: "实现来源优先级、文件名遍历、共同预算、媒体跳过和发现结果。" },
      { path: "tests/test_materials.py", role: "覆盖未知位置发现、零命中、八来源路由、来源根绑定和媒体跳过。" }
    ],
    verification: [
      `构造超过 ${limits.discoverySources} 个虚构来源，证明请求线索会选择相关来源并报告其余未搜索数量。`,
      `验证所有选中来源共享 ${limits.discoveryFiles} 个文件和 ${limits.discoverySeconds} 秒，而不是各自获得完整预算。`,
      "验证候选没有真实路径或 native_id，且 hash_state 与 duplicate_state 明确为选择后才计算。",
      "验证不跟随链接、跳过媒体、不可访问来源和达到截止均形成可解释报告。",
      "注入目录与目录项读取错误，确认 gap 以相对目录和错误类型显式返回，而不是静默跳过。",
      "用超过文件预算的增量枚举器确认达到上限后不再请求下一个目录项，并把截止子集标为本次枚举结果而非稳定全量排序。",
      "真实验收必须在一个用户明确获准的来源范围内运行，并检查实际耗时、候选质量与零命中说明。"
    ],
    relation: "它是登记查找的按需后备，不是默认入口。找到候选后必须进入“验真再打开”；候选在此之前不进入“精确接入”索引。"
  },
  {
    slug: "verified-open",
    shortTitle: "验真再打开",
    title: "只有选中一项后，才读取字节、重新核对并打开",
    searchAliases: ["选中候选后怎么核对哈希", "打开材料前重新验证", "open-discovered", "文件被替换怎么办", "来源根变化怎么办", "候选身份冲突回滚"],
    searchProjection: {
      intents: ["选中候选后重新计算大小与哈希", "打开前确认文件没有被替换", "解释发现选择句柄能证明什么", "身份冲突或启动失败时安全停止"],
      entities: ["inspect", "open", "open-discovered", "Base64", "root_commitment", "file_signature", "open_state", "material_key"],
      relations: ["Base64 句柄绑定来源相对位置与选择前 stat", "来源根承诺阻止根目录替换", "文件句柄与路径身份共同检测读取中变化", "事务提交后才调用系统默认应用"],
      failureRecovery: ["旧句柄缺少来源根时要求刷新", "同路径新内容刷新版本并清除旧派生文字", "启动前再次变化时标为 hash_mismatch", "启动器失败与字节核验失败分开记录"]
    },
    teaser: "登记候选与发现候选都必须在打开前重新核对；发现候选还要证明来源根、相对位置和选择期间文件身份没有改变。",
    status: `登记原件复核、发现候选来源根承诺、同路径新内容刷新、读取与启动前变化检测、身份冲突回滚和启动失败状态已有源码与测试结构；${TEST_RESULT}；本页未打开真实原件。`,
    statusTone: "mixed",
    value: "把“看起来像”变成“当前字节仍匹配”：任何漂移都在打开和提交前停止，旧定位不会悄悄指向另一份文件。",
    why: "候选生成与用户选择之间，文件可能被移动、替换或改写；来源根也可能重新挂载到别的位置。若只在发现时记一个路径，之后直接打开，用户得到的可能已不是当时看到的那一项。",
    example: "用户选中一个发现候选。系统先确认内部选择凭据仍绑定当前来源根和相对位置，再以文件句柄读取完整字节；读取前后 stat、路径当前身份和 SHA-256 都一致，且没有与既有材料身份冲突，才原子登记并启动默认应用。",
    result: "成功时返回 verified 或 opened，并带出选中原件的标题、来源、版本、大小、SHA-256、核验时间和是否已启动；失败时返回精确 gap，不留下半登记状态。",
    readerStates: {
      pass: "大小、SHA-256、来源根、相对位置和选择前后文件身份一致；登记事务提交后，原件被打开或按请求只完成验真。",
      problem: "文件缺失、大小或哈希不符、来源根改变、候选读取期间变化、身份冲突或启动失败时，返回精确 gap 并保留旧的可恢复状态。",
      unavailable: "索引不能安全写入、来源根无法解析或默认应用不可调用时，不绕过核验；只说明哪一层不可用以及可否先保留 verified 结果。"
    },
    stateLabels: ["当前字节完全匹配时", "定位、文件或身份发生变化时", "写入或启动入口不可用时"],
    decisionImpact: [
      "候选排序不再等于打开授权；只有用户明确选择后才读取完整文件。",
      "登记候选每次打开都重算大小和 SHA-256，旧 verified 状态不会永久有效。",
      "发现候选绑定来源根和相对位置，换盘、重挂载或根目录变化会要求刷新选择。",
      "同一来源与相对路径出现新字节时保留稳定材料身份，刷新 version_id/version_role，并先清除旧 material_text，避免旧文字继续描述新内容。",
      "身份冲突与读取中变化使用事务回滚，不让半条记录成为后续快速定位。",
      "open 与 open-discovered 都在启动前再复验一次；启动器失败与字节验证失败分开，前者不抹掉已经证明的文件身份。"
    ],
    problem: "解决候选到打开之间的时间差、来源根替换、路径逃逸、文件中途修改、登记身份冲突和默认应用启动失败。",
    implementation: [
      "登记候选按 material_key 读取当前 locator，再现场计算大小和 SHA-256；缺失与不匹配会写回明确 open_state 和 open_gap。",
      "发现候选使用可解码的 discovery token（发现候选令牌），它是 URL-safe Base64（网址安全编码）选择句柄，内容是 schema 版本、来源键、相对位置、大小、修改时间和来源根承诺；它不是签名、秘密或动作授权。",
      "解析相对位置时拒绝绝对路径与上级跳转，并复核最终路径仍位于登记来源根内。",
      "以打开的文件句柄计算 SHA-256，在读取前、读取后和提交前比较文件与路径身份，防止中途替换。",
      "原子事务检查稳定 material_key 与 source/native_id 唯一性；冲突或再次变化时回滚。",
      "同一 source/native_id 的发现路径若内容 SHA-256 已变化，会先删除旧 material_text，再用当前 mtime/size 更新 version_id、按来源文件名更新 version_role，并写入当前来源时间、大小和哈希。",
      "open 对登记项保留同一 VerifiedFile 句柄，并在 os.startfile 前重新读取完整字节、比较原摘要和文件身份；open-discovered 在 SQLite 提交后重新打开并哈希当前文件，再与刚登记摘要比较。",
      "两条打开路线复验通过后才调用 Windows os.startfile(path)；启动失败记录 not_openable，但与 hash_mismatch、missing 分开。"
    ],
    flow: [
      "接收内部选中身份，而不是让用户复制路径、ID 或选择凭据。",
      "确认材料仍是非媒体，并找到对应登记来源或已登记 locator。",
      "对登记候选重算大小与 SHA-256；对发现候选先验证来源根承诺、相对位置与选择前 stat。",
      "完整读取选中项并在文件句柄和当前路径上复核读取期间没有变化。",
      "发现候选在事务中检查稳定身份、写入最小定位，并在提交前最后复核一次。",
      "发现候选若是同一路径的新内容，刷新版本字段并清除旧派生文字；提交完成后仍要再打开、重算哈希。",
      "按请求只验真；若要启动，open 与 open-discovered 都在 os.startfile 前最后复验，随后返回 opened、verified 或精确 gap。"
    ],
    concepts: [
      { term: "Root commitment（来源根承诺）", explanation: "来源根当前解析结果的内部指纹；根目录换到另一位置时，旧选择必须失效。" },
      { term: "Base64 selection handle（Base64 选择句柄）", explanation: "把发现时的来源与文件元数据编码成可解码 JSON 的执行层句柄；它不签名、不保密、也不授权打开，真正完整性仍来自随后重读来源根、stat 与 SHA-256。" },
      { term: "File signature（文件身份）", explanation: "文件句柄与路径的设备、文件、大小和时间字段组合，用于检测读取前后是否换成另一项。" },
      { term: "Identity conflict（身份冲突）", explanation: "稳定材料键或 source/native_id 已指向另一身份；事务必须回滚，而不是覆盖。" },
      { term: "verified / opened", explanation: "verified 只表示当前字节核验通过；opened 还表示系统已接受启动请求，两者都不等于用户已经阅读。" },
      { term: "open_state", explanation: "unverified、verified、not_openable、missing 或 hash_mismatch；每种状态对应不同恢复动作。" }
    ],
    boundaries: [
      "只读取用户或上层流程已经明确选中的一项，不批量为所有候选计算哈希。",
      "路径必须留在登记来源根内，不接受绝对路径、上级跳转或链接逃逸。",
      "发现候选在成功提交前仍不是登记材料，也不能在搜索结果中冒充已核验。",
      "默认应用启动不等于用户阅读完成，更不等于提交、签署或平台收到。",
      "媒体即使持有旧材料记录或构造出的选择凭据，也会在读取字节前被拒绝。",
      "Windows os.startfile 消费的是路径而不是已验证文件句柄；即使启动前立即重哈希，最后一次复验与系统消费路径之间仍有极小竞争窗口。",
      "SQLite 提交与外部文件系统变化不能组成一个原子事务；发现路线用提交前身份检查、提交后启动前重哈希和后续每次 open 复核收窄风险，但不宣称数学上的零窗口。"
    ],
    failures: [
      { condition: "登记 locator 缺失", response: "写回 missing 与 locator_missing，返回实际检查的旧定位；不从相邻目录猜新位置。" },
      { condition: "大小或 SHA-256 漂移", response: "写回 hash_mismatch，返回 size_match/hash_match；旧版本不打开，重新发现后形成新定位。" },
      { condition: "来源根或候选 stat 改变", response: "返回 refresh_required、root_changed 或 candidate_changed；旧内部选择凭据失效，重新 discover。" },
      { condition: "读取期间文件改变", response: "事务回滚并返回 changed_during_hash；不留下新材料记录。" },
      { condition: "稳定身份冲突", response: "回滚并返回 identity_conflict；保留既有记录，等待检查来源与相对位置。" },
      { condition: "同一路径内容已更新", response: "保留稳定 source/native 身份，刷新 version_id/version_role、时间、大小与哈希，并删除旧 material_text；没有本次新文字时保持为空，不能沿用旧派生内容。" },
      { condition: "SQLite 提交后、启动前文件又变化", response: "open-discovered 的第二次哈希或 open 的同句柄重哈希失败，写回 hash_mismatch 与 before_launch gap，不调用 os.startfile。" },
      { condition: "默认应用启动失败", response: "记录 not_openable 和 launcher_failed；不把已通过字节核验的事实改写成哈希失败。" }
    ],
    sources: [
      { path: "README.md", role: "定义候选选择后才哈希、登记并打开，以及登记项每次打开前重新核对。" },
      { path: "materials.py", role: "实现选择凭据、来源根承诺、路径约束、SHA-256、事务、状态写回和启动器调用。" },
      { path: "schema.sql", role: "定义稳定材料身份、source/native_id 唯一性和五种 open_state。" },
      { path: "tests/test_materials.py", role: "覆盖来源根变化、每候选独立来源根、读取中变化、身份冲突回滚、哈希漂移与媒体拒绝。" }
    ],
    verification: [
      "验证登记文件缺失、大小变化和字节变化分别形成 missing 或 hash_mismatch，且不会启动应用。",
      "验证同一相对位置在不同来源中使用各自来源根，不能借另一个候选的根通过。",
      "在哈希读取期间模拟文件身份变化，确认事务回滚且没有新增材料记录。",
      "预置冲突稳定身份，确认既有记录和候选都不被覆盖。",
      "让同一来源相对路径出现新内容，确认 version_id/version_role 刷新、旧 material_text 清空且稳定材料身份不重绑。",
      "分别在登记项启动前重哈希和发现项提交后重哈希时制造变化，确认 os.startfile 从未被调用并写回 before_launch gap。",
      "将 Windows 路径消费的最后竞争窗口和 SQLite/文件系统非原子边界保留为已知限制，不用单元测试冒充已经消除。",
      "真实端到端验收必须记录自然请求、候选选择、核验耗时、打开结果与用户实际看到的原件。"
    ],
    relation: "它是登记查找和有界发现的共同收口：前两者只缩小候选，本模块才证明并打开。成功发现会在这里进入最小登记索引，之后可走更快的已登记查找。"
  },
  {
    slug: "exact-intake",
    shortTitle: "精确接入",
    title: "新材料只通过精确交接登记，原件字节始终留在原处",
    searchAliases: ["新材料怎样精确接入而不复制原件", "personal-materials handoff", "材料接入哈希不一致", "材料索引保存什么", "最小SQLite不是知识库", "媒体handoff为什么拒绝"],
    searchProjection: {
      intents: ["精确接入一份已选非媒体原件", "初始化项目自己的最小 SQLite", "查看最小索引运行状态但不冒充产品结果", "拒绝大小哈希字段或媒体边界不一致的交接"],
      entities: ["personal-materials.handoff.v1", "init", "intake", "status", "sources", "materials", "material_relations", "material_text"],
      relations: ["sources 拥有 materials 原件定位", "material_relations 保存来源原生版本关系", "material_text 绑定 native OCR extracted 文字", "status 只汇总表计数与零复制零后台事实"],
      failureRecovery: ["四表关键列或 integrity_check 不通过时拒绝数据库", "材料稳定句柄在提交前变化时整体回滚", "material_key 与 source/native 重绑时拒绝", "内容变化先清旧 material_text 再写本次文字"]
    },
    teaser: "上游业务只交接已明确选择的一小组非媒体原件；项目现场复算大小与 SHA-256，接受定位元数据和可重建文字，不接管原件。",
    status: `handoff schema（交接结构合同）、绝对来源根、稳定文件句柄、身份防重绑、内容变化文字清理、完整数据库身份与 integrity_check 已有源码与测试结构；${TEST_RESULT}；本页未读取任何真实交接包。`,
    statusTone: "mixed",
    value: "让以后能够快速查找，但不把所有文件搬进新目录，也不把材料项目扩成跨领域数据库。",
    why: "自动爬盘建立全量索引会引入大量无消费者内容、旧版本和媒体重复；仅保存路径又无法确认后来打开的仍是同一字节。精确接入要求上游先选定对象，并让元数据、版本和哈希在写入前一致。",
    example: "一个业务流程已经明确哪份非媒体文件值得以后查找。它生成一个小交接包，包含来源身份、原生 ID、版本/时间、预期大小和 SHA-256。项目现场读取这一份文件复算；任一字段、大小或哈希不一致就整体拒绝，不复制文件字节。",
    result: "得到一个最小、可复核的定位记录：来源、账号/设备别名、原生身份、版本角色、时间、大小、SHA-256、可打开状态、原生关系和绑定文字；原件继续留在原位置。",
    readerStates: {
      pass: "交接 schema（结构合同）与字段严格匹配，原件存在、非媒体、大小和 SHA-256 现场一致；来源、材料、关系和绑定文字在一个事务中接受，original_bytes_copied 为 0。",
      problem: "额外字段、未知来源、大小或哈希不符、关系对象缺失、文字覆盖状态矛盾、身份冲突或媒体对象会整体拒绝；不写半条记录。",
      unavailable: "最小 SQLite（轻量数据库）未初始化、数据库身份不符、原件不可访问或索引不能安全写入时停止接入；不创建第二数据库或复制原件作为替代。"
    },
    stateLabels: ["精确交接一致时", "字段、字节或关系不一致时", "原件或最小索引不可用时"],
    decisionImpact: [
      "来源责任项目先决定哪些原件值得接入，项目不为凑全景主动扫描。",
      "路径、预期大小与 SHA-256 必须现场一致，交接回执不能替代真实文件。",
      "filesystem-directory 来源根必须是绝对路径；相对根在进入发现或写入索引前直接拒绝。",
      "来源、材料、原生关系和绑定文字通过一个事务更新，失败不会留下部分新状态。",
      "material_key 不能改绑到另一 source/native，既有 source/native 也不能改绑到另一 material_key。",
      "同一材料的内容哈希发生变化时，旧 material_text 先清除；随后只写本次交接显式提供的新文字。",
      "可重建文字明确区分 complete 与 partial；partial 必须写缺口，complete 不能带假缺口。",
      "原件字节复制量固定为 0，索引可删除重建，原件仍由来源责任项目保管。",
      "init 与 status 只是索引维护入口：前者建立或确认合法空结构，后者读取最小计数与零后台/零复制事实，二者都不证明用户已经找到原件。"
    ],
    problem: "解决无边界自动索引、路径记录无法证明当前字节、交接字段悄悄漂移、关系悬空、文字覆盖冒充完整和媒体重复所有权。",
    implementation: [
      "只接受顶层 schema、sources、materials、relations 和 texts 五组字段；未知字段直接拒绝。",
      "init 只在索引不存在时创建空文件并执行 schema；已有文件必须同时通过 application_id/user_version、四表存在、关键列集合与 PRAGMA integrity_check，才幂等返回 ready；foreign database（外来数据库）或损坏数据库拒绝覆盖，首次建库失败只清理自己新建的占位。",
      "持久层只有 sources、materials、material_relations 和 material_text 四张表：分别拥有来源范围、原件定位、来源原生关系和与原件绑定的可重建文字。",
      "来源要求 source_key、类型、显示名、根定位、范围、观察时间、complete/partial/unknown 覆盖与显式 gaps；filesystem-directory 的 root_locator 必须是绝对路径。",
      "材料要求来源原生身份、版本、角色、标题、绝对 locator、预期大小和 SHA-256；实现以同一稳定文件句柄依次取得 stat、完整哈希和读取后身份，并把句柄保持到事务提交前。",
      "BEGIN IMMEDIATE 后先拒绝 material_key→source/native 和 source/native→material_key 两个方向的身份重绑；写完来源、材料、关系和文字后，再检查所有稳定句柄身份仍一致，才提交。",
      "既有 material_key 的内容 SHA-256 变化时，在更新材料前删除该材料全部旧 material_text；之后只 upsert 本次 handoff 明确带来的 native、ocr 或 extracted 文字。",
      "材料种类、MIME 或扩展名属于媒体时，在读取字节和计算哈希前返回 media_owned_by_personal_media，并把照片、视频、音频和录音交给 personal-media。",
      "关系两端必须指向本次或既有非媒体材料，并携带来源原生依据；不能连接到媒体历史项。",
      "绑定文字只允许 native、ocr、extracted，并保存文字 SHA-256、complete/partial 与 gaps；ASR 和 transcript 不属于本项目。",
      "通过严格 SQLite schema 与应用身份写入；成功结果只返回计数和 original_bytes_copied=0，不返回材料正文。",
      "status 只读汇总 sources、materials、material_relations、material_text 的行数，并固定报告 background_process=false 与 original_bytes_copied=0；它不读取正文，也不证明覆盖完整或原件当前可打开。"
    ],
    flow: [
      "只有项目索引尚不存在时才运行 init；已有索引要通过四表、关键列和 integrity_check，身份不符或损坏文件原样保留并报错。",
      "来源业务先选择一小组当前确有消费价值的非媒体原件。",
      "生成 personal-materials.handoff.v1，填入来源范围、覆盖、材料原生身份、版本、大小与预期 SHA-256。",
      "项目拒绝额外字段、非法覆盖状态、未知来源、悬空关系和不完整的 partial 文字说明。",
      "逐材料确认真实文件存在、位于绝对 locator、不是媒体；在同一打开句柄上按 stat→完整 SHA-256→读取后身份完成首次稳定核对。",
      "开始写事务后检查双向身份不能重绑；内容哈希变化先清旧 material_text，再 upsert 本次来源、材料、原生关系和新文字。",
      "所有写入完成后、提交前再次核对每个仍打开句柄的文件与路径身份；任何变化整体回滚。",
      "返回 accepted 与最小数量回执，明确 original_bytes_copied=0；后续查找从登记索引读取。",
      "需要维护观察时可运行 status 读取四表计数和零后台/零复制事实，但不能把这些数字写成一次用户查找成功。"
    ],
    concepts: [
      { term: "Handoff（精确交接包）", explanation: "上游业务已经选定对象后提供的小 JSON 合同；不是让材料项目扫描来源的邀请。" },
      { term: "Strict schema（严格结构）", explanation: "表和交接字段都明确列出，未知字段、类型与状态不能被静默忽略。" },
      { term: "Four-table index（四表索引）", explanation: "sources、materials、material_relations、material_text 分别保存来源、定位、原生关系和绑定文字；没有人物、事件或跨领域表。" },
      { term: "init / status", explanation: "init 建立或确认合法最小结构；status 只读计数和零后台/零复制事实。它们是维护入口，不是查找、覆盖或真实端到端结果。" },
      { term: "Stable file handle（稳定文件句柄）", explanation: "从首次 stat、完整哈希到提交前身份复核始终保持同一个打开句柄；它显著缩小替换窗口，但不能让外部文件系统加入 SQLite 原子事务。" },
      { term: "Identity rebinding（身份重绑）", explanation: "同一 material_key 指向新的 source/native，或同一 source/native 改由另一 material_key 占用；两种情况都拒绝而不是覆盖。" },
      { term: "Coverage state（覆盖状态）", explanation: "complete 表示所声明截面完整；partial 必须列缺口；unknown 保留未知，不靠默认值升级。" },
      { term: "Native relation（来源原生关系）", explanation: "签字包、交付包、回执或其他版本关系必须来自来源自带事实，而不是模型跨来源推断。" },
      { term: "Rebuildable text（可重建文字）", explanation: "绑定到精确原件的 native、OCR 或 extracted 文字；删除后可从同一原件重建。" }
    ],
    boundaries: [
      "候选接入必须小而精确，没有当前消费者就不扩大来源或材料范围。",
      "filesystem-directory 的来源根与每个材料 locator 都必须是绝对路径；不把相对路径解释成当前工作目录。",
      "只接入非媒体；ASR、transcript、照片、视频、音频和录音全部由媒体路线拥有。",
      "不复制、移动、改写或删除原件；SQLite（轻量数据库）只保存最小元数据与可重建文字。",
      "不保存事件、人物关系、重要性、领域判断、用户画像或跨来源推断。",
      "status 中的表计数不代表来源 complete，也不证明任何登记 locator 当前仍可打开。",
      "稳定句柄的提交前复核无法把外部文件系统与 SQLite 合成单一原子事务；极小的提交后窗口由以后每次 inspect/open 再哈希兜底。",
      "交接成功不证明平台提交、法院受理、合同生效或用户已经阅读；现实状态由领域责任项目判断。"
    ],
    failures: [
      { condition: "交接字段或 schema 不匹配", response: "返回明确 validation error，整个交接不写入；由上游按当前合同重建小包。" },
      { condition: "filesystem-directory 根或材料 locator 不是绝对路径", response: "在扫描、哈希和写事务前拒绝；不依赖当前工作目录猜出一个位置。" },
      { condition: "原件大小或 SHA-256 漂移", response: "拒绝接入，不接受旧回执或元数据；由来源责任项目重新确认当前版本。" },
      { condition: "材料在首次哈希后、提交前发生变化", response: "稳定句柄身份复核失败，整个 SQLite 事务回滚，不留下来源、材料、关系或文字的部分新状态。" },
      { condition: "material_key 或 source/native 试图重绑", response: "返回 material_identity_conflict，保留原身份与全部既有记录，不用 upsert 覆盖。" },
      { condition: "同一材料内容哈希改变", response: "先删除全部旧 material_text，再只写本次交接提供的新文字；未提供新文字时保持为空，避免旧派生内容污染新字节。" },
      { condition: "关系对象不存在或属于媒体", response: "拒绝关系与整个事务，不制造悬空或跨责任项目连接。" },
      { condition: "partial 文字没有 gap，或 complete 文字带 gap", response: "拒绝覆盖语义矛盾的数据，避免把残缺文字升级为完整。" },
      { condition: "数据库是外部、缺表缺列或损坏文件", response: "application identity、四表关键列或 integrity_check 失败；不初始化覆盖现有字节，只恢复正确的项目索引。" }
    ],
    sources: [
      { path: "AGENTS.md", role: "定义最小定位元数据、原件保护、无跨域推断、媒体分离和现场大小/哈希复核。" },
      { path: "README.md", role: "说明 handoff v1、允许的绑定文字、零原件复制和最小 SQLite 边界。" },
      { path: "materials.py", role: "实现字段验证、媒体判断、路径/大小/SHA-256 现场核对、关系与文字验证和事务写入。" },
      { path: "schema.sql", role: "定义严格来源、材料、关系、绑定文字、唯一约束与数据库应用身份。" },
      { path: "tests/test_materials.py", role: "覆盖额外字段、哈希漂移、外部数据库拒绝、失败初始化清理、媒体 handoff 和零复制状态。" }
    ],
    verification: [
      "以虚构临时文件生成精确 handoff，证明成功回执只含来源/材料/关系/文字数量和 original_bytes_copied=0。",
      "分别修改预期大小、SHA-256、额外字段、文字覆盖和关系端点，确认事务没有部分写入。",
      "验证 filesystem-directory 相对根和材料相对 locator 都在读取或写入前拒绝。",
      "用缺四表、缺关键列、伪造 application id/version 和 integrity_check 失败的数据库验证 init 不覆盖现有字节；首次建库失败只移除自己新建的空占位。",
      "在首次 stat/hash 后和提交前分别改变文件，确认稳定句柄检测变化并回滚全部四表写入。",
      "分别尝试 material_key 与 source/native 双向重绑，确认既有记录字节不变。",
      "让同一 material_key 的内容哈希变化，确认旧 material_text 全清且只保留本次新文字。",
      "验证 status 只返回四表计数、background_process=false 与 original_bytes_copied=0，并确认它不会读取正文或声称覆盖完整。",
      "验证所有媒体类型在读取字节或计算哈希前拒绝，ASR/transcript 文字种类也不能进入材料索引。",
      "真实接入验收必须由一个现役消费者提供精确对象，并在接入后通过普通描述找到、选中、重新验真和打开原件。"
    ],
    relation: "它是登记查找的数据入口，但不是用户日常查找入口。精确接入提供小而可信的来源与版本事实；登记查找消费这些事实，有界发现只在尚未接入的位置补一个选中对象。"
  }
];

export const project = personalMaterialsProject;
export const modules = personalMaterialsModules;
export { personalMaterialsProject, personalMaterialsModules };
