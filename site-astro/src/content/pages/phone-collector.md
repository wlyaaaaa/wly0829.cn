---
{
 "title": "手机采集",
 "kind": "project",
 "url": "/projects/phone-collector/",
 "tagline": "安卓手机上的一个小 App：把只有手机拿得到的几样记录存好，等电脑在家时收走。",
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
   "id": "highlights",
   "label": "亮点"
  },
  {
   "id": "features",
   "label": "全部功能"
  },
  {
   "id": "history",
   "label": "演进"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "phone-collector",
  "kind": "project",
  "title": "手机采集",
  "url": "/projects/phone-collector/",
  "tagline": "安卓手机上的一个小 App：把只有手机拿得到的几样记录存好，等电脑在家时收走。",
  "status": "常用",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次更新",
    "at": "2026-11-05"
   },
   "facts": [
    "夜里会不会被系统停掉，还在真机观察",
    "源码为 0.1.19；电脑收到的状态为 0.1.19（11 月 6 日 05:40 重读）；手机上的安装包和蓝牙授权没有当场核过，流量页分卡也没核实"
   ],
   "as_of": "2026-11-06",
   "source": "项目源码和收取记录"
  },
  "public": false,
  "repo_url": null,
  "capability": "把手机上的原始记录存好交给电脑",
  "based_on": {
   "commit": "665833cc9f28eee75678a45cf89db6f37cdf7891",
   "commit_time": "2026-11-04T10:15:31+08:00"
  },
  "video_prompt": "开头短视频提示词：6 秒无缝循环，白底水彩画风，清新亮绿主色，照开头这屏的插画出发。竖放的手机屏幕轻轻亮一下，旁边的小闹钟指针转过一小格；几张空白的小纸条从手机里依次飘出，沿一条绿色细虚线飞进右边小笔记本电脑旁打开的文件夹；文件夹轻轻合上，回到起始画面。不出现任何文字、数字、地图、定位针、轨迹、应用图标、品牌标志和人脸，镜头固定，动作轻柔。",
  "registry": {
   "groups": [
    {
     "id": "g-collect",
     "name": "采集"
    },
    {
     "id": "g-handoff",
     "name": "交给电脑"
    },
    {
     "id": "g-keepalive",
     "name": "保活和自查"
    },
    {
     "id": "g-view",
     "name": "手机上直接看"
    }
   ],
   "features": [
    {
     "id": "f-usage",
     "group": "g-collect",
     "name": "补拉系统使用事件",
     "what": "从断点接着查，分段、去重；系统没留的记成缺口",
     "how": "自动；问理解库“手机用了多久”时用到",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md「原始使用事件与断点」；CollectorEngine.kt"
    },
    {
     "id": "f-packages",
     "group": "g-collect",
     "name": "装机清单快照",
     "what": "有变化才写一份新快照，带序号和指纹；没变只记“无变化”",
     "how": "自动；问理解库“手机装了什么”时用到",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md「装机清单」"
    },
    {
     "id": "f-location",
     "group": "g-collect",
     "name": "系统送点定位",
     "what": "请系统定位服务约每 15 分钟送点（实际可能延迟），距上次满 10 分钟才写一行",
     "how": "自动；问理解库“去过哪”时用到",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector AGENTS.md；README（0.1.10 起）；LocationSchedule.kt"
    },
    {
     "id": "f-location-fallback",
     "group": "g-collect",
     "name": "单次定位后备",
     "what": "采集运行时距上次满 31 分钟才尝试一次，最长 60 秒；不收旧缓存",
     "how": "自动；RUN 广播带 forceLocation 可强制",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector AGENTS.md；LocationCollector.kt"
    },
    {
     "id": "f-steps",
     "group": "g-collect",
     "how": "自动；权限从 App 的系统健康权限卡放行",
     "screen": "phone-collector-07",
     "source": "docs/data-format.md「手机步数」",
     "name": "系统手机步数",
     "what": "醒来时回读系统健康应用（Health Connect）记的本机步数，按 15 分钟一格存；读不到写原因，不当 0",
     "status": "在用"
    },
    {
     "id": "f-files",
     "group": "g-handoff",
     "name": "按日文件只追加",
     "what": "产出放在手机的 PersonalOS 目录，按北京日期分文件，原始记录不改写",
     "how": "自动",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md「文件与提交规则」；JsonStore.kt"
    },
    {
     "id": "f-pull",
     "group": "g-handoff",
     "name": "电脑定时收取",
     "what": "在家每 30 分钟经无线调试收一次；不在家先存在手机上",
     "how": "自动：PCConfig Phone PersonalOS Pull",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "PCConfig tools/Manage-PhonePersonalOSPull.ps1、tools/phone_personalos_pull.py；docs/design/phone-switch-arrival.md（10 月 19 日起）"
    },
    {
     "id": "f-other-user-events",
     "group": "g-handoff",
     "how": "电脑半小时收取时按需另读",
     "screen": "phone-collector-07",
     "source": "PCConfig phone_personalos_pull.py；daily-preferences docs/connected-source-refresh.md",
     "name": "电脑另读双开空间",
     "what": "App 读不到双开空间（第二个微信）的使用事件；电脑连上手机时距上次成功满 2 小时另读最近 24 小时，单独交给理解库",
     "status": "在用"
    },
    {
     "id": "f-import",
     "group": "g-handoff",
     "name": "理解库导入",
     "what": "AI 刷新手机来源时按指纹保全原件，事件、运行、装机清单、步数分四路导入",
     "how": "理解库刷新手机来源时",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "daily-preferences docs/connected-source-refresh.md；collector_sources.py；mobility.py 读定位 CSV"
    },
    {
     "id": "f-install",
     "group": "g-handoff",
     "name": "一条命令安装",
     "what": "手机连上电脑（插线或已配对的无线调试）后，一条命令装好、授权、打开，并取回第一轮状态",
     "how": "tools/Install-Collector.ps1 -OutDir <新目录>",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector README；tools/Install-Collector.ps1"
    },
    {
     "id": "f-update-only",
     "group": "g-handoff",
     "how": "tools/Install-Collector.ps1 -UpdateOnly -OutDir <新目录>",
     "screen": "phone-collector-07",
     "source": "tools/Install-Collector.ps1",
     "name": "只更新不重新授权",
     "what": "已装好的手机只换新版：核对包名和装完的文件，不动权限、不打开 App",
     "status": "待验收"
    },
    {
     "id": "f-job",
     "group": "g-keepalive",
     "name": "系统周期叫醒",
     "what": "每 15 分钟请求一次；开机、解锁、更新后重新登记",
     "how": "自动",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md「自身运行与退出」；AndroidManifest.xml BootReceiver"
    },
    {
     "id": "f-kick",
     "group": "g-keepalive",
     "name": "每小时推一下",
     "what": "MacroDroid 每小时发一次叫醒广播",
     "how": "自动：MacroDroid“叫醒采集App”",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "PCConfig docs/recovery/android-phone-switch.md 宏表；RunReceiver"
    },
    {
     "id": "f-adb",
     "group": "g-keepalive",
     "name": "无线调试自动打开",
     "what": "开机、连上 Wi-Fi 时 MacroDroid 自动打开，电脑按新端口找手机",
     "how": "自动：MacroDroid“自动启用无线adb”",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "PCConfig docs/recovery/android-phone-switch.md；phone-collector AGENTS.md 分工条"
    },
    {
     "id": "f-pending",
     "group": "g-keepalive",
     "name": "写不进先存内部",
     "what": "共享存储不可写时，运行、退出和新收到的定位先存 App 内部，恢复后补写",
     "how": "自动",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md collector-pending"
    },
    {
     "id": "f-runs",
     "group": "g-keepalive",
     "name": "运行和退出记录",
     "what": "每轮的触发方式、各步结果、间隔；系统给的退出原因",
     "how": "自动",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector docs/data-format.md「自身运行与退出」"
    },
    {
     "id": "f-scheduling",
     "group": "g-keepalive",
     "name": "调度事件记录",
     "what": "最近 48 条叫醒和停止事件，查夜里的空档；0.1.13 起另存最近 48 批送点判定（不含坐标），分清系统没送点还是收到后没写进去",
     "how": "自动（0.1.12 起）",
     "status": "待验收",
     "screen": "phone-collector-07",
     "source": "phone-collector 提交 00c6460（北京 10 月 21 日 10:41）；docs/data-format.md"
    },
    {
     "id": "f-status",
     "group": "g-keepalive",
     "name": "采集概览页",
     "what": "最近一轮、补拉结果、近 24 小时实际运行次数和最长间隔、步数回读到哪、七项权限",
     "how": "打开 App；可点“立即采集一次”",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "phone-collector MainActivity.kt"
    },
    {
     "id": "f-health",
     "group": "g-keepalive",
     "name": "电脑查新鲜度",
     "what": "手机桥健康检查：超过 2 小时没新文件算不新鲜",
     "how": "自动",
     "status": "在用",
     "screen": "phone-collector-07",
     "source": "PCConfig tools/phone_bridge_health.py（collector 7200 秒）"
    },
    {
     "id": "f-traffic",
     "group": "g-view",
     "how": "打开 App 左右滑到“流量统计”；首次或换卡后初始化",
     "screen": "phone-collector-07",
     "source": "MainActivity.kt；TrafficReader.kt",
     "name": "流量统计页",
     "what": "按日、周、月看 Wi-Fi、SIM1、SIM2 的流量和全部应用，打开才读，不上传；分卡要电脑初始化一次",
     "status": "待验收"
    },
    {
     "id": "f-bt-bridge",
     "group": "g-handoff",
     "name": "蓝牙调试转发",
     "what": "电脑经蓝牙连进来时短暂转到手机本机调试端口，连完自己退出；要已配对的电脑、蓝牙连接权限和已打开的调试端口。只给 AI 按需取用，定时收取仍只走局域网或 USB。11 月 5 日真机连通过，手机现在的授权没有读回",
     "how": "电脑 AI 按需取手机内容时自动用，不用手动开",
     "status": "待验收",
     "screen": "phone-collector-07",
     "source": "README.md；BluetoothBridge.kt；提交 06453cf、c91c18e"
    }
   ],
   "numbers": [
    {
     "id": "n-categories",
     "text": "6 类",
     "meaning": "系统使用事件、装机清单、定位、手机步数、自身运行和退出记录",
     "as_of": "2026-11-04",
     "source": "phone-collector README v0.1.12；docs/data-format.md",
     "screens": [
      "phone-collector-01"
     ]
    },
    {
     "id": "n-job-period",
     "text": "15 分钟",
     "meaning": "周期任务的请求间隔；实际叫醒时间由系统决定",
     "as_of": "2026-11-04",
     "source": "phone-collector docs/data-format.md「自身运行与退出」",
     "screens": [
      "phone-collector-01"
     ]
    },
    {
     "id": "n-pull-period",
     "text": "30 分钟",
     "meaning": "电脑经无线 adb 收取的间隔",
     "as_of": "2026-11-04",
     "source": "PCConfig tools/Manage-PhonePersonalOSPull.ps1（RepetitionInterval 30 分钟）",
     "screens": [
      "phone-collector-01"
     ]
    },
    {
     "id": "n-tests",
     "text": "74 个",
     "meaning": "app/src/test 下 14 个带 @Test 的 Kotlin 文件，静态计数，未重跑",
     "as_of": "2026-11-06",
     "source": "phone-collector 665833c 的 app/src/test/**/*.kt",
     "screens": [
      "phone-collector-01"
     ]
    },
    {
     "id": "n-version",
     "text": "0.1.19",
     "meaning": "versionCode 20；11 月 6 日 05:40 重读已收状态也是 0.1.19，不证明实时安装包身份",
     "as_of": "2026-11-06",
     "source": "app/build.gradle.kts",
     "screens": [
      "phone-collector-05"
     ]
    },
    {
     "id": "n-network",
     "text": "1 个",
     "meaning": "AndroidManifest 里的 INTERNET 权限，只连本机回环",
     "as_of": "2026-11-06",
     "source": "app/src/main/AndroidManifest.xml",
     "screens": [
      "phone-collector-05"
     ]
    },
    {
     "id": "n-commits",
     "text": "47 次",
     "meaning": "截至 11 月 6 日 05:10 的仓库累计提交数",
     "as_of": "2026-11-06",
     "source": "git rev-list --count HEAD",
     "screens": [
      "phone-collector-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-daily-preferences-import",
     "with": "daily-preferences",
     "direction": "交出",
     "flow": "事件、运行、装机清单、步数四路导入理解库；定位 CSV 供“去过哪”读取；退出和状态文件只保全",
     "source": "daily-preferences docs/connected-source-refresh.md；collector_sources.py；mobility.py"
    },
    {
     "id": "r-pcconfig-pull",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "电脑每 30 分钟经无线 adb 收取手机 PersonalOS 目录到来源投递区",
     "source": "PCConfig tools/phone_personalos_pull.py；Manage-PhonePersonalOSPull.ps1"
    },
    {
     "id": "r-pcconfig-health",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "手机桥健康检查判断采集 App 产出新不新；通知、验证码和剪贴板由手机桥负责，不在本 App",
     "source": "PCConfig tools/phone_bridge_health.py；phone-collector AGENTS.md"
    }
   ],
   "highlights": [
    {
     "id": "h-replay",
     "title": "被杀几次，记录也不断。",
     "screen": "phone-collector-06"
    },
    {
     "id": "h-location",
     "title": "定位不靠常驻，目标约半小时一个点。",
     "screen": "phone-collector-06"
    },
    {
     "id": "h-night",
     "title": "夜里断了，有线索可查。",
     "screen": "phone-collector-06"
    }
   ],
   "mentions": [
    {
     "target": "/projects/daily-preferences/",
     "screen": "phone-collector-01",
     "text": "原料交给谁 → 个人理解库"
    },
    {
     "target": "/projects/daily-preferences/source-coverage/",
     "screen": "phone-collector-02",
     "text": "看来源怎么接进来"
    },
    {
     "target": "/projects/daily-preferences/mobile-context-delivery/",
     "screen": "phone-collector-02",
     "text": "看手机怎么用理解库"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "开机、首次解锁、App 更新后重新登记，和周期任务合成一条“系统周期叫醒”。"
   ],
   "dropped": [
    "任何定位点、地点、轨迹，使用事件和装机清单的内容，手机号、设备序列号、IP、端口和令牌：按本人 10 月 22 日 07:22 要求不公开。",
    "小米 15 Pro 的做法：10 月 21 日退役，只在演进里提一句。",
    "KDE Connect 的来回（10 月 19 日接、20 日卸载）：不是本 App 的功能，不上页面。"
   ],
   "unsure": [
    "手机上实际装的是不是 0.1.12，这次没有连手机读；“调度事件记录”因此标待验收。",
    "换机清单里的“拔线观察 72 小时”和跨夜定位口径，没找到通过回执；状态行写“还在真机观察”。",
    "项目规则的分工条把“装机清单”列为电脑能做的事，但现行 App 仍在导出装机清单；页面按现行实现写。",
    "第 2 屏的示例问法是替本人口吻编的，不是真实提问。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/phone-collector/page.json",
  "sha256": "c1ad2b6d075bfcbb3621737a6fcc929423746cf77e8f5008a2c2a34068271632",
  "converted_at_beijing": "2026-11-06T14:40:56+08:00"
 }
}
---

::screen{#phone-collector-01 section="top"}

```typeset
{
 "screen": {
  "id": "phone-collector-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上大标题，下面一段介绍（约五行）。右上一幅水彩插画（待生成，见生图提示词）。中间一排四张等宽数字卡，每张左上角一个小水彩图标（依次是：一部手机、一个秒表、手机和电脑连在一起、一张带对勾的清单），上面大号绿色粗体字，下面一两行小字。数字卡下面右对齐一行灰色小字“截至 10 月 22 日”。最下面左对齐两个白底细浅绿描边的圆角按钮。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和介绍在上；插画缩到整宽放在介绍下面；四张数字卡两行两列；“截至”一行和按钮在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "原料交给谁 → 个人理解库",
    "href": "/projects/daily-preferences/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/phone-collector/#ai-brief"
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
     "size": "large",
     "row": "首屏",
     "width": "50%",
     "text_ref": "手机采集"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次更新 11 月 5 日",
       "state": "ok"
      },
      {
       "text": "夜里会不会被系统停掉，还在真机观察",
       "state": "fact"
      },
      {
       "text": "源码为 0.1.19；电脑收到的状态为 0.1.19（11 月 6 日 05:40 重读）；手机上的安装包和蓝牙授权没有当场核过，流量页分卡也没核实",
       "state": "fact"
      }
     ],
     "static_note": "截至 11 月 6 日 · 项目源码和收取记录",
     "row": "首屏"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "row": "首屏",
     "width": "49%",
     "index": 0,
     "size": "large"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机.png",
      "_library/icons/秒表.png",
      "_library/icons/手机电脑连接.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "text_ref": "6 类"
    },
    {
     "type": "action_button",
     "align": "left",
     "columns": 2,
     "text_ref": "原料交给谁"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "手机采集"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次更新 11 月 5 日",
       "state": "ok"
      },
      {
       "text": "夜里会不会被系统停掉，还在真机观察",
       "state": "fact"
      },
      {
       "text": "源码为 0.1.19；电脑收到的状态为 0.1.19（11 月 6 日 05:40 重读）；手机上的安装包和蓝牙授权没有当场核过，流量页分卡也没核实",
       "state": "fact"
      }
     ],
     "static_note": "截至 11 月 6 日 · 项目源码和收取记录"
    },
    {
     "type": "stat_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机.png",
      "_library/icons/秒表.png",
      "_library/icons/手机电脑连接.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "text_ref": "6 类"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "手机上有几样东西只有手机自己拿得到"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "size": "large"
    },
    {
     "type": "action_button",
     "align": "center",
     "columns": 1,
     "columns_v": 1,
     "text_ref": "原料交给谁"
    }
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "asset": "_library/illustrations/main-phone-collector.png",
   "semantic_status": "scene_explicit_primary_object",
   "key": "main-phone-collector",
   "source_phrase": "首屏主插画（待生成）：白底水彩，清新亮绿主色（以月度报数插画的亮绿为准）。左边一部竖放的安卓手机，屏幕空白、只有几条浅灰横线；手机旁一只小闹钟和一个小沙漏。几张空白的小纸条从手机里飘出，沿一条绿色细虚线飞向右边一台小笔记本电脑，电脑旁一个打开的绿色文件夹；四周点缀亮绿叶子和几朵小白花。不画地图、定位针、轨迹、应用图标、数字、文字、品牌标志和人脸。",
   "sha256": "f554f4462988651607c5a8960869c3792984c7e17081de9f2b525a9fd21df834",
   "status": "ready"
  }
 ]
}
```

# 手机采集

手机上有几样东西只有手机自己拿得到：系统记下的哪个应用什么时候到了前台、手机上装了哪些应用、人大概在哪儿、手机系统记的步数。我在安卓手机上装了一个自己写的小 App（手机上叫“个人采集”），它请系统约每 15 分钟叫醒一次（实际可能延迟），把这几样补拉下来、存成文件留在手机里；电脑在家时每半小时经无线调试来收一次；AI 刷新手机来源时，个人理解库再导入，用来算手机用了多久、查去过哪、看装了什么、查手机步数。另外，打开 App 的“流量统计”页，能直接看每天、每周、每月 Wi-Fi 和两张卡各用了多少流量、哪个应用用得多；这一页打开才读，不经过电脑。采集的东西不往外网传，平时也不在通知栏常驻；被系统杀掉，已经写下的也不丢；没采到的时段明写是缺口，不补猜。它还多了一个小用处：电脑连不上手机的 Wi-Fi 时，可以经蓝牙连进来，这时通知栏短暂出现“电脑经蓝牙连接中”，连完自己退出。这条路只给 AI 临时取东西用；每半小时的定时收取仍然只走局域网或 USB，手机在外面不会被定时收。网页上只讲做法，不放任何定位点、使用记录、步数、流量和装机清单。

| **6 类** | **15 分钟** | **30 分钟** | **74 个** |
|---|---|---|---|
| 系统使用事件、装机清单、定位、手机步数，加上它自己的运行和被停记录 | 请系统每 15 分钟叫醒一次；实际什么时候叫由系统定，不保证准时 | 电脑在家每 30 分钟经无线调试收一次；不在家就先存在手机里 | 自动测试用例，全用合成数据；11 月 6 日只清点了数量，没有重跑 |

〔原料交给谁 → 个人理解库〕　〔复制 AI 续作说明〕

::screen{#phone-collector-02 section="usage"}

```typeset
{
 "screen": {
  "id": "phone-collector-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版：左上标题，标题下一行灰色小字。中间四张大圆角卡片两行两列，每张左上角一个圆形绿色编号和一个小水彩图标（①一个工具箱，②一本日历，③手机和电脑连在一起，④一只放大镜），卡片标题粗体，下面一段正文。四张卡片下面横跨整屏一条浅绿底细条，写那句“要问的事问理解库……”。最下面左对齐一行小字，带两个链接。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和灰色小字在上；四张卡片一行一张上下排；浅绿细条和链接在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "看来源怎么接进来",
    "href": "/projects/daily-preferences/source-coverage/"
   },
   {
    "text": "看手机怎么用理解库",
    "href": "/projects/daily-preferences/mobile-context-delivery/"
   },
   {
    "text": "手机直取",
    "href": "/skills/phone-direct/"
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
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "装好、放行一次以后"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/日历时钟.png",
      "_library/icons/手机电脑连接.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/icons/手机电脑连接.png"
     ],
     "text_ref": "① 装一次，放行一次",
     "item_count": 5
    },
    {
     "type": "notice",
     "align": "left",
     "text_ref": "要问的事问理解库"
    },
    {
     "type": "prose",
     "text_ref": "理解库怎么读这些记录"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "装好、放行一次以后"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/日历时钟.png",
      "_library/icons/手机电脑连接.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/icons/手机电脑连接.png"
     ],
     "text_ref": "① 装一次，放行一次",
     "item_count": 5
    },
    {
     "type": "notice",
     "text_ref": "要问的事问理解库"
    },
    {
     "type": "prose",
     "text_ref": "理解库怎么读这些记录"
    }
   ]
  }
 },
 "images": []
}
```

# 平时怎么用

装好、放行一次以后，采集和电脑收文件都自动进行；AI 刷新手机来源时再导入理解库，回答前先看最近导入到哪天、有没有缺口。想知道什么，直接问 AI；想看流量，打开 App 的“流量统计”页。

**① 装一次，放行一次**
先在电脑上构建出安装包，再让手机连上电脑（插线，或已配对且在线的无线调试都行，第一次可能要在手机上点确认），跑一条安装命令：装好 App、给权限、打开一次，再把第一轮的状态取回电脑核对。要给的是使用情况访问、所有文件访问、定位（含后台）、忽略电池优化、蓝牙连接（电脑经蓝牙连手机时要用），以及系统健康应用（Health Connect）里的步数、后台读取、历史步数三项；手机不让命令代开时，到 App 的“权限”卡点进去自己开。再在手机系统里放行自启动和后台。想分开看两张卡的流量，首次安装、换卡、调换卡槽或清除 App 数据后，还要让电脑做一次分卡初始化。之后不用再打开它。以后升级只换新版：不重新授权、不打开 App，权限和分卡设置都留着；所以只换新版的旧安装不一定有蓝牙连接这项，要用就重跑一次完整安装。权限被撤销了，再回“权限”卡打开。

**② 平时它自己醒、自己写**
它请系统约每 15 分钟叫醒一次，实际可能延迟；开机、解锁、App 更新以后也会重新登记；MacroDroid 每小时再推它一下。每一轮补拉新的使用事件、回读系统记的手机步数、看装机清单变没变、看定位够不够新，写完文件就退出。

**③ 回家自动交给电脑**
电脑每 30 分钟经无线调试来收一次。出门在外、在家只开数据网络都算正常，文件先留在手机上，回家连上 Wi-Fi 后一并补收。这条定时收取只走局域网或 USB，蓝牙转发不改变这一点。AI 在外面临时要手机上的东西，是另一件事，见〔手机直取〕。电脑核对指纹后存进本地的个人资料目录；AI 刷新手机来源时，个人理解库再从那里导入。

**④ 想看它在不在干活**
打开 App 的“采集概览”页：最近一轮是什么时候、今天补拉了多少、近 24 小时实际运行几次（含打开 App 和手动采集）、最长隔了多久、最近一次被系统停掉的原因、步数回读到哪，以及七项开没开（使用情况访问、所有文件、健康步数、后台回读、历史步数、电池白名单、通知；定位授权在系统设置里看）。“刷新”只重新读一遍状态，不会启动采集；要马上跑一轮，点“立即采集一次”。电脑这边，手机桥每次检查也看它多久没出新文件，超过 2 小时算不新鲜。

**⑤ 想看流量用了多少**
左右滑到“流量统计”页：按北京时间的日、自然周、月翻看系统还留着的历史，可以筛 Wi-Fi、SIM1、SIM2 和总量、下载、上传，下面列出有流量记录的全部应用。打开或切日期时才读系统接口，不在后台采，也不上传；日常不靠电脑和无线调试。它只告诉你哪个应用用了多少流量，认不出访问了哪个网站。

要问的事问理解库：比如（示例）“我昨天手机用了多久？”这个 App 只管把原料存好，时长、去过哪、装了什么、手机步数都由理解库来算。

理解库怎么读这些记录：〔看来源怎么接进来〕　反过来，手机上的 AI 想用电脑上的理解：〔看手机怎么用理解库〕

::screen{#phone-collector-03 section="usage"}

```typeset
{
 "screen": {
  "id": "phone-collector-03",
  "section": "usage",
  "title": "被杀、断档、连不上怎么办",
  "scene": "横版：左上标题。下面七张横向小卡片两列排，每张左边一个小水彩图标（一个带对勾的盾牌、一个沙漏、一团理开的乱线、一个文件夹、一个地球、一根断开的线、一张白纸），右边粗体小标题加两三行正文。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题在上；七张卡片一行一张上下排。字和横版完全一样。",
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
     "text_ref": "被杀、断档、连不上怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/icons/沙漏.png",
      "_library/icons/梳理乱线.png",
      "_library/icons/文件夹.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/手机.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/icons/断线.png",
      "_library/icons/白纸.png"
     ],
     "text_ref": "被系统杀掉或冻住",
     "item_count": 10
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "被杀、断档、连不上怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/icons/沙漏.png",
      "_library/icons/梳理乱线.png",
      "_library/icons/文件夹.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/手机.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/icons/断线.png",
      "_library/icons/白纸.png"
     ],
     "text_ref": "被系统杀掉或冻住",
     "item_count": 10
    }
   ]
  }
 },
 "images": []
}
```

# 被杀、断档、连不上怎么办

**被系统杀掉或冻住**
已经写下的不会丢：每次追加都先落盘，断点只在一段事件全部写好后才往前走。下次醒来从断点往前多查 2 分钟接着补，重复的按整条记录去掉。

**停得太久，系统也没留**
系统能留多久的使用事件，随手机系统而变。App 第一次查到非空结果时，记下那一次拿到的最早时间：这只是当时观测到的下限，不会随日历变长，也不是完整的保留期。过期了或从没采到的补不回来，就记成缺口，按“确定没采到”“可能已过期”“说不准”三档写明，不补猜。另外，App 自己读不到双开空间（第二个微信）的系统使用事件。10 月 31 日起，电脑每次收取连上手机时，距上次成功满 2 小时就另读一次双开空间最近 24 小时的事件，单独交给理解库；连不上或没读到的时段，仍不能当作没用。

**一次返回太多**
每段最多查 6 小时；返回满 2 万条就对半拆开重查。拆到 1 分钟以内还是满的，保存已经拿到的，再记一条“查询到上限”的缺口。

**存储一时写不进去**
没有文件权限或存储还没准备好时，运行、退出记录和 0.1.17 起新收到的定位先存进 App 自己的保护目录，恢复后按原时间补写出去。这段时间没采的使用事件和装机清单，不拿内部数据冒充。但卸载 App 或清除它的数据，会把还没导出的这些内部记录一起删掉；之后共享存储恢复了，也找不回来。

**定位很久没更新**
平时请系统定位服务约每 15 分钟送点，实际可能延迟；采集运行时若距上次写入已满 31 分钟，才尝试一次最长 60 秒的单次定位。请求开始前的旧缓存位置不收。0.1.13 起，状态里另存最近 48 批送点的判定证据（不含坐标）：每批记下什么时候收到、带了几个点、每个点是写进去了，还是不合法、时间没更新、没到 10 分钟被跳过或保存失败。夜里空了一段，先看这里分清是系统根本没送点，还是送到了却没写进去；这份证据本身出错也不影响正常采集。它只用来查原因，不能拿来说夜间空档已经修好。0.1.19 起，同一次开机里改用不受改时间影响的系统时钟判断新旧和间隔，不再因为位置自带的时间和系统时间对不上，把新点当旧点跳过；这修的是一种具体误判，同样不证明夜里不再断。

**步数读不到或空了一段**
只算系统自己记的本机步数，别的应用写进去的只列名字、不算数。没给权限、后台或历史权限缺一项、手机系统版本不够、确认不了来源、读取出错，都写明原因；系统没返回的 15 分钟不当 0 步，系统明确给 0 才记 0。每次往回多读 24 小时，接住系统迟到或改过的数。没给历史权限时，最早只读到首次授权前 30 天。

**流量数字不全**
系统没保留的历史不补成 0，页面写“已有记录”并说明有缺口。还没做分卡初始化或某张卡读取失败，就在那张卡下写原因。Wi-Fi 包含局域网，无线调试也算在 Wi-Fi 里，不要重复相加。

**换手机**
同一时间只让一台手机采集：新手机开始采集后，关掉旧手机的采集。电脑上的数据按换机日期前后区分，不按设备区分。

**电脑没收到**
先分清是手机没产出、没连上，还是连上了没收到。不在家不算错误；开机或连上 Wi-Fi 时 MacroDroid 会自动重新打开无线调试，电脑按新端口找到手机再收。

**文件只传了一半**
最后一行只写了一半，电脑导入时先忽略，下次补齐再收；中间的坏行记成缺口，前后好的照收。开机还没解锁、系统查不出数据时，断点也不往前走。

::screen{#phone-collector-04 section="tech"}

```typeset
{
 "screen": {
  "id": "phone-collector-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题，标题下一行小标题“从叫醒到进理解库的一条链”。上半部一张从左到右的流程图，六个节点排成一行（圆角卡片，每张一个小水彩图标：一只小铃铛、一个循环数据库、一个地球、一支写字的笔和纸、手机和电脑连在一起、一个数据库），绿色箭头依次连起来；节点标题粗体，下面两三行小字。下半部左右两张说明卡：左边“东西放在哪”，右边“谁管哪一段”。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题、小标题；六步整宽上下排，箭头向下；两张说明卡上下排。字和横版完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "derived_as_of": "数字截至 2026 年 11 月 6 日"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "从叫醒到进理解库的一条链"
    },
    {
     "type": "flow",
     "columns": 6,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "arrow",
     "icons": [
      "_library/icons/铃铛.png",
      "_library/icons/数据库循环.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/文件写作.png",
      "_library/icons/手机电脑连接.png",
      "_library/hires-icons/数据库.png"
     ],
     "text_ref": "叫醒"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "底部两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "东西放在哪"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "底部两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "谁管哪一段"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "入口两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "入口和前提"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "入口两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "代码和契约怎么对应"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "证据两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "记录能说明什么、不能说明什么"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "证据两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "版本和证据分四层"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "center",
     "size": "medium",
     "text_ref": "从叫醒到进理解库的一条链"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "icons": [
      "_library/icons/铃铛.png",
      "_library/icons/数据库循环.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/文件写作.png",
      "_library/icons/手机电脑连接.png",
      "_library/hires-icons/数据库.png"
     ],
     "text_ref": "叫醒"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "东西放在哪"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "谁管哪一段"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "入口和前提"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "代码和契约怎么对应"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "记录能说明什么、不能说明什么"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "版本和证据分四层"
    }
   ]
  }
 },
 "images": []
}
```

# 它是怎么搭的

**从叫醒到进理解库的一条链**

1. **叫醒**｜JobScheduler 周期任务每 15 分钟请求一次；开机、首次解锁、App 更新时重新登记；MacroDroid 的“叫醒采集App”每小时第 05 分钟发一次 RUN 广播
2. **补拉使用事件**｜UsageStatsManager.queryEvents 从断点前 2 分钟查到这一轮开始；单段最长 6 小时，满 20000 条对半重查；每段同步落盘后才提交断点
3. **清单、步数和定位**｜装机清单和上一份不同才写新快照（带递增序号和 SHA-256）；完整采集和系统送点入口都回读 Health Connect 的本机系统步数：从上次结束点回退 24 小时，只提交闭合的 15 分钟桶，来源要动态确认，确认不了记 origin_unresolved，不加常驻和定时器；系统定位服务按 15 分钟请求经 PendingIntent 送点，满 10 分钟写一行；采集运行时距上次写入满 31 分钟才尝试单次后备；0.1.13 起每批送点在合法性过滤前记进 status.location.deliveryEvidence
4. **记下自己**｜每轮写 runs（触发方式、各步结果和耗时、与上一轮的间隔、被叫停的原因）和 exits（系统给的退出原因）；0.1.12 起另带最近 48 条调度事件；status.json 原子替换
5. **电脑收取**｜PCConfig 的计划任务 PCConfig Phone PersonalOS Pull 每 30 分钟经已配对的无线 adb 收手机的 PersonalOS 目录，核对后存进电脑的来源投递区；清理手机上已收文件是单独开关：新建任务默认只预演，现在这台电脑上已打开（11 月 4 日用 -Mode Status 只读核对）。只在收取没有错误时删已核验的候选：短信和通话留最近 10 份完整备份，其余数据满 7 天才删，删前再核电脑上的大小、哈希和手机指纹。连上手机时距上次成功满 2 小时，还另读非机主用户最近 24 小时的 dumpsys 事件（AdbUsageStats，理解库来源 phone.system.other_user_events），这不是 App 采的
6. **导入**｜AI 刷新手机来源时，个人理解库按内容 SHA-256 保全原件，事件、运行、装机清单、步数分四路导入（步数来源 phone.collector.steps，只读查询 phone-steps，可加 --intervals 看固定桶和缺口）；定位 CSV 给“去过哪”读；退出记录和状态文件只保全、不导入

**东西放在哪**
- 手机：PersonalOS/Collector/ 下 events、runs、exits、steps 按北京日期分文件，packages 按日期放快照，另有 status.json、state.json、steps-state.json；定位在 PersonalOS/Location/Collector/，一天一个 CSV；流量页的卡槽映射只在 App 私有 files/traffic-sims.json
- 电脑：本地个人资料目录的来源投递区（手机自动同步），不进 Git
- 代码：私有仓库 wlyaaaaa/phone-collector，Kotlin，只放代码和合成测试数据

**谁管哪一段**
- 这个 App：只做只有手机能做的——补拉使用事件、装机清单、定位、回读系统步数、显示本机流量、记自己的运行；另外按连接短暂把蓝牙转到手机本机调试端口，让电脑连不上 Wi-Fi 时也能用 adb，不碰采集文件
- 电脑配置（PCConfig）：每 30 分钟收文件；手机桥管通知、验证码和剪贴板，也查采集 App、短信备份和 MacroDroid 心跳新不新
- 个人理解库：刷新手机来源时导入，算手机用时，查去过哪、装了什么、手机步数；手机步数只补手表没戴或没电的时段，怎么合并归健康项目，这里不合并
- 现成 App：MacroDroid 定时叫醒、自动开无线调试；SMS Backup & Restore 备份短信和通话

**入口和前提**
- 构建：在仓库根跑 pwsh -NoProfile -File .\tools\Build-Collector.ps1 -TempRoot <临时父目录>，依次跑单元测试、lint，出 debug APK（app/build/outputs/apk/debug/app-debug.apk）；要本机 Gradle、JDK 21 和 Android SDK，专用临时目录用完送回收站
- 安装：pwsh -NoProfile -File .\tools\Install-Collector.ps1 -OutDir <新的输出目录>；前提是已经有上面的 debug APK、手机经 adb 在线（插线或已配对的无线调试都行，不强制 USB；未授权的设备仍要本人在手机上确认）。它装好、授权（含健康三项，手机拒绝时到 App“权限”卡手动开）、打开 App，等到这次新的 run.id 才取回 status.json，末尾 JSON 列出每步结果和失败原因
- 多台设备加 -Serial，-Apk 换别的包；-DryRun 只打印命令和汇总，不调用 adb、不碰手机；每次用新的输出目录，免得和上次的文件混在一起
- 只更新：同一脚本加 -UpdateOnly（-OutDir 仍要给，可带 -Serial、-Apk、-DryRun）。先确认 APK 包名是 cn.wly.collector、手机已装且只有一个 APK，adb install -r 后核对已装 APK 的 SHA-256；不重新授权、不动白名单、不打开 App。入口和分支已核对，还没有实际更新回执
- 流量分卡初始化：python -B tools/initialize_traffic_sims.py --work-dir <E 盘任务临时目录>。首次安装、换卡、调换卡槽或清除 App 数据后跑一次，真实卡身份不进电脑、源码和日志；日常查看不需要它
- 蓝牙调试转发：前提是电脑和手机已配对、电脑类设备建立蓝牙连接（耳机不触发）、有 BLUETOOTH_CONNECT 权限、手机本机 5555 调试端口已由电脑打开（手机重启后要重新开）。完整安装会授予这项权限，-UpdateOnly 不重新授权

**代码和契约怎么对应**
- 格式的唯一说明是 docs/data-format.md，下面每个组件对应其中一节
- CollectorRuntime.kt：周期任务、开机和 RUN 广播、调度事件 ↔「自身运行与退出」
- CollectorEngine.kt、CollectorLogic.kt：每轮各步、分段补拉、规范 JSON 去重、装机快照、退出记录、status ↔「原始使用事件与断点」「装机清单」「状态和电脑端导入」
- LocationSchedule.kt、LocationCollector.kt：系统送点和单次后备 ↔「状态和电脑端导入」的定位部分；0.1.19 起同次开机按单调时钟（elapsedRealtimeNanos）判断新旧和间隔，跨开机或缺这个时钟证据时才回退日历时间
- BluetoothBridge.kt：蓝牙转发，只接受已配对且加密的 RFCOMM（服务名 PCConfig ADB Bridge），把字节转到手机本机 127.0.0.1:5555，沿用 adb 自己的 RSA 授权；同一时刻只转发一个连接；首次 60 秒没人接入就退出，连接结束后再等 30 秒，没人重连或电脑蓝牙链路断开也退出。运行时是连接设备前台服务，挂一条低重要度通知；INTERNET 权限只用来连本机回环，不连外网
- JsonStore.kt：追加后落盘、临时文件原子替换 ↔「文件与提交规则」
- MainActivity.kt：两个页签的主页面；采集概览里“刷新”只读状态，“立即采集一次”才跑一轮
- StepCollector.kt、HealthPermissionsActivity.kt：Health Connect 回读、权限入口和用途说明 ↔「系统手机步数」
- TrafficReader.kt、TrafficPage.kt、TrafficDates.kt：流量统计页，NetworkStatsManager 按需读取 ↔ README「手机流量查看」
- app/src/test：14 个带 @Test 的测试文件分别对着上面的组件和页面截图（11 月 6 日静态数）

**记录能说明什么、不能说明什么**
- 15 分钟是请求周期，什么时候真跑由系统定，不保证准时；定位送点同样
- 退出记录来自系统有限的环形缓冲，只查本 App；进程被冻住不会留下退出记录；SIGKILL 不能一律当成厂商强杀
- 调度事件只留最近 48 条，更早的会被盖掉，缺事件不证明没发生；“线程完成”只表示执行结束，不代表采集成功
- 送点证据（0.1.13 起）同样只留最近 48 批，每批只记前 8 个点和省略数；每个点标 saved（写入）、invalid（不合法）、non_new（时间没更新）、interval_gate（没满 10 分钟）或 save_error（保存失败，只记错误类别不记正文），不含坐标；收到时刻是取得处理锁后开始处理的时刻，不是广播最早到达的时刻，跨重启的单调时间不能直接比；诊断失败不阻断采集，也不能据此宣称夜间空档已修复
- 步数缺口 steps=null 不是 0 步；系统扩展不足 22、无后台或历史权限都有明确结果，没实测授予结果不算通过
- 流量只有字节数和应用身份，认不出域名和内容；Wi-Fi 含局域网，UID 2000 的系统调试是 Wi-Fi 的子集，不重复相加；合成截图（docs/screenshots）不算真机验收
- 最大间隔只说明这段没有执行记录，可能是调度延迟、休眠、重启或冻结
- 保留范围（status 里由 probeTime、earliestTime 算出，带 retentionObservedAt）固定对应第一次非空探测，是下限，不随日历变长
- 桌面单元测试证明不了国产系统夜里的调度可靠性，要真机验收

**版本和证据分四层**
- 源码：build.gradle.kts 里 versionName 0.1.19（versionCode 20），提交 1fc61d5（北京时间 11 月 5 日 10:07，11 月 6 日 05:10 核对）
- 手机上实际装的版本：11 月 6 日 13:56 重读电脑已收状态：记录时间为 11 月 6 日 11:26:49，写着 0.1.19；这次没连手机，安装包身份和蓝牙授权都没有当场核过
- 测试：74 个 @Test 是 11 月 6 日 05:10 对源码的静态计数（10 月 22 日是 40 个），共 14 个测试文件，没有运行；项目里现存的测试结果只有 11 月 3 日 03:19 一个测试类的 5 个用例，不能代表这 74 个都通过
- 真机观察：换机时定下的 72 小时拔线观察和跨夜定位口径写在 PCConfig 换机清单里，没找到通过回执，不当作已验收；流量页的分卡初始化和真机读回也没有核实。蓝牙转发：11 月 5 日 04:20 的合并说明记了真机连通并核对序列号（关 Wi-Fi 时约 125KB/秒），厂商是否放行后台蓝牙广播启动临时前台服务仍要真机验收；11 月 6 日没有连手机重做

::screen{#phone-collector-05 section="tech"}

```typeset
{
 "screen": {
  "id": "phone-collector-05",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行，每张左边一个小水彩图标（一个开关、一块循环的硬盘、一只放大镜、一个工具箱、一台笔记本电脑、一部手机），右边粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；六张卡片一行一张上下排；三张大数字卡放在最下面，一行一张。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "design",
    "text": "为什么这样设计"
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
     "align": "left",
     "size": "large",
     "width": "64%",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/开关.png",
      "_library/icons/硬盘循环.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/笔记本电脑.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/icons/手机.png"
     ],
     "text_ref": "不常驻，靠系统唤醒和送点。",
     "item_count": 8
    },
    {
     "type": "stat_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/断链.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "0.1.19"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/开关.png",
      "_library/icons/硬盘循环.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/笔记本电脑.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/icons/手机.png"
     ],
     "text_ref": "不常驻，靠系统唤醒和送点。",
     "item_count": 8
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/断链.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "0.1.19"
    }
   ]
  }
 },
 "images": []
}
```

# 为什么这样设计

**不常驻，靠系统唤醒和送点。**
采集不开前台服务、不在通知栏挂图标，请系统约每 15 分钟叫醒一次，实际可能延迟；唯一例外是蓝牙转发：电脑经蓝牙连进来时短暂开一个前台服务、挂一条通知，连完就退出，和采集无关；定位请求交给系统定位服务持有，设计上不靠 App 进程一直活着；但 App 被杀或被冻住以后，系统还送不送点、隔多久送，由手机系统决定，跨夜表现还待真机验收。也不开 Device Owner：它和微信双开冲突。

**先落盘，再往前走。**
原始记录只追加、不改写；状态文件先写临时文件再整体替换。断点永远落在已写下的数据后面，宁可重查也不漏。

**没采到就说没采到。**
空值是“未知”，不是零，也不是“没发生”。缺口分档写下；电脑算手机用时，只把覆盖完整的那几天当可信。

**别人有的不自己写。**
先用现成 App（自动化用 MacroDroid，短信备份用 SMS Backup & Restore），再用开源代码，都没有才自己写最小一层。现成的在真机上不靠谱，才接手。

**电脑能做的不放手机。**
收文件、看别的工具在不在跑、电量、剩余空间、通知、剪贴板，都由电脑经无线调试来做；手机只做定位、补拉使用事件这类只有手机能做的事，外加让无线调试一直开着，以及电脑蓝牙连进来时短暂转发一下。

**看流量不多跑一个任务。**
流量统计不加后台采集：打开页面或切日期时才读系统接口，也不上传。电脑只在首次或换卡时帮着把卡槽对上一次，之后手机自己就能看。

**步数只算系统自己记的。**
不用计步器短读，也不把别的应用写进来的数算进去；来源确认不了就写明，不猜。宁可留一段缺口，也不把没数据当成 0 步。

**不挑品牌。**
只用安卓自带的能力和不挑品牌的应用；换手机只需重新配对、在新品牌里放行后台，再关掉旧手机的采集。只管安卓各品牌。

| **0.1.19** | **1 个** | **47 次** |
|---|---|---|
| 现行源码版本：Kotlin，最低 Android 11（API 30），目标 API 36 | 联网权限：只为蓝牙转发连手机本机的调试端口，不访问外网；采集的数据仍只经电脑收走 | 仓库提交，截至 11 月 6 日 05:10 |

::screen{#phone-collector-06 section="highlights"}

```typeset
{
 "screen": {
  "id": "phone-collector-06",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：左上标题，三张大卡片横排，每张上面一幅小水彩图标，卡片标题用大字，下面一段正文。图标：1 一个带对勾的盾牌；2 一个地球；3 一弯挂着齿轮的月亮。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；三张卡片一行一张上下排，每张图标在卡片上方。字和横版完全一样。",
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
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 3,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/月亮.png"
     ],
     "text_ref": "被杀几次，记录也不断。"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/月亮.png"
     ],
     "text_ref": "被杀几次，记录也不断。"
    }
   ]
  }
 },
 "images": []
}
```

# 亮点

**被杀几次，记录也不断。**
手机系统为了省电，常在后台把 App 停掉。这个 App 不靠一直活着：系统自己会记应用前后台的事件，它每次醒来从上次的断点接着往后查就行。查询区间往前多叠 2 分钟，重复的按整条记录的规范写法去掉；同一毫秒、不同通知渠道的两条也分得开。只要系统还留着，停了几小时也能整段补回来。

**定位不靠常驻，目标约半小时一个点。**
定位不靠 App 自己一直开着 GPS，而是向系统定位服务登记一个持续请求，由系统把点送上门。请求按 15 分钟登记，是为了抵消系统送点的延迟，目标约半小时一个点；实际可能延迟，跨夜稳不稳还待真机验收。采集运行时若距上次写入已满 31 分钟，才尝试一次单次定位。手机静止时，系统给同一位置换上新时间送来，也照常记下。

**夜里断了，有线索可查。**
每一轮都记下是谁叫醒的（周期、开机、解锁、更新、广播、手动）、每一步用了多久、离上一轮隔了多久、系统是不是中途把它叫停、为什么；系统给的退出记录也按原因存下。0.1.12 起再存最近 48 条调度事件（这部分尚待真机验收）。夜里出现空档时，把调度、运行、退出和电脑收取记录合起来缩小范围；记录缺失、被覆盖或系统没给原因的，就写未知，不硬归因。

::screen{#phone-collector-07 section="features"}

```typeset
{
 "screen": {
  "id": "phone-collector-07",
  "section": "features",
  "title": "全部功能",
  "scene": "横版：和标杆页“全部功能”一样的画法：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；三组依次往下排。每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态。顶上标题，标题下一行图例，图例下一行小字。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题、图例和说明在上；组名在上，卡片一行一张。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-collect",
    "text": "采集"
   },
   {
    "id": "f-usage",
    "text": "补拉系统使用事件"
   },
   {
    "id": "f-packages",
    "text": "装机清单快照"
   },
   {
    "id": "f-location",
    "text": "系统送点定位"
   },
   {
    "id": "f-location-fallback",
    "text": "单次定位后备"
   },
   {
    "id": "g-handoff",
    "text": "交给电脑"
   },
   {
    "id": "f-files",
    "text": "按日文件只追加"
   },
   {
    "id": "f-pull",
    "text": "电脑定时收取"
   },
   {
    "id": "f-import",
    "text": "理解库导入"
   },
   {
    "id": "f-install",
    "text": "一条命令安装"
   },
   {
    "id": "g-keepalive",
    "text": "保活和自查"
   },
   {
    "id": "f-job",
    "text": "系统周期叫醒"
   },
   {
    "id": "f-kick",
    "text": "每小时推一下"
   },
   {
    "id": "f-adb",
    "text": "无线调试自动打开"
   },
   {
    "id": "f-pending",
    "text": "写不进先存内部"
   },
   {
    "id": "f-runs",
    "text": "运行和退出记录"
   },
   {
    "id": "f-scheduling",
    "text": "调度事件记录"
   },
   {
    "id": "f-status",
    "text": "采集概览页"
   },
   {
    "id": "f-health",
    "text": "电脑查新鲜度"
   },
   {
    "id": "f-steps",
    "text": "系统手机步数"
   },
   {
    "id": "f-other-user-events",
    "text": "电脑另读双开空间"
   },
   {
    "id": "f-update-only",
    "text": "只更新不重新授权"
   },
   {
    "id": "f-bt-bridge",
    "text": "蓝牙调试转发"
   },
   {
    "id": "g-view",
    "text": "手机上直接看"
   },
   {
    "id": "f-traffic",
    "text": "流量统计页"
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
     "align": "left",
     "size": "large",
     "row": "标题与图例",
     "width": "43%",
     "text_ref": "全部功能（21 项）"
    },
    {
     "type": "status_legend",
     "align": "left",
     "row": "标题与图例",
     "width": "55%",
     "text_ref": "图例："
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/数据库循环.png",
      "_library/icons/纸箱.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/秒表.png",
      "_library/icons/手机.png"
     ],
     "size": "medium",
     "text_ref": "采集",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/hires-icons/数据库.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/工具箱.png",
      "_library/icons/手机电脑连接.png"
     ],
     "size": "medium",
     "text_ref": "交给电脑",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/铃铛.png",
      "_library/icons/日历时钟.png",
      "_library/icons/插头.png",
      "_library/icons/硬盘循环.png",
      "_library/icons/文件写作.png",
      "_library/icons/月亮.png",
      "_library/icons/手机.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png"
     ],
     "size": "medium",
     "text_ref": "保活和自查",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机.png"
     ],
     "size": "medium",
     "text_ref": "手机上直接看",
     "fill_last_row": true
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（21 项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/数据库循环.png",
      "_library/icons/纸箱.png",
      "_library/round3/clean-assets/png/46-地球-clean.png",
      "_library/icons/秒表.png",
      "_library/icons/手机.png"
     ],
     "size": "medium",
     "text_ref": "采集"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/手机.png",
      "_library/hires-icons/数据库.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/工具箱.png",
      "_library/icons/手机电脑连接.png"
     ],
     "size": "medium",
     "text_ref": "交给电脑"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/铃铛.png",
      "_library/icons/日历时钟.png",
      "_library/icons/插头.png",
      "_library/icons/硬盘循环.png",
      "_library/icons/文件写作.png",
      "_library/icons/月亮.png",
      "_library/icons/手机.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png"
     ],
     "size": "medium",
     "text_ref": "保活和自查"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/手机.png"
     ],
     "size": "medium",
     "text_ref": "手机上直接看"
    }
   ]
  }
 },
 "images": []
}
```

# 全部功能（21 项）

图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
待验收＝做好了，还没在真实使用里验过；说不准＝用的时候不留记录，也没找到用过的痕迹。

**采集**
1. 补拉系统使用事件｜从断点接着查，分段、去重；系统没留的记成缺口｜在用
2. 装机清单快照｜有变化才写一份新快照，带序号和指纹；没变只记“无变化”｜在用
3. 系统送点定位｜请系统定位服务约每 15 分钟送点（实际可能延迟），距上次满 10 分钟才写一行｜在用
4. 单次定位后备｜采集运行时距上次满 31 分钟才尝试一次，最长 60 秒；不收旧缓存｜在用
5. 系统手机步数｜醒来时回读系统健康应用（Health Connect）记的本机步数，按 15 分钟一格存；读不到写原因，不当 0｜在用

**交给电脑**
6. 按日文件只追加｜产出放在手机的 PersonalOS 目录，按北京日期分文件，原始记录不改写｜在用
7. 电脑定时收取｜在家每 30 分钟经无线调试收一次；不在家先存在手机上｜在用
8. 电脑另读双开空间｜App 读不到双开空间（第二个微信）的使用事件；电脑连上手机时距上次成功满 2 小时另读最近 24 小时，单独交给理解库｜在用
9. 理解库导入｜AI 刷新手机来源时按指纹保全原件，事件、运行、装机清单、步数分四路导入｜在用
10. 一条命令安装｜手机连上电脑（插线或已配对的无线调试）后，一条命令装好、授权、打开，并取回第一轮状态｜在用
11. 只更新不重新授权｜已装好的手机只换新版：核对包名和装完的文件，不动权限、不打开 App｜待验收
21. 蓝牙调试转发｜电脑经蓝牙连进来时短暂转到手机本机调试端口，连完自己退出；要已配对的电脑、蓝牙连接权限和已打开的调试端口。只给 AI 按需取用，定时收取仍只走局域网或 USB。11 月 5 日真机连通过，手机现在的授权没有读回｜待验收

**保活和自查**
12. 系统周期叫醒｜每 15 分钟请求一次；开机、解锁、更新后重新登记｜在用
13. 每小时推一下｜MacroDroid 每小时发一次叫醒广播｜在用
14. 无线调试自动打开｜开机、连上 Wi-Fi 时 MacroDroid 自动打开，电脑按新端口找手机｜在用
15. 写不进先存内部｜共享存储不可写时，运行、退出和新收到的定位先存 App 内部，恢复后补写｜在用
16. 运行和退出记录｜每轮的触发方式、各步结果、间隔；系统给的退出原因｜在用
17. 调度事件记录｜最近 48 条叫醒和停止事件，查夜里的空档；0.1.13 起另存最近 48 批送点判定（不含坐标），分清系统没送点还是收到后没写进去｜待验收
18. 采集概览页｜最近一轮、补拉结果、近 24 小时实际运行次数和最长间隔、步数回读到哪、七项权限｜在用
19. 电脑查新鲜度｜手机桥健康检查：超过 2 小时没新文件算不新鲜｜在用

**手机上直接看**
20. 流量统计页｜按日、周、月看 Wi-Fi、SIM1、SIM2 的流量和全部应用，打开才读，不上传；分卡要电脑初始化一次｜待验收

::screen{#phone-collector-08 section="history"}

```typeset
{
 "screen": {
  "id": "phone-collector-08",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题，一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字。风格照标杆页（白底、清新亮绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；时间线一行一个节点上下排。字和横版完全一样。",
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
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": [
      "_library/icons/小旗.png",
      "_library/icons/手机.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/月亮.png",
      "_library/icons/文件写作.png"
     ],
     "width": "100%",
     "text_ref": "10 月 6—7 日",
     "direction": "vertical",
     "connector_style": "thin_line"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": [
      "_library/icons/小旗.png",
      "_library/icons/手机.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/月亮.png",
      "_library/icons/文件写作.png"
     ],
     "text_ref": "10 月 6—7 日",
     "direction": "vertical",
     "connector_style": "thin_line"
    }
   ]
  }
 },
 "images": []
}
```

# 演进

- **10 月 6—7 日**：做出第一版：手机上原来的使用记录软件保不住后台、时长不可信，改由自己从系统补拉使用事件；同时存装机清单、记自己的运行和被杀原因，带一页状态。当时还在手机上监视几款采集工具，产出由同步软件每小时传到云盘
- **10 月 13—14 日**：换到 vivo X500 Pro Max；发现周期任务有时会丢，加上登记和停止的诊断记录，App 回到前台时把周期任务补回来
- **10 月 19—20 日**：交接改成电脑在家经无线调试每 30 分钟收取，不再传云盘；定位由 App 接手，改成系统持续送点加单次后备；定下“电脑能做的不放手机”，不再在手机上监视别的工具，0.1.11 去掉短信验证码探针，不再要短信权限
- **10 月 21 日**：0.1.12 记下每次调度和执行的时间，用来查夜里为什么断；旧的小米 15 Pro 退役，旧手机的做法从项目里移走
- **10 月 22 日**：网站加上这一页，只讲做法，不放定位点、使用记录和装机清单
- **10 月 30 日**：0.1.13 另存最近 48 批送点判定证据，用来分清夜里是系统没送点，还是送到了没写进去；夜间空档还没验收
- **10 月 31 日**：开始存手机步数。先试手机计步器短读（0.1.14），当天换成回读 Health Connect 的本机系统步数（0.1.15），旧文件只留作历史；理解库多一路步数导入。电脑也开始另读双开空间的使用事件
- **11 月 2 日**：0.1.16 在 App 里加“流量统计”页，不用电脑也能看每张卡和每个应用的流量
- **11 月 4 日**：更新 App 可以不重新授权、不打开 App；系统删掉周期计划后能自己恢复
- **11 月 5 日**：电脑连不上手机的 Wi-Fi 时也能经蓝牙连进来，App 因此多了蓝牙和只连本机的网络权限，连接时多一条短暂通知；定时收取仍只走局域网或 USB。0.1.19 修了定位新旧误判，夜间空档还没验收

**11 月 4 日：写不进共享存储时，定位也先留住。**
0.1.17 起，新收到的定位先保存在 App 自己的保护目录，存储恢复后按原记录去重导出；这补的是临时写入故障，不证明跨夜空档已经消失。
