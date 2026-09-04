# 当前网站验收：E101、daily-preferences 与 DevConfig Backup

## 结论与范围

当前候选以已发布并回读的 `be722bc` 为事实基底：保留 E101、320px Rules 换行与既有项目，再新增固定 35 项价值顺序中的 `#12 devconfig-backup`，并按活动发布 Owner 收到的精确 handoff 合并 `daily-preferences` v0.9.1 与对应 Skill 增量。最终规划仍是 35 个独立项目；本次完成后为 23 个已发布项目、12 个待建设项目，下一个仍是 `#15 scripts`。没有提前生成下一项目卡片、内容或路由，非项目卡 TODO 仍为 0。

## 继承的 E101 与 daily-preferences 事实

- 活动规则为 E101：release commit `c5684d7060a3276f3abd2cc49a5950569726998b`，ruleset `f79057f023ba55f76995f696a29b51adb1dd0b213fdb19b3126cd25fd4d6d465`，previous=E100。新增删除后备只在 Codex 命令层于进程启动前明确拒绝时使用 Windows 回收站；普通文件占用、权限或路径错误不触发。
- `daily-preferences` 来源绑定 PRIVATE main `3275ca76cec37a3c799acbf14a336b31f333cdc1`。当前数据库为 schema v2：120,869 条 current、163,089 条总记录版本、42,220 条历史记录；18 个来源实例中 12 个 `acquired_verified`、6 个 `snapshot_only`，26/3 条明示不变，current 推定由 15 个收敛为 3 个。
- Chrome 与 Steam 走本机读取，哔哩哔哩复用当前已登录 Chrome；Google Play、航旅纵横和 12306 保持人工快照，另有 7 项来源明确未取得。它不是后台同步，不新增 watcher、服务、队列或定时器。
- v0.9.1 让可靠同订单链全额退款退出普通偏好/复购/快照支持但保留原始事实，partial/组单/关联不唯一保持 Unknown；信用卡只作支付旁证。B 站数据库 current 播放为 3,382，本次窗口 1,349，current set 为 719 收藏、4 稍后看、277 带类型追番/追剧，点赞 20、投币 2 仍是窗口观察。
- `.agents` source main 已到 `a3ed133d38386edbb93ad6c0ccdf68d5d0bf02da`，daily-preferences Skill 为 11,084 bytes / `b0ddad277748ce8f2118e515ae29ddc6e5532a8a32d0d29d5463062c793df948`；活动规则仍严格是 E101 / `c5684d7`，没有冒充新 E release。

## DevConfig Backup 的 Gemini 审查与修正

- Gemini 的四模块、三层阅读、System 链接与排序方向可复用，但原候选把早期 65 MB / 38 GB、Drive 就绪、五个现役任务、固定 PowerShell 5.1 和半小时恢复写成当前事实，因此没有原样发布。
- 源项目 `wlyaaaaa/devconfig-backup` 已把人类入口修到当前行为并发布为 `8460be6e9a281f7030f1756cb610678254a49c19`。8 个 PowerShell 测试脚本与 18 个 PowerShell 源文件解析通过；原生恢复测试因官方微信运行而按设计跳过合成 Execute 分支，不能冒充真实恢复。
- 当前配置 `latest.zip` 为 1,911.3 MB；本地与 `G:\80_Backup\DevConfig` 各有 7 份日期包。G 盘微信热备为 41.89 GB / 142,693 文件，Hot 回执为 `complete` 且不输出 payload 文件名或正文。
- 四个本仓库常规任务最近为 3 个成功、配置 Drive 日任务 1 个失败；当前只读 preflight 已恢复可达，但远端 `latest.zip` 仍对应 9 月 2 日，本地/G 已到 9 月 3 日，本轮没有上传。配置包每个新代上传完整日期 zip 和同内容 `latest.zip`，不是包内差量。
- PCConfig 的 `AIRecoveryColdSync-Daily` 已启用；最近返回 0，但有界回执明确为 `status=skipped` / `H_unavailable`，没有发生冷拷贝。H 只有在人工解锁、整体 Hot context 不超过 48 小时、DevConfig/微信各不超过 36 小时、介质身份、100 GiB 停写线与写锁全部通过时才执行 `additive_no_mirror`，且不自动重锁。
- 微信 Drive 支持 Hot / Local / Drive、完整数据、临时 `DbOnly`、`DriveFull` 兼容覆盖和人工看守下的 `MaxTransfer 0`。默认 8G 只限制一次进程；任务重试的累计流量另算。WAL/SHM/journal 不被过滤，但运行中逐文件复制仍不是一致数据库快照。
- 空白新机先安装 Git、取得 PUBLIC devconfig-backup，恢复 GitHub 私有访问后再取得 PRIVATE PCConfig；PCConfig 不存在时机器级设置、任务与 H 阶段明确暂停。Restore-WeChat 支持默认 G、本地/USB `BackupRoot` 与尚未真实联网验收的 `DriveOnly`。预检拒绝盘根、源目标重叠/父子关系和重解析点；复制失败时把部分结果移到 `.failed-restore-*`，再恢复 `.pre-restore-*`。
- 当前 `state/latest.sha256` 没有作为可携带 sidecar 随 G/Drive 包发布。原 state 存活时可比 SHA-256；完全丢失时 `7z t` 只能证明 zip 内部 CRC 可读，强来源哈希保持明确缺口，不能用日期和大小冒充完整性证明。
- 四个常规任务的 Action 是 `wscript.exe`；隐藏 VBS 优先 Program Files 下的 PowerShell 7，缺失时才选择 Windows PowerShell 5.1。事务注册会拒绝非本项目同名任务、保存精确 XML 前像、逐项回读并在失败时恢复原定义。

## 当前验证状态

- DevConfig 源项目完成并发布；8 个 PowerShell 测试脚本通过，18 个 PowerShell 源文件解析通过。daily-preferences 来源 Owner 与独立审查者回读 73/73 Python、7/7 Node；两个 PRIVATE source main 均 clean 并与 origin/main 一致。
- E101 snapshot PASS：`.agents source=a3ed133` 且 clean，active release 仍为 `E101/c5684d7`，5 条规则、29 个 displayed Skills 与 29 个 active install intent 一致。个人 Skill 供应现场为 source/install PASS、41/41 事务终态。
- `npm run build` 与 `npm run test:built` 通过：生成 204 个完整静态页面、308 条紧凑搜索记录；PUBLIC gate 扫描 191 个 source、341 个 dist，共 532 个文件，0 finding；全站 147/147 测试通过。
- gzip 实测为共享 JavaScript 11,562 B / 12 KiB、共享 CSS 20,943 B / 21 KiB、全站搜索 120,748 B / 118 KiB、项目模块搜索 139,481 B / 144 KiB；没有新增运行依赖、服务、数据库或点击时加载。
- 1440、390、320 三档真实浏览器检查 DevConfig 项目目录/Overview/4 模块，以及 daily-preferences Overview/来源/证据/事实模块与 Skill：所有路由 200，document/body 宽度等于视口，H1 未裁切，console/page error 为 0，阅读层与原生项目导航可用。
- DevConfig 独立 source-first 审查修复 5 个 P0 与 6 个 P1 后，最终网页盲读为 P0=0、P1=0；daily-preferences 精确 delta 的 source-first 与纯网页盲读终审均为 P0=0、P1=0、P2=0。盲读者能正确解释全额退款/Unknown、B 站 current set/窗口流、移除不等于不喜欢、3 个 current 与 12 个失效推定，以及 E101 与更晚 source main 的区别。最终 GitHub Pages 与公网回读仍以本批次 normal push 后的 deployment head 为准，本地候选不能替代发布。
