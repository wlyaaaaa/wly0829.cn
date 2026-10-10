---
{
 "title": "电脑远程控制",
 "kind": "project",
 "url": "/projects/remote-control/",
 "tagline": "手机或笔记本上的 AI，直接在我的电脑上办事。",
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
  "page": "remote-control",
  "kind": "project",
  "title": "电脑远程控制",
  "url": "/projects/remote-control/",
  "tagline": "手机或笔记本上的 AI，直接在我的电脑上办事。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/wly0829.cn",
  "capability": "在我的真电脑上动手",
  "based_on": {
   "commit": "6ba9bfc0be0974ede3995e5d9f297906b5728991",
   "commit_time": "2026-09-28T15:56:44+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，白底水彩风格，从开头这屏的插画出发：手机屏幕上一个对话气泡冒出来，化成一颗绿色光点，沿丝带飞进 Cloudflare 云朵，再顺着隧道落进台式机；台式机屏幕上一个文件夹打开、一页纸被改了一行、出现一个绿色对勾；同时笔记本和台式机之间的虚线上，一把小扳手来回滑动一次；最后光点带着对勾飞回手机，气泡变成“已完成”的样子。背景叶子缓慢飘落，其余画面静止。",
  "registry": {
   "groups": [
    {
     "id": "g-entry",
     "name": "连接入口"
    },
    {
     "id": "g-tools",
     "name": "能办的事"
    },
    {
     "id": "g-guard",
     "name": "规矩和保护"
    },
    {
     "id": "g-alive",
     "name": "一直在线"
    },
    {
     "id": "g-web",
     "name": "网页上的授权与状态"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-main-entry",
     "group": "g-entry",
     "name": "主机公网入口",
     "what": "mcp.wly0829.cn 经 Cloudflare 免费隧道进主机，电脑不开端口；要登录",
     "how": "客户端里填这个地址，用入口密码登录一次",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:76,192；registries\\remote_computer_cloudflare_tunnel.json",
     "screen": "remote-control-09"
    },
    {
     "id": "f-secondary-entry",
     "group": "g-entry",
     "name": "副机入口",
     "what": "笔记本用 Tailscale Funnel 开出自己的地址，单独登录",
     "how": "客户端里另加一个连接",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:69；E:\\PCConfig\\tools\\secondary-laptop-access\\README.md:106",
     "screen": "remote-control-09"
    },
    {
     "id": "f-fallback-entry",
     "group": "g-entry",
     "name": "主机备用入口",
     "what": "隧道断了，改连挂在副机地址下的备用入口，经私网转到主机；第一次要单独登录",
     "how": "确认主入口故障后手动切换；两台都要开机联网",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:70-72,82,92；registries\\remote_computer_mcp_relay.json；真实使用：笔记本上 Codex 的 main_desktop 日常就走这个中转地址连主机（E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:51），9 月 11 日 17:45 全新 Codex 任务经它回读主机",
     "screen": "remote-control-09"
    },
    {
     "id": "f-chatgpt",
     "group": "g-entry",
     "name": "ChatGPT 两个连接",
     "what": "“我的电脑”项目里有“主机 MCP”“副机 MCP”，手机和网页都能用",
     "how": "在 ChatGPT 的“我的电脑”项目里说要做的事",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:76,194",
     "screen": "remote-control-09"
    },
    {
     "id": "f-codex-peer",
     "group": "g-entry",
     "name": "两台 Codex 互连",
     "what": "笔记本 Codex 连主机，主机 Codex 连笔记本",
     "how": "在 Codex 里直接让它操作另一台",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:45-51",
     "screen": "remote-control-09"
    },
    {
     "id": "f-claude-peer",
     "group": "g-entry",
     "name": "主机 Claude 连副机",
     "what": "主机上的 Claude 直接操作笔记本",
     "how": "在 Claude 里直接让它操作笔记本",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:49-51；9 月 28 日 19:47 实测 ComputerContext",
     "screen": "remote-control-09"
    },
    {
     "id": "f-other-client",
     "group": "g-entry",
     "name": "别的账号和客户端",
     "what": "另一个 OpenAI 账号可自己加连接；别的客户端可用应用凭据接入",
     "how": "按网站“连接电脑”页的说明配置",
     "status": "说不准",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:39,202-212；第二账号未测（E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:276）",
     "screen": "remote-control-09"
    },
    {
     "id": "f-warm-client",
     "group": "g-entry",
     "name": "副机备用连接保温",
     "what": "笔记本连过一次主机后，一小时内保持连接，下次不用重新建立、响应更快；开始菜单能看能停",
     "how": "自动；开始菜单“MCP 备用连接保温状态”",
     "status": "说不准",
     "source": "E:\\PCConfig\\tools\\secondary-laptop-access\\README.md:158-166",
     "screen": "remote-control-09"
    },
    {
     "id": "f-files",
     "group": "g-tools",
     "name": "文件",
     "what": "读、写、找、列目录、复制、移动",
     "how": "直接说要找什么、改什么",
     "status": "在用",
     "source": "日志 9-26 至 9-28 FileSystem 65 次",
     "screen": "remote-control-09"
    },
    {
     "id": "f-shell",
     "group": "g-tools",
     "name": "命令和脚本",
     "what": "用 PowerShell 7 跑命令、Python、Node、Git 和现成管理脚本，拿回输出和退出码",
     "how": "直接说要做的事",
     "status": "在用",
     "source": "日志 PowerShell 130 次；E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:243",
     "screen": "remote-control-09"
    },
    {
     "id": "f-docs",
     "group": "g-tools",
     "name": "读文档片段",
     "what": "只读文本某几行、PDF 某页、Word 某段、Excel 某行，不回传整份",
     "how": "说清读哪份的哪一段",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:244；server.py read_document",
     "screen": "remote-control-09"
    },
    {
     "id": "f-long-edit",
     "group": "g-tools",
     "name": "大文件局部修改",
     "what": "10 万行的文本只读目标附近，按唯一锚点改一段再回读",
     "how": "说清改哪一段",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:245（9 月 11 日补验）",
     "screen": "remote-control-09"
    },
    {
     "id": "f-desktop",
     "group": "g-tools",
     "name": "桌面操作",
     "what": "截图、读界面元素、点、打字、快捷键、滚动、拖动、开关应用、等某个画面出现",
     "how": "说清要在哪个软件里做什么；会占用鼠标键盘",
     "status": "在用",
     "source": "日志 Screenshot 6、Snapshot 5、App 3、Click 2、Move 1；E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:249",
     "screen": "remote-control-09"
    },
    {
     "id": "f-chrome",
     "group": "g-tools",
     "name": "操作我的 Chrome",
     "what": "在原来的 Chrome 里开标签、输入、点链接、截图核对，不动已开的页面",
     "how": "说清要打开哪个网页做什么",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:247",
     "screen": "remote-control-09"
    },
    {
     "id": "f-forms",
     "group": "g-tools",
     "name": "填表和上传",
     "what": "输入、下拉、勾选、选附件、提交；只在本机测试页验过，真网站的登录验证码没测",
     "how": "说清填什么；点屏操作我一般自己来",
     "status": "说不准",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:248；本人 FZ14（owner-decisions.md）",
     "screen": "remote-control-09"
    },
    {
     "id": "f-system",
     "group": "g-tools",
     "name": "系统小工具",
     "what": "进程、注册表、剪贴板、弹通知、显示器清单、抓网页文字",
     "how": "直接说要查什么",
     "status": "在用",
     "source": "Windows-MCP 上游工具；日志 Process 1、DisplayInventory 1",
     "screen": "remote-control-09"
    },
    {
     "id": "f-maintenance",
     "group": "g-tools",
     "name": "管理员和 SYSTEM 维护",
     "what": "用管理员或 SYSTEM 身份跑命令；长命令先给编号，之后凭编号取结果",
     "how": "说清要维护什么；AI 自己选身份",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:122-143；日志 2 次；两个维护任务 9 月 25 日成功",
     "screen": "remote-control-09"
    },
    {
     "id": "f-rules-handshake",
     "group": "g-guard",
     "name": "连上就给规则",
     "what": "每次连接握手附上规则原文：主机现场核验当前版本，笔记本发自己那份",
     "how": "自动",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:196-200；server.py:793-812",
     "screen": "remote-control-10"
    },
    {
     "id": "f-context",
     "group": "g-guard",
     "name": "开工先核对",
     "what": "先查是哪台电脑、用哪版规则、资料锁开没开、电脑有没有卡住",
     "how": "自动，每条新提示先调一次",
     "status": "在用",
     "source": "server.py:48-56；日志 ComputerContext 50 次",
     "screen": "remote-control-10"
    },
    {
     "id": "f-shared-lock",
     "group": "g-guard",
     "name": "资料锁共用一份",
     "what": "手机、网页、本机 AI 用同一份资料解锁和截止；连上电脑不算解锁",
     "how": "锁着时 AI 给出授权页地址",
     "status": "在用",
     "source": "E:\\.agents\\releases\\E187\\docs\\contracts\\agents.privacy-data.md:9；server.py:58-78",
     "screen": "remote-control-10"
    },
    {
     "id": "f-recycle",
     "group": "g-guard",
     "name": "删除和覆盖先进回收站",
     "what": "删文件、覆盖写入、覆盖复制移动，旧内容先进我账户的回收站；进不去就拒绝",
     "how": "自动",
     "status": "在用",
     "source": "filesystem_recycle.py:1-12；提交 56f86714（9-28 03:46）",
     "screen": "remote-control-10"
    },
    {
     "id": "f-no-replay",
     "group": "g-guard",
     "name": "超时不重来",
     "what": "超时只说结果未知，不自动重交；维护命令凭编号查原结果",
     "how": "自动",
     "status": "在用",
     "source": "freeze_guard.py:30；E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:141,158",
     "screen": "remote-control-10"
    },
    {
     "id": "f-freeze-rescue",
     "group": "g-guard",
     "name": "卡死时给急救做法",
     "what": "独立探测确认卡死时，回复直接写重启或按键留现场；真卡死时还没见它出现过",
     "how": "自动",
     "status": "说不准",
     "source": "bounded_call.py:11；提交 16b5c9d8（9-27 23:20）；9 月 28 日查 E:\\Data\\RemoteComputerMCP 的日志和 state 下卡死状态文件，没找到这句提示触发过的记录（传输日志不记回复内容，所以也不能断定从没触发）",
     "screen": "remote-control-10"
    },
    {
     "id": "f-no-window",
     "group": "g-guard",
     "name": "命令不弹黑窗口",
     "what": "给上游打补丁，PowerShell 隐藏启动；上游修好后自动跳过",
     "how": "自动，每次重装时补",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:319",
     "screen": "remote-control-10"
    },
    {
     "id": "f-owner-ref",
     "group": "g-guard",
     "name": "无限制授权跟到电脑上",
     "what": "对话开无限制授权时会拿到一个配对编号，可随命令带到电脑，由密码中心核对；连接本身不算授权",
     "how": "自动，只在对话已配对时",
     "status": "说不准",
     "source": "owner_takeover.py:1-6；提交 d6feb470（9-25）",
     "screen": "remote-control-10"
    },
    {
     "id": "f-login",
     "group": "g-guard",
     "name": "自己的入口密码",
     "what": "主机、副机各一个入口密码，都存在密码中心；只认登记过的客户端",
     "how": "第一次连接时本人从密码中心复制、登录",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:95,210-212",
     "screen": "remote-control-10"
    },
    {
     "id": "f-boot",
     "group": "g-alive",
     "name": "没登录也能维护",
     "what": "开机就起 SYSTEM 服务，没登录也能跑维护命令；桌面操作要等登录",
     "how": "自动；重启后未登录的实测还没做",
     "status": "待验收",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:151-155,184,315",
     "screen": "remote-control-10"
    },
    {
     "id": "f-self-heal",
     "group": "g-alive",
     "name": "挂了自己拉起",
     "what": "每 10 秒探测，连续 3 次失败就重启；服务本身退出按 5、15、30 秒重启",
     "how": "自动",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:156-157；logs\\boot-service.log",
     "screen": "remote-control-10"
    },
    {
     "id": "f-keep-awake",
     "group": "g-alive",
     "name": "主机不睡",
     "what": "主机请求保持唤醒；笔记本不唤醒，睡着就连不上",
     "how": "自动",
     "status": "在用",
     "source": "registries 两份 keep_awake",
     "screen": "remote-control-10"
    },
    {
     "id": "f-tunnel",
     "group": "g-alive",
     "name": "隧道查和修",
     "what": "一条命令查隧道和公网通不通，修复登记过的服务",
     "how": "跟 AI 说查一下主机入口",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:88",
     "screen": "remote-control-10"
    },
    {
     "id": "f-public-heal",
     "group": "g-alive",
     "name": "副机公网自动恢复",
     "what": "每 3 分钟查，连续 3 次不通才恢复，至少隔 30 分钟、一天最多 3 次",
     "how": "自动；开始菜单“MCP 公网连接健康”能暂停",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\secondary-laptop-access\\README.md:195-205",
     "screen": "remote-control-10"
    },
    {
     "id": "f-upgrade",
     "group": "g-alive",
     "name": "每周检查升级",
     "what": "每周查 Windows-MCP 新版，测试通过自动升级，副机先、主机后；笔记本的每周巡检平时暂停",
     "how": "自动，挂在已有的每周治理里",
     "status": "说不准",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\weekly-governance.md",
     "screen": "remote-control-10"
    },
    {
     "id": "f-same-source",
     "group": "g-alive",
     "name": "两台同一份源码",
     "what": "两台用同一个提交，各自配置、登录凭据、部署和回退",
     "how": "跟 AI 说更新两台的远程服务",
     "status": "在用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:43,107-118",
     "screen": "remote-control-10"
    },
    {
     "id": "f-connect-page",
     "group": "g-web",
     "name": "连接电脑说明",
     "what": "三个地址、每台的验收记录、一键复制给 AI 的配置说明",
     "how": "打开网站的“连接电脑”",
     "status": "在用",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\content-mcp-access.js",
     "screen": "remote-control-11"
    },
    {
     "id": "f-phone-guide",
     "group": "g-web",
     "name": "手机接续说明",
     "what": "讲手机上的对话怎么借已连接的电脑接着办事",
     "how": "网站首页“手机用电脑”一段",
     "status": "说不准",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\system-home-content.js:357",
     "screen": "remote-control-11"
    },
    {
     "id": "f-status-page",
     "group": "g-web",
     "name": "主机状态",
     "what": "在线没、锁没锁屏、处理器显卡内存、每块盘、网速；连不上时提示怎么远程开机",
     "how": "打开“授权与状态”，前台每 60 秒读一次",
     "status": "待验收",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\computer-access.jsx:172；public_access.py:127-150",
     "screen": "remote-control-11"
    },
    {
     "id": "f-personal-grant",
     "group": "g-web",
     "name": "个人资料授权",
     "what": "输验证器里的 6 位动态码，办理、延长或结束资料解锁，0.5 到 72 小时",
     "how": "打开“授权与状态”办理",
     "status": "待验收",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\computer-access.jsx:270；public_access.py:158-168",
     "screen": "remote-control-11"
    },
    {
     "id": "f-unrestricted-grant",
     "group": "g-web",
     "name": "无限制授权",
     "what": "同一页办理、延长或结束全局无限制授权，和资料授权分别计时",
     "how": "打开“授权与状态”办理",
     "status": "待验收",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\computer-access.jsx:345",
     "screen": "remote-control-11"
    },
    {
     "id": "f-lock",
     "group": "g-web",
     "name": "锁资料、锁屏",
     "what": "一键锁住资料，或只锁 Windows 屏幕；锁屏不影响授权计时",
     "how": "打开“授权与状态”点按钮",
     "status": "待验收",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\computer-access.jsx:345；public_access.py:169-187",
     "screen": "remote-control-11"
    },
    {
     "id": "f-grafana-entry",
     "group": "g-web",
     "name": "监控入口",
     "what": "显示监控面板在不在线，点过去看电脑使用记录的图表",
     "how": "页头或授权页的 Grafana",
     "status": "待验收",
     "source": "V:\\Personal\\Projects\\wly0829.cn\\app\\page.jsx:308",
     "screen": "remote-control-11"
    },
    {
     "id": "f-codex-remote",
     "group": "g-retired",
     "name": "Codex 远程公网入口",
     "what": "手机网页看 Codex 任务；9 月 26 日决定撤掉",
     "how": "不再使用",
     "status": "已停用",
     "source": "E:\\.agents\\docs\\owner-decisions.md:126",
     "screen": "remote-control-11"
    },
    {
     "id": "f-browser-fill",
     "group": "g-retired",
     "name": "AI 浏览器代填入口密码",
     "what": "改由我自己从密码中心复制",
     "how": "不再使用",
     "status": "已停用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:212；提交 4e88d3b7（9-27 01:36）",
     "screen": "remote-control-11"
    },
    {
     "id": "f-old-funnel",
     "group": "g-retired",
     "name": "主机旧 Funnel 入口",
     "what": "改走 Cloudflare 后停用，只留作退回材料",
     "how": "不再使用",
     "status": "已停用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:74",
     "screen": "remote-control-11"
    },
    {
     "id": "f-old-plugin",
     "group": "g-retired",
     "name": "旧“电脑 MCP”单个连接",
     "what": "拆成“主机 MCP”“副机 MCP”两个",
     "how": "不再使用",
     "status": "已停用",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:76,194",
     "screen": "remote-control-11"
    }
   ],
   "numbers": [
    {
     "id": "n-computers",
     "text": "2 台",
     "meaning": "跑着远程服务的电脑：主机和副机",
     "as_of": "2026-09-28",
     "source": "registries\\remote_computer_mcp*.json 两份；主机 Status、副机 ComputerContext 实测",
     "screens": [
      "remote-control-01"
     ]
    },
    {
     "id": "n-tools",
     "text": "23 个",
     "meaning": "每台电脑开放的工具数（上游 20 + 自加 3）",
     "as_of": "2026-09-28",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:124,228；副机工具目录实测",
     "screens": [
      "remote-control-01",
      "remote-control-02",
      "remote-control-04",
      "remote-control-08"
     ]
    },
    {
     "id": "n-entries",
     "text": "3 个",
     "meaning": "入口：主机公网、副机、主机备用",
     "as_of": "2026-09-28",
     "source": "content-mcp-access.js；README.md:65-72",
     "screens": [
      "remote-control-01"
     ]
    },
    {
     "id": "n-calls",
     "text": "268 次",
     "meaning": "主机收到的工具调用，9 月 26 日 16:56 至 28 日 15:43（北京时间），日志轮换前的全部",
     "as_of": "2026-09-28",
     "source": "E:\\Data\\RemoteComputerMCP\\logs\\service*.log 中 rpc=tools/call 行去重计数",
     "screens": [
      "remote-control-01",
      "remote-control-02"
     ]
    },
    {
     "id": "n-call-split",
     "text": "跑命令 130 · 文件 65 · 开工核对 50 · 截图和读界面 11 · 其他 12",
     "meaning": "同一时段按工具分",
     "as_of": "2026-09-28",
     "source": "同上按 tool= 分组",
     "screens": [
      "remote-control-02"
     ]
    },
    {
     "id": "n-median",
     "text": "4.6 秒",
     "meaning": "同一时段单次调用耗时中位数（含执行）",
     "as_of": "2026-09-28",
     "source": "同上 elapsed_ms 中位数 4571；服务端计时，不含 ChatGPT 和网络往返",
     "screens": [
      "remote-control-02"
     ]
    },
    {
     "id": "n-code",
     "text": "10,747 行",
     "meaning": "tools/remote-computer-mcp 与 tools/secondary-laptop-access 程序行数（39 个 .py/.ps1），不含驾驶舱看板接口、硬件读数、Codex 体检回执 7 个文件 2,906 行",
     "as_of": "2026-09-28",
     "source": "按行计数，排除 test_ 开头文件和上述 7 个文件",
     "screens": [
      "remote-control-05"
     ]
    },
    {
     "id": "n-tests",
     "text": "7,508 行",
     "meaning": "同两处 45 个测试文件行数，不含看板和硬件读数的 5 个测试文件",
     "as_of": "2026-09-28",
     "source": "按行计数 test_ 开头文件",
     "screens": [
      "remote-control-05"
     ]
    },
    {
     "id": "n-commits",
     "text": "100 次",
     "meaning": "远程服务、副机部署和 4 份远程登记的提交，9 月 9 日至 28 日",
     "as_of": "2026-09-28",
     "source": "E:\\PCConfig git log 这些路径",
     "screens": [
      "remote-control-05"
     ]
    },
    {
     "id": "n-feature-count",
     "text": "44 项",
     "meaning": "全部功能条数",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "remote-control-09"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-host",
     "with": "pcconfig",
     "direction": "住在",
     "flow": "服务源码、登记、计划任务都在电脑配置与恢复仓库里；它的恢复顺序、自动任务总账把这套服务当成要重建的核心服务",
     "source": "registries\\scheduled_task_rebuild_plan.json（PCConfig Remote Computer MCP）"
    },
    {
     "id": "r-pcconfig-freeze",
     "with": "pcconfig",
     "direction": "顺带承载",
     "flow": "同一个服务里跑着“卡死自动留现场”（每 10 秒）和驾驶舱看板接口；两者的家在电脑配置与恢复",
     "source": "task_purpose_catalog.json mcp-service:freeze-capture；public_access.py:22,132"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "用它",
     "flow": "入口密码存在密码中心；网页授权的 6 位动态码交给密码中心核验；资料锁状态、无限制授权配对由密码中心的 SecretBroker 和本人接管入口给出",
     "source": "public_access.py:28-38；server.py:42；owner_takeover.py:18"
    },
    {
     "id": "r-agents-rules",
     "with": "agents",
     "direction": "拿来",
     "flow": "握手和 ComputerContext 调用规则基座的核验入口，拿当前生效规则的原文和版本",
     "source": "server.py:41,505-599"
    },
    {
     "id": "r-website",
     "with": "_website",
     "direction": "给出",
     "flow": "网站的“连接电脑”“授权与状态”页是它的操作界面；授权页经主机 /computer-access/api 读写",
     "source": "computer-access-model.js:1-3"
    },
    {
     "id": "r-timeaudit",
     "with": "timeaudit",
     "direction": "借路给",
     "flow": "电脑使用记录的 Grafana 图表走同一条 Cloudflare 隧道公开，授权页显示它在不在线",
     "source": "remote_computer_cloudflare_tunnel.json additional_public_services"
    },
    {
     "id": "r-daily-preferences",
     "with": "daily-preferences",
     "direction": "给出",
     "flow": "手机和云端 AI 经电脑连接用电脑上同一份个人理解库和命令入口",
     "source": "owner-decisions.md:980-990"
    },
    {
     "id": "r-streaming",
     "with": "sunshine-remote-streaming",
     "direction": "分工",
     "flow": "人用手机看画面、自己操作归串流；AI 调工具办事归这里；笔记本平时用 Moonlight 远控主机",
     "source": "副机 AGENTS.md 定位条"
    },
    {
     "id": "r-tailscale-skill",
     "with": "skill:tailscale-safe-exposure",
     "direction": "用它",
     "flow": "副机 Funnel 入口、两机私网中转这类 Tailscale 开放，按这个技能的最小开放和分层验收做",
     "source": "SKILL.md；secondary README:106,143"
    },
    {
     "id": "r-codex-remote",
     "with": "codex-local-remote",
     "direction": "取代",
     "flow": "Codex 远程公网入口 9 月 26 日撤掉（冻结项目）",
     "source": "owner-decisions.md:126"
    },
    {
     "id": "r-chatgpt",
     "with": "ext:chatgpt",
     "direction": "被调用",
     "flow": "ChatGPT“我的电脑”项目经 OAuth 调主机、副机工具",
     "source": "README.md:194"
    },
    {
     "id": "r-cloudflare",
     "with": "ext:cloudflare",
     "direction": "用它",
     "flow": "免费隧道把 mcp.wly0829.cn 接到主机本机端口",
     "source": "remote_computer_cloudflare_tunnel.json"
    },
    {
     "id": "r-tailscale",
     "with": "ext:tailscale",
     "direction": "用它",
     "flow": "副机 Funnel 公网入口、两机私网中转",
     "source": "remote_computer_mcp_relay.json"
    }
   ],
   "highlights": [
    {
     "id": "h-tunnel-drill",
     "title": "隧道断了，从笔记本绕进去把它修好",
     "screen": "remote-control-08"
    },
    {
     "id": "h-same-rules",
     "title": "手机上的 AI，守的也是同一套规矩",
     "screen": "remote-control-08"
    }
   ],
   "mentions": [
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "remote-control-01",
     "text": "远程电脑串流"
    },
    {
     "target": "/mcp/",
     "screen": "remote-control-01",
     "text": "连接电脑"
    },
    {
     "target": "/computer-access/",
     "screen": "remote-control-01",
     "text": "授权与状态"
    },
    {
     "target": "/computer-access/",
     "screen": "remote-control-02",
     "text": "授权与状态"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "remote-control-02",
     "text": "个人理解库"
    },
    {
     "target": "/rules/charter/",
     "screen": "remote-control-02",
     "text": "约法"
    },
    {
     "target": "/rules/authorization/",
     "screen": "remote-control-05",
     "text": "用户授权规则"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "remote-control-03",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "remote-control-07",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "remote-control-03",
     "text": "远程电脑串流"
    },
    {
     "target": "/projects/password-center/",
     "screen": "remote-control-04",
     "text": "密码中心"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "remote-control-05",
     "text": "个人资料规则"
    },
    {
     "target": "/rules/charter/#L14",
     "screen": "remote-control-05",
     "text": "L14"
    },
    {
     "target": "/mcp/",
     "screen": "remote-control-09",
     "text": "连接电脑"
    },
    {
     "target": "/computer-access/",
     "screen": "remote-control-11",
     "text": "授权与状态"
    },
    {
     "target": "/projects/codex-local-remote/",
     "screen": "remote-control-11",
     "text": "Codex 远程"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "这台电脑远程服务的自动任务现在正不正常：远程操作桌面（登录后启动）、远程维护（管理员）、远程维护（系统级）三项里最差的一项，填“运行正常／有任务没按时跑／上次运行失败／暂时读不到”",
     "source": "驾驶舱看板接口自动任务一栏 group=remote 中 id 为 \\PCConfig Remote Computer MCP、\\PCConfig Remote Computer MCP Maintenance Admin、\\PCConfig Remote Computer MCP Maintenance SYSTEM 的三行（public_dashboard.py）"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“锁定桌面”并进 f-lock（和“锁资料”同一块页面）。",
    "底稿“电脑连接”→ f-connect-page；“手机接续说明”→ f-phone-guide；“主机状态”→ f-status-page；“资料授权”→ f-personal-grant；“无限制授权”→ f-unrestricted-grant；“监控入口”→ f-grafana-entry。"
   ],
   "dropped": [
    "底稿（wly0829-cn.json）里网站本身的 12 项功能不上本页：系统场景、系统分工、自动协作说明、验证边界、项目目录、双层项目说明、站内搜索、项目内搜索、规则阅读、技能目录、续作说明、实践展示。本人定个人网站不写项目页，它们的家是第 2 批“这个网页是怎么做的”。",
    "卡死自动留现场、驾驶舱看板接口虽然跑在同一个服务里，家在电脑配置与恢复页，本页只在 relations 里记，不列功能。",
    "ToDesk 登录前守护、Windows 远程桌面只放行两台、借电脑上网三项是人远程或网络能力，家在电脑配置与恢复页，本页出事那屏只放一句入口。"
   ],
   "unsure": [
    "和电脑配置与恢复页的重复：Claude 已定家在本页，那边原第 7 屏和相关功能改成一句话链到这里。",
    "GitHub 按钮按 Claude 答复保留为“GitHub（网页部分）”；服务代码实际在私有 PCConfig，based_on 用的是 PCConfig 的提交，wly0829.cn 提交写在 facts.md。",
    "替本人口吻的句子：“超时和卡死怎么处理”一屏“我强制重启 5 分钟就好”；第 5 屏“这是我知道并决定保留的”（来自本人 C8“知道，保持”）；第 6 屏“我用 Moonlight 远控主机”。上线前请本人过目。",
    "268 次调用只覆盖日志还留着的 9 月 26 日 16:56 至 28 日 15:43；日志不记是 ChatGPT 还是笔记本 Codex 发起的，也不记命令本身成功没有（HTTP 全是 200）。",
    "“卡死时给急救做法”标说不准：9 月 27 日 23:20 才加上，之后真卡死时回复里有没有出现这句，没查到证据。",
    "网页上的授权与状态那 5 项沿用底稿的“待验收”（页面、前端和主机接口都在，没实际办理过）。本人是否已在手机上办理过，需要本人确认后改成“在用”。",
    "“每周检查升级”标说不准：主机挂在“三基座与 GitHub 持续治理”里，笔记本挂的每周巡检平时暂停；最近一次真正按这条流程升级的回执没找到。",
    "没有真实截图：仓库里授权页的图都标着“示例数据”“设计示意”，是设计稿，没放。若要放，建议第 2 批在真页面上截。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/remote-control/page.json",
  "sha256": "fc4f4b235b6bc56a0045859537081660322efab0f5d215cc1c123c5d76078e7c",
  "converted_at_beijing": "2026-10-10T06:53:38+08:00"
 }
}
---

::screen{#remote-control-01 section="top"}

```typeset
{
 "screen": {
  "id": "remote-control-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：中间一台台式机（机箱侧透、显示器亮着），右边一台笔记本，两台之间一条绿色虚线；左边一部手机，屏幕上是对话气泡，右上角画 ChatGPT 标志；笔记本屏幕角上画 Codex 标志，台式机显示器角上画 Claude 标志；台式机上方一朵云，云上画 Cloudflare 标志，云和台式机之间一条绿色丝带（隧道）；笔记本下方一个小网状图形，画 Tailscale 标志。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两台电脑、一个工具箱、三扇小门、一叠回执。数字卡下面一行三个白底描边按钮：〔在整套系统里的位置 → 怎么协作〕〔GitHub（网页部分）〕，右侧一行小字加两个绿色链接〔连接电脑〕〔授权与状态〕。再下面一行灰色小字（含〔远程电脑串流〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着一个留空的浅色圆角长框（约占横条宽度的 55%、高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；三个入口按钮各占一行；“操作入口”一行、灰色小字一行；最下面“现在”横条：上面“现在”和空框（占满宽度），下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#remote-control"
   },
   {
    "text": "GitHub（网页部分）",
    "href": "https://github.com/wlyaaaaa/wly0829.cn"
   },
   {
    "text": "连接电脑",
    "href": "/mcp/"
   },
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#remote-control"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/remote-control/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run"
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
     "text_ref": "大标题：电脑远程控制",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "section_heading",
     "text_ref": "截至10月10",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "12台主机（台式机）和副机（笔记本）各跑一套，同一份源码223个工具：文件、命令、文档、桌面、维护33个入口：主机公网、副机、经副机转到主机",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "介绍：手机或网页上的ChatGPT、笔记本上的Codex、主机上的Claude，都能连进我的两台电脑办事：读写文件、跑命令、读文档片段、截图",
     "row": "hero",
     "width": "55%",
     "row_valign": "center"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub（网页部分）复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "操作入口：连接电脑授权与状态"
    },
    {
     "type": "prose",
     "text_ref": "只想用手机看电脑画面、自己动手操作，是另一个项目：远程电脑串流"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-01",
    "component_order": [
     "chapter_title",
     "prose",
     "illustration",
     "stat_card",
     "action_button",
     "inline_link",
     "live_strip",
     "content_card",
     "icon",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "大标题：电脑远程控制",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "section_heading",
     "text_ref": "截至10月10",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "12台主机（台式机）和副机（笔记本）各跑一套，同一份源码223个工具：文件、命令、文档、桌面、维护33个入口：主机公网、副机、经副机转到主机",
     "columns": 2,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "介绍：手机或网页上的ChatGPT、笔记本上的Codex、主机上的Claude，都能连进我的两台电脑办事：读写文件、跑命令、读文档片段、截图"
    },
    {
     "type": "illustration"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub（网页部分）复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "操作入口：连接电脑授权与状态"
    },
    {
     "type": "prose",
     "text_ref": "只想用手机看电脑画面、自己动手操作，是另一个项目：远程电脑串流"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-01",
    "component_order": [
     "illustration",
     "stat_card",
     "prose",
     "action_button",
     "live_strip",
     "chapter_title",
     "inline_link",
     "content_card",
     "icon",
     "numbered_steps"
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "2 台｜主机（台式机）和副机（笔记本）各跑一套，同一份源码",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "23 个｜工具：文件、命令、文档、桌面、维护",
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "3 个｜入口：主机公网、副机、经副机转到主机的备用",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
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
   "source_phrase": "268 次｜主机收到的工具调用（9 月 26 日 16:56 至 28 日 15:43）",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "右上一幅水彩插画：中间一台台式机（机箱侧透、显示器亮着），右边一台笔记本，两台之间一条绿色虚线；左边一部手机，屏幕上是对话气泡，右上角画 ChatGPT 标志；笔记本屏幕角上画 Codex 标志，台式机显示器角上画 Claude 标志；台式机上方一朵云，云上画 Cloudflare 标志，云和台式机之间一条绿色丝带（隧道）；笔记本下方一个小网状图形，画 Tailscale 标志。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready",
   "original_elements": [
    "中间一台台式机（机箱侧透、显示器亮着"
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
   "asset": "_library/round3/titles/title-r3-4ffbcdc5180e90a996a7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-4ffbcdc5180e90a996a7",
   "title_text": "电脑远程控制",
   "sha256": "436a053b59bc992374eddc1ae93cf509be31c5b2a536cd3c0a448300475a7cf2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：电脑远程控制

介绍：手机或网页上的 ChatGPT、笔记本上的 Codex、主机上的 Claude，都能连进我的两台电脑办事：读写文件、跑命令、读文档片段、截图点鼠标，必要时用管理员或 SYSTEM（Windows 最高的系统身份）做维护。每次先登录、先拿到规则；我的资料锁着时，不碰私人资料。

数字卡片（截至 10 月 10 日）：
1. **2 台**｜主机（台式机）和副机（笔记本）各跑一套，同一份源码
2. **23 个**｜工具：文件、命令、文档、桌面、维护
3. **3 个**｜入口：主机公网、副机、经副机转到主机的备用
4. **163 次**｜主机收到的工具调用（10 月 8 日 07:09 至 9 日 01:25）

〔在整套系统里的位置 → 怎么协作〕　〔GitHub（网页部分）〕　〔复制 AI 续作说明〕

操作入口：〔连接电脑〕　〔授权与状态〕

只想用手机看电脑画面、自己动手操作，是另一个项目：〔远程电脑串流〕

现在　〔现在正不正常 → 驾驶舱〕

::screen{#remote-control-02 section="usage"}

```typeset
{
 "screen": {
  "id": "remote-control-02",
  "section": "usage",
  "title": "怎么用",
  "scene": "横版：左上标题。上半部分三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一只手拿着手机，远处一座房子里的台式机亮着；2 台式机和笔记本面对面，中间一把小扳手来回传；3 一把绿色小锁，手机屏幕上六个数字格子。卡片标题粗体，下面正文。下半部分左边一条横向卡片“它能碰什么”，六个带小图标的词排成一行；右边一张小数据卡“最近真用了多少”，里面画一个横向堆叠条（五段深浅绿，长度按 130、65、50、11、12 的比例），条下写图例文字。",
  "portrait": "竖版：标题在上；三张场景卡一行一张；“它能碰什么”六个词两行三个；数据卡在最下，堆叠条占满宽度。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/"
   },
   {
    "text": "约法",
    "href": "/rules/charter/"
   },
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "23 个工具全部列在“全部功能”",
    "href": "/projects/remote-control/#features"
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
     "text_ref": "标题：怎么用",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "1人在外面，让家里的电脑干活",
     "whole_block": true,
     "columns": 1,
     "row": "scenarios",
     "width": "33.333%",
     "row_card_notes": true,
     "row_equal_height": true,
     "row_note_from": "问到和我本人有关的事"
    },
    {
     "type": "source_text_card",
     "text_ref": "2两台电脑互相修",
     "whole_block": true,
     "columns": 1,
     "row": "scenarios",
     "width": "33.333%",
     "row_card_notes": true,
     "row_equal_height": true,
     "row_note_from": "笔记本上那份",
     "row_note_row": 3
    },
    {
     "type": "source_text_card",
     "text_ref": "3资料锁着时，手机上解开",
     "whole_block": true,
     "columns": 1,
     "row": "scenarios",
     "width": "33.333%",
     "row_card_notes": true,
     "row_equal_height": true
    },
    {
     "type": "notice",
     "text_ref": "它能碰什么：文件·命令和脚本·文档片段·桌面（截图、点、打字）·我的Chrome·管理员和SYSTEM维护23个工具全部列在“全部功能”",
     "width": "100%"
    },
    {
     "type": "chart",
     "text_ref": "最近真用了多少：10月8日07:09至9日01:25，主机收到163次工具调用（",
     "variant": "stacked",
     "width": "100%",
     "chart_type": "stacked",
     "labels_layout": "rows"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原文堆叠条图无已实现chart_type，保全原文，比例条图未完成。\n页修复10：它能碰什么与用量图上下满宽；图例显式按rows逐项一行。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-02",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "stat_card",
     "prose",
     "chart",
     "status_legend",
     "inline_link",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：怎么用",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "1人在外面，让家里的电脑干活",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "2两台电脑互相修",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "3资料锁着时，手机上解开",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "notice",
     "text_ref": "它能碰什么：文件·命令和脚本·文档片段·桌面（截图、点、打字）·我的Chrome·管理员和SYSTEM维护23个工具全部列在“全部功能”"
    },
    {
     "type": "chart",
     "text_ref": "最近真用了多少：10月8日07:09至9日01:25，主机收到163次工具调用（",
     "variant": "stacked",
     "chart_type": "stacked",
     "labels_layout": "rows"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原文堆叠条图无已实现chart_type，保全原文，比例条图未完成。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-02",
    "component_order": [
     "chart",
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "stat_card",
     "prose",
     "status_legend",
     "inline_link",
     "numbered_steps"
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "人在外面，让家里的电脑干活",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "上半部分三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一只手拿着手机，远处一座房子里的台式机亮着；2 台式机和笔记本面对面，中间一把小扳手来回传；3 一把绿色小锁，手机屏幕上六个数字格子。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready",
   "original_elements": [
    "一只手拿着手机，远处一座房子里的台式机亮着"
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
   "asset": "_library/illustrations/电脑远程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑远程",
   "source_phrase": "上半部分三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一只手拿着手机，远处一座房子里的台式机亮着；2 台式机和笔记本面对面，中间一把小扳手来回传；3 一把绿色小锁，手机屏幕上六个数字格子。",
   "sha256": "3562cf4060ee36240ac08e8255aab66764cf19b17484987d2137b4d3a1dc64c5",
   "status": "ready",
   "original_elements": [
    "台式机和笔记本面对面，中间一把小扳手来回传"
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
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机验证现图小槽4比3",
   "source_phrase": "上半部分三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一只手拿着手机，远处一座房子里的台式机亮着；2 台式机和笔记本面对面，中间一把小扳手来回传；3 一把绿色小锁，手机屏幕上六个数字格子。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一把绿色小锁，手机屏幕上六个数字格子"
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
   "asset": "_library/round3/titles/title-r3-9fe7ee9705091075f9a6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9fe7ee9705091075f9a6",
   "title_text": "怎么用",
   "sha256": "c038ec3c038c442742b47f8ba4768302d518cc4ff2e1c7bab1e1aa7b318f70f6",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：怎么用

1. **人在外面，让家里的电脑干活**
在手机 ChatGPT 的“我的电脑”项目里直接说，比如“找到电脑上那份方案，读第二节，改好存回去”。ChatGPT 负责想，主机负责做：找文件、读片段、改、再读回核对。问到和我本人有关的事，它经主机读电脑上那份〔个人理解库〕（记着我的背景和偏好），手机上不另存一份。

2. **两台电脑互相修**
笔记本上的 Codex 连主机，主机上的 Codex 和 Claude 连笔记本。能用管理员或 SYSTEM 身份跑维护命令，所以一台的服务停了，可以从另一台把它启动。笔记本上那份〔约法〕（我给所有 AI 定的总规矩），也是需要时经这条连接从主机取过去的。

3. **资料锁着时，手机上解开**
AI 要用我的私人资料、资料又锁着，它会停下来，给出〔授权与状态〕的地址。我在手机上打开，输验证器里的 6 位动态码；解开后回到对话，AI 重新读一次状态再接着做。

**它能碰什么**：文件 · 命令和脚本 · 文档片段 · 桌面（截图、点、打字）· 我的 Chrome · 管理员和 SYSTEM 维护　〔23 个工具全部列在“全部功能”〕

**最近真用了多少**：10 月 8 日 07:09 至 9 日 01:25，主机收到 163 次工具调用（日志只留最近两天）
维护命令 53 · 普通命令 32 · 截图和读界面 39 · 开工核对 25（每次开工先查是哪台电脑、哪版规则、资料锁开没开）· 其他 14
主机处理一次调用（含执行），一半在 2.4 秒内

::screen{#remote-control-03 section="usage"}

```typeset
{
 "screen": {
  "id": "remote-control-03",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断掉的云朵丝带、自己转圈的箭头、沙漏上一个问号、冒汗的电脑、没亮的登录界面、拔掉的插头），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
  "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
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
     "text_ref": "标题：出事怎么办",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1主机入口连不上先确认是主机通往公网的那条通道（Cloudflare隧道）断了，再把连接改成备用入口（经笔记本转到主机的那个地址），第一次要",
     "columns": 2,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "direction": "horizontal"
    },
    {
     "type": "notice",
     "text_ref": "不归它管：用手机看画面、自己动手操作见远程电脑串流；Windows远程桌面、ToDesk守护、手机借电脑上网见电脑配置与恢复。",
     "tone": "gray"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-03",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "notice",
     "inline_link",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：出事怎么办",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1主机入口连不上先确认是主机通往公网的那条通道（Cloudflare隧道）断了，再把连接改成备用入口（经笔记本转到主机的那个地址），第一次要",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "direction": "vertical"
    },
    {
     "type": "notice",
     "text_ref": "不归它管：用手机看画面、自己动手操作见远程电脑串流；Windows远程桌面、ToDesk守护、手机借电脑上网见电脑配置与恢复。",
     "tone": "gray"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-03",
    "component_order": [
     "content_card",
     "chapter_title",
     "icon",
     "notice",
     "inline_link",
     "numbered_steps"
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "断掉的云朵丝带",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "自己转圈的箭头",
   "sha256": "4c8b24f4690ddc583ca222e8084661258efa002ca92ca8c824c85bda3e179954",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "沙漏上一个问号",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "冒汗的电脑",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "没亮的登录界面",
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
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "拔掉的插头",
   "sha256": "9f19b0993d47ecb67a994c3988d36efb98a1b9dca540cacc914abb5755b33ebe",
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
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：出事怎么办

1. **主机入口连不上**｜先确认是主机通往公网的那条通道（Cloudflare 隧道）断了，再把连接改成备用入口（经笔记本转到主机的那个地址），第一次要单独登录。备用只负责转过去，不会替你重做刚才中断的操作。
2. **笔记本的公网入口掉了**｜不用管，它会定时自查、自己恢复，次数有上限，不会来回折腾（参数见“全部功能”第 31 项）。
3. **命令超时了**｜AI 不会自动重交，先查那一步到底做没做；为什么这样，见本页“超时和卡死怎么处理”。
4. **电脑卡住了**｜照现行急救卡：先保存能保存的，约 2 分钟还不好就正常重启，不必先按蓝屏键；自动现场是否写完要看回执。服务的急救提示还没在真实卡死时验过。怎么判卡死见“超时和卡死怎么处理”，急救卡在〔电脑配置与恢复〕。
5. **电脑开着但没登录**｜设计上维护命令照样能跑，截图、点击要等我登录；重启后还没登录的情况尚未实测。
6. **关机、睡着或断网**｜连不上。先用 ToDesk、网易 UU 或小米智能插座把电脑开起来、连上网，再回来重试；别因为连不上就反复断电。

**不归它管**：用手机看画面、自己动手操作见〔远程电脑串流〕；Windows 远程桌面、ToDesk 守护、手机借电脑上网见〔电脑配置与恢复〕。

::screen{#remote-control-04 section="tech"}

```typeset
{
 "screen": {
  "id": "remote-control-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题。一张从左到右的流程图：最左一列三张小卡（手机画 ChatGPT 标志、笔记本画 Codex 标志、台式机画 Claude 和 Codex 标志）；中间三条并排的绿色路线，每条路线上一个小图标（Cloudflare 云、Tailscale 网、一个弯折的中转箭头）和一两行字；最右一幅台式机剖面插画，分成上下两层：上层“门口”画一扇带锁的门和一张规则小卷轴，下层“屋里”画桌面、文件夹和键盘，两层之间一根细管子（命名管道）。流程图下面一条细长卡片写底座和模型。",
  "portrait": "竖版：流程图改成从上往下：三张发起方卡一行一张 → 三条路线一行一条 → 电脑两层上下排；底座和模型卡片在最下。",
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
     "text_ref": "标题：它是怎么搭的",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "topology",
     "text_ref": "谁发起：手机或网页上的ChatGPT笔记本上的Codex主机上的Claude、Codex",
     "layout": "chain",
     "connector": "none",
     "width": "100%"
    },
    {
     "type": "section_heading",
     "text_ref": "三条路",
     "width": "100%",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1主机公网入口：Cloudflare免费隧道，电脑只往外连，不开端口，没买服务器2副机入口：笔记本用TailscaleFunnel（把本机服",
     "columns": 1,
     "direction": "horizontal",
     "connector": "none",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云.png",
      "_library/icons/绿叶装饰.png",
      "_library/icons/笔记本电脑.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "电脑里分两层",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "notice",
     "text_ref": "底座和模型：23个工具里20个来自开源的Windows-MCP0.8.7（Python、FastMCP），我在外面加了开工核对、读文档片段、"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：谁发起移到三条路上方满宽，三条路标题独立一行，路径与电脑两层保留60/40并排。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-04",
    "component_order": [
     "chapter_title",
     "flow",
     "content_card",
     "icon",
     "topology",
     "illustration",
     "notice",
     "bullet_list",
     "inline_link",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：它是怎么搭的",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "topology",
     "text_ref": "谁发起：手机或网页上的ChatGPT笔记本上的Codex主机上的Claude、Codex",
     "layout": "chain",
     "connector": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "三条路",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1主机公网入口：Cloudflare免费隧道，电脑只往外连，不开端口，没买服务器2副机入口：笔记本用TailscaleFunnel（把本机服",
     "columns": 1,
     "direction": "vertical",
     "connector": "none",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云.png",
      "_library/icons/绿叶装饰.png",
      "_library/icons/笔记本电脑.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "电脑里分两层",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "notice",
     "text_ref": "底座和模型：23个工具里20个来自开源的Windows-MCP0.8.7（Python、FastMCP），我在外面加了开工核对、读文档片段、"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-04",
    "component_order": [
     "flow",
     "content_card",
     "chapter_title",
     "icon",
     "topology",
     "illustration",
     "notice",
     "bullet_list",
     "inline_link",
     "numbered_steps"
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "Cloudflare 云",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
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
   "source_phrase": "Tailscale 网",
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "笔记本电脑",
   "source_phrase": "主机备用入口：副机地址下的 /main-computer，经两台电脑的 Tailscale 私网转到主机；和副机入口共用同一个公网域名，所以不算完全独立的第二条路",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：它是怎么搭的

**谁发起**：手机或网页上的 ChatGPT ｜ 笔记本上的 Codex ｜ 主机上的 Claude、Codex

**三条路**
1. 主机公网入口：Cloudflare 免费隧道，电脑只往外连，不开端口，没买服务器
2. 副机入口：笔记本用 Tailscale Funnel（把本机服务放到公网的功能）开出自己的地址
3. 主机备用入口：挂在副机地址下，经两台电脑的 Tailscale 私网转到主机；和副机入口共用同一个公网域名，所以不算完全独立的第二条路

**电脑里分两层**
- **门口**：开机就启动的 SYSTEM 服务。核对登录（OAuth，入口密码存在〔密码中心〕），附上规则（见亮点 2），跑管理员和 SYSTEM 维护。
- **屋里**：我登录后启动的桌面进程，用我的账户读写文件、跑命令、截图点鼠标；门口经本机的命名管道把活递进来。

**底座和模型**：23 个工具里 20 个来自开源的 Windows-MCP 0.8.7（Python、FastMCP），我在外面加了开工核对、读文档片段、维护三个工具，以及规则、资料锁、回收站、超时和卡死保护。服务本身不带模型：怎么想由发起的一方（ChatGPT、Codex、Claude）决定，电脑只负责照做、回报结果。

::screen{#remote-control-05 section="tech"}

```typeset
{
 "screen": {
  "id": "remote-control-05",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标＋粗体一句＋一两行小字）；右边约三分之一宽，竖着三张大数字卡。",
  "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。",
  "links": [
   {
    "text": "个人资料规则",
    "href": "/rules/privacy-data/",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "用户授权规则",
    "href": "/rules/authorization/",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "L14",
    "href": "/rules/charter/#L14",
    "orientations": [
     "v"
    ],
    "locator_instances": {
     "v": {
      "input_sha256": "1487a6de01bbfd55eeb5b6a2307a32c39206d4dbc93d6d2e25cf62a7f3e20896",
      "instances": [
       {
        "context_text": "不另加审批层（约法L14）。",
        "context_rect": [
         62,
         2242,
         580,
         2286
        ],
        "expected_rect": [
         430,
         2251,
         528,
         2281
        ],
        "underline_rect": [
         430,
         2290,
         528,
         2293
        ],
        "confirm_region": true
       }
      ]
     }
    }
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
     "text_ref": "标题：为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1想在对话里，做在电脑上。推理留在我正在用的对话里，不为一条命令在电脑上另起一个AI任务。2门口和屋里分开。认证和维护放在SYSTEM服务里",
     "columns": 2,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "main",
     "width": "67%",
     "direction": "horizontal"
    },
    {
     "type": "section_heading",
     "text_ref": "大数字卡：",
     "row": "main",
     "width": "33%",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "约1.2万行程序（Python、PowerShell，远程服务和副机部署，不含同住一处的驾驶舱看板接口）",
     "columns": 1,
     "columns_v": 1,
     "row": "main",
     "icons": "none"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-05",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "stat_card",
     "inline_link",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "1想在对话里，做在电脑上。推理留在我正在用的对话里，不为一条命令在电脑上另起一个AI任务。2门口和屋里分开。认证和维护放在SYSTEM服务里",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "direction": "vertical"
    },
    {
     "type": "section_heading",
     "text_ref": "大数字卡：",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "约1.2万行程序（Python、PowerShell，远程服务和副机部署，不含同住一处的驾驶舱看板接口）",
     "columns": 1,
     "columns_v": 1,
     "icons": "none"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-05",
    "component_order": [
     "content_card",
     "stat_card",
     "chapter_title",
     "icon",
     "inline_link",
     "numbered_steps"
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
   "source_phrase": "想在对话里，做在电脑上。｜推理留在我正在用的对话里，不为一条命令在电脑上另起一个 AI 任务。",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "门口和屋里分开。｜认证和维护放在 SYSTEM 服务里，桌面操作只在我登录的会话里做，不拿最高权限代替我的账户。",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
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
   "source_phrase": "规则只存一处。｜手机那边不存规则副本，由电脑在连接时发过去；核验失败就明说，不拿旧规则凑数。",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "连上电脑不等于解锁资料。｜资料只有一份解锁状态，本机、网页、手机共用；登录电脑只证明能连，不算我本人同意。电脑上的 Codex、Claude 做一些重大的事可以免验证，经这个连接进来的 AI 没有这个待遇。见〔个人资料规则〕〔用户授权规则〕",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "超时不重来。｜写操作重来一次可能做两遍，所以只查原结果（见“超时和卡死怎么处理”）。",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "入口放公网，靠登录挡人。｜人在外面就得能从公网进来：这是我知道并决定保留的。只认登记过的客户端，不开放自动注册；不另加审批层（约法〔L14〕）。",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
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

标题：为什么这样设计

1. **想在对话里，做在电脑上。**｜推理留在我正在用的对话里，不为一条命令在电脑上另起一个 AI 任务。
2. **门口和屋里分开。**｜认证和维护放在 SYSTEM 服务里，桌面操作只在我登录的会话里做，不拿最高权限代替我的账户。
3. **规则只存一处。**｜手机那边不存规则副本，连接时由电脑发当前规则；已有完整规则的本机客户端只收入口。核验失败会明说，不拿旧版凑数。
4. **连上电脑不等于解锁资料。**｜资料只有一份解锁状态，本机、网页、手机共用；登录电脑只证明能连，不算我本人同意。电脑上的 Codex、Claude 做一些重大的事可以免验证，经这个连接进来的 AI 没有这个待遇。见〔个人资料规则〕〔用户授权规则〕
5. **超时不重来。**｜写操作重来一次可能做两遍，所以只查原结果（见“超时和卡死怎么处理”）。
6. **入口放公网，靠登录挡人。**｜人在外面就得能从公网进来：这是我知道并决定保留的。只认登记过的客户端，不开放自动注册；不另加审批层（约法〔L14〕）。

大数字卡：
**约 1.2 万行**｜程序（Python、PowerShell，远程服务和副机部署，不含同住一处的驾驶舱看板接口）
**8,693 行**｜自动测试，47 个测试文件
**190 次**｜提交（9 月 9 日至 10 月 9 日，同样两处加 4 份远程登记）

::screen{#remote-control-06 section="tech"}

```typeset
{
 "screen": {
  "id": "remote-control-06",
  "section": "tech",
  "title": "两台电脑对照",
  "scene": "横版：左上标题。整屏一张水彩边框的对照表，三列：左列项目名（小图标＋粗体），中列主机（表头画一台台式机），右列副机（表头画一台笔记本）。表格下面一行小字。",
  "portrait": "竖版：表格改成一行一条卡片；每条保留主机和副机的完整内容。",
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
     "text_ref": "标题：两台电脑对照",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "主机（台式机）副机（笔记本）地址自己的公网域名；备用入口挂在副机的地址下Tailscale分给笔记本的公网地址公网怎么进Cloudflare"
    },
    {
     "type": "prose",
     "text_ref": "两台用同一个提交的源码，配置、登录凭据、部署和回退各管各的，不互相复制。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-06",
    "component_order": [
     "chapter_title",
     "table",
     "icon",
     "prose"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：两台电脑对照",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "主机（台式机）副机（笔记本）地址自己的公网域名；备用入口挂在副机的地址下Tailscale分给笔记本的公网地址公网怎么进Cloudflare"
    },
    {
     "type": "prose",
     "text_ref": "两台用同一个提交的源码，配置、登录凭据、部署和回退各管各的，不互相复制。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-06",
    "component_order": [
     "table",
     "chapter_title",
     "icon",
     "prose"
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "｜主机（台式机 WLY）｜副机（笔记本 LAPTOP-E48N0DRJ）",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-0f9aae02a3f315c1a7f5.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-0f9aae02a3f315c1a7f5",
   "title_text": "两台电脑对照",
   "sha256": "5964f11e9efc69e21f06d3cff7543f1908e6e02a8a3f16c72441b01ad3f96376",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：两台电脑对照

| | 主机（台式机） | 副机（笔记本） |
|---|---|---|
| 地址 | 自己的公网域名；备用入口挂在副机的地址下 | Tailscale 分给笔记本的公网地址 |
| 公网怎么进 | Cloudflare 隧道 | Tailscale Funnel |
| 谁能连 | ChatGPT、笔记本上的 Codex | ChatGPT、主机上的 Codex 和 Claude |
| 规则从哪来 | 每次连接现场核验主机当前生效的版本 | 自己的一份规则文件，约法那段需要时从主机同步，可能暂时落后 |
| 会不会睡 | 请求保持唤醒 | 不唤醒，睡着就连不上 |
| 没登录时 | 设计上维护能用、桌面不能用；重启后未登录还没实测 | 同左 |
| 平时干什么 | 我的工作环境和算力 | 我用 Moonlight 远控主机；主机坏了时，它自己能上网、让 Codex 干活 |
| 入口密码 | 一个，存在密码中心；走备用入口也用它 | 另一个，也存在密码中心 |

两台用同一个提交的源码，配置、登录凭据、部署和回退各管各的，不互相复制。

::screen{#remote-control-07 section="tech"}

```typeset
{
 "screen": {
  "id": "remote-control-07",
  "section": "tech",
  "title": "超时和卡死怎么处理",
  "scene": "横版：左上标题。标题下一条浅米色细长卡片写“起因”。下面左边约三分之一宽一幅水彩插画：一个沙漏，旁边一张写着“重启”的小便签，便签边上画右 Ctrl 和 Scroll Lock 两个键帽。右边约三分之二宽，两张横向大卡片上下排，每张左上角一个状态圆点（第一张绿色，第二张浅灰色），粗体标题加一段正文。",
  "portrait": "竖版：标题在上；“起因”卡片；插画缩小居中；两张大卡片一行一张。",
  "links": [
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
     "text_ref": "标题：超时和卡死怎么处理",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "notice",
     "text_ref": "起因：9月27日晚ChatGPT和Claude一起卡死，通过电脑连接排查了50分钟没解决，我强制重启5分钟就好；当时命令到点也不返回，AI也"
    },
    {
     "type": "illustration",
     "row": "main",
     "width": "33%"
    },
    {
     "type": "source_text_card",
     "text_ref": "●每次调用有硬截止（在用）",
     "whole_block": true,
     "columns": 1,
     "row": "main",
     "width": "67%"
    },
    {
     "type": "source_text_card",
     "text_ref": "●确认卡死时直接给急救做法（还没在真实使用里验过）",
     "whole_block": true,
     "columns": 1,
     "row": "main"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-07",
    "component_order": [
     "chapter_title",
     "notice",
     "content_card",
     "illustration",
     "status_legend",
     "prose",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：超时和卡死怎么处理",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "notice",
     "text_ref": "起因：9月27日晚ChatGPT和Claude一起卡死，通过电脑连接排查了50分钟没解决，我强制重启5分钟就好；当时命令到点也不返回，AI也"
    },
    {
     "type": "illustration"
    },
    {
     "type": "source_text_card",
     "text_ref": "●每次调用有硬截止（在用）",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "●确认卡死时直接给急救做法（还没在真实使用里验过）",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-07",
    "component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "notice",
     "status_legend",
     "prose",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/illustrations/沙漏便签.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏便签",
   "source_phrase": "下面左边约三分之一宽一幅水彩插画：一个沙漏，旁边一张写着“重启”的小便签，便签边上画右 Ctrl 和 Scroll Lock 两个键帽。",
   "sha256": "0f6cdf6f9a505591f7463d9595fac8ab8ea5f4be6eb191919930eb231f85fdf2",
   "status": "ready",
   "original_elements": [
    "一个沙漏，旁边一张画抽象短线的的小便签，便签边上画右 Ctrl 和 Scroll Lock 两个键帽"
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
   "asset": "_library/round3/titles/title-r3-5f7ec2ac822a1c2292a0.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-5f7ec2ac822a1c2292a0",
   "title_text": "超时和卡死怎么处理",
   "sha256": "a3914ca470d884156615b45600f91d5a5ebf116a88639ef94ff38b219631d3ff",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：超时和卡死怎么处理

**起因**：9 月 27 日晚 ChatGPT 和 Claude 一起卡死，通过电脑连接排查了 50 分钟没解决，我强制重启 5 分钟就好；当时命令到点也不返回，AI 也没提醒我可以按键留现场。当晚（23:20）就改成下面两条。

● **每次调用有硬截止（在用）**
超时只说“结果未知，不要自动重复提交”，因为写操作重交可能做两遍；长的维护命令先给一个请求编号，之后凭编号取原结果。卡住的调用占着自己的位置，最多占 4 个，重复请求不会越堆越多。

● **确认卡死时直接给急救做法（还没在真实使用里验过）**
单次超时不算卡死。只有另一路独立检查也确认电脑卡在“启动新程序”这一步，才判定卡死，现行急救做法是“先保存，约 2 分钟还不好就正常重启”；按键蓝屏只作备用。不过服务自己回给 AI 的那句提示还是旧写法：建议直接重启，或按键留现场后重启；和急救卡对不上，待改。截至 10 月 10 日，日志里仍没找到这句提示出现过的记录；日志不记回复内容，所以只能说没找到。急救卡在〔电脑配置与恢复〕。

::screen{#remote-control-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "remote-control-08",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和照片视频录音管理页的“亮点”一样：两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一条断开的云朵丝带，旁边笔记本伸出一条绿色小路绕到台式机，台式机上一把扳手；2 手机和笔记本各举着一张同样的卷轴（规则），卷轴上印着同一个小印章。",
  "portrait": "竖版：两张卡片上下排，一行一张，插画在每张卡片顶部。",
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
     "type": "source_text_card",
     "text_ref": "1隧道断了，从笔记本绕进去把它修好。",
     "whole_block": true,
     "columns": 1,
     "row": "features",
     "width": "50%"
    },
    {
     "type": "source_text_card",
     "text_ref": "2手机上的AI，守的也是同一套规矩。",
     "whole_block": true,
     "columns": 1,
     "row": "features",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-08",
    "component_order": [
     "content_card",
     "illustration",
     "prose",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "source_text_card",
     "text_ref": "1隧道断了，从笔记本绕进去把它修好。",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "2手机上的AI，守的也是同一套规矩。",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-08",
    "component_order": [
     "content_card",
     "illustration",
     "prose",
     "numbered_steps"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/illustrations/电脑远程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑远程",
   "source_phrase": "插画：1 一条断开的云朵丝带，旁边笔记本伸出一条绿色小路绕到台式机，台式机上一把扳手；2 手机和笔记本各举着一张同样的卷轴（规则），卷轴上印着同一个小印章。",
   "sha256": "3562cf4060ee36240ac08e8255aab66764cf19b17484987d2137b4d3a1dc64c5",
   "status": "ready",
   "original_elements": [
    "一条断开的云朵丝带，旁边笔记本伸出一条绿色小路绕到台式机，台式机上一把扳手"
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
   "asset": "_library/illustrations/ill-60021c4b952086.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-60021c4b952086",
   "source_phrase": "插画：1 一条断开的云朵丝带，旁边笔记本伸出一条绿色小路绕到台式机，台式机上一把扳手；2 手机和笔记本各举着一张同样的卷轴（规则），卷轴上印着同一个小印章。",
   "sha256": "2c64edbf15f5db02940844a6405ee4b9915ad75d5461ef758fb520330e4db662",
   "status": "ready",
   "original_elements": [
    "手机和笔记本各举着一张同样的卷轴（规则），卷轴上印着同一个小印章"
   ],
   "hidden": false
  }
 ]
}
```

1. **隧道断了，从笔记本绕进去把它修好。**
9 月 11 日 16:28 故意停掉主机的 Cloudflare 隧道，主入口立刻打不开（Cloudflare 报隧道错误）。改走笔记本那边的备用入口：23 个工具都在，连着三次命令都回报“这是主机、隧道已停”，每次约 3 秒。17:44 又试了一次：从笔记本的入口进去，先用管理员身份确认隧道停着，再用 SYSTEM 身份把它启动，主入口恢复。两次用的都是测试用的连接程序，不是 ChatGPT。

2. **手机上的 AI，守的也是同一套规矩。**
主机的规则只存在电脑上：每次连接，主机核验当前版本，给手机等客户端附上规则原文；本机已有完整规则的客户端只收短入口，手机上不存副本。笔记本用自己的一份规则文件，约法那段需要时从主机同步，不是自动的，所以可能暂时落后；9 月 28 日 19:47 核对时，它和主机是同一版。

::screen{#remote-control-09 section="features"}

```typeset
{
 "screen": {
  "id": "remote-control-09",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
  "links": [
   {
    "text": "连接电脑",
    "href": "/mcp/"
   }
  ],
  "anchors": [
   {
    "id": "g-entry",
    "text": "连接入口"
   },
   {
    "id": "f-main-entry",
    "text": "主机公网入口"
   },
   {
    "id": "f-secondary-entry",
    "text": "副机入口"
   },
   {
    "id": "f-fallback-entry",
    "text": "主机备用入口"
   },
   {
    "id": "f-chatgpt",
    "text": "ChatGPT 两个连接"
   },
   {
    "id": "f-codex-peer",
    "text": "两台 Codex 互连"
   },
   {
    "id": "f-claude-peer",
    "text": "主机 Claude 连副机"
   },
   {
    "id": "f-other-client",
    "text": "别的账号和客户端"
   },
   {
    "id": "f-warm-client",
    "text": "副机备用连接保温"
   },
   {
    "id": "g-tools",
    "text": "能办的事"
   },
   {
    "id": "f-files",
    "text": "文件"
   },
   {
    "id": "f-shell",
    "text": "命令和脚本"
   },
   {
    "id": "f-docs",
    "text": "读文档片段"
   },
   {
    "id": "f-long-edit",
    "text": "大文件局部修改"
   },
   {
    "id": "f-desktop",
    "text": "桌面操作"
   },
   {
    "id": "f-chrome",
    "text": "操作我的 Chrome"
   },
   {
    "id": "f-forms",
    "text": "填表和上传"
   },
   {
    "id": "f-system",
    "text": "系统小工具"
   },
   {
    "id": "f-maintenance",
    "text": "管理员和 SYSTEM 维护"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "rc-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：全部功能（44项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "section_heading",
     "text_ref": "连接入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1主机公网入口经Cloudflare免费隧道进主机，电脑不开端口；要登录在用2副机入口笔记本用TailscaleFunnel开出自己的地址，",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "能办的事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9文件读、写、找、列目录、复制、移动在用10命令和脚本用PowerShell7跑命令、Python、Node、Git和现成管理脚本，拿回输出",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "“别的账号和客户端”怎么配，见连接电脑"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-09",
    "component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：全部功能（44项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "section_heading",
     "text_ref": "连接入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1主机公网入口经Cloudflare免费隧道进主机，电脑不开端口；要登录在用2副机入口笔记本用TailscaleFunnel开出自己的地址，",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "能办的事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9文件读、写、找、列目录、复制、移动在用10命令和脚本用PowerShell7跑命令、Python、Node、Git和现成管理脚本，拿回输出",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "“别的账号和客户端”怎么配，见连接电脑"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-09",
    "component_order": [
     "section_heading",
     "status_legend",
     "chapter_title",
     "feature_card",
     "icon",
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "主机公网入口｜mcp.wly0829.cn 经 Cloudflare 免费隧道进主机，电脑不开端口；要登录｜在用",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "副机入口｜笔记本用 Tailscale Funnel 开出自己的地址，单独登录｜在用",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "主机备用入口｜隧道断了，改连副机域名下的 /main-computer，经私网转到主机；第一次要单独登录｜在用",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "ChatGPT 两个连接｜“我的电脑”项目里有“主机 MCP”“副机 MCP”，手机和网页都能用｜在用",
   "sha256": "2d2811a87008b221e7dec14f189f43393989e1b15a5b682824c03cbe742b7fec",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "两台 Codex 互连｜笔记本 Codex 连主机，主机 Codex 连笔记本｜在用",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "主机 Claude 连副机｜主机上的 Claude 直接操作笔记本｜在用",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
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
   "source_phrase": "别的账号和客户端｜另一个 OpenAI 账号可自己加连接；别的客户端可用应用凭据接入｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "副机备用连接保温｜笔记本连过一次主机后，一小时内保持连接，下次不用重新建立、响应更快；开始菜单能看能停｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "文件｜读、写、找、列目录、复制、移动｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "命令和脚本｜用 PowerShell 7 跑命令、Python、Node、Git 和现成管理脚本，拿回输出和退出码｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "读文档片段｜只读文本某几行、PDF 某页、Word 某段、Excel 某行，不回传整份｜在用",
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
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件写作",
   "source_phrase": "大文件局部修改｜10 万行的文本只读目标附近，按唯一锚点改一段再回读｜在用",
   "sha256": "78fcd9b3010d8edec8e13e231dfa01eb6e1bf1de47e99caa67705f10f6b47ec8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "桌面操作｜截图、读界面元素、点、打字、快捷键、滚动、拖动、开关应用、等某个画面出现｜在用",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "操作我的 Chrome｜在原来的 Chrome 里开标签、输入、点链接、截图核对，不动已开的页面｜在用",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "填表和上传｜输入、下拉、勾选、选附件、提交；只在本机测试页验过，真网站的登录验证码没测｜说不准",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "系统小工具｜进程、注册表、剪贴板、弹通知、显示器清单、抓网页文字｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "管理员和 SYSTEM 维护｜用管理员或 SYSTEM 身份跑命令；长命令先给编号，之后凭编号取结果｜在用",
   "sha256": "faba1a9345b3cdd9cab82c6e7d1509c4314366445446b4bab03139eab4f0afcc",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-63eff3c9b1acd9a76839.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-63eff3c9b1acd9a76839",
   "title_text": "全部功能（44 项）",
   "sha256": "848a2eb1e100299943297590900b6d1e29844987b55b9d7651011b96480b35ce",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：全部功能（44 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**连接入口**
1. 主机公网入口｜经 Cloudflare 免费隧道进主机，电脑不开端口；要登录｜在用
2. 副机入口｜笔记本用 Tailscale Funnel 开出自己的地址，单独登录｜在用
3. 主机备用入口｜隧道断了，改连挂在副机地址下的备用入口，经私网转到主机；第一次要单独登录｜在用
4. ChatGPT 两个连接｜“我的电脑”项目里有“主机 MCP”“副机 MCP”，手机和网页都能用｜在用
5. 两台 Codex 互连｜笔记本 Codex 连主机，主机 Codex 连笔记本｜在用
6. 主机 Claude 连副机｜主机上的 Claude 直接操作笔记本｜在用
7. 别的账号和客户端｜另一个 OpenAI 账号可自己加连接；别的客户端可用应用凭据接入｜说不准
8. 副机备用连接保温｜笔记本连过一次主机后，一小时内保持连接，下次不用重新建立、响应更快；开始菜单能看能停｜说不准

**能办的事**
9. 文件｜读、写、找、列目录、复制、移动｜在用
10. 命令和脚本｜用 PowerShell 7 跑命令、Python、Node、Git 和现成管理脚本，拿回输出和退出码｜在用
11. 读文档片段｜只读文本某几行、PDF 某页、Word 某段、Excel 某行，不回传整份｜在用
12. 大文件局部修改｜10 万行的文本只读目标附近，按唯一锚点改一段再回读｜在用
13. 桌面操作｜截图、读界面元素、点、打字、快捷键、滚动、拖动、开关应用、等某个画面出现｜在用
14. 操作我的 Chrome｜在原来的 Chrome 里开标签、输入、点链接、截图核对，不动已开的页面｜在用
15. 填表和上传｜输入、下拉、勾选、选附件、提交；只在本机测试页验过，真网站的登录验证码没测｜说不准
16. 系统小工具｜进程、注册表、剪贴板、弹通知、显示器清单、抓网页文字｜在用
17. 管理员和 SYSTEM 维护｜用管理员或 SYSTEM 身份跑命令；长命令先给编号，之后凭编号取结果｜在用

“别的账号和客户端”怎么配，见〔连接电脑〕

::screen{#remote-control-10 section="features"}

```typeset
{
 "screen": {
  "id": "remote-control-10",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。 本轮根确认的AI版式纠正：已有这张独立状态屏中的原有正确图例可以保留，颜色、状态名和含义不变；只允许需要就近读懂状态的独立屏重复，不要求其它屏增画，也不增删改写功能正文或状态数据。此条优先于前文“后两张没有图例”的AI排法。",
  "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。 本轮根确认的AI版式纠正：已有这张独立状态屏中的原有正确图例可以保留，颜色、状态名和含义不变；只允许需要就近读懂状态的独立屏重复，不要求其它屏增画，也不增删改写功能正文或状态数据。此条优先于前文“后两张没有图例”的AI排法。",
  "links": [],
  "anchors": [
   {
    "id": "g-guard",
    "text": "规矩和保护"
   },
   {
    "id": "f-rules-handshake",
    "text": "连上就给规则"
   },
   {
    "id": "f-context",
    "text": "开工先核对"
   },
   {
    "id": "f-shared-lock",
    "text": "资料锁共用一份"
   },
   {
    "id": "f-recycle",
    "text": "删除和覆盖先进回收站"
   },
   {
    "id": "f-no-replay",
    "text": "超时不重来"
   },
   {
    "id": "f-freeze-rescue",
    "text": "卡死时给急救做法"
   },
   {
    "id": "f-no-window",
    "text": "命令不弹黑窗口"
   },
   {
    "id": "f-owner-ref",
    "text": "无限制授权跟到电脑上"
   },
   {
    "id": "f-login",
    "text": "自己的入口密码"
   },
   {
    "id": "g-alive",
    "text": "一直在线"
   },
   {
    "id": "f-boot",
    "text": "没登录也能维护"
   },
   {
    "id": "f-self-heal",
    "text": "挂了自己拉起"
   },
   {
    "id": "f-keep-awake",
    "text": "主机不睡"
   },
   {
    "id": "f-tunnel",
    "text": "隧道查和修"
   },
   {
    "id": "f-public-heal",
    "text": "副机公网自动恢复"
   },
   {
    "id": "f-upgrade",
    "text": "每周检查升级"
   },
   {
    "id": "f-same-source",
    "text": "两台同一份源码"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "rc-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "规矩和保护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "18连上就给规则",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "一直在线",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "27没登录也能维护开机就起SYSTEM服务，没登录也能跑维护命令；桌面操作要等登录待验收28挂了自己拉起每10秒探测，连续3次失败就重启；服",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-10",
    "component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "规矩和保护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "18连上就给规则",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "一直在线",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "27没登录也能维护开机就起SYSTEM服务，没登录也能跑维护命令；桌面操作要等登录待验收28挂了自己拉起每10秒探测，连续3次失败就重启；服",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-10",
    "component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "连上就给规则｜每次连接握手附上规则原文：主机现场核验当前版本，笔记本发自己那份｜在用",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "开工先核对｜先查是哪台电脑、用哪版规则、资料锁开没开、电脑有没有卡住｜在用",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "资料锁共用一份｜手机、网页、本机 AI 用同一份资料解锁和截止；连上电脑不算解锁｜在用",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "删除和覆盖先进回收站｜删文件、覆盖写入、覆盖复制移动，旧内容先进我账户的回收站；进不去就拒绝｜在用",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "超时不重来｜超时只说结果未知，不自动重交；维护命令凭编号查原结果｜在用",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "卡死时给急救做法｜独立探测确认卡死时，回复直接写重启或按键留现场；真卡死时还没见它出现过｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
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
   "source_phrase": "命令不弹黑窗口｜给上游打补丁，PowerShell 隐藏启动；上游修好后自动跳过｜在用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "无限制授权跟到电脑上｜对话开无限制授权时会拿到一个配对编号，可随命令带到电脑，由密码中心核对；连接本身不算授权｜说不准",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "自己的入口密码｜主机、副机各一个入口密码，都存在密码中心；只认登记过的客户端｜在用",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "没登录也能维护｜开机就起 SYSTEM 服务，没登录也能跑维护命令；桌面操作要等登录｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "挂了自己拉起｜每 10 秒探测，连续 3 次失败就重启；服务本身退出按 5、15、30 秒重启｜在用",
   "sha256": "3adac5e6ca30429c0fc934071422cad3eb480d48b6d54d6a842a8516f6a689d4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "主机不睡｜主机请求保持唤醒；笔记本不唤醒，睡着就连不上｜在用",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "隧道查和修｜一条命令查隧道和公网通不通，修复登记过的服务｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "副机公网自动恢复｜每 3 分钟查，连续 3 次不通才恢复，至少隔 30 分钟、一天最多 3 次｜在用",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "每周检查升级｜每周查 Windows-MCP 新版，测试通过自动升级，副机先、主机后；笔记本的每周巡检平时暂停｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "两台同一份源码｜两台用同一个提交，各自配置、登录凭据、部署和回退｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  }
 ]
}
```

**规矩和保护**
18. 连上就给规则｜连接握手提供当前规则；本机已有完整规则的客户端只收入口，笔记本沿用自己那份｜在用
19. 开工先核对｜先查是哪台电脑、用哪版规则、资料锁开没开、电脑有没有卡住｜在用
20. 资料锁共用一份｜手机、网页、本机 AI 用同一份资料解锁和截止；连上电脑不算解锁｜在用
21. 删除和覆盖先进回收站｜删文件、覆盖写入、覆盖复制移动，旧内容先进我账户的回收站；进不去就拒绝｜在用
22. 超时不重来｜超时只说结果未知，不自动重交；维护命令凭编号查原结果｜在用
23. 卡死时给急救做法｜独立探测确认卡死时，按现行急救卡先保存、约 2 分钟后正常重启，按键留现场只作备用；提示仍未实测｜说不准
24. 命令不弹黑窗口｜给上游打补丁，PowerShell 隐藏启动；上游修好后自动跳过｜在用
25. 无限制授权跟到电脑上｜对话开无限制授权时会拿到一个配对编号，可随命令带到电脑，由密码中心核对；连接本身不算授权｜说不准
26. 自己的入口密码｜主机、副机各一个入口密码，都存在密码中心；只认登记过的客户端｜在用

**一直在线**
27. 没登录也能维护｜开机就起 SYSTEM 服务，没登录也能跑维护命令；桌面操作要等登录｜待验收
28. 挂了自己拉起｜每 10 秒探测，连续 3 次失败就重启；服务本身退出按 5、15、30 秒重启｜在用
29. 主机不睡｜主机请求保持唤醒；笔记本不唤醒，睡着就连不上｜在用
30. 隧道查和修｜一条命令查隧道和公网通不通，修复登记过的服务｜在用
31. 副机公网自动恢复｜每 3 分钟查，连续 3 次不通才恢复，至少隔 30 分钟、一天最多 3 次｜在用
32. 每周检查升级｜每周查 Windows-MCP 新版，测试通过自动升级，副机先、主机后；笔记本的每周巡检平时暂停｜说不准
33. 两台同一份源码｜两台用同一个提交，各自配置、登录凭据、部署和回退｜在用

::screen{#remote-control-11 section="features"}

```typeset
{
 "screen": {
  "id": "remote-control-11",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。 本轮根确认的AI版式纠正：已有这张独立状态屏中的原有正确图例可以保留，颜色、状态名和含义不变；只允许需要就近读懂状态的独立屏重复，不要求其它屏增画，也不增删改写功能正文或状态数据。此条优先于前文“后两张没有图例”的AI排法。",
  "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。 本轮根确认的AI版式纠正：已有这张独立状态屏中的原有正确图例可以保留，颜色、状态名和含义不变；只允许需要就近读懂状态的独立屏重复，不要求其它屏增画，也不增删改写功能正文或状态数据。此条优先于前文“后两张没有图例”的AI排法。",
  "links": [
   {
    "text": "授权与状态",
    "href": "/computer-access/",
    "locator_instances": {
     "v": {
      "input_sha256": "220cd75457a24d82f85985aefc58814d4126cde134fb9a23fdf5feb6c0708379",
      "instances": [
       {
        "context_text": "网页那几项怎么办理，见授权与状态；",
        "context_rect": [
         49,
         3103,
         742,
         3151
        ],
        "expected_rect": [
         485,
         3110,
         721,
         3148
        ]
       }
      ]
     }
    }
   },
   {
    "text": "Codex 远程",
    "href": "/projects/codex-local-remote/",
    "locator_instances": {
     "v": {
      "input_sha256": "220cd75457a24d82f85985aefc58814d4126cde134fb9a23fdf5feb6c0708379",
      "instances": [
       {
        "context_text": "Codex 远程为什么停，见 Codex 远程",
        "context_rect": [
         49,
         3162,
         730,
         3203
        ],
        "expected_rect": [
         495,
         3167,
         727,
         3203
        ]
       }
      ]
     }
    }
   }
  ],
  "anchors": [
   {
    "id": "g-web",
    "text": "网页上的授权与状态"
   },
   {
    "id": "f-connect-page",
    "text": "连接电脑说明"
   },
   {
    "id": "f-phone-guide",
    "text": "手机接续说明"
   },
   {
    "id": "f-status-page",
    "text": "主机状态"
   },
   {
    "id": "f-personal-grant",
    "text": "个人资料授权"
   },
   {
    "id": "f-unrestricted-grant",
    "text": "无限制授权"
   },
   {
    "id": "f-lock",
    "text": "锁资料、锁屏"
   },
   {
    "id": "f-grafana-entry",
    "text": "监控入口"
   },
   {
    "id": "g-retired",
    "text": "已停用",
    "locator_instances": {
     "h": {
      "input_sha256": "90941d1a176e4c47a26d1a01fe80ce9f9623b45146432f887ef923f4ccc81186",
      "instances": [
       {
        "context_text": "已停用",
        "context_rect": [
         51,
         567,
         172,
         619
        ],
        "expected_rect": [
         51,
         567,
         172,
         619
        ]
       }
      ]
     }
    }
   },
   {
    "id": "f-codex-remote",
    "text": "Codex 远程公网入口"
   },
   {
    "id": "f-browser-fill",
    "text": "AI 浏览器代填入口密码"
   },
   {
    "id": "f-old-funnel",
    "text": "主机旧 Funnel 入口"
   },
   {
    "id": "f-old-plugin",
    "text": "旧“电脑 MCP”单个连接"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "rc-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "网页上的授权与状态",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "34连接电脑说明三个地址、每台的验收记录、一键复制给AI的配置说明在用35手机接续说明讲手机上的对话怎么借已连接的电脑接着办事说不准36主机",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "已停用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "41Codex远程公网入口手机网页看Codex任务；9月26日决定撤掉已停用42AI浏览器代填入口密码改由我自己从密码中心复制已停用43主机",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "网页那几项怎么办理，见授权与状态；Codex远程为什么停，见Codex远程"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-11",
    "component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "网页上的授权与状态",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "34连接电脑说明三个地址、每台的验收记录、一键复制给AI的配置说明在用35手机接续说明讲手机上的对话怎么借已连接的电脑接着办事说不准36主机",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "已停用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "41Codex远程公网入口手机网页看Codex任务；9月26日决定撤掉已停用42AI浏览器代填入口密码改由我自己从密码中心复制已停用43主机",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "网页那几项怎么办理，见授权与状态；Codex远程为什么停，见Codex远程"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-11",
    "component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
     "icon",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "连接电脑说明｜三个地址、每台的验收记录、一键复制给 AI 的配置说明｜在用",
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "手机接续说明｜讲手机上的对话怎么借已连接的电脑接着办事｜说不准",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "主机状态｜在线没、锁没锁屏、处理器显卡内存、每块盘、网速；连不上时提示怎么远程开机｜待验收",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
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
   "source_phrase": "个人资料授权｜输验证器里的 6 位动态码，办理、延长或结束资料解锁，0.5 到 72 小时｜待验收",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "无限制授权｜同一页办理、延长或结束全局无限制授权，和资料授权分别计时｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "锁资料、锁屏｜一键锁住资料，或只锁 Windows 屏幕；锁屏不影响授权计时｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "监控入口｜显示监控面板在不在线，点过去看电脑使用记录的图表｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "Codex 远程公网入口｜手机网页看 Codex 任务；9 月 26 日决定撤掉｜已停用",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "AI 浏览器代填入口密码｜改由我自己从密码中心复制｜已停用",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "主机旧 Funnel 入口｜改走 Cloudflare 后停用，只留作退回材料｜已停用",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "旧“电脑 MCP”单个连接｜拆成“主机 MCP”“副机 MCP”两个｜已停用",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  }
 ]
}
```

**网页上的授权与状态**
34. 连接电脑说明｜三个地址、每台的验收记录、一键复制给 AI 的配置说明｜在用
35. 手机接续说明｜讲手机上的对话怎么借已连接的电脑接着办事｜说不准
36. 主机状态｜在线没、锁没锁屏、处理器显卡内存、每块盘、网速；连不上时提示怎么远程开机｜待验收
37. 个人资料授权｜输验证器里的 6 位动态码，办理、延长或结束资料解锁，0.5 到 72 小时｜待验收
38. 无限制授权｜同一页办理、延长或结束全局无限制授权，和资料授权分别计时｜待验收
39. 锁资料、锁屏｜一键锁住资料，或只锁 Windows 屏幕；锁屏不影响授权计时｜待验收
40. 监控入口｜显示监控面板在不在线，点过去看电脑使用记录的图表｜待验收

**已停用**
41. Codex 远程公网入口｜手机网页看 Codex 任务；9 月 26 日决定撤掉｜已停用
42. AI 浏览器代填入口密码｜改由我自己从密码中心复制｜已停用
43. 主机旧 Funnel 入口｜改走 Cloudflare 后停用，只留作退回材料｜已停用
44. 旧“电脑 MCP”单个连接｜拆成“主机 MCP”“副机 MCP”两个｜已停用

网页那几项怎么办理，见〔授权与状态〕；Codex 远程为什么停，见〔Codex 远程〕

::screen{#remote-control-12 section="history"}

```typeset
{
 "screen": {
  "id": "remote-control-12",
  "section": "history",
  "title": "演进",
  "scene": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：一台台式机先亮起，接着旁边长出一台笔记本，再往上长出一朵云和一条丝带，最后一把小锁挂在丝带上，像一路长出来的样子。",
  "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。",
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
     "text_ref": "标题：演进（北京时间）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "width": "100%",
     "align": "center",
     "size": "small",
     "target_height": 230
    },
    {
     "type": "timeline",
     "text_ref": "9月9日：主机的电脑连接上线；连接时自动附上规则；加上管理员和SYSTEM维护；笔记本装上同一套9月10日：开机就启动，没登录也能维护；Ch",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "ribbon",
     "width": "100%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：主插画移到标题后居中，最高230px；时间线满宽，不留空的长右栏。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-12",
    "component_order": [
     "timeline",
     "icon",
     "illustration"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "标题：演进（北京时间）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration"
    },
    {
     "type": "timeline",
     "text_ref": "9月9日：主机的电脑连接上线；连接时自动附上规则；加上管理员和SYSTEM维护；笔记本装上同一套9月10日：开机就启动，没登录也能维护；Ch",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "ribbon"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n页修复10：规格档位页标题large、章节medium；当前核心size不改毛笔资产的实际尺寸，统一毛笔标题宽度及删内部前缀请求main，未冒充已执行。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "remote-control-12",
    "component_order": [
     "timeline",
     "illustration",
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "9 月 9 日：主机的电脑连接上线；连接时自动附上规则；加上管理员和 SYSTEM 维护；笔记本装上同一套",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "9 月 10 日：开机就启动，没登录也能维护；ChatGPT 接入笔记本",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "9 月 11 日：主机改走 Cloudflare 隧道和自己的域名，加上经笔记本的备用入口，当天停隧道真演练",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "9 月 14–15 日：读私人资料前先查资料锁；笔记本公网自动恢复；每周检查升级；监控图表走同一条隧道",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "9 月 18–19 日：笔记本备用连接保温；无限制授权接进来",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "9 月 24–25 日：网页“授权与状态”上线；主机 Claude 能连笔记本",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "9 月 26–27 日：撤掉 Codex 远程公网入口和 AI 代填入口密码",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "9 月 27–28 日：卡死那晚加上硬截止和急救提示；删除、覆盖先进回收站；升级到 Windows-MCP 0.8.6",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
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
   "source_phrase": "右侧一幅大一点的水彩插画：一台台式机先亮起，接着旁边长出一台笔记本，再往上长出一朵云和一条丝带，最后一把小锁挂在丝带上，像一路长出来的样子。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready",
   "original_elements": [
    "一台台式机先亮起，接着旁边长出一台笔记本，再往上长出一朵云和一条丝带，最后一把小锁挂在丝带上，像一路长出来的样子"
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
   "asset": "_library/round3/titles/title-r3-7d359dfee0bedd68127f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7d359dfee0bedd68127f",
   "title_text": "演进（北京时间）",
   "sha256": "f822fd4b764807be915e72b98b9486fe72a42f3abebbb53422a5e6db514f9ee4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：演进（北京时间）

- **9 月 9 日**：主机的电脑连接上线；连接时自动附上规则；加上管理员和 SYSTEM 维护；笔记本装上同一套
- **9 月 10 日**：开机就启动，没登录也能维护；ChatGPT 接入笔记本
- **9 月 11 日**：主机改走 Cloudflare 隧道和自己的域名，加上经笔记本的备用入口，当天停隧道真演练
- **9 月 14–15 日**：读私人资料前先查资料锁；笔记本公网自动恢复；每周检查升级；监控图表走同一条隧道
- **9 月 18–19 日**：笔记本备用连接保温；无限制授权接进来
- **9 月 24–25 日**：网页“授权与状态”上线；主机 Claude 能连笔记本
- **9 月 26–27 日**：撤掉 Codex 远程公网入口和 AI 代填入口密码
- **9 月 27–28 日**：卡死那晚加上硬截止和急救提示；删除、覆盖先进回收站；升级到 Windows-MCP 0.8.6
