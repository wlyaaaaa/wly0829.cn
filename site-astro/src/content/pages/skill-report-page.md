---
{
 "title": "汇报网页",
 "kind": "skill",
 "url": "/skills/report-page/",
 "tagline": "要展开说明的汇报、请我裁定和长回答做成网页，点选就能答复；一两句的回执直接在对话里说。",
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "examples",
   "label": "例子",
   "img": "/_shared/nav-unify-standard/nav-unify-label-22-283ba9f1bc.webp"
  },
  {
   "id": "abilities",
   "label": "能做的事",
   "img": "/_shared/nav-unify-standard/nav-unify-label-58-7dadc2c869.webp"
  },
  {
   "id": "limits",
   "label": "边界",
   "img": "/_shared/nav-unify-standard/nav-unify-label-72-7a7e13ca96.webp"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-report-page",
  "kind": "skill",
  "title": "汇报网页",
  "url": "/skills/report-page/",
  "tagline": "要展开说明的汇报、请我裁定和长回答做成网页，点选就能答复；一两句的回执直接在对话里说。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-08 22:58"
   },
   "facts": [
    "近 7 天 AI 用了 53 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "based_on": {
   "commit": "6dd21f643bef0efb33263afe9e9527bf4362879d",
   "commit_time": "2026-09-28T19:28:54+08:00",
   "file": "E:\\.agents\\skills\\report-page 全部文件；E:\\.agents\\docs\\owner-decisions.md"
  },
  "video_prompt": "5–8 秒循环：白底水彩画面，一台笔记本电脑屏幕上的白底绿边网页从上往下慢慢铺开，一根根绿色柱子依次长高，两张小卡片浮起，一只手指点中其中一张，卡片上的圆点变成绿勾；画面右下角一张便签纸上一行行浅灰短线自己写出来，然后飞进旁边的对话气泡。",
  "registry": {
   "groups": [
    {
     "id": "g-charts",
     "name": "图和文字"
    },
    {
     "id": "g-decide",
     "name": "请我定的卡片"
    },
    {
     "id": "g-media",
     "name": "图片视频录音文档"
    },
    {
     "id": "g-read",
     "name": "好读"
    },
    {
     "id": "g-make",
     "name": "一条命令做完"
    },
    {
     "id": "g-writing",
     "name": "写法"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-content-file",
     "group": "g-make",
     "name": "写内容文件一条命令生成",
     "what": "AI 只写文字和数字，版式配色图表由脚本做",
     "how": "要展开说明的汇报、请我裁定和长回答时 AI 自动做；别的回答合适时也能用；简单回执、短状态不做；也可说“做成网页”",
     "status": "在用",
     "screen": "skill-report-page-06",
     "source": "E:\\.agents\\skills\\report-page\\SKILL.md 怎么做 1–2；使用小记录 129 次运行"
    },
    {
     "id": "f-selfcheck",
     "group": "g-make",
     "name": "生成前自检",
     "what": "结构、卡片、占位、4 种宽度和 1.5 倍字号下的版面、图片查看器都检查，不过关不放进汇报目录",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-06",
     "source": "E:\\.agents\\skills\\report-page\\scripts\\New-ReportPage.ps1 Invoke-PageChecks；ReportPage.psm1 Test-ReportPageHtml、Invoke-ReportBrowserCheck"
    },
    {
     "id": "f-open",
     "group": "g-make",
     "name": "用 Chrome 打开",
     "what": "通过自检后用 Chrome 打开页面；子代理加 -NoOpen 只交链接",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-06",
     "source": "New-ReportPage.ps1 Open-InChrome"
    },
    {
     "id": "f-cleanup",
     "group": "g-make",
     "name": "旧页面进回收站",
     "what": "每次在汇报目录生成新页面，14 天前的页面连附件放进回收站",
     "how": "自动；-KeepDays 0 关闭",
     "status": "没用过",
     "screen": "skill-report-page-06",
     "source": "ReportPage.psm1 Invoke-ReportCleanup；汇报目录最早的页面是 9 月 26 日 03:40，还没有满 14 天的，清理从没真的放进过东西"
    },
    {
     "id": "f-screenshot",
     "group": "g-make",
     "name": "整页截图",
     "what": "按指定宽度存整页截图，给 AI 自己看版面",
     "how": "AI 加 -ScreenshotDir",
     "status": "在用",
     "screen": "skill-report-page-06",
     "source": "ReportPage.psm1 Save-ReportScreenshot；本页截图 9 月 28 日即由此生成；本页 img\\ 下截图 9 月 28 日由它生成"
    },
    {
     "id": "f-integrate",
     "group": "g-make",
     "name": "给其他项目用",
     "what": "其他项目写内容文件即可生成媒体页，可放到指定位置",
     "how": "照接入说明",
     "status": "在用",
     "screen": "skill-report-page-06",
     "source": "E:\\.agents\\skills\\report-page\\references\\media-integration.md；SKILL.md 媒体的来源（personal-media review-page 按本技能生成审批页）；汇报目录里有“手机图片 · 本轮处理结果”“手机图片 · 校准”等页（只看标题）"
    },
    {
     "id": "f-handwrite",
     "group": "g-make",
     "name": "手写整页",
     "what": "特殊版式时复制模板手写整页，再自检打开",
     "how": "AI 用 -Title 复制模板、-OpenPath 自检",
     "status": "说不准",
     "screen": "skill-report-page-06",
     "source": "New-ReportPage.ps1 Create/Open 参数集；使用小记录只记脚本名，分不出用法"
    },
    {
     "id": "f-purpose",
     "group": "g-read",
     "name": "页首用处和结论",
     "what": "第一屏一句看完能解决什么，再先说结论",
     "how": "自动（内容文件 purpose、conclusion）",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "content-format.md 页面；SKILL.md 先安排读者怎么读"
    },
    {
     "id": "f-nav",
     "group": "g-read",
     "name": "本页导航",
     "what": "三节以上自动生成可折叠、吸顶的导航",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "content-format.md navigation；template.html 本页导航"
    },
    {
     "id": "f-prose",
     "group": "g-charts",
     "name": "长文字排版",
     "what": "小标题、要点、编号、引用、重点标记排好的正文",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-report-page-04",
     "source": "content-format.md 长文字"
    },
    {
     "id": "f-zoom",
     "group": "g-read",
     "name": "自动放大和字号",
     "what": "按窗口宽度放大 1.15／1.3／1.75 倍，右上角八档字号全页面通用",
     "how": "自动；点“字号 − / +”",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "template.html 31–35 行、995–1011 行；SKILL.md 第 2 段；决定记录 239 行本人说“半屏横屏时放大失效”，说明在真用"
    },
    {
     "id": "f-mobile",
     "group": "g-read",
     "name": "手机表格变卡片",
     "what": "窄屏时 4 列以内表格变一行一张卡片，更多列表内横滑",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "content-format.md table mobile"
    },
    {
     "id": "f-print",
     "group": "g-read",
     "name": "打印展开",
     "what": "打印时折叠区展开、空说明框不印、不放大",
     "how": "打印页面",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "template.html 527–529 行、页面脚本注释；没有使用记录"
    },
    {
     "id": "f-charts",
     "group": "g-charts",
     "name": "该用哪种图",
     "what": "17 类要说明的内容各对应一种图，一共 32 种组件",
     "how": "AI 按要说明的事挑",
     "status": "在用",
     "screen": "skill-report-page-04",
     "source": "SKILL.md 什么时候用哪种图；AI汇报目录 65 份页面里各组件都出现过（最少的进度条组 1 份）"
    },
    {
     "id": "f-html",
     "group": "g-charts",
     "name": "手写一小段网页",
     "what": "少数特殊版式写一小段 HTML",
     "how": "AI 用 html 组件",
     "status": "说不准",
     "screen": "skill-report-page-04",
     "source": "content-format.md html"
    },
    {
     "id": "f-image-viewer",
     "group": "g-media",
     "name": "图片原始像素查看",
     "what": "点开按原始像素看、拖动、缩放、适应窗口，图集翻页，关闭回原位",
     "how": "点图片",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "80c5fb9；content-format.md 图片放大查看"
    },
    {
     "id": "f-av",
     "group": "g-media",
     "name": "视频和录音",
     "what": "浏览器自带播放条播放",
     "how": "内容里放 video、audio",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "content-format.md；现存页面里未单独统计"
    },
    {
     "id": "f-markdown",
     "group": "g-media",
     "name": "Markdown 渲染",
     "what": "渲染成标题列表表格显示，可复制原文",
     "how": "内容里放 markdown",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "4d90bb8；65 份页面中 20 处 markdown-panel"
    },
    {
     "id": "f-file-card",
     "group": "g-media",
     "name": "文件卡片",
     "what": "显示原路径、复制路径，文本预览，PDF 网页图片音视频可在浏览器里查看",
     "how": "内容里放 file",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "content-format.md 文件卡片按钮与预览"
    },
    {
     "id": "f-folder",
     "group": "g-media",
     "name": "文件夹复制路径",
     "what": "显示“复制路径”按钮，粘到资源管理器地址栏",
     "how": "内容里放 folder 或 [[folder:路径|文字]]",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "9109677；tests\\Test-ReportFolderLinks.ps1"
    },
    {
     "id": "f-private-media",
     "group": "g-media",
     "name": "私人媒体只指向原文件",
     "what": "不复制不内嵌不做缩略图，打不开显示带文件名的占位",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "SKILL.md 媒体的来源；media-integration.md 路径和隐私规则；65 份页面里 4 份有图集（gallery）"
    },
    {
     "id": "f-cards",
     "group": "g-decide",
     "name": "决策卡",
     "what": "带后果的选项、一行小按钮、多选、两列网格，AI 建议和日常影响单独一行",
     "how": "要我定的事 AI 自动做成卡片",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "content-format.md 决策卡片；50 份页面 387 张卡"
    },
    {
     "id": "f-card-media",
     "group": "g-decide",
     "name": "卡里放要看的东西",
     "what": "要看图、视频、文档才能定的，放进那张卡",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "content-format.md media；62eb6ae；汇报目录里“手机图片 · 校准：这几张默认会退，你想留吗”页（只看标题）"
    },
    {
     "id": "f-notes",
     "group": "g-decide",
     "name": "我的说明框",
     "what": "每张卡下面自动加说明框",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "17ba302；template.html 803–810 行；决定记录里本人贴回的答复多处带“我的说明”"
    },
    {
     "id": "f-remember",
     "group": "g-decide",
     "name": "选择记在浏览器",
     "what": "按页面编号记住选择，关掉再开还在",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-report-page-05",
     "source": "template.html 824–832 行 localStorage"
    },
    {
     "id": "f-reply",
     "group": "g-decide",
     "name": "生成我的答复",
     "what": "整页选择变成固定格式的几行字复制到剪贴板，复制失败给文字框",
     "how": "点按钮，粘回对话",
     "status": "在用",
     "screen": "skill-report-page-05",
     "source": "template.html 841–860 行；决定记录多轮贴回答复，例如设计稿第 4 版；决定记录里本人多轮贴回“· 我的答复”"
    },
    {
     "id": "f-reply-handling",
     "group": "g-writing",
     "name": "收到答复怎么办",
     "what": "以说明为准、追问逐条答、看不懂的下一轮讲清",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-07",
     "source": "SKILL.md 收到答复后"
    },
    {
     "id": "f-rules",
     "group": "g-writing",
     "name": "写法规矩",
     "what": "先结论、逐项回答、说人话、AI 建议单列、技术问题自己定",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-07",
     "source": "SKILL.md 文字写法、汇报和裁定的写法"
    },
    {
     "id": "f-subagent",
     "group": "g-writing",
     "name": "子代理不做页面",
     "what": "子代理写成文字交回，要做页面时加 -NoOpen",
     "how": "自动",
     "status": "在用",
     "screen": "skill-report-page-07",
     "source": "1b0eaa5；SKILL.md 第 1 段"
    },
    {
     "id": "f-local-open",
     "group": "g-retired",
     "name": "本机打开按钮",
     "what": "“打开文件夹”“用默认程序打开”“在文件夹中显示”",
     "how": "—",
     "status": "已停用",
     "screen": "skill-report-page-08",
     "source": "4d90bb8、65e4f6a、96424f9 加入和修复（report-open: 协议和 handler\\Program.cs）；73a0c04 退役，删约 1,300 行；决定记录“汇报页本机打开按钮（9 月 27 日 14:5x）”"
    }
   ],
   "numbers": [
    {
     "id": "n-pages",
     "text": "151 份",
     "meaning": "E:\\Documents\\AI汇报 里现存的 .html 汇报页；文件名日期 9 月 26 日 03:40 至 28 日 18:55（北京）；58 个不同标题（同一标题重做的算一个）",
     "as_of": "2026-10-10",
     "source": "E:\\Documents\\AI汇报 列目录计数 *.html，北京时间 10 月 10 日 05:2x；只读文件名；脚本默认把 14 天前的页放进回收站，所以最早一份是 9 月 26 日",
     "screens": [
      "skill-report-page-01"
     ]
    },
    {
     "id": "n-cards",
     "text": "527 张",
     "meaning": "58 个标题各取文件名最新的一份，其中 50 份带决策卡，fieldset.card 共 387 张；不去重是 57 份、509 张",
     "as_of": "2026-10-10",
     "source": "按文件名去掉时间前缀后去重（141 个标题），各取最新一版数 data-q 卡片标记，102 份有卡；10 月 10 日 05:2x",
     "screens": [
      "skill-report-page-01"
     ]
    },
    {
     "id": "n-runs",
     "text": "322 次",
     "meaning": "生成命令 New-ReportPage.ps1 的调用次数：Claude 87（9 月 26 日 03:31–28 日 09:58）、Codex 42（9 月 26 日 17:18–27 日 18:17）；和同屏 65 份（算到 28 日 18:55）时间范围不同，图上写明",
     "as_of": "2026-10-08",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl，name=New-ReportPage.ps1 计数（Claude 228、Codex 94）；9 月 26 日 03:31 到 10 月 8 日 23:01（北京）",
     "screens": [
      "skill-report-page-01"
     ]
    },
    {
     "id": "n-components",
     "text": "32 种组件",
     "meaning": "内容文件组件表里的 type 数",
     "as_of": "2026-09-28",
     "source": "references\\content-format.md 组件表",
     "screens": [
      "skill-report-page-04"
     ]
    },
    {
     "id": "n-gen-time",
     "text": "1 分 46 秒",
     "meaning": "用 example.json 生成一页加 6 次浏览器自检；另一次加存 2 张整页截图为 3 分 54 秒",
     "as_of": "2026-09-28",
     "source": "本次实测两次，北京时间 9 月 28 日 22:2x（带截图）和 22:3x（不带截图，-OutputPath 放在临时目录、-NoOpen）",
     "screens": [
      "skill-report-page-06"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-personal-media",
     "with": "personal-media",
     "direction": "交给",
     "flow": "照片视频录音管理把一批要我定去留的照片视频写成审批内容，用本技能生成审批页；我的答复由它写回",
     "source": "SKILL.md 媒体的来源；references\\media-integration.md"
    },
    {
     "id": "r-explain",
     "with": "explain-to-me",
     "direction": "拿来",
     "flow": "汇报和裁定的写法来自讲给我听技能里的表达教训",
     "source": "SKILL.md 汇报和裁定的写法"
    },
    {
     "id": "r-decisions",
     "with": "agents",
     "direction": "交给",
     "flow": "我贴回的答复由 AI 记进基座的决定原话记录，页面本身不保存决定",
     "source": "SKILL.md 页面放在哪、留多久；E:\\.agents\\docs\\owner-decisions.md"
    },
    {
     "id": "r-recycle",
     "with": "agents",
     "direction": "拿来",
     "flow": "旧页面和临时文件用基座的回收站工具 Move-TaskItemToRecycleBin.ps1 放进回收站",
     "source": "ReportPage.psm1 Move-ReportTemporaryItemToRecycleBin、Invoke-ReportCleanup"
    },
    {
     "id": "r-chrome",
     "with": "Chrome",
     "direction": "拿来",
     "flow": "用本机 Chrome 打开页面；无头 Chrome（没有时用 Edge）做自检和截图",
     "source": "New-ReportPage.ps1 Open-InChrome；ReportPage.psm1 Get-ReportBrowserPath"
    },
    {
     "id": "r-codex",
     "with": "Codex",
     "direction": "双向",
     "flow": "Codex 和 Claude 共用同一份技能源码，两边都生成汇报页",
     "source": "使用小记录 Claude 87 次、Codex 42 次；页面页脚“生成：Codex（GPT-6 Astra）”等"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L26",
     "screen": "skill-report-page-01",
     "text": "约法 L26"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "skill-report-page-09",
     "text": "找照片、视频、录音"
    },
    {
     "target": "/skills/explain-to-me/",
     "screen": "skill-report-page-09",
     "text": "讲给我听"
    },
    {
     "target": "/rules/charter/#L26",
     "screen": "skill-report-page-09",
     "text": "约法 L26"
    },
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "skill-report-page-09",
     "text": "能力与运行方式"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能给 AI 的命令参数（-ContentPath、-Generator、-ScreenshotWidths 等）不上页：读者要知道会发生什么；命令在 SKILL.md。",
    "字段级格式（tone 四种颜色、metrics 的 delta 等）不上页，属于内容文件格式说明。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏八句“怎么跟 AI 说”；第 2 屏四个节点里的“我点……”“我粘回”和答复节选；第 8 屏八句“我说”（按意思转述决定记录原话：owner-decisions.md 355 行“用模版”、144–147 行 Z1、367–371 行子代理做可视化浪费额度、374 行 P7 整体补充里的文件夹链接、391 行按钮鸡肋、489–493 行修不好就不要了、1704 行图片不能放大）。04:25 那条没找到当天原话，只写做了什么（提交 17ba302）；约法 L26 现在写着“每个问题下面留地方让我写说明”。",
    "第 2 屏答复节选里 V1 的说明原文是“LUNA SOL一次画几个审几个你定 不建议一次就画一个横屏+一个竖屏”，页面缩成“Luna、Sol 一次画几张、审几张你定”；整体补充原文较长，缩成“不要过度审计，你把握”。请本人过目。",
    "第 8 屏第一个节点“第一轮产品审查用过一张能点选的网页，AI 把它做成技能”：依据是决定记录 355–356 行（本人说“就是类似于一开始的网页，我可以有选项那种”，AI 理解“像第一轮产品审查那样”）和技能首个提交 a03bed6（北京 9 月 26 日 03:33）；第一轮页面本身不在汇报目录里，没见到原件。",
    "技能说明本身写“页面只存本机，不发布到云端页面（包括 Claude 的 Artifact）”；第 9 屏“这个网站也不是它做的”是我加的半句，免得读者以为网站是汇报页做的。",
    "第 1 屏 65 份、387 张两个数是重启前读 E:\\Documents\\AI汇报 的文件名和卡片标记数出来的（只数不读正文）；重启后资料锁着，没有再读。",
    "功能状态：“在用”都有出处（使用小记录、现存页面的组件标记或标题、决定记录）；“说不准”的 11 项（长文字排版、页首用处和结论、本页导航、手机表格、打印、手写整页、手写一小段网页、选择记在浏览器、图片查看器、视频录音、文件夹复制路径）大多是每页都自动带的功能，但这次没能再从现存页面里数（重启后资料锁着，没再读汇报目录），所以没标“在用”。",
    "演进那一屏按技能页的节归到 abilities（能做的事）的最后一屏，不另开 history 节；原来的 3 个 highlights 编号删了，素材留在 batch2.md 第三节。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-report-page/page.json",
  "sha256": "538dcecf234364b92cd8180d160dcd08a4495edbf347cc354cb2c925608bf8c6",
  "converted_at_beijing": "2026-10-10T08:43:30+08:00"
 }
}
---

::screen{#skill-report-page-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-report-page-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，〔约法 L26〕画成链接）。左半边上“它做什么”两段，下面三张并排的大数字卡（数字大、绿色，下面一行小字说明，卡片底部一行更小的灰字写截至日期）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：八句说法，每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）；卡片下方一段浅绿底小字（不用点名那段）。右上角一幅小插画：一台笔记本电脑屏幕上是白底绿边的网页，网页里画一根绿色柱状图和两张小卡片，卡片上各有一个打钩的圆点；电脑旁边一只手指点着其中一张卡片。",
  "portrait": "竖版：标题和技能名一行；“它做什么”两段；三张数字卡一行一张；插画缩成一行；八个对话气泡一行一个；不用点名那段在最后。",
  "links": [
   {
    "text": "约法 L26",
    "href": "/rules/charter/#L26"
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
     "text_ref": "汇报网页",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 22:58",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 53 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "stat_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "number_style": "stat",
     "text_ref": "151份"
    },
    {
     "type": "prose",
     "text_ref": "技能名report-page·约法L26说的那种白底绿色汇报网页",
     "row": "intro",
     "width": "52%",
     "row_fit_illustration": true
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "它做什么",
     "row": "intro"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "intro",
     "width": "48%"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 2,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "text_ref": "怎么跟AI说"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：要展开说明的汇报"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。三数字来自三个原 group，需数字样式而非普通组标题；八气泡包括原粘回答复括注，正文不添加词。；page-fixer-09（按审页意见）：三个数字组改用stat_card，原字与数字字号保留；八气泡横版两列，收紧两栏高差"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "汇报网页"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 22:58",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 53 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "number_style": "stat",
     "text_ref": "151份"
    },
    {
     "type": "prose",
     "text_ref": "技能名report-page·约法L26说的那种白底绿色汇报网页"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "它做什么"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "text_ref": "怎么跟AI说"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：要展开说明的汇报"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。三数字来自三个原 group，需数字样式而非普通组标题；八气泡包括原粘回答复括注，正文不添加词。；page-fixer-09（按审页意见）：三个数字组改用stat_card，原字与数字字号保留"
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
   "asset": "_library/illustrations/generic-report-page-dashboard.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "generic-report-page-dashboard",
   "source_phrase": "右上角一幅小插画：一台笔记本电脑屏幕上是白底绿边的网页，网页里画一根绿色柱状图和两张小卡片，卡片上各有一个打钩的圆点；电脑旁边一只手指点着其中一张卡片。",
   "sha256": "e6990e5657edbed68189b47d52f3088f639df95e4c2ed45db6698094d967b734",
   "status": "ready",
   "original_elements": [
    "一台笔记本电脑屏幕上是白底绿边的网页，网页里画一根绿色柱状图和两张小卡片，卡片上各有一个打钩的圆点；电脑旁边一只手指点着其中一张卡片"
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
   "asset": "_library/titles/title-d320a7a8e10d363dd8a8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d320a7a8e10d363dd8a8",
   "title_text": "汇报网页",
   "sha256": "99b3b71384343347a96e28d52c4c483776addf5117f4b69203b18e6bcf5613ea",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

汇报网页

技能名 report-page · 〔约法 L26〕说的那种白底绿色汇报网页

**它做什么**
要展开说明的汇报、请我裁定和长回答不在对话框里刷一大段字，AI 把它做成一张本地网页，用 Chrome 打开给我看：先一句“看完能解决什么”和结论，再按我要弄懂或要定的事分节，每节配最合适的图。要我拍板的事做成卡片，我点选、写几句说明，点“生成我的答复”，整页选择变成几行字，粘回对话，AI 照着办。

AI 只写内容文件（文字和数字），版式、配色、图表和检查都交给一条命令；页面只存在我电脑上，不发到网上。

**151 份**
现存的汇报页，都是最近两周生成的（141 个不同标题）
截至 10 月 10 日

**527 张**
141 个标题各取最新一版，其中 102 份带决策卡
截至 10 月 10 日

**322 次**
Claude 228 次、Codex 94 次运行生成命令
9 月 26 日 03:31–10 月 8 日 23:01（使用小记录记到 10 月 8 日）

**怎么跟 AI 说**
“这个说来话长，做成网页给我看。”
“这几件要我定的事做成卡片，我点选。”
“进度画成图，别只写字。”
“这批照片放进页面，我看着决定留哪些。”
“这份提示词渲染好给我看，要能复制原文。”
“上一轮 A3 我没看懂，重做一页讲清楚。”
“这次一两句就行，不用做网页。”
（把页面生成的答复整段粘回对话）

不用点名：要展开说明的汇报、要我裁定，或者回答超过大约一千字，AI 自己就做成网页；别的回答，网页看着更直观、更好看时也可以用。简单的完成回执和短状态直接在对话里说，不专门做网页，也不为了做网页把一句话扩成汇报；我明确要网页时照做。

::screen{#skill-report-page-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-report-page-02",
  "section": "examples",
  "title": "一个完整例子：这个网站的设计稿怎么定下来",
  "scene": "横版画面：左上标题，旁边一枚浅绿小标签（真事那一行）。左边约五分之三宽，画四个编号节点串成一条竖线（每个节点一个小水彩图标：一张写满字的纸变成网页、一只手指点选卡片、一张剪贴板上写着几行字、一个打开的本子写着字），每个节点右边是粗体小标题和一段字。右边约五分之二宽画一张像便签纸的浅绿底竖卡片“我贴回去的答复（节选）”，里面的字用等宽字体逐行写，第一行加粗；卡片下面一行小灰字。左下角一条细长的横幅写“上一轮”那段。",
  "portrait": "竖版：标题和真事标签；四个节点从上到下；“上一轮”横幅；答复便签在最后，字一行不改。",
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
     "text_ref": "一个完整例子：这个网站的设计稿怎么定下来",
     "row": "heading",
     "width": "82%"
    },
    {
     "type": "tag",
     "text_ref": "真事·北京时间9月28日18–19点",
     "row": "heading",
     "width": "18%"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/指向手.png",
      "_library/icons/文件写作.png",
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "group_nodes_as_steps": true,
     "text_ref": "1.AI把设计稿做成网页",
     "row": "example",
     "width": "60%"
    },
    {
     "type": "notice",
     "text_ref": "上一轮第3版25张卡，我在8张上选了“要改”并写了说明；AI照改出第4版，复核一轮。",
     "row": "example"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "font_role": "monospace",
     "text_ref": "我贴回去的答复（节选）",
     "row": "example",
     "width": "40%"
    },
    {
     "type": "prose",
     "text_ref": "答复格式是固定的：第一行标题，每题一行，最后整体补充。",
     "row": "example"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。四步是 group+para，节点线须保留原四步配属；答复便签等宽、最后格式说明在卡外。；page-fixer-09（按审页意见）：四步各用明确图标"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子：这个网站的设计稿怎么定下来"
    },
    {
     "type": "tag",
     "text_ref": "真事·北京时间9月28日18–19点"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/指向手.png",
      "_library/icons/文件写作.png",
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "group_nodes_as_steps": true,
     "text_ref": "1.AI把设计稿做成网页"
    },
    {
     "type": "notice",
     "text_ref": "上一轮第3版25张卡，我在8张上选了“要改”并写了说明；AI照改出第4版，复核一轮。"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "font_role": "monospace",
     "text_ref": "我贴回去的答复（节选）"
    },
    {
     "type": "prose",
     "text_ref": "答复格式是固定的：第一行标题，每题一行，最后整体补充。"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。四步是 group+para，节点线须保留原四步配属；答复便签等宽、最后格式说明在卡外。；page-fixer-09（按审页意见）：四步各用明确图标"
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
   "source_phrase": "一张写满字的纸变成网页",
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
   "asset": "_library/icons/指向手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "指向手",
   "source_phrase": "一只手指点选卡片",
   "sha256": "b91d58864458ae828bac8c417ce629dc5c21bbafc9cb56094265107503bfe26c",
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
   "source_phrase": "一张剪贴板上写着几行字",
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
   "source_phrase": "一个打开的本子写着字",
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
   "asset": "_library/titles/title-cad79fffe8ffc762fedc.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cad79fffe8ffc762fedc",
   "title_text": "一个完整例子：这个网站的设计稿怎么定下来",
   "sha256": "1ef57ebf272630497cd729a09fb89e3d0dbbc6bc3500cf41250e0e17c8458eff",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一个完整例子：这个网站的设计稿怎么定下来

真事 · 北京时间 9 月 28 日 18–19 点

**1. AI 把设计稿做成网页**
Claude 把网站设计稿第 4 版写成一份内容文件：页首一句“这页对你有什么用”和先说结论，正文按要定的事分节，每件事一张卡片，编号 V1 到 V21。一条命令生成、自检，在 Chrome 打开。

**2. 我逐张点选**
每张卡写着现在是什么样、为什么要定、选了会怎样，AI 自己的倾向单独标“AI 建议”。我点“同意”或“要改”，想法不在选项里的，写进卡片下面的“我的说明”框。

**3. 一键生成答复**
点“生成我的答复”，整页选择变成几行字复制好，我粘回对话；这一轮分两次贴回。选到一半关掉页面也不丢，浏览器记着。

**4. AI 照答复办**
有说明的以说明为准；V19 我直接选了标着“AI 建议”的 A。AI 把答复记进我的决定记录，然后开工第 1 批，就是现在这些页。

**上一轮**　第 3 版 25 张卡，我在 8 张上选了“要改”并写了说明；AI 照改出第 4 版，复核一轮。

**我贴回去的答复（节选）**
名称说明：这里 Luna 指 GPT-6 Luna，Sol 指当时的 GPT-6 Sol。
个人网站 · 最终设计稿第 4 版（逐项审） · 我的答复
V1 分批和范围：同意；我的说明：Luna、Sol 一次画几张、审几张你定
V16 按需更新（取消每周复核）：同意
V19 “待实施”状态：A 保留这个状态（AI 建议）
V21 第 1 批就给第 2 批留锚点：内容和页面都留：同意
整体补充：不要过度审计，你把握

答复格式是固定的：第一行标题，每题一行，最后整体补充。

::screen{#skill-report-page-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-report-page-03",
  "section": "examples",
  "title": "页面长什么样",
  "scene": "横版画面：左上标题。中间偏左放一张截图（宽约屏幕一半、高约屏幕四分之三，带细绿边框的空位，放页首截图），截图左边伸出四条细绿引线，各连一个小圆编号 1–4 和旁边一段短字；右边约三分之一宽放第二张截图（带细边框的竖长空位，高约屏幕五分之四，放决策卡截图），右侧伸出四条引线，编号 5–8。两张截图下面各一行灰色小字说明。",
  "portrait": "竖版分3张，每张使用原生9:16画布，仅按各张范围画；截图保留真实宽高比，不压扁、不用缩窄截图给正文让位。第1张（skill-report-page-03-v.png）：仅原文标题“页面长什么样”、页首截图、编号1–4及页首截图图注。页首空框按1280:935，示例可用宽880、高约643源像素；图注紧跟截图，编号1–4在下方逐条整宽排。第2张（skill-report-page-03-v2.png）：仅决策卡截图和其原图注，不重复大标题、编号或页首图注。决策卡空框按1280:2055，示例宽880、高约1413源像素，接近满宽；图注紧跟截图，给原图注和正常边距留足空间。第3张（skill-report-page-03-v3.png）：仅原文编号5–8及其完整解释，整宽上下排；不再画截图、截图图注或新标题。数字示例只证明可行空间，不是本人冻结的精确像素；不得增删改写原文字，不用新空卡、新实时框或装饰填满画布。只有连续外部空白交给现役crop_box裁边，保留源分辨率和原始全宽。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/c6f816fe118db865d676f152851de608e3c8c3550b0ced08e99315d7c34d50e1.png",
    "where": "左边大空位",
    "caption": "演示页截图（页首）：用技能自带的演示内容在 1280 像素宽生成，9 月 28 日",
    "frame_bindings": {
     "v": {
      "A19761532EB731414E8AE17C99F14601C4B5F4B704B9F3639C1433683F52A308": [
       33,
       248,
       907,
       912
      ],
      "EAA8C6DDF6938DAB0C1A87C2E8478D07D535DFC49D33E1B8E8E368ED02C093DC": [
       33,
       221,
       907,
       885
      ]
     }
    }
   },
   {
    "file": "sources/assets/_references/b3c38dd68e427c123208f5415194a5ead7ff24a06553f16da4e89104848daa47.png",
    "where": "右边竖长空位",
    "caption": "演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区",
    "frame_bindings": {
     "v": {
      "DB19B5C200BA51BF86B67D7AC3199153E65403515B4526D6BA0762F2C55F88CD": [
       81,
       96,
       860,
       1308
      ],
      "EAA8C6DDF6938DAB0C1A87C2E8478D07D535DFC49D33E1B8E8E368ED02C093DC": [
       81,
       2060,
       860,
       3272
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
     "align": "center",
     "size": "large",
     "text_ref": "页面长什么样"
    },
    {
     "type": "annotation",
     "screenshot": 0,
     "aspect_ratio": 1.3689839572192513,
     "media_width": 66,
     "anchors": [
      {
       "x": 0.5,
       "y": 0.053,
       "unit": 0
      },
      {
       "x": 0.5,
       "y": 0.24,
       "unit": 1
      },
      {
       "x": 0.18,
       "y": 0.351,
       "unit": 2
      },
      {
       "x": 0.188,
       "y": 0.725,
       "unit": 3
      }
     ],
     "leader_style": "solid",
     "text_ref": "1页眉：标签（请你裁定、AI汇报、AI回答）、北京时间、“本地文件，不对外发布”，右上角“字号−"
    },
    {
     "type": "prose",
     "text_ref": "演示页截图（页首）：用技能自带的演示内容在1280像素宽生成，9月28日"
    },
    {
     "type": "annotation",
     "screenshot": 1,
     "aspect_ratio": 0.6228710462287105,
     "media_width": 66,
     "anchors": [
      {
       "x": 0.5,
       "y": 0.029,
       "unit": 0
      },
      {
       "x": 0.277,
       "y": 0.175,
       "unit": 1
      },
      {
       "x": 0.5,
       "y": 0.3477,
       "unit": 2
      },
      {
       "x": 0.229,
       "y": 0.877,
       "unit": 3
      }
     ],
     "leader_style": "solid",
     "text_ref": "5卡片：编号和问题，下面是这件事的来龙去脉"
    },
    {
     "type": "prose",
     "text_ref": "演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原竖版明确三张及各张范围；必须消费显式分张，不能按总高度自动切。横版引线锚点待真实截图裁切。；page-fixer-09：引线锚点来自指定压小真实rp-top/rp-cards源图长拼；坐标按完整外框归一，卡片点对应实见Y2，AI建议标记未见不作证，非测试锚点。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "页面长什么样"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "1280:935",
     "page_break_after": false
    },
    {
     "type": "prose",
     "text_ref": "演示页截图（页首）：用技能自带的演示内容在1280像素宽生成，9月28日"
    },
    {
     "type": "prose",
     "page_break_after": true,
     "text_ref": "1页眉：标签（请你裁定、AI汇报、AI回答）、北京时间、“本地文件，不对外发布”，右上角“字号−"
    },
    {
     "type": "screenshot",
     "indices": [
      1
     ],
     "ratio": "1280:2055"
    },
    {
     "type": "prose",
     "page_break_after": false,
     "text_ref": "演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区"
    },
    {
     "type": "prose",
     "text_ref": "5卡片：编号和问题，下面是这件事的来龙去脉"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原竖版明确三张及各张范围；必须消费显式分张，不能按总高度自动切。横版引线锚点待真实截图裁切。",
   "portrait_parts": [
    {
     "part": 1,
     "node_indices": [
      0,
      9,
      1,
      2,
      3,
      4
     ],
     "screenshot_indices": [
      0
     ]
    },
    {
     "part": 2,
     "node_indices": [
      10
     ],
     "screenshot_indices": [
      1
     ]
    },
    {
     "part": 3,
     "node_indices": [
      5,
      6,
      7,
      8
     ],
     "screenshot_indices": []
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
   "asset": "_library/titles/title-02d56f0b3157e18ad998.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-02d56f0b3157e18ad998",
   "title_text": "页面长什么样",
   "sha256": "b663447f27304ccc211094e351de220ed2ce285c2846f7059a37ecc2e54e4a9b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

页面长什么样

1 页眉：标签（请你裁定、AI 汇报、AI 回答）、北京时间、“本地文件，不对外发布”，右上角“字号 − / +”
2 标题下一句：看完能解决什么
3 “先说结论”：先给判断，再说要我做什么
4 本页导航：三节以上自动出现，点节名就跳过去

5 卡片：编号和问题，下面是这件事的来龙去脉
6 选项：每个都是确定的做法，写清选了会怎样；“AI 建议”单独一行
7 每张卡下面一个“我的说明”框
8 页尾“把选择发回给 AI”：整体补充和“生成我的答复”按钮

演示页截图（页首）：用技能自带的演示内容在 1280 像素宽生成，9 月 28 日
演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区

::screen{#skill-report-page-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-report-page-04",
  "section": "abilities",
  "title": "能做的事：该用哪种图",
  "scene": "横版画面：左上标题，下面一句粗体字。左边约五分之三宽一张两列表格“要说的内容 → 用哪种”，十七行，每行右列前面一个很小的水彩图标（照着那种图画：几个大数字、一根横条、几根柱子、一条折线、一个圆环、一根分段的条、一条进度条、一排格子、一条时间线、编号台阶、左右两个框、一张表、彩色小方块、带箭头的方框、树杈、带标签的清单、一个折叠箭头、一张照片）。表格下面三行功能，每行粗体名字后面括号里的状态词前画一个状态圆点（在用＝绿圆点，说不准＝浅灰圆点）；最下面一行小字图例，四种标记照画（绿圆点、灰圆点、浅灰圆点、叉）。右边约五分之二宽放一张竖长截图（带细边框的空位，高约屏幕五分之四），下面一行灰色小字。",
  "portrait": "竖版保留已正确04-v原范围/文件/SHA，不重画。仅将原04-v2内容分为v2/v3，默认v/v2/v3顺序。第2张04-v2仅原三条功能说明及原状态图例整宽排，缩图标，不画截图/图注或新标题。新增第3张04-v3仅真实演示页截图空框和原图注，框内部全白，真实比例1280:2100；参考860×1411源像素，图注在其下正常两行，不重复功能、状态、标题或新增字。正文36源像素/行48只作可行参考，以370正常可读为准；原图截图由现役编译完整贴入，不压扁，连续外白裁边。整屏原text、横scene及其它screens完全保持。",
  "links": [],
  "anchors": [
   {
    "id": "g-charts",
    "text": "该用哪种图"
   },
   {
    "id": "f-charts",
    "text": "该用哪种图"
   },
   {
    "id": "f-prose",
    "text": "长文字排版"
   },
   {
    "id": "f-html",
    "text": "手写一小段网页"
   }
  ],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/d40e5cb08bcead69457cabaf7c00f348bc927eaa465ef8b587b57c71eee18418.png",
    "where": "右边竖长空位",
    "caption": "演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据",
    "frame_bindings": {
     "v": {
      "014FCFF5110B492A0010837D20B637FC75DD526FA80DBAC46266303D40044613": [
       47,
       2835,
       894,
       4224
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
     "align": "center",
     "size": "large",
     "text_ref": "能做的事：该用哪种图"
    },
    {
     "type": "prose",
     "text_ref": "原则：怎么便于我理解就怎么画。先想清这一段要让我明白什么，再挑最好懂的一种；帮不上理解的图不加。"
    },
    {
     "type": "table",
     "row_icons": "auto",
     "text_ref": "要说的内容用哪种两三个关键数字大数字卡几样东西比多少横条，或柱状图（可几组并排）随时间涨跌折线图",
     "row": "charts",
     "width": "60%"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "icons": "none",
     "text_ref": "该用哪种图：照上表挑，一共32种组件（在用）长文字排版：小标题、要点、编号、引用、重点标记排好的",
     "row": "charts"
    },
    {
     "type": "prose",
     "text_ref": "状态：绿圆点＝在用（记录或现存页面里用过）灰圆点＝没用过（会留下痕迹的，一次也没找到）浅灰圆点＝",
     "row": "charts"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "1280:2100",
     "row": "charts",
     "width": "40%"
    },
    {
     "type": "prose",
     "text_ref": "演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据",
     "row": "charts"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。竖版保留表格原范围，功能/图例独立一张，截图/图注独立一张；不重复标题。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事：该用哪种图"
    },
    {
     "type": "prose",
     "text_ref": "原则：怎么便于我理解就怎么画。先想清这一段要让我明白什么，再挑最好懂的一种；帮不上理解的图不加。"
    },
    {
     "type": "table",
     "row_icons": "auto",
     "text_ref": "要说的内容用哪种两三个关键数字大数字卡几样东西比多少横条，或柱状图（可几组并排）随时间涨跌折线图"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "icons": "none",
     "text_ref": "该用哪种图：照上表挑，一共32种组件（在用）长文字排版：小标题、要点、编号、引用、重点标记排好的"
    },
    {
     "type": "prose",
     "text_ref": "状态：绿圆点＝在用（记录或现存页面里用过）灰圆点＝没用过（会留下痕迹的，一次也没找到）浅灰圆点＝"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "1280:2100"
    },
    {
     "type": "prose",
     "text_ref": "演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。竖版保留表格原范围，功能/图例独立一张，截图/图注独立一张；不重复标题。",
   "portrait_parts": [
    {
     "part": 1,
     "node_indices": [
      0,
      1,
      2
     ]
    },
    {
     "part": 2,
     "node_indices": [
      3,
      4
     ]
    },
    {
     "part": 3,
     "node_indices": [
      5
     ],
     "screenshot_indices": [
      0
     ]
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "照着那种图画：几个大数字",
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
   "source_phrase": "一根横条",
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
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "柱状图",
   "source_phrase": "几根柱子",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/趋势图.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "趋势图",
   "source_phrase": "一条折线",
   "sha256": "93f561327ed7d183c4ffc3ca973b78e9ec9cc8de258aa4facce704e52f997d5a",
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
   "source_phrase": "一个圆环",
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
   "source_phrase": "一根分段的条",
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
   "source_phrase": "一条进度条",
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
   "source_phrase": "一排格子",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "一条时间线",
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
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "编号台阶",
   "sha256": "7c96e3300b57acb3d30c526bdbbb5c5ed24e0ed8621d6f7a3a64960eaa97537d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "左右两个框",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "一张表",
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
   "source_phrase": "彩色小方块",
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
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "带箭头的方框",
   "sha256": "4c8b24f4690ddc583ca222e8084661258efa002ca92ca8c824c85bda3e179954",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "树杈",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "带标签的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个折叠箭头",
   "sha256": "4c8b24f4690ddc583ca222e8084661258efa002ca92ca8c824c85bda3e179954",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-87028220e41029f4bc43.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-87028220e41029f4bc43",
   "title_text": "能做的事：该用哪种图",
   "sha256": "f8a0a108a93bfcced568185766bcf6a0af17b62a09ee1e30080f7a1d0caedaf6",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：该用哪种图

**原则：怎么便于我理解就怎么画。**先想清这一段要让我明白什么，再挑最好懂的一种；帮不上理解的图不加。每张图前一句话说它说明了什么，数字写来源，粗估写明粗估。

| 要说的内容 | 用哪种 |
|---|---|
| 两三个关键数字 | 大数字卡 |
| 几样东西比多少 | 横条，或柱状图（可几组并排） |
| 随时间涨跌 | 折线图 |
| 一个整体分成几块 | 占比环，块多时用堆叠条 |
| 离目标还差多少 | 进度条组 |
| 长任务到哪一步 | 进度格 |
| 按时间发生了什么 | 时间线（北京时间） |
| 要我照着做 | 步骤，我亲手做的标“要你动手” |
| 改前和改后 | 左右对照 |
| 几个做法按几条标准比 | 对照表，推荐的一列整列浅绿 |
| 很多东西各自的状态 | 绿黄红灰的状态格子 |
| 东西怎么流转 | 方框加箭头 |
| 谁包含谁 | 树状层级，最多 6 层 |
| 逐项问题 | 带颜色标签的清单 |
| 证据、命令输出 | 折叠起来，点开才看 |
| 一个结论 | 一句大字 |
| 图片、视频、录音、文档、文件夹 | 直接放进页面 |

- **该用哪种图**：照上表挑，一共 32 种组件（在用）
- **长文字排版**：小标题、要点、编号、引用、重点标记排好的正文（说不准）
- **手写一小段网页**：少数特殊版式才用（说不准）

状态：绿圆点＝在用（记录或现存页面里用过）　灰圆点＝没用过（会留下痕迹的，一次也没找到）　浅灰圆点＝说不准（用了不留痕，这次也没数到）　叉＝已停用

演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据

::screen{#skill-report-page-05 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-report-page-05",
  "section": "abilities",
  "title": "能做的事：卡片、媒体、好读",
  "scene": "横版画面：左上标题。三张并排的竖卡片，各有一个小水彩图标在左上角（一张带勾选圆点的卡片、一张照片叠一段胶片和一个小喇叭、一台手机和一个放大镜），卡片标题粗体，下面每条功能一行：粗体功能名、冒号后一句话，行尾括号里的状态词前画一个状态圆点（在用＝绿圆点，说不准＝浅灰圆点）。三张卡片底部对齐。",
  "portrait": "竖版：三张卡片一行一张，从上到下。",
  "links": [],
  "anchors": [
   {
    "id": "g-decide",
    "text": "请我定的卡片"
   },
   {
    "id": "f-cards",
    "text": "决策卡"
   },
   {
    "id": "f-card-media",
    "text": "卡里放要看的东西"
   },
   {
    "id": "f-notes",
    "text": "我的说明框"
   },
   {
    "id": "f-remember",
    "text": "选择记在浏览器"
   },
   {
    "id": "f-reply",
    "text": "生成我的答复"
   },
   {
    "id": "g-media",
    "text": "图片、视频、录音、文档"
   },
   {
    "id": "f-image-viewer",
    "text": "图片原始像素查看"
   },
   {
    "id": "f-av",
    "text": "视频和录音"
   },
   {
    "id": "f-markdown",
    "text": "Markdown 渲染"
   },
   {
    "id": "f-file-card",
    "text": "文件卡片"
   },
   {
    "id": "f-folder",
    "text": "文件夹复制路径"
   },
   {
    "id": "f-private-media",
    "text": "私人媒体只指向原文件"
   },
   {
    "id": "g-read",
    "text": "好读：页首、大屏、手机、打印"
   },
   {
    "id": "f-purpose",
    "text": "页首用处和结论"
   },
   {
    "id": "f-nav",
    "text": "本页导航"
   },
   {
    "id": "f-zoom",
    "text": "自动放大和字号"
   },
   {
    "id": "f-mobile",
    "text": "手机表格变卡片"
   },
   {
    "id": "f-print",
    "text": "打印展开"
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
     "text_ref": "能做的事：卡片、媒体、好读"
    },
    {
     "type": "points_card",
     "columns": 3,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "请我定的卡片",
     "header_icon": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。三完整分组大卡，底部等高；原状态词前无字圆点。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事：卡片、媒体、好读"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "请我定的卡片",
     "header_icon": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。三完整分组大卡，底部等高；原状态词前无字圆点。"
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
   "source_phrase": "决策卡：选项带后果，也可以是一行小按钮、多选、同类小问题排两列；“AI 建议”和“对你日常意味着什么”各单独一行（在用）",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "图片、视频、录音、文档\n图片原始像素查看：可拖动、双指缩放，或“适应窗口”看全图；关掉回到原来读到的位置；图集能上一张、下一张（说不准）视频和录音：浏览器自带的播放条（说不准）Markdown渲染：渲染成标题、列表、表格再给我看，“复制原文”拿到原稿（在用）文件卡片：显示原路径和“复制路径”，文本能预览；PDF、网页、图片和音视频能“在浏览器里查看”（在用）文件夹复制路径：粘到资源管理器地址栏就到（说不准）私人媒体只指向原文件：不复制、不做缩略图；资料锁着或文件搬走了，那一格显示带文件名的“看不到”（在用）",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机",
   "source_phrase": "好读：页首、大屏、手机、打印\n页首用处和结论：第一屏一句看完能解决什么，再先说结论（说不准）本页导航：三节以上自动出现，点节名就跳过去（说不准）自动放大和字号：半屏960像素宽放大1.15倍，1280像素1.3倍，大窗口最多1.75倍，手机和打印不放大；右上角“字号−/+”八档，调一次所有页面都记住（在用）手机表格变卡片：多列表格变成一行一张卡片，列太多就表内横滑（说不准）打印展开：折叠的证据自动展开，没写的说明框不印（说不准）",
   "sha256": "2d2811a87008b221e7dec14f189f43393989e1b15a5b682824c03cbe742b7fec",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e174bbe0abebc651e69a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e174bbe0abebc651e69a",
   "title_text": "能做的事：卡片、媒体、好读",
   "sha256": "0a4a01deaa01c6601c1b5cafa7884b5e9a4cee589ac0746d3e26b043e67bfa79",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：卡片、媒体、好读

**请我定的卡片**
- **决策卡**：选项带后果，也可以是一行小按钮、多选、同类小问题排两列；“AI 建议”和“对你日常意味着什么”各单独一行（在用）
- **卡里放要看的东西**：要看着图、视频、文档、文件夹才能定的，直接放进这张卡（在用）
- **我的说明框**：每张卡下面自动加一个（在用）
- **选择记在浏览器**：选到一半关掉也不丢（说不准）
- **生成我的答复**：整页选择变成固定格式的几行字复制好；复制不了就弹出文字让我手动复制（在用）

**图片、视频、录音、文档**
- **图片原始像素查看**：可拖动、双指缩放，或“适应窗口”看全图；关掉回到原来读到的位置；图集能上一张、下一张（说不准）
- **视频和录音**：浏览器自带的播放条（说不准）
- **Markdown 渲染**：渲染成标题、列表、表格再给我看，“复制原文”拿到原稿（在用）
- **文件卡片**：显示原路径和“复制路径”，文本能预览；PDF、网页、图片和音视频能“在浏览器里查看”（在用）
- **文件夹复制路径**：粘到资源管理器地址栏就到（说不准）
- **私人媒体只指向原文件**：不复制、不做缩略图；资料锁着或文件搬走了，那一格显示带文件名的“看不到”（在用）

**好读：页首、大屏、手机、打印**
- **页首用处和结论**：第一屏一句看完能解决什么，再先说结论（说不准）
- **本页导航**：三节以上自动出现，点节名就跳过去（说不准）
- **自动放大和字号**：半屏 960 像素宽放大 1.15 倍，1280 像素 1.3 倍，大窗口最多 1.75 倍，手机和打印不放大；右上角“字号 − / +”八档，调一次所有页面都记住（在用）
- **手机表格变卡片**：多列表格变成一行一张卡片，列太多就表内横滑（说不准）
- **打印展开**：折叠的证据自动展开，没写的说明框不印（说不准）

::screen{#skill-report-page-06 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-report-page-06",
  "section": "abilities",
  "title": "能做的事：一条命令做完",
  "scene": "横版画面：左上标题。上半部分一条从左到右的流程图：五个圆角方框用绿色箭头连起来，每个方框上方一个小水彩图标（一张纸和一支笔、一个齿轮、一台手机和一台显示器并排、一个放大镜照着网页、一个回收站），方框里写粗体名字；箭头上的光点。流程图下左边约五分之三宽一张卡片列七条功能：粗体功能名、冒号后一句话，行尾括号里的状态词前画一个状态圆点（在用＝绿圆点，没用过＝灰圆点，说不准＝浅灰圆点）；右边约五分之二宽一张卡片“自检拦下这些”。最下面一行灰色小字写实测。",
  "portrait": "竖版：流程图改成从上到下五个方框；七条功能一行一条；“自检拦下这些”卡片；实测一行在最后。",
  "links": [],
  "anchors": [
   {
    "id": "g-make",
    "text": "一条命令做完"
   },
   {
    "id": "f-content-file",
    "text": "写内容文件一条命令生成"
   },
   {
    "id": "f-selfcheck",
    "text": "生成前自检"
   },
   {
    "id": "f-open",
    "text": "用 Chrome 打开"
   },
   {
    "id": "f-cleanup",
    "text": "旧页面进回收站"
   },
   {
    "id": "f-screenshot",
    "text": "整页截图"
   },
   {
    "id": "f-integrate",
    "text": "给其他项目用"
   },
   {
    "id": "f-handwrite",
    "text": "手写整页"
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
     "text_ref": "能做的事：一条命令做完"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/齿轮.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/纸箱.png"
     ],
     "split_inline_arrows": true,
     "text_ref": "写内容文件→生成→自检→打开→清理"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "icons": "none",
     "text_ref": "写内容文件一条命令生成：AI只写文字和数字，转义、版式、配色、画图都由命令做（在用）生成前自检：",
     "row": "checks",
     "width": "60%",
     "motion_text": [
      {
       "kind": "status-dot",
       "text": "在用",
       "within": "画图都由命令做（在用）"
      },
      {
       "kind": "status-dot",
       "text": "在用",
       "within": "E:\\Documents\\AI汇报（在用）"
      }
     ]
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "自检拦下这些",
     "row": "checks",
     "width": "40%"
    },
    {
     "type": "prose",
     "text_ref": "实测（9月28日）：演示页生成加6次浏览器自检1分46秒；再存2张整页截图，共3分54秒"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原箭头组名拆为五个流程节点，无新增文字；七功能仍一条一行。；page-fixer-09（按审页意见）：生成/自检/打开/清理图标分别映射"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事：一条命令做完"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/齿轮.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/纸箱.png"
     ],
     "split_inline_arrows": true,
     "text_ref": "写内容文件→生成→自检→打开→清理"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "icons": "none",
     "text_ref": "写内容文件一条命令生成：AI只写文字和数字，转义、版式、配色、画图都由命令做（在用）生成前自检：",
     "motion_text": [
      {
       "kind": "status-dot",
       "text": "在用",
       "within": "画图都由命令做（在用）"
      },
      {
       "kind": "status-dot",
       "text": "在用",
       "within": "E:\\Documents\\AI汇报（在用）"
      }
     ]
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "自检拦下这些"
    },
    {
     "type": "prose",
     "text_ref": "实测（9月28日）：演示页生成加6次浏览器自检1分46秒；再存2张整页截图，共3分54秒"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原箭头组名拆为五个流程节点，无新增文字；七功能仍一条一行。；page-fixer-09（按审页意见）：生成/自检/打开/清理图标分别映射"
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
   "source_phrase": "一张纸和一支笔",
   "sha256": "78fcd9b3010d8edec8e13e231dfa01eb6e1bf1de47e99caa67705f10f6b47ec8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "→ **生成**",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
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
   "source_phrase": "→ **自检**",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "→ **打开**",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "→ **清理**",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-5e7019c4b23cc0561f13.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5e7019c4b23cc0561f13",
   "title_text": "能做的事：一条命令做完",
   "sha256": "5744726c8054597da8111c1b58cc62015f21969439c6ae94ec789817801abe52",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：一条命令做完

**写内容文件** → **生成** → **自检** → **打开** → **清理**

- **写内容文件一条命令生成**：AI 只写文字和数字，转义、版式、配色、画图都由命令做（在用）
- **生成前自检**：先放在临时位置，用 Chrome 真正打开检查，不过关就不放进 E:\Documents\AI汇报（在用）
- **用 Chrome 打开**：通过了才按北京时间命名放进汇报目录，用 Chrome 打开；子代理不打开，只交链接（在用）
- **旧页面进回收站**：下次生成新页面时，顺带把 14 天前的旧页面连附件放进回收站，能还原（没用过：技能 9 月 26 日才建，还没有满 14 天的页面）
- **整页截图**：按几种宽度存整页截图，给 AI 自己看版面；这一页的截图就是这样来的（在用）
- **给其他项目用**：照片视频录音管理的批量审批页就是用它生成的，答复再交回那个项目写回；别的项目照接入说明写内容文件，也可以放到指定位置、不自动打开（在用）
- **手写整页**：特殊版式时复制模板手写，再自检打开（说不准）

**自检拦下这些**
- 内容文件写错：不认识的字段、类型不对、缺必填项，逐条用中文列出
- 卡片数和“我的说明”框数对不上，卡片编号重复，卡片跑到答复区外
- 模板占位没替换、标签没配对、注释没关、元素编号重复、页面脚本没跑完
- 在 390、960、1280、1920 像素宽各开一次，半屏两档再按 1.5 倍字号各开一次：横向溢出、进度格重叠、进度条比例不对都算不过
- 实际点开代表图片，查原始像素、长图滚动、关闭后回到原位
- 找不到浏览器时不报“自检通过”

实测（9 月 28 日）：演示页生成加 6 次浏览器自检 1 分 46 秒；再存 2 张整页截图，共 3 分 54 秒

::screen{#skill-report-page-07 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-report-page-07",
  "section": "abilities",
  "title": "AI 写这种页的规矩",
  "scene": "横版画面：左上标题。上面一张横跨整屏的大卡片“写法规矩”，里面左右两栏：左栏“怎么写”八条短句，右栏“请我拍板时”五条短句，每条前一个小水彩图标；标题后括号里的状态词前画一个绿圆点。卡片下面两条浅绿横幅并排：左边“收到答复怎么办”，右边“子代理不做页面”（左端一个小图标：一个大圆点牵着两个小圆点），状态词前各一个绿圆点。",
  "portrait": "竖版：“写法规矩”卡片里两栏改成上下；两条横幅一行一条。",
  "links": [],
  "anchors": [
   {
    "id": "g-writing",
    "text": "AI 写这种页的规矩"
   },
   {
    "id": "f-rules",
    "text": "写法规矩"
   },
   {
    "id": "f-reply-handling",
    "text": "收到答复怎么办"
   },
   {
    "id": "f-subagent",
    "text": "子代理不做页面"
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
     "text_ref": "AI写这种页的规矩"
    },
    {
     "type": "section_heading",
     "text_ref": "写法规矩（在用）"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "text_ref": "怎么写：",
     "row": "writing",
     "width": "55%"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "text_ref": "请我拍板时：",
     "row": "writing",
     "width": "45%"
    },
    {
     "type": "notice",
     "text_ref": "收到答复怎么办（在用）有说明的以说明为准，说明里的追问逐条答；看不懂、矛盾或明显误选的，做下一轮",
     "row": "tail",
     "width": "50%"
    },
    {
     "type": "notice",
     "text_ref": "子代理不做页面（在用）派出去的子代理默认写成文字交回给派它的会话；要不要给我做页面由主对话定。页",
     "row": "tail",
     "width": "50%"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。“写法规矩”共享外卡内左右两栏需容器支持，目前不可用时列未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "AI写这种页的规矩"
    },
    {
     "type": "section_heading",
     "text_ref": "写法规矩（在用）"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "text_ref": "怎么写："
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "text_ref": "请我拍板时："
    },
    {
     "type": "notice",
     "text_ref": "收到答复怎么办（在用）有说明的以说明为准，说明里的追问逐条答；看不懂、矛盾或明显误选的，做下一轮"
    },
    {
     "type": "notice",
     "text_ref": "子代理不做页面（在用）派出去的子代理默认写成文字交回给派它的会话；要不要给我做页面由主对话定。页"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。“写法规矩”共享外卡内左右两栏需容器支持，目前不可用时列未完成。"
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
   "source_phrase": "一个大圆点牵着两个小圆点",
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
   "source_phrase": "",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c76d507f3230cbeb035f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c76d507f3230cbeb035f",
   "title_text": "AI 写这种页的规矩",
   "sha256": "b1ec2ed0e9e5e61a7c59a861a6ef5e19fb0faea656103c870d6f0dd2bc085934",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

AI 写这种页的规矩

**写法规矩**（在用）
怎么写：
- 先结论，后细节：每节第一句就是答案，证据收进折叠
- 每段一个意思，三到五行；超过三段就加小标题
- 我一条消息问了几件事，就逐项回答几件
- 用真实的数量和文件夹名，不用内部代号；有用的英文第一次出现时括号写中文
- 重点少而准，一页标黄不超过两三处
- 同一组数字不在结论、大数字、时间线、表格里抄四遍
- 分清“已做”“接着做”“要我决定或亲手做”
- 时间一律北京时间；长任务写清到哪一步、还差什么、还要多久

请我拍板时：
- 先把事实查清；没核实的判断不拿来当问题的背景
- 每张卡按“现在实际是什么样 → 为什么要定 → 各做法的后果 → AI 建议和理由 → 对我日常意味着什么”写
- 选项都是确定的做法，不写“A 或 B”
- 纯技术取舍 AI 自己定，不做成卡片；我看不见的变化不写进汇报
- 卡片编号跨轮不重复；提上一轮时写“第一轮 A3（总索引改私有）”这样带人话的说法

**收到答复怎么办**（在用）　有说明的以说明为准，说明里的追问逐条答；看不懂、矛盾或明显误选的，做下一轮页面讲清，不替我改选择。

**子代理不做页面**（在用）　派出去的子代理默认写成文字交回给派它的会话；要不要给我做页面由主对话定。页面做完，回复里仍用几句话说结论、附上页面链接，关掉页面也能从对话里找回。

::screen{#skill-report-page-08 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-report-page-08",
  "section": "abilities",
  "title": "能做的事：它是怎么长成现在这样的",
  "scene": "横版画面：左上标题，下面一句粗体字。一条横跨整屏、从左到右的时间线（细绿线，节点是绿色圆点），九个真实事件节点交错排在线的上下方，每个节点上方写时间（等宽字），下面是两行：第一行灰色小字写“我说”，第二行粗体写“它改成”。时间线下面一条灰底细横幅写“本机打开按钮”那段，粗体名字后括号里的状态词前画一个叉。时间线右下角一枚小印章样的圆形插画：一张网页上叠着一个对话气泡。 本张9个真实事件按text的时间先后排节点：9月26日03:33、04:25、11:03；9月27日01:39、02:24、03:39、15:17；9月28日06:17；10月8日00:08。原8卡原字位置尽量保持，第9个节点接在最右端，时间线可整体略收紧让位，只移动对应圆点与短斜连接线，允许卡片少量移位以避免跨越/误配，不为全竖线重排全部文案。最后正常事件的节点仍为正常绿点，不能被旧AI草稿误标停用；下方“本机打开按钮（已停用）”横幅既有灰叉照旧。",
  "portrait": "竖版：时间线改成从上到下，一个节点一行；粗体句在最上面。",
  "links": [],
  "anchors": [
   {
    "id": "g-retired",
    "text": "它是怎么长成现在这样的"
   },
   {
    "id": "f-local-open",
    "text": "本机打开按钮",
    "locator_text": {
     "h": "本机打开按钮（已停用）"
    }
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
     "text_ref": "能做的事：它是怎么长成现在这样的"
    },
    {
     "type": "prose",
     "bold": true,
     "text_ref": "几乎每样功能，都来自我在汇报页上的一句答复。"
    },
    {
     "type": "timeline",
     "columns": 4,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "none",
     "icons": "none",
     "paragraph_nodes_as_events": true,
     "stagger": true,
     "text_ref": "9月26日03:33第一轮产品审查用过一张能点选的网页，AI把它做成技能：白底绿色、带决策卡、一"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "本机打开按钮（已停用）9月27日凌晨加过“打开文件夹”“用默认程序打开”“在文件夹中显示”三个按"
    },
    {
     "type": "prose",
     "text_ref": "时间为北京时间，取技能改动的提交时间；我的话按意思转述。"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "small"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。九个事件是 para 节点，须按真实日期串成时间线；不新增“我说/它改成”等定稿外字。最后正常事件绿点，停用叉只在原横幅。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事：它是怎么长成现在这样的"
    },
    {
     "type": "prose",
     "bold": true,
     "text_ref": "几乎每样功能，都来自我在汇报页上的一句答复。"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "none",
     "icons": "none",
     "paragraph_nodes_as_events": true,
     "stagger": false,
     "text_ref": "9月26日03:33第一轮产品审查用过一张能点选的网页，AI把它做成技能：白底绿色、带决策卡、一"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "本机打开按钮（已停用）9月27日凌晨加过“打开文件夹”“用默认程序打开”“在文件夹中显示”三个按"
    },
    {
     "type": "prose",
     "text_ref": "时间为北京时间，取技能改动的提交时间；我的话按意思转述。"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "small"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。九个事件是 para 节点，须按真实日期串成时间线；不新增“我说/它改成”等定稿外字。最后正常事件绿点，停用叉只在原横幅。"
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
   "asset": "_library/illustrations/generic-report-page-dashboard.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "generic-report-page-dashboard",
   "source_phrase": "时间线右下角一枚小印章样的圆形插画：一张网页上叠着一个对话气泡。",
   "sha256": "e6990e5657edbed68189b47d52f3088f639df95e4c2ed45db6698094d967b734",
   "status": "ready",
   "original_elements": [
    "一张网页上叠着一个对话气泡"
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
   "asset": "_library/titles/title-ff818ac07f31565ae40c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ff818ac07f31565ae40c",
   "title_text": "能做的事：它是怎么长成现在这样的",
   "sha256": "700fb4e189ba529e000eeaa74ed2d66b4263228afc8cd18e0b4c0cfa8170f351",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：它是怎么长成现在这样的

**几乎每样功能，都来自我在汇报页上的一句答复。**

9 月 26 日 03:33　第一轮产品审查用过一张能点选的网页，AI 把它做成技能：白底绿色、带决策卡、一键生成答复
9 月 26 日 04:25　每张卡下面自动加“我的说明”框：想法不在选项里也能写
9 月 26 日 11:03　基本满意，想放大 50%–75%，多些图，文字也要排好读　→　大屏自动放大到 1.75 倍，长文字重新排版，加柱状图、折线图、进度条、树状图
9 月 27 日 01:39　子代理最后也做个网页，浪费额度　→　子代理默认不做页面
9 月 27 日 02:24　网页里能链到本地文件夹　→　文件夹“复制路径”
9 月 27 日 03:39　浏览器打开 Markdown 不是渲染好的样子　→　Markdown 渲染后显示，能复制原文
9 月 27 日 15:17　“打开文件夹”这类按钮修了一次还是没用，修不好就不要了　→　本机打开按钮停用，只留复制和页内预览
9 月 28 日 06:17　图片不能放大　→　点开按原始像素看，能拖动、缩放
10 月 8 日 00:08　就一句话的事情，不需要专门汇报　→　简单完成回执、短状态直接在对话里说，我明确要网页时照做

**本机打开按钮**（已停用）　9 月 27 日凌晨加过“打开文件夹”“用默认程序打开”“在文件夹中显示”三个按钮，靠一个自带的本机打开程序接 Chrome 的链接。AI 自己验收时能打开，我在 Chrome 里点却没反应，修过一次还是不行；下午按我说的停用，那个打开程序连同约 1,300 行代码和测试一起删掉，只留复制路径、复制原文和页内预览。

时间为北京时间，取技能改动的提交时间；我的话按意思转述。

::screen{#skill-report-page-09 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-report-page-09",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，四行，右列的名字画成链接；表格下面一张卡片“不做”，五条短句。每块左上一个小水彩图标（一张打钩的网页、一个指路牌、一个禁止小标）。",
  "portrait": "本轮手机布局按根确认只重排现有skill-report-page-09-v.png，不拆张、不新增v2。全部现行文字一次完整保留：边界；管及完整说明；不管，交给谁；原字段名“这些事”“找谁”；四组原事项和交给谁的关系；不做及原五条清单。顺序：原标题在上；“管”一块整宽；“不管，交给谁”下四组关系各占整宽，每组先写事项、再在其下写原对应去向和解释，不能卡内左右分栏或压窄正文；“不做”在下方整宽排五条圆点清单，不增编号。原两字段名保留一次，配对上下读法清楚。正文参考42源像素、52源像素行高，在941原生宽度按370显示时约16.5px字、20.4px行高；正文可用约864源像素宽，清单约840源像素宽。按现文字量取（“管”一段比原来多约两行），正文约26行，加标题、小标题、字段名及间距约1736源像素；1672原生画布放不下时加高画布，不缩字、不删句。以上是AI布局空间证据，不是本人冻结的精确像素；应按实际手机轻松可读调整，不能靠缩小正文、删句或漏字段凑一张。三种原小水彩图标缩为各标题旁小标，约30–44源像素高，不占整列或大块高度；保留白绿风格，正文为蓝灰。链接只在原链接字上用绿色下划线及小箭头。不新增内容、口号、无意义标题、空框或按钮；不新增点击放大或看原图交互。本张“管”一段文字有增补；不改横版scene、links和其它屏。",
  "links": [
   {
    "text": "找照片、视频、录音",
    "href": "/skills/personal-media/"
   },
   {
    "text": "讲给我听",
    "href": "/skills/explain-to-me/"
   },
   {
    "text": "约法 L26",
    "href": "/rules/charter/#L26"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
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
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "text_ref": "管",
     "last_full_width": true
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "portrait_mode": "rows",
     "repeat_labels": false,
     "text_ref": "这些事找谁找照片视频录音、挑一批请我定去留找照片、视频、录音；它生成审批页、写回我的答复，这里只"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "不做",
     "last_full_width": true
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。手机仅一张，四组关系上下读、原表头一次完整保留；不增编号或空框。；page-fixer-09（按审页意见）：管卡换明确对勾图标；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "text_ref": "管"
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "portrait_mode": "rows",
     "repeat_labels": false,
     "text_ref": "这些事找谁找照片视频录音、挑一批请我定去留找照片、视频、录音；它生成审批页、写回我的答复，这里只"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "不做"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。手机仅一张，四组关系上下读、原表头一次完整保留；不增编号或空框。；page-fixer-09（按审页意见）：管卡换明确对勾图标",
   "portrait_parts": [
    {
     "part": 1,
     "node_indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ]
    }
   ],
   "portrait_max_parts": 1
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
   "source_phrase": "一张打钩的网页",
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
   "asset": "_library/round3/titles/title-r3-7a7e13ca96796233d6be.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

边界

**管**
把 AI 要展开说明的汇报、审查和进度、请我裁定的事和长回答做成本地网页，别的回答网页更直观时也能用：排版、各种图、图片视频录音文档的显示、决策卡和答复、自检、打开和到期清理。简单的完成回执和短状态不归它，直接在对话里说；我明确要网页时照做。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 找照片视频录音、挑一批请我定去留 | 〔找照片、视频、录音〕；它生成审批页、写回我的答复，这里只负责显示 |
| 把话讲明白的表达教训 | 〔讲给我听〕，这里只照它写 |
| 我的决定长期记在哪 | 决定原话记在规则与技能基座的决定记录里，不靠页面保存 |
| 什么时候必须用网页 | 〔约法 L26〕和〔能力与运行方式〕 |

**不做**
- 不发到网上：包括 Claude 的在线页面，我要求时除外；这个网站也不是它做的。
- 密码、密钥、恢复码永远不写进页面。
- 不复制我的私人照片、视频、录音，只写原文件路径。
- 页面是临时的：下次生成新页面时，14 天前的旧页进回收站；同一件事的下一轮另做一页。
- 网上的图片和视频地址不收，页面要能离线看。
