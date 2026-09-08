import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  observedAt: "2026-09-07T23:42:50Z",
  label: "源码与 370 项离线回归通过；本地模型身份匹配，模型生成仍沿用注明日期的历史验收",
  boundary: "本次核对了源码、全部离线测试和本地 Broker（资源仲裁服务）返回的模型元数据，没有重新调用本地或云端模型。35B 交叉验证的智能体路线，以及 Claude Code、Qwen Code、OpenCode 的现模型路线仍待重验。",
  metrics: [
    { label: "默认调用", value: "本地 Qwen3.8 27B" },
    { label: "任务方式", value: "异步提交 · 按需取结果" },
    { label: "模型选择", value: "显式选择 · 不自动换道" },
    { label: "工作过程", value: "桌面只读观察台" }
  ],
  facts: [
    { label: "当前默认模型", value: "local-default 解析到 aicli-qwen3.8-27b-256k:2026-08-14，基座 qwen3.8:27b，Q4_K_M，262144 上下文；默认开启 thinking（推理模式）。本次模型 digest 与登记值一致，Ollama 版本 0.33.1；元数据读取不生成模型回答。" },
    { label: "任务和资料", value: "submit 建立异步任务，job 读取进展与结果；invoke 也进入同一任务、输入校验和清理链。UTF-8 文本可按路径引用并检索片段，媒体走原生视觉或专项工具，长结果保存在本地制品中。" },
    { label: "当前路由证据", value: "local-default 的 codex-cli / data_factory 以 2026-08-15 的非平凡 Agent（可使用工具的执行方式）历史回执为基础，对应 AICLI 0.3.12、Codex CLI 0.147.0；本次 status 返回身份匹配的 current。它不是本次重新完成的模型任务，也不把不同 CLI 版本的兼容性自动视为已验证。" },
    { label: "离线验证", value: "在项目 .venv 下运行完整 unittest：370/370 通过，99.642 秒。覆盖请求、注册表、输入文件、缓存、工作区观察、媒体适配、界面投影和 Windows 启动器；真实云端请求不进入自动化测试。" },
    { label: "源码身份", value: "PUBLIC wlyaaaaa/llm-backend-toolkit，main：6248a12b7cb562665dea891fe37bb11a6772c268，2026-09-08T00:20:30Z 远端已回读。该源码包含观察台责任与续问输入说明纠错；运行代码仍是本次完成回归的 bec4c6e，本地模型元数据观察时间仍为本页所列时间。" }
  ],
  gaps: [
    "local-crosscheck-35b 的 direct（直接模型调用）路线有实现，但本次未生成回答；其 codex-cli 在 2026-08-21 重新验收时出现 aicli.recovery.capture_exception，仍为 unverified / pending_reacceptance，不可借用 27B 的通过结果。",
    "local-default 的 Claude Code、Qwen Code、OpenCode 路线，以及两个 reserved（保留但不可选择）的云端 Qwen agent 条目没有当前有效 Agent 验收；已登记并不等于可执行。",
    "cloud-qwen-flash、cloud-deepseek-v4-flash 的协议和错误分支使用 mock（替身响应）验证；fast-middle-agent 的 Spark 在 2026-07-29 冻结题上达到 81/80 步后硬停，只得 2/9，保留为显式候选而非自动推荐。本次未验证任何云端额度、凭据、模型输出或延迟。",
    "LocalAsyncWorker 是另一条受控本地工作单 API：start/wait/cancel/result 合同已实现，但初始 configured_unverified；没有完整运行绑定时保持 not_ready。它不是原生子代理，也不与普通 submit 的可用性混为一谈。",
    "本次未打开生产观察台运行一个新模型任务；源码测试和既有历史页面验收不能证明当前任务栏图标、整场真实多轮表现或所有设备状态。",
    "带声明的外部输入在非 Windows 系统缺少等价不可变路径绑定时会拒绝运行；没有强行扩成跨平台通用文件保护方案。"
  ]
});

export const llmBackendToolkitSnapshot = Object.freeze({
  ...baseSnapshot,
  generation: "异步额外模型工具 · 显式后端 · 可查阅结果",
  sourceCommit: "6248a12b7cb562665dea891fe37bb11a6772c268",
  sourceRoot: "V:\\Personal\\Projects\\llm-backend-toolkit",
  runtimeFacts: {
    pythonTestsPassed: 370, pythonTestsFailed: 0,
    model: "aicli-qwen3.8-27b-256k:2026-08-14", parentModel: "qwen3.8:27b",
    modelDigest: "e200453f7eea321eab068edbc22c5d38a384a162e46c30ed266c62f0388c4723",
    contextWindowTokens: 262144, ollamaVersion: "0.33.1",
    liveCallPerformed: false, defaultPolicy: "danger-full-access", watchdogTimeoutSeconds: 900,
    gpuBrokerEndpoint: "http://127.0.0.1:32100"
  },
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const llmBackendToolkitProject = {
  order: 24, slug: "llm-backend-toolkit", title: "LLM Backend Toolkit",
  kicker: "把一件明确的工作交给另一个模型，完成后拿回结果",
  route: "/projects/llm-backend-toolkit", visibility: "公开仓库",
  statusTone: "mixed", cardStatus: "异步调用与观察台可用；部分模型路线待重验", cardStatusTone: "mixed",
  ...llmBackendToolkitSnapshot,
  summary: "我正在和主 AI 处理一件事，其中一小部分适合交给本地模型：整理一份长材料、清洗一批虚构数据，或在指定目录里尝试修复代码。这个工具负责把那部分工作交出去、保存输入和进度，完成后把结果与核对依据交回来。主 AI 可以同时继续别的工作，仍由它判断结果是否可用。",
  why: "直接把所有材料塞进主对话会挤占上下文；另开一个模型窗口又容易忘记它用了什么资料、是否真的完成。这里保留明确的任务编号、输入依据、结果和失败原因，让额外模型承担一件可验收的事。它自己不决定总目标，也不会因为某个模型不可用就偷偷换一个。",
  plainExample: "帮我从这份几十页的公开技术说明中找出升级步骤和失败后的恢复办法，给我一张带原文位置的表。主 AI 选好资料和模型后提交任务，先继续做其他部分；稍后取回表格、引用行号、输入摘要和文件位置。模型失败会返回具体原因，主 AI 再决定修正请求、重试或亲自处理。",
  result: "得到可继续使用的短结果、必要时可打开的完整本地文件，以及说明模型、资料、压缩和执行情况的回执。桌面观察台能展示经筛选的公开工作进度；它不是一个能输入指令、暂停任务或代替主 AI 验收的聊天窗口。",
  repositoryNote: "公开仓库包含工具代码、协议、虚构样例和非敏感验收说明。真实任务、输入副本、结果、媒体、提示词和凭据留在各自本地或获准提供方，不进入本网站。明确允许云端时，所选内容会发送到该提供方，不能宣称所有调用都不出本机。",
  readerStates: {
    pass: "所选模型和资料符合请求，任务完成并留下结果；主 AI 取回结果后仍要核对它是否回答了原问题。",
    problem: "模型输出不符、文件变动、额度不足或运行超时会保留对应错误与已存在的依据；不会冒充成功，也不会自动换模型。",
    unavailable: "路线尚未验收、GPU 被占用、缺少凭据或未允许云端传输时，给出具体不可用原因；调用者决定下一步。"
  },
  dataSources: {
    title: "它实际读取什么，又把什么交回来",
    intro: "输入来自本次明确提交的任务和文件，不会扫描整个电脑或偷听其他模型窗口。",
    rows: [
      { source: "本次请求与 UTF-8 文本文件", data: "任务目标、限制、固定保留的文字、选中文件及可选的 SHA-256 和字节数。", result: "挑出相关片段，记录源文件摘要与行号；整理过的输入交给明确选定的后端。" },
      { source: "选中的图片或音频", data: "一般图片、需要精确文字的扫描件，或指定录音。", result: "按选择使用模型原生视觉、LocalOCR 或 ChineseASR；专项识别结果用于本次后续处理，原始私人内容不进入公开观察事件。" },
      { source: "后端注册表与 AICLI", data: "模型、端点、Profile（调用配置）、权限、时间预算与有效验收身份。", result: "决定这一条请求能走哪条已实现路线；缺证据时返回限制，不推断其他路线可用。" },
      { source: "受管任务与提供方通知", data: "生命周期、公开答复、实际存在的用量、工具活动和上下文配对数值。", result: "供 job 查询和观察台显示；累计用量、当前上下文和输入整理估算分别说明。" }
    ]
  },
  productPrinciples: [
    { title: "主 AI 掌握目标和验收", detail: "额外模型只做分配给它的工作。结果是待核对的材料，不因工具返回成功就自动成为最终结论。" },
    { title: "不让失败改变模型和数据去向", detail: "默认只选本地后端；其他模型由调用者显式选择。选择云模型之后，还必须明确允许本次内容出机。" },
    { title: "保留结果，少回传长过程", detail: "长输入在工具内部选择片段，长输出外置成本地文件；回执交代有损整理和省去的回传量，不冒充计费 token。" },
    { title: "承认看不到的部分", detail: "没有实际上下文通知就显示等待，没有最终答复就显示未提供；不能从配置、进程或公开草稿推断隐藏思考与已完成工作。" }
  ],
  operatingFlow: [
    { title: "划清这一件工作", detail: "主 AI 给出问题、输入、限制、期望结果，选择本地或已明确允许的云端路线。" },
    { title: "提交后继续其他事", detail: "submit 返回 job_id；需要同步等待的旧调用可用 invoke，两者进入同一套受管生命周期。" },
    { title: "固定本次输入并处理资料", detail: "worker（后台执行进程）捕获外部文件，校验声明，整理文本或调用专项媒体工具，再让所选模型处理。" },
    { title: "取回结果并核对", detail: "job --result 返回终态、短结果和回执；需要完整文件再取 --full-result。可明确续问，也可拒绝这个结果。" }
  ],
  usageExamples: [
    { ask: "这件工作用哪个模型？失败时别替我换。", effect: "按注册表选定后端；错误只返回可采取的选项。", moduleSlug: "versioned-backend-registry-routing" },
    { ask: "把这份资料交给本地模型，做好了我再来取。", effect: "取得任务编号，随后按需查看结果；文件和缓存身份能对应到这次输入。", moduleSlug: "asynchronous-jobs-and-spool-integrity" },
    { ask: "材料太长，只找和恢复步骤有关的段落；然后接着问一次。", effect: "选取有行号的片段，保留指定文字；续问携带前轮任务编号、结果状态与短预览，不自动附带完整回执。", moduleSlug: "context-sources-and-portable-continuation" },
    { ask: "在这个目录里尝试修复代码，最后把测试结果交回来。", effect: "通过明确的 AICLI 智能体配置运行，权限和时间预算随请求记录。", moduleSlug: "data-factory-agent-execution" },
    { ask: "这份受控本地工作单能开始或取消了吗？", effect: "LocalAsyncWorker 先核对完整绑定；未取得运行证明时保持未就绪，取消也要确认进程树结束和 GPU 释放。", moduleSlug: "data-factory-agent-execution" },
    { ask: "先识别这张扫描页的文字，再归纳要点。", effect: "精确文字先交 LocalOCR，释放 GPU 后再调用模型。", moduleSlug: "multimodal-pipeline-and-specialist-routing" },
    { ask: "我想看看额外模型在做什么，有没有真的回答完。", effect: "观察台显示公开进度、失败草稿和最终答复，缺失信息留空。", moduleSlug: "read-only-model-observer-gui" },
    { ask: "这个模型刚换过，先用一个小例子看看能不能按要求输出。", effect: "选择有界 probe（能力探测），用真实结果验证选中的能力。", moduleSlug: "capability-probes-and-benchmarks" }
  ],
  components: [
    { name: "backends.py / default_backends.json", responsibility: "模型与路线事实", implementation: "可替换 backend、adapter、端点环境变量、模型、agent route 和有效证据。" },
    { name: "context.py / sources.py", responsibility: "输入整理", implementation: "确定性 token 预算、固定保留内容、UTF-8 分块检索、源行号和摘要。" },
    { name: "jobs.py / input_integrity.py / input_lifecycle.py", responsibility: "异步任务与文件生命周期", implementation: "任务认领、受管输入副本、缓存身份、lease（执行占用记录）、终态和清理。" },
    { name: "agent_runners.py / worker_contract.py", responsibility: "已有 CLI 智能体路线", implementation: "精确 AICLI 配置、权限和 watchdog（超时监视）预算；不创建新模型代理协议。" },
    { name: "media.py / providers.py", responsibility: "媒体与模型接口", implementation: "原生视觉、专项 OCR/ASR、Ollama 和 OpenAI Chat 兼容协议。" },
    { name: "observer.py / observer_ui / LlmBackendObserverHost", responsibility: "只读观察", implementation: "本机 HTTP/SSE（服务端更新信号）、WinForms（Windows 窗体）和 WebView2（嵌入网页控件）。" }
  ],
  technicalContracts: [
    { artifact: "后端注册表", schema: "llm-backend-toolkit.backends.v1", owner: "backends.py", boundary: "默认本地、兼容 alias、能力与 exact-model（精确模型）证据分离；禁止内嵌凭据和自动 fallback（改投其他后端）。" },
    { artifact: "请求、结果和工作单", schema: "schemas/request.schema.json · response.schema.json · worker-contract.schema.json", owner: "Toolkit / JobStore", boundary: "task、context、privacy、execution、continuation 和各类结果回执；JSON 字段名不等于真实运行证明。" },
    { artifact: "可复用结果身份", schema: "cache identity v2 · stdlib-json-sort-compact-utf8-v1", owner: "jobs.py", boundary: "可变外部引用默认不命中；显式语义 key 绑定模型、路线、隐私及输出协议，只公开调用 key 的 hash。" },
    { artifact: "Agent 验收", schema: "aicli.agent.acceptance-receipt.v1", owner: "AICLI", boundary: "Profile 指纹、模型 artifact、运行身份、非平凡任务与独立 verifier（结果检查器）必须对应；换模型不能继承旧证据。" }
  ],
  evidenceLayers: [
    { layer: "本次源码与 370 项离线测试", proves: "当前受控场景下的请求、路由、文件生命周期和观察台行为通过回归。", doesNotProve: "没有新模型回答，不证明云端额度、外部服务所有状态或用户当前窗口。" },
    { layer: "本次本地元数据回读", proves: "Broker 可回应、未占用；Ollama 0.33.1 和 27B 模型 digest 与登记值匹配。", doesNotProve: "不会产生回答，也不等于用当前 CLI 再做了一轮智能体任务。" },
    { layer: "注明日期的历史模型与页面验收", proves: "对应模型、CLI、工作单和结果曾通过；观察台已有真实事件/页面验收。", doesNotProve: "不能推广到新版本、35B 或未登记路线；历史搜索调用成功不等于上游返回了有效搜索结果。" }
  ],
  responsibilities: ["接收明确的有界任务并返回可核对结果。", "维护已有模型路线、输入整理、任务和观察台。", "由 AICLI 拥有原生执行，LocalGpuBroker 拥有 GPU，OCR/ASR 项目拥有专项识别。"],
  exclusions: ["不自主制定长期目标，不替主 AI 作最终验收。", "不自动换模型、绕开 Broker 或传送未获准的云端内容。", "不捕获直接运行的 Codex、AICLI 或第三方客户端的全局历史。", "不把原始私人任务、隐藏推理、识别正文或密钥发布到网站。"],
  operationalEntrypoints: [
    { name: "列出模型路线", command: "llm-backend-toolkit backends", purpose: "读取注册表元数据，不生成回答。" },
    { name: "检查默认模型", command: "llm-backend-toolkit status", purpose: "回读所选后端的安全状态，不生成回答。" },
    { name: "提交任务", command: "llm-backend-toolkit submit --request request.json", purpose: "立即返回编号；--force 明确创建新尝试。" },
    { name: "取回结果", command: "llm-backend-toolkit job --id <job_id> --result", purpose: "需要完整内容时改用 --full-result。" },
    { name: "打开观察台", command: "pwsh -NoProfile -File scripts/Start-LlmBackendObserver.ps1", purpose: "打开已有只读本机窗口；正式 Skill 在提交前确保观察入口可用。" },
    { name: "移除观察台入口", command: "pwsh -NoProfile -File scripts/Install-LlmBackendObserverShortcut.ps1 -Remove", purpose: "仅删除能证明属于本项目的桌面和开始菜单快捷方式。" }
  ],
  evolution: [
    { date: "2026-07", result: "从显式模型调用扩展为异步任务、结果文件、可复现数据工厂和三类通用代理基准。" },
    { date: "2026-08-13", result: "只读观察台完成历史真实事件与页面验收；公开工作进度、最终答复和运行上下文各有明确来源。" },
    { date: "2026-08 至 09", result: "默认模型切换为精确的 Qwen3.8 27B；完善外部输入的声明校验、缓存与清理，保留旧路线待重验状态。" }
  ],
  glossary: [
    { term: "Backend（后端）", meaning: "实际接收请求的模型及其提供接口。" },
    { term: "JobStore（任务存储）", meaning: "保存每次工作状态、结果和事件的本地目录管理层。" },
    { term: "Spool（本次输入副本）", meaning: "实际调用前固定下来的文件副本，生命周期结束后清理。" },
    { term: "Portable continuation（可携带续问）", meaning: "携带前轮编号、结果状态与短预览，形成有限次的新请求，不自动附带回执或依赖厂商隐藏会话。" },
    { term: "Current evidence（身份仍匹配的证据）", meaning: "已有回执与本次检查的模型身份对应，不表示今天又运行了该任务。" }
  ],
  searchAliases: ["LLM Backend Toolkit", "额外模型", "本地模型任务", "异步模型调用", "模型调用观察台"],
  searchProjection: { intents: ["把一件明确工作交给本地模型后稍后取回", "从长材料里提取信息并继续追问", "查看额外模型公开工作过程"], entities: ["JobStore", "local-default", "Qwen3.8 27B", "LocalOCR", "ChineseASR"], relations: ["主AI分配任务，Toolkit调用模型，主AI验收结果"], failureRecovery: ["模型失败不自动换道", "输入变化拒绝消费", "终态清理输入副本"] }
};

export const llmBackendToolkitModules = [
  {
    id: "versioned-backend-registry-routing", slug: "versioned-backend-registry-routing", order: 1,
    title: "模型选择、配置与证据", shortTitle: "模型与路线", route: "/projects/llm-backend-toolkit/versioned-backend-registry-routing",
    teaser: "明确用谁、数据去哪里，失败后由调用者决定", kicker: "选择模型", status: "默认身份匹配；部分路线待重验", statusTone: "pass",
    value: "把模型名字、提供方和执行路线写清，防止换了模型却沿用旧结论。",
    why: "同一个简称可能指向不同模型；某个直接 API 能回答，也不代表它能在 CLI 中调用工具。注册表分别描述这些事实。",
    example: "我想让本地模型处理一份说明，但不能传到云上。省略 backend 就走 local-default；若本地不可用，返回原因，不自动改投云端。",
    result: "知道请求将使用的模型、适配器、端点与证据；允许执行和实际完成是两层结果。",
    problem: "配置错误、模型身份变化或路线缺验收时，拒绝该路线，其他独立路线按自己的事实判断。",
    readerStates: { pass: "配置与当前模型身份对应，按指定路线调用。", problem: "身份已改变，旧验收失效，需要核对新路线。", unavailable: "模型未登记、缺凭据或云端未获准时停止。" },
    decisionImpact: ["默认只解析注册表 default_backend，本地 direct 不等于已验收 Agent。", "云端请求必须额外带 privacy.cloud_allowed=true；失败不自动 fallback。", "35B 是显式交叉验证，不进入默认或兜底选择。"],
    implementation: [
      "default_backends.json 使用 llm-backend-toolkit.backends.v1；LLM_TOOLKIT_BACKEND_REGISTRY 可指定机器注册表。alias、backend、adapter、model、route、runner 和 AICLI Profile 分开。",
      "local-default 与 local-hard-reasoning 均为 aicli-qwen3.8-27b-256k:2026-08-14；后者要求 reasoning.mode=on。参数为 temperature 0.6、top_p 0.95、top_k 20、min_p 0、presence_penalty 0、repeat_penalty 1、num_ctx 262144、num_predict 32768。",
      "请求 alias qwen-main-v1 指向 27B local-default；local-crosscheck-35b / qwen-crosscheck-35b 才选模型名为 qwen-main-v1 的 Qwen3.6 35B。两个命名层不能混用。",
      "fast-middle-agent 精确绑定 codex-spark-xhigh / gpt-5.3-codex-spark / xhigh。2026-07-29 冻结代码修复题达到 81/80 步硬停、2/9，只保留显式候选，不作自动推荐；选择时须明确 backend 与 cloud_allowed。cloud-qwen-flash 使用 qwen3.7-flash，cloud-deepseek-v4-flash 使用 deepseek-v4-flash，两者 direct-only（仅直接 API 调用）。",
      "云端 openai-chat 只用 HTTPS，密钥以环境变量名引用。reasoning_request 以 JSON 路径配置 enable_thinking 或 thinking.type；隐藏 reasoning_content 在提供方边界丢弃。"
    ],
    flow: ["解析请求和 alias", "读注册表与本地/云端边界", "Agent 路线匹配精确证据", "调用指定 adapter 或返回具体错误"],
    concepts: [{ term: "没有 fallback", explanation: "调用失败不自动换供应商、模型或数据去向。" }, { term: "精确证据", explanation: "一次历史成功只属于对应模型、Profile、CLI 和验证任务。" }],
    boundaries: ["35B 的 codex-cli 与现模型的三个旧 runner 待重验。", "云端 mock、凭据存在和真实模型回答各自独立。"],
    failures: [{ condition: "billing_unavailable、限流或 GPU 占用", response: "返回选项，调用方决定重试或接管。" }, { condition: "backend / Agent 证据不匹配", response: "在调用前拒绝，不借其他模型回执。" }],
    sources: [{ path: "src/llm_backend_toolkit/default_backends.json", role: "可选择模型及证据" }, { path: "src/llm_backend_toolkit/backends.py", role: "解析与校验" }, { path: "docs/local-crosscheck-35b.md", role: "35B 的失败与边界" }],
    verification: ["本次 status 回读 27B digest、Ollama 0.33.1 与空闲 Broker；live_call_performed=false。", "注册表与提供方测试包含完整 370 项回归。"],
    relation: "后续所有文本、媒体和 Agent 任务共用这次明确选择。",
    searchProjection: { intents: ["本地模型不可用时别改投云端", "35B交叉验证是否能使用工具"], entities: ["local-default", "local-hard-reasoning", "local-crosscheck-35b", "fast-middle-agent", "cloud-qwen-flash", "cloud-deepseek-v4-flash"], relations: ["注册表绑定模型与路线验收"], failureRecovery: ["模型身份变化使旧回执失效", "欠费不自动降级"] }
  },
  {
    id: "asynchronous-jobs-and-spool-integrity", slug: "asynchronous-jobs-and-spool-integrity", order: 2,
    title: "异步任务、输入与结果保存", shortTitle: "任务与输入", route: "/projects/llm-backend-toolkit/asynchronous-jobs-and-spool-integrity",
    teaser: "提交后可以离开；结果仍能对应这次资料", kicker: "任务生命周期", status: "离线回归通过", statusTone: "pass",
    value: "保存任务编号、当次输入、进展和结果，让主 AI 不必一直等着。",
    why: "提交以后原文件可能被修改，旧结果也可能误当成新结果；执行进程若已死，还需要明确结束并清掉当次临时输入。",
    example: "我把一个文本文件交给模型，继续整理另一个项目。回来后按编号取结果；若交接期间原文件变化，工具会先报输入不一致，不给出基于另一份材料的成功结果。",
    result: "拿到可核对的任务终态、短结果和完整文件位置；失败、取消、输入清理各有记录。",
    problem: "超期任务会停止建议轮询；只有确认 worker 已死亡才回收，不能因为一段时间没输出就误清活任务。",
    readerStates: { pass: "工作完成且结果、输入摘要和清理记录对应。", problem: "输入有变化或执行失败，保留原因，结果不进入成功缓存。", unavailable: "无法证明进程已死或输入绑定不成立时，不冒险清理或继续调用。" },
    decisionImpact: ["submit 异步返回；invoke 也走受管任务，只是调用方等待结果。", "要求结构化结果时，工具会指出空答复、JSON 格式错误或缺少指定字段；检查通过仍不证明内容正确，主 AI 继续验收。", "未提供文件声明的旧请求仍可捕获执行，但标为未验证，不当成缓存命中依据。", "明确需要重跑时 submit --force，不把旧结果包装成一次新执行。"],
    implementation: [
      "JobStore 在本地保存请求、lease、状态、事件、结果及 artifact（完整结果文件）。worker 记录 PID 与创建身份；get / cleanup_inputs 只有确认其死亡才原子结束任务并清理 spool。",
      "expected_sha256 与 expected_bytes 必须成对。流式复制时检查原件读取期间变化、摘要、长度和副本回读；Windows 从创建副本起持有 FILE_SHARE_READ 句柄，贯穿实际消费，并验证 canonical containment（规范路径包含关系）。",
      "缺声明的引用标记 captured_unverified / spooled_unverified；带声明却缺平台等价不可变绑定时拒绝执行。终态清除输入副本与 prepared request，留清理回执；Python JobStore.cancel / cleanup_inputs 是现有精确入口。",
      "无外部引用的相同请求默认复用成功结果；workspace / source / media 默认不缓存。execution.cache_key 仅由调用方提供真实内容与派生版本身份，仍绑定已解析 backend、model、route/profile、privacy、reasoning、媒体和输出协议。",
      "v2 只公开 caller_cache_key_hash，使用 stdlib-json-sort-compact-utf8-v1 规范化；v1 历史仍能按 ID 查询，但不成为新缓存证明。失败和取消不命中。长结果只回短预览与 hash，--full-result 可取完整输出。",
      "Toolkit._check_output 核对 nonempty_output；请求 JSON 时继续核对 valid_json 与 required_keys。返回这些确定性检查，不证明答案事实正确、内容完整或代码符合用户目标，仍需调用者验收。",
      "recommended_check_utc 和 monitor_until_utc 提供建议时机；过早查询后退避。stale 是需要上层判断的超期状态，不自动换模型或永久等待。"
    ],
    flow: ["建立任务编号", "认领执行并固定输入", "完成模型/专项处理", "保存结果与回执", "清理本次输入并等待调用方取回"],
    concepts: [{ term: "输入声明", explanation: "我明确指定文件的摘要与字节数，工具在真正消费前核对。" }, { term: "结果缓存", explanation: "只在真实内容和模型等条件相同且允许复用时，返回既有成功结果。" }],
    boundaries: ["本地任务材料不进入 PUBLIC Git 或网站。", "文件锁和校验不代表整个工作区属于该 worker 独占。"],
    failures: [{ condition: "输入摘要、长度或路径不对应", response: "在 provider 消费和发布结果缓存前失败。" }, { condition: "worker 死亡", response: "确认进程身份后结束任务，清掉私有输入并留下清理记录。" }],
    sources: [{ path: "src/llm_backend_toolkit/jobs.py", role: "任务和缓存" }, { path: "src/llm_backend_toolkit/input_integrity.py", role: "输入校验" }, { path: "src/llm_backend_toolkit/input_lifecycle.py", role: "占用与清理" }],
    verification: ["370 项回归包含输入变动、并发打开、缓存边界、活 worker 保全与终态清理。"],
    relation: "文本、媒体、direct 和 Agent 共用同一结果生命周期。",
    searchProjection: { intents: ["任务交出去以后怎样取回结果", "如何避免模型用了变化后的文件", "结束任务后清理输入副本"], entities: ["JobStore", "input-spool", "expected_sha256", "expected_bytes", "cache_key", "stale"], relations: ["声明绑定当次输入，缓存绑定内容与路线"], failureRecovery: ["活worker不误清", "失败结果不复用", "force创建新尝试"] }
  },
  {
    id: "context-sources-and-portable-continuation", slug: "context-sources-and-portable-continuation", order: 3,
    title: "长材料整理与有限续问", shortTitle: "材料与续问", route: "/projects/llm-backend-toolkit/context-sources-and-portable-continuation",
    teaser: "先找有关段落，再带着短结果接着问", kicker: "少搬运，保留依据", status: "源码及离线回归通过", statusTone: "pass",
    value: "在工具内部整理长输入，回传可核对的小结果，必要时继续问几轮。",
    why: "把全文和整场聊天往返搬运很容易占满主对话；过度缩短又可能丢掉限制。工具保留指定文字，并明确说出有没有有损处理。",
    example: "这份技术文档只需要恢复步骤和对应限制；第一轮列出处，第二轮把顺序整理成清单。工具先选相关片段，再把前轮编号、结果状态和短预览带入第二轮。需要完整出处或回执时，调用者要另外明确提供。",
    result: "获得带源 hash、行号和整理回执的回答；续问有起点和轮数，换提供方也不依赖旧隐藏会话。",
    problem: "估算的 token 是输入整理尺度；不是计费量，也不是 Codex 实测上下文。没有选中的资料，模型不能被当成读过全文。",
    readerStates: { pass: "指定限制保留，相关片段有出处，短结果可继续使用。", problem: "预算导致有损整理时显式记录，必要时调整片段或扩大输入。", unavailable: "文件不是支持的 UTF-8 文本或续问超过上限时拒绝，不猜原文或无限续跑。" },
    decisionImpact: ["context.pinned 保存不能被压掉的要求。", "PDF/Office 先用相应读取器；这里的 source 接口不是万能文档解析器。", "continuation 默认最多 3 轮、硬上限 8 轮，只自动带前轮编号、结果状态和预览；需要原文与回执须另外提供。"],
    implementation: ["context.py 进行确定性整理，区分中日韩与 ASCII token 估算，按 target_tokens 收敛并报告前后估算、duplicates_removed 与 lossy。", "sources.py 根据目标分块、打分，使用 top_k / max_chars 选择 UTF-8 段落，返回源摘要和行号；引用的字节完整性仍由输入生命周期负责。", "continuation.from_job_id 指定已经完成的前轮，max_turns 约束链长。_prepare_continuation 追加 previous_result，只有 job_id、result_status、output_preview；不会自动附加完整 receipt。delegation_receipt / delivery_receipt 仍作为每次任务的独立结果回执保存。"],
    flow: ["给出目标和固定要求", "读取已捕获文件并选择相关片段", "按预算整理后调用模型", "返回短结果和出处", "确有必要时显式续问"],
    concepts: [{ term: "有损整理", explanation: "部分输入被省略，必须告诉调用者，不能声称完整读过全文。" }, { term: "可携带续问", explanation: "用显式结果衔接新请求，而不是依赖某家 API 看不见的会话。" }],
    boundaries: ["不提供无限会话或长期隐式记忆。", "估算节省量不等于 Codex 账单节省量。"],
    failures: [{ condition: "来源读取或格式失败", response: "返回明确错误，改由对应读取器处理后再提供文本。" }, { condition: "续问轮数超限", response: "停止，由主 AI 决定是否形成新的有界任务。" }],
    sources: [{ path: "src/llm_backend_toolkit/context.py", role: "确定性整理" }, { path: "src/llm_backend_toolkit/sources.py", role: "文本片段与出处" }, { path: "src/llm_backend_toolkit/jobs.py", role: "续问链与交付回执" }],
    verification: ["test_context、test_sources 和 test_jobs 的相关行为纳入本次 370 项回归。"],
    relation: "位于输入固定之后、模型调用之前；续问则使用前轮已完成结果。",
    searchProjection: { intents: ["材料太长只读相关段落", "模型回答后再继续问一次", "保留不能删除的要求"], entities: ["context.pinned", "target_tokens", "top_k", "max_chars", "continuation", "max_turns"], relations: ["文本片段携带行号，续问携带短结果"], failureRecovery: ["有损整理明确披露", "格式不支持不猜原文", "超过轮数停止"] }
  },
  {
    id: "data-factory-agent-execution", slug: "data-factory-agent-execution", order: 4,
    title: "有工具的智能体执行", shortTitle: "智能体执行", route: "/projects/llm-backend-toolkit/data-factory-agent-execution",
    teaser: "让指定模型在明确目录中做事，再检查产物", kicker: "AICLI 执行路线", status: "精确默认路线有历史验收", statusTone: "pass",
    value: "需要读写文件、运行命令时，使用已有原生 CLI，而不是把一次文本回答当工程完成。",
    why: "能返回一段文字和能做完一个有工具的任务是两种能力；后者必须同时检查模型、执行路线、工具活动、产物和清理。",
    example: "在这个练习目录里修好区间合并函数，运行现有测试，报告修改与仍失败的情况。主 AI 指定工作区和权限，data_factory 按登记的 Codex CLI 配置执行。",
    result: "普通 Agent 返回产物、执行回执和验证结果；主 AI 仍检查功能是否符合原任务。另一条 LocalAsyncWorker（受控本地工作单）入口还需完整运行绑定，不能把普通 Agent 的权限或历史成功直接套过去。",
    problem: "超时、协议字段不完整或旧模型证据不能对应当前配置时，会失败而非降到普通聊天或其他 CLI。",
    readerStates: { pass: "精确路线完成任务，验证与清理都能对应。", problem: "产物可能有用但执行/验证未完成时标注 partial（未完成）。", unavailable: "缺受管入口、配置或验收时，在模型启动前拒绝。" },
    decisionImpact: ["普通 Agent 默认 execution.policy=danger-full-access，只限已授权可信任务；可显式收窄 read-only / workspace-write。", "普通 Agent 默认 watchdog_only、900 秒，不加默认步数/工具次数上限；bounded 才接受显式硬上限。", "completion_driven 的旧输入仍识别，但当前 AICLI 未声明可续期 idle lease 时提前拒绝，不静默改模式。", "LocalAsyncWorker 只使用隔离 workspace-write 根，提供 start / wait / cancel / result；它不是原生子代理，不继承最高权限或再次委派。", "如果受控工作单没有完整的运行身份证明，就返回 configured_unverified / not_ready。取消必须确认进程树结束且 GPU 租约释放，否则保持 cleanup_unconfirmed，不能伪造 CANCELLED。"],
    implementation: ["agent_runners.py 通过 LLM_TOOLKIT_AICLI_ENTRY 固定受管入口；正式 Skill 不会因该入口丢失改用旧安装态。", "data_factory 和 codex-cli 默认绑定 codex-ollama-qwen3-8-27b 与精确 artifact；worker-contract 区分非原生工具句柄、运行证明和最终结果。", "受管 Codex 可通过 AICLI 的 public_web_search 使用真实搜索工具；观察台只消费安全 lifecycle，搜索工具调用不等于获得有效结果。", "数据工厂与通用基准使用独立、不可写入候选工作区的 verifier；CLI 完成、产物通过、稳定性与压力测试分别记录。", "LocalAsyncWorker.start 强制 fresh_execution=true / force=true，禁止 cache key。接受 legacy local-default→data_factory→codex-cli，或运行时精确解析的非云 benchmark_only backend；后者网络禁止、搜索关闭、固定 7200 秒 watchdog，均无 fallback。", "受控工作单的 requested binding 涵盖模型/配置/digest、AICLI 与事件协议、工具来源、独占 GPU 租约、沙箱、任务/工作区、检查器和预算。初始 configured_unverified；只有运行期同时提供上下文与保留输出等 observed binding 才可 eligible_after_runtime_proof。result 只读终态，缺字段返回 local_worker_binding_incomplete。", "wait 是建议时机后的一次有界查询，不是循环监视。cancel 依赖宿主注入的 controlled_bridge，须返回 process_tree.confirmed_absent 和 gpu_lease.released；请求本身不能注入取消命令。当前合同和取消桥不等于通用生产适配已就绪。"],
    flow: ["选择已有 Agent route", "绑定工作区、权限与时间预算", "由原生 CLI 完成工具活动", "核验结果、运行身份与清理"],
    concepts: [{ term: "Harness（执行环境）", explanation: "为模型提供原生工具、权限和会话运行方式的 CLI 环境。" }, { term: "权限不等于目标", explanation: "能写目录外文件并不允许自行扩大用户交给它的任务。" }],
    boundaries: ["当前可选择路线依注册表和精确证据判断，不按 CLI 安装清单猜可用。", "历史成功不证明新版本兼容。"],
    failures: [{ condition: "AICLI 入口不存在或 receipt 不符", response: "调用前关闭该路线。" }, { condition: "预算或原生协议失败", response: "返回具体状态和已有产物，不升格为已完成。" }],
    sources: [{ path: "src/llm_backend_toolkit/agent_runners.py", role: "已有 CLI 的窄适配" }, { path: "docs/agent-data-factory.md", role: "数据工厂任务" }, { path: "docs/aicli-agent-acceptance-contract.md", role: "精确验收" }, { path: "docs/local-async-worker-contract.md", role: "工作单" }],
    verification: ["本次离线 agent/worker/预算测试通过；没有启动新模型 benchmark。"],
    relation: "调用身份由注册表拥有，结果进入同一 JobStore 和观察台。",
    searchProjection: { intents: ["让本地模型修代码并运行测试", "智能体默认能写哪些目录", "任务超时该怎么办"], entities: ["AICLI", "data_factory", "codex-cli", "watchdog_only", "danger-full-access", "worker_contract"], relations: ["Profile模型验证对应产物"], failureRecovery: ["旧入口不自动回落", "超时不冒充完成"] }
  },
  {
    id: "multimodal-pipeline-and-specialist-routing", slug: "multimodal-pipeline-and-specialist-routing", order: 5,
    title: "图片、文字识别与录音", shortTitle: "媒体处理", route: "/projects/llm-backend-toolkit/multimodal-pipeline-and-specialist-routing",
    teaser: "一般看图、精确读字、听录音各走合适的已有工具", kicker: "专项媒体路线", status: "适配行为回归通过", statusTone: "pass",
    value: "将选中的图片或录音转成这次任务需要的内容，再交所选模型使用。",
    why: "看懂一张图和精确读出表格不是同一件事；同时启动 OCR 与大模型还可能争用一张显卡。这里明确分工并串行释放资源。",
    example: "这是一张扫描表格，数字必须准确。先交 LocalOCR 读字，再由模型归纳；如果只是解释照片内容，可选择原生视觉。指定录音则交 ChineseASR 转写。",
    result: "得到对应专项工具的结果和媒体路线回执，再形成模型输出；识别精度仍按专项证据判断。",
    problem: "专项失败或模型不支持该输入时返回原因，不把文件路径当成模型已经看过文件。",
    readerStates: { pass: "所选路线完成识别或原生附件传递，结果继续用于任务。", problem: "识别存在不确定内容时保留专项说明，不能猜数字。", unavailable: "入口缺失、视觉不支持或 GPU 不可用时停止该阶段。" },
    decisionImpact: ["native 走模型视觉，specialist 走专项工具；auto 对一般图优先视觉，对精确文字/表格/公式优先 OCR，音频走 ASR。", "OCR 使用 -StopAfter，ASR 结束释放 Broker 租约，再进入本地模型阶段。", "云端媒体与识别后文本同样需要明确允许传输。"],
    implementation: ["media.py 通过 LLM_TOOLKIT_LOCALOCR_ENTRY / LLM_TOOLKIT_CHINESEASR_ENTRY 调用既有 owner 工具，模型只连接 Broker 127.0.0.1:32100，不绕过它直连内部 Ollama。", "Codex CLI 使用原生 --image，OpenCode 使用附件；Qwen Code / Claude Code 的本地图片传递能力有明确限制。", "专项 owner 拥有原始识别数据与状态；Toolkit 记录本次工作阶段，观察事件不包含原始媒体、识别正文或凭据。不能把这一公开事件限制写成整个产品绝不保存本地结果。"],
    flow: ["明确媒体与精度要求", "选择原生或专项路线", "专项结束释放 GPU", "交给指定后端", "返回媒体与结果依据"],
    concepts: [{ term: "专项识别", explanation: "由 LocalOCR / ChineseASR 完成文字或语音任务，而非让一般模型猜测。" }],
    boundaries: ["本次未处理私人扫描件或录音，也未做新的 GPU 实机识别。", "适配测试不证明任意输入的识别准确率。"],
    failures: [{ condition: "工具或 GPU 不可用", response: "返回该阶段错误，不并发抢占或绕开 Broker。" }],
    sources: [{ path: "src/llm_backend_toolkit/media.py", role: "媒体选择和专项适配" }, { path: "tests/test_media.py", role: "适配行为" }],
    verification: ["媒体路由与串行调用的离线回归通过；专项本身的当前实机能力由各自项目说明。"],
    relation: "与文本一样受输入校验、云端边界和任务生命周期约束。",
    searchProjection: { intents: ["先识别扫描页再总结", "录音转写后整理要点", "OCR和模型不要同时占显卡"], entities: ["LocalOCR", "ChineseASR", "LocalGpuBroker", "native", "specialist", "auto"], relations: ["专项结束释放GPU后调用模型"], failureRecovery: ["路径不等于原生视觉", "识别失败不猜测"] }
  },
  {
    id: "read-only-model-observer-gui", slug: "read-only-model-observer-gui", order: 6,
    title: "只读模型调用观察台", shortTitle: "调用观察台", route: "/projects/llm-backend-toolkit/read-only-model-observer-gui",
    teaser: "看见公开进度、最终答复与证据，不接管任务", kicker: "桌面观察窗口", status: "当前源码回归与历史页面证据", statusTone: "pass",
    value: "把受管模型任务聚在一处，方便看进展、看结果和分清失败前草稿。",
    why: "后台任务常有静默阶段，看到一个进程不代表工作在推进；而把所有技术事件摊开又很难阅读。观察台把安全的真实消息与活动按时间交错呈现。",
    example: "我想知道刚交出去的模型有没有输出。窗口显示那次工作的公开进度；结束后显示最终答复。只有草稿但没有 output.completed 时，明确说本轮未提供公开答复。",
    result: "得到桌面三栏视图：对话列表、连续工作记录、对话信息。只读，不带输入、停止、审批或设置控制。",
    problem: "没有上游实测数据就显示等待或不可用；失败草稿不能充当最终答案。",
    readerStates: { pass: "真实事件自动更新，最终输出与同一回答节点对齐。", problem: "断线后有界查询，历史回看不会被新调用抢走。", unavailable: "宿主加载失败留下本机诊断；正式 wrapper 不静默开始不可观察的调用。" },
    decisionImpact: ["只观察 invoke / submit / probe 或显式安全导入，不扫描其他 Codex / AICLI 的全局聊天。", "公开 commentary（工作说明）和 reasoning.summary.delta（公开推理摘要）可显示；隐藏思考正文不进入事件。", "累计 token、当前上下文、Toolkit 输入整理和 Codex 原生压缩是不同指标。"],
    implementation: ["WinForms / WebView2 宿主使用独立 profile，导航成功后显示窗口；启动器去重，后台进程无控制台。CurrentUser 桌面与开始菜单快捷方式只升级/删除能证明属于本工具的链接。", "SSE 发送刷新信号，同源 API 读取详情；断线后有界查询，活任务耗时每秒更新并低频复核，终态冻结。历史分页与完整主对话投影分开，不用最近 160 条原始事件裁掉主对话。", "公开草稿上限 20000 字，超过明确提示；output.completed 用完整有界输出对齐草稿，普通 JSON 不因字段名为 preview 就丢失其他内容。", "当前上下文只认同一 runtime 通知内的 last.totalTokens 和 modelContextWindow 配对；累计 token 取 total。Ollama 输出速度用 eval_duration，AICLI 用执行墙钟估算，标签区分。", "工作区默认只记录数量且归因标为并发观察未证；明确列出 observability.file_changes.include 才显示有界文本 diff。完整本机路径由独立观察元数据在 loopback 端合成，不进入公共事件/结果。", "快捷方式两个 Known Folder（系统标准目录）不是原子事务；中途出现冲突会停止且保留已完成的本工具操作，处理冲突后幂等重跑。"],
    flow: ["打开或激活既有窗口", "接收受管任务", "交错显示公开进度和活动", "对齐最终答复与折叠回执", "记录调用方是否取回结果"],
    concepts: [{ term: "公开进度", explanation: "上游明确可展示的消息，不能据此推导隐藏思考。" }, { term: "实测上下文", explanation: "同一通知中的已用量与上限，不能拿模型配置来补。" }],
    boundaries: ["正式交互为电脑端最小 1120px 三栏，不维护手机观察台。", "任务栏图标的属性写入不证明 Explorer 最终渲染。"],
    failures: [{ condition: "未收到最终输出或上下文配对", response: "分别显示缺失；上游协议要求不满足时返回明确错误。" }, { condition: "WebView 初始化或导航失败", response: "写有界本机诊断并关闭，不用占位页冒充成功。" }],
    sources: [{ path: "docs/model-observer.md", role: "产品和历史验收" }, { path: "src/llm_backend_toolkit/observer.py", role: "安全结果投影" }, { path: "src/llm_backend_toolkit/observer_ui/app.js", role: "阅读界面" }, { path: "scripts/Start-LlmBackendObserver.ps1", role: "桌面入口" }],
    verification: ["本次 observer、UI 与 Windows 无窗口启动测试纳入 370 项回归。", "2026-08-13 历史实测覆盖真实公开活动与页面；当次搜索上游不可用，不声称取得有效搜索结果。"],
    relation: "观察台只消费工作事实，模型、GPU 和专项任务仍归原入口。",
    searchProjection: { intents: ["查看额外模型工作过程", "区分草稿和最终回答", "模型上下文实际用了多少"], entities: ["WinForms", "WebView2", "SSE", "output.completed", "tokenUsage.total", "modelContextWindow"], relations: ["只读观察受管任务，不捕获全局聊天"], failureRecovery: ["没最终输出就明确缺失", "断线有界查询", "图标元数据不作视觉验收"] }
  },
  {
    id: "capability-probes-and-benchmarks", slug: "capability-probes-and-benchmarks", order: 7,
    title: "能力探测与可复现基准", shortTitle: "探测与验证", route: "/projects/llm-backend-toolkit/capability-probes-and-benchmarks",
    teaser: "用一件可检查的事验证能力，避免只看模型名字", kicker: "结果验证", status: "工具已实现；本次未重跑模型基准", statusTone: "unknown",
    value: "首次重要使用或模型变化后，做有界检查，知道这条路线实际能完成什么。",
    why: "模型会变，CLI 也会变；过去能运行某个任务不能成为永久能力保证。验证需要明确输入、独立检查器和对应运行身份。",
    example: "刚换了模型，先给它一个有固定答案的小任务，检查是否能按 JSON 输出。若需要评估工程任务，再运行选定的代码修复或数据工厂案例。",
    result: "取得这一次、这条路线的任务结果和检查分数；不生成永久排名，也不自动改变默认模型。",
    problem: "基础设施失败和任务回答失败分开；没有有效入口时不生成貌似有分数的空跑报告。",
    readerStates: { pass: "实际任务和独立 verifier 对应，报告身份与结果。", problem: "只有产物正确但运行协议失败时，保留两层结论。", unavailable: "缺受管入口、路线验收或云端许可时，不启动模型。" },
    decisionImpact: ["probe 可选 instruction / json / context / vision，异步返回任务编号，不是每次调用的强制前置。", "general_agent_v1 包含证据推理、代码修复和约束工作流规划，比较的是模型加执行环境。", "只有需要新证据才运行；本网页刷新不制造昂贵模型任务。"],
    implementation: ["probe --backend <id> --case <case>；vision 需附件，云端还需 --cloud-allowed。支持 --force 明确新尝试。", "run_general_agent_benchmark.py --list 可只列案例；真实运行要求 --aicli-entry 或 LLM_TOOLKIT_AICLI_ENTRY，默认四 runner 串行，结果绑定 suite fingerprint、模型身份、CLI 与沙箱。", "数据工厂、fast-middle 和 local quality 各有独立题目/检查器；正确性先于同分耗时比较。旧日期报告只是历史证据，不据此自动替换本地默认。"],
    flow: ["说明需要验证的能力", "选择最小有界案例", "在既有权限与 GPU 路线运行", "由独立检查器核对产物", "保存版本对应的结论"],
    concepts: [{ term: "独立检查器", explanation: "不让候选模型修改用于判分的程序。" }, { term: "版本绑定", explanation: "结果只适用于记录的任务与执行身份。" }],
    boundaries: ["370 项离线回归不是模型 benchmark 分数。", "本次没有新增云端或本地模型生成。"],
    failures: [{ condition: "受管 AICLI 入口缺失", response: "创建输出和调用模型前失败，避免空跑报告。" }],
    sources: [{ path: "src/llm_backend_toolkit/cli.py", role: "有界探测入口" }, { path: "scripts/run_general_agent_benchmark.py", role: "通用代理案例运行" }, { path: "benchmarks/general_agent_v1", role: "三个案例与检查器" }, { path: "docs/fast-middle-agent.md", role: "注明日期的专项历史" }],
    verification: ["本次 probe 和 benchmark 协议行为通过离线回归；历史模型成绩仅保留来源与适用范围。"],
    relation: "给注册表与调用者提供证据，不替代主 AI 的任务选择。",
    searchProjection: { intents: ["换模型后做一个小例子检查", "看看模型能不能按JSON回答", "模型评测为何必须记录CLI版本"], entities: ["probe", "instruction", "json", "context", "vision", "general_agent_v1", "verifier"], relations: ["结果绑定模型和执行环境"], failureRecovery: ["基础设施失败不算回答成绩", "缺入口不生成空跑分数"] }
  }
];

export const project = llmBackendToolkitProject;
export const modules = llmBackendToolkitModules;
