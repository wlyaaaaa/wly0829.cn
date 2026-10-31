---
{
 "title": "AI 模型评测",
 "kind": "frozen",
 "url": "/projects/codex-agent-model-benchmark/",
 "tagline": "让几种 AI 答同一套编程题，比谁真能干",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "why-frozen",
   "label": "四条原因"
  },
  {
   "id": "usage",
   "label": "怎么用"
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
  "page": "codex-agent-model-benchmark",
  "kind": "frozen",
  "title": "AI 模型评测",
  "url": "/projects/codex-agent-model-benchmark/",
  "tagline": "让几种 AI 答同一套编程题，比谁真能干",
  "status": "冻结",
  "public": false,
  "repo_url": null,
  "capability": "比较 AI 模型谁更能干（已停用）",
  "based_on": {
   "commit": "59b0b5c9706e76b8abc2d910af484b9d13237009",
   "commit_time": "2026-08-31T04:45:27+08:00",
   "files": [
    "codex-agent-model-benchmark README.md、AGENTS.md、docs/*.md、docs/plans/*.md、reports/*.md、config/probes/*.md（59b0b5c；未读代码）",
    "E:\\.agents\\docs\\owner-decisions.md（“个人网站：冻结项目的原因和去留”节，第 1611–1625 行）",
    "E:\\.agents\\releases\\E187\\AGENTS.md（约法 L22–L24）、docs/contracts/agents.context-sources.md:29",
    "旧网站 V:\\Personal\\Projects\\wly0829.cn\\app\\content-cacb.js（6dee536）",
    "E:\\PCConfig\\registries\\task_purpose_catalog.json、tasks.json（无相关任务）"
   ]
  },
  "video_prompt": "5–8 秒无缝循环，白底、纯绿主色的水彩插画风，画面里不出现任何文字。从开头这屏右侧的插画出发：考场课桌上那叠试卷的最上面一页被微风轻轻掀起又落下；天平两端的两个小机器人轻轻上下晃，始终几乎一样高，谁也压不下谁；秒表的指针慢慢走半圈后停住；课桌上方小黑板上的绿色问号轻轻闪一下微光；几片绿叶从上方缓缓飘落，其中一片落在试卷上。最后回到起始画面接上循环。",
  "registry": {
   "groups": [
    {
     "id": "g-run",
     "name": "出题和作答"
    },
    {
     "id": "g-check",
     "name": "检查和评审"
    },
    {
     "id": "g-report",
     "name": "花费和报告"
    }
   ],
   "features": [
    {
     "id": "f-question-bank",
     "group": "g-run",
     "name": "题库",
     "what": "10 道真实的编程题连成一次作答；给答题的 AI 看公开材料，藏起来的变体只在检查时用；改题就算新一版",
     "how": "题库按版本定死，一次作答包含 C1–C10；每题 100 分分四块",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "V11 计划 :18、:58-61；CASE_CATALOG.md；旧网站 content-cacb.js:329（question-bank）"
    },
    {
     "id": "f-isolated-run",
     "group": "g-run",
     "name": "分开作答",
     "what": "每个组合一个空文件夹、同一份题；旧文件、别次的成功、中断后拼起来的半成品都不算；取消后还要确认真停了",
     "how": "根 AI 为每次作答复制冻结好的题目模板到独立文件夹，结束后收回评分",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :405（campaign-workspace）、:96；AGENTS.md:13-14"
    },
    {
     "id": "f-three-routes",
     "group": "g-run",
     "name": "三种接法",
     "what": "Codex 原生子代理、本机模型（经〔AI工具配置管理〕接进 Codex，显卡排队轮流用）、云端接口；一种失败不偷偷换另一种",
     "how": "同一份题和检查，三种接法各留自己的身份和结束记录",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "README.md:7；旧网站 :257-260、:447"
    },
    {
     "id": "f-orchestration",
     "group": "g-run",
     "name": "带帮手作答",
     "what": "一个主 AI 可以派 0–4 个子代理一起做，结果和单干分开算",
     "how": "编排组合在独立的顶层 Codex 任务里跑，记录真实的父子关系",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "V11 计划 :85-86、:104-106；旧网站 :514（native-orchestration）"
    },
    {
     "id": "f-external-handoff",
     "group": "g-run",
     "name": "外部工具交接",
     "what": "给 Antigravity、OpenCode 准备好文件夹和一段提示词，本人在界面里选模型、粘贴",
     "how": "首报准备 Antigravity 13 个、OpenCode 8 个文件夹；外部结果单列，不混进 Codex 主表",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "docs/EXTERNAL_MANUAL_HANDOFF.md；closeout.md:84"
    },
    {
     "id": "f-fast-add",
     "group": "g-run",
     "name": "快速加新模型",
     "what": "新出一个或一批模型，直接生成文件夹和提示词，不用先改整张计划表",
     "how": "fast_model_flow 的 prepare / prepare-batch；做完要过十题完成检查",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "README.md:60-73"
    },
    {
     "id": "f-identity",
     "group": "g-check",
     "name": "核实答题者",
     "what": "按 Codex 等工具自己留下的运行记录认定是谁在答、用的哪一档，不信模型自报",
     "how": "原生看父子任务记录，本机看任务和显卡占用，云端看请求记录",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :590（identity-evidence）、:196-197；README.md:11"
    },
    {
     "id": "f-verify",
     "group": "g-check",
     "name": "程序硬检查",
     "what": "在答题的 AI 之外重跑公开和藏起来的检查，查功能对不对、有没有越界、是不是真做完",
     "how": "检查程序独立运行、有硬超时；答题 AI 看不到藏起来的检查",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :709（deterministic-verification）、:212-213；README.md:21"
    },
    {
     "id": "f-blind-review",
     "group": "g-check",
     "name": "蒙眼评审",
     "what": "每份合格答卷交给一个全新的 Sol 最高档，按正确、覆盖、证据、稳健、安全与范围、清晰好维护六个方面打 1000 分；看不到是谁答的、别人的答卷和价格",
     "how": "一份答卷对应一个新评审任务；评审分和程序分两栏，不相加，也改不了程序检查的结果",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :802（blind-quality-review）、:216-221；README.md:71"
    },
    {
     "id": "f-failure-selection",
     "group": "g-check",
     "name": "失败归因和挑选",
     "what": "分清能力不够、题有毛病、环境坏了、证据缺了；样本不齐不排名，也不挑最好的一次",
     "how": "每组合只取事先定好的那一次有效答卷；Luna 最高档已有 3 次，取中间那次",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :911（failure-reporting）；V11 计划 :3-8、:27-28"
    },
    {
     "id": "f-quota-probe",
     "group": "g-report",
     "name": "额度探针",
     "what": "1 题短版、10 题完整版两段固定提示词：先跑，看界面上的额度，再发第二条删掉临时文件夹；不进成绩",
     "how": "任何 AI 都能用；第一条只在固定的临时文件夹里干活，第二条只删这个文件夹",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "README.md:53-58；config/probes/universal-quota-cost-*.md；旧网站 :552（quota-cost-probes）"
    },
    {
     "id": "f-reports",
     "group": "g-report",
     "name": "三份报告",
     "what": "模型证据卡（测的是谁、官方说法和价格）、实测报告（真做成了什么）、综合判断（该怎么选）；设计好了，完整报告一直没出",
     "how": "计划出 Markdown 和 PDF；首报收尾计划里这几项都没勾",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "旧网站 :270-272；closeout.md:108-109"
    },
    {
     "id": "f-routing-input",
     "group": "g-report",
     "name": "给选模型当参考",
     "what": "外部评测为主、自己测的为辅，大约七三开；只当参考，不自动改任何设置",
     "how": "结果本想交给全局选模型规则参考；缺评测的模型照样派活",
     "status": "已停用",
     "screen": "codex-agent-model-benchmark-04",
     "source": "README.md:91-92；ROUTING_DECISION_FRAMEWORK.md:9"
    }
   ],
   "numbers": [
    {
     "id": "n-comparable",
     "text": "0",
     "meaning": "能拿来选模型的完整比较（配置比较、分数或排名）",
     "as_of": "2026-08-31",
     "source": "旧网站 content-cacb.js:5、9（快照北京时间 8 月 31 日 12:13）",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-05"
     ]
    },
    {
     "id": "n-tokens",
     "text": "500 万–800 万 token",
     "meaning": "一个模型答完 10 题的整轮输入 token（5,058,339 / 5,522,407 / 8,024,765，报告没区分缓存命中）；用时 18m28s–24m44s",
     "as_of": "2026-08-13",
     "source": "reports/2026-08-13-v11r1-four-slot-calibration.md:18-20",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-02"
     ]
    },
    {
     "id": "n-slots",
     "text": "24 个",
     "meaning": "V11 计划要测的 Codex 组合（型号 × 思考档 × 单干或带帮手 × 接法）",
     "as_of": "2026-08-14",
     "source": "V11 计划“32 个正式槽位”节 :70-101",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-02",
      "codex-agent-model-benchmark-05"
     ]
    },
    {
     "id": "n-external",
     "text": "13 + 8 个",
     "meaning": "首报交接的外部组合：Antigravity 13、OpenCode 8（另加 GLM-5.3 一个；V11 计划本身的外部槽是 8 个 Antigravity）",
     "as_of": "2026-08-15",
     "source": "docs/EXTERNAL_MANUAL_HANDOFF.md 开头",
     "screens": [
      "codex-agent-model-benchmark-01"
     ]
    },
    {
     "id": "n-commits",
     "text": "65 次",
     "meaning": "仓库全部提交，北京时间 8 月 8 日到 8 月 31 日",
     "as_of": "2026-09-28",
     "source": "git rev-list --count HEAD；提交时间换算北京时间",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-05"
     ]
    },
    {
     "id": "n-external-done",
     "text": "Antigravity 13 份、OpenCode 11 份",
     "meaning": "首报收尾计划里已勾选“已执行”的外部答卷；OpenCode 11 份多于交接时的 8 个，是交接后陆续加的组合（另有补跑 4 份未计入）",
     "as_of": "2026-08-15",
     "source": "closeout.md:51、57（随提交 8a911fe 加入）",
     "screens": [
      "codex-agent-model-benchmark-05"
     ]
    },
    {
     "id": "n-cases",
     "text": "10 道题",
     "meaning": "V11 一次作答的题数，每题 100 分",
     "as_of": "2026-08-13",
     "source": "V11 计划 :18",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-02",
      "codex-agent-model-benchmark-03",
      "codex-agent-model-benchmark-04"
     ]
    },
    {
     "id": "n-planned-runs",
     "text": "72 次",
     "meaning": "24 个组合 × 每个 3 次有效答卷的原计划",
     "as_of": "2026-08-13",
     "source": "校准报告 :58“starts at 0/72”",
     "screens": [
      "codex-agent-model-benchmark-02"
     ]
    },
    {
     "id": "n-gap",
     "text": "9.375 分",
     "meaning": "同次试跑 Terra 比 Sol 高的分数（1000 分制），10 题里 8 题得分相同，C7 Sol 多 65.625、C8 Terra 多 75；Luna 724.375、本机 35B 130/800 明显低；这次试跑后来作废",
     "as_of": "2026-08-13",
     "source": "校准报告 :19-20、:31-33",
     "screens": [
      "codex-agent-model-benchmark-02"
     ]
    },
    {
     "id": "n-frozen-date",
     "text": "9 月 12 日",
     "meaning": "列入冻结名单（北京时间 20:37）",
     "as_of": "2026-09-12",
     "source": "E:\\.agents 提交 68a89c6；E187 agents.context-sources.md:29",
     "screens": [
      "codex-agent-model-benchmark-01",
      "codex-agent-model-benchmark-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-agents-routing",
     "with": "agents",
     "direction": "交出去（计划，没做成）",
     "flow": "评测结果本想作为全局选模型规则（按质量和价钱选型号）的参考证据，只当参考、不自动改；现在选模型靠基座里的可派模型清单",
     "source": "ROUTING_DECISION_FRAMEWORK.md:9 及 Joint snapshot 节；约法 L23；E:\\.agents\\config\\model-roster.json"
    },
    {
     "id": "r-aicli",
     "with": "ai-cli-profile-manager",
     "direction": "拿来",
     "flow": "本机 Qwen 模型经 AICLI 接进 Codex 答题，显卡由 LocalGpuBroker 排队",
     "source": "旧网站 content-cacb.js:259、:447；closeout.md“当前外部依赖”节"
    },
    {
     "id": "r-aa",
     "with": "Artificial Analysis",
     "direction": "外部服务",
     "flow": "开跑前冻结一份它的智力指数快照，作主排名和选模型的主要依据",
     "source": "README.md:91；AGENTS.md:23"
    },
    {
     "id": "r-codex",
     "with": "OpenAI Codex",
     "direction": "外部工具",
     "flow": "被测的运行框架：原生子代理、本机模型和云端接口都经 Codex 答题",
     "source": "README.md:5-7"
    },
    {
     "id": "r-antigravity",
     "with": "Google Antigravity",
     "direction": "外部工具",
     "flow": "本人在界面里选模型、粘贴提示词，答卷交回来用同一套检查打分",
     "source": "EXTERNAL_MANUAL_HANDOFF.md；closeout.md:51、84"
    },
    {
     "id": "r-opencode",
     "with": "OpenCode",
     "direction": "外部工具",
     "flow": "同上，8 个最高档组合（GLM、Kimi、Qwen、DeepSeek、Grok 等）",
     "source": "EXTERNAL_MANUAL_HANDOFF.md 开头"
    },
    {
     "id": "r-cloud-api",
     "with": "DeepSeek、通义千问云端接口",
     "direction": "外部服务",
     "flow": "云端接口组合经 Codex 调用；每次付费调用要单独核对授权",
     "source": "V11 计划 :97-99；旧网站 :260"
    },
    {
     "id": "r-github",
     "with": "GitHub",
     "direction": "外部服务",
     "flow": "私有仓库存题目规格、格式、检查程序和脱敏汇总；隐藏题、原始记录只留本机",
     "source": "README.md:75-77"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/projects/codex-agent-model-benchmark/#why-frozen",
     "screen": "codex-agent-model-benchmark-01",
     "text": "四条原因，逐条看"
    },
    {
     "target": "/rules/charter/#L23",
     "screen": "codex-agent-model-benchmark-01",
     "text": "约法 L23"
    },
    {
     "target": "/rules/charter/#L24",
     "screen": "codex-agent-model-benchmark-01",
     "text": "约法 L24"
    },
    {
     "target": "/rules/charter/#L22",
     "screen": "codex-agent-model-benchmark-01",
     "text": "约法 L22"
    },
    {
     "target": "/projects/ai-cli-profile-manager/",
     "screen": "codex-agent-model-benchmark-04",
     "text": "AI工具配置管理"
    }
   ],
   "live": [],
   "frozen_card": {
    "reason": "每测一次都要花不少 AI 额度，自己出的题也测不准谁更强；日常用下来，哪个好用反而一清二楚。",
    "now": "选哪个 AI，看厂商公布的成绩和权威评测机构的排名。"
   }
  },
  "notes": {
   "merged": [
    "底稿 8 项全部保留：问题库→题库；隔离执行→分开作答＋三种接法（旧网站把“三路线”和“独立 workspace”放在同一模块，这里拆成两项，因为接法本身是一项独立设计）；原生编排→带帮手作答；额度费用探针→额度探针；身份与证据→核实答题者；确定性验证→程序硬检查；Sol Max 盲审→蒙眼评审；失败与选择→失败归因和挑选。",
    "另从 README 和说明文档补了 4 项：外部工具交接、快速加新模型、三份报告、给选模型当参考。",
    "“本机显卡排队”（LocalGpuBroker）并进“三种接法”：只服务本机那一种接法。"
   ],
   "dropped": [
    "各模型的具体分数（试跑分、外部工具补充样本分、盲审分）不上：README 写明现有分数和名次不能当可靠结论；只保留“Terra 和 Sol 只差 9.375 分”这一处，用来说明分不出高下，并写明那次试跑已作废。",
    "旧网站的证据分层表、CI 细节、schema 数量、测试文件数、命令入口、名词表不上：项目已冻结，读者用不上；“8 月 31 日可采用比较是 0”一句概括了当时的状态。",
    "旧网站 QA 截图（docs/design/qa/cacb-*.png）不放：那是旧网页本身的截图，满屏术语，不是项目界面。",
    "“对齐 Artificial Analysis 估算值的区间和置信度”等细节不上：属于评分方法内部，冻结后没人会看。"
   ],
   "unsure": [
    "第 1 屏“为什么不用了”是本人原话翻成人话：“太费额度”对应“浪费额度”；“靠我自己出的题、自己判断答案，已经评不出它们的能力”对应“用户的问题和答案用户判断不足以评价模型能力”。请本人确认没改意思。",
    "第 2 屏每条原因下面的“项目记录里的事实”是 AI 补的旁证，不是本人说的理由，页面上已标明；第 4 条“每天在 Claude、Codex 里干活，一个模型靠不靠谱、常在哪里出错，看得见”是替本人口吻展开的句子，上线前请本人过目。",
    "替本人口吻写的句子（上线前请本人过目）：第 3 屏“我要做什么”三条（依据：旧网站 usageEntry、EXTERNAL_MANUAL_HANDOFF 里“用户 UI 选择”、config/probes 的两条消息用法）。",
    "“500 万–800 万 token”是校准报告里整轮输入 token，没区分缓存命中，实际扣的额度可能比这个数看起来小；四次试跑后来全部作废，数字只用来说明量级。",
    "“8 月 15 日自查出方法和评分有问题”写成“不是本人说的原因”：README 和提交 8a911fe 只写有已知问题、没列清是哪些；旧网站 8 月 31 日列了 8 题与 10 题规则冲突、CI 停在 lint，页面就写这两件。",
    "“8 月 14 日改成首份报告每个组合只取 1 次”是谁定的，文档只写“2026-08-14 首报决策”；只有“Luna 最高档取中位数”明确写了“按用户决定”，页面照此只在这一处写“按本人决定”。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/codex-agent-model-benchmark/page.json",
  "sha256": "502c1e6632cbb580b9992259097944b40b5f53831cc26929fd90f8ca7019d716",
  "converted_at_beijing": "2026-10-31T08:03:52+08:00"
 }
}
---

::screen{#codex-agent-model-benchmark-01 section="top"}

```typeset
{
 "screen": {
  "id": "codex-agent-model-benchmark-01",
  "section": "top",
  "title": "开头",
  "scene": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（厂商公布＋权威评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版 9:16，从上往下：大标题和“已冻结”标签；右侧那幅考场插画放到标题下面，占满宽度；介绍段；三张说明卡改成上下三张，每张一整行；四张数字卡改成两行两张；最下面一行小字和链接。字完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "四条原因，逐条看",
    "href": "/projects/codex-agent-model-benchmark/#why-frozen"
   },
   {
    "text": "约法 L24",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/codex-agent-model-benchmark/#ai-brief"
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
     "align": "left",
     "row": "intro",
     "width": "70%",
     "text_ref": "AI模型评测",
     "row_fit_illustration": true
    },
    {
     "type": "tag",
     "row": "intro",
     "text_ref": "已冻结"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "原名CACB（Codex智能体能力基准）。原来想用同一套真实的编程题，让不同的AI模型在Codex里各答"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "30%"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "为什么不用了"
    },
    {
     "type": "prose",
     "text_ref": "数字卡片（竖线前大字，竖线后小字）："
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "text_ref": "108月31日时，能拿来选模型的完整比较2500万–800万token：一个模型答完10道题的输入量（8",
     "variant": "paragraph_stats",
     "illustration": "top_inside",
     "icons": "auto",
     "expected_cards": 4,
     "historical": true
    },
    {
     "type": "prose",
     "text_ref": "冻结的项目，AI不主动看、不维护：约法L24"
    },
    {
     "type": "action_button",
     "text_ref": "复制AI续作说明"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（厂商公布＋权威评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。 页修复 07（北京时间 2026-10-03）：按 qa-07 第1、2条把原四项改由数字卡承接，保留原编号、数字及完整说明；电脑介绍卡改一列左图右文，手机原一列不变。定稿“数字卡片……”引导句未删，另请 main/Claude 裁定。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "AI模型评测"
    },
    {
     "type": "tag",
     "text_ref": "已冻结"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "原名CACB（Codex智能体能力基准）。原来想用同一套真实的编程题，让不同的AI模型在Codex里各答"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "为什么不用了"
    },
    {
     "type": "prose",
     "text_ref": "数字卡片（竖线前大字，竖线后小字）："
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "text_ref": "108月31日时，能拿来选模型的完整比较2500万–800万token：一个模型答完10道题的输入量（8",
     "variant": "paragraph_stats",
     "illustration": "top_inside",
     "icons": "auto",
     "expected_cards": 4,
     "historical": true
    },
    {
     "type": "prose",
     "text_ref": "冻结的项目，AI不主动看、不维护：约法L24"
    },
    {
     "type": "action_button",
     "text_ref": "复制AI续作说明"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版 9:16，从上往下：大标题和“已冻结”标签；右侧那幅考场插画放到标题下面，占满宽度；介绍段；三张说明卡改成上下三张，每张一整行；四张数字卡改成两行两张；最下面一行小字和链接。字完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。 页修复 07（北京时间 2026-10-03）：按 qa-07 第1、2条把原四项改由数字卡承接，保留原编号、数字及完整说明；电脑介绍卡改一列左图右文，手机原一列不变。定稿“数字卡片……”引导句未删，另请 main/Claude 裁定。",
   "portrait_required": true,
   "aspect": "9:16"
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
   "asset": "_library/icons/late-r3-benchmark-moneybag.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-moneybag",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "fb791f4d0e02dfe080cfe0f7f9f0e5a00cc781168d00674262db5f0aee96db87",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-person-magazine.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-person-magazine",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "230eea9613b200d2f3cf8f8f885431f9e231494c83a14d6e714f073f3b4950db",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-dusty-locked-cabinet.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-dusty-locked-cabinet",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "b99b0c123234cfbef5764b2ef3016d5c9cc47c9b67bf68dd238782d4bf535165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-empty-trophy.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-empty-trophy",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "e1f90ad8a704397bed417a3403705470d542bde1485afc99b01e1cbaf11e3c61",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-bills-to-token.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-bills-to-token",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "acdcad466766ce05a3a478d1550ddf0c91e59dfcb6ab771d0e988537e96fc100",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-exact24-cells.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-exact24-cells",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "01e54af1e710e409e59aa8a47d9c119a800dbc04122b6f1c90de1c93866c6eba",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-benchmark-commit-dots.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-benchmark-commit-dots",
   "source_phrase": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“AI 模型评测”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一个漏了一角、往外撒硬币的钱袋（额度）；第二张一个人坐在电脑前、屏幕上是聊天窗口，旁边摊着一本打开的杂志（平时用着看＋外面的评测）；第三张一个上了锁、落了薄灰的木质档案柜。每张卡第一行粗体小标题（为什么不用了／现在靠什么判断模型／停到什么程度），下面几行正文。右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。画面下部一排四张数字卡片（上面小插画：空奖杯、一叠纸币变成的 token 小方块、一排 24 个小格子、一串提交小圆点；大号绿色数字，下面一行小字），数字卡整体偏灰淡，表示是历史数字。最下面一行小字和链接。仓库私有，不放 GitHub 按钮；不画“现在”横条（没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "sha256": "1fe7b25c69359ea9d796e7e8372033aab8bbca7be6805e1d4dcde6babd5be06d",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-codex-agent-model-benchmark.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-codex-agent-model-benchmark",
   "source_phrase": "右侧约 45%：一幅水彩插画：一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶。",
   "sha256": "ad355788cbe119f122499a31ce8b00bdd2e7aa120623a0c00aa5d06a5aa4a61d",
   "status": "ready",
   "original_elements": [
    "一张考场课桌，桌上摊着一叠试卷（卷面只画横线，不写字），旁边一只秒表和一架天平，天平两端的托盘上各坐一个圆润的小机器人，两端几乎一样高；课桌上方挂着一块小黑板，黑板上画一个大大的绿色问号；整幅画偏灰淡，一角垂下一片落叶"
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
   "asset": "codex-agent-model-benchmark/codex-agent-model-benchmark-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\codex-agent-model-benchmark\\img\\codex-agent-model-benchmark-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2c900536ca10747e3499",
   "title_text": "AI 模型评测",
   "sha256": "28b9d25dabbc7d938a7f457e091f6a1974035daea6b25ef9a6ca52d42a50c05b",
   "status": "ready",
   "source_box": [
    42,
    74,
    584,
    232
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# AI 模型评测

已冻结

原名 CACB（Codex 智能体能力基准）。原来想用同一套真实的编程题，让不同的 AI 模型在 Codex 里各答一遍，由程序查清它们真正做成了什么，再给选模型当参考。8 月 8 日开工，8 月 31 日最后一次提交，完整的比较报告一直没出。

**为什么不用了**
每测一次都要花不少 AI 额度，自己出的题也测不准谁更强；日常用下来，哪个好用反而一清二楚。9 月 12 日冻结。〔四条原因，逐条看〕

**现在靠什么判断模型**
选哪个 AI，看厂商公布的成绩和权威评测机构的排名。

**停到什么程度**
私有仓库原样留着，没有计划任务要停。

数字卡片（竖线前大字，竖线后小字）：
1. 0｜8 月 31 日时，能拿来选模型的完整比较
2. 500 万–800 万｜token：一个模型答完 10 道题的输入量（8 月 13 日三次试跑）
3. 24 个｜计划要测的 Codex 组合（哪个模型、思考多深、单干还是带帮手）；外部工具交接时另备 Antigravity 13 个、OpenCode 8 个，后来又陆续加
4. 65 次｜提交，8 月 8 日到 31 日

冻结的项目，AI 不主动看、不维护：〔约法 L24〕

〔复制 AI 续作说明〕

::screen{#codex-agent-model-benchmark-02 section="why-frozen"}

```typeset
{
 "screen": {
  "id": "codex-agent-model-benchmark-02",
  "section": "why-frozen",
  "title": "四条原因",
  "scene": "横版 16:9。左上标题，标题下一行导语。中间 2 列 × 2 行四张圆角卡片，每张：左上一个小水彩图标，粗体标题一行，下面三四行正文用浅灰绿小字（表示是项目记录里的事实）。四个图标依次：1 一个沙漏旁边堆着一摞硬币；2 一本打开的杂志，封面画几根柱状图；3 一架天平，两端几乎一样高；4 一个人坐在电脑前，屏幕上是聊天气泡，旁边一个小对勾。卡片下面一块浅灰底的小字区（“还有一件事”那段），占满宽度。",
  "portrait": "竖版 9:16：标题、导语在上；四张卡片改成一列，每张一整行（图标在左、字在右）；最下面“还有一件事”一段。字完全一样。",
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
     "size": "medium",
     "text_ref": "四条原因"
    },
    {
     "type": "prose",
     "text_ref": "本人9月28日说明的原因，翻成人话是下面四条。每条下面的浅色小字，是这个项目自己的记录里看得到的事实（A"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "row": "reasons-0",
     "width": "50%",
     "text_ref": "1太费额度"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "row": "reasons-0",
     "width": "50%",
     "text_ref": "2外面已经有评测"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "row": "reasons-1",
     "width": "50%",
     "text_ref": "3自己出的题评不出能力"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "row": "reasons-1",
     "width": "50%",
     "text_ref": "4平时用着就看得出来"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "还有一件事，不是本人说的原因：8月15日它自查出方法和评分有问题，仓库改成私有，留下的分数不作结论；到8"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版 16:9。左上标题，标题下一行导语。中间 2 列 × 2 行四张圆角卡片，每张：左上一个小水彩图标，粗体标题一行，下面三四行正文用浅灰绿小字（表示是项目记录里的事实）。四个图标依次：1 一个沙漏旁边堆着一摞硬币；2 一本打开的杂志，封面画几根柱状图；3 一架天平，两端几乎一样高；4 一个人坐在电脑前，屏幕上是聊天气泡，旁边一个小对勾。卡片下面一块浅灰底的小字区（“还有一件事”那段），占满宽度。",
   "portrait_required": true,
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "四条原因"
    },
    {
     "type": "prose",
     "text_ref": "本人9月28日说明的原因，翻成人话是下面四条。每条下面的浅色小字，是这个项目自己的记录里看得到的事实（A"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "1太费额度"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "2外面已经有评测"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "3自己出的题评不出能力"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "4平时用着就看得出来"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "还有一件事，不是本人说的原因：8月15日它自查出方法和评分有问题，仓库改成私有，留下的分数不作结论；到8"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版 9:16：标题、导语在上；四张卡片改成一列，每张一整行（图标在左、字在右）；最下面“还有一件事”一段。字完全一样。",
   "portrait_required": true,
   "aspect": "9:16"
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "太费额度",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "外面已经有评测",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "自己出的题评不出能力",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "平时用着就看得出来",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/codex-agent-model-benchmark-02-brush-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\codex-agent-model-benchmark\\img\\codex-agent-model-benchmark-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ff6ec75b77a814d4e278",
   "title_text": "四条原因",
   "sha256": "be9bab04df759cb63c45eb233e62b94aabfb8b774d9a2d1cf00b2adb9d5d07b8",
   "status": "ready",
   "source_box": [
    47,
    51,
    427,
    160
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 四条原因

本人 9 月 28 日说明的原因，翻成人话是下面四条。每条下面的浅色小字，是这个项目自己的记录里看得到的事实（AI 补的，不是本人的话）。

1. **太费额度**
一个模型把 10 道题连着答完，输入就是 500 万–800 万 token、用时 18–25 分钟（8 月 13 日三个型号各试跑一次，都开最高档）。原计划 24 个组合各答 3 次，一共 72 次；每份合格答卷还要另开一个最高档的模型来评。

2. **外面已经有评测**
项目自己的设计就把外部公开评测放在第一位：排名以外部评测为准，自己测的两栏分数只并列摆着、不参加排名；按质量和价钱挑模型时，也是外部评测占大头、自己测的只当小修正（大约七三开，是判断的轻重，不是公式）。

3. **自己出的题评不出能力**
8 月 13 日试跑，自己出的 10 道题拉不开最强几个模型的差距，题目区分不出它们（这次试跑后来作废，分数不作结论）。项目规则也写着：大家都满分或都不及格时，只能报“分不出”，不硬造差距。

4. **平时用着就看得出来**
每天在 Claude、Codex 里干活，一个模型靠不靠谱、常在哪里出错，看得见。项目自己也写明：没测过的模型照样正常派活，没评测不算零分。

还有一件事，不是本人说的原因：8 月 15 日它自查出方法和评分有问题，仓库改成私有，留下的分数不作结论；到 8 月 31 日，10 道题的新规则和几份文件里 8 道题的旧规则还没统一，自动检查也卡在代码格式检查那一步。

::screen{#codex-agent-model-benchmark-03 section="usage"}

```typeset
{
 "screen": {
  "id": "codex-agent-model-benchmark-03",
  "section": "usage",
  "title": "当初想解决什么、怎么用",
  "scene": "横版 16:9。左上标题，下面“想解决什么”一段。上半部一条从左到右的水彩流程图，五个节点用粗绿色箭头连起来：①一叠用夹子夹好、贴了封条的试卷 → ②三张并排的小课桌，各坐一个小机器人（桌上分别是 Codex 标志、一块显卡、一朵云）→ ③一台小机器吐出一张打了勾叉的成绩条 → ④一个蒙着眼罩的评审小人拿着放大镜看一份答卷 → ⑤两张并排的成绩单，中间画一个大大的“≠”号不相加。每个节点下面：粗体节点名一行，小字一两行。下半部左边一张“我要做什么”卡（三行带小勾选框的清单）；右边画成一本摊开的点名册：左页竖着列 10 道题（C1…C10 和题名，照下面的字写），右页底部一条横着的分数条，分成 50、25、15、10 四段，颜色由深绿到浅绿，每段下面写名字。整屏偏灰淡一点。",
  "portrait": "竖版 9:16：标题和“想解决什么”；流程图改成从上到下五个节点，箭头朝下，节点名和小字在图标右边；“我要做什么”卡一整行；点名册改成一列 10 行，下面是分数条。字完全一样。",
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
     "size": "medium",
     "text_ref": "当初想解决什么、怎么用"
    },
    {
     "type": "prose",
     "text_ref": "想解决什么"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "row": "balanced-pair-1",
     "width": "50%",
     "text_ref": "1定题"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "row": "balanced-pair-1",
     "width": "50%",
     "text_ref": "2分开作答"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "row": "balanced-pair-2",
     "width": "50%",
     "text_ref": "3程序检查"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "row": "balanced-pair-2",
     "width": "50%",
     "text_ref": "4蒙眼评审"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "5出报告"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "row": "details",
     "width": "40%",
     "text_ref": "我要做什么"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "row": "details",
     "width": "60%",
     "text_ref": "10道题"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版 16:9。左上标题，下面“想解决什么”一段。上半部一条从左到右的水彩流程图，五个节点用粗绿色箭头连起来：①一叠用夹子夹好、贴了封条的试卷 → ②三张并排的小课桌，各坐一个小机器人（桌上分别是 Codex 标志、一块显卡、一朵云）→ ③一台小机器吐出一张打了勾叉的成绩条 → ④一个蒙着眼罩的评审小人拿着放大镜看一份答卷 → ⑤两张并排的成绩单，中间画一个大大的“≠”号不相加。每个节点下面：粗体节点名一行，小字一两行。下半部左边一张“我要做什么”卡（三行带小勾选框的清单）；右边画成一本摊开的点名册：左页竖着列 10 道题（C1…C10 和题名，照下面的字写），右页底部一条横着的分数条，分成 50、25、15、10 四段，颜色由深绿到浅绿，每段下面写名字。整屏偏灰淡一点。 页修复 07（北京时间 2026-10-03）：按 qa-07 第4条把章节标题改 medium；现标题图对档位的实际支持交 main，待统一出图。",
   "portrait_required": true,
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "当初想解决什么、怎么用"
    },
    {
     "type": "prose",
     "text_ref": "想解决什么"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "1定题"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "2分开作答"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "3程序检查"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "4蒙眼评审"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "connector": "arrow",
     "text_ref": "5出报告"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "我要做什么"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "text_ref": "10道题"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版 9:16：标题和“想解决什么”；流程图改成从上到下五个节点，箭头朝下，节点名和小字在图标右边；“我要做什么”卡一整行；点名册改成一列 10 行，下面是分数条。字完全一样。 页修复 07（北京时间 2026-10-03）：按 qa-07 第4条把章节标题改 medium；现标题图对档位的实际支持交 main，待统一出图。",
   "portrait_required": true,
   "aspect": "9:16"
  }
 },
 "images": [
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-dee7d8d741cbf8bc4f55.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-dee7d8d741cbf8bc4f55",
   "title_text": "当初想解决什么、怎么用",
   "sha256": "42d7bf08ebd1843e296bb8267c2305622af91724ca588ef557b4fda2d2815e59",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 当初想解决什么、怎么用

**想解决什么**
AI 说“修好了”，可能只留下一段回答或半成品；界面上写着某个模型，实际跑的也可能是别的。想用同一套真实的编程题、各自隔开的文件夹和真正交出来的文件，查清“这个模型 + Codex”到底能干成什么，给选模型当参考。

1. **定题**
10 道题连成一次作答；题目和藏起来的检查先定死，开跑后不改
2. **分开作答**
每个组合一个空文件夹、同一份题；Codex 原生子代理、本机模型、云端接口三种接法
3. **程序检查**
在答题的 AI 之外重跑检查，每题 100 分
4. **蒙眼评审**
合格的答卷交给全新的 GPT-5.6 Sol（max 档），不告诉它是谁答的
5. **出报告**
程序分和评审分两栏并列、不相加；主排名看外部评测

**我要做什么**
- 在负责它的 Codex 对话里说想测哪些模型
- Antigravity 和 OpenCode 那几组：自己在界面里选好模型，粘贴 AI 写好的提示词
- 想看一次任务花多少额度：先发一段固定的测额度提示词（1 题或 10 题版，叫“额度探针”），看界面上的额度，再发第二条删掉临时文件夹

**10 道题**
C1 跨几个仓库加功能｜C2 不联网排查终端报错｜C3 重启后状态不丢｜C4 数据格式升级不坏旧数据｜C5 只读回答架构问题（可联网）｜C6 授权判断｜C7 模型换代和选路（可联网）｜C8 长任务接着做｜C9 并发、重试、崩溃恢复｜C10 边读边算和缓存失效

**每题 100 分**：基本功能 50（不过就是 0）｜藏起来的变体 25｜做完和中断后接上 15｜用工具和留证据的规矩 10

::screen{#codex-agent-model-benchmark-04 section="features"}

```typeset
{
 "screen": {
  "id": "codex-agent-model-benchmark-04",
  "section": "features",
  "title": "全部旧功能",
  "scene": "横版 16:9，和其他项目页“全部功能”同一种画法，但整屏色调偏灰淡，表示都已停用。左上标题，标题右边图例（只有一种：灰色叉“已停用”）。三组功能从上往下排；每组的组名用毛笔字写在这一组卡片上方的一行（不单独占一整列）；卡片三列排：每张卡左边一个灰调小水彩图标，粗体功能名，下面一两行说明，右上角一个灰色叉。图标：题库画一叠贴了封条的试卷，分开作答画三张隔开的小课桌，三种接法画 Codex 标志、一块显卡和一朵云，带帮手作答画一个大机器人牵着几个小机器人，外部工具交接画一只手把一张纸条递进窗口，快速加新模型画一个带加号的文件夹，核实答题者画一张带照片的小工牌，程序硬检查画一台吐出勾叉纸条的小机器，蒙眼评审画一个蒙着眼罩拿放大镜的小人，失败归因和挑选画一个分成四格的收纳盒，额度探针画一支插进硬币堆的温度计，三份报告画三份叠放的文件，给选模型当参考画一架一边重一边轻的天平。",
  "portrait": "竖版 9:16：标题和图例在上；每组组名一行，下面卡片改成一行一张（图标在左、字在右、叉在右上）；三组依次往下。字完全一样。",
  "links": [
   {
    "text": "AI工具配置管理",
    "href": "/projects/ai-cli-profile-manager/"
   }
  ],
  "anchors": [
   {
    "id": "g-run",
    "text": "出题和作答"
   },
   {
    "id": "f-question-bank",
    "text": "题库"
   },
   {
    "id": "f-isolated-run",
    "text": "分开作答"
   },
   {
    "id": "f-three-routes",
    "text": "三种接法"
   },
   {
    "id": "f-orchestration",
    "text": "带帮手作答"
   },
   {
    "id": "f-external-handoff",
    "text": "外部工具交接"
   },
   {
    "id": "f-fast-add",
    "text": "快速加新模型"
   },
   {
    "id": "g-check",
    "text": "检查和评审"
   },
   {
    "id": "f-identity",
    "text": "核实答题者"
   },
   {
    "id": "f-verify",
    "text": "程序硬检查"
   },
   {
    "id": "f-blind-review",
    "text": "蒙眼评审"
   },
   {
    "id": "f-failure-selection",
    "text": "失败归因和挑选"
   },
   {
    "id": "g-report",
    "text": "花费和报告"
   },
   {
    "id": "f-quota-probe",
    "text": "额度探针"
   },
   {
    "id": "f-reports",
    "text": "三份报告"
   },
   {
    "id": "f-routing-input",
    "text": "给选模型当参考"
   }
  ],
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
     "size": "large",
     "text_ref": "全部旧功能（13项，全部已停用）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：✕已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "出题和作答"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "检查和评审"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "花费和报告"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版 16:9，和其他项目页“全部功能”同一种画法，但整屏色调偏灰淡，表示都已停用。左上标题，标题右边图例（只有一种：灰色叉“已停用”）。三组功能从上往下排；每组的组名用毛笔字写在这一组卡片上方的一行（不单独占一整列）；卡片三列排：每张卡左边一个灰调小水彩图标，粗体功能名，下面一两行说明，右上角一个灰色叉。图标：题库画一叠贴了封条的试卷，分开作答画三张隔开的小课桌，三种接法画 Codex 标志、一块显卡和一朵云，带帮手作答画一个大机器人牵着几个小机器人，外部工具交接画一只手把一张纸条递进窗口，快速加新模型画一个带加号的文件夹，核实答题者画一张带照片的小工牌，程序硬检查画一台吐出勾叉纸条的小机器，蒙眼评审画一个蒙着眼罩拿放大镜的小人，失败归因和挑选画一个分成四格的收纳盒，额度探针画一支插进硬币堆的温度计，三份报告画三份叠放的文件，给选模型当参考画一架一边重一边轻的天平。",
   "portrait_required": true,
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部旧功能（13项，全部已停用）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：✕已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "出题和作答"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "检查和评审"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "花费和报告"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版 9:16：标题和图例在上；每组组名一行，下面卡片改成一行一张（图标在左、字在右、叉在右上）；三组依次往下。字完全一样。",
   "portrait_required": true,
   "aspect": "9:16"
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "题库：10 道真实的编程题连成一次作答；给答题的 AI 看公开材料，藏起来的变体只在检查时用；改题就算新一版 ✕",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "分开作答：每个组合一个空文件夹、同一份题；旧文件、别次的成功、中断后拼起来的半成品都不算；取消后还要确认真停了 ✕",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "三种接法：Codex 原生子代理、本机模型（经〔AI工具配置管理〕接进 Codex，显卡排队轮流用）、云端接口；一种失败不偷偷换另一种 ✕",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "带帮手作答：一个主 AI 可以派 0–4 个子代理一起做，结果和单干分开算 ✕",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "外部工具交接：给 Antigravity、OpenCode 准备好文件夹和一段提示词，本人在界面里选模型、粘贴 ✕",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "快速加新模型：新出一个或一批模型，直接生成文件夹和提示词，不用先改整张计划表 ✕",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "齿轮",
   "source_phrase": "核实答题者：按 Codex 等工具自己留下的运行记录认定是谁在答、用的哪一档，不信模型自报 ✕",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "程序硬检查：在答题的 AI 之外重跑公开和藏起来的检查，查功能对不对、有没有越界、是不是真做完 ✕",
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "蒙眼评审：每份合格答卷交给一个全新的 Sol 最高档，按正确、覆盖、证据、稳健、安全与范围、清晰好维护六个方面打 1000 分；看不到是谁答的、别人的答卷和价格 ✕",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "失败归因和挑选：分清能力不够、题有毛病、环境坏了、证据缺了；样本不齐不排名，也不挑最好的一次 ✕",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "额度探针：1 题短版、10 题完整版两段固定提示词：先跑，看界面上的额度，再发第二条删掉临时文件夹；不进成绩 ✕",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
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
   "source_phrase": "三份报告：模型证据卡（测的是谁、官方说法和价格）、实测报告（真做成了什么）、综合判断（该怎么选）；设计好了，完整报告一直没出 ✕",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "给选模型当参考：外部评测为主、自己测的为辅，大约七三开；只当参考，不自动改任何设置 ✕",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-5c09777313d2010e01d4.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\codex-agent-model-benchmark\\img\\codex-agent-model-benchmark-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-5c09777313d2010e01d4",
   "title_text": "全部旧功能（13 项，全部已停用）",
   "sha256": "b320e7cb81f27df9282466b1670fbb371c6aad5b54e24e6f877fe0f1f08ddb17",
   "status": "ready",
   "source_box": [
    106,
    18,
    1008,
    178
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部旧功能（13 项，全部已停用）

图例：✕ 已停用

**出题和作答**
- **题库**：10 道真实的编程题连成一次作答；给答题的 AI 看公开材料，藏起来的变体只在检查时用；改题就算新一版 ✕
- **分开作答**：每个组合一个空文件夹、同一份题；旧文件、别次的成功、中断后拼起来的半成品都不算；取消后还要确认真停了 ✕
- **三种接法**：Codex 原生子代理、本机模型（经〔AI工具配置管理〕接进 Codex，显卡排队轮流用）、云端接口；一种失败不偷偷换另一种 ✕
- **带帮手作答**：一个主 AI 可以派 0–4 个子代理一起做，结果和单干分开算 ✕
- **外部工具交接**：给 Antigravity、OpenCode 准备好文件夹和一段提示词，本人在界面里选模型、粘贴 ✕
- **快速加新模型**：新出一个或一批模型，直接生成文件夹和提示词，不用先改整张计划表 ✕

**检查和评审**
- **核实答题者**：按 Codex 等工具自己留下的运行记录认定是谁在答、用的哪一档，不信模型自报 ✕
- **程序硬检查**：在答题的 AI 之外重跑公开和藏起来的检查，查功能对不对、有没有越界、是不是真做完 ✕
- **蒙眼评审**：每份合格答卷交给一个全新的 Sol 最高档，按正确、覆盖、证据、稳健、安全与范围、清晰好维护六个方面打 1000 分；看不到是谁答的、别人的答卷和价格 ✕
- **失败归因和挑选**：分清能力不够、题有毛病、环境坏了、证据缺了；样本不齐不排名，也不挑最好的一次 ✕

**花费和报告**
- **额度探针**：1 题短版、10 题完整版两段固定提示词：先跑，看界面上的额度，再发第二条删掉临时文件夹；不进成绩 ✕
- **三份报告**：模型证据卡（测的是谁、官方说法和价格）、实测报告（真做成了什么）、综合判断（该怎么选）；设计好了，完整报告一直没出 ✕
- **给选模型当参考**：外部评测为主、自己测的为辅，大约七三开；只当参考，不自动改任何设置 ✕

::screen{#codex-agent-model-benchmark-05 section="history"}

```typeset
{
 "screen": {
  "id": "codex-agent-model-benchmark-05",
  "section": "history",
  "title": "演进",
  "scene": "横版 16:9。左上标题。中间一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，9 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤；8 月 11 日到 15 日那一段小旗挨得最密。越往右丝带颜色越淡、越偏灰。最右端丝带的尽头画那张考场课桌：试卷收成一叠、用绳子捆好，天平收起来靠在桌边，桌面落了几片叶子。",
  "portrait": "竖版 9:16：标题；时间轴改成从上到下一条竖丝带，9 个小旗依次往下，日期在左、小字在右；最下面是收起来的课桌。字完全一样。",
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
     "size": "large",
     "text_ref": "演进（8月8日—9月28日，65次提交）"
    },
    {
     "type": "timeline",
     "direction": "horizontal",
     "columns": 5,
     "connector": "ribbon",
     "illustration": "outside",
     "text_ref": "8月8日：第一版：让Codex原生子代理答题，并记下到底是谁在答8月11日：一天16次提交：撤掉自制的选",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/禁止文件.png",
      "_library/icons/禁止文件.png"
     ]
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "size": "banner"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版 16:9。左上标题。中间一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，9 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤；8 月 11 日到 15 日那一段小旗挨得最密。越往右丝带颜色越淡、越偏灰。最右端丝带的尽头画那张考场课桌：试卷收成一叠、用绳子捆好，天平收起来靠在桌边，桌面落了几片叶子。",
   "portrait_required": true,
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进（8月8日—9月28日，65次提交）"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 5,
     "connector": "ribbon",
     "illustration": "outside",
     "text_ref": "8月8日：第一版：让Codex原生子代理答题，并记下到底是谁在答8月11日：一天16次提交：撤掉自制的选",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/禁止文件.png",
      "_library/icons/禁止文件.png"
     ]
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "size": "banner"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版 9:16：标题；时间轴改成从上到下一条竖丝带，9 个小旗依次往下，日期在左、小字在右；最下面是收起来的课桌。字完全一样。",
   "portrait_required": true,
   "aspect": "9:16"
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 8 日 ：第一版：让 Codex 原生子代理答题，并记下到底是谁在答",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 11 日 ：一天 16 次提交：撤掉自制的选模型路由，派子代理时直接指定模型和思考档；题库试跑关、留证据和打分的规则定下来",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 12 日 ：八道题的第 10 版定稿",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 13 日 ：第 11 版加两道新题成 10 道；GPT-5.6 的 Luna、Terra、Sol 和本机 Qwen 35B 四次试跑；计划从 13 个组合扩到 24 个；本人要求每个组合拿满 3 次有效答卷，四次试跑作废、全部重来",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 14 日 ：第一份正式答卷；改成首份报告每个组合只取 1 次（Luna 最高档已有 3 次，按本人决定取中间那次）；备好 Antigravity、OpenCode 的交接文件",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件柜",
   "source_phrase": "8 月 15 日 ：外部工具的答卷跑完打了分（Antigravity 13 份；OpenCode 交接后陆续加组合，跑了 11 份）；同一天自查出方法和评分有问题，仓库改成私有",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 31 日 ：最后一次提交；旧网站当天写：能拿来选模型的完整比较是 0",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "禁止文件",
   "source_phrase": "9 月 12 日 ：本人决定冻结",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "禁止文件",
   "source_phrase": "9 月 28 日 ：本人说明冻结原因",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-codex-agent-model-benchmark.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-codex-agent-model-benchmark",
   "source_phrase": "横版 16:9。左上标题。中间一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，9 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤；8 月 11 日到 15 日那一段小旗挨得最密。越往右丝带颜色越淡、越偏灰。最右端丝带的尽头画那张考场课桌：试卷收成一叠、用绳子捆好，天平收起来靠在桌边，桌面落了几片叶子。",
   "sha256": "ad355788cbe119f122499a31ce8b00bdd2e7aa120623a0c00aa5d06a5aa4a61d",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-57b17d1faa87e497d25a-c49268cd99ff.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-57b17d1faa87e497d25a",
   "title_text": "演进（8 月 8 日—9 月 28 日，65 次提交）",
   "sha256": "885cf758740fe6c766aaa22bb1bb4219ea3d85f59bad3f3fcc6dc5d2458b0450",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 演进（8 月 8 日—9 月 28 日，65 次提交）

- **8 月 8 日**：第一版：让 Codex 原生子代理答题，并记下到底是谁在答
- **8 月 11 日**：一天 16 次提交：撤掉自制的选模型路由，派子代理时直接指定模型和思考档；题库试跑关、留证据和打分的规则定下来
- **8 月 12 日**：八道题的第 10 版定稿
- **8 月 13 日**：第 11 版加两道新题成 10 道；GPT-5.6 的 Luna、Terra、Sol 和本机 Qwen 35B 四次试跑；计划从 13 个组合扩到 24 个；本人要求每个组合拿满 3 次有效答卷，四次试跑作废、全部重来
- **8 月 14 日**：第一份正式答卷；改成首份报告每个组合只取 1 次（Luna 最高档已有 3 次，按本人决定取中间那次）；备好 Antigravity、OpenCode 的交接文件
- **8 月 15 日**：外部工具的答卷跑完打了分（Antigravity 13 份；OpenCode 交接后陆续加组合，跑了 11 份）；同一天自查出方法和评分有问题，仓库改成私有
- **8 月 31 日**：最后一次提交；旧网站当天写：能拿来选模型的完整比较是 0
- **9 月 12 日**：本人决定冻结
- **9 月 28 日**：本人说明冻结原因
