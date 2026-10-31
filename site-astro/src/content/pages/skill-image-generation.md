---
{
 "title": "生图",
 "kind": "skill",
 "url": "/skills/image-generation/",
 "tagline": "要一张画面，AI 写清要求交给生图模型画，放大逐字逐处核对，按版本存好。",
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
  },
  {
   "id": "tech",
   "label": "技术"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-image-generation",
  "kind": "skill",
  "title": "生图",
  "url": "/skills/image-generation/",
  "tagline": "要一张画面，AI 写清要求交给生图模型画，放大逐字逐处核对，按版本存好。",
  "status": "",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次更新",
    "at": "2026-10-29 13:30"
   },
   "facts": [],
   "as_of": "2026-10-31",
   "source": "状态分类按技能在现行技能清单里启用（install=true）判断。“上次更新”2026-10-29 13:30 是技能源 E:\\.agents\\skills\\image-generation 最后一次提交（.agents 21a603fd）的北京时间，是源码更新事件，不是使用事件；使用次数本轮没有取同口径记录，Unknown。"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "21a603fd",
   "commit_time": "2026-10-29T13:30:59+08:00",
   "file": "E:\\.agents\\skills\\image-generation\\SKILL.md；E:\\.agents\\config\\model-roster.json（image_generation、routing 场景“生图”）；活动规则 E331《能力与运行方式》“生成图片和设计画面”",
   "rules_release": "E331"
  },
  "video_prompt": "",
  "search_aliases": [
   "画一张图",
   "配图",
   "封面",
   "抠图",
   "去背景",
   "透明底",
   "换背景",
   "改图里的字",
   "标题字",
   "出几版图"
  ],
  "registry": {
   "relations": [],
   "mentions": [
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "skill-image-generation-04",
     "text": "能力与运行方式"
    },
    {
     "target": "/skills/report-page/",
     "screen": "skill-image-generation-04",
     "text": "汇报网页"
    },
    {
     "target": "/projects/video-scaffold/",
     "screen": "skill-image-generation-04",
     "text": "本地视频制作"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": []
  }
 },
 "source": {
  "page": "sources/pages/skill-image-generation/page.json",
  "sha256": "7832ff9645dfc196cfc5192177b3f60e90f7546e76ab10ceb77cd1a45ec7010f",
  "converted_at_beijing": "2026-10-31T08:33:22+08:00"
 }
}
---

::screen{#skill-image-generation-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-image-generation-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行）。左半边上“它做什么”两段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：六句说法，每句画成一个浅绿色圆角对话气泡，两列排。下面一幅水彩插画：木画架上一张白纸，纸上一道绿色的笔刷曲线，四周清新亮绿的叶子。插画里不画字。",
  "portrait": "",
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
     "text_ref": "生图",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "50%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 10 月 29 日 13:30",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 31 日 · 状态分类按技能在现行技能清单里启用（install=true）判断。“上次更新”2026-10-29 13:30 是技能源 E:\\.agents\\skills\\image-generation 最后一次提交（.agents 21a603fd）的北京时间，是源码更新事件，不是使用事件；使用次数本轮没有取同口径记录，Unknown。",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "技能名",
     "row": "hero"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "要一张画面的",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "一个画面该不",
     "row": "hero"
    },
    {
     "type": "notice",
     "text_ref": "不用点名",
     "row": "hero"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "align": "center"
    }
   ],
   "notes": "照手机直取技能页第 1 屏：左栏标题、技能名、它做什么两段、不用点名；右栏六句说法，下面放插画。插画复用素材库，已看过图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "生图",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 10 月 29 日 13:30",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 31 日 · 状态分类按技能在现行技能清单里启用（install=true）判断。“上次更新”2026-10-29 13:30 是技能源 E:\\.agents\\skills\\image-generation 最后一次提交（.agents 21a603fd）的北京时间，是源码更新事件，不是使用事件；使用次数本轮没有取同口径记录，Unknown。"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "要一张画面的"
    },
    {
     "type": "prose",
     "text_ref": "一个画面该不"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 1,
     "split_paras": true,
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    }
   ],
   "notes": "照手机直取技能页第 1 屏：左栏标题、技能名、它做什么两段、不用点名；右栏六句说法，下面放插画。插画复用素材库，已看过图。"
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
   "asset": "_library/illustrations/画板曲线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-01-illustration-01",
   "source_phrase": "木画架上一张白纸，纸上一道绿色笔刷曲线（不画字）",
   "sha256": "538371356f06d66e5610e143861ecdd0305ca030a9bc21439c9b6f109810215f",
   "status": "ready"
  }
 ]
}
```

生图

技能名 image-generation · 规则库里的通用做法，不挂在某个项目下

**它做什么**
要一张画面的时候——插画、封面、带字的标题、图标、去背景、换背景、只改图里的一处——AI 先把要画什么写清楚，交给生图模型画出来，再放大逐字逐处核对，合格的按版本存好。Codex 里的 GPT 自己就能画；Claude 写好要求，派 GPT-6 Luna 去画并存到写明的位置。

一个画面该不该生图，按全局规则办：静态画面默认生图；会变的数字、日期、数据图表和动效用代码做；截图、聊天记录、单据、证件这类证据永远不生图。

**怎么跟 AI 说**
“给这篇汇报画一张封面，绿色水彩，不要字。”
“这张标题图里‘三’改成‘两’，别的一个像素都别动。”
“把这张产品图的背景去掉，要透明底。”
“同一个风格出三版，我来挑。”
“照这张定好的图，再画一套同样风格的小图标。”
“图里的字一个一个核对，错了只修那一块。”

不用点名：说到画图、配图、封面、抠图、换背景，AI 自己会用上它。

::screen{#skill-image-generation-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-image-generation-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（“真事”）。上面一段说明。左边约三分之二宽，“AI 做了什么”五步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一张写字的纸、一只手递出任务卡、一把剪刀、一个放大镜、一张带循环箭头的文件），下面一段“交回的结果”。右边约三分之一宽一张竖卡片“以前栽过的跟头”，两条。",
  "portrait": "",
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
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "真事："
    },
    {
     "type": "prose",
     "text_ref": "“怎么协作”页有"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "交回的结果"
    },
    {
     "type": "prose",
     "text_ref": "标题图改成了"
    },
    {
     "type": "points_card",
     "text_ref": "以前栽过的跟头",
     "columns": 1,
     "illustration": "none"
    }
   ],
   "notes": "照手机直取技能页第 2 屏。"
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
     "type": "tag",
     "text_ref": "真事："
    },
    {
     "type": "prose",
     "text_ref": "“怎么协作”页有"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "交回的结果"
    },
    {
     "type": "prose",
     "text_ref": "标题图改成了"
    },
    {
     "type": "points_card",
     "text_ref": "以前栽过的跟头",
     "columns": 1,
     "illustration": "none"
    }
   ],
   "notes": "照手机直取技能页第 2 屏。"
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
   "key": "skill-image-generation-02-icon-01",
   "source_phrase": "一张写字的纸：写清要求",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-hand-passes-task-card.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-02-icon-02",
   "source_phrase": "一只手递出任务卡：派 Luna 去画",
   "sha256": "6a93052b9b4d3c782b9128acd1ca109b71fbe7e5dcf513916ee4c7731b6ac4ee",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/剪刀.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-02-icon-03",
   "source_phrase": "一把剪刀：只取新字贴回",
   "sha256": "18efcc5f95ce2b5b8c0939799620a9389dcc063c3e42dff881d10ecacb9d5682",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/放大镜.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-02-icon-04",
   "source_phrase": "一个放大镜：放大逐字核对",
   "sha256": "5170ba7b5437b0953d0596c3dba4ed30724b3ab851a2269f7d412bcfab18a59b",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-02-icon-05",
   "source_phrase": "带循环箭头的文件：存成第 2 版",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
   "fallback": false,
   "key": "skill-image-generation-02-title-01",
   "sha256": "ebeedcd896facfd1af9e0b5b28e5faf151361e1fe40c83443eab292fd4e32f07",
   "status": "ready"
  }
 ]
}
```

一个完整例子

真事：10 月 31 日改“怎么协作”页的一张标题图

“怎么协作”页有一张毛笔字标题“三个底座怎么配合”。底座已经从三个变成两个，图要跟着改，而且这张是审定过的图，除了那个字别的都不该变。

**AI 做了什么**
1. Claude 把原图当参考写要求：只把第一个字“三”换成“两”，笔法、颜色、大小和下面那道浅绿笔刷照原样；新图存到哪也写清楚。
2. 派 GPT-6 Luna 去画，一张图一个任务；新图落到写明的位置，原图不动。
3. 生图会把整张轻轻重画一遍。所以只取新画的“两”字，贴回原图第一个字的位置，其余七个字和笔刷一个像素都没变。
4. 放大逐字核对：八个字和“两个底座怎么配合”一致，“两”是简体，没有多字、少字。
5. 存成标题图第 2 版，页面改用新图，第 1 版留着不删。同一页目录条上那块“三个底座怎么配合”的小标签，也照这个办法改了。

**交回的结果**
标题图改成了“两个底座怎么配合”，只动了第一个字，放大逐字核过；新图是第 2 版，旧图还在。

**以前栽过的跟头**
- 10 月 28 日给一期成都主题的内容配图，派了 4 批，有 3 批的图没存到写明的位置：派单没写明“这是生图任务”，没人替它把图存下来。现在每次派单都写明。
- 同一批里有两张图，窗外是冬天光秃秃的树，可故事发生在七八月。现在验收时专门看季节和时间对不对。

::screen{#skill-image-generation-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-image-generation-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句。横幅下一张两列七行的小表格“七种画法”。再下面一张大卡片“用这个技能时，AI 守的规矩”，七条短句两列排，每条前一个小水彩图标（一个文件夹、一个放大镜、一个放大镜照着对勾、一把剪刀、一张带循环箭头的文件、一个钱袋、一个回收箱）。",
  "portrait": "",
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
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "静态画面都能"
    },
    {
     "type": "section_heading",
     "text_ref": "七种画法"
    },
    {
     "type": "table",
     "text_ref": "画法"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 2,
     "icons": "auto",
     "illustration": "left_inside"
    }
   ],
   "notes": "照手机直取技能页第 3 屏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "静态画面都能"
    },
    {
     "type": "section_heading",
     "text_ref": "七种画法"
    },
    {
     "type": "table",
     "text_ref": "画法"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 1,
     "icons": "auto",
     "illustration": "left_inside"
    }
   ],
   "notes": "照手机直取技能页第 3 屏。"
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
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-01",
   "source_phrase": "一个文件夹：写明存到哪",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/放大镜.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-02",
   "source_phrase": "一个放大镜：放大看细处",
   "sha256": "5170ba7b5437b0953d0596c3dba4ed30724b3ab851a2269f7d412bcfab18a59b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-magnifier-on-check.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-03",
   "source_phrase": "放大镜照着对勾：复核看量",
   "sha256": "b93ee737217a6315944e92ad5dd4e2941234f62467fc928e3b988c51a6e60e41",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/剪刀.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-04",
   "source_phrase": "一把剪刀：只修不对的那块",
   "sha256": "18efcc5f95ce2b5b8c0939799620a9389dcc063c3e42dff881d10ecacb9d5682",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-05",
   "source_phrase": "带循环箭头的文件：按版本存",
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
   "asset": "_library/icons/late-r3-benchmark-moneybag.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-06",
   "source_phrase": "一个钱袋：不为生图派最贵的",
   "sha256": "fb791f4d0e02dfe080cfe0f7f9f0e5a00cc781168d00674262db5f0aee96db87",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/回收站文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-03-icon-07",
   "source_phrase": "一个回收箱：收尾清掉候选",
   "sha256": "7b00eb4b96c27664772d883f37a3bdb2deb007d6e4484e7808a1b286e25c1da1",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7dadc2c869cdb800f4de.png",
   "fallback": false,
   "key": "skill-image-generation-03-title-01",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready"
  }
 ]
}
```

能做的事

静态画面都能交给它：网页的插画和标题字、汇报页的配图、PPT 的整页设计和底图、视频的风格参考、分镜和封面，也能直接出海报、带字的说明图这类成品。设计类先出几版，我定了风格再照图写代码；素材类 AI 出几版，自己比着选。

**七种画法**
| 画法 | 怎么做 |
|---|---|
| 只用文字画 | 写清画什么、怎么构图、什么风格、多大画幅、图里要哪几个字 |
| 照参考图画 | 延续一张参考图的风格、构图或人物 |
| 精准局部替换 | 换背景、去掉或改一处，不整张重画；审定的图要求别的不动时，只把改好的那块贴回原图 |
| 透明底和抠图 | 直接出透明底的图，或把主体从原图里抠出来 |
| 图里带字 | 标题、海报字、带字的说明图、艺术字直接画进图里 |
| 整套一个风格 | 定下一张当基准，后面每张都拿它当参考 |
| 一次出几版 | 要几版就同时派几个任务，各画一张 |

**用这个技能时，AI 守的规矩**
- 派单写明这是生图任务、一张图一个任务、存到哪个位置；没存上就去生图模型自己的存放处按回执找，不按“最新的文件”去猜。
- 交回前放大看细处：图里的字逐字和原文核对，不拿识字工具代替人眼；单位和品牌标志、人脸和手、季节和时间都要对。
- 复核看量：成批的图交 GPT-6.1 Sol 审，很重要的交 Claude；只有几张时主对话自己看。我网站上的图，约定 Luna 画、Sol 审、不合格交 Claude 定。
- 不合格只修不对的那一块；整体不对就改好要求重画。
- 按版本存（第 1 版、第 2 版……），不覆盖旧图；审定的图冻结，以后只重做内容变了的部分。
- Luna 画图不占额度；不为生图派最贵的 GPT-6 Astra，按量收费的接口只在我明确要时用。
- 落选的候选和临时文件，任务收尾时清掉。

::screen{#skill-image-generation-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-image-generation-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个调色板和画笔、一个指路牌、一个禁止小标）。",
  "portrait": "",
  "links": [
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
   },
   {
    "text": "汇报网页",
    "href": "/skills/report-page/"
   },
   {
    "text": "本地视频制作",
    "href": "/projects/video-scaffold/"
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
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "照手机直取技能页第 4 屏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "照手机直取技能页第 4 屏。"
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
   "key": "skill-image-generation-04-icon-01",
   "source_phrase": "管",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-image-generation-04-icon-02",
   "source_phrase": "不做",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
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
   "key": "skill-image-generation-04-title-01",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready"
  }
 ]
}
```

边界

**管**
静态画面怎么画、怎么验收、怎么管版本：插画、封面、标题字、图标、抠图、透明底、换背景、局部替换、整套风格一致的几版。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 一个画面该不该生图，还是用代码做 | 全局规则〔能力与运行方式〕里“生成图片和设计画面”一条 |
| 汇报页里的行程图和配图怎么放进页面 | 〔汇报网页〕 |
| 视频里的生图做法 | 〔本地视频制作〕 |
| 会变的数字、日期、数据图表和动效 | 用代码做，不生图 |

**不做**
- 截图、聊天记录、单据、证件和当证据用的实拍，永远不生图。
- 不拿生成的图冒充真实照片或原件。
- 不覆盖旧图，不删审定版。

::screen{#skill-image-generation-05 section="tech"}

```typeset
{
 "screen": {
  "id": "skill-image-generation-05",
  "section": "tech",
  "title": "技术实现与依据",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {},
 "images": []
}
```

## 技术实现与依据

这里保留谁来画、派单格式、落盘核对和来源。

**10 月 31 日核对**　技能 E:\.agents\skills\image-generation\SKILL.md（.agents dab34509 于北京时间 10 月 28 日 06:06 新建，21a603fd 于 10 月 29 日 13:30 补齐触发词）；生图走哪条路、用哪个型号见 E:\.agents\config\model-roster.json 的 image_generation 和 routing 场景“生图”；该不该生图见活动规则 E331《能力与运行方式》“生成图片和设计画面”；流量模式细节在 docs/claude-gpt-child-traffic.md。

## 谁来画

- **Codex 主对话**：直接调用 Codex 自带的生图能力；模型清单记的首选是 GPT Image 2.5，实际工具和型号以宿主为准。
- **Claude**：写好提示，经 E:\.agents\tools\Invoke-ClaudeGptChild.ps1 派 gpt-6-luna，档位 low，必须带 -TrafficMode Generation（默认的 Auto 在没有任务 JSON 时按普通任务跑，宿主不替它落盘）；不需要本人另行授权，不占订阅额度。
- **复核**：成批的图交 gpt-6.1-sol（ultra）审，很重要的交 Claude；只有几张时主持的对话自己看，不另派子代理。个人网站的约定是 Luna 画、Sol 审、不合格交 Claude 定，只管网站，不外推。

## 派单格式

`pwsh -NoProfile -File E:\.agents\tools\Invoke-ClaudeGptChild.ps1 -Mode Start -Model gpt-6-luna -Effort low -TrafficMode Generation -PromptFile <派单.md> -WorkDir <目标所在目录> -TaskName <名字>`

派单开头一张任务卡：任务、任务类型（生图）、范围（目标图片绝对路径）、代码上限 0、时限分钟 15。正文写目标绝对路径（png、jpg、jpeg 或 webp，且还不存在）；参考图和要编辑的原图也写绝对路径；目标不在工作目录下时加 -TrafficAllowedRoot <目标所在目录>。同一会话第二次生图会被拦下，要几版就并行派几个，派完用一条批量 Watch 等。

## 落盘核对

- 看回执的 generated_image_paths 和本轮 generation.json（图片源、实际复制路径、宽高、SHA-256），确认文件真的在、尺寸对。
- 宿主只复制到第一个还不存在的目标，绝不覆盖。
- 回执报 generation_not_landed 或目标里没有图时，按回执或本轮事件给的 savedPath 到 E:\Data\AppData\Codex\generated_images\<线程号>\ 取。

## 10 月 31 日这次的实际数据

- 两个任务各画一张（标题图、目录条标签），都落到写明的路径；生成尺寸都是 2170×725，原图分别是 932×216 和 567×80。
- 标题图：按其余七个字的墨迹外框算出缩放约 2.32 倍，只取新“两”字贴回首字一格，改动的像素都在原图 x 25—146、y 35—160 之内，其余逐像素和第 1 版一致；新文件 sources/assets/how/how-03-title-02.png。
- 目录条标签：同样只换首字，缩放约 3.9 倍，新字按其余字的墨色（RGB 0,112,64）着色；新文件 nav-unify-label-08-14c7b174c3.png／.webp，旧文件保留。
- 两张都放大逐字核对为“两个底座怎么配合”。

## 出问题时

- **图没存到写明的位置**：先看回执和 savedPath，不重派、不猜。
- **字错了、标志画糊了**：用精准局部替换只修那一块。
- **整体不像**：改好提示重出，不在错的图上反复修。
- **证据类画面**：不生图，用原件或真实截图。
