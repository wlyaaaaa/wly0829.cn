# 十五项目 MAP 设计与产品验收

## 本轮范围

本轮只建设第 15 项“日常偏好与个性化推荐（daily-preferences）”，没有预建后续项目。它使用 `real_dashboard`，公开路由为 `/projects/daily-preferences`，模块由源能力决定为 5 个：当前/历史与纠正、来源与人工增量、自然问题与最小证据、具体事实与原件、推荐菜单与选择权。

页面继续复用既有 React、Vite、构建时完整路由、原生目录导航、三阅读层、方法画布与紧凑搜索；没有新增服务、数据库、图表库、页面专属客户端脚本、正文 fetch、dynamic import、spinner、skeleton 或图库。该项目没有真实视觉产物，`gallery=[]` 是真实性决定，不是内容缺失。

## 权威来源

- `daily-preferences` PRIVATE `main=4bcc37c295ba0476d4965eb5cd47244dd4b38654`，本地 HEAD、cached `origin/main` 与实时远端一致且 clean。
- v0.6 行为闭合于 `821ee49ae954549f16dd454a5f9ef81c80be7180`；后续四个 docs-only 提交只保存当前验收、格式与证据边界，不改变行为。
- `CURRENT_ACCEPTANCE.md` 是当前聚合验收的单一耐久文档：不自写包含自身的动态 main tip，不保存私人正文、账号、订单、路径或凭据。
- `daily-preferences` Skill 由 `.agents` PRIVATE `main=6a9e1b0704cd86c4674ddc4521a3aae04cb6356f` 提供；SKILL.md 为 6,889 bytes，SHA-256 `b0b4735c37fae0eb4c675740993665f4500f838b6342e72aa2f2a06d349ca552`。
- 活动 E 规则保持 E98：release commit `e1c1e3644b6c3d2c74eeb2fd0a469444e81c7290`，ruleset `2fcb55e00a416352cc680d0bb25dd9744703cb455f1d6508e249c0a68890c7a8`。

## 产品本质

这不是自动推荐模型或中央画像。它是一个本地、人工增量的偏好证据项目，加上一套由 Skill 与当前 AI 执行的推荐交互规则：

- 用户自然表达、纠正、选择并决定何时提供增量。
- Python 项目拥有来源、记录版本、current/history、证据查询、具体事实、推定失效与原件验真。
- Skill 与当前 AI 负责路由、证据判断、熟悉/相邻/新鲜菜单和搜索接力。
- 原件继续由订单、支付、行程与对话来源 Owner 保管。
- 外部平台拥有当前价格、门店、菜单、优惠和最终购买可用性。

页面把“买过”“付款旁证”“本人表达”“推定”和“明确喜欢”分开。真实公开 L2 样例只保留产品理解所需的事实链：51 条农夫山泉苏打天然水/苏打水订单观察、44 个成功状态、7 个关闭状态、三年范围与 10 个文本/规格变体；长期成功复购支持高可能偏好推定，但不等于本人已经明确说喜欢。

## 源项目自动修复

首次全量审计先修源项目，再建设页面。v0.6 当前覆盖：

- `ingest` 默认从危险的 `full` 改为 `incremental`；完整快照必须显式选择且有 gap 时不退出旧 current。
- Didi 只接收网约车订单 TXT，目录过滤旁系导出，空/不识别/错误格式失败关闭。
- 显式合法+错误文件混合时，在数据库连接前整体拒绝。
- 连续三次相同 full 不清空 current；A→B→A 能恢复旧权威 artifact。
- incremental coverage 只扩不缩；不可重算 gap 不会被无关成功包清掉；信用卡缺月按 current 月份重建。
- Excel serial 按中国本地时间解析，不再固定多 8 小时。
- 乱序回溯表述重建相邻、不重叠时间线。
- 推定必须绑定至少一条 current 证据；来源或用户明示变化后 stale。
- 中文查询不再只看最近 1,000 条；扩展域不会 KeyError；疑问、假设和替他人询问不标本人表达。
- `original` 先核 artifact SHA-256；ChatGPT 再核消息 hash，PDF 从同字节制品重新抽取并做窄掩码，其他类型明确返回已验制品缓存片段。
- 本地索引只在选定支付、信用卡和行程字段掩码邮箱、独立 7–19 位数字和支付末四位；它不是全局匿名化，也不修改原件或模糊普通事实。

当前源码回归 40/40，通过 `py_compile` 与 diff check。

## v0.6 当前数据迁移

真实迁移前用 SQLite backup API 建立 preimage，并在副本完整演练；任一断言失败会恢复数据库与 `CURRENT.md`。

最终现场：

- 10 个非人工来源全部迁移到 v0.6，最近 import 均 success。
- current 键 54,283→54,283，missing 0、extra 0。
- 总记录 61,388，FTS 行数 61,388，来源制品 75。
- 微信支付时间修正 1,749 条，其中 841 条回到正确日历日。
- 六个旧推定先按新 revision 正确 stale，再用映射到新 current 版本的原证据重建；当前证据数为 3、7、11、6、8、4。
- SQLite `integrity_check=ok`、外键 finding 0；当前来源 gap 1。
- 11 个来源实例为 9 acquired_verified + 2 snapshot_only；未取得来源明确为银行交易、京东订单、拼多多订单、美团订单、菜鸟物流。

75 份来源制品足以重放非人工记录层；CURRENT 只能从尚存 SQLite 重建。用户明示、推定与历史没有独立恢复输入，完整 SQLite 丢失恢复尚未建立。

## 三条实现盲自然请求

宿主创建三条 evaluator 时固定 `gpt-5.6-sol / max / child`、`fork_turns=none`，三条均收到 terminal final。提示只表达自然用户意图，没有点名 Skill、命令、Provider、内部路径或预期路线。

### 开放式吃喝推荐

- 自主选择日常偏好能力并分开吃/喝。
- 交付熟悉稳妥、相邻探索和合理新鲜三类菜单，每项有理由与取舍。
- 需要实时信息时给相关平台和可复制关键词。
- 明确订单不等于满意，相邻/新鲜是推测。
- 未联网核价、下单、写偏好或读取原始订单表。

### 增量准备

- 逐个列 11 个 source instance 的覆盖、快照、gap、材料、重叠与 mode。
- 两个 ChatGPT 账号、两个 Gemini 快照分别列出，最后单列 5 个未取得来源。
- 零扫描、零导入，不改业务数据或 SQLite 主文件；只读 SQLite 可能更新 `-shm` mtime。

### 具体苏打水事实

- 51 个独立淘宝订单观察：44 成功、7 关闭。
- 82 条支付生命周期记录只作支付/关闭/退款旁证，不能算 82 次购买。
- 两个消息节点只证明具体产品身份和洁净度预期，没有一句明确说喜欢。
- 结论保持为长期成功复购支持高可能推定，不升级为明确喜欢。

## 页面与接线

- Registry：第 15 项、`real_dashboard`、PRIVATE source、5 模块、3 类 impact source；不公开 `local_root`。
- Projects：15 张项目卡，第 15 张直达总览与 5 模块。
- System：完整详情页计数 15；日常偏好资产直达项目，Skill 节点保留自然请求入口。
- Skill：项目 ownership 指向 `recommendation-choice`；供应、当前状态与三条 E2E 分层说明。
- Search：“吃什么”首项为推荐菜单；“根据我的偏好怎样取证”首项为证据模块；full 与 compact 结果按 href 去重。
- SEO/路由：总览、5 模块、Skill、System、搜索 shard、canonical、Open Graph、sitemap 与 trailing slash 由现有生成链产生。

## 视觉与流畅性

- 桌面速览、产品、技术三层没有大片空白；六步方法画布和三方责任在一屏内建立产品心智。
- 320/390/768/1440/1800 CSS 视口均 `scrollWidth === clientWidth`，overflowing node 0。
- 320/390 长标题为两行；768+ 为一行；阅读层、指标、项目入口和 5 模块导航无裁切。
- 390px ArrowRight 可从速览切到产品并同步焦点、`aria-selected`、可见 panel 与 hash。
- 该项目无图库，避免把虚构仪表盘冒充真实产品 UI。
- 共享客户端无正文 fetch、dynamic import、spinner 或 skeleton；每条路由在构建时包含完整正文。
- 品牌 PNG 在移动端实际可见且跨页缓存，不属于隐藏下载；若未来真实公网首载出现压力，再评估较小响应式资产，不为假设问题新增二进制。

## 本地验收

- 静态输出：145 个完整项目/内容路由；含 404 与百度验证页共 147 个 HTML。
- 搜索：165 条通用记录 + 96 条项目正文 = 261；daily shard 5 条。
- shared JS：10,133 bytes gzip / 12,288 budget。
- shared CSS：21,019 bytes gzip / 21,504 budget。
- shared search：54,718 bytes gzip / 65,536 budget。
- all-project search：60,587 bytes gzip / 65,536 budget。
- daily search shard：3,051 bytes gzip / 8,192 budget。
- snapshot gate：PASS；PUBLIC gate 扫描 395 文件，0 finding。
- 网站合同：74/74 pass。
- 源项目：40/40 pass，数据迁移与三条自然请求 PASS。

## 四路独立终审

- source-independent coverage：P0=0、P1=0、P2=0，PASS。
- product / first reader：P0=0、P1=0、P2=0，PASS。
- technical truth / public boundary：P0=0、P1=0、P2=0，PASS。
- UI / mobile / performance / bloat：P0=0、P1=0，PASS；品牌 PNG 与预算余量保留为非阻断观察，不制造新架构。

## 当前产品缺口

以下缺口已在项目页准确公开，不是审核遗漏：

- 支付 exact link 尚未自动压制 evidence 候选，Skill/AI 仍负责把付款解释为旁证。
- 权威 full 的有效空快照语义尚未逐平台证明，当前失败关闭。
- `CURRENT.md` 写失败发生在数据库提交后，尚无显式 `db_committed/cache_stale` 回执。
- 没有正式导出、数据库丢失恢复或跨机器迁移入口。
- `facts.variant_count` 是本次返回数，不是 limit 之外的全量变体总数。
- 扩展域支持自然路由与明示/通用证据；同等专门 parser/权重/回归目前只有吃喝、购物、支付、出行。

## 发布状态

最终本地产品、技术、浏览器、搜索、性能、PUBLIC 内容门和四路独立终审均 PASS，可以进入已授权的现有 PUBLIC `main` 发布。

Git commit、远端 `main`、Pages run 与公网内容属于发布时动态事实，必须由 GitHub 与线上站点现场回读；本文件不预写尚未发生的 commit/run，也不替代最终发布证据。只有本地 HEAD、远端 `main`、Pages deployment commit 和公网 System/Projects/总览/5 模块/Skill/Search 同时一致，才能正式报告完成。
