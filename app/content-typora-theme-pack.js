import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  observedAt: "2026-09-07T23:42:46Z",
  label: "主题安装文件匹配；三种实际 PDF 导出与 20 项自动测试通过",
  boundary: "本次核对已安装 CSS，并用公开样例通过现有外部转换器生成原版、个人、公司三份 PDF，各一页且源文档摘要不变。已经渲染检查三份 PDF；未重新操作 Typora 编辑器或修改它的许可证。",
  metrics: [
    { label: "编辑主题", value: "1 套 · Verdant Mint" },
    { label: "导出样式", value: "原版 · 个人 · 公司" },
    { label: "失败处理", value: "校验后才替换 PDF" },
    { label: "主题安装", value: "保留旧版与其他主题" }
  ],
  facts: [
    { label: "实际安装", value: "主题菜单只增加 verdant-mint.css，共享结构位于 verdant/base.css。verify 返回两个安装文件的 SHA-256 都与源码匹配；安装不等于当前编辑器已选中该主题。" },
    { label: "三份真实输出", value: "公开样例分别导出原版 20739 字节、个人 33930 字节、公司 21960 字节，各一页。三次源 Markdown SHA-256 均为 be13efed7a9eac0ace3dfb337d71f1319e6adc4286f22f709d2ffe7ba685703c，渲染检查无裁切或重叠。" },
    { label: "外部引擎", value: "本机使用已配置的兼容 Markdown-to-PDF 转换器，实际选择 Edge / Playwright（浏览器自动化打印）后端。主题包只提供 CSS、参数和输出校验，不内置 Typora 或独立 PDF 引擎。" },
    { label: "源码与回归", value: "PUBLIC wlyaaaaa/typora-theme-pack，main：cf6d71051c6707d8cc08bac6693970958f76779e；20/20 测试通过。涵盖无效或空 PDF、无输出、失败保留旧 PDF、输出路径、主题安装与代码块样式。" }
  ],
  gaps: [
    "当前已安装的两个 CSS 文件验证通过，但本次未进入 Typora 原生窗口重新确认编辑、菜单选中和各版本兼容；网页上的 PDF 样张证明实际转换结果，不证明编辑器窗口状态。",
    "导出需要安装 requirements.txt 中的 Python 依赖，并配置兼容外部转换器。主题使用本身不需要 Python；不能把可选预览工具的依赖理解成已经承诺纯标准库导出。",
    "默认主题目录和预览辅助按 Windows 环境设计。其他系统可显式给出 --theme-dir 处理主题文件；本次没有验证跨平台预览或扩建自动路径发现。",
    "源哈希检查能发现转换期间原文变化并拒绝成功，不能阻止任意外部转换器修改原件，也不会自动复原被外部程序改过的原文。"
  ]
});

export const typoraThemePackSnapshot = Object.freeze({
  ...baseSnapshot, generation: "一套编辑主题 · 三种文档交付样式",
  sourceCommit: "cf6d71051c6707d8cc08bac6693970958f76779e",
  sourceRoot: "E:\\Projects\\Tools\\TyporaThemePack",
  runtimeFacts: { pythonTestsPassed: 20, pythonTestsFailed: 0, installedThemeFilesMatched: 2, realPdfExports: 3, realPdfPages: [1, 1, 1], sourceUnchanged: true, nativeTyporaRechecked: false, exportProfiles: ["original", "personal", "company"], localConfigSchema: "typora-theme-pack.local.v1" },
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const typoraThemePackProject = {
  order: 25, slug: "typora-theme-pack", title: "Typora Theme Pack",
  kicker: "自己写得舒服，发给别人也能用合适的版式",
  route: "/projects/typora-theme-pack", visibility: "公开仓库",
  statusTone: "pass", cardStatus: "主题文件已安装；三种实际 PDF 导出通过", cardStatusTone: "pass",
  ...typoraThemePackSnapshot,
  summary: "我平时用 Typora 写 Markdown，想让编辑时的页面舒服，也想让发给别人的 PDF 有合适的版式。这套包提供一套薄荷绿编辑主题，以及原版、个人、公司三种独立导出样式。同一份正文不必为不同读者复制改色，选一个导出模式就能生成相应的 PDF。",
  why: "自己喜欢的绿色不一定适合每份对外文档；直接把编辑器主题当打印样式，表格和代码也可能变样。这里把编辑主题、导出样式和转换引擎分开，让同一正文有不同呈现，同时检查本次导出是否真的产出了可读 PDF。",
  plainExample: "这份方案给同事看，用公司版；我自己反复读，用个人版；只想要中性 Markdown 排版，用原版。正文仍是同一个 .md，分别生成带“-公司”“-个人”“-原版”后缀的 PDF。若转换失败，已有 PDF 会保留，工具告诉我这次没有成功交付。",
  result: "得到一个日常编辑主题和三种可辨认的 PDF 呈现；安装时保留其他主题，旧版同名文件有备份。下方三个样张来自同一份公开文档的实际导出，可以直接比较差别。",
  repositoryNote: "公开仓库包含原创主题、脚本和通用样例，不捆绑 Typora、许可证或专有转换器。现有转换器路径放在 ignored（不进入 Git）的本机配置中；本网页只展示通用文档。",
  readerStates: { pass: "生成本次可读、有页的 PDF，原文摘要未变后才替换目标。", problem: "转换失败、文件无效或源文档在过程里变化时拒绝成功，保留已有输出。", unavailable: "未配置转换器或缺依赖时给出错误；不猜一个系统打印服务继续执行。" },
  productPrinciples: [
    { title: "编辑与交付分开选", detail: "编辑器只保留一套日常主题；对外 PDF 根据读者使用原版、个人或公司样式，避免一套配色包办所有场景。" },
    { title: "公司版不虚构品牌", detail: "采用克制的墨蓝、灰白层次；没有不存在的客户、水印或品牌装饰。" },
    { title: "先生成并检查，再替换旧文件", detail: "PDF 写到目标旁的临时文件，确认转换成功、能解析且有页面，再原子替换；失败不会把旧文件换成半成品。" },
    { title: "只安装自己的主题文件", detail: "只处理两份 Verdant 文件，旧版先备份，不清空整个 themes 目录，也不修改 Typora 授权。" }
  ],
  gallery: [
    { src: "/assets/typora-theme-pack/original-pdf.webp", alt: "同一公开简报的原版 PDF", caption: "原版：中性的石墨文字和细分隔线。2026-09-07 实际 PDF 导出后渲染，1 页。", evidenceLevel: "E2", evidenceLabel: "本次实际 PDF", proves: "已配置转换器用 original 样式生成了该页面。", doesNotProve: "不是 Typora 原生窗口截图，也不证明所有长文的分页。", observedAt: "2026-09-07T23:42:44Z", sourceCommit: "cf6d71051c6707d8cc08bac6693970958f76779e" },
    { src: "/assets/typora-theme-pack/personal-pdf.webp", alt: "同一公开简报的个人版 PDF", caption: "个人版：薄荷色背景、更舒展的字号与间距。与另两张使用同一正文。", evidenceLevel: "E2", evidenceLabel: "本次实际 PDF", proves: "已配置转换器用 personal 样式生成了该页面。", doesNotProve: "不证明用户当前编辑器已经选用该主题。", observedAt: "2026-09-07T23:42:45Z", sourceCommit: "cf6d71051c6707d8cc08bac6693970958f76779e" },
    { src: "/assets/typora-theme-pack/company-pdf.webp", alt: "同一公开简报的公司版 PDF", caption: "公司版：墨蓝标题和灰白分区，保持克制。正文未增加客户、品牌或虚构事实。", evidenceLevel: "E2", evidenceLabel: "本次实际 PDF", proves: "已配置转换器用 company 样式生成了该页面。", doesNotProve: "不等于任意公司模板或打印机的验收。", observedAt: "2026-09-07T23:42:46Z", sourceCommit: "cf6d71051c6707d8cc08bac6693970958f76779e" }
  ],
  dataSources: {
    title: "一份正文、两类样式和一个转换器",
    intro: "这个项目不采集个人活动。用户给出 Markdown，工具读取对应 CSS 并调用已经选好的转换器。",
    rows: [
      { source: "用户明确选中的 Markdown", data: "正文、标题、代码和表格；导出前后计算内容摘要。", result: "交给转换器排版，不为换样式改写源文件。" },
      { source: "themes 与 export-profiles", data: "一套编辑主题的两份 CSS，以及三份导出配置。", result: "决定编辑器和 PDF 各自的颜色、字号、留白与打印规则。" },
      { source: "转换器配置", data: "--converter、MD_PDF_TOOLKIT_CONVERTER 或 .typora-theme-pack.local.json 中的脚本路径。", result: "确定外部排版引擎；配置不存在时明确不可用。" },
      { source: "本次暂存 PDF 与安装目录", data: "PDF 页数/解析结果；两份已安装主题的摘要。", result: "分别核对实际导出和文件安装，不相互冒充。" }
    ]
  },
  operatingFlow: [
    { title: "安装日常编辑主题", detail: "运行 install，把两份 CSS 放入 Typora 主题目录；重开编辑器并手工选择 Verdant Mint。" },
    { title: "选定已有转换器", detail: "通过 configure_converter.py 一次性保存本机兼容脚本，或者本次用 --converter 指定。" },
    { title: "根据读者选择版式", detail: "original / personal / company 分别生成带中文后缀的 PDF；也可通过 --output 指定目标。" },
    { title: "检查后交付", detail: "转换成功、原文摘要未变、暂存 PDF 能解析且有页，才替换最终文件。需要正式交付仍看实际页面和文本。" }
  ],
  usageExamples: [
    { ask: "把我的 Typora 换成日常阅读舒服的薄荷主题。", effect: "安装自己的两份 CSS，重开后选择 Verdant Mint；不更改许可证。", moduleSlug: "verdant-mint-theme-system" },
    { ask: "同一方案，给同事和自己各导出一份。", effect: "选公司版与个人版，正文不变，输出文件分别带中文后缀。", moduleSlug: "multi-scenario-export-profiles" },
    { ask: "导出失败了，别把原来的 PDF 覆盖掉。", effect: "新文件先暂存并解析，通过后才替换旧 PDF。", moduleSlug: "transactional-pdf-export-pipeline" },
    { ask: "更新主题前留下我现在这一版。", effect: "已有同名文件与源码不同则备份到 old-themes，再安装新文件。", moduleSlug: "theme-installation-and-lifecycle" },
    { ask: "改完 CSS 后，把三种效果摆出来看看。", effect: "用公开样例渲染浏览器预览或实际 PDF，标清证据来自哪一层。", moduleSlug: "controlled-preview-and-visual-qa" }
  ],
  components: [
    { name: "themes/verdant-mint.css + verdant/base.css", responsibility: "编辑器主题", implementation: "入口 CSS 配色，共享结构负责标题、正文、代码、表格等。" },
    { name: "export-profiles/{original,personal,company}.css", responsibility: "三种导出呈现", implementation: "按读者分离颜色、字号和打印样式。" },
    { name: "tools/export_pdf.py / configure_converter.py", responsibility: "外部转换与交付", implementation: "解析配置、生成 CSS 临时文件、暂存 PDF、核验源 hash 和页数、同目录原子替换。" },
    { name: "tools/install_theme.py", responsibility: "安装、备份和核对", implementation: "只复制两份主题，差异备份，verify 比对 SHA-256。" },
    { name: "tools/render_previews.py", responsibility: "开发预览", implementation: "Edge/Playwright 渲染概念软件外壳和样文；Pillow 制作联系表。" }
  ],
  technicalContracts: [
    { artifact: "机器转换器配置", schema: "typora-theme-pack.local.v1", owner: "configure_converter.py", boundary: "只含兼容脚本位置，原子写入本机 ignored 配置；按参数、环境、配置顺序解析。" },
    { artifact: "转换器 CLI", schema: "--input / --output / --css-file / --document-style-policy / --require-style", owner: "export_pdf.py 与外部转换器", boundary: "可带 --expected-pages；样式通过临时 CSS 文件传入，默认忽略正文内联样式。" },
    { artifact: "主题核对回执", schema: "typora-theme-pack.install.v1", owner: "install_theme.py", boundary: "分别记录两份文件的源码/已安装摘要、matches 和 verified；不是软件激活状态。" }
  ],
  evidenceLayers: [
    { layer: "源码与 20 项测试", proves: "受控样例下的样式、安装和导出错误处理通过。", doesNotProve: "不证明任意文档、打印机或 Typora 版本。" },
    { layer: "本次安装摘要回读", proves: "机器主题目录中两份 CSS 与源码一致。", doesNotProve: "不证明编辑器当前选中了该主题。" },
    { layer: "本次三份实际 PDF", proves: "现有转换器生成三种版式，源摘要未变，页面渲染完整。", doesNotProve: "不是原生 Typora 窗口，也不证明更长文档无需分页检查。" }
  ],
  responsibilities: ["维护一套日常编辑主题和三种导出样式。", "提供精确安装、旧版备份和源/输出校验。", "外部转换器拥有实际排版，Typora 自身拥有编辑和许可。"],
  exclusions: ["不捆绑、破解或修改 Typora。", "不清理无关主题，不更改正文来适配颜色。", "不把 Windows 可选预览功能说成跨平台承诺。"],
  operationalEntrypoints: [
    { name: "安装主题", command: "python tools/install_theme.py install", purpose: "安装两份 CSS；--theme-dir 可明确指定目录。" },
    { name: "核对安装", command: "python tools/install_theme.py verify", purpose: "比较源码与安装文件摘要。" },
    { name: "配置转换器", command: "python tools/configure_converter.py --converter <converter.py>", purpose: "保存本机已有兼容脚本。" },
    { name: "导出 PDF", command: "python tools/export_pdf.py --input \"<document.md>\" --mode original", purpose: "original 可替换为 personal 或 company，生成对应中文后缀；--output 可指定目标。" },
    { name: "Typora 自定义命令", command: "python \"<PROJECT_ROOT>\\tools\\export_pdf.py\" --input \"${currentPath}\" --mode company", purpose: "在编辑器自定义导出命令里使用；替换 PROJECT_ROOT，保留路径两侧引号。" }
  ],
  evolution: [
    { date: "2026-08", result: "收敛为一套编辑主题与三种语义导出配置，公开主题、工具和通用样例。" },
    { date: "2026-09", result: "导出采用同目录暂存、PDF 解析与原文摘要检查，失败保留旧目标；三种样式完成本次实际 PDF 验收。" }
  ],
  glossary: [{ term: "Profile（样式配置）", meaning: "此处指同一正文的不同排版规则，不是账号。" }, { term: "原子替换", meaning: "先完成同目录临时文件，再一次替换目标；不是跨所有文件的整体事务。" }, { term: "概念预览", meaning: "浏览器生成的模拟软件样张，不能证明 Typora 原生窗口。" }],
  searchAliases: ["Typora Theme Pack", "Typora主题", "Verdant Mint", "薄荷绿", "Markdown转PDF", "公司版文档", "个人版文档"],
  searchProjection: { intents: ["Typora安装薄荷绿主题", "同一Markdown给自己和同事各导出一份", "导出失败保留旧PDF"], entities: ["original", "personal", "company", "export_pdf.py", "install_theme.py"], relations: ["正文不变，编辑主题和交付版式分开"], failureRecovery: ["暂存校验后替换", "旧主题先备份"] }
};

export const typoraThemePackModules = [
  {
    id: "verdant-mint-theme-system", slug: "verdant-mint-theme-system", order: 1,
    title: "一套日常编辑主题", shortTitle: "编辑主题", route: "/projects/typora-theme-pack/verdant-mint-theme-system",
    teaser: "薄荷绿陪伴书写，结构样式集中维护", kicker: "Verdant Mint", status: "两个安装文件摘要一致", statusTone: "pass",
    value: "让 Typora 的正文、标题、表格和代码有一致的阅读层次。",
    why: "长文不仅需要颜色好看，也要区分层级；代码行若继承了外层卡片样式，会出现逐行圆角和背景错位。",
    example: "我在 Typora 里写一份有标题、表格和代码的说明。选择 Verdant Mint 后用同一套样式编辑，代码容器和每行文字保持各自结构。",
    result: "得到一套可选择的主题；导出给不同读者时仍能另选 PDF 样式。",
    problem: "CSS 文件已安装不证明软件正选中它；版本兼容要以原生窗口实际表现为准。",
    readerStates: { pass: "两份 CSS 安装且核对一致。", problem: "编辑器未刷新时重开并选择主题。", unavailable: "没有可用 Typora 时可查看 CSS 和样张，不能声称原生界面验收。" },
    decisionImpact: ["菜单仅有 verdant-mint.css 一个新增入口，共享 base 不单独列入菜单。", "中文字体优先 HarmonyOS Sans SC、Noto Sans SC 和微软雅黑，最终效果受实际字体安装影响。"],
    implementation: ["themes/verdant-mint.css 定义薄荷绿变量并导入 themes/verdant/base.css；基础文件负责正文、标题、引用、表格、列表和打印相关结构。", "CodeMirror（代码编辑器组件）内部 pre / .CodeMirror-line 重置圆角、背景与阴影，避免多行代码继承外层卡片效果。"],
    flow: ["读取入口和共享 CSS", "安装到主题目录", "重开 Typora 并选中主题", "用包含表格与代码的文档检查"],
    concepts: [{ term: "共享结构", explanation: "主题配色和通用排版分文件维护，菜单仍只露一个主题。" }],
    boundaries: ["主题不包含 Typora 程序，不负责许可证或激活。"],
    failures: [{ condition: "字体或原生 DOM 发生变化", response: "在实际环境复核，不用浏览器概念图证明全部兼容。" }],
    sources: [{ path: "themes/verdant-mint.css", role: "主题入口" }, { path: "themes/verdant/base.css", role: "公共结构与代码行重置" }],
    verification: ["本次 verify 核对两文件成功，代码行回归测试通过；未重新操作原生窗口。"],
    relation: "服务于日常编辑，三个导出样式独立选择。",
    searchProjection: { intents: ["Typora选薄荷绿主题", "代码块每行圆角错位"], entities: ["Verdant Mint", "CodeMirror", "verdant/base.css"], relations: ["单一主题入口导入共享CSS"], failureRecovery: ["安装和当前激活分开核对"] }
  },
  {
    id: "multi-scenario-export-profiles", slug: "multi-scenario-export-profiles", order: 2,
    title: "原版、个人和公司版", shortTitle: "导出版式", route: "/projects/typora-theme-pack/multi-scenario-export-profiles",
    teaser: "同一正文，按照读者选择呈现", kicker: "三种导出样式", status: "三份实际 PDF 验收通过", statusTone: "pass",
    value: "为自己阅读和对外交付选择不同排版，不维护三份正文。",
    why: "个人喜欢的大字号与薄荷色，不应该自动变成对外文件的统一风格。原版的含义也不是当前编辑器主题。",
    example: "同一方案先导出公司版供同事评审，再导出个人版留给自己慢慢看；两份文件的内容相同，颜色和留白不同。",
    result: "生成 -原版.pdf、-个人.pdf、-公司.pdf；正文语义没有增加虚构客户或品牌。",
    problem: "正式长文仍需看页数、表格和分页；一页样例不能证明任意文档。",
    readerStates: { pass: "三种样式与实际输出对应。", problem: "文档本身的内联样式需要按 ignore / preserve / reject 策略处理。", unavailable: "没有兼容转换器时样式文件仍在，但不能生成 PDF。" },
    decisionImpact: ["original 是中性 Markdown；personal 是薄荷阅读；company 是克制专业呈现。", "样式从外部 CSS 注入，不为换色改写正文。", "没有真实公司品牌材料时，不添加假品牌或客户字样。"],
    implementation: ["export-profiles 三份 CSS 定义各自色彩、字号、标题与打印规则。original 以石墨色为主，company 使用墨蓝与灰白结构，personal 保留更宽松间距和薄荷语言。", "export_pdf.py 的 MODE_LABELS 将模式映射为中文文件后缀；空白 --output 与 Typora 展开的空字符串均当作未指定输出。"],
    flow: ["选定同一 Markdown", "按读者选择模式", "应用对应 CSS", "检查实际 PDF"],
    concepts: [{ term: "原版", explanation: "中性、忠实正文的 Markdown 呈现，不是复制当前编辑主题。" }],
    boundaries: ["公司版不是任意组织的正式品牌模板。"],
    failures: [{ condition: "输出样式与预期不一致", response: "核对模式和文档 style policy，再看当前实际 PDF。" }],
    sources: [{ path: "export-profiles/original.css", role: "中性样式" }, { path: "export-profiles/personal.css", role: "个人样式" }, { path: "export-profiles/company.css", role: "专业样式" }],
    verification: ["本次同一公开样例三种实际导出均一页，逐张查看了渲染结果。"],
    relation: "共享正文和转换管道，保持独立视觉语义。",
    searchProjection: { intents: ["一份Markdown导出个人和公司版", "原版是不是当前主题"], entities: ["original.css", "personal.css", "company.css", "MODE_LABELS"], relations: ["模式决定排版与中文后缀"], failureRecovery: ["根据内联样式策略排查视觉差异"] }
  },
  {
    id: "transactional-pdf-export-pipeline", slug: "transactional-pdf-export-pipeline", order: 3,
    title: "转换器与 PDF 交付", shortTitle: "PDF 导出", route: "/projects/typora-theme-pack/transactional-pdf-export-pipeline",
    teaser: "新 PDF 检查通过，才替换上一次成果", kicker: "实际输出保护", status: "回归与本机三模式导出通过", statusTone: "pass",
    value: "把模式和正文交给明确选好的外部转换器，检查这次是否真的成功。",
    why: "有些转换器没有生成文件却返回成功；只检查目标是否存在，就可能把上一次 PDF 冒充本次成果。",
    example: "原来已有一份 PDF，这次转换器报错。脚本只清本次暂存文件，旧 PDF 保留，并返回真实错误。",
    result: "获得本次生成且可解析的 PDF，或者具体失败原因；不靠旧文件大小判成功。",
    problem: "源摘要变化时拒绝成功，但这是检测而不是对外部程序的写入隔离。",
    readerStates: { pass: "转换成功、源摘要不变、PDF 至少一页，原子替换。", problem: "失败或无效输出不替换旧 PDF。", unavailable: "配置或依赖缺失、输出目录不在时提前返回错误。" },
    decisionImpact: ["--converter > MD_PDF_TOOLKIT_CONVERTER > 本机 JSON；不猜默认打印器。", "输出必须为 .pdf，不能等于源 Markdown 或转换器。", "暂存文件名短且位于目标同目录，避免跨卷原子移动和长文件名问题。"],
    implementation: ["configure_converter.py 原子保存 typora-theme-pack.local.v1；相对路径按配置目录解析。", "export_pdf.py 生成 profile CSS 临时文件，调用 sys.executable + converter，带 --input、--output、--css-file、--document-style-policy、--require-style 和可选 --expected-pages。", "在外部执行前后核对源 SHA-256；成功后由 pypdf.PdfReader 解析实际 staged PDF，至少一页才 os.replace。finally 尝试清理本次 CSS 与 staged 文件，清理错误不覆盖原失败结果。"],
    flow: ["校验输入输出与配置", "计算源摘要并预约暂存 PDF", "调用外部转换器", "核对源摘要和 PDF 页数", "替换目标并清理本次临时文件"],
    concepts: [{ term: "本次暂存", explanation: "使用新路径，旧目标不能充当新输出证据。" }, { term: "摘要检查", explanation: "发现原文发生变化，不能保证外部程序从未写过它。" }],
    boundaries: ["包不实现底层 PDF 排版；兼容引擎由用户既有配置提供。", "不会自动恢复被其他程序修改的源文档。"],
    failures: [{ condition: "无输出、损坏 PDF、0 页或非零退出", response: "保留旧目标并报告失败。" }, { condition: "源摘要变化", response: "拒绝交付，不把变动文件对应的 PDF 写成已验证。" }],
    sources: [{ path: "tools/export_pdf.py", role: "交付和校验" }, { path: "tools/configure_converter.py", role: "本机配置" }, { path: "tests/test_project.py", role: "失败路径与原件保全" }],
    verification: ["20 项测试覆盖旧 PDF 保留、损坏/0页拒绝和原子替换；实际三模式输出也已生成。"],
    relation: "连接选中的样式和外部引擎，负责这一份输出的交付判断。",
    searchProjection: { intents: ["导出失败不要覆盖旧PDF", "配置Markdown转换器", "空输出参数怎样处理"], entities: ["export_pdf.py", "configure_converter.py", "pypdf", "staged.pdf", "SHA-256"], relations: ["源摘要与新PDF解析通过后替换"], failureRecovery: ["旧文件不能冒充新成果", "清理失败不掩盖原错误"] }
  },
  {
    id: "theme-installation-and-lifecycle", slug: "theme-installation-and-lifecycle", order: 4,
    title: "安装、备份与文件核对", shortTitle: "安装与恢复", route: "/projects/typora-theme-pack/theme-installation-and-lifecycle",
    teaser: "只动自己的两份 CSS，替换前保留旧版", kicker: "主题文件管理", status: "两文件安装摘要通过", statusTone: "pass",
    value: "更新主题时留下原先版本，避免影响自己安装的其他主题。",
    why: "整个 themes 目录可能还有其他主题，直接覆盖或清空很容易误伤；同名 Verdant 文件也可能有手工修改。",
    example: "把主题更新为当前版，但留下旧的 Verdant。脚本比较摘要，有差异就先复制到 old-themes，随后只更新两份专属 CSS。",
    result: "得到安装与核对报告，能找到旧文件备份；恢复旧版需要明确选择备份并恢复，脚本没有独立 restore 命令。",
    problem: "每个文件原子替换，不代表两份文件是一次整体事务；中断后可再次运行安装与 verify 收敛。",
    readerStates: { pass: "两份文件都与源摘要匹配。", problem: "差异文件先备份，再更新；中断后检查两份文件状态。", unavailable: "APPDATA 不存在时指定 --theme-dir，目录不可写时报告错误。" },
    decisionImpact: ["默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。", "不触碰无关主题、程序、注册表或许可。", "verify 只读；安装成功和当前选中主题分别判断。"],
    implementation: ["install_theme.py 对每份 relative path 算源码和安装摘要，不同则 backup_existing 到 old-themes 的对应子目录并使用时间戳后缀。", "atomic_copy 先写同目录临时文件，copy2 后 os.replace；verify 返回 typora-theme-pack.install.v1 和逐文件 matches。"],
    flow: ["定位明确主题目录", "逐文件比对摘要", "差异旧版先备份", "原子替换本项目文件", "verify 核对"],
    concepts: [{ term: "幂等安装", explanation: "重复执行同一版本不会要求用户清空目录。" }],
    boundaries: ["默认目录为 Windows 路线；显式目录不等于完整跨平台产品验收。", "没有自动激活主题或专门回滚命令。"],
    failures: [{ condition: "写入中断或两文件不一致", response: "保留可用旧版/备份，按逐文件结果重跑收敛。" }],
    sources: [{ path: "tools/install_theme.py", role: "精确安装与核对" }],
    verification: ["本次两文件 SHA-256 匹配；隔离安装测试确认无关主题保留。"],
    relation: "负责文件到位，编辑器负责选择并加载主题。",
    searchProjection: { intents: ["更新Typora主题先备份旧版", "核对已安装主题", "保留其他主题"], entities: ["install_theme.py", "old-themes", "verify", "--theme-dir"], relations: ["差异备份后逐文件替换"], failureRecovery: ["中断后重跑核对", "手工恢复选中备份"] }
  },
  {
    id: "controlled-preview-and-visual-qa", slug: "controlled-preview-and-visual-qa", order: 5,
    title: "预览与实际页面检查", shortTitle: "视觉验证", route: "/projects/typora-theme-pack/controlled-preview-and-visual-qa",
    teaser: "看排版，同时说清它是在浏览器还是编辑器里生成的", kicker: "证据分层", status: "实际 PDF 页面已检查", statusTone: "pass",
    value: "修改样式后能直接对比结果，避免只看 CSS 断言就说页面正确。",
    why: "同一份 CSS 在模拟软件外壳、实际 PDF 和 Typora 原生窗口中的表现可能不同；截图必须说明它能证明哪一层。",
    example: "调整标题间距后，把三个导出版本排出来看。页面上标明这是实际 PDF 渲染；软件外壳样张则保留浏览器概念预览标识。",
    result: "获得公开通用样例的 PNG 与联系表，辅助检查代码、表格、对比度和分页。",
    problem: "可选预览器缺依赖不影响已安装 CSS；不能把缺少某个开发环境写成主题本身失效。",
    readerStates: { pass: "当前实际输出能打开并逐页查看。", problem: "发现裁切或排版差异时修对应样式，再验证同一类文档。", unavailable: "没有 Edge 或可用渲染环境时明确缺少该层视觉证据。" },
    decisionImpact: ["概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。", "公开样例不包含真实私人文档。", "一页实际 PDF 验收不推广成所有长文都无须检查。"],
    implementation: ["render_previews.py 将 Markdown 与 profile CSS 组合成 HTML；软件外壳明确标记浏览器概念预览。", "render_html_png_playwright.js 为 Node/Playwright 辅助，脚本也有 Edge 截图路线；Pillow 生成多样式联系表，qa 为可重建中间产物。", "本次三张画廊图从实际生成的 PDF 使用 Poppler 渲染，与程序自带的概念软件图不是同一证据层。"],
    flow: ["选择公开通用样例", "生成或导出当前结果", "渲染完整页面", "查看版式与提取文字", "保存带来源的对比图"],
    concepts: [{ term: "联系表", explanation: "把多张页面缩略图放在一起比较，不是文档正式页面。" }],
    boundaries: ["预览脚本按当前 Windows 字体/浏览器配置工作。", "软件概念图不冒充原生进程截图。"],
    failures: [{ condition: "缺浏览器或辅助依赖", response: "报告这一层无法生成，保留其他独立证据。" }],
    sources: [{ path: "tools/render_previews.py", role: "预览流程" }, { path: "tools/render_html_png_playwright.js", role: "浏览器辅助" }, { path: "samples", role: "公开样例" }, { path: "previews", role: "历史可视化成果" }],
    verification: ["本次三种实际 PDF 各一页，渲染后逐张查看，未见裁切与重叠。"],
    relation: "检验最终排版，不能替代内容、安装和原生应用各自验收。",
    searchProjection: { intents: ["比较三种PDF导出效果", "主题截图是不是实际Typora", "修改CSS后怎么看排版"], entities: ["render_previews.py", "Playwright", "Edge", "Poppler", "Pillow"], relations: ["实际PDF与概念软件图分开标注"], failureRecovery: ["缺视觉环境不假称已验收"] }
  }
];

export const project = typoraThemePackProject;
export const modules = typoraThemePackModules;
