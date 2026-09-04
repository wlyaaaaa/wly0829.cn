# 当前网站验收：daily-preferences 按需自动增量快照

## 结论与范围

本轮从已经发布并回读的 `f960f3a99df07c9397220ccf5e7f57669295c460` 开始，主体只更新已登记项目 `daily-preferences` 的对应快照，以及直接展示同一能力且不更新就会错误的 Skill 说明与指南。来源是 PRIVATE `wlyaaaaa/daily-preferences`，本地 `main`、`origin/main` 与远端 `refs/heads/main` 均回读为 `d7f53b8ca0d54b9a61719499af669e216e083f15`。

最终门禁运行期间，活动规则从 E100 升级到 E101；E101 同时正式激活本轮使用的对话触发 `daily-preferences` 与活动发布 Owner 合并式 `personal-panel-refresh`，旧 E100 生成事实因此被 snapshot gate 正确拒绝。当前发布者只合并了这项发布前硬依赖：更新 E101 五文件/供应快照、`.agents` 当前说明、两个直接相关 Skill 的来源状态，以及根规则新增的 `codex_command_blocked_delete_fallback`。这个后备路径只在 Codex 命令层于进程启动前明确拒绝删除时改走 Windows 回收站；普通文件占用、权限或路径失败不触发。

System、其他 21 个项目、项目排序、路由结构、视觉组件和交互代码保持不变。固定 35 项价值顺序仍然有效：35 个独立项目中 22 个项目已经发布、13 个项目仍待建设。两个 Registry 计划都只是定向单项目计划，没有运行 `--all`。当前页面不再把 E100、v0.6 人工增量、13 个来源、7 个快照、43 项测试和“Chrome / 哔哩哔哩 / Google Play / 航空 / 铁路未接入”当作现状。

## 来源事实与语义变化

- 当前产品是由新对话自然触发的同步按需自动增量。Chrome 历史/书签与 Steam 从本机读取；哔哩哔哩复用用户当前已登录的 Chrome，采集当前可见的播放、收藏、稍后看、点赞、投币和追番/追剧。它不是后台同步，不创建服务、队列、定时器或 watcher。
- Google Play、航旅纵横和 12306 保持人工快照；没有新包时不伪装实时刷新。银行交易、京东、拼多多、美团、菜鸟、YouTube 与地图活动仍是 7 项明确未取得来源。
- 当前数据库为 schema v2：119,382 条 current、160,574 条总记录版本、41,192 条历史记录；18 个来源实例中 12 个 `acquired_verified`、6 个 `snapshot_only`；26 条 current 明示、3 条 historical 明示与 15 个 current 偏好快照。`integrity_check=ok`，外键 finding 为 0。
- 哔哩哔哩当前聚合为 3,375 条播放、719 条收藏关系、5 条稍后再看、20 条点赞、2 条投币和 277 条追番/追剧。平台不返回的更早范围仍明确 Unknown。
- Steam 当前为 118 条已玩游戏、6 条已玩应用、8 条未玩游戏观察和 33 条其他应用观察。累计启动时长只保留为事实、不参与评分；当前免费游戏只在其他条件相同时低 0.5 分；当前商店分类不能证明历史取得方式。
- 退款、关闭、取消、失败和撤销继续完全退出普通偏好证据与复购计数。一次成功的耐用品、软件或行程仍是正向事实，不因没有复购被降成不喜欢；时间只排序，无记录也不反推不喜欢。
- 数据根、用户投递原件和哔哩哔哩实时快照处于现有 PersonalData 自动备份范围；这不冒充已经验收过的独立导出、跨机迁移或灾难恢复产品。

## 内容与公开边界

项目总览和五个既有模块在原位更新，没有新增卡片、重复模块或刷新日志。Skill 页同步更新了 `daily-preferences` 的触发条件、输入输出、自动/人工来源分层、当前测试与 E2E；`personal-panel-refresh` 和 `browser-control-continuity` 只把 source main / 活动 E 代际改为现场值。Rules 只补 E101 新增删除后备语义，System 现有概括仍然准确，因此保持字节不变。

公开页只使用聚合数量、普通 L2 事实样例、源码/测试身份和行为边界。它不公开账号 ref、浏览 URL、完整游戏或播放清单、商家—金额—时间组合、行程起终点、原件定位、原始聊天或凭据。Skill 当前源码的公开供应指纹已回读为 10,183 bytes / `eebbdb9bfc8f8e5380458a483e6c2c7a61eb60f929f7b2e9502d4beea140c04a`。

## 验证

- 来源仓库：64/64 Python 回归与 4/4 Node 回归通过；Python 编译、Node 语法、`git diff --check`、SQLite 完整性和外键检查通过。
- 当前数据：只读聚合回读了来源、状态、记录、明示、快照、哔哩哔哩流、Steam 分类和普通苏打水事实；没有把私人正文或 locator 写入网页。
- E101 snapshot：release `c5684d7060a3276f3abd2cc49a5950569726998b`、ruleset `f79057f023ba55f76995f696a29b51adb1dd0b213fdb19b3126cd25fd4d6d465`、pointer revision 9、previous=E100，五文件与 release descriptor 匹配；`.agents` source 的 1 个并发 dirty 候选与活动 release 分层，不冒充 current。
- 语义 bundle：`wly.ai-panel-refresh-verification.v2` 为 PASS；`daily-preferences` 项目、authority、Rules 与 Skills changed，System unchanged，0 blocker。
- 聚焦合同：`daily-preferences` 项目合同、Skills catalog 合同、E101 Rule binding 合同与所有项目统一 snapshot 投影合同通过。
- 本地浏览器：项目索引、daily-preferences 总览/来源/证据模块、daily-preferences Skill、`.agents` 总览、Rules 与 personal-panel-refresh Skill 在 1440、390、320 三档检查；无整页横向溢出、H1 裁切或 console/page error，canonical 均为 Pages 实际使用的尾斜杠 URL。
- 最终全站门禁：`npm run build` 与 `npm run test:built` 通过，生成 199 个完整静态页面和 304 条紧凑搜索记录；snapshot、PUBLIC 内容、全部 138 项测试均为 PASS。

本文记录发布前稳定候选。最终 Git、Pages 与公网状态以 normal push 后的远端 `main`、Pages deployment head SHA 和公开页面回读为准。
