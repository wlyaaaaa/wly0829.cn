# Sunshine 远程串流第 22 项：产品、内容与视觉验收

## 结果与范围

本轮只建设并验收第 22 项 `sunshine-remote-streaming`，没有创建第 23–25 项卡片、路由或占位内容。页面沿用现有 Registry（登记表）、React、Vite 与 GitHub Pages 静态生成链；新增的是一份项目内容、五个源项目边界决定的详情模块、专项测试及必要的通用移动端压缩，没有新增网站运行时、服务、数据库、守护进程、图片或点击后正文加载。

最终内容门由全新 Sol-family（Sol 家族）审查者从源规则、README、代码入口和测试独立重建产品轴后给出 `PASS`：P0=0、P1=0、P2=0。浏览器门覆盖总览与五个详情页；当前候选可以发布，但真实手机串流、物理显示故障转移、登录前捕获和冷开机仍是明确未测项。

## 对 Gemini 初稿的验收

Gemini 的优势应保留：它用“远程端只剩壁纸”“拔掉主屏线后窗口怎么办”“50 Mbps 会不会更清楚”“关机后怎样叫醒电脑”等普通问题建立场景，比纯工程报告更容易理解；总览、五个模块、自然搜索与三层阅读结构也都有效。

初稿不能直接通过的原因不是语言生动，而是把愿景、README 建议、源码能力、配置状态和真实 E2E（端到端验证）混成全绿结果：它曾声称任何地方秒连、15–30 ms、无丢包、关屏后无缝切 VDD、窗口必然回迁，以及智能插座冷开机已经绝对可靠。当前版本保留这些场景，但全部改成条件、证据和未测边界；五个模块与总卡片均使用 `mixed` 状态。

## 源项目修复与验证

- PRIVATE 源仓库 `wlyaaaaa/sunshine-remote-streaming` 已发布 `70d65059ce122b5a872b97c2f5130ab3e824fab7`，本地 `main`、`origin/main` 与远端回读一致，工作树干净。
- 源规则要求当前启动周期出现 Kernel-Power 41、BugCheck、`nvlddmkm` 或匹配 WER 1001/1019 图形故障时失败关闭。旧实现漏了 BugCheck 与 WER 1019；当前提交已补齐查询、结果计数和合成回归，同时明确用户实际看到黑屏或整机卡死时不能依赖事件查询继续操作。
- README 已按现场更新 Sunshine/Tailscale 版本、Realtek 有线链路状态、WoL 未验边界和 PRIVATE 仓库措辞；不再把旧版本、未插网线或公开仓库写成当前事实。
- 四套强制测试均通过：捕获故障转移 67/67、headless（无头配置）15/15、VDD 设置 19/19、原生适配器静态套件通过；17 个 PowerShell 文件解析 0 错，`git diff --check` 退出 0。
- 测试只证明合成身份选择、去抖、窗口计划、CAS（比较并交换）、配置事务与失败关闭，不证明真实拔线、手机画面、输入、HDR、码率、登录前捕获或冷开机。

## 当前运行态与未修复边界

- 2026-09-04 只读回读：Sunshine 2026.516.143833、Tailscale 1.102.2；两项服务均自动启动且正在运行，捕获守护任务正在运行，每日巡检最近一次结果为 0，Sunshine 编码掩码支持 HEVC/AV1 Main10。
- 只读显示选择器只找到一个健康、Present/OK、EDID 与 `Root\MttVDD` backing 均验证通过的 VDD；现役 `sunshine.conf output_name` 与该 VDD及所有活动输出都不匹配。状态文件仍为 `Mode=Vdd`、`PendingTargetKind=Physical`，且最后更新于 2026-09-03。
- 精确运行范围已经正规接管；写入前确认无已建立串流会话、自动显示键保持禁用、服务仍健康。但当前启动周期命中 22 条匹配 WER 图形故障记录，GPU 门返回 `BlockedByGpuStability`。这里的 22 是日志记录数，不等于 22 次独立崩溃。
- 因 GPU 门阻断，没有写配置、没有重启 Sunshine、没有改显示拓扑/VDD 参数/物理屏/LIAN LI/HS2/驱动，也没有动 ToDesk；配置文件前后哈希一致。
- 当前本机 IPv6 可用、Tailscale online 且 unattended；每日巡检没有指定手机 peer，因此 direct（直连）/DERP（中继）仍为 Unknown（未知）。巡检还看到另有用户配置的 Funnel，但没有证据把它归因于 Sunshine。
- 智能插座 + BIOS 来电自启、有线 WoL 与纯无线 WoWLAN 都只按方案和限制说明；没有断电、魔术包、登录前画面或手机端冷启动实测。

## 内容修正与完整性

- Overview（总览）先讲用户得到的运维能力，再把源码、测试、配置、服务、peer 路径、手机 E2E、物理故障转移和冷开机分层；当前 `output_name` 不一致与 GPU 阻断直接可见。
- 五个模块分别覆盖主屏/VDD 捕获与窗口恢复、VDD 独立参数、传输路径分类、码率/编码建议、远程开机与在线修复；模块数量来自源项目，不为视觉对称填充。
- 补齐 Sunshine/Moonlight/Artemis 的画面、音频、触控、键鼠、手柄与 ViGEmBus 边界；手机输入和手柄映射仍明确未做 E2E。
- 补齐人工应急固定 VDD 的产品场景：它只在本人明确选择时原子更新 7 个受管配置键并留备份，不自动重启、写后回读或回滚；恢复日常策略要重新运行主屏优先守护。
- 删除不存在的 `vdd-display-profile.v1` 与 `sunshine.headless-config.v1`；只保留源码真实的 `sunshine.capture-failover-state.v1`。VDD 技术层准确列出 `Get-SetVddDisplayMode.ps1` 与 `Get-SetVddScaleHdr.ps1`。
- 当前版本和里程碑来自现场与 Git 历史，不再把 Tailscale 1.98.4 或错误日期写成 2026-09-04 当前状态。
- 专项测试由保护候选口号改为反冒充合同：不再要求“不出海、强制 CBR、远程冷开机已成”等假成功，转而要求当前阻断、未测项和人工应急边界必须出现。

## 网站测试、构建与浏览器

- `npm test`：136/136，0 失败；Sunshine 专项 12/12。
- 最终静态构建生成 198 个 HTML 路由和 303 条紧凑搜索记录；PUBLIC gate 扫描在最终提交前再次执行，必须保持 0 finding。
- 共享 JavaScript gzip 11,596 B（阈值 12 KiB）；共享 CSS gzip 21,164 B（阈值 21 KiB）。
- 全站紧凑搜索 gzip 115,025 B（阈值 113 KiB）；全部项目模块搜索 145,121 B（阈值 142 KiB）；Sunshine 分片 5,875 B（阈值 21 KiB）。预算只按新增的真实阻断与解释最小提高，没有复制正文、依赖或新加载层。
- Chromium 在 1440、390、320 三档直接打开总览与五个详情，共 18 次均返回 200；页面级横向溢出、console error、page error 与 request failure 均为 0。
- 速览、产品、技术三层的鼠标与键盘切换通过；禁用 JavaScript 后总览三层全部展开，五个详情仍有完整静态正文。
- 320 宽详情页原先要到 y=819.7 才看到模块标题，且面包屑被裁切。通用移动端修复不再重复项目 lead，保留项目身份卡；五个详情标题均提前到 y=564.2，面包屑 `clientWidth=scrollWidth=288`，标题也不再留下单字孤行。
- 本地 Vite preview（预览服务器）对未知路径会回退首页，不能冒充真实 404；最终 404 必须在 Pages 发布后公网回读。

## 复杂度与发布边界

内容修复删除了假成功、重复口号与虚构合同，没有删减真实功能。移动端只增加一个通用 module hero（模块页头）类和窄屏样式，不为 Sunshine 做一次性 CSS 特判。`.agents` Owner Registry 的完整隔离回归通过；`RecoverInactiveTask` 本来就支持未归档终止任务，存在可写 session 句柄时拒绝外部强抢是正确并发门，因此没有为本次模型路线错误修改 `.agents`。

本文记录发布前稳定候选。最终 Git、Pages 和公网状态以 normal-push 后的远端 `main`、Pages head SHA、六条 Sunshine 路由、搜索、sitemap 与真实 404 回读为准。
