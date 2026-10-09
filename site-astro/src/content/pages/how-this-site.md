---
{
 "title": "这个网页是怎么做的",
 "kind": "how-this-site",
 "url": "/how-this-site/",
 "tagline": "一个人提要求，多路 AI 分工做、互相把关，再把这个网站改到好维护。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "who",
   "label": "谁做什么"
  },
  {
   "id": "first-generation",
   "label": "第一代"
  },
  {
   "id": "bottleneck",
   "label": "卡在了维护"
  },
  {
   "id": "typesetting",
   "label": "转折"
  },
  {
   "id": "parallel",
   "label": "分工与并行施工"
  },
  {
   "id": "quality",
   "label": "怎样才算做完"
  },
  {
   "id": "motion",
   "label": "一本会动的水彩画册"
  },
  {
   "id": "speed",
   "label": "让网页快起来"
  },
  {
   "id": "repairs",
   "label": "出了岔子怎么修"
  },
  {
   "id": "decisions",
   "label": "我来拍板"
  },
  {
   "id": "numbers",
   "label": "以后怎么更新"
  }
 ],
 "page": {
  "schema": "site-b2.page.v1",
  "page": "how-this-site",
  "kind": "how-this-site",
  "title": "这个网页是怎么做的",
  "url": "/how-this-site/",
  "tagline": "一个人提要求，多路 AI 分工做、互相把关，再把这个网站改到好维护。",
  "status": "文案定稿；10 月 7 日补进当天定稿的新功能，标“正在接入”的上线核对后去掉标记。",
  "based_on": {
   "commit": "403776c7dd9ee15875b6248fa83c4d037c0e4519",
   "commit_time": "",
   "file": "第二稿H1—H4答复、创意终稿答复；sources/pages、scripts/check-typeset-site.py、config/build.json、site-release/release-manifest.json 与已核验 E230",
   "observed_at_beijing": "2026-10-07T14:57:28.679547+08:00"
  },
  "video_prompt": "",
  "video_prompt_en": "",
  "registry": {
   "numbers": [
    {
     "id": "n-pages",
     "text": "80 多页、700 多屏",
     "meaning": "本轮清点：84页740屏；本页16屏改12屏后为84页736屏。首页另算。",
     "as_of": "2026-10-04",
     "source": "typeset-inventory/stats.json；按pages_manifest现读核对",
     "screens": [
      "how-this-site-12"
     ]
    },
    {
     "id": "n-parallel",
     "text": "约 30 路",
     "meaning": "一次29个任务目录的施工安排，20页代理和4组件工程师等；不是累计调用或瞬时成功运行数。",
     "as_of": "2026-10-04",
     "source": "HANDOFF:94-95",
     "screens": [
      "how-this-site-06",
      "how-this-site-12"
     ]
    },
    {
     "id": "n-components",
     "text": "40 多类",
     "meaning": "清点44类组件，不等于44个独立程序。",
     "as_of": "2026-10-04",
     "source": "typeset-inventory/components.md:3-7；stats.json",
     "screens": [
      "how-this-site-06"
     ]
    },
    {
     "id": "n-first-batch",
     "text": "约 900 张／约 1,300 次",
     "meaning": "第一批主生产线922目标图，1336次成功生图调用；旧批计数保留历史范围。",
     "as_of": "2026-10-04",
     "source": "第一批progress-summary.json，10月1日14:35核实记录",
     "screens": [
      "how-this-site-03",
      "how-this-site-12"
     ]
    },
    {
     "id": "n-typeset",
     "text": "约 1,400 个横竖版",
     "meaning": "round-17记录1435方向、1418程序pass、17未完成；G7/观感仍须人工验，不是全站完工。",
     "as_of": "2026-10-04",
     "source": "typeset-out/_site-summary.json（10月4日03:02）",
     "screens": [
      "how-this-site-07",
      "how-this-site-12"
     ]
    },
    {
     "id": "n-prototype",
     "text": "约 5 秒",
     "meaning": "样板agents整页重出7张图4.8秒，不是全站重出或发布。",
     "as_of": "2026-10-04",
     "source": "HANDOFF:75",
     "screens": [
      "how-this-site-05",
      "how-this-site-12"
     ]
    },
    {
     "id": "n-traffic-day",
     "text": "一天约 300GB",
     "meaning": "本人反馈制作高峰的一天流量，非网站访客流量、非精确计量。",
     "as_of": "2026-10-04",
     "source": "owner-choices.md 流量必须根治一节",
     "screens": [
      "how-this-site-04"
     ]
    },
    {
     "id": "n-traffic-fix",
     "text": "约 37MB → 约 6MB",
     "meaning": "同一张图审一次本机上下行合计36.515MB→6.027MB；不是单向上传。",
     "as_of": "2026-10-04",
     "source": "traffic/summary.md:3",
     "screens": [
      "how-this-site-10"
     ]
    },
    {
     "id": "n-load",
     "text": "约 3 分半／不到 1 秒",
     "meaning": "同一组13张横屏原图；前者Chrome顺序GET 213秒、后者上海迁移HTML样页加载解码0.85秒；测法不完全相同，正文已注明。",
     "as_of": "2026-10-04",
     "source": "speed-host/report.md:25,34；oss-migrate/handoff.md:100,106",
     "screens": [
      "how-this-site-09"
     ]
    },
    {
     "id": "n-update",
     "text": "约 2 小时 40 分",
     "meaning": "12页合并批次（10新页+2重发），158.3766分钟：从品牌定稿到全量线上确认，含等待指令等。",
     "as_of": "2026-10-04",
     "source": "integration/finish-wave2a-report.py:18,29,37；publication-state.json:51",
     "screens": [
      "how-this-site-12"
     ]
    },
    {
     "id": "n-cost",
     "text": "22.43 元",
     "meaning": "10 月阿里云花费，几乎全是我们自己发布和检查时下载对象用掉的；不是访客流量",
     "as_of": "2026-10-07",
     "source": "主持核实（派活说明“已查明的事实”）；owner-decisions「网站资源托管：阿里云余额用完后先省钱」",
     "screens": [
      "how-this-site-10",
      "how-this-site-12"
     ]
    },
    {
     "id": "n-target",
     "text": "45 分钟／3 小时",
     "meaning": "小改、大批从定稿到线上核对完的目标，不是实测值",
     "as_of": "2026-10-07",
     "source": "owner-decisions「网站和基座都不追总行数，按“好维护”的结果管」",
     "screens": [
      "how-this-site-12"
     ]
    }
   ],
   "mentions": [
    {
     "target": "/projects/localocr/",
     "screen": "how-this-site-07",
     "text": "本地文字识别"
    },
    {
     "target": "/how-this-site/#numbers",
     "screen": "how-this-site-01",
     "text": "以后怎么更新与数字口径 ↓"
    },
    {
     "target": "/how-this-site/#quality",
     "screen": "how-this-site-01",
     "text": "发布前怎样才算做完 ↓"
    },
    {
     "target": "/how-this-site/#speed",
     "screen": "how-this-site-01",
     "text": "加载与托管 ↓"
    },
    {
     "target": "/how-this-site/#repairs",
     "screen": "how-this-site-01",
     "text": "出了岔子怎么修 ↓"
    },
    {
     "target": "/how-this-site/#who",
     "screen": "how-this-site-01",
     "text": "这次谁做什么 ↓"
    },
    {
     "target": "/how/#ai-roles",
     "screen": "how-this-site-02",
     "text": "现行型号、档位和分工 → 怎么协作"
    },
    {
     "target": "/projects/wly0829-cn/",
     "screen": "how-this-site-01",
     "text": "个人网站（总看板）"
    }
   ],
   "compare": [],
   "live": []
  },
  "notes": {
   "merged": [
    "按本人选定的第二稿12屏主线重写；保留三件事、错字重画、流量和数字口径。",
    "10 月 7 日按本人 17:40 原话（“这个网页怎么做的需要更新……现在差不多可以定稿了，新功能也加上”）改了第 1、8、9、10、12 屏，其余屏原样不动。",
    "首页清晨、白天、傍晚、晚上和“一分钟循环一天”的选项按本人同条原话保留并写进第 8 屏（“不建议这些按钮砍掉”）。"
   ],
   "dropped": [
    "删除没有记录支持的“画了一周”、官网同条件213秒到不到1秒、全站检查完成等说法；撤销旧16屏的图解人物和逐工位请求。",
    "删掉第 8 屏“小样已经通过……正在接入网站”“还在做的：每一页的画都活起来；一只鸟贯穿全站；‘怎么协作’那页能点着看”：这些 10 月 5—6 日已上线；“翻页像翻画册”没有上线证据，不写。",
    "删掉第 10 屏“刷新方式都已修好并验证，随后续更新上线”：改写成当前状态（告警标题直说、读不到合成一行在接入）。"
   ],
   "unsure": [
    "Claude 已于 10 月 4 日做文字最终定稿与观感复查，改动见 typeset-out/_qa/how-this-site/how-this-site.verdict.md。",
    "【施工前必看】第 10、12 屏的“（正在接入）”对应派活说明里正在做的几项（读不到合成一行、排版和交互检查进发布门、驾驶舱定时巡检）。发布时按线上回读：已上线的删掉标记，没上线的保留。",
    "第 8 屏“‘怎么协作’那页能点着看、驾驶舱‘今天的河’、首页连环画都已上线”按 10 月 6 日 2h 发布前后的提交写（演示、河景、连环画的修复都进了 22:46 那次发布）；施工时在线上看一眼确认。",
    "第 9 屏托管结论按 owner-decisions 10 月 6 日 06:4x「托管不换」一节写；同日 16:2x 另有“内地访问先免费试腾讯 EdgeOne”的安排，若试测已改变托管，按实际改这一句。"
   ],
   "as_of_beijing": "2026-10-07",
   "requirements": [
    "第二稿H1 A：12屏主线，图片数量由AI定。",
    "H2 A：按记录写真型号。",
    "H3 A：旧密钥告警写一句，不出现仓库名和密钥号。",
    "H4 A：真实数字取整。",
    "创意终稿FC1—FC4：全站代码动效、每页有鸟、七件事按顺序做，完成状态如实写。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/how-this-site/page.json",
  "sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
  "converted_at_beijing": "2026-10-10T03:45:10+08:00"
 }
}
---

::screen{#how-this-site-01 section="top"}

```typeset
{
 "screen": {
  "id": "how-this-site-01",
  "section": "top",
  "title": "这个网页是怎么做的",
  "scene": "横版：首屏沿用现有书桌与机器人水彩插画；左侧介绍，下方是更新、发布检查、加载、修错与这次分工的真实章节入口。标题用已有毛笔图。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
  "links": [
   {
    "text": "以后怎么更新与数字口径 ↓",
    "href": "/how-this-site/#numbers"
   },
   {
    "text": "发布前怎样才算做完 ↓",
    "href": "/how-this-site/#quality"
   },
   {
    "text": "加载与托管 ↓",
    "href": "/how-this-site/#speed"
   },
   {
    "text": "出了岔子怎么修 ↓",
    "href": "/how-this-site/#repairs"
   },
   {
    "text": "这次谁做什么 ↓",
    "href": "/how-this-site/#who"
   },
   {
    "text": "个人网站（总看板）",
    "href": "/projects/wly0829-cn/"
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
     "text_ref": "这个网页是怎么做的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "改一处要多久",
     "align": "left"
    },
    {
     "type": "prose",
     "text_ref": "我只做三件事",
     "align": "left",
     "row": "hero",
     "width": "56fr"
    },
    {
     "type": "illustration",
     "asset": "how-this-site/how-this-site-01-illustration-01.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "row": "hero",
     "width": "42fr",
     "target_height": 390
    },
    {
     "type": "action_button",
     "text_ref": "以后怎么更新与数字口径 ↓",
     "align": "left",
     "columns": 2,
     "columns_v": 2
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这个网页是怎么做的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "改一处要多久",
     "align": "left"
    },
    {
     "type": "prose",
     "text_ref": "我只做三件事",
     "align": "left"
    },
    {
     "type": "illustration",
     "asset": "how-this-site/how-this-site-01-illustration-01.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 470
    },
    {
     "type": "action_button",
     "text_ref": "以后怎么更新与数字口径 ↓",
     "align": "left",
     "columns": 2,
     "columns_v": 2
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "source_phrase": "75 页　第 1 批：34 个项目、27 个技能、10 个规则专题、约法和 3 个总页",
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
   "source_phrase": "922 张图　65 页新画的横版和竖版，每张都审过；另外 10 页沿用早先审过的图",
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
   "asset": "_library/round3/clean-assets/png/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "75 条小视频　每页开头 6 秒；新做 41 条花 410 点，付费返工 0 点",
   "sha256": "2e461b29cf52358c1e39e7e7a1960c8761fec83d1c3f75aa0938890b50be1012",
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
   "source_phrase": "84 条意见　独立审查挑出来，复核后定下 58 处要改",
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
   "asset": "_library/illustrations/main-how-this-site.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-how-this-site",
   "source_phrase": "上半屏右边约 45% 宽一幅大水彩插画（开头短视频就从这里取景）：一张浅木色书桌，窗外远山；桌上四个奶白色圆头小机器人在干活——胸前橙色星芒徽章（Claude 标志）的一个坐在桌前在纸上写字；三个胸前黑色花结徽章（OpenAI 标志）的，一个在小画架上画水彩，一个拿放大镜看一张画稿，一个把几张画稿上下接成一长条网页；书桌右下角伸进来一只手（浅绿毛衣袖口），正按下一枚绿色印章；桌边一盆绿植。",
   "sha256": "965947350dbfb6819954dab14115c1bcda2186c989cc828b0cdf475bc3897ad7",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "how-this-site/how-this-site-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\how-this-site\\img\\how-this-site-01-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-84a3b8153a01204bf819",
   "title_text": "这个网页是怎么做的",
   "sha256": "26e38469cdcf7564b4503215a2d8c20ba89d0ebe3848055014125e68d4c76708",
   "status": "ready"
  }
 ]
}
```

# 这个网页是怎么做的

改一处要多久、发布前查什么：先看更新流程与数字口径，再看怎样才算做完。网页怎么快起来、出了岔子怎么修，也有这次制作中实际走过的办法。

我只做三件事：提要求、做决定、验收。其余的活，由几种 AI 分头做：查事实、写稿、画图、排版、挑错、配置托管，再把网页放上网。

这个网站自己就是例子。一开始每屏连字带画全交给 AI 画；卡在维护和流量上以后，改成程序排字、AI 画插画，多路 AI 同时施工、互相挑错。它现在也是我唯一的总看板，它对我有什么用、怎么用，见〔个人网站（总看板）〕。

〔以后怎么更新与数字口径 ↓〕　〔发布前怎样才算做完 ↓〕　〔加载与托管 ↓〕　〔出了岔子怎么修 ↓〕　〔这次谁做什么 ↓〕

::screen{#how-this-site-02 section="who"}

```typeset
{
 "screen": {
  "id": "how-this-site-02",
  "section": "who",
  "title": "谁做什么",
  "scene": "横版：分工流程与准确型号角色表，配已有文稿、画笔、放大镜、代码等图标。不要以灯泡冒充具体AI头像。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
  "links": [
   {
    "text": "现行型号、档位和分工 → 怎么协作",
    "href": "/how/#ai-roles"
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
     "text_ref": "谁做什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "我的要求",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/人物.png",
      "_library/icons/文稿堆.png",
      "_library/icons/代码窗口.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/fix-round-2/icon-clean-f9fad72a795ea7d99a23.png"
     ]
    },
    {
     "type": "table",
     "text_ref": "谁这次做什么"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "谁做什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "我的要求",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/人物.png",
      "_library/icons/文稿堆.png",
      "_library/icons/代码窗口.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/fix-round-2/icon-clean-f9fad72a795ea7d99a23.png"
     ]
    },
    {
     "type": "table",
     "text_ref": "谁这次做什么"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "人物",
   "source_phrase": "我的要求",
   "sha256": "84f7098cd979eb8bdeccc7587fcf2d78e42d4ff3014093cd65a9829739e0ca28",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "→",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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
   "source_phrase": "Claude 写字",
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
   "source_phrase": "→",
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
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "Luna 画图",
   "sha256": "6a6909cabd9e10c5748d7103e00ff25f9bda7bc0551925c9a112b53e29275e81",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "→",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/太阳工具.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "太阳工具",
   "source_phrase": "Sol 审图",
   "sha256": "bbdfe8fe41505397c63194c6f9cfabc10d17a761fae560518d6a66d1f3549adb",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "→",
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
   "asset": "_library/round3/titles/title-r3-c081eedc98f603f50bbf.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\b2-surgery\\b2-how-this-site-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-c081eedc98f603f50bbf",
   "title_text": "谁做什么",
   "sha256": "db86e7e98c4be5cd807be59c9e68277b47874de90fc041801012bc432d785d00",
   "status": "ready"
  }
 ]
}
```

## 谁做什么

我的要求 → Claude 想和把关 → 多路 AI 施工 → 程序检查 → Claude 人眼验收 → 发布后核对

| 谁 | 这次做什么 |
|---|---|
| 我 | 提要求、选方案、看成品，指出要改的地方 |
| Claude Opus 5.5 | 想和把关、拆活派活、写关键文案和提示词；排版框架是前期做过的 |
| GPT-6.1 Sol | 查事实、做组件、接线、独立审查；早期用过 GPT-6 Sol |
| GPT-6 Astra | 风格样图、拼页程序、难活和前端审美复核 |
| GPT-6 Luna | 调用 Codex 内置的生图工具，画整屏、插画和毛笔标题这类量大的素材 |
| Claude Fable 5.1 | 在另一个对话里专管创意：定动效方向、写分镜、审效果 |
| Google Flow | 用 Omni 1.1 Flash 把插画做成短视频；现在改用代码动效，视频留作退路 |

〔现行型号、档位和分工 → 怎么协作〕

::screen{#how-this-site-03 section="first-generation"}

```typeset
{
 "screen": {
  "id": "how-this-site-03",
  "section": "first-generation",
  "title": "第一代：全靠画",
  "scene": "横版：时间与做法按正文排列，配已有整屏水彩样图的局部或机器人画图插画；文字由程序排。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "第一代：全靠画",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "9 月 27 日",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "_library/fix-round-2/icon-clean-73f4eb97ce030aeedfb6.png",
      "_library/icons/小放映机.png",
      "_library/icons/文稿堆.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "画面好看",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "第一代：全靠画",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "9 月 27 日",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "_library/fix-round-2/icon-clean-73f4eb97ce030aeedfb6.png",
      "_library/icons/小放映机.png",
      "_library/icons/文稿堆.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "画面好看",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "9 月 27 日　风格样图 \nGPT-6Astra照我挑中的白底、绿色、手绘水彩风格画了17张样图：网站9张，头像候选3张和定稿1张，GitHub横幅3张和主页1张。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-how-this-site.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-how-this-site",
   "source_phrase": "横版：左上标题。左边约 58% 宽：小节“9 月 27 日　风格样图”一段字；下面小节“9 月 28 日　设计稿写了四版”，一张三列表格，4 行，每行最左边画一张小水彩稿纸，稿纸上画 1、2、3、4 的绿色圆圈序号（序号也写在表格第一列），第 4 行的稿纸上压一枚小小的绿色对勾印章；表格下面一行灰色小字。右边约 40% 宽两个带 1px 浅灰细边框、圆角 8px 的空白截图位，上下排：上面一个竖长的，宽高比 2:3，高约屏高 52%；下面一个 16:9，宽和上面一个相同；每个截图位下面一行灰色小字是图注。截图位里什么都不画，拼页时原样贴真实图。",
   "sha256": "965947350dbfb6819954dab14115c1bcda2186c989cc828b0cdf475bc3897ad7",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-03.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bc263a854c3223dce31d",
   "title_text": "第一代：全靠画",
   "sha256": "89bbc70f2651ab739611d11397ebd4096ed10c1f3771ab4be836f4b927bf7eb0",
   "status": "ready"
  }
 ]
}
```

## 第一代：全靠画

**9 月 27 日，先定风格。** 白底、绿色、手绘水彩；GPT-6 Astra 做风格样图。9 月 29 日前后，开始批量画页面。

**一屏就是一张画。** Claude Opus 5.5 写提示词，GPT-6 Luna 调生图工具，把正文、按钮和插画一起画进去；GPT-6 Sol（后来换成 GPT-6.1 Sol）对照定稿逐字审，GPT-6 Astra 写程序把图拼成网页。

**会动的部分另做。** 从首屏裁出插画，交 Google Flow 用 Omni 1.1 Flash 生成短视频，叠回插画的位置。字仍留在原图里。

**画了多少。** 第一批主线要交约 900 张图，生图工具一共成功出图约 1,300 次；多出来的是重画和没选用的。

画面好看，但文字也被画死在图里。这成了下一步的难题。

::screen{#how-this-site-04 section="bottleneck"}

```typeset
{
 "screen": {
  "id": "how-this-site-04",
  "section": "bottleneck",
  "title": "卡在了维护",
  "scene": "横版：三个阶段的时间线和两个瓶颈卡片，原话单独突出；不画未经证实的一周时间轴。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "卡在了维护",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "从约 9 月 29 日",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "改字也要碰整张画",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-73f4eb97ce030aeedfb6.png",
      "_library/icons/云.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "10 月 3 日凌晨",
     "align": "left"
    },
    {
     "type": "quote",
     "text_ref": "“如果当前方法",
     "variant": "left_line"
    },
    {
     "type": "prose",
     "text_ref": "于是停止",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "卡在了维护",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "从约 9 月 29 日",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "改字也要碰整张画",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-73f4eb97ce030aeedfb6.png",
      "_library/icons/云.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "10 月 3 日凌晨",
     "align": "left"
    },
    {
     "type": "quote",
     "text_ref": "“如果当前方法",
     "variant": "left_line"
    },
    {
     "type": "prose",
     "text_ref": "于是停止",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "source_phrase": "一张画框",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "按钮也是画的 页眉、页脚、按钮、标签都画在图里；能点的地方，网页在图上盖一层看不见的可点区域。",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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
   "source_phrase": "只有会变的留空框 项目页开头的“现在”横条、驾驶舱的状态，画面上留空框，网页从电脑读到实时状态再填进去。",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
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
   "source_phrase": "改字不重画整屏 内容有小改动，在原图上只换那几个字；版面变了才整屏重画。",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-how-this-site.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "main-how-this-site",
   "source_phrase": "同项目网页拆解图主体；关系线和标注由程序画",
   "sha256": "965947350dbfb6819954dab14115c1bcda2186c989cc828b0cdf475bc3897ad7",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-04.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-22c16959eac7968044e3",
   "title_text": "卡在了维护",
   "sha256": "d7d2f151b8088885930ea23bf02149042b79d94c541f348e39907ce032517f51",
   "status": "ready"
  }
 ]
}
```

## 卡在了维护

从约 9 月 29 日开始批量画，到 10 月 3 日凌晨换做法，前后只有四天多。问题不在画得慢，而在改不动。

**改字也要碰整张画。** 字是画进图里的，改一个字就得重画整张；重画又可能漏字、改坏别处。只补一个字更稳，也还要重新核图、接线。

**图片反复传，流量也跟着涨。** 制作最忙的时候，我这边一天用掉约 300GB 流量；这是做图、审图在用，不是访客。

10 月 3 日凌晨，我给了一条硬线：

“如果当前方法不能证明按需更新能在4小时内完成……这个网页后续也维护不了”

于是停止开新的整屏生图，换一条能快速更新的路。

::screen{#how-this-site-05 section="typesetting"}

```typeset
{
 "screen": {
  "id": "how-this-site-05",
  "section": "typesetting",
  "title": "转折：程序排版出图",
  "scene": "横版：程序排字、AI画图、渲染、增量替换四张卡，配现有稿纸或流程插画；样板计时明确范围。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "转折：程序排版出图",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "10 月 3 日凌晨",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "字交给程序",
     "columns": 4,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/代码窗口.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/浏览器标签页.png",
      "_library/icons/文件齿轮.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "样板先给我看",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "转折：程序排版出图",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "10 月 3 日凌晨",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "字交给程序",
     "columns": 4,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/代码窗口.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/浏览器标签页.png",
      "_library/icons/文件齿轮.png"
     ],
     "equal_height": true
    },
    {
     "type": "prose",
     "text_ref": "样板先给我看",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "source_phrase": "一摞资料纸",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张分成三格的稿纸",
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
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "一支钢笔",
   "sha256": "6c4493be74e722fa3e8f1c2c95574768fe9c5da8b6afa27a3f66406d68c9a6a8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把小锁",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/机器人助手通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "机器人助手通用构图",
   "source_phrase": "右边约 38% 宽一幅水彩插画：胸前橙色星芒徽章的奶白小机器人坐在书桌前写字；它左手边一摞资料（一页画着花括号的代码纸、一张打满小对勾的回执、一个文件夹）；它面前摊着一张分成三格的稿纸，三格的小标题依次是“画面”“图上的字”“编号”（就是第二段里的这三个词），格子里只画几道浅灰横线代表字；桌角一个胸前黑色花结徽章的小机器人递过来一张纸（代表 GPT 整理的事实单）。",
   "sha256": "e69d2febfcaf7eb75330eec8be0f5166de6d56595d3cac37bbc4a6a1d7511fe1",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-05.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8c80c2c725cf244f039e",
   "title_text": "转折：程序排版出图",
   "sha256": "ce4a50378e21108cb3bcd861d750b79d908e5d007aec3d18fd336a4829f0f4c5",
   "status": "ready"
  }
 ]
}
```

## 转折：程序排版出图

10 月 3 日凌晨，Claude Opus 5.5 和 GPT-6.1 Sol 各出方案，GPT-6 Astra 独立挑毛病；最后定下：字交给程序排，画留给 AI，只重出改过的部分。

- **字交给程序**　正文、数字、按钮和链接按定稿逐字排版，不再让生图模型猜字。
- **画交给 AI**　水彩插画、毛笔标题和装饰，先从旧图里抠出来，缺的再补画。
- **网页仍然是图**　除实时查询和规则原文网页字外，无头 Chrome 把排好的页面截成完整图片；链接和实时数据框的位置单独绑定，跟着图片一起输出。
- **只重出改过的**　改了字，只重出受影响的页面，再换掉图片和可点区域。

样板先给我看：第一版太松，收紧行距和留白后，第二版风格当天凌晨通过，才铺到其余页面。样板整页重出 7 张图只要约 5 秒，不含审图和发布。

::screen{#how-this-site-06 section="parallel"}

```typeset
{
 "screen": {
  "id": "how-this-site-06",
  "section": "parallel",
  "title": "分工与并行施工",
  "scene": "横版：分工表与协作说明，配现有施工主题插画或简单流程；不添加具体人数之外的虚构数量。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "分工与并行施工",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "那次建设高峰同时开了",
     "align": "left"
    },
    {
     "type": "table",
     "text_ref": "分工各自负责什么"
    },
    {
     "type": "content_card",
     "text_ref": "并行的前提是能接起来",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机电脑连接.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "本轮清点",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "分工与并行施工",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "那次建设高峰同时开了",
     "align": "left"
    },
    {
     "type": "table",
     "text_ref": "分工各自负责什么"
    },
    {
     "type": "content_card",
     "text_ref": "并行的前提是能接起来",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机电脑连接.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "本轮清点",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "画笔调色板",
   "source_phrase": "画笔",
   "sha256": "6a6909cabd9e10c5748d7103e00ff25f9bda7bc0551925c9a112b53e29275e81",
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
   "source_phrase": "放大镜",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一枚带指纹纹路的小标签",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一叠画稿",
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
   "asset": "_library/illustrations/双人画稿核查.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双人画稿核查",
   "source_phrase": "右边约 42% 宽一幅水彩插画：左边胸前黑色花结徽章的小机器人（Luna）站在画架前，画架上并排一张横的、一张竖的画布；右边另一个同样徽章的小机器人（Sol）拿放大镜，把一张画稿和一张清单并排对照；画稿上一处被淡红色小圈圈出，一根弯箭头从这张画稿指回 Luna；旁边另一张画稿右下角盖着绿色对勾印章。",
   "sha256": "956b276ac8dde4065cf539bee95c8531e814f9e2fadd0d7f0a88fa6d6abcdc31",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-5002849d46891c01a050.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5002849d46891c01a050",
   "title_text": "分工与并行施工",
   "sha256": "23b61c8358a5a092232dbf3bef0bae942902a222680a49f50cca19c3658baff4",
   "status": "ready"
  }
 ]
}
```

## 分工与并行施工

那次建设高峰同时开了约 30 路：20 个 AI 各管几页，4 个 AI 各做一类组件，再加画表格、补素材、主工程师和集成。

| 分工 | 各自负责什么 |
|---|---|
| 主工程师 | 搭排版框架，定统一接口和出图命令 |
| 组件工程师 | 文字、卡片、流程图、表格、实时数据框，各管一类 |
| 页面施工 | 自己那几页的构图、出图和检查 |
| 素材 | 从旧图抠插画，补确实缺的图 |
| 审图与集成 | 看整页、查交互，再装进网站 |

**并行的前提是能接起来。** 颜色、字高和组件接口统一；每个任务用独立工作副本，写清负责的文件和预算，动手前读最新版；需要跨负责人改动就交回协调，由负责人集成回读，每页单独出图。

本轮清点出 40 多类组件，大家共用一套标准，不用最后一个人从头返工。

::screen{#how-this-site-07 section="quality"}

```typeset
{
 "screen": {
  "id": "how-this-site-07",
  "section": "quality",
  "title": "怎样才算做完",
  "scene": "横版：程序检查、整页审、独立找错、全站检查基线四段流水线；全站检查一段画成一张小清单卡，旁边两枚小设备图标（一部手机、一台显示器）表示两种宽度，不画“全部通过”的勾；错字例子用文字保真，现有核查插画辅助，不画新伪字。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "怎样才算做完",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "先让程序拦住确定的错",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/illustrations/页面扇形网格核验.png"
     ],
     "equal_height": true
    },
    {
     "type": "content_card",
     "text_ref": "一个被退回的错字",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "quality-example",
     "width": "62fr"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/双人画稿核查.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "row": "quality-example",
     "width": "36fr",
     "target_height": 290
    },
    {
     "type": "prose",
     "text_ref": "程序排字以后",
     "align": "left"
    },
    {
     "type": "action_button",
     "text_ref": "本地文字识别",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎样才算做完",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "先让程序拦住确定的错",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/illustrations/页面扇形网格核验.png"
     ],
     "equal_height": true
    },
    {
     "type": "content_card",
     "text_ref": "一个被退回的错字",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/双人画稿核查.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 340
    },
    {
     "type": "prose",
     "text_ref": "程序排字以后",
     "align": "left"
    },
    {
     "type": "action_button",
     "text_ref": "本地文字识别",
     "align": "left"
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/icons/裁纸刀.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "裁纸刀",
   "source_phrase": "一把裁纸刀",
   "sha256": "9ad36e9cac8af28e0fd411b777aab3dc0311a488b80f58557ed7d6b3d329d0db",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/小放映机.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "小放映机",
   "source_phrase": "一台小放映机",
   "sha256": "7f176ae6f0f6c24c8c6a6886cd28fc21614f9c6b0a4bc7d09b5735893fa07eac",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/45-钱包-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钱包",
   "source_phrase": "一只小钱罐",
   "sha256": "9e78dada240f9a9cd01b53535c4fdd7473e490dfd7a53e8cf2404ad727011e98",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张打满对勾的清单",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "胶片媒体现图小槽4比3",
   "source_phrase": "右边约 40% 宽一幅水彩插画：桌上一个画框（里面是一小幅绿叶水彩），一根绿色箭头从画框指向一条胶片，胶片的几格里是同一幅画、叶子位置略有不同；旁边一台电脑显示器里那幅画在动（画几道轻轻的动作弧线），一部手机里显示同一幅画但是静止的。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-d69efa27c4d56fa57b76.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d69efa27c4d56fa57b76",
   "title_text": "怎样才算做完",
   "sha256": "dd550f05628b5a5be349bba8907ea06206cbc20c6d365953857c3884fd077886",
   "status": "ready"
  }
 ]
}
```

## 怎样才算做完

**先让程序拦住确定的错。** 七项检查：逐字一致、字高、出界与重叠、标题字和颜色、可点区域、同页样式一致、没有多余内容。

**再让 Claude 看成品。** 程序过了不算完。电脑和手机两种宽度的整页都要看：密不密、构图顺不顺、接缝和插画合不合适。

**再换人找毛病。** 4 个 GPT 分头查导航、媒体和动效、实时数据、内容，查出来交回负责的人修。截至 10 月 4 日，新排版已有约 1,400 个横竖版过了程序检查。

**全站再扫一遍：旧账登记，新错拦住。** 10 月 7 日加了一道全站检查：用真浏览器把线上 305 个网址各按手机（390 像素宽）和电脑（1440 像素宽）打开，量出界、重叠、按钮和可点区域这些量得出来的问题。第一次扫出 227 条：75 条确认是问题，152 条量不了、要另外核；加上本地查出的 11 条，一起登记成基线。之后每次发布，新冒出来的问题过不了；旧账里确认的要在宣布完善前清零，量不了的要补测或单独裁定。所以它不等于全站没有错。

**一个被退回的错字。** “本地文字识别”那页的手机版图里，“把握分”被画成了“整握分”。整张重画两次都没改对，最后只补这一个字、别处一个像素不动，才审过。

程序排字以后，正文直接取自定稿，这类错字不会再有；AI 把精力放在插画和整体观感上。

〔本地文字识别〕

::screen{#how-this-site-08 section="motion"}

```typeset
{
 "screen": {
  "id": "how-this-site-08",
  "section": "motion",
  "title": "一本会动的水彩画册",
  "scene": "横版：分成已经上线、防卡和手机、视频退路三个清晰部分，配已有水彩场景或首页四个时段的小样画；不画未上线的效果。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "一本会动的水彩画册",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "已经上线",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "还有基础动效",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/代码窗口.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "卡了就停",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/illustrations/电脑后台闹钟.png"
     ]
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/main-video-scaffold.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 370,
     "row": "video-fallback",
     "width": "38%"
    },
    {
     "type": "content_card",
     "text_ref": "视频留作退路",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/小放映机.png"
     ],
     "row": "video-fallback",
     "width": "60%"
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一本会动的水彩画册",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "已经上线",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "还有基础动效",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/代码窗口.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "卡了就停",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/illustrations/电脑后台闹钟.png"
     ]
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/main-video-scaffold.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 370
    },
    {
     "type": "content_card",
     "text_ref": "视频留作退路",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/小放映机.png"
     ]
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显示器",
   "source_phrase": "裁和压　裁掉图四周多余的白边，压成几档宽度：横版 1280、1920、2880 像素，竖版 828、1280 像素，浏览器按屏幕挑一档。格式用 AVIF 和 WebP，标准是肉眼看不出和原图有差别；不为了快先放模糊图。",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "认出链接　程序认出图上链接的字，在那个位置盖可点区域；每节的跳转位置也在这一步接上。",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库",
   "source_phrase": "接实时数据　“现在”横条、驾驶舱里的空框，接上电脑的实时状态。",
   "sha256": "94f411ca3351bc5e50580664619090085a59a72a44a8c344eeaac2b126a0fb3c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显示器",
   "source_phrase": "先快后全　先加载第一屏；往下滚，离屏幕还有 600 像素时才加载下一屏。",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-08.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-122dab1056a19ab39462",
   "title_text": "一本会动的水彩画册",
   "sha256": "5e050f4385f0408bd94e1b8badc491e7d7fed11bb825885ba8bd7989c3b39eb7",
   "status": "ready"
  }
 ]
}
```

## 一本会动的水彩画册

**已经上线。** 首页那幅画用代码动起来：鸟、光、云和画里的屏幕一起编排；画会跟着时段换成清晨、白天、傍晚、晚上，也可以自己选，或者选“一分钟循环一天”，一分钟看完一整天。10 月 5 日起各页的画陆续活起来，一只小鸟贯穿全站、每页都有；首页连环画、驾驶舱“今天的河”、“怎么协作”那页能点着看，都已上线。10 月 6 日夜里，小鸟又换上新的动作配置，修好了图集读取。

**还有基础动效。** 页面进场、滚动视差、接缝渐亮、水彩背景和落叶，还有呼吸点、箭头光点和悬停反馈。

**卡了就停，手机从简。** 页面看得见、动画在播，连续约 5 秒画面太卡，这一页才退回静态；只管这一次这一页。手机竖版里太难维护的复杂动效可以不显示，内容一点不少。

**视频留作退路。** 原来用 Google Flow 做开头短视频；现在全站改用代码动效，做好的 27 段视频留着，哪页代码不如视频，就换回去。

::screen{#how-this-site-09 section="speed"}

```typeset
{
 "screen": {
  "id": "how-this-site-09",
  "section": "speed",
  "title": "让网页快起来",
  "scene": "横版：托管方案、画质底线与测速事实卡，两次测量明确不同条件，不把数字画成官网同条件提速对照；附旧密钥告警一句。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "让网页快起来",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "先试，再选托管",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云.png",
      "_library/icons/代码窗口.png",
      "_library/round3/clean-assets/png/09-时钟-clean.png",
      "_library/icons/late-r3-pdf-clarity-slider.png",
      "_library/icons/盾牌对勾.png"
     ],
     "equal_height": true
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "让网页快起来",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "先试，再选托管",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云.png",
      "_library/icons/代码窗口.png",
      "_library/round3/clean-assets/png/09-时钟-clean.png",
      "_library/icons/late-r3-pdf-clarity-slider.png",
      "_library/icons/盾牌对勾.png"
     ],
     "equal_height": true
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "天平",
   "source_phrase": "天平",
   "sha256": "425fc2d20811d84d43bcd5e23cbe8b06796683cbff3e5191e3e123668f91293c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "画笔调色板",
   "source_phrase": "钢笔和画笔交叉",
   "sha256": "6a6909cabd9e10c5748d7103e00ff25f9bda7bc0551925c9a112b53e29275e81",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-09.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a1adbe1fdc3cb35499f9",
   "title_text": "让网页快起来",
   "sha256": "e80463fd3e7cdd320976386439cf848c469627cf8f04810568577ae673289a16",
   "status": "ready"
  }
 ]
}
```

## 让网页快起来

**先试，再选托管。** 最初 AI 选了 GitHub Pages。图片一多，国内打开很慢；AI 用全国多地测速和真浏览器比过，定下网页仍放 GitHub Pages，图片搬到国内的阿里云 OSS。

**配置也交给 AI。** AI 在我已登录的 Chrome 里开好阿里云存储、授权命令行、设好防盗链，再核对网页用到的图片地址。网站域名也是早先 AI 在阿里云配好的。

**快了多少。** 同一组 13 张横屏原图：放在 GitHub 上，浏览器整组下载约 3 分半；放到上海的存储后，整组加载、解码不到 1 秒。两次测法不完全相同，但差距一目了然。

**画质不让步，托管也不换。** 我的底线是不为加载快降低图片质量。10 月 6 日又比过别家托管：慢在我们自己每次发布都把全部图片重新下载核对一遍，不在托管本身；换别家也证明不了国内更稳，所以网页仍放 GitHub Pages、图片仍放阿里云上海。

**顺手清掉旧告警。** 有一把旧密钥早年在公开仓库泄露过，我知道，只是它早就不用了，一直没去管。这次配置时 AI 核实它确实已停用、没有风险，把安全中心挂着的遗留告警处理掉了。

::screen{#how-this-site-10 section="repairs"}

```typeset
{
 "screen": {
  "id": "how-this-site-10",
  "section": "repairs",
  "title": "出了岔子怎么修",
  "scene": "横版：六个出事到修法的卡片，两列三行；流量卡和余额卡相邻，复用云审流量对比插画，保留云端校准未通过的当前状态。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "出了岔子怎么修",
     "align": "center",
     "size": "large"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/云审流量对比.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "panels": [
      [
       0,
       0,
       1101,
       473
      ],
      [
       0,
       485,
       1101,
       1009
      ]
     ],
     "panel_asset_sha256": "5170487289e90cefcdedb2387d320da6613f00412a5bab89d2a249083982e94d",
     "connector": "arrow",
     "row": "incident-lead",
     "width": "30%",
     "target_height": 350,
     "panel_renderer": "image"
    },
    {
     "type": "content_card",
     "text_ref": "流量暴涨",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云图片.png",
      "_library/illustrations/账本.png"
     ],
     "equal_height": false,
     "row": "incident-lead",
     "width": "68%"
    },
    {
     "type": "content_card",
     "text_ref": "新版上线检查没过",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/版本循环文件.png",
      "_library/icons/齿轮.png",
      "_library/icons/文件齿轮.png",
      "_library/icons/数据库.png"
     ],
     "equal_height": false
    },
    {
     "type": "prose",
     "text_ref": "能变成规则和工具",
     "align": "left"
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出了岔子怎么修",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "流量暴涨",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云图片.png",
      "_library/illustrations/账本.png",
      "_library/icons/版本循环文件.png",
      "_library/icons/齿轮.png",
      "_library/icons/文件齿轮.png",
      "_library/icons/数据库.png"
     ],
     "equal_height": false
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/云审流量对比.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "panels": [
      [
       0,
       0,
       1101,
       473
      ],
      [
       0,
       485,
       1101,
       1009
      ]
     ],
     "panel_asset_sha256": "5170487289e90cefcdedb2387d320da6613f00412a5bab89d2a249083982e94d",
     "connector": "arrow"
    },
    {
     "type": "prose",
     "text_ref": "能变成规则和工具",
     "align": "left"
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
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
   "source_phrase": "一只小眼睛",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个对话气泡",
   "sha256": "60292b6592be891c5b33705abee2c54bdae380a80322215e7a46049e245144a5",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "两摞纸并在一起",
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
   "asset": "_library/illustrations/网页看板通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "网页看板通用构图",
   "source_phrase": "右边约 42% 宽一幅水彩插画：书桌上一台大显示器、一台笔记本、一部手机并排，屏幕里都是同一长条绿色网页的缩小画面；胸前橙色星芒徽章的小机器人拿一把尺子比着手机屏幕的边；画面右下一只手（浅绿毛衣袖口）旁边飘着一个对话气泡，气泡里写“两批做完就发布”。",
   "sha256": "5f5204488bba4692225c17e68b358ac36a94954e10513eddf4ebf9cf13c6071e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-10.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-edd417147c4a51ad8620",
   "title_text": "出了岔子怎么修",
   "sha256": "358869427c15e4aef5177af9c29a054ec72c7452d4b939903f26a01032f62e14",
   "status": "ready"
  }
 ]
}
```

## 出了岔子怎么修

**流量暴涨 → 先省，再改读取方式。** 审图时一次只发要看的图，同一批复用同一个进程，图片只做无损压缩：同一张图审一次，上下行流量从约 37MB 降到约 6MB。素材也在云上放了一份，云端已能直接读图；云端审图还没校准好，暂时仍在本机审。

**余额用完、图片全挂 → 先恢复，再省钱。** 10 月 7 日早上阿里云余额用完，网站的图片和样式全挂，我充值后 7:14 恢复。查下来，10 月花的 22.43 元几乎全是我们自己发布、检查时整份下载用掉的。现在发布只传、只核变了的文件；核对时只向存储问每个文件的大小和校验码，不再把文件下载回来；画质不动。网站仓库每次推送后自动跑的检查，要核对的线上文件从 6,748 个减到 1 个；本机的发布包改成同一块盘上共用内容，第二份 3.65GB 的包只多占约 58MB。

**新版上线检查没过 → 退回上一版。** 线上始终留一版能用的：10 月 6 日晚上小鸟的配置在线上读不到，先退回上一版，修好后当晚重新上线。

**Claude 一更新，派出去的 AI 全停了 → 让它们独立施工。** 以前 Claude 一更新，正在干活的 AI 跟着中断；现在它们独立运行，Claude 重启也不影响，做完交回验收。

**并行重出互相覆盖 → 每页单独更新。** 旧程序曾把新标记盖掉。现在改规格前先读最新版、写清自己管哪几页，集成时再回读图片和可点区域。

**实时数据读不到 → 修数据通路，读不到就直说。** 驾驶舱的名称、失败灯、上次读到的值和时间都已修好；告警标题直接说出是什么问题。读不到时如实显示未知，几项都读不到就合成一行说清（正在接入），不让呼吸点装作一切正常。

能变成规则和工具的修法都留下来，后面接手的 AI 直接用。

::screen{#how-this-site-11 section="decisions"}

```typeset
{
 "screen": {
  "id": "how-this-site-11",
  "section": "decisions",
  "title": "我来拍板",
  "scene": "横版：决策步骤与真实反馈，以文稿、选项卡和更正图标辅助；不把私人决策页截图或本机路径画进页面。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
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
     "text_ref": "我来拍板",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "AI 把要我定的事",
     "align": "left",
     "row": "decisions",
     "width": "62fr"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/反馈写进程序.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "row": "decisions",
     "width": "36fr",
     "target_height": 420
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "我来拍板",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "AI 把要我定的事",
     "align": "left"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/反馈写进程序.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 470
    }
   ],
   "notes": "新12屏定稿。AI补充：依现有组件排本文的原卡、原流程和表格；插画复用既有文件，未恢复旧人物/工位合同。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "照片堆",
   "source_phrase": "我说一句，常常配一张截图。",
   "sha256": "ea6c42cf780bf1135d5f08a696c3a91e26537335e74a0c2165b27b44e15f09b5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "AI 把原话连日期记进决定记录，以后谁接手都查得到。",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "不只改我点到的那一处：提炼成规矩，同类的页一起改。",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "天平",
   "source_phrase": "改完在真网页里截改前、改后的图对比。",
   "sha256": "425fc2d20811d84d43bcd5e23cbe8b06796683cbff3e5191e3e123668f91293c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-d3bc2130b033878dd2cf.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d3bc2130b033878dd2cf",
   "title_text": "我来拍板",
   "sha256": "39c68022540502ec017f7cde2308f37e4d6638f6fd319eef9576675968cfb516",
   "status": "ready"
  }
 ]
}
```

## 我来拍板

AI 把要我定的事做成一张本地决策网页：先说结论和有什么用，再给确定的选项、每个选项的后果，以及单独列出的 AI 建议。

我点选、补一句说明，再把答复发回去。技术实现由 AI 自己定；我的要求、取舍和原话，记在接手的 AI 找得到的地方。

比如这一页：我在决策页上定了 12 屏的主线、写 AI 的真实型号、旧密钥的事写一句、数字用真实的再取整；还指出“画了一周”的说法不对，AI 按记录改了。

我提一处更正，AI 不只修这一处：手机按钮难看、图之间缝太大、页脚挤出屏幕，都在真网页里找到原因，把同类的地方一起改掉。

我不用守着：要我定的事留在决策页上，我回来再答，其余施工照常推进。

::screen{#how-this-site-12 section="numbers"}

```typeset
{
 "screen": {
  "id": "how-this-site-12",
  "section": "numbers",
  "title": "以后怎么更新",
  "scene": "横版：更新流程在上，六条做法卡在中（两行，每行三张铺满整行），批次耗时与数字口径在下；数字保留测量范围与截至日期，目标和实测分开写，10 月 7 日没达标的三次实测照实列出，不画成达标，不写全站完成。",
  "portrait": "竖版：按同一份文字顺序排列，卡片和表格按手机宽度自然分页；不缩小正文。",
  "links": [
   {
    "text": "个人网站（总看板）",
    "href": "/projects/wly0829-cn/"
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
     "text_ref": "以后怎么更新",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "定稿改好",
     "layout": "chain",
     "split_arrows": true,
     "columns": 7,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "按需，不定时改",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/版本循环文件.png",
      "_library/icons/秒表.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "检查挡在发布前",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/版本循环文件.png",
      "_library/illustrations/电脑后台闹钟.png"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "数字口径",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "link_grid",
     "text_ref": "80 多页、700 多屏",
     "columns": 4,
     "columns_v": 1,
     "icons": "none"
    },
    {
     "type": "link_grid",
     "text_ref": "305 个网址 × 2 种宽度",
     "columns": 3,
     "columns_v": 1,
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "以后我说“更新网站”",
     "align": "left"
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "以后怎么更新",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "定稿改好",
     "layout": "chain",
     "split_arrows": false,
     "columns": 7,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "按需，不定时改",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/版本循环文件.png",
      "_library/icons/秒表.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "检查挡在发布前",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/版本循环文件.png",
      "_library/illustrations/电脑后台闹钟.png"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "数字口径",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "link_grid",
     "text_ref": "80 多页、700 多屏",
     "columns": 4,
     "columns_v": 1,
     "icons": "none"
    },
    {
     "type": "link_grid",
     "text_ref": "305 个网址 × 2 种宽度",
     "columns": 3,
     "columns_v": 1,
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "以后我说“更新网站”",
     "align": "left"
    }
   ],
   "notes": "按本屏最新定稿的 scene、portrait 和正文更新组件引用，保留现有已审核素材。",
   "provenance": {
    "text": "sources/pages/how-this-site/page.json",
    "source_sha256": "d54cb03c814b50b6fcea5f1ff6131a2060092abfb997692b7e37ee64dfd50f5f",
    "requirements": "page.json notes.requirements；根会话2026-10-04 03:53交回的最终12屏。",
    "composition": "最终scene与portrait；按旧批准样板的现成组件选择列数和现有插画，属于AI补充。",
    "style": "typeset-proto/STANDARDS.md 与 COMPONENTS-API.md；批准样板 approved-style-v2。"
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
   "asset": "_library/illustrations/ill-d9857c7ca4156e.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-d9857c7ca4156e",
   "source_phrase": "左边约 46% 宽：上面一张卡片放“例 2”的标题和两段字；卡片下面一幅水彩小插画：一部手机竖着立在桌上，屏幕底部画两块上下排的浅绿色小方块（代表页脚分成上下两块），旁边一把小尺子和两片绿叶，插画里不画字。",
   "sha256": "143e3d8cb7d723e998509448c8d62d9696a3bae8823cc3e45f0ffe2d5198e293",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/how-this-site-final-12.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2b4b8df0dbafdffe48a9",
   "title_text": "以后怎么更新",
   "sha256": "516e4f563905418a4f61e8c041372a22bd7fd472862b3b432f0f5ff2a7681a0f",
   "status": "ready"
  }
 ]
}
```

## 以后怎么更新

定稿改好 → 程序只重做变了的页面 → 自动检查 → Claude 看整页 → 发布 → 线上回读 → 巡检盯着驾驶舱

**按需，不定时改。** 我说“更新网站”，AI 才动；只改受影响的地方，别的一个字不动。

**只重做变了的页。** 以前改一处，虽然只重出受影响的屏，整站还要复制、打包一遍。新生成链已写好，还没用于发布：只重做内容或依赖真变了的页面；各个组件一次装好，不再在成品上一层层打补丁；同一批输入，增量做出的结果必须和整站重做逐字节一样。检查也只看受影响的页面，再加首页、驾驶舱、规则原文、一张长项目页和急救页五类固定样本；驾驶舱每次都重新实测，不沿用上次的通过。

**目标：小改 45 分钟、大批 3 小时上线。** 这是 AI 自己定的目标；我的要求是一次按需更新能在 4 小时内完成。10 月 4 日实测一批 12 页，从定稿到线上全部核对完约 2 小时 40 分，打包、验收、等发布指令、部署和回读都算在里面。10 月 7 日用旧做法试了三次都没达标：两处小改各约 1 小时，一大批第一轮 201 分钟没上线，第二轮查出问题主动叫停。小改这次没有单独测——原定的最后小改并进大批一起发布，45 分钟目标留到下一次真实小改再测。

**检查挡在发布前。** 七项程序检查之外，排版检查和交互检查已接进发布门：线上 305 个网址、两种宽度的现有问题登记成基线，本轮新增问题过不了就不发（见上面“怎样才算做完”）。

**发得省，退得快。** 只传、只核变了的文件；上线后回读对不上，退回上一版。出问题先恢复能用，根治在后台做。

**驾驶舱有人盯。** 每 15 分钟巡一次线上驾驶舱，连续 10 分钟打不开就发 Gmail 告诉我，恢复后再发一封；细节和限制见〔个人网站（总看板）〕。

**数字口径｜截至 10 月 4 日，另注明的除外**

- **80 多页、700 多屏**　这一轮要做的范围，首页另算
- **约 30 路**　同一时间施工的 AI 任务
- **约 900 张／约 1,300 次**　第一批主线要交的图／生图工具成功出图的次数，含重画
- **约 1,400 个横竖版**　新排版里已过程序检查的电脑版和手机版
- **约 5 秒**　样板一页 7 张图重出一遍
- **约 2 小时 40 分**　一批 12 页从定稿到线上核对完
- **约 1 小时／201 分钟**　10 月 7 日旧做法三次实测都没达标：两处小改各约 1 小时，一大批第一轮 201 分钟没上线，第二轮查出问题主动叫停
- **305 个网址 × 2 种宽度**　全站检查的范围；第一次登记 227 条（75 条确认、152 条量不了），另有本地 11 条（10 月 7 日）
- **22.43 元**　10 月阿里云花费，几乎全是我们自己发布、检查时下载用掉的（截至 10 月 7 日）
- **45 分钟／3 小时**　小改、大批上线的目标（10 月 7 日定）；我的要求是 4 小时内

以后我说“更新网站”，就按新结果更新这一页；只改受影响的地方，踩过的坑留进规则。
