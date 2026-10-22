---
{
 "title": "双屏信息中心",
 "kind": "project",
 "url": "/projects/pc-panel-hub/",
 "tagline": "抬眼就知道电脑状态、时间和手机提醒。",
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
  },
  {
   "id": "gallery",
   "label": "画廊"
  }
 ],
 "page": {
  "reading_order": [
   "pc-panel-hub-01",
   "pc-panel-hub-04"
  ],
  "schema": "site-b1.page.v1",
  "page": "pc-panel-hub",
  "kind": "project",
  "title": "双屏信息中心",
  "url": "/projects/pc-panel-hub/",
  "tagline": "抬眼就知道电脑状态、时间和手机提醒。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/PC-Panel-Hub",
  "capability": "把电脑和手机的状态摆在眼前",
  "based_on": {
   "commit": "784fe7fb72aa7518ba3545b6491fbcb2bd508489",
   "commit_time": "2026-10-06T05:52:17+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：机箱侧面那条竖长小屏上的浅绿小卡片轻轻闪一下，一条小折线从左向右慢慢爬动，像每秒刷新；水冷头上的曲面屏里，大号时钟的最后一位数字翻页一次；随后一张半透明水晶小卡片从曲面屏右侧轻轻滑入、停两秒、再淡出；旁边手机屏幕亮一下，一条虚线小光点沿着箭头从手机流向曲面屏；显卡侧面的绿光像呼吸一样明暗；背景水彩微微流动，偶尔一片小叶子飘过。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-case",
     "name": "机箱屏显示"
    },
    {
     "id": "g-case-run",
     "name": "机箱屏怎么跑"
    },
    {
     "id": "g-curved",
     "name": "曲面屏显示"
    },
    {
     "id": "g-guard",
     "name": "开机、睡眠和窗口"
    },
    {
     "id": "g-tools",
     "name": "手动工具和对外"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-case-clock",
     "group": "g-case",
     "name": "时钟和日期",
     "what": "时:分:秒、日期星期，北京时间，每秒跳一下",
     "how": "看机箱屏最上面",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "architecture.md:93；stream-last.png 9/28 21:20"
    },
    {
     "id": "f-case-weather",
     "group": "g-case",
     "name": "天气和空气质量",
     "what": "天气、空气质量、湿度，取 Open-Meteo；9 月 28 日坏过，29 日凌晨修好，01:56 屏上是“20°C 阵雨、AQI 70、湿度 95%”",
     "how": "看机箱屏右上角",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "turzx_weather_shim.py:288,300；metrics_agent.py:933；9/28 快照 weather.status=stale、18080 端口无人监听；提交 4cb2cb7 StartSideScreenStack.ps1 带 --config 启动天气小服务并记下启动失败原因；修复对话 9/29 01:56 实发画面“20°C 阵雨 / AQI 70 / 湿度 95%”"
    },
    {
     "id": "f-case-status",
     "group": "g-case",
     "name": "状态条",
     "what": "数据取没取到、前台程序、多久更新一次",
     "how": "看时钟下面那条绿条",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "metrics_agent.py:439-443；Renderer.cs:111-123"
    },
    {
     "id": "f-case-cpu",
     "group": "g-case",
     "name": "CPU",
     "what": "使用率、温度、功耗、主频、电压、60 秒曲线；使用率和任务管理器对得上",
     "how": "看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "architecture.md:17-19；stream-last.png"
    },
    {
     "id": "f-case-gpu",
     "group": "g-case",
     "name": "显卡",
     "what": "使用率、温度、功耗、核心频率、电压、曲线",
     "how": "看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "requirements.txt nvidia-ml-py；stream-last.png"
    },
    {
     "id": "f-case-fps",
     "group": "g-case",
     "name": "游戏帧率",
     "what": "平均、1% 低帧、帧时间，只读电脑使用记录的数据",
     "how": "开游戏后看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "metrics_agent.py:58-127；9/28 帧 119 FPS"
    },
    {
     "id": "f-case-memory",
     "group": "g-case",
     "name": "内存和显存",
     "what": "使用率，主板和内存条温度",
     "how": "看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "stream-last.png"
    },
    {
     "id": "f-case-network",
     "group": "g-case",
     "name": "网速和网络质量",
     "what": "下载上传、延迟、抖动、丢包、DPC，只算物理网卡",
     "how": "看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "architecture.md:14-16；metrics_agent.py:52"
    },
    {
     "id": "f-case-disks",
     "group": "g-case",
     "name": "硬盘",
     "what": "最多 4 块：型号、温度、用量、读写速度",
     "how": "看机箱屏",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "stream-last.png；Renderer.cs“最多显示 4 块”"
    },
    {
     "id": "f-case-apps",
     "group": "g-case",
     "name": "应用排行",
     "what": "最占 CPU 和内存的前 3 个程序，每 3 秒单独采",
     "how": "看机箱屏最下面",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "architecture.md:23-26"
    },
    {
     "id": "f-hybrid-refresh",
     "group": "g-case-run",
     "name": "每秒刷新",
     "what": "平时只发变化，约 15 分钟整帧重画一次",
     "how": "不用管",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "stream-heartbeat.json 9/28 21:22：hybrid，85063 帧 0 失败"
    },
    {
     "id": "f-full-frame-mode",
     "group": "g-case-run",
     "name": "3 秒整帧模式",
     "what": "保守的兼容模式，只在排查时手动打开",
     "how": "让 AI 排查兼容问题时用",
     "status": "说不准",
     "screen": "pc-panel-hub-11",
     "source": "startup.md:35-36；运行中没有使用记录"
    },
    {
     "id": "f-trust-score",
     "group": "g-case-run",
     "name": "数据可信度",
     "what": "每份数据按九项打 0–100 分，记进日志",
     "how": "让 AI 查某个数字可不可信",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "metrics_agent.py:449-470；9/28 快照 86/100"
    },
    {
     "id": "f-preview-png",
     "group": "g-case-run",
     "name": "诊断截图",
     "what": "发完画面后在后台顺手存一张刚发的图，默认约 45 秒一张，AI 不用看实体屏也知道画了什么；这是软件预览，不是实体屏照片",
     "how": "让 AI 看 out\\stream\\stream-last.png",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "architecture.md:44-46；stream-last.png 9/28 21:20"
    },
    {
     "id": "f-serial-heal",
     "group": "g-case-run",
     "name": "串口卡死自愈",
     "what": "调亮度连续失败 3 次，只重启那个 USB 串口设备，5 分钟最多一次",
     "how": "不用管",
     "status": "在用",
     "screen": "pc-panel-hub-11",
     "source": "271ffd2；watchdog.log 北京 9/21 00:45 recovered"
    },
    {
     "id": "f-hs2-clock",
     "group": "g-curved",
     "name": "时钟",
     "what": "只到分钟，整分钟翻页；Win+F2 显示或隐藏",
     "how": "抬头看；按 Win+F2 开关",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:57；ZS13、ZS33"
    },
    {
     "id": "f-hs2-music",
     "group": "g-curved",
     "name": "正在放的歌",
     "what": "网易云的歌名、歌手、封面、双语歌名；对不上就不显示",
     "how": "放网易云时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:58,102-113；ZS33"
    },
    {
     "id": "f-hs2-game",
     "group": "g-curved",
     "name": "Steam 游戏",
     "what": "游戏名、封面、这次玩了多久，退出后总结 60 秒",
     "how": "开 Steam 游戏时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:59；ZS33"
    },
    {
     "id": "f-hs2-phone",
     "group": "g-curved",
     "name": "手机通知和来电",
     "what": "最多 3 条，每条 60 秒；来电、传输进行时一直在",
     "how": "手机来消息时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:62,79-89；ZS33"
    },
    {
     "id": "f-hs2-code",
     "group": "g-curved",
     "name": "验证码",
     "what": "只认明确的验证码，大号数字 15 秒；日志不记",
     "how": "收到验证码时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:63,91-96"
    },
    {
     "id": "f-hs2-battery",
     "group": "g-curved",
     "name": "手机电量",
     "what": "电量和是否在充电；两个来源都读，小米妙享不比手机连接旧过 15 秒就用它，否则用更新的那个",
     "how": "手机连着电脑时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:61,65-69；ZS33"
    },
    {
     "id": "f-hs2-events",
     "group": "g-curved",
     "name": "耳机音箱切换、断网",
     "what": "显示新设备名，或断网、恢复，12 秒",
     "how": "发生时看",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:60；ZS33"
    },
    {
     "id": "f-hs2-deck",
     "group": "g-curved",
     "name": "六张卡自动排",
     "what": "最多六张，来电优先，只画有内容的卡，不跨曲面折线",
     "how": "不用管",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:48-52,73-78"
    },
    {
     "id": "f-hs2-clear",
     "group": "g-curved",
     "name": "Win+F1 清屏",
     "what": "清掉看过的通知和事件，歌、游戏、来电留着",
     "how": "按 Win+F1",
     "status": "说不准",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:98-100；没有按键使用记录"
    },
    {
     "id": "f-watchdog",
     "group": "g-guard",
     "name": "登录自启和看门狗",
     "what": "登录后隐身启动，盯心跳，坏了冷却 30 秒再起一套",
     "how": "不用管",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "计划任务 \\TURZX SideScreen Running；startup.md:25-44,162-170"
    },
    {
     "id": "f-crash-restart",
     "group": "g-guard",
     "name": "看门狗自己崩了也能回来",
     "what": "异常退出后约 30 秒自动拉起替身；9 月 7 日专门测过一次，约 63 秒接回机箱屏，日常还没见过它真的触发",
     "how": "不用管",
     "status": "说不准",
     "screen": "pc-panel-hub-12",
     "source": "startup.md:172-179；a4d8e22；没找到实际拉起记录"
    },
    {
     "id": "f-sleep",
     "group": "g-guard",
     "name": "睡眠和关机关屏",
     "what": "机箱屏亮度调到 0，曲面屏切回离线时钟；唤醒后恢复",
     "how": "睡眠后看两块屏",
     "status": "待验收",
     "screen": "pc-panel-hub-12",
     "source": "startup.md:84-88；PCConfig pending_acceptance case-screen-sleep；owner-decisions.md:134"
    },
    {
     "id": "f-hs2-recover",
     "group": "g-guard",
     "name": "曲面屏找回",
     "what": "开机、唤醒各试一次切回副屏，认不准就等；浮层停在旧坐标、没整块落在曲面屏里，会请求浮层重新贴回（10 月 1 日加，实体屏上还没专门验过这一种）",
     "how": "屏幕没显示时跟 AI 说",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:18-40；watchdog.log"
    },
    {
     "id": "f-window-guard",
     "group": "g-guard",
     "name": "窗口不乱跑",
     "what": "普通窗口误入曲面屏就搬回主屏，壁纸、浮层不碰；跟着看门狗全程运行，每 250 毫秒看一眼",
     "how": "窗口位置不对时跟 AI 说",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:160-166；hs2-startup-window-guard.json 9/28 running"
    },
    {
     "id": "f-vdd-return",
     "group": "g-guard",
     "name": "串流虚拟屏窗口回主屏",
     "what": "远程串流用的虚拟屏上的窗口，回到真的主屏",
     "how": "串流结束后窗口不对时跟 AI 说",
     "status": "说不准",
     "screen": "pc-panel-hub-12",
     "source": "a618e4d、a76caec、9eda10a；9/28 VddVerifiedCount=0"
    },
    {
     "id": "f-wallpaper",
     "group": "g-guard",
     "name": "动态壁纸重连",
     "what": "显示器变化后，请已经开着的 Wallpaper Engine“继续播放”，不先停、不换场景；同一次变化最多试 3 次，请求发出不等于壁纸真动了",
     "how": "不用管",
     "status": "在用",
     "screen": "pc-panel-hub-12",
     "source": "hs2-crystal-overlay.md:197-202；guard WallpaperResumeCount=1"
    },
    {
     "id": "f-manual-start",
     "group": "g-tools",
     "name": "手动启动",
     "what": "双击桌面“TURZX SideScreen Start”整套重新拉起",
     "how": "双击桌面快捷方式",
     "status": "说不准",
     "screen": "pc-panel-hub-13",
     "source": "README.md:4；startup.md:223-226"
    },
    {
     "id": "f-repair-panel",
     "group": "g-tools",
     "name": "机箱屏修复",
     "what": "认准那一个串口设备，重启并等到新心跳",
     "how": "跟 AI 说机箱屏冻住了",
     "status": "说不准",
     "screen": "pc-panel-hub-13",
     "source": "scripts/repair-panel.ps1；startup.md:191-200"
    },
    {
     "id": "f-repair-hs2",
     "group": "g-tools",
     "name": "曲面屏硬件修复",
     "what": "核对专用集线器和端口后才动硬件，实际修复需要时自动提权",
     "how": "跟 AI 说曲面屏没显示",
     "status": "说不准",
     "screen": "pc-panel-hub-13",
     "source": "scripts/repair-hs2.ps1；AGENTS.md:6"
    },
    {
     "id": "f-public-telemetry",
     "group": "g-tools",
     "name": "给网站的网络质量",
     "what": "只给延迟、抖动、丢包和 DPC，不给程序名和地址",
     "how": "网站打开时自动读",
     "status": "在用",
     "screen": "pc-panel-hub-13",
     "source": "architecture.md:54-71；PCConfig remote_computer_mcp.json:72；9/28 实测返回"
    },
    {
     "id": "f-public-release",
     "group": "g-tools",
     "name": "公开源码",
     "what": "源码公开在 GitHub，打包时自动剔除厂商文件、本机配置和天气地点",
     "how": "去 GitHub 看",
     "status": "在用",
     "screen": "pc-panel-hub-13",
     "source": "release.md；v0.1.0 7/5；test-public-release.ps1"
    },
    {
     "id": "f-old-vendor",
     "group": "g-retired",
     "name": "厂商自带软件和天气补丁",
     "what": "6 月底先用厂商软件，天气坏了打过补丁；7 月起换成自己画，9 月 29 日补丁脚本也删了",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "rollout 2026-06-30；提交 4cb2cb7 删除 turzx_weather_shim/patch_turzx_weather_urls.py、start_turzx_weatherfix.ps1、disable_old_turzx_startup.ps1"
    },
    {
     "id": "f-hw-alert",
     "group": "g-retired",
     "name": "硬件告警",
     "what": "水泵、温度、磁盘健康和空间、长期断网；9 月 27 日删掉",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "0200431；ZS33"
    },
    {
     "id": "f-volume",
     "group": "g-retired",
     "name": "音量提示",
     "what": "调音量时显示百分比 6 秒；9 月 27 日删掉",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "0200431；17aa764:hs2-crystal-overlay.md:60"
    },
    {
     "id": "f-tasks",
     "group": "g-retired",
     "name": "长任务进度",
     "what": "复制、下载、渲染主动登记后显示进度；9 月 27 日删掉",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "0200431；17aa764:hs2-crystal-overlay.md:62,123-138"
    },
    {
     "id": "f-usb",
     "group": "g-retired",
     "name": "U 盘提示",
     "what": "U 盘插拔提示；9 月 27 日删掉",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "0200431；17aa764:hs2-crystal-overlay.md:61"
    },
    {
     "id": "f-lyrics",
     "group": "g-retired",
     "name": "读网易云播放进度",
     "what": "想显示歌词和进度条，没找到可靠来源；9 月 27 日删掉",
     "how": "—",
     "status": "已停用",
     "screen": "pc-panel-hub-13",
     "source": "0200431 删 NeteasePlaybackMemoryReader、LyricTimeline、PlaybackProgress"
    }
   ],
   "numbers": [
    {
     "id": "n-refresh",
     "text": "1 秒一刷",
     "meaning": "机箱屏的刷新周期（混合模式 period_ms=1000）",
     "as_of": "2026-10-11",
     "source": "out\\stream\\stream-heartbeat.json period_ms；config.json dataRefreshMs",
     "screens": [
      "pc-panel-hub-01"
     ]
    },
    {
     "id": "n-frames",
     "text": "85,063 帧，0 次失败",
     "meaning": "9 月 27 日 21:27 到 28 日 21:22 那一次连续发送里，电脑这边记下的帧数和失败数；这是当时的记录，之后未重新核对",
     "as_of": "2026-09-28",
     "source": "stream-heartbeat.json：frame 85063、sent 85063、failed 0，utc 13:22:46Z",
     "screens": [
      "pc-panel-hub-01",
      "pc-panel-hub-10"
     ]
    },
    {
     "id": "n-kinds",
     "text": "6 类",
     "meaning": "曲面屏现在显示的信息种类",
     "as_of": "2026-09-28",
     "source": "AGENTS.md:3；hs2-crystal-overlay.md:5；ZS33",
     "screens": [
      "pc-panel-hub-01",
      "pc-panel-hub-09"
     ]
    },
    {
     "id": "n-tasks",
     "text": "1 个自动任务",
     "meaning": "本项目注册的计划任务数（\\TURZX SideScreen）",
     "as_of": "2026-10-11",
     "source": "Get-ScheduledTask 过滤 TURZX/HS2/Panel",
     "screens": [
      "pc-panel-hub-01"
     ]
    },
    {
     "id": "n-code",
     "text": "38,788 行",
     "meaning": "Git 跟踪的 C#、PowerShell、Python 代码非空行数",
     "as_of": "2026-10-11",
     "source": "提交 784fe7f git ls-files 逐个数非空行：C# 17,834 + PowerShell 14,779 + Python 6,175；北京时间 2026-10-11 13:34 只读统计",
     "screens": [
      "pc-panel-hub-07"
     ]
    },
    {
     "id": "n-tests",
     "text": "146 个 C# 单元测试定义（只计数），另有 21 个测试脚本",
     "meaning": "C# 单元测试定义（只计数）与测试脚本数量，本轮没有重跑",
     "as_of": "2026-10-11",
     "source": "按 10 月 6 日最后一次提交数的；146 个 C# 单元测试定义，另有 21 个测试脚本",
     "screens": [
      "pc-panel-hub-07"
     ]
    },
    {
     "id": "n-commits",
     "text": "93 次提交",
     "meaning": "7 月 5 日–10 月 6 日（北京时间）的提交数",
     "as_of": "2026-10-11",
     "source": "git -C E:\\Projects\\Tools\\TURZX-SideScreen rev-list --count HEAD；提交 784fe7f；北京时间 2026-10-11 13:32 只读统计",
     "screens": [
      "pc-panel-hub-07"
     ]
    },
    {
     "id": "n-restart-storm",
     "text": "759 次",
     "meaning": "8 月 26 日北京 08:00–13:59 指标服务被拉起的次数（每次启动留一对日志）",
     "as_of": "2026-08-26",
     "source": "out\\metrics-agent.20260826-*.stdout.log 按小时计数：53+160+160+138+153+95",
     "screens": [
      "pc-panel-hub-10"
     ]
    },
    {
     "id": "n-slim",
     "text": "删了 5,520 行",
     "meaning": "9 月 27 日瘦身提交 0200431 删除的行数（同时加了 401 行）",
     "as_of": "2026-09-27",
     "source": "git show --stat 0200431",
     "screens": [
      "pc-panel-hub-14"
     ]
    },
    {
     "id": "n-features",
     "text": "全部功能（42 项）",
     "meaning": "功能清单条数",
     "as_of": "2026-09-28",
     "source": "registry.features 计数",
     "screens": [
      "pc-panel-hub-11"
     ]
    },
    {
     "id": "n-log-keep",
     "text": "最多留最近 32 批",
     "meaning": "指标服务每次启动留一对日志（stdout、stderr），启动前只留最近 31 批旧的，加上这次共 32 批",
     "as_of": "2026-09-29",
     "source": "提交 4cb2cb7 StartVideoStream.ps1 Select-Object -First 31",
     "screens": [
      "pc-panel-hub-14"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-timeaudit-fps",
     "with": "timeaudit",
     "direction": "拿来",
     "flow": "电脑使用记录用 PresentMon 采到的游戏帧数据写在它的 PostgreSQL 里，机箱屏只读，显示平均帧率、1% 低帧、帧时间",
     "source": "metrics_agent.py:58-127；AGENTS.md:11"
    },
    {
     "id": "r-pcconfig-task",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "电脑配置与恢复给计划任务“副屏仪表盘”写人话说明、换机重建分类（可选），驾驶舱据此显示",
     "source": "PCConfig registries/task_purpose_catalog.json:1042"
    },
    {
     "id": "r-pcconfig-pending",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "待验收清单里有两条：睡眠时机箱屏会不会关（待验收）；曲面屏换到正式安装位置（9 月 28 日已通过）",
     "source": "PCConfig registries/pending_acceptance.json case-screen-sleep、case-screen-overlay-confirm"
    },
    {
     "id": "r-pcconfig-rtss",
     "with": "pcconfig",
     "direction": "被照顾",
     "flow": "看门狗曾在 RTSS 的挂钩里崩溃；电脑配置负责让 RTSS 不挂钩 powershell.exe",
     "source": "PCConfig docs/recovery/runtime_restore_order.md:44；startup.md:181-189"
    },
    {
     "id": "r-site-telemetry",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "远程服务的公开硬件数据读本项目 /public-telemetry：网络延迟、抖动、丢包、DPC，不含程序名和地址",
     "source": "PCConfig registries/remote_computer_mcp.json:72；public_host_telemetry.py:321-332"
    },
    {
     "id": "r-sunshine",
     "with": "sunshine-remote-streaming",
     "direction": "互不打扰",
     "flow": "串流不改两块小屏，本项目不改串流的虚拟屏；只把虚拟屏上的普通窗口送回物理主屏",
     "source": "sunshine-remote-streaming/AGENTS.md:3,5；a618e4d"
    },
    {
     "id": "r-phone",
     "with": "小米妙享、手机连接",
     "direction": "拿来",
     "flow": "两者把手机通知、来电、验证码、电量转到 Windows；曲面屏从 Windows 通知中心和它们的界面、日志读",
     "source": "hs2-crystal-overlay.md:61-63"
    },
    {
     "id": "r-netease-steam",
     "with": "网易云音乐、Steam",
     "direction": "拿来",
     "flow": "网易云的播放窗口标题和播放列表给出当前歌曲；Steam 本地清单和日志给出游戏和时长",
     "source": "hs2-crystal-overlay.md:58-59"
    },
    {
     "id": "r-lconnect",
     "with": "L-Connect 3",
     "direction": "调用",
     "flow": "经本机 127.0.0.1:11021 把曲面屏在原生模式和 Windows 副屏之间切换、读回模式",
     "source": "startup.md:111-115"
    },
    {
     "id": "r-wallpaper",
     "with": "Wallpaper Engine",
     "direction": "调用",
     "flow": "显示器变化后，等 2 秒，请已经开着的 Wallpaper Engine“继续播放”，不先停、不换场景；同一次变化最多试 3 次。请求发出去，不等于壁纸真的动了",
     "source": "源码按 10 月 6 日最后一次提交；250 毫秒的桌面保护小循环"
    },
    {
     "id": "r-sensors",
     "with": "LibreHardwareMonitor、NVIDIA 驱动",
     "direction": "拿来",
     "flow": "温度、功耗、电压、频率",
     "source": "metrics_agent.py:41-47；requirements.txt"
    },
    {
     "id": "r-weather",
     "with": "Open-Meteo",
     "direction": "拿来",
     "flow": "天气和空气质量，本机小服务转成厂商原来用的格式，10 分钟缓存",
     "source": "turzx_weather_shim.py:288,300；metrics_agent.py:38"
    },
    {
     "id": "r-github",
     "with": "GitHub",
     "direction": "发布",
     "flow": "公开仓库 wlyaaaaa/PC-Panel-Hub，v0.1.0 源码发布；GitHub 主页置顶之一",
     "source": "gh release list；owner-decisions.md:647,657"
    }
   ],
   "highlights": [
    {
     "id": "h-heartbeat",
     "title": "程序活着，不等于屏幕在动。",
     "screen": "pc-panel-hub-10"
    },
    {
     "id": "h-serial-heal",
     "title": "一上午被拉起 759 次，之后只修那一根线。",
     "screen": "pc-panel-hub-10"
    },
    {
     "id": "h-stop-when-unsure",
     "title": "认不准，宁可停手。",
     "screen": "pc-panel-hub-10"
    }
   ],
   "mentions": [
    {
     "target": "/cockpit/#pc-panel-hub",
     "screen": "pc-panel-hub-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/how/#pc-panel-hub",
     "screen": "pc-panel-hub-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/projects/timeaudit/",
     "screen": "pc-panel-hub-03",
     "text": "电脑使用记录"
    },
    {
     "target": "/cockpit/#pending",
     "screen": "pc-panel-hub-06",
     "text": "待验收清单"
    },
    {
     "target": "/rules/charter/#L28",
     "screen": "pc-panel-hub-09",
     "text": "约法 L28"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "看门狗：计划任务 \\TURZX SideScreen 在不在跑（例如“运行中”“没在运行”“上次启动失败”“暂时读不到”）",
     "source": "看板接口的自动任务扫描里 \\TURZX SideScreen 这一项（Task Scheduler 状态和 LastTaskResult；常驻时 0x41301＝正在运行）"
    },
    {
     "slot": "panel",
     "empty_text": "这个网页还没接入机箱小屏画面的实时状态",
     "meaning": "机箱屏画面：最近一次心跳离现在多久、status 是否 ok、失败帧数（例如“每秒刷新中”“45 秒没刷新”“暂时读不到”）",
     "source": "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\out\\stream\\stream-heartbeat.json 的 utc、status、failed。看板接口现在不读，第 2 批要接"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“机箱指标”拆成“机箱屏显示”一组 10 项（时钟、天气、状态条、CPU、显卡、帧率、内存显存、网络、硬盘、应用排行）：本人要求功能写全，屏上九段各有来源和用处。",
    "底稿“机箱屏持续更新”写成 f-hybrid-refresh“每秒刷新”，机制在第 8 屏讲透。",
    "底稿“曲面时钟”→ f-hs2-clock；“音乐信息”→ f-hs2-music；“游戏信息”→ f-hs2-game；“手机通知”→ f-hs2-phone；“验证码提醒”→ f-hs2-code；“手机电量”→ f-hs2-battery。",
    "底稿“网络与U盘”：断网恢复部分并进 f-hs2-events（和耳机音箱切换一起，ZS33 原话“耳机音箱切换、网络断开这类系统事件”）；U 盘部分单列 f-usb，已停用。",
    "底稿“显示恢复”→ f-hs2-recover（曲面屏找回）；机箱屏那一半由 f-watchdog 和 f-serial-heal 承担。",
    "底稿“窗口保护”→ f-window-guard。旧稿 unsure 里“普通窗口不该停在曲面屏上还是反过来”已按 hs2-crystal-overlay.md:160-166 查清：是把误入曲面屏的普通窗口搬回主屏。"
   ],
   "dropped": [
    "底稿“音量提示”“重要任务”“硬件告警”没有丢，而是按 9 月 27 日提交 0200431 标“已停用”（f-volume、f-tasks、f-hw-alert）：底稿是删前写的，源码已删，按本人“退役就是删除”只在已停用组列一行。",
    "旧网站的“六卡满载演示”“硬件告警演示”“浮层落点设计图”三张图不用：前两张是合成演示，含已删功能；第三张是策略图，不是屏幕上的样子。",
    "9 月 15 日指标服务一天被拉起 173 次（北京 11:00–15:59 有 169 次）：原因没查清，不上页面，写进 audit.md。",
    "“窗口保护累计搬移 2293 次”没上页面：搬的是什么窗口没查清，可能是来回拉扯，写进 audit.md。"
   ],
   "unsure": [
    "第 4 屏插画里的字是示意内容，不是真实记录：“晴天 · 周杰伦”“已玩 1:26:43”“验证码 ••••••”（审稿后已把像真码的数字换成圆点，并加了“示意”图注）“快递已到驿站”“会议改到下午三点”。歌名和游戏会让人以为是本人真在听、在玩；本人介意就换成别的，或者换成“歌名 · 歌手”这种中性写法。",
    "替本人口吻或转述本人的句子（上线前请本人过目）：第 9 屏“9 月 27 日本人终审时说，温度一高 CPU 会自己降频，温度告警意义不大”（原话 ZS33“硬件告警可能没什么用，因为温度高CPU就降频，就没有温度了”）；第 14 屏“本人看过新版曲面屏，‘粗看正常’”（PCConfig 待验收记录 9 月 28 日 13:4x 本人回复）。",
    "机箱屏天气 9 月 28 日不工作（快照 status=stale、18080 端口没人监听），9 月 29 日凌晨提交 4cb2cb7 修好：天气小服务改为带上配置启动、启动失败记下原因；修复对话报 01:56 实发画面有“20°C 阵雨 / AQI 70 / 湿度 95%”，我没有自己看实体屏。f-case-weather 已按此改；坏的根因提交里没写，页面没写原因。",
    "“现在”横条的 panel 槽位：看板接口目前不读 stream-heartbeat.json，第 2 批要接；接不上时框里会一直是“暂时读不到”。",
    "第 10 屏“8 月 26 日一上午被拉起 759 次、13:48 加自愈后停了”：次数按指标服务的启动日志数；“串口卡死”是按提交标题和时间吻合推断，当天的看门狗日志已轮换掉，没有直接记录。",
    "第 6 屏〔待验收清单〕链到 /cockpit/#pending，这个锚点第 2 批驾驶舱是否用这个名字未定。",
    "状态判断：Win+F1 清屏、手动启动、两个修复脚本、看门狗崩溃自动拉起、串流虚拟屏窗口回主屏、3 秒整帧模式都标“说不准”（用了不留记录、也没找到真实调用）；曲面屏六类按本人 ZS13/ZS33 自己列出的“看什么”标“在用”。",
    "旧网站用的曲面屏截图背景是 Wallpaper Engine 的第三方动态壁纸画作，公开放上去有没有版权顾虑，请 Claude 定；要避开就换 8 月 7 日那张（out\\hs2-live-capture.png，也是第三方壁纸）或只画插画。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/pc-panel-hub/page.json",
  "sha256": "d2aabb05975cf34a02fcdb0bf4c937d60e4c553c16f68e5be98f17ee7694ade8",
  "converted_at_beijing": "2026-10-22T08:32:32+08:00"
 }
}
---

::screen{#pc-panel-hub-01 section="top"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“双屏信息中心”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：一台侧透机箱，机箱内侧竖着一条细长的小屏（上面只画浅绿色的小卡片和一条小折线，不画字），机箱顶部水冷头上一块弯弯的曲面屏（上面只画一个大号时钟形状和两三张半透明小卡片的轮廓，不画字）；机箱旁一部手机，手机和曲面屏之间一条虚线小箭头。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一只秒表、一串小方块像胶片、六个小图标排成一圈（钟、音符、手机、电池、耳机、手柄）、一个带钟面的小齿轮。数字卡下面一条细长的圆角横条：最左写“现在”，接着小字“看门狗”和一个留空的浅色圆角小框（约横条宽度的 25%），再是小字“机箱屏画面”和同样大小的空框，最右一个按钮〔现在正不正常 → 驾驶舱〕；两个空框里什么都不画，网页程序会往里填字。横条下面一行放两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔GitHub〕（GitHub 按钮左边画 GitHub 的小猫标志）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、“现在”横条改成竖排三行（“现在”一行，“看门狗”加空框一行，“机箱屏画面”加空框一行，空框占整行宽约 70%），驾驶舱按钮单独一行，最后两个按钮上下各一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#pc-panel-hub"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#pc-panel-hub"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/PC-Panel-Hub"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/pc-panel-hub/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "panel"
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
     "size": "large",
     "row": "hero",
     "width": "48%",
     "text_ref": "双屏信息中心"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "抬眼就知道",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "labels": [
      "看门狗",
      "机箱屏画面"
     ],
     "text_ref": "现在",
     "frame_mode": "plain",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "机箱里有两块"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "width": "52%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "illustration": "left_inside",
     "card_count": 4,
     "text_ref": "1.0秒一刷"
    },
    {
     "type": "action_button",
     "align": "center",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "横版标题、两段介绍在左，机箱手机大插画右；数字卡一排四张，图标在卡左；竖版介绍后插画，数字2×2，图标仍左；原竖图未画复制按钮，定稿要求补齐第三个按钮；现在条两处真实空框，保留标签。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "双屏信息中心"
    },
    {
     "type": "prose",
     "text_ref": "抬眼就知道",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "labels": [
      "看门狗",
      "机箱屏画面"
     ],
     "text_ref": "现在",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "card_count": 4,
     "text_ref": "1.0秒一刷"
    },
    {
     "type": "prose",
     "text_ref": "机箱里有两块"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "action_button",
     "align": "center",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "横版标题、两段介绍在左，机箱手机大插画右；数字卡一排四张，图标在卡左；竖版介绍后插画，数字2×2，图标仍左；原竖图未画复制按钮，定稿要求补齐第三个按钮；现在条两处真实空框，保留标签。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "1 秒一刷｜机箱屏 480×1920，时钟每秒跳一下",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "85,063 帧｜9 月 27 日 21:27 到 28 日 21:22 连续发给机箱屏，0 次失败",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "6 类｜曲面屏只放时钟、音乐、手机通知、系统事件、手机电量、Steam 游戏",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "1 个自动任务｜登录后隐身启动，两块屏都由它照看",
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
   "asset": "_library/illustrations/main-pc-panel-hub.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-pc-panel-hub",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，机箱内侧竖着一条细长的小屏（上面只画浅绿色的小卡片和一条小折线，不画字），机箱顶部水冷头上一块弯弯的曲面屏（上面只画一个大号时钟形状和两三张半透明小卡片的轮廓，不画字）；机箱旁一部手机，手机和曲面屏之间一条虚线小箭头。",
   "sha256": "3692e58386f2440b20e173e2a6aaef1ac68d2bc97a1d1483ad20e4c2741a7fe8",
   "status": "ready",
   "original_elements": [
    "一台侧透机箱，机箱内侧竖着一条细长的小屏（上面只画浅绿色的小卡片和一条小折线，不画字），机箱顶部水冷头上一块弯弯的曲面屏（上面只画一个大号时钟形状和两三张半透明小卡片的轮廓，不画字）；机箱旁一部手机，手机和曲面屏之间一条虚线小箭头"
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
   "asset": "_library/titles/title-a7d6625f8c31e6debfc1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a7d6625f8c31e6debfc1",
   "title_text": "双屏信息中心",
   "sha256": "244ec5498f58e72f62a35754b5203dc411b94861cfd9e71242f0d2f0ae936772",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

双屏信息中心

抬眼就知道电脑状态、时间和手机提醒。

机箱里有两块小屏：一条竖着的机箱屏，每秒刷新一次，把 CPU、显卡、帧率、内存、网速、硬盘排成一整条；水冷头上一块曲面 OLED，平时只有时钟和手机电量，放歌、玩游戏、手机来消息或验证码时才冒出一张卡片。开机登录后自己启动，睡眠、唤醒、屏幕掉线都由一个看门狗照看，平时不用管。

**1.0 秒一刷**｜机箱屏 480×1920，时钟每秒跳一下
**85,063 帧**｜9 月 27 日 21:27 到 28 日 21:22 那一次连续发送里，电脑这边记下的帧数，0 次失败；这是当时的记录，之后未重新核对
**6 类**｜曲面屏只放时钟、音乐、手机通知、系统事件、手机电量、Steam 游戏
**1 个自动任务**｜登录后隐身启动，两块屏都由它照看

现在　看门狗　机箱屏画面　〔现在正不正常 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#pc-panel-hub-02 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-02",
  "section": "usage",
  "title": "每天发生什么",
  "scene": "横版画面：左上标题。中间一条横向的水彩绿色丝带时间轴，从左到右五个小旗：开机登录、白天、离开电脑、睡眠、唤醒；每个小旗下面一个小水彩图标（钥匙、太阳、咖啡杯、月亮、闹钟）和两三行小字。时间轴下面左右两张小卡片：左“两个热键”（画一只手按着键盘上高亮的 Win 和 F1、F2 键），右“平时要做什么”。卡片里的字都写在下面。",
  "portrait": "竖版：标题；时间轴改成竖向，五个小旗从上到下；两张小卡片上下各一张。",
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
     "text_ref": "每天发生什么"
    },
    {
     "type": "timeline",
     "columns": 5,
     "columns_v": 1,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "outside",
     "card_count": 5,
     "text_ref": "开机登录"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "两个热键"
    }
   ],
   "notes": "五面绿旗沿丝带连接，横版图标在旗下、说明在图标下且不包卡；竖版丝带左、图标中、说明右；底部两张侧插画卡，横并列竖顺排。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "每天发生什么"
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "card_count": 5,
     "text_ref": "开机登录"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "两个热键"
    }
   ],
   "notes": "五面绿旗沿丝带连接，横版图标在旗下、说明在图标下且不包卡；竖版丝带左、图标中、说明右；底部两张侧插画卡，横并列竖顺排。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "钥匙",
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
   "asset": "_library/icons/scene-r3-pc-panel-hub-02-icons-1-5c313602.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "太阳工具",
   "source_phrase": "太阳",
   "sha256": "d0e41489563fcc07588832722242a5bd4f9a8a5b0088755d504e6249cf33ddb1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/咖啡杯.png",
   "fallback": false,
   "semantic_status": "request_explicit_named_object",
   "key": "咖啡杯",
   "source_phrase": "咖啡杯",
   "sha256": "62e5f0f1ea9acd5784aba8a281da5f15cc03f5379895e3574384842528f9fa7d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-pc-panel-hub-02-icons-3-917705b6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "月亮",
   "source_phrase": "月亮",
   "sha256": "f12ce386cffa21ef65a6127dfea79c182cc811877b800a4a53c7f8329b37456e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-pc-panel-hub-02-icons-4-617bcd49.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "时钟",
   "source_phrase": "闹钟",
   "sha256": "68b82ad9698642bf5ed401705dfe6178d31d3ed06b45e3e7bf5bceb3fcb966cb",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9f722e0a558a3d6add5e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9f722e0a558a3d6add5e",
   "title_text": "每天发生什么",
   "sha256": "deab014424e0e51fe9cb2c9adbf77c040af5aa8f4ca12e5ed1a1ec925bbeebe0",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

每天发生什么

**开机登录**｜计划任务隐身拉起看门狗，看门狗再拉起机箱屏的取数、画图程序和曲面屏浮层；机箱屏先亮，曲面屏等 OLED 准备好（最多约 60 秒）再出时钟。
**白天**｜机箱屏每秒刷新；曲面屏平时只剩时钟和手机电量，放网易云、开 Steam 游戏、手机来通知时才出卡片，事情过去卡片自己收起。
**离开电脑**｜什么都不用做。数据慢了机箱屏先用上一份，不会卡住不动。
**睡眠**｜机箱屏亮度调到 0；曲面屏切回自带的离线时钟。关机时两块都关掉。
**唤醒**｜看门狗重新点亮机箱屏；曲面屏已经回到副屏就不去动它，没回来时等它稳定 30 秒再试一次，认不准就等；然后把浮层接上。

**两个热键**
Win+F1：清掉看过的通知和事件，正在放的歌、正在玩的游戏、来电留着。
Win+F2：曲面屏时钟显示或隐藏，重启后记得。

**平时要做什么**
不用管。机箱屏时钟不跳了、曲面屏没亮，直接跟 AI 说“看看两块小屏”。

::screen{#pc-panel-hub-03 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-03",
  "section": "usage",
  "title": "机箱屏：一整条电脑状态",
  "scene": "横版画面：左上标题和一行导语。右侧约 22% 宽、几乎整屏高的位置留一个带细浅绿边框的竖长空位（宽高比 1:4，给机箱屏真实截图，拼页时原样贴上去），空位下方一行小字图注。左侧约 70% 宽，九个编号小条从上到下排列，每条左边一个小水彩图标（钟、状态灯、芯片、显卡、胶片、内存条、波浪线、硬盘、排行榜），右边粗体名字和一行小字；每条右端画一根细细的浅绿色虚线指向右边截图里对应的那一段。左下角一张浅绿底小卡片写数据来源。",
  "portrait": "竖版：标题和导语；截图放大居中占整行宽约 60%，图注在下；九个小条改成一行一条；数据来源卡片在最后。",
  "links": [
   {
    "text": "电脑使用记录",
    "href": "/projects/timeaudit/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/2fce3f87cf699468a9d7a52d01c43f066beb5aa82607e1a24ed3f029e49d5cac.webp",
    "where": "右侧约 22% 宽、几乎整屏高的竖长空位（宽高比 1:4），带细浅绿边框",
    "caption": "8 月 30 日发给机箱屏的真实一帧（天气地点和前台程序名已遮住）",
    "frame_bindings": {
     "h": {
      "DC7B22DD88E571E9B30B80F52C1F4D8879E90D3CD051B96F962750C05EDAD8EF": [
       1381,
       23,
       1594,
       823
      ]
     },
     "v": {
      "76FB4AB07A920D90256B140DF93646821383A75DED043BEF4364B53DF3EAEAEA": [
       295,
       210,
       482,
       806
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
     "align": "left",
     "size": "medium",
     "text_ref": "机箱屏：一整条电脑状态"
    },
    {
     "type": "prose",
     "text_ref": "一块 8.8"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "detail",
     "width": "76%",
     "text_ref": "1 时钟和天气",
     "item_layout": "left_inside"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "detail",
     "text_ref": "数据从哪来",
     "icons": [
      "_library/fix-round-2/icon-clean-a9b00cda4f2ae87d4b1f.png"
     ]
    },
    {
     "type": "numbered_screenshot",
     "row": "detail",
     "width": "24%",
     "ratio": "1:4",
     "indices": [
      0
     ],
     "number_ref": "1 时钟和天气"
    },
    {
     "type": "prose",
     "row": "detail",
     "text_ref": "8 月 30 日发给机箱屏"
    }
   ],
   "notes": "横版左侧九条编号细卡及数据来源卡，截图整屏右侧竖长1:4，各条右端虚线箭头指截图；竖版截图在导语后，九条单列，来源卡和图注在原v2末尾；截图内部留空。原图小标题用中号，保留角色。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。；main-closer：审查第4条的首个合法备选：九项图在左文字在右、压矮单列；九引线用480x1920源renderer实坐标，静态截图仍是合法空槽，原图/源字不改。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "机箱屏：一整条电脑状态"
    },
    {
     "type": "prose",
     "text_ref": "一块 8.8"
    },
    {
     "type": "screenshot",
     "align": "center",
     "ratio": "1:4",
     "max_width_v": "60%"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "1 时钟和天气"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "数据从哪来",
     "icons": [
      "_library/fix-round-2/icon-clean-a9b00cda4f2ae87d4b1f.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "8 月 30 日发给机箱屏"
    }
   ],
   "notes": "横版左侧九条编号细卡及数据来源卡，截图整屏右侧竖长1:4，各条右端虚线箭头指截图；竖版截图在导语后，九条单列，来源卡和图注在原v2末尾；截图内部留空。原图小标题用中号，保留角色。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "时钟和天气｜时:分:秒、日期星期；天气、空气质量、湿度",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "报警灯",
   "source_phrase": "状态条｜“系统正常”或“采集异常 N 项”，前台程序，多久更新一次（这里说的是数据取没取到，不是硬件告警）",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "CPU｜使用率大字，温度、功耗、主频、核心电压，60 秒负载曲线",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显卡",
   "source_phrase": "显卡｜使用率、温度、功耗、核心频率、电压、负载曲线",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
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
   "source_phrase": "游戏帧率｜平均帧率、1% 低帧（最卡那 1% 帧的帧率）、帧时间；没开游戏时写“等待游戏帧”",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "内存和显存｜使用率，主板和两根内存条的温度",
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
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "网络｜下载、上传速度，延迟、抖动、丢包，DPC 占用（驱动处理硬件中断占了多少 CPU，高了容易卡顿）",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "秒表",
   "source_phrase": "硬盘｜最多 4 块：型号、温度、用了多少、读写速度",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "应用排行｜最占 CPU 和内存的前 3 个程序",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显卡",
   "source_phrase": "数据从哪来：温度和功耗读LibreHardwareMonitor；显卡读NVIDIA驱动接口；CPU使用率用Windows计数器，和任务管理器对得上；帧率只读电脑使用记录采到的数据；天气和空气质量取Open-Meteo（免费的天气服务）。",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-f44750d7804bfea9d241.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f44750d7804bfea9d241",
   "title_text": "机箱屏：一整条电脑状态",
   "sha256": "33c1de6fbb707363529751dde0c045c525afde4f2944503b371f98e9deb66795",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

机箱屏：一整条电脑状态

一块 8.8 英寸、480×1920 的竖条屏，走 USB 串口。从上到下九段：

1. **时钟和天气**｜时:分:秒、日期星期；天气、空气质量、湿度
2. **状态条**｜“系统正常”或“采集异常 N 项”，前台程序，多久更新一次（这里说的是数据取没取到，不是硬件告警）
3. **CPU**｜使用率大字，温度、功耗、主频、核心电压，60 秒负载曲线
4. **显卡**｜使用率、温度、功耗、核心频率、电压、负载曲线
5. **游戏帧率**｜平均帧率、1% 低帧（最卡那 1% 帧的帧率）、帧时间；没开游戏时写“等待游戏帧”
6. **内存和显存**｜使用率，主板和两根内存条的温度
7. **网络**｜下载、上传速度，延迟、抖动、丢包，DPC 占用（驱动处理硬件中断占了多少 CPU，高了容易卡顿）
8. **硬盘**｜最多 4 块：型号、温度、用了多少、读写速度
9. **应用排行**｜最占 CPU 和内存的前 3 个程序

**数据从哪来**：温度和功耗读 LibreHardwareMonitor；显卡读 NVIDIA 驱动接口；CPU 使用率用 Windows 计数器，和任务管理器对得上；帧率只读〔电脑使用记录〕采到的数据；天气和空气质量取 Open-Meteo（免费的天气服务）。

8 月 30 日发给机箱屏的真实一帧（天气地点和前台程序名已遮住）

::screen{#pc-panel-hub-04 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-04",
  "section": "usage",
  "title": "曲面屏：只在有事时出现",
  "scene": "横版画面：左上标题和一行导语。上半部分左侧约 55% 宽留一个带细浅绿边框的横向空位（宽高比约 2.2:1，给曲面屏真实截图，拼页时原样贴上去），空位下一行小字图注。上半部分右侧一幅水彩插画：同一块弯弯的曲面屏满载时的样子——左上角大号时钟“21:30”，时钟右边一个电池图标和“86%”，左侧大区三张半透明水晶卡片（第一张“正在播放”，第二张“游戏进行中”，第三张“验证码”，码的位置画六个大圆点，不画任何数字），右侧弯折后的窄区两张卡片（“手机通知”两张，各一行标题），卡片里的字只画下面写出的这些；插画正下方一行小字图注“示意：满载时的样子，歌名、游戏、通知都是编的”。下半部分一张六行的表格，横跨整屏宽。",
  "portrait": "竖版：标题和导语；截图占整行宽，图注在下；插画占整行宽，“示意”图注在插画下；表格改成一行一类，每类下面两行小字（从哪来、显示多久）。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/30a6d0deb81e1422720be9691c5f8cfb47a36c69a4c514c0a560e2518a62a716.jpg",
    "where": "上半部分左侧约 55% 宽的横向空位（宽高比约 2.2:1），带细浅绿边框",
    "caption": "8 月 30 日曲面屏的真实画面：没事时只有手机电量和时钟",
    "frame_bindings": {
     "v": {
      "00668F515C4D9DB36A023649A053D91034CF3EA4A6867C4F073E5365B5DCF0A4": [
       32,
       357,
       909,
       682
      ],
      "006DF0836E80626E0DB45EF0243161BDE0AF2C2797D5A8C854F71788B39FED29": [
       32,
       280,
       909,
       605
      ]
     }
    },
    "crop_h": [
     164,
     0,
     792,
     216
    ],
    "crop_v": [
     164,
     0,
     792,
     229
    ]
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
     "align": "left",
     "size": "large",
     "row": "curved",
     "width": "55%",
     "text_ref": "曲面屏：只在有事时出现"
    },
    {
     "type": "prose",
     "row": "curved",
     "text_ref": "水冷头上那块"
    },
    {
     "type": "screenshot",
     "row": "curved",
     "ratio": "2.2:1"
    },
    {
     "type": "prose",
     "row": "curved",
     "text_ref": "8 月 30 日曲面屏的真实画面"
    },
    {
     "type": "document_mock",
     "row": "curved",
     "width": "45%",
     "variant": "window",
     "mock_layout": "curved_oled",
     "illustration": "outside",
     "text_ref": "21:30"
    },
    {
     "type": "prose",
     "row": "curved",
     "text_ref": "示意：满载时"
    },
    {
     "type": "table",
     "columns": 3,
     "text_ref": "显示什么"
    }
   ],
   "notes": "横版标题导语和横截图在左、满载曲面插画在右，底部三列表格六类；竖版截图→满载示意→六类竖卡。示意内部所有21:30、86%、曲目、游戏、验证码圆点、通知必须由定稿程序排字，不能裁入旧字；真实截图位留空。源节点次序不同，按原图把图注移到对应槽下；curved_oled排法须组件样张。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "曲面屏：只在有事时出现"
    },
    {
     "type": "prose",
     "text_ref": "水冷头上那块"
    },
    {
     "type": "screenshot",
     "ratio": "2.2:1"
    },
    {
     "type": "prose",
     "text_ref": "8 月 30 日曲面屏的真实画面"
    },
    {
     "type": "document_mock",
     "variant": "window",
     "mock_layout": "curved_oled",
     "illustration": "outside",
     "text_ref": "21:30"
    },
    {
     "type": "prose",
     "text_ref": "示意：满载时"
    },
    {
     "type": "table",
     "columns": 1,
     "portrait": "cards",
     "text_ref": "显示什么"
    }
   ],
   "notes": "横版标题导语和横截图在左、满载曲面插画在右，底部三列表格六类；竖版截图→满载示意→六类竖卡。示意内部所有21:30、86%、曲目、游戏、验证码圆点、通知必须由定稿程序排字，不能裁入旧字；真实截图位留空。源节点次序不同，按原图把图注移到对应槽下；curved_oled排法须组件样张。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/illustrations/机箱小屏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "机箱小屏",
   "source_phrase": "上半部分右侧一幅水彩插画：同一块弯弯的曲面屏满载时的样子——左上角大号时钟“21:30”，时钟右边一个电池图标和“86%”，左侧大区三张半透明水晶卡片（第一张“正在播放”，第二张“游戏进行中”，第三张“验证码”，码的位置画六个大圆点，不画任何数字），右侧弯折后的窄区两张卡片（“手机通知”两张，各一行标题），卡片里的字只画下面写出的这些；插画正下方一行小字图注“示意：满载时的样子，歌名、游戏、通知都是编的”。",
   "sha256": "c0c554b5039e4b92959cd1ba274b6319ecc0b7e1868636508e953e1cbbdadbbc",
   "status": "ready",
   "original_elements": [
    "弯弯的曲面屏；左上无数字时钟形状、旁边电池图标；左侧三张半透明水晶卡，验证码位置六个大圆点；右侧窄区两张通知卡，所有标题与示例数字由排版程序另放"
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
   "asset": "_library/titles/title-bebe80747d0a2a02051b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bebe80747d0a2a02051b",
   "title_text": "曲面屏：只在有事时出现",
   "sha256": "eba60d1c2c601dc4d6ef39d8017377eaf549334dd5d44649d316e1e122da9d47",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

曲面屏：只在有事时出现

水冷头上那块 2288×1048 的曲面 OLED，底下放着 Wallpaper Engine 动态壁纸；浮层是透明的，只有卡片那一小块有淡淡的水晶底，最多同时六张。

21:30　86%　正在播放 · 晴天 · 周杰伦　游戏进行中 · 已玩 1:26:43　验证码 ••••••　手机通知 · 快递已到驿站　手机通知 · 会议改到下午三点

示意：满载时的样子，歌名、游戏、通知都是编的

| 显示什么 | 从哪来 | 显示多久 |
|---|---|---|
| 时钟（只到分钟） | 北京时间 | 一直在，整分钟翻页 |
| 正在放的歌：歌名、歌手、封面 | 网易云的播放窗口和播放列表 | 播放时一直在，切歌时放大 8 秒 |
| Steam 游戏：名字、封面、这次玩了多久 | Steam 本地清单和日志 | 玩的时候一直在，退出后总结 60 秒 |
| 手机通知、来电、验证码 | 现在用的手机经电脑配置与恢复（PCConfig）的手机桥送来：浮层连上电脑本机的通道，先补最近 5 分钟的，再接实时的，同一条按编号只显示一次。10 月 20 日起不再读小米妙享、vivo 办公套件转到 Windows 通知中心的通知（“手机连接”10 月中旬已撤）。手机桥没开或断了，屏上常驻一张“手机桥未连接”，隔 2、10、30 秒再试，连上就撤掉。真实通知和验证码经这条路显示出来，还没在实体屏上验收 | 通知 60 秒，验证码 15 秒，来电响着就一直在 |
| 手机电量和充电 | 只用一个来源：配好了安卓调试连接（ADB，电脑经它只读手机的电量和充电状态）就每 5 秒问一次手机，每次最多等 2 秒，读数过 15 秒算过期；没配或配错就显示未知，不再退回小米妙享。程序自己不配对、不改手机设置；实际连上手机读电量这次没验证 | 手机连着就一直在 |
| 耳机音箱切换、断网和恢复 | Windows 的声音设备和网络状态 | 12 秒 |

8 月 30 日曲面屏的真实画面：没事时只有手机电量和时钟

::screen{#pc-panel-hub-05 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-05",
  "section": "usage",
  "title": "手机提醒怎么排",
  "scene": "横版画面：左上标题。左边约 40% 宽一幅水彩插画：一部手机，三张小通知卡片从手机里飘出来，经过一个小漏斗（漏斗上画两个重叠的相同卡片合成一张），落到一块弯弯的屏幕上，最新的一张在最下面，最上面一张淡出；漏斗旁一个小小的放大镜照着一串数字。右边约 60% 宽，六张横向小卡片两列三行，每张左边一个小图标，粗体一句加一两行小字。",
  "portrait": "竖版：标题；插画在上占整行宽；六张卡片一行一张。",
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
     "align": "left",
     "size": "large",
     "text_ref": "手机提醒怎么排",
     "row": "hero",
     "width": "55%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "width": "45%",
     "align": "center",
     "target_height": 300,
     "target_width": 502
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "最新的永远看得到"
    }
   ],
   "notes": "左标题及通知漏斗大插画占40%，右六张小卡2列3行，卡内图标左；竖版标题居中、插画整行、六卡逐张。漏斗属插画，六条原文仍是内容卡，不能改成六段漏斗。；已逐屏查看横图及全部竖版续图，文字用 page.json。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "手机提醒怎么排"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "最新的永远看得到"
    }
   ],
   "notes": "左标题及通知漏斗大插画占40%，右六张小卡2列3行，卡内图标左；竖版标题居中、插画整行、六卡逐张。漏斗属插画，六条原文仍是内容卡，不能改成六段漏斗。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "最新的永远看得到｜手机通知最多留 3 条，第 4 条来了就挤掉最旧的；最新一条放在最下面，别的卡再多也不会把它挤走。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "60 秒只算真正亮着的时间｜被来电这类更急的卡暂时挤下去时，倒计时暂停；腾出位置时，从到达算起还不满 3 分钟，它会回来；超过就不再出现。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机点桌面.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机点桌面",
   "source_phrase": "同一条只出现一次｜小米妙享和手机连接常常各转一遍同一条通知；先把全角半角、大小写、空格和标点统一，再比相似度，重复的只留一张。数字不一样（验证码、金额）一律算两条。",
   "sha256": "619cf0826fbe681d5a6ba825c5cd8caff76ae282f27a3fbde93602d3fa956fb1",
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
   "source_phrase": "验证码只认明确的｜通知里得有“验证码”这类字样，才取出 4–8 位数字放大显示；订单号、手机号、日期、取件码、邀请码、优惠码都不算。新码在原位置替换旧码；日志不记验证码。",
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
   "asset": "_library/icons/铃铛.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "铃铛",
   "source_phrase": "空通知不上屏｜“你有一条新消息”这种没有正文的通知直接过滤。",
   "sha256": "56b2a813f19362acfb646d67474d0542cda7469044b3dc36dff5f80d88d1bd91",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/铃铛.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "铃铛",
   "source_phrase": "开机不翻旧账｜启动前就有的普通通知不再弹出；还在响的来电、还在传的文件会补上。",
   "sha256": "56b2a813f19362acfb646d67474d0542cda7469044b3dc36dff5f80d88d1bd91",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/机箱小屏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "机箱小屏",
   "source_phrase": "左边约 40% 宽一幅水彩插画：一部手机，三张小通知卡片从手机里飘出来，经过一个小漏斗（漏斗上画两个重叠的相同卡片合成一张），落到一块弯弯的屏幕上，最新的一张在最下面，最上面一张淡出；漏斗旁一个小小的放大镜照着一串数字。",
   "sha256": "c0c554b5039e4b92959cd1ba274b6319ecc0b7e1868636508e953e1cbbdadbbc",
   "status": "ready",
   "original_elements": [
    "手机里三张通知卡飘出，经过小漏斗，落到弯弯屏幕；漏斗上两个重叠卡合成一张的图案；最上卡淡出，旁边小放大镜照抽象小圆点，不画数字"
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
   "asset": "_library/titles/title-01a2f644af778e3e0585.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-01a2f644af778e3e0585",
   "title_text": "手机提醒怎么排",
   "sha256": "abca1bf65fffe5e12fbd57741d83a01fc176da251e1a88b4ffb47c569725f15b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

手机提醒怎么排

**最新的永远看得到**｜手机通知最多留 3 条，第 4 条来了就挤掉最旧的；最新一条放在最下面，别的卡再多也不会把它挤走。

**60 秒只算真正亮着的时间**｜被来电这类更急的卡暂时挤下去时，倒计时暂停；腾出位置时，从到达算起还不满 3 分钟，它会回来；超过就不再出现。

**同一条只出现一次**｜同一条通知可能被转来不止一遍；先把全角半角、大小写、空格和标点统一，再比相似度，重复的只留一张。数字不一样（验证码、金额）一律算两条。

**验证码只认明确的**｜通知里得有“验证码”这类字样，才取出 4–8 位数字放大显示；订单号、手机号、日期、取件码、邀请码、优惠码都不算。新码在原位置替换旧码；日志不记验证码。

**空通知不上屏**｜“你有一条新消息”这种没有正文的通知直接过滤。

**开机不翻旧账**｜启动前就有的普通通知不再弹出；还在响的来电、还在传的文件会补上。

::screen{#pc-panel-hub-06 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-06",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。一张四列的表格占上面约四分之三（表头浅绿底，每行左边一个小水彩图标）。表格下面左右两张小卡片：左“自己动手”，右“要等本人验收的”。",
  "portrait": "竖版：标题；表格改成一行一条卡片（现象粗体，下面“它自己会做”和“跟 AI 说”各一行）；两张小卡片上下各一张。",
  "links": [
   {
    "text": "待验收清单",
    "href": "/cockpit/#pending"
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
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "table",
     "columns": 3,
     "portrait": "cards",
     "illustration": "left_inside",
     "text_ref": "看到什么"
    },
    {
     "type": "content_card",
     "text_ref": "自己动手",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "followups",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "要等本人验收的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "followups",
     "width": "50%"
    }
   ],
   "notes": "原横图实际三列表格（描述称四列，文字以三列定稿为准），底部自己动手和待验收两卡左右；竖版七条问题逐卡，前三格标签来自表头，重复表头须data-echo，随后两卡上下。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "table",
     "columns": 1,
     "portrait": "cards",
     "illustration": "left_inside",
     "text_ref": "看到什么"
    },
    {
     "type": "content_card",
     "text_ref": "自己动手",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "要等本人验收的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none"
    }
   ],
   "notes": "原横图实际三列表格（描述称四列，文字以三列定稿为准），底部自己动手和待验收两卡左右；竖版七条问题逐卡，前三格标签来自表头，重复表头须data-echo，随后两卡上下。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "看到什么｜它自己会做｜还不行，跟 AI 说",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "机箱屏时钟不跳了｜看门狗每轮查心跳：帧号不涨、整帧重画没按时，都算坏了；等旧程序放开串口、冷却 30 秒，再起一套新的｜“机箱屏冻住了”：AI 跑修复脚本，认准那一个 USB 串口再重启",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "机箱屏不亮、串口没反应｜只重启那一个 USB 串口设备（见亮点）｜“机箱屏黑了”",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "曲面屏没亮或没有卡片｜开机、唤醒时设法切回副屏，认不准就等（见亮点）｜“曲面屏没显示”：AI 查设备和日志；要动硬件时先核对集线器和端口，用管理员权限单独跑修复",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "程序窗口跑到曲面屏上｜每 250 毫秒看一眼，把普通窗口悄悄搬回主屏；壁纸、浮层、桌面不碰｜“窗口老往水冷屏跑”",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "显示器变化后动态壁纸停了｜三块屏都正常 30 秒后，让 Wallpaper Engine 停一下再播，15 分钟最多一次｜“壁纸不动了”",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "Windows 设备管理器里曲面屏报 Code 10（设备无法启动，多半是供电或接线）｜立刻停手，不重试｜关机断电，查 USB 排针、线和辅助供电",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
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

出事怎么办

| 看到什么 | 它自己会做 | 还不行，跟 AI 说 |
|---|---|---|
| 机箱屏时钟不跳了 | 看门狗每轮查心跳：帧号不涨、整帧重画没按时，都算坏了；等旧程序放开串口、冷却 30 秒，再起一套新的；旧程序 30 秒内没停干净，就先推迟、下一轮再试，不起第二个程序抢屏 | “机箱屏冻住了”：AI 跑修复脚本，认准那一个 USB 串口再重启 |
| 机箱屏不亮、串口没反应 | 只重启那一个 USB 串口设备（见亮点） | “机箱屏黑了” |
| 曲面屏没亮或没有卡片 | 开机、唤醒时设法切回副屏，认不准就等（见亮点） | “曲面屏没显示”：AI 查设备和日志；要动硬件时先核对集线器和端口；实际修复需要时自动提权，预检不提权 |
| 曲面屏的卡片落到别处、只露一半 | 看门狗查浮层时核对窗口是不是整块落在曲面屏里；曲面屏位置变了、浮层还停在旧坐标，就让浮层重新贴回去，不改显示布局，也不重启机箱屏推流（10 月 1 日起） | “曲面屏卡片位置不对” |
| 程序窗口跑到曲面屏上 | 每 250 毫秒看一眼，把普通窗口悄悄搬回主屏；壁纸、浮层、桌面不碰 | “窗口老往水冷屏跑” |
| 显示器变化后动态壁纸停了 | 同一个 250 毫秒的桌面保护发现显示器变了，等 2 秒，请已经开着的 Wallpaper Engine“继续播放”，不先停、不换场景；同一次变化最多试 3 次。请求发出去，不等于壁纸真的动了 | “壁纸不动了” |
| Windows 设备管理器里曲面屏报 Code 10（设备无法启动，多半是供电或接线） | 立刻停手，不重试 | 关机断电，查 USB 排针、线和辅助供电 |
| 机箱屏写着“天气暂无” | 其他数据照常 | “机箱屏天气没了” |

**自己动手**：双击桌面的“TURZX SideScreen Start”，或项目里的 start-side-screen.cmd，整套重新拉起。

**要等本人验收的**：电脑睡眠时机箱屏会不会及时关掉，还没实测过（〔待验收清单〕里有这一条）；动态壁纸是不是真的重新动起来，也还没在实体屏上专门看过。

::screen{#pc-panel-hub-07 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-07",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。上下两条从左到右的流程图，每个节点一张圆角小卡片带小水彩图标，绿色箭头相连；节点下一两行小字。上面一条“机箱屏”（图标：温度计和芯片、齿轮、画板、USB 插头、竖条屏），下面一条“曲面屏”（图标：手机、钟和音符、水晶卡片、曲面屏）。两条流程的左边竖着一张“看门狗”卡片（小狗看着两个屏幕的水彩图标），两根细线分别连到两条流程。最下面一行三张小数字卡。",
  "portrait": "竖版：标题；看门狗卡片在最上；两条流程各自改成从上到下；三张数字卡一行一张。",
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
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "connector_targets": [
      "case",
      "oled"
     ],
     "text_ref": "看门狗",
     "connector_target_refs": {
      "case": "机箱屏这一条",
      "oled": "曲面屏这一条"
     },
     "icon_size": 120
    },
    {
     "type": "section_heading",
     "row": "pipelines",
     "width": "50%",
     "size": "medium",
     "text_ref": "机箱屏这一条"
    },
    {
     "type": "flow",
     "row": "pipelines",
     "columns": 2,
     "connector": "arrow",
     "illustration": "top_inside",
     "text_ref": "1 采数据",
     "item_rows": [
      2,
      2,
      1
     ]
    },
    {
     "type": "section_heading",
     "row": "pipelines",
     "size": "medium",
     "text_ref": "曲面屏这一条",
     "width": "50%"
    },
    {
     "type": "flow",
     "row": "pipelines",
     "columns": 2,
     "connector": "arrow",
     "illustration": "top_inside",
     "text_ref": "1 来源",
     "item_rows": [
      2,
      1,
      1
     ]
    },
    {
     "type": "stat_card",
     "columns": 3,
     "illustration": "left_inside",
     "card_count": 3,
     "text_ref": "38,788行代码（C#、PowerShell、Python）146个C#单元测"
    }
   ],
   "notes": "横版看门狗竖卡在左，两根细箭头连接右侧上下两条流程（5站、4站），底部三数字卡；竖版看门狗在顶，两流程依次纵向箭头，末尾原v2实际一排三张数字卡，按图保留；不按描述改成单张一行。；已逐屏查看横图及全部竖版续图，文字用 page.json。；main-closer：看门狗两细线连接两条实际DOM流程，唯一原组名确定目标，不猜底图部位。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "看门狗"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "机箱屏这一条"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1 采数据"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "曲面屏这一条"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1 来源"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "card_count": 3,
     "text_ref": "38,788行代码（C#、PowerShell、Python）146个C#单元测"
    }
   ],
   "notes": "横版看门狗竖卡在左，两根细箭头连接右侧上下两条流程（5站、4站），底部三数字卡；竖版看门狗在顶，两流程依次纵向箭头，末尾原v2实际一排三张数字卡，按图保留；不按描述改成单张一行。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "温度计和芯片",
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
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "齿轮",
   "source_phrase": "齿轮",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "画板",
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
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "USB 插头",
   "sha256": "9f19b0993d47ecb67a994c3988d36efb98a1b9dca540cacc914abb5755b33ebe",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/竖条机箱屏.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "竖条机箱屏",
   "source_phrase": "横版画面：左上标题。上下两条从左到右的流程图，每个节点一张圆角小卡片带小水彩图标，绿色箭头相连；节点下一两行小字。上面一条“机箱屏”（图标：温度计和芯片、齿轮、画板、USB 插头、竖条屏），下面一条“曲面屏”（图标：手机、钟和音符、水晶卡片、曲面屏）。两条流程的左边竖着一张“看门狗”卡片（小狗看着两个屏幕的水彩图标），两根细线分别连到两条流程。最下面一行三张小数字卡。",
   "sha256": "aeb99526283670421fb48ac1a432e11a63fff675d3473438718579fb22bc8aee",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "钟和音符",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-pc-panel-hub-07-icons-2-f2e0de5c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-pc-panel-hub-07-icons-2-f2e0de5c",
   "source_phrase": "水晶卡片",
   "sha256": "47d718048b5b76f55691f2d89dd095bd53de9077872c02ce5ad406d54cbab93d",
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
   "source_phrase": "曲面屏",
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
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
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

它是怎么搭的

**看门狗**（PowerShell）｜计划任务在登录时隐身启动它；它拉起下面所有程序、盯心跳、管睡眠唤醒、找回曲面屏。搬窗口和叫醒壁纸交给它带着的一个小循环，每 250 毫秒看一眼，看门狗在它就一直在；小循环不在时，看门狗用一套更保守的老办法顶上。查浮层健康时核对浮层窗口的坐标是不是整块落在目标屏范围里，不只信 Windows 返回的“离它最近的显示器”；目标屏挪了、浮层坐标越界，就请求既有浮层重绑，只重新激活浮层，不改显示器布局、不重启 TURZX 推流（提交 7fc80cf，10 月 1 日）。

**机箱屏这一条**
1. 采数据｜LibreHardwareMonitor、NVIDIA 驱动接口、Windows 计数器、电脑使用记录的帧率、Open-Meteo 天气
2. 指标服务（Python）｜本机接口，每秒出一份快照，给每项数据打可信度分
3. 画图（C#）｜每秒画一张 480×1920 的图，时钟自己算
4. 串口发送｜每秒只发变了的部分，定期整帧重画（见下一屏）
5. 机箱屏

**曲面屏这一条**
1. 来源｜电脑配置手机桥经本机通道送来的手机通知（不再读 Windows 通知中心里的小米妙享、vivo 办公套件）、手机电量（只走安卓调试连接 ADB，没配就是未知）、网易云播放窗口、Steam 本地清单、Windows 声音和网络状态
2. 排卡片（C# 核心库）｜优先级、显示多久、去重、排版，不碰屏幕，能单独测试
3. 浮层（WinUI 3）｜透明、不抢焦点、鼠标能穿过去的窗口，只认 2288×1048 的那块屏；装在固定的永久目录里，不从容易被清掉的编译输出运行；10 月 22 日读到正在运行的是包版本 1.0.0.7（进程 10 月 21 日 04:47 启动；10 月 20 日早上是 1.0.0.4，9 月 28 日验收时是 1.0.0.2），这只说明在跑哪一版，不是实体屏验收
4. 曲面屏｜由 LIAN LI 的 L-Connect 服务切成 Windows 副屏

**38,788 行**｜代码（C#、PowerShell、Python）
**146 个**｜C# 单元测试定义（只计数，按 10 月 6 日最后一次提交数的），另有 21 个测试脚本
**93 次**｜提交（7 月 5 日–10 月 6 日）

::screen{#pc-panel-hub-08 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-08",
  "section": "tech",
  "title": "机箱屏怎么做到每秒一刷又不冻住",
  "scene": "横版画面：左上标题。上半部分一条横向的帧条（像一卷胶片，一格一秒）：大部分格子是浅绿色细格（写“只发变化”），每隔一段有一格深绿色粗格（写“整帧重画”）；胶片开头三格深绿间隔更密，旁边小字标 60、120、180；胶片下方一条小括号标出“约 15 分钟”。下半部分四张横向小卡片两列两行，每张一个小图标、粗体一句加小字。",
  "portrait": "竖版：标题；胶片改成竖向一列；四张卡片一行一张。",
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
     "text_ref": "机箱屏怎么做到每秒一刷又不冻住"
    },
    {
     "type": "segmented_band",
     "variant": "film",
     "direction": "horizontal",
     "connector": "none",
     "illustration": "none",
     "text_ref": "只发变化",
     "highlight": [
      2
     ]
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "整帧太慢"
    }
   ],
   "notes": "横版全宽胶片在上、四卡2×2在下；竖版实际为左22%竖胶片、右78%四卡一列，保持并排（row_v）。胶片上只发变化、整帧重画、60/120/180/约15分钟全部来自一条定稿节点，只显示一次，装饰格不得另造字。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "机箱屏怎么做到每秒一刷又不冻住"
    },
    {
     "type": "segmented_band",
     "variant": "film",
     "direction": "vertical",
     "connector": "none",
     "illustration": "none",
     "text_ref": "只发变化",
     "highlight": [
      2
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "整帧太慢"
    }
   ],
   "notes": "横版全宽胶片在上、四卡2×2在下；竖版实际为左22%竖胶片、右78%四卡一列，保持并排（row_v）。胶片上只发变化、整帧重画、60/120/180/约15分钟全部来自一条定稿节点，只显示一次，装饰格不得另造字。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "整帧太慢，只发变化太悬｜这块屏认两种命令：整帧重画屏会回话，但发一帧要约 2.3 秒；只发变了的部分快得多（一般几十毫秒），可屏幕不回话，发丢了也不知道。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "所以两样一起用｜平时每秒只发变化；每 900 帧（约 15 分钟）重开一次串口、整帧重画一次，停约 2.5 秒；每次启动后第 60、120、180 帧再各多做一次，防止屏幕没跟上新会话。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "慢了就用旧数据，不等｜取数有自己的截止时间，指标服务慢了就用上一份好数据：数字旧一两秒，也比屏幕看起来卡住强。发一帧超过 10 秒就退出，让看门狗重开程序和串口。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "写成功不等于屏上亮了｜这块屏没法回读像素，所以看门狗查的是帧号、周期、整帧重画有没有按时；最后认不认，要人看一眼实体屏。另有一个 3 秒整帧的保守模式，只在排查兼容问题时手动打开。",
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
   "asset": "_library/titles/title-2b0716b7e0a0d87f384b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2b0716b7e0a0d87f384b",
   "title_text": "机箱屏怎么做到每秒一刷又不冻住",
   "sha256": "df7630bdff95f99ce63dc1a50571e4017d1b11618ecb72e760c36de188dbb833",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

机箱屏怎么做到每秒一刷又不冻住

只发变化　整帧重画　60　120　180　约 15 分钟

**整帧太慢，只发变化太悬**｜这块屏认两种命令：整帧重画屏会回话，但发一帧要约 2.3 秒；只发变了的部分快得多（一般几十毫秒），可屏幕不回话，发丢了也不知道。

**所以两样一起用**｜平时每秒只发变化；每 900 帧（约 15 分钟）重开一次串口、整帧重画一次，停约 2.5 秒；每次启动后第 60、120、180 帧再各多做一次，防止屏幕没跟上新会话。

**慢了就用旧数据，不等**｜取数有自己的截止时间，指标服务慢了就用上一份好数据：数字旧一两秒，也比屏幕看起来卡住强。发一帧超过 10 秒就退出，让看门狗重开程序和串口。

**写成功不等于屏上亮了**｜这块屏没法回读像素，所以看门狗查的是帧号、周期、整帧重画有没有按时；最后认不认，要人看一眼实体屏。另有一个 3 秒整帧的保守模式，只在排查兼容问题时手动打开。

::screen{#pc-panel-hub-09 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-09",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。六张横向小卡片两列三行，每张左边一个小水彩图标（两块屏各指一个方向的路牌、一张被遮住一半的歌词纸、一本只能看不能写的书、一个只有一把钥匙的钥匙圈、一台看不见窗口的电脑、一只眼睛看着实体屏），右边粗体一句加一两行小字。最下面一条横跨整屏的浅绿细卡片写一句结语。",
  "portrait": "竖版：标题；六张卡片一行一张；结语卡片在最后。",
  "links": [
   {
    "text": "约法 L28",
    "href": "/rules/charter/#L28"
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
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "两块屏各管各的",
     "illustration_positions": [
      "left_inside",
      "left_inside",
      "left_inside",
      "top_inside",
      "left_inside",
      "left_inside"
     ]
    },
    {
     "type": "notice",
     "align": "center",
     "illustration": "left_inside",
     "text_ref": "曲面屏少放东西不是偷懒",
     "icons": [
      "_library/icons/报警灯.png"
     ]
    }
   ],
   "notes": "六卡横2列3行、竖逐张，插画均卡内左，最后整宽淡绿结语卡。结语中本人终审原话逐字保留，不添加解释。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "两块屏各管各的"
    },
    {
     "type": "notice",
     "align": "center",
     "illustration": "left_inside",
     "text_ref": "曲面屏少放东西不是偷懒",
     "icons": [
      "_library/icons/报警灯.png"
     ]
    }
   ],
   "notes": "六卡横2列3行、竖逐张，插画均卡内左，最后整宽淡绿结语卡。结语中本人终审原话逐字保留，不添加解释。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/icons/scene-r3-panel-two-screen-signpost.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-panel-two-screen-signpost",
   "source_phrase": "两块屏各指一个方向的路牌",
   "sha256": "e477f3f17372c135b9bca30a59493a580698c6c7595b0666a541732e2c0a927f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-panel-half-covered-lyrics.png",
   "fallback": false,
   "semantic_status": "independent_actual_indeterminate",
   "key": "scene-r3-panel-half-covered-lyrics",
   "source_phrase": "一张被遮住一半的歌词纸",
   "sha256": "017f547789f67b8d6a057c6a0391bec891c5ad2425baf1f4f4989381fedf66c4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-panel-read-only-book.png",
   "fallback": false,
   "semantic_status": "independent_actual_rejected",
   "key": "scene-r3-panel-read-only-book",
   "source_phrase": "一本只能看不能写的书",
   "sha256": "c8bf03d5870fce5d0cdf6ba11d2096641fc39457dccd4d7590ef7b9189ce7de7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-panel-one-key-ring.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-panel-one-key-ring",
   "source_phrase": "一个只有一把钥匙的钥匙圈",
   "sha256": "958eb6a9349fd89dc296f67333a03eddce45d74bbbd8c34af0c811076924b2f6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-panel-windowless-computer.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-panel-windowless-computer",
   "source_phrase": "一台看不见窗口的电脑",
   "sha256": "21ec97964d4ec82b53d60c8955b886081add2cdfefcc78e2ad719d0ba6d87aee",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-panel-eye-physical-screen.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-panel-eye-physical-screen",
   "source_phrase": "一只眼睛看着实体屏",
   "sha256": "33671781afe43d3df289be97ac238b3b58ffd929d3000f3d02c8fd15ff6fe1f8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "报警灯",
   "source_phrase": "曲面屏少放东西不是偷懒：9月27日本人终审时说，温度一高CPU会自己降频，温度告警意义不大，于是这块屏只留下每天真会看的六类。",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "报警灯",
   "source_phrase": "曲面屏少放东西不是偷懒：9月27日本人终审时说，温度一高CPU会自己降频，温度告警意义不大，于是这块屏只留下每天真会看的六类。",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
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

为什么这样设计

**两块屏各管各的**｜机箱屏放密的数字，曲面屏只放一眼就懂的事；一块屏出问题，不拿另一块的状态顶替。

**宁可不显示，也不显示错**｜歌名要和播放列表里的“歌名＋全部歌手”精确对上才显示；网易云给不出可靠的播放位置，所以不放歌词和进度条。

**只读别人的，只给必要的**｜帧率只读电脑使用记录的数据库，不改它的项目；给网站的网络接口只有延迟、抖动、丢包和 DPC，不带程序名、网卡名和地址。

**睡眠只有一个负责人**｜睡眠和唤醒都由常驻看门狗处理，旧的“唤醒后重启”任务先停用，9 月 29 日连脚本也删了，免得两个程序抢着开关屏。

**后台不打扰**｜自动启动的程序全部隐藏窗口，不弹黑框（〔约法 L28〕）；浮层不抢焦点，鼠标能穿过去。

**位置看坐标，不看名字**｜判断浮层在不在曲面屏上，要核对窗口坐标是否整块落在屏幕范围里；Windows 说的“最近的显示器”只说明离哪块屏近，曲面屏挪过位置后，浮层可能还停在旧坐标（10 月 1 日修过这种漂移）。

**看实体屏才算数**｜编译通过、进程在跑、串口写成功，都不能代替看一眼真的屏幕。

曲面屏少放东西不是偷懒：9 月 27 日本人终审时说，温度一高 CPU 会自己降频，温度告警意义不大，于是这块屏只留下每天真会看的六类。

::screen{#pc-panel-hub-10 section="highlights"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-10",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：和标杆页“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一个心电图一样的绿色心跳线，线下一串小胶片格子；2 一根 USB 线上一个小扳手，旁边一个写着 759 的小计数牌；3 一只手停在两个一模一样的小盒子前（一个标问号）。",
  "portrait": "竖版：三张卡片一行一张，插画在各自卡片顶部。",
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
     "type": "content_card",
     "columns": 3,
     "columns_v": 3,
     "illustration": "top_inside",
     "connector": "none",
     "size": "large",
     "text_ref": "程序活着",
     "icons": [
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    }
   ],
   "notes": "无章节标题，三张亮点大卡横排/竖单列，插画在每卡顶内，标题大号粗体。759计数牌若复用必须抠除字再由定稿节点覆盖，不能重复画759。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "size": "large",
     "text_ref": "程序活着",
     "icons": [
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    }
   ],
   "notes": "无章节标题，三张亮点大卡横排/竖单列，插画在每卡顶内，标题大号粗体。759计数牌若复用必须抠除字再由定稿节点覆盖，不能重复画759。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显示器",
   "source_phrase": "程序活着，不等于屏幕在动。 \n机箱屏最难查的坏法是“冻住”：进程都在，画面却停在某一秒。所以看门狗不看进程，看心跳里的帧号、周期和整帧重画是否按时。9月27日21:27到28日21:22，它连续发了85,063帧，失败0次。",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "一上午被拉起 759 次，之后只修那一根线。 \n8月26日8点到14点，机箱屏的USB串口卡住，取数程序被一遍遍重新拉起，6个小时759次。13:48加了自愈：调亮度连续失败3次，就只重启那一个USB串口设备，5分钟最多一次，别的都不碰；那天后来只再拉起过4次。9月21日00:45它自己修好过一次。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "认不准，宁可停手。 \n曲面屏掉线时，最省事的办法是重启USB集线器、扫一遍设备，可同一个集线器上还挂着别的东西。它的做法是：只认已经对上号的那台设备，每次开机或唤醒只试一次；认不准就等，报Code10就停下来，提示断电查线。",
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
   "asset": "_library/illustrations/ill-315f81ae4bf196.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-315f81ae4bf196",
   "source_phrase": "插画：1 一个心电图一样的绿色心跳线，线下一串小胶片格子；2 一根 USB 线上一个小扳手，旁边一个写着 759 的小计数牌；3 一只手停在两个一模一样的小盒子前（一个标问号）。",
   "sha256": "2f319e19345b69cd6ef0de998f3e66f82a921c50b40c3255d775e1ae8fd5398f",
   "status": "ready",
   "original_elements": [
    "一个心电图一样的绿色心跳线，线下一串小胶片格子"
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
   "asset": "_library/icons/扳手.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "线缆维护",
   "source_phrase": "插画：1 一个心电图一样的绿色心跳线，线下一串小胶片格子；2 一根 USB 线上一个小扳手，旁边一个写着 759 的小计数牌；3 一只手停在两个一模一样的小盒子前（一个标问号）。",
   "sha256": "52f3ffa5b6e07c8b49bad87fee5c6ce6903b5deea4171b3a90eaa98cdebcc150",
   "status": "ready",
   "original_elements": [
    "一根 USB 线上一个小扳手，旁边一个写着 759 的小计数牌"
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
   "asset": "_library/illustrations/小盒子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "小盒子",
   "source_phrase": "插画：1 一个心电图一样的绿色心跳线，线下一串小胶片格子；2 一根 USB 线上一个小扳手，旁边一个写着 759 的小计数牌；3 一只手停在两个一模一样的小盒子前（一个标问号）。",
   "sha256": "e0e353b81e0923885518d9e4df78e71247588bb764e465a427a9d0bb1e6fbef5",
   "status": "ready",
   "original_elements": [
    "一只手停在两个一模一样的小盒子前（一个标问号"
   ],
   "hidden": false
  }
 ]
}
```

**程序活着，不等于屏幕在动。**
机箱屏最难查的坏法是“冻住”：进程都在，画面却停在某一秒。所以看门狗不看进程，看心跳里的帧号、周期和整帧重画是否按时。9 月 27 日 21:27 到 28 日 21:22，它连续发了 85,063 帧，失败 0 次。

**一上午被拉起 759 次，之后只修那一根线。**
8 月 26 日 8 点到 14 点，机箱屏的 USB 串口卡住，取数程序被一遍遍重新拉起，6 个小时 759 次。13:48 加了自愈：调亮度连续失败 3 次，就只重启那一个 USB 串口设备，5 分钟最多一次，别的都不碰；那天后来只再拉起过 4 次。9 月 21 日 00:45 它自己修好过一次。

**认不准，宁可停手。**
曲面屏掉线时，最省事的办法是重启 USB 集线器、扫一遍设备，可同一个集线器上还挂着别的东西。它的做法是：只认已经对上号的那台设备，每次开机或唤醒只试一次；认不准就等，报 Code 10 就停下来，提示断电查线。

::screen{#pc-panel-hub-11 section="features"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-11",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行，不单独占一整列），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。这一张放“机箱屏显示”“机箱屏怎么跑”两组。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-case",
    "text": "机箱屏显示"
   },
   {
    "id": "f-case-clock",
    "text": "时钟和日期"
   },
   {
    "id": "f-case-weather",
    "text": "天气和空气质量"
   },
   {
    "id": "f-case-status",
    "text": "状态条"
   },
   {
    "id": "f-case-cpu",
    "text": "CPU",
    "locator_text": {
     "h": "4. CPU"
    }
   },
   {
    "id": "f-case-gpu",
    "text": "显卡"
   },
   {
    "id": "f-case-fps",
    "text": "游戏帧率"
   },
   {
    "id": "f-case-memory",
    "text": "内存和显存"
   },
   {
    "id": "f-case-network",
    "text": "网速和网络质量"
   },
   {
    "id": "f-case-disks",
    "text": "硬盘"
   },
   {
    "id": "f-case-apps",
    "text": "应用排行"
   },
   {
    "id": "g-case-run",
    "text": "机箱屏怎么跑"
   },
   {
    "id": "f-hybrid-refresh",
    "text": "每秒刷新"
   },
   {
    "id": "f-full-frame-mode",
    "text": "3 秒整帧模式"
   },
   {
    "id": "f-trust-score",
    "text": "数据可信度"
   },
   {
    "id": "f-preview-png",
    "text": "诊断截图"
   },
   {
    "id": "f-serial-heal",
    "text": "串口卡死自愈"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pc-panel-hub-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "legend",
     "width": "42%",
     "text_ref": "全部功能（42 项）"
    },
    {
     "type": "status_legend",
     "row": "legend",
     "width": "58%",
     "text_ref": "图例"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      3,
      1
     ],
     "text_ref": "机箱屏显示"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      2
     ],
     "text_ref": "机箱屏怎么跑"
    }
   ],
   "notes": "第1张功能续段有标题图例，组名独占网格上方；机箱屏显示10项3+3+3+1、怎么跑5项3+2，原图末排按原宽不补空卡；竖版一项一行。每卡图标左、编号功能名与说明右、状态点右上；状态词显示与G1/scene冲突需工程师统一，规格不删定稿词。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（42 项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      3,
      1
     ],
     "text_ref": "机箱屏显示"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      2
     ],
     "text_ref": "机箱屏怎么跑"
    }
   ],
   "notes": "第1张功能续段有标题图例，组名独占网格上方；机箱屏显示10项3+3+3+1、怎么跑5项3+2，原图末排按原宽不补空卡；竖版一项一行。每卡图标左、编号功能名与说明右、状态点右上；状态词显示与G1/scene冲突需工程师统一，规格不删定稿词。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "时钟和日期｜时:分:秒、日期星期，北京时间，每秒跳一下｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "天气和空气质量｜天气、空气质量、湿度，取 Open-Meteo；9 月 28 日坏过，29 日凌晨修好，01:56 屏上是“20°C 阵雨、AQI 70、湿度 95%”｜在用",
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
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库",
   "source_phrase": "状态条｜数据取没取到、前台程序、多久更新一次｜在用",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "CPU｜使用率、温度、功耗、主频、电压、60 秒曲线；使用率和任务管理器对得上｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显卡",
   "source_phrase": "显卡｜使用率、温度、功耗、核心频率、电压、曲线｜在用",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "游戏帧率｜平均、1% 低帧、帧时间，只读电脑使用记录的数据｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "内存和显存｜使用率，主板和内存条温度｜在用",
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
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "网速和网络质量｜下载上传、延迟、抖动、丢包、DPC，只算物理网卡｜在用",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "秒表",
   "source_phrase": "硬盘｜最多 4 块：型号、温度、用量、读写速度｜在用",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "应用排行｜最占 CPU 和内存的前 3 个程序，每 3 秒单独采｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "每秒刷新｜平时只发变化，约 15 分钟整帧重画一次｜在用",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "秒整帧模式｜保守的兼容模式，只在排查时手动打开｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "数据可信度｜每份数据按九项打 0–100 分，记进日志｜在用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "诊断截图｜每次发完顺手存一张刚发的图，AI 不用看实体屏也知道画了什么｜在用",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "串口卡死自愈｜调亮度连续失败 3 次，只重启那个 USB 串口设备，5 分钟最多一次｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-faf70d284825f1ec8401.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-faf70d284825f1ec8401",
   "title_text": "全部功能（42 项）",
   "sha256": "41be7b874b3b9bd0868d57ac927588f20fc131129f4778114313fcc35c86cfe0",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（42 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**机箱屏显示**
1. 时钟和日期｜时:分:秒、日期星期，北京时间，每秒跳一下｜在用
2. 天气和空气质量｜天气、空气质量、湿度，取 Open-Meteo；9 月 28 日坏过，29 日凌晨修好，01:56 屏上是“20°C 阵雨、AQI 70、湿度 95%”｜在用
3. 状态条｜数据取没取到、前台程序、多久更新一次｜在用
4. CPU｜使用率、温度、功耗、主频、电压、60 秒曲线；使用率和任务管理器对得上｜在用
5. 显卡｜使用率、温度、功耗、核心频率、电压、曲线｜在用
6. 游戏帧率｜平均、1% 低帧、帧时间，只读电脑使用记录的数据｜在用
7. 内存和显存｜使用率，主板和内存条温度｜在用
8. 网速和网络质量｜下载上传、延迟、抖动、丢包、DPC，只算物理网卡｜在用
9. 硬盘｜最多 4 块：型号、温度、用量、读写速度｜在用
10. 应用排行｜最占 CPU 和内存的前 3 个程序，每 3 秒单独采｜在用

**机箱屏怎么跑**
11. 每秒刷新｜平时只发变化，约 15 分钟整帧重画一次｜在用
12. 3 秒整帧模式｜保守的兼容模式，只在排查时手动打开｜说不准
13. 数据可信度｜每份数据按九项打 0–100 分，记进日志｜在用
14. 诊断截图｜发完画面后在后台顺手存一张刚发的图，默认约 45 秒一张，AI 不用看实体屏也知道画了什么；这是软件预览，不是实体屏照片｜在用
15. 串口卡死自愈｜调亮度连续失败 3 次，只重启那个 USB 串口设备，5 分钟最多一次｜在用

::screen{#pc-panel-hub-12 section="features"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-12",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行，不单独占一整列），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。这一张放“曲面屏显示”“开机、睡眠和窗口”两组，没有标题和图例。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-curved",
    "text": "曲面屏显示"
   },
   {
    "id": "f-hs2-clock",
    "text": "时钟"
   },
   {
    "id": "f-hs2-music",
    "text": "正在放的歌"
   },
   {
    "id": "f-hs2-game",
    "text": "Steam 游戏"
   },
   {
    "id": "f-hs2-phone",
    "text": "手机通知和来电"
   },
   {
    "id": "f-hs2-code",
    "text": "验证码"
   },
   {
    "id": "f-hs2-battery",
    "text": "手机电量"
   },
   {
    "id": "f-hs2-events",
    "text": "耳机音箱切换、断网"
   },
   {
    "id": "f-hs2-deck",
    "text": "六张卡自动排"
   },
   {
    "id": "f-hs2-clear",
    "text": "Win+F1 清屏"
   },
   {
    "id": "g-guard",
    "text": "开机、睡眠和窗口"
   },
   {
    "id": "f-watchdog",
    "text": "登录自启和看门狗"
   },
   {
    "id": "f-crash-restart",
    "text": "看门狗自己崩了也能回来"
   },
   {
    "id": "f-sleep",
    "text": "睡眠和关机关屏"
   },
   {
    "id": "f-hs2-recover",
    "text": "曲面屏找回"
   },
   {
    "id": "f-window-guard",
    "text": "窗口不乱跑"
   },
   {
    "id": "f-vdd-return",
    "text": "串流虚拟屏窗口回主屏"
   },
   {
    "id": "f-wallpaper",
    "text": "动态壁纸重连"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pc-panel-hub-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      3
     ],
     "text_ref": "曲面屏显示"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      1
     ],
     "text_ref": "开机、睡眠和窗口"
    }
   ],
   "notes": "续段不加总标题图例，两组9项和7项；横3列，竖单列，组名在各组上方。沿用11的卡和状态点位置。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      3
     ],
     "text_ref": "曲面屏显示"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3,
      1
     ],
     "text_ref": "开机、睡眠和窗口"
    }
   ],
   "notes": "续段不加总标题图例，两组9项和7项；横3列，竖单列，组名在各组上方。沿用11的卡和状态点位置。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "时钟｜只到分钟，整分钟翻页；Win+F2 显示或隐藏｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "正在放的歌｜网易云的歌名、歌手、封面、双语歌名；对不上就不显示｜在用",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "Steam 游戏｜游戏名、封面、这次玩了多久，退出后总结 60 秒｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "手机通知和来电｜最多 3 条，每条 60 秒；来电、传输进行时一直在｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "验证码｜只认明确的验证码，大号数字 15 秒；日志不记｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "手机电量｜电量和是否在充电，两个来源取更新的｜在用",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "耳机音箱切换、断网｜显示新设备名，或断网、恢复，12 秒｜在用",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/趋势图.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "趋势图",
   "source_phrase": "六张卡自动排｜最多六张，来电优先，只画有内容的卡，不跨曲面折线｜在用",
   "sha256": "840e34005f97891bcc6f8b0621a1e081cfae3d452a215b4eb6a9efa57ae723ab",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "Win+F1 清屏｜清掉看过的通知和事件，歌、游戏、来电留着｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "登录自启和看门狗｜登录后隐身启动，盯心跳，坏了冷却 30 秒再起一套｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "看门狗自己崩了也能回来｜异常退出后 30 秒自动拉起替身｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "睡眠和关机关屏｜机箱屏亮度调到 0，曲面屏切回离线时钟；唤醒后恢复｜待验收",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "曲面屏找回｜开机、唤醒各试一次切回副屏，认不准就等｜在用",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "窗口不乱跑｜普通窗口误入曲面屏就搬回主屏，壁纸、浮层不碰｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "串流虚拟屏窗口回主屏｜远程串流用的虚拟屏上的窗口，回到真的主屏｜说不准",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
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
   "source_phrase": "动态壁纸重连｜显示器变化后让 Wallpaper Engine 停一下再播，15 分钟最多一次｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  }
 ]
}
```

**曲面屏显示**
16. 时钟｜只到分钟，整分钟翻页；Win+F2 显示或隐藏｜在用
17. 正在放的歌｜网易云的歌名、歌手、封面、双语歌名；对不上就不显示｜在用
18. Steam 游戏｜游戏名、封面、这次玩了多久，退出后总结 60 秒｜在用
19. 手机通知和来电｜10 月 20 日起改由电脑配置的手机桥送来，不再接小米妙享和 vivo 办公套件；最多 3 条，每条 60 秒；来电、传输进行时一直在；手机桥断了显示“手机桥未连接”；新来源在实体屏上还没验收｜说不准
20. 验证码｜只认明确的验证码，大号数字 15 秒；日志不记；经手机桥来的真实验证码能不能显示还没验收｜说不准
21. 手机电量｜电量和是否在充电；只用安卓调试连接（ADB），没配就显示未知，小米妙享回退已去掉；ADB 实际连手机这次没验证｜说不准
22. 耳机音箱切换、断网｜显示新设备名，或断网、恢复，12 秒｜在用
23. 六张卡自动排｜最多六张，来电优先，只画有内容的卡，不跨曲面折线｜在用
24. Win+F1 清屏｜清掉看过的通知和事件，歌、游戏、来电留着｜说不准

**开机、睡眠和窗口**
25. 登录自启和看门狗｜登录后隐身启动，盯心跳，坏了冷却 30 秒再起一套｜在用
26. 看门狗自己崩了也能回来｜异常退出后约 30 秒自动拉起替身；9 月 7 日专门测过一次，约 63 秒接回机箱屏，日常还没见过它真的触发｜说不准
27. 睡眠和关机关屏｜机箱屏亮度调到 0，曲面屏切回离线时钟；唤醒后恢复｜待验收
28. 曲面屏找回｜开机、唤醒各试一次切回副屏，认不准就等；浮层停在旧坐标、没整块落在曲面屏里，会请求浮层重新贴回（10 月 1 日加，实体屏上还没专门验过这一种）｜在用
29. 窗口不乱跑｜普通窗口误入曲面屏就搬回主屏，壁纸、浮层不碰；跟着看门狗全程运行，每 250 毫秒看一眼｜在用
30. 串流虚拟屏窗口回主屏｜远程串流用的虚拟屏上的窗口，回到真的主屏｜说不准
31. 动态壁纸重连｜显示器变化后，请已经开着的 Wallpaper Engine“继续播放”，不先停、不换场景；同一次变化最多试 3 次，请求发出不等于壁纸真动了｜在用

::screen{#pc-panel-hub-13 section="features"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-13",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行，不单独占一整列），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。三张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后两张没有标题、没有图例，接着往下排；上下边都不画边框。这一张放“手动工具和对外”“已停用”两组，没有标题和图例；已停用那组卡片整体颜色淡一些。\n仅本横图“手动工具和对外”32–36五卡：首排32/33/34三列，次排35/36两张各放宽到半幅，铺满有效整宽；不留第六个空位、不补卡。37–42已停用组维持原3+3及全部正确内容/状态表示，不加总标题或图例。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-tools",
    "text": "手动工具和对外"
   },
   {
    "id": "f-manual-start",
    "text": "手动启动"
   },
   {
    "id": "f-repair-panel",
    "text": "机箱屏修复"
   },
   {
    "id": "f-repair-hs2",
    "text": "曲面屏硬件修复"
   },
   {
    "id": "f-public-telemetry",
    "text": "给网站的网络质量"
   },
   {
    "id": "f-public-release",
    "text": "公开源码"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-old-vendor",
    "text": "厂商自带软件和天气补丁"
   },
   {
    "id": "f-hw-alert",
    "text": "硬件告警"
   },
   {
    "id": "f-volume",
    "text": "音量提示"
   },
   {
    "id": "f-tasks",
    "text": "长任务进度"
   },
   {
    "id": "f-usb",
    "text": "U 盘提示"
   },
   {
    "id": "f-lyrics",
    "text": "读网易云播放进度"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pc-panel-hub-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      2
     ],
     "last_row_fill": true,
     "text_ref": "手动工具和对外",
     "last_row": "fill"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3
     ],
     "text_ref": "已停用"
    }
   ],
   "notes": "续段不加总标题图例。手动工具和对外32/33/34首排三列，35/36次排各半幅铺满，不留第六空位；已停用37–42维持3+3。竖版每项一行，旧竖图上方多余一排无字状态点不额外补文字。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      2
     ],
     "last_row_fill": false,
     "text_ref": "手动工具和对外"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row_counts": [
      3,
      3
     ],
     "text_ref": "已停用"
    }
   ],
   "notes": "续段不加总标题图例。手动工具和对外32/33/34首排三列，35/36次排各半幅铺满，不留第六空位；已停用37–42维持3+3。竖版每项一行，旧竖图上方多余一排无字状态点不额外补文字。；已逐屏查看横图及全部竖版续图，文字用 page.json。",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "手动启动｜双击桌面“TURZX SideScreen Start”整套重新拉起｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "机箱屏修复｜认准那一个串口设备，重启并等到新心跳｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "曲面屏硬件修复｜核对专用集线器和端口后才动硬件，实际修复需要时自动提权｜说不准",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "给网站的网络质量｜只给延迟、抖动、丢包和 DPC，不给程序名和地址｜在用",
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
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "公开源码｜源码公开在 GitHub，打包时自动剔除厂商文件、本机配置和天气地点｜在用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "厂商自带软件和天气补丁｜6 月底先用厂商软件，天气坏了打过补丁；7 月起换成自己画，9 月 29 日补丁脚本也删了｜已停用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "硬件告警｜水泵、温度、磁盘健康和空间、长期断网；9 月 27 日删掉｜已停用",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "音量提示｜调音量时显示百分比 6 秒；9 月 27 日删掉｜已停用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f12e6ff1182222417108.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云下载",
   "source_phrase": "长任务进度｜复制、下载、渲染主动登记后显示进度；9 月 27 日删掉｜已停用",
   "sha256": "a149b95737b7aae5ced9666a2cebe730366ea2410c938467df8d9e92e9459c39",
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
   "source_phrase": "U 盘提示｜U 盘插拔提示；9 月 27 日删掉｜已停用",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "读网易云播放进度｜想显示歌词和进度条，没找到可靠来源；9 月 27 日删掉｜已停用",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  }
 ]
}
```

**手动工具和对外**
32. 手动启动｜双击桌面“TURZX SideScreen Start”整套重新拉起｜说不准
33. 机箱屏修复｜认准那一个串口设备，重启并等到新心跳｜说不准
34. 曲面屏硬件修复｜核对专用集线器和端口后才动硬件，实际修复需要时自动提权｜说不准
35. 给网站的网络质量｜只给延迟、抖动、丢包和 DPC，不给程序名和地址｜在用
36. 公开源码｜源码公开在 GitHub，打包时自动剔除厂商文件、本机配置和天气地点｜在用

**已停用**
37. 厂商自带软件和天气补丁｜6 月底先用厂商软件，天气坏了打过补丁；7 月起换成自己画，9 月 29 日补丁脚本也删了｜已停用
38. 硬件告警｜水泵、温度、磁盘健康和空间、长期断网；9 月 27 日删掉｜已停用
39. 音量提示｜调音量时显示百分比 6 秒；9 月 27 日删掉｜已停用
40. 长任务进度｜复制、下载、渲染主动登记后显示进度；9 月 27 日删掉｜已停用
41. U 盘提示｜U 盘插拔提示；9 月 27 日删掉｜已停用
42. 读网易云播放进度｜想显示歌词和进度条，没找到可靠来源；9 月 27 日删掉｜已停用

::screen{#pc-panel-hub-14 section="history"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-14",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边留一幅大一点的水彩插画：从上到下依次长出一个厂商软件的小窗口（画一个叉）、一条竖长的机箱屏、一块弯弯的曲面屏、一部手机、一把小剪刀剪下几张卡片（音量、U 盘、温度计、进度条的小图标），像一路长出来又修剪过的样子（插画里不画字）。",
  "portrait": "竖版：插画缩小放在最上面；时间线占满宽度从上到下。",
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
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "6 月 30 日",
     "text_layout": "inline"
    }
   ],
   "notes": "横版左64%竖向11日期卡时间线，右36%大插画从厂商小窗长出两屏手机并被剪刀修剪；竖版实际演进题在顶部左、缩小插画在右同排，下方全宽日期卡纵排；v2接后5项，不重复题和插画。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "row": "history-top",
     "row_v": true,
     "width": "24%",
     "text_ref": "演进"
    },
    {
     "type": "illustration",
     "row": "history-top",
     "row_v": true,
     "width": "76%",
     "illustration": "outside"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "columns_v": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "6 月 30 日",
     "text_layout": "inline"
    }
   ],
   "notes": "横版左64%竖向11日期卡时间线，右36%大插画从厂商小窗长出两屏手机并被剪刀修剪；竖版实际演进题在顶部左、缩小插画在右同排，下方全宽日期卡纵排；v2接后5项，不重复题和插画。；已逐屏查看横图及全部竖版续图，文字用 page.json。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "6 月 30 日：先用两块屏厂商自带的软件，设成登录后自动启动。",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "7 月 5 日：自己画机箱屏、自己写串口发送，源码公开；同一天加上睡眠恢复和天气空气质量。",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "7 月 29–31 日：机箱屏版面和数据重做，CPU 使用率改成和任务管理器一致；7 月 31 日曲面屏浮层上线，接上手机通知和网易云。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "8 月 2–8 日：两块屏一起睡眠、关机；Steam 时间统一换成北京时间；曲面屏改成自适应卡片；改名 PC Panel Hub。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "8 月 10–15 日：认出更多格式的验证码；机箱屏定下“每秒只发变化、定期整帧重画”；曲面屏恢复改成“认不准就停手”。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 26 日：串口卡死自愈。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "9 月 1–9 日：动态壁纸重连；登录时窗口保护；看门狗崩溃后自动拉起；串流虚拟屏的窗口回主屏。",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 25 日：把网络质量和 DPC 接给网站。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "报警灯",
   "source_phrase": "9 月 27 日：本人终审后给曲面屏瘦身，只留六类，删掉硬件告警、音量、长任务、U 盘和读播放进度，删了 5,520 行；装到正式位置。",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
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
   "source_phrase": "9 月 28 日：本人看过新版曲面屏，“粗看正常”。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 29 日：修好机箱屏天气；删掉旧的天气补丁和“唤醒后重启”脚本；指标服务的启动日志最多留最近 32 批，再被反复拉起也不会堆出成千上万个文件。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "key": "双屏同步",
   "source_phrase": "10 月 1 日：浮层被挤出曲面屏、停在旧坐标时，看门狗自己请求把浮层重新贴回去，不动显示布局，也不重启机箱屏。",
   "sha256": "80a56ba92e42aa6b9141a824b64cb9208b1b2f37b20bc0d462f04e3e15410ca4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/双屏演进修剪.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "双屏演进修剪",
   "source_phrase": "横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边留一幅大一点的水彩插画：从上到下依次长出一个厂商软件的小窗口（画一个叉）、一条竖长的机箱屏、一块弯弯的曲面屏、一部手机、一把小剪刀剪下几张卡片（音量、U 盘、温度计、进度条的小图标），像一路长出来又修剪过的样子（插画里不画字）。",
   "sha256": "31f39addcb5b95b699f9dd57d1a835e6baa1a0abe604d869e3fab45f0ba7943f",
   "status": "ready",
   "original_elements": [
    "从上到下依次长出一个厂商软件的小窗口（画一个叉）、一条竖长的机箱屏、一块弯弯的曲面屏、一部手机、一把小剪刀剪下几张卡片（音量、U 盘、温度计、进度条的小图标），像一路长出来又修剪过的样子（插画里不画字"
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
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

演进

- **6 月 30 日**：先用两块屏厂商自带的软件，设成登录后自动启动。
- **7 月 5 日**：自己画机箱屏、自己写串口发送，源码公开；同一天加上睡眠恢复和天气空气质量。
- **7 月 29–31 日**：机箱屏版面和数据重做，CPU 使用率改成和任务管理器一致；7 月 31 日曲面屏浮层上线，接上手机通知和网易云。
- **8 月 2–8 日**：两块屏一起睡眠、关机；Steam 时间统一换成北京时间；曲面屏改成自适应卡片；改名 PC Panel Hub。
- **8 月 10–15 日**：认出更多格式的验证码；机箱屏定下“每秒只发变化、定期整帧重画”；曲面屏恢复改成“认不准就停手”。
- **8 月 26 日**：串口卡死自愈。
- **9 月 1–9 日**：动态壁纸重连；登录时窗口保护；看门狗崩溃后自动拉起；串流虚拟屏的窗口回主屏。
- **9 月 25 日**：把网络质量和 DPC 接给网站。
- **9 月 27 日**：本人终审后给曲面屏瘦身，只留六类，删掉硬件告警、音量、长任务、U 盘和读播放进度，删了 5,520 行；装到正式位置。
- **9 月 28 日**：本人看过新版曲面屏，“粗看正常”。
- **9 月 29 日**：修好机箱屏天气；删掉旧的天气补丁和“唤醒后重启”脚本；指标服务的启动日志最多留最近 32 批，再被反复拉起也不会堆出成千上万个文件。
- **10 月 1 日**：浮层被挤出曲面屏、停在旧坐标时，看门狗自己请求把浮层重新贴回去，不动显示布局，也不重启机箱屏。

::screen{#pc-panel-hub-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/pc-panel-hub/turzx-renderer-current.webp",
    "caption": "用现在的画图程序和公开的固定演示数据直接生成的 480×1920 画面：CPU、显卡、帧率、内存、网络、硬盘和应用排行都是现役版式；数字是演示用的，不是这台电脑的读数。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/pc-panel-hub/hs2-placement-recovery-design.webp",
    "caption": "浮层落点的判断示意：正常、偏出曲面屏、看不见、已重新贴回四种情况；只有真的偏出才请求重新贴回，隐藏的辅助小窗口不算。这是按代码画的设计图，不是这台电脑的截图。",
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
     "text_ref": "用现在的画图程序和公开的固定演示数据直接生成的 480×1920 画面：CPU、显卡、帧率、内存、网络、硬盘和应用排行都是现役版式；数字是演示用的，不是这台电脑的读数。",
     "indices": [
      0,
      1,
      2,
      3
     ],
     "columns": 2,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "480:1920",
      "2288:1048",
      "2288:1048",
      "2288:1048"
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
     "text_ref": "用现在的画图程序和公开的固定演示数据直接生成的 480×1920 画面：CPU、显卡、帧率、内存、网络、硬盘和应用排行都是现役版式；数字是演示用的，不是这台电脑的读数。",
     "indices": [
      0,
      1,
      2,
      3
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "480:1920",
      "2288:1048",
      "2288:1048",
      "2288:1048"
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

用现在的画图程序和公开的固定演示数据直接生成的 480×1920 画面：CPU、显卡、帧率、内存、网络、硬盘和应用排行都是现役版式；数字是演示用的，不是这台电脑的读数。

浮层落点的判断示意：正常、偏出曲面屏、看不见、已重新贴回四种情况；只有真的偏出才请求重新贴回，隐藏的辅助小窗口不算。这是按代码画的设计图，不是这台电脑的截图。

::screen{#pc-panel-hub-gallery-history section="gallery"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-gallery-history",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/pc-panel-hub/turzx-active-design.png",
    "caption": "480×1920 密集面板的软件设计预览：CPU、GPU、FPS、内存、物理网络、磁盘、进程与健康状态同时可读；全部名称和数值都是公开安全模拟值，不是实体屏截图。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/pc-panel-hub/turzx-idle-design.png",
    "caption": "同一软件版面在没有有效游戏帧时显示“等待游戏帧 / PresentMon 正在等待游戏启动”，用于说明新鲜 idle 不等于采集故障；不是当前机器读数。",
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
     "text_ref": "480×1920 密集面板的软件设计预览：CPU、GPU、FPS、内存、物理网络、磁盘、进程与健康状态同时可读；全部名称和数值都是公开安全模拟值，不是实体屏截图。",
     "indices": [
      0,
      1
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "480:1920",
      "480:1920"
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
     "text_ref": "480×1920 密集面板的软件设计预览：CPU、GPU、FPS、内存、物理网络、磁盘、进程与健康状态同时可读；全部名称和数值都是公开安全模拟值，不是实体屏截图。",
     "indices": [
      0,
      1
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "480:1920",
      "480:1920"
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

480×1920 密集面板的软件设计预览：CPU、GPU、FPS、内存、物理网络、磁盘、进程与健康状态同时可读；全部名称和数值都是公开安全模拟值，不是实体屏截图。

同一软件版面在没有有效游戏帧时显示“等待游戏帧 / PresentMon 正在等待游戏启动”，用于说明新鲜 idle 不等于采集故障；不是当前机器读数。
