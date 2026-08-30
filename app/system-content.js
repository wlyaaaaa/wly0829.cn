export const systemOwners = [
  {
    id: "agents",
    title: ".agents",
    summary: "负责 AI 行为、用户授权、能力路由与跨项目协作规则。",
    when: "当问题是“AI 应该听谁的、能不能做、该用哪个能力”时，先看这里。",
    href: "/projects/agents/"
  },
  {
    id: "pcconfig",
    title: "PCConfig",
    summary: "负责这台电脑的路径、端口、运行、启动、备份与恢复事实。",
    when: "当问题是“电脑现在怎样运行、哪里配置、坏了怎样恢复”时，先看这里。",
    href: "/projects/pcconfig/"
  },
  {
    id: "github-index",
    title: "GitHub 总索引",
    summary: "负责仓库身份、公开性、远端、分支、工作树、同步与发布事实。",
    when: "当问题是“这是哪个仓库、能不能改、怎样安全发布”时，先看这里。",
    href: "/projects/github-index/"
  }
];

export const systemRelations = [
  {
    id: "timeaudit-diagnostics",
    source: "PCConfig",
    sourceHref: "/projects/pcconfig/",
    sourceRole: "机器与运行事实",
    project: "TimeAudit",
    projectHref: "/projects/timeaudit/",
    projectRole: "保存可回放的时间、性能与故障证据",
    relation: "历史诊断证据",
    entry: "timeaudit-diagnostics",
    entryHref: "/skills/timeaudit-diagnostics/",
    entryRole: "用自然问题取得一段有边界的历史判断"
  },
  {
    id: "chinese-asr",
    source: "ChineseASR",
    projectHref: "/projects/chinese-asr/",
    sourceHref: "/projects/chinese-asr/",
    sourceRole: "提供中文语音处理与证据边界",
    project: "中文录音任务",
    projectRole: "把录音变成可搜索、可定位、可复核的文字",
    relation: "中文语音处理",
    entry: "chinese-asr",
    entryHref: "/skills/chinese-asr/",
    entryRole: "从一句需求进入转写、时间位置与证据流程"
  },
  {
    id: "project-entry",
    source: "GitHub 总索引",
    sourceHref: "/projects/github-index/",
    sourceRole: "提供仓库、远端、分支与工作树事实",
    project: "全部项目",
    projectHref: "/",
    projectRole: "每个项目继续使用自己的产品与测试规则",
    relation: "项目入场事实",
    entry: "project-entry-gate",
    entryHref: "/skills/project-entry-gate/",
    entryRole: "在修改和发布前给出继续、先处理或停止的判断"
  },
  {
    id: "capability-routing",
    source: ".agents",
    sourceHref: "/projects/agents/",
    sourceRole: "拥有授权、能力路由与协作边界",
    project: "项目与规则",
    projectHref: "/rules/",
    projectRole: "提供当前任务的真实语义和限制",
    relation: "选择与约束",
    entry: "Skills",
    entryHref: "/skills/",
    entryRole: "把自然需求交给当前真实可用的能力入口"
  }
];

export const systemJourneys = [
  {
    ask: "昨晚电脑为什么卡？",
    path: "timeaudit-diagnostics → TimeAudit → 必要时核对 PCConfig",
    explanation: "先取得有时间范围的历史证据，再判断是否需要进入机器配置和运行现场。"
  },
  {
    ask: "这个仓库现在能不能安全修改和发布？",
    path: "project-entry-gate → GitHub 总索引 → 具体项目规则",
    explanation: "先确认仓库与工作树身份，再按项目自己的实现和验收方式继续。"
  },
  {
    ask: "把这段中文录音变成可以复核的文字。",
    path: "chinese-asr → ChineseASR → 必要时补说话人证据",
    explanation: "从一句需求进入正确模式，同时保留原件、时间位置、分歧和失败原因。"
  }
];

export const systemBoundaries = [
  "箭头只表示当前有价值的事实或消费关系，不表示所有项目都依赖同一条运行链。",
  "没有画出的项目仍然可以独立使用；只有跨项目关系会改变理解时才进入这张图。",
  "页面说明产品怎样协作，不证明任何服务此刻在线，也不替代项目自己的当前快照。",
  "关系页只解释产品怎样协作，不解释网站自身怎样施工和维护。"
];

export const systemSearchEntries = [
  ...systemOwners.map((item) => ({
    type: "系统",
    title: item.title,
    detail: item.summary,
    href: item.href,
    aliases: [item.when],
    search: `${item.summary} ${item.when}`
  })),
  ...systemRelations.map((item) => ({
    type: "系统关系",
    title: `${item.source} → ${item.project} → ${item.entry}`,
    detail: `${item.sourceRole}；${item.projectRole}；${item.entryRole}`,
    href: `/system/#relation-${item.id}`,
    aliases: [],
    search: `${item.relation} ${item.sourceRole} ${item.projectRole} ${item.entryRole}`
  })),
  ...systemJourneys.map((item) => ({
    type: "系统用法",
    title: item.ask,
    detail: `${item.path}｜${item.explanation}`,
    href: "/system/#system-journeys",
    aliases: [],
    search: `${item.path} ${item.explanation}`
  }))
];
