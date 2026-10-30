---
{
 "title": "Claude 适配",
 "kind": "rule-topic",
 "url": "/rules/claude-adapter/",
 "tagline": "只对 Claude 桌面版有用的身份、派活和接线规矩。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "points",
   "label": "要点"
  },
  {
   "id": "original",
   "label": "原文"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "rule-claude-adapter",
  "kind": "rule-topic",
  "title": "Claude 适配",
  "url": "/rules/claude-adapter/",
  "tagline": "只对 Claude 桌面版有用的身份、派活和接线规矩。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E330",
   "commit": "94918eaac0162fe12bec169ed84fdf84a46a95c7",
   "ruleset_sha256": "de4d19a0a420353675970b199668fb809a618b180468773ce75d769635f9701d",
   "activated_at": "2026-10-31T07:00:38.527815+08:00",
   "file": "sources/rules/docs/contracts/agents.claude-adapter.md",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：Claude 橙色星芒小窗口轻轻亮一下，一颗小绿光点顺着垂下的绿色细绳经过三个小木块，落到底部的铜牌上，铜牌微微一闪；右边五级木台阶从 low 到 max 依次泛起一层浅绿光；台阶顶上的小木桥上走过一张小任务卡，被右边胸前是 OpenAI 黑色花结的小机器人接住；左下角木钩上的便签轻轻摆动；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "原文屏里留作快照的文字依据的规则版本（拼页时原文按当时生效的版本现读，版本由拼页程序标出）",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=5f9484ea0f6ee56c380e6c1a09c82142f3658d46b8ff6eb39107240d44ac8690",
     "screens": [
      "rule-claude-adapter-11"
     ]
    },
    {
     "id": "n-claude-callback-port",
     "text": "副机上登记给 Claude 的客户端叫 claude-main-desktop，回调端口 33418（9 月 28 日核对）",
     "meaning": "本机 Claude 的用户级 MCP 配置里，连副机电脑 MCP 用的客户端名和固定回调端口（原文“独立的 Claude 客户端和固定回调端口”的实例）",
     "as_of": "2026-09-28",
     "source": "C:\\Users\\10979\\.claude.json 的 mcpServers.secondary_laptop.oauth：clientId=claude-main-desktop、callbackPort=33418（北京时间 9 月 28 日读）",
     "screens": [
      "rule-claude-adapter-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Claude 桌面版和它派出的子代理用到 Claude 特有机制时，从活动版本读它。Hook 安装脚本、GPT 包装器、档位子代理定义也都在这个仓库。",
     "source": "Inspect 返回的 required_rule_paths.claude_adapter_contract；E:\\.agents\\tools\\Invoke-ClaudeRootHooks.ps1、Invoke-ClaudeGptChild.ps1、templates\\claude-home\\agents\\ 均存在"
    },
    {
     "id": "r-password-center-identity",
     "with": "password-center",
     "direction": "被核验",
     "flow": "密码中心的 SecretBroker 沿真实父进程链把 Claude 桌面版和它的后代认作 claude-root；无限制授权窗口由已安装的 C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-OwnerTakeover.ps1 打开，Hook 读回授权。",
     "source": "原文第 9、79–81 行；E:\\.agents\\tools\\claude_root_runtime.py 第 125 行 OWNER_TAKEOVER_ENTRY"
    },
    {
     "id": "r-pcconfig-google",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "Claude 的 Gmail 和 Drive 工具走 PCConfig 的本地入口 E:\\PCConfig\\tools\\Start-GoogleWorkspaceReadMcp.ps1（stdio，绑定 google-workspace.primary），不用 claude.ai 的云连接器。",
     "source": "原文第 63 行；C:\\Users\\10979\\.claude.json 的 mcpServers.google-workspace"
    },
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "拿来",
     "flow": "Claude 通过副机登记的独立客户端（claude-main-desktop，固定回调端口）连副机的电脑 MCP；凭据用 PCConfig 的 Manage-RemoteComputerMCP.ps1 -RuntimePrincipal claude-root 登记。主机上的 Claude 不连本机电脑 MCP。",
     "source": "原文第 63、90 行；.claude.json 的 mcpServers.secondary_laptop；E:\\PCConfig\\tools\\remote-computer-mcp\\Manage-RemoteComputerMCP.ps1"
    },
    {
     "id": "r-codex-child",
     "with": "codex",
     "direction": "派出",
     "flow": "本人授权时，Claude 经 Invoke-ClaudeGptChild.ps1 启动 Codex（node codex.js → codex app-server），派 GPT-6 Astra、Sol、Luna；任务说明进、report.md 和 last-message.md 出，结果目录在 E:\\Cache\\Claude\\Temp\\<会话号前 8 位>\\gpt-children\\。",
     "source": "原文第 38–42 行；Invoke-ClaudeGptChild.ps1 第 23–25、583 行；run.json 的 launcher 字段"
    },
    {
     "id": "r-skills-shared",
     "with": "agents",
     "direction": "共用",
     "flow": "Claude 和 Codex 共用一份技能：C:\\Users\\10979\\.claude\\skills 是指向 C:\\Users\\10979\\.agents\\skills 的目录链接（29 个技能目录，9 月 28 日数）。",
     "source": "原文第 59 行；Get-Item 显示 LinkType=Junction"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-claude-adapter-01",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-claude-adapter-01",
     "text": "用户授权"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rule-claude-adapter-01",
     "text": "Codex 适配"
    },
    {
     "target": "/projects/agents/",
     "screen": "rule-claude-adapter-01",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/how/#ai-roles",
     "screen": "rule-claude-adapter-01",
     "text": "在整套系统里的分工 → 怎么协作"
    },
    {
     "target": "/rules/authorization/#p-trusted",
     "screen": "rule-claude-adapter-02",
     "text": "用户授权"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-claude-adapter-03",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/protected-actions/#p-gate",
     "screen": "rule-claude-adapter-03",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/charter/#L23",
     "screen": "rule-claude-adapter-04",
     "text": "约法 L23"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "rule-claude-adapter-07",
     "text": "共享经验的落点"
    },
    {
     "target": "/rules/capabilities-runtime/#p-google",
     "screen": "rule-claude-adapter-07",
     "text": "能力与运行方式"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-claude-adapter-09",
     "text": "约法 L16"
    },
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "rule-claude-adapter-10",
     "text": "能力与运行方式"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-claude-adapter-11",
     "text": "用户授权"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-claude-adapter-12",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-claude-adapter-12",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "rule-claude-adapter-14",
     "text": "共享经验的落点"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-claude-adapter-15",
     "text": "工程与交付"
    },
    {
     "target": "/projects/agents/",
     "screen": "rule-claude-adapter-15",
     "text": "Claude 入口模板"
    },
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "rule-claude-adapter-17",
     "text": "能力与运行方式"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "开头一屏的入口链到 /how/#ai-roles，和“分工与并行施工”试点页用同一个锚点；“怎么协作”页第 2 批才做，要在那页建这个锚点（已写进 batch2.md）。",
    "原文第 67 行的 Markdown 链接“Claude 入口模板”指向仓库里的 templates/claude-home/CLAUDE.md，网站上没有这份文件的页。我把它链到 AI 规则与技能基座项目页（/projects/agents/，按全站规矩“规则和技能怎么接到各个 AI”的家在那里）。若第 2 批或基座页有专门讲入口模板的锚点，改这一条 href 即可。",
    "原文第 62 行链到“共享经验的落点”（事实来源专题里的一个小节），我只链到 /rules/context-sources/，没加锚点：那一页的锚点名由别的作者起，拼页时可补上。",
    "人话要点把原文“根会话”写成“主对话”（第 3 屏第一次出现时括注原词），开头词表也注明；原文部分照旧。和“分工与并行施工”页一致。",
    "第 7 屏“例：副机上登记给 Claude 的客户端叫 claude-main-desktop，回调端口 33418”是原文没有、我对照本机 .claude.json 核实过的实例。只是客户端名和端口，不是凭据；副机的完整网址（Tailscale 地址）没有写。若觉得不该公开端口号，删这一条即可。",
    "第 8 屏“文件预览”一条写了 Claude 入口说明里的具体做法（用当前会话的目录授权工具把盘根加进来）：原文只说“按 Claude 入口模板的文件预览要求办理”，具体做法取自 E187 的 templates/claude-home/CLAUDE.md（和本机 ~/.claude/CLAUDE.md 哈希一致）。",
    "第 10 屏“用 Claude 自己的那份解锁信封”：原文“无需验证因子的账号恢复登记，用 Claude 自己的解锁信封”，“解锁信封”具体是什么没去密码中心源码核对，照原词写，没解释。",
    "第 5 屏“五个常用命令”里 Stop 写成“停掉这个子代理的整棵进程树”、Steer 写成“不打断正在跑的命令”：取自 Invoke-ClaudeGptChild.ps1 开头注释（第 14、17 行），原文只写了命令本身。",
    "第 4 屏开头一句“派出去的 GPT 子代理其实就是一个 Codex，由 Claude 通过包装器启动”：依据原文第 40 行“派出的是 Codex”和包装器注释第 4 行。",
    "全页都用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "第 2、3、4、7 屏人话要点于北京时间 9 月 29 日跟到 E190：身份一节原文改为只补 Claude 的实际启动链、通用的认法统一指向《用户授权》，所以第 2 屏删了四条通用的认法（它们在用户授权页“怎么认出是桌面版”里讲）；把关的型号和档位统一指向《重大动作与本人验证》（链到它的 #p-gate）；Astra 未写档位时包装器也取 max；Google 业务改指向《能力与运行方式》的 Google 入口（链到 #p-google）。",
    "原文屏（第 11–17 屏）改为拼页时按当时生效版本现读（shape=source_text），text 里留的仍是 E187 的快照，based_on 也仍记 E187，指的是这份快照。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-claude-adapter/page.json",
  "sha256": "7b31403268d8dfc263be8865413d503cec1f0e846db01d387f9af6fdbcae78be",
  "converted_at_beijing": "2026-10-31T07:22:36+08:00"
 }
}
---

::screen{#rule-claude-adapter-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。最上面一行是左上“Claude 适配”毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题。副标题下面一条横跨全宽的“最常用的两件事”：左端“最常用的两件事”粗体深绿，右边两张等宽等高、浅绿底、细绿边的圆角卡片并排，是全屏最显眼的一块。左卡左上画 Chrome 的彩色圆形标志，旁边一个胸前是 OpenAI 黑色花结的小机器人；右卡左上画一个小沙漏旁边一把钥匙。卡名（“要用本人已登录的 Chrome”“给当前 Claude 开无限制授权”）粗体深绿，冒号后的答案深蓝灰，末尾的〔详见：……〕画成白底细绿描边的小圆角按钮、带小箭头。这条下面再分左右两栏：左边约 55% 宽是文字区，先是介绍段（〔〕里的字画成绿色下划线加小箭头的链接样式）。介绍段下面一张浅绿细边圆角卡片“先认几个词”，六个词条竖排，词条名粗体绿色，字号比介绍段小一号、行距紧凑。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），就是那六个〔〕链接。右边约 45% 宽一幅水彩插画（比原来略矮，给上面的两张卡让位）：上方一扇画着 Claude 橙色星芒标志的小窗口（代表 Claude 桌面版），窗口下沿垂下一根绿色细绳，串着三个小木块，一路垂到底部一枚小铜牌，铜牌上刻“claude-root”；细绳右边一段五级木台阶，每级台阶侧面一块小牌子，从低到高依次是“low”“medium”“high”“xhigh”“max”；台阶顶上架着一座小木桥，通向画面右缘一个胸前是 OpenAI 黑色花结标志的小机器人；画面左下角一只小木钩挂着一张空白便签（便签上不写字）。插画里只有铜牌和五块台阶牌子上有字，text 里“claude-root　low　medium　high　xhigh　max”这一行就是这六处的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“Claude 和 GPT 在这套规则下实际怎么分工、干过哪些活：”，右边一个显眼的按钮〔在整套系统里的分工 → 怎么协作〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；“最常用的两件事”（小标题一行，两张卡上下排、各占整宽）；水彩插画（同横版，缩成整宽一幅，小窗口和细绳在左、台阶和小桥在右，六处牌子上的字不变）；介绍段；“先认几个词”卡片（六个词条一行一条）；“跳到：”六个按钮排三行、每行两个；最下面“怎么协作”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/"
   },
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "详见：用登录的 Chrome",
    "href": "/rules/claude-adapter/#p-browser"
   },
   {
    "text": "详见：开授权的四步",
    "href": "/rules/claude-adapter/#p-takeover"
   },
   {
    "text": "身份和档位",
    "href": "/rules/claude-adapter/#p-identity"
   },
   {
    "text": "派 Claude 子代理",
    "href": "/rules/claude-adapter/#p-subagents"
   },
   {
    "text": "派 GPT 子代理",
    "href": "/rules/claude-adapter/#p-gpt"
   },
   {
    "text": "宿主接线",
    "href": "/rules/claude-adapter/#p-wiring"
   },
   {
    "text": "Hook 和资料状态",
    "href": "/rules/claude-adapter/#p-hook"
   },
   {
    "text": "受信任能力和升级",
    "href": "/rules/claude-adapter/#p-trusted"
   },
   {
    "text": "在整套系统里的分工 → 怎么协作",
    "href": "/how/#ai-roles"
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
     "text_ref": "Claude适配",
     "align": "center",
     "size": "large",
     "asset": "rule-claude-adapter\\rule-claude-adapter-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-01-h.png",
     "source_box": [
      28,
      0,
      786,
      169
     ]
    },
    {
     "type": "prose",
     "text_ref": "只对Claude桌面版有用的补充规矩：怎么认出它、档位怎么分、怎么派子代理和GPT、各种东西怎么接在它身上。",
     "size": "large",
     "bold": true
    },
    {
     "type": "section_heading",
     "text_ref": "最常用的两件事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "comparison",
     "text_ref": "要用本人已登录的Chrome：Claude自己操作不了",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "image_mode": "none"
    },
    {
     "type": "prose",
     "text_ref": "Codex和Claude共用的规则写在别的专题里，这一页只写Claude不同的地方，管八件事：密码中心怎么认出Claude桌面版；五个思考档",
     "row": "intro",
     "width": "55%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "intro",
     "width": "45%",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\_library\\illustrations\\ill-7655d12c662841.png"
    },
    {
     "type": "glossary",
     "text_ref": "先认几个词",
     "columns": 1,
     "whole_block": true,
     "row": "terms",
     "width": "100%"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：派Claude子代理派GPT子代理身份和档位宿主接线Hook和资料状态受信任能力和升级",
     "columns": 6,
     "width": "100%",
     "row": "jump"
    },
    {
     "type": "tag",
     "text_ref": "claude-rootlowmediumhighxhighmax",
     "width": "100%",
     "row": "levels",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "Claude和GPT在这套规则下实际怎么分工、干过哪些活：在整套系统里的分工→怎么协作",
     "button_position": "right"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 整屏宽章节标题按STANDARDS居中。 新G3发现基础卡叶子压字，改现有两卡comparison，维持两列/竖单列、原文字和字号。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。；末轮目视修正：columns控制外卡数，单术语卡用1列以真正占整宽，不用2列留下空半栏。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-01",
    "component_order": [
     "chapter_title",
     "prose",
     "monospace",
     "content_card",
     "action_button",
     "comparison",
     "inline_link",
     "glossary",
     "illustration",
     "segmented_band",
     "notice",
     "bullet_list"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "Claude适配",
     "align": "center",
     "size": "large",
     "asset": "rule-claude-adapter\\rule-claude-adapter-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-01-h.png",
     "source_box": [
      28,
      0,
      786,
      169
     ]
    },
    {
     "type": "prose",
     "text_ref": "只对Claude桌面版有用的补充规矩：怎么认出它、档位怎么分、怎么派子代理和GPT、各种东西怎么接在它身上。",
     "size": "large",
     "bold": true
    },
    {
     "type": "section_heading",
     "text_ref": "最常用的两件事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "comparison",
     "text_ref": "要用本人已登录的Chrome：Claude自己操作不了",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "image_mode": "none"
    },
    {
     "type": "illustration",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\_library\\illustrations\\ill-7655d12c662841.png"
    },
    {
     "type": "prose",
     "text_ref": "Codex和Claude共用的规则写在别的专题里，这一页只写Claude不同的地方，管八件事：密码中心怎么认出Claude桌面版；五个思考档"
    },
    {
     "type": "glossary",
     "text_ref": "先认几个词",
     "columns": 1,
     "whole_block": true
    },
    {
     "type": "action_button",
     "text_ref": "跳到：派Claude子代理派GPT子代理身份和档位宿主接线Hook和资料状态受信任能力和升级",
     "columns": 2
    },
    {
     "type": "tag",
     "text_ref": "claude-rootlowmediumhighxhighmax",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "Claude和GPT在这套规则下实际怎么分工、干过哪些活：在整套系统里的分工→怎么协作",
     "button_position": "below"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 整屏宽章节标题按STANDARDS居中。 新G3发现基础卡叶子压字，改现有两卡comparison，维持两列/竖单列、原文字和字号。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-01",
    "component_order": [
     "chapter_title",
     "prose",
     "illustration",
     "glossary",
     "content_card",
     "action_button",
     "monospace",
     "comparison",
     "inline_link",
     "segmented_band",
     "notice",
     "bullet_list"
    ]
   },
   "portrait_required": true
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "要用本人已登录的 Chrome  ：Claude 自己操作不了，默认派一个 GPT 子任务在本人开着的 Chrome 里做；不用登录的网页，Claude 用自己的内置浏览器看。〔详见：用登录的 Chrome〕",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "给当前 Claude 开无限制授权  ：在主对话里明确说要开，会弹出密码中心的授权窗口；本人填时长和范围、验证一次，下一条消息时 Claude 读回授权，用到截止为止，不自动续期。〔详见：开授权的四步〕",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "要用本人已登录的 Chrome  ：Claude 自己操作不了，默认派一个 GPT 子任务在本人开着的 Chrome 里做；不用登录的网页，Claude 用自己的内置浏览器看。〔详见：用登录的 Chrome〕",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "key": "Claude标志",
   "source_phrase": "给当前 Claude 开无限制授权  ：在主对话里明确说要开，会弹出密码中心的授权窗口；本人填时长和范围、验证一次，下一条消息时 Claude 读回授权，用到截止为止，不自动续期。〔详见：开授权的四步〕",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-7655d12c662841.png",
   "fallback": false,
   "semantic_status": "final_gap_same_project_main_reuse",
   "key": "Claude窗口、五级台阶与桥的结构图",
   "source_phrase": "横版 16:9。最上面一行是左上“Claude 适配”毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题。副标题下面一条横跨全宽的“最常用的两件事”：左端“最常用的两件事”粗体深绿，右边两张等宽等高、浅绿底、细绿边的圆角卡片并排，是全屏最显眼的一块。左卡左上画 Chrome 的彩色圆形标志，旁边一个胸前是 OpenAI 黑色花结的小机器人；右卡左上画一个小沙漏旁边一把钥匙。卡名（“要用本人已登录的 Chrome”“给当前 Claude 开无限制授权”）粗体深绿，冒号后的答案深蓝灰，末尾的〔详见：……〕画成白底细绿描边的小圆角按钮、带小箭头。这条下面再分左右两栏：左边约 55% 宽是文字区，先是介绍段（〔〕里的字画成绿色下划线加小箭头的链接样式）。介绍段下面一张浅绿细边圆角卡片“先认几个词”，六个词条竖排，词条名粗体绿色，字号比介绍段小一号、行距紧凑。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），就是那六个〔〕链接。右边约 45% 宽一幅水彩插画（比原来略矮，给上面的两张卡让位）：上方一扇画着 Claude 橙色星芒标志的小窗口（代表 Claude 桌面版），窗口下沿垂下一根绿色细绳，串着三个小木块，一路垂到底部一枚小铜牌，铜牌上刻“claude-root”；细绳右边一段五级木台阶，每级台阶侧面一块小牌子，从低到高依次是“low”“medium”“high”“xhigh”“max”；台阶顶上架着一座小木桥，通向画面右缘一个胸前是 OpenAI 黑色花结标志的小机器人；画面左下角一只小木钩挂着一张空白便签（便签上不写字）。插画里只有铜牌和五块台阶牌子上有字，text 里“claude-root　low　medium　high　xhigh　max”这一行就是这六处的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“Claude 和 GPT 在这套规则下实际怎么分工、干过哪些活：”，右边一个显眼的按钮〔在整套系统里的分工 → 怎么协作〕。",
   "sha256": "63ce419fbe9c9d7dbe2c97e282aa0b8568f7bd77aa573d735748305bad6cba03",
   "status": "ready",
   "original_elements": [
    "比原来略矮，给上面的两张卡让位）：上方一扇画着 Claude 橙色星芒标志的小窗口（代表 Claude 桌面版），窗口下沿垂下一根绿色细绳，串着三个小木块，一路垂到底部一枚小铜牌，铜牌上刻抽象图形；细绳右边一段五级木台阶，每级台阶侧面一块小牌子，从低到高依次是抽象图形抽象图形抽象图形抽象图形抽象图形；台阶顶上架着一座小木桥，通向画面右缘一个胸前是 OpenAI 黑色花结标志的小机器人；画面左下角一只小木钩挂着一张空白便签（便签上不写字"
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
   "asset": "rule-claude-adapter/rule-claude-adapter-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-db1bc4ddc30dee2303c6",
   "title_text": "Claude 适配",
   "sha256": "cd385dbda2b017e28fc9869b9161f94bb7672c67a6638d4e0074ed3f763a345a",
   "status": "ready",
   "source_box": [
    28,
    0,
    786,
    169
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# Claude 适配

**只对 Claude 桌面版有用的补充规矩：怎么认出它、档位怎么分、怎么派子代理和 GPT、各种东西怎么接在它身上。**

**最常用的两件事**
- **要用本人已登录的 Chrome**：Claude 自己操作不了，也不自己上网站；上网站、看网页一律派一个 GPT 子任务，用 Codex 的 Chrome 插件在本人开着的 Chrome 里、自己新开的后台标签页中做，登不登录都一样；Claude 内置浏览器只用来预览本机文件和本机地址上的页面。Chrome 这条路不通时修一次，还不通就把网页那一步交回，不换无头或内置浏览器代做。〔详见：用登录的 Chrome〕
- **给当前 Claude 开无限制授权**：在主对话里明确说要开，会弹出密码中心的授权窗口；本人填时长和范围、验证一次，下一条消息时 Claude 读回授权，用到截止为止，不自动续期。〔详见：开授权的四步〕

Codex 和 Claude 共用的规则写在别的专题里，这一页只写 Claude 不同的地方，管八件事：密码中心怎么认出 Claude 桌面版；五个思考档位各做什么；Claude 怎么派自己的子代理和 GPT 子代理；技能、临时目录、记忆、MCP、浏览器、权限怎么接在 Claude 上；每条消息前自动运行的 Hook 带进什么；无限制授权在 Claude 里怎么开；作为受信任的 AI 还能做哪些事；官方升级以后怎么继续认出它。

只在当前动作用到 Claude 桌面版特有的机制时才读这一页，比如派子代理或工作流、接技能、MCP、浏览器和权限设置；普通工作不以这些机制为前提。共同的分工原则见〔分工与并行施工〕，授权见〔用户授权〕，Codex 那边见〔Codex 适配〕；这些接线实际怎么装、怎么核验，见〔AI 规则与技能基座〕。

**先认几个词**
- **主对话**：本人直接对话的那个 Claude，原文叫“根会话”。
- **启动链**：一个程序是被谁一层层启动的（父进程链）；密码中心顺着它认出是不是 Claude 桌面版。
- **claude-root**：密码中心给 Claude 桌面版登记的身份名。
- **包装器**：Claude 派 GPT 子代理时统一走的脚本 `Invoke-ClaudeGptChild.ps1`。
- **Hook**：本人每发一条消息，Claude 先自动运行的一段程序，把会话编号、个人资料状态这些信息带进对话；它不拦消息。
- **电脑 MCP**：让 AI 远程操作另一台电脑的接口。

跳到：〔派 Claude 子代理〕〔派 GPT 子代理〕〔身份和档位〕〔宿主接线〕〔Hook 和资料状态〕〔受信任能力和升级〕

claude-root　low　medium　high　xhigh　max

Claude 和 GPT 在这套规则下实际怎么分工、干过哪些活：〔在整套系统里的分工 → 怎么协作〕

::screen{#rule-claude-adapter-18 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-18",
  "section": "points",
  "title": "人话要点：最常用的两件事（用登录的 Chrome、开无限制授权）",
  "scene": "横版 16:9。左上一行深绿大字“人话要点 · 最常用的两件事”（“##”不画）。下面两张等宽等高的大圆角卡片左右并排（白底、浅绿细边），每张卡的“### …”小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。左卡“要用本人已登录的 Chrome”：色带左端画 Chrome 的彩色圆形标志。卡片上部画成一张小选路图：一个浅绿底圆角小框写“要登录吗？”，往右下、左下各分出一支绿色箭头，各指向一个白底细绿边的小框，左框是“要：派一个 GPT 子任务，它在本人开着的 Chrome 里做”，框边画一个胸前是 OpenAI 黑色花结的小机器人和一个小 Chrome 标志；右框是“不要：Claude 用自己的内置浏览器看”，框边画 Claude 橙色星芒标志和一只小放大镜；“要”“不要”两个字粗体深绿。选路图下面是五条要点，每条前一个小绿圆点，正文深蓝灰；〔包装器〕画成绿色下划线加小箭头的链接样式，〔〕不画；AppServer、Exec 用等宽字体、浅绿底小框。右卡“给当前 Claude 开无限制授权”：色带左端画一个小沙漏旁边一把钥匙。卡片上部画成从上到下的四步流程：四个绿色实心小圆里是白色数字 1–4，小圆之间用绿色短箭头连起来，每个小圆右边是这一步的字；第 2 步旁边画一扇弹出的小窗口（窗口里不写字），第 3 步旁边画一只小沙漏和一个绿色小勾。〔约法 L16〕画成绿色下划线加小箭头的链接样式。四步下面一条细绿分隔线，下面“开着以后：”粗体深绿，四条要点，每条前一个小绿圆点。两张卡底边对齐；哪张卡下方有空，就画一小丛水彩叶子补上，不留大块空白。不画编号以外的序号，不加正文以外的字。",
  "portrait": "竖版 9:16，字完全一样。大标题在上；两张卡从上到下各占整宽，先 Chrome 卡后授权卡；选路图改成上下排（“要登录吗？”在上，两支箭头往下分到左右两个小框），四步流程仍从上到下。字多时按完整卡片拆成 -v（Chrome 卡）、-v2（授权卡）。",
  "links": [
   {
    "text": "包装器",
    "href": "/rules/claude-adapter/#p-gpt-wrapper"
   },
   {
    "text": "约法 L16",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/#p-chrome"
   }
  ],
  "anchors": [
   {
    "id": "p-browser",
    "text": "要用本人已登录的 Chrome"
   },
   {
    "id": "p-takeover",
    "text": "给当前 Claude 开无限制授权"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·最常用的两件事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "要用本人已登录的Chrome",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "给当前Claude开无限制授权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-18",
    "component_order": [
     "chapter_title",
     "prose",
     "bullet_list",
     "monospace",
     "section_heading",
     "points_card",
     "inline_link",
     "numbered_steps",
     "flow",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·最常用的两件事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "要用本人已登录的Chrome",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "给当前Claude开无限制授权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-18",
    "component_order": [
     "numbered_steps",
     "flow",
     "chapter_title",
     "prose",
     "bullet_list",
     "monospace",
     "section_heading",
     "points_card",
     "inline_link",
     "icon"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "要：派一个 GPT 子任务，它在本人开着的 Chrome 里做",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
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
   "source_phrase": "不要：Claude 用自己的内置浏览器看",
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
   "asset": "_library/titles/title-8a82a02edd771f698ac6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8a82a02edd771f698ac6",
   "title_text": "人话要点 · 最常用的两件事",
   "sha256": "bb3b7a49e9065879df866964364359c0b559f6b4d97f5c0e22423ad8c579f3ba",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 最常用的两件事

### 要用本人已登录的 Chrome
要上网站或看网页吗？
- **要**（登不登录都一样）：派一个 GPT 子任务，它用 Codex 的 Chrome 插件，在本人开着的 Chrome 里自己新开的后台标签页中做
- **只是看本机文件或本机预览页**：Claude 内置浏览器可以看；成批截图、录屏和网页操作照样派出去做好送来

- Claude 主对话和 Claude 子代理都不自己上网站，也操作不了本人已登录的浏览器页面。
- 要看网页、查网页资料、用本人的登录状态操作或收集数据，就经〔包装器〕派 GPT 子任务：统一走 AppServer 方式，它会像 Codex 桌面一样接上 Codex 的 Chrome 插件。
- 本人的 Chrome 打不开或插件连不上时，GPT 子任务先修这条路一次；还不通，就停下需要网页的那一步，把卡在哪、实际报错和已做到哪里交回，其余不用网页的工作照常做完。不改用无头浏览器、临时配置或 Claude 内置浏览器去访问同一个网站（做法见〔能力与运行方式〕的浏览器一节）。
- 派哪个型号和档位、要不要 Astra 授权，照派子代理的规则定，这一条不改选型。
- 内置浏览器只是 Claude 预览本机页面的做法；Codex 照常用本人的 Chrome，并且要明确选 Chrome。
- 这是默认做法，不是禁令：本人当场另有指定时照本人说的办。

### 给当前 Claude 开无限制授权
1. 本人在主对话里明确说要开无限制授权（〔约法 L16〕）。
2. Claude 不用先做别的准备，直接打开密码中心的本人接管窗口；只有主对话里本人真实的消息会弹窗，子代理和工作流不会。
3. 本人在窗口里填时长（0.5～72 小时，可以有小数）和范围（默认只管当前对话，要全局生效得本人自己选），再验证一次本人。
4. 验证成功后，本人下一条消息时 Claude 读回这份授权；这个对话派出的子代理和工作流也在授权内。

开着以后：
- 重大的事不再弹验证；在本人定的范围和时间里，本人的明确指令优先于 AI 自己的规则，AI 照样说真话、提更好的做法。
- 截止时间固定，不滑动续期；到点还要用，请本人续期。
- 不会顺带打开个人资料，资料解锁是另一件事。
- 当前对话的授权管不到 Codex 的对话；全局授权两边都能用。

::screen{#rule-claude-adapter-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-03",
  "section": "points",
  "title": "人话要点：Claude 派自己的子代理",
  "scene": "横版 16:9。三张卡横排：左“选档位和型号”、中“工作流”、右“复核和把关”，高度按内容、底边对齐。卡片左上角小水彩图标：“选档位和型号”配五枚排成一排、深浅不同的绿色小徽章；“工作流”配几条从一点分出去又汇到一点的绿色细线；“复核和把关”配一只放大镜照着一页纸。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。 这一段放在标题下面，画成一张浅绿底圆角提示卡，“先说派谁”粗体深绿，比下面各小节更显眼；其余版式照原图。",
  "portrait": "竖版 9:16。竖版：大标题和开头一句在上，三张卡从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#p-gate"
   },
   {
    "text": "型号与派法",
    "href": "/rules/execution-coordination/#p-model-table",
    "orientations": [
     "v"
    ]
   }
  ],
  "anchors": [
   {
    "id": "p-subagents",
    "text": "Claude 派自己的子代理"
   },
   {
    "id": "p-sub-choose",
    "text": "选档位和型号"
   },
   {
    "id": "p-workflow",
    "text": "工作流"
   },
   {
    "id": "p-sub-review",
    "text": "复核和把关"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·Claude派自己的子代理",
     "align": "center",
     "size": "large",
     "asset": "rule-claude-adapter\\rule-claude-adapter-03-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rule-claude-adapter-03-v.png",
     "source_box": [
      22,
      91,
      916,
      226
     ]
    },
    {
     "type": "notice",
     "text_ref": "先说派谁：主持的想和把关，具体活派出去"
    },
    {
     "type": "points_card",
     "text_ref": "选档位和型号",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "width": "100%",
     "row": "cards-long"
    },
    {
     "type": "points_card",
     "text_ref": "工作流",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "row": "cards-pair",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "复核和把关",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "row": "cards-pair",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-03",
    "component_order": [
     "chapter_title",
     "icon",
     "tag",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·Claude派自己的子代理",
     "align": "center",
     "size": "large",
     "asset": "rule-claude-adapter\\rule-claude-adapter-03-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rule-claude-adapter-03-v.png",
     "source_box": [
      22,
      91,
      916,
      226
     ]
    },
    {
     "type": "notice",
     "text_ref": "先说派谁：主持的想和把关，具体活派出去"
    },
    {
     "type": "points_card",
     "text_ref": "选档位和型号",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "工作流",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "复核和把关",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-03",
    "component_order": [
     "chapter_title",
     "icon",
     "tag",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/late-r3-five-level-badges.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-five-level-badges",
   "source_phrase": "横版 16:9。三张卡横排：左“选档位和型号”、中“工作流”、右“复核和把关”，高度按内容、底边对齐。卡片左上角小水彩图标：“选档位和型号”配五枚排成一排、深浅不同的绿色小徽章；“工作流”配几条从一点分出去又汇到一点的绿色细线；“复核和把关”配一只放大镜照着一页纸。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。 这一段放在标题下面，画成一张浅绿底圆角提示卡，“先说派谁”粗体深绿，比下面各小节更显眼；其余版式照原图。",
   "sha256": "c6cfc15df169bfa93365376f9c0f08725427f8477d9814e4c7e545e565d76430",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-workflow-split-merge.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-workflow-split-merge",
   "source_phrase": "横版 16:9。三张卡横排：左“选档位和型号”、中“工作流”、右“复核和把关”，高度按内容、底边对齐。卡片左上角小水彩图标：“选档位和型号”配五枚排成一排、深浅不同的绿色小徽章；“工作流”配几条从一点分出去又汇到一点的绿色细线；“复核和把关”配一只放大镜照着一页纸。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。 这一段放在标题下面，画成一张浅绿底圆角提示卡，“先说派谁”粗体深绿，比下面各小节更显眼；其余版式照原图。",
   "sha256": "30483314566e957abb9e4c5f629bceb6629624067aa79d63b81783c2b683896e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一只放大镜照着一页纸",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-claude-adapter/rule-claude-adapter-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rule-claude-adapter-03-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3ceaf60d469227fb5513",
   "title_text": "人话要点 · Claude 派自己的子代理",
   "sha256": "71a00c22366b6816782d10eb8adba73693f15c5acf51939be55eb26a8e8d3eb6",
   "status": "ready",
   "source_box": [
    22,
    91,
    916,
    226
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 人话要点 · Claude 派自己的子代理

**先说派谁**：主持的想和把关，具体活派出去；整段一两步的小事顺手做；批量读取、摘录这类机械活和常规写代码、调研、按固定标准批量审图都交 GPT-6.1 Sol，排障通常也先交它（GPT 实际用不了时，机械活交 Claude Sonnet 5.5）；GPT-6 Luna 现在只照写好的提示生图、落盘；给我看的文字和分析、读大代码库找程序为什么出错交 Claude Opus 5.5；最难、最要紧的在 Opus 和 GPT-6 Astra 里选一家，派 Astra 要我对这个对话或项目点头，点过头就沿用。没有授权时，遇到更适合 Astra 的独立复核等任务，会提醒我一次。完整的表见〔型号与派法〕；共同原则见〔分工与并行施工〕。

### 选档位和型号
- **先用 API 额度**：本人每月有一笔赠送的 Anthropic API 额度，每月 27 日重置、必然用完，所以原本要派的 Claude 档位子代理，先用后台命令 `Invoke-ClaudeApiChild.ps1` 走 API 派，型号、档位和派单内容都不变。看它的回执接着办：成功就读结果验收；回执说要回到桌面（`use_desktop`），或者根本没拿到回执，就用 Agent 工具派同一档位类型，已经做了一半的附上交接说明接着做，不从头重来。额度用完由脚本自己记到下次重置，AI 不查余额、不定时试探。
- 三种情况直接用 Agent 工具派：任务要用浏览器、Google、副机这类 MCP 工具（API 子代理不加载 MCP）；这个对话已经有 3 个 API 子代理在跑；API 回执要求回到桌面。主对话直接用 Agent 派档位类型时会被受管 Hook 拦下并给出 API 命令，属于这三种情况就在派单里写一行“API 回退：MCP / 已有3个 / use_desktop”再派。
- Agent 工具没有档位参数，要选型号和档位就选对应的子代理类型：`sonnet-low`、`opus-low`、`opus-medium`、`opus-high`、`opus-xhigh`、`opus-max`；model 参数只换型号、不换档位，也不用它派 Sonnet。
- Claude 子代理主要做独立复核、头脑风暴、分析、抽查和惊艳类样板、关键部分；场景表交 GPT 的活，只有 GPT 实际调用报登录、额度错误，或需要的工具、身份确实用不了时才交 Claude 子代理，不预先查额度来判断，纯机械小事这时交 `sonnet-low`。其他活照场景表；暂不派 Fable。
- 内置 general-purpose、Explore、Plan 连型号和档位都跟主对话走，主对话 max 时它们也 max。整段一两步能查完的小检索自己做；成批检索和机械小事交 Sol（Luna 只生图），GPT 用不了时交 `sonnet-low` 或 `opus-low`。Explore、Plan 不读 CLAUDE.md，只做只读检索。
- GPT 子代理经包装器进入，见下一屏；不用 Codex 的 openai_child 冒充 Claude 的入口。Haiku 只用于本职的内置小任务。

### 工作流
- 工作流（Workflow）按固定步骤编排多个代理，适合分头做、交叉核对和能恢复的批量任务。
- 只在本人开启 Ultracode、明确要求或技能要求时用；每个 agent() 都写明 effort。
- 分派前估一下额度，不够就先留下能接着做的检查点。

### 复核和把关
- 独立复核默认一两个复核者，只给差异、调用点、相关规则；问题合成一次核对。
- 重大动作前的把关，型号、最低档位和职责统一见〔重大动作与本人验证〕；确需另派时从够格的档位子代理里选。

::screen{#rule-claude-adapter-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-04",
  "section": "points",
  "title": "人话要点：派 GPT（一）先看授权、默认分工",
  "scene": "横版 16:9。左右两张卡：左“先看授权覆盖什么”约 45% 宽，图标是一张盖着绿色印章的小授权书；右“默认分工”约 55% 宽，图标是 Claude 橙色星芒和 OpenAI 黑色花结两个标志并排。大标题下面一行小字说明本屏和下两屏讲的是什么。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：大标题、说明小字在上，两张卡从上到下各占整宽。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L23",
    "href": "/rules/charter/#L23"
   },
   {
    "text": "型号与派法",
    "href": "/rules/execution-coordination/#p-model-table"
   }
  ],
  "anchors": [
   {
    "id": "p-gpt",
    "text": "Claude 派 GPT 子代理",
    "locator_text": {
     "v": "人话要点 · Claude 派 GPT 子代理"
    }
   },
   {
    "id": "p-gpt-scope",
    "text": "先看授权覆盖什么"
   },
   {
    "id": "p-gpt-roles",
    "text": "默认分工"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·Claude派GPT子代理",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "派出去的GPT子代理就是一个Codex，由Claude通过包装器启动；下面三屏讲授权、选型、入口和接续。"
    },
    {
     "type": "points_card",
     "text_ref": "先看授权覆盖什么",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "45%"
    },
    {
     "type": "points_card",
     "text_ref": "默认分工",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "55%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-04",
    "component_order": [
     "chapter_title",
     "points_card",
     "prose",
     "section_heading",
     "bullet_list",
     "monospace",
     "inline_link",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·Claude派GPT子代理",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "派出去的GPT子代理就是一个Codex，由Claude通过包装器启动；下面三屏讲授权、选型、入口和接续。"
    },
    {
     "type": "points_card",
     "text_ref": "先看授权覆盖什么",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "默认分工",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-04",
    "component_order": [
     "chapter_title",
     "points_card",
     "prose",
     "section_heading",
     "bullet_list",
     "monospace",
     "inline_link",
     "icon"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "Claude 自己的子代理和 GPT-6.1 Sol、GPT-6 Luna 不用本人另行授权，任何对话都能派（〔约法 L23〕）。",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "GPT-6 Astra 按本人给这个对话或项目的授权；原话里的项目、对话、期限和选型限制照原样保留。",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-6833841bd9569218d70c.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-6833841bd9569218d70c",
   "title_text": "人话要点 · Claude 派 GPT 子代理",
   "sha256": "c7dde93e7b4705557120512f9d8d7be75a55fe9d41cf1610beb0937652ddbcfc",
   "status": "ready",
   "source_box": [
    35,
    98,
    930,
    204
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · Claude 派 GPT 子代理

派出去的 GPT 子代理就是一个 Codex，由 Claude 通过包装器启动；下面三屏讲授权、选型、入口和接续。

### 先看授权覆盖什么
- Claude 自己的子代理和 GPT-6.1 Sol、GPT-6.1 Terra、GPT-6 Luna 不用本人另行授权，任何对话都能派（〔约法 L23〕）。
- GPT-6 Astra 按本人给这个对话或项目的授权；原话里的项目、对话、期限和选型限制照原样保留。
- 已有有效授权覆盖本任务就直接用，不逐次再问，不扩成所有对话或项目的许可。
- 需要 Astra 而没有授权时，只在模型清单定的场景提醒一次；等答复时继续其它工作，不授权就按场景用 Opus 或 Sol 接手。

### 默认分工
- 型号、场景和档位见〔型号与派法〕，按成品要求、厂商数据和权威评测选择；先能胜任，再快，再省，场景表不是固定身份。
- 整段一两步就完的小事，主对话顺手做；机械活、常规施工、调查和复核按场景交 Sol；Luna 只照写好的提示生图、落盘；Terra 现在没有默认场景。
- 做错了按主对话验收事实补材料、退回改，同一关键错再犯，或方案走不通、活变难，就重选执行者；Opus 与 Astra 同一级，一件活交一家做，没有 Astra 授权就用 Opus 或场景表的其他选择，可交叉复核。
- 主持的管战略、头脑风暴、抽查和最终把关；惊艳类样板、关键部分交做得最好的亲手做；本人定过由 Claude 写的成品、分析、文书和对本人的理解照旧。
- 涉及本人价值取舍、偏好和理解的内容，GPT 也可以写或提意见，但要单列出来，由 Claude 对照本人原话和当时语境把关后才落地；GPT 不替本人定偏好。
- 推荐、取舍、计划类汇报交给本人前，不再另派子代理复核；产品和战略上的取舍按“先给本人看样子，再做”由本人看过定（见〔工程与交付〕）。
- 每次显式写 `-Model` 和 `-Effort`。具体型号和档位以模型清单为准，现在清单里的默认是：GPT-6.1 Sol 只读、步骤简单、代码上限为 0 的小单（读一页、查一项现成数据、回读状态）用 medium，施工、要判断的分析和难活用 ultra；纯机械且量大的可以用 low 或直接写脚本；GPT-6 Luna 只照提示生图、落盘，用 low，它旧的档位不再作为派单依据。Sol、Astra 要 xhigh 的派单一律传 ultra，旧调用里写的 xhigh 自动转成 ultra，其他显式档位按原值。ultra 是允许子代理用的 xhigh，不比 max 高。
- 包装器在 Astra 没写档位时取 max：这是缺省兜底，和上面“xhigh 转 ultra”是两回事，不把缺省值当通用推荐。
- 分工按成品要求，哪边额度多都不改；GPT 额度少，Claude 自己施工；Claude 额度少，它判断等重置还是抽查后现在交付。不另查全部账号额度。
- Astra 必要时可按 Codex 的派法再派 Sol、Luna，不扩大任务与授权。

::screen{#rule-claude-adapter-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-05",
  "section": "points",
  "title": "人话要点：派 GPT（二）从包装器进入",
  "scene": "横版 16:9。左边一张大卡“从包装器进入”约 60% 宽，图标是一个小开关盒上连出一根绿线。右边约 40% 宽一张“五个常用命令”小卡，五行，每行左边一个命令名的绿色小胶囊（Start、Steer、Status、Resume、Stop），右边一句说明；小卡下面一幅小水彩：Claude 橙色星芒的小窗口经一根绿色细管连到一个 OpenAI 黑色花结的小机柜，细管中间一个小阀门。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版分 2 张，仍用现有 v/v2。第 1 张画“从包装器进入”前 5 条（至“结果目录”），小水彩只在第 1 张；第 2 张续画其余 4 条（从“插话内容长”至“其余几个模式”）和“五个常用命令”全 5 条。按完整新正文逐条分配，不增加“命令使用要点”等新标题，不漏字、不缩正文；两张上下接着是完整本屏。",
  "links": [],
  "anchors": [
   {
    "id": "p-gpt-wrapper",
    "text": "从包装器进入"
   },
   {
    "id": "p-gpt-commands",
    "text": "五个常用命令"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "从包装器进入",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "row": "wrapper-0",
     "width": "100%"
    },
    {
     "type": "points_card",
     "text_ref": "五个常用命令",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "row": "wrapper-1",
     "width": "100%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-05",
    "component_order": [
     "tag",
     "points_card",
     "illustration",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "从包装器进入",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "page_break_after": true
    },
    {
     "type": "bullet_list",
     "text_ref": "插话内容长，或者含中文引号“”时，写成文件用-Pr",
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "points_card",
     "text_ref": "五个常用命令",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。 已接新核心text_ref清单中段切分和page_break_after：前五条及小图在v，其余条目和命令卡在v2。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-05",
    "component_order": [
     "illustration",
     "prose",
     "bullet_list",
     "tag",
     "points_card",
     "section_heading",
     "monospace",
     "icon"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/late-r3-wrapper-switch-box.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-wrapper-switch-box",
   "source_phrase": "横版 16:9。左边一张大卡“从包装器进入”约 60% 宽，图标是一个小开关盒上连出一根绿线。右边约 40% 宽一张“五个常用命令”小卡，五行，每行左边一个命令名的绿色小胶囊（Start、Steer、Status、Resume、Stop），右边一句说明；小卡下面一幅小水彩：Claude 橙色星芒的小窗口经一根绿色细管连到一个 OpenAI 黑色花结的小机柜，细管中间一个小阀门。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
   "sha256": "72223c148b3cf155da46c6ffe40a0968888c6e1833eb65078dc44a2c9ebebfd0",
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
   "source_phrase": "新任务默认跑在一个私有的 Codex 后台服务（AppServer）里；同一任务之后的追问沿用原来的运行方式。",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/late-r3-wrapper-valve-link.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-wrapper-valve-link",
   "source_phrase": "横版 16:9。左边一张大卡“从包装器进入”约 60% 宽，图标是一个小开关盒上连出一根绿线。右边约 40% 宽一张“五个常用命令”小卡，五行，每行左边一个命令名的绿色小胶囊（Start、Steer、Status、Resume、Stop），右边一句说明；小卡下面一幅小水彩：Claude 橙色星芒的小窗口经一根绿色细管连到一个 OpenAI 黑色花结的小机柜，细管中间一个小阀门。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
   "sha256": "cc1c6be8c42c1e16417af627aa4e494b7ad5ae15e1491c92adae356c11b686f8",
   "status": "ready"
  }
 ]
}
```

### 从包装器进入
- 一律用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1` 派；不直接调用 `codex exec`，也不用 Codex 的 `openai_child` 或专用判断角色。
- Start 和 Resume 统一走独立的 Codex 后台服务（AppServer）；新任务默认脱离运行，Claude 关闭或重启也会继续，长任务优先这样派。确实要桌面身份的整项任务可以加 `-Detached:$false`，也可以只把凭据那一步交回主对话。Resume 沿用原来保存的脱离方式。
- 以前“后台服务不行就改用一条命令跑一轮（`-Transport Exec`）”的退路已经不在现行规则里，不再这样派。
- 要改仓库的活用 `-NewWorktree -RepoPath` 给它单开一个工作副本；只读的活可以用 `-WorkDir` 指向已有目录。
- 结果目录由 Start 建好，之后各命令的 `-RunDir` 都指向同一个目录。
- 插话内容长，或者含中文引号“”时，写成文件用 `-PromptFile` 传，替换 `-Message`，两者不同时传：PowerShell 会把中文引号当成字符串边界，把后面的字拆成别的参数。
- 运行中要纠偏，用同一轮的 Steer 插话；插话后用 Status 核对：对方收没收到、模型看没看到、汇报里怎么处理的；不把“已排进队列”当成完成。
- 后台 GPT 子任务遇到失败、超时等需要恢复时，才在原线程 Resume，沿用原型号、档位和脱离方式，同样走 AppServer；成功后保留原线程，最新轮真实使用验收通过后才清理；Stop 默认也保留线程和成果，只有显式加 `-DeleteThread` 才永久删除该轮及后代。失败、超时、额度耗尽或登录失效自动归档保留，Resume 前取消归档；不另开替身。
- 其余几个模式（Check 看健康、Watch 在后台盯着、WaitQuota 等额度恢复）的说明写在脚本开头的注释里；`Get-Help E:\.agents\tools\Invoke-ClaudeGptChild.ps1 -Full` 能列出全部参数。

### 派活单和预算
派活单的栏位、模板和预算统计只维护在派发说明一处：写清任务、授权范围、文件范围、代码与测试上限、时限和怎么验收，改代码的活用专用工作副本；原话出处、已定方案和成本估算等栏可写可不写，包装器不因缺栏拒派。出处由主对话负责，派单里分清本人原话和 AI 补充，不附原话清单。M1 统计本轮自写新增、删除与净增，排除合并带入；扩时、预算放行和纠错都写理由，验收后用 Status -Ack。

### 五个常用命令
- **Start**：新派一个子代理。
- **Steer**：它运行中插话纠偏，不打断正在跑的命令。
- **Status**：看进度。
- **Resume**：接续仍保留、需要恢复的后台 GPT 子任务。
- **Stop**：停掉这个子代理和它的全部子进程；默认保留线程和成果，加 `-DeleteThread` 才删。

::screen{#rule-claude-adapter-06 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-06",
  "section": "points",
  "title": "人话要点：派 GPT（三）资料与权限、交代和交付、保存和接续",
  "scene": "横版 16:9。三张卡横排：左“资料与权限”、中“交代和交付”、右“保存和接续”，高度按内容、底边对齐。卡片左上角小水彩图标：“资料与权限”配一把小钥匙旁边一张折起来的小纸条；“交代和交付”配一只信封里露出一页报告；“保存和接续”配一张夹在书里的书签。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版分 2 张，仍用现有 v/v2。第 1 张完整画“资料与权限”“交代和交付”两组，原字不变；第 2 张完整画“保存和接续”全 8 条，含后台 GPT 子任务主体、同额度接续例外、成功/主动停止删除子会话但保留成果。三张卡在各自分张整宽上下排；插画只在第 1 张，不漏字、不缩正文。（g4 补充）“保存和接续”现在是 9 条（新加“时限只是起始时长……”一条，Start/Resume 那条也变长），仍整组画在第 2 张，不拆组。",
  "links": [
   {
    "text": "Hook 和个人资料状态",
    "href": "/rules/claude-adapter/#p-hook"
   }
  ],
  "anchors": [
   {
    "id": "p-gpt-data",
    "text": "资料与权限"
   },
   {
    "id": "p-gpt-brief",
    "text": "交代和交付"
   },
   {
    "id": "p-gpt-resume",
    "text": "保存和接续"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "资料与权限",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "交代和交付",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "保存和接续",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "width": "100%",
     "row": "cards-bottom"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-06",
    "component_order": [
     "icon",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "资料与权限",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "交代和交付",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "保存和接续",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "page_break_before": true
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-06",
    "component_order": [
     "prose",
     "icon",
     "points_card",
     "section_heading",
     "bullet_list",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "source_phrase": "一把小钥匙旁边一张折起来的小纸条",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只信封里露出一页报告",
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
   "asset": "_library/icons/书签册.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "书签册",
   "source_phrase": "一张夹在书里的书签",
   "sha256": "c363edd0cb76d7fcdcf03abae41e213c92ebca7b434076607db2620e00e62e33",
   "status": "ready"
  }
 ]
}
```

### 资料与权限
- 派出去的就是 Codex：按本人平时的 Codex 设置和当前授权干活，只做交给它的这件事。
- GPT 子任务默认独立运行，没有 Claude 桌面身份；只有真正依赖密码中心桌面身份的凭据步骤交回主对话，其余已授权步骤（包括已有的 Git、OAuth 步骤）照常完成，不另行登录、转交秘密或改身份核验来补。
- 个人资料直接查全机共用的同一份状态，不按 Claude 或 Codex 会话另开一段资料期（本人验证后、私人资料可以取用的那段时间）。
- 不把 Claude 对话的授权值复制过去，也不额外加沙箱或审批。
- 根会话派活前先判断资料需求，需要时先请本人解锁；共享资料期内，子代理按正式入口读取。子代理不自己验证，读取被拦、途中缺资料或到期时，汇报单列“需要本人资料：……”交回。

### 交代和交付
- 子任务不和人对话：技术做法它自己定；定不了的需求或取舍写进最终汇报，由主对话整理。
- 先做完不依赖那个决定的部分，不在没人回答的地方干等。
- 交回简短结论、必要证据和汇报的路径；除非任务明确要网页，不做可视化、不开窗口。
- 会影响其他会话的决定，写进对应的项目文件。
- 只在同改一处、出事故或确实需要协调时才发消息，不用中途进度刷屏。

### 保存和接续
- 后台 GPT 子任务运行中或需要恢复时，会话要保留，不加 `--ephemeral`；失败、超时等恢复后在原线程继续，不另开对话。
- Claude 默认按真实恢复时间等额度。仅在 Codex 根与子任务共用额度、根仍能正常调用，而子任务单独报耗尽时，才立即原线程接续；共同耗尽或状态不明继续等恢复。图像工具、Flow 的独立额度不套用。
- 成功后保留线程，最新轮验收通过才清理；六小时到期或 Status -Ack 本身不算验收，须绑定实际版本、真实使用证据、无缺口和消息覆盖。Stop 默认保留线程和成果，只有显式 `-DeleteThread` 才永久删除该轮及后代，汇报和代码保留；失败、超时、额度耗尽、登录失效自动归档保留，Resume 前取消归档。清理失败照实记下，不改变任务结局，也不追删以前已归档的对话。
- Start 默认启动后返回，需要等候时显式加 -Wait；Resume 默认等候，返回后挂一个覆盖全部运行任务的后台 Watch 继续管理，不另挂兜底监看（Backstop）。新版执行器持续写监测与接续状态，后台 Start -Wait、Resume 或 Watch 一次订阅后，周期到点会内部续等；真正风险返回后按回执处理并继续订阅。旧轮仍照返回的 Watch 命令管理，终态后 Resume 接入新版；到终态读 report.md 和 last-message.md 核对成果。
- WatchMaxMinutes 对新版任务是内部续等周期，旧任务仍可返回 rearm；它不改子任务截止时间。长时间的 Start、Resume、Watch 放在后台跑，等候上限用回执给的值（当前 7200000 毫秒，即 2 小时）。有子任务在跑时，根会话结束回复前要挂着那个后台 Watch；漏挂了，受管 Stop 拦一次，同一回合第二次只提示。根会话停下以后，受管 Stop 还会用一个会话级异步唤醒保活：根最后一次真实活动后满 55 分钟、仍有后台任务没完，就把它叫醒，防止没人收尾。细节见〔Hook 和个人资料状态〕。
- 有派活单按单内时限，无派活单才按 TimeoutSeconds（默认 7200 秒）。截止前（总时长的 10%，5–30 分钟）返回一次“快到时限”，先用 Steer 让它交已有结果；根会话调整范围或做法、定好新时限后才带理由 Extend 并重挂 Watch，不自动延期。预算用完后的 Resume 必须带追加分钟和理由，未追加则启动前拒绝。没人处理就提醒收尾后停下，记为超时。
- Claude 重启或续作后，先恢复这个父会话的后台任务：执行者消失、还没交汇报的在原线程继续；已有汇报的验收，仍在跑的接着等。
- 后台命令显示停止，不证明子任务真停了。
- 会话存下了没有、命令行列表里看不看得到、桌面上能不能马上看到，三件事分开按实际结果报告。
- 不保证运行中的线程能在桌面里直接输入，也不为了刷新列表自动重启桌面版。

::screen{#rule-claude-adapter-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-02",
  "section": "points",
  "title": "人话要点：身份、思考档位",
  "scene": "横版 16:9。左右两张卡：左“身份”约 55% 宽，卡片左上角小水彩图标是一条从 Claude 橙色星芒标志垂下的绿色细绳，串着三个小方块，末端挂一枚小铜牌；右“思考档位”约 45% 宽，图标是一段五级木台阶。“思考档位”卡里前六条画成一张两列小表（左列档位名、右列说明），其余三条照常列在表下。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：大标题在上，“身份”卡、“思考档位”卡从上到下各占整宽；思考档位的小表保持两列（档位名窄、说明宽）。字和横版完全一样。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/#p-trusted"
   }
  ],
  "anchors": [
   {
    "id": "p-identity",
    "text": "Claude 桌面版是两个受信任的 AI 之一",
    "locator_text": {
     "v": "身份"
    }
   },
   {
    "id": "p-effort",
    "text": "Opus 5.5 和 Fable 5.1 共用五档，从低到高",
    "locator_text": {
     "v": "思考档位"
    }
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·怎么认出Claude、档位怎么分",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "身份",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "55%",
     "motion_text": [
      {
       "kind": "arrow",
       "text": "→",
       "within": "`node codex.js` → Codex 后台服务"
      }
     ]
    },
    {
     "type": "points_card",
     "text_ref": "思考档位",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "45%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-02",
    "component_order": [
     "chapter_title",
     "icon",
     "points_card",
     "segmented_band",
     "table",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·怎么认出Claude、档位怎么分",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "身份",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "motion_text": [
      {
       "kind": "arrow",
       "text": "→",
       "within": "`node codex.js` → Codex 后台服务"
      }
     ]
    },
    {
     "type": "points_card",
     "text_ref": "思考档位",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-02",
    "component_order": [
     "table",
     "chapter_title",
     "icon",
     "points_card",
     "segmented_band",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "Claude 桌面版是两个受信任的 AI 之一；桌面身份怎么认、怎么登记和撤销，统一见〔用户授权〕，这里只补 Claude 这条实际的启动链。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "Claude 桌面 → 命令进程 → `pwsh` 包装器 → `node codex.js` → Codex 后台服务（`codex app-server`）→ 它的命令进程和所有后代：密码中心顺着桌面祖先，都认作 `claude-root`（Claude 派 GPT 子代理时就是这样启动 Codex 的，见后面派 GPT 一节）。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-f931c3c1d4386023eae7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f931c3c1d4386023eae7",
   "title_text": "人话要点 · 怎么认出 Claude、档位怎么分",
   "sha256": "0a36eed98817cf16f46d07339689418773b795ec30045f87a2a688086ce792c2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 怎么认出 Claude、档位怎么分

### 身份
- Claude 桌面版是两个受信任的 AI 之一；桌面身份怎么认、怎么登记和撤销，统一见〔用户授权〕，这里只补 Claude 这条实际的启动链。
- Claude 桌面直接启动的工具进程和子代理，密码中心仍按真实桌面来源识别；GPT 包装器默认由系统服务启动独立执行者，已经脱离这条桌面进程链，不再沿用 Claude 桌面身份。需要密码中心凭据的动作交回主对话，先完成其余部分；明确采用非独立运行方式时，也要按现场真实的桌面祖先判断身份。
- 链上嵌套的工具用什么模型（例如 GPT），都不改变这个身份。

### 思考档位
- Opus 5.5、Sonnet 5.5 和 Fable 5.1 共用五档，从低到高：
- `low`：想得最少，只做机械、明确、结果马上能核对的小事。
- `medium`：均衡；Opus 5.5 的默认档，常规检索、调研、实现和审查够用。
- `high`：全面推演；跨模块调查、做完整一个子系统、实质性的审查。
- `xhigh`：扩展推理；难的设计、疑难排障、关键审查。
- `max`：最深、最贵也最慢；评测不一定比 xhigh 高，不当做错后的默认下一步。
- 主对话默认用 `xhigh`：本人新开对话时选一次，App 会记住；AI 开的新对话也用 `xhigh`。难题、完善底座这类难活临时升到 `max`（本人 2026-10-30 定）。
- Ultracode 不是比 max 更高的一档，而是 xhigh 加多代理编排（工作流），只在本会话有效。
- 提示词里出现“ultracode”这个词，只让这一轮改用编排，不改档位。
- 档位显示 `auto`，表示没固定档位，以实际记录为准。

::screen{#rule-claude-adapter-07 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-07",
  "section": "points",
  "title": "人话要点：宿主接线（一）技能、临时目录、档位子代理、记忆、MCP",
  "scene": "横版 16:9。左上一行大标题。下面五张小卡排成两行：上行三张技能、临时目录、档位子代理，等宽；下行两张记忆、MCP 合起来占满整行（记忆约 40% 宽、MCP 约 60% 宽，MCP 字最多），不留空格子。卡片左上角小水彩图标：技能配一串共用一根绳的小工具；临时目录配一个没写字的小纸箱；档位子代理配五枚深浅不同的绿色小徽章；记忆配一个合上并扣着小锁扣的笔记本；MCP 配一个插头和插座。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：大标题在上，五张卡从上到下一张一条、整宽，顺序：技能、临时目录、档位子代理、记忆、MCP。字和横版完全一样。",
  "links": [
   {
    "text": "共享经验的落点",
    "href": "/rules/context-sources/"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/#p-google"
   }
  ],
  "anchors": [
   {
    "id": "p-wiring",
    "text": "宿主接线"
   },
   {
    "id": "p-skills",
    "text": "技能"
   },
   {
    "id": "p-temp",
    "text": "临时目录"
   },
   {
    "id": "p-agents-link",
    "text": "档位子代理"
   },
   {
    "id": "p-memory",
    "text": "记忆"
   },
   {
    "id": "p-mcp",
    "text": "MCP"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·宿主接线：这些东西怎么接在Claude上",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "技能",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "临时目录",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "档位子代理",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "记忆",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "MCP",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "浏览器",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 定稿有“浏览器”第六卡，scene仍写五卡；在原两行基础上补入第六卡，3+3待审。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-07",
    "component_order": [
     "chapter_title",
     "prose",
     "monospace",
     "points_card",
     "icon",
     "tag",
     "section_heading",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·宿主接线：这些东西怎么接在Claude上",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "技能",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "临时目录",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "档位子代理",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "记忆",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "MCP",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "浏览器",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 定稿有“浏览器”第六卡，scene仍写五卡；在原两行基础上补入第六卡，3+3待审。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-07",
    "component_order": [
     "chapter_title",
     "prose",
     "monospace",
     "points_card",
     "icon",
     "tag",
     "section_heading",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "齿轮",
   "source_phrase": "一串共用一根绳的小工具",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
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
   "source_phrase": "一个没写字的小纸箱",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "五枚深浅不同的绿色小徽章",
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一个合上并扣着小锁扣的笔记本",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "一个插头和插座",
   "sha256": "9f19b0993d47ecb67a994c3988d36efb98a1b9dca540cacc914abb5755b33ebe",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
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
   "asset": "_library/titles/title-1c22412ca19b41284b16.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1c22412ca19b41284b16",
   "title_text": "人话要点 · 宿主接线：这些东西怎么接在 Claude 上",
   "sha256": "2eb32204dd12a96e5ec7867da291391c6d596545fee58761c80fa87780b364d9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 宿主接线：这些东西怎么接在 Claude 上

### 技能
- `~/.claude/skills` 是指向 `~/.agents/skills` 的目录链接，和 Codex 共用同一个查找位置和技能清单，不另存第二份。
- 新技能写到 `E:\.agents\skills`，再走现有的安装器；不在 `~/.claude/skills` 下直接新建。

### 临时目录
- 任务临时文件放 `E:\Cache\Claude\Temp\<会话号前 8 位>`，子进程的 `TEMP`、`TMP`、`TMPDIR` 也指过去。
- 子代理和主对话共用这个会话目录，所以子代理用自己的子文件夹（例如 `sub-<名字>`），收尾只回收自己建的，不回收会话目录本身。
- 主对话收尾也只回收自己建的文件和子文件夹，不整个目录一起回收：同一目录下的 `personal-status` 是资料 Hook 给本会话留的状态缓存。
- 宿主给的会话临时路径（scratchpad）超过 200 个字符时，会让 `pdftoppm`、`git` 这些工具报假失败，就不拿来当临时目录。

### 档位子代理
- 五个 `opus-*` 子代理的定义只存一份，在 `templates/claude-home/agents/`；`~/.claude/agents` 是指向它的目录链接。

### 记忆
- Claude 账号的聊天记忆已关闭；Claude Code 的自动记忆由 `~/.claude/settings.json` 里的 `autoMemoryEnabled=false` 关掉。
- 当轮要留下的内容按〔共享经验的落点〕写；Claude 工具方面核实过的教训，写进本专题。

### MCP
- 用户级配置在 `%USERPROFILE%\.claude.json`，用 `claude mcp add -s user` 添加。
- Google 的活按〔能力与运行方式〕里的 Google 入口办，走电脑配置（PCConfig）里的 `google-workspace` 本地入口，不接 claude.ai 的云连接器。
- 电脑 MCP 只认目标机登记过的客户端。Claude 的登录回调固定是 `http://localhost:<端口>/callback`，不能借 Codex 用 `127.0.0.1` 登记的客户端，要在目标机单独登记 Claude 的客户端和固定回调端口。
- 例：副机上登记给 Claude 的客户端叫 `claude-main-desktop`，回调端口 33418（9 月 28 日核对）。
- 主机上的 Claude 直接用本机工具，不连本机的电脑 MCP。

### 浏览器
- Claude 主对话和 Claude 子代理访问网站、看网页、查网页资料或用本人登录状态，一律经包装器派 GPT（AppServer）：它用 Codex 的 Chrome 插件，在本人 Chrome 里自己新开的后台标签页中做。
- Claude 桌面版的内置浏览器只用来预览本机文件和本机地址（127.0.0.1、localhost、[::1]）上的页面，不用来上任何网站；按名字启动预览服务时，只允许 `.claude/launch.json` 里登记的本地开发服务。
- Claude in Chrome 扩展仍由 Hook 拦着，本人这一轮明确点名放行时例外。
- GPT 的 Chrome 这条路不通时，按〔能力与运行方式〕的浏览器一节和 browser-control-continuity 不弹窗地修一次；还不通就停下网页那一步、交回卡在哪，不让 Claude 内置浏览器或无头浏览器代做。
- 本人另有指定时照办；型号、档位和 Astra 授权沿用原规则。

::screen{#rule-claude-adapter-08 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-08",
  "section": "points",
  "title": "人话要点：宿主接线（二）验收、权限、拦截和坑",
  "scene": "横版 16:9。两行卡片：上行三张“改了 MCP 之后怎么验收”“权限”“文件预览”；下行两张宽卡“按命令文字拦截的删除”“写路径和中文的坑”。卡片左上角小水彩图标：验收配一个新打开的对话气泡；权限配一扇敞开的小门；文件预览配一张小文件和一只眼睛；按命令文字拦截配一张被红色小叉挡住的纸条；写路径和中文的坑配一个小水坑边上插着一块空白小木牌。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：五张卡从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-mcp-check",
    "text": "改了 MCP 之后怎么验收"
   },
   {
    "id": "p-permissions",
    "text": "权限"
   },
   {
    "id": "p-preview",
    "text": "文件预览"
   },
   {
    "id": "p-text-block",
    "text": "按命令文字拦截的删除"
   },
   {
    "id": "p-pitfalls",
    "text": "写路径和中文的坑"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "改了MCP、Hook或技能之后怎么验收",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "37%"
    },
    {
     "type": "points_card",
     "text_ref": "权限",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "37%"
    },
    {
     "type": "points_card",
     "text_ref": "文件预览",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "26%"
    },
    {
     "type": "points_card",
     "text_ref": "按命令文字拦截的删除",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "写路径和中文的坑",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-08",
    "component_order": [
     "icon",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "改了MCP、Hook或技能之后怎么验收",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "权限",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "文件预览",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "按命令文字拦截的删除",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "写路径和中文的坑",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-08",
    "component_order": [
     "icon",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个新打开的对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇敞开的小门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
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
   "source_phrase": "一张小文件和一只眼睛",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张被红色小叉挡住的纸条",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个小水坑边上插着一块空白小木牌",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  }
 ]
}
```

### 改了 MCP、Hook 或技能之后怎么验收
- 这类改动只在新会话里生效：正在运行的桌面会话还用会话开始时的旧 Hook 设置和旧 MCP 进程，所以要开一个真正的新桌面会话去测。
- 不用 `spawn_task` 卡片开：卡片开出的会话跟着原会话的型号和档位走。
- 做法：AI 在对话里写一段能直接复制的验收提示，第一行写明新会话选 Sonnet 5.5、low 档（这类验收是照步骤看结果）；本人新开一个会话、选好型号和档位后粘贴进去；跑完把结果交回，或由主对话用会话工具回读。
- MCP 另外可以按 `.claude.json` 里 `mcpServers` 的原命令直接跑一遍 stdio 作补充证据，和新会话的结果分开报告。
- 不用嵌套的 `claude -p` 代替：它没登录，也不为它登录或转交凭据。

### 定时任务的结果和给本人的回答怎么送到
- 用桌面版定时任务（scheduled-tasks）建的任务，到点在它自己新开的会话里跑，本人看不见那个会话；完成通知也到不了普通的 Code 对话（规则里记的是 2026 年 10 月 21 日的一次实测）。
- 所以任务会话每做完一段，就用会话管理工具的发消息（`send_message`）把这一段的结果用几句中文发给等结果的对话，返回“已送达”或“已排队”才算送到；收尾框和驾驶舱回执都不算。建任务时在任务说明里写一行“【结果送到】local_<完整会话号>”指定送给谁，确实不用送的写“【结果送到】不转发”；没写就送回建任务的那个对话。例行无变化的一轮在结论回执里注明，不转发。
- 一次性的任务用完就删。
- 本人只看每一轮的最终输出，不看思考摘要，夹在两次工具调用之间的文字可能被缩成一句；所以对本人问题的回答、要他知道的结论，都写在回他那一轮的最后一段。被子代理或命令唤醒的那一轮，本人等于没看见，结论留到他下一条消息时再说，或写进汇报页。
- 本人说去睡了、出门了，或说只看最终汇报时，不发新对话的提议卡片，也不在收尾框里提问：提议卡片会让侧栏显示“需要你”，本人会以为任务卡住了；要提的后续和问题都写进最终汇报。

### 权限
- 全局用 `bypassPermissions`（跳过权限确认）模式，和 Codex 的完全访问对等；不用 auto 模式或 `autoMode` 条目去复制授权。
- 宿主固定拦截的操作不是停工理由，比如删除盘根或一级目录、`Remove-Item` 通配、前台长时间 `sleep`、弹问题框 `AskUserQuestion`：改用写明的子路径、回收站工具，或用后台任务、Monitor 等待。
- 清理、删除这类因 Claude 自身硬限制卡住的已授权步骤，不以“做不了”收场：先做完其余部分，提醒本人可以交给 Codex 接着做，并附一条可复制的接手提示（写法见分工与并行施工专题）。

### 文件预览
- 第一次给本人工作区外的文件链接前，照 Claude 入口说明办：用当前会话的目录授权工具把文件所在的盘根加进来；工具不可用时，要说明预览有缺口。
- 命令行的目录设置，代替不了桌面版的文件预览权限。

### 按命令文字拦截的删除
- Claude 桌面版会拦住同一条 PowerShell 命令里同时出现 `Remove-Item` 和 `E:\PCConfig` 字样的调用；它只看字，不看实际删什么，被拦时整条都不执行。
- 所以删任务临时目录单独写一条命令，读 `E:\PCConfig` 的 git 命令另写一条；临时文件怎么清，按工程与交付专题的清理办法：本任务确认可清的可以直接删，也可以进回收站。

### 写路径和中文的坑
- Bash 工具会把命令里的双反斜杠变成一个，内联脚本里 Windows 路径中的 `\3`、`\r` 会被当成转义，写出控制字符。
- Bash 还会吃掉引号外的反斜杠，Windows 路径写一个还是两个反斜杠都会坏，读不到文件或写到别处；在 Bash 里写路径用正斜杠 `E:/...`，或放进单引号。
- PowerShell 工具的命令会整体再解析一次，双引号里的中文弯引号“”会被当成引号，整条命令报语法错、一步都不执行。
- 所以含 Windows 路径或中文引号的脚本、提交说明、文档片段，先用 Write 工具写成文件，路径用原始字符串，写完检查没有控制字符。
- 给 `pwsh -File` 传一组参数会被拼成一个字符串；要传一组，就在当前会话里用 `&` 调用，或改用 `-Command`。

::screen{#rule-claude-adapter-09 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-09",
  "section": "points",
  "title": "人话要点：两个 Hook 和个人资料状态、无限制授权的接线",
  "scene": "横版 16:9。左右两张大卡：左“Hook 和个人资料状态”约 55% 宽，图标是一只小木钩上挂着一张便签；右“无限制授权怎么接在 Claude 上”约 45% 宽，卡里第一行是指回开头的那句（〔开授权的四步〕画成链接样式），下面五条要点，图标是一个小沙漏旁边一把钥匙。左卡里“装在哪”“带进什么”“资料状态”三个粗体小标签各领几条。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：大标题在上，两张卡从上到下各占整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "开授权的四步",
    "href": "/rules/claude-adapter/#p-takeover"
   }
  ],
  "anchors": [
   {
    "id": "p-hook",
    "text": "Hook 和个人资料状态"
   },
   {
    "id": "p-takeover-wiring",
    "text": "无限制授权怎么接在 Claude 上"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·两个Hook、无限制授权的接线",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "Hook和个人资料状态",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "width": "100%",
     "row": "cards-0"
    },
    {
     "type": "points_card",
     "text_ref": "无限制授权怎么接在Claude上",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "width": "100%",
     "row": "cards-1"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-09",
    "component_order": [
     "chapter_title",
     "notice",
     "prose",
     "points_card",
     "inline_link",
     "bullet_list",
     "section_heading",
     "tag",
     "monospace",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·两个Hook、无限制授权的接线",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "Hook和个人资料状态",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "无限制授权怎么接在Claude上",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-09",
    "component_order": [
     "chapter_title",
     "notice",
     "prose",
     "points_card",
     "inline_link",
     "bullet_list",
     "section_heading",
     "tag",
     "monospace",
     "icon"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "由 `tools/Invoke-ClaudeRootHooks.ps1` 安装：把检查脚本 `claude_root_runtime.py` 按内容哈希放进 `E:\\Data\\AppData\\Claude\\managed-hooks\\claude-root\\runtimes\\<sha256>\\`，写一份 `active-runtime.json` 记下现用的版本，再合并进 `~/.claude/settings.json`，保留原有的其他设置和 Hook。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "改了设置，要等宿主重新读取设置后才生效。",
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
   "asset": "_library/titles/title-257875ef3ab006a2be38.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-257875ef3ab006a2be38",
   "title_text": "人话要点 · 两个 Hook、无限制授权的接线",
   "sha256": "9aaca6ea90a901e87f1a1a8363ca638a3034bda2f208c22bbd1d11decac8699b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 两个 Hook、无限制授权的接线

### Hook 和个人资料状态
Hook 是 Claude 在固定时刻自动运行的程序，现在有两个，共用一份检查脚本：UserPromptSubmit 在本人提交消息时带入状态；Stop 在回复结束前核对本轮真实汇报的目标、版本、验收和缺口，并对实际业务被资料锁拦下的回执做兜底。有 GPT 子任务在跑时，它还看覆盖全部运行任务的后台 Watch 挂没挂；漏挂、资料被拦或验收缺口各拦一次，同一回合第二次只提示。根会话还有 GPT 等候、原生后台子代理或后台命令没跑完时，Stop 用一个会话级的异步唤醒（asyncRewake）保活：从主对话最近一次真实活动（新消息、主对话的工具调用、下一次停止）起算 55 分钟，多个任务共用这一次唤醒；任务全结束或确认不了还在跑就静默结束，仍有后台任务且主对话空闲满 55 分钟就叫醒它，主持可以接着等。子代理自己的进度和发消息不算主对话活动；这个保活不改 Watch、Resume 的内部续等，也不影响子任务执行。读汇报、核对成果仍是根会话的事。10 月 20 日上午核对：设置里的 Stop 已登记这个异步唤醒，安装的检查脚本指纹与源码一致；已开着的对话是否重读了设置、实际叫醒过没有，没验过。没有子任务在跑、也没有被拦业务信号的普通技术任务，照常结束。

**装在哪**
- 由 `tools/Invoke-ClaudeRootHooks.ps1` 安装：把检查脚本 `claude_root_runtime.py` 按内容哈希放进 `E:\Data\AppData\Claude\managed-hooks\claude-root\runtimes\<sha256>\`，写一份 `active-runtime.json` 记下现用的版本，再合并进 `~/.claude/settings.json`，保留原有的其他设置和 Hook。
- 改了设置，要等宿主重新读取设置后才生效。

**带进什么**
- 提交消息时的那个只带进四样：本会话的编号（`session_id`，原文叫“会话坐标”）、本会话的型号和思考档位、共享的个人资料状态、已核验的无限制授权。
- 提示 Hook 不拦消息、不授予权限；只存本轮状态、截止和非私密标识的小缓存，提示正文只留指纹。Stop 有界读取当前轮末尾，认真实业务保护回执和声明为个人领域的实际 Skill 调用；不认模型自白、子报告、源码或搜索例子，不解析子报告来替本人解锁。
- 型号和档位写明来源：先用宿主随消息给的值，缺的才读这个会话在 Claude 桌面里保存的设置；两个来源的型号对不上时档位写“未知”，读不到也写“未知”，不拿全局默认或模型清单补。
- 这份型号和档位只给省额度的分工作参考，不是能不能派活的门槛。

**资料状态**
- Claude 会话和本机、图形界面、电脑 MCP 共用同一份个人资料状态。
- 查状态直接调 `CheckPersonalDataAccess -PrivacyLevel factor`，不用带对话号或消息号；业务入口里的 `personal_data_access.py` 自己也查这份状态，不必先另查一遍。
- Hook 缺失、或者送没送到不清楚时，会话里的资料状态先按“不明”处理，需要时从正式的只读入口读回；身份由密码中心现场核验。
- 根会话锁着或不明时，需要资料就第一步请本人验证，通过后再查资料、派活和完整作答；未知先用 StatusPersonalEnvironment 重读。子代理只单行交回实际资料缺口，不自己验证。Stop 依据实际回执检查，同轮第二次只提示，最多 30 秒；解析失败只放行受影响项并诊断，不弹窗口、不回显对话或思考。纯技术工作照常。

### 无限制授权怎么接在 Claude 上
本人看到的流程见本页开头〔开授权的四步〕；下面是接线细节。
- Hook 认出请求后调用已安装的 `Invoke-OwnerTakeover.ps1 -Operation Open -HostTaskId <session_id> -HostHarness claude-code`。
- 模型不手动一步步走 `Configure`、`Prepare`、`Activate`、`Check`，也不重复弹窗。
- 验证成功后，下一条真实消息由 Hook 用 `CheckHost -HostHarness claude-code` 读回。
- 对话范围的授权只绑发起它的那个 Claude 会话。
- 本地动作启动的子进程，显式带上三个相同的授权信息：`PCCONFIG_OWNER_SESSION_REF`、`PCCONFIG_OWNER_REQUEST_ID`、`PCCONFIG_OWNER_EXPIRES_AT`。

::screen{#rule-claude-adapter-10 section="points"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-10",
  "section": "points",
  "title": "人话要点：受信任 AI 的其他能力、官方升级",
  "scene": "横版 16:9。左右两张卡：左“受信任 AI 的其他能力”约 60% 宽，图标是一枚刻着星芒的小铜牌；右“官方升级”约 40% 宽，图标是一个正在转的小箭头圆圈围着一个应用图标。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰；英文名、路径、命令用等宽字体、浅绿底小框（反引号不画）。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。“## …”是本屏大标题，左上一行深绿大字，井号不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16。竖版：大标题在上，两张卡从上到下各占整宽。字和横版完全一样。",
  "links": [
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
   }
  ],
  "anchors": [
   {
    "id": "p-trusted",
    "text": "受信任 AI 的其他能力"
   },
   {
    "id": "p-upgrade",
    "text": "官方升级"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·受信任AI还能做什么、官方升级以后",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "受信任AI的其他能力",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "60%"
    },
    {
     "type": "points_card",
     "text_ref": "官方升级",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards",
     "width": "40%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-10",
    "component_order": [
     "chapter_title",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·受信任AI还能做什么、官方升级以后",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "受信任AI的其他能力",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "官方升级",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-10",
    "component_order": [
     "chapter_title",
     "points_card",
     "section_heading",
     "bullet_list",
     "prose",
     "monospace",
     "inline_link",
     "icon"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "可以用密码中心现役入口里、已登记的运行时实际能用的动作和秘密引用（`SecretRef`）。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "浏览器自动填密码已经退役，不再用 `AgentLogin`；手机号和验证码登录按〔能力与运行方式〕和宿主当时的真实能力处理。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7100f0861eb7ba51b4be.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-10-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7100f0861eb7ba51b4be",
   "title_text": "人话要点 · 受信任 AI 还能做什么、官方升级以后",
   "sha256": "0c86817afbadde8026d62b410d94fae2cc2ae230f2bc811f203c0feee5cdb4a3",
   "status": "ready",
   "source_box": [
    49,
    50,
    1369,
    167
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 受信任 AI 还能做什么、官方升级以后

### 受信任 AI 的其他能力
和 Codex 桌面版一样，下面这些都由 `SecretBroker` 现场核验本人的 Windows 账户和实际的桌面来源：
- 可以用密码中心现役入口里、已登记的运行时实际能用的动作和秘密引用（`SecretRef`）。
- 浏览器自动填密码已经退役，不再用 `AgentLogin`；手机号和验证码登录按〔能力与运行方式〕和宿主当时的真实能力处理。
- 运行时可以把秘密写进密码中心（`AgentSecretFromStdin`），回执必须是发起请求的同一主体。
- 登记不需要验证因子的账号恢复时，用 Claude 自己的那份解锁信封。
- 登记电脑 MCP 的凭据：在 Claude 会话的进程树里、不提权运行 `Manage-RemoteComputerMCP.ps1 -Action SetupCredentials -RuntimePrincipal claude-root`。
- 请本人验证的提示只能由主对话发出，因为子代理的文字不会显示在本人的对话里。

和 Codex 不同的地方：
- 新电脑从私人仓库恢复（`RecoverFromPrivateGit`）时登记的是 Codex 桌面版；Claude 在新电脑上用 `EnrollRuntimeAuthority` 自己登记。
- 电脑 MCP 登录不继承任何一方的身份。

### 官方升级
- 官方更新后，仍按本人的 Windows 账户、登记的应用包族和桌面应用本体认身份。
- 应用版本号、引擎版本目录、构建号、运行时密钥续绑，都不是门槛。
- 新电脑通过正式入口登记。
- 当前启动链证明不了来自桌面版时，只停掉依赖这个身份的能力；不借另一个桌面进程或环境变量补身份。
- 撤销 Claude 的受信任身份用 `RevokeRuntimeAuthority -Query claude-root`，不影响 Codex。
- Hook 的内容哈希只保护 Hook 自己，不代表应用版本。

::screen{#rule-claude-adapter-11 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-11",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": null,
   "to": "## 派子代理：Claude 的不同处",
   "start": 0,
   "end": 774,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E187 版，一字不改”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放页名、owner 行、导语和“## 身份”一节；右卡放“## 思考档位”一节：档位表画成两列细线表格（表头“档位”“含义”，分隔行“|---|---|”不画、竖线不画），表下接 Ultracode 那一段。",
  "portrait": "竖版 9:16：“原文 · E187 版，一字不改”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "用户授权的受信任 AI 规则",
    "href": "/rules/authorization/#受信任的-ai"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-11",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-11"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "Claude适配",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "思考档位",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-11",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace",
     "table"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "Claude适配",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-11",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace",
     "table"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-claude-adapter/rule-claude-adapter-11-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-db1bc4ddc30dee2303c6",
   "title_text": "Claude 适配",
   "sha256": "cb33b3df79fa7c7c402a5a2dc20a747abd4d7d8abfb6cb3aa71c4b198ee9364d",
   "status": "ready",
   "source_box": [
    32,
    50,
    722,
    227
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-claude-adapter/rule-claude-adapter-11-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2a9c9e9976421a9d9726",
   "title_text": "身份",
   "sha256": "a6a546a0510901f6e3f04302f04d732e061291ebf0d1d3c477a5dcc2467a5d51",
   "status": "ready",
   "source_box": [
    45,
    493,
    149,
    558
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-claude-adapter/rule-claude-adapter-11-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-50301cdf60dfb599a2f2",
   "title_text": "思考档位",
   "sha256": "b35a3eae339f8271e50af04c9ec8f77d4c4a9b5657aaa5a5a8aabe9364e9f5b4",
   "status": "ready",
   "source_box": [
    856,
    291,
    1044,
    358
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E330 版，一字不改

# Claude 适配

owner: `E:\.agents`

只在用到 Claude 桌面版特有机制时读；共同原则见其他专题。

## 身份

桌面身份、登记和撤销按[用户授权](/rules/authorization/#受信任的-ai)。Claude 桌面及其真实后代沿桌面祖先识别为 `claude-root`，嵌套模型不改变主体。GPT 包装器默认起独立执行者，没有该桌面身份；真正需要桌面身份的密码中心凭据步骤交回根会话。

## 思考档位

Opus 5.5、Sonnet 5.5 和 Fable 5.1 用同一套档位，从低到高是 low、medium、high、xhigh、max：

| 档位 | 含义 |
|---|---|
| low | 思考最少，只做机械、明确、结果能马上核对的小事 |
| medium | 均衡；Opus 5.5 的默认档，常规检索、调研、实现和审查够用 |
| high | 全面推演，跨模块调查、完整子系统、实质审查 |
| xhigh | 扩展推理，困难设计、疑难排障、关键审查 |
| max | 最深推理、最贵、最慢；评测分数不一定比 xhigh 高，不当做错后的默认下一步（见[分工与并行施工](/rules/execution-coordination/#做错了怎么办)） |

主对话默认用 xhigh：本人新开对话时选一次，App 会记住；AI 开的新对话也用 xhigh。难题、完善底座这类难活临时升到 max（本人 2026-10-30 决定）。

Ultracode 不是比 max 更高的档，而是 xhigh 加多智能体编排（工作流），只在本会话有效；提示词里出现“ultracode”一词只让这一轮改用编排，不改变档位。`auto` 表示没固定档位，以实际记录为准。

::screen{#rule-claude-adapter-12 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-12",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "## 派子代理：Claude 的不同处",
   "to": "- **从包装器进入。**",
   "start": 774,
   "end": 3302,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 派子代理：Claude 的不同处”和它下面的导语、五条；右卡放“### 本人授权时派 GPT”小标题（比“##”小一号）和“先看授权覆盖什么”“默认分工”两条。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#重大动作前的把关"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-12",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-12"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "派子代理：Claude的不同处",
     "whole_block": true,
     "columns": 1,
     "row": "original-1",
     "width": "100%"
    },
    {
     "type": "source_text_card",
     "text_ref": "派GPT",
     "whole_block": true,
     "columns": 1,
     "row": "original-2",
     "width": "100%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-12",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "派子代理：Claude的不同处",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-12",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/titles/title-9583cedf9141c56ec395.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-12-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9583cedf9141c56ec395",
   "title_text": "派子代理：Claude 的不同处",
   "sha256": "8abf5050d4467a77dfe5f04afe1593bca42657cb9b0cd9c17206e91f95d931b6",
   "status": "ready",
   "source_box": [
    132,
    281,
    614,
    349
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

原文 · E330 版 · 续

## 派子代理：Claude 的不同处

共同原则见[分工与并行施工](/rules/execution-coordination/)，可派范围见 `config/model-roster.json`。

- Claude 自己的子代理先按下一条用 API 额度派，用不了时用 Agent 工具派。Agent 工具没有档位参数，要选型号和档位就选对应的子代理类型：`sonnet-low`、`opus-low`、`opus-medium`、`opus-high`、`opus-xhigh`、`opus-max`。派给谁按模型清单 `routing` 的场景表：现在 Claude 子代理主要做独立复核、头脑风暴、分析和抽查，以及要惊艳的样板和关键部分；场景表交 GPT 的活，GPT 实际调用报登录、额度错误，或需要的工具、身份确实用不了时才交 Claude 子代理，不预先查额度判断；纯机械的小事这时交 `sonnet-low`；做错了换人时也可以换到 Claude（见[分工与并行施工](/rules/execution-coordination/#做错了怎么办)）。
- **先用 API 额度。** 本人每月有 200 美元赠送的 Anthropic API 额度，北京时间每月 27 日重置，没有自动充值，每月必然用完。原本要派的 Claude 档位子代理，先用 PowerShell 工具在后台（`run_in_background:true`，`timeout` 7200000）运行 `E:\.agents\tools\Invoke-ClaudeApiChild.ps1 -Agent <同名档位类型> -PromptFile <派单绝对路径> -WorkDir <工作目录绝对路径> -TaskName <短名，只用字母、数字和连字符>`；型号、档位和派单内容都和原来一样，其他分工照旧。API 子代理不加载 MCP，要用浏览器、Google、副机这类 MCP 工具的活直接用 Agent 工具派。每个对话同时最多 3 个 API 子代理，多出的直接用 Agent 工具派，由根自己记着，不写计数。读回执：`succeeded` 就读 `result_file` 验收；`use_desktop=true` 时用 Agent 工具派同一档位类型，`did_work=false` 原样重派，`did_work=true` 在派单后附上回执里的 `handoff_note` 接着做；没拿到回执也按 `use_desktop=true` 处理，派单后加一句“先看工作目录的 git 状态，已经做过的不重做”；`key_problem`、`key_delivery_failed` 另外告诉本人一句。脚本碰到余额不足就记本账期已用完，27、28 日也一样；标记到下一个北京时间 27 日重置前有效，有效期间不调 API、不试探，直接返回 `use_desktop=true` 和桌面续做派单。标记只由脚本按账期读写，不查余额、不定时探测、不手动清；AI 不读取这份标记判断额度或分工，只按脚本回执接续原任务。根会话直接用 Agent 工具派这几类档位时，受管 Hook 会拦下并给出上面的命令；属于上面三种直接派的情况时，在派单里加一行 `API 回退：MCP`、`API 回退：已有3个` 或 `API 回退：use_desktop` 再派。
- 内置的 `general-purpose`、`Explore`、`Plan` 连型号带档位都跟根会话走，根会话开 max 时它们也按 max 跑，拿来做检索很贵；整段一两步就能查完的检索根会话自己做（约法 L22）；成批的只读检索和机械小事按模型清单交 Sol（Luna 只生图），GPT 用不了时改派 `sonnet-low` 或 `opus-low`。`Explore`、`Plan` 不读 CLAUDE.md，只做只读检索。Agent 工具的 `model` 参数只换型号、不换档位，不用它派 Sonnet。
- 派 GPT 时走下面的包装器入口，不把 Codex 的 `openai_child` 或它的专用判断角色当作 Claude 的接口。
- 工作流（Workflow）是确定性的多代理编排，适合大范围扇出、交叉核对和可恢复的批量活；只在本人开启 Ultracode、明确要求或技能要求时用，每个 `agent()` 显式传 `effort`。扇出规模按任务、风险和实际可用容量定，按需保存可接续的检查点，不查询剩余额度，也不按额度削减分工或质量。
- 独立复核按共同原则安排；重大动作的型号、最低档位和职责见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)，需要另派时选符合要求的档位子代理类型。

### 派 GPT

- **先看授权覆盖什么。** Claude 自己的子代理及 GPT Sol、Terra、Luna 可直接派（约法 L23）；Astra 必须已有授权覆盖本次项目、对话、期限和选型限制。“本对话直到叫停”不跨对话，“一个项目”不跨项目，同时限定项目和期限就同时遵守。覆盖时直接派，不逐次问，也不扩大许可。
- **提醒本人授权 Astra。** 无授权而任务属于 `routing.vendor_rule` 的提醒场景时，规划阶段提醒一次（约法 L23），说明优势和未授权替代，不为提醒查询或估算本人账号额度；本人答复注明对话或项目后按范围派。等待时做独立部分，派活时仍无答复就用替代，交付说明；同一活不重提，本人说不用则本对话不再提醒。
- **默认分工和选型。** 按模型清单 `routing` 和[共同选型原则](/rules/execution-coordination/#派子代理的原则)，每次显式传 `-Model`、`-Effort`；档位及旧值映射只见清单。GPT 涉及本人价值、偏好和理解的内容单列后由 Claude 把关。Astra 可再派 Sol、Luna，范围和授权仍沿用父任务。

::screen{#rule-claude-adapter-13 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-13",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "- **从包装器进入。**",
   "to": "命令参数按需查",
   "start": 3302,
   "end": 5476,
   "approved_omissions": []
  },
  "title": "原文（三）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“从包装器进入”“资料与权限”“交代和交付”“保存和接续”四条；右卡放“常用命令如下……”一段和下面的代码块：代码块画成浅灰绿底、细边的等宽字体框，第一行“```powershell”和最后一行“```”不画，中间七行照抄、每行一行（太长的行在框内自动折行，折行处缩进）。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/#原生容量不足与原线程接续"
   },
   {
    "text": "Codex 适配中的已授权转用",
    "href": "/rules/codex-adapter/#原生容量不足时转用共用包装器"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/#长期授权"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-13",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-13"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "从包装器进入。",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "派活单和预算。",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-13",
    "component_order": [
     "source_text_card",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "从包装器进入。",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-13",
    "component_order": [
     "source_text_card",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
  }
 },
 "images": []
}
```

原文 · E330 版 · 续

- **从包装器进入。** 使用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，`-ParentHarness` 默认 `Claude`。Start、Resume 走私有 AppServer（后台服务）；Start 默认独立执行，Resume 沿用已存方式。确需桌面身份可传 `-Detached:$false`，或只把凭据动作交根。运行中纠偏用同轮 Steer。不直接调用 `codex exec`、Codex 的 `openai_child` 或专用判断角色。共用容量和接续见[分工与并行施工](/rules/execution-coordination/#原生容量不足与原线程接续)；`-ParentHarness Codex` 只供[Codex 的已授权转用](/rules/codex-adapter/#原生容量不足时转用共用包装器)，不搬用 Claude 的型号许可。
- **资料与权限。** Codex 子任务按正常 Codex 配置和当前授权工作，不复制 Claude 对话授权值，不另加沙箱或审批覆盖。独立执行者没有桌面祖先身份：真正依赖密码中心桌面身份的凭据步骤交回根会话，其余已授权步骤照常完成；不另行登录、转交秘密或改身份核验来补。资料需求、共享资料期和缺口交回按共同原则第 7 条。
- **派活单和预算。** 字段、模板、预算、参数和验收只见派发说明（`E:/.agents/docs/claude-gpt-child-dispatch.md`）；修改仓库用任务专用工作树。
- **和真人说话。** 子任务要以本人身份和真人对话（客服、商家、卖家、房东、平台人工、微信联系人）或替本人拟要发出的消息时，派单必须写一行“和真人说话按 reply-as-me”；包装器在派单出现客服、商家、卖家、房东、人工、聊天等字样又没写这一行时自动补上，只是兜底。
- **交代和交付。** 子任务是非交互的：技术做法自己定，不能自己定的需求或取舍写进最终汇报，由根会话整理；先做完不依赖该决定的工作，不在无人回答的地方等提问。交付简短结论、必要证据和汇报路径，除任务明确要求网页外，不做可视化，也不打开窗口。任务范围内的核对、验收或操作需要管理员时，直接按[用户授权的静默提权做法](/rules/authorization/#长期授权)执行。会影响其他会话的决定写到对应项目文件；仅在同改一处、发生事故或确需协调时发消息，不用中途进度刷屏。
- **保存和接续。** 保留会话，不加 `--ephemeral`；Claude 默认不启用 `-ContinueOnQuota`。失败、超时或额度恢复后在原线程 Resume，具体接续按共用专题。会话保存、CLI 列表和桌面即时可见分别报告，不保证运行中可在桌面输入，不为刷新列表重启桌面。
- **命令不断线。** 独立隐藏执行者不随 Claude 退出或更新停止。等候须覆盖全部运行任务，按回执 `watch_command` 挂后台 Watch，不另挂 Backstop；订阅和回执见派发说明。
- **后台命令时限。** 长时间 Start、Resume、Watch 显式设 `run_in_background:true`，`timeout` 用回执 `watch_timeout_ms`（当前 7200000 毫秒）。Watch 周期不改变任务截止，监测和停止入口由独立执行者持有。
- **时间按需延长。** 派活单时限优先，无派活单才用 `-TimeoutSeconds`（默认 7200 秒）。截止前总时长的 10%（5–30 分钟）返回一次 `deadline_soon`，先 Steer 交已有结果；根调整范围或做法及新时限后才 `Extend -Minutes N -Reason` 并重挂 Watch，不自动延期。超预算续作用 `Resume -Minutes N -Reason`；N 默认为本轮预算，显式 `-TimeoutSeconds` 时加在秒数上，两者都没给就拒绝。无人处理时自动提醒收尾，接受提醒后宽限 1–3 分钟，以 `timeout` 停止。
- **执行者消失和重启。** 进程号或启动时间对不上时标 `failed/runner_gone`；Watch 发现可恢复任务给 `runner_gone_recoverable`、`recovery_command`。Claude 恢复先用 `Recover -SessionId <完整父会话号>`：仅续作该父会话下执行者消失、最新轮无非空报告、未永久删除的任务，原线程核对半截产物，能续就续，不能续就重做。单项失败不挡其他任务；已有报告交根验收，归属不明旧目录用 Status 核对后手动 Resume。恢复后照 `watch_command` 覆盖所有运行任务；后台命令结束不证明子任务停止。
- **结束后清理。** 按派发说明验收后清理。Stop 默认保留线程和成果，只有显式 `-DeleteThread` 才永久删本轮线程及后代；清理只处理本任务登记的临时文件，保留汇报、代码成果，不追删已归档对话。失败留回执，不改任务结局。

::screen{#rule-claude-adapter-14 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-14",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "命令参数按需查",
   "to": "- **要在新会话里验收的**",
   "start": 5476,
   "end": 7223,
   "approved_omissions": []
  },
  "title": "原文（四）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“Steer 的长消息……”一段；右卡放“## 宿主接线”和它下面的前六条（技能、临时目录、档位子代理、记忆、MCP、浏览器）。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "共享经验的落点",
    "href": "/rules/context-sources/#共享经验的落点"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/#常用入口"
   },
   {
    "text": "能力与运行方式的浏览器规则",
    "href": "/rules/capabilities-runtime/#浏览器"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-14",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-14"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "命令参数按需查",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "宿主接线",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-14",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "命令参数按需查",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-14",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-claude-adapter/rule-claude-adapter-14-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-14-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e7bbcf30556086ec443a",
   "title_text": "宿主接线",
   "sha256": "f90965ca91c6268c3f9caceda355a5b9bf05923f8077d4a507aa4fecf2ff7e0f",
   "status": "ready",
   "source_box": [
    851,
    14,
    1216,
    159
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E330 版 · 续

命令参数按需查 `Get-Help E:\.agents\tools\Invoke-ClaudeGptChild.ps1 -Full`。Steer 长消息或含中文引号时用 `-PromptFile`，不同时传 `-Message`；用 Status 核对是否接受、是否被模型看到及汇报中的处理结果，不把入队当成完成。Resume 只用于已结束的原线程，沿用原型号、档位和脱离方式。

## 宿主接线

- **技能**：`~/.claude/skills` 是指向 `~/.agents/skills` 的目录链接，和 Codex 共用同一个发现根和技能清单，不生成第二份副本。新技能写到 `E:\.agents\skills` 后走现有安装器，不在 `~/.claude/skills` 下直接新建。
- **临时目录**：任务临时文件放 `E:\Cache\Claude\Temp\<会话号前 8 位>`，并把子进程的 `TEMP|TMP|TMPDIR` 指过去。子代理和主会话共用这个会话目录，所以子代理用自己的子目录（例如 `<会话目录>\sub-<名字>`），收尾只清理自己建的子目录，不清理会话目录本身。根会话收尾也只清理自己建的文件和子目录，不按整个目录批量清理：同一目录下的 `personal-status` 是资料钩子给本会话留的状态缓存。宿主给的会话 scratchpad 路径超过 200 个字符，会让 pdftoppm、git 等工具报假失败，不当临时目录用。
- **档位子代理**：规范源是 `templates/claude-home/agents/`，`~/.claude/agents` 是指向它的目录链接。
- **记忆**：Claude 账号聊天记忆已关闭，Claude Code 的关闭配置为 `~/.claude/settings.json` 中的 `autoMemoryEnabled=false`；需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Claude 工具的已核实教训归本专题。
- **MCP**：用户级配置在 `%USERPROFILE%\.claude.json`（`claude mcp add -s user`）。Google 业务按[能力与运行方式](/rules/capabilities-runtime/#常用入口)，走 PCConfig 的 `google-workspace` stdio 入口，不接 claude.ai 的云连接器。电脑 MCP 只认目标机登记过的客户端；Claude 的 OAuth 回调固定为 `http://localhost:<端口>/callback`，不能复用 Codex 的 `127.0.0.1` 客户端，要在目标机登记独立的 Claude 客户端和固定回调端口。主机上的 Claude 直接用本机工具，不连本机的电脑 MCP。
- **浏览器**：Claude 根和子代理访问网站、看网页、查网页资料或使用本人登录状态，一律派 GPT（AppServer）用 Codex Chrome 插件在本人 Chrome 自己新开的后台标签页里做，Exec 不接这类任务。Claude 桌面版内置浏览器（`mcp__Claude_Browser__*`）只用于本机文件和本机回环地址（`127.0.0.1`、`localhost`、`[::1]`）的本地预览，不用于任何网站；`preview_start` 按 name 启动时只允许 `.claude/launch.json` 中的本地开发服务器。Claude in Chrome 扩展继续由 Hook 拦截，本人当轮明确点名时放行的例外保留。GPT 的 Chrome 通道不通时按[浏览器规则](/rules/capabilities-runtime/#浏览器)和 `browser-control-continuity` 无窗口修一次；仍不通就停下网页步骤、交回卡点，不由 Claude 内置浏览器或无头浏览器代做。选型与 Astra 授权照常；这是可由本人当场改的默认。

::screen{#rule-claude-adapter-15 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-15",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "- **要在新会话里验收的**",
   "to": "## Hook 和个人资料状态",
   "start": 7223,
   "end": 9852,
   "approved_omissions": []
  },
  "title": "原文（五）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。一张整宽大卡片，放“宿主接线”的后五条（改了 MCP 之后的验收、权限、文件预览、按命令文字拦截的删除、写路径和中文的坑），每条之间留一点空。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   },
   {
    "text": "Claude 入口模板",
    "href": "../../templates/claude-home/CLAUDE.md"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-15",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-15"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "要在新会话里验收的",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-15",
    "component_order": [
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "要在新会话里验收的",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-15",
    "component_order": [
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  }
 },
 "images": []
}
```

原文 · E330 版 · 续

- **要在新会话里验收的**（Hook、MCP、技能）：用真正的新桌面会话，运行中的会话仍持旧 Hook 和 MCP。`spawn_task` 继承型号档位，不用于此项验收；给可复制提示，首行注明 Sonnet 5.5、low，让本人新开、选好后粘贴，结果交回或由根回读。MCP 原命令可按 `%USERPROFILE%\.claude.json` 的 `mcpServers` 跑 stdio 作补充，两种证据分开。嵌套 `claude -p` 没登录、也非新桌面会话，不能代替，不为它登录或转交凭据。
- **权限**：用户设置里全局使用 `permissions.defaultMode=bypassPermissions`，和 Codex 的完全访问对等；不用 auto 模式或 `autoMode` 条目复制授权。宿主固定拦截的操作（删除盘根或一级目录、`Remove-Item` 通配、前台长时间 sleep、`AskUserQuestion` 等）不是停工理由：改用字面子路径、回收站工具（见[工程与交付](/rules/engineering-delivery/)），或用后台任务、Monitor 等待。
- **给本人的回答只写在回他那一轮的最后一段。** 本人只看最终输出，不看思考摘要；两次工具调用之间的文字可能被缩成一句摘要，夹在中间的答案会被缩没。被子代理或命令唤醒的那一轮，本人等于没看见。对本人问题的回答、要他知道的结论，都写在回他消息那一轮的最后一段；唤醒轮里得出的结论，留到他下一条消息时再说，或写进汇报页。本人一提问，这一轮先答；清理临时文件、更新驾驶舱、记录这类收尾排在回答之后。本人在线等着定事时，先用一两句回结论，查证和记录放后面，查完要改口再单独说；没核实的说成暂定。
- **本人不在时不弹要他点的东西。** 本人说去睡了、出门了，或说只看最终汇报时，不发新对话提议卡片，也不在收尾框里提问：提议卡片会让这个对话在侧栏显示“需要你”，本人会以为任务卡住了。要提的后续事项和问题都写进最终汇报。
- 清理、删除或其他因 Claude 硬限制卡住的已授权事项，按[Claude 受限的事项交给 Codex](/rules/execution-coordination/#claude-受限的事项交给-codex)提醒本人并提供接手提示词。
- **文件预览**：工作区外的链接按 [Claude 入口模板](/rule-sources/templates/claude-home/CLAUDE.md)的文件预览要求办理；该模板随活动版本部署，命令行目录设置不能代替桌面预览权限。
- **按命令文字拦截的删除**：Claude 桌面版会拦住同一条 PowerShell 命令里同时出现 `Remove-Item` 和 `E:\PCConfig` 字样的调用；它只看命令文字，不看实际删什么，被拦时整条命令都不执行。删任务临时目录单独写一条命令，读 `E:\PCConfig` 的 git 命令放另一条。临时文件按[工程与交付的清理入口](/rules/engineering-delivery/#下载临时文件和清理)处理。
- **定时任务的结果送回等结果的对话**：用 `scheduled-tasks` 建的任务到点在它自己的新会话里运行，本人看不见那个会话；桌面版 `notifyOnCompletion` 的完成通知只对 Dispatch 会话生效，Code 页的对话收不到。所以任务会话每段做完，都用 `mcp__ccd_session_mgmt__send_message`（`SendMessage` 在没人打开的会话里会被拦）把这一段的结果用几句中文发给等结果的对话，返回 delivered 或 queued 才算送到；wrap_up 和驾驶舱回执都不算。建任务时在任务说明里写一行 `【结果送到】local_<完整会话号>` 指定等结果的对话，确实不用送的写 `【结果送到】不转发`；没写这一行时按正文里“发给/转到 local_…”找，再没有就是建任务的对话。例行无变化的一轮用结论回执带 `--routine` 写明，不转。驾驶舱回执照[能力与运行方式](/rules/capabilities-runtime/#汇报网站和自动运行的东西)“定时任务的结论写进驾驶舱”写，要本人做或选的另登记“需要你”。兜底：结束钩子（`tools/scheduled_delivery.py`）看到最近一段做完后还没送到，就拦回去补发一次；驾驶舱每分钟检查，到点半小时没开工、做完没送到、开工两小时还没送到的，登记“需要你”推到本人手机（PCConfig `docs/runtime/scheduled-delivery-watch.md`）。原对话也可读运行记录（`list_task_runs`）。一次性任务跑完可以删，驾驶舱照样按回执显示 3 天。
- **“联系某个对话”是发给已开着的那个对话**：本人说联系、交给、转给某个对话（或“合适的对话”），是用 `mcp__ccd_session_mgmt__send_message` 把事发给那个已有对话，不新开对话；找不到是哪个时先按标题和最近活动找，仍不确定再问本人一句。
- **写路径和中文的坑**：Bash 工具会先把命令里的双反斜杠变成单个（单引号里也一样），Bash 再吃掉引号外的反斜杠，所以引号外的 Windows 路径写一个还是两个反斜杠都会坏（`E:\\.agents\\skills` 最后成了 `E:.agentsskills`，读不到文件，写文件则落到别处）；在 Bash 里写路径用正斜杠 `E:/...` 或放进单引号。内联脚本里的 Windows 路径会让 `\3`、`\r` 这类被当成转义、写出控制字符；PowerShell 工具的命令要整体再解析一次，双引号字符串里的中文弯引号“”会被当成引号，整条命令报语法错、一步都不执行。所以含 Windows 路径、中文引号的文字（脚本、提交说明、文档片段）先用 Write 工具写成文件，路径用原始字符串，写完检查没有控制字符。给 `pwsh -File` 传数组参数会被拼成一个字符串，要传数组就在当前会话里用 `&` 调用，或改用 `-Command`。

::screen{#rule-claude-adapter-16 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-16",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "## Hook 和个人资料状态",
   "to": "## 受信任 AI 的其他能力",
   "start": 9852,
   "end": 11934,
   "approved_omissions": []
  },
  "title": "原文（六）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## Hook 和个人资料状态”两段；右卡放“## 无限制授权”两段。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-16",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-16"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "Hook和个人资料状态",
     "whole_block": true,
     "columns": 1,
     "row": "original-1",
     "width": "100%"
    },
    {
     "type": "source_text_card",
     "text_ref": "无限制授权",
     "whole_block": true,
     "columns": 1,
     "row": "original-2",
     "width": "100%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-16",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "Hook和个人资料状态",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-16",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-claude-adapter/rule-claude-adapter-16-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-16-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-59f58d53cda7d226edfa",
   "title_text": "Hook 和个人资料状态",
   "sha256": "9e5c04eb3eb7f5e84979c8063f5464e337a467c872dcd2e599864017cd50ddf1",
   "status": "ready",
   "source_box": [
    54,
    175,
    482,
    244
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-claude-adapter/rule-claude-adapter-16-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-16-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7aaf9f13bf9d1731bada",
   "title_text": "无限制授权",
   "sha256": "4afd794a277c318ff0145a30758bad3941725becb6af224a0b1605b80d39871a",
   "status": "ready",
   "source_box": [
    860,
    175,
    1094,
    244
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E330 版 · 续

## Hook 和个人资料状态

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行，复用下述受管运行时和现有 GPT 包装器；结果通过工具后或恢复、新消息边界回到原会话，不用审查者直接改代码或阻塞提示。程序入口与暂停开关见上下文 Hook 运维（`E:/.agents/docs/operations/context-hooks.md`）。

`UserPromptSubmit` 每条真实新消息带来会话坐标、可核实的型号和档位、共享资料状态及已核验的无限制授权。资料需求和本人验证由根负责，按[个人资料锁与解锁](/rules/privacy-data/#个人资料的锁和解锁)和共同原则第 7 条执行；纯技术工作继续。同一驾驶舱、健康提醒每会话只提示一次或状态变化时再提示。

Stop 核对本轮真实 Report 的明确目标集合，未解锁的资料拦截、漏挂 Watch 或验收缺口可拦一次。根按原因解锁并重试或补做、补挂 Watch、补齐验收，子代理缺口须读完整报告；同轮第二次只提示。

根会话有 GPT 等候、原生后台 Agent 或 Bash/PowerShell 等未完成后台任务时，受管 Stop 用一个会话级 `asyncRewake`（异步唤醒）保活等待，按主代理最近真实活动加 55 分钟计时；新消息、主代理工具调用和下一次停止刷新活动，多个任务共用一次唤醒。未完成状态优先读宿主 `background_tasks`，GPT 执行器状态作补判；任务全结束或无法确认还在后台运行时以退出码 0 静默结束，仍有后台任务且主代理空闲达到 55 分钟时以退出码 2 叫醒，主持可继续等待。子代理自己的进度和 SendMessage 发出时刻不算主代理活动。该保活不改 Watch/Resume 的内部续等或子任务执行；宿主能力依据见官方 [asyncRewake 与后台 Hook](https://code.claude.com/docs/en/hooks#limitations)及 [Stop 输入](https://code.claude.com/docs/en/hooks#stop-input)。

程序细节、部署和维护只见上下文 Hook 运维（`E:/.agents/docs/operations/context-hooks.md#个人资料先解锁与结束兜底`），验证等待见[个人资料的锁和解锁](/rules/privacy-data/#个人资料的锁和解锁)。回执不放在回复开头，先回答本人当前的问题。

真实根提示把状态、原截止及本轮非私密标识存入小缓存，供结束检查在正式回读失败时兜底，缓存不授予资料权限。为绑定本轮，有限核对当前用户记录的标识、时间和转录字节位置，提示正文只存指纹，不持久化正文。

Stop 复用两宿主共同的版本、验收和缺口检查；资料与明确汇报验收问题合并原因，不生成 personal_data_need 状态，不启动任务。Hook 不授予资料或操作权限，不按关键词自动弹验证窗口。

Claude、本机、图形界面和电脑 MCP 共用资料状态。用 `CheckPersonalDataAccess -PrivacyLevel factor`，不必传 `RootTaskId`、`PromptId`；业务入口的 `personal_data_access.py` 已检查，不额外前置检查。Hook 缺失或投递不明时按状态不明处理，用 `StatusPersonalEnvironment` 正式回读，身份由密码中心核验。锁着或不明不取用私人资料；本人自己的问题先验证解锁，通过后再查资料、派活和完整作答，不降级回答。

## 无限制授权

本人要给当前 Claude 对话开无限制授权时，Hook 识别明确请求，直接调用已安装的 `Invoke-OwnerTakeover.ps1 -Operation Open -HostTaskId <session_id> -HostHarness claude-code`；本人在窗口里只填时长和范围，并完成一次本人验证。只有根会话的真实提示会打开窗口，子代理和工作流子会话不会。模型不手动串 `Configure/Prepare/Activate/Check`，也不重复打开。

验证成功后，下一条真实提示由 Hook 用 `CheckHost -HostHarness claude-code` 回读。对话范围的授权只绑定发起它的 Claude 会话；子代理和工作流子会话共用同一个会话编号，所以在同一授权内。Codex 线程的对话授权不适用于 Claude，反之亦然；全局授权两者都能用。本地动作的子进程显式带 `PCCONFIG_OWNER_SESSION_REF`、`PCCONFIG_OWNER_REQUEST_ID`、`PCCONFIG_OWNER_EXPIRES_AT` 三个相同的值。

::screen{#rule-claude-adapter-17 section="original"}

```typeset
{
 "screen": {
  "id": "rule-claude-adapter-17",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.claude-adapter.md",
   "release": "E330",
   "sha256": "7bf2f5f6c71923ac25c4b8f92d6064bfecbe15667c8a1af5b38889c46bcb15f9",
   "public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
   "from": "## 受信任 AI 的其他能力",
   "to": null,
   "start": 11934,
   "end": 12718,
   "approved_omissions": []
  },
  "title": "原文（七）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在圆角卡片里（白底、浅绿细边）。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 受信任 AI 的其他能力”一节（导语、五条、“不同的地方……”一段）；右卡放“## 官方升级”一段。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-claude-adapter/rule-claude-adapter-17",
  "source_logical_id": "claude_adapter_contract",
  "source_public_sha256": "b88a2b60120cac858b46ac033bc27f025bf023620e10fcc3bc442d4c8493e4e2",
  "source_rule_part": "rule-claude-adapter/rule-claude-adapter-17"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "受信任AI的其他能力",
     "whole_block": true,
     "columns": 1,
     "row": "original-1",
     "width": "100%"
    },
    {
     "type": "source_text_card",
     "text_ref": "官方升级",
     "whole_block": true,
     "columns": 1,
     "row": "original-2",
     "width": "100%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-17",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E330版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "受信任AI的其他能力",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-claude-adapter-17",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-claude-adapter/rule-claude-adapter-17-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-17-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1666410c5efb391dd986",
   "title_text": "受信任 AI 的其他能力",
   "sha256": "9d1a95e371efeec0575355ad2993d45e92bc80bedc7998af4f85dc5dc3bc1901",
   "status": "ready",
   "source_box": [
    108,
    153,
    556,
    211
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-claude-adapter/rule-claude-adapter-17-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-claude-adapter\\img\\rule-claude-adapter-17-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fe23a6356f7f7f4a3b82",
   "title_text": "官方升级",
   "sha256": "a9081e78fc4f5b9e3dba5153d3db0909e1eed41fff9f52eaef9c7d157f248481",
   "status": "ready",
   "source_box": [
    957,
    151,
    1162,
    211
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E330 版 · 续

## 受信任 AI 的其他能力

和 Codex 桌面版一样，下面这些都由 SecretBroker 核验本人 Windows 账户和实际桌面祖先：

- 已登记运行时在现役入口实际可用的密码中心动作和 SecretRef。浏览器密码盲填已退役，不再使用 AgentLogin；手机号和验证码登录按[能力与运行方式](/rules/capabilities-runtime/)及当前宿主真实能力处理。
- `AgentSecretFromStdin` 运行时写入秘密，回执必须是请求的同一主体。
- 无需验证因子的账号恢复登记，用 Claude 自己的解锁信封。
- 电脑 MCP 凭据登记：在 Claude 会话进程树内、不提权运行 `Manage-RemoteComputerMCP.ps1 -Action SetupCredentials -RuntimePrincipal claude-root`。
- 请本人验证的提示只能由根会话发出，因为子代理的文字不会显示在本人的对话里。

不同的地方：新设备管理恢复（`RecoverFromPrivateGit`）登记 Codex 桌面主体，Claude 在新设备上用 `EnrollRuntimeAuthority` 登记；电脑 MCP 登录不继承任何一方的身份。

## 官方升级

官方更新后仍按本人 Windows 账户、登记包族和桌面应用本体识别，不以应用版本号、引擎版本目录、构建号或运行时密钥续绑为门槛。新设备通过正式入口登记；当前进程链不能证明桌面来源时，只阻止依赖该身份的能力，不借另一桌面进程或环境变量补身份。撤销用 `RevokeRuntimeAuthority -Query claude-root`，不影响 Codex。受管 Hook 的内容哈希只保护 Hook 自身，不代表应用版本。
