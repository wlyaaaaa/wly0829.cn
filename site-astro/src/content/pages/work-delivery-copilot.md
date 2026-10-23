---
{
 "title": "工作支持与交付",
 "kind": "project",
 "url": "/projects/work-delivery-copilot/",
 "tagline": "帮我办工作的事，做出有出处、前后一致的交付文件",
 "old_urls": [
  "/projects/work-delivery/"
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
  "page": "work-delivery-copilot",
  "kind": "project",
  "title": "工作支持与交付",
  "url": "/projects/work-delivery-copilot/",
  "tagline": "帮我办工作的事，做出有出处、前后一致的交付文件",
  "status": "偶尔用",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-20 15:16"
   },
   "facts": [],
   "as_of": "2026-10-21",
   "source": "AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
  },
  "public": false,
  "repo_url": null,
  "capability": "做有出处、跟得上资料变化的工作文件",
  "based_on": {
   "commit": "7a8d0e5038a1da2f3e84e480a575ed937589255d",
   "commit_time": "2026-09-29T01:16:50+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的水彩插画出发：桌上三张资料纸上的绿色荧光笔划线轻轻发亮，三根细绿丝线从划线处缓缓流向右边的三份成品（装订文档、小演示屏、跟踪表），丝线上有小光点来回流动；表格那张资料一角被风掀起，露出下面的新版本，其中一根丝线由绿慢慢变成浅黄并轻轻松开，其余丝线保持绿色、继续流动；几片水彩绿叶缓缓飘落。全程不出现文字。",
  "registry": {
   "groups": [
    {
     "id": "g-daily",
     "name": "日常"
    },
    {
     "id": "g-package",
     "name": "建包和核事实"
    },
    {
     "id": "g-deliver",
     "name": "出文件"
    },
    {
     "id": "g-change",
     "name": "资料换版"
    }
   ],
   "features": [
    {
     "id": "f-daily-support",
     "group": "g-daily",
     "name": "日常工作支持",
     "what": "工作上的一次性问题：看材料、理思路、审方案、改文件，直接办完，不建包",
     "how": "直接跟 AI 说工作目标，把手头材料给它",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "README.md:3–4；AGENTS.md:5；技能 SKILL.md:12–17"
    },
    {
     "id": "f-package",
     "group": "g-package",
     "name": "明确建包",
     "what": "要长期维护的交付才建：点名 2–5 份资料，给固定的包名、标题和目标；同一个包名不能建两次",
     "how": "说明要长期维护什么、用哪几份资料",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:40–47、116–131；batch.py:94–95、307–315"
    },
    {
     "id": "f-snapshot",
     "group": "g-package",
     "name": "来源快照",
     "what": "每份资料存原样副本和指纹，换版时多存一版、旧版留着；只读点名的文件",
     "how": "指定哪几份资料可以当依据",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:49–55；store.py:350–398、663–699"
    },
    {
     "id": "f-fact-review",
     "group": "g-package",
     "name": "事实审阅",
     "what": "每条事实钉在原文哪一句；分出已确认、假设、互相矛盾、过期；金额日期存精确值；每次决定写理由、留记录",
     "how": "请 AI 核对关键数字、日期和说法，冲突由我定",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:57–87；store.py:719–950、1019–1058、1218–1270"
    },
    {
     "id": "f-same-version",
     "group": "g-deliver",
     "name": "同版文件",
     "what": "同一版事实出 PRD 文本、事实清单、追溯表，以及 Word、演示、表格；只要其中一种就只出那一种",
     "how": "事实确认后说这一轮要哪几份文件",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:89–92、102–114；compiler.py:135–197；artifacts.py:26–30、249–328"
    },
    {
     "id": "f-verify",
     "group": "g-deliver",
     "name": "文件验真",
     "what": "出正式文件前从数据库重算事实清单、逐字段核对；缺项、冲突、过期时只出“待确认草稿”",
     "how": "交付前请 AI 核对当前这一版",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:94–100、240–250；compiler.py:54–119、226–285；artifacts.py:66–114、331–360"
    },
    {
     "id": "f-impact",
     "group": "g-change",
     "name": "变更影响",
     "what": "交进新版资料，列出哪些事实失效、哪些自动接上新版、哪几版文件过期；没用到这份资料的不动",
     "how": "给出新版资料，请 AI 对照旧版",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "cli.py:133–145；store.py:400–619、1185–1213"
    },
    {
     "id": "f-next-version",
     "group": "g-change",
     "name": "差异续版",
     "what": "处理完失效的事实再出下一版，放新目录；旧版原样留着，变更和决定记录写清改了哪些（不生成逐字对比文件）",
     "how": "确认受影响的事实后，让 AI 出下一版",
     "status": "待验收",
     "screen": "work-delivery-copilot-09",
     "source": "product-contract.md:34；compiler.py:202–224；store.py:1062–1100"
    }
   ],
   "numbers": [
    {
     "id": "n-sources",
     "text": "2–5 份",
     "meaning": "一个交付包的来源份数上下限（新建时校验）",
     "as_of": "2026-09-28",
     "source": "batch.py:94–95；product-contract.md:28；SKILL.md:14",
     "screens": [
      "work-delivery-copilot-01",
      "work-delivery-copilot-02"
     ]
    },
    {
     "id": "n-files",
     "text": "6 个文件",
     "meaning": "一个构建的全部交付文件：PRD.md、manifest.json、traceability.csv、三种 Office 文件",
     "as_of": "2026-09-28",
     "source": "compiler.py:186–190；artifacts.py:26–30",
     "screens": [
      "work-delivery-copilot-01",
      "work-delivery-copilot-06"
     ]
    },
    {
     "id": "n-docx-time",
     "text": "0.48 秒",
     "meaning": "合成样例 batch（建包、存资料、登记事实、核心文件、Word）程序机械阶段用时，不含 AI 分析",
     "as_of": "2026-09-28",
     "source": "本目录 scratch 重跑 examples/work-delivery-batch-v1.example.json --formats docx：mechanical_stage_seconds=0.47784",
     "screens": [
      "work-delivery-copilot-01"
     ]
    },
    {
     "id": "n-impact",
     "text": "2 / 9 条",
     "meaning": "合成样例“报表口径统一”指标表换 v2 后过期的事实数 / 总事实数",
     "as_of": "2026-09-28",
     "source": "本目录 scratch\\acceptance.json，scenarios[reporting-review]",
     "screens": [
      "work-delivery-copilot-01",
      "work-delivery-copilot-04"
     ]
    },
    {
     "id": "n-tests",
     "text": "45 个",
     "meaning": "测试定义 45 个（只计数），本轮未重跑；9 月 28 日 44 个中 39 过 5 跳过",
     "as_of": "2026-10-11",
     "source": "tests 下 test_* 定义只读静态计数（HEAD 7a8d0e5，2026-10-11 13:33 北京时间）；历史回执：Ran 44 tests OK (skipped=5)",
     "screens": [
      "work-delivery-copilot-05",
      "work-delivery-copilot-07"
     ]
    },
    {
     "id": "n-checks",
     "text": "各 12 项检查",
     "meaning": "合成验收每套样例的检查项数",
     "as_of": "2026-09-28",
     "source": "scratch\\acceptance.json scenarios[].checks",
     "screens": [
      "work-delivery-copilot-05"
     ]
    },
    {
     "id": "n-lines",
     "text": "3,714 行",
     "meaning": "src/work_delivery 8 个 .py 的非空行；另有 artifact_builders 3 个文件 1,451 非空行",
     "as_of": "2026-10-11",
     "source": "按提交 7a8d0e5 只读统计 8 个 Python 文件非空行（2026-10-11 13:33 北京时间）",
     "screens": [
      "work-delivery-copilot-07"
     ]
    },
    {
     "id": "n-commits",
     "text": "14 次",
     "meaning": "仓库全部提交，北京时间 8 月 31 日 23:25–9 月 29 日 01:16（含 7a8d0e5 固定数据库位置）",
     "as_of": "2026-09-29",
     "source": "git log",
     "screens": [
      "work-delivery-copilot-07"
     ]
    },
    {
     "id": "n-anchor-cases",
     "text": "14 种",
     "meaning": "结构锚点测试定义中的换版情形：5 种重接、9 种过期（只计数，本轮未运行）",
     "as_of": "2026-10-11",
     "source": "tests/test_core.py:100–128；10 月 11 日按代码计数",
     "screens": [
      "work-delivery-copilot-08"
     ]
    },
    {
     "id": "n-blind",
     "text": "27 条事实、39 条追溯",
     "meaning": "9 月 1 日不给提示的验收结果（另有 5 条待确认、4 条阻断，Office 文件 0 个，约 12 分钟，程序约 0.04 秒）",
     "as_of": "2026-09-01",
     "source": "提交 73f92f1 的 README.md“当前验收”",
     "screens": [
      "work-delivery-copilot-08"
     ]
    },
    {
     "id": "n-budget",
     "text": "15 秒",
     "meaning": "事实确认后程序机械阶段的时间上限",
     "as_of": "2026-09-28",
     "source": "batch.py:18；product-contract.md:80",
     "screens": [
      "work-delivery-copilot-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-skill-entry",
     "with": "skill:work-delivery",
     "direction": "入口",
     "flow": "work-delivery 技能把自然语言的工作请求路由进本项目；技能只管路由，事项、事实和交付状态都在本项目",
     "source": "E:\\.agents\\skills\\work-delivery\\SKILL.md:8；AGENTS.md:9"
    },
    {
     "id": "r-daily-preferences",
     "with": "daily-preferences",
     "direction": "双向",
     "flow": "按需读个人理解库里和当前工作相关的本人背景；发现有依据的新认识或更正时，经它的入口写回。只当语境，不成为业务事实、证据或交付决定",
     "source": "AGENTS.md:9；product-contract.md:11–13；daily-preferences DOMAIN_CONTRACT.md:54"
    },
    {
     "id": "r-learning-separate",
     "with": "learning",
     "direction": "分开",
     "flow": "学习项目和本项目不共享数据库、样本、状态和验收；学习的事走学习技能",
     "source": "product-contract.md:13、58；SKILL.md:17"
    },
    {
     "id": "r-formal-docs",
     "with": "personal-formal-documents",
     "direction": "分开",
     "flow": "私人正式文书走个人正式文书项目，不进交付包",
     "source": "SKILL.md:17；AGENTS.md:9"
    },
    {
     "id": "r-office-skills",
     "with": "外部：Codex/Claude 自带的办公文件能力",
     "direction": "绕开",
     "flow": "一次性改一份 Word/PPT/表格时直接用它们，不建交付包；Word/PDF 资料也先由它们转成文字再交进来",
     "source": "SKILL.md:17、31"
    },
    {
     "id": "r-artifact-tool",
     "with": "外部：Codex 工作区 Office 组件 artifact-tool",
     "direction": "拿来",
     "flow": "生成演示（5 页）和表格（4 张）时，由 Codex 加载工作区依赖提供 Node.js 和组件路径，本项目把规范事实清单交给它",
     "source": "build_presentation.mjs:360；build_workbook.mjs:264；artifacts.py:294–297；references/continuous-source-package.md"
    },
    {
     "id": "r-libreoffice",
     "with": "外部：LibreOffice（Scoop 安装）",
     "direction": "拿来",
     "flow": "验收时把 Word 渲染成图片逐页检查",
     "source": "提交 406c3f1 README；E:\\Scoop\\shims\\soffice.exe"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#L25",
     "screen": "work-delivery-copilot-01",
     "text": "偶尔用 · 只修报错，不加新功能〔约法 L25〕"
    },
    {
     "target": "/how/#work-delivery-copilot",
     "screen": "work-delivery-copilot-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "work-delivery-copilot-02",
     "text": "按需去〔个人理解库〕读相关的那部分"
    },
    {
     "target": "/skills/work-delivery/",
     "screen": "work-delivery-copilot-02",
     "text": "怎么跟 AI 说、一个完整例子，见〔工作支持与交付技能〕"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [
    "亮点一节不写：本人定的规矩是亮点只收已经在用的做法，本项目 8 项功能都是待验收。原来的三条亮点（两个日期对调不会接错、自己写“已通过”不算数、没告诉它有这个项目 AI 自己找上门）和三条小巧思挪到技术一节第 8 屏“几处设计”，写明还没在真实工作里用过；registry.highlights 清空，验收后再按编号 h-structure-anchor、h-no-self-pass、h-blind-routing 加回。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 10 屏“9 月 26 日 我定：暂时不用，只修报错；说明文档压成五句话。”（依据决定记录 B9“暂时不用”，“只修报错”出自项目 AGENTS.md:3）；“9 月 27 日 我定：维持偶尔用，不冻结，以后工作了自然会用。”（依据 ZS11 原话“以后工作了自然会用，不需要直接冻结”）。",
    "功能状态全部“待验收”：技能在 9 月 26 日 00:29、9 月 27 日 19:20 各被加载过一次（后一次是本网站会话），没有任何交付包命令的使用记录，仓库里也没有真实数据库；旧网站给“办眼前的事”写的“最近一次用 9 月 27 日”没采用。9 月 26 日那次加载是在 Claude 的临时工作区里，是否真实工作未查（不读对话内容）。",
    "第 6 屏写“演示和表格要用 Codex 干活时加载的 Office 组件（artifact-tool）”：依据是生成器 import @oai/artifact-tool、技能参考文件要求先加载 workspace dependencies；9 月 28 日在本机 .codex 目录下没找到这个组件的安装位置，Claude 这边能不能出演示和表格没实测。Word 在 Claude 这边实测能出。",
    "第 3 屏截图是我 9 月 28 日用仓库自带合成样例重跑后，用 LibreOffice 渲染的 Word 第一页（不是旧网站或仓库里现成的截图）；仓库 work/ 下有 8 月 31 日的演示和表格预览图，但那是 0.2.0 之前的旧版（哈希是占位字母），没用。",
    "第 8 屏“一个新开的 Codex 子代理”：原记录写的是“fresh Sol Max 代理”，页面按约法 L1 不写内部代号；如果 Sol 在网站别处已作为公开的模型名出现，可以改回“GPT Sol（Max 档）”。",
    "第 3 屏第 2 步“读完先交回……”是产品合同和技能规定的做法（product-contract.md:79、references/continuous-source-package.md），没有真实使用记录验证过。"
   ]
  },
  "old_urls": [
   "/projects/work-delivery/"
  ]
 },
 "source": {
  "page": "sources/pages/work-delivery-copilot/page.json",
  "sha256": "1a16369df6cbfc1231b7640933761848a21e08bf3d8d90e78c433079332a463c",
  "converted_at_beijing": "2026-10-23T08:44:37+08:00"
 }
}
---

::screen{#work-delivery-copilot-01 section="top"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上大标题毛笔艺术字“工作支持与交付”，标题下一枚浅绿底小圆角标签写状态那一行，其中“约法 L25”画成链接样式；标签下面是介绍段。右上一幅水彩插画：一张木桌上摊着三张纸——一张写满横线的说明文档、一张会议纪要（纸角别着回形针）、一张画着格子的表格；每张纸上各有一小段被绿色荧光笔划出的线，从划线处各拉出一根细细的绿色丝线，汇到桌子右边立着的三份成品：一本装订好的文档、一块小小的演示屏、一张跟踪表；其中表格那张资料的一角翻起，露出下面一张新版本，新版本上有一根丝线变成浅黄色。插画里的纸上只画浅灰短线，不写任何字。周围水彩绿叶。中间一排四张数字卡片（和电脑配置与恢复页第一屏的数字卡同一画法：上面小插画，大号绿色数字，下面一两行小字）：卡 1 插画一只手从一叠文件里抽出三张；卡 2 插画六张小文件扇形排开；卡 3 插画一只秒表；卡 4 插画九张小卡片，其中两张是浅黄色、其余是浅绿色。数字卡片下面一行浅灰小字写截至日期和数字来源。最下面一个白底细绿边的长按钮写“在整套系统里的位置 → 怎么协作”。这个项目没有自动任务，不画“现在”横条；仓库是私有的，不画 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版从上到下：标题、状态标签、介绍段；插画放在介绍段下面，占满宽度；四张数字卡两张一行排两行；截至日期那行小字；按钮单独一行占满宽度。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#work-delivery-copilot",
    "locator_instances": {
     "v": {
      "input_sha256": "afb43069825e8efd1a02d90bd9019e60c6c892f3d4b4373fdb7332dcab73bb37",
      "instances": [
       {
        "context_text": "在整套系统里的位置→怎么协作刁",
        "context_rect": [
         204,
         3076,
         738,
         3118
        ],
        "expected_rect": [
         208,
         3083,
         687,
         3115
        ],
        "lookup_text": "在整套系统里的位置 → 怎么协作",
        "confirm_region": true,
        "underline_rect": [
         208,
         3118,
         687,
         3120
        ]
       }
      ]
     }
    }
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/work-delivery-copilot/#ai-brief"
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
     "text_ref": "工作支持与交付",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "tag",
     "text_ref": "偶尔用",
     "row": "hero",
     "shape": "rounded_strip"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 20 日 15:16",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 21 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "工作上的事直接交给 AI 办",
     "row": "hero",
     "align": "left"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "50%",
     "index": 0
    },
    {
     "type": "stat_card",
     "text_ref": "2–5 份|6 个文件|0.48 秒|2 / 9 条",
     "columns": 4,
     "illustration": "top_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "0.48 秒和 2 / 9 条是",
     "align": "center",
     "variant": "source_note",
     "size": "small"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "align": "center",
     "columns": 2
    }
   ],
   "notes": "以 pages-approved 中批准新图为构图源：标题及说明占左半，右侧桌面插画；状态标签横长，四张数字卡一排；底部说明居中，两按钮同排。标题依原图浓度。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "工作支持与交付",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "偶尔用",
     "shape": "rounded_strip"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 20 日 15:16",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 21 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
    },
    {
     "type": "stat_card",
     "text_ref": "2–5 份|6 个文件|0.48 秒|2 / 9 条",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "0.48 秒和 2 / 9 条是",
     "variant": "source_note"
    },
    {
     "type": "prose",
     "text_ref": "工作上的事直接交给 AI 办"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "columns": 1,
     "columns_v": 1,
     "align": "center"
    }
   ],
   "notes": "已逐张看 v→v2：实际 v2 是四张无图标数字卡各占整宽，按原图记一列，不套 portrait 文案的两列；新定稿补的复制按钮与原按钮同式，逐字保留。整屏标题按统一标准居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。",
   "portrait_parts": [
    {
     "part": "v",
     "through": "主插画"
    },
    {
     "part": "v2",
     "from": "2–5 份",
     "through": "按钮"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "2–5 份｜一个交付包只收我点名的资料，别的文件一个不读",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "6 个文件｜同一版事实出：Word 需求文档、评审演示、跟踪表，外加 PRD 文本（需求文档的纯文本版）、事实清单、追溯表",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "0.48 秒｜事实都定好、写进一份请求后，程序从建包到出 Word 需求文档的用时（不含 AI 读资料）",
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
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "柱状图",
   "source_phrase": "2 / 9 条｜指标表换了新版，9 条事实里只有 2 条要重看，其余照旧有效",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-work-delivery-copilot",
   "source_phrase": "右上一幅水彩插画：一张木桌上摊着三张纸——一张写满横线的说明文档、一张会议纪要（纸角别着回形针）、一张画着格子的表格；每张纸上各有一小段被绿色荧光笔划出的线，从划线处各拉出一根细细的绿色丝线，汇到桌子右边立着的三份成品：一本装订好的文档、一块小小的演示屏、一张跟踪表；其中表格那张资料的一角翻起，露出下面一张新版本，新版本上有一根丝线变成浅黄色。",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
   "status": "ready",
   "original_elements": [
    "一张木桌上摊着三张纸——一张写满横线的说明文档、一张会议纪要（纸角别着回形针）、一张画着格子的表格；每张纸上各有一小段被绿色荧光笔划出的线，从划线处各拉出一根细细的绿色丝线，汇到桌子右边立着的三份成品：一本装订好的文档、一块小小的演示屏、一张跟踪表；其中表格那张资料的一角翻起，露出下面一张新版本，新版本上有一根丝线变成浅黄色"
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
   "asset": "_library/titles/title-68cc25dbbe6a77a81b7f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-68cc25dbbe6a77a81b7f",
   "title_text": "工作支持与交付",
   "sha256": "fb1f2854891cd2af82da6a6cabbcf0da40b8db75de39574e051da90ed6d84a01",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 工作支持与交付

偶尔用 · 只修报错，不加新功能〔约法 L25〕 · 还没在真实工作里用过：手上暂时没有工作事项，工作了会用

工作上的事直接交给 AI 办。碰上要长期维护的交付——几份需求说明、会议纪要、表格还会一改再改——就建一个“交付包”：只收我点名的几份资料，每条事实钉在原文哪一句，Word 需求文档、评审演示、跟踪表都从同一版事实出；资料换了版，只标出真正失效的那几条事实和用过它们的旧文件。

- **2–5 份**｜一个交付包只收我点名的资料，别的文件一个不读
- **6 个文件**｜同一版事实出：Word 需求文档、评审演示、跟踪表，外加 PRD 文本（需求文档的纯文本版）、事实清单、追溯表
- **0.48 秒**｜事实都定好、写进一份请求后，程序从建包到出 Word 需求文档的用时（不含 AI 读资料）
- **2 / 9 条**｜指标表换了新版，9 条事实里只有 2 条要重看，其余照旧有效

0.48 秒和 2 / 9 条是 9 月 28 日用仓库自带的两套合成样例（编出来的工作资料）跑出来的，不是真实工作

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

::screen{#work-delivery-copilot-02 section="usage"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-02",
  "section": "usage",
  "title": "两种用法",
  "scene": "横版：左上标题（毛笔艺术字加绿色笔刷线）。下面左右两张大卡片并排，中间一个小小的分岔路口水彩插画把两边连起来：左卡“日常：直接说”，卡片顶部小插画是一个对话气泡旁边一张打了勾的单页纸；右卡“要长期维护的交付：建交付包”，顶部小插画是一个透明的文件盒，里面立着三张纸，盒子外伸出三根绿色丝线；右卡里的两条编号条件前各一个小圆形编号。两张卡下面一条横跨整屏的浅绿细卡片“我本人的背景从哪来”，左边一个小插画：一本翻开的小册子，一支笔在往里写。最下面一行居中的小字（带链接）。〔〕里的字画成链接样式。",
  "portrait": "竖版：标题；“日常：直接说”卡片占满宽度；分岔路口小插画缩成一行；“建交付包”卡片占满宽度，两条条件一行一条；“我本人的背景从哪来”卡片；最后一行链接。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "工作支持与交付技能",
    "href": "/skills/work-delivery/",
    "locator_text": {
     "h": "怎么跟 AI 说、一个完整例子，见工作支持与交付技能",
     "v": "怎么跟 AI 说、一个完整例子，见工作支持与交付技能"
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
     "text_ref": "两种用法",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "日常：直接说",
     "columns": 1,
     "illustration": "none"
    },
    {
     "type": "content_card",
     "text_ref": "要长期维护的交付：建交付包",
     "columns": 1,
     "illustration": "top_inside",
     "illustration_index": 2,
     "numbering": "circles",
     "illustration_source": "illustrations"
    },
    {
     "type": "content_card",
     "text_ref": "我本人的背景从哪来",
     "columns": 1,
     "illustration": "left_inside",
     "illustration_index": 3,
     "illustration_source": "illustrations"
    },
    {
     "type": "prose",
     "text_ref": "怎么跟 AI 说、一个完整例子",
     "align": "center"
    }
   ],
   "notes": "两张顶图大卡44/44，中间12%无字分岔路口在卡外；右卡编号条件保留同一卡内。底部整宽左图右文背景卡和居中链接。原图无丝带，只有岔路插画连接。整屏章节标题按标准居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "两种用法",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "日常：直接说",
     "columns_v": 1,
     "illustration": "none"
    },
    {
     "type": "content_card",
     "text_ref": "要长期维护的交付：建交付包",
     "columns_v": 1,
     "illustration": "top_inside",
     "illustration_index": 2,
     "illustration_source": "illustrations"
    },
    {
     "type": "content_card",
     "text_ref": "我本人的背景从哪来",
     "columns_v": 1,
     "illustration": "left_inside",
     "illustration_index": 3,
     "illustration_source": "illustrations"
    },
    {
     "type": "prose",
     "text_ref": "怎么跟 AI 说、一个完整例子",
     "align": "center"
    }
   ],
   "notes": "一张长竖图：日常卡→卡外岔路横插画→建包卡→左图右文背景卡→底链。两条建包条件在右/下大卡内，不能拆成外部步骤。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
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
   "asset": "_library/illustrations/分岔指路.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "分岔指路",
   "source_phrase": "下面左右两张大卡片并排，中间一个小小的分岔路口水彩插画把两边连起来：左卡“日常：直接说”，卡片顶部小插画是一个对话气泡旁边一张打了勾的单页纸；右卡“要长期维护的交付：建交付包”，顶部小插画是一个透明的文件盒，里面立着三张纸，盒子外伸出三根绿色丝线；右卡里的两条编号条件前各一个小圆形编号。",
   "sha256": "1dfe279ec5b683d3ceacacf8af37000c33a04422ad35709f45cfde7f9e6e85c6",
   "status": "ready",
   "original_elements": [
    "小小的分岔路口"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "勾选清单",
   "source_phrase": "下面左右两张大卡片并排，中间一个小小的分岔路口水彩插画把两边连起来：左卡“日常：直接说”，卡片顶部小插画是一个对话气泡旁边一张打了勾的单页纸；右卡“要长期维护的交付：建交付包”，顶部小插画是一个透明的文件盒，里面立着三张纸，盒子外伸出三根绿色丝线；右卡里的两条编号条件前各一个小圆形编号。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready",
   "original_elements": [
    "对话气泡旁边打勾的单页纸"
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
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "透明文件盒",
   "source_phrase": "下面左右两张大卡片并排，中间一个小小的分岔路口水彩插画把两边连起来：左卡“日常：直接说”，卡片顶部小插画是一个对话气泡旁边一张打了勾的单页纸；右卡“要长期维护的交付：建交付包”，顶部小插画是一个透明的文件盒，里面立着三张纸，盒子外伸出三根绿色丝线；右卡里的两条编号条件前各一个小圆形编号。",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
   "status": "ready",
   "original_elements": [
    "透明文件盒内立三张纸，盒外伸三根绿色丝线"
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
   "asset": "_library/illustrations/ill-4bce9731581bc2.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "册子阅读现图小槽4比3",
   "source_phrase": "两张卡下面一条横跨整屏的浅绿细卡片“我本人的背景从哪来”，左边一个小插画：一本翻开的小册子，一支笔在往里写。",
   "sha256": "421c6aa8d646e894c5b62de75e129b60646020d72acece8b84a5ebe155efb705",
   "status": "ready",
   "original_elements": [
    "翻开的小册子和一支笔"
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
   "asset": "_library/round3/titles/title-r3-21a1ae82f9192f6779d4.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-21a1ae82f9192f6779d4",
   "title_text": "两种用法",
   "sha256": "873190dee313516494a9269126bd18f89205b89116a3cb68004cb3a424472657",
   "status": "ready",
   "source_box": [
    49,
    64,
    506,
    219
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 两种用法

**日常：直接说**
工作上的问题——看材料、理思路、审方案、准备评审——直接交给 AI 办完，不建包、不记台账。一次性改一份 Word、PPT 或表格，AI 直接用现成的办公文件能力改，不绕到这里。

**要长期维护的交付：建交付包**
下面两条都满足才建：
1. 我点名 2–5 份资料（需求说明、会议纪要、规则、表格），要记住它们是哪一版、从哪来；
2. 要好几种彼此一致的文件，或者这次只要需求文档、但这些资料明显还会改。

**我本人的背景从哪来**
工作资料只用我这次点名的。AI 要了解我的经历、习惯时，按需去〔个人理解库〕读相关的那部分，学到有依据的新情况就写回去；那里的内容只当背景，不当业务事实，也不进交付文件。

怎么跟 AI 说、一个完整例子，见〔工作支持与交付技能〕。

::screen{#work-delivery-copilot-03 section="usage"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-03",
  "section": "usage",
  "title": "建一个交付包，走一遍",
  "scene": "横版：左上标题，标题下一行小字介绍例子。左边约五分之三宽：七个步骤沿一条弯弯的绿色丝线从上往下排，每步一个圆形编号、一个角色小徽章（“我”画成一只小手，“AI”画成一个小对话气泡，“程序”画成一个小齿轮）和一两行字；第 1、4、7 步（我出手的三处）底色换成浅黄。第 5 步旁边画一扇小门，门上一个绿色对勾。右边约五分之二宽：一个带细浅绿边框的截图空位，竖向 A4 比例（宽:高约 1:1.3），宽度占满右栏、高度约占屏幕高度的四分之三；截图空位下面一行小字是截图说明。",
  "portrait": "竖版保留既定v/v2，正确第1张原路径/范围/字节不动。仅03-v2放原第5/6/7步全部原字，步骤整宽上下排，不夹第1张正文。第5/6步下方没有用途的两个假空框删除，仅第7步后保留一个真实竖截图空框，内部全白，比例1225:1585，参考860×1113源像素；原图注紧跟其下，不能放进第7步卡或放框上。正文36源像素/行44不降低，程序/我角色粗体42源像素，同首行44行高；图注32/40约三行，正常370可读。上下各18边距、段落/截图处间距各10即可，AI图标/植物不占整块高度，不补本张没有的插画。测算1641源像素、剩31相对原1661/11略有余量，只是可行建议不是固定字号门；真实生成不得溢出或缩字，单张本轮一次候选。原text/横scene/其他screens不改，不新增part。\n仅03-v2按原第5步完整程序正文→原第6步完整程序正文→原第7步完整“我 看成品……”正文→步骤卡结束→独立纯白竖截图框→原图注的顺序。第7步黄色卡不能包住截图或图注；不把第7步正文移到框后。保1225:1585比例内白区域，参考860×1113；原图注整宽在框下。正文36/44、角色42同首行，图注32/40，合理收白、缩无字图标，不加插画。引用此前同张空间预算1641而不沿用已失败的旧顺序；既有正确03-v的文字/范围/路径/字节不动，不新增part。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/a60801d0b533c41d7c42d1c8d9def8d65ed9df5312159588326fb063091d781f.png",
    "where": "右栏，带细浅绿边框的竖向空位（宽:高约 1:1.3），占满右栏宽度、约屏幕高度的四分之三",
    "caption": "合成样例生成的 Word 需求文档第一页（9 月 28 日重跑，用 LibreOffice 渲染成图）：表格最右一列就是这条事实在立项说明里的位置",
    "frame_bindings": {
     "v": {
      "0703B982691DC04E7ADD0FFBA19EBB818B942CDB776F322ABD626516E5C04244": [
       26,
       652,
       914,
       1425
      ],
      "9F7A1FFE78AC234375DFC89178D63AE89EFA3BA5F79C4AFB0DD9921425213DD6": [
       26,
       2220,
       914,
       2993
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
     "text_ref": "建一个交付包，走一遍",
     "align": "left",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "例子是仓库自带的合成样例"
    },
    {
     "type": "flow",
     "text_ref": "我",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight_steps": [
      1,
      4,
      7
     ],
     "role_icons": {
      "我": "_library/icons/指向手.png",
      "AI": "_library/icons/气泡.png",
      "程序": "_library/icons/齿轮.png"
     },
     "ribbon": "curved_vertical",
     "direction": "vertical",
     "highlight": [
      1,
      4,
      7
     ],
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "screenshot",
     "aspect_ratio": "1225/1585",
     "frame": "blank_white",
     "screenshot_index": 0,
     "ratio": "1225:1585",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "合成样例生成的 Word 需求文档第一页",
     "size": "small"
    }
   ],
   "notes": "七步沿左栏弯曲绿丝带从上到下；1/4/7黄底，人/AI/程序徽章在每卡左。右栏上方独立纯白竖截图槽，图注在槽下且不入步骤卡。标题实际只占左栏，依原图左对齐。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；本轮用截图族已支持的ratio=1225:1585、indices=[0]绑定真实空槽，图注留在框下。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "建一个交付包，走一遍",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "例子是仓库自带的合成样例"
    },
    {
     "type": "flow",
     "text_ref": "我",
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight_steps": [
      1,
      4,
      7
     ],
     "role_icons": {
      "我": "_library/icons/指向手.png",
      "AI": "_library/icons/气泡.png",
      "程序": "_library/icons/齿轮.png"
     },
     "direction": "vertical",
     "highlight": [
      1,
      4
     ],
     "page_break_after": true,
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
     ]
    },
    {
     "type": "flow",
     "text_ref": "5程序过一道门：目标、范围、需求、异常、验收五块都有已确",
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight_steps": [
      1,
      4,
      7
     ],
     "role_icons": {
      "我": "_library/icons/指向手.png",
      "AI": "_library/icons/气泡.png",
      "程序": "_library/icons/齿轮.png"
     },
     "direction": "vertical",
     "highlight": [
      3
     ],
     "page_break_after": false,
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "screenshot",
     "aspect_ratio": "1225/1585",
     "frame": "blank_white",
     "screenshot_index": 0,
     "after_step": 7,
     "ratio": "1225:1585",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "合成样例生成的 Word 需求文档第一页",
     "size": "small",
     "outside_card": true
    }
   ],
   "notes": "已看 v/v2 合屏：v有介绍、三纸转需求的插画、步骤1–4；v2严格步骤5→6→7→卡结束→纯白截图→图注。第7步黄卡不包截图和图注；不加无用途假空框。插画上文档名仅可来自定稿，重画/程序覆盖不可产生外字。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；本轮用截图族已支持的ratio=1225:1585、indices=[0]绑定真实空槽，图注留在框下。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；实际steps在原第5条前切成两个flow块，首块后显式换张；第二块原5–7后才是独立截图和图注，当前引擎已能消费。；主工程师接管规格（12:02）：按定稿 portrait“v2 不加插画、不补本张没有的插画”撤掉第 2 块额外插画（素材第二轮交接 handoff 第 2 项）。",
   "portrait_parts": [
    {
     "part": "v",
     "steps": [
      1,
      2,
      3,
      4
     ]
    },
    {
     "part": "v2",
     "steps": [
      5,
      6,
      7
     ],
     "screenshot_after": 7,
     "caption_after": "screenshot"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "我  点名这三份资料，说清目标：“把正常申请的平均处理时间降低到 2 个工作日”。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "AI  读完先交回：用了哪几份、关键事实、哪里对不上、打算怎么排；再挑出要写进文件的事实，每条抄下原文那一句。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "程序  核对那句原文确实在资料里，自己算出位置：“第 5 行，第 38 列”；表格写到第几行、哪一列。金额存成 CNY 605000.00，日期存成 2026-10-12。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "key": "工具箱",
   "source_phrase": "我  只处理对不上的和拿不准的；AI 照我的意思登记确认、驳回，或留作“假设”，每次写一句理由，记进决定记录。",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "程序  过一道门：目标、范围、需求、异常、验收五块都有已确认的事实，关键事实都有出处、互不矛盾、没过期，才算能正式出；差一样，只出一份标着“待确认草稿”的 PRD 文本，不做 Office 文件。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "程序  从这一版事实出文件。这次只要需求文档，就只出 Word，不等演示和表格。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "我  看成品：每条事实在文件里都带着它在原文的位置。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "我  点名这三份资料，说清目标：“把正常申请的平均处理时间降低到 2 个工作日”。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "AI  读完先交回：用了哪几份、关键事实、哪里对不上、打算怎么排；再挑出要写进文件的事实，每条抄下原文那一句。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "程序  核对那句原文确实在资料里，自己算出位置：“第 5 行，第 38 列”；表格写到第几行、哪一列。金额存成 CNY 605000.00，日期存成 2026-10-12。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "key": "工具箱",
   "source_phrase": "我  只处理对不上的和拿不准的；AI 照我的意思登记确认、驳回，或留作“假设”，每次写一句理由，记进决定记录。",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "程序  过一道门：目标、范围、需求、异常、验收五块都有已确认的事实，关键事实都有出处、互不矛盾、没过期，才算能正式出；差一样，只出一份标着“待确认草稿”的 PRD 文本，不做 Office 文件。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "程序  从这一版事实出文件。这次只要需求文档，就只出 Word，不等演示和表格。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "我  看成品：每条事实在文件里都带着它在原文的位置。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-eb472c8b335051a2eaf2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-03-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-eb472c8b335051a2eaf2",
   "title_text": "建一个交付包，走一遍",
   "sha256": "ea880cbda9eb013fb489ae1cde89276786792bc655d8325341c91d2fa55aae22",
   "status": "ready",
   "source_box": [
    44,
    62,
    724,
    150
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 建一个交付包，走一遍

例子是仓库自带的合成样例“内部审批效率优化”：立项说明、评审纪要、执行计划表三份资料，要出一份需求文档。

1. **我**　点名这三份资料，说清目标：“把正常申请的平均处理时间降低到 2 个工作日”。
2. **AI**　读完先交回：用了哪几份、关键事实、哪里对不上、打算怎么排；再挑出要写进文件的事实，每条抄下原文那一句。
3. **程序**　核对那句原文确实在资料里，自己算出位置：“第 5 行，第 38 列”；表格写到第几行、哪一列。金额存成 CNY 605000.00，日期存成 2026-10-12。
4. **我**　只处理对不上的和拿不准的；AI 照我的意思登记确认、驳回，或留作“假设”，每次写一句理由，记进决定记录。
5. **程序**　过一道门：目标、范围、需求、异常、验收五块都有已确认的事实，关键事实都有出处、互不矛盾、没过期，才算能正式出；差一样，只出一份标着“待确认草稿”的 PRD 文本，不做 Office 文件。
6. **程序**　从这一版事实出文件。这次只要需求文档，就只出 Word，不等演示和表格。
7. **我**　看成品：每条事实在文件里都带着它在原文的位置。

合成样例生成的 Word 需求文档第一页（9 月 28 日重跑，用 LibreOffice 渲染成图）：表格最右一列就是这条事实在立项说明里的位置

::screen{#work-delivery-copilot-04 section="usage"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-04",
  "section": "usage",
  "title": "资料换了版",
  "scene": "横版：左上标题，下面一段说明。左边约五分之三宽：一张两列表格（圆角外框、细浅绿分隔线、表头浅绿底），四行；前两行“结果”一列左边画一个浅黄圆点，第三行画绿色圆点，第四行画一个浅灰小文件夹图标。表格下面一行字。右边约五分之二宽：上面一幅水彩插画——两张表格纸一前一后叠着，前面那张是新版，其中两行被浅黄色荧光笔标出，两根原本连着的绿色丝线在这两行处断开，其余几根丝线连着另外两张没动的纸，仍是绿色（纸上只画格子和浅灰短线，不写字）；插画下面三张小卡片上下排：“什么算‘还有效’”“旧文件什么时候过期”和“现在做不到的”，每张左上一个小图标（一枚图钉、一枚图钉、一把量尺）。",
  "portrait": "竖版：标题和说明；插画占满宽度；表格改成四张小卡片一行一张（粗体写事实名，下面一行写结果）；表格下面那行字；三张小卡片一行一张。",
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
     "text_ref": "资料换了版",
     "align": "left",
     "size": "large",
     "row": "balanced-heading",
     "width": "88%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "prose",
     "text_ref": "另一套合成样例"
    },
    {
     "type": "table",
     "text_ref": "事实",
     "columns": 2,
     "column_widths": [
      "34%",
      "66%"
     ],
     "row_markers": [
      "yellow",
      "yellow",
      "green",
      "folder"
     ],
     "portrait_layout": "table"
    },
    {
     "type": "prose",
     "text_ref": "我只看这两条"
    },
    {
     "type": "content_card",
     "text_ref": "什么算“还有效”|旧文件什么时候过期|现在做不到的",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/scene-r3-work-validity-pin.png",
      "_library/icons/scene-r3-work-validity-pin.png",
      "_library/icons/scene-r3-work-limitation-ruler.png"
     ]
    }
   ],
   "notes": "左54%为标题/说明/两列表格四行/收尾，右46%为卡外纸张插画和三张左图右文小卡。表格前两行黄点、第三行绿点、第四行文件夹；状态只给点。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "资料换了版",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "另一套合成样例"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner"
    },
    {
     "type": "table",
     "text_ref": "事实",
     "columns": 2,
     "column_widths": [
      "42%",
      "58%"
     ],
     "portrait_layout": "table",
     "row_cards": true,
     "row_markers": [
      "yellow",
      "yellow",
      "green",
      "folder"
     ]
    },
    {
     "type": "prose",
     "text_ref": "我只看这两条"
    },
    {
     "type": "content_card",
     "text_ref": "什么算“还有效”|旧文件什么时候过期|现在做不到的",
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "实际 v保留事实/结果左右两栏，四行各有圆角框；不是把每个结果移动到事实名下。v2先收尾句，再两张纯文字整宽卡；按原图省卡内图标。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。",
   "portrait_parts": [
    {
     "part": "v",
     "through": "四行表格"
    },
    {
     "part": "v2",
     "from": "我只看这两条",
     "through": "现在做不到的"
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
   "asset": "_library/icons/scene-r3-work-validity-pin.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-validity-pin",
   "source_phrase": "一枚图钉",
   "sha256": "3104ff11f2a9783982a88dc89ee7a93893d926d79daebd0160736c7f3eb908a9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-work-limitation-ruler.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-limitation-ruler",
   "source_phrase": "一把量尺",
   "sha256": "4f8722a690db66d10901ab16d4689a4e334e7d8a3b6ced6d6bf8534373fd5795",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/表格变更.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "表格变更",
   "source_phrase": "右边约五分之二宽：上面一幅水彩插画——两张表格纸一前一后叠着，前面那张是新版，其中两行被浅黄色荧光笔标出，两根原本连着的绿色丝线在这两行处断开，其余几根丝线连着另外两张没动的纸，仍是绿色（纸上只画格子和浅灰短线，不写字）；插画下面两张小卡片上下排：“什么算‘还有效’”和“现在做不到的”，每张左上一个小图标（一枚图钉、一把量尺）。",
   "sha256": "13f2643671e5b77ec7da57f8496bed6887ac57df738e4e98a5849eaae66a14f3",
   "status": "ready",
   "original_elements": [
    "两张表格纸一前一后叠着，前面那张是新版，其中两行被浅黄色荧光笔标出，两根原本连着的绿色丝线在这两行处断开，其余几根丝线连着另外两张没动的纸，仍是绿色（纸上只画格子和浅灰短线，不写字"
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
   "asset": "work-delivery-copilot/work-delivery-copilot-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d61696b3461c66a41c0b",
   "title_text": "资料换了版",
   "sha256": "aa629acf7e064fe6a1187fb56ede4ed9a65706ba7dd89756a6635f551693ef3a",
   "status": "ready",
   "source_box": [
    33,
    47,
    521,
    200
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 资料换了版

另一套合成样例“报表口径统一”：3 份资料登记了 9 条事实，出过一版文件。后来指标口径表换了新版，两条指标定义都多了“且审核结果为通过”。AI 把新版交进去，程序拿每条事实引用的原文去新版里找：

| 事实 | 结果 |
|---|---|
| 新增履约金额定义 | 原文在新版里找不到了 → 过期，等我重看 |
| 新增履约次数定义 | 同上 → 过期 |
| 其余 7 条 | 引用的是另外两份资料 → 照旧有效，不用再确认 |
| 上一版文件 | 用到了这两条 → 整版标“过期”，文件原样留在原目录 |

我只看这两条；AI 按新口径改好，再出下一版，放进新目录。

**什么算“还有效”**
引用的原文在新版里还在、只出现一次、还在原来的位置——表格认首列的事项名和列名，文档认所在的标题和上下文——就自动接到新版，不用我再确认。原文没了、出现好几处、挪到了别的事项下，才标过期；这时我手动点“确认”也不行，要重新登记这条事实或补上新版里的出处。新版和旧版一字不差，就什么都不记。

**旧文件什么时候过期**
用到过期事实的旧文件会过期；事实虽然自动接上了新版、内容没变，但出处换了，用到它的旧文件也标过期，下一版按新出处重出。这次换版没碰到的事实、和旧文件内容无关的变化，不会让旧文件过期。

**现在做不到的**
影响只算到“哪几条事实、哪一版文件”，指不到某一页、某一格；也不生成逐字对比的差异文件，改了什么看变更记录和决定记录。

::screen{#work-delivery-copilot-05 section="usage"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-05",
  "section": "usage",
  "title": "出了事怎么办",
  "scene": "横版：左上标题。左边约三分之二宽：六张横向小卡片两列三行，每张左边一个小水彩图标（静音的铃铛、一张盖着“草稿”浅黄印的纸但印上不写字、放大镜照着一个空抽屉、一张揉皱的纸团、一只秒表、一个裂开的小数据库圆柱），右边粗体一句加两三行小字。右边约三分之一宽：一张竖卡片“现在能不能用”，左上一个小体检表图标，下面一段字。",
  "portrait": "竖版：标题；六张卡一行一张；“现在能不能用”卡片放最后，占满宽度。",
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
     "text_ref": "出了事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "没有自动提醒。|只出了草稿。|数据库在哪。|资料是 Word 或 PDF。|出文件超过 15 秒。|数据库丢了。",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "现在能不能用",
     "columns": 1,
     "illustration": "top_inside",
     "illustration_index": 0,
     "icons": [
      "_library/hires-icons/打勾清单.png"
     ]
    }
   ],
   "notes": "左六张卡2×3顺序逐行，左图右文；右栏单张验收卡从顶部贯穿，顶部大检查表/电脑插画在卡内。章标题只占左栏，左对齐。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出了事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "没有自动提醒。|只出了草稿。|数据库在哪。|资料是 Word 或 PDF。|出文件超过 15 秒。|数据库丢了。",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "现在能不能用",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/打勾清单.png"
     ]
    }
   ],
   "notes": "v前四张小卡，v2后两张及现在卡；均整宽左图右文，现在卡没有顶部大插画。正文和路径保全，不缩字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。",
   "portrait_parts": [
    {
     "part": "v",
     "cards": [
      1,
      2,
      3,
      4
     ]
    },
    {
     "part": "v2",
     "cards": [
      5,
      6,
      "现在能不能用"
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
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "没有自动提醒。 它不在后台跑，也没有定时任务；出问题直接跟 AI 说。",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/小旗.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "小旗",
   "source_phrase": "只出了草稿。 草稿开头写着差什么：交付目标、哪几块没内容、哪条没确认、哪条过期、哪条没出处、哪几条互相矛盾。补上再出。",
   "sha256": "0628ee273e0d9f24798e011c669fc1570520b8efe366277623d439405970dd8b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "数据库在哪。 所有命令都读同一个库：E:\\PersonalData\\WorkDelivery\\work-delivery.sqlite3，不跟着当时所在的文件夹或请求文件走；要换地方得明说，之后的命令都用同一个位置。9 月 28 日试出过“换个文件夹去查，就新建一个空库、报未找到交付包”，9 月 29 日改成固定位置。",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "资料是 Word 或 PDF。 它只可靠地读纯文本、Markdown 和 CSV 表格；Word、PDF、邮件、在线文档要先让 AI 转成文字。直接交 Word 会存下一份乱码，到登记事实时才报“原文找不到”（9 月 28 日试过）。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "出文件超过 15 秒。 事实定好之后，程序这一段按产品合同不许超过 15 秒（平时不到 1 秒），超了就当失败报错，免得慢得离谱还当正常。但这时包和事实可能已经存进去了，同一个包名不能再新建；让 AI 往这个已有的包里接着补资料、补事实，再出文件。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "数据库丢了。 资料的各个版本、决定记录、每版文件的记录都只在这一个数据库里，项目自己没有导出和恢复，Git 里只有代码。库所在的个人资料目录每天 17:10 随电脑配置与恢复的个人资料备份复制到 G、再同步到 H；还没有真实交付包，库还没建出来，这份备份也还没核过。",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": " \n现在能不能用（9月28日查）\n44个自动测试：39个通过，5个跳过（要Codex干活时才有的Office组件）。两套合成样例从建包、出文件到资料换版，各12项检查全部通过；同一天在Claude这边重跑，出Word需求文档也成功。还没用在真实工作上，也没和“AI直接做”比过时间，所以不说省了多少时间。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": " \n现在能不能用（9月28日查）\n44个自动测试：39个通过，5个跳过（要Codex干活时才有的Office组件）。两套合成样例从建包、出文件到资料换版，各12项检查全部通过；同一天在Claude这边重跑，出Word需求文档也成功。还没用在真实工作上，也没和“AI直接做”比过时间，所以不说省了多少时间。",
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
   "asset": "_library/round3/titles/title-r3-a3ee9e1ca208027ef241.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-05-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-a3ee9e1ca208027ef241",
   "title_text": "出了事怎么办",
   "sha256": "e92799aaa76461543b0736697a83d543a00a9e4154075b42aa2cd83668f98b76",
   "status": "ready",
   "source_box": [
    23,
    87,
    798,
    344
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 出了事怎么办

- **没有自动提醒。** 它不在后台跑，也没有定时任务；出问题直接跟 AI 说。
- **只出了草稿。** 草稿开头写着差什么：交付目标、哪几块没内容、哪条没确认、哪条过期、哪条没出处、哪几条互相矛盾。补上再出。
- **数据库在哪。** 所有命令都读同一个库：E:\PersonalData\WorkDelivery\work-delivery.sqlite3，不跟着当时所在的文件夹或请求文件走；要换地方得明说，之后的命令都用同一个位置。9 月 28 日试出过“换个文件夹去查，就新建一个空库、报未找到交付包”，9 月 29 日改成固定位置。
- **资料是 Word 或 PDF。** 它只可靠地读纯文本、Markdown 和 CSV 表格；Word、PDF、邮件、在线文档要先让 AI 转成文字。直接交 Word 会存下一份乱码，到登记事实时才报“原文找不到”（9 月 28 日试过）。
- **出文件超过 15 秒。** 事实定好之后，程序这一段按产品合同不许超过 15 秒（平时不到 1 秒），超了就当失败报错，免得慢得离谱还当正常。但这个检查是在每一步写完之后才做的，超时不会撤回已经写进去的东西：包和事实可能已经存进去了，同一个包名不能再新建；让 AI 往这个已有的包里接着补资料、补事实，再出文件。
- **数据库丢了。** 资料的各个版本、决定记录、每版文件的记录都只在这一个数据库里，项目自己没有导出和恢复，Git 里只有代码。库所在的个人资料目录每天 17:10 随电脑配置与恢复的个人资料备份复制到 G、再同步到 H。10 月 11 日看：默认位置上没有这个库，G、H 的备份里也没有，所以还没有可核的备份。库可以明说放到别处，项目没有总登记，所以这只说明默认位置上没有，不能据此说一个真实交付包都没建过。

**现在能不能用**（9 月 28 日查）
44 个自动测试：39 个通过，5 个跳过（要 Codex 干活时才有的 Office 组件）。两套合成样例从建包、出文件到资料换版，各 12 项检查全部通过；同一天在 Claude 这边重跑，出 Word 需求文档也成功。还没用在真实工作上，也没和“AI 直接做”比过时间，所以不说省了多少时间。

::screen{#work-delivery-copilot-06 section="tech"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-06",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题，下面一行小字。左边约五分之三宽：一条从上往下的链，七个节点（圆角卡片，每个一个小水彩图标：一个带标签的文件盒、一叠复印纸上盖着指纹印、一段被荧光笔划出的文字旁边一个定位针、一张小卡片、一本只往后加页的记事本、一个印着版本号圆章的封套、六张扇形排开的小文件），节点之间绿色向下箭头；链的右侧画一个浅绿色的数据库圆柱，把七个节点都框在一个浅绿色大括号里，表示都存在同一个本地数据库里。右边约五分之二宽：一张卡片“用什么”，六行，每行左边一个小图标（一个大脑旁边一个齿轮、一张 Word 文档、一块演示屏和一张表格、一个放大镜照着一页纸、一个命令行窗口、一面小小的中国结）。图上不画 Word、Office 以外的品牌标志。",
  "portrait": "竖版：标题和那行小字；七个节点一行一个竖排，箭头向下，数据库圆柱缩小放在链的顶部；“用什么”卡片六行一行一条放最后。",
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
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "一件事的资料、事实和文件"
    },
    {
     "type": "flow",
     "text_ref": "交付包|来源快照|证据片段|事实|决定记录|构建|六个文件",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "direction": "vertical",
     "database_bracket": true,
     "highlight": []
    },
    {
     "type": "section_heading",
     "text_ref": "用什么",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "模型",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "左49%七节点竖链和向下箭头；9%数据库圆柱置链右侧，多条绿箭头汇入；右42%顶部卡外工具插画，用什么毛笔组名，下方六行带图标的小卡。不新增原图 SQLite/SHA-256 图内字，定稿有的用程序覆盖。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "一件事的资料、事实和文件"
    },
    {
     "type": "illustration",
     "index": 0,
     "role": "数据库圆柱",
     "size": "small"
    },
    {
     "type": "flow",
     "text_ref": "交付包|来源快照|证据片段|事实|决定记录|构建|六个文件",
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "direction": "vertical",
     "database_bracket": true,
     "highlight": []
    },
    {
     "type": "section_heading",
     "text_ref": "用什么",
     "size": "large",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "模型",
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "list_layout": "six_row_cards"
    }
   ],
   "notes": "v标题/介绍→小数据库圆柱和横括号→七节点左图右文竖链，卡间下箭头；v2用什么标题和六张纯文字条卡，保留圆点，省右栏工具大图。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。",
   "portrait_parts": [
    {
     "part": "v",
     "through": "六个文件"
    },
    {
     "part": "v2",
     "from": "用什么"
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
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "数据库",
   "source_phrase": "一个浅绿色的数据库圆柱，把七个节点都框在一个浅绿色大括号里，表示都存在同一个本地数据库里",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
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
   "asset": "_library/icons/scene-r3-work-delivery-copilot-06-icons-2-d0fd7a18.png",
   "fallback": false,
   "semantic_status": "independent_actual_rejected",
   "key": "scene-r3-work-delivery-copilot-06-icons-2-d0fd7a18",
   "source_phrase": "一段被荧光笔划出的文字旁边一个定位针",
   "sha256": "53a9abdeb950bb545a1c514a7162aa974ad92401f48ee12f9ac18dcb7bc4b41e",
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
   "asset": "_library/icons/scene-r3-work-delivery-copilot-06-icons-2-cc851e8e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-delivery-copilot-06-icons-2-cc851e8e",
   "source_phrase": "一块演示屏和一张表格",
   "sha256": "a9b3b5e769228f048019d56438dc23373070d25431b41c12d44863dac5bb2f41",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-work-delivery-copilot-06-icons-3-19f701ad.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个放大镜照着一页纸",
   "sha256": "2bed89813bc2512e9903a18256b175b3fe3dfc3a66c9f371db85ad8c55876531",
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
   "source_phrase": "",
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
   "asset": "_library/icons/scene-r3-work-delivery-copilot-06-icons-5-a20cfa11.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-delivery-copilot-06-icons-5-a20cfa11",
   "source_phrase": "一面小小的中国结",
   "sha256": "eaaf0fcf0fdd24f0393684383479ade9056fae1ee4f4fea371a3b20213036e50",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
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
   "asset": "_library/icons/数据库.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "数据库",
   "source_phrase": "数据库圆柱",
   "sha256": "94f411ca3351bc5e50580664619090085a59a72a44a8c344eeaac2b126a0fb3c",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "main-work-delivery-copilot",
   "source_phrase": "同项目工具总插画主体",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-06-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "source_box": [
    32,
    20,
    525,
    119
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 它是怎么搭的

一件事的资料、事实和文件，在一个本地 SQLite 数据库里连成一条链：

1. **交付包**｜一件要长期维护的事：固定的包名、标题、目标
2. **来源快照**｜点名的每份资料存一份原样副本和 SHA-256 指纹（内容改一个字，指纹就变）；换了版多存一版，旧版不删
3. **证据片段**｜一句原文，加上程序算出的位置
4. **事实**｜一条要写进文件的内容，绑着证据；分“事实”和“假设”；状态有待确认、已确认、已确认假设、驳回，资料换版后可能被标“过期”
5. **决定记录**｜每次确认、驳回、换版重接都追加一条：前后状态、理由、换前换后的证据；只加不改。不记是谁做的决定（没有操作人这一栏），回答不了“这条是谁拍板的”
6. **构建**｜一版事实生成一次，记下事实版本号和内容指纹（由这一版全部事实算出，用来判断两次生成的内容是不是一样、磁盘上的事实清单有没有被改过）；同一时间只有一版是“当前”
7. **六个文件**｜PRD.md、事实清单 manifest.json、追溯表 traceability.csv，和 产品需求文档.docx、项目评审.pptx、执行跟踪表.xlsx

**用什么**
- **模型**：项目本身不调模型。读资料、挑事实、写理由的是正在干活的 AI（Codex 或 Claude）；程序只做确定的核对和生成，同样的事实出同样的内容。
- **Word**：python-docx，微软雅黑；五章：背景与目标，范围、角色与流程，需求与验收，风险与待确认事项，追溯与变更提示。
- **演示和表格**：Codex 干活时加载的 Office 组件（artifact-tool）；演示 5 页，表格 4 张：概览、事实、执行跟踪、追溯。
- **检查外观**：验收时用 LibreOffice 把 Word 渲染成图逐页看；演示和表格由 Office 组件渲染成图检查。这是验收时做的，平时每次出文件不会自动逐页查。
- **入口**：一个 PowerShell 命令；新建时一份 JSON 请求一次建好包、存好资料、登记完事实。
- **中文默认**：简体中文、北京时间、人民币；资料是 GB18030（老式中文编码）、带 BOM 的 UTF-16 或 UTF-8 都认。

::screen{#work-delivery-copilot-07 section="tech"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-07",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（每张左边一个小水彩图标：一只手只捏着三张纸、一把尺子量着一行字、两个说法不同的对话气泡中间一个暂停符号、一枚刻着精确数字的硬币旁边一页日历、一排互不重叠的文件夹、一个小工具箱），粗体一句加一两行小字；右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
  "portrait": "竖版：标题；六张卡一行一张；三张大数字卡并排成一行放在最后（放不下就一行一张）。",
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
     "align": "left",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "只读点名的文件。|位置由程序算，不由人写。|说法打架，不替我定。|金额日期存精确值。|一版一个目录。|小而少。",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "direction": "horizontal",
     "highlight": []
    },
    {
     "type": "stat_card",
     "text_ref": "3,714 行|45 个|14 次",
     "columns": 3,
     "illustration": "right_inside",
     "icons": "auto"
    }
   ],
   "notes": "左69%六条原则2×3，左图右文、无连接；右31%三数字卡竖排，图标在大数字右上/右侧，数字在左。章标题仅左栏左对齐。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "只读点名的文件。|位置由程序算，不由人写。|说法打架，不替我定。|金额日期存精确值。|一版一个目录。|小而少。",
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "part_after_steps": [
      3
     ],
     "direction": "vertical",
     "highlight": []
    },
    {
     "type": "stat_card",
     "text_ref": "3,714 行|45 个|14 次",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "v前三条，v2后三条和三个数字卡；实际数字卡也一行一张、左图右数字和说明，不使用描述里的三卡并排。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。",
   "portrait_parts": [
    {
     "part": "v",
     "steps": [
      1,
      2,
      3
     ]
    },
    {
     "part": "v2",
     "steps": [
      4,
      5,
      6
     ],
     "stats": [
      1,
      2,
      3
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只手只捏着三张纸",
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
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子量着一行字",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "两个说法不同的对话气泡中间一个暂停符号",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一枚刻着精确数字的硬币旁边一页日历",
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
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一排互不重叠的文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱",
   "source_phrase": "一个小工具箱",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-07-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "source_box": [
    19,
    122,
    894,
    364
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 为什么这样设计

1. **只读点名的文件。**｜程序只打开传给它的那几个路径，不翻文件夹、不连账号、不在后台同步；有测试专门验证没点名的文件读不到。
2. **位置由程序算，不由人写。**｜行、列、字符位置都从原文算出来；手写的位置和算出来的对不上，就拒收。
3. **说法打架，不替我定。**｜两条已确认的关键事实同名却说法不同，就只出草稿，列出两边的依据，等我定。
4. **金额日期存精确值。**｜金额存“CNY 605000.00”，只收人民币，不四舍五入；日期存 2026-10-12，带时区的时间保留时区。“人民币60.50万元”这种写法只在出文件时生成。
5. **一版一个目录。**｜新一版事实只能写进新目录，不会盖掉旧版；同一版重出，三个文本文件一字不差。
6. **小而少。**｜一个进程、一个数据库、一个入口；不加向量库、队列、后台服务和连接器。等真用起来，按实际遇到的问题再加。

- **3,714 行**｜Python 正式代码（8 个文件，不算空行），另有三个文件生成器 1,451 行
- **45 个**｜自动测试（代码里写着的数量，不是这次通过的数量：上一次实际运行是 9 月 28 日，当时 44 个里 39 个通过、5 个跳过；这次没有重跑）
- **14 次**｜提交（8 月 31 日–9 月 29 日）

::screen{#work-delivery-copilot-08 section="tech"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-08",
  "section": "tech",
  "title": "几处设计",
  "scene": "横版：版式借照片视频录音管理页“亮点”那屏的三张大卡片（但这里是技术一节，不叫亮点）：左上标题，标题下一行浅灰小字，三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：卡 1 两张小表格上下摆着，每张两行，行首分别是“ERP”“CRM”，上面那张 ERP 行写“2026-09-22”、CRM 行写“2026-09-23”，下面那张两个日期对调；一根绿色丝线想从上面 ERP 的日期连到下面 CRM 的日期，被一枚绿色图钉（按在 ERP 行首）拦住，线在半路打了个结。卡 2 一份清单纸上盖着一个手写的红色“ready”印，旁边一只放大镜把它和另一份清单对照，红印上打了个叉。卡 3 一个小机器人站在分岔路口，没有路牌，它自己走向一扇写着对勾的门，手里只捏着三张纸。三张卡下面一条横跨整屏的浅绿细卡片，标题“还有几处小设计”，里面三条并排，每条一个小图标（一张请求单上画着一个红色小叉、两张一模一样的纸、一个临时纸箱）加粗体短标题和一两行字。text 最后五行只画在插画里：ERP、CRM 和两个日期（2026-09-22、2026-09-23）画在卡 1 的两张小表格上，ready 画在卡 2 的红印上。",
  "portrait": "竖版：标题和那行小字；三张大卡片一行一张（插画在上、字在下）；“还有几处小设计”三条一行一条。",
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
     "text_ref": "几处设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "下面这些都只在自动测试"
    },
    {
     "type": "content_card",
     "text_ref": "两个日期对调，它不会接错。|自己写“已通过”不算数。|没告诉它有这个项目，AI 自己找上门。",
     "id": "designs",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "illustration_positions": [
      "none",
      "none",
      "none"
     ],
     "source_prose": true
    },
    {
     "type": "section_heading",
     "text_ref": "还有几处小设计",
     "size": "medium",
     "align": "left",
     "frame": "small-designs"
    },
    {
     "type": "content_card",
     "text_ref": "请求写错，连库都不建",
     "id": "small-designs",
     "columns": 3,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"
     ],
     "frame": "small-designs"
    },
    {
     "type": "document_mock",
     "text_ref": "ERP",
     "attach_to": "designs",
     "layout": "illustration_labels",
     "labels": [
      "ERP",
      "CRM",
      "2026-09-22",
      "2026-09-23",
      "ready"
     ],
     "echo_repeats": true
    }
   ],
   "notes": "三个顶图大卡横排；底部小设计在同一整宽框内三列，左图右文。最后五个定稿标签只覆盖卡1表格/卡2印章，不能在页面末尾另列，也不能裁带字图直接复用。整屏大标题按统一标准居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；main-closer：尾部五个原para通过prepare_mock_attachments移入designs前两卡的原题后图样，原标签不复制；原label_bindings由该精确节点合同落实。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "几处设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "下面这些都只在自动测试"
    },
    {
     "type": "content_card",
     "text_ref": "两个日期对调，它不会接错。|自己写“已通过”不算数。|没告诉它有这个项目，AI 自己找上门。",
     "id": "designs",
     "columns_v": 1,
     "illustration": "none",
     "illustration_positions": [
      "none",
      "none",
      "none"
     ],
     "icons": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "还有几处小设计",
     "size": "large",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "请求写错，连库都不建",
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "document_mock",
     "text_ref": "ERP",
     "attach_to": "designs",
     "layout": "illustration_labels",
     "echo_repeats": true
    }
   ],
   "notes": "v前两卡上图下字；v2第三大卡纯文字无机器人图，下面小设计标题和三张纯文字条卡。最后五标签仍只在前两张插画位程序覆盖。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；main-closer：尾部五个原para通过prepare_mock_attachments移入designs前两卡的原题后图样，原标签不复制；原label_bindings由该精确节点合同落实。",
   "portrait_parts": [
    {
     "part": "v",
     "cards": [
      1,
      2
     ]
    },
    {
     "part": "v2",
     "cards": [
      3
     ],
     "from_next": "还有几处小设计"
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
   "source_phrase": "一张请求单上画着一个红色小叉",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "两张一模一样的纸",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个临时纸箱",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "请求写错，连库都不建 ：新建时先把整份请求核一遍（原文找不到、缺包名、资料选重了），有错就在建数据库之前拦下；写到一半出错整批撤回，不留半个包。\n",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-work-delivery-copilot-08-icons-1-a2c00f93.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-delivery-copilot-08-icons-1-a2c00f93",
   "source_phrase": "两张一模一样的纸",
   "sha256": "91c57538d3869194401c90f201587384db9fe9c3d67cce7151dff0d6641b7091",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "key": "红色警示",
   "source_phrase": "失败不留半成品 ：三种 Office 文件先在临时文件夹里一起生成，全部成功才挪进正式目录，哪个出错就一个都不放进去。\n",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/表格变更.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "表格变更",
   "source_phrase": "插画：卡 1 两张小表格上下摆着，每张两行，行首分别是“ERP”“CRM”，上面那张 ERP 行写“2026-09-22”、CRM 行写“2026-09-23”，下面那张两个日期对调；一根绿色丝线想从上面 ERP 的日期连到下面 CRM 的日期，被一枚绿色图钉（按在 ERP 行首）拦住，线在半路打了个结。",
   "sha256": "13f2643671e5b77ec7da57f8496bed6887ac57df738e4e98a5849eaae66a14f3",
   "status": "ready",
   "original_elements": [
    "卡 1 两张小表格上下摆着，每张两行，行首分别是抽象图形抽象图形，上面那张 ERP 行画抽象短线的、CRM 行画抽象短线的，下面那张两个日期对调；一根绿色丝线想从上面 ERP 的日期连到下面 CRM 的日期，被一枚绿色图钉（按在 ERP 行首）拦住，线在半路打了个结"
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
   "asset": "_library/illustrations/scene-r3-work-delivery-copilot-08-icons-1-748a143a.png",
   "fallback": false,
   "semantic_status": "independent_actual_indeterminate",
   "key": "scene-r3-work-delivery-copilot-08-icons-1-748a143a",
   "source_phrase": "卡 2 一份清单纸上盖着一个手写的红色“ready”印，旁边一只放大镜把它和另一份清单对照，红印上打了个叉",
   "sha256": "83d96c469edc016fc53e48c33b9c1cb4ad582f1a9efdd8ed085d48e6564ed706",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-a1de3051f28610.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-a1de3051f28610",
   "source_phrase": "卡 3 一个小机器人站在分岔路口，没有路牌，它自己走向一扇写着对勾的门，手里只捏着三张纸。",
   "sha256": "a8b6c1a190c14c3dab7f5e99bce836634acca21a19917c58ec425293210d6935",
   "status": "ready",
   "original_elements": [
    "一个小机器人站在分岔路口，没有路牌，它自己走向一扇写着对勾的门，手里只捏着三张纸"
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
   "asset": "work-delivery-copilot/work-delivery-copilot-08-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7d7181da56ef8f5b11f2",
   "title_text": "几处设计",
   "sha256": "6402b1debefa801c93b727fdec4dbbcea4233043d0130480cf788d329c2768e0",
   "status": "ready",
   "source_box": [
    46,
    46,
    446,
    170
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 几处设计

下面这些都只在自动测试和合成样例里跑通过，还没在真实工作里用过。

**两个日期对调，它不会接错。**
表格里 ERP 是 9 月 22 日、CRM 是 9 月 23 日；新版把两个日期对调了。“2026-09-22”在新版里仍然只出现一次，只看“原文还在不在”，就会把 ERP 的日期接到 CRM 那一行上，而且不报任何问题。9 月 24 日加了“结构锚点”：不光看原文还在不在，还看它是不是还在原来那个事项下（怎么认，见上面“资料换了版”），对不上就标过期。测试代码里写着 14 种换版情形：整行挪位置、前面加一段说明这类 5 种自动接上；对调、换列、同名出现两次这类 9 种一律交回给人看（10 月 11 日按代码数的，这次没有重跑）。

**自己写“已通过”不算数。**
正式的 Word、演示、表格只能从数据库里“当前那一版”出：先从数据库把事实清单重算一遍，和磁盘上那份逐字段比，一样才动手，生成器拿到的就是这次核过的那份。手改清单写上“ready”、改一条事实、拿过期的那版来出，都会被拒；三个生成器也不接受绕开入口直接调用。

**没告诉它有这个项目，AI 自己找上门。**
9 月 1 日做了一次不给提示的验收：一个新开的 Codex 子代理只拿到三份资料，和“这些资料以后还会改、这次只要 Word”这句话，没人告诉它有这个技能和项目。它自己选中了这里，三份资料全用上、一份没多读，确认 27 条事实、39 条追溯；发现 5 条待确认，其中 4 条会卡住正式文件，所以它只出了草稿，一个 Office 文件都没做。全程约 12 分钟，程序那一段约 0.04 秒。

**还有几处小设计**
- **请求写错，连库都不建**：新建时先把整份请求核一遍（原文找不到、缺包名、资料选重了），有错就在建数据库之前拦下；写到一半出错整批撤回，不留半个包。
- **同一版重出，一字不差**：同一版事实再生成一次，构建编号、时间和三个文本文件都和上次一样，一眼就能看出有没有变。
- **生成失败不放半成品**：三种 Office 文件先在临时文件夹里一起生成，哪个出错就一个都不放进正式目录。全部生成好以后是一个个换进去的，不是整组一次换好；万一换到一半出错，前面的可能已经换了，要逐个文件核对。

ERP

CRM

2026-09-22

2026-09-23

ready

::screen{#work-delivery-copilot-09 section="features"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-09",
  "section": "features",
  "title": "全部功能",
  "scene": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：左上标题（毛笔字）和同一行右边的图例条（绿色实心圆、黄色实心圆、空心绿圈、灰色实心圆、浅灰实心圆、灰色叉，各跟着它的字）；图例下面一行浅灰小字写“怎么判的”。下面按组排，四组：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个黄色实心圆点（8 张全是黄点）。“日常”组只有 1 张卡，靠左，右边空出的两格画一小幅水彩插画：一个对话气泡旁边一张打勾的纸；“出文件”和“资料换版”两组各 2 张，右边空出的一格各画一小幅插画（六张扇形排开的小文件；两张叠着的表格纸，前面那张一角翻起）。插画不写字。状态文字不画出来，只画圆点。一屏画完，不跨屏。",
  "portrait": "竖版：标题；图例两行排；“怎么判的”一段；每组组名一行，下面功能卡一行一张（图标在左、字在右、圆点在右上）；组里的小插画省掉。",
  "links": [],
  "anchors": [
   {
    "id": "g-daily",
    "text": "日常"
   },
   {
    "id": "f-daily-support",
    "text": "日常工作支持"
   },
   {
    "id": "g-package",
    "text": "建包和核事实"
   },
   {
    "id": "f-package",
    "text": "明确建包"
   },
   {
    "id": "f-snapshot",
    "text": "来源快照"
   },
   {
    "id": "f-fact-review",
    "text": "事实审阅"
   },
   {
    "id": "g-deliver",
    "text": "出文件"
   },
   {
    "id": "f-same-version",
    "text": "同版文件"
   },
   {
    "id": "f-verify",
    "text": "文件验真"
   },
   {
    "id": "g-change",
    "text": "资料换版"
   },
   {
    "id": "f-impact",
    "text": "变更影响"
   },
   {
    "id": "f-next-version",
    "text": "差异续版"
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
     "text_ref": "全部功能（8 项）",
     "align": "left",
     "size": "large",
     "row": "feature-head",
     "width": "32%"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用",
     "row": "feature-head",
     "width": "68%",
     "columns": 6
    },
    {
     "type": "prose",
     "text_ref": "怎么判的",
     "row": "feature-head"
    },
    {
     "type": "section_heading",
     "text_ref": "日常",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "日常工作支持",
     "columns": 1,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "建包和核事实",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "明确建包|来源快照|事实审阅",
     "columns": 3,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "出文件",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "同版文件|文件验真",
     "columns": 2,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "资料换版",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "变更影响|差异续版",
     "columns": 2,
     "illustration": "left_inside",
     "status": "待验收"
    }
   ],
   "notes": "标题左、图例右同排，判定说明在右下；功能按1/3/2/2四组，每排三格；第一组占一格另两格补日常图，末两组各右一格补图，八卡黄点无额外状态文字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（8 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用",
     "columns": 3,
     "columns_v": 3,
     "portrait_columns": 3
    },
    {
     "type": "notice",
     "text_ref": "怎么判的",
     "tone": "green"
    },
    {
     "type": "section_heading",
     "text_ref": "日常",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "日常工作支持",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "建包和核事实",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "明确建包|来源快照|事实审阅",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "出文件",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "同版文件|文件验真",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "status": "待验收"
    },
    {
     "type": "section_heading",
     "text_ref": "资料换版",
     "align": "left"
    },
    {
     "type": "feature_card",
     "text_ref": "变更影响|差异续版",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "status": "待验收"
    }
   ],
   "notes": "v标题→左2×3图例右检查表插画→判定卡→日常和建包组；v2出文件/资料换版；每卡整宽左图右文右上黄点。与portrait描述不同，实际图例旁有检查表，保留；各组补空图省去。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "portrait_parts": [
    {
     "part": "v",
     "through": "事实审阅"
    },
    {
     "part": "v2",
     "from": "出文件"
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "日常工作支持｜工作上的一次性问题：看材料、理思路、审方案、改文件，直接办完，不建包",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "明确建包｜要长期维护的交付才建：点名 2–5 份资料，给固定的包名、标题和目标；同一个包名不能建两次",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "来源快照｜每份资料存原样副本和指纹，换版时多存一版、旧版留着；只读点名的文件",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "事实审阅｜每条事实钉在原文哪一句；分出已确认、假设、互相矛盾、过期；金额日期存精确值；每次决定写理由、留记录",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "同版文件｜同一版事实出 PRD 文本、事实清单、追溯表，以及 Word、演示、表格；只要其中一种就只出那一种",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "文件验真｜出正式文件前从数据库重算事实清单、逐字段核对；缺项、冲突、过期时只出“待确认草稿”",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "变更影响｜交进新版资料，列出哪些事实失效、哪些自动接上新版、哪几版文件过期；没用到这份资料的不动",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "差异续版｜处理完失效的事实再出下一版，放新目录；旧版原样留着，变更和决定记录写清改了哪些（不生成逐字对比文件）",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "勾选清单",
   "source_phrase": "“日常”组只有 1 张卡，靠左，右边空出的两格画一小幅水彩插画：一个对话气泡旁边一张打勾的纸；“出文件”和“资料换版”两组各 2 张，右边空出的一格各画一小幅插画（六张扇形排开的小文件；两张叠着的表格纸，前面那张一角翻起）。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready",
   "original_elements": [
    "对话气泡旁打勾的纸"
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
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "透明文件盒",
   "source_phrase": "“日常”组只有 1 张卡，靠左，右边空出的两格画一小幅水彩插画：一个对话气泡旁边一张打勾的纸；“出文件”和“资料换版”两组各 2 张，右边空出的一格各画一小幅插画（六张扇形排开的小文件；两张叠着的表格纸，前面那张一角翻起）。",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
   "status": "ready",
   "original_elements": [
    "六张扇形排开的小文件"
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
   "asset": "_library/illustrations/表格变更.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "表格变更",
   "source_phrase": "“日常”组只有 1 张卡，靠左，右边空出的两格画一小幅水彩插画：一个对话气泡旁边一张打勾的纸；“出文件”和“资料换版”两组各 2 张，右边空出的一格各画一小幅插画（六张扇形排开的小文件；两张叠着的表格纸，前面那张一角翻起）。",
   "sha256": "13f2643671e5b77ec7da57f8496bed6887ac57df738e4e98a5849eaae66a14f3",
   "status": "ready",
   "original_elements": [
    "两张叠着的表格纸，前面那张一角翻起"
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
   "asset": "_library/titles/title-d1a28fe9f14a79b2601a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d1a28fe9f14a79b2601a",
   "title_text": "全部功能（8 项）",
   "sha256": "3ed4f944b2ab84c0e980f33410cd3999e0117ba1c692d664c2ebf75d20aa97db",
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
   "asset": "_library/titles/title-a8e7f791a6dbc64e4d56.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a8e7f791a6dbc64e4d56",
   "title_text": "出文件",
   "sha256": "1cabc5d7b7c930d5ea8d87f4aea70ba10da72e9f22b3c7851cd1565013f1cb03",
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
   "asset": "_library/titles/title-5eebdb43f02265619bea.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5eebdb43f02265619bea",
   "title_text": "建包和核事实",
   "sha256": "0a4dd26673b4b4b6165828f9aa07d415a11cf25059a562f4b4c0bda4d3dce6fe",
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
   "asset": "_library/titles/title-f648d6712cf804d1769f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f648d6712cf804d1769f",
   "title_text": "日常",
   "sha256": "58a883359d8d90c68eaeb340441294d079cbd8700264d7a262c978f097ab5094",
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
   "asset": "_library/titles/title-9cb64b3936931b384802.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9cb64b3936931b384802",
   "title_text": "资料换版",
   "sha256": "5bd05782c33eaee47337fa6b59e85f05ede811b7cb929bc68b68db8b8db857d3",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（8 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

怎么判的：8 项都是“待验收”——做好了，自动测试和两套合成样例都跑通，还没在真实工作里用过。“日常工作支持”就是 AI 直接办，没有单独的程序。

**日常**
1. 日常工作支持｜工作上的一次性问题：看材料、理思路、审方案、改文件，直接办完，不建包

**建包和核事实**
2. 明确建包｜要长期维护的交付才建：点名 2–5 份资料，给固定的包名、标题和目标；同一个包名不能建两次
3. 来源快照｜每份资料存原样副本和指纹，换版时多存一版、旧版留着；只读点名的文件
4. 事实审阅｜每条事实钉在原文哪一句；分出已确认、假设、互相矛盾、过期；金额日期存精确值；每次决定写理由、留记录

**出文件**
5. 同版文件｜同一版事实出 PRD 文本、事实清单、追溯表，以及 Word、演示、表格；只要其中一种就只出那一种
6. 文件验真｜出正式文件前从数据库重算事实清单、逐字段核对；缺项、冲突、过期时只出“待确认草稿”

**资料换版**
7. 变更影响｜交进新版资料，列出哪些事实失效、哪些自动接上新版、哪几版文件过期；没用到这份资料的不动
8. 差异续版｜处理完失效的事实再出下一版，放新目录；旧版原样留着，变更和决定记录写清改了哪些（不生成逐字对比文件）

::screen{#work-delivery-copilot-10 section="history"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。左侧一条竖向时间线，八个节点，每个节点一个小水彩图标、粗体日期、一两行字（节点图标：一盏亮着的台灯和一摞空白纸、一枚写着对勾的印章、一个分岔成两条的路标、一只正在说话的对话气泡旁边一只小闹钟、一枚图钉、一个暂停键、一个没上锁的小箱子、一个被图钉钉在原地的小数据库圆柱）。右侧约三分之一宽一幅大一点的水彩插画：一张书桌上三份资料由细绿丝线连到三份成品，桌角放着一只合上的公文包，像是在等人来用；插画里不写字。",
  "portrait": "竖版：标题；时间线一行一个节点；插画放最后，占满宽度。",
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
     "text_ref": "演进",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "8 月 31 日深夜–9 月 1 日凌晨",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "line",
     "direction": "vertical",
     "nodes": 8,
     "text_layout": "inline"
    }
   ],
   "notes": "以 pages-approved 批准新图为准：左59%小号毛笔标题和八节点时间线，节点左图右日期正文；右41%从顶到底整幅书桌/公文包插画。原图章节标题较其他屏小，照此记 small。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。"
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
     "text_ref": "8 月 31 日深夜–9 月 1 日凌晨",
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "line",
     "direction": "vertical",
     "nodes": 8,
     "text_layout": "inline"
    }
   ],
   "notes": "单长图，八日期节点沿左竖线，图标在每节点左侧；末尾整宽书桌/公文包插画，标题中档，按标准居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。\nQA12第二轮：日期与原冒号使用现有text_layout:inline同排；film用现有highlight:[2]试排，保持全部原字，不新造组件外观。"
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
   "source_phrase": "一盏亮着的台灯和一摞空白纸",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一枚写着对勾的印章",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "一个分岔成两条的路标",
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
   "asset": "_library/icons/scene-r3-work-delivery-copilot-10-icons-3-431fa777.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-delivery-copilot-10-icons-3-431fa777",
   "source_phrase": "一只正在说话的对话气泡旁边一只小闹钟",
   "sha256": "316730f718240f8a6505e97592cefdf71d3bb599f5cec586be3f5c2c9c5ad634",
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
   "source_phrase": "一枚图钉",
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
   "asset": "_library/icons/scene-r3-work-delivery-copilot-10-icons-5-de019cc2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-work-delivery-copilot-10-icons-5-de019cc2",
   "source_phrase": "一个暂停键",
   "sha256": "d442b8cbccb1ae47f521edc0480740927f0f82863eee36b1d46ec38fd060f514",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一个没上锁的小箱子",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "数据库",
   "source_phrase": "一个被图钉钉在原地的小数据库圆柱",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-work-delivery-copilot",
   "source_phrase": "右侧约三分之一宽一幅大一点的水彩插画：一张书桌上三份资料由细绿丝线连到三份成品，桌角放着一只合上的公文包，像是在等人来用；插画里不写字。",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
   "status": "ready",
   "original_elements": [
    "一张书桌上三份资料由细绿丝线连到三份成品，桌角放着一只合上的公文包，像是在等人来用；插画里不写字"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-work-delivery-copilot-10-h\\round-01\\candidate-2.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "source_box": [
    21,
    0,
    209,
    156
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 演进

- **8 月 31 日深夜–9 月 1 日凌晨**　建库；一个晚上做出核心：交付包、来源快照、证据、事实、PRD 和追溯表、换版影响；再加上“只要需求文档”的快速路径和正式出件的门槛。
- **9 月 1 日**　0.2.0：金额日期存精确值，表格定位到行列，决定记录只加不改，正式文件只能从数据库出，一版一个目录；同一天记下那次不给提示的验收。
- **9 月 5 日**　从“交付包工具”放宽成“工作支持”：一次性的工作直接办，不强迫建包；需要时读个人理解库。
- **9 月 12 日**　改进度汇报：先交回资料覆盖、关键事实和冲突；还要很久时报有依据的预计时间，不为报时打断干活。
- **9 月 24 日**　加结构锚点，修好“两个日期对调会接错”；生成器只用这次核过的那份事实清单。
- **9 月 26 日**　我定：暂时不用，只修报错；说明文档压成五句话。
- **9 月 27 日**　我定：维持偶尔用，不冻结，以后工作了自然会用。
- **9 月 29 日**　数据库固定放在 E:\PersonalData\WorkDelivery，换哪个文件夹查都是同一个库。

::screen{#work-delivery-copilot-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "work-delivery-copilot-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/work-delivery/fictional-prd-page.webp",
    "caption": "完全虚构的 PRD 代表页：同一个 build 显示目标、范围、验收、事实状态和来源定位。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/work-delivery/fictional-review-slide.webp",
    "caption": "完全虚构的项目评审页：10 条事实、确认状态和同一事实修订版集中呈现。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/work-delivery/fictional-execution-tracker.webp",
    "caption": "完全虚构的执行跟踪表：执行事项、负责人、日期、状态、关联事实和验收备注来自同一 build。",
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
     "text_ref": "完全虚构的 PRD 代表页：同一个 build 显示目标、范围、验收、事实状态和来源定位。",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "1547:2002",
      "1600:900",
      "2028:531"
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
     "text_ref": "完全虚构的 PRD 代表页：同一个 build 显示目标、范围、验收、事实状态和来源定位。",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "1547:2002",
      "1600:900",
      "2028:531"
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

完全虚构的 PRD 代表页：同一个 build 显示目标、范围、验收、事实状态和来源定位。

完全虚构的项目评审页：10 条事实、确认状态和同一事实修订版集中呈现。

完全虚构的执行跟踪表：执行事项、负责人、日期、状态、关联事实和验收备注来自同一 build。
