---
{
 "title": "OpenClaw 网关",
 "kind": "frozen",
 "url": "/projects/openclaw/",
 "tagline": "用手机聊天软件给家里电脑上的 AI 派活",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "why-frozen",
   "label": "哪里不好用"
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
  "page": "openclaw",
  "kind": "frozen",
  "title": "OpenClaw 网关",
  "url": "/projects/openclaw/",
  "tagline": "用手机聊天软件给家里电脑上的 AI 派活",
  "status": "冻结",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/OpenClawGateway",
  "capability": "在聊天软件里给电脑上的 AI 派活（已停用）",
  "based_on": {
   "commit": "076e788698456649a6693a5f7a20f4c4445a32c8",
   "commit_time": "2026-09-28T01:20:20+08:00",
   "files": [
    "OpenClawGateway README.md、docs/*.md（076e788）",
    "OpenClawGateway 历史里的 journal/*.md 与 docs/AUDIT.md（dea6d7e 的上一版）",
    "E:\\Projects\\Backups\\openclaw-backup README.md 与提交记录（9359383）",
    "E:\\.agents\\docs\\owner-decisions.md（D5、E16、E17、WR 节、冻结原因节、打回节）",
    "E:\\PCConfig\\registries\\task_purpose_catalog.json、tasks.json（2026-09-27 扫描）",
    "旧网站 V:\\Personal\\Projects\\wly0829.cn\\app\\content-openclaw-gateway.js（6f3cb90）"
   ]
  },
  "video_prompt": "5–8 秒无缝循环，白底、纯绿主色的水彩插画风，画面里不出现任何文字。从开头这屏右侧的插画出发：手机屏幕上 Telegram 和飞书的聊天气泡轻轻冒出一个，一条细细的绿色虚线从手机向家里的台式电脑延伸，走到一半慢慢变淡、断开；电脑前趴着打盹的红色小龙虾随呼吸轻轻起伏，身上的一层薄霜偶尔闪一下微光；几片绿叶从上方缓缓飘落。最后回到起始画面接上循环。",
  "registry": {
   "groups": [
    {
     "id": "g-chat",
     "name": "在聊天里派活"
    },
    {
     "id": "g-run",
     "name": "让它一直在线"
    },
    {
     "id": "g-backup",
     "name": "备份与恢复"
    }
   ],
   "features": [
    {
     "id": "f-channel-handoff",
     "group": "g-chat",
     "name": "渠道交办",
     "what": "在 Telegram 或飞书发任务，OpenClaw 在电脑上执行，结果回原对话",
     "how": "在已配置的聊天里直接发任务；验收要看收到、执行、回原对话三段",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 content-openclaw-gateway.js:210；docs/USAGE.md 第 2 节"
    },
    {
     "id": "f-model-cost",
     "group": "g-chat",
     "name": "模型与花费",
     "what": "说清默认走哪个模型、还能手选哪些远程模型、哪里可能花钱",
     "how": "AI 只读查看模型目录和认证来源；改模型走 OpenClaw 官方命令",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :236；README“成本态势”节"
    },
    {
     "id": "f-chat-skills",
     "group": "g-chat",
     "name": "聊天里的技能",
     "what": "在聊天里让它写代码（交给 Cline）、查微信、收发邮件、看 Gmail 和日历、跑多步流程等",
     "how": "说到相关的事它自动联想对应技能；6 月 21 日从 44 个可见技能砍到 10 个",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧日志 journal/2026-06-21-token-framework-skill-audit.md:14–16；2026-06-20.md:24–26"
    },
    {
     "id": "f-memory-dreaming",
     "group": "g-chat",
     "name": "记忆和做梦",
     "what": "会话内记得前文；夜里把日志整理进长期记忆",
     "how": "自动；做梦用便宜模型、一夜一次",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧日志 auth-fix-models.md:17；token-framework-skill-audit.md C 节"
    },
    {
     "id": "f-public-entry",
     "group": "g-chat",
     "name": "外网入口",
     "what": "从外网经 Tailscale Funnel 连到电脑上的网关",
     "how": "Funnel 转发到本机 18789；9 月 26 日撤掉",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧日志 final-fixes.md:6；决定记录 E17；PCConfig 任务登记 \\OpenClaw Gateway"
    },
    {
     "id": "f-gateway-runtime",
     "group": "g-run",
     "name": "网关常驻",
     "what": "开机自启、只本机访问、不健康才重启",
     "how": "开机任务拉起网关；心跳任务每 15 分钟查官方健康检查",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :262；docs/OPENCLAW.md 生命周期；docs/MAINTENANCE.md 心跳"
    },
    {
     "id": "f-managed-update",
     "group": "g-run",
     "name": "受控更新",
     "what": "不自动追新，升级前备份、升级后逐项核对",
     "how": "AI 先只读查版本；本人同意后跑升级入口，结果分成功、失败、部分完成",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :288；docs/MAINTENANCE.md 受控更新"
    },
    {
     "id": "f-bootstrap-install",
     "group": "g-run",
     "name": "部署与引导",
     "what": "换电脑时按公开模板装好，私人配置先预演再写入",
     "how": "复制模板到私人位置填好，先 -WhatIf 预演，再正式写入",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :342；docs/DEPLOY.md"
    },
    {
     "id": "f-codeg-bridge",
     "group": "g-run",
     "name": "接进 CodeG",
     "what": "让 CodeG 里的 Cline 调 OpenClaw 的工具，网关密码不写进配置",
     "how": "跑桥接脚本，再在 CodeG 里刷新、启用、列工具；6 月实测 9 个工具，9 月那版没再验收",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :368；docs/CODEG.md；旧日志 codeg-and-docs.md:6–9"
    },
    {
     "id": "f-api-switch",
     "group": "g-run",
     "name": "旧“API 一键开关”",
     "what": "一键把远程模型密钥清空，做到零花费；再一键恢复",
     "how": "6 月 20 日做的开关脚本；8 月底退役，旧命令会被拒绝",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "提交 dc6ae86；README“成本态势为什么不再有 api on/off”；docs/AUDIT.md 验收"
    },
    {
     "id": "f-backup-restore",
     "group": "g-backup",
     "name": "官方备份和恢复演练",
     "what": "做带校验的官方归档，演练时只恢复到新建的空文件夹",
     "how": "备份脚本调用官方 backup create --verify；恢复脚本先校验再解到空目录，不激活",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :314；README 观测表；docs/USAGE.md 第 5 节"
    },
    {
     "id": "f-openclaw-backup",
     "group": "g-backup",
     "name": "OpenClaw 设置和工作区备份",
     "what": "把 OpenClaw 的设置（含密钥）和工作区（人格、记忆、技能）存三份",
     "how": "计划任务 OpenClaw Memory Backup 定时存本地、G 盘和私有仓库 openclaw-backup",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "openclaw-backup README；git log（29 个快照）；PCConfig 任务登记"
    },
    {
     "id": "f-other-ai-backup",
     "group": "g-backup",
     "name": "顺带的三套 AI 备份",
     "what": "Claude、Gemini、Codex 的记忆和设置备份曾挂在这个仓库",
     "how": "现在归 AI 备份（codex-memory）：只留 Codex 的对话备份，Claude 和 Gemini 那两套 9 月 28 日退役",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "PCConfig task_purpose_catalog.json 三条任务；提交 aa4f9f1、076e788"
    },
    {
     "id": "f-autopush",
     "group": "g-backup",
     "name": "公开仓库每日归档",
     "what": "每天把公开仓库能公开的改动提交推送",
     "how": "计划任务 OpenClawGateway AutoPush 每天 21:15；有密钥形态、别人的暂存改动或远端分叉就停",
     "status": "已停用",
     "screen": "openclaw-04",
     "source": "旧网站 :12、:68；PCConfig 任务登记"
    }
   ],
   "numbers": [
    {
     "id": "n-request-tokens",
     "text": "127,675",
     "meaning": "一次飞书请求的输入 token",
     "as_of": "2026-06-21",
     "source": "旧日志 journal/2026-06-21-token-optimization.md 第 11 行",
     "screens": [
      "openclaw-01",
      "openclaw-02"
     ]
    },
    {
     "id": "n-commits",
     "text": "65 次",
     "meaning": "网关仓库全部提交，6 月 19 日到 9 月 28 日",
     "as_of": "2026-09-28",
     "source": "git -C E:\\Projects\\Tools\\OpenClawGateway rev-list --count HEAD",
     "screens": [
      "openclaw-01",
      "openclaw-05"
     ]
    },
    {
     "id": "n-frozen-date",
     "text": "9 月 12 日",
     "meaning": "本人把它列进冻结名单的日子",
     "as_of": "2026-09-12",
     "source": "E:\\.agents 提交 68a89c6；E187 agents.context-sources.md 第 31–32 行",
     "screens": [
      "openclaw-01",
      "openclaw-05"
     ]
    },
    {
     "id": "n-tasks",
     "text": "5 个",
     "meaning": "OpenClaw 自己的计划任务（网关、心跳、备份、更新、公开归档），全部停用未删",
     "as_of": "2026-09-27",
     "source": "E:\\PCConfig\\registries\\tasks.json（task-scan 2026-09-27）enabled=false；task_purpose_catalog.json",
     "screens": [
      "openclaw-01",
      "openclaw-05"
     ]
    },
    {
     "id": "n-prompt-tokens",
     "text": "15–18K token",
     "meaning": "每轮固定塞进去的系统提示",
     "as_of": "2026-06-21",
     "source": "旧日志 token-optimization.md 第 10 行",
     "screens": [
      "openclaw-01",
      "openclaw-02"
     ]
    },
    {
     "id": "n-skills",
     "text": "82 个技能、44 个每轮给模型看、砍到 10 个",
     "meaning": "6 月 21 日技能审计；82 个里有多少是 OpenClaw 自带、多少是 6 月 20 日 AI 开的，记录没写",
     "as_of": "2026-06-21",
     "source": "旧日志 token-framework-skill-audit.md 第 14–16 行",
     "screens": [
      "openclaw-01",
      "openclaw-02",
      "openclaw-04",
      "openclaw-05"
     ]
    },
    {
     "id": "n-timeouts",
     "text": "两次 10 秒没响应",
     "meaning": "9 月 9 日 11:40、11:42（北京时间）官方状态调用超时，随后自行恢复",
     "as_of": "2026-09-09",
     "source": "旧网站第 7、84 行",
     "screens": [
      "openclaw-02",
      "openclaw-05"
     ]
    },
    {
     "id": "n-remote-routes",
     "text": "21 条路线（通义千问 11、DeepSeek 2、Z.AI 8）",
     "meaning": "可手选的远程模型路线",
     "as_of": "2026-09-04",
     "source": "README 观测表；旧网站第 15、58 行",
     "screens": [
      "openclaw-03"
     ]
    },
    {
     "id": "n-archive",
     "text": "224,287,339 字节",
     "meaning": "一份官方校验归档（不含工作区）",
     "as_of": "2026-09-03",
     "source": "README 观测表",
     "screens": [
      "openclaw-04"
     ]
    },
    {
     "id": "n-snapshots",
     "text": "29 个快照",
     "meaning": "openclaw-backup 本机副本里的快照提交，6 月 21 日到 9 月 1 日",
     "as_of": "2026-09-28",
     "source": "git -C E:\\Projects\\Backups\\openclaw-backup log，标题含 openclaw snapshot 的提交",
     "screens": [
      "openclaw-04"
     ]
    },
    {
     "id": "n-codeg-tools",
     "text": "9 个工具",
     "meaning": "6 月实测 CodeG 里 Cline 通过桥接列出的 OpenClaw 工具",
     "as_of": "2026-06-21",
     "source": "旧日志 codeg-and-docs.md 第 9 行",
     "screens": [
      "openclaw-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "8 月 16 日起 OpenClaw 用的凭据由密码中心发放；CodeG 桥接靠受控启动器注入网关密码，不写进配置",
     "source": "提交 7a7a075；docs/CODEG.md"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "登记",
     "flow": "PCConfig 登记它的 5 个计划任务（现全部停用、换机不重建），提供受控启动器和 OpenClaw 备份的隐藏启动器",
     "source": "PCConfig task_purpose_catalog.json；提交 42bc097"
    },
    {
     "id": "r-ai-backup",
     "with": "codex-memory",
     "direction": "交出去",
     "flow": "Claude、Gemini、Codex 的记忆备份原来都挂在 OpenClaw Memory Backup 上，9 月 25 日前后各自迁出；9 月 28 日 Claude 和 Gemini 那两套退役，AI 备份现在只留 Codex 的对话备份",
     "source": "PCConfig task_purpose_catalog.json"
    },
    {
     "id": "r-codex-memory",
     "with": "codex-memory",
     "direction": "交出去",
     "flow": "Codex 备份 7 月 1 日加进来，9 月 4 日前交给独立的 codex-memory，本仓库删掉副本",
     "source": "提交 baa1a04、aa4f9f1；旧网站第 47 行"
    },
    {
     "id": "r-gemini-memory",
     "with": "gemini-memory",
     "direction": "交出去",
     "flow": "Gemini（含 Antigravity）备份 7 月 1 日加进来，9 月 28 日前移到 gemini-memory 仓库",
     "source": "提交 232421c、076e788；决定 ZS29；PCConfig 任务登记"
    },
    {
     "id": "r-wechat",
     "with": "wechatdirect",
     "direction": "被代替（推断）",
     "flow": "OpenClaw 的查微信技能调 WeFlow 接口读微信；现在系统里读微信的是微信直读",
     "source": "旧日志 2026-06-20.md:24–26；决定记录 1623 行（本人说的是“微信记录交给 AI”被取代）"
    },
    {
     "id": "r-remote",
     "with": "sunshine-remote-streaming",
     "direction": "被代替（推断）",
     "flow": "在外面用手机指挥电脑的需求，现在靠手机远程连回电脑桌面",
     "source": "决定记录 CP3（平时主要用 Moonlight）；codex-local-remote 的冻结原因"
    },
    {
     "id": "r-channels",
     "with": "Telegram、飞书（Google Chat 已关）",
     "direction": "外部服务",
     "flow": "聊天消息进网关、结果回原对话",
     "source": "README 数据流"
    },
    {
     "id": "r-models",
     "with": "Ollama 本机模型、通义千问（阿里云）、DeepSeek、Z.AI",
     "direction": "外部服务",
     "flow": "网关把任务交给模型；远程路线要手选、可能花钱",
     "source": "README 观测表"
    },
    {
     "id": "r-tailscale",
     "with": "Tailscale Funnel",
     "direction": "外部服务",
     "flow": "外网入口转发到本机 18789；9 月 26 日撤掉",
     "source": "PCConfig 任务登记 \\OpenClaw Gateway"
    },
    {
     "id": "r-codeg",
     "with": "CodeG / Cline",
     "direction": "外部工具",
     "flow": "Cline 经 stdio 桥接调用 OpenClaw 工具",
     "source": "docs/CODEG.md"
    },
    {
     "id": "r-github",
     "with": "GitHub",
     "direction": "外部服务",
     "flow": "公开仓库 OpenClawGateway 每日归档；私有仓库 openclaw-backup 存设置和工作区",
     "source": "README；openclaw-backup README"
    }
   ],
   "highlights": [
    {
     "id": "h-one-light-one-layer",
     "title": "一个绿灯只说明一层",
     "screen": "openclaw-03"
    }
   ],
   "mentions": [
    {
     "target": "/projects/openclaw/#why-frozen",
     "screen": "openclaw-01",
     "text": "哪里不好用，逐条看"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "openclaw-01",
     "text": "远程电脑串流"
    },
    {
     "target": "/rules/charter/#L24",
     "screen": "openclaw-01",
     "text": "约法 L24"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "openclaw-02",
     "text": "远程电脑串流"
    },
    {
     "target": "/projects/wechatdirect/",
     "screen": "openclaw-02",
     "text": "微信聊天读取"
    },
    {
     "target": "/projects/codex-memory/",
     "screen": "openclaw-02",
     "text": "AI 备份"
    },
    {
     "target": "/projects/password-center/",
     "screen": "openclaw-05",
     "text": "密码中心"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿 openclaw-backup.json 没有功能条目；它的内容写成功能 f-openclaw-backup（OpenClaw 设置和工作区备份）。",
    "心跳自愈（OpenClaw Heartbeat 任务）并进 f-gateway-runtime（网关常驻）：旧网站本来就把它放在“网关常驻”模块里。",
    "6 月的“安全模式”（清空密钥、停后台，零花费）并进 f-api-switch：两者是同一套开关脚本。",
    "底稿的 7 个旧模块全部保留（渠道交办、模型与成本→模型与花费、网关常驻、受控更新、备份与恢复→官方备份和恢复演练、部署与引导、工具接入→接进 CodeG），另从旧日志和任务登记补了 7 项：聊天里的技能、记忆和做梦、外网入口、旧 API 一键开关、OpenClaw 设置和工作区备份、顺带的三套 AI 备份、公开仓库每日归档。"
   ],
   "dropped": [
    "旧网站的运行证据细节不上：doctor 的 3 条警告、插件版本矩阵、7 个相关任务的具体时刻、TLS 断线修复回执、退出码传播规则、证据分层表、全新 Windows 未验收等——项目已冻结，读者用不上；“一个绿灯只说明一层”一句话概括了它们的共同思路。",
    "稳定目标版本不写：9 月 3 日 README 写目标 2026.9.1、落后；旧网站 9 月 4 日后又写目标取不到（未知），两处对不上。",
    "旧日志里的外网地址、设备配对编号、密钥尾号、本机用户目录路径不上（凭据类和无用细节）。",
    "6 月 20 日评估过的语音、图像、Notion 等技能不单列：6 月 21 日技能审计时已禁用，没有留下来。"
   ],
   "unsure": [
    "“哪里不好用”按审稿和 Claude 的提醒收窄成四条，只留出在 OpenClaw 自身的（会话越积越大、每轮固定说明和技能描述占 token、官方升级的体检修复改设置、自己崩溃循环和没响应）；出在部署、额度、模型接口、CodeG 的写进“不算在它头上的”。本人只说过“openclow这个agents本身不好用”，没逐条说，请本人确认这四条是不是真原因。第 4 条“9 月 9 日两次 10 秒没响应”根因没查出，也可能和这台电脑有关。",
    "“现在用什么”是 AI 按现状推断的，本人没说过 OpenClaw 被什么代替：写的是“派活直接找这台电脑上的 Claude 和 Codex 桌面版；人在外面，就用手机连回电脑的桌面操作：远程电脑串流”。依据：现行规则里受信任的 AI 只有 Claude、Codex 桌面版；本人 CP3 说平时主要用 Moonlight；Codex 远程的冻结原因是被远程桌面串流替代。",
    "对照表“在聊天里查微信 → 微信直读”是推断：本人说“被微信聊天读取取代”的是另一个冻结项目“微信记录交给 AI”，OpenClaw 的查微信技能用的正是那一套（WeFlow）。",
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“派活直接找这台电脑上的 Claude 和 Codex 桌面版……”；第 3 屏“运维交给 AI，我不开终端”“我只说一句：‘OpenClaw 现在为什么没回消息？先检查，不要发测试消息或重启。’”（这句问话是旧网站原句）；第 2 屏第 3 条“只许我发消息”。",
    "“小龙虾”这个叫法出自私有备份仓库 README（“OpenClaw 网关「小龙虾」”），不确定是 OpenClaw 官方的外号还是本人起的。",
    "第 3 屏“想让它当‘有记忆的伙伴’”：出处是 6 月 21 日日志“注入伴侣身份：有记忆的 AI 伴侣”，日志没写这是本人的要求还是 AI 的主意。",
    "openclaw-backup 的 29 个快照按本机这份副本的提交数；定时任务推送用的工作目录可能是另一份，远端可能更多（没联网核）。旧网站 9 月 10 日读到的 G 盘快照也停在 9 月 1 日，和本机副本一致。",
    "首屏没放〔在整套系统里的位置 → 怎么协作〕：冻结项目和现役项目已没有来往，关系只剩“被谁代替”。如果第 2 批的怎么协作页要给冻结项目留位置，再补这个按钮。",
    "旧版首屏和第 2 屏的“0 / 2”（消息往返没验收）已删：9 月那几轮检查按规矩没发测试消息，是没测，不是测了不通。",
    "做梦（夜里整理记忆，每次约 19K token）不再列为毛病：6 月 20 日本人选择开着，6 月 21 日决定保留、换便宜模型；只在全部功能里写。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/openclaw/page.json",
  "sha256": "419f26996ab20dd536f658523d86b7627d5d60f4bdf3078c45c11ddc7e7a154e",
  "converted_at_beijing": "2026-10-10T10:58:16+08:00"
 }
}
---

::screen{#openclaw-01 section="top"}

```typeset
{
 "screen": {
  "id": "openclaw-01",
  "section": "top",
  "title": "开头",
  "scene": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“OpenClaw 网关”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张一只趴着打盹、身上落了薄霜的红色小龙虾；第二张一台电脑屏幕上并排画 Claude 和 Codex（OpenAI）的标志；第三张一个拔下来的电源插头。每张卡第一行粗体小标题，下面两三行正文。右侧约 45%：一幅水彩插画：一部手机，屏幕上是 Telegram 和飞书的标志和一个聊天气泡；一条细绿虚线从手机连向一台家用台式电脑，虚线在半路断开；电脑前趴着一只红色小龙虾在睡觉，身上落了一层薄霜。画面下部一排四张数字卡片（上面小插画，大号绿色数字，下面一行小字），数字卡整体偏灰淡一点，表示是历史数字。最下面一行：左边一个白底细浅绿描边的圆角按钮，里面是 GitHub 标志和“GitHub”字样；右边一行小字和链接。不画“现在”横条（项目已冻结，没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版 9:16，从上往下：大标题和“已冻结”标签；右侧那幅插画放到标题下面，占满宽度；介绍段；三张说明卡改成上下三张，每张一整行；四张数字卡改成两行两张；最下面 GitHub 按钮单独一行，下面一行小字和链接。字完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "哪里不好用，逐条看",
    "href": "/projects/openclaw/#why-frozen"
   },
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/OpenClawGateway"
   },
   {
    "text": "约法 L24",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/openclaw/#ai-brief"
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
     "row": "hero",
     "width": "55%",
     "text_ref": "OpenClaw 网关",
     "row_fit_illustration": true
    },
    {
     "type": "tag",
     "tone": "gray",
     "row": "hero",
     "text_ref": "已冻结"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "原来想在手机"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "content_card",
     "columns": 3,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "为什么不用了",
     "width": "100%"
    },
    {
     "type": "prose",
     "text_ref": "数字卡片"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "illustration": "none",
     "icons": "none",
     "historical": true,
     "text_ref": "1 127,675"
    },
    {
     "type": "action_button",
     "promote_links": [
      "GitHub",
      "复制 AI 续作说明"
     ],
     "text_ref": "〔GitHub〕"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。横版左55%含标题/冻结标签、介绍及三说明卡；右45%卡外手机—断开的细绿虚线—电脑和带霜打盹小龙虾；四历史数字卡在底部整宽。竖版标题/标签、主插画、介绍、三卡、2×2数字卡、GitHub和续作按钮/说明链接依次排。不加现在横条，不启动冻结项目。\n页修复10：h简介三卡移到首屏插画下方全宽三列；两方向数字卡不放图。数字卡片说明原属定稿，删字待main裁定，暂保留。简介第一图标和标题污染交素材。",
   "pending_requirements": [
    {
     "owner": "主工程师 / comp-hub",
     "type": "unsupported_layout",
     "fields": [
      "blocks[stat_card:1 127,675].type",
      "blocks[stat_card:1 127,675].historical"
     ],
     "requirement": "四条数字原文是 steps.cols，须显示原编号一次并按竖线前大数字/后说明生成四张数字卡；stat_card 当前仅收 stats。横版四列、竖版两列；historical 当前未消费，只让历史卡/插画适度灰淡，不降低毛笔浓度。",
     "evidence": "openclaw/page.json:openclaw-01.text；components/core/__init__.py:stat_card；components/comp-hub/link_stats.py:stat_card"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:已冻结].tone",
      "blocks[action_button:〔GitHub〕].promote_links"
     ],
     "requirement": "已冻结为灰绿小标签；底行仅 GitHub 与复制AI续作说明为等大白底细边按钮，约法L24保持内联链接。tag 不读取 tone；action_button 对混合 para 不提升指定链接，promote_links 当前未读取。",
     "evidence": "openclaw/page.json:openclaw-01.scene；components/comp-text/primitives.py:render_tag；components/comp-text/buttons.py:render_action_button"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[content_card:为什么不用了].icons",
      "blocks[stat_card:1 127,675].icons",
      "blocks[action_button:〔GitHub〕]"
     ],
     "requirement": "icon 需要 8 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:OpenClaw 网关].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "OpenClaw 网关"
    },
    {
     "type": "tag",
     "tone": "gray",
     "text_ref": "已冻结"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "prose",
     "text_ref": "原来想在手机"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "为什么不用了"
    },
    {
     "type": "prose",
     "text_ref": "数字卡片"
    },
    {
     "type": "stat_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "none",
     "icons": "none",
     "historical": true,
     "text_ref": "1 127,675"
    },
    {
     "type": "action_button",
     "promote_links": [
      "GitHub",
      "复制 AI 续作说明"
     ],
     "text_ref": "〔GitHub〕"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。横版左55%含标题/冻结标签、介绍及三说明卡；右45%卡外手机—断开的细绿虚线—电脑和带霜打盹小龙虾；四历史数字卡在底部整宽。竖版标题/标签、主插画、介绍、三卡、2×2数字卡、GitHub和续作按钮/说明链接依次排。不加现在横条，不启动冻结项目。\n页修复10：h简介三卡移到首屏插画下方全宽三列；两方向数字卡不放图。数字卡片说明原属定稿，删字待main裁定，暂保留。简介第一图标和标题污染交素材。",
   "pending_requirements": [
    {
     "owner": "主工程师 / comp-hub",
     "type": "unsupported_layout",
     "fields": [
      "blocks[stat_card:1 127,675].type",
      "blocks[stat_card:1 127,675].historical"
     ],
     "requirement": "四条数字原文是 steps.cols，须显示原编号一次并按竖线前大数字/后说明生成四张数字卡；stat_card 当前仅收 stats。横版四列、竖版两列；historical 当前未消费，只让历史卡/插画适度灰淡，不降低毛笔浓度。",
     "evidence": "openclaw/page.json:openclaw-01.text；components/core/__init__.py:stat_card；components/comp-hub/link_stats.py:stat_card"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:已冻结].tone",
      "blocks[action_button:〔GitHub〕].promote_links"
     ],
     "requirement": "已冻结为灰绿小标签；底行仅 GitHub 与复制AI续作说明为等大白底细边按钮，约法L24保持内联链接。tag 不读取 tone；action_button 对混合 para 不提升指定链接，promote_links 当前未读取。",
     "evidence": "openclaw/page.json:openclaw-01.scene；components/comp-text/primitives.py:render_tag；components/comp-text/buttons.py:render_action_button"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[content_card:为什么不用了].icons",
      "blocks[stat_card:1 127,675].icons",
      "blocks[action_button:〔GitHub〕]"
     ],
     "requirement": "icon 需要 8 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:OpenClaw 网关].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
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
   "asset": "_library/icons/scene-r3-frosted-sleeping-red-lobster.png",
   "fallback": false,
   "semantic_status": "precise_scene_combination_pending_visual_review",
   "key": "scene-r3-frosted-sleeping-red-lobster",
   "source_phrase": "一只趴着打盹、身上落了薄霜的红色小龙虾",
   "sha256": "6ee8e5405fcbcb1856f1438ae3c5e006a5a8cc838659f91bc1bd1d7d02fdf992",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-computer-claude-openai.png",
   "fallback": false,
   "semantic_status": "precise_scene_combination_pending_visual_review",
   "key": "scene-r3-computer-claude-openai",
   "source_phrase": "一台电脑屏幕上并排画 Claude 和 Codex（OpenAI）的标志",
   "sha256": "c142dbd5a613e399b2b27a00c89100c7065e8becbc5d2adf8d18ec60022d512d",
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "role": "icon",
   "slot_ordinal": 7,
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
   "source_phrase": "",
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
   "asset": "_library/illustrations/main-openclaw.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-openclaw",
   "source_phrase": "右侧约 45%：一幅水彩插画：一部手机，屏幕上是 Telegram 和飞书的标志和一个聊天气泡；一条细绿虚线从手机连向一台家用台式电脑，虚线在半路断开；电脑前趴着一只红色小龙虾在睡觉，身上落了一层薄霜。",
   "sha256": "90e1c348891691d034a7f6e0abdb840afe44e108eef43f6df06258e8cfba69d2",
   "status": "ready",
   "original_elements": [
    "一部手机，屏幕上是 Telegram 和飞书的标志和一个聊天气泡；一条细绿虚线从手机连向一台家用台式电脑，虚线在半路断开；电脑前趴着一只红色小龙虾在睡觉，身上落了一层薄霜"
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
   "asset": "_library/round3/titles/title-r3-df14cb8685ae6ff155e4.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\img\\openclaw-01-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-df14cb8685ae6ff155e4",
   "title_text": "OpenClaw 网关",
   "sha256": "1798f3face926a104c83458eda98df0acb3e44c2695cd0427cd7a49ed73b9578",
   "status": "ready",
   "source_box": [
    25,
    131,
    701,
    334
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# OpenClaw 网关

已冻结

原来想在手机的 Telegram 或飞书里给家里电脑上的 AI 派活，AI 在电脑上干完，把结果发回同一个对话。OpenClaw（小龙虾）就是那个 AI 代理；这个项目管的是它的“网关”——电脑上一直开着、收消息再转给 AI 的后台程序——让它不掉线、能升级、坏了能恢复。OpenClaw 自己的备份（私有仓库 openclaw-backup）也在这一页。

**为什么不用了**
OpenClaw 这个 AI 代理本身不好用，不是网关的问题：会话越聊越大、每轮都先背一大段说明、官方升级可能把设置改回去、自己时不时卡住没响应。9 月 12 日冻结。〔哪里不好用，逐条看〕

**现在用什么**
派活直接找这台电脑上的 Claude 和 Codex 桌面版；人在外面，就用手机连回电脑的桌面操作：〔远程电脑串流〕。

**停到什么程度**
9 月 26 日关掉网关、撤掉公网入口；它的 5 个计划任务全部停用（没删，能一键恢复），换电脑不重建。旧备份原样留着。

数字卡片（竖线前大字，竖线后小字）：
1. 127,675｜6 月 21 日一次飞书请求送进模型的 token，大头是越积越长的聊天历史
2. 15–18K｜token：每轮先塞给模型的固定说明，还没算聊天内容
3. 44 → 10｜每轮都给模型看的技能，6 月 21 日砍到 10 个
4. 65 次｜提交，6 月 19 日到 9 月 28 日

〔GitHub〕　冻结的项目，AI 不主动看、不维护：〔约法 L24〕　〔复制 AI 续作说明〕

::screen{#openclaw-02 section="why-frozen"}

```typeset
{
 "screen": {
  "id": "openclaw-02",
  "section": "why-frozen",
  "title": "哪里不好用",
  "scene": "横版 16:9。左上标题，标题下一行导语。中间 2 列 × 2 行四张圆角卡片，每张：左上一个小水彩图标，粗体标题一行，正文三四行，最下一行浅灰小字写记录日期。四个图标依次：1 一卷越拉越长、拖到地上的纸条；2 一个背着沉重大书包的小龙虾；3 一把扳手把一个齿轮拧反了方向；4 一台小电脑旁边一个转圈的循环箭头。卡片下面一块浅灰底的小字区（“不算在它头上的”那段），再下面一行小字（“说句公道话”那句）。最下面一张横向对照表，表头浅绿底，两列三行，标题“现在这些事谁来做”。",
  "portrait": "竖版 9:16：标题、导语在上；四张卡片改成一列，每张一整行（图标在左、字在右）；“不算在它头上的”一段；“说句公道话”一行；对照表改成三张小卡，每张上面一行“当初让它做的”、下面一行“现在”。字完全一样。",
  "links": [
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   },
   {
    "text": "微信聊天读取",
    "href": "/projects/wechatdirect/"
   },
   {
    "text": "AI 备份",
    "href": "/projects/codex-memory/"
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
     "size": "medium",
     "text_ref": "哪里不好用"
    },
    {
     "type": "prose",
     "text_ref": "本人的原话是"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "issues-0",
     "width": "50%",
     "text_ref": "1越聊越满"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "issues-0",
     "width": "50%",
     "text_ref": "2每轮都先背一大段说明"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "issues-1",
     "width": "50%",
     "text_ref": "3官方升级可能改坏设置"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "issues-1",
     "width": "50%",
     "text_ref": "4自己时不时卡住"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不算在它头上的"
    },
    {
     "type": "prose",
     "text_ref": "说句公道话"
    },
    {
     "type": "table",
     "columns": 2,
     "text_ref": "现在这些事谁来做"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。四条问题各为完整外卡；横版两列两排，竖版一列，卡内包含原编号/标题、正文、记录日期。拆成四个真实 text_ref 以保持正文和日期跟随对应卡。下方灰区、公道话、两列表格（竖版三行卡）按原序；各图标须按四条原义显式映射。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:1越聊越满].icon_position",
      "blocks[points_card:2每轮都先背一大段说明].icon_position",
      "blocks[points_card:3官方升级可能改坏设置].icon_position",
      "blocks[points_card:4自己时不时卡住].icon_position"
     ],
     "requirement": "四完整问题卡按2×2/竖单列排，每张含编号标题、正文和记录日期；points_card 的 header_left 只识首个 card/group/heading，真实首节点为 steps，故图标当前不放。记录日期要浅灰小字；竖版图标在左、字在右。",
     "evidence": "openclaw/page.json:openclaw-02.scene/text；components/comp-text/cards.py:_points_headed"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:不算在它头上的].tone"
     ],
     "requirement": "此段按原文为浅灰说明区；notice gray 当前沿批准的浅绿底，灰底须组件样张确认，不能据字段称已呈现浅灰。",
     "evidence": "components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:1越聊越满].icons",
      "blocks[points_card:2每轮都先背一大段说明].icons",
      "blocks[points_card:3官方升级可能改坏设置].icons",
      "blocks[points_card:4自己时不时卡住].icons"
     ],
     "requirement": "icon 需要 4 个，当前有效总 manifest 有 3 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-02.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:哪里不好用].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "哪里不好用"
    },
    {
     "type": "prose",
     "text_ref": "本人的原话是"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1越聊越满"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "2每轮都先背一大段说明"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "3官方升级可能改坏设置"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "4自己时不时卡住"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不算在它头上的"
    },
    {
     "type": "prose",
     "text_ref": "说句公道话"
    },
    {
     "type": "table",
     "columns": 1,
     "text_ref": "现在这些事谁来做"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。四条问题各为完整外卡；横版两列两排，竖版一列，卡内包含原编号/标题、正文、记录日期。拆成四个真实 text_ref 以保持正文和日期跟随对应卡。下方灰区、公道话、两列表格（竖版三行卡）按原序；各图标须按四条原义显式映射。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:1越聊越满].icon_position",
      "blocks[points_card:2每轮都先背一大段说明].icon_position",
      "blocks[points_card:3官方升级可能改坏设置].icon_position",
      "blocks[points_card:4自己时不时卡住].icon_position"
     ],
     "requirement": "四完整问题卡按2×2/竖单列排，每张含编号标题、正文和记录日期；points_card 的 header_left 只识首个 card/group/heading，真实首节点为 steps，故图标当前不放。记录日期要浅灰小字；竖版图标在左、字在右。",
     "evidence": "openclaw/page.json:openclaw-02.scene/text；components/comp-text/cards.py:_points_headed"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:不算在它头上的].tone"
     ],
     "requirement": "此段按原文为浅灰说明区；notice gray 当前沿批准的浅绿底，灰底须组件样张确认，不能据字段称已呈现浅灰。",
     "evidence": "components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:1越聊越满].icons",
      "blocks[points_card:2每轮都先背一大段说明].icons",
      "blocks[points_card:3官方升级可能改坏设置].icons",
      "blocks[points_card:4自己时不时卡住].icons"
     ],
     "requirement": "icon 需要 4 个，当前有效总 manifest 有 3 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-02.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:哪里不好用].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
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
   "source_phrase": "越聊越满",
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
   "source_phrase": "每轮都先背一大段说明",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "官方升级可能改坏设置",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "自己时不时卡住",
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
   "asset": "_library/fix-round-2/openclaw-02-brush-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\img\\openclaw-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-57c743bc4133270e9e71",
   "title_text": "哪里不好用",
   "sha256": "80092ace3d14d77abd7ac4461bdb4f673b448bf3738dda1f1cfea1f47faf2c0d",
   "status": "ready",
   "source_box": [
    53,
    10,
    442,
    97
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 哪里不好用

本人的原话是“OpenClaw 这个 AI 代理本身不好用”，没有逐条说。下面四条出自 6 月 19 日到 9 月 10 日 AI 维护它时留下的记录，只挑出在 OpenClaw 自己身上的。

1. **越聊越满**
聊天历史一直累积，一次飞书请求就用了 127,675 token；上下文塞满后还会卡进死循环。只能调低压缩线（聊到多长就自动把旧内容压短）、换一件事就开新会话来压。
记录：6 月 19 日、21 日

2. **每轮都先背一大段说明**
每轮对话开头，它先把 15–18K token 的固定说明塞给模型；装着的技能越多，说明越长——82 个技能里 44 个每轮都要给模型看（其中一部分是维护时 AI 自己开的）。AI 手动砍到 10 个才压下来。
记录：6 月 21 日

3. **官方升级可能改坏设置**
官方升级会顺带跑“体检修复”：它会把“只许我发消息”改回“谁都能发”，还可能把接口设置改回去，让技能调用全部失败。只好不用官方升级，自己写升级脚本，升完再逐项改回。
记录：6 月 20 日、21 日

4. **自己时不时卡住**
6 月 19 日第一次体检，它在反复崩溃重启：启动时联网查更新超时、会话塞爆后卡死，关掉这些才稳住。9 月 9 日它的服务还有两次 10 秒没响应，原因没查出来；飞书渠道一直停在“启动中”。
记录：6 月 19 日、9 月 7–10 日

不算在它头上的：开机自启失效是计划任务被关了；技能一调就报错，是所用模型接口不认它的格式；报 403 是模型服务的免费额度用完；CodeG（一个 AI 编程客户端）直接连它连不上，是 CodeG 那边的毛病；默认模型换过几次，多是本人要换或额度不够。

说句公道话：6 月 20 日重开渠道后，手机上是聊得通的；毛病在于每一样都要 AI 反复去修、去防。

**现在这些事谁来做**

| 当初让它做的 | 现在 |
|---|---|
| 在手机上派活，电脑上干 | 电脑上的 Claude、Codex 桌面版；人在外面用〔远程电脑串流〕连回去 |
| 在聊天里查微信 | 〔微信聊天读取〕 |
| 顺带管的 Claude、Gemini、Codex 备份 | 现在归〔AI 备份〕：只留 Codex 的对话备份，Claude 和 Gemini 那两套 9 月 28 日退役 |

::screen{#openclaw-03 section="usage"}

```typeset
{
 "screen": {
  "id": "openclaw-03",
  "section": "usage",
  "title": "当初想怎么用",
  "scene": "横版 16:9。左上标题。上半部一条从左到右的水彩流程图，五个节点用粗绿色箭头连起来：①一部手机（屏幕上 Telegram 和飞书的标志）→ ②一台家用台式电脑，屏幕上一只小龙虾 → ③一块显卡和一朵云并排（本机模型和远程模型）→ ④一排小工具图标（代码括号、微信气泡、信封、日历）→ ⑤回到手机，屏幕上一个回复气泡。每个节点下面：粗体节点名一行，小字一两行。下半部三张卡：左边两张上下叠放（“在手机上派活”“想让它当‘有记忆的伙伴’”）；右边一张较大的“运维交给 AI”卡，里面先画一个聊天气泡装着那句问话，下面四行带小勾选框的清单（清单的字照下面写）。最下面一条浅绿色圆角横条，放“一个绿灯只说明一层”那句，“≠”画成绿色。",
  "portrait": "竖版 9:16：标题；流程图改成从上到下五个节点，箭头朝下，节点名和小字在图标右边；三张卡改成上下三张，每张一整行；最下面横条。字完全一样。",
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
     "text_ref": "当初想怎么用"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
      "_library/icons/笔记本电脑.png",
      "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/双气泡.png"
     ],
     "text_ref": "1手机"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row": "uses",
     "width": "45%",
     "text_ref": "在手机上派活"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row": "uses",
     "text_ref": "想让它当"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row": "uses",
     "width": "55%",
     "text_ref": "运维交给 AI，我不开终端"
    },
    {
     "type": "notice",
     "text_ref": "一个绿灯只说明一层"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。五节点箭头流程在上；横版下半部左两卡上下叠、右运维大卡，竖版三卡按定稿一行一张。运维卡内问话气泡和四勾选项需保持。底部浅绿横条保留原文≠。",
   "pending_requirements": [
    {
     "owner": "主工程师 / comp-diagram",
     "type": "unsupported_layout",
     "fields": [
      "blocks[flow:1手机].type",
      "blocks[flow:1手机].columns",
      "blocks[flow:1手机].connector"
     ],
     "requirement": "五个编号标题与后续正文必须合成五个节点再连接；当前 parse 生成五组单项 steps 和独立 para，flow._sections 将其拆成五条单项链，无法得到五节点连箭头。横版五节点一排、竖版从上到下，图标右边放节点名及说明。",
     "evidence": "openclaw/page.json:openclaw-03.text；engine/parse.py:parse；components/comp-diagram/sequence.py:_sections"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:运维交给 AI，我不开终端].whole_block"
     ],
     "requirement": "运维卡须在单一外卡内把“我只说一句”原段画为气泡，其后四原文项目为小勾选框；whole_block 已支持外卡，但尚无混合气泡/勾选框字段，当前仍普通段落和圆点清单。",
     "evidence": "openclaw/page.json:openclaw-03.scene；components/comp-text/cards.py:_points_headed"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[flow:1手机].icons"
     ],
     "requirement": "icon 需要 5 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 openclaw-03.scene 明确五个图标节点；库存 assets 错计为 0，需补素材登记"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:当初想怎么用].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "当初想怎么用"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
      "_library/icons/笔记本电脑.png",
      "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/双气泡.png"
     ],
     "text_ref": "1手机"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "在手机上派活"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "想让它当"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "运维交给 AI，我不开终端"
    },
    {
     "type": "notice",
     "text_ref": "一个绿灯只说明一层"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。五节点箭头流程在上；横版下半部左两卡上下叠、右运维大卡，竖版三卡按定稿一行一张。运维卡内问话气泡和四勾选项需保持。底部浅绿横条保留原文≠。",
   "pending_requirements": [
    {
     "owner": "主工程师 / comp-diagram",
     "type": "unsupported_layout",
     "fields": [
      "blocks[flow:1手机].type",
      "blocks[flow:1手机].columns",
      "blocks[flow:1手机].connector"
     ],
     "requirement": "五个编号标题与后续正文必须合成五个节点再连接；当前 parse 生成五组单项 steps 和独立 para，flow._sections 将其拆成五条单项链，无法得到五节点连箭头。横版五节点一排、竖版从上到下，图标右边放节点名及说明。",
     "evidence": "openclaw/page.json:openclaw-03.text；engine/parse.py:parse；components/comp-diagram/sequence.py:_sections"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:运维交给 AI，我不开终端].whole_block"
     ],
     "requirement": "运维卡须在单一外卡内把“我只说一句”原段画为气泡，其后四原文项目为小勾选框；whole_block 已支持外卡，但尚无混合气泡/勾选框字段，当前仍普通段落和圆点清单。",
     "evidence": "openclaw/page.json:openclaw-03.scene；components/comp-text/cards.py:_points_headed"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[flow:1手机].icons"
     ],
     "requirement": "icon 需要 5 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 openclaw-03.scene 明确五个图标节点；库存 assets 错计为 0，需补素材登记"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:当初想怎么用].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机",
   "source_phrase": "手机\n在Telegram或飞书里发一句任务",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "笔记本电脑",
   "source_phrase": "电脑上的网关\n一直开着，只在本机18789端口收消息，转给OpenClaw",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双屏同步",
   "source_phrase": "模型\n9月默认用本机的qwen3.8:27b；要更强的，手选远程21条路线（通义千问11、DeepSeek2、Z.AI8）",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "技能\n写代码交给更便宜的编程助手Cline、查微信、收发邮件、看Gmail和日历、多步流程……",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双气泡",
   "source_phrase": "回到原对话\n结果发回发消息的那个聊天",
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
   "asset": "_library/round3/titles/title-r3-64724d085eb3bb863200.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\img\\openclaw-03-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-64724d085eb3bb863200",
   "title_text": "当初想怎么用",
   "sha256": "8ae35ca9eee11696cb57a01d805e9056a3f740fc6877e96c0c0c3869d28d2def",
   "status": "ready",
   "source_box": [
    54,
    0,
    447,
    125
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 当初想怎么用

1. **手机**
在 Telegram 或飞书里发一句任务
2. **电脑上的网关**
一直开着，只在本机 18789 端口收消息，转给 OpenClaw
3. **模型**
9 月默认用本机的 qwen3.8:27b；要更强的，手选远程 21 条路线（通义千问 11、DeepSeek 2、Z.AI 8）
4. **技能**
写代码交给更便宜的编程助手 Cline、查微信、收发邮件、看 Gmail 和日历、多步流程……
5. **回到原对话**
结果发回发消息的那个聊天

**在手机上派活**
人不在电脑前，也能让家里的电脑干活：查东西、写代码、整理消息，干完回到同一个对话里。

**想让它当“有记忆的伙伴”**
6 月 21 日给它定的身份：有记忆、会主动、能操作电脑。每个会话记得前面说过的话，夜里“做梦”把当天的事整理进长期记忆。

**运维交给 AI，我不开终端**
我只说一句：“OpenClaw 现在为什么没回消息？先检查，不要发测试消息或重启。”AI 分层去查，缺哪段证据就说缺哪段：
- 网关有没有真的响应
- Telegram、飞书连没连上
- 用的是哪个模型、会不会花钱
- 后台任务上次跑得怎么样

**一个绿灯只说明一层**：端口开着 ≠ 网关健康；渠道“已连接” ≠ 消息送到；默认本机模型 ≠ 一定不花钱。

::screen{#openclaw-04 section="features"}

```typeset
{
 "screen": {
  "id": "openclaw-04",
  "section": "features",
  "title": "全部旧功能",
  "scene": "横版 16:9，和其他项目页“全部功能”同一种画法，但整屏色调偏灰淡，表示都已停用。左上标题，标题右边图例（只有一种：灰色叉“已停用”）。三组功能从上往下排；每组的组名用毛笔字写在这一组卡片上方的一行（不单独占一整列）；卡片三列排：每张卡左边一个灰调小水彩图标，粗体功能名，下面一两行说明，右上角一个灰色叉。图标：渠道交办画聊天气泡，模型与花费画显卡和硬币，聊天里的技能画工具包，记忆和做梦画月亮和笔记本，外网入口画一扇门，网关常驻画心跳线，受控更新画带箭头的盾牌，部署与引导画一份模板纸，接进 CodeG 画两段插头，旧“API 一键开关”画一个拨动开关，官方备份和恢复演练画一个带勾的档案盒，OpenClaw 设置和工作区备份画一只小龙虾抱着箱子，顺带的三套 AI 备份画三个小箱子各走一边，公开仓库每日归档画 GitHub 标志和一个时钟。",
  "portrait": "竖版 9:16：标题和图例在上；每组组名一行，下面卡片改成一行一张（图标在左、字在右、叉在右上）；三组依次往下。字完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-chat",
    "text": "在聊天里派活"
   },
   {
    "id": "f-channel-handoff",
    "text": "渠道交办"
   },
   {
    "id": "f-model-cost",
    "text": "模型与花费"
   },
   {
    "id": "f-chat-skills",
    "text": "聊天里的技能"
   },
   {
    "id": "f-memory-dreaming",
    "text": "记忆和做梦"
   },
   {
    "id": "f-public-entry",
    "text": "外网入口"
   },
   {
    "id": "g-run",
    "text": "让它一直在线"
   },
   {
    "id": "f-gateway-runtime",
    "text": "网关常驻"
   },
   {
    "id": "f-managed-update",
    "text": "受控更新"
   },
   {
    "id": "f-bootstrap-install",
    "text": "部署与引导"
   },
   {
    "id": "f-codeg-bridge",
    "text": "接进 CodeG"
   },
   {
    "id": "f-api-switch",
    "text": "旧“API 一键开关”"
   },
   {
    "id": "g-backup",
    "text": "备份与恢复"
   },
   {
    "id": "f-backup-restore",
    "text": "官方备份和恢复演练"
   },
   {
    "id": "f-openclaw-backup",
    "text": "OpenClaw 设置和工作区备份"
   },
   {
    "id": "f-other-ai-backup",
    "text": "顺带的三套 AI 备份"
   },
   {
    "id": "f-autopush",
    "text": "公开仓库每日归档"
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
     "align": "left",
     "size": "large",
     "row": "head",
     "width": "72%",
     "text_ref": "全部旧功能（14 项，全部已停用）"
    },
    {
     "type": "status_legend",
     "row": "head",
     "width": "28%",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "在聊天里派活"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "渠道交办",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "让它一直在线"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "网关常驻",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "备份与恢复"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "官方备份和恢复演练",
     "fill_last_row": true
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与单项已停用图例相邻；三组各有一行毛笔组名，组名不单独占列。组卡数量为5、5、4，横版各组三列，竖版单列。分别以真实组名/首条作 text_ref，不加新标题或状态。三组毛笔素材和主标题须逐字一致。\n页修复10：三组组名改为small section_heading，保留本屏大标题。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "pending_requirements": [
    {
     "owner": "comp-hub",
     "type": "unsupported_layout",
     "fields": [
      "blocks[feature_card].muted"
     ],
     "requirement": "十四旧功能全部停用；卡内右上灰叉、图标灰调，毛笔标题仍保持批准浓度。feature_card 当前未消费 muted，淡灰装饰需样张确认，不能给整屏或标题加透明度。",
     "evidence": "openclaw/page.json:openclaw-04.scene；components/comp-hub/feature_status.py:render_feature_card"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[feature_card].icons"
     ],
     "requirement": "icon 需要 14 个，当前有效总 manifest 有 4 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-04.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:全部旧功能（14 项，全部已停用）].text_ref"
     ],
     "requirement": "标题“全部旧功能（14 项，全部已停用）”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:全部旧功能（14 项，全部已停用）].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:在聊天里派活].text_ref"
     ],
     "requirement": "标题“在聊天里派活”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:在聊天里派活].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:让它一直在线].text_ref"
     ],
     "requirement": "标题“让它一直在线”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:让它一直在线].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:备份与恢复].text_ref"
     ],
     "requirement": "标题“备份与恢复”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:备份与恢复].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部旧功能（14 项，全部已停用）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "在聊天里派活"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "渠道交办"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "让它一直在线"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "网关常驻"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "备份与恢复"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "muted": true,
     "text_ref": "官方备份和恢复演练"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与单项已停用图例相邻；三组各有一行毛笔组名，组名不单独占列。组卡数量为5、5、4，横版各组三列，竖版单列。分别以真实组名/首条作 text_ref，不加新标题或状态。三组毛笔素材和主标题须逐字一致。\n页修复10：三组组名改为small section_heading，保留本屏大标题。",
   "pending_requirements": [
    {
     "owner": "comp-hub",
     "type": "unsupported_layout",
     "fields": [
      "blocks[feature_card].muted"
     ],
     "requirement": "十四旧功能全部停用；卡内右上灰叉、图标灰调，毛笔标题仍保持批准浓度。feature_card 当前未消费 muted，淡灰装饰需样张确认，不能给整屏或标题加透明度。",
     "evidence": "openclaw/page.json:openclaw-04.scene；components/comp-hub/feature_status.py:render_feature_card"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[feature_card].icons"
     ],
     "requirement": "icon 需要 14 个，当前有效总 manifest 有 4 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:openclaw-04.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:全部旧功能（14 项，全部已停用）].text_ref"
     ],
     "requirement": "标题“全部旧功能（14 项，全部已停用）”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:全部旧功能（14 项，全部已停用）].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:在聊天里派活].text_ref"
     ],
     "requirement": "标题“在聊天里派活”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:在聊天里派活].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:让它一直在线].text_ref"
     ],
     "requirement": "标题“让它一直在线”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:让它一直在线].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:备份与恢复].text_ref"
     ],
     "requirement": "标题“备份与恢复”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\page.json:openclaw-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:备份与恢复].size"
     ],
     "requirement": "保留 medium 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "渠道交办：在 Telegram 或飞书发任务，结果回原对话；“收到、执行、回原对话”三段都通才算通 ✕",
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
   "asset": "_library/round3/clean-assets/png/45-钱包-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钱包",
   "source_phrase": "模型与花费：默认本机模型，远程路线可手选；只报哪些地方可能花钱，不假装有“全局零费用” ✕",
   "sha256": "cb2bc88524ac3d8fbe65a63f4fc3dc1dd41c818d31beab524c8112b9bad9ef00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "聊天里的技能：砍剩 10 个：写代码交给 Cline、查微信、邮件、Gmail 和日历、GitHub、天气、待办流程、多步流程等 ✕",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "记忆和做梦：每个会话记得前文；夜里用便宜模型把日志整理进长期记忆 ✕",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "外网入口：经 Tailscale Funnel 从外网连到电脑上的网关；9 月 26 日撤掉 ✕",
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "网关常驻：开机自启；每 15 分钟查一次，不健康才用官方命令启动或安全重启；发现两个程序在听或有对外监听就停手，不乱杀程序 ✕",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "受控更新：不自动追新；要升级时先备份、再升级、再逐项核对，核对没过就照实写“部分完成” ✕",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "部署与引导：换电脑时，公开模板只给结构，私人配置填好先预演；有没填的就停，写坏了自动退回旧配置 ✕",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "接进 CodeG：让 CodeG 里的 Cline 用 OpenClaw 的工具（读写会话、收发消息、审批），网关密码不写进配置；6 月实测列出 9 个工具 ✕",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "旧“API 一键开关”：点一次就清空密钥，零花费；8 月底退役：它只看一个旧文件，远程路线还能用时也显示“已关” ✕",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
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
   "source_phrase": "官方备份和恢复演练：用 OpenClaw 自带命令做带校验的归档（9 月 3 日一份 224,287,339 字节），只恢复到新建的空文件夹里查，不碰正在用的 ✕",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "OpenClaw 设置和工作区备份：设置（含密钥）和工作区（人格、记忆、技能）存本地、G 盘和私有仓库 openclaw-backup；6 月 21 日到 9 月 1 日共 29 个快照 ✕",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "顺带的三套 AI 备份：Claude、Gemini、Codex 的记忆和设置备份原来也挂在这里，后来各自迁出 ✕",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "公开仓库每日归档：每天 21:15 把能公开的改动推上 GitHub；查到密钥、别人的改动或远端分叉就停 ✕",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-757c11cc01bc4ee03ef9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-757c11cc01bc4ee03ef9",
   "title_text": "全部旧功能（14 项，全部已停用）",
   "sha256": "7c9b4b1ce7507cffd43f6b421082d49c39d0d0fce3989cbdf08d3780318caaf9",
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
   "asset": "_library/titles/title-74f851d7d1c80ce167e7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-74f851d7d1c80ce167e7",
   "title_text": "在聊天里派活",
   "sha256": "1b79f365abc5a6ccba3e64c2dff16209947b682163c1692f4d87c203b330daaf",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-6beda481d19d4185977f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6beda481d19d4185977f",
   "title_text": "备份与恢复",
   "sha256": "f89aea79b6343a29854a73f07dabdc3e3962971b055d4a6ef7538d0e6844a432",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-7d88bbbe1a5c2b775bf8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7d88bbbe1a5c2b775bf8",
   "title_text": "让它一直在线",
   "sha256": "35c3d1b3082c2ee1d934b707b00ed60d6e8b6f048589c3f0e262418c2233cad9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部旧功能（14 项，全部已停用）

图例：✕ 已停用

**在聊天里派活**
- **渠道交办**：在 Telegram 或飞书发任务，结果回原对话；“收到、执行、回原对话”三段都通才算通 ✕
- **模型与花费**：默认本机模型，远程路线可手选；只报哪些地方可能花钱，不假装有“全局零费用” ✕
- **聊天里的技能**：砍剩 10 个：写代码交给 Cline、查微信、邮件、Gmail 和日历、GitHub、天气、待办流程、多步流程等 ✕
- **记忆和做梦**：每个会话记得前文；夜里用便宜模型把日志整理进长期记忆 ✕
- **外网入口**：经 Tailscale Funnel 从外网连到电脑上的网关；9 月 26 日撤掉 ✕

**让它一直在线**
- **网关常驻**：开机自启；每 15 分钟查一次，不健康才用官方命令启动或安全重启；发现两个程序在听或有对外监听就停手，不乱杀程序 ✕
- **受控更新**：不自动追新；要升级时先备份、再升级、再逐项核对，核对没过就照实写“部分完成” ✕
- **部署与引导**：换电脑时，公开模板只给结构，私人配置填好先预演；有没填的就停，写坏了自动退回旧配置 ✕
- **接进 CodeG**：让 CodeG 里的 Cline 用 OpenClaw 的工具（读写会话、收发消息、审批），网关密码不写进配置；6 月实测列出 9 个工具 ✕
- **旧“API 一键开关”**：点一次就清空密钥，零花费；8 月底退役：它只看一个旧文件，远程路线还能用时也显示“已关” ✕

**备份与恢复**
- **官方备份和恢复演练**：用 OpenClaw 自带命令做带校验的归档（9 月 3 日一份 224,287,339 字节），只恢复到新建的空文件夹里查，不碰正在用的 ✕
- **OpenClaw 设置和工作区备份**：设置（含密钥）和工作区（人格、记忆、技能）存本地、G 盘和私有仓库 openclaw-backup；6 月 21 日到 9 月 1 日共 29 个快照 ✕
- **顺带的三套 AI 备份**：Claude、Gemini、Codex 的记忆和设置备份原来也挂在这里，后来各自迁出 ✕
- **公开仓库每日归档**：每天 21:15 把能公开的改动推上 GitHub；查到密钥、别人的改动或远端分叉就停 ✕

::screen{#openclaw-05 section="history"}

```typeset
{
 "screen": {
  "id": "openclaw-05",
  "section": "history",
  "title": "演进",
  "scene": "横版 16:9。左上标题。中间一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，11 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤。越往右丝带颜色越淡、越偏灰。最右端丝带的尽头画那只趴着打盹、身上落了薄霜的红色小龙虾。",
  "portrait": "竖版 9:16：标题；时间轴改成从上到下一条竖丝带，11 个小旗依次往下，日期在左、小字在右；最下面是打盹的小龙虾。字完全一样。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
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
     "size": "medium",
     "text_ref": "演进（6 月 19 日—9 月 28 日，65 次提交）",
     "row": "balanced-heading",
     "width": "88%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "timeline",
     "columns": 4,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "outside",
     "icons": "none",
     "item_rows": [
      4,
      4,
      3
     ],
     "text_ref": "6 月 19 日"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。11个日期节点原序保留，横版用6+5两排旗头和蜿蜒丝带，末端睡着的小龙虾在右；竖版一条向下丝带，日期左说明右，最下方小龙虾。末端的灰淡仅用于丝带/装饰，不降低毛笔标题浓度。\n页修复10：h时间线每排四项，三排4/4/3，原字和日期顺序保留。",
   "pending_requirements": [
    {
     "owner": "comp-diagram",
     "type": "unsupported_layout",
     "fields": [
      "blocks[timeline:6 月 19 日].item_rows",
      "blocks[timeline:6 月 19 日].connector",
      "blocks[timeline:6 月 19 日].illustration"
     ],
     "requirement": "横版11日期旗需要两排蜿蜒连续丝带，上下错开，第二排接回第一排，末端渐淡/偏灰；当前 item_rows 支持两排数量，但无蛇形跨排连线或渐淡，timeline 默认每排同向独立。竖版日期在左、说明在右的竖丝带亦需按源构图核对。",
     "evidence": "openclaw/page.json:openclaw-05.scene/portrait；components/comp-diagram/sequence.py 与 sequence.css"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 openclaw-05.scene/portrait 明确末端打盹带霜小龙虾；库存 assets 漏计为 0"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:演进（6 月 19 日—9 月 28 日，65 次提交）].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "演进（6 月 19 日—9 月 28 日，65 次提交）"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "outside",
     "icons": "none",
     "text_ref": "6 月 19 日"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。11个日期节点原序保留，横版用6+5两排旗头和蜿蜒丝带，末端睡着的小龙虾在右；竖版一条向下丝带，日期左说明右，最下方小龙虾。末端的灰淡仅用于丝带/装饰，不降低毛笔标题浓度。",
   "pending_requirements": [
    {
     "owner": "comp-diagram",
     "type": "unsupported_layout",
     "fields": [
      "blocks[timeline:6 月 19 日].item_rows",
      "blocks[timeline:6 月 19 日].connector",
      "blocks[timeline:6 月 19 日].illustration"
     ],
     "requirement": "横版11日期旗需要两排蜿蜒连续丝带，上下错开，第二排接回第一排，末端渐淡/偏灰；当前 item_rows 支持两排数量，但无蛇形跨排连线或渐淡，timeline 默认每排同向独立。竖版日期在左、说明在右的竖丝带亦需按源构图核对。",
     "evidence": "openclaw/page.json:openclaw-05.scene/portrait；components/comp-diagram/sequence.py 与 sequence.css"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 openclaw-05.scene/portrait 明确末端打盹带霜小龙虾；库存 assets 漏计为 0"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:演进（6 月 19 日—9 月 28 日，65 次提交）].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "aspect": "9:16"
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
   "asset": "_library/illustrations/main-openclaw.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-openclaw",
   "source_phrase": "横版 16:9。左上标题。中间一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，11 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤。越往右丝带颜色越淡、越偏灰。最右端丝带的尽头画那只趴着打盹、身上落了薄霜的红色小龙虾。",
   "sha256": "90e1c348891691d034a7f6e0abdb840afe44e108eef43f6df06258e8cfba69d2",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "openclaw/openclaw-05-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\openclaw\\img\\openclaw-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-946e1c8e0a4412765a56",
   "title_text": "演进（6 月 19 日—9 月 28 日，65 次提交）",
   "sha256": "82c3ce8ea4b67ec3860dd958f489eba0333f2272fb1c84a54295856d180dffe9",
   "status": "ready",
   "source_box": [
    42,
    89,
    902,
    203
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 演进（6 月 19 日—9 月 28 日，65 次提交）

- **6 月 19 日**：第一版，接上 OpenClaw 2026.6.6 和 Telegram、飞书。当天体检发现它在崩溃循环、开机自启失效，先关掉渠道和后台任务稳住
- **6 月 20–21 日**：调模型、省 token：技能 44 个砍到 10 个，压缩线调到 80K token；建私有备份 openclaw-backup；定下不用官方升级；CodeG 直连判了死路
- **6 月 29 日**：升到 2026.6.10
- **7 月**：顺带接下 Claude、Gemini、Codex 的记忆备份；7 月 27 日加上 G 盘热备
- **8 月 16 日**：OpenClaw 用的凭据改由〔密码中心〕发放
- **8 月 31 日**：适配 OpenClaw 2.0；模型、会话、认证交回官方命令，退役“API 一键开关”
- **9 月 3–4 日**：重建运维：默认已改用本机模型；每份备份各报各的结果；Codex 备份交回它自己的项目
- **9 月 9–10 日**：最后一次看状态：它的服务健康，但有两次 10 秒没响应；飞书停在“启动中”；这轮没发测试消息，往返没验收
- **9 月 12 日**：本人决定冻结
- **9 月 25–26 日**：Claude 备份迁出；关网关、撤公网入口，5 个计划任务停用
- **9 月 28 日**：最后一次提交，移走已迁出的 Gemini 备份脚本
