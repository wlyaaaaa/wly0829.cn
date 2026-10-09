---
{
 "title": "个人正式文书",
 "kind": "project",
 "url": "/projects/personal-formal-documents/",
 "tagline": "把合同、协议、通知做成能核对、能签的正式文件。",
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
  "page": "personal-formal-documents",
  "kind": "project",
  "title": "个人正式文书",
  "url": "/projects/personal-formal-documents/",
  "tagline": "把合同、协议、通知做成能核对、能签的正式文件。",
  "status": "偶尔用",
  "public": false,
  "repo_url": null,
  "capability": "写能签字、能核对的正式文书",
  "based_on": {
   "commit": "b477b377096aaa4404f875a8c74a8b9b5accf493",
   "commit_time": "2026-09-27T23:38:10+08:00"
  },
  "video_prompt": "5–8 秒循环，白底水彩风格，从开头这屏的插画出发：书桌上一份两页的协议，纸页轻轻翻过，每翻一页，页角亮起一个绿色小勾；翻到最后一页，左边签字栏里一笔绿色签名慢慢写出来，右边签字栏始终是空横线；接着纸页合拢，滑进旁边的牛皮纸文件夹，绿色封条贴上，小锁轻轻闪一下；然后画面回到开头。画面里不出现任何可读的文字。",
  "registry": {
   "groups": [
    {
     "id": "g-matter",
     "name": "定下这件事"
    },
    {
     "id": "g-write",
     "name": "写文书"
    },
    {
     "id": "g-produce",
     "name": "出文件"
    },
    {
     "id": "g-check",
     "name": "检查和签名"
    },
    {
     "id": "g-deliver",
     "name": "交出去以后"
    }
   ],
   "features": [
    {
     "id": "f-matter-card",
     "group": "g-matter",
     "name": "事项卡和原件",
     "what": "一件事一张卡，记事实、目的、现在到哪、下一步；原件原样放进这件事自己的原件文件夹，不另存一份摘要",
     "how": "说要办什么事，AI 建卡并把我给的原件放进原件文件夹",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "docs/project-contract.md 第 40–46 行（非诉事项路线）；docs/formal-matters.md 第 54 行；E:\\PersonalData\\保留记录\\正式事项 下现有 1 件事项，不是合同或通知类"
    },
    {
     "id": "f-plan",
     "group": "g-matter",
     "name": "先查再做",
     "what": "生成前先查格式、日期、编号、签约方和签名人，附件和签名图读不读得到，不合格就停",
     "how": "AI 起草后自动先跑 formal-plan",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "src/legal_filing_kit/formal_documents.py 第 216–247、1235–1263 行（_validate_request_semantics、plan_formal_document）"
    },
    {
     "id": "f-contract",
     "group": "g-write",
     "name": "合同协议",
     "what": "起草合同、协议和补充条款，也审阅对方给的合同；当事人、订立背景、约定条款三节，每个签约方各有签字和日期位置",
     "how": "说明合同目的和谈好的条件，请 AI 起草或审阅",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "docs/formal-matters.md 第 27 行；formal_documents.py 第 380–420、519–532 行；README.md 第 14 行（合同草案、审阅、签署包）"
    },
    {
     "id": "f-notice",
     "group": "g-write",
     "name": "通知和声明",
     "what": "我一方出具的正式说明：致收件方、出具人、事实与经过、声明事项",
     "how": "说明要通知谁、什么事，请 AI 写",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "formal_documents.py 第 64–75 行（unilateral_statement＝单方正式文书／正式说明）、第 387–394、533–562 行"
    },
    {
     "id": "f-bases",
     "group": "g-write",
     "name": "附上依据原文",
     "what": "我给了、核过的合同条款或法规原文放进“依据”一节，没给不写",
     "how": "把要引用的条款原文给 AI",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "schemas/formal-document-input.schema.json 第 180–184 行；formal_documents.py 第 395–396 行；docs/formal-matters.md 第 29 行"
    },
    {
     "id": "f-attachments",
     "group": "g-write",
     "name": "附件一起装包",
     "what": "附件原样复制进材料包，记下内容指纹，正文末尾列附件清单",
     "how": "指定附件，AI 一起装进材料包",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "formal_documents.py 第 250–267、397–401、952 行起（_copy_attachments）"
    },
    {
     "id": "f-same-source",
     "group": "g-produce",
     "name": "一份内容出 Word 和 PDF",
     "what": "能改的 Word 和阅读用的 PDF 同时出，生成后逐字读回对照输入",
     "how": "内容确认后请 AI 出正式文件",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "formal_documents.py 第 1313–1322、772–793 行；README.md 第 79 行"
    },
    {
     "id": "f-print",
     "group": "g-produce",
     "name": "打印版",
     "what": "说要打印才出：每页另查灰度图，签名和真实日期照样印好",
     "how": "跟 AI 说要打印版",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "schema 第 32–36 行 render_profile；formal_documents.py 第 879–901 行；决定记录“正式文书纸质签署默认做法”"
    },
    {
     "id": "f-fallback",
     "group": "g-produce",
     "name": "Word 不在也能出 PDF",
     "what": "Word 打不开或超时，换 ReportLab 排版，同样的检查，清单记下原因",
     "how": "自动发生，不用说",
     "status": "待验收",
     "screen": "personal-formal-documents-08",
     "source": "formal_documents.py 第 708–723 行；docs/verification.md 第 11 行；word_export.py 超时 180 秒"
    },
    {
     "id": "f-page-check",
     "group": "g-check",
     "name": "逐页检查",
     "what": "每页转成图片查空白页、压边、页码，读回签名图；没过不出材料包",
     "how": "生成时自动做；也可以请 AI 查准备交出的这一版",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "formal_documents.py 第 853–950、1323–1340、1373 行；audit.py audit_rendered_page、render_pdf"
    },
    {
     "id": "f-sign",
     "group": "g-check",
     "name": "签名定稿",
     "what": "只在我这一方印签名图和日期，签名资料和签名图各留一份快照",
     "how": "说“我这边签好名”",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "formal_documents.py 第 270–315、405–420、981 行起（_snapshot_signature_inputs）"
    },
    {
     "id": "f-package-verify",
     "group": "g-deliver",
     "name": "材料包验真",
     "what": "拷到哪都能按清单核对：文件一个不少、一个字节没改",
     "how": "选一个材料包，请 AI 查齐不齐",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "README.md 第 84 行；formal_documents.py 第 1797、1990 行起（verify_formal_document）"
    },
    {
     "id": "f-legacy",
     "group": "g-deliver",
     "name": "核对早一版的材料包",
     "what": "早一版做的包照样能查，并明说它缺哪些自带证明",
     "how": "对早一版的包跑核对，自动识别",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "README.md 第 86 行；docs/verification.md 第 15 行；formal_documents.py 第 1813 行"
    },
    {
     "id": "f-delivery",
     "group": "g-deliver",
     "name": "交出和进展",
     "what": "已交出、已收到、已办理各记一级，都要凭据；本地做好不算交出",
     "how": "告诉 AI 实际发出和对方回复的情况，附上凭据",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "docs/formal-matters.md 第 39–54 行；README.md 第 90 行"
    },
    {
     "id": "f-countersign",
     "group": "g-deliver",
     "name": "对方签回单独记",
     "what": "对方签好寄回的文件放进原件，单记一笔，不推断已付款或已验收",
     "how": "把对方签回的文件交给 AI",
     "status": "待验收",
     "screen": "personal-formal-documents-09",
     "source": "docs/formal-matters.md 第 56–63 行"
    }
   ],
   "numbers": [
    {
     "id": "n-doc-kinds",
     "text": "2 种文书",
     "meaning": "网站上写的文书种类：合同协议（contract_or_agreement）和通知声明（unilateral_statement）；代码里另有两种不上网站",
     "as_of": "2026-09-28",
     "source": "formal-document-input.schema.json 第 37–44 行 matter_type 枚举，只数网站范围内的两种",
     "screens": [
      "personal-formal-documents-01"
     ]
    },
    {
     "id": "n-states",
     "text": "6 级状态",
     "meaning": "produced → signed → ready_for_delivery → delivered → received → handled，对方签回另记，不算在内",
     "as_of": "2026-09-28",
     "source": "docs/formal-matters.md 第 43–52 行",
     "screens": [
      "personal-formal-documents-01",
      "personal-formal-documents-04"
     ]
    },
    {
     "id": "n-tests",
     "text": "39 个测试",
     "meaning": "tests/test_formal_documents.py 收集到的测试数，全部通过；不限定文书种类（Word 集成测试默认不跑，不在其中）",
     "as_of": "2026-09-28",
     "source": "9 月 28 日北京时间 21:3x 现跑 python -m pytest -q -p no:cacheprovider tests/test_formal_documents.py：39 passed in 91.98s",
     "screens": [
      "personal-formal-documents-01",
      "personal-formal-documents-06",
      "personal-formal-documents-07",
      "personal-formal-documents-10"
     ]
    },
    {
     "id": "n-lines",
     "text": "1,839 行",
     "meaning": "src/legal_filing_kit/formal_documents.py 的行数（含空行和注释），不限定文书种类",
     "as_of": "2026-09-28",
     "source": "PowerShell Get-Content | Measure-Object -Line，提交 b477b37",
     "screens": [
      "personal-formal-documents-06",
      "personal-formal-documents-07"
     ]
    },
    {
     "id": "n-audit-lines",
     "text": "1,422 行",
     "meaning": "共用检查模块 audit.py 的行数",
     "as_of": "2026-09-28",
     "source": "同上",
     "screens": [
      "personal-formal-documents-06"
     ]
    },
    {
     "id": "n-dpi",
     "text": "120 dpi",
     "meaning": "formal-build 逐页转图的默认精度（可在 72–600 之间改）",
     "as_of": "2026-09-28",
     "source": "formal_documents.py 第 1276–1281 行；cli.py 第 352 行",
     "screens": [
      "personal-formal-documents-06",
      "personal-formal-documents-07"
     ]
    },
    {
     "id": "n-word-timeout",
     "text": "180 秒",
     "meaning": "Microsoft Word 导出 PDF 的超时",
     "as_of": "2026-09-28",
     "source": "word_export.py timeout=180；docs/verification.md 第 13 行",
     "screens": [
      "personal-formal-documents-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-daily-preferences",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "个人理解库提供我的姓名、住址这类共用基本情况；这次任务里发现有依据的新信息或更正，当场写回理解库并读回。已经签好、交出的文书不随理解库的更正追改。",
     "source": "SKILL.md 第 20 行；docs/project-contract.md 第 28 行"
    },
    {
     "id": "r-personal-materials",
     "with": "personal-materials",
     "direction": "拿来",
     "flow": "原件位置可靠时直接读；位置不知道、跨位置或找不到时，交个人材料查找定位原件，再按文件大小和 SHA-256 绑定进来。",
     "source": "docs/project-contract.md 第 81 行"
    },
    {
     "id": "r-pcconfig-lock",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "读私人内容的命令先调电脑配置与恢复装好的资料锁入口（personal_data_access.py 的 check_access(\"factor\")），不放行就停；路径守卫只认电脑配置与恢复登记的加密盘根（vault-links.json）。",
     "source": "src/legal_filing_kit/personal_access.py；docs/project-contract.md 第 48 行；AGENTS.md 第 19 行"
    },
    {
     "id": "r-work-delivery",
     "with": "work-delivery-copilot",
     "direction": "分工",
     "flow": "工作上的 PRD、PPT、表格、项目计划不归这里，持续的工作事项交工作交付，一次性文件用对应的文档能力。",
     "source": "docs/project-contract.md 第 22 行；SKILL.md 第 22 行"
    },
    {
     "id": "r-ms-word",
     "with": "Microsoft Word（外部软件）",
     "direction": "调用",
     "flow": "python-docx 写好的 DOCX 交本机 Word 用 COM 接口导出 PDF（ExportAsFixedFormat），超时 180 秒；不可用时改用 ReportLab。",
     "source": "src/legal_filing_kit/word_export.py；resources/export-docx-pdf.ps1"
    },
    {
     "id": "r-poppler",
     "with": "Poppler pdftoppm（外部软件）",
     "direction": "调用",
     "flow": "把 PDF 每页转成 PNG 做逐页检查；按 PFD_PDFTOPPM、PATH、Codex 自带运行环境的顺序找。",
     "source": "src/legal_filing_kit/audit.py render_pdf；docs/verification.md 第 11 行"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/how/#personal-formal-documents",
     "screen": "personal-formal-documents-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "personal-formal-documents-01",
     "text": "怎么跟 AI 说 → 技能页"
    },
    {
     "target": "/rules/charter/#L15",
     "screen": "personal-formal-documents-04",
     "text": "约法 L15"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "personal-formal-documents-07",
     "text": "个人理解库"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "personal-formal-documents-07",
     "text": "个人材料查找"
    },
    {
     "target": "/how/#personal-formal-documents",
     "screen": "personal-formal-documents-07",
     "text": "怎么协作"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“事项梳理”（把事实与原件固定下来）写成 f-matter-card“事项卡和原件”。",
    "底稿“合同文书”写成 f-contract“合同协议”，审阅对方合同并在里面。",
    "底稿“同源成品”写成 f-same-source“一份内容出 Word 和 PDF”。",
    "底稿“逐页核验”写成 f-page-check“逐页检查”。",
    "底稿“签名定稿”（区分已生成、已签名和可递送）写成 f-sign；“区分几种状态”这一半在第 4 屏状态表和 f-delivery 里讲。",
    "底稿“递送跟进”写成 f-delivery“交出和进展”。",
    "底稿“材料包验真”原样保留为 f-package-verify。",
    "底稿之外按代码补了 7 条：f-plan、f-notice、f-bases、f-attachments、f-print、f-fallback、f-legacy；f-countersign 原在底稿“合同文书”的说明里（签回留痕），单列出来。"
   ],
   "dropped": [
    "亮点一节不写：本人 9 月 27 日定亮点“只收已经在用的做法”（owner-decisions.md 第 1156–1169 行），本项目功能都待验收；状态分级、只签我这一方、材料包自证这三招放进第 7 屏“为什么这样设计”，并标明还没在真实文书上用过。真用验收后再挑亮点。",
    "sha256:b9cf798c0bd1f36a0265d87676cc74b4a5eeddb92a7e4f3ce9163d1c25375411",
    "代码里 matter_type 的另外两种（consumer_after_sales、petition_or_complaint）及其正文格式、网页填报流程、相关文档，页面上不提；数字卡“2 种文书”只数网站范围内的两种。",
    "旧网站唯一的配图 V:\\Personal\\Projects\\wly0829.cn\\public\\media\\document-materials\\fictional-after-sales-page.webp 是售后类的虚构样张，属于不写的话题，不放回来；仓库里没有合同或通知的截图，所以本页没有截图位。",
    "Python 包的机器名（src 下那个包名）不写：名字本身指向不上网站的用途；页面只写命令名 formal-plan、formal-build、formal-verify。",
    "项目最早（7 月 20 日）是为哪类文书建的、后来改名的来龙去脉不写，演进只写“正式文书的生成和版面检查工具”。",
    "项目收尾备份（project-backup）和文书包恢复快照（document-mirror）不列：前者是整个仓库的一次性工具，后者只接不上网站的那条线的路径；README 第 84 行明说合同通知这条线没有专用的续传镜像命令。"
   ],
   "unsure": [
    "功能全部标“待验收”：依据是 formal-build 每次都会留下 formal.build.manifest.json，E:\\PersonalData 下合同类和通知类一份都没有（开发时的虚构试做都在 E:\\Cache\\Codex\\Temp 下）。“交出和进展”“对方签回单独记”没有代码，是写在事项卡里的做法，同样没有真实记录。",
    "替本人口吻写的句子（上线前请本人过目）：第 3 屏“比如告诉房东月底退租”；第 3 屏打印版“我打印后自己按手印”；第 4 屏“交出去这一步……由我自己做”。",
    "第 3 屏打印版“同样印好签名和真实日期，我打印后自己按手印”的依据是决定记录“正式文书纸质签署默认做法”（原话未找到，现行做法在项目 docs/ai-case-attention.md，那份文档主要写的是不上网站的那条线）；合同和通知的代码在打印版里确实照样印签名图，但“按手印”是不是也适用于普通协议，没有直接依据。",
    "第 6 屏“宋体正文、黑体标题”取自 formal_documents.py 第 422–513 行的字体设置；走 ReportLab 备用时用的是 simsun.ttc 或 PFD_CJK_FONT 指定的字体，标题字体可能不同。",
    "“39 个测试”是 test_formal_documents.py 这一个文件收集到的数（文件里 def test_ 有 28 个，另有参数化展开）；没算共用检查模块的测试。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/personal-formal-documents/page.json",
  "sha256": "162aad4bcbbdf4f7a37c2c64750d9e6e37d2994361d39be9a400502ffff7bcee",
  "converted_at_beijing": "2026-10-10T06:53:38+08:00"
 }
}
---

::screen{#personal-formal-documents-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“个人正式文书”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字），小插画依次是：两张叠放的纸、一段六级小台阶、一张纸分成两个文件图标、一个打钩的试管架。数字卡下面一条浅黄底的细长圆角提示条，写“截至 10 月 10 日”那一句，左端一颗黄色小圆点。最下面一行两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔怎么跟 AI 说 → 技能页〕。这个项目没有自动任务，不画“现在”横条；仓库私有，不放 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、浅黄提示条（整行宽，字可换行）、两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#personal-formal-documents"
   },
   {
    "text": "怎么跟 AI 说 → 技能页",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-formal-documents/#ai-brief"
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
     "text_ref": "个人正式文书",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "2种文书",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "截至10月10",
     "tone": "yellow"
    },
    {
     "type": "prose",
     "text_ref": "把合同",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "我说要签",
     "row": "intro",
     "width": "60%"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "intro",
     "width": "40%",
     "target_height": 220,
     "target_width": 281,
     "align": "center"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上大标题毛笔艺术字“个人正式文书”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字），小插画依次是：两张叠放的纸、一段六级小台阶、一张纸分成两个文件图标、一个打钩的试管架。数字卡下面一条浅黄底的细长圆角提示条，写“截至 9 月 28 日”那一句，左端一颗黄色小圆点。最下面一行两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔怎么跟 AI 说 → 技能页〕。这个项目没有自动任务，不画“现在”横条；仓库私有，不放 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 4
   },
   "pending_requirements": [
    "浅黄提示条目前 notice tone=yellow 暂沿浅绿视觉，需组件样张确认后接入。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：原笔记本插画等比限高220源像素，保留图与文字，短介绍不再被装饰撑高。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人正式文书",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "2种文书",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "notice",
     "text_ref": "截至10月10",
     "tone": "yellow"
    },
    {
     "type": "prose",
     "text_ref": "把合同",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "我说要签"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、浅黄提示条（整行宽，字可换行）、两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 4
   },
   "pending_requirements": [
    "浅黄提示条目前 notice tone=yellow 暂沿浅绿视觉，需组件样张确认后接入。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：手机版数字卡每排一张，避免数字和单位折断。"
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
   "source_phrase": "2 种文书｜合同协议（两方以上签），通知声明（我一方出具）",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "6 级状态｜做好、签好、可交出、已交出、已收到、已办理，每级要凭据",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
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
   "source_phrase": "1 份内容｜同时出 Word 和 PDF，生成后逐字读回核对",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "39 个测试｜只用虚构内容，9 月 28 日现跑全部通过",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-formal-documents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-formal-documents",
   "source_phrase": "右上一幅水彩插画：书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁。",
   "sha256": "dd0d6900de4c91a553f10202fc97b1011007055899ad6135ab2e0c9bbfa6b210",
   "status": "ready",
   "original_elements": [
    "书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁"
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
   "asset": "_library/titles/title-bdeaa8d446e882b1d13b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bdeaa8d446e882b1d13b",
   "title_text": "个人正式文书",
   "sha256": "139d368758ebd17739f7e672c9846e5cc88c290d2d2f8d73b18a03cacbca1836",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

个人正式文书

把合同、协议、通知做成能核对、能签的正式文件。

我说要签一份协议或发一份通知，AI 先把事实、原件和还不知道的分开记好，再从同一份内容生成能改的 Word 和阅读用的 PDF，只在我这一方签上名，一页页查过，最后封成一个拷到哪都能自证齐全的材料包。交不交出去由我定；交出去、对方收到、对方签回，每一步都要有凭据才记。

**2 种文书**｜合同协议（两方以上签），通知声明（我一方出具）
**6 级状态**｜做好、签好、可交出、已交出、已收到、已办理，每级要凭据
**1 份内容**｜同时出 Word 和 PDF，生成后逐字读回核对
**39 个测试**｜只用虚构内容，10 月 10 日现跑全部通过

截至 10 月 10 日：做好了，还没在真实的合同或通知上用过，所以下面的功能都标“待验收”。

〔在整套系统里的位置 → 怎么协作〕　〔怎么跟 AI 说 → 技能页〕　〔复制 AI 续作说明〕

::screen{#personal-formal-documents-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-02",
  "section": "usage",
  "title": "一份协议，从说出来到签好",
  "scene": "横版画面：左上标题。下面一条从左到右的流程，六个节点分两行排（上三下三，第三个节点到第四个节点用一条拐弯的绿色箭头连下来），每个节点是一张小卡：左上一个小水彩图标、粗体小标题、下面一两行小字。图标依次是：一个说话气泡、一张带夹子的卡片和一个文件夹、一支笔和一个问号、一面放大镜照着一张清单、一张纸上一笔绿色签名和旁边一栏空横线、一叠纸旁一个带绿色封条的文件夹。第 6 个节点右边留一小块，画一个小红叉和一张灰色草稿纸，表示“没过只留草稿”。",
  "portrait": "竖版：标题在最上面；六个节点改成一列从上到下排，每个节点一整行宽，节点之间一个向下的绿色小箭头；第 6 个节点的小红叉画在它右下角。",
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
     "text_ref": "一份协议，从说出来到签好",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "我说要办什么",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "turn_after": [
      3
     ],
     "path": "z_order"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。下面一条从左到右的流程，六个节点分两行排（上三下三，第三个节点到第四个节点用一条拐弯的绿色箭头连下来），每个节点是一张小卡：左上一个小水彩图标、粗体小标题、下面一两行小字。图标依次是：一个说话气泡、一张带夹子的卡片和一个文件夹、一支笔和一个问号、一面放大镜照着一张清单、一张纸上一笔绿色签名和旁边一栏空横线、一叠纸旁一个带绿色封条的文件夹。第 6 个节点右边留一小块，画一个小红叉和一张灰色草稿纸，表示“没过只留草稿”。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [
    "第六节点外侧草稿纸和红叉，以及第三至第四节点转弯连接需核对并补齐。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：使用现有 z_order 回绕连线，各排从左到右；移除规格自己添加的失败叉号。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一份协议，从说出来到签好",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "我说要办什么",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题在最上面；六个节点改成一列从上到下排，每个节点一整行宽，节点之间一个向下的绿色小箭头；第 6 个节点的小红叉画在它右下角。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [
    "第六节点外侧草稿纸和红叉，以及第三至第四节点转弯连接需核对并补齐。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：使用现有 z_order 回绕连线，各排从左到右；移除规格自己添加的失败叉号。"
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
   "source_phrase": "我说要办什么｜一句话说清要签什么、跟谁签、谈好了哪些条件、我这边要不要签名。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "先建一张事项卡｜一件事一张卡，记事实、目的、现在到哪一步、下一步；谈好条件的聊天截图、旧合同这些原件，原样放进这件事自己的原件文件夹。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "AI 起草，缺的先问｜对方全名、金额、起止日期，没说清的列成“还不知道”来问我，不猜着填。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "source_phrase": "动手前先查一遍｜至少两方、我的名字只对上其中一方、日期是真实存在的日子、签名图读得出来；有一条不满足就停下说明。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "source_phrase": "出文件，只签我这一方｜同一份内容出 Word 和 PDF；我这一栏印上签名图和日期，对方那栏的签字处和日期都留空。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "逐页检查后封包｜每页转成图片，查有没有空白页、有没有字压到纸边、页码在不在；全过了才封成“可以交出”的材料包，没过只留草稿，不出包。",
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
   "asset": "_library/titles/title-4433487b3c739aaae677.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4433487b3c739aaae677",
   "title_text": "一份协议，从说出来到签好",
   "sha256": "43dd141249fb6d0ba2d0f43bc74e597884f1ab743bd1e577fe8547f2caed16d3",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一份协议，从说出来到签好

1. **我说要办什么**｜一句话说清要签什么、跟谁签、谈好了哪些条件、我这边要不要签名。
2. **先建一张事项卡**｜一件事一张卡，记事实、目的、现在到哪一步、下一步；谈好条件的聊天截图、旧合同这些原件，原样放进这件事自己的原件文件夹。
3. **AI 起草，缺的先问**｜对方全名、金额、起止日期，没说清的列成“还不知道”来问我，不猜着填。
4. **动手前先查一遍**｜至少两方、我的名字只对上其中一方、日期是真实存在的日子、签名图读得出来；有一条不满足就停下说明。
5. **出文件，只签我这一方**｜同一份内容出 Word 和 PDF；我这一栏印上签名图和日期，对方那栏的签字处和日期都留空。
6. **逐页检查后封包**｜每页转成图片，查有没有空白页、有没有字压到纸边、页码在不在；全过了才封成“可以交出”的材料包，没过只留草稿，不出包。

::screen{#personal-formal-documents-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-03",
  "section": "usage",
  "title": "通知、声明和打印版",
  "scene": "横版画面：左上标题。上半屏左右两栏：左栏是三段小字，每段前一个小水彩图标（一个贴着空白小标签的信封、一本翻开的条款小册子、一枚回形针夹着两张纸）；右栏画一张通知的缩略样张：顶上居中一条浅灰粗线代表标题，下面一行短线代表“致：收件方”，再下面几条浅灰短线分成三小节，每节开头一小段浅绿色底条代表小节标题，右下角一笔绿色签名和一行浅灰短线代表日期（样张上不画任何可读的字）。下半屏一张三列表格“电子版和打印版”，表头浅绿底；表格右边一幅小插画：一台打印机吐出一张纸，纸右下角有一笔签名，旁边一只手的大拇指悬在纸上方。",
  "portrait": "竖版：标题在上；三段小字一段一行排下来；通知样张缩小后放在四段下面，居中；表格改成两张卡片上下排（“电子版（默认）”一张、“打印版”一张），每张卡里三行：用途、颜色、签名；打印机插画放在最下面。",
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
     "text_ref": "通知、声明和打印版",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "通知和声明",
     "row": "notice",
     "width": "90%"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "mock_layout": "unsigned_notice",
     "row": "notice",
     "width": "10%",
     "size": "small",
     "align": "right"
    },
    {
     "type": "section_heading",
     "text_ref": "电子版和打印版",
     "row": "versions",
     "width": "80%"
    },
    {
     "type": "table",
     "text_ref": "电子版（默认）",
     "portrait_variant": "column_cards",
     "row": "versions"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "versions",
     "width": "20%",
     "target_height": 180,
     "target_width": 343,
     "align": "center"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。上半屏左右两栏：左栏是三段小字，每段前一个小水彩图标（一个贴着空白小标签的信封、一本翻开的条款小册子、一枚回形针夹着两张纸）；右栏画一张通知的缩略样张：顶上居中一条浅灰粗线代表标题，下面一行短线代表“致：收件方”，再下面几条浅灰短线分成三小节，每节开头一小段浅绿色底条代表小节标题，右下角一笔绿色签名和一行浅灰短线代表日期（样张上不画任何可读的字）。下半屏一张三列表格“电子版和打印版”，表头浅绿底；表格右边一幅小插画：一台打印机吐出一张纸，纸右下角有一笔签名，旁边一只手的大拇指悬在纸上方。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 3
   },
   "pending_requirements": [
    "通知无字样张的三小节与签名/日期线，及三段逐项图标需补齐；竖版原表要求按电子版/打印版两列转两卡，现 table 按数据行转卡。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：通知正文/无字纸样张改为60%/40%，纸样张用组件已实现的小档控制留白。；page-fixer-03第二轮：首轮纸样张仍高，正文/样张改80%/20%，按缩小样张路线让无字纸面随栏宽缩小，保原文及字号。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：无字通知纸张栏由20%收为10%，文字栏扩为90%；打印插画等比限高180，避免短说明旁纸张撑出一整段空白。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。\n2026-10-06 Astra复核退回：恢复721f9c5的本屏横版构图、插画大小和位置。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "通知、声明和打印版",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "通知和声明"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "mock_layout": "unsigned_notice"
    },
    {
     "type": "section_heading",
     "text_ref": "电子版和打印版"
    },
    {
     "type": "table",
     "text_ref": "电子版（默认）",
     "portrait_variant": "column_cards"
    },
    {
     "type": "illustration",
     "index": 0
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题在上；三段小字一段一行排下来；通知样张缩小后放在四段下面，居中；表格改成两张卡片上下排（“电子版（默认）”一张、“打印版”一张），每张卡里三行：用途、颜色、签名；打印机插画放在最下面。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 3
   },
   "pending_requirements": [
    "通知无字样张的三小节与签名/日期线，及三段逐项图标需补齐；竖版原表要求按电子版/打印版两列转两卡，现 table 按数据行转卡。"
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个贴着空白小标签的信封",
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
   "asset": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "翻开册子",
   "source_phrase": "一本翻开的条款小册子",
   "sha256": "64a392d9602be0e7bbd9b30f9fbb30480912524b373c7a630aa7276cae985c21",
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
   "source_phrase": "一枚回形针夹着两张纸",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
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
   "source_phrase": "下半屏一张三列表格“电子版和打印版”，表头浅绿底；表格右边一幅小插画：一台打印机吐出一张纸，纸右下角有一笔签名，旁边一只手的大拇指悬在纸上方。",
   "sha256": "3863c82d79b0bb3cdf7b7c8ec0218c0572326751b6f4e3c1c17b2cb352c2c32f",
   "status": "ready",
   "original_elements": [
    "一台打印机吐出一张纸，纸右下角有一笔签名，旁边一只手的大拇指悬在纸上方"
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
   "asset": "_library/titles/title-b7904de39adaf07983cb.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b7904de39adaf07983cb",
   "title_text": "通知、声明和打印版",
   "sha256": "1e9bd46a8582ccf44f05fb116635909c705c7a40a926a59e2608a3f012ffb6a5",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

通知、声明和打印版

**通知和声明**：只有我一方出具，比如告诉房东月底退租。正文顶上写“致：收件方”，接着是出具人、事实与经过、声明事项；要签名就在右下角印签名图和签署日期，不用签就写出具人和文书日期。
**附上依据**：合同条款或法规原文，我给了、核过的才写进“依据”一节；没给就不写，不自己编一条。
**附件**：截图、旧合同这些附件照原样复制进材料包，每个都记下 SHA-256 内容指纹（按文件内容算出的一串编码，改一个字节就对不上）；正文末尾列出附件清单。

**电子版和打印版**
| | 电子版（默认） | 打印版（我说“要打印”才出） |
|---|---|---|
| 用途 | 在屏幕上看、发邮件 | 打出来给人签 |
| 颜色 | 标题和小节带颜色，方便看 | 每页再转成灰度图查一遍，黑白打印也清楚 |
| 签名 | 印上我的签名图和日期 | 同样印好签名和真实日期，我打印后自己按手印；有明确规定要别的签法时照规定 |

::screen{#personal-formal-documents-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-04",
  "section": "usage",
  "title": "做好了，不等于交出去了",
  "scene": "横版画面：左上标题，下面一段引言。中间一张六行三列的大表格，左列每一行前画一级小台阶，六级台阶从下往上排成一段绿色阶梯（阶梯画在表格左边，和六行对齐）。表格右边一张竖卡片“对方签回，另记一笔”，卡片顶上一个小插画：一个信封里露出一张签好名的纸。卡片下面一张小卡“不用签名的事”。最下面一条浅绿底细横条，写“交出去这一步”那一句，约法两个字画成链接样式。",
  "portrait": "竖版：标题和引言在上；表格改成六张小卡片从上到下，每张卡片一级状态：粗体状态名、下面“只说明”一行、“不能说明”一行，左边一级小台阶；然后“对方签回”卡、“不用签名”卡；最后浅绿横条。",
  "links": [
   {
    "text": "约法 L15",
    "href": "/rules/charter/#L15"
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
     "text_ref": "做好了，不等于交出去了",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "每件事的状态"
    },
    {
     "type": "table",
     "text_ref": "状态",
     "icons": "auto",
     "staircase": true,
     "row": "status",
     "width": "70%"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "status",
     "width": "30%",
     "target_height": 190,
     "target_width": 199,
     "align": "center"
    },
    {
     "type": "points_card",
     "text_ref": "对方签回",
     "whole_block": true,
     "row": "status"
    },
    {
     "type": "points_card",
     "text_ref": "不用签名",
     "whole_block": true,
     "row": "status"
    },
    {
     "type": "notice",
     "text_ref": "交出去这一步"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题，下面一段引言。中间一张六行三列的大表格，左列每一行前画一级小台阶，六级台阶从下往上排成一段绿色阶梯（阶梯画在表格左边，和六行对齐）。表格右边一张竖卡片“对方签回，另记一笔”，卡片顶上一个小插画：一个信封里露出一张签好名的纸。卡片下面一张小卡“不用签名的事”。最下面一条浅绿底细横条，写“交出去这一步”那一句，约法两个字画成链接样式。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "六级台阶与六行对齐、签回卡内部信封插画，目前 table/staircase 字段及独立插画不能完成该原构图。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：原信封等比限高190，右侧签回/不用签名说明与左状态表高度平衡。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "做好了，不等于交出去了",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "每件事的状态"
    },
    {
     "type": "table",
     "text_ref": "状态",
     "icons": "auto",
     "staircase": true
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "points_card",
     "text_ref": "对方签回",
     "whole_block": true
    },
    {
     "type": "points_card",
     "text_ref": "不用签名",
     "whole_block": true
    },
    {
     "type": "notice",
     "text_ref": "交出去这一步"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题和引言在上；表格改成六张小卡片从上到下，每张卡片一级状态：粗体状态名、下面“只说明”一行、“不能说明”一行，左边一级小台阶；然后“对方签回”卡、“不用签名”卡；最后浅绿横条。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "六级台阶与六行对齐、签回卡内部信封插画，目前 table/staircase 字段及独立插画不能完成该原构图。"
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
   "asset": "_library/illustrations/信封文件.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "信封文件",
   "source_phrase": "表格右边一张竖卡片“对方签回，另记一笔”，卡片顶上一个小插画：一个信封里露出一张签好名的纸。",
   "sha256": "4c84d57aec93f5fa654626301c1df6fb7f3fa5364a34647567e2b7a89e1d4717",
   "status": "ready",
   "original_elements": [
    "一个信封里露出一张签好名的纸"
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
   "asset": "_library/titles/title-2acd8ac623a7ebf6731f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2acd8ac623a7ebf6731f",
   "title_text": "做好了，不等于交出去了",
   "sha256": "9d7834a2c4b4272a45f8ed6c6f823baf9063b7481f01df5fd19b595d9fcc904a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

做好了，不等于交出去了

每件事的状态一级一级往前走，每走一级都要有凭据：原件、回执，或者我明确说了一句。没有凭据就停在原地，标“待核”，不自动往前跳。

| 状态 | 只说明 | 不能说明 |
|---|---|---|
| 做好了 | 按这一版内容生成并查过 | 签了、交了、对方看过 |
| 签好了 | 我这一方的签名已印上，签名图和它的内容指纹已记下 | 对方签了、同意了 |
| 可以交出 | 交哪一版、交给谁、怎么交、附件和内容指纹都定了 | 已经发出 |
| 已交出 | 有发出的凭据或我记了一句，并对得上这一版 | 对方收到了 |
| 已收到 | 对方用能留下来的方式确认收到 | 对方同意或办了 |
| 已办理 | 对方实际处理了，有来源 | 别的没记下的结论 |

**对方签回，另记一笔**：对方签好寄回的完整文件放进原件，记下时间、大小和内容指纹。它不等于我签好了，也不等于已收到或已办理，更推不出已付款、已验收；对方只是口头说签了，就照实记“不确定”。

**不用签名的事**：在事项卡里写明“不需要签名”再往下走，不伪造签名文件。

**交出去这一步**：发邮件、寄出、在网站上提交，由我自己做；要 AI 代发，得我明确说发哪一版、发给谁（〔约法 L15〕）。

::screen{#personal-formal-documents-05 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-05",
  "section": "usage",
  "title": "出了岔子怎么办",
  "scene": "横版画面：左上标题。一张两列大表格占满屏宽，九行，表头浅绿底；每行左列前一个小水彩图标（一台冒烟的小电脑、一张打叉的纸、一枚碎掉的签名印、一个只有一个人的握手、一张被改动的纸上有个感叹号、一个 U 盘和放大镜、一个旧文件夹、一把锁、一条断开的链子）。右下角一幅小插画：一只手把一张灰色草稿纸放回抽屉，抽屉里整齐排着几个带编号标签的文件夹（标签上不写字）。",
  "portrait": "竖版：标题在上；表格改成九张小卡片从上到下，每张卡片上面是左列“情况”（粗体），下面是右列“它怎么办”，左边一个小图标；插画放在最下面。",
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
     "text_ref": "出了岔子怎么办",
     "align": "center",
     "size": "medium",
     "row": "balanced-heading",
     "width": "88%"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "target_width": "100%",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "icons": "auto"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。一张两列大表格占满屏宽，九行，表头浅绿底；每行左列前一个小水彩图标（一台冒烟的小电脑、一张打叉的纸、一枚碎掉的签名印、一个只有一个人的握手、一张被改动的纸上有个感叹号、一个 U 盘和放大镜、一个旧文件夹、一把锁、一条断开的链子）。右下角一幅小插画：一只手把一张灰色草稿纸放回抽屉，抽屉里整齐排着几个带编号标签的文件夹（标签上不写字）。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 9
   },
   "pending_requirements": [
    "九条表格逐项小图标的 icons 字段 table 未消费。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：表格/插画改为75%/25%，插画限制在自己栏宽内。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出了岔子怎么办",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "icons": "auto"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题在上；表格改成九张小卡片从上到下，每张卡片上面是左列“情况”（粗体），下面是右列“它怎么办”，左边一个小图标；插画放在最下面。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 9
   },
   "pending_requirements": [
    "九条表格逐项小图标的 icons 字段 table 未消费。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：撤下手机末尾过小的装饰插画，保留表格全部内容。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "一台冒烟的小电脑",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
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
   "source_phrase": "一张打叉的纸",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "一枚碎掉的签名印",
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
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "人物",
   "source_phrase": "一个只有一个人的握手",
   "sha256": "84f7098cd979eb8bdeccc7587fcf2d78e42d4ff3014093cd65a9829739e0ca28",
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
   "source_phrase": "一张被改动的纸上有个感叹号",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个 U 盘和放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一个旧文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把锁",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断链.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断链",
   "source_phrase": "一条断开的链子",
   "sha256": "8f475338e1eae8c1614422882edcc0696419be567cbbba434c0617d4161dd3ff",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文件收纳现图小槽4比3",
   "source_phrase": "右下角一幅小插画：一只手把一张灰色草稿纸放回抽屉，抽屉里整齐排着几个带编号标签的文件夹（标签上不写字）。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "一只手把一张灰色草稿纸放回抽屉，抽屉里整齐排着几个带编号标签的文件夹（标签上不写字"
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
   "asset": "_library/titles/title-1dce7406fe48315ae005.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1dce7406fe48315ae005",
   "title_text": "出了岔子怎么办",
   "sha256": "70ea9ea3299bf5c01939855f14de395b0ed0be3888e1a95223f12e79c648fa10",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

出了岔子怎么办

| 情况 | 它怎么办 |
|---|---|
| 本机 Microsoft Word 打不开，或导出超过 180 秒 | 换用备用的 ReportLab 直接排 PDF，照样逐页检查，清单里记下用了哪个、为什么；缺中文字体就不出，不交缺字的文件 |
| 逐页检查没过 | 只留这次的草稿，不封材料包；改完用新编号重做，旧的不覆盖 |
| 签名图在 Word 里找不回，或 PDF 里没有图 | 直接报错，不出文件 |
| 协议只有一方，或我的名字对上了不止一方 | 拒绝生成，说清哪里不对 |
| 生成过程中，请求文件被改了 | 报错停下，免得文件和记下的输入对不上 |
| 材料包拷到别处，不放心缺没缺 | 对那个文件夹跑一次核对，按清单逐个比文件、大小和内容指纹 |
| 早一版做的材料包 | 照样能查它当时带的文件，但会明说它不自带全部证明，不报“可以交出” |
| 个人资料锁着 | 先请我验证，不换个路子绕过去读原件 |
| 原件路径是快捷方式或链接 | 已登记且目标一致的目录入口除外，其余拒绝 |

::screen{#personal-formal-documents-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-06",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。一张从左到右、分两行的流程图，八个节点（上四下四，第 4 个节点到第 5 个节点用拐弯的绿色箭头连下来），每个节点一个小水彩图标、粗体小标题、两三行小字；节点之间用绿色箭头连。图标依次是：一张花括号形状的纸、一面放大镜照清单、一支笔写在带页脚的纸上、一个蓝色 W 文档变成红色 PDF 文档（图标上不写字）、两张纸叠在一起对齐、一张纸变成一排小缩略图和一张灰色缩略图、一个带封条的文件夹、一个 U 盘和一个打钩。底部一行小字写代码规模。",
  "portrait": "竖版：标题在上；八个节点改成一列从上到下，每个节点一整行宽，节点之间一个向下的绿色小箭头；底部那行小字放在最后。",
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
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "请求文件",
     "columns": 4,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "turn_after": [
      4
     ],
     "path": "z_order"
    },
    {
     "type": "prose",
     "text_ref": "Python写成"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。一张从左到右、分两行的流程图，八个节点（上四下四，第 4 个节点到第 5 个节点用拐弯的绿色箭头连下来），每个节点一个小水彩图标、粗体小标题、两三行小字；节点之间用绿色箭头连。图标依次是：一张花括号形状的纸、一面放大镜照清单、一支笔写在带页脚的纸上、一个蓝色 W 文档变成红色 PDF 文档（图标上不写字）、两张纸叠在一起对齐、一张纸变成一排小缩略图和一张灰色缩略图、一个带封条的文件夹、一个 U 盘和一个打钩。底部一行小字写代码规模。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 8
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：使用现有 z_order 回绕连线，各排从左到右；移除规格自己添加的失败叉号。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "请求文件",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "Python写成"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题在上；八个节点改成一列从上到下，每个节点一整行宽，节点之间一个向下的绿色小箭头；底部那行小字放在最后。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 8
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：使用现有 z_order 回绕连线，各排从左到右；移除规格自己添加的失败叉号。"
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
   "source_phrase": "请求文件｜AI 把这件事写成一份 JSON（formal.request.json），格式由 JSON Schema 固定：几方、收件方、事实、约定、附件、要不要签名",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "先查计划｜formal-plan：查格式、日期是不是真实存在、编号不重复、签约方和签名人对得上，附件和签名图都读得到",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "source_phrase": "写 Word｜python-docx 排版：A4 纸、四边 25 毫米、宋体正文、黑体标题、页脚居中页码",
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
   "source_phrase": "转 PDF｜调本机 Microsoft Word 导出；Word 不在就换 ReportLab 备用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "读回核对｜Word 和 PDF 里的字逐条对照输入；签名图按内容指纹在 Word 里找得到，PDF 里至少有一张图；每页都有页码",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "逐页出图｜Poppler 的 pdftoppm 按 120 dpi 把每页转成图片，再各出一张灰度图；墨迹不到整页 0.08% 算空白页，四边最外一圈太深算字压到纸边",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "封存｜formal-build：原样的输入、Word、PDF、附件、检查结果、签名快照连同清单放进一个新文件夹；全部通过，才另复制出一份“可以交出”的材料包",
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "随时再核｜formal-verify：按清单重新比每个文件的大小和内容指纹，再重跑一遍检查",
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

1. **请求文件**｜AI 把这件事写成一份格式固定的请求文件：几方、收件方、事实、约定、附件、要不要签名
2. **先查计划**｜查格式、日期是不是真实存在、编号不重复、签约方和签名人对得上，附件和签名图都读得到
3. **写 Word**｜python-docx 排版：A4 纸、四边 25 毫米、宋体正文、黑体标题、页脚居中页码
4. **转 PDF**｜调本机 Microsoft Word 导出；Word 不在就换 ReportLab 备用
5. **读回核对**｜Word 和 PDF 里的字逐条对照输入；签名图按内容指纹在 Word 里找得到，PDF 里至少有一张图；每页都有页码
6. **逐页出图**｜用开源的 Poppler 按 120 dpi 把每页转成图片，再各出一张灰度图；墨迹不到整页 0.08% 算空白页，四边最外一圈太深算字压到纸边
7. **封存**｜原样的输入、Word、PDF、附件、检查结果、签名快照连同清单放进一个新文件夹；全部通过，才另复制出一份“可以交出”的材料包
8. **随时再核**｜按清单重新比每个文件的大小和内容指纹，再重跑一遍检查

Python 写成：主程序 1,839 行（不算空行），另用共用的检查模块 1,426 行；39 个自动测试只用虚构内容，不碰真实事项和我的签名。

::screen{#personal-formal-documents-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-07",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。标题下面一行灰色小字（“这些设计都做好了”那句，左边一颗黄色小圆点）。左边约三分之二宽，九张横向小卡片两列排（左列五张、右列四张），每张一个小水彩图标、粗体一句原则、一两行小字；图标依次是：一张纸分成两个文件、一面放大镜挡住一张打叉的纸、一张纸的一角被裁下放进旁边的小清单、一栏绿色签名一栏空横线、一段不会自己往上走的六级小台阶、一个带封条的文件夹旁一个 U 盘、一个新编号的文件夹摞在旧的上面、一叠打开的纸（不是数据库圆柱）、一把锁在一台电脑上。右边约三分之一宽，一列三个大数字卡。底部一条浅绿底细横条，写配合的那一句，三处画成链接样式。",
  "portrait": "竖版：标题和灰色小字在上；九张原则卡片改成一列从上到下；三个大数字改成一行三个小卡；底部浅绿横条最后。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/"
   },
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
   },
   {
    "text": "怎么协作",
    "href": "/how/#personal-formal-documents"
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
     "size": "medium"
    },
    {
     "type": "notice",
     "text_ref": "这些设计",
     "tone": "yellow"
    },
    {
     "type": "feature_card",
     "text_ref": "一份内容，两种文件",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "flow": "column",
     "rows": 3,
     "portrait_columns": 1
    },
    {
     "type": "stat_card",
     "text_ref": "1,839行",
     "columns": 3,
     "columns_v": 3,
     "icons": [
      "_library/icons/代码窗口.png",
      "_library/icons/打勾清单.png",
      "_library/icons/打勾清单.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "我的姓名"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。标题下面一行灰色小字（“这些设计都做好了”那句，左边一颗黄色小圆点）。左边约三分之二宽，九张横向小卡片两列排（左列五张、右列四张），每张一个小水彩图标、粗体一句原则、一两行小字；图标依次是：一张纸分成两个文件、一面放大镜挡住一张打叉的纸、一张纸的一角被裁下放进旁边的小清单、一栏绿色签名一栏空横线、一段不会自己往上走的六级小台阶、一个带封条的文件夹旁一个 U 盘、一个新编号的文件夹摞在旧的上面、一叠打开的纸（不是数据库圆柱）、一把锁在一台电脑上。右边约三分之一宽，一列三个大数字卡。底部一条浅绿底细横条，写配合的那一句，三处画成链接样式。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "黄色状态提示条实际沿用浅绿，待组件样张确认；九原则已用 h:flow=column,rows=5 实现左五右四，竖版单列。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
     "type": "notice",
     "text_ref": "这些设计",
     "tone": "yellow"
    },
    {
     "type": "feature_card",
     "text_ref": "一份内容，两种文件",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "flow": "row",
     "rows": 5,
     "portrait_columns": 1
    },
    {
     "type": "stat_card",
     "text_ref": "1,839行",
     "columns": 1,
     "columns_v": 1,
     "icons": [
      "_library/icons/代码窗口.png",
      "_library/icons/打勾清单.png",
      "_library/icons/打勾清单.png"
     ],
     "portrait_columns": 1
    },
    {
     "type": "notice",
     "text_ref": "我的姓名"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：标题和灰色小字在上；九张原则卡片改成一列从上到下；三个大数字改成一行三个小卡；底部浅绿横条最后。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "黄色状态提示条实际沿用浅绿，待组件样张确认；九原则已用 h:flow=column,rows=5 实现左五右四，竖版单列。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：手机版数字卡每排一张，避免数字和单位折断。"
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
   "source_phrase": "一份内容，两种文件。 Word 给我改，PDF 给人看；都从同一份请求生成，生成后逐字读回，两边不会各说各的。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "先查再动笔。 名字对不上、日期不存在、附件读不到，在生成前就拦下，不先做出一份半对的文件再返工。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "正文只写对方该看的。 事项编号、打算怎么递送这些是给我和 AI 记账用的，留在清单里；印进正文，对方看到的是一堆和他无关的内部编号和我自己的打算。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "只签我这一方。 协议里对方的签字处和日期一律留空；AI 不推断对方签了，也不推断合同已经生效。代写时最怕把对方那栏也填上，看着像对方已经签了。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "状态不自己往前跳。 本地做好、签好，从不会被写成“已交出”；AI 做完常说一句“已完成”，分级是为了让我分得清到底到了哪一步。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "材料包自带证明。 输入、每页检查图、签名快照都在包里，拷到 U 盘或发给别人后，在空文件夹里也能单独核对缺没缺、改没改。",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "做过的不改。 每次生成用新编号、新文件夹，旧包不覆盖；我后来改了本人信息，已经签好或交出的也不追改。",
   "sha256": "021dd20fa27e238fe3c8aa4aca6e699a49c80ad63d4abcad60dc8ff1e0068aa5",
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
   "source_phrase": "不上数据库。 事项卡、原件、记录都是能直接打开的文件；要换 SQLite，得先在两次真实使用里测到同一个瓶颈，而且文件的办法修不好。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "私事不进 GitHub。 仓库只放代码、模板、格式定义和虚构测试，保持私有；原件、签名和生成的文件都在本机加密盘里。",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "1,839 行 主程序",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "39 个 自动测试，9 月 28 日全部通过",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "120 dpi 逐页检查时每页转图的精度",
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

这些设计都做好了、测过，还没在真实的文书上用过。

- **一份内容，两种文件。** Word 给我改，PDF 给人看；都从同一份请求生成，生成后逐字读回，两边不会各说各的。
- **先查再动笔。** 名字对不上、日期不存在、附件读不到，在生成前就拦下，不先做出一份半对的文件再返工。
- **正文只写对方该看的。** 事项编号、打算怎么递送这些是给我和 AI 记账用的，留在清单里；印进正文，对方看到的是一堆和他无关的内部编号和我自己的打算。
- **只签我这一方。** 协议里对方的签字处和日期一律留空；AI 不推断对方签了，也不推断合同已经生效。代写时最怕把对方那栏也填上，看着像对方已经签了。
- **状态不自己往前跳。** 本地做好、签好，从不会被写成“已交出”；AI 做完常说一句“已完成”，分级是为了让我分得清到底到了哪一步。
- **材料包自带证明。** 输入、每页检查图、签名快照都在包里，拷到 U 盘或发给别人后，在空文件夹里也能单独核对缺没缺、改没改。
- **做过的不改。** 每次生成用新编号、新文件夹，旧包不覆盖；我后来改了本人信息，已经签好或交出的也不追改。
- **不上数据库。** 事项卡、原件、记录都是能直接打开的文件；要换 SQLite，得先在两次真实使用里测到同一个瓶颈，而且文件的办法修不好。
- **私事不进 GitHub。** 仓库只放代码、模板、格式定义和虚构测试，保持私有；原件、签名和生成的文件都在本机加密盘里。

**1,839 行**｜主程序（不算空行）
**39 个**｜自动测试，10 月 10 日现跑全部通过
**120 dpi**｜逐页检查时每页转图的精度

我的姓名、住址这类基本情况从〔个人理解库〕取，找不到的原件交给〔个人材料查找〕；和别的项目怎么配合，见〔怎么协作〕。

::screen{#personal-formal-documents-08 section="features"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：两张同一个网格，拼起来是一整段（这是第一张）。顶上是标题，标题下面一行图例（六个状态各一个小标记：绿圆点、黄圆点、空心绿圈、灰圆点、浅灰圆点、小叉，后面跟文字）。下面按组排功能卡，组名是一条横跨网格的细分隔条（左端粗体组名，组名不单独占一列），分隔条下面该组的功能卡三张一行。每张功能卡：左上小水彩图标，粗体功能名，下面一两行说明，右上角一个黄色小圆点。三组依次是：定下这件事（2 张）、写文书（4 张）、出文件（3 张）。",
  "portrait": "竖版：标题和图例在上（图例可折成两行）；每组的分隔条横跨全宽，下面的功能卡改成一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "g-matter",
    "text": "定下这件事"
   },
   {
    "id": "f-matter-card",
    "text": "事项卡和原件"
   },
   {
    "id": "f-plan",
    "text": "先查再做"
   },
   {
    "id": "g-write",
    "text": "写文书"
   },
   {
    "id": "f-contract",
    "text": "合同协议"
   },
   {
    "id": "f-notice",
    "text": "通知和声明"
   },
   {
    "id": "f-bases",
    "text": "附上依据原文"
   },
   {
    "id": "f-attachments",
    "text": "附件一起装包"
   },
   {
    "id": "g-produce",
    "text": "出文件"
   },
   {
    "id": "f-same-source",
    "text": "一份内容出 Word 和 PDF"
   },
   {
    "id": "f-print",
    "text": "打印版"
   },
   {
    "id": "f-fallback",
    "text": "Word 不在也能出 PDF"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pfd-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（15项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用"
    },
    {
     "type": "feature_card",
     "text_ref": "定下这件事",
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
   "source_layout": "横版画面：两张同一个网格，拼起来是一整段（这是第一张）。顶上是标题，标题下面一行图例（六个状态各一个小标记：绿圆点、黄圆点、空心绿圈、灰圆点、浅灰圆点、小叉，后面跟文字）。下面按组排功能卡，组名是一条横跨网格的细分隔条（左端粗体组名，组名不单独占一列），分隔条下面该组的功能卡三张一行。每张功能卡：左上小水彩图标，粗体功能名，下面一两行说明，右上角一个黄色小圆点。三组依次是：定下这件事（2 张）、写文书（4 张）、出文件（3 张）。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "无编号的“功能名｜说明｜状态”被解析成 para；feature_card 未将其拆成功能卡、图标与右上状态点。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（15项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用"
    },
    {
     "type": "feature_card",
     "text_ref": "定下这件事",
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
   "source_layout": "竖版：标题和图例在上（图例可折成两行）；每组的分隔条横跨全宽，下面的功能卡改成一行一张。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "无编号的“功能名｜说明｜状态”被解析成 para；feature_card 未将其拆成功能卡、图标与右上状态点。"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "事项卡和原件｜一件事一张卡，记事实、目的、现在到哪、下一步；原件原样放进这件事自己的原件文件夹，不另存一份摘要｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "先查再做｜生成前先查格式、日期、编号、签约方和签名人，附件和签名图读不读得到，不合格就停｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "合同协议｜起草合同、协议和补充条款，也审阅对方给的合同；当事人、订立背景、约定条款三节，每个签约方各有签字和日期位置｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "通知和声明｜我一方出具的正式说明：致收件方、出具人、事实与经过、声明事项｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "附上依据原文｜我给了、核过的合同条款或法规原文放进“依据”一节，没给不写｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "附件一起装包｜附件原样复制进材料包，记下内容指纹，正文末尾列附件清单｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "一份内容出 Word 和 PDF｜能改的 Word 和阅读用的 PDF 同时出，生成后逐字读回对照输入｜●待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "打印版｜说要打印才出：每页另查灰度图，签名和真实日期照样印好｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "Word 不在也能出 PDF｜Word 打不开或超时，换 ReportLab 排版，同样的检查，清单记下原因｜●待验收",
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
   "asset": "_library/titles/title-64159624b0111b83110c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-64159624b0111b83110c",
   "title_text": "全部功能（15 项）",
   "sha256": "a06d606c6c4cddbf07d9b054102b5f6bd90af4b965ea05e0735685b15c72f94b",
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
   "asset": "_library/titles/title-12dbeba3bcb9a68041cc.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-12dbeba3bcb9a68041cc",
   "title_text": "写文书",
   "sha256": "1d4674a83bcae6b6bc17502df26de8c157de3b02df16c115b83bb6fd20a1a9f0",
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
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-71d8ae12c3fa89eb64cf.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-71d8ae12c3fa89eb64cf",
   "title_text": "定下这件事",
   "sha256": "c856187de2f5ae7eb7739698cf2e2eb3fb6f3785963a0e206a8c353a1565414a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（15 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**定下这件事**
事项卡和原件｜一件事一张卡，记事实、目的、现在到哪、下一步；原件原样放进这件事自己的原件文件夹，不另存一份摘要｜●待验收
先查再做｜生成前先查格式、日期、编号、签约方和签名人，附件和签名图读不读得到，不合格就停｜●待验收

**写文书**
合同协议｜起草合同、协议和补充条款，也审阅对方给的合同；当事人、订立背景、约定条款三节，每个签约方各有签字和日期位置｜●待验收
通知和声明｜我一方出具的正式说明：致收件方、出具人、事实与经过、声明事项｜●待验收
附上依据原文｜我给了、核过的合同条款或法规原文放进“依据”一节，没给不写｜●待验收
附件一起装包｜附件原样复制进材料包，记下内容指纹，正文末尾列附件清单｜●待验收

**出文件**
一份内容出 Word 和 PDF｜能改的 Word 和阅读用的 PDF 同时出，生成后逐字读回对照输入｜●待验收
打印版｜说要打印才出：每页另查灰度图，签名和真实日期照样印好｜●待验收
Word 不在也能出 PDF｜Word 打不开或超时，换 ReportLab 排版，同样的检查，清单记下原因｜●待验收

::screen{#personal-formal-documents-09 section="features"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：接着上一张的同一个网格（这是第二张），没有标题、没有图例，直接接着排。两组依次是：检查和签名（2 张）、交出去以后（4 张）；组名是横跨网格的细分隔条，功能卡三张一行，右上角黄色小圆点。网格下面空出来的地方画一幅横向小插画：一张桌上从左到右排着一份草稿、一份签好名的协议、一个带封条的文件夹、一个信封、一个回执小票，每两样之间一个绿色小箭头（插画上不写字）。",
  "portrait": "竖版：同上一张的竖版，组分隔条横跨全宽，功能卡一行一张；插画放在最后，改成从上到下排。",
  "links": [],
  "anchors": [
   {
    "id": "g-check",
    "text": "检查和签名"
   },
   {
    "id": "f-page-check",
    "text": "逐页检查"
   },
   {
    "id": "f-sign",
    "text": "签名定稿"
   },
   {
    "id": "g-deliver",
    "text": "交出去以后"
   },
   {
    "id": "f-package-verify",
    "text": "材料包验真"
   },
   {
    "id": "f-legacy",
    "text": "核对早一版的材料包"
   },
   {
    "id": "f-delivery",
    "text": "交出和进展"
   },
   {
    "id": "f-countersign",
    "text": "对方签回单独记"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pfd-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "检查和签名",
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
   "source_layout": "横版画面：接着上一张的同一个网格（这是第二张），没有标题、没有图例，直接接着排。两组依次是：检查和签名（2 张）、交出去以后（4 张）；组名是横跨网格的细分隔条，功能卡三张一行，右上角黄色小圆点。网格下面空出来的地方画一幅横向小插画：一张桌上从左到右排着一份草稿、一份签好名的协议、一个带封条的文件夹、一个信封、一个回执小票，每两样之间一个绿色小箭头（插画上不写字）。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 8
   },
   "pending_requirements": [
    "无编号的“功能名｜说明｜状态”仍为 para，未形成六张功能卡和状态点。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：撤下两处重复首屏装饰图，以现有功能卡和时间线承担叙事，不引入新图。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "检查和签名",
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
   "source_layout": "竖版：同上一张的竖版，组分隔条横跨全宽，功能卡一行一张；插画放在最后，改成从上到下排。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 8
   },
   "pending_requirements": [
    "无编号的“功能名｜说明｜状态”仍为 para，未形成六张功能卡和状态点。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：撤下两处重复首屏装饰图，以现有功能卡和时间线承担叙事，不引入新图。"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "逐页检查｜每页转成图片查空白页、压边、页码，读回签名图；没过不出材料包｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "签名定稿｜只在我这一方印签名图和日期，签名资料和签名图各留一份快照｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "材料包验真｜拷到哪都能按清单核对：文件一个不少、一个字节没改｜●待验收",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核对早一版的材料包｜早一版做的包照样能查，并明说它缺哪些自带证明｜●待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "交出和进展｜已交出、已收到、已办理各记一级，都要凭据；本地做好不算交出｜●待验收",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件写作",
   "source_phrase": "对方签回单独记｜对方签好寄回的文件放进原件，单记一笔，不推断已付款或已验收｜●待验收",
   "sha256": "78fcd9b3010d8edec8e13e231dfa01eb6e1bf1de47e99caa67705f10f6b47ec8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
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
   "slot_ordinal": 8,
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-formal-documents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-formal-documents",
   "source_phrase": "网格下面空出来的地方画一幅横向小插画：一张桌上从左到右排着一份草稿、一份签好名的协议、一个带封条的文件夹、一个信封、一个回执小票，每两样之间一个绿色小箭头（插画上不写字）。",
   "sha256": "dd0d6900de4c91a553f10202fc97b1011007055899ad6135ab2e0c9bbfa6b210",
   "status": "ready",
   "original_elements": [
    "一张桌上从左到右排着一份草稿、一份签好名的协议、一个带封条的文件夹、一个信封、一个回执小票，每两样之间一个绿色小箭头（插画上不写字"
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
   "asset": "_library/titles/title-4838a86fa5e80b84f791.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4838a86fa5e80b84f791",
   "title_text": "交出去以后",
   "sha256": "2f81582431334c08025982be58e6e229c5789f9131bc8fe77b45eeb23182ee1a",
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
   "asset": "_library/titles/title-d454208294c410aa104a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d454208294c410aa104a",
   "title_text": "检查和签名",
   "sha256": "462ca91dd870725ae37a3547df0faabb5022cdfc429438235b0f7552cadc159c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**检查和签名**
逐页检查｜每页转成图片查空白页、压边、页码，读回签名图；没过不出材料包｜●待验收
签名定稿｜只在我这一方印签名图和日期，签名资料和签名图各留一份快照｜●待验收

**交出去以后**
材料包验真｜拷到哪都能按清单核对：文件一个不少、一个字节没改｜●待验收
核对早一版的材料包｜早一版做的包照样能查，并明说它缺哪些自带证明｜●待验收
交出和进展｜已交出、已收到、已办理各记一级，都要凭据；本地做好不算交出｜●待验收
对方签回单独记｜对方签好寄回的文件放进原件，单记一笔，不推断已付款或已验收｜●待验收

::screen{#personal-formal-documents-10 section="history"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-10",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左上标题。一条从左到右的水彩时间线，六个节点，每个节点上方粗体日期、下方一两行小字；最后一个节点画成空心绿圈加一个小问号气泡，表示还等第一次真用。时间线下方一幅细长插画：一叠纸逐渐变成一个带封条的文件夹。",
  "portrait": "竖版：时间线改成从上到下的竖线，六个节点左边日期、右边小字；插画放在最下面。",
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
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "7月20日",
     "columns": 6,
     "direction": "horizontal",
     "connector": "line",
     "illustration": "none",
     "last_marker": "none"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版画面：左上标题。一条从左到右的水彩时间线，六个节点，每个节点上方粗体日期、下方一两行小字；最后一个节点画成空心绿圈加一个小问号气泡，表示还等第一次真用。时间线下方一幅细长插画：一叠纸逐渐变成一个带封条的文件夹。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "最后节点的空心圈及问号气泡需组件实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：撤下两处重复首屏装饰图，以现有功能卡和时间线承担叙事，不引入新图。；page-fixer-03 审页修复：末日期节点取消规格添加的问号圈，与同排节点顶对齐。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "7月20日",
     "columns": 1,
     "direction": "vertical",
     "connector": "line",
     "illustration": "none",
     "last_marker": "none"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版：时间线改成从上到下的竖线，六个节点左边日期、右边小字；插画放在最下面。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "最后节点的空心圈及问号气泡需组件实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；page-fixer-03 审页修复：撤下两处重复首屏装饰图，以现有功能卡和时间线承担叙事，不引入新图。；page-fixer-03 审页修复：末日期节点取消规格添加的问号圈，与同排节点顶对齐。"
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
   "asset": "_library/illustrations/main-personal-formal-documents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-formal-documents",
   "source_phrase": "时间线下方一幅细长插画：一叠纸逐渐变成一个带封条的文件夹。",
   "sha256": "dd0d6900de4c91a553f10202fc97b1011007055899ad6135ab2e0c9bbfa6b210",
   "status": "ready",
   "original_elements": [
    "一叠纸逐渐变成一个带封条的文件夹"
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

- **7 月 20 日**　最早一版：正式文书的生成和版面检查工具。
- **8 月 31 日**　扩成“个人正式文书”：合同和通知有了自己的格式，和三步命令：先查计划、生成、核对。
- **9 月 1 日**　材料包改成自带全部证明，拷走也能单独核对。
- **9 月 24 日**　修好生成和资料锁接入上的几处毛病。
- **9 月 27 日**　协议按用途排版：当事人、订立背景、约定条款；每个签约方各有签字位，只签我这一方；事项编号这类内部登记从正文拿掉。
- **9 月 28 日**　现跑 39 个自动测试，全部通过；还没在真实的合同或通知上用过，第一次真用时一起验收，过了就把功能改成“在用”。

::screen{#personal-formal-documents-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "personal-formal-documents-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/document-materials/fictional-after-sales-page.webp",
    "caption": "示例，内容完全虚构：同一份内容出了 Word 和 PDF 两份文件；这一页转成图片后，彩色和黑白都检查过。",
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
     "text_ref": "示例，内容完全虚构：同一份内容出了Word和PDF两份文件",
     "indices": [
      0
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "992:1404"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
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
     "text_ref": "示例，内容完全虚构：同一份内容出了Word和PDF两份文件",
     "indices": [
      0
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "992:1404"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
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

示例，内容完全虚构：同一份内容出了 Word 和 PDF 两份文件；这一页转成图片后，彩色和黑白都检查过。
