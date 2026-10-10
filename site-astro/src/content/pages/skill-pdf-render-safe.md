---
{
 "title": "PDF 逐页检查",
 "kind": "skill",
 "url": "/skills/pdf-render-safe/",
 "tagline": "把 PDF 摊成一页页的图，让 AI 真的看一遍。",
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
  "page": "skill-pdf-render-safe",
  "kind": "skill",
  "title": "PDF 逐页检查",
  "url": "/skills/pdf-render-safe/",
  "tagline": "把 PDF 摊成一页页的图，让 AI 真的看一遍。",
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
   "file": "E:\\.agents\\plugins\\md-pdf-toolkit\\skills\\pdf-render-safe\\SKILL.md",
   "rules_release": "E187",
   "plugin_commit": "af000245235b7ebfd170d78b36036d882e4999ad"
  },
  "video_prompt": "5 秒无缝循环，白底水彩：一份 PDF 在桌上像扇子一样摊开，一页页落成整齐的网格；一枚放大镜缓缓滑过网格，停在一页的表格上，那一页轻轻放大一下又落回原位；桌角相框里的“复印件”始终不动。镜头不动，没有文字。",
  "registry": {
   "groups": [
    {
     "id": "g-look",
     "name": "看页面"
    },
    {
     "id": "g-tidy",
     "name": "不弄乱"
    },
    {
     "id": "g-guard",
     "name": "不出乱子"
    }
   ],
   "features": [
    {
     "id": "f-all-pages",
     "group": "g-look",
     "name": "每页转成图",
     "what": "整份 PDF 每页一张 PNG",
     "how": "“每页都看看”",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "render_pdf_safe.py 第 215–241 行；9 月会话记录至少 15 次"
    },
    {
     "id": "f-contact",
     "group": "g-look",
     "name": "缩略总览",
     "what": "所有页拼成一张图，默认 3 列、每张 420 像素宽，列数和宽度可调",
     "how": "自动带上",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "make_contact_sheet 第 262–292 行；9 月的真实检查几乎都带总览"
    },
    {
     "id": "f-select-pages",
     "group": "g-look",
     "name": "只看几页、放大看",
     "what": "写“2,5-7,last”这样的页码，只重转这几页",
     "how": "“第 3 页和最后一页放大看”",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "parse_page_selection 第 168–191 行；9 月有 3 次只转了 1–3 页"
    },
    {
     "id": "f-dpi",
     "group": "g-look",
     "name": "清晰度可调",
     "what": "72–600 DPI，默认 150",
     "how": "“这页放大到 240 看”",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "第 587 行；9 月用过 100、110、115、150"
    },
    {
     "id": "f-snapshot",
     "group": "g-tidy",
     "name": "先复制一份再看",
     "what": "复制到纯英文路径的临时文件夹再渲染，中文路径不出错；原件中途被改就不发布",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "render_pdf 第 421–438、489–494 行"
    },
    {
     "id": "f-generation",
     "group": "g-tidy",
     "name": "每次单独一版",
     "what": "图先放暂存文件夹，全部画完才整个改名成这一版；失败的半成品放进回收站",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "第 446–499、541–549 行"
    },
    {
     "id": "f-report",
     "group": "g-tidy",
     "name": "一份固定的报告",
     "what": "每次成功才更新同一个报告文件，记下原件指纹、页数、所选页、渲染器版本、DPI、每页尺寸和指纹",
     "how": "AI 按报告里的路径开图",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "第 501–537 行，schema md-pdf-toolkit.pdf-render-safe.v3"
    },
    {
     "id": "f-prune",
     "group": "g-tidy",
     "name": "默认留两版",
     "what": "保留这一版和上一版，成功后更早的放进回收站；只清理它自己认得的图片文件夹，别的文件不碰",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "prune_generations 第 377–396 行；delete_generation 第 352–366 行"
    },
    {
     "id": "f-keep-stale",
     "group": "g-tidy",
     "name": "全部保留",
     "what": "要前后对照时，一版都不删",
     "how": "“旧的都留着”",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "--keep-stale 第 602–608 行；9 月 26–27 日 7 次里 5 次用了"
    },
    {
     "id": "f-lock",
     "group": "g-guard",
     "name": "同一组图同时只一个在画",
     "what": "同一个文件夹、同一个前缀，第二个任务直接报错，不混在一起",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "prefix_lock 第 295–336 行"
    },
    {
     "id": "f-real-poppler",
     "group": "g-guard",
     "name": "只用真的渲染程序",
     "what": "只认 pdftoppm.exe 本体，拒绝 .bat、.cmd、.ps1 包装",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "find_pdftoppm 第 54–83 行；本机用 Codex 自带运行环境里的 Poppler 26.07.0"
    },
    {
     "id": "f-timeout",
     "group": "g-guard",
     "name": "有时限",
     "what": "每次 pdftoppm 最多 120 秒（1–600 可调）",
     "how": "自动",
     "status": "在用",
     "screen": "skill-pdf-render-safe-04",
     "source": "第 194–212、597–600 行"
    }
   ],
   "numbers": [
    {
     "id": "n-runs",
     "text": "至少 15 次",
     "meaning": "会话记录里去重后的真实渲染报告数（v2 8 份、v3 7 份），不含本页写稿时的 4 次",
     "as_of": "2026-09-28",
     "source": "Codex 会话记录 9 月 1–28 日、Claude 9 月 24–28 日；facts.md 第三节",
     "screens": [
      "skill-pdf-render-safe-03"
     ]
    },
    {
     "id": "n-page-range",
     "text": "1–46 页",
     "meaning": "这些报告里 source_page_count 的最小和最大值",
     "as_of": "2026-09-28",
     "source": "同上",
     "screens": [
      "skill-pdf-render-safe-03"
     ]
    },
    {
     "id": "n-dpi-range",
     "text": "100–150 DPI",
     "meaning": "这些报告里用过的 dpi",
     "as_of": "2026-09-28",
     "source": "同上",
     "screens": [
      "skill-pdf-render-safe-03"
     ]
    },
    {
     "id": "n-keep-stale",
     "text": "7 次里有 5 次",
     "meaning": "v3 报告里 retention=versioned-generations-preserved-by-request 的份数",
     "as_of": "2026-09-28",
     "source": "同上",
     "screens": [
      "skill-pdf-render-safe-03",
      "skill-pdf-render-safe-04"
     ]
    },
    {
     "id": "n-example",
     "text": "2 页、110 DPI、909 × 1287 像素",
     "meaning": "9 月 28 日例子的报告",
     "as_of": "2026-09-28",
     "source": "typora-theme-pack\\tmp\\render\\personal-sheet_report.json",
     "screens": [
      "skill-pdf-render-safe-02"
     ]
    },
    {
     "id": "n-features",
     "text": "12 项",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-09-28",
     "source": "本文件",
     "screens": [
      "skill-pdf-render-safe-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-md-to-pdf",
     "with": "skill:md-to-pdf",
     "direction": "被调用",
     "flow": "文稿转 PDF 的说明要求版面要紧时，转换后用本技能看；两者在同一个插件、共用一个入口脚本",
     "source": "md-to-pdf SKILL.md“Verification”；Invoke-MdPdfToolkit.ps1 render 分支"
    },
    {
     "id": "r-typora-theme-pack",
     "with": "typora-theme-pack",
     "direction": "被调用",
     "flow": "Typora 薄荷主题页的三张 PDF 样张就是用本技能转成图的",
     "source": "typora-theme-pack/facts.md 第四节"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "分工",
     "flow": "本技能只出图；图里的字要逐字读出来时交给本地文字识别",
     "source": "SKILL.md 第 35 行（渲染不证明语义完整）"
    },
    {
     "id": "r-codex-runtime",
     "with": "外部软件 Codex 桌面版",
     "direction": "拿来",
     "flow": "pdftoppm.exe 从 Codex 自带运行环境的 native\\poppler 目录找（PATH 上没有）",
     "source": "find_pdftoppm 第 54–83 行；报告 renderer 字段"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/skills/md-to-pdf/",
     "screen": "skill-pdf-render-safe-01",
     "text": "文稿转 PDF"
    },
    {
     "target": "/projects/localocr/",
     "screen": "skill-pdf-render-safe-05",
     "text": "本地文字识别"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "旧技能稿“字密的页单独放大再看”“检查表格、页眉页脚、签名和分页”“颜色太淡看不清的地方也会挑出来”三条是 AI 看图时的做法，并进“只看几页、放大看”和边界里的“交给它”。"
   ],
   "dropped": [
    "旧网站写“成功后才把更早版本移入 Windows 回收站”：9 月 24 日（af00024）起改成直接删除，按现行代码写“直接删掉”。",
    "SKILL.md 里“命令层拒绝删除时走回收站后备”那句：给 AI 的操作细节，读者不关心。"
   ],
   "unsure": [
    "这个技能不是 Typora 薄荷主题的入口，是通用的 PDF 检查工具；manifest 把它挂在 typora-theme-pack 下，按实际关系写成独立技能页。",
    "“默认留两版，更早的直接删掉”和约法 L13“不先尝试直接删除”说法不一：9 月 24 日这个技能从“进回收站”改成了直接删（只删它自己生成、认得出的图片文件夹）；本人 9 月另说过确认没用的东西可以直接删（决定记录第 507 行）。页面照现行代码写，是否合规请 Claude 定。",
    "第 1 屏五句“可以这样说”是替本人口吻写的，上线前请本人过目。",
    "第 2 屏 AI 的回复措辞是示意；“表头是灰色”这个发现是写稿时真实看出来的。",
    "“至少 15 次”：同一份报告被多次打印在记录里，按报告内容去重；两次完全相同参数的渲染可能被算成一次，所以写“至少”。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-pdf-render-safe/page.json",
  "sha256": "699d46612ea53e70681fbdfca5f721eb154544c877d65f068dddd0958f86f49c",
  "converted_at_beijing": "2026-10-10T09:06:30+08:00"
 }
}
---

::screen{#skill-pdf-render-safe-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-pdf-render-safe-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一份 PDF 像扇子一样摊开成一页页的图片，铺在一张桌上排成网格；一枚放大镜停在其中一页的表格上；桌角一个小相框里放着同一份 PDF 的“复印件”，表示先复制一份再看。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字（“文稿转 PDF”画成绿色链接样式）。",
  "portrait": "竖版：标题、副标题、说明从上往下；插画占满宽；五个对话气泡一行一个；最下面一行小字。",
  "links": [
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
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
     "text_ref": "PDF 逐页检查",
     "align": "left",
     "size": "large",
     "row": "k1a-head",
     "width": "fit-content(60%)"
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
     "text_ref": "把 PDF 一页页摊成图片",
     "align": "left",
     "row": "intro",
     "width": "47%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "53%"
    },
    {
     "type": "prose",
     "text_ref": "可以这样说："
    },
    {
     "type": "dialogue",
     "text_ref": "“这份 PDF",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "row_counts": [
      2,
      2,
      1
     ]
    },
    {
     "type": "prose",
     "text_ref": "PDF 是 Markdown"
    }
   ],
   "notes": "定稿优先，标题笔画保持原浓度。横版介绍左、插画右；对话按 1/2、3/4、5/末尾说明三排摆。竖版标题→副标题说明→插画→五条对话→末尾说明。所有小图均在气泡所属外框内的左侧，主插画在卡片外。无箭头或丝带。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "hero": {
     "illustration_inside_card": false,
     "title_alignment": "left",
     "title_size": "large"
    },
    "dialogue": {
     "rows": 3,
     "columns": 2,
     "label_in_first_bubble": true,
     "left_icon_count": 5,
     "inner_bubble": true
    },
    "footer": {
     "slot": "third-row-right",
     "link": "inline_from_final_text",
     "extra_arrow": false
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "PDF 逐页检查",
     "align": "center",
     "size": "large"
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
     "text_ref": "把 PDF 一页页摊成图片",
     "align": "left"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "可以这样说："
    },
    {
     "type": "dialogue",
     "text_ref": "“这份 PDF",
     "columns": 1,
     "split_paras": true,
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "PDF 是 Markdown"
    }
   ],
   "notes": "定稿优先，标题笔画保持原浓度。横版介绍左、插画右；对话按 1/2、3/4、5/末尾说明三排摆。竖版标题→副标题说明→插画→五条对话→末尾说明。所有小图均在气泡所属外框内的左侧，主插画在卡片外。无箭头或丝带。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "hero": {
     "illustration_inside_card": false,
     "title_alignment": "center",
     "title_size": "large"
    },
    "dialogue": {
     "rows": 5,
     "columns": 1,
     "label_in_first_bubble": true,
     "left_icon_count": 5,
     "inner_bubble": false
    },
    "footer": {
     "slot": "bottom-full-width",
     "link": "inline_from_final_text",
     "extra_arrow": false
    }
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
   "asset": "_library/illustrations/页面扇形网格核验.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "页面扇形网格核验",
   "source_phrase": "右边一幅水彩插画：一份 PDF 像扇子一样摊开成一页页的图片，铺在一张桌上排成网格；一枚放大镜停在其中一页的表格上；桌角一个小相框里放着同一份 PDF 的“复印件”，表示先复制一份再看。",
   "sha256": "5b248feb481e7689d5abe285a3346104fe6ce031e46a31d0f178d232f7e0228a",
   "status": "ready",
   "original_elements": [
    "一份 PDF 像扇子一样摊开成一页页的图片，铺在一张桌上排成网格；一枚放大镜停在其中一页的表格上；桌角一个小相框里放着同一份 PDF 的抽象图形，表示先复制一份再看"
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
   "asset": "skill-pdf-render-safe/skill-pdf-render-safe-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-pdf-render-safe\\img\\skill-pdf-render-safe-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7ea136b096b457e43aca",
   "title_text": "PDF 逐页检查",
   "sha256": "94aa9fba2e2b97aed1a7611cc39c5f279380014ecd31c2fe23043e83a657673b",
   "status": "ready",
   "source_box": [
    35,
    68,
    684,
    248
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# PDF 逐页检查
**把 PDF 一页页摊成图片，让 AI 真的看一遍排版。**

PDF 能打开、页数对，也可能有字被裁掉、表格挤出页边、某页空白或颜色太淡。把 PDF 交给 AI，它会给出逐页图片和总览，先看整体，再放大可疑页检查。全部页面生成完才更新报告；中途失败会保留上一次的结果。

可以这样说：
“这份 PDF 每一页都帮我看看排版有没有问题。”
“第 3 页和最后一页放大看，表格有没有被裁。”
“导出来的讲义先检查一遍再给我。”
“这份合同扫描件先出个总览，我看看有没有缺页。”
“签名那页的字太淡了没有？”

PDF 是 Markdown 转出来的，先用〔文稿转 PDF〕，再用它看。

::screen{#skill-pdf-render-safe-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-pdf-render-safe-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约 45% 宽一个带细浅绿边框的空位（竖长，约 2:1.45 的横向比例，贴两页并排的缩略总览截图），空位下一行小字说明。右边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），下面一张浅灰底的小卡片“报告里记了什么”，几行等宽字（照 text 逐字画）。最下面一张横向浅绿卡片写“背后发生了什么”四步。\n仅02横图在标题下完整恢复来源句“9 月 28 日写“Typora 薄荷主题”那页时实跑的：个人版样张 PDF，2 页。”，不改原text。截图框下保完整原截图说明，其余对话、报告和四步原字全部保持。框的数学比值不单列重画理由；当前截图等比展示可沿用，caption锚登记由根另行归位。",
  "portrait": "竖版：标题；截图空位占满宽，说明在下；对话；报告卡片；“背后发生了什么”在最下面。\n仅02-v既有第1张恢复完整图注“截图说明：这次生成的缩略总览，两页并排”，置于本张白框紧下方。标题、来源日期页数整句、我/AI对话和报告三条全保；本张不含“背后发生了什么”四步，后续正确02-v2完全保持。保当前框占位及真实总览等比完整展示，不为数学框比另行重构；caption锚定位单独归位。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/66988c9735a2214e7035767553a0f378e7d4a4f217283296c855aa07e3b04bd0.png",
    "where": "左边约 45% 宽的空位",
    "caption": "截图说明：这次生成的缩略总览，两页并排",
    "frame_bindings": {
     "v": {
      "489CEC293473D41BA4DDF3C99E47958B8678835B2441685F33351D7EC14C0B75": [
       25,
       185,
       916,
       688
      ]
     }
    },
    "crop_h": [
     0,
     0,
     888,
     484
    ],
    "crop_v": [
     0,
     0,
     888,
     498
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
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "真事：",
     "align": "left"
    },
    {
     "type": "screenshot",
     "text_ref": "截图说明：",
     "row": "example",
     "width": "45%",
     "indices": [
      0
     ],
     "ratio": "747:409",
     "columns": 1,
     "text_position": "after"
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "row": "example",
     "width": "55%",
     "columns": 1,
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "text_ref": "AI：",
     "row": "example",
     "columns": 1,
     "sides": [
      "left"
     ],
     "tail": true,
     "illustration": "outside"
    },
    {
     "type": "monospace",
     "text_ref": "报告里记了什么",
     "row": "example",
     "align": "left"
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "先把 PDF",
     "columns": 4,
     "connector": "none",
     "illustration": "none",
     "icons": "none",
     "direction": "horizontal"
    }
   ],
   "notes": "整屏章节标题按统一标准居中；来源句完整位于标题下。左45%截图及图注，右55%我/AI气泡和报告；人物在气泡外（我在右、AI在左）。底部同一整宽浅绿外框内，组名上、四步单排，步间仅绿色右箭头，无丝带。截图块定位图注，提前摆到左栏，产生一条非顺序定位提醒是已知的空间排序例外，不得重复图注。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "example": {
     "left": [
      "screenshot",
      "caption"
     ],
     "right": [
      "user_bubble",
      "ai_bubble",
      "report_card"
     ],
     "speaker_art_outside": true
    },
    "steps": {
     "outer_card": true,
     "heading_above": true,
     "rows": 1,
     "columns": 4,
     "badge": "above-left-of-icon",
     "icon_left_of_text": true
    },
    "screenshot": {
     "frame_box_source_px": [
      32,
      173,
      779,
      582
     ],
     "preserve_current_frame": true,
     "caption_immediately_below": true
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "真事：",
     "align": "left"
    },
    {
     "type": "screenshot",
     "text_ref": "截图说明：",
     "indices": [
      0
     ],
     "ratio": "891:503",
     "columns_v": 1,
     "text_position": "after"
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "dialogue",
     "text_ref": "AI：",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "left"
     ],
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "monospace",
     "text_ref": "报告里记了什么",
     "align": "left"
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "先把 PDF",
     "columns_v": 1,
     "connector": "none",
     "illustration": "none",
     "icons": "none",
     "columns": 1,
     "direction": "vertical"
    }
   ],
   "notes": "连接02-v与批准02-v2看完整屏。第一张标题→截图空槽→紧下图注→完整来源句→我左上/AI右下气泡→报告；第二张只含居中“背后发生了什么”与四张整宽步骤卡。批准第二张左侧是大编号绿圆和叶子，右侧正文，没有四个实物图标，也没有连接带或箭头。text_ref图注先摆到截图后，定稿切片仍唯一；来源句和图注视觉调序会产生定位提醒。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "parts": {
     "count": 2,
     "break_before": "背后发生了什么",
     "repeat_chapter_title": false,
     "repeat_source": false
    },
    "screenshot": {
     "frame_box_source_px": [
      25,
      185,
      916,
      688
     ],
     "caption_immediately_below": true,
     "preserve_current_frame": true
    },
    "steps": {
     "left_number_roundel": true,
     "left_roundel_fraction": 0.3,
     "right_text_fraction": 0.65,
     "rows": 4,
     "connector": "none",
     "illustration": "none"
    }
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
   "asset": "_library/round3/titles/title-r3-1bd7ab40a6647c38f32a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-pdf-render-safe\\img\\skill-pdf-render-safe-02-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "2304e84af71ae809ed22525bb17a83cdc977e8073e268216601e3a099b2b6fc4",
   "status": "ready",
   "source_box": [
    20,
    39,
    581,
    220
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 一个完整例子
真事：9 月 28 日写“Typora 薄荷主题”那页时实跑的：个人版样张 PDF，2 页。

我：“这份 PDF 看一下排版。”
AI：“2 页都完整，没有裁切和重叠。有一处和预期不一样：第 1 页表格的表头是灰色，编辑器和预览里是浅绿。原因是转换器的默认样式盖住了主题的表头颜色，PDF 本身没坏。”

截图说明：这次生成的缩略总览，两页并排

**报告里记了什么**
状态：succeeded｜源文件页数：2｜所选页：1、2｜清晰度：110 DPI
每页图：909 × 1287 像素，各带 SHA-256 指纹
渲染器：pdftoppm version 26.07.0｜源文件前后指纹一致：是

**背后发生了什么**
1. 先把 PDF 复制到一个纯英文路径的临时文件夹，复制完核对指纹和大小，确认复制的就是原件。
2. pdftoppm 按 110 DPI 把两页转成 PNG，再拼一张总览。
3. 所有图先放进一个暂存文件夹，画完再核一次原件指纹，然后整个改名成这一版的文件夹。
4. 最后一步才更新报告，让它指向这一版；AI 按报告里的路径打开图来看。

::screen{#skill-pdf-render-safe-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-pdf-render-safe-03",
  "section": "examples",
  "title": "平时它在干什么",
  "scene": "横版：左上标题。左边一列三个大数字（大号绿色数字，下面一行小字）；右边三张横向小卡片上下排，每张左边一个小水彩图标（一叠从薄到厚的纸、一枚放大镜对着一页、一个带锁的抽屉），右边粗体一句加小字。最下面一行灰色小字。",
  "portrait": "竖版：标题；三个大数字一行一个；三张卡片一行一张；灰色小字在最下面。",
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
     "text_ref": "平时它在干什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "stat_card",
     "text_ref": "至少 15 次",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none",
     "row": "usage",
     "width": "40%"
    },
    {
     "type": "stat_card",
     "text_ref": "1–46 页",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none",
     "row": "usage"
    },
    {
     "type": "stat_card",
     "text_ref": "100–150 DPI",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none",
     "row": "usage"
    },
    {
     "type": "content_card",
     "text_ref": "先全看，再挑页",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-3507c76f7b8f1bd14623.png"
     ],
     "row": "usage",
     "width": "60%"
    },
    {
     "type": "content_card",
     "text_ref": "要留底时全部保留",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-18b716c35bffea8ccf40.png"
     ],
     "row": "usage"
    },
    {
     "type": "content_card",
     "text_ref": "被查的在哪",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-8ab446b034f90327f28b.png"
     ],
     "row": "usage"
    },
    {
     "type": "prose",
     "text_ref": "会话记录最早只到",
     "align": "center"
    }
   ],
   "notes": "横版标题与三个数字纵向组成左40%栏，三张横向内容卡纵向组成右60%栏。竖版标题整宽居中，然后三个大数字逐个纵排，再三张整宽卡。数字无外框，置于淡绿笔刷底；内容卡插画在左侧卡内、右侧标题和正文。末尾灰色说明居中，无箭头丝带。定稿数字和卡片写法解析为para，组件须识别这些完整原文节点，不能偷偷改定稿。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "stats": {
     "rows": 3,
     "columns": 1,
     "outer_card": false,
     "numeric_token_before_fullwidth_pipe": true,
     "value_size": "large",
     "caption_below": true
    },
    "cards": {
     "rows": 3,
     "columns": 1,
     "icons_left_inside": true,
     "title_size": "medium"
    },
    "footer": {
     "full_width": true,
     "gray": true
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时它在干什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "stat_card",
     "text_ref": "至少 15 次",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none"
    },
    {
     "type": "stat_card",
     "text_ref": "1–46 页",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none"
    },
    {
     "type": "stat_card",
     "text_ref": "100–150 DPI",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none"
    },
    {
     "type": "content_card",
     "text_ref": "先全看，再挑页",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-3507c76f7b8f1bd14623.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "要留底时全部保留",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-18b716c35bffea8ccf40.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "被查的在哪",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-8ab446b034f90327f28b.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "会话记录最早只到",
     "align": "center"
    }
   ],
   "notes": "横版标题与三个数字纵向组成左40%栏，三张横向内容卡纵向组成右60%栏。竖版标题整宽居中，然后三个大数字逐个纵排，再三张整宽卡。数字无外框，置于淡绿笔刷底；内容卡插画在左侧卡内、右侧标题和正文。末尾灰色说明居中，无箭头丝带。定稿数字和卡片写法解析为para，组件须识别这些完整原文节点，不能偷偷改定稿。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。",
   "layout_details": {
    "stats": {
     "rows": 3,
     "columns": 1,
     "outer_card": false,
     "numeric_token_before_fullwidth_pipe": true,
     "value_size": "large",
     "caption_below": true
    },
    "cards": {
     "rows": 3,
     "columns": 1,
     "icons_left_inside": true,
     "title_size": "medium"
    },
    "footer": {
     "full_width": true,
     "gray": true
    }
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一叠从薄到厚的纸",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一枚放大镜对着一页",
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件柜",
   "source_phrase": "一个带锁的抽屉",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "skill-pdf-render-safe/skill-pdf-render-safe-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-pdf-render-safe\\img\\skill-pdf-render-safe-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2d9f9be76cdd463c3a93",
   "title_text": "平时它在干什么",
   "sha256": "5724770d3f09e43799722e592ca24a6c012d5b98bddbeb6e07d6c8a29939aa32",
   "status": "ready",
   "source_box": [
    39,
    77,
    663,
    243
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 平时它在干什么

至少 15 次｜真实检查（9 月 15–27 日，Codex 的会话记录）
1–46 页｜被查的 PDF 页数
100–150 DPI｜用过的清晰度

**先全看，再挑页**｜多数时候先把所有页转一遍、出总览；有几次只重转其中 1–3 页细看。
**要留底时全部保留**｜9 月 26–27 日的 7 次里有 5 次让它保留所有旧版本，方便前后对照。
**被查的在哪**｜分三类地方：AI 的临时文件夹（E 盘 Cache 下）、Codex 放在“文档”里的工作文件夹、项目文件夹。多是 AI 刚做出来、准备交出去的文件。

会话记录最早只到 9 月 1 日；写这页时另外跑了 4 次，没算在里面。

::screen{#skill-pdf-render-safe-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-pdf-render-safe-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。三组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：标题、图例和说明在最上面；组名在上，卡片一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "g-look",
    "text": "看页面"
   },
   {
    "id": "g-tidy",
    "text": "不弄乱"
   },
   {
    "id": "g-guard",
    "text": "不出乱子"
   },
   {
    "id": "f-all-pages",
    "text": "每页转成图"
   },
   {
    "id": "f-contact",
    "text": "缩略总览"
   },
   {
    "id": "f-select-pages",
    "text": "只看几页、放大看"
   },
   {
    "id": "f-dpi",
    "text": "清晰度可调"
   },
   {
    "id": "f-snapshot",
    "text": "先复制一份再看"
   },
   {
    "id": "f-generation",
    "text": "每次单独一版"
   },
   {
    "id": "f-report",
    "text": "一份固定的报告"
   },
   {
    "id": "f-prune",
    "text": "默认留两版"
   },
   {
    "id": "f-keep-stale",
    "text": "全部保留"
   },
   {
    "id": "f-lock",
    "text": "同一组图同时只一个在画"
   },
   {
    "id": "f-real-poppler",
    "text": "只用真的渲染程序"
   },
   {
    "id": "f-timeout",
    "text": "有时限"
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
     "text_ref": "能做的事（12 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "看页面",
     "columns": 3,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    },
    {
     "type": "feature_card",
     "text_ref": "不弄乱",
     "columns": 3,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    },
    {
     "type": "feature_card",
     "text_ref": "不出乱子",
     "columns": 3,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    }
   ],
   "notes": "横版实际原图三组是单排4/5/3列，不按scene泛称三列套版。标题左47%，图例和说明同卡置右53%；每组组名左对齐压在外框上沿，下方全组一排。竖版01张含总标题、图例说明、看页面1–4；批准v2接不弄乱5–9、不出乱子10–12，无重复总标题图例。所有图标卡内左侧；功能名称中档粗绿；状态圆点与状态词在每卡右上；没有流程连接。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_details": {
    "groups": {
     "card_counts": [
      4,
      5,
      3
     ],
     "horizontal_columns": [
      4,
      5,
      3
     ],
     "vertical_columns": 1,
     "group_heading_align": "left",
     "group_heading_size": "medium",
     "group_frame": true
    },
    "features": {
     "status_top_right": true,
     "name_and_number_same_line": true,
     "icon_left_inside": true,
     "body_below_name": true
    },
    "parts": {
     "count": 1,
     "break_before": null,
     "repeat_chapter_title": false,
     "repeat_legend": false
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事（12 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "看页面",
     "columns": 1,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    },
    {
     "type": "feature_card",
     "text_ref": "不弄乱",
     "columns": 1,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    },
    {
     "type": "feature_card",
     "text_ref": "不出乱子",
     "columns": 1,
     "portrait_columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "last_row": "fill"
    }
   ],
   "notes": "横版实际原图三组是单排4/5/3列，不按scene泛称三列套版。标题左47%，图例和说明同卡置右53%；每组组名左对齐压在外框上沿，下方全组一排。竖版01张含总标题、图例说明、看页面1–4；批准v2接不弄乱5–9、不出乱子10–12，无重复总标题图例。所有图标卡内左侧；功能名称中档粗绿；状态圆点与状态词在每卡右上；没有流程连接。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_details": {
    "groups": {
     "card_counts": [
      4,
      5,
      3
     ],
     "horizontal_columns": [
      4,
      5,
      3
     ],
     "vertical_columns": 1,
     "group_heading_align": "left",
     "group_heading_size": "medium",
     "group_frame": false
    },
    "features": {
     "status_top_right": true,
     "name_and_number_same_line": true,
     "icon_left_inside": true,
     "body_below_name": true
    },
    "parts": {
     "count": 2,
     "break_before": "不弄乱",
     "repeat_chapter_title": false,
     "repeat_legend": false
    }
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "每页转成图｜整份 PDF 每页一张 PNG｜在用",
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
   "asset": "_library/icons/late-r3-pdf-nine-grid.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-pdf-nine-grid",
   "source_phrase": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。三组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "sha256": "1c2f87433f5c410810152850e359478dd31b61d096e5221e9d0b016e300b6a9b",
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
   "source_phrase": "只看几页、放大看｜写“2,5-7,last”这样的页码，只重转这几页｜在用",
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
   "asset": "_library/icons/late-r3-pdf-clarity-slider.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-pdf-clarity-slider",
   "source_phrase": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。三组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "sha256": "368218ff21972645458363961704dc9f4c1ba596d532388f379d50dec09089df",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "先复制一份再看｜复制到纯英文路径的临时文件夹再渲染，中文路径不出错；原件中途被改就不发布｜在用",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "每次单独一版｜图先放暂存文件夹，全部画完才整个改名成这一版；失败的半成品放进回收站｜在用",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "一份固定的报告｜每次成功才更新同一个报告文件，记下原件指纹、页数、所选页、渲染器版本、DPI、每页尺寸和指纹｜在用",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
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
   "source_phrase": "默认留两版｜保留这一版和上一版，成功后更早的放进回收站；只清理它自己认得的图片文件夹，别的文件不碰｜在用",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-pdf-versions-compare.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-pdf-versions-compare",
   "source_phrase": "横版：和项目页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，下面一行图例和一行小字。三组一屏排完。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
   "sha256": "b783c67983527d793dff1b5fff73ebc626b035ac8e50c1dc45f12fbaf656e30b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "同一组图同时只一个在画｜同一个文件夹、同一个前缀，第二个任务直接报错，不混在一起｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "只用真的渲染程序｜只认 pdftoppm.exe 本体，拒绝 .bat、.cmd、.ps1 包装｜在用",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "有时限｜每次 pdftoppm 最多 120 秒（1–600 可调）｜在用",
   "sha256": "2e461b29cf52358c1e39e7e7a1960c8761fec83d1c3f75aa0938890b50be1012",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-f635b114eb061de827b6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f635b114eb061de827b6",
   "title_text": "能做的事（12 项）",
   "sha256": "efb7bdaf9b1b0f610238d66a16ef20c78793d74015e2cd869f6bdc2931838be1",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 能做的事（12 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
在用＝9 月的真实检查里确实用到了。


**看页面**
1. 每页转成图｜整份 PDF 每页一张 PNG｜在用
2. 缩略总览｜所有页拼成一张图，默认 3 列、每张 420 像素宽，列数和宽度可调｜在用
3. 只看几页、放大看｜写“2,5-7,last”这样的页码，只重转这几页｜在用
4. 清晰度可调｜72–600 DPI，默认 150｜在用

**不弄乱**
5. 先复制一份再看｜复制到纯英文路径的临时文件夹再渲染，中文路径不出错；原件中途被改就不发布｜在用
6. 每次单独一版｜图先放暂存文件夹，全部画完才整个改名成这一版；失败的半成品放进回收站｜在用
7. 一份固定的报告｜每次成功才更新同一个报告文件，记下原件指纹、页数、所选页、渲染器版本、DPI、每页尺寸和指纹｜在用
8. 默认留两版｜保留这一版和上一版，成功后更早的放进回收站；只清理它自己认得的图片文件夹，别的文件不碰｜在用
9. 全部保留｜要前后对照时，一版都不删｜在用

**不出乱子**
10. 同一组图同时只一个在画｜同一个文件夹、同一个前缀，第二个任务直接报错，不混在一起｜在用
11. 只用真的渲染程序｜只认 pdftoppm.exe 本体，拒绝 .bat、.cmd、.ps1 包装｜在用
12. 有时限｜每次 pdftoppm 最多 120 秒（1–600 可调）｜在用

PDF 能打开、页数对，也可能有字被裁掉、表格挤出页边、某页空白、颜色淡得看不清——光看命令说“成功”发现不了。这个技能让 AI 先把 PDF 复制一份，再用 Poppler 的 pdftoppm 把每页转成 PNG，外加一张所有页的缩略总览；AI 先看总览找节奏，再把可疑的几页放大重转一遍细看。每次的图单独放一版，全部画完才更新报告，中途出错也不会弄乱上一次的结果。

::screen{#skill-pdf-render-safe-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-pdf-render-safe-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后一段话（“本地文字识别”画成绿色链接样式）。",
  "portrait": "竖版：标题；两栏改成上下两组，每条一行；提示条在最下面。",
  "links": [
   {
    "text": "本地文字识别",
    "href": "/projects/localocr/"
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
     "text_ref": "边界",
     "align": "center",
     "size": "large",
     "row_v": true
    },
    {
     "type": "comparison",
     "text_ref": "交给它",
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
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "image_mode": "none"
    },
    {
     "type": "notice",
     "text_ref": "平时交给我的是 PDF 本身",
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png"
     ]
    }
   ],
   "notes": "05-h使用批准替换图。横竖标题左、主插画右，在两组内容卡外；不能把主插画省掉或塞进卡内。横版交给它左3条、它不做右4条，两组分别有浅绿外框、左上中档毛笔组名；竖版两组上下排，每条独立整宽横卡，左图标、右圆点及正文。底部提示条整宽，左PDF纸页图标、右正文。链接仅出现在右组第3条，不移到底部，也不加定稿没有的箭头。无连接带。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_details": {
    "header": {
     "side_by_side_both_orientations": true,
     "art_outside_card": true,
     "title_left": true,
     "illustration_right": true
    },
    "comparison": {
     "columns": 2,
     "groups_item_counts": [
      3,
      4
     ],
     "outer_frames": true,
     "inner_item_cards": true,
     "icons_per_item": [
      3,
      4
     ],
     "group_title_align": "left",
     "group_title_size": "medium"
    },
    "notice": {
     "full_width": true,
     "icon_left_inside": true,
     "bold_body": true,
     "link_location": "right-group-item-3"
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large",
     "row_v": true
    },
    {
     "type": "comparison",
     "text_ref": "交给它",
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
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "image_mode": "none"
    },
    {
     "type": "notice",
     "text_ref": "平时交给我的是 PDF 本身",
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png"
     ]
    }
   ],
   "notes": "05-h使用批准替换图。横竖标题左、主插画右，在两组内容卡外；不能把主插画省掉或塞进卡内。横版交给它左3条、它不做右4条，两组分别有浅绿外框、左上中档毛笔组名；竖版两组上下排，每条独立整宽横卡，左图标、右圆点及正文。底部提示条整宽，左PDF纸页图标、右正文。链接仅出现在右组第3条，不移到底部，也不加定稿没有的箭头。无连接带。；本轮仅文字续审：五句逐段拆泡、横2列竖1列，竖版我在右AI在左、来源句在截图前，功能卡横3列竖1列；数字段 stat_card 支持待组件核验。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_details": {
    "header": {
     "side_by_side_both_orientations": true,
     "art_outside_card": true,
     "title_left": true,
     "illustration_right": true
    },
    "comparison": {
     "columns": 1,
     "groups_item_counts": [
      3,
      4
     ],
     "outer_frames": true,
     "inner_item_cards": true,
     "icons_per_item": [
      3,
      4
     ],
     "group_title_align": "left",
     "group_title_size": "medium"
    },
    "notice": {
     "full_width": true,
     "icon_left_inside": true,
     "bold_body": true,
     "link_location": "right-group-item-3"
    }
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "交出去之前，看 PDF 每一页的样子",
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
   "source_phrase": "找裁切、重叠、挤出页边、空白页、太淡的字、断掉的表格、页眉页脚和分页错",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "交给它",
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
   "source_phrase": "交给它",
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
   "source_phrase": "不交给它/它不做",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "平时交给我的是PDF本身；页面图和总览只是检查用的，我要图时才给图。",
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
   "asset": "_library/round3/titles/title-r3-7a7e13ca96796233d6be.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r2\\state\\b1-skill-pdf-render-safe-05-h\\round-01\\candidate-2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "source_box": [
    32,
    32,
    254,
    214
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 边界

**交给它**
- 交出去之前，看 PDF 每一页的样子
- 找裁切、重叠、挤出页边、空白页、太淡的字、断掉的表格、页眉页脚和分页错
- 只想重看其中几页

**不交给它 / 它不做**
- 改 PDF：它只读，一个字节都不改
- 判断内容对不对、字全不全：页数和必须有的字由做 PDF 的那一步查
- 把图里的字读出来：交给〔本地文字识别〕
- 替 AI 下结论：图画出来了不等于看过了，AI 要真的打开总览和页面图

平时交给我的是 PDF 本身；页面图和总览只是检查用的，我要图时才给图。
