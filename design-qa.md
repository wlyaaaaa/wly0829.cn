# 当前网站验收：E101、daily-preferences 与 DevConfig Backup

## 结论与范围

当前候选以已发布并回读的 `be722bc` 为事实基底：保留该提交中的 E101、`daily-preferences` 按需自动增量快照、相关 Skills 和 320px Rules 换行修复，再新增固定价值顺序 `#12 devconfig-backup`。最终规划仍是 35 个独立项目；本次完成后为 23 个已发布项目、12 个待建设项目，下一个仍是 `#15 scripts`。没有提前生成下一项目卡片、内容或路由，非项目卡 TODO 仍为 0。

## 继承的 E101 与 daily-preferences 事实

- 活动规则为 E101：release commit `c5684d7060a3276f3abd2cc49a5950569726998b`，ruleset `f79057f023ba55f76995f696a29b51adb1dd0b213fdb19b3126cd25fd4d6d465`，previous=E100。新增删除后备只在 Codex 命令层于进程启动前明确拒绝时使用 Windows 回收站；普通文件占用、权限或路径错误不触发。
- `daily-preferences` 来源仍绑定 PRIVATE main `d7f53b8ca0d54b9a61719499af669e216e083f15`。当前数据库为 schema v2：119,382 条 current、160,574 条总记录版本、41,192 条历史记录；18 个来源实例中 12 个 `acquired_verified`、6 个 `snapshot_only`。
- Chrome 与 Steam 走本机读取，哔哩哔哩复用当前已登录 Chrome；Google Play、航旅纵横和 12306 保持人工快照，另有 7 项来源明确未取得。它不是后台同步，不新增 watcher、服务、队列或定时器。
- `daily-preferences` 的公开聚合、Skill 触发和来源边界保持 `be722bc` 的验收结果；本次 DevConfig 施工不改写这些事实。

## DevConfig Backup 的 Gemini 审查与修正

- Gemini 的四模块、三层阅读、System 链接与排序方向可复用，但原候选把早期 65 MB / 38 GB、Drive 就绪、五个现役任务、固定 PowerShell 5.1 和半小时恢复写成当前事实，因此没有原样发布。
- 源项目 `wlyaaaaa/devconfig-backup` 已把人类入口修到当前行为并发布为 `a067b587aa293b5d2bd611c23d8fbd0246f240fe`。8 个 PowerShell 测试脚本与 18 个 PowerShell 源文件解析通过；原生恢复测试因官方微信运行而按设计跳过合成 Execute 分支，不能冒充真实恢复。
- 当前配置 `latest.zip` 为 1,911.3 MB；本地与 `G:\80_Backup\DevConfig` 各有 7 份日期包。G 盘微信热备为 41.89 GB / 142,693 文件，Hot 回执为 `complete` 且不输出 payload 文件名或正文。
- 四个本仓库常规任务最近为 3 个成功、配置 Drive 日任务 1 个失败；当前只读 preflight 已恢复可达，但远端 `latest.zip` 仍对应 9 月 2 日，本地/G 已到 9 月 3 日，本轮没有上传。配置包每个新代上传完整日期 zip 和同内容 `latest.zip`，不是包内差量。
- PCConfig 的 `AIRecoveryColdSync-Daily` 已启用；最近返回 0，但有界回执明确为 `status=skipped` / `H_unavailable`，没有发生冷拷贝。H 只有在人工解锁、整体 Hot context 不超过 48 小时、DevConfig/微信各不超过 36 小时、介质身份、100 GiB 停写线与写锁全部通过时才执行 `additive_no_mirror`，且不自动重锁。
- 微信 Drive 支持 Hot / Local / Drive、完整数据、临时 `DbOnly`、`DriveFull` 兼容覆盖和人工看守下的 `MaxTransfer 0`。默认 8G 只限制一次进程；任务重试的累计流量另算。WAL/SHM/journal 不被过滤，但运行中逐文件复制仍不是一致数据库快照。
- Restore-WeChat 支持默认 G、本地/USB `BackupRoot` 与尚未真实联网验收的 `DriveOnly`。预检拒绝盘根、源目标重叠/父子关系和重解析点；复制失败时把部分结果移到 `.failed-restore-*`，再恢复 `.pre-restore-*`。复制完成仍需登录官方微信验收。
- 四个常规任务的 Action 是 `wscript.exe`；隐藏 VBS 优先 Program Files 下的 PowerShell 7，缺失时才选择 Windows PowerShell 5.1。事务注册会拒绝非本项目同名任务、保存精确 XML 前像、逐项回读并在失败时恢复原定义。

## 当前验证状态

- DevConfig 源项目完成并发布；网站候选的 4 个模块、23 项固定排序、搜索、统一 snapshot 投影和相关聚焦测试已经通过。
- 候选在 1440、390、320 三档检查项目目录、Overview 和 4 个模块：所有路由返回 200，document/body 宽度等于视口，H1 未裁切，浏览器 console/page error 为 0；项目卡原生导航可直达 Overview。
- 最终 E101 snapshot、全站测试、PUBLIC 内容门、精确 gzip、独立盲读、GitHub Pages 与公网回读会在合并到最新主线后重新运行并在本节更新；本地候选结果不能替代最终发布。
