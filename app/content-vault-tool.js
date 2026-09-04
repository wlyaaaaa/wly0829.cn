import { createProjectSnapshot } from "./project-snapshot.js";

const sourceRoot = "E:\\Projects\\Tools\\vault-tool";
const skillRoot = "E:\\.agents\\skills\\vault-workflow";

const vaultToolSnapshot = createProjectSnapshot({
  observedAt: "2026-09-03T09:42:05Z",
  label: "工具与本地入口修复已发布；来源回归、独立复验与虚构文件实际往返分别通过",
  boundary: "本轮只用虚构文件验证，不读取本人真实保险库；真实密码框、实际私人远端备份与换机恢复不由单元测试代替",
  metrics: [
    { label: "现行容器", value: "VAULT03" },
    { label: "输入范围", value: "文件 · 子目录" },
    { label: "虚构样例", value: "3 个文件" },
    { label: "使用方式", value: "本地查看 · 按需取回" }
  ],
  facts: [
    { label: "本机工具", value: "vault-tool 把本人选定的文件打包成 vault.enc；加密与解密在本机执行，网站不收文件、不接密码、不提供在线加解密。" },
    { label: "人工与 AI 分工", value: "本人只在本地输入密码、选择密钥文件和确认具体操作；AI 可以检查不含原文的状态、准备命令和核对结果，不能把计划建议当作解密或改写授权。" },
    { label: "取回内容", value: "支持内存文本查看、按名称或内容搜索、文本复制和按名称选择性提取；图片、PDF、二进制和较大文本需要对应外部程序，取出后是否落盘必须说清。" },
    { label: "当前来源", value: "公开仓库 wlyaaaaa/vault-tool；维护目录 E:\\Projects\\Tools\\vault-tool；当前 PUBLIC main=8293ea88775c71d2b5ca2363cc1ba9abe89c81e2，本地HEAD与真实远端一致且工作区干净。核心修复提交0b9d4c462d7b640baa42ea0d51df5768ea15b972的已验代码未变，随后只更正README的交互筛选与CLI输出说明。版本声明2.2.0，不是另一个安装包。", hero: false },
    { label: "容器与算法", value: "VAULT03 使用 tar+gzip 整体打包、AES-256-GCM 认证加密、scrypt 或可选 Argon2id 密码派生；可绑定密钥文件。Windows 调用系统 bcrypt.dll，Linux/macOS 依赖 cryptography；Argon2id 还需 argon2-cffi。", hero: false },
    { label: "参数与容量", value: "交互加密的 KDF（密码派生函数）校准目标约 0.6 秒；scrypt N 上限 2^20，Argon2id 校准内存上限 1 GiB；解密参数检查的内存上限为 4 GiB。容器按可见层长度分桶，普通小库至少 65,536 字节。目标耗时不是实测承诺。", hero: false },
    { label: "旧格式", value: "VAULT02 为 scrypt+AES-GCM；VAULT01 为 PBKDF2-SHA256 与 AES-CBC。兼容读取不等于具有相同认证性质；升级会重新打包为 VAULT03，不是仅改文件头。", hero: false },
    { label: "入口实际区别", value: "菜单“加密／添加文件”会先合并旧库；直接 encrypt 与 Start-KeyVaultEncrypt.ps1 处理当前 source/，不会自动把旧库所有内容合并进来。非 JSON 命令启动会初始化日志并清理旧 decrypted/；严格元数据读取须使用 --json。", hero: false },
    { label: "来源回归与运行环境", value: "本轮最终 pytest：106 passed、另有 13 个通过的子用例，0 failed、0 skipped；pytest 21.03 秒、外层 22.151 秒。Python 3.14.7，pytest 9.1.1，argon2-cffi 25.1.0，cryptography 49.0.0；Windows 实际 AES 使用系统 CNG，而非把已安装 cryptography 当本轮后端。", hero: false },
    { label: "首次测试的副作用与修复", value: "起始 96 项基线的旧剪贴板测试曾尝试系统写入并安排清空，是否成功未记录；没有读取剪贴板内容。现已改成平台调用替身与事件观察，最终 106 项回归不触碰系统剪贴板，不把首次基线改写成从未发生该尝试。", hero: false },
    { label: "实际虚构样例", value: "中文说明 61 B、CSV 清单 47 B、二进制附件 2,057 B，合计 2,165 B；实际生成 65,536 B 的 VAULT03。无 KDF/AES 替身的 Windows CNG 验证覆盖正常往返、错误口令与改动密文拒绝、同名新版优先、内存查看、选择性提取、改密、V2 迁移、双密码、图片载体和原 KDF 参数保留，整组内部 23.994 秒、外层 24.374 秒。", hero: false },
    { label: "Skill 修复与独立复验", value: "vault-workflow 来源为 PRIVATE .agents main=e67cca11d9ae8ba1bd70e9be34ea16a95e2505f7，远端回读一致；41/41 隔离回归通过，20.551 秒。独立 Terra 用自行构造的虚构库复验并通过 41 项；独立 Sol 对回退失败连续操作的 8 项复验通过，1.166 秒。它们不是本人真实桌面输入验收。", hero: false },
    { label: "安装与远端证据", value: "本机 canonical junction（唯一源码目录链接）指向 E:\\.agents\\skills\\vault-workflow，来源、安装和供应事务检查通过；从安装入口执行 LocalEdit -WhatIf 实际返回 planned，解密／显示／保存标志均为 false。源发布脚本的九类模拟 GitHub 测试通过；本轮未向私人 Key 上传或读取正文，真实私人备份及恢复未验。", hero: false },
    { label: "样例文件与字节", value: "notes/中文说明.txt：61 B，SHA-256=60df61fa07fab74aa9e53bf851ce32250a435d5b8b21e17d5cb0acbde1cbea88；data/ledger.csv：47 B，SHA-256=5c96114cd7d5d4a5868a3522ab92bdd539ad3693efb582ca15f5767a2f524e3e；attachments/sample.bin：2,057 B，SHA-256=cfed09439eec9c3e3eca6388d4de24d7ffe1c54b22f1da1c349498def0ccd7c3。原始验证JSON为4,231 B，SHA-256=4add06a29a8b12f68a9f41783bb859a4463c546bc014ec3eaf69940800211c36。", hero: false },
    { label: "测试参数与旧格式证据", value: "参数保留回归特意用非默认、很小的虚构测试参数：scrypt=(1,2,1,1)，Argon2id=(2,1,8192,1)，不是给真实资料的配置建议。V2/V3以真实算法往返；V1的新目标选择使用结构有效V1与受控旧明文模拟，不能称本轮完成独立真实V1恢复演练。", hero: false }
  ],
  gaps: [
    "源代码、106 项回归与真实算法虚构样例已通过，但真实密码框、本人私人库、实际私人远端上传、强杀／断电、Linux/macOS 与干净新机恢复没有在本轮验收。",
    "LocalEdit（本地编辑）只支持可保真的 VAULT03 gzip tar 文本，压缩后内容必须放进原槽位；不能因为只打开主层就猜另一层不存在。超容量或不支持的属性会拒绝，而不是丢弃未编辑内容。",
    "原子替换后若最终自检失败，会尝试恢复原密文；若回退本身也失败，目标可能已经改变。界面保持失败并禁止继续保存，返回实际保留的加密恢复副本，不能宣称原路径已经恢复。",
    "内存锁页和清零只能覆盖可控制的缓冲区；Python 解释器可能产生副本。SSD 覆写删除、进程提前退出后的剪贴板清除和现实胁迫场景都不存在绝对保证。",
    "图片载体依赖完整保留追加字节；图片软件兼容、平台重编码和传输压缩可能改变它，不能用“看起来还是图片”证明密文还在。"
  ]
});

export const vaultToolProject = {
  order: 13,
  slug: "vault-tool",
  title: "vault-tool",
  kicker: "本地文件加密与恢复 · 本机工具已实现 · 2026-09-03 09:42 UTC 核对",
  route: "/projects/vault-tool",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "文件加密、按需取回与库维护已有实现",
  cardStatusTone: "pass",
  ...vaultToolSnapshot,
  searchAliases: ["vault-tool", "本地文件加密", "加密保险库", "文件加密后怎么取回来", "密文备份", "密码保护文件夹", "第13项目"],
  repositoryNote: "vault-tool 是本机文件加密工具，源码公开；Key 是另一个只存密文的私人备份目标，不能把二者混成一个项目。当前网页解释产品、普通操作和最后一次核对的证据，不接收访客文件、密码、密钥文件或解密请求。",
  summary: "vault-tool 把我明确选中的文件和文件夹打包、加密成一个保险库文件，需要时由我在本机输入密码；若建库时选择绑定密钥文件，也需要原文件。我可以只看一段文字、按名称或内容找文件，也可以只取出要用的附件，不必为查一句话解压整库。它还处理继续添加、改密码、旧库升级、双密码容器和密文备份。AI 帮忙检查入口与结果，不代管密码，也不能找回遗失的解锁条件。本轮用虚构文件核对主要流程，未用本人真实库做恢复演练。",
  why: "普通文件夹适合直接工作，却不适合作为随手复制到备份盘或远端的私密内容包。这个工具把可携带的密文、本人控制的解锁方式和按需取回放在一起；同时把合并还是替换、是否留下明文、旧库能否恢复讲清，避免“加了一个文件却丢了旧内容”或“上传成功就以为已经能恢复”。",
  plainExample: "我可以向 AI 说：“把这三个文件加进原来的加密库，库里其他内容不要丢；密码我在本机输入。”AI 会先确认这是追加而不是整库替换，再打开本地入口。完成后我会得到经过自检的新密文和旧库保留情况；网页不会接收文件或密码。",
  result: "日常保存得到一个 vault.enc 密文文件；日常使用得到在本机显示的选定文本，或明确取出到 decrypted/ 的文件。维护操作还会给出格式、处理状态和对应的旧库备份边界；选择私人远端备份时必须另外核对远端字节。文件哈希相同只证明字节一致，真正恢复仍需要正确密码、建库时绑定的密钥文件（若有）和兼容环境。",
  readerStates: {
    pass: "选中的内容被完整打包并通过对应自检；查看只显示实际读到的文本，提取只返回本次选中的文件。远端发布只有在实际调用和回读都通过后才称成功。",
    problem: "发现同名内容、损坏结构、依赖不符、文本不能编辑或容器容量不足时，说明冲突与仍保留的原件；不会把建议、部分处理或取消当成已完成。",
    unavailable: "库文件不存在、密码错误、所需密钥文件缺失或恢复环境没有对应依赖时停止相关动作。密码无法找回，不改用另一套凭据，不自动扫描电脑寻找可能的秘密。"
  },
  dataSources: {
    title: "它接收什么，内容会去哪里",
    intro: "输入来自本人明确选中的文件及本次本地操作。普通原件、暂存目录、密文、密钥材料和远端副本分别处理，不把整个电脑变成保险库。",
    rows: [
      { source: "电脑上选定的文件和子目录", data: "文本文档、清单、图片、PDF 或任意二进制文件。引导式入口把指定路径复制到 source/，打包保留相对目录；原路径副本与 source/ 暂存不是同一件事。", result: "一个整体加密的 vault.enc；加密成功后清理的是本工具暂存原文，原路径复制进来的文件仍需按本人的保存意图处理。" },
      { source: "已有的 vault.enc", data: "先读格式和参数；只有在本人本地提供相应凭据后才解出内容。追加需要打开旧库，纯结构检查不需要密码。", result: "可查看的选定文本、明确提取的附件，或经确认维护后的新库；不能从“格式有效”推断内容一定能解开。" },
      { source: "本人在本地输入的密码和选定密钥文件", data: "密码与密钥文件字节共同参与密钥派生；密钥文件不是指向原文件的快捷方式，换一个内容相近的文件也不等价。", result: "本机内完成解锁或加密，AI 只得到不含秘密的状态。密码或所需文件丢失就无法恢复，不存在云端找回按钮。" },
      { source: "明确提供的诱饵材料或封面图片", data: "诱饵材料用于另一个密码对应的内容层；图片载体把已有密文追加在封面字节后，不修改像素来藏字。", result: "双密码容器或可重新提取密文的图片文件；二者都不能代替密文备份和真实恢复检查。" },
      { source: "明确指定、现场确认私有的 GitHub 目标", data: "普通备份上传选定密文。另有独立的远端 README 保护动作，只在本地辅助进程内读取选定版本并加密；不是日常状态读取。", result: "密文提交与读回结论；README 保护会同时更新当前说明，但不改写旧历史，也不代表已合并原有保险库。" }
    ],
    note: "网站公开展示的是工具、配置类别、虚构样例与验证结论；本轮没有读取或展示本人真实库里的文件名、正文、密码、密钥文件或个人恢复材料。"
  },
  productPrinciples: [
    { title: "密码留在本人手里，AI 只拿到处理状态", detail: "AI 可以帮我选对入口、检查结构和解释结果；输入密码、选择密钥文件、查看或改写原文都发生在明确的本地操作里。独立保险库不借用密码中心的会话或密钥，也不把管理员权限当成解锁。" },
    { title: "追加与替换必须是两种清楚的动作", detail: "把新文件加进已有库，与用 source/ 重新建立一份库，不是同一个结果。入口要说明旧内容、同名文件和另一密码对应层会怎样；不知道的部分不能靠一句“自动合并”带过。" },
    { title: "只取本次要用的内容，同时说清是否落盘", detail: "查一句文字时先用内存查看与搜索；要用外部软件打开图片或 PDF 时才明确提取。内存查看、系统剪贴板与磁盘文件的生命周期不同，不能统称“完全不留痕”。" },
    { title: "改不完整就停，不用看似成功的文件覆盖原库", detail: "新密文必须与预期内容相符，不能悄悄丢掉没编辑的成员、另一层或原来的密码派生方式。现有格式无法保留的编辑应明确拒绝并保留原密文，而不是临时拼一个新格式。" },
    { title: "把能检查结构、能打开与能恢复分开", detail: "不带密码的检查只能看容器结构和环境；实际密码打开才能验证内容，远端读回只能验证保存字节。一次测试或一个绿色状态不能代替这三个不同问题。" },
    { title: "备份的是密文，恢复条件也必须保全", detail: "保有一个加密文件还不够：对应密码、密钥文件和所需依赖缺一不可。工具不自动把这些解锁材料和库放到一起，也不把上传脚本当作无人值守备份服务。" },
    { title: "进阶功能讲实际能力，不卖绝对保证", detail: "双密码容器能按不同密码打开不同内容，图片载体能原样带回密文；这不是面对现实胁迫或任意平台压缩的保证。旧备份、内存副本、SSD 和进程中断边界都要保留。" }
  ],
  responsibilities: [
    "把明确文件范围打包为本地加密容器，区分新建、追加与整库替换。",
    "提供内存文本查看、名称／内容搜索、文本复制及明确范围的文件提取。",
    "维护密码、密钥文件、密码派生参数、容器版本与跨平台恢复条件。",
    "处理旧库升级、改密、备份管理、暂存原文和中断后的已知恢复边界。",
    "提供可选的双密码层和图片载体，并对容量和无法保留的状态明确停止。",
    "给 AI 暴露不含原文的检查与建议，让本地图形操作返回与实际效果一致的状态。",
    "在明确请求下保存私人远端密文并核对结果；把普通上传与远端 README 保护分开。"
  ],
  exclusions: [
    "不替代 Password Center（密码中心）的账号凭据管理、盲填或最高权限文件授权；三条路径不共享密码、会话或恢复根。",
    "不负责全盘找文件、材料分类、照片整理、自动上传或长期同步；原件查找与媒体管理仍由各自项目承担。",
    "不提供忘记密码找回、密钥文件重造、网站解密、公开分享或任何已验证的绝对保密承诺。",
    "不把图片外观、文件扩展名、格式检查、测试通过或上传完成当成原文真实性或恢复成功的证明。"
  ],
  glossary: [
    { term: "vault（加密保险库）", meaning: "这里是一份存放打包内容的密文文件，不是密码中心的数据库会话，也不是网页在线存储空间。" },
    { term: "KDF（密码派生函数）", meaning: "把密码与随机盐、可选密钥文件转换为加密密钥；所用算法和参数必须随容器保存，恢复环境也必须支持。" },
    { term: "keyfile（密钥文件）", meaning: "参与解锁的一个精确文件，依赖的是其字节而非文件名。缺失或内容变化，正确密码也可能打不开原库。" },
    { term: "AES-GCM（带认证的加密方式）", meaning: "除加密内容外，还核对被认证的数据是否匹配。认证失败不能推出是密码错、文件损坏还是其他原因中的哪一种。" },
    { term: "slot（内容槽位）", meaning: "VAULT03 中的可见层与尾部区域。尾部可能是填充或另一层，不应在没有证据时猜测不存在另一层。" },
    { term: "ciphertext（密文）", meaning: "加密后保存或传输的字节。哈希可确认两份字节是否一样，但不替人证明密码、密钥文件或内容正确。" },
    { term: "metadata-only（仅元数据）", meaning: "只读格式、尺寸、参数与路径状态，不解密、不显示原文、不执行建议。当前命令行必须带 --json 才属于这条严格路径。" }
  ],
  operatingFlow: [
    { title: "先明确哪些文件，以及追加还是替换", detail: "指定原件范围，确认原库是否需要保留其他成员与另一层；不要把复制进 source/ 自动理解为合并完成。" },
    { title: "在本机提供解锁条件并执行", detail: "本人输入密码、选择需要的密钥文件；工具按相应格式处理并做自检。AI 不接触密码，也不把计划结果自动转成实际加密。" },
    { title: "保存密文，按需查看或取回", detail: "日常先查文本，需要外部程序才提取明确文件；检查实际输出、原文残留与恢复条件，必要备份另行核对远端字节。" }
  ],
  components: [
    { name: "文件范围与 tar 打包", responsibility: "管理明确原件、相对路径、压缩、追加和选择性提取。", implementation: "vault_tool.py 的 add_files_mode、_collect_source_files、_make_tar、_safe_extractall；source/、decoy_source/ 与 decrypted/ 各有不同生命周期。" },
    { name: "容器、密码与平台加密", responsibility: "解析版本、派生密钥、认证加解密、密码文件和双层容量。", implementation: "vault_tool.py 的 _derive_key、_pack_vault_v3、_unpack_vault_v3、_bucket_size；Windows bcrypt.dll，非 Windows cryptography，可选 argon2-cffi。" },
    { name: "本机交互与维护", responsibility: "让查看、复制、提取、改密、迁移和清理具有可解释的结果与取消路径。", implementation: "_menu_loop、decrypt_mode、_view_in_memory、_extract_to_folder、migrate_mode、change_password_mode、clean_backups_mode。" },
    { name: "只读元数据接口", responsibility: "不解密地检查结构和环境，并返回建议及未确认项。", implementation: "_inspect_vault_structure、collect_vault_info、collect_doctor_info、collect_vault_assessment、collect_vault_plan；info/doctor/assess/plan --json。" },
    { name: "本地密码与文本界面", responsibility: "将人输入、解锁、查看、编辑和结果状态留在明确本地流程中。", implementation: "现行 vault-workflow/scripts/vault_auth_helper.py 与 Invoke-VaultWorkflow.ps1；由 .agents 的 Skill 来源维护，不是 vault-tool 的网络服务。" },
    { name: "密文发布和远端材料保护", responsibility: "向现场确认的私人目标写入密文、核对字节，并独立处理明确请求的远端 README 保护。", implementation: "Publish-KeyVaultToGitHub.ps1；vault-workflow 的 VerifyRemote、PublishVault 和 protect_remote_readme.py，不克隆整个 Key 作为执行前提。" }
  ],
  usageExamples: [
    { moduleSlug: "files-encryption", ask: "把这三份文件加进原来的库，其他文件不要丢。", effect: "先走明确合并入口并说明同名处理；直接 encrypt 不会自动合并旧库，也不自动保留另一密码对应的层。" },
    { moduleSlug: "view-extract", ask: "我只想看清单里的一段文字，不要把全部附件解压出来。", effect: "先用内存查看和内容搜索；必须用外部程序的文件才按明确名称提取，并说明磁盘残留和清理条件。" },
    { moduleSlug: "passwords-formats", ask: "我记得密码，为什么换电脑还是打不开？", effect: "核对容器格式、密钥文件是否同一份以及对应依赖；不能把知道密码等同于恢复条件齐全，也不能擅自换派生算法。" },
    { moduleSlug: "maintenance-recovery", ask: "换一个密码，失败时原来的库还能用。", effect: "先验证原凭据，再说明重建范围、备份与另一层边界；新库自检失败必须保留或恢复原件，而不是只有成功提示。" },
    { moduleSlug: "dual-password", ask: "我明确需要两个密码分别打开两套不同的内容。", effect: "准备真实与诱饵材料，分别验证两个密码，容量不足时拒绝；不把双层实现说成现实环境下必然无法识别。" },
    { moduleSlug: "image-carrier", ask: "把这份密文放进图片文件，之后还能原样取出来吗？", effect: "追加密文而非改像素；提取后比较密文字节，提醒图片重编码可能移除尾部，不能只验证封面还能打开。" },
    { moduleSlug: "ai-local-interface", ask: "只检查这份加密库的结构和环境，别打开内容。", effect: "使用严格 --json 元数据入口，不弹密码框、不执行建议；结构通过也不能替代正确密码下的内容验证。" },
    { moduleSlug: "private-backup", ask: "备份到我指定的私人仓库，并确认远端保存的是同一份密文。", effect: "先确认目标私有、文件与路径，再写入并从默认分支读取对应密文字节；没有实际远端回读就不能称备份已闭合。" }
  ],
  evidenceLayers: [
    { layer: "源码与入口", proves: "代码中真实存在的格式、操作、参数、交互与副作用路径。", doesNotProve: "当前私人库可打开、任意设备可恢复，或网页已经发布。" },
    { layer: "隔离回归", proves: "虚构输入和指定替身下的分支、错误处理与结果合同。", doesNotProve: "真实桌面密码输入、系统剪贴板、强杀／断电清理和实际私人远端可用。" },
    { layer: "实际加密往返", proves: "特定虚构文件经过真实算法后可以取回同样的内容，错误输入按本次测试拒绝。", doesNotProve: "所有私人库、所有平台、任意大文件，或密码学绝对安全。" },
    { layer: "本地界面", proves: "只有实际操作证据才能证明本次人输入、查看、修改及状态返回可用。", doesNotProve: "仅代码检查或 GUI 替身不能证明真实桌面输入已经通过。" },
    { layer: "远端回读与恢复", proves: "远端回读确认保存字节；实际用正确凭据恢复确认那一份内容可取回。", doesNotProve: "回读密文不是验证密码；固定提交存在也不等于当前默认分支仍保存它。" }
  ],
  operationalEntrypoints: [
    { name: "普通本地菜单", command: "python E:\\Projects\\Tools\\vault-tool\\vault_tool.py", purpose: "由本人在本地可见终端使用；按菜单区分加密／添加、查看、改密、升级和进阶功能，不由 AI 在命令行中传密码。" },
    { name: "严格只看元数据", command: "python E:\\Projects\\Tools\\vault-tool\\vault_tool.py info --json", purpose: "只读指定维护位置的容器结构与参数；doctor、assess、plan 同样必须带 --json。对另一份库不要擅自把它覆盖到维护位置。" },
    { name: "环境与建议", command: "Invoke-VaultWorkflow.ps1 -Mode AssessVault -Profile Generic -VaultRoot <明确工具目录> -Json", purpose: "调用既有本地脚本，读取结构、环境和建议；适配命令即使退出 0 也要检查 ok/self_check，建议不自动执行。" },
    { name: "明确整库加密", command: "python vault_tool.py encrypt --kdf scrypt", purpose: "在工具目录处理当前 source/，已有库须确认覆盖；它不是自动追加入口。可明确选 argon2，但必须具备对应依赖。" },
    { name: "本人终端内存查看", command: "python vault_tool.py decrypt --no-disk", purpose: "明文会打印到stdout（标准输出），只能由本人在不被模型捕获的本地终端阅读；不落盘并不意味着AI捕获输出也看不到原文。" },
    { name: "筛选提取（交互）", command: "python vault_tool.py decrypt", purpose: "不带强制标志，交互选择[2]后输入名称关键词，才只提取匹配成员到decrypted/；强杀可能留下原文。" },
    { name: "明确全量提取", command: "python vault_tool.py decrypt --extract", purpose: "跳过名称筛选提示，直接提取本次密码打开层的全部成员；不要用它完成只取一个附件的请求。" },
    { name: "更换密码", command: "python vault_tool.py passwd", purpose: "由本人提供原凭据并明确新凭据；保持原KDF，但单层重建不能自动保证另一密码层保全，临时pwbak成功后删除。" },
    { name: "升级旧库", command: "python vault_tool.py migrate", purpose: "独立的旧格式升级命令；V2保留scrypt参数，V1明确转换，原库bak与实际新结果分开核对。" },
    { name: "明确本地查看", command: "E:\\.agents\\skills\\vault-workflow\\scripts\\Invoke-VaultWorkflow.ps1 -Mode LocalView -VaultFile '<明确密文路径>' -Json", purpose: "不自动寻找其他库；由本人输入密码和必要密钥文件，原文只在本地窗口显示，查看不保存。" },
    { name: "本地编辑预演", command: "E:\\.agents\\skills\\vault-workflow\\scripts\\Invoke-VaultWorkflow.ps1 -Mode LocalEdit -VaultFile '<明确密文路径>' -Json -WhatIf", purpose: "预演不弹界面、不解密也不保存；真正编辑需明确去掉WhatIf并由本人本地操作，只支持原槽容量内的可保真文本。" },
    { name: "图片载体", command: "python vault_tool.py hide --cover <明确图片> --out <载体路径>", purpose: "使用已有 vault.enc 作为载荷；再用 unhide --in <载体路径> --out <密文路径> 取回，验的是密文而不只是图片外观。" },
    { name: "私人密文备份预演", command: "Invoke-VaultWorkflow.ps1 -Mode PublishVault -Profile Key -Repo wlyaaaaa/Key -VaultFile <明确密文> -Json -WhatIf", purpose: "先做已有目标和制品检查，不上传；真实发布仍需精确请求并检查回读，不能把预演当作已有备份。" }
  ],
  evolution: [
    { date: "2026-08-30", commit: "c117bd2", result: "把截断容器的识别补成有界结构检查，使元数据入口不会仅凭七字节格式标记就认定库结构有效；结构检查仍不能替代内容解密。" },
    { date: "2026-09-03", commit: "0b9d4c4 / e67cca1", result: "把维护从笼统完成推进到内容与结果可核对：追加保留同名新版、维护保留原KDF、损坏库不误推荐；本地查看与编辑明确分离并保留成员及未解锁槽，失败状态不会被后续操作洗掉；私人密文发布核对真实远端字节。" }
  ]
};

export const vaultToolModules = [
  {
    slug: "files-encryption", shortTitle: "文件入库", title: "把明确文件装进库，先分清追加与替换",
    searchAliases: ["文件怎么加密", "文件夹加密", "加密库添加文件", "新文件覆盖旧内容", "加一个文件别丢原来的", "source暂存目录"],
    searchProjection: { intents: ["加密选定文件", "向旧库添加文件", "区分追加与替换"], entities: ["source", "vault.enc", "add_files_mode", "encrypt", "Start-KeyVaultEncrypt.ps1"], relations: ["菜单先合并旧库", "直接加密只处理source", "原路径与暂存副本不同"], failureRecovery: ["同名冲突明确处理", "取消不当成功", "自检失败保原文", "另一层不能假装保留"] },
    teaser: "保存哪几个文件、旧库是否合并、同名以谁为准，都在加密前说明。",
    status: "打包、合并与同名新版优先已验证", statusTone: "pass",
    value: "我把一组明确文件交给工具，它把相对目录与内容放进同一个加密库。已有库时可以继续添加，但必须走清楚的合并流程；我能知道是补进新文件，还是用这一批内容替换整库。",
    why: "“把文件放进去”不等于“原来的都还在”。直接重建 source/ 可能遗漏旧文件，错误的同名合并次序又会把刚准备的新版本换回旧版。产品需要先说明这两个不同问题，再执行加密。",
    example: "“给原来的库加一份新清单，保留里面的附件；若暂存区已有新版同名清单，不要用旧库的版本把它盖回去。”入口先解开本次有权打开的旧内容，再按明确规则合并。",
    result: "得到一个 vault.enc 与实际处理结果；来源副本、source/ 暂存、合并后的内容和本次能保留的层次分别说明。不能仅凭新库存在就声称整份旧库都保留了。",
    readerStates: { pass: "范围明确、合并次序正确、打包内容经自检后写入密文；说明原文暂存清理结果。", problem: "同名、新旧版本、另一层或写入结果无法保持时先说明，不悄悄丢文件。", unavailable: "没有文件、路径不可读或本人取消密码输入时停止本次操作，不把空库或取消当成完成。" },
    decisionImpact: ["已有库要追加时用菜单添加；encrypt 和启动脚本不会自动合并。", "复制进 source/ 与直接把唯一原件放进 source/ 的后果不同，成功后的清理对象必须明确。", "一个密码只证明能打开相应内容，不能保证另一密码对应的层被保留。"],
    problem: "防止新建、追加、整库替换和同名更新混为一谈，导致内容静默遗漏或回退。",
    implementation: [
      "BASE 取 vault_tool.py 所在目录；普通入口使用其 source/、vault.enc 与日志路径，不是随当前终端工作目录任意变化。",
      "_collect_source_files 枚举 source/ 中的文件；_make_tar 用相对路径打 tar，经 gzip 压缩。gzip 头部时间固定为 0，但 tar 中原文件时间仍属于成员元数据。",
      "add_files_mode 是引导式入口：已有库时询问合并，解开本次密码对应的内容后与 source/ 合并，再接受明确的新路径并调用 encrypt_mode。",
      "encrypt_mode 直接处理当前 source/，已有库先询问覆盖。Start-KeyVaultEncrypt.ps1 先复制 AddPath，再调用 encrypt；不调用菜单的旧库合并步骤。",
      "加密先在内存中打包、派生密钥、产生 VAULT03，再用同一凭据解开并比较预期字节。内存自检、磁盘提交、原文清理必须分别解释。",
      "引导式复制保留原路径文件；成功清理的是 source/ 暂存。若本人把唯一原件直接放进 source/，它也属于该明确清理范围，不应误称工具永远保留一份明文。"
    ],
    flow: ["固定文件与目录范围，区分保留原库、追加与整库替换。", "已有库追加时先由本人提供对应凭据，并说明只能打开相应层。", "处理旧库与暂存区的同名关系，再复制本次明确新路径。", "打包、压缩、加密并核对新容器可解回预期内容。", "确认实际写入和暂存清理状态，返回密文及仍需保留的恢复条件。"],
    concepts: [{ term: "source（明文暂存目录）", explanation: "入库前打包的工作目录，不能因为名字像来源就默认它是永不删除的原件库。" }, { term: "merge（合并）", explanation: "把旧库本次打开的成员与新文件放在一起；不是恢复另一未打开层，也不是自动版本管理。" }, { term: "round trip（加密再解密往返）", explanation: "对同一份明确输入比较取回内容，用于证明这一次容器处理与预期一致。" }],
    boundaries: ["任意文件类型可以作为字节入库，不代表任意文件都能在内存文本界面直接阅读。", "没有后台目录监听、全盘扫描或自动上传。", "合并会产生 source/ 暂存原文；它与默认不落盘查看的承诺不能互相替代。"],
    failures: [{ condition: "准备区已有同名新版", response: "按明确的新旧优先顺序保留预期版本，并用实际内容回归；不能只验证成员数量。" }, { condition: "取消、没有输入或新库自检失败", response: "返回未完成或失败，保留尚未成功提交时需要的原文与原库，不输出完成证据。" }, { condition: "旧库可能含另一密码对应的层", response: "明确本次重建的层次范围；不能在只掌握一个密码时声称无条件保留另一层。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "文件枚举、相对路径打包、加密与引导式添加" }, { path: `${sourceRoot}\\scripts\\Start-KeyVaultEncrypt.ps1`, role: "本地终端与 AddPath 到直接 encrypt 的真实路线" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "虚构文件往返、追加与同名内容回归" } , { path: "synthetic-roundtrip.json", href: "/media/vault-tool/synthetic-roundtrip.json", role: "本轮虚构文件实际算法验证原始JSON；含很小的测试参数，不能作为真实资料配置建议", download: "synthetic-roundtrip.json" }],
    verification: ["来源独立审查分别读取了加密、合并和启动脚本，没有把三个入口混成一条。", "本轮虚构三文件已经实际加密并取回；同名内容曾复现旧版覆盖新版，修复和后续回归结果见当前快照。", "没有对本人真实 source/、vault.enc 或私人文件执行这些操作。"],
    relation: "这里决定什么进入库；密码与格式模块解释怎样打开，查看与提取模块解释怎样使用，库维护模块解释后续重建及旧库。"
  },
  {
    slug: "view-extract", shortTitle: "查看与提取", title: "只看要用的文字，必须取文件时再明确落盘",
    searchAliases: ["加密文件怎么打开", "加密后怎么取回来", "不解压看文字", "保险库搜索", "只提取一个文件", "明文残留", "剪贴板清除"],
    searchProjection: { intents: ["查看库内文本", "搜索一个成员", "只提取需要的附件", "处理提取残留"], entities: ["decrypt", "--no-disk", "--extract", "decrypted", ":copy", "Ctrl+X"], relations: ["内存查看不同于磁盘提取", "名称搜索不同于内容搜索", "剪贴板独立于正文缓冲区"], failureRecovery: ["错误凭据停止", "强杀可能残留", "非JSON启动清理旧目录", "重解析点拒绝清理"] },
    teaser: "文字先在本地内存里查看；图片、PDF 和附件按需取出，并说明清理条件。",
    status: "查看、搜索与选择性提取已实现", statusTone: "pass",
    value: "我不需要为了找一句话先解压整库。工具能显示支持的文本，按名称或内容筛选，并只把明确选中的文件交给外部程序；每一步都说明原文是在内存、剪贴板还是磁盘。",
    why: "“解密了”没有说明内容去了哪里。临时提取文件可能在强杀后留下，复制到剪贴板的内容也不是原文缓冲区的一部分。把这些位置分清，才能决定本次查看需要哪条路线、结束后还剩什么。",
    example: "“找出清单里写到打印机的那一段；然后只取出对应 PDF 给我打开。”先做文本内容搜索，PDF 则通过明确提取交给阅读器，而不是把 PDF 二进制硬显示成乱码。",
    result: "在本机看到真实文本或明确的文件列表；选择提取后得到 decrypted/ 内本次文件及清理说明。无法作为文本读取的成员会保留类型边界，不用替换字符假装读懂。",
    readerStates: { pass: "支持的文本可显示和搜索，筛选提取只交付匹配文件；结束时说明相应缓冲区和目录处理结果。", problem: "文件不是支持文本、过大、清理失败或进程被强杀时说明限制与可能残留的位置。", unavailable: "密码或密钥文件不匹配时不显示内容；来源不存在或格式损坏时不生成空白成功页。" },
    decisionImpact: ["内存查看不等于所有系统副本都无法恢复。", "CLI 文本显示受类型与 64 KiB 限制；外部附件应明确提取。", "复制后的 20 秒清理需要当前进程存活；本地 GUI 的 15 秒规则是另一条实现。"],
    problem: "防止为了有限阅读解压无关文件，以及把内存、剪贴板和磁盘清理混为一个绝对保证。",
    implementation: [
      "decrypt_mode 的普通交互可选内存查看或磁盘提取；选择[2]后才有名称筛选。--no-disk 强制内存查看，--extract 则跳过筛选并全部提取本次打开层。_view_in_memory 按支持的文本扩展名和64 KiB限制显示。CLI把明文打印到stdout，只供本人不被模型捕获的本地终端阅读。",
      "普通关键字筛文件名，/前缀进入文本内容搜索；:copy 使用首个名称匹配的可读文本，复制对象与多个匹配的边界要明确。",
      "CLI 剪贴板清除由进程内守护线程等待 CLIPBOARD_CLEAR_SECONDS=20 后执行，进程提前退出就不能保证该安排完成。",
      "_extract_to_folder 支持名称筛选。声明总解压量超过 MAX_EXTRACT_SIZE=4 GiB 时询问是否继续，这不是所有文件处理的统一硬上限。",
      "主明文缓冲区尽力 VirtualLock/mlock，结束时清零可变缓冲区并清屏；Python、tar 和界面仍可能产生其他副本。Ctrl+X 只在指定等待界面起作用。",
      "磁盘提取用 finally、退出回调和部分信号做清理；强杀或断电可能留下 decrypted/。下次非 JSON 启动会检查并清理旧目录。",
      "清理前检查精确目标树，硬链接、符号链接、重解析点等不按普通自有暂存文件递归删除；遇到不适合清理的对象应报告，不扩大到其他目录。"
    ],
    flow: ["本人在本地提供所需凭据，实际打开相应内容。", "先用名称或内容搜索缩小要看的文本。", "只阅读、明确复制，或按名称提取需要外部软件的文件。", "按内存、剪贴板和磁盘三种位置分别处理结束。", "意外中断时确认具体残留，不把下次清理能力冒充这次已经清理。"],
    concepts: [{ term: "no-disk（不主动落盘查看）", explanation: "程序不主动把内容提取成原文文件；不保证解释器、系统或其他进程绝无副本。" }, { term: "selective extraction（选择性提取）", explanation: "只把名称筛选命中的成员写到明确的提取目录，随后由外部程序使用。" }, { term: "best effort（尽力处理）", explanation: "锁页、清零和某些退出清理只能在程序仍能执行相应步骤时完成，不是断电保证。" }],
    boundaries: ["CLI查看会输出明文，不应由AI捕获；LocalView/LocalEdit的本地GUI才只给AI返回状态。不落盘与不进入模型是两条不同边界。", "SSD 的覆写删除不保证物理介质上每个旧副本都被抹除。", "没有实测强杀、断电或全部桌面程序的清理效果，就不能写成已经通过。"],
    failures: [{ condition: "图片、PDF、二进制或超出显示限制的文本", response: "说明不能在该文本入口完整显示，改由本人明确选择是否提取，不把部分文本当完整附件。" }, { condition: "进程提前结束或断电", response: "剪贴板计时和退出回调可能来不及执行；磁盘残留在下次非 JSON 启动处理，不能声称当场全部清除。" }, { condition: "暂存清理发现链接或删除失败", response: "停止不适合的删除并报告具体范围，不顺着链接清别处文件。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "_view_in_memory、_extract_to_folder、锁页、剪贴板与清理" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "选择性提取、大小提示、清理与隔离剪贴板验证" }, { path: `${skillRoot}\\references\\local-ui-security.md`, role: "与CLI区分的本地GUI剪贴板和内存说明" }],
    verification: ["虚构样例已验证内存查看不创建 decrypted/，只筛选 ledger 时只提取对应 CSV，随后清理。", "测试替身只证明调用合同，不证明真实系统剪贴板计时已经完成。", "本轮不对用户真实原文、系统剪贴板内容、断电或强杀做验收。"],
    relation: "日常内容使用由本模块负责；GUI 文本编辑和它的结果状态在 AI 与本地入口模块，密码与依赖问题在密码与格式模块。"
  },
  {
    slug: "passwords-formats", shortTitle: "密码与格式", title: "密码、密钥文件和环境齐全，才谈得上恢复",
    searchAliases: ["密码正确还是打不开", "密钥文件丢了", "换电脑解密", "VAULT03格式", "scrypt", "Argon2id", "保险库依赖"],
    searchProjection: { intents: ["核对解锁条件", "选择加密方式", "换机恢复环境", "识别旧库格式"], entities: ["VAULT01", "VAULT02", "VAULT03", "scrypt", "Argon2id", "AES-256-GCM", "keyfile", "bcrypt.dll"], relations: ["密码加精确密钥文件", "参数随容器保存", "平台依赖不同"], failureRecovery: ["缺keyfile不能找回", "缺Argon2不能换算法冒充", "损坏结构不当新库", "认证失败不猜原因"] },
    teaser: "解锁条件不只有密码；精确密钥文件、原格式参数和恢复依赖同样重要。",
    status: "三代读取与当前格式加密已实现", statusTone: "pass",
    value: "我能知道一份库需要哪些条件才能打开，也能在加密前选择是否绑定密钥文件。换电脑时照着原格式和依赖恢复，而不是临时试一堆密码或把算法换成另一个。",
    why: "密钥文件丢失、内容被改过，或者新机器缺少对应依赖，都可能表现为打不开。只有把格式、参数、凭据和环境分开检查，才能知道当前缺的究竟是哪一类条件；没有恢复服务能替代遗失的密码。",
    example: "“我知道密码，新电脑却打不开这份库。”先看元数据里的版本和密钥文件要求，再确认原密钥文件字节以及是否安装 Argon2id 所需依赖；不要求把密码或文件发到聊天。",
    result: "得到明确的格式、所需凭据与环境说明。真正提供正确凭据后，得到相应层的内容或明确失败；一次结构检查不会被标成已经验证密码和原文。",
    readerStates: { pass: "格式、参数、凭据和运行依赖匹配，真实认证解密得到相应内容。", problem: "参数异常、结构损坏、凭据不匹配或明确选择的算法不可用时说明原因范围，不静默改选。", unavailable: "必要密码、精确密钥文件或运行依赖缺失时停止；没有找回、猜测或另一套账号代开。" },
    decisionImpact: ["密钥文件依赖的是内容，重命名通常不改变它，重新保存或压缩可能改变。", "Windows 标准库加系统加密接口，不等于所有平台都零依赖。", "KDF 校准是速度与资源的取舍，不是密码强度或破解时间的证明。"],
    problem: "防止密码、密钥文件、格式兼容与算法依赖混淆，使本可解释的恢复条件变成盲试。",
    implementation: [
      "VAULT03：tar+gzip 明文包经 AES-256-GCM 加密；公共头包括 7 字节魔数、标志位与 KDF id/参数，作为 AAD（附加认证数据）的一部分。每层使用随机盐、随机 nonce（一次性随机值）和认证标签。",
      "scrypt 将密码与可选密钥文件 SHA-256 混合后派生 32 字节密钥；SHA-256 在这里是本地派生步骤，密钥文件内容及其摘要不成为公开样例证据。",
      "默认直接封装参数为 N=2^17、r=8、p=1；交互加密可以校准到约 0.6 秒，N 上限 2^20。Argon2id 可选，校准内存上限 1 GiB；选择和实际执行必须一致。",
      "Windows 使用系统 CNG（Windows 加密接口）bcrypt.dll；非 Windows 使用 cryptography。Argon2id 需要 argon2-cffi；缺依赖与密码错误不是同一种结果。",
      "结构检查核对已声明长度、格式、KDF 参数和分桶尺寸，不执行 KDF、也不读取原文。解密参数检查拒绝超过 4 GiB 的派生内存要求，但这不是整次任务的进程总内存限制。",
      "VAULT02 使用 scrypt+AES-GCM；VAULT01 使用 600,000 次 PBKDF2-SHA256 与 AES-CBC/PKCS#7。旧格式可读不表示它们的认证特性与 VAULT03 相同。",
      "整体打包会同时持有若干内容与容器副本；支持任意类型不等于已经验证任意体积或流式处理，超大文件需要按实际资源判断。"
    ],
    flow: ["先只读识别格式、结构、参数与密钥文件要求。", "确认当前平台和所需依赖，不先让本人重复试密码。", "由本人在本机提供相应密码及精确密钥文件。", "执行当前格式真实解密与认证。", "交回相应内容或失败边界，不把结构检查或参数存在当成原文通过。"],
    concepts: [{ term: "scrypt / Argon2id（两种密码派生方式）", explanation: "决定如何从密码产生密钥及消耗多少资源；恢复使用容器记下的方式，不是随便互换的插件。" }, { term: "AAD（附加认证数据）", explanation: "没有被加密但被认证的格式头信息；改头也可能使认证失败。" }, { term: "nonce（一次性随机值）", explanation: "每次加密使用的随机参数，不是另一个由本人记忆的密码。" }],
    boundaries: ["密码和密钥文件丢失没有重置途径；网页或 AI 不能恢复这些条件。", "不得把 AES 算法名称、内存参数或密码强度条换算成已验证的绝对破解保证。", "本轮 Windows 实际样例不证明 Linux/macOS 与干净新机已验收。"],
    failures: [{ condition: "知道密码但缺少原密钥文件", response: "说明需要精确字节，停止解锁；不能拿同名文件或另一张相似图片代替。" }, { condition: "明确算法缺少依赖", response: "报告所需依赖并保持选择，不静默降级后说指定算法成功。" }, { condition: "认证失败或容器截断", response: "拒绝读取；结构错误可以明确指出，认证失败不能无证据断言一定是密码错或一定被改动。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "平台接口、KDF、密钥文件、三代容器与结构检查" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "各代往返、错误输入、截断、参数及密钥文件回归" }, { path: `${sourceRoot}\\README.md`, role: "人工选择方式与跨平台恢复要求，须与代码实况共同解释" }],
    verification: ["实际虚构样例使用真实 KDF 与 Windows 加密接口，不以算法替身冒充往返。", "错误口令和改动密文均被本轮对应样例拒绝，结论只限所测试输入。", "本轮没有密码强度、破解成本、真实私人密钥或跨平台恢复证明。"],
    relation: "本模块解释能否打开；库维护模块解释改变凭据与版本后的结果，双密码模块解释一个容器里的不同层。"
  },
  {
    slug: "maintenance-recovery", shortTitle: "库维护", title: "改密、升级和清理都要说清旧库还剩在哪里",
    searchAliases: ["加密库改密码", "VAULT01升级", "旧版保险库恢复", "备份bak", "pwbak", "维护另一层", "清理旧库"],
    searchProjection: { intents: ["更换库密码", "升级旧格式", "核对旧库备份", "处理维护失败"], entities: ["passwd", "migrate", "vault.enc.bak", "vault.enc.pwbak", "clean_backups_mode"], relations: ["改密不同于单改头部", "临时备份不同于长期旧库", "只解开一层不等于整库保留"], failureRecovery: ["自检失败保原件", "未完成不报成功", "清理需明确确认", "遗失凭据无法恢复"] },
    teaser: "新密码能用还不够；原内容、另一层、旧库备份和失败回退必须分别核对。",
    status: "改密、升级与原KDF保留已验证；层次边界明确", statusTone: "pass",
    value: "我可以把旧版本库升级，或换一个密码和密钥文件；但结果不能只是一句“成功”。工具要说明本次重建了什么、原库有没有留下、失败时回到哪里，以及另一密码的内容有没有被处理。",
    why: "改密和升级都会重新生成密文，不是简单修改一个标签。临时 .pwbak、保留的 .bak 和远端备份寿命不同；若把它们都叫成“自动备份”，真正需要恢复时可能找不到那份旧库。",
    example: "“给这份库换密码，先确认原来能打开的文件仍然在；失败时不要损坏旧库。”流程要先验证旧凭据，再核对重建范围与自检，并明确旧库副本是否会在成功后删除。",
    result: "得到新格式或新凭据下的库，以及真实的自检、旧库备份和取消／失败状态。没有保存另一层的维护方式必须直说，不能用本次打开的一层代表全部容器。",
    readerStates: { pass: "新凭据或新格式下能取回本次明确维护的内容，并说明实际留下的旧库位置和寿命。", problem: "自检、写入、恢复或层次保留不成立时返回失败；已经发生的变化与仍可用原件分开说明。", unavailable: "旧凭据无法打开、必要密钥文件缺失或当前格式不支持该维护时停止，不把它当成新建空库。" },
    decisionImpact: ["旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。", "临时备份成功后可能删除；不能把“执行时有备份”当成永久恢复点。", "维护只重建本次解开内容时，另一密码对应层需要独立处理，不能靠推测保留。"],
    problem: "防止维护过程假成功、丢失未核对内容，以及对旧库备份产生错误预期。",
    implementation: [
      "migrate_mode 识别当前格式；已有 VAULT03 则无需升级，VAULT01/02 需要原凭据解开再以当前格式重新封装。",
      "迁移和设置诱饵使用 .enc.bak 保存原库；change_password_mode 的 .enc.pwbak 是临时恢复文件，原实现成功或自检失败恢复后删除，不能在页面写成都会长期留下 .bak。",
      "改密允许本人选择新的密码及密钥文件；凭据变化必须明确，旧密钥文件与新密钥文件不应自动混用。",
      "既有维护入口有单层重建边界：只掌握一次解开的内容，不能因此保证未知另一层仍然存在。交互说明、原库保留和实际取回内容应一同检查。",
      "本轮修复后，VAULT03 改密和设置诱饵保留原 KDF 及全部编码参数，VAULT02 升级保留其 scrypt 参数；只有 VAULT01 迁移因原 PBKDF2 不在现有 V3 格式中，明确转为当前 scrypt。结构损坏或原算法不可用在密码、备份和写入前停止。",
      "clean_backups_mode 枚举实际备份并要求本人明确确认；删除只针对精确备份，不等于清理全部原文、系统历史或云端版本。",
      "恢复条件包括原库字节、对应密码、精确密钥文件及运行依赖；本机 .bak、私人 Git 提交与另一磁盘副本分别证明各自保存状态。"
    ],
    flow: ["确认是改密、升级还是明确清理，不把三件事连成自动流程。", "核对当前库、原凭据、格式和可能的其他层。", "说明会保留的旧库及临时备份的实际寿命。", "生成并验证本次维护结果，失败保留或恢复原件。", "检查实际新内容与恢复位置，再由本人决定是否清理旧备份。"],
    concepts: [{ term: "migration（格式迁移）", explanation: "先解读旧格式，再重新生成当前格式的密文；不是直接给旧文件换一个扩展名。" }, { term: "rollback copy（回退副本）", explanation: "操作失败时用于恢复旧状态的具体文件；必须说明它何时产生、何时仍在、何时会被删除。" }, { term: "unlocked layer（本次打开的内容层）", explanation: "当前凭据实际解出的那份内容，不自动等同双密码容器的全部内容。" }],
    boundaries: ["恢复不是找回遗失密码，也不是把损坏的唯一密文自动修成原文。", "不能为方便改密而静默改变原本声明的凭据、格式或层次范围。", "没有实际私人备份或换机演练时，源码与样例只证明实现和所测试流程。"],
    failures: [{ condition: "旧密码或密钥文件不匹配", response: "停止维护，不生成替代空库，也不把旧库删掉后让本人再试。" }, { condition: "新库自检或提交失败", response: "保留或恢复原库，明确是否产生临时文件，失败不能被命令行退出 0 隐藏。" }, { condition: "无法保留其他内容层", response: "明确本操作的维护范围并保持可恢复原件；本地编辑入口无法保真时直接拒绝，不伪称双层完整。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "migrate_mode、change_password_mode、clean_backups_mode 与备份寿命" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "改密、旧库迁移、备份与错误分支回归" }, { path: `${sourceRoot}\\docs\\key-repository-workflow.md`, role: "与私人远端密文备份区分的人工恢复流程" }],
    verification: ["真实虚构探针已验证旧密码拒绝、新密码往返，以及 V2→V3 内容相同并留下 .bak。", "改密时 .pwbak 的创建和删除是实际行为证据，不自动证明有长期旧密码恢复点。", "本轮没有清理用户任何真实备份或真实维护另一密码层。"],
    relation: "日常内容追加在文件入库模块；双密码容器独立说明两层；远端密文保存与逐字节读回在密文备份模块。"
  },
  {
    slug: "dual-password", shortTitle: "双密码容器", title: "两个密码打开不同内容，但不承诺现实中的不可识别",
    searchAliases: ["双密码保险库", "诱饵密码", "隐藏层", "两个密码不同内容", "VAULT03容量", "真实层放不下"],
    searchProjection: { intents: ["建立双密码内容", "核对两个密码结果", "判断隐藏层容量"], entities: ["decoy", "decoy_source", "slot0", "slot1", "_bucket_size", "VAULT03"], relations: ["诱饵密码打开主层", "真实密码打开尾部层", "分桶由可见层决定"], failureRecovery: ["容量不足保原库", "两层分别自检", "单密码维护不假称保全", "旧备份仍有边界"] },
    teaser: "本人明确需要时，让两个密码对应两份内容；容量和保留范围都有实际边界。",
    status: "双层封装、容量拒绝与分别自检已实现", statusTone: "pass",
    value: "同一个库可以由两个密码打开不同内容：一个对应本人准备的展示材料，另一个对应真实材料。工具要先分别核对这两份结果，放不下就明确停止，而不是生成只能打开其中一份的假成功库。",
    why: "双密码的产品价值来自可明确验证的内容分工，不来自“任何人都不可能发现”的口号。库文件、旧备份、反复快照和现实使用痕迹是不同证据；算法实现不能替人保证现实处境。",
    example: "“我明确要做一份双密码库：这个密码打开展示用材料，另一个打开自己的完整材料；请确认两个都对应正确内容。”本人提供两套材料与密码，工具分别自检，容量不足时保留原库。",
    result: "得到一个经两条密码路径分别核对的 VAULT03，或者具体的容量／输入失败说明。能证明的是本次两个密码打开了预期内容，不是面对面胁迫或任意技术分析下的绝对保证。",
    readerStates: { pass: "诱饵密码与真实密码各自打开对应材料，并通过写入前的双向自检。", problem: "真实层超出可用容量、密码安排或自检不成立时说明问题并保留原库。", unavailable: "无法打开原库、缺少必要密钥文件或没有合适的诱饵材料时停止，不代造真实内容或密码。" },
    decisionImpact: ["两个密码的内容要分别验，不只测试“某个密码能打开”。", "分桶空间由可见层决定，真实材料更大时必须调整明确提供的材料或取消。", "改密、追加和本地编辑是否能保留另一层，需要看各自入口，不能从双层存在推断。"],
    problem: "防止双密码只实现了一个可打开结果，或用容量与外观推测代替内容核对。",
    implementation: [
      "VAULT03 由公共格式头、主层 slot0 和尾部 slot1 组成；普通库尾部是随机填充，双层库尾部是经另一密码加密的真实内容。",
      "_pack_vault_v3 在双层模式把诱饵材料放到可见主层，真实材料放到尾部；_unpack_vault_v3 先试主层再试尾部，返回实际打开的层。",
      "_bucket_size 根据可见层总长度计算分桶，当前小库最少 64 KiB。隐藏内容必须容纳在该桶的尾部空间，超出时抛出明确错误，不无限增长来伪装同一容量性质。",
      "setup_decoy_mode 需要先打开现有库、读取明确 decoy_source/，然后建立新容器并分别验证真、假密码得到对应材料；原库备份与临时原文清理另行执行。",
      "公共标志不直接说明是否存在隐藏层。因此只打开主层不能证明尾部一定是无用填充，本地编辑也不能据此随意丢弃尾部。",
      "既有单层重建入口与容量内保留未解锁槽位的编辑是不同操作；对另一个密码的内容没有保真证据时，必须保留限制而非总称双层维护成功。"
    ],
    flow: ["本人明确需要双密码，并提供各自应打开的材料。", "验证当前库凭据和必要密钥文件。", "按可见材料计算真实层可用容量，放不下则拒绝。", "建立两层并分别解开比较预期内容。", "确认实际结果、原库备份和后续维护边界。"],
    concepts: [{ term: "decoy（诱饵内容）", explanation: "本人明确准备、由另一个密码打开的材料，不由 AI 猜测或编造为原文。" }, { term: "bucket（容量桶）", explanation: "把容器尺寸归到一组离散大小；这里依可见层决定，不能无限塞入真实层。" }, { term: "opaque tail（未解开的尾部）", explanation: "当前密码未能解释的尾部字节，可能是另一层，不能擅自当作可丢弃垃圾。" }],
    boundaries: ["没有验证现实胁迫处境、取证分析或多次快照比较的不可识别性。", "旧单层备份可能仍说明以前的内容状态，双层新库不会自动删除或改写历史。", "不能为修一个编辑入口而新建隐藏层发现系统、托管两套密码或另一种容器格式。"],
    failures: [{ condition: "真实材料放不进尾部容量", response: "明确拒绝并保留原库；提示调整本人提供的材料，不静默截断或只保存诱饵。" }, { condition: "只有一个密码的自检通过", response: "整个双层设置不能称完成，应保留对应失败与原件。" }, { condition: "后续编辑可能改变另一未解锁层", response: "只有容量和格式允许且保真证据成立时才编辑，否则拒绝并保留原密文。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "_bucket_size、双层封装／解包、setup_decoy_mode" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "双密码分别往返、分桶与容量拒绝" }, { path: `${skillRoot}\\scripts\\vault_auth_helper.py`, role: "本地编辑与未解锁槽位的保真边界" }],
    verification: ["本轮真实算法虚构样例中，真实密码打开 layer1、诱饵密码打开 layer0，分别取回对应内容。", "测试可核对同可见材料的尺寸与超容量拒绝，不能转化为现实处境保证。", "没有读取本人实际双密码库或使用真实口令。"],
    relation: "双层能力决定后续维护不能假装只存在一份内容；格式和凭据在密码与格式模块，日常查看仍使用相应本地入口。"
  },
  {
    slug: "image-carrier", shortTitle: "图片载体", title: "图片后面带一份密文，取回时核对的是密文",
    searchAliases: ["加密文件放进图片", "图片载体", "隐写", "图片里取回保险库", "VLTSTEG1", "图片压缩后密文没了"],
    searchProjection: { intents: ["用图片携带密文", "从图片提取密文", "检查载体是否完整"], entities: ["hide", "unhide", "VLTSTEG1", "vault.recovered.enc", "JPEG", "PNG"], relations: ["封面字节后追加密文", "载体不是额外加密", "外观正常不等于载荷完整"], failureRecovery: ["标记或长度错误拒绝", "重编码可能丢尾部", "提取后核对SHA256"] },
    teaser: "不改照片像素来藏字；用完整图片文件携带已有密文，并验证可原样取回。",
    status: "图片尾部追加与密文提取已实现", statusTone: "pass",
    value: "我可以让一个图片文件同时携带已有的加密库，之后用工具把密文原样取回。判断是否成功要比较提取后的密文，而不是只看图片仍能显示。",
    why: "图片查看器可能忽略尾部字节，但分享平台可能重新编码整张图，把尾部丢掉。把“封面能打开”和“保险库仍完整”混成一件事，会让损坏的载体看起来一切正常。",
    example: "“把这份已经加密的文件放在这张封面图片后面，再取出来确认没有改变。”工具建立载体并提取，比较密文大小与哈希；如果准备经过会压缩图片的平台，先明确这种传递方式不保证保留载荷。",
    result: "得到携带密文的图片文件，以及提取后的 vault.recovered.enc 或本人指定路径；成功取回需要字节一致。没有重新提供密码时只能证明密文保留，不能证明里面内容已恢复。",
    readerStates: { pass: "密文被追加并可从完整载体中提取，取回字节与原密文一致。", problem: "图片重编码、转存或尾部长度异常时，外观可能仍正常，但提取失败或哈希不符。", unavailable: "不是带本工具标记的载体、文件不可读或目标不明确时停止，不猜图里藏了什么。" },
    decisionImpact: ["这里是文件尾部封装，不是像素级隐写，也不增加一道加密。", "传递原文件与发送经过图片压缩的照片不同。", "应保留独立密文副本，不能只靠封面显示正常判断恢复。"],
    problem: "防止把图片外观当作密文完整性证据，以及把载体封装说成新的加密算法。",
    implementation: [
      "hide_in_image 顺序写入封面原字节、密文、8 字节长度和尾标 VLTSTEG1；不解密密文、不修改像素或加入新的密码派生。",
      "extract_from_image 从文件末尾检查标记和长度，再截取对应载荷；标记错误或长度范围不成立时拒绝。",
      "CLI hide 使用当前工具的 vault.enc；--cover 选封面，--out 指定载体。unhide 的默认输出为 vault.recovered.enc，避免默认覆盖原维护库。",
      "扩展名、查看器能显示和实际图片格式有效是不同问题；实现没有对所有图片软件、社交平台或重编码器做兼容保证。",
      "应对提取结果检查尺寸和 SHA-256，必要时再由本人用正确凭据实际打开；两步分别证明密文保全和内容可恢复。"
    ],
    flow: ["明确已有密文、封面与输出路径。", "把密文和长度标记追加到封面字节之后。", "用 unhide 提取到独立路径。", "比较原密文与取回密文的字节或哈希。", "如需确认内容恢复，再由本人本地提供对应凭据；不把图片外观当验收。"],
    concepts: [{ term: "carrier（文件载体）", explanation: "携带另一段数据的完整文件；这里靠保留文件尾部字节实现。" }, { term: "steganography（隐写）", explanation: "本工具使用这个命名，但实现是图片尾部追加，不应让读者误以为修改像素或不可检测。" }, { term: "re-encoding（重新编码）", explanation: "图片平台或软件重新生成图像字节，可能保留外观却删除追加密文。" }],
    boundaries: ["没有证明所有 JPEG/PNG 查看器均接受载体，或所有平台传递后仍能恢复。", "坏载体不能凭原来的图片外观补回丢失密文。", "本功能不自动上传、分享或公开任何图片。"],
    failures: [{ condition: "只是普通封面，没有尾标", response: "拒绝提取，不把任意尾部字节当成保险库。" }, { condition: "载体被截断或长度超出范围", response: "报告载体不完整，保留原文件，不输出伪造恢复成功。" }, { condition: "图片仍可显示但提取哈希不符", response: "密文保全未通过，应回到独立原密文副本，而不是继续尝试猜密码。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "hide_in_image、extract_from_image 与命令行参数" }, { path: `${sourceRoot}\\test_vault_tool.py`, role: "载体往返、普通封面与错误输入回归" }],
    verification: ["本轮虚构载体为 65,619 B，取回的密文哈希与原 65,536 B 容器一致；普通封面被拒绝。", "该结果只证明这组原样文件的封装与提取，没有实际分享平台或图片重编码验收。"],
    relation: "这里保存和取回的是已经加密的字节；密码、内容查看和远端备份仍由各自模块承担。"
  },
  {
    slug: "ai-local-interface", shortTitle: "AI 与本地入口", title: "只查状态不打开内容，要读写就明确进入本地操作",
    searchAliases: ["AI检查加密库", "不解密看结构", "加密库损坏怎么办", "本地密码框", "保险库编辑", "PromptOnly", "LocalView", "LocalEdit"],
    searchProjection: { intents: ["只看库状态", "解释损坏与下一步", "本地输入密码", "查看或编辑库内文本"], entities: ["info --json", "doctor --json", "assess --json", "plan --json", "vault-workflow", "PromptOnly", "LocalView", "LocalEdit"], relations: ["元数据不等于内容", "计划不执行", "人输入与AI状态分离", "未编辑成员保真"], failureRecovery: ["损坏库需人工核对", "严格检查ok与self_check", "缺keyfile停止", "不能保留槽位时拒绝编辑"] },
    teaser: "AI 可以检查和解释；密码输入、内容查看与保存分别是明确的本地动作。",
    status: "元数据、本地读写与失败状态已隔离验证", statusTone: "pass",
    value: "我可以让 AI 只检查格式、环境和下一步，而不让它看到原文。真正需要查看或改一段文本时，进入明确的本地图形流程，由我输入密码、选择密钥文件并确认保存；AI 得到的是实际做了什么、没做什么的状态。",
    why: "一个命令叫“只提示”不代表它真的只提示，一个 JSON 的 ok=true 也不代表库健康。若检查、解密、编辑和上传混在同一标签里，人和调用程序都会判断错下一步。入口需要按真实效果说明，而不是靠名字制造放心感。",
    example: "我可以分别说“只检查库有没有损坏，别打开内容”，或“我要在本地看并修改这份说明，密码我输入，其他文件别动”。前一种只走元数据；后一种要明确进入查看／编辑，并保留未编辑成员、密钥文件和原参数。",
    result: "元数据路线返回结构、依赖、风险与建议；本地路线按实际动作报告取消、解锁、查看、保存与自检，不返回密码或正文。写入前发现不能保真的编辑会拒绝且原库不变；若写入后的自检与回退都失败，明确报告目标可能已变并返回加密恢复副本，不宣称原路径已经恢复。",
    readerStates: { pass: "只读请求只检查元数据；本地读写按实际效果报告，保存只改变选定支持文本并核对原成员。", problem: "损坏、缺依赖、不支持或超容量先停止；若写后回退也失败，保持失败终态和加密恢复副本，不再允许继续保存。", unavailable: "本地依赖缺失、本人取消、必要密钥文件未选或正确凭据未成立时停止对应操作，不换路径猜测解锁。" },
    decisionImpact: ["严格无原文副作用的 CLI 检查必须带 --json；不带它会经过日志与残留清理。", "ok 表达检查调用是否完成时，不等于库可以解密；具体风险和 decision 仍要看。", "保留另一未知层可能限制编辑容量；容量不足不是让工具悄悄扔掉那一层的理由。"],
    problem: "防止状态命名掩盖真实副作用，以及本地文本保存丢失未编辑成员、凭据或其他层。",
    implementation: [
      "_inspect_vault_structure 有界读取魔数、长度、参数和尺寸，并跳过密文区；它不调用密码派生或解密。collect_vault_info、collect_doctor_info、collect_vault_assessment、collect_vault_plan 构成直接 JSON 接口。",
      "info/doctor/assess/plan --json 不初始化普通日志、不做旧 decrypted/ 清理、不列 source/ 或 decrypted/ 内的私人文件名。路径、目录存在和容器元数据仍是它读取的事实。",
      "assess 给出风险和建议，plan 再给 decision；损坏格式或结构须进入 manual_review（需本人核对），不能因 source/ 存在就推荐加密覆盖。检查调用成功不等于库健康。",
      "Invoke-VaultWorkflow.ps1 是脚本适配入口，不是 HTTP API。调用方检查 ok、self_check 和明确的原文／解密效果字段；适配脚本退出 0 可能只是成功交回一份失败结果。",
      "现行 Skill 将 PromptOnly（仅本地提示）、LocalView（本地查看）和 LocalEdit（本地编辑）分开：提示只采集并丢弃输入；查看和编辑必须给精确 VaultFile，不再自动寻找 Key、旧 E:\\Vault 或当前目录。必要密钥文件先选再解密，Required（要求密钥文件）拒绝原本只有密码的库。",
      "编辑须保留原 tar 成员、路径、类型、必要属性及未编辑二进制，严格处理受支持 UTF-8 文本；不能把整库替换解码后拼接，再只写一个 README.md。",
      "保存维持原凭据与 KDF，保护未解锁槽位；压缩后的新归档超过原槽容量时拒绝且不替换原库。写前解密自检、暂存字节回读、原子替换与最终文件自检分别成立；不重复对同一暂存候选做昂贵派生。若最终自检与回退都失败，保留加密恢复副本并锁定失败状态，不能再保存或被无变化操作洗成成功。",
      "GUI 的密码框 IME（输入法上下文）处理、复制后 15 秒及关闭清理属于本地实现。密码、密钥文件与原文不进返回给 AI 的 JSON；result、saved、save_attempted、self_check 等字段按真实动作报告，取消和未保存关闭不是保存成功。",
    ],
    flow: ["先分清仅检查、仅提示、本地查看还是本地编辑。", "只读路线读取结构和环境，给出风险与建议但不执行。", "本地路线明确目标，由本人先提供需要的密码和密钥文件。", "只查看支持文本，或只修改本人选定的支持成员；不能保留的格式／容量停止。", "按真实效果返回取消、解锁、查看、保存与自检状态，不返回原文或凭据。"],
    concepts: [{ term: "decision（下一步建议）", explanation: "根据已读取元数据形成的建议，不是动作授权，也不是已经执行的结果。" }, { term: "PromptOnly（仅本地密码提示）", explanation: "提示动作需要与实际查看、解密和保存分开，不能仅靠旧模式名判断效果。" }, { term: "member fidelity（成员保真）", explanation: "不改的文件和必要属性保留，只改变本次选中的受支持内容，不要求新密文与旧密文字节相同。" }],
    boundaries: ["元数据命令主要检查工具维护目录的固定文件；适配器的 VaultRoot 指向明确工具目录，不等于任意 VaultFile 参数都会重定向所有模式。", "GUI 替身与真实加密回归不能冒充本人已在真实桌面输入密码并完成验收。", "Skill、独立 vault-tool 与密码中心各有来源和作用域；修网页不授权读取真实库或改全局规则。", "不因旧接口名字含 prompt 就藏掉现有读写功能，也不为修复增加服务、密钥托管或通用文档编辑器。"],
    failures: [{ condition: "结构损坏但 source/ 有文件", response: "返回损坏与需核对，不推荐直接加密来替换未知原库。" }, { condition: "需要密钥文件却尚未选定", response: "在实际解密前完成所需选择，取消则明确取消；不能先用空 keyfile 失败后永远回不到选择步骤。" }, { condition: "文本、格式或容量不能保真保存", response: "拒绝保存并保留原密文；明确是支持范围或容量问题，不输出已编辑成功。" }, { condition: "返回 JSON 标明失败或效果未知", response: "调用方检查结构化状态，不用进程退出 0 或绿色文案替代。" }],
    sources: [{ path: `${sourceRoot}\\vault_tool.py`, role: "严格元数据、风险、计划与实际命令分流" }, { path: `${skillRoot}\\scripts\\Invoke-VaultWorkflow.ps1`, role: "模式分发、字段验证与结果适配" }, { path: `${skillRoot}\\scripts\\vault_auth_helper.py`, role: "本人本地输入、文本查看／编辑与结果状态" }, { path: `${skillRoot}\\references\\json-contract.md`, role: "调用方应读取的效果与失败字段" }, { path: `${skillRoot}\\references\\local-ui-security.md`, role: "GUI 实现范围与不能冒充的身份／系统证据" }],
    verification: ["来源独立审查从现行代码重建了本地GUI这条轴，修复后产品与技术说明均保留。", "41项隔离回归、独立虚构多成员／双槽／keyfile／KDF复验通过；回退失败后无变化及修改重试都不再发生写入。", "损坏库有／无source均选择manual_review，实际info --json仍可退出0但库ok=false；这是查询与库状态的区别。", "本轮没有真实桌面密码输入、本人私人库或系统剪贴板验收；测试与真人使用不互相替代。"],
    relation: "这里解释人与 AI 怎样进入产品；密码与格式、文件查看和库维护解释具体内容行为；私人远端动作由密文备份模块单列。"
  },
  {
    slug: "private-backup", shortTitle: "密文备份", title: "远端保存同一份密文，和真正能恢复分开验",
    searchAliases: ["密文备份", "Key私人仓库", "加密库上传失败", "备份是否真的成功", "远端回读", "ProtectRemoteReadme", "README保护"],
    searchProjection: { intents: ["保存私人密文副本", "确认远端内容一致", "预演备份", "保护指定远端说明"], entities: ["Key", "PublishVault", "VerifyRemote", "ProtectRemoteReadme", "WhatIf", "GitHub Contents API", "SHA-256"], relations: ["PUBLIC工具不同于PRIVATE密文目标", "上传和回读分开", "README保护不改历史", "字节一致不等于解密恢复"], failureRecovery: ["非PRIVATE拒绝", "PUT失败不报成功", "回读错字节停止", "预演不上传", "并发更新不强推"] },
    teaser: "先确认私人目标，再上传和逐字节回读；密文还在，不代表解锁条件一定齐全。",
    status: "上传与回读接口已验证；未操作私人远端", statusTone: "mixed",
    value: "我可以把一份明确密文保存在自己的私人仓库，并让工具确认远端保存的正是那份字节。真正恢复时再用原密码、密钥文件和兼容环境打开；这两层分别给出结论，不用一次上传提示包办所有证明。",
    why: "发布命令失败却仍打印成功，或只确认某个路径存在，都可能留下假的备份安心感。另一个“把远端 README 正文移进密文”的动作又会改变远端当前内容，需要与普通密文上传分开解释和确认。",
    example: "普通备份：“把这份明确的 vault.enc 备份到我指定的私人路径，再读回来确认大小和哈希。”独立的正文保护：“我明确要把当前远端 README 的内容转成密文，先预演，密码我在本机确认。”后一句不是前一句默认附带的动作。",
    result: "普通发布交回目标、默认分支、提交、实际保存字节与读回状态；没有真实回读就不是闭合备份。README保护交回单提交API写入结果与当前说明变更，尚没有同样的发布后字节回读；也不宣称旧历史已清除、已有库已合并或本人已验证恢复。",
    readerStates: { pass: "普通发布写入成功并核对默认分支密文字节；README保护只确认本地候选自检与单提交API结果，不冒充已有相同的远端字节回读。", problem: "目标、并发版本、写入或对应路径的核验不成立时说明哪一步失败及是否已经写入，不打印笼统成功。", unavailable: "账号、权限、目标身份或必要本地确认不成立时停止该远端动作；预演与只读仍不冒充发布。" },
    decisionImpact: ["公开的是 vault-tool 工具仓库；Key 是独立私人密文目标，没有公开正文入口。", "WhatIf 只预演，不上传；VerifyRemote 的树检查只证明路径存在。", "README 保护改变当前版本而不重写历史，也不自动合并已有 vault。"],
    problem: "防止路径存在、脚本退出码、上传提示和真正可恢复混为同一个成功状态。",
    implementation: [
      "Publish-KeyVaultToGitHub.ps1 通过现有 gh（GitHub 命令行工具）使用 Contents API；先解析实际仓库私有状态与默认分支，检查明确输入、非空字节和许可扩展名。扩展名许可不是加密真实性证明。",
      "更新已有路径需带当前文件 SHA；只有真实不存在才按创建处理，权限或网络错误不能静默当成没有文件。PUT 的退出码和返回结构必须被核对，失败不能继续输出 Uploaded。",
      "实际成功还需从默认分支读取目标 blob（Git 文件内容对象）身份，再读取 base64 编码字节，与本次上传同一缓冲区的长度和 SHA-256 比较；提交存在与当前分支路径一致分别核对。",
      "远端响应和临时请求文件包含的是密文；对调用方只返回目标、提交和指纹等元数据，不打印密文大正文，不克隆 Key，也不建立计划任务。",
      "Invoke-VaultWorkflow 的 VerifyRemote 在 Key 模式限制目标身份并检查 Git 树路径。safe_readme_present 这个既有字段只表明 README.md 路径存在，不检查正文是否是占位说明。",
      "ProtectRemoteReadme 是独立精确动作：WhatIf 不读正文、不取密码、不写远端；真实执行由本地辅助进程读取固定 source_head_sha 的 README，要求两次本地密码一致，打包单个 README 并自检。",
      "正文保护通过一个非强制 Git 提交同时写入密文与替代说明，核对的是API写入结果并返回commit_sha；它没有普通Publish路径的发布后blob字节回读。遇远端头变化不强推；不重写旧提交，不合并原保险库，也不证明历史中的正文已经不存在。",
      "恢复还需要对应密码、密钥文件、容器版本与依赖。本地 .bak、远端密文、程序测试和真正打开原文是不同恢复证据。"
    ],
    flow: ["明确普通密文备份，或另行明确远端README保护；不自动合并两种意图。", "现场解析目标、私有状态、默认分支和精确路径，必要时先预演。", "普通备份上传明确密文，再从默认分支读取blob字节和指纹。", "README保护在本地确认后处理固定来源，自检候选并返回单提交API写入结果；其后续远端字节回读没有由该入口实现。", "分别交回已完成的写入／回读层，单列未进行的远端字节核对或密码恢复，不合称都已验收。"],
    concepts: [{ term: "PRIVATE（私有仓库）", explanation: "本次远端访问范围，必须由真实目标元数据确认；它不是来自文件名或 README 的自称。" }, { term: "WhatIf（只预演）", explanation: "检查并说明计划动作，不上传、不替换远端正文，也不能作为已有备份证据。" }, { term: "read-back（从目标重新读取）", explanation: "写入后重新取实际保存的内容并核对，区别于只相信发送请求前的本地字节。" }, { term: "safe_readme_present（README 路径存在字段）", explanation: "现有名字容易误解；它只检查树路径，不证明正文安全或已经被替换。" }],
    boundaries: ["本轮网站建设不授权向私人 Key 写入虚构样例，所有发布接口测试均与真实远端隔离。", "密文读回可证明字节一致，不能确认遗失的密码或密钥文件，也不能替代真实恢复演练。", "不创建定时备份服务、公开分享链接、第二个远端或全历史改写流程。", "不能用一个 README 保护结果推断整个仓库及全部历史都没有原文。"],
    failures: [{ condition: "目标不是现场确认的私有仓库", response: "拒绝密文发布；不会为了完成脚本而改变仓库可见性。" }, { condition: "读取旧路径或 PUT 失败", response: "保留明确错误，停止后续成功标记；非 404 错误不被当成新文件。" }, { condition: "远端回读失败或字节不同", response: "说明可能已写入但尚未完成验证，不把失败自动重试成多次未知提交。" }, { condition: "正文保护被取消或远端版本变化", response: "取消就不写，版本冲突不强推；固定来源与尚未执行的动作分别保留。" }],
    sources: [{ path: `${sourceRoot}\\scripts\\Publish-KeyVaultToGitHub.ps1`, role: "私人密文上传与目标字节核对" }, { path: `${sourceRoot}\\docs\\key-repository-workflow.md`, role: "人工准备、密文与恢复条件" }, { path: `${skillRoot}\\scripts\\Invoke-VaultWorkflow.ps1`, role: "VerifyRemote、PublishVault、预演与结果适配" }, { path: `${skillRoot}\\scripts\\protect_remote_readme.py`, role: "固定远端版本、两次本地确认与单提交正文保护" }, { path: `${skillRoot}\\references\\json-contract.md`, role: "发布、读取与真实效果字段" }, { path: "GitHub REST API：文件内容与 blob", href: "https://docs.github.com/en/rest/git/blobs#get-a-blob", role: "GitHub 官方文件对象读取合同；base64 字节与接口容量边界" }],
    verification: ["来源发布脚本已通过九类隔离mock gh（模拟GitHub命令）验证：PUT失败、非404错误、404创建、正常回读、回读失败、字节不符、预演、非私人目标和扩展名拒绝。", "源库自身已normal-push并从真实main读回，但这不是向私人Key上传的结果。", "真实私人密文发布、密码恢复和换机恢复未在本轮执行。"],
    relation: "本模块保存密文与解释远端材料保护；具体加密、密码和本机取回仍由前面的模块负责，Key 不因此成为独立展示项目。"
  }
];

export const project = vaultToolProject;
export const modules = vaultToolModules;
