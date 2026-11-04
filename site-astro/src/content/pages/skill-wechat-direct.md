---
{
 "title": "看微信聊天",
 "kind": "skill",
 "url": "/skills/wechat-direct/",
 "tagline": "问微信里的事，AI 只读点名的那一段；明确说了发给谁，也能代发。",
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
  "page": "skill-wechat-direct",
  "kind": "skill",
  "title": "看微信聊天",
  "url": "/skills/wechat-direct/",
  "tagline": "问微信里的事，AI 只读点名的那一段；明确说了发给谁，也能代发。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-11-01 02:22"
   },
   "facts": [
    "10 月 28 日—11 月 3 日 AI 用了 10 次"
   ],
   "as_of": "2026-11-03",
   "source": "AI 使用记录"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "ad55b742899bbc0b51338bb062478815571e391e",
   "commit_time": "2026-09-27T18:14:09+08:00",
   "file": "E:\\.agents\\skills\\wechat-direct\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [],
   "mentions": [
    {
     "target": "/projects/wechatdirect/",
     "screen": "skill-wechat-direct-01",
     "text": "微信聊天读取"
    },
    {
     "target": "/projects/wechatdirect/#features",
     "screen": "skill-wechat-direct-03",
     "text": "微信聊天读取的全部功能"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "skill-wechat-direct-04",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "skill-wechat-direct-04",
     "text": "个人理解库"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "skill-wechat-direct-04",
     "text": "重大的事"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "SKILL.md 里的命令参数、字节预算、临时目录、恢复命令这些施工细节：归项目页“技术”和“全部功能”，技能页不抄。"
   ],
   "unsure": [
    "标题用“看微信聊天”（旧网站技能名）；项目页已按本人说法改名“微信聊天读取”，技能自己的显示名仍是“微信直读”（agents/openai.yaml）。技能页标题要不要跟着改，请 Claude 定。",
    "八句“这样跟 AI 说”和例子都是按 SKILL.md 的路由编的示范说法，不是本人真说过的原话（使用记录只有命令名，没有原话）；“老张”“项目群”“10 月 9 日”、语音内容都是编的。替本人口吻，上线前给本人过目。",
    "“没说主号还是副号时，聊天默认两个号都找”：SKILL.md 写的是 --account auto，找到不止一个或定不了就停下返回候选；朋友圈必须两个号分开跑。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-wechat-direct/page.json",
  "sha256": "611435fe53bdd5b32de0a15555f3b3e1b01746ad5570cc4198b3deb7acd32490",
  "converted_at_beijing": "2026-11-04T14:39:51+08:00"
 }
}
---

::screen{#skill-wechat-direct-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-wechat-direct-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版：左上毛笔艺术字标题，标题下一行灰色小字写技能名。左边约一半宽是介绍段和“这样跟 AI 说就行”八句话，每句画成一个浅绿对话气泡（气泡靠右，像我发出去的消息），两列四行。右边一幅水彩插画：一个人坐在电脑前对着屏幕说话，屏幕里两个聊天窗口，一只放大镜照着其中一小段（和微信直读项目页开头的插画同一套画法，不画微信标志）。最下面一行灰色小字。",
  "portrait": "竖版：标题、技能名、介绍在上；插画缩小放在介绍下面；八个气泡一行一个往下排；灰色小字在最后。",
  "links": [
   {
    "text": "微信聊天读取",
    "href": "/projects/wechatdirect/"
   },
   {
    "text": "替我拟消息",
    "href": "/skills/reply-as-me/"
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
     "row": "intro",
     "width": "64%",
     "text_ref": "看微信聊天"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 11 月 1 日 02:22",
       "state": "ok"
      },
      {
       "text": "10 月 28 日—11 月 3 日 AI 用了 10 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 11 月 3 日 · AI 使用记录",
     "row": "intro"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "技能名：wechat-direct"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "36%",
     "align": "center",
     "target_width": 313,
     "target_height": 290
    },
    {
     "type": "dialogue",
     "columns": 4,
     "split_items": true,
     "sides": [
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right"
     ],
     "text_ref": "这样跟AI说就行"
    },
    {
     "type": "prose",
     "text_ref": "没说主号还是副号时，聊天默认两个号都找，找到不止一个就问我；朋友圈一定两个号分开查、分开报。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上毛笔艺术字标题，标题下一行灰色小字写技能名。左边约一半宽是介绍段和“这样跟 AI 说就行”八句话，每句画成一个浅绿对话气泡（气泡靠右，像我发出去的消息），两列四行。右边一幅水彩插画：一个人坐在电脑前对着屏幕说话，屏幕里两个聊天窗口，一只放大镜照着其中一小段（和微信直读项目页开头的插画同一套画法，不画微信标志）。最下面一行灰色小字。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "看微信聊天"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 11 月 1 日 02:22",
       "state": "ok"
      },
      {
       "text": "10 月 28 日—11 月 3 日 AI 用了 10 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 11 月 3 日 · AI 使用记录"
    },
    {
     "type": "prose",
     "text_ref": "技能名：wechat-direct"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_items": true,
     "sides": [
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right"
     ],
     "text_ref": "这样跟AI说就行"
    },
    {
     "type": "prose",
     "text_ref": "没说主号还是副号时，聊天默认两个号都找，找到不止一个就问我；朋友圈一定两个号分开查、分开报。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题、技能名、介绍在上；插画缩小放在介绍下面；八个气泡一行一个往下排；灰色小字在最后。",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-wechatdirect",
   "source_phrase": "右边一幅水彩插画：一个人坐在电脑前对着屏幕说话，屏幕里两个聊天窗口，一只放大镜照着其中一小段（和微信直读项目页开头的插画同一套画法，不画微信标志）。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一个人坐在电脑前对着屏幕说话，屏幕里两个聊天窗口，一只放大镜照着其中一小段（和微信直读项目页开头的插画同一套画法，不画微信标志"
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
   "asset": "skill-wechat-direct/skill-wechat-direct-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-wechat-direct\\img\\skill-wechat-direct-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-60a4cfb689527d7e7be4",
   "title_text": "看微信聊天",
   "sha256": "e30b21621c749b6b915ab3324e26a1ee96fea2d9ae46c9133d8603f779eaeef3",
   "status": "ready",
   "source_box": [
    39,
    40,
    637,
    213
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 看微信聊天

技能名：wechat-direct

我问到微信里的事，AI 就用这个技能调用〔微信聊天读取〕：认准主号还是副号、哪个人或群，只读够回答的那一小段，先用人话回答；有读不到的地方、而且会影响答案时，才提出来。

它也是发微信的入口：我明确说用哪个号、发给谁、发什么，AI 连上这个号，核对当前登录的真是这个号，再发文字、图片、文件、动态表情或语音；也能实时收点名聊天的新消息，查看并同意这次连接里新来的好友申请。连接只在这次任务里开着，做完就卸载，不留后台服务，不自动回复、不自动同意。要发给真人的话怎么写，归〔替我拟消息〕。

**这样跟 AI 说就行**
- “看一下我和老张昨天在微信上是怎么说的。”
- “项目群上周五最后定的交付时间是哪天？那句‘可以’回的是哪条？”
- “他发的那条语音说了什么？”
- “把这个群的聊天存一份档案，以后有新的就补上。”
- “看看副号上他最近发的朋友圈。”
- “最近哪些微信聊天有新消息？挑重要的更新一下对我的了解。”
- “把我们 9 月 1 日到 3 日的聊天完整存底，附件一起。”
- “上次存的那份档案，核对一下还全不全。”
- “用主号把这段话发给老张，就这么说。”
- “这张图和这个文件用副号发到项目群。”
- “先盯着这个聊天，来新消息就告诉我。”
- “看看现在有没有新的好友申请，那个姓王的同意一下。”

没说主号还是副号时，聊天默认两个号都找，找到不止一个就问我；朋友圈一定两个号分开查、分开报。

::screen{#skill-wechat-direct-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-wechat-direct-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。从左到右三栏：左栏一个手机聊天样式的对话框，里面是“我说”那句（绿色气泡）；中栏一条竖向的三步处理线，每步一个小水彩图标（两个名牌只亮了一个、放大镜照着一小段气泡、一句回复连着原句旁边一个小喇叭）和编号；右栏一张白底卡片，是 AI 的回答（灰色气泡）。三栏之间绿色箭头。最下面一行灰色小字。",
  "portrait": "竖版：我说的气泡、三步、AI 的回答从上到下排，中间向下的箭头；灰色小字在最后。",
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
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我说：项目群上周五最后定的交付时间是哪天？那句“可以”回的是哪条？"
    },
    {
     "type": "flow",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "AI做的"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "text_ref": "AI回我：周五16:40群里定的是10月9日交付；“可以”回的是“那就9号交？”这一条。后面那条语音说的"
    },
    {
     "type": "prose",
     "text_ref": "这是示范，不是真实聊天。"
    },
    {
     "type": "section_heading",
     "text_ref": "再一个例子：发一条消息"
    },
    {
     "type": "dialogue",
     "text_ref": "我说：用主号",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "AI 做的：先在主号"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 回我：发了",
     "sides": [
      "left"
     ],
     "illustration": "none"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。从左到右三栏：左栏一个手机聊天样式的对话框，里面是“我说”那句（绿色气泡）；中栏一条竖向的三步处理线，每步一个小水彩图标（两个名牌只亮了一个、放大镜照着一小段气泡、一句回复连着原句旁边一个小喇叭）和编号；右栏一张白底卡片，是 AI 的回答（灰色气泡）。三栏之间绿色箭头。最下面一行灰色小字。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我说：项目群上周五最后定的交付时间是哪天？那句“可以”回的是哪条？"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "AI做的"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "text_ref": "AI回我：周五16:40群里定的是10月9日交付；“可以”回的是“那就9号交？”这一条。后面那条语音说的"
    },
    {
     "type": "prose",
     "text_ref": "这是示范，不是真实聊天。"
    },
    {
     "type": "section_heading",
     "text_ref": "再一个例子：发一条消息"
    },
    {
     "type": "dialogue",
     "text_ref": "我说：用主号",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "AI 做的：先在主号"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 回我：发了",
     "sides": [
      "left"
     ],
     "illustration": "none"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：我说的气泡、三步、AI 的回答从上到下排，中间向下的箭头；灰色小字在最后。",
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
   "source_phrase": "两个名牌只亮了一个",
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
   "source_phrase": "放大镜照着一小段气泡",
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
   "asset": "_library/fix-round-2/icon-clean-ee27e64c97037ad87bcf.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "气泡钢笔",
   "source_phrase": "一句回复连着原句旁边一个小喇叭",
   "sha256": "0885f03d0fd8605a1e8158ed683043f68c0a9f2176cb524056d398071c4424c1",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-1bd7ab40a6647c38f32a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-wechat-direct\\img\\skill-wechat-direct-02-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "2304e84af71ae809ed22525bb17a83cdc977e8073e268216601e3a099b2b6fc4",
   "status": "ready",
   "source_box": [
    166,
    0,
    761,
    226
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 一个完整例子

示例：照这个技能的做法写的，不是某一次的记录

**我说**：项目群上周五最后定的交付时间是哪天？那句“可以”回的是哪条？

**AI 做的**
1. 没说哪个号，就两个号都找这个群：只在主号找到一个，就用主号。
2. 读上周五前后的一段，找“交付”两个字；这一段里就有，不用往下翻。
3. 那句“可以”是引用回复，它回的原消息一起交回来；旁边有一条语音可能改变答案，就转成 WAV 交给中文语音转写。

**AI 回我**：周五 16:40 群里定的是 10 月 9 日交付；“可以”回的是“那就 9 号交？”这一条。后面那条语音说的是“行，就 9 号，别再改了”，没有改期。

这是示范，不是真实聊天。

**再一个例子：发一条消息**

我说：用主号把“今晚八点到”发给老张。

AI 做的：先在主号里确认老张是哪个对象，不凭昵称猜；主号没登录就请我登录主号，不换副号；连上后核对当前登录的真是主号，发出；微信接受了，再回读聊天记录，核对这一条真的在；结束后关掉连接。

AI 回我：发了，主号，给老张，聊天记录里读回了这一条。要是结果不明或超时，它先查这一次操作到底成没成，不自动重发。

::screen{#skill-wechat-direct-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-wechat-direct-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：一条矮的横幅（高度约为普通一屏的三分之一）：左边标题，右边一句话，句末的链接画成绿色带小箭头；左侧一个小水彩图标（一张列着勾选项的清单）。",
  "portrait": "竖版：标题、图标和那句话上下排，占小半屏。",
  "links": [
   {
    "text": "微信聊天读取的全部功能",
    "href": "/projects/wechatdirect/#features",
    "locator_text": {
     "h": "微信聊天读取的全部功能。",
     "v": "微信聊天读取的全部功能。"
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
     "align": "left",
     "size": "medium",
     "row": "banner",
     "width": "30%",
     "text_ref": "能做的事"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "size": "banner",
     "row": "banner",
     "width": "15%"
    },
    {
     "type": "prose",
     "row": "banner",
     "width": "55%",
     "text_ref": "读一段聊天、找被回的原话、打开附件、建档补新、看和存朋友圈、完整存底、核对以前的导出，按明确指令发消息"
    },
    {
     "type": "points_card",
     "columns": 1,
     "text_ref": "实时读聊天时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "text_ref": "发出去算不算成功"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：一条矮的横幅（高度约为普通一屏的三分之一）：左边标题，右边一句话，句末的链接画成绿色带小箭头；左侧一个小水彩图标（一张列着勾选项的清单）。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "能做的事"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "size": "banner"
    },
    {
     "type": "prose",
     "text_ref": "读一段聊天、找被回的原话、打开附件、建档补新、看和存朋友圈、完整存底、核对以前的导出，按明确指令发消息"
    },
    {
     "type": "points_card",
     "columns": 1,
     "text_ref": "实时读聊天时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "text_ref": "发出去算不算成功"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题、图标和那句话上下排，占小半屏。",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张列着勾选项的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-wechatdirect",
   "source_phrase": "横版：一条矮的横幅（高度约为普通一屏的三分之一）：左边标题，右边一句话，句末的链接画成绿色带小箭头；左侧一个小水彩图标（一张列着勾选项的清单）。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "skill-wechat-direct/skill-wechat-direct-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-skill-wechat-direct-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "f4e266eee8804722b43ccd0650518780fdf84c9b64fed969a8d4189636862cbe",
   "status": "ready",
   "source_box": [
    502,
    265,
    885,
    452
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 能做的事

读一段聊天、找被回的原话、打开附件、建档补新、看和存朋友圈、完整存底、核对以前的导出，按明确指令发消息、实时接收、同意新好友……全部功能和每项现在用没用，见〔微信聊天读取的全部功能〕。

**一条消息太长时**　一次读取的结果有大小上限（32–512 KiB），超长的文字字段会分段给出。AI 用同一个账号、同一个联系人和上次返回的位置接着读完，记下每段的位置和整段文字的哈希；读到一半来源变了（比如这条消息被改了），就从头重新读，不把新旧两个版本拼成一条。

**实时读聊天时**　AI 先备好识别模型、确认连上，再补齐这个聊天到连接时刻的一小段上下文；语音先用同一条消息现成的微信转写，没有就让备好的本机识别和云端同时跑。目标是从消息到达起 15 秒内交齐文字、引用和媒体，这是目标，不保证每条都做到；超时或媒体没取到就标“不完整”，不当成空内容。图片和动画要真的按时间看过画面，才算看懂。它只收连接以后的新消息，不补漏掉的历史。

**发出去算不算成功**　微信接受了，只说明发送动作完成，有没有真的读回另外核对；结果不明或超时，先查这一次操作，不自动重发。私聊语音的收发和读回在微信 4.1.15.13 上验证过；群语音、群里 @ 人、邀请进群、建群接口都在，但还没有真实操作验证；同意邀请不等于对方已进群；群成员只来自已加载的缓存，查不到不等于空群；完整扫描通讯录只在上游 4.1.15.56 验证过，现在这版不算支持。这些是技能和项目说明写的，写这页时没有连接微信、发消息或查账号。

::screen{#skill-wechat-direct-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-wechat-direct-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏卡片：左栏“它管的”（绿色细边框），右栏“它不做的”（灰色细边框），每条一行，前面一个小圆点。最下面一条横跨两栏的细卡片放“要我明确说的”那句。",
  "portrait": "竖版：标题；“它管的”一栏在上，“它不做的”一栏在下，每条一行；细卡片在最后。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   },
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/"
   },
   {
    "text": "重大的事",
    "href": "/rules/charter/#L17"
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
     "type": "points_card",
     "columns": 1,
     "text_ref": "它管的"
    },
    {
     "type": "notice",
     "text_ref": "要我明确说的：发给真实联系人、同意好友申请、改群，要我对这次动作和内容有授权；完整存底只在我明确要求时做；整批导出聊天记录属于约法里的重大的事。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。左右两栏卡片：左栏“它管的”（绿色细边框），右栏“它不做的”（灰色细边框），每条一行，前面一个小圆点。最下面一条横跨两栏的细卡片放“要我明确说的”那句。",
   "portrait_required": true
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
     "type": "points_card",
     "columns": 2,
     "text_ref": "它管的"
    },
    {
     "type": "notice",
     "text_ref": "要我明确说的：发给真实联系人、同意好友申请、改群，要我对这次动作和内容有授权；完整存底只在我明确要求时做；整批导出聊天记录属于约法里的重大的事。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；“它管的”一栏在上，“它不做的”一栏在下，每条一行；细卡片在最后。",
   "portrait_required": true
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

**它管的**
- 这台电脑上微信的本地聊天和朋友圈缓存，主号、副号都行
- 点名的一个人或群：读一段、建档补新、完整存底
- 找出有新消息的聊天，给更新理解库用
- 我明确指定账号、对象和内容时，发文字、图片、文件、动态表情、语音；实时接收点名的聊天；查看并同意这次连接里新来的好友申请

**它不做的**
- 没有我对这次动作和内容的授权不发消息、不同意好友；不发朋友圈、不点赞评论（现在这版微信用不了）；不主动加好友（上游没有这个功能）；不自动登录，也不替我去点开别人的主页
- 不整号同步，不建第二个数据库（读取时用的明文快照缓存随时能删、能重建，不算另一个库），不给人做画像，不在后台跑：没有固定服务、常驻端口、开机项，也不开自动接受、自动回复
- 不改微信的数据库，也不把聊天导回微信
- 不猜账号：昵称、头像、窗口标题都不算数；点名的号没登录就请我登录那个号，不换另一个号，有历史缓存也不等于登录着
- 不上网补历史；只有我要一份阅读包、或打开某个附件时，才按消息里记着的地址取回表情；完整存底和档案都不联网
- 不自己转写语音：转写交给〔中文语音转写〕
- 不记“读到哪了”：更新理解时的阅读进度归〔个人理解库〕
- 解密配置和密钥不外露；原始账号编号只在我要完整存底这类确实需要原始证据时才给

**出了问题时**
- “包已经建好了”或程序正常退出，只说明包建出来了，不等于完整：AI 还要看状态、哪些引用的图片和语音没取到、还有没有没读完的；缺了的照样能用、能核对，但会把缺口写明，不说成完整。
- 建档补新中途断掉、提示档案需要恢复（archive_recovery_required）时，AI 先用恢复导出看清现在是什么状态，在我授权的更新或修复里再明确选“退回旧版”或“补完新版”，不自己猜。
- 新一版档案没核对通过之前，上一版完整档案一直留着。

**要我明确说的**：发给真实联系人、同意好友申请、改群，要我对这次动作和内容有授权；完整存底只在我明确要求时做；整批导出聊天记录属于约法里的〔重大的事〕。
