---
{
 "title": "能力与运行方式",
 "kind": "rule-topic",
 "url": "/rules/capabilities-runtime/",
 "tagline": "用哪个工具和入口，浏览器、更新、装哪、网站和自动任务。",
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
  "page": "rule-capabilities-runtime",
  "kind": "rule-topic",
  "title": "能力与运行方式",
  "url": "/rules/capabilities-runtime/",
  "tagline": "用哪个工具和入口，浏览器、更新、装哪、网站和自动任务。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E251",
   "commit": "042d459642b979e78ff2d34c1fe3f13099a78046",
   "ruleset_sha256": "3f0a475800e7d8e30c4e55ae38127b9245a6e5d76f16a7b041cede50a5f8e102",
   "activated_at": "2026-10-10T01:51:17.678861+08:00",
   "file": "sources/rules/docs/contracts/agents.capabilities-runtime.md",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：小 AI 助手抬手从洞洞板上取下放大镜看了看又挂回去，洞洞板上的 Chrome、Gmail、Google 云盘三个标志轻轻晃动；脚边贴着“E:”的绿色储物箱里几片绿叶慢慢舒展；右下笔记本电脑屏幕上的看板里，三个小圆点状态灯依次轻轻呼吸（绿、绿、黄）；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，三块小牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E230（北京时间 10 月 9 日 09:12 起生效）",
     "meaning": "原文屏里留作快照的文字依据的规则版本（拼页时原文按当时生效的版本现读，版本由拼页程序标出）",
     "as_of": "2026-10-09",
     "source": "活动规则入口 Inspect：release_id=E230，activated_at_utc=2026-10-09T01:12:52.0976458+00:00；原文 sha256=3e12c042e5203819a13738136c9f402a3913c6400d4332e0ec75038c6c8cf85f",
     "screens": [
      "rule-capabilities-runtime-11"
     ]
    },
    {
     "id": "n-toolbox",
     "text": "登记 12 项——3 个独立小工具……1 个操作步骤……8 个指向现有项目或技能的入口",
     "meaning": "本机轻量工具清单 catalog.json 的 tools 数组条数，按 kind 分：standalone_tool 3、procedure 1、managed_pointer 8",
     "as_of": "2026-09-27",
     "source": "E:\\Tools\\LocalToolbox\\catalog.json，updated_utc=2026-09-27T07:18:35Z（北京时间 9 月 27 日 15:18）；脚本读 tools[] 逐项数 kind",
     "screens": [
      "rule-capabilities-runtime-04"
     ]
    },
    {
     "id": "n-sms-window",
     "text": "默认往前回看 60 秒、再等 30 秒",
     "meaning": "按需取码工具的默认回看窗口（-SinceSeconds，允许 0–300）和默认等待时长（-TimeoutSeconds，允许 1–120）",
     "as_of": "2026-09-27",
     "source": "E:\\PCConfig\\docs\\runtime\\sms-code.md“给 AI 的调用方法”一节；登记状态见 E:\\Tools\\LocalToolbox\\catalog.json 的 sms-code 条目 status（2026-09-27 已登记、Status 回读 ready、真实网页填写的验收待下次）",
     "screens": [
      "rule-capabilities-runtime-06"
     ]
    },
    {
     "id": "n-report-keep",
     "text": "把 14 天前的旧页放进回收站",
     "meaning": "report-page 生成新页面时顺带清理旧页面的天数（-KeepDays 默认值）",
     "as_of": "2026-09-28",
     "source": "E:\\.agents\\skills\\report-page\\SKILL.md 第 82 行",
     "screens": [
      "rule-capabilities-runtime-07"
     ]
    },
    {
     "id": "n-task-registry",
     "text": "139 项（Windows 计划任务 125 项，另有云端、Codex、笔记本和 GitHub 上的 14 项），其中 74 项是本人或 AI 为本人配的",
     "meaning": "电脑配置任务用途登记 entries 条数；按 source 分 windows 125、cloud 5、codex 4、laptop 2、github 2、电脑 MCP 服务内 1；plain.mine=true 的 74 项",
     "as_of": "2026-09-28",
     "source": "E:\\PCConfig\\registries\\task_purpose_catalog.json（最后提交 9b0853a8，北京时间 9 月 28 日 15:02）；脚本现数",
     "screens": [
      "rule-capabilities-runtime-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和它们派出的子代理从活动版本的 required_rule_paths.capabilities_runtime_contract 读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths；rules-catalog.json 的 agents.capabilities-runtime 条目"
    },
    {
     "id": "r-local-toolbox",
     "with": "local-toolbox",
     "direction": "引用",
     "flow": "“本机小工具”一条指向 E:\\Tools\\LocalToolbox\\catalog.json（唯一清单）和 Find-LocalTool.ps1（按用途检索）；清单里 8 项是指向别的项目或技能的入口（例如 PCConfig 的按需短信验证码、mojibake-doctor、pdf-render-safe、meshclip-kit、ProxyClean）。本机工具目录没有单独的项目页。",
     "source": "原文第 18 行；catalog.json 的 tools[].kind、entry"
    },
    {
     "id": "r-codex-images",
     "with": "codex",
     "direction": "派出",
     "flow": "生图默认用 Codex 自带的图片生成（模型清单记的偏好是 GPT Image 2.5）；需要委派时交 Astra；界面设计类画面先由 Astra 出几版，本人定风格后再写代码。",
     "source": "原文第 19 行；E:\\.agents\\config\\model-roster.json 的 image_generation（updated_beijing_date=2026-09-27）"
    },
    {
     "id": "r-personal-entries",
     "with": "personal-health",
     "direction": "指路",
     "flow": "个人领域问题直达各自入口：健康 → 个人健康（personal-health）、微信 → 微信直读（wechat-direct）；原件位置不明时才走个人材料查找（personal-materials）；录音精确转写 → 中文语音转写（chinese-asr）；扫描件 → 本地文字识别（localocr）。同一条关系也涉及 wechatdirect、personal-materials、chinese-asr、localocr 四个项目页。",
     "source": "原文第 20 行"
    },
    {
     "id": "r-google-provider",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "google-workspace-direct 技能只经 PCConfig 固定的 Google OAuth 连接（登记 registries\\google_workspace_provider.json，调用 tools\\Invoke-GoogleWorkspaceProvider.ps1，绑定 google-workspace.primary）读写 Gmail、Google 云盘和 Google Tasks（待办）；Google 日历冻结，不经这个入口。",
     "source": "E190 原文第 21 行；E:\\.agents\\skills\\google-workspace-direct\\SKILL.md 第 8 行和“工具缺少某项操作时”一段"
    },
    {
     "id": "r-browser-continuity",
     "with": "agents",
     "direction": "指路",
     "flow": "浏览器控制断线恢复、本地 HTML 预览时的临时服务、就绪检查和事后清理，交 browser-control-continuity 技能。",
     "source": "原文第 25、29 行"
    },
    {
     "id": "r-sms-code",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "登录本人账号要短信验证码时，AI 调 PCConfig 的 tools\\Invoke-SmsCode.ps1：读小米妙享从手机转到电脑的 Windows 通知，按关键词和长度取最新的码，只作为返回值交给调用它的 AI。",
     "source": "原文第 27 行；E:\\PCConfig\\docs\\runtime\\sms-code.md；catalog.json 的 sms-code 条目"
    },
    {
     "id": "r-phone-number",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "登录要填手机号时，号码从个人理解库的“本人基本信息”卡取（问“我的手机号”），登录一般用第一个。",
     "source": "原文第 27 行"
    },
    {
     "id": "r-report-page",
     "with": "agents",
     "direction": "指路",
     "flow": "汇报网页的生成、存放（E:\\Documents\\AI汇报\\）和 14 天到期放回收站，都按 report-page 技能。",
     "source": "原文第 33 行；report-page SKILL.md 第 82 行"
    },
    {
     "id": "r-site-update",
     "with": "wly0829-cn",
     "direction": "指路",
     "flow": "本人说“更新网站”时，按网站仓库 V:\\Personal\\Projects\\wly0829.cn 的 AGENTS.md 更新一次；不建定时更新。网站本身在第 2 批的“这个网页是怎么做的”里讲。",
     "source": "原文第 34 行；V:\\Personal\\Projects\\wly0829.cn\\AGENTS.md 存在"
    },
    {
     "id": "r-automation-cockpit",
     "with": "pcconfig",
     "direction": "交给",
     "flow": "自动运行的东西要在看板上看得见：PCConfig 的任务用途登记 registries\\task_purpose_catalog.json（139 项，每项有名字、做什么、怎么停、停了影响什么）加实时读的上次/下次/结果，由看板接口合同 docs\\runtime\\dashboard-api-contract.md 交给网站驾驶舱。",
     "source": "原文第 35 行；task_purpose_catalog.json 的 entry_contract 和 entries[].plain；dashboard-api-contract.md 第 29、87、101 行"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "指路",
     "flow": "密钥的定义、保存和提供归独立的密码中心（私有仓库 E:\\Projects\\Tools\\PasswordCenter）；取用走 local-secret-broker 技能指向的现役入口；PCConfig 只管本机安装、路径、任务和恢复接线。",
     "source": "原文第 48 行"
    },
    {
     "id": "r-pcconfig-machine",
     "with": "pcconfig",
     "direction": "归属",
     "flow": "跨项目的工具和服务、机器事实和导航、数据盘登记、快照预演—应用—回读、Codex 机器根目录和 V/Z 盘分工，都以 PCConfig 为准。",
     "source": "原文第 46、47、48、50 行"
    },
    {
     "id": "r-skill-supply",
     "with": "agents",
     "direction": "归属",
     "flow": "技能和插件正本在 E:\\.agents\\skills、E:\\.agents\\plugins，安装按 config\\personal-skill-supply.json和现有安装器，用户目录只放发现链接；要查装没装、登记坏没坏时跑只读体检脚本 tools\\Invoke-ControlPlaneDoctor.ps1，它只看安装和登记。",
     "source": "E207 原文第 50 行；personal-skill-supply.json 的 install=true 28 项（北京时间 10 月 2 日现算）"
    },
    {
     "id": "r-cloud-asset-channel",
     "with": "skill:cloud-asset-channel",
     "direction": "指路",
     "flow": "反复读的文件经 cloud-asset-channel 技能（E:\\.agents\\tools\\Invoke-CloudAssetChannel.ps1）上传 R2 桶 wly-ai-assets，按 https://ai.wly0829.cn/<SHA-256>.<扩展名> 给云端读者；结论经收件箱回本机。",
     "source": "E208 草稿 docs/contracts/agents.capabilities-runtime.md“## 云端素材通道”；skills/cloud-asset-channel/SKILL.md"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/authorization/",
     "screen": "rule-capabilities-runtime-01",
     "text": "用户授权"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-capabilities-runtime-01",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-capabilities-runtime-01",
     "text": "工程与交付"
    },
    {
     "target": "/rules/charter/#L26",
     "screen": "rule-capabilities-runtime-01",
     "text": "L26 汇报网页"
    },
    {
     "target": "/rules/charter/#L27",
     "screen": "rule-capabilities-runtime-01",
     "text": "L27 网站"
    },
    {
     "target": "/rules/charter/#L28",
     "screen": "rule-capabilities-runtime-01",
     "text": "L28 自动运行"
    },
    {
     "target": "/rules/charter/#L29",
     "screen": "rule-capabilities-runtime-01",
     "text": "L29 浏览器和存放位置"
    },
    {
     "target": "/mcp/",
     "screen": "rule-capabilities-runtime-01",
     "text": "连接电脑"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-capabilities-runtime-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/cockpit/",
     "screen": "rule-capabilities-runtime-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-capabilities-runtime-03",
     "text": "工程与交付"
    },
    {
     "target": "/projects/personal-health/",
     "screen": "rule-capabilities-runtime-05",
     "text": "个人健康"
    },
    {
     "target": "/projects/wechatdirect/",
     "screen": "rule-capabilities-runtime-05",
     "text": "微信直读"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "rule-capabilities-runtime-05",
     "text": "个人材料查找"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "rule-capabilities-runtime-05",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/localocr/",
     "screen": "rule-capabilities-runtime-05",
     "text": "本地文字识别"
    },
    {
     "target": "/skills/google-workspace-direct/",
     "screen": "rule-capabilities-runtime-05",
     "text": "google-workspace-direct"
    },
    {
     "target": "/rules/charter/#L29",
     "screen": "rule-capabilities-runtime-06",
     "text": "约法 L29"
    },
    {
     "target": "/skills/browser-control-continuity/",
     "screen": "rule-capabilities-runtime-06",
     "text": "browser-control-continuity"
    },
    {
     "target": "/rules/charter/#L26",
     "screen": "rule-capabilities-runtime-07",
     "text": "约法 L26"
    },
    {
     "target": "/skills/report-page/",
     "screen": "rule-capabilities-runtime-07",
     "text": "report-page"
    },
    {
     "target": "/rules/charter/#L27",
     "screen": "rule-capabilities-runtime-07",
     "text": "约法 L27"
    },
    {
     "target": "/rules/charter/#L28",
     "screen": "rule-capabilities-runtime-07",
     "text": "约法 L28"
    },
    {
     "target": "/cockpit/",
     "screen": "rule-capabilities-runtime-07",
     "text": "驾驶舱"
    },
    {
     "target": "/rules/charter/#L29",
     "screen": "rule-capabilities-runtime-09",
     "text": "约法 L29"
    },
    {
     "target": "/projects/password-center/",
     "screen": "rule-capabilities-runtime-10",
     "text": "密码中心"
    },
    {
     "target": "/skills/local-secret-broker/",
     "screen": "rule-capabilities-runtime-10",
     "text": "local-secret-broker"
    },
    {
     "target": "/rules/engineering-delivery/#p-defaults",
     "screen": "rule-capabilities-runtime-10",
     "text": "日常技术默认"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-capabilities-runtime-11",
     "text": "工程与交付"
    },
    {
     "target": "/rules/engineering-delivery/#p-defaults",
     "screen": "rule-capabilities-runtime-15",
     "text": "日常技术默认"
    },
    {
     "target": "/how-this-site/#traffic",
     "screen": "rule-capabilities-runtime-05b",
     "text": "来由见〔这个网页是怎么做的〕"
    },
    {
     "target": "/skills/cloud-asset-channel/",
     "screen": "rule-capabilities-runtime-05b",
     "text": "见〔省流量的云端素材〕技能"
    },
    {
     "target": "/rules/privacy-data/#p-classification",
     "screen": "rule-capabilities-runtime-05b",
     "text": "其余照〔公开分级表〕判断"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "原文屏的页眉只写“原文 · E187 版”“原文 · 续”，没有照“分工与并行施工”页写“一字不改”：本页删了两处私事字句，再写“一字不改”较真就站不住；删字的说明放在最后一屏底部。",
    "原文里的两处 Markdown 链接（[工程与交付](agents.engineering-delivery.md)、[日常技术默认](agents.engineering-delivery.md#日常技术默认)）画成〔〕链接，看得见的字不变；前者链 /rules/engineering-delivery/，后者链 /rules/engineering-delivery/#p-defaults（工程与交付页的稿子已给“日常技术默认”定了这个锚点）。做法和“分工与并行施工”页一致。",
    "生图分工：E190 原文已写明“个人网站另按项目已定的单层分工：Luna 画、Sol 审，不合格交 Claude 定，只管网站”，第 4 屏加了一条；原来 audit.md 第 1 条说的规则和网站做法对不上，随这版规则解决。原文里的出处（owner-decisions.md 那一节）是内部出处，人话要点没写。",
    "Google 入口：E190 原文已写 Gmail、Google Drive 和 Google Tasks（待办），日历冻结；第 5 屏已跟上，audit.md 第 2 条随这版规则解决。",
    "人话翻译的取舍：“信息增益”→“能多弄清多少事”；“有界轮询”→“有次数上限的反复查看”；“受管能力”→“现有的受管办法”；“外部 Chrome”→“本人正在用的那个 Chrome”；“消费者支持的正式设置”→“程序正式支持的设置”；“派生视图”→“汇总视图”；“恢复键”→“恢复要点”；“规范源”→“正本”；“发现链接”→“让各家 AI 找得到它们的链接”；“各个宿主”→“各家 AI 程序”；“CI”写成“自动检查（CI）”；“点完由 AI 回读结果”→“本人点完由 AI 读回结果”。",
    "开头词表“独立电脑 MCP”的解释取自 E:\\PCConfig\\tools\\remote-computer-mcp\\README.md 开头和“双机入口与日常分工”表：主机、副机互相用 Codex 或 Claude 经网络连过去，在对方电脑上执行文件、命令和桌面工具。README 里还写了 ChatGPT Work 也能用这个服务，词表只写了 Codex 和 Claude 两家，没写全。",
    "四个“现在”小框（第 4 屏清单现在写的、第 6 屏取码工具现在的样子、第 7 屏现在的做法和现在的登记）不是规则原文，是本机现算的事实，放在读者最可能问“现在到底是什么样”的地方；如果认为规则页不该夹这类快照，整框删掉即可，不影响要点。它们会随清单和登记变化，registry.numbers 里记了屏号。",
    "第 6 屏写了“号码记在个人理解库的‘本人基本信息’卡，问‘我的手机号’就能取到，登录一般用第一个”：这是原文第 27 行的内容，没有写号码本身；按约法 L20 和公开范围不算要收的内容，照上。",
    "第 5 屏把原文的技能名 personal-health、wechat-direct、personal-materials、chinese-asr、localocr 换成了对应项目页的中文名并加链接（个人健康、微信直读、个人材料查找、中文语音转写、本地文字识别）；项目名取自 manifest 的 title。原文屏里仍是技能名。",
    "开头一屏底部的入口选了〔现在正不正常 → 驾驶舱〕（链 /cockpit/，没带锚点），理由是本专题 L28 那条的落地就在驾驶舱；驾驶舱第 2 批才做，锚点等那页定。",
    "第 10 屏“配置和密钥”里快照那两句改写成了人话：快照＝电脑配置 registries\\project_config_keys.json 里各项目登记过的机器设置和恢复要点的副本（路径、端口、模型、数据来源这类可以公开的值），“非权威”写成“两边对不上时以项目自己的为准”，“预演、应用、读回”写成“先试一遍、写进去、读回确认”。依据 E:\\PCConfig\\docs\\contracts\\pcconfig.path-project-config.md 第 5、9、18–22 行和该登记的 purpose、snapshot_policy。",
    "开头词表新加“Astra”一条，只写它是 GPT-6 的型号之一、在 Codex 里跑，派给它什么活链到分工与并行施工，没写“默认 Astra max”这类会随模型清单变的细节。",
    "sha256:2bd54605c627d905196a8b939b2838aa20146052f689d08e3abf4ce71cc52e80",
    "E208 新屏 05b：“来由见〔这个网页是怎么做的〕”：一天约 300GB 的事只在“这个网页是怎么做的”第 14b 屏讲透，本屏只一句话指过去（不重复介绍）。",
    "E208 新屏 05b：第 1 屏“跳到：”六个按钮没有加“云端素材通道”：首屏只许局部改字，加按钮要动版面；要加由 Claude 定。",
    "E208 新屏 05b：“约 28MB”取 E208 草稿原文“每次冷启动约 28MB 的重复下载”；流量根治小结写的是 28.4MB，本人原话记录里是约 29MB，以规则原文为准。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-capabilities-runtime/page.json",
  "sha256": "e024a053015923233b638aa4e0993ebc103e4757632a6c81e29358c5c9014bb4",
  "converted_at_beijing": "2026-10-10T06:26:11+08:00"
 }
}
---

::screen{#rule-capabilities-runtime-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“能力与运行方式”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，五个词条竖排，词条名粗体绿色。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），就是六个跳转〔〕链接；介绍段和词条里的〔〕画成绿色下划线加小箭头的链接样式。右边约 45% 宽一幅水彩插画：中间一个小小的 AI 助手站在一面木洞洞板前，洞洞板上挂着几样工具——扳手、放大镜、画笔、一个 Chrome 彩色圆形标志、一个 Gmail 标志、一个 Google 云盘三色三角标志，板子顶上钉一块小木牌“工具清单”；助手脚边一个绿色小储物箱，箱侧贴着小标签“E:”，箱口探出几片绿叶；插画右下一台笔记本电脑，屏幕上是白底绿色的网页看板（只画色块、卡片和几个小圆点状态灯，状态灯绿、绿、黄），屏幕上方一块小牌“看板”。插画里只有这三块小牌子上有字，text 里“工具清单　E:　看板”这一行就是这三块牌子的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“自动运行的东西现在跑得怎么样：”，右边一个显眼的按钮〔现在正不正常 → 驾驶舱〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅，洞洞板和助手在上半、储物箱和笔记本电脑在下半，三块小牌子的字不变）；介绍段；“先认几个词”卡片（五个词条一行一条）；“跳到：”六个按钮排三行、每行两个；最下面“驾驶舱”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   },
   {
    "text": "L26 汇报网页",
    "href": "/rules/charter/#L26"
   },
   {
    "text": "L27 网站",
    "href": "/rules/charter/#L27"
   },
   {
    "text": "L28 自动运行",
    "href": "/rules/charter/#L28"
   },
   {
    "text": "L29 浏览器和存放位置",
    "href": "/rules/charter/#L29",
    "locator_instances": {
     "v": {
      "input_sha256": "e9680b5e1ee64d3430d41c7b5ee22c7ebf0b5f3133ccdc5ced224e0824a3da80",
      "fragmented": true,
      "instances": [
       {
        "context_text": "网页 L27 网站  L28 自动运行 L29 浏览器和",
        "context_rect": [
         70,
         1485,
         871,
         1522
        ],
        "expected_rect": [
         673,
         1482,
         874,
         1525
        ],
        "lookup_text": "L29浏览器和",
        "context_padding_px": 3
       },
       {
        "context_text": "存放位置四条，细则都在这里。",
        "context_rect": [
         71,
         1537,
         562,
         1571
        ],
        "expected_rect": [
         73,
         1540,
         232,
         1570
        ],
        "confirm_region": true,
        "lookup_text": "存放位置"
       }
      ]
     }
    }
   },
   {
    "text": "连接电脑",
    "href": "/mcp/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "选能力",
    "href": "/rules/capabilities-runtime/#p-choose"
   },
   {
    "text": "常用入口",
    "href": "/rules/capabilities-runtime/#p-entries"
   },
   {
    "text": "浏览器",
    "href": "/rules/capabilities-runtime/#p-browser"
   },
   {
    "text": "汇报、网站和自动运行",
    "href": "/rules/capabilities-runtime/#p-report-site-auto"
   },
   {
    "text": "软件更新和兼容",
    "href": "/rules/capabilities-runtime/#p-update"
   },
   {
    "text": "安装位置和配置",
    "href": "/rules/capabilities-runtime/#p-install"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/"
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
     "size": "large",
     "row": "intro",
     "width": "52%",
     "text_ref": "能力与运行方式"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "AI 拿什么来做事"
    },
    {
     "type": "glossary",
     "columns": 1,
     "illustration": "none",
     "text_ref": "先认几个词",
     "width": "100%"
    },
    {
     "type": "action_button",
     "columns": 6,
     "text_ref": "跳到："
    },
    {
     "text_ref": "工具清单",
     "type": "document_mock",
     "variant": "window",
     "base_asset": "_library/illustrations/助手工具板三牌位.png",
     "label_positions": [
      {
       "x": 38.833,
       "y": 5.114,
       "width": 31.5,
       "height": 10.227,
       "align": "center"
      },
      {
       "x": 19.5,
       "y": 79.545,
       "width": 8.833,
       "height": 6.25,
       "align": "center"
      },
      {
       "x": 78.667,
       "y": 47.159,
       "width": 12.5,
       "height": 5.114,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "notice",
     "text_ref": "自动运行的东西现在跑得怎么样"
    }
   ],
   "notes": "2026-10-03 14:04:34 page-fixer-01 当前构图，以当前blocks为准：依据审查及压小图复核消除空白/窄表/插画变形，所有原字、原热区和未解决组件要求保留；历史构图意图已随本轮旧规格副本留作临时回退，不把旧notes当现状。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA 5af082e77c0d9b5c1a4b69d95baec439c520a44db7d968a80d23cd1eab836314。此为AI排版补充，列new-looks待验收。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能力与运行方式"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "AI 拿什么来做事"
    },
    {
     "type": "prose",
     "text_ref": "这是 Codex、Claude 和它们派出的子代理共用的规则专题"
    },
    {
     "type": "glossary",
     "text_ref": "先认几个词",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：",
     "columns": 2,
     "columns_v": 2
    },
    {
     "text_ref": "工具清单",
     "type": "document_mock",
     "variant": "window",
     "base_asset": "_library/round3/portrait-label-supply/png/ill-r3-portrait-0e061e2c5434a041.png",
     "layout": "illustration_labels",
     "label_positions": [
      {
       "x": 34.778325,
       "y": 11.026878,
       "width": 48.472906,
       "height": 7.443143,
       "align": "center"
      },
      {
       "x": 12.216749,
       "y": 82.563749,
       "width": 27.29064,
       "height": 7.098553,
       "align": "center"
      },
      {
       "x": 56.748768,
       "y": 62.026189,
       "width": 30.541872,
       "height": 5.789111,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      }
     ]
    },
    {
     "type": "notice",
     "text_ref": "自动运行的东西现在跑得怎么样"
    }
   ],
   "notes": "横图标题/副标题/介绍/词卡在左，卡外工具板插画在右；跳转按钮整宽一排、底部驾驶舱横条。竖图实际副标题在插画之前、介绍在插画之后（intro 块须可按节点放在图两侧）；v2 末尾原图误多出三按钮，定稿“工具清单 E: 看板”只作为插画标签，由程序覆盖，不另画成按钮；G1 顺序与标签空间顺序需主工程师接线。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA 5af082e77c0d9b5c1a4b69d95baec439c520a44db7d968a80d23cd1eab836314。此为AI排版补充，列new-looks待验收。\nmain-closer 2026-10-03T20:36:28+08:00：实际文字Range超出真实安全牌框，竖版撤下坐标绑定，恢复原合法保字＋composition incomplete；不把单靠固定.tb框的旧机器pass当通过。safe DOM证据 main-closer/family-label-dom.json；横版实测安全绑定保留。\nmain-closer3：仅竖版接正式ready同scene新PNG与其SHA实测牌面合同；完整等比、不裁切拉伸，保全部原签与36px正文；真实Range和整页程序检查另核，横版保持既有图。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/助手工具板三牌位.png",
   "fallback": false,
   "semantic_status": "round3_annotation_explicit_targets_required",
   "key": "助手工具板三牌位",
   "source_phrase": "右边约 45% 宽一幅水彩插画：中间一个小小的 AI 助手站在一面木洞洞板前，洞洞板上挂着几样工具——扳手、放大镜、画笔、一个 Chrome 彩色圆形标志、一个 Gmail 标志、一个 Google 云盘三色三角标志，板子顶上钉一块小木牌“工具清单”；助手脚边一个绿色小储物箱，箱侧贴着小标签“E:”，箱口探出几片绿叶；插画右下一台笔记本电脑，屏幕上是白底绿色的网页看板（只画色块、卡片和几个小圆点状态灯，状态灯绿、绿、黄），屏幕上方一块小牌“看板”。",
   "sha256": "5af082e77c0d9b5c1a4b69d95baec439c520a44db7d968a80d23cd1eab836314",
   "status": "ready",
   "original_elements": [
    "中间一个小小的 AI 助手站在一面木洞洞板前，洞洞板上挂着几样工具——扳手、放大镜、画笔、一个 Chrome 彩色圆形标志、一个 Gmail 标志、一个 Google 云盘三色三角标志，板子顶上钉一块小木牌抽象图形；助手脚边一个绿色小储物箱，箱侧贴着小标签抽象图形，箱口探出几片绿叶；插画右下一台笔记本电脑，屏幕上是白底绿色的网页看板（只画色块、卡片和几个小圆点状态灯，状态灯绿、绿、黄），屏幕上方一块小牌抽象图形"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/portrait-label-supply/png/ill-r3-portrait-0e061e2c5434a041.png",
   "fallback": false,
   "semantic_status": "same_scene_portrait_capacity_pending",
   "key": "ill-r3-portrait-0e061e2c5434a041",
   "source_phrase": "右边约 45% 宽一幅水彩插画：中间一个小小的 AI 助手站在一面木洞洞板前，洞洞板上挂着几样工具——扳手、放大镜、画笔、一个 Chrome 彩色圆形标志、一个 Gmail 标志、一个 Google 云盘三色三角标志，板子顶上钉一块小木牌“工具清单”；助手脚边一个绿色小储物箱，箱侧贴着小标签“E:”，箱口探出几片绿叶；插画右下一台笔记本电脑，屏幕上是白底绿色的网页看板（只画色块、卡片和几个小圆点状态灯，状态灯绿、绿、黄），屏幕上方一块小牌“看板”。",
   "sha256": "5f8f1273b3b768f4638ca067a370e0eeedeb4cc7ab271573037a31ff85d1fa69",
   "status": "ready",
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-01-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e61ad08fd3c7a24a0aa8",
   "title_text": "能力与运行方式",
   "sha256": "a7cbb8c9ad6b2c71161f34e0ada1adfabee275b4cbe78ab58fb730e55afe2524",
   "status": "ready",
   "source_box": [
    19,
    41,
    925,
    246
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 能力与运行方式

**AI 拿什么来做事：用哪个工具和入口、浏览器怎么用、软件怎么更新、东西装在哪；汇报网页、网站和自动运行的东西怎么办。**

这是 Codex、Claude 和它们派出的子代理共用的规则专题，管“拿什么做”：先想清要的结果，再挑现在真正能用的工具、技能和入口。能不能做、怎么分工、做到什么算完不在这里定，分别见〔用户授权〕〔分工与并行施工〕〔工程与交付〕。约法里〔L26 汇报网页〕〔L27 网站〕〔L28 自动运行〕〔L29 浏览器和存放位置〕四条，细则都在这里。

**先认几个词**
- **宿主**：AI 实际跑在里面的程序，例如 Codex、Claude 桌面版。
- **独立电脑 MCP**：让另一台电脑上的 Codex 或 Claude 经网络在这台电脑上读写文件、跑命令、截屏操作的连接，主机和副机互相连着；入口见〔连接电脑〕。
- **点屏工具**：AI 截屏、移动鼠标、点按钮的能力（computer use）。
- **PCConfig**：〔电脑配置与恢复〕项目，管这台电脑的机器事实、计划任务、数据盘和换机恢复。
- **SecretRef**：指向密码中心里某把密钥的引用；配置里只写引用，不写密钥本身。

跳到：〔选能力〕〔常用入口〕〔浏览器〕〔汇报、网站和自动运行〕〔软件更新和兼容〕〔安装位置和配置〕

工具清单　E:　看板

自动运行的东西现在跑得怎么样：〔现在正不正常 → 驾驶舱〕

::screen{#rule-capabilities-runtime-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-02",
  "section": "points",
  "title": "人话要点：怎么挑、另一台电脑、界面点选",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“怎么挑”配一架小天平一边是扳手一边是硬币、“另一台电脑上的 AI”配两台笔记本电脑之间一根细绿线、“软件界面上的点选，默认交本人”配一根食指点在一个小按钮上。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列，左“怎么挑”、中“另一台电脑上的 AI”、右“软件界面上的点选，默认交本人”，高度按内容、底边对齐；卡片下方留一条窄窄的水彩叶子装饰带。路径、文件名和技能名（本屏没有）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版；字和横版完全一样；最下面水彩叶子装饰带。",
  "links": [],
  "anchors": [
   {
    "id": "p-choose",
    "text": "人话要点 · 选能力"
   },
   {
    "id": "p-pick",
    "text": "怎么挑"
   },
   {
    "id": "p-hosts",
    "text": "另一台电脑上的 AI"
   },
   {
    "id": "p-clicks",
    "text": "软件界面上的点选，默认交本人"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 选能力"
    },
    {
     "type": "points_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "怎么挑|另一台电脑上的 AI|软件界面上的点选，默认交本人",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7983110846f54e6a0488.png",
      "_library/fix-round-2/icon-clean-e8b273e5b4b0bb382863.png",
      "_library/fix-round-2/capability-select-icon.png"
     ],
     "illustration_description": "原规格插画位置：left_inside",
     "last_full_width": true
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排3张，竖版整宽一张一行。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 选能力"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "怎么挑|另一台电脑上的 AI|软件界面上的点选，默认交本人",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7983110846f54e6a0488.png",
      "_library/fix-round-2/icon-clean-e8b273e5b4b0bb382863.png",
      "_library/fix-round-2/capability-select-icon.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排3张，竖版整宽一张一行。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双屏同步",
   "source_phrase": "一架小天平一边是扳手一边是硬币、“另一台电脑上的 AI”配两台笔记本电脑之间一根细绿线、“软件界面上的点选，默认交本人”配一根食指点在一个小按钮上",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-70eb6f4a8c9787cb2151.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rule-capabilities-runtime-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-70eb6f4a8c9787cb2151",
   "title_text": "人话要点 · 选能力",
   "sha256": "ee43f2dc2b3ba4837acf95d019f9d328a483be3f3068918dbb5f491eeb0be97f",
   "status": "ready",
   "source_box": [
    37,
    14,
    726,
    148
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 人话要点 · 选能力

### 怎么挑
- 先想清要的结果，再挑现在真正能用的工具和方法。
- 按目标、风险、能多弄清多少事、能不能撤回、要等多久和总花费来挑；本人选定的模型和框架照用。
- 能力清单只是候选：需要时现查真实的工具、现有入口和说明；眼前的列表不是上限，“有这个工具”也不等于“一定能用”。
- 技能、模板和计划不能自己生出新目标，也不能自己批准什么。

### 另一台电脑上的 AI
- 独立电脑 MCP 和本机的宿主守同一套约定，但各用自己真实的身份和能力。
- 缺某个宿主特有的事件或工具，只影响用到它的动作，别的工作照做，也不冒充别的宿主。
- 共用的桌面、鼠标键盘和浏览器会话，按当前动作协调着用，用完归还。
- 新宿主接同一份资料状态和根/子角色提示，按真实接口验证资料兜底；不另写名单，不猜措辞。分不清加载技能和维护源码时，不因读技能文件就拦。缺的接口明确列出，其余工作照常。

### 软件界面上的点选，默认交本人
- 点屏工具现在还不够成熟。要在软件界面上点选的操作（例如在安全软件里恢复被禁止的启动项、在 Codex 桌面里编辑定时任务），AI 先查清、写好几步说明交本人点，本人点完由 AI 读回结果。
- AI 不主动用点屏工具代点；本人明确要 AI 点时照办。
- 命令行、配置文件和官方命令能办的，照常由 AI 做；网页上的操作按“浏览器”那一节。
- 本人说“快速操作”“快速开关”“一键开关”，是让 AI 用现有工具直接做完、读回结果；不是让本人去点快捷方式或照步骤做，也不为此新加快捷方式或按钮。本人明确要自己动手，或确实要本人在场时，才交本人。

::screen{#rule-capabilities-runtime-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-03",
  "section": "points",
  "title": "人话要点：能力不够、怎么说、限时的事",
  "scene": "横版 16:9。本屏没有大标题。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“能力不够时”配一个缺了一块的拼图、“怎么说”配一个写着中文的小对话气泡（气泡里只画几道横线，不画字）、“验证码这类限时的事要盯住”配一个小沙漏旁边一部手机。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列等宽，左“能力不够时”、中“怎么说”、右“验证码这类限时的事要盯住”（这张最长，可以比另两张高）。路径、文件名和技能名（本屏没有）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：本屏没有大标题；三张卡片从上到下一张一条、整宽，顺序同横版；字和横版完全一样。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   }
  ],
  "anchors": [
   {
    "id": "p-gaps",
    "text": "能力不够时"
   },
   {
    "id": "p-language",
    "text": "怎么说"
   },
   {
    "id": "p-short-wait",
    "text": "验证码这类限时的事要盯住"
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
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "能力不够时|怎么说|验证码这类限时的事要盯住",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/capability-missing-puzzle-icon.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-03-icon-02.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-03-icon-03.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排3张，竖版整宽一张一行。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "能力不够时|怎么说|验证码这类限时的事要盯住",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/capability-missing-puzzle-icon.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-03-icon-02.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-03-icon-03.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排3张，竖版整宽一张一行。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个缺了一块的拼图、“怎么说”配一个写着中文的小对话气泡（气泡里只画几道横线，不画字）、“验证码这类限时的事要盯住”配一个小沙漏旁边一部手机",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  }
 ]
}
```

### 能力不够时
- 能力缺失或真的不兼容，只停依赖它的那部分，其余继续，用人话说清影响。
- 不悄悄降质量、删功能，也不绕过身份、权限和保护要求。
- 本人自己的工具坏了，要修好或正式换掉（见〔工程与交付〕）；暂缓、退回旧版、局部停用只是临时处置，不算修好。

### 怎么说
- 默认简体中文，先说实际结果、影响和怎么用。
- 有用的英文第一次出现时加简短的中文解释；代码、路径、常见缩写和精确名称除外。
- 关键的没做完的事必须说；不为凑模板输出没用的栏目。

### 验证码这类限时的事要盯住
- 验证码、登录确认这类要趁有效期办的事，在当前任务里主动盯着真正能读到的来源，收到就及时做完已授权的后续操作。
- 不刚开始等就改成“几分钟后再看”的定时任务，然后收工。
- 按来源的真实能力和时间窗口，用现成的等待，或有次数上限的反复查看。
- 办完、取消、过了时间窗或来源读不了，就说明结果或缺口，结束等待。
- 不要求为几小时后的事一直挂着，也不为此新建全局轮询或后台服务。

::screen{#rule-capabilities-runtime-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-04",
  "section": "points",
  "title": "人话要点：本机小工具、生成图片",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“本机小工具”配一个打开的小工具箱、“生成图片和设计画面”配一支画笔和一块调色盘。卡片里每条要点前一个小绿圆点，正文深蓝灰。两张卡左右并排、等宽：左“本机小工具”，“清单现在写的（9 月 27 日版）”这段放在左卡下面一个浅绿底的小框里，框里左边画一个小放大镜；右“生成图片和设计画面”，卡片右上角画 OpenAI 的黑色花结标志（代表 Codex 和 Astra）。路径、文件名和技能名（E:\\Tools\\LocalToolbox\\catalog.json、Find-LocalTool.ps1）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；“本机小工具”卡、“清单现在写的”小框、“生成图片和设计画面”卡从上到下一张一条、整宽；字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-entries",
    "text": "人话要点 · 常用入口"
   },
   {
    "id": "p-toolbox",
    "text": "本机小工具"
   },
   {
    "id": "p-images",
    "text": "生成图片和设计画面"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 常用入口"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "本机小工具",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-1d279ddcf369d19a9c58.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "notice",
     "icons": [
      "_library/icons/打勾清单.png"
     ],
     "illustration": "left_inside",
     "text_ref": "清单现在写的"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "生成图片和设计画面",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-71e040b035621f213a7d.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横版两等宽卡，左卡底部内嵌清单小框，右卡标题旁调色盘；竖版小工具卡、独立清单框、图片设计卡顺排。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 常用入口"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "本机小工具",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-1d279ddcf369d19a9c58.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "notice",
     "icons": [
      "_library/icons/打勾清单.png"
     ],
     "illustration": "left_inside",
     "text_ref": "清单现在写的"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "none",
     "text_ref": "生成图片和设计画面"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横版两等宽卡，左卡底部内嵌清单小框，右卡标题旁调色盘；竖版小工具卡、独立清单框、图片设计卡顺排。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱",
   "source_phrase": "一个打开的小工具箱、“生成图片和设计画面”配一支画笔和一块调色盘",
   "sha256": "1f27e2e5b55499cd52cec4a8b7fe253b3b84c0357e9939f1039619291f43461a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "清单现在写的（9月27日版）：登记12项——3个独立小工具（例如图片超分与精确尺寸输出、Windows卡顿轨迹分析器）、1个操作步骤（Codex快捷方式打不开时怎么打开）、8个指向现有项目或技能的入口（例如按需短信验证码、中文乱码诊断与修复）。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "清单现在写的（9月27日版）：登记12项——3个独立小工具（例如图片超分与精确尺寸输出、Windows卡顿轨迹分析器）、1个操作步骤（Codex快捷方式打不开时怎么打开）、8个指向现有项目或技能的入口（例如按需短信验证码、中文乱码诊断与修复）。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-d78f33a557787858b04a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-d78f33a557787858b04a",
   "title_text": "人话要点 · 常用入口",
   "sha256": "641a9638908a38a12634f0b2b2c0c23e2c17a5d7174709a7170ad0c9b522bc67",
   "status": "ready",
   "source_box": [
    36,
    27,
    837,
    169
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 人话要点 · 常用入口

### 本机小工具
- 问本机已有的小工具、以前用过的工具、图片超分或本机现成的做法时，先查唯一的工具清单 E:\Tools\LocalToolbox\catalog.json。
- 按用途找，用同一目录下的 Find-LocalTool.ps1。
- 工具列表、型号和校验值（哈希）只记在那一份清单里。

**清单现在写的（9 月 27 日版）**：登记 12 项——3 个独立小工具（例如图片超分与精确尺寸输出、Windows 卡顿轨迹分析器）、1 个操作步骤（Codex 快捷方式打不开时怎么打开）、8 个指向现有项目或技能的入口（例如按需短信验证码、中文乱码诊断与修复）。

### 生成图片和设计画面
- 图片默认用 Codex 自带生图。任何 Codex 对话都能直接调用；Claude 写好提示交 Luna 生图、落盘用 low，不派 Astra。质量看生图模型和提示；收费 API 回退需本人明确要。
- 能凭文字画、参考图延续风格和角色、改局部或做透明底、一次出几版；界面、插画之外，也能做 PPT、视频分镜和海报。
- 设计出几版本人定风格，再照图写代码；素材由 AI 选。定稿当参考保持一致，局部有错只修那块；要求其余像素不变时，把改好的块贴回原图。
- 成品按版本存进项目，核对落盘、不覆盖旧图；审定图冻结，只重做变了的内容。当前模型记在清单，排名不当永久结论。
- 复核按需：成批交 Sol，很重要交 Claude；只有几张主对话自己看。图里的字逐字查，整体和参考并排比。
- Claude 不用代码画这类设计；要准确或会变的图表、日期和状态仍用代码，或填进图里留的空白；固定文字可画进图里。
- 本网站仍是 Luna 画、Sol 审，不合格交 Claude 定；只管本项目。

::screen{#rule-capabilities-runtime-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-05",
  "section": "points",
  "title": "人话要点：私人领域、Google",
  "scene": "横版 16:9。本屏没有大标题。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“私人领域直接走各自的入口”配几扇并排的小门、每扇门上一片不同颜色的叶子、“Gmail、Google 云盘和待办”配 Gmail 标志、Google 云盘三色三角标志和 Google Tasks 标志并排。卡片里每条要点前一个小绿圆点，正文深蓝灰。两张卡左右并排、等宽：左“私人领域直接走各自的入口”，右“Gmail、Google 云盘和待办”。路径、文件名和技能名（google-workspace-direct 画成链接样式，不另加小框）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：本屏没有大标题；两张卡片从上到下一张一条、整宽，顺序同横版；字和横版完全一样。",
  "links": [
   {
    "text": "个人健康",
    "href": "/projects/personal-health/"
   },
   {
    "text": "微信聊天读取",
    "href": "/projects/wechatdirect/"
   },
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
   },
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   },
   {
    "text": "本地文字识别",
    "href": "/projects/localocr/"
   },
   {
    "text": "google-workspace-direct",
    "href": "/skills/google-workspace-direct/"
   }
  ],
  "anchors": [
   {
    "id": "p-personal",
    "text": "私人领域直接走各自的入口"
   },
   {
    "id": "p-google",
    "text": "Gmail、Google 云盘和待办"
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
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "私人领域直接走各自的入口|Gmail、Google 云盘和待办",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a86c56270f7fd4b82920.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-05-icon-02.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。原横图每卡图标在标题左侧，原竖图第一卡多门插画在卡头上方，第二卡无额外插画。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "私人领域直接走各自的入口|Gmail、Google 云盘和待办",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a86c56270f7fd4b82920.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-05-icon-02.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。原横图每卡图标在标题左侧，原竖图第一卡多门插画在卡头上方，第二卡无额外插画。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/fix-round-2/icon-clean-a86c56270f7fd4b82920.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Google标志",
   "source_phrase": "几扇并排的小门、每扇门上一片不同颜色的叶子、“Gmail、Google 云盘和待办”配 Gmail 标志、Google 云盘三色三角标志和 Google Tasks 标志并排",
   "sha256": "3b139a473fa17e34bee876bd7e627121582b3bf37568c5511473bcd21ecbac17",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  }
 ]
}
```

### 私人领域直接走各自的入口
- 健康和微信各走专门入口：健康用〔个人健康〕，微信用〔微信聊天读取〕。AI 直接走对应入口，不绕到全景资料库。
- 只有原件位置不明、要在已允许的几处之间找、或原来的定位失效时，才用〔个人材料查找〕找到、打开并核对原件。
- 要精确转写的录音交〔中文语音转写〕，扫描件交〔本地文字识别〕。
- 照片视频只在本人明确要求时，单独做成一个有边界的任务。
- 没有专门项目的领域，直接用当前对话里的事实，加上会改变答案的最少原件来回答。
- 不恢复中央个人数据库、统一事件图、跨领域画像、后台同步、万能总技能，也不默认把全景资料都塞进来。

### Gmail、Google 云盘和待办
- 现行入口只有一个：〔google-workspace-direct〕技能，只经电脑配置里固定的那条 Google 授权连接处理 Gmail、Google 云盘和 Google Tasks（待办），各自按能力验收，具体能做哪些操作见这个技能。
- Google 日历现在冻结着，这个入口不碰。
- 本人明确要写入时，也只用这个入口已有的具体操作。
- 不存进本地库、不自动同步、不换账号，也不悄悄改走别的接入、连接器、浏览器或 rclone。
- 入口没接好、账号失效或能力不够时，如实说不可用或有限，不另造一套接入。
- 写入、分享、发送和邀请，要有对应的能力和授权；删除、公开分享、发送和邀请，还要本人对那一个具体的外部动作授权。
- Google 后台管理、支付和相册不归这个入口。
- 配置和凭据文件在，不说明账号、读取或写入现在能用。

::screen{#rule-capabilities-runtime-05b section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-05b",
  "section": "points",
  "title": "人话要点：云端素材通道",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画），照第 4、6 屏标题同样的毛笔字和笔刷线。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“为什么要”配一台笔记本电脑，上面伸出一大把缠在一起的细箭头；“怎么做”配一朵绿色水彩云托着一张小图片，云下一根细线连到一个小信封（信封上不画字）；“留多久、什么不上云”配一个小纸箱里放着几张图片，旁边一把挂在箱外的小锁；“标尺：每个文件理想是上传一次、下载一次”配一把小尺子，上面一个向上、一个向下的绿色小箭头。四张卡排成两行两列：上行左“为什么要”（最短）、右“怎么做”（最长，可以比左边高）；下行左“留多久、什么不上云”、右“标尺：每个文件理想是上传一次、下载一次”。“为什么要”卡下方空处画一幅小水彩：左边一台笔记本电脑，一根细细的绿线只往上连一次到一朵云，云里两个胸前黑色花结徽章（OpenAI 标志）的小机器人拿放大镜看一张画稿，插画里不画字。卡片里每条要点前一个小绿圆点，正文深蓝灰。路径、文件名和技能名（Wrangler 不用小框；SHA-256、10GB、28MB、40MB 照正文画）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；四张卡片从上到下一张一条、整宽，顺序同横版（先左后右、先上后下）；“为什么要”卡下的小水彩缩小放在它右下角；字和横版完全一样。",
  "links": [
   {
    "text": "这个网页是怎么做的",
    "href": "/how-this-site/#traffic"
   },
   {
    "text": "省流量的云端素材",
    "href": "/skills/cloud-asset-channel/"
   },
   {
    "text": "公开分级表",
    "href": "/rules/privacy-data/#p-classification"
   }
  ],
  "anchors": [
   {
    "id": "p-cloud",
    "text": "人话要点 · 云端素材通道"
   },
   {
    "id": "p-cloud-why",
    "text": "为什么要"
   },
   {
    "id": "p-cloud-how",
    "text": "怎么做"
   },
   {
    "id": "p-cloud-keep",
    "text": "留多久、什么不上云"
   },
   {
    "id": "p-cloud-measure",
    "text": "标尺：每个文件理想是上传一次、下载一次"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 云端素材通道"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "为什么要|怎么做|留多久、什么不上云|标尺：每个文件理想是上传一次、下载一次",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "新构图，待样张。该方向无有效原图。整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。按04/08同页两列要点卡组织四卡2×2；为什么要下方卡外小插画、竖版移到该卡右下角。",
   "reference_screen": "rule-capabilities-runtime-08",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 云端素材通道"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "为什么要|怎么做|留多久、什么不上云|标尺：每个文件理想是上传一次、下载一次",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "新构图，待样张。该方向无有效原图。整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。按04/08同页两列要点卡组织四卡2×2；为什么要下方卡外小插画、竖版移到该卡右下角。",
   "reference_screen": "rule-capabilities-runtime-08",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "字）",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/云端审稿.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "云端审稿",
   "source_phrase": "“为什么要”卡下方空处画一幅小水彩：左边一台笔记本电脑，一根细细的绿线只往上连一次到一朵云，云里两个胸前黑色花结徽章（OpenAI 标志）的小机器人拿放大镜看一张画稿，插画里不画字。",
   "sha256": "7a411f99317c55a7b24e019d9188e14b2881d7509ca2bc22eaa2571e6b3039c3",
   "status": "ready",
   "original_elements": [
    "左边一台笔记本电脑，一根细细的绿线只往上连一次到一朵云，云里两个胸前黑色花结徽章（OpenAI 标志）的小机器人拿放大镜看一张画稿，插画里不画字"
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
   "asset": "_library/titles/title-f124bce130a386c97d1a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f124bce130a386c97d1a",
   "title_text": "人话要点 · 云端素材通道",
   "sha256": "2bb15b855b9f210793e495d1c215fb5085d5180a06f38483f20fc769a3147e8c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 云端素材通道

### 为什么要
- 做网站时，同一批图要被 AI 画、审、复核好几轮；每读一次都从本人电脑再传一遍，流量远远超过图本身（来由见〔这个网页是怎么做的〕）。
- 所以，任何项目里，同一个文件预计要被 AI 读两次以上，或一批文件的处理流量明显超过文件本身，都走这条通道。

### 怎么做
- 要反复读的文件，从本机传到云上（Cloudflare R2）一份，本机留同一版；只传点名的文件，不扫整个目录。
- 云上用文件的内容指纹作名字（64 位 SHA-256）；同样的内容只存一份，公开范围按公开分级表判断。
- AI 在云里用命令处理素材，结论写回自己的收件箱；本机只取回几 KB 的文字。云端审图尚未通过校准，网站图终审交 Claude Opus。
- 每次给 AI 用之前，先核对本机文件的指纹：变了就传新版，旧的标“已被替换”，保证 AI 读的和本机一样。
- 云端命令读者目前自报 GPT-5.6 Sol；支持新版后再核对 GPT-6.1 Sol，审图仍须单独通过校准。
- Claude 自己的复核不走云：在本机每张图一次读完、一次答完。画图仍在本机。
- 具体怎么传、怎么查账和清理，见〔省流量的云端素材〕技能。

### 留多久、什么不上云
- 不设过期：有用就留，还在用、以后按需更新还要用的一直留。
- 被替换的旧版、落选的候选、确定没用的云副本删掉；别处还在用的不删。只删云副本，本机原件不动。
- 密码、密钥、恢复码、身份证件和银行卡照片不上云；其余照〔公开分级表〕判断。
- 上传用 Wrangler 已有的网页授权，不新建 API 令牌、不经手密钥。
- 云上总量接近免费的 10GB 时，提醒本人去 Cloudflare 看付款或充值；10GB 不是上限，不因此拒绝上传。

### 标尺：每个文件理想是上传一次、下载一次
- 每个任务记下本机实际传了多少，和所用文件的大小之和比：目标不超过 2 倍，超过 2.5 倍报警；没量到的不算成零。
- 不上云的本机处理也要省：一次发完全部要看的图、一次给结论；同一批任务复用一个进程，免得每次重新下载约 28MB；图片只做无损压缩，不缩小、不降质量；本机图像会话护栏读配置里的 AI 默认值，不把旧 40MB 写成本人禁令；连接采样也不能保证逐字节卡线。
- 不拿降低质量或拉长时间换好看的流量数字。

::screen{#rule-capabilities-runtime-06 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-06",
  "section": "points",
  "title": "人话要点：默认浏览器、登录账号、本地网页预览",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“默认用本人的 Chrome”配 Chrome 的彩色圆形标志、“登录本人的账号”配一把小钥匙插在一个登录框上（登录框里不画字）、“预览本地网页”配一个小浏览器窗口，地址栏只画一条短横线。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列：左“默认用本人的 Chrome”；中“登录本人的账号”，它下面接一个浅绿底圆角小框放“取码工具现在的样子（9 月 27 日）”这段，小框左上角一幅很小的水彩：一部手机和一台笔记本电脑之间一道细细的弧线，弧线中间一个小信封（信封上不画字）；右“预览本地网页”。三列等宽，高度按内容。路径、文件名和技能名（本屏的 browser-control-continuity 第一处画成链接样式，第二处用等宽小框；file:// 也用等宽小框）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；“默认用本人的 Chrome”卡、“登录本人的账号”卡连同它下面的小框和小水彩、“预览本地网页”卡，从上到下一张一条、整宽；字和横版完全一样。",
  "links": [
   {
    "text": "约法 L29",
    "href": "/rules/charter/#L29"
   },
   {
    "text": "browser-control-continuity",
    "href": "/skills/browser-control-continuity/"
   }
  ],
  "anchors": [
   {
    "id": "p-browser",
    "text": "人话要点 · 浏览器"
   },
   {
    "id": "p-chrome",
    "text": "默认用本人的 Chrome"
   },
   {
    "id": "p-login",
    "text": "登录本人的账号"
   },
   {
    "id": "p-local-html",
    "text": "预览本地网页"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 浏览器"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "33%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "默认用本人的 Chrome",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-3162cbde5f4caa3c205d.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "34%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "登录本人的账号",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/人物.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "notice",
     "row": "points",
     "icons": [
      "_library/icons/手机电脑连接.png"
     ],
     "illustration": "left_inside",
     "text_ref": "取码工具现在的样子"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "33%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "预览本地网页",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/打勾清单.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横图三等宽卡、中卡下面附取码说明；竖图取码框在v2最上，然后预览卡。定稿text含字面反斜杠n，本轮主程序已统一解析与G1基准；定稿未修改，四个text_ref均已恢复匹配。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 浏览器"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "默认用本人的 Chrome",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-3162cbde5f4caa3c205d.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "points_card",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "登录本人的账号",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/人物.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "notice",
     "illustration": "none",
     "text_ref": "取码工具现在的样子"
    },
    {
     "type": "points_card",
     "icons": "none",
     "illustration": "none",
     "text_ref": "预览本地网页"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横图三等宽卡、中卡下面附取码说明；竖图取码框在v2最上，然后预览卡。定稿text含字面反斜杠n，本轮主程序已统一解析与G1基准；定稿未修改，四个text_ref均已恢复匹配。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "Chrome标志",
   "source_phrase": "Chrome 的彩色圆形标志、“登录本人的账号”配一把小钥匙插在一个登录框上（登录框里不画字）、“预览本地网页”配一个小浏览器窗口，地址栏只画一条短横线",
   "sha256": "9402804087291bdb0d78b7cde78aa8063e37b4a2fedaab90f83ab69d6867043a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-06-icon-02.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "人物",
   "source_phrase": "登录本人的账号\n已授权登录本人的账号、需要手机号时，可以直接填本人的常用号码并发验证码。号码记在个人理解库的“本人基本信息”卡，问“我的手机号”就能取到，登录一般用第一个。验证码能从现有允许的来源取到，就及时完成登录；短信验证码用电脑配置里的按需取码工具。取不到就交本人填。需要账号密码时由本人自己登录；已经退役的浏览器代填密码不恢复。各家AI按自己真实的能力和限制做，不把Claude的限制写成所有AI都不能做。短信来源没接通时如实说，不把调查报告当成已经能自动取码，也不为等验证码新建全局后台服务。",
   "sha256": "84f7098cd979eb8bdeccc7587fcf2d78e42d4ff3014093cd65a9829739e0ca28",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机电脑连接",
   "source_phrase": "取码工具现在的样子（9月27日）：读的是小米妙享从手机转到这台电脑上的通知；只在AI调用时短暂运行，默认往前回看60秒、再等30秒，不常驻，码只交给调用它的AI、不存下来；已经装好，读取通知的许可可用；真的在网页上填码登录，还没验收过。",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机电脑连接",
   "source_phrase": "取码工具现在的样子（9月27日）：读的是小米妙享从手机转到这台电脑上的通知；只在AI调用时短暂运行，默认往前回看60秒、再等30秒，不常驻，码只交给调用它的AI、不存下来；已经装好，读取通知的许可可用；真的在网页上填码登录，还没验收过。",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/手机远程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手机远程",
   "source_phrase": "三张卡排成三列：左“默认用本人的 Chrome”；中“登录本人的账号”，它下面接一个浅绿底圆角小框放“取码工具现在的样子（9 月 27 日）”这段，小框左上角一幅很小的水彩：一部手机和一台笔记本电脑之间一道细细的弧线，弧线中间一个小信封（信封上不画字）；右“预览本地网页”。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready",
   "original_elements": [
    "手机、笔记本电脑，中间细弧线和小信封"
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
   "asset": "_library/round3/titles/title-r3-4a3370ff6f834cd75e40.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-06-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-4a3370ff6f834cd75e40",
   "title_text": "人话要点 · 浏览器",
   "sha256": "dba9cc7db6baa461f0d7c214e448b91497f09353e3c1682a748870b0e3ba228f",
   "status": "ready",
   "source_box": [
    414,
    29,
    1196,
    217
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 浏览器

### 默认用本人的 Chrome
- 默认用本人正在用的那个 Chrome（〔约法 L29〕）；它没开时，可以用现有的受管办法把它打开。
- 本人明确选别的浏览器时，听本人的。
- 不把某个工具自己的默认浏览器或应用内浏览器当成本人的默认，也不悄悄换成别家的浏览器。Claude 用本人 Chrome 登录状态时默认派 GPT，无需登录可用内置浏览器；Codex 仍用本人 Chrome，本人指定优先。
- 控制浏览器的连接断了、运行环境要恢复时，按〔browser-control-continuity〕技能处理，保留本人已经打开的页面；这不改变网站上的动作、账号和内容要不要授权。

### 登录本人的账号
- 已授权登录本人的账号、需要手机号时，可以直接填本人的常用号码并发验证码。号码记在个人理解库的“本人基本信息”卡，问“我的手机号”就能取到，登录一般用第一个。
- 验证码能从现有允许的来源取到，就及时完成登录；短信验证码用电脑配置里的按需取码工具。取不到就交本人填。
- 需要账号密码时由本人自己登录；已经退役的浏览器代填密码不恢复。
- 各家 AI 按自己真实的能力和限制做，不把 Claude 的限制写成所有 AI 都不能做。
- 短信来源没接通时如实说，不把调查报告当成已经能自动取码，也不为等验证码新建全局后台服务。

**取码工具现在的样子（9 月 27 日）**：读的是小米妙享从手机转到这台电脑上的通知；只在 AI 调用时短暂运行，默认往前回看 60 秒、再等 30 秒，不常驻，码只交给调用它的 AI、不存下来；已经装好，读取通知的许可可用；真的在网页上填码登录，还没验收过。

### 预览本地网页
- 要用真浏览器看本地 HTML，第一次就走受支持的本地 HTTP 服务，不先试直接打开文件（file://）。
- 优先用已有的开发或预览服务；确实要临时起一个服务，就绪检查、进程和会话、事后清理都归 browser-control-continuity。
- 只是生成文件时，不机械地启动服务；本人要的独立 HTML 文件，不换成对话里的可视小组件。

::screen{#rule-capabilities-runtime-07 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-07",
  "section": "points",
  "title": "人话要点：汇报网页、网站、自动运行",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“汇报网页”配一张白底绿色的小网页（只画色块和一个小图表）、“网站怎么更新”配一个小地球和一片绿叶、“自动运行的东西要看得见”配一个小齿轮旁边一盏亮着的小绿灯。卡片里每条要点前一个小绿圆点，正文深蓝灰。前三张卡排成三列：左“汇报网页”，它下面接一个浅绿底小框放“现在的做法”这段；中“网站怎么更新”，这张最短，卡下方空处画一台笔记本电脑，屏幕上是白底绿色的看板（只画色块、卡片和小圆点状态灯，不画字）；右“自动运行的东西要看得见”，它下面接一个浅绿底小框放“现在的登记（9 月 28 日）”这段。右列小框下接第四张“要本人做或选的事不会漏”卡，复用小齿轮旁边小绿灯的现有图标。路径、文件名和技能名（E:\\Documents\\AI汇报\\、V:\\Personal\\Projects\\wly0829.cn、AGENTS.md）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；“汇报网页”卡连同它的小框、“网站怎么更新”卡、“自动运行的东西要看得见”卡连同它的小框、最后“要本人做或选的事不会漏”卡，从上到下一张一条、整宽；笔记本电脑小插画缩小放在“网站怎么更新”卡右下角；字和横版完全一样。",
  "links": [
   {
    "text": "约法 L26",
    "href": "/rules/charter/#L26"
   },
   {
    "text": "report-page",
    "href": "/skills/report-page/"
   },
   {
    "text": "约法 L27",
    "href": "/rules/charter/#L27"
   },
   {
    "text": "约法 L28",
    "href": "/rules/charter/#L28"
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
   }
  ],
  "anchors": [
   {
    "id": "p-report-site-auto",
    "text": "人话要点 · 汇报、网站和自动运行的东西"
   },
   {
    "id": "p-report",
    "text": "汇报网页"
   },
   {
    "id": "p-site",
    "text": "网站怎么更新"
   },
   {
    "id": "p-automation",
    "text": "自动运行的东西要看得见"
   },
   {
    "id": "p-owner-items",
    "text": "要本人做或选的事不会漏"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 汇报、网站和自动运行的东西"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "33%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "汇报网页",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-5d6ddc33dee56786bad9.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "notice",
     "row": "points",
     "illustration": "left_inside",
     "text_ref": "现在的做法",
     "icons": [
      "_library/icons/回收站文件.png"
     ]
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "33%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "网站怎么更新",
     "icon_position": "header_left",
     "header_icon": [
      "rule-capabilities-runtime/rule-capabilities-runtime-07-icon-02.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "illustration",
     "row": "points",
     "illustration": "outside"
    },
    {
     "type": "notice",
     "row": "points",
     "illustration": "left_inside",
     "text_ref": "现在的登记",
     "icons": [
      "_library/icons/日历时钟.png"
     ]
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "34%",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "自动运行的东西要看得见",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-6a38e42190b5f0212a91.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    },
    {
     "type": "points_card",
     "row": "points",
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "要本人做或选的事不会漏",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-6a38e42190b5f0212a91.png"
     ]
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。原横图三列，中间短卡下方有卡外笔记本插画；左右说明框均嵌在所属大卡底部。原竖图前两卡插画在卡内右侧；两说明框在所属大卡下方但卡内。\nE230 新增第四张卡接在右列“现在的登记”小框之后，沿用同一行组且不另开列。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 汇报、网站和自动运行的东西"
    },
    {
     "type": "points_card",
     "illustration": "none",
     "icons": "none",
     "text_ref": "汇报网页"
    },
    {
     "type": "notice",
     "illustration": "none",
     "text_ref": "现在的做法"
    },
    {
     "type": "points_card",
     "illustration": "none",
     "icons": "none",
     "text_ref": "网站怎么更新"
    },
    {
     "type": "points_card",
     "illustration": "none",
     "icons": "none",
     "text_ref": "自动运行的东西要看得见"
    },
    {
     "type": "notice",
     "illustration": "none",
     "text_ref": "现在的登记"
    },
    {
     "type": "points_card",
     "illustration": "none",
     "icons": "none",
     "text_ref": "要本人做或选的事不会漏"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。原横图三列，中间短卡下方有卡外笔记本插画；左右说明框均嵌在所属大卡底部。原竖图前两卡插画在卡内右侧；两说明框在所属大卡下方但卡内。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。\nE230 新增第四张卡排在“现在的登记”小框之后，手机阅读顺序到末尾。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "source_phrase": "一张白底绿色的小网页（只画色块和一个小图表）、“网站怎么更新”配一个小地球和一片绿叶、“自动运行的东西要看得见”配一个小齿轮旁边一盏亮着的小绿灯",
   "sha256": "cd4cdb591b309aadcd7868f102d85c09cf31610c2980decf5052b907ff445bb8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "回收站文件",
   "source_phrase": "现在的做法：页面默认放E:\\Documents\\AI汇报\\；每生成一张新页，顺带把14天前的旧页放进回收站。",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "回收站文件",
   "source_phrase": "现在的做法：页面默认放E:\\Documents\\AI汇报\\；每生成一张新页，顺带把14天前的旧页放进回收站。",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "key": "日历时钟",
   "source_phrase": "现在的登记（9月28日）：电脑配置的任务用途登记有139项（Windows计划任务125项，另有云端、Codex、笔记本和GitHub上的14项），其中74项是本人或AI为本人配的；每项都写了叫什么、做什么、怎么停、停了影响什么；上次、下次运行时间和结果从实时来源读，不存进登记。",
   "sha256": "9175a885bbc49df84792d7cbfc903253f67e4b454ce828427ef35086eef518e0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/助手工具板.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "助手工具板",
   "source_phrase": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“汇报网页”配一张白底绿色的小网页（只画色块和一个小图表）、“网站怎么更新”配一个小地球和一片绿叶、“自动运行的东西要看得见”配一个小齿轮旁边一盏亮着的小绿灯。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列：左“汇报网页”，它下面接一个浅绿底小框放“现在的做法”这段；中“网站怎么更新”，这张最短，卡下方空处画一台笔记本电脑，屏幕上是白底绿色的看板（只画色块、卡片和小圆点状态灯，不画字）；右“自动运行的东西要看得见”，它下面接一个浅绿底小框放“现在的登记（9 月 28 日）”这段。路径、文件名和技能名（E:\\Documents\\AI汇报\\、V:\\Personal\\Projects\\wly0829.cn、AGENTS.md）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
   "sha256": "74707369e606eef1d953245ef1d04d7b8a3b3247d58ed3a3fbd7a3a7a18faa7c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-a404e195d17326d92ef2-oneline.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-07-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-a404e195d17326d92ef2",
   "title_text": "人话要点 · 汇报、网站和自动运行的东西",
   "sha256": "2bf849f2dfbb3ffb9c44f99e55209d9b4561c79e60d16d326c1360abc368e155",
   "status": "ready",
   "source_box": [
    31,
    24,
    1563,
    202
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 汇报、网站和自动运行的东西

### 汇报网页
- 什么时候用、做成什么样，见〔约法 L26〕：需要展开说明的汇报、请本人裁定和超过约 1000 字的长回答才做网页；简单的完成回执和短状态直接在对话里说，不为做网页把一句话扩成汇报；本人明确要网页时照做。
- 生成、存放和到期清理（放进回收站），按〔report-page〕技能的做法。
- 要长期留的结论写进对应项目的记录，不靠网页保存。

**现在的做法**：页面默认放 E:\Documents\AI汇报\；每生成一张新页，顺带把 14 天前的旧页放进回收站。

### 网站怎么更新
- 本人说“更新网站”时，按网站项目 V:\Personal\Projects\wly0829.cn 里的 AGENTS.md 更新一次（〔约法 L27〕）。
- 不建自动定时更新。

### 自动运行的东西要看得见
- 计划任务、看门狗和别的自动运行的东西，要在网站看板（〔驾驶舱〕）上看得见：在做什么、上次和下次什么时候跑、有没有出错、怎么停、停了影响什么（〔约法 L28〕）。
- 新增或修改这类东西时，照电脑配置现行的做法，把这些状态写进看板能读的状态文件或登记。
- 看板怎么显示另外建设，不为此在本机另开窗口。
- 后台命令不弹黑窗口。

**现在的登记（9 月 28 日）**：电脑配置的任务用途登记有 139 项（Windows 计划任务 125 项，另有云端、Codex、笔记本和 GitHub 上的 14 项），其中 74 项是本人或 AI 为本人配的；每项都写了叫什么、做什么、怎么停、停了影响什么；上次、下次运行时间和结果从实时来源读，不存进登记。

### 要本人做或选的事不会漏
- 要本人做、要本人选、或者本人可能漏看的事，根会话在回复本人的同时，顺手登记进〔驾驶舱〕的“需要你”（〔约法 L28〕），不靠本人自己记。
- 登记时写清怎么算做完；能由 AI 自己核对的，也写上怎么核对。
- 只有 AI 核实做完了才关闭；本人说“做完了”，也先找到这一条核实一遍再关。
- 网页上只看不删，不提供删除。
- 子代理不自己登记，把要本人做或选的事交回根会话，由根会话决定登记。
- 例：“这件事要我确认，帮我记在‘需要你’里，写清怎样才算完成。”

::screen{#rule-capabilities-runtime-08 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-08",
  "section": "points",
  "title": "人话要点：软件更新和兼容",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“什么时候可以更新”配一个绕成圈的绿色箭头、“锁版本”配一把小挂锁、“改在用的软件时保什么”配一只手护着一株小苗、“更新不该打扰本人”配一个挂着“请勿打扰”形状的小门牌（门牌上不画字）。卡片里每条要点前一个小绿圆点，正文深蓝灰。四张卡排成两行两列：上行左“什么时候可以更新”、右“锁版本”；下行左“改在用的软件时保什么”（这张最长，可以比右边高）、右“更新不该打扰本人”。路径、文件名和技能名（本屏没有）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版（先左后右、先上后下）；字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-update",
    "text": "人话要点 · 软件更新和兼容"
   },
   {
    "id": "p-when-update",
    "text": "什么时候可以更新"
   },
   {
    "id": "p-pin",
    "text": "锁版本"
   },
   {
    "id": "p-preserve",
    "text": "改在用的软件时保什么"
   },
   {
    "id": "p-no-reauth",
    "text": "更新不该打扰本人"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 软件更新和兼容"
    },
    {
     "type": "points_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "什么时候可以更新|锁版本|改在用的软件时保什么|更新不该打扰本人",
     "illustration_asset": [
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-01.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-02.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-03.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-04.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。原横图四卡2×2且小插画在正文左侧，原竖图前两卡左图卡头、后两卡纯标题；色彩遵统一标准，不继承旧黄紫蓝卡色。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 软件更新和兼容"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "什么时候可以更新|锁版本|改在用的软件时保什么|更新不该打扰本人",
     "icon_position": "header_left",
     "header_icon": [
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-01.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-02.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-03.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-08-icon-04.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。 横版每排2张，竖版整宽一张一行。原横图四卡2×2且小插画在正文左侧，原竖图前两卡左图卡头、后两卡纯标题；色彩遵统一标准，不继承旧黄紫蓝卡色。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "版本循环文件",
   "source_phrase": "一个绕成圈的绿色箭头、“锁版本”配一把小挂锁、“改在用的软件时保什么”配一只手护着一株小苗、“更新不该打扰本人”配一个挂着“请勿打扰”形状的小门牌（门牌上不画字）",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-08-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-capabilities-runtime-08-v\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b138d6816176ad8f6f60",
   "title_text": "人话要点 · 软件更新和兼容",
   "sha256": "e6a9ee9a9d88258551a60d2f69d5e284ef95b8cadf99bf0d046887d1aeef4506",
   "status": "ready",
   "source_box": [
    29,
    84,
    901,
    243
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 人话要点 · 软件更新和兼容

### 什么时候可以更新
- 可以从官方来源，把软件更新到兼容、能退回、利大于弊的稳定版。
- 不越过这几道坎：版本锁定、付费或账号、正在跑的任务、要重启或重装、信任边界。
- 最新的、拿不准的或要引用的事实，上网核实；技术问题优先看官方。

### 锁版本
- 只在为了复现、安全或合规、已证实不兼容、或上游硬性要求时才锁定版本。
- 锁了要在项目里就地写清原因和什么时候解除，不把精确版本变成永久门槛。
- 不拿精确的版本号、构建号、带版本号的安装路径当正常功能或准入的门槛；版本号可以用来诊断、做测试证据、复现和回退。

### 改在用的软件时保什么
- 给在用的软件（各家 AI 程序、普通程序、插件、技能、MCP、运行环境，以及它们的接口、配置和数据格式）新建、修改、安装、升级、集成或迁移时，保护还有用的功能、数据、配置、必要流程和本人感觉得到的体验，不保护旧代码的样子。
- 接口的能力和含义没变，正常更新后应该不用改集成就能用；优先用官方稳定接口和能力探测。
- 没验证过的新版本，既不算不兼容，也不算已验证。
- 必需字段、未知请求和含义变化，不能被吞掉或假装成功。
- 这不要求每个项目适配所有框架，也不扩大成维护无关的软件或恢复冻结项目。

### 更新不该打扰本人
- 同一个软件正常更新，不因为自己的适配无故重置还有效的身份或授权，也不要本人重新验证。
- 只留有现实用途的旧格式或入口，不借“兼容”永远留着旧实现。
- 改动涉及兼容时，用项目原有的回归测试和真实使用入口来验证；程序能启动、接口有回应或静态测试通过，单独哪一样都不说明还能照常用。

::screen{#rule-capabilities-runtime-09 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-09",
  "section": "points",
  "title": "人话要点：缺什么装什么、东西放 E 盘",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“缺什么装什么”配一个打开的快递纸箱、“东西放 E 盘”配一个贴着“E:”标签的绿色小储物箱（和开头插画同一个，标签上的“E:”算在正文“东西放 E 盘”里，不另写）。卡片里每条要点前一个小绿圆点，正文深蓝灰。两张卡左右并排：左“缺什么装什么”约占 45% 宽，右“东西放 E 盘”约占 55% 宽；卡片下方留一条窄窄的水彩叶子装饰带。路径、文件名和技能名（E:\\Program Files\\<软件名>）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，顺序同横版；字和横版完全一样；最下面水彩叶子装饰带。",
  "links": [
   {
    "text": "约法 L29",
    "href": "/rules/charter/#L29"
   }
  ],
  "anchors": [
   {
    "id": "p-install",
    "text": "人话要点 · 安装位置、配置和本机约定"
   },
   {
    "id": "p-install-missing",
    "text": "缺什么装什么"
   },
   {
    "id": "p-e-drive",
    "text": "东西放 E 盘"
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
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 安装位置、配置和本机约定"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "45%",
     "icons": "auto",
     "illustration": "top_inside",
     "text_ref": "缺什么装什么",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-c39257cf985b27028f54.png"
     ],
     "illustration_description": "原规格插画位置：top_inside"
    },
    {
     "type": "points_card",
     "row": "points",
     "width": "55%",
     "icons": "auto",
     "illustration": "none",
     "text_ref": "东西放 E 盘",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/文件夹.png"
     ],
     "illustration_description": "原规格插画位置：top_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横图卡头后各有一幅居中卡内大插画（纸箱/E盘绿箱），左45%右55%；竖图纸箱在卡头左，E盘卡头无额外图。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 安装位置、配置和本机约定"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "缺什么装什么|东西放 E 盘",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-c39257cf985b27028f54.png",
      "_library/icons/文件夹.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。横图卡头后各有一幅居中卡内大插画（纸箱/E盘绿箱），左45%右55%；竖图纸箱在卡头左，E盘卡头无额外图。\n2026-10-03 13:46:49 page-fixer-01 第二轮：现有字段修复数字卡窄列/环图真实数字解析/明确文件夹图标绑定。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "source_phrase": "一个打开的快递纸箱、“东西放 E 盘”配一个贴着“E:”标签的绿色小储物箱（和开头插画同一个，标签上的“E:”算在正文“东西放 E 盘”里，不另写）",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-449b2fdb4421c4699b23-oneline.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-capabilities-runtime-09-v\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-449b2fdb4421c4699b23",
   "title_text": "人话要点 · 安装位置、配置和本机约定",
   "sha256": "45a02fc28e4671e66e7ee4669273173ef95a95e6480eb7da78e94c431d5530f6",
   "status": "ready",
   "source_box": [
    56,
    63,
    892,
    344
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 安装位置、配置和本机约定

### 缺什么装什么
- 任务必需、本机又缺的运行环境、SDK、命令行或构建工具，可以从官方支持的途径装好并验证。
- 已有项目服从它自己的版本锁和自动检查（CI）；依赖放在各生态原本的位置，跨项目的工具和服务归电脑配置。
- 没有约束的新环境选最新稳定版；兼容层、容器或旧运行环境，只在原生途径不能用时才用。
- 付费或账号、重启或重装、放宽安全、信任或授权边界，仍按原来的关卡办。

### 东西放 E 盘
- 新装软件默认放 E 盘合适的目录，例如 E:\Program Files\<软件名>（〔约法 L29〕）。
- AI 的缓存、临时文件、构建中间物、大任务产物和新工作区，放电脑配置登记的数据盘，不往 C 盘堆。
- 任务目录或程序默认在 C 盘，不是接着写 C 盘的理由：用程序正式支持的设置指定路径，传给实际干活的进程，再读回真实落点。
- 安装器或系统组件必须装在固定位置时，照原位置装并说明，不顺手迁移已有的安装。
- 确实迁不走、还在用的官方小运行环境可以例外，写明路径和原因。
- 迁移要确认用它的程序已经在用新位置、原来的空间真的腾出来了；只复制到新盘、C 盘还留一份，不算迁完。
- 新电脑的盘符、系统盘大小和数据放哪由本人定；本机的 E 盘约定，不是新电脑必须有 E 盘的门槛。

::screen{#rule-capabilities-runtime-10 section="points"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-10",
  "section": "points",
  "title": "人话要点：配置和密钥、技能和插件、Windows",
  "scene": "横版 16:9。本屏没有大标题。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“配置和密钥”配一把小钥匙挂在一个带锁的小盒子上、“技能和插件”配几块拼在一起的积木、“Windows”配 Windows 的四格窗标志。卡片里每条要点前一个小绿圆点，正文深蓝灰。左边一张大卡“配置和密钥”约占一半宽；右边上下两张卡：上“技能和插件”、下“Windows”。路径、文件名和技能名（E:\\Projects\\Tools\\PasswordCenter、E:\\.agents\\skills、E:\\.agents\\plugins、config/personal-skill-supply.json）用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：本屏没有大标题；三张卡片从上到下一张一条、整宽，顺序“配置和密钥”“技能和插件”“Windows”；字和横版完全一样。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   },
   {
    "text": "local-secret-broker",
    "href": "/skills/local-secret-broker/"
   },
   {
    "text": "日常技术默认",
    "href": "/rules/engineering-delivery/#p-defaults"
   }
  ],
  "anchors": [
   {
    "id": "p-config",
    "text": "配置和密钥"
   },
   {
    "id": "p-skills",
    "text": "技能和插件"
   },
   {
    "id": "p-windows",
    "text": "Windows"
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
     "icons": "auto",
     "illustration": "top_inside",
     "text_ref": "配置和密钥",
     "icon_position": "header_left",
     "header_icon": [
      "rule-capabilities-runtime/rule-capabilities-runtime-10-icon-01.png"
     ],
     "illustration_description": "原规格插画位置：top_inside"
    },
    {
     "type": "points_card",
     "columns": 1,
     "icons": "auto",
     "illustration": "top_inside",
     "text_ref": "技能和插件|Windows",
     "icon_position": "header_left",
     "header_icon": [
      "rule-capabilities-runtime/rule-capabilities-runtime-10-icon-02.png",
      "_library/fix-round-2/icon-clean-167263af5fd76ed4dbd8.png"
     ],
     "illustration_description": "原规格插画位置：top_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。无大标题；原横图左大卡右上下两卡，左55%右45%；顶部底部叶带仅装饰、不加文字。竖图配置卡跨v/v2后接技能、Windows，不重复新增标题。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "配置和密钥|技能和插件|Windows",
     "icon_position": "header_left",
     "header_icon": [
      "rule-capabilities-runtime/rule-capabilities-runtime-10-icon-01.png",
      "rule-capabilities-runtime/rule-capabilities-runtime-10-icon-02.png",
      "_library/fix-round-2/icon-clean-167263af5fd76ed4dbd8.png"
     ],
     "illustration_description": "原规格插画位置：left_inside"
    }
   ],
   "notes": "整屏宽章节标题居中；卡头粗体深绿，卡内绿圆点正文；卡间无箭头、无丝带。无大标题；原横图左大卡右上下两卡，左55%右45%；顶部底部叶带仅装饰、不加文字。竖图配置卡跨v/v2后接技能、Windows，不重复新增标题。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "置和密钥”配一把小钥匙挂在一个带锁的小盒子上、“技能和插件”配几块拼在一起的积木、“Windows”配 Windows 的四格窗标志",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  }
 ]
}
```

### 配置和密钥
- 项目管自己的业务配置、默认值、版本和迁移；电脑配置管机器事实和导航。
- 优先用静态配置和项目已有的机制；真需要热更新、多进程或跨实例时，才用相应的现成机制，不预先搭全局配置平台。
- 电脑配置里存着一份各项目登记过的机器设置和恢复要点（路径、端口、模型、数据来源这类）的副本，叫快照，方便查找和换机恢复时对照。
- 项目改了这类登记过的设置，先在项目自己那里核对好，再用电脑配置现成的快照工具先试一遍、写进去、读回确认，把副本更新过去。
- 两边对不上时以项目自己的为准；也不为同步副本加监视器或后台同步。
- 秘密用现行的 SecretRef，不放进有版本记录的普通配置。
- 密钥怎么定义、保存和提供，归独立的〔密码中心〕（私有仓库 E:\Projects\Tools\PasswordCenter）；本机安装、路径、任务和恢复接线归电脑配置；取用走〔local-secret-broker〕技能指向的现役入口。
- 同一厂商已有的密钥，可以给它支持的多个模型、多个项目用；换模型不为密钥重复登记、复制或锁定，也不把一个厂商永远限定为只能有一把密钥。
- 用哪个模型、用量多少、业务上怎么选，归调用它的项目。

### 技能和插件
- 技能和插件的正本只在 E:\.agents\skills 和 E:\.agents\plugins，用户目录里只放让各家 AI 找得到它们的链接。
- 安装由清单 config/personal-skill-supply.json 和现有的安装器管理。
- 要查技能装没装、规则与技能基座、电脑配置和 GitHub 项目总索引的登记坏没坏，跑只读的体检脚本；它只看安装和登记，说明不了技能好不好用。
- 只有缺的能力真影响本人要的结果时，才去翻按需插件目录；目录里的示例命令只当资料，不自动执行。

### Windows
- 命令、编码、临时内容和显卡任务，按工程与交付里的〔日常技术默认〕办；外部程序实际用什么编码，现场核对。
- Codex 的机器根目录和 V 盘、Z 盘各管什么，现查电脑配置和 Git 源，不凭旧路径猜。

::screen{#rule-capabilities-runtime-11 section="original"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-11",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.capabilities-runtime.md",
   "release": "E251",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
   "from": null,
   "to": "## 常用入口",
   "start": 0,
   "end": 1419,
   "approved_omissions": []
  },
  "title": "原文（一）：开头、选能力",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E187 版”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放从“# 能力与运行方式”到“界面上的点选默认交本人”那一条结束；右卡放“能力缺失或真的不兼容时……”“默认简体中文……”“短时流程要跟住……”三条。",
  "portrait": "竖版 9:16：“原文 · E187 版”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-capabilities-runtime/rule-capabilities-runtime-11",
  "source_logical_id": "capabilities_runtime_contract",
  "source_public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
  "source_rule_part": "rule-capabilities-runtime/rule-capabilities-runtime-11"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "intro",
     "width": "50%",
     "text_ref": "能力与运行方式",
     "source_prose": true
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "owner:",
     "source_prose": true
    },
    {
     "type": "illustration",
     "row": "intro",
     "width": "50%",
     "illustration": "outside"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "选能力",
     "whole_block": true
    }
   ],
   "notes": "横版保留上方介绍和原插画，下方“选能力”使用一张全宽原文卡，原条目顺序和内容完整；避免旧两列长度悬殊造成大块留白。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版"
    },
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能力与运行方式",
     "source_prose": true
    },
    {
     "type": "prose",
     "text_ref": "owner:",
     "source_prose": true
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "选能力",
     "whole_block": true
    }
   ],
   "notes": "原图上部页名/owner/介绍在左、工具电脑插画在右；下面原文两栏卡，左前三条、右后三条；竖版介绍后卡外插画、再一整宽原文卡。和 scene 的全部正文入两卡冲突，按实际原图。split_after 为待接入原文节点内分栏需求，当前解析器不可拆同一 bullets 节点。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/助手工具板.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "助手工具板",
   "source_phrase": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E187 版”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放从“# 能力与运行方式”到“界面上的点选默认交本人”那一条结束；右卡放“能力缺失或真的不兼容时……”“默认简体中文……”“短时流程要跟住……”三条。",
   "sha256": "74707369e606eef1d953245ef1d04d7b8a3b3247d58ed3a3fbd7a3a7a18faa7c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e61ad08fd3c7a24a0aa8",
   "title_text": "能力与运行方式",
   "sha256": "a7cbb8c9ad6b2c71161f34e0ada1adfabee275b4cbe78ab58fb730e55afe2524",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-11-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-86b03d00fd61395c6696",
   "title_text": "选能力",
   "sha256": "25bb92f5ac26cf93aec554cb697a960a07b2bfc54dafd7b15e9a812e81a0d268",
   "status": "ready",
   "source_box": [
    46,
    400,
    187,
    465
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E251 版

# 能力与运行方式

owner: `E:\.agents`

先想清要的结果，再选现在真正可用的能力。这里管工具、技能、领域入口、浏览器、软件更新、安装位置、汇报网页、网站和自动运行的东西；授权、施工和交付标准不在这里重定。

## 选能力

- 按目标、风险、信息增益、能否撤回、等待时间和总花费选工具和方法，保留本人选的模型和框架。能力目录只是候选：需要时查当前真实的工具、现有入口和说明；不把当前列表当上限，也不把“工具存在”当成“一定能用”。技能、模板和计划不能自己生出新目标或审批。
- 独立电脑 MCP 和本机宿主遵守同一套工作约定，但各用自己真实的身份和能力。缺某个宿主特有的事件或工具，只影响相关动作，不让别的工作停下，也不冒充别的宿主的身份。共用的桌面、鼠标键盘和浏览器会话按当前动作协调，用完归还。新接入宿主或 AI 时，个人资料链路投影正式的同一份共享状态，使用共同来源的根/子角色提示，按宿主真实接口接入结构化资料兜底并通过共同语义、误拦/漏拦和错误放行测试；不能另维护名单或提示，不猜模型措辞。技能加载与源码维护无法区分时，不按技能文件读取拦截。确实缺相关接口时写明那项缺口，不报已接通，其余普通工作照常。资料策略与调用办法统一见[个人资料与数据处理](/rules/privacy-data/)和状态钩子维护手册（`../operations/context-hooks.md#按需维护与回滚`）。
- **快速操作由 AI 执行。** 本人提出“快速操作”“快速开关”“一键开关”时，默认由 AI 使用现有工具直接执行并回读结果。不要把它理解为让本人点击快捷方式、运行命令或照步骤操作，也不要因此自行新增快捷方式或按钮。只有本人明确选择手动操作，或实际流程确实需要本人在场时，才交本人完成对应步骤（出处：`docs/owner-decisions.md`“快速操作由 AI 执行”）。
- **界面上的点选默认交本人。** 现在的点屏工具（computer use）还不够成熟，需要在软件界面上点选的操作（例如安全软件里恢复被禁止的启动项、Codex 桌面里编辑定时任务），AI 先查清并写好几步说明交本人点，点完由 AI 回读结果；AI 不主动用点屏工具代点，本人明确要 AI 点时照办。命令行、配置文件和官方命令能完成的照常由 AI 做；浏览器里的网页操作按下文“浏览器”一节。
- 能力缺失或真的不兼容时，只停依赖它的那部分，其余继续，用人话说清影响；不悄悄降质量、删功能或绕过身份、权限和保护要求。本人自己的能力坏了要修好或正式替换（见[工程与交付](/rules/engineering-delivery/)）；暂缓、回退旧版或局部停用只是处置状态，不算修好。
- 默认简体中文：先说实际结果、影响和用法；有用的英文第一次出现时加简短中文释义，代码、路径、常见缩写和精确标识除外。关键的没做完的事必须说，不为了模板完整输出无用字段。
- **短时流程要跟住。** 验证码、登录确认这类要趁有效期处理的流程，在当前任务里主动盯着实际能读的来源，收到就及时完成已授权的后续操作；不刚开始等就改成几分钟后的定时任务然后结束。按来源的真实能力和时间窗口选现成的等待或有界轮询；完成、取消、窗口结束或来源读不了时，说明结果或缺口并结束等待。这不要求为几小时后的事一直挂着，也不新建全局轮询器或后台服务。

::screen{#rule-capabilities-runtime-12 section="original"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-12",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.capabilities-runtime.md",
   "release": "E251",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
   "from": "## 常用入口",
   "to": "## 浏览器",
   "start": 1419,
   "end": 5273,
   "approved_omissions": []
  },
  "title": "原文（二）：常用入口",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放“## 常用入口”和“本机小工具”“生成图片和设计画面”两条；右卡放“个人领域直达”“Google”两条。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-capabilities-runtime/rule-capabilities-runtime-12",
  "source_logical_id": "capabilities_runtime_contract",
  "source_public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
  "source_rule_part": "rule-capabilities-runtime/rule-capabilities-runtime-12"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "常用入口"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "云端素材通道"
    }
   ],
   "notes": "横版按“常用入口”和“云端素材通道”自然章节使用两张全宽原文卡，保持全部原文顺序及代码链接；避免旧左右卡长度悬殊造成大块留白。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "split_after": null,
     "illustration": "none",
     "icons": "none",
     "text_ref": "常用入口",
     "whole_block": true
    }
   ],
   "notes": "原文续标记小号左对齐；正文横版左右两大卡接续，竖版整宽单卡，井号不画、不是毛笔章节大标题。横版左卡本机/生图，右卡私人领域/Google；需在连续bullets里第2条后切栏。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-12-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-12-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a1ff7a4db4d4606d7694",
   "title_text": "常用入口",
   "sha256": "be195e42745168040107ed2e39e075135b5a02d84cd63ebfb34d498174db5223",
   "status": "ready",
   "source_box": [
    54,
    152,
    264,
    233
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E251 版 · 续

## 常用入口

- **本机小工具。** 问本机已有的小工具、以前用过的工具、图片超分或本机现成做法时，先查唯一清单 `E:\Tools\LocalToolbox\catalog.json`；按用途检索用 `E:\Tools\LocalToolbox\Find-LocalTool.ps1 -Query '<用途>' -Json`。工具列表、型号和哈希只在那份清单里。
- **生成图片和设计画面。** 图片默认用本人指定的 Codex 内置图片生成能力。它背后是独立的生图模型，出图好坏看生图模型和提示，不看由哪个文字模型去调用：Codex 的任何对话直接调用；Claude 写好提示，经包装器派 Luna 照提示调用并落盘（图像任务的 Generation 方式，见 `docs/claude-gpt-child-traffic.md`）。不为生图派 Astra，也不因为没有 Astra 授权就改派别的型号。按量收费的 API 密钥回退只在本人明确要时用。当前选用的生图模型记在模型清单，不把能力排名写成永久结论。
  - **能做什么。** 只用文字生成；以参考图为基准，延续它的风格、构图或角色；精准局部替换（换背景、去掉或改动某一处、透明底）；整套图保持一致；一次出几版拿来比对。
  - **用在哪。** 不限网页：界面设计和风格、插画、配图、封面、横幅、头像、图标和标志的设计，PPT 的整页设计、配图和底图，视频的风格参考、分镜、关键帧和封面，以及直接当成品的图（海报、带字的说明图）。
  - **怎么做。** 设计类先出几版，本人定了风格再照图写代码；素材类由 AI 出几版比对后自己选。定下的图当基准，之后都拿它当参考出图，保持整套一致；只有局部不对时用精准替换只改那一块，不整张重画；精准替换会把整张轻微重绘，要求没改的部分一个像素都不动时，把改好的那块贴回原图。成品复制进项目目录，按版本命名、不覆盖旧图，并核对文件真的存下了；审定的图冻结，以后只重做内容变了的部分。
  - **谁画、谁复核。** 要派出去生图时交 Luna（Codex 主对话可以自己直接调），档位见模型清单。复核按需，不是每张都要：成批的图交 Sol，很重要的交 Claude；只有几张图时不为复核另派子代理，主持的对话自己看。复核时图里的字逐字和原文核对，错了只修那一块；像不像拿整张图和参考并排比，先看第一眼像不像，再看细节。
  - **哪些仍用代码。** Claude 不自己用代码画这类画面；数据图表、流程图、进度条这类数字和文字要准确的，以及会变的内容（实时数据、计数、日期、状态），仍用代码画，或由代码填进图里留的空白；固定不变的艺术字和文字可以直接画进图里。
  - 个人网站另按项目已定的单层分工：Luna 画、Sol 审，不合格交 Claude 定；这只管网站，不外推为其他项目的默认（出处：`docs/owner-decisions.md`“网站：设计稿逐项审定、单层分工、留锚点、不重复介绍”）。
- **个人领域直达。** 健康、本人诉讼和微信分别直达 `personal-health`、`personal-litigation`、`wechat-direct`；只有原件位置不明、要跨已允许的位置查找或原来的定位失效时，才用 `personal-materials` 找到、打开并核对原件；精确录音和扫描件分别交给 `chinese-asr`、`localocr`。照片视频只在本人明确要求时做成独立的有界任务。没有独立领域项目时，直接用当前对话的事实和会改变答案的最少原件回答。不恢复中央个人数据库、统一事件图、跨领域画像、后台同步、总技能或默认的全景上下文。
- **Google。** 现行入口是 `google-workspace-direct`：仅通过固定 PCConfig OAuth/provider 处理 Gmail、Google Drive 和 Google Tasks（待办），各自按能力验收，具体操作见该技能；日历保持冻结。本人明确要写入时，也只调用这个入口已有的精确操作；不落库、不自动同步、不换账号，也不悄悄改走别的接入、连接器、浏览器或 rclone。入口没接好、账号失效或能力不够时如实说不可用或有限，不造第二 provider；写入、分享、发送和邀请要有对应能力和授权，删除、公开分享、发送和邀请还须绑定精确外部动作授权。Google Admin、支付和 Photos 不属于该入口。配置和凭据文件存在不说明账号、读取或写入现在可用。

## 云端素材通道

任何项目中，同一文件预计被 AI 读两次以上，或同一批文件的处理流量明显超过文件本身时，按 `cloud-asset-channel` 技能核对通道与读者。明确指定素材上云一次，本机保留同版，不扫描目录。GPT 云读采用 Codex 云端任务与结论收件箱：提交按当前登录账号的环境名称解析，不绑定环境 ID；等候只查任务列表，结论由云端直接 POST 到自有收件箱，本机只取文字 JSON，不用 cloud status/diff 下载整份图像任务详情。本机 Codex 仍不能直接接收 HTTPS 图片。Claude 本机复核每张图一次读完、一次答完；画图仍在本机。

旧版 Codex Cloud 的命令读者已接通，模型回执自报 GPT-5.6 Sol；云端审图校准未通过，尚未启用，网站图终审由 Claude Opus 完成。提交、查询和取结论只用命令，不操作电脑界面或网页。云端用一个通用环境，不只审图，其他要上云的处理也用它；联网不限域名。环境的网页设置、给新账号建同名环境和换账号都由本人做，AI 只用命令。保质保量并行；云端报额度不足或登录失效时暂停新的提交，交根会话告诉本人。

待升级：官方命令行能提交到新版 Codex Cloud 后，命令读者换成新版的 GPT-6.1 Sol，提交接线同一轮升级；估计约 1 个月（2–8 周）。切换前用一张公开图实跑，核对回执自报的型号；审图启用仍须通过校准，命令接通和型号核对不算审图校准通过。

云端从原图切原尺寸小块，逐块看，结论附每块坐标与 SHA256；没有裁片证据、未全覆盖或未逐块查看的回执无效。收件箱只接受已登记的 64 位随机任务令牌的一次 POST JSON，最多 64KB；登记对象以原 ETag 原子替换成结论，用后按状态清理，旧在途请求不能在删除后重新写入。R2 公网入口无凭据不能写入，收件箱未登记令牌返回 404。原图与裁片都在云端读取，裁片不从本机传。

通道配置的上传目标是 R2 桶 `wly-ai-assets`，网址前缀 `https://ai.wly0829.cn/`；目标和授权未接通时不报上传可用。对象按 SHA-256 内容指纹命名，首次上传保留原扩展名，同内容去重。给 AI 用之前核对本机指纹；变化就是新版本，上传后把旧引用标为“已被替换”，保证给 AI 的与本机一致。路径、指纹、大小、网址、用途、状态、上传时间、最后使用时间只登记在工具配置指定的单一登记表。

不设时间过期。有用就留，仍在用或以后按需更新还要用的版本一直留；被替换的旧版、落选候选和确定没用的云副本按状态清理，有其他在用引用的不删。密码、密钥、恢复码、身份证件和银行卡照片不进桶；公开范围仍按[个人资料与数据处理](/rules/privacy-data/#公开个人数据分级表)。上传用 Wrangler 既有的网页授权，不创建 API 令牌、不经手密钥原文。

总存储接近免费 10GB 时提醒本人去 Cloudflare 查看付款或充值，提醒写入根会话能读的结果和汇报；10GB 不是硬上限，不拒绝上传。标尺是每个文件理想上只上传一次、下载一次：本机出的候选图下载一次、上传云端一次，一张最多 2 份流量，之后审几轮都不再经过本机。每个任务登记本机实际上传和下载的文件正文，另列网络实测开销；以任务所用各文件内容版本大小之和为标尺，目标比值不超过 2，超过 2.5 告警，未观测的失败重试不冒充零。

不上云的本机处理也要省流量：看图前完成文字、材料和裁片准备，看图会话只发送一次全部必读图片，图后直接给结论，不再带图调用工具、续问或重试；结果由宿主写入。批量任务复用同一个原生进程，各任务仍用独立线程，避免每次冷启动约 28MB 的重复下载；池、流量计数和停止入口归当前任务，不另装长期服务。图片采用原像素无损压缩，逐一核对尺寸、模式和解码像素，不删图、不缩放或降质量。本机图像会话的流量护栏只读 `config/claude-gpt-child-traffic.json` 的 AI 默认值（不是本人禁令）；实测是连接采样，不能保证逐字节卡线。避免同一文件反复下载、上传，不以降低质量或拉长任务时间换取流量数字。具体入口与已核实的适用范围见 `docs/claude-gpt-child-traffic.md`。

具体命令、出错处理和收尾见 `cloud-asset-channel` 技能，规范源是 `E:\.agents\skills\cloud-asset-channel\SKILL.md`；协议细节见 `docs/cloud-asset-channel-reader.md`。

::screen{#rule-capabilities-runtime-13 section="original"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-13",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.capabilities-runtime.md",
   "release": "E251",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
   "from": "## 浏览器",
   "to": "## 汇报、网站和自动运行的东西",
   "start": 5273,
   "end": 6337,
   "approved_omissions": []
  },
  "title": "原文（三）：浏览器",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放“## 浏览器”和第一段（浏览器默认用……）、第二段（已授权的本人账号登录……）；右卡放第三段（需要真实浏览器预览本地HTML时……）；右卡下方空处画一幅小水彩：Chrome 彩色圆形标志旁边一个小浏览器窗口，窗口里只画色块，不画字。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。小水彩缩小放在最后。",
  "links": [
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/#宿主接线"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-capabilities-runtime/rule-capabilities-runtime-13",
  "source_logical_id": "capabilities_runtime_contract",
  "source_public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
  "source_rule_part": "rule-capabilities-runtime/rule-capabilities-runtime-13"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "illustration": "none",
     "text_ref": "浏览器",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "illustration": "bottom_inside",
     "text_ref": "需要真实浏览器预览本地HTML时",
     "illustrations": "auto",
     "illustration_asset": [
      "_library/illustrations/generic-report-page-dashboard.png"
     ],
     "body_columns": 1
    }
   ],
   "notes": "横版左卡浏览器节与前两段，右卡本地预览第三段，右卡下半内部Chrome窗口插画；竖版一整宽原文卡，插画在同卡最底部。小号原文续标记按原图左对齐，不当大章标题。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "bottom_inside",
     "text_ref": "浏览器",
     "illustrations": "auto",
     "whole_block": true,
     "illustration_asset": [
      "_library/illustrations/generic-report-page-dashboard.png"
     ]
    }
   ],
   "notes": "横版左卡浏览器节与前两段，右卡本地预览第三段，右卡下半内部Chrome窗口插画；竖版一整宽原文卡，插画在同卡最底部。小号原文续标记按原图左对齐，不当大章标题。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/generic-report-page-dashboard.png",
   "fallback": false,
   "key": "网页看板现图小槽4比3",
   "source_phrase": "需要真实浏览器预览本地HTML时，第一次打开就走受支持的本地HTTP开发路线，不先试file://；优先复用已有的开发或预览服务，确需临时服务时，就绪检查、进程和会话、事后清理由browser-control-continuity负责。只是生成文件时不机械启动服务；本人要的独立HTML文件不换成会话里的可视组件。",
   "sha256": "e6990e5657edbed68189b47d52f3088f639df95e4c2ed45db6698094d967b734",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/generic-report-page-dashboard.png",
   "fallback": false,
   "key": "网页看板现图小槽4比3",
   "source_phrase": "浏览器\n浏览器默认用本人正在用的外部Chrome（约法L29），没开时可以用现有受管能力启动；本人明确选别的浏览器时听本人的。不把某个工具的默认浏览器或应用内浏览器当成本人的默认，也不悄悄换浏览器家族。控制会话断了、运行环境要恢复时按browser-control-continuity技能处理，保留本人已打开的页面；这不改变网站上动作、账号和内容的授权。\n已授权的本人账号登录，需要手机号时可直接填写本人常用号码（记在个人理解库的“本人基本信息”卡，问“我的手机号”即可取到，登录一般用第一个）并发送验证码；验证码能从现有允许来源取得（短信验证码用PCConfig的按需取码工具tools/Invoke-SmsCode.ps1，说明在docs/runtime/sms-code.md），就及时完成登录，取不到交本人填写。需要账号密码时由本人登录，已退役的浏览器密码盲填不恢复。各宿主按自己的真实能力和限制执行，不把Claude的限制写成所有AI都不能做。短信来源未接通时如实说明，不把调查报告当成已能自动取码，也不为等待验证码新建全局后台服务。\n需要真实浏览器预览本地HTML时，第一次打开就走受支持的本地HTTP开发路线，不先试file://；优先复用已有的开发或预览服务，确需临时服务时，就绪检查、进程和会话、事后清理由browser-control-continuity负责。只是生成文件时不机械启动服务；本人要的独立HTML文件不换成会话里的可视组件。",
   "sha256": "e6990e5657edbed68189b47d52f3088f639df95e4c2ed45db6698094d967b734",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-13-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-13-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e19c3b9e266c69c952f9",
   "title_text": "浏览器",
   "sha256": "9b42dd5a4f1916f124e3c64bf517a91ff6f9b657956371129b2001d5372b895d",
   "status": "ready",
   "source_box": [
    49,
    189,
    214,
    266
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E251 版 · 续

## 浏览器

浏览器默认用本人正在用的外部 Chrome（约法 L29），优先用 Chrome 插件在本人已开着的 Chrome 里操作；没开时可以用现有受管能力启动，任务要求不弹窗口时用下述无窗口办法。本人明确选别的浏览器时听本人的。不把某个工具的默认浏览器或应用内浏览器当成本人的默认，也不悄悄换浏览器家族。Claude 的不同处（要用本人登录状态的网页默认派 GPT 子任务做，不需要登录的网页可用自己的内置浏览器看）见[Claude 适配](/rules/claude-adapter/#宿主接线)的“浏览器”。控制会话断了、运行环境要恢复时按 `browser-control-continuity` 技能处理，保留本人已打开的页面；这不改变网站上动作、账号和内容的授权。

本人的 Chrome 打不开或连不上时不要卡住，改用同一个 Chrome 程序的无头浏览器（不出窗口，使用任务独立临时配置，不读取、复制或改动本人浏览器资料）或其他不打扰本人的办法，继续完成能独立进行的操作和验收，并在汇报里写明实际方法、结果和仍未验到的部分。不换成别的浏览器品牌冒充本人的 Chrome，不把临时会话当成本人的登录状态。确实依赖本人登录状态或需要本人在场的步骤，只交回该步骤和缺口，其余已授权工作继续（出处：决定文档“默认 Chrome 不通时换办法、子代理可静默提权”）。

已授权的本人账号登录，需要手机号时可直接填写本人常用号码（记在个人理解库的“本人基本信息”卡，问“我的手机号”即可取到，登录一般用第一个）并发送验证码；验证码能从现有允许来源取得（短信验证码用 PCConfig 的按需取码工具 `tools/Invoke-SmsCode.ps1`，说明在 `docs/runtime/sms-code.md`），就及时完成登录，取不到交本人填写。需要账号密码时由本人登录，已退役的浏览器密码盲填不恢复。各宿主按自己的真实能力和限制执行，不把 Claude 的限制写成所有 AI 都不能做。短信来源未接通时如实说明，不把调查报告当成已能自动取码，也不为等待验证码新建全局后台服务。

需要真实浏览器预览本地HTML时，第一次打开就走受支持的本地HTTP开发路线，不先试 file://；优先复用已有的开发或预览服务，确需临时服务时，就绪检查、进程和会话、事后清理由 browser-control-continuity 负责。只是生成文件时不机械启动服务；本人要的独立 HTML 文件不换成会话里的可视组件。

::screen{#rule-capabilities-runtime-14 section="original"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-14",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.capabilities-runtime.md",
   "release": "E251",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
   "from": "## 汇报、网站和自动运行的东西",
   "to": "## 安装位置、配置和本机约定",
   "start": 6337,
   "end": 7647,
   "approved_omissions": []
  },
  "title": "原文（四）：汇报、网站和自动运行；软件更新和兼容",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放“## 汇报、网站和自动运行的东西”和它下面三条；右卡放“## 软件更新和兼容”和它下面四条。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-capabilities-runtime/rule-capabilities-runtime-14",
  "source_logical_id": "capabilities_runtime_contract",
  "source_public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
  "source_rule_part": "rule-capabilities-runtime/rule-capabilities-runtime-14"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "row": "source",
     "width": "50%",
     "illustration": "none",
     "text_ref": "汇报、网站和自动运行的东西"
    },
    {
     "type": "source_text_card",
     "row": "source",
     "width": "50%",
     "illustration": "none",
     "text_ref": "软件更新和兼容"
    }
   ],
   "notes": "原文续标记小号左对齐；正文横版左右两大卡接续，竖版整宽单卡，井号不画、不是毛笔章节大标题。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "split_after": null,
     "illustration": "none",
     "icons": "none",
     "text_ref": "汇报、网站和自动运行的东西",
     "whole_block": true
    }
   ],
   "notes": "原文续标记小号左对齐；正文横版左右两大卡接续，竖版整宽单卡，井号不画、不是毛笔章节大标题。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-14-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-14-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-df734fe45c2c9e3fbe97",
   "title_text": "汇报、网站和自动运行的东西",
   "sha256": "80508bde9b773e8ee53aeebb4e3f9840d072ff3396fcafbf9178adbe01b08756",
   "status": "ready",
   "source_box": [
    61,
    174,
    598,
    240
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
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-14-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-14-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cd777becf1c9a458e894",
   "title_text": "软件更新和兼容",
   "sha256": "dbe530091641dd97640998b854543cf38c3f76ac1538038c4bd22ef8bc723e3c",
   "status": "ready",
   "source_box": [
    855,
    175,
    1161,
    240
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E251 版 · 续

## 汇报、网站和自动运行的东西

- **汇报网页**：什么时候用、做成什么样见约法 L26。各模型的提问、推荐、说明框及生成、存放、到期清理，统一按 `report-page` 技能；需要长期留下的结论写进对应项目的记录，不靠网页保存。
- **网站**（约法 L27）：本人说“更新网站”时，按 `V:\Personal\Projects\wly0829.cn` 的 AGENTS.md 更新一次。不建自动定时更新。
- **自动运行的东西**（约法 L28）：计划任务、看门狗和其他自动运行的东西，要在网站看板上看得见：在做什么、上次和下次什么时候运行、有没有出错、怎么停、停了会影响什么。新增或修改自动运行的东西时，把这些状态写进看板能读的状态文件或登记（按 PCConfig 的现行做法）；看板怎么显示另行建设，不为此在本机另开窗口。后台命令不弹黑窗口。
- **要本人做、要本人选、可能漏看的事**：根会话在回复本人的同时，用 `pwsh -NoProfile -File E:\PCConfig\tools\Set-OwnerItem.ps1 -Mode Add` 登记到驾驶舱“需要你”，填写 `-PassCriteria` 完成条件；可机核的方法用 `-AiHint` 写入条目的 `ai_hint`。Claude、Codex 用同一命令；子代理不登记，交根会话决定。
  周治理或任何 AI 核实完成条件后，用同一命令 `-Mode Close -Id <条目id> -Result passed -Note <核实证据>` 关闭；本人说做完，也先查对应条目并核实后关闭。只有 AI 能关闭，网页不提供删除。

## 软件更新和兼容

- 可以从官方来源把软件更新到兼容、可回退、净收益为正的稳定版；不越过版本锁定、付费或账号、正在运行的任务、重启或重装、信任边界。最新的、不确定的或需要引用的事实上网核实，技术问题优先看官方。
- 版本固定只用于复现、安全或合规、已证实不兼容或上游硬约束；在项目里就地写清原因和什么时候解除，不把精确版本变成永久门槛。不拿软件的精确版本号、构建号、带版本的安装路径当正常功能或准入的门槛；版本号可以用于诊断、测试证据、复现和回滚。
- 给在用的软件（各个宿主、普通程序、插件、技能、MCP、运行环境及其接口、配置和数据格式）新建、修改、安装、升级、集成或迁移时，保护还有用的功能、数据、配置、必要流程和本人能感觉到的体验，不保护旧代码的样子。接口的能力和含义没变，正常更新后应该不用改集成就能用。优先用官方稳定接口和能力探测；没验证过的新版本既不等于不兼容，也不等于已验证。必需字段、未知请求和含义变化不能被吞掉或冒充成功。这不要求每个项目适配所有框架，也不扩大成维护无关软件或恢复冻结项目。
- 同一主体的正常更新，不因为自己的适配无故重置还有效的身份或授权，也不要求重复本人验证。只保留有现实用途的旧格式或入口，不借兼容永久留着旧实现。改动涉及兼容时，复用项目原有的回归和真实使用入口来验证；程序能启动、接口有响应或静态测试通过，都不单独说明还能照常用。

::screen{#rule-capabilities-runtime-15 section="original"}

```typeset
{
 "screen": {
  "id": "rule-capabilities-runtime-15",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.capabilities-runtime.md",
   "release": "E251",
   "sha256": "f6ec15b4b5cf245c38518a1c066275785c4041bddaf4fdeda317aa34c79b2ae5",
   "public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
   "from": "## 安装位置、配置和本机约定",
   "to": null,
   "start": 7647,
   "end": 9057,
   "approved_omissions": []
  },
  "title": "原文（五）：安装位置、配置和本机约定",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成前面带小绿圆点的一条，短横不画；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文照抄，标点照抄，不加任何没给的字。左卡放“## 安装位置、配置和本机约定”和“缺什么装什么”“东西放 E 盘”两条；右卡放“配置”“技能和插件”“Windows”三条。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "日常技术默认",
    "href": "/rules/engineering-delivery/#日常技术默认"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-capabilities-runtime/rule-capabilities-runtime-15",
  "source_logical_id": "capabilities_runtime_contract",
  "source_public_sha256": "055e9e011319f02f9c03d48a0354cc28d981399cb856f39164f2d4a5feedc92d",
  "source_rule_part": "rule-capabilities-runtime/rule-capabilities-runtime-15"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "columns": 2,
     "columns_v": 1,
     "split_after": "东西放 E 盘",
     "illustration": "none",
     "icons": "none",
     "text_ref": "安装位置、配置和本机约定"
    }
   ],
   "notes": "新构图，待样张。该方向无有效原图。原文续标记小号左对齐；正文横版左右两大卡接续，竖版整宽单卡，井号不画、不是毛笔章节大标题。横版 -h.png 为零字节，另有 -h-new.png 未列入批准替换，不擅自认定通过；参考14横版写两栏，新构图待样张。竖版原图第一张后两条即停，v2接配置/技能/Windows；原图把底注重复画了两次，定稿只显示一次；按定稿放最后。",
   "reference_screen": "rule-capabilities-runtime-14",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "split_after": null,
     "illustration": "none",
     "icons": "none",
     "text_ref": "安装位置、配置和本机约定",
     "whole_block": true
    }
   ],
   "notes": "原文续标记小号左对齐；正文横版左右两大卡接续，竖版整宽单卡，井号不画、不是毛笔章节大标题。横版 -h.png 为零字节，另有 -h-new.png 未列入批准替换，不擅自认定通过；参考14横版写两栏，新构图待样张。竖版原图第一张后两条即停，v2接配置/技能/Windows；原图把底注重复画了两次，定稿只显示一次；按定稿放最后。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "rule-capabilities-runtime/rule-capabilities-runtime-15-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-capabilities-runtime\\img\\rule-capabilities-runtime-15-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f38ed295f09e29b4e526",
   "title_text": "安装位置、配置和本机约定",
   "sha256": "1aad819db1c4e5e22ea44e60afba50589e5dc3340e20fd702eac225d24c7559c",
   "status": "ready",
   "source_box": [
    46,
    227,
    659,
    318
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E251 版 · 续

## 安装位置、配置和本机约定

- **缺什么装什么。** 任务必需而本机缺的运行环境、SDK、命令行或构建工具，可以从官方支持的途径安装并验证。已有项目服从它的版本锁和 CI；依赖放在生态原本的位置，跨项目的工具和服务归 PCConfig。没有约束的新环境选最新稳定版；兼容层、容器或旧运行环境只在原生途径不能用时才用。付费或账号、重启或重装、放宽安全、信任或授权边界仍按原来的门办。
- **东西放 E 盘**（约法 L29）：新装软件默认放 E 盘合适的目录（如 `E:\Program Files\<软件名>`）；AI 的缓存、临时文件、构建中间物、大任务产物和新工作区放 PCConfig 登记的数据盘，不往 C 盘堆。任务目录或宿主默认在 C 盘，不是继续写 C 盘的理由：按消费者支持的正式设置指定路径，传给实际执行的进程，并回读真实落点。安装器或系统组件必须固定位置时，按原生位置装并说明，不顺手迁移已有安装。确实不能迁走、还在用的官方小运行环境可以留例外，说明路径和原因。迁移要确认使用者已经在用新位置、原来的空间已经实际腾出；只复制到新盘、C 盘还留一份不算迁移完成。新电脑的盘符、系统盘容量和数据位置由本人决定，本机的 E 盘约定不是新电脑必须有 E 盘的门槛。
- **配置。** 项目拥有自己的业务配置、默认值、版本和迁移；PCConfig 拥有机器事实和导航。优先静态配置和项目已有机制，确实需要热更新、多进程或跨实例时才用相应的现成机制，不预建全局配置平台。项目登记过的机器或恢复键改了，先验证项目源，再经 PCConfig 现有的快照预演、应用和回读更新派生视图；快照不是业务权威，也不加监视器或后台同步。秘密用现行的 SecretRef，不放进版本化的普通配置。密钥的产品合同、保存和供给归独立密码中心（私有仓库 `E:\Projects\Tools\PasswordCenter`），PCConfig 管本机安装、路径、任务和恢复接线；取用走 `local-secret-broker` 指向的现役入口。已有厂商密钥可以供其支持的多个模型和多个项目使用，换模型不为密钥重复登记、复制或锁定，也不把一个厂商永久限制为只能有一把密钥；模型名、用量和业务选择归调用项目。
- **技能和插件。** 技能和插件的规范源在 `E:\.agents\skills` 和 `E:\.agents\plugins`，用户目录只放发现链接；清单 `config/personal-skill-supply.json` 和现有安装器管理安装。要查技能装没装、`.agents`、PCConfig 和 GitHub 索引登记坏没坏时，跑只读的 `tools/Invoke-ControlPlaneDoctor.ps1 -Json`（查单个技能加 `-SkillName <名>`）；它只看安装和登记，说明不了技能好不好用。只有缺的能力真的影响本人要的结果时，才去翻按需插件目录；目录里的示例命令只是数据，不自动执行。
- **Windows。** 命令、编码、临时内容和显卡任务按[日常技术默认](/rules/engineering-delivery/#日常技术默认)处理，外部进程的实际编码现场核对。Codex 的机器根目录和 V、Z 盘分工向 PCConfig 和 Git 源读取，不凭旧路径猜。
