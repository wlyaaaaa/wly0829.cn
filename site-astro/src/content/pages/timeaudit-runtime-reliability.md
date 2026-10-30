---
{
 "title": "单例、心跳、看门狗与长期运行不变量",
 "kind": "project",
 "url": "/projects/timeaudit/runtime-reliability/",
 "tagline": "",
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
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "timeaudit-runtime-reliability",
  "kind": "project",
  "title": "单例、心跳、看门狗与长期运行不变量",
  "url": "/projects/timeaudit/runtime-reliability/",
  "parent": "timeaudit",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "源码为 10 月 29 日 14:24 的合并 91b7ba0（含 14:06 的个人活动读取分阶段诊断 f62b807；10 月 30 日回读，与远端一致）；Docker 停止自愈 6dea0bf 与读取超时修复 5cb3ea9 为 10 月 20 日加入；10 月 20 日 07:35 三条心跳新鲜；10 月 12 日 05:36 完整健康检查正常；未注入故障、未运行测试"
  },
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  }
 },
 "source": {
  "page": "sources/pages/timeaudit-runtime-reliability/page.json",
  "sha256": "b9d9d8d0708ce5df3cdff3ca7e44d1a79ae9d4891831d542f68d5be59b78d779",
  "converted_at_beijing": "2026-10-30T13:04:19+08:00"
 }
}
---

::screen{#timeaudit-runtime-reliability-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-01",
  "section": "top",
  "title": "单例、心跳、看门狗与长期运行不变量",
  "links": [
   {
    "text": "回到项目 → 电脑使用与性能记录",
    "href": "/projects/timeaudit/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/TimeAudit"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/timeaudit/#ai-brief"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "单例、心跳、看门狗与长期运行不变量",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 12 日 · 源码为 10 月 29 日 14:24 的合并 91b7ba0（含 14:06 的个人活动读取分阶段诊断 f62b807；10 月 30 日回读，与远端一致）；Docker 停止自愈 6dea0bf 与读取超时修复 5cb3ea9 为 10 月 20 日加入；10 月 20 日 07:35 三条心跳新鲜；10 月 12 日 05:36 完整健康检查正常；未注入故障、未运行测试",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "系统不因进程仍显示Running就假定它工作，而以最近成功写入判断真假健康。看门狗每分钟先查数据库和看板依赖，再查各条采集链，只恢复确认出问题的那一条；它依赖的Docker只有在明确显示“已停止”连续",
     "row": "top"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "top",
     "width": "42%",
     "align": "center"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "单例、心跳、看门狗与长期运行不变量",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 12 日 · 源码为 10 月 29 日 14:24 的合并 91b7ba0（含 14:06 的个人活动读取分阶段诊断 f62b807；10 月 30 日回读，与远端一致）；Docker 停止自愈 6dea0bf 与读取超时修复 5cb3ea9 为 10 月 20 日加入；10 月 20 日 07:35 三条心跳新鲜；10 月 12 日 05:36 完整健康检查正常；未注入故障、未运行测试"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "系统不因进程仍显示Running就假定它工作，而以最近成功写入判断真假健康。看门狗每分钟先查数据库和看板依赖，再查各条采集链，只恢复确认出问题的那一条；它依赖的Docker只有在明确显示“已停止”连续"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center"
    }
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "asset": "_library/illustrations/modules/timeaudit-runtime-reliability-v02.png",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "7eb7736a585a89b621f904fb1a363467f44a78e0c20f261aabd534eb5080620b",
   "status": "ready"
  }
 ]
}
```

# 单例、心跳、看门狗与长期运行不变量

〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕

TimeAudit · 功能说明

系统不因进程仍显示 Running 就假定它工作，而以最近成功写入判断真假健康。看门狗每分钟先查数据库和看板依赖，再查各条采集链，只恢复确认出问题的那一条；它依赖的 Docker 只有在明确显示“已停止”连续满 10 分钟后，才尝试一次有时限的恢复；它还顺带最多每 10 分钟写一份“今日用电”回执，供驾驶舱显示。

**当前情况：**10 月 12 日 05:36 的完整健康检查里，各组件仍全部正常，没有待写积压、写入失败或采集错误；05:39 看门狗也回报正常、没有降级组件。这次没有注入故障或重验全部恢复路径。10 月 20 日凌晨新加的 Docker 停止自愈还没有真实演练过；10 月 20 日 07:35 三条心跳仍新鲜，只说明当时在线。

项目源码：公开仓库

::screen{#timeaudit-runtime-reliability-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 采集程序可能真的退出，也可能还挂在任务列表里却不写数据。只看进程在不在，会留下看不见的记录空档；恢复还得避免同时启动两份。 举个实际例子 大盘突然停住，但任务列表里的采集进程还在。系统会看最后"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 采集程序可能真的退出，也可能还挂在任务列表里却不写数据。只看进程在不在，会留下看不见的记录空档；恢复还得避免同时启动两份。 举个实际例子 大盘突然停住，但任务列表里的采集进程还在。系统会看最后"
   },
   {
    "id": "module-product-title",
    "text": "这项功能怎样使用"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "key": "灯泡",
   "source_phrase": "冻结页迁移固定图标：why",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/双气泡.png",
   "key": "双气泡",
   "source_phrase": "冻结页迁移固定图标：example",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "key": "纸箱对勾",
   "source_phrase": "冻结页迁移固定图标：result",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

## 为什么需要它

采集程序可能真的退出，也可能还挂在任务列表里却不写数据。只看进程在不在，会留下看不见的记录空档；恢复还得避免同时启动两份。

## 举个实际例子

大盘突然停住，但任务列表里的采集进程还在。系统会看最后一次真正写入是什么时候；确认主采集已经“人还在、活不干了”后，只重启这一条，其他仍在正常记录的组件不跟着折腾。

## 最后我会得到什么

看到哪一条记录链还在写、哪一条停住、系统是否已尝试恢复，以及失败时还缺什么。重新启动后缺失的历史仍是缺口，不会被填成正常。

::screen{#timeaudit-runtime-reliability-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-03",
  "section": "usage",
  "title": "结果怎么看",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 结果怎么看

## 正常时

对应程序真正持续写入，而且它依赖的数据库和看板服务也可用时，才说这条链活着。

## 发现问题时

程序退出或假活时只恢复确认故障的部分，保留失败原因；依赖探测超时或读不出状态只记“引擎状态未知、下轮重试”，这本身不算重启的理由。只有 Docker Desktop 连续 10 分钟明确报告“已停止”，才尝试一次有时限的官方重启；还不行才只结束 Docker 自己安装目录里的进程，再走原有的开机任务。同一次故障只试这一回，不反复重启。

## 入口不可用或证据不足时

自动任务或保存服务读不到时只说对应层未知，不拿其他组件仍在运行代替。

::screen{#timeaudit-runtime-reliability-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-04",
  "section": "usage",
  "title": "从哪里开始",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "TimeAudit 大盘停止更新时，在已接入本机诊断的 AI 对话中说明最后正常时间；现有看门狗负责精确组件恢复。",
     "row": "start",
     "width": "40%"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "row": "start",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "row": "start",
     "width": "60%",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **先查最后真实写入**　不要只看任务管理器里的进程，核对心跳和数据新鲜度。",
     "row": "start",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "TimeAudit 大盘停止更新时，在已接入本机诊断的 AI 对话中说明最后正常时间；现有看门狗负责精确组件恢复。"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **先查最后真实写入**　不要只看任务管理器里的进程，核对心跳和数据新鲜度。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "key": "工具箱",
   "source_phrase": "冻结页迁移固定图标：inputs",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/scene-r3-exact-three-stairs.png",
   "key": "上升台阶",
   "source_phrase": "冻结页迁移固定图标：steps",
   "sha256": "b2d695badac77b03b32249a3a6f83eaf9888916136a8657c0f6845b726f4f5a2",
   "status": "ready"
  }
 ]
}
```

## 从哪里开始

TimeAudit 大盘停止更新时，在已接入本机诊断的 AI 对话中说明最后正常时间；现有看门狗负责精确组件恢复。

## 需要准备什么

- 停更时间

- 受影响的是采集、入库还是大盘

## 从开始到拿到结果

1. **先查最后真实写入**　不要只看任务管理器里的进程，核对心跳和数据新鲜度。

2. **定位失效组件**　看门狗区分启动、睡眠宽限和真停写，只恢复确认异常的一条链。

3. **验证恢复**　回读新心跳与入库；恢复后的在线状态不填补过去空档，也不证明历史值都正确。

::screen{#timeaudit-runtime-reliability-05 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 8月31日容器/LHM/全链测试与9月8日受管换代180个GPU有效样本保留原日期；2026-09-14只读摘要新鲜，本轮未换代或注入故障 关键规则与设计选择 1 健康"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 8月31日容器/LHM/全链测试与9月8日受管换代180个GPU有效样本保留原日期；2026-09-14只读摘要新鲜，本轮未换代或注入故障 关键规则与设计选择 1 健康"
   },
   {
    "id": "module-technical-title",
    "text": "技术实现与依据"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "prose",
     "text_ref": "这里保留实现、关键条件、精确入口、历史记录和验证结果。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 健康由成功推进证明，不由进程名决定。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "prose",
     "text_ref": "这里保留实现、关键条件、精确入口、历史记录和验证结果。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 健康由成功推进证明，不由进程名决定。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/打勾清单.png",
   "key": "打勾清单",
   "source_phrase": "冻结页迁移固定图标：rules",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  }
 ]
}
```

## 技术实现与依据（一）

这里保留实现、关键条件、精确入口、历史记录和验证结果。

8 月 31 日容器/LHM/全链测试与 9 月 8 日受管换代保留原日期；本轮未换代或注入故障；10 月 20 日加入的 Docker 停止自愈未演练

## 关键规则与设计选择

1. 健康由成功推进证明，不由进程名决定。

2. 恢复串行，睡眠后先宽限。

3. 只恢复精确组件，不结束未知同名进程。

4. 前台采集必须在交互会话运行。

## 当前怎样实现

- Python 主调度程序提供单例与外层异常恢复。

- runtime_health.py 原子写 heartbeat，并提供路径识别与有界退避辅助。

- telemetry_watchdog.ps1 每分钟串行检查，先看 Docker、数据库和 Grafana 依赖，再看 main.py、LHM 18085、AHK 与 audit-ingester；全局 mutex（互斥锁）阻止恢复重叠。Docker Desktop 整个退出时只调用现有的自动启动任务 TimeAudit_AutoStart，任务正在启动就不重复。Desktop 还在、引擎接口却不可用时，只有 `docker desktop status --format json` 成功返回且 Status=stopped，才开始计 600 秒（10 分钟）的确认窗；探测失败、超时、格式不对或其他状态都会清零重算，两次观测间隔超过 3 分钟也重算。确认窗和“已尝试”标记存在 `log/docker_engine_recovery.json`，这份回执读不出就暂缓恢复。连续确认满 10 分钟后，先记下这次尝试，再执行一次官方 `desktop restart --timeout 110`，总时限 120 秒；重启成功或接口随后恢复，就不结束任何进程。重启失败、接口仍不可用、且新一轮状态探测仍明确为 stopped，才只结束可执行路径在 Docker 安装目录里的 Docker Desktop.exe、com.docker.backend.exe、com.docker.build.exe、docker-desktop.exe，再调用现有自动启动任务；自动启动任务正在运行或不存在时暂缓。同一次未解决的故障不重复重启或兜底，接口恢复健康才清掉标记（提交 6dea0bf，北京时间 10 月 20 日 00:58 提交、01:05 合入 main）。停掉的 Postgres/Grafana 容器可以启动、不重建数据；Grafana 有 120 秒启动宽限，15 秒复核仍失败才只重启 Grafana。Docker 引擎探测限时 8 秒。另外，个人活动读取遇到 Docker 子进程超过 25 秒，直接报 `docker_unavailable`（Docker 不可用），不再把时间段拆小反复重试；只有数据库语句超时（`query_timeout`）或输出过大才缩小时间段（提交 5cb3ea9，北京时间 10 月 20 日 00:08）。10 月 29 日起（提交 f62b807），个人活动读取的每条只读语句锁等待从 1 秒放宽到 5 秒；仍失败时保留原原因码，另附分阶段诊断：卡在 `docker_exec`、`connection`、`lock_wait`、`execute_sql` 还是 `serialization`，异常类型，以及经凭据清理、最多 1200 字的消息；psql 非零退出再带 SQLSTATE、退出码、查询窗口和查询类别，不回传原始行或 SQL 上下文。没取到的数据不当作空集，也不因此重启采集器。

- 主采集心跳 90 秒算陈旧，睡醒后宽限 45 秒，启动宽限 180 秒，自动启动等待 240 秒；入库心跳阈值 45 秒、辅助进程 15 秒。LHM 独立任务拥有运行实例，hardware worker 只读，看门狗经 15 秒宽限、20 秒启动等待、端点 3 秒超时和精确项目路径过滤恢复端点。

::screen{#timeaudit-runtime-reliability-06 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-06",
  "section": "tech",
  "title": "技术实现与依据（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- start_all.bat 固定 CRLF、WorkingDirectory 和项目 `.venv` 里的 pythonw.exe（从 Python 3.11 基座重建，当前 3.11.9）；保留已有的精确 AHK 实例，容器用 `up -d --no-recreate` 启动，配置变更要另行部署，不靠重启自动套用。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- start_all.bat 固定 CRLF、WorkingDirectory 和项目 `.venv` 里的 pythonw.exe（从 Python 3.11 基座重建，当前 3.11.9）；保留已有的精确 AHK 实例，容器用 `up -d --no-recreate` 启动，配置变更要另行部署，不靠重启自动套用。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（二）

- start_all.bat 固定 CRLF、WorkingDirectory 和项目 `.venv` 里的 pythonw.exe（从 Python 3.11 基座重建，当前 3.11.9）；保留已有的精确 AHK 实例，容器用 `up -d --no-recreate` 启动，配置变更要另行部署，不靠重启自动套用。

- 历史诊断 summary 只做有界聚合：数据库语句 12 秒、锁 1 秒，外层总超时 14 秒，输出上限 1 MiB，最长 168 小时，拒绝畸形、非有限或意外字段。原先给电脑配置项目的异常摘要 v2（连续观测、游标和待重查标记）已于 2026-09-29 删除，不再运行。

- 看门狗最多每 10 分钟用现有数据库容器只读查询一次，按北京时间切今天和昨天，写 CPU 封装与显卡板功率积分的用电回执；采样间隔 60 秒以上不累计。回执写失败不改变恢复结果和退出码，也不另起采集进程。

- GUI 状态、AI 健康与看门狗读同一个 timeaudit_health.py；core-only 排除备份、黑匣子和上一次守护结果，避免递归。exit 2 可以是有效的 degraded/unavailable，心跳、实际持久写入和最后守护结果分开判断；可选两秒开销统计只看精确主采集链子进程，不含独立传感器、Docker 与原生记录，RSS 相加不是独占内存。

## 执行流程

1. 在 Windows 交互用户会话中启动主程序，非管理员时由现有入口自动隐藏提权，保留原 Python 和参数；start_all.bat 通过 Start-ElevatedEngine.ps1 启动。

::screen{#timeaudit-runtime-reliability-07 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-07",
  "section": "tech",
  "title": "技术实现与依据（三）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "2. 成功循环/事务写 heartbeat。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "2. 成功循环/事务写 heartbeat。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（三）

2. 成功循环/事务写 heartbeat。

3. 看门狗先查 Docker、数据库和看板依赖，再查身份、心跳、端点和启动/睡眠宽限。

4. 异常只恢复目标；互斥、任务 IgnoreNew、探测超时、宽限和执行上限共同约束恢复，效果没确认的留到下一轮再查。

5. 以新 heartbeat 验证恢复。

::screen{#timeaudit-runtime-reliability-08 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-08",
  "section": "tech",
  "title": "名词和入口",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| native crash（原生崩溃） | C 扩展访问冲突直接终止进程，Python 异常捕获无效。 |
| false alive（假活） | 进程仍在但采集/入库停止。 |
| bounded backoff（有界退避） | 连续失败延长重试并设上限。 |

## 专业定义

用单例、无 payload heartbeat、外部 Watchdog、退避、睡眠宽限和精确身份，把 native 崩溃、假活、探针掉线与数据库重连限制在受影响组件。

::screen{#timeaudit-runtime-reliability-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-09",
  "section": "tech",
  "title": "出问题时",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "看门狗只恢复TimeAudit精确组件；对共享的Docker，只在明确停止连续10分钟后做一次有时限的官方重启，失败才只结束Docker安装目录里的四类进程并走原有开机任务，同一次故障不重复。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "看门狗只恢复TimeAudit精确组件；对共享的Docker，只在明确停止连续10分钟后做一次有时限的官方重启，失败才只结束Docker安装目录里的四类进程并走原有开机任务，同一次故障不重复。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时

## 边界

- 看门狗只恢复 TimeAudit 精确组件；对共享的 Docker，只在明确停止连续 10 分钟后做一次有时限的官方重启，失败才只结束 Docker 安装目录里的四类进程并走原有开机任务，同一次故障不重复。

- heartbeat 不含采样值、窗口、进程或凭据。

- 在线不证明数据正确或历史无空档；进程在跑、任务结果 0 或 core-only 正常都不等于全量恢复已验收。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| native 崩溃或假活 | 陈旧 heartbeat 触发精确重启。 |
| LHM 持续故障 | worker 保持只读并留空；看门狗在端点宽限后只结束项目路径的有线程实例，再调用独立 LHM 任务并限时等待 18085。 |
| 计划任务环境不全 | 使用绝对解释器、工作目录与 PATH bootstrap。 |
| Docker 状态探测超时或读不出 | 记“引擎状态未知，下轮重试”，并把 10 分钟确认窗清零；超时本身不触发重启。 |
| Docker 明确停止满 10 分钟 | 先记下尝试，再执行一次限时 120 秒的官方重启；仍停止才结束 Docker 安装目录里的四类进程并调用原有开机任务；同一次故障不再试，接口恢复后才允许下次。 |
| 个人活动读取等锁超过 5 秒或查询失败 | 交回原因码和卡住的阶段；没读到的时段不当空记录，不重启采集器。 |

::screen{#timeaudit-runtime-reliability-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-10",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 主循环、重连与心跳",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 主循环、重连与心跳",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（一）

## 真实入口

- 主循环、重连与心跳

- 心跳与退避

- 外部恢复

- 启动顺序与绝对路径

- 运行回归

- 入库恢复回归

## 如何验证

- 8 月 31 日基线：三条 heartbeat 新鲜、3 容器运行、ingester healthy、LHM 18085 返回 HTTP 200、看门狗结果 0；10 月 12 日 05:36 完整健康检查仍全部 healthy，待写事件、字符、文件、字节都是 0，写入失败、溢出、捕获错误都是 0，FPS 采集 active、GPU 热点仍 unsupported；05:39 看门狗回执 healthy、没有降级组件，任务结果 0。这只是当时的运行快照，没有注入故障，不等于自愈路径已端到端验收。

- 8 月 31 日运行/入库回归纳入 001cee0 的 182 项 + 11 子测试，LHM/看门狗定向 10/10；9 月 8 日 e5459ce 另验证 39 项相关回归。之后未重新运行；当前源码有 345 个以 test_ 开头的测试函数，这次没有运行。

::screen{#timeaudit-runtime-reliability-11 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-runtime-reliability-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 时间与能耗",
    "href": "/projects/timeaudit/usage-energy/"
   },
   {
    "text": "下一个模块 剪贴板历史",
    "href": "/projects/timeaudit/clipboard-history/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 8 月 31 日的 hardware_worker 字节/进程时序与 LHM 单一活实例是历史证明；9 月 8 日 e5459ce 换代后的 worker 与新样本窗口另列，两个运行时代不能混用。9 月 17 日另有一次 231 条新合同样本、单实例的激活回执。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 8 月 31 日的 hardware_worker 字节/进程时序与 LHM 单一活实例是历史证明；9 月 8 日 e5459ce 换代后的 worker 与新样本窗口另列，两个运行时代不能混用。9 月 17 日另有一次 231 条新合同样本、单实例的激活回执。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（二）

- 8 月 31 日的 hardware_worker 字节/进程时序与 LHM 单一活实例是历史证明；9 月 8 日 e5459ce 换代后的 worker 与新样本窗口另列，两个运行时代不能混用。9 月 17 日另有一次 231 条新合同样本、单实例的激活回执。

- 8 月 31 日 21/21 只读健康没有做故障注入；9 月 8 日真实停止过旧采集 worker 并由看门狗恢复，但未阻断 LHM 18085、断库或模拟睡眠，其他恢复 E2E（端到端验证）仍缺。10 月 20 日加入的 Docker 停止自愈同样没有真实演练：本轮没有注入 Docker 故障，也没有运行测试。

## 与其他模块的关系

监管采集和探针持续性，顺带产出用电回执；备份模块处理持久恢复。
