import { createProjectSnapshot } from "./project-snapshot.js";

const sourceCommit = "9b174a94375119ee7578b5eb4eaa8e74dabc33f5";
const stateLabels = ["正常完成时", "发现问题时", "资料不可用时"];

export const personalExpressionSnapshot = createProjectSnapshot({
  observedAt: "2026-09-08T06:10:06Z",
  label: "两条表达入口和本地读取器已具备；后续效果随真实任务验收",
  boundary: "本次核对源码、技能入口和虚构测试；实际理解、拟稿满意度与跨任务主动更新仍需真实使用确认。",
  metrics: [
    { label: "说明与代拟", value: "2 个方向，各用对应资料" },
    { label: "日常资料", value: "2 份指南、1 份样本文件" },
    { label: "本地工具", value: "4 个只读命令，Python 标准库" },
    { label: "本机回归", value: "6 项虚构测试通过" }
  ],
  facts: [
    { label: "源版本", value: `personal-expression 的 PRIVATE（私有）main=${sourceCommit}；本地提交与远端 main 回读一致，工作区干净。`, hero: false },
    { label: "两个方向", value: "向本人说明时使用理解与讲解反馈；替本人拟消息时使用表达指南和匹配场景的本人文字。专业事实、已有意图和关系策略由当前任务负责。" },
    { label: "实际运行形式", value: "explain-to-me 与 reply-as-me 是现有技能入口，当前 AI 在原对话完成说明、拟稿和必要更新。expression.py 只读文件并返回 JSON，不调用模型、不访问微信、不写资料。" },
    { label: "当前可验证范围", value: "6 项临时虚构数据测试覆盖方向分开、场景筛选、草稿和待定项排除、无匹配样本、重复与非法作者标签、错误记录及消息容器格式。", hero: false },
    { label: "资料与版本", value: "日常读取和编辑位于 E:\\PersonalData\\个人表达；私有仓库 data-backup/ 保存 explain-to-me.md、reply-guide.md、reply-samples.jsonl 的版本快照。精选私人资料未被转换成公开语料。", hero: false },
    { label: "样本规模边界", value: "源项目说明记录初始参考为 22 组，并明确它不是来源或数量上限。本次没有读取私人资料，当前总数、各场景数量及资料与备份是否一致未重新核对。", hero: false }
  ],
  gaps: [
    "源机制和当前技能入口已存在；后续真实任务能否主动选择微信会话与时间窗口、选入有用表达、合并资料并在下次正常调用用上，仍待实际使用验收。",
    "媒体上下文已有约定；真实微信动画用于拟回复仍未完成验收。",
    "本轮未进行真人说明、代拟、私人数据核验或换机恢复。测试通过不代表本人已理解、认可措辞、证明备份内容一致或恢复无损。"
  ]
});

export const personalExpressionProject = {
  order: 34,
  slug: "personal-expression",
  title: "个人表达与沟通支持",
  kicker: "把事情讲明白，把已定意思写自然",
  lead: "把事情讲明白，把已定意思写自然",
  route: "/projects/personal-expression",
  visibility: "私有仓库",
  badge: "个人能力 / 表达支持",
  statusTone: "accent",
  summary: "一边帮助 AI 把事情向本人讲清楚，一边帮助 AI 按已经确定的意思拟写自然、合适的消息。前者参考本人对解释的具体反馈；后者参考表达指南、当前聊天上下文和适合场景的本人文字。两者都由处理眼前事情的 AI 在原对话完成，不需要另开一段对话或再跑一次模型。",
  why: "听不懂一段解释，与觉得一条代拟消息不像自己，是两种问题。把它们混在一起，容易拿聊天口吻指导专业解释，或者只学几个口头禅却改掉原意。这个项目把资料分开，也让有价值的纠正回到对应指南，供以后真正读到时使用。",
  plainExample: "“这段解释太绕，结合眼前这件事讲清楚。”AI 回到具体事实和判断，重新说明。另一种请求是：“意思已经定了，帮我把这条回复写自然。”AI 保留原意和分寸，给出可修改的草稿。你指出具体问题时，当前 AI 先改眼前内容，再把有用教训合入对应资料；只有实际保存并重新读到，才能说下次调用已能带出这条教训。",
  result: "本人收到一段更容易理解的说明，或一条忠于既定意思、可以修改的消息草稿；有价值的反馈会由当前 AI 合入现行资料。是否讲懂、是否自然，仍以真实沟通反馈判断。读取器、规则和测试已经具备，长期使用效果没有被测试结果代替。",
  cardStatus: "入口与读取器已具备 · 效果随真实任务验收",
  cardStatusTone: "accent",
  stateLabels,
  ...personalExpressionSnapshot,
  searchAliases: ["personal-expression", "个人表达", "个人表达与沟通支持", "向本人讲明白", "替本人拟消息", "explain-to-me", "reply-as-me", "表达反馈"],
  searchProjection: {
    intents: ["这段我没听懂，结合我的情况讲清楚", "帮我把已经定好的回复写自然", "怎样让表达纠正下次还用得上", "怎样补充适合当前用途的微信表达", "换机怎样读取个人表达备份"],
    entities: ["personal-expression", "explain-to-me", "reply-as-me", "expression.py", "reply-samples.jsonl", "reply-guide.md", "explain-to-me.md", "data-backup"],
    relations: ["说明反馈和对外表达分别维护", "当前任务决定专业事实和策略", "当前 AI 处理反馈并回读资料"],
    failureRecovery: ["无匹配样本仍可按既定意图拟稿", "资料无法读取时不伪称已引用", "选择已有私有备份检查和恢复"]
  },
  productPrinciples: [
    { title: "先分清谁在对谁说话", detail: "AI 向本人说明时，根据理解反馈讲清楚；替本人对外发言时，才参考匹配的本人表达。聊天习惯不直接等于讲解偏好。" },
    { title: "保留意思，措辞可以改善", detail: "既定事实、意图、承诺和关系分寸要保留。样本只是参考，允许改进旧说法，不靠口头禅数量或相似度打分判断效果。重要含义确实拿不准才问具体问题，普通措辞由 AI 判断。" },
    { title: "当前事情由当前 AI 办完", detail: "复用原对话中的真实背景、原话和已经看过的媒体，不把它们压成仅剩策略的一段摘要。技能负责入口，领域负责专业判断，本项目负责表达，不提供发送功能。" },
    { title: "先解决眼前问题，再留下有用教训", detail: "反馈合入对应指南，同类合并、保留场景和例外。本人已指出的问题与 AI 尚未获认可的建议分开；没有新教训就不凑记录。" },
    { title: "资料随实际用途补充", detail: "最近和历史微信都可按当前需要选用，现有样本不是固定上限。补读由现有微信能力执行，项目只保留有来源、有用途的参考，不设后台采集。" },
    { title: "程序负责读取，效果交给真实使用", detail: "Python 标准库足够完成当前文件读取和格式检查。资料编辑、语义判断和备份更新由当前 AI 按流程完成；不把规则写好了称作后续每次都会执行。" }
  ],
  readerStates: {
    pass: "拿到清楚的说明或可修改的草稿。若有值得保存的反馈，当前 AI 完成资料更新和回读，并简短说明实际记入了什么。",
    problem: "没有合适样本时明确说参考有限，仍可按既定意思拟稿；重要意思或分寸不清时，问清那件具体事情。",
    unavailable: "资料缺失、格式错误或无法读取时，说明哪些参考没取到，不伪称已经引用；写入失败时，也不把当次知道了说成已保存。"
  },
  usageExamples: [
    { ask: "“这段我没听懂，把眼前的问题、判断和接下来怎么做讲清楚。”", effect: "当前 AI 根据说明方向的反馈重讲，专业判断仍由眼前任务承担。最后是否听懂，要看本人的实际回应。", moduleSlug: "explain-to-me" },
    { ask: "“回复的意思已经定好了，帮我写得自然一些，别多加承诺。”", effect: "复用真实聊天语境，按需参考匹配样本，给出可修改的消息草稿。缺少样本不会阻断拟稿，也不虚称像本人。", moduleSlug: "reply-as-me" },
    { ask: "“刚才这句不合适，我指的是这一次的语境。”", effect: "先改当前内容，再判断是否有值得合入指南的教训；保留适用范围，不把一次纠正变成全场景禁词。", moduleSlug: "feedback-consolidation-and-lessons-sync" },
    { ask: "“这个新场景可以参考以前的说法；换机后也要能读到已保存的资料。”", effect: "当前 AI 按用途选择近期或历史上下文，只增补有用参考。已有私有版本可指定目录读取；真正恢复要选定版本、还原文件并回读。", moduleSlug: "corpus-extension-and-private-recovery" }
  ],
  components: [
    { name: "当前任务中的 AI", responsibility: "说明、拟稿、判断反馈价值及普通文件编辑", implementation: "保留现有事实和聊天语境，读取对应指南，必要时通过现有微信入口补读；更新后校验、重读，并同步私有版本快照。" },
    { name: "explain-to-me / reply-as-me", responsibility: "两个薄技能入口", implementation: "规范来源位于 E:\\.agents\\skills 下的对应 SKILL.md，用户技能目录提供发现入口；业务资料由 personal-expression 维护。" },
    { name: "expression.py", responsibility: "本地 CLI（命令行界面）读取器", implementation: "仅使用 argparse、json、pathlib、sys 等 Python 标准库，按 --data-root 读取 UTF-8 文件（也接受 BOM），返回 JSON；没有网络、模型、资料写入或媒体解码功能。" },
    { name: "三份日常资料与 data-backup/", responsibility: "分别保存讲解反馈、拟稿指南和精选表达；由私有 Git 保留历史", implementation: "日常读写使用 E:\\PersonalData\\个人表达；正常 Git 收口时更新 data-backup/。备份是私人内容的版本副本，不是公开脱敏语料，也不是另一处日常编辑入口。" }
  ],
  operationalEntrypoints: [
    { name: "读取说明方向", command: "python expression.py explain", purpose: "返回 direction=ai_to_user 与 guidance；这条读取路径不加载聊天样本。" },
    { name: "查看可参考场景", command: "python expression.py scenes", purpose: "按可用参考统计场景，返回 direction=user_to_other 与 scenes；场景来自当前资料，不是程序写死的清单。" },
    { name: "读取拟稿方向", command: "python expression.py reply --scene <scenes 返回的场景>", purpose: "返回指南和该场景的参考条目。有匹配时 status=available，无匹配时 status=reference_limited；两种状态都不直接生成草稿。" },
    { name: "检查资料结构", command: "python expression.py validate", purpose: "检查样本标识、作者与状态标签、必要字段、消息列表，以及两份指南非空；输出样本总数与可用数。它不核验原话真假、不比较两目录内容，也不证明表达效果。" },
    { name: "读取明确选择的备份", command: "python expression.py --data-root data-backup validate", purpose: "改从私有仓库快照目录检查资料。--data-root 只改变读取位置，不会复制、还原或同步文件。" },
    { name: "运行虚构回归", command: "python -B -m unittest discover -s tests -v", purpose: "在临时目录验证程序行为，不接触真实微信或私人表达资料；不用于模拟真人表达效果。" }
  ],
  technicalContracts: [
    { artifact: "explain-to-me.md / reply-guide.md", schema: "UTF-8 Markdown", owner: "当前任务中的 AI 依所属方向维护", boundary: "两份指南分别用于说明与拟稿。普通读取不会自行写回；validate 检查它们非空，读取命令不自动执行一次完整 validate。" },
    { artifact: "reply-samples.jsonl", schema: "JSONL（逐行保存 JSON 对象）：id / scene / author / status / source / context / messages / use_note", owner: "表达项目维护精选样本，原件由原来源拥有", boundary: "每条必须是对象且标识不重复；messages 必须是非空文字列表。author 接受 self_message、user_revision、ai_draft；status 接受 reference、pending、retired。标签合法不证明实际作者正确，出处与归属仍由取样 AI 核对。" },
    { artifact: "reply 输出 examples", schema: "id / author / context / messages / use_note", owner: "expression.py 的 available_samples 与 read_direction", boundary: "只选 status=reference 且 author 不是 ai_draft 的条目，再按 scene 精确匹配。输出省略原件定位用 source 字段，但上下文和文字仍可能是私人内容，不是自动脱敏。" },
    { artifact: "CLI 结果与失败", schema: "JSON；正常退出码 0，捕获的数据读取错误退出码 1", owner: "expression.py 的 main（命令行入口函数）", boundary: "文件缺失、JSON 格式错误、错误记录形状等读取问题返回 status=unavailable 与 error；reference_limited 表示没有匹配样本，不是文件损坏或拒绝拟稿。" },
    { artifact: "data-backup/", schema: "两份 Markdown 与一份 JSONL 的私有 Git 快照", owner: "当前维护资料的 AI 在正常 Git 收口时同步", boundary: "只备份三份精选资料及项目代码，不复制全部微信。恢复须明确选用版本和目标，普通文件还原后再校验与按方向回读。" }
  ],
  evidenceLayers: [
    { layer: "源实现与私有 Git", proves: `已核对项目规则、产品说明、expression.py、虚构测试；${sourceCommit} 已推送到现有 PRIVATE main 并远端回读。`, doesNotProve: "源码发布不等于已经用真实聊天补充了一批资料，也不证明换机恢复完成。" },
    { layer: "本机虚构测试：6 / 6", proves: "本轮实际执行，覆盖读取分流、参考筛选、无匹配样本、格式错误拒绝与 unavailable 返回。", doesNotProve: "不评价真人表达，不证明语料来源真实、本人满意或长期稳定使用。" },
    { layer: "技能安装与当前入口读取", proves: "本轮读到用户发现目录中的两个 SKILL.md；入口都指向当前 personal-expression 源目录，无独立读取器安装副本。", doesNotProve: "文件可读和当前 metadata（能力说明）可见，不等于一个全新自然语言任务已无提示选中入口并产出合适结果。" },
    { layer: "真实使用与本人认可", proves: "源项目已选择随真实问题和真实聊天验收，并规定由处理实际任务的 AI 同步有价值教训。", doesNotProve: "本轮没有进行这层验收；真实动画拟回复、后续任务主动补读和完整写回链仍是已知待验项。" },
    { layer: "私人资料与恢复", proves: "源码提供指定资料目录和读取私有快照的接口，现有规则明确日常目录、备份目录及恢复方法。", doesNotProve: "未读取私人文件，未验证当前样本数量、备份逐字一致或恢复结果；validate 通过本身也不比较两个目录。" }
  ],
  glossary: [
    { term: "self_message（本人原话）", meaning: "有来源、由本人写出的文字。是否归属可靠需要结合原始语境确认，程序只能检查这个标签是否合法。" },
    { term: "user_revision（本人修订）", meaning: "本人亲自修改的文字，与 AI 提议分开保存。一次修订的场景仍须保留。" },
    { term: "ai_draft（AI 草稿）", meaning: "由 AI 生成的建议。即便被发送，也不自动成为本人原话；读取器不把这个作者标签的条目选作正式参考。" },
    { term: "reference / pending / retired", meaning: "分别表示参考、待定、退出参考。读取器只使用参考状态中的非 AI 草稿，不代表每条已获本人效果认可。" },
    { term: "reference_limited（参考有限）", meaning: "所选场景没有匹配的可用样本；指南仍返回，当前 AI 可按既定意思继续拟稿。" },
    { term: "E2E（端到端验收）", meaning: "从自然请求、选用入口、读取资料到用户可见结果的真实路径。它与代码测试、文件可读及本人满意是不同证据。" }
  ],
  operatingFlow: [
    { title: "辨认表达方向", detail: "先确定是 AI 向本人说明，还是替本人对外拟消息。当前任务继续负责专业事实、已有意图和关系策略。" },
    { title: "保留上下文，取对应资料", detail: "说明方向读取讲解反馈；代拟先读拟稿指南，需要样本时再选场景。已读且未变化的内容直接复用，保留所需真实原话和媒体语境。" },
    { title: "产出当前回答", detail: "讲清楚眼前事情，或把已定意思写成自然草稿。只有会改变含义、承诺或分寸的重要不确定才问具体问题，不逐词要求确认。" },
    { title: "有反馈则改好并沉淀", detail: "当前 AI 先解决眼前表达问题，再合并有价值的教训，校验并重读受影响方向。资料更新后同步既有私有备份；无新教训就结束。" }
  ],
  sources: [
    { path: "expression.py", role: "已实际读取的程序入口与返回行为。" },
    { path: "AGENTS.md", role: "已读取的双方向职责、反馈处理、按需补读与真实验收约定；私人细节不转入网页。" },
    { path: "README.md", role: "已读取的产品用法、媒体约定边界与备份恢复说明。" },
    { path: "tests/test_expression.py", role: "已运行的六项虚构资料测试。" },
    { path: "E:\\.agents\\skills\\explain-to-me\\SKILL.md", role: "现有说明方向的薄技能入口。" },
    { path: "E:\\.agents\\skills\\reply-as-me\\SKILL.md", role: "现有拟稿方向的薄技能入口。" }
  ],
  evolution: [{ date: "2026-09-07", result: "形成说明与代拟两个入口、三份资料和标准库读取器；把反馈沉淀及按需补语料放回正常任务，后续表达效果只随真实问题与真实聊天验收。" }],
  snapshotUpdateNote: "本次只更新本项目的源码与叶包证据。私人原话、反馈正文、真实微信以及换机恢复未在网页验收中读取或执行；说明约定、已执行动作与本人认可分别陈述。",
  responsibilities: ["协助把事情向本人讲明白", "按既定意思与分寸拟写自然消息", "由当前 AI 将有价值反馈合入对应资料", "按用途补充有来源的表达参考", "提供本地只读接口与私有版本恢复方法"],
  exclusions: ["不替领域维护专业事实、关系策略或另一份本人画像", "不发送消息，发送由调用方和其现有授权处理", "不把正式文书正文按聊天口吻重写", "不训练或克隆人格，不以相似度分冒充本人认可", "不建后台监听、全账号采集或独立反馈队列", "网页不展示私人样本、反馈原文或具体关系语境"],
  repositoryNote: `PRIVATE wlyaaaaa/personal-expression，默认 main；源目录 V:\\Personal\\Projects\\personal-expression。源提交 ${sourceCommit} 已完成本机虚构回归、定向提交、正常推送与远端回读。网页是该项目的只读说明，私有仓库没有面向未知访客的代码跳转按钮。`
};

export const personalExpressionModules = [
  {
    id: "explain-to-me", slug: "explain-to-me", order: 1,
    title: "向本人讲明白", shortTitle: "向本人讲明白",
    kicker: "回到眼前问题，补上理解所需的事实与背景",
    teaser: "根据本人对说明的具体反馈，把事情讲清楚；专业判断仍由当前任务负责。",
    summary: "这条方向处理 AI 向本人说明的方式。输入是眼前问题、已知背景与本人对讲解的反馈，产出是重新组织的解释；它不靠模仿本人聊天口吻，也不把表达项目变成专业知识库。",
    status: "入口已具备，理解效果随真实问题验收", statusTone: "accent", stateLabels,
    value: "让本人能够理解当前结论为什么成立、会影响什么，以及接下来能怎么做。",
    why: "重复术语或缩短几句话，未必补得上真正缺失的背景。本人说没听懂时，AI 要回到那件具体事情，找出人物、事实或判断哪里没有说明白。",
    example: "“这个功能为什么失败，我没听懂，结合刚才的操作讲清楚。”当前 AI 复用已有证据和说明反馈，重讲失败发生在哪一步、有什么影响和实际处理办法；最终是否讲懂，以本人的实际回应判断。",
    result: "得到一段围绕原问题的清楚说明。若发现新的有效讲解教训，当前 AI 在本次任务里合入说明指南；没有固定字数、段落顺序或必须举例的模板。",
    problem: "专业事实不足时先由当前任务补证据；重要信息不清才问具体问题，不让本人选择抽象的讲解套路。",
    relation: "说明资料由本项目维护；本人背景仍由理解库拥有，专业事实和当前知识状态仍由相应领域负责。",
    readerStates: {
      pass: "说明围绕真实问题展开，本人能据此理解和行动；有新反馈时完成相应资料更新。",
      problem: "本人仍没听懂时，回到未说明白的事实、背景或判断继续讲，不把一次成功解释推成永久模板。",
      unavailable: "说明指南读不到时，明确本次未引用已保存反馈；当前任务仍可依据眼前事实组织解释。"
    },
    decisionImpact: ["向本人说明使用讲解反馈，不从本人聊天口吻推断其理解偏好。", "文书正文遵循文书规范；向本人解释文书时才使用这一方向。", "同任务已读且上下文足够时复用；资料更新后重新读一次受影响方向。"],
    concepts: [{ term: "说明方向", explanation: "说话者是 AI，听者是本人；目标是理解眼前事实与判断。" }, { term: "具体反馈", explanation: "保留本人指出的问题和适用语境，不把 AI 猜测写成固定偏好。" }],
    implementation: ["explain-to-me 技能把当前任务路由到项目的说明方向。", "read_direction(root, 'explain') 只读 explain-to-me.md，返回 direction=ai_to_user 与 guidance，不打开 reply-samples.jsonl。", "程序不生成解释也不改指南；表达组织和有价值反馈合并由当前 AI 执行。"],
    flow: ["确认当前任务是在向本人说明", "复用当前事实与已经读取的指南，缺少时读取 explain", "围绕原问题组织解释，必要时补具体背景", "有价值反馈合入 explain-to-me.md，校验并重读"],
    boundaries: ["不加载聊天样本来模仿本人说话。", "不接管本人背景库、专业事实或领域策略。", "本轮没有用虚构场景试写来宣称本人已理解。"],
    failures: [{ condition: "解释仍然难懂", response: "重新说明原问题中缺失的关系或背景；确实影响结果的不确定再问清。" }, { condition: "指南缺失或不可读", response: "CLI 返回 unavailable 与错误，当前 AI 明确哪些历史反馈没读到。" }, { condition: "指南被清空", response: "validate 可发现 empty guidance；单独 explain 只负责读文件，不会自动执行完整校验。" }],
    sources: [{ path: "expression.py / read_direction", role: "说明分支的实际读文件行为。" }, { path: "explain-to-me/SKILL.md", role: "说明方向的既有技能职责。" }, { path: "AGENTS.md", role: "说明反馈的来源与更新约定。" }],
    verification: ["本机虚构测试删除样本文件后，说明命令仍能读到虚构指南；输出没有 examples。", "已读取当前技能入口；没有开展真实理解效果验收。", "实际使用由处理真人问题的 AI 检查是否讲清楚，不新建模拟表达评分。"],
    searchProjection: { intents: ["这段我没听懂，结合我的情况讲清楚", "AI 解释太绕怎么办"], entities: ["explain-to-me", "explain-to-me.md", "ai_to_user", "理解反馈"], relations: ["专业事实由当前任务负责", "说明方向不加载聊天样本"], failureRecovery: ["指南不可读时说明参考缺失", "具体背景缺失时继续说明"] }
  },
  {
    id: "reply-as-me", slug: "reply-as-me", order: 2,
    title: "替本人拟消息", shortTitle: "替本人拟消息",
    kicker: "意思和分寸已定，再把消息写自然",
    teaser: "复用当前聊天背景和匹配参考，给出自然、可修改的草稿。",
    summary: "这条方向接收调用方已经确定的意思、战略、战术和关系分寸。当前 AI 先读拟稿指南，再按需选用本人表达参考；保留实际聊天原话和相关语境，不移植旧人名、日期、事件或承诺。",
    status: "入口与场景读取已具备，拟稿效果随真实聊天验收", statusTone: "accent", stateLabels,
    value: "把已经想好的意思变成合适的消息，减少反复修改措辞的负担，同时保留原意。",
    why: "拿几句旧话套进新聊天，可能看似相似却改变承诺和分寸。表达样本应该帮助判断合适的说法，而不是替代当前事实或关系策略。",
    example: "“我已经决定同意这次合作，但开始时间只能是下周。帮我写一条自然的回复，别加其他承诺。”当前 AI 复用前后消息，参考适合的表达给出草稿；没有对应样本时照样可以拟稿，但会说明参考有限。",
    result: "收到一条保留既定意思、可以修改的消息草稿。措辞可以比旧说法更清楚，不要求复刻口头禅；是否自然合适靠本人实际反馈，不靠相似度分数。",
    problem: "重要意图、承诺或亲密程度确实拿不准时，问清具体问题。普通用词由 AI 判断，不让本人逐字审批。",
    relation: "当前任务负责事实与策略，表达项目负责把话写合适；本项目不发送消息，发送归调用方及其既有授权。",
    readerStates: {
      pass: "草稿忠于已有意思与当前语境，供本人修改或由调用方后续处理。",
      problem: "reference_limited 表示无匹配样本；仍按原意拟稿，不假装有本人原话作依据。",
      unavailable: "样本或指南读取失败时，明确资料不可用；含义拿不准则先澄清，不能凭空补关系策略。"
    },
    decisionImpact: ["首次拟稿或处理纠正先读 reply-guide.md；已读且未更新可复用，需要样本时再选场景。", "当前真实上下文、原话和相关本人语料要保留，不只给一个策略摘要。", "媒体可使用已经看过的上下文、原始图片或看过后的描述，保留谁发、前后消息、微信类型及实际动静状态；取媒体仍由微信项目负责。", "真实微信动画拟回复仍待验收，不把媒体约定写成已经解码动画或理解成功。"],
    concepts: [{ term: "场景匹配", explanation: "scenes 返回当前可用参考的场景与数量，reply 按指定场景精确选取；不是相似度检索或自动判断关系。" }, { term: "参考有限", explanation: "没有匹配样本时仍返回指南和空 examples，不阻断 AI 按已定意思拟稿。" }, { term: "媒体上下文", explanation: "由调用方保留实际看过的内容、消息类型和动静状态；读取器本身不读取微信或解码媒体。" }],
    implementation: ["available_samples 只保留 reference 状态且作者不是 ai_draft 的条目；pending 与 retired 不进入场景统计或拟稿参考。", "reply 返回 direction=user_to_other、scene、status、guidance 和 examples；每条参考只投影 id、author、context、messages、use_note。", "省略 source 原件定位字段不代表消息已脱敏；这些结果仍限于获准的当前任务上下文。"],
    flow: ["当前任务已经定好策略并保留相关原话", "读取拟稿指南，需要时用 scenes 选择适合场景", "读取 reply 参考或明确无匹配样本", "当前 AI 拟稿，重要含义不清则问具体问题", "有表达反馈时进入现有教训合并流程"],
    boundaries: ["不自定关系策略，不擅加承诺、道歉、邀约或亲密程度。", "旧人名、日期、地点、情感和事件不能直接搬到新回复。", "不用于正式文书正文，不把某种关系中的口吻套到普通办事场景。", "不提供消息发送、模型训练或人格克隆。"],
    failures: [{ condition: "场景没有匹配样本", response: "返回 reference_limited、指南和空 examples；当前 AI 如实说明后继续拟稿。" }, { condition: "关键意思或分寸不清", response: "回到那件具体事情询问，不预设让本人选一套话术立场。" }, { condition: "媒体没看过或动静状态不确定", response: "不猜图中含义或动画内容，由调用方取得足够上下文，并保持未验状态。" }],
    sources: [{ path: "expression.py / available_samples / read_direction", role: "场景筛选与有限参考的真实实现。" }, { path: "reply-as-me/SKILL.md", role: "既定意图、语境复用和首次指南读取。" }, { path: "AGENTS.md / README.md", role: "媒体输入边界与真实验收缺口。" }],
    verification: ["本机虚构测试确认不同场景不串用、AI 草稿和待定项不作参考、source 定位不进入默认回复结果。", "无匹配样本测试确认返回 reference_limited、空 examples 与非空指南。", "本轮未读取真实微信、未生成真实回复、未发送消息，动画效果未验。"],
    searchProjection: { intents: ["帮我把已经定好的回复写自然", "没有对应样本也能拟回复吗", "图片表情和动画怎么作为回复背景"], entities: ["reply-as-me", "reply-guide.md", "reference_limited", "scenes", "微信媒体"], relations: ["既定意图先于措辞", "媒体由调用方取得", "匹配样本只是参考"], failureRecovery: ["无样本仍能拟稿", "重要意思不清问具体问题", "媒体未看过不猜测"] }
  },
  {
    id: "feedback-consolidation-and-lessons-sync", slug: "feedback-consolidation-and-lessons-sync", order: 3,
    title: "反馈怎样留到下次", shortTitle: "反馈与教训",
    kicker: "先改当前内容，再把有用教训合回现行资料",
    teaser: "保留反馈语境、合并同类教训，分清本人原话、本人修订和 AI 建议。",
    summary: "收到表达纠正后，当前 AI 先解决眼前问题，再把有价值的教训合入所属指南。本人原话、他人语境、AI 草稿和本人修订分别处理；写入文件不自动意味着本人认可了 AI 的改法。",
    status: "流程与读取接口已具备，跨任务执行随真实使用验收", statusTone: "accent", stateLabels,
    value: "让明确而有价值的表达纠正能够在以后读取资料时用上，减少反复解释同一问题。",
    why: "只改当次回复会丢失教训；把每次评价都追加成规则，又容易把一个场景的偏好误当成所有情况的要求。需要留下具体问题和适用范围，而不是积累越来越长的禁词清单。",
    example: "“这句话在当前语境不合适，改回我刚才说的意思。”AI 先调整眼前稿件；若这条反馈对以后有用，就记录实际语境、本人指出的问题、当前改法和适用范围。若新句子是 AI 的建议，会保留这个区别，不将它冒充本人定稿。",
    result: "当前问题得到处理，有价值的教训进入对应指南；只有来源可靠、值得参考的本人文字或本人修订才补入样本。更新后校验并重读，确认下一次普通读取确实能带出变化。",
    problem: "新旧反馈可能分别适用于不同情况。优先明确场景或例外；真正更正时才修改现行结论，历史由已有 Git 版本保留。",
    relation: "更新责任由处理真实事项的 AI 承担，本人不需要回到本项目另说保存；读取器不会监听其他对话或代替语义判断。",
    readerStates: {
      pass: "先交付改好的当前内容，再说明实际合入了哪项有价值教训；校验和受影响方向回读完成。",
      problem: "本人评价、本人给出的改法和 AI 未获认可的建议分清；没有新价值就不加记录。",
      unavailable: "资料不可写或本人明确只讨论时，说明没有保存；不把当前上下文记住了称为长期资料已更新。"
    },
    decisionImpact: ["说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本只收有来源的表达参考。", "同类教训合并，保留足够语境与适用范围，不把一个例子推成永久全场景偏好。", "标签格式检查和实际作者判断分开：程序无法识别一条被错误标成 self_message 的 AI 文字。", "更新后在当前任务重新读取受影响资料，并在正常私有 Git 收口时同步备份。"],
    concepts: [{ term: "作者与状态", explanation: "author 记录本人原话、本人修订或 AI 草稿；status 记录参考、待定或退出参考。两类字段服务不同判断。" }, { term: "就地合并", explanation: "修改现行相关说明、补充例外和范围；不为每次反馈新增一篇日志。" }, { term: "下一次能读到", explanation: "文件已经编辑、校验且重新读取到变化；这仍不等于未来每个 AI 都会主动执行。" }],
    implementation: ["反馈处理是 AGENTS.md 和两项技能交给当前 AI 的工作流程；expression.py 没有写入或反馈同步命令。", "read_samples 校验对象、唯一 id、作者与状态允许值、必要字段及非空文字列表；不核验事实归属或反馈含义。", "available_samples 排除 AI 草稿，即便其 status 为 reference 也不进入正式参考；新建议不能仅靠改标签变成本人原话。"],
    flow: ["先按反馈改当前回答或草稿", "区分所属方向、本人原话与 AI 建议", "保留足够语境，把有价值教训合入现行说明", "必要时增补有来源的本人文字或修订", "校验并重读受影响方向，再同步既有私有备份"],
    boundaries: ["不要求每次交流标注或审批，不为数量凑记录。", "不能可靠归属的文字不伪装成本人原话，AI 草稿被发送也不自动改变作者。", "不建立反馈数据库、监听服务、队列或表达评分体系。"],
    failures: [{ condition: "重复 id、非法作者或错误消息容器", response: "读取器拒绝该资料；CLI 返回 unavailable，由当前维护者修正真实格式问题。" }, { condition: "语义与已有教训冲突", response: "比较实际场景和来源，收窄范围、补例外或据真正更正更新结论。" }, { condition: "本次更新未写入或缓存仍是旧内容", response: "明确未保存或重新读受影响文件，不能声称新教训已经带出。" }],
    sources: [{ path: "AGENTS.md", role: "反馈处理的现有责任与顺序。" }, { path: "expression.py / read_samples", role: "格式验证的能力及局限。" }, { path: "tests/test_expression.py", role: "作者标签、重复标识与错误形状回归。" }],
    verification: ["6 项虚构回归包含错误记录对象与错误 messages 容器；格式错误不会被标为 valid，非对象记录按 unavailable 收束。", "正常更新应由实际任务校验并重读受影响方向；本轮没有读取或写入私人反馈。", "后续任务主动执行、长期稳定使用和本人认可分别等待真实结果，不用模拟试写证明。"],
    searchProjection: { intents: ["怎样让表达纠正下次还用得上", "AI 的草稿能算我的原话吗", "反馈冲突时怎样处理"], entities: ["self_message", "user_revision", "ai_draft", "read_samples", "messages", "反馈合并"], relations: ["先解决当前表达再保存教训", "标签校验不证明作者真实性", "当前 AI 编辑并重新读取"], failureRecovery: ["未写入不得称已保存", "格式错误先修资料", "场景冲突收窄范围"] }
  },
  {
    id: "corpus-extension-and-private-recovery", slug: "corpus-extension-and-private-recovery", order: 4,
    title: "补充参考与私有恢复", shortTitle: "语料与恢复",
    kicker: "按当前用途选参考，用已有私有版本保留资料",
    teaser: "最近与历史微信都可按需补充；日常资料与备份版本各有明确位置。",
    summary: "当前任务需要新的表达参考时，AI 通过现有微信直读能力选择相关会话与时间窗口，读懂上下文后只保留有用的本人表达。日常三份资料在 E 数据目录编辑，正常 Git 收口时同步私有快照；换机或恢复可读取明确选择的备份版本。",
    status: "补充流程与备份读取已具备，主动补读及恢复结果待真实验收", statusTone: "accent", stateLabels,
    value: "参考资料可以随真实需求继续生长，已经保存的教训也有明确的版本来源和恢复方法。",
    why: "固定的一批样本不可能覆盖所有新场景；直接搬入大量聊天又未必增加价值。另一方面，备份能打开不代表与日常目录一致，需要分清读备份、核对差异和真正还原。",
    example: "“这类回复可以参考以前的说法。”当前 AI 自行选择有用的会话和窗口，近期可补新表达，历史可找缺少的说法；没有值得新增的内容也算有效结果。换机时则选择已有私有备份，先检查并按方向读取，确认合适后再把选定文件还原到目标目录。",
    result: "需要时得到有来源、能供普通读取使用的新增参考；需要恢复时有可选择的私有版本和读取入口。是否实际补入了内容、下次是否用到、恢复是否完整，要分别回读。",
    problem: "最近消息不天然代表长期变化，旧态度和旧承诺也不默认延续到现在。原件不可用时不猜出处，备份目录可读也不自动证明内容最新。",
    relation: "原始微信与媒体继续由微信项目负责；表达项目保存精选参考，Git 保存三份资料的版本，不建立第二个聊天库。",
    readerStates: {
      pass: "当前 AI 完成有用途的选择、合并、资料校验和正常调用回读，再同步私有版本；恢复则核对所选版本与实际还原结果。",
      problem: "没有新增价值就不重复复制。资料与备份有差异时比较对应版本和文件，不能用样本数相等替代内容一致。",
      unavailable: "原件或所选备份不可读时，明确缺失范围；保留现有可用资料，不把目录不可用当成已经恢复。"
    },
    decisionImpact: ["当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。", "最近与历史按用途和信息价值选择，不设近期必先或等旧样本完全失效才补充的门槛。", "保留账号、会话、时间和原消息定位；他人、引用与转发只作语境，不当作本人发言。", "日常只编辑 E 数据目录；data-backup/ 是私有版本快照，不是自动脱敏、全账号同步或第二个日常入口。"],
    concepts: [{ term: "按需补读", explanation: "由当前任务决定会话与时间范围，读上下文后选有用表达；expression.py 本身不访问微信。" }, { term: "版本快照", explanation: "私有 Git 中保存的三份资料版本，更新由当前 AI 在正常收口中完成，没有后台同步器。" }, { term: "指定读取与真正恢复", explanation: "--data-root 只让程序读选定目录；真正恢复需要将选定版本还原到目标，再检查内容与正常读取结果。" }],
    implementation: ["AGENTS.md 规定选会话、读上下文、确认作者与用途、保留出处、去重合并、校验、回读和备份；两项技能承接实际任务。", "DEFAULT_DATA_ROOT=E:\\PersonalData\\个人表达；--data-root 可选择已存在的其他目录，包括 data-backup/。", "备份包含 explain-to-me.md、reply-guide.md、reply-samples.jsonl；validate 检查单个目录的结构，不做目录比较、复制、版本选择或还原。"],
    flow: ["根据当前用途选择相关会话与近期或历史窗口", "复用微信直读与所需原话上下文，判断哪些本人表达值得保留", "合并有价值参考并保留出处，无新增价值则不写入", "校验资料、按正常命令回读受影响内容，再同步私有快照", "需要恢复时选定版本、检查和还原到目标，最后回读实际结果"],
    boundaries: ["不扫描整个账号，不新建后台监听或采集服务。", "不复制完整微信数据库、解密配置或未选用的临时聊天资料。", "表达效果后续只在真实问题和真实聊天中验收，不编造试写场景证明成熟。", "网页只说明资料类别、路径和边界，不转入私人样本或反馈正文。"],
    failures: [{ condition: "微信来源暂不可读或作者不确定", response: "说明缺口，不伪造样本来源；保留当前可用参考，重要归属影响结果时才问清。" }, { condition: "主数据目录不存在", response: "读取失败返回 unavailable；可明确选择已有备份目录用 --data-root 读取，但程序不会自动替换路径或还原。" }, { condition: "备份和日常资料可能不同", response: "比较选定版本与对应文件，再处理需要恢复的内容；validate 通过和数量相等不能证明一致。" }],
    sources: [{ path: "AGENTS.md / README.md", role: "近期历史补读、源归属及私有备份恢复语义。" }, { path: "expression.py / DEFAULT_DATA_ROOT / --data-root", role: "实际目录选择与只读边界。" }, { path: "data-backup/", role: "已登记的私有版本资料目录；本轮未读取其中私人正文。" }],
    verification: ["虚构测试实际使用独立临时资料目录，验证读取器不依赖主数据目录或微信。", "本轮未重新核对当前私有样本总数、场景数量或备份一致性，未进行换机恢复。", "后续真实任务主动完成补读、选入、合并、下次调用用上，以及真实动画拟回复，均保留待验状态。"],
    searchProjection: { intents: ["怎样补充适合当前用途的微信表达", "最近和历史聊天怎样选择", "换机怎样读取个人表达备份", "validate 能证明备份一致吗"], entities: ["data-backup", "--data-root", "DEFAULT_DATA_ROOT", "reply-samples.jsonl", "微信补读"], relations: ["原始微信归现有来源", "E 数据目录用于日常读写", "私有 Git 保留精选资料版本"], failureRecovery: ["来源不可读不猜出处", "明确选择备份目录", "校验不替代目录比较和恢复回读"] }
  }
];

export const project = personalExpressionProject;
export const modules = personalExpressionModules;
