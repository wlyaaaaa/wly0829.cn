---
{
 "title": "远程只让自己连",
 "kind": "skill",
 "url": "/skills/tailscale-safe-exposure/",
 "tagline": "开个服务给自己的设备用，外人连不上。",
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
  "page": "skill-tailscale-safe-exposure",
  "kind": "skill",
  "title": "远程只让自己连",
  "url": "/skills/tailscale-safe-exposure/",
  "tagline": "开个服务给自己的设备用，外人连不上。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-08 15:03"
   },
   "facts": [
    "近 7 天 AI 用了 7 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "b1f4a5cbd95ab74a9741ade4dfc603f41593e300",
   "commit_time": "2026-09-18T14:42:34+08:00",
   "file": "E:\\.agents\\skills\\tailscale-safe-exposure\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [],
   "relations": [
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "被用于",
     "flow": "副机 Funnel 公网入口（本人单独授权的公开）和两机私网中转",
     "source": "E:\\PCConfig\\tools\\secondary-laptop-access\\README.md:106,143"
    },
    {
     "id": "r-streaming",
     "with": "sunshine-remote-streaming",
     "direction": "被用于",
     "flow": "只读线路体检：Get-SunshineHealth.ps1、verify-path-lite.ps1",
     "source": "SKILL.md“Sunshine 现行只读入口”节"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "被用于",
     "flow": "远程桌面只放行两台（Invoke-RdpTailscaleExposure.ps1、registries\\rdp_tailscale_exposure.json）、7892 和 18091 两个私网代理入口",
     "source": "E:\\PCConfig\\registries\\rdp_tailscale_exposure.json"
    },
    {
     "id": "r-meshclip",
     "with": "meshclip-kit",
     "direction": "指过去",
     "flow": "双机剪贴板排障先用它的 doctor.ps1、recover.ps1",
     "source": "SKILL.md 最后一段"
    }
   ],
   "mentions": [
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-tailscale-safe-exposure-02",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/remote-control/",
     "screen": "skill-tailscale-safe-exposure-03",
     "text": "电脑远程控制"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "skill-tailscale-safe-exposure-03",
     "text": "远程电脑串流"
    },
    {
     "target": "/projects/meshclip-kit/",
     "screen": "skill-tailscale-safe-exposure-03",
     "text": "双机剪贴板"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "SKILL.md 里的具体命令参数（tailscale status --json 等）和证据字段名不上页面，属于施工细节。"
   ],
   "unsure": [
    "这个技能不是“电脑远程控制”一个项目的入口（它还管串流、远程桌面、双机剪贴板），所以“能做的事”在本页写全，没有只链到项目页 #features。",
    "第 2 屏按审稿意见改成假设语气（照这套做法会这样办）；账本上的结果是这台电脑现在的真实设置（rdp_tailscale_exposure.json），当初是否经本技能完成没有记录。",
    "页面名沿用旧网站的“远程只让自己连”（content\\skills.json）。",
    "manifest 把本技能挂在“电脑远程控制”下；旧稿 skills.json 挂在 pcconfig 下。技能总页按哪一个分组请 Claude 定。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-tailscale-safe-exposure/page.json",
  "sha256": "12a51862502614b7a247ecfe015b2f7597e7b558b6f9ea54770cefabbfee84d8",
  "converted_at_beijing": "2026-10-10T10:13:23+08:00"
 }
}
---

::screen{#skill-tailscale-safe-exposure-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-tailscale-safe-exposure-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句话和一段说明。右边一幅水彩插画：一台台式机，外面围着一圈淡绿色的篱笆，篱笆上只开了一扇小门，门口站着一部手机和一台笔记本（各画 Tailscale 标志的小徽章），篱笆外一个模糊的人影被挡在外面。下半部分一张“怎么跟 AI 说”的卡片，四句话做成对话气泡。",
  "portrait": "竖版：标题、一句话、说明在上；插画占满宽度；四个对话气泡一行一个。",
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
     "text_ref": "大标题：远程只让自己连",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 15:03",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
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
     "text_ref": "一句话：",
     "width": "50%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "illustration": "left_outside",
     "connector": "none",
     "split_items": true,
     "tail": true,
     "text_ref": "怎么跟 AI 说",
     "split_paras": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    }
   ],
   "notes": "横版左上标题/介绍，右50%篱笆电脑大插画在卡外；下半单张外卡，卡头怎么跟AI说，内部四个气泡2列2行，人物头像在气泡外左。竖版标题→一句话→说明→篱笆大插画→整宽对话外卡，四气泡各一行，头像左外。无丝带或箭头连接。定稿的“大标题：/一句话：/说明：”是否仅为设计标记需主工程师统一明确；本规格不删定稿字符。 本轮文字核对：四句以split_paras拆成四泡，当前接口补齐。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "大标题：远程只让自己连"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 15:03",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "一句话："
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "illustration": "left_outside",
     "connector": "none",
     "split_items": true,
     "tail": true,
     "text_ref": "怎么跟 AI 说",
     "split_paras": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    }
   ],
   "notes": "横版左上标题/介绍，右50%篱笆电脑大插画在卡外；下半单张外卡，卡头怎么跟AI说，内部四个气泡2列2行，人物头像在气泡外左。竖版标题→一句话→说明→篱笆大插画→整宽对话外卡，四气泡各一行，头像左外。无丝带或箭头连接。定稿的“大标题：/一句话：/说明：”是否仅为设计标记需主工程师统一明确；本规格不删定稿字符。 本轮文字核对：四句以split_paras拆成四泡，当前接口补齐。"
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“只让我的手机能连上电脑上这个服务，别对外开。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“看看远程桌面现在是不是只放行笔记本和手机。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“串流有点卡，查一下手机到电脑走的是直连还是中转。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“这个端口要给笔记本用，改之前先把原样记下来。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/网络篱笆.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "网络篱笆",
   "source_phrase": "右边一幅水彩插画：一台台式机，外面围着一圈淡绿色的篱笆，篱笆上只开了一扇小门，门口站着一部手机和一台笔记本（各画 Tailscale 标志的小徽章），篱笆外一个模糊的人影被挡在外面。",
   "sha256": "f5c152bbda27a0828f447a8ff362e0070a75d9c53bbbf45e804a2c4a272a9e0e",
   "status": "ready",
   "original_elements": [
    "一台台式机，外面围着一圈淡绿色的篱笆，篱笆上只开了一扇小门，门口站着一部手机和一台笔记本（各画 Tailscale 标志的小徽章），篱笆外一个模糊的人影被挡在外面"
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
   "asset": "_library/round3/titles/title-r3-ac7c4489258f839cafa8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ac7c4489258f839cafa8",
   "title_text": "远程只让自己连",
   "sha256": "4c49e051cd473a75ffd743d49d6fac792b4b9ca9bafe68c23747383a01d52e99",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：远程只让自己连

一句话：把电脑上的一个服务开给我自己的手机或笔记本用，外人连不上。

说明：它只管 Tailscale（只连我自己设备的私人网络）里的开放。Tailscale 有两种开法：Serve＝只给自己私网里的设备开；Funnel＝把服务放到公网上，谁都能访问。它的做法是：先把现状记下来，只开一个端口、只放行指定的设备，改完从对面设备真连一次；默认不对公网公开，要公开得我单独同意。

**怎么跟 AI 说**
- “只让我的手机能连上电脑上这个服务，别对外开。”
- “看看远程桌面现在是不是只放行笔记本和手机。”
- “串流有点卡，查一下手机到电脑走的是直连还是中转。”
- “这个端口要给笔记本用，改之前先把原样记下来。”

::screen{#skill-tailscale-safe-exposure-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-tailscale-safe-exposure-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约三分之二宽，五个编号步骤沿一条弯弯的小路排下来，每步一个小水彩图标（放大镜照着一张清单、一个端口插头、一面只开小窗的墙、一部手机和笔记本连向电脑的两条线、一个退回箭头）和一两行字。右边约三分之一宽，一张米色小账本插画，上面画真实的几行字（见“账本上的字”），账本下面一张小卡片“要注意”。",
  "portrait": "竖版：标题在上；五个步骤一行一步；账本插画和“要注意”卡在最下。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
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
     "size": "medium",
     "text_ref": "标题：一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "prose",
     "text_ref": "假如我说："
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "row": "body",
     "width": "65%",
     "text_ref": "1先摸底",
     "illustration_inside": false
    },
    {
     "type": "document_mock",
     "columns": 1,
     "illustration": "none",
     "variant": "paper",
     "row": "body",
     "width": "35%",
     "text_ref": "账本上的字",
     "appearance": "notebook"
    },
    {
     "type": "notice",
     "columns": 1,
     "illustration": "left_inside",
     "row": "body",
     "text_ref": "要注意：",
     "icons": [
      "_library/icons/文件齿轮.png"
     ]
    }
   ],
   "notes": "横版五步竖向蜿蜒小路占左65%；每步图标卡外左，文本在右侧浅绿小卡内；右35%上为有字账本，下为要注意说明卡。标题整宽一行毛笔、中档；介绍在标题下。竖版v/v2合看：标题、介绍后多一幅电脑/手机/笔记本大插画；1至4步图标在卡内右，绿色丝带逐步相连；第5步在v2顶，原图没有右图；账本上的字是程序排的整宽文字卡，随后要注意。v底另有无字合起账本装饰。原文字完整，不将图中“账本上的字”抄回定稿；副标题样式须组件样张。 本轮使用已实现illustration_inside:false把左图留在卡外，避免outside默认移到卡上方。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "prose",
     "text_ref": "假如我说："
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "right_inside",
     "text_ref": "1先摸底"
    },
    {
     "type": "document_mock",
     "columns": 1,
     "illustration": "none",
     "variant": "paper",
     "text_ref": "账本上的字",
     "appearance": "notebook"
    },
    {
     "type": "notice",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "要注意：",
     "icons": [
      "_library/icons/文件齿轮.png"
     ]
    }
   ],
   "notes": "横版五步竖向蜿蜒小路占左65%；每步图标卡外左，文本在右侧浅绿小卡内；右35%上为有字账本，下为要注意说明卡。标题整宽一行毛笔、中档；介绍在标题下。竖版v/v2合看：标题、介绍后多一幅电脑/手机/笔记本大插画；1至4步图标在卡内右，绿色丝带逐步相连；第5步在v2顶，原图没有右图；账本上的字是程序排的整宽文字卡，随后要注意。v底另有无字合起账本装饰。原文字完整，不将图中“账本上的字”抄回定稿；副标题样式须组件样张。 qa-10规格核对：主图在步骤前由块顺序执行，流程卡内右图由right_inside执行，撤掉重复且不被消费的位置字段。"
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
   "source_phrase": "放大镜照着一张清单",
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
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "一个端口插头",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一面只开小窗的墙",
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机电脑连接",
   "source_phrase": "一部手机和笔记本连向电脑的两条线",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个退回箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "要注意：账本上是这台电脑现在的真实结果，归电脑配置与恢复管；当初是不是经这个技能做的，没有找到记录。“只有这两台能连”还要看Tailscale的访问策略，读不到就只说不知道。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "要注意：账本上是这台电脑现在的真实结果，归电脑配置与恢复管；当初是不是经这个技能做的，没有找到记录。“只有这两台能连”还要看Tailscale的访问策略，读不到就只说不知道。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "要注意：账本上是这台电脑现在的真实结果，归电脑配置与恢复管；当初是不是经这个技能做的，没有找到记录。“只有这两台能连”还要看Tailscale的访问策略，读不到就只说不知道。",
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
   "asset": "_library/illustrations/账本.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "账本",
   "source_phrase": "右边约三分之一宽，一张米色小账本插画，上面画真实的几行字（见“账本上的字”），账本下面一张小卡片“要注意”。",
   "sha256": "df5149a9dd4aa27c3fc3c6f0300186d80b7ed032d354c7f1041850e9753487da",
   "status": "ready",
   "original_elements": [
    "米色小账本，只画纸面短线；真实账本字由排版程序另放"
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
   "asset": "_library/round3/titles/title-r3-997ecda1c47e024c1a03.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-997ecda1c47e024c1a03",
   "title_text": "一个完整例子：照这套做法，“远程桌面只让笔记本和手机连”会这样办",
   "sha256": "cb8a2f2c580415b4d49f973fa9914dbce3f98b7adf237045946acc00dd658281",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：一个完整例子：照这套做法，“远程桌面只让笔记本和手机连”会这样办

示例：照这个技能的做法写的，不是某一次的记录

假如我说：“远程桌面只让我的笔记本和手机连。”

1. **先摸底**：记下 Tailscale 里这台电脑、笔记本、手机各是谁；查 3389 端口谁在监听；读出所有影响它的防火墙规则，而不只看规则名字。
2. **发现问题先停**：Windows 自带的两条远程桌面规则放行范围太宽，应当先停下来告诉我，不在上面再叠一条规则掩盖它。
3. **等我同意，再一次只改一处**：关掉那两条宽规则，另建两条只认 Tailscale 网卡、只认笔记本和手机两台设备的规则（TCP、UDP 各一条）；改之前存好原样和退回办法。
4. **不碰别人的**：同一台电脑上另外三个已开的入口和 ToDesk 都不动。
5. **分开验收**：规则在不在、服务活没活、端口听在哪、从笔记本真连一次，四样分开报；从笔记本 ping 一次，写清是直连还是中转、延迟多少。

**账本上的字**
远程桌面 3389 · TCP / UDP
放行：笔记本、手机（Tailscale）
已关：两条系统自带宽规则
不动：另外三个入口 · ToDesk

**要注意**：账本上的配置归〔电脑配置与恢复〕管，当前状态以最新检查为准；当初是不是经这个技能做的，没有找到记录。“只有这两台能连”还要看 Tailscale 的访问策略，读不到就只说不知道。

::screen{#skill-tailscale-safe-exposure-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-tailscale-safe-exposure-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题。十张小卡片排成两列五行，每张左边一个小水彩图标、粗体名字、一句话。最下面一行小字带三个链接。",
  "portrait": "竖版：标题在上；十张卡片一行一张；最下面一行小字。",
  "links": [
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/"
   },
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/",
    "locator_instances": {
     "v": {
      "input_sha256": "a27a2dcbd3072e60039c2cbc3ccb283cd32bc770a35d8923c32e048efba67a96",
      "instances": [
       {
        "context_text": "远程电脑串流的线路体检、双机剪贴板。",
        "context_rect": [
         173,
         3139,
         811,
         3176
        ],
        "expected_rect": [
         175,
         3139,
         399,
         3175
        ],
        "confirm_region": true
       }
      ]
     }
    }
   },
   {
    "text": "双机剪贴板",
    "href": "/projects/meshclip-kit/",
    "locator_instances": {
     "v": {
      "input_sha256": "a27a2dcbd3072e60039c2cbc3ccb283cd32bc770a35d8923c32e048efba67a96",
      "instances": [
       {
        "context_text": "远程电脑串流的线路体检、双机剪贴板。",
        "context_rect": [
         173,
         3139,
         811,
         3176
        ],
        "expected_rect": [
         595,
         3143,
         744,
         3173
        ],
        "confirm_region": true
       }
      ]
     }
    }
   }
  ],
  "anchors": [
   {
    "id": "a-baseline",
    "text": "先摸底"
   },
   {
    "id": "a-minimal",
    "text": "选最小的开法"
   },
   {
    "id": "a-no-public",
    "text": "默认不上公网"
   },
   {
    "id": "a-rollback",
    "text": "改前留原样、坏了退回"
   },
   {
    "id": "a-layers",
    "text": "分层验收"
   },
   {
    "id": "a-policy",
    "text": "查访问策略"
   },
   {
    "id": "a-streaming",
    "text": "串流线路体检"
   },
   {
    "id": "a-resume",
    "text": "中断了接着收拾"
   },
   {
    "id": "a-redact",
    "text": "对外报告不露底"
   },
   {
    "id": "a-meshclip",
    "text": "双机剪贴板排障"
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
     "size": "medium",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "flow",
     "text_ref": "1先摸底",
     "direction": "vertical",
     "columns": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/身份盾牌.png",
      "_library/hires-icons/开关.png",
      "_library/fix-round-2/icon-clean-80633705edf9063e00f8.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/文件齿轮.png"
     ],
     "row": "functions",
     "width": "50%"
    },
    {
     "type": "flow",
     "text_ref": "6",
     "direction": "vertical",
     "columns": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/身份盾牌.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png"
     ],
     "row": "functions",
     "width": "50%"
    },
    {
     "type": "prose",
     "text_ref": "用在哪："
    }
   ],
   "notes": "批准横图左列1至5、右列6至10，两列五行按列读；每张图标在卡内左，标题右上、说明右下；无流程连接。定稿十项必须完整，不能按列数删第6至10项。原竖v标题在上左，右旁大电脑插画；1至5单列卡在v，6至10和链接尾注在v2；卡内左图右文。columns/reading_order须真实出图核验，当前核心numbered_steps按行填网格会与原图不同。 qa-10第3条：十项改为左右两条无连线竖向flow（各5张），卡内左图右文；两块明确取原图标槽1–5、6–10，保持按列读。 qa-10第3条素材：第2/3/6槽分别绑定已有开关、盾牌、打勾清单，第7槽绑定干净的听诊器检查图，保留其余六槽；均为本地既有素材。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "reading_order": "column_major",
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "1先摸底",
     "icons": [
      "_library/icons/身份盾牌.png",
      "_library/hires-icons/开关.png",
      "_library/fix-round-2/icon-clean-80633705edf9063e00f8.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/文件齿轮.png",
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/身份盾牌.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "用在哪："
    }
   ],
   "notes": "批准横图左列1至5、右列6至10，两列五行按列读；每张图标在卡内左，标题右上、说明右下；无流程连接。定稿十项必须完整，不能按列数删第6至10项。原竖v标题在上左，右旁大电脑插画；1至5单列卡在v，6至10和链接尾注在v2；卡内左图右文。columns/reading_order须真实出图核验，当前核心numbered_steps按行填网格会与原图不同。 qa-10第6条：撤掉与首屏重复的篱笆主插画，标题整宽居中；十项单列及卡内左图右文保留。 qa-10第3条素材：第2/3/6槽分别绑定已有开关、盾牌、打勾清单，第7槽绑定干净的听诊器检查图，保留其余六槽；均为本地既有素材。"
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "先摸底｜记下本机和对面设备的身份、端口谁在监听、Serve 和 Funnel 现状、相关防火墙规则；从对面 ping 一次留底",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "选最小的开法｜只听本机的服务用 Tailscale Serve 开一个端口；服务自己监听的，用一条只认 Tailscale 网卡和指定设备的防火墙规则",
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
   "source_phrase": "默认不上公网｜不用 Funnel；要公开，得我单独同意公开什么、开哪个端口",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "改前留原样、坏了退回｜一次只改一个端口的一种做法；改完核对，不对就按存好的原样退回，再核对一次",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "分层验收｜配置、服务、监听、对面设备真连，四样分开报；写清是直连，还是经 Tailscale 的公共中转服务器或自己的一台设备中转，以及延迟",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "查访问策略｜读 Tailscale 策略，并实测允许设备能连、被禁设备被拒；先排除离线和服务故障，读不到或测不了就标“不知道”，不宣称",
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
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "串流线路体检｜Sunshine、Moonlight 只查网络走哪条路，跑串流项目自己的只读体检；不改分辨率、HDR、刷新率",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "中断了接着收拾｜按存好的原样对比；别的程序改过的地方不动，没收拾完就留着“还没做完”的记号，下次先处理它",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "对外报告不露底｜给网站、公开报告的结果不写设备身份、地址、账号和整份访问策略",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "双机剪贴板排障｜先用双机剪贴板项目自己的诊断和恢复入口",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/网络篱笆.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "网络篱笆",
   "source_phrase": "横版：左上标题。十张小卡片排成两列五行，每张左边一个小水彩图标、粗体名字、一句话。最下面一行小字带三个链接。",
   "sha256": "f5c152bbda27a0828f447a8ff362e0070a75d9c53bbbf45e804a2c4a272a9e0e",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：能做的事

1. **先摸底**｜记下本机和对面设备的身份、端口谁在监听、Serve 和 Funnel 现状、相关防火墙规则；从对面 ping 一次留底
2. **选最小的开法**｜只听本机的服务用 Tailscale Serve 开一个端口；服务自己监听的，用一条只认 Tailscale 网卡和指定设备的防火墙规则
3. **默认不上公网**｜不用 Funnel；要公开，得我单独同意公开什么、开哪个端口
4. **改前留原样、坏了退回**｜一次只改一个端口的一种做法；改完核对，不对就按存好的原样退回，再核对一次
5. **分层验收**｜配置、服务、监听、对面设备真连，四样分开报；写清是直连，还是经 Tailscale 的公共中转服务器或自己的一台设备中转，以及延迟
6. **查访问策略**｜读 Tailscale 策略，并实测允许设备能连、被禁设备被拒；先排除离线和服务故障，读不到或测不了就标“不知道”，不宣称
7. **串流线路体检**｜Sunshine、Moonlight 只查网络走哪条路，跑串流项目自己的只读体检；不改分辨率、HDR、刷新率
8. **中断了接着收拾**｜按存好的原样对比；别的程序改过的地方不动，没收拾完就留着“还没做完”的记号，下次先处理它
9. **对外报告不露底**｜给网站、公开报告的结果不写设备身份、地址、账号和整份访问策略
10. **双机剪贴板排障**｜先用双机剪贴板项目自己的诊断和恢复入口

用在哪：〔电脑远程控制〕的笔记本公网入口和两机私网中转、〔远程电脑串流〕的线路体检、〔双机剪贴板〕

::screen{#skill-tailscale-safe-exposure-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-tailscale-safe-exposure-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“管”画一个打开的工具箱，下面四条；右栏“不管”画一个淡灰色的叉，下面五条。最下面一条细卡片写“它不会做的事”。",
  "portrait": "竖版：“管”一栏在上、“不管”一栏在下，一条一行；最下面细卡片。",
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
     "size": "medium",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/禁止文件.png"
     ]
    },
    {
     "type": "notice",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "它不会做的事：",
     "icons": [
      "_library/icons/文件齿轮.png"
     ]
    }
   ],
   "notes": "横版左右两张同高卡，左管/右不管；各卡内左半大图（工具箱/灰色叉纸），右半组名胶囊及五条定稿。虽然scene写左四条，定稿有五条，逐字排齐。下方贯通整宽它不会做的事细卡，左盾牌右文。竖版两张整宽大卡上下排，图仍在卡内左；末尾盾牌细卡。只有清单状态小圆点，不能把整张不管卡文字改红。整宽章节标题按STANDARDS居中。 qa-10第4条：不管卡用已有禁止文件图，与管卡的灯泡明确区分。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/禁止文件.png"
     ]
    },
    {
     "type": "notice",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "它不会做的事：",
     "icons": [
      "_library/icons/文件齿轮.png"
     ]
    }
   ],
   "notes": "横版左右两张同高卡，左管/右不管；各卡内左半大图（工具箱/灰色叉纸），右半组名胶囊及五条定稿。虽然scene写左四条，定稿有五条，逐字排齐。下方贯通整宽它不会做的事细卡，左盾牌右文。竖版两张整宽大卡上下排，图仍在卡内左；末尾盾牌细卡。只有清单状态小圆点，不能把整张不管卡文字改红。整宽章节标题按STANDARDS居中。 qa-10第4条：不管卡用已有禁止文件图，与管卡的灯泡明确区分。"
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
   "source_phrase": "管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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
   "source_phrase": "管",
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
   "source_phrase": "不管",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "它不会做的事：不重置整份Serve或Funnel配置；不建“任何地址都放行”的规则；不因为ping通、服务在跑就说“连上了”；不为了验收通过放宽检查。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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

标题：边界

**管**
- Tailscale 私网里单个服务的开放和收回
- 相关的 Windows 防火墙规则（读实际生效的那份）
- Tailscale Serve、Funnel 的逐端口核对
- 经我单独同意的 Funnel 公开
- 远程串流、双机剪贴板的网络线路检查

**不管**
- 普通局域网、Wi-Fi、公司 VPN、上网代理节点
- Sunshine 的画面设置和串流本身好不好用
- 各项目自己的业务（照项目自己的规则办）
- 登录密码、令牌这类凭据
- 个人网站（wly0829.cn）的发布

**它不会做的事**：不重置整份 Serve 或 Funnel 配置；不建“任何地址都放行”的规则；不因为 ping 通、服务在跑就说“连上了”；不为了验收通过放宽检查。
