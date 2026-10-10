---
{
 "title": "文稿转 PDF",
 "kind": "skill",
 "url": "/skills/md-to-pdf/",
 "tagline": "把 Markdown 转成能打印的 PDF，查过再交。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "examples",
   "label": "例子"
  },
  {
   "id": "abilities",
   "label": "能做的事"
  },
  {
   "id": "limits",
   "label": "边界"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-md-to-pdf",
  "kind": "skill",
  "title": "文稿转 PDF",
  "url": "/skills/md-to-pdf/",
  "tagline": "把 Markdown 转成能打印的 PDF，查过再交。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-09-29 01:21"
   },
   "facts": [
    "近 7 天没用过"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "file": "E:\\.agents\\plugins\\md-pdf-toolkit\\skills\\md-to-pdf\\SKILL.md",
   "rules_release": "E187",
   "plugin_commit": "af000245235b7ebfd170d78b36036d882e4999ad"
  },
  "video_prompt": "5 秒无缝循环，白底水彩：一张写着 # 号的 Markdown 纸滑进一台小打印机，打印机侧面的 Edge 标志轻轻闪一下，右边吐出一张 A4 纸；纸在一枚放大镜下停一下，边上亮起绿色对勾，然后落到一叠纸上；打印机下面压着的旧纸始终不动。镜头不动，没有文字。",
  "registry": {
   "groups": [
    {
     "id": "g-convert",
     "name": "转换"
    },
    {
     "id": "g-style",
     "name": "样式"
    },
    {
     "id": "g-check",
     "name": "交之前查"
    },
    {
     "id": "g-safe",
     "name": "不出乱子"
    }
   ],
   "features": [
    {
     "id": "f-single",
     "group": "g-convert",
     "name": "单篇转换",
     "what": "一份 .md 转成一份 PDF，中文文件名、中文内容都行",
     "how": "“这份转成 PDF”",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "build_styled_markdown_pdf.py；9 月 27–28 日真实回执 3 份（10、10、11 页）"
    },
    {
     "id": "f-batch",
     "group": "g-convert",
     "name": "一个文件夹一起转",
     "what": "文件夹里每份 .md 各出一份同名 PDF，最后报几份成功；只能用中性或老绿色样式",
     "how": "“这个文件夹全部转一遍”",
     "status": "说不准",
     "screen": "skill-md-to-pdf-04",
     "source": "build_docs_pdf.py；9 月的会话记录里没有批量转换的输出，更早的记录不在了"
    },
    {
     "id": "f-host-python",
     "group": "g-convert",
     "name": "用登记好的 Python 跑",
     "what": "不管命令行里碰巧是哪个 python，都用电脑配置里登记的那一个",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "Invoke-MdPdfToolkit.ps1 第 11–14 行读 E:\\PCConfig\\registries\\host_python.json"
    },
    {
     "id": "f-print-runtime",
     "group": "g-convert",
     "name": "打印工具按登记找",
     "what": "Node 和 Playwright 装在 E:\\Tools\\MD-PDF-Runtime，位置记在电脑配置里；登记或文件缺了就说缺哪一项，不去 Codex 的缓存里找",
     "how": "自动",
     "status": "待验收",
     "screen": "skill-md-to-pdf-04",
     "source": "plugins/md-pdf-toolkit/scripts/runtime_registry.py 读 E:\\PCConfig\\registries\\md_pdf_toolkit.json（.agents 提交 58789c6，9 月 29 日）；修复时真实导出和转图各验过一次，还没有日常转换的回执"
    },
    {
     "id": "f-neutral",
     "group": "g-style",
     "name": "默认中性样式",
     "what": "黑字灰线、A4、表格行不拆页",
     "how": "什么都不说就是它",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "pdf_export_core.py 第 33–55 行；3 份回执里 2 份 neutral"
    },
    {
     "id": "f-legacy-green",
     "group": "g-style",
     "name": "老绿色样式",
     "what": "早期项目说明的绿色标题，只给老文稿重新导出",
     "how": "“照原来的绿色样式导”",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "pdf_export_core.py 第 57–67 行；9 月 27 日 1 份回执 profile=legacy-green"
    },
    {
     "id": "f-project-css",
     "group": "g-style",
     "name": "套项目自己的 CSS",
     "what": "交一份或几份 CSS，PDF 按它排",
     "how": "“用公司版的样式导”",
     "status": "说不准",
     "screen": "skill-md-to-pdf-04",
     "source": "--css-file 可重复；回执的 style_characters 把文稿自带样式和外来 CSS 加在一起，看不出用没用 --css-file（9 月 28 日那份是 1627 字）；Typora 薄荷主题的三种样式走这里，但它的导出也查不清用没用过"
    },
    {
     "id": "f-doc-style",
     "group": "g-style",
     "name": "文稿自带样式怎么办",
     "what": "保留、忽略或拒绝三选一，默认保留；代码块里的样式示例不算",
     "how": "特殊文稿跟 AI 说",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "pdf_export_core.py 第 198–267 行 _DocumentDirectives；3 份真实回执 document_style_policy 都是 preserve（默认）"
    },
    {
     "id": "f-page-break",
     "group": "g-style",
     "name": "手动分页",
     "what": "文稿里写 <!-- PDF_PAGE_BREAK --> 或 page-break 的 div，就在那里换页",
     "how": "写在文稿里",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "pdf_export_core.py 第 23–24、236–240 行；9 月 28 日那份回执 declared_pages=9，即文稿里有 8 处分页标记（另两份是 1，没有分页标记）"
    },
    {
     "id": "f-expected-pages",
     "group": "g-check",
     "name": "页数要求",
     "what": "要求正好几页，实际页数不对就不交",
     "how": "“必须 3 页”",
     "status": "说不准",
     "screen": "skill-md-to-pdf-04",
     "source": "validate_pdf_output 第 421–422 行；回执不记是否提过页数要求"
    },
    {
     "id": "f-require-text",
     "group": "g-check",
     "name": "必须有的字",
     "what": "列出必须能从 PDF 里读出的字，少一个就不交",
     "how": "“标题要在”",
     "status": "说不准",
     "screen": "skill-md-to-pdf-04",
     "source": "validate_pdf_output 第 423–429 行（按 NFC 统一写法后比对）"
    },
    {
     "id": "f-missing-resource",
     "group": "g-check",
     "name": "缺图缺样式就失败",
     "what": "图片、样式只从文稿和 CSS 所在的文件夹读，加载不上就整份失败",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "print_html_pdf_playwright.js 第 79–96 行"
    },
    {
     "id": "f-check-replace",
     "group": "g-check",
     "name": "查过才替换",
     "what": "是 PDF、读得开、没加密、至少 1 页、原文和 CSS 指纹没变，全过才换上",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "_print_html_to_pdf 第 452–502 行"
    },
    {
     "id": "f-no-network",
     "group": "g-safe",
     "name": "默认不联网、不跑脚本",
     "what": "网上的图和文稿里的脚本默认挡掉，可信文稿才明确打开",
     "how": "要联网时跟 AI 说",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "print_html_pdf_playwright.js 第 33–61 行；3 份回执都是 network_enabled=false"
    },
    {
     "id": "f-no-overwrite",
     "group": "g-safe",
     "name": "不盖掉原文和样式",
     "what": "输出路径等于 Markdown 或 CSS 时直接拒绝",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "convert_document 第 538–543 行"
    },
    {
     "id": "f-one-writer",
     "group": "g-safe",
     "name": "同一份输出只让一个任务写",
     "what": "两个任务同时写同一个 PDF，后来的直接报错",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "output_mutex 第 163–195 行（Windows 互斥量）"
    },
    {
     "id": "f-timeout",
     "group": "g-safe",
     "name": "超时连进程一起停",
     "what": "默认 120 秒，最多 600 秒；超时把浏览器进程树一起结束",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "_print_via_playwright 第 367–383 行"
    },
    {
     "id": "f-receipt",
     "group": "g-safe",
     "name": "回执",
     "what": "每次成功打印一份 JSON：原文和 PDF 的指纹、页数、样式、打印方式、资源文件夹",
     "how": "自动",
     "status": "在用",
     "screen": "skill-md-to-pdf-04",
     "source": "convert_document 第 582–599 行，schema md-pdf-toolkit.export.v2"
    }
   ],
   "numbers": [
    {
     "id": "n-features",
     "text": "18 项",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-09-29",
     "source": "本文件",
     "screens": [
      "skill-md-to-pdf-04"
     ]
    },
    {
     "id": "n-example-pages",
     "text": "实际 1 页，要求 2 页",
     "meaning": "9 月 28 日写稿时对 samples/01-项目简报.md 的两次转换",
     "as_of": "2026-09-28",
     "source": "facts.md 第三节；回执 status=succeeded page_count=1，第二次退出码 1",
     "screens": [
      "skill-md-to-pdf-02"
     ]
    },
    {
     "id": "n-example-hash",
     "text": "2319f76a51d6…",
     "meaning": "两次转换后 brief.pdf 的 SHA-256 前 12 位，没变",
     "as_of": "2026-09-28",
     "source": "facts.md 第三节",
     "screens": [
      "skill-md-to-pdf-02"
     ]
    },
    {
     "id": "n-neutral-css",
     "text": "A4、页边约 1.5 厘米、正文 12 像素",
     "meaning": "NEUTRAL_CSS 的 @page 和 body",
     "as_of": "2026-09-28",
     "source": "pdf_export_core.py 第 34、37 行（上下 1.5cm、左右 1.4cm）",
     "screens": [
      "skill-md-to-pdf-03"
     ]
    },
    {
     "id": "n-timeout",
     "text": "默认 120 秒，最多 600 秒",
     "meaning": "单次转换超时",
     "as_of": "2026-09-28",
     "source": "build_styled_markdown_pdf.py 第 81 行；pdf_export_core.py 第 531 行",
     "screens": [
      "skill-md-to-pdf-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-typora-theme-pack",
     "with": "typora-theme-pack",
     "direction": "被调用",
     "flow": "Typora 薄荷主题的 export_pdf.py 把 .md、一份临时 CSS、暂存输出路径交给本技能的转换脚本，拿回 PDF 和回执",
     "source": "TyporaThemePack/.typora-theme-pack.local.json；export_pdf.py 第 197–220 行"
    },
    {
     "id": "r-pdf-render-safe",
     "with": "skill:pdf-render-safe",
     "direction": "交出",
     "flow": "转换成功后，要看排版时把 PDF 交给 PDF 逐页检查",
     "source": "SKILL.md“Verification”"
    },
    {
     "id": "r-pcconfig-python",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "从电脑配置的 host_python.json 读要用的 Python 和用户目录",
     "source": "Invoke-MdPdfToolkit.ps1 第 11–15 行"
    },
    {
     "id": "r-codex-runtime",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "Node 和 Playwright 从电脑配置登记的 E:\\Tools\\MD-PDF-Runtime 取（registries/md_pdf_toolkit.json）；9 月 29 日起不再从 Codex 自带运行环境的目录里找",
     "source": "plugins/md-pdf-toolkit/scripts/runtime_registry.py；E:\\PCConfig\\registries\\md_pdf_toolkit.json；.agents 提交 58789c6"
    },
    {
     "id": "r-edge",
     "with": "外部软件 Microsoft Edge",
     "direction": "拿来",
     "flow": "Playwright 驱动本机 Edge（找不到时 Chrome）打印 PDF",
     "source": "pdf_export_core.py 第 26–31 行"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "被管理",
     "flow": "md-pdf-toolkit 插件在 E:\\.agents\\plugins 下，由技能供给清单装进 Codex 和 Claude",
     "source": "E:\\.agents\\config\\personal-skill-supply.json"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "skill-md-to-pdf-01",
     "text": "PDF 逐页检查"
    },
    {
     "target": "/projects/typora-theme-pack/",
     "screen": "skill-md-to-pdf-01",
     "text": "Typora 薄荷主题"
    },
    {
     "target": "/projects/typora-theme-pack/",
     "screen": "skill-md-to-pdf-03",
     "text": "Typora 薄荷主题"
    },
    {
     "target": "/projects/agents/",
     "screen": "skill-md-to-pdf-05",
     "text": "AI 规则与技能基座"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "旧网站和旧技能稿里“中文文件名和中文内容都能正常转”并进“单篇转换”。"
   ],
   "dropped": [
    "技能源文件里给 AI 的命令行细节（参数名、launcher 路径）只在例子和出处里提到，页面不列命令。",
    "旧网站说旧版本页面“进回收站”那类说法属于 PDF 逐页检查，不在本页。"
   ],
   "unsure": [
    "这个技能不是 Typora 薄荷主题的入口：它是通用转换插件，Typora 薄荷主题只是用它的项目之一，所以“能做的事”在本页写全，没有链到项目页的功能清单。manifest 把它挂在 typora-theme-pack 下，按实际关系处理。",
    "第 1 屏五句“可以这样说”是替本人口吻写的，上线前请本人过目。其中“用公司版的样式导一份 PDF 给同事”：9 月 29 日起技能源文件写明三种样式走 Typora 薄荷主题的导出脚本（.agents 提交 58789c6），原来 audit.md 第 1 条说的缺口已补上。",
    "第 3 屏“早期一批项目说明用过绿色标题”：依据是 build_docs_pdf.py 的默认文档名（README、快速部署、使用手册）和 OpenClaw 备份里 6 月 21 日的旧技能说明，哪些项目用过没逐个查。",
    "第 2 屏 AI 的回复措辞是示意，事实（1 页、要求 2 页被拒、旧 PDF 指纹没变）是 9 月 28 日实跑的。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-md-to-pdf/page.json",
  "sha256": "b4b00d6cce9141a282ff21722d81d2c1a599e002bf27546a8583c641b0515e16",
  "converted_at_beijing": "2026-10-10T09:06:30+08:00"
 }
}
---

::screen{#skill-md-to-pdf-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-md-to-pdf-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（里面两个链接画成绿色链接样式）。",
  "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。",
  "links": [
   {
    "text": "PDF 逐页检查",
    "href": "/skills/pdf-render-safe/"
   },
   {
    "text": "Typora 薄荷主题",
    "href": "/projects/typora-theme-pack/"
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
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "illustration",
    "dialogue",
    "prose",
    "inline_link"
   ],
   "portrait_component_order": [
    "illustration",
    "dialogue",
    "prose",
    "chapter_title",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（里面两个链接画成绿色链接样式）。",
    "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "把 Markdown 文稿变成能打印、能交出去的 PDF，查过再交。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（里面两个链接画成绿色链接样式）。",
   "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "text_ref": "文稿转PDF",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "prose",
     "size": "large",
     "bold": true,
     "text_ref": "把Markdown文稿变成能打印、能交出去的PDF，查过再交。",
     "row": "k1a-head"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 01:21",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "AI写的说明、讲义、报告大多是Markdown。这个技能告诉AI怎么把它转成PD",
     "width": "62%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "hero",
     "width": "38%"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "可以这样说："
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
      "left"
     ],
     "tail": true,
     "text_ref": "“这份讲义转成PDF，我要打印。”",
     "row_counts": [
      2,
      2,
      1
     ]
    },
    {
     "type": "prose",
     "text_ref": "“公司版”“个人版”这类样式归Typora薄荷主题，这个技能只管转换和把关。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n五句对话按 para 拆为五泡、横2列竖1列，保留引号。主插画必须含 Markdown纸/Edge打印机/A4/盾牌/未损旧纸；候选语义未经本轮看图，不能由存在路径宣称符合。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "五句对话按 para 拆为五泡、横2列竖1列，保留引号。主插画必须含 Markdown纸/Edge打印机/A4/盾牌/未损旧纸；候选语义未经本轮看图，不能由存在路径宣称符合。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "illustration",
    "dialogue",
    "prose",
    "inline_link"
   ],
   "portrait_component_order": [
    "illustration",
    "dialogue",
    "prose",
    "chapter_title",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（里面两个链接画成绿色链接样式）。",
    "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "把 Markdown 文稿变成能打印、能交出去的 PDF，查过再交。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（里面两个链接画成绿色链接样式）。",
   "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "文稿转PDF"
    },
    {
     "type": "prose",
     "size": "large",
     "bold": true,
     "text_ref": "把Markdown文稿变成能打印、能交出去的PDF，查过再交。"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 01:21",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "AI写的说明、讲义、报告大多是Markdown。这个技能告诉AI怎么把它转成PD"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "可以这样说："
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
      "left"
     ],
     "tail": true,
     "text_ref": "“这份讲义转成PDF，我要打印。”"
    },
    {
     "type": "prose",
     "text_ref": "“公司版”“个人版”这类样式归Typora薄荷主题，这个技能只管转换和把关。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n五句对话按 para 拆为五泡、横2列竖1列，保留引号。主插画必须含 Markdown纸/Edge打印机/A4/盾牌/未损旧纸；候选语义未经本轮看图，不能由存在路径宣称符合。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "五句对话按 para 拆为五泡、横2列竖1列，保留引号。主插画必须含 Markdown纸/Edge打印机/A4/盾牌/未损旧纸；候选语义未经本轮看图，不能由存在路径宣称符合。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
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
   "asset": "_library/illustrations/打印文稿.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "打印文稿",
   "source_phrase": "右边一幅水彩插画：一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志），右边出来一张 A4 纸，纸旁边一个盾牌加对勾；打印机下面压着一张旧的 A4 纸，完好无损。",
   "sha256": "3863c82d79b0bb3cdf7b7c8ec0218c0572326751b6f4e3c1c17b2cb352c2c32f",
   "status": "ready",
   "original_elements": [
    "一张写着 # 号的 Markdown 纸从左边滑进一台打印机（打印机侧面贴着 Edge 浏览器的蓝绿色波浪标志"
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
   "asset": "skill-md-to-pdf/skill-md-to-pdf-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\img\\skill-md-to-pdf-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9886250624875171ec19",
   "title_text": "文稿转 PDF",
   "sha256": "b8732ecdf6a42c3c7e1e825034ae1314be90c281859d39dde6dc47996108d920",
   "status": "ready",
   "source_box": [
    31,
    15,
    646,
    190
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 文稿转 PDF
**把 Markdown 文稿变成能打印、能交出去的 PDF，查过再交。**

AI 写的说明、讲义、报告大多是 Markdown。这个技能告诉 AI 怎么把它转成 PDF：交文稿和样式，就能得到可打印的文件；可以指定纸张、页数和必须保留的文字、图片。先检查文件能打开、页数正确、内容齐全，全部通过才替换旧文件；失败就保留旧 PDF。转换后还要把排版交给〔PDF 逐页检查〕。

可以这样说：
“这份讲义转成 PDF，我要打印。”
“导出来必须正好 3 页，封面上的标题要在。”
“这个文件夹里的说明文档全部转一遍。”
“用公司版的样式导一份 PDF 给同事。”
“文稿里的图一张都不能少，缺了就别交。”

“公司版”“个人版”这类样式归〔Typora 薄荷主题〕，这个技能只管转换和把关。

::screen{#skill-md-to-pdf-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-md-to-pdf-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），分两轮；右边约 45% 宽一张浅灰底的“回执”卡片，像一张打印出来的小票，上面几行等宽字，写着回执里的关键项（照 text 里“回执里记了什么”那段逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。",
  "portrait": "竖版：标题；对话在上；回执小票占满宽；“背后发生了什么”卡片在最下面。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "dialogue",
    "content_card",
    "monospace",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "dialogue",
    "monospace",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），分两轮；右边约 45% 宽一张浅灰底的“回执”卡片，像一张打印出来的小票，上面几行等宽字，写着回执里的关键项（照 text 里“回执里记了什么”那段逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。",
    "portrait": "竖版：标题；对话在上；回执小票占满宽；“背后发生了什么”卡片在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "回执里记了什么",
     "背后发生了什么"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），分两轮；右边约 45% 宽一张浅灰底的“回执”卡片，像一张打印出来的小票，上面几行等宽字，写着回执里的关键项（照 text 里“回执里记了什么”那段逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。",
   "portrait": "竖版：标题；对话在上；回执小票占满宽；“背后发生了什么”卡片在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "prose",
     "text_ref": "真事："
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "right",
      "left",
      "right",
      "left"
     ],
     "tail": true,
     "row": "example",
     "width": "55%",
     "text_ref": "我：“这份简报转成PDF，要正好1页，‘三项原则’这几个字必须在。”"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "columns": 1,
     "heading_refs": [
      "回执里记了什么"
     ],
     "row": "example",
     "width": "45%",
     "text_ref": "回执里记了什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "背后发生了什么"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n两轮我右/AI左对白已表达，source 要浅绿/白两色；dialogue 目前双方共用绿色变量，无按角色换白底模式。\n回执要求浅灰小票与等宽字，document_mock.paper 使用共享浅绿/常规Sans；灰底与真正ASCII等宽目前未消费。底部‘背后发生了什么’四步在同一浅绿外卡内，不能拆成四张大卡。",
   "unsupported_requirements": [
    "两轮我右/AI左对白已表达，source 要浅绿/白两色；dialogue 目前双方共用绿色变量，无按角色换白底模式。",
    "回执要求浅灰小票与等宽字，document_mock.paper 使用共享浅绿/常规Sans；灰底与真正ASCII等宽目前未消费。底部‘背后发生了什么’四步在同一浅绿外卡内，不能拆成四张大卡。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "dialogue",
    "content_card",
    "monospace",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "dialogue",
    "monospace",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），分两轮；右边约 45% 宽一张浅灰底的“回执”卡片，像一张打印出来的小票，上面几行等宽字，写着回执里的关键项（照 text 里“回执里记了什么”那段逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。",
    "portrait": "竖版：标题；对话在上；回执小票占满宽；“背后发生了什么”卡片在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "回执里记了什么",
     "背后发生了什么"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），分两轮；右边约 45% 宽一张浅灰底的“回执”卡片，像一张打印出来的小票，上面几行等宽字，写着回执里的关键项（照 text 里“回执里记了什么”那段逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。",
   "portrait": "竖版：标题；对话在上；回执小票占满宽；“背后发生了什么”卡片在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "prose",
     "text_ref": "真事："
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "right",
      "left",
      "right",
      "left"
     ],
     "tail": true,
     "text_ref": "我：“这份简报转成PDF，要正好1页，‘三项原则’这几个字必须在。”"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "columns": 1,
     "heading_refs": [
      "回执里记了什么"
     ],
     "text_ref": "回执里记了什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "背后发生了什么"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n两轮我右/AI左对白已表达，source 要浅绿/白两色；dialogue 目前双方共用绿色变量，无按角色换白底模式。\n回执要求浅灰小票与等宽字，document_mock.paper 使用共享浅绿/常规Sans；灰底与真正ASCII等宽目前未消费。底部‘背后发生了什么’四步在同一浅绿外卡内，不能拆成四张大卡。",
   "unsupported_requirements": [
    "两轮我右/AI左对白已表达，source 要浅绿/白两色；dialogue 目前双方共用绿色变量，无按角色换白底模式。",
    "回执要求浅灰小票与等宽字，document_mock.paper 使用共享浅绿/常规Sans；灰底与真正ASCII等宽目前未消费。底部‘背后发生了什么’四步在同一浅绿外卡内，不能拆成四张大卡。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
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
   "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\img\\skill-md-to-pdf-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "ebeedcd896facfd1af9e0b5b28e5faf151361e1fe40c83443eab292fd4e32f07",
   "status": "ready",
   "source_box": [
    47,
    17,
    756,
    182
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 一个完整例子
真事：9 月 28 日写这页时实跑的，文稿是公开样例《项目简报》；AI 的回话是转述。

我：“这份简报转成 PDF，要正好 1 页，‘三项原则’这几个字必须在。”
AI：“好了，1 页，‘三项原则’在第 1 页；原文没被改动，用的是默认中性样式。”

我：“改成要求 2 页再试一次。”
AI：“没通过：实际 1 页，要求 2 页。上一份 1 页的 PDF 原样留着，没被换掉。”

**回执里记了什么**
状态：succeeded｜页数：1｜样式：neutral｜打印：Playwright｜原文未变：是｜联网：否
第二次：生成失败：PDF page count mismatch: actual=1, expected=2
两次之后 PDF 的指纹都是 2319f76a51d6…，文件夹里没有留下暂存文件。

**背后发生了什么**
1. AI 用登记好的 Python 运行转换入口，带上“要 1 页”“要有这几个字”两个要求。
2. 转换器先记下原文的 SHA-256 指纹，把 Markdown 转成网页，交给 Edge 打印到临时文件。
3. 查临时文件：确实是 PDF、读得开、没加密、页数和文字都对、原文指纹没变。
4. 第一次全过，换上正式文件；第二次页数不对，临时文件删掉，正式文件不动。

::screen{#skill-md-to-pdf-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-md-to-pdf-03",
  "section": "examples",
  "title": "样式从哪来",
  "scene": "横版：左上标题。三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。最下面一条横跨整屏的浅绿提示条。",
  "portrait": "竖版：标题；三张卡片上下排，每张插画在左、字在右；提示条在最下面。",
  "links": [
   {
    "text": "Typora 薄荷主题",
    "href": "/projects/typora-theme-pack/"
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
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose",
    "inline_link",
    "notice",
    "quote"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "notice",
    "chapter_title",
    "prose",
    "inline_link",
    "quote"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。最下面一条横跨整屏的浅绿提示条。",
    "portrait": "竖版：标题；三张卡片上下排，每张插画在左、字在右；提示条在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "默认：中性",
     "老绿色：只给老文稿",
     "项目自己的 CSS"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "上面一幅小水彩插画",
     "上），插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。最下面一条横跨整屏的浅绿提示条。",
   "portrait": "竖版：标题；三张卡片上下排，每张插画在左、字在右；提示条在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "样式从哪来"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png"
     ],
     "text_ref": "默认：中性"
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "文稿里自己写的样式默认保留；也可以让它忽略或者直接拒绝。代码块和注释里举例用的样"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n三张卡需中性白纸/老绿色纸/叠色CSS玻璃纸三幅卡内图，content_card 的 icons 自动候选不是逐卡大插画映射；必须按源图核对语义、横卡顶/竖左图。\n清单未登记这些完整原文的逐字一致毛笔标题图：样式从哪来；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "三张卡需中性白纸/老绿色纸/叠色CSS玻璃纸三幅卡内图，content_card 的 icons 自动候选不是逐卡大插画映射；必须按源图核对语义、横卡顶/竖左图。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：样式从哪来；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1
    },
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose",
    "inline_link",
    "notice",
    "quote"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "notice",
    "chapter_title",
    "prose",
    "inline_link",
    "quote"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。最下面一条横跨整屏的浅绿提示条。",
    "portrait": "竖版：标题；三张卡片上下排，每张插画在左、字在右；提示条在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "默认：中性",
     "老绿色：只给老文稿",
     "项目自己的 CSS"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "上面一幅小水彩插画",
     "上），插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。最下面一条横跨整屏的浅绿提示条。",
   "portrait": "竖版：标题；三张卡片上下排，每张插画在左、字在右；提示条在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "样式从哪来"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png"
     ],
     "text_ref": "默认：中性"
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "文稿里自己写的样式默认保留；也可以让它忽略或者直接拒绝。代码块和注释里举例用的样"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n三张卡需中性白纸/老绿色纸/叠色CSS玻璃纸三幅卡内图，content_card 的 icons 自动候选不是逐卡大插画映射；必须按源图核对语义、横卡顶/竖左图。\n清单未登记这些完整原文的逐字一致毛笔标题图：样式从哪来；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "三张卡需中性白纸/老绿色纸/叠色CSS玻璃纸三幅卡内图，content_card 的 icons 自动候选不是逐卡大插画映射；必须按源图核对语义、横卡顶/竖左图。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：样式从哪来；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1
    },
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "默认：中性 \n黑字、灰线、A4、页边约1.5厘米、正文12像素。表格每行不拆到两页，标题不孤零零落在页底。什么都不说，就是这个样子。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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
   "source_phrase": "老绿色：只给老文稿 \n早期一批项目说明用过绿色标题。那些文稿重新导出时才用它，不当所有PDF的统一风格。",
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打开门",
   "source_phrase": "项目自己的 CSS \n项目或文稿有自己的样子，就把它的CSS交给转换器，可以交好几份。Typora薄荷主题的原版、个人、公司三种样式就是这样接进来的。",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证码纸.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "验证码纸",
   "source_phrase": "三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。",
   "sha256": "bd4eda69465f07bad83182ac2761b2456d746bb31d62a1a112f1c6aef5ad85e3",
   "status": "ready",
   "original_elements": [
    "一张干净的白纸，只有黑色短线和细灰线"
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
   "asset": "_library/illustrations/验证码纸.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "验证码纸",
   "source_phrase": "三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。",
   "sha256": "bd4eda69465f07bad83182ac2761b2456d746bb31d62a1a112f1c6aef5ad85e3",
   "status": "ready",
   "original_elements": [
    "一张纸的标题位置为深绿色短线、引用条是浅绿"
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
   "asset": "_library/illustrations/ill-0d6222e9ef3715.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-0d6222e9ef3715",
   "source_phrase": "三张竖向卡片横排，每张上面一幅小水彩插画（1 一张干净的白纸，只有黑色标题和细灰线；2 一张纸的标题是深绿色、引用条是浅绿；3 一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上），插画下面卡片标题粗体，下面正文（第 3 张里“Typora 薄荷主题”画成绿色链接样式）。",
   "sha256": "6e35b91c62b34d888aed4b5830bedfe403d428159ce9c55587808380eb53f7ae",
   "status": "ready",
   "original_elements": [
    "一叠彩色玻璃纸（灰、薄荷绿、墨蓝）正被放到一张白纸上"
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
   "asset": "_library/titles/title-8beef6f183ec7cff9871.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8beef6f183ec7cff9871",
   "title_text": "样式从哪来",
   "sha256": "393a6feb6220af1337b53b18deac70b8d0757caf9058df75e55dc0ddb28c18cb",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 样式从哪来

**默认：中性**
黑字、灰线、A4、页边约 1.5 厘米、正文 12 像素。表格每行不拆到两页，标题不孤零零落在页底。什么都不说，就是这个样子。

**老绿色：只给老文稿**
早期一批项目说明用过绿色标题。那些文稿重新导出时才用它，不当所有 PDF 的统一风格。

**项目自己的 CSS**
项目或文稿有自己的样子，就把它的 CSS 交给转换器，可以交好几份。〔Typora 薄荷主题〕的原版、个人、公司三种样式，要用主题项目自己的导出入口。

文稿里自己写的样式默认保留；也可以让它忽略或者直接拒绝。代码块和注释里举例用的样式代码只当文字，不会被当成样式。

::screen{#skill-md-to-pdf-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-md-to-pdf-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。四组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "g-convert",
    "text": "转换"
   },
   {
    "id": "g-style",
    "text": "样式"
   },
   {
    "id": "g-check",
    "text": "交之前查"
   },
   {
    "id": "g-safe",
    "text": "不出乱子"
   },
   {
    "id": "f-single",
    "text": "单篇转换"
   },
   {
    "id": "f-batch",
    "text": "一个文件夹一起转"
   },
   {
    "id": "f-host-python",
    "text": "用登记好的 Python 跑"
   },
   {
    "id": "f-print-runtime",
    "text": "打印工具按登记找"
   },
   {
    "id": "f-neutral",
    "text": "默认中性样式"
   },
   {
    "id": "f-legacy-green",
    "text": "老绿色样式"
   },
   {
    "id": "f-project-css",
    "text": "套项目自己的 CSS"
   },
   {
    "id": "f-doc-style",
    "text": "文稿自带样式怎么办"
   },
   {
    "id": "f-page-break",
    "text": "手动分页"
   },
   {
    "id": "f-expected-pages",
    "text": "页数要求"
   },
   {
    "id": "f-require-text",
    "text": "必须有的字"
   },
   {
    "id": "f-missing-resource",
    "text": "缺图缺样式就失败"
   },
   {
    "id": "f-check-replace",
    "text": "查过才替换"
   },
   {
    "id": "f-no-network",
    "text": "默认不联网、不跑脚本"
   },
   {
    "id": "f-no-overwrite",
    "text": "不盖掉原文和样式"
   },
   {
    "id": "f-one-writer",
    "text": "同一份输出只让一个任务写"
   },
   {
    "id": "f-timeout",
    "text": "超时连进程一起停"
   },
   {
    "id": "f-receipt",
    "text": "回执"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "section_heading",
    "content_card",
    "prose",
    "icon",
    "status_legend",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "status_legend",
    "section_heading",
    "content_card",
    "chapter_title",
    "prose",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。四组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
    "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "转换",
     "样式",
     "交之前查",
     "不出乱子"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。四组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事（18项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用",
     "size": "small",
     "align": "left"
    },
    {
     "type": "prose",
     "text_ref": "在用＝9月的真实转换里确实起了作用（看回执）；待验收＝做好了，只在验证里跑过；说"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "转换"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1单篇转换一份.md转成一份PDF，中文文件名、中文内容都行在用2一个文件夹一起"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "样式"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "5默认中性样式黑字灰线、A4、表格行不拆页在用6老绿色样式早期项目说明的绿色标题"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "交之前查"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "10页数要求要求正好几页，实际页数不对就不交说不准11必须有的字列出必须能从PD"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "不出乱子"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "14默认不联网、不跑脚本网上的图和文稿里的脚本默认挡掉，可信文稿才明确打开在用1"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n四组18项按定稿全保留。状态列识别正常但当前仍画原状态字，源要求仅圆点需明确 data-text 模式；小号毛笔组名 size 字段 core 未消费。\nsource 四组横版一屏排完是不缩字的源要求，实际高度/安全分张须主代理出图后核对，本轮不声称已满足。\n清单未登记这些完整原文的逐字一致毛笔标题图：能做的事（18项）、转换、样式、交之前查、不出乱子；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 14 项，文字盘点预算 18 个图标位；差 4 个候选位（预算为盘点估计，不作已核实语义结论）。 qa-11 修复：转换/样式/交之前查/不出乱子为深绿粗体 section_heading，不占章标题大图；横版图例取消等宽网格，使用紧凑自然排列。",
   "unsupported_requirements": [
    "四组18项按定稿全保留。状态列识别正常但当前仍画原状态字，源要求仅圆点需明确 data-text 模式；小号毛笔组名 size 字段 core 未消费。",
    "source 四组横版一屏排完是不缩字的源要求，实际高度/安全分张须主代理出图后核对，本轮不声称已满足。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：能做的事（18项）、转换、样式、交之前查、不出乱子；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 14 项，文字盘点预算 18 个图标位；差 4 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 14
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 18,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "section_heading",
    "content_card",
    "prose",
    "icon",
    "status_legend",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "status_legend",
    "section_heading",
    "content_card",
    "chapter_title",
    "prose",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。四组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
    "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "转换",
     "样式",
     "交之前查",
     "不出乱子"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。四组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事（18项）"
    },
    {
     "type": "status_legend",
     "columns": 6,
     "portrait_columns": 3,
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "在用＝9月的真实转换里确实起了作用（看回执）；待验收＝做好了，只在验证里跑过；说"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "转换"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1单篇转换一份.md转成一份PDF，中文文件名、中文内容都行在用2一个文件夹一起"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "样式"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "5默认中性样式黑字灰线、A4、表格行不拆页在用6老绿色样式早期项目说明的绿色标题"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "交之前查"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "10页数要求要求正好几页，实际页数不对就不交说不准11必须有的字列出必须能从PD"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "不出乱子"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "14默认不联网、不跑脚本网上的图和文稿里的脚本默认挡掉，可信文稿才明确打开在用1"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n四组18项按定稿全保留。状态列识别正常但当前仍画原状态字，源要求仅圆点需明确 data-text 模式；小号毛笔组名 size 字段 core 未消费。\nsource 四组横版一屏排完是不缩字的源要求，实际高度/安全分张须主代理出图后核对，本轮不声称已满足。\n清单未登记这些完整原文的逐字一致毛笔标题图：能做的事（18项）、转换、样式、交之前查、不出乱子；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 14 项，文字盘点预算 18 个图标位；差 4 个候选位（预算为盘点估计，不作已核实语义结论）。 qa-11 修复：转换/样式/交之前查/不出乱子为深绿粗体 section_heading，不占章标题大图；横版图例取消等宽网格，使用紧凑自然排列。",
   "unsupported_requirements": [
    "四组18项按定稿全保留。状态列识别正常但当前仍画原状态字，源要求仅圆点需明确 data-text 模式；小号毛笔组名 size 字段 core 未消费。",
    "source 四组横版一屏排完是不缩字的源要求，实际高度/安全分张须主代理出图后核对，本轮不声称已满足。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：能做的事（18项）、转换、样式、交之前查、不出乱子；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 14 项，文字盘点预算 18 个图标位；差 4 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 14
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 18,
    "semantic_image_reviewed": false
   }
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
   "source_phrase": "单篇转换｜一份 .md 转成一份 PDF，中文文件名、中文内容都行｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "一个文件夹一起转｜文件夹里每份 .md 各出一份同名 PDF，最后报几份成功；只能用中性或老绿色样式｜说不准",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "用登记好的 Python 跑｜不管命令行里碰巧是哪个 python，都用电脑配置里登记的那一个｜在用",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "打印工具按登记找｜Node 和 Playwright 装在 E:\\Tools\\MD-PDF-Runtime，位置记在电脑配置里；登记或文件缺了就说缺哪一项，不去 Codex 的缓存里找｜待验收",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "默认中性样式｜黑字灰线、A4、表格行不拆页｜在用",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "老绿色样式｜早期项目说明的绿色标题，只给老文稿重新导出｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "套项目自己的 CSS｜交一份或几份 CSS，PDF 按它排｜说不准",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "文稿自带样式怎么办｜保留、忽略或拒绝三选一，默认保留；代码块里的样式示例不算｜在用",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "手动分页｜文稿里写 <!-- PDF_PAGE_BREAK --> 或 page-break 的 div，就在那里换页｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "页数要求｜要求正好几页，实际页数不对就不交｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "必须有的字｜列出必须能从 PDF 里读出的字，少一个就不交｜说不准",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "缺图缺样式就失败｜图片、样式只从文稿和 CSS 所在的文件夹读，加载不上就整份失败｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "查过才替换｜是 PDF、读得开、没加密、至少 1 页、原文和 CSS 指纹没变，全过才换上｜在用",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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
   "source_phrase": "默认不联网、不跑脚本｜网上的图和文稿里的脚本默认挡掉，可信文稿才明确打开｜在用",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "不盖掉原文和样式｜输出路径等于 Markdown 或 CSS 时直接拒绝｜在用",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "同一份输出只让一个任务写｜两个任务同时写同一个 PDF，后来的直接报错｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "超时连进程一起停｜默认 120 秒，最多 600 秒；超时把浏览器进程树一起结束｜在用",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 18,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "回执｜每次成功打印一份 JSON：原文和 PDF 的指纹、页数、样式、打印方式、资源文件夹｜在用",
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
   "asset": "_library/round2/title-colors/color-title-81b14f40fa6a8daf3002-b68874a45440.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-81b14f40fa6a8daf3002",
   "title_text": "能做的事（18 项）",
   "sha256": "8ebb09125d4730adfebad94a3ad2d43ed2263dbc79e8989408537fa992afbf84",
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
   "asset": "_library/titles/title-f58c8c2af813da1177f2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f58c8c2af813da1177f2",
   "title_text": "不出乱子",
   "sha256": "f6a146d52ea850dc957c69cbb3b48f35a0abcb3be5044a60982fd1ec186c845a",
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
   "asset": "_library/titles/title-a55102a037b32b34a342.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a55102a037b32b34a342",
   "title_text": "交之前查",
   "sha256": "e9775241a7af0507771d2e51f42cc5ee677c79188d9030e31fc4d2dcabd4e427",
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
   "asset": "_library/titles/title-c8ffbdf15754d1d22420.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c8ffbdf15754d1d22420",
   "title_text": "样式",
   "sha256": "3a9a0b2307e5e6e344da5cbd53ec2c99e02f1339552b0bc0f437375a510c64f0",
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
   "asset": "_library/titles/title-0b0d6cb3b2edb2dfbbac.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0b0d6cb3b2edb2dfbbac",
   "title_text": "转换",
   "sha256": "552cc0ed5f208037fe1c9a8010a9bb826a44283e23d3a17d7a43c83634d1d060",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 能做的事（18 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
在用＝9 月的真实转换里确实起了作用（看回执）；待验收＝做好了，只在验证里跑过；说不准＝AI 的会话记录最早只到 9 月 1 日，回执里又看不出这一项用没用。


**转换**
1. 单篇转换｜一份 .md 转成一份 PDF，中文文件名、中文内容都行｜在用
2. 一个文件夹一起转｜文件夹里每份 .md 各出一份同名 PDF，最后报几份成功；只能用中性或老绿色样式｜说不准
3. 用登记好的 Python 跑｜不管命令行里碰巧是哪个 python，都用电脑配置里登记的那一个｜在用
4. 打印工具按登记找｜Node 和 Playwright 装在 E:\Tools\MD-PDF-Runtime，位置记在电脑配置里；登记或文件缺了就说缺哪一项，不去 Codex 的缓存里找｜待验收

**样式**
5. 默认中性样式｜黑字灰线、A4、表格行不拆页｜在用
6. 老绿色样式｜早期项目说明的绿色标题，只给老文稿重新导出｜在用
7. 套项目自己的 CSS｜交一份或几份 CSS，PDF 按它排｜说不准
8. 文稿自带样式怎么办｜保留、忽略或拒绝三选一，默认保留；代码块里的样式示例不算｜在用
9. 手动分页｜文稿里写 <!-- PDF_PAGE_BREAK --> 或 page-break 的 div，就在那里换页｜在用

**交之前查**
10. 页数要求｜要求正好几页，实际页数不对就不交｜说不准
11. 必须有的字｜列出必须能从 PDF 里读出的字，少一个就不交｜说不准
12. 缺图缺样式就失败｜图片、样式只从文稿和 CSS 所在的文件夹读，加载不上就整份失败｜在用
13. 查过才替换｜是 PDF、读得开、没加密、至少 1 页、原文和 CSS 指纹没变，全过才换上｜在用

**不出乱子**
14. 默认不联网、不跑脚本｜网上的图和文稿里的脚本默认挡掉，可信文稿才明确打开｜在用
15. 不盖掉原文和样式｜输出路径等于 Markdown 或 CSS 时直接拒绝｜在用
16. 同一份输出只让一个任务写｜两个任务同时写同一个 PDF，后来的直接报错｜在用
17. 超时连进程一起停｜默认 120 秒，最多 600 秒；超时把浏览器进程树一起结束｜在用
18. 回执｜每次成功打印一份 JSON：原文和 PDF 的指纹、页数、样式、打印方式、资源文件夹｜在用

AI 写的说明、讲义、报告大多是 Markdown。这个技能告诉 AI 怎么把它转成 PDF：用这台电脑登记好的 Python，由 Playwright 驱动本机 Edge 按 A4 打印（Playwright 和 Node 单独装在 E:\Tools\MD-PDF-Runtime，也按电脑配置里的登记找，不再借 Codex 自带的运行环境）；打完先查——PDF 读得开、页数对、要求的字都在、原文和样式文件没被改——全过才替换旧文件，任何一样不过，旧 PDF 原样留着。转换成功不等于排版没问题，要看排版再交给PDF 逐页检查。

::screen{#skill-md-to-pdf-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-md-to-pdf-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两段话（其中“AI 规则与技能基座”画成绿色链接样式）。",
  "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。",
  "links": [
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
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
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "comparison",
    "icon",
    "bullet_list",
    "content_card",
    "notice",
    "inline_link"
   ],
   "portrait_component_order": [
    "notice",
    "chapter_title",
    "comparison",
    "icon",
    "bullet_list",
    "content_card",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两段话（其中“AI 规则与技能基座”画成绿色链接样式）。",
    "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "交给它",
     "不交给它 / 它不做"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两段话（其中“AI 规则与技能基座”画成绿色链接样式）。",
   "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "交给它"
      },
      {
       "text_ref": "不交给它 / 它不做"
      }
     ],
     "item_cards": true,
     "illustration": "left_inside",
     "text_ref": "交给它",
     "item_icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/文稿堆.png",
      "_library/icons/齿轮.png",
      "_library/icons/齿轮.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png"
     ],
     "align_items": "start"
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "查过只说明“这个PDF是这份原文、这个样式打出来的、页数和字对得上”，不说明每一"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n两栏各条短句需要逐条语义小图，comparison.item_cards 支持条目内行，但未给明确 item_icon_map，不能自动猜配；源底部‘最后两段’实际在定稿是一条 para，全部一次保留。\n清单未登记这些完整原文的逐字一致毛笔标题图：边界；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。 qa-11 接入现场新增的有效 comparison.align_items:start，左右原组卡各按内容高度收口，保留原两栏和原条目。",
   "unsupported_requirements": [
    "两栏各条短句需要逐条语义小图，comparison.item_cards 支持条目内行，但未给明确 item_icon_map，不能自动猜配；源底部‘最后两段’实际在定稿是一条 para，全部一次保留。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：边界；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\page.json",
   "source_sha256": "de4c9bdc124ee0da0d373b8acf2fe437e7b506a18ec1b0e48199271de21b761f",
   "desktop_component_order": [
    "chapter_title",
    "comparison",
    "icon",
    "bullet_list",
    "content_card",
    "notice",
    "inline_link"
   ],
   "portrait_component_order": [
    "notice",
    "chapter_title",
    "comparison",
    "icon",
    "bullet_list",
    "content_card",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两段话（其中“AI 规则与技能基座”画成绿色链接样式）。",
    "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "交给它",
     "不交给它 / 它不做"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两段话（其中“AI 规则与技能基座”画成绿色链接样式）。",
   "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "交给它"
      },
      {
       "text_ref": "不交给它 / 它不做"
      }
     ],
     "item_cards": true,
     "illustration": "left_inside",
     "text_ref": "交给它",
     "item_icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/文稿堆.png",
      "_library/icons/齿轮.png",
      "_library/icons/齿轮.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png"
     ]
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "查过只说明“这个PDF是这份原文、这个样式打出来的、页数和字对得上”，不说明每一"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n两栏各条短句需要逐条语义小图，comparison.item_cards 支持条目内行，但未给明确 item_icon_map，不能自动猜配；源底部‘最后两段’实际在定稿是一条 para，全部一次保留。\n清单未登记这些完整原文的逐字一致毛笔标题图：边界；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "两栏各条短句需要逐条语义小图，comparison.item_cards 支持条目内行，但未给明确 item_icon_map，不能自动猜配；源底部‘最后两段’实际在定稿是一条 para，全部一次保留。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：边界；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
    "semantic_image_reviewed": false
   }
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "Markdown 文稿要变成能打印、能发出去的 PDF",
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
   "source_phrase": "有硬要求：几页、哪些字必须在、图一张不能少",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "Markdown 文稿要变成能打印、能发出去的 PDF",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "有硬要求：几页、哪些字必须在、图一张不能少",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "已有一份好的 PDF，这次重导出不能把它弄坏",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "key": "齿轮",
   "source_phrase": "Word、PPT、Excel：用各自的工具",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "key": "齿轮",
   "source_phrase": "已经是 PDF 的文件改内容、拆分合并：用 PDF 工具",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "排得好不好看：样子由选的 CSS 定，它只保证照样打出来",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "看排版有没有乱：交给 PDF 逐页检查",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "key": "文件夹上传",
   "source_phrase": "转完提交、发邮件、上传、分享：转换不等于同意发出去",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "Markdown 文稿要变成能打印、能发出去的 PDF",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "有硬要求：几页、哪些字必须在、图一张不能少",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "已有一份好的 PDF，这次重导出不能把它弄坏",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "key": "齿轮",
   "source_phrase": "Word、PPT、Excel：用各自的工具",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "key": "齿轮",
   "source_phrase": "已经是 PDF 的文件改内容、拆分合并：用 PDF 工具",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "排得好不好看：样子由选的 CSS 定，它只保证照样打出来",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "看排版有没有乱：交给 PDF 逐页检查",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 18,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "key": "文件夹上传",
   "source_phrase": "转完提交、发邮件、上传、分享：转换不等于同意发出去",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
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

## 边界

**交给它**
- Markdown 文稿要变成能打印、能发出去的 PDF
- 有硬要求：几页、哪些字必须在、图一张不能少
- 已有一份好的 PDF，这次重导出不能把它弄坏

**不交给它 / 它不做**
- Word、PPT、Excel：用各自的工具
- 已经是 PDF 的文件改内容、拆分合并：用 PDF 工具
- 排得好不好看：样子由选的 CSS 定，它只保证照样打出来
- 看排版有没有乱：交给 PDF 逐页检查
- 转完提交、发邮件、上传、分享：转换不等于同意发出去

查过只说明“这个 PDF 是这份原文、这个样式打出来的、页数和字对得上”，不说明每一页都好看。它和 PDF 逐页检查是同一个插件里的两个技能，一起装进 Codex 和 Claude；插件怎么发布、装到各个 AI 上，见〔AI 规则与技能基座〕。
