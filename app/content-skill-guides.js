function guide(glossary, failures) {
  return { glossary, failures };
}

export const skillGuides = {
  "personal-media": guide([
    ["FTS（全文检索）", "SQLite 直接按描述、文件名、OCR 或 ASR 文本查找，不需要逐条读完整媒体清单。"],
    ["Authority locator（权威原件路径）", "指向真实照片、视频或录音原件的本地路径；返回给用户前必须确认文件仍存在。"],
    ["Hardlink（硬链接）", "临时浏览目录里指向同一份磁盘数据的文件入口，不复制原件字节；删除浏览目录不会删除原件。"],
    ["Browse folder（临时浏览目录）", "为了让用户在文件管理器里浏览一组结果而临时生成的受管文件夹。"],
    ["Private item（私密媒体项）", "默认不出现在查询结果；只有用户明确要求包含时才读取。"]
  ], [
    ["零匹配", "只说明当前受管目录在现有过滤条件下没找到。", "列出实际使用的过滤条件以及日期未知、私密项或地点未复核等覆盖缺口，不扩大为全盘扫描。"],
    ["原件路径失效", "不把旧 locator 继续返回。", "重新构建或修复媒体目录后再查；只核对会影响当前结果的候选。"],
    ["临时浏览目录部分失败", "返回已创建数量和跳过项，不说全部成功。", "只清理本次精确受管目录，再按同一查询重建。"]
  ]),
  "personal-materials": guide([
    ["Locator（原件定位记录）", "保存非媒体原件的真实路径、hash 和可打开状态，用来在以后重新找到同一文件。"],
    ["Hash drift（文件指纹变化）", "文件当前 SHA-256 与定位记录不一致，可能被替换或修改。"],
    ["Discover（有界发现）", "现有 locator 失效时，只在获准位置内寻找少量候选，不做全盘索引。"],
    ["Open-discovered（打开新发现原件）", "先把发现候选与事实绑定，再打开；不靠模糊路径直接猜。"]
  ], [
    ["没有候选", "报告检查过的范围和上限。", "由用户补充一个真正能缩小范围的线索，或明确批准新的位置。"],
    ["Hash drift", "拒绝把旧记录当当前原件。", "重新发现并核对后生成新的定位记录。"],
    ["输入其实是媒体", "停止材料库路线。", "交给 personal-media 查照片、视频和录音。"]
  ]),
  "wechat-direct": guide([
    ["Context（对话上下文）", "围绕一条消息读取前后小窗口、回复关系和相关媒体，而不是一次加载全部历史。"],
    ["sync-contact（具名联系人归档）", "只同步一个明确联系人或群的历史，形成可重放的本地增量归档。"],
    ["Cache miss（缓存未命中）", "当前朋友圈缓存没有目标内容，不等于账号里永久不存在。"],
    ["Native order（原生顺序）", "按微信本身的时间和消息标识排序，不由模型重新猜顺序。"]
  ], [
    ["联系人不唯一", "停止同步，避免把两个同名对象混在一起。", "使用账号、群 ID 或更精确的可验证身份重新选择。"],
    ["朋友圈缓存未命中", "不回答“没有”。", "让用户在正确账号打开一次目标页面后，再读取当前缓存。"],
    ["媒体无法打开", "保留消息上下文并标明媒体缺口。", "核对原生 media locator，语音需要时交给 chinese-asr。"]
  ]),
  "google-workspace-direct": guide([
    ["Provider（固定服务入口）", "PCConfig 中已经绑定账号和 OAuth 的唯一 Gmail、Drive、Calendar 接口。"],
    ["Operation（精确操作）", "Provider 明确暴露的一项能力，例如搜索邮件、导出文档或读取事件。"],
    ["Drive export（原生文档导出）", "Google Docs 不能当普通文件下载，必须通过 Drive export 转成目标格式。"],
    ["Read-back（正式回读）", "写入后用同一个 Provider 重新读取对象，确认外部状态真的改变。"]
  ], [
    ["Provider 未配置或登录失效", "如实报告当前账号能力不可用，不换账号。", "修复现有 Provider 绑定后重新执行原操作。"],
    ["Operation 不存在", "不静默改走浏览器、公共 Connector 或 raw token。", "由 Provider Owner 补窄 operation 和验收，或明确报告不支持。"],
    ["瞬时超时", "同参数最多进行一次合理重试。", "继续失败则保留原错误和对象，不创建第二 Provider。"]
  ]),
  "chinese-asr": guide([
    ["ASR（自动语音识别）", "把音频中的中文语音转换成带时间信息的文本。"],
    ["Speaker cluster（匿名说话人簇）", "模型把相似声音分组的匿名标签，不等于真实人数或姓名。"],
    ["person:self（本人候选）", "只判断精确句段是否支持用户本人说话，结果可反驳，不是法律身份。"],
    ["Held-out attribution（留出样本归属）", "用未参与声纹建档的句段比较，避免拿同源样本自证。"],
    ["Objective sidecar（客观结果侧车）", "记录输入 hash、引擎、job、状态和输出路径的结构化证据，不替代转写正文。"],
    ["Strict / long-strict（严格 / 长音频模式）", "普通录音和长录音的正式处理路线，分别控制分段、时间戳和恢复。"]
  ], [
    ["等待超时", "只表示当前轮询时间到了，不等于识别失败。", "复用返回的 job 继续查询，禁止盲目重新提交。"],
    ["空文本", "不能证明音频没有说话。", "检查解码、VAD、声道、时间范围和引擎状态，保留 unknown。"],
    ["说话人证据不足", "保持匿名 cluster 和 unknown，不强行命名。", "只选择清晰、足够长、时间戳准确且与建档源独立的句段补证。"],
    ["云路线失败", "不能伪装成本地成功或反过来。", "分别报告本地与云证据，原音频始终是最高事实。"]
  ]),
  "localocr": guide([
    ["OCR（光学字符识别）", "从图片或扫描 PDF 中读取文字。"],
    ["Engine（识别引擎）", "实际执行 OCR 的模型路线；auto 会根据输入选择普通 OCR 或结构化版面能力。"],
    ["Route（处理路线）", "输入最终走了普通 OCR、结构化识别或其他正式路径。"],
    ["Job（识别任务）", "一次提交的稳定任务 ID；timeout 后用它继续查询，不重复创建。"],
    ["Objective sidecar（客观结果侧车）", "记录输入 hash、识别状态、完整性、结果是否足够以及输出文件。"],
    ["Structure（结构化版面）", "保留表格、公式、段落、坐标等页面结构，而不只输出一串文字。"]
  ], [
    ["Wrapper timeout 124", "表示等待时间到，不等于 OCR 失败。", "使用已返回 job 查询最终状态。"],
    ["结果空白", "不自动写成“图片没有文字”。", "检查图片解码、模型、路由、坐标和 objective 状态，必要时再由原生视觉补读并明确标来源。"],
    ["GPU Broker 不可用", "停止重型加载，避免多个模型抢 GPU。", "修复 Broker 或等现有租约释放，再按同一 job/输入继续。"],
    ["服务离线", "显示当前 runtime 不可用，不判定 Skill 永久失效。", "通过现行 doctor 和隐藏服务入口恢复，随后跑小输入 E2E。"]
  ]),
  "personal-health": guide([
    ["CURRENT（当前健康底色）", "只保留会改变健康回答的现行病史、用药、过敏、检查趋势和生活背景。"],
    ["Capture（资料采集）", "把新报告或设备数据按项目入口读取并保留原件来源。"],
    ["Brief（健康摘要）", "从新资料中提取对当前判断有用的短摘要，不能替代原报告。"],
    ["Health Owner（健康事实责任）", "审核新事实、纠正冲突并决定 CURRENT 是否更新。"],
    ["Unknown（未知）", "没有足够事实时明确保留，不由模型补全。"]
  ], [
    ["CURRENT 与新报告冲突", "不静默覆盖。", "打开原件和来源，由 Health Owner 判断时间、版本和事实。"],
    ["高风险问题", "不只依赖个人背景和模型常识。", "核对最新权威医学指导，并清楚区分事实、医生意见和模型建议。"],
    ["设备刷新失败", "保留旧 CURRENT 和失败时间，不写入半截数据。", "修复已登记设备入口后重新 foreground capture。"]
  ]),
  "md-to-pdf": guide([
    ["Preset（预设样式）", "一组已验证的纸张、边距、字体和分页规则。"],
    ["Profile（文档配置）", "针对文档或演示语义选择的样式与输出参数。"],
    ["Fallback（后备路线）", "首选浏览器转换不可用时才启用的 Edge CLI 路线，验收要求不降低。"],
    ["Source hash（源文件指纹）", "证明 PDF 对应的是哪一版 Markdown，防止拿旧输出冒充。"]
  ], [
    ["浏览器转换失败", "保留首个错误，不修改正文。", "在兼容条件成立时走正式 Edge fallback，并执行相同页数和文本检查。"],
    ["页数或中文文本不符", "PDF 不通过。", "调整 CSS/分页配置后重新生成，不手改最终 PDF。"],
    ["旧输出存在", "不能仅因目标文件存在就判完成。", "核对 source hash、修改时间、大小和当前渲染。"]
  ]),
  "pdf-render-safe": guide([
    ["DPI（每英寸像素）", "决定页面图片清晰度；先低成本全量，再只提高可疑页。"],
    ["Contact sheet（页面总览图）", "把多页缩略图放在一张图上，快速发现空白、裁切和版式漂移。"],
    ["Renderer（渲染器）", "真正把 PDF 变成图片的程序；只接受已验证的 Poppler 原生入口。"],
    ["Prefix（输出前缀）", "标识本次页面图片集合，用于只清理属于这次任务的旧图。"],
    ["Stale cleanup（陈旧输出清理）", "删除同 prefix 的上一轮页面图，避免新旧混在一起。"]
  ], [
    ["渲染器不是正式实现", "拒绝 shell wrapper 或未知程序。", "切回登记的 Poppler 路径并重新生成 report。"],
    ["页面图数量或 hash 不一致", "不进入目检通过。", "清理同 prefix 输出，重新渲染并核对页数。"],
    ["渲染成功但内容不对", "明确区分视觉渲染和语义验收。", "同时检查 PDF 文本、页数和关键页面原图。"]
  ]),
  "mojibake-doctor": guide([
    ["Raw bytes（原始字节）", "文件真实存储的字节，是判断编码问题的起点。"],
    ["BOM（字节顺序标记）", "文件开头用于提示编码的特殊字节；损坏或重复会造成解析异常。"],
    ["Double transcoding（二次错误转码）", "文本先被错误解码，再把错误字符重新编码，形成更难恢复的乱码。"],
    ["Repair plan（修复计划）", "Apply 前只读列出将怎样把原字节转换成目标编码。"],
    ["Atomic replace（原子替换）", "新文件完整写好后一次替换旧文件，避免中途留下半文件。"]
  ], [
    ["无法确定原编码", "不直接 Apply。", "保留原字节，输出多个候选和能推翻各候选的证据。"],
    ["信息已被替换字符永久丢失", "不猜原文。", "回到 Git、备份或可重建 source。"],
    ["Apply 后验证不通过", "保留 backup 并停止扩散。", "原子恢复原字节，再调整修复计划。"]
  ]),
  "file-intake-router": guide([
    ["Native reader（原生读取器）", "专门理解 Word、PDF、表格、演示文稿、图片或音频的正式工具。"],
    ["Structured extraction（结构化提取）", "先从可编辑 PDF、Office 或表格中直接读取文字、单元格和对象，比 OCR 更准确。"],
    ["Inventory（最小文件清单）", "只列出判断路由所需的文件类型和结构，不读取整个目录。"],
    ["Handoff（交接）", "选出 reader 后由它接管实际内容处理，Router 自己退出。"]
  ], [
    ["文件类型已经明确", "Router 不触发，避免多一层。", "直接调用对应 native reader。"],
    ["压缩包或目录过大", "只检查满足用户目标的子集。", "先用名称、扩展名和结构缩小范围，再交 reader。"],
    ["扫描件与文本 PDF 不清", "不把全部内容直接 OCR。", "先测试是否有可提取文本，只有扫描页进入 LocalOCR。"]
  ]),
  "media-person-self": guide([
    ["person:self（本人候选）", "只回答用户是否出现在这个具名媒体中，不识别其他人。"],
    ["Face box（人脸框）", "照片中检测到的人脸位置，用来说明哪个可见人物是本人候选。"],
    ["Voice profile（本人声纹档案）", "本地、可撤销的本人语音模板；删除或替换后未来判断随之变化。"],
    ["Coverage（证据覆盖）", "实际比较了哪些脸或哪些音频时间段，未覆盖内容不能自动归属。"],
    ["Rebuttable（可反驳）", "结果只是当前模型与证据支持的判断，用户或更好证据可以推翻。"]
  ], [
    ["没有检测到脸或语音太短", "输出 no face 或 unknown，不写本人不存在。", "换更清晰原件或选择准确时间段后再比较。"],
    ["Profile 缺失、替换或同源", "失败关闭身份归属。", "使用独立留出 profile，不能从未知目标现场建档自证。"],
    ["视觉和语音结论冲突", "分别报告，不合并成一个身份结论。", "保留各自原件、框、时间段和覆盖缺口。"]
  ]),
  "local-secret-broker": guide([
    ["SecretRef（秘密引用）", "指向 Password Center 中某个秘密的安全标识，不包含明文值。"],
    ["Metadata-only lookup（仅元数据查询）", "只回答是否存在、账号和状态，不读取密码、key 或 token。"],
    ["Blind fill（盲填）", "把秘密直接填入目标应用，模型和聊天看不到明文。"],
    ["Capability（单次受保护能力）", "只允许一个精确凭据动作的短时授权。"],
    ["Device untrusted（设备不可信）", "活动保护链确认异常后的状态；秘密相关重大动作全部失败关闭。"]
  ], [
    ["目标不唯一", "不猜账号或 secret。", "先做 metadata lookup，让用户或事实选定唯一对象。"],
    ["需要明文但没有明确请求或人类因子", "停止 reveal。", "取得对应明确请求和已登记因子后重新派生 capability。"],
    ["设备不可信", "不读取、不填充、不恢复秘密。", "先由保护 Owner 完成 containment 恢复和正式 read-back。"]
  ]),
  "authorization-file-broker": guide([
    ["Bundle（加密包）", "包含加密后的文件、目录结构和校验信息，不包含可直接读取的明文。"],
    ["Authenticated state（已认证状态）", "中断恢复时用于证明之前步骤已完成且没有被篡改的状态。"],
    ["Receipt（执行回执）", "只记录对象、结果和校验，不包含文件正文或 key。"],
    ["Idempotent decrypt（幂等解密）", "重复执行不会覆盖已经存在的冲突文件或制造不同结果。"]
  ], [
    ["源文件在加密中途变化", "立即失败关闭。", "重新选择当前源并从新事务开始，旧 bundle 不冒充完整。"],
    ["Bundle 被篡改", "Verify 和 Decrypt 均拒绝。", "恢复未损坏备份或重新加密原源。"],
    ["目标存在同名文件", "保留现有文件并报告冲突。", "用户选择新目录或明确处理冲突后再解密。"]
  ]),
  "vault-workflow": guide([
    ["Vault（独立加密库）", "与 Password Center 分开的加密文件和 Key 私有发布体系。"],
    ["Profile（操作配置）", "固定本次 Vault 的路径、目标和模式，不包含密码明文。"],
    ["Doctor（环境体检）", "在写入前检查工具、目标、权限和恢复条件。"],
    ["WhatIf（只读预演）", "显示将发生什么但不实际修改。"],
    ["VerifyRemote（远端核验）", "从 PRIVATE 远端重新读取提交和加密制品，确认发布收口。"]
  ], [
    ["Doctor 或 WhatIf 失败", "不进入真实写入。", "修复具体路径、工具、目标可见性或恢复条件后重跑。"],
    ["目标不是 PRIVATE", "停止发布，不能把加密边界等同于可公开。", "改用已证 PRIVATE 目标并重新 admission。"],
    ["密码 prompt 被取消", "只暂停当前动作。", "用户准备好后重新从正式入口执行，不保存或猜密码。"]
  ]),
  "project-entry-gate": guide([
    ["Admission（仓库准入结果）", "把仓库身份、公开性、分支、远端、worktree、脏改动和同步状态放进一个结构化结果，供后续决策。"],
    ["Worktree（Git 工作树）", "同一仓库的一个独立 checkout，用来隔离并行改动；它不是任务台账。"],
    ["Upstream（上游分支）", "当前本地分支默认推送和比较的远端分支。"],
    ["Ahead / behind（领先 / 落后提交数）", "本地相对 upstream 多了或少了多少提交。"],
    ["Freshness（证据新鲜度）", "Cached 只用缓存；Live metadata 查 GitHub 当前信息；Refresh refs 更新远端引用；For publication 同时要求两层。"],
    ["PUBLIC exposure gate（公开暴露门）", "公开仓库提交前检查页面和源码是否含不应公开的内容。"]
  ], [
    ["仓库路径、remote 或 identity 不匹配", "Admission BLOCK，不继续推送。", "修复项目登记或使用精确 TargetWorktree，再重新验证。"],
    ["工作树有未说明改动", "显示 dirty，并要求定向处理。", "保留他人改动，只 stage 当前任务文件；不能 git add 全部。"],
    ["本地落后或非 fast-forward", "停止 normal push。", "Fetch 后合并或 rebase，解决冲突并重新测试，禁止默认 force-push。"],
    ["GitHub 网络暂不可达", "如实标记 live evidence unavailable。", "可继续安全本地工作，但发布前必须重新取得 live metadata 和 refs。"]
  ]),
  "personal-panel-refresh": guide([
    ["Source Owner（来源项目责任人）", "先完成来源项目修改、测试、发布和正式回读，再判断网站是否需要跟进。"],
    ["Impact candidate（影响候选）", "Changed path 命中项目清单，只说明可能影响，不自动创建任务。"],
    ["Material change（实质变化）", "不更新会让看板事实、解释、边界、成熟度或用户决策变错的变化。"],
    ["Read-back commit（正式回读提交）", "来源项目已经发布并从真实远端重新确认的提交。"],
    ["Saved local Git project（已保存本地 Git 项目）", "桌面 AI 工作台能用准确 project id 创建独立 worktree（工作树）任务的项目登记。"],
    ["Fresh website task（全新网站任务）", "为一次实质刷新新建、只处理一个目标的独立任务；完成后不复用。"]
  ], [
    ["只命中路径，没有实质影响", "输出 impact candidate，但 task_required=false。", "记录候选，等下一次实质更新一起维护，不开任务。"],
    ["来源仍是 candidate、draft 或未 read-back", "停止网站交接。", "等 Source Owner 完成正式发布和 read-back 后重新评估。"],
    ["没有准确 saved local Git project", "返回 saved_local_git_project_missing，并且不创建任务。", "把 wly0829.cn 保存为准确本地 Git project 后，下一个 material event 再创建；不能降级到 projectless 或 .agents。"],
    ["同一来源提交已经交接", "拒绝创建重复任务。", "使用现有交接结果或等新的 read-back commit。"]
  ]),
  "control-plane-doctor": guide([
    ["Health（健康状态）", "当前被检查 Owner 是否可读、结构完整、关键入口可用。"],
    ["Convergence（收敛状态）", "源码、安装、活动状态和真实目标是否指向同一个现行结果。"],
    ["Drift（漂移）", "登记事实、机器状态、仓库或安装与期望不一致。"],
    ["Cached warning（缓存警告）", "结果来自缓存，可能需要 live refresh；它不是自动 BLOCK。"],
    ["Provider（Owner 入口）", "各控制面负责返回自身动态事实的固定脚本或 API。"]
  ], [
    ["某个 Owner Provider 不可读", "该 Owner 检查显示 block，其余 Owner 结果仍分别保留。", "修复对应 Provider，不让 Doctor 自己改系统。"],
    ["只有 cached evidence", "显示 warning 和观察时间。", "用户或后续任务需要发布判断时，调用对应 live 模式。"],
    ["发现 drift", "Doctor 不自动修。", "退出 Doctor，把精确 finding 交给真实 Owner 的修复入口。"]
  ]),
  "tailscale-safe-exposure": guide([
    ["Tailnet（Tailscale 私有网络）", "登录同一 Tailscale 网络的受控设备集合。"],
    ["Serve（私网服务入口）", "只在 tailnet 内把一个本地服务暴露成 HTTPS 或端口入口。"],
    ["Funnel（公网入口）", "把服务公开到互联网；默认禁止，除非用户明确要求。"],
    ["Peer firewall（对端防火墙）", "只允许指定 Tailscale peer 访问指定端口。"],
    ["DERP / Peer Relay（官方中继 / 对端中继）", "设备无法直接连接时使用的两类中转路径。"],
    ["Loopback（本机回环地址）", "127.0.0.1 等只允许本机访问的监听地址。"]
  ], [
    ["身份、IP 或接口不匹配", "停止写入，禁止扩大到 Any 或本地子网。", "重新读取当前 Tailscale identity 和具名 peer。"],
    ["Read-back 不符合预期", "按预记 preimage 回滚当前单一机制。", "恢复后再选择 Serve、firewall 或反向端口中的一个。"],
    ["没有具名 peer 验收", "不能声称连接 E2E 通过。", "由明确 peer 访问一次，区分 direct、DERP 和 Peer Relay。"]
  ]),
  "llm-backend-toolkit": guide([
    ["Backend（模型后端）", "由 live registry 登记的本地或云模型执行入口。"],
    ["Verifier（独立验收器）", "不依赖后端自报、可以客观检查任务结果的方法。"],
    ["Job（任务记录）", "提交后用于读取状态和结果的稳定 ID。"],
    ["Registry（后端清单）", "记录当前可用 route、模型、隐私和状态；必须现场读取。"],
    ["Receipt（执行回执）", "记录请求、后端、状态和结果位置，失败也保留。"]
  ], [
    ["任务没有独立 verifier", "不使用额外 backend。", "改由顶层模型或原生子代理完成。"],
    ["Route 当前 pending 或 failed closed", "不自动 fallback 到另一模型。", "选择另一条有明确净收益且符合隐私边界的正式 route，或回到原生能力。"],
    ["读取等待超时", "保留 job 和 receipt，不重复 submit。", "按推荐时间继续查询同一个 job。"]
  ]),
  "native-economy-routing": guide([
    ["Root / child（根代理 / 子代理）", "Root 负责目标、风险和最终集成；child 只负责被分配的有界支路。"],
    ["Effort（思考等级）", "模型在任务上允许使用的推理强度，child 不能高于父级。"],
    ["Spawn（创建子代理）", "在当前任务树中启动一个原生 child，不是创建用户侧顶层对话。"],
    ["Steer（用户转向）", "用户新增或改变要求，需要重新判断当前范围和并行。"],
    ["TOCTOU（检查到执行之间的漂移）", "真正 spawn 前再次核对身份、generation、模型和参数，避免使用已经过期的前置判断。"],
    ["0–10 决策", "每个父代理按质量和净收益决定直属 child 数量；0 合法，不是默认。"]
  ], [
    ["宿主身份或对话绑定缺失", "关闭 spawn，但主任务和普通工具继续。", "取得宿主 verified 身份，或由用户明确 model/effort 后建立并回读绑定。"],
    ["Generation 或合同 hash 变化", "旧路由判断失效。", "从新的活动 generation 完整重读经济路由节后再决定。"],
    ["Child 中断", "不把 partial 当 complete。", "优先恢复原 session；无法恢复才重跑或换更强模型。"],
    ["槽位满", "当前不再 spawn。", "Root 继续不冲突工作；child terminal 释放槽位后重新判断。"]
  ]),
  "token-budget-advisor": guide([
    ["Token（模型计数单位）", "模型读取文本时使用的计量单位，不等同于汉字数、单词数或最终账单。"],
    ["Tokenizer / encoding（分词器 / 编码）", "把同一段文本切成 token 的具体算法；不同模型编码可能得到不同数字。"],
    ["Visible text（可见文本）", "用户明确提供并允许读取的正文或文件，不包含隐藏 system、tools、reasoning 和运行时上下文。"],
    ["Conservative envelope（保守区间）", "没有精确模型编码时给出的安全上下界，避免假装精确。"],
    ["Usage telemetry（真实用量遥测）", "平台或运行回执给出的实际 token 用量，优先级高于离线估算。"]
  ], [
    ["没有明确 token 问题或数值上限", "Skill 不触发。", "继续原任务，不制造预算门或建议删上下文。"],
    ["缺少精确模型编码", "不输出伪精确单值。", "给保守区间并写明方法；只有临界决策时再选明确 encoding 精算。"],
    ["输入包含隐藏或不可见上下文", "只统计已知可见部分。", "明确列出排除项，不猜 system、tools、reasoning 或账单。"]
  ])
};

export const skillOutcomes = {
  "personal-media": {
    value: "让我能用一句普通描述快速找到真实照片、视频或录音，而不是手工翻几万个文件；同时避免为了浏览结果复制原件、误删原件或把私密媒体带出来。",
    changes: ["线索足够时，只返回少量最相关原件并说明为什么匹配。", "结果达到 limit 时明确说是前 N 个，不冒充完整集合。", "用户没明确要求私密媒体时自动排除。", "需要文件夹浏览时创建可安全清理的 hardlink 目录，不复制和删除原件。"]
  },
  "personal-materials": {
    value: "让我忘记路径时仍能找到真正的合同、报告或其他非媒体原件，并阻止系统沿用已经失效或被替换的旧路径。",
    changes: ["可靠 locator 仍有效就直接打开。", "路径或 hash 变化就停止，不把旧记录当原件。", "路径未知时只在获准位置做有界发现。", "发现输入其实是照片、视频或录音时改走个人媒体能力。"]
  },
  "wechat-direct": {
    value: "让我基于微信里真实的前后文、回复关系和媒体回答问题，而不是靠记忆猜；需要长期保存时也只归档一个明确联系人或群，不复制整个账号。",
    changes: ["普通问题只读取相关消息的小窗口。", "用户明确要完整历史时才同步一个具名目标。", "语音内容需要文字时交给中文 ASR。", "朋友圈 cache miss 时不回答“没有”，而是说明需要刷新当前账号缓存。"]
  },
  "google-workspace-direct": {
    value: "让我稳定使用自己的 Gmail、Drive 和日历，同时避免模型静默换账号、绕到浏览器或用未经登记的 token 操作外部数据。",
    changes: ["普通查询默认只读。", "原生 Google Docs 自动选择 export，而不是错误普通下载。", "Provider 没有该写操作时停止，不伪装可写。", "删除、发送、邀请或公开分享必须有用户对精确动作的授权。"]
  },
  "chinese-asr": {
    value: "把无法快速浏览的中文录音变成可搜索、带时间位置的文字，并在需要时给出可反驳的说话人证据；避免把模型分组误写成真实姓名或人数。",
    changes: ["普通和长录音选择不同正式模式。", "等待超时后继续查询原 job，不重复提交。", "证据不足时保持 anonymous/unknown，不强行命名。", "重要录音把本地与授权云证据分开报告，原音频始终最高。"]
  },
  "localocr": {
    value: "让我能读取扫描 PDF、表格、公式和印章等普通视觉不容易准确处理的材料，并得到可定位、可核验的文字和版面结果。",
    changes: ["一两张清晰截图仍用原生视觉，复杂或批量材料才进 OCR。", "需要表格和坐标时选择 Structure。", "Timeout 只继续原 job，不判失败。", "空结果会检查解码、路由和 objective，不直接写“没有文字”。"]
  },
  "personal-health": {
    value: "让健康回答真正结合我的现行病史、用药、过敏和检查趋势，同时避免旧资料、模型建议和医生结论混在一起。",
    changes: ["普通问题只读取 CURRENT。", "高风险问题额外核对最新权威医学指导。", "新报告或设备数据先采集并由 Health Owner 审核，再决定是否更新 CURRENT。", "证据不足时明确 Unknown，不自动补全。"]
  },
  "md-to-pdf": {
    value: "把 Markdown 稳定变成可交付 PDF，并防止页数、中文字体、分页或旧输出看起来成功但实际不对。",
    changes: ["根据文档用途选择正式 preset/profile。", "首选路线失败且兼容条件成立才走 fallback。", "源 hash、页数或关键文本不符就判失败。", "生成后交给 PDF 渲染能力做真实页面目检。"]
  },
  "pdf-render-safe": {
    value: "让我能肉眼发现 PDF 的空白页、裁切、错位和旧页面图，而不是只相信文件能打开或转换命令返回成功。",
    changes: ["先低 DPI 全量浏览，再只提高可疑页清晰度。", "每次输出绑定 source hash 和页数。", "只清理当前 prefix 的旧页面图。", "页面图和文本检查都通过后才认为 PDF 验收完成。"]
  },
  "mojibake-doctor": {
    value: "在中文乱码时尽量找回可恢复的原文，同时保留原字节，避免一次错误转码把文件永久改坏。",
    changes: ["先读取 raw bytes 并只给 repair plan。", "不能确定编码时不 Apply。", "确认后以 hash-pinned transaction 原子替换。", "验证失败立即从 backup 恢复，而不是继续批量改。"]
  },
  "file-intake-router": {
    value: "当一次收到多种文件时，它避免我用错工具，例如把可直接提取文字的 PDF 全部做 OCR；它只负责选对读取器，然后退出。",
    changes: ["单个已知文件直接交对应 reader，不增加一层。", "Office、表格和文本 PDF 优先结构化提取。", "只有扫描页进入 LocalOCR。", "文件夹过大时只检查与当前问题有关的子集。"]
  },
  "media-person-self": {
    value: "在确实需要判断“照片里是不是我、录音里有没有我的声音”时给出有位置和覆盖范围的可反驳证据，同时阻止大范围扫脸、扫声纹或识别其他人。",
    changes: ["只处理具名文件或很短列表。", "视觉返回 face box，语音返回精确时间段。", "Profile、质量或覆盖不足时输出 Unknown。", "视觉和语音冲突时分开报告，不合并成身份定论。"]
  },
  "local-secret-broker": {
    value: "让我能确认和使用本机密码、key 或 token，却尽量不让秘密明文进入模型、聊天、日志、命令行参数和普通文件。",
    changes: ["询问“有没有、账号是什么”时只做 metadata lookup。", "程序需要使用秘密时优先 blind fill。", "只有明确要求明文并通过人类因子时才 reveal 单字段。", "设备不可信时所有秘密重大动作停止。"]
  },
  "authorization-file-broker": {
    value: "让我能批量加密或恢复指定文件，并在中断、源文件变化、bundle 篡改和同名冲突时保护原件不被覆盖或删除。",
    changes: ["只处理用户点名的路径。", "加密前后绑定源 hash。", "Verify 不落地明文。", "解密冲突时保留已有文件并报告，不自动覆盖。"]
  },
  "vault-workflow": {
    value: "让我能维护独立的 Vault 和 Key 私有备份，同时保证密码只在本机人工输入、发布目标确实 PRIVATE、失败前有预演和恢复路线。",
    changes: ["写入前必须通过 Doctor、Plan 和 WhatIf。", "目标不是 PRIVATE 就停止。", "密码不进入模型和参数。", "发布后通过 VerifyRemote 回读提交和加密制品。"]
  },
  "project-entry-gate": {
    value: "它把 Git 操作从“凭感觉直接做”变成明确的继续、先处理再继续或停止：防止改错仓库、把私密内容推到公开仓库、覆盖别人未提交的工作、在落后分支上推送，或把提交推到错误远端。",
    changes: ["仓库、remote（远端地址）、branch（分支）和 upstream（上游分支）正确且同步安全时，允许继续本地实施或正常推送。", "有 dirty work（未提交改动）时要求保留，并只 stage（暂存）当前任务文件。", "本地落后、分叉或不是 fast-forward（快进推送）时停止推送，先同步和解决冲突。", "PUBLIC（公开）仓库存在泄露风险时阻止发布。", "网络无法取得 live evidence（实时证据）时可以继续安全本地工作，但发布必须等 live read-back（实时回读）。"]
  },
  "personal-panel-refresh": {
    value: "它让未来几十个项目的新对话都能意识到“这次发布可能让个人看板说错话”，同时用 material threshold（实质阈值）阻止每个小改动都创建网站任务；既解决漏更新，也避免异步任务泛滥。",
    changes: ["来源没有正式 publish/read-back（发布/回读）时不评估网站。", "Changed path（变化路径）命中只记为 impact candidate（影响候选），不会自动开任务。", "Source Owner 确认看板会实质失真后，task_required 才变成 true。", "达到阈值后只创建一个 fresh independent website task（全新独立网站任务）。", "wly0829.cn 没有准确 saved local Git project 时失败关闭，不误建 projectless 或 .agents 任务。"]
  },
  "control-plane-doctor": {
    value: "当我怀疑三个控制面“哪里坏了”时，它把问题定位到真正负责的 Owner，并区分警告和阻塞，避免在错误仓库里乱修。",
    changes: ["只检查用户点名的 Owner。", "健康且收敛时给出可继续结论。", "只有缓存证据时给 warning，不夸大成 block。", "发现 drift 或 Provider 失败时，把精确 finding 交给对应 Owner；Doctor 自己不改。"]
  },
  "tailscale-safe-exposure": {
    value: "让我能把一个本机服务只开放给需要的 Tailscale 设备，并在连接异常时知道是直连还是中继；避免为了能访问就把端口暴露给所有网络。",
    changes: ["默认只选 Serve、peer firewall 或反向端口中的一个最小机制。", "Funnel 公网暴露默认禁止。", "身份、IP 或接口不一致时停止，不扩大范围。", "Read-back 失败就按 preimage 回滚。", "没有具名 peer 实测时不宣称 E2E。"]
  },
  "llm-backend-toolkit": {
    value: "在确实有一个封闭、可客观验收的子任务时，它让我安全利用额外模型后端；避免把所有任务都扔给第三方模型、失败后静默换模型或把后端自报当完成。",
    changes: ["没有独立 verifier 时不使用。", "先读取 live registry 再选 route。", "提交后保存 job 和 receipt。", "超时继续查同一 job，不重复提交。", "结果必须由顶层模型按 verifier 复核。"]
  },
  "native-economy-routing": {
    value: "它决定什么时候开原生子代理可以提高质量或缩短时间，并保证子代理不超出当前模型、授权和任务范围；同时避免主代理开完子代理后原地空等。",
    changes: ["身份、generation 和合同可信后才做 0–10 判断。", "有独立可验且净收益为正的支路时可以 spawn。", "耦合、写冲突或资源风险高时减少并发或用 0。", "Child 只能收窄 scope 和 effort。", "Root 派出 child 后继续战略、集成和其他不冲突工作。"]
  },
  "token-budget-advisor": {
    value: "让我在真正存在上下文或成本数字限制时知道一段可见文本大约占多少 token、是否安全低于上限；同时避免因为对话看起来很长就乱删上下文，或假装知道隐藏提示和正式账单。",
    changes: ["已有平台 usage（真实用量）时直接使用，不重复估算。", "没有精确编码时给保守区间，不伪造单一数字。", "接近上限时才用明确 tokenizer/encoding 精算。", "只统计可见文本，并列出 system、tools、reasoning 等未计入项。", "没有明确计数、比较或数值预算问题时不触发。"]
  }
};
