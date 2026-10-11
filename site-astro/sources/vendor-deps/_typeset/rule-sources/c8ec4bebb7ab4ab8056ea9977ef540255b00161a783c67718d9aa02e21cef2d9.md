# Codex 适配

owner: `E:\.agents`

只在当前动作用到 Codex 特有机制时读。这里只补充 Codex 的不同处；共同原则在其他专题里，不在这里另立一套。

## 入口和新消息

Codex home 里的 `AGENTS.md` 只是入口，规则从核验过的活动版本读。真实的新消息和自动续作、上下文压缩、工具消息分开看；Hook 会把个人资料状态带进来，Hook 缺失或投递不明时，资料状态按不明处理，并先用 `StatusPersonalEnvironment` 重读。锁着或不明时不取用私人资料；根会话问到本人自己的事，第一步先请本人验证解锁，通过后再查资料、派子代理和作答，不给降级回答；纯技术工作照常。调用 MCP 不改变本机 Codex 原来的任务入口。新消息、Hook、子代理的真实身份和执行结果从本机现役入口核实，不从标题、模型自述或别的宿主遗留的环境借身份。

SessionStart 的 compact/resume 与派活、提问前的 PreToolUse 使用共同决定投影；原生子代理压缩跳过 SessionStart 的接续按[长任务接续](/rules/context-sources/#长任务接续)读原任务状态。

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行。此项已授权自动任务使用共用 GPT 后台包装器，并保留真实 Codex 父会话号；不受普通派发的“原生满槽才转包装器”条件限制，不扩大其他任务的调用范围。程序换窗是否触发与原生压缩分开核验，具体入口见运维说明（`../operations/context-hooks.md`）。

Codex 自动记忆的关闭配置是 `memories=false`、`generate_memories=false`、`use_memories=false`；当轮需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Codex 工具的已核实教训归本专题。

## 无限制授权

本人要给当前 Codex 对话开无限制授权时，直接运行 PCConfig 安装好的 `Invoke-OwnerTakeover.ps1 -Operation Open`，不先派模型判断。`HostTaskId` 只传当前宿主真实的线程 ID，不借历史任务、MCP 连接或别的对话。Open 会生成这次的配对和请求编号，用 Windows 现有的提权能力，弹出独立窗口让本人只填时长；回执里应有 `grant_type=unrestricted`。本人验证完成后，由 Hook 自动回读并使用这份授权（`CheckHost`）；模型不手动串 `Configure/Prepare/Activate/Status/Check`，也不反复打开窗口。必要的子代理沿用同一请求和原截止；本地命令带同一组三个接管环境值，不改用户级或机器级环境变量。回执丢了先查原请求，不自动重弹窗口或重新验证。入口真的报错时才去定向诊断。

## 派子代理：Codex 的不同处

共同原则见[分工与并行施工](/rules/execution-coordination/)，可派范围见 `config/model-roster.json`。

GPT 原生子代理在 `reasoning_effort` 中按共同原则填写当前默认档位：GPT-6.1 Sol 用 `ultra`，GPT-6 Luna 用可用最高档 `max`（照写好的提示生图、落盘用 `low`，见模型清单场景表“生图”）；GPT-6.1 Sol、GPT-6 Astra 原先的 xhigh 派单改填 `ultra`，GPT-6 Luna 没有 ultra。型号换代时按约法 L23 和[新型号怎么调研](/rules/execution-coordination/#新型号怎么调研)重新评估、直接更新，不自动沿用旧型号的设置。其他公司的模型档位沿用原设置。

- **主对话是 GPT 时**：容量够用时优先用原生子代理（`spawn_agent`），在 GPT-6 Luna、Sol、Astra 里按模型清单 `routing` 的场景表和难度分级（GPT 那一列）选型号和档位，各型号的档位和适用范围见 `hosts.codex.root_openai`；表里写“交 Claude”的活怎么办见 `routing.vendor_rule`。显式传 `model` 和 `reasoning_effort`，派完核对实际启动值。跨型号或跨档位时 `fork_turns` 用 `none` 或有限轮数；只有身份参数相同、完整历史确实有用时才用 `all`。
- **主对话是其他公司的模型时**：可以派 GPT-6 Sol 或 Luna，不派 Astra。容量够用时优先调用宿主工具 `openai_child`，显式填写 `agent_type`、`model`、`reasoning_effort`、`task_name`、`message`，不传 `fork_turns`；续聊走同一入口，子代理回话走 `openai_parent`，查看、等待和停止走 `openai_child_control`。子代理要再分工时，回原父任务安排。约法 L23 里“实际调用按我给这个对话或项目的授权”说的是 Claude 调用 Codex，不给 Codex 自己派 GPT 子代理另加一次授权要求。入口因容量以外的原因不可用时，主对话继续能做的部分，说清实际缺口，不悄悄换模型，也不借别的通道绕过真实限制；容量不足按下面的例外办理。
- **重大动作前的把关**：型号、最低档位和职责统一见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)。确实需要另派时，用当前宿主的普通子代理入口明确填写符合要求的型号和思考档位；主对话为其他公司的模型时仍从上面的可派范围选择，不凭把关职责扩大可派型号。独立复核按分工原则另行安排。
- AICLI 配置和其他后端任务不是桌面原生子代理，不用来代替因鉴权、参数、上下文或真实能力限制而失败的 `openai_child`。仅宿主原生容量不足时，按下面的已授权例外转用共用包装器；其他失败按真实原因修好后继续，不随意换型号或通道。
- 新开有独立成果和责任的顶层对话时，工具可见就调用一次 `create_thread`，不预判失败、不要求本人重说；工具报错或拿不到可追踪的编号就停下说明，不盲目重试。原生槽满时的后台子任务仍由当前根对话管理，不用 `create_thread` 建顶层替身。

### 原生容量不足时转用共用包装器

实时确认宿主原生槽不足后，自动转用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，显式传 `-ParentHarness Codex` 和 `-SessionId '<当前真实父任务完整编号>'`。默认结果目录是 `E:\Cache\Codex\Temp\<完整SessionId>\gpt-children`，不借 Claude 会话号或截短编号。容量判断、回执不明时的核对、同额度子代理续作及后台管理统一见[分工与并行施工的共用接续](/rules/execution-coordination/#原生容量不足与原线程接续)，不因入口改变扩大授权和业务范围。（出处：决定文档“Codex 满槽派发与同额度子代理续作”）

```powershell
$child = 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1'
& $child -Mode Start -ParentHarness Codex -SessionId '<当前真实父任务完整编号>' -PromptFile '<任务.md绝对路径>' -Model gpt-6.1-sol -Effort ultra -NewWorktree -RepoPath '<仓库绝对路径>' -TaskName '<短名>' -ContinueOnQuota
& $child -Mode Watch -RunDirs @('<结果目录>')
& $child -Mode Resume -RunDir '<同一结果目录>' -PromptFile '<续作.md绝对路径>'
```

执行器监测和接续状态与 Claude 共用，新版后台订阅在周期到点时内部续等；旧轮终态后 Resume 在原线程接入。Start 默认启动后返回，需要等候时显式加 `-Wait`；旧 `-NoWait` 仍可用。Watch 可加 `-WakeOnEach` 在任一任务结束时叫醒，回执只列剩余任务；Resume 保留原默认等候。派活单和 M1 的具体用法见派发说明（`../claude-gpt-child-dispatch.md`）。

上例的 `-ContinueOnQuota` 只在同一 Codex 额度下根会话仍能正常调用时启用；否则省略。Sol、Luna 派活单开头带 `---` 栏位段，写齐任务、出处、方案、仓库、基线、工作树、范围、代码上限、测试上限和时限分钟，方案为“已定”。Astra 至少写“时限分钟”。修改代码的工作树必须是任务专用的；只读任务用 `-WorkDir '<已有目录>'` 替换工作副本参数。Extend、预算放行 `-AllowOverBudget` 和纠错 `-Correction` 都带 `-Reason`。验收完用 `Status -Ack`。

## 新消息里的状态

Hook 在真实新消息和子代理启动时，读取当前个人资料状态与本人接管状态，并告知宿主可核实的本会话型号和思考档位；本轮读不到的写未知，子代理启动时档位写未知，不借父会话的记录。锁着、未知或 Hook 出错时，根会话收到先请本人验证解锁、通过后再查资料、派活和完整作答的提醒；子代理收到实际缺口交回根会话的角色提示，两者都不给降级回答，纯技术工作继续。根会话状态未知时先用 `StatusPersonalEnvironment` 重读。本人接管只使用正式入口回读的授权和原截止。Hook 不替模型选型号、思考档位或决定要不要委派，也不另设派发许可登记，不按关键词自动弹验证窗口。

原生子代理由真实子会话元信息和 SubagentStart 识别，包装器角色由实际进程标记识别。资料需求判断和验证只由根会话做；子代理不重新判断要不要解锁，仅读取被拦、途中缺资料或到期时汇报单行“需要本人资料：……”交回，根会话人工读报告处理，不提取机器标记。

受管 Stop 从本轮真实 Report 回执核对明确目标集合，复用与 Claude 同一份版本、验收和缺口检查；有限读取本会话末尾最多 2 MiB/4096 行，核同轮真实用户边界后只识别真正业务回执：指定 schema 或业务检查动作、顶层 blocked 和保护原因码。只读状态回读、子代理汇报、源码和搜索样例不算；本轮未实际发起解锁时直接拦，不再查状态。已实际发起解锁按既有条件放行；普通技术任务无被拦业务回执时直接放行，不按“通用回答”等措辞猜资料需求或绕过业务保护。Codex 不按模型自白或子报告措辞拦截，不把读技能 SKILL.md 当作加载，也不维护仅为这些信号存在的 Stop 状态缓存；资料顺序由每轮提示、业务回执和根会话验收落实。

只对根会话给验证指令；子代理不发起验证，按角色交回。拦截后宿主让模型继续，同轮第二次只提示，不再拦；Stop 45 秒。读取、解析或本轮边界核验失败时放行受影响检查，并留固定诊断码，输出不含对话、思考或子报告。部署和维护见状态钩子说明（`../operations/context-hooks.md`），验证等待见[个人资料锁与解锁](/rules/privacy-data/#个人资料的锁和解锁)。

## 官方升级

Codex 的版本号、构建号、带版本的安装目录和更新批次都不能当可用性门槛。密码中心沿本人 Windows 账户的真实祖先链识别登记包族的 Codex 桌面应用本体，日常调用自动选择 `codex-root`；从 Claude 桌面启动的 Codex 子进程按其 Claude 祖先识别为 `claude-root`，不按模型名称改换主体。官方更新后仍按同一账户、包族和桌面本体核验，无需运行时密钥续绑。受管 Hook 的内容哈希只保护 Hook 自身；缺了可选的宿主信息，只让依赖它的那项能力变成不明或不可用，普通项目照常。
