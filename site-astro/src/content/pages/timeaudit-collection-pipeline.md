---
{
 "title": "双节拍采集、两条前台管线与分区写入",
 "kind": "project",
 "url": "/projects/timeaudit/collection-pipeline/",
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
  "page": "timeaudit-collection-pipeline",
  "kind": "project",
  "title": "双节拍采集、两条前台管线与分区写入",
  "url": "/projects/timeaudit/collection-pipeline/",
  "parent": "timeaudit",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未重新验收整条采集链"
  },
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  }
 },
 "source": {
  "page": "sources/pages/timeaudit-collection-pipeline/page.json",
  "sha256": "6a27b1b572e33dd51f2c12dc51f9c11aed47121832d94313075babb9e8be50c6",
  "converted_at_beijing": "2026-10-31T13:58:52+08:00"
 }
}
---

::screen{#timeaudit-collection-pipeline-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-01",
  "section": "top",
  "title": "双节拍采集、两条前台管线与分区写入",
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
     "text_ref": "双节拍采集、两条前台管线与分区写入",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未重新验收整条采集链",
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
     "text_ref": "系统会把硬件、进程、前台和生命周期按合适节拍留底，并告诉我数据来自哪条管线、是否估算、哪里有空档。",
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
     "text_ref": "双节拍采集、两条前台管线与分区写入",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未重新验收整条采集链"
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
     "text_ref": "系统会把硬件、进程、前台和生命周期按合适节拍留底，并告诉我数据来自哪条管线、是否估算、哪里有空档。"
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
   "asset": "_library/illustrations/modules/timeaudit-collection-pipeline-v01.png",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "396c6d55be126a8d6389033ce495f3516e1a591ea2c38a437555c47ecb5e2717",
   "status": "ready"
  }
 ]
}
```

# 双节拍采集、两条前台管线与分区写入

〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕

TimeAudit · 功能说明

系统会把硬件、进程、前台和生命周期按合适节拍留底，并告诉我数据来自哪条管线、是否估算、哪里有空档。

**当前情况：**10 月 12 日 05:21—05:36 这 15 分钟记满 900 条硬件样本，相邻两条最长只隔 1.0 秒，没有采集空档；10 月 11 日 22:00—23:00 那一小时也记满 3600 条，更早 13:00—14:00 那一小时的 95 秒缺采照旧算作历史缺采。本轮没有重新验收整条采集链，缺采不能算作正常或睡眠。

项目源码：公开仓库

::screen{#timeaudit-collection-pipeline-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 电脑指标、程序活动和窗口使用记录的速度不同，硬塞在一条处理线上会互相拖慢。这里分别记录，再按时间合起来看，睡眠和断线不会被编造成持续使用。 举个实际例子 我合盖睡了两小时再回来，时间线会把这段"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 电脑指标、程序活动和窗口使用记录的速度不同，硬塞在一条处理线上会互相拖慢。这里分别记录，再按时间合起来看，睡眠和断线不会被编造成持续使用。 举个实际例子 我合盖睡了两小时再回来，时间线会把这段"
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

电脑指标、程序活动和窗口使用记录的速度不同，硬塞在一条处理线上会互相拖慢。这里分别记录，再按时间合起来看，睡眠和断线不会被编造成持续使用。

## 举个实际例子

我合盖睡了两小时再回来，时间线会把这段明确记成睡眠，网络速率也从醒来后的新起点继续；屏幕上不会凭空多出两小时“持续使用”或一根吓人的假尖刺。

## 最后我会得到什么

得到按时间回看的硬件、程序、前台使用和睡眠记录；每一类都说明更新到什么时候、是否有空档。

::screen{#timeaudit-collection-pipeline-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-03",
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

相应记录持续保存时，按时间给出可对照的活动和硬件变化。

## 发现问题时

某个传感器或程序扫描失败时标明这一类缺口，其他仍能继续记录。

## 入口不可用或证据不足时

保存位置或必要权限不可用时停相应写入，不补造成功记录。

::screen{#timeaudit-collection-pipeline-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-04",
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
     "text_ref": "日常由已安装的 TimeAudit 自动采集；要理解一段记录，在 Grafana 选择时间范围或请已接入的 AI 说明覆盖。",
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
     "text_ref": "1. **确定这段时间**　先看机器是否开机、睡眠以及记录有没有中断。",
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
     "text_ref": "日常由已安装的 TimeAudit 自动采集；要理解一段记录，在 Grafana 选择时间范围或请已接入的 AI 说明覆盖。"
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
     "text_ref": "1. **确定这段时间**　先看机器是否开机、睡眠以及记录有没有中断。",
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

日常由已安装的 TimeAudit 自动采集；要理解一段记录，在 Grafana 选择时间范围或请已接入的 AI 说明覆盖。

## 需要准备什么

- 目标日期与时间段

- 要看硬件、前台或进程活动

## 从开始到拿到结果

1. **确定这段时间**　先看机器是否开机、睡眠以及记录有没有中断。

2. **读取对应记录**　系统分别采集快速指标和较慢的进程信息，按来源写入，不把两条前台管线重复相加。

3. **交回有边界的时间线**　看到真实覆盖和缺口；探针失败留空，睡眠回来从新起点算，不制造连续使用或网速尖刺。

::screen{#timeaudit-collection-pipeline-05 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 8月31日001cee0全链健康21/21保留；9月8日e5459ce已部署采集worker并验证180个新GPU样本，未重验全部链路 关键规则与设计选择 1 先分清 "
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 8月31日001cee0全链健康21/21保留；9月8日e5459ce已部署采集worker并验证180个新GPU样本，未重验全部链路 关键规则与设计选择 1 先分清 "
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
     "text_ref": "1. 先分清 AHK 区间与 Python 全量遥测，避免查错表。",
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
     "text_ref": "1. 先分清 AHK 区间与 Python 全量遥测，避免查错表。",
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

8 月 31 日 001cee0 全链健康 21/21、9 月 8 日 e5459ce 采集 worker 换代保留原日期；10 月 12 日 05:21—05:36 共 900 条硬件样本、单一采集实例、无采集空档（10 月 11 日 22:00—23:00 的 3600 条、13:00—14:00 的 3412 条与 95 秒空档保留为历史）；未重验全部链路

## 关键规则与设计选择

1. 先分清 AHK 区间与 Python 全量遥测，避免查错表。

2. 慢扫描不阻塞 1 秒快车道；未完成就跳拍。

3. 睡眠用墙上时间，速率用单调时间；只有 Windows 挂起事件才算睡眠，时钟跳变或延迟记为采集空档。

4. 分区预热和时间下界支持长期查询。

## 当前怎样实现

- Python 主调度程序建立连接池、单例与双节拍（硬件 1 秒、进程约 3 秒）；慢车道在线程中单飞。

- 四个 worker 各管前台、进程、硬件和生灭。

- AHK 写不可变的 UTF8 CSV 段（先临时写入、flush，再原子改名成 .processing），ingest.py 事务入库并按内容去重，提交后才删源段；写失败不推进水位，待写队列有上限，满了就转成明确的未知区间。正常约 30 秒封一段，突然断电可能丢掉当前未封的那段。

- schema.sql 定义维度、事实、周/月分区、索引与约束。

::screen{#timeaudit-collection-pipeline-06 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-06",
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
     "text_ref": "- 另有一条串行的后台维护车道，每 12 小时一次，不阻塞每秒采样；逐程序明细保留 60 天后汇总，其他事实默认 1200 天，详见安装与恢复页。",
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
     "text_ref": "- 另有一条串行的后台维护车道，每 12 小时一次，不阻塞每秒采样；逐程序明细保留 60 天后汇总，其他事实默认 1200 天，详见安装与恢复页。",
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

- 另有一条串行的后台维护车道，每 12 小时一次，不阻塞每秒采样；逐程序明细保留 60 天后汇总，其他事实默认 1200 天，详见安装与恢复页。

- 硬件采样用单调时钟截止点，提前唤醒继续等待，慢处理跳过错过时隙而不追赶堆积；Windows 互斥必须真实创建并取得，失败不准第二采集器启动。新行增加可空 measurement_quality、collector_instance_id、collector_sample_seq，不重写旧行。

## 执行流程

1. 启动单例、闭合旧会话并确认分区。

2. 每 1 秒采硬件、FPS、前台与生命周期。

3. 每约 3 秒在线程中扫描活跃进程。

4. 批量写库并更新 heartbeat。

5. AHK spool 事务成功后删除源段。

::screen{#timeaudit-collection-pipeline-07 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-07",
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
| fast / slow lane | 高频硬件路径与昂贵进程扫描分开调度。 |
| interval event（区间事件） | 有开始和持续时间的前台、暂离或睡眠记录。 |
| partition pruning（分区裁剪） | 按时间下界只扫需要的周/月分区。 |

## 专业定义

用 1 秒硬件/FPS 快车道、3 秒进程慢车道和独立 AHK 区间管线，把不同频率与语义的数据写入 PostgreSQL，并保留来源、空值、睡眠和重试边界。

::screen{#timeaudit-collection-pipeline-08 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-08",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 两条管线用途不同，不合成一张模糊总表。",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 两条管线用途不同，不合成一张模糊总表。",
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

解决什么

解决阻塞、重复实例、跨睡眠脏会话、对时假尖刺、spool 重放、缺分区和双管线口径混淆。

## 边界

- 两条管线用途不同，不合成一张模糊总表。

- 网络按连接占比估算，不是抓包精确归因。

- 探针失败允许字段为空，不造连续真值。

## 失败与恢复

- **进程扫描超时**：跳过下一慢拍，不阻塞快车道。

- **数据库连接失效**：限时关闭连接池，超时 terminate 后退避重连。

- **spool 入库失败**：保留源段重试，事务成功后才删除。

::screen{#timeaudit-collection-pipeline-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-09",
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
     "text_ref": "- 调度、连接、睡眠与分区（main.py）",
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
     "text_ref": "- 调度、连接、睡眠与分区（main.py）",
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

- 调度、连接、睡眠与分区（main.py）

- 前台会话（context_worker.py）

- 进程资源（activity_worker.py）

- 硬件与 FPS（hardware_worker.py）

- 进程生灭（lifecycle_worker.py）

- 简版使用区间（TimeAudit.ahk）

- spool 入库（ingest.py）

- 表、分区与索引（schema.sql）

::screen{#timeaudit-collection-pipeline-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-collection-pipeline-10",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "下一个模块 硬件与流畅度",
    "href": "/projects/timeaudit/hardware-performance/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "text_ref": "runtime（运行环境）hardening与ingestresilience纳入001cee0的182项+11个子测试完整通过结果（2026-08-31，之后未重新运行；当前源码有356个以test",
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
     "text_ref": "runtime（运行环境）hardening与ingestresilience纳入001cee0的182项+11个子测试完整通过结果（2026-08-31，之后未重新运行；当前源码有356个以test",
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

## 如何验证

- runtime（运行环境）hardening 与 ingest resilience 纳入 001cee0 的 182 项 + 11 个子测试完整通过结果（2026-08-31，之后未重新运行；当前源码有 356 个以 test_ 开头的测试函数，这次没有运行）。

- 2026-10-12 05:36 只读汇总 05:21:10—05:36:10（15 分钟）：900 条硬件样本（900 个不同秒）、单一采集实例、0 条快速样本，最大间隔 1.033 秒；状态区间覆盖 899 秒、未覆盖 1 秒，采集空档 0、跨状态重叠 0。10 月 11 日 23:54 汇总的 22:00—23:00 为 3600 条、最大间隔 1.069 秒，16:33 汇总的 13:00—14:00 曾有 95 秒明确采集空档，均保留为历史。

- 未读原始表、未跑完整数据库审计，当前全库精确条数未统计，故保持 mixed。

## 与其他模块的关系

为其他模块提供可信时间轴；可靠性监管它，恢复模块保存它。
