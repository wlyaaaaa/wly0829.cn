import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可直接使用", "需要确认", "当前不可用"];

const wechatHistoryAiBridgeSnapshot = createProjectSnapshot({
  observedAt: "2026-09-08T02:52:27.5131823Z",
  label: "本机两个 WeFlow 健康入口均有响应；接口契约与快照测试 31 项通过",
  boundary: "本轮只检查服务健康、安装版本与虚构样例，未验证真实聊天读取、账号匹配或完整历史。",
  metrics: [
    { label: "WeFlow 版本", value: "26.7.3.0" },
    { label: "服务健康入口", value: "5031 / 16000 · HTTP 200" },
    { label: "源项目测试", value: "31 / 31 通过" },
    { label: "历史读取", value: "增量分页 · 保留回复关系" }
  ],
  facts: [
    { label: "源代码版本", value: "PUBLIC master=7510c29ae3a95b36363b4d6ba2d1c47c4e602f85，已从远端 master 回读；之前的源码为 e075ce4627b9ea53899a8b9d214021cd2eccf6f4。此次修正让本地 CI 和 GitHub Actions 共用完整测试入口，纳入原先遗漏的 5 项快照测试。", hero: false },
    { label: "安装与服务", value: "WeFlow.exe 的 ProductVersion 为 26.7.3.0。2026-09-08T02:37:25.8272891Z 只读检查 127.0.0.1:5031/health 与 127.0.0.1:16000/health，均返回 HTTP 200；没有读取业务接口。", hero: false },
    { label: "兼容基线", value: "接口契约以 WeFlow 26.7.3 / 26.7.3.0、2026-07-09 的实测为基线；OpenAPI 3.1.0、AI Consumer Contract v2。v0.1.0 是原有发布标记，不代表后续所有提交都重新打过版本。", hero: false },
    { label: "自动化验证", value: "当前本地 CI 实际执行 26 项项目契约测试和 5 项私有快照测试，共 31 项通过。虚构快照测试故意失败时 CI 返回 1，且未继续执行公开边界检查。", hero: false },
    { label: "已有任务", value: "WeFlow Watchdog 与 WeChat AutoStart 均为 Ready（等待触发）、最近结果 0，采用 wscript 静默包装；WeChat AutoStart 保留 PCConfig 双开负责人标记。没有在本轮重新注册、启动或修改任务。", hero: false },
    { label: "当前微信入口的区别", value: "此项目保留 WeFlow HTTP 适配与运维能力。现役 wechat-direct Skill 使用独立的 WeChatDirect，明确不调用 WeFlow；旧规程中列出的调用插件或下游示例，不等于当前默认微信读取路线。", hero: false },
    { label: "公开检查的实际范围", value: "本机 CI 的已跟踪路径、文本检查和 PowerShell 解析通过，因缺少 pdftotext 跳过 3 份既有 PDF 文本。相同提交的 GitHub Actions 34180971929 已完成全部 31 项测试及 PDF 文本检查，结果 success（成功）；检查仍不覆盖全部 Git 历史。", hero: false }
  ],
  gaps: [
    "真实消息、联系人、群成员、朋友圈和媒体未在本轮读取；健康入口有响应不证明目标账号、完整历史或全部业务端点正常。",
    "OpenAPI 的 AI 允许标记是调用约定，不是本仓库实现的 HTTP 拦截器；JSON Schema 也需要消费者实际执行验证。",
    "看门狗的 TCP 回退只能证明端口可连接。目标进程存在但端口不通时，它记录问题并退出，不会强杀或反复重启。",
    "快照工具只核验指定文件集当时的字节，不导出、解密、复制或锁定源文件；普通 JSON 回读收据没有数字签名，也不是不可篡改存储。",
    "本轮没有重新进行登录、冷启动、黑框观察或真实快照恢复；当前任务状态与隔离测试各自说明，不能互相替代。"
  ]
});

const wechatHistoryAiBridgeProject = {
  order: 27,
  slug: "wechat-history-ai-bridge",
  title: "WeChat History AI Bridge",
  kicker: "把本机 WeFlow 接口交给 AI 正确使用",
  route: "/projects/wechat-history-ai-bridge",
  visibility: "公开仓库",
  statusTone: "accent",
  cardStatus: "服务健康入口有响应；契约与快照测试通过",
  cardStatusTone: "accent",
  ...wechatHistoryAiBridgeSnapshot,
  searchAliases: ["WeChat History AI Bridge", "WeFlowBridge", "微信聊天记录 AI 本地桥", "WeFlow 接口", "微信 API 契约", "WeFlow 看门狗", "第27项目"],
  searchProjection: {
    intents: ["WeFlow 本地微信接口怎样交给 AI 使用", "微信群历史消息怎样增量读取并保留回复关系", "WeFlow 开机启动与后台黑框怎么处理", "不打印聊天文字怎样检查 WeFlow 接口", "已经导出的微信文件怎样检查是否完整"],
    entities: ["WeFlow 26.7.3", "AI Consumer Contract v2", "ChatLab Pull", "sync.nextSince", "sync.nextOffset", "sync.watermark", "docs/openapi.yaml", "probe-weflow.ps1", "weflow_heartbeat.ps1", "tools/build_private_snapshot_manifest.py"],
    relations: ["WeFlow 负责微信数据读取与 HTTP 服务，本项目负责适配说明、契约、自检和启动脚本", "ChatLab Pull 的分页位置与水印需要一起保留", "WeChatDirect 是独立的当前微信读取路线，不通过本项目"]
  },
  summary: "让 AI 使用本机 WeFlow 提供的微信接口时，知道该查哪个账号、怎么取最新或历史消息、怎样保留回复关系，以及读不到时该怎样说明。它还提供服务自检、登录后启动和文件完整性检查；微信数据的读取与解密由 WeFlow 本体完成。",
  why: "让 AI 总结一段微信群讨论，真正容易出错的地方是读错账号、漏掉最新消息、把引用当成当前发言，或者把一次空返回理解成“从来没聊过”。这个项目把这些取数规则写成可查、可验证的接口约定，并提供检查服务和恢复启动的脚本，让调用者能交代自己究竟读到了什么。",
  plainExample: "“用 WeFlow 看一下这个群昨天下午的讨论，告诉我最后怎么决定的。”调用者先确认当前账号库和目标群，再按时间范围分页读取，保留谁回复谁以及有关媒体的线索。成功时能交付有时间范围、消息数量和缺口说明的结果；账号不对、消息时间对不上或重试后仍为空时，先说明实际缺口，不能编出一份完整总结。",
  result: "实际交付包括一份 WeFlow 接口地图、一套 AI 取数与返回格式约定、可运行的自检和 Windows 启动脚本，以及检查已取得文件集的工具。它不内置总结模型，也不把聊天记录自动发给 AI；用哪个模型、是否传出本机、保留哪些私有资料，仍由具体调用方按当前任务决定。",
  readerStates: {
    quick: "先理解它怎样帮助 AI 读对微信记录，以及服务有响应和真实聊天读取之间的区别。",
    product: "查看账号判断、最新与历史消息、联系人和群成员、朋友圈入口、静默启动、文件完整性检查的实际用法。",
    technical: "核对接口参数、数据结构、脚本入口、版本、当前证据、失败处理与恢复边界。"
  },
  productPrinciples: [
    { title: "先读对，再总结", detail: "账号、会话、时间窗口和最新消息是否一致，会直接改变结论。信息不足就保留缺口，不把空响应或转发内容当成目标会话的完整历史。" },
    { title: "接口说明与执行能力分清", detail: "WeFlow 提供数据，消费方负责请求和分析，本项目提供约定与检查。OpenAPI 标记不会自动关闭服务端接口，Schema 文件也不会自动替消费者验证结果。" },
    { title: "日常检查尽量不打扰桌面", detail: "已有任务通过 VBS 静默调用脚本。目标进程缺失时才尝试启动一次；目标已运行却不健康时先留下诊断结果，避免反复开出冲突实例。" },
    { title: "只保存各自真正需要的结果", detail: "公开仓库保存代码与不含私人正文的示例；实际任务可以在获准的私有位置使用所需内容。公开元数据格式不等于所有私人工作都只能保留数字，也不授权建立全账号归档或后台分析。" },
    { title: "完整性检查不冒充完整备份", detail: "两遍读取相同文件的结果，可以帮助发现漏文件或变化；它不能替代导出端的完成状态、账号覆盖检查、数据库恢复或长期不可变保存。" }
  ],
  components: [
    { name: "WeFlow / 微信客户端", responsibility: "实际数据来源", implementation: "微信维护本地数据库，WeFlow 负责访问、解密与 HTTP 服务。本仓库没有实现另一套解密器或微信数据库。" },
    { name: "docs/openapi.yaml", responsibility: "接口地图", implementation: "描述会话、联系人、消息、群成员、朋友圈、健康和推送端点；标出推荐读取项及不默认给 AI 调用的操作。" },
    { name: "docs/ai_consumer_contract.md 与 schemas", responsibility: "取数语义和结果格式", implementation: "定义账号判断、最新自检、历史分页、回复引用、媒体清单、时区和失败说明；公开元数据示例由 JSON Schema 验证。" },
    { name: "probe-weflow.ps1", responsibility: "本地接口自检", implementation: "读取本地配置后记录端点是否成功、返回形状与数量；MetadataOnly 跳过消息正文端点，但仍请求会话、联系人、群成员和朋友圈统计。" },
    { name: "weflow_heartbeat.ps1 / weflow_heartbeat.vbs / weflow_boot_guardian.ps1", responsibility: "有界健康检查和登录启动", implementation: "按指定 profile 匹配进程，缺失才启动一次；VBS 隐藏脚本窗口，注册器保留 PCConfig 已管理的微信双开任务。" },
    { name: "tools/build_private_snapshot_manifest.py", responsibility: "已取得文件集的字节核验", implementation: "生成文件清单、两遍 SHA-256 回读及普通 JSON 收据；只引用外部源文件，不复制原件。" },
    { name: "tools/test-ci-local.ps1", responsibility: "一致的本地和 CI 检查入口", implementation: "发现 tests/test_*.py 的全部测试，再执行已有公开边界检查；GitHub Actions 复用同一入口，避免漏跑快照测试或重复跑同一子集。" }
  ],
  technicalContracts: [
    { artifact: "接口定义", schema: "OpenAPI 3.1.0", owner: "docs/openapi.yaml", boundary: "以 WeFlow 26.7.3 为基线；自定义 AI 标记是文档约定，服务端仍由 WeFlow 实现。" },
    { artifact: "AI 消费格式", schema: "ai-consumer-envelope.v2", owner: "schemas/ai-consumer-envelope.v2.schema.json", boundary: "JSON Schema Draft 2020-12；公开持久结果使用脱敏会话标记与无路径媒体清单，私人运行中的正文另按任务边界处理。" },
    { artifact: "项目清单", schema: "weflowbridge.project_manifest.v1", owner: "project_manifest.json", boundary: "记录版本、职责、入口和消费交接要求；清单中的历史消费者名称不证明当前正在运行。" },
    { artifact: "自检输出", schema: "weflow-probe.v1", owner: "probe-weflow.ps1", boundary: "ok 由五个必需端点的成功状态决定；shape、count、sync_present 是观察字段，不是完整业务 Schema 一致性的证明。" },
    { artifact: "文件清单与回读", schema: "weflowbridge.private-snapshot-manifest.v1 / weflowbridge.private-snapshot-readback-receipt.v1", owner: "tools/build_private_snapshot_manifest.py", boundary: "payload_mode=external_read_only_reference；证明指定时刻的文件字节回读，不提供导出、数字签名或不可变存储。" }
  ],
  evidenceLayers: [
    { layer: "31 项源码测试", proves: "26 项项目契约与 5 项快照测试实际通过；探测失败分支使用接口替身，快照用临时虚构文件。", doesNotProve: "不能证明真实微信读取、完整历史、真实恢复或每个异常分支都已端到端验证。" },
    { layer: "本机版本与无鉴权健康入口", proves: "安装版本为 26.7.3.0，5031 与 16000 的 /health 返回 HTTP 200。", doesNotProve: "未检查 token、当前账号、聊天正文、联系人、朋友圈或具体数据接口的可用性。" },
    { layer: "任务状态回读", proves: "两项已命名任务为 Ready、最近结果 0，微信自启仍保留 PCConfig 双开标记。", doesNotProve: "没有重新进行登录、断电、冷启动或桌面黑框观察；不把某个次实例任务名未找到说成全部自启不存在。" },
    { layer: "本地 CI 与公开边界检查", proves: "本地入口执行全部 31 项，虚构快照失败能中止 CI；同提交 GitHub Actions 34180971929 也通过，并补齐本机跳过的 PDF 文本检查。", doesNotProve: "脚本没有遍历全部 Git 历史，也没有证明未来提交不会出现问题；远端 CI 不验证用户机器上的真实微信业务数据。" },
    { layer: "文件两遍回读", proves: "虚构文件成功生成 2 个文件的清单与回读结果；既有目标、空源、源目标嵌套和仓库内输出被拒绝。", doesNotProve: "不证明内容能解密、原始导出完成或证据具有不可篡改性质；源文件在验收之后仍可能变化。" }
  ],
  operationalEntrypoints: [
    { name: "只看服务是否响应", command: "GET http://127.0.0.1:5031/health", purpose: "无需 token。只检查服务健康，不进入会话或联系人读取。" },
    { name: "元数据自检", command: "powershell -NoProfile -ExecutionPolicy Bypass -File probe-weflow.ps1 -Json -Mode MetadataOnly -NoMessages", purpose: "需要本地 .env 与有效数据接口凭据；会请求会话、联系人等业务接口，只输出汇总形状，不调用消息正文端点。" },
    { name: "全部测试与已有公开检查", command: "powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-ci-local.ps1", purpose: "执行 tests/test_*.py 的全部 31 项和现有公开边界检查；任何跳过项必须单独阅读。" },
    { name: "只运行虚构样例测试", command: "python -m unittest discover -s tests -p \"test_*.py\"", purpose: "在不调用真实业务接口的情况下验证契约、探测失败行为和外部临时文件核验。" },
    { name: "注册默认启动任务", command: "powershell -NoProfile -ExecutionPolicy Bypass -File weflow_boot_guardian.ps1", purpose: "管理员操作，会注册计划任务。用于明确需要安装自启时，本轮没有执行。" },
    { name: "检查一个既有独立配置", command: "powershell -NoProfile -ExecutionPolicy Bypass -File weflow_heartbeat.ps1 -Port <port> -UserDataDir <existing-profile> -InstanceName <name> -LogPath <log-file> -NoProxyServer -HiddenLaunch", purpose: "可能启动指定 WeFlow 实例；目录、登录态和 API 设置须由该配置先准备好。参数示例不是本轮运行命令。" },
    { name: "核验已经取得的文件", command: "python tools/build_private_snapshot_manifest.py --source-root <private-source> --destination <new-private-output> --source-instance-id <account-instance>", purpose: "生成检查结果；不执行导出、解密或复制。输出须在本仓库之外，且不与源目录相互包含。" }
  ],
  glossary: [
    { term: "WeFlowBridge", meaning: "本项目工程兼容名，即 WeChat History AI Bridge；提供 WeFlow 接口适配契约、自检与启动脚本。" },
    { term: "ChatLab Pull（按页拉取）", meaning: "WeFlow 的结构化会话与历史消息读取方式；响应同时带会话、成员、消息和增量位置。" },
    { term: "Watermark（游标水印）", meaning: "响应携带的同步标记，需要和 nextSince、nextOffset 等分页信息一起保留；不能把它当成接口未定义的 watermark 请求参数。" },
    { term: "media_manifest（媒体清单）", meaning: "公开元数据只描述媒体类型、数量、时间、大小和发送者角色，不存放媒体内容或本机路径。" },
    { term: "Boot Guardian（开机守卫）", meaning: "注册登录触发和定期检查任务的脚本；WeFlow 和微信仍需要已登录的交互桌面。" },
    { term: "MetadataOnly（纯元数据探测）", meaning: "跳过消息正文端点，但不等于不访问业务数据，也不等于免凭据。" }
  ],
  operatingFlow: [
    { title: "按任务选择读取路线", detail: "明确需要 WeFlow HTTP 适配时使用本项目。当前日常微信 Skill 走 WeChatDirect，不为本页将默认路线切回 WeFlow。" },
    { title: "确认来源和可读范围", detail: "调用方检查服务、当前账号库和目标会话，按用户问题选择联系人、群成员、朋友圈或指定消息范围；版本变化后重新核对接口行为。" },
    { title: "读取并保留上下文", detail: "最新消息检查最后时间，历史按 since/end/offset 续页，记录 hasMore、nextSince、nextOffset、watermark；引用和媒体线索与消息一起理解。" },
    { title: "给出结果与缺口", detail: "分析由具体 AI 完成；结果说明来源、范围、消息数与不确定性。公开元数据采用契约格式，私人正文仍留在获准的任务环境。" },
    { title: "运行异常时按证据恢复", detail: "脚本区分配置缺失、接口失败和进程缺失；看门狗不会反复启动已存在的目标实例。文件核验失败则保留未完成状态，不能冒充备份成功。" }
  ],
  responsibilities: ["说明 WeFlow 的真实接口、版本与读取方式。", "维护账号判断、增量分页、引用和媒体线索的消费契约。", "提供可验证的公开元数据格式和虚构示例。", "提供本地自检、静默启动及多配置有界检查。", "核验已取得的账号级文件集并输出字节清单。"],
  exclusions: ["本仓库不实现微信数据库解密或另一套聊天数据库。", "不内置总结模型，不自动发消息、删除朋友圈或同步到云端。", "不在公开仓库保存真实聊天、联系人、媒体、数据库或可复用凭据。", "不以旧下游示例恢复已经退役的中央个人系统。", "不把 WeFlow 健康响应当成 WeChatDirect 的验收结果。"],
  failures: [
    { condition: "服务端口无响应", response: "区分 API 设置、目标进程和配置目录。进程缺失时看门狗只启动一次；已存在时记录异常，不循环重启。" },
    { condition: "数据接口返回 401", response: "由调用方检查本地配置与凭据是否有效；/health 成功不代表数据接口已经通过鉴权。" },
    { condition: "目标账号不匹配或单次消息为空", response: "仅说明当前库和窗口下的结果，保留重试次数与时间一致性；不要断言目标会话不存在。" },
    { condition: "文件核验失败", response: "源文件不改动，最终输出不冒充成功；检查明确报错与 .incomplete 目录，再决定重新取得稳定源或使用新的输出目录。" }
  ],
  usageExamples: [
    { ask: "用 WeFlow 看一下这个群昨天下午怎么决定的。", effect: "先确定账号和群，再按时间分页，保留回复关系；返回讨论结果及读取范围，有缺口就明说。", moduleSlug: "ai-consumer-contract-and-metadata-envelope" },
    { ask: "WeFlow 能查联系人、群成员和朋友圈吗？分别从哪里读？", effect: "给出对应接口、输入与返回数据，说明读取和写操作的区别，以及哪些能力需要调用方额外处理。", moduleSlug: "public-safe-openapi-and-endpoint-governance" },
    { ask: "登录后帮我把 WeFlow 启动起来，后台检查别再闪黑框。", effect: "既有启动脚本提供静默任务和目标配置检查；碰到已运行却异常的实例会留下日志，不反复启动。", moduleSlug: "boot-guardian-and-multi-profile-watchdog" },
    { ask: "接口是不是坏了？检查结果别把聊天文字打印出来。", effect: "只看服务可先查 /health；需要业务自检时使用元数据模式，返回端点成功状态、形状和计数，失败明确退出。", moduleSlug: "metadata-first-probe-and-boundary-verification" },
    { ask: "这批已经取得的文件有没有在检查中变动，给我一份清单。", effect: "按指定文件集计算哈希并完整回读，成功给清单与收据；发现不一致则返回失败，不宣称完成备份。", moduleSlug: "private-snapshot-integrity-and-consumer-handoff" }
  ],
  evolution: [
    { date: "2026-07-09", result: "形成以 WeFlow 26.7.3 为基线的 AI 消费契约、OpenAPI、公开元数据 Schema 和自检入口。" },
    { date: "2026-08-05—2026-08-06", result: "补齐多配置静默启动与有界等待；新增外部私有文件集两遍回读工具及输出边界。" },
    { date: "2026-08-30", result: "自检把必需端点失败落实为失败退出，避免只要健康端点有响应就报告总体成功。" }
  ],
  sources: [
    { path: "README.md / AGENTS.md / project_manifest.json", role: "项目职责、版本、实际入口及机器清单。" },
    { path: "docs/ai_consumer_contract.md / docs/openapi.yaml", role: "账号、消息、联系人、群成员、朋友圈和消费规则。" },
    { path: "schemas/ai-consumer-envelope.v2.schema.json / schemas/project-manifest.v1.schema.json", role: "公开元数据与项目清单格式。" },
    { path: "WATCHDOG.md / weflow_heartbeat.ps1 / weflow_heartbeat.vbs / weflow_boot_guardian.ps1", role: "运行条件、静默包装、按配置匹配和有界恢复。" },
    { path: "probe-weflow.ps1 / tools/test-ci-local.ps1 / tools/test-public-boundary.ps1", role: "实际探测、退出语义及检查范围。" },
    { path: "tools/build_private_snapshot_manifest.py / tests/test_private_snapshot_manifest.py", role: "外部文件集核验和虚构文件测试。" }
  ],
  snapshotUpdateNote: "本页分别记录源码、虚构测试、安装与无正文健康观察。它没有执行真实聊天读取、任务安装或完整快照恢复，也不把测试通过包装成这些实机流程已经完成。"
};

const wechatHistoryAiBridgeModules = [
  {
    id: "ai-consumer-contract-and-metadata-envelope", slug: "ai-consumer-contract-and-metadata-envelope", order: 1,
    title: "AI 消费契约与消息上下文", shortTitle: "AI 消费契约", kicker: "读对账号、时间和回复关系，再形成结论",
    value: "把“找哪段微信记录”拆成能核对的读取步骤：确认当前账号库，选择最新或历史窗口，保留回复关系和媒体线索，并把读取范围与缺口交给 AI。",
    status: "契约与虚构示例已验证", statusTone: "accent",
    why: "同一句总结，在读错账号或漏掉一条后续回复时就可能完全相反。契约要求先核对来源和完整程度，让读取失败不会被误写成事实。",
    example: "“看一下这个群昨天最后怎么定的，别漏掉后面的回复。”调用方查明账号与会话后逐页读取，追踪谁在回答谁；若最新时间对不上、账号不符或重试仍为空，结果中直接说明。",
    result: "AI 获得带来源、时间范围和上下文关系的材料；公开保存时另生成不含正文的元数据结果。总结本身由消费方完成，这个仓库没有内置分析模型。",
    teaser: "最新消息自检、历史续页、回复引用和媒体清单各自保留。",
    problem: "一次成功响应只证明取得了这一批数据，不能证明账号正确、历史完整或媒体齐全。",
    readerStates: { pass: "目标账号与会话匹配，所选窗口已按分页信息读取，结果保留消息数量、来源和引用。", problem: "最新时间不一致或单次为空时记录重试和缺口，必要时调整读取范围。", unavailable: "账号不能确认或目标不在当前库时，只能说明当前来源读不到，不能代替用户切换身份或编造内容。" }, stateLabels,
    decisionImpact: ["最新查询用无日期 limit=100，与 sessions.lastTimestamp 比较，避免日期参数造成错误遗漏。", "历史查询使用 since/end/offset；保存 hasMore、nextSince、nextOffset 与 watermark，不能只记一个水印就宣称分页完整。", "回复、引用和有关媒体可能改变含义，不能只取纯文本摘要。", "公开元数据格式和私人运行中的正文是不同产物，不把格式文件说成自动脱敏器。"],
    concepts: [
      { term: "ChatLab Pull（按页拉取）", explanation: "GET /api/v1/sessions/{id}/messages 返回 chatlab、meta、members、messages、sync；适合指定窗口的历史或增量读取。" },
      { term: "Watermark（游标水印）", explanation: "保存 sync.watermark 作为同步观察；续页位置使用接口规定的 nextSince 与 nextOffset，不把 watermark 虚构为请求参数。" },
      { term: "media_manifest（媒体清单）", explanation: "公开元数据包含 kind、count，可带 timestamp、size、sender_role；原图、语音、视频和本机路径不放入这个公开格式。" },
      { term: "AI Consumer Envelope（AI 消费结果封套）", explanation: "把本次取数范围、来源判断和完整性信息放在结构化结果中，方便消费方核验。" }
    ],
    implementation: ["docs/ai_consumer_contract.md 定义账号判断、消息策略、UTC 时间、失败和交接语义。", "JSON Schema Draft 2020-12 定义 18 个属性、17 个必需属性，禁止未知顶层属性；talker 采用公开占位格式，message_content_included 固定 false。", "time_window 可为 latest 或 since/end/offset 对象；endpoint_family 覆盖 messages、chatlab_pull、sessions、contacts、group_members、sns、health。", "可选 reply_metadata 记录 platformMessageId、replyToMessageId、quote_present 与 quote_message_id；引用正文不写入公开示例。"],
    flow: ["通过 sessions、必要的 contacts 与目标会话查询判断当前库；证据不足保留 unknown（未知）。", "最新消息走 GET /api/v1/messages?talker=<id>&limit=100，不带 start/end；按 createTime 降序理解，索引 0 为最新并核对会话最后时间。", "历史先 GET /api/v1/sessions?format=chatlab，再按 since/end/limit/offset 请求会话消息，并保留整个 sync 分页信息。", "需要旧格式、关键词或媒体导出参数时才选 legacy（旧式）messages 接口；复杂参数可以 POST JSON，不能把所有 POST 都当成写入。", "保留 platformMessageId、replyToMessageId 和 quote；Unix 时间按 UTC 秒理解，中文时间输出使用 UTC+8，不依据机器当前时区猜。", "消费方完成分析；公开持久结果明确 current_library、library_evidence、target_account、target_conversation、talker、time_window、retry_count、message_count、lastTimestamp_matches_newest、content_scope、request_method、endpoint_family、sync_watermark、media_manifest 等字段，并实际运行 Schema 验证。"],
    boundaries: ["JSON Schema 检查格式，不自动请求接口、重试、排序、还原回复树或生成摘要；这些由调用者遵守契约实现。", "成功读取和元数据探测都不自动授权全账号归档、后台同步或公开原文。", "当前默认 wechat-direct 路线使用 WeChatDirect；本模块描述的是显式使用 WeFlow 时的契约。"],
    failures: [{ condition: "最新时间对不上", response: "记录 lastTimestamp_matches_newest=false，说明这一批可能不完整，再做有界重试或调整参数。" }, { condition: "目标未找到或仅看到转发 XML", response: "只能确认当前库没有定位到目标；转发内容不能证明原群可读取。" }, { condition: "公开结果不符合 Schema", response: "验证器会拒绝不符合字段规则的结果；调用者先纠正产物，不能把验证器未执行说成已经通过。" }],
    sources: [{ path: "docs/ai_consumer_contract.md", role: "完整取数和失败语义。" }, { path: "schemas/ai-consumer-envelope.v2.schema.json", role: "公开元数据的机器格式。" }, { path: "docs/examples/ai_consumer_envelope.example.json", role: "不含真实数据的格式示例。" }],
    verification: ["源码 31 项测试中包含契约字段、合法示例和非法格式检查。", "本轮没有执行真实账号判断、历史读取、回复还原或媒体读取。"],
    searchProjection: { intents: ["WeFlow 怎么读取微信群最新消息", "微信历史记录如何分页增量读取", "怎样保留群聊中的回复和引用", "微信接口读错账号或返回空怎么办"], entities: ["AI Consumer Contract v2", "ChatLab Pull", "lastTimestamp", "nextSince", "nextOffset", "sync.watermark", "replyToMessageId", "media_manifest"], relations: ["先核对当前账号库再读取目标会话", "分页位置和回复关系决定材料完整程度"], failureRecovery: ["时间不一致时重试并披露缺口", "当前库未找到不等于会话不存在"] },
    relation: "使用接口模块中的数据入口，并依靠自检和运行模块确认 WeFlow 是否可服务；分析决定仍由消费方承担。"
  },
  {
    id: "public-safe-openapi-and-endpoint-governance", slug: "public-safe-openapi-and-endpoint-governance", order: 2,
    title: "WeFlow 接口地图与调用边界", shortTitle: "接口地图", kicker: "消息、联系人、群成员和朋友圈分别从哪里读",
    value: "把 WeFlow 能读什么、传什么参数、会返回什么写清楚，让调用者选择对应入口，并区分普通读取、导出、删除、钩子安装和实时原始流。",
    status: "26.7.3 接口文档与标记已验证", statusTone: "accent",
    why: "查一个群的成员、看指定窗口的消息、看朋友圈时间线是不同问题。仅说“微信 API”会掩盖输入和结果差异，也容易误把导出或删除当成查询。",
    example: "“这个群有哪些成员？顺便确认我需要的讨论能从哪里读取。”群成员接口提供成员及可用角色信息，聊天历史走独立消息接口；如果要看朋友圈，另选时间线或统计，不把它们拼成一套未经验证的完整社交档案。",
    result: "得到版本明确的 OpenAPI（机器可读接口说明）3.1.0 文档。它指导客户端构造请求，但不是代理服务器，也不会在 HTTP 层拦截请求。",
    teaser: "接口用途、鉴权、读取参数、写操作和推流边界一并说明。",
    problem: "同一服务既有只读查询也有产生副作用的操作，不能只根据 GET/POST 或一个成功状态就判断任务含义。",
    readerStates: { pass: "选择与目标相符的入口，按版本契约传参；联系人、群成员、消息与朋友圈分别返回自己的数据。", problem: "版本变更、401 或响应与文档不符时先核对源服务和契约；旧文档不能证明新版本兼容。", unavailable: "写操作及原始推送流未作为默认 AI 消费入口开放；需要这些能力时不能把文档标记当成已经实施了相应调用。" }, stateLabels,
    decisionImpact: ["/health 无需鉴权，数据接口需要本地有效 token；健康通过不等于数据访问通过。", "只读查询有些支持 GET 和 POST 两种参数形式；POST 本身不等于更改微信数据。", "x-weflowbridge-ai-preferred 是推荐标记，x-weflowbridge-ai-allowed:false 是消费约定；调用方负责执行约定，本仓库没有网络拦截器。", "SSE（服务器推送事件）是实时原始流，不是默认 AI 元数据封套；上游需打开主动推送开关。"],
    concepts: [{ term: "OpenAPI 3.1", explanation: "描述服务地址、端点、参数、鉴权和响应结构的机器文档；不自动实现服务功能。" }, { term: "Bearer token（请求凭据）", explanation: "数据请求推荐使用 Authorization: Bearer <token>；具体值只由本地配置或凭据入口提供。" }, { term: "SSE（服务器推送事件）", explanation: "WeFlow 的 message.new / message.revoke 实时流；浏览器 EventSource 通过查询参数携带凭据，不能将带值 URL 写进公开日志。" }],
    implementation: ["docs/openapi.yaml 以默认 http://127.0.0.1:5031 为服务地址，声明 bearerAuth 与数据模型。", "会话、联系人、messages、group-members 包含 GET/POST 形式；ChatLab 历史消息单独定义 since/end/limit/offset。", "四类写操作标记为 x-weflowbridge-ai-allowed:false：sns/export、sns/post/{id} 删除、block-delete/install、block-delete/uninstall；push 也标为非默认 AI 入口。"],
    flow: ["查会话用 /api/v1/sessions，可按 keyword 和 limit 定位；format=chatlab 返回 AI 友好的会话索引。", "查联系人用 /api/v1/contacts；查群成员用 /api/v1/group-members?talker=<group>，可包含 isOwner、messageCount 等字段，不能把字段存在视为已完成角色分析。", "查最新消息用 /api/v1/messages；查历史或增量用 /api/v1/sessions/{id}/messages，读取策略见 AI 消费契约。", "朋友圈查询分 /api/v1/sns/timeline 与 /api/v1/sns/export/stats，前者给时间线，后者给统计；它们不证明远端所有历史都在本机可读。", "明确需要实时流时查看 /api/v1/push/messages；上游未启用会返回 403。导出、删除和防删钩子是有副作用的不同操作，不在普通查询中附带执行。"],
    boundaries: ["本仓库维护已登记的版本化接口面，不保证上游未来新增端点或全部内部接口都已覆盖。", "默认本机回环；项目没有公网代理、穿透服务或发送消息实现。", "文档不替代实际授权与客户端执行，不能声称标记已经禁止网络访问。"],
    failures: [{ condition: "返回 401", response: "核对本地鉴权配置，保留失败状态，不因为 /health 成功就宣布数据接口可用。" }, { condition: "推流返回 403", response: "上游可能没有开启主动推送；普通消息查询不需要为此自动改设置。" }, { condition: "响应或端点与旧基线不同", response: "重新探测所需接口并更新所属契约；不能把未观察的新行为写成兼容保证。" }],
    sources: [{ path: "docs/openapi.yaml", role: "版本化接口、参数与标记。" }, { path: "AGENTS.md / README.md", role: "上游实测注意事项和入口用途。" }, { path: "project_manifest.json", role: "版本基线与职责声明。" }],
    verification: ["自动化测试覆盖必需端点、写操作标记和推流非默认语义。", "本轮只请求两个 /health；没有验证上述真实业务响应。"],
    searchProjection: { intents: ["WeFlow 能读取哪些微信接口", "联系人群成员朋友圈分别怎么查", "OpenAPI 能不能自动阻止删除朋友圈", "WeFlow 推送流返回403是什么原因"], entities: ["docs/openapi.yaml", "OpenAPI 3.1.0", "sessions", "contacts", "group-members", "sns/timeline", "sns/export/stats", "x-weflowbridge-ai-allowed", "SSE"], relations: ["API 文档指导调用而不代理 HTTP 请求", "群成员与朋友圈有独立输入和结果"], failureRecovery: ["401 核对凭据", "版本变化后重新验证接口", "推流未启用不影响普通查询的职责边界"] },
    relation: "为 AI 取数契约和 probe 脚本提供接口定义，实际数据访问和服务端行为归 WeFlow。"
  },
  {
    id: "boot-guardian-and-multi-profile-watchdog", slug: "boot-guardian-and-multi-profile-watchdog", order: 3,
    title: "登录启动与多配置看门狗", shortTitle: "开机看门狗", kicker: "缺进程才启动一次，后台检查不反复开窗口",
    value: "登录 Windows 后按已有任务启动 WeFlow，并定期检查选定配置。检查脚本通过 VBS 隐藏窗口运行，支持独立 profile（配置目录），避免其他实例干扰当前实例的判断。",
    status: "已有任务状态正常；本轮未重做冷启动", statusTone: "accent",
    why: "桌面程序需要登录会话；后台巡检若每隔一段时间闪黑框会打扰使用。多实例时，仅检查“有一个 WeFlow 进程”还可能漏掉真正需要的配置。",
    example: "“我登录电脑以后，让指定 WeFlow 配置自己启动，检查时别闪黑框。”注册器创建默认任务；独立配置由其负责人提供目录和端口。端口通时安静退出，目标进程缺失才启动一次；进程已存在但接口不通，就留下日志而不重复开进程。",
    result: "得到按配置执行的一次有界恢复尝试与日志。它能处理进程缺失，不承诺修复程序内部卡住、账号失效或错误配置。",
    teaser: "静默包装、配置匹配、30 秒等待、双开任务保留与登录前提。",
    problem: "错误匹配实例会漏启动或重复启动；在用户尚未登录时把 GUI 程序当系统服务，也不能保证实际可用。",
    readerStates: { pass: "服务检查成功则退出 0；目标缺失时启动一次并在有界时间内确认端口恢复。", problem: "目标主进程存在但检查失败时退出 1，留下日志；不会把繁忙、假死或账号问题擅自归为同一种故障。", unavailable: "显式配置目录不存在时退出 2，拒绝创建空 profile；缺少安装程序或启动后仍不通时返回失败。" }, stateLabels,
    decisionImpact: ["默认零参数检查端口 5031 与没有 --user-data-dir 的主实例；独立配置需提供真实已存在目录和其 API 端口。", "HTTP /health 先行、TCP 回退。TCP 成功只说明能连端口，不能证明它返回了有效微信数据。", "PCConfig 标记 owner=pcconfig.wechat-dual-autostart.v1 存在时保留同名微信双开任务；没有标记才按旧独立注册行为处理。", "VBS 隐藏的是脚本窗口；WeFlow 窗口隐藏由 -HiddenLaunch 控制，不能把两者混为一谈。"],
    concepts: [{ term: "Boot Guardian（开机守卫）", explanation: "任务注册器。默认创建 WeFlow Watchdog 登录与每 15 分钟触发任务，并按负责人标记处理 WeChat AutoStart。" }, { term: "Interactive Logon（交互登录）", explanation: "任务在已登录的桌面会话运行；尚未登录不是可宣称完成的无人值守状态。" }, { term: "VBScript（Windows 脚本语言）静默包装", explanation: "WScript.Shell.Run 使用窗口模式 0，等待 PowerShell 完成并回传退出码；参数被逐个引用。" }],
    implementation: ["weflow_heartbeat.ps1 支持 -Port、-UserDataDir、-InstanceName、-LogPath、-NoProxyServer、-HiddenLaunch。", "Get-TargetWeFlowProcess 忽略 Electron 带 --type 的子进程，按完整规范化配置路径进行大小写不敏感匹配；其他 WeFlow 实例不阻止目标启动。", "HTTP 超时 2 秒，TCP 连接等待 1500 毫秒；启动等待基线 30 秒，每次检查后返回明确退出码。单次探测耗时意味着总墙钟不保证恰好 30 秒。", "默认程序路径为 C:\\Program Files\\WeFlow\\WeFlow.exe，微信注册路径为 C:\\Program Files\\Tencent\\Weixin\\Weixin.exe；本轮两路径均存在，不为尚未发生的其他安装布局虚构自动发现能力。", "注册器优先 wscript.exe 调用 VBS，缺 VBS 时用隐藏 PowerShell 参数；微信自启只在登录时触发，没有微信重启看门狗。", "-NoProxyServer 使用 Electron 自身的代理绕过选项，不修改系统代理，也不假设某个代理端口。"],
    flow: ["明确需要安装时，以管理员运行 weflow_boot_guardian.ps1；它只注册默认 5031 任务，其他 profile 的任务归对应配置负责人。", "用户登录后或周期触发，包装器执行一次检查；提供了配置目录却不存在时立刻返回 2。", "服务健康或 TCP 可连接时记录成功；否则只检查目标主进程。", "目标存在则返回 1；目标缺失且程序存在才启动一次，使用安装目录作为工作目录。", "有界等待后记录恢复或失败并退出；日志给下一次诊断使用，不建立无休止重启循环。"],
    boundaries: ["本轮没有执行注册器、heartbeat 或 enable-autologin.ps1，没有启动或修改微信/WeFlow。", "enable-autologin.ps1 是另一个显式机器设置入口，会改变 Windows 登录行为并涉及系统保存登录信息；不能为网页验收自动执行。", "当前任务 Ready 和最近结果 0 不证明下次冷启动、桌面可见性或所有独立 profile 已验收。"],
    failures: [{ condition: "目标进程存在而服务不通", response: "返回 1，保留诊断日志，不重复启动；进一步修复需定位该配置或程序内的实际原因。" }, { condition: "配置目录缺失", response: "返回 2，先由配置负责人恢复目录与登录/API 设置，避免启动出一个空配置。" }, { condition: "程序缺失或启动未恢复", response: "返回失败并记录，不把启动进程成功当成服务可用。" }],
    sources: [{ path: "WATCHDOG.md", role: "部署条件与多配置使用说明。" }, { path: "weflow_heartbeat.ps1 / weflow_heartbeat.vbs", role: "匹配、探测、启动、等待和退出行为。" }, { path: "weflow_boot_guardian.ps1 / enable-autologin.ps1", role: "明确的机器配置入口，读取不等于执行。" }],
    verification: ["源码测试检查参数、进程匹配结构和 PCConfig 任务保留规则；它们不是本轮冷启动实机测试。", "2026-09-08T02:37:25.8272891Z：WeFlow Watchdog 与 WeChat AutoStart 为 Ready、最近结果 0；5031 与 16000 的 /health 为 200。"],
    searchProjection: { intents: ["WeFlow 登录后自动启动", "后台每十五分钟闪黑框", "WeFlow 多配置独立端口看门狗", "WeFlow 进程存在但接口不通怎么办"], entities: ["weflow_heartbeat.ps1", "weflow_heartbeat.vbs", "weflow_boot_guardian.ps1", "UserDataDir", "NoProxyServer", "HiddenLaunch", "pcconfig.wechat-dual-autostart.v1"], relations: ["缺失的目标配置才启动一次", "VBS 脚本隐藏和应用窗口隐藏是两件事", "PCConfig 双开任务保留"], failureRecovery: ["缺目录退出2", "已运行但端口不通退出1", "启动失败保留日志，不循环重启"] },
    relation: "给显式使用 WeFlow 的调用者提供运行辅助；不接管微信双开配置，也不改变现役 WeChatDirect 路线。"
  },
  {
    id: "metadata-first-probe-and-boundary-verification", slug: "metadata-first-probe-and-boundary-verification", order: 4,
    title: "元数据自检与项目验证", shortTitle: "接口自检", kicker: "检查接口是否响应，失败就明确失败",
    value: "需要排查 WeFlow 接口时，输出端点成功状态、数据形状、数量和是否带同步信息，避免把消息正文直接打印在终端。需要更窄的观察时，可以只查无需鉴权的健康入口。",
    status: "隔离失败分支通过；真实业务自检未执行", statusTone: "accent",
    why: "只看到程序在运行，并不能说明会话或联系人接口可用。自检也不能因为一个健康端点成功就忽略其他必需接口失败。",
    example: "“接口是不是坏了？检查结果别打印聊天文字。”只问服务就查 /health；如果确实要检查业务接口，元数据模式会请求会话、联系人等数据，再仅输出汇总形状。缺配置、必需端点失败和可选端点失败会分别说明。",
    result: "得到一份明确的检查结果和退出码。它说明观察到了哪些响应，不证明聊天历史完整，也不以字段名称存在代替完整业务验证。",
    teaser: "无消息正文端点、明确必需项、准确退出码与统一测试入口。",
    problem: "元数据模式若被理解成“不需要凭据”或“不访问任何私人数据”，就会误判它的真实读取范围。",
    readerStates: { pass: "五个必需端点成功，脚本返回 ok=true；输出形状和数量供查看。", problem: "任一必需项缺失或失败时 ok=false、退出 1；可选项失败单独保留，不伪装全部端点通过。", unavailable: "没有 .env 时 JSON 模式返回 missing_env 和退出 1；没有有效数据凭据也不能用 /health 的成功替代。" }, stateLabels,
    decisionImpact: ["MetadataOnly（纯元数据探测）跳过 messages 和 ChatLab 消息正文请求，但会读取 sessions、contacts、群成员和朋友圈统计的响应后做投影。", "五个必需项是 GET /health、GET sessions?limit=3、GET sessions?format=chatlab、GET contacts?limit=3 和 GET sns/export/stats。", "JSON 输出只记录 shape、count、sync_present 等观察值；脚本不会把响应与完整 OpenAPI Schema 自动逐项比对。", "FullProbe（完整探测）默认模式可能请求真实消息，不能为了本页构建无条件执行。", "现有公开检查只覆盖它实际枚举和解析的文件，不是 Git 历史全量检查，也不是自动安装的提交钩子。"],
    concepts: [{ term: "MetadataOnly（纯元数据探测）", explanation: "不调用消息正文端点；需要本地配置及数据接口凭据，会接触其他业务响应但不将其原样输出。" }, { term: "Shape（返回形状）", explanation: "对象最前面的属性名列表；记录它不等于验证这些字段内容符合全部业务约定。" }, { term: "CI（自动化集成检查）", explanation: "此项目统一用 test-ci-local.ps1 发现并运行 tests/test_*.py，然后执行已有公开边界检查。" }],
    implementation: ["probe-weflow.ps1 读取本地 .env，JSON 模式使用 Invoke-JsonRequest 收集状态，Get-RequiredEndpointFailures 汇总五个必需项。", "每个 HTTP 请求设置 8 秒超时，按需顺序探测；不存在已经证明的毫秒级整体完成承诺。", "Get-Shape 最多记录前 10 个属性名，Get-ResultCount 从 count/total 或已知集合取数量；这些是观察，不是内容真实性验证。", "本地 CI 改为 python -m unittest discover -s tests -p \"test_*.py\"，覆盖 26 项契约和 5 项快照测试；GitHub Actions 不再重复运行旧的 26 项子集。", "test-public-boundary.ps1 检查当前已跟踪路径、忽略规则、文本和 PowerShell 语法；PDF 文本依赖 pdftotext，可缺失而被脚本跳过，必须单列。"],
    flow: ["先判断实际问题只需要健康入口还是需要业务自检；本轮选择无鉴权健康入口和虚构接口替身。", "业务自检从本地配置加载地址与 token，不把值写入结果；配置缺失时返回 missing_env。", "健康成功后请求必需业务项及条件可选项；元数据模式跳过消息正文请求。", "输出每个端点结果、模式、凭据是否存在及 required_endpoint_failures，不输出原始响应正文。", "维护源码时先运行全部测试；任一测试失败则退出，成功才继续已有公开边界检查，任何 SKIP（跳过）另行披露。"],
    boundaries: ["本轮没有运行连接真实业务数据的 MetadataOnly 或 FullProbe；只运行替身探测测试。", "形状、数量和无正文输出不能证明账号已匹配、所有群可读或真实聊天完整。", "脚本执行本地检查，不上传检查结果，也不会自动替调用方安装 Git 提交钩子。"],
    failures: [{ condition: "missing_env", response: "JSON 报告列出失败和缺失配置，返回 1；没有实际配置时不尝试猜凭据。" }, { condition: "必需端点失败", response: "失败项进入 required_endpoint_failures，总体返回 1。可选 POST 失败不会被混成必需项。" }, { condition: "新增快照回归失败", response: "统一 CI 会发现该测试并返回失败，不再因只跑旧文件而漏过。" }, { condition: "pdftotext 不存在", response: "脚本会跳过 PDF 文本检查，不能仅据退出 0 宣称完整；本次相同提交的 GitHub Actions 已实际完成该检查并通过。" }],
    sources: [{ path: "probe-weflow.ps1", role: "探测范围、输出与退出条件。" }, { path: "tests/test_project_contracts.py", role: "配置缺失、健康失败、必需失败和可选失败的接口替身。" }, { path: "tools/test-ci-local.ps1 / .github/workflows/contract.yml", role: "统一测试入口。" }, { path: "tools/test-public-boundary.ps1", role: "已有公开检查及 PDF 跳过条件。" }],
    verification: ["当前完整 31 项源码测试通过；其中 4 个探测行为场景由 PowerShell 接口替身执行。", "将虚构 test_private_snapshot_manifest.py 设为失败后，实际本地 CI 退出 1，未执行后续边界脚本。", "GitHub Actions 34180971929 对同一 master 提交执行 31 项测试及 PDF 文本检查并成功完成。", "真实 /health 为 200；数据接口与账号并未在本轮访问。"],
    searchProjection: { intents: ["不打印聊天文字检查 WeFlow 接口", "MetadataOnly 是否需要 token", "WeFlow 健康成功但业务接口失败", "WeChat History AI Bridge 本地测试怎么运行"], entities: ["probe-weflow.ps1", "MetadataOnly", "FullProbe", "required_endpoint_failures", "test-ci-local.ps1", "test_private_snapshot_manifest.py"], relations: ["不输出正文不等于不读取业务响应", "必需接口失败落实为失败退出", "本地和远端CI使用同一完整测试入口"], failureRecovery: ["缺配置退出1", "必需失败不得报告总体成功", "跳过PDF文本检查单独说明"] },
    relation: "为接口维护提供观察和回归验证，不能代替真实任务读取或运行恢复验收。"
  },
  {
    id: "private-snapshot-integrity-and-consumer-handoff", slug: "private-snapshot-integrity-and-consumer-handoff", order: 5,
    title: "私有文件集回读与交接", shortTitle: "文件回读交接", kicker: "核对已取得的文件，不把清单当成备份",
    value: "对已经取得、属于一个明确来源实例的私有文件集，列出每个文件的大小与哈希，再完整读第二遍核对；让消费方知道本次检查是否读到了同一组字节。",
    status: "虚构文件回读测试通过", statusTone: "accent",
    why: "复制或取得一批数据库和媒体文件后，仅看目录存在不能证明文件齐全或检查期间没有变化。另一方面，生成一份清单也不能凭空补全原始导出，所以两者必须分开。",
    example: "“这批已经取得的文件，给我核对一下并留一份清单。”工具逐个计算哈希、重新列目录再读一遍；一致时给出文件数、字节数和回读收据。空目录、已有输出或文件变化时明确失败，源文件保持原样。",
    result: "得到 files.jsonl、manifest.json、readback-receipt.json 和 progress.json。它们是普通 JSON 检查记录，没有数字签名；原始文件仍位于外部来源目录，不会被这个工具复制成另一份备份。",
    teaser: "文件清单、两遍 SHA-256、失败暂存区与明确的证明范围。",
    problem: "把哈希结果说成“不可变快照”会掩盖源目录仍可变化、导出可能不完整，以及工具并未解密或验证数据库业务内容。",
    readerStates: { pass: "两遍文件内容和集合检查一致，输出目录由 .incomplete 改成指定最终名称，收据记录 verified（本次核对通过）。", problem: "发现文件集合、大小、时间或哈希不一致时失败；可能保留 .incomplete 供诊断，不自动删除暂存材料。", unavailable: "空源、已存在目标、仓库内输出或源目标相互包含时拒绝；可读来源需要由实际取得它的项目先准备。" }, stateLabels,
    decisionImpact: ["按一个账号来源实例分别检查；一个账号的一次成功不证明另一个账号也完整。", "工具只读字节，不解析 SQLite、语音或媒体，不负责获取、解密、导出和恢复。", "外部私有目标与本仓库分开，且与源目录不能相互包含；已存在目标不覆盖。", "源目录中的符号链接和重解析项按实现拒绝，避免跨越被选文件集；不要把这一行为扩写成对所有文件系统变动的完整证明。", "导出是否完成、版本是否匹配、账号和覆盖是否正确，需要交接方另外核对，不能由哈希工具单独宣告。"],
    concepts: [{ term: "Readback Receipt（回读收据）", explanation: "普通 JSON 结果，记录文件数、总字节、集合指纹和清单文件哈希；不是数字签名，也不会阻止结果文件被修改。" }, { term: "Reparse Point（重解析点）", explanation: "目录联接或符号链接等文件系统项。本工具不跟随源集合内部这些项，避免把别处文件混入范围。" }, { term: "external_read_only_reference（外部只读引用）", explanation: "结果引用已存在的外部源文件；没有复制数据，所以清单目录不能独立替代原件。" }],
    implementation: ["tools/build_private_snapshot_manifest.py 使用 8 MiB 分块计算 SHA-256；首遍保存相对路径、size_bytes、mtime_ns、sha256。", "输出 weflowbridge.private-snapshot-manifest.v1，记录 source_instance_id、payload_mode、file_count、total_bytes、snapshot_fingerprint 和 files_manifest。", "第二遍重新枚举文件，比较集合与顺序，再逐个重算哈希并检查大小和修改时间；结尾再次比较目录集合与文件标识。", "成功结果为 weflowbridge.private-snapshot-readback-receipt.v1，包含 verification=full_sha256_second_pass 和两份清单哈希。", "每 1000 文件默认更新进度，也可调 progress_interval_files；先写 .incomplete，完成后重命名，失败不把暂存目录当最终交付。"],
    flow: ["取得方先完成合法、版本明确且按账号区分的导出或恢复文件准备，并停止把持续写入的活目录当作稳定快照。", "传入 source-root、全新外部 destination 和 source-instance-id，工具检查目录关系与已有输出。", "列出常规文件并计算第一遍哈希，把每项写入 files.jsonl 与清单，更新 progress.json。", "重新列目录并完整第二遍回读；任何已检测的不一致会终止本次结果。", "核对结束后写出收据并将 .incomplete 重命名；消费方同时保留实际源文件和必要的来源完成证据。", "恢复是否能成功，需要取得方再用对应数据库或导出工具实际验证；仅保存收据不构成恢复验收。"],
    boundaries: ["不提供签署、可信时间戳、不可变存储、自动备份或文件恢复。", "失败后的 .incomplete 可能存在；重试不会自动覆盖它，应先判断其内容和失败原因，再使用合适的新输出或明确清理。", "旧消费规程中的历史下游示例不代表当前启用；本次不恢复中央个人系统，也不建立新的全账号档案。", "本轮只有虚构文件验收，没有读取真实数据库、媒体或现有私有快照。"],
    failures: [{ condition: "source changed while hashing / readback mismatch", response: "返回失败，不发布最终成功目录；取得方先解决源仍在变化或文件取得不完整的问题。" }, { condition: "destination already exists / incomplete destination already exists", response: "拒绝覆盖。检查已有结果或使用新的明确目标，不删除不明材料来追求成功。" }, { condition: "destination must be outside the repository tree", response: "只选择本仓库外的获准私有目标；工具仍不负责把原始载荷复制过去。" }, { condition: "empty source snapshot is not acceptable", response: "空目录不能作为完整取得成功，回到取得方核对真实导出结果。" }],
    sources: [{ path: "tools/build_private_snapshot_manifest.py", role: "文件列举、两遍哈希、进度与完成输出。" }, { path: "tests/test_private_snapshot_manifest.py", role: "5 项虚构文件和目录边界测试。" }, { path: "docs/ai_consumer_contract.md / project_manifest.json", role: "来源、版本、账号与交接责任要求。" }],
    verification: ["5 项既有测试通过：外部虚构文件成功、已有目标保留、仓库内输出拒绝、源目标嵌套拒绝和空源拒绝。", "成功样例的 2 个文件写入清单并完整回读，输出本身不包含虚构原始文件正文。", "没有把这 5 项写成真实数据库解密、恢复或全部并发改动场景都已验证。"],
    searchProjection: { intents: ["已经导出的微信文件怎样核对完整性", "微信文件哈希清单是不是备份", "private snapshot 回读失败怎么处理", "readback receipt 有没有数字签名"], entities: ["tools/build_private_snapshot_manifest.py", "files.jsonl", "readback-receipt.json", "SHA-256", ".incomplete", "external_read_only_reference"], relations: ["文件字节回读与导出完整性各自验证", "收据引用外部源文件，不复制原件"], failureRecovery: ["失败可能保留incomplete目录", "已有输出不覆盖", "空源不能称完成", "源文件变化先解决取得方问题"] },
    relation: "承接已经取得的私有文件，不替代 WeFlow 数据获取、原始导出或独立消费方的恢复责任。"
  }
];

export const project = wechatHistoryAiBridgeProject;
export const modules = wechatHistoryAiBridgeModules;
export { wechatHistoryAiBridgeSnapshot, wechatHistoryAiBridgeProject, wechatHistoryAiBridgeModules };
