import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T18:23:11Z",
  label: "可零写入诊断、只读查看和精确取消；当前模型配置不冒充真实任务验收",
  boundary: "9月18日只读诊断确认0.9.2实际解释器、包来源、注册表与27B端点，没有联网、读任务材料、创建工作单或调用模型。四种本地模型均按当前目录说明；普通configured（已配置）可进入有界预检与调用，但不是端到端合格证，旧三类CLI路线仍待重验。",
  metrics: [
    { label: "默认调用", value: "本地 Qwen3.8 27B" },
    { label: "任务方式", value: "异步提交 · 按需取结果" },
    { label: "模型选择", value: "显式选择 · 不自动换道" },
    { label: "工作过程", value: "桌面只读观察台" }
  ],
  facts: [
    { label: "当前默认模型", value: "local-default当前为qwen3.8-27b:256k，基座qwen3.8:27b、Q4_K_M、262144上下文、32768输出，默认推理开启；配置digest为8040835723046ec2631b64b960d44414636ea5147942a7d68eaaa7ccdb492e20。9月18日diagnose读取的是目录与实际包来源，identity_verification=not_checked，不把配置摘要冒充运行时权重回读。" },
    { label: "任务和资料", value: "submit提交、invoke同步等待，均进入同一任务和输入生命周期；jobs分页列元数据，inspect按编号纯只读看状态和显式请求的结果。兼容job可能恢复或清理，cancel按确切运行句柄请求停止，不能把它们都叫只读查询。" },
    { label: "当前路由证据", value: "当前27B的data_factory/codex-cli以及普通35B、两种去限制版的Codex路线标为configured、live_verified=false、configuration_sync_no_e2e；允许按现有合同有界使用，但没有通用Live声明。Claude/Qwen Code/OpenCode的旧模型路线继续pending_reacceptance。历史成绩、AICLI桌面成功和注册表配置不能互相替代。" },
    { label: "离线验证", value: "9月7日370/370、99.642秒为原版本历史；AICLI Owner的9月17日联动归档记录隔离候选Unit442/442与Toolkit408/408、真实合成材料读写回读和取消清理。严格JSON任务带额外说明文字时正确返回partial而不缓存。这是具体调用链证据，本网页未重跑来源套件。" },
    { label: "源码身份", value: "PUBLIC wlyaaaaa/llm-backend-toolkit，main与远端回读e0d005182265f23ffb9286853b18649f3356cce1。实际.venv解释器与src/llm_backend_toolkit包为0.9.2；9月18日诊断规范化目录SHA-256为f573b017a2d16eb3e1d4a00fda51e41a919363e0621d809bdcf9ea044bfc16b6，zero_write=true，network_performed/model_invoked/materials_read/job_created均为false。" }
  ],
  gaps: [
    "35B当前模型为qwen3.6-35b:256k，Codex路线仅configured/unverified；8月21日旧qwen-main-v1的capture_exception失败仍是历史，不等于当前重新验收。旧README/专题段落未同步动态标签，当前模型与参数按注册表及诊断读取。",
    "Claude Code、Qwen Code、OpenCode的旧Agent路线仍pending_reacceptance；旧云端Qwen Agent不在可选目录。普通configured允许有界使用但不是模型能力保证，不能与这些明确待验收路线混同。",
    "cloud-qwen-flash、cloud-deepseek-v4-flash 的协议和错误分支使用 mock（替身响应）验证；fast-middle-agent 的 Spark 在 2026-07-29 冻结题上达到 81/80 步后硬停，只得 2/9，保留为显式候选而非自动推荐。本次未验证任何云端额度、凭据、模型输出或延迟。",
    "LocalAsyncWorker 是另一条受控本地工作单 API：start/wait/cancel/result 合同已实现，但初始 configured_unverified；没有完整运行绑定时保持 not_ready。它不是原生子代理，也不与普通 submit 的可用性混为一谈。",
    "本次未打开生产观察台运行一个新模型任务；源码测试和既有历史页面验收不能证明当前任务栏图标、整场真实多轮表现或所有设备状态。",
    "带声明的外部输入在非 Windows 系统缺少等价不可变路径绑定时会拒绝运行；没有强行扩成跨平台通用文件保护方案。"
  ]
});

export const llmBackendToolkitSnapshot = Object.freeze({
  ...baseSnapshot,
  generation: "异步额外模型工具 · 显式后端 · 可查阅结果",
  sourceCommit: "e0d005182265f23ffb9286853b18649f3356cce1",
  sourceRoot: "V:\\Personal\\Projects\\llm-backend-toolkit",
  runtimeFacts: {
    pythonTestsPassed: 408, pythonTestsFailed: 0,
    model: "qwen3.8-27b:256k", parentModel: "qwen3.8:27b",
    modelDigest: "8040835723046ec2631b64b960d44414636ea5147942a7d68eaaa7ccdb492e20",
    contextWindowTokens: 262144, ollamaVersion: "0.33.1",
    liveCallPerformed: false, defaultPolicy: "danger-full-access", watchdogTimeoutSeconds: 900,
    gpuBrokerEndpoint: "http://127.0.0.1:32100"
  },
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const llmBackendToolkitProject = {
  usageEntry: "在已接入 LLM Backend Toolkit 的主 AI 对话中交代一件具体模型工作：给什么材料、要什么结果、是否只在本机处理。提交后保存任务编号，之后可查进度；电脑上的观察台显示可公开的处理过程。",
  usageInputs: ["本次问题和要处理的文件", "本地、指定模型或已允许云端的边界", "期望输出及是否需要工具、图片或录音"],
  order: 25, slug: "llm-backend-toolkit", title: "LLM Backend Toolkit",
  kicker: "把一件可验收的小任务交给明确模型",
  route: "/projects/llm-backend-toolkit", visibility: "公开仓库",
  statusTone: "mixed", cardStatus: "支持零写入诊断与精确取消；配置和真实任务验收分开", cardStatusTone: "mixed",
  ...llmBackendToolkitSnapshot,
  summary: "主 AI 正在处理一件事，其中一部分适合交给另一个明确模型，例如整理长材料、检查分类结果或在指定目录尝试修代码。这个工具按当前登记路线调用本地或已授权的外部模型，保存输入、进度和结果；主 AI 可以继续其他工作，再独立判断取回结果是否可用。它不决定总目标，不冒充原生子代理，也不在失败时偷偷换模型。",
  why: "直接把所有材料塞进主对话会挤占上下文；另开一个模型窗口又容易忘记它用了什么资料、是否真的完成。这里保留明确的任务编号、输入依据、结果和失败原因，让额外模型承担一件可验收的事。它自己不决定总目标，也不会因为某个模型不可用就偷偷换一个。",
  plainExample: "帮我从这份几十页的公开技术说明中找出升级步骤和失败后的恢复办法，给我一张带原文位置的表。主 AI 选好资料和模型后提交任务，先继续做其他部分；稍后取回表格、引用行号、输入摘要和文件位置。模型失败会返回具体原因，主 AI 再决定修正请求、重试或亲自处理。",
  result: "得到短结果、可打开的完整本地文件和模型/输入/执行回执。只看状态可用纯只读入口，确需停止可通过命令请求精确取消，等进程树和GPU释放才算完成。桌面观察台仍只展示公开工作进度，不新增输入、停止或审批按钮，也不代替主AI验收。",
  repositoryNote: "公开仓库包含工具代码、协议、虚构样例和非敏感验收说明。真实任务、输入副本、结果、媒体、提示词和凭据留在各自本地或获准提供方，不进入本网站。明确允许云端时，所选内容会发送到该提供方，不能宣称所有调用都不出本机。",
  readerStates: {
    "pass": "所选模型按指定资料完成任务，交回回答或文件；主 AI 再核对它是否真的解决原问题。",
    "problem": "回答不符、文件已改变、额度不足或等待超时时，留下原因和已有结果，不自动改用另一模型。",
    "unavailable": "本地模型、登录凭据、显卡资源或获准云端服务缺失时，只说明这条路线暂不能做；配置存在本身不是完成证明。"
  },
  dataSources: {
    "title": "它实际读取什么，又把什么交回来",
    "intro": "输入来自本次明确提交的任务和文件，不会扫描整个电脑或偷听其他模型窗口。",
    "rows": [
      {
        "source": "本次请求与 UTF-8 文本文件",
        "data": "这次写明的目标、限制和选中的文本文件；需要核对时再看文件内容是否改变。",
        "result": "挑出相关段落并给出处；所选模型只接收这次任务需要的材料。"
      },
      {
        "source": "选中的图片或音频",
        "data": "一般图片、需要精确文字的扫描件，或指定录音。",
        "result": "按选择使用模型原生视觉、LocalOCR 或 ChineseASR；专项识别结果用于本次后续处理，原始私人内容不进入公开观察事件。"
      },
      {
        "source": "当前模型与编程工具设置",
        "data": "核对实际模型、服务地点、使用权限和可用证据。",
        "result": "判断能否走这条已经实现的路线；缺少条件时说清原因，不猜另一条可用。"
      },
      {
        "source": "本次后台工作的公开状态",
        "data": "只读取已产生的进度、答复、工具活动和用量信息。",
        "result": "任务编号可用于查看或精确取消；累计用量、当前进度和最终结果分别显示。"
      }
    ]
  },
  productPrinciples: [
    {
      "title": "主 AI 掌握目标和验收",
      "detail": "额外模型只做分配给它的工作。结果是待核对的材料，不因工具返回成功就自动成为最终结论。"
    },
    {
      "title": "一条路失败，不改送别处",
      "detail": "默认只选已登记的本地模型。其他模型须明确选择；若要把这次材料交给外部服务，还要得到本次允许外发的明确要求。"
    },
    {
      "title": "长结果留在文件里，聊天里给要点",
      "detail": "长材料先按问题选相关片段，长输出留成本地完整文件。答复说明哪些材料被省略或缩短，不把估算节省量说成真实账单。"
    },
    {
      "title": "没看到最终答复就说还没有",
      "detail": "观察台只展示真的收到的公开进度；程序还在、配置可用或只有草稿都不证明工作完成。"
    }
  ],
  operatingFlow: [
    {
      "title": "先核对模型和材料能否走这条路线",
      "detail": "系统根据本地或已允许云端的要求检查当前模型、文件来源和需要的工具，条件不符先说明。"
    },
    {
      "title": "提交并保持可追踪",
      "detail": "后台任务固定输入并给出任务号，主 AI 可以继续其他事。"
    },
    {
      "title": "查询或取消精确任务",
      "detail": "用任务号查看进度和结果；取消后还要核对执行与资源清理。"
    },
    {
      "title": "验收实际内容",
      "detail": "交回模型输出、产物和适用边界；配置存在、进程活着或草稿出现都不等于工作完成。"
    }
  ],
  technicalOperatingFlow: [
    { title: "划清这一件工作", detail: "主 AI 给出问题、输入、限制、期望结果，选择本地或已明确允许的云端路线。" },
    { title: "提交后继续其他事", detail: "submit 返回 job_id；需要同步等待的旧调用可用 invoke，两者进入同一套受管生命周期。" },
    { title: "固定本次输入并处理资料", detail: "worker（后台执行进程）捕获外部文件，校验声明，整理文本或调用专项媒体工具，再让所选模型处理。" },
    { title: "取回结果并核对", detail: "只看进展用inspect --id，取结果加--result；需要完整输出时用原有job --full-result并明确它可能维护状态。取消走cancel --id，必须等清理确认，不能把受理当作完成。" }
  ],
  usageExamples: [
    {
      "ask": "这件工作用哪个模型？失败时别替我换。",
      "effect": "先按这次材料和本地或云端限制选定明确模型；不能用就告知原因，不自动换成另一家。",
      "moduleSlug": "versioned-backend-registry-routing"
    },
    {
      "ask": "把这份资料交给本地模型，做好了我再来取。",
      "effect": "提交后保存任务编号，回来只读查进度，完成时取回答和文件；若取消还要确认执行与显卡确实停止。",
      "moduleSlug": "asynchronous-jobs-and-spool-integrity"
    },
    {
      "ask": "材料太长，只找和恢复步骤有关的段落；然后接着问一次。",
      "effect": "选取有行号的片段，保留指定文字；续问携带前轮任务编号、结果状态与短预览，不自动附带完整回执。",
      "moduleSlug": "context-sources-and-portable-continuation"
    },
    {
      "ask": "在这个目录里尝试修复代码，最后把测试结果交回来。",
      "effect": "用已登记的编程工具在指定目录实际改文件并跑检查，再交回修改和未通过的测试；一段文字答复不算完成。",
      "moduleSlug": "data-factory-agent-execution"
    },
    {
      "ask": "这份受控本地工作单能开始或取消了吗？",
      "effect": "先查目标模型、目录和工具是否已就绪；取消必须确认原进程已经停，不把“收到取消”当成结束。",
      "moduleSlug": "data-factory-agent-execution"
    },
    {
      "ask": "先识别这张扫描页的文字，再归纳要点。",
      "effect": "精确文字先交 LocalOCR，释放 GPU 后再调用模型。",
      "moduleSlug": "multimodal-pipeline-and-specialist-routing"
    },
    {
      "ask": "我想看看额外模型在做什么，有没有真的回答完。",
      "effect": "观察台显示公开进度、失败草稿和最终答复，缺失信息留空。",
      "moduleSlug": "read-only-model-observer-gui"
    },
    {
      "ask": "这个模型刚换过，先用一个小例子看看能不能按要求输出。",
      "effect": "选一件固定小题真正运行，并独立核对答案；结论只属于这次模型和测试，不自动改变默认。",
      "moduleSlug": "capability-probes-and-benchmarks"
    }
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
    { layer: "来源回归与具体联动任务", proves: "9月7日370项旧回归与9月17日Owner408项Toolkit隔离候选回归分别留证；具体合成材料读写与取消验证不扩张为全部模型通用能力。", doesNotProve: "没有新模型回答，不证明云端额度、外部服务所有状态或用户当前窗口。" },
    { layer: "9月18日零写入运行诊断", proves: "0.9.2实际解释器、包、规范化注册表、当前27B/32100配置和configured状态一致；没有联网或读取任务材料。", doesNotProve: "未检查运行时权重、启动模型、创建工作单或提供方回答；不能据此写成GPU空闲、当前任务已完成或全部路线Live通过。" },
    { layer: "注明日期的历史模型与页面验收", proves: "对应模型、CLI、工作单和结果曾通过；观察台已有真实事件/页面验收。", doesNotProve: "不能推广到新版本、35B 或未登记路线；历史搜索调用成功不等于上游返回了有效搜索结果。" }
  ],
  responsibilities: [
    "接收一件具体工作，保存本次材料、任务编号、结果和失败原因。",
    "在已有模型路线之间按明确限制选用，整理长材料并显示安全的公开进度。",
    "把需要编程工具、显卡、文字识别或录音转写的部分交给各自现有工具处理。"
  ],
  exclusions: [
    "它不替主 AI 决定长期目标或接受最终结果。",
    "模型失败不自动换另一家，也不把未获准的材料送到云端。",
    "不收集所有 Codex 或第三方聊天窗口的历史。",
    "私人材料、隐藏推理、识别正文和密钥不发布到网站。"
  ],
  operationalEntrypoints: [
    { name: "列出模型路线", command: "llm-backend-toolkit backends", purpose: "读取注册表元数据，不生成回答。" },
    { name: "零写入检查有效入口", command: "llm-backend-toolkit diagnose --backend local-default", purpose: "只读配置、包与接口事实，不联网、不读任务材料、不创建任务或生成回答；status另用于后端的有界现场状态。" },
    { name: "提交任务", command: "llm-backend-toolkit submit --request request.json", purpose: "立即返回编号；--force 明确创建新尝试。" },
    { name: "取回结果", command: "llm-backend-toolkit inspect --id <job_id> --result", purpose: "显式纯只读查看本次结果；jobs --limit 50支持返回游标分页，cancel --id请求停止。旧job --full-result仍支持完整输出，但job不是纯只读维护入口。" },
    { name: "打开观察台", command: "pwsh -NoProfile -File scripts/Start-LlmBackendObserver.ps1", purpose: "打开已有只读本机窗口；正式 Skill 在提交前确保观察入口可用。" },
    { name: "移除观察台入口", command: "pwsh -NoProfile -File scripts/Install-LlmBackendObserverShortcut.ps1 -Remove", purpose: "仅删除能证明属于本项目的桌面和开始菜单快捷方式。" }
  ],
  evolution: [
  {
    "date": "2026-07",
    "title": "额外模型的结果可以追溯",
    "commit": "",
    "result": "从直接调用发展为有编号的任务，保留输入、结果文件与失败原因；主任务仍负责最终采用。"
  },
  {
    "date": "2026-08",
    "title": "长任务能观察和接续",
    "commit": "",
    "result": "只读观察台显示真实进度，材料和后续提问有明确来源；界面不接管审批、输入或停止业务。"
  },
  {
    "date": "2026-09-18",
    "title": "看状态不再顺手改变任务",
    "commit": "e0d0051",
    "result": "零调用诊断、纯只读任务查询和精确取消分开；缓存只收完整且身份对应的成功结果，任务受理、执行结束和资源释放分别核对。"
  }
],
  glossary: [
    { term: "Backend（后端）", meaning: "实际接收请求的模型及其提供接口。" },
    { term: "JobStore（任务存储）", meaning: "保存每次工作状态、结果和事件的本地目录管理层。" },
    { term: "Spool（本次输入副本）", meaning: "实际调用前固定下来的文件副本，生命周期结束后清理。" },
    { term: "Portable continuation（可携带续问）", meaning: "携带前轮编号、结果状态与短预览，形成有限次的新请求，不自动附带回执或依赖厂商隐藏会话。" },
    { term: "Current evidence（身份仍匹配的证据）", meaning: "已有回执与本次检查的模型身份对应，不表示今天又运行了该任务。" }
  ],
  searchAliases: ["LLM Backend Toolkit", "额外模型", "本地模型任务", "异步模型调用", "模型调用观察台"],
  searchProjection: { intents: ["把一件明确工作交给本地模型后稍后取回", "从长材料里提取信息并继续追问", "查看额外模型公开工作过程"], entities: ["JobStore", "local-default", "Qwen3.8 27B", "LocalOCR", "ChineseASR"], relations: ["主AI分配任务，Toolkit调用模型，主AI验收结果"], failureRecovery: ["模型失败不自动换道", "输入变化拒绝消费", "终态清理输入副本"] },
  "readerBoundary": "只把范围明确且结果可独立验收的任务交出去。已配置、预检正常、真实调用和结果可用分别证明；读取状态不重新提交，取消受理不等于已停止。",
  "operatingChoices": {"title":"这件工作交给哪个已登记模型","intro":"先决定材料留在本机还是明确发给外部服务，再选择模型。下面说明入口分工，不替代当前任务的效果验收，也不是更大就更好的排名。","rows":[{"need":"先在本机处理材料、图片或一项明确任务","choice":"Qwen3.8 27B；当前默认本地模型。","result":"给出该任务的回答或文件，主AI再核对原材料与验收条件。","boundary":"本地配置允许先预检再有界使用；本轮没有重新验证模型权重或真实任务效果。"},{"need":"拿另一套本地结果做对照","choice":"Qwen3.6 35B；明确选择的交叉检查模型。","result":"独立回答同一问题，帮助发现分歧；不是自动替换27B。","boundary":"不会自动兜底；与27B相同的结论也不能当作正确性证明。"},{"need":"明确选用已登记的修改版模型","choice":"Qwen3.8 27B 去限制版、Qwen3.6 35B 去限制版。","result":"使用所选版本自身的回答行为，不把它悄悄换回普通版。","boundary":"两个版本都需明确选择；35B修改版不支持视觉，名字不代表质量更好或任何任务都适合。"},{"need":"明确允许把这一份材料交给云端","choice":"Qwen3.7 Flash 或 DeepSeek Flash；直接调用路线。","result":"在获准的外部服务取得回答，返回准确模型与结果。","boundary":"两条路线都没有因此获得工具型Agent验收；本地失败不自动上传，不凭配置存在声称额度或调用成功。"},{"need":"考虑额外的官方编码模型候选","choice":"GPT-5.3 Codex Spark；保留的显式候选。","result":"可以先查看其历史证据与当前接入条件，再决定是否另做有界验证。","boundary":"旧任务曾达到步数上限而未完成，不作为默认推荐；本轮未做新的云端调用。"}]},
};

export const llmBackendToolkitModules = [
  {
    id: "versioned-backend-registry-routing", slug: "versioned-backend-registry-routing", order: 1,
    usageEntry: "在已接入 Toolkit 的主 AI 对话中说明要用本地还是明确允许的云端模型，并说清结果用途。",
    usageInputs: ["问题与材料", "模型或数据去向限制", "是否需要工具调用"],
    productFlow: [
      {
        "title": "核对所选模型的真实去向",
        "detail": "系统查当前模型登记及本地服务状态，确认文件不会被送到未获准的云端。"
      },
      {
        "title": "区分聊天和实际做事",
        "detail": "系统分开核对这个模型能回答文字、能否在现有编程工具里使用文件与工具。"
      },
      {
        "title": "按真实入口处理",
        "detail": "交回实际模型身份与结果；本地不可用时报告原因，不自动换云或把历史通过当当前可用。"
      }
    ],
    title: "模型选择、配置与证据", shortTitle: "模型与路线", route: "/projects/llm-backend-toolkit/versioned-backend-registry-routing",
    teaser: "明确用谁、数据去哪里，失败后由调用者决定", kicker: "选择模型", status: "当前四模型目录与零写入诊断闭合；Live单列", statusTone: "pass",
    value: "把模型名字、提供方和执行路线写清，防止换了模型却沿用旧结论。",
    why: "同一个模型简称可能指向不同版本或服务；能回答一段话也不代表能在编程任务里实际使用工具。这里先查真实模型、数据去向和本次能力。",
    example: "我说：“让本地模型看这份说明，文件别发云端。”系统只试已选本地路线；本机不可用就告知原因，不悄悄交给外部服务。",
    result: "知道这次会用哪个具体模型、材料会留在本机还是出机、它目前能做哪些工作；真正回答或文件结果仍要等实际任务完成。",
    problem: "配置错误、模型身份变化或路线缺验收时，拒绝该路线，其他独立路线按自己的事实判断。",
    readerStates: {
      "pass": "模型身份和本次要求一致时按这条路线执行，完成后交回真实结果。",
      "problem": "模型版本换了或旧验证不适用时只标这一条需重查。",
      "unavailable": "模型未登记、缺登录或云端未获准时先停，不自动改换。"
    },
    decisionImpact: ["默认只解析注册表 default_backend，本地 direct 不等于已验收 Agent。", "云端请求必须额外带 privacy.cloud_allowed=true；失败不自动 fallback。", "35B 是显式交叉验证，不进入默认或兜底选择。"],
    implementation: [
      "default_backends.json 使用 llm-backend-toolkit.backends.v1；LLM_TOOLKIT_BACKEND_REGISTRY 可指定机器注册表。alias、backend、adapter、model、route、runner 和 AICLI Profile 分开。",
      "local-default/current hard-reasoning使用qwen3.8-27b:256k；后者是要求reasoning.mode=on的隐藏兼容入口。27B参数temperature=1、top_p=.95、top_k=20、min_p=0、presence_penalty=0、repeat_penalty=1、num_ctx=262144、num_predict=32768。",
      "请求alias qwen-main-v1仍指向27B local-default；显式local-crosscheck-35b/qwen-crosscheck-35b选择qwen3.6-35b:256k。35B temperature=1、presence_penalty=1.5，其余top_p=.95/top_k20/min_p0/repeat1/262144/32768；不能从旧README中的qwen-main-v1模型标签和.6参数恢复当前事实。",
      "fast-middle-agent固定codex-spark-xhigh/gpt-5.3-codex-spark/xhigh，7月29日旧冻结题81/80步硬停、2/9仍是历史。cloud-qwen-flash使用qwen3.7-flash；cloud-deepseek-v4-flash保留兼容backend ID，但当前模型是deepseek-flash、支持图像，两者没有已激活Agent路线，不自动回退。",
      "云端openai-chat只用HTTPS和调用进程环境中的密钥引用；privacy.cloud_allowed必须是真正布尔true，先于读取材料检查。拒绝重定向，凭据不改投；本地传输不继承HTTP代理或任意远程端点覆盖。requested、reported、independently verified模型分开，缺报告为null；无法精确匹配的direct答案不作成功缓存。",
      "显式local-qwen3-6-35b-abliterated与local-qwen3-8-27b-abliterated分别使用同名:256k模型，均非fallback，前者无视觉、后者有视觉；35B参数同普通35B，27B参数同普通27B。相应Codex Profile和配置摘要由当前backends给出，configured/unverified不意味着重新获得Live证明。",
    ],
    flow: ["解析请求和 alias", "读注册表与本地/云端边界", "Agent 路线匹配精确证据", "调用指定 adapter 或返回具体错误"],
    concepts: [{ term: "没有 fallback", explanation: "调用失败不自动换供应商、模型或数据去向。" }, { term: "精确证据", explanation: "一次历史成功只属于对应模型、Profile、CLI 和验证任务。" }],
    boundaries: ["四模型的Codex配置允许按合同预检和有界使用，但不声明通用Live；三个旧CLI路线仍待重验。35B是显式交叉选择，不参与默认或fallback。", "云端 mock、凭据存在和真实模型回答各自独立。"],
    failures: [{ condition: "billing_unavailable、限流或 GPU 占用", response: "返回选项，调用方决定重试或接管。" }, { condition: "backend / Agent 证据不匹配", response: "在调用前拒绝，不借其他模型回执。" }],
    sources: [{ path: "src/llm_backend_toolkit/default_backends.json", role: "可选择模型及证据" }, { path: "src/llm_backend_toolkit/backends.py", role: "解析与校验" }, { path: "docs/local-crosscheck-35b.md", role: "35B 的失败与边界" }],
    verification: ["9月18日18:23:11Z diagnose读取当前0.9.2与目录配置，network_performed=false、model_invoked=false；没有把8月或9月7日的元数据读数晋升为今天的运行时权重证明。", "注册表与提供方测试包含完整 370 项回归。"],
    relation: "后续所有文本、媒体和 Agent 任务共用这次明确选择。",
    searchProjection: { intents: ["本地模型不可用时别改投云端", "35B交叉验证是否能使用工具"], entities: ["local-default", "local-hard-reasoning", "local-crosscheck-35b", "fast-middle-agent", "cloud-qwen-flash", "cloud-deepseek-v4-flash"], relations: ["注册表绑定模型与路线验收"], failureRecovery: ["模型身份变化使旧回执失效", "欠费不自动降级"] },
    readerStatus: "当前模型目录和只读检查已核对；具体模型任务仍需实际运行，不因登记存在就宣布可完成。"
  },
  {
    id: "asynchronous-jobs-and-spool-integrity", slug: "asynchronous-jobs-and-spool-integrity", order: 2,
    usageEntry: "在已接入 Toolkit 的 AI 对话中提交明确工作，保留返回的 job_id；随后用同一任务号查状态。",
    usageInputs: ["固定的文件与问题", "期望产物", "要等待还是后台处理"],
    productFlow: [
      { title: "提交一件任务", detail: "工具为本次输入与执行建立任务号，并固定外部文件内容。" },
      { title: "回来查或精确取消", detail: "只看进度时读状态；需要结果时点名任务号，取消后核对进程和资源是否真的停。" },
      { title: "收取可信结果", detail: "交回输出和清理状态；输入后来改变、执行中断或清理未确认时不复用旧结果或盲重跑。" },
    ],
    title: "异步任务、输入与结果保存", shortTitle: "任务与输入", route: "/projects/llm-backend-toolkit/asynchronous-jobs-and-spool-integrity",
    teaser: "可以交出去、只读看进展，也能准确要求停止", kicker: "任务生命周期", status: "离线回归通过", statusTone: "pass",
    value: "保存任务编号、当次输入、进展和结果，让主AI不必一直等待；回来看状态不会顺手改掉任务，改变主意则用确切运行身份请求停止。",
    why: "提交以后原文件可能被修改，旧结果也可能误当成新结果；执行进程若已死，还需要明确结束并清掉当次临时输入。",
    example: "我把一份公开说明交给模型后先做另一件事；回来只看进展，不想触发清理。需要中止时明确说“停止这一个任务”，工具发出请求并检查进程和显卡释放；未确认时会如实显示仍待清理，不让我误以为可以安全重跑。",
    result: "拿到任务编号、当前进度、最终回答和完整文件位置。提出取消后还会分别确认程序是否停下、显卡是否释放；没确认就说仍待清理。",
    problem: "超期任务会停止建议轮询；只有确认 worker 已死亡才回收，不能因为一段时间没输出就误清活任务。",
    readerStates: {
      "pass": "任务使用的是提交时固定的材料，结果文件完整、清理也已确认。",
      "problem": "原文件后来变了或任务中断时留出原因，不拿旧回答套新材料。",
      "unavailable": "无法证明进程已结束或材料与任务对应时停下后续执行，不贸然清理或重试。"
    },
    decisionImpact: ["submit 异步返回；invoke 也走受管任务，只是调用方等待结果。", "要求结构化结果时，工具会指出空答复、JSON 格式错误或缺少指定字段；检查通过仍不证明内容正确，主 AI 继续验收。", "未提供文件声明的旧请求仍可捕获执行，但标为未验证，不当成缓存命中依据。", "明确需要重跑时 submit --force，不把旧结果包装成一次新执行。"],
    implementation: [
      "JobStore保存请求、lease（执行记录）、状态、事件和完整结果。新jobs/inspect不创建目录、不变更计数、不恢复死worker、不清输入，也不启动观察台；列表只含有界元数据，结果需显式请求，损坏单条不会掩盖其他记录。兼容get/job/cleanup_inputs才可能确认死亡并维护状态。",
      "expected_sha256 与 expected_bytes 必须成对。流式复制时检查原件读取期间变化、摘要、长度和副本回读；Windows 从创建副本起持有 FILE_SHARE_READ 句柄，贯穿实际消费，并验证 canonical containment（规范路径包含关系）。",
      "缺声明的引用继续标记captured_unverified/spooled_unverified；带声明却缺平台等价不可变绑定时拒绝。终态清理本次spool与prepared request并留回执；活动取消先保留精确AICLI运行句柄，清理未证时不得销毁恢复所需依据。",
      "无外部引用的相同请求默认复用成功结果；workspace / source / media 默认不缓存。execution.cache_key 仅由调用方提供真实内容与派生版本身份，仍绑定已解析 backend、model、route/profile、privacy、reasoning、媒体和输出协议。",
      "v2 只公开 caller_cache_key_hash，使用 stdlib-json-sort-compact-utf8-v1 规范化；v1 历史仍能按 ID 查询，但不成为新缓存证明。失败和取消不命中。长结果只回短预览与 hash，--full-result 可取完整输出。",
      "Toolkit._check_output 核对 nonempty_output；请求 JSON 时继续核对 valid_json 与 required_keys。返回这些确定性检查，不证明答案事实正确、内容完整或代码符合用户目标，仍需调用者验收。",
      "recommended_check_utc和monitor_until_utc给出建议时机，兼容job仍可维护轮询计数；所有计数更新在同一任务锁下重读，不能把较旧状态覆盖成已终止任务。纯只读jobs/inspect不变更这些计数。stale不自动换模型，也不要求永久等待。",
      "cancel --id使用模型执行前已经写入的不可变aicli.run-control.v1，固定同一已验证AICLI入口和确切run id发送一次run abort。accepted只表示请求送达；完整进程树清理与GPU会话释放后才终止。模型身份产生前的取消保留not_observed_cancelled/null模型，清理通过不等于模型验收通过；旧runner/direct调用继续协作到真实结束，不另建守护服务。",
    ],
    flow: ["建立任务编号", "认领执行并固定输入", "完成模型/专项处理", "保存结果与回执", "结束后保存清理证据并取回结果；中途取消必须另核对准确执行已经停止。"],
    concepts: [{ term: "输入声明", explanation: "我明确指定文件的摘要与字节数，工具在真正消费前核对。" }, { term: "结果缓存", explanation: "只在真实内容和模型等条件相同且允许复用时，返回既有成功结果。" }],
    boundaries: ["本地任务材料不进入 PUBLIC Git 或网站。", "文件锁和校验不代表整个工作区属于该 worker 独占。"],
    failures: [{ condition: "输入摘要、长度或路径不对应", response: "在 provider 消费和发布结果缓存前失败。" }, { condition: "worker 死亡", response: "确认进程身份后结束任务，清掉私有输入并留下清理记录。" }],
    sources: [{ path: "src/llm_backend_toolkit/jobs.py", role: "任务和缓存" }, { path: "src/llm_backend_toolkit/input_integrity.py", role: "输入校验" }, { path: "src/llm_backend_toolkit/input_lifecycle.py", role: "占用与清理" }],
    verification: ["370 项回归包含输入变动、并发打开、缓存边界、活 worker 保全与终态清理。"],
    relation: "文本、媒体、direct 和 Agent 共用同一结果生命周期。",
    searchProjection: { intents: ["任务交出去以后怎样取回结果", "如何避免模型用了变化后的文件", "结束任务后清理输入副本"], entities: ["JobStore", "input-spool", "expected_sha256", "expected_bytes", "cache_key", "stale"], relations: ["声明绑定当次输入，缓存绑定内容与路线"], failureRecovery: ["活worker不误清", "失败结果不复用", "force创建新尝试"] },
    readerStatus: "已有保存任务、进度、结果及取消记录的机制，并通过离线测试；实际运行完全停止仍需进程与资源证据。"
  },
  {
    id: "context-sources-and-portable-continuation", slug: "context-sources-and-portable-continuation", order: 3,
    usageEntry: "在已接入 Toolkit 的主 AI 对话中给出长材料和具体问题，必要时用同一有界工作继续追问。",
    usageInputs: ["选定的长文档或文本", "必须保留的限制与出处", "后续追问内容"],
    productFlow: [
      {
        "title": "挑出与目标相关的原文",
        "detail": "系统定位长文里对应步骤与限制，保留出处，并标明有没有因长度省略内容。"
      },
      {
        "title": "整理相关片段",
        "detail": "系统保留可追溯片段，并明示是否因长度做了有损选择。"
      },
      {
        "title": "取回并追问",
        "detail": "给出短结果与出处；确需第二轮时带上上一轮标识，完整原文或无限记忆不会自动随行。"
      }
    ],
    title: "长材料整理与有限续问", shortTitle: "材料与续问", route: "/projects/llm-backend-toolkit/context-sources-and-portable-continuation",
    teaser: "先找有关段落，再带着短结果接着问", kicker: "少搬运，保留依据", status: "源码及离线回归通过", statusTone: "pass",
    value: "在工具内部整理长输入，回传可核对的小结果，必要时继续问几轮。",
    why: "把全文和整场聊天往返搬运很容易占满主对话；过度缩短又可能丢掉限制。工具保留指定文字，并明确说出有没有有损处理。",
    example: "这份技术文档只需要恢复步骤和对应限制；第一轮列出处，第二轮把顺序整理成清单。工具先选相关片段，再把前轮编号、结果状态和短预览带入第二轮。需要完整出处或回执时，调用者要另外明确提供。",
    result: "得到带原文位置的简明回答；继续追问有明确上一轮起点。若长材料被缩短，答复会说哪些内容没纳入，不假装模型读了整份。",
    problem: "估算的 token 是输入整理尺度；不是计费量，也不是 Codex 实测上下文。没有选中的资料，模型不能被当成读过全文。",
    readerStates: {
      "pass": "关键限制和引用位置保留下来，答案能回原文核对。",
      "problem": "材料太长而不得不省略时明确说出，再决定缩小范围或补材料。",
      "unavailable": "选中文件不是可读文本或追问已超出这项工作范围时停下，不猜原文。"
    },
    decisionImpact: ["context.pinned 保存不能被压掉的要求。", "PDF/Office 先用相应读取器；这里的 source 接口不是万能文档解析器。", "continuation 默认最多 3 轮、硬上限 8 轮，只自动带前轮编号、结果状态和预览；需要原文与回执须另外提供。"],
    implementation: ["context.py 进行确定性整理，区分中日韩与 ASCII token 估算，按 target_tokens 收敛并报告前后估算、duplicates_removed 与 lossy。", "sources.py 根据目标分块、打分，使用 top_k / max_chars 选择 UTF-8 段落，返回源摘要和行号；引用的字节完整性仍由输入生命周期负责。", "continuation.from_job_id 指定已经完成的前轮，max_turns 约束链长。_prepare_continuation 追加 previous_result，只有 job_id、result_status、output_preview；不会自动附加完整 receipt。delegation_receipt / delivery_receipt 仍作为每次任务的独立结果回执保存。"],
    flow: ["给出目标和固定要求", "读取已捕获文件并选择相关片段", "按预算整理后调用模型", "返回短结果和出处", "确有必要时显式续问"],
    concepts: [{ term: "有损整理", explanation: "部分输入被省略，必须告诉调用者，不能声称完整读过全文。" }, { term: "可携带续问", explanation: "用显式结果衔接新请求，而不是依赖某家 API 看不见的会话。" }],
    boundaries: ["不提供无限会话或长期隐式记忆。", "估算节省量不等于 Codex 账单节省量。"],
    failures: [{ condition: "来源读取或格式失败", response: "返回明确错误，改由对应读取器处理后再提供文本。" }, { condition: "续问轮数超限", response: "停止，由主 AI 决定是否形成新的有界任务。" }],
    sources: [{ path: "src/llm_backend_toolkit/context.py", role: "确定性整理" }, { path: "src/llm_backend_toolkit/sources.py", role: "文本片段与出处" }, { path: "src/llm_backend_toolkit/jobs.py", role: "续问链与交付回执" }],
    verification: ["9月7日370项旧回归包含context、sources和续问；当前诊断不重跑模型任务，仍明确有损整理与已读片段边界。"],
    relation: "位于输入固定之后、模型调用之前；续问则使用前轮已完成结果。",
    searchProjection: { intents: ["材料太长只读相关段落", "模型回答后再继续问一次", "保留不能删除的要求"], entities: ["context.pinned", "target_tokens", "top_k", "max_chars", "continuation", "max_turns"], relations: ["文本片段携带行号，续问携带短结果"], failureRecovery: ["有损整理明确披露", "格式不支持不猜原文", "超过轮数停止"] },
    readerStatus: "已有整理长材料和有限续问的实现及离线测试；输入被压缩时会说明损失，模型答案质量仍需主任务检查。"
  },
  {
    id: "data-factory-agent-execution", slug: "data-factory-agent-execution", order: 4,
    usageEntry: "在已接入 Toolkit 的主 AI 对话中指定受控练习或项目工作区，提出明确的修复或数据处理任务。",
    usageInputs: ["具体工作区与目标", "允许的工具、时间和权限", "可执行的验收方式"],
    productFlow: [
      {
        "title": "核对工作区和执行能力",
        "detail": "系统确认目标目录、现有编程工具和本次允许的权限；没有真实工具能力就不把聊天回答算任务完成。"
      },
      {
        "title": "由已验证 CLI 处理",
        "detail": "选定路线在指定目录实际使用工具、修改产物并运行可用检查。"
      },
      {
        "title": "核对真实结果",
        "detail": "交回修改、测试与未完成项；当前路线没有精确证据或清理未确认时不宣称智能体任务完成。"
      }
    ],
    title: "有工具的智能体执行", shortTitle: "智能体执行", route: "/projects/llm-backend-toolkit/data-factory-agent-execution",
    teaser: "让指定模型在明确目录中做事，再检查产物", kicker: "AICLI 执行路线", status: "当前精确配置允许有界使用；模型Live与受控工作单另验", statusTone: "pass",
    value: "让已经接入的 AI 编程工具在点名的目录里真正读写文件、运行命令并交回测试结果，而不把一段文字回答当成工程完成。",
    why: "能返回一段文字和能做完一个有工具的任务是两种能力；后者必须同时检查模型、执行路线、工具活动、产物和清理。",
    example: "我说：“在这个练习项目里修好区间合并函数，运行已有测试，并告诉我改了什么。”只有已核验能用工具的编程路线才会真正改文件和跑检查。",
    result: "拿到实际修改的文件、测试结果与仍失败的地方；主 AI 再核对功能是否符合原任务。只有文字答复或旧成功记录不足以证明这次编程工作完成。",
    problem: "超时、协议字段不完整或旧模型证据不能对应当前配置时，会失败而非降到普通聊天或其他 CLI。",
    readerStates: {
      "pass": "指定编程工具在对应工作区完成任务、产物和清理都能核对。",
      "problem": "文件有修改但测试或清理没结束时明确只完成了一部分。",
      "unavailable": "路线、模型或工作区条件不齐时在启动前停下，不冒称已做过工具任务。"
    },
    decisionImpact: ["按runner_capabilities选择真实权限：Codex程序化入口为danger-full-access，其他CLI使用其声明的workspace-write或read-only；权限宽度不扩大用户授权。", "普通 Agent 默认 watchdog_only、900 秒，不加默认步数/工具次数上限；bounded 才接受显式硬上限。", "completion_driven 的旧输入仍识别，但当前 AICLI 未声明可续期 idle lease 时提前拒绝，不静默改模式。", "LocalAsyncWorker 只使用隔离 workspace-write 根，提供 start / wait / cancel / result；它不是原生子代理，不继承最高权限或再次委派。", "如果受控工作单没有完整的运行身份证明，就返回 configured_unverified / not_ready。取消必须确认进程树结束且 GPU 租约释放，否则保持 cleanup_unconfirmed，不能伪造 CANCELLED。"],
    implementation: ["agent_runners.py通过调用者的LLM_TOOLKIT_AICLI_ENTRY固定受管入口；preflight用真实参数解析器与能力声明核对请求，不创建任务或读材料。可显式比较另一个安装入口，但比较不允许fallback。", "data_factory/codex-cli当前绑定codex-ollama-main与qwen3.8-27b:256k。configured允许按当前接口预检后有界运行，但没有自动继承旧0.3.12/2026-08-14模型Live；worker-contract仍是另一条非原生工作单证明合同。", "受管 Codex 可通过 AICLI 的 public_web_search 使用真实搜索工具；观察台只消费安全 lifecycle，搜索工具调用不等于获得有效结果。", "数据工厂与通用基准使用独立、不可写入候选工作区的 verifier；CLI 完成、产物通过、稳定性与压力测试分别记录。", "LocalAsyncWorker.start 强制 fresh_execution=true / force=true，禁止 cache key。接受 legacy local-default→data_factory→codex-cli，或运行时精确解析的非云 benchmark_only backend；后者网络禁止、搜索关闭、固定 7200 秒 watchdog，均无 fallback。", "受控工作单的 requested binding 涵盖模型/配置/digest、AICLI 与事件协议、工具来源、独占 GPU 租约、沙箱、任务/工作区、检查器和预算。初始 configured_unverified；只有运行期同时提供上下文与保留输出等 observed binding 才可 eligible_after_runtime_proof。result 只读终态，缺字段返回 local_worker_binding_incomplete。", "wait 是建议时机后的一次有界查询，不是循环监视。cancel 依赖宿主注入的 controlled_bridge，须返回 process_tree.confirmed_absent 和 gpu_lease.released；请求本身不能注入取消命令。当前合同和取消桥不等于通用生产适配已就绪。"],
    flow: ["选择已有 Agent route", "绑定工作区、权限与时间预算", "由原生 CLI 完成工具活动", "核验结果、运行身份与清理"],
    concepts: [{ term: "Harness（执行环境）", explanation: "为模型提供原生工具、权限和会话运行方式的 CLI 环境。" }, { term: "权限不等于目标", explanation: "能写目录外文件并不允许自行扩大用户交给它的任务。" }],
    boundaries: ["当前可选择路线依注册表和精确证据判断，不按 CLI 安装清单猜可用。", "历史成功不证明新版本兼容。"],
    failures: [{ condition: "AICLI 入口不存在或 receipt 不符", response: "调用前关闭该路线。" }, { condition: "预算或原生协议失败", response: "返回具体状态和已有产物，不升格为已完成。" }],
    sources: [{ path: "src/llm_backend_toolkit/agent_runners.py", role: "已有 CLI 的窄适配" }, { path: "docs/agent-data-factory.md", role: "数据工厂任务" }, { path: "docs/aicli-agent-acceptance-contract.md", role: "精确验收" }, { path: "docs/local-async-worker-contract.md", role: "工作单" }],
    verification: ["9月17日Owner联动归档记录真实合成文件读写回读、正常结束和取消清理；这不把当前注册表configured写成通用模型能力通过，也不证明LocalAsyncWorker全部绑定。"],
    relation: "调用身份由注册表拥有，结果进入同一 JobStore 和观察台。",
    searchProjection: { intents: ["让本地模型修代码并运行测试", "智能体默认能写哪些目录", "任务超时该怎么办"], entities: ["AICLI", "data_factory", "codex-cli", "watchdog_only", "danger-full-access", "worker_contract"], relations: ["Profile模型验证对应产物"], failureRecovery: ["旧入口不自动回落", "超时不冒充完成"] },
    readerStatus: "当前登记允许在明确范围使用有工具的模型任务；真实模型效果与独立受控工作单仍各自验收。"
  },
  {
    id: "multimodal-pipeline-and-specialist-routing", slug: "multimodal-pipeline-and-specialist-routing", order: 5,
    usageEntry: "在已接入 Toolkit 的主 AI 对话中交给指定图片、扫描件或录音，并说清是解释内容还是精确提取。",
    usageInputs: ["明确的媒体文件", "精度和本地处理要求", "希望得到文字、转写或归纳"],
    productFlow: [
      {
        "title": "根据需要的准确程度选路线",
        "detail": "系统区分“解释照片”“读准扫描表格”和“转写录音”，把文件交给真正能处理那类材料的入口。"
      },
      {
        "title": "先调用合适专项",
        "detail": "精确文字交 LocalOCR，中文录音交 ChineseASR，场景理解才选原生视觉；重型显卡工作按实际资格协调。"
      },
      {
        "title": "再整理结果",
        "detail": "交回专项原结果和模型归纳，保留识别不确定性；适配器存在不证明任意私人材料准确。"
      }
    ],
    title: "图片、文字识别与录音", shortTitle: "媒体处理", route: "/projects/llm-backend-toolkit/multimodal-pipeline-and-specialist-routing",
    teaser: "一般看图、精确读字、听录音各走合适的已有工具", kicker: "专项媒体路线", status: "适配行为回归通过", statusTone: "pass",
    value: "将选中的图片或录音转成这次任务需要的内容，再交所选模型使用。",
    why: "看懂一张图和精确读出表格不是同一件事；同时启动 OCR 与大模型还可能争用一张显卡。这里明确分工并串行释放资源。",
    example: "这是一张扫描表格，数字必须准确。先交 LocalOCR 读字，再由模型归纳；如果只是解释照片内容，可选择原生视觉。指定录音则交 ChineseASR 转写。",
    result: "照片解释、扫描表格的文字或录音转写各拿自己的原结果，再由模型整理本次答案。数字和人名若识别不确定，会连同来源和疑点一起交回。",
    problem: "专项失败或模型不支持该输入时返回原因，不把文件路径当成模型已经看过文件。",
    readerStates: {
      "pass": "选中的图片或录音得到对应专项结果，随后用于本次任务。",
      "problem": "识别不清时标出具体字段和需要回原件核对的地方，不猜关键数字。",
      "unavailable": "所需识别入口、视觉能力或显卡暂不可用时停这一阶段，不偷换另一种处理方式。"
    },
    decisionImpact: ["native 走模型视觉，specialist 走专项工具；auto 对一般图优先视觉，对精确文字/表格/公式优先 OCR，音频走 ASR。", "OCR 使用 -StopAfter，ASR 结束释放 Broker 租约，再进入本地模型阶段。", "云端媒体与识别后文本同样需要明确允许传输。"],
    implementation: ["media.py 通过 LLM_TOOLKIT_LOCALOCR_ENTRY / LLM_TOOLKIT_CHINESEASR_ENTRY 调用既有 owner 工具，模型只连接 Broker 127.0.0.1:32100，不绕过它直连内部 Ollama。", "视觉能力由当前所选backend一路传给provider、预检和媒体处理；实际runner支持附件才传原生图像，不支持则明确拒绝。Profile写着images=true或模型会看图，都不能替代当前machine接口是否接受附件的事实。", "专项 owner 拥有原始识别数据与状态；Toolkit 记录本次工作阶段，观察事件不包含原始媒体、识别正文或凭据。不能把这一公开事件限制写成整个产品绝不保存本地结果。"],
    flow: ["明确媒体与精度要求", "选择原生或专项路线", "专项结束释放 GPU", "交给指定后端", "返回媒体与结果依据"],
    concepts: [{ term: "专项识别", explanation: "由 LocalOCR / ChineseASR 完成文字或语音任务，而非让一般模型猜测。" }],
    boundaries: ["本次未处理私人扫描件或录音，也未做新的 GPU 实机识别。", "适配测试不证明任意输入的识别准确率。"],
    failures: [{ condition: "工具或 GPU 不可用", response: "返回该阶段错误，不并发抢占或绕开 Broker。" }],
    sources: [{ path: "src/llm_backend_toolkit/media.py", role: "媒体选择和专项适配" }, { path: "tests/test_media.py", role: "适配行为" }],
    verification: ["媒体路由与串行调用的离线回归通过；专项本身的当前实机能力由各自项目说明。"],
    relation: "与文本一样受输入校验、云端边界和任务生命周期约束。",
    searchProjection: { intents: ["先识别扫描页再总结", "录音转写后整理要点", "OCR和模型不要同时占显卡"], entities: ["LocalOCR", "ChineseASR", "LocalGpuBroker", "native", "specialist", "auto"], relations: ["专项结束释放GPU后调用模型"], failureRecovery: ["路径不等于原生视觉", "识别失败不猜测"] },
    readerStatus: "图片和录音的专项处理接入已有测试；这份输入能否准确识别，仍以对应工具的实际结果判断。"
  },
  {
    id: "read-only-model-observer-gui", slug: "read-only-model-observer-gui", order: 6,
    usageEntry: "在电脑上打开项目已有的“模型调用观察台”，选择刚提交的 Toolkit 任务查看公开进度。",
    usageInputs: ["任务号或正在处理的工作", "希望看过程还是最终答复"],
    productFlow: [
      { title: "打开对应任务", detail: "观察台展示本次受管工作的状态与可公开活动。" },
      { title: "看进展和最终答复", detail: "消息与活动按时间展示；只有草稿、没有完成事件时明确标为尚无最终答复。" },
      { title: "回到主任务验收", detail: "主 AI 取回实际结果和产物；窗口看到进程或文字变化不证明调用方已收货。" },
    ],
    title: "只读模型调用观察台", shortTitle: "调用观察台", route: "/projects/llm-backend-toolkit/read-only-model-observer-gui",
    teaser: "看见公开进度、最终答复与证据，不接管任务", kicker: "桌面观察窗口", status: "当前源码回归与历史页面证据", statusTone: "pass",
    value: "把受管模型任务聚在一处，方便看进展、看结果和分清失败前草稿。",
    why: "后台任务常有静默阶段，看到一个进程不代表工作在推进；而把所有技术事件摊开又很难阅读。观察台把安全的真实消息与活动按时间交错呈现。",
    example: "我想知道刚交给模型的任务有没有新进展。观察台显示可公开的步骤和最后答复；若只有草稿、尚无正式答复，就直接说还没完成。",
    result: "电脑上有一个只读窗口，可按任务看进度、公开活动和最终回答。它不提供额外输入、停止或批准按钮；完成与否还要由主任务核对产物。",
    problem: "没有上游实测数据就显示等待或不可用；失败草稿不能充当最终答案。",
    readerStates: {
      "pass": "任务真实公开了进度和最终答复，窗口按同一任务展示。",
      "problem": "断线后从原任务补取可用状态，旧历史不会被新调用挤掉。",
      "unavailable": "窗口或受管入口无法加载时显示本机故障，不静默启动一个无法观察的新调用。"
    },
    decisionImpact: ["只观察 invoke / submit / probe 或显式安全导入，不扫描其他 Codex / AICLI 的全局聊天。", "公开 commentary（工作说明）和 reasoning.summary.delta（公开推理摘要）可显示；隐藏思考正文不进入事件。", "累计 token、当前上下文、Toolkit 输入整理和 Codex 原生压缩是不同指标。"],
    implementation: ["WinForms / WebView2 宿主使用独立 profile，导航成功后显示窗口；启动器去重，后台进程无控制台。CurrentUser 桌面与开始菜单快捷方式只升级/删除能证明属于本工具的链接。", "SSE 发送刷新信号，同源 API 读取详情；断线后有界查询，活任务耗时每秒更新并低频复核，终态冻结。历史分页与完整主对话投影分开，不用最近 160 条原始事件裁掉主对话。", "公开草稿上限 20000 字，超过明确提示；output.completed 用完整有界输出对齐草稿，普通 JSON 不因字段名为 preview 就丢失其他内容。", "当前上下文只认同一 runtime 通知内的 last.totalTokens 和 modelContextWindow 配对；累计 token 取 total。Ollama 输出速度用 eval_duration，AICLI 用执行墙钟估算，标签区分。", "工作区默认只记录数量且归因标为并发观察未证；明确列出 observability.file_changes.include 才显示有界文本 diff。完整本机路径由独立观察元数据在 loopback 端合成，不进入公共事件/结果。", "快捷方式两个 Known Folder（系统标准目录）不是原子事务；中途出现冲突会停止且保留已完成的本工具操作，处理冲突后幂等重跑。"],
    flow: ["打开或激活既有窗口", "接收受管任务", "交错显示公开进度和活动", "对齐最终答复与折叠回执", "记录调用方是否取回结果"],
    concepts: [{ term: "公开进度", explanation: "上游明确可展示的消息，不能据此推导隐藏思考。" }, { term: "实测上下文", explanation: "同一通知中的已用量与上限，不能拿模型配置来补。" }],
    boundaries: ["正式交互为电脑端最小 1120px 三栏，不维护手机观察台。", "任务栏图标的属性写入不证明 Explorer 最终渲染。"],
    failures: [{ condition: "未收到最终输出或上下文配对", response: "分别显示缺失；上游协议要求不满足时返回明确错误。" }, { condition: "WebView 初始化或导航失败", response: "写有界本机诊断并关闭，不用占位页冒充成功。" }],
    sources: [{ path: "docs/model-observer.md", role: "产品和历史验收" }, { path: "src/llm_backend_toolkit/observer.py", role: "安全结果投影" }, { path: "src/llm_backend_toolkit/observer_ui/app.js", role: "阅读界面" }, { path: "scripts/Start-LlmBackendObserver.ps1", role: "桌面入口" }],
    verification: ["9月7日observer、UI与Windows无窗口启动的370项历史回归按原日期保留；9月18日未打开生产观察台跑新任务。", "2026-08-13 历史实测覆盖真实公开活动与页面；当次搜索上游不可用，不声称取得有效搜索结果。"],
    relation: "观察台只消费工作事实，模型、GPU 和专项任务仍归原入口。",
    searchProjection: { intents: ["查看额外模型工作过程", "区分草稿和最终回答", "模型上下文实际用了多少"], entities: ["WinForms", "WebView2", "SSE", "output.completed", "tokenUsage.total", "modelContextWindow"], relations: ["只读观察受管任务，不捕获全局聊天"], failureRecovery: ["没最终输出就明确缺失", "断线有界查询", "图标元数据不作视觉验收"] },
    readerStatus: "已有只读观察窗口与历史页面证据；只显示实际收到的公开进展，不替任务做输入、停止或审批。"
  },
  {
    id: "capability-probes-and-benchmarks", slug: "capability-probes-and-benchmarks", order: 7,
    usageEntry: "在已接入 Toolkit 的主 AI 对话中明确说要验证哪项模型能力、使用哪个有界案例，并接受相应本地或云端调用。",
    usageInputs: ["待验证模型与具体能力", "固定案例和检查标准", "可用额度或本地资源"],
    productFlow: [
      {
        "title": "按目的挑一件小测试",
        "detail": "系统只选能回答本次疑问的固定案例，例如按指定格式输出或完成一项小工具任务。"
      },
      {
        "title": "运行受控案例",
        "detail": "按既有权限和模型路线产生真实输出，由独立检查器核对。"
      },
      {
        "title": "保留有日期结论",
        "detail": "交回这一版本、这一案例的结果和失败点；旧源码测试数量不能冒充模型能力分数。"
      }
    ],
    title: "能力探测与可复现基准", shortTitle: "探测与验证", route: "/projects/llm-backend-toolkit/capability-probes-and-benchmarks",
    teaser: "用一件可检查的事验证能力，避免只看模型名字", kicker: "结果验证", status: "工具已实现；本次未重跑模型基准", statusTone: "unknown",
    value: "模型换过后先用一件有固定检查方法的小任务试用，知道这一版在这件事上做到了什么；结果不自动变成永久排名。",
    why: "模型会变，CLI 也会变；过去能运行某个任务不能成为永久能力保证。验证需要明确输入、独立检查器和对应运行身份。",
    example: "刚换了模型，先给它一个有固定答案的小任务，检查是否能按 JSON 输出。若需要评估工程任务，再运行选定的代码修复或数据工厂案例。",
    result: "得到这个模型在这一次固定小题或文件任务上的实际结果与检查结论；它不会因此变成永久最优模型，也不自动改默认选择。",
    problem: "基础设施失败和任务回答失败分开；没有有效入口时不生成貌似有分数的空跑报告。",
    readerStates: {
      "pass": "任务产物和独立检查都对得上时，说明这一版本、这一案例通过。",
      "problem": "答案看起来对但工具过程失败时，两种结果分开。",
      "unavailable": "模型路线、资源或云端许可不足时不发起测试。"
    },
    decisionImpact: ["probe 可选 instruction / json / context / vision，异步返回任务编号，不是每次调用的强制前置。", "general_agent_v1 包含证据推理、代码修复和约束工作流规划，比较的是模型加执行环境。", "只有需要新证据才运行；本网页刷新不制造昂贵模型任务。"],
    implementation: ["probe --backend <id> --case <case>；vision 需附件，云端还需 --cloud-allowed。支持 --force 明确新尝试。", "run_general_agent_benchmark.py --list 可只列案例；真实运行要求 --aicli-entry 或 LLM_TOOLKIT_AICLI_ENTRY，默认四 runner 串行，结果绑定 suite fingerprint、模型身份、CLI 与沙箱。", "数据工厂、fast-middle 和 local quality 各有独立题目/检查器；正确性先于同分耗时比较。旧日期报告只是历史证据，不据此自动替换本地默认。"],
    flow: ["说明需要验证的能力", "选择最小有界案例", "在既有权限与 GPU 路线运行", "由独立检查器核对产物", "保存版本对应的结论"],
    concepts: [{ term: "独立检查器", explanation: "不让候选模型修改用于判分的程序。" }, { term: "版本绑定", explanation: "结果只适用于记录的任务与执行身份。" }],
    boundaries: ["370项历史和408项后续来源回归都不是模型benchmark（能力评测）分数。", "本次没有新增云端或本地模型生成。"],
    failures: [{ condition: "受管 AICLI 入口缺失", response: "创建输出和调用模型前失败，避免空跑报告。" }],
    sources: [{ path: "src/llm_backend_toolkit/cli.py", role: "有界探测入口" }, { path: "scripts/run_general_agent_benchmark.py", role: "通用代理案例运行" }, { path: "benchmarks/general_agent_v1", role: "三个案例与检查器" }, { path: "docs/fast-middle-agent.md", role: "注明日期的专项历史" }],
    verification: ["probe和benchmark协议的历史离线检查保留对应日期；本轮没有发起新基准或云端调用，也不因为配置同步改变模型排名。"],
    relation: "给注册表与调用者提供证据，不替代主 AI 的任务选择。",
    searchProjection: { intents: ["换模型后做一个小例子检查", "看看模型能不能按JSON回答", "模型评测为何必须记录CLI版本"], entities: ["probe", "instruction", "json", "context", "vision", "general_agent_v1", "verifier"], relations: ["结果绑定模型和执行环境"], failureRecovery: ["基础设施失败不算回答成绩", "缺入口不生成空跑分数"] },
    readerStatus: "已有选定能力的小型检查工具；本轮未运行模型评测，没有新的能力、费用或排名结论。"
  }
];

export const project = llmBackendToolkitProject;
export const modules = llmBackendToolkitModules;
