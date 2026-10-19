# Claude 适配

owner: `E:\.agents`

只在当前动作用到 Claude 桌面版特有机制时读，比如派子代理或工作流、接技能、MCP、浏览器和权限设置。这里只补充 Claude 的不同处；普通工作不以这些机制为前提。

## 身份

桌面身份、登记和撤销按[用户授权](/rules/authorization/#受信任的-ai)。Claude 桌面及其真实后代沿桌面祖先识别为 `claude-root`，嵌套模型不改变主体。GPT 包装器默认起独立执行者，没有该桌面身份；真正需要桌面身份的密码中心凭据步骤交回根会话。

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
- 独立复核按共同原则安排；重大动作的型号、最低档位和职责见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)，需要另派时选符合要求的档位子代理类型。

### 派 GPT

- **先看授权覆盖什么。** Claude 自己的子代理及 GPT Sol、Luna 可直接派（约法 L23）；Astra 必须已有授权覆盖本次项目、对话、期限和选型限制。“本对话直到叫停”不跨对话，“一个项目”不跨项目，同时限定项目和期限就同时遵守。覆盖时直接派，不逐次问，也不扩大许可。
- **提醒本人授权 Astra。** 无授权而任务属于 `routing.vendor_rule` 的提醒场景时，规划阶段提醒一次（约法 L23），说明优势、大约多花的 GPT 额度及未授权替代；本人答复注明对话或项目后按范围派。等待时做独立部分，派活时仍无答复就用替代，交付说明；同一活不重提，本人说不用则本对话不再提醒。
- **默认分工和选型。** 按模型清单 `routing` 和[共同选型原则](/rules/execution-coordination/#派子代理的原则)，每次显式传 `-Model`、`-Effort`，GPT 涉及本人价值、偏好和理解的内容单列后由 Claude 把关。包装器将 Sol、Astra 的旧 xhigh 转 ultra，其他显式档位保留；Astra 未传档位时取 max。Astra 可再派 Sol、Luna，范围和授权仍沿用父任务。
- **从包装器进入。** 使用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，`-ParentHarness` 默认 `Claude`，原来的 Claude 调用、会话号来源和结果目录不变。新 Start 默认走私有 AppServer（后台服务）并脱离运行，长任务优先这样派；确实需要桌面身份的整项任务可传 `-Detached:$false`，也可把凭据动作交回根会话。Resume 沿用已保存的传输和脱离方式，旧目录缺脱离字段时保留原方式，显式 `-Detached` 可切换。运行中纠偏用同轮 Steer（运行中引导）。不直接调用 `codex exec`，不用 Codex 的 `openai_child` 或专用判断角色。需要 Exec 回退时仍走包装器，显式加 `-Transport Exec`；Exec 不支持同轮 Steer。共用的容量和接续行为见[分工与并行施工](/rules/execution-coordination/#原生容量不足与原线程接续)；`-ParentHarness Codex` 只供[Codex 适配中的已授权转用](/rules/codex-adapter/#原生容量不足时转用共用包装器)，不把 Claude 的型号许可搬过去。
- **资料与权限。** Codex 子任务按正常 Codex 配置和当前授权工作，不复制 Claude 对话授权值，不另加沙箱或审批覆盖。独立执行者没有桌面祖先身份：真正依赖密码中心桌面身份的凭据步骤交回根会话，其余已授权步骤照常完成；不另行登录、转交秘密或改身份核验来补。资料需求、共享资料期和缺口交回按共同原则第 7 条。
- **派活单和预算。** 字段、模板、预算统计和验收只维护在派发说明（`../claude-gpt-child-dispatch.md`）。任务修改代码时用专用工作树；出处、方案和成本估算等可选，不能因缺栏拒绝。Extend、预算放行 `-AllowOverBudget` 和纠错 `-Correction` 带 `-Reason`。
- **交代和交付。** 子任务是非交互的：技术做法自己定，不能自己定的需求或取舍写进最终汇报，由根会话整理；先做完不依赖该决定的工作，不在无人回答的地方等提问。交付简短结论、必要证据和汇报路径，除任务明确要求网页外，不做可视化，也不打开窗口。本机 UAC 为不通知，任务范围内需要管理员权限时可静默提权，按[用户授权](/rules/authorization/#长期授权)办理；权限/ACL 改动、撤回快照和重大动作等仍按各自专题，需要本人在场的步骤交根会话安排。会影响其他会话的决定写到对应项目文件；仅在同改一处、发生事故或确需协调时发消息，不用中途进度刷屏。
- **保存和接续。** 保留会话，不加 `--ephemeral`；Claude 默认不启用 `-ContinueOnQuota`。失败、超时或额度恢复后在原线程 Resume，具体接续按共用专题。会话保存、CLI 列表和桌面即时可见分别报告，不保证运行中可在桌面输入，不为刷新列表重启桌面。
- **命令不断线。** 独立隐藏执行者不随派活命令、Claude 退出或更新停止。Start 默认立即返回，`-Wait` 才等候；Resume 沿原线程等候，返回后按共用接续原则挂覆盖全部运行任务的后台 Watch，不另挂 Backstop。订阅、风险、旧轮兼容和回执见派发说明（`../claude-gpt-child-dispatch.md`）。
- **后台命令时限。** 长时间 Start、Resume、Watch 显式设 `run_in_background:true`，`timeout` 用回执 `watch_timeout_ms`（当前 7200000 毫秒）。Watch 周期不改变任务截止，监测和停止入口由独立执行者持有。
- **时间按需延长。** 派活单时限优先，无派活单才用 `-TimeoutSeconds`（默认 7200 秒）。截止前总时长的 10%（5–30 分钟）返回一次 `deadline_soon`，先 Steer 交已有结果；根调整范围或做法及新时限后才 `Extend -Minutes N -Reason` 并重挂 Watch，不自动延期。超预算续作用 `Resume -Minutes N -Reason`；N 默认为本轮预算，显式 `-TimeoutSeconds` 时加在秒数上，两者都没给就拒绝。无人处理时自动提醒收尾，接受提醒后宽限 1–3 分钟，以 `timeout` 停止；Exec 到点直接停。
- **执行者消失和重启。** 进程号或启动时间对不上时标 `failed/runner_gone`；Watch 发现可恢复任务给 `runner_gone_recoverable`、`recovery_command`。Claude 恢复先用 `Recover -SessionId <完整父会话号>`：仅续作该父会话下执行者消失、最新轮无非空报告、未永久删除的任务，原线程核对半截产物，能续就续，不能续就重做。单项失败不挡其他任务；已有报告交根验收，归属不明旧目录用 Status 核对后手动 Resume。恢复后照 `watch_command` 覆盖所有运行任务；后台命令结束不证明子任务停止。
- **结束后清理。** 验收和清理条件见派发说明（`../claude-gpt-child-dispatch.md`）；`Accept -RunDir <结果目录>` 跑登记的验收命令并留证据，全过才登记。Stop 默认保留线程和成果，只有显式 `-DeleteThread` 才永久删本轮线程及后代。清理只处理本任务目录内待清理清单和 `tmp`，汇报、代码成果保留；失败、超时、额度或登录失效自动归档，Resume 取消归档，自动重试保留原线程。不追删已归档对话，删除、归档、清理失败均留回执，不改任务结局。

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
- **记忆**：Claude 账号聊天记忆已关闭，Claude Code 的关闭配置为 `~/.claude/settings.json` 中的 `autoMemoryEnabled=false`；需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Claude 工具的已核实教训归本专题。
- **MCP**：用户级配置在 `%USERPROFILE%\.claude.json`（`claude mcp add -s user`）。Google 业务按[能力与运行方式](/rules/capabilities-runtime/#常用入口)，走 PCConfig 的 `google-workspace` stdio 入口，不接 claude.ai 的云连接器。电脑 MCP 只认目标机登记过的客户端；Claude 的 OAuth 回调固定为 `http://localhost:<端口>/callback`，不能复用 Codex 的 `127.0.0.1` 客户端，要在目标机登记独立的 Claude 客户端和固定回调端口。主机上的 Claude 直接用本机工具，不连本机的电脑 MCP。
- **浏览器**：Claude 根和子代理不能操作本人已登录页面；要用登录状态时派 GPT，AppServer 接 Codex Chrome 插件，Exec 不接，优先本人已开的 Chrome。连不上按[浏览器规则](/rules/capabilities-runtime/#浏览器)和 `browser-control-continuity` 无窗口继续，真正依赖本人登录的步骤单独交回。无登录需求看一两页可用 Claude 内置浏览器（`mcp__Claude_Browser__*`）；成批截图、录屏和操作按共同原则派。选型与 Astra 授权照常，Codex 仍用本人 Chrome；这是可由本人当场改的默认。
- **要在新会话里验收的**（Hook、MCP、技能）：用真正的新桌面会话，运行中的会话仍持旧 Hook 和 MCP。`spawn_task` 继承型号档位，不用于此项验收；给可复制提示，首行注明 Sonnet 5.5、low，让本人新开、选好后粘贴，结果交回或由根回读。MCP 原命令可按 `%USERPROFILE%\.claude.json` 的 `mcpServers` 跑 stdio 作补充，两种证据分开。嵌套 `claude -p` 没登录、也非新桌面会话，不能代替，不为它登录或转交凭据。
- **权限**：用户设置里全局使用 `permissions.defaultMode=bypassPermissions`，和 Codex 的完全访问对等；不用 auto 模式或 `autoMode` 条目复制授权。宿主固定拦截的操作（删除盘根或一级目录、`Remove-Item` 通配、前台长时间 sleep、`AskUserQuestion` 等）不是停工理由：改用字面子路径、回收站工具（见[工程与交付](/rules/engineering-delivery/)），或用后台任务、Monitor 等待。
- 清理、删除或其他因 Claude 硬限制卡住的已授权事项，按[Claude 受限的事项交给 Codex](/rules/execution-coordination/#claude-受限的事项交给-codex)提醒本人并提供接手提示词。
- **文件预览**：工作区外的链接按 [Claude 入口模板](/rule-sources/templates/claude-home/CLAUDE.md)的文件预览要求办理；该模板随活动版本部署，命令行目录设置不能代替桌面预览权限。
- **按命令文字拦截的删除**：Claude 桌面版会拦住同一条 PowerShell 命令里同时出现 `Remove-Item` 和 `E:\PCConfig` 字样的调用；它只看命令文字，不看实际删什么，被拦时整条命令都不执行。删任务临时目录单独写一条命令，读 `E:\PCConfig` 的 git 命令放另一条。临时文件按[工程与交付的清理入口](/rules/engineering-delivery/#下载临时文件和清理)处理。
- **写路径和中文的坑**：Bash 工具会先把命令里的双反斜杠变成单个（单引号里也一样），Bash 再吃掉引号外的反斜杠，所以引号外的 Windows 路径写一个还是两个反斜杠都会坏（`E:\\.agents\\skills` 最后成了 `E:.agentsskills`，读不到文件，写文件则落到别处）；在 Bash 里写路径用正斜杠 `E:/...` 或放进单引号。内联脚本里的 Windows 路径会让 `\3`、`\r` 这类被当成转义、写出控制字符；PowerShell 工具的命令要整体再解析一次，双引号字符串里的中文弯引号“”会被当成引号，整条命令报语法错、一步都不执行。所以含 Windows 路径、中文引号的文字（脚本、提交说明、文档片段）先用 Write 工具写成文件，路径用原始字符串，写完检查没有控制字符。给 `pwsh -File` 传数组参数会被拼成一个字符串，要传数组就在当前会话里用 `&` 调用，或改用 `-Command`。

## Hook 和个人资料状态

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行，复用下述受管运行时和现有 GPT 包装器；结果通过工具后或恢复、新消息边界回到原会话，不用审查者直接改代码或阻塞提示。程序入口与暂停开关见上下文 Hook 运维（`../operations/context-hooks.md`）。

`UserPromptSubmit` 每条真实新消息带来会话坐标、可核实的型号和档位、共享资料状态及已核验的无限制授权。资料需求和本人验证由根负责，按[个人资料锁与解锁](/rules/privacy-data/#个人资料的锁和解锁)和共同原则第 7 条执行；纯技术工作继续。同一驾驶舱、健康提醒每会话只提示一次或状态变化时再提示。

Stop 核对本轮真实 Report 的明确目标集合，未解锁的资料拦截、漏挂 Watch 或验收缺口可拦一次。根按原因解锁并重试或补做、补挂 Watch、补齐验收，子代理缺口须读完整报告；同轮第二次只提示。

根会话有 GPT 等候、原生后台 Agent 或 Bash/PowerShell 等未完成后台任务时，受管 Stop 用一个会话级 `asyncRewake`（异步唤醒）保活等待，按主代理最近真实活动加 55 分钟计时；新消息、主代理工具调用和下一次停止刷新活动，多个任务共用一次唤醒。未完成状态优先读宿主 `background_tasks`，GPT 执行器状态作补判；任务全结束或无法确认还在后台运行时以退出码 0 静默结束，仍有后台任务且主代理空闲达到 55 分钟时以退出码 2 叫醒，主持可继续等待。子代理自己的进度和 SendMessage 发出时刻不算主代理活动。该保活不改 Watch/Resume 的内部续等或子任务执行；宿主能力依据见官方 [asyncRewake 与后台 Hook](https://code.claude.com/docs/en/hooks#limitations)及 [Stop 输入](https://code.claude.com/docs/en/hooks#stop-input)。

程序细节、部署和维护见上下文 Hook 运维（`../operations/context-hooks.md#个人资料先解锁与结束兜底`），验证等待见[个人资料的锁和解锁](/rules/privacy-data/#个人资料的锁和解锁)。

受管根 Hook 用 `tools/Invoke-ClaudeRootHooks.ps1` 安装，运行时按内容哈希放入受管目录，以 `active-runtime.json` 选择，再合并 `~/.claude/settings.json`，保留其他设置和 Hook；宿主重读设置后生效。部署细节只维护在运维文档。

真实根提示把状态、原截止及本轮非私密标识存入小缓存，供结束检查在正式回读失败时兜底，缓存不授予资料权限。为绑定本轮，有限核对当前用户记录的标识、时间和转录字节位置，提示正文只存指纹，不持久化正文。

Stop 复用两宿主共同的版本、验收和缺口检查；资料与明确汇报验收问题合并原因，不生成 personal_data_need 状态，不启动任务。Hook 不授予资料或操作权限，不按关键词自动弹验证窗口。

Claude、本机、图形界面和电脑 MCP 共用资料状态。用 `CheckPersonalDataAccess -PrivacyLevel factor`，不必传 `RootTaskId`、`PromptId`；业务入口的 `personal_data_access.py` 已检查，不额外前置检查。Hook 缺失或投递不明时按状态不明处理，用 `StatusPersonalEnvironment` 正式回读，身份由密码中心核验。锁着或不明不取用私人资料；本人自己的问题先验证解锁，通过后再查资料、派活和完整作答，不降级回答。

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
