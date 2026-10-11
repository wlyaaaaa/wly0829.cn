---
{
 "title": "AI 规则与技能基座",
 "kind": "project",
 "url": "/projects/agents/",
 "tagline": "让不同 AI 守同一版规矩、用同一套技能。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "usage",
   "label": "怎么用"
  },
  {
   "id": "tech",
   "label": "技术"
  },
  {
   "id": "highlights",
   "label": "亮点"
  },
  {
   "id": "features",
   "label": "全部功能"
  },
  {
   "id": "history",
   "label": "演进"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "agents",
  "kind": "project",
  "title": "AI 规则与技能基座",
  "url": "/projects/agents/",
  "tagline": "让不同 AI 守同一版规矩、用同一套技能。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "照同一版规矩办事",
  "based_on": {
   "commit": "6dd21f643bef0efb33263afe9e9527bf4362879d",
   "commit_time": "2026-09-28T19:28:54+08:00"
  },
  "video_prompt": "开头短视频，6 秒循环，白底水彩风格，从第 1 屏右上的插画出发：中间一本翻开的绿色规则册，书页轻轻翻动一页后停住，书脊上的小金锁微微发亮一次；右下角的淡绿色圆形印章像呼吸一样轻轻一亮一暗。两条绿色丝带从册子两侧缓缓飘出，沿丝带有几张很小的空白卡片像水流一样滑向两边的小窗口（左边窗口带 Claude 橙色星形标志，右边带 OpenAI 花结标志）；卡片一到，窗口边框闪一下绿光，窗口下方的两三个小分身窗口随之依次亮起。背景有几片浅绿色叶子慢慢飘落。结尾画面回到起始构图，便于无缝循环。画面里不出现任何文字。",
  "registry": {
   "groups": [
    {
     "id": "g-release",
     "name": "规则发布与核验"
    },
    {
     "id": "g-hooks",
     "name": "钩子"
    },
    {
     "id": "g-skills",
     "name": "技能"
    },
    {
     "id": "g-memory",
     "name": "决定和经验"
    },
    {
     "id": "g-collab",
     "name": "协作的接线"
    },
    {
     "id": "g-closeout",
     "name": "收尾和备份"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-verify",
     "group": "g-release",
     "name": "开工核验",
     "what": "每个 AI 开工、续作、上下文压缩后跑一次，约 0.6 秒，逐个比对这一版文件的内容指纹",
     "how": "不用管；AI 自己跑。想确认时问“现在生效的是哪一版规则”",
     "status": "在用",
     "screen": "agents-12",
     "source": "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1 -Mode Inspect（Verify-Release 666-718 行）；两份入口模板；使用小记录 2,020 次"
    },
    {
     "id": "f-publish",
     "group": "g-release",
     "name": "标准发布",
     "what": "从已推送的提交打包新的一版，切换“当前”和“上一版”，出错原样恢复",
     "how": "说“把这条规矩改成……并发布”；身份、授权、保护类改动 AI 自动走这条",
     "status": "在用",
     "screen": "agents-12",
     "source": "Invoke-EAgentRulesRelease.ps1 -Mode Activate（907-981 行）；E187 规则发布专题“发布和回退”"
    },
    {
     "id": "f-fast-publish",
     "group": "g-release",
     "name": "快速发布",
     "what": "普通文字改动一条命令跑完挑测试、提交、推送、发布、核对；9 月 25–28 日用过 14 次",
     "how": "同上，AI 判断改动够简单时自动选",
     "status": "在用",
     "screen": "agents-12",
     "source": "E:\\.agents\\tools\\Invoke-EAgentRulesFastRelease.ps1；使用小记录 14 次"
    },
    {
     "id": "f-rollback",
     "group": "g-release",
     "name": "退回上一版",
     "what": "“当前”和“上一版”对调，两份入口一起换回；测试里验过，正式环境没找到用过的记录",
     "how": "说“退回上一版规则”",
     "status": "说不准",
     "screen": "agents-12",
     "source": "Invoke-EAgentRulesRelease.ps1 -Mode Rollback（983-1012 行）；tests\\Test-EAgentRulesRelease.ps1；提交说明里无正式回退记录"
    },
    {
     "id": "f-seal",
     "group": "g-release",
     "name": "防随手改",
     "what": "生效目录、指针和入口归 SYSTEM，其他人只读；只有发布器能临时打开再封回",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "Invoke-EAgentRulesRelease.ps1 420-499 行；决定：约法审定 M5"
    },
    {
     "id": "f-entry",
     "group": "g-release",
     "name": "入口随版本部署",
     "what": "发布时把两份入口写进 Claude 和 Codex 的家目录，回退时一起换回",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "Invoke-EAgentRulesRelease.ps1 976-978、1007-1008 行；本次比对两份入口与 E187 模板一致"
    },
    {
     "id": "f-stub",
     "group": "g-release",
     "name": "仓库根的入口文件",
     "what": "仓库根放一份 CLAUDE.md，防止改了一半的 AGENTS.md 被 Claude 当规则读",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "E:\\.agents\\CLAUDE.md；E187 规则发布专题“读规则”"
    },
    {
     "id": "f-topic-route",
     "group": "g-release",
     "name": "按事找专题",
     "what": "核验结果带一张目录：每份专题管什么、什么情况该读",
     "how": "不用管；AI 按这次要做的事挑专题",
     "status": "在用",
     "screen": "agents-12",
     "source": "releases\\E187\\rules-catalog.json（triggers）；Inspect 输出的 catalog"
    },
    {
     "id": "f-catalog",
     "group": "g-release",
     "name": "规则目录表",
     "what": "32 条规则文件登记在一张表里，测试核对四个仓库的规则文件都登记了",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "config\\control-plane-contract-catalog.json；tests control-plane-contract-coverage"
    },
    {
     "id": "f-laptop",
     "group": "g-release",
     "name": "笔记本同步约法",
     "what": "笔记本上的 Codex 按需巡检时，从主机的生效版本同步约法那一段；主机不反向写",
     "how": "约法变了，AI 在发布汇报里提醒我启动一次笔记本巡检",
     "status": "待验收",
     "screen": "agents-12",
     "source": "E187 规则发布专题“入口模板随版本部署”；电脑配置与恢复页功能 68 笔记本巡检（待验收）"
    },
    {
     "id": "f-claude-hook",
     "group": "g-hooks",
     "name": "Claude 钩子",
     "what": "每条新消息前带进型号档位、私人资料状态和无限制授权；派活和提问前附相关现行决定，压缩前后存放原话；收尾只按真实回执兜底资料守卫和汇报验收，GPT 子任务由执行器自己盯，不再要主持重挂监测；按内容指纹部署",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "tools\\Invoke-ClaudeRootHooks.ps1、claude_root_runtime.py；~/.claude/settings.json；9 月 28 日 08:47 安装"
    },
    {
     "id": "f-codex-hook",
     "group": "g-hooks",
     "name": "Codex 钩子",
     "what": "每条新消息前和每个子代理启动时带进同样三样；装前拍快照，能退回",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "tools\\codex_context_hook.py、codex_context_install.py；E:\\Data\\AppData\\Codex\\hooks.json；9 月 28 日 15:51 安装"
    },
    {
     "id": "f-model-effort",
     "group": "g-hooks",
     "name": "告知型号和档位",
     "what": "让 AI 知道自己是什么型号、什么档位，按成品要求选谁来做",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-12",
     "source": "docs\\operations\\context-hooks.md；决定：三基座终审第二轮 ZS4 整体补充"
    },
    {
     "id": "f-takeover",
     "group": "g-hooks",
     "name": "认出授权请求",
     "what": "我整句说“开个无限制授权”时替我打开验证窗口；9 月 28 日补回 4 种说法",
     "how": "直接说“开个 8 小时的无限制授权”",
     "status": "在用",
     "screen": "agents-12",
     "source": "context-hooks.md“本人接管请求”；tests\\fixtures\\owner_takeover_requests.json；提交 90e20e4；待验收项 codex-hook-reinstall-takeover-phrases 已通过"
    },
    {
     "id": "f-skill-source",
     "group": "g-skills",
     "name": "一份技能源",
     "what": "技能源码只在 skills 和 plugins 两个目录，两边经目录链接共用",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-13",
     "source": "config\\personal-skill-supply.json；E187 Claude 适配“宿主接线·技能”"
    },
    {
     "id": "f-skill-route",
     "group": "g-skills",
     "name": "说事就找对技能",
     "what": "每个技能开头写明什么时候用，AI 按要做的事挑",
     "how": "直接说要做的事，例如“把这份扫描件变成文字”",
     "status": "在用",
     "screen": "agents-13",
     "source": "各 skills\\*\\SKILL.md 的 description；E187 能力与运行第 9 行"
    },
    {
     "id": "f-skill-install",
     "group": "g-skills",
     "name": "装、换、停技能",
     "what": "按清单装一个、更新一个、停一个或整份收拢，先给计划",
     "how": "说“把某某技能装上／停掉”",
     "status": "在用",
     "screen": "agents-13",
     "source": "tools\\Install-PersonalSkillJunctions.ps1；使用小记录 11 次"
    },
    {
     "id": "f-skill-retire",
     "group": "g-skills",
     "name": "退役技能不再冒出",
     "what": "清单留墓碑、拆链接，确认没人用后连源码一起删",
     "how": "说“这个技能不要了”",
     "status": "在用",
     "screen": "agents-13",
     "source": "personal-skill-supply.json retired_skills；docs\\personal-skill-supply-recovery.md；提交 5b0a155"
    },
    {
     "id": "f-skill-check",
     "group": "g-skills",
     "name": "查技能能不能用",
     "what": "只读体检脚本分开回答源码和安装、运行条件；它说明不了技能好不好用，真实用成过没有一律写“未核验”",
     "how": "问“这个技能为什么用不了”",
     "status": "在用",
     "screen": "agents-13",
     "source": "tools\\Test-PersonalSkillSupply.ps1；recovery 文档验证矩阵；使用小记录 8 次；提交 32d9314（9 月 29 日 01:22，使用验证固定写“未核验（本检查不记录实际使用）”）"
    },
    {
     "id": "f-doctor",
     "group": "g-skills",
     "name": "查三个基座哪里坏了",
     "what": "只读体检脚本按需查技能装没装，规则库、电脑配置和 GitHub 项目总索引的登记坏没坏；只查不修，不是每个任务的关卡",
     "how": "说“查查三个基座哪里坏了”",
     "status": "在用",
     "screen": "agents-13",
     "source": "tools\\Invoke-ControlPlaneDoctor.ps1；E207 agents.capabilities-runtime.md 第 50 行、agents.engineering-delivery.md 第 40 行（技能 control-plane-doctor 北京时间 10 月 2 日 01:01 退役，提交 8244785）"
    },
    {
     "id": "f-plugins",
     "group": "g-skills",
     "name": "按需插件目录",
     "what": "8 个官方插件，只在缺能力真影响结果时推荐，不自动装",
     "how": "不用管；AI 缺能力时会提",
     "status": "说不准",
     "screen": "agents-13",
     "source": "config\\on-demand-plugin-catalog.json；使用小记录不记这类推荐"
    },
    {
     "id": "f-decisions",
     "group": "g-memory",
     "name": "决定原话",
     "what": "我的决定原话只存一处，177 节（10 月 4 日统计），别处引用编号；10 月 7 日逐条过了我 315 条消息，282 条原句归位",
     "how": "照常说决定；AI 当场记",
     "status": "在用",
     "screen": "agents-13",
     "source": "docs\\owner-decisions.md；E187 事实来源“共享经验的落点”"
    },
    {
     "id": "f-decision-index",
     "group": "g-memory",
     "name": "现行决定索引",
     "what": "还在生效的决定压成一张不超过 12 KB 的表；派子代理或提问时钩子挑相关的附上",
     "how": "不用管；AI 派活、提问时自动附",
     "status": "在用",
     "screen": "agents-13",
     "source": "E:\\.agents\\docs\\current-decisions.md（10/8 12,119 字节）；tools\\current_decision_context.py"
    },
    {
     "id": "f-compaction-originals",
     "group": "g-memory",
     "name": "压缩不丢原话",
     "what": "压缩前原话原样存盘，压缩后放回最近 15 条并标出未归位条数；约 40 万 token 开始压缩，可切回",
     "how": "不用管；要切回原门槛说“压缩门槛切回原来的”",
     "status": "在用",
     "screen": "agents-13",
     "source": "docs\\operations\\context-hooks.md；tools\\claude_root_runtime.py compaction_owner_context；Invoke-ClaudeRootHooks.ps1 -Mode SetCompaction/RestoreCompaction；10/8 00:4x 自然压缩实测 15 条"
    },
    {
     "id": "f-forward-source",
     "group": "g-memory",
     "name": "转话带出处",
     "what": "转来的话附源对话、原消息、时间、前置问题和原句，缺了标“转述”；收尾列未归位消息",
     "how": "不用管",
     "status": "待验收",
     "screen": "agents-13",
     "source": "context-hooks.md“读取来源”；新会话原生转话未实测"
    },
    {
     "id": "f-daily-corrections",
     "group": "g-memory",
     "name": "每天数纠正次数",
     "what": "每天 00:10 由 GPT-6 Luna 数前一天本人纠正 AI 的次数；资料锁着不数、不当零",
     "how": "自动：\\EAgent Owner Corrections；跟 AI 说停掉本人纠正统计",
     "status": "在用",
     "screen": "agents-13",
     "source": "tools\\daily_owner_corrections.py；E:\\PCConfig\\registries\\task_purpose_catalog.json；10/8 00:10 首跑结果 0"
    },
    {
     "id": "f-dedupe",
     "group": "g-memory",
     "name": "查重复段落",
     "what": "扫三个基座找跨文件重复的段落，收成一处",
     "how": "不用管；每周体检顺手扫",
     "status": "在用",
     "screen": "agents-13",
     "source": "tools\\Find-DuplicateContent.ps1、FindDuplicateContent.cs；使用小记录 33 次"
    },
    {
     "id": "f-shared-lessons",
     "group": "g-memory",
     "name": "经验写进共享文件",
     "what": "两边自动记忆关闭，纠正和教训当轮写进项目文件或专题",
     "how": "纠正 AI 时直说；AI 当轮写进文件并告诉我写在哪",
     "status": "在用",
     "screen": "agents-13",
     "source": "~/.claude/settings.json autoMemoryEnabled=false；E187 Codex 适配；约法 L30"
    },
    {
     "id": "f-weekly",
     "group": "g-memory",
     "name": "每周基座体检",
     "what": "每周一 13:00 Astra 最高档查三个基座、修看得见的错；先过四周稳定期，之后按常驻每周治理继续，评审时可调整",
     "how": "不用管；想停就说“停掉每周基座体检”",
     "status": "待验收",
     "screen": "agents-13",
     "source": "E:\\Data\\AppData\\Codex\\automations\\github\\automation.toml；PCConfig pending_acceptance weekly-governance-first-run；E190 事实来源专题“三基座治理只安排四周稳定期”"
    },
    {
     "id": "f-bloat",
     "group": "g-memory",
     "name": "仓库体量预算",
     "what": "三个基座各有文件数和总大小的参考上限，测试拦住不该进库的报告和临时文件",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-13",
     "source": "config\\repository-bloat-budget.json；tests repository-bloat-governance"
    },
    {
     "id": "f-site-check",
     "group": "g-memory",
     "name": "网站内容周检",
     "what": "核对网站上的说明准不准；暂停中，我按需启动",
     "how": "在 Codex 里手动启动这个自动任务",
     "status": "说不准",
     "screen": "agents-13",
     "source": "E:\\Data\\AppData\\Codex\\automations\\automation\\automation.toml（PAUSED）；PCConfig task_purpose_catalog codex-automation:automation"
    },
    {
     "id": "f-gpt-child",
     "group": "g-collab",
     "name": "Claude 派 GPT",
     "what": "包装脚本派 GPT-6.1 Sol、GPT-6 Luna 和需授权的 GPT-6 Astra，能纠偏、续作（续作可以直接带一句话）。派单必须写预计收益、预计花费、验证方式（查资料、看已有日志还是实测）和实测要花的额度，缺了直接拒派；查状态一单一行，最后一行写预计全部完成时间，要全文加 -Full；每单记 token、磁盘和时长；延长时限会自动告诉子任务；日志被别的程序占着时重试补写，不再中途退出；到预算自动停的开关已装、默认关",
     "how": "在授权过的对话里说“这件派 Astra 做”",
     "status": "在用",
     "screen": "agents-14",
     "source": "tools\\Invoke-ClaudeGptChild.ps1、claude-gpt-child-app-server.mjs；E187 Claude 适配；使用小记录 647 次"
    },
    {
     "id": "f-child-digest",
     "group": "g-collab",
     "name": "看子任务进度摘要",
     "what": "主持按时看 GPT 子任务的中文进度摘要，只读新增、共享读取",
     "how": "不用管；主持派 GPT 时自动看",
     "status": "在用",
     "screen": "agents-14",
     "source": "E224 分工专题；tools\\Get-GptChildDigest.ps1"
    },
    {
     "id": "f-roster",
     "group": "g-collab",
     "name": "可派模型清单",
     "what": "各型号适合什么活、我定过的限制；只作参考，不当门禁",
     "how": "不用管；新型号出来 AI 会更新，动我定过的事先问我",
     "status": "在用",
     "screen": "agents-14",
     "source": "config\\model-roster.json；约法 L23"
    },
    {
     "id": "f-opus-tiers",
     "group": "g-collab",
     "name": "Claude 档位子代理",
     "what": "Claude Opus 5.5 的 low 到 max 五档，派时显式选档；第一句都是先核验规则",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-14",
     "source": "templates\\claude-home\\agents\\opus-*.md；~/.claude/agents 链接"
    },
    {
     "id": "f-codex-child",
     "group": "g-collab",
     "name": "Codex 子代理入口",
     "what": "gpt6_child：不定型号、不给权限，只要求守住父任务的范围",
     "how": "不用管",
     "status": "说不准",
     "screen": "agents-14",
     "source": "templates\\codex-home\\agents\\gpt6-child.toml；未找到单独的使用记录"
    },
    {
     "id": "f-short-lock",
     "group": "g-collab",
     "name": "单点动作短锁",
     "what": "装软件、发布规则、改计划任务前领锁，做完释放；9 月 26–28 日用过 29 次",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-14",
     "source": "tools\\Invoke-ShortLock.ps1；E187 分工专题；使用小记录 29 次"
    },
    {
     "id": "f-recycle",
     "group": "g-closeout",
     "name": "临时文件进回收站",
     "what": "只收本任务产生的东西，不认通配符，放完再查一遍确实进了回收站；9 月 20–28 日用过 794 次。10 月 7 日根治了长路径卡死，后台回收加了 120 秒超时；AI 只放进回收站，永久删除只由我设的定时清理做（见〔电脑配置与恢复〕）",
     "how": "不用管；删错了从回收站还原",
     "status": "在用",
     "screen": "agents-14",
     "source": "tools\\Move-TaskItemToRecycleBin.ps1；约法 L13；使用小记录 794 次；待验收项 recycle-tool-large-bin-speed"
    },
    {
     "id": "f-completion-evidence",
     "group": "g-closeout",
     "name": "没有实物不算完成",
     "what": "验收要真实使用证据；交汇报前钩子核对验收、消息覆盖和缺口，没过就拦下",
     "how": "不用管",
     "status": "在用",
     "screen": "agents-14",
     "source": "Invoke-ClaudeGptChild.ps1:1652；claude_root_runtime.py:1065"
    },
    {
     "id": "f-lifecycle",
     "group": "g-closeout",
     "name": "Codex 旧任务状态定位",
     "what": "读 Codex 本地记录判断旧任务结束没有；现在没有程序调用它",
     "how": "不用管",
     "status": "没用过",
     "screen": "agents-14",
     "source": "tools\\Resolve-CodexArchivedTaskLifecycle.py；git grep 只有测试引用；使用小记录 0 次（9 月 15–28 日）"
    },
    {
     "id": "f-backup",
     "group": "g-closeout",
     "name": "规则和技能的备份",
     "what": "提交推到 GitHub 私有仓库；没推的由每天的加密系统镜像带着",
     "how": "要恢复时跟 AI 说；换机流程见电脑配置与恢复",
     "status": "在用",
     "screen": "agents-14",
     "source": "E:\\PCConfig\\registries\\core_recovery.json 48-51 行；电脑配置与恢复页“找回没推送的代码”"
    },
    {
     "id": "f-retired",
     "group": "g-retired",
     "name": "已停用的几样",
     "what": "旧分工门禁和施工登记（9 月 27 日删）、Codex 经济路由技能、G 盘热备份（8 月初停）、技能安装事务记录、十分钟本人验证邀请",
     "how": "无",
     "status": "已停用",
     "screen": "agents-14",
     "source": "提交 def50d2、5b0a155、337ca15、9b2e5d5、1d5e792；PCConfig 93661b4"
    }
   ],
   "numbers": [
    {
     "id": "n-switches",
     "text": "166 次",
     "meaning": "规则指针从第一次发布（E81）到现在的切换次数，发布和回退都算",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：current-rules.json pointer_revision=166（北京时间 10 月 11 日 13:33 读）",
     "screens": [
      "agents-01"
     ]
    },
    {
     "id": "n-release",
     "text": "E251",
     "meaning": "截至 2026-10-02 生效的规则版本（占位，E208 发布后核对版本号和生效时间）",
     "as_of": "2026-10-10",
     "source": "Invoke-EAgentRulesRelease.ps1 -Mode Inspect：release_id=E251，activated_at_utc=2026-10-09T17:51:17Z（北京时间 10 月 10 日 01:51）",
     "screens": [
      "agents-01",
      "agents-05",
      "agents-15"
     ]
    },
    {
     "id": "n-verify-time",
     "text": "0.6 秒",
     "meaning": "本机跑一次只读核验的耗时",
     "as_of": "2026-10-10",
     "source": "10 月 10 日用 Stopwatch 连跑两次 Inspect：0.64 秒、0.54 秒",
     "screens": [
      "agents-01",
      "agents-02",
      "agents-12"
     ]
    },
    {
     "id": "n-verify-calls",
     "text": "6,407 次",
     "meaning": "使用小记录里命令调用 Invoke-EAgentRulesRelease.ps1 的次数，核验、发布、回退分不开；Codex 9 月 15 日 23:03 起、Claude 9 月 24 日 20:55 起，到 9 月 28 日 10:02",
     "as_of": "2026-10-08",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl 按 name=Invoke-EAgentRulesRelease.ps1 计数（Codex 5,406、Claude 1,001）；Codex 9 月 15 日 23:03 起、Claude 9 月 24 日 20:55 起，到 10 月 8 日 23:58（记录记到 10 月 8 日）",
     "screens": [
      "agents-01"
     ]
    },
    {
     "id": "n-skills",
     "text": "27 个",
     "meaning": "网站上展示的个人技能数",
     "as_of": "2026-10-10",
     "source": "网站技能子页 kind=skill 共 27 个，与本机 personal-skill-supply.json 29 个 install=true 减去不上网站的 2 个一致",
     "screens": [
      "agents-01"
     ]
    },
    {
     "id": "n-rule-files",
     "text": "14 个文件（11 份规则、2 份入口、1 张目录）",
     "meaning": "E257 这一版登记的文件：约法和导航 1 份＋专题 10 份、Codex 和 Claude 入口模板、rules-catalog.json；核验逐个比对",
     "as_of": "2026-10-11",
     "source": "Inspect 的 verified_current.files 共 14 项；Verify-Release 673、696-706 行",
     "screens": [
      "agents-01",
      "agents-02"
     ]
    },
    {
     "id": "n-rule-chars",
     "text": "约 7.2 万字",
     "meaning": "11 个规则文件去掉空白的字符数 72,373",
     "as_of": "2026-10-11",
     "source": "活动 E257 的 11 个规则文件去空白现数；Inspect 绑定提交 79fae9f4947dab9e84b89732a730d62e85eb9d5c",
     "screens": [
      "agents-10"
     ]
    },
    {
     "id": "n-catalog",
     "text": "33 条",
     "meaning": "规则目录表登记的规则文件：本仓库 11、电脑配置与恢复 11、GitHub 项目总索引 6、密码中心 5",
     "as_of": "2026-10-11",
     "source": "config\\control-plane-contract-catalog.json 按 owner 分组",
     "screens": [
      "agents-05",
      "agents-12"
     ]
    },
    {
     "id": "n-files-lines",
     "text": "205 个文件、40,379 行",
     "meaning": "HEAD 6dd21f6 的 Git 已跟踪文件和总行数（releases 不进 Git）",
     "as_of": "2026-09-28",
     "source": "git ls-files 现算（子代理），分类型见 facts.md G3",
     "screens": [
      "agents-05"
     ]
    },
    {
     "id": "n-tests",
     "text": "84 项",
     "meaning": "tests\\test-registry.json 登记的测试（本地 79、跨仓库 5）",
     "as_of": "2026-10-11",
     "source": "E:\\.agents\\tests\\test-registry.json",
     "screens": [
      "agents-05",
      "agents-10"
     ]
    },
    {
     "id": "n-commits",
     "text": "1,217 次提交",
     "meaning": "main 上的提交数，6 月 30 日起",
     "as_of": "2026-09-28",
     "source": "git rev-list --count HEAD；按月：6 月 3、7 月 244、8 月 330、9 月 640",
     "screens": [
      "agents-05",
      "agents-15"
     ]
    },
    {
     "id": "n-fast",
     "text": "14 次",
     "meaning": "快速发布调用次数（9 月 25 日 07:27 – 28 日 08:04）",
     "as_of": "2026-09-28",
     "source": "usage-events.jsonl",
     "screens": [
      "agents-03",
      "agents-12"
     ]
    },
    {
     "id": "n-decisions",
     "text": "506 节，约 44 万字",
     "meaning": "《本人的决定原话》二级小节数和去空白字数",
     "as_of": "2026-10-10",
     "source": "E:\\.agents\\docs\\owner-decisions.md 现数：二级小节 506 个，去空白 441,660 字（提交 13183e2）",
     "screens": [
      "agents-09",
      "agents-13"
     ]
    },
    {
     "id": "n-retired-skills",
     "text": "26 个",
     "meaning": "9 月 27 日一次删掉的退役、停装和未安装技能",
     "as_of": "2026-09-27",
     "source": "提交 5b0a155 说明",
     "screens": [
      "agents-08",
      "agents-15"
     ]
    },
    {
     "id": "n-deleted-lines",
     "text": "15,387 行",
     "meaning": "退役旧分工门禁和施工登记那次提交删掉的行数（同时加了 3,256 行）",
     "as_of": "2026-09-27",
     "source": "git show --shortstat def50d2",
     "screens": [
      "agents-15"
     ]
    },
    {
     "id": "n-installer",
     "text": "1,615 行 → 199 行",
     "meaning": "技能安装器瘦身前后的行数",
     "as_of": "2026-09-26",
     "source": "git show --numstat 9b2e5d5（删 1,556、加 140）；现文件 199 行",
     "screens": [
      "agents-15"
     ]
    },
    {
     "id": "n-short-lock",
     "text": "29 次",
     "meaning": "短锁调用次数（9 月 26 日 16:58 – 28 日 07:09）",
     "as_of": "2026-09-28",
     "source": "usage-events.jsonl",
     "screens": [
      "agents-14"
     ]
    },
    {
     "id": "n-recycle",
     "text": "794 次",
     "meaning": "回收站工具调用次数（9 月 20 日 01:54 – 28 日 10:02）",
     "as_of": "2026-09-28",
     "source": "usage-events.jsonl",
     "screens": [
      "agents-14"
     ]
    },
    {
     "id": "n-plugins",
     "text": "8 个",
     "meaning": "按需插件目录里的官方插件数",
     "as_of": "2026-09-28",
     "source": "config\\on-demand-plugin-catalog.json",
     "screens": [
      "agents-08",
      "agents-13"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-claude-desktop",
     "with": "Claude 桌面版",
     "direction": "交给",
     "flow": "发布时把入口 CLAUDE.md 写进 ~/.claude；装每条新消息前的钩子；技能目录和档位子代理目录用目录链接接过去",
     "source": "E187 Claude 适配“宿主接线”“Hook 和个人资料状态”"
    },
    {
     "id": "r-codex-desktop",
     "with": "Codex 桌面版",
     "direction": "交给",
     "flow": "发布时把入口 AGENTS.md 写进 Codex home；装两个钩子；技能发现目录；gpt6_child 子代理定义；每周基座体检这个自动任务跑在 Codex 里",
     "source": "E187 Codex 适配；automations\\github\\automation.toml"
    },
    {
     "id": "r-gpt",
     "with": "Codex 里的 GPT-6（Astra、Sol、Luna）",
     "direction": "交给",
     "flow": "Claude 经包装脚本把任务文件交给 GPT 子任务，取回 report.md 和最后一条消息验收",
     "source": "tools\\Invoke-ClaudeGptChild.ps1"
    },
    {
     "id": "r-github",
     "with": "GitHub 私有仓库 wlyaaaaa/.agents",
     "direction": "交给",
     "flow": "只有已推送到 main 并读回的提交才能发布；历史版本靠 Git 历史保存",
     "source": "Invoke-EAgentRulesRelease.ps1 919-920 行"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "双向",
     "flow": "电脑配置与恢复提供：无限制授权窗口（Invoke-OwnerTakeover）、共享的个人资料状态、短锁目录、使用小记录、待验收清单、驾驶舱接口；它的核心恢复登记把本仓库当三个核心仓库之一备份，看板读活动规则里的三档维护表",
     "source": "E187 Claude/Codex 适配；core_recovery.json；public_dashboard.py 696-703 行"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "密码中心按真实进程链认出 Claude 和 Codex 桌面（claude-root、codex-root），钩子带进的无限制授权由它核验",
     "source": "E187 Claude 适配“身份”“无限制授权”"
    },
    {
     "id": "r-github-index",
     "with": "github-local-index",
     "direction": "拿来",
     "flow": "基座体检读 GitHub 项目总索引的项目准入事实；规则目录表登记它的 6 份规则文件；每周体检一起查",
     "source": "Invoke-ControlPlaneDoctor.ps1 参数 ProjectAdmissionProviderPath；contract catalog"
    },
    {
     "id": "r-laptop",
     "with": "笔记本上的 Codex",
     "direction": "交给",
     "flow": "约法变化时由笔记本按需巡检从主机活动规则同步约法段，主机不反向写",
     "source": "E187 规则发布专题"
    },
    {
     "id": "r-skills",
     "with": "全部技能页",
     "direction": "交给",
     "flow": "网站上介绍的 26 个技能，源码、安装和只读体检脚本都在这里；各项目的技能入口从这里装到两边",
     "source": "personal-skill-supply.json"
    },
    {
     "id": "r-personal-expression",
     "with": "personal-expression",
     "direction": "拿来",
     "flow": "约法导航第 5 条：向本人说明时，完整的表达教训在 explain-to-me 技能",
     "source": "E187 AGENTS.md“每次都要做的几件事”第 5 条"
    },
    {
     "id": "r-website",
     "with": "个人网站 wly0829.cn",
     "direction": "交给",
     "flow": "给本人看的说明统一由网站生成；驾驶舱读每周体检的回执和本项目的待验收项",
     "source": "E187 事实来源“长任务接续”；pending_acceptance.json website_project"
    }
   ],
   "highlights": [
    {
     "id": "h-seal",
     "title": "随手改不了，偷偷改了也不认",
     "screen": "agents-11"
    },
    {
     "id": "h-stub",
     "title": "改了一半的源码，冒充不了规则",
     "screen": "agents-11"
    },
    {
     "id": "h-subagent-effort",
     "title": "子代理不会冒领父会话的档位",
     "screen": "agents-11"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/",
     "screen": "agents-01",
     "text": "约法"
    },
    {
     "target": "/rules/",
     "screen": "agents-01",
     "text": "专题细则"
    },
    {
     "target": "/skills/",
     "screen": "agents-01",
     "text": "25 个"
    },
    {
     "target": "/rules/charter/",
     "screen": "agents-02",
     "text": "约法"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "agents-02",
     "text": "无限制授权"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "agents-02",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/github-local-index/",
     "screen": "agents-02",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/projects/agents/#agents-08",
     "screen": "agents-04",
     "text": "只读体检脚本"
    },
    {
     "target": "/how/#agents",
     "screen": "agents-07",
     "text": "怎么协作"
    },
    {
     "target": "/skills/",
     "screen": "agents-08",
     "text": "技能"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "agents-09",
     "text": "事实来源与任务上下文"
    },
    {
     "target": "/rules/charter/#L30",
     "screen": "agents-09",
     "text": "约法 L30"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "agents-09",
     "text": "工程与交付"
    },
    {
     "target": "/rules/charter/#L10",
     "screen": "agents-10",
     "text": "约法 L10"
    },
    {
     "target": "/rules/charter/#L30",
     "screen": "agents-10",
     "text": "约法 L30"
    },
    {
     "target": "/how/#agents",
     "screen": "agents-14",
     "text": "怎么协作"
    },
    {
     "target": "/rules/capabilities-runtime/#p-cloud",
     "screen": "agents-15",
     "text": "加了〔云端素材通道〕"
    },
    {
     "target": "/skills/cloud-asset-channel/",
     "screen": "agents-15",
     "text": "配套技能〔省流量的云端素材〕"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "这个项目的自动任务“每周基座体检”（Codex 自动任务 github）上次跑得怎么样：正常／没按时跑／上次失败／暂时读不到；10 月 5 日第一次之前显示“还没到第一次运行”",
     "source": "驾驶舱状态接口里本项目（wlyaaaaa/.agents）那一行的运行栏；修复对话报告 9 月 29 日已把“每周基座体检”在驾驶舱里归到 .agents（原 audit.md 第 1 条），第 2 批接横条时核对一次"
    },
    {
     "slot": "acceptance",
     "meaning": "这个项目待本人或 AI 验收的事：都已验收／待验收 N 项／没通过",
     "source": "驾驶舱接口 pending 块，按 website_project=wlyaaaaa/.agents 过滤（E:\\PCConfig\\registries\\pending_acceptance.json）"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“沿用本人约法”→ f-verify 开工核验（同一件事：开工读当前生效的约法）。",
    "底稿“改规矩并生效”→ 拆成 f-publish 标准发布、f-fast-publish 快速发布两条（两个入口、两种适用范围）。",
    "底稿“退回上一版规则”→ f-rollback。",
    "底稿“找到合适能力”→ f-skill-route 说事就找对技能。",
    "底稿“增减个人技能”→ 拆成 f-skill-install、f-skill-retire（安装器两种用法，退役有墓碑机制值得单列）。",
    "底稿“查技能能否使用”→ f-skill-check。",
    "底稿“查三个基座问题”→ f-doctor。",
    "底稿“按难度分工”→ f-opus-tiers、f-roster、f-codex-child（底稿证据 Invoke-CodexNativeEconomyGate.ps1 已于 9 月 27 日 def50d2 删除；现在的机制是档位子代理＋模型清单，故事归怎么协作）。",
    "底稿“跨助手协作”→ f-gpt-child。",
    "底稿“避免并行抢操作”→ f-short-lock，状态由待验收改为在用：E187 分工专题已写明用法，codex_context_install.py 等在用，使用小记录 29 次。",
    "底稿“规则和技能留副本”→ f-backup（底稿证据 Sync-AgentsHotMirror.ps1 已停用并删除；现在是 GitHub 私有仓库＋每天系统镜像）。",
    "底稿“临时文件进回收站”→ f-recycle。",
    "底稿“查正在由谁处理”（Invoke-ExecutionOwnerRegistry.ps1）→ 并进 f-retired：9 月 27 日 def50d2 随旧分工门禁一起删除，不再是现行功能。",
    "底稿 retired_on_site 两条（独立保护十分钟邀请、技能安装事务与恢复胶囊）→ 并进 f-retired。",
    "底稿 unmapped_entries 的 Resolve-CodexArchivedTaskLifecycle.py → 单列 f-lifecycle（没用过），同时写进审计。"
   ],
   "dropped": [
    "旧网站上的“工作树热镜像”“C 规则”等术语说明不上：对应机制已退役，只在演进里一句带过。",
    "Get-FourBaseDecisionContext.ps1（跨三基座架构评审时取零正文导航视图）和 Get-ControlPlaneContractCatalog.ps1（按触发词查规则目录）没有单列成功能：前者是 AI 做跨基座架构评审时的内部导航，后者的内容已随核验结果一起给出；两者 9 月 15–28 日调用 0 次，写进审计。",
    "codex_host_binding.py 不单列：它是 Codex 钩子运行件的一部分（读宿主会话绑定），并进 f-codex-hook。"
   ],
   "unsure": [
    "“现在”横条按协调者答复只留两格：run 读状态接口里本项目那一行，acceptance 读本项目待验收；当前规则版本作为快照画进第 1 屏，9 月 29 日改成 E190，写“截至 9 月 29 日”。",
    "“网站内容周检”（Codex 自动任务 automation，PAUSED，名“个人系统网页快照更新”）按驾驶舱归属列在本页 f-site-check；它更像网站本身的事，第 2 批“这个网页是怎么做的”若收它，本页这条可删。",
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“我给 AI 定的规矩和个人技能，都放在这个私有仓库里……”；第 3 屏“我只说一句，例如：‘以后临时文件别直接删，放回收站。’”（这是示例，不是本人原话）、“约法由我审定”；第 4 屏“跟 AI 说‘退回上一版规则’”；第 8 屏“我不用记技能名”；第 11 屏“审定约法时我提过：规则不能谁打开文件管理器就能改掉”（本人原话是“规则不能让任何人打开文件管理器就改掉，要有一定保护”，决定：约法审定 M5）；全部功能里各条“怎么用”的说法。",
    "E81 到 E190 共 110 个号，指针只切换 99 次（9 月 29 日），差的 11 次没查清（跳号或失败的发布）。页上只写“切换 99 次”，不写发过多少版。",
    "“退回上一版”标说不准：测试覆盖了回退，但找不到正式环境真回退过的记录（提交说明没有；使用小记录只记脚本名分不出模式；releases 不进 Git）。",
    "笔记本同步约法标待验收，与电脑配置与恢复页功能 68“笔记本巡检（待验收）”一致；笔记本 MCP 说明里约法段标着 E183，主机现在是 E187，两版约法字句是否有差别没查。",
    "第 11 屏亮点 2 说 Claude Code“项目里没有 CLAUDE.md 就把 AGENTS.md 当项目规则读”，依据是 E187 规则发布专题的原话，没有另查 Claude Code 官方文档。",
    "E208 占位（10 月 2 日写）：agents-01 的 118 次、E208、10 月 2 日和 agents-05 的 E208 目录、agents-15 的“10 月 2 日 E208 生效”都按 E208 会在 10 月 2 日发布、指针只加 1 写的；发布后用 Inspect 回读 pointer_revision、release_id、activated_at 核对，不对就改。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/agents/page.json",
  "sha256": "88356d6e331bc49fd500a3662578d62ba0cf8b47cf0e8303d88da64637ede3ba",
  "converted_at_beijing": "2026-10-11T13:39:12+08:00"
 }
}
---

::screen{#agents-01 section="top"}

```typeset
{
 "screen": {
  "id": "agents-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上是毛笔艺术字大标题（第一行 # 那行），下面是介绍段，介绍段下面单独一行绿色链接〔在整套系统里的位置 → 怎么协作〕。右上一幅水彩插画：中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志），右边丝带连到另一个圆角小窗口（窗口左上角画 OpenAI 的黑色花结标志，代表 Codex）；两条丝带上各串着三四张很小的空白卡片（代表技能），窗口下方各有两三个更小的分身小窗口（代表子代理）。中间一排四张数字卡片，和标杆页第一屏的数字卡一样：上面一个小水彩图标（1 一个带循环箭头的版本标签；2 一只秒表；3 一叠小对勾；4 一个文件夹伸出两根链接线），大号绿色粗体数字（每行 ** 包住的部分），下面一两行小字。最下面一条细长的圆角横条：左边写“现在”两个字，接着两个留空的浅色圆角小框（每个约占横条宽度的 33%，高度和横条内边距对齐；网页程序会往里填实时文字，框里不画任何字），最右边一个白底细绿边的圆角按钮〔现在正不正常 → 驾驶舱〕。# 和 - 只是排版记号，不画出来。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版画面：从上到下：大标题；水彩插画（规则册、两条丝带、两个带标志的小窗口，缩成整宽一幅）；介绍段；链接〔在整套系统里的位置 → 怎么协作〕；四张数字卡两两一行共两行；最下面“现在”横条改成竖排：先“现在”两个字，下面两个空框各占一整行（框里不画字），最后是按钮。字完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "约法",
    "href": "/rules/charter/"
   },
   {
    "text": "专题细则",
    "href": "/rules/"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#agents"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#agents"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/agents/#ai-brief"
   },
   {
    "text": "我的AI实践",
    "href": "/how/#practice"
   }
  ],
  "anchors": [
   {
    "id": "practice",
    "where": "我的AI实践入口"
   },
   {
    "id": "agents-16",
    "where": "我的AI实践入口"
   }
  ],
  "live": [
   "run",
   "acceptance"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "asset": "proto:a01-title-h",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-01-h.png",
     "source_box": [
      30,
      45,
      748,
      182
     ],
     "row": "top",
     "width": "47%",
     "text_ref": "AI 规则与技能基座"
    },
    {
     "type": "live_strip",
     "text_ref": "现在",
     "frame_mode": "plain",
     "row": "top"
    },
    {
     "type": "prose",
     "row": "top",
     "text_ref": "我给 AI 定的规矩"
    },
    {
     "type": "illustration",
     "row": "top",
     "width": "53%",
     "asset": "proto:a01-hero-h"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "icons": [
      "proto:a01-ic1",
      "proto:a01-ic2",
      "proto:a01-ic3",
      "proto:a01-ic4"
     ],
     "text_ref": "166次"
    }
   ],
   "notes": "首屏：标题和介绍在左、插画在右；四张数字卡；现在横条。示范规格（主工程师写）"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "asset": "proto:a01-title-v",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-01-v.png",
     "source_box": [
      40,
      100,
      910,
      320
     ],
     "text_ref": "AI 规则与技能基座"
    },
    {
     "type": "live_strip",
     "text_ref": "现在",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns_v": 2,
     "icons": [
      "proto:a01-ic1",
      "proto:a01-ic2",
      "proto:a01-ic3",
      "proto:a01-ic4"
     ],
     "text_ref": "166次"
    },
    {
     "type": "illustration",
     "asset": "proto:a01-hero-v",
     "bleed": true
    },
    {
     "type": "prose",
     "text_ref": "我给 AI 定的规矩"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "版本循环文件",
   "source_phrase": "一个带循环箭头的版本标签",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "秒表",
   "source_phrase": "一只秒表",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一叠小对勾",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件夹链接",
   "source_phrase": "一个文件夹伸出两根链接线",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-agents",
   "source_phrase": "右上一幅水彩插画：中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志），右边丝带连到另一个圆角小窗口（窗口左上角画 OpenAI 的黑色花结标志，代表 Codex）；两条丝带上各串着三四张很小的空白卡片（代表技能），窗口下方各有两三个更小的分身小窗口（代表子代理）。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready",
   "original_elements": [
    "中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "agents/agents-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6712edb69b20e3051b4e",
   "title_text": "AI 规则与技能基座",
   "sha256": "5dfa5c88d34b32f0f7c529b45e3d5e1eb3982be04e94072239478d5041684458",
   "status": "ready",
   "source_box": [
    33,
    32,
    762,
    185
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# AI 规则与技能基座

我给 AI 定的规矩和个人技能，都放在这个私有仓库里：规矩是我逐条审定的 30 条〔约法〕，加 10 份〔专题细则〕；技能有 27 个。它管的是让每个 AI 都用上对的那一版：规矩改了，跑过对应的测试、推到 GitHub 私有仓库，再整套发布成新的一版；Claude、Codex 和它们派出的子代理，开工前先核验手里是不是正在生效的那一版；改坏了能退回上一版。技能也只有一份源码，Claude 和 Codex 共用。

〔在整套系统里的位置 → 怎么协作〕　〔我的AI实践〕　〔复制 AI 续作说明〕

- **166 次**　8 月 30 日起，规则发布和回退一共切换了这么多次；现在生效的是 E253（10 月 10 日 20:55 起）
- **0.6 秒**　AI 开工前核验一次：这一版的 14 个文件（11 份规则、2 份入口、1 张目录）逐个比对内容指纹，改一个字就对不上
- **6,407 次**　9 月 15 日–10 月 8 日 AI 调用这个入口的次数，核验、发布、回退都算在内（Claude 的记录 9 月 24 日才开始）
- **1 份**　技能源码只有一份，Claude 和 Codex 从同一个目录找到这 27 个技能

数字截至 10 月 11 日

现在　〔现在正不正常 → 驾驶舱〕

::screen{#agents-02 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-02",
  "section": "usage",
  "title": "每天：一个 AI 接到活时发生什么",
  "scene": "横版画面：左上标题（## 那行）。中间一条从左到右的水彩绿色丝带，丝带上依次挂五个圆形节点（编号 1–5），每个节点上方一个小水彩图标（1 一扇打开的门；2 放大镜照着一排文件，旁边一个对勾；3 一本翻开的册子；4 一个对话气泡，气泡旁挂三个小标签：芯片、钥匙、沙漏；5 一个工具箱和一个回收站），节点下方是粗体名称和两三行小字。丝带下面左右两张横向小卡片：左“子代理也一样”（小插画：一个大窗口牵着两个小窗口），右“每周一 13:00”（小插画：一本日历，旁边一个听诊器）。卡片里的绿色链接照〔〕画。",
  "portrait": "竖版画面：标题在上；五个节点改成从上往下的竖向丝带，每个节点左边图标、右边文字；最后两张小卡片上下排，各占整宽。字完全一样。",
  "links": [
   {
    "text": "约法",
    "href": "/rules/charter/"
   },
   {
    "text": "无限制授权",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "GitHub 项目总索引",
    "href": "/projects/github-local-index/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "asset": "proto:a02-title-h",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-02-h.png",
     "source_box": [
      330,
      22,
      1320,
      140
     ],
     "text_ref": "每天：一个 AI"
    },
    {
     "type": "flow",
     "columns": 5,
     "connector": "ribbon",
     "illustration": "above_card",
     "icons": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic1.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic2.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic3.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic4.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic5.png"
     ],
     "text_ref": "读入口|核验|读规则|每条新消息|干活和收尾",
     "direction": "horizontal"
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/a02-sub.png",
      "_library/hires-icons-r2/a02-cal.png"
     ],
     "text_ref": "子代理也一样|每周一 13:00"
    }
   ],
   "notes": "原图：标题居中；五站图标在卡外、丝带相连，编号和名称在卡外，卡里只有说明"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "asset": "proto:a02-title-v",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-02-v.png",
     "source_box": [
      25,
      15,
      915,
      165
     ],
     "text_ref": "每天：一个 AI"
    },
    {
     "type": "flow",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic1.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic2.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic3.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic4.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a02-ic5.png"
     ],
     "text_ref": "读入口",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/a02-sub.png",
      "_library/hires-icons-r2/a02-cal.png"
     ],
     "text_ref": "子代理也一样"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇打开的门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着一排文件，旁边一个对勾",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "翻开册子",
   "source_phrase": "一本翻开的册子",
   "sha256": "443a1e26f04d1a582103f4475c613c05b9c1f1c9e854081d0d14073fc8e51894",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/气泡芯片钥匙沙漏.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "气泡芯片钥匙沙漏",
   "source_phrase": "一个对话气泡，气泡旁挂三个小标签：芯片、钥匙、沙漏",
   "sha256": "72fe00098f1a7704b235d322d061f19518204939ed69c03080aec59c6583069a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/工具箱回收站.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱回收站",
   "source_phrase": "一个工具箱和一个回收站",
   "sha256": "268078c44c18687a31aa92b995dfd62806795483e899086802b64af9c05fbd0a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-ai-cli-profile-manager.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "窗口菜单现图小槽4比3",
   "source_phrase": "丝带下面左右两张横向小卡片：左“子代理也一样”（小插画：一个大窗口牵着两个小窗口），右“每周一 13:00”（小插画：一本日历，旁边一个听诊器）。",
   "sha256": "005ecff58d5a9fe61cfb8ef593a20e6374a4e41c601c4c1fe98e8841d0f94dea",
   "status": "ready",
   "original_elements": [
    "一个大窗口牵着两个小窗口"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "听诊核验",
   "source_phrase": "丝带下面左右两张横向小卡片：左“子代理也一样”（小插画：一个大窗口牵着两个小窗口），右“每周一 13:00”（小插画：一本日历，旁边一个听诊器）。",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready",
   "original_elements": [
    "一本日历，旁边一个听诊器"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "agents/agents-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-de31eae8c21a30252259",
   "title_text": "每天：一个 AI 接到活时发生什么",
   "sha256": "62a49ff94bcb84d9f3ccc34672544c2a2f28a2e68d0316d6bab743e69d1dce6c",
   "status": "ready",
   "source_box": [
    327,
    13,
    1319,
    193
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 每天：一个 AI 接到活时发生什么

1. **读入口**　Claude 读 C:\Users\10979\.claude\CLAUDE.md，Codex 读 E:\Data\AppData\Codex\AGENTS.md。两份都要求：先核验，再读规则。规则正文只在发布目录里有一份，不会 Claude 读一套、Codex 读另一套。
2. **核验**　运行核验入口，约 0.6 秒：找到正在生效的那一版，先核对发布记录本身，再把这一版登记的 14 个文件逐个算内容指纹（SHA-256），和发布时记下的比对；全对才给出规则文件的路径。
3. **读规则**　先读〔约法〕；专题按这次要做的事挑着读：要派子代理才读“分工与并行施工”，要发布规则才读“规则发布与恢复”。
4. **每条新消息**　钩子（Claude 和 Codex 在每条新消息前自动运行的小程序）带进三样：这个会话是什么型号、什么思考档位；私人资料现在锁着还是在解锁期内；我有没有开限时的〔无限制授权〕。
5. **干活和收尾**　从共用的技能目录里挑技能；临时文件用完放进回收站；我新定的规矩和原话，当场记进决定记录。

**子代理也一样**　Claude 的档位子代理（按思考档位分好的五种 Claude Opus 5.5 子代理），定义里都要求“先核验，再读规则”；Claude 派出去的 GPT 跑在 Codex 里，走 Codex 的入口。只有只做检索的 Explore、Plan 两种内置子代理不读入口。

**每周一 13:00**　Codex 自动任务“每周基座体检”用 GPT-6 Astra 最高档查一遍三个基座：这个规则库、〔电脑配置与恢复〕、〔GitHub 项目总索引〕。修看得见的错，把漏记的纠正补进共享文件，扫一遍重复段落。10 月 5、12、19、26 日是四周稳定期，第四次的结果交我评审；这不是只做四次，之后按常驻每周治理继续，评审时可以再调整。

::screen{#agents-03 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-03",
  "section": "usage",
  "title": "改规矩：从一句话到所有 AI 换新版",
  "scene": "横版画面：左上标题。左侧约四分之一宽一个大对话气泡，里面是我说的那句话（第二段，带引号）。右侧约四分之三宽是一条六站的流水线（水彩绿色传送带，六个站台从左到右，编号 1–6），每站一个小图标（1 铅笔改一页纸；2 试管和对勾；3 云朵和向上箭头、向下箭头；4 一枚盖章的封套；5 放大镜照着两张标签“当前”“上一版”——标签上只画这两个词；6 三个小窗口同时亮起），站下是粗体名称和一两行小字。流水线下面两张横向卡片：“两条路”（画一条宽路和一条窄的快车道）、“约法由我审定”（画一只手按着一本册子）。注意：第 5 站小插画的两张标签上的字“当前”“上一版”已经在正文里出现，不另加字。",
  "portrait": "竖版画面：标题；对话气泡整宽；六站改成从上往下的竖向流水线，每站左图标右文字；两张卡片上下排。字完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "text_ref": "改规矩"
    },
    {
     "type": "dialogue",
     "text_ref": "我只说一句",
     "avatars": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-boy.png"
     ],
     "avatar_position": "outside-left",
     "avatar_source": "illustrations"
    },
    {
     "type": "flow",
     "columns": 3,
     "connector": "ribbon",
     "illustration": "above_card",
     "name_in_card": true,
     "icons": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic1.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic2.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic3.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic4.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic5.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic6.png"
     ],
     "text_ref": "改源码",
     "direction": "horizontal"
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/a03-road.png",
      "_library/hires-icons-r2/a03-book.png"
     ],
     "text_ref": "两条路"
    }
   ],
   "notes": "原图：标题靠左；左边气泡和小人，右边六站流水线（图标在卡外，编号压在丝带上，名称在卡里）"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "text_ref": "改规矩"
    },
    {
     "type": "dialogue",
     "text_ref": "我只说一句",
     "avatars": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-boy.png"
     ],
     "avatar_position": "outside-left",
     "avatar_source": "illustrations"
    },
    {
     "type": "flow",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic1.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic2.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic3.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic4.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic5.png",
      "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-proto\\assets\\a03-ic6.png"
     ],
     "text_ref": "改源码",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/a03-road.png",
      "_library/hires-icons-r2/a03-book.png"
     ],
     "text_ref": "两条路"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件写作",
   "source_phrase": "铅笔改一页纸",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/试管对勾.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "试管对勾",
   "source_phrase": "试管和对勾",
   "sha256": "156c89769c8476be7c6334e70e2a5a990504566258329d6e9cffbee255246aeb",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-cloud-two-directions.png",
   "fallback": false,
   "semantic_status": "independent_actual_semantic_reject_three_clouds_instead_of_one",
   "key": "云",
   "source_phrase": "3 云朵和向上箭头、向下箭头",
   "sha256": "008a140f3153a727ff401191849fe05dca0b9e36cb8e9697238f36d3342532b6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盖章信封.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盖章信封",
   "source_phrase": "一枚盖章的封套",
   "sha256": "c25af41c74b87e219af8f15222cc6a6e41cde94711fe541ec2851d222fc9d9cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-magnifier-two-version-tags.png",
   "fallback": false,
   "semantic_status": "independently_approved_original_magnifier_two_labels",
   "key": "放大镜",
   "source_phrase": "5 放大镜照着两张标签“当前”“上一版”",
   "sha256": "1f1b80cb691efdf07ed0f1c4ea1c775f62b7436e9c09cd88726062cdbc767a3a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-three-lit-windows.png",
   "fallback": false,
   "semantic_status": "precise_scene_combination_pending_visual_review",
   "key": "代码窗口",
   "source_phrase": "6 三个小窗口同时亮起",
   "sha256": "b4e931de8aeaa7e82e1c8d64b14cf0344bcd745f678b2924c3e55799a773e6c0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-wide-road-narrow-fast-lane.png",
   "fallback": false,
   "semantic_status": "precise_scene_combination_pending_visual_review",
   "key": "scene-r3-wide-road-narrow-fast-lane",
   "source_phrase": "画一条宽路和一条窄的快车道",
   "sha256": "430fc9f471997b063073f2397b35cc02120d8c37d07c93a07128fc238ec2dad4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手持册.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手持册",
   "source_phrase": "一只手按着一本册子",
   "sha256": "22a82f4910cd1ab1229be81eeda7ed5b56b047578bbf06b1704c5fe0b86f2208",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-agents03-large.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-agents03-large",
   "title_text": "改规矩：从一句话到所有 AI 换新版",
   "sha256": "2261afa477fec30df6f6752665e577103ef334925929e3c7c719c5b44d922e94",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 改规矩：从一句话到所有 AI 换新版

我只说一句，例如：“以后临时文件别直接删，放回收站。”

1. **改源码**　AI 改 E:\.agents 里的约法或专题。改好了也还不算数。
2. **挑测试**　按改了哪些文件挑对应的测试：改约法，就跑规则结构、专题和仓库体量三项。
3. **提交推送**　只提交这次改的文件，推到 GitHub 私有仓库，再从远端读回来核对。
4. **发布**　发布器以管理员身份运行（这台电脑提权不弹确认框），把这个提交里的规则打包成新的一版，编号加一。
5. **核对**　再核验一次：“当前”是新版，“上一版”是刚才那版。
6. **生效**　此后任何 AI 核验，读到的都是新版；正在跑的对话，续作或上下文压缩后再核验时换新。

**两条路**　普通文字和已知的局部改动走快速发布，一条命令跑完上面六步，9 月 25–28 日用过 14 次；身份、授权、保护、发布器本身或影响说不清的改动，走标准发布。

**约法由我审定**　9 月 26 日我逐条审定 L1–L30，随 E180 生效；9 月 28 日凌晨我看过 L30 的新写法，才随 E183 发布。

::screen{#agents-04 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-04",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。七张横向圆角卡片排成两列（左四右三），每张左边一个小水彩图标（1 一个向左弯的回退箭头；2 一张被涂改过的纸和一个红叉；3 一块拔掉的硬盘；4 一个听诊器贴着一个小方块；5 一个断开的挂钩；6 两只手同时伸向一个印章；7 一个回收站，里面一张纸往外飘），右边粗体小标题加正文。卡片里的绿色链接照〔〕画。",
  "portrait": "竖版画面：标题；七张卡片一行一张，从上往下排，图标在左、文字在右。字完全一样。",
  "links": [
   {
    "text": "只读体检脚本",
    "href": "/projects/agents/#agents-08"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "新规矩把事办坏了跟AI说“退回上一版规则”。发布器把“当前”和“上一版”对调，两份入口文件一起换回，再核验一遍",
     "columns": 2,
     "portrait_columns": 1,
     "flow": "column",
     "rows": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "新规矩把事办坏了跟AI说“退回上一版规则”。发布器把“当前”和“上一版”对调，两份入口文件一起换回，再核验一遍",
     "columns": 1,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "版本循环文件",
   "source_phrase": "一个向左弯的回退箭头",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "禁止文件",
   "source_phrase": "一张被涂改过的纸和一个红叉",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "外接硬盘",
   "source_phrase": "一块拔掉的硬盘",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "听诊器检查",
   "source_phrase": "一个听诊器贴着一个小方块",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断链.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断链",
   "source_phrase": "一个断开的挂钩",
   "sha256": "8f475338e1eae8c1614422882edcc0696419be567cbbba434c0617d4161dd3ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e61776b170ebde860247.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双手印章",
   "source_phrase": "两只手同时伸向一个印章",
   "sha256": "680e38244e429455c28a36aeccf81f416afcb6a78c599cd8e75642bca596c4c1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "回收站文件",
   "source_phrase": "一个回收站，里面一张纸往外飘",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-04-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "source_box": [
    95,
    82,
    861,
    371
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 出事怎么办

- **新规矩把事办坏了**　跟 AI 说“退回上一版规则”。发布器把“当前”和“上一版”对调，两份入口文件一起换回，再核验一遍。只留当前和上一版两份；要更早的，就在 Git 里把改动撤回，再发布成新的一版。测试里验过，正式环境没找到用过的记录。
- **规则文件被改过**　核验时哪个文件的内容指纹对不上，就不给路径。AI 这时按“没能核验规则”办：说清这次没核验上，照我的原话、已确认的更正和已有授权继续普通工作；没有可核实的解锁依据时不取私人资料，已知冻结的项目不主动维护。
- **电脑上没有 E 盘或 PowerShell 7**　同上：只有依赖某条规则的决定停下来说明，别的活照做；不然一个文件出问题，所有 AI 都得停工。
- **技能不灵**　问 AI“这个技能为什么用不了”。它按需跑〔只读体检脚本〕，查装没装、登记坏没坏，见“技能”那一屏；这查不出技能好不好用，要拿一件真事试一次。
- **钩子没装上或坏了**　这条消息的私人资料状态当“不明”：不取私人资料，普通工作照常。
- **两个任务同时要发布**　不会互相覆盖：后来的那个得先把对方的改动并进来（见“发布器”那一屏）。
- **临时文件删错了**　AI 只把这次任务自己产生的东西放进回收站，从回收站还原就行；要趁早：从 E:\Cache 这类 AI 缓存目录删进去的，满 6 小时会被定时清理永久删掉（那块盘快满时只留 1 小时），别的留 7 天，见〔电脑配置与恢复〕。

::screen{#agents-05 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-05",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。上半部分“规则这一路”：一张从左到右的流程图，五个圆角卡片节点（小水彩图标：1 一叠带书签的文稿；2 一台带齿轮的印刷机；3 一个带锁的文件盒，盒上挂两个小牌子“当前”“上一版”——牌子上的字就是正文里的这两个词；4 两扇小门，一扇门上画 Claude 橙色星形标志，一扇画 OpenAI 花结标志；5 三个大窗口牵着几个小窗口，旁边一台小笔记本），绿色箭头依次连起来，节点下是粗体名称和小字。下半部分左边“技能和钩子”一张卡片（小插画：一个文件夹伸出多根链接线；一个挂钩），右边“体量”一张卡片（小插画：一摞代码纸和一个小柱子）。",
  "portrait": "竖版画面：标题；五个节点改成从上往下的竖向流程，箭头朝下；“技能和钩子”“体量”两张卡片上下排，各占整宽。字完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "section_heading",
     "text_ref": "规则这一路"
    },
    {
     "type": "flow",
     "text_ref": "1源码",
     "columns": 2,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "icons": "auto",
     "item_rows": [
      1,
      2,
      2
     ]
    },
    {
     "type": "points_card",
     "text_ref": "技能和钩子",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "footer",
     "width": "64%"
    },
    {
     "type": "content_card",
     "text_ref": "体量",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "footer",
     "width": "36%"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "section_heading",
     "text_ref": "规则这一路"
    },
    {
     "type": "flow",
     "text_ref": "1源码",
     "columns": 5,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "points_card",
     "text_ref": "技能和钩子",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "体量",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一叠带书签的文稿",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "齿轮",
   "source_phrase": "一台带齿轮的印刷机",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "木匣锁",
   "source_phrase": "一个带锁的文件盒",
   "sha256": "7d2d9db7dc508562b6bc40ca9a8ddb33765e7a694539a6e19dcd6cd2839ac50e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "两扇小门，一扇Claude标志一扇OpenAI标志",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "三个大窗口牵着几个小窗口，旁边笔记本",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件夹链接",
   "source_phrase": "一个文件夹伸出多根链接线；一个挂钩",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一摞代码纸和一个小柱子",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "source_box": [
    508,
    1,
    1147,
    201
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 它是怎么搭的

**规则这一路**

1. **源码**　E:\.agents：AGENTS.md（约法和导航）、10 份专题、一张规则目录表。表里登记 33 条：这里 11 条，发布时只打包这 11 份；电脑配置与恢复 11 条、GitHub 项目总索引 6 条、密码中心 5 条不跟着发布，登记在表里是为了让测试查出哪个仓库有没登记的规则文件
2. **发布器**　Invoke-EAgentRulesRelease.ps1，三种用法：发布、回退、核验
3. **生效的一版**　E:\.agents\releases\ 下按版本号命名的目录，哪一版生效就读哪个目录：这一版的规则、两份入口模板、发布记录 release.json（提交号、每个文件的大小和内容指纹、远端有没有这个提交）；哪一版在生效只看 current-rules.json，它指着“当前”和“上一版”
4. **入口**　两份入口文件随版本写进 Claude 和 Codex 的家目录
5. **各个 AI**　Claude、Codex 和它们派出的子代理；笔记本上的 Codex 按需从主机同步约法那一段

**技能和钩子**
- 技能：E:\.agents\skills、E:\.agents\plugins → 清单 personal-skill-supply.json → 目录链接 C:\Users\10979\.agents\skills；Claude 的 skills 目录本身也链到这里
- 钩子：Claude 挂六处（每条新消息前、每轮回复结束前、派子代理/提问/传话和操作 Chrome 前、每次调用工具后、上下文压缩前、压缩或续作后）；Codex 挂六处（每条新消息前、每轮回复结束前、派子代理和提问前、压缩前、压缩或续作后、每个子代理启动时）

**体量**　截至 10 月 4 日：237 个文件、47,364 行（PowerShell、Python、Node.js、C#、Markdown、JSON）· 61 项登记测试 · 1,398 次提交（6 月 30 日起）

::screen{#agents-06 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-06",
  "section": "tech",
  "title": "发布器：不出半截、不互相覆盖",
  "scene": "横版画面：左上标题。左边约三分之二宽，七张横向小卡片排成一列半（左列四张、右列三张），每张一个小水彩图标（1 云朵上一个对勾；2 一个只照亮几张纸的手电；3 两条丝带汇成一条；4 一把钥匙对准锁孔；5 脚手架旁一栋搭好的小房子；6 一个倒转的沙漏；7 一串只往上的台阶），粗体一句加一行小字。右边约三分之一宽一张竖长卡片“为什么要这么多道”，上面一幅小插画：一个印章盖下去，后面跟着一排小窗口都亮起。",
  "portrait": "竖版画面：标题；七张卡片一行一张；“为什么要这么多道”卡片放最后，整宽。字完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "发布器：不出半截、不互相覆盖",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1只从推上去的提交发布",
     "columns": 3,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto",
     "width": "100%",
     "row": "steps",
     "fill_last_row": true
    },
    {
     "type": "content_card",
     "text_ref": "为什么要这么多道",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "width": "100%",
     "row": "why"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "发布器：不出半截、不互相覆盖",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1只从推上去的提交发布",
     "columns": 1,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "为什么要这么多道",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f9fad72a795ea7d99a23.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云对勾",
   "source_phrase": "云朵上一个对勾",
   "sha256": "8761a30b9f1f9c10d9ccbb9bccec27fb917f919b95649d81208f72b96ddab513",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个只照亮几张纸的手电",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "共享节点",
   "source_phrase": "两条丝带汇成一条",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ee82f5d373ca916b8dad.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁门钥匙",
   "source_phrase": "一把钥匙对准锁孔",
   "sha256": "b57ea8a1f2c4ebd2aca55472a96f982be8baef2d32704628b79ce3c6765c310d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-2e045092b7ccad802142.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "房屋脚手架",
   "source_phrase": "脚手架旁一栋搭好的小房子",
   "sha256": "d197216591a6c2244b572a8f259113ab1c32271beb15627e183ada2b27ae92b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-fc95d37f0b9fa0731962.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "沙漏回转",
   "source_phrase": "一个倒转的沙漏",
   "sha256": "9d54490eb70c1dfcaf6ed438377ab54dde2bf1be98815f6b7c6e172177035b5d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "一串只往上的台阶",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "为什么要这么多道 规则一发布，所有 AI 下一次开工就照着做。发出半截，或者把别人刚发的改动盖掉，错的不是一个对话，而是之后的每一个。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-d93ab52de4e826.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-d93ab52de4e826",
   "source_phrase": "右边约三分之一宽一张竖长卡片“为什么要这么多道”，上面一幅小插画：一个印章盖下去，后面跟着一排小窗口都亮起。",
   "sha256": "f40406d9ebdbfdfab58e2cb3fcf432d7060299321baf61176757ddd82943b852",
   "status": "ready",
   "original_elements": [
    "一个印章盖下去，后面跟着一排小窗口都亮起"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c4cc51deae3911540e71.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c4cc51deae3911540e71",
   "title_text": "发布器：不出半截、不互相覆盖",
   "sha256": "724240e98bd776669a33e6eb5063b9f0c2ff9fc47f578166c115d82ed79bd10d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 发布器：不出半截、不互相覆盖

1. **只从推上去的提交发布**　先确认这个提交已经在 GitHub 的 main 上；本地没推的、没提交的改动都进不来。
2. **只看参与发布的文件**　别的项目、技能正改着东西，不拦发布，也不会把别人没做完的混进来。
3. **新版必须包含正在用的那版**　另一个任务刚发布过，就得先把它的改动并进来，否则拒绝发布。
4. **对上指针再换**　换之前核对“当前指针”的内容指纹没变；同一时间只允许一个发布器在跑。
5. **先搭好，再一下换过去**　新一版先写进临时目录，整个挪进 releases，最后才改指针和入口。
6. **出错就原样恢复**　指针和两份入口文件动手前各留一份原样，出错全部写回，旧版照常能用。
7. **编号只增不减**　E 后面的数字只往上走，用过的号不再用，回退也不冒用旧号。

**为什么要这么多道**　规则一发布，所有 AI 下一次开工就照着做。发出半截，或者把别人刚发的改动盖掉，错的不是一个对话，而是之后的每一个。

::screen{#agents-07 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-07",
  "section": "tech",
  "title": "钩子：每条新消息带进来什么",
  "scene": "横版画面：左上标题。左右两栏各一张大卡片：左栏“Claude”（卡片左上角画 Claude 橙色星形标志），右栏“Codex”（卡片左上角画 OpenAI 花结标志）；两栏下面横跨整屏一张卡片“两边一样的”，卡片左边一幅小插画：一个对话气泡上挂三个小标签（芯片、钥匙、沙漏图案，不写字）。卡片里的绿色链接照〔〕画。",
  "portrait": "竖版画面：标题；Claude、Codex、两边一样的，三张卡片从上往下各占整宽。字完全一样。",
  "links": [
   {
    "text": "怎么协作",
    "href": "/how/#agents"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "钩子：每条新消息带进来什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "comparison",
     "text_ref": "Claude",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "Claude"
      },
      {
       "text_ref": "Codex"
      },
      {
       "text_ref": "两边一样的",
       "span": 2
      }
     ],
     "illustration": "none",
     "icons": "none",
     "image_mode": "none"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "钩子：每条新消息带进来什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "comparison",
     "text_ref": "Claude",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "Claude"
      },
      {
       "text_ref": "Codex"
      },
      {
       "text_ref": "两边一样的",
       "span": 2
      }
     ],
     "illustration": "none",
     "icons": "none",
     "image_mode": "none"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "Claude橙色星形标志",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/OpenAI标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "OpenAI标志",
   "source_phrase": "OpenAI花结标志",
   "sha256": "d5e37ca41dfb31132d6efa380695341971364f891ab4002f15821513909e5c0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "Claude（每条新消息前一个钩子）",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "两边一样的",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "Claude（每条新消息前一个钩子）",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "两边一样的",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/气泡.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "对话气泡",
   "source_phrase": "左右两栏各一张大卡片：左栏“Claude”（卡片左上角画 Claude 橙色星形标志），右栏“Codex”（卡片左上角画 OpenAI 花结标志）；两栏下面横跨整屏一张卡片“两边一样的”，卡片左边一幅小插画：一个对话气泡上挂三个小标签（芯片、钥匙、沙漏图案，不写字）。",
   "sha256": "4ffd11a1805d6fcd443e6d721ff92690ba8469f4bbdb231be34373895d4565ac",
   "status": "ready",
   "original_elements": [
    "一个对话气泡上挂三个小标签（芯片、钥匙、沙漏图案，不写字"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "agents/agents-07-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-agents-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-10c24e23ceab92ed0245",
   "title_text": "钩子：每条新消息带进来什么",
   "sha256": "610a349e5c6cbf79c4ea06c3b228f67af143e79e1717b70f8ecbeddc4dcae3d1",
   "status": "ready",
   "source_box": [
    37,
    44,
    1050,
    222
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 钩子：每条新消息带进来什么

**Claude**（挂六处：每条新消息前、每轮回复结束前、派子代理/提问/传话和操作 Chrome 前、每次调用工具后、上下文压缩前、压缩或续作后；这里讲每条新消息前那一处）
- 程序 claude_root_runtime.py 按内容指纹存进 E:\Data\AppData\Claude\managed-hooks，再合进 Claude 的设置；别的设置和钩子都保留。
- 型号和档位先用 Claude 随消息给的；缺的再读 Claude 桌面给这个会话存的设置；两边型号对不上，档位写“未知”。

**Codex**（挂六处：每条新消息前、每轮回复结束前、派子代理和提问前、压缩前、压缩或续作后、每个子代理启动时）
- 程序 codex_context_hook.py，启动命令里带着它自己的内容指纹，文件被改过，它会报“完整性未能确认”。装之前先给现有配置拍一份快照，装坏了能退回。
- 型号取这条消息自带的；档位从这一轮的对话记录里找。

**两边一样的**
- 带进三样：型号和思考档位、私人资料状态、我开的无限制授权。读不到就写“未知”，不拿默认值补。
- 只告知，不拦消息，也不给任何权限：钩子坏了，对话照样能进行。型号和档位供 AI 按成品要求选人：能用的选最划算的，关键部分选做得最好的（见〔怎么协作〕）。
- 我整句说“开个无限制授权”这类话时，钩子替我打开验证窗口；讨论、提问、否定、转述都不算。两边用同一批例句测试，免得说法走样。
- **别的几处做什么**　派子代理或提问前，附上相关的现行决定；压缩前把我的原话存盘，压缩或续作后放回最近 15 条（见“我的决定和 AI 的经验记在哪”）；Claude 调用工具后，发现 GPT 子任务的 Claude 侧验收清单还没跑就提醒一次；回复结束前只按真实回执兜底：资料读取被拦却没先请我解锁、交汇报时子任务还没过根会话验收，才拦下一次，第二次只提示。GPT 子任务由执行器自己盯着，回复结束时不再要主持重挂监测。
- 现在装的版本：两边 10 月 7 日 23:29 一起换上（带压缩原话的这一版）。

::screen{#agents-08 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-08",
  "section": "tech",
  "title": "技能：一份源码，两边共用",
  "scene": "横版画面：左上标题。标题下一条横向流程（第二段，用 → 连接的那一行）：左边一个装满卡片的木箱（源码），中间一张清单纸，再往右一个小扳手（安装器），然后一个文件夹伸出很多根链接线，最右边两个小窗口（Claude 橙色星形标志、OpenAI 花结标志）都连到这个文件夹。流程下面五张横向小卡片两列排开（左三右二），每张一个小图标（1 一根链条；2 一个对话气泡里一个灯泡；3 一张打勾的清单；4 一块小墓碑；5 三级小台阶（装好和登记、运行条件、真用过），最后一级是虚线）。最下面一行小字，里面的绿色链接照〔〕画。",
  "portrait": "竖版画面：标题；流程改成从上往下；五张卡片一行一张；最后一行小字。字完全一样。",
  "links": [
   {
    "text": "技能",
    "locator_text": {
     "h": "见技能。",
     "v": "见技能。"
    },
    "href": "/skills/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "技能：一份源码，两边共用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "源码",
     "layout": "chain",
     "split_arrows": true,
     "columns": 5,
     "connector": "none",
     "illustration": "above_card",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "text_ref": "不复制，只链接",
     "columns": 2,
     "portrait_columns": 1,
     "flow": "column",
     "rows": 3,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "缺的能力真影响结果时"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "技能：一份源码，两边共用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "源码",
     "layout": "chain",
     "split_arrows": true,
     "columns": 5,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "text_ref": "不复制，只链接",
     "columns": 1,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "缺的能力真影响结果时"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；末轮接口核实topology可用left_inside，竖流程改卡内左侧小图，保留原箭头待组件G2修复。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/纸箱.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "纸箱",
   "source_phrase": "装满卡片的木箱",
   "sha256": "37f5c6a705967fa0907c2069cc8f4398087977585b3ac6c9ec9fa9bf20e095d7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张清单纸",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/扳手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "扳手",
   "source_phrase": "一个小扳手",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件夹链接",
   "source_phrase": "文件夹伸出很多根链接线",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "两个小窗口Claude标志、OpenAI标志",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-10b2a9e171c500a5d21a.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "链条",
   "source_phrase": "一根链条",
   "sha256": "41c79537c10e81121fafff1ba9e60567a8a4c9b3d0703403eec4bac25be5b1a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/气泡灯泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "气泡灯泡",
   "source_phrase": "一个对话气泡里一个灯泡",
   "sha256": "19477293848a5aea870863f941f057ed325af5b780cb81e83664490f7096061a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张打勾的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/墓碑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "墓碑",
   "source_phrase": "一块小墓碑",
   "sha256": "9bdfa4e530aa506960b44519f15d33916f1fe649dbac941c1058388887437c86",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "三级小台阶，最后一级虚线",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-0a92c0a97e54cfe84ec2-a9596c10e7b2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-08-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0a92c0a97e54cfe84ec2",
   "title_text": "技能：一份源码，两边共用",
   "sha256": "d99c050178bf8ae2fdb8c634a5a7073e0169447809dc94e8ae06445ac504c430",
   "status": "ready",
   "source_box": [
    37,
    19,
    869,
    151
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 技能：一份源码，两边共用

源码 E:\.agents\skills、E:\.agents\plugins → 清单（名字、源码在哪、装不装）→ 安装器 → C:\Users\10979\.agents\skills（每个技能一个目录链接）→ Codex 从这里找；Claude 的 skills 目录本身就是指向这里的链接

- **不复制，只链接**　用户目录里只有链接，源码一改，两边下次读到的都是新的，不会出现两份不一样的技能。
- **说事就行**　每个技能开头写明什么时候该用，AI 按我要做的事挑，我不用记技能名。
- **装、换、停都按清单**　装一个、更新一个、停一个，或者按整份清单收拢；不带 -Apply 只给计划、不动手。链接指向不明的目录、或者同名的普通目录，一律不动，等人处理。
- **退役的不再冒出来**　退役技能先在清单里留一条“墓碑”，安装器拆掉它的链接；确认没人再用，连墓碑、源码、测试一起删，历史在 Git 里；不留“归档副本”，免得 AI 把旧做法当成现行的读进去。9 月 27 日一次删了 26 个。
- **“装好了”不等于“能用”**　要查技能装没装、登记坏没坏，AI 跑只读的体检脚本；按需才跑，不是每个任务的关卡。它只看安装和登记，说明不了技能好不好用；加查时也能看这台电脑上的运行条件（浏览器、Google、Tailscale 这几类）。真实用成过没有，它一律写“未核验”；要知道，拿一件真事让技能做一次。

缺的能力真影响结果时，才从 8 个官方插件的按需目录里推荐，不自动装。每个技能怎么用，见〔技能〕。

::screen{#agents-09 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-09",
  "section": "tech",
  "title": "我的决定和 AI 的经验记在哪",
  "scene": "横版画面：左上标题。八张横向圆角卡片两列四行，每张左边一幅小水彩插画（1 一本厚厚的簿子，书脊不写字；2 一张短短的索引卡，上面几行绿色小格；3 一根被压紧的弹簧，旁边一叠收好的小纸条；4 两个对话气泡之间连着一条带小标签的线；5 一本日历，旁边一只竖着食指的手和一个小计数器；6 放大镜照着两张相同的纸；7 一个关着的开关；8 一台秤上放着一个文件夹），右边粗体卡名加正文。字多的卡片按字数加高，同一行两张等高，字号不缩小。最下面一行小字，里面的绿色链接照〔〕画。",
  "portrait": "竖版画面：标题；八张卡片一行一张；最后一行小字。字完全一样。",
  "links": [
   {
    "text": "事实来源与任务上下文",
    "href": "/rules/context-sources/"
   },
   {
    "text": "约法 L30",
    "href": "/rules/charter/#L30"
   },
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "我的决定和AI的经验记在哪",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "决定原话",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/书签册.png",
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/开关.png",
      "_library/icons/文稿堆.png"
     ],
     "item_count": 8
    },
    {
     "type": "prose",
     "text_ref": "规矩本身见"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "我的决定和AI的经验记在哪",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "决定原话",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/书签册.png",
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/开关.png",
      "_library/icons/文稿堆.png"
     ],
     "item_count": 8
    },
    {
     "type": "prose",
     "text_ref": "规矩本身见"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "决定原话 文件 docs\\owner-decisions.md《本人的决定原话》：截至 9 月 28 日 98 节，约 9.7 万字，是这个仓库里唯一获准超过大文档上限的文件。别处引用写编号，例如“决定：终审 ZS35”。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "查重工具 Find-DuplicateContent 扫三个基座的文件，找跨文件重复的段落，列出每处的位置；比对部分用 C# 写，免得 PowerShell 逐对比较太慢。9 月 27–28 日用过 33 次。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "开关",
   "source_phrase": "记忆开关 Claude 的 autoMemoryEnabled、Codex 的三个记忆开关都设成关。",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "体量预算 repository-bloat-budget.json 给三个基座各定文件数和总大小的参考上限（这里 235 个文件、2.9 MB），测试拦住报告、临时输出这类不该进库的东西。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-a77945a0de9de7.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-a77945a0de9de7",
   "source_phrase": "四张横向圆角卡片两列两行，每张左边一幅小水彩插画（1 一本厚厚的簿子，书脊不写字；2 放大镜照着两张相同的纸；3 一个关着的开关；4 一台秤上放着一个文件夹）。",
   "sha256": "fc8e9b315f058e323c6702bc9031f9831f17aa4e236be75ee3d566c7235ede00",
   "status": "ready",
   "original_elements": [
    "一本厚厚的簿子，书脊不写字"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文稿核验现图小槽4比3",
   "source_phrase": "四张横向圆角卡片两列两行，每张左边一幅小水彩插画（1 一本厚厚的簿子，书脊不写字；2 放大镜照着两张相同的纸；3 一个关着的开关；4 一台秤上放着一个文件夹）。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "放大镜照着两张相同的纸"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/开关.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "开关",
   "source_phrase": "四张横向圆角卡片两列两行，每张左边一幅小水彩插画（1 一本厚厚的簿子，书脊不写字；2 放大镜照着两张相同的纸；3 一个关着的开关；4 一台秤上放着一个文件夹）。",
   "sha256": "d7379969d06251f4fe56604d5ab78861ce0838ed74f1b9ea998d74ea26a6a2a9",
   "status": "ready",
   "original_elements": [
    "一个关着的开关"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-807563010dab8e.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-807563010dab8e",
   "source_phrase": "四张横向圆角卡片两列两行，每张左边一幅小水彩插画（1 一本厚厚的簿子，书脊不写字；2 放大镜照着两张相同的纸；3 一个关着的开关；4 一台秤上放着一个文件夹）。",
   "sha256": "de348b40defdb148c1b8a6a3ace12ecc058b8c87016dd94c4f15ecbeadbe17a0",
   "status": "ready",
   "original_elements": [
    "一台秤上放着一个文件夹"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-7ad451cc50b551caae1c-44d669383ef1.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-09-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7ad451cc50b551caae1c",
   "title_text": "我的决定和 AI 的经验记在哪",
   "sha256": "4abfe275248dd8ee21e6f630881f0b253c6c9ec356d4de55f60645c36161be12",
   "status": "ready",
   "source_box": [
    23,
    74,
    913,
    238
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 我的决定和 AI 的经验记在哪

- **决定原话**　文件 docs\owner-decisions.md《本人的决定原话》：截至 10 月 10 日 506 节，约 44 万字；它和旧决定归档、10 月 7 日的复盘稿是仓库里获准超过大文档上限的三份文件。别处引用写编号，例如“决定：终审 ZS35”。10 月 7 日把我在主对话里的 315 条消息逐条过了一遍：282 条完整原句归进这里，33 条不是决定，不收。
- **现行决定索引**　docs\current-decisions.md 只列还在生效的结论：主题、结论、出处、是要求还是建议、取代了哪条，上限 12 KB（10 月 8 日 12,119 字节）。AI 派子代理或向我提问时，钩子按这件事从里面挑相关的几条附上；10 月 7 日调准后每次附 3–4 条，无关的从 1 条降到 0。
- **压缩不丢原话**　对话长到要压缩时，钩子先把我在主对话里的原话原样存盘；压缩后放回最近 15 条原文，并标出还有几条没记进决定（只是待核，不都是决定）。原话算个人资料，资料锁着就不存，只提示没做成。Claude、Codex 都改成约 40 万 token 就开始压缩（窗口上限没动），一条命令能切回原来的门槛。10 月 8 日凌晨主对话自然压缩后，实测放回了 15 条。
- **转话带出处**　从别的对话转来的话，自动附上源对话、原消息、时间、前面问的是什么和原句；缺了就标“转述”，先回源核实。收尾时按消息列出还没记进决定的我的话，由主持核实后再归位。新对话里原生转话的实测还没做。
- **每天数纠正次数**　每天北京时间 00:10，GPT-6 Luna 读前一天 Claude 和 Codex 对话里我的消息，数出我纠正 AI 说错、答偏、做错的次数，新需求和普通提问不算。资料锁着就不数，当天记“没数成”，不当成零。10 月 8 日第一次跑成功，七天趋势还没攒够。
- **查重工具**　Find-DuplicateContent 扫三个基座的文件，找跨文件重复的段落，列出每处的位置；比对部分用 C# 写，免得 PowerShell 逐对比较太慢。9 月 27 日–10 月 5 日用过 38 次。
- **记忆开关**　Claude 的 autoMemoryEnabled、Codex 的三个记忆开关都设成关。
- **体量预算**　repository-bloat-budget.json 给三个基座各定文件数和总大小的参考上限（这里 235 个文件、2.9 MB），测试拦住报告、临时输出这类不该进库的东西。

规矩本身见：一样东西只存一处〔事实来源与任务上下文〕；经验当轮写进文件〔约法 L30〕；仓库体量〔工程与交付〕。

::screen{#agents-10 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-10",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。左边约三分之二宽，五张横向小卡片（左列三张、右列两张；小水彩图标＋粗体一句＋小字；图标：1 两本书，旁边一个装着很多旧书的箱子正被搬走；2 一把钥匙挂在墙上没被取下；3 一个按一下就停的秒表；4 一把尺子量着书的装订线；5 一只指向前方的手）。卡片里的绿色链接照〔〕画。右边约三分之一宽，竖着三张大数字卡（** 包住的是大号绿色数字）。",
  "portrait": "竖版画面：标题；五张卡片一行一张；三张数字卡一行一张放最后。字完全一样。",
  "links": [
   {
    "text": "约法 L10",
    "href": "/rules/charter/#L10"
   },
   {
    "text": "约法 L30",
    "href": "/rules/charter/#L30"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1只留两份版本目录",
     "columns": 3,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto",
     "width": "100%",
     "row": "principles"
    },
    {
     "type": "stat_card",
     "text_ref": "约7.2万字",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/icons/日历时钟.png"
     ],
     "variant": "lead_value",
     "width": "100%",
     "row": "numbers"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1只留两份版本目录",
     "columns": 1,
     "portrait_columns": 1,
     "flow": "row",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "stat_card",
     "text_ref": "约7.2万字",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/icons/日历时钟.png"
     ],
     "variant": "lead_value"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "两本书，旁边一个装着很多旧书的箱子正被搬走",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一把钥匙挂在墙上没被取下",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "秒表",
   "source_phrase": "一个按一下就停的秒表",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子量着书的装订线",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/指向手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "指向手",
   "source_phrase": "一只指向前方的手",
   "sha256": "b91d58864458ae828bac8c417ce629dc5c21bbafc9cb56094265107503bfe26c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "约 4.2 万字  生效的 11 个规则文件（不算空白）",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "30 条  约法，我逐条审定",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "55 项  登记的自动测试，改哪块跑哪块",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-9ce99a7f5a6a4d1b80fa.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 为什么这样设计

1. **只留两份版本目录**　每次发布后，当前和上一版以外的版本目录就删掉，更早的只在私有 Git 里。磁盘上不堆旧快照，AI 也就翻不到过时的规则。
2. **发布不找我验证**　保护防的是随手改文件，不是防 AI 按规矩办事。约法由我审定，但发布这一步不调用我的密码或本人验证，也不另建一套授权（〔约法 L10〕：不加没用的关卡）。
3. **不建后台服务**　发布、核验、回退都是跑完就结束的命令；不为发布建队列、常驻程序或施工平台，同时发布靠一把进程锁和指针比对就挡住了。
4. **测试查结构，不锁字句**　规则测试查真实字段、来源、同一版的文件集合、引用和回退，不逐字锁句子、文件数或编号：规则改写一句话，不用跟着改一堆测试。
5. **规则只写现在怎么做**　为什么这么定、以前怎么定，放在 Git 历史和决定记录里，规则正文不写：AI 读得快，也不会被旧做法带偏（〔约法 L30〕）。

- **约 7.2 万字**　生效的 11 个规则文件（不算空白）
- **30 条**　约法，我逐条审定
- **84 项**　登记的自动测试，改哪块跑哪块

::screen{#agents-11 section="highlights"}

```typeset
{
 "screen": {
  "id": "agents-11",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：和标杆页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字（** 包住的那句），下面一段正文。插画：1 一个文件夹上挂着一把大锁，旁边一只手拿着笔却写不进去，远处一个放大镜照出一处红色的不一致；2 两本书并排，一本是草稿（页边有涂改），一本盖了章，一个小箭头绕过草稿指向盖章的那本；3 一个大窗口和一个小窗口，大窗口上贴着一枚深色的标签，小窗口上是一枚空白标签（标签上都不写字），中间一只手把深色标签挡了回去。",
  "portrait": "竖版画面：三张大卡片从上往下排，各占整宽，插画在卡片顶部。字完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "comparison",
     "text_ref": "1随手改不了",
     "columns": 3,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "随手改不了"
      },
      {
       "text_ref": "改了一半的源码"
      },
      {
       "text_ref": "子代理不会冒领"
      }
     ],
     "illustration": "top_inside",
     "icons": "auto",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    }
   ],
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "comparison",
     "text_ref": "1随手改不了",
     "columns": 3,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "随手改不了"
      },
      {
       "text_ref": "改了一半的源码"
      },
      {
       "text_ref": "子代理不会冒领"
      }
     ],
     "illustration": "top_inside",
     "icons": "auto",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "随手改不了，偷偷改了也不认。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "key": "代码窗口",
   "source_phrase": "改了一半的源码，冒充不了规则。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": "子代理不会冒领父会话的档位。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "随手改不了，偷偷改了也不认。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "key": "代码窗口",
   "source_phrase": "改了一半的源码，冒充不了规则。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": "子代理不会冒领父会话的档位。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "锁文件夹",
   "source_phrase": "插画：1 一个文件夹上挂着一把大锁，旁边一只手拿着笔却写不进去，远处一个放大镜照出一处红色的不一致；2 两本书并排，一本是草稿（页边有涂改），一本盖了章，一个小箭头绕过草稿指向盖章的那本；3 一个大窗口和一个小窗口，大窗口上贴着一枚深色的标签，小窗口上是一枚空白标签（标签上都不写字），中间一只手把深色标签挡了回去。",
   "sha256": "a17733ae031a32e99492ccd65da9b09418d912d572b6663f79b80a8a15b40607",
   "status": "ready",
   "original_elements": [
    "一个文件夹上挂着一把大锁，旁边一只手拿着笔却写不进去，远处一个放大镜照出一处红色的不一致"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-4bce9731581bc2.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "册子阅读现图小槽4比3",
   "source_phrase": "插画：1 一个文件夹上挂着一把大锁，旁边一只手拿着笔却写不进去，远处一个放大镜照出一处红色的不一致；2 两本书并排，一本是草稿（页边有涂改），一本盖了章，一个小箭头绕过草稿指向盖章的那本；3 一个大窗口和一个小窗口，大窗口上贴着一枚深色的标签，小窗口上是一枚空白标签（标签上都不写字），中间一只手把深色标签挡了回去。",
   "sha256": "421c6aa8d646e894c5b62de75e129b60646020d72acece8b84a5ebe155efb705",
   "status": "ready",
   "original_elements": [
    "两本书并排，一本是草稿（页边有涂改），一本盖了章，一个小箭头绕过草稿指向盖章的那本"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-3d3a78f736250f.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-3d3a78f736250f",
   "source_phrase": "插画：1 一个文件夹上挂着一把大锁，旁边一只手拿着笔却写不进去，远处一个放大镜照出一处红色的不一致；2 两本书并排，一本是草稿（页边有涂改），一本盖了章，一个小箭头绕过草稿指向盖章的那本；3 一个大窗口和一个小窗口，大窗口上贴着一枚深色的标签，小窗口上是一枚空白标签（标签上都不写字），中间一只手把深色标签挡了回去。",
   "sha256": "07eda4e366c5c9dac17fb2e0a5596a2b01362bc621ff3224ae9efbf4a54b677b",
   "status": "ready",
   "original_elements": [
    "一个大窗口和一个小窗口，大窗口上贴着一枚深色的标签，小窗口上是一枚空白标签（标签上都不写字），中间一只手把深色标签挡了回去"
   ],
   "hidden": false
  }
 ]
}
```

1. **随手改不了，偷偷改了也不认。**
审定约法时我提过：规则不能谁打开文件管理器就能改掉（9 月 26 日）。现在生效的那一版目录、指针和两份入口文件，发布后归 Windows 的 SYSTEM 账户所有，我的账户和管理员都只能读，文件还带只读属性；只有发布器能临时打开，写完马上封回再回读。就算有人专门夺回权限改了规则文件，下一次核验内容指纹对不上，AI 就不认这一版。

2. **改了一半的源码，冒充不了规则。**
Claude Code 有个默认习惯：项目里没有 CLAUDE.md，就把 AGENTS.md 当项目规则读。可规则库自己的 AGENTS.md 正是待发布的源码，在这个仓库里干活的 Claude 会把改了一半的规矩当真。所以仓库根放了一份很短的指路文件，只指向用户级入口；入口缺失时给出核验命令，防止未发布的源码被当成现行规则。

3. **子代理不会冒领父会话的档位。**
Codex 分叉派出子代理时，子代理的对话记录开头会复制父会话这一轮的设置：同一个轮次号、父会话的档位。钩子要是照着读，就会把父会话的 max 报成子代理的档位，AI 算账就算错。所以子代理启动时，钩子只取事件里的型号，档位老实写“未知”（9 月 28 日按审查意见改）。

::screen{#agents-12 section="features"}

```typeset
{
 "screen": {
  "id": "agents-12",
  "section": "features",
  "title": "全部功能",
  "scene": "横版画面：和标杆页“全部功能”一样的画法，但组名不单独占一整列：每组先一行横跨整屏的毛笔字组名（** 包住的那行），组名下面这一组的卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。每行“编号. 功能名｜一句话｜状态”：竖线不画，末尾的状态词不写成字，画成右上角的圆点（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。三张图上下拼成一整段：第一张顶上有标题和图例，后两张没有标题和图例，接着往下排；上下边都不画边框。一组功能不跨屏。",
  "portrait": "竖版画面：组名一行；卡片一行一张（编号、功能名、一句话，右上角圆点）；第一张顶上是标题和图例。字完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-release",
    "text": "规则发布与核验"
   },
   {
    "id": "f-verify",
    "text": "开工核验"
   },
   {
    "id": "f-publish",
    "text": "标准发布"
   },
   {
    "id": "f-fast-publish",
    "text": "快速发布"
   },
   {
    "id": "f-rollback",
    "text": "退回上一版"
   },
   {
    "id": "f-seal",
    "text": "防随手改"
   },
   {
    "id": "f-entry",
    "text": "入口随版本部署"
   },
   {
    "id": "f-stub",
    "text": "仓库根的入口文件"
   },
   {
    "id": "f-topic-route",
    "text": "按事找专题"
   },
   {
    "id": "f-catalog",
    "text": "规则目录表"
   },
   {
    "id": "f-laptop",
    "text": "笔记本同步约法"
   },
   {
    "id": "g-hooks",
    "text": "钩子"
   },
   {
    "id": "f-claude-hook",
    "text": "Claude 钩子"
   },
   {
    "id": "f-codex-hook",
    "text": "Codex 钩子"
   },
   {
    "id": "f-model-effort",
    "text": "告知型号和档位"
   },
   {
    "id": "f-takeover",
    "text": "认出授权请求"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "agents-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（42项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用"
    },
    {
     "type": "feature_card",
     "text_ref": "规则发布与核验",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "钩子",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（42项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用"
    },
    {
     "type": "feature_card",
     "text_ref": "规则发布与核验",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "钩子",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": "auto",
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "开工核验｜每个 AI 开工、续作、上下文压缩后跑一次，约 0.6 秒，逐个比对这一版文件的内容指纹｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "标准发布｜从已推送的提交打包新的一版，切换“当前”和“上一版”，出错原样恢复｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "快速发布｜普通文字改动一条命令跑完挑测试、提交、推送、发布、核对；9 月 25–28 日用过 14 次｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "退回上一版｜“当前”和“上一版”对调，两份入口一起换回；测试里验过，正式环境没找到用过的记录｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "防随手改｜生效目录、指针和入口归 SYSTEM，其他人只读；只有发布器能临时打开再封回｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "入口随版本部署｜发布时把两份入口写进 Claude 和 Codex 的家目录，回退时一起换回｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "仓库根的入口文件｜仓库根放一份 CLAUDE.md，防止改了一半的 AGENTS.md 被 Claude 当规则读｜在用",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "按事找专题｜核验结果带一张目录：每份专题管什么、什么情况该读｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "规则目录表｜32 条规则文件登记在一张表里，测试核对四个仓库的规则文件都登记了｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "笔记本同步约法｜笔记本上的 Codex 按需巡检时，从主机的生效版本同步约法那一段；主机不反向写｜待验收",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "Claude 钩子｜每条新消息前带进型号档位、私人资料状态和无限制授权；收尾查 GPT 子任务有没有人跟进；按内容指纹部署｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "Codex 钩子｜每条新消息前和每个子代理启动时带进同样三样；装前拍快照，能退回｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "告知型号和档位｜让 AI 知道自己是什么型号、什么档位，好算自己做还是派出去｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "认出授权请求｜我整句说“开个无限制授权”时替我打开验证窗口；9 月 28 日补回 4 种说法｜在用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-65814a6e2c5221e2b5d9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-65814a6e2c5221e2b5d9",
   "title_text": "全部功能（36 项）",
   "sha256": "f3e831b10906dfc40261fcbb960d18090e8c7f3ebf271091384760db1e2939ff",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（42 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**规则发布与核验**
1. 开工核验｜每个 AI 开工、续作、上下文压缩后跑一次，约 0.6 秒，逐个比对这一版文件的内容指纹｜在用
2. 标准发布｜从已推送的提交打包新的一版，切换“当前”和“上一版”，出错原样恢复｜在用
3. 快速发布｜普通文字改动一条命令跑完挑测试、提交、推送、发布、核对；9 月 25–28 日用过 14 次｜在用
4. 退回上一版｜“当前”和“上一版”对调，两份入口一起换回；测试里验过，正式环境没找到用过的记录｜说不准
5. 防随手改｜生效目录、指针和入口归 SYSTEM，其他人只读；只有发布器能临时打开再封回｜在用
6. 入口随版本部署｜发布时把两份入口写进 Claude 和 Codex 的家目录，回退时一起换回｜在用
7. 仓库根的入口文件｜仓库根放一份 CLAUDE.md，防止改了一半的 AGENTS.md 被 Claude 当规则读｜在用
8. 按事找专题｜核验结果带一张目录：每份专题管什么、什么情况该读｜在用
9. 规则目录表｜33 条规则文件登记在一张表里，测试核对四个仓库的规则文件都登记了｜在用
10. 笔记本同步约法｜笔记本上的 Codex 按需巡检时，从主机的生效版本同步约法那一段；主机不反向写｜待验收

**钩子**
11. Claude 钩子｜每条新消息前带进型号档位、私人资料状态和无限制授权；派活和提问前附相关现行决定，压缩前后存放原话；收尾只按真实回执兜底资料守卫和汇报验收，GPT 子任务由执行器自己盯，不再要主持重挂监测；按内容指纹部署｜在用
12. Codex 钩子｜每条新消息前和每个子代理启动时带进同样三样；装前拍快照，能退回｜在用
13. 告知型号和档位｜让 AI 知道自己是什么型号、什么档位，按成品要求选谁来做｜在用
14. 认出授权请求｜我整句说“开个无限制授权”时替我打开验证窗口；9 月 28 日补回 4 种说法｜在用

::screen{#agents-13 section="features"}

```typeset
{
 "screen": {
  "id": "agents-13",
  "section": "features",
  "title": "全部功能（2）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法，但组名不单独占一整列：每组先一行横跨整屏的毛笔字组名（** 包住的那行），组名下面这一组的卡片按实际项数灵活排满各行；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。每行“编号. 功能名｜一句话｜状态”：竖线不画，末尾的状态词不写成字，画成右上角的圆点（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。三张图上下拼成一整段：第一张顶上有标题和图例，后两张没有标题和图例，接着往下排；上下边都不画边框。一组功能不跨屏。本张：技能组 15–21 七项，末排 21 项可铺满整行，不补空卡；决定和经验组 22–31 十项，三列排三行后，末排 31 项铺满整行，不补空卡。卡片高度随字数自适应、同一行等高，字号不缩小。正确重复图例或续标题可就近帮助理解，不作为额外重画门槛。",
  "portrait": "竖版画面：组名一行；卡片一行一张（编号、功能名、一句话，右上角圆点）。字完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-skills",
    "text": "技能"
   },
   {
    "id": "f-skill-source",
    "text": "一份技能源"
   },
   {
    "id": "f-skill-route",
    "text": "说事就找对技能"
   },
   {
    "id": "f-skill-install",
    "text": "装、换、停技能"
   },
   {
    "id": "f-skill-retire",
    "text": "退役技能不再冒出"
   },
   {
    "id": "f-skill-check",
    "text": "查技能能不能用"
   },
   {
    "id": "f-doctor",
    "text": "查三个基座哪里坏了"
   },
   {
    "id": "f-plugins",
    "text": "按需插件目录"
   },
   {
    "id": "g-memory",
    "text": "决定和经验"
   },
   {
    "id": "f-decisions",
    "text": "决定原话"
   },
   {
    "id": "f-decision-index",
    "text": "现行决定索引"
   },
   {
    "id": "f-compaction-originals",
    "text": "压缩不丢原话"
   },
   {
    "id": "f-forward-source",
    "text": "转话带出处"
   },
   {
    "id": "f-daily-corrections",
    "text": "每天数纠正次数"
   },
   {
    "id": "f-dedupe",
    "text": "查重复段落"
   },
   {
    "id": "f-shared-lessons",
    "text": "经验写进共享文件"
   },
   {
    "id": "f-weekly",
    "text": "每周基座体检"
   },
   {
    "id": "f-bloat",
    "text": "仓库体量预算"
   },
   {
    "id": "f-site-check",
    "text": "网站内容周检"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "agents-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "技能",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/打勾清单.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/GitHub标志.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "决定和经验",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/icons/书签册.png",
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/icons/共享节点.png",
      "_library/hires-icons-r2/42-听诊器检查-clean.png",
      "_library/round3/clean-assets/png/43-文件柜-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "技能",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/打勾清单.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/GitHub标志.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "决定和经验",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/icons/书签册.png",
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/icons/共享节点.png",
      "_library/hires-icons-r2/42-听诊器检查-clean.png",
      "_library/round3/clean-assets/png/43-文件柜-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一份技能源｜技能的原始文件只放在 skills 和 plugins 两个目录，两边经目录链接共用｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "说事就找对技能｜每个技能开头写明什么时候用，AI 按要做的事挑｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "装、换、停技能｜按清单装一个、更新一个、停一个或整份收拢，先给计划｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "退役技能不再冒出｜清单留墓碑、拆链接，确认没人用后连源码一起删｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "查技能能不能用｜只读体检脚本分开回答源码和安装、运行条件；它说明不了技能好不好用，真实用成过没有一律写“未核验”｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "查三个基座哪里坏了｜只读体检脚本按需查技能装没装，规则库、电脑配置和 GitHub 项目总索引的登记坏没坏；只查不修，不是每个任务的关卡｜在用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "按需插件目录｜8 个官方插件，只在缺能力真影响结果时推荐，不自动装｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "决定原话｜我的决定原话只存一处，98 节，别处引用编号｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "查重复段落｜扫三个基座找跨文件重复的段落，收成一处｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "共享节点",
   "source_phrase": "经验写进共享文件｜两边自动记忆关闭，纠正和教训当轮写进项目文件或专题｜在用",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "每周基座体检｜每周一 13:00 Astra 最高档查三个基座、修看得见的错；只排 10 月 5、12、19、26 日四次，第四次交我评审｜待验收",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "仓库体量预算｜三个基座各有文件数和总大小的参考上限，测试拦住不该进库的报告和临时文件｜在用",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "网站内容周检｜核对网站上的说明准不准；暂停中，我按需启动｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  }
 ]
}
```

**技能**
15. 一份技能源｜技能的原始文件只放在 skills 和 plugins 两个目录，两边经目录链接共用｜在用
16. 说事就找对技能｜每个技能开头写明什么时候用，AI 按要做的事挑｜在用
17. 装、换、停技能｜按清单装一个、更新一个、停一个或整份收拢，先给计划｜在用
18. 退役技能不再冒出｜清单留墓碑、拆链接，确认没人用后连源码一起删｜在用
19. 查技能能不能用｜只读体检脚本分开回答源码和安装、运行条件；它说明不了技能好不好用，真实用成过没有一律写“未核验”｜在用
20. 查三个基座哪里坏了｜只读体检脚本按需查技能装没装，规则库、电脑配置和 GitHub 项目总索引的登记坏没坏；只查不修，不是每个任务的关卡｜在用
21. 按需插件目录｜8 个官方插件，只在缺能力真影响结果时推荐，不自动装｜说不准

**决定和经验**
22. 决定原话｜我的决定原话只存一处，506 节（10 月 10 日统计），别处引用编号；10 月 7 日逐条过了我 315 条消息，282 条原句归位｜在用
23. 现行决定索引｜还在生效的决定压成一张不超过 12 KB 的表；派子代理或向我提问时，钩子挑相关的附上（10 月 7 日实测每次 3–4 条，无关 0 条）｜在用
24. 压缩不丢原话｜压缩前把我的原话原样存盘，压缩后放回最近 15 条，标出还没记进决定的条数；约 40 万 token 开始压缩，一条命令切回｜在用
25. 转话带出处｜别的对话转来的话附上源对话、原消息、时间、前面的问题和原句，缺了标“转述”；收尾列出还没记进决定的消息｜待验收
26. 每天数纠正次数｜每天北京时间 00:10 由 GPT-6 Luna 数前一天我纠正 AI 的次数，结果进看板接口；资料锁着就不数，不当成零｜在用
27. 查重复段落｜扫三个基座找跨文件重复的段落，收成一处｜在用
28. 经验写进共享文件｜两边自动记忆关闭，纠正和教训当轮写进项目文件或专题｜在用
29. 每周基座体检｜每周一 13:00 Astra 最高档查三个基座、修看得见的错；先过四周稳定期，之后按常驻每周治理继续，评审时可调整｜待验收
30. 仓库体量预算｜三个基座各有文件数和总大小的参考上限，测试拦住不该进库的报告和临时文件｜在用
31. 网站内容周检｜核对网站上的说明准不准；暂停中，我按需启动｜说不准

::screen{#agents-14 section="features"}

```typeset
{
 "screen": {
  "id": "agents-14",
  "section": "features",
  "title": "全部功能（3）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法，但组名不单独占一整列：每组先一行横跨整屏的毛笔字组名（** 包住的那行），组名下面这一组的卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。每行“编号. 功能名｜一句话｜状态”：竖线不画，末尾的状态词不写成字，画成右上角的圆点（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。三张图上下拼成一整段：第一张顶上有标题和图例，后两张没有标题和图例，接着往下排；上下边都不画边框。一组功能不跨屏。本张：协作的接线 32–37 六项，其中 32“Claude 派 GPT”字多，横跨三列画成一整行宽卡，字号不缩小，其余五张排在它下面；收尾和备份 38–41 四项，38 字多也可画成宽卡；已停用 42 一项。卡片高度随字数自适应、同一行等高，不补空卡。",
  "portrait": "竖版画面：组名一行；卡片一行一张（编号、功能名、一句话，右上角圆点）。字完全一样。",
  "links": [
   {
    "text": "怎么协作",
    "href": "/how/#agents"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [
   {
    "id": "g-collab",
    "text": "协作的接线"
   },
   {
    "id": "f-gpt-child",
    "text": "Claude 派 GPT"
   },
   {
    "id": "f-child-digest",
    "text": "看子任务进度摘要"
   },
   {
    "id": "f-roster",
    "text": "可派模型清单"
   },
   {
    "id": "f-opus-tiers",
    "text": "Claude 档位子代理"
   },
   {
    "id": "f-codex-child",
    "text": "Codex 子代理入口"
   },
   {
    "id": "f-short-lock",
    "text": "单点动作短锁"
   },
   {
    "id": "g-closeout",
    "text": "收尾和备份"
   },
   {
    "id": "f-recycle",
    "text": "临时文件进回收站"
   },
   {
    "id": "f-completion-evidence",
    "text": "没有实物不算完成"
   },
   {
    "id": "f-lifecycle",
    "text": "Codex 旧任务状态定位"
   },
   {
    "id": "f-backup",
    "text": "规则和技能的备份"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-retired",
    "text": "已停用的几样"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "agents-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "协作的接线",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/放大镜.png",
      "_library/hires-icons/打勾清单.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/icons/日历时钟.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "item_spans": {
      "32": 3
     }
    },
    {
     "type": "feature_card",
     "text_ref": "收尾和备份",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/round3/clean-assets/png/47-回收站文件-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/GitHub标志.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "item_spans": {
      "38": 3
     }
    },
    {
     "type": "feature_card",
     "text_ref": "已停用",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/身份盾牌.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "协作的接线",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/放大镜.png",
      "_library/hires-icons/打勾清单.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/icons/日历时钟.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "收尾和备份",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/round3/clean-assets/png/47-回收站文件-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/GitHub标志.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    },
    {
     "type": "feature_card",
     "text_ref": "已停用",
     "columns": 3,
     "portrait_columns": 1,
     "last_row": "fill",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/身份盾牌.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only"
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "Claude 派 GPT｜包装脚本派 GPT-6.1 Sol、GPT-6 Luna 和需授权的 GPT-6 Astra，能纠偏、续作｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "可派模型清单｜各型号适合什么活、我定过的限制；只作参考，不当门禁｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "Claude 档位子代理｜Claude Opus 5.5 的 low 到 max 五档，派时显式选档；第一句都是先核验规则｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "Codex 子代理入口｜gpt6_child：不定型号、不给权限，只要求守住父任务的范围｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "单点动作短锁｜装软件、发布规则、改计划任务前领锁，做完释放；9 月 26–28 日用过 29 次｜在用",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "临时文件进回收站｜只收本任务产生的东西，不认通配符，放完再查一遍确实进了回收站；9 月 20–28 日用过 794 次｜在用",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "Codex 旧任务状态定位｜读 Codex 本地记录判断旧任务结束没有；现在没有程序调用它｜没用过",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "规则和技能的备份｜提交推到 GitHub 私有仓库；没推的由每天的加密系统镜像带着｜在用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "已停用的几样｜旧分工门禁和施工登记（9 月 27 日删）、Codex 经济路由技能、G 盘热备份（8 月初停）、技能安装事务记录、十分钟本人验证邀请｜已停用",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  }
 ]
}
```

**协作的接线**（怎么用见〔怎么协作〕）
32. Claude 派 GPT｜包装脚本派 GPT-6.1 Sol、GPT-6 Luna 和需授权的 GPT-6 Astra，能纠偏、续作（续作可以直接带一句话）。派单必须写预计收益、预计花费、验证方式（查资料、看已有日志还是实测）和实测要花的额度，缺了直接拒派；查状态一单一行，最后一行写预计全部完成时间，要全文加 -Full；每单记 token、磁盘和时长；延长时限会自动告诉子任务；日志被别的程序占着时重试补写，不再中途退出；到预算自动停的开关已装、默认关｜在用
33. 看子任务进度摘要｜派 GPT 子任务后，开工约 10 分钟、它报风险或卡住时、验收前各看一次它几分钟一两句的中文进度摘要，长任务每小时一次；只读新增部分，共享读取，不锁日志｜在用
34. 可派模型清单｜各型号适合什么活、我定过的限制；只作参考，不当门禁｜在用
35. Claude 档位子代理｜Claude Opus 5.5 的 low 到 max 五档，派时显式选档；第一句都是先核验规则｜在用
36. Codex 子代理入口｜gpt6_child：不定型号、不给权限，只要求守住父任务的范围｜说不准
37. 单点动作短锁｜装软件、发布规则、改计划任务前领锁，做完释放；9 月 26–28 日用过 29 次｜在用

**收尾和备份**
38. 临时文件进回收站｜只收本任务产生的东西，不认通配符，放完再查一遍确实进了回收站；9 月 20–28 日用过 794 次。10 月 7 日根治了长路径卡死，后台回收加了 120 秒超时；AI 只放进回收站，永久删除只由我设的定时清理做（见〔电脑配置与恢复〕）｜在用
39. 没有实物不算完成｜子任务验收要附真实使用的证据；交汇报前钩子核对验收、消息覆盖和没解决的缺口，没过就拦下，先列缺口，不写“已完成”｜在用
40. Codex 旧任务状态定位｜读 Codex 本地记录判断旧任务结束没有；现在没有程序调用它｜没用过
41. 规则和技能的备份｜提交推到 GitHub 私有仓库；没推的由每天的加密系统镜像带着｜在用

**已停用**
42. 已停用的几样｜旧分工门禁和施工登记（9 月 27 日删）、Codex 经济路由技能、G 盘热备份（8 月初停）、技能安装事务记录、十分钟本人验证邀请｜已停用

::screen{#agents-15 section="history"}

```typeset
{
 "screen": {
  "id": "agents-15",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边约三分之二宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；最后一个节点“10 月 2 日”的图标是一朵绿色小云托着一张小图片，节点里〔云端素材通道〕〔省流量的云端素材〕画成绿色下划线加小箭头的链接样式。右边约三分之一宽上半部分一幅水彩插画：一本规则册从一张薄纸慢慢长成厚书，旁边从一扇门长出两扇门（Claude 橙色星形标志、OpenAI 花结标志）；下半部分一张小柱状图（最后一行的四个月份和数字，就是柱子下方和顶上的字，柱子用深浅不同的绿）。",
  "portrait": "竖版画面：时间线整宽从上往下；插画和柱状图放在时间线下面，各占整宽。字完全一样。",
  "links": [
   {
    "text": "云端素材通道",
    "href": "/rules/capabilities-runtime/#p-cloud"
   },
   {
    "text": "省流量的云端素材",
    "href": "/skills/cloud-asset-channel/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "large"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "head",
     "width": "35%",
     "align": "center"
    },
    {
     "type": "chart",
     "text_ref": "每月提交",
     "chart_type": "column",
     "data": [
      {
       "node": 0,
       "item": 0,
       "value": 3
      },
      {
       "node": 0,
       "item": 1,
       "value": 244
      },
      {
       "node": 0,
       "item": 2,
       "value": 330
      },
      {
       "node": 0,
       "item": 3,
       "value": 640
      }
     ],
     "width": "65%",
     "row": "head"
    },
    {
     "type": "timeline",
     "text_ref": "6 月 30 日",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/hires-icons-r2/42-听诊器检查-clean.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/GitHub标志.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/round3/clean-assets/png/47-回收站文件-clean.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/文件齿轮.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/云.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "width": "100%",
     "row": "history",
     "columns": 2,
     "columns_v": 1
    }
   ],
   "aspect": "16:9",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。；实审二轮：插画与柱图同排置时间线上方；块序按规格调整，G1要求所有原节点完整出现。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "6 月 30 日",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/hires-icons-r2/42-听诊器检查-clean.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/GitHub标志.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/round3/clean-assets/png/47-回收站文件-clean.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/文件齿轮.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/云.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "chart",
     "text_ref": "每月提交",
     "chart_type": "column",
     "data": [
      {
       "node": 0,
       "item": 0,
       "value": 3
      },
      {
       "node": 0,
       "item": 1,
       "value": 244
      },
      {
       "node": 0,
       "item": 2,
       "value": 330
      },
      {
       "node": 0,
       "item": 3,
       "value": 640
      }
     ]
    }
   ],
   "aspect": "9:16",
   "notes": "依据清单 source_layout 与定稿 scene/portrait 文字补齐，未查看图片；沿原横竖构图，不加定稿外字。列优先/状态仅圆点/lead_value 数字/截图列数若组件未消费，列为未完成并提请求。agents-08 保留原文箭头链，通过 topology.split_arrows 分段；五站节点图形仍待构图验收。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "6 月 30 日　建库，放进规则和技能",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "7 月 10–11 日　技能清单和目录链接安装器；只读的基座体检；规则目录表",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "7 月 26 日　Claude 的入口模板第一次出现",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "8 月初　规则库的 G 盘热备份停掉，改靠 GitHub 私有仓库和每天的系统镜像",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "8 月 30 日　现在这套版本发布器上线，第一版 E81；同一天有了快速发布",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "9 月 19 日　任务临时文件默认进回收站",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "9 月 25 日　Claude 登记成第二个受信任的 AI：有了 Claude 钩子，发布时一起部署 Claude 的入口",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "9 月 26 日　按我逐条审定的约法 L1–L30 整篇重写规则（E180 生效）；开始记我的决定原话；可派模型清单；Claude 能派 GPT；短锁；技能安装器从 1,615 行瘦到 199 行",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 27 日　退掉旧的分工门禁和施工登记，一次删掉 15,387 行；删掉 26 个退役技能；决定记录改成常设的《本人的决定原话》",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 28 日　钩子不再借父会话的档位；E187 生效；三个基座宣布完善，进入 4 周稳定期；Codex 钩子换上新版",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 29 日　E190 生效：每周基座体检只排 10 月 5–26 日四次，第四次交我评审；Google 入口写明包括待办；技能体检改成只核对源码和安装，不再回答是否真用过",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "10 月 2 日　E208 生效：加了〔云端素材通道〕，AI 要反复读的大文件在云上放一份、AI 在云里读，配套技能〔省流量的云端素材〕",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-agents",
   "source_phrase": "右边约三分之一宽上半部分一幅水彩插画：一本规则册从一张薄纸慢慢长成厚书，旁边从一扇门长出两扇门（Claude 橙色星形标志、OpenAI 花结标志）；下半部分一张小柱状图（最后一行的四个月份和数字，就是柱子下方和顶上的字，柱子用深浅不同的绿）。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready",
   "original_elements": [
    "一本规则册从一张薄纸慢慢长成厚书，旁边从一扇门长出两扇门（Claude 橙色星形标志、OpenAI 花结标志）"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-f8367a4ec7c3aa408a9e.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\agents\\img\\agents-15-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "source_box": [
    26,
    1,
    207,
    152
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 演进

- **6 月 30 日**　建库，放进规则和技能
- **7 月 10–11 日**　技能清单和目录链接安装器；只读的基座体检；规则目录表
- **7 月 26 日**　Claude 的入口模板第一次出现
- **8 月初**　规则库的 G 盘热备份停掉，改靠 GitHub 私有仓库和每天的系统镜像
- **8 月 30 日**　现在这套版本发布器上线，第一版 E81；同一天有了快速发布
- **9 月 19 日**　任务临时文件默认进回收站
- **9 月 25 日**　Claude 登记成第二个受信任的 AI：有了 Claude 钩子，发布时一起部署 Claude 的入口
- **9 月 26 日**　按我逐条审定的约法 L1–L30 整篇重写规则（E180 生效）；开始记我的决定原话；可派模型清单；Claude 能派 GPT；短锁（同一时刻只让一个任务装软件、发布规则这类单点动作）；技能安装器从 1,615 行瘦到 199 行
- **9 月 27 日**　退掉旧的分工门禁和施工登记，一次删掉 15,387 行；删掉 26 个退役技能；决定记录改成常设的《本人的决定原话》
- **9 月 28 日**　钩子不再借父会话的档位；E187 生效；三个基座宣布完善，进入 4 周稳定期；Codex 钩子换上新版
- **9 月 29 日**　E190 生效：每周基座体检只排 10 月 5–26 日四次，第四次交我评审；Google 入口写明包括待办；技能体检改成只核对源码和安装，不再回答是否真用过
- **10 月 2 日**　E208 生效：加了〔云端素材通道〕，AI 要反复读的大文件在云上放一份、AI 在云里读，配套技能〔省流量的云端素材〕
- **10 月 7–8 日**　E222–E224 生效：派活要先写收益、花费和验证方式，主持按时看 GPT 子任务的进度摘要，简单回执不做网页；压缩不丢原话、现行决定索引、每天数纠正次数、转话带出处、没有实物不算完成（见“我的决定和 AI 的经验记在哪”和全部功能）

每月提交：6 月 3 · 7 月 244 · 8 月 330 · 9 月 640
