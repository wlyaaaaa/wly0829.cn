---
{
 "title": "Typora 薄荷主题",
 "kind": "project",
 "url": "/projects/typora-theme-pack/",
 "tagline": "Typora 用的薄荷主题，外加三种 PDF 样式。",
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
  "schema": "site-b1.page.v1",
  "page": "typora-theme-pack",
  "kind": "project",
  "title": "Typora 薄荷主题",
  "url": "/projects/typora-theme-pack/",
  "tagline": "Typora 用的薄荷主题，外加三种 PDF 样式。",
  "status": "偶尔用",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次更新",
    "at": "2026-09-29 01:36"
   },
   "facts": [],
   "as_of": "2026-10-10",
   "source": "项目修改记录"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/typora-theme-pack",
  "capability": "把文稿排得好看、按读者导出 PDF",
  "based_on": {
   "commit": "f30ac9c584e6fff0abe48ebd58b119c4d3c08da8",
   "commit_time": "2026-09-28T12:36:45-05:00"
  },
  "video_prompt": "6 秒无缝循环，白底水彩风格，从开头这屏出发：一片薄荷叶轻轻落在一个打开的写字窗口上，窗口边框和标题下的横条慢慢染成薄荷绿；窗口里飘出三张 A4 纸，依次停在右边排成一排，一张变成石墨灰、一张变成薄荷绿、一张变成墨蓝，每张纸落定时边上亮一下小小的绿色对勾；最后薄荷叶被风带回起点。镜头不动，没有文字，结尾回到起始画面。",
  "registry": {
   "groups": [
    {
     "id": "g-theme",
     "name": "编辑主题"
    },
    {
     "id": "g-export",
     "name": "导出 PDF"
    },
    {
     "id": "g-guard",
     "name": "导出保护"
    },
    {
     "id": "g-upkeep",
     "name": "配置和维护"
    }
   ],
   "features": [
    {
     "id": "f-mint-theme",
     "group": "g-theme",
     "name": "薄荷编辑主题",
     "what": "Typora 里的薄荷绿阅读和编辑主题，标题、引用、表格、代码都有自己的样子",
     "how": "在 Typora 主题菜单选 Verdant Mint",
     "status": "在用",
     "screen": "typora-theme-pack-09",
     "source": "themes/verdant-mint.css、themes/verdant/base.css；%APPDATA%\\Typora\\profile.data 里 theme=verdant-mint.css（9 月 27 日 15:19 最后写入）"
    },
    {
     "id": "f-install",
     "group": "g-theme",
     "name": "安装和核对主题",
     "what": "只复制两个主题文件，装完逐个比指纹；也能只核对不装",
     "how": "跟 AI 说装主题或查主题",
     "status": "在用",
     "screen": "typora-theme-pack-09",
     "source": "tools/install_theme.py；9 月 28 日 verify 两个文件都一致"
    },
    {
     "id": "f-keep-old",
     "group": "g-theme",
     "name": "更新前留旧版",
     "what": "主题文件和仓库不一样时，先把旧的复制进 old-themes，文件名带时间",
     "how": "跟 AI 说更新主题",
     "status": "在用",
     "screen": "typora-theme-pack-09",
     "source": "install_theme.py 第 60–68 行；old-themes/verdant/base.css.20260801T230219Z.bak（8 月 2 日 07:02 留下的一份）"
    },
    {
     "id": "f-original",
     "group": "g-export",
     "name": "原版 PDF",
     "what": "中性样式，石墨黑字、细灰线，文件名后缀“-原版”",
     "how": "Typora 菜单“Markdown 原样”，或跟 AI 说用原版",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export-profiles/original.css；export_pdf.py 第 28–33 行"
    },
    {
     "id": "f-personal",
     "group": "g-export",
     "name": "个人 PDF",
     "what": "薄荷主题加大字号，文件名后缀“-个人”",
     "how": "Typora 菜单“个人”，或跟 AI 说用个人版",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export-profiles/personal.css；render_previews.py 第 119–123 行"
    },
    {
     "id": "f-company",
     "group": "g-export",
     "name": "公司 PDF",
     "what": "墨蓝、灰白，不加品牌，文件名后缀“-公司”",
     "how": "Typora 菜单“公司”，或跟 AI 说用公司版",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export-profiles/company.css"
    },
    {
     "id": "f-typora-menu",
     "group": "g-export",
     "name": "从 Typora 菜单导出",
     "what": "文件 → 导出里的三项自定义命令，点一下就导出；9 月 29 日换了新入口，还没在 Typora 里点过",
     "how": "Typora 文件 → 导出",
     "status": "待验收",
     "screen": "typora-theme-pack-09",
     "source": "profile.data 的 export.custom、custom1、custom2；Typora 自己导出不留记录；9 月 29 日 configure_typora_menu.py 把三项改成 typora_export_launcher.ps1（提交 f30ac9c），本机 profile.data 已是新命令"
    },
    {
     "id": "f-ai-export",
     "group": "g-export",
     "name": "让 AI 导出",
     "what": "说哪份、用哪种，AI 运行导出脚本并报结果",
     "how": "“这份用公司版导一份 PDF”",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "9 月 1–28 日 Codex 记录、9 月 24–28 日 Claude 记录里 0 次；更早的记录不在了"
    },
    {
     "id": "f-output-pages",
     "group": "g-export",
     "name": "指定位置和页数",
     "what": "可以指定 PDF 存哪、要求正好几页，页数不对就不交",
     "how": "跟 AI 说存哪、要几页",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export_pdf.py 第 229–240 行（--output、--expected-pages）"
    },
    {
     "id": "f-safe-replace",
     "group": "g-guard",
     "name": "导坏不丢旧版",
     "what": "新 PDF 先暂存，查过才替换；不过关旧 PDF 原样留着",
     "how": "自动",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export_pdf.py 第 270–335 行；tests 里 4 种失败情况"
    },
    {
     "id": "f-source-check",
     "group": "g-guard",
     "name": "原文不被改写",
     "what": "导出前后比对 .md 的指纹，对不上就不报成功",
     "how": "自动",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export_pdf.py 第 270、308–314 行"
    },
    {
     "id": "f-ignore-inline",
     "group": "g-guard",
     "name": "不用文稿自带的样式",
     "what": "默认忽略 .md 里写的样式，只用选中的那一种；也可以改成保留或拒绝",
     "how": "自动；特殊文稿跟 AI 说",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export_pdf.py 第 234–239 行（--document-style-policy，默认 ignore）"
    },
    {
     "id": "f-no-overwrite",
     "group": "g-guard",
     "name": "不盖掉原文和转换器",
     "what": "输出路径等于原文或转换器时直接拒绝；输出必须是 .pdf",
     "how": "自动",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "export_pdf.py 第 251–268 行"
    },
    {
     "id": "f-converter",
     "group": "g-upkeep",
     "name": "记下用哪个转换器",
     "what": "转换器路径记进本机配置，不进 Git；按命令参数、环境变量、本机配置的顺序找",
     "how": "跟 AI 说配转换器",
     "status": "说不准",
     "screen": "typora-theme-pack-09",
     "source": "configure_converter.py；.typora-theme-pack.local.json（8 月 30 日 17:49 写入）。配置只在导出时起作用，导出用没用过查不清"
    },
    {
     "id": "f-preview",
     "group": "g-upkeep",
     "name": "效果预览",
     "what": "用公开样例生成软件概念图、代码块检查图、三种样式的页面图和拼图",
     "how": "改完样式让 AI 出预览",
     "status": "在用",
     "screen": "typora-theme-pack-09",
     "source": "render_previews.py main()；仓库 previews/ 下 8 张图是它 8 月 2 日生成的；之后样式没改过，没有再跑的记录"
    },
    {
     "id": "f-tests",
     "group": "g-upkeep",
     "name": "自动测试",
     "what": "21 项测试查导出保护、文件名后缀、只露一个主题、代码块样式等；GitHub 每次推送自动跑",
     "how": "改代码后自动",
     "status": "在用",
     "screen": "typora-theme-pack-09",
     "source": "tests/test_project.py；.github/workflows/test.yml；9 月 29 日本机重跑 21 项全过"
    }
   ],
   "numbers": [
    {
     "id": "n-theme-count",
     "text": "1 套",
     "meaning": "编辑主题数（Typora 菜单里新增的只有 Verdant Mint）",
     "as_of": "2026-10-10",
     "source": "themes/ 目录；profile.data theme=verdant-mint.css（10 月 10 日现查）；已装 verdant-mint.css 与仓库一致，verdant/base.css 少 f30ac9c 加的表头底色一行",
     "screens": [
      "typora-theme-pack-01"
     ]
    },
    {
     "id": "n-styles",
     "text": "3 种",
     "meaning": "PDF 样式：original、personal、company",
     "as_of": "2026-10-10",
     "source": "export_pdf.py MODES；export-profiles/ 三个 CSS",
     "screens": [
      "typora-theme-pack-01",
      "typora-theme-pack-03"
     ]
    },
    {
     "id": "n-sample-pages",
     "text": "都是 2 页",
     "meaning": "9 月 28 日用 samples/00-主题预览.md 三种样式各导出一份的页数",
     "as_of": "2026-09-28",
     "source": "本页写稿时实跑 export_pdf.py，pdf-render-safe 报告 source_page_count=2（见 facts.md 第四节）",
     "screens": [
      "typora-theme-pack-03"
     ]
    },
    {
     "id": "n-tests",
     "text": "21 项",
     "meaning": "tests/test_project.py 的测试数，全部通过",
     "as_of": "2026-10-10",
     "source": "10 月 10 日在临时副本（git archive HEAD f30ac9c）跑 python -m pytest tests：21 passed；def test_ 计数 21",
     "screens": [
      "typora-theme-pack-01",
      "typora-theme-pack-05",
      "typora-theme-pack-07",
      "typora-theme-pack-09",
      "typora-theme-pack-10"
     ]
    },
    {
     "id": "n-commits",
     "text": "6 次",
     "meaning": "仓库全部提交数，首次 71b2e24（8 月 12 日 07:04），最后 f30ac9c（9 月 29 日 01:36）",
     "as_of": "2026-10-10",
     "source": "git rev-list --count HEAD=6，HEAD 仍是 f30ac9c（10 月 10 日现查）",
     "screens": [
      "typora-theme-pack-01",
      "typora-theme-pack-10"
     ]
    },
    {
     "id": "n-suffix-pdfs",
     "text": "没有一个带三种后缀的 PDF",
     "meaning": "C:\\Users\\10979、D、E、G、H 盘文件名匹配 *-原版.pdf、*-个人.pdf、*-公司.pdf 的个数为 0",
     "as_of": "2026-09-28",
     "source": "9 月 28 日 rg --files 全盘按文件名查（见 facts.md 第三节）",
     "screens": [
      "typora-theme-pack-02",
      "typora-theme-pack-09"
     ]
    },
    {
     "id": "n-ai-exports",
     "text": "0 次",
     "meaning": "AI 替我运行 export_pdf.py 导出的次数；Codex 记录 9 月 1–28 日、Claude 记录 9 月 24–28 日，不含本页写稿",
     "as_of": "2026-09-28",
     "source": "tmp/usage_scan2.py 扫会话记录里的真实输出（Export profile= … bytes=）",
     "screens": [
      "typora-theme-pack-02"
     ]
    },
    {
     "id": "n-code-lines",
     "text": "720、469、1023、43、13、438 行",
     "meaning": "编辑主题 CSS、PDF 样式 CSS、Python 工具、JS、PowerShell、测试的行数",
     "as_of": "2026-10-10",
     "source": "wc -l themes/ export-profiles/ tools/ tests/（HEAD f30ac9c，10 月 10 日复核未变）",
     "screens": [
      "typora-theme-pack-05"
     ]
    },
    {
     "id": "n-guard-tests",
     "text": "230 行测试",
     "meaning": "cf6d710（8 月 31 日）给 tests/test_project.py 加的行数",
     "as_of": "2026-09-28",
     "source": "git show --stat cf6d710",
     "screens": [
      "typora-theme-pack-07"
     ]
    },
    {
     "id": "n-features",
     "text": "16 项",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-10-10",
     "source": "本文件",
     "screens": [
      "typora-theme-pack-09"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-md-pdf-toolkit",
     "with": "skill:md-to-pdf",
     "direction": "拿来",
     "flow": "export_pdf.py 把 Markdown 路径、临时 CSS、暂存输出路径、样式策略、--require-style 和可选页数交给 md-pdf-toolkit 的 build_styled_markdown_pdf.py；拿回 PDF 和一份 JSON 回执",
     "source": ".typora-theme-pack.local.json；export_pdf.py 第 197–220 行"
    },
    {
     "id": "r-pdf-render-safe",
     "with": "skill:pdf-render-safe",
     "direction": "拿来",
     "flow": "导出的 PDF 要看排版时，AI 用 PDF 逐页检查转成页面图和总览",
     "source": "md-to-pdf SKILL.md“Verification”一节"
    },
    {
     "id": "r-typora",
     "with": "外部软件 Typora",
     "direction": "交出",
     "flow": "两个主题文件装进 %APPDATA%\\Typora\\themes；三条自定义导出命令写在 Typora 设置里，调用 export_pdf.py",
     "source": "install_theme.py 第 23–27 行；profile.data export.custom*"
    },
    {
     "id": "r-edge",
     "with": "外部软件 Microsoft Edge",
     "direction": "拿来",
     "flow": "经转换器由 Playwright 驱动本机 Edge 打印 PDF；效果预览也用 Edge 截图",
     "source": "pdf_export_core.py BROWSER_CANDIDATES；render_previews.py EDGE_CANDIDATES"
    },
    {
     "id": "r-devconfig",
     "with": "devconfig-backup",
     "direction": "被备份",
     "flow": "开发配置备份把 AppData\\Roaming\\Typora 整个备份，里面有主题文件、old-themes 旧版和三条导出命令",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\sources.psd1 第 61 行"
    },
    {
     "id": "r-github",
     "with": "外部服务 GitHub",
     "direction": "交出",
     "flow": "公开仓库 wlyaaaaa/typora-theme-pack；每次推送 GitHub Actions 在 Ubuntu、Python 3.12 上跑 20 项测试",
     "source": ".github/workflows/test.yml"
    }
   ],
   "highlights": [
    {
     "id": "h-one-menu-item",
     "title": "菜单里只多一项",
     "screen": "typora-theme-pack-08"
    },
    {
     "id": "h-code-fence",
     "title": "代码块不再每行一张卡片",
     "screen": "typora-theme-pack-08"
    }
   ],
   "mentions": [
    {
     "target": "/skills/md-to-pdf/",
     "screen": "typora-theme-pack-01",
     "text": "文稿转 PDF"
    },
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "typora-theme-pack-02",
     "text": "PDF 逐页检查"
    },
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "typora-theme-pack-03",
     "text": "PDF 逐页检查"
    },
    {
     "target": "/projects/devconfig-backup/",
     "screen": "typora-theme-pack-04",
     "text": "开发配置备份"
    },
    {
     "target": "/skills/md-to-pdf/",
     "screen": "typora-theme-pack-05",
     "text": "文稿转 PDF"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“转换器配置”和代码里的三级查找（参数 → 环境变量 → 本机配置）合成一项“记下用哪个转换器”。",
    "底稿“安全替换PDF”保留为“导坏不丢旧版”；另把同一段代码里的原文指纹核对、输出不能盖掉原文和转换器拆成两项，因为它们挡的是不同的事。"
   ],
   "dropped": [
    "仓库里被 Git 忽略的 Mint-Typora-Theme.zip（8 月 1 日的打包）和 qa/ 中间文件：不是功能，写进 audit.md。",
    "render_html_png_playwright.js 单列：它只是效果预览内部用的截图助手，并进“效果预览”。"
   ],
   "unsure": [
    "替本人口吻：第 1 屏“我用 Markdown 写作软件 Typora 写文稿”，第 6 屏“8 月 2 日我把话说清楚了：原版、个人、公司是 PDF 的样式和文件后缀，不是三个编辑主题”。后一句依据是 codex-memory 里 8 月 1 日和 8 月 11 日两份工作摘要（AI 写的摘要，原会话记录已不在），不是逐字原话，上线前请本人过目。",
    "第 2 屏“点一项，PDF 生成在文稿旁边”：9 月 29 日菜单换成新入口，命令不再带 --output，AI 用样例实跑过一次，生成了带“-个人”后缀的 2 页 PDF；还没在 Typora 里实际点过。以下是改之前的情况：Typora 里配的命令当时带 --output \"${outputPath}\"。代码和测试说明空的输出路径会当作没给、在文稿旁边生成带后缀的文件；但 Typora 实际传进来的是什么没有在真实使用里看过，全盘也没找到带后缀的 PDF。如果 Typora 传的是具体路径，文件名就不带后缀。",
    "功能状态：三种 PDF 和导出保护都标“说不准”，没标“没用过”。理由：从 Typora 菜单导出不留记录，AI 会话记录只保留到 9 月 1 日（Claude 到 9 月 24 日），文件可能被删或改名。若本人记得没用过，可改成“没用过”。",
    "8 月 2 日那张 Typora 实拍截图，当时的 Typora 版本按 codex-memory 摘要是 1.9.5，现在是 1.14.8；截图说明没写版本。",
    "个人版 PDF 表头发灰 9 月 29 日已修好（提交 f30ac9c），第 3 屏改成修好后的说法；但第 3 屏个人版截图还是 9 月 28 日表头发灰的那张，要换成修好后导出的第 1 页。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/typora-theme-pack/page.json",
  "sha256": "e30ee35d3b9cb035dc4ce469fc60643793fb3e72f0dd944b23a1f73a17e608e5",
  "converted_at_beijing": "2026-10-10T09:37:36+08:00"
 }
}
---

::screen{#typora-theme-pack-01 section="top"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左边约 55% 宽：左上毛笔艺术字大标题，下面一句粗体副标题和一段介绍（介绍里“文稿转 PDF”画成绿色链接样式）。右边约 40% 宽留一个带细浅绿边框、圆角的空位，比例接近正方形（约 1:1），贴 Typora 实拍截图；空位下面一行灰色小字说明；空位后面垫一片淡淡的水彩薄荷叶子，叶子只露出边缘。下半部分一排四张数字卡（上面小水彩插画、大号绿色数字、下面一两行小字）：1 一片薄荷叶盖在一个打开的写字窗口上，2 三张并排的纸（一张灰、一张薄荷绿、一张墨蓝），3 一张打满勾的清单，4 一条短短的绿色时间线上五个小圆点。卡片下面右对齐一行灰色小字“截至……”。最下面一行两个白底细绿边圆角按钮。没有“现在”横条（这个项目没有自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题、副标题、介绍从上往下；截图空位占满宽（约 1:1），下面说明小字；四张数字卡两行两列；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#typora-theme-pack"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/typora-theme-pack"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/typora-theme-pack/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/7e7646c37cb6cbf5c55b1921773ef4288a4d4554aa9daf0c06d54cc5ede08013.png",
    "where": "右边约 40% 宽、接近正方形的空位",
    "caption": "薄荷主题在 Typora 里的样子（8 月 2 日实拍；打开的是仓库里的示例文稿）",
    "crop_h": [
     576,
     230,
     1756,
     1035
    ],
    "crop_v": [
     585,
     201,
     1715,
     1154
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
     "text_ref": "Typora薄荷主题",
     "align": "left",
     "size": "medium",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "prose",
     "text_ref": "写东西时看着舒服",
     "size": "large",
     "bold": true,
     "row": "k1a-head"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次更新 9 月 29 日 01:36",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 10 日 · 项目修改记录",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "screenshot",
     "text_ref": "薄荷主题",
     "indices": [
      0
     ],
     "ratio": "1938:1950",
     "columns": 1,
     "columns_v": 1,
     "row": "media-stats",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "stat_card",
     "text_ref": "1套",
     "columns": 2,
     "columns_v": 2,
     "variant": "para_fields",
     "icons": "auto",
     "row": "media-stats",
     "width": "40%"
    },
    {
     "type": "prose",
     "text_ref": "我用Markdown"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左边约 55% 宽：左上毛笔艺术字大标题，下面一句粗体副标题和一段介绍（介绍里“文稿转 PDF”画成绿色链接样式）。右边约 40% 宽留一个带细浅绿边框、圆角的空位，比例接近正方形（约 1:1），贴 Typora 实拍截图；空位下面一行灰色小字说明；空位后面垫一片淡淡的水彩薄荷叶子，叶子只露出边缘。下半部分一排四张数字卡（上面小水彩插画、大号绿色数字、下面一两行小字）：1 一片薄荷叶盖在一个打开的写字窗口上，2 三张并排的纸（一张灰、一张薄荷绿、一张墨蓝），3 一张打满勾的清单，4 一条短短的绿色时间线上五个小圆点。卡片下面右对齐一行灰色小字“截至……”。最下面一行两个白底细绿边圆角按钮。没有“现在”横条（这个项目没有自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 4
   },
   "pending_requirements": [
    "四条“数量｜说明”解析为 para，stat_card 不消费 para_fields，数字卡/逐卡图标尚未生成；截图后垫叶未接入。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "Typora薄荷主题",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "写东西时看着舒服",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次更新 9 月 29 日 01:36",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 10 日 · 项目修改记录"
    },
    {
     "type": "stat_card",
     "text_ref": "1套",
     "columns": 4,
     "columns_v": 2,
     "variant": "para_fields",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "我用Markdown"
    },
    {
     "type": "screenshot",
     "text_ref": "薄荷主题",
     "indices": [
      0
     ],
     "ratio": "1:1",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：大标题、副标题、介绍从上往下；截图空位占满宽（约 1:1），下面说明小字；四张数字卡两行两列；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 4
   },
   "pending_requirements": [
    "四条“数量｜说明”解析为 para，stat_card 不消费 para_fields，数字卡/逐卡图标尚未生成；截图后垫叶未接入。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "source_phrase": "1 套｜编辑主题，Typora 现在用的就是它（Typora 设置和装好的两个主题文件都核对过）",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "3 种｜PDF 样式：原版、个人、公司，用公开样例各导出一份，都是 2 页",
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
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "21 项｜自动测试全过（本机重跑；GitHub 每次推送也自动跑）",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
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
   "source_phrase": "6 次｜提交：8 月 12 日公开，9 月 29 日最后一次改（修好个人版表头和导出菜单）",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-67ace702377bbefa1281.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\typora-theme-pack\\img\\typora-theme-pack-01-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-67ace702377bbefa1281",
   "title_text": "Typora 薄荷主题",
   "sha256": "1bbb29d83c0844dbd7fa2dfadd2b834cfa7d7695f660a1a00158a2c518b91a15",
   "status": "ready",
   "source_box": [
    39,
    95,
    904,
    290
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# Typora 薄荷主题
**写东西时看着舒服，发出去的 PDF 按读者换样子。**

我用 Markdown 写作软件 Typora 写文稿。这个项目给它一套薄荷绿的编辑主题，再配三种 PDF 样式：原版（中性，忠于原文）、个人（把薄荷主题搬进 PDF，字大行宽）、公司（墨蓝克制，不加任何品牌）。同一份 .md 一个字不改，选一种就导出一份，文件名后面分别带“-原版”“-个人”“-公司”。它自己不带 PDF 引擎，转换交给〔文稿转 PDF〕背后的转换器；新 PDF 查过没问题，才替换旧文件。

薄荷主题在 Typora 里的样子（8 月 2 日实拍；打开的是仓库里的示例文稿）

1 套｜编辑主题，Typora 现在用的就是它（已核对 Typora 设置）
3 种｜PDF 样式：原版、个人、公司，同一份文稿选一种导一份
21 项｜自动测试全过（本机重跑；GitHub 每次推送也自动跑）
6 次｜提交；最近一次在 9 月 29 日，修好个人版表头和导出菜单

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#typora-theme-pack-02 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版：左上标题。三张竖向大卡片横排，每张上面一幅小水彩插画（1 一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶；2 一个展开的“文件 → 导出”下拉菜单，最下面三项“原版”“公司”“个人”，画出这几个字，菜单右边飘出一张 PDF；3 一个对话气泡，里面一张小小的 PDF 和一枚放大镜），插画下面卡片标题粗体，下面正文（第 3 张里“PDF 逐页检查”画成绿色链接样式）。最下面一条横跨整屏的浅黄底便签条，写“实际用得多少”那段。",
  "portrait": "竖版：标题；三张卡片上下排，每张插画在上、字在下；便签条在最下面。",
  "links": [
   {
    "text": "PDF 逐页检查",
    "href": "/skills/pdf-render-safe/"
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
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "1.写东西时",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "illustration_source": "illustrations"
    },
    {
     "type": "notice",
     "text_ref": "实际用得多少",
     "tone": "yellow"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题。三张竖向大卡片横排，每张上面一幅小水彩插画（1 一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶；2 一个展开的“文件 → 导出”下拉菜单，最下面三项“原版”“公司”“个人”，画出这几个字，菜单右边飘出一张 PDF；3 一个对话气泡，里面一张小小的 PDF 和一枚放大镜），插画下面卡片标题粗体，下面正文（第 3 张里“PDF 逐页检查”画成绿色链接样式）。最下面一条横跨整屏的浅黄底便签条，写“实际用得多少”那段。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "pending_requirements": [
    "三张卡顶部主插画当前 content_card 仅取 icon；底部黄色便签条暂未获得黄色外观。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "1.写东西时",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "illustration_source": "illustrations"
    },
    {
     "type": "notice",
     "text_ref": "实际用得多少",
     "tone": "yellow"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题；三张卡片上下排，每张插画在上、字在下；便签条在最下面。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "pending_requirements": [
    "三张卡顶部主插画当前 content_card 仅取 icon；底部黄色便签条暂未获得黄色外观。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/fix-round-2/icon-clean-e9ef162aa0a63e2296b7.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-typora-theme-pack",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶；2 一个展开的“文件 → 导出”下拉菜单，最下面三项“原版”“公司”“个人”，画出这几个字，菜单右边飘出一张 PDF；3 一个对话气泡，里面一张小小的 PDF 和一枚放大镜），插画下面卡片标题粗体，下面正文（第 3 张里“PDF 逐页检查”画成绿色链接样式）。",
   "sha256": "15c405fd0bc2978642ed84464064871759d9f3cc9d0e57d22cf04c76eefb32cc",
   "status": "ready",
   "original_elements": [
    "一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶"
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
   "asset": "_library/illustrations/菜单导出.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "菜单导出",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶；2 一个展开的“文件 → 导出”下拉菜单，最下面三项“原版”“公司”“个人”，画出这几个字，菜单右边飘出一张 PDF；3 一个对话气泡，里面一张小小的 PDF 和一枚放大镜），插画下面卡片标题粗体，下面正文（第 3 张里“PDF 逐页检查”画成绿色链接样式）。",
   "sha256": "2b8e3375f5859d4e452d7882e2c22940914e21980bd333b200c4b0f2872327aa",
   "status": "ready",
   "original_elements": [
    "一个展开的抽象图形下拉菜单，最下面三项抽象图形抽象图形抽象图形，字由排版程序另放，菜单右边飘出一张 PDF"
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
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文稿核验现图小槽4比3",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 一台显示器里开着写字窗口，窗口边框是薄荷绿，旁边一杯茶；2 一个展开的“文件 → 导出”下拉菜单，最下面三项“原版”“公司”“个人”，画出这几个字，菜单右边飘出一张 PDF；3 一个对话气泡，里面一张小小的 PDF 和一枚放大镜），插画下面卡片标题粗体，下面正文（第 3 张里“PDF 逐页检查”画成绿色链接样式）。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一个对话气泡，里面一张小小的 PDF 和一枚放大镜"
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
   "asset": "personal-health/personal-health-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 平时怎么用

**1. 写东西时它一直在**
打开 Typora 就是薄荷主题：一级标题下面一道绿色渐变条，二级标题、引用和表格都是圆角浅绿卡片，代码块整块一个框。装一次就不用再管，切到别的主题再切回来也行。

**2. 从 Typora 菜单直接导出**
文件 → 导出，菜单最下面有三项：“原版”“公司”“个人”，是本机 Typora 里配好的三条自定义导出命令。点一项，PDF 生成在文稿旁边，文件名带对应的后缀。9 月 29 日这三项换了新入口，还没在 Typora 里实际点过，待验收。

**3. 跟 AI 说**
“这份周报用公司版导一份 PDF。”
“薄荷主题更新一下，旧的留着。”
“主题菜单里找不到薄荷了，查一下。”
AI 运行项目里的脚本；要逐页看排版，再交给〔PDF 逐页检查〕。

**实际用得多少**｜主题一直是 Typora 的当前主题。不过 9 月 29 日为修 PDF 表头改过一个主题文件，Typora 里装的还是改之前那份，只差表头底色这一行；让 AI 重装一次就齐。PDF 这一半很少用：9 月 28 日查了所有硬盘，没有一个带“-原版”“-个人”“-公司”后缀的 PDF；AI 在 9 月 1–28 日的记录里也没替我导出过一次（更早的记录没留下来）。

::screen{#typora-theme-pack-03 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-03",
  "section": "usage",
  "title": "三种 PDF 长什么样",
  "scene": "横版：左上标题，下面一行说明小字。中间三个并排的带细浅绿边框的空位，每个是 A4 竖向比例（约 1:1.41），各占宽度约 30%，贴三张 PDF 第 1 页的截图；每个空位上方一个小标签（原版 / 个人 / 公司，标签旁一个小色点：石墨灰、薄荷绿、墨蓝），下方两行小字说明。空位里什么都不画。最下面一行灰色小字。",
  "portrait": "竖版分3张，使用默认v、v2、v3顺序，每张仅自己的原文和一张A4真实截图位。第1张typora-theme-pack-03-v.png：原标题、公开样例介绍、原版标签/说明和原版截图。原版A4框在标签下面占卡片整行，以正常左右内边距留800×1133源像素，说明在下；不分左右栏。第2张新增typora-theme-pack-03-v2.png：仅个人标签、个人A4截图与完整个人说明，不重复标题、介绍、原版或公司。空框880×1246源像素，说明在下。第3张新增typora-theme-pack-03-v3.png：仅公司标签、公司A4截图、完整公司说明及原文页尾“图是 PDF 第 1 页按 110 DPI……”小字。空框880×1246源像素，说明在下。三图均保持909:1287真实比例，空框内部全白，现役编译器贴原图。正文参考36源像素、行高44，第一/二/三张测算1545/1526/1526源像素可放进1672高度；不缩为左侧窄框。不增删改写原字、无新标题/新说明/重复文字，不为填满画布增加装饰或空框。连续外白交crop_box。横版scene与原text保持。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/428038d35c01c94f7cf12cc99576af3a1988d0388620ceceecbd39ad478495ec.png",
    "where": "左边的 A4 空位",
    "caption": "**原版**｜石墨黑字、细灰分隔线，像在 GitHub 上看 Markdown，不带任何主题色。适合只要干净排版的时候。"
   },
   {
    "file": "sources/assets/_references/e80a2f0adde1274bc5f1916e77ee46c97052d2cb40b71141a59dbfa7d14c13eb.png",
    "where": "中间的 A4 空位",
    "caption": "**个人**｜整套薄荷主题搬进 PDF：标题下的绿色渐变条、圆角浅绿卡片；打印正文 11.2 磅、行距 1.84。给自己反复读的。表头本该是主题的浅绿：这张图是 9 月 28 日导出的，表头还被转换器的默认样式盖成灰色，9 月 29 日已修好。"
   },
   {
    "file": "sources/assets/_references/7507d9c083ad445aa46e496f3a6bc7aa9defbcc7797ec260083faede711b4830.png",
    "where": "右边的 A4 空位",
    "caption": "**公司**｜墨蓝标题左边一道竖线、深蓝表头、灰白分区。不加 logo、水印和客户名。给同事看的。"
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
     "text_ref": "三种PDF长什么样",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "同一份示例文稿"
    },
    {
     "type": "screenshot",
     "text_ref": "原版",
     "indices": [
      0
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 800,
     "text_position": "after",
     "label_above": true,
     "page_break_after": false,
     "row": "pdf",
     "width": "33.333%"
    },
    {
     "type": "screenshot",
     "text_ref": "个人",
     "indices": [
      1
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 880,
     "text_position": "after",
     "label_above": true,
     "page_break_after": false,
     "row": "pdf",
     "width": "33.333%"
    },
    {
     "type": "screenshot",
     "text_ref": "公司",
     "indices": [
      2
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 880,
     "text_position": "after",
     "label_above": true,
     "page_break_after": false,
     "row": "pdf",
     "width": "33.333%"
    },
    {
     "type": "prose",
     "text_ref": "三张图都是"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题，下面一行说明小字。中间三个并排的带细浅绿边框的空位，每个是 A4 竖向比例（约 1:1.41），各占宽度约 30%，贴三张 PDF 第 1 页的截图；每个空位上方一个小标签（原版 / 个人 / 公司，标签旁一个小色点：石墨灰、薄荷绿、墨蓝），下方两行小字说明。空位里什么都不画。最下面一行灰色小字。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "每槽标签应在框上、说明在下；当前 screenshot 将卡头和说明一起置后。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "三种PDF长什么样",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "同一份示例文稿"
    },
    {
     "type": "screenshot",
     "text_ref": "原版",
     "indices": [
      0
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 800,
     "text_position": "after",
     "label_above": true,
     "page_break_after": true
    },
    {
     "type": "screenshot",
     "text_ref": "个人",
     "indices": [
      1
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 880,
     "text_position": "after",
     "label_above": true,
     "page_break_after": true
    },
    {
     "type": "screenshot",
     "text_ref": "公司",
     "indices": [
      2
     ],
     "ratio": "909:1287",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 880,
     "text_position": "after",
     "label_above": true,
     "page_break_after": false
    },
    {
     "type": "prose",
     "text_ref": "三张图都是"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版分3张，使用默认v、v2、v3顺序，每张仅自己的原文和一张A4真实截图位。第1张typora-theme-pack-03-v.png：原标题、公开样例介绍、原版标签/说明和原版截图。原版A4框在标签下面占卡片整行，以正常左右内边距留800×1133源像素，说明在下；不分左右栏。第2张新增typora-theme-pack-03-v2.png：仅个人标签、个人A4截图与完整个人说明，不重复标题、介绍、原版或公司。空框880×1246源像素，说明在下。第3张新增typora-theme-pack-03-v3.png：仅公司标签、公司A4截图、完整公司说明及原文页尾“图是 PDF 第 1 页按 110 DPI……”小字。空框880×1246源像素，说明在下。三图均保持909:1287真实比例，空框内部全白，现役编译器贴原图。正文参考36源像素、行高44，第一/二/三张测算1545/1526/1526源像素可放进1672高度；不缩为左侧窄框。不增删改写原字、无新标题/新说明/重复文字，不为填满画布增加装饰或空框。连续外白交crop_box。横版scene与原text保持。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "每槽标签应在框上、说明在下；当前 screenshot 将卡头和说明一起置后。",
    "定稿强制 v/v2/v3 三张、每张只一张 A4 框；主分张阈值高于1672且不消费 page_break_after，880框也受页正常内边距限制。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复 07（北京时间 2026-10-03）：按既有 comp-slots/t09-shot-response，公司槽后取消末断点，页尾图示说明随第三张，不多生成仅页尾一句的第四张。"
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
   "asset": "_library/titles/title-0e07274886025ebed242.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r2\\state\\b1-typora-theme-pack-03-h\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0e07274886025ebed242",
   "title_text": "三种 PDF 长什么样",
   "sha256": "3cd290443e7e62acdcedfe6e64688d1ed26b63ea035bb471c514192c843876d8",
   "status": "ready",
   "source_box": [
    42,
    16,
    701,
    141
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 三种 PDF 长什么样
同一份示例文稿《春序 · 智能工作台方案简报》（虚构的公开样例），9 月 28 日现场导出三次，每份 2 页，导出前后原文的内容指纹（SHA-256）一样。下面是每份的第 1 页。

**原版**｜石墨黑字、细灰分隔线，像在 GitHub 上看 Markdown，不带任何主题色。适合只要干净排版的时候。

**个人**｜整套薄荷主题搬进 PDF：标题下的绿色渐变条、圆角浅绿卡片；打印正文 11.2 磅、行距 1.84。给自己反复读的。表头本该是主题的浅绿：这张图是 9 月 28 日导出的，表头还被转换器的默认样式盖成灰色，9 月 29 日已修好。

**公司**｜墨蓝标题左边一道竖线、深蓝表头、灰白分区。不加 logo、水印和客户名。给同事看的。

三张图都是对应 PDF 的第 1 页，由〔PDF 逐页检查〕转成图片。

::screen{#typora-theme-pack-04 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-04",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左上标题，下面一行小字。六张横向小卡片排成两列（每列三张），每张左边一个小水彩图标（一张完好的旧 PDF 被一只手护着、一个问号插头、一张被划了一笔的文稿、空着的主题菜单、贴着时间标签的小纸箱、两台电脑之间一个箭头），右边粗体一句加小字。",
  "portrait": "竖版：标题、小字；六张卡片一行一张。",
  "links": [
   {
    "text": "开发配置备份",
    "href": "/projects/devconfig-backup/"
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
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "它没有自动提醒"
    },
    {
     "type": "feature_card",
     "text_ref": "导出失败",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "flow": "column",
     "rows": 3,
     "portrait_columns": 1
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题，下面一行小字。六张横向小卡片排成两列（每列三张），每张左边一个小水彩图标（一张完好的旧 PDF 被一只手护着、一个问号插头、一张被划了一笔的文稿、空着的主题菜单、贴着时间标签的小纸箱、两台电脑之间一个箭头），右边粗体一句加小字。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "它没有自动提醒"
    },
    {
     "type": "feature_card",
     "text_ref": "导出失败",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "flow": "row",
     "rows": 3,
     "portrait_columns": 1
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题、小字；六张卡片一行一张。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "source_phrase": "一张完好的旧 PDF 被一只手护着",
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
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "一个问号插头",
   "sha256": "9f19b0993d47ecb67a994c3988d36efb98a1b9dca540cacc914abb5755b33ebe",
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
   "source_phrase": "一张被划了一笔的文稿",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "空着的主题菜单",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "贴着时间标签的小纸箱",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双屏同步",
   "source_phrase": "两台电脑之间一个箭头",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "typora-theme-pack/typora-theme-pack-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\typora-theme-pack\\img\\typora-theme-pack-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "1800120604445f4527924e491f0e362ca46475a77e31ca6f81cecc3f429b31b0",
   "status": "ready",
   "source_box": [
    30,
    25,
    549,
    178
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 出事怎么办
它没有自动提醒；出了问题直接跟 AI 说，AI 按下面的办法处理。

**导出失败**｜旧 PDF 原样留着，这次生成到一半的临时文件清掉，报出转换器给的原因。不会拿一个坏文件或上次的旧文件冒充这次的成果。

**找不到转换器**｜直接报错，并列出三种配法：在导出命令里指定、设一个环境变量，或者跑一次配置脚本记进本机配置。不会自己去找系统里别的打印程序。

**导出时原文被改了**｜导出前后各算一次 .md 的指纹，对不上就不报成功。这只能发现改动，挡不住别的程序去改原文。

**主题菜单里没有薄荷**｜先重启 Typora；还没有，让 AI 核对两个主题文件的指纹，不一致就重装。

**想退回更新前的旧主题**｜旧文件在 Typora 主题文件夹的 old-themes 里，文件名带着时间。脚本没有一键还原，要手动拷回去。

**换电脑**｜〔开发配置备份〕连同 Typora 的设置一起备份，主题文件和三条导出命令都在里面；命令里写着项目在 E 盘的位置，Python 每次按电脑配置里登记的那个找；新电脑上项目放的位置不同，重跑一次菜单配置脚本就行。

::screen{#typora-theme-pack-05 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-05",
  "section": "tech",
  "title": "一次导出经过哪几步",
  "scene": "横版：左上标题。上半部分一条从左到右的流程图，六个圆角节点（小水彩图标：三个色块的调色盘、一个指纹、两张叠在一起的 CSS 纸片、一个插头连到另一台机器、一台 Edge 浏览器打印出一张 A4 纸、一个盾牌加对勾），绿色箭头依次相连，节点下面两三行小字；第 5 个节点画在一个浅灰虚线框里，框角小字“转换器（不属于本项目）”；第 6 个节点下面多画一条向下的细灰线，通向一个小节点“失败留旧 PDF”。下半部分两张横向卡片并排（左“主题怎么装”，右“文件和代码”），第 2 张里是一张四行小表。",
  "portrait": "竖版：标题；六个节点从上往下排，箭头向下，第 5 个节点的虚线框照画；“失败留旧 PDF”支线画在第 6 个节点右侧；两张卡片上下排。",
  "links": [
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/",
    "orientations": [
     "v"
    ]
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
     "text_ref": "一次导出经过哪几步",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "选样式",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "optional_items": [
      5
     ],
     "branch_refs": {
      "6": [
       "不过关，旧 PDF 不动"
      ]
     },
     "path": "serpentine"
    },
    {
     "type": "points_card",
     "text_ref": "主题怎么装",
     "whole_block": true,
     "row": "details",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "文件和代码",
     "whole_block": true,
     "row": "details",
     "width": "50%"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题。上半部分一条从左到右的流程图，六个圆角节点（小水彩图标：三个色块的调色盘、一个指纹、两张叠在一起的 CSS 纸片、一个插头连到另一台机器、一台 Edge 浏览器打印出一张 A4 纸、一个盾牌加对勾），绿色箭头依次相连，节点下面两三行小字；第 5 个节点画在一个浅灰虚线框里，框角小字“转换器（不属于本项目）”；第 6 个节点下面多画一条向下的细灰线，通向一个小节点“失败留旧 PDF”。下半部分两张横向卡片并排（左“主题怎么装”，右“文件和代码”），第 2 张里是一张四行小表。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [
    "第五节点已用 optional_items:[5] 形成虚线卡，第六节点已按原文分出不过关支线；但独立支线的右侧/向下位置及转换器范围小字的框角定位仍需组件完善，不能新增定稿外“失败留旧 PDF”文字。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第6条电脑六步改三列两行；移除与原 branch_refs 相同的冗余 failure_branch 字段，原第6步失败原句及分支绑定仍保留，不删任何正文。第6步嵌套小框交 comp-diagram 修普通主正文与单独失败支线。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一次导出经过哪几步",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "选样式",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "optional_items": [
      5
     ],
     "branch_refs": {
      "6": [
       "不过关，旧 PDF 不动"
      ]
     }
    },
    {
     "type": "points_card",
     "text_ref": "主题怎么装",
     "whole_block": true
    },
    {
     "type": "points_card",
     "text_ref": "文件和代码",
     "whole_block": true
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题；六个节点从上往下排，箭头向下，第 5 个节点的虚线框照画；“失败留旧 PDF”支线画在第 6 个节点右侧；两张卡片上下排。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [
    "第五节点已用 optional_items:[5] 形成虚线卡，第六节点已按原文分出不过关支线；但独立支线的右侧/向下位置及转换器范围小字的框角定位仍需组件完善，不能新增定稿外“失败留旧 PDF”文字。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第6条电脑六步改三列两行；移除与原 branch_refs 相同的冗余 failure_branch 字段，原第6步失败原句及分支绑定仍保留，不删任何正文。第6步嵌套小框交 comp-diagram 修普通主正文与单独失败支线。"
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
   "source_phrase": "在一个浅灰虚线框里，框角小字“转换器（不属于本项目）”",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "红色警示",
   "source_phrase": "一条向下的细灰线，通向一个小节点“失败留旧 PDF”",
   "sha256": "3adac5e6ca30429c0fc934071422cad3eb480d48b6d54d6a842a8516f6a689d4",
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
   "role": "icon",
   "slot_ordinal": 5,
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
   "slot_ordinal": 6,
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
   "asset": "_library/titles/title-646d3c025d8d190f698b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-646d3c025d8d190f698b",
   "title_text": "一次导出经过哪几步",
   "sha256": "d0bc8683f00ad86fc9b186f87590f75d1de1786034d95971c253f5d979468abe",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 一次导出经过哪几步

1. **选样式**｜从 Typora 菜单点，或让 AI 运行导出脚本，选原版、个人或公司。
2. **先记下原文**｜给 .md 算一个内容指纹；在目标文件旁边预约一个短名字的暂存文件。
3. **备好 CSS**｜原版、公司各用自己的 CSS；个人版＝薄荷主题的两份 CSS 加上个人版的大字号，拼成一份临时 CSS。转换器把正文放进和 Typora 编辑区同名的容器里，所以薄荷主题的样式不用改就能直接用在 PDF 上。
4. **找转换器**｜按顺序找：命令参数 → 环境变量 → 本机配置。这台电脑配的是〔文稿转 PDF〕的转换脚本。
5. **转换**｜Markdown 转成网页、套上 CSS，由 Playwright（浏览器自动化工具）驱动本机 Edge 按 A4 打印成 PDF。这一步归转换器，不属于本项目。
6. **查过再换**｜原文指纹没变、PDF 读得开、至少 1 页，才一次替换成正式文件；不过关，旧 PDF 不动

**主题怎么装**｜比较仓库和 Typora 里两个主题文件的指纹 → 不一样的先把旧的复制进 old-themes、文件名加上时间 → 用临时文件整个换上 → 再算一遍指纹，全对才报成功。别的主题、Typora 程序和授权都不碰。

**文件和代码**
| 部分 | 文件 | 行数 |
|---|---|---|
| 编辑主题 | 2 个 CSS | 720 |
| PDF 样式 | 3 个 CSS | 469 |
| 工具 | 5 个 Python、1 个 JS、1 个 PowerShell | 1023、43、13 |
| 测试 | 1 个 Python，21 项 | 438 |

::screen{#typora-theme-pack-06 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。五张横向小卡片排成左三右二两列，每张左边一个小水彩图标（一支笔和一张信封分开摆、一个空着的插座、一张原稿外面罩着三层彩色玻璃纸、一个空白的名片、两个贴着薄荷标签的小文件夹），右边粗体一句原则、下面小字。右列第三个位置放一张浅绿底卡片，画一个 GitHub 标志（章鱼猫剪影）和一句小字。",
  "portrait": "竖版：标题；五张卡片一行一张；GitHub 小卡片在最下面。",
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "编辑和交付分开选",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "principles",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "公司版不编造",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "principles",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "公开仓库",
     "row": "principles",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/GitHub标志.png"
     ]
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题。五张横向小卡片排成左三右二两列，每张左边一个小水彩图标（一支笔和一张信封分开摆、一个空着的插座、一张原稿外面罩着三层彩色玻璃纸、一个空白的名片、两个贴着薄荷标签的小文件夹），右边粗体一句原则、下面小字。右列第三个位置放一张浅绿底卡片，画一个 GitHub 标志（章鱼猫剪影）和一句小字。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 5
   },
   "pending_requirements": [
    "五卡左三右二与右列第三格小卡已通过 row 分两列；GitHub 标志素材未接入，品牌图字段尚未消费。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复07报告回读（北京时间2026-10-03 13:48）：末尾原公开仓库段改为已有content_card，显式GitHub标志左图；横继续右列第3位，竖末尾整宽。移除未执行的points_card.brand/grid_position，不删除原段或指定品牌图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "编辑和交付分开选",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "公开仓库",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/GitHub标志.png"
     ]
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题；五张卡片一行一张；GitHub 小卡片在最下面。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 5
   },
   "pending_requirements": [
    "五卡左三右二＋右列第三格 GitHub 小卡，目前尾卡独立整宽，未消费 grid_position/brand。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复07报告回读（北京时间2026-10-03 13:48）：末尾原公开仓库段改为已有content_card，显式GitHub标志左图；横继续右列第3位，竖末尾整宽。移除未执行的points_card.brand/grid_position，不删除原段或指定品牌图。"
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
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "一支笔和一张信封分开摆",
   "sha256": "6c4493be74e722fa3e8f1c2c95574768fe9c5da8b6afa27a3f66406d68c9a6a8",
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
   "source_phrase": "一个空着的插座",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张原稿外面罩着三层彩色玻璃纸",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "一个空白的名片",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_phrase": "两个贴着薄荷标签的小文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
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

**编辑和交付分开选。** 自己喜欢的薄荷绿不一定适合发给同事的文件。8 月 2 日我把话说清楚了：原版、个人、公司是 PDF 的样式和文件后缀，不是三个编辑主题。所以 Typora 里只有一个主题，PDF 另外选。

**主题包不带 PDF 引擎。** 它只管样式和把关，转换交给外面的转换器；换转换器只改一处配置。本机配置不进 Git，公开说明里不出现本机路径，有一项测试专门查。

**正文不动，样式从外面套。** 样式用单独的 CSS 文件交给转换器，默认忽略文稿里自带的样式；同一份 .md 出三种样子，不用存三份正文。

**公司版不编造。** 手上没有真的公司品牌材料，就不加 logo、水印、客户名，只用克制的墨蓝和灰白。

**只动自己的两个文件。** 装主题只写它自己的两个主题文件；测试用临时文件夹，不往真正的 Typora 主题文件夹里装。

公开仓库，MIT 许可；不含 Typora 程序、授权和 PDF 引擎。

::screen{#typora-theme-pack-07 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-07",
  "section": "tech",
  "title": "导坏了，旧 PDF 也还在",
  "scene": "横版：左上标题，下面一张横跨整屏的大卡片。卡片左边约 35% 宽一幅水彩插画：桌上一份装订好的旧 PDF 安安稳稳放着，旁边一张新打印的纸正被一枚放大镜检查，纸边上夹着一张小标签“暂存”；远处一只空的回收筐。卡片右边：“麻烦”“解法”“证据”三段，每段开头两个字用绿色小标签；解法里的三条检查画成一行三个小盾牌图标，每个盾牌下一行字；证据里的四种情况画成四个小方格，每格一个小叉和一行字。",
  "portrait": "竖版：标题；插画在上占满宽；三段上下排；三个盾牌一行一个，四个小方格两行两列。",
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
     "text_ref": "导坏了",
     "align": "center",
     "size": "medium",
     "row": "balanced-heading",
     "width": "88%"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "target_height": 320,
     "target_width": 480,
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "points_card",
     "text_ref": "麻烦",
     "whole_block": true,
     "last_full_width": true
    },
    {
     "type": "points_card",
     "text_ref": "解法",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 3,
     "last_full_width": true
    },
    {
     "type": "points_card",
     "text_ref": "证据",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 4,
     "last_full_width": true
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题，下面一张横跨整屏的大卡片。卡片左边约 35% 宽一幅水彩插画：桌上一份装订好的旧 PDF 安安稳稳放着，旁边一张新打印的纸正被一枚放大镜检查，纸边上夹着一张小标签“暂存”；远处一只空的回收筐。卡片右边：“麻烦”“解法”“证据”三段，每段开头两个字用绿色小标签；解法里的三条检查画成一行三个小盾牌图标，每个盾牌下一行字；证据里的四种情况画成四个小方格，每格一个小叉和一行字。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "右侧三段应处于同一大外卡、解法三盾牌和证据四个带叉方格（竖两列）须专门布局；现 points_card 不足以完成。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "导坏了",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "points_card",
     "text_ref": "麻烦",
     "whole_block": true
    },
    {
     "type": "points_card",
     "text_ref": "解法",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 3
    },
    {
     "type": "points_card",
     "text_ref": "证据",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 4
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题；插画在上占满宽；三段上下排；三个盾牌一行一个，四个小方格两行两列。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "右侧三段应处于同一大外卡、解法三盾牌和证据四个带叉方格（竖两列）须专门布局；现 points_card 不足以完成。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/illustrations/文稿核验通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文稿核验通用构图",
   "source_phrase": "卡片左边约 35% 宽一幅水彩插画：桌上一份装订好的旧 PDF 安安稳稳放着，旁边一张新打印的纸正被一枚放大镜检查，纸边上夹着一张小标签“暂存”；远处一只空的回收筐。",
   "sha256": "073503cefc7591f3fbafa430ecb30700d758e348da21f24a58d6fa1850ae7cc6",
   "status": "ready",
   "original_elements": [
    "桌上一份装订好的旧 PDF 安安稳稳放着，旁边一张新打印的纸正被一枚放大镜检查，纸边上夹着一张小标签抽象图形；远处一只空的回收筐"
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
   "asset": "_library/round3/titles/title-r3-bfb12675129eb6f4b635.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\typora-theme-pack\\img\\typora-theme-pack-07-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-bfb12675129eb6f4b635",
   "title_text": "导坏了，旧 PDF 也还在",
   "sha256": "6c7006f918be3ca9b8ae2affd62aaaee31db60605fda28672099e7cb1b82e290",
   "status": "ready",
   "source_box": [
    44,
    46,
    896,
    216
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 导坏了，旧 PDF 也还在

**麻烦**｜有的转换器什么都没生成，也会说“成功”。如果只看目标文件在不在，上次留下的旧 PDF 就会被当成这次的成果；要是直接写目标文件，转到一半出错，旧文件已经被写坏了。

**解法**｜新 PDF 先写到目标旁边的暂存文件里（名字很短，避开超长文件名；和目标在同一个文件夹，替换时不用跨盘搬）。转换器退出后查三样，全过才一次换上：
- 原文的指纹和导出前一样
- PDF 读得开，没有损坏
- 至少有 1 页
任何一样不过，旧 PDF 原样留着，暂存文件清掉；清理本身出错，也不会盖住真正的失败原因。

**证据**｜8 月 31 日这一版加了 230 行测试，下面四种情况旧 PDF 都没被换掉：
- 转换器什么都不做
- 生成一个看着像 PDF 的假文件
- 生成 0 页的 PDF
- 转换器报错退出
9 月 29 日在本机重跑，21 项测试全过。

::screen{#typora-theme-pack-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-08",
  "section": "highlights",
  "title": "亮点：两个小巧思",
  "scene": "横版：左上标题“亮点”，下面两张大卡片横排，每张上面一幅小水彩插画或截图，卡片标题用大字，下面“麻烦”“解法”两段。卡片 1 插画：一个下拉菜单“主题”，里面只有一行“Verdant Mint”带薄荷叶图标，菜单后面一个小文件夹“verdant”半掩着。卡片 2 不画插画，上面留一个带细浅绿边框的空位（约 4:3），贴代码块修复后的截图，空位下一行小字说明。",
  "portrait": "竖版只画一张9:16，按941×1672预算，正文保持原图清楚字号约34px、行高44px，不缩字。两张卡片上下整宽。标题在y24–96；第一卡y108–568：菜单、薄荷叶和小文件夹收成80px高的紧凑原生水彩示意，不横向拉伸，插画y120–200，卡标题y210–268，麻烦正文y280–412（3行），解法正文y424–556（3行）。第二卡y584–1600：上方截图框外沿y596–1198，净空800×594（贴1240×920原图），只留空框；原图注紧跟y1208–1268（24px字、30px行高，两行），第二卡标题y1282–1340，麻烦正文y1352–1484（3行），解法正文y1496–1584（2行）。截图与原图注同张。各正文区宽800px、整体左右保留正常留白，底部到1672仍有72px，不加新字或编号。横版不动。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/24b6a0e77dfa3b2ef9c878f95f38c100bbaa69337c18e038366348d8c32c5911.png",
    "where": "第 2 张卡片上部的 4:3 空位",
    "caption": "示例样张：修好后的代码块，整段一个框，语法颜色照旧（8 月 2 日在浏览器里按 Typora 的代码块结构模拟生成，不是 Typora 实拍）",
    "crop_h": [
     155,
     230,
     732,
     567
    ],
    "crop_v": [
     155,
     272,
     732,
     466
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
     "text_ref": "亮点",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "highlights",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "1.菜单里只多一项",
     "whole_block": true,
     "row": "highlights"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "1240:920",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 800,
     "row": "highlights",
     "width": "50%",
     "text_ref": "示例样张：修好后的代码块",
     "caption_per_slot": true,
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      }
     ]
    },
    {
     "type": "points_card",
     "text_ref": "2.代码块",
     "whole_block": true,
     "row": "highlights"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题“亮点”，下面两张大卡片横排，每张上面一幅小水彩插画或截图，卡片标题用大字，下面“麻烦”“解法”两段。卡片 1 插画：一个下拉菜单“主题”，里面只有一行“Verdant Mint”带薄荷叶图标，菜单后面一个小文件夹“verdant”半掩着。卡片 2 不画插画，上面留一个带细浅绿边框的空位（约 4:3），贴代码块修复后的截图，空位下一行小字说明。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "两大卡应把图/框与各自正文装进同一卡，图注位于第二框下紧接；现独立 blocks 无共享卡壳。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复 07（北京时间 2026-10-03）：接入既有 comp-slots/t09-shot-response：原截图说明只由截图块消费一次，在截图下、第二卡正文上；原两卡正文与插画均保留。截图仍按标准留空供网页填充。；主布局接任：截图块唯一原图注节点用现有slot_groups明确绑到槽0，避免说明前缀规范化与元caption差异；不复制图注。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "points_card",
     "text_ref": "1.菜单里只多一项",
     "whole_block": true
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "1240:920",
     "columns": 1,
     "columns_v": 1,
     "max_width_v": 800,
     "text_ref": "示例样张：修好后的代码块",
     "caption_per_slot": true,
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      }
     ]
    },
    {
     "type": "points_card",
     "text_ref": "2.代码块",
     "whole_block": true
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版只画一张9:16，按941×1672预算，正文保持原图清楚字号约34px、行高44px，不缩字。两张卡片上下整宽。标题在y24–96；第一卡y108–568：菜单、薄荷叶和小文件夹收成80px高的紧凑原生水彩示意，不横向拉伸，插画y120–200，卡标题y210–268，麻烦正文y280–412（3行），解法正文y424–556（3行）。第二卡y584–1600：上方截图框外沿y596–1198，净空800×594（贴1240×920原图），只留空框；原图注紧跟y1208–1268（24px字、30px行高，两行），第二卡标题y1282–1340，麻烦正文y1352–1484（3行），解法正文y1496–1584（2行）。截图与原图注同张。各正文区宽800px、整体左右保留正常留白，底部到1672仍有72px，不加新字或编号。横版不动。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "两大卡应把图/框与各自正文装进同一卡，图注位于第二框下紧接；现独立 blocks 无共享卡壳。",
    "定稿要求单张941×1672及明确 y 区间，现引擎只有流式布局，卡/框高度与顺序尚不符合。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 页修复 07（北京时间 2026-10-03）：接入既有 comp-slots/t09-shot-response：原截图说明只由截图块消费一次，在截图下、第二卡正文上；原两卡正文与插画均保留。截图仍按标准留空供网页填充。；主布局接任：截图块唯一原图注节点用现有slot_groups明确绑到槽0，避免说明前缀规范化与元caption差异；不复制图注。"
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
   "asset": "_library/illustrations/主题菜单薄荷文件夹.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "主题菜单薄荷文件夹",
   "source_phrase": "卡片 1 插画：一个下拉菜单“主题”，里面只有一行“Verdant Mint”带薄荷叶图标，菜单后面一个小文件夹“verdant”半掩着。",
   "sha256": "1dd888935ed6da2dddf751fadedaf2627394fdd164907f6c9e44a13c024adc91",
   "status": "ready",
   "original_elements": [
    "插画：一个下拉菜单抽象图形，里面只有一行抽象图形带薄荷叶图标，菜单后面一个小文件夹抽象图形半掩着"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\typora-theme-pack\\img\\typora-theme-pack-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    32,
    19,
    312,
    266
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 亮点

**1. 菜单里只多一项**
麻烦｜Typora 会把主题文件夹里的每个 .css 都列进主题菜单，公共结构文件也会冒出来，变成一个点了就乱的“主题”。
解法｜公共结构放进 verdant 子文件夹，菜单里只多出“Verdant Mint”一项；有一项测试守着“只露一个主题”。

**2. 代码块不再每行一张卡片**
麻烦｜Typora 1.14 把代码块里的每一行都画成一个单独的块，主题给代码块的圆角、底色和绿竖线就被套到了每一行上。
解法｜主题里把代码块内部每一行的样式清掉，只在整块外面画一次框；有一项测试专门查。
示例样张：修好后的代码块，整段一个框，语法颜色照旧（8 月 2 日在浏览器里按 Typora 的代码块结构模拟生成，不是 Typora 实拍）

::screen{#typora-theme-pack-09 section="features"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-09",
  "section": "features",
  "title": "全部功能",
  "scene": "横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例，图例下面一行小字说明。四组一屏排完，不跨屏。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）。",
  "links": [],
  "anchors": [
   {
    "id": "g-theme",
    "text": "编辑主题"
   },
   {
    "id": "g-export",
    "text": "导出 PDF"
   },
   {
    "id": "g-guard",
    "text": "导出保护"
   },
   {
    "id": "g-upkeep",
    "text": "配置和维护"
   },
   {
    "id": "f-mint-theme",
    "text": "薄荷编辑主题"
   },
   {
    "id": "f-install",
    "text": "安装和核对主题"
   },
   {
    "id": "f-keep-old",
    "text": "更新前留旧版"
   },
   {
    "id": "f-original",
    "text": "原版 PDF"
   },
   {
    "id": "f-personal",
    "text": "个人 PDF"
   },
   {
    "id": "f-company",
    "text": "公司 PDF"
   },
   {
    "id": "f-typora-menu",
    "text": "从 Typora 菜单导出"
   },
   {
    "id": "f-ai-export",
    "text": "让 AI 导出"
   },
   {
    "id": "f-output-pages",
    "text": "指定位置和页数"
   },
   {
    "id": "f-safe-replace",
    "text": "导坏不丢旧版"
   },
   {
    "id": "f-source-check",
    "text": "原文不被改写"
   },
   {
    "id": "f-ignore-inline",
    "text": "不用文稿自带的样式"
   },
   {
    "id": "f-no-overwrite",
    "text": "不盖掉原文和转换器"
   },
   {
    "id": "f-converter",
    "text": "记下用哪个转换器"
   },
   {
    "id": "f-preview",
    "text": "效果预览"
   },
   {
    "id": "f-tests",
    "text": "自动测试"
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
     "text_ref": "全部功能（16项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "prose",
     "text_ref": "在用＝真的用过"
    },
    {
     "type": "feature_card",
     "text_ref": "编辑主题",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例，图例下面一行小字说明。四组一屏排完，不跨屏。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 16
   },
   "pending_requirements": [
    "四组组名要求毛笔图、状态仅用圆点；当前组名普通粗体、原状态词仍画出。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（16项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "prose",
     "text_ref": "在用＝真的用过"
    },
    {
     "type": "feature_card",
     "text_ref": "编辑主题",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 16
   },
   "pending_requirements": [
    "四组组名要求毛笔图、状态仅用圆点；当前组名普通粗体、原状态词仍画出。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "薄荷编辑主题｜Typora 里的薄荷绿阅读和编辑主题，标题、引用、表格、代码都有自己的样子｜在用",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
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
   "source_phrase": "安装和核对主题｜只复制两个主题文件，装完逐个比指纹；也能只核对不装｜在用",
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "更新前留旧版｜主题文件和仓库不一样时，先把旧的复制进 old-themes，文件名带时间｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "source_phrase": "原版 PDF｜中性样式，石墨黑字、细灰线，文件名后缀“-原版”｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
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
   "source_phrase": "个人 PDF｜薄荷主题加大字号，文件名后缀“-个人”｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
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
   "source_phrase": "公司 PDF｜墨蓝、灰白，不加品牌，文件名后缀“-公司”｜说不准",
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "从 Typora 菜单导出｜文件 → 导出里的三项自定义命令，点一下就导出；9 月 29 日换了新入口，还没在 Typora 里点过｜待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "让 AI 导出｜说哪份、用哪种，AI 运行导出脚本并报结果｜说不准",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "指定位置和页数｜可以指定 PDF 存哪、要求正好几页，页数不对就不交｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "导坏不丢旧版｜新 PDF 先暂存，查过才替换；不过关旧 PDF 原样留着｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
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
   "source_phrase": "原文不被改写｜导出前后比对 .md 的指纹，对不上就不报成功｜说不准",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "不用文稿自带的样式｜默认忽略 .md 里写的样式，只用选中的那一种；也可以改成保留或拒绝｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "不盖掉原文和转换器｜输出路径等于原文或转换器时直接拒绝；输出必须是 .pdf｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "记下用哪个转换器｜转换器路径记进本机配置，不进 Git；按命令参数、环境变量、本机配置的顺序找｜说不准",
   "sha256": "c6826d947b1a5b0e6f5f3c857ffd849b19652e70af280bd81b3b38ef8f86f4ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "效果预览｜用公开样例生成软件概念图、代码块检查图、三种样式的页面图和拼图｜在用",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "自动测试｜21 项测试查导出保护、文件名后缀、只露一个主题、代码块样式等；GitHub 每次推送自动跑｜在用",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-45135f1666c9b132c5b6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-45135f1666c9b132c5b6",
   "title_text": "全部功能（16 项）",
   "sha256": "7bf885a31684b83b413b63948a8635c12d172ef806ec329043e2428a59f6f896",
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
   "asset": "_library/titles/title-6a70a665aa10d0971b37.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6a70a665aa10d0971b37",
   "title_text": "导出 PDF",
   "sha256": "18e6f5af46da2d0d5965eb325df11b868e9d77bf405d52ba331018c10df1b2b0",
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
   "asset": "_library/titles/title-09dc38e31ec2e8088038.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-09dc38e31ec2e8088038",
   "title_text": "导出保护",
   "sha256": "63b4c62a609a7b5a9eef1893254201c29663087add3343c283e20ad9c6ca6740",
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
   "asset": "_library/titles/title-74f45217e60ab2f7f622.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-74f45217e60ab2f7f622",
   "title_text": "编辑主题",
   "sha256": "f9b3562e08cd04ea3f1427bf3ca53d268ec7f2eb531227ca010eca1a1fdaf13c",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-fa27f5f24f0be57f46b0.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fa27f5f24f0be57f46b0",
   "title_text": "配置和维护",
   "sha256": "3a39b2dfc428ca3b84b5a51bc2ededd97a9f86f1aca7cbb6a38dab6c36e8c48d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（16 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
在用＝真的用过、现在照样能用（测试和写这页时的实跑不算）；说不准＝从 Typora 菜单导出不留记录，AI 的会话记录最早只到 9 月 1 日，查不清用没用过（所有硬盘上也没有一个带这三种后缀的 PDF）。


**编辑主题**
1. 薄荷编辑主题｜Typora 里的薄荷绿阅读和编辑主题，标题、引用、表格、代码都有自己的样子｜在用
2. 安装和核对主题｜只复制两个主题文件，装完逐个比指纹；也能只核对不装｜在用
3. 更新前留旧版｜主题文件和仓库不一样时，先把旧的复制进 old-themes，文件名带时间｜在用

**导出 PDF**
4. 原版 PDF｜中性样式，石墨黑字、细灰线，文件名后缀“-原版”｜说不准
5. 个人 PDF｜薄荷主题加大字号，文件名后缀“-个人”｜说不准
6. 公司 PDF｜墨蓝、灰白，不加品牌，文件名后缀“-公司”｜说不准
7. 从 Typora 菜单导出｜文件 → 导出里的三项自定义命令，点一下就导出；9 月 29 日换了新入口，还没在 Typora 里点过｜待验收
8. 让 AI 导出｜说哪份、用哪种，AI 运行导出脚本并报结果｜说不准
9. 指定位置和页数｜可以指定 PDF 存哪、要求正好几页，页数不对就不交｜说不准

**导出保护**
10. 导坏不丢旧版｜新 PDF 先暂存，查过才替换；不过关旧 PDF 原样留着｜说不准
11. 原文不被改写｜导出前后比对 .md 的指纹，对不上就不报成功｜说不准
12. 不用文稿自带的样式｜默认忽略 .md 里写的样式，只用选中的那一种；也可以改成保留或拒绝｜说不准
13. 不盖掉原文和转换器｜输出路径等于原文或转换器时直接拒绝；输出必须是 .pdf｜说不准

**配置和维护**
14. 记下用哪个转换器｜转换器路径记进本机配置，不进 Git；按命令参数、环境变量、本机配置的顺序找｜说不准
15. 效果预览｜用公开样例生成软件概念图、代码块检查图、三种样式的页面图和拼图｜在用
16. 自动测试｜21 项测试查导出保护、文件名后缀、只露一个主题、代码块样式等；GitHub 每次推送自动跑｜在用

::screen{#typora-theme-pack-10 section="history"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。一条从左到右的水彩绿丝带时间轴，上面八个小旗，每个小旗：日期（粗体绿色）＋一两行字，上下错开不挤；丝带起点画一片薄荷叶，终点画三张并排的小纸（灰、薄荷绿、墨蓝）。时间轴下面一行灰色小字。",
  "portrait": "竖版：标题；时间轴改成从上往下的竖丝带，小旗一行一个；灰色小字在最下面。",
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
     "text_ref": "演进（2026年）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "8月2日",
     "columns": 3,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "none",
     "alternating": true
    },
    {
     "type": "prose",
     "text_ref": "6次提交"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上标题。一条从左到右的水彩绿丝带时间轴，上面八个小旗，每个小旗：日期（粗体绿色）＋一两行字，上下错开不挤；丝带起点画一片薄荷叶，终点画三张并排的小纸（灰、薄荷绿、墨蓝）。时间轴下面一行灰色小字。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "八条日期为普通 para，timeline 尚未生成八面小旗与丝带、起点薄荷叶和终点三纸。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进（2026年）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "8月2日",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "none",
     "alternating": true
    },
    {
     "type": "prose",
     "text_ref": "6次提交"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题；时间轴改成从上往下的竖丝带，小旗一行一个；灰色小字在最下面。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "八条日期为普通 para，timeline 尚未生成八面小旗与丝带、起点薄荷叶和终点三纸。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/titles/title-60559ec08d1172637358.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-60559ec08d1172637358",
   "title_text": "演进（2026 年）",
   "sha256": "db23165afb23b1b352da4a906595585ada3cfcf674b7dc824e7908e425f6a9b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 演进（2026 年）

8 月 2 日｜装上薄荷主题；定下“一套编辑主题＋三种 PDF 样式”，PDF 文件名后缀定为 -原版、-个人、-公司；同一天转换改由 Playwright 驱动 Edge
8 月 12 日｜整理成公开项目，发到 GitHub（32 个文件，8 项测试）
8 月 30 日｜转换器可以记进本机配置，Typora 菜单导出不用每次指定
8 月 31 日｜导出改成“先暂存、查过再换”，失败不丢旧 PDF；测试到 20 项
9 月 8 日｜旧网站用公开样例实拍三种 PDF
9 月 26 日｜说明改成人话，项目约定写进给 AI 的说明
9 月 28 日｜写这一页时重跑 20 项测试，现场导出三种样式各一份
9 月 29 日｜个人版 PDF 表头恢复浅绿；导出菜单改叫原版、公司、个人，改由启动脚本每次按电脑配置找 Python；测试到 21 项

6 次提交，8 月 12 日到 9 月 29 日；8 月 31 日到 9 月 26 日之间只改过说明。

::screen{#typora-theme-pack-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/assets/typora-theme-pack/original-pdf.webp",
    "caption": "原版：中性的石墨文字和细分隔线（9 月 7 日用示例文稿实际导出的 PDF，1 页）。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/assets/typora-theme-pack/personal-pdf.webp",
    "caption": "个人版：薄荷色背景、更舒展的字号与间距。这张也是 9 月 7 日导出的，比 9 月 29 日修表头早，表头颜色以现在为准。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/assets/typora-theme-pack/company-pdf.webp",
    "caption": "公司版：墨蓝标题和灰白分区，保持克制。三张用的是同一份示例文稿，没加客户、品牌或虚构内容。",
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
     "text_ref": "原版：中性的石墨文字和细分隔线（9月7日用示例文稿实际导出的PDF，1页）。",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "827:1170",
      "827:1170",
      "827:1170"
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
     "text_ref": "原版：中性的石墨文字和细分隔线（9月7日用示例文稿实际导出的PDF，1页）。",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "827:1170",
      "827:1170",
      "827:1170"
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

原版：中性的石墨文字和细分隔线（9 月 7 日用示例文稿实际导出的 PDF，1 页）。

个人版：薄荷色背景、更舒展的字号与间距。这张也是 9 月 7 日导出的，比 9 月 29 日修表头早，表头颜色以现在为准。

公司版：墨蓝标题和灰白分区，保持克制。三张用的是同一份示例文稿，没加客户、品牌或虚构内容。
