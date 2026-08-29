# 个人项目看板 MVP 与四项目扩展规格

## 产品定位

这是吴乐阳本人长期使用的只读项目看板。公开访问只是分发方式，不改变产品的第一读者。

用户打开网站后，应当不依赖旧对话、记忆或私有说明，就能回答：

1. 这里维护哪些项目，顺序是什么；
2. 一个项目负责什么、不负责什么、现在处于什么状态；
3. 项目有哪些真实组件、工作流、边界、失败和恢复方式；
4. 规则正文到底规定了什么；
5. 每个 Skill 能做什么、什么时候使用、怎样验证；
6. 当前哪些证据通过，哪些缺失，哪些只是候选。

它不是简历、营销落地页、活动流、后台管理器或仓库浏览器。

## 项目清单

项目注册表是 `config/panel-projects.json`。

- 单项目内容 MVP 和三项目本地版已完成用户验收；当前只新增 ChineseASR，项目顺序为 `.agents`、PCConfig、GitHub 总索引、ChineseASR（1/2/3/4）。
- 注册表支持未来增加几十个项目，不以 MVP 数量作为长期上限。
- 网站源项目本身不进入项目清单，避免自我套娃。
- 项目默认 `presentation_mode=real_dashboard`：真实、详细地展示架构、状态、缺口和证据。
- 只有用户明确指定的包装项目可以使用 `curated_packaging`；不得从“公开”自动推导为包装。

## 信息架构

顶级导航只有：

- 项目；
- 规则；
- Skills。

当前路由：

```text
/                         项目清单
/projects/agents          .agents 总览
/projects/agents/:module  六个真实模块
/projects/pcconfig        PCConfig 总览
/projects/pcconfig/:module 六个真实模块
/projects/github-index    GitHub 总索引总览
/projects/github-index/:module 六个真实模块
/projects/chinese-asr     ChineseASR 总览
/projects/chinese-asr/:module 六个真实模块
/rules                    五份规则，一个页面内切换
/skills                   按价值排序的 Skill 清单
/skills/:skill            Skill 完整详情
```

没有 Ideas、About、博客、分类导航、未来占位卡或网站自身项目。

## `.agents` 内容标准

总览至少维护：

- 负责与不负责；
- 当前 E release、PRIVATE main commit、current/previous、五文件 ruleset、source checkout 和 Skill 供应状态；
- 英文术语及中文解释；
- 从用户目标到完成回读的真实流程；
- 当前组件表；
- 用户怎样自然表达任务；
- 总览和六个项目模块；每个页面在自己的内容里解释本页术语；
- 分层验证矩阵；
- Source、Test、Install、Publish、Fresh task、E2E、User acceptance 各自能证明和不能证明什么；
- 维护入口；
- 演化时间线；
- 快照更新语义。

每个模块先说明实际用途、为什么需要、真实例子和最终结果，再说明当前实现、执行流程、本模块名词、边界、失败恢复、真实入口、验证和模块关系。

## 规则内容标准

规则页显示 `Invoke-EAgentRulesRelease` 正式回读的 current E release，不把 dirty/unreleased source 冒充 current，也不读取 C 盘旧 authority。

每份规则都必须有：

- 一句人话作用；
- 适用范围；
- 它负责判断什么；
- 英文术语与中文解释；
- 按原规则结构展开的完整语义清单；
- 必须、禁止、失败关闭和恢复；
- 典型执行顺序；
- active release path、canonical source、E 代号、commit、ruleset、SHA、大小与逐文件关系。

解释层不能替代活动规则，但也不能只复制原文让用户继续猜。

## Skills 内容标准

Skill 清单按当前实际价值从高到低排列，不做分类 Tab。

页面必须同时区分“供应清单 active install intent”和“公开 MVP 收录”。当前快照为
24 个 active install intent、公开收录 22 个；未公开的 2 个有明确内容边界，不能把
22 写成完整供应总数，也不能因为未展示就声称它们不可用。

每个 Skill 详情维护：

- 中文用途；
- 它解决的现实问题，以及有它以后会改变哪些继续、停止、改道或恢复动作；
- 当前安装、运行和成熟度；
- 适合与不适合的场景；
- 输入与输出；
- 实际流程；
- 边界；
- 依赖；
- Source、Install、Transaction、Current task、Fresh task、End to end 六层状态；Regression 作为额外证据单独展示；
- canonical source。

`install=true` 只表示安装意图，不自动等于 Current task、Fresh task 或 E2E 通过。

## 搜索

唯一搜索框位于全站顶部，搜索范围包括：

- 项目总览、组件、术语、维护入口和演化；
- 模块问题、流程、边界、失败与来源；
- 五份规则的摘要、术语和逐条语义；
- 所有 Skills 的用途、场景、输入、输出和流程。

中文连续词支持双字模糊匹配；直接标题和完整短语优先排序。

## 视觉与交互

- 白底、纯绿强调、真实官方外部图标；
- 桌面、平板、手机顶部保持单行；
- 页面优先信息密度，压缩空白，不压缩内容；
- 项目卡摘要区域进入总览，卡片底部直接显示总览和全部模块入口，不加“进入项目”按钮或下拉框；
- 当前模块能放下时单行等分；未来模块增多时每行最多七个，下一行按实际数量重新等分；
- 桌面端 100% 浏览器缩放就是正式设计尺度，不能要求用户改成 125% 才获得可读比例；
- 项目侧栏固定、可滚动、显示滚动条，当前项自动可见；
- 规则 selector 支持鼠标、触屏和方向键；
- 全站不出现页面级横向溢出；
- 固定背景只按时间连续运动，不读取 scrollY，因此滚动不会重置或折断动画；
- reduced motion 下背景停止运动。

## 刷新与项目任务

刷新是事件驱动、带阈值的，不是 watcher 或定时同步。

1. Source 项目先完成自己的修改、测试、发布和 read-back。
2. `scripts/assess-panel-impact.mjs` 只判断 changed path 是否可能影响清单，不自动创建任务。
3. Source Owner 只有在确认页面上的事实、解释、边界、成熟度或用户判断会实质失真时，才标记 material change。
4. 达到阈值后创建一个全新、独立、单目标的网站任务；完成后不复用。
5. 网站任务读取 `config/panel-projects.json`，只更新受影响项目，完成测试、浏览器 QA、normal push 和 Pages read-back。

格式、注释、重构、时间戳、hash-only 漂移、已被页面准确描述的 dirty/unreleased source 或其他不改变用户判断的小变化，不创建异步任务，可以等待下一次实质刷新。

## 验收

单项目内容 MVP 只有在以下事实同时成立时才通过：

- `.agents`、五规则和每个展示 Skill 都能脱离旧对话被用户理解；
- 术语不再作为谜语，首次使用有中文解释；
- 真实状态、dirty source、失败和 unknown 没有被美化；
- 搜索、导航、规则切换、项目侧栏和响应式布局可用；
- 自动化测试、构建、直接路由、自定义 404 和本地用户预览通过。

单项目内容 MVP 和三项目本地版已通过；当前四项目内容已经完成建设且不增加第五个项目。规则权威由 verified current E release 动态提供；用户已明确要求本轮快照验证后发布。最终完成仍要求浏览器 QA、PUBLIC main、Pages deployment 和公网 read-back 指向同一提交。
