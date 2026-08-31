import { createProjectSnapshot } from "./project-snapshot.js";

const githubIndexSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T16:53:45Z",
  label: "48 个 live Owner identity 已闭合，45 个本地副本已验证；源 main/origin 与公开 generation 分层回读",
  boundary: "Owner 现场观察于 2026-08-31 16:52 UTC；公开 generation 70efc65c…观察于 16:38 UTC；Admission 只提供证据，不授予 push 权限",
  metrics: [
    { label: "仓库总账", value: "48" },
    { label: "公开 / 私有", value: "27 / 21" },
    { label: "本地 / 仅远端", value: "45 / 3" },
    { label: "当前差异", value: "0 delta · 0 issue" }
  ],
  facts: [
    { label: "源仓库现场", value: "wlyaaaaa/github-local-index 是 PUBLIC；2026-08-31 的 ForPublication（发布前双现场检查）回读 main 与 origin/main 同为 806b668e9b6ff275329d6dfeb76f5239a9182bbe，工作区 clean、ahead/behind=0/0、decision=proceed。" },
    { label: "公开投影", value: "当前公开 generation=70efc65cdfec4b9cb1305ff48086744d，8 份文档共 23090 bytes，previous=d2f364cdf7664c06a34b81b07e5547df；manifest、generation 文档、兼容投影和 pointer 中的 bytes/hash 已逐项回读一致。" },
    { label: "仓库与本地副本", value: "live source 覆盖 48 个仓库身份（27 PUBLIC、21 PRIVATE）和 45 个已验证 clone occurrence；identity coverage 与 clone coverage 均为 complete，剩余 3 个仓库明确为 remote-only。" },
    { label: "现场读取方式", value: "Get-GitOwnerStatus 以零写入、no fetch（不抓取远端引用）返回 execution_status=completed、domain_status=current、baseline=48、observed=48、delta=0、issue=0。" },
    { label: "已接受的过渡", value: "history 保留一项 nonblocking attention：上代到现代的 4 项变化已经被 baseline 接受，其中旧 identity 由 wlyaaaaa/personal-formal-documents 接续、新增 wlyaaaaa/work-delivery-copilot，并补入一项既有仓库本地 root；当前没有未处理 identity delta。" }
  ],
  gaps: [
    "Owner history 只保留窗口内记录，milestone coverage 仍为 partial，并明确 bootstrap_gap 与 retained_window_only；不能据此声称拥有更早的完整里程碑历史。",
    "重大 Git/GitHub 动作源码曾在历史提交 6afc858 对齐旧 C79 基线；当前语义来自 verified current E release。普通 Git identity/admission/normal push 仍可用，但重大动作 consumer 的安装、broker/人类因子 E2E 没有新证据，不能从历史源码回归外推。",
    "本次页面刷新完成了 Owner status、Cognition Source、ForPublication 和 generation 文件闭包的直接回读，但没有真实创建一个新仓库，也没有执行重大动作 broker/人类因子 E2E；新 PRIVATE 创建只按当前源码合同与回归证据说明，不冒充现实动作验收。"
  ]
});

export const githubIndexProject = {
  order: 3,
  slug: "github-index",
  title: "GitHub 总索引",
  route: "/projects/github-index",
  visibility: "公开仓库",
  repositoryNote: "源仓库 wlyaaaaa/github-local-index 是公开仓库。仓库身份、公开性、远端和 clone（本地副本）路径按实际值判断：能改变当前决定且不含 L3+ 私人正文或可复用凭据时，PUBLIC 与 PRIVATE 项目的普通技术事实都可以直接说明；本机 ignored 登记区继续保存完整动态导航。",
  status: "现役；live Owner inventory（现场责任源仓库清单）已闭合为 48 个仓库，delta=0、issue=0；45 个本地 clone（副本）已回读 origin，3 个 remote-only（仅远端仓库）保持显式。",
  statusTone: "mixed",
  cardStatus: "48 个仓库已闭合，45 个本地副本已验证",
  cardStatusTone: "pass",
  ...githubIndexSnapshot,
  summary: "GitHub 总索引是我所有仓库和本地副本的导航与安全收口中心。我可以直接问“新建一个 PRIVATE 仓库”“这个目录会推到哪里”“这个分支算完成了吗”或“这个工作树能删吗”。它会从落盘、创建和登记开始，核对真实远端、可见性、默认分支、所有工作树和候选内容，再把能否传输、内容是否适合公开、当前是否已获授权分开判断。最后我得到明确的继续、警告或阻断结论，以及发布、恢复或清理还缺哪一步。",
  why: "仓库一多，同名目录、旧路径、临时工作树和多个远端很容易混在一起。只看当前目录或一句“已经推送”会漏掉公开泄露、覆盖他人未提交修改、分支落后、提交没有进入远端默认分支，以及临时工作树仍保存独有内容等真实事故。",
  plainExample: "例如我说“新建一个 PRIVATE 仓库”。它先判断这是个人还是工作项目，选择 V 盘正确根目录并建立本地 main 与首个提交；随后只创建本人账号下同名的空 PRIVATE 远端，配置 origin，正常推送 main，再现场回读仓库身份、可见性、真实默认分支和远端可达性。仓库真实存在并完成首次默认分支收敛后才进入总账，不为空目录预登记。",
  result: "最终得到的不是一张好看的项目列表，而是一份可行动的证据：正确仓库与远端、当前可见性、默认分支、全部工作树和分支状态、继续/警告/阻断原因、公开发布还缺什么，以及出错后应从哪里恢复或补证。新仓库还会得到落盘位置、创建回读、登记结果和首次默认分支收敛；真正发布后仍必须从远端默认分支再次回读。",
  readerStates: {
    pass: "仓库身份、可见性、远端、默认分支、相关工作树和发布候选都已现场核对时，表示没有 Git 入场阻断；是否提交、推送或发布仍由当前任务授权和候选内容审查决定。",
    problem: "发现未提交修改、分支落后或分叉、工作树独有内容、索引漂移或公开风险时，给出警告或阻断及具体处理项，不覆盖并发施工。",
    unavailable: "GitHub、远端引用或本地仓库证据不可取得时，可以继续不依赖远端的安全只读或本地工作，但身份、同步和发布结论保持 Unknown（证据不足）。"
  },
  productPrinciples: [
    { title: "先确认真实仓库身份", detail: "目录名、标题和旧缓存不能证明远端是谁；写入前核对远端、默认分支和 Git 公共目录。" },
    { title: "检查全部工作树和分支", detail: "未提交修改、独有提交和仍被任务使用的工作树都要保留，不能只看当前目录是否干净。" },
    { title: "传输、公开内容和授权分开判断", detail: "网络能推不等于内容适合公开，内容适合公开也不等于当前任务已获授权。" },
    { title: "默认分支回读才算交付", detail: "功能分支自己的上游为零不够；目标提交必须从远端真实默认分支可达并再次回读。" },
    { title: "公开判断看实际内容", detail: "日志、数据库、路径和个人来源不因类型自动敏感；活动全局分级只在出现 L3+ 正面证据时限制具体值，可复用秘密始终阻断。" },
    { title: "证据不足只阻断高影响动作", detail: "身份、可见性或远端不清时停止发布、删除和迁移，安全的本地工作与只读诊断仍可继续。" },
    { title: "索引只在实质变化时刷新", detail: "仓库身份、可见性、远端、默认分支或长期治理变化才更新总账；不后台监视，也不自动删除任何仓库。" },
    { title: "清理前先证明没有唯一内容", detail: "分支或工作树只有在内容已整合、证明确实冗余，或有明确保留用途和退出条件时才能退役。" }
  ],
  responsibilities: [
    "维护仓库身份、远端、可见性、默认分支和已确认本地 clone（副本）的总账",
    "按需给单个仓库返回当前工作树、分支、脏状态、领先/落后和默认分支整合证据",
    "区分 Git transport（传输条件）、publication（内容发布安全）和用户授权",
    "维护公开安全的索引投影、私有导航登记、全量 Owner 基线和原子 generation（索引代际）",
    "为专门 Owner 分支、冻结历史和必要保留工作树保存精确且可退出的治理依据",
    "在删除分支、工作树或 Git 恢复材料前保留独有内容与默认分支可达性证据",
    "规定新个人仓库、临时工作树和工作项目的默认落盘位置：个人仓库进入 V:\\Personal\\Projects，临时工作树进入 V:\\Personal\\Worktrees，工作项目进入 V:\\Work；V:\\Dev 只兼容旧工作树，Z 盘不放仓库、工作树或唯一副本",
    "把新 PRIVATE 仓库从本地 main 与首个提交、空私有远端创建、origin 配置和首次 push，一直收敛到现场身份/可见性/默认分支回读、Owner 登记与远端默认分支可达"
  ],
  exclusions: [
    "不拥有具体项目的业务语义、源码、启动方式、测试或部署方式",
    "不因为 admission（入场检查）显示 proceed（无阻断）就授予修改、push（推送）或公开发布权限",
    "不拥有本机计划任务、端口、运行时、磁盘迁移和备份恢复事实；这些回到 PCConfig（电脑配置与恢复中心）",
    "不发布可复用凭据和经活动全局分级确认需要保留的 L3+ 具体值；仓库名、路径、日志或数据库字段不因类型自动隐藏",
    "不要求每次普通 commit 或 push 都刷新总索引或写里程碑记录",
    "不运行后台 watcher（持续监视器），不自动 refresh、commit、push 或删除工作树"
  ],
  glossary: [
    { term: "Repository（仓库）", meaning: "一组 Git 历史、分支和工作文件；本地目录名不能单独证明它对应哪个远端仓库。" },
    { term: "Remote（远端）", meaning: "本地仓库配置的网络目标；总索引会把 remote.origin.url 规范化后与预期 GitHub 身份比较。" },
    { term: "Visibility（可见性）", meaning: "GitHub 仓库的 PUBLIC（公开）、PRIVATE（私有）或 INTERNAL（组织内部）状态；不在闭集内就失败关闭。" },
    { term: "Default branch（默认分支）", meaning: "GitHub 认定的主要整合分支，通常是 main；完成证据必须回到真实远端默认分支。" },
    { term: "Worktree（工作树）", meaning: "同一 Git common directory（共享仓库元数据）连接的一个可编辑目录；一个仓库可以同时有多个工作树。" },
    { term: "Upstream（上游跟踪分支）", meaning: "当前本地分支用来计算领先和落后的远端分支。没有 upstream 时不能直接判断可推送。" },
    { term: "Ahead / Behind（领先 / 落后）", meaning: "本地 HEAD 相对 upstream 独有和缺少的提交数；0/0 不包含未提交文件。" },
    { term: "Dirty worktree（脏工作树）", meaning: "存在 staged（已暂存）、unstaged（未暂存）、untracked（未跟踪）或 conflicted（冲突）文件的工作树。" },
    { term: "Admission（入场检查）", meaning: "在仓库身份、可见性、工作树或同步事实会改变决定时，按需取得结构化证据；不是每次 Git 操作的审批仪式。" },
    { term: "Provider（结构化事实提供器）", meaning: "按固定 schema（字段合同）读取现场 Owner 事实的入口；输出证据，不自动产生授权。" },
    { term: "Transport（Git 传输）", meaning: "fetch、push 等在本地与远端引用之间传输 Git 对象或引用的动作。" },
    { term: "Publication（内容发布）", meaning: "让候选内容进入公开或目标仓库的现实结果；它需要当前可见性、候选内容审查和授权。" },
    { term: "Read-back（回读）", meaning: "动作完成后从真实远端默认分支再次读取提交或内容，防止把本地成功、临时分支或工作树当成交付。" },
    { term: "Registry（登记表）", meaning: "记录仓库身份、精确治理例外或必要保留条件的结构化清单；命中必须按 repo、ref、path、HEAD 等精确条件判断。" },
    { term: "Generation（索引代际）", meaning: "一次完整、不可变的公开索引文档集合；写完并回读后才切换 current 指针。" },
    { term: "Projection（兼容投影）", meaning: "从当前 generation 复制到顶层供人阅读的 Markdown；它可检查 stale（过期），但不是动态决策权威。" },
    { term: "Freshness（新鲜度）", meaning: "证据是 live（现场）、mixed（部分现场）还是 cached（缓存）；字段明确返回，不靠调用者猜。" },
    { term: "Fail closed（失败关闭）", meaning: "身份、可见性、目标或证据不可靠时，只阻断依赖这些事实的写入和传输，同时允许继续只读诊断。" },
    { term: "Retention（必要保留）", meaning: "带 Owner、用途和退出条件的精确工作树保留项；路径或 HEAD 不再匹配时不能继续借它压掉警告。" },
    { term: "Retirement candidate（可退役候选）", meaning: "内容已进入默认分支且没有已知保护的分支或工作树；仍需确认没有活动依赖后才能删除。" },
    { term: "Commit-pinned snapshot（固定提交快照）", meaning: "干净、受限且固定在已知提交的审计工作树；它不同于普通无 upstream 或含独有工作的临时工作树。" }
  ],
  currentState: {
    observedAt: "2026-08-31T22:13:00Z",
    label: "48 个 live Owner identity 已闭合，45 个本地副本已验证；源 main/origin 与公开 generation 分层回读",
    facts: [
      "wlyaaaaa/github-local-index 是 PUBLIC；2026-08-31 的 ForPublication（发布前双现场检查）回读 main 与 origin/main 同为 806b668e9b6ff275329d6dfeb76f5239a9182bbe，工作区 clean、ahead/behind=0/0、decision=proceed。",
      "当前公开 generation=70efc65cdfec4b9cb1305ff48086744d，8 份文档共 23090 bytes，previous=d2f364cdf7664c06a34b81b07e5547df；manifest、generation 文档、兼容投影和 pointer 中的 bytes/hash 已逐项回读一致。",
      "live source 覆盖 48 个仓库身份（27 PUBLIC、21 PRIVATE）和 45 个已验证 clone occurrence；identity coverage 与 clone coverage 均为 complete，剩余 3 个仓库明确为 remote-only。",
      "Get-GitOwnerStatus 以零写入、no fetch（不抓取远端引用）返回 execution_status=completed、domain_status=current、baseline=48、observed=48、delta=0、issue=0。",
      "history 保留一项 nonblocking attention（非阻断提醒）：上代到现代的 4 项变化已经被 baseline 接受，其中旧 identity 由 wlyaaaaa/personal-formal-documents 接续、新增 wlyaaaaa/work-delivery-copilot，并补入一项既有仓库本地 root；当前没有未处理 identity delta。"
    ],
    gaps: [
      "Owner history 只保留窗口内记录，milestone coverage 仍为 partial，并明确 bootstrap_gap 与 retained_window_only；不能据此声称拥有更早的完整里程碑历史。",
      "重大 Git/GitHub 动作源码曾在历史提交 6afc858 对齐旧 C79 基线；当前语义来自 verified current E release。普通 Git identity/admission/normal push 仍可用，但重大动作 consumer 的安装、broker/人类因子 E2E 没有新证据，不能从历史源码回归外推。",
      "本次页面刷新完成了 Owner status、Cognition Source、ForPublication 和 generation 文件闭包的直接回读，但没有真实创建一个新仓库，也没有执行重大动作 broker/人类因子 E2E；新 PRIVATE 创建只按当前源码合同与回归证据说明，不冒充现实动作验收。"
    ]
  },
  operatingFlow: [
    { title: "从普通请求确定真实目标", detail: "先回答这是现有仓库还是新仓库、个人项目还是工作项目、期望的远端可见性和默认分支；目录名字相似时不靠猜。" },
    { title: "先建立正确的本地起点", detail: "新个人仓库放 V:\\Personal\\Projects\\<name>，新工作仓库放 V:\\Work\\<name>；在真实目录初始化预期 main 与首个提交并保持 canonical worktree（规范工作树）clean，不为空目录预登记，也不把仓库或唯一副本放进 Z 盘。" },
    { title: "安全创建空的 PRIVATE 远端", detail: "确认本人账号下同名仓库确实不存在，并把精确本地 branch/HEAD 绑定到受保护 create-repository 动作；它只创建 private=true、auto_init=false 的空远端，不顺带传入模板或任意参数。" },
    { title: "完成第一次默认分支收敛", detail: "创建回读成功后才配置 origin，正常 push 本地 main；随后现场回读 owner/repo、PRIVATE、实际默认分支、upstream、0/0 和 origin/<default> 对目标提交的可达性。默认分支不同就显式处理，不能猜。" },
    { title: "真实存在后才登记", detail: "只有远端和本地身份均已回读、首个默认分支收敛完成后，才刷新私有导航、Owner baseline 和公开 generation；最终 Owner status 要回到 baseline=observed、delta=0、issue=0。" },
    { title: "现有项目先读规则和 Git 状态", detail: "从目标项目取得业务语义与测试方式，用 git status、remote 和当前分支保护已有 dirty work；不把别人的施工纳入候选。" },
    { title: "有不确定性才做 Admission", detail: "按信息价值选择 LiveMetadata（现场元数据）、RefreshRefs（刷新远端引用）或 ForPublication，并可限定精确 worktree/ref；普通明确的小改不机械打卡。" },
    { title: "检查全部工作树和分支", detail: "比较 dirty、upstream、ahead/behind、默认分支可达性、独有提交、专门 Owner 和必要保留，不只看当前窗口。" },
    { title: "把传输、内容与授权分开", detail: "先判断 transport 是否可行，再判断候选内容是否适合当前 visibility，最后确认本轮用户授权；三者不能互相推出。" },
    { title: "显式执行并从远端回读", detail: "只修改和暂存明确文件；本地测试、commit、push、默认分支可达、部署与用户结果分别验证。临时分支、本地 main 和命令成功都不能冒充远端交付。" }
  ],
  components: [
    { name: "索引与同步看板", responsibility: "让人快速看到仓库身份、聚合计数和值得复核的同步问题。", implementation: "由 Git/GitHub 事实生成 Markdown；PUBLIC/PRIVATE 名称与路径只有在能改变判断且实际值可公开时才展开，其他内容保留聚合。" },
    { name: "本机导航登记 v2", responsibility: "把仓库身份定位到已确认的本机 clone，同时保留路径变化和恢复线索。", implementation: "保存于 ignored 的 99_private；读取后仍必须回读目标 .git origin，cache 缺失、过期或冲突时显式失败。公开与否按具体值和当前用途判断。" },
    { name: "Owner 基线存储 v3", responsibility: "比较完整仓库身份集合与当前 GitHub 现场，发现新增、删除、可见性或默认分支漂移。", implementation: "identity 与可空 local root 分存，原子保存 current/previous、规范 hash 和 read-back receipt（回读回执）。" },
    { name: "Get-GitOwnerStatus", responsibility: "给跨 Owner 消费者一个紧凑、零写的 current/review_needed/blocked/unknown 结论。", implementation: "先核验总索引自身 .git identity；通过前不读 baseline、registry、GitHub 或任何本地 root。" },
    { name: "Get-ProjectCognitionSource", responsibility: "分页闭合地提供 GitHub Owner 仓库来源和有界远端提交比较。", implementation: "固定 v1 schema、repository node id、分页上限、clone origin 回读和最多 64 个比较文件；缺口显式返回。" },
    { name: "Get-ProjectAdmission", responsibility: "对一个精确仓库给出身份、visibility、worktree、branch、同步和 transport 证据。", implementation: "v1 schema 区分 metadata 与 refs 新鲜度；可用 TargetWorktree/TargetRef 限定顶层决定，同时保留全部 inventory。" },
    { name: "GitHubIndex.Core", responsibility: "统一 remote 规范化、NUL status 解析、dirty 汇总、ahead/behind、默认分支整合和 push guidance。", implementation: "默认分支完成证据只读取 refs/remotes/origin/<default>，不退回同名本地 branch。" },
    { name: "Git artifact governance registry", responsibility: "声明专门 Owner ref、冻结历史和精确必要保留工作树。", implementation: "schema 固定并在模块加载阶段失败关闭；普通未来 feature branch 不会因名称相似被隐藏。" },
    { name: "公开暴露策略与 Hook", responsibility: "拦住高置信敏感路径或新加入的凭据形态。", implementation: "PublicExposurePolicy.psd1 是路径用例单一来源；Hook 只用于总索引 bootstrap/repair，是 defense in depth（纵深防护）而非安全证明。" },
    { name: "原子 refresh 与 generation", responsibility: "把一次完整快照写成可校验代际，并在中断后保住上一个有效版本。", implementation: "先写同卷 .incoming、验证闭合集与 hash、发布兼容投影、回读，再切 current；只留 current+previous。" },
    { name: "一致性检查器", responsibility: "零业务写入地比较当前 generation、兼容投影和重新生成结果。", implementation: "临时输出进入系统 temp；隐藏入口只写 ignored 私有 receipt，不 stage、commit、push 或授权发布。" },
    { name: "Owner-local 合同与回归测试", responsibility: "固定 admission、worktree、publication、refresh、里程碑和重大动作的边界。", implementation: "合同只写稳定机制，动态路径和计数现场读取；测试覆盖 schema、失败关闭、原子切换和隐私边界。" }
  ],
  usageExamples: [
    { moduleSlug: "protected-major-actions", ask: "新建一个私有仓库（PRIVATE）。", effect: "先区分个人/工作项目并在 V 盘正确根目录建立 clean 的本地 main 与首个提交；再创建本人账号下空 PRIVATE 远端，配置 origin、正常 push，现场回读身份/可见性/真实默认分支，完成 origin/<default> 可达后才登记。任一步失败都保留已完成的现实状态并从该步恢复，不重复创建。" },
    { moduleSlug: "protected-major-actions", ask: "把这个仓库改名、改可见性或换默认分支。", effect: "选择一个精确 typed effect（类型化动作），冻结当前 repo ID、旧名称、visibility、default branch 和目标值；Prepare/Execute 两阶段逐次回读，动作后只接受同一 repository identity 的精确结果，不把一次改名顺手变成公开或换 owner。" },
    { moduleSlug: "protected-major-actions", ask: "删除、转移仓库，或者强制改本地 ref / remote URL。", effect: "先由最高权限智能体判断真实目标、可恢复性和是否需要人类因子；适配器只接受固定的 3 个 git-local 与 6 个 github-api 动作，不接受 shell 字符串。结果不确定先读现场，绝不盲重放删除、转移或强更。" },
    { moduleSlug: "project-admission", ask: "这个目录最后会推到哪里？", effect: "读取 remote.origin.url、Git common directory、当前 branch/upstream 和现场 GitHub identity；目录名或缓存冲突时只读诊断，不继续写。" },
    { moduleSlug: "worktree-sync", ask: "这个分支已经推了，算完成吗？", effect: "除了自身 upstream 0/0，还比较目标提交是否能从远端真实默认分支到达；没进入 default branch 就仍是行动项。" },
    { moduleSlug: "worktree-sync", ask: "这个工作树能删吗？", effect: "检查 dirty、独有提交、默认分支可达性、locked/prunable、必要保留和活动依赖；证据不全就保留，不把 unknown 当作可删。" },
    { moduleSlug: "publication-gate", ask: "公开仓库里什么能发？", effect: "按实际候选逐值判断：有用的仓库名、路径、提交、失败和技术事实可以公开，PRIVATE 不生成猜测链接；可复用秘密和真实 L3+ 私人载荷必须移除。transport proceed 仍不等于 publication safe。" },
    { moduleSlug: "snapshot-recovery", ask: "索引刷新中断了怎么恢复？", effect: "先验证旧 current generation 仍完整，再检查 `.incoming`、manifest 和投影；只补齐新代并完成全部 hash/bytes 回读后切 pointer，不把半成品拼进旧快照。" },
    { moduleSlug: "repository-ledger", ask: "总索引现在还是最新的吗？", effect: "把完整 Owner baseline 与现场 48 个 identity 比较，并单独核对 45 个 origin 已验证 clone 与 3 个 remote-only；变化先进入 review，确认并刷新后才回到 delta=0、issue=0。" },
    { moduleSlug: "repository-ledger", ask: "这次发布是真正里程碑，给总账留一条记录。", effect: "只有外层 closeout 已确认 repo、branch、commit 和公开安全理由时才调用纯文件 helper；稳定键重复时 changed=false，普通 push 不记录。Owner Provider 最多只读返回当前50条，并明确 bootstrap_gap/retained_window_only，不伪装完整Git历史。" }
  ],
  evidenceLayers: [
    { layer: "Local identity（本地身份）", proves: "当前目录的 origin、Git common directory、HEAD、branch 和 worktree inventory。", doesNotProve: "GitHub 端当前 visibility、默认分支或远端引用。" },
    { layer: "GitHub metadata（GitHub 元数据）", proves: "现场 repo identity、PUBLIC/PRIVATE/INTERNAL、默认分支和 URL。", doesNotProve: "本地 refs 已刷新、工作区干净或内容安全。" },
    { layer: "Remote refs（远端引用）", proves: "fetch 后 origin/* 与远端引用一致，可计算 ahead/behind 和默认分支可达。", doesNotProve: "未提交文件已进入 Git，或候选适合公开。" },
    { layer: "Candidate review（候选审查）", proves: "实际 commits、paths 和新增内容符合当前项目与公开边界。", doesNotProve: "用户已授权外部写入，或 push 已成功。" },
    { layer: "Transport receipt（传输回执）", proves: "Git push/fetch 命令对明确远端执行成功。", doesNotProve: "远端默认分支已经包含目标 commit，网页或部署已经更新。" },
    { layer: "Remote default read-back（远端默认分支回读）", proves: "目标 commit 已从实际 GitHub 默认分支可达。", doesNotProve: "项目构建、Pages 部署或用户可见结果已经验收。" },
    { layer: "Generation integrity（代际完整性）", proves: "manifest、文档闭集、hash、bytes、projection 和 current pointer 属于同一快照。", doesNotProve: "快照仍是当前动态事实，或它拥有 decision authority。" },
    { layer: "Owner baseline comparison（Owner 基线比较）", proves: "完整身份集合相对 current/previous 基线是否稳定、待复核或无效。", doesNotProve: "每个仓库的 worktree、dirty、branch 或发布状态。" }
  ],
  evolution: [
    { date: "2026-07-04", commit: "4dadd6e / e8fba18", result: "建立公开安全的仓库总索引和可重建 refresh 工作流，把分散仓库事实第一次收成一个入口。" },
    { date: "2026-07-05", commit: "242b06e / e2843d9", result: "加入只读一致性检查，区分重新生成结果与已经发布的索引。" },
    { date: "2026-07-09", commit: "08c49ea / 5fa3171 / c7f44ee", result: "Admission 变为 worktree-aware（感知全部工作树），同时收紧身份、隐私、同步和公开索引边界。" },
    { date: "2026-07-10", commit: "3e26f26 / 6008fc1", result: "形成 owner-local Git 合同，把入场、同步、发布、refresh 和里程碑职责从零散说明收敛成稳定机制。" },
    { date: "2026-07-25–2026-07-26", commit: "a80d483 / d63b772 / 842b564", result: "强化公开 secret gate（秘密门禁）、固定提交审计快照和有界 fetch 重试，减少误删与瞬时网络误判。" },
    { date: "2026-08-01", commit: "ef88f77 / 0fe5595", result: "加入零写 Git Owner status，并让 identity gate 在读取任何下游来源前失败关闭。" },
    { date: "2026-08-16", commit: "b076b52", result: "把索引发布收敛为不可变 generation、兼容投影回读、current 指针切换和 current+previous 保留。" },
    { date: "2026-08-21–2026-08-22", commit: "4283c05 / d00220d / b9a8cd6", result: "支持精确 target worktree/ref，修复远端默认 ref 测试，并退役无消费者的历史投影。" },
    { date: "2026-08-23", commit: "6bfa180", result: "恢复包含 PUBLIC 与 PRIVATE 身份的完整 Owner 基线；私有 local root 继续与 identity 分离。" },
    { date: "2026-08-25–2026-08-28", commit: "8749025 / b454cd9", result: "刷新公开 generation，并让精确目标工作树可以绕过陈旧导航提示后再做 .git identity 回读。" },
    { date: "2026-08-29—08-30", commit: "6afc858–84eeaca", result: "先发布当时的 8 文档闭合 generation，随后把 PUBLIC 数据判断对齐活动全局 L1–L5 唯一表：Git 控制面只消费分级，路径和文件类型不再自行把普通内容升级为敏感；可用秘密与真实 L3+ 载荷仍按对应边界处理。" },
    { date: "2026-08-30—08-31", commit: "e01433e–806b668", result: "Live Owner 基线收敛为 48 个仓库、45 个 origin 已验证本地副本和 3 个 remote-only；旧 identity 由 personal-formal-documents 接续并新增 work-delivery-copilot，公开 generation 更新到 70efc65c…，同时保留 generation 与 live source 的事实分层。" }
  ],
  operationalEntrypoints: [
    { name: "单仓库现场元数据", command: "E:\\GitHub总索引\\tools\\Get-ProjectAdmission.ps1 -Repo <owner/name> -LiveMetadata -Json", purpose: "读取 GitHub visibility 与默认分支，不 fetch refs。" },
    { name: "发布前双现场证据", command: "E:\\GitHub总索引\\tools\\Get-ProjectAdmission.ps1 -Repo <owner/name> -ForPublication -Json", purpose: "同时要求 GitHub metadata 与 remote refs 新鲜；仍不授予发布权限。" },
    { name: "精确工作树判断", command: "E:\\GitHub总索引\\tools\\Get-ProjectAdmission.ps1 -Repo <owner/name> -TargetWorktree <path> -TargetRef <ref> -Json", purpose: "只让目标工作树参与 transport 结论，同时保留全部 evidence。" },
    { name: "Git Owner 紧凑状态", command: "E:\\GitHub总索引\\tools\\Get-GitOwnerStatus.ps1 -Json", purpose: "零写比较完整身份基线、现场 GitHub 和治理 registry。" },
    { name: "分页仓库来源", command: "E:\\GitHub总索引\\tools\\Get-ProjectCognitionSource.ps1 -Json", purpose: "返回闭合分页、稳定 node id、clone 关联和可选有界远端比较。" },
    { name: "刷新预览", command: "E:\\GitHub总索引\\tools\\Update-GitHubIndex.ps1 -SkipFetch -NoWrite", purpose: "重建候选文档到临时位置，不改 tracked 投影。" },
    { name: "一致性诊断", command: "E:\\GitHub总索引\\tools\\Test-GitHubLocalIndexConsistency.ps1 -SkipFetch", purpose: "比较 current generation、兼容投影与现场重建结果。" },
    { name: "Admission 回归", command: "E:\\GitHub总索引\\tests\\Test-ProjectAdmission.ps1", purpose: "验证 schema、worktree、sync、visibility、target、retention 和公开路径语义。" },
    { name: "Owner Provider 回归", command: "E:\\GitHub总索引\\tests\\Test-GitOwnerStatus.ps1", purpose: "验证 identity gate、零写、完整基线、registry、history 和稳定失败代码。" },
    { name: "公开发布唯一矩阵", command: "E:\\GitHub总索引\\05_规则与模板\\推送放行与否决规则.md", purpose: "唯一维护 transport、publication 与 authorization 的放行/阻断关系。" }
  ]
};

export const githubIndexModules = [
  {
    slug: "repository-ledger",
    shortTitle: "仓库总账",
    title: "仓库身份总账与 Owner（责任源）状态",
    searchAliases: ["总索引现在还是最新的吗", "我到底有多少个GitHub仓库", "新增仓库为什么还是0 delta", "哪些仓库只有远端没有本地副本", "仓库改名后怎样进入总账", "记录一次发布里程碑", "为什么普通push不写里程碑", "里程碑只保留50条"],
    searchProjection: {
      intents: ["核对完整仓库总数和公开私有分布", "判断新增改名删除是否已经进入 Owner 基线", "区分已验证本地副本与 remote-only", "理解已接受过渡为何仍保留历史提醒", "为真实发布里程碑写一条公开安全记录", "读取有界里程碑窗口"],
      entities: ["48 个仓库", "27 PUBLIC / 21 PRIVATE", "45 个已验证 clone", "3 个 remote-only", "Owner baseline v3", "delta / issue", "milestone_records", "Add-PushRecord changed", "50 条上限"],
      relations: ["GitHub 全量 inventory 与 current baseline 比较", "本地路径只有 origin 回读匹配才成为 clone occurrence", "previous→current 变化进入 history 后不再算当前 delta", "公开 generation 与 live Owner 状态分层", "外层 closeout 决定是否构成里程碑", "pure-file helper 稳定键去重", "Owner Provider 只读返回当前保留窗口"],
      failureRecovery: ["GitHub 身份源不可用时保持 Unknown", "baseline 与现场不同先进入 review_needed", "导航 cache 冲突时回读目标 .git 而不猜", "不安全理由或文件锁失败保持里程碑文件不变", "历史窗口不完整时只报告 bootstrap gap 和 retained_window_only"]
    },
    teaser: "回答“我到底有哪些仓库、它们现在是谁、总账是否落后于 GitHub（远端托管）现场”。",
    status: "48 个仓库的 baseline 与现场一致，27 PUBLIC / 21 PRIVATE、delta=0、issue=0；4 项已接受过渡仍作为非阻断 history 保留",
    statusTone: "mixed",
    value: "把散落在不同磁盘、公开与私有仓库中的身份事实收成一个可审计总账；公开页面按事实是否有用和实际值风险决定展示明细或聚合，不因 PRIVATE 标签整类隐藏。",
    why: "公开 Markdown（面向人阅读的文本投影）只能安全展示一部分仓库，而且会随时间过期；直接扫描所有磁盘又会漏范围、扩大隐私和把目录名错当身份。总账需要 GitHub 全量身份、已验证 clone（本地副本）和明确 registry（结构化治理登记表）各司其职。",
    example: "例如我问“刚增加了 work-delivery-copilot，为什么现在还是 0 delta？”Owner status 会说明它和 personal-formal-documents 的 identity 接续已经进入 current baseline，所以当前 baseline=observed=48、delta=0、issue=0；previous→current 的 4 项变化仍作为 nonblocking history（非阻断历史）保留，而不是假装从未发生。",
    result: "得到稳定的 current（当前一致）、review_needed（需要复核）、blocked（证据无效）或 unknown（证据不足）结论、48 个仓库的公开/私有分布、45 个已验证本地副本与 3 个 remote-only、差异数量、问题代码、历史连续性和公开安全 fingerprint（指纹）；需要详情时再到正确 Owner 展开。",
    readerStates: {
      pass: "GitHub 全量身份、已验证本地副本和结构化登记表一致时，返回 current（当前一致）以及可安全公开的汇总证据。",
      problem: "现场身份与基线不同、公开投影过期或本地登记冲突时返回 review_needed（需要复核）或 blocked（阻断），并给出差异数量和责任源。",
      unavailable: "GitHub 身份源、本地副本或登记表不可读时返回 Unknown（证据不足），不从目录名、旧 Markdown（文本投影）或缓存猜仓库事实。"
    },
    decisionImpact: [
      "identity baseline 与现场一致且无 issue 时，仓库总账可视为 current。",
      "出现新增、删除、visibility 或默认分支差异时进入 review_needed，不自动改 baseline。",
      "总索引自身 origin identity 不符时先 blocked，且不读取 baseline、registry、GitHub 或本地 root。",
      "GitHub CLI 或远端元数据执行失败属于 execution error，不伪造 domain conclusion（领域结论）。",
      "普通 commit/push 不写里程碑；只有真实、已确认且有公开安全理由的发布节点才显式记录。helper 返回 changed 只表示记录文件变化，不代表 Git commit/push 已完成。",
      "PUBLIC 页面按决策价值选择仓库明细或聚合计数；PUBLIC/PRIVATE 都按具体值判断，只省略真实 L3+ 内容、凭据和不影响判断的噪声。"
    ],
    problem: "人类需要可读总账，机器需要结构化完整身份，而页面不应为了完整性把所有动态路径和低价值明细全部铺开。若把公开 Markdown 当完整权威，新仓库会被漏掉；若把本机目录当仓库身份，旧 clone、重命名和 origin 错配会制造假事实。",
    implementation: [
      "GitHub 全量 inventory 由现场 API 分页闭合；每项保留稳定 node id、visibility、默认分支 OID 和公开安全元数据。",
      "ignored 私有导航 v2 保存 repo 到本机 clone 的定位，但只有 `.git` origin 回读一致才建立 clone occurrence。",
      "owner-baseline-store.v3 把完整 identity snapshot 与 nullable local-root snapshot 分开；current、previous、hash 和 receipt 原子读写。",
      "Get-GitOwnerStatus.ps1 只比较稳定 Owner 事实，排除工作树 dirty、ahead/behind、观察时间、索引 HEAD 和任务状态等高频噪声。",
      "governance registry 只输出规范化有效性和 fingerprint，不把内部条目内容放进 compact status。",
      "Add-PushRecord.ps1 是 pure-file（纯文件）且幂等的窄 helper：用稳定键去重、拒绝 secret-shaped reason，只更新目标记录并返回 changed，不 stage、commit、pull、rebase 或 push。",
      "Get-GitOwnerStatus 的 milestone_records 只读输出最多 50 条现存公开安全记录；空表是合法 current，bootstrap_gap 与 retained_window_only 永久保留。"
    ],
    flow: [
      "核验 GitHub 总索引仓库自身 origin 与预期 identity",
      "读取并验证 current/previous Owner baseline 和治理 registry",
      "分页读取 GitHub 全量 identity，必要时关联 origin 已验证的 clone",
      "规范化并比较 baseline 与 observed fact set",
      "返回 domain_status、delta/issue 计数、history 和 fingerprint",
      "只有 review 确认后才用独立 MigrateBaseline 写入口推进下一代基线",
      "若外层 closeout 确认本次是真实里程碑，显式传入 repo/branch/commit/reason 调用 Add-PushRecord；读取结果时只消费 Owner Provider 的有界 milestone_records"
    ],
    concepts: [
      { term: "Owner baseline（责任源基线）", explanation: "完整仓库 identity 的受管 current/previous 快照；不是 PUBLIC 子集，也不是一次 live 自比。" },
      { term: "domain_status（领域状态）", explanation: "事实是 current、review_needed、blocked 还是 unknown；与 Provider 是否成功执行分开。" },
      { term: "history_gap（历史缺口）", explanation: "第一次迁移没有可信 previous 全量基线；即使 current 内容有效，也不能伪装成连续历史。" },
      { term: "clone occurrence（clone 出现记录）", explanation: "私有导航给出候选路径后，实际 `.git` origin 与 repo identity 一致的本机副本关联。" },
      { term: "semantic fingerprint（语义指纹）", explanation: "对稳定事实规范化后计算的 SHA-256；字段顺序、观察时间和工作树噪声不会改变它。" },
      { term: "Milestone record（里程碑记录）", explanation: "外层已确认的少量公开安全 Git 事实节点；稳定键重复不追加，最多读取当前50条，不等于完整 Git 历史。" }
    ],
    boundaries: [
      "compact Owner status 不返回私有 local root、branch、worktree、dirty 或 task 状态",
      "不扫描未声明的磁盘根；新 root 由显式 refresh 发现",
      "公开 Markdown 是导航和投影，不是完整 owner baseline",
      "MigrateBaseline 是独立写入口；普通 status 保持 zero_write=true、fetch_performed=false",
      "里程碑记录是有界补充来源，不是完整 Git 历史或每次 push 的事件流"
    ],
    failures: [
      { condition: "总索引自身 origin 缺失或不匹配", response: "返回 completed/blocked 与有界 issue，阻止所有不可信下游读取。" },
      { condition: "v3 baseline 缺失、无效或第一次 history gap", response: "返回 unknown；不回退到 PUBLIC Markdown 或伪造 previous。" },
      { condition: "现场身份集合与基线不同", response: "返回 review_needed 和 delta 计数；由 Owner 审查后再迁移基线。" },
      { condition: "registry schema、重复 ref 或 retention 条目无效", response: "Owner current 失败关闭，只公开稳定问题代码。" },
      { condition: "GitHub CLI 不可用、非零退出或 JSON 无效", response: "返回 execution_status=error、domain_status=unknown，供调用者决定重试。" },
      { condition: "里程碑 reason 像秘密、稳定键重复、文件锁或写入失败", response: "不安全或失败时保持文件不变；重复项返回 changed=false。Git stage/commit/push 仍由外层处理。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\tools\\Get-GitOwnerStatus.ps1", role: "零写 compact Owner Provider" },
      { path: "E:\\GitHub总索引\\tools\\Get-ProjectCognitionSource.ps1", role: "分页闭合的 GitHub 仓库来源与有界 compare" },
      { path: "E:\\GitHub总索引\\tools\\GitHubIndex.PrivateNavigation.psm1", role: "私有导航 v2 与 Owner baseline store v3" },
      { path: "E:\\GitHub总索引\\config\\git-artifact-governance.json", role: "专门 Owner、冻结历史和必要保留的 schema 来源；页面不展开条目" },
      { path: "E:\\GitHub总索引\\00_总览\\current-generation.json", role: "当前公开 generation 的兼容指针" },
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.milestone-record.md", role: "真实里程碑触发、pure-file写入、50条Provider输出与历史缺口合同" },
      { path: "E:\\GitHub总索引\\tools\\Add-PushRecord.ps1", role: "稳定键幂等、拒绝秘密形理由且不执行Git事务的记录helper" }
    ],
    verification: [
      "2026-08-29 的 Test-GitOwnerStatus.ps1 历史回归通过：identity gate、zero write、全量 PUBLIC/PRIVATE 基线、history、registry、远端失败和无路径泄露。",
      "2026-08-29 的 Test-ProjectCognitionSource.ps1 历史回归通过：分页闭合、稳定 node id、origin 验证 clone、compare 上限、partial gaps 和无凭据输出。",
      "2026-08-31 直接运行 Get-GitOwnerStatus：execution completed、domain current、baseline=48、observed=48、delta=0、issue=0；history 记录 4 项 accepted transition。",
      "2026-08-31 直接运行 Get-ProjectCognitionSource：分页与 clone coverage 均 complete，48 个 repository、45 个 origin_verified occurrence，因此 3 个 remote-only。",
      "当前公开 pointer 明确声明 authoritative=false 与 decision_authority=false，避免投影冒充动态事实。",
      "Test-PushRecord.ps1 验证 pure-file、幂等、并发去重、不安全理由拒绝和 no Git transaction；Test-GitOwnerStatus.ps1 验证空表、稳定摘要、50条上界与公开安全失败关闭。"
    ],
    relation: "它回答整个仓库集合是否可信和是否需要复核；单仓库 Admission 再回答某个精确目录、工作树和分支现在能否安全继续。"
  },
  {
    slug: "project-admission",
    shortTitle: "项目入场",
    title: "单仓库 Admission（入场检查）与精确目标判断",
    searchAliases: ["这个目录推到哪里", "这个目录会推到哪里", "这个项目是公开还是私有", "当前默认分支是什么", "只检查这个工作树", "新仓库远端还不存在怎么检查"],
    searchProjection: {
      intents: ["确认一个目录对应哪个 GitHub 仓库", "读取当前可见性与真实默认分支", "判断精确 worktree/ref 是否适合继续", "区分缓存现场元数据和现场远端引用"],
      entities: ["remote.origin.url", "Git common directory", "PUBLIC / PRIVATE / INTERNAL", "default branch", "TargetWorktree", "ForPublication"],
      relations: ["目录经 .git origin 回读绑定 repo identity", "LiveMetadata 读取可见性但不 fetch", "RefreshRefs 更新 origin refs", "ForPublication 同时要求 metadata 与 refs 现场"],
      failureRecovery: ["identity 多义时只读定位并 block", "live metadata 失败时不拿缓存发布", "target 不存在时不退回任意 worktree", "远端尚不存在的新仓库转入受保护 create-repository 路径"]
    },
    teaser: "在路径、远端、可见性或同步会改变做法时，给一个项目做现场体检。",
    status: "项目入场事实入口可用；实时元数据、远端引用和精确目标已有回归",
    statusTone: "pass",
    value: "在真正改文件或推送前确认“我站在正确的仓库、正确的工作树和正确的远端前”，并把继续、警告和阻断原因说清。",
    why: "目录名、旧 Markdown（文本投影）和缓存路径都可能过期；多工作树仓库中，另一个临时目录的 dirty（有未提交修改）或 no-upstream（无上游）又可能污染当前目标。需要一个既核实 identity（仓库身份）、又能精确限定目标且保留全局证据的入口。",
    example: "例如我问“E:\\GitHub总索引这个目录最后会推到哪里？”2026-08-31 的 ForPublication 先回读 `.git`、origin 与 GitHub 现场：它确认目标是 PUBLIC 的 wlyaaaaa/github-local-index，真实默认分支是 main，本地 main 与 origin/main 同为 806b668…、工作区 clean、0/0，因此返回 proceed；如果目录名相同但 origin 不符，就只做定位而不继续写。",
    result: "得到固定 v1 JSON（结构化记录）：仓库身份、远端地址、可见性、默认分支、本机根目录、Git 共享目录、新鲜度、目标引用/工作树、入场结论、传输建议、原因/错误，以及全部工作树和分支。",
    readerStates: {
      pass: "目标仓库、工作树、远端、公开属性和同步状态适合当前动作时，返回 proceed（没有入场阻断）及建议传输策略；它不产生提交、推送或发布授权。",
      problem: "工作区有并发修改、分支落后、远端错误或公开风险时返回 warn/block（警告或阻断），并说明哪些文件可动、先处理什么。",
      unavailable: "现场元数据或远端引用不可取得时，本地安全工作可以继续，但推送和发布必须等待实时证据，不把缓存准入当授权。"
    },
    decisionImpact: [
      "普通已知仓库的可逆小改可只用 git status；Admission 不是固定打卡。",
      "准备创建但远端还不存在时，不拿要求远端已存在的普通 Admission 伪造 identity；先走受保护的空 PRIVATE 创建，再回来做 live Admission。",
      "只需要 GitHub 可见性时用 LiveMetadata，不会 fetch。",
      "需要真实 ahead/behind 时用 RefreshRefs；准备发布判断时用 ForPublication 同时要求两类 live 证据。",
      "TargetWorktree/TargetRef 只改变顶层 transport 判断，其他工作树仍保留在 evidence 中。",
      "decision=block 关闭依赖不足证据的写入和直接 transport，但不关闭只读诊断。"
    ],
    problem: "单仓库判断同时依赖本地 `.git`、GitHub metadata 和 remote-tracking refs。把它们混成一个 `fetch=true` 黑盒会让调用者不知道什么是现场、什么是缓存；只聚合所有工作树又会让无关临时目录阻断精确目标。",
    implementation: [
      "入口先规范化 owner/name；显式 RepoPath 或 TargetWorktree 可作为定位提示，但最终必须回读 remote.origin.url 与 git-common-dir。",
      "无显式路径时可读取 ignored 私有导航 cache；cache 候选 identity 不符时丢弃，并返回 remote_mismatch 或 bootstrap_required。",
      "visibility 只接受 PUBLIC、PRIVATE、INTERNAL；非法值或 unknown 都进入 blocking reasons。",
      "LiveMetadata 调用 GitHub metadata 且 never fetch；RefreshRefs 才执行 `git fetch --prune origin`；ForPublication 同时要求两者成功。",
      "顶层 evidence_source、freshness 与 live_checked 明示 local_git、github_metadata、remote_refs 的来源，异常记录只保留类别和 exit code。",
      "New-ProjectAdmissionRecord 让正常和异常路径保持同一 schema，不因 internal_error 丢字段。"
    ],
    flow: [
      "规范化预期 repo identity 和可选 target",
      "解析候选路径并回读 `.git` origin/common-dir",
      "枚举全部 worktree 并读取 branch、HEAD、upstream、dirty 和 sync",
      "按调用模式读取 live GitHub metadata 和/或刷新 refs",
      "计算默认分支整合、branch inventory 与治理 registry 命中",
      "限定 decision worktree，生成 reasons、decision 和 push guidance",
      "调用者结合项目规则、候选内容和授权决定下一步"
    ],
    concepts: [
      { term: "evidence_source（证据来源）", explanation: "分别标出 local Git、GitHub metadata 和 remote refs 是 live、cached 还是 unavailable。" },
      { term: "freshness（综合新鲜度）", explanation: "三类来源全 live 才是 live；只现场读取一部分为 mixed；都未刷新为 cached。" },
      { term: "decision（入场结论）", explanation: "proceed、warn 或 block，描述事实充分程度和本地风险，不等于授权。" },
      { term: "push_decision（传输建议）", explanation: "根据 dirty、behind、diverged、upstream 和 remote mode 给出 transport readiness。" },
      { term: "target scope（目标范围）", explanation: "精确到一个 worktree、branch ref 或 40 位 commit；目标冲突或多义时失败关闭。" }
    ],
    boundaries: [
      "V1 不输出 publication_decision，也不扫描实际候选内容",
      "push_decision=proceed 不授予 edit、commit、push 或公开发布权限",
      "不靠项目名称硬编码治理例外；只读精确 artifact/retention registry",
      "无 target 时保留全 worktree 聚合兼容语义",
      "异常输出不回显外部命令 stderr 或秘密值，只保留稳定错误类别"
    ],
    failures: [
      { condition: "repo、路径或 origin identity 无法唯一确定", response: "decision=block；读取 `.git`、remote 和 Owner 证据继续定位。" },
      { condition: "LiveMetadata 或 RefreshRefs 失败", response: "加入 live_evidence_unavailable，ForPublication 保持 block，不把缓存冒充现场。" },
      { condition: "target worktree/ref 不存在、冲突或不可用", response: "返回精确 target reason，不退回任意工作树。" },
      { condition: "PUBLIC 工作树命中敏感路径", response: "block 并给出 resolve_public_exposure；pure delete 和安全 rename 按实际目标判断。" },
      { condition: "任一可达 worktree 检查失败", response: "worktree_inspection_error 失败关闭；其他只读诊断仍可继续。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\tools\\Get-ProjectAdmission.ps1", role: "CLI、模式参数、私有导航与稳定异常输出" },
      { path: "E:\\GitHub总索引\\tools\\GitHubIndex.Core.psm1", role: "Admission record、worktree、branch、target 与 push guidance 核心" },
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.project-admission.md", role: "v1 schema、新鲜度、target 与失败语义" },
      { path: "E:\\GitHub总索引\\tests\\Test-ProjectAdmission.ps1", role: "真实 Git fixture 和失败关闭回归" }
    ],
    verification: [
      "2026-08-29 完整运行 Test-ProjectAdmission.ps1，exit 0，并以 `All project admission tests passed.` 收口；这是历史源码回归，不冒充本次现场。",
      "2026-08-31 对 github-local-index 直接运行 ForPublication：schema v1、freshness=live、live_checked=true、PUBLIC/main、HEAD=origin/main=806b668…、clean、0/0、decision=proceed。",
      "测试覆盖正常/异常记录同 shape、visibility 闭集、LiveMetadata never fetch、RefreshRefs、ForPublication 和兼容 Fetch。",
      "真实 fixture 覆盖 primary、linked、detached、prunable、no-upstream、ahead、behind、diverged 和 inspection failure。",
      "target fixture 验证无关工作树不会污染顶层判断，但仍完整出现在 worktrees evidence。"
    ],
    relation: "它是总账落到单个项目的现场入口；Worktree Sync 解释它怎样判断分支完成，Publication Gate 再解释为什么 transport 仍不等于公开。"
  },
  {
    slug: "worktree-sync",
    shortTitle: "工作树同步",
    title: "Worktree（工作树）、分支同步与默认分支收敛",
    searchAliases: ["分支推了算完成吗", "工作树能删吗", "feature分支0/0为什么还没完成", "另一个工作树有修改怎么办", "提交有没有进入远端main"],
    searchProjection: {
      intents: ["判断已推送分支是否真正交付", "确认一个 worktree 能否安全删除", "找出未提交或独有内容", "检查目标提交是否进入远端默认分支"],
      entities: ["worktree", "upstream", "ahead / behind", "origin/default", "integration_state", "retirement candidate"],
      relations: ["每个 worktree 分别读取 dirty 与 HEAD", "分支 0/0 只证明自身 upstream 同步", "远端默认分支可达才证明 Git 交付", "已整合且无保护只成为退役候选"],
      failureRecovery: ["远端默认 ref 不可读时保持 Unknown", "dirty 或独有提交时保留 worktree", "diverged 时 reconcile 后重查", "删除前无法证明无活动依赖就 BLOCK"]
    },
    teaser: "不只看当前窗口，确认所有独有提交最终都能从远端默认分支到达。",
    status: "工作树与远端默认分支收敛检查可用",
    statusTone: "pass",
    value: "防止“当前分支已 push（推送）”掩盖另一个工作树的未提交修改、独有提交或没有进入 main（默认主分支）的 feature（功能分支）历史。",
    why: "一个仓库的多个 worktree 共用对象库，却各自有文件状态和分支。只在主目录跑一次 `git status`（状态命令）会漏掉 linked（关联）、detached（分离）、prunable（记录可修剪）和无工作树的本地/远端分支。",
    example: "一个 feature worktree 可能对自己的 origin/feature 为 0/0，但 HEAD（当前提交）仍有提交没有进入 origin/main。这个模块会把它标为 default_branch_missing_commits（默认分支缺少提交），而不是因为 upstream（上游）已同步就称为完成。",
    result: "得到每个 worktree 的 dirty summary（未提交汇总）、sync_state（上游同步状态）、默认分支整合状态、独有/缺失提交数，以及 branch inventory（分支清单）、retirement candidate（可退役候选）和必要保留证据。",
    readerStates: {
      pass: "全部工作树、分支、上游和远端默认分支都可读且没有独有未整合内容时，明确哪些仍活动、哪些可安全退役。",
      problem: "任一工作树有未提交修改、独有提交、无上游、分叉或默认分支缺提交时，保留该工作树并阻断退役或完成声明。",
      unavailable: "某个工作树路径或远端引用不可读时标记证据不足，不删除目录、不猜同步状态，也不把其他工作树的干净状态替代它。"
    },
    decisionImpact: [
      "behind 或 diverged 时先 update/reconcile 并复查，不能直接 push。",
      "dirty 时只允许显式限定候选，不能 `git add .` 吞入其他任务。",
      "分支对自身 upstream 同步但缺于远端默认分支时，仍需 integrate default branch。",
      "已被默认分支吸收且无保护的 clean 残留只成为 retirement candidate，不自动删除。",
      "unknown 只作删除前瞬时保护；无法查清 owner、独有内容和依赖时 closeout 必须 BLOCK。"
    ],
    problem: "Git 的“同步”至少包含工作文件、当前 upstream 和默认分支整合三层。任何一层被省略，都会把未提交、只推到 feature、patch-equivalent 或残留 worktree 混成一个模糊的“已同步”。",
    implementation: [
      "`git worktree list --porcelain` 枚举全部工作树；每个存在路径单独回读 HEAD、branch、upstream、ahead/behind 和 NUL-delimited status。",
      "dirty summary 分开计 staged、unstaged、untracked 和 conflicted，文件名含中文、空格或换行也不误解析。",
      "默认分支完成证据只接受 `refs/remotes/origin/<default>`；远端 ref 缺失就 unknown，不回退同名本地 branch。",
      "branch inventory 枚举无 worktree 的本地 refs 和 remote-tracking refs；用 ancestry 与 `git cherry` 区分 unmerged、merged_ancestry 和 patch_equivalent。",
      "artifact governance 只对 exact repo/ref 生效；必要 retention 必须同时匹配 repo、绝对 path 与 HEAD，并带 Owner、用途、exit condition。",
      "frozen_history 保留冻结仓库的非默认 refs 与独有提交，不回灌默认分支，也不把它们当普通清理候选。"
    ],
    flow: [
      "枚举 common-dir 下全部 worktree 与 refs",
      "逐工作树读取文件状态、upstream 和 ahead/behind",
      "刷新后读取远端默认分支 HEAD",
      "比较每个 HEAD 与默认分支的 ancestry、距离和 patch equivalence",
      "附加 exact governance、historical retention 与 necessary retention",
      "生成整合、复查、保留或可退役结论",
      "删除前由任务 Owner 再确认没有活动依赖或唯一内容"
    ],
    concepts: [
      { term: "sync_state（同步状态）", explanation: "in_sync、ahead、behind、diverged、no_upstream 或 unknown，只描述 HEAD 与 upstream。" },
      { term: "integration_state（整合状态）", explanation: "default、merged_ancestry、patch_equivalent、unmerged 或 unknown，描述 HEAD 相对远端默认分支。" },
      { term: "patch equivalent（补丁等价）", explanation: "提交哈希不同，但同一补丁已经以另一提交进入默认分支。" },
      { term: "prunable（可修剪记录）", explanation: "Git 记录了一个已不存在或失效的 worktree；它仍是异常证据，不自动视为 clean。" },
      { term: "necessary retention（必要保留）", explanation: "当前确有消费者的固定工作树例外；条件漂移后立即失效。" }
    ],
    boundaries: [
      "retirement candidate 不等于删除授权，也不证明没有运行中消费者",
      "locked、prunable、dirty、ahead、普通 no-upstream 或证据矛盾不能被 snapshot 规则压掉",
      "普通未来 branch 不因名称模式自动成为专门 Owner 或历史保留",
      "未证明前不得 gc、prune 或删除内部 checkpoint refs（检查点引用）与 unreachable objects（不可达对象）",
      "项目业务决定 merge、rebase、PR 或 release 方式；总索引只提供 Git 事实"
    ],
    failures: [
      { condition: "任一可达 worktree status 或 refs 检查失败", response: "该状态为 unknown，并阻止依赖它的收敛/删除结论。" },
      { condition: "远端默认分支 ref 不存在", response: "不退回本地 main；标记 default_branch_integration_unknown 并刷新/补证。" },
      { condition: "branch ahead+behind", response: "push_decision=block、strategy=reconcile_then_recheck。" },
      { condition: "已整合残留仍有 lock、dirty 或必要 retention", response: "保持 evidence 和警告，不列为自动清理。" },
      { condition: "retention path 或 HEAD 改变", response: "exact match 失效，恢复普通 dirty/sync/retirement 判断。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.worktree-sync.md", role: "全部 worktree、默认分支完成与必要保留合同" },
      { path: "E:\\GitHub总索引\\tools\\GitHubIndex.Core.psm1", role: "worktree/status/branch/default integration 实现" },
      { path: "E:\\GitHub总索引\\config\\git-artifact-governance.json", role: "exact governance、frozen history 与 retention schema" },
      { path: "E:\\GitHub总索引\\tests\\Test-ProjectAdmission.ps1", role: "多 worktree、branch inventory 与 retention fixture" }
    ],
    verification: [
      "2026-08-29 完整 Admission 回归 exit 0，覆盖本模块的 worktree、branch、default-ref、target 和 retention 路径。",
      "测试 fixture 真实创建 primary、linked、detached、prunable、ahead 与 no-upstream 工作树。",
      "回归覆盖 remote-only branch、已推送但未进默认分支、merged ancestry、patch equivalence 和 retirement candidate。",
      "registry 测试验证 missing/wrong schema、重复 ref、未知 override 和不完整 retention 全部失败关闭。",
      "2026-08-29 两个 PUBLIC 仓库现场均确认 main/default integration=default、0/0，但 dirty 仍单独保留为 warning；这是历史现场。",
      "2026-08-31 github-local-index 的 live Admission 回读唯一 main worktree 为 clean、0/0、integration_state=default、missing_default_commits=0；本次未重跑多 worktree fixture。"
    ],
    relation: "它把 Admission 的 worktrees/branches 证据解释为真实收敛状态；Publication Gate 在此基础上继续审查候选内容和授权。"
  },
  {
    slug: "publication-gate",
    shortTitle: "公开发布",
    title: "Transport（Git 传输）、公开内容与授权三重门",
    searchAliases: ["公开仓库里什么能发", "PRIVATE仓库名字能不能公开", "路径和提交哈希是不是敏感", "push能成功就能公开吗", "公开页面能不能链接私有仓库"],
    searchProjection: {
      intents: ["判断一批候选内容能否进入公开仓库", "区分普通技术事实与可复用秘密", "确认 PRIVATE identity 是否能按实际值说明", "核对 transport 内容安全和授权三层"],
      entities: ["candidate commits", "paths / content", "PUBLIC / PRIVATE", "L3+", "reusable secret", "publication authorization"],
      relations: ["transport proceed 不推出 publication safe", "仓库名路径提交和失败按实际值判断", "PRIVATE 技术事实可说明但不生成猜测链接", "可复用秘密与真实 L3+ 载荷阻断公开"],
      failureRecovery: ["候选范围不清时只暂存精确文件", "visibility 不新鲜时停止发布", "命中秘密时移除或改成安全摘要", "授权未覆盖时保留本地结果"]
    },
    teaser: "能 push（推送）、适合公开、已经获授权是三件独立的事，缺一不可。",
    status: "发布三重门已落地；传输、内容与授权分开判断",
    statusTone: "pass",
    value: "避免把私有材料推到公开仓库，也避免因为仓库是 PRIVATE（私有）就错误破坏恢复所需的精确内容。",
    why: "Git transport 只关心引用能否传输，不理解聊天、数据库、密钥或机器快照是否该公开；简单 secret scanner（秘密扫描器）也无法证明语义安全和用户授权。",
    example: "例如我问“公开仓库里什么能发？”答案不靠字段名或 PRIVATE 标签一刀切：能改变判断的仓库名、普通路径、提交哈希、版本、失败和架构事实可以按实际值说明；PRIVATE 仓库不提供猜测或不可访问链接。真实凭据、可复用秘密和经活动分级确认的 L3+ 私人载荷必须移除，之后还要确认精确候选与本轮发布授权。",
    result: "得到三个独立答案：Git 目标和分支是否 transport ready（传输就绪）、实际候选是否 publication safe（发布安全）、当前请求是否 authorization present（已有授权）；只有三者都成立才执行并回读。",
    readerStates: {
      pass: "传输目标与分支正确、实际发布候选适合公开且本轮已有明确发布授权时，才正常推送并从公开远端回读。",
      problem: "候选含私密材料、工作区范围不清、远端或分支错误，或授权不覆盖本次发布时阻断对应步骤，并说明缺少哪一层。",
      unavailable: "无法取得实时可见性、远端默认分支或候选闭包时不发布；私有仓库身份和普通秘密扫描结果都不能单独替代完整判断。"
    },
    decisionImpact: [
      "用户未授权外部写入时，只做本地实现和只读诊断。",
      "PUBLIC 目标必须使用当前 visibility，并审查实际 commits、paths 和 content。",
      "PRIVATE 备份/恢复目标可按范围 preserve exact content，但不能把内容复制到公开索引或聊天。",
      "PUBLIC 页面可以说明有用且已核对的 PRIVATE 仓库名、普通路径和状态，但不给 PRIVATE 项目制造猜测 GitHub 链接，也不展开其秘密或私人正文。",
      "dirty 或混合工作区必须显式候选文件；不使用 `git add .`。",
      "Hook/scan 零命中只是一层防护，不能替代人工/模型对候选语义的复审。"
    ],
    problem: "如果把 admission 的 proceed 当成 publication 批准，公开仓库可能接收秘密或私人正文；如果把“出现敏感信息”机械等同于“必须脱敏”，又会破坏已确认 PRIVATE 恢复目标的可恢复性。",
    implementation: [
      "唯一矩阵按用户授权、repo identity、sync、dirty、visibility、candidate exposure 和目标类别逐层判断。",
      "PUBLIC 路径分类由 PublicExposurePolicy.psd1 统一给 admission、Hook 与 `.gitignore` 使用，避免三套规则漂移。",
      "真实 `.env` 家族中的可用秘密、私钥、令牌、恢复材料和可直接滥用载荷失败关闭；日志、数据库、原始目录或普通个人数据只是内容审查候选，不因路径形态自动升级。",
      "pure delete、删除 secret-shaped 行和从敏感路径 rename 到安全目标属于修复；rename 进入敏感目标继续阻断。",
      "Git Hook 通过 NUL-delimited staged paths 与新增 diff 内容拦截高置信模式，只安装在总索引自身 bootstrap/repair。",
      "项目规则与 candidate diff 决定业务是否适合公开；总索引不生成 V1 publication_decision。"
    ],
    flow: [
      "确认当前用户请求是否允许外部 effect",
      "取得新鲜 repo identity、visibility、目标 branch 与 refs",
      "限定本次 candidate commits、paths 和 staged/unstaged 内容",
      "按 canonical path policy 和语义边界复审公开暴露面",
      "运行项目测试和必要的 defense-in-depth scan",
      "normal push 明确目标后，从远端默认分支回读 commit",
      "部署或网页结果由目标项目另行验证，不由 Git receipt 冒充"
    ],
    concepts: [
      { term: "transport ready（传输就绪）", explanation: "身份、分支、upstream 和同步状态支持已授权的 Git 传输。" },
      { term: "publication safe（发布安全）", explanation: "实际候选在当前 visibility、项目规则和内容边界下可以进入目标。" },
      { term: "authorization present（已有授权）", explanation: "当前请求明确允许对应外部副作用；工具输出不能生成这份授权。" },
      { term: "canonical matrix（唯一规范矩阵）", explanation: "完整 PUBLIC/PRIVATE 放行和否决条件只维护一份，其他文档只链接。" },
      { term: "defense in depth（纵深防护）", explanation: "Hook、ignore 与 scanner 提供多层拦截，但任何一层都不是绝对安全证明。" }
    ],
    boundaries: [
      "Get-ProjectAdmission V1 不输出 publication_decision",
      "PUBLIC 历史 visibility 不可代替本次现场 visibility",
      "模板后缀不豁免 secret content",
      "PRIVATE 不等于可以向公开页面、日志或聊天泄露内容",
      "PRIVATE 也不等于普通仓库名、公开安全路径或 Git 技术事实必须整类消失；只按实际值与当前用途判断",
      "本模块不替目标项目决定 deploy、Pages 或用户验收"
    ],
    failures: [
      { condition: "identity、visibility、target 或 candidate 不明确", response: "停止写入/发布，补最能降低不确定性的证据。" },
      { condition: "PUBLIC candidate 命中秘密或私人原始材料", response: "只提交移除、安全重构或公开安全摘要后的候选。" },
      { condition: "transport behind/diverged/conflicted/detached", response: "按项目语义 update/reconcile 后重新取证。" },
      { condition: "Hook 通过但语义仍可能泄露", response: "继续人工/模型候选复审；不得以零命中放行。" },
      { condition: "PRIVATE 恢复目标可见性可能变化", response: "重新读取 live visibility；未确认前不继续敏感 push。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\05_规则与模板\\推送放行与否决规则.md", role: "唯一 transport/publication/authorization 矩阵" },
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.push-publication.md", role: "publication 分离和 V1 边界" },
      { path: "E:\\GitHub总索引\\tools\\PublicExposurePolicy.psd1", role: "敏感路径 canonical cases" },
      { path: "E:\\GitHub总索引\\tools\\Install-GitHook.ps1", role: "总索引自身 Hook bootstrap/repair" },
      { path: "E:\\GitHub总索引\\tests\\Run-UnitTests.ps1", role: "Hook、ignore、rename/delete 与内容扫描回归" }
    ],
    verification: [
      "2026-08-29 完整 Admission 回归 exit 0，包含 PUBLIC exposure、pure delete、rename 和目标工作树 gate。",
      "Test-ProjectAdmission.ps1 对中央 policy 的真实 `.env`、模板、私钥、凭据配置、数据库与普通安全路径逐案验证。",
      "Run-UnitTests.ps1 覆盖中文/空格路径、NUL delimiter、模板秘密内容、type change、pure delete 和双向 rename。",
      "合同测试要求完整矩阵只有一个副本，旧脱敏文档只保留 redirect role。",
      "2026-08-29 live admission 证明 PUBLIC/main/0-0 仍因 dirty 返回 warn，现实示例符合三层分离。"
    ],
    relation: "它消费 Admission 与 Worktree Sync 的 Git 证据，但额外要求候选内容和用户授权；Snapshot 模块只负责记录事实，不会替它批准发布。"
  },
  {
    slug: "protected-major-actions",
    shortTitle: "重大变更保护",
    title: "重大 Git/GitHub 变更保护与人类确认边界",
    searchAliases: ["新建一个 PRIVATE 仓库", "新建私有仓库", "新建PRIVATE仓库完整流程", "创建私有仓库后怎样第一次推main", "改仓库可见性要不要确认", "仓库创建成功但push失败怎么办", "删除改名转移仓库怎样保护", "强制改本地ref", "替换remote URL", "修改默认分支", "仓库转移后怎样回读"],
    searchProjection: {
      intents: ["从本地项目创建并收敛一个 PRIVATE 仓库", "删除或强制更新本地 ref", "替换一个精确 remote URL", "改变仓库可见性、名称或默认分支", "删除或转移 GitHub 仓库", "判断一次重大动作是否需要人类因子", "在动作结果不确定时恢复而不重复执行"],
      entities: ["git-local / github-api", "delete-local-ref / force-update-local-ref / replace-remote-url", "create-repository / set-visibility / rename-repository / set-default-branch / delete-repository / transfer-repository", "Prepare / Execute", "execution_mode", "semantic decision", "single-use capability", "formal read-back"],
      relations: ["最高权限语义判断决定 runtime_allowed 或 human_required", "Prepare 冻结 typed parameters、preimage 和 executor hashes", "Execute 再取证、Authorize、single-use Consume 后才执行", "git-local 只走固定 Git argv", "github-api 只走固定 REST endpoint/method", "每个动作回读精确 identity 与目标字段"],
      failureRecovery: ["同名远端已存在或账号不符时不创建", "远端已创建但 push 失败时从现有 PRIVATE 身份继续而不重建", "rename 目标已存在或 identity 改变时停止", "默认分支与预期不同就显式处理并重查", "delete/transfer/force-update 响应不确定时先读现场而不重放", "任一 target/executor/preimage/epoch 漂移使旧能力失效"]
    },
    teaser: "创建空 PRIVATE 仓库，以及删除、转移、改名、改变可见性、默认分支或远端等高影响动作，必须绑定精确目标、恢复条件和正式回读；普通 Git 操作不会因此全部变成人工审批。",
    status: "当前 E96 protection contract 已激活，受保护重大动作合同与 E95 同字节/SHA；源 main=806b668…包含类型化 PRIVATE 创建通道，历史回归可追溯，但本次没有真实创建仓库或执行 broker/人类因子 E2E",
    statusTone: "mixed",
    value: "把创建仓库、本地 ref 删除/强更、remote URL 替换，以及 GitHub 可见性、改名、默认分支、删除和转移收进九个封闭动作；每次只改变一个精确目标、保留恢复依据并从现场回读，同时让普通 commit 和 normal push 不被误升级。",
    why: "这些动作会改变仓库身份、公开面、默认入口或可恢复历史，目标错一位就可能泄露或丢失；但一律弹人类确认同样不正确。产品让最高权限智能体按真实意图决定 allow、step_up、deny 或先补证据，机械适配器只验证并执行一个被类型化的动作。",
    example: "例如我说“把仓库改名但不要改变公开性和默认分支”。系统冻结旧 slug、database/node ID、visibility、default branch 与新名应不存在；只允许固定 rename 动作。完成后必须从新 slug 回读同一 ID、同一 visibility 和同一 default branch。它不会顺手改 owner、公开性或默认分支，目标漂移就停止。新建 PRIVATE 仓库则走另一条 create 通道，创建后仍要单独完成 origin、normal push 和默认分支收敛。",
    result: "我会得到九种动作之一的精确目标、变更前状态、语义判断、运行时或人类验证要求、单次执行能力、现实动作结果和正式回读。成功只证明该动作的目标字段已经收敛；后续普通 Git、Owner 登记或项目发布继续分层完成。结果不确定时保留 state_unknown 并先读现场，不重放破坏性动作。",
    readerStates: {
      pass: "正式 E 盘保护规则、最高权限判断、目标身份、前置状态、一次性能力、执行器和回读全部匹配时，执行一个精确重大动作；新仓库还要完成后续 origin、首次 push、默认分支和登记回读才算完整交付。",
      problem: "源码修复后若安装态仍旧、目标漂移、创建后 push 未完成、回读不一致或恢复条件不成立，继续阻断对应未完成步骤并保留已形成的本地/远端状态，不能靠管理员权限或本地测试绕过。",
      unavailable: "Current E release 身份、GitHub 现场身份、已登记因子或重大动作适配器不可用时，不执行该动作；普通只读诊断和不依赖该入口的低风险 Git 工作可以继续。"
    },
    decisionImpact: [
      "普通本地读取、可逆编辑、定向提交和已授权正常推送不自动升级为重大动作。",
      "git-local 固定只允许 delete-local-ref、force-update-local-ref、replace-remote-url；github-api 固定只允许 create-repository、set-visibility、rename-repository、set-default-branch、delete-repository、transfer-repository。",
      "create-repository 只负责创建空 PRIVATE 远端；配置 origin、首次 normal push、live Admission、Owner 登记和 default-branch convergence 必须随后分别完成。",
      "每种动作使用自己的精确参数、preimage 和 read-back；改名不能顺带改 owner/visibility/default branch，替换 remote URL 不能变成任意 Git 命令。",
      "是否需要人类因子由最高权限智能体结合真实目标和风险判断，不由适配器按动作名称机械决定。",
      "Passkey（通行密钥）、TOTP（动态验证码）、Recovery（恢复码）、Account（账号验证）是四类因子；Google 和 Microsoft 只是 Account 类别的不同 Provider（提供方）。",
      "当前 Git Owner 源码基线已经推送，但针对 current E release 的安装和真实 broker/人类因子 E2E 未执行，因此只把历史源码/回归层标成通过。",
      "C 盘第 79 代已退役；current E release 是当前保护合同。历史 6afc858 只证明当时修正的四类因子和 step_up 语义，不自动证明当前 consumer。"
    ],
    problem: "此前 GitHub 总索引合同把 Google/Microsoft 当成独立因子，并让适配器按 effect（动作类型）机械派生 human_required；历史 6afc858 已改成四类因子、独立 Account provider，并让 human_required 只消费最高权限智能体的 step_up。Current E contract 保持同一判断边界，但 Git consumer 没有本轮安装/E2E 证据。",
    implementation: [
      "Adapter schema 只有两个 effect family：git-local 的 3 个操作和 github-api 的 6 个操作；不接受 shell string、任意 executable、别名、重定向或任意 REST endpoint。",
      "Prepare 读取 live Admission 与 GitHub metadata，冻结 repo database/node ID、worktree/common-dir、visibility/default branch、typed parameters、完整 argv、execution_mode、语义判断、preconditions 与 adapter/native executor hashes，能力 TTL 为 30 秒。",
      "最高权限智能体的 allow 冻结为 runtime_allowed，step_up 冻结为 human_required；deny、needs_evidence、suspected_tamper 在读取 broker 或执行 effect 前失败关闭。适配器不能按动作名自行要求或取消人类因子。",
      "Execute 依次重新取得现场事实、调用 AuthorityHost AuthorizeMajorAction、再取证并 single-use Consume，非 dry-run 只在 consume 成功后最终取证并执行固定 argv；任何 target、参数、preimage、assessment、executor 或 epoch 漂移都使旧能力失效。",
      "git-local 只使用固定 Git for Windows 与 ArgumentList，清除 Git/SSH/askpass/config 环境覆盖并禁用 hooks/credential helper；github-api 只调用固定 gh api endpoint 与 method。",
      "类型化 create-repository 只接受 expected_absent=true、visibility=PRIVATE、expected_local_branch 和 expected_head_oid；它要求 canonical worktree clean，并固定调用本人账号的空仓库创建接口。",
      "rename-repository 冻结旧/新 slug、同一 database/node ID、visibility 和 default branch；新 slug 必须 absent，回读必须确认 identity 与除名称外的字段不变。其他 set/delete/transfer/ref/remote 操作也按各自 schema 精确绑定目标字段。",
      "Current E release 把人类因子固定为 Passkey、TOTP、Recovery、Account 四类；Google/Microsoft 归入 Account provider。Git Owner 历史 6afc858 源码使用同一语义。",
      "最高权限智能体拥有 allow（允许）、step up（补充人类验证）、deny（拒绝）和 needs evidence（先补证据）的语义判断。",
      "机械适配器只能验证登记、签名、nonce（一次性随机凭据）、目标、事实、完整性、执行器和动作边界，不能按 effect 名称推导 human_required。",
      "Owner 仓库已经原位升级合同与适配器：非执行判断 deny（拒绝）、needs_evidence（先补证据）、suspected_tamper（疑似完整性异常）在 proposal（动作提案）前失败关闭，allow（允许继续）可走 runtime_allowed（运行时允许），step_up（补充人类验证）才产生 human_required（需要人类验证）。",
      "历史提交 6afc858 曾 normal push 到公开 main 并远端回读；当前仓库 main 与 live origin/main 均为 806b668。当前源码包含 PRIVATE 创建与四类因子语义，但历史证据未包含 current E consumer 安装、真实仓库创建或 broker/人类因子 E2E，因此生产层保持未闭合。",
      "网页只展示公开安全的动作类别、规则差异和证据层，不公开因子秘密、账号身份、内部请求材料或可重放参数。"
    ],
    flow: [
      "先从九个固定操作中选择一个；把其精确仓库/ref/remote、旧值、目标值、恢复条件和 execution_mode 写进 typed JSON，不接受自由命令",
      "最高权限智能体按真实目的、范围、可恢复性和异常证据给 allow、step_up、deny、needs_evidence 或 suspected_tamper；只有前两者继续",
      "Prepare 取得 live Admission/provider facts，冻结 identity、preimage、argv、参数、执行器 hashes 和 30 秒 TTL；dry_run 与 execute 不能互相升级",
      "需要人类因子时只用 Passkey/TOTP/Recovery/Account 之一；Authorize 后再次取证，single-use Consume 成功才进入现实动作",
      "执行前最后核对同一 target、参数、preimage、assessment、executor 与 AuthorityHost epoch；任一漂移就让旧能力失效",
      "固定 Git argv 或固定 GitHub REST endpoint 只执行一次；native 返回非零或响应丢失仍先从本地/GitHub 现场回读",
      "read-back 比较操作自己的目标字段：ref OID、remote URL、repo identity/visibility/name/default branch/existence/owner；不以命令成功替代现实状态",
      "create 之后另做 origin、normal push、default-branch convergence 与 Owner 登记；其他动作成功后也只报告精确字段变化，项目发布/恢复继续由对应 Owner 完成"
    ],
    concepts: [
      { term: "Major action（重大动作）", explanation: "会删除、转移、公开、重命名或改变仓库关键身份和恢复路径的 GitHub 现实操作。" },
      { term: "Typed effect（类型化动作）", explanation: "九个固定操作之一，使用封闭字段、argv、endpoint 与回读合同；不是通用 shell 或 GitHub API 通道。" },
      { term: "Proposal（动作提案）", explanation: "Prepare 冻结的短时不可变候选，包含身份、preimage、参数、执行模式、语义判断和执行器指纹。" },
      { term: "Single-use capability（单次执行能力）", explanation: "Authorize/Consume 后只能对同一提案消费一次；漂移或重放都会失败。" },
      { term: "Execution mode（执行模式）", explanation: "dry_run 只验证能力且不得执行；execute 才允许在全部门成立后执行，二者不能互相升级。" },
      { term: "Human factor（人类因子）", explanation: "Passkey、TOTP、Recovery、Account 四类已登记证明中的任一类；是否需要由最高权限智能体判断。" },
      { term: "Semantic decision（语义判断）", explanation: "结合用户真实目标、范围、影响和可恢复性决定允许、补验证、拒绝或先补证据。" },
      { term: "Mechanical adapter（机械适配器）", explanation: "只核对签名、一次性凭据、目标、事实、执行器和边界并执行；不能自行扩大授权或决定人类下限。" },
      { term: "Preimage（变更前状态）", explanation: "动作前真实仓库身份、可见性、默认分支或远端配置，用于判断漂移和恢复。" },
      { term: "Read-back（正式回读）", explanation: "动作之后从 GitHub Owner 现场重新读取最终状态；命令返回成功不能替代它。" }
    ],
    boundaries: [
      "管理员权限、插件、账号登录或适配器存在都不产生用户授权",
      "普通提交和正常推送不会仅因使用 GitHub 就自动要求人类因子",
      "九个 typed effect 是闭集；不开放任意 shell、任意 Git argv、任意 gh alias/extension、任意 endpoint 或任意 payload",
      "Dry-run 仍验证授权与 capability，但 execute_allowed=false、capability_consumed=false，不调用 effect executor",
      "人类因子值、恢复秘密、账号身份和一次性执行材料不进入公开网页",
      "源码、安装态或正式 E 盘保护规则不一致时不静默选择其中一份，也不把源码修复或旧第 79 代快照写成生产 E2E 已通过",
      "公开页面只报告会改变用户判断的状态、缺口和完成证据"
    ],
    failures: [
      { condition: "Current E consumer 安装/E2E 未证明", response: "不执行创建、删除、转移、改名或可见性等受保护重大动作；普通只读、可逆编辑和已授权常规 Git 工作继续。" },
      { condition: "删除/强更 ref 或替换 remote URL 的旧值/OID 不再匹配", response: "能力失效，保留当前 ref/remote 并重新取证；不把目标漂移当作允许覆盖。" },
      { condition: "改名目标已存在，或改名后 database/node ID、visibility、default branch 变化", response: "停止并报告 identity/read-back mismatch；不把另一仓库或顺带字段变更写成成功。" },
      { condition: "set-visibility、set-default-branch、delete 或 transfer 后回读不一致", response: "保留 state_unknown，先从 GitHub 现场确认最终 visibility/branch/existence/owner；禁止盲目重放。" },
      { condition: "创建前同名远端已存在、登录 owner 不符或本地 branch/HEAD/clean 漂移", response: "create-repository 失败关闭；保留本地仓库，先确认是接入已有远端、改名还是修复本地 preimage。" },
      { condition: "空 PRIVATE 远端已创建，但配置 origin 或首次 push 失败", response: "不再调用 create；从已回读的同一 PRIVATE identity 继续普通 Git 收敛，保留本地首个提交并在完成默认分支回读后再登记。" },
      { condition: "首次 push 成功但默认分支或 Owner 登记未闭合", response: "把远端提交保留为已完成事实；显式修正/确认 default branch，再刷新 baseline/generation，不删除或重建仓库。" },
      { condition: "仓库身份、可见性或目标动作漂移", response: "使本次能力失效，重新取得现场事实；不能拿旧仓库名或旧可见性继续。" },
      { condition: "人类验证取消、超时或 Provider 不可用", response: "只暂停未形成的重大动作，不自动换另一因子，也不改变设备信任。" },
      { condition: "动作响应丢失或结果不确定", response: "保留同一尝试并先从 GitHub 现场回读；禁止直接重放删除、转移、改名或公开操作。" },
      { condition: "正式回读与预期不一致", response: "标记现实状态未收敛并进入恢复或人工协调；不以本地日志冒充完成。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.protected-major-actions.md", role: "Git/GitHub 重大动作 Owner 合同；历史提交 6afc858 曾对齐四类因子与最高权限语义判断" },
      { path: "E:\\GitHub总索引\\tools\\Invoke-ProtectedGitHubMajorAction.ps1", role: "重大动作适配器；human_required（需要人类验证）只消费 step_up（补充人类验证），不再按动作类型机械派生" },
      { path: "E:\\.agents\\releases\\current-rules.json", role: "解析 current E 保护合同路径的当前指针；正文路径由 Inspect 返回" },
      { path: "E:\\GitHub总索引\\AGENTS.md", role: "GitHub 总索引的项目重大动作边界和公开安全规则" }
    ],
    verification: [
      "2026-08-29 历史提交 6afc858 修复五因子与机械 human_required（需要人类验证）旧语义，并 normal push（正常推送）到当时的公开 main。",
      "2026-08-31 Test-ProtectedGitHubMajorAction.ps1 重新通过：类型化 create 的 absent/PRIVATE/local branch/HEAD 绑定、固定 POST、dry run、竞争目标、失败响应与 read-back mismatch 均有回归；这是源码测试，不是现实仓库创建 E2E。",
      "合同与源码当前声明 3 个 git-local + 6 个 github-api 操作；回归覆盖 typed schema、多余字段/shell 拒绝、Prepare/DryRun/Execute、drift、single-use consume 与 read-back，且不对真实仓库执行破坏动作。",
      "历史 Test-ControlPlaneContracts.ps1、git diff --check 和 staged public-content hook 通过；本次未把这些历史层升级为当前执行证据。",
      "2026-08-29 当时的 GitHub API 与 ls-remote 对 refs/heads/main 回读均精确等于 6afc858d418714664a757a4950f65de8a9d3578d；它只是一条历史验收。",
      "2026-08-31 直接回读源 main/origin=806b668…与 current create-repository 合同：只允许本人账号、空 PRIVATE、expected absent、本地 branch/HEAD/clean preimage，创建后的 origin/push 明确留给普通 Git 收敛。",
      "当前 E96 protection contract 已验证；其中 protected-major-actions 合同 SHA-256=500abc3f…，与 previous E95 同字节，因此 E95 只保留为历史连续性，不冒充 current。此次没有真实创建仓库，也没有 Git consumer 的 broker/人类因子 E2E，所以模块 statusTone 保持 mixed（混合证据）。"
    ],
    relation: "它在 Publication Gate 已证明目标、内容和授权之后，单独处理少数高影响 GitHub 动作；Admission 提供现场身份，Snapshot 只记录索引代际，二者都不能替代最高权限语义判断和正式回读。"
  },
  {
    slug: "snapshot-recovery",
    shortTitle: "快照与恢复",
    title: "Refresh（刷新）、原子 Generation（索引代际）与中断恢复",
    searchAliases: ["索引中断怎么恢复", "刷新到一半能不能继续", "current generation是什么", "为什么保留previous generation", "投影和pointer不一致怎么办"],
    searchProjection: {
      intents: ["从一次中断的索引刷新恢复", "验证 current generation 是否完整", "区分投影过期与 Owner 事实漂移", "在切 pointer 前核对全部文档"],
      entities: ["70efc65c generation", "manifest", "current pointer", "previous generation", ".incoming", "8 documents / 23090 bytes"],
      relations: ["新文档先写 incoming generation", "manifest 绑定固定文档闭包与 hashes", "全部 projection 回读后才切 current", "previous 保留最后一个完整恢复点"],
      failureRecovery: ["中途失败继续使用旧 current", "残留 incoming 先做路径与 reparse 检查", "projection stale 时重写整组而不局部拼接", "pointer/manifest 无效时停止发布并恢复闭合代际"]
    },
    teaser: "总账变化时生成一个完整新版本；失败时保住旧版本，绝不留下半新半旧的 current（当前指针）。",
    status: "generation 70efc65c… 的 8 份公开文档、manifest、pointer 和兼容投影已回读闭合；live Owner 48/48、delta=0、issue=0",
    statusTone: "pass",
    value: "让公开索引可重建、可判断 stale（过期），并在写到一半、投影失败或进程中断后继续从最后一个完整版本恢复。",
    why: "八份公开文档若逐个覆盖，任何中断都会让看板混合两个观察时间。顶层 Markdown（文本投影）又容易被误当动态权威，所以必须把完整文档集合、hash（哈希）、pointer（指针）和投影关系一起管理。",
    example: "如果新 generation 已写好一部分兼容投影后失败，旧 current pointer（当前指针）仍指向完整旧代；一致性检查会报告 projection stale（投影过期）。下一次完整 publish（发布）会重写全部投影并在回读后一次切换指针。",
    result: "得到不可变 generation、闭合 manifest（清单）、current 指针、current+previous（当前加上一代）保留、明确 stale 原因和可恢复路径；同时保留公开投影“仅截至 observed_at（观察时间）”的诚实边界。",
    readerStates: {
      pass: "新代际全部文档、清单和内容指纹闭合并完成回读后，才原子切换 current（当前）指针，同时保留上一完整代际用于恢复。",
      problem: "生成或投影中途失败、八份文档观察时间不一致或稳定投影漂移时，继续保留旧完整代际并标明 stale（过期）原因。",
      unavailable: "代际清单、当前指针或恢复来源不可读时不覆盖公开投影，也不把局部新文件拼进旧快照；先恢复闭合版本再继续发布。"
    },
    decisionImpact: [
      "只有仓库 identity、visibility、remote、clone、默认分支或长期治理等 Owner 事实变化才重建。",
      "普通业务 commit、格式、时间戳或没有改变用户判断的 drift 不触发连锁 refresh。",
      "generation integrity 通过只证明这一代内部一致，不证明动态事实仍最新。",
      "partial projection failure 不切 current；旧 generation 继续有效但 projection 标记 stale。",
      "stale `.incoming` 只在名称、路径和 reparse-point（重解析点）检查通过后回收。"
    ],
    problem: "公开看板既要易读，又不能把 generated Markdown 升级成动态权威。一次 refresh 还会读 GitHub、扫描已声明 clone、生成多文档和更新私有导航，必须在中断、网络失败和并发运行时保持一致。",
    implementation: [
      "完整 refresh 在全局 mutex（互斥锁）下运行，generation 写入同卷 `<id>.incoming`，先校验路径闭合、文件 hash、bytes 和 provenance。",
      "兼容 projection 只能映射到固定八份公开文档；manifest 或 pointer 有未知字段、大小写变体、额外文件或越界路径就失败关闭。",
      "全部投影写入并回读后，current-generation.json 才原子切换；pointer 保存 manifest hash、previous id 和 current+previous retention policy。",
      "consistency checker 在 system temp 重建候选并区分 stable drift 与 volatile drift；默认不 stage、commit 或 push。",
      "hidden CheckOnly 入口只原子写 ignored 私有 consistency receipt，供机器 Owner 读取 outcome、drift files 和错误代码。",
      "fetch 最多尝试三次；失败保留 fetch_failed。commit-pinned snapshot 只刷新 metadata，不假装普通工作树已同步。"
    ],
    flow: [
      "读取现有 current pointer 并验证旧 generation",
      "获取 GitHub inventory、私有导航和已声明 clone 的现场事实",
      "生成八份公开安全文档到临时 staging",
      "写入新的 `.incoming` generation 和闭合 manifest",
      "回读 hash、bytes、schema、路径、reparse 与文档 provenance",
      "发布并回读全部兼容 projections",
      "原子切 current pointer，验证 current/previous 后再清理更旧 generation",
      "一致性检查发现 drift 时只报告；是否 refresh 由 Owner 事实变化决定"
    ],
    concepts: [
      { term: "immutable generation（不可变代际）", explanation: "发布后内容集合与 manifest 固定；下一次变化创建新 id，不原地补丁。" },
      { term: "current pointer（当前指针）", explanation: "唯一指向现行 generation 的小 JSON；只有完整回读后才切换。" },
      { term: "closed document set（闭合文档集）", explanation: "manifest 只能包含固定预期文档，不能夹带未登记文件或越界 projection。" },
      { term: "stable / volatile drift（稳定 / 易变漂移）", explanation: "身份、visibility 等稳定事实影响一致性；dirty、ahead/behind 等易变状态可报告但不默认否决。" },
      { term: "recovery material（恢复材料）", explanation: "previous generation、`.incoming`、checkpoint refs 和 unreachable objects 等可能保存中断前唯一内容，未证明前不清理。" }
    ],
    boundaries: [
      "public projection 标注 authoritative=false、decision_authority=false",
      "Fast compatibility mode 和 hidden receipt 会写 ignored 私有状态，不等于 zero-write Owner status",
      "refresh、Hook、current generation 或 consistency PASS 都不证明 publication 完成",
      "不引入数据库；未来 cache 必须可删除、可重建且不能替代 Git/GitHub/registry",
      "不创建 watcher、后台自动 refresh、自动 commit 或自动 push"
    ],
    failures: [
      { condition: "生成文档、manifest 或 projection 回读失败", response: "不切 current；保留旧 generation，并让 consistency 报告 precise stale reason。" },
      { condition: "残留 `.incoming` 名称、路径或 reparse 检查异常", response: "拒绝清理，避免递归删除越出 generations root。" },
      { condition: "fetch 连续三次失败", response: "记录 fetch_failed；不把旧 refs 冒充 live，也不自动 push。" },
      { condition: "pointer/manifest 多字段、大小写漂移或 document closure 破坏", response: "generation valid=false，停止基于它的 current 判断。" },
      { condition: "Owner baseline 与 live inventory 不同但 projection hash 一致", response: "保持 generation integrity 结论，同时把 owner domain 标为 review_needed；两层不互相冒充。" }
    ],
    sources: [
      { path: "E:\\GitHub总索引\\tools\\Refresh-GitHubLocalIndex.ps1", role: "mutex、incoming recovery、generation publish、pointer switch 和 retention" },
      { path: "E:\\GitHub总索引\\tools\\Update-GitHubIndex.ps1", role: "Git/GitHub 事实到公开安全文档的生成器" },
      { path: "E:\\GitHub总索引\\tools\\Test-GitHubLocalIndexConsistency.ps1", role: "current generation 与重建结果的只读比较" },
      { path: "E:\\GitHub总索引\\docs\\contracts\\git.refresh-consistency.md", role: "owner status、refresh、consistency 与恢复边界" },
      { path: "E:\\GitHub总索引\\tests\\Run-UnitTests.ps1", role: "原子失败注入、路径闭合、reparse 和 receipt 回归" }
    ],
    verification: [
      "current-generation.json 声明 schema v1、generation root、manifest SHA-256、八份 documents、current+previous 和 pointer-after-readback。",
      "单元测试注入 projection 中途失败，验证旧 pointer 保持有效；下一次完整 publish 修复 mixed projections 后才切换。",
      "测试拒绝越界 projection、额外文件、unknown/case-variant schema 字段和 reparse-point 父目录。",
      "2026-08-31 直接回读 generation 70efc65cdfec4b9cb1305ff48086744d：manifest hash 匹配，8 份 generation 文档与兼容投影的 SHA-256、bytes 全部匹配 pointer，总计 23090 bytes；previous=d2f364cdf7664c06a34b81b07e5547df。",
      "generation integrity 与 live Owner status 分开：前者证明 2026-08-31 16:38 UTC 的投影内部完整，后者在 16:52 UTC 证明 baseline 48 / observed 48 / delta 0 / issue 0，并保留一项已接受过渡的历史提醒。",
      "本次没有通过 refresh 故障注入重新制造一次中断；恢复行为仍由既有源码回归证明，当前现场验证只覆盖已发布闭包的 read-back（回读）。"
    ],
    relation: "它把总账和诊断保存成可重建快照，但不替 Admission 判断单仓库现场，也不替 Publication Gate 批准外部发布。"
  }
];

export const project = githubIndexProject;
export const modules = githubIndexModules;
