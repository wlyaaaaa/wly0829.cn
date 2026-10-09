---
{
 "title": "连接电脑",
 "kind": "mcp",
 "url": "/mcp/",
 "tagline": "我自己看桌面，或让 AI 用电脑：入口、步骤、验证日期。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "see-desktop",
   "label": "我自己看桌面"
  },
  {
   "id": "ai-use",
   "label": "让 AI 用电脑"
  },
  {
   "id": "chatgpt",
   "label": "ChatGPT 怎么接"
  },
  {
   "id": "claude",
   "label": "Claude 和 Codex 怎么接"
  },
  {
   "id": "verified",
   "label": "最近一次真实验证"
  }
 ],
 "page": {
  "schema": "site-b2.page.v1",
  "page": "mcp",
  "kind": "mcp",
  "title": "连接电脑",
  "url": "/mcp/",
  "tagline": "我自己看桌面，或让 AI 用电脑：入口、步骤、验证日期。",
  "status": "",
  "public": true,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "6f3cb90f79d8dd7632eb3adf0e1cd5028471bf92",
   "commit_time": "2026-09-25T03:52:41+08:00",
   "file": "旧站源码 V:\\Personal\\Projects\\wly0829.cn（app\\page.jsx McpAccessPage、app\\content-mcp-access.js）；PCConfig 91b73e4（tools\\remote-computer-mcp\\README.md、docs\\recovery\\副驾驶笔记本账本.md）；事实单 b1\\pipe\\p2\\facts-ops.md 第 2 节；10 月 1 日 18:29 本写稿人对副机 ComputerContext 的一次只读调用"
  },
  "video_prompt": "以这张图为第一帧，镜头和构图完全不动，只让插画里的东西轻轻动：手机和显示器之间那条绿色丝带像被微风吹着轻轻起伏，丝带上漂着的那一小块桌面画面慢慢滑向手机；另一条虚线上，一颗绿色光点从手机的对话气泡出发，沿虚线流进机箱，机箱侧面的绿色灯带随之亮一下；显示器屏幕上的浅绿画面缓慢流动；笔记本屏幕微微亮起再暗回去；桌角绿植的叶子轻轻摇，一片小叶子缓缓飘落。画面里不出现任何文字和数字，不添加新东西，按钮、文字和空框所在的白色纸面保持干净不动。约 6 秒，首尾衔接成无缝循环，水彩画风不变，没有声音。 ｜ Prompt: Use this image as the first frame. Keep the camera and composition completely still and gently animate only what is in the illustration: the green ribbon between the phone and the monitor ripples softly as if in a light breeze, and the small piece of desktop picture floating on it glides slowly toward the phone; along the other dotted line, a small green light dot leaves the chat bubble on the phone and flows into the PC case, and the green light strip on the side of the case brightens once; the pale green picture on the monitor drifts slowly; the laptop screen glows faintly and dims again; the leaves of the desk plant sway gently and one small leaf drifts down. No text or numbers anywhere, add nothing new, keep the white paper where the buttons, text and empty boxes sit clean and still. About 6 seconds, the last frame matches the first for a seamless loop, same watercolor style, no audio.",
  "registry": {
   "live": [
    {
     "slot": "mcp-main",
     "screen": "mcp-01",
     "meaning": "主机现在在不在线。灯和字一起换（预先画好四张同尺寸的小灯：绿、黄、灰、空心灰圈）：绿“在线 · 已开机 N 小时”；黄“正在连接”；灰“连不上，最后一次读到 HH:MM”；空心灰圈“暂时读不到”。",
     "source": "GET https://mcp.wly0829.cn/computer-access/api/status 成功与否（接口没有单独的 online 字段，在线＝这次读取成功且数据是新的）；已开机多久取 host.uptime_seconds。前台每 60 秒读一次，回到前台立即读，后台不读。",
     "gap": "“能不能连”（MCP 入口本身通不通）现在没有公开的可读来源：status 读得到只说明状态服务通。AI 建议：后端在 status 里加一个主、副机 MCP 入口可达检查（例如未认证请求返回 401 就算入口通），接上前只显示在线与否。"
    },
    {
     "slot": "mcp-secondary",
     "screen": "mcp-01",
     "meaning": "副机现在在不在线、MCP 入口通不通。接上来源前写“还没接上”（空心灰圈），不写“正常”也不写“读不到”。",
     "source": "现在没有来源：主机的 status 接口不带副机；原 /mcp/ 页的摘要也只读主机。",
     "gap": "要副机自己出一个公开的只读状态，或由主机代测副机入口；属于 PCConfig 远程服务的改动。"
    },
    {
     "slot": "mcp-grants",
     "screen": "mcp-01",
     "meaning": "主机授权摘要，两行，每行一盏小灯加字：个人资料“锁着”（灰）／“开着，到 HH:MM”（绿）／“正在变”（黄）；无限制授权“关着”（灰）／“开着，到 HH:MM”（绿）。读不到时两行都写“当前状态未知”（空心灰圈），不留旧的绿灯。只看，不放按钮；办理去授权与状态页。",
     "source": "同一个 status：personal_data.state/expires_at_unix、unrestricted.state/expires_at_unix。"
    }
   ],
   "numbers": [
    {
     "id": "n-chatgpt-main",
     "text": "9 月 11 日 16:54、17:15–17:16",
     "meaning": "ChatGPT → 主机最近一次带日期的调用验收",
     "as_of": "2026-10-01",
     "source": "content-mcp-access.js:11–14；PCConfig MCP README.md:48",
     "screens": [
      "mcp-06"
     ]
    },
    {
     "id": "n-chatgpt-secondary",
     "text": "9 月 11 日 11:28",
     "meaning": "ChatGPT → 副机",
     "as_of": "2026-10-01",
     "source": "content-mcp-access.js:23–26；README.md:50",
     "screens": [
      "mcp-06"
     ]
    },
    {
     "id": "n-claude-secondary",
     "text": "10 月 1 日 18:29",
     "meaning": "主机 Claude Code → 副机，一次只读 ComputerContext 调用（返回 computer=LAPTOP-E48N0DRJ）",
     "as_of": "2026-10-01",
     "source": "本写稿人在本会话的 mcp__secondary_laptop__ComputerContext 调用，observed_utc 2026-10-01T10:29:47Z",
     "screens": [
      "mcp-06"
     ]
    },
    {
     "id": "n-codex-fallback",
     "text": "9 月 11 日 17:38、17:45",
     "meaning": "副机 Codex → 主机备用入口",
     "as_of": "2026-10-01",
     "source": "PCConfig MCP README.md:21（UTC 09:38/09:45 换算）",
     "screens": [
      "mcp-06"
     ]
    },
    {
     "id": "n-fallback-drill",
     "text": "9 月 11 日 16:28–16:29",
     "meaning": "停主机隧道后经备用入口普通命令 3/3",
     "as_of": "2026-10-01",
     "source": "PCConfig MCP README.md:50、52；content-mcp-access.js:35–37",
     "screens": [
      "mcp-06"
     ]
    }
   ],
   "mentions": [
    {
     "target": "/computer-access/",
     "screen": "mcp-01",
     "text": "授权与状态"
    },
    {
     "target": "/cockpit/#remote",
     "screen": "mcp-01",
     "text": "驾驶舱"
    },
    {
     "target": "/rescue/#e-stream",
     "screen": "mcp-02",
     "text": "救急先看：串流没画面"
    },
    {
     "target": "/projects/sunshine-remote-streaming/",
     "screen": "mcp-02",
     "text": "远程电脑串流"
    },
    {
     "target": "/rescue/#e-chatgpt-auth",
     "screen": "mcp-04",
     "text": "救急先看：ChatGPT 授权转圈"
    },
    {
     "target": "/rescue/#e-remote",
     "screen": "mcp-06",
     "text": "救急先看：远程连不上"
    }
   ]
  },
  "notes": {
   "merged": [
    "旧页三步“选电脑，复制说明 → 完成认证 → 确认连通，再使用”并进 ChatGPT、Claude 两屏的具体步骤，不再单列一屏。",
    "旧页“接入方式与认证”“技术与最近验收”两个折叠区：认证并进第 4、5 屏，验收并进第 6 屏的表格；不再做折叠。",
    "旧页页首“主机授权状态”摘要卡：保留成第 1 屏的 mcp-grants 实时框（只看）；旧卡上解锁、开启、延长、锁定、结束五个跳转按钮合成一个〔授权与状态〕链接，办理都在那页。",
    "旧页摘要里的“Grafana 是否在线”：电脑性能和曲线都归驾驶舱（本人 10 月 1 日同意性能挪到驾驶舱），本页改成〔驾驶舱〕链接。"
   ],
   "dropped": [
    "旧页“最近普通调用日期”写在每张设备卡上：改为第 6 屏一张表统一写，设备卡上不重复。",
    "旧页的速度样本（20 次只读命令 0.70–0.77 秒）：只覆盖当时的通用客户端，不代表手机或 ChatGPT 的往返速度，不上。"
   ],
   "unsure": [
    "Claude Code（主机）→ 副机 的验证日期 10 月 1 日 18:29：事实单 U03 写“没找到主机侧完整验收日期”。我在写稿时用本会话已接好的 secondary_laptop 连接做了一次只读 ComputerContext 调用，成功返回 computer=LAPTOP-E48N0DRJ、执行身份 SYSTEM（session 0）。这说明 OAuth 登录已完成、工具能调通；没测命令执行和桌面工具。表里写的是“只读调用 ComputerContext”。这次调用是事实单以外我自己做的检查，请 Claude 决定能不能上页。",
    "“Claude 连主机、Claude 手机 App 和网页版：目前没有登记过的接法”：依据是事实单只查到主机 Claude Code → 副机这一条登记（PCConfig MCP README.md:15–23）。若本人其实在 Claude 手机或网页里加过连接器，这句要改。",
    "实时“能不能连”：本人要求写在不在线、能不能连。现在主机只有“状态接口读得到”这一个来源，副机没有任何来源；两个 live 槽位的 gap 里写了要补什么（AI 建议）。接上前副机显示“还没接上”。",
    "第 3 屏的“复制给 AI 的说明”“只复制地址”是会动的按钮（写剪贴板）。第 1 批格式没有按钮字段，我在每屏加了 buttons（图上字、在哪张卡、做什么、接什么），图上用［］标出按钮字；拼页程序要据此在图上放点击区。",
    "ChatGPT 第 1 步菜单路径用的是官方文档英文名（Security and login、Developer mode），没核实本人账号界面上的中文名；第 2 步“放进项目‘我的电脑’”出自 PCConfig MCP README.md:164、172–182。",
    "第 4 屏写了 OAuth 客户端 ID（https://chatgpt.com/oauth/client.json）和权限范围：这是 ChatGPT 公开的客户端标识，不是秘密；入口密码只写名字、不写值。",
    "副机地址里有笔记本的 Tailscale 机器名（laptop-e48n0drj）：旧公开页已经登过，照登。",
    "替本人口吻写的句子：第 1 屏“两条路连到我家里这台电脑”、第 6 屏“用之前知道”四条。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/mcp/page.json",
  "sha256": "374660f1e3de6277d77811c83eecc0c6fd9a68652c33e68bc063ad5854c06000",
  "converted_at_beijing": "2026-10-10T03:45:10+08:00"
 }
}
---

::screen{#mcp-01 section="top"}

```typeset
{
 "screen": {
  "id": "mcp-01",
  "section": "top",
  "title": "开头：两条路",
  "scene": "横版：左上毛笔艺术字大标题“连接电脑”，下面一行介绍。右上约 40% 宽一幅水彩插画（开头短视频从这里取景）：家里书桌上一台侧透机箱和一台显示器，桌边一台合上一半的笔记本（副机）；画面左下角一部手机。手机和显示器之间两条细线：一条是绿色丝带，丝带上漂着一小块桌面画面（表示串流）；另一条是虚线，线上一颗绿色光点，手机屏上一个对话气泡，气泡旁小小的 ChatGPT 和 Claude 标志。插画里不画字。插画左边、标题下方两张等宽竖卡片并排：左卡“我自己看桌面”（小图标：一只眼睛对着一块屏幕），右卡“让 AI 用电脑”（小图标：对话气泡连着一个小齿轮），卡片最后一行是绿色带箭头的页内链接。下面一条满宽“现在”横条：左边“现在”两个毛笔字，接着三个空框——主机（约屏宽 22%、高约屏高 8%）、副机（同样大小）、主机授权（约屏宽 34%、同高），框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填；每个框上方一行灰色小字标签（主机、副机、主机授权）。横条下面一行灰色小字和两个链接。",
  "portrait": "竖版：标题和介绍；插画缩到屏宽；两张路线卡片上下排、满宽；“现在”横条改成竖排：“现在”二字，下面三个满宽空框依次往下（每个高约一行半字，上方带标签）；最后两行灰色小字和链接。",
  "links": [
   {
    "text": "↓ 我自己看桌面",
    "href": "/mcp/#see-desktop"
   },
   {
    "text": "↓ 让 AI 用电脑",
    "href": "/mcp/#ai-use"
   },
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/#remote"
   }
  ],
  "anchors": [],
  "live": [
   "mcp-main",
   "mcp-secondary",
   "mcp-grants"
  ],
  "buttons": [],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "width": "60%",
     "text_ref": "连接电脑"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "text_ref": "两条路连到"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "hero",
     "width": "40%",
     "index": 0
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "top_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "我自己看桌面"
    },
    {
     "type": "live_strip",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "keys": [
      "mcp-main",
      "mcp-secondary",
      "mcp-grants"
     ],
     "label_layout": "above_frame",
     "frame_widths": [
      "22%",
      "22%",
      "34%"
     ],
     "text_ref": "现在",
     "frame_mode": "plain"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "footer",
     "width": "55%",
     "text_ref": "要开、要关个人资料"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "footer",
     "width": "45%",
     "text_ref": "只给我本人"
    }
   ],
   "notes": "实查：左侧标题/介绍/两张路线卡占约46%，右侧独立桌面插画占约54%且纵贯卡片高度；路线卡上图下字，无流程连线。下面整宽现在条，主机/副机/主机授权三框留白且标签在框上方；末尾说明分左右。定稿两段路线为group+para整节点，放同块能完整分成两卡。新样式：三框带标签实时条不在批准样板中，待组件样张。现core.live_strip忽略group后的标签para，尚不能保全三项标签/不等宽框；keys/label_layout/frame_widths是构图记录，当前未消费。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "连接电脑"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "两条路连到"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "index": 0
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": "auto",
     "text_ref": "我自己看桌面"
    },
    {
     "type": "live_strip",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "columns_v": 1,
     "keys": [
      "mcp-main",
      "mcp-secondary",
      "mcp-grants"
     ],
     "label_layout": "left_of_frame",
     "text_ref": "现在",
     "frame_mode": "plain"
    },
    {
     "type": "notice",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "要开、要关个人资料"
    }
   ],
   "notes": "实查：标题与介绍在上半部左侧，桌面插画从右侧延伸至其下；两路线卡单列且左图右文。现在整宽卡内三框依次向下，标签在每框左侧；最后两说明段同一浅绿卡。现引擎不支持hero插画贴右上延伸的形状，独立插画块只能记录顺序；live_strip的标签问题同横版。三框带标签样式须先样张。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "一只眼睛对着一块屏幕",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "对话气泡连着一个小齿轮",
   "sha256": "60292b6592be891c5b33705abee2c54bdae380a80322215e7a46049e245144a5",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "桌面设备",
   "source_phrase": "右上约 40% 宽一幅水彩插画（开头短视频从这里取景）：家里书桌上一台侧透机箱和一台显示器，桌边一台合上一半的笔记本（副机）；画面左下角一部手机。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "mcp/mcp-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\mcp\\img\\mcp-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-aa8446366b2cdde368b5",
   "title_text": "连接电脑",
   "sha256": "9c55a62c0a433d3b47c62d5246baedb4ff00f7547933c97a88f8f47aee82a5b0",
   "status": "ready"
  }
 ]
}
```

# 连接电脑

两条路连到我家里这台电脑。

**我自己看桌面**
用 Moonlight 串流，在手机或笔记本上看见桌面、亲手点。〔↓ 我自己看桌面〕

**让 AI 用电脑**
ChatGPT、Claude、Codex 经电脑 MCP（让 AI 远程用这台电脑的文件、命令和桌面的接口）来干活。〔↓ 让 AI 用电脑〕

**现在**
主机　副机　主机授权

要开、要关个人资料和无限制授权，去〔授权与状态〕；电脑本身累不累，看〔驾驶舱〕。
只给我本人和我授权过的客户端用：复制地址拿不到任何操作权限。

::screen{#mcp-02 section="see-desktop"}

```typeset
{
 "screen": {
  "id": "mcp-02",
  "section": "see-desktop",
  "title": "我自己看桌面",
  "scene": "横版：左上小节标题“我自己看桌面”，下面一行绿色副标题。左边约 55% 宽一张白底细浅绿边圆角卡片“怎么连”，三步编号，每步前一个小水彩图标（手机上点一台电脑、手指点屏幕、断开的插头和原位的窗口）。右边约 43% 宽上下三张小卡片：“画面怎么选”“停在登录界面时”“最近一次真实验证”；最后一张的“未核实”用浅灰圆点加字。最下面一行字，两个链接画成绿色。卡片之间间距一致。",
  "portrait": "竖版：小节标题和副标题；“怎么连”卡片满宽；三张小卡片依次往下、满宽；最后一行字。",
  "links": [
   {
    "text": "救急先看：串流没画面",
    "href": "/rescue/#e-stream"
   },
   {
    "text": "远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   }
  ],
  "anchors": [
   {
    "id": "see-moonlight",
    "text": "怎么连"
   }
  ],
  "live": [],
  "buttons": [],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "我自己看桌面"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "日常用 Moonlight"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "body",
     "width": "55%",
     "container": "connection_card",
     "text_ref": "怎么连"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "body",
     "icons": "auto",
     "container": "connection_card",
     "text_ref": "打开手机",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "body",
     "width": "45%",
     "icons": "auto",
     "text_ref": "画面怎么选"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "body",
     "icons": "auto",
     "text_ref": "停在登录界面时"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "body",
     "icons": "auto",
     "text_ref": "最近一次真实验证"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "没画面看"
    }
   ],
   "notes": "按pages-approved横版替换图实查：上方左标题/绿介绍右桌面插画；下方左整张怎么连卡三步上下排列，每步编号在左、插画居中、正文在右，无丝带。右侧三张卡纵排，均左图右文；未核实带灰点；底部链接通栏。现numbered_steps的left_inside仍输出上图下文，container字段无法把标题和步骤合成一个边框；实际三步行布局需组件样张。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "我自己看桌面"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "日常用 Moonlight"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "container": "connection_card",
     "text_ref": "怎么连"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": "auto",
     "container": "connection_card",
     "text_ref": "打开手机",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "画面怎么选"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "bottom_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "停在登录界面时"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "bottom_right_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "最近一次真实验证"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "没画面看"
    }
   ],
   "notes": "实查v及替换v2：v为居中标题/绿介绍、三步大卡、画面怎么选卡；v2为停在登录界面时大卡（文字上、电脑互联插画下）和最近验证卡（灰点未核实、放大镜在右下），末尾链接整宽。原v2两卡题为粗体深绿，无需把原图的旧毛笔字复制回来。bottom_inside/bottom_right_inside为原图真实位置扩展值，当前content_card忽略；单卡末尾大插画、三步左右排、共享边框均须样张。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机电脑连接",
   "source_phrase": "手机上点一台电脑",
   "sha256": "e6a52f20c9ed3fcd5cffb31c493bce640a7e585eecb6bfdcd41a24f38ece4745",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "手指点屏幕",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-d819641dd52018c42577.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断开插头",
   "source_phrase": "断开的插头和原位的窗口",
   "sha256": "c90bccf55a820d3a09af80cdd6237485d146faace49e2ca45885101d679d4b84",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“我自己看桌面”，下面一行绿色副标题。左边约 55% 宽一张白底细浅绿边圆角卡片“怎么连”，三步编号，每步前一个小水彩图标（手机上点一台电脑、手指点屏幕、断开的插头和原位的窗口）。右边约 43% 宽上下三张小卡片：“画面怎么选”“停在登录界面时”“最近一次真实验证”；最后一张的“未核实”用浅灰圆点加字。最下面一行字，两个链接画成绿色。卡片之间间距一致。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "mcp/mcp-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b2-r1\\state\\b2-mcp-02-h\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5c9195e6eba128e02e2c",
   "title_text": "我自己看桌面",
   "sha256": "58444074024c9a27be9721cc9460f5012d1f3dc99910554964c4ce8ea2c61879",
   "status": "ready"
  }
 ]
}
```

## 我自己看桌面

日常用 Moonlight 连主机（电脑上跑的是 Sunshine；Artemis 也能连）。副机也以 Moonlight 为主，网易 UU、ToDesk 备用。

**怎么连**
1. 打开手机或笔记本上的 Moonlight，点已经配对好的主机。人不在家时，这台设备要在 Tailscale（只连我自己设备的私人网络）里。
2. 看得见桌面、点得动，才算连上。
3. 断开后看一眼：主屏和窗口还在原位。

**画面怎么选**　先用正在亮的主屏；只有一块健康的虚拟屏可以兜底。连上、断开都不会关掉或重排主屏、水冷屏和机箱小屏。

**停在登录界面时**　Moonlight 要先登录才行，这时用 ToDesk：看门狗每 2 分钟把 ToDesk 服务修回开着。重启后、登录前从别的设备真连一次，还没验收。

**最近一次真实验证**　未核实：找不到一次带日期的“连上、操作、断开”完整记录。

没画面看〔救急先看：串流没画面〕；技术细节见〔远程电脑串流〕。

::screen{#mcp-03 section="ai-use"}

```typeset
{
 "screen": {
  "id": "mcp-03",
  "section": "ai-use",
  "title": "让 AI 用电脑：三个入口",
  "scene": "横版：左上小节标题“让 AI 用电脑”，下面两行说明。中间三张等宽等高的竖卡片一行排开：主机（小水彩图标：侧透机箱）、副机（笔记本）、主机备用入口（笔记本和机箱之间一条转接的弯箭头）。每张卡片：粗体名字、一行灰字说明；一个浅灰底圆角地址条，地址用等宽字体完整画出、不截断（可折两行）；地址条下两个按钮并排——左边绿底白字“复制给 AI 的说明”，右边白底细绿边“只复制地址”；下面两三行字。卡片下面一行灰色小字。",
  "portrait": "竖版：小节标题和说明；三张卡片上下排、满宽，地址条满宽，两个按钮并排；最后一行灰字。",
  "links": [],
  "anchors": [
   {
    "id": "ai-main",
    "text": "主机"
   },
   {
    "id": "ai-secondary",
    "text": "副机"
   },
   {
    "id": "ai-fallback",
    "text": "主机备用入口"
   }
  ],
  "live": [],
  "buttons": [
   {
    "text": "复制给 AI 的说明",
    "where": "主机卡片",
    "does": "把这台电脑的“配置说明”复制到剪贴板（服务地址、连接方式、先确认客户端支持远程 MCP、认证不要把密钥贴进聊天、连上后列工具并只读核对是哪台电脑；备用入口多一段“只在主入口故障时用、结果不明先核实”）：主机",
    "api": "不调接口，只写剪贴板；文字取自现有 content-mcp-access.js 的 mcpSetupNote(主机)"
   },
   {
    "text": "只复制地址",
    "where": "主机卡片",
    "does": "把主机地址复制到剪贴板",
    "api": "不调接口，只写剪贴板"
   },
   {
    "text": "复制给 AI 的说明",
    "where": "副机卡片",
    "does": "把这台电脑的“配置说明”复制到剪贴板（服务地址、连接方式、先确认客户端支持远程 MCP、认证不要把密钥贴进聊天、连上后列工具并只读核对是哪台电脑；备用入口多一段“只在主入口故障时用、结果不明先核实”）：副机",
    "api": "不调接口，只写剪贴板；mcpSetupNote(副机)"
   },
   {
    "text": "只复制地址",
    "where": "副机卡片",
    "does": "把副机地址复制到剪贴板",
    "api": "不调接口，只写剪贴板"
   },
   {
    "text": "复制给 AI 的说明",
    "where": "主机备用入口卡片",
    "does": "把这台电脑的“配置说明”复制到剪贴板（服务地址、连接方式、先确认客户端支持远程 MCP、认证不要把密钥贴进聊天、连上后列工具并只读核对是哪台电脑；备用入口多一段“只在主入口故障时用、结果不明先核实”）：主机备用入口",
    "api": "不调接口，只写剪贴板；mcpSetupNote(mcpMainFallback)"
   },
   {
    "text": "只复制地址",
    "where": "主机备用入口卡片",
    "does": "把备用地址复制到剪贴板",
    "api": "不调接口，只写剪贴板"
   }
  ],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "width": "54%",
     "text_ref": "让 AI 用电脑"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "text_ref": "电脑 MCP 本身不带模型"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "hero",
     "width": "46%",
     "index": 0
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "主机",
     "whole_block": true,
     "row": "primary-entrances",
     "width": "50%"
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "副机",
     "whole_block": true,
     "row": "primary-entrances",
     "width": "50%"
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "主机备用入口",
     "whole_block": true,
     "row": "backup-entrance",
     "width": "80%",
     "row_align": "center"
    },
    {
     "type": "notice",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "平时 ChatGPT"
    }
   ],
   "notes": "实查：上部左标题/两行介绍，右为桌面和猫的独立插画；中部主机、副机、备用入口三张等宽卡一排。每卡头左图右标题/说明，地址浅灰等宽条完整折行，按钮两列（复制说明绿底，地址白底），正文在底部。下方满宽叶角提示条。卡内地址+［］按钮混合节点目前core.content_card只按普通para排，address_style/button_columns未消费；现button_variants已支持［］但需嵌入每卡并绑定where，不可把三卡同名按钮混为同一行为。新增地址/双按钮组合样式待样张。 本轮用 points_card 的整卡与卡头图标接口承接混合节点，让三张等宽卡内按钮可换行而不溢出；地址等宽、两种按钮样式和备用卡中插画分层仍需组件承接。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "让 AI 用电脑"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "电脑 MCP 本身不带模型"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "index": 0
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "主机",
     "whole_block": true
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "副机",
     "whole_block": true
    },
    {
     "type": "points_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "address_style": "monospace",
     "button_columns": 2,
     "text_ref": "主机备用入口",
     "whole_block": true
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "平时 ChatGPT"
    }
   ],
   "notes": "实查v及替换v2：v的标题/介绍下为机器人和电脑大插画，随后主机、副机两张整宽卡（卡头左图右字，地址与双按钮下排）；v2备用卡整宽，标题+灰说明在上、大转接插画在中、灰底地址/双按钮/正文向下，末尾灰字。替换v2地址无链接下划线，不能统一强加绿色链接；图中复制图标不加任何新字。当前content_card的top_inside会把图放在标题上方，尚不能原样支持标题/插画/地址/双按钮/正文分层，需要样张；说明同横版。 本轮用 points_card 的整卡与卡头图标接口承接混合节点，让三张等宽卡内按钮可换行而不溢出；地址等宽、两种按钮样式和备用卡中插画分层仍需组件承接。"
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
   "source_phrase": "侧透机箱",
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
   "source_phrase": "",
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
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“让 AI 用电脑”，下面两行说明。中间三张等宽等高的竖卡片一行排开：主机（小水彩图标：侧透机箱）、副机（笔记本）、主机备用入口（笔记本和机箱之间一条转接的弯箭头）。每张卡片：粗体名字、一行灰字说明；一个浅灰底圆角地址条，地址用等宽字体完整画出、不截断（可折两行）；地址条下两个按钮并排——左边绿底白字“复制给 AI 的说明”，右边白底细绿边“只复制地址”；下面两三行字。卡片下面一行灰色小字。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "mcp/mcp-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\mcp\\img\\mcp-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a4497ad744394bfd2e97",
   "title_text": "让 AI 用电脑",
   "sha256": "cb1032d882ed932afffe6e10786db93f7b39c328f134697c68a977c98ac8d677",
   "status": "ready"
  }
 ]
}
```

## 让 AI 用电脑

电脑 MCP 本身不带模型：想事情的是发起的那个 AI（ChatGPT、Claude 或 Codex），电脑只负责照它的要求读文件、跑命令、操作桌面。

**主机**　家里的台式机
https://mcp.wly0829.cn/mcp
［复制给 AI 的说明］［只复制地址］
经 Cloudflare 隧道进来。文件、命令和桌面工具；普通、管理员、SYSTEM 维护都开着。

**副机**　笔记本
https://laptop-e48n0drj.tailbe620b.ts.net/computer/mcp
［复制给 AI 的说明］［只复制地址］
经 Tailscale 公网入口进来，单独登录、单独权限，用的是副机自己的文件和工具。

**主机备用入口**　经副机转接
https://laptop-e48n0drj.tailbe620b.ts.net/main-computer/mcp
［复制给 AI 的说明］［只复制地址］
主机的公网入口坏了才临时加上，干活的仍是主机。要单独授权一次，主入口的登录不能拿来用；两台都要开机联网。不会自动切换，也不会把中断的任务重做一遍。

平时 ChatGPT 里只留主机、副机两个连接。

::screen{#mcp-04 section="chatgpt"}

```typeset
{
 "screen": {
  "id": "mcp-04",
  "section": "chatgpt",
  "title": "ChatGPT 怎么接",
  "scene": "横版：左上小节标题“ChatGPT 怎么接”，标题左边画 ChatGPT 标志。左边约 60% 宽：五步竖排的编号流程（绿色圆圈编号，步与步之间细绿竖线），第 3 步里“填什么”画成一张浅灰底的小表格（两列：项目、填什么）。右边约 38% 宽上下两张小卡片：“在手机上用”（小图标：手机）、“授权弹窗一直转圈”（小图标：转圈的弹窗），后者最后一行是链接。",
  "portrait": "竖版：小节标题；五步流程满宽往下，第 3 步的小表格改成一行一项；两张小卡片依次往下、满宽。",
  "links": [
   {
    "text": "chatgpt.com/plugins",
    "href": "https://chatgpt.com/plugins"
   },
   {
    "text": "救急先看：ChatGPT 授权转圈",
    "href": "/rescue/#e-chatgpt-auth"
   }
  ],
  "anchors": [
   {
    "id": "chatgpt-steps",
    "text": "ChatGPT 怎么接"
   }
  ],
  "live": [],
  "buttons": [],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "ChatGPT 怎么接"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "账号要能用"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "icons": "none",
     "container": "steps_card",
     "text_ref": "在电脑上打开",
     "direction": "vertical"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "none",
     "connector": "none",
     "container": "steps_card",
     "nested_under_step": 3,
     "text_ref": "项目"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "icons": "none",
     "container": "steps_card",
     "text_ref": "点连接",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "bottom_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "在手机上用"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "text_ref": "授权弹窗一直转圈"
    }
   ],
   "notes": "实查：整屏左约62%标题带ChatGPT标志，下方一整张1–5竖向流程卡，绿圆编号沿细绿直线；OAuth两列表位于第3步内。右约38%两张辅助卡上下，标题/文字在上、大插画靠卡底；右侧卡与左标题同高起排。文字按整steps节点定位：第1–3步同一个节点，表格后4–5另一个节点，不拆第2或3步text_ref。connector=line/container/nested_under_step仅记录原图，当前不能跨三个块共用流程线/大边框及真正内嵌表；bottom_inside未支持。流程内表和卡底插画属于新组合，待样张。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "ChatGPT 怎么接"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "账号要能用"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "columns_v": 1,
     "icons": "none",
     "container": "steps_card",
     "text_ref": "在电脑上打开",
     "direction": "vertical"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "container": "steps_card",
     "nested_under_step": 3,
     "text_ref": "项目"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "columns_v": 1,
     "icons": "none",
     "container": "steps_card",
     "text_ref": "点连接",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "在手机上用"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "text_ref": "授权弹窗一直转圈"
    }
   ],
   "notes": "实查v/v2/v3全部原图：v为居中品牌标题、大幅机器人与人的插画、账号说明；v3两张整宽辅助卡，插画上、标题和正文下。严重错图：mcp-04-v2.png实际是中文语音转写首页，与MCP无关且无替换，source_images保留其路径仅作错误证据，不可拿来构图或配资产。步骤1–5和OAuth表无有效竖版原图，步骤区新构图，待样张；按定稿portrait及同页竖卡推导，表逐行卡。connector=line/共享边框/第3步嵌表当前未表达。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机",
   "sha256": "2d2811a87008b221e7dec14f189f43393989e1b15a5b682824c03cbe742b7fec",
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
   "source_phrase": "转圈的弹窗",
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
    "v"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“ChatGPT 怎么接”，标题左边画 ChatGPT 标志。左边约 60% 宽：五步竖排的编号流程（绿色圆圈编号，步与步之间细绿竖线），第 3 步里“填什么”画成一张浅灰底的小表格（两列：项目、填什么）。右边约 38% 宽上下两张小卡片：“在手机上用”（小图标：手机）、“授权弹窗一直转圈”（小图标：转圈的弹窗），后者最后一行是链接。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-8a056844625e971c475d.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\mcp\\img\\mcp-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-8a056844625e971c475d",
   "title_text": "ChatGPT 怎么接",
   "sha256": "9170ef753e1f89395c54e487985bd94e653115c0b1940627b4aee349c25f726f",
   "status": "ready"
  }
 ]
}
```

## ChatGPT 怎么接

账号要能用自定义 MCP（开发者模式）。

1. 在电脑上打开 ChatGPT 网页：设置 → Security and login（安全和登录）→ 打开 Developer mode（开发者模式）。
2. 打开〔chatgpt.com/plugins〕，点加号新建一个 MCP 应用，放进项目“我的电脑”，名字叫“主机 MCP”或“副机 MCP”，地址填上一屏那条。
3. 认证选 OAuth，照下表填：
| 项目 | 填什么 |
|---|---|
| 客户端 ID | https://chatgpt.com/oauth/client.json |
| 客户端密钥 | 留空 |
| 令牌端点认证方式 | none |
| 权限范围 | desktop:control |
4. 点连接，弹出电脑自己的登录页：输入密码中心里登记的“电脑 MCP 入口密码”，不是 OpenAI 的密码。
5. 连上后先让它调用 ComputerContext，看连的是不是那台电脑，再跑一条只读命令。显示“已安装”不算连通。

**在手机上用**　手机 App 能不能直接新建连接还没核实；建不了就在电脑网页上给同一个账号加，手机上照样用。手机上用不用开 Tailscale：不用，ChatGPT 的服务器经公网连电脑，手机原来的代理照开。

**授权弹窗一直转圈**　关掉整个弹窗，从“连接”重新来一次，见〔救急先看：ChatGPT 授权转圈〕。

::screen{#mcp-05 section="claude"}

```typeset
{
 "screen": {
  "id": "mcp-05",
  "section": "claude",
  "title": "Claude 和 Codex 怎么接",
  "scene": "横版：左上小节标题“Claude 和 Codex 怎么接”，标题左边画 Claude 标志。上面约 62% 高一张大卡片“Claude”：三步编号，两条命令画在浅灰底等宽字的命令条里（完整画出，可折行不截断），卡片最后一行灰字。下面一张满宽的小卡片“Codex”，标题左边画一个小的 OpenAI 标志。",
  "portrait": "竖版：小节标题；Claude 卡片满宽，命令条自动折行；Codex 卡片在下、满宽。",
  "links": [],
  "anchors": [
   {
    "id": "claude-steps",
    "text": "Claude"
   },
   {
    "id": "codex-steps",
    "text": "Codex"
   }
  ],
  "live": [],
  "buttons": [],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "Claude 和 Codex 怎么接"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "brand": "Claude",
     "text_ref": "Claude",
     "frame": "claude_card"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "text_ref": "现在登记的是主机",
     "frame": "claude_card"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "icons": "none",
     "text_ref": "在主机终端运行",
     "direction": "vertical",
     "frame": "claude_card"
    },
    {
     "type": "monospace",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "text_ref": "claude mcp add",
     "frame": "claude_card"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "icons": "none",
     "text_ref": "在能交互的终端运行",
     "direction": "vertical",
     "frame": "claude_card"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "claude_card",
     "text_ref": "Claude 连主机",
     "frame": "claude_card"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "codex_card",
     "brand": "OpenAI",
     "text_ref": "Codex",
     "frame": "codex_card"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "codex_card",
     "text_ref": "主机的 Codex",
     "frame": "codex_card"
    }
   ],
   "notes": "实查：整宽章节标题带Claude星标；上方Claude大卡文字约60%在左、两电脑/笔记本插画在右内，三步编号上下；第1步命令灰底等宽条，2步中登录命令等宽；卡底有灰注。下方Codex满宽矮卡左字右插画、卡头OpenAI标。当前row可明确左右60/40与70/30，但container/brand尚不消费，无法把多文字块与右图统一放入同一个大边框；内部步骤/命令条也须先样张。完整Claude节点范围含group/para/steps/command-para/steps/para，未按步骤2、3拆ref。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "Claude 和 Codex 怎么接"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "Claude"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "columns_v": 1,
     "icons": "none",
     "text_ref": "在主机终端运行",
     "direction": "vertical",
     "frame": "command_step_card"
    },
    {
     "type": "monospace",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "claude mcp add",
     "frame": "command_step_card"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "columns_v": 1,
     "icons": "none",
     "text_ref": "在能交互的终端运行",
     "direction": "vertical"
    },
    {
     "type": "notice",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "Claude 连主机"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "text_ref": "Codex"
    }
   ],
   "notes": "实查v空槽示意及替换v2/v3：原v只有品牌标题、两张带插画空槽示意，无定稿步骤字，不能据此隐藏文字；有效文字布局从v2续：Claude介绍卡左字右笔记本；第1步独立卡内完整灰底命令；第2/3步各卡；未登记接法另张浅绿注卡。v3为Codex整宽长段卡，标题上、正文下，右上左下叶饰，不放大型插画。采用v→v2→v3为来源观察顺序，定稿内容只分配一次。现content_card右图、命令与步骤共享外框、组内第2/3步分别卡及叶饰不足；right_inside/container是未支持构图记录，须样张。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。 本轮使用已注册 flow 的纵向流程承接编号文字，保持原单列顺序和原 connector；避免 core 步骤正文 23px 与同页正文 24px 不一致。"
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
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "Claude橙色星形标志",
   "sha256": "0e6f72d3f1cee7a82969c2dace6f680c240133ea4f5698eef851d87db5349619",
   "status": "ready",
   "via": "brand"
  },
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
   "source_phrase": "在主机终端运行：",
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
   "asset": "_library/icons/OpenAI标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "OpenAI标志",
   "source_phrase": "OpenAI花结标志",
   "sha256": "d5e37ca41dfb31132d6efa380695341971364f891ab4002f15821513909e5c0c",
   "status": "ready",
   "via": "brand"
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
   "source_phrase": "在能交互的终端运行 claude mcp login secondary_laptop，在弹出的浏览器里登录；后台程序做不了这一步。",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“Claude 和 Codex 怎么接”，标题左边画 Claude 标志。上面约 62% 高一张大卡片“Claude”：三步编号，两条命令画在浅灰底等宽字的命令条里（完整画出，可折行不截断），卡片最后一行灰字。下面一张满宽的小卡片“Codex”，标题左边画一个小的 OpenAI 标志。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“Claude 和 Codex 怎么接”，标题左边画 Claude 标志。上面约 62% 高一张大卡片“Claude”：三步编号，两条命令画在浅灰底等宽字的命令条里（完整画出，可折行不截断），卡片最后一行灰字。下面一张满宽的小卡片“Codex”，标题左边画一个小的 OpenAI 标志。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-4800f2ba15e1093254d7.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\mcp\\img\\mcp-05-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-4800f2ba15e1093254d7",
   "title_text": "Claude 和 Codex 怎么接",
   "sha256": "d32867ec0b8efe2e541572565497280da4a73aca21e8b5ccfafeaee39eb61a7e",
   "status": "ready"
  }
 ]
}
```

## Claude 和 Codex 怎么接

**Claude**
现在登记的是主机上的 Claude Code 连副机，连接名 secondary_laptop：
1. 在主机终端运行：
claude mcp add -s user --transport http --client-id claude-main-desktop --callback-port 33418 secondary_laptop https://laptop-e48n0drj.tailbe620b.ts.net/computer/mcp
2. 在能交互的终端运行 claude mcp login secondary_laptop，在弹出的浏览器里登录；后台程序做不了这一步。
3. 回调地址只能是 http://localhost:33418/callback，换成 127.0.0.1 或别的端口都会被拒。
Claude 连主机、Claude 的手机 App 和网页版连这两台电脑：目前没有登记过的接法。

**Codex**
主机的 Codex 用 secondary_laptop 连副机；副机的 Codex 用 main_desktop 经备用入口连主机。Codex 的回调是 http://127.0.0.1/callback，只允许端口变，和 Claude 的不能混用。

::screen{#mcp-06 section="verified"}

```typeset
{
 "screen": {
  "id": "mcp-06",
  "section": "verified",
  "title": "最近一次真实验证",
  "scene": "横版：左上小节标题“最近一次真实验证”。左边约 62% 宽一张水彩风表格（圆角外框、细浅绿格线、表头浅绿底），三列：哪条路、哪天（北京时间）、验证了什么；“未核实”两格画浅灰小圆点加字，其余画绿色小圆点。表格下一行灰字。右边约 36% 宽一张卡片“用之前知道”，四条，每条前一个小水彩图标（鼠标、关机的电脑、两把不同的钥匙、救生圈），最后一条末尾链接画成绿色。",
  "portrait": "竖版：小节标题；表格改成一行一张小卡片（粗体路名，下面日期和验证了什么）；表格下的灰字；“用之前知道”卡片满宽在最后。",
  "links": [
   {
    "text": "救急先看：远程连不上",
    "href": "/rescue/#e-remote"
   }
  ],
  "anchors": [
   {
    "id": "before-use",
    "text": "用之前知道"
   }
  ],
  "live": [],
  "buttons": [],
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
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "最近一次真实验证"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "哪条路",
     "motion_text": [
      {
       "kind": "number",
       "text": "9 月 11 日 16:54、17:15–17:16"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 11:28"
      },
      {
       "kind": "number",
       "text": "10 月 1 日 18:29"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 17:38、17:45"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 16:28–16:29"
      }
     ]
    },
    {
     "type": "notice",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "这些是带日期的记录"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "用之前知道"
    },
    {
     "type": "bullet_list",
     "align": "left",
     "size": "medium",
     "columns": 4,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "item_layout": "individual_cards",
     "text_ref": "AI 用鼠标、键盘时",
     "item_images": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/笔记本电脑.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ],
     "item_cards": true
    }
   ],
   "notes": "按pages-approved替换横图实查：顶部左标题右笔记本/记事本独立插画；中部表格满宽三列七数据行，浅绿表头与细格线；表后整宽提示条；用之前知道在下方左，四提醒短卡横排，各卡左叶饰右文字。与page.scene的左62%表+右36%提醒不同，以实际图为准。四bullet为同一整节点，只用首项开头定位，columns=4是要求四独立卡；当前bullet_list仅列清单，不加每项卡框/插画，item_layout未消费，需要新样张。不凭scene给表加原图没有的状态圆点。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "最近一次真实验证"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "哪条路",
     "motion_text": [
      {
       "kind": "number",
       "text": "9 月 11 日 16:54、17:15–17:16"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 11:28"
      },
      {
       "kind": "number",
       "text": "10 月 1 日 18:29"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 17:38、17:45"
      },
      {
       "kind": "number",
       "text": "9 月 11 日 16:28–16:29"
      }
     ]
    },
    {
     "type": "notice",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "这些是带日期的记录"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "用之前知道"
    },
    {
     "type": "bullet_list",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "item_layout": "individual_cards",
     "text_ref": "AI 用鼠标、键盘时",
     "item_images": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/笔记本电脑.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ],
     "item_cards": true
    }
   ],
   "notes": "缺图：img无mcp-06-v及续图，pages-approved亦无竖版替换，source_image=null。新构图，待样张：依定稿portrait与同页竖卡，居中标题、表格七行逐行整宽卡、提示条、用之前知道四条顺排；不新增标题图外的装饰大插画。表格原表头完整出现一次，重复行标签用data-echo。表转竖卡、四提醒独立卡均需样张，未出图不报质量关通过。"
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
   "source_phrase": "鼠标",
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "关机的电脑",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "两把不同的钥匙",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
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
   "source_phrase": "救生圈",
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
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显示器",
   "source_phrase": "AI 用鼠标、键盘时，占的是我正在用的桌面。",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显示器",
   "source_phrase": "AI 用鼠标、键盘时，占的是我正在用的桌面。",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "笔记本电脑",
   "source_phrase": "电脑要开着、联网；没人登录时，桌面类工具用不了。电脑 MCP 救不了没启动的 Windows。",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "连上电脑，不等于开了个人资料或无限制授权；Windows 管理员、SYSTEM 也不是我的最高授权。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双屏同步",
   "source_phrase": "连不上先看〔救急先看：远程连不上〕。",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "显示器",
   "source_phrase": "AI 用鼠标、键盘时，占的是我正在用的桌面。",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "笔记本电脑",
   "source_phrase": "电脑要开着、联网；没人登录时，桌面类工具用不了。电脑 MCP 救不了没启动的 Windows。",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "连上电脑，不等于开了个人资料或无限制授权；Windows 管理员、SYSTEM 也不是我的最高授权。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双屏同步",
   "source_phrase": "连不上先看〔救急先看：远程连不上〕。",
   "sha256": "0caa7ff3f8dccbf8dce76ca29ccf3ae9a459292696a3bdbedf85f69ecfdfc3e3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/桌面设备.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "桌面设备",
   "source_phrase": "横版：左上小节标题“最近一次真实验证”。左边约 62% 宽一张水彩风表格（圆角外框、细浅绿格线、表头浅绿底），三列：哪条路、哪天（北京时间）、验证了什么；“未核实”两格画浅灰小圆点加字，其余画绿色小圆点。表格下一行灰字。右边约 36% 宽一张卡片“用之前知道”，四条，每条前一个小水彩图标（鼠标、关机的电脑、两把不同的钥匙、救生圈），最后一条末尾链接画成绿色。",
   "sha256": "c3692d722e9e153a291563e37fa145fd627aa167c6c69814da7411b53a0fb9ff",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-6f22f0e7ff679b1c33d0.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6f22f0e7ff679b1c33d0",
   "title_text": "最近一次真实验证",
   "sha256": "724e04348dd23cc86f975a23a0ee1b1da513597e5dc78ab137e41d855e83a349",
   "status": "ready"
  }
 ]
}
```

## 最近一次真实验证

| 哪条路 | 哪天（北京时间） | 验证了什么 |
|---|---|---|
| ChatGPT → 主机 | 9 月 11 日 16:54、17:15–17:16 | 普通命令回读主机；管理员和 SYSTEM 维护都返回对的 Windows 身份；登录过期自动续上 |
| ChatGPT → 副机 | 9 月 11 日 11:28 | 普通命令 8 次全成功；SYSTEM 维护成功 |
| Claude Code（主机）→ 副机 | 10 月 1 日 18:29 | 只读调用 ComputerContext，返回副机的电脑名和规则 |
| 副机的 Codex → 主机备用入口 | 9 月 11 日 17:38、17:45 | 登录完成；新开的任务普通命令和 SYSTEM 维护都成功 |
| 主机备用入口 | 9 月 11 日 16:28–16:29 | 故意停掉主机的公网隧道，经副机转接，普通命令 3 次全成功 |
| Moonlight 串流 | 未核实 | 没有带日期的完整连接记录 |
| 登录前用 ToDesk | 未核实 | 只验过看门狗在跑，没从别的设备真连过 |

这些是带日期的记录，不说明电脑此刻在线；此刻看页首“现在”。

**用之前知道**
- AI 用鼠标、键盘时，占的是我正在用的桌面。
- 电脑要开着、联网；没人登录时，桌面类工具用不了。电脑 MCP 救不了没启动的 Windows。
- 连上电脑，不等于开了个人资料或无限制授权；Windows 管理员、SYSTEM 也不是我的最高授权。
- 连不上先看〔救急先看：远程连不上〕。
