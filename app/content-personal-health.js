import { createProjectSnapshot } from "./project-snapshot.js";

const evidenceStateLabels = ["可用于当前判断", "需要复核", "本轮不可用"];

const personalHealthSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T12:00:18.5444628Z",
  label: "PRIVATE main 与回归测试已核对；当前账号、设备数据和个人健康结论未验证",
  metrics: [
    { label: "设备入口", value: "Fitbit Air" },
    { label: "采集范围", value: "21 类设备数据" },
    { label: "默认摘要", value: "睡眠 · 活动" },
    { label: "分析窗", value: "14 · 28 · 90 天" }
  ],
  facts: [
    { label: "本页证据边界", value: "本页只核对产品代码与合成证据，没有读取个人健康材料、运行账号/设备现场复核或形成个人健康结论；现实健康状态不在本页判断，不能把未读取写成没有记录或数值为零。产品已实现 14 / 28 / 90 天证据窗口与离线质量门。" },
    { label: "AI为谁负责", value: "以用户的健康、安全、自主、隐私、现实负担和已表达目标为准；不为流程完成、机构利益、设备活跃度或 AI 自信优化。" },
    { label: "谁值得信任", value: "医生有 AI 没有的查体、诊断和处方能力，但医生、机构、报告、设备和 AI 都要按证据、能力边界、信息缺口和利益关系校准信任。", hero: false },
    { label: "重大决定怎么做", value: "比较收益、风险、合理替代、暂不行动的后果、现实负担和停止或复查条件；高代价、不可逆或意见冲突时支持独立第二意见。" },
    { label: "谁做最后选择", value: "非紧急且本人有决定能力时由本人作知情选择；急症先进入现实医疗，不等待设备更新、AI分析或第二意见。" },
    { label: "当前源码与回归", value: "PRIVATE main=48d5a5b84226aac94c9567ed563e685c69915933；项目有 5 个产品 Python 模块、5 个测试模块；本轮 unittest 112 项全部通过（112/112），内部用时 27.922 秒。" },
    { label: "证据结构与恢复", value: "源码登记 39 类 API 数据类型，当前前台采集从中选择适配 Fitbit Air 的 21 类，并保全历史起点资料和有可用运动标识时的 TCX 运动文件；不是把 39 类归一成 21 类。默认摘要只展开睡眠、步数、活动分钟、已记录运动四类，比较 14 / 28 / 90 天窗口。大分页恢复合成回归覆盖 609 页，每 16 页原子记录 checkpoint，中断后只续缺页。" },
    { label: "源码规模", value: "项目只有 14 个跟踪文件：5 个产品 Python 模块、5 个测试模块、3 个规则/状态文档和 .gitignore；运行代码仅使用 Python 标准库。", hero: false },
    { label: "分页上限", value: "分页恢复最多接受 1000 页；单次字段选择上限为 256 页、64 MiB 与 50 万条记录，超过任一边界即失败关闭，不把不完整选择交给决策简报。", hero: false },
    { label: "离线回执", value: "离线 capture 回执保持 health_owner_review_required=true、current_updated=false、background_work_created=false；合成回归不能证明任何个人健康值。", hero: false },
    { label: "已保存记录怎么查", value: "具体日期仍未回答时，query/summary 只读取指定清单中一个字段和日期的页面；交回记录或覆盖摘要、缺口与截断状态，API 耗时为 0。查询通过不等于字段已可用于健康判断。", hero: false },
    { label: "运行形态", value: "没有新增服务、数据库、计划任务、后台 watcher 或持续同步节点。", hero: false }
  ],
  gaps: [
    "本轮没有调用真实 OAuth、Secret Broker、Google/Fitbit provider 或当前个人数据；源码和合成测试不能证明当前账号仍授权、当前设备同步正常或当前记录质量达标。",
    "没有任何个人健康结论、医生采用回执或高风险医疗 E2E 进入本网页证据。"
  ]
});

export const personalHealthProject = {
  order: 11,
  slug: "personal-health",
  title: "个人健康证据与安全决策",
  route: "/projects/personal-health",
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "Fitbit Air 记录导入、离线摘要和健康证据整理已实现；本页未读取个人材料或复核当前账号与设备",
  cardStatusTone: "mixed",
  ...personalHealthSnapshot,
  kicker: "让健康选择更安全、更自主，也更容易复查",
  searchAliases: [
    "健康信息怎么判断能不能用",
    "Fitbit数据怎样安全进入健康判断",
    "健康数据缺失是不是正常",
    "设备刷新为什么不自动写健康资料",
    "健康证据和诊断有什么区别",
    "医生和AI意见冲突怎么办",
    "重大医疗决定怎么找第二意见",
    "健康建议怎样比较收益风险和替代方案"
  ],
  repositoryNote: "源码位于 PRIVATE（私有）仓库。页面公开产品方法、代码结构、失败边界和测试证据，不提供不可访问的仓库链接；不读取或展示 CURRENT.md 正文、具体健康事实、报告数值、诊断、药物、个体建议、原始响应、OAuth 载荷或凭据。",
  summary: "这个项目把本人描述、检查报告、医生意见与 Google Fitbit Air（无屏健身手环）的记录整理成可复查的健康依据。手环通过手机上的 Google Health 应用同步；我明确要求更新时，项目取回睡眠、步数、活动、心率、血氧、呼吸和皮温等记录，默认先汇总睡眠、步数、活动分钟与已记录运动，并标清缺失和质量问题。AI站在用户一边，但不是一味迎合：它核对证据、解释未知、比较真实选项，也会劝阻危险行为。医生、设备和 AI 都不是自动正确；非紧急情况下，最终知情选择属于本人。",
  why: "健康决定常把几件不同的事混在一起：报告看到了什么、医生怎样解释、机构或个人可能受什么限制、AI依据什么资料、用户真正重视什么，以及不行动会怎样。若只听身份最高或声音最肯定的一方，容易把专业能力误当成永远正确，也可能忽略替代方案、利益冲突、现实负担和可逆空间。",
  plainExample: "我可以说：“更新一下 Fitbit Air 的记录，看看近两周睡眠和日常活动有没有变化，先告诉我数据够不够。”项目只为这次请求更新一次，先核对来源、日期和完整性，再把睡眠、步数、活动分钟和已记录运动的变化与缺口交给我；数据不够时就明确说不能下结论，不把缺记录写成身体异常。",
  result: "设备方面，我得到最近 14 / 28 / 90 天的睡眠时长、每日步数、活动分钟和已记录运动次数；另有最近 14 / 90 天的睡觉与起床时段，以及覆盖日期、变化和缺口。健康决定方面，我得到可复查的事实、未知、选项及其收益、风险、负担和退出条件，知道什么时候必须就医、什么时候值得取得第二意见；不是身体总分、自动诊断或替我下命令的答案。",
  dataSources: {
    title: "具体读什么、从哪里来、拿来做什么",
    intro: "这是代码支持的输入与采集范围，不是本次个人记录。设备入口是 Fitbit Air，经 Google Health API v4 读取 google-wearables（Google/Fitbit 追踪设备家族），不含手工输入或手机估算。家族标识不能逐条证明唯一机型；当前授权、同步情况和记录质量仍需当次核对。",
    rows: [
      { source: "本人描述、检查报告与医生意见", data: "本人提供的感受、目标、现实负担，报告所见和医生的解释；普通问答先用已经整理好的当前信息，需要时才看相关原件。", result: "分清事实、解释、建议与未知，比较选择并准备需要向医生追问的问题；不自动登录医院或把报告内容变成诊断。" },
      { source: "Fitbit Air / Google Health：日常活动", data: "6 类：步数、距离、活动分钟、活跃区间分钟、久坐时段、总热量。", result: "默认摘要展开步数和活动分钟，比较最近 14 / 28 / 90 天与前一同长窗口，列覆盖日期、真实零值和缺口；其余先保全，不自动解释成健康结论。" },
      { source: "Fitbit Air / Google Health：运动与体能", data: "5 类：已记录运动、游泳趟数、VO2 max（心肺能力估计）、每日 VO2 max、跑步 VO2 max。", result: "默认只汇总已记录运动的次数和日期；没记录不能推断没有运动。游泳和心肺能力数据可保全，但默认摘要不展开分析。" },
      { source: "Fitbit Air / Google Health：睡眠", data: "1 类：睡眠记录，包括记录中的时段及主睡眠、小睡或未分类信息。", result: "汇总睡眠时长、睡觉与起床时段及规律性线索，比较时间窗，并标明覆盖不足、重叠冲突和未分类记录。" },
      { source: "Fitbit Air / Google Health：心率与变化", data: "4 类：心率、每日静息心率、HRV（心率变异性）、每日 HRV。", result: "当前导入可请求并保全这些原始记录；默认摘要只展示是否有记录、记录数、页数及暂不分析原因，不读取其正文或据此诊断。" },
      { source: "Fitbit Air / Google Health：血氧、呼吸与皮温", data: "5 类：血氧、每日血氧、每日呼吸率、睡眠呼吸汇总、睡眠皮温变化。", result: "当前导入可请求并保全，默认摘要仍只保留记录存在情况。睡眠皮温变化不等于体温计测得的核心体温，单一信号也不等于疾病。" },
      { source: "账号资料与运动附属文件", data: "profile（账号资料）用于确定可请求的历史起点；有可用运动标识时，还取回 TCX（运动轨迹文件）原件。这两部分不计入上述 21 类。", result: "不把 profile 当成当前配对或在线检查。运动文件保全不等于摘要分析路线；Air 的定位来自手机协同，不是手环内置 GPS。" }
    ],
    note: "默认摘要只展开睡眠、步数、活动分钟和已记录运动四类；其他数据保全后也不自动用于健康判断或更新当前信息。血糖、体重、体脂、身高、核心体温、心电图、心律不齐通知、饮食与饮水日志等未纳入默认 Air 采集；通用接口有定义，不代表本项目已经收集。"
  },
  readerStates: {
    pass: "事实、未知、选项、主要收益和风险都已说清，用户理解后可以选择、拒绝、暂停、复查或改变主意；这不表示某个建议永远正确。",
    problem: "依据不足、意见冲突、解释不清、决定重大或可能存在利益关系时，先补最有价值的信息、要求说明或取得独立第二意见，不靠投票和身份决定。",
    unavailable: "出现急症红旗时不等待资料完整；缺少查体、诊断或可靠来源时也不让 AI 补猜。产品明确说明当前不能判断，并给出更安全的现实下一步。"
  },
  stateLabels: evidenceStateLabels,
  methodCanvas: {
    kicker: "健康选择画布",
    headline: "遇到一个健康问题时，AI怎样帮助我做出更好的决定",
    description: "先保护生命和选择空间，再核对证据与利益关系；技术只负责把资料变可靠，不能替任何人获得自动正确。",
    steps: [
      { actor: "先定问题", title: "我现在真正要决定什么", detail: "把“担心”变成一个现实选择：是否需要立即行动、补资料、接受建议、取得第二意见，还是先观察。" },
      { actor: "先看安全", title: "有没有不能等待的危险信号", detail: "可能危及生命、肢体或快速恶化时先进入现实医疗，不把资料完整当成前置条件。" },
      { actor: "分清信息", title: "什么是事实，什么是解释和建议", detail: "把本人感受、报告实测、医生解释、AI分析和明确未知分开，旧资料不冒充现在。" },
      { actor: "校准信任", title: "谁知道什么，也可能遗漏什么", detail: "比较专业能力、掌握的信息、可核验程度、时间与机构限制，以及可能影响建议的利益关系。" },
      { actor: "比较选择", title: "每个方案的收益、风险和代价是什么", detail: "连同合理替代、暂不行动的后果、可逆性、现实负担、停止与复查条件一起说明。" },
      { actor: "本人决定", title: "选择、暂停、复查，也可以改变主意", detail: "AI负责研究和劝阻危险行为，医生负责临床能力与解释；非紧急情况下，知情选择仍属于本人。" }
    ],
    columnsAriaLabel: "AI、本人和其他信息来源的责任边界",
    columns: [
      { title: "AI负责", note: "研究与保护选择空间", items: ["搜索、比较并解释资料", "指出冲突、未知与利益关系", "反对危险做法，但不替用户或医生获得临床权限"] },
      { title: "本人决定", note: "目标与最终取舍", items: ["说明症状体验、目标和现实负担", "要求解释、拒绝、暂停或寻求第二意见", "在非紧急且有决定能力时作知情选择"] },
      { title: "都不是自动权威", note: "按能力和证据使用", items: ["医生提供查体、诊断、处方和专业解释", "报告与设备提供特定时间的有限观察", "任何一方都可能遗漏，也都应允许质疑和复核"] }
    ]
  },
  productPrinciples: [
    { title: "先保命，再研究", detail: "有急症红旗时先进入现实医疗，不等设备同步、AI分析或第二意见；延误本身可能是最大伤害。" },
    { title: "只把用户的实际利益当成功", detail: "健康、安全、自主、隐私、现实负担和用户目标优先；流程完成、检查更多、机构收入或 AI 自信都不能替代它们。" },
    { title: "把事实、解释、建议和选择分开", detail: "报告看到了什么、医生怎样解释、AI怎样分析、用户决定做什么不是同一种证据。" },
    { title: "校准信任，不盲从也不敌视", detail: "医生、机构、设备和 AI 都按专业范围、掌握的信息、可核验程度与相关利益来使用；有局限不等于无价值，有利益关系也不自动等于恶意。" },
    { title: "决定越重，证据门越高", detail: "越不可逆、越昂贵、伤害越难补救的选择，越需要完整解释、独立复核和明确停止条件。" },
    { title: "第二意见用在真正值钱的地方", detail: "重大治疗、意见冲突、关键不确定或明显利益关系值得独立复核；急症和时限敏感问题不能因此等待。" },
    { title: "永远比较真实选项", detail: "说明预期收益、主要风险、合理替代、暂不处理的后果、时间窗口和现实负担，不把默认流程写成唯一选择。" },
    { title: "安全时优先可逆的小步", detail: "效果接近时先选可暂停、可观察、可恢复的行动，并提前写清停止、升级和复查条件。" },
    { title: "最终选择属于本人", detail: "用户可以提问、拒绝、暂停、换医生、索要记录和改变主意；产品不用羞耻、焦虑或连续打卡推动服从。" },
    { title: "未知和纠正都是正常状态", detail: "不知道就明确说不知道，冲突信息并列保留，判断随新证据更新；旧报告和一次结论不变成永久事实。" },
    { title: "只增加能改变决定的负担", detail: "不为安全感持续采集、评分或追加检查；更多数据也可能只增加噪声、隐私成本和健康焦虑。" }
  ],
  decisionRoles: [
    { role: "本人", can: "说明体验、目标、偏好、负担承受度、副作用与知情选择", cannot: "仅凭偏好确定病因，或让危险方案变安全" },
    { role: "医生", can: "完成问诊、查体、诊断、处方与专业解释，并对专业行为负责", cannot: "仅凭身份证明结论必然正确、没有偏差或利益冲突、已经考虑所有合理替代" },
    { role: "AI", can: "整理输入、搜索并比较资料、发现矛盾、解释不确定性、准备问题和劝阻危险行为", cannot: "补出未见体征、独立完成临床诊断或处方，也不能因为找到一条指南就宣判医生错误" },
    { role: "检查报告", can: "说明特定时间、样本和方法得到的数值或所见，以及报告者当时的解释", cannot: "单独证明整体诊断、因果、现在仍相同或必须采取某项治疗" },
    { role: "Fitbit Air 等已接入设备", can: "在来源和质量闭合时提供睡眠、日常活动、心率等特定时间记录或趋势线索", cannot: "证明医疗级准确、没有记录等于零、没有提醒等于没有疾病，或一个信号等于诊断" }
  ],
  responsibilities: [
    "以用户的健康、安全、自主、隐私、现实负担和已表达目标为成功标准",
    "先识别急症红旗，再把事实、解释、建议、利益关系和未知分开",
    "搜索并比较当前资料，说明证据适用范围，而不是把医生、指南或 AI 当成自动答案",
    "为重大决定列出收益、风险、合理替代、暂不行动的后果、现实负担和停止或复查条件",
    "在高代价、不可逆、意见冲突或关键解释不足时帮助准备独立第二意见",
    "只在本人明确发起时更新最小必要资料，不建立监督、打卡、健康评分或后台监测"
  ],
  exclusions: [
    "不诊断疾病、不决定用药、不替代医生查体、诊断或处方，也不让医生意见替代用户的知情选择",
    "不因医生可能有局限或利益关系就推定恶意、否定专业能力或鼓励擅自停药",
    "不把“站在用户一边”写成迎合用户；用户想做危险事情时必须明确劝阻并给出更安全的下一步",
    "不建立健康总分、疾病本体、诊断引擎、中央画像、数据库、RAG、服务或队列",
    "不建立计划任务、持续设备同步、后台监测、自动提醒或每日任务债",
    "不把空记录、未测、未见记录、阴性、数值零和正常混成一种状态",
    "不自动更新 CURRENT.md，也不让导入器或简报替 Health Owner 采用事实",
    "不把当前账号、当前设备数据或个体健康状态从源码和合成测试中推断出来"
  ],
  glossary: [
    { term: "现行健康底色", meaning: "经过处理的当前回答材料；普通问题直接使用它，不反复打开来源原件。" },
    { term: "Evidence provenance（证据来源链）", meaning: "一条信息来自报告、医生、本人、设备还是模型，以及这条来源是否足以支持当前用途。" },
    { term: "Manifest（运行清单）", meaning: "记录一次导入的字段、窗口、页面、字节、哈希、分页和完成状态，也是唯一允许的续跑身份。" },
    { term: "Decision context（当前判断材料）", meaning: "与当前问题相关、来源闭合且质量足够，允许交给 Health Owner 复核的最小字段集合。" },
    { term: "decision_ready（可用于当前判断）", meaning: "字段通过来源、完整性和质量门；它不表示身体正常，也不等于诊断。" },
    { term: "inventory_only（仅清单）", meaning: "只记录某类资料存在，不读取其正文，也不允许它影响当前健康判断。" },
    { term: "Health brief（决策简报）", meaning: "从已完成清单离线生成的确定性结构摘要，列出可用字段、阻断字段和原因，不包含原始全量载荷。" },
    { term: "Health Owner（健康资料责任源）", meaning: "最后判断证据是否与当前问题相关、是否值得局部更新现行底色的人工责任边界。" },
    { term: "Foreground refresh（前台刷新）", meaning: "本人明确发起并在同一任务中完成的采集；没有 watcher、计划任务或后台同步。" },
    { term: "Fail closed（失败关闭）", meaning: "来源、清单、哈希、质量或凭据边界不成立时停止对应路线，不换路线补猜。" }
  ],
  operatingFlow: [
    { title: "先判断是否需要新证据", detail: "普通问题先用现行底色；已保全的某日记录仍未回答时，只按一个字段和日期离线窄查。只有新报告、纠正、来源冲突、完整性问题或本人明确设备刷新才进入维护。" },
    { title: "凭据只穿过受保护边界", detail: "首次 OAuth（账号授权协议）使用 PKCE（授权码防截获校验）和回环回调，长期凭据经标准输入进入受保护中心，不生成 token 文件。" },
    { title: "明确需要时取回 Fitbit 记录", detail: "已有成功导出尚未处理时先离线完成；否则通过固定凭据入口只读请求 Google Health API，取回默认 21 类设备记录、历史起点资料和可用的运动文件，失败不换账号。" },
    { title: "先保存原始记录，再检查完整性", detail: "Importer（导入器）把原始页面与运动附件原样保全，并记下日期、记录数、分页和内容指纹；中断后从同一份导出清单续缺页，不重新猜目录。" },
    { title: "从四类记录形成日常摘要", detail: "Capture（离线验收）核对完整清单与文件指纹后，Brief（摘要生成器）统计睡眠、步数、活动分钟、已记录运动及时间窗变化；覆盖不足、冲突和未记录分别列出，其余字段默认不展开正文。" },
    { title: "Health Owner 做最后一跳", detail: "只消费与当前问题相关且字段自身 decision_ready 的结果；被阻断字段和 inventory_only 内容不进入判断。" }
  ],
  components: [
    { name: "personal-health Skill", responsibility: "把普通问答、来源维护和设备刷新分成三条窄入口。", implementation: "普通问答只读现行底色；维护时才打开最小来源，不使用 Codex 记忆或旧中央知识库。" },
    { name: "CURRENT.md", responsibility: "保存处理后的现行健康底色。", implementation: "只由 Health Owner 在证据会改变判断时局部更新；网页只公开它的角色，不读取正文。" },
    { name: "SOURCES.md", responsibility: "登记已处理来源的定位与处理范围。", implementation: "只在新报告、纠正、冲突、审计或答案关键缺口时读取；网页不公开路径、哈希或个人内容。" },
    { name: "google_health_enroll.py", responsibility: "完成一次桌面 OAuth 授权并安全存入长期凭据。", implementation: "只读 scope、PKCE、回环 callback、stdin secret、恢复副本与 lookup read-back；不生成 token 文件。" },
    { name: "google_health_refresh.py", responsibility: "提供唯一前台设备刷新入口。", implementation: "先离线消费待处理成功交接；必要时固定 Secret Broker 调用一次，输出有界且不含秘密，超时终止整棵进程树。" },
    { name: "google_health_import.py", responsibility: "从 Google Health API 取回 Fitbit Air 默认范围的记录、profile 与可用 TCX，保全原件并维护可续跑清单；也提供已保全记录的离线窄查。", implementation: "在线分支负责连续窗口、原子写、SHA-256、分页/资产闭包、请求预算、锁与精确 resume manifest；query/summary 分支在构造客户端之前返回，只读精确清单与选中页面，不访问网络或凭据。" },
    { name: "google_health_capture.py", responsibility: "离线消费唯一成功交接。", implementation: "核对 complete manifest 与哈希，生成验证回执和 brief；本地证据闭合并持久化后消费 pointer，再把结果交给 Health Owner 审阅，不更新 CURRENT.md。" },
    { name: "google_health_brief.py", responsibility: "把睡眠、步数、活动分钟与已记录运动变成统计、比较和质量说明，并区分可采用、被阻断、仅保全的数据。", implementation: "默认摘要只读 4 类低噪声字段，计算 14/28/90 天窗口与覆盖质量；其他字段只读清单元数据。API 与 credential access 均为 false。" },
    { name: "HealthLongevity（早期项目）", responsibility: "只作为早期工程结构与交付经验的历史参考，不再拥有任何写入。", implementation: "现役健康协作由 personal-health 与 Health Owner 承接。网页没有读取 HealthLongevity、CURRENT.md、SOURCES.md、报告或任何健康记录、诊断、数值和私人正文。" }
  ],
  usageExamples: [
    { ask: "医生建议一项重大治疗，但我没听懂为什么一定要做。", effect: "先确认是否紧急，再把医生的依据、适用前提、主要收益和风险、合理替代、暂不处理的后果与复查条件讲清；解释仍不足时，帮助准备独立第二意见。", moduleSlug: "health-owner-boundary" },
    { ask: "两位医生意见不一致，我应该听谁的？", effect: "不按资历、人数或 AI 偏好投票，而是比较两边看到的事实、专业范围、关键假设、证据质量与可能遗漏；必要时让合适专科独立复核同一份原始资料。", moduleSlug: "health-owner-boundary" },
    { ask: "AI查到的指南和医生说法冲突，能直接停药吗？", effect: "不能。AI说明冲突发生在哪条事实、适用范围或假设，帮助向原医生追问或取得现实临床复核；不擅自开始、停止或替换处方治疗。", moduleSlug: "health-owner-boundary" },
    { ask: "这个健康问题需要重新翻报告吗？", effect: "先看已经整理好的当前信息是否足够；只有新报告、事实纠正、来源冲突或一个会改变选择的关键缺口，才打开最小相关来源。", moduleSlug: "current-evidence-route" },
    { ask: "更新一下 Fitbit Air 的记录，看看近两周睡眠和日常活动有没有变化，先告诉我数据够不够。", effect: "在当前任务里从 Google Health 取回默认范围的设备记录，保全后生成睡眠、步数、活动分钟与已记录运动的统计和缺口说明。中断时从原处续跑；只有来源清楚、质量足够且与问题相关的结果才进入复核，不建立后台同步。", moduleSlug: "protected-foreground-refresh" },
    { ask: "设备导出有几百页，中断后还要从头下载吗？", effect: "不用。恢复时会从最后一页已经核对完成的位置继续，只补缺页；若现场与原计划对不上，就停下来说明原因，不拿半份数据继续统计。", moduleSlug: "raw-preservation-resume" },
    { ask: "心率、血氧这些记录也会自动变成健康结论吗？", effect: "不会。默认只展开睡眠、步数、活动分钟、已记录运动四类；心率、血氧、呼吸、皮温等已保全字段只展示记录存在情况及暂不分析的原因。字段本身通过质量门、且与当前问题相关后，才可由健康资料负责人决定是否采用。", moduleSlug: "offline-decision-brief" },
    { ask: "上周三的步数有没有保存？不用重新同步。", effect: "如果现行底色还不能回答，就在已经完成的精确导出清单中只查步数字段和那一天；返回实际记录、覆盖日期和缺口，不重新授权或下载，也不把没查到记录说成走了零步。", moduleSlug: "offline-decision-brief" },
    { ask: "有记录为 0 和完全没有记录，是一回事吗？", effect: "不是。真实零、无记录、缺字段、结构残缺和来源未知会分别写清；证据质量不够的字段不会被拿去支持当前健康判断。", moduleSlug: "evidence-three-state" },
    { ask: "今天先停，别再给我加健康任务。", effect: "停止当前非紧急工作，只保留恢复这次判断所需的最小断点；不打卡、不追问、不评分，也不把沉默解释成继续授权。", moduleSlug: "health-owner-boundary" }
  ],
  evidenceLayers: [
    { layer: "Project rules（项目规则）", proves: "普通问答、来源维护、设备刷新、红旗与低打扰边界已经明确。", doesNotProve: "任何当前个人健康事实、诊断或医疗建议正确。" },
    { layer: "Source code（源码）", proves: "授权、前台刷新、导入、精确续跑、离线验真、字段质量门和 Owner 审阅合同真实存在。", doesNotProve: "当前账号可用、provider 在线或本轮取得了真实记录。" },
    { layer: "112 tests", proves: "合成夹具下的凭据不落盘、一次调用、原始保全、分页/哈希、续跑、capture 结果闭合、决策门、inventory-only 和失败语义通过。", doesNotProve: "真实 OAuth、真实当前设备、网络兼容或医学结论。" },
    { layer: "PRIVATE 仓库身份", proves: "main=48d5a5b 与远端同步、工作树干净，网页内容绑定精确源码版本。", doesNotProve: "PRIVATE 仓库外的原始健康资料或 Secret Broker 运行状态。" },
    { layer: "Live provider/runtime（现场数据提供方与运行链）", proves: "只有本轮真实前台刷新和回读才能证明账号、设备、交接与记录质量。", doesNotProve: "历史成功、源码或单测不能替它证明当前可用。" },
    { layer: "Health Owner（健康资料责任源）+ 当前权威医学指导", proves: "某条合格证据是否与当前问题相关、是否值得局部采用，以及高风险建议是否符合当前权威指导。", doesNotProve: "自动 brief 不能替代人工判断、查体、诊断或处方。" }
  ],
  evolution: [
    { date: "2026-08-24", commit: "ace3596–a222a85", result: "HealthLongevity 作为早期项目退出写入责任，现役个人健康问答、证据维护与前台设备刷新由 personal-health 承接；本页只说明这条交接，不读取或公开任何个人健康正文。同期建立最小现行健康底色、一次性有界设备保全与不落 token 文件的 OAuth enrollment（授权登记）。" },
    { date: "2026-08-24—08-25", commit: "0f42703–98f514a", result: "把处理后的底色设为普通回答权威入口，补全原始响应保全、离线窄查、分页闭包、预算与精确中断续跑。" },
    { date: "2026-08-25", commit: "50131b3–377cbe9", result: "加入确定性离线 brief、Fitbit tracker family 来源边界、decision-ready 质量门、inventory-only 分流、前台链解耦和 Health Owner 最终审阅。" },
    { date: "2026-08-30—08-31", commit: "48d5a5b", result: "把前台刷新收到的 complete capture 结果纳入失败关闭，并用合成回归覆盖字段收敛、大分页 checkpoint 与选择上限；Owner review、CURRENT 未更新和无后台工作必须同时一致。" }
  ],
  operationalEntrypoints: [
    { name: "普通个人健康入口", command: "Skill: personal-health", purpose: "从现行健康底色回答；不重复读取 SOURCES、原件、旧项目或 Codex 记忆。" },
    { name: "前台设备刷新", command: "python google_health_refresh.py", purpose: "本人明确发起时调用一次 Secret Broker 并完成离线采集；不会创建后台任务。" },
    { name: "离线清单验真", command: "python google_health_brief.py --verify-for-health-brief <manifest>", purpose: "重验决策字段页面的哈希和分页闭环；不访问网络或凭据。" },
    { name: "离线查某日记录", command: "python google_health_import.py --query-manifest <manifest> --field activity.steps --start-date <YYYY-MM-DD> --through-date <同日>", purpose: "只查精确清单中的一个字段和日期，返回 records、summary、gaps 与 truncated；默认和硬上限均为 100 页、32 MiB、10,000 条，不联网或读取凭据。" },
    { name: "只看离线覆盖摘要", command: "python google_health_import.py --summary-manifest <manifest> --field activity.steps --start-date <YYYY-MM-DD> --through-date <同日>", purpose: "使用相同字段、日期和预算，只返回数量、覆盖日期与缺口，不返回 records 正文，也不计算数值总和、极值或医学结论。" },
    { name: "完整回归", command: "python -m unittest discover -s tests -p 'test_*.py' -v", purpose: "验证五个产品模块的 112 项合成测试；它不代表真实账号或医学 E2E。" },
    { name: "仓库身份", command: "git status --short --branch", purpose: "确认 PRIVATE main、同步和工作树状态；网页不公开本机 source locator。" }
  ]
};

export const personalHealthModules = [
  {
    slug: "current-evidence-route",
    shortTitle: "平时怎么回答",
    title: "平时提问，先用已经整理好的当前信息",
    searchAliases: ["健康问题要不要重读报告", "这个健康问题先看什么资料", "旧报告能不能当现在", "健康来源冲突怎么办", "CURRENT健康底色", "缺证据时保留未知"],
    searchProjection: {
      intents: ["用已有当前信息回答普通个人健康问题", "判断这次是否真的需要重新打开报告", "新旧资料冲突时只复核会改变答案的来源", "证据不足时保留未知而不外推旧结果"],
      entities: ["现行健康底色", "CURRENT.md", "SOURCES.md", "原始报告", "本人陈述", "医生结论", "当前权威指导"],
      relations: ["普通回答先读处理后的当前底色", "新报告纠正冲突或关键缺口才触发最小来源读取", "报告实测医生结论本人陈述和 AI 解释分层", "Health Owner 只局部更新受影响事实"],
      failureRecovery: ["当前底色不可读时明确没有结合个人资料", "旧报告不能证明现在时保留 Unknown", "来源路径失效时只定位这一份原件", "高风险问题先处理现实红旗而不等待资料补全"]
    },
    teaser: "同一份资料只处理一次；只有新报告、事实纠正、来源冲突或会改变答案的缺口，才重新打开最小相关来源。",
    status: "项目规则与 personal-health Skill 已固定这条路线；网页未读取任何底色正文或个人事实",
    statusTone: "pass",
    value: "不用每次健康提问都重新扫描报告、历史项目和材料库，也不会让旧资料因为数量多就抢答当前问题。",
    why: "原始报告、本人陈述、医生结论和模型解释有不同证据强度。若每次都把它们重新混在一起，旧报告可能被当成现在，模型建议也可能被误写成报告结论。",
    example: "我问“现有材料够不够判断这件事？”AI 会先看已经整理好的当前信息；只有出现新报告、事实纠正、来源打架，或确实少了一项会改变答案的证据，才去打开那一份最相关的原件。",
    result: "得到一份低打扰、可追溯的当前回答材料；同一原件处理后不再反复打开，缺少当前证据时明确保留未知。",
    readerStates: {
      pass: "现行底色可读，当前问题所需事实已处理且没有答案关键冲突。",
      problem: "新旧资料冲突或缺少会改变结论的细节，只进入最小来源复核并局部更新。",
      unavailable: "现行入口不可读时，不冒充已经结合本人资料；只能说明未结合个人底色。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "普通健康问题只读一次处理后的现行底色。",
      "报告实测、医生或报告结论、本人陈述、模型解释与未知分开。",
      "旧报告不能回答现在怎样，未测也不等于阴性。",
      "来源维护只打开会改变答案的最小原件和字段。",
      "处理后局部更新，不复制报告正文或另建事件库。"
    ],
    problem: "解决每次提问都翻全量原件、旧证据覆盖当前状态、证据类型互相冒充和健康资料越积越重。",
    implementation: [
      "personal-health Skill 把普通回答、来源维护和注册设备刷新分成独立触发。",
      "CURRENT.md 作为处理后的现行答案底色，普通问题不再打开 SOURCES.md。",
      "只有新报告、纠正、来源冲突、完整性存疑或答案关键源级缺口才进入维护。",
      "Health Owner 只修改 CURRENT.md 中受影响段落和对应来源记录。",
      "原始报告留在健康原件目录，不复制进 Git 或网页。"
    ],
    flow: [
      "明确当前健康问题和是否存在急症红旗。",
      "读取现行底色中的相关段落。",
      "区分已测事实、结论、本人陈述、解释与未知。",
      "判断是否真的缺少会改变答案的源级信息。",
      "必要时只读最小来源并解决冲突。",
      "局部更新受影响事实，后续直接复用处理结果。"
    ],
    concepts: [
      { term: "现行健康底色", explanation: "处理过、可直接用于普通回答的当前事实集合，不是原始资料库。" },
      { term: "来源维护触发", explanation: "新报告、纠正、冲突、审计、完整性问题或答案关键缺口。" },
      { term: "明确未知", explanation: "当前没有足够事实；不会被旧报告、空记录或模型猜测填满。" },
      { term: "最小原件读取", explanation: "只打开会改变当前答案的那份来源、页面和字段。" }
    ],
    boundaries: [
      "网页不读取或公开 CURRENT.md、SOURCES.md 与任何健康原件正文。",
      "普通回答不使用 Codex 记忆、旧健康项目或中央知识库。",
      "高风险问题核验当前权威医学指导，但不自动诊断或处方。",
      "具体健康事实未知时保持未知，不用旧报告补猜。"
    ],
    failures: [
      { condition: "现行底色缺少答案关键事实", response: "只问一个低负担、高价值问题，或进入最小来源复核。" },
      { condition: "新旧来源冲突", response: "分开记录时间、来源和结论，解决后只更新受影响段落。" },
      { condition: "原件路径失效", response: "仅此时使用个人材料定位入口找回并核对，不扫描中央库。" },
      { condition: "旧报告无法证明当前状态", response: "保留 Unknown，不把历史值外推到现在。" }
    ],
    sources: [
      { path: "AGENTS.md", role: "普通回答、来源维护、高风险问题和低打扰原则的项目合同" },
      { path: "E:\\.agents\\skills\\personal-health\\SKILL.md", role: "个人健康问题和维护触发的唯一能力入口" },
      { path: "CURRENT.md", role: "处理后的现行健康底色；公开页只引用角色，不读取内容" },
      { path: "SOURCES.md", role: "来源定位与已处理范围；公开页不复制其路径、哈希或健康事实" }
    ],
    verification: [
      "项目 AGENTS 和 personal-health Skill 同时要求普通回答只读现行底色",
      "Source audit 本轮未读取 CURRENT.md、原始健康报告或 Codex 记忆",
      "网页内容测试阻断任何健康数值、诊断、药物、个体建议和凭据进入 PUBLIC"
    ],
    relation: "它定义整个项目从哪里开始；设备刷新和离线摘要只有产生新的合格证据后，才可能回到这条现行底色路线。"
  },
  {
    slug: "protected-foreground-refresh",
    shortTitle: "主动更新设备",
    title: "只有我明确要求时，才更新一次设备数据",
    searchAliases: ["我想主动更新一次设备数据", "Fitbit一次授权", "健康设备不后台同步", "账号授权失败会不会换账号", "刷新超时会不会留下后台进程", "OAuth不生成token文件"],
    searchProjection: {
      intents: ["本人明确发起一次穿戴设备刷新", "首次完成只读 OAuth 并安全保存长期凭据", "先消费已有离线结果再决定是否访问 provider", "刷新失败时停止而不换账号或后台重试"],
      entities: ["OAuth", "PKCE", "loopback callback", "Secret Broker", "refresh credential", "success handoff", "foreground refresh"],
      relations: ["只有本人明确请求才进入设备刷新", "凭据只通过 stdin 穿过固定 Secret Broker", "已有成功交接时优先离线处理", "固定 provider 调用最多一次且不创建后台任务"],
      failureRecovery: ["rebind_required 时精确停止且不重复调用", "输出过大或回执不闭合时不进入 capture", "超时或中断时终止登记目标进程树", "账号或设备状态未现场验证时保持 Unknown"]
    },
    teaser: "更新在当前任务里完成；凭据留在受保护位置，不写进普通文件，也不建立定时同步或后台监测。",
    status: "OAuth、PKCE、Secret Broker 存储/备份/回读、一次调用与进程终止均有源码和合成测试；当前账号未验证",
    statusTone: "mixed",
    value: "设备数据可以更新，但长期凭据不会散落在命令参数、日志、环境或 token 文件里，也不会悄悄变成后台同步。",
    why: "设备 API 需要长期凭据；如果每次刷新都重新授权、把 token 写盘，或让脚本在后台反复重试，既增加打扰，也扩大凭据与误操作风险。",
    example: "我明确说“现在更新一次 Fitbit Air”。系统先看看上次已经取回但还没整理的结果能不能直接用；确实需要联网时才读取一次凭据并开始这次刷新。账号要重新绑定、请求超时或返回异常，页面就停在这里告诉我，不换账号，也不在后台偷偷重试。",
    result: "得到一个可审计的前台入口：凭据只在唯一受保护边界使用，输出只保留非秘密完成元数据，失败不会换账号或递归重试。",
    readerStates: {
      pass: "受保护调用一次成功，且返回合法的无明文回执，随后进入纯离线 capture。",
      problem: "已有成功交接尚未处理时完全跳过 Secret Broker，先完成本地验真。",
      unavailable: "需要 rebind、回执非法、输出越界或进程超时时，终止进程树，不开始离线摘要。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "首次桌面 OAuth 使用回环 callback 和 PKCE。",
      "只接受完整只读 scope 与可长期使用的 refresh credential。",
      "client secret 和 refresh token 通过 stdin 送入 Secret Broker。",
      "保存事务、恢复副本和 lookup read-back 全部闭合才称已存储。",
      "前台 refresh 最多调用固定 Secret Broker 一次，rebind 不自动重试。"
    ],
    problem: "解决 token 文件散落、凭据出现在 argv/stdout、后台同步扩权、重复授权和 Secret Broker 失败后盲重试。",
    implementation: [
      "google_health_enroll.py 验证 desktop loopback client、provider endpoint、redirect 和只读 scope。",
      "OAuth 使用 state 与 S256 PKCE，回调只监听 127.0.0.1 随机端口。",
      "凭据 bundle 只通过 stdin 交给 Secret Broker，不进入 argv。",
      "Secret Broker receipt 必须证明 local transaction、recovery set、runtime identity 和 plaintext_returned=false。",
      "google_health_refresh.py 以 64 KiB 合并输出上限和项目自有 watchdog 包住唯一 Secret Broker 调用。",
      "超时或中断用 taskkill /T /F 终止整棵登记目标进程树。"
    ],
    flow: [
      "首次明确授权时读取 desktop client JSON。",
      "在本机回环完成 OAuth + PKCE 并交换长期凭据。",
      "通过 stdin 存入受保护凭据中心并完成 backup/lookup 回读。",
      "以后本人明确运行前台 refresh。",
      "若没有待处理成功交接，调用固定 Secret Broker 一次。",
      "合法 pass 回执后进入离线 capture；其他结果精确失败。"
    ],
    concepts: [
      { term: "OAuth（账号授权协议）", explanation: "用户明确允许应用以只读 scope 访问设备数据的标准流程。" },
      { term: "PKCE（授权码防截获校验）", explanation: "用一次性 verifier/challenge 绑定授权码交换，降低授权码被截获后复用的风险。" },
      { term: "Secret Broker（本机受保护凭据中介）", explanation: "唯一允许 importer 使用长期凭据的受保护入口；网页不读取任何明文。" },
      { term: "Foreground refresh（前台刷新）", explanation: "本人明确发起并在当前任务内完成，不由计划任务或 watcher 触发。" }
    ],
    boundaries: [
      "网页不运行 enrollment、Secret Broker、importer 或真实 provider。",
      "任何 OAuth JSON、token、client secret、cookie 或 SecretRef 结果不得公开。",
      "当前测试使用合成 runner 和模拟网络，不能证明当前账号仍连接。",
      "刷新失败不切换浏览器、账号、provider 或备用凭据路线。"
    ],
    failures: [
      { condition: "OAuth scope 不完整或 refresh token 有明确期限", response: "拒绝登记，不把短期访问冒充为长期刷新能力。" },
      { condition: "Secret Broker 返回 rebind_required", response: "精确返回 runtime_rebind_required；本轮停止且不重试。" },
      { condition: "Secret Broker 输出过大、stderr 非空或回执字段不闭合", response: "按稳定无秘密错误码失败，不调用 capture。" },
      { condition: "watchdog 超时或用户中断", response: "终止整棵进程树，关闭 pipe，不留下后台子进程。" }
    ],
    sources: [
      { path: "google_health_enroll.py", role: "桌面 OAuth、PKCE、stdin secret、recovery 和 lookup 回读" },
      { path: "google_health_refresh.py", role: "唯一前台入口、一次 Secret Broker 调用、输出与超时边界" },
      { path: "tests/test_google_health_enroll.py", role: "授权、只读 scope、凭据传输和存储收敛回归" },
      { path: "tests/test_google_health_refresh.py", role: "一次调用、离线优先、rebind、输出、超时和进程树回归" }
    ],
    verification: [
      "10 项 enrollment 测试覆盖 desktop client、PKCE、scope、stdin、backup 与 read-back",
      "12 项 refresh 测试覆盖一次调用、离线优先、rebind、bounded output、timeout 与 interruption",
      "本轮没有触发真实 OAuth、Secret Broker 或 provider，因此当前现场状态保持 Unknown"
    ],
    relation: "它是唯一凭据/网络前台入口；成功后把精确 manifest 交给原始保全和离线判断模块，自己不解释健康。"
  },
  {
    slug: "raw-preservation-resume",
    shortTitle: "中断后继续",
    title: "更新中断不丢数据，也不从头乱来",
    searchAliases: ["健康导入断点续跑", "设备导出中断后要不要重下", "manifest哈希分页", "空健康记录不是零", "原始响应先保全再解析", "导入到一半怎样恢复"],
    searchProjection: {
      intents: ["保存 provider 原始响应后再做解释", "设备导出中断后从精确缺页继续", "确认分页清单哈希和预算是否完整", "区分空响应与真实数值零"],
      entities: ["raw page", "manifest", "SHA-256", "page token", "resume frontier", "run lock", "failure handoff", "orphan page"],
      relations: ["原始页面先原子写入再推进 manifest checkpoint", "完整页面与连续分页链共同定义 resume frontier", "failed running 和 complete 清单不能混用", "空响应只表示未观察到记录而不是零"],
      failureRecovery: ["重复 token 或分页断裂时在下一次请求前停止", "预算耗尽时写精确 resume manifest", "哈希变化或额外 orphan 不匹配时拒绝续跑", "活进程仍持锁时拒绝第二个 writer"]
    },
    teaser: "已经取得的原始内容先安全保留；下次从同一次更新的准确位置继续，对不上就停止，不猜最近目录。",
    status: "原子写、分页闭环、哈希、请求预算、锁、孤儿收敛和 exact resume 有源码与 57 项 import 测试；真实本轮导入未运行",
    statusTone: "mixed",
    value: "网络或解析中途失败时，已取得的原始证据仍可核对；恢复不会重新下载完成页面，也不会误选另一批文件。",
    why: "目录里有文件不等于导入完成。若恢复逻辑按时间猜最近目录、把缺页当零或忽略分页 token 循环，后续统计会把不完整证据冒充为完整趋势。",
    example: "几百页设备记录下载到一半断了。下次继续时，系统先核对已经完成的日期和页面是否仍属于同一次导出；对得上就从下一页接着来，对不上就停下说明冲突，不从头重下，也不把半成品冒充完整数据。",
    result: "得到一份可验证的 raw evidence（原始证据）闭包：每页字节、字段、日期、页码、记录数与 SHA-256 可回读，complete / failed / running 状态不会混用。",
    readerStates: {
      pass: "manifest 为 complete，字段、metadata、TCX、页面数量、分页终点、字节和哈希全部闭合。",
      problem: "运行中断但 exact resume frontier 与现有原始页连续一致，保留证据并从同一清单继续。",
      unavailable: "计划、锁、路径、预算、哈希、分页或孤儿文件不一致时，在任何新网络请求前失败关闭。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "空响应表示未观察到记录，不自动变成数值零。",
      "每个原始页面先写文件，再更新 manifest checkpoint。",
      "完整页面可采用，额外或被篡改的 orphan（孤儿文件）会被拒绝。",
      "失败只通过 bounded handoff 指向 exact resume manifest。",
      "在线入口不接受临时字段子集或任意起始日期，离线查询才允许窄查。"
    ],
    problem: "解决半次导入被当完整数据、断线后全量重下、分页死循环、目录扫描误选运行和原始字节被解析结果覆盖。",
    implementation: [
      "字段 registry 登记 39 类 API 类型；默认 Fitbit Air capture 从中选择 google-wearables 来源家族的 21 类兼容设备字段，另取 profile 以确定历史起点，有可用运动标识时保全 TCX。",
      "日常活动接口：steps、distance、active-minutes、active-zone-minutes、sedentary-period、total-calories；运动与体能接口：exercise、swim-lengths-data、vo2-max、daily-vo2-max、run-vo2-max。",
      "睡眠接口 sleep 映射为 sleep.session；心率接口包括 heart-rate、daily-resting-heart-rate、heart-rate-variability、daily-heart-rate-variability。",
      "其余默认接口为 oxygen-saturation、daily-oxygen-saturation、daily-respiratory-rate、respiratory-rate-sleep-summary、daily-sleep-temperature-derivations，对应血氧、呼吸与睡眠皮温变化。",
      "日期窗口连续且右开；每个 raw page 记录字段、operation、窗口、page、token、bytes、count 与 SHA-256。",
      "_atomic_write 先写同目录临时文件再原子替换。",
      "manifest 持续检查 field/metadata/TCX receipt、分页链和 full-history start。",
      "OS lock 区分活进程与已退出进程；预算在 token refresh 和 manifest mutation 前验证。",
      "failure handoff 固定小文件，只携带稳定错误和 exact resume 路径，不含原始正文。"
    ],
    flow: [
      "闭合 profile 历史起点和固定采集计划。",
      "逐字段、逐连续窗口请求页面。",
      "原样保存响应并写页面 receipt。",
      "更新 bounded manifest checkpoint。",
      "中断时写 failure receipt 和 resume frontier。",
      "续跑前核对锁、计划、预算、哈希和 orphan。",
      "全部字段与资产闭合后写 complete 与 success handoff。"
    ],
    concepts: [
      { term: "Raw evidence（原始证据）", explanation: "provider 返回的原始字节；先保全，解析失败也不会丢失。" },
      { term: "Manifest（运行清单）", explanation: "一次运行唯一的计划、页面、资产、哈希、预算、状态和恢复身份。" },
      { term: "Resume frontier（续跑边界）", explanation: "下一步允许继续的位置，由已完成页面和固定计划共同证明。" },
      { term: "Orphan adoption（孤儿采用）", explanation: "中断后已经写入但还没进入 manifest 的连续页面，在哈希和位置完全匹配时被安全接纳。" }
    ],
    boundaries: [
      "原始健康载荷只留在私有健康原件目录，不进入 Git 或网页。",
      "页面数、字节数、记录数、请求数和 elapsed time 均有边界。",
      "google-wearables 只证明来自 Google/Fitbit 追踪设备家族，不逐条证明唯一设备型号，也不证明当前配对或在线。",
      "connected GPS（手机协同定位）不是 Air 内置 GPS；运动 TCX 可随原件保全，但默认摘要不分析路线。",
      "通用登记表另有 18 类未纳入默认 Air 采集：心率区间时长与热量、楼层、海拔、活动消耗、活动等级、每日心率区间、血糖、体脂、核心体温、身高、体重、心电图、心律不齐通知、食物目录、食物单位目录、饮水日志、饮食日志。接口有定义不代表正在采集，也不代表设备本身一概不支持。"
    ],
    failures: [
      { condition: "重复 page token 或分页链不连续", response: "在下一次 fetch 前失败，保留原始页和 terminal receipt。" },
      { condition: "请求预算耗尽", response: "写有界失败回执与 exact resume manifest，不扩大预算或另建 run。" },
      { condition: "raw 文件哈希变化或额外 orphan 超出 frontier", response: "拒绝续跑，不刷新 token。" },
      { condition: "活进程仍持有 run lock", response: "拒绝并发 writer；进程真实退出后才恢复。" }
    ],
    sources: [
      { path: "google_health_import.py", role: "字段 registry、客户端、原始保全、manifest、验证、query 和 resume 主实现" },
      { path: "tests/test_google_health_import.py", role: "57 项 import、分页、预算、锁、哈希、query、handoff 与 resume 回归" },
      { path: "AGENTS.md", role: "一次前台更新、精确失败交接和不扫描目录的项目边界" },
      { path: "Google 官方 Fitbit Air 介绍", href: "https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/", role: "核实无屏健身手环及 Google Health 手机应用的产品关系；不证明个人当前设备在线" },
      { path: "Google Health API 数据接口", href: "https://developers.google.com/health/endpoints", role: "核实 API 数据类型与 google-wearables 来源家族；实际采集范围仍以本项目白名单为准" }
    ],
    verification: [
      "import 测试覆盖 609-page fixture 的 bounded checkpoint 与完整 manifest",
      "中断、孤儿、篡改、重复 token、请求预算和 live lock 都有 fail-closed 回归",
      "本轮只运行合成测试，未读取任何真实 raw response 或 manifest"
    ],
    relation: "它把一次网络采集变成可验证证据；离线 brief 只能消费这里的 complete 清单，前台刷新也只接受这里的精确 success/failure handoff。"
  },
  {
    slug: "offline-decision-brief",
    shortTitle: "筛选可用信息",
    title: "先检查数据是否完整，再只取与问题有关的部分",
    searchAliases: ["哪些设备数据能用于这次判断", "为什么不读取全部健康字段", "decision_ready健康字段", "inventory_only健康数据", "健康brief离线验真", "14天80%覆盖门", "某天步数有没有保存", "不用重新同步查某日记录", "query-manifest离线窄查"],
    searchProjection: {
      intents: ["从完整导出中只选与当前问题有关的字段", "判断一个字段能否进入当前健康判断", "只看资料清单而不读取高噪声正文", "离线核对覆盖窗口哈希和来源", "按一个字段和日期查已保存记录而不重新同步"],
      entities: ["success handoff", "complete manifest", "verification receipt", "decision_ready_fields", "blocked_fields", "inventory_only", "14/28/90 day windows", "query-manifest", "summary-manifest", "gaps", "truncated"],
      relations: ["先验证完整交接与页面指纹再读取字段", "默认 decision context 只包含四类低噪声字段", "inventory_only 只读取清单而不读取 raw 正文", "字段自身 ready 且与问题相关才交给 Health Owner", "具体日期问题复用精确manifest并按字段日期窄选页面"],
      failureRecovery: ["来源无法证明时默认判断字段全部 provenance_blocked", "页面哈希漂移时在解释前停止", "空缺或 malformed 字段进入 blocked_fields", "页数字节或记录预算超限时不扩大读取", "离线query部分覆盖返回partial与gaps而不推断零", "非法日期字段或预算返回明确失败而不转在线下载"]
    },
    teaser: "设备能提供很多数据，但当前判断只采用来源清楚、质量足够、确实相关的最小部分；其余只记录存在或暂时不用。",
    status: "capture/brief 无网络和凭据路线，字段选择、14/28/90 天窗口、80% 覆盖门与 inventory-only 有 33 项回归；当前个人数据未读取",
    statusTone: "pass",
    value: "保全“可能以后有用的数据”和允许它进入健康判断是两件事；默认摘要只读稳定、低噪声且能影响当前问题的最小范围。若只想知道某一天有没有保存某类记录，还能直接查已保全内容，不必重新同步全部设备数据。",
    why: "设备 API 能读的字段很多。若把高频心率、位置、营养目录、空日志和估算噪声全部常驻，不仅扩大私人数据面，也会让低质量信号压过真正相关证据。",
    example: "我问“上周三的步数有没有保存？不用重新同步。”系统只在已经完成的那份导出里查这一天，告诉我找到几条、覆盖到什么时间；没找到只代表这份记录里没有，不能顺手说成那天一步都没走。",
    result: "用于判断时，得到字段级决策简报：decision_ready_fields、blocked_fields、质量原因、14/28/90 天窗口和 interpretation limits（解释边界）。只查某日时，得到那一字段的原始记录、数量、覆盖日期、重复数量、gaps（缺口）、truncated（是否截断）及本地耗时；只要摘要就不返回记录正文。查询通过只证明这次选中内容可核对，不自动变成健康结论或写入现行底色。",
    readerStates: {
      pass: "决策简报的字段来源、完整性、页面指纹、结构和最近 14 天覆盖门通过后，可交给 Health Owner 复核；某日查询则返回已核对的选中记录和覆盖摘要，不把 query pass 当成 decision_ready。",
      problem: "简报中重复、重叠、结构残缺或覆盖不足的字段不能进入判断。某日查询遇到缺页、哈希不符、日期无法识别或预算截断，会返回 partial 和具体缺口；没查到记录不等于真实数值为零。",
      unavailable: "简报的交接、完整清单、验证回执或选中页面不一致时，在解释前停止。某日查询若清单不可读、字段不在清单内、日期非法或预算不合法，会明确失败；不因此重新下载全量或访问凭据。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "默认 decision context 只有睡眠、步数、活动分钟和已记录运动事件。",
      "最近 14 天至少 80% 日期有可解释记录是数据覆盖门，不是健康目标。",
      "比较窗口为 14、28、90 天，并保留长期 90 天块与时间边界。",
      "inventory_only 只读 manifest inventory，不读取 raw 内容。",
      "具体日期仍未回答时，用精确 manifest、一个 --field 与日期离线窄查；不扫描目录、不重新下载。",
      "--through-date 包含当天，返回的 end_date_exclusive 是次日；睡眠 session 按结束日期归属，跨午夜不会按入睡日误答。",
      "query/summary 的默认和硬上限均为 100 页、32 MiB、10,000 条，可按问题缩小，不能靠调大越过上限；这与 brief 的预算是两套不同限制。"
    ],
    problem: "解决“API 能读就全部进模型”、高频/高隐私字段常驻、空日志被解释、摘要读取全库和技术覆盖率冒充医学标准。",
    implementation: [
      "google_health_capture.py 只读固定 success handoff，验证 exact manifest path、status 与 SHA-256。",
      "create_verification_receipt 重验 profile、manifest、selected page chain 与文件 stat commitment。",
      "google_health_brief.py 只选择 DECISION_CONTEXT_FIELDS，受 256 页、64 MiB、500k 记录预算约束。",
      "数值和事件字段分别处理真实零、重复、歧义、malformed、无记录和来源缺失。",
      "brief 输出 decision_context 与 inventory_only 两个不混用区域。",
      "resource_usage 明确 api_access=false、credential_access=false、full_raw_payloads_scanned=false。",
      "google_health_import.py 的 query_manifest 按字段与日期相交范围选择页面，核对每页 bytes/SHA-256，再按字段专用日期解析记录并去重；清单元数据字节与 raw page 预算分开计数。",
      "--query-manifest 返回 records 及 summary；--summary-manifest 调用同一查询但 include_records=false。summary 包含记录数、无日期资源数、重复数、页数和 days，不计算 numeric_sum/min/max。",
      "查询结果单列 manifest 指纹、pages_considered/page_count、bytes_read、record_count、duplicate_record_count、gaps、truncated 和 timing；api_elapsed_seconds 恒为 0，不代表在线账号或设备当前可用。"
    ],
    flow: [
      "读取有界 success handoff 并解析 exact manifest。",
      "验证 complete 状态与 manifest hash。",
      "生成/加载离线 verification receipt。",
      "只选择四类判断字段页面。",
      "计算字段质量、近期窗口和 blocked reason。",
      "生成 decision context、inventory-only 和 downstream contract。",
      "本地 manifest、verification receipt 与 brief 闭合并持久化后消费交接 pointer；Health Owner 随后审阅最小结果并决定是否局部采用。",
      "另有未回答的具体日期问题时，复用已完成的精确 manifest，以一个字段和日期执行 query 或 summary；交回记录与缺口，不启动新的采集。"
    ],
    concepts: [
      { term: "decision_ready（可用于当前判断）", explanation: "字段证据质量足以支持一个明确问题，不代表身体正常或临床结论。" },
      { term: "inventory_only（仅清单）", explanation: "只知道资料类型存在，不读取正文、不进入判断。" },
      { term: "Coverage gate（覆盖门）", explanation: "检查近期可解释日期占比；80% 是数据完整性要求，不是医学阈值。" },
      { term: "Downstream contract（下游使用合同）", explanation: "只有相关字段自身 ready、来源 ready 且会改变判断时才能被 Health Owner 采用。" }
    ],
    boundaries: [
      "不读取高频心率 raw、GPS/TCX、营养参考和其他 inventory-only 正文。",
      "没有记录不证明没有运动、症状或疾病。",
      "80% coverage 不表示健康，也不是目标分数。",
      "brief 输出不包含 OAuth、token、provider client 或实时网络状态。",
      "普通 query pass 不是 decision_ready，也不自动更新 CURRENT.md；字段质量、来源与现实相关性仍由 Health Owner 判断。"
    ],
    failures: [
      { condition: "混合第一方来源无法证明 tracker family", response: "四类默认字段全部 provenance_blocked，只保留 inventory。" },
      { condition: "selected raw page 哈希或分页链变化", response: "verification stale，brief 在读取健康解释前失败。" },
      { condition: "字段为空、缺失或 malformed", response: "列入 blocked_fields，不把缺失转成零或正常。" },
      { condition: "brief 选择页/字节/记录预算超限", response: "返回 health_brief_budget_exceeded，不扩大读取范围。" },
      { condition: "某日 query 达到页数、字节或记录上限", response: "保留已读结果并返回 partial、truncated=true 与 query_page_budget_exceeded、query_byte_budget_exceeded 或 query_record_budget_exceeded 缺口；缩小字段或日期后再查，不隐去截断。" },
      { condition: "某日 query 页面缺失、哈希漂移或记录日期不明", response: "返回 partial，并分别记录 page_unreadable、manifest_page_hash_mismatch 或 record_date_unavailable；未覆盖日期仍列为 gap，不补猜数值。" },
      { condition: "query 字段不在清单、日期范围非法或预算参数非法", response: "分别返回 query_field_not_in_manifest、invalid_query_date_range 或 query_budget_invalid；不回退到全字段或在线查询。" }
    ],
    sources: [
      { path: "google_health_capture.py", role: "有界 success handoff、离线验证、brief 持久化与 pointer cleanup" },
      { path: "google_health_brief.py", role: "字段解析、窗口、质量门、inventory-only 和 downstream contract" },
      { path: "google_health_import.py · query_manifest / summarize_manifest", role: "精确字段日期查询、独立读取预算、记录/摘要/缺口与零 API 耗时" },
      { path: "tests/test_google_health_capture.py", role: "离线无凭据/网络、错误交接和安全重试回归" },
      { path: "tests/test_google_health_brief.py", role: "29 项来源、哈希、覆盖、字段三态、inventory-only 与 CLI 回归" },
      { path: "tests/test_google_health_import.py · offline query tests", role: "按日期过滤、跨午夜睡眠、重复记录、缺页和预算截断的合成用例" }
    ],
    verification: [
      "4 项 capture 测试证明入口无 OAuth/client/network route，失败保留 success pointer 供离线重试",
      "29 项 brief 测试覆盖 mixed source、真实零、空字段、哈希漂移、分页链、覆盖和 inventory-only",
      "离线查询源码与合成用例覆盖字段日期过滤、跨午夜睡眠按结束日归属、记录去重、无日期缺口和预算 partial；本页修订只读这些代码，不运行私人 manifest",
      "本轮没有读取任何真实健康数值或生成个人趋势图"
    ],
    relation: "它消费原始保全模块的 complete 证据，向证据三态和 Health Owner 模块提供字段级 ready/blocked 结果。"
  },
  {
    slug: "evidence-three-state",
    shortTitle: "证据三态",
    title: "三态判断的是证据，不是身体分数",
    searchAliases: ["健康证据三态", "健康数据可用是否等于正常", "有记录为0和没有记录的区别", "一个坏字段会不会拖垮全部证据", "blocked健康字段"],
    searchProjection: {
      intents: ["区分证据可用与身体正常", "区分真实零无记录缺字段和解析失败", "只阻断有问题的字段而不把全部证据判坏", "知道 decision_ready inventory_only blocked 各能做什么"],
      entities: ["decision_ready", "inventory_only", "blocked", "real zero", "no_records", "partial", "coverage gate", "evidence state"],
      relations: ["decision_ready 只代表可支持当前问题而不代表健康达标", "inventory_only 只证明资料类型存在", "blocked 字段不得进入下游判断", "真实零是有效观察而 no_records 不是零"],
      failureRecovery: ["界面只剩颜色时恢复状态名称原因与限制", "no_records 被写成零时阻断并修正解释", "单字段 partial 时只隔离该字段", "高风险红旗不等待证据状态机给分"]
    },
    teaser: "可用于判断、需要复核、本轮不可用只描述证据状态；不画健康分数、目标环或风险仪表盘。",
    status: "字段级 ready/partial/blocked、真实零与缺记录区分有源码和回归；医学正常性不属于该状态机",
    statusTone: "pass",
    value: "页面不会把技术状态伪装成健康结论，也不会用一个总分或连续天数制造健康焦虑。",
    why: "“数据可用”和“身体正常”完全不同。若界面只用红绿状态，读者容易把 coverage、同步或 schema 状态误解成疾病风险。",
    example: "步数文件确实存在，最近几天却断断续续。页面会显示“需要复核：覆盖不足”，并紧跟一句“这不能证明活动不足或身体异常”；这项数据不会悄悄混进后续结论。",
    result: "得到三个语义稳定的证据状态，每个状态都同时说明能证明什么、不能证明什么和下一步，不产生健康总分。",
    readerStates: {
      pass: "decision_ready：字段证据可用于当前明确问题，但不等于诊断、正常或健康达标。",
      problem: "inventory_only / partial：资料存在但暂不消费，列出覆盖、结构、重复、聚合或来源问题。",
      unavailable: "blocked / unknown：入口、清单、哈希或来源不成立，停止使用并保留未知。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "真实数值零可以是有效观察；没有记录不等于零。",
      "无事件记录不能证明事件或疾病没有发生。",
      "字段级问题不把整个项目变红，只阻断对应证据。",
      "颜色只作辅助，文本状态、原因和限制始终显示。",
      "没有健康评分、连续天数、目标环或风险刻度。"
    ],
    problem: "解决同步绿灯冒充健康、空数据冒充零、一个坏字段拖垮全部证据，以及总分制造焦虑和假精确。",
    implementation: [
      "_field_quality_issues 分开 field_missing、no_records、duplicate_records 和 malformed_or_partial_records。",
      "数值字段通过 daily ambiguity、zero observed days 和 recent coverage 形成字段状态。",
      "事件字段在零事件时加入 zero_recorded_events_require_review，不推断事件缺席。",
      "decision_ready_fields 与 blocked_fields 分开输出，blocked_fields_must_not_be_consumed=true。",
      "evidence-table 和 ThreeStateSummary 在网页中显式展示能证明/不能证明。"
    ],
    flow: [
      "确认字段来源是否存在且可用于判断。",
      "检查清单、页面、结构、重复和聚合歧义。",
      "计算当前窗口覆盖与 observation 状态。",
      "生成 ready 或 blocked reason。",
      "把限制和下一步一起交给 Health Owner。"
    ],
    concepts: [
      { term: "Evidence state（证据状态）", explanation: "一条材料能否安全支持当前问题的技术与语义状态。" },
      { term: "Real zero（真实零）", explanation: "provider 明确记录的零值；它和没有记录、缺字段、解析失败不同。" },
      { term: "Partial（部分可用）", explanation: "资料存在，但一个或多个质量条件不足，禁止直接进入判断。" },
      { term: "Blocked field（被阻断字段）", explanation: "保留字段身份和原因，但 downstream 不能消费其内容。" }
    ],
    boundaries: [
      "证据三态不映射成身体风险、疾病概率或治疗等级。",
      "网页不显示任何个人数值或仿真健康趋势。",
      "技术 PASS 不能替代真实 provider E2E 或 Health Owner 采用。",
      "高风险症状的紧急处理不等待设备状态机给分。"
    ],
    failures: [
      { condition: "UI 只剩颜色没有文字", response: "验收失败；三态名称、原因、限制和下一步必须可读。" },
      { condition: "把 no_records 显示为 0 或正常", response: "阻断字段并修正解释，不生成趋势。" },
      { condition: "把 decision_ready 写成健康达标", response: "降回证据语义，明确只适用于当前问题。" },
      { condition: "单字段 partial 被升级为全局故障", response: "只阻断受影响字段，其他证据独立判断。" }
    ],
    sources: [
      { path: "google_health_brief.py", role: "字段质量、ready/blocked、真实零、窗口与下游使用合同" },
      { path: "tests/test_google_health_brief.py", role: "空字段、真实零、malformed、mixed provenance 与三态回归" },
      { path: "AGENTS.md", role: "未测/未见/阴性区分、未知保留和低健康焦虑边界" }
    ],
    verification: [
      "brief 测试覆盖 zero remains ready、empty blocks context、malformed blocks event 和 missing interval partial",
      "网页三态测试必须检查自定义标签和非诊断说明同时出现",
      "移动端验收检查三卡文本顺序、无横向溢出和颜色之外的可辨识性"
    ],
    relation: "它把离线 brief 的字段结果翻译成不会误导的用户状态；Health Owner 只在这个边界之后决定是否采用。"
  },
  {
    slug: "health-owner-boundary",
    shortTitle: "谁做决定",
    title: "AI整理和核对，人做知情选择；谁都不是自动正确",
    searchAliases: ["健康数据谁决定采用", "医生和AI意见冲突怎么办", "重大医疗选择怎样保护我的决定权", "医疗利益冲突和第二意见", "健康红旗要不要等设备刷新", "设备数据不能自动写CURRENT"],
    searchProjection: {
      intents: ["决定一条设备或报告证据是否值得采用", "医生与 AI 说法冲突时怎样核对而不擅自改药", "重大医疗选择前取得解释替代方案和第二意见", "出现急症红旗时立即转向现实医疗"],
      entities: ["Health Owner", "doctor", "AI 证据核对", "informed choice", "red flag", "second opinion", "conflict of interest", "current authoritative guidance"],
      relations: ["报告和设备提供有限证据而医生提供临床能力", "AI 负责交叉核对来源暴露未知并保护选择空间", "非紧急且本人有决定能力时由本人作最终知情选择", "技术结果不会自动写入 CURRENT 或创建后台监控"],
      failureRecovery: ["依据不清或意见冲突时要求解释并准备独立专科复核", "AI 缺查体诊断能力时明确不能判断", "高风险红旗存在时停止低价值刷新并升级现实医疗", "公开候选含个人健康载荷时只阻断具体值"]
    },
    teaser: "医生提供临床能力，AI帮助核对证据和保护选择空间，报告与设备提供有限观察；任何一方都应允许质疑、解释和复核。",
    status: "Owner review、current_updated=false、无后台工作和个人数据公开边界均已写入项目/代码；真实医疗采用不在本轮证据",
    statusTone: "mixed",
    value: "让专业能力、证据和用户自主同时存在：既不让 AI 冒充医生，也不把医生、机构或设备写成无需说明依据的终局权威。",
    why: "医生有 AI 没有的问诊、查体、诊断和处方能力，但也可能受信息不足、时间、机构流程、资源、经验偏差或利益关系影响；AI同样会遗漏、误读和过度自信。重大决定需要校准信任，而不是更换一个盲从对象。",
    example: "医生建议一项长期、昂贵又很难撤回的治疗，我却没听懂为什么非做不可。AI 不会抢着判医生错，更不会叫我擅自停药；它会把现有依据、没讲清的前提、其他合理选择和复查条件列出来，帮助我向原医生追问，必要时准备独立专科第二意见。",
    result: "得到一条可追责的决定边界：报告和设备提供有限证据；医生提供临床能力并解释依据；AI交叉核对、暴露未知和保护选择空间；非紧急且本人有决定能力时，由本人作最终知情选择。",
    readerStates: {
      pass: "事实、选项、主要收益和风险、替代方案与停止条件已说清，本人理解后可以作选择；医生和 AI 都保留可被质疑和纠正的责任。",
      problem: "意见冲突、依据不清、决定重大或可能存在利益关系时，要求解释并取得适当的独立复核，不靠身份和投票决定。",
      unavailable: "急症不等待完整资料或第二意见；缺少查体、诊断或可靠来源时，AI明确不能判断并把用户带回现实医疗。"
    },
    stateLabels: evidenceStateLabels,
    decisionImpact: [
      "高风险和不可逆决定需要更高证据门、合理替代与明确停止或复查条件。",
      "利益关系要被说明和纳入判断，但不能据此预设恶意或否定专业能力。",
      "第二意见是适当专科对同一原始资料的独立复核，不是再问一次 AI，也不是多数投票。",
      "AI与医生冲突时说明冲突来自哪些事实、适用范围或假设，不擅自改药。",
      "报告实测、医生解释、本人陈述、AI分析与明确未知保持分层。",
      "技术链固定要求人工复核、不会自动更新健康事实或创建后台工作。"
    ],
    problem: "解决设备数据自动写入个人事实、模型建议冒充医生结论、健康项目演变成监控/评分系统，以及公开页泄露个人健康载荷。",
    implementation: [
      "capture result 把 owner review、current update 和 background work 写成机器可验字段。",
      "brief downstream contract 要求字段自身 ready、provenance ready、问题相关和现实影响。",
      "Health Owner 只局部更新 CURRENT.md，并保留来源类型、时间和不确定性。",
      "高风险或治疗判断结合现行个人事实并查询当前权威医疗指导。",
      "项目明确不建设疾病本体、诊断引擎、总分、持续同步、后台监测、数据库、RAG、服务或队列。",
      "网站 Registry 的 impact source 只包括规则、产品代码和测试，不监听 CURRENT/SOURCES/raw health data。"
    ],
    flow: [
      "接收字段级 ready/blocked 结果。",
      "确认当前健康问题和急症红旗。",
      "判断来源、时间、相关性与现实影响。",
      "必要时核验当前权威医学指导。",
      "决定不更新、提出一个最小问题或局部更新底色。",
      "保留收益、风险、替代方案和停止/复查条件。"
    ],
    concepts: [
      { term: "Health Owner（健康资料责任源）", explanation: "决定个人健康事实怎样被处理和局部更新的人工责任边界，不是自动模型。" },
      { term: "Clinical boundary（临床边界）", explanation: "AI和设备不能替代查体、诊断或处方；医生意见也不能替代用户的知情选择。" },
      { term: "Red flag（紧急红旗）", explanation: "可能需要及时现实医疗处理的危险信号；不等待设备采集或评分。" },
      { term: "Second opinion（第二意见）", explanation: "由另一位合适专科医生独立审阅同一原始资料；可以确认、质疑或提出其他选择。" },
      { term: "Low-burden action（低负担行动）", explanation: "在医学上安全时，优先选择能明显改变判断、又可暂停和复查的最小下一步。" }
    ],
    boundaries: [
      "不公开 CURRENT.md、报告、诊断、检查结果、药物、过敏、个人指标或个体建议。",
      "不把设备来源写成唯一具体设备证明，也不声称当前在线。",
      "不使用健康数据截图、模拟指标图、风险评分或装饰性医疗图表。",
      "来源项目 PRIVATE，不提供猜测或不可访问的 GitHub 按钮。"
    ],
    failures: [
      { condition: "自动链尝试写 CURRENT.md", response: "阻断并要求 Health Owner 审阅；capture/current_updated 必须保持 false。" },
      { condition: "设备摘要被解释为诊断或处方", response: "退回证据层，明确它只说明字段能否用于当前问题。" },
      { condition: "高风险红旗存在", response: "停止低价值设备刷新，按当前权威指导升级现实医疗。" },
      { condition: "公开候选含个人健康载荷或凭据", response: "PUBLIC gate 阻断具体值；保留公开安全的产品身份、边界和技术事实。" }
    ],
    sources: [
      { path: "AGENTS.md", role: "Health Owner、高风险指导、低打扰与不建设边界" },
      { path: "google_health_capture.py", role: "health_owner_review_required/current_updated/background_work_created 机器合同" },
      { path: "google_health_brief.py", role: "downstream contract、相关性、blocked fields 与 interpretation limits" },
      { path: "tests/test_google_health_capture.py", role: "离线结果、失败重试和不自动更新回归" },
      { path: "AHRQ · Shared Decision Making", href: "https://www.ahrq.gov/sdm/about/index.html", role: "共同决策把最佳证据、临床经验与患者目标、价值和处境放在同一选择中" },
      { path: "WHO · Ethics and governance of AI for health", href: "https://www.who.int/publications/i/item/9789240037403", role: "健康 AI 应保护人的自主、安全、可解释性与问责，不把医疗决定转交给机器" },
      { path: "GMC · Conflicts of interest", href: "https://www.gmc-uk.org/professional-standards/the-professional-standards/identifying-and-managing-conflicts-of-interest", role: "医疗利益冲突应避免、披露和管理，并说明合理替代、无行动选项及第二意见权利" },
      { path: "AMA · Informed Consent", href: "https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent", role: "知情同意应覆盖诊断、干预目的、所有选项的收益与风险，包括暂不治疗" },
      { path: "NCI · Second opinion", href: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/second-opinion", role: "第二意见由另一位医生审阅资料，可确认、质疑或提供其他治疗选择" }
    ],
    verification: [
      "capture 成功合同明确 owner review required、current_updated=false、background_work_created=false",
      "项目规则机械禁止诊断引擎、评分、持续同步、后台监测、数据库、服务与队列",
      "网页 PUBLIC gate 与内容测试检查个人健康值、报告、用药、诊断、个体建议和凭据均未出现"
    ],
    relation: "它是证据路线的最后责任边界，也决定前台刷新、原始保全、离线摘要和三态结果是否真的进入现行健康底色。"
  }
];

export const project = personalHealthProject;
export const modules = personalHealthModules;
