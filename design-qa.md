# OpenClawGateway 第 21 项：产品、内容与视觉验收

## 结果与范围

本轮只建设第 21 项 OpenClawGateway。第 22–25 项登记、卡片、内容、路由和测试均为 0。页面沿用现有 Registry（登记表）、React、Vite 与 GitHub Pages 静态生成链，没有新增网站运行时、依赖、图片、服务、数据库、后台任务或点击后正文加载。

最终信息架构是 Overview（总览）与七个源项目边界决定的模块：渠道交办、模型与成本、Gateway 常驻、受控更新、备份与恢复、部署与 bootstrap（引导安装）、可选 CodeG / Cline 接入。产品主要给 AI Agent（智能体）调用：AI 先读状态、选择最窄入口并解释回执；人只在外部发消息、付费模型、更新、常驻修复与灾备激活等影响边界授权，不要求用户经常操作 OpenCode、CodeG 或终端。

System 中既有 `message-ai-gateway` 资产与依赖节点改为直达本项目，没有新增重复节点。本文只记录发布前候选证据；最终 Git、Pages 和公网状态仍以发布后的正式回读为准。

## 源项目修复与产品功能实测

- PUBLIC 源仓库 `wlyaaaaa/OpenClawGateway` 已发布 `aa4f9f1390c68605b5d8135f4077967bf86e0708`，本地与远端 `main` 已完成精确 OID 回读，工作区干净；README、架构与使用文档已明确 AI-first（AI 优先）运维角色，CodeG/Cline 只是可选客户端。
- 旧 `api on/off/toggle` 只认过期凭据层，却能在远程路线和认证仍存在时显示 `API OFF`。当前入口改成只读 `cost_posture.v2`，旧 action 固定 exit 2；真实回读为默认模型 `ollama5090d/qwen3.8:27b`、官方 catalog `local=true`、fallback 空、utility/image unset、自动远程 0、仍可手选远程 21、远程认证来源 5、`global_zero_cost_enforced=false`、session/cron 未核对。
- OpenClaw 2026.8.1 当前 config valid、Gateway RPC 和 health 通过，事件循环未降级；18789 只有一个 loopback（本机回环）监听者。Gateway 开机任务当前 Running，历史码 `0x800710E0`；Heartbeat 开机后每 15 分钟运行，2026-09-03 20:53:23 最近为 `0x00000000`；Update 保留周日 13:00、最多随机延迟 15 分钟的定义，但按设计 Disabled，历史码 `0x00041303` 且没有有意义的最近运行时间。
- 截至 01:56 的三次回读一致：Telegram 为 running/starting、`connected=false`，飞书为 running/starting；两者 lastError 与 lastInbound/lastOutbound 都为空，没有发送测试消息。Google Chat 插件 disabled，因此消息 E2E 为 0/2，当前不称任一渠道就绪。
- stable（稳定）通道当前 2026.8.1；三次目标探针均返回 target 空、relation=unknown、health=healthy。当前网关健康但不能判断是否存在更新；本轮未更新或重启。更新器本身仍覆盖 stable、extended-stable、beta、dev 四通道，`ahead` 也必须完成 health 与全部后验。
- 实际生成 224,287,339 字节 OpenClaw 官方归档，封装脚本与独立 `backup verify` 均通过。恢复只到全新 staging（暂存目录），没有激活、替换现役状态或完成灾备切换。
- CodeG/Cline 当前已有 managed bridge（受控桥接）配置。配置脚本只 upsert（插入或更新）`openclaw-bridge`，保留其他 MCP Server（模型上下文协议服务），畸形 JSON 原字节不变，缺受控启动器不降级为明文；真实 `initialize`、`tools/list` 与工具调用未执行，也不影响 AI 通过其他入口使用本项目。
- 生产现场证明 OpenClawGateway 中旧 `backup-codex-memory.ps1` 与同名隐藏入口没有任务消费者；真实 `Codex Memory Backup` 由独立私人 Owner 实现，而且具备 G 盘哈希热备。源 `191b8bc` 删除这 3 个无消费者文件，本仓库私人设置收缩为 Gemini/Claude/OpenClaw 3 组 16 键；没有改 PCConfig。
- 现场实际是 3 个备份任务承载 4 个消费者：独立 Codex Owner 在 20:05/22:05；本仓库 Gemini 在 20:10/22:10；共享 `OpenClaw Memory Backup` 在 20:20/22:20 先 Claude 再 OpenClaw。另有 Gateway、Heartbeat、Update 和每日 21:15 AutoPush，共 7 个相关计划任务。
- 2026-09-03 20:05/20:10/20:20 三次自然备份均先完成本地与 G 回读，再因同一 GitHub TLS EOF 瞬断在私人远端 fetch 失败并返回 `0x00000001`。Task Scheduler 虽配置 3 次/15 分钟重启，但事件只把 wscript 非零动作记为已完成，没有产生第二实例；因此两位 Owner 都把 30/120/300/900 秒有界重试放进 Git 层，只重试网络/TLS，不重试认证、策略或分叉。
- 三项手动生产回归通过后，22:05、22:10、22:20 的下一轮自然调度也分别以 `0x00000000` 完成；四个私人 Git 工作区干净且远端 OID 一致。Gemini 最新 G 收据 106 文件、Claude 36、OpenClaw 186，收据与实物数量一致；Codex G 当前指针为 complete。
- AutoPush 的 21:15 自然运行暴露第二个真实缺陷：通用 30/120/300/900 秒退避在多个 Git 操作间会重新累计，超过该任务 15 分钟执行上限，最终被调度器终止为 `0x00041306`。中间的短预算仍会逐操作重置，独立审查拒绝了其上界声明；最终源 `aa4f9f1` 让 2 小时时限的备份继续使用长退避，而 AutoPush 完全取消跨时间等待，每个远端操作只做直接连接与当前系统代理的一次即时尝试。Task Scheduler 事件证明 2026-09-04 01:19:59 启动、01:20:04 完成并返回 0，约 5.4 秒，PUBLIC main 与远端 OID 一致。
- 公共 bootstrap 模板无机器、账号、端点或 token，渠道默认关闭、allowlist 为空、loopback、自动更新关闭；填完占位符的副本通过当前 OpenClaw schema。`-WhatIf` 会真实执行只读候选校验；正式写入原子替换，后验失败恢复旧配置。
- 当前源的 14 个脚本测试入口全部 exit 0；受控更新 Pester 30/30；CodeG 27/27；更新纯函数 42/42；34 个 PowerShell 文件解析 0 错；源 PUBLIC gate 通过。独立 Codex 备份 Owner 的完整回归也通过。源级结果不替代网页内容审查。
- `openclaw doctor` 为 30 run、29 skipped、3 warning：两条属于未启用的远程节点能力，一条说明私人运行配置仍有承载秘密字段；未公开值，也没有把 warning 抹成全绿。

明确未执行：Telegram/飞书真实收发、任何远程付费模型 Live、本地 27B 自然语言/GPU 实跑、真实更新/重启、灾备激活、CodeG MCP 握手与工具调用、全新 Windows 安装、Gateway `-Repair` 与真实故障自愈。三项备份已通过下一轮自然调度；AutoPush 失败快返已通过真实手动任务，下一次 21:15 自然调度尚未到时，且仓库未为任意 Git 子进程建立硬性全局超时，不能把一次成功提升为未来保证。

## 内容完整性与准确性

- source-first（来源优先）审查先从源规则、AI 调用入口、生命周期、模型成本、更新、恢复、bootstrap、可选 CodeG、现役私人备份消费者和测试重建产品轴，再写页面；没有把候选模块当答案。
- Overview 先说明真实输入、电脑端处理、返回结果、最重要取舍与未测边界，不以 commit、端口或测试数开场。七个模块都分别具备产品用途、事故、普通请求、结果、成功/问题/不可用、实现、入口、失败、恢复和证据。
- 页面明确分开 configured、running、connected、ready/starting、loaded、route、auth、端口、source test、runtime、Live 与最终消息回复；任一层都不能替另一层升级结论。
- 成本页用模型目录 exact key 的 `local=true`，并包含 `ollama-cloud` 反例合同；默认本地不等于全局零费用。恢复页把官方归档 verify、fresh staging、离线 activation（激活）和私人计划任务分开。CodeG 页把 JSON upsert、端口探活、MCP 握手和工具调用分开。
- PUBLIC 页面不包含账号 ID、机器人身份、token/secret、Tailscale hostname/URL、私库坐标、私人路径值、消息正文、原始日志或归档内容。
- 第一轮独立实现盲内容验收从源入口重新构建产品后明确 BLOCK：页面把四条现役私人备份压成“4 组 20 键”，漏掉各自输入、本地/G/私人 Git 输出、30 份保留、验证和差异化失败；同时漏了 beta/dev、PUBLIC 自动归档、插件精确矩阵和多处英文首现，并错误保留先前审查绿灯。
- 首轮修复曾错误沿用公共 Codex 副本，写成“Codex 无 G 热备、Git 仅 best-effort”。生产任务动作回读推翻了该结论：Codex 由独立 Owner 承载，并与 Gemini/Claude/OpenClaw 一样具备本地、G 与私人 Git 三层证据；当前候选已删除全部错误说法和不存在的公共脚本入口。
- 第二路全新实现盲终审再次 BLOCK：页面已补齐四个消费者，却误写为四条计划任务，漏掉共享 Claude→OpenClaw 的两段均尝试与首错传播；渠道模块的 loaded / compat issues 也未就地解释。该审查直接触发源 `c8b8974` 退出码修复、页面三任务拓扑和英文首现修正。
- AI-first 改写后的独立盲审持续保持 P0=0，只在发布文案门发现问题：先后补齐任务新回执、AutoPush 逐操作预算错误、日期，以及逐页英文首现。最后一轮一次性列出总览和 7 个模块尚缺的 `MCP/memory/workspace/JSON/SQLite/token/URL/deferred/coalesced/equal/ahead/channel_mismatch/ready/starting/Owner/TLS/staged/ConfigSource/WhatIf` 等；当前候选已按每个生成页面的实际顺序逐项就地解释，而不是依赖后置词汇表。该轮还发现 01:20 之后渠道和更新目标探针漂移，本页已通过三次回读更新到 01:56。
- 最终全新 Sol-family（Sol 家族）发布门在稳定重建后给出 PASS：P0=0、P1=0、P2=0。它独立回读 PUBLIC `aa4f9f1`、01:56 运行态、总览加 7 模块共 8 条 HTTP 路由与构建文件字节一致、124/124 和 512 文件公开门 0 finding，并确认首次读者可以复述真实 AI 工作流。

## 网站构建、测试与浏览器

- `npm test` 最终 124/124、0 失败；第 21 项专项 12/12 覆盖登记顺序、七模块、三阅读层、AI-first 定位、消息事实、成本边界、四条真实私人备份、7 个任务的时间与结果、PUBLIC 自动归档、四更新通道、插件矩阵、英文首现、恢复证据、bootstrap、CodeG、自然搜索和 System 直达。初跑唯一的重复日期 evolution（演进）记录已合并并由整套复跑验证。
- `npm run build` 完整通过：snapshot binding（快照绑定）为 E99、5 份规则、28 个 Skills、0 finding；生成 192 条完整静态页面和 298 条紧凑搜索记录。
- PUBLIC gate 扫描 185 个源文件与 327 个构建产物，共 512 个文件；194 个 HTML、24 个 JavaScript，finding=0。
- 根代理使用 Chromium 在 1440×1000、768×900、390×844、320×700 四档，逐档打开项目目录、Overview、模型成本、备份恢复、搜索和一条未知路径，共 24 次页面访问。项目与代表模块均 200；每档 Overview 可见 Overview + 7 个模块链接与 GitHub 按钮，搜索命中 OpenClawGateway。
- 四档 `documentElement.scrollWidth = clientWidth`，页面级横向溢出均为 0；console error、page error、request failed 均为 0。速览→产品→技术的鼠标切换和 ArrowRight 键盘切换都同步选中与显示。AI-first 与备份修复文案加入后再次跑 24 次访问，结果仍全绿。
- 禁用 JavaScript 的 390×844 Overview 仍显示速览、产品、技术全部正文，共 22,349 字符，并包含源 commit `aa4f9f1` 与七条模块路线。静态路由、SEO、sitemap、robots 与自定义 404 由全站测试验证；Vite 本地未知路径会回退首页，因此真实 404 留给 Pages 公网回读，不冒充本地已证。
- 独立视觉终审与内容补齐后的复核均为 P0=0、P1=0。唯一 P2 是 320×780 的模型成本与备份恢复详情：共享 hero、仓库卡和 8 项导航使模块标题从 y=830 开始，落在首屏下方；390×844 的标题 y=779 已进入首屏。两档无溢出，17 个代码/命令块在 320 下正常换行，最长恢复命令容器 228 px 且 `scrollWidth=clientWidth`。这是共享移动密度缺口，不阻断本次发布，也不为一个项目新增 CSS 特判。
- 本地预览已提交到 Codex 浏览器展示；queued（已排队）只表示展示请求已接收，不表示用户已经查看。

## 体积与最小实现

- 共享交互 JavaScript 11,596 gzip B，在 12 KiB 线内；共享 CSS 21,082 gzip B，在 21 KiB 线内。第 21 项没有修改两者。
- 共享搜索 110,564 gzip B；全部项目模块搜索 140,116 gzip B；OpenClawGateway 分片 6,253 gzip B；最大 PCConfig 分片 20,556 gzip B，仍在 21 KiB 单项目线内。
- 新增 1 个项目和 7 个模块后共有 298 条搜索记录。旧 104/132 KiB 总线不足，没有复制正文或新增算法，最终只按实测把两条线最小提高为 108/137 KiB；共享 JS/CSS、单项目线、加载方式与依赖保持不变。
- 新增实现面只有一份内容文件、一项 Registry 登记、一份专项测试、生成索引、System 直达、必要的项目规则/README/QA 同步；没有新视觉组件或 CSS 特判。

## 发布边界

发布前仍须在包含本文的最终工作树上重跑 `npm run build`、`npm test`、`git diff --check` 与 PUBLIC gate；完成独立内容和视觉终审后，定向暂存本任务文件并 normal-push `main`。随后等待 Pages，确认本地 HEAD、远端 `main` 与部署 head SHA 一致，并公网回读项目目录、Overview、代表模块、搜索资产、sitemap 与真实未知路径 404。

源发布后的 panel impact assessor（面板影响评估器）已确认 `impact_candidate=true`、`material_change_confirmed=true`、`task_required=true`。当前目标本身已经持有同一网站 Owner scope 并正在完成这项变更，因此没有另派重复网站任务。
