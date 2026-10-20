---
{
 "title": "微信聊天读取",
 "kind": "project",
 "url": "/projects/wechatdirect/",
 "tagline": "让 AI 读懂电脑上的微信，只读点名的那一段。",
 "old_urls": [
  "/projects/wechat-direct/"
 ],
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
  "page": "wechatdirect",
  "kind": "project",
  "title": "微信聊天读取",
  "url": "/projects/wechatdirect/",
  "tagline": "让 AI 读懂电脑上的微信，只读点名的那一段。",
  "status": "常用",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-07 09:21"
   },
   "facts": [
    "近 7 天 AI 用了 7 次"
   ],
   "as_of": "2026-10-12",
   "source": "AI 使用记录（10 月 3–9 日，记到 10 月 9 日）"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/WeChatDirect",
  "capability": "读懂微信聊天",
  "based_on": {
   "commit": "57a764dacf79967e222076599d94ef3895f51797",
   "commit_time": "2026-10-07T23:39:47+08:00"
  },
  "video_prompt": "5–8 秒循环。画面从开头这屏的水彩插画出发：屏幕上两个聊天窗口里的绿白气泡缓缓往上滚；一只放大镜从右往左慢慢滑过，停在一段气泡上时，一条细绿线从一句回复连到它引用的原句，亮一下又淡去；数据库圆柱上的小锁轻轻闪一下；一张新纸片飘进旁边的“档案”文件夹。白底、纯绿主色、水彩质感，镜头不动，不出现任何文字和微信标志。",
  "registry": {
   "groups": [
    {
     "id": "g-read",
     "name": "读聊天"
    },
    {
     "id": "g-sessions",
     "name": "账号和会话"
    },
    {
     "id": "g-media",
     "name": "附件"
    },
    {
     "id": "g-package",
     "name": "给 AI 和别的项目"
    },
    {
     "id": "g-archive",
     "name": "聊天档案"
    },
    {
     "id": "g-moments",
     "name": "朋友圈"
    },
    {
     "id": "g-keep",
     "name": "完整存底和核对"
    },
    {
     "id": "g-maint",
     "name": "安装和维护"
    }
   ],
   "features": [
    {
     "id": "f-context",
     "group": "g-read",
     "name": "查一段聊天",
     "what": "说哪个人或群、哪天或什么关键词，读够回答的一小段，带时间和谁说的",
     "how": "说账号（可不说）、对象、日期或关键词；命令 context",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "wechat_cli.py:4532；docs/USAGE.md:92-113；使用记录 9 月 26 日 context 15 次（ledger/usage-events.jsonl）"
    },
    {
     "id": "f-reply",
     "group": "g-read",
     "name": "找被回的原话",
     "what": "引用回复和它回的原消息一起交回，原消息在这段之外就标出来",
     "how": "随“查一段聊天”一起给出；指着那句话问回的是哪条",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "docs/USAGE.md:5；AGENTS.md:5；建设与验收.md 9 月 18 日“阅读包与媒体”（真实群聊样本 2 条引用）；真实使用：9 月 27 日近况更新读回 1853 条，含 82 条被引用的原消息；9 月 8 日终审含 33 条（理解库微信阅读记录 E:\\PersonalData\\日常偏好\\微信阅读（facts.md 十））"
    },
    {
     "id": "f-paging",
     "group": "g-read",
     "name": "接着往下读",
     "what": "一段没读完时给出续读位置，下一次接着读，账号、聊天和时间范围不会变",
     "how": "AI 按结果里的 continuation 游标再调 context",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "docs/USAGE.md:101-109；建设与验收.md 9 月 18 日“分页与查询”；真实使用：理解库每段按页续读（page-0002 起），6 次共 859 页；9 月 26 日 Claude 会话 ca702b24 子任务用 --cursor 续读"
    },
    {
     "id": "f-self-only",
     "group": "g-read",
     "name": "只看我在大群说过的",
     "what": "先按发送者筛出我的发言再解码，适合几千条的群；别人的回应再按时间补读",
     "how": "context --self-only，再用 --around 补读",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "docs/USAGE.md:9；建设与验收.md 9 月 18 日“分页与查询”（文件传输助手 self-only 24 条）；真实使用：9 月 26 日群聊认知审计取副号 10 个群本人 61070 条（Claude 会话 ca702b24 子任务 a19ee89c）；9 月 27 日近况更新人多的群用 --self-only"
    },
    {
     "id": "f-long-text",
     "group": "g-read",
     "name": "长消息分段读",
     "what": "一条消息太长时先给开头，再按段接着读，整条的指纹能核对；源变了就拒绝拼接",
     "how": "context --byte-limit，再用 message-part 续读",
     "status": "说不准",
     "screen": "wechatdirect-08",
     "source": "docs/RECOVERY.md:24-32；建设与验收.md 9 月 18 日“字节预算”（真实样本没触发分段）"
    },
    {
     "id": "f-msg-types",
     "group": "g-read",
     "name": "看懂特殊消息",
     "what": "转账、红包、通话、位置、拍一拍、撤回、系统提示按微信自己的结构写清楚",
     "how": "随读取自动还原",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "建设与验收.md 8 月 25 日（真实群聊 82 条系统消息区分出来）；提交 721ec4d、684a5f1、287785e、6d03679、4016835、3faf4d2；旧网站 content-wechatdirect.js“发送方向与消息含义”；真实使用：理解库阅读记录里系统提示 440、通话 57、位置 2、应用消息 1613 条都按类型还原（理解库微信阅读记录 E:\\PersonalData\\日常偏好\\微信阅读（facts.md 十））"
    },
    {
     "id": "f-accounts",
     "group": "g-sessions",
     "name": "分清主号副号",
     "what": "每次绑定一个号，同名联系人不跨号串；没说哪个号又两边都有，就列候选",
     "how": "说主号或副号；不说时 --account auto",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "README.md:8；docs/USAGE.md:16, 67；AGENTS.md:4"
    },
    {
     "id": "f-changes",
     "group": "g-sessions",
     "name": "看哪些聊天有新消息",
     "what": "列出某个时间之后有变化的会话，两个号分开列，不读正文、不截断",
     "how": "问最近哪些聊天有新内容；命令 changes",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "wechat_cli.py:4536；docs/USAGE.md:115-126；真实使用：9 月 26 日 Claude 会话 ca702b24 调 changes 8 次；9 月 27 日近况更新经 daily-preferences tools/wechat_update.py（第 133 行调 changes）列出主号 26、副号 21 个会话"
    },
    {
     "id": "f-identity",
     "group": "g-sessions",
     "name": "算账号指纹",
     "what": "装机配置时，从已有配置算出两个号的 SHA-256 指纹填进去，只输出指纹",
     "how": "identity-commitments",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "wechat_cli.py:4524；docs/USAGE.md:78-84；真实使用：9 月 25 日 02:12 Codex 会话 01a0d493 对真实配置运行 identity-commitments（装 0.2.2 时）"
    },
    {
     "id": "f-media-open",
     "group": "g-media",
     "name": "打开消息的附件",
     "what": "只打开这条消息自己的图片、表情、文件、视频，交回类型、大小和指纹；微信特有的 WXGF 图片转成 PNG 或 GIF",
     "how": "点名那条消息；命令 media-open",
     "status": "在用",
     "screen": "wechatdirect-08",
     "source": "wechat_cli.py:4647；docs/USAGE.md:19-21, 178-188；建设与验收.md 9 月 18 日“阅读包与媒体”；真实使用：9 月 27 日 Claude 会话 e427ea43 子任务 media-open 3 次（含 --local-only），文件传输助手 83 张图片打开 78 张"
    },
    {
     "id": "f-voice",
     "group": "g-media",
     "name": "语音转成 WAV",
     "what": "原始 SILK 保留，另转一份 WAV，交给中文语音转写",
     "how": "media-open --voice-wav，再交 chinese-asr",
     "status": "说不准",
     "screen": "wechatdirect-08",
     "source": "docs/USAGE.md:20, 46-52；建设与验收.md 9 月 18 日“真实语音”；ChineseASR outputs\\api\\20260824-101704-*"
    },
    {
     "id": "f-emoji-remote",
     "group": "g-media",
     "name": "表情从原地址取回",
     "what": "本机没有的表情，按这条消息记着的微信地址取回并核对；可以禁止联网",
     "how": "export-context 或 media-open；--local-only 禁止",
     "status": "说不准",
     "screen": "wechatdirect-08",
     "source": "AGENTS.md:6；docs/USAGE.md:7；建设与验收.md 9 月 18 日“本輪未請求遠端表情 CDN”"
    },
    {
     "id": "f-export-context",
     "group": "g-package",
     "name": "阅读包",
     "what": "把选定的一段连同附件存成一个文件夹：完整消息、附件、给 AI 的摘要，别的项目也能直接读",
     "how": "指定对象和时间范围；命令 export-context",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4548；docs/USAGE.md:128-143；daily-preferences tests/test_reviewed_citations.py:110"
    },
    {
     "id": "f-html",
     "group": "g-package",
     "name": "网页版查看",
     "what": "阅读包可以顺带生成一页网页，给人看；AI 用不着它",
     "how": "export-context --html",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "docs/USAGE.md:143；wechat_render.py"
    },
    {
     "id": "f-sync-contact",
     "group": "g-archive",
     "name": "建档和补新的",
     "what": "点名一个人或群，第一次存下本机能看到的全部，以后同一句话只补新的",
     "how": "点名联系人或群，让 AI 保存；命令 sync-contact",
     "status": "在用",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4604；docs/USAGE.md:145-156；导出根 4 份档案，最近 9 月 10 日"
    },
    {
     "id": "f-full-reconcile",
     "group": "g-archive",
     "name": "整份重核",
     "what": "重新核对这个人或群在本机能看到的全部历史，补上后来才下载到本机的附件",
     "how": "sync-contact --full-reconcile",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "docs/USAGE.md:152；docs/RECOVERY.md:11-13；建设与验收.md 9 月 18 日“损坏重核负例”"
    },
    {
     "id": "f-repair-media",
     "group": "g-archive",
     "name": "定点补附件",
     "what": "只补一个档案里缺的附件或 WAV，不重扫聊天、不联网",
     "how": "repair-media",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4687；docs/RECOVERY.md:15-22；建设与验收.md 9 月 18 日“定点修复负例”"
    },
    {
     "id": "f-legacy-upgrade",
     "group": "g-archive",
     "name": "旧档案升级",
     "what": "旧格式的档案下次更新时，自动按新规则重认一遍每条是谁发的",
     "how": "对同一对象再跑 sync-contact 时自动进行",
     "status": "待验收",
     "screen": "wechatdirect-09",
     "source": "docs/USAGE.md:156；建设与验收.md 9 月 18 日“旧版档案升级”（验收副本 1057→1108）；4 份正式档案里 3 份仍是旧格式（facts.md F39）"
    },
    {
     "id": "f-moments",
     "group": "g-moments",
     "name": "看朋友圈",
     "what": "读某个号缓存着的朋友圈，看某个人的或我自己的；必须说是哪个号",
     "how": "指定账号和对象；命令 moments",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4588；docs/USAGE.md:158-167；建设与验收.md 9 月 18 日“朋友圈”"
    },
    {
     "id": "f-sync-moments",
     "group": "g-moments",
     "name": "存朋友圈快照",
     "what": "把这台电脑现在看得到的朋友圈存一份，以后再存只更新变化",
     "how": "sync-moments",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4633；docs/USAGE.md:169-176；建设与验收.md 9 月 18 日“朋友圈”（本人快照 202 条）"
    },
    {
     "id": "f-preserve",
     "group": "g-keep",
     "name": "完整存一段聊天",
     "what": "我明确要求时，把一个时间段的聊天、附件、编号和指纹存成一个能单独看懂的文件夹",
     "how": "指定会话和时间，明确说要存底；命令 preserve",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4666；docs/USAGE.md:190-196；建设与验收.md 9 月 18 日“群聊保全”"
    },
    {
     "id": "f-verify",
     "group": "g-keep",
     "name": "核对以前导出的",
     "what": "只读检查档案、朋友圈快照、阅读包、存底包：文件指纹、大小、账号和附件关系对不对得上",
     "how": "选中以前的文件夹让 AI 核对；命令 verify-export",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4581；docs/USAGE.md:198-207"
    },
    {
     "id": "f-doctor",
     "group": "g-maint",
     "name": "环境体检",
     "what": "检查 Python、语音解码、ffmpeg 和配置，可以完全不碰账号配置",
     "how": "doctor；--environment-only",
     "status": "在用",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4570；docs/RECOVERY.md:50-56；使用记录 9 月 25 日 doctor 1 次"
    },
    {
     "id": "f-recover",
     "group": "g-maint",
     "name": "中断后恢复",
     "what": "更新档案时被打断，先查看现场，再撤回或完成这次更新",
     "how": "recover-export；--action rollback 或 complete",
     "status": "说不准",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4698；docs/RECOVERY.md:34-46；建设与验收.md 9 月 18 日“实际进程中断与恢复”"
    },
    {
     "id": "f-temp",
     "group": "g-maint",
     "name": "清理临时解密文件",
     "what": "查看或清掉某次任务留下的临时解密文件，只动认得出的那一次",
     "how": "temp-status；--session 指定一次 --clean",
     "status": "在用",
     "screen": "wechatdirect-09",
     "source": "wechat_cli.py:4707；docs/RECOVERY.md:48-58；使用记录 9 月 26 日 temp-status 1 次"
    }
   ],
   "numbers": [
    {
     "id": "n-archives",
     "text": "4 份",
     "meaning": "导出根里完成态的联系人或群档案个数（manifest.json 个数）",
     "as_of": "2026-10-12",
     "source": "E:\\PersonalData\\微信项目\\exports 下 manifest.json 个数（10 月 11 日只数文件和数字字段复核，仍是 4 个）",
     "screens": [
      "wechatdirect-01",
      "wechatdirect-02",
      "wechatdirect-03"
     ]
    },
    {
     "id": "n-archive-messages",
     "text": "7934 条消息",
     "meaning": "4 份档案 manifest.messageCount 之和",
     "as_of": "2026-10-12",
     "source": "4 份档案 manifest.messageCount 之和（10 月 11 日复核仍为 7934；脚本只读数字字段）",
     "screens": [
      "wechatdirect-01"
     ]
    },
    {
     "id": "n-reading-runs",
     "text": "888 段、11541 条消息、7 次",
     "meaning": "个人理解库经微信聊天读取读过的聊天窗口数（window.json 个数）和消息条数（page-*.json 的 messages 之和），按 E:\\PersonalData\\日常偏好\\微信阅读 下有窗口的 7 个批次（9 月 8 日 675、9 月 12 日 32＋12、9 月 15 日 14、9 月 18 日 58、9 月 27 日 48、10 月 6 日 49）；不含 9 月 26 日群聊认知审计（那次没存窗口文件）",
     "as_of": "2026-10-12",
     "source": "只数文件和字段、不读正文的脚本现算；去掉 10 月 6 日批次复算得 839 段、10561 条，与旧稿一致",
     "screens": [
      "wechatdirect-01"
     ]
    },
    {
     "id": "n-source-writes",
     "text": "45 次源文件打开、0 次写入",
     "meaning": "9 月 18 日真实读取时进程内审计",
     "as_of": "2026-09-18",
     "source": "建设与验收.md 9 月 18 日“源只读监测”",
     "screens": [
      "wechatdirect-01"
     ]
    },
    {
     "id": "n-tests",
     "text": "224 个",
     "meaning": "测试定义 224 个（只计数），本轮未重跑",
     "as_of": "2026-10-12",
     "source": "git grep \"def test\" HEAD -- tests（HEAD 57a764d）",
     "screens": [
      "wechatdirect-01"
     ]
    },
    {
     "id": "n-lines",
     "text": "11189 行",
     "meaning": "9 个运行模块的行数，含空行注释，不含测试",
     "as_of": "2026-10-12",
     "source": "9 个运行模块逐个数行相加（HEAD 57a764d）；同法数 80d2d1c 得 11158，与旧稿一致",
     "screens": [
      "wechatdirect-01"
     ]
    },
    {
     "id": "n-deps",
     "text": "3 个",
     "meaning": "运行依赖个数",
     "as_of": "2026-09-28",
     "source": "pyproject.toml dependencies",
     "screens": [
      "wechatdirect-06"
     ]
    },
    {
     "id": "n-commits",
     "text": "37 次",
     "meaning": "公开仓库提交数，第一个 8 月 30 日",
     "as_of": "2026-10-12",
     "source": "git rev-list --count HEAD（57a764d，与 origin/main 一致）；旧稿 31 次口径未能复现（同法数 9 月 28 日的 80d2d1c 为 32）",
     "screens": [
      "wechatdirect-06"
     ]
    },
    {
     "id": "n-commands",
     "text": "15 个",
     "meaning": "CLI 子命令个数",
     "as_of": "2026-09-28",
     "source": "wechat_cli.py:4524-4707 add_parser",
     "screens": [
      "wechatdirect-06"
     ]
    },
    {
     "id": "n-read-limits",
     "text": "最多翻 500 条、交回 80 条",
     "meaning": "context 单次扫描和返回上限",
     "as_of": "2026-09-28",
     "source": "wechat_cli.py:54-55",
     "screens": [
      "wechatdirect-02"
     ]
    },
    {
     "id": "n-media-gaps",
     "text": "2329 次",
     "meaning": "4 份档案 unavailableMediaCount 之和（媒体出现次数，不是文件数）",
     "as_of": "2026-09-28",
     "source": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\facts.md F38：882＋625＋141＋681",
     "screens": [
      "wechatdirect-03"
     ]
    },
    {
     "id": "n-unlabeled",
     "text": "1925 条",
     "meaning": "4 份档案 unlabeledGroupMemberCount 之和",
     "as_of": "2026-09-28",
     "source": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\facts.md F38",
     "screens": [
      "wechatdirect-03"
     ]
    },
    {
     "id": "n-ai-context",
     "text": "80 条、128 KB",
     "meaning": "给 AI 的默认小上下文上限",
     "as_of": "2026-09-28",
     "source": "wechat_cli.py:58-59",
     "screens": [
      "wechatdirect-05"
     ]
    },
    {
     "id": "n-kdf",
     "text": "4096 字节、256000 轮",
     "meaning": "数据库页大小和 PBKDF2 轮数（代码常量）",
     "as_of": "2026-10-12",
     "source": "wechat_source.py:35-37",
     "screens": [
      "wechatdirect-04"
     ]
    },
    {
     "id": "n-group-test",
     "text": "6145 条的群：8.2 秒、0.7 秒、7264 字节、4.49 MB",
     "meaning": "8 月 25 日真实群聊压力验收：首次建档耗时、无变化重跑耗时、ai-context.md 大小、完整 JSONL 大小",
     "as_of": "2026-08-25",
     "source": "建设与验收.md“约 8000 条群聊压力验收”（8.242 秒、0.692 秒）",
     "screens": [
      "wechatdirect-05"
     ]
    },
    {
     "id": "n-file-transfer",
     "text": "1057 条、1105 条；398 条、633 条",
     "meaning": "两个号文件传输助手的消息总数和修复后能读出的正文条数",
     "as_of": "2026-08-25",
     "source": "建设与验收.md“文件传输助手正文根治”",
     "screens": [
      "wechatdirect-07"
     ]
    },
    {
     "id": "n-moments-scan",
     "text": "第 346 条；347 条约 0.4 秒",
     "meaning": "主号目标发布者在缓存里的位置；主号当前缓存条数和完整扫描耗时",
     "as_of": "2026-08-25",
     "source": "建设与验收.md“朋友圈当前缓存”",
     "screens": [
      "wechatdirect-04"
     ]
    },
    {
     "id": "n-features",
     "text": "25 项",
     "meaning": "本页功能清单条数",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "wechatdirect-08"
     ]
    },
    {
     "id": "n-deleted-code",
     "text": "1307 行",
     "meaning": "删掉的不可达代码行数",
     "as_of": "2026-09-26",
     "source": "提交 77a4845 git show --stat（13 增 1307 删）",
     "screens": [
      "wechatdirect-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-to-asr",
     "with": "chinese-asr",
     "direction": "交出去",
     "flow": "微信聊天读取按消息取出语音 SILK、转成 WAV，交给中文语音转写出文字",
     "source": "SKILL.md“Answer a conversation question”；ChineseASR outputs\\api\\20260824-101704-*"
    },
    {
     "id": "r-to-understanding",
     "with": "daily-preferences",
     "direction": "交出去",
     "flow": "个人理解库更新时先用 changes 找有新消息的会话，再按阅读窗口取正文或阅读包；读到哪了由理解库自己记",
     "source": "SKILL.md“Discover sessions for an authorized update”；daily-preferences references/query.md:97；tests/test_reviewed_citations.py:110"
    },
    {
     "id": "r-to-expression",
     "with": "personal-expression",
     "direction": "交出去",
     "flow": "个人表达库从微信最近或历史消息里学我的表达，经微信聊天读取取消息",
     "source": "personal-expression tests/test_expression.py:32；owner-decisions.md“表达库取样、备份与真实验收”"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "电脑配置与恢复登记它的安装位置、Python 3.14 与 3.11 两条运行环境和换机恢复步骤；登录后双开两个微信，正好对应主号、副号",
     "source": "PCConfig registries/project_restore_anchors.json；GitHub 总索引 config/repository-paths.json（仓库导航快照）；计划任务 WeChat AutoStart"
    },
    {
     "id": "r-backup",
     "with": "devconfig-backup",
     "direction": "并行",
     "flow": "开发配置备份每天北京时间 09:30 备份微信原始数据、每周一 11:00 传 Google 云盘；它不调用微信聊天读取，微信聊天读取也不读备份",
     "source": "计划任务 WeChatBackup-Hot-Daily、WeChatBackup-Drive-Weekly"
    },
    {
     "id": "r-replaces-bridge",
     "with": "wechat-history-ai-bridge",
     "direction": "取代",
     "flow": "旧项目经 WeFlow 取微信记录交给 AI；微信聊天读取直接读本地数据库，取代了它",
     "source": "owner-decisions.md“个人网站：冻结项目的原因和去留”；建设与验收.md“它直接读取微信数据库，不调用 WeFlow”"
    },
    {
     "id": "r-ai-skill",
     "with": "skill-wechat-direct",
     "direction": "入口",
     "flow": "Codex 和 Claude 通过 wechat-direct 技能调用已安装的 wechat-direct.exe",
     "source": "E:\\.agents\\skills\\wechat-direct\\SKILL.md"
    }
   ],
   "highlights": [
    {
     "id": "h-account-swap",
     "title": "主号副号曾经贴反了",
     "screen": "wechatdirect-07"
    },
    {
     "id": "h-zstd",
     "title": "文件传输助手的正文读成了乱码",
     "screen": "wechatdirect-07"
    },
    {
     "id": "h-self-only",
     "title": "只读我自己说过的话",
     "screen": "wechatdirect-07"
    }
   ],
   "mentions": [
    {
     "target": "/how/#wechatdirect",
     "screen": "wechatdirect-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "wechatdirect-02",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "wechatdirect-02",
     "text": "个人理解库"
    },
    {
     "target": "/skills/wechat-direct/",
     "screen": "wechatdirect-02",
     "text": "技能页"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "wechatdirect-06",
     "text": "重大的事"
    },
    {
     "target": "/skills/wechat-direct/#limits",
     "screen": "wechatdirect-06",
     "text": "技能页的边界"
    },
    {
     "target": "/projects/wechat-history-ai-bridge/",
     "screen": "wechatdirect-10",
     "text": "微信记录交给 AI"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿 11 条全部单列：聊天片段→f-context；变化发现→f-changes；阅读包→f-export-context；单对象档案→f-sync-contact；回复关系→f-reply；媒体核对→f-media-open；朋友圈缓存→f-moments；朋友圈保存→f-sync-moments；窗口保全→f-preserve；导出验真→f-verify；账号区分→f-accounts。",
    "底稿没有、按源码补的 14 条：f-paging、f-self-only、f-long-text、f-msg-types、f-identity、f-voice、f-emoji-remote、f-html、f-full-reconcile、f-repair-media、f-legacy-upgrade、f-doctor、f-recover、f-temp（出处见各条 source）。",
    "context 的 --contains、--around、--lookback-days 并进 f-context；--byte-limit 与 message-part 并成 f-long-text；WXGF 转 PNG/GIF 并进 f-media-open：都是同一次操作里的选项，单列会让本人以为是另一件事。",
    "旧稿的三条亮点（只读点名对象、缺口不当零内容、没搜到说清范围）改写进“为什么这样设计”第 1 条和“读不到或出事的时候”表格，亮点屏换成带数字的“麻烦→解法”真事。",
    "按“亮点只收已经在用的做法”：朋友圈“0 条”那条对应的看朋友圈功能没有真实使用证据（使用记录里没有 moments，只有 9 月 18 日验收），撤出亮点，挪到第 4 屏技术里一条细卡片，写明还没在真实使用里验过；另两条亮点对应分清主号副号、查一段聊天，都是在用。",
    "按审稿第 3 条，“为什么这样设计”删掉和本页其他屏重复的五条（只读、认账号编号、缺口、先建好再换上、给 AI 一小段）和 220、11158 两个数，换成三条本页没讲过的理由（不经过别的服务、为什么要 Python 3.14、测试为什么不用真实聊天）；依赖那行角标从第 4 屏挪进这里的第 3 条。"
   ],
   "dropped": [
    "建设与验收.md 里出现的群名和两个号的昵称：私人信息，不上网站，只用数字。",
    "另有一个按公开范围不上网站的私人技能也调用微信直读：网站和 batch2 都不写。",
    "工具不生成数据库密钥、配置载体的来历（USAGE.md:76 写明未核实生成程序）：属于实现前提，写了本人和别人都不会看，也容易让人去问密钥从哪来，不上。",
    "档案每份的消息数、角色分布（本人／别人／系统）：只上合计，不按单个聊天拆，免得能对上是哪个群。"
   ],
   "unsure": [
    "项目名按 Claude 转达的决定改成本人的说法“微信聊天读取”，仓库名 WeChatDirect（微信直读）只在第 4 屏提一句；网址仍是 /projects/wechatdirect/，旧网站是 /projects/wechat-direct/，旧链接要不要跳转由拼页那边定。",
    "功能状态（个人资料解锁后，9 月 28 日重查）：锁着时降级复查的结论作废。查了 Codex 会话（9 月 15 日起）、Claude 会话、理解库 E:\\PersonalData\\日常偏好\\微信阅读 的 6 批阅读记录，恢复 7 项为在用：找被回的原话、看懂特殊消息、接着往下读、只看我在大群说过的、看哪些聊天有新消息、打开消息的附件、算账号指纹。现在 12 项在用、12 项说不准、1 项待验收。朋友圈两项、完整存底、核对、阅读包、网页版、表情取回、语音转 WAV、长消息分段、整份重核、定点补附件、中断恢复在这些记录里都没找到真用过，照旧说不准。",
    "例子按本人更正用假设的：第 1 屏“比如我说……”和第 2 屏卡片 3 是假设例子；第 2 屏“用过的几次”表格和亮点 3 只留次数和条数，不写读到的内容、群名、人名，也不写对我的结论。",
    "替本人口吻写的句子（上线前给本人过目）：第 1 屏“我问 AI 一件微信里的事……”“比如我说……”；第 2 屏“我明确要求时……”；第 10 屏“按我的决定删掉 1307 行用不到的代码”“只看我在大群说过的”。",
    "第 6 屏第 2 条“旧做法要另开一个取数服务、再交给 AI”：依据是冻结项目“微信记录交给 AI”经 WeFlow 取数、有开机自启和看门狗（旧稿 content/projects/wechat-history-ai-bridge.json）；没读那个冻结项目的代码（按规矩不读），细节以它自己的页为准。",
    "第 10 屏“8 月 24–26 日：……取代旧项目〔微信记录交给 AI〕”：取代关系出自本人原话，但具体哪天停用旧项目没有查到；日期只指微信聊天读取起步。",
    "第 10 屏“按我的决定删掉 1307 行”：本人决定 F4“微信直读的闲置代码：A 删掉”记在北京时间 9 月 26 日第四轮答复，删代码的提交是 9 月 26 日 05:48；决定记录没写具体几点。"
   ]
  },
  "old_urls": [
   "/projects/wechat-direct/"
  ]
 },
 "source": {
  "page": "sources/pages/wechatdirect/page.json",
  "sha256": "a5014bc347d8a40903016a3e9509dfdc5daa0ba1d6544d79e0ab25d65f748b47",
  "converted_at_beijing": "2026-10-20T19:34:00+08:00"
 }
}
---

::screen{#wechatdirect-01 section="top"}

```typeset
{
 "screen": {
  "id": "wechatdirect-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，下面一段介绍（三四行）。右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。聊天窗口用抽象的绿白气泡，不画微信标志，气泡里不画字。中间一排四张数字卡（和标杆页第一屏一样：上面小插画，大号绿色数字，下面一行小字；插画依次是一叠文件夹、一个对话气泡里的小齿轮、一把锁、一张打勾的测试单）。最下面左边两个按钮：〔在整套系统里的位置 → 怎么协作〕、〔GitHub〕（这个按钮左边画 GitHub 的猫形标志）。这个项目没有自动任务，不画“现在”横条。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：标题和介绍在上；插画缩小放在介绍下面；四张数字卡两行两列；两个按钮上下排，各占一整行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#wechatdirect"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/WeChatDirect"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/wechatdirect/#ai-brief"
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
     "text_ref": "微信聊天读取",
     "align": "left",
     "row": "hero",
     "width": "55%",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-wechatdirect-01-h.png",
     "source_box": [
      30,
      26,
      717,
      197
     ]
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 7 日 09:21",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 12 日 · AI 使用记录（10 月 3–9 日，记到 10 月 9 日）",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "我问AI一件微信里的事，AI就用它直接读这台电脑上微信的本地数据库：只读我点名的那个人或群、够回答问题的那一小段，把谁说的、回的是哪句、附件",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "stat_card",
     "text_ref": "4份聊天档案，共7934条消息（截至10月12日）888段聊天替理解库读过，共11541条消息（9月8日起）45次打开微信数据库，一次都没写",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-01",
    "component_order": [
     "chapter_title",
     "prose",
     "illustration",
     "stat_card",
     "action_button",
     "inline_link",
     "content_card",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "微信聊天读取",
     "align": "center",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-wechatdirect-01-h.png",
     "source_box": [
      30,
      26,
      717,
      197
     ]
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 7 日 09:21",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 12 日 · AI 使用记录（10 月 3–9 日，记到 10 月 9 日）"
    },
    {
     "type": "stat_card",
     "text_ref": "4份聊天档案，共7934条消息（截至10月12日）888段聊天替理解库读过，共11541条消息（9月8日起）45次打开微信数据库，一次都没写",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "我问AI一件微信里的事，AI就用它直接读这台电脑上微信的本地数据库：只读我点名的那个人或群、够回答问题的那一小段，把谁说的、回的是哪句、附件"
    },
    {
     "type": "illustration"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-01",
    "component_order": [
     "illustration",
     "stat_card",
     "action_button",
     "chapter_title",
     "prose",
     "inline_link",
     "content_card",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "4 份｜聊天档案，共 7934 条消息（截至 9 月 28 日）",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "839 段｜聊天替理解库读过，共 10561 条消息（9 月 8–27 日，6 次）",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "0 次｜写微信数据库：9 月 18 日实测读了 45 次源文件，一次都没写",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "220 个｜自动测试，11158 行 Python",
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
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-wechatdirect",
   "source_phrase": "右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别画抽象短线的抽象图形；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面画抽象短线的"
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
   "asset": "wechatdirect/wechatdirect-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-wechatdirect-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b56251f26d1e6a830f55",
   "title_text": "微信聊天读取",
   "sha256": "01943c96d2dba6a8cb3a89d7ba1375f3afdec50051fda70bb3bcbf8e8fa29b83",
   "status": "ready",
   "source_box": [
    30,
    26,
    717,
    197
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 微信聊天读取

我问 AI 一件微信里的事，AI 就用它直接读这台电脑上微信的本地数据库：只读我点名的那个人或群、够回答问题的那一小段，把谁说的、回的是哪句、附件属于哪条一起交回来。要长期保存，就给那个人或群建一份档案，以后只补新的。微信的数据库它只读不写，也不上网补历史，所以能读到的就是这台电脑上存着的那些；唯一的例外是我明确要附件时，可以按消息里记着的地址取回表情。

比如我说“微信有新消息，把近况更新一下”：AI 先列出两个号最近有新消息的聊天，一个个读完（人多的群只读我自己的发言），把能看出我最近在做什么的整理成摘要交给个人理解库；推送、客服这类没内容的，直接标成读过。

- **4 份**｜聊天档案，共 7934 条消息（截至 10 月 12 日）
- **888 段**｜聊天替理解库读过，共 11541 条消息（9 月 8 日起）
- **45 次**｜打开微信数据库，一次都没写：9 月 18 日实测只读不写
- **224 个**｜自动测试，11189 行 Python（10 月 11 日数的代码里写着的数量，这次没有重跑）

10 月 11 日重新清点这 4 份档案：里面存着 12 张 PNG 图片，没有语音文件；认不出是谁发的消息 0 条；最近一次更新档案是 9 月 10 日，之后没再跑过。现在的版本是 0.2.3，代码核对到 10 月 7 日最后一次提交。

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#wechatdirect-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wechatdirect-02",
  "section": "usage",
  "title": "怎么用",
  "scene": "横版：左上标题，下面一行小字。六张卡片两行三列，每张上方一幅小水彩插画，下面粗体标题和两三行字。插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。最下面一张横跨整屏的浅色卡片：一行标题（带一个链接），下面一张六行的小表格，表格下一行链接。",
  "portrait": "竖版：标题和那行小字在上；六张卡片一行一张往下排；最下面的小表格改成一行一条的卡片（日期粗体，下面写做什么和读了多少）。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/",
    "locator_instances": {
     "h": {
      "input_sha256": "457134bb2de457cdc0b35e317072428a463fed26256c4e7f62163442a260abea",
      "instances": [
       {
        "context_text": "用过的几次（都是替个人理解库读：先列出有新消息的聊天，只看列表不读正文，再挑着读）",
        "context_rect": [
         61,
         675,
         979,
         706
        ],
        "expected_rect": [
         293,
         681,
         406,
         706
        ],
        "lookup_text": "个人理解库",
        "confirm_region": true
       }
      ]
     }
    }
   },
   {
    "text": "技能页",
    "href": "/skills/wechat-direct/"
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
     "text_ref": "怎么用",
     "align": "center",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-02-h.png",
     "source_box": [
      38,
      4,
      411,
      175
     ]
    },
    {
     "type": "prose",
     "text_ref": "它不在后台跑：没有自动任务，也没有常驻程序，只在我问到微信时由AI调用一次，答完就结束。"
    },
    {
     "type": "source_text_card",
     "text_ref": "1问一段聊天里的事",
     "whole_block": true,
     "columns": 1,
     "row": "cards-top",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "2那句话回的是哪句",
     "whole_block": true,
     "columns": 1,
     "row": "cards-top",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "3听语音、看图片和文件",
     "whole_block": true,
     "columns": 1,
     "row": "cards-top",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "4给一个人或群建档",
     "whole_block": true,
     "columns": 1,
     "row": "cards-bottom",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "5看朋友圈",
     "whole_block": true,
     "columns": 1,
     "row": "cards-bottom",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "6把一段聊天完整存底",
     "whole_block": true,
     "columns": 1,
     "row": "cards-bottom",
     "width": "33.333%"
    },
    {
     "type": "notice",
     "text_ref": "用过的几次（都是替个人理解库读：先列出有新消息的聊天，只看列表不读正文，再挑着读）"
    },
    {
     "type": "table",
     "text_ref": "日期做什么读了多少9月8日个人项目终审，理解库全面核对675段、7502条9月12日理解库更新（两批）44段、513条9月15日认知审计14"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、例子和边界，见技能页。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-02",
    "component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "illustration",
     "tag",
     "inline_link",
     "table",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么用",
     "align": "center",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-02-h.png",
     "source_box": [
      38,
      4,
      411,
      175
     ]
    },
    {
     "type": "prose",
     "text_ref": "它不在后台跑：没有自动任务，也没有常驻程序，只在我问到微信时由AI调用一次，答完就结束。"
    },
    {
     "type": "source_text_card",
     "text_ref": "1问一段聊天里的事",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "2那句话回的是哪句",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "3听语音、看图片和文件",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "4给一个人或群建档",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "5看朋友圈",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "6把一段聊天完整存底",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "notice",
     "text_ref": "用过的几次（都是替个人理解库读：先列出有新消息的聊天，只看列表不读正文，再挑着读）"
    },
    {
     "type": "table",
     "text_ref": "日期做什么读了多少9月8日个人项目终审，理解库全面核对675段、7502条9月12日理解库更新（两批）44段、513条9月15日认知审计14"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、例子和边界，见技能页。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-02",
    "component_order": [
     "content_card",
     "table",
     "chapter_title",
     "prose",
     "illustration",
     "tag",
     "inline_link",
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
   "asset": "_library/icons/气泡.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "对话气泡",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "4ffd11a1805d6fcd443e6d721ff92690ba8469f4bbdb231be34373895d4565ac",
   "status": "ready",
   "original_elements": [
    "一个带问号的对话气泡"
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
   "asset": "_library/icons/气泡.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "对话气泡",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "4ffd11a1805d6fcd443e6d721ff92690ba8469f4bbdb231be34373895d4565ac",
   "status": "ready",
   "original_elements": [
    "两句气泡被一条细绿线连起来"
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
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "一个小喇叭和一张小照片"
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
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文件收纳现图小槽4比3",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "一个文件夹里一叠纸，最上面一张贴着小绿标签"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "一张相框样式的小动态卡片"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-c20cd39482f91d.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-c20cd39482f91d",
   "source_phrase": "插画依次是：一个带问号的对话气泡；两句气泡被一条细绿线连起来；一个小喇叭和一张小照片；一个文件夹里一叠纸，最上面一张贴着小绿标签；一张相框样式的小动态卡片；一个封好的牛皮纸袋，袋口一个对勾。",
   "sha256": "2553ce6d1fd05ee59fc0d9aee6ca7dc6576eee2b28a45bffa9dec516ba95adf3",
   "status": "ready",
   "original_elements": [
    "一个封好的牛皮纸袋，袋口一个对勾"
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
   "asset": "wechatdirect/wechatdirect-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9fe7ee9705091075f9a6",
   "title_text": "怎么用",
   "sha256": "a2404fd06bb0d2c9aaf2d5c456cc8d831d5d9fb9f267b8520f707ac8048a9f98",
   "status": "ready",
   "source_box": [
    38,
    4,
    411,
    175
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 怎么用

它不在后台跑：没有自动任务，也没有常驻程序，只在我问到微信时由 AI 调用一次，答完就结束。

1. **问一段聊天里的事**
说哪个人或群、哪天或什么关键词，AI 先认准是主号还是副号里的哪一个，只读够回答的一小段：每次最多翻 500 条、交回 80 条，带上时间和谁说的。

2. **那句话回的是哪句**
引用回复和它回的原消息放在一起交回；原消息在这一段之外，就标出来再往前补读。9 月 27 日那次读回的 1853 条里，有 82 条是被引用的原消息。

3. **听语音、看图片和文件**
点名那条消息，只打开那条消息自己的附件。语音转成 WAV 交给中文语音转写，图片交给 AI 看。比如一张图电脑上已经删了，就标成打不开，不拿别的图顶上。

4. **给一个人或群建档**
第一次存下这台电脑上能看到的全部聊天，以后同一句话只补新的。现在有 4 份。

5. **看朋友圈**
读这台电脑上缓存着的朋友圈。缓存里没有这个人，就请我在同一个号里点开他的主页再试，不说“他没发过”。到现在还没用过。

6. **把一段聊天完整存底**
我明确要求时，把那段聊天连同附件、时间、消息编号和每个文件的 SHA-256 指纹存成一个文件夹，以后能核对一个字没变。到现在还没用过。

**用过的几次**（都是替〔个人理解库〕读：先列出有新消息的聊天，只看列表不读正文，再挑着读）
| 日期 | 做什么 | 读了多少 |
|---|---|---|
| 9 月 8 日 | 个人项目终审，理解库全面核对 | 675 段、7502 条 |
| 9 月 12 日 | 理解库更新（两批） | 44 段、513 条 |
| 9 月 15 日 | 认知审计 | 14 段、510 条 |
| 9 月 18 日 | 理解库更新 | 58 段、183 条 |
| 9 月 26 日 | 群聊认知审计：只读我自己的发言 | 10 个群、我今年的 61070 条 |
| 9 月 27 日 | 近况更新 | 47 个聊天、1853 条 |
| 10 月 6 日 | 理解库更新 | 49 段、980 条 |

跟 AI 怎么说、例子和边界，见〔技能页〕。

::screen{#wechatdirect-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wechatdirect-03",
  "section": "usage",
  "title": "读不到或出事的时候",
  "scene": "横版：左上标题。左边约三分之二宽是一张两列表格（左列“情况”，右列“它怎么做”），八行，每行左边一个小水彩图标（两个同名小名牌、一个空的放大镜、一张缺了角的照片、一个没有名字的头像、一支正在写字的笔、一张被涂改的纸、一个被占用的文件夹、一个拔掉的插头）。右边约三分之一宽，一张米色便签样式的卡片，写“它读不到的”那段。",
  "portrait": "竖版：标题在上；表格改成一行一条的卡片（粗体写情况，下面一行写它怎么做）；便签卡放在最下面。",
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
     "text_ref": "读不到或出事的时候",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "情况它怎么做同一个名字在主号、副号都有，或者有重名停下列出候选让我选，不猜关键词在这一段没搜到说“这一段没有”，给出接着往下读的位置；整个范"
    },
    {
     "type": "notice",
     "text_ref": "它读不到的：本地库里没有的旧聊天、清过缓存的图片和语音、这台电脑上没缓存的朋友圈。本机能看到的不等于微信的全部历史。它也不会主动提醒，有问题",
     "tone": "yellow"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-03",
    "component_order": [
     "chapter_title",
     "table",
     "icon",
     "notice",
     "content_card"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "读不到或出事的时候",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "情况它怎么做同一个名字在主号、副号都有，或者有重名停下列出候选让我选，不猜关键词在这一段没搜到说“这一段没有”，给出接着往下读的位置；整个范"
    },
    {
     "type": "notice",
     "text_ref": "它读不到的：本地库里没有的旧聊天、清过缓存的图片和语音、这台电脑上没缓存的朋友圈。本机能看到的不等于微信的全部历史。它也不会主动提醒，有问题",
     "tone": "yellow"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-03",
    "component_order": [
     "table",
     "content_card",
     "notice",
     "chapter_title",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "两个同名小名牌",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个空的放大镜",
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
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "照片堆",
   "source_phrase": "一张缺了角的照片",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "source_phrase": "一个没有名字的头像",
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
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "一支正在写字的笔",
   "sha256": "2d0d521fc4bad84cc12f472e1930bd6d0045f3efa00a238ee6dd31d23d3bb1c2",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张被涂改的纸",
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
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "一个拔掉的插头",
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
   "asset": "_library/titles/title-c3e815393f8b66e5a4e8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c3e815393f8b66e5a4e8",
   "title_text": "读不到或出事的时候",
   "sha256": "119da2d5627db369de50af9a2283330bbb7eec77f6c969a7b51a3f5e17d3627c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 读不到或出事的时候


| 情况 | 它怎么做 |
|---|---|
| 同一个名字在主号、副号都有，或者有重名 | 停下列出候选让我选，不猜 |
| 关键词在这一段没搜到 | 说“这一段没有”，给出接着往下读的位置；整个范围读完才说“这段时间没提过” |
| 图片、语音在电脑上已经没了 | 标成缺口，不当成这条消息没内容：4 份档案里有 2329 次附件这样标着。以后在微信里重新下载到本机，可以对这份档案再补一次；还读不到就继续标缺口，不保证追得回来 |
| 群成员的昵称取不到 | 写“群成员（昵称未取到）”，不拿群名顶替：档案里有 1925 条 |
| 读的时候微信正好在写数据库，或者把文件换掉了 | 先核对还是不是同一个文件，不是就自动重读，最多三次；还不稳才停下让重跑。不把前后两份内容拼在一起 |
| 档案里的文件被改过 | 拒绝更新，指出哪个文件对不上，不覆盖 |
| 档案正被别的程序占用 | 停下报“档案正被占用”，关掉占着它的程序后原地重试；已经换上新版、只是清理没做完的，先按恢复命令收尾 |
| 更新档案时断电或被强行关掉 | 旧档案原样留着；先查看现场，再撤回或完成这次更新 |

**它读不到的**：本地库里没有的旧聊天、清过缓存的图片和语音、这台电脑上没缓存的朋友圈。本机能看到的不等于微信的全部历史。它也不会主动提醒，有问题就在当次回答里说。

**微信退回扫码页**：10 月 7 日之前遇到过微信窗口还在、却退回扫码页要重新登录。当时同时做了两件事：读取方式改成不挡微信改文件名、并核对是不是同一个文件（见下一屏第 2 步）；让显卡监控软件 RTSS 不再挂到微信上。之后我确认恢复正常。两件事是一起做的，没有分开试，所以说不准是哪一件起的作用，也不能说读库就是原因。再出现时按新问题看，不当作原因已经找到。

::screen{#wechatdirect-04 section="tech"}

```typeset
{
 "screen": {
  "id": "wechatdirect-04",
  "section": "tech",
  "title": "它是怎么读的",
  "scene": "横版：左上标题。一张从左到右、分两行的流程图，每行四个节点，第一行末尾的箭头拐下来接第二行开头。每个节点是圆角卡片：左上一个小水彩图标（一张盖着指纹章的身份卡、一张复印出来的纸、一把钥匙插在锁里、一本翻开的小日志、一张只亮了一行的表格、几个拼好的对话气泡、一个回形针别着一张照片和一个小喇叭、一个文档和一把小扫帚），粗体小标题，下面一两行小字。节点之间绿色箭头。流程图下面一条横跨整屏的浅色细卡片，左边一个小相框图标，写“朋友圈另走一条路”那段。右下角一行灰色小字写仓库名。",
  "portrait": "竖版：八个节点从上到下排成一列，箭头向下；朋友圈那段细卡片接在节点后面；仓库名那行放在最下面。",
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
     "text_ref": "它是怎么读的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "认准账号",
     "columns": 4,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "朋友圈另走一条路：读的是微信的朋友圈缓存库，找某个人时把当前缓存整个扫一遍（347条约0.4秒），只挑这个人的。旧版只翻靠前一截，排在第34"
    },
    {
     "type": "prose",
     "text_ref": "仓库名WeChatDirect（微信直读）"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-04",
    "component_order": [
     "chapter_title",
     "flow",
     "prose",
     "content_card",
     "icon",
     "section_heading",
     "notice",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么读的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "认准账号",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "朋友圈另走一条路：读的是微信的朋友圈缓存库，找某个人时把当前缓存整个扫一遍（347条约0.4秒），只挑这个人的。旧版只翻靠前一截，排在第34"
    },
    {
     "type": "prose",
     "text_ref": "仓库名WeChatDirect（微信直读）"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-04",
    "component_order": [
     "flow",
     "notice",
     "content_card",
     "chapter_title",
     "prose",
     "icon",
     "section_heading",
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
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "身份盾牌",
   "source_phrase": "一张盖着指纹章的身份卡",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张复印出来的纸",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把钥匙插在锁里",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "翻开册子",
   "source_phrase": "一本翻开的小日志",
   "sha256": "443a1e26f04d1a582103f4475c613c05b9c1f1c9e854081d0d14073fc8e51894",
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
   "source_phrase": "一张只亮了一行的表格",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "几个拼好的对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "照片堆",
   "source_phrase": "一个回形针别着一张照片和一个小喇叭",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个文档和一把小扫帚",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "asset": "_library/titles/title-d6e04a733b9017f8080e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d6e04a733b9017f8080e",
   "title_text": "它是怎么读的",
   "sha256": "2ec5813025b80178b13aae2f2333041edb3e9134c2b97f8b14fafbca5f61f8df",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 它是怎么读的

1. **认准账号**｜可以只配一个号，也可以配主号、副号两个；每个号记两份身份指纹（SHA-256），每次读之前先核对，对不上就停，不会读错号。没配的那个号不会拿另一个号去顶
2. **复制快照**｜把要用的数据库复制到临时文件夹再读，微信自己的库只读不碰。打开微信的文件只要读权限，同时允许微信照常写入、改名和删除（Windows 共享读取），不挡它换文件；复制时核对文件身份、大小和修改时间，中途被换掉就重读，最多三次。这不保证 Windows 每一种覆盖替换都能在读的同时成功，也不是绕开微信的检测
3. **解密**｜微信 4 的数据库整份加密（WCDB，基于 SQLCipher）：每 4096 字节一页，逐页解开；密钥要反复运算 256000 轮才算得出。配置里存的密钥也锁着，只有本机这个 Windows 用户能解开（DPAPI）
4. **补上刚收到的**｜微信刚写、还没并进主文件的消息，先记在旁边的日志文件（WAL）里：逐段核对，只合并已经写完整的部分
5. **只读一张表**｜只打开点名那个人或群的消息表，不扫别的聊天
6. **还原消息**｜压缩存着的正文先解开（zstd）。微信 4 把消息分存在几个数据库文件里，每个文件自带一张“编号→账号”的对照表；认发送者要用消息所在那个文件的表，用错表就会认错人。引用、转账、红包、通话、拍一拍按微信自己的结构还原
7. **配上附件**｜图片按消息里记的文件指纹找到原文件，再解密；语音从微信自己的 SILK 格式转成常见的 WAV；微信特有的 WXGF 图片转成 PNG 或 GIF
8. **交出去、清干净**｜结果是一份结构化的结果文件（JSON）：读了多大范围、缺了什么、下一段从哪接；临时解密的文件正常结束就删；中途被打断留下的，用清理命令查看和清掉

**朋友圈另走一条路**：读的是微信的朋友圈缓存库，找某个人时把当前缓存整个扫一遍（347 条约 0.4 秒），只挑这个人的。旧版只翻靠前一截，排在第 346 条的人会被误报“0 条”，验收时发现并改好了；这条路还没在我的真实使用里验过。

仓库名 WeChatDirect（微信直读）

::screen{#wechatdirect-05 section="tech"}

```typeset
{
 "screen": {
  "id": "wechatdirect-05",
  "section": "tech",
  "title": "档案怎么存、怎么更新",
  "scene": "横版：左上标题。左边约五分之二宽，一个打开的牛皮纸文件夹水彩插画，里面的文件像清单一样一行行画出来：每行左边一个小文件图标，粗体文件名，后面一句说明（就是“文件夹里有”那七行，字照抄）。右边三张竖排的横向卡片：“再跑一次”“换新版本”“给 AI 的只挑一小段”，每张左边一个小图标（循环箭头、两个并排的文件夹之间一个换位箭头、一把镊子夹起一小张纸）。最底下一条横跨整屏的细卡片放“实测”那句，数字用绿色大一点的字。",
  "portrait": "竖版：标题；文件夹插画和七行清单；三张卡片一行一张；实测细卡片放最后，数字分三行排。",
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
     "text_ref": "档案怎么存、怎么更新",
     "align": "center",
     "size": "large"
    },
    {
     "type": "document_mock",
     "text_ref": "文件夹里有：",
     "row": "archive",
     "width": "40%",
     "align": "left",
     "variant": "directory",
     "columns": 1,
     "header_nodes": 1,
     "directory_art": "none",
     "file_icons": [
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/icons/文件夹.png"
     ]
    },
    {
     "type": "source_text_card",
     "text_ref": "再跑一次",
     "columns": 1,
     "columns_v": 1,
     "row": "archive",
     "width": "60%",
     "whole_block": true
    },
    {
     "type": "source_text_card",
     "text_ref": "换新版本",
     "columns": 1,
     "columns_v": 1,
     "row": "archive",
     "whole_block": true
    },
    {
     "type": "source_text_card",
     "text_ref": "给AI的只挑一小段",
     "columns": 1,
     "columns_v": 1,
     "row": "archive",
     "whole_block": true
    },
    {
     "type": "notice",
     "text_ref": "实测（8月25日，一个6145条的群）：第一次建档8.2秒；再跑一次、没有新消息0.7秒；给AI的7264字节，整份记录4.49MB。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 独立文字审查后，将七行文件名与原有“文件夹里有”标题交给已有document_mock.directory，维持横版40%/60%与竖版原顺序；真实牛皮纸文件夹素材、实测数字三行仍待补。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-05",
    "component_order": [
     "chapter_title",
     "document_mock",
     "illustration",
     "content_card",
     "icon",
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
     "text_ref": "档案怎么存、怎么更新",
     "align": "center",
     "size": "large"
    },
    {
     "type": "document_mock",
     "text_ref": "文件夹里有：",
     "align": "left",
     "variant": "directory",
     "columns": 1,
     "header_nodes": 1,
     "directory_art": "none",
     "file_icons": [
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
      "_library/icons/文件夹.png"
     ]
    },
    {
     "type": "source_text_card",
     "text_ref": "再跑一次",
     "columns": 1,
     "columns_v": 1,
     "whole_block": true
    },
    {
     "type": "source_text_card",
     "text_ref": "换新版本",
     "columns": 1,
     "columns_v": 1,
     "whole_block": true
    },
    {
     "type": "source_text_card",
     "text_ref": "给AI的只挑一小段",
     "columns": 1,
     "columns_v": 1,
     "whole_block": true
    },
    {
     "type": "notice",
     "text_ref": "实测（8月25日，一个6145条的群）：第一次建档8.2秒；再跑一次、没有新消息0.7秒；给AI的7264字节，整份记录4.49MB。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 独立文字审查后，将七行文件名与原有“文件夹里有”标题交给已有document_mock.directory，维持横版40%/60%与竖版原顺序；真实牛皮纸文件夹素材、实测数字三行仍待补。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 右侧三卡改source_text_card，目录暂不自动使用语义未核对的大图候选，避免越界和压字；文件夹插画仍未完成。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-05",
    "component_order": [
     "illustration",
     "content_card",
     "notice",
     "chapter_title",
     "document_mock",
     "icon",
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
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "循环箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "两个并排的文件夹之间一个换位箭头",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一把镊子夹起一小张纸",
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
   "source_phrase": "",
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
   "asset": "_library/illustrations/文件收纳通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件收纳通用构图",
   "source_phrase": "左边约五分之二宽，一个打开的牛皮纸文件夹水彩插画，里面的文件像清单一样一行行画出来：每行左边一个小文件图标，粗体文件名，后面一句说明（就是“文件夹里有”那七行，字照抄）。",
   "sha256": "764e9012bb1bbe7cfc27ff7639b21204558266fe15f49c6340212ad71fb8560d",
   "status": "ready",
   "original_elements": [
    "左边约五分之二宽，一个打开的牛皮纸文件夹水彩插画，里面的文件像清单一样一行行画出来：每行左边一个小文件图标，粗体文件名，后面一句说明（就是抽象图形那七行，字照抄"
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
   "asset": "_library/round3/titles/title-r3-a03f622b1e83c22d0ceb.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-05-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-a03f622b1e83c22d0ceb",
   "title_text": "档案怎么存、怎么更新",
   "sha256": "957c3bcb655937c37d77d84917875f94d34533101e0bc84d7809a382b29ac8f9",
   "status": "ready",
   "source_box": [
    41,
    86,
    901,
    292
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 档案怎么存、怎么更新

文件夹里有：
- **ai-context.md**　给 AI 的最近 80 条，最多 128 KB
- **context.md**　整份档案，人能读
- **messages.jsonl**　每条消息一行，用来精确搜索和去重
- **manifest.json**　范围和每个文件的指纹
- **state.json**　下次从哪接着读
- **last-run.json**　最近一次跑的结果和缺口
- **media/**　能打开的图片、表情、语音、视频、文件

**再跑一次**：先核对已有档案没被改过：清单、全文、每条记录和附件的指纹都要对得上，对不上就拒绝更新。微信库没变，就在原目录确认一下、只记一笔，不重新复制整份档案；有新消息就从上次的位置接着读，多个分库时往回重叠 1 天防漏，去掉重复再合并。普通的再跑一次只接新的：很早以前的消息后来被改过、或者附件后来才下载到本机，要我明说，才对这个人或群整份重核，或者只补缺的附件。

**换新版本**：只有真有变化时，才在旁边的临时文件夹里建好、核对完再换上。换的时候要改两次目录名，万一正好卡在中间断电，旧版本还在，恢复命令能撤回或完成。档案正被别的程序占着时，统一报“档案正被占用”，关掉占用的程序后原地重试。

**给 AI 的只挑一小段**：平时只给 ai-context.md；更早的事先在整份档案里搜到，再读附近几条。

实测（8 月 25 日，一个 6145 条的群）：第一次建档 8.2 秒；再跑一次、没有新消息 0.7 秒；给 AI 的 7264 字节，整份记录 4.49 MB。

::screen{#wechatdirect-06 section="tech"}

```typeset
{
 "screen": {
  "id": "wechatdirect-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，四张横向卡片排成两列两行（小水彩图标＋粗体一句＋两三行小字；图标依次是一个只圈住一个人的圆圈、一根直连电脑和数据库的短线、一个写着 3.14 的小蛇形徽章、一张盖着“示例”章的假聊天纸）。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。最下面一行灰色小字。",
  "portrait": "竖版：标题；四张卡片一行一张；三张数字卡一行一张；灰色小字在最后。",
  "links": [
   {
    "text": "重大的事",
    "href": "/rules/charter/#L17",
    "locator_instances": {
     "v": {
      "input_sha256": "24a56058d07b541f85c1bde2163f249c44862f3f5f83240d64cb7006ff5ed9ef",
      "instances": [
       {
        "context_text": "(重大的事）。它不做的事列在（技能页的边界）。",
        "context_rect": [
         71,
         838,
         880,
         878
        ],
        "expected_rect": [
         71,
         838,
         283,
         879
        ],
        "lookup_text": "重大的事",
        "confirm_region": true,
        "context_padding_px": 1
       }
      ]
     }
    }
   },
   {
    "text": "技能页的边界",
    "href": "/skills/wechat-direct/#limits",
    "locator_text": {
     "h": "(技能页的边界。"
    },
    "locator_instances": {
     "v": {
      "input_sha256": "24a56058d07b541f85c1bde2163f249c44862f3f5f83240d64cb7006ff5ed9ef",
      "instances": [
       {
        "context_text": "(重大的事）。它不做的事列在（技能页的边界）。",
        "context_rect": [
         71,
         838,
         880,
         878
        ],
        "expected_rect": [
         585,
         841,
         860,
         877
        ],
        "lookup_text": "技能页的边界",
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-06-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-06-v.png",
     "source_box": [
      30,
      90,
      910,
      340
     ]
    },
    {
     "type": "flow",
     "text_ref": "1只读点名的，不整号同步。问的是一件事，就只该碰那一个人或群的那一段：范围一眼看得清，也不会顺手把整个号的聊天搬出来。整批导出聊天记录，属于",
     "columns": 2,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "design",
     "width": "67%",
     "direction": "horizontal"
    },
    {
     "type": "stat_card",
     "text_ref": "3个依赖15个命令37次公开提交（8月30日起）",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "row": "design",
     "width": "33%"
    },
    {
     "type": "prose",
     "text_ref": "每次推送，GitHub上用Windows按两套依赖（固定版本、最新版本）各跑一遍测试。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-06",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "stat_card",
     "prose",
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large",
     "asset": "wechatdirect\\wechatdirect-06-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-06-v.png",
     "source_box": [
      30,
      90,
      910,
      340
     ]
    },
    {
     "type": "flow",
     "text_ref": "1只读点名的，不整号同步。问的是一件事，就只该碰那一个人或群的那一段：范围一眼看得清，也不会顺手把整个号的聊天搬出来。整批导出聊天记录，属于",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "direction": "vertical"
    },
    {
     "type": "stat_card",
     "text_ref": "3个依赖15个命令37次公开提交（8月30日起）",
     "columns": 1,
     "columns_v": 1,
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "每次推送，GitHub上用Windows按两套依赖（固定版本、最新版本）各跑一遍测试。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 首轮发现基础编号卡正文23px与同页数字卡24px不一致；无连接的编号卡改用现有flow，维持原列数和位置、正文统一共享字号，不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-06",
    "component_order": [
     "content_card",
     "prose",
     "stat_card",
     "chapter_title",
     "icon",
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
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "只读点名的，不整号同步。｜问的是一件事，就只该碰那一个人或群的那一段：范围一眼看得清，也不会顺手把整个号的聊天搬出来。整批导出聊天记录，属于约法里的〔重大的事〕。它不做的事列在〔技能页的边界〕。",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "直接读本地库，不经过别的服务。｜旧做法要另开一个取数服务、再交给 AI，多一个要一直开着、会坏的环节；现在调用一次、读完就退出，电脑上不留常驻程序。",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "要 Python 3.14。｜微信 4 的正文用 zstd 压缩，3.14 的标准库自带解压；这样依赖只有 cryptography、Pillow、tzdata 三个。语音解码用的 pilk 另装在一个单独的 Python 3.11 里。",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "测试不用真实聊天。｜仓库是公开的，所以测试全用编出来的消息、加密数据库和故意弄坏的日志；真实聊天只在本机验收，结果只记数字。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "wechatdirect/wechatdirect-06-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-06-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "ad71f994850283a95cdec0c1364c324a66e4c26337ee9370b5a022ad5efbc258",
   "status": "ready",
   "source_box": [
    30,
    90,
    910,
    340
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 为什么这样设计

1. **只读点名的，不整号同步。**｜问的是一件事，就只该碰那一个人或群的那一段：范围一眼看得清，也不会顺手把整个号的聊天搬出来。整批导出聊天记录，属于约法里的〔重大的事〕。它不做的事列在〔技能页的边界〕。
2. **直接读本地库，不经过别的服务。**｜旧做法要另开一个取数服务、再交给 AI，多一个要一直开着、会坏的环节；现在调用一次、读完就退出，电脑上不留常驻程序。
3. **要 Python 3.14。**｜微信 4 的正文用 zstd 压缩，3.14 的标准库自带解压；这样依赖只有 cryptography、Pillow、tzdata 三个。语音解码用的 pilk 另装在一个单独的 Python 3.11 里。
4. **测试不用真实聊天。**｜仓库是公开的，所以测试全用编出来的消息、加密数据库和故意弄坏的日志，跑之前还先屏蔽掉本机真实的设置和个人目录；真实聊天只在本机验收，结果只记数字。

- **3 个**｜依赖
- **15 个**｜命令
- **37 次**｜公开提交（8 月 30 日起）

每次推送，GitHub 上用 Windows 按两套依赖（固定版本、最新版本）各跑一遍测试。

::screen{#wechatdirect-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "wechatdirect-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和标杆页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 两个聊天窗口顶上的名牌被一只手对调，旁边一枚绿色指纹印章；2 左边一张写满乱码方块的纸条，一个箭头，右边变成整齐的横线文字（不画真实的字）；3 一个很多人头像的群聊窗口，只有一个头像的气泡被绿色放大镜挑出来排成一列。",
  "portrait": "竖版：三张卡片一行一张往下排，插画在每张卡片上方。",
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
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "source_text_card",
     "text_ref": "1主号副号曾经贴反了。",
     "whole_block": true,
     "columns": 1,
     "row": "highlights",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "2文件传输助手的正文读成了乱码。",
     "whole_block": true,
     "columns": 1,
     "row": "highlights",
     "width": "33.333%"
    },
    {
     "type": "source_text_card",
     "text_ref": "3只读我自己说过的话。",
     "whole_block": true,
     "columns": 1,
     "row": "highlights",
     "width": "33.333%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-07",
    "component_order": [
     "chapter_title",
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
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "source_text_card",
     "text_ref": "1主号副号曾经贴反了。",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "2文件传输助手的正文读成了乱码。",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "3只读我自己说过的话。",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-07",
    "component_order": [
     "content_card",
     "illustration",
     "chapter_title",
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
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "截图聊天现图小槽4比3",
   "source_phrase": "插画：1 两个聊天窗口顶上的名牌被一只手对调，旁边一枚绿色指纹印章；2 左边一张写满乱码方块的纸条，一个箭头，右边变成整齐的横线文字（不画真实的字）；3 一个很多人头像的群聊窗口，只有一个头像的气泡被绿色放大镜挑出来排成一列。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "两个聊天窗口顶上的名牌被一只手对调，旁边一枚绿色指纹印章"
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
   "asset": "_library/illustrations/乱码修复宽构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "乱码修复宽构图",
   "source_phrase": "插画：1 两个聊天窗口顶上的名牌被一只手对调，旁边一枚绿色指纹印章；2 左边一张写满乱码方块的纸条，一个箭头，右边变成整齐的横线文字（不画真实的字）；3 一个很多人头像的群聊窗口，只有一个头像的气泡被绿色放大镜挑出来排成一列。",
   "sha256": "3c1e0eb893840e38f29a4e6bb56773cee8674ad86aedf8477d06a43811ccfdd9",
   "status": "ready",
   "original_elements": [
    "左边一张写满乱码方块的纸条，一个箭头，右边变成整齐的横线文字（不画真实的字"
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
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "截图聊天现图小槽4比3",
   "source_phrase": "插画：1 两个聊天窗口顶上的名牌被一只手对调，旁边一枚绿色指纹印章；2 左边一张写满乱码方块的纸条，一个箭头，右边变成整齐的横线文字（不画真实的字）；3 一个很多人头像的群聊窗口，只有一个头像的气泡被绿色放大镜挑出来排成一列。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一个很多人头像的群聊窗口，只有一个头像的气泡被绿色放大镜挑出来排成一列"
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
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    33,
    87,
    297,
    304
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 亮点

1. **主号副号曾经贴反了。**
早期配置里两个号的标签对调了，按标签读，会把副号的聊天当成主号的。现在每个号只认账号编号的 SHA-256 指纹，每次读之前都核对；当时的 3 份档案按新指纹全部重建，同名的人不会再跨号串。

2. **文件传输助手的正文读成了乱码。**
微信 4 把很多消息正文用 zstd 压缩存着，旧代码没解开，读出来是一堆乱码。解开之后，两个号的文件传输助手（1057 条、1105 条）能正常读出的正文分别是 398 条、633 条，正文缺口 0；其余是图片、视频这类附件，走附件那条路。

3. **只读我自己说过的话。**
比如我让 AI 看我在几个群里的发言，做一次认知审计。大群里几万条都是别人的话，全部解开既慢，也没必要。它在解开正文之前，先按发送者只挑出我的，再挑重点段落细读；别人的回应只在需要时按时间补读。9 月 26 日那次，副号 10 个群里我今年说过的 61070 条就是这样取全的。

::screen{#wechatdirect-08 section="features"}

```typeset
{
 "screen": {
  "id": "wechatdirect-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和标杆页“全部功能”一样的画法：同一个网格上下拼成一整段，这是第一张：顶上标题，标题下面一行图例，再一行小字说明三种状态怎么判。组名用毛笔字写在每组卡片上方，横跨整行，不单独占一列；每组的卡片排成三列。每张卡片：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，说不准＝浅灰）；每行最后一段（竖线后面）是状态，画成圆点，不写字；带“·真实数据测过”的，另在卡片右下角加一个浅绿小标签写“真实数据测过”。竖线不画。上下边不画边框，方便和下一张拼接。",
  "portrait": "竖版：图例和说明在最上（只有第一张有）；组名一行，卡片一行一张往下排；圆点和小标签位置不变。",
  "links": [],
  "anchors": [
   {
    "id": "g-read",
    "text": "读聊天"
   },
   {
    "id": "f-context",
    "text": "查一段聊天"
   },
   {
    "id": "f-reply",
    "text": "找被回的原话"
   },
   {
    "id": "f-paging",
    "text": "接着往下读"
   },
   {
    "id": "f-self-only",
    "text": "只看我在大群说过的"
   },
   {
    "id": "f-long-text",
    "text": "长消息分段读"
   },
   {
    "id": "f-msg-types",
    "text": "看懂特殊消息"
   },
   {
    "id": "g-sessions",
    "text": "账号和会话"
   },
   {
    "id": "f-accounts",
    "text": "分清主号副号"
   },
   {
    "id": "f-changes",
    "text": "看哪些聊天有新消息"
   },
   {
    "id": "f-identity",
    "text": "算账号指纹"
   },
   {
    "id": "g-media",
    "text": "附件"
   },
   {
    "id": "f-media-open",
    "text": "打开消息的附件"
   },
   {
    "id": "f-voice",
    "text": "语音转成 WAV"
   },
   {
    "id": "f-emoji-remote",
    "text": "表情从原地址取回"
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
     "text_ref": "全部功能（25项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收●说不准真实数据测过＝9月18日在真实的聊天和朋友圈上从头到尾验收通过"
    },
    {
     "type": "prose",
     "text_ref": "在用＝AI的会话记录、理解库的微信阅读记录或留下的档案能证明真用过；说不准＝功能在，但查了这些记录（Codex会话9月15日起，理解库阅读9"
    },
    {
     "type": "section_heading",
     "text_ref": "读聊天",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1查一段聊天说哪个人或群、哪天或什么关键词，读够回答的一小段，带时间和谁说的在用2找被回的原话引用回复和它回的原消息一起交回，原消息在这段之",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "账号和会话",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "分清主号副号",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "附件",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "10打开消息的附件只打开这条消息自己的图片、表情、文件、视频，交回类型、大小和指纹；微信特有的WXGF图片转成PNG或GIF在用11语音转成",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-08",
    "component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "tag"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（25项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收●说不准真实数据测过＝9月18日在真实的聊天和朋友圈上从头到尾验收通过"
    },
    {
     "type": "prose",
     "text_ref": "在用＝AI的会话记录、理解库的微信阅读记录或留下的档案能证明真用过；说不准＝功能在，但查了这些记录（Codex会话9月15日起，理解库阅读9"
    },
    {
     "type": "section_heading",
     "text_ref": "读聊天",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1查一段聊天说哪个人或群、哪天或什么关键词，读够回答的一小段，带时间和谁说的在用2找被回的原话引用回复和它回的原消息一起交回，原消息在这段之",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "账号和会话",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "分清主号副号",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "附件",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "10打开消息的附件只打开这条消息自己的图片、表情、文件、视频，交回类型、大小和指纹；微信特有的WXGF图片转成PNG或GIF在用11语音转成",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-08",
    "component_order": [
     "status_legend",
     "section_heading",
     "tag",
     "chapter_title",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "● 在用　● 待验收　● 说不准　｜　真实数据测过＝9 月 18 日在真实的聊天和朋友圈上从头到尾验收通过",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "查一段聊天｜说哪个人或群、哪天或什么关键词，读够回答的一小段，带时间和谁说的｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-ee27e64c97037ad87bcf.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "气泡钢笔",
   "source_phrase": "找被回的原话｜引用回复和它回的原消息一起交回，原消息在这段之外就标出来｜在用",
   "sha256": "0885f03d0fd8605a1e8158ed683043f68c0a9f2176cb524056d398071c4424c1",
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
   "source_phrase": "接着往下读｜一段没读完时给出续读位置，下一次接着读，账号、聊天和时间范围不会变｜在用",
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
   "source_phrase": "只看我在大群说过的｜先按发送者筛出我的发言再解码，适合几千条的群；别人的回应再按时间补读｜在用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "长消息分段读｜一条消息太长时先给开头，再按段接着读，整条的指纹能核对；源变了就拒绝拼接｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "看懂特殊消息｜转账、红包、通话、位置、拍一拍、撤回、系统提示按微信自己的结构写清楚｜在用",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "分清主号副号｜每次绑定一个号，同名联系人不跨号串；没说哪个号又两边都有，就列候选｜在用",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "看哪些聊天有新消息｜列出某个时间之后有变化的会话，两个号分开列，不读正文、不截断｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "算账号指纹｜装机配置时，从已有配置算出两个号的 SHA-256 指纹填进去，只输出指纹｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "打开消息的附件｜只打开这条消息自己的图片、表情、文件、视频，交回类型、大小和指纹；微信特有的 WXGF 图片转成 PNG 或 GIF｜在用",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "语音转成 WAV｜原始 SILK 保留，另转一份 WAV，交给中文语音转写｜说不准·真实数据测过",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "表情从原地址取回｜本机没有的表情，按这条消息记着的微信地址取回并核对；可以禁止联网｜说不准",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-63735e387888cdd72a9b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-63735e387888cdd72a9b",
   "title_text": "全部功能（25 项）",
   "sha256": "60d0b674270883c94e01563dd88d7915919dac0f6e295d69d6b8ac8bfcba8b5d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（25 项）

● 在用　● 待验收　● 说不准　｜　真实数据测过＝9 月 18 日在真实的聊天和朋友圈上从头到尾验收通过

在用＝AI 的会话记录、理解库的微信阅读记录或留下的档案能证明真用过；说不准＝功能在，但查了这些记录（Codex 会话 9 月 15 日起，理解库阅读 9 月 8 日起）没找到真用过；待验收＝要等下次更新档案才能确认。

**读聊天**
1. 查一段聊天｜说哪个人或群、哪天或什么关键词，读够回答的一小段，带时间和谁说的｜在用
2. 找被回的原话｜引用回复和它回的原消息一起交回，原消息在这段之外就标出来｜在用
3. 接着往下读｜一段没读完时给出续读位置，下一次接着读，账号、聊天和时间范围不会变｜在用
4. 只看我在大群说过的｜先按发送者筛出我的发言再解码，适合几千条的群；别人的回应再按时间补读｜在用
5. 长消息分段读｜一条消息太长时先给开头，再按段接着读，整条的指纹能核对；源变了就拒绝拼接｜说不准
6. 看懂特殊消息｜转账、红包、通话、位置、拍一拍、撤回、系统提示按微信自己的结构写清楚｜在用

**账号和会话**
7. 分清主号副号｜每次绑定一个号，同名联系人不跨号串；只配了一个号也能用；没说哪个号又两边都有，就列候选｜在用
8. 看哪些聊天有新消息｜列出某个时间之后有变化的会话，两个号分开列，不读正文、不截断｜在用
9. 算账号指纹｜装机配置时，从这个号已有的配置文件算出两份 SHA-256 身份指纹填进去，只输出指纹，不输出账号本身｜在用

**附件**
10. 打开消息的附件｜只打开这条消息自己的图片、表情、文件、视频，交回类型、大小和指纹；微信特有的 WXGF 图片转成 PNG 或 GIF｜在用
11. 语音转成 WAV｜原始 SILK 保留，另转一份 WAV，交给中文语音转写｜说不准·真实数据测过
12. 表情从原地址取回｜本机没有的表情，按这条消息记着的微信地址取回并核对；可以禁止联网｜说不准

::screen{#wechatdirect-09 section="features"}

```typeset
{
 "screen": {
  "id": "wechatdirect-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：接着上一张的同一个网格往下排：没有标题、没有图例，直接从组名开始。画法、卡片、圆点、小标签和上一张完全一样；上下边不画边框，方便和上一张拼接。",
  "portrait": "竖版：图例和说明在最上（这一张没有）；组名一行，卡片一行一张往下排；圆点和小标签位置不变。",
  "links": [],
  "anchors": [
   {
    "id": "g-package",
    "text": "给 AI 和别的项目"
   },
   {
    "id": "f-export-context",
    "text": "阅读包",
    "locator_text": {
     "h": "阅读包|把选定的一段连同附件存成一个文件夹"
    }
   },
   {
    "id": "f-html",
    "text": "网页版查看"
   },
   {
    "id": "g-archive",
    "text": "聊天档案"
   },
   {
    "id": "f-sync-contact",
    "text": "建档和补新的"
   },
   {
    "id": "f-full-reconcile",
    "text": "整份重核"
   },
   {
    "id": "f-repair-media",
    "text": "定点补附件"
   },
   {
    "id": "f-legacy-upgrade",
    "text": "旧档案升级"
   },
   {
    "id": "g-moments",
    "text": "朋友圈"
   },
   {
    "id": "f-moments",
    "text": "看朋友圈"
   },
   {
    "id": "f-sync-moments",
    "text": "存朋友圈快照"
   },
   {
    "id": "g-keep",
    "text": "完整存底和核对"
   },
   {
    "id": "f-preserve",
    "text": "完整存一段聊天"
   },
   {
    "id": "f-verify",
    "text": "核对以前导出的"
   },
   {
    "id": "g-maint",
    "text": "安装和维护"
   },
   {
    "id": "f-doctor",
    "text": "环境体检"
   },
   {
    "id": "f-recover",
    "text": "中断后恢复"
   },
   {
    "id": "f-temp",
    "text": "清理临时解密文件"
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
     "type": "section_heading",
     "text_ref": "给AI和别的项目",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "13阅读包把选定的一段连同附件存成一个文件夹：完整",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "聊天档案",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "15建档和补新的点名一个人或群，第一次存下本机能看",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "朋友圈",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "19看朋友圈读某个号缓存着的朋友圈，看某个人的或我",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "完整存底和核对",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "21完整存一段聊天我明确要求时，把一个时间段的聊天",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "安装和维护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "23环境体检检查Python、语音解码、ffmpe",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row": "fill"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 主工程师收窄中点分隔判定后，功能卡text_ref缩为首25字，避开状态附注的中点；实际节点分配再核对。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-09",
    "component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "tag"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "给AI和别的项目",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "13阅读包把选定的一段连同附件存成一个文件夹：完整",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "聊天档案",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "15建档和补新的点名一个人或群，第一次存下本机能看",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "朋友圈",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "19看朋友圈读某个号缓存着的朋友圈，看某个人的或我",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "完整存底和核对",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "21完整存一段聊天我明确要求时，把一个时间段的聊天",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "安装和维护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "23环境体检检查Python、语音解码、ffmpe",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 主工程师收窄中点分隔判定后，功能卡text_ref缩为首25字，避开状态附注的中点；实际节点分配再核对。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-09",
    "component_order": [
     "status_legend",
     "section_heading",
     "tag",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "阅读包｜把选定的一段连同附件存成一个文件夹：完整消息、附件、给 AI 的摘要，别的项目也能直接读｜说不准·真实数据测过",
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
   "source_phrase": "网页版查看｜阅读包可以顺带生成一页网页，给人看；AI 用不着它｜说不准",
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
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "人物",
   "source_phrase": "建档和补新的｜点名一个人或群，第一次存下本机能看到的全部，以后同一句话只补新的｜在用",
   "sha256": "221ee5da99dd4bcd2d636a62584d34405663986eebdce306093f0944b39360be",
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
   "source_phrase": "整份重核｜重新核对这个人或群在本机能看到的全部历史，补上后来才下载到本机的附件｜说不准·真实数据测过",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "定点补附件｜只补一个档案里缺的附件或 WAV，不重扫聊天、不联网｜说不准·真实数据测过",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "旧档案升级｜旧格式的档案下次更新时，自动按新规则重认一遍每条是谁发的｜待验收·真实数据测过",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "看朋友圈｜读某个号缓存着的朋友圈，看某个人的或我自己的；必须说是哪个号｜说不准·真实数据测过",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "存朋友圈快照｜把这台电脑现在看得到的朋友圈存一份，以后再存只更新变化｜说不准·真实数据测过",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "完整存一段聊天｜我明确要求时，把一个时间段的聊天、附件、编号和指纹存成一个能单独看懂的文件夹｜说不准·真实数据测过",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核对以前导出的｜只读检查档案、朋友圈快照、阅读包、存底包：文件指纹、大小、账号和附件关系对不对得上｜说不准·真实数据测过",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "环境体检｜检查 Python、语音解码、ffmpeg 和配置，可以完全不碰账号配置｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "中断后恢复｜更新档案时被打断，先查看现场，再撤回或完成这次更新｜说不准·真实数据测过",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "清理临时解密文件｜查看或清掉某次任务留下的临时解密文件，只动认得出的那一次｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  }
 ]
}
```

**给 AI 和别的项目**
13. 阅读包｜把选定的一段连同附件存成一个文件夹：完整消息、附件、给 AI 的摘要，别的项目也能直接读｜说不准·真实数据测过
14. 网页版查看｜阅读包可以顺带生成一页网页，给人看；AI 用不着它｜说不准

**聊天档案**
15. 建档和补新的｜点名一个人或群，第一次存下本机能看到的全部，以后同一句话只补新的；没有新消息时原地确认，不重抄整份｜在用
16. 整份重核｜重新核对这个人或群在本机能看到的全部历史，补上后来才下载到本机的附件｜说不准·真实数据测过
17. 定点补附件｜只补一个档案里缺的附件或 WAV，不重扫聊天、不联网；附件要先在微信里重新下载到本机才补得到｜说不准·真实数据测过
18. 旧档案升级｜旧格式的档案下次更新时，自动按新规则重认一遍每条是谁发的；现在 4 份里 1 份已是新规则，3 份等下次更新｜待验收·真实数据测过

**朋友圈**
19. 看朋友圈｜读某个号缓存着的朋友圈，看某个人的或我自己的；必须说是哪个号｜说不准·真实数据测过
20. 存朋友圈快照｜把这台电脑现在看得到的朋友圈存一份，以后再存只更新变化｜说不准·真实数据测过

**完整存底和核对**
21. 完整存一段聊天｜我明确要求时，把一个时间段的聊天、附件、编号和指纹存成一个能单独看懂的文件夹｜说不准·真实数据测过
22. 核对以前导出的｜只读检查档案、朋友圈快照、阅读包、存底包：文件指纹、大小、账号和附件关系对不对得上｜说不准·真实数据测过

**安装和维护**
23. 环境体检｜检查 Python、语音解码、ffmpeg 和配置，可以完全不碰账号配置｜在用
24. 中断后恢复｜更新档案时被打断，先查看现场，再撤回或完成这次更新｜说不准·真实数据测过
25. 清理临时解密文件｜查看或清掉某次任务留下的临时解密文件，只动认得出的那一次｜在用

::screen{#wechatdirect-10 section="history"}

```typeset
{
 "screen": {
  "id": "wechatdirect-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左边约五分之三宽，一条竖向时间线，八个节点，每个节点一个小水彩图标、粗体日期、一两行字。右边一幅大一点的水彩插画：一只小工具箱慢慢长成一个整齐的小档案柜，旁边一台电脑上两个聊天窗口，档案柜抽屉上贴着绿色小标签（不写字）。",
  "portrait": "竖版：时间线一条一条往下排，插画缩小放在最上面。",
  "links": [
   {
    "text": "微信记录交给 AI",
    "href": "/projects/wechat-history-ai-bridge/",
    "locator_text": {
     "v": "微信记录"
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
     "text_ref": "演进",
     "align": "center",
     "size": "large",
     "row": "history-head",
     "width": "78%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "history-head",
     "width": "22%",
     "size": "small",
     "align": "right",
     "target_height": 220
    },
    {
     "type": "timeline",
     "text_ref": "8月24–26日：起步。直接读微信4的本地数据库，取代旧项目微信记录交给AI；第一次把一条微信语音交给转写；加上建档和朋友圈；修好文件传输助",
     "columns": 2,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "width": "100%",
     "text_layout": "inline"
    },
    {
     "type": "timeline",
     "text_ref": "9 月 25–26 日",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      6
     ],
     "width": "100%",
     "text_layout": "inline"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。\n2026-10-06 Astra复核退回：恢复原双栏，仅拆出末节点为整行；前段保持双栏，末图标明确使用本屏原序列的最后一个。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-10",
    "component_order": [
     "chapter_title",
     "timeline",
     "icon",
     "illustration",
     "tag",
     "inline_link"
    ]
   },
   "portrait_required": true
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
     "text_ref": "8月24–26日：起步。直接读微信4的本地数据库，取代旧项目微信记录交给AI；第一次把一条微信语音交给转写；加上建档和朋友圈；修好文件传输助",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "text_layout": "inline"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "wechatdirect-10",
    "component_order": [
     "timeline",
     "illustration",
     "chapter_title",
     "icon",
     "tag",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "8 月 24–26 日：起步。直接读微信 4 的本地数据库，取代旧项目〔微信记录交给 AI〕；第一次把一条微信语音交给转写；加上建档和朋友圈；修好文件传输助手的乱码和贴反的主号副号。",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "8 月 30 日：代码公开到 GitHub。",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "9 月 1 日：导出中途出错能恢复。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "9 月 5–7 日：给 AI 的阅读包，图片语音按原来的位置排在消息旁边；通话、转账、红包、系统提示按原样还原。",
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
   "source_phrase": "9 月 8–9 日：看哪些聊天有新消息；只看我在大群说过的；拍一拍算系统提示，不算我说的话。",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 18 日：长消息分段读、定点补附件、中断后恢复，核对扩到四种导出；在真实聊天上从头到尾验收一遍。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "9 月 25–26 日：按两份审计报告修配置、加密库读取和档案更新的问题；按我的决定删掉 1307 行用不到的代码。",
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
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-wechatdirect",
   "source_phrase": "右边一幅大一点的水彩插画：一只小工具箱慢慢长成一个整齐的小档案柜，旁边一台电脑上两个聊天窗口，档案柜抽屉上贴着绿色小标签（不写字）。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一只小工具箱慢慢长成一个整齐的小档案柜，旁边一台电脑上两个聊天窗口，档案柜抽屉上贴着绿色小标签（不写字"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\wechatdirect\\img\\wechatdirect-10-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "source_box": [
    26,
    0,
    239,
    171
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 演进

- **8 月 24–26 日**：起步。直接读微信 4 的本地数据库，取代旧项目〔微信记录交给 AI〕；第一次把一条微信语音交给转写；加上建档和朋友圈；修好文件传输助手的乱码和贴反的主号副号。
- **8 月 30 日**：代码公开到 GitHub。
- **9 月 1 日**：导出中途出错能恢复。
- **9 月 5–7 日**：给 AI 的阅读包，图片语音按原来的位置排在消息旁边；通话、转账、红包、系统提示按原样还原。
- **9 月 8–9 日**：看哪些聊天有新消息；只看我在大群说过的；拍一拍算系统提示，不算我说的话。
- **9 月 18 日**：长消息分段读、定点补附件、中断后恢复，核对扩到四种导出；在真实聊天上从头到尾验收一遍。
- **9 月 25–26 日**：按两份审计报告修配置、加密库读取和档案更新的问题：只配一个号也能用；档案没变化时原地确认、不再整份重抄；档案被占用时给固定的报错和恢复办法；版本到 0.2.3。按我的决定删掉 1307 行用不到的代码。
- **10 月 2–7 日**：读取改成不挡微信改文件、并核对是不是同一个文件（10 月 2 日）；同时让 RTSS 不再挂微信。10 月 7 日我确认微信莫名退回扫码页的问题恢复，结案；两项一起做，没分开试，原因没有定论。
