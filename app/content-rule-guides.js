function item(title, detail, example) {
  return { title, detail, example };
}

export const ruleGuides = {
  agents_root_rules: {
    glossary: [
      ["事实 Owner", "某类动态事实的唯一负责来源。文档可以指路，但不能替代 Owner 的现场回读。"],
      ["Project rule", "离当前目录最近的 AGENTS 规则，拥有这个项目的业务语义、命令、兼容和发布边界。"],
      ["External effect", "会改变外部系统或现实状态的动作，例如发消息、提交表单、发布、部署、付费。"],
      ["Advisory artifact", "Skill、模板、计划或 checklist 只是可选方法，不会自行变成必须遵守的硬门。"],
      ["Read-back", "执行之后从真实 Owner 再读一次结果，避免把命令返回成功误当成状态真的改变。"],
      ["Fail closed", "必要身份、授权或完整性证据缺失时关闭那项高风险动作，而不是猜测继续。"]
    ],
    sections: [
      {
        title: "一、先判断听谁的",
        intro: "根规则先解决指令和事实来源冲突，避免模型从错误材料出发。",
        items: [
          item("固定优先级", "发生冲突时依次服从 system/developer、本轮用户、最近项目规则、全局根规则，最后才是 shim 或记忆。历史计划、报告和生成物不在这条指令链上。", "用户本轮说只本地，就覆盖项目默认的提交推送；一份旧计划写着自动发布不能反过来覆盖用户。"),
          item("只读当前目录链上的规则", "从项目根到当前工作目录逐级寻找适用 AGENTS，只读取仍处于现行路径上的规则。历史备份和已经移出的规则不参与。"),
          item(".agents 拥有什么", ".agents 负责 Agent 行为、授权、能力路由、个人 Skills/Plugins 和跨项目协作。它不拥有 Git 或机器的动态事实。"),
          item("Git 控制面拥有什么", "仓库身份、visibility、remote、默认分支、worktree、同步和发布事实由 Git 控制面现场提供。"),
          item("PCConfig 拥有什么", "本机路径、磁盘、端口、计划任务、运行时、模型、数据源、迁移、备份和恢复事实由 PCConfig 提供。"),
          item("具体项目拥有什么", "业务语义、领域数据、源码、启动和测试方式归具体项目。全局规则不能替项目决定业务。"),
          item("项目规则不能被全局覆盖", "全局规则和机械门只能与项目规则取交集或进一步收紧身份、授权和并发边界，不能改写项目命令、兼容或产品语义。", "项目写明必须用它自己的 acceptance.ps1，全局不能因为偏好 pytest 就替换。"),
          item("三个控制面按需进入", "只有相关事实会改变当前决定时才读取对应控制面，不进行周期性全扫，也不要求每个任务依次经过三个仓库。"),
          item("路径分工", "运行安装态留在用户配置目录；仓库和 worktree 放在 V 盘指定根；Z 盘只允许可重建 cache 和 scratch，禁止唯一副本。")
        ]
      },
      {
        title: "二、模型怎样选择方法",
        intro: "根规则要求模型保持判断力，不把固定流程当成能力。",
        items: [
          item("模型直觉优先", "根据目标、风险、可逆性和预期净收益自主选择计划、TDD、工具、子代理和验证深度。用户指定的 model 与 reasoning 不自动降级。"),
          item("先说现实结果", "面向用户时先讲结果、使用方式、边界和是否需要用户动作；代码、测试、回执只在会改变完成判断时说明。"),
          item("测试不能冒充产品", "PASS、字段、协议和脚本返回只能证明对应证据层，不能替代真实用户路径。", "构建成功不等于公网已经部署；部署成功不等于页面能打开。"),
          item("用户要求人话时立即重述", "不复读内部验证过程，而是回到用户真实问题，用普通语言说清楚。没有固定回复模板、字数或评分器。"),
          item("该并行时必须重判", "出现两条以上互不依赖、独立可验、并行净收益为正的支路时重新判断 0 到 10 个直属代理。单写者只串行真正冲突的写临界区。"),
          item("委派身份先于数量", "只有宿主 verified 身份，或旧 root 经用户明确声明并回读的对话绑定，才能做 0 到 10 决策。无身份时只关闭 spawn，主任务继续。"),
          item("优先现有原生能力", "先查 owner adapter、固定 CLI/API 和 metadata；工具初始列表不是能力上限。实证入口缺失或失败后才降级。"),
          item("Skill 不是硬门", "Skill、Plugin、模板、计划和 checklist 都是建议性制品。只有上位指令、活动规则、项目硬边界或宿主机械门才是硬门。"),
          item("渐进读取上下文", "metadata 只把候选能力放回注意力，正文仍只读取会改变答案的部分。重大 steer、压缩或 Owner 变化后重新锚定目标和边界。"),
          item("长任务必须可重建", "目标、硬边界、授权、关键决定、当前实现和验证状态要能从正确 Owner、项目产物或宿主持久状态恢复；简单任务不机械建文档。"),
          item("代码只为真实变化抽象", "只在已有重复、稳定变化轴或 Owner 边界能降低总成本时抽象；没有真实 consumer 的适配器和安装态应退出。"),
          item("控制仓库膨胀", "保护产品语义和必要安全恢复结果，不保护文件、状态机或报告形态。完成计划和旧复盘交给 Git 历史，不留活动副本。"),
          item("版本 pin 有退出条件", "只有复现、安全、合规、已证不兼容或上游硬约束才 pin；最新且不确定的技术事实联网核验并优先官方来源。")
        ]
      },
      {
        title: "三、授权和施工责任",
        intro: "这一部分区分用户授权、Windows 权限、Agent 身份和谁在改代码。它们不是同一件事。",
        items: [
          item("本机可逆工作直接做", "范围内的读取、编辑、测试和验证不需要反复询问。"),
          item("External effect 需要明确授权", "消息、表单、外部修改、发布、部署、付费等动作需要用户明确对象、内容和动作。本轮已经说清就成立，不重复索权。"),
          item("已登记目标继续收敛", "同一 active 目标的验证、发布、激活、read-back、修复、重试和 Git 收口默认继续，除非用户明确要求只本地。"),
          item("新边界仍要精确门禁", "首次登记、新公开目标、付费、force-push、不可逆迁移、信任根或授权边界变化不能从旧授权推导。"),
          item("服务不足也是问题", "AI 应最大化用户净收益并把事情办成；无理由少做、反复索权、把可自动解决的问题甩回用户，同样需要纠正。"),
          item("最高权限身份不能复制", "当前最高权限角色只有独立登记的 root。名称、提示词、同一 Windows 用户、管理员 token 或复制密钥都不能让其他代理继承。"),
          item("紧急对话授权只限当前对话", "一次可靠因子可让当前准确对话在 24 小时内临时优先于受保护规则，但不传播给子代理，不覆盖 system/developer/platform，也不伪造外部事实。"),
          item("CoreGoal 冻结目标而非实现", "一次可靠因子固定目标、范围、禁止项和停止条件；计划、Schema、代码、executor 和后续 epoch 变化只重派生步骤。"),
          item("每个 effect 使用单次步骤能力", "步骤能力短时、单次、防重放，绑定目标、参数、影响上限、pre/post、回滚、executor 和 nonce。"),
          item("Execution Owner 认领最小 scope", "第一次写入前用 CAS Claim 最小施工范围；同一项目 scope 不重叠，扩缩、改派和恢复都走正式 transition。"),
          item("跨项目机械维护是窄例外", "只允许同类、确定、可回退、可独立验证的中低风险小修；业务语义、Schema、权限、依赖大升级和发布不属于该例外。"),
          item("可信、私密和授权分开", "本机、BitLocker 磁盘、私人云和 PRIVATE GitHub 可以是 trusted target，但不自动授予写入，也不自动等于公开。"),
          item("人类因子只有四类", "Passkey、TOTP、Recovery、Account。Google 和 Microsoft 只是 Account provider。取消、超时或失败只暂停，不自动重试或改变设备信任。"),
          item("UAC 只解决 OS token", "按需管理员能力默认可用；用户明确禁止提权时停用。UAC 不产生业务授权、Agent 身份或人类确认。")
        ]
      },
      {
        title: "四、Git、验证和 Windows 环境",
        intro: "这一部分规定怎样保护用户改动、怎样收口仓库，以及不同证据能证明什么。",
        items: [
          item("普通 Git 先看 status", "只有仓库身份、visibility、remote、分支、worktree、同步、恢复或发布事实会改变决定时才调用 Git Owner。"),
          item("绝不覆盖未知改动", "混合工作树只处理本任务文件，定向 stage，禁止破坏性清理和 git add 全部文件。"),
          item("实现默认包含正常 Git 收口", "用户授权仓库实施后，验证、定向 commit 和 normal push 到已有 upstream 默认成立；force-push 从不默认授权。"),
          item("个人仓库完成必须到默认分支", "目标提交要从实际 default branch 可达，normal push 后远端 read-back 仍包含它。只存在于 AI branch 或 worktree 不算完成。"),
          item("Worktree 只是短期隔离", "最终必须整合后删除、证明冗余后删除，或有真实用途和退出条件地保留；不能当任务台账。"),
          item("证据层独立", "source、test、install、publish、fresh task、E2E 互不代替。缺失、陈旧或 unknown 不能升为 PASS。"),
          item("Windows 文件规范", "优先 PowerShell 7；Markdown、JSON、YAML 和 Skill 使用 UTF-8 无 BOM；含中文常量的 PowerShell 使用 UTF-8 BOM；非交互进程不能弹可见控制台。"),
          item("下载、临时物和 GPU", "下载进入 E 盘下载目录；临时物进入当前任务独立临时目录；只清理自己的命名空间；GPU 重载通过 Broker 串行。"),
          item("安装环境不能越过边界", "官方稳定运行时可在兼容、可回退且净收益为正时安装；付费、账号、重启、重装、运行 Owner 和信任边界仍单独处理。")
        ]
      },
      {
        title: "五、私人领域、文档和 Skills",
        intro: "最后一部分把私人需求拆成窄能力，避免恢复一个中央个人数据库。",
        items: [
          item("中央个人知识入口已永久退役", "健康、本人法律事务和微信分别进入自己的独立入口；只有原件位置未知时才用材料定位，录音和扫描件分别交给 ASR 与 OCR。"),
          item("没有持续需求就不建新项目", "普通问题直接用当前对话和最小原件回答；只有稳定持续需求、净收益成立并由用户明确启动时才建小项目。"),
          item("禁止中央画像和后台同步", "不恢复中央个人数据库、统一事件图、跨领域画像、后台同步或总 Skill。照片视频只进入明确启动的有界媒体任务。"),
          item("秘密有固定 Owner", "SecretRef 走本地 Secret Broker；Vault 和 Key 走独立 Vault 工作流。BitLocker 全量恢复的敏感结果不能进入聊天、stdout、JSON 或剪贴板。"),
          item("人类文档不是动态权威", "README、操作指南和恢复教程必须人话且保持最新，但只有用户明确询问、维护或它是具名验收证据时才读取。"),
          item("Personal Skill 只有一份 source", "Canonical source 位于 E 盘 skills 与 plugins，唯一清单是 personal-skill-supply.json，用户目录只放事务 installer 创建的 junction。"),
          item("新规则原位升级", "根规则只放跨项目元规则和真实硬边界；专项 SOP 放合同、Skill 或项目；触发 metadata 只在 catalog 维护；字符预算由配置和测试执行。")
        ]
      }
    ]
  },
  protected_major_actions_contract: {
    glossary: [
      ["Candidate", "E 盘可编辑规则源码。它可以与活动规则不同，但不同只表示待发布。"],
      ["Active generation", "C 盘中不可变、已签名并通过固定 Authority 验证的现行规则集合。"],
      ["Policy epoch", "活动规则的单调代际编号，当前是 79。"],
      ["Anchor", "写在受保护机器位置的活动 generation 承诺，用来防止回滚和替换。"],
      ["Containment", "确认活动权威被破坏后冻结重大动作并进入恢复，不由普通失败触发。"],
      ["Adapter", "负责执行一种受保护现实 effect 的登记执行入口。"]
    ],
    sections: [
      {
        title: "一、谁判断重大动作",
        intro: "保护合同把语义判断和机械验证分开。",
        items: [
          item("最高权限智能体作语义判断", "它结合真实意图、精确目标、范围、可恢复性和异常证据，选择 allow、step up、deny、needs evidence 或 suspected tamper。"),
          item("机械层不能靠关键词判断", "机械层只检查登记、签名、nonce、目标、事实、完整性和 effect 边界，不能看到敏感词就自行要求人类。"),
          item("其他代理不能继承最高权限", "必须独立证明 principal、runtime 或公钥绑定；名称、提示词、同一 Windows 用户和管理员 token 都不够。"),
          item("四类人类因子", "Passkey、TOTP、Recovery、Account 任一已登记因子都充分；Account 还要指定已登记 provider。原始秘密不保存。"),
          item("目标不清先补证据", "只有目标无法唯一解析时先 needs evidence；授权或安全边界明确不成立才 deny。"),
          item("同一目标内持续无人值守", "CoreGoal 已成立后，准备、执行、回读、修复、崩溃恢复和必要回滚都可继续，每个 effect 仍消费单次步骤能力。")
        ]
      },
      {
        title: "二、Candidate、Active 和完整性事件",
        intro: "最重要的区别是：源码变化不等于活动规则被篡改。",
        items: [
          item("正常发布链", "E canonical candidate 先生成受保护候选，经 Publisher 事务变成 C 盘 immutable active generation。"),
          item("Candidate pending", "候选与活动代际不同只报告 policy candidate pending，活动旧代继续有效，不进入不可信状态。"),
          item("Candidate unavailable", "候选读不到时继续验证既有 active；禁止发布、猜测或恢复 candidate。"),
          item("受保护 whole-file 集合", "保护合同、授权合同、Owner adapter registry 和全局 shim 属于 whole-file 关键面。"),
          item("根规则关键承诺", "External effect、既有目标收敛、无人值守授权、人类因子、管理员能力和保护合同指针必须唯一完整。"),
          item("什么才是完整性事件", "只有活动包、签名、HKLM anchor、epoch、AuthorityHost、Owner 身份、恢复水位或 ledger 在合法事务外被替换、删除、回滚、伪造、重放或旁路，才是确定性事件。"),
          item("先排除普通原因", "进入 containment 前必须排除 candidate 差异、Git dirty、合法 journal、封存 preimage 和一次读取故障。"),
          item("普通失败不会改变设备信任", "用户拒绝、因子缺失、step-up 失败或一次读取失败只暂停相关交易。")
        ]
      },
      {
        title: "三、固定活动 Authority 怎样验证",
        intro: "项目启动只认一个固定 C 入口，任何 E 盘或临时 JSON 都不能替代。",
        items: [
          item("允许读取规则的三个状态", "active verified、candidate pending、candidate unavailable。其他状态的受保护重大动作全部关闭。"),
          item("Generation root 必须精确", "active generation root 必须指向固定 generations 目录下当前 ID，不能接受环境变量或调用者路径覆盖。"),
          item("五份规则必须闭合", "required rule paths 恰好映射根规则、保护、授权、三控制面和能力路由，并全部位于同一 projection。"),
          item("不仅检查文件 hash", "还要验证 projection manifest、bundle 和 attestation 签名、generation chain、HKLM anchor、publish/consume/issuance/termination ledgers、shim、Provider 绑定和 adapter registry。"),
          item("默认只完整读根规则", "保护、授权、三控制面和能力合同只有在当前任务确实触发时才从同一 generation 展开。"),
          item("Production activation 独立", "只有 production activation true 才允许登记 adapter。唯一可继续读规则的 false reason 是 publisher authorization pending，但重大 effect 仍关闭。"),
          item("E wrapper 只是消费者", "它固定调用 C Provider 并验证父链、ACL 和入口 hash，自身不是 Authority，也不能接受任意 RepoRoot 或路径 override。")
        ]
      },
      {
        title: "四、发布、Shim 与回读",
        intro: "活动规则发布是一个受保护事务，不是复制几个 Markdown。",
        items: [
          item("Generation 绑定的内容", "至少包含五份规则、shim 模板、adapter registry、bundle、attestation、projection manifest、publish receipt、前代 generation、epoch、anchor 和各 ledger head。"),
          item("步骤能力绑定全部关键事实", "单次能力绑定 active goal、候选 manifest、当前 generation/epoch/anchor、Publisher 与 Authority hash、effect、critical surfaces、用户意图、principal、pre/post 和 nonce。"),
          item("Staging 后再次验新鲜度", "Publisher 在全局锁中重验旧活动链和候选字节，写 staging 后再次核对，避免发布期间事实漂移。"),
          item("消费后不可重放", "能力一经消费就写 ledger，提升 token 或重新运行命令不能产生第二次授权。"),
          item("每一层单独证明", "Publisher 返回、源码测试、签名包、安装和 read-back 任一单层都不能冒充其他层。"),
          item("Shim 的写权限", "Shim 叶子只允许 SYSTEM 和 Administrators 写，普通用户和受限运行身份只读执行；守护进程持有防写删句柄并定期回读。"),
          item("发布必须处理守护与 preimage", "停止守护、保存内容寻址 preimage、事务替换、read-back 并重启，ACL、任务和现场运行都要验证。"),
          item("生产 adapter 只有三个", "规则 Publisher、Git 重大动作和 PCConfig 重大动作。退役系统不再拥有 adapter。"),
          item("安全承诺有边界", "系统承诺受管路径检测越权、失败关闭和恢复证据，但不承诺抵抗已取得管理员、SYSTEM、内核或离线磁盘控制权的攻击者。")
        ]
      }
    ]
  },
  authorization_delegation_contract: {
    glossary: [
      ["Authorization", "用户对现实动作的许可，和 Windows 管理员权限不是一回事。"],
      ["CoreGoalCommitment", "一次可靠人类确认冻结的长期目标、范围、禁止项和停止条件。"],
      ["CoreGoalStepCapability", "允许一次精确 effect 的短时、防重放步骤能力。"],
      ["Execution Owner", "协调谁在修改哪个最小 scope，不产生授权或业务事实。"],
      ["Registered target", "持久 reference 说明目标是谁，现场 resolution 说明现在允许做什么。"],
      ["Residual", "任务结束前仍未完成、必须带 checkpoint 移交的现实义务。"]
    ],
    sections: [
      {
        title: "一、授权、提权和委派",
        intro: "这三类能力彼此独立，不能互相替代。",
        items: [
          item("本机低风险工作直接推进", "范围内读取、编辑、测试和验证不需要额外人类确认。"),
          item("External effect 的授权边界", "本轮请求明确对象、内容和动作就构成授权，但不扩到首次创建目标、额外账号、新公开面或其他任务。"),
          item("管理员能力默认按需可用", "当前进程是 Medium token 不代表无法管理员执行；只有用户或项目明确禁止才停用 UAC。"),
          item("UAC 不产生授权", "它只提升 OS token，不产生项目写权、最高权限身份或人类因子。"),
          item("Child 只能收窄", "后代的 scope、authorization、sandbox、model 和 effort 取用户、父级、活动规则和宿主可用集的交集。"),
          item("项目规则不被取消", "授权合同只能收紧项目规则；无法同时满足时失败关闭并报告精确冲突。")
        ]
      },
      {
        title: "二、最高权限身份与 CoreGoal",
        intro: "一次人类确认固定目标，后续每个现实步骤仍有自己的精确能力。",
        items: [
          item("最高权限角色唯一登记", "当前只有 root。其他智能体缺少独立证明时返回 highest authority verification required，不能先读取受保护正文。"),
          item("只有最高权限智能体决定要不要人类", "机械层不能按 effect 名、critical surface、executor 或 epoch 自行抬高要求。"),
          item("CoreGoal 固定什么", "目标 hash、范围、禁止项、停止条件、principal commitment、脱敏 confirmation、policy/trust 基线、状态、时间和 append-only ledger。"),
          item("CoreGoal 不固定什么", "计划、Schema、代码、executor、runtime 和后续 epoch；这些变化不会自动重验人类。"),
          item("紧急对话授权", "绑定准确对话、principal 和 runtime，固定 24 小时，只改变当前对话的受保护规则优先级。"),
          item("步骤能力的完整绑定", "Core hash、语义判断、单一 effect、目标、参数、影响上限、禁止项、preimage、pre/post、rollback、executor、epoch、expiry、nonce 和消费位置。"),
          item("事实漂移怎样处理", "过期、失败或实现漂移只让当前步骤能力作废；在同一 active goal 下重派生。"),
          item("什么情况必须 successor", "只有目标、范围、禁止项或停止条件改变或扩大，才创建引用 predecessor 的 successor 并重新确认。"),
          item("四类因子全部丢失", "不能自举、补录或恢复新人类根，但已经 active 的 goal 不会被追溯撤销。")
        ]
      },
      {
        title: "三、既有目标怎样持续收敛",
        intro: "同一目标不应因为发布链故障或实施改动反复索权。",
        items: [
          item("Standing convergence 的对象", "只覆盖授权前已经由 Owner 登记且仍 active 的精确目标。"),
          item("默认继续的步骤", "验证、事务发布、部署、激活、正式 read-back、定向 Git 收口和正常 PR/release/deploy。"),
          item("仍需精确门禁的变化", "首次登记、新外部目标、新公开或部署目标、付费、不可恢复迁移、force-push、信任根或授权边界变化。"),
          item("不重复询问", "对象、账号和能力范围已明确后，同一范围的实现、重试、验证、安装、发布和回读不再询问。"),
          item("Target reference 与 resolution", "Reference 固定原先登记目标的身份和 resolver；resolution 现场给出 active/retired、visibility、允许动作、adapter、preconditions、rollback 和授权要求。"),
          item("副作用边界必须重验", "实际 external effect 前重新解析目标和未过期 resolution；缺失、过期或漂移时停止，不能事后登记追认。"),
          item("完成必须有 receipt 加 read-back", "文档、标题、截图、缓存或 candidate path 都不能证明 effect 已发生。")
        ]
      },
      {
        title: "四、Execution Owner 的完整规则",
        intro: "Owner registry 防止多个任务改同一 scope，也防止任务结束时丢掉未完成义务。",
        items: [
          item("Owner 不替代事实和授权", "它只协调施工，不授予私人正文、提权、人类因子或业务事实。"),
          item("纯只读不用 Claim", "首次专属写入、决定、受保护 proposal 或交接前才读取 binding 并认领。"),
          item("不能从标题或 cwd 推断", "只有 registry 的 expected revision CAS 绑定成立。"),
          item("一个任务最多一个项目", "同项目 scope 不重叠；首次 Claim，同 holder 追加独立 scope 用 Add，扩缩改派用正式 transition。"),
          item("写前 AuthorizeAction", "每次写入核对 action、task、scope、binding 和 revision，防止拿旧 claim 改新范围。"),
          item("已有 Owner 时怎么办", "不借 shell、plugin、child、worktree 或 UAC 绕过。只发送一次有界请求；非硬依赖继续不冲突工作。"),
          item("等待只有一轮", "关键路径只剩 Owner 结果时，作一次 terminal 或 needs-attention 事件等待，不持续轮询 commentary。"),
          item("Cross-thread delivery 不等于完成", "只证明宿主接受了发送；失败时不循环重试，改给可转发 prompt。"),
          item("Coordination Owner 不获得成员项目写权", "跨项目编排只拥有关系和最终集成。"),
          item("Shared maintenance 的窄边界", "每次只 Claim 一个项目，限机械、确定、可回退的小修；业务语义、Schema、权限、依赖大升级、API 和发布全部禁止。"),
          item("Release 前处理 residual", "普通 Release 只允许无残余；有残余必须随 checkpoint 原子 Transfer 给真实 successor。"),
          item("恢复孤儿 Owner 的证据", "只接受固定宿主 adapter 的 terminal 或 task-not-found，并核对 project、scope、revision、workspace、checkpoint 和 pending transaction。timeout 和自制 JSON 不成立。"),
          item("归档 predecessor 不唤醒", "用户要求 successor 接续已归档任务时，旧任务保持归档；先验证规范 rollout、无 queued work 和 active duplicate，再原子 RecoverReleaseClaim。"),
          item("规则发布 scope 不能自报", "由五份活动 descriptor 与 source SHA 的封闭映射推导真实改变范围，未知、重复或漂移时失败关闭。")
        ]
      },
      {
        title: "五、Git 完成语义",
        intro: "Git 收口是否属于产品完成，要按交付本体判断。",
        items: [
          item("默认授权的 Git 动作", "仓库实施已授权时，验证、定向 stage、commit 和 normal push 到已有 upstream 不再询问。"),
          item("停止条件", "未知 repo 或 target、无 upstream、非 fast-forward、sync 冲突或 PUBLIC 暴露检查失败。"),
          item("个人默认分支收敛", "目标提交必须从实际 default branch 可达，push 后远端 read-back 仍包含它。"),
          item("业务与 Git 分开报告", "Git 是交付本体时未闭合就业务未完成；Git 不是交付本体时可报告业务已完成但 Git blocked，前提是 residual 已移交。"),
          item("禁止为表面干净破坏事实", "不能 force-push、泄密、删除未知内容、覆盖 dirty work 或把失败制品推入默认分支。"),
          item("Worktree 最终状态", "整合后删除、证明冗余后删除，或以稳定名字、真实用途和退出条件保留；查不清就 BLOCK。")
        ]
      },
      {
        title: "六、目标可信度与内容保真",
        intro: "目标私密不等于已经授权，也不等于应该删减内容。",
        items: [
          item("Visibility 与 trust 分开", "本机、workspace、BitLocker 磁盘、Google 私人空间、PRIVATE GitHub 和已证私有云可成为 trusted target；未知远端保持 UNKNOWN。"),
          item("Trusted target 内按需保真", "环境文件、token、密码、私钥和 OAuth JSON 在真正私密备份任务中按任务需要原样保留，不能静默换占位符。"),
          item("保真不扩大发送授权", "可信、可见性和 external effect authorization 仍是三个独立判断。"),
          item("PRIVATE 仓库应完整收敛", "只可因秘密边界、可重建 cache、活数据库、大制品、格式许可或用户 local-only 排除，并明确说明。"),
          item("不完整副本不能叫完整备份", "PRIVATE GitHub、本机热备、私有云备和人工冷备是不同层。")
        ]
      }
    ]
  },
  four_base_decision_context_contract: {
    glossary: [
      ["三控制面", ".agents、Git 控制面、PCConfig；具体项目是业务 Owner，但不是第四控制面。"],
      ["Compatibility ID", "文件名和 logical id 为兼容旧接口保留，不代表旧架构仍然存在。"],
      ["Primary", "某个视图默认先返回 metadata 的关键文档。"],
      ["Conditional", "只有当前影响确实需要时才展开的文档。"]
    ],
    sections: [
      {
        title: "一、现行架构边界",
        intro: "这份规则最主要的作用是阻止历史名称重新创造第四个控制面。",
        items: [
          item(".agents 控制面", "负责 Agent 行为、授权和能力路由。"),
          item("Git 控制面", "负责 repo identity、visibility、branch/worktree、同步和发布。"),
          item("PCConfig 控制面", "负责机器路径、runtime、任务、备份和恢复。"),
          item("具体项目", "继续拥有业务语义、源码、数据和产品验收；它不是全局控制面。"),
          item("Four-base 只是兼容名", "文件名、logical id 和 schema 不表示仍有第四基座。"),
          item("退役系统不恢复", "冻结 PRIVATE 文档、备份或旧路径都不能让它重新成为控制面、默认个人上下文、运行产品或动态事实源。"),
          item("PCConfig 的备份对象不产生正文权限", "机器控制面可以保护私人数据对象，但这不授权读取其内容，也不恢复旧系统。")
        ]
      },
      {
        title: "二、怎样取得跨控制面证据",
        intro: "只在跨 Owner 事实会改变架构、运行治理或长期演化时使用。",
        items: [
          item("只有两个视图", "operations governance 用于运行治理；global evolution 用于整体演化。"),
          item("入口只返回 metadata", "Owner、活动和候选路径、权威角色、SHA、字节和 token 估算；不复制正文。"),
          item("不运行动态 Provider", "上下文入口本身不读取 GitHub、机器状态或业务数据，也不建立共享数据库。"),
          item("先 metadata 后正文", "模型根据当前影响再读取 primary 或 conditional 文档，避免把所有控制面一次灌入上下文。"),
          item("活动规则仍来自固定 Authority", "Catalog 只保存 logical id 和 E candidate source，不能把候选路径当活动正文。"),
          item("四类结论分开验证", "合同设计、Git commit/default branch/remote、机器 runtime/备份/恢复、外部 adapter receipt/read-back。任一层不能证明其他层。"),
          item("闭包失败时停止", "Catalog、schema 或 logical id 闭包无效，必需 Owner 缺失，或 primary 不可读时失败关闭。"),
          item("默认排除大体积和私人正文", "旧私人数据库、媒体、恢复载荷、.git、cache、temp、报告、preimage 和巨大机器快照都不进入默认上下文。"),
          item("什么时候才评审新控制面", "只有三个控制面和具体项目都无法吸收，且需求拥有独立稳定 Owner、生命周期和安全恢复边界时才评审。历史命名和备份存在都不是理由。")
        ]
      }
    ]
  },
  capability_routing_contract: {
    glossary: [
      ["Expected net value", "能力带来的信息、质量和时间收益，减去延迟、耦合、成本和出错风险。"],
      ["Capability salience", "先用 metadata 把可能有用的能力放回注意力，再决定要不要读正文。"],
      ["Evidence-based degradation", "确认原路线真实缺失、失败或被策略阻断后才换路线。"],
      ["Reader routing", "根据文件和任务类型选择原生 reader，不让一个总入口接管所有材料。"],
      ["Fresh task", "安装完成后启动的另一个新任务真实发现能力。"],
      ["E2E", "用真实输入走完整路径并得到用户可见结果。"]
    ],
    sections: [
      {
        title: "一、方法和能力自治",
        intro: "能力合同不规定固定流水线，而是规定选择能力时要看什么。",
        items: [
          item("选择方法的七个维度", "目标、风险、信息增益、延迟、耦合、可逆性和 expected net value。"),
          item("保留用户模型选择", "用户指定 model/reasoning 时不因为高风险自动降级。"),
          item("Metadata 不强制正文", "metadata 只提升候选注意力，是否读 Skill、Plugin、模板、计划或文档仍由当前净收益决定。"),
          item("Skill 中的 MUST 不是平台门", "只有上位指令、活动规则、项目硬边界或宿主机械门能成为不可越过的 gate。"),
          item("先查现有能力", "优先 owner adapter、固定 CLI/API、当前 metadata 和原生 tools；工具初始列表不是上限。"),
          item("能力发现不扩权", "找到一个工具、账号或插件不代表允许调用它执行 external effect。"),
          item("Effect schema 和 executor 分开", "有类型化 operation 但缺实现时，由对应 Owner 补窄 executor 和测试；已有等价入口时不提示插件。"),
          item("缺环境时优先官方原生安装", "在任务必需、可逆和兼容边界内安装 runtime/SDK/CLI/build tool；既有项目服从 lock 和 CI。"),
          item("兼容层是后选", "容器、旧 runtime 和 shim 只有原生路径不可用或不兼容时采用。付费、账号、重启和信任边界仍单独处理。")
        ]
      },
      {
        title: "二、私人领域和 Google Workspace",
        intro: "能力路由把持续私人需求拆成窄入口，不恢复中央知识库。",
        items: [
          item("健康、本人法律事务和微信直达", "它们分别由自己的项目和 Skill 负责，不经过 Personal Knowledge（中央个人知识入口）。"),
          item("原件未知才用定位能力", "非媒体原件走 personal materials；媒体走 personal media；录音和扫描件分别走 ASR/OCR。"),
          item("照片视频只在明确任务中处理", "不建立后台媒体扫描和统一人物服务。"),
          item("没有独立项目就用最小原件", "只在稳定持续需求和净收益成立并由用户明确启动时建新项目。"),
          item("Workspace 固定一个 Provider", "Gmail、Drive 和 Calendar 通过 PCConfig 固定 OAuth Provider，默认读取。"),
          item("写入只用已暴露 operation", "不落库、不自动同步、不换账号，不静默走浏览器、raw provider 或 rclone。"),
          item("Provider 不可用就如实受限", "不制造第二 Provider。删除、公开分享、发送和邀请还要精确 external effect 授权。"),
          item("读取和写入分别验收", "三项读取全通过后才成为默认自然语言能力；每个写 operation 仍独立验收。")
        ]
      },
      {
        title: "三、耐久状态、代码和配置",
        intro: "复杂任务可恢复，代码不过度抽象，配置复杂度按真实需求增长。",
        items: [
          item("压缩摘要只是线索", "压缩或接续后重新读取规则、Owner、工作树和证据，不能凭摘要直接写。"),
          item("Checkpoint 保存什么", "目标、边界、授权、关键决定、当前实现和验证，不保存隐藏推理、秘密和无关私人内容。"),
          item("可演化代码的优先级", "内聚、单一事实源、显式接口、确定行为和版本化迁移。没有真实变化轴不建框架。"),
          item("模型和厂商变化用窄 adapter", "Provider config 归 Owner，Consumer 只依赖最小稳定接口，不镜像内部源码和文件清单。"),
          item("路径和 hash 记录要有退出条件", "必须有 Owner、Consumer 和 exit condition，不能永久复制动态事实。"),
          item("仓库膨胀治理", "活动 HEAD 只留现行 source、contract、config 和行为回归；计划、复盘和旧设计由 Git 留史。"),
          item("动态配置逐级准入", "从静态重启、原子 watcher、单机多进程 SQLite/loopback、真 kill switch 到跨实例服务，只有真实需求才升级。"),
          item("不预装配置平台", "不为想象中的未来引入 Nacos、Consul 或 etcd。"),
          item("动态配置必须可恢复", "定义 Owner、Consumer、认证网络、原子应用、last-known-good、离线 bootstrap、备份、审计、回滚和移除路径。"),
          item("项目配置快照不是权威", "先改项目 source 并验证，再用 expected-hash CAS 同步已登记机器键；默认 dry-run，Apply 后回读 hash/generation，receipt 不含值。")
        ]
      },
      {
        title: "四、Reader routing",
        intro: "人类入口、Agent 规则和实现事实各有用途。",
        items: [
          item("README 面向人", "必须人话和最新，但不是执行规则、授权、动态机器事实、Git 事实或 AI 默认上下文。"),
          item("什么时候读取人类指南", "用户明确询问、维护，或它是当前精确消费者的验收证据。"),
          item("项目 AGENTS 面向 Agent", "只在项目确有更具体业务语义时创建，不复制全局规则和动态事实。"),
          item("嵌套 AGENTS 的条件", "只有子树语义真实不同才存在。"),
          item("实现事实来自哪里", "代码、测试和现场 Owner/Provider；过期人类文档只是待修缺陷。"),
          item("简单项目不机械补双文档", "临时、简单或代码自解释时，不为了形式创建 README 与 AGENTS。")
        ]
      },
      {
        title: "五、原生经济路由的 11 条规则",
        intro: "这一节只管理原生子代理的身份、数量、家族、上下文和连续性。",
        items: [
          item("1. 身份先于决策", "宿主从真实 turn context 验证 model、effective effort、root/child role、turn hash、generation 和合同 SHA；旧 root 只能用用户明确绑定恢复。"),
          item("2. 压缩或代际变化要重读", "同一 task 同一 generation/hash 可以复用；压缩、hash 变化或加载不确定时完整重读本节。Child 不借父绑定。"),
          item("3. 七类事件重判", "任务开始、新独立支路、阻塞、重大 steer、压缩、child terminal、槽位释放。普通工具步骤不填表。"),
          item("4. 每个父代理 0 到 10", "0 合法但不能惯性。Luna 适合封闭可验读重任务，Terra 适合强耦合实现和深调试，Sol 适合最高风险、战略和终审。"),
          item("5. 家族和 effort 只能向下", "Luna 只能派 Luna，Terra 可派 Luna/Terra，Sol 可派三家族；child 最强 Sol Max，不得高于父级。"),
          item("6. 本地慢速路线", "local-default 是本地 AICLI alias，只用于封闭、严格可验、允许较慢且总成本更低的非阻塞工作；不是 native child 或 fallback。"),
          item("7. 递归不扩权", "Child 也可派后代，但所有 scope、授权、sandbox、家族和 effort 继续取交集，缺身份只关闭递归。"),
          item("8. Fork 与命名", "跨模型或 effort 用 none 或有限 turns；只有同身份完整继承才用 all。任务名不证明身份。"),
          item("9. Root 不空等", "Root 始终负责目标、优先级、依赖、风险和最终集成；有不冲突工作就继续，只在硬依赖时一轮事件等待。"),
          item("10. 连续性", "Child 中断优先恢复原 session；不能恢复才重跑或升级；partial 不冒充 complete。"),
          item("11. Root 最终负责", "委派后仍由 Root 验收。Benchmark 只是带来源、版本、日期和置信度的参考，规则文字不能制造宿主 grant。"),
          item("宿主 Gate 做什么", "稳定入口只验证身份、策略和参数，不替模型选代理或创建 child；PreToolUse 只做 spawn 前 TOCTOU 复核。"),
          item("回执缺失的边界", "回执用于审计，不能阻塞普通工具和最终答复，也不安装 Stop Hook 作为额外门。")
        ]
      },
      {
        title: "六、按需插件与跨控制面",
        intro: "只有真实能力缺口才让插件进入任务。",
        items: [
          item("五层能力证据分开", "Skill/tool 注入、安装回执、账号连接、fresh task 可用性和 E2E 彼此独立。"),
          item("什么时候读插件 catalog", "实证能力缺口会降低当前结果时才读。已有等价入口不提示。"),
          item("安装连接需要用户同意", "能力发现不等于可以改变账号或安装外部依赖。"),
          item("跨控制面渐进取证", "架构、运行治理或长期演化才进入三控制面 context。"),
          item("Catalog 失败语义", "它只返回 metadata，不运行 Provider；unknown trigger 返回 not found，schema 无效失败关闭。")
        ]
      }
    ]
  }
};
