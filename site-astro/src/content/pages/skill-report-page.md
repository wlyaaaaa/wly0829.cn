---
{
 "title": "汇报网页",
 "kind": "skill",
 "url": "/skills/report-page/",
 "tagline": "要展开说明的汇报、请我裁定和长回答做成网页，点选就能答复；一两句的回执直接在对话里说。",
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "examples",
   "label": "例子",
   "img": "/_shared/nav-unify-standard/nav-unify-label-22-283ba9f1bc.webp"
  },
  {
   "id": "abilities",
   "label": "能做的事",
   "img": "/_shared/nav-unify-standard/nav-unify-label-58-7dadc2c869.webp"
  },
  {
   "id": "limits",
   "label": "边界",
   "img": "/_shared/nav-unify-standard/nav-unify-label-72-7a7e13ca96.webp"
  }
 ],
 "motion": {
  "screen": "skill-report-page-01",
  "art": {
   "src": "/assets/_library/illustrations/generic-report-page-dashboard.png",
   "size": [
    904,
    455
   ],
   "key": "e6990e5657edbed68189b47d52f3088f639df95e4c2ed45db6698094d967b734"
  },
  "brush": {
   "src": "/assets/_library/titles/title-d320a7a8e10d363dd8a8.png",
   "size": [
    1974,
    500
   ],
   "key": "99b3b71384343347a96e28d52c4c483776addf5117f4b69203b18e6bcf5613ea"
  }
 },
 "source": {
  "page": "sources/pages/skill-report-page/page.json",
  "sha256": "555a0223983561e2d2ebdc51910e3a77bf6278828d77df4bd88bd14435678670",
  "converted_at_beijing": "2026-10-09T16:59:04+08:00"
 }
}
---

::screen{#skill-report-page-01 section="top"}

:::chapter{title="汇报网页" brush="/assets/_library/titles/title-d320a7a8e10d363dd8a8.png" art="/assets/_library/illustrations/generic-report-page-dashboard.png" level="1" living="/_living/skill-report-page/astro/config.json"}
技能名 report-page · [约法 L26](/rules/charter/#L26)说的那种白底绿色汇报网页
:::

:::cards
::card

#### 它做什么

要展开说明的汇报、请我裁定和长回答不在对话框里刷一大段字，AI 把它做成一张本地网页，用 Chrome 打开给我看：先一句“看完能解决什么”和结论，再按我要弄懂或要定的事分节，每节配最合适的图。要我拍板的事做成卡片，我点选、写几句说明，点“生成我的答复”，整页选择变成几行字，粘回对话，AI 照着办。

AI 只写内容文件（文字和数字），版式、配色、图表和检查都交给一条命令；页面只存在我电脑上，不发到网上。
:::

:::stats
- <strong>65 份</strong>　9 月 26–28 日生成、现存的汇报页（58 个不同标题）
- <strong>387 张</strong>　
- <strong>129 次</strong>　

截至 9 月 28 日

58 个标题各取最新一版，其中 50 份带决策卡，共 387 张

截至 9 月 28 日

Claude 87 次、Codex 42 次运行生成命令

9 月 26 日 03:31–28 日 10:00（使用小记录只记到这里）
:::

:::dialogue
#### 怎么跟 AI 说

“这个说来话长，做成网页给我看。”

“这几件要我定的事做成卡片，我点选。”

“进度画成图，别只写字。”

“这批照片放进页面，我看着决定留哪些。”

“这份提示词渲染好给我看，要能复制原文。”

“上一轮 A3 我没看懂，重做一页讲清楚。”

“这次一两句就行，不用做网页。”

（把页面生成的答复整段粘回对话）
:::

:::note
不用点名：要展开说明的汇报、要我裁定，或者回答超过大约一千字，AI 自己就做成网页；别的回答，网页看着更直观、更好看时也可以用。简单的完成回执和短状态直接在对话里说，不专门做网页，也不为了做网页把一句话扩成汇报；我明确要网页时照做。
:::

::screen{#skill-report-page-02 section="examples"}

:::chapter{title="一个完整例子：这个网站的设计稿怎么定下来" brush="/assets/_library/titles/title-cad79fffe8ffc762fedc.png"}

:::

:::tag
真事 · 北京时间 9 月 28 日 18–19 点
:::

:::steps{kind="flow" icons="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png,/assets/_library/icons/%E6%8C%87%E5%90%91%E6%89%8B.png,/assets/_library/round3/clean-assets/png/01-%E7%BB%BF%E5%8F%B6%E8%A3%85%E9%A5%B0-clean.png,/assets/_library/round3/clean-assets/png/01-%E7%BB%BF%E5%8F%B6%E8%A3%85%E9%A5%B0-clean.png"}
1. <strong>AI 把设计稿做成网页</strong>　Claude 把网站设计稿第 4 版写成一份内容文件：页首一句“这页对你有什么用”和先说结论，正文按要定的事分节，每件事一张卡片，编号 V1 到 V21。一条命令生成、自检，在 Chrome 打开。
2. <strong>我逐张点选</strong>　每张卡写着现在是什么样、为什么要定、选了会怎样，AI 自己的倾向单独标“AI 建议”。我点“同意”或“要改”，想法不在选项里的，写进卡片下面的“我的说明”框。
3. <strong>一键生成答复</strong>　点“生成我的答复”，整页选择变成几行字复制好，我粘回对话；这一轮分两次贴回。选到一半关掉页面也不丢，浏览器记着。
4. <strong>AI 照答复办</strong>　有说明的以说明为准；V19 我直接选了标着“AI 建议”的 A。AI 把答复记进我的决定记录，然后开工第 1 批，就是现在这些页。
:::

:::note
<strong>上一轮</strong>　第 3 版 25 张卡，我在 8 张上选了“要改”并写了说明；AI 照改出第 4 版，复核一轮。
:::

:::cards
::card

#### 我贴回去的答复（节选）

名称说明：这里 Luna 指 GPT-6 Luna，Sol 指当时的 GPT-6 Sol。

个人网站 · 最终设计稿第 4 版（逐项审） · 我的答复

V1 分批和范围：同意；我的说明：Luna、Sol 一次画几张、审几张你定

V16 按需更新（取消每周复核）：同意

V19 “待实施”状态：A 保留这个状态（AI 建议）

V21 第 1 批就给第 2 批留锚点：内容和页面都留：同意

整体补充：不要过度审计，你把握
:::

答复格式是固定的：第一行标题，每题一行，最后整体补充。

::screen{#skill-report-page-03 section="examples"}

:::chapter{title="页面长什么样" brush="/assets/_library/titles/title-02d56f0b3157e18ad998.png"}

:::

:::gallery
![演示页截图（页首）：用技能自带的演示内容在 1280 像素宽生成，9 月 28 日](/assets/_references/c6f816fe118db865d676f152851de608e3c8c3550b0ced08e99315d7c34d50e1.png "nocap")

![演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区](/assets/_references/b3c38dd68e427c123208f5415194a5ead7ff24a06553f16da4e89104848daa47.png "nocap")
:::

1 页眉：标签（请你裁定、AI 汇报、AI 回答）、北京时间、“本地文件，不对外发布”，右上角“字号 − / +”

2 标题下一句：看完能解决什么

3 “先说结论”：先给判断，再说要我做什么

4 本页导航：三节以上自动出现，点节名就跳过去

演示页截图（页首）：用技能自带的演示内容在 1280 像素宽生成，9 月 28 日

5 卡片：编号和问题，下面是这件事的来龙去脉

6 选项：每个都是确定的做法，写清选了会怎样；“AI 建议”单独一行

7 每张卡下面一个“我的说明”框

8 页尾“把选择发回给 AI”：整体补充和“生成我的答复”按钮

演示页截图（卡片）：用技能自带的示例展示选项、我的说明和答复区

::screen{#skill-report-page-04 section="abilities"}

:::chapter{title="能做的事：该用哪种图" brush="/assets/_library/titles/title-87028220e41029f4bc43.png"}
<strong>原则：怎么便于我理解就怎么画。</strong>先想清这一段要让我明白什么，再挑最好懂的一种；帮不上理解的图不加。每张图前一句话说它说明了什么，数字写来源，粗估写明粗估。
:::

| 要说的内容 | 用哪种 |
|---|---|
| 两三个关键数字 | 大数字卡 |
| 几样东西比多少 | 横条，或柱状图（可几组并排） |
| 随时间涨跌 | 折线图 |
| 一个整体分成几块 | 占比环，块多时用堆叠条 |
| 离目标还差多少 | 进度条组 |
| 长任务到哪一步 | 进度格 |
| 按时间发生了什么 | 时间线（北京时间） |
| 要我照着做 | 步骤，我亲手做的标“要你动手” |
| 改前和改后 | 左右对照 |
| 几个做法按几条标准比 | 对照表，推荐的一列整列浅绿 |
| 很多东西各自的状态 | 绿黄红灰的状态格子 |
| 东西怎么流转 | 方框加箭头 |
| 谁包含谁 | 树状层级，最多 6 层 |
| 逐项问题 | 带颜色标签的清单 |
| 证据、命令输出 | 折叠起来，点开才看 |
| 一个结论 | 一句大字 |
| 图片、视频、录音、文档、文件夹 | 直接放进页面 |

:::cards
::card

#### 该用哪种图

照上表挑，一共 32 种组件（在用）

::card

#### 长文字排版

小标题、要点、编号、引用、重点标记排好的正文（说不准）

::card

#### 手写一小段网页

少数特殊版式才用（说不准）
:::

状态：绿圆点＝在用（记录或现存页面里用过）　灰圆点＝没用过（会留下痕迹的，一次也没找到）　浅灰圆点＝说不准（用了不留痕，这次也没数到）　叉＝已停用

:::gallery
![演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据](/assets/_references/d40e5cb08bcead69457cabaf7c00f348bc927eaa465ef8b587b57c71eee18418.png "nocap")
:::

演示页截图（图）：折线图、柱状图、进度条组、树状层级，图里是示意数据

::screen{#skill-report-page-05 section="abilities"}

:::chapter{title="能做的事：卡片、媒体、好读" brush="/assets/_library/titles/title-e174bbe0abebc651e69a.png"}

:::

:::cards
::card{icon="/assets/_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"}

#### 请我定的卡片

- <strong>决策卡：</strong>选项带后果，也可以是一行小按钮、多选、同类小问题排两列；“AI 建议”和“对你日常意味着什么”各单独一行（在用）
- <strong>卡里放要看的东西：</strong>要看着图、视频、文档、文件夹才能定的，直接放进这张卡（在用）
- <strong>我的说明框：</strong>每张卡下面自动加一个（在用）
- <strong>选择记在浏览器：</strong>选到一半关掉也不丢（说不准）
- <strong>生成我的答复：</strong>整页选择变成固定格式的几行字复制好；复制不了就弹出文字让我手动复制（在用）

::card{icon="/assets/_library/icons/%E6%96%87%E7%A8%BF%E5%A0%86.png"}

#### 图片、视频、录音、文档

- <strong>图片原始像素查看：</strong>可拖动、双指缩放，或“适应窗口”看全图；关掉回到原来读到的位置；图集能上一张、下一张（说不准）
- <strong>视频和录音：</strong>浏览器自带的播放条（说不准）
- <strong>Markdown 渲染：</strong>渲染成标题、列表、表格再给我看，“复制原文”拿到原稿（在用）
- <strong>文件卡片：</strong>显示原路径和“复制路径”，文本能预览；PDF、网页、图片和音视频能“在浏览器里查看”（在用）
- <strong>文件夹复制路径：</strong>粘到资源管理器地址栏就到（说不准）
- <strong>私人媒体只指向原文件：</strong>不复制、不做缩略图；资料锁着或文件搬走了，那一格显示带文件名的“看不到”（在用）

::card{icon="/assets/_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"}

#### 好读：页首、大屏、手机、打印

- <strong>页首用处和结论：</strong>第一屏一句看完能解决什么，再先说结论（说不准）
- <strong>本页导航：</strong>三节以上自动出现，点节名就跳过去（说不准）
- <strong>自动放大和字号：</strong>半屏 960 像素宽放大 1.15 倍，1280 像素 1.3 倍，大窗口最多 1.75 倍，手机和打印不放大；右上角“字号 − / +”八档，调一次所有页面都记住（在用）
- <strong>手机表格变卡片：</strong>多列表格变成一行一张卡片，列太多就表内横滑（说不准）
- <strong>打印展开：</strong>折叠的证据自动展开，没写的说明框不印（说不准）
:::

::screen{#skill-report-page-06 section="abilities"}

:::chapter{title="能做的事：一条命令做完" brush="/assets/_library/titles/title-5e7019c4b23cc0561f13.png"}

:::

:::steps{kind="flow" icons="/assets/_library/icons/%E6%96%87%E4%BB%B6%E5%86%99%E4%BD%9C.png,/assets/_library/icons/%E7%94%BB%E7%AC%94%E8%B0%83%E8%89%B2%E6%9D%BF.png,/assets/_library/round3/clean-assets/png/05-%E7%81%AF%E6%B3%A1-clean.png,/assets/_library/round3/clean-assets/png/05-%E7%81%AF%E6%B3%A1-clean.png,/assets/_library/round3/clean-assets/png/05-%E7%81%AF%E6%B3%A1-clean.png"}
1. <strong>写内容文件</strong>
2. <strong>生成</strong>
3. <strong>自检</strong>
4. <strong>打开</strong>
5. <strong>清理</strong>
:::

:::cards
::card

#### 写内容文件一条命令生成

AI 只写文字和数字，转义、版式、配色、画图都由命令做（在用）

::card

#### 生成前自检

先放在临时位置，用 Chrome 真正打开检查，不过关就不放进 E:\\Documents\\AI汇报（在用）

::card

#### 用 Chrome 打开

通过了才按北京时间命名放进汇报目录，用 Chrome 打开；子代理不打开，只交链接（在用）

::card

#### 旧页面进回收站

下次生成新页面时，顺带把 14 天前的旧页面连附件放进回收站，能还原（没用过：技能 9 月 26 日才建，还没有满 14 天的页面）

::card

#### 整页截图

按几种宽度存整页截图，给 AI 自己看版面；这一页的截图就是这样来的（在用）

::card

#### 给其他项目用

照片视频录音管理的批量审批页就是用它生成的，答复再交回那个项目写回；别的项目照接入说明写内容文件，也可以放到指定位置、不自动打开（在用）

::card

#### 手写整页

特殊版式时复制模板手写，再自检打开（说不准）

::card

#### 自检拦下这些

- 内容文件写错：不认识的字段、类型不对、缺必填项，逐条用中文列出
- 卡片数和“我的说明”框数对不上，卡片编号重复，卡片跑到答复区外
- 模板占位没替换、标签没配对、注释没关、元素编号重复、页面脚本没跑完
- 在 390、960、1280、1920 像素宽各开一次，半屏两档再按 1.5 倍字号各开一次：横向溢出、进度格重叠、进度条比例不对都算不过
- 实际点开代表图片，查原始像素、长图滚动、关闭后回到原位
- 找不到浏览器时不报“自检通过”
:::

实测（9 月 28 日）：演示页生成加 6 次浏览器自检 1 分 46 秒；再存 2 张整页截图，共 3 分 54 秒

::screen{#skill-report-page-07 section="abilities"}

:::chapter{title="AI 写这种页的规矩" brush="/assets/_library/titles/title-c76d507f3230cbeb035f.png"}

:::

### <strong>写法规矩</strong>（在用）

:::cards
::card{icon="/assets/_library/round3/clean-assets/png/01-%E7%BB%BF%E5%8F%B6%E8%A3%85%E9%A5%B0-clean.png"}

怎么写：

- 先结论，后细节：每节第一句就是答案，证据收进折叠
- 每段一个意思，三到五行；超过三段就加小标题
- 我一条消息问了几件事，就逐项回答几件
- 用真实的数量和文件夹名，不用内部代号；有用的英文第一次出现时括号写中文
- 重点少而准，一页标黄不超过两三处
- 同一组数字不在结论、大数字、时间线、表格里抄四遍
- 分清“已做”“接着做”“要我决定或亲手做”
- 时间一律北京时间；长任务写清到哪一步、还差什么、还要多久

::card{icon="/assets/_library/round3/clean-assets/png/01-%E7%BB%BF%E5%8F%B6%E8%A3%85%E9%A5%B0-clean.png"}

请我拍板时：

- 先把事实查清；没核实的判断不拿来当问题的背景
- 每张卡按“现在实际是什么样 → 为什么要定 → 各做法的后果 → AI 建议和理由 → 对我日常意味着什么”写
- 选项都是确定的做法，不写“A 或 B”
- 纯技术取舍 AI 自己定，不做成卡片；我看不见的变化不写进汇报
- 卡片编号跨轮不重复；提上一轮时写“第一轮 A3（总索引改私有）”这样带人话的说法
:::

:::note
<strong>收到答复怎么办</strong>（在用）　有说明的以说明为准，说明里的追问逐条答；看不懂、矛盾或明显误选的，做下一轮页面讲清，不替我改选择。
:::

:::note
<strong>子代理不做页面</strong>（在用）　派出去的子代理默认写成文字交回给派它的会话；要不要给我做页面由主对话定。页面做完，回复里仍用几句话说结论、附上页面链接，关掉页面也能从对话里找回。
:::

::screen{#skill-report-page-08 section="abilities"}

:::chapter{title="能做的事：它是怎么长成现在这样的" brush="/assets/_library/titles/title-ff818ac07f31565ae40c.png"}
#### 几乎每样功能，都来自我在汇报页上的一句答复。
:::

:::steps{kind="timeline"}
1. <strong>9 月 26 日 03:33</strong>　第一轮产品审查用过一张能点选的网页，AI 把它做成技能：白底绿色、带决策卡、一键生成答复
2. <strong>9 月 26 日 04:25</strong>　每张卡下面自动加“我的说明”框：想法不在选项里也能写
3. <strong>9 月 26 日 11:03</strong>　基本满意，想放大 50%–75%，多些图，文字也要排好读　→　大屏自动放大到 1.75 倍，长文字重新排版，加柱状图、折线图、进度条、树状图
4. <strong>9 月 27 日 01:39</strong>　子代理最后也做个网页，浪费额度　→　子代理默认不做页面
5. <strong>9 月 27 日 02:24</strong>　网页里能链到本地文件夹　→　文件夹“复制路径”
6. <strong>9 月 27 日 03:39</strong>　浏览器打开 Markdown 不是渲染好的样子　→　Markdown 渲染后显示，能复制原文
7. <strong>9 月 27 日 15:17</strong>　“打开文件夹”这类按钮修了一次还是没用，修不好就不要了　→　本机打开按钮停用，只留复制和页内预览
8. <strong>9 月 28 日 06:17</strong>　图片不能放大　→　点开按原始像素看，能拖动、缩放
9. <strong>10 月 8 日 00:08</strong>　就一句话的事情，不需要专门汇报　→　简单完成回执、短状态直接在对话里说，我明确要网页时照做
:::

:::note
<strong>本机打开按钮</strong>（已停用）　9 月 27 日凌晨加过“打开文件夹”“用默认程序打开”“在文件夹中显示”三个按钮，靠一个自带的本机打开程序接 Chrome 的链接。AI 自己验收时能打开，我在 Chrome 里点却没反应，修过一次还是不行；下午按我说的停用，那个打开程序连同约 1,300 行代码和测试一起删掉，只留复制路径、复制原文和页内预览。
:::

时间为北京时间，取技能改动的提交时间；我的话按意思转述。

::screen{#skill-report-page-09 section="limits"}

:::chapter{title="边界" brush="/assets/_library/round3/titles/title-r3-7a7e13ca96796233d6be.png"}

:::

:::cards
::card{icon="/assets/_library/round3/clean-assets/png/01-%E7%BB%BF%E5%8F%B6%E8%A3%85%E9%A5%B0-clean.png"}

#### 管

把 AI 要展开说明的汇报、审查和进度、请我裁定的事和长回答做成本地网页，别的回答网页更直观时也能用：排版、各种图、图片视频录音文档的显示、决策卡和答复、自检、打开和到期清理。简单的完成回执和短状态不归它，直接在对话里说；我明确要网页时照做。
:::

### 不管，交给谁

| 这些事 | 找谁 |
|---|---|
| 找照片视频录音、挑一批请我定去留 | [找照片、视频、录音](/skills/personal-media/)；它生成审批页、写回我的答复，这里只负责显示 |
| 把话讲明白的表达教训 | [讲给我听](/skills/explain-to-me/)，这里只照它写 |
| 我的决定长期记在哪 | 决定原话记在规则与技能基座的决定记录里，不靠页面保存 |
| 什么时候必须用网页 | [约法 L26](/rules/charter/#L26)和[能力与运行方式](/rules/capabilities-runtime/) |

:::cards
::card

#### 不做

- 不发到网上：包括 Claude 的在线页面，我要求时除外；这个网站也不是它做的。
- 密码、密钥、恢复码永远不写进页面。
- 不复制我的私人照片、视频、录音，只写原文件路径。
- 页面是临时的：下次生成新页面时，14 天前的旧页进回收站；同一件事的下一轮另做一页。
- 网上的图片和视频地址不收，页面要能离线看。
:::
