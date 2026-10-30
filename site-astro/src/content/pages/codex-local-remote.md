---
{
 "title": "Codex 远程",
 "kind": "frozen",
 "url": "/projects/codex-remote/",
 "tagline": "用手机浏览器接着管电脑上正在跑的 Codex 任务",
 "old_urls": [
  "/projects/codex-local-remote/"
 ],
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "why-frozen",
   "label": "为什么不用了",
   "img": "/_shared/nav-unify-standard/nav-unify-label-11-ad9615fb96.webp"
  },
  {
   "id": "usage",
   "label": "怎么用",
   "img": "/_shared/nav-unify-standard/nav-unify-label-43-9fe7ee9705.webp"
  },
  {
   "id": "features",
   "label": "全部功能",
   "img": "/_shared/nav-unify-standard/nav-unify-label-25-6c8f61c250.webp"
  },
  {
   "id": "history",
   "label": "演进",
   "img": "/_shared/nav-unify-standard/nav-unify-label-55-f8367a4ec7.webp"
  },
  {
   "id": "gallery",
   "label": "画廊"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "codex-local-remote",
  "kind": "frozen",
  "title": "Codex 远程",
  "url": "/projects/codex-remote/",
  "old_urls": [
   "/projects/codex-local-remote/"
  ],
  "tagline": "用手机浏览器接着管电脑上正在跑的 Codex 任务",
  "status": "冻结",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/codex-local-remote",
  "capability": "用手机接着管电脑上的 Codex 任务（已停用）",
  "based_on": {
   "commit": "94f1cfadfbba97d3cfd2b21c73fba0104ccf2cf6",
   "commit_time": "2026-08-07T11:50:44+08:00",
   "files": [
    "codex-local-remote README.md、docs/failure-postmortem-2026-08-03.md、docs/product-design.md、docs/feature-matrix.md、docs/release-notes-v0.1.6.md（94f1cfa）；标签 v0.1.0–v0.1.5",
    "E:\\.agents\\docs\\owner-decisions.md（WR 节第 1597、1607 行；冻结原因节第 1623 行；第四轮 F3 第 126 行；CP3 第 387 行）",
    "E:\\.agents 提交 c96dbf1、3d192d5、2ed452e、ad55b74、68a89c6；E187 agents.context-sources.md 第 28 行",
    "E:\\PCConfig\\registries\\tasks.json、task_purpose_catalog.json；提交 bb0404b5",
    "旧网站 V:\\Personal\\Projects\\wly0829.cn\\app\\content-codex-remote.js 与 public\\media\\codex-remote\\",
    "E:\\Projects\\Tools\\sunshine-remote-streaming README.md 与首个提交 35f6a9c"
   ]
  },
  "video_prompt": "5–8 秒无缝循环，白底、纯绿主色的水彩插画风，画面里不出现任何文字。从开头这屏右侧的插画出发：一部竖握的手机，屏幕上绿白配色的任务列表轻轻滚动；一条细细的绿色虚线从手机向家里的台式电脑延伸，电脑屏幕上是 Codex 的标志；虚线走到一半慢慢变淡、断开，手机屏幕也随之变灰。接着同一台电脑的整个桌面化作一束柔和的绿光，投到另一部横握的手机上，那部手机亮起完整的桌面画面；几片绿叶从上方缓缓飘落。最后回到起始画面接上循环。",
  "registry": {
   "groups": [
    {
     "id": "g-task",
     "name": "在手机上看同一个任务"
    },
    {
     "id": "g-control",
     "name": "插话、审批和下一轮"
    },
    {
     "id": "g-files",
     "name": "电脑文件"
    },
    {
     "id": "g-access",
     "name": "从外面连回来"
    },
    {
     "id": "g-ops",
     "name": "开关、安装和更新"
    }
   ],
   "features": [
    {
     "id": "f-same-task",
     "group": "g-task",
     "name": "接着同一个任务",
     "what": "手机和电脑共用同一个任务和同一轮，不复制聊天另开一份",
     "how": "Broker 独占一个 app-server，Desktop 和网页服务都连它；手机首轮要等 Desktop 完成订阅才放行",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 中文介绍；docs/feature-matrix.md 第 9–12 行；旧网站 content-codex-remote.js:409"
    },
    {
     "id": "f-task-list",
     "group": "g-task",
     "name": "任务列表",
     "what": "看运行中、置顶、最近、归档的任务，顺序照桌面版",
     "how": "首页合并两端全部运行任务；置顶只读镜像；行菜单改名、复制 ID、归档、恢复，提交后回读",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README“可以做什么”第 2–3 条；feature-matrix 第 16–18 行"
    },
    {
     "id": "f-new-task",
     "group": "g-task",
     "name": "手机开新任务",
     "what": "在登记项目里或隔离的无项目目录里开新任务",
     "how": "选项目或选无项目；工作目录只能是本机登记并核过身份的项目根或安装时配的临时根",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 1 条；feature-matrix“新建任务 cwd”行；docs/product-design.md 第 10–13 行"
    },
    {
     "id": "f-worklog",
     "group": "g-task",
     "name": "实时工作记录",
     "what": "实时看回复、公开进展、命令和输出、文件改动、图片；长对话渐进显示；标签页给简短状态提示",
     "how": "运行中最新一段默认展开，做完折成摘要可展开；内部 reasoning 不进界面；长对话按最近内容渐进渲染、可逐段展开全部历史；标签页在断线、等待处理、运行、失败时提示，不用装 PWA 或开系统通知",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 4–5 条、第 164–169 行；feature-matrix 第 19–21、29 行"
    },
    {
     "id": "f-subagents",
     "group": "g-task",
     "name": "进出子任务",
     "what": "看子智能体的层级和状态，进子任务只读看记录再回父任务",
     "how": "父任务里点开缩进列表；补充要求回父任务转交；历史不全时明确提示",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README“查看运行中或已完成的子智能体”；旧网站 :488 subagent-navigation"
    },
    {
     "id": "f-language",
     "group": "g-task",
     "name": "中英切换",
     "what": "界面默认简体中文，可切英文",
     "how": "右上 EN / 中 按钮；任务内容和运行时给的值照原样",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README“defaults to Simplified Chinese and includes an EN / 中 switch”"
    },
    {
     "id": "f-steer",
     "group": "g-control",
     "name": "给正在跑的回复补一句",
     "what": "在当前轮还在跑时追加要求（steer）",
     "how": "输入条选“发送到当前回复”；连接和轮次身份要对得上",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 6 条；feature-matrix 第 22 行；旧网站 :575"
    },
    {
     "id": "f-stop",
     "group": "g-control",
     "name": "叫停",
     "what": "停止当前回复",
     "how": "按停止；连接和轮次身份要对得上，断线时不执行",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "feature-matrix 第 23 行"
    },
    {
     "id": "f-queue",
     "group": "g-control",
     "name": "下一轮排队",
     "what": "先写好下一轮的要求，能编辑、排序、删除、手动发送",
     "how": "网页服务用当前 Windows 用户的 DPAPI 加密存盘；修订号冲突或结果不明就停住",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "feature-matrix 第 24–25 行；README 安全原则“尚未派发的下一轮正文”"
    },
    {
     "id": "f-approval",
     "group": "g-control",
     "name": "手机审批和回答提问",
     "what": "在手机上处理命令审批和结构化提问",
     "how": "只显示 app-server 为这次请求给出的选项；缺选项就只显示阻塞原因",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 4 条、“明确不能做什么”；feature-matrix 第 31–32 行；截图 04-mobile-approval-zh.jpg"
    },
    {
     "id": "f-next-turn",
     "group": "g-control",
     "name": "下一轮的模型和模式",
     "what": "选下一轮的模型、思考等级、速度、权限、审批路由、计划模式，设任务目标",
     "how": "选项从运行时目录读，不写死；不在当前轮热切换",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 7 条；feature-matrix 第 26–30 行"
    },
    {
     "id": "f-usage-context",
     "group": "g-control",
     "name": "额度和上下文",
     "what": "看上下文占比、账号额度窗口和重置时间、上下文压缩状态",
     "how": "对话右上绿色圆环，点开看 token 和 UTC+8 重置时间；空闲时可手动压缩，按真实事件分“已受理”“已完成”",
     "status": "已停用",
     "screen": "codex-local-remote-04",
     "source": "README 第 9–11 条；feature-matrix 第 33–36 行"
    },
    {
     "id": "f-file-manager",
     "group": "g-files",
     "name": "电脑文件页",
     "what": "按当前 Windows 用户的权限管理全部已检测磁盘上的文件",
     "how": "独立“电脑文件”页：浏览、搜索，有界预览文本、Markdown、图片、PDF；上传、新建、编辑、改名、复制、移动、下载、删除；删除进回收站，覆盖和永久删除要明确确认",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README 第 12 条；feature-matrix 第 39–40 行；docs/product-design.md 第 15–20 行；截图 15-real-project-files.jpg（早期只读项目文件页）"
    },
    {
     "id": "f-public-entry",
     "group": "g-access",
     "name": "外网入口",
     "what": "在外面用手机浏览器经公网地址连回电脑",
     "how": "Tailscale Funnel 路径 /codex-remote 转到本机 18790 的网页服务；9 月 26 日按本人决定 F3 撤掉",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README 架构节；owner-decisions.md 第 126 行；PCConfig 提交 bb0404b5"
    },
    {
     "id": "f-login-guard",
     "group": "g-access",
     "name": "登录和请求保护",
     "what": "挡住猜密码、借用登录、跨站写入和公网裸文件链接",
     "how": "单密码加盐强哈希；Secure/HttpOnly/SameSite=Strict Cookie；失败限速锁定；写请求要同源和 CSRF；本地路径换成短时不透明引用",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README“安全原则”；旧网站术语表 :337–338"
    },
    {
     "id": "f-reconnect",
     "group": "g-access",
     "name": "断线不丢、不重发",
     "what": "断线或刷新后恢复事件流、草稿、滚动位置和子任务导航",
     "how": "SSE 按事件编号续接，短抖动 3 秒宽限；实时动作断线时失败关闭，不静默重放",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README 第 13 条；旧网站 :351"
    },
    {
     "id": "f-open-close",
     "group": "g-ops",
     "name": "打开和关闭远程",
     "what": "平时 Codex 原生启动，要用时才接管，用完关掉公网入口",
     "how": "固定控制入口只有 Open、Close、Status；Open 必要时至多一次受控重开 Desktop；计划任务 Codex Local Remote 在租约内看着 Broker、app-server、网页服务，网页服务崩了自动拉起",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README 架构节后半；PCConfig task_purpose_catalog.json 第 1413–1428 行"
    },
    {
     "id": "f-control-skill",
     "group": "g-ops",
     "name": "一句话让 AI 开关",
     "what": "对 AI 说“打开远程”“关闭远程”“远程状态”就执行对应操作",
     "how": "技能 codex-local-remote-control；8 月 13 日改成冻结标记只答“不可用”；9 月 26 日不再安装，27 日删除",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "E:\\.agents 提交 c96dbf1、3d192d5、2ed452e、ad55b74"
    },
    {
     "id": "f-runtime-versions",
     "group": "g-ops",
     "name": "能退回的版本",
     "what": "每个版本单独存放，能退回上一个",
     "how": "构建装进 RuntimeVersions/<内容 SHA-256>，manifest 记逐文件哈希；runtime-current.json 原子记当前和上一个",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README 最后两段；旧网站 :30"
    },
    {
     "id": "f-hot-update",
     "group": "g-ops",
     "name": "任务不停也能换网页层",
     "what": "电脑上有任务在跑时也能更新手机网页和网页服务",
     "how": "租约内先排空已接的写入，再短切换 Web/Sidecar；新网页服务失败就恢复旧的；Broker、app-server 变化要另外交接",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "旧网站 :352；复盘 3.1 节最后一条"
    },
    {
     "id": "f-ai-install",
     "group": "g-ops",
     "name": "交给 AI 安装",
     "what": "把一段提示词贴给 Codex 桌面版，让它自己安装或升级",
     "how": "docs/ai-install-prompt.md 写明哪一步要停下来等本人输密码、选项目、批 Funnel 或重开桌面版",
     "status": "已停用",
     "screen": "codex-local-remote-05",
     "source": "README“Archived installation prompt”节；docs/ai-install-prompt.md"
    }
   ],
   "numbers": [
    {
     "id": "n-commits",
     "text": "65 次",
     "meaning": "仓库全部提交，7 月 26 日到 8 月 7 日（北京时间）",
     "as_of": "2026-09-28",
     "source": "git -C V:\\Personal\\Projects\\codex-local-remote rev-list --count HEAD",
     "screens": [
      "codex-local-remote-01",
      "codex-local-remote-06"
     ]
    },
    {
     "id": "n-releases",
     "text": "6 个",
     "meaning": "正式标签 v0.1.0–v0.1.5，7 月 28 日到 8 月 3 日",
     "as_of": "2026-09-28",
     "source": "git tag -l 与各标签提交时间",
     "screens": [
      "codex-local-remote-01",
      "codex-local-remote-06"
     ]
    },
    {
     "id": "n-tests",
     "text": "1,771 项",
     "meaning": "v0.1.5 公开 CI 通过的 Vitest 测试（114 个测试文件）",
     "as_of": "2026-08-03",
     "source": "docs/failure-postmortem-2026-08-03.md 第 46 行；旧网站第 25 行（CI run 30756063724）",
     "screens": [
      "codex-local-remote-01",
      "codex-local-remote-06"
     ]
    },
    {
     "id": "n-restarts",
     "text": "约 5 次｜100 多小时",
     "meaning": "本人封存前汇总的真机重启成功次数和累计投入，没有独立复核",
     "as_of": "2026-08-03",
     "source": "复盘第 65–66、131 行",
     "screens": [
      "codex-local-remote-01",
      "codex-local-remote-02"
     ]
    },
    {
     "id": "n-messages",
     "text": "192 条消息，80 条在说重启、切换或接管",
     "meaning": "最后那个 Codex 对话里的本人消息，自动计数，含重复短消息",
     "as_of": "2026-08-03",
     "source": "复盘第 128–129 行",
     "screens": [
      "codex-local-remote-02"
     ]
    },
    {
     "id": "n-unreleased",
     "text": "9 个接管修复",
     "meaning": "v0.1.5 之后没发布的修复，只有代码和测试证据",
     "as_of": "2026-08-03",
     "source": "复盘第 113–118 行；docs/release-notes-v0.1.6.md",
     "screens": [
      "codex-local-remote-06"
     ]
    },
    {
     "id": "n-features",
     "text": "21 项",
     "meaning": "本页列出的旧功能",
     "as_of": "2026-09-28",
     "source": "registry.features 计数",
     "screens": [
      "codex-local-remote-04"
     ]
    },
    {
     "id": "n-streaming-start",
     "text": "6 月 26 日",
     "meaning": "远程电脑串流仓库第一个提交（开始搭的日子，不证明当天就能用）",
     "as_of": "2026-06-26",
     "source": "git -C E:\\Projects\\Tools\\sunshine-remote-streaming log --reverse（35f6a9c）",
     "screens": [
      "codex-local-remote-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-streaming",
     "with": "sunshine-remote-streaming",
     "direction": "被代替",
     "flow": "在外面管电脑上的 Codex，现在用 Moonlight 把整个桌面串流到手机上操作",
     "source": "owner-decisions.md 第 1597、1607 行（本人原话“被远程桌面替代”）；CP3 第 387 行"
    },
    {
     "id": "r-agents-skill",
     "with": "agents",
     "direction": "登记",
     "flow": "控制技能 codex-local-remote-control 放在 AI 规则与技能基座里：7 月 31 日加、8 月 13 日改成只答不可用、9 月 26 日卸载、27 日删除；冻结名单也在基座（E187 context-sources 第 28 行）",
     "source": "E:\\.agents 提交 c96dbf1、3d192d5、2ed452e、ad55b74、68a89c6"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "登记",
     "flow": "电脑配置登记计划任务 \\Codex Local Remote（已停用、换机不重建）和网页服务的本机端口 18790，记下公网路径已撤",
     "source": "PCConfig tasks.json、task_purpose_catalog.json 第 1413–1428 行；提交 bb0404b5"
    },
    {
     "id": "r-tailscale",
     "with": "Tailscale Funnel",
     "direction": "外部服务",
     "flow": "公网路径 /codex-remote 转到本机 18790；9 月 26 日删掉，只剩 /computer 等路径",
     "source": "README 架构节；PCConfig bb0404b5"
    },
    {
     "id": "r-codex-desktop",
     "with": "Codex 桌面版（OpenAI）",
     "direction": "外部工具",
     "flow": "用桌面版自带的 codex.exe 起唯一的 app-server；桌面版通过隐藏的 CODEX_APP_SERVER_WS_URL 接到本机中转，和手机共用任务",
     "source": "README 架构节“Broker 只使用当前 Codex Desktop 安装中动态发现的 codex.exe”“Windows 兼容层”段"
    },
    {
     "id": "r-github",
     "with": "GitHub",
     "direction": "外部服务",
     "flow": "公开仓库、6 个 Release、GitHub Actions CI 和公开安全扫描",
     "source": "README 徽章与链接；旧网站第 25 行"
    },
    {
     "id": "r-old-site",
     "with": "旧网站 wly0829.cn",
     "direction": "展示",
     "flow": "旧页 /projects/codex-remote 放过 9 个模块和 20 张截图；本页的截图从那里取",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\content-codex-remote.js；public\\media\\codex-remote\\"
    }
   ],
   "highlights": [
    {
     "id": "h-evidence-layers",
     "title": "测试全绿不等于能用：证据分五层",
     "screen": "codex-local-remote-06"
    }
   ],
   "mentions": [
    {
     "target": "/projects/codex-local-remote/#why-frozen",
     "screen": "codex-local-remote-01",
     "text": "为什么串流能代替它"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "codex-local-remote-01",
     "text": "远程电脑串流"
    },
    {
     "target": "/rules/charter/#L24",
     "screen": "codex-local-remote-01",
     "text": "约法 L24"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "codex-local-remote-02",
     "text": "远程电脑串流"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿 9 个旧模块拆细成 21 项：同一任务→接着同一个任务、任务列表、手机开新任务；子智能体导航→进出子任务；对话控制→补一句、叫停、下一轮排队；审批与上下文→手机审批和回答提问、下一轮的模型和模式、额度和上下文；项目与文件→手机开新任务（项目部分）、电脑文件页；安全接入→外网入口、登录和请求保护；安装与回滚→打开和关闭远程、能退回的版本、任务不停也能换网页层、交给 AI 安装。另从 README 补了实时工作记录、中英切换、断线不丢不重发，从 .agents 补了一句话让 AI 开关。",
    "底稿“共享架构”不单列功能：写成第 3 屏“背后怎么连”的链路图；它说的是怎么连，本人看到的结果就是“接着同一个任务”。",
    "计划任务 Codex Local Remote（Desktop 所有者协调器）和网页服务崩溃自愈并进 f-open-close：README 把它们写在同一段显式租约里。",
    "“回答图片与已查看图片活动”“归档与恢复”“重命名与复制 ID”分别并进实时工作记录和任务列表。",
    "README 第 164–169 行的“长对话渐进显示、逐段展开”和“浏览器标签页状态提示”并进 f-worklog（实时工作记录）：都是看任务进展时的显示方式。feature-matrix 的“全磁盘搜索”“预览”并进 f-file-manager。"
   ],
   "dropped": [
    "底稿“版本与证据”不作功能：它是旧网站一段“哪些证据证明做成过”的说明。其中最有用的“证据分五层”写进第 6 屏“留下的教训”。",
    "旧网站和 README 里的实现细节不上：订阅屏障、thread/name/set、Explorer medium-integrity token、owner proof、drain receipt、dispatcher 校验 manifest、幂等键、修订号、2 MiB 置顶解析上限等——项目已冻结，读者用不上；留下的只是能说清“怎么用、为什么难”的几条。",
    "复盘第 5 节的完整技术故障链只挑三条人话写在第 2 屏（重开程序跟着被关、旧进程占端口、高权限读不到进程信息），模块解析到旧版本、intent/lease 状态过多、多个等待预算不一致等不单列。",
    "旧网站 20 张截图只放 4 张（3 张真机、1 张演示数据）；其余是同一类画面或含账号额度、会话到期等旧值（13-real-account-session），不上。",
    "当前 main 最新 CI run 31145586404 失败、0.1.6-unreleased 版本号不写：冻结项目，写“9 个修复标成未发布候选”已够。"
   ],
   "unsure": [
    "冻结原因本人原话是“被远程桌面替代”（manifest 写作“被远程桌面串流替代”，页面引号里只放原话；“指的就是远程电脑串流”写在引号外）。第 1 屏原话后另起“AI 补充”，第 2 屏导语注明“不是本人的话”；两屏都加了“这条路本身也一直没稳下来”和 8 月 3 日停用复盘的经过——这是仓库复盘文档和 AI 技能冻结说明（3d192d5：“frozen after repeated live restart and recovery failures”）里的事实，本人没把它说成冻结原因。请本人确认：这样并列写是否合适，还是只写“被串流替代”。",
    "第 2 屏“两条路差在哪”对照表和“现在这些事谁来做”是 AI 推断的现状（依据：CP3 平时主要用 Moonlight；串流 README）。“在外面管电脑文件 → 串流过去用电脑自己的文件管理器”没有本人原话。",
    "替本人口吻或替本人下判断的句子（上线前请本人过目）：第 1 屏“在外面要管电脑，把整个桌面串流到手机上操作就行……不必再为它单独维护一条接管的路”；第 6 屏“本人实际用过 v0.1.1，觉得好用”（出自复盘第 43 行“被用户实际使用并评价为可用”）。",
    "“约 5 次重启成功”“100 多小时”“192 条里 80 条”都出自复盘，是本人汇总或自动计数，没有独立复核；复盘自己也这样注明。",
    "“远程电脑串流 6 月 26 日就搭好了”按那个仓库第一个提交的日期；串流是哪天开始日常使用、是不是 8 月 3 日后才成为在外面管 Codex 的主要方式，没有记录。",
    "首屏没放〔在整套系统里的位置 → 怎么协作〕：照 OpenClaw 冻结页的处理，冻结项目和现役项目已没有来往。第 2 批怎么协作页如果给冻结项目留位置，再补。",
    "电脑文件页的截图（15-real-project-files）是 7 月 28 日早期版，当时还只读、只看登记项目；后来 README 写的是全部磁盘、可改可删。图下说明写的是“选一个登记过的项目，按文件夹浏览”，和功能卡的全盘说法不矛盾，但读者可能对不上。",
    "页名沿用 manifest 的“Codex 远程”，没用旧稿新起的“手机接管 Codex 任务”。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/codex-local-remote/page.json",
  "sha256": "132ca0f1223056a423996b29311c4f967dca2502746bb87a0f2140fe1628e042",
  "converted_at_beijing": "2026-10-31T06:46:16+08:00"
 }
}
---

::screen{#codex-local-remote-01 section="top"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-01",
  "section": "top",
  "title": "开头",
  "scene": "横版 16:9。左侧约 55% 宽：左上大标题毛笔艺术字“Codex 远程”，标题右边一枚灰绿色圆角小标签“已冻结”；标题下面是介绍段。介绍段下面三张并排的说明卡，卡顶各一个小水彩图标：第一张“为什么不用了”画一台电脑屏幕整块画面投到一部手机上（串流）；第二张“现在用什么”画一部手机，屏幕上是一个缩小的电脑桌面；第三张“停到什么程度”画一个拔下来的网线插头和一个上了封条的纸箱。每张卡第一行粗体小标题，下面两三行正文。右侧约 45%：一幅水彩插画：一部手机，屏幕上是绿白配色的任务列表网页（三行任务卡、顶上一个小绿点，不写字）；一条细绿虚线从手机连向一台家用台式电脑，电脑屏幕上是 Codex（OpenAI）的标志；虚线在半路断开、变淡；画面另一侧，同一台电脑的整个桌面被一束柔和的绿光投到另一部横握的手机上（串流）。画面下部一排四张数字卡片（上面小插画，大号绿色数字，下面一行小字），数字卡整体偏灰淡一点，表示是历史数字：提交画一串小圆点连线，版本画几个叠起来的标签，测试画一张打满勾的清单，接管成功画一个转圈的重启箭头。最下面一行：左边一个白底细浅绿描边的圆角按钮，里面是 GitHub 标志和“GitHub”字样；右边一行小字和链接。不画“现在”横条（项目已冻结，没有在跑的任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版 9:16，从上往下：大标题和“已冻结”标签；右侧那幅插画放到标题下面，占满宽度；介绍段；三张说明卡改成上下三张，每张一整行；四张数字卡改成两行两张；最下面 GitHub 按钮单独一行，下面一行小字和链接。字完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "为什么串流能代替它",
    "href": "/projects/codex-local-remote/#why-frozen"
   },
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/codex-local-remote"
   },
   {
    "text": "约法 L24",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/codex-local-remote/#ai-brief"
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
     "text_ref": "Codex远程",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "55%",
     "row_fit_illustration": true
    },
    {
     "type": "tag",
     "text_ref": "已冻结",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "原来想在手机浏览器里接着管电脑上Codex桌面版正在跑的任务：看进度、批命令、补一句要求、叫停或排好下一句。手机上看到的",
     "row": "hero"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "points_card",
     "text_ref": "为什么不用了",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "split_cards": true
    },
    {
     "type": "prose",
     "text_ref": "数字卡片（竖线前大字"
    },
    {
     "type": "feature_card",
     "text_ref": "165次提交，7月26日到8月7日26个正式版本，7月28日到8月3日，最后一个是v0.1.531,771项v0.1.5",
     "columns": 4,
     "columns_v": 2,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "variant": "stats",
     "tone": "historical",
     "portrait_columns": 2
    },
    {
     "type": "action_button",
     "text_ref": "GitHub"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。 用文字卡整组承接三张介绍卡，修复窄栏内长按钮不能换行；卡顶插画仍需组件支持。 数字内容保持为四张卡（手机两列）；真正的大数字和历史灰调变体仍未实现，已列入请求。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "Codex远程",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "已冻结"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "prose",
     "text_ref": "原来想在手机浏览器里接着管电脑上Codex桌面版正在跑的任务：看进度、批命令、补一句要求、叫停或排好下一句。手机上看到的"
    },
    {
     "type": "points_card",
     "text_ref": "为什么不用了",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "split_cards": false
    },
    {
     "type": "prose",
     "text_ref": "数字卡片（竖线前大字"
    },
    {
     "type": "feature_card",
     "text_ref": "165次提交，7月26日到8月7日26个正式版本，7月28日到8月3日，最后一个是v0.1.531,771项v0.1.5",
     "columns": 4,
     "columns_v": 2,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "variant": "stats",
     "tone": "historical",
     "portrait_columns": 2
    },
    {
     "type": "action_button",
     "text_ref": "GitHub"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。 用文字卡整组承接三张介绍卡，修复窄栏内长按钮不能换行；卡顶插画仍需组件支持。 数字内容保持为四张卡（手机两列）；真正的大数字和历史灰调变体仍未实现，已列入请求。"
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
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双屏同步",
   "source_phrase": "一台电脑屏幕整块画面投到一部手机上（串流）",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机电脑连接",
   "source_phrase": "一部手机，屏幕上是一个缩小的电脑桌面",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个拔下来的网线插头和一个上了封条的纸箱",
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
   "asset": "_library/illustrations/main-codex-local-remote.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-codex-local-remote",
   "source_phrase": "右侧约 45%：一幅水彩插画：一部手机，屏幕上是绿白配色的任务列表网页（三行任务卡、顶上一个小绿点，不写字）；一条细绿虚线从手机连向一台家用台式电脑，电脑屏幕上是 Codex（OpenAI）的标志；虚线在半路断开、变淡；画面另一侧，同一台电脑的整个桌面被一束柔和的绿光投到另一部横握的手机上（串流）。",
   "sha256": "207ca8c4f5cb3177b61374ce0da3e5131b939e2034be7fb401fa42636cd5a6c8",
   "status": "ready",
   "original_elements": [
    "一部手机，屏幕上是绿白配色的任务列表网页（三行任务卡、顶上一个小绿点，不写字）；一条细绿虚线从手机连向一台家用台式电脑，电脑屏幕上是 Codex（OpenAI）的标志；虚线在半路断开、变淡；画面另一侧，同一台电脑的整个桌面被一束柔和的绿光投到另一部横握的手机上（串流"
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
   "asset": "_library/round3/titles/title-r3-0a045d2837048fef4345.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-codex-local-remote-01-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-0a045d2837048fef4345",
   "title_text": "Codex 远程",
   "sha256": "80cd7627424b25f999fe587d71f84b2d1f359206fe273ec8a21e9433005e886f",
   "status": "ready",
   "source_box": [
    23,
    8,
    605,
    168
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# Codex 远程

已冻结

原来想在手机浏览器里接着管电脑上 Codex 桌面版正在跑的任务：看进度、批命令、补一句要求、叫停或排好下一句。手机上看到的就是电脑上那个任务，不另开一份聊天；它不传桌面画面，只传任务本身。

**为什么不用了**
它只能在手机浏览器里管 Codex 这一个程序；〔远程电脑串流〕能把整个电脑桌面搬到手机上，Codex 照样能用，别的也都能操作。〔为什么串流能代替它〕

**现在用什么**
用〔远程电脑串流〕把电脑桌面连到手机上。

**停到什么程度**
8 月 3 日停止修补，电脑上的 Codex 回到原样启动；9 月 12 日列入冻结名单；9 月 26 日撤掉公网入口，控制它的 AI 技能卸载；它的计划任务已停用。源码、测试和截图原样留在公开仓库。

数字卡片（竖线前大字，竖线后小字）：
1. 65 次｜提交，7 月 26 日到 8 月 7 日
2. 6 个｜正式版本，7 月 28 日到 8 月 3 日，最后一个是 v0.1.5
3. 1,771 项｜v0.1.5 发布时的自动测试，全部通过
4. 约 5 次｜重启成功，前后花了 100 多小时（本人 8 月 3 日的汇总）

〔GitHub〕　冻结的项目，AI 不主动看、不维护：〔约法 L24〕　〔复制 AI 续作说明〕

::screen{#codex-local-remote-02 section="why-frozen"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-02",
  "section": "why-frozen",
  "title": "为什么串流能代替它",
  "scene": "横版 16:9。左上标题，标题下一行导语。左半边上部：一张三列五行的对照表（表头浅绿底，第一列是项目名，第二列“Codex 远程”一栏整体偏灰，第三列“远程电脑串流”一栏正常绿色），表下一行小字（6 月 26 日那句）。左半边下部：一张横向对照表“现在这些事谁来做”，两列四行。右半边：一张较大的圆角卡“它自己也没稳下来”，卡顶一幅小水彩插画：一台电脑的窗口正在关上，一只拿着扳手的小手和窗口一起被拉进关门的缝里（表示负责重开的程序跟着一起被关掉），旁边一个插头拔不出来的插座（端口被占）；插画下面是正文段和三条带小圆点的列表；卡片最下面一条浅灰底横条写“8 月 3 日决定……”那句。",
  "portrait": "竖版 9:16：标题、导语在上；“两条路差在哪”对照表改成四张小卡，每张一行问题、下面左右两格分别写 Codex 远程和远程电脑串流的答案；6 月 26 日那句；“它自己也没稳下来”卡片占满宽度，插画在卡顶；8 月 3 日横条；最后“现在这些事谁来做”改成三张小卡，每张上面一行“当初让它做的”、下面一行“现在”。字完全一样。",
  "links": [
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
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
     "text_ref": "为什么串流能代替它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "本人只说了一句“被远程桌面替代”。下面的对照和经过，是AI按仓库里8月3日的停用复盘和现在的用法补的，不是本人的话。"
    },
    {
     "type": "section_heading",
     "text_ref": "两条路差在哪",
     "row": "comparison",
     "width": "50%"
    },
    {
     "type": "table",
     "text_ref": "Codex远程远程电脑串流手机上看到什么专门做的手机网页，只有Codex的任务电脑的整个桌面能管什么只管Codex桌面版",
     "mobile": "comparison",
     "row": "comparison"
    },
    {
     "type": "prose",
     "text_ref": "远程电脑串流 6 月 26 日",
     "row": "comparison"
    },
    {
     "type": "section_heading",
     "text_ref": "现在这些事谁来做",
     "row": "comparison"
    },
    {
     "type": "table",
     "text_ref": "当初让它做的",
     "mobile": "row_cards",
     "row": "comparison"
    },
    {
     "type": "content_card",
     "text_ref": "它自己也没稳下来",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ],
     "row": "comparison",
     "width": "50%"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么串流能代替它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "本人只说了一句“被远程桌面替代”。下面的对照和经过，是AI按仓库里8月3日的停用复盘和现在的用法补的，不是本人的话。"
    },
    {
     "type": "section_heading",
     "text_ref": "两条路差在哪"
    },
    {
     "type": "table",
     "text_ref": "Codex远程远程电脑串流手机上看到什么专门做的手机网页，只有Codex的任务电脑的整个桌面能管什么只管Codex桌面版",
     "mobile": "comparison"
    },
    {
     "type": "prose",
     "text_ref": "远程电脑串流 6 月 26 日"
    },
    {
     "type": "content_card",
     "text_ref": "它自己也没稳下来",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "现在这些事谁来做"
    },
    {
     "type": "table",
     "text_ref": "当初让它做的",
     "mobile": "row_cards"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。"
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
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显示器",
   "source_phrase": "它自己也没稳下来 \nCodex桌面版没有给别的程序接进同一个任务的公开入口。要让手机和电脑共用一个任务，桌面版得接到自己的中转程序上；它平时原样开着、没接上，所以“打开远程”时往往得先关掉它，再连着中转重新打开。这一步在Windows上反复出事：负责重开的程序跟着桌面版一起被关掉；旧进程死了还占着端口；高权限下读不到进程信息……每修好一层，又冒出下一层。\n7月28日有过一次连接全通（本机和公网都返回正常），但启动过程仍有毛病；本人前后确认过约5次重启成功但成功没法稳定重现。最后一次现场：公网报502，交接卡在“接上桌面版”这一步，本人只能手动把Codex原样打开本人估计前后投入100多小时；最后那个对话里本人发了192条消息，80条在说重启、切换或接管（含重复的短消息）\n8月3日决定：停止修补，Codex回到原样启动，远程入口标成“不可用”。",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/电脑故障.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑故障",
   "source_phrase": "右半边：一张较大的圆角卡“它自己也没稳下来”，卡顶一幅小水彩插画：一台电脑的窗口正在关上，一只拿着扳手的小手和窗口一起被拉进关门的缝里（表示负责重开的程序跟着一起被关掉），旁边一个插头拔不出来的插座（端口被占）；插画下面是正文段和三条带小圆点的列表；卡片最下面一条浅灰底横条写“8 月 3 日决定……”那句。",
   "sha256": "a829484c629a21dc7d82cef241b226eb8fc89c70cbfd5705df85aa0d8002837a",
   "status": "ready",
   "original_elements": [
    "一台电脑的窗口正在关上，一只拿着扳手的小手和窗口一起被拉进关门的缝里（表示负责重开的程序跟着一起被关掉），旁边一个插头拔不出来的插座（端口被占"
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
   "asset": "codex-local-remote/codex-local-remote-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\codex-local-remote\\img\\codex-local-remote-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7f03983f51892b37e722",
   "title_text": "为什么串流能代替它",
   "sha256": "e0119ac6f570378c0f52b808f03629565b4b58fee96afc0bc38a478aded697d8",
   "status": "ready",
   "source_box": [
    36,
    10,
    803,
    159
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 为什么串流能代替它

本人只说了一句“被远程桌面替代”。下面的对照和经过，是 AI 按仓库里 8 月 3 日的停用复盘和现在的用法补的，不是本人的话。

**两条路差在哪**

| | Codex 远程 | 远程电脑串流 |
|---|---|---|
| 手机上看到什么 | 专门做的手机网页，只有 Codex 的任务 | 电脑的整个桌面 |
| 能管什么 | 只管 Codex 桌面版 | 电脑上所有软件，包括 Codex 桌面版 |
| 要不要动 Codex | 要：得接管桌面版的启动，让它和手机连同一个任务服务 | 不用：Codex 原样开着 |
| 手机要装什么 | 只要浏览器 | Moonlight |

远程电脑串流 6 月 26 日就开始搭（仓库第一个提交），比 Codex 远程早一个月。

**它自己也没稳下来**
Codex 桌面版没有给别的程序接进同一个任务的公开入口。要让手机和电脑共用一个任务，桌面版得接到自己的中转程序上；它平时原样开着、没接上，所以“打开远程”时往往得先关掉它，再连着中转重新打开。这一步在 Windows 上反复出事：负责重开的程序跟着桌面版一起被关掉；旧进程死了还占着端口；高权限下读不到进程信息……每修好一层，又冒出下一层。
- 7 月 28 日有过一次连接全通（本机和公网都返回正常），但启动过程仍有毛病；本人前后确认过约 5 次重启成功
- 但成功没法稳定重现。最后一次现场：公网报 502，交接卡在“接上桌面版”这一步，本人只能手动把 Codex 原样打开
- 本人估计前后投入 100 多小时；最后那个对话里本人发了 192 条消息，80 条在说重启、切换或接管（含重复的短消息）

8 月 3 日决定：停止修补，Codex 回到原样启动，远程入口标成“不可用”。

**现在这些事谁来做**

| 当初让它做的 | 现在 |
|---|---|
| 在外面看任务、补要求、批命令 | 用〔远程电脑串流〕连回桌面，直接在 Codex 桌面版里操作 |
| 在外面管电脑文件 | 同样串流过去，用电脑自己的文件管理器 |
| 公网入口 | 9 月 26 日撤掉 |

::screen{#codex-local-remote-03 section="usage"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-03",
  "section": "usage",
  "title": "当初想解决什么、怎么用",
  "scene": "横版 16:9。左上标题。左侧约 45% 宽：上面“想解决的麻烦”一段（左边配一个小水彩：一个人背着包走出家门，身后电脑屏幕上一个等待中的沙漏）；下面“怎么用”一条从上到下的五步流程，五个节点用粗绿色箭头连起来，节点图标依次：一个说话的气泡、一部手机和一把钥匙、一张任务列表、一只手指点在“允许”按钮上、一个关上的门；节点名粗体、说明一两行小字；最下面“背后怎么连”一条横向小链路图：手机 → 云（Tailscale 标志）→ 小盒子“网页服务”→ 小盒子“本机中转”→ 小盒子“任务服务”，最右一台电脑屏幕上 Codex（OpenAI）标志连回任务服务；链路图下一行小字。右侧约 55%：四个带细浅绿边框的竖长空位，一行并排，每个约占右侧宽度的 23%、高约画面的 70%，比例 9:19 左右（手机截图），拼页时贴真实截图；每个空位下面一行小字说明（照“截图说明”四条写，不带前面的圆点）。",
  "portrait": "竖版保留已正确03-v原范围/路径/SHA，不重画。原03-v2分为v2/v3，默认v/v2/v3顺序。第2张03-v2仅原“背后怎么连”标题、两段完整链路/本机入口说明、原“截图说明：”、任务列表/工作记录两真实截图及各自原图注。两空框一组并排，真实比例均1440:2800，参考各416×809源像素；图注紧跟本组对应图，图注名称明确对应，不补新编号/标签。新增第3张03-v3仅审批抽屉/文件页两真实截图及各自原图注；一组并排，审批框按412:915参考416×924，文件框按1440:2800参考416×809，保比例不要为等高拉伸；不重复链路、标题、截图说明或新标签。两组真实界面在370宽时各约164px，关键界面/按钮须可辨；GUI微字不逐字要求。说明正文整宽36源像素/行48可行参考，不拿公式称实际成图通过。原text/横scene与所有其他screens保持。\n仅03-v2本轮普通排版恢复：原“背后怎么连”标题、两段完整链路/本机入口说明在上；补原“截图说明：”；之后一组两张纯白矩形真截图框，内白区各416×809，按1440:2800原比例，无刘海、手机机身、阴影内屏或多重嵌套；图注随后整宽逐条，任务列表在先、工作记录在后。不要把长图注放半宽卡里。小链路水彩图云内保原Tailscale九点标志，缩小装饰而不缩正文。既有03-v/03-v3各自原路径/文字/字节保护，绝不新增part或移字。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/ca02320ce02904644c379cb2ca95141471ef4ba09b545941e28e2249f79ec097.jpg",
    "where": "右侧第 1 个竖长空位（1440×2800，按宽度缩放）",
    "caption": "真机任务列表：电脑在线、3 个任务在跑，顺序和桌面版一样（7 月 28 日）",
    "frame_bindings": {
     "v": {
      "C62DDBB43AAAAB0D5ED04ACF900DD7349D4DB7D8E66244358D08F18AE3EA7816": [
       28,
       610,
       463,
       1336
      ],
      "42DCACC636365C377B95BAEF807500FDBE044D1B7901B490CAF9A984CA94958A": [
       28,
       2234,
       463,
       2960
      ]
     },
     "h": {
      "65A1EFA8A14521B006A832DBBFE69946136FF856A705D9E43EE7C1F3452B6A37": [
       1173,
       49,
       1316,
       354
      ]
     }
    }
   },
   {
    "file": "sources/assets/_references/03c7fb81ebe181ba023fefde2e5680970c57074299da5d09c5c30dc1457a9a78.jpg",
    "where": "右侧第 2 个竖长空位（1440×2800）",
    "caption": "真机工作记录：公开的思考摘要、跑了几条命令、改了几个文件，底下是“引导正在运行的回复”输入框（7 月 28 日）",
    "frame_bindings": {
     "v": {
      "C62DDBB43AAAAB0D5ED04ACF900DD7349D4DB7D8E66244358D08F18AE3EA7816": [
       478,
       610,
       913,
       1336
      ],
      "42DCACC636365C377B95BAEF807500FDBE044D1B7901B490CAF9A984CA94958A": [
       478,
       2234,
       913,
       2960
      ]
     },
     "h": {
      "65A1EFA8A14521B006A832DBBFE69946136FF856A705D9E43EE7C1F3452B6A37": [
       1446,
       48,
       1589,
       353
      ]
     }
    }
   },
   {
    "file": "sources/assets/_references/0397be5a186ab5994d182130671c295f596b96ada3959b3934f07fa2e5114ab6.jpg",
    "where": "右侧第 3 个竖长空位（412×915）",
    "caption": "审批抽屉：要执行的命令、影响的文件、可选的回答，“允许这一次”或“拒绝”（演示数据）",
    "frame_bindings": {
     "v": {
      "0E6B618C39F8CB7C963AEEC4FD43E22C18118FF8C976796DCAED23B2CB9373B7": [
       52,
       132,
       456,
       1085
      ],
      "4A5E0A74E2AA949FA3183EFB854DDD1B4458D15812DA7D1B160317CB58587296": [
       52,
       3240,
       456,
       4193
      ],
      "42DCACC636365C377B95BAEF807500FDBE044D1B7901B490CAF9A984CA94958A": [
       52,
       3240,
       456,
       4193
      ]
     },
     "h": {
      "65A1EFA8A14521B006A832DBBFE69946136FF856A705D9E43EE7C1F3452B6A37": [
       1186,
       513,
       1304,
       766
      ]
     }
    }
   },
   {
    "file": "sources/assets/_references/c6d39bc20e7fa8709e2edd3641d969217c482a0aeb98802e08869a41b0a42b5a.jpg",
    "where": "右侧第 4 个竖长空位（1440×2800）",
    "caption": "真机文件页：选一个登记过的项目，按文件夹浏览（7 月 28 日）",
    "frame_bindings": {
     "v": {
      "0E6B618C39F8CB7C963AEEC4FD43E22C18118FF8C976796DCAED23B2CB9373B7": [
       488,
       132,
       892,
       1035
      ],
      "4A5E0A74E2AA949FA3183EFB854DDD1B4458D15812DA7D1B160317CB58587296": [
       488,
       3240,
       892,
       4143
      ],
      "42DCACC636365C377B95BAEF807500FDBE044D1B7901B490CAF9A984CA94958A": [
       488,
       3240,
       892,
       4143
      ]
     },
     "h": {
      "65A1EFA8A14521B006A832DBBFE69946136FF856A705D9E43EE7C1F3452B6A37": [
       1467,
       513,
       1570,
       759
      ]
     }
    }
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "当初想解决什么、怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "想解决的麻烦",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "怎么用"
    },
    {
     "type": "flow",
     "text_ref": "1说“打开远程”",
     "direction": "horizontal",
     "columns": 5,
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "背后怎么连"
    },
    {
     "type": "topology",
     "text_ref": "手机浏览器",
     "layout": "chain",
     "split_arrows": false,
     "connector": "none",
     "illustration": "none",
     "direction": "horizontal"
    },
    {
     "type": "section_heading",
     "text_ref": "截图说明："
    },
    {
     "type": "screenshot",
     "columns": 4,
     "caption_mode": "source_order",
     "aspect_ratio": "9:19",
     "text_ref": "真机任务列表"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。 窄栏链路按既有文字保全；组件若仍固定横链导致溢出，需其所有者修复，不能缩字或移出原左栏。 2026-10-04 第三轮：依wave2b与Claude引导d29ed330-e0cb-45ac-bd52-61ee8a0a076c，原文字节点通宽，五步按现有五列横向接口、完整链路按已支持的横向自然排法，四个9:19截图位整宽一排置底；原图/竖版/源字及四槽映射不改。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "当初想解决什么、怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "想解决的麻烦",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "怎么用"
    },
    {
     "type": "flow",
     "text_ref": "1说“打开远程”",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "背后怎么连",
     "page_break_before": true
    },
    {
     "type": "topology",
     "text_ref": "手机浏览器",
     "layout": "chain",
     "split_arrows": false,
     "connector": "none",
     "illustration": "none",
     "direction": "vertical",
     "chain_columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "截图说明："
    },
    {
     "type": "screenshot",
     "columns": 2,
     "columns_v": 2,
     "caption_mode": "full_width",
     "frame_style": "plain_white",
     "text_ref": "真机任务列表",
     "indices": [
      0,
      1
     ]
    },
    {
     "type": "screenshot",
     "columns": 2,
     "columns_v": 2,
     "caption_mode": "full_width",
     "frame_style": "plain_white",
     "text_ref": "审批抽屉",
     "indices": [
      2,
      3
     ],
     "page_break_before": true
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。 原v仅标题/麻烦/五步；v2从背后怎么连起含两段完整链路说明、原截图说明、任务列表/工作记录各自图注；v3仅审批抽屉/文件页各自图注。两组按真实截图比例并排、图注整宽、不重复正文，分界在完整块间。"
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
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "说“打开远程”",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "手机打开网址",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
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
   "source_phrase": "看同一个任务",
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
   "source_phrase": "动手",
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
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "说“关闭远程”",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
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

**想解决的麻烦**
Codex 的长任务一跑几个小时。人一离开电脑，它停下来等审批、跑偏了要补一句、做完了要看改了什么，都得回到电脑前。把聊天记录复制到手机不行：手机上那份不是电脑上真在跑的任务。想要的是：手机浏览器打开一个网址、输一个密码，就接着管电脑上同一个任务；手机不装 App，也不装 Tailscale。

**怎么用**
1. **说“打开远程”**
AI 调控制入口；必要时电脑上的 Codex 重开一次，接到中转程序上
2. **手机打开网址**
经 Tailscale Funnel 的公网地址，输密码登录
3. **看同一个任务**
任务列表、实时进展、改了哪些文件
4. **动手**
批命令、补一句、叫停、排好下一句
5. **说“关闭远程”**
关掉公网入口；Codex 用到自然退出，下次原样启动

**背后怎么连**
手机浏览器 → 公网入口（Tailscale Funnel）→ 网页服务（Sidecar：登录、整理任务事件、管文件）→ 本机中转（Broker）→ 唯一一个 Codex 任务服务（app-server）← Codex 桌面版
任务服务和中转只在本机听；从公网进来，只能碰到登录后的网页服务。

截图说明：
- 真机任务列表：电脑在线、3 个任务在跑，顺序和桌面版一样（7 月 28 日）
- 真机工作记录：公开的思考摘要、跑了几条命令、改了几个文件，底下是“引导正在运行的回复”输入框（7 月 28 日）
- 审批抽屉：要执行的命令、影响的文件、可选的回答，“允许这一次”或“拒绝”（演示数据）
- 真机文件页：选一个登记过的项目，按文件夹浏览（7 月 28 日）

::screen{#codex-local-remote-04 section="features"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-04",
  "section": "features",
  "title": "全部旧功能",
  "scene": "横版 16:9，和其他项目页“全部功能”同一种画法，但整屏色调偏灰淡，表示都已停用。左上标题，标题右边图例（只有一种：灰色叉“已停用”）。两组功能从上往下排；每组的组名用毛笔字写在这一组卡片上方的一行（不单独占一整列）；卡片三列排：每张卡左边一个灰调小水彩图标，粗体功能名，下面一两行说明，右上角一个灰色叉。图标：接着同一个任务画一根线两头各拴一部手机和一台电脑；任务列表画一张带图钉的清单；手机开新任务画一部手机和一个加号；实时工作记录画一卷展开的日志纸；进出子任务画一棵有分叉的小树；中英切换画两个重叠的空白对话气泡，一个绿一个灰（气泡里不写字）；补一句画一个插进来的小气泡；叫停画一个停止方块；下一轮排队画三张排队的便签；审批画一个盾牌上一个勾；下一轮的模型和模式画一个小旋钮；额度和上下文画一个绿色圆环仪表。",
  "portrait": "竖版 9:16：标题和图例在上；每组组名一行，下面卡片改成一行一张（图标在左、字在右、叉在右上）；两组依次往下。字完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-task",
    "text": "在手机上看同一个任务"
   },
   {
    "id": "f-same-task",
    "text": "接着同一个任务"
   },
   {
    "id": "f-task-list",
    "text": "任务列表"
   },
   {
    "id": "f-new-task",
    "text": "手机开新任务"
   },
   {
    "id": "f-worklog",
    "text": "实时工作记录"
   },
   {
    "id": "f-subagents",
    "text": "进出子任务"
   },
   {
    "id": "f-language",
    "text": "中英切换"
   },
   {
    "id": "g-control",
    "text": "插话、审批和下一轮"
   },
   {
    "id": "f-steer",
    "text": "给正在跑的回复补一句"
   },
   {
    "id": "f-stop",
    "text": "叫停"
   },
   {
    "id": "f-queue",
    "text": "下一轮排队"
   },
   {
    "id": "f-approval",
    "text": "手机审批和回答提问"
   },
   {
    "id": "f-next-turn",
    "text": "下一轮的模型和模式"
   },
   {
    "id": "f-usage-context",
    "text": "额度和上下文"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部旧功能（21项，全部已停用）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "text_ref": "在手机上看同一个任务",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "接着同一个任务：手机和电脑用同一个任务编号；电脑上的Codex先接上这个任务，手机的第一句才放行，不会各跑一份✕任务列表",
     "columns": 3,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "插话、审批和下一轮",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "给正在跑的回复补一句：趁这一轮还没结束，把要求补进去✕叫停：停掉当前这一轮✕下一轮排队：先写好下一句，能改、调顺序、删；",
     "columns": 3,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "tone": "historical"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部旧功能（21项，全部已停用）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "text_ref": "在手机上看同一个任务",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "接着同一个任务：手机和电脑用同一个任务编号；电脑上的Codex先接上这个任务，手机的第一句才放行，不会各跑一份✕任务列表",
     "columns": 3,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "插话、审批和下一轮",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "给正在跑的回复补一句：趁这一轮还没结束，把要求补进去✕叫停：停掉当前这一轮✕下一轮排队：先写好下一句，能改、调顺序、删；",
     "columns": 3,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "tone": "historical"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。"
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "接着同一个任务：手机和电脑用同一个任务编号；电脑上的 Codex 先接上这个任务，手机的第一句才放行，不会各跑一份 ✕",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
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
   "source_phrase": "任务列表：正在跑、置顶、最近、归档，顺序和桌面版一样；能改名、复制任务编号、归档和恢复 ✕",
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "手机开新任务：在电脑上登记过的项目里开，或在单独的临时文件夹里开；手机不能随便指定路径 ✕",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "实时工作记录：公开的思考摘要、跑过的命令和输出、改动的文件（逐行对比）、图片；模型隐藏的推理不显示；长对话先显示最近的，可逐段展开全部；浏览器标签页标题提示断线、等你处理、运行中、失败 ✕",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
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
   "source_phrase": "进出子任务：看每个子任务在做什么，点进去只读看完整记录，再回主任务补要求；做完的、归档的也在 ✕",
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
   "source_phrase": "中英切换：默认中文，一键切英文 ✕",
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
   "asset": "_library/fix-round-2/icon-clean-ee27e64c97037ad87bcf.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "气泡钢笔",
   "source_phrase": "给正在跑的回复补一句：趁这一轮还没结束，把要求补进去 ✕",
   "sha256": "0885f03d0fd8605a1e8158ed683043f68c0a9f2176cb524056d398071c4424c1",
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
   "source_phrase": "叫停：停掉当前这一轮 ✕",
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
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "下一轮排队：先写好下一句，能改、调顺序、删；在电脑上加密存着；断线后说不清发没发出去，就停住不重发 ✕",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "手机审批和回答提问：看要执行的命令和影响的文件，再选允许或拒绝；按钮只用 Codex 当时给的选项，不自己编 ✕",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "下一轮的模型和模式：换模型、思考档位、速度、权限、计划模式，设任务目标；只对下一轮生效，不中途换 ✕",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "额度和上下文：上下文用了多少（绿色圆环）、账号额度和重置时间（北京时间）、上下文压缩到了哪一步；空闲时可手动压缩 ✕",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e57b396ce69bd05e4ec8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e57b396ce69bd05e4ec8",
   "title_text": "全部旧功能（21 项，全部已停用）",
   "sha256": "a61db35d4566a567b08bb85b465bb960ec533125db9bf64e4cf1b87afd050564",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部旧功能（21 项，全部已停用）

图例：✕ 已停用

**在手机上看同一个任务**
- **接着同一个任务**：手机和电脑用同一个任务编号；电脑上的 Codex 先接上这个任务，手机的第一句才放行，不会各跑一份 ✕
- **任务列表**：正在跑、置顶、最近、归档，顺序和桌面版一样；能改名、复制任务编号、归档和恢复 ✕
- **手机开新任务**：在电脑上登记过的项目里开，或在单独的临时文件夹里开；手机不能随便指定路径 ✕
- **实时工作记录**：公开的思考摘要、跑过的命令和输出、改动的文件（逐行对比）、图片；模型隐藏的推理不显示；长对话先显示最近的，可逐段展开全部；浏览器标签页标题提示断线、等你处理、运行中、失败 ✕
- **进出子任务**：看每个子任务在做什么，点进去只读看完整记录，再回主任务补要求；做完的、归档的也在 ✕
- **中英切换**：默认中文，一键切英文 ✕

**插话、审批和下一轮**
- **给正在跑的回复补一句**：趁这一轮还没结束，把要求补进去 ✕
- **叫停**：停掉当前这一轮 ✕
- **下一轮排队**：先写好下一句，能改、调顺序、删；在电脑上加密存着；断线后说不清发没发出去，就停住不重发 ✕
- **手机审批和回答提问**：看要执行的命令和影响的文件，再选允许或拒绝；按钮只用 Codex 当时给的选项，不自己编 ✕
- **下一轮的模型和模式**：换模型、思考档位、速度、权限、计划模式，设任务目标；只对下一轮生效，不中途换 ✕
- **额度和上下文**：上下文用了多少（绿色圆环）、账号额度和重置时间（北京时间）、上下文压缩到了哪一步；空闲时可手动压缩 ✕

::screen{#codex-local-remote-05 section="features"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-05",
  "section": "features",
  "title": "全部旧功能（续）",
  "scene": "横版 16:9，接上一屏，同一种画法、同样偏灰淡。左上标题，标题右边同样的图例。三组功能从上往下排，组名用毛笔字写在这一组卡片上方的一行；卡片三列排，每组另起一行；“电脑文件”组只有一张卡，这一行右边空出的位置画一小幅灰调水彩：一个文件夹和一个回收站。图标：电脑文件页画一个打开的文件夹；外网入口画一扇开向云的门（带 Tailscale 标志）；登录和请求保护画一把锁；断线不丢、不重发画一条断开又接上的链子；打开和关闭远程画一个拨动开关；一句话让 AI 开关画一个说话气泡里的开关；能退回的版本画两个叠放的盒子和一个回头箭头；任务不停也能换网页层画一只手在不停转的齿轮旁换一块面板；交给 AI 安装画一张写满字的纸条（不画可读的字）交给一个小机器人。",
  "portrait": "竖版 9:16：标题和图例在上；每组组名一行，下面卡片改成一行一张（图标在左、字在右、叉在右上）；三组依次往下；文件夹和回收站的小插画放在“电脑文件”那张卡右边缩小。字完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-files",
    "text": "电脑文件"
   },
   {
    "id": "f-file-manager",
    "text": "电脑文件页"
   },
   {
    "id": "g-access",
    "text": "从外面连回来"
   },
   {
    "id": "f-public-entry",
    "text": "外网入口"
   },
   {
    "id": "f-login-guard",
    "text": "登录和请求保护"
   },
   {
    "id": "f-reconnect",
    "text": "断线不丢、不重发"
   },
   {
    "id": "g-ops",
    "text": "开关、安装和更新"
   },
   {
    "id": "f-open-close",
    "text": "打开和关闭远程"
   },
   {
    "id": "f-control-skill",
    "text": "一句话让 AI 开关"
   },
   {
    "id": "f-runtime-versions",
    "text": "能退回的版本"
   },
   {
    "id": "f-hot-update",
    "text": "任务不停也能换网页层"
   },
   {
    "id": "f-ai-install",
    "text": "交给 AI 安装"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部旧功能（续）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "text_ref": "电脑文件",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "电脑文件页：浏览和搜索这台电脑检测到的全部磁盘，预览文本、Markdown、图片和PDF，上传、新建、编辑、改名、复制、",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "从外面连回来",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "外网入口：经TailscaleFunnel的一个公网地址进来，手机只要浏览器；9月26日撤掉✕登录和请求保护：一个本机设",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "开关、安装和更新",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "打开和关闭远程：平时Codex原样启动；“打开”时才接管，必要时重开一次Codex；“关闭”只关公网入口、不重开Code",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical",
     "last_full_width": true
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。；最终视觉补验电脑文件仅一张卡，改为单列通栏，保留全部源字。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部旧功能（续）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "text_ref": "电脑文件",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "电脑文件页：浏览和搜索这台电脑检测到的全部磁盘，预览文本、Markdown、图片和PDF，上传、新建、编辑、改名、复制、",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "从外面连回来",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "外网入口：经TailscaleFunnel的一个公网地址进来，手机只要浏览器；9月26日撤掉✕登录和请求保护：一个本机设",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical"
    },
    {
     "type": "section_heading",
     "text_ref": "开关、安装和更新",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "打开和关闭远程：平时Codex原样启动；“打开”时才接管，必要时重开一次Codex；“关闭”只关公网入口、不重开Code",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "tone": "historical"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。"
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "电脑文件页：浏览和搜索这台电脑检测到的全部磁盘，预览文本、Markdown、图片和 PDF，上传、新建、编辑、改名、复制、移动、下载、删除；删除先进回收站，覆盖和永久删除要再确认一次 ✕",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "外网入口：经 Tailscale Funnel 的一个公网地址进来，手机只要浏览器；9 月 26 日撤掉 ✕",
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "登录和请求保护：一个本机设的密码，只存加盐后的哈希；输错多次临时锁定；改东西的请求必须来自这个网页本身，别的网页借不了登录；任务里的本机文件路径换成短时有效的引用 ✕",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "断线不丢、不重发：断线后按事件编号接着收；草稿和排队的话都留着；结果说不清就先核对，不自动再发一遍 ✕",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "打开和关闭远程：平时 Codex 原样启动；“打开”时才接管，必要时重开一次 Codex；“关闭”只关公网入口、不重开 Codex；网页服务崩了能自己拉起 ✕",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "一句话让 AI 开关：跟 AI 说“打开远程”“关闭远程”“远程状态”；8 月 13 日改成只回答“不可用”，9 月 26 日卸载 ✕",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
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
   "source_phrase": "能退回的版本：每个版本按内容算出编号、单独存一份，记着“当前”和“上一个”，出问题退回上一个 ✕",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "任务不停也能换网页层：先不接新请求、等手上的做完，再换手机网页和网页服务；新的起不来就换回旧的；底层任务服务不动 ✕",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
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
   "source_phrase": "交给 AI 安装：仓库里有一段现成的提示词，贴给 Codex 桌面版，让它自己装 ✕",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-codex-local-remote.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-codex-local-remote",
   "source_phrase": "横版 16:9，接上一屏，同一种画法、同样偏灰淡。左上标题，标题右边同样的图例。三组功能从上往下排，组名用毛笔字写在这一组卡片上方的一行；卡片三列排，每组另起一行；“电脑文件”组只有一张卡，这一行右边空出的位置画一小幅灰调水彩：一个文件夹和一个回收站。图标：电脑文件页画一个打开的文件夹；外网入口画一扇开向云的门（带 Tailscale 标志）；登录和请求保护画一把锁；断线不丢、不重发画一条断开又接上的链子；打开和关闭远程画一个拨动开关；一句话让 AI 开关画一个说话气泡里的开关；能退回的版本画两个叠放的盒子和一个回头箭头；任务不停也能换网页层画一只手在不停转的齿轮旁换一块面板；交给 AI 安装画一张写满字的纸条（不画可读的字）交给一个小机器人。",
   "sha256": "207ca8c4f5cb3177b61374ce0da3e5131b939e2034be7fb401fa42636cd5a6c8",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-b38ce3e9281d806bbc0e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b38ce3e9281d806bbc0e",
   "title_text": "全部旧功能（续）",
   "sha256": "80c25efe770f33cd59284278bb01d9823aaa54de0a0d3222b20e9a6e6812ca6d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部旧功能（续）

图例：✕ 已停用

**电脑文件**
- **电脑文件页**：浏览和搜索这台电脑检测到的全部磁盘，预览文本、Markdown、图片和 PDF，上传、新建、编辑、改名、复制、移动、下载、删除；删除先进回收站，覆盖和永久删除要再确认一次 ✕

**从外面连回来**
- **外网入口**：经 Tailscale Funnel 的一个公网地址进来，手机只要浏览器；9 月 26 日撤掉 ✕
- **登录和请求保护**：一个本机设的密码，只存加盐后的哈希；输错多次临时锁定；改东西的请求必须来自这个网页本身，别的网页借不了登录；任务里的本机文件路径换成短时有效的引用 ✕
- **断线不丢、不重发**：断线后按事件编号接着收；草稿和排队的话都留着；结果说不清就先核对，不自动再发一遍 ✕

**开关、安装和更新**
- **打开和关闭远程**：平时 Codex 原样启动；“打开”时才接管，必要时重开一次 Codex；“关闭”只关公网入口、不重开 Codex；网页服务崩了能自己拉起 ✕
- **一句话让 AI 开关**：跟 AI 说“打开远程”“关闭远程”“远程状态”；8 月 13 日改成只回答“不可用”，9 月 26 日卸载 ✕
- **能退回的版本**：每个版本按内容算出编号、单独存一份，记着“当前”和“上一个”，出问题退回上一个 ✕
- **任务不停也能换网页层**：先不接新请求、等手上的做完，再换手机网页和网页服务；新的起不来就换回旧的；底层任务服务不动 ✕
- **交给 AI 安装**：仓库里有一段现成的提示词，贴给 Codex 桌面版，让它自己装 ✕

::screen{#codex-local-remote-06 section="history"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-06",
  "section": "history",
  "title": "演进",
  "scene": "横版 16:9。左上标题。上半部一条从左到右、分上下两行蜿蜒的水彩绿色丝带时间轴，9 个小旗按时间插在上面，每个小旗：日期（粗体绿色）＋一两行小字；上下错开不挤。7 月 26 日到 8 月 3 日这一段丝带颜色鲜绿、小旗密；8 月 3 日之后丝带变淡、偏灰，小旗稀疏。丝带尽头画一个上了封条的纸箱，箱子上贴着一个小小的手机网页图标。下半部一块浅绿底圆角区“留下的教训”：四张并排小卡，每张一个小水彩图标（五级台阶，只有最高一级是亮绿色；一台电脑和一个先后顺序的箭头；一台主力电脑旁边一个一次性的纸盒电脑；一个秒表上画着一条红线），卡里粗体标题一行、下面两三行正文。",
  "portrait": "竖版 9:16：标题；时间轴改成从上到下一条竖丝带，9 个小旗依次往下，日期在左、小字在右；丝带尽头是封条纸箱；“留下的教训”四张小卡改成上下四张。字完全一样。",
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
     "text_ref": "演进（7月26日—8月7日，65次提交）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "7月26日：第一版提交7月28日：发布v0.1.0、v0.1.1；当天一次冷启动连接全通，启动过程仍有毛病。本人实际用过",
     "direction": "horizontal",
     "columns": 5,
     "connector": "ribbon",
     "illustration": "none",
     "tone": "historical_after_aug03",
     "end_illustration": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png"
    },
    {
     "type": "section_heading",
     "text_ref": "留下的教训",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "测试全绿不等于能用：证据分五层：对话里的说法→代码和测试通过→新版本装好了→真机跑通一次→反复恢复都行。说“稳定”要到第",
     "columns": 4,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。；主布局接任：封存盒按assets已供的木匣锁精确PNG接链尾，原撤图不恢复。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进（7月26日—8月7日，65次提交）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "7月26日：第一版提交7月28日：发布v0.1.0、v0.1.1；当天一次冷启动连接全通，启动过程仍有毛病。本人实际用过",
     "direction": "vertical",
     "columns": 5,
     "connector": "ribbon",
     "illustration": "none",
     "tone": "historical_after_aug03",
     "end_illustration": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png"
    },
    {
     "type": "section_heading",
     "text_ref": "留下的教训",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "测试全绿不等于能用：证据分五层：对话里的说法→代码和测试通过→新版本装好了→真机跑通一次→反复恢复都行。说“稳定”要到第",
     "columns": 4,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 停用项目仅排版指定定稿，不读取或维护项目仓库。03 按 main-closer2-brief.md Claude 第1条：仅原件路径/字节不改不删；网站另由程序按原 v/v2/v3 全文字范围排版分张。数字卡、历史灰调及时间线旗帜需组件承接。；主布局接任：封存盒按assets已供的木匣锁精确PNG接链尾，原撤图不恢复。"
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
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "五级台阶，只有最高一级是亮绿色",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "一台电脑和一个先后顺序的箭头",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一台主力电脑旁边一个一次性的纸盒电脑",
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
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "秒表",
   "source_phrase": "一个秒表上画着一条红线",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/scene-r3-sealed-paperbox-mobile-web.png",
   "fallback": false,
   "semantic_status": "precise_scene_combination_pending_visual_review",
   "key": "scene-r3-sealed-paperbox-mobile-web",
   "source_phrase": "丝带尽头画一个上了封条的纸箱，箱子上贴着一个小小的手机网页图标",
   "sha256": "19c5cc7b36ce18a2656799232e7ea09286d430f734ef3fa89e3d7aec1cb063c0",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-7774c1074fb06286a47a-741e92cebbc9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7774c1074fb06286a47a",
   "title_text": "演进（7 月 26 日—8 月 7 日，65 次提交）",
   "sha256": "c489236087335c94952c986d79e4d73f2a2fb4aa346c866d9c1f3521f328a864",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 演进（7 月 26 日—8 月 7 日，65 次提交）

- **7 月 26 日**：第一版提交
- **7 月 28 日**：发布 v0.1.0、v0.1.1；当天一次冷启动连接全通，启动过程仍有毛病。本人实际用过 v0.1.1，觉得好用
- **7 月 31 日**：加上 AI 技能，说“打开远程”“关闭远程”就能开关
- **8 月 2 日**：v0.1.2 把修缺陷扩成大改启动方式：平时原样启动、要用时才接管、版本能退回；当天又发 v0.1.3、v0.1.4
- **8 月 3 日**：零点发 v0.1.5；上午又补了 9 个接管修复，真机仍没接通；当天写停用复盘，停止修补
- **8 月 7 日**：最后一次提交，把那 9 个修复标成“未发布候选”
- **8 月 13 日**：AI 技能改成只回答“不可用”
- **9 月 12 日**：列入冻结名单
- **9 月 26 日**：撤掉公网入口，AI 技能卸载（27 日从技能库删掉）

**留下的教训**（复盘里写给以后的）
- **测试全绿不等于能用**：证据分五层：对话里的说法 → 代码和测试通过 → 新版本装好了 → 真机跑通一次 → 反复恢复都行。说“稳定”要到第五层；v0.1.5 的 1,771 项测试只到第二层
- **先真机切一次，再发布**：v0.1.5 在这台电脑还没真正换上新版时就先发了，顺序反了
- **主力电脑不当试验机**：重来要先在一次性的虚拟机里反复试，最后才在主力电脑上接管一次
- **要有硬止损**：说好“只试一次”却一再接着修，30、50、70 小时时都没停下来重新立项

::screen{#codex-local-remote-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "codex-local-remote-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/codex-remote/01-desktop-task-overview.jpg",
    "caption": "桌面三栏把项目、任务列表、当前状态、待决策事项和额度放在同一个工作台中；内容使用公开合成数据。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/02-mobile-task-home-zh.jpg",
    "caption": "中文任务首页同时展示电脑连接、运行任务、待决策提醒、搜索筛选和底部导航。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/07-mobile-task-home-en.jpg",
    "caption": "同一任务首页切换为英文，保留任务分组、状态、项目和主要操作，不是另一套页面。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/08-real-task-runtime.jpg",
    "caption": "真实任务详情展示任务标识、模型、思考等级、权限模式、额度和文件活动；普通非敏感技术事实按原画面保留。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/03-mobile-conversation-zh.jpg",
    "caption": "任务头、回复、工具、文件修改、输入器和下一轮设置在 412×915 移动布局中保持完整。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/09-real-conversation-tools.jpg",
    "caption": "真实手机端的对话工具面板提供添加文件、任务目标、计划模式和上下文压缩入口，并按运行时能力显示可用状态。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/10-real-command-details.jpg",
    "caption": "手机底部抽屉展示命令原文、完成状态和有界输出，使“运行过什么”可以直接核对。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/11-real-diff-details.jpg",
    "caption": "真实手机端展开项目文件的逐行 diff，保留新增、删除、路径和最新文件之间的切换。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/05-mobile-file-diff-zh.jpg",
    "caption": "公开合成数据演示完整文件 diff、上下文行和可关闭抽屉，适合说明改动而不泄露真实项目。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/06-mobile-model-controls-zh.jpg",
    "caption": "下一轮模型、思考等级和速度与当前运行参数分开；界面明确说明不会热切换正在生成的回复。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/14-real-diagnostics.jpg",
    "caption": "真实历史界面同时展示 Public access、Sidecar、Codex 服务和额度；版本与健康字样只代表截图当时。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/13-real-account-session.jpg",
    "caption": "真实历史设置页展示登录会话、Credits、账号用量和能力可用性；普通用量事实保留，不把旧值写成当前值。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/17-real-progress-detail.jpg",
    "caption": "真实手机 UI 的目标卡同时显示进行状态、当前模式和第 3/9 步，证明长任务结构可以在小屏快速查看。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/18-real-reply-queue-toggle.jpg",
    "caption": "真实输入控制条把发送到当前回复与排队分开，并同时保留当前模式和步骤进度。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/19-real-composer-controls.jpg",
    "caption": "真实输入器把文本、下一轮模型选择和发送按钮放在一个小屏控制条内，不遮挡当前回复。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/codex-remote/20-demo-queued-message-actions.jpg",
    "caption": "历史合成 QA 展示队列消息的上移、下移、编辑、删除和转为当前轮引导；底部输入器仍区分当前回复与下一轮。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "桌面三栏把项目、任务列表、当前状态、待决策事项和额度放在同一个工作台中；内容使用公开合成数据。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15
     ],
     "columns": 4,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "1440:900",
      "412:915",
      "412:915",
      "1440:2800",
      "412:915",
      "1440:2800",
      "1440:2800",
      "1440:2800",
      "412:915",
      "412:915",
      "1440:2800",
      "1440:2800",
      "1429:432",
      "1440:256",
      "1440:256",
      "412:915"
     ],
     "caption_mode": "full_width",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
       ]
      },
      {
       "index": 7,
       "node_indices": [
        7
       ]
      },
      {
       "index": 8,
       "node_indices": [
        8
       ]
      },
      {
       "index": 9,
       "node_indices": [
        9
       ]
      },
      {
       "index": 10,
       "node_indices": [
        10
       ]
      },
      {
       "index": 11,
       "node_indices": [
        11
       ]
      },
      {
       "index": 12,
       "node_indices": [
        12
       ]
      },
      {
       "index": 13,
       "node_indices": [
        13
       ]
      },
      {
       "index": 14,
       "node_indices": [
        14
       ]
      },
      {
       "index": 15,
       "node_indices": [
        15
       ]
      }
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "桌面三栏把项目、任务列表、当前状态、待决策事项和额度放在同一个工作台中；内容使用公开合成数据。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "1440:900",
      "412:915",
      "412:915",
      "1440:2800",
      "412:915",
      "1440:2800",
      "1440:2800",
      "1440:2800",
      "412:915",
      "412:915",
      "1440:2800",
      "1440:2800",
      "1429:432",
      "1440:256",
      "1440:256",
      "412:915"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
       ]
      },
      {
       "index": 7,
       "node_indices": [
        7
       ]
      },
      {
       "index": 8,
       "node_indices": [
        8
       ]
      },
      {
       "index": 9,
       "node_indices": [
        9
       ]
      },
      {
       "index": 10,
       "node_indices": [
        10
       ]
      },
      {
       "index": 11,
       "node_indices": [
        11
       ]
      },
      {
       "index": 12,
       "node_indices": [
        12
       ]
      },
      {
       "index": 13,
       "node_indices": [
        13
       ]
      },
      {
       "index": 14,
       "node_indices": [
        14
       ]
      },
      {
       "index": 15,
       "node_indices": [
        15
       ]
      }
     ]
    }
   ]
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
   "asset": "personal-media/personal-media-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6f966a995ad3884757df",
   "title_text": "画廊",
   "sha256": "684661ca34ff0c625b805441d00e0e5836abb3717728e32fde7a67139c618a97",
   "status": "ready",
   "source_box": [
    47,
    0,
    352,
    185
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 画廊

点击图片，可以查看完整原图。

桌面三栏把项目、任务列表、当前状态、待决策事项和额度放在同一个工作台中；内容使用公开合成数据。

中文任务首页同时展示电脑连接、运行任务、待决策提醒、搜索筛选和底部导航。

同一任务首页切换为英文，保留任务分组、状态、项目和主要操作，不是另一套页面。

真实任务详情展示任务标识、模型、思考等级、权限模式、额度和文件活动；普通非敏感技术事实按原画面保留。

任务头、回复、工具、文件修改、输入器和下一轮设置在 412×915 移动布局中保持完整。

真实手机端的对话工具面板提供添加文件、任务目标、计划模式和上下文压缩入口，并按运行时能力显示可用状态。

手机底部抽屉展示命令原文、完成状态和有界输出，使“运行过什么”可以直接核对。

真实手机端展开项目文件的逐行 diff，保留新增、删除、路径和最新文件之间的切换。

公开合成数据演示完整文件 diff、上下文行和可关闭抽屉，适合说明改动而不泄露真实项目。

下一轮模型、思考等级和速度与当前运行参数分开；界面明确说明不会热切换正在生成的回复。

真实历史界面同时展示 Public access、Sidecar、Codex 服务和额度；版本与健康字样只代表截图当时。

真实历史设置页展示登录会话、Credits、账号用量和能力可用性；普通用量事实保留，不把旧值写成当前值。

真实手机 UI 的目标卡同时显示进行状态、当前模式和第 3/9 步，证明长任务结构可以在小屏快速查看。

真实输入控制条把发送到当前回复与排队分开，并同时保留当前模式和步骤进度。

真实输入器把文本、下一轮模型选择和发送按钮放在一个小屏控制条内，不遮挡当前回复。

历史合成 QA 展示队列消息的上移、下移、编辑、删除和转为当前轮引导；底部输入器仍区分当前回复与下一轮。
