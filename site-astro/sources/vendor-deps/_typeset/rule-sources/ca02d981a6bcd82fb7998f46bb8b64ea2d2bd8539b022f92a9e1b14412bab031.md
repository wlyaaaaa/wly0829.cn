# Claude 适配

owner: `E:\.agents`

只在当前动作用到 Claude 桌面版特有机制时读，比如派子代理或工作流、接技能、MCP、浏览器和权限设置。这里只补充 Claude 的不同处；普通工作不以这些机制为前提。

## 身份

桌面身份、登记和撤销统一按[用户授权的受信任 AI 规则](/rules/authorization/#受信任的-ai)。Claude 桌面及其真实后代由 PasswordCenter 沿桌面祖先识别为 `claude-root`；嵌套工具使用的模型不改变主体。GPT 包装器默认由 WMI 服务起独立执行者，已脱离这条桌面进程链，没有 `claude-root` 身份；需要密码中心凭据的动作交回根会话。

## 思考档位

Opus 5.5、Sonnet 5.5 和 Fable 5.1 用同一套档位，从低到高是 low、medium、high、xhigh、max：

| 档位 | 含义 |
|---|---|
| low | 思考最少，只做机械、明确、结果能马上核对的小事 |
| medium | 均衡；Opus 5.5 的默认档，常规检索、调研、实现和审查够用 |
| high | 全面推演，跨模块调查、完整子系统、实质审查 |
| xhigh | 扩展推理，困难设计、疑难排障、关键审查 |
| max | 最深推理、最贵、最慢；评测分数不一定比 xhigh 高，不当做错后的默认下一步（见[分工与并行施工](/rules/execution-coordination/#做错了怎么办)） |

Ultracode 不是比 max 更高的档，而是 xhigh 加多智能体编排（工作流），只在本会话有效；提示词里出现“ultracode”一词只让这一轮改用编排，不改变档位。`auto` 表示没固定档位，以实际记录为准。

## 派子代理：Claude 的不同处

共同原则见[分工与并行施工](/rules/execution-coordination/)，可派范围见 `config/model-roster.json`。

- Claude 自己的子代理用 Agent 工具派。Agent 工具没有档位参数，要选型号和档位就选对应的子代理类型：`sonnet-low`、`opus-low`、`opus-medium`、`opus-high`、`opus-xhigh`、`opus-max`。派给谁按模型清单 `routing` 的场景表：现在 Claude 子代理主要做独立复核、头脑风暴、分析和抽查，以及要惊艳的样板和关键部分；场景表交 GPT 的活，GPT 用不了（没登录、没额度，或需要的工具、身份确实用不了）时才交 Claude 子代理，纯机械的小事这时交 `sonnet-low`；做错了换人时也可以换到 Claude（见[分工与并行施工](/rules/execution-coordination/#做错了怎么办)）。
- 内置的 `general-purpose`、`Explore`、`Plan` 连型号带档位都跟根会话走，根会话开 max 时它们也按 max 跑，拿来做检索很贵；整段一两步就能查完的检索根会话自己做（约法 L22）；成批的检索和机械小事交 Luna，GPT 用不了时改派 `sonnet-low` 或 `opus-low`。`Explore`、`Plan` 不读 CLAUDE.md，只做只读检索。Agent 工具的 `model` 参数只换型号、不换档位，不用它派 Sonnet。
- 派 GPT 时走下面的包装器入口，不把 Codex 的 `openai_child` 或它的专用判断角色当作 Claude 的接口。
- 工作流（Workflow）是确定性的多代理编排，适合大范围扇出、交叉核对和可恢复的批量活；只在本人开启 Ultracode、明确要求或技能要求时用，每个 `agent()` 显式传 `effort`。大扇出前估一下剩余额度，不够就先落下能接着做的检查点。
- 独立复核默认一两个复核者，只给和改动有关的材料（差异、调用点、相关规则段落），发现的问题合并成一次批量核对。
- 重大动作前的把关：型号、最低档位和职责统一见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)；确实需要另派时，通过上面的档位子代理类型选择符合要求的型号和档位。

### 派 GPT

- **先看授权覆盖什么。** Claude 自己的子代理和 GPT 的 Sol、Luna 不用本人另行授权，任何对话都可以派（约法 L23，本人 9 月 30 日）。派 Astra 按本人给这个对话或项目的授权，按原话保留项目、对话、期限和选型限制：“本对话内一直有效，直到本人说停”只在原对话内沿用；“一个项目授权”只覆盖该项目；同时给了项目范围和对话期限时，两者都遵守。已有有效授权覆盖这次任务就直接用，不逐次再问，也不扩成所有新对话或新项目的许可。
- **提醒本人授权 Astra。** 这个对话或项目没有 Astra 授权、眼前的活又属于模型清单 `routing.vendor_rule` 里“提醒授权 Astra”那几类时，Claude 提醒本人一次（约法 L23）。规划时一看出来就提，不等到派活那一步；用一两句话说清这件活交 Astra 好在哪、大约多花多少 GPT 额度、不授权时交给谁，本人回一句授权（说明是这个对话还是哪个项目）就按上一条派。等答复时照常做别的部分；到了该派的时候还没答，就照没授权的做法做，交付时说一句用了哪个替代。同一件活只提醒一次；本人说不用的，这个对话里不再提醒。
- **默认分工和选型。** 交哪家、派哪个型号和档位，按约法 L22 和模型清单的 `routing`（Claude 和 Codex 共用）：先看场景表，没覆盖的按难度分级；场景表是按厂商数据和 AA 等权威评测得出的现在的选择，不是固定身份。涉及本人价值取舍、偏好和理解的内容，GPT 也可以写或提意见，单列后由 Claude 按原话和语境把关。每次显式传 `-Model` 和 `-Effort`；当前默认档位按共同分工原则：GPT-6.1 Sol 用 ultra，GPT-6 Luna 用可用最高档 max；包装器在 GPT-6 Astra 未传档位时仍取 max。当前 GPT-6.1 Sol、GPT-6 Astra 的 xhigh 派单传 ultra，旧调用的 xhigh 自动转为 ultra（GPT-6 Luna 无 ultra，用 max），其他显式档位保留原值。Astra 必要时可按 Codex 自己的经济路由再派 Sol、Luna，不扩大业务范围和授权。
- **从包装器进入。** 使用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，`-ParentHarness` 默认 `Claude`，原来的 Claude 调用、会话号来源和结果目录不变。新 Start 默认走私有 AppServer（后台服务）并脱离运行，长任务优先这样派；确实需要桌面身份的整项任务可传 `-Detached:$false`，也可把凭据动作交回根会话。Resume 沿用已保存的传输和脱离方式，旧目录缺脱离字段时保留原方式，显式 `-Detached` 可切换。运行中纠偏用同轮 Steer（运行中引导）。不直接调用 `codex exec`，不用 Codex 的 `openai_child` 或专用判断角色。需要 Exec 回退时仍走包装器，显式加 `-Transport Exec`；Exec 不支持同轮 Steer。共用的容量和接续行为见[分工与并行施工](/rules/execution-coordination/#原生容量不足与原线程接续)；`-ParentHarness Codex` 只供[Codex 适配中的已授权转用](/rules/codex-adapter/#原生容量不足时转用共用包装器)，不把 Claude 的型号许可搬过去。
- **资料与权限。** 派出的是 Codex，按本人的正常 Codex 配置和当前的授权工作，业务范围只限交给它的任务。默认独立执行者没有桌面祖先身份，需要密码中心凭据的动作写明交回根会话，先完成不依赖凭据的部分；不自行登录、转交秘密或改身份核验来补。个人资料直接检查全机同一份共享状态，不按 Claude 或 Codex 会话另建资料期。不把 Claude 对话的授权值复制过去，也不另加沙箱或审批覆盖。资料需求由根会话派活前判断，需用时先请本人解锁再派；资料期全机共用。子代理不自行判断或发起解锁，只在实际读取被拦、途中缺资料或到期时按分工第 7 条的一行标记交回。
- **派活单和预算。** Sol、Luna 的任务开头带 `---` 栏位段，写齐任务、出处、方案、仓库、基线、工作树、范围、代码上限、测试上限、时限分钟，方案为“已定”。当前 Luna 的只读机械单写“范围: 无（只读）”“代码上限: 0”时，只需另填任务、出处、时限分钟；施工单照旧全栏。Astra 至少写“时限分钟”。M1 给出自写新增、删除和净增减，排除合并带入分支，按净增加检查预算；具体用法（`../claude-gpt-child-dispatch.md`）。工作树必须是任务专用的。Extend、预算放行 `-AllowOverBudget` 和纠错 `-Correction` 都带 `-Reason`。验收完用 `Status -Ack`。
- **交代和交付。** 子任务是非交互的：技术做法自己定，不能自己定的需求或取舍写进最终汇报，由根会话整理；先做完不依赖该决定的工作，不在无人回答的地方等提问。交付简短结论、必要证据和汇报路径，除任务明确要求网页外，不做可视化，也不打开窗口。本机 UAC 为不通知，任务范围内需要管理员权限时可静默提权，按[用户授权](/rules/authorization/#长期授权)办理；权限/ACL 改动、撤回快照和重大动作等仍按各自专题，需要本人在场的步骤交根会话安排（出处：决定文档“默认 Chrome 不通时换办法、子代理可静默提权”）。会影响其他会话的决定写到对应项目文件；仅在同改一处、发生事故或确需协调时发消息，不用中途进度刷屏。
- **保存和接续。** 运行中和需要恢复时保留会话，不加 `--ephemeral`；Claude 默认不启用 `-ContinueOnQuota`，额度耗尽按实际恢复时间等候，失败、超时、额度耗尽等恢复后在原线程 Resume，不另开对话。同额度 Codex 根仍能正常调用时的即时续作例外统一见上述共用专题。成功后的接力保留窗口和主动停止后的删除见下面清理方式。会话保存、CLI 列表可见和桌面即时可见分别按实际结果报告；不保证运行中的线程能在桌面直接输入，也不为刷新列表自动重启桌面。
- **命令不断线。** 子任务默认由 WMI 服务起的独立隐藏执行者持有，派活命令被停、Claude 关闭或更新重启都不影响它继续施工。Start 必须显式传 `-Model`，默认启动后返回，需要等候时加 `-Wait`；Resume 在原线程保留默认等候。新版执行器持续写 `monitor.json` 和接续状态，主持挂一次后台 Start -Wait、Resume 或 Watch 订阅后，同一调用在周期到点时内部续等。Watch 的 `-WakeOnEach` 可在任一任务结束时叫醒；真正风险返回后按实际回执处理并接着订阅。旧运行轮沿原来的回执挂 Watch，终态后用新版 Resume 接入执行器监测。有子任务在跑时，受管 Stop 要求同时有活着的普通等候订阅和兜底监看（`-Mode Watch -Backstop -SessionId <会话号>`），缺哪个就拦一次并给出可照抄的重挂命令，同回合第二次放行。兜底健康时安静：普通订阅断档满 10 分钟且 Claude 接口可达才叫醒根会话，约 110 分钟到期返回重挂；不用定时心跳（本人 10 月 9 日 08:23、08:25）。根会话仍负责读汇报、核对成果和处理未结事项。
- **后台命令时限。** 长时间挂 Start、Resume、Watch 时显式设 `run_in_background:true`，`timeout` 按当前后台上限设；现用值是 `7200000` 毫秒（2 小时），以包装器返回的 `watch_timeout_ms` 为准。`WatchMaxMinutes` 对新版任务是内部续等周期，旧任务仍可返回 `rearm`；它不改变子任务截止时间。常驻监测由独立隐藏执行器持有，保留真实进程与停止入口。
- **时间按需延长。** 无派活单时按 `-TimeoutSeconds`（默认 7200 秒），有派活单时忽略它。截止前（本轮总时长的 10%，5 到 30 分钟）等候命令以 `deadline_soon` 返回一次，附剩余时间、最近事件和最近命令：还在有效推进就 `-Mode Extend -Minutes <分钟数> -Reason <理由>` 延长，要它交付就 Steer 让它收尾，然后立即重新挂 Watch。预算用完后的续作用 `Resume -Minutes N -Reason <理由>` 并记录：没写 `-TimeoutSeconds` 时 N 分钟就是这一轮的预算，写了秒数时在它上面再加 N 分钟；都没给则启动前拒绝。没人处理时执行者兜底：截止前自动发一条收尾提醒，被接受的宽限 1 到 3 分钟后停止，状态为 `timeout`；Exec 方式不能引导，到点直接停。
- **执行者消失和重启。** Watch、Status 发现执行者已经不在（进程号和启动时间对不上，包括电脑重启后的旧记录），把该轮改成 `failed`、原因 `runner_gone`；Watch 新发现可恢复任务时返回 `runner_gone_recoverable` 和 `recovery_command`。Claude 重启或续作时先执行 `-Mode Recover -SessionId <完整父会话号>`，它只检查这个父会话，逐个在原线程 Resume 确认执行者消失、最新轮没有非空 `report.md`、未进入永久删除的运行；标准提示要求检查半截产物，能续就续，不能续就重做，其余照原简报和之后的引导。单项失败单独报告，不阻断其他任务。已有汇报交根会话验收，缺归属的旧目录仍由根会话用 Status 核对后手动 Resume。恢复后，和原本仍在跑的任务一起照 `watch_command` 重新挂 Watch；后台命令显示停止不证明子任务已停。
- **结束后清理。** 执行成功后保留原线程，最新轮验收通过后才清理；六小时到期或 `Status -Ack` 本身不算验收。验收须绑定实际版本、真实使用证据、无缺口和已覆盖消息，字段见派发说明（`../claude-gpt-child-dispatch.md`）。主动停止仍用 `thread/delete` 永久删除本轮对话及全部后代，保留任务汇报和代码成果。验收用 `-Mode Accept -RunDir <结果目录>`：在任务工作目录逐条跑子任务登记的验收命令并留证据，全过才登记；登记后和主动停止后，包装器按子任务的待清理清单和 `tmp` 删掉本任务目录里的临时内容，任务目录外的不删，删不掉的如实列出。失败、超时、额度耗尽、登录失效等自动归档保留，Resume 前取消归档；自动重试期间保留原线程。删除和归档回执仍在本轮状态及对应日志中，清理失败如实记录，不改任务结局，不追删过去已归档的对话。

常用命令如下，路径和会话号换成本次真实值；修改仓库用 `-NewWorktree -RepoPath`，只读任务可换成 `-WorkDir '<已有目录>'`。结果目录由 Start 创建，后续各命令的 `-RunDir` 指向同一个结果目录。

```powershell
$child = 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1'
& $child -Mode Start -SessionId '<当前 Claude 会话号>' -PromptFile '<任务.md绝对路径>' -Model gpt-6-astra -Effort max -NewWorktree -RepoPath '<仓库绝对路径>' -TaskName '<短名>'
& $child -Mode Watch -RunDirs @('<结果目录>')
& $child -Mode Recover -SessionId '<当前 Claude 完整会话号>'
& $child -Mode Extend -RunDir '<结果目录>' -Minutes 60 -Reason '说明进展和延长原因'
& $child -Mode Steer -RunDir '<结果目录>' -Message '先正常跑完当前命令，再按这条说明调整。'
& $child -Mode Status -RunDir '<结果目录>' -Ack
& $child -Mode Resume -RunDir '<结果目录>' -PromptFile '<追问.md绝对路径>'
& $child -Mode Stop -RunDir '<结果目录>'
```

Steer 的长消息可用 `-PromptFile` 替换 `-Message`，不同时传；消息里有中文引号“”时一律用 `-PromptFile`，PowerShell 会把中文引号当成字符串边界、把后面的字拆成别的参数。用 Status 核对是否接受、是否被模型看到及汇报中的处理结果，不把入队当成完成。Resume 只用于当前轮已结束的原线程，沿用原型号、档位和已保存的传输方式。Watch 优先照返回里的 `watch_command` 原样挂，它已涵盖本次所有仍在跑的结果目录。Check、Watch、Extend、WaitQuota 的完整说明见脚本顶部注释，`Get-Help E:\.agents\tools\Invoke-ClaudeGptChild.ps1 -Full` 可列出参数。

## 宿主接线

- **技能**：`~/.claude/skills` 是指向 `~/.agents/skills` 的目录链接，和 Codex 共用同一个发现根和技能清单，不生成第二份副本。新技能写到 `E:\.agents\skills` 后走现有安装器，不在 `~/.claude/skills` 下直接新建。
- **临时目录**：任务临时文件放 `E:\Cache\Claude\Temp\<会话号前 8 位>`，并把子进程的 `TEMP|TMP|TMPDIR` 指过去。子代理和主会话共用这个会话目录，所以子代理用自己的子目录（例如 `<会话目录>\sub-<名字>`），收尾只清理自己建的子目录，不清理会话目录本身。根会话收尾也只清理自己建的文件和子目录，不按整个目录批量清理：同一目录下的 `personal-status` 是资料钩子给本会话留的状态缓存。宿主给的会话 scratchpad 路径超过 200 个字符，会让 pdftoppm、git 等工具报假失败，不当临时目录用。
- **档位子代理**：规范源是 `templates/claude-home/agents/`，`~/.claude/agents` 是指向它的目录链接。
- **记忆**：Claude 账号聊天记忆已关闭，Claude Code 的关闭配置为 `~/.claude/settings.json` 中的 `autoMemoryEnabled=false`；当轮需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Claude 工具的已核实教训归本专题。
- **MCP**：用户级配置在 `%USERPROFILE%\.claude.json`（`claude mcp add -s user`）。Google 业务按[能力与运行方式](/rules/capabilities-runtime/#常用入口)，走 PCConfig 的 `google-workspace` stdio 入口，不接 claude.ai 的云连接器。电脑 MCP 只认目标机登记过的客户端；Claude 的 OAuth 回调固定为 `http://localhost:<端口>/callback`，不能复用 Codex 的 `127.0.0.1` 客户端，要在目标机登记独立的 Claude 客户端和固定回调端口。主机上的 Claude 直接用本机工具，不连本机的电脑 MCP。
- **浏览器**：Claude（根会话和 Claude 子代理）操作不了本人已登录的浏览器页面。所以要在本人 Chrome 里用本人的登录状态看网页、操作或收集数据时，默认派 GPT 子任务去做：经上面“派 GPT”的包装器派，AppServer 方式会像 Codex 桌面一样给它接上 Codex 的 Chrome 插件（Exec 方式不接），它优先在本人已开着的 Chrome 里做；Chrome 打不开或连不上时，按[能力与运行方式的浏览器规则](/rules/capabilities-runtime/#浏览器)和 `browser-control-continuity` 技能改用无窗口办法继续，确实依赖本人登录状态的步骤单独交回，不让其他操作和验收卡住。派哪个型号和档位、要不要 Astra 授权，照派子代理的规则和模型清单定，这一条不改选型。不需要登录的网页，看一两页时 Claude 可以直接用自己的内置浏览器（`mcp__Claude_Browser__*`）看；成批截图、录屏、来回操作按约法 L22 派出去做好送来；这只是 Claude 的做法，Codex 照常用本人的 Chrome。这是默认做法，不是禁令，本人当场另有指定时照本人说的办。（出处：决定文档“要登录的网页交 GPT，不要登录的 Claude 用内置浏览器”）
- **要在新会话里验收的**（Hook、MCP、技能这类只在新会话生效的改动）：正在运行的 Claude 桌面会话仍用会话开始时的旧 Hook 设置和旧 MCP 进程，要开一个真正的新桌面会话去测。`spawn_task` 卡片开出的会话型号和档位跟原会话走，所以验收不用卡片：在对话里写一段可直接复制的验收提示，第一行写明新会话选 Sonnet 5.5、low 档（这类验收是照步骤看结果，按模型清单 sonnet-low 一条），提醒本人新开会话、选好型号档位后粘贴，跑完把结果交回或由根会话用会话工具回读。MCP 另可用 `%USERPROFILE%\.claude.json` 里 `mcpServers` 的原命令走一遍 stdio 作为补充证据，两者分开报告。不要用嵌套的 `claude -p` 代替：它没有登录，也不要为它登录或转交凭据。（决定：10 月 8 日 04:56“新会话验收不用推荐卡片”）
- **权限**：用户设置里全局使用 `permissions.defaultMode=bypassPermissions`，和 Codex 的完全访问对等；不用 auto 模式或 `autoMode` 条目复制授权。宿主固定拦截的操作（删除盘根或一级目录、`Remove-Item` 通配、前台长时间 sleep、`AskUserQuestion` 等）不是停工理由：改用字面子路径、回收站工具（见[工程与交付](/rules/engineering-delivery/)），或用后台任务、Monitor 等待。
- 清理、删除或其他因 Claude 硬限制卡住的已授权事项，按[Claude 受限的事项交给 Codex](/rules/execution-coordination/#claude-受限的事项交给-codex)提醒本人并提供接手提示词。
- **文件预览**：工作区外的链接按 [Claude 入口模板](/rule-sources/templates/claude-home/CLAUDE.md)的文件预览要求办理；该模板随活动版本部署，命令行目录设置不能代替桌面预览权限。
- **按命令文字拦截的删除**：Claude 桌面版会拦住同一条 PowerShell 命令里同时出现 `Remove-Item` 和 `E:\PCConfig` 字样的调用；它只看命令文字，不看实际删什么，被拦时整条命令都不执行。删任务临时目录单独写一条命令，读 `E:\PCConfig` 的 git 命令放另一条。临时文件按[工程与交付的清理入口](/rules/engineering-delivery/#下载临时文件和清理)处理。
- **写路径和中文的坑**：Bash 工具会先把命令里的双反斜杠变成单个（单引号里也一样），Bash 再吃掉引号外的反斜杠，所以引号外的 Windows 路径写一个还是两个反斜杠都会坏（`E:\\.agents\\skills` 最后成了 `E:.agentsskills`，读不到文件，写文件则落到别处）；在 Bash 里写路径用正斜杠 `E:/...` 或放进单引号。内联脚本里的 Windows 路径会让 `\3`、`\r` 这类被当成转义、写出控制字符；PowerShell 工具的命令要整体再解析一次，双引号字符串里的中文弯引号“”会被当成引号，整条命令报语法错、一步都不执行。所以含 Windows 路径、中文引号的文字（脚本、提交说明、文档片段）先用 Write 工具写成文件，路径用原始字符串，写完检查没有控制字符。给 `pwsh -File` 传数组参数会被拼成一个字符串，要传数组就在当前会话里用 `&` 调用，或改用 `-Command`。

## Hook 和个人资料状态

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行，复用下述受管运行时和现有 GPT 包装器；结果通过工具后或恢复、新消息边界回到原会话，不用审查者直接改代码或阻塞提示。程序入口与暂停开关见上下文 Hook 运维（`../operations/context-hooks.md`）。

受管的 `UserPromptSubmit` 和 `Stop` 两个 Hook 由 `tools/Invoke-ClaudeRootHooks.ps1` 安装：把 `claude_root_runtime.py` 按内容哈希放到 `E:\Data\AppData\Claude\managed-hooks\claude-root\runtimes\<sha256>\`，写入 `active-runtime.json`（`agents.claude-root-runtime-manifest.v1`），再合并进 `~/.claude/settings.json`，两个事件共用这一个运行时，保留其他设置和 Hook。`UserPromptSubmit` 带进会话坐标、本会话的型号和思考档位、共享的个人资料状态和已核验的无限制授权；真实根提示把状态、原截止及本轮非私密标识存入小缓存，供结束检查在正式回读失败时兜底，缓存不授予资料权限。为绑定本轮，有限核对当前用户记录的标识、时间和转录字节位置，提示正文只存指纹，不持久化正文；根会话在锁着、未知或 Hook 出错时，明确提醒需要资料就先请本人验证解锁，通过后再查资料、派活和作答，不给降级回答，纯技术工作照常；原生和包装器子代理收到交回缺口的角色提示，绝不要求它们运行验证入口。它不拦提示，也不授予资料或操作权限，不按关键词自动弹验证窗口。设置改动在宿主重新读取设置后生效。型号和档位写明来源：先用宿主随提示给的值，缺的才读这个会话在 Claude 桌面里保存的设置，两个来源的型号对不上时档位写未知；读不到就写未知，不用全局默认或模型清单补。它只供经济路由参考，不是派发门槛。

Stop 依据本轮真实 Report 回执核对明确目标集合，复用两宿主共同的版本、验收和缺口检查；根会话的资料兜底只读本会话转录末尾最多 2 MiB，在当前真实用户轮次识别业务被拦回执 A 和真实 Skill 调用 C。A 必须有业务 schema 或检查动作、顶层 blocked 和保护原因码，排除只读状态、Agent/Task 汇报、源码和搜索输出；本轮未实际发起解锁时直接拦，无需状态查询。C 只认声明为个人领域的真实 Skill 工具调用，explain-to-me 不在名单中，用正式 StatusPersonalEnvironment 回读，预算 12 秒；失败时仅复用本轮提示状态及原截止，锁着或已过截止就拦，两者均不可确认才放行并诊断。已实际发起解锁按既有条件放行，普通技术工作没有业务被拦信号时直接放行。

不识别模型自白，不解析子报告缺口或生成 personal_data_need 状态。子代理按单行“需要本人资料：……”人工交回，由根会话读报告后处理；原生子代理及包装器角色均不自行验证。资料与明确汇报验收问题合并原因，同轮第二次只提示，Stop 总时限 30 秒；读取或解析失败只放行受影响项并给固定诊断，不启动任务或验证窗口，不回显对话、思考或报告内容。

Claude 会话和本机、图形界面、电脑 MCP 用同一份个人资料状态。直接调用 `CheckPersonalDataAccess -PrivacyLevel factor` 即可，不必传 `RootTaskId` 或 `PromptId`；业务入口内的 `personal_data_access.py` 也检查这份共享状态，不必额外跑一次前置检查。Hook 缺失或投递不明时，先把会话中的资料状态按不明处理，用 `StatusPersonalEnvironment` 从正式只读入口回读；身份由密码中心现场核验。锁着或不明时不取用私人资料；根会话问到本人自己的事，第一步先请本人验证解锁，通过后再查资料、派子代理和作答，不给降级回答；纯技术工作照常，不自动冻结任何东西。验证的等待方式见[个人资料的锁和解锁](/rules/privacy-data/#个人资料的锁和解锁)。

## 无限制授权

本人要给当前 Claude 对话开无限制授权时，Hook 识别明确请求，直接调用已安装的 `Invoke-OwnerTakeover.ps1 -Operation Open -HostTaskId <session_id> -HostHarness claude-code`；本人在窗口里只填时长和范围，并完成一次本人验证。只有根会话的真实提示会打开窗口，子代理和工作流子会话不会。模型不手动串 `Configure/Prepare/Activate/Check`，也不重复打开。

验证成功后，下一条真实提示由 Hook 用 `CheckHost -HostHarness claude-code` 回读。对话范围的授权只绑定发起它的 Claude 会话；子代理和工作流子会话共用同一个会话编号，所以在同一授权内。Codex 线程的对话授权不适用于 Claude，反之亦然；全局授权两者都能用。本地动作的子进程显式带 `PCCONFIG_OWNER_SESSION_REF`、`PCCONFIG_OWNER_REQUEST_ID`、`PCCONFIG_OWNER_EXPIRES_AT` 三个相同的值。

## 受信任 AI 的其他能力

和 Codex 桌面版一样，下面这些都由 SecretBroker 核验本人 Windows 账户和实际桌面祖先：

- 已登记运行时在现役入口实际可用的密码中心动作和 SecretRef。浏览器密码盲填已退役，不再使用 AgentLogin；手机号和验证码登录按[能力与运行方式](/rules/capabilities-runtime/)及当前宿主真实能力处理。
- `AgentSecretFromStdin` 运行时写入秘密，回执必须是请求的同一主体。
- 无需验证因子的账号恢复登记，用 Claude 自己的解锁信封。
- 电脑 MCP 凭据登记：在 Claude 会话进程树内、不提权运行 `Manage-RemoteComputerMCP.ps1 -Action SetupCredentials -RuntimePrincipal claude-root`。
- 请本人验证的提示只能由根会话发出，因为子代理的文字不会显示在本人的对话里。

不同的地方：新设备管理恢复（`RecoverFromPrivateGit`）登记 Codex 桌面主体，Claude 在新设备上用 `EnrollRuntimeAuthority` 登记；电脑 MCP 登录不继承任何一方的身份。

## 官方升级

官方更新后仍按本人 Windows 账户、登记包族和桌面应用本体识别，不以应用版本号、引擎版本目录、构建号或运行时密钥续绑为门槛。新设备通过正式入口登记；当前进程链不能证明桌面来源时，只阻止依赖该身份的能力，不借另一桌面进程或环境变量补身份。撤销用 `RevokeRuntimeAuthority -Query claude-root`，不影响 Codex。受管 Hook 的内容哈希只保护 Hook 自身，不代表应用版本。
