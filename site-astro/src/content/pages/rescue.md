---
{
 "title": "救急先看",
 "kind": "rescue",
 "url": "/rescue/",
 "tagline": "电脑出事时，按症状照着做最短的几步。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "freeze",
   "label": "卡死和远程连不上"
  },
  {
   "id": "network",
   "label": "代理和上网"
  },
  {
   "id": "dictation",
   "label": "听写"
  },
  {
   "id": "display",
   "label": "串流和主屏"
  },
  {
   "id": "panels",
   "label": "机箱小屏和水冷屏"
  },
  {
   "id": "replace",
   "label": "整台电脑坏了，要换一台"
  },
  {
   "id": "password",
   "label": "密码中心打不开"
  },
  {
   "id": "codex",
   "label": "Codex 对话要恢复"
  },
  {
   "id": "other",
   "label": "其他"
  }
 ],
 "page": {
  "schema": "site-b2.page.v1",
  "page": "rescue",
  "kind": "rescue",
  "title": "救急先看",
  "url": "/rescue/",
  "tagline": "电脑出事时，按症状照着做最短的几步。",
  "status": "",
  "public": true,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "91b73e4ba6fc3a7f195611eaed75e67b8a06fe9c",
   "commit_time": "2026-10-01T17:39:13+08:00",
   "file": "PCConfig 91b73e4（docs\\recovery\\*）；各项目说明见 facts.md；事实单 E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\p2\\facts-ops.md 第 1 节（10 月 1 日 18:14 采集）"
  },
  "video_prompt": "",
  "registry": {
   "symptoms": [
    {
     "id": "e-freeze",
     "name": "两个 AI 一起卡住",
     "phone": "手机经远控；远控进不去要到电脑前",
     "source": "E:\\PCConfig\\docs\\recovery\\desktop-freeze-rescue.md:5–16"
    },
    {
     "id": "e-remote",
     "name": "远程连不上",
     "phone": "手机直接做",
     "source": "computer-access.jsx:351；E:\\PCConfig\\tools\\remote-computer-mcp\\README.md:39–44、58、62"
    },
    {
     "id": "e-proxy",
     "name": "代理坏了",
     "phone": "手机经远控",
     "source": "E:\\PCConfig\\docs\\recovery\\network-recovery.md:3–17；E:\\Projects\\Tools\\ProxyClean\\README.md:3–18"
    },
    {
     "id": "e-proxy-share",
     "name": "借电脑上网不行",
     "phone": "手机那头直接做，电脑那头经远控",
     "source": "E:\\PCConfig\\docs\\recovery\\tailscale_proxy_entries.md:5–14、38–46"
    },
    {
     "id": "e-winh",
     "name": "Win+H 没反应",
     "phone": "手机经远控",
     "source": "E:\\Projects\\Tools\\ChineseASR\\README.md:13、27–35；E:\\PCConfig\\docs\\recovery\\chinese_dictation_on_demand.md:9–28"
    },
    {
     "id": "e-dictation-text",
     "name": "听写不出字",
     "phone": "手机经远控",
     "source": "ChineseASR README.md:17–23、35；quality-and-model-maintenance.md:106–108"
    },
    {
     "id": "e-stream",
     "name": "串流没画面",
     "phone": "手机经远控",
     "source": "E:\\Projects\\Tools\\sunshine-remote-streaming\\docs\\operations.md:3–15、27–31；AGENTS.md:3–9"
    },
    {
     "id": "e-blackout",
     "name": "主屏全黑",
     "phone": "手机经远控",
     "source": "E:\\PCConfig\\docs\\recovery\\primary_oled_blackout.md:3–5、12、27、31–37"
    },
    {
     "id": "e-turzx",
     "name": "机箱小屏不刷新",
     "phone": "手机经远控",
     "source": "TURZX-SideScreen docs\\startup.md:14–18、191–200；scripts\\repair-panel.ps1"
    },
    {
     "id": "e-hs2",
     "name": "水冷屏不亮",
     "phone": "检查经远控，动线要到电脑前",
     "source": "TURZX-SideScreen docs\\hs2-crystal-overlay.md:20–40；docs\\startup.md:17–18、102–109"
    },
    {
     "id": "e-password",
     "name": "密码中心打不开",
     "phone": "手机密码中心能用时直接做，换电脑要到电脑前",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\docs\\recovery\\password-center-m2-operations.md:5–10、23–25、47–55"
    },
    {
     "id": "e-codex",
     "name": "Codex 桌面转圈",
     "phone": "手机经远控",
     "source": "E:\\PCConfig\\docs\\recovery\\codex_desktop_ai_recovery_prompt.md:3–19、69–79；codex-desktop.md:5–10、64–72"
    },
    {
     "id": "e-codex-backup",
     "name": "从备份取回对话",
     "phone": "手机经远控",
     "source": "E:\\Projects\\Backups\\codex-memory\\CONVERSATION_BACKUP.md:43–58、67–76"
    },
    {
     "id": "e-clipboard",
     "name": "剪贴板不同步",
     "phone": "手机经远控",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\TROUBLESHOOTING.md:3–15、37–55"
    },
    {
     "id": "e-chatgpt-auth",
     "name": "ChatGPT 授权转圈",
     "phone": "有 ChatGPT 界面就能做",
     "source": "E:\\PCConfig\\tools\\secondary-laptop-access\\README.md:124–126、141、191"
    },
    {
     "id": "e-replace",
     "name": "整台电脑坏了，要换一台",
     "phone": "要到电脑前",
     "source": "E:\\PCConfig\\docs\\recovery\\START_RECOVERY.md:9–21（给本人看的七步）、26–42、50、62–69；E:\\PCConfig\\tools\\system-image\\README.md:101、109–115、131–137（9 月 22 日实测范围）；factcheck2.md 第 10 节"
    }
   ],
   "mentions": [
    {
     "target": "/computer-access/",
     "screen": "rescue-02",
     "text": "授权与状态"
    },
    {
     "target": "/mcp/#ai-use",
     "screen": "rescue-02",
     "text": "连接电脑"
    },
    {
     "target": "/projects/proxyclean/",
     "screen": "rescue-03",
     "text": "代理上网修复"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "rescue-04",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "rescue-05",
     "text": "远程电脑串流"
    },
    {
     "target": "/projects/pc-panel-hub/",
     "screen": "rescue-06",
     "text": "双屏信息中心"
    },
    {
     "target": "/projects/password-center/",
     "screen": "rescue-07",
     "text": "密码中心"
    },
    {
     "target": "/projects/codex-memory/",
     "screen": "rescue-08",
     "text": "AI 备份"
    },
    {
     "target": "/projects/meshclip-kit/",
     "screen": "rescue-09",
     "text": "双机剪贴板"
    },
    {
     "target": "/projects/pcconfig/#pcconfig-07",
     "screen": "rescue-10",
     "text": "电脑配置与恢复：电脑坏了怎么办"
    },
    {
     "target": "/rescue/#e-password",
     "screen": "rescue-10",
     "text": "密码中心打不开"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "派活说明的“卡死和远程不通”拆成两条：卡死（确认卡住后重启）和远程连不上（还没确认卡死，先查清原因），因为两者第一步正好相反，合在一条会让人在没确认卡死时就去断电重启。",
    "“Codex 对话要恢复”按事实单分成两条：桌面转圈（数据多半还在，用命令行接着做）和真要从备份取回。"
   ],
   "dropped": [
    "小米智能插座3远程断电重开：10 月 8 日本人确认插座控制不依赖这台电脑、路由器独立供电，10 月 9 日救援交付收口（E:\\PCConfig\\docs\\recovery\\desktop-freeze-rescue.md:12—24），已写进第 2 屏作远控也进不去时的最后兜底；来源仍没有插座 App 的具体按钮步骤，不编；AI 未做断电演练。（10 月 11 日 Opus 合入，旧的“没找到验收记录”已过时）",
    "备用的“右 Ctrl＋两下 Scroll Lock 蓝屏留现场”：现行急救说明已改为默认直接重启，且这组按键有真实触发失败记录，不放进步骤，只写“不用先按键蓝屏留现场”。",
    "听写与本地模型共用显卡的双向交接（事实单 U06 待本人验收）：不影响急救步骤，不写。",
    "Codex 对话备份的冷备提取命令（-PayloadStore Cold、-Mode Restore … -Execute）：是写操作，交给 AI 照恢复说明做，页面只放只读校验那一条。"
   ],
   "unsure": [
    "网址 /rescue/、目录 rescue：按 Claude 的补充沿用旧网站网址（首页入口已链到 /rescue/）。site-rules.md 的第 2 批网址清单里还没有这一条，建议补上。",
    "和第 1 批不一致：电脑配置与恢复页第 8 屏“电脑卡死了”的急救卡仍是旧的四步（第 2 步“按住右 Ctrl，连按两下 Scroll Lock”留现场），pcconfig 第 19 号功能也这样写。现行 E:\\PCConfig\\docs\\recovery\\desktop-freeze-rescue.md:5–16、20–22 已改成默认直接重启，且这组按键有触发失败记录。本页照现行写；第 1 批那屏要不要改，请 Claude 定（我没动 b1）。",
    "电脑配置与恢复页写救急 U 盘根目录有一份《救急先看》，和本页同名；没核对那份内容是否和本页一致。本页第 9 屏只提 U 盘里有 PE 工具，没说 U 盘里的《救急先看》和网页一样。",
    "“手机直接做”这条用在“远程连不上”：依据是事实单“手机可使用已配置的远控”，没核实手机上 ToDesk、网易 UU 这两个 App 现在都装着、能登录。",
    "全站规矩是“一切是图”，本页又要求“网络慢时手机也要能打开”。建议本页的图压得最小（字为主、插画极少），并把 text 同时作为网页文字（例如图片的替代文字）放进页面，图没下载完时步骤也能读到；要不要这样做请 Claude 定。",
    "按钮和步骤里写了几条命令（听写状态、启动听写任务、修小屏、串流体检、对话备份只读校验、kdeconnect-cli --refresh、codex resume --all）：照规则页能登本机路径和命令的先例保留，方便电脑上的 AI 直接照做；觉得太技术可以只留文字步骤。",
    "替本人口吻写的句子：第 1 屏介绍两句“电脑出事时先看这一页……”。",
    "【10 月 1 日内容主次改稿，北京时间 10-02 00:29】按 GPT 复核 B06，把“电脑坏了，要换一台”从第 9 屏“其他”提成独立的 rescue-10，放在“密码中心打不开”之前；首屏按钮〔电脑坏了要换〕仍落 #e-replace（锚点搬到 rescue-10）。步骤照 START_RECOVERY.md:9–21，要准备的照 factcheck2.md 第 10 节；只写 9 月 22 日测过的文件级范围，整机还原、启动、新硬件都写“还没演练”。第 8 屏句子照 factcheck2.md 第 9 节改。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rescue/page.json",
  "sha256": "70a0f1e89b9cd23930e49a88a808bd03bae8e47dd0b5e2cad329e75d89db802b",
  "converted_at_beijing": "2026-10-11T13:58:12+08:00"
 }
}
---

::screen{#rescue-01 section="top"}

```typeset
{
 "screen": {
  "id": "rescue-01",
  "section": "top",
  "title": "开头：先看这里",
  "scene": "横版：左上毛笔艺术字大标题“救急先看”，下面一段介绍。右上约四分之一宽一幅很小的水彩插画：一部手机斜靠在一本翻开的绿色小手册上，手册页上只画几道浅绿横线（不画字），旁边一片叶子。中间一张满宽浅绿底圆角卡片“先分清两件事”，里面三行，每行最前面画对应的标签样子（深绿实心圆角标签、浅绿描边圆角标签、灰色描边圆角标签，标签里不写字）。下半屏“按症状找”：15 个白底细绿边圆角按钮，排成三行、每行五个，宽度一致，按钮里的字就是链接字；最后一行小字。按钮之间间距一致，不留大块空白。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：标题；介绍；插画缩成一行高；“先分清两件事”卡片满宽，三行上下排；“按症状找”15 个按钮排成两列（最后一个居中）；最后一行小字。",
  "links": [
   {
    "text": "卡死",
    "href": "/rescue/#e-freeze"
   },
   {
    "text": "远程连不上",
    "href": "/rescue/#e-remote"
   },
   {
    "text": "代理坏了",
    "href": "/rescue/#e-proxy"
   },
   {
    "text": "借电脑上网不行",
    "href": "/rescue/#e-proxy-share"
   },
   {
    "text": "Win+H 没反应",
    "href": "/rescue/#e-winh"
   },
   {
    "text": "听写不出字",
    "href": "/rescue/#e-dictation-text"
   },
   {
    "text": "串流没画面",
    "href": "/rescue/#e-stream"
   },
   {
    "text": "主屏全黑",
    "href": "/rescue/#e-blackout"
   },
   {
    "text": "机箱小屏不刷新",
    "href": "/rescue/#e-turzx"
   },
   {
    "text": "水冷屏不亮",
    "href": "/rescue/#e-hs2"
   },
   {
    "text": "密码中心打不开",
    "href": "/rescue/#e-password"
   },
   {
    "text": "Codex 对话要恢复",
    "href": "/rescue/#e-codex"
   },
   {
    "text": "剪贴板不同步",
    "href": "/rescue/#e-clipboard"
   },
   {
    "text": "ChatGPT 授权转圈",
    "href": "/rescue/#e-chatgpt-auth"
   },
   {
    "text": "电脑坏了要换",
    "href": "/rescue/#e-replace"
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
     "text_ref": "救急先看",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "text_ref": "电脑出事时先看这一页。它不连电脑、不读任何实时数据，电脑关着、网络慢的时候，手机也能打开。按症状找到那一条，照着做最短的",
     "row": "hero"
    },
    {
     "type": "illustration",
     "size": "medium",
     "illustration": "outside",
     "row": "hero",
     "width": "40%",
     "align": "center"
    },
    {
     "type": "points_card",
     "text_ref": "先分清两件事：手机能看步骤，不等于手机能修好。每条都写了“手机上”能不能做：",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "按症状找",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "action_button",
     "text_ref": "卡死远程连不上代理坏了借电脑上网不行Win+H没反应",
     "columns": 5,
     "columns_v": 2,
     "portrait_last_center": true
    },
    {
     "type": "prose",
     "text_ref": "步骤出自各项目"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 qa-11 修复：首屏插画改 medium；横版标题/插画占比 60/40，保留导语与原文。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "救急先看",
     "align": "left",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "电脑出事时先看这一页。它不连电脑、不读任何实时数据，电脑关着、网络慢的时候，手机也能打开。按症状找到那一条，照着做最短的"
    },
    {
     "type": "illustration",
     "size": "medium",
     "illustration": "outside",
     "align": "center"
    },
    {
     "type": "points_card",
     "text_ref": "先分清两件事：手机能看步骤，不等于手机能修好。每条都写了“手机上”能不能做：",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "按症状找",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "action_button",
     "text_ref": "卡死远程连不上代理坏了借电脑上网不行Win+H没反应",
     "columns": 2,
     "columns_v": 2,
     "portrait_last_center": true
    },
    {
     "type": "prose",
     "text_ref": "步骤出自各项目"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 qa-11 修复：首屏插画改 medium；横版标题/插画占比 60/40，保留导语与原文。"
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
   "asset": "_library/illustrations/ill-9a8ad6f966959d.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-9a8ad6f966959d",
   "source_phrase": "右上约四分之一宽一幅很小的水彩插画：一部手机斜靠在一本翻开的绿色小手册上，手册页上只画几道浅绿横线（不画字），旁边一片叶子。",
   "sha256": "139c6945a70dc781cc012b5fbf93ebfe657e122702b5997fa59514e41a5ae548",
   "status": "ready",
   "original_elements": [
    "一部手机斜靠在一本翻开的绿色小手册上，手册页上只画几道浅绿横线（不画字），旁边一片叶子"
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
   "asset": "_library/titles/title-0fea0cd83293605d3fd9.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\rescue\\img\\rescue-01-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0fea0cd83293605d3fd9",
   "title_text": "救急先看",
   "sha256": "e07958c78fcbafffca061365ddb85ab43ce069d1e66f36172ef8662e6d45cf8e",
   "status": "ready",
   "source_box": [
    32,
    6,
    573,
    198
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 救急先看

电脑出事时先看这一页。它不连电脑、不读任何实时数据，电脑关着、网络慢的时候，手机也能打开。按症状找到那一条，照着做最短的几步。

**先分清两件事：手机能看步骤，不等于手机能修好。**每条都写了“手机上”能不能做：
- **手机直接做**：手机上就能做完。
- **手机经远控**：手机先用 ToDesk、网易 UU 或 Moonlight 连上电脑桌面再做；或者让手机上的 AI 经电脑 MCP（让 AI 远程用电脑的接口）去做。两种都要电脑开着、连得上。
- **要到电脑前**：要有人在电脑旁边按键、插拔。

**按症状找**
〔卡死〕　〔远程连不上〕　〔代理坏了〕　〔借电脑上网不行〕　〔Win+H 没反应〕
〔听写不出字〕　〔串流没画面〕　〔主屏全黑〕　〔机箱小屏不刷新〕　〔水冷屏不亮〕
〔密码中心打不开〕　〔Codex 对话要恢复〕　〔剪贴板不同步〕　〔ChatGPT 授权转圈〕　〔电脑坏了要换〕

步骤出自各项目现在的说明（10 月 11 日核对）。

::screen{#rescue-02 section="freeze"}

```typeset
{
 "screen": {
  "id": "rescue-02",
  "section": "freeze",
  "title": "卡死和远程连不上",
  "scene": "横版：左上小节标题“卡死和远程连不上”。两张等高的症状卡片左右并排，各占一半宽。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一个停住的沙漏；右卡图标：一根断开的网线插头。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽，先“卡住”再“远程连不上”；每张卡片里步骤一行一步。",
  "links": [
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "连接电脑",
    "href": "/mcp/#ai-use"
   }
  ],
  "anchors": [
   {
    "id": "e-freeze",
    "text": "两个 AI 一起卡住，关掉也打不开"
   },
   {
    "id": "e-remote",
    "text": "远程连不上，还不确定是不是卡死"
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
     "text_ref": "卡死和远程连不上",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "两个AI一起卡住，关掉也打不开",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "远程连不上，还不确定是不是卡死",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "卡死和远程连不上",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "两个AI一起卡住，关掉也打不开",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "远程连不上，还不确定是不是卡死",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "source_phrase": "能保存的先保存。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "只开一次新的 PowerShell 试试；约 90 秒还不好，就别再折腾。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "从发现卡住算起约 2 分钟：Ctrl+Alt+Del → 右下角电源 → 重启。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "正常重启也卡住，最后才长按电源键关机，再开机。",
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
   "asset": "_library/titles/title-4e410331b51b69a8c2b2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\rescue\\img\\rescue-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4e410331b51b69a8c2b2",
   "title_text": "卡死和远程连不上",
   "sha256": "b2124443af11220f8b35c4fc40e87048f20b9eee094c48528fa496162d289836",
   "status": "ready",
   "source_box": [
    43,
    63,
    473,
    151
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 卡死和远程连不上

### 两个 AI 一起卡住，关掉也打不开
1. 能保存的先保存。
2. 只开一次新的 PowerShell 试试；约 90 秒还不好，就别再折腾。
3. 从发现卡住算起约 2 分钟：Ctrl+Alt+Del → 右下角电源 → 重启。
4. 正常重启也卡住，最后才长按电源键关机，再开机。
5. 重启后告诉 AI 几点卡住、几点重启（北京时间）。
不用先按键蓝屏留现场：直接重启就行，自动留的现场也不一定来得及写完。
手机上：手机经远控。远控还能点桌面，就在远控里重启。远控也进不去：有人在电脑旁，就长按电源键；没人在旁边，最后的兜底是用手机控制智能插座断电、再通电开机——插座控制不靠这台电脑，路由器也单独供电（10 月 8 日我确认的），这一步手机直接做。断电和长按电源键一样会丢没保存的工作，还可能截断正在写的文件；AI 没做过断电演练，插座 App 里具体怎么点这里没写。电脑 MCP 有回应，不代表命令真的执行了。

### 远程连不上，还不确定是不是卡死
1. 打开〔授权与状态〕，点“重新检查连接”。
2. 还是不通：用 ToDesk 或网易 UU 连一下，看电脑到底是断网、休眠、关机还是卡住。
3. 只是主机的公网入口坏了、主机本身还好：让 AI 临时改用“经副机的主机备用入口”，见〔连接电脑〕。
4. 提示认证错误：先重新授权，别换入口。操作结果不明：先查原来那次的结果，不要再提交一遍。
手机上：手机直接做，用手机上配好的 ToDesk、UU。备用入口要两台电脑都开着、联网，救不了没开机的 Windows。

::screen{#rescue-03 section="network"}

```typeset
{
 "screen": {
  "id": "rescue-03",
  "section": "network",
  "title": "代理和上网",
  "scene": "横版：左上小节标题“代理和上网”。两张症状卡片左右并排，左卡略宽（约 58%），右卡约 40%。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一个打了结的地球；右卡图标：手机和笔记本之间一条虚线。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 “别做”那几条在左卡里排成三行小字。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽；“别做”三条一行一条。",
  "links": [
   {
    "text": "代理上网修复",
    "href": "/projects/proxyclean/"
   }
  ],
  "anchors": [
   {
    "id": "e-proxy",
    "text": "代理坏了，上不了网"
   },
   {
    "id": "e-proxy-share",
    "text": "手机、副机借电脑上网不行"
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
     "text_ref": "代理和上网",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "代理坏了，上不了网",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "58%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "手机、副机借电脑上网不行",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "40%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "代理和上网",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "代理坏了，上不了网",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "手机、副机借电脑上网不行",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "source_phrase": "先弄清：哪个软件、哪个网址打不开，现在开的是哪个代理客户端，最近改过什么。",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "双击 ProxyClean 文件夹里的“00-打开 ProxyClean.vbs”，选“检查并修复上网问题”。",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "真要停代理，才选“关闭代理，恢复普通上网”；想撤回，选“恢复上次修改”。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "做完看它的设置检查和网页测试，再亲手打开原来打不开的那个网站。",
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
   "asset": "_library/titles/title-4f6c8645496a45c5927f.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\rescue\\img\\rescue-03-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4f6c8645496a45c5927f",
   "title_text": "代理和上网",
   "sha256": "dc013becdd1a606ccba07f78515c7d0cd52e336e0bbb8a368f3d81a1299ffc09",
   "status": "ready",
   "source_box": [
    33,
    42,
    434,
    173
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 代理和上网

### 代理坏了，上不了网
1. 先弄清：哪个软件、哪个网址打不开，现在开的是哪个代理客户端，最近改过什么。
2. 双击 ProxyClean 文件夹里的“00-打开 ProxyClean.vbs”，选“检查并修复上网问题”。
3. 真要停代理，才选“关闭代理，恢复普通上网”；想撤回，选“恢复上次修改”。关了代理以后，Claude、ChatGPT 这些必须走代理的 AI 会连不上：它们故意不改走直连公网，这是正常的，不是又坏了。
4. 做完看它的设置检查和网页测试，再亲手打开原来打不开的那个网站。
5. 换代理客户端：先关旧的，再开新的；同时开着好几个时，选清楚关哪一个。
别做：把 DNS 改成路由器的（这台电脑有自己的解析服务和防泄露设置）；以为关了系统代理就关了 TUN（虚拟网卡模式）；为一个网站重置整台电脑的网络。
手机上：手机经远控，手机不能运行 Windows 程序。工具见〔代理上网修复〕。

### 手机、副机借电脑上网不行
1. 看电脑上开的是哪个代理客户端：FlyingBird 对应 7892 入口，Clash 对应 18091 入口。对应的客户端没开，这个入口没代理是正常的。
2. 按顺序查：客户端在跑 → 后台端口 → Tailscale（只连我自己设备的私人网络）的转发 → 手机或副机那头怎么设的。
3. 最后亲手打开要用的应用或网页。
两个入口只在 Tailscale 里，不开公网；两台设备真的借它上网，还没验收。
手机上：手机那头的设置手机直接做（手机要在 Tailscale 里）；电脑那头手机经远控。

::screen{#rescue-04 section="dictation"}

```typeset
{
 "screen": {
  "id": "rescue-04",
  "section": "dictation",
  "title": "听写",
  "scene": "横版：左上小节标题“听写”。两张症状卡片左右并排、等宽。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一个键盘上的 Win 键和 H 键；右卡图标：一个白绿小胶囊窗和麦克风。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 左卡里两条命令用浅灰底等宽小字单独一行，能完整看清。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽；命令行自动折行但不截断。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   }
  ],
  "anchors": [
   {
    "id": "e-winh",
    "text": "Win+H 没反应"
   },
   {
    "id": "e-dictation-text",
    "text": "听写小窗出来了，却不出字"
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
     "text_ref": "听写",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "Win+H没反应",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "听写小窗出来了，却不出字",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "听写",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "Win+H没反应",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "听写小窗出来了，却不出字",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "source_phrase": "先点一下要打字的输入框，再按 Win+H 或 Ctrl+Win+H。",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "之前在托盘里暂停过快捷键：先恢复快捷键。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "还不行，让 AI 查听写状态，看登录任务“ChineseASR Dictation”在不在跑：",
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
   "source_phrase": "没在跑：只启动这个任务，再按热键：",
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
   "asset": "_library/titles/title-a44d14888ce8f079340c.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\rescue\\img\\rescue-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a44d14888ce8f079340c",
   "title_text": "听写",
   "sha256": "ebd61129f519a90c19ea982dda00587d73ae3af259c25109c0d2f1899205cfd0",
   "status": "ready",
   "source_box": [
    36,
    23,
    203,
    180
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 听写

### Win+H 没反应
1. 先点一下要打字的输入框，再按 Win+H 或 Ctrl+Win+H。
2. 之前在托盘里暂停过快捷键：先恢复快捷键。
3. 还不行，让 AI 查听写状态，看登录任务“ChineseASR Dictation”在不在跑：
scripts\dictation.ps1 -Mode Status
4. 没在跑：只启动这个任务，再按热键：
Start-ScheduledTask -TaskPath '\' -TaskName 'ChineseASR Dictation'
5. 任务真丢了或被改了，才按文档重建。
别做：用 Start、Restart 来“修”，它们会弹出小窗、开始录音。
手机上：手机经远控。远控能发 Win+H；也可以让 AI 经电脑 MCP 查和启动。

### 听写小窗出来了，却不出字
1. 鼠标停在小窗上看状态：等待显卡、模型准备，还是麦克风错误。
2. 新插了麦克风：点箭头菜单里的“刷新麦克风”，选对设备，再点麦克风。
3. 麦克风初始化失败：再点一下麦克风重试，不用重启 Windows。
4. 等待显卡：先结束真正在用显卡的本地模型任务；只开着 AICLI 窗口不算占用。
5. 管理员窗口不让自动输入：点托盘里的“复制最近文本”，自己粘贴。
指定的麦克风不在时，它不会偷偷换成别的麦克风。
手机上：手机经远控。工具见〔中文语音转写〕。

::screen{#rescue-05 section="display"}

```typeset
{
 "screen": {
  "id": "rescue-05",
  "section": "display",
  "title": "串流和主屏",
  "scene": "横版：左上小节标题“串流和主屏”。左边一张大症状卡片（约 60% 宽），右边一张小症状卡片（约 38% 宽），上沿对齐、等高。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一部手机屏幕里是空白的桌面框；右卡图标：一块黑掉的显示器旁一把小钥匙。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 体检命令用浅灰底等宽小字。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽。",
  "links": [
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   }
  ],
  "anchors": [
   {
    "id": "e-stream",
    "text": "串流连上了，却没画面或画面不对"
   },
   {
    "id": "e-blackout",
    "text": "主屏全黑，远程却正常"
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
     "text_ref": "串流和主屏",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "串流连上了，却没画面或画面不对",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "60%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "主屏全黑，远程却正常",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "38%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "串流和主屏",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "串流连上了，却没画面或画面不对",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "主屏全黑，远程却正常",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "先用 ToDesk 或网易 UU 进桌面看看；或者让 AI 跑串流体检：",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "按体检结果分清：是显卡那道关卡没过，还是抓错了屏幕。别乱改显示器设置。",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "刚出过显示故障：连续 15 分钟没有新故障、身份和会话检查都通过，才恢复自动切换。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
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
   "source_phrase": "修完我自己连一次、点一点、断开一次，才算好。",
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
   "asset": "_library/titles/title-c0df0de3fe87c5bf8574.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c0df0de3fe87c5bf8574",
   "title_text": "串流和主屏",
   "sha256": "ae78e486d40b21f37cbcfd1408f07e864bc9d973a8f36350546bcd812341dc79",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 串流和主屏

### 串流连上了，却没画面或画面不对
1. 先用 ToDesk 或网易 UU 进桌面看看；或者让 AI 跑串流体检：
Get-SunshineHealth.ps1 -Json
2. 按体检结果分清：是显卡那道关卡没过，还是抓错了屏幕。别乱改显示器设置。
3. 刚出过显示故障：连续 15 分钟没有新故障、身份和会话检查都通过，才恢复自动切换。
4. 修完我自己连一次、点一点、断开一次，才算好。
电脑上串流服务在跑不算好，手机上真看到画面才算。
手机上：手机经远控。先在手机上重连 Moonlight 或 Artemis，不行再用 ToDesk、UU。工具见〔远程电脑串流〕。

### 主屏全黑，远程却正常
多半是开了主屏黑幕：按 Ctrl+Win+R，或点开始菜单“主屏息屏切换”，再按一次就切回来；远程画面和桌面都还在。
别做：当成显卡坏了去改显示设置。
这只对这块 OLED 主屏的黑幕有效，不是所有黑屏的答案。
手机上：手机经远控。

::screen{#rescue-06 section="panels"}

```typeset
{
 "screen": {
  "id": "rescue-06",
  "section": "panels",
  "title": "机箱小屏和水冷屏",
  "scene": "横版：左上小节标题“机箱小屏和水冷屏”，标题下一行灰色小字。两张症状卡片左右并排、等宽。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：机箱侧面一块竖长小屏；右卡图标：水冷头上一块圆形曲面屏。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 修小屏的命令用浅灰底等宽小字，可折成两行但不截断。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题和灰色小字；两张卡片上下排、满宽。",
  "links": [
   {
    "text": "双屏信息中心",
    "href": "/projects/pc-panel-hub/"
   }
  ],
  "anchors": [
   {
    "id": "e-turzx",
    "text": "机箱小屏（TURZX）不刷新"
   },
   {
    "id": "e-hs2",
    "text": "水冷头曲面屏（HS2）不亮，只剩原生模式"
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
     "text_ref": "机箱小屏和水冷屏",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "两块屏修法不一样，先认清是哪一块。"
    },
    {
     "type": "points_card",
     "text_ref": "机箱小屏（TURZX）不刷新",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "水冷头曲面屏（HS2）不亮，只剩原生模式",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "机箱小屏和水冷屏",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "两块屏修法不一样，先认清是哪一块。"
    },
    {
     "type": "points_card",
     "text_ref": "机箱小屏（TURZX）不刷新",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "水冷头曲面屏（HS2）不亮，只剩原生模式",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "source_phrase": "让 AI 在 E:\\Projects\\Tools\\TURZX-SideScreen 运行：",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "等它报 healthy 才算好：它先认准小屏的串口，再重启或拉起画面程序，直到只剩一个往小屏送画面的程序、每秒一次的心跳是新的。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "只剩原生模式：等稳定 30 秒，每次开机或恢复只试一次切成 Windows 副屏。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "控制器不见了、只剩 Boot ROM：只看着等，别反复切模式、重启 USB、扫设备。",
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
   "asset": "_library/titles/title-4a92087e35145267b8fa.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b2-r3c\\state\\b2-rescue-06-v\\round-01\\candidate-2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4a92087e35145267b8fa",
   "title_text": "机箱小屏和水冷屏",
   "sha256": "242606c717f55f161efd6600225fced24ff28da08fb6ea130732d816c86f9105",
   "status": "ready",
   "source_box": [
    61,
    18,
    873,
    205
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 机箱小屏和水冷屏

两块屏修法不一样，先认清是哪一块。

### 机箱小屏（TURZX）不刷新
1. 让 AI 在 E:\Projects\Tools\TURZX-SideScreen 运行：
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\repair-panel.ps1
2. 等它报 healthy 才算好：它先认准小屏的串口，再重启或拉起画面程序，直到只剩一个往小屏送画面的程序、每秒一次的心跳是新的。
别做：另开一个程序往小屏写；命令返回了不等于修好。它不修水冷屏。
手机上：手机经远控，或让 AI 经电脑 MCP 跑。

### 水冷头曲面屏（HS2）不亮，只剩原生模式
1. 只剩原生模式：等稳定 30 秒，每次开机或恢复只试一次切成 Windows 副屏。
2. 控制器不见了、只剩 Boot ROM：只看着等，别反复切模式、重启 USB、扫设备。
3. 要修硬件：scripts\repair-hs2.ps1 默认只检查，管理员加 -Apply 才真的修。
4. 要动机箱里的 USB 线：先关机、拔电。
手机上：手机经远控能检查；动线要到电脑前。两块屏见〔双屏信息中心〕。

::screen{#rescue-10 section="replace"}

```typeset
{
 "screen": {
  "id": "rescue-10",
  "section": "replace",
  "title": "整台电脑坏了，要换一台",
  "scene": "横版：左上小节标题“整台电脑坏了，要换一台”。左边约 60% 宽一张症状卡片放七步和“别做”；右边约 38% 宽两张上下叠放的小卡片：上面“要准备”（六条短条目，每条前一个小绿点），下面“测过和没演练的”。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一台冒着一缕灰烟的机箱，旁边一块外接硬盘；右上小卡图标：一只打开的工具箱；右下小卡图标：一块一半绿一半灰的小进度条。症状标题右边画一枚灰色描边小圆角标签（＝要到电脑前），标签里不写字。〔…〕里的字画成绿色链接。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；七步卡片满宽；“要准备”“测过和没演练的”两张小卡片依次往下、满宽；字多时在完整卡片之间拆成 -v、-v2。",
  "links": [
   {
    "text": "密码中心打不开",
    "href": "/rescue/#e-password"
   },
   {
    "text": "电脑配置与恢复：电脑坏了怎么办",
    "href": "/projects/pcconfig/#pcconfig-07"
   }
  ],
  "anchors": [
   {
    "id": "e-replace",
    "text": "电脑坏了、进不了系统，要换一台"
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
     "text_ref": "整台电脑坏了，要换一台",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "电脑坏了、进不了系统，要换一台",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "要准备",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "row": "recovery-notes",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "测过和没演练的",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "row": "recovery-notes",
     "icon_position": "header_left",
     "width": "50%"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 本方向未登记原图路径，沿用清单文字构图；待审页员核对。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。\n最终复核：主办理卡整宽在前，两张补充说明下方均分一排，避免一列1卡另一列2卡被首卡等高撑空。原三图标/三卡原字保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "整台电脑坏了，要换一台",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "电脑坏了、进不了系统，要换一台",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "要准备",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "测过和没演练的",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 本方向未登记原图路径，沿用清单文字构图；待审页员核对。"
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "先找一台能用的 Windows 电脑，接上一块完整的备份盘（G 或 H 都行），由本人解锁（BitLocker 整盘加密）。别在坏电脑上反复折腾；这台准备电脑也不是要清空还原的那台。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "在准备电脑上打开 Codex，说“我要换机恢复”；或者先看备份盘根目录的“换机恢复.txt”。之后每一步 AI 陪着指导。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "取出镜像密码。在备份盘根目录打开“密码中心.exe”，自己验证、搜“镜像”。密码自己看，不发进聊天。打不开见〔密码中心打不开〕。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "做启动 U 盘：把备份盘里的 Veeam 恢复盘写进一个可以清空的 U 盘。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-fbeef3acf7e4b1ac5046.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fbeef3acf7e4b1ac5046",
   "title_text": "整台电脑坏了，要换一台",
   "sha256": "1113eda77df3d59ce624a5013f11a4575f9449977e666f402ed6727b28c47290",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 整台电脑坏了，要换一台

### 电脑坏了、进不了系统，要换一台
1. 先找一台能用的 Windows 电脑，接上一块完整的备份盘（G 或 H 都行），由本人解锁（BitLocker 整盘加密）。别在坏电脑上反复折腾；这台准备电脑也不是要清空还原的那台。解锁后私人备份区还提示没有权限：用这台电脑的任意管理员账户打开 PowerShell，运行盘里附带的取回命令 `Recover-BackupAccess.ps1`（H 盘在 `90_人工保留区\RecoveryKit\RECOVERY_TOOLS`，目标写 `H:\80_自动备份区`；只有 G 盘时在 `G:\80_Backup\RecoveryKit\RECOVERY_TOOLS`，目标写 `G:\80_Backup`；救急 U 盘的 `PE_TOOLS` 里也带一份）。目标别写整个盘根；它只把访问权拿回来，不解密文件、不改盘根，部分失败会列出来，只对失败的那部分重跑。完整命令见“救急先看.txt”。
2. 在准备电脑上打开 Codex，说“我要换机恢复”；或者先看备份盘根目录的“换机恢复.txt”。之后每一步 AI 陪着指导。
3. 取出镜像密码。在备份盘根目录打开“密码中心.exe”，自己验证、搜“镜像”。密码自己看，不发进聊天。打不开见〔密码中心打不开〕。
4. 做启动 U 盘：把备份盘里的 Veeam 恢复盘写进一个可以清空的 U 盘。
5. 还原：先想好 C 盘多大，从 U 盘启动，用 Veeam 把 Windows 和 C 盘还原到新硬盘。没确认目标硬盘，不清盘。
6. 第一次开机前先断网，拔掉数据盘和备份盘；进系统后先停会同步删除、清理的自动任务，再联网、接盘。
7. 再打开 Codex，说“这是新电脑，继续恢复”，剩下的软件、配置和资料由 AI 按顺序恢复。
别做：拿现在的救急 U 盘（F 盘）去重写启动盘；把准备电脑当成还原目标。
手上只有救急 U 盘时：先看里面的“救急先看.txt”；它带 PE 工具（不进系统也能用的急救系统）。
手机上：要到电脑前。手机能看这一页和〔电脑配置与恢复：电脑坏了怎么办〕。

**要准备**
- 一台能用的 Windows 电脑
- 一块完整的备份盘：系统镜像、数据备份和 Veeam 恢复盘都在上面
- 盘里完整的独立密码中心和它的加密库；我能用的验证方式（完全不联网时，要一份匹配、有效的恢复码）
- 一个可以清空的 U 盘
- 想好新硬盘和 C 盘多大
- 另一台电脑或手机：还原时看 AI 的指导

**重装了 Windows、数据盘还在，私人文件夹却打不开**　原件没丢：它们是 `E:\.private` 下的普通文件（PersonalData、Pictures、Videos、Music、Media 五个），`E:\<名>` 只是指过去的门牌，关着时指向一个打不开的占位目录；G/H 备份里也是原样的文件。把门牌改回普通目录交给 AI 照“换机恢复”说明做：先停会写这些目录的程序、电脑 MCP 服务和每天的热备份任务，装好 Python 3，在系统自带的管理员 PowerShell 里用原机留下的迁移日志逐个根回滚（只回滚当初真迁移过的根）；身份对不上或缺日志就停下按实物核对，不凭目录名猜着搬。五个根都恢复后再重新打开自动任务。手机上：要到电脑前。

**测过和没演练的**　9 月 22 日在副机上测过：接备份盘、取出镜像密码、解开镜像、提出文件，核对一致。空盘整机还原、用 U 盘启动、在新硬件上开机、整台新电脑接着用，都还没演练；第一次真用可能要多花时间排查，不保证一次就能恢复。

::screen{#rescue-07 section="password"}

```typeset
{
 "screen": {
  "id": "rescue-07",
  "section": "password",
  "title": "密码中心打不开",
  "scene": "横版：左上小节标题“密码中心打不开”。左边约 62% 宽一张症状卡片放五步；右边约 36% 宽两张上下叠放的小卡片：上面“没有后门”，下面“手机上”。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一个绿色小保险柜；右上小卡图标：一扇没有钥匙孔的门；右下小卡图标：一部手机。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；五步卡片满宽；“没有后门”“手机上”两张小卡片依次往下、满宽。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   }
  ],
  "anchors": [
   {
    "id": "e-password",
    "text": "密码中心打不开（电脑坏了、换电脑）"
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
     "text_ref": "密码中心打不开",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "密码中心打不开（电脑坏了、换电脑）",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "没有后门",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "row": "recovery-notes",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "手机上",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "row": "recovery-notes",
     "icon_position": "header_left",
     "width": "50%"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。\n最终复核：主办理卡整宽在前，两张补充说明下方均分一排，避免一列1卡另一列2卡被首卡等高撑空。原三图标/三卡原字保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "密码中心打不开",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "密码中心打不开（电脑坏了、换电脑）",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "没有后门",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "手机上",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 本方向未登记原图路径，沿用清单文字构图；待审页员核对。"
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "先用平常的“密码中心”入口试。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "旧电脑用不了：接上带完整程序和完整密码备份的移动硬盘或 U 盘，从盘根打开“密码中心.exe”，按窗口提示选备份库。G、H 两块备份盘根目录各有一份。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "完全不联网也能开：用和这份备份匹配、还有效的恢复码。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "手机上的密码中心还能用：直接在手机上查已有的条目。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-fcf02ea13efaf53221b6.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\b2-surgery\\b2-rescue-07-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-fcf02ea13efaf53221b6",
   "title_text": "密码中心打不开",
   "sha256": "a39921dc2b8a00e9c9c3f02bf69d1e581791835d9917ab0686468fecf2d2f926",
   "status": "ready",
   "source_box": [
    22,
    9,
    883,
    262
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 密码中心打不开

### 密码中心打不开（电脑坏了、换电脑）
1. 先用平常的“密码中心”入口试。
2. 旧电脑用不了：接上带完整程序和完整密码备份的移动硬盘或 U 盘，从盘根打开“密码中心.exe”，按窗口提示选备份库。G、H 两块备份盘根目录各有一份。
3. 完全不联网也能开：用和这份备份匹配、还有效的恢复码。
4. 手机上的密码中心还能用：直接在手机上查已有的条目。
5. 手边没有盘：从我的私人云端取加密的库，再补齐完整程序。登上云端账号、拿到源码，都不等于能打开库。

**没有后门**　没有任何能用的副本，或者所有能用的验证方式都丢了，就没有绕过验证找回的办法。先留好旧盘、加密文件和旧手机，别清。网页上“解锁个人资料”也代替不了打开密码中心。

**手机上**　手机上的密码中心还能用时，手机直接做；换电脑恢复要到另一台 Windows 电脑前。详见〔密码中心〕。

::screen{#rescue-08 section="codex"}

```typeset
{
 "screen": {
  "id": "rescue-08",
  "section": "codex",
  "title": "Codex 对话要恢复",
  "scene": "横版：左上小节标题“Codex 对话要恢复”。两张症状卡片左右并排、等宽。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 左卡图标：一个转圈的加载环；右卡图标：一只带锁的小档案盒。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 命令用浅灰底等宽小字。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽。",
  "links": [
   {
    "text": "AI 备份",
    "href": "/projects/codex-memory/"
   }
  ],
  "anchors": [
   {
    "id": "e-codex",
    "text": "Codex 桌面一直转圈，对话多半还在"
   },
   {
    "id": "e-codex-backup",
    "text": "真要从备份里取回对话"
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
     "text_ref": "Codex对话要恢复",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "Codex桌面一直转圈，对话多半还在",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "真要从备份里取回对话",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 本方向未登记原图路径，沿用清单文字构图；待审页员核对。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "Codex对话要恢复",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "Codex桌面一直转圈，对话多半还在",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "真要从备份里取回对话",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。 本方向未登记原图路径，沿用清单文字构图；待审页员核对。"
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "先别以为对话丢了。用命令行接着做：运行 codex resume --all 找到原来那个任务，或者按已知的会话编号恢复。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "只接原来那个任务：不复制任务，不唤醒无关的旧任务。",
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
   "source_phrase": "刚更新完第一次打开没窗口：等原来的进程准备好，别反复点开。",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "开始菜单里的“Codex AI Auto Repair”是应急入口，不是平时打开的方式；让 AI 先读完恢复说明再用。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9f52b3d944189ad8d9ac.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9f52b3d944189ad8d9ac",
   "title_text": "Codex 对话要恢复",
   "sha256": "87a01b9b90fd9b4f59eb037f16ab96ebd0c5a2f8b51e0ede3da907314df2b359",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## Codex 对话要恢复

### Codex 桌面一直转圈，对话多半还在
1. 先别以为对话丢了。用命令行接着做：运行 codex resume --all 找到原来那个任务，或者按已知的会话编号恢复。
2. 只接原来那个任务：不复制任务，不唤醒无关的旧任务。
3. 刚更新完第一次打开没窗口：等原来的进程准备好，别反复点开。
4. 开始菜单里的“Codex AI Auto Repair”是应急入口，不是平时打开的方式；让 AI 先读完恢复说明再用。
别做：手改 Codex 的数据库，清空或挪走会话文件夹。
手机上：手机经远控，在远控里开命令行，或交给电脑 MCP 上的 AI。

### 真要从备份里取回对话
1. 让 AI 先只读核对对话备份和回执：
Invoke-CodexConversationBackup.ps1 -Mode Validate -PayloadStore Hot -ReadOnly -Json
2. 取回到一个全新的空文件夹；正在用的 Codex 目录、原来的目录和备份目录，程序都会拒绝。
3. 备份每天北京时间 12:15 做一次，有常用和冷备两份可选。
文件取出并核对一致，8 月 30 日已经测过；Codex 读回任务列表、接着聊还没实测。配置和记忆不在这份备份里，从开发配置备份找。
手机上：手机经远控；放备份的盘要真能读到，别指望坏掉的旧电脑。详见〔AI 备份〕。

::screen{#rescue-09 section="other"}

```typeset
{
 "screen": {
  "id": "rescue-09",
  "section": "other",
  "title": "其他",
  "scene": "横版：左上小节标题“其他”。两张症状卡片左右并排、等宽等高。每条症状一张白底细浅绿描边圆角卡片：卡片顶上粗体绿色症状名（锚点落在这里），下面编号步骤，“别做”一行用浅橙色小字、前面一个小叉，最后一行“手机上：…”前面画一个小手机线描图标。卡片里不放插画，只在卡片左上角放一个很小的水彩线描图标（写在各屏 scene 里）。 两张卡的图标依次是：两台笔记本之间一张小纸片；一个转圈的弹窗。每条症状标题右边画一枚小圆角标签，标出“手机上”那一行的结论：深绿实心＝手机直接做，浅绿描边＝手机经远控，灰色描边＝要到电脑前；标签只画颜色和形状，不另写字（字已经在“手机上”那一行里）。 本页不加任何动效，也不放开头短视频；图要小、要轻，手机网络慢时也先出字。",
  "portrait": "竖版：小节标题；两张卡片上下排、满宽。",
  "links": [
   {
    "text": "双机剪贴板",
    "href": "/projects/meshclip-kit/"
   }
  ],
  "anchors": [
   {
    "id": "e-clipboard",
    "text": "两台电脑的剪贴板不同步"
   },
   {
    "id": "e-chatgpt-auth",
    "text": "ChatGPT 添加副机连接时，授权一直转圈"
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
     "text_ref": "其他",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "两台电脑的剪贴板不同步",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "ChatGPT添加副机连接时，授权一直转圈",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "row": "symptoms",
     "width": "50%",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "其他",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "points_card",
     "text_ref": "两台电脑的剪贴板不同步",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "ChatGPT添加副机连接时，授权一直转圈",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "status_tag": "shape_only",
     "commands": "monospace",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 小图标限卡头，不使用大插画；手机能力标签只画形状、不增加字。按钮/卡头图标/症状标签如组件未承接，列为未完成，不把数字质量通过当构图完成。"
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "两台电脑都登录着，KDE Connect 都开着。",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "对方的“剪贴板”插件开着；先复制一段纯文字试，别两边同时复制。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "找不到对方：看两台是不是在同一个 Tailscale 里、对方醒着、配对的是不是这台，再运行 kdeconnect-cli --refresh。",
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
   "source_phrase": "关掉整个“添加副机 MCP”弹窗，从“连接”重新发起一次；只关小窗、等旧弹窗没用。",
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
   "asset": "_library/round3/titles/title-r3-d2909f1647e7c891a828.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\b2-surgery\\b2-rescue-09-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-d2909f1647e7c891a828",
   "title_text": "其他",
   "sha256": "3aaf3b932b1c34f3b4c3a8150e0474a22d10569f644dc3e0b8854c20512aec03",
   "status": "ready",
   "source_box": [
    17,
    20,
    390,
    240
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 其他

### 两台电脑的剪贴板不同步
1. 两台电脑都登录着，KDE Connect 都开着。
2. 对方的“剪贴板”插件开着；先复制一段纯文字试，别两边同时复制。
3. 找不到对方：看两台是不是在同一个 Tailscale 里、对方醒着、配对的是不是这台，再运行 kdeconnect-cli --refresh。
现在只同步文字，不同步图片；没登录的电脑不同步。
手机上：手机经远控。见〔双机剪贴板〕。

### ChatGPT 添加副机连接时，授权一直转圈
1. 关掉整个“添加副机 MCP”弹窗，从“连接”重新发起一次；只关小窗、等旧弹窗没用。
2. 别用旧的授权链接，也别再建一个重复的连接。
3. 连上后真调一次 ComputerContext 和一条只读命令，确认连的是副机。“已安装”不算好。
手机上：能打开 ChatGPT 的地方就能做；手机 App 能不能新建连接还没核实，不行就在电脑网页上做。
