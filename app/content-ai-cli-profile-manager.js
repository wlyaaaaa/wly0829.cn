import { createProjectSnapshot } from "./project-snapshot.js";

const aiCliProfileManagerSnapshot = createProjectSnapshot({
  observedAt: "2026-09-24T04:59:33Z",
  label: "0.3.18 已正式发行并安装；真实桌面主进程已加载新版桥，新父工具与模型任务仍另验",
  boundary: "9月24日读回 PUBLIC main=bbaaa9d、源码/已装模块 0.3.18，零写入诊断显示桌面启用 562b29bf4a6ac0af；现场进程链已看到真实 ChatGPT.exe→同版 Bridge→codex.exe。0.3.18 发行时 555 项 Pester 全过；新父会话工具定义、实际模型响应和全部 Profile Live 仍分别判断。本网页未发付费调用，也不重启 Gemini 冻结路线。",
  metrics: [
    { label: "当前源码版本", value: "0.3.18" },
    { label: "公开 Profile", value: "23 个 · 5 类引擎" },
    { label: "桌面专项合同回归", value: "46项" },
    { label: "项目模块", value: "9 个" }
  ],
  facts: [
    { label: "它真正解决的事", value: "用一个 aicli 入口保存、检查并启动五类原生 AI 命令行，也让已安装的官方 Codex 桌面使用明确选择的本地模型和第三方服务。终端、原生桌面、工具和历史仍由原产品承担；它不另造聊天软件。" },
    { label: "普通输入与结果", value: "我给出项目目录和模型配置；可得到原生 CLI、新的桌面任务、可查询的程序化运行，或同一父任务下的 OpenAI 子会话。静态诊断只说明条件与缺项，实际完成必须另有模型、工具、产物与清理证据。" },
    { label: "当前来源", value: "2026-09-24T04:49Z 本地 main、origin/main 和 live ls-remote 同为 PUBLIC bbaaa9da5afb2afc4c3b54765a528691c82f09e6，工作树 clean。该来源包含 0.3.18 发行、Sol/Astra 双档、官方模型目录连续性及首次 Luna 许可诊断；模块、桌面桥启用、进程加载和真实模型调用分别核验。", hero: false },
    { label: "源码与 Release", value: "源码 aicli version 实读 0.3.18，CurrentUser 模块目录 E:\\Documents\\PowerShell\\Modules\\AiCliProfileManager\\0.3.18 存在；Owner §28 记载正式 Release、安装和发行时 555/555 Pester。旧 0.3.17 与 v0.3.12 只按当时日期保留，不表示今天的安装或 Live。", hero: false },
    { label: "保留日期的 CLI 环境观察", value: "2026-09-14T04:20:45Z的Doctor（静态体检）看到Windows 11 10.0.26200 x64、PowerShell 7.6.4，实际选择desktop-codex 0.154.0-alpha.6.2、Claude Code 2.1.270、Rust Open Interpreter 0.0.40及Ollama可执行文件；这些依赖身份不证明各Profile的真实调用通过。", hero: false },
    { label: "公开入口与配置观察日期", value: "当前已发布 data/providers 有25份模板，其中2份 hidden（内部模板），23份公开，覆盖5类引擎；它们不是23份当前 Live（真实调用）合格证。旧19个已配置、2个未配置属于9月3日观察，本次不把那个数量继续当成本机现场。", hero: false },
    { label: "Doctor 与安装边界", value: "9月18日13:41Z 的 0.3.17 diagnose 和 3b7600a 七文件读回是历史。0.3.18 Release 与模块安装由 Owner §28 验收；2026-09-24T04:59Z 零写入 diagnose 显示 productVersion=0.3.18、桌面配置 enabled 且目标 562b29bf4a6ac0af，但 installation_state=registry_not_supplied、running_process_loaded=unknown。另以 Windows 进程只读回读确认真实 ChatGPT.exe 主进程的 Bridge 可执行路径已是 562b29bf4a6ac0af，进程路径不能证明新父工具或模型 Live。", hero: false },
    { label: "9月3日源码测试", value: "当日最终 PUBLIC main 完整 Pester 为 385/385，耗时 146.232 秒；scripts/Test-Release.ps1 离线发行检查 exit 0，耗时 6.606 秒。它们覆盖命令、Profile、秘密、适配器、Doctor、Live/Agent 验收、恢复、代理、安装与文档合同，但不发真实付费请求。", hero: false },
    { label: "已解决的安装连接缺陷与历史验收", value: "9月3日开始施工时，已安装 0.3.12 的 73 个模块文件只有 72 个与 main 相同，缺少 255c300 的损坏 Profile 拒绝修复；首次 -Force 安装又被 .codex 兼容 Junction（目录连接）误拦。88f72e6 让退役预检优先真实 CODEX_HOME，旧单跳 state 别名只作严格等价比对；实际重装成功，9月14日04:20Z再次比较模块与data载荷仍为73/73；9月3日损坏JSON 与非对象 JSON 的 show/list 都以 exit 4 拒绝。", hero: false },
    { label: "精确路线而非模型大杂烩", value: "当前云端包括 Qwen3.7 06-08、Qwen3.8 Max 0902、GLM-5.3/Flash 中国区编码套餐，以及 DeepSeek 官方 deepseek-flash；V4 Pro 保留独立 CLI Profile。本地统一目录是27B、35B及各自去限制版四种256K模型，不以老别名或自动回退改变选择。", hero: false },
    { label: "程序化 Codex 权限", value: "交互式 start 保留上游权限界面；aicli run 的 Codex harness（程序化执行层）则对所有模型固定 danger-full-access 和 approvalPolicy=never，并现场回读实际模型、Provider 与权限。--no-web-search 只关闭受管公共搜索，不降低本机权限。", hero: false },
    { label: "已经完成的桌面协作与未扩大范围", value: "Owner 于9月18日验收 GLM 与 DeepSeek 父任务分别调用 Luna High 的后台子会话：每条链都在同一子 thread/session（线程/会话）完成3轮、提问回复和最终汇总。一次错误 reply_to 被准确拒绝后改为普通续问完成；不宣称零错误、所有子模型、长期压力测试或原生子代理卡片已经验收。", hero: false },
    {
      "label": "后继桌面发行与当前运行边界",
      "value": "内容寻址桌面桥 562b29bf4a6ac0af 已沿受保护登记、安装与启用目标交付；Sol High 常规/Astra High 重大后果专用判断与普通子会话分开。Owner §25.10 另记录首次 Luna 许可诊断修复、344 项聚焦回归和既有 Luna Low 子会话 task_complete。04:59Z 只读进程链确认真实 ChatGPT.exe 主进程正通过 562b29bf4a6ac0af Bridge 启动 codex.exe；这比旧交付时的未切换状态更新，但新父会话工具及新的厂商 Live 未测。0.3.18 发行时完整 Pester 555/555，旧 6 项失败仅是更早阶段。",
      "hero": false
    },
  ],
  gaps: ["网页没有发起新付费调用；两条已接受的桌面父子链路、既有 Luna Low 完成记录与9月15日本地桌面任务，不证明23个Profile全部当前可用。","源码、0.3.18模块、桌面桥登记/启用、真实 GUI 进程路径和实际任务分别核验；当前 Bridge 可执行路径已是 562b29bf4a6ac0af，但本轮未读新父工具 schema 或新的 Provider Live。","通用Claude/OI模板的127.0.0.1:11434与受管本地模型32100不是同一入口；前者离线及两个可选代理未运行是9月14日观察，本页没有重新登录OAuth、启动代理或生成模型结果。","Gemini consumer→Codex 路线按来源 Owner 冻结；保留文件和历史实验不能当成可用 Profile 或重启许可。","代理只执行现有批准清单中的制品；本轮没有调查、批准或下载上游新版本。删除本地OAuth材料仍不等于账号侧撤销授权。","旧codex-deepseek、claude-deepseek和oi-deepseek入口已退出当前模板；DeepSeek Flash使用官方稳定ID deepseek-flash，不能把旧V4 Flash回执换名继承。"]
});

export const aiCliProfileManagerProject = {
  usageEntry: "这是在电脑上选择模型并启动已有 AI 编程工具的管理器：打开 Windows PowerShell，用 aicli profile list/show 查看配置档、aicli native 预览、aicli start 启动。Codex 桌面本地模型与子任务仍在官方 Codex 界面使用。",
  usageInputs: ["要工作的项目目录", "想用的 CLI、模型及数据去向", "第三方服务是否已有凭据和是否愿意做真实调用"],
  order: 14,
  slug: "ai-cli-profile-manager",
  title: "AI CLI Profile Manager",
  kicker: "选清模型和服务，继续使用原生 AI 工作台",
  route: "/projects/ai-cli-profile-manager",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "原生桌面及两条后台子会话已验收；其余路线保留各自证据边界",
  cardStatusTone: "mixed",
  ...aiCliProfileManagerSnapshot,
  searchAliases: ["AI CLI Profile Manager", "ai-cli-profile-manager", "aicli", "切换Codex和Claude配置", "AI命令行Profile管理", "检查模型入口为什么不能用", "恢复中断的Codex任务", "导出原生CLI启动配方", "第14项目",
  "模型代理安装与运行，不自动切换备用服务"],
  repositoryNote: "AI CLI Profile Manager 是 PUBLIC（公开）源码项目。网页只解释当前产品、命令、边界和最后一次核对结果，不接收访客 API Key、OAuth 数据、Profile 或任务正文，也不会从浏览器启动本机 CLI。个人 SecretRef、原始运行事件和私有端点不进入页面。",
  summary: "我想在同一个项目里使用官方账号、明确选择的第三方模型或本地模型，但不想每次手改一堆环境变量。AI CLI Profile Manager 把每种选择保存成可切换的配置档（Profile），让我继续使用原生命令行或官方 Codex 桌面；它会说明实际模型、程序和数据去向，不在失败时偷偷换服务。需要分工时，GLM 或 DeepSeek 任务可在当次许可范围内和同一个 OpenAI 子会话持续协作；当前桌面版本还把常规与重大后果判断分开。原生命令行（CLI）包括 Codex CLI 和 Claude Code，官方 Codex 桌面是另一条已接入的使用方式。",
  why: "同一台电脑上同时用官方登录、第三方模型服务（API）和本地模型时，最容易发生的事故不是命令记不住，而是旧环境变量把请求送错地方、同名模型实际换了版本、失败后悄悄走了别的线路，或只因命令行界面（CLI）能打开就误判任务可用。aicli 把每次选择写成可检查的运行计划，让秘密只进入目标进程，再把静态检查、真实调用和任务结果分开报告。",
  plainExample: "“这个项目先用我选好的本地模型，在原来的 Codex 桌面继续；需要请 OpenAI 帮忙时单独说清。”我看到的仍是熟悉的工作台。系统先核对当前安装支持的配置；额外协作保持独立模型身份和原会话，不把选择本地模型当成默认同意外发。",
  result: "我得到原生 CLI、桌面任务或带编号的程序化运行；需要后台协作时，还能让同一个子会话持续回答、报告进展或回来提问。诊断先给缺项和实际入口；取消必须确认对应进程与显卡租约已经释放，不能只把“已收到停止请求”说成结束。",
  readerStates: {
    "pass": "选定的配置档确实启动了指定程序与模型；若另做了真实调用，还会说明回答、工具和任务结果。",
    "problem": "设置冲突、模型已换、代理没运行或本地服务不可用时，只标明这条路线的问题，不悄悄换另一个模型。",
    "unavailable": "配置档损坏、需要的凭据缺失或原任务身份无法确认时，停止相应启动或恢复，并说明怎样修复。"
  },
  dataSources: {
    "title": "我给它什么，它实际把什么交给谁",
    "intro": "这款工具只使用本次选定的项目目录、模型配置与必要登录材料，不读取统一的私人资料库。下面说明每类输入交给哪个程序、我会看到什么。",
    "rows": [
      {
        "source": "我正在工作的项目目录",
        "data": "本次打开的文件夹或明确指定的项目；额外参数逐项交给选定工具。",
        "result": "原来的 AI 编程工具从该项目开始工作，实际读写仍受它的权限和这次任务控制。"
      },
      {
        "source": "选定的模型配置档",
        "data": "记录要启动哪个程序、哪个模型、服务地点与受保护的凭据引用，不保存明文密码。",
        "result": "启动前可读脱敏计划，确认材料会去哪里。"
      },
      {
        "source": "可选的 OpenClaw 设置",
        "data": "只读取本人点名的现有设置并核对来源；默认先预览，不自动导入或接受未知服务地址。",
        "result": "明确应用时只导入对应 DeepSeek Flash 配置，密钥转入本机受保护保存。"
      },
      {
        "source": "第三方密钥与官方登录",
        "data": "第三方密钥在当前 Windows 用户下加密保存，启动时只交给选中的目标程序；官方工具沿用其自己的登录。",
        "result": "其他终端和工具不会被永久改到第三方服务，普通输出也不显示密钥。"
      },
      {
        "source": "静态体检与明确选择的真实测试",
        "data": "静态体检只看程序、配置和服务状态；真实测试才发一次模型请求或做一项小文件任务。",
        "result": "分别拿到设置缺项、模型回答、工具结果或实际文件结果；一层通过不顶替下一层。"
      },
      {
        "source": "后台任务的公开进度",
        "data": "只记录任务编号、可公开的进度、结果和停止状态，任务正文不写进恢复记录。",
        "result": "可以查询、继续或精确停止原任务；隐藏推理和工具原文不会作为历史散出。"
      },
      {
        "source": "本地模型与可选代理",
        "data": "选中的本机模型或代理各查自身是否真在运行和是否属于批准版本。",
        "result": "身份对得上才标这条路线可试用，未运行或端口不对时报告原因。"
      }
    ],
    "note": "配置之间的隔离只防止模型服务与密钥意外串线，不承诺程序只能读当前文件夹；让编程工具处理文件前仍要确认任务和工作目录。"
  },
  productPrinciples: [
    {
      "title": "仍用原来的 AI 工作台",
      "detail": "配置档只帮我选程序、模型和数据去向；终端交互继续由原生工具负责，桌面工作继续用官方 Codex 的界面、工具和历史。后台协作保留同一真实子会话。"
    },
    {
      "title": "每次工作都知道用的是谁",
      "detail": "同名模型可能属于不同服务或付费线路。启动前显示准确版本、服务、地域与思考档位；发现被改送别处就停下，不当作方便的自动备用。"
    },
    {
      "title": "密码只给这次需要的程序",
      "detail": "配置档只保存受保护的密钥引用，真实密钥在本机加密保存、启动时交给目标程序；父终端、聊天、日志和导出说明不显示明文。官方登录与第三方服务各走自己的认证。"
    },
    {
      "title": "能打开程序和完成任务分开证明",
      "detail": "安装、静态体检、模型回答、调用工具和实际文件结果各有自己的结论。型号或连接方式改变时重新核对相关证据，单纯版本号变化不让全部工作永久停摆。"
    },
    {
      "title": "中断先接原任务，不复制一份假续作",
      "detail": "继续前核对原会话、工作目录、模型和权限；目标或身份变化时明确重新开始可能重做动作，不把复述摘要说成断点恢复。"
    },
    {
      "title": "启动前能预览，离开时也带得走",
      "detail": "可查看不会泄露密钥的启动计划，也能导出独立使用的配置说明。普通卸载保留用户数据，明确彻底清理才删除本工具保存的内容。"
    },
    {
      "title": "一条路线故障只报这一条",
      "detail": "本地模型、云端服务和代理分别判断。缺登录、服务离线或证据过期时说明该怎么修，不自动改用别的账号、模型或资料去向。"
    }
  ],
  responsibilities: [
    "保存可选择的 AI 编程工具与模型配置档，并在启动前展示程序、服务和数据去向。",
    "从已核对的 OpenClaw 设置导入指定 DeepSeek Flash 配置时先预览，再由本人明确应用。",
    "启动现有 Codex、Claude Code、Qwen Code、OpenCode 和受支持的 Open Interpreter；本地模型也可接入已有 Codex 桌面。",
    "只把第三方服务所需的密钥交给目标程序，避免污染其他终端或官方登录。",
    "先做不发模型请求的体检，需要时再明确执行文本、工具或真实文件任务测试。",
    "为程序化工作留下可查询的任务编号；中断先查原任务，获准的桌面父任务可与同一个后台子会话往返。",
    "管理可选代理的安装、登录和退出，并说明哪些状态只证明安装、哪些证明真实可用。",
    "提供可回退的安装、更新与卸载，并写清保留或清除哪些用户配置。"
  ],
  exclusions: [
    "它启动已有 AI 工具，不另造聊天窗口或统一聊天历史库。",
    "不会修改上游工具本体，也不会把一个工具的模型、权限或命令硬套给另一个。",
    "模型、账号或服务失败时不自动转到另一条可能收费或外发资料的路线。",
    "网站说明更新不触发付费模型调用、登录、代理启动或显卡模型下载。",
    "配置存在、静态体检通过或旧回执都不等于每个模型现在可用；删除本机登录文件也不会撤销远端授权。"
  ],
  glossary: [
    { term: "Profile（运行配置档）", meaning: "一次明确的引擎、Provider、模型、地域、项目偏好和秘密引用组合；启动前可以查看，改变后只影响新进程。" },
    { term: "Provider（模型服务接入定义）", meaning: "模型请求实际发往的服务和协议；同一模型名在不同 Provider 下不是同一个运行身份。" },
    { term: "SecretRef（秘密引用）", meaning: "用户 Profile 保存的不透明引用；真正 Key 由 DPAPI 密文持有，只在目标进程启动时短暂注入。" },
    { term: "Doctor（静态体检）", meaning: "读取本机版本、配置、端点和服务状态，但不要求模型生成内容，也不证明付费线路已通过。" },
    { term: "Live Test（真实能力测试）", meaning: "通过目标 CLI 发真实请求；text、tool 与 agent 分别验证正文、单用途工具和非平凡文件任务。" },
    { term: "machine run（程序化机器运行）", meaning: "供上层程序用 stdin/JSON 发起任务的入口；Codex 路线可后台查询、精确恢复和协作中止。" },
    { term: "exact resume（精确恢复）", meaning: "继续原来的同一 thread/session，并回验工作区、Profile、模型、Provider、effort、CLI 与权限，而不是新建对话后重述。" },
    { term: "no-fallback（不自动回退）", meaning: "当前入口失败时保留失败，不静默换模型、服务、账号或本地路线。" }
  ],
  operatingFlow: [
    {
      "title": "列出这次能启动的工具和模型",
      "detail": "系统在当前项目下显示可用配置档、真实服务去向与状态，让后续启动有明确目标。"
    },
    {
      "title": "启动前看计划",
      "detail": "用 native 预览实际程序、参数与环境变化；需要第三方 Key 时经无回显配置。"
    },
    {
      "title": "选择交互或程序化执行",
      "detail": "用 start 进入原生 CLI，或用 run start 启动可追踪工作；桌面模型沿官方界面选择。"
    },
    {
      "title": "分层验证并处理问题",
      "detail": "Doctor 先做不调用模型的检查，真实文本或工具测试按明确范围运行；出错按检查项修，恢复旧任务先验同一身份。"
    }
  ],
  technicalOperatingFlow: [
    { title: "先确认本次工作目录", detail: "在可信项目根运行，或用 --project 指定路径；它决定原生 CLI 能看到和工作的上下文，不是 AI 的统一记忆库。" },
    { title: "查看并选择一个明确 Profile", detail: "用 profile list/show 核对引擎、模型、数据去向、是否需要秘密和当前状态；第三方云路线按需无回显配置 Key。" },
    { title: "在启动前查看脱敏计划", detail: "native 展示可执行文件、参数、环境增删和目标服务。若 Provider、模型或官方登录可能被劫持，先在这里与 Doctor 定位。" },
    { title: "启动原生 CLI 或程序化 run", detail: "CLI交互用start，程序化工作用run start；桌面选择已登记模型。CLI切换Profile创建新进程，桌面同一Provider内可切模型；官方、第三方、本地这些不同Provider之间另开任务，不重写原会话身份。" },
    { title: "先做免费静态体检", detail: "Doctor 核对依赖、Profile、秘密引用、配置层、代理、本地服务和旧证据；它不会擅自发一条模型请求。" },
    { title: "只有确需时再做真实验收", detail: "明确选择 text、tool 或 agent，并阅读可能耗额度和产生工具副作用的提示；结果绑定实际 CLI、模型、Provider、权限与 Profile 指纹。" },
    { title: "问题按原路线修，退出时保留边界", detail: "按 check ID 修当前入口，重新开进程后生效。native/eject 帮助脱离工具；卸载先区分保留数据、彻底清理和远程 OAuth 撤销。" }
  ],
  galleryPresentation: {
    kicker: "真实使用画面",
    title: "Qwen3.8 27B 接入 Codex 的桌面版与 CLI",
    description: "同一条本地模型路线分别进入 Codex 桌面版 harness（运行外壳）和原生 Codex CLI。第一张展示桌面版中的完整任务结果，后四张展示从选择 Profile 到规则读取、访问检查和最终回答的 CLI 过程。"
  },
  gallery: [
    {
      src: "/media/ai-cli-profile-manager/01-desktop-qwen38-codex-harness.png",
      alt: "Qwen3.8 27B 接入 Codex 桌面版 harness 并完成中文偏好查询",
      caption: "桌面版 Codex harness 中，本地 Qwen3.8 27B 完成一次中文偏好查询，并呈现工具过程、结论和中文思考摘要。",
      evidenceLevel: "E3",
      evidenceLabel: "真实桌面版使用画面",
      proves: "证明这条 Profile 曾进入 Codex 桌面版 harness，并完成包含工具调用与中文长回答的一次真实任务。",
      doesNotProve: "单张界面截图不独立证明底层模型字节、所有工具路线或长期稳定性。",
      observedAt: "2026-09-15",
      width: 789,
      height: 1614,
      originalBytes: 348739,
      originalSha256: "b14e9b08314bf160967e207238d2b82958d8cb00b4b6a465e9266d66cd161fea"
    },
    {
      src: "/media/ai-cli-profile-manager/02-cli-profile-selection.png",
      alt: "aicli 选择本地 Qwen3.8 27B Profile 并启动 Codex CLI",
      caption: "在 PowerShell 输入 aicli 后选择本地 Qwen3.8 27B Profile；启动页明确回读模型、目录、完全访问权限和本地兼容端点。",
      evidenceLevel: "E3",
      evidenceLabel: "真实 CLI 使用画面",
      proves: "证明 Profile 选择器、启动说明和原生 Codex CLI 能在同一条本地路线中连续出现。",
      doesNotProve: "画面里的可选 MCP 超时不代表 Qwen 路线失败，也不证明列表中其他 Profile 当前可用。",
      observedAt: "2026-09-15",
      width: 1436,
      height: 1737,
      originalBytes: 276395,
      originalSha256: "47f48deac533f446265146975b66aa747f0f259804b563028be061e2b31350b3"
    },
    {
      src: "/media/ai-cli-profile-manager/03-cli-rule-loading.png",
      alt: "Qwen3.8 27B 在 Codex CLI 中读取活动规则与访问边界",
      caption: "CLI 任务先核对活动规则，再读取所需能力说明；命令、回执和阶段说明都保留在原生 Codex 工作流里。",
      evidenceLevel: "E3",
      evidenceLabel: "真实 CLI 使用画面",
      proves: "证明本地模型路线能继续使用 Codex 的命令执行与规则读取界面，而不是另造一套聊天壳。",
      doesNotProve: "截图中的规则文本只是该次任务内容，不表示网页访客获得相同的本机权限。",
      observedAt: "2026-09-15",
      width: 1436,
      height: 1737,
      originalBytes: 262864,
      originalSha256: "53f0a3c3fcb8869dd488c6f5f6d46eef54a8599a488614684292cf80b9032bad"
    },
    {
      src: "/media/ai-cli-profile-manager/04-cli-personal-access-check.png",
      alt: "Qwen3.8 27B 在 Codex CLI 中完成个人数据访问检查",
      caption: "同一 CLI 会话完成个人环境状态与 screen 级访问检查后，再调用对应能力查询所需资料。",
      evidenceLevel: "E3",
      evidenceLabel: "真实 CLI 使用画面",
      proves: "证明该次本地模型任务能够沿现有 Codex 工具与访问流程继续执行多步工作。",
      doesNotProve: "截图不授予新的访问权限，也不代表其他任务可跳过各自的检查。",
      observedAt: "2026-09-15",
      width: 1436,
      height: 1737,
      originalBytes: 281515,
      originalSha256: "f129afcef8686e9a9a7a44699edfd6378b40483d76089eade4852c657651a174"
    },
    {
      src: "/media/ai-cli-profile-manager/05-cli-preference-result.png",
      alt: "Qwen3.8 27B 在 Codex CLI 中返回中文偏好查询结果",
      caption: "CLI 最终把索引命中、资料读取和中文回答串成一条可见工作记录，展示本地 27B 模型处理长中文任务的实际结果。",
      evidenceLevel: "E3",
      evidenceLabel: "真实 CLI 使用画面",
      proves: "证明该次会话产出了结构清楚的中文结果，并保留了前置工具步骤与来源边界。",
      doesNotProve: "一次偏好查询不等于所有项目任务、所有上下文长度或长期连续性都已验收。",
      observedAt: "2026-09-15",
      width: 1436,
      height: 1737,
      originalBytes: 277343,
      originalSha256: "8e2c0e5a77c7bd64cd2ffa2eaafcb66d4742d74fc10efb04d72d2f14f10168e7"
    }
  ],
  components: [
    { name: "命令路由与中文帮助", responsibility: "把 setup、profile、start、run、doctor、test、proxy、update 和 uninstall 变成严格可预期的命令。", implementation: "CommandRouter.ps1、HelpService.ps1、ConsoleUi.ps1；未知参数与缺值返回固定退出码，不猜用户意图。" },
    { name: "Manifest、Profile 与秘密存储", responsibility: "分开产品模板、用户选择和明文秘密，阻止同名或损坏对象回退到错误模板。", implementation: "data/providers、schemas、ManifestService.ps1、ProfileService.ps1、JsonStore.ps1、SecretStore.ps1；Profile 指纹绑定最终选择。" },
    { name: "启动计划与引擎适配器", responsibility: "把一个已解析 Profile 变成可执行文件、参数、临时配置与子进程环境。", implementation: "LaunchPlan.ps1、CodexAdapter.ps1、ClaudeAdapter.ps1、InterpreterAdapter.ps1、QwenCodeAdapter.ps1、OpenCodeAdapter.ps1 与 ChildProcess.ps1。" },
    { name: "Doctor 与分层验收", responsibility: "区分静态条件、文本连通、隔离工具和真实 Agent 文件任务。", implementation: "DoctorService.ps1、LiveTestService.ps1、AgentAcceptance.ps1；状态闭集为通过、可用、可用但有限制、不可用。" },
    { name: "Codex app-server 与恢复控制面", responsibility: "管理完全访问的程序化 Codex 运行、公开事件、硬预算、同一任务身份恢复和最终清理。", implementation: "CodexAppServerBridge.ps1、RecoveryService.ps1、RecoverableRunController.ps1、PublicWebSearch.ps1 与 MachineRuntime.ps1。" },
    { name: "本地模型与第三方代理", responsibility: "使用既有 LocalGpuBroker/Ollama 端点，并管理 ccp / cliproxy 两个可选本地代理的受控生命周期。", implementation: "LocalGpuBrokerSession.ps1、ProxyService.ps1、PortAllocator.ps1、ProcessIdentity.ps1、managed-proxy-ports.json 与 approved-windows-artifacts.json。" },
    { name: "安装、更新、迁移与手册", responsibility: "在当前用户范围可恢复地装卸产品，并让用户按用途、命令、结果和错误顺序理解它。", implementation: "Install.ps1、Uninstall.ps1、Invoke-AiCliRetirementMigration.ps1、UpdateService.ps1、两本 canonical Markdown/PDF 与 VERIFIED-COMPATIBILITY.md。" }
  ],
  technicalContracts: [
    { artifact: "Provider Manifest", schema: "provider-manifest.schema.json", owner: "发行源码", boundary: "声明引擎、线路、模型、认证、能力和兼容；它本身没有执行能力。" },
    { artifact: "用户 Profile", schema: "user-profile.schema.json", owner: "%APPDATA%\\AiCliProfileManager", boundary: "保存模板选择和 SecretRef；损坏、同名冲突或精确身份漂移时失败关闭。" },
    { artifact: "代理运行状态", schema: "runtime-state.schema.json", owner: "%LOCALAPPDATA%\\AiCliProfileManager", boundary: "PID、路径、端口和启动时间必须重新核对后才能停止或更新。" },
    { artifact: "Doctor 结果", schema: "doctor-result.schema.json", owner: "本次命令", boundary: "稳定 check ID 与下一步，不包含秘密，也不冒充模型生成请求。" },
    { artifact: "可恢复 Codex run", schema: "aicli.recoverable-run.v1", owner: "%LOCALAPPDATA%\\AiCliProfileManager\\state\\recoverable-runs", boundary: "保存身份、游标、事件和回执，不保存任务正文、隐藏推理或工具载荷。" }
  ],
  usageExamples: [
    {
      "moduleSlug": "profiles-launch",
      "ask": "用官方 Codex 打开这个项目；先确认请求不会被旧的第三方设置改送别处。",
      "effect": "启动前展示实际程序、模型和数据去向，指出冲突的旧设置；确认后再开官方 Codex，保持它原来的登录。"
    },
    {
      "moduleSlug": "profiles-launch",
      "ask": "我在 OpenClaw 里已有 DeepSeek 设置，能把当前支持的那条配置带进 Codex 吗？先预览。",
      "effect": "先确认来源真属于 DeepSeek，再展示会新增什么；明确应用后只加入受支持的 DeepSeek Flash 配置，密钥保存在本机受保护位置，其他配置保留。"
    },
    {
      "moduleSlug": "profiles-launch",
      "ask": "删掉我不用的模型配置档；先告诉我还会影响哪些密钥或登录。",
      "effect": "先列出它和密钥的引用关系；只有没有其他配置再用那条本机密钥时才按所选范围清理，内置配置和官方登录保留。"
    },
    {
      "moduleSlug": "engines-providers",
      "ask": "这次精确用 Qwen3.8 Max Workspace；失败就报错，不要换 Qwen3.7、Token Plan 或本地模型。",
      "effect": "本次运行会绑定明确的模型、服务、地域、协议和思考档位；任一项不一致就停止，不自动换路线。"
    },
    {
      "moduleSlug": "engines-providers",
      "ask": "用第三方模型把这段工作做完，上下文快满时也别忘了目标、授权和别人未提交的改动。",
      "effect": "启动计划要求先把目标、已完成工作和限制写进原项目状态；对话压缩后重新读项目和未提交修改。管理器提供要求，不替模型自动做记录，也不把一次配置说成长任务已验。"
    },
    {
      "moduleSlug": "secrets-isolation",
      "ask": "复用同一个 DeepSeek Key，但不要让它出现在参数、日志或别的终端里。",
      "effect": "两个 Profile 只复用同一秘密引用，真正 Key 只在目标进程启动时短暂解开；查看计划和导出配方仍不显示明文。"
    },
    {
      "moduleSlug": "doctor-validation",
      "ask": "先检查这个 Profile 为什么不能用，不要现在发送付费请求。",
      "effect": "先说明缺的是程序、配置、凭据、服务还是旧证据；只有我随后明确选择真实测试，才发送模型请求。"
    },
    {
      "moduleSlug": "recoverable-runs",
      "ask": "这个 Codex 文件任务中断了；只有还能恢复同一个任务身份才继续，否则明确告诉我需要从头重跑。",
      "effect": "继续前会核对原任务、工作区、Profile、模型、服务和权限；任何身份变化都停止，不把旧输出拼进新任务。"
    },
    {
      "moduleSlug": "local-proxies",
      "ask": "先看看本地 Qwen 和两个 ChatGPT→Claude 代理现在是否真的可用，不要自动启动或升级。",
      "effect": "分别查看选中本地模型与两条代理是否已装、是否在运行、目标端口是谁；只报告当前状态，不启动、不更新，也不改投云端。"
    },
    {
      "moduleSlug": "install-recovery",
      "ask": "把已经核对的修复装到本机；以后普通卸载保留我的配置和密钥。",
      "effect": "先检查旧版与未知文件，再安装可回退候选；普通卸载保留本机配置，彻底清理与远端账号授权撤销须分开办理。"
    },
    {
      "moduleSlug": "native-desktop-integration",
      "ask": "我想继续用官方 Codex 桌面，但这次明确用已接通的本地模型，不要另开一套聊天界面。",
      "effect": "从当前桌面接入选择已登记模型，新任务继续使用原生工具和历史；安装登记、当前桌面进程实际加载与真实模型任务分别核对，不把其中一层成功冒充全部切换完成。"
    },
    {
      "moduleSlug": "background-openai-children",
      "ask": "让这个 GLM 或 DeepSeek 父任务和同一个 OpenAI 子会话持续协作，过程中能追问和回复，不要每次另开新会话。",
      "effect": "在本轮已允许的模型与任务范围内，父任务继续做自己的部分；子会话沿同一身份报告、提问和接收回复，最后由父任务核对结果。"
    }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "PUBLIC main bbaaa9d 包含 0.3.18 CLI、原生桌面、后台子会话、双档判断与许可诊断；Gemini consumer 接入保持冻结。", doesNotProve: "本机已安装相同字节、当前 CLI 协议仍兼容、模型能调用或网页已发布。" },
    { layer: "Tests（自动回归）", proves: "9月3日最终main的385项Pester和离线发行检查通过，包括损坏 Profile 拒绝、恢复协议、秘密脱敏、Junction 兼容与发行命令面。", doesNotProve: "真实账号、Provider、OAuth、GPU 模型或长期进程当前可用。" },
    { layer: "Install（安装态）", proves: "只有原子安装后逐文件回读与固定 aicli 入口测试，才能证明这台机器实际运行的是最终源码。", doesNotProve: "某个云端模型、代理或本地服务已经 Live 通过。" },
    { layer: "Doctor 与 Runtime（运行条件）", proves: "当前 Windows、PowerShell、CLI 版本、父环境、代理状态和 Ollama 端点能被真实读取。", doesNotProve: "Doctor 不发模型请求；依赖存在也不等于一个 Agent 任务完成。" },
    { layer: "Live 与 Agent 验收", proves: "同版本、同 Profile 指纹、同实际模型/Provider/权限下的文本、工具或确定性文件任务在观察时通过。", doesNotProve: "旧回执不能覆盖新 CLI；一个 Profile 也不能代表所有模型、账号或未来运行。" },
    { layer: "Git 与网页发布", proves: "远端 main 回读证明源提交公开；Pages 部署回读只证明这份项目说明上线。", doesNotProve: "源码 Git、安装、模型 Live、网页和最终业务任务彼此不能替代。" }
  ],
  operationalEntrypoints: [
    { name: "从源码查看版本", command: "pwsh -NoProfile -File .\\bin\\aicli.ps1 version", purpose: "不安装即可核对源码入口的 0.3.18 产品版本；它不证明桌面进程或模型任务使用哪份发行。" },
    { name: "Profile 完整生命周期", command: "aicli profile <list|show|configure|set-default|remove> [...]", purpose: "查看、配置、设默认或删除用户 Profile；remove 默认确认，最后 SecretRef 的 DPAPI 密文与官方登录分别处理。" },
    { name: "从 OpenClaw 预览或导入", command: "pwsh -File .\\scripts\\Import-FromOpenClaw.ps1 [-Apply] [-Force]", purpose: "默认零写入预览；只从api.deepseek.com来源导入codex-deepseek-flash，Key立即进入DPAPI。" },
    { name: "看启动计划", command: "aicli native <Profile ID>", purpose: "在不启动模型的情况下查看脱敏可执行文件、参数、环境差异和数据去向。" },
    { name: "静态体检", command: "aicli doctor [Profile ID] --json", purpose: "不消耗模型额度；按 check ID 说明通过、限制、失败和下一步。" },
    { name: "显式真实验收", command: "aicli test <Profile ID> --live --level <text|tool|agent|all> --yes --json", purpose: "可能联网、耗额度或执行工具；agent 只支持 Codex，all 不包含 agent。" },
    { name: "启动可恢复 Codex 任务", command: "$task | aicli run start <Profile ID> --stdin --json --project <path> --background", purpose: "返回 run id；随后用 status / resume / abort 管理同一任务。" },
    { name: "代理完整生命周期", command: "aicli proxy <ccp|cliproxy> <install|login|logout|configure|start|stop|status|update-check|update|native> [...]", purpose: "两个第三方代理分别管理；update 对已安装版本仍会安全拒绝，本地 logout/purge 不冒充远程撤销。" },
    { name: "同渠道更新检查", command: "aicli update <check|guide> [codex|claude|ollama|interpreter|ccp|cliproxy|self] [--json]", purpose: "识别实际安装来源并给同渠道指引，不静默更新上游。" },
    { name: "安装当前源码", command: "pwsh -NoProfile -File .\\scripts\\Install.ps1 -Force", purpose: "先预检退役对象和验证候选，再在当前用户模块目录原子替换同版本。" },
    { name: "卸载或彻底清理", command: "aicli uninstall [--purge-user-data] [--yes]", purpose: "普通卸载保留 Profile、DPAPI 密文和代理数据；purge 才删除本工具数据，上游 CLI、模型与远程 OAuth 仍是独立生命周期。" },
    { name: "退出码合同", command: "0=成功 · 2=用法错误 · 3=可用但有限制 · 4=不可用 · 5=内部错误 · 6=用户取消", purpose: "脚本可以根据稳定结果分支，不能把 Limited 或 Unavailable 当成功。" },
    { name: "离线发行检查", command: "pwsh -NoProfile -File .\\scripts\\Test-Release.ps1", purpose: "验证核心命令、文档、安装包面与失败语义，不发付费 Live。" }
  ],
  evolution: [
    {
      "date": "2026-07",
      "title": "先把“用谁、发到哪里”说清",
      "commit": "",
      "result": "把程序、模型、提供方和秘密注入组合为明确配置档，原生命令行仍负责交互；检查配置与实际调用分开。",
      "evidence": [
        {
          "date": "2026-07-13—2026-07-14",
          "note": "0.1.0发行阶段：当前用户安装、Profile和秘密隔离、原生工具与分层诊断。",
          "commit": "0.1.0"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "从能启动，走向知道实际用了谁",
      "result": "模型、服务线路、上下文容量和运行权限必须按真实结果说明；本地与外部选择保留各自身份，不因接口兼容就悄悄换成另一个模型。",
      "evidence": [
        {
          "date": "2026-07-28—2026-08-03",
          "note": "0.3.3：模型身份、第三方上下文与独立执行配置。",
          "commit": "0.3.3"
        },
        {
          "date": "2026-08-13—2026-08-15",
          "note": "0.3.5–0.3.10：精确模型、本地27B与实际权限和事件兼容。",
          "commit": "0.3.5—0.3.10"
        }
      ]
    },
    {
      "date": "2026-08",
      "title": "长任务可以接续，而不是重来",
      "commit": "",
      "result": "程序化运行保留任务身份、进度和结果；中断时先查已有执行，模型和权限按真实回执核对，不靠任务标题猜。",
      "evidence": [
        {
          "date": "2026-08-15",
          "note": "0.3.11–0.3.12：同一任务身份可恢复的程序化运行和独立文件结果验收。",
          "commit": "0.3.11—0.3.12"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "title": "安装和更换配置不丢原有工作",
      "commit": "",
      "result": "同用户安装、更新、卸载与退役恢复有预检及回退，坏配置不静默退回另一模型；中文说明与当前兼容范围一起维护。",
      "evidence": [
        {
          "date": "2026-08-28—2026-08-30",
          "note": "安装切换可退回，坏Profile不再静默回退到另一配置。",
          "commit": "3eb9e69—255c300"
        },
        {
          "date": "2026-09-03",
          "note": "真实运行根与兼容目录分开，未知对象在退役前停止。",
          "commit": "88f72e6"
        }
      ]
    },
    {
      "date": "2026-09",
      "title": "原生桌面也能使用选定模型",
      "commit": "",
      "result": "从命令行扩展到官方 Codex 桌面，保留工具与历史；本地模型切换、升级兼容和旧发行回退分别验证，已经运行的进程不自动变成新发行。"
    },
    {
      "date": "2026-09-18",
      "title": "协作不必每次从零另开对话",
      "commit": "37c7d47",
      "result": "GLM／DeepSeek 可以和同一个 OpenAI 子会话持续往返；补齐参数错误纠正、只读诊断和精确取消。源码、安装、当前进程与真实新分支调用仍分别给结论。"
    },
    {
      "date": "2026-09-22—09-23",
      "title": "正式升级后把协作许可和判断范围说清",
      "result": "0.3.18 正式发行和安装；桌面增加常规 Sol 与重大后果 Astra 的独立判断入口，首次 Luna 委派遇到未登记许可会说清可补的原因。旧桌面窗口不会因安装而自动换版，真实加载继续按现场判断。",
      "evidence": [
        { "date": "2026-09-22", "note": "0.3.18 发行、CurrentUser 安装与双档桌面桥", "commit": "fa383a2–ff4afea" },
        { "date": "2026-09-23", "note": "首次 Luna 许可诊断与既有子会话续核", "commit": "56524f9–bbaaa9d" }
      ]
    }
  ],
  snapshotUpdateNote: "2026-09-24T04:49Z 读回 PUBLIC main bbaaa9d，源码 version=0.3.18、本机 CurrentUser 0.3.18 模块目录和桌面 state.json 的 562b29bf4a6ac0af 启用目标；Owner §§25.8–25.10、28 记录受保护桥登记、发行与安装。GLM/DeepSeek 既有后台子会话仍按 9 月 18 日实际验收日期，画廊保留 9 月 15 日原图；本网页未运行新模型、重启 GUI 或把旧会话验收当作新版加载。",
  "readerBoundary": "配置档存在、程序已安装、桌面正在运行和模型真的完成任务是四种状态。装好新版后，旧窗口不一定已经切换；Gemini 这条接入已冻结，不能当作当前可用路线。",
  "operatingChoices": {
    "title": "先选工作方式，再看模型和数据去向",
    "intro": "先决定在终端、官方 Codex 桌面还是后台做事，再选模型和数据去向。每项都写明能得到什么；具体是否已连通仍看当前状态。",
    "rows": [
      {
        "need": "在原生命令行里做项目",
        "choice": "查看配置档并用 aicli start 启动原生工具",
        "result": "打开所选 Codex、Claude Code、Qwen Code、OpenCode 或受支持的 Open Interpreter。",
        "boundary": "不同程序各有实际兼容范围，不从一个入口成功推断全部可用。"
      },
      {
        "need": "继续用官方 Codex 桌面和任务历史",
        "choice": "原生桌面接入",
        "result": "在现有桌面中使用已接通的模型与工具，不另造聊天外壳。",
        "boundary": "按实际发行与进程加载情况检查，不能只看安装完成。"
      },
      {
        "need": "让额外模型持续帮同一件事",
        "choice": "获准的父任务邀请 OpenAI 子会话协作",
        "result": "父任务继续工作，子会话可报告进度、提问并沿同一会话接收回复。",
        "boundary": "需要相应许可；这是持续子会话，不冒充原生代理卡片。"
      },
      {
        "need": "把明确任务交给脚本运行，稍后取结果",
        "choice": "用 aicli run 发起可追踪的后台任务",
        "result": "拿到任务编号、进度、结果和中断时原任务的状态。",
        "boundary": "收到取消请求不等于已经停止，进程和资源释放另验。"
      },
      {
        "need": "先检查配置，不发送模型请求",
        "choice": "先看不发请求的静态体检与启动预览",
        "result": "知道程序、模型和登录条件缺什么，再决定是否做真实调用。",
        "boundary": "诊断正常不等于真实模型已完成任务。"
      },
      {
        "need": "使用本机模型，不把材料交给外部模型服务",
        "choice": "Qwen3.8 27B、Qwen3.6 35B，以及各自去限制版。",
        "result": "在实际支持的原生入口选择对应模型，保留选定身份；27B是当前共同默认，35B是明确的另一选择。",
        "boundary": "配置同步不等于每个客户端都已实测；35B去限制版不支持视觉，不能从其他版本继承能力。"
      },
      {
        "need": "明确使用现有第三方云端编码配置",
        "choice": "Qwen3.7 Max 06-08、Qwen3.8 Max 0902、GLM-5.3／Flash、DeepSeek Flash。",
        "result": "把本次模型请求交给选定提供方，继续保留原生工作台的工具与任务。",
        "boundary": "只用各自已登记的确切入口；DeepSeek V4 Pro仅为独立CLI配置，不在桌面菜单，Gemini路线不在可用清单。"
      }
    ]
  },
};

export const aiCliProfileManagerModules = [
  {
    slug: "profiles-launch", shortTitle: "配置档与启动", title: "先看清这次要启动谁，再打开原生 CLI",
    usageEntry: "在可信项目目录打开 PowerShell，先运行 aicli profile list/show，再用 aicli native 预览、aicli start 启动。",
    usageInputs: ["项目目录", "要用的引擎和 Profile", "模型与数据去向偏好"],
    productFlow: [
      {
        "title": "把配置档展开为真实程序",
        "detail": "工具显示这次会启动 Codex、Claude 等哪一个原生程序、选哪个模型、请求送到哪里。"
      },
      {
        "title": "看清启动计划",
        "detail": "native 展示真正要启动的程序和环境差异，避免官方登录误走第三方。"
      },
      {
        "title": "进入原生工具",
        "detail": "aicli start 在当前项目启动原来的 AI 编程工具；若配置有问题，先查看启动预览或运行静态体检（Doctor）。"
      }
    ],
    searchAliases: ["aicli怎么开始", "Profile配置", "启动Codex不污染官方登录", "从OpenClaw导入DeepSeek", "删除Profile保留官方登录", "native查看启动计划", "eject导出", "项目目录"],
    searchProjection: { intents: ["配置一个AI命令行入口", "从OpenClaw预览导入", "删除或设默认Profile", "启动原生CLI", "查看数据去向", "导出独立配方"], entities: ["aicli setup", "profile show", "profile set-default", "profile remove", "Import-FromOpenClaw.ps1", "start", "native", "eject", "LaunchPlan"], relations: ["Manifest生成Profile", "OpenClaw预览后显式应用", "Profile生成启动计划", "双横线后参数交给上游"], failureRecovery: ["未知来源拒绝导入", "未知参数立即拒绝", "目录不存在停止", "输出目录存在不覆盖", "冲突配置不透传"] },
    teaser: "Profile 保存选择，LaunchPlan 只服务本次进程；聊天仍在原生工具里。",
    status: "命令、Profile 与启动计划已实现；当前源码回归通过", statusTone: "pass",
    value: "把“这次开哪个 AI 编程工具、用哪个模型、请求去哪里”保存成能预览的配置档。确认后启动原来的工具；必要时可删除配置或导出不含密码的启动说明。",
    why: "电脑上多个 AI 编程工具和模型服务可能互相串线，官方登录也可能被旧设置送到第三方。启动前先看清要开哪个程序、模型和请求去向，选择只影响这次新进程。",
    example: "“这个项目继续用我已经选好的配置，不要改我的全局默认；先让我知道会启动哪个程序、请求去哪里。”先预览实际入口，再启动相同配置。进入原生程序后，权限与任务行为仍由它自己的真实能力决定。",
    result: "拿到清楚的启动预览，确认后在指定项目打开原来的 AI 编程工具；也可以导出不含密钥的独立启动说明。本工具不接管原工具的聊天历史。",
    readerStates: {
      "pass": "项目目录和配置档有效，启动计划显示的程序与实际启动一致。",
      "problem": "旧环境可能把官方请求改送别处时，体检会指出冲突，不偷偷改原配置。",
      "unavailable": "配置档损坏、目录不存在或参数要偷换模型时拒绝启动，不猜替代路线。"
    },
    decisionImpact: ["切换 Profile 只对新进程生效，不能在已经打开的会话中热换 Provider。", "profile remove 默认确认；删除最后一个引用某秘密的用户 Profile 时会删除对应 DPAPI 密文，但不会删除上游官方登录。", "OpenClaw 导入默认只预览；只有 -Apply 才写 Profile，已有同名项还需 -Force 才替换。", "machine-only 的 Qwen Code / OpenCode 路线不提供交互式 start。", "eject 不带 Key 或 OAuth；它给的是理解和迁移入口，不是秘密备份。"],
    problem: "防止官方登录与第三方 API 串线，也让用户在使用前能回答“到底会启动什么、数据去哪”。",
    implementation: ["CommandRouter.ps1 严格解析命令、值选项和双横线后的原生参数。", "ProfileService 实现 list/show/configure/set-default/remove；删除最后 SecretRef 引用时只删本工具的 DPAPI 密文。损坏对象不会回退到同名模板。", "Import-FromOpenClaw.ps1读取一个明确JSON并验证来源；默认预览，-Apply只导入当前codex-deepseek-flash，把Key转入DPAPI。旧Codex Flash/Pro、Claude、OI四目标导入已经被此单目标入口替代。", "OpenClaw 导入只接受能由 api.deepseek.com 主机名证明的 DeepSeek 来源；Qwen3.7、未知或 OpenAI Base URL 被拒绝。", "LaunchPlan.ps1 使用 ProcessStartInfo.ArgumentList 形态组织可执行文件、参数、工作目录和环境差异；native 脱敏，eject 只写无秘密配方并拒绝覆盖已有目录。"],
    flow: ["运行 setup 或 profile list --available。", "已有 OpenClaw DeepSeek 配置时先运行导入脚本预览，确认后才加 -Apply；否则直接 configure。", "用 profile show 核对引擎、模型、数据去向和状态，并按需运行 profile set-default。", "用 native 查看本次启动计划。", "用 start 在可信项目目录启动原生 CLI，或用 eject 导出。", "不再需要某个用户 Profile 时运行 profile remove 并确认将保留或删除什么。"],
    concepts: [{ term: "LaunchPlan（启动计划）", explanation: "本次进程的可执行文件、参数、工作目录和环境增删；不是永久全局配置。" }, { term: "OpenClaw preview/apply（导入预览/应用）", explanation: "先只显示将生成哪些 DeepSeek Profile，显式 -Apply 后才写入；不会导入 Qwen3.7。" }, { term: "native（原生计划查看）", explanation: "展示 aicli 最终要怎样启动上游，但不执行模型请求。" }, { term: "eject（导出脱离）", explanation: "生成可理解的无秘密配方，让用户不依赖 aicli 也能重建入口。" }],
    boundaries: ["不提供自己的聊天 UI 或会话数据库。", "不覆盖上游基础 config.toml、settings.json 或官方登录。", "OpenClaw 导入不读取任意 Provider；默认预览不写入，同名 Profile 不带 -Force 不替换。", "不把 machine-only Profile 伪装成交互式入口。"],
    failures: [{ condition: "用户 Profile JSON 损坏或根节点不是对象", response: "当前 main 失败关闭并返回不可用；不静默使用同名内置模板。" }, { condition: "OpenClaw 来源不是 api.deepseek.com、结构未知或是 Qwen3.7", response: "拒绝导入，不把一个服务的 Key 发给另一个 host，也不生成假 Profile。" }, { condition: "原生参数覆盖 Provider、模型或配置", response: "在启动前拒绝，并保留 Profile 的精确身份。" }, { condition: "eject 目标已有内容", response: "拒绝覆盖，要求选择一个新目录。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\CommandRouter.ps1", role: "命令解析与退出码" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\ProfileService.ps1", role: "用户 Profile、SecretRef 与删除生命周期" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\scripts\\Import-FromOpenClaw.ps1", role: "DeepSeek 配置预览、应用与来源拒绝" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\LaunchPlan.ps1", role: "计划、native 与 eject" }],
    verification: ["9月3日385项Pester覆盖当时的路由、Profile生命周期、参数和导出；9月17日Owner又完成442项源码回归。两者按对应来源保存，不声称网页本轮重新执行。", "离线发行检查实际执行 version、list/show、native、eject 和错误退出码。", "本轮未用 start 打开交互会话，也未对真实 OpenClaw 私有配置执行 -Apply。"],
    relation: "本模块决定怎样进入原生工具；引擎模块定义可选身份，秘密模块定义凭据怎样到达目标进程。",
    readerStatus: "已有选择配置、查看启动计划并打开原生程序的功能；本轮源码检查通过，具体模型任务仍按实际运行确认。"
  },
  {
    slug: "engines-providers", shortTitle: "模型引擎与服务方", title: "同一个模型名不够，线路、版本和有效档位也必须一致",
    usageEntry: "在 aicli profile list/show 中选择明确 Profile；若要换模型，先核对该 Profile 的服务地域、协议和档位。",
    usageInputs: ["模型的具体版本或 Profile 名", "服务与费用限制", "项目目录"],
    productFlow: [
      {
        "title": "核对模型背后的服务",
        "detail": "系统检查具体版本、收费线路和请求目的地；只知道模型简称还不能确定这次在用谁。"
      },
      {
        "title": "预览后核对真实身份",
        "detail": "启动前检查配置档；长任务如果经历对话压缩，先保存已完成工作和限制，再从原项目继续。"
      },
      {
        "title": "拿到这一条线路的结果",
        "detail": "说明实际用了哪个模型和服务；配置档列在目录里不等于它现在能连通，跨服务使用要开新任务。"
      }
    ],
    searchAliases: ["支持哪些AI CLI", "Qwen3.8精确Profile", "DeepSeek Codex", "不自动fallback", "Responses Provider", "machine-only"],
    searchProjection: { intents: ["选择一个精确模型入口", "比较交互和机器路线", "避免失败后换模型", "查看未开放路线"], entities: ["Codex", "Claude Code", "Rust Open Interpreter", "Qwen Code", "OpenCode", "Responses"], relations: ["Profile绑定Provider和模型", "requested effort映射effective effort", "公开与machine-only分组"], failureRecovery: ["模型覆盖拒绝", "旧Profile不迁移", "Chat端点不冒充Responses", "新上游模型不自动开放"] },
    teaser: "五类 CLI 共用一个入口，但不会被抹平成同一种能力。",
    status: "23个公开Profile；云端、本地、桌面与程序化证据分别说明", statusTone: "mixed",
    value: "官方、本地与第三方模型各自对应明确版本、服务和费用线路；用一个名字不能替代这次真实身份。长任务的续作要求会写进启动计划，实际是否遵守仍需任务验收。",
    why: "“支持 Qwen”或“支持 DeepSeek”太模糊：别名、版本、计费线路和协议不同，实际行为和费用都可能不同。产品只开放经过明确设计的组合。",
    example: "“这次用我明确选择的Qwen3.8 Max服务，失败就说明原因，不换成便宜型号、本地模型或另一个套餐。”配置同时绑定模型、服务地域、协议和推理设置；技术层列出各配置档的精确身份。",
    result: "启动前知道确切模型、服务线路、费用类别和实际思考档位；若长任务经历对话压缩，AI 须先留好已完成工作和限制，之后再从原项目恢复。工具会给出这项要求，但不能宣称模型已经照做。",
    readerStates: {
      "pass": "配置档、模型和真实启动身份一致时，说明这一次选中的路线。",
      "problem": "模型或服务换版、旧证据失效时指出该路线需重新确认。",
      "unavailable": "未登记版本、已退役配置或请求要覆盖选定模型时拒绝，不自动换到别家。"
    },
    decisionImpact: ["Codex、Claude Code、Open Interpreter 的协议和权限不同，不能只换模型名。", "Qwen Code / OpenCode 当前公开本地路线是 machine-only（仅程序化运行）。", "Open Interpreter 只支持当前 Rust 0.0.21+ 世代；旧 Python 0.4.x 会由 Doctor 识别并拒绝，云端 Key 还会从它的 Shell（命令执行环境）工具环境中排除。", "DeepSeek Flash当前使用支持图像的deepseek-flash稳定ID；V4 Pro只保留独立CLI Profile。GLM-5.3与Flash、Qwen0902和四个本地模型各自绑定准确目录，不把品牌名当身份。"],
    problem: "防止模糊品牌名掩盖实际请求路径，或失败时把另一个模型的输出冒充用户原先选择。",
    implementation: ["已发布data/providers有25个Manifest（配置清单），其中2个内部模板不公开，以下23个是当前可选入口。配置状态、源码实现、安装、实际进程、Live（真实调用）和恢复证据分别判断；9月3日旧配置数量不是今天的现场。","Codex第三方入口绑定Responses（响应式模型协议）、Provider、精确模型目录和数据去向，冲突或fallback在计划生成前拒绝。DeepSeek Flash使用官方稳定ID；它随上游更新，不以网页中的V4.1标签人为冻结服务版本。","ContextManagement.ps1的Get-AiCliThirdPartyContinuityPolicy只覆盖第三方codex/claude/opencode；codex+openai、claude+anthropic及其他引擎返回null。Add-AiCliThirdPartyContinuityPolicy实际把aicli.third-party-continuity.v1附到LaunchPlan.continuityPolicy和notes：mode=loss-aware、manualCompaction=defer-until-window-pressure、oneMilestonePerSession=true，提示会话聚焦内聚里程碑、等窗口压力再考虑手动压缩。它没有自动写checkpoint或运行压缩的执行器。","preCompactionCheckpoint要求目标和验收、约束/授权/owner、规则与关键文件、changed-files-and-dirty-ownership、决定及理由、tests-and-live-gaps、阻塞风险和下一步写到existing-project-state。postCompactionRead重读AGENTS.md或CLAUDE.md、已有状态、git status和git diff；summaryIsHint=true、restoreFromSource=true、secondFactSource=false。摘要只提供找回原件的线索，不另建状态库。","两个Qwen云端Codex目录的context_window/max_context_window均为983616，effective_context_window_percent=95，auto_compact_token_limit=885254、scope=total，即最大窗口90%。3.7固定06-08，3.8固定qwen3.8-max-0902；max映射xhigh。GLM两条目录固定1048576上下文、943718自动压缩阈值，使用中国区编码套餐Responses接口。","OpenCode当前主入口与27B兼容入口都使用qwen3.8-27b:256k，context/input=262144、output=32768；reserve=20000、preserveRecent=16384、tailTurns=4和prune=false仍用于一次性运行配置。缺模型元数据时不猜容量。","第三方Claude只为已知modelMetadata设置CLAUDE_CODE_MAX_CONTEXT_TOKENS与CLAUDE_CODE_AUTO_COMPACT_WINDOW；清除提前百分比覆盖与DISABLE_AUTO_COMPACT/DISABLE_COMPACT，不禁用溢出保护。未知模型还会清除继承的窗口与压缩控制，保留Claude自身默认。Codex exact resume证明同一任务身份，和这份有损压缩后的项目连续性策略分别验收。","codex-official｜Codex/OpenAI/gpt-5.6-sol默认Profile，官方登录、high；原生交互与程序化恢复。这个模板默认不代表系统或本轮网页任务的永久型号上限；没有本轮全量Live。","codex-qwen3-7-max-paygo｜qwen3.7-max-2026-06-08，北京Workspace按量Responses；max→xhigh。交互和程序化身份明确；旧回执仅按原日期保存，本轮未发Qwen请求。","codex-qwen3-8-max-paygo｜qwen3.8-max-0902，北京Workspace按量Responses，max→xhigh。旧qwen3.8-max泛名不再作为当前模型身份；本轮未发真实请求。","codex-glm-5-3｜glm-5.3，中国区编码套餐，https://open.bigmodel.cn/api/v1，Responses，max，文本模型。Owner9月18日已完成该类桌面父任务与Luna High同一后台子会话的真实闭环，不外推为所有CLI任务通过。","codex-glm-5-3-flash｜glm-5.3-flash，同一中国区套餐与Responses端点，max，支持图像。它是独立模型入口，不能借GLM-5.3父任务验收当作自己的Live。","codex-deepseek-flash｜deepseek-flash，https://api.deepseek.com，Responses，max，支持图像，当前官方标识为V4.1 Flash。Owner9月18日已完成DeepSeek桌面父任务与同一Luna High子会话的3轮往返；不是全部用法的保证。","codex-deepseek-v4-pro｜deepseek-v4-pro，DeepSeek Responses，max，不支持图像；只保留独立CLI Profile，不进入当前桌面主菜单，也不由OpenClaw导入。","codex-ollama-main｜qwen3.8-27b:256k，LocalGpuBroker 127.0.0.1:32100/v1，max、256K。官方27B Q4_K_M；9月15日真实桌面与CLI画面按原日期保留，网页没有再跑GPU任务。","codex-ollama-review｜qwen3.6-35b:256k，受管Broker，max、256K，原生输出窗口8192。它是显式交叉入口；AICLI桌面接入不证明Toolkit该路线已经通过自己的Agent验收。","codex-ollama-qwen3-8-27b｜与主入口相同的qwen3.8-27b:256k明确兼容Profile，不是另一模型，也不借旧2026-08-14 artifact回执变成新调用。","codex-ollama-qwen3-6-35b-abliterated｜qwen3.6-35b-abliterated:256k，受管Broker、max、256K，不支持图像；显式选择，不是普通35B失败后的备用。","codex-ollama-qwen3-8-27b-abliterated｜qwen3.8-27b-abliterated:256k，受管Broker、max、256K，支持图像；独立权重身份与观察证据。","codex-spark-xhigh｜gpt-5.3-codex-spark，官方登录、xhigh，不支持图像。历史专项文件任务2/9与步骤硬停按原条件保留，不作为默认或自动推荐；本轮未重验。","claude-official｜Claude Code/Anthropic官方登录，不固定用户上游模型；Profile默认high。一次性运行不等于Codex精确恢复；2.1.270与历史401分别保留原日期，本轮未验证登录。","claude-custom｜用户明确选择的Anthropic Messages模型与端点，API Key；没有默认模型，不支持任意Codex协议。必须按该配置自己验证，旧未配置观察不代表今天永久不可用。","claude-ollama｜通用qwen3:8b、127.0.0.1:11434模板；9月14日该默认端点不可达。本轮未启动它，不能把这一结果写成所有受管本地模型离线。","claude-ollama-main｜qwen3.8-27b:256k、受管Broker 127.0.0.1:32100；模型窗口262144、输出32768。配置已统一不表示Claude工具和当前任务验收完成。","claude-chatgpt-ccp｜第三方raine claude-code-proxy、gpt-5.6-sol、high、代理OAuth；9月14日安装但未运行，旧Profile未配置。不是OpenAI/Anthropic官方通道，本轮未登录或验收。","claude-chatgpt-cliproxy｜第三方CLIProxyAPI、gpt-5.6-sol、high、代理OAuth；9月14日安装未运行，旧Profile已配置。代理状态和账号授权单独判断，不自动接管另一通道。","oi-ollama｜当前Rust Open Interpreter，qwen3-coder:30b、127.0.0.1:11434/v1；一次性运行，不支持Codex精确恢复；旧Rust0.0.40观察及通用端点限制保留原日期。","qwen-code-ollama-main｜Qwen Code、qwen3.8-27b:256k、受管Broker；machine-only（仅程序化运行），不是交互式start入口；模型元数据不代替该CLI实际图片或工具能力。","opencode-ollama-main｜OpenCode、qwen3.8-27b:256k、受管Broker；machine-only，262144上下文、32768输出。配置同步不等于当前路线已经完成真实任务。","opencode-ollama-qwen3-8-27b｜同一27B的明确兼容Profile，machine-only，窗口与主入口一致；历史pure配置回读不升级为新的Live。","已退出当前模板的codex-deepseek、claude-deepseek、oi-deepseek不再列为可选入口；旧V4 Flash及旧Qwen泛名不自动迁移为一次已验证的新身份。OpenClaw现在只导入codex-deepseek-flash。"],
    flow: ["从23个公开Profile按引擎、模型、数据去向和证据日期选择；只有需要的第三方入口才配置SecretRef。", "生成精确模型目录与启动计划，检查模型、Provider、有效effort；官方OpenAI/Anthropic原生路线不附第三方压缩策略。", "第三方codex/claude/opencode接近窗口压力时，上层AI先把目标与验收、授权/owner、规则关键文件、改动与dirty归属、决定理由、测试/Live缺口、阻塞风险和下一步写到项目已有状态。", "压缩后把摘要当线索，重新读AGENTS.md或CLAUDE.md、已有项目状态、git status与git diff；状态缺失或矛盾时先核对原文件，不把摘要升级为第二事实源。", "继续原目标并验收实际产物；启动计划附策略只证明配置已携带要求，真实压缩前落盘、压缩后恢复和长任务结果需要独立运行证据。"],
    concepts: [{ term: "Responses（响应式模型协议）", explanation: "当前 Codex 第三方 Provider 使用的上游协议；普通 Chat Completions 不能只改 URL 伪装成它。" }, { term: "requested/effective effort（请求/有效思考档）", explanation: "用户选择的统一档位与供应商实际接受的档位；例如 Qwen 的 max 映射 xhigh。" }, { term: "machine-only（仅程序化运行）", explanation: "可由 aicli run 调用，但不作为日常交互式 start 入口。" }],
    boundaries: ["continuityPolicy是启动计划实际携带的工作要求，不是自动保存checkpoint、无损摘要或长任务已成功的证明。官方OpenAI Codex/Anthropic Claude不受这份第三方策略改写。", "不宣称23个Profile当前全部Live可用；两个桌面父子链、图片声明与各CLI任务分别验收。", "不开放任意自定义 Codex Provider 为公共一键模板。", "不支持旧 Python Open Interpreter 0.4.x，也不把 Rust 版的权限语义套到其他 CLI。", "不因上游文档出现新模型就自动扩大产品范围。"],
    failures: [{ condition: "模型、Provider 或 endpoint 漂移", response: "指纹与计划拒绝，要求重新配置和验收。" }, { condition: "旧 Qwen3.7 或 fallback 参数", response: "命中退役门并停止，不重路由到 06-08 或 Qwen3.8。" }, { condition: "检测到旧 Python Open Interpreter 0.4.x", response: "Doctor 标为不支持，并给出当前 Rust 安装方向；不走旧参数兼容层。" }, { condition: "不同引擎能力不等价", response: "在对应适配器保留实际权限、工具和恢复边界，不伪装统一。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\ContextManagement.ps1", role: "第三方连续性计划、压缩前后项目状态与Claude窗口边界" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\tests\\Unit\\ContextManagement.Tests.ps1", role: "七项合成策略与原生基线回归" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\data\\providers", role: "无执行能力的 Provider Manifest" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\data\\model-catalogs", role: "精确 Codex 模型目录" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\ManifestService.ps1", role: "公开过滤、schema 与退役门" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\docs\\compatibility\\VERIFIED-COMPATIBILITY.md", role: "按指纹分层的最后验证矩阵" }],
    verification: ["2026-09-08T08:55Z原生ContextManagement.Tests.ps1七项合成回归通过，覆盖实际LaunchPlan附策略、原生基线不变、Claude已知/未知处理与OpenCode限制传入。没有创建模型run或触发真实压缩。", "9月18日从已发布main读取25份模板、23个公开入口及准确模型目录；没有把旧安装态Profile数量当作当前现场。", "全量回归覆盖 exact Qwen/DeepSeek、本地模型、hidden 模板与模型覆盖拒绝。", "官方资料核对确认 Responses、自定义 Provider 与上游新增项；没有把新增项写成 AICLI 已实现。"],
    relation: "本模块回答能选什么、第三方窗口怎样配置，以及压缩前后怎样靠项目状态继续；配置档模块负责启动，验证模块分别核对真实模型与长任务行为。",
    readerStatus: "已有23个公开配置档，可区分服务、模型和运行方式；配置存在不代表每条云端或本地路线本轮都已实测。"
  },
  {
    slug: "secrets-isolation", shortTitle: "秘密与隔离", title: "配置可以复用，明文秘密只在目标进程需要时出现",
    usageEntry: "在本机 aicli configure 中为点名的第三方 Profile 无回显录入 Key，随后用该 Profile 启动目标进程。",
    usageInputs: ["需要凭据的具体服务和 Profile", "当前设备上的受保护保存位置"],
    productFlow: [
      { title: "只配置这条线路", detail: "选需凭据的模板并确认目标服务，不把 Key 写进命令行或聊天。" },
      { title: "启动时才交给程序", detail: "本机密文保存引用，目标进程启动时短时取得所需值，父终端保持原样。" },
      { title: "分开核对结果", detail: "配置已保存、服务能连接与模型真正完成任务分别说明；卸载本地资料也不会自动撤销远程授权。" },
    ],
    searchAliases: ["API Key怎么保存", "SecretRef", "DPAPI", "环境变量隔离", "官方登录被劫持", "profile show不泄密"],
    searchProjection: { intents: ["安全保存API Key", "避免全局环境污染", "复用同域秘密", "查看脱敏数据去向"], entities: ["DPAPI", "SecretRef", "EnvironmentDelta", "profile show", "native", "auth.json"], relations: ["Profile只存引用", "目标进程收到必要变量", "官方登录与第三方Key分开"], failureRecovery: ["存储失败不退明文", "跨域复用拒绝", "日志和导出脱敏", "未知配置不覆盖"] },
    teaser: "秘密存储、Profile 与启动环境是三个对象，不把 Key 塞进配置文本。",
    status: "DPAPI、SecretRef、环境重建与脱敏回归通过", statusTone: "pass",
    value: "第三方服务的密钥只保存在本机受保护位置，启动选中的程序时才交给它；聊天、启动预览和其他终端不显示明文。",
    why: "把第三方密钥写进聊天、命令或全局设置，既容易泄露，也可能让官方登录误走第三方。配置档只记受保护引用，真正的值仅在目标程序启动时交给它。",
    example: "“让这个指定程序使用我的DeepSeek凭据，但不要把密钥发回聊天，也别留在新开终端里。”程序通过对应配置档取得本次所需值；按目标进程注入与本地密文保存分别核对，不把连接成功当成任务成功。",
    result: "配置档只显示密钥是否已准备，目标程序启动时得到本次所需值；其他终端和普通预览不会出现明文。连接成功和任务成功仍分别确认。",
    readerStates: {
      "pass": "选定程序拿到其需要的密钥，其他程序和父终端不继承。",
      "problem": "旧环境或设置可能改送服务时标出具体冲突，不替用户改原文件。",
      "unavailable": "本机受保护保存、密钥引用或服务身份不对时拒绝，不退回明文传递。"
    },
    decisionImpact: ["进程环境隔离不是文件权限沙箱；Codex run 仍是完全访问。", "OpenClaw 导入拿到的 DeepSeek Key 会立即写成 DPAPI 密文；预览、Profile JSON 和输出都不显示明文。", "官方 run 只在独占 CODEX_HOME 复制 auth.json，不复制用户配置、rules、skills 或其他会话。", "代理 OAuth 由第三方程序持有；AICLI 不读取 token 正文。"],
    problem: "防止秘密泄露和配置串线，同时不把“隐藏所有技术细节”误当成秘密保护。",
    implementation: ["SecretStore.ps1 使用 Windows DPAPI CurrentUser；失败不写明文。", "ProfileService 只保存 SecretRef，并限制同 Provider/认证域复用；删除最后一个引用时才移除对应密文，官方登录不受影响。", "Import-FromOpenClaw.ps1只有在来源主机和当前codex-deepseek-flash目标可证明时，才把Key交给同一DPAPI存储；默认预览零写入，旧四目标集合不再适用。", "ChildProcess 从运行所需 allowlist 重建 machine 环境，再用 EnvironmentDelta 注入当前 Profile 必需项。", "Redaction 在 JSON、异常与显示层移除已知秘密；原生命令参数使用 ArgumentList，不做 Invoke-Expression。"],
    flow: ["选择需要凭据的模板。", "无回显读取 Key并写入 DPAPI 密文。", "Profile 保存 SecretRef。", "启动计划标明数据去向和 env_key。", "目标进程启动时解封并注入；结束后不改父终端。"],
    concepts: [{ term: "DPAPI（Windows 数据保护接口）", explanation: "把密文绑定到当前 Windows 用户；产品不保存一个通用主密码。" }, { term: "EnvironmentDelta（环境差异）", explanation: "本次目标进程明确要增加或移除的变量集合，不是全局环境副本。" }, { term: "auth.json（官方登录副本）", explanation: "官方 Codex machine run 为独占临时 home 复制的登录材料；不进入网页或第三方 Profile。" }],
    boundaries: ["本页不读取或发布用户 Profile、Key、OAuth、私有 endpoint 或 auth.json。", "普通卸载默认保留 DPAPI 数据；purge 才删除本工具的本地副本。", "本地 OAuth 文件删除与远程授权撤销分开。"],
    failures: [{ condition: "SecretRef 指向不存在密文", response: "Doctor 与启动返回不可用，不要求把 Key 放进命令行补救。" }, { condition: "跨 Provider 复用秘密或 OpenClaw 来源主机不符", response: "拒绝，避免把一个服务的 Key 发送给另一个 host。" }, { condition: "输出可能含秘密", response: "脱敏后再显示；结构无法确认时整项失败，不保存原始正文。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\SecretStore.ps1", role: "DPAPI 保存和读取" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\scripts\\Import-FromOpenClaw.ps1", role: "来源校验与导入秘密入库" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\ChildProcess.ps1", role: "目标进程环境与清理" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\Redaction.ps1", role: "显示与回执脱敏" }],
    verification: ["全量回归覆盖 DPAPI、跨域复用拒绝、父环境清理与秘密不进 argv/JSON。", "当前 profile list 只显示 secretPresence，不显示值。", "本轮未打开任何秘密文件，也未执行云端 Live。"],
    relation: "Profile 模块只保存引用；本模块定义凭据生命周期，验证和恢复模块只能消费脱敏身份。",
    readerStatus: "已有本机加密保存凭据、仅交给指定程序的实现和测试；具体服务能否登录与完成任务要另行核对。"
  },
  {
    slug: "doctor-validation", shortTitle: "检查与实测", title: "先查静态条件，再明确决定要不要花额度做真实测试",
    usageEntry: "在本机运行 aicli doctor 检查指定 Profile；只有明确要做真实调用时才选择对应 Live 测试。",
    usageInputs: ["待查 Profile", "是否允许文本、工具或智能体实际测试", "费用和工具副作用边界"],
    productFlow: [
      { title: "先免费查条件", detail: "静态体检（Doctor）核对程序、模型配置、受保护凭据引用与本地服务，给出具体缺项。" },
      { title: "决定是否真实试用", detail: "按需要选择文本、工具或智能体测试，先看可能的额度与动作影响。" },
      { title: "核对所选一条", detail: "回读实际模型、输出、工具与清理；静态通过不能证明连通，一条 Profile 成功也不覆盖其他账号。" },
    ],
    searchAliases: ["aicli doctor", "Profile为什么不可用", "Live Test区别", "text tool agent all", "PONG测试", "真实文件任务验证"],
    searchProjection: { intents: ["不花额度检查Profile", "验证真实模型连通", "验证工具调用", "验证Agent文件任务"], entities: ["Doctor", "text", "tool", "agent", "all", "PONG", "verifier"], relations: ["Doctor先于Live", "all等于text加tool", "agent单独显式选择"], failureRecovery: ["旧指纹不继承", "工具隔离不足跳过", "模型自述不算通过", "临时目录清理失败不绿"] },
    teaser: "“代码有这条路”和“今天真的能完成任务”必须分开。",
    status: "零写入诊断已实现；Owner真实任务与各日期回归分别保留", statusTone: "mixed",
    value: "先用不发模型请求的体检找出配置或登录缺项；确需证明模型会回答、会用工具或能改文件时，再明确运行对应真实测试。",
    why: "程序能打开，不等于这次选中的模型真能回答或使用工具；每次排查都先发付费请求又浪费额度。先免费查设置，只有问题确实需要时才做真实调用。",
    example: "我可以说：“检查 codex-qwen3-8-max-paygo 现在缺什么；不要先扣费。静态条件都对以后，再由我决定是否做真实文本或任务测试。”我会先得到具体缺项和证据日期。",
    result: "先得到免费静态体检的缺项与下一步；明确选择真实测试后，才看到该模型是否回答、能否用工具或完成一个小文件任务。每一层都有自己的结果。",
    readerStates: {
      "pass": "本次选择的程序、模型、输出和清理都实际通过，才报告这一层可用。",
      "problem": "静态设置齐全但尚未真实调用，或旧结果过期时写成待验证，不涂绿。",
      "unavailable": "目标程序报错、模型身份不符或工具越界时停这条路线并给出原因。"
    },
    decisionImpact: ["all 只运行 text+tool，不会暗中启动更长的 agent。", "agent 只支持 Codex，且 Codex harness 是完全访问；明确授权后才能运行。", "旧回执只证明对应模型、配置和执行协议。新版本先按声明接口和实际身份检查受影响范围，不单凭版本号要求全量重验或宣称兼容。"],
    problem: "防止静态配置、历史回执和当前真实能力被压成一个模糊绿色状态。",
    implementation: ["DoctorService 读取平台、CLI、Profile、秘密引用、配置层、代理和本地服务，不自行发模型请求。","LiveTestService 在随机临时目录调用真实目标 CLI，并绑定 Profile 指纹与实际版本。","文本层要求最终正文严格等于 PONG；首个非预期工具事件使 Codex 文本测试失败。","AgentAcceptance 构造确定性文件任务，独立计算排序、去重、频次、总和与 SHA-256，不接受模型自述。","diagnose --json输出aicli.runtime-diagnostics.v1，可用--bridge-registry指定既有PCConfig登记；不初始化状态、读密钥或发网络/模型请求。有效源、安装载荷和能力声明分别报告，不能用SYSTEM空目录推断登录用户未配置。"],
    flow: ["运行 Doctor。", "按 check ID 修静态问题。", "阅读 Provider、数据去向与额度提示。", "明确选择 text、tool、agent 或 all。", "在临时目录运行目标 CLI。", "核对实际身份、输出、工具、清理和回执。"],
    concepts: [{ term: "PONG（严格文本回执）", explanation: "最小连通测试要求的唯一最终正文；提示回显或多余文字不能刷绿。" }, { term: "nonce tool（一次性随机工具）", explanation: "工具层唯一暴露的单用途验证入口，不接受任意命令或路径。" }, { term: "verifier（独立验证器）", explanation: "不相信模型的“完成了”，直接按 fixture 计算预期文件结果。" }],
    boundaries: ["Doctor 不证明模型连通。", "单个 Profile 的 Live 不代表其他模型或账号。", "网页消费Owner注明日期的回归和实际桌面验收，并只读诊断；没有把它们说成本轮重新发起全部CLI或付费Live。"],
    failures: [{ condition: "工具无法证明与私人配置隔离", response: "跳过 tool 并降为有限制，不冒充完整工具能力。" }, { condition: "版本或 Profile 指纹变化", response: "旧回执失效，保持待验收。" }, { condition: "临时目录或进程树未确认清理", response: "保留原失败和残留定位，不标成功。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\DoctorService.ps1", role: "静态检查与状态闭集" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\LiveTestService.ps1", role: "文本与工具 Live" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\AgentAcceptance.ps1", role: "确定性 Agent fixture 与 verifier" }],
    verification: ["9月3日385/385、9月17日442项是历史；0.3.18 正式发行时 Owner 完整 Pester 555/555 和离线发行检查通过。本网页没有重跑全套。", "9月18日13:41Z 0.3.17 与 3b7600a 七文件读回是历史；2026-09-24T04:59Z 零写入诊断回读 0.3.18 和 562b29bf4a6ac0af 启用，真实 ChatGPT.exe 主进程的 Bridge 路径同版。", "来源既有 GLM/DeepSeek 实际任务与 Luna Low 子会话按各自日期保留；新父工具和新模型 Live 未在本网页任务执行。"],
    relation: "本模块判断证据到了哪一层；引擎模块提供被测 Profile，可恢复运行模块承载 Codex agent 路径。",
    readerStatus: "可以先不花模型额度检查入口和缺项；真实文本、工具或文件任务测试需明确选择，并保留各自证据日期。"
  },
  {
    slug: "recoverable-runs", shortTitle: "可恢复机器运行", title: "中断后只有同一个 Codex 任务身份还能证明，任务才会继续",
    usageEntry: "用 aicli run start 发起程序化任务并保存 run id；中断后先用同一 run 记录检查能否恢复。",
    usageInputs: ["原 run id", "原项目、模型和输入", "中断原因"],
    productFlow: [
      { title: "建立可追踪运行", detail: "从标准输入交任务，后台控制器记录身份与公开进度。" },
      { title: "中断先判原任务", detail: "检查额度、暂时故障、输入和进程状态，只有同一线程身份仍成立才接续。" },
      { title: "报告终态", detail: "交回结果与进程清理证据；身份变化或硬失败时明确停止，不新开任务冒充断点恢复。" },
    ],
    searchAliases: ["aicli run start", "Codex中断恢复", "run status resume abort", "exact thread", "danger-full-access", "public_web_search", "硬预算"],
    searchProjection: { intents: ["后台启动Codex任务", "查询或中止run", "恢复同一个thread", "关闭本次网页搜索"], entities: ["run id", "status", "resume", "abort", "thread/session", "danger-full-access", "public_web_search"], relations: ["stdin创建持久run", "身份全相同才能resume", "no-web-search不改权限"], failureRecovery: ["新thread拒绝", "事件链损坏拒绝", "瞬态最多三次恢复", "额度暂停不消耗次数"] },
    teaser: "恢复的是原任务身份对应的执行，不是把旧摘要重新发给一个新对话。",
    status: "Codex 可恢复控制面、权限回读与故障回归已实现", statusTone: "pass",
    value: "后台文件任务留下编号和进度；中断后先找原会话和已发生动作，只有同一身份仍可证才接着做，不能复制摘要新开任务冒充恢复。",
    why: "长任务中断后重新开一个对话可能重复改文件或执行命令。只有找回原任务身份和真实进度，才能知道是接着做，还是必须明说重新开始。",
    example: "“刚才那项长任务中断了，先查它做到了哪里，别重新交一遍。”用原任务记录核对进度和结果；能接续才继续，目标、模型或输入改变时明确说明，不用旧结果冒充本次任务。",
    result: "拿到原任务编号、已公开的进度和完成或停止状态。取消请求被收到还不等于进程和显卡已释放，须看真实清理结果。",
    readerStates: {
      "pass": "原任务身份和工作条件一致、继续与清理都核对后报告完成。",
      "problem": "额度或暂时故障时保留原任务，符合条件才有界续作，不重复已发生的动作。",
      "unavailable": "身份变化、记录损坏、本人取消或清理无法确认时停下，不把新任务说成旧任务恢复。"
    },
    decisionImpact: ["所有 Codex machine run 固定 danger-full-access + approvalPolicy=never，不是只读沙箱。", "非 Codex run 只是一性执行：默认 read-only，可选 workspace-write，不支持后台 exact resume。", "受管 public_web_search 默认启用；--no-web-search 只关闭搜索，不改变完全访问。"],
    problem: "防止中断后重复执行、身份悄悄变化、预算只写在文档里或隐藏思考被当成公共进度。",
    implementation: ["RecoveryService 为每个 run 保存 stateHash、前向 journal、不可变 attempt 事件与回执；正文不持久化。","CodexAppServerBridge 使用 thread/start、turn/start 与 thread/resume，逐条绑定 thread/turn/item 生命周期。","CommandRouter 硬限制 timeout、steps、tool calls、output chars 与最多三次 resume，并让 background 只用于 Codex start/resume。","PublicWebSearch 只访问固定 HTTPS Bing RSS，拒绝重定向、Cookie、任意 URL/Header/Key；公开事件不含 query/result。","桥接器结束时必须确认 app-server 与后代进程树清理，失败不会被成功正文覆盖。","run --control-file <绝对路径>在模型执行前产生aicli.run-control.v1，绑定确切run/profile/model/workspace；不接受已有文件覆盖、未知重解析点或非Codex入口。上层用同一已验证AICLI入口发送run abort，不从文件读取任意命令。","Windows Job Object（进程树约束）和Broker租约共同证明取消完成。模型身份产生前的取消保留not_observed_cancelled与null身份；它可以证明清理，但不能通过模型验收或作为已认证会话恢复。"],
    flow: ["任务正文从 stdin 进入。", "创建持久 run 与独占 CODEX_HOME。", "后台控制器返回 run id。", "观察公开进度、工具、搜索与上下文事件。", "中断时分类额度、瞬态或硬失败。", "符合条件时 thread/resume；否则停止。", "终态写回执并确认进程树清理。"],
    concepts: [{ term: "thread/session（线程/会话身份）", explanation: "app-server 返回的原生对话执行身份；resume 必须仍是同一个。" }, { term: "hard budget（硬执行上限）", explanation: "达到墙钟、行动步数、工具次数或输出上限会实际终止进程树，不只是提示。" }, { term: "event projection（公开事件投影）", explanation: "只保留可给观察器看的进度、工具类别、上下文和终态；隐藏推理与工具载荷丢弃。" }],
    boundaries: ["恢复账本不是通用聊天历史。", "AICLI 不判断低级模型是否胜任，也不自动换到更强模型。", "旧版本文件任务、当前零写入诊断和桌面后台子会话是不同证据。缺少当前程序化运行身份或清理证明时明确Unknown，不用另一条路线的成功补齐。"],
    failures: [{ condition: "控制器或 app-server 中断", response: "等待 writer 关闭并对账；只有明确瞬态且身份闭合才最多恢复三次。" }, { condition: "恢复返回新 thread 或权限变化", response: "resumeSupported=false，要求新工作区全量重跑。" }, { condition: "事件写入失败但模型已完成", response: "标记观察层 degraded，不自动重跑造成重复副作用。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\RecoveryService.ps1", role: "run 状态、分段证据与恢复" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Support\\CodexAppServerBridge.ps1", role: "app-server 协议、身份、预算与事件" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Support\\PublicWebSearch.ps1", role: "固定公共搜索工具" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\docs\\user\\MACHINE-RUN.md", role: "用户可读机器运行合同" }],
    verification: ["恢复、事件生命周期、权限、预算、用量和清理均在 385 项回归中有覆盖。", "历史 0.3.12 Qwen3.8-27B Agent Live 证明过正常文件任务；本轮没有把它晋升为 0.154.0-alpha.6.2 当前 Live。", "本轮未创建一个新的模型 run。"],
    relation: "本模块承载程序化 Codex 任务；Doctor/Agent 验收消费它，本地模型与代理模块提供部分运行目标。",
    readerStatus: "已有查询、中止和接续同一个Codex任务的机制；只有任务和模型身份仍一致才继续，取消受理不等于已完全停止。"
  },
  {
    slug: "local-proxies", shortTitle: "本地模型与双代理", title: "本地模型和两个代理各自验明身份，不组成自动备用链",
    usageEntry: "在 aicli profile show/native 选择点名的本地模型或代理，先用 Doctor 核对当前安装和服务。",
    usageInputs: ["明确的模型或代理 Profile", "本地显卡或登录状态", "是否只允许本地数据"],
    productFlow: [
      {
        "title": "核对选中入口而不自动换路",
        "detail": "系统辨认这次是本地模型还是指定代理，检查其服务身份、端口与登录，不把失败送往另一家。"
      },
      {
        "title": "核对服务身份",
        "detail": "检查真实安装、回环地址、端口、进程及必要上游登录。"
      },
      {
        "title": "按选定路线运行",
        "detail": "交回模型结果或精确不可用原因；本地入口失败不会自行切到付费或其他数据去向。"
      }
    ],
    searchAliases: ["本地Ollama", "LocalGpuBroker", "Qwen Code machine run", "OpenCode本地模型", "claude-code-proxy", "CLIProxyAPI", "代理端口",
  "模型代理安装、运行与自动备用切换"],
    searchProjection: { intents: ["运行本地AI模型", "检查本地端点", "使用ChatGPT到Claude代理", "查看代理是否可更新"], entities: ["Ollama", "LocalGpuBroker", "qwen-main-v1", "ccp", "cliproxy", "43197", "43198"], relations: ["本地Profile绑定loopback", "代理独立登录运行", "新artifact先批准"], failureRecovery: ["端口占用换候选不杀进程", "非loopback停止", "身份不符不终止", "本地OAuth不等于远端撤销"] },
    teaser: "这些是可选路线；任何一个离线都不会让 aicli 偷偷换到另一个。",
    status: "受管四模型与桌面入口已建立；可选代理和通用11434另看日期", statusTone: "mixed",
    value: "本地27B、35B及两种去限制版都有明确入口，不把“本地模型”混成一件事。它们通过既有显卡协调器工作；两个ChatGPT到Claude代理仍是单独选择，任何路线失败都不会自动改投另一个模型或账号。",
    why: "“本地”不等于一定在线，“已安装”也不等于 OAuth 和模型链路已通。自动把失败请求送到另一条路线还会改变费用、隐私和结果身份。",
    example: "我可以说：“这次只用普通本地27B，不换去限制版，也不传云端。先看当前模型与显卡是否就绪；不可用就告诉我原因。”我得到对应入口的状态，而不是把通用Ollama端口离线误报成全部本地模型都不能用。",
    result: "分别知道选中的本地模型或代理是否已安装、是否真在运行、监听的是不是本机地址；只有这一条身份成立才尝试真实调用。",
    readerStates: {
      "pass": "选中服务和真实模型身份都对应时，标这条路线可进一步使用。",
      "problem": "模型没开、显卡忙或代理旧了时只说明这一条的限制。",
      "unavailable": "程序不明、监听跑到非本机地址或端口已被别人占用时拒绝，不结束未知程序。"
    },
    decisionImpact: ["Qwen Code 与 OpenCode 当前主要是本地 machine-only 路线。", "ccp 和 cliproxy 是第三方可选通道，不是 OpenAI/Anthropic 官方功能，也不互相故障转移。", "当前源只批准 ccp 0.1.15、cliproxy 7.2.72；上游更高标签尚未进入可执行清单。"],
    problem: "防止把安装文件、端口或旧 OAuth 当成当前可用，也防止 AICLI 为抢端口结束别人的服务。",
    implementation: ["LocalGpuBrokerSession 消费既有 broker 的 lease/capability，证明请求命中 exact 本地模型；它不拥有 GPU 调度服务。","OpenCode 使用一次性 pure 配置并保留 256K context/input、输出、reserve 与最近轮次边界。","PortAllocator 在 43192–43209 中排除动态/保留范围、listener 与 bind 失败；ccp/cliproxy 首选 43197/43198。","ProxyService 只执行命中固定 SHA-256 或可信签名的 Windows 制品，并在停止前重验进程身份。","data/local-model-set.json拥有四个受管Profile与OpenCode、Toolkit映射；当前模型标签为qwen3.8-27b:256k、qwen3.6-35b:256k、qwen3.6-35b-abliterated:256k、qwen3.8-27b-abliterated:256k。设置先预览、明确应用后同步既有消费者，不创建另一份模型目录。","普通27B和去限制27B、普通35B采用num_batch=128；35B去限制版保留512。draft_num_predict=0避免已复现的草稿预测崩溃，不替换原始模型权重。普通27B的256K镜像manifest SHA-256为8040835723046ec2631b64b960d44414636ea5147942a7d68eaaa7ccdb492e20，Q4_K_M，输出32768，temperature=1、top_p=.95、top_k=20、min_p=0、presence_penalty=0、repeat_penalty=1。"],
    flow: ["选择本地模型或一个代理。", "检查批准制品与当前安装。", "安全分配 loopback 端口。", "必要时由用户完成上游登录。", "启动并核对进程、listener 与健康响应。", "停止或本地清理前再次验明身份。"],
    concepts: [{ term: "loopback（本机回环）", explanation: "只允许本机访问的 127.0.0.1 地址；0.0.0.0、局域网与公网监听都不接受。" }, { term: "LocalGpuBroker（本地显卡协调器）", explanation: "外部既有运行时，负责本地模型端点与资源租约；AICLI 只作为消费者。" }, { term: "approved artifact（已批准制品）", explanation: "版本、资产名和 SHA-256 已写入发行清单的代理包；上游新标签不自动获得执行资格。" }],
    boundaries: ["本轮不启动 Ollama、GPU 模型或代理。", "不下载或执行上游最新标签。", "logout --purge-local-auth 只处理本地目录，远程授权需在账号侧确认。"],
    failures: [{ condition: "默认 Ollama 11434 不可达", response: "当前公共默认路线有限制；不改投 32100 或云端，除非用户选择对应 exact Profile。" }, { condition: "端口被未知进程占用", response: "换受控候选，绝不结束未知占用者或改系统端口范围。" }, { condition: "代理版本未批准", response: "update-check 只给来源和批准状态，不执行新版。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\LocalGpuBrokerSession.ps1", role: "本地模型身份与租约消费" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Private\\ProxyService.ps1", role: "代理安装、启动、登录、退出和身份" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\data\\ports\\managed-proxy-ports.json", role: "候选端口与验证日期" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\data\\proxy-artifacts\\approved-windows-artifacts.json", role: "可执行代理版本与摘要" }],
    verification: ["代理端口、制品、路径逃逸、监听和 PID 复用均有离线回归。", "2026-09-14T04:20:45Z的Doctor仍读到两个代理已安装未运行、Ollama默认端点不可达。", "GitHub 最新标签只用于指出清单差距，没有下载、执行或标成已批准。"],
    relation: "本模块提供可选运行目标；引擎模块定义 Profile，验证模块决定该目标在当前是否真正可用。",
    readerStatus: "已有四个本地模型及桌面入口的登记；可选代理是否正在运行、是否已登录仍按各自日期和实际状态判断。"
  },
  {
    slug: "install-recovery", shortTitle: "安装、退役与恢复", title: "安装可回退，卸载也必须说清保留什么、删除什么",
    usageEntry: "在本机用项目安装器处理已核对的源码或 Release 包；卸载时明确普通保留还是彻底清理本工具数据。",
    usageInputs: ["可信安装包或源码", "现有 Profile 和密文是否要保留", "已知旧版及回滚位置"],
    productFlow: [
      { title: "先预检旧状态", detail: "检查已有安装与退役对象，未知用户文件先停下核对。" },
      { title: "安装可回退候选", detail: "构建独立候选并切换，失败时恢复旧版。" },
      { title: "新开终端验入口", detail: "重新打开命令窗口，检查版本、保存的配置档、静态体检和启动预览；普通卸载保留本工具数据，彻底清理与远端账号授权撤销分开办理。" },
    ],
    searchAliases: ["安装aicli", "同版本Force修复", "更新后还是旧模块", "Qwen3.7退役隔离", "卸载保留Profile", "purge user data", "中文手册"],
    searchProjection: { intents: ["安装或修复aicli", "按原渠道更新CLI", "隔离旧Profile", "卸载并选择是否保留数据"], entities: ["Install.ps1", "CurrentUser", "retirement", "quarantine", "uninstall", "purge-user-data", "中文手册"], relations: ["候选验证后原子切换", "旧对象移入可恢复隔离", "普通卸载保留数据"], failureRecovery: ["同版本无Force拒绝", "未知旧对象先停", "安装失败恢复旧版", "远程OAuth另行撤销"] },
    teaser: "模块、用户数据、上游 CLI 与远程授权各有自己的生命周期。",
    status: "0.3.18 正式安装有 Owner 回读；新版桌面桥已见真实 GUI 进程路径，模型任务仍另验", statusTone: "mixed",
    value: "安装和升级先在旁边验新版本，失败保留旧版；卸载时明确哪些个人配置与本机密钥保留，远端登录授权另行处理。",
    why: "直接覆盖旧安装可能留下半套文件；卸载时一句“完成”也可能让人误以为所有模型、账号授权和个人配置都没了。安装先验候选，卸载明确保留范围。",
    example: "我可以说：“把 main 的最后修复装上；若遇到未知旧文件就先停。以后普通卸载保留我的 Profile 和密文，只有我明确彻底清理时才删本工具数据。”我会得到安装、保留内容和可回退位置的明确结果。",
    result: "拿到当前用户可用的 aicli 命令和已核对的安装版本；失败有旧版可回退。普通卸载保留配置和本机密钥，明确彻底清理才删本工具数据，远端账号授权还要到服务侧另办。",
    readerStates: {
      "pass": "候选安装、切换和新命令窗口回读都通过后，说明本工具安装完成。",
      "problem": "旧模块还在使用或上游变更时提示关闭旧窗口、更新对应部件或暂用旧版。",
      "unavailable": "未知旧文件、候选不完整或安装目录被占时不做半套替换，保留原安装。"
    },
    decisionImpact: ["源码版本、发布包、当前用户模块和桌面内容寻址发行是不同对象；模块升级不会自动重建或切换正在工作的桌面发行。", "旧 Qwen3.7 可验证对象移入 quarantine（可恢复隔离区），SecretRef 和 Key 不参与迁移。", "普通卸载保留 Profile、DPAPI 密文和代理数据；--purge-user-data 才删除本工具数据，仍不代表远程 OAuth 撤销。"],
    problem: "防止升级造成半套模块、退役误删用户配置，以及卸载把多个独立生命周期说成一个动作。",
    implementation: ["Install.ps1 从当前 PSModulePath 选择 CurrentUser 模块根，在临时候选中导入验证，再对同一父目录执行原子重命名。","Invoke-AiCliRetirementMigration.ps1 只移动 marker、路径、内容 hash 与 state 都闭合的退役 Qwen3.7 对象，未知项在写前阻断。","UpdateService 识别实际启动入口和安装渠道；只读检查与指引不静默升级上游。","Uninstall.ps1 停止己方已验证代理并移除模块、shim、PATH 与受管 Profile 块；用户数据和上游产品默认保留。","《AI CLI Profile Manager 使用手册》拥有产品安装、Profile、Doctor/Live、代理、更新、卸载与排障；《Codex、Claude Code 与 Open Interpreter CLI 中文手册》拥有上游会话内模型、effort、权限、上下文、恢复和命令差异。","两本 PDF 是同版本 Markdown 的打印制品；只有源 hash、文本抽取和逐页视觉复核闭合时才 current，但它们仍不证明安装或 Live。","0.3.18 已由原安装器交付；DryRun/WhatIf在任何写入前返回，未知参数拒绝。Toolkit按已声明的诊断/控制能力使用入口，不因一般模块更新强迫升级桌面。桌面启用、停用和设置同步使用各自显式入口。"],
    flow: ["从可信源码或已核对 Release 包启动安装。", "只读预检退役对象和安装目录。", "构建并导入临时候选。", "原子移动旧版与候选，失败则恢复。", "新开 PowerShell 并回读 aicli version/list/show/doctor/native/eject。", "退出时选择普通卸载或显式 purge，并另外处理远程授权。"],
    concepts: [{ term: "CurrentUser（当前用户范围）", explanation: "模块只安装给当前 Windows 用户，不要求系统级管理员安装。" }, { term: "quarantine（可恢复隔离区）", explanation: "把身份已闭合的退役文件移出活动位置并保留前像，而不是直接删除。" }, { term: "atomic switch（原子切换）", explanation: "候选完整验证后用同父目录重命名替换，避免复制中途留下半套文件。" }],
    boundaries: ["本轮不创建新的 GitHub Release。", "不静默升级 Codex、Claude、Ollama、Open Interpreter 或代理。", "文档与 PDF 是用户入口，不是当前安装、运行或 Live 的替代证据。"],
    failures: [{ condition: "同版本已经安装但未给 -Force", response: "默认拒绝覆盖，避免意外替换正在使用的版本。" }, { condition: "退役对象无法证明归属", response: "安装在任何迁移前阻断，保留原件供人工审阅。" }, { condition: "安装后当前 shell 仍加载旧模块", response: "关闭重开 PowerShell，或 Remove-Module 后强制 Import-Module，再核对路径和版本。" }],
    sources: [{ path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\scripts\\Install.ps1", role: "候选验证与原子安装" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\scripts\\Invoke-AiCliRetirementMigration.ps1", role: "旧入口预检、可恢复移动与回滚" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\scripts\\Uninstall.ps1", role: "模块、shim、PATH 与数据边界" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\docs\\user\\AI CLI Profile Manager 使用手册.md", role: "安装、Profile、验证、代理、更新、卸载与排障事实源" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\docs\\user\\Codex、Claude Code 与 Open Interpreter CLI 中文手册.md", role: "原生 CLI 会话内命令与差异" }, { path: "E:\\Projects\\Tools\\ai-cli-profile-manager\\docs\\compatibility\\VERIFIED-COMPATIBILITY.md", role: "每条 Profile 的当前证据边界" }],
    verification: ["0.3.18 正式发行时完整 Pester 555/555、发行 smoke 与隔离安装/同版替换通过；旧32项退役、385项全量和 Junction 修复保留原日期。", "2026-09-24T04:59Z 零写入 diagnose 回读本机 0.3.18 与桌面 562b29bf4a6ac0af 启用；真实主 GUI 的 Bridge 路径同版，本网页未执行安装或切换。", "安装、进程加载、Profile 配置与真实模型结果分别证明；9月14日73/73和9月3日损坏Profile拒绝不冒充新版 E2E。"],
    relation: "这是产品进入和退出本机的生命周期；配置档与秘密模块拥有用户数据，验证模块负责安装后的真实功能回读。",
    readerStatus: "已有版本安装和桌面配套文件核对记录；升级、旧版回退与真实模型运行分别验收，不由安装成功包办。"
  },
  {
    "slug": "native-desktop-integration",
    usageEntry: "在官方 Codex 桌面的新任务里选择已登记本地模型；接入配置的启用、停用使用项目既有受管入口。",
    usageInputs: ["当前项目目录", "要用的本地模型", "是否要保留旧官方任务"],
    productFlow: [
      { title: "先看桌面入口是否已接入", detail: "核对受管配置与实际模型服务，不把菜单文字当成模型正在工作。" },
      { title: "在新任务选模型", detail: "原官方任务保持原来的服务身份；换到另一家模型服务时另开任务，同一家服务内才按实际能力切模型。" },
      { title: "用真实工具验收", detail: "查看本地模型是否完成一次工具工作与测试；配置文件一致或历史截图不足以证明现役进程已切换。" },
    ],
    "shortTitle": "原生桌面接入",
    "title": "在熟悉的Codex桌面选择本地模型，不另造聊天软件",
    "searchAliases": [
      "Codex桌面本地模型",
      "同一Provider切换模型",
      "四个256K本地模型",
      "桌面发行回退"
    ],
    "searchProjection": {
      "intents": [
        "在原本Codex桌面用本地模型和工具",
        "官方与本地切换为什么要新任务",
        "桌面更新后继续用现有模型"
      ],
      "entities": [
        "Codex Desktop",
        "LocalGpuBroker",
        "Set-CodexDesktopLocalModels.ps1",
        "七文件发行"
      ],
      "relations": [
        "AICLI配置接入官方桌面与原生历史",
        "PCConfig登记实际桌面发行"
      ],
      "failureRecovery": [
        "不同Provider另开任务",
        "身份或发行不符停止切换",
        "停用只撤回自己的配置"
      ]
    },
    "teaser": "不是多一套界面，而是让原本的桌面任务使用我明确选的模型。",
    "status": "Owner本地桌面实际任务已验收；七文件安装回读匹配",
    "statusTone": "mixed",
    "value": "继续在官方 Codex 桌面使用原来的任务、工具和历史，只把本次明确选择的本地或第三方模型接进来；跨服务另开任务。",
    "why": "只把一个模型名字放进菜单，并不能保证完整指令、上下文和工具真的交给它；把旧任务的Provider（服务身份）悄悄改掉还会混淆历史。接入层保留官方执行环境，只负责经过核对的入口、目录和协议适配。",
    "example": "我可以说：“用本地27B在这个练习项目里改一个函数，照常显示工具、测试和历史。原来那个官方模型任务别动。”我会在新任务里选择本地入口；以后同一Provider内切换模型可以继续，跨Provider则另开任务。",
    "result": "仍在官方 Codex 桌面看到真实任务、工具过程和最后结果；启用或停用这条接入有明确回退。只看到模型菜单还不足以证明这次任务真的由本地模型完成。",
    "readerStates": {
      "pass": "桌面实际启动所选模型并完成一次工具工作，结果可核对。",
      "problem": "旧任务属于另一模型服务时保留原历史，换服务开新任务。",
      "unavailable": "模型入口或安装身份无法确认时停相应接入，原有官方入口仍可用。"
    },
    "decisionImpact": [
      "同Provider内的模型切换与跨Provider新建任务不同；旧会话不会被批量换模型。",
      "官方桌面、命令行、Toolkit各有自己的配置与验收，不能用其中一条成功替代另外两条。",
      "已安装七文件、进程实际加载和用户看到的真实任务分别核对；本轮不重启现有桌面。"
    ],
    "problem": "防止假菜单、上下文或工具被裁剪、旧会话身份被替换，以及软件升级后只因版本号不同就误判整条路线不可用。",
    "implementation": [
      "scripts/Set-CodexDesktopLocalModels.ps1管理既有桌面接入；GetDesktopModelPlan.ps1提供模型与配置计划，GetDesktopProviderToken.ps1按需供给目标凭据，ResolveDesktopEngine.ps1选择可信官方引擎。凭据值不进入网页或命令参数。",
      "官方debug models与实际模型目录一起提供完整指令、上下文、工具和模型身份；CODEX_CLI_PATH使用PCConfig登记的内容寻址发行，而不是另造聊天执行器。",
      "桌面发行由GetDesktopModelPlan.ps1、GetDesktopProviderToken.ps1、ResolveDesktopEngine.ps1及bridge目录内AiCli.CodexDesktopBridge.deps.json、AiCli.CodexDesktopBridge.dll、AiCli.CodexDesktopBridge.exe、AiCli.CodexDesktopBridge.runtimeconfig.json七文件组成；来源 Owner 已登记/安装 562b29bf4a6ac0af，本轮真实 ChatGPT.exe→Bridge→codex.exe 进程路径也指向该发行。旧3b7600a验收仅属9月18日历史。",
      "四种本地模型共用既有Broker（显卡协调器）与256K配置；GLM、Qwen、DeepSeek仍保留不同Provider/协议身份。旧配置不会悄悄指向另一模型，跨Provider创建新任务。",
      "支持可信官方AppX引擎和官方签名自更新缓存，通过约束路径、签名及实际接口判断；新版本不是永久拒绝名单，也不自动表示兼容。启用/停用比较己方配置前后像，不覆盖别人后改的环境。",
      "第三方公开commentary（工作说明）以同一模型的公开摘要呈现，GLM/DeepSeek的最终答复保持原意；隐藏推理不进入公开投影，也不增加另一个模型翻译器。实时与历史用稳定事件身份对应。",
      "专用保护判断线程使用官方持久threadSource及既有隐藏集合分类，不混入普通顶层任务列表；保留判断证据。标记不是原生子代理血缘、最高权限主体或批准凭证，普通Astra顶层任务仍可见。",
    ],
    "flow": [
      "选择原本的官方桌面与已登记模型",
      "比较并预览接入配置，确需时显式启用",
      "按Provider关系保留旧任务或新开任务",
      "核对实际模型、工具和结果",
      "更新或停用时只处理归属明确的配置并保留回退"
    ],
    "concepts": [
      {
        "term": "Provider（服务身份）",
        "explanation": "同一模型名字不代表同一服务；已有任务持有自己的Provider，不能靠改菜单篡改历史。"
      },
      {
        "term": "内容寻址发行",
        "explanation": "一组已固定字节的桌面接入文件；登记和实际加载都能对应到这一组，而不只看一个版本号。"
      }
    ],
    "boundaries": [
      "这不是独立桌面产品、聊天壳或后台守护服务；界面与原生任务仍由官方Codex拥有。",
      "9月15日真实本地桌面画面仍按当日身份保存；本轮只读，不生成新GPU任务。",
      "七文件一致不证明正在运行的进程已切换，也不证明全部工具、视觉输入或长任务压力场景通过。"
    ],
    "failures": [
      {
        "condition": "原任务属于另一Provider",
        "response": "保留原任务与历史，另开需要的目标任务；不把重建伪装为恢复。"
      },
      {
        "condition": "更新后可信引擎或接入文件无法证明",
        "response": "只停止受影响接入并报告实测差异，保留已验证发行；不改动其他Owner正在工作的配置。"
      }
    ],
    "sources": [
      {
        "path": "docs/user/Codex 桌面本地模型.md",
        "role": "真实入口、模型切换与恢复边界"
      },
      {
        "path": "scripts/Set-CodexDesktopLocalModels.ps1",
        "role": "受管桌面启用停用"
      },
      {
        "path": "src/AiCliProfileManager/Support/ResolveDesktopEngine.ps1",
        "role": "可信引擎与更新连续性"
      },
      {
        "path": "src/AiCliProfileManager/Support/DesktopBridge/Program.cs",
        "role": "官方桌面协议接入"
      }
    ],
    "verification": [
      "9月15日Owner提供原生桌面及CLI实际任务画面，本页保留五张原图与原日期。",
      "2026-09-24T04:59Z diagnose（零写入诊断）回执为 0.3.18、desktop enabled、release 562b29bf4a6ac0af；未提供受保护 registry，故 installation_state=registry_not_supplied，工具本身 running_process_loaded=unknown。另用 Windows 进程读回主 GUI 的同版 Bridge 可执行路径；仍不证明新父工具 schema 或模型 E2E。",
      "其他Owner的未提交Gemini接入不参与本次来源闭包。"
    ],
    "relation": "配置档模块负责准确选择，本模块接入现有原生桌面；后台子会话模块说明桌面父任务怎样持续协作。",
    readerStatus: "本地模型在原生桌面的实际任务已有验收，安装文件也已核对；其他模型、服务或旧任务不能直接借用这份证明。"
  },
  {
    "slug": "background-openai-children",
    usageEntry: "在官方 Codex 桌面当前父任务中，明确一个有界子任务及允许的 OpenAI 模型和思考档；父任务通过已接入入口协作。",
    usageInputs: ["子任务目标与验收", "本次允许的模型、档位和范围", "父任务仍要继续的工作"],
    productFlow: [
      {
        "title": "确认子任务真的获准且能独立完成",
        "detail": "父任务核对本次可用的模型和范围，再把可单独验收的部分交给真实子会话。"
      },
      {
        "title": "保留同一子会话",
        "detail": "子任务启动后父任务继续其他部分；子任务提问时对应回答，再在原会话继续。"
      },
      {
        "title": "汇总真实结果",
        "detail": "父任务核对结论、进度和停止或清理状态；许可缺失、接口不可用或仅创建受理都不说已完成。"
      }
    ],
    "shortTitle": "后台子会话协作",
    "title": "父任务继续做事，同一个子会话可以回答、追问和回来汇报",
    "searchAliases": [
      "GLM调用OpenAI子会话",
      "DeepSeek调用Luna High",
      "后台子任务提问回复",
      "同一个子会话连续问答",
      "openai_child"
    ],
    "searchProjection": {
      "intents": [
        "让当前GLM任务请OpenAI复核而自己继续工作",
        "回答子任务的问题后让同一个会话继续",
        "查询或停止当前父任务的后台子会话"
      ],
      "entities": [
        "openai_child",
        "openai_parent",
        "openai_child_control",
        "reply_to",
        "Luna High"
      ],
      "relations": [
        "父任务绑定同一个官方OpenAI子线程",
        "子问题与父回复精确匹配",
        "原生历史保存对话而接入层只保存协作元数据"
      ],
      "failureRecovery": [
        "错误问题编号拒绝",
        "投递不确定先查状态",
        "旧父任务不假装加载新协议",
        "停止当前子轮不删除线程"
      ]
    },
    "teaser": "不是把一段摘要丢给新任务，而是保留同一个协作者，边工作边往返。",
    "status": "GLM和DeepSeek两条真实桌面父子链已接受；其他组合不自动继承",
    "statusTone": "mixed",
    "value": "我可以让正在工作的GLM或DeepSeek任务请一个已允许的OpenAI模型复核，父任务不必一直等着。子会话能继续报告进度，也能带着一个明确问题回来；父任务回答后，还是原来的子会话接着做，之前的上下文不必从头复述。",
    "why": "把每次追问都当成新的顶层任务容易丢失上下文，等待一个长调用又会让父任务停摆。这个产品保留真实父子线程与问题状态，让两边的进展、等待和结束都能核对，而不是用一个看起来像子代理的卡片掩盖同步调用。",
    "example": "我可以说：“让当前GLM任务请Luna High核对这段方案，自己继续整理另一部分。它发现问题就回来问，回答后还在同一个子会话继续，最后汇总真实结论。”我看到的是持续协作的进度和结果；子任务提问时会明确等答，不会把沉默当作已经同意。",
    "result": "父任务能看到获准子会话的进度、待答问题与最终结论；可以按同一个会话追问或停止。显示“已安排”只表示创建受理，不等于子任务完成。",
    "readerStates": {
      "pass": "子任务在同一真实会话里完成往返，父任务核对结果。",
      "problem": "子任务提问时明确等待父任务回答，双方不会把沉默当同意。",
      "unavailable": "缺明确模型许可或父子会话身份不符时停相应动作，保留原会话与失败原因。"
    },
    "decisionImpact": [
      "后台协作使用官方OpenAI线程；它不是独立顶层任务、普通本地模型调用或伪造的原生子代理。",
      "只有新建并加载本协议的父任务获得新的异步语义；旧父任务不能仅凭磁盘文件更新就被宣称已经切换。",
      "父任务一轮回答结束、窗口暂时不再订阅和整个任务真正中止是不同状态；不能因此误杀仍在工作的子会话。",
      "模型与思考档由当次实际许可和父/根限制决定；验收中的Luna High不是系统永久固定模型或上限。"
    ],
    "problem": "防止重复创建协作者、把回复送给错误问题、父任务结束后遗留工作，或把已受理、运行中和已完成混成一个成功状态。",
    "implementation": [
      "openai_child一次提交完整model、reasoning_effort、task_name和message创建实际官方子thread；后续继续同一绑定，明确模型/档位，不用新线程冒充续问。默认等待1秒，可选0—30秒；返回running只证明已受理并仍在运行。",
      "子会话通过openai_parent回报：非提问的进度发送后继续工作；真正提问进入待答。父任务只有回答现存问题时才使用reply_to，普通续问省略该字段。已完成消息ID不能冒充待答问题ID。",
      "openai_child_control提供list、status、wait、stop，只控制当前父任务拥有的子会话。stop针对当前执行轮，保留线程供未来明确继续；根任务真正终止时应收口或停止自己拥有的子工作。",
      "BackgroundChildLinks.cs与RpcTransport.BackgroundChildren.cs保存父子身份、阶段、事件游标和问题投递状态。CODEX_HOME/aicli-background-children只保存协作元数据，不复制提示词、答复或隐藏推理；原生线程历史拥有对话正文。",
      "父任务运行中时排队，空闲时用官方thread/inject_items与实际turn身份接续。机器投递保持不可信消息属性，不能假冒本人新授权；投递结果不确定时先按原身份回读，不盲目重发副作用。",
      "最多10个活动子会话；父线程一轮完成并不等于父任务已关闭，窗口取消订阅也不等于中止。明确中断或归档才按实际生命周期传播；不创建额外常驻服务或另一套任务账本。",
      "GLM/DeepSeek的公开工作说明与最终回答分别投影；同一模型生成的公开摘要不暴露隐藏推理，也不请第二个模型翻译。既有受保护动作仍走其精确授权与模型要求，后台协作不是例外通道。",
      "受保护判断专用角色按活动保护合同分为 gpt-6-sol/high 常规与 gpt-6-astra/high 重大后果两档，均只接受agent_type/model/reasoning_effort/task_name/message五字段；wait_ms、thread_id、reply_to、fork_turns连null也不可传。Sol 遇升级条件交回原父，角色名不授予模型身份、principal 或实施授权。错误参数与身份分别返回可纠正代码及五字段说明，不回显私密请求、不创建子会话；旧父会话可在同一会话消费错误后纠正，不降级普通角色绕过保护。",
    ],
    "flow": [
      "父任务确认本次允许的模型、思考档和有界目标",
      "创建一个真实官方子会话并保留返回身份",
      "父任务继续自己的工作，按需接收子进度或待答问题",
      "准确回答该问题，或在同一子会话普通续问",
      "核对最终结果与原目标，收口或停止确切子工作"
    ],
    "concepts": [
      {
        "term": "thread/session（线程/会话身份）",
        "explanation": "由官方运行层实际返回的同一会话，连续3轮仍须是同一身份；名字相似或复制摘要不算。"
      },
      {
        "term": "reply_to（准确回复对象）",
        "explanation": "只有现存待答问题才是有效对象；普通跟进不填写它，避免把新指令伪装成对旧问题的回答。"
      },
      {
        "term": "协作元数据",
        "explanation": "只记录谁属于谁、进展到哪一步、哪个问题在等待，不复制原生会话正文或建立第二份聊天历史。"
      }
    ],
    "boundaries": [
      "本页只展示已实现且Owner接受的GLM、DeepSeek桌面父任务两条链路，不承诺每个模型组合、全部工具或长时间压力场景通过。",
      "这条产品路线不替父任务决定模型是否胜任；缺少真实模型许可或父/根边界时不启动，也不把普通委派意图扩大为任意供应商许可。",
      "子会话的创建受理、实际启动、公开进度、正确结果与根任务结束后的清理分别验证，不用一张卡片或工具返回替代全链路证据。",
      "不复制隐藏思考，不把机器消息升级为真人授权，不因为来源新增一个模型就自动扩大允许范围。"
    ],
    "failures": [
      {
        "condition": "reply_to不是当前待答问题",
        "response": "返回OPENAI_CHILD_REPLY_NOT_PENDING；核对原会话状态，普通续问删除错误字段，不新建子会话伪装修复。"
      },
      {
        "condition": "消息投递或父任务状态不确定",
        "response": "保留确切父子身份并查状态，不盲目重投、换线程或把等待写成完成。"
      },
      {
        "condition": "父任务真正中止或归档",
        "response": "按真实生命周期处理其拥有的子执行；不因窗口隐藏或某一轮完成提前取消。"
      }
    ],
    "sources": [
      {
        "path": "docs/maintainer/项目设计与实施归档.md",
        "role": "9月18日GLM与DeepSeek两条实际桌面验收及最终接受"
      },
      {
        "path": "src/AiCliProfileManager/Support/DesktopBridge/BackgroundChildLinks.cs",
        "role": "父子身份与有界协作元数据"
      },
      {
        "path": "src/AiCliProfileManager/Support/DesktopBridge/RpcTransport.BackgroundChildren.cs",
        "role": "异步进度、问题投递和精确控制"
      },
      {
        "path": "src/AiCliProfileManager/Support/DesktopBridge/RpcTransport.OpenAiChild.cs",
        "role": "官方OpenAI子会话入口"
      }
    ],
    "verification": [
      "Owner于2026-09-18接受GLM与DeepSeek父任务各自的实际桌面闭环，运行发行3b7600a159b9ccf5；七文件、已加载进程和经济路由分别留证。",
      "每条链中的Luna High子会话均保持同一thread/session完成3轮，包含不重复提供原信息的上下文延续、提问回复和最终汇总；GLM链还展示了公开进度。",
      "GLM曾把一个非待答消息放进reply_to，被准确拒绝后改为同一子会话的普通续问成功；这证明错误可定位和修正，不是零错误声明。",
      "本页仅回读这些已存在的Owner证据，没有重启桌面或运行新的云端子会话；其他Owner未提交的Gemini接入被排除。",
      "6ef0e67dbff75135 的错误→纠错→五字段协议回归属旧阶段；后续 562b29bf4a6ac0af 安装启用 Sol/Astra 双档和官方模型目录连续性，2026-09-24T04:59Z 主 GUI 进程的 Bridge 路径已读回同版。协议合成响应不是真实厂商 E2E，新父工具 schema 和新分支厂商调用仍另验。",
    ],
    "relation": "原生桌面模块负责模型进入既有工作界面，本模块负责同一父子线程的持续协作；程序化run及Toolkit取消是独立运行合同，不共用一个假成功状态。",
    readerStatus: "GLM和DeepSeek父任务与同一OpenAI子会话的往返已实际验收；其他组合仍需自己的证据，不因创建成功就称工作完成。"
  },
];

export const project = aiCliProfileManagerProject;
export const modules = aiCliProfileManagerModules;
