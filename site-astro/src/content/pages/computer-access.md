---
{
 "title": "授权与状态",
 "kind": "computer-access",
 "url": "/computer-access/",
 "tagline": "个人资料、全局无限制授权、Windows 锁屏：看状态，也在这办。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "apply",
   "label": "办理"
  },
  {
   "id": "results",
   "label": "办完怎么看结果"
  },
  {
   "id": "how",
   "label": "连不上时，和这一页怎么工作"
  }
 ],
 "page": {
  "schema": "site-b2.page.v1",
  "page": "computer-access",
  "kind": "computer-access",
  "title": "授权与状态",
  "url": "/computer-access/",
  "tagline": "个人资料、全局无限制授权、Windows 锁屏：看状态，也在这办。",
  "status": "",
  "public": true,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "6f3cb90f79d8dd7632eb3adf0e1cd5028471bf92",
   "commit_time": "2026-09-25T03:52:41+08:00",
   "file": "旧站源码 V:\\Personal\\Projects\\wly0829.cn（app\\computer-access.jsx、computer-access-model.js、computer-access-bootstrap.js）；后端 PCConfig 91b73e4 tools\\remote-computer-mcp\\public_access.py；事实单 b1\\pipe\\p2\\facts-ops.md 第 3 节、b1\\pipe\\cockpit-data.md 第 2 节；status 只读读数 10 月 1 日 18:10–18:14"
  },
  "video_prompt": "以这张图为第一帧，镜头和构图完全不动，只让右上角那幅插画轻轻动：绿色小挂锁的锁梁慢慢抬起一点、再稳稳扣回去，钥匙环随之轻轻晃；通行证上的绿色印章轻轻抬起、再落下，像盖了一次章；小窗的窗帘被微风吹得轻轻摆动；手机屏幕上的小盾牌亮起一圈柔和的绿光再淡下去；旁边的绿叶轻轻摇，一片小叶子缓缓飘落。画面里不出现任何文字和数字，不添加新东西，卡片、按钮、空框所在的白色纸面保持干净不动。约 6 秒，首尾衔接成无缝循环，水彩画风不变，没有声音。 ｜ Prompt: Use this image as the first frame. Keep the camera and composition completely still and gently animate only the small illustration at the upper right: the shackle of the small green padlock lifts slightly and clicks back down, the key ring swaying a little with it; the green stamp on the pass lifts gently and presses down once, as if stamping; the curtain of the small window sways softly in a light breeze; the little shield on the phone screen glows with a soft green ring and fades again; the nearby green leaves sway and one small leaf drifts down. No text or numbers anywhere, add nothing new, keep the white paper with the cards, buttons and empty boxes clean and still. About 6 seconds, the last frame matches the first for a seamless loop, same watercolor style, no audio.",
  "registry": {
   "live": [
    {
     "slot": "ca-connection",
     "screen": "computer-access-01",
     "meaning": "连接状态：一盏小灯加一行字，灯和字一起换。绿“主机在线 · 读取完成 HH:MM:SS”；黄“正在连接主机 · 正在读取…”；红“连接服务异常 · 上次读取 HH:MM”（电脑回了 5xx）；灰“暂时无法连接电脑 · 上次读取 HH:MM”（其他失败）；从没读到过写“尚未读取”。",
     "source": "前端对 GET /computer-access/api/status 的读取结果（接口没有单独的 online 字段）；读取时间取 observed_at_unix 或本次读完的时刻。前台每 60 秒、回前台立即读，后台停读；10 秒超时。"
    },
    {
     "slot": "ca-personal-data",
     "screen": "computer-access-01",
     "meaning": "个人资料状态：小灯加字。绿“开着，到 HH:MM（还剩 X 小时 Y 分）”；灰“锁着”；黄“正在准备”“正在关闭资料”“已到期，等电脑确认”；红“出错”；空心灰圈“当前状态未知”，下面一行小字“上次读到：…”。倒计时每 15 秒在本页更新一次，不另读电脑。",
     "source": "personal_data.state、expires_at_unix；按钮能不能点看 public_actions.lock_data 和 state_version。状态值和中文对应以现有 computer-access-model.js 的 grantLabel 为准（facts-ops 3.1）。"
    },
    {
     "slot": "ca-unrestricted",
     "screen": "computer-access-01",
     "meaning": "无限制授权状态：同上一格的灯和字规则；灰写“关着”。",
     "source": "unrestricted.state、expires_at_unix；public_actions.end_unrestricted。"
    },
    {
     "slot": "ca-windows",
     "screen": "computer-access-01",
     "meaning": "Windows：第一行小灯加字——灰锁“已锁屏”、绿“没锁屏”、灰“没人登录”、空心灰圈“读不到”；第二行“已开机 N 小时 N 分 · 本次开机 MM 月 DD 日 HH:MM”；第三行 Windows 版本。",
     "source": "host.screen_state（locked／unlocked／no_session／unknown，WTS 当前活动控制台会话）、host.uptime_seconds、host.boot_time_unix、host.windows_version；锁屏按钮能不能点看 public_actions.lock_windows。"
    },
    {
     "slot": "ca-form",
     "screen": "computer-access-02",
     "meaning": "三个真实的网页控件放在图上画好的空框里：时长输入框（可填小数，0.5–72）、6 位验证码输入框（只收数字、保留开头的 0）、预览行“本次：个人资料 + 无限制授权 · 2 小时”，以及冷却时的“验证暂不可用（冷却中）。请在 N 分钟后重试（HH:MM）。已有授权保持”。时长框打开页面时填电脑给的默认时长（default_minutes ÷ 60，10 月 1 日读到的是 24 小时），不写死。",
     "source": "default_minutes、factor.available、factor.cooldown_until_unix；本页表单状态。"
    },
    {
     "slot": "ca-toast",
     "screen": "computer-access-03",
     "meaning": "右下角提示条：每句一张预画好的提示条图（颜色＋图标＋原话），10 秒后收起，右上角小叉可关。要预画的句子：绿“办理成功。”“办理成功；默认时长未保存。”“已确认这次办理当时成功，当前授权以最新状态为准。”“个人资料已锁定。”“无限制授权已结束。”“Windows锁屏已完成。”“本次读取已完成。”；黄“资料访问已结束，正在关闭资料。”“本次结果尚未确认”“本次部分完成，仍需确认结果”；红“动态验证码不正确。本次未完成，已有授权保持原期限。”“授权、开机或配置状态已变化。请查看最新状态，再决定是否重新办理。”；灰“本次读取未完成，保留上次观测；当前状态未知。”。新出现的文案（错误码映射以外的）用网页文字兜底。",
     "source": "现有 computer-access.jsx:171–179、216–221、327–345 与 computer-access-model.js:63–70、298–329 的文案（facts-ops 3.3）。"
    },
    {
     "slot": "ca-results",
     "screen": "computer-access-03",
     "meaning": "操作结果面板：点［操作结果］后在右侧滑出，列出本次办理（绑定了什么、时长、各项结果）和每个锁定、结束、锁屏的结果，每行带［查询结果］和［在主机查询此请求］。没有记录时写“当前没有待查询的操作。”",
     "source": "本页保留的请求编号（sessionStorage）和 GET /requests/{uuid} 的返回。"
    }
   ],
   "numbers": [
    {
     "id": "n-default-hours",
     "text": "24 小时（不画进图，由 ca-form 读）",
     "meaning": "电脑当前的默认授权时长",
     "as_of": "2026-10-01",
     "source": "status 只读读数 default_minutes=1440（facts-ops 检查 V4）",
     "screens": [
      "computer-access-02"
     ]
    }
   ],
   "mentions": [
    {
     "target": "/cockpit/#pc",
     "screen": "computer-access-01",
     "text": "电脑状态看驾驶舱"
    },
    {
     "target": "/mcp/",
     "screen": "computer-access-01",
     "text": "连接电脑"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "computer-access-01",
     "text": "约法 L18"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "computer-access-01",
     "text": "L16"
    },
    {
     "target": "/rescue/#e-remote",
     "screen": "computer-access-04",
     "text": "救急先看：远程连不上"
    }
   ]
  },
  "notes": {
   "merged": [
    "旧页离线时弹出的“电脑连接说明”面板（重新检查连接、ToDesk/UU 建议）并进第 4 屏“连不上电脑时”；面板里的“小米智能插座3路径”没写，见 dropped。",
    "旧页 Windows 系统行里的 Windows 版本、锁屏状态、开机时间、已运行时长，放进第 1 屏 Windows 卡片的 ca-windows；DPC 占用属于性能，随性能去驾驶舱。",
    "两个“关闭”类按钮（关闭提示、关闭操作结果）是提示条和面板自带的小叉，写在 ca-toast、ca-results 的说明里，不单列按钮。"
   ],
   "dropped": [
    "电脑性能整块（处理器、显卡、内存、存储、网络、显示器、DPC，以及“系统详情”“来源”“读数来源与时间”“展开卷”这些按钮）：本人 10 月 1 日同意挪到驾驶舱（驾驶舱第 2 屏 cockpit-pc 已接同一组 hardware 字段），本页只留〔电脑状态看驾驶舱〕跳转。",
    "Grafana 在线链接和它的“重新检查”：随性能归驾驶舱（驾驶舱第 4 屏嵌只读公开面板）。",
    "小米智能插座3远程断电：旧页文案提到，但没有可照做的步骤和验收记录（事实单 U01），不写。",
    "后端有 POST /requests/{uuid}/cancel，但旧页没有“取消办理”按钮；照旧，不新增。"
   ],
   "unsure": [
    "性能挪走后，旧页“本次读取已完成。各项采样时间见读数来源；未变化的数值不表示读取失败。”这句提示的后半句指的是性能读数，本页已经没有“读数来源”。我在 ca-toast 里只列前半句“本次读取已完成。”；要不要顺手改前端那句文案，请 Claude 定（改文案不算改授权流程）。",
    "按钮画在图里：第 1 批格式没有按钮字段，我在每屏加了 buttons（图上字、位置、做什么、接哪个接口、要预画哪些变体）。文字里用［］标按钮、〔〕标链接。解锁/延长、开启/延长、提交按钮这类会换字的，需要预画变体图，或者由网页程序在按钮位置用网页文字——请 Claude 按拼页程序的能力定。",
    "两个输入框（时长、6 位验证码）必须是真的网页输入框，不能是图；我把它们写成 ca-form 实时框，图上只画空框。",
    "灯的颜色是我定的（AI 建议）：绿＝开着／没锁屏／在线，灰＝锁着、关着、已锁屏、没人登录，黄＝正在变或结果不确定，红＝出错或连接服务异常，空心灰圈＝读不到。锁着用灰不用红，是因为锁着是正常状态、不是故障；和驾驶舱的总灯（灰＝电脑不在线）意思一致。",
    "个人资料各状态的中文（正在准备、已到期等电脑确认等）是按事实单 3.1 的描述写的，准确的状态值和中文以 computer-access-model.js 的 grantLabel 为准，拼页时对一遍。",
    "第 2 屏写“验证码直接交给这台电脑核对，不经过网站的服务器”：依据是 computer-access-model.js:133–134、333–342（网站上直接请求 mcp.wly0829.cn），网页本身放在 GitHub Pages 上。",
    "替本人口吻写的句子：第 1 屏介绍两句和三张卡片的说明。",
    "【10 月 1 日内容主次改稿，北京时间 10-02 00:29】照 factcheck2.md 第 3 节：卡片名和第 2 步选项改成“全局无限制授权”，第 1 屏补“这页开的是这台电脑的全局授权……不是只给当前对话”，“三样各自计时”改成“前两项各自计时”，延长规则照最小改法。按钮变体字（“验证并开启无限制授权”等）和提示条原话（“无限制授权已结束。”）没改：它们照现有网页程序的原文，现部署网页里这几句也不带“全局”；要不要统一加，交主对话定。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/computer-access/page.json",
  "sha256": "3c63959f7f639ae841d9b53e01ffe325bba4617a92be23420665aff2d4b08227",
  "converted_at_beijing": "2026-10-10T05:26:52+08:00"
 }
}
---

::screen{#computer-access-01 section="top"}

```typeset
{
 "screen": {
  "id": "computer-access-01",
  "section": "top",
  "title": "开头：三样东西现在的状态",
  "scene": "横版：左上毛笔艺术字大标题“授权与状态”，下面一行介绍。标题右侧同一行：一个连接状态空框（约屏宽 30%、高约屏高 6%，框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填），紧挨着一个“刷新状态”次按钮；最右边两个白底细绿边圆角按钮样式的链接〔电脑状态看驾驶舱〕〔连接电脑〕。右上角一小幅水彩插画（开头短视频从这里取景）：一把绿色小挂锁挂在一只钥匙环上，旁边一张盖了绿色印章的通行证，后面一扇半拉着窗帘的小窗（代表 Windows），前面一部手机，屏幕上只画一枚小盾牌（不画数字）；插画里不画字。中间三张等宽等高的竖卡片一行排开：个人资料（小图标：挂锁）、全局无限制授权（小图标：盖章通行证）、Windows（小图标：带锁的窗）。每张卡片：粗体名字，两三行灰色说明（〔约法 L18〕〔L16〕画成绿色链接）；说明下面一个状态空框（约卡片宽 90%、高约屏高 9%，框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填，网页程序在框左边贴一盏小灯、右边写字）；最下面按钮。三张卡片下面一行灰色小字图例：五个小水彩灯（绿、灰、黄、红、空心灰圈）各跟一段字。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
  "portrait": "竖版：标题；介绍；连接状态空框满宽，下面“刷新状态”按钮和两个链接按钮排一行；插画缩成一行高；三张卡片上下排、满宽（状态空框满宽、高约两行字，按钮并排在框下）；图例排成两行。",
  "links": [
   {
    "text": "电脑状态看驾驶舱",
    "href": "/cockpit/#pc"
   },
   {
    "text": "连接电脑",
    "href": "/mcp/"
   },
   {
    "text": "约法 L18",
    "href": "/rules/charter/#L18"
   },
   {
    "text": "L16",
    "href": "/rules/charter/#L16"
   }
  ],
  "anchors": [
   {
    "id": "personal-data",
    "text": "个人资料"
   },
   {
    "id": "unrestricted",
    "text": "全局无限制授权"
   },
   {
    "id": "windows",
    "text": "Windows"
   }
  ],
  "live": [
   "ca-connection",
   "ca-personal-data",
   "ca-unrestricted",
   "ca-windows"
  ],
  "buttons": [
   {
    "text": "刷新状态",
    "where": "标题右侧",
    "does": "重新读一次电脑状态；不延长任何授权",
    "api": "GET https://mcp.wly0829.cn/computer-access/api/status?refresh=1",
    "variants": [
     "刷新状态",
     "刷新中…",
     "重新检查",
     "不能点（正在办理或正在连接时）"
    ]
   },
   {
    "text": "解锁",
    "where": "个人资料卡片",
    "does": "选中“个人资料”、打开并聚焦下面的办理表单；本身不建立授权",
    "api": "不调接口（本页表单状态）",
    "variants": [
     "解锁",
     "延长（资料开着时）",
     "不能点（办理进行中、验证器不可用时）"
    ]
   },
   {
    "text": "锁定",
    "where": "个人资料卡片",
    "does": "结束个人资料开放期；不动无限制授权",
    "api": "POST https://mcp.wly0829.cn/computer-access/api/locks/personal-data（body：request_id、state_version）",
    "variants": [
     "锁定",
     "不能点（本来就锁着时）"
    ]
   },
   {
    "text": "开启",
    "where": "无限制授权卡片",
    "does": "选中“无限制授权”、打开并聚焦办理表单；本身不建立授权",
    "api": "不调接口（本页表单状态）",
    "variants": [
     "开启",
     "延长（开着时）",
     "不能点"
    ]
   },
   {
    "text": "结束",
    "where": "无限制授权卡片",
    "does": "结束无限制授权；不动个人资料，也不锁 Windows",
    "api": "POST https://mcp.wly0829.cn/computer-access/api/locks/unrestricted（body：request_id、state_version）",
    "variants": [
     "结束",
     "不能点（本来就关着时）"
    ]
   },
   {
    "text": "锁定 Windows",
    "where": "Windows 卡片",
    "does": "锁住电脑当前的桌面；个人资料和无限制授权照原期限",
    "api": "POST https://mcp.wly0829.cn/computer-access/api/locks/windows（body：request_id、state_version）",
    "variants": [
     "锁定 Windows",
     "不能点（电脑不允许时）"
    ]
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
     "text_ref": "授权与状态",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "header",
     "width": "36fr"
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "header",
     "width": "22fr",
     "layout": "connection",
     "key": "ca-connection",
     "empty": true,
     "items_layout": {
      "height": "6% screen"
     }
    },
    {
     "type": "button_variants",
     "text_ref": "［刷新状态］",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "header",
     "width": "42fr",
     "variant": "normal",
     "states": {
      "刷新状态": {
       "role": "secondary",
       "state": "normal"
      }
     },
     "items_layout": {
      "direction": "horizontal",
      "order": [
       "刷新状态",
       "电脑状态看驾驶舱",
       "连接电脑"
      ],
      "links_as_buttons": true,
      "keep_same_row": true
     }
    },
    {
     "type": "prose",
     "text_ref": "这里分别看个人资料",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "width": "52fr"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "small",
     "columns": 1,
     "connector": "none",
     "row": "hero",
     "width": "48fr"
    },
    {
     "type": "live_box",
     "text_ref": "个人资料",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "layout": "cards",
     "keys": [
      "ca-personal-data",
      "ca-unrestricted",
      "ca-windows"
     ],
     "icons": [
      "computer-access-01-icon-02.png",
      "_library/icons/盖章通行证.png",
      "computer-access-01-icon-03.png"
     ],
     "items_layout": {
      "equal_width": true,
      "equal_height": true,
      "card_order": [
       "个人资料",
       "全局无限制授权",
       "Windows"
      ],
      "icon_position": "left_inside",
      "icon_subjects": [
       "挂锁",
       "盖章通行证",
       "带锁的窗"
      ],
      "body_then_state_then_buttons": true,
      "state_empty": true,
      "state_width": "90%",
      "state_height": "220px",
      "button_rows": [
       [
        "解锁",
        "锁定"
       ],
       [
        "开启",
        "结束"
       ],
       [
        "锁定 Windows"
       ]
      ],
      "normal_roles": {
       "解锁": "primary",
       "锁定": "danger",
       "开启": "primary",
       "结束": "danger",
       "锁定 Windows": "danger"
      },
      "state_alignment": "bottom",
      "button_alignment": "bottom",
      "icon_positions": [
       "left_inside",
       "left_inside",
       "left_inside"
      ],
      "icon_size": "96px"
     }
    },
    {
     "type": "status_legend",
     "text_ref": "绿：开着",
     "align": "left",
     "size": "medium",
     "columns": 5,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "items_layout": {
      "direction": "horizontal",
      "columns": 5,
      "lamp_order": [
       "green",
       "gray",
       "yellow",
       "red",
       "hollow_gray"
      ],
      "text_from_node": true,
      "do_not_duplicate_text": true,
      "legend_panel": true
     }
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。横图逐张实看：页首标题左、连接框及三按钮在顶行；介绍左、插画右且在卡外；三张卡一排，图标在卡内左侧。正文以定稿为准。header 宽度为 AI 技术换算，需样张复核；动态三卡不是普通 content_card。 有意视觉重排：横图页首按钮早于介绍段，定稿正文顺序相反；按原图在顶行显示按钮，文字只输出一次；引擎可能记录非顺序提醒。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n页修复10：三卡图标统一卡内左上96px；明确原槽2→个人资料、原槽3→Windows，通行证缺槽保留未完成；插画位置改用已实现align/size，图例h五格、v每项一行。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "授权与状态",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "这里分别看个人资料",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "layout": "connection",
     "key": "ca-connection",
     "empty": true,
     "columns_v": 1
    },
    {
     "type": "button_variants",
     "text_ref": "［刷新状态］",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "variant": "normal",
     "states": {
      "刷新状态": {
       "role": "secondary",
       "state": "normal"
      }
     },
     "items_layout": {
      "direction": "horizontal",
      "order": [
       "刷新状态",
       "电脑状态看驾驶舱",
       "连接电脑"
      ],
      "links_as_buttons": true,
      "keep_same_row": true
     },
     "columns_v": 1
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "banner",
     "columns": 1,
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "live_box",
     "text_ref": "个人资料",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "layout": "cards",
     "keys": [
      "ca-personal-data",
      "ca-unrestricted",
      "ca-windows"
     ],
     "icons": [
      "computer-access-01-icon-02.png",
      "_library/icons/盖章通行证.png",
      "computer-access-01-icon-03.png"
     ],
     "items_layout": {
      "equal_width": true,
      "equal_height": true,
      "card_order": [
       "个人资料",
       "全局无限制授权",
       "Windows"
      ],
      "icon_position": "left_inside",
      "icon_subjects": [
       "挂锁",
       "盖章通行证",
       "带锁的窗"
      ],
      "body_then_state_then_buttons": true,
      "state_empty": true,
      "state_width": "100%",
      "state_height": "420px",
      "button_rows": [
       [
        "解锁",
        "锁定"
       ],
       [
        "开启",
        "结束"
       ],
       [
        "锁定 Windows"
       ]
      ],
      "normal_roles": {
       "解锁": "primary",
       "锁定": "danger",
       "开启": "primary",
       "结束": "danger",
       "锁定 Windows": "danger"
      },
      "state_alignment": "bottom",
      "button_alignment": "bottom",
      "source_parts": [
       {
        "part": 1,
        "groups": [
         "个人资料",
         "全局无限制授权"
        ]
       },
       {
        "part": 2,
        "groups": [
         "Windows"
        ]
       }
      ],
      "buttons_parallel_below": true,
      "icon_positions": [
       "left_inside",
       "left_inside",
       "left_inside"
      ],
      "icon_size": "96px"
     },
     "columns_v": 1
    },
    {
     "type": "status_legend",
     "text_ref": "绿：开着",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "items_layout": {
      "direction": "horizontal",
      "columns": 1,
      "lamp_order": [
       "green",
       "gray",
       "yellow",
       "red",
       "hollow_gray"
      ],
      "text_from_node": true,
      "do_not_duplicate_text": true,
      "legend_panel": true,
      "rows": [
       1,
       1,
       1,
       1,
       1
      ]
     },
     "columns_v": 1
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。竖图 v→v2 实看；标题居中；插画带在三卡外；v 内先个人资料和全局无限制授权，v2 为 Windows（卡内顶部插画）与两行图例。旧图按钮带括号、重复锁图和 Windows 卡下沿截切不沿用。分张是原顺序参考，输出应按完整卡安全分张，不把截切复刻为要求。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n页修复10：三卡图标统一卡内左上96px；明确原槽2→个人资料、原槽3→Windows，通行证缺槽保留未完成；插画位置改用已实现align/size，图例h五格、v每项一行。"
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "挂锁",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盖章通行证.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "盖章通行证",
   "source_phrase": "横版：左上毛笔艺术字大标题“授权与状态”，下面一行介绍。标题右侧同一行：一个连接状态空框（约屏宽 30%、高约屏高 6%，框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填），紧挨着一个“刷新状态”次按钮；最右边两个白底细绿边圆角按钮样式的链接〔电脑状态看驾驶舱〕〔连接电脑〕。右上角一小幅水彩插画（开头短视频从这里取景）：一把绿色小挂锁挂在一只钥匙环上，旁边一张盖了绿色印章的通行证，后面一扇半拉着窗帘的小窗（代表 Windows），前面一部手机，屏幕上只画一枚小盾牌（不画数字）；插画里不画字。中间三张等宽等高的竖卡片一行排开：个人资料（小图标：挂锁）、全局无限制授权（小图标：盖章通行证）、Windows（小图标：带锁的窗）。每张卡片：粗体名字，两三行灰色说明（〔约法 L18〕〔L16〕画成绿色链接）；说明下面一个状态空框（约卡片宽 90%、高约屏高 9%，框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填，网页程序在框左边贴一盏小灯、右边写字）；最下面按钮。三张卡片下面一行灰色小字图例：五个小水彩灯（绿、灰、黄、红、空心灰圈）各跟一段字。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
   "sha256": "f683590f81d5e4b9bfc59b83100f926967860f4e6133013058fa3762cca3eed7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "带锁的窗",
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
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "资料通行",
   "source_phrase": "右上角一小幅水彩插画（开头短视频从这里取景）：一把绿色小挂锁挂在一只钥匙环上，旁边一张盖了绿色印章的通行证，后面一扇半拉着窗帘的小窗（代表 Windows），前面一部手机，屏幕上只画一枚小盾牌（不画数字）；插画里不画字。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "开头短视频从这里取景）：一把绿色小挂锁挂在一只钥匙环上，旁边一张盖了绿色印章的通行证，后面一扇半拉着窗帘的小窗（代表 Windows），前面一部手机，屏幕上只画一枚小盾牌（不画数字）；插画里不画字"
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
   "asset": "computer-access/computer-access-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\computer-access\\img\\computer-access-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0571025156a92e626b49",
   "title_text": "授权与状态",
   "sha256": "d485690bf70348c4e8c25020abe4928e78e28f96e8e7814366d3b0a88505d2f8",
   "status": "ready",
   "source_box": [
    7,
    22,
    627,
    220
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 授权与状态

这里分别看个人资料、全局无限制授权和 Windows 锁屏状态，开、关、延长都在这里办。前两项各自计时，互不牵连。

［刷新状态］　〔电脑状态看驾驶舱〕　〔连接电脑〕

**个人资料**
锁着时，AI 不用我的私人资料回答；验证一次，开一段时间（〔约法 L18〕）。这台电脑本机和已认证的电脑连接共用这一份。
［解锁］［锁定］

**全局无限制授权**
开着时，在我定的范围和时间里，我的明确指令优先于 AI 自己的规则（〔L16〕）。和个人资料分开计时。这页开的是这台电脑的全局授权，本机和已接入它的 AI 对话都适用；不是只给当前对话。
［开启］［结束］

**Windows**
现在锁屏没有、开机多久。锁屏只锁桌面，不动上面两项的期限，也不是退出登录或关机。
［锁定 Windows］

绿：开着　灰：锁着、关着　黄：正在变　红：出错　空心灰圈：读不到

::screen{#computer-access-02 section="apply"}

```typeset
{
 "screen": {
  "id": "computer-access-02",
  "section": "apply",
  "title": "办理：验证一次，开一段时间",
  "scene": "横版：左上小节标题“办理：验证一次，开一段时间”。左边约 58% 宽：四步竖排编号流程（绿色圆圈编号，细绿竖线连起来），每步的按钮画在这一步的字后面同一行。第 3 步下面一个时长输入空框（约屏宽 14%、高约屏高 6%），第 4 步下面一个验证码输入空框（约屏宽 20%、高约屏高 7%），旁边一个主按钮“验证并解锁资料”；框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填（这两个框是真的输入框）。第 4 步下面再一个横长空框（约屏宽 52%、高约屏高 6%）放“本次：个人资料 · 2 小时”这类预览和冷却提示。右边约 40% 宽一张浅绿底卡片“三件要知道的事”，三条，每条前一个小水彩图标（一条直达电脑的箭头、一部手机和回旋箭头、一个沙漏）。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
  "portrait": "竖版：小节标题；四步流程满宽往下，每步的按钮折到字下面一行；两个输入框和预览框满宽；“三件要知道的事”卡片在最后、满宽。",
  "links": [],
  "anchors": [
   {
    "id": "apply-steps",
    "text": "办理：验证一次，开一段时间"
   }
  ],
  "live": [
   "ca-form"
  ],
  "buttons": [
   {
    "text": "个人资料",
    "where": "第 2 步",
    "does": "这次办个人资料",
    "api": "不调接口：设 purpose=personal_data，随下面的提交一起发",
    "variants": [
     "选中",
     "没选中"
    ]
   },
   {
    "text": "全局无限制授权",
    "where": "第 2 步",
    "does": "这次办这台电脑的全局无限制授权（不是只给当前对话）",
    "api": "不调接口：设 purpose=unrestricted",
    "variants": [
     "选中",
     "没选中"
    ]
   },
   {
    "text": "同时办理",
    "where": "第 2 步",
    "does": "一次验证，两项都办",
    "api": "不调接口：设 combined=true",
    "variants": [
     "开",
     "关"
    ]
   },
   {
    "text": "0.5小时",
    "where": "第 3 步",
    "does": "把时长框填成 0.5",
    "api": "不调接口",
    "variants": []
   },
   {
    "text": "2小时",
    "where": "第 3 步",
    "does": "把时长框填成 2",
    "api": "不调接口",
    "variants": []
   },
   {
    "text": "8小时",
    "where": "第 3 步",
    "does": "把时长框填成 8",
    "api": "不调接口",
    "variants": []
   },
   {
    "text": "24小时",
    "where": "第 3 步",
    "does": "把时长框填成 24",
    "api": "不调接口",
    "variants": []
   },
   {
    "text": "将本次时长设为以后默认",
    "where": "第 3 步",
    "does": "验证成功后把这次时长存成默认；不改已开授权的截止时间",
    "api": "不调接口：设 save_default=true，随提交一起发",
    "variants": [
     "勾上",
     "没勾"
    ]
   },
   {
    "text": "验证并解锁资料",
    "where": "第 4 步",
    "does": "先建一条办理申请，再用验证码验证；结果以电脑回的为准",
    "api": "POST https://mcp.wly0829.cn/computer-access/api/requests（body：request_id、purpose、combined、save_default、duration_hours、state_version）→ POST https://mcp.wly0829.cn/computer-access/api/requests/{uuid}/verify（body 只有 totp，头 X-CSRF-Token）",
    "variants": [
     "验证并解锁资料",
     "验证并开启无限制授权",
     "验证并延长资料授权",
     "验证并延长无限制授权",
     "验证并办理两项",
     "正在验证…",
     "查询本次结果（结果不明时，改调 GET /requests/{uuid}）",
     "正在查询…",
     "不能点（时长不对、超过 72 小时、验证器不可用、冷却中）"
    ]
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
     "text_ref": "办理：验证一次，开一段时间",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "width": "100%"
    },
    {
     "type": "input_field",
     "text_ref": "在上面的卡片里点",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "arrow",
     "width": "100%",
     "fields": [
      "duration",
      "totp"
     ],
     "field_steps": {
      "duration": 3,
      "totp": 4
     },
     "place_fields": true,
     "variant": "normal",
     "items_layout": {
      "direction": "vertical",
      "steps_count": 4,
      "number_style": "green_circle",
      "connector": "thin_green_vertical_line",
      "buttons": "below_copy",
      "duration": {
       "after_item": 3,
       "width": "14% screen",
       "height": "6% screen",
       "empty": true
      },
      "totp": {
       "after_item": 4,
       "width": "20% screen",
       "height": "7% screen",
       "empty": true
      },
      "submit": {
       "text": "验证并解锁资料",
       "role": "primary",
       "position": "right_of_totp"
      },
      "save_default": {
       "type": "checkbox",
       "text": "将本次时长设为以后默认"
      },
      "step2_buttons": [
       "个人资料",
       "全局无限制授权",
       "同时办理"
      ],
      "step3_buttons": [
       "0.5小时",
       "2小时",
       "8小时",
       "24小时"
      ],
      "split_items_into_separate_refs": false
     }
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "width": "100%",
     "layout": "single",
     "key": "ca-form",
     "part": "preview",
     "empty": true,
     "items_layout": {
      "position": "below_step4",
      "width": "100%",
      "height": "6% screen",
      "full_width": true
     }
    },
    {
     "type": "points_card",
     "text_ref": "三件要知道的事",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "width": "100%",
     "icons": "auto",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 3,
     "icon_position": "none",
     "item_images": [
      "_library/icons/笔记本电脑.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
      "_library/icons/沙漏.png"
     ],
     "motion_icon_arrow": true
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。横图逐张实看：标题属于左约 58% 栏而非满屏；四步骤竖线贯通，不画成四列。右卡上沿约与左标题区对齐，占约 40%。一个完整 steps 节点交 input_field，用 field_steps 放两个空输入框，预览在第 4 步后。内部布局 items_layout 需主工程兑现，现控件可放输入但不等于圆圈竖线/按钮与验证码同行已经完成。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n页修复10：h改为全宽步骤/输入/预览，下方三件说明同外卡内横排三条；两方向按钮用现有below_copy，原字和标点保留。行内按钮句尾问题交组件继续处理。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "办理：验证一次，开一段时间",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "input_field",
     "text_ref": "在上面的卡片里点",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "fields": [
      "duration",
      "totp"
     ],
     "field_steps": {
      "duration": 3,
      "totp": 4
     },
     "place_fields": true,
     "variant": "normal",
     "items_layout": {
      "direction": "vertical",
      "steps_count": 4,
      "number_style": "green_circle",
      "connector": "none",
      "buttons": "below_copy",
      "duration": {
       "after_item": 3,
       "width": "100%",
       "empty": true
      },
      "totp": {
       "after_item": 4,
       "width": "100%",
       "empty": true
      },
      "submit": {
       "text": "验证并解锁资料",
       "position": "below_totp",
       "role": "primary"
      },
      "save_default": {
       "type": "checkbox",
       "text": "将本次时长设为以后默认"
      },
      "step2_buttons": [
       "个人资料",
       "全局无限制授权",
       "同时办理"
      ],
      "step3_buttons": [
       "0.5小时",
       "2小时",
       "8小时",
       "24小时"
      ],
      "split_items_into_separate_refs": false,
      "card_per_step": true,
      "step_icon_subjects": [
       "解锁窗口及手势",
       "个人资料/全局授权卡",
       "时钟日历",
       "验证器手机"
      ],
      "step_icon_position": "upper_right_inside",
      "do_not_repeat_inline_buttons": true
     },
     "icons": "auto",
     "columns_v": 1
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "layout": "single",
     "key": "ca-form",
     "part": "preview",
     "empty": true,
     "items_layout": {
      "position": "below_step4_before_notice_card"
     },
     "columns_v": 1
    },
    {
     "type": "points_card",
     "text_ref": "三件要知道的事",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "icons": "auto",
     "items_layout": {
      "outer_card": true,
      "title_from_group": true,
      "direction": "vertical",
      "items_count": 3,
      "separator": "thin_green",
      "icon_subjects": [
       "直达电脑的箭头",
       "手机和回旋箭头",
       "沙漏"
      ],
      "icon_position": "left_of_each_bullet",
      "body_from_entire_bullets_node": true,
      "source_part": 2,
      "full_width": true
     },
     "columns_v": 1,
     "whole_block": true,
     "item_cards": true,
     "motion_icon_arrow": true
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。竖图 v 和原 v2、批准替换 v2 均实看；source_images 优先引用 pages-approved.replace_images 的 02-v2。v 最下旧的三列短文与定稿冲突，只取其四步骤卡构图，不再烘入旧短文；三件说明以批准 v2 的三行左图右文为准、末尾满宽。第 3 步遗漏的默认时长保存说明须按定稿完整排入。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n页修复10：h改为全宽步骤/输入/预览，下方三件说明同外卡内横排三条；两方向按钮用现有below_copy，原字和标点保留。行内按钮句尾问题交组件继续处理。"
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
   "source_phrase": "一条直达电脑的箭头",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "一部手机和回旋箭头",
   "sha256": "2d2811a87008b221e7dec14f189f43393989e1b15a5b682824c03cbe742b7fec",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/解锁窗口手势.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "解锁窗口手势",
   "source_phrase": "横版：左上小节标题“办理：验证一次，开一段时间”。左边约 58% 宽：四步竖排编号流程（绿色圆圈编号，细绿竖线连起来），每步的按钮画在这一步的字后面同一行。第 3 步下面一个时长输入空框（约屏宽 14%、高约屏高 6%），第 4 步下面一个验证码输入空框（约屏宽 20%、高约屏高 7%），旁边一个主按钮“验证并解锁资料”；框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填（这两个框是真的输入框）。第 4 步下面再一个横长空框（约屏宽 52%、高约屏高 6%）放“本次：个人资料 · 2 小时”这类预览和冷却提示。右边约 40% 宽一张浅绿底卡片“三件要知道的事”，三条，每条前一个小水彩图标（一条直达电脑的箭头、一部手机和回旋箭头、一个沙漏）。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
   "sha256": "cdb7b05502b30880e575e5d1c0fb7fe3df262fbb3dd0cc360c3beed20b71ac88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/双授权卡严格两张.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "双授权卡严格两张",
   "source_phrase": "横版：左上小节标题“办理：验证一次，开一段时间”。左边约 58% 宽：四步竖排编号流程（绿色圆圈编号，细绿竖线连起来），每步的按钮画在这一步的字后面同一行。第 3 步下面一个时长输入空框（约屏宽 14%、高约屏高 6%），第 4 步下面一个验证码输入空框（约屏宽 20%、高约屏高 7%），旁边一个主按钮“验证并解锁资料”；框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填（这两个框是真的输入框）。第 4 步下面再一个横长空框（约屏宽 52%、高约屏高 6%）放“本次：个人资料 · 2 小时”这类预览和冷却提示。右边约 40% 宽一张浅绿底卡片“三件要知道的事”，三条，每条前一个小水彩图标（一条直达电脑的箭头、一部手机和回旋箭头、一个沙漏）。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
   "sha256": "3a9a0fdbe74f9d3210b33d300ca2cc784979549f63a09ef7d10401fadb9a255f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-cb3515b349211594c07a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cb3515b349211594c07a",
   "title_text": "办理：验证一次，开一段时间",
   "sha256": "81198cafc241d53e0df0898146591218bbd46baa8324f691949bee46b918118b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 办理：验证一次，开一段时间

1. 在上面的卡片里点“解锁”“开启”或“延长”，这一块就打开。
2. 选这次办哪一项：［个人资料］［全局无限制授权］［同时办理］。选“同时办理”：验证一次，两项分别办、分别计时。
3. 填时长，0.5 到 72 小时都行，或点［0.5小时］［2小时］［8小时］［24小时］。还有效的，在原截止时间上加；没开或已经到期的，从这次办成时起算。办完总共剩余不能超过 72 小时。勾上［将本次时长设为以后默认］，验证成功后记成以后的默认时长。
4. 打开手机上的验证器，输入 6 位动态码（开头的 0 也要输），点［验证并解锁资料］。

**三件要知道的事**
- 验证码直接交给这台电脑核对，不经过网站的服务器。
- 切到验证器 App 再回来，不会取消这次办理。
- 输错太多次会冷却：页面写清几点以后能再试，已经开着的授权不受影响；冷却完要我自己重新输、点提交，不会自动重试。

::screen{#computer-access-03 section="results"}

```typeset
{
 "screen": {
  "id": "computer-access-03",
  "section": "results",
  "title": "办完怎么看结果",
  "scene": "横版：左上小节标题“办完怎么看结果”，下面一行字。中间一张水彩风表格（圆角外框、细浅绿格线、表头浅绿底），三列：颜色、什么情况、页面上的那句话；第一列每格画一盏对应颜色的小水彩灯（绿、绿、黄、黄、红、灰）加颜色字。表格右边约 26% 宽：上面一张小卡片“灯和字一起变”，下面一张小卡片“操作结果”，后者里的三个按钮画成小按钮。右下角留一个空框（约屏宽 24%、高约屏高 8%，框画成很淡的水彩圆角细边框，框里一个字都不画，网页程序往里填），网页程序在这里弹出提示条。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
  "portrait": "竖版：小节标题和一行字；表格改成一行一张小卡片（左边小灯，右边“什么情况”粗体、下面那句话）；“灯和字一起变”“操作结果”两张卡片依次往下；提示条空框满宽在最后。",
  "links": [],
  "anchors": [
   {
    "id": "result-colors",
    "text": "办完怎么看结果"
   }
  ],
  "live": [
   "ca-toast",
   "ca-results"
  ],
  "buttons": [
   {
    "text": "操作结果",
    "where": "“操作结果”卡片",
    "does": "打开或关上操作结果面板，列出这次办理和每个锁定、结束、锁屏的结果",
    "api": "不调接口（本页显示）",
    "variants": [
     "操作结果",
     "操作结果（N）"
    ]
   },
   {
    "text": "查询结果",
    "where": "操作结果面板每一行",
    "does": "查这一个锁定、结束或锁屏当时的结果；不重做",
    "api": "GET https://mcp.wly0829.cn/computer-access/api/requests/{uuid}",
    "variants": [
     "查询结果",
     "查询中…"
    ]
   },
   {
    "text": "在主机查询此请求",
    "where": "操作结果面板每一行（只在网站上显示）",
    "does": "新开电脑自己的授权页，带上同一个请求编号查结果；不重新申请",
    "api": "打开 https://mcp.wly0829.cn/computer-access/?request={id}",
    "variants": []
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
     "text_ref": "办完怎么看结果",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%"
    },
    {
     "type": "prose",
     "text_ref": "每次办理、锁定以后",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%"
    },
    {
     "type": "table",
     "text_ref": "颜色",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "row": "results",
     "width": "68%",
     "items_layout": {
      "column_widths": [
       "15%",
       "24%",
       "61%"
      ],
      "header": "pale_green",
      "border": "thin_pale_green",
      "lamp_in_first_column": true,
      "lamp_order": [
       "green",
       "green",
       "yellow",
       "yellow",
       "red",
       "gray"
      ],
      "lamp_size": "small",
      "text_source": "table_node",
      "do_not_duplicate_text": true
     },
     "status_column": 0,
     "variant": "status_rows"
    },
    {
     "type": "points_card",
     "text_ref": "灯和字一起变",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "results",
     "width": "32%",
     "split_cards": true,
     "illustrations": [
      "_library/icons/放大镜.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "icon_position": "none"
    },
    {
     "type": "live_box",
     "key": "ca-results",
     "layout": "single",
     "part": "results",
     "width": "100%"
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "width": "100%",
     "key": "ca-toast",
     "layout": "single",
     "part": "toast",
     "empty": true,
     "items_layout": {
      "position": "last",
      "full_width": true,
      "height": "8% screen"
     }
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。横图逐张实看：表格左、两卡右、右下空提示框。标题及介绍属于满屏宽标题区，按统一要求章节大标题居中。表格六行状态灯是静态图例，ca-toast 是空实时框；ca-results 为网页按操作结果按钮展开的面板，不另加原图不存在的常驻空牌。表格首列水彩灯、右卡插画/小按钮等当前组件能力需样张核验。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮补齐定稿live键ca-results的留空框，置操作结果卡下、提示框前；不增说明字或调用接口。\n页修复10：h表格68%、结果两卡32%；两方向结果卡复用points_card明确右侧图，去除原core未消费字段和探出叶饰；结果/提示空框放在卡组后满宽。卡底按钮尚无保持原序的现有字段，交组件。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "办完怎么看结果",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "每次办理、锁定以后",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1
    },
    {
     "type": "table",
     "text_ref": "颜色",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "items_layout": {
      "rows_as_cards": true,
      "count": 6,
      "full_width": true,
      "lamp_order": [
       "green",
       "green",
       "yellow",
       "yellow",
       "red",
       "gray"
      ],
      "lamp_position": "left_inside",
      "situation": "bold_right",
      "message": "below_situation_right",
      "header_echo_once": true,
      "do_not_duplicate_text": true
     },
     "columns_v": 1,
     "status_column": 0,
     "variant": "status_rows"
    },
    {
     "type": "points_card",
     "text_ref": "灯和字一起变",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "columns_v": 1,
     "split_cards": true,
     "illustrations": [
      "_library/icons/放大镜.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "icon_position": "none"
    },
    {
     "type": "live_box",
     "key": "ca-results",
     "layout": "single",
     "part": "results"
    },
    {
     "type": "live_box",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "",
     "width": "100%",
     "layout": "single",
     "key": "ca-toast",
     "part": "toast",
     "empty": true,
     "items_layout": {
      "position": "last",
      "full_width": true
     },
     "columns_v": 1
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。竖图 v→v2→v3 全部实看并保留顺序。v 中六行无字占位不能替代正文；v2 中三列硬排不符合 portrait 的逐行卡要求。定稿六行都完整放入左灯右情况/下文的小卡，末尾依次两卡及空提示框；v3 插画嵌字按钮不直接裁入。可保留安全分张，但不重复烘入两份表格或卡名。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮补齐定稿live键ca-results的留空框，置操作结果卡下、提示框前；不增说明字或调用接口。\n页修复10：h表格68%、结果两卡32%；两方向结果卡复用points_card明确右侧图，去除原core未消费字段和探出叶饰；结果/提示空框放在卡组后满宽。卡底按钮尚无保持原序的现有字段，交组件。"
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "放大镜",
   "source_phrase": "灯和字一起变 状态一变，卡片上的灯和那行字同一刻换。读不到时灯变成空心灰圈、字写“当前状态未知”，旁边小字写上次读到的，不留旧的绿灯。",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "锁",
   "source_phrase": "操作结果 锁定、结束、锁屏都记在［操作结果］里，可以［查询结果］；在网站上办的，也能［在主机查询此请求］。",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "computer-access/computer-access-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\computer-access\\img\\computer-access-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6fc0d849cac748b48525",
   "title_text": "办完怎么看结果",
   "sha256": "1108d288156ea661f861cc31ec1700e7c123135fe621007f89ab5ecc9d739155",
   "status": "ready",
   "source_box": [
    19,
    4,
    762,
    177
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 办完怎么看结果

每次办理、锁定以后，页面右下角弹出一条提示，颜色和一句话一起出现，10 秒后自己收起；卡片上的灯和字同时换成最新状态。

| 颜色 | 什么情况 | 页面上的那句话 |
|---|---|---|
| 绿 | 办成了 | “办理成功。”“个人资料已锁定。”“无限制授权已结束。”“Windows锁屏已完成。” |
| 绿 | 办成了，默认时长没存上 | “办理成功；默认时长未保存。” |
| 黄 | 正在变 | “资料访问已结束，正在关闭资料。” |
| 黄 | 结果还不确定 | 网断了或电脑没回话：按钮变成“查询本次结果”，只查原来那次，不要重新提交验证码；两项只办成一项时写“部分完成”，两项分别写结果。 |
| 红 | 没办成 | “动态验证码不正确。本次未完成，已有授权保持原期限。”“授权、开机或配置状态已变化。请查看最新状态，再决定是否重新办理。” |
| 灰 | 连不上电脑 | “暂时无法连接电脑”“连接服务暂时异常”：不说明电脑关机了；已有授权照原期限走，页面不会把操作再做一遍。 |

**灯和字一起变**　状态一变，卡片上的灯和那行字同一刻换。读不到时灯变成空心灰圈、字写“当前状态未知”，旁边小字写上次读到的，不留旧的绿灯。

**操作结果**　锁定、结束、锁屏都记在［操作结果］里，可以［查询结果］；在网站上办的，也能［在主机查询此请求］。

::screen{#computer-access-04 section="how"}

```typeset
{
 "screen": {
  "id": "computer-access-04",
  "section": "how",
  "title": "连不上时，和这一页怎么工作",
  "scene": "横版：左右两栏等宽卡片。左卡“连不上电脑时”（小水彩图标：一根断开的网线插头），三步编号，第 1 步后面画“重新检查连接”次按钮，最后一步的链接画成绿色。右卡“这一页怎么工作”（小水彩图标：一只遥控器对着一台电脑），四条，每条前一个小绿点。两张卡片等高、上沿对齐，下面不留大块空白。按钮画成“能点”的样子：主按钮绿底白字，次按钮白底细绿边，危险一点的（锁定、结束）白底细灰边；按钮的“不能点”“进行中”和换字的样子由网页程序贴同尺寸的预画变体图（变体字写在 buttons 里）。",
  "portrait": "竖版：两张卡片上下排、满宽，左卡在上。",
  "links": [
   {
    "text": "救急先看：远程连不上",
    "href": "/rescue/#e-remote"
   }
  ],
  "anchors": [
   {
    "id": "offline",
    "text": "连不上电脑时"
   },
   {
    "id": "how-it-works",
    "text": "这一页怎么工作"
   }
  ],
  "live": [],
  "buttons": [
   {
    "text": "重新检查连接",
    "where": "左卡第 1 步",
    "does": "重新读一次电脑状态",
    "api": "GET https://mcp.wly0829.cn/computer-access/api/status?refresh=1",
    "variants": [
     "重新检查连接",
     "刷新中…"
    ]
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
     "type": "points_card",
     "text_ref": "连不上电脑时",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "how",
     "width": "49fr",
     "icons": "auto",
     "items_layout": {
      "outer_card": true,
      "title": "inside_upper_left",
      "title_size": "medium",
      "intro_after_heading": true,
      "icon_subject": "断开的网线插头",
      "icon_position": "upper_right_inside",
      "numbered_items": 3,
      "number_style": "green_circle",
      "steps_direction": "vertical",
      "button_first_step": "重新检查连接",
      "button_role": "secondary",
      "link_last_step": "救急先看：远程连不上",
      "link_style": "green_underline",
      "equal_height": true,
      "no_duplicate_title": true
     },
     "whole_block": true,
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-d819641dd52018c42577.png"
     ],
     "row_equal_height": true
    },
    {
     "type": "points_card",
     "text_ref": "这一页怎么工作",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "how",
     "width": "49fr",
     "icons": "auto",
     "items_layout": {
      "outer_card": true,
      "title": "inside_upper_left",
      "title_size": "medium",
      "icon_subject": "遥控器对着电脑",
      "icon_position": "upper_right_inside",
      "bullets_count": 4,
      "bullet_style": "green_dot",
      "equal_height": true
     },
     "whole_block": true,
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ]
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。横图逐张实看：两大卡等宽等高、上沿齐，左标题和断线图在卡内上方，左含介绍及三编号步骤；右标题和遥控器电脑在卡内上方，四绿点条目。旧图左卡重复一次标题不沿用（定稿只一个），不另造整屏标题。两张卡的嵌套 h2/步骤/段落同属单个 content_card，items_layout 的卡内标题与插画仍需引擎支持。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。；16:3x 主工程师接管规格：how 行两卡加 row_equal_height（comp-text QA 第 5 条）。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "text_ref": "连不上电脑时",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "icons": "auto",
     "items_layout": {
      "outer_card": true,
      "title": "inside_upper_left",
      "title_size": "medium",
      "intro_after_heading": true,
      "icon_subject": "断开的网线插头",
      "icon_position": "upper_right_inside",
      "numbered_items": 3,
      "number_style": "green_circle",
      "steps_direction": "vertical",
      "button_first_step": "重新检查连接",
      "button_role": "secondary",
      "link_last_step": "救急先看：远程连不上",
      "link_style": "green_underline",
      "equal_height": false,
      "no_duplicate_title": true,
      "full_width": true
     },
     "columns_v": 1,
     "whole_block": true,
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-d819641dd52018c42577.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "这一页怎么工作",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "right_inside",
     "connector": "none",
     "row": "",
     "width": "100%",
     "icons": "auto",
     "items_layout": {
      "outer_card": true,
      "title": "inside_upper_left",
      "title_size": "medium",
      "icon_subject": "遥控器对着电脑",
      "icon_position": "upper_right_inside",
      "bullets_count": 4,
      "bullet_style": "green_dot",
      "equal_height": false,
      "full_width": true
     },
     "columns_v": 1,
     "whole_block": true,
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ]
    }
   ],
   "notes": "仅构图草稿，未渲染，未知扩展字段只作布局说明。所有文字逐字取 page.json；［］〔〕作为按钮/链接标记不画括号。输入与实时框一律留空，正常按钮文字及变体取本屏 buttons，不实际调用接口。新构图，待样张：批准样板未覆盖本屏动态控件与专用排法，须先看组件样张。竖图实看：左卡在上、右卡在下满宽；断线与遥控器电脑均在各卡标题右侧。原图将离线介绍置于首卡上方而标题在卡内；当前节点只能以定稿标题→介绍整体分配，intro_position 描述尚需组件把介绍提到首卡上方且保持所有文字各出现一次，未支持前不得声称复刻完成。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n页修复10校正：04v介绍保持原标题之后的定稿顺序，撤掉不匹配原节点顺序的旧intro_position描述；未移动原字。"
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
   "asset": "_library/fix-round-2/icon-clean-d819641dd52018c42577.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "断开插头",
   "source_phrase": "连不上电脑时\n页首写“暂时无法连接电脑”或“连接服务暂时异常”：可能是网络、休眠、关机或连接服务出了问题，光凭这一条分不出是哪个。\n1点重新检查连接。2还不通：用ToDesk或网易UU看看电脑实际怎么了，别光凭连不上就反复断电。3更多见救急先看：远程连不上。",
   "sha256": "c90bccf55a820d3a09af80cdd6237485d146faace49e2ca45885101d679d4b84",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "key": "双屏同步",
   "source_phrase": "这一页怎么工作\n页面开在前台时，每60秒读一次电脑；切回来马上读。刷新不会延长授权。时间都是北京时间。网页只是遥控器：判断和执行都在电脑上，由密码中心的授权程序办；网页自己不存授权状态。每次办理都和这个浏览器绑定；结果不明时只查原来那次，不会把同一个动作做第二遍。只能在wly0829.cn或电脑自己的授权页上办理；在别处打开只能看。",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "computer-access/computer-access-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\computer-access\\img\\computer-access-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-301c0bb1b591957f9f9b",
   "title_text": "连不上电脑时",
   "sha256": "1df69b21993402636c064cdacf4bca95da96e84a6b31ed1eb44e6ab5c99d2d41",
   "status": "ready",
   "source_box": [
    17,
    155,
    551,
    371
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "computer-access/computer-access-04-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b2\\computer-access\\img\\computer-access-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c40ceeadedbab4b44e0c",
   "title_text": "这一页怎么工作",
   "sha256": "78322a3b02e6a2c64436834dbbafef444d4efb1bab30bdd13a9ec10e9b90d558",
   "status": "ready",
   "source_box": [
    838,
    172,
    1318,
    373
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 连不上电脑时
页首写“暂时无法连接电脑”或“连接服务暂时异常”：可能是网络、休眠、关机或连接服务出了问题，光凭这一条分不出是哪个。
1. 点［重新检查连接］。
2. 还不通：用 ToDesk 或网易 UU 看看电脑实际怎么了，别光凭连不上就反复断电。
3. 更多见〔救急先看：远程连不上〕。

## 这一页怎么工作
- 页面开在前台时，每 60 秒读一次电脑；切回来马上读。刷新不会延长授权。时间都是北京时间。
- 网页只是遥控器：判断和执行都在电脑上，由密码中心的授权程序办；网页自己不存授权状态。
- 每次办理都和这个浏览器绑定；结果不明时只查原来那次，不会把同一个动作做第二遍。
- 只能在 wly0829.cn 或电脑自己的授权页上办理；在别处打开只能看。
