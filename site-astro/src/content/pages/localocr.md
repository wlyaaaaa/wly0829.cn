---
{
 "title": "本地文字识别",
 "kind": "project",
 "url": "/projects/localocr/",
 "tagline": "在本机显卡上把图片和扫描件里的字读准、读全。",
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "usage",
   "label": "怎么用",
   "img": "/_shared/nav-unify-standard/nav-unify-label-43-9fe7ee9705.webp"
  },
  {
   "id": "tech",
   "label": "技术",
   "img": "/_shared/nav-unify-standard/nav-unify-label-49-4aa1a3c674.webp"
  },
  {
   "id": "highlights",
   "label": "亮点",
   "img": "/_shared/nav-unify-standard/nav-unify-label-13-ba0d3fdcc6.webp"
  },
  {
   "id": "features",
   "label": "全部功能",
   "img": "/_shared/nav-unify-standard/nav-unify-label-25-6c8f61c250.webp"
  },
  {
   "id": "history",
   "label": "演进",
   "img": "/_shared/nav-unify-standard/nav-unify-label-55-f8367a4ec7.webp"
  }
 ],
 "motion": {
  "screen": "localocr-01",
  "art": {
   "src": "/assets/_library/illustrations/main-localocr.png",
   "size": [
    1189,
    977
   ],
   "key": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6"
  },
  "brush": {
   "src": "/assets/localocr/localocr-01-title-01.png",
   "size": [
    681,
    173
   ],
   "key": "84b6833b60f41aa68e46393d7023d3a48e8487a764c7da9e071ad183b89d3bed"
  }
 },
 "source": {
  "page": "sources/pages/localocr/page.json",
  "sha256": "9a6f7a8f0cf89f0b12bd30f6f7b6de81d4f13e3a371983b5bebcf3583975fbb0",
  "converted_at_beijing": "2026-10-09T22:34:46+08:00"
 }
}
---

::screen{#localocr-01 section="top"}

:::chapter{title="本地文字识别" brush="/assets/localocr/localocr-01-title-01.png" brushbox="13,0,0,7" size="large" art="/assets/_library/illustrations/main-localocr.png" artw="50%" align="left" level="1" living="/_living/localocr/astro/config.json"}
#### 在自己电脑的显卡上，把图片、截图和扫描件里的字读准、读全，并说清哪里没把握。

AI 自己也能看图，说个大意没问题；要准确抄下扫描件、参数表或几十张截图，就把文件交给它。比如“把这张参数表读成文字，没把握的地方标出来”，会得到文字和逐页判断：有字、没字，还是说不准；要还原表格行列，明确说明。识字在本机离线完成，图片不传到识别网站；读不好的页再用更强的模型重读。
:::

:::stats{cols="4" colsv="2" icons="/assets/_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png,/assets/_library/icons/%E5%8F%8C%E6%A8%A1%E5%9E%8B%E7%AA%97%E5%8F%A3.png,/assets/_library/fix-round-2/icon-clean-f12e6ff1182222417108.png,/assets/_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"}
- <strong>684 次</strong>　识别，555 份材料、706 页（7 月 8 日–9 月 28 日 20:26）
- <strong>92%</strong>　自动选模型的 300 次里，277 次快模型就够，23 次换了强模型（其余 384 次是直接指定快模型）
- <strong>18 个</strong>　本地模型，共 3.9 GB，下载后离线运行
- <strong>181 项</strong>　测试无失败（16 项按条件跳过），现役版本 9 月 24 日验收
:::

截至 2026 年 9 月 28 日 20:26（北京时间）

:::buttons
[在整套系统里的位置 → 怎么协作](/how/#localocr) [GitHub](https://github.com/wlyaaaaa/LocalOCR) [复制 AI 续作说明](/projects/localocr/#ai-brief)
:::

::screen{#localocr-13 section="usage"}

:::chapter{title="什么材料走哪条路" brush="/assets/_library/round3/titles/title-836e7102d7fd69c05c88.png" brushbox="6,4,4,4" size="large" art="/assets/_library/illustrations/%E8%AF%86%E5%88%AB%E7%BA%B8%E5%BC%A0%E9%80%9A%E7%94%A8%E6%9E%84%E5%9B%BE.png" artw="22%" artside="left" align="center"}

:::

:::cards{art="left" kind="content_card" cols="2" colsv="1"}
::card{icon="/assets/_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"}

#### 普通页：截图、网页图、普通扫描件

→ 快读：PP-OCRv6\_medium（检测、识别各一个模型）

默认先走这条。模型热着一页约 2 秒，每行字给一个 0–1 的把握分。

::card{icon="/assets/_library/round3/clean-assets/png/12-%E6%96%87%E4%BB%B6%E6%A0%B8%E9%AA%8C-clean.png"}

<strong>难页：快读后体检不过关</strong>（一个字没读出来、把握分偏低、读出 ∑ ∫ 这类公式符号、带横竖线的表格）

→ 只把这一页交给强模型：PaddleOCR-VL-1.6 ＋ PP-DocLayoutV3 版面检测

用于读表格、公式、多栏等难页，读不准的仍要核对；首次加载加识别约 50 秒、内存约 16 GB，所以只给有问题的页，快读结果留着对照。已知是多栏论文、公式很多的文档，直接说“用强模型”。

::card{icon="/assets/_library/icons/%E5%8D%B0%E7%AB%A0.png"}

#### 要还原结构：表格变成行列，认公式和印章，给每块区域坐标

→ 结构还原：PP-StructureV3（内部识字用 PP-OCRv5，另有表格、公式 PP-FormulaNet\_plus-L、印章模型）

只在明确说要结构时走，不参与自动选择；真实材料上还没用过，只在项目自带的样例上跑过。
:::

:::note
体检的完整门槛见[亮点：先快后强](/projects/localocr/#fast-then-strong)；全部模型见[用的哪些模型](/projects/localocr/#models)。
:::

::screen{#localocr-02 section="usage"}

:::chapter{title="平时怎么用" brush="/assets/personal-health/personal-health-02-title-01.png" brushbox="9,0,0,5" size="large" align="center"}
我一般不直接开它，而是跟 AI 说要读什么，AI 判断该不该用它、再调它；也可以把文件拖到 start.bat 上，结果在 outputs 文件夹。怎么跟 AI 说、什么时候 AI 自己看就够：[跟 AI 怎么说 → 技能页](/skills/localocr/)
:::

:::cards{art="icon" kind="source_text_card" cols="3" colsv="1"}
::card{icon="/assets/_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"}

1. <strong>一字不差抄截图</strong>

一批截图要一字不差时，AI 交给它读。模型热着时一张截图约 2 秒；结果带每行字的位置和把握分；有字块把握分低于 0.50 时，结果会标“置信度较低”，AI 据此回原图核对。

::card{icon="/assets/_library/icons/%E7%A7%92%E8%A1%A8.png"}

2. <strong>扫描讲义转文字</strong>

整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI 会说清哪几页换过模型、哪几页把握不高。

::card{icon="/assets/_library/icons/%E7%9B%B8%E6%9C%BA.png"}

3. <strong>整理照片时读屏幕上的字</strong>

[照片视频录音管理](/projects/personal-media/)整理截图时，画面由 AI 自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。
:::

::screen{#localocr-03 section="usage"}

:::chapter{title="读出来是什么样" brush="/assets/_library/titles/title-84a305beb3019ba74f7a.png" brushbox="4,7,4,7" size="large" align="center"}

:::

:::gallery
![原图：项目自带的合成采购单（900×600），有标题、六列表格、五条商品和合计。](/assets/_references/4fbf3d65137840ceecba3c516856412760303c96230389ae5bcc63f5c6caf4fe.webp "nocap")

![9 月 3 日本机实际输出（结构还原路线）：六列、五行和合计都对；原图标题没进正文，原始文字行把标题里的编号 PO-2026-0712 读成了 P0-2026-0712。如实保留，不修饰成全对。](/assets/_references/c0efe539bcea67b32b891321fdb3f0c531600a3d728c30d6e2072277338719c5.webp "nocap")
:::

原图：项目自带的合成采购单（900×600），有标题、六列表格、五条商品和合计。

9 月 3 日本机实际输出（结构还原路线）：六列、五行和合计都对；原图标题没进正文，原始文字行把标题里的编号 PO-2026-0712 读成了 P0-2026-0712。如实保留，不修饰成全对。

每次识别写出三份结果：

:::cards{art="left" kind="content_card" cols="3" colsv="1"}
::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### TXT

纯文字，按页分开

::card{icon="/assets/_library/round3/clean-assets/png/05-%E7%81%AF%E6%B3%A1-clean.png"}

#### Markdown

保留标题层级，表格、公式留结构

::card

#### JSON

每块字的位置框、把握分、阅读顺序和类型
:::

:::note
另附一份客观结论和一句人话摘要，例如这张图的摘要：

“识别完成：检测到 2 个文字块；覆盖完整；质量未知；未触发自动升级。”

结构还原把整张表算作一块、合计算一块，所以是 2 个文字块；这条路线不给把握分，质量只能写“未知”，不是出错。
:::

::screen{#localocr-04 section="usage"}

:::chapter{title="出事怎么办" brush="/assets/_library/round3/titles/title-r3-45a143d5be04db99e96c.png" brushbox="5,4,4,7" size="large" align="center"}
它没有自动提醒；出了问题直接跟 AI 说，AI 按下面的办法处理。
:::

:::cards{art="left" kind="content_card" cols="2" colsv="1"}
::card{icon="/assets/_library/icons/%E6%94%BE%E5%A4%A7%E9%95%9C.png"}

#### 正忙

同时只做一个识别。再交一份，会直接回“有任务在跑”和任务编号，不偷偷排队；AI 先查进度，不重复提交。

::card{icon="/assets/_library/icons/%E6%B2%99%E6%BC%8F.png"}

#### 太久

一次默认最多 300 秒，长任务可放宽到 2 小时；超时连同子进程一起结束，显卡还回去。AI 那边等不及先断开，不等于识别失败，先按任务编号回查。

::card{icon="/assets/_library/icons/%E7%A6%81%E6%AD%A2%E6%96%87%E4%BB%B6.png"}

#### 想停

按任务编号只取消这一项，不影响别的服务；取消后不自动重试。

::card{icon="/assets/_library/round3/clean-assets/png/11-%E6%98%BE%E5%8D%A1-clean.png"}

#### 显卡要给别人

说“识别完把显卡腾出来”。另外，电脑上有个显卡调度员（电脑配置与恢复里的本机小服务：谁要用显卡，先向它领一张限时许可，也就是“租约”；它决定谁能同时用、谁要等）。本地大模型要用显卡时，它会先把文字识别清走。

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 强模型重读失败

快读的结果单独存成“部分结果”，照样报失败，不当完成。

::card{icon="/assets/_library/icons/%E5%B7%A5%E5%85%B7%E7%AE%B1.png"}

#### 换电脑

模型和运行环境不进备份，按登记从魔搭重下、重建环境，再跑一遍验收。
:::

:::note
把握分高也不等于每个字都对：关键的小字、淡字，回原图看一眼。
:::

::screen{#localocr-05 section="tech"}

:::chapter{title="一次识别经过哪几步" brush="/assets/_library/titles/title-3df730e1229eed07fb1c.png" brushbox="4,6,4,6" size="large" align="center"}

:::

:::steps{kind="flow" cols="6" colsv="1" icons="/assets/_library/icons/%E5%8D%B0%E7%AB%A0.png,/assets/_library/round3/clean-assets/png/11-%E6%98%BE%E5%8D%A1-clean.png,/assets/_library/icons/%E8%A3%81%E7%BA%B8%E5%88%80.png,/assets/_library/icons/%E7%A7%92%E8%A1%A8.png,/assets/_library/round3/clean-assets/png/42-%E5%90%AC%E8%AF%8A%E5%99%A8%E6%A3%80%E6%9F%A5-clean.png,/assets/_library/icons/%E7%BA%B8%E7%AE%B1.png"}
1. <strong>先留底</strong>　算原件的内容指纹（SHA-256），复制一份只读快照来识别；识别完再核一次，原件中途被改就不发结果。
2. <strong>领显卡</strong>　向显卡调度员领租约，领到才加载模型。
3. <strong>拆页</strong>　PDF 按 216 DPI 逐页渲染成图（单页最多 2400 万像素），多页 TIFF 逐帧拆开；图片直接读。
4. <strong>快读</strong>　每页先用 PP-OCRv6 读，每行字附一个 0–1 的把握分。
5. <strong>逐页体检</strong>　不过关的页交给 PaddleOCR-VL-1.6 重读，快读结果照样留着对照（规则见亮点）。
6. <strong>交结果</strong>　写出三份结果、客观结论和人话摘要；最后写完任务记录才算完成。
:::

:::cards{art="left" kind="content_card" cols="2" colsv="1"}
::card{icon="/assets/_library/icons/%E6%94%BE%E5%A4%A7%E9%95%9C.png"}

#### 识过不重识

同一份材料、同样的请求再来，先核对原件、模型、配置和输出文件的指纹，都对得上才直接交上次的结果；换了模型不会误用旧结果。

::card{icon="/assets/_library/icons/%E5%8D%B0%E7%AB%A0.png"}

#### 要表格结构时

明确说要表格、公式、印章或区域坐标，走 PP-StructureV3 这条路；它不参与自动选择。
:::

::screen{#localocr-06 section="tech"}

:::chapter{title="用的哪些模型" brush="/assets/_library/titles/title-bb35286273c0e9b2518a.png" brushbox="4,6,4,7" size="large" align="center"}

:::

| 用途 | 模型 | 做什么 | 为什么这样选 |
|---|---|---|---|
| 日常识字 | PP-OCRv6 medium（检测、识别各一个模型） | 先框出每行字，再逐行认字，每行给把握分 | 精度和速度的折中：不用手机版小模型，也不用旧版；截图、网页图、普通扫描件都靠它 |
| 转正方向 | PP-LCNet 两个小模型 | 判断整页和每行字是不是横着、倒着 | 拍歪、扫倒的页先转正再读 |
| 难页重读 | PaddleOCR-VL-1.6（视觉语言模型，约 1.9 GB）＋ PP-DocLayoutV3 版面检测 | 看懂整页版面，表格、公式、多栏都读得好 | 读得好但慢：首次加载加识别约 50 秒，工作进程内存约 16 GB，所以只给有问题的页 |
| 结构还原 | PP-StructureV3：版面 2 个、识字 PP-OCRv5 2 个、表格 5 个、公式 PP-FormulaNet 1 个、印章 1 个 | 表格还原成行列，认公式和印章，给每块区域坐标 | 只在明确要结构时用；它不支持 v6，所以内部用 v5 |
| 纸张摊平 | UVDoc | 把拍弯的纸“摊平” | 只给强模型和结构还原用；日常识字关掉（见亮点） |

:::note
全部是百度飞桨的模型，从 ModelScope 魔搭下载（国内直连约 25 MB/s），共 18 个、3.9 GB，下载后离线运行。用哪个模型写在一个配置文件里，换模型不改代码。

AI 自己也能看图，说个大意没问题；可要一字不差抄下扫描讲义、参数表或几十张截图，它会漏字、猜字，还说不清哪里没看清。这个项目用百度飞桨的文字识别模型在本机离线识字：每页先用快模型（PP-OCRv6\_medium）读，只把读得不好、或看得出是表格公式的那几页交给强模型（PaddleOCR-VL-1.6）重读；要把表格还原成行列，明说就走结构还原（PP-StructureV3）；每份结果写明“有字”“没字”还是“说不准”。识字这一步不联网，图片不传到任何识别网站。
:::

::screen{#localocr-07 section="tech"}

:::chapter{title="跑在哪、怎么不打架" brush="/assets/_library/round3/titles/title-r3-f255783c85c0e7082f7e.png" brushbox="2,0,0,0" size="large" align="center"}

:::

:::cards{art="left" kind="content_card" cols="3" colsv="1"}
::card{icon="/assets/_library/round3/clean-assets/png/11-%E6%98%BE%E5%8D%A1-clean.png"}

#### 为什么在 Linux 里跑

这台电脑是 RTX 5090 D（新一代 Blackwell 架构），Windows 版飞桨显卡版跑不起来；整套放进 WSL2（Windows 自带的 Linux）：Ubuntu 24.04、飞桨 3.4、CUDA 12.9、PaddleOCR 3.7。代价是 Windows 和 Linux 之间要转路径，中文、空格、拖放路径在 9 月 6 日、8 日、24 日都专门修过。

::card{icon="/assets/_library/round3/clean-assets/png/13-%E5%85%AC%E6%96%87%E5%8C%85%E6%B8%85%E5%8D%95-clean.png"}

#### 一个本机服务

FastAPI 写的接口，只在本机 18665 端口。接口本身不加载模型，模型在一个随时能结束的工作进程里：同一模型连着用就热着复用，换模型先关旧的再开新的，不让几套模型叠在内存里。

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 一块显卡：两家可同时，大模型单用

文字识别和[中文语音转写](/projects/chinese-asr/)可以同时用显卡；本地大模型要用时，前两家都得让开。由[电脑配置与恢复](/projects/pcconfig/)里的显卡调度员按租约分配。

::card{icon="/assets/_library/round3/clean-assets/png/09-%E6%97%B6%E9%92%9F-clean.png"}

#### 有上限

一次请求默认 300 秒、最多 2 小时；服务连同子进程内存上限 30 GB（不是显存），超了只停自己。

::card{icon="/assets/_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"}

#### 每天用的是验收过的一版

正式服务从快照运行，留当前版和上一版；新版要过依赖、181 项测试（无失败，16 项按条件跳过）、9 个合成样例的真实显卡识别三道验收才切换，退回上一版也要它自己的验收记录。
:::

代码：6,929 行程序（Python、PowerShell），4,801 行测试；公开仓库每次推送，GitHub 自动跑一遍不需要显卡的测试。

::screen{#localocr-08 section="highlights"}

:::chapter{title="亮点" brush="/assets/_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png" brushbox="4,4,4,4" size="large" art="/assets/_library/illustrations/%E6%96%87%E7%A8%BF%E6%A0%B8%E9%AA%8C%E9%80%9A%E7%94%A8%E6%9E%84%E5%9B%BE.png" artw="35%" artside="left" align="center"}

:::

<h3 class="sechead">先快后强，只重读有问题的那一页</h3>

<strong>麻烦</strong>　每页都用强模型最稳，但太慢：强模型首次加载加识别要 50 秒，内存约 16 GB；快模型热着一页约 2 秒。靠文件名猜哪份难，又常常猜错。

<strong>解法</strong>　每页先快读，再逐页体检，下面任一条成立，只把这一页交给强模型：

- 一个字都没读出来
- 整页平均把握分低于 0.78
- 把握分低于 0.80 的行占四分之一以上
- 把握分低于 0.50 的行占一成以上
- 读出了 ∑、∫ 这类公式符号
- 图上横线和竖线的交叉点有 6 个以上（带线的表格）
- 读出了字，却一个把握分都没有

例外：近乎纯色、本来就像空白的页读不出字，不算“没读出来”，不升级。

<strong>结果</strong>　7 月 8 日–9 月 28 日，自动选模型的 300 次识别里，277 次（92%）快模型就够，23 次换了强模型。9 月 26 日一份 16 页的扫描 PDF，只有第 15 页被重读，其余 15 页保留快读结果。

<strong>取舍</strong>　这是经验规则，不是真的看懂了版面，会漏判；已知是多栏论文、公式很多的文档，直接说用强模型。

::screen{#localocr-09 section="highlights" continue="1"}

:::cards{art="top" kind="content_card" cols="3" colsv="1"}
::card{icon="/assets/_library/icons/%E6%89%93%E5%8B%BE%E6%B8%85%E5%8D%95.png"}

#### 1\. 把握分很高，也可能读错表格

麻烦　快模型读表格时，每个字都认得很自信，却把表格拆成一串散字，只看把握分发现不了。

解法　体检时另外用图像找横线和竖线的交叉点，够 6 个就判为表格页，交给强模型。

证据　验收样例“自动路线·表格”：快读 9 行，平均把握分 0.99995，没有一行低分，仍因为查到表格线被送去重读。真实材料也有：9 月 26 日那份 16 页扫描件的第 15 页，平均把握分 0.997，就是因为表格线才被重读的。

::card{icon="/assets/_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"}

#### 2\. 读不出字，不等于没有字

麻烦　结果为空时，AI 很容易说“这图没字”，其实可能是字太小、太淡或模型出错。

解法　结论分三种：有字、没字、说不准。只有整页读全、质量够、另有独立证据才判“没字”；目前唯一的独立证据是“近乎纯色的图”检测，其余空结果一律“说不准”。结论用指纹绑定原件、请求、模型和输出文件。

证据　8 月 18 日起带结论的 274 份真实结果都是“有字”，还没遇到过空结果；验收里的纯白样例图按“近乎纯色”判为没字。

::card{icon="/assets/_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"}

#### 3\. 截图不需要“摊平”

麻烦　UVDoc 本是给拍弯的纸用的，对平整的软件截图反而裁掉边缘、读错字，还连带触发不必要的强模型重读。

解法　日常识字默认关掉摊平，只保留转正方向；强模型和结构还原处理纸质文档时仍开着。

证据　8 月 28 日起这样设；关掉后截图的主体文字和位置恢复正常。
:::

::screen{#localocr-10 section="features"}

:::chapter{title="全部功能（28 项）" brush="/assets/_library/titles/title-832fae0fa1193bf6035b.png" brushbox="6,5,5,7" size="large" align="center"}

:::

:::legend
图例：<span class="legend-item" data-state="on"><span class="legend-dot" aria-hidden="true">●</span>在用</span>　<span class="legend-item" data-state="pending"><span class="legend-dot" aria-hidden="true">●</span>待验收</span>　<span class="legend-item" data-state="todo"><span class="legend-dot" aria-hidden="true">○</span>待实施</span>　<span class="legend-item" data-state="unused"><span class="legend-dot" aria-hidden="true">●</span>没用过</span>　<span class="legend-item" data-state="uncertain"><span class="legend-dot" aria-hidden="true">●</span>说不准</span>　<span class="legend-item" data-state="off"><span class="legend-dot" aria-hidden="true">✕</span>已停用</span>
:::

没用过＝每次识别都会留任务记录，真实材料里一次也没有；说不准＝用了也不一定留记录。

<h3 class="sechead">读字</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 1 图片和截图识字

png、jpg、webp、bmp 图片和截图，读出全部文字

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/round3/clean-assets/png/12-%E6%96%87%E4%BB%B6%E6%A0%B8%E9%AA%8C-clean.png"}

#### 2 扫描件逐页识字

扫描 PDF 按 216 DPI 逐页渲染再读，多页 TIFF 逐帧读，并核对实际页数

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%96%87%E4%BB%B6%E5%A4%B9%E9%93%BE%E6%8E%A5.png"}

#### 3 一个文件夹一起读

每个文件分别选路线，不支持的文件列为跳过

<span class="status-tag" data-state="uncertain">说不准</span>

::card{icon="/assets/_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"}

#### 4 拖到 start.bat 就识别

不经过 AI，自己拖文件，结果在 outputs 文件夹

<span class="status-tag" data-state="uncertain">说不准</span>

::card{icon="/assets/_library/icons/%E7%BA%B8%E7%AE%B1.png"}

#### 5 三种结果文件

纯文字 TXT、保留标题表格的 Markdown、带坐标和把握分的 JSON

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E5%8F%8C%E6%A8%A1%E5%9E%8B%E7%AA%97%E5%8F%A3.png"}

#### 6 歪的倒的先转正

两个方向小模型判断整页和每行字的朝向，先转正再读

<span class="status-tag" data-state="on">在用</span>
:::

<h3 class="sechead">选模型</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card{icon="/assets/_library/round3/clean-assets/png/42-%E5%90%AC%E8%AF%8A%E5%99%A8%E6%A3%80%E6%9F%A5-clean.png"}

#### 7 先快后强自动选

每页先用快模型读，体检不过的页才换强模型

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 8 只重读有问题的页

多页文件里只把没读好的那几页交给强模型，其余页保留快读结果

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E7%A6%81%E6%AD%A2%E6%96%87%E4%BB%B6.png"}

#### 9 指定模型

可以直接说用快模型、强模型或结构还原，自动选路不改写

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"}

#### 10 只看走哪条路

先预览这份材料会走哪条路线，不真的识别

<span class="status-tag" data-state="uncertain">说不准</span>
:::

<h3 class="sechead">表格和位置</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card

#### 11 表格还原成行列

PP-StructureV3 把表格还原成行列 HTML，给每块区域坐标

<span class="status-tag" data-state="unused">没用过</span>

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 12 公式和印章

同一条结构还原路线认出公式、检测印章文字

<span class="status-tag" data-state="unused">没用过</span>

::card

#### 13 每行字的位置和把握分

JSON 里每块字有框、多边形、阅读顺序和 0–1 的把握分

<span class="status-tag" data-state="on">在用</span>
:::

::screen{#localocr-11 section="features" continue="1"}

<h3 class="sechead">结果靠得住</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card{icon="/assets/_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"}

#### 14 有字、没字、说不准

每份结果附一份客观结论，空结果不当“没字”

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 15 一句人话摘要

把覆盖、质量、文字块数和是否升级写成一句话

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E5%8D%B0%E7%AB%A0.png"}

#### 16 原件留底再识别

先算指纹做只读快照，识别完原件变了就不发结果

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/round3/clean-assets/png/12-%E6%96%87%E4%BB%B6%E6%A0%B8%E9%AA%8C-clean.png"}

#### 17 识过不重识

同样的材料和请求再来，核对指纹后直接交上次结果

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E7%A6%81%E6%AD%A2%E6%96%87%E4%BB%B6.png"}

#### 18 中断时保住读完的页

超时或崩溃时已读完的页留作部分结果，不冒充整份

<span class="status-tag" data-state="uncertain">说不准</span>
:::

<h3 class="sechead">运行和显卡</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card{icon="/assets/_library/round3/clean-assets/png/09-%E6%97%B6%E9%92%9F-clean.png"}

#### 19 本机识别服务

只在本机 18665 端口，同一时间只做一个识别，忙时直说不排队

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"}

#### 20 查进度、取消

按任务编号查到哪一步，或只取消这一项

<span class="status-tag" data-state="uncertain">说不准</span>

::card{icon="/assets/_library/icons/%E9%BA%A6%E5%85%8B%E9%A3%8E.png"}

#### 21 领显卡、和语音转写同时跑

向显卡调度员领租约才加载模型；可和语音转写并行，和本地大模型互斥

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/round3/clean-assets/png/11-%E6%98%BE%E5%8D%A1-clean.png"}

#### 22 用完腾显卡

关掉工作进程、还回显卡；本地大模型要用时调度员也会先清

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%B2%99%E6%BC%8F.png"}

#### 23 超时和内存上限

一次默认 300 秒、最多 2 小时；内存超 30 GB 只停自己

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 24 给看板的任务视图

只读、不含文件内容的任务列表接口

<span class="status-tag" data-state="uncertain">说不准</span>
:::

<h3 class="sechead">版本和换模型</h3>

:::cards{art="icon" kind="feature_card" cols="3" colsv="1"}
::card{icon="/assets/_library/icons/%E6%89%93%E5%8B%BE%E6%B8%85%E5%8D%95.png"}

#### 25 正式版和开发代码分开

每天用的是验收过的快照，改代码不影响它

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%94%BE%E5%A4%A7%E9%95%9C.png"}

#### 26 退回上一版

保留上一版，出问题可以切回，切回也要它自己的验收

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"}

#### 27 换版前三道验收

依赖、181 项测试无失败、9 个合成样例的真实显卡识别全过才切换

<span class="status-tag" data-state="on">在用</span>

::card{icon="/assets/_library/icons/%E6%96%87%E4%BB%B6%E9%BD%BF%E8%BD%AE.png"}

#### 28 换模型只改配置

模型写在配置档里，新模型先对照验收，不自动当默认

<span class="status-tag" data-state="on">在用</span>
:::

::screen{#localocr-12 section="history"}

:::chapter{title="演进（2026 年）" brush="/assets/_library/titles/title-60559ec08d1172637358.png" brushbox="4,6,4,7" size="large" align="center"}

:::

:::steps{kind="timeline" cols="5" colsv="1"}
1. <strong>7 月 2 日</strong>　在 RTX 5080 上跑通 PaddleOCR 3.7（放进 WSL2；随后换成同一代架构的 5090 D）
2. <strong>7 月 5 日</strong>　本机识别服务；用完可以腾显卡
3. <strong>7 月 7 日</strong>　模型写进配置档；加上结构还原；识过不重识；自动选路
4. <strong>7 月 12 日</strong>　所有显卡工作都先向全机调度员领号
5. <strong>7 月 30 日</strong>　难页自动交本地强模型重读
6. <strong>8 月 18 日</strong>　分清“读不出”和“没有字”，每份结果附客观结论
7. <strong>8 月 28 日</strong>　截图关掉纸张摊平；运行和入口全面加固
8. <strong>9 月 2 日</strong>　每份结果加一句人话摘要
9. <strong>9 月 17 日</strong>　正式版和开发代码分开，可以退回上一版
10. <strong>9 月 24 日</strong>　现役版本验收：181 项测试无失败（16 项按条件跳过），9 个合成样例全过
:::

41 次提交，7 月 2 日到 9 月 27 日；9 月 24 日之后只改过文档。
