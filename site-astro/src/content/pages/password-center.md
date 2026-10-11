---
{
 "title": "密码中心",
 "kind": "project",
 "url": "/projects/password-center/",
 "tagline": "账号密码、本人验证和加密文件，集中锁在一处",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "usage",
   "label": "怎么用"
  },
  {
   "id": "tech",
   "label": "技术"
  },
  {
   "id": "highlights",
   "label": "亮点"
  },
  {
   "id": "features",
   "label": "全部功能"
  },
  {
   "id": "history",
   "label": "演进"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "password-center",
  "kind": "project",
  "title": "密码中心",
  "url": "/projects/password-center/",
  "tagline": "账号密码、本人验证和加密文件，集中锁在一处",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "安全地保管和使用秘密、确认是本人",
  "based_on": {
   "commit": "d167b07ab4901e51a0448d83ff0b0970fb71827b",
   "commit_time": "2026-09-28T06:48:51+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，水彩风、白底纯绿。从开头这屏的插画出发：绿色保险柜门缓缓开合一次，柜门上的钥匙环轻轻摆动，四把小钥匙依次亮起一圈柔和的绿光（指纹、亮着小圆点的手机、纸条、两个账号标志）；左边电脑屏幕和右边手机屏幕各闪一下，一条细绿线上有一个光点从手机流向保险柜、再流向电脑；背景水彩纸纹理微微流动，一两片叶子飘过。不出现任何可读的密码或数字串，不出现人脸。",
  "registry": {
   "groups": [
    {
     "id": "g-vault",
     "name": "密码库日常"
    },
    {
     "id": "g-programs",
     "name": "给程序用 key"
    },
    {
     "id": "g-identity",
     "name": "本人验证和授权"
    },
    {
     "id": "g-files",
     "name": "加密文件"
    },
    {
     "id": "g-phone",
     "name": "手机"
    },
    {
     "id": "g-recovery",
     "name": "备份和恢复"
    },
    {
     "id": "g-bitlocker",
     "name": "磁盘恢复钥匙"
    },
    {
     "id": "g-upkeep",
     "name": "自查"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-search",
     "group": "g-vault",
     "name": "搜索条目",
     "what": "按名称、账号或用途找到要用的那一条",
     "how": "打开密码中心，输入关键词点“搜索”",
     "status": "在用",
     "screen": "password-center-13",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\tools\\PasswordCenter.LocalSession.ps1（“输入名称、账号或用途开始搜索”）；PCConfig pending_acceptance password-center-sync-after-fix：9/28 本人打开解锁"
    },
    {
     "id": "f-view",
     "group": "g-vault",
     "name": "查看条目",
     "what": "忘了账号信息时，在本机窗口看完整内容",
     "how": "选中条目点“查看”，需要时选一种验证",
     "status": "在用",
     "screen": "password-center-13",
     "source": "旧台账 used 2026-09-22；LocalSession.ps1"
    },
    {
     "id": "f-add",
     "group": "g-vault",
     "name": "添加条目",
     "what": "新账号、key、银行卡、笔记都加密存进同一个库",
     "how": "点“添加”，选类型填好保存",
     "status": "在用",
     "screen": "password-center-13",
     "source": "ContentUi.ps1；PasswordCenterAndroid\\ACCEPTANCE.md：9/23 同步验收笔记由 PC 创建"
    },
    {
     "id": "f-edit",
     "group": "g-vault",
     "name": "编辑条目",
     "what": "密码或备注变了，直接改原来那一条",
     "how": "选中条目点“编辑”，保存后自动加密备份",
     "status": "在用",
     "screen": "password-center-13",
     "source": "旧台账 used 2026-09-21"
    },
    {
     "id": "f-delete",
     "group": "g-vault",
     "name": "删除条目",
     "what": "不再用的账号从库里拿掉，历史加密副本仍保留",
     "how": "选中条目点“删除”，核对名称后确认",
     "status": "在用",
     "screen": "password-center-13",
     "source": "旧台账 used 2026-09-20；m2-operations.md 第 2 节“无产品回收站”"
    },
    {
     "id": "f-random",
     "group": "g-vault",
     "name": "生成随机密码",
     "what": "设新密码时一次生成 32 位，不用自己编",
     "how": "新建或编辑时点“生成随机密码”",
     "status": "说不准",
     "screen": "password-center-13",
     "source": "LocalSession.ps1“已生成32位随机密码”；点没点过不留记录"
    },
    {
     "id": "f-copy",
     "group": "g-vault",
     "name": "复制",
     "what": "把账号或密码复制去粘贴，不进剪贴板历史",
     "how": "在查看窗口点“复制”或按 Ctrl+C",
     "status": "在用",
     "screen": "password-center-13",
     "source": "旧台账 used 2026-09-25；pcconfig.secret-broker.md §4.3、§5"
    },
    {
     "id": "f-types",
     "group": "g-vault",
     "name": "五类条目",
     "what": "账号密码、API 密钥、银行卡、笔记、BitLocker 同在一个 KDBX",
     "how": "添加时选类型；银行卡三项一起存",
     "status": "在用",
     "screen": "password-center-13",
     "source": "m2-operations.md 第 2 节；pcconfig.password-center-m2.md §3"
    },
    {
     "id": "f-clipboard-tab",
     "group": "g-vault",
     "name": "剪贴板历史标签",
     "what": "同一个窗口里看最近复制过的内容",
     "how": "点窗口上方第二个标签；资料锁着时不给看",
     "status": "在用",
     "screen": "password-center-13",
     "source": "PasswordCenter.Composite.ps1:226；password_center_clipboard.py:1（数据归 TimeAudit）；决定记录 E5"
    },
    {
     "id": "f-agent-secretref",
     "group": "g-programs",
     "name": "把 key 交给登记的程序",
     "what": "登记过的程序要调用服务时，由密码中心带着 key 替它调用厂商；健康导入只拿最长 1 小时的只读临时票",
     "how": "告诉 AI 让哪个程序办什么事",
     "status": "在用",
     "screen": "password-center-13",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\registries\\secret_broker.json secretref_targets（5 个：amap、qwen、glm、deepseek 四个中心代办，Google 健康一个临时票；10 月 11 日源码 968b9816 与现役安装一致）；pcconfig.secret-broker.md §4.2；真实使用：9/28 公开合成语音 ASR 经 qwen-default 原目标名一次成功（Claude 会话 33c31db0）"
    },
    {
     "id": "f-vendor-keys",
     "group": "g-programs",
     "name": "按厂商登记 key",
     "what": "高德、通义千问、智谱 GLM、DeepSeek 各登记一把，换模型换项目不用重登；高德只走中心代办",
     "how": "程序按厂商名取用",
     "status": "在用",
     "screen": "password-center-13",
     "source": "passwordcenter.vendor-api.md；pending_acceptance daily-calls-after-takeover-expiry；决定记录 19:20 之后一节；真实使用：Claude 会话 33c31db0 记录 9/28 AI 自跑验收（FZ13）命令行 GLM-5.3、GLM-5.3-flash、千问 3.8、DeepSeek flash 各一次通过，取 key 约 7.7 秒；公开合成语音 ASR 一次成功；本人 Codex 桌面 GLM-5.3-flash 正常回复（C:\\Users\\10979\\.claude\\projects\\E---agents\\33c31db0-876a-432c-8ee6-0c1751181acd.jsonl）"
    },
    {
     "id": "f-native-delivery",
     "group": "g-programs",
     "name": "给 Codex 交 key",
     "what": "AI 工具配置管理让 Codex 用千问、GLM、DeepSeek 时，经本机管道交过去；普通终端命令行版加 -NativeClient 凭受信设备材料取，撤销桌面 AI 挡不住这条路",
     "how": "在 AI 工具配置管理里选“passwordcenter:厂商”",
     "status": "在用",
     "screen": "password-center-13",
     "source": "passwordcenter.vendor-api.md“AICLI 原生交付”；真实使用：同上，Claude 链无界面桌面两轮通过、本人 Codex 桌面 GLM-5.3-flash 回复（Claude 会话 33c31db0）"
    },
    {
     "id": "f-reveal",
     "group": "g-programs",
     "name": "让 AI 弹一个密码给我看",
     "what": "说出要哪一条，AI 在本机弹窗显示，值不经过 AI",
     "how": "例如“B 站账号给我看一下”",
     "status": "在用",
     "screen": "password-center-13",
     "source": "local-secret-broker SKILL.md；m2-operations.md 2.4；旧台账复制 used 9/25"
    },
    {
     "id": "f-import-browser",
     "group": "g-programs",
     "name": "导入浏览器密码",
     "what": "以一份完整的 Chrome 导出表为准，整类替换“浏览器导入”里旧的 Google/Edge 导入，别的类别不动",
     "how": "把完整导出表交给 AI，说明以这张表为准；成功后明文表自动删掉",
     "status": "在用",
     "screen": "password-center-13",
     "source": "pcconfig.password-center-m2.md §3；提交 9/23 “replace browser imports from Chrome CSV”；PasswordCenterAndroid README“浏览器导入”分类"
    },
    {
     "id": "f-source-check",
     "group": "g-programs",
     "name": "核对凭据来源",
     "what": "同一个账号存了几份时，查清哪份有效",
     "how": "跟 AI 说“这个账号密码不对，查一下”",
     "status": "说不准",
     "screen": "password-center-13",
     "source": "secret_broker.py Discover/Audit；旧台账无使用记录"
    },
    {
     "id": "f-four-factors",
     "group": "g-identity",
     "name": "四选一验证",
     "what": "通行密钥、手机动态码、恢复码、账号任选一种",
     "how": "窗口里点一种方式完成",
     "status": "在用",
     "screen": "password-center-14",
     "source": "副驾驶笔记本账本.md:38（9/22 四种里三种加 TOTP 实测）；决定记录 B3、FY13"
    },
    {
     "id": "f-cooldown",
     "group": "g-identity",
     "name": "验证冷却",
     "what": "连错 6 次停 5 分钟，再错逐级加长到 24 小时",
     "how": "自动；冷却页显示几分钟后可重试",
     "status": "在用",
     "screen": "password-center-14",
     "source": "public-access-semantics.md §6.1"
    },
    {
     "id": "f-trusted-ai",
     "group": "g-identity",
     "name": "认出桌面 AI",
     "what": "只认我账户里、由 Claude 或 Codex 桌面版启动的程序",
     "how": "自动；不用我做什么",
     "status": "在用",
     "screen": "password-center-14",
     "source": "pcconfig.secret-broker.md §4.4；desktop_ai_identity.py；提交 9/25 “Integrate claude-root”"
    },
    {
     "id": "f-local-unlock",
     "group": "g-identity",
     "name": "本机免密开库",
     "what": "日常开库和自动备份不用每次验证",
     "how": "登记一次，之后自动",
     "status": "在用",
     "screen": "password-center-14",
     "source": "pcconfig.password-center-m2.md §6；secret_broker.py:8580 DPAPI"
    },
    {
     "id": "f-data-lease",
     "group": "g-identity",
     "name": "资料解锁期",
     "what": "验证一次，一段时间内 AI 可以用私人资料",
     "how": "说要开多久，默认值读当前设置（9/29 是 24 小时，出厂 8 小时），可填 0.5–72",
     "status": "在用",
     "screen": "password-center-14",
     "source": "旧台账 used 2026-09-20；pcconfig.secret-broker.md §7；PasswordCenter 提交 3a31fa7（北京 9/29）说明改为“默认读取当前设置，出厂值 8 小时”"
    },
    {
     "id": "f-data-lock",
     "group": "g-identity",
     "name": "锁定资料",
     "what": "不想让 AI 再用私人资料时立刻结束",
     "how": "说“锁定我的资料”，或点窗口上的“锁定”",
     "status": "在用",
     "screen": "password-center-14",
     "source": "secret_broker.py LockPersonalEnvironment；旧台账无使用记录；真实使用：Codex 会话 archived_sessions\\rollout-2026-09-19T08-13-10-01a0ba3a…jsonl 里 lock-personal-environment 回执 observed_utc 2026-09-19T16:48:54Z（北京 9/20 00:48），lock_started=true"
    },
    {
     "id": "f-takeover",
     "group": "g-identity",
     "name": "限时无限制授权",
     "what": "我定的时间里，我的明确指令优先于 AI 自己的规则",
     "how": "说“开无限制授权”，填时长、验证一次",
     "status": "在用",
     "screen": "password-center-14",
     "source": "旧台账 used 2026-09-20、9/24；决定记录 FZ9（9/27）；Invoke-OwnerTakeover.ps1"
    },
    {
     "id": "f-web-access",
     "group": "g-identity",
     "name": "网页上办授权",
     "what": "人在外面时在网页填动态码，开资料期或无限制授权",
     "how": "打开授权与状态页",
     "status": "待验收",
     "screen": "password-center-14",
     "source": "public-access-semantics.md §3；password_center_public_access.py；真实使用没找到记录；9/24 19:02 上线（电脑远程控制页 facts M22、M23）；主机服务日志 service.log、service.previous.log（9/27–9/28）里只有 status 查询、没有办理请求；与电脑远程控制页功能 37 的“待验收”对齐"
    },
    {
     "id": "f-web-lock",
     "group": "g-identity",
     "name": "网页一键减权",
     "what": "网页上不用登录就能按“锁定个人资料”“锁屏 Windows”，只能减权，不能解锁或拿秘密",
     "how": "打开授权与状态页点按钮",
     "status": "待验收",
     "screen": "password-center-14",
     "source": "public-access-semantics.md §7；真实使用没找到记录；同上，日志里没有 locks 的 POST"
    },
    {
     "id": "f-github-verify",
     "group": "g-identity",
     "name": "GitHub 重大动作验证",
     "what": "删库、转移、改公开前验证一次",
     "how": "AI 自动发起，我选一种方式",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "pcconfig.secret-broker.md §4.5 末段"
    },
    {
     "id": "f-file-encrypt",
     "group": "g-files",
     "name": "加密文件",
     "what": "把点名的文件或文件夹加密成 .pcaf，原件不动",
     "how": "说“帮我加密这个文件”",
     "status": "在用",
     "screen": "password-center-14",
     "source": "盘上 .pcaf 只找到 2 个：手机 App 发布签名钥匙、9/23 验收样本（已进待删区）"
    },
    {
     "id": "f-file-verify",
     "group": "g-files",
     "name": "核验加密文件",
     "what": "不解出原文，确认加密包没坏",
     "how": "问“这个加密文件还能恢复吗”",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "authorization-file-broker SKILL.md"
    },
    {
     "id": "f-file-decrypt",
     "group": "g-files",
     "name": "解开加密文件",
     "what": "解到指定文件夹，已有的同名文件不覆盖",
     "how": "说“把它解到某个文件夹”",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "authorization-file-broker SKILL.md"
    },
    {
     "id": "f-file-view",
     "group": "g-files",
     "name": "查看加密文件",
     "what": "只在本机窗口看包里一个文本文件",
     "how": "说“打开里面某个文件给我看”",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "authorization-file-broker SKILL.md；提交 9/10 “Add local file viewing and editing”"
    },
    {
     "id": "f-file-edit",
     "group": "g-files",
     "name": "修改加密文件",
     "what": "改包里一个文本文件，另存成新包，原包保留",
     "how": "说要改哪段、存到哪",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "authorization-file-broker SKILL.md"
    },
    {
     "id": "f-file-resume",
     "group": "g-files",
     "name": "中断接着加密",
     "what": "大批文件加密到一半断了，核对后接着做",
     "how": "再说一次同样的请求",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "authorization_file_broker.py STATE_SCHEMA；SKILL.md"
    },
    {
     "id": "f-file-newpc",
     "group": "g-files",
     "name": "新电脑上解开",
     "what": "带齐完整程序、匹配的恢复副本和 .pcaf，验证本人后在新电脑解开",
     "how": "指给 AI 盘上的恢复副本和加密包",
     "status": "说不准",
     "screen": "password-center-14",
     "source": "m2-operations.md“选定文件的加密、备份与独立恢复”"
    },
    {
     "id": "f-phone-app",
     "group": "g-phone",
     "name": "手机 App",
     "what": "手机上分类、搜索、查看、复制、增改删",
     "how": "打开手机上的密码中心，指纹解锁",
     "status": "在用",
     "screen": "password-center-15",
     "source": "PasswordCenterAndroid\\README.md、ACCEPTANCE.md（9/23 本人确认装上 1.0.6）；决定记录 B1"
    },
    {
     "id": "f-phone-bind",
     "group": "g-phone",
     "name": "绑定手机",
     "what": "由电脑核对绑定码、批准这台手机",
     "how": "电脑点“手机”，核对后“批准绑定”",
     "status": "在用",
     "screen": "password-center-15",
     "source": "pcconfig.password-center-android.md“手机登记与撤销”"
    },
    {
     "id": "f-phone-revoke",
     "group": "g-phone",
     "name": "撤销手机",
     "what": "换手机或不用了，收回旧手机的钥匙",
     "how": "在“手机”里选中它点“解除绑定”",
     "status": "在用",
     "screen": "password-center-15",
     "source": "PasswordCenterAndroid\\ACCEPTANCE.md：完整撤销重绑仍未验收；真实使用：E:\\Data\\PCConfig\\SecretBroker\\password-center-android-devices.json 的 forgotten 有 3 个旧身份（revoked_epoch 5、6、7），现役设备 issued 2026-09-23T17:13:34Z、封装重发 18:03:17Z（北京 9/24 01:13、02:03）；内容钥匙封装文件 9/24 02:03 更新"
    },
    {
     "id": "f-phone-sync",
     "group": "g-phone",
     "name": "手机和电脑互相同步",
     "what": "两边改的都同步过来，冲突两份都留",
     "how": "打开并解锁密码中心时自动进行",
     "status": "待验收",
     "screen": "password-center-15",
     "source": "pending_acceptance password-center-sync-after-fix；旧台账 used 9/26"
    },
    {
     "id": "f-recovery-set",
     "group": "g-recovery",
     "name": "自动加密恢复副本",
     "what": "每次保存都整份加密备份到私人 GitHub 和 G 盘",
     "how": "自动；G 上留 14 天",
     "status": "在用",
     "screen": "password-center-15",
     "source": "G:\\80_Backup\\PCConfig\\SecretBroker\\RecoverySets\\sets 目录计数 61"
    },
    {
     "id": "f-cold-h",
     "group": "g-recovery",
     "name": "恢复副本冷备到 H",
     "what": "每天随外接盘同步，把 G 上核对过的副本复制到 H；9 月 29 日接上，9 月 30 日追平",
     "how": "不用管：电脑配置与恢复每天同步外接盘时一起做；需要时也能单独手动跑",
     "status": "在用",
     "screen": "password-center-15",
     "source": "H:\\90_人工保留区\\PasswordCenter\\RecoverySets\\sets 计数 50，最新 9/24 02:38（手动跑过）；PCConfig 提交 020c05bc（北京 9/29 01:34）每日完整冷备调用 Invoke-PasswordCenterColdBackup.ps1 并在回执分列 G、H 最新日期；10 月 10 日 17:34（北京）每日冷备回执 h-cold-backup-receipt.json：status=complete，G、私人 Git、H 副本和指针读回均通过，16 个文件，不含明文（10 月 11 日读）"
    },
    {
     "id": "f-standalone",
     "group": "g-recovery",
     "name": "盘上的完整程序包",
     "what": "G、H 根目录各一份“密码中心.exe”，拿到别的电脑直接开",
     "how": "双击盘根的“密码中心.exe”",
     "status": "在用",
     "screen": "password-center-15",
     "source": "G:\\ 根目录实况；password_center_program_maintenance.json"
    },
    {
     "id": "f-open-backup",
     "group": "g-recovery",
     "name": "打开备用密码库",
     "what": "原电脑用不了时，打开一份完整的加密副本",
     "how": "窗口右下“切换密码库”，选副本文件夹",
     "status": "在用",
     "screen": "password-center-15",
     "source": "副驾驶笔记本账本.md:36–38（9/22）"
    },
    {
     "id": "f-new-device",
     "group": "g-recovery",
     "name": "新电脑整套恢复",
     "what": "从私人 GitHub 取回并登记新电脑、新的 AI",
     "how": "跟 AI 说要在新电脑恢复密码中心",
     "status": "说不准",
     "screen": "password-center-15",
     "source": "m2-operations.md 第 6 节 RecoverFromPrivateGit；没找到真实新电脑上的运行记录"
    },
    {
     "id": "f-sync-status",
     "group": "g-recovery",
     "name": "分清保存和同步",
     "what": "断网时分得清是只存在本机，还是已经同步",
     "how": "看窗口上的状态提示",
     "status": "在用",
     "screen": "password-center-15",
     "source": "password_center_sync.py；pcconfig.password-center-m2.md §9"
    },
    {
     "id": "f-close-wait",
     "group": "g-recovery",
     "name": "关窗等同步",
     "what": "关窗时还在同步，先等最多 3 分钟",
     "how": "自动；可以点“仍然关闭”",
     "status": "待验收",
     "screen": "password-center-15",
     "source": "pcconfig.password-center-m2.md §9；pending_acceptance password-center-sync-after-fix"
    },
    {
     "id": "f-program-update",
     "group": "g-recovery",
     "name": "程序包自动更新",
     "what": "批准的新版本自动更新到 E、G；H 随冷备更新",
     "how": "自动",
     "status": "在用",
     "screen": "password-center-15",
     "source": "m2-operations.md“程序与密文分别维护”；password_center_program_maintenance.json"
    },
    {
     "id": "f-bitlocker-view",
     "group": "g-bitlocker",
     "name": "看全部磁盘恢复钥匙",
     "what": "硬盘要恢复时，在本机窗口看各盘的恢复钥匙",
     "how": "说“把各盘恢复钥匙给我看”",
     "status": "在用",
     "screen": "password-center-16",
     "source": "旧台账 used 2026-09-20；secret-broker.md §7"
    },
    {
     "id": "f-bitlocker-intake",
     "group": "g-bitlocker",
     "name": "录入恢复钥匙",
     "what": "新盘加密后，把它的恢复钥匙存进库",
     "how": "跟 AI 说要录入哪块盘",
     "status": "说不准",
     "screen": "password-center-16",
     "source": "secret-broker.md §7 IntakeBitLocker"
    },
    {
     "id": "f-bitlocker-coverage",
     "group": "g-bitlocker",
     "name": "检查钥匙备齐没",
     "what": "只看每块盘的恢复钥匙存了没有，不显示钥匙",
     "how": "问“各盘恢复钥匙备好没有”",
     "status": "在用",
     "screen": "password-center-16",
     "source": "旧台账 used 2026-09-20；bitlocker_recovery_coverage.py"
    },
    {
     "id": "f-daily-check",
     "group": "g-upkeep",
     "name": "每天自查",
     "what": "每天 18:17 查登记齐不齐、来源有没有更新，顺带更新程序包",
     "how": "自动，不看密码",
     "status": "在用",
     "screen": "password-center-16",
     "source": "计划任务 PCConfig Password Center Metadata Check，9/28 上次结果 0；Invoke-PasswordCenterMetadataMaintenance.ps1:55 CheckUpdates"
    },
    {
     "id": "f-retired-autofill",
     "group": "g-retired",
     "name": "AI 代填网页登录",
     "what": "Chrome 扩展和本机通道替 AI 填密码；9 月 27 日撤掉，登录由我自己来",
     "how": "已撤掉",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "决定记录 19:20 之后一节（9/27 00:3x）；提交 2026-09-26T12:36-05:00"
    },
    {
     "id": "f-retired-disklock",
     "group": "g-retired",
     "name": "起疑就锁盘",
     "what": "觉得不对就锁 BitLocker；9 月 26 日整套删掉",
     "how": "已删除",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "决定记录 A1→F1；提交 2026-09-25T22:09–22:40-05:00"
    },
    {
     "id": "f-retired-masked",
     "group": "g-retired",
     "name": "遮住的复制面板",
     "what": "只能复制、看不到内容的面板；9 月 25 日删掉",
     "how": "已删除",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "提交 2026-09-25T10:06-05:00；secret-broker.md §4.3"
    },
    {
     "id": "f-retired-clipclean",
     "group": "g-retired",
     "name": "30 分钟清剪贴板",
     "what": "复制后 30 分钟自动清掉；9 月 25 日取消",
     "how": "已取消",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "提交 2026-09-25T09:03-05:00"
    },
    {
     "id": "f-retired-carrier",
     "group": "g-retired",
     "name": "登记式恢复载体",
     "what": "每块备份盘先登记才能用；9 月 26 日退役，现在盘符随便变",
     "how": "已退役",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "提交 2026-09-25T12:47-05:00；secret-broker.md §8"
    },
    {
     "id": "f-retired-coregoal",
     "group": "g-retired",
     "name": "目标登记（CoreGoal）",
     "what": "动手前先登记一个无人值守目标才放行；9 月 25 日退役",
     "how": "已退役",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "secret-broker.md §6；提交 2026-09-25T10:18-05:00（北京 9/25 23:18）"
    },
    {
     "id": "f-retired-ticket",
     "group": "g-retired",
     "name": "重大动作票据",
     "what": "GitHub 重大动作先开 30 秒能力票据、两段式提案；9 月 27 日删掉，改成直接验证一次",
     "how": "已删除",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "secret-broker.md §4.5 末段、§6；提交 2026-09-27T09:59-05:00“简化密码中心桌面身份并删除退役集成”（北京 9/27 22:59）"
    },
    {
     "id": "f-retired-invite",
     "group": "g-retired",
     "name": "设备邀请",
     "what": "10 分钟有效的新设备邀请；9 月 26 日退役",
     "how": "已退役",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "public-access-semantics.md §3.2 末段"
    },
    {
     "id": "f-retired-openclaw",
     "group": "g-retired",
     "name": "OpenClaw 专用代码",
     "what": "给已冻结的 OpenClaw 取 key 的专用分支；9 月 27 日后删掉，凭据留作普通条目",
     "how": "已删除",
     "status": "已停用",
     "screen": "password-center-16",
     "source": "决定记录 ZS8；secret-broker.md §6"
    }
   ],
   "numbers": [
    {
     "id": "n-factors",
     "text": "4 种",
     "meaning": "最高权限本人验证方式的种类",
     "as_of": "2026-09-28",
     "source": "pcconfig.password-center-m2.md §5；决定记录 B3",
     "screens": [
      "password-center-01",
      "password-center-04",
      "password-center-12"
     ]
    },
    {
     "id": "n-copies",
     "text": "3 处",
     "meaning": "加密恢复副本的存放处：私人 GitHub 分支、G、H",
     "as_of": "2026-09-28",
     "source": "pcconfig.secret-broker.md §3、§8",
     "screens": [
      "password-center-01",
      "password-center-10"
     ]
    },
    {
     "id": "n-targets",
     "text": "5 个",
     "meaning": "secret_broker.json 里登记的 secretref_targets 条数（不含 AICLI 原生交付）",
     "as_of": "2026-10-11",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\registries\\secret_broker.json（提交 968b9816，与现役安装同一份目标）",
     "screens": [
      "password-center-01",
      "password-center-11"
     ]
    },
    {
     "id": "n-lease",
     "text": "0.5–72 小时",
     "meaning": "资料解锁期和无限制授权可填的时长范围；默认值读密码中心当前设置（9/29 为 24 小时），程序出厂值 8 小时",
     "as_of": "2026-09-28",
     "source": "public-access-semantics.md §3.2；secret-broker.md §7",
     "screens": [
      "password-center-01",
      "password-center-02"
     ]
    },
    {
     "id": "n-random",
     "text": "32 位",
     "meaning": "生成随机密码的长度",
     "as_of": "2026-09-28",
     "source": "PasswordCenter.LocalSession.ps1 “已生成32位随机密码”",
     "screens": [
      "password-center-03"
     ]
    },
    {
     "id": "n-cooldown",
     "text": "5 分钟到 24 小时",
     "meaning": "本机和网页验证冷却的起始和最长时长",
     "as_of": "2026-09-28",
     "source": "public-access-semantics.md §6.1",
     "screens": [
      "password-center-04"
     ]
    },
    {
     "id": "n-android",
     "text": "1.0.6",
     "meaning": "手机 App 装在小米 15 Pro 上的版本（本人 9/23 确认）",
     "as_of": "2026-09-28",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\android\\ACCEPTANCE.md 当前阶段（9/29 提交 3a31fa7 从原 E:\\Projects\\PasswordCenterAndroid 入库）",
     "screens": [
      "password-center-05"
     ]
    },
    {
     "id": "n-code",
     "text": "约 11.1 万行",
     "meaning": "PasswordCenter 仓库自有代码行数（.py/.ps1/.psm1/.mjs/.cs，排除随带第三方库）",
     "as_of": "2026-10-11",
     "source": "git ls-files 于 968b981 逐文件数行：Python 87398、PowerShell 23146、JS 808、C# 164，合计 111516",
     "screens": [
      "password-center-08"
     ]
    },
    {
     "id": "n-tests",
     "text": "137 项",
     "meaning": "tests/test-registry.json 里登记的测试条数，已知失败 0",
     "as_of": "2026-10-11",
     "source": "test-registry.json、known-failures.json",
     "screens": [
      "password-center-08"
     ]
    },
    {
     "id": "n-commits",
     "text": "413 次",
     "meaning": "main 分支提交数（含从 PCConfig 过滤迁来的历史）",
     "as_of": "2026-10-11",
     "source": "git rev-list --count HEAD（968b981）",
     "screens": [
      "password-center-08",
      "password-center-17"
     ]
    },
    {
     "id": "n-sets-g",
     "text": "61 份",
     "meaning": "G 上的恢复副本份数，时间 9/16 12:15–9/28 07:20（北京时间）",
     "as_of": "2026-10-12",
     "source": "G:\\80_Backup\\PCConfig\\SecretBroker\\RecoverySets\\sets 目录计数（10 月 11 日 16:07 北京时间读）；最早 9 月 16 日、最新 9 月 28 日 07:20，之后没有新副本",
     "screens": [
      "password-center-10"
     ]
    },
    {
     "id": "n-sets-h",
     "text": "61 份",
     "meaning": "H 上的恢复副本份数，最新一份与 G 相同：9/28 07:20（北京时间）",
     "as_of": "2026-10-12",
     "source": "H:\\90_人工保留区\\PasswordCenter\\RecoverySets\\sets 目录计数（10 月 11 日 16:07 读）；最近一次写入 9 月 30 日 22:51（北京）",
     "screens": [
      "password-center-10"
     ]
    },
    {
     "id": "n-package",
     "text": "2218 个文件",
     "meaning": "G 上现役程序包（manifest 06a37382…）的文件数",
     "as_of": "2026-10-12",
     "source": "G:\\PasswordCenter\\06a37382…\\ 递归计数（10 月 11 日 16:06），仍是最新的程序包目录",
     "screens": [
      "password-center-10"
     ]
    },
    {
     "id": "n-entries-0924",
     "text": "331 条",
     "meaning": "9 月 24 日截图时库里的条目总数（截图上的“全部”计数），不是现在的数",
     "as_of": "2026-09-24",
     "source": "旧网站截图 01-api-catalog.png",
     "screens": [
      "password-center-03"
     ]
    },
    {
     "id": "n-features",
     "text": "57 项",
     "meaning": "本页全部功能条数（含 8 项已停用）",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "password-center-13"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-install",
     "with": "pcconfig",
     "direction": "交给",
     "flow": "电脑配置与恢复把密码中心装进 C:\\ProgramData\\PCConfig\\AuthorityHost、管机器绑定和每天 18:17 的自查任务，把恢复副本从 G 复制到 H",
     "source": "password_center_machine.json；PasswordCenter AGENTS.md"
    },
    {
     "id": "r-pcconfig-image",
     "with": "pcconfig",
     "direction": "交给",
     "flow": "换机时，本人在 G/H 盘根的密码中心里取出系统镜像的密码交给 Veeam",
     "source": "pcconfig-facts 第 19 行；副驾驶笔记本账本.md"
    },
    {
     "id": "r-pcconfig-git",
     "with": "pcconfig",
     "direction": "交给",
     "flow": "加密恢复副本提交到 PCConfig 仓库的私人分支 secret-broker-backup；手机也从这里同步",
     "source": "pcconfig.password-center-android.md“共享 generation 与同步”"
    },
    {
     "id": "r-vault-tool",
     "with": "vault-tool",
     "direction": "各管各",
     "flow": "两套文件加密，钥匙、恢复材料都不共用，互不导入",
     "source": "pcconfig.secret-broker.md §3；pcconfig.password-center-m2.md §10"
    },
    {
     "id": "r-chinese-asr",
     "with": "chinese-asr",
     "direction": "交给",
     "flow": "疑难录音送通义千问复核时，密码中心把千问的 key 交给固定传话程序",
     "source": "secret_broker.json qwen-audio3-asr-important-once"
    },
    {
     "id": "r-aicli",
     "with": "ai-cli-profile-manager",
     "direction": "交给",
     "flow": "Codex 用智谱、DeepSeek、千问的 key 时，经本机管道原生交付",
     "source": "passwordcenter.vendor-api.md"
    },
    {
     "id": "r-health",
     "with": "personal-health",
     "direction": "交给",
     "flow": "导入 Google 健康数据时只交一张最长 1 小时的只读临时票，长期材料不交出；资料锁着不发",
     "source": "secret_broker.json personal-health-google-health-import"
    },
    {
     "id": "r-preferences",
     "with": "daily-preferences",
     "direction": "交给",
     "flow": "出行查询时由密码中心带着高德 Web 服务 key 代办请求，key 不交给出行程序",
     "source": "secret_broker.json daily-preferences-amap-mobility-probe"
    },
    {
     "id": "r-learning",
     "with": "learning",
     "direction": "交给",
     "flow": "以前学习方法的百炼转发服务从这里取千问 key；10 月 11 日的登记里已没有这个目标",
     "source": "secret_broker.json（968b9816）secretref_targets 里已无此项；原为第 4 个 target"
    },
    {
     "id": "r-timeaudit",
     "with": "timeaudit",
     "direction": "拿来",
     "flow": "窗口里的“剪贴板历史”标签只读 TimeAudit 的剪贴板记录，受资料解锁期管",
     "source": "password_center_clipboard.py:1"
    },
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "交给",
     "flow": "远程连电脑的 AI 读同一个资料解锁期；网页授权与状态页用手机动态码开资料期或无限制授权、一键锁资料",
     "source": "public-access-semantics.md §3、§5、§7"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "交给",
     "flow": "Claude、Codex 的钩子每条新消息读资料状态和无限制授权；受信任的 AI 身份由密码中心现场核对",
     "source": "pcconfig.secret-broker.md §4.4；约法每次都要做的第 2 条"
    },
    {
     "id": "r-github-index",
     "with": "github-local-index",
     "direction": "交给",
     "flow": "GitHub 删库、转移、改公开前由密码中心做一次本人验证",
     "source": "pcconfig.secret-broker.md §4.5 末段"
    },
    {
     "id": "r-cloudflare",
     "with": "Cloudflare",
     "direction": "拿来",
     "flow": "换电脑时的手机动态码由 Cloudflare Worker 上的独立验证端核对",
     "source": "tools/password-factor-service/README.md"
    },
    {
     "id": "r-google-ms",
     "with": "Google 云盘、OneDrive",
     "direction": "拿来",
     "flow": "账号验证从两家的应用专用文件夹取回加密材料",
     "source": "password_center_account_oauth.py:4、64、68"
    }
   ],
   "highlights": [
    {
     "id": "h-any-one-factor",
     "title": "丢了三种验证，也还开得了",
     "screen": "password-center-12"
    },
    {
     "id": "h-blind-key",
     "title": "AI 用 key，却看不见 key",
     "screen": "password-center-12"
    },
    {
     "id": "h-revoke-rotate",
     "title": "撤掉一台手机，整个库换一把钥匙",
     "screen": "password-center-12"
    },
    {
     "id": "h-cancel-once",
     "title": "取消只算这一次",
     "screen": "password-center-12"
    },
    {
     "id": "h-network-not-invalid",
     "title": "断网不等于密码坏了",
     "screen": "password-center-12"
    },
    {
     "id": "h-csv-no-delete",
     "title": "浏览器密码表，以完整导出为准",
     "screen": "password-center-12"
    },
    {
     "id": "h-clipboard",
     "title": "复制不进剪贴板历史",
     "screen": "password-center-12"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L16",
     "screen": "password-center-02",
     "text": "约法 L16"
    },
    {
     "target": "/computer-access/",
     "screen": "password-center-02",
     "text": "授权与状态"
    },
    {
     "target": "/skills/local-secret-broker/",
     "screen": "password-center-02",
     "text": "密码和验证技能"
    },
    {
     "target": "/skills/authorization-file-broker/",
     "screen": "password-center-02",
     "text": "加密文件技能"
    },
    {
     "target": "/projects/timeaudit/",
     "screen": "password-center-03",
     "text": "电脑使用与性能记录"
    },
    {
     "target": "/rules/authorization/",
     "screen": "password-center-04",
     "text": "用户授权"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "password-center-04",
     "text": "约法 L17"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "password-center-06",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/vault-tool/",
     "screen": "password-center-07",
     "text": "本地加密库"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "password-center-08",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/ai-cli-profile-manager/",
     "screen": "password-center-11",
     "text": "AI 工具配置管理"
    },
    {
     "target": "/rules/charter/#L14",
     "screen": "password-center-11",
     "text": "约法 L14"
    },
    {
     "target": "/how/#password-center",
     "screen": "password-center-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#password-center",
     "screen": "password-center-01",
     "text": "现在正不正常 → 驾驶舱"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "每天 18:17 的“密码中心自查”上次跑得怎么样（成功／失败／没按时跑）",
     "source": "看板接口的自动任务块，任务名 PCConfig Password Center Metadata Check"
    },
    {
     "slot": "backup",
     "meaning": "最新加密恢复副本在 G、H 各是什么时候；H 落后超过约定天数时显示要看",
     "source": "看板接口的备份块里密码中心恢复集（G）和冷备到 H 两项"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“保留加密恢复副本”拆成 f-recovery-set（自动到 GitHub 和 G）和 f-cold-h（手动到 H），两者状态和做法不同。",
    "底稿“设置资料解锁期”的“设默认时长”并进 f-data-lease：设默认不改变已开着的期限，写在 what/how 里不单列。",
    "旧稿“重大动作票据”一项按审稿意见拆成 f-retired-coregoal（目标登记，9/25 退役）和 f-retired-ticket（GitHub 30 秒能力票据，9/27 删除）。",
    "底稿“查看已存内容”对应 f-view（本人在窗口看）；AI 发起的单项弹窗另列 f-reveal，因为入口和验证规则不同。"
   ],
   "dropped": [],
   "unsure": [
    "manifest 写“未独立成仓，repo=null”，但 9/28 00:42 已拆到私人仓库 wlyaaaaa/PasswordCenter（E:\\Projects\\Tools\\PasswordCenter，main=origin/main=d167b07）。本页按已拆仓写；因为是私有仓库，repo_url 仍填 null、不放 GitHub 按钮。",
    "第 1 屏引的本人原话是决定记录 FZ13 删掉口头语后的样子，上线前请本人过目；第 2 屏的例子按本人 9/28 更正改成假设的说法。",
    "替本人口吻写的句子（上线前请本人过目）：第 6 屏“恢复码我选择不测”；第 7 屏“我 9 月 26 日定的”“只在我记住的密码和密钥文件里”；第 9 屏“绑在这台电脑的我的账户上”；第 12 屏“不然我随手关一个验证窗口……AI 全停”；演进“按我的决定拆掉”。",
    "第 2–5 屏的 4 张截图取自旧网站 V:\\Personal\\Projects\\wly0829.cn\\public\\media\\pcconfig\\（01、03、06、07，9 月 24 日截）。01 主窗口截图露出 10 条 API 条目的名称（含 OpenClaw、GLM、高德、GitHub 同步等）和当时的分类数量，不含任何值；旧网站已公开过，本页照用。03 手机窗口截图露出完整绑定码，已另存遮住那一格的副本 E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\03-phone-bindings-masked.png 使用，原图未动。本人若不想公开条目名称，换成仓库里的设计参考图 E:\\Projects\\Tools\\PasswordCenter\\docs\\design\\assets\\sensitive-data-access-p5-two-tabs-20260924-v2.png（示例数据）。07 四选一窗口截图电脑配置页第 16 屏也在用，那页讲换机，本页是验证方式的家。",
    "手机动态码的独立验证端（Cloudflare Worker）：README 写“尚未进行 Cloudflare 部署……真人 TOTP”，但 9/22 副机实测记录写本人 TOTP 开库成功。本页按“实测成功、有独立验证端”写；独立验证端是否就是 9/22 用的那条路径，未逐项核实。",
    "“现在”横条的 backup 槽位：PCConfig 看板有密码中心恢复集（G）和冷备到 H 两项，但驾驶舱接口里具体字段名没核；第 2 批接驾驶舱时要确认。",
    "手机 App 版本：README 顶部写“已发布 1.0.6”，同文下一节又写“1.0.6 待正式签名，尚未发布”；ACCEPTANCE.md 写 9/23 本人确认 1.0.6 已安装。本页按本人确认写“1.0.6”。",
    "“登记了 7 个能取 key 的程序”按 secret_broker.json 的 secretref_targets 计，其中一个目标用的凭据名还叫 openclaw-github（冻结项目的名字，实际是读 GitHub 账号信息）；页面上不列这些名字。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/password-center/page.json",
  "sha256": "f03e13f6800535f8e9d8eb4ef74cd6d56ecf99a9233e3b910685a6e2bef77b94",
  "converted_at_beijing": "2026-10-12T05:03:46+08:00"
 }
}
---

::screen{#password-center-01 section="top"}

```typeset
{
 "screen": {
  "id": "password-center-01",
  "section": "top",
  "title": "开头",
  "scene": "左上毛笔艺术字大标题，下面介绍段，介绍段下面一枚白底细绿边圆角按钮（怎么协作）。右上一幅水彩插画：一只绿色保险柜，柜门半开，露出一叠卡片（钥匙、银行卡、硬盘、便签四种小图标）；柜门上挂一个钥匙环，环上四把样子不同的小钥匙（指纹、一部屏幕上亮着一排小圆点的手机、一张画满细线的小纸条、Google 和微软两个小标志）；保险柜左边一台电脑、右边一部手机，各用一条细绿线连到柜子。中间一排四张数字卡片（和样张第一屏一样：上面小插画，大号绿色数字，下面一行小字；小插画依次是钥匙环、三个叠起来的盒子、一个程序窗口里的齿轮、一只沙漏）。最下面一条细长圆角横条“现在”：左边写“现在”两个字，接着两个留空的浅色圆角小框（各约占横条宽度的三分之一、高度与文字行相同，框里不画任何字），最右边一个按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：标题和介绍在上，插画缩小放在介绍下面；怎么协作按钮跟在插画后面；四张数字卡两两一行排成两行；“现在”横条改成上下三行：“现在”两个字一行，两个空框各占一行（宽度撑满），按钮单独一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#password-center"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#password-center"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/password-center/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "backup"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "hero",
     "width": "47%",
     "align": "left",
     "size": "large",
     "text_ref": "密码中心"
    },
    {
     "type": "live_strip",
     "text_ref": "现在",
     "frame_mode": "plain",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "这台电脑上所有秘密的保险柜"
    },
    {
     "type": "action_button",
     "row": "hero",
     "text_ref": "在整套系统里的位置"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "53%",
     "illustration": "outside",
     "size": "large"
    },
    {
     "type": "stat_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "numbered_pipe": true,
     "text_ref": "14 种"
    }
   ],
   "notes": "使用已批准01-h：左标题/两段介绍/两按钮，右卡外保险柜插画。中间四数字卡一排，原图每卡左插画、右大编号与定稿数字，不是编号流程；无丝带。现在横条两个空槽+按钮。steps.cols须按统计卡排且保留定稿编号，不得删字。",
   "requires_engine_support": [
    "stat_card接收numbered_pipe节点并保留编号"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "密码中心"
    },
    {
     "type": "live_strip",
     "text_ref": "现在",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "numbered_pipe": true,
     "text_ref": "14 种"
    },
    {
     "type": "prose",
     "text_ref": "这台电脑上所有秘密的保险柜"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "large"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "按01-v及已批准01-v2合并看：首张标题、两段正文、下方卡外保险柜；续张为链接/按钮与四张数字卡一列、左图右数字正文，末尾现在上下排两空槽和按钮。虽然旧portrait写两列，实际批准续图为一列，以原图构图为准。不要把旧图漏掉的复制按钮带入新图。数字卡前固定换张，保留v→v2。",
   "pagination_hint": {
    "before": "1. 4 种",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "numbered_pipe统计卡",
    "原有固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-password-center-01-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "种｜本人验证方式任选一种：通行密钥、手机动态码、恢复码、Google 或微软账号",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "处｜加密恢复副本：私人 GitHub、机箱里的 G 盘、外接的 H 盘，任一处加一种验证就能找回",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "个｜登记过能取 key 的程序，key 直接交给程序",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "–72 小时｜验证一次，AI 在这段时间里可以用我的私人资料",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-password-center",
   "source_phrase": "右上一幅水彩插画：一只绿色保险柜，柜门半开，露出一叠卡片（钥匙、银行卡、硬盘、便签四种小图标）；柜门上挂一个钥匙环，环上四把样子不同的小钥匙（指纹、一部屏幕上亮着一排小圆点的手机、一张画满细线的小纸条、Google 和微软两个小标志）；保险柜左边一台电脑、右边一部手机，各用一条细绿线连到柜子。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一只绿色保险柜，柜门半开，露出一叠卡片（钥匙、银行卡、硬盘、便签四种小图标）；柜门上挂一个钥匙环，环上四把样子不同的小钥匙（指纹、一部屏幕上亮着一排小圆点的手机、一张画满细线的小纸条、Google 和微软两个小标志）；保险柜左边一台电脑、右边一部手机，各用一条细绿线连到柜子"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c542fe3321d5cecadc64.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c542fe3321d5cecadc64",
   "title_text": "密码中心",
   "sha256": "7cbaf4202c59834a5cb0158ce9d68c8c302f14ba9860a0bd53f9f8809f8e863b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**密码中心**

这台电脑上所有秘密的保险柜。网站密码、API 密钥、银行卡、磁盘恢复钥匙都加密存在同一个库里；AI 要用 key 时，由它直接交给登记过的程序，AI 的对话里看不到值。要确认“是我本人”的事——看一个密码、让 AI 用私人资料、开限时无限制授权、加密我点名的文件——也都在这里验证。9 月 28 日从电脑配置库里拆出来，成了独立的私有项目。

一个例子：9 月 28 日我说“你们调用不了 AICLI 吗？用 GLM 自己试试呗”。AI 经密码中心取 key，用 GLM-5.3、GLM-5.3-flash、千问 3.8、DeepSeek flash 各发一条公开测试请求，全部走通，每次取 key 约 7.7 秒；AI 从头到尾没见过 key。

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

1. 4 种｜本人验证方式任选一种：通行密钥、手机动态码、恢复码、Google 或微软账号
2. 3 处｜加密恢复副本：私人 GitHub、机箱里的 G 盘、外接的 H 盘；拿着任一块盘加一种验证就能查密码，新电脑整套恢复还要连得上私人 GitHub
3. 5 个｜登记过的取用目标：4 个由密码中心带着 key 替程序调用厂商（高德、千问、GLM、DeepSeek），1 个给健康导入发最长 1 小时的只读临时票
4. 0.5–72.0 小时｜验证一次，AI 在这段时间里可以用我的私人资料

现在　　〔现在正不正常 → 驾驶舱〕

::screen{#password-center-02 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "左上标题。五张横向圆角卡片竖着排成一列（每张左边一个小水彩图标：放大镜照着一张卡片、一个程序窗口伸手接过一把钥匙、一个打开的文件夹旁边一只沙漏、一顶绿色小皇冠、一个被锁链缠住的文件夹），右边粗体标题加两三行正文。屏幕右侧约三分之一宽，上面留一个带细浅绿边框的空位（约 3:2，放“解锁个人资料”窗口截图），空位下面一行小字说明；空位上方画一小幅水彩插画：一个人坐在电脑前，旁边手机屏幕亮着一排小圆点。最下面一行小字放两个链接。",
  "portrait": "竖版保留既定v/v2两张，默认顺序不动。第1张02-v仅原标题与查一个密码/AI要用key/AI要用我的私人资料三卡完整原字；缩AI人物/标题装饰，三卡整宽上下排、正文正常36源像素/行44参考，手机370直接可读。第1张没有截图、截图图注或空框；旧泛稿把本屏唯一截图重复画在v1底部是衍生错误，应去掉。第2张已有正确02-v2中的唯一真实截图、完整原图注和既定两段原说明保持，原路径/字节/SHA不变，不重画、不搬原字。两张最终合图中第三卡后自然接v2正确真图，整屏只有一张登记截图。不新增frame登记，不修改screenshots/caption或整屏text。第1张17行正文36/44、标题与三卡标题正常层级，取消大人物和假框后有充足空间，不缩主正文；外部连续空白由现役crop_box裁边，不补新字/装饰。",
  "links": [
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "约法 L16",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "密码和验证技能",
    "href": "/skills/local-secret-broker/"
   },
   {
    "text": "加密文件技能",
    "href": "/skills/authorization-file-broker/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/f0af38bf0e97f2fdd9ebeb82b5f2330f1010035cbf4258a82e1ab520289904dd.png",
    "where": "右侧约三分之一宽、插画下面的 3:2 细边框空位；竖版在第三张卡片后撑满宽度",
    "caption": "开资料解锁期的窗口：填小时数、可同时开无限制授权（9 月 24 日截图）",
    "crop_h": [
     25,
     190,
     725,
     529
    ],
    "crop_v": [
     25,
     190,
     620,
     539
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "usage",
     "width": "63%",
     "align": "left",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "content_card",
     "row": "usage",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "查一个密码"
    },
    {
     "type": "illustration",
     "row": "usage",
     "width": "37%",
     "illustration": "outside",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "row": "usage",
     "ratio": "994:669",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "row": "usage",
     "text_ref": "开资料解锁期的窗口"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "AI 要用我的私人资料"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "放手让 AI 干一段"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 具体怎么说"
    }
   ],
   "notes": "左63%五横卡单列，编号和图标左内/标题正文右内；右37%人物卡外插画、唯一3:2截图空槽、图注。标题和旁图分栏，保持左对齐。末链接行整宽。原图末链接位于第五卡内，定稿独立节点，需支持左卡尾归位。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：五个使用卡在原左栏改为两列，缩短左栏纵链，与真实解锁窗口和图注所在右栏平衡。 仅更改单页排版规格，不改定稿字句和素材文件。\n二次真实尺寸复验：左栏两列会把每卡正文挤长，已撤回该试法。实际采用左栏前三卡、右栏原插画/截图/图注，余下两卡整宽双列。横版图注移到第三卡后，与本屏已用手机语义次序一致；原文逐句和五卡条序不改。\n三次填图复验：前两卡与原插画/截图/图注成并排组，资料长说明整宽，再接末两卡双列，收掉右栏余下的360像素白；图注移动仍只改变视觉节点位置。",
   "requires_engine_support": [
    "五卡左编号",
    "末链接行归左卡尾"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "查一个密码"
    },
    {
     "type": "screenshot",
     "ratio": "994:669",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "开资料解锁期的窗口"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "放手让 AI 干一段"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 具体怎么说"
    }
   ],
   "notes": "严格按最新portrait及现v/v2：首张只标题+查密码/AI用key/私人资料三卡，全部正常36源像素，无人物或截图。第三卡后换v2：唯一截图及完整图注，然后皇冠卡、加密卡、底链接。源文字顺序需把图注移到第三卡后；v2既有内容保护，不重复截图，不增登记。",
   "pagination_hint": {
    "before_component": "screenshot",
    "preserve_parts": 2,
    "preserve_continuation": true
   },
   "requires_engine_support": [
    "固定换张且保护v2"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-02-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着一张卡片",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一个程序窗口伸手接过一把钥匙",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一个打开的文件夹旁边一只沙漏",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个没关的相机快门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一顶绿色小皇冠",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一个被锁链缠住的文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机验证现图小槽4比3",
   "source_phrase": "屏幕右侧约三分之一宽，上面留一个带细浅绿边框的空位（约 3:2，放“解锁个人资料”窗口截图），空位下面一行小字说明；空位上方画一小幅水彩插画：一个人坐在电脑前，旁边手机屏幕亮着一排小圆点。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一个人坐在电脑前，旁边手机屏幕亮着一排小圆点"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-health/personal-health-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

平时怎么用

**查一个密码**　打开开始菜单里的“密码中心”，搜名称、账号或用途，点“查看”或复制。刚验证过、还在有效期里就不再问；否则在窗口里选一种验证方式。比如我问“B 站账号是哪个”，AI 只按名称搜到那一条，在本机弹窗里给我看。

**AI 要用 key**　比如中文语音转写要把疑难录音送通义千问复核：它把请求交给密码中心，由密码中心带着 key 去调用，AI 收到去掉 key 的转写结果和状态；例子见亮点。

**AI 要用我的私人资料**　资料锁着时，AI 请我验证一次、填一个时长（默认值读密码中心的当前设置，9 月 29 日是 24 小时，程序出厂是 8 小时；可填 0.5–72 小时）。这段时间里本机、窗口和远程连电脑的 AI 共用这一个截止时间；说“锁定我的资料”随时结束。比如我说“解锁我的资料 4 小时”，验证一次后，AI 这 4 小时里就能翻我的记录来回答。人在外面时，手机打开〔授权与状态〕网页填动态码也能开；网页上另有两个不用登录的按钮“锁定个人资料”“锁屏 Windows”。

**私人文件夹跟着一起开关**　照片、视频、音乐、媒体和个人资料这五个文件夹，原来的路径像一扇门：资料锁着时门是关的，平常的程序、资源管理器按原路径打开会被挡在外面；验证开了资料期，五扇门原地打开，锁定或到期再关上，不用另外验证。这扇门只防“随手打开”：它不加密文件，已经打开着的文件不会被掐断，藏起来的真实目录、缓存和回收站也不归它管。10 月 11 日读到这套门已经启用、五个文件夹都登记了；每扇门开关的全过程这次没有重新实测。

**放手让 AI 干一段**　说“开无限制授权”，窗口里填时长、验证一次；这段时间里我的明确指令优先于 AI 自己的规则，见〔约法 L16〕。比如要搬一个大项目，开 6 小时，AI 一口气做完，中途不停下来等我确认。

**加密一个文件**　说“帮我加密这个文件”，它把点名的文件或文件夹加密成一个 .pcaf 文件夹，原件不动；以后解开、查看、修改都要验证本人。目前真用它加密过的，是手机 App 的发布签名钥匙。

开资料解锁期的窗口：填小时数、可同时开无限制授权（9 月 24 日截图）

跟 AI 具体怎么说：〔密码和验证技能〕　〔加密文件技能〕

::screen{#password-center-03 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-03",
  "section": "usage",
  "title": "桌面窗口",
  "scene": "左上标题。左边约六成宽留一个带细浅绿边框的空位（约 3:2，放真实窗口截图），空位下面一行小字说明。右边约四成宽，六条短说明竖着排，每条前面一个绿色小圆点编号 1–6，并用细虚线指向左边空位里对应的大致位置（1 指顶部两张状态卡，2 指搜索框，3 指分类标签，4 指每行右边的查看编辑删除，5 指右下角切换密码库，6 指左上第二个标签）。",
  "portrait": "竖版：截图空位在上、撑满宽度，说明小字紧跟其下；六条说明在截图下面一条一行，去掉指引虚线，只保留编号。",
  "links": [
   {
    "text": "电脑使用与性能记录",
    "href": "/projects/timeaudit/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/49f22ccc0f8bfadfe26abe5ee17c7ac47f01e954031736f98269aa4ec85c87ea.png",
    "where": "左边约六成宽的细边框空位；竖版在最上面撑满宽度",
    "caption": "真实窗口（9 月 24 日截图）：当时库里 331 条，这里筛的是 API 密钥；只显示名称，没有展开任何值",
    "crop_h": [
     54,
     264,
     1750,
     1203
    ],
    "crop_v": [
     51,
     338,
     851,
     785
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "桌面窗口"
    },
    {
     "type": "numbered_screenshot",
     "ratio": "1806:1213",
     "indices": [
      0
     ],
     "number_ref": "1顶上两张状态卡"
    },
    {
     "type": "numbered_steps",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "text_ref": "1顶上两张状态卡"
    },
    {
     "type": "prose",
     "text_ref": "真实窗口"
    }
   ],
   "notes": "Claude第5轮裁定：标题整宽居中；左60%唯一3:2浅色空截图位由网站填真实截图，槽外右缘列原1–6编号索引；右40%六条完整原编号说明单列。编号只索引说明，不代表截图内部位，不画引线或新增截图。原图注保留于截图下方。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：真实桌面截图45%、六个编号说明55%；编号说明改两列三行，图注仍保留原文顺序，避免图下方长空白。 仅更改单页排版规格，不改定稿字句和素材文件。\n三次填图复验：截图栏55%、编号说明45%双列三行，截图放宽后与说明高度更贴近；保持原字串和编号顺序。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "桌面窗口"
    },
    {
     "type": "screenshot",
     "ratio": "1806:1213",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "真实窗口"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "text_ref": "1顶上两张状态卡"
    }
   ],
   "notes": "一张：居中标题，满宽截图空槽、紧接图注、六整宽编号行。取消虚线，无图标、无额外插画。原图六说明各有淡绿细边行卡。",
   "continuation_images": []
  }
 },
 "images": [
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-1138f9144e7d2dc5f8e6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1138f9144e7d2dc5f8e6",
   "title_text": "桌面窗口",
   "sha256": "b6bd3d4666daf680001d08b9218db0c4b93371013f1c4e63eaa6461715dc742f",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

桌面窗口

1. 顶上两张状态卡：“个人资料”和“无限制授权”，各显示还剩几小时几分钟，旁边是“延长”和“锁定”或“结束”。
2. 搜索框：输名称、账号或用途，点“搜索”；“手机”按钮管绑定和撤销手机，“添加”新建条目。
3. 分类：全部、账号密码、API 密钥、银行卡、笔记、BitLocker，都在同一个库里。
4. 每条后面“查看、编辑、删除”；新建或编辑时可以“生成随机密码”，一次生成 32 位。
5. 右下“切换密码库”：打开 G、H 盘或别处的备份库。
6. 第二个标签“剪贴板历史”：看最近复制过的内容；数据归〔电脑使用与性能记录〕，资料锁着时不给看。

真实窗口（9 月 24 日截图）：当时库里 331 条，这里筛的是 API 密钥；只显示名称，没有展开任何值

::screen{#password-center-04 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-04",
  "section": "usage",
  "title": "确认是我本人",
  "scene": "左上标题。上半部分四张并排的竖长卡片，每张顶上一幅小水彩插画（1 一枚指纹叠在 Chrome 标志上；2 一部手机屏幕上一排小圆点和一个转圈的小时钟；3 一张画满细线的小纸条压在台灯下；4 Google 和微软两个标志并排），下面粗体标题和两行正文。下半部分一张五行两列的表格（左列事情，右列要不要验证；“不用”两行右列用浅绿底）。表格占左边约七成宽，右边约三成宽留一个带细浅绿边框的空位（约 8:5，放“选择验证方式”窗口截图），空位下面一行小字说明。表格下面一条细卡片放冷却和取消的说明。",
  "portrait": "竖版：四张因子卡两两一行；表格改成一行一条：粗体写事情，下面一行写要不要验证；截图空位和说明放在表格前面、撑满宽度；最下面的细卡片撑满宽度。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "约法 L17",
    "href": "/rules/charter/#L17"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/731e7cc8d9b6642b226658d6f59f2e9739338a911a6068afe5ba1da641b64778.png",
    "where": "表格右边约三成宽的 8:5 细边框空位；竖版在表格前撑满宽度",
    "caption": "四选一窗口（9 月 24 日截图）",
    "crop_h": [
     35,
     70,
     915,
     578
    ],
    "crop_v": [
     35,
     85,
     915,
     562
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "确认是我本人"
    },
    {
     "type": "content_card",
     "columns": 4,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "通行密钥"
    },
    {
     "type": "prose",
     "text_ref": "四种地位一样"
    },
    {
     "type": "table",
     "row": "verification",
     "width": "70%",
     "columns": 2,
     "text_ref": "这件事",
     "row_fit_illustration": true
    },
    {
     "type": "screenshot",
     "row": "verification",
     "width": "30%",
     "ratio": "8:5",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "row": "verification",
     "text_ref": "四选一窗口"
    },
    {
     "type": "notice",
     "illustration": "left_inside",
     "text_ref": "验证连错会冷却",
     "icons": [
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "章标题满宽居中；四因子等宽顶插画卡一排；说明独立窄行；下方左70%两列表五行/右30%8:5空截图及图注；冷却取消说明整宽窄卡在底。状态色只给语义点，不做整块状态着色。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "确认是我本人"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "通行密钥"
    },
    {
     "type": "notice",
     "text_ref": "四种地位一样"
    },
    {
     "type": "screenshot",
     "ratio": "8:5",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "四选一窗口"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "portrait_mode": "rows",
     "text_ref": "这件事"
    },
    {
     "type": "notice",
     "illustration": "left_inside",
     "text_ref": "验证连错会冷却",
     "icons": [
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "首张标题+四因子2×2顶图卡+地位说明；v2从唯一截图及图注开始，五行表改五整宽行卡，左图右事情/要不要验证，最底冷却说明。表头首次保持原字，重复需data-echo。截图前固定换张。",
   "pagination_hint": {
    "before_component": "screenshot",
    "preserve_parts": 2
   },
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-04-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "钥匙",
   "source_phrase": "通行密钥 用 Chrome 里的通行密钥（Passkey）验证。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "时钟",
   "source_phrase": "手机动态码 手机验证器上的 6 位码，每 30 秒换一次（TOTP）。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "恢复码 一串写下来收好的恢复码，完全不联网也能用。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "Google 或微软账号 登录当初登记的账号。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "验证连错会冷却（本机窗口和网页各算各的）：5分钟内错到第6次，停5分钟；冷却完再错，依次停15、30、60分钟……最长24小时。点“取消”只结束这一次，不会顺手锁资料，也不会自动换一种方式重来。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "验证连错会冷却（本机窗口和网页各算各的）：5分钟内错到第6次，停5分钟；冷却完再错，依次停15、30、60分钟……最长24小时。点“取消”只结束这一次，不会顺手锁资料，也不会自动换一种方式重来。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/指纹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "指纹",
   "source_phrase": "上半部分四张并排的竖长卡片，每张顶上一幅小水彩插画（1 一枚指纹叠在 Chrome 标志上；2 一部手机屏幕上一排小圆点和一个转圈的小时钟；3 一张画满细线的小纸条压在台灯下；4 Google 和微软两个标志并排），下面粗体标题和两行正文。",
   "sha256": "0508044582941f32db7b44c33fbe1171e0996f4f1c68f9521b8e2ba1ba97876f",
   "status": "ready",
   "original_elements": [
    "一枚指纹叠在 Chrome 标志上"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机验证现图小槽4比3",
   "source_phrase": "上半部分四张并排的竖长卡片，每张顶上一幅小水彩插画（1 一枚指纹叠在 Chrome 标志上；2 一部手机屏幕上一排小圆点和一个转圈的小时钟；3 一张画满细线的小纸条压在台灯下；4 Google 和微软两个标志并排），下面粗体标题和两行正文。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一部手机屏幕上一排小圆点和一个转圈的小时钟"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证码纸.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "验证码纸",
   "source_phrase": "上半部分四张并排的竖长卡片，每张顶上一幅小水彩插画（1 一枚指纹叠在 Chrome 标志上；2 一部手机屏幕上一排小圆点和一个转圈的小时钟；3 一张画满细线的小纸条压在台灯下；4 Google 和微软两个标志并排），下面粗体标题和两行正文。",
   "sha256": "bd4eda69465f07bad83182ac2761b2456d746bb31d62a1a112f1c6aef5ad85e3",
   "status": "ready",
   "original_elements": [
    "一张画满细线的小纸条压在台灯下"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-8b0c9dfb726d01da38a2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8b0c9dfb726d01da38a2",
   "title_text": "确认是我本人：四种方式任选一种",
   "sha256": "26c2c777152d4a46eb0384e761d20ced20dd0463a8def1014326e862b93d774e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

确认是我本人：四种方式任选一种

**通行密钥**　用 Chrome 里的通行密钥（Passkey）验证。
**手机动态码**　手机验证器上的 6 位码，每 30 秒换一次（TOTP）。
**恢复码**　一串写下来收好的恢复码，完全不联网也能用。
**Google 或微软账号**　登录当初登记的账号。

四种地位一样，丢了三种也还开得了，见“亮点”。

| 这件事 | 要不要验证 |
|---|---|
| 看状态、按名称搜条目 | 不用 |
| 桌面上的 Claude、Codex 取已登记的 key，存密码 | 不用，但要核对确实是登记过的桌面 AI，见〔用户授权〕 |
| 看一个密码、看全部磁盘恢复钥匙、改验证方式 | 无限制授权或资料解锁期还有效就不再问，否则选一种验证一次 |
| 开或延长资料解锁期、无限制授权 | 每次都真验证一次 |
| GitHub 删库、转移、改公开 | 开着无限制授权不问；只有资料解锁期不算数，见〔约法 L17〕 |

验证连错会冷却（本机窗口和网页各算各的）：5 分钟内错到第 6 次，停 5 分钟；冷却完再错，依次停 15、30、60 分钟……最长 24 小时。点“取消”只结束这一次，不会顺手锁资料，也不会自动换一种方式重来。

四选一窗口（9 月 24 日截图）

::screen{#password-center-05 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-05",
  "section": "usage",
  "title": "手机上也能用",
  "scene": "左上标题。左边约三分之一宽画一部竖着的小米手机水彩插画，屏幕上是 App 列表：顶部一排小圆角标签、下面几行条目，全部用灰色小横线代替，不画任何字。手机插画下面留一个带细浅绿边框的空位（约 8:5，放电脑上“手机”窗口的截图），空位下面一行小字说明。右边约三分之二宽：上面“绑定三步”画成三个带编号的小圆圈用箭头连起来（手机显示绑定码 → 电脑窗口里核对同一个码 → 手指按在手机指纹上）；中间两张横卡片“同步”“撤销”；最下面一行小字。",
  "portrait": "竖版：手机插画在标题下面居中；绑定三步改成竖排；两张卡片一张一行；截图空位和说明放在“撤销”卡片后面、撑满宽度。\n本轮仅指定本张排版恢复（其它分张原约定保护）：只本张竖版941×1760：白底绿色水彩。标题、导语、绑定三步、同步、撤销依原顺序整宽上下排；手机插画缩到导语旁的小图标，不占独立大块。正文按约36源像素正常字号，行距约44，净宽约860，不缩成微字。绑定三步各一个紧凑全宽行，小编号和箭头保留①②③。撤销卡后画一个整宽约860×529的纯白空框，979:602原比例，细浅绿边框，无任何模拟UI；下方完整原图注。手机根钥匙与重新绑定说明整宽排在本张底部。全字保留，不靠放大。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/6aae6c27829991092f7696c072feaaa087c15450a84a9600f9600235d3523236.png",
    "where": "左边手机插画下面的 8:5 细边框空位；竖版在“撤销”卡片后撑满宽度",
    "caption": "电脑上的“手机”窗口：绑定码（已遮住）、手机型号、状态三列（9 月 24 日截图）",
    "frame_bindings": {
     "v": {
      "54B5DC108DD08DE2ED787D01531805ABFC705BF903E3D3CCA84A804F193750E3": [
       30,
       2109,
       887,
       2635
      ]
     }
    },
    "crop_h": [
     25,
     72,
     955,
     588
    ],
    "crop_v": [
     25,
     30,
     955,
     597
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "phone_intro",
     "width": "30%",
     "align": "left",
     "size": "large",
     "text_ref": "手机上也能用"
    },
    {
     "type": "prose",
     "row": "phone_intro",
     "width": "70%",
     "text_ref": "安卓“密码中心”App"
    },
    {
     "type": "illustration",
     "row": "phone_body",
     "width": "30%",
     "illustration": "outside",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "row": "phone_body",
     "ratio": "979:602",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "row": "phone_body",
     "text_ref": "电脑上的“手机”窗口"
    },
    {
     "type": "flow",
     "row": "phone_body",
     "width": "70%",
     "columns": 3,
     "illustration": "above_card",
     "connector": "arrow",
     "text_ref": "绑定三步",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "content_card",
     "row": "phone_body",
     "columns": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/手机点桌面.png"
     ],
     "text_ref": "同步"
    },
    {
     "type": "notice",
     "row": "phone_body",
     "text_ref": "手机只拿到打开密码库"
    }
   ],
   "notes": "横图：左30%标题、手机卡外大插画、唯一截图空槽+图注；右70%导语、绑定三步一横排箭头连接、同步撤销二横卡、底手机根钥匙说明。流程内容是同一卡节点中的①②③，需按源片段拆三站，不补编号或文字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "手机上也能用"
    },
    {
     "type": "prose",
     "text_ref": "安卓“密码中心”App"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "layout_hint": "标题旁小图标，①②③紧凑全宽行",
     "text_ref": "绑定三步",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "同步"
    },
    {
     "type": "screenshot",
     "ratio": "979:602",
     "indices": [
      0
     ]
    },
    {
     "type": "prose",
     "text_ref": "电脑上的“手机”窗口"
    },
    {
     "type": "notice",
     "text_ref": "手机只拿到打开密码库"
    }
   ],
   "notes": "最新portrait覆盖旧大手机：本张941×1760，标题导语、绑定三步、同步、撤销上下排；插画缩为导语旁小图标，不占独立大块。撤销后860×529纯白截图槽，无模拟UI；完整图注紧接，末尾根钥匙说明。正文36、参考行高44、不缩字。实际放得下与否须出图核验，不能牺牲全字/字号。",
   "canvas_hint": {
    "width": 941,
    "height": 1760,
    "body_width": 860,
    "body_line_height": 44
   },
   "requires_engine_support": [
    "固定画布约定",
    "①②③源片段三行"
   ],
   "continuation_images": []
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/手机点桌面.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机点桌面",
   "source_phrase": "撤销 在“手机”里选中旧手机点“解除绑定”，整个库随之换钥匙，9 月 24 日真做过一次，见亮点。旧手机已经缓存的内容没法远程抹掉。",
   "sha256": "619cf0826fbe681d5a6ba825c5cd8caff76ae282f27a3fbde93602d3fa956fb1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "绑定三步①手机上发起绑定，显示一个绑定码②电脑窗口点“手机”，核对是同一个码，点“批准绑定”③回到手机，用指纹确认",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/手机验证通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手机验证通用构图",
   "source_phrase": "左边约三分之一宽画一部竖着的小米手机水彩插画，屏幕上是 App 列表：顶部一排小圆角标签、下面几行条目，全部用灰色小横线代替，不画任何字。",
   "sha256": "eefe0eb4077dfee27460fc768dc3990e85a2db8026d7168aa92ed89fff8654da",
   "status": "ready",
   "original_elements": [
    "左边约三分之一宽画一部竖着的小米手机水彩插画，屏幕上是 App 列表：顶部一排小圆角标签、下面几行条目，全部用灰色小横线代替，不画任何字"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-4bf60a8abe37f3192614.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4bf60a8abe37f3192614",
   "title_text": "手机上也能用",
   "sha256": "3e2c7e3e68d5c3af335f5a817e727003ec17d0ae4ec73ec4214617ee5ffced7f",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

手机上也能用

安卓“密码中心”App，1.0.6 版（9 月 23 日装到小米 15 Pro）：分类、搜索、查看、逐项复制、添加、修改、删除都有；离开 App 就关掉会话，清掉手机内存里的钥匙。

**绑定三步**　① 手机上发起绑定，显示一个绑定码　② 电脑窗口点“手机”，核对是同一个码，点“批准绑定”　③ 回到手机，用指纹确认

**同步**　两边改的东西都经私人 GitHub 上的加密恢复分支互相同步，每次整份提交、不强推。两边同时改了同一条，两份都留下、标成冲突，谁也不覆盖谁。断网时本地照样保存，显示“待同步”。

**撤销**　在“手机”里选中旧手机点“解除绑定”，整个库随之换钥匙，9 月 24 日真做过一次，见亮点。旧手机已经缓存的内容没法远程抹掉。

手机只拿到打开密码库的那把钥匙，拿不到四种本人验证背后的根钥匙；重装 App 或换手机都要重新绑定。

电脑上的“手机”窗口：绑定码（已遮住）、手机型号、状态三列（9 月 24 日截图）

::screen{#password-center-06 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-06",
  "section": "usage",
  "title": "电脑坏了、换电脑",
  "scene": "左上标题。左边约三分之二宽，六张小卡片两列三行，每张左上一个圆形编号和一个小图标（1 放大镜、2 一块外接硬盘插在笔记本上、3 一根被剪断的网线、4 手机、5 一朵云里的 GitHub 小猫标志、6 一个空保险箱）；卡片第一行粗体是情况，下面一行是怎么办。右边约三分之一宽一张竖长卡片“实测过”，上面画一台笔记本接着一块外接固态，屏幕上是密码中心窗口。",
  "portrait": "竖版：六张卡片一张一行；“实测过”卡片放在六张之后，插画缩小。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "电脑坏了、换电脑"
    },
    {
     "type": "numbered_steps",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "1**只是查一个密码"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/icons/手机电脑连接.png"
     ],
     "text_ref": "实测过",
     "width": "100%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "width": "100%",
     "text_ref": "查密码和整套恢复是两回事"
    }
   ],
   "notes": "左66%标题+六卡2列3行，卡左内小图和圆编号、右标题正文；右34%一竖长实测卡，上标题正文、下笔记本连外盘大插画。无丝带无箭头；bottom_inside非现core支持字段，不能改为卡顶。",
   "requires_engine_support": [
    "卡内底部插画"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "电脑坏了、换电脑"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "1**只是查一个密码"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/icons/手机电脑连接.png"
     ],
     "text_ref": "实测过"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "查密码和整套恢复是两回事"
    }
   ],
   "notes": "满宽居中标题；六卡各一行左图右文；末实测扁卡左标题正文/右较小笔记本插画，不采用独立大插画。无连接。",
   "requires_engine_support": [
    "卡内右插画"
   ],
   "continuation_images": []
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一块外接硬盘插在笔记本上",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断线",
   "source_phrase": "一根被剪断的网线",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "GitHub标志",
   "source_phrase": "一朵云里的 GitHub 小猫标志",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/保险箱.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "保险箱",
   "source_phrase": "一个空保险箱",
   "sha256": "baacc4cbdc7cafb6288f2b13ebc8132f8f9800fa156d3b11e3135a48fadc9efd",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机电脑连接",
   "source_phrase": "实测过 9 月 22 日，把 H 盘接到笔记本上，用手机动态码打开盘里的密码中心，取到系统镜像的密码；另外几种验证的实测见“亮点”。整台电脑怎么换机见〔电脑配置与恢复〕。",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-pcconfig.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "外接恢复现图小槽4比3",
   "source_phrase": "右边约三分之一宽一张竖长卡片“实测过”，上面画一台笔记本接着一块外接固态，屏幕上是密码中心窗口。",
   "sha256": "7f09f5188f01ade5bb16abf7509273982bf9be4037aa03f676f981ce804d4164",
   "status": "ready",
   "original_elements": [
    "笔记本接外接固态，屏幕是密码中心窗口；窗口只画绿色形状和浅灰短线"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e72be5c70de544e152ba.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e72be5c70de544e152ba",
   "title_text": "电脑坏了、换电脑",
   "sha256": "7a02fcd88edd7eaaf55b2683cb8528904319127dea9a30a15cb5d6a5e9068d42",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

电脑坏了、换电脑

1. **只是查一个密码**　打开平常的密码中心，搜索、查看或复制。
2. **电脑坏了或换新电脑**　接上 G 或 H，从盘根目录打开“密码中心.exe”；盘符变了也没关系。不用先登录 GitHub，也不用先登记这台电脑。
3. **要完全不联网**　用恢复码。另外三种还要各自的服务连得上：通行密钥要原来的凭据，动态码要验证服务，账号要能登录。
4. **手机还好好的**　直接在手机上查。
5. **手边没有备份盘**　从私人 GitHub 取回加密副本，补齐完整程序，再用一种验证方式打开；只登录 GitHub 本身打不开。
6. **副本或验证方式全丢了**　没有绕过验证的后门。先留着手头的盘、旧手机和密文，别重置、别覆盖。

**实测过**　9 月 22 日，把 H 盘接到笔记本上，用手机动态码打开盘里的密码中心，取到系统镜像的密码；另外几种验证的实测见“亮点”。整台电脑怎么换机见〔电脑配置与恢复〕。

**查密码和整套恢复是两回事**　上面第 2、3 条是“查密码”：G 或 H 盘上的完整程序包加一种验证，不联网也能打开密码库查看、复制。要让新电脑接管整套登记（登记新电脑和新的 AI、换新的设备钥匙、重新发布恢复副本），必须连得上私人 GitHub：先核对 GitHub 上最新的完整副本，G、H 上的副本只有和它是同一代时才拿来用或对照。GitHub 连不上时只能查密码，不能在新电脑上登记。这种整套恢复还没在真实的新电脑上跑过。

::screen{#password-center-07 section="usage"}

```typeset
{
 "screen": {
  "id": "password-center-07",
  "section": "usage",
  "title": "加密文件用哪一套",
  "scene": "左上标题。中间一张两列对比表（左列标题“密码中心的文件加密”配一只小保险柜图标，右列标题“本地加密库”配一把挂锁和一张写着密码的纸条图标），六行，行首是灰色小字的比较项。表格上方左右各一小幅水彩插画：左边一个文件夹被绿丝带捆着、丝带上挂四把小钥匙；右边一个密封的信封贴着一张密码纸条。表格下面两行说明。",
  "portrait": "竖版：对比表改成两张上下排的卡片，每张卡片里六行“比较项：内容”；两幅小插画各放在对应卡片的顶上；说明放最后。",
  "links": [
   {
    "text": "本地加密库",
    "href": "/projects/vault-tool/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "compare_top",
     "width": "43%",
     "align": "left",
     "size": "large",
     "text_ref": "加密文件用哪一套"
    },
    {
     "type": "illustration",
     "row": "compare_top",
     "width": "28%",
     "index": 0,
     "illustration": "outside",
     "size": "small"
    },
    {
     "type": "illustration",
     "row": "compare_top",
     "width": "29%",
     "index": 1,
     "illustration": "outside",
     "size": "small"
    },
    {
     "type": "table",
     "columns": 3,
     "portrait_mode": "columns",
     "text_ref": "密码中心的文件加密"
    },
    {
     "type": "notice",
     "text_ref": "两套钥匙完全分开"
    }
   ],
   "notes": "标题左43%，两幅卡外小插画分列上方；下整宽三列对照表：左灰比较项、右两方案，共六行；方案表头带小保险柜/信封图。底整宽说明卡。定稿首格为空，不补任何比较表总标题。",
   "requires_engine_support": [
    "方案表头小插画"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "加密文件用哪一套"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "portrait_mode": "columns",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "密码中心的文件加密"
    },
    {
     "type": "notice",
     "text_ref": "两套钥匙完全分开"
    }
   ],
   "notes": "居中标题；两个方案整宽外卡上下排，各顶图+方案名、卡内逐比较项。原v展示每方案前4项，v2展示两方案后2项再底说明；须保持全部6项，不根据旧图丢行。需表内按方案/行分张，不重复文字计G1；重复表头仅data-echo。",
   "pagination_hint": {
    "preserve_parts": 2,
    "table_first_rows": 4,
    "table_remaining_rows": 2
   },
   "requires_engine_support": [
    "对照表按方案卡且固定续图分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-07-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "锁文件夹",
   "source_phrase": "表格上方左右各一小幅水彩插画：左边一个文件夹被绿丝带捆着、丝带上挂四把小钥匙；右边一个密封的信封贴着一张密码纸条。",
   "sha256": "a17733ae031a32e99492ccd65da9b09418d912d572b6663f79b80a8a15b40607",
   "status": "ready",
   "original_elements": [
    "文件夹被绿色丝带捆着，丝带挂四把小钥匙"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/信封文件.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "信封文件",
   "source_phrase": "表格上方左右各一小幅水彩插画：左边一个文件夹被绿丝带捆着、丝带上挂四把小钥匙；右边一个密封的信封贴着一张密码纸条。",
   "sha256": "4c84d57aec93f5fa654626301c1df6fb7f3fa5364a34647567e2b7a89e1d4717",
   "status": "ready",
   "original_elements": [
    "密封信封旁贴纸条，只画纸条的浅灰短线，不画密码"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-51facc39d5321e15d968.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-51facc39d5321e15d968",
   "title_text": "加密文件用哪一套",
   "sha256": "d0efbcd33ee82054254eb683abdba4223213c44417959e89fe4989b6b6b1caa7",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

加密文件用哪一套

| | 密码中心的文件加密 | 本地加密库 |
|---|---|---|
| 怎么开锁 | 四种本人验证任选一种，不用另记密码 | 自己记住的密码，加上需要时的密钥文件 |
| 忘了怎么办 | 丢了一两种验证，用剩下的照样打开 | 密码或密钥文件丢了，就再也打不开 |
| 加密成什么 | 一个 .pcaf 文件夹，里面每个文件单独加密 | 一个 vault.enc 文件 |
| 钥匙放哪 | 一把小的加密根钥匙跟着密码中心的恢复副本走 | 只在我记住的密码和密钥文件里 |
| 放在哪 | 默认 E:\Documents\PasswordCenterEncryptedFiles，跟着文档每天备份到 G、再到 H | 放在 GitHub 的私人 Key 仓库 |
| 怎么用 | 跟 AI 说“帮我加密这个文件” | 跟 AI 说要用 vault.enc 或 Key 仓库，或自己在本机运行它的菜单 |

两套钥匙完全分开：不共用钥匙、不共用恢复材料，也不互相导入。两边都能交给 AI 办；没说用哪套时，“帮我加密这个文件”默认走密码中心（我 9 月 26 日定的）。本地加密库自己的细节见〔本地加密库〕。

::screen{#password-center-08 section="tech"}

```typeset
{
 "screen": {
  "id": "password-center-08",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "左上标题。上半部分一张从左到右的流程图：最左边竖着四个小入口卡片（开始菜单窗口、AI 调用的命令、手机 App、网页授权页），四条细线汇到中间一个大节点“Secret Broker”（画成一位戴绿帽子的门卫站在门口），门卫右边分出三条绿色箭头到三个节点（一本加锁的账本“KDBX 密码库”、一叠用丝带捆起来的文件夹“文件加密”、一只沙漏“资料解锁期和无限制授权”），三条再汇到最右边一个节点“恢复副本”（一朵云和两块硬盘）。下半部分左右两张卡片：左“用了什么”，右“和电脑配置库怎么分工”。",
  "portrait": "竖版：流程图改成从上到下；四个入口排成两行两个；下面两张卡片上下排。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "topology",
     "columns": 4,
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "入口：",
     "graph_icon_slots": [
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18
     ],
     "layout": "graph",
     "columns_v": 1,
     "graph_nodes": [
      {
       "id": "entries",
       "count": 1,
       "shape": "capsules",
       "split_delimiter": "｜",
       "prefix_end": "：",
       "part_columns": 1,
       "part_columns_v": 2,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1
      },
      {
       "id": "guard",
       "count": 1,
       "row": 1,
       "column": 2,
       "row_v": 2,
       "column_v": 1
      },
      {
       "id": "destinations",
       "count": 1,
       "shape": "capsules",
       "split_delimiter": "｜",
       "part_columns": 1,
       "part_columns_v": 1,
       "row": 1,
       "column": 3,
       "row_v": 3,
       "column_v": 1
      },
      {
       "id": "backup",
       "count": 1,
       "row": 1,
       "column": 4,
       "row_v": 4,
       "column_v": 1
      }
     ],
     "edges": [
      {
       "from": "entries:*",
       "to": "guard"
      },
      {
       "from": "guard",
       "to": "destinations:*"
      },
      {
       "from": "destinations:*",
       "to": "backup"
      }
     ]
    },
    {
     "type": "content_card",
     "row": "tech",
     "width": "49%",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用了什么"
    },
    {
     "type": "content_card",
     "row": "tech",
     "width": "51%",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "和电脑配置库怎么分工"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "width": "100%",
     "text_ref": "私人文件夹门牌"
    }
   ],
   "notes": "整宽居中章标题；上半四级左到右分支汇合拓扑，不简化四个整段卡：4入口→守门→3业务节点→恢复副本，三支保留。原图节点上的文字均从定稿入口及箭头段拆出，不再加“SecretBroker”等别字。下两等宽浅卡左图右清单。",
   "requires_engine_support": [
    "para竖线片段分支拓扑"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "topology",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "入口：",
     "graph_icon_slots": [
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27
     ],
     "layout": "graph",
     "graph_nodes": [
      {
       "id": "entries",
       "count": 1,
       "shape": "capsules",
       "split_delimiter": "｜",
       "prefix_end": "：",
       "part_columns": 1,
       "part_columns_v": 2,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1
      },
      {
       "id": "guard",
       "count": 1,
       "row": 1,
       "column": 2,
       "row_v": 2,
       "column_v": 1
      },
      {
       "id": "destinations",
       "count": 1,
       "shape": "capsules",
       "split_delimiter": "｜",
       "part_columns": 1,
       "part_columns_v": 1,
       "row": 1,
       "column": 3,
       "row_v": 3,
       "column_v": 1
      },
      {
       "id": "backup",
       "count": 1,
       "row": 1,
       "column": 4,
       "row_v": 4,
       "column_v": 1
      }
     ],
     "edges": [
      {
       "from": "entries:*",
       "to": "guard"
      },
      {
       "from": "guard",
       "to": "destinations:*"
      },
      {
       "from": "destinations:*",
       "to": "backup"
      }
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "用了什么"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "medium"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "和电脑配置库怎么分工"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "私人文件夹门牌"
    }
   ],
   "notes": "首张2×2入口、守门、三业务一排、恢复副本、用了什么整宽卡；第二张顶笔记本/硬盘卡外插画，下分工整宽卡。分工前插画不能取拓扑节点小图替代，需独立无字素材。",
   "pagination_hint": {
    "before": "和电脑配置库怎么分工",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "多支拓扑",
    "固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-08-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "入口：开始菜单里的窗口｜AI 调用的命令｜手机 App｜网页授权页",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "→ KDBX 密码库｜文件加密｜资料解锁期和无限制授权的状态",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "密码库是 KeePass 的 KDBX 格式（用 pykeepass 4.2.0 读写），密码、API 密钥、银行卡、笔记、BitLocker 都在这一个文件里；银行卡的卡号、有效期、安全码作为一整条一起存。",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "程序用 Python 3.14 和 PowerShell 7 写，窗口是 WinForms；手机 App 用 Kotlin，读写同一个 KDBX；手机端源码 9 月 29 日放进同一个私有仓库的 android 文件夹，和电脑端一起管版本，之前没有版本记录。",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "约 10.2 万行自有代码（Python 7.9 万行、PowerShell 2.2 万行），134 项登记测试，7 月 26 日起 389 次提交。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "密码中心管产品：密码、验证方式、手机协议、加密文件格式、恢复副本格式。",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "〔电脑配置与恢复〕管“装到这台电脑上”：装进受保护的 C:\\ProgramData\\PCConfig\\AuthorityHost、核对每个文件的哈希、每天的计划任务、复制到 G 和 H。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "key": "显示器",
   "source_phrase": "开始菜单里的窗口",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "key": "代码窗口",
   "source_phrase": "AI 调用的命令",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "key": "手机",
   "source_phrase": "手机 App",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "key": "盾牌",
   "source_phrase": "网页授权页",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "key": "身份盾牌",
   "source_phrase": "→SecretBroker（守门的程序：核对是谁、要什么、有没有授权；不对就停，不猜）",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/保险箱.png",
   "fallback": false,
   "key": "保险箱",
   "source_phrase": "KDBX 密码库",
   "sha256": "baacc4cbdc7cafb6288f2b13ebc8132f8f9800fa156d3b11e3135a48fadc9efd",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "文件加密",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "资料解锁期和无限制授权的状态",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 18,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "key": "纸箱对勾",
   "source_phrase": "→恢复副本：私人GitHub、G盘、H盘",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 19,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "key": "显示器",
   "source_phrase": "开始菜单里的窗口",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 20,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "key": "代码窗口",
   "source_phrase": "AI 调用的命令",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 21,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "key": "手机",
   "source_phrase": "手机 App",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 22,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "key": "盾牌",
   "source_phrase": "网页授权页",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 23,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "key": "身份盾牌",
   "source_phrase": "→SecretBroker（守门的程序：核对是谁、要什么、有没有授权；不对就停，不猜）",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 24,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/保险箱.png",
   "fallback": false,
   "key": "保险箱",
   "source_phrase": "KDBX 密码库",
   "sha256": "baacc4cbdc7cafb6288f2b13ebc8132f8f9800fa156d3b11e3135a48fadc9efd",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 25,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "文件加密",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 26,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "资料解锁期和无限制授权的状态",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 27,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "key": "纸箱对勾",
   "source_phrase": "→恢复副本：私人GitHub、G盘、H盘",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "左上标题。上半部分一张从左到右的流程图：最左边竖着四个小入口卡片（开始菜单窗口、AI 调用的命令、手机 App、网页授权页），四条细线汇到中间一个大节点“Secret Broker”（画成一位戴绿帽子的门卫站在门口），门卫右边分出三条绿色箭头到三个节点（一本加锁的账本“KDBX 密码库”、一叠用丝带捆起来的文件夹“文件加密”、一只沙漏“资料解锁期和无限制授权”），三条再汇到最右边一个节点“恢复副本”（一朵云和两块硬盘）。下半部分左右两张卡片：左“用了什么”，右“和电脑配置库怎么分工”。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

它是怎么搭的

入口：开始菜单里的窗口｜AI 调用的命令｜手机 App｜网页授权页
→ **Secret Broker**（守门的程序：核对是谁、要什么、有没有授权；不对就停，不猜）
→ KDBX 密码库｜文件加密｜资料解锁期和无限制授权的状态
→ 恢复副本：私人 GitHub、G 盘、H 盘

**用了什么**
- 密码库是 KeePass 的 KDBX 格式（用 pykeepass 4.2.0 读写），密码、API 密钥、银行卡、笔记、BitLocker 都在这一个文件里；银行卡的卡号、有效期、安全码作为一整条一起存。
- 程序用 Python 3.14 和 PowerShell 7 写，窗口是 WinForms；手机 App 用 Kotlin，读写同一个 KDBX；手机端源码 9 月 29 日放进同一个私有仓库的 android 文件夹，和电脑端一起管版本，之前没有版本记录。
- 约 11.1 万行自有代码（Python 8.7 万行、PowerShell 2.3 万行），137 项登记测试，7 月 26 日起 413 次提交。代码只数 .py/.ps1/.psm1/.mjs/.cs、不含随带的第三方库，手机端 Kotlin 另有约 0.6 万行没算进去；测试是登记条数（已知失败 0），不是这次重跑的结果；提交数含从电脑配置库迁来的历史。
- 现役安装：10 月 7 日 18:22（北京）装上的第 364 版，776 个文件，来自密码中心提交 968b9816、电脑配置提交 4804f7a4，两边都没有未提交的改动；这是安装清单自己的记录，不是这次逐个文件重新校验。

**和电脑配置库怎么分工**
- 密码中心管产品：密码、验证方式、手机协议、加密文件格式、恢复副本格式。
- 〔电脑配置与恢复〕管“装到这台电脑上”：装进受保护的 C:\ProgramData\PCConfig\AuthorityHost、核对每个文件的哈希、每天的计划任务、复制到 G 和 H。

**私人文件夹门牌**（docs/contracts/personal-storage.md）
- 分工：电脑配置库管五个文件夹的机器路径、同盘移位、安装、SYSTEM 宿主服务和备份；密码中心管唯一的资料期和门牌的执行接口。配置 pcconfig.personal-directory-gate.v1，五个 id 是 pictures、videos、music、media、personal_data，每个登记原路径、隐藏的真实目录和一个拒读占位，三者同盘。
- 开关法：原路径是 NTFS 目录联接。资料期变化时，Secret Broker 在同一把跨进程锁里先保存锁定或解锁结果，再把每个联接原地改指向真实目录或占位（同一个联接对象只改目标并回读，不删了重建）；联接原来指的不是登记的两个目录之一就不覆盖、报错。五个之间各自原子切换，不是一个文件系统事务。
- 宿主服务每 250 毫秒结算截止；服务停止先关门，服务重启沿用仍有效的原截止，到期关门。取消验证只结束那一次请求，已开的资料期和门都不动。
- 声明要用 personal_data 的调用（例如健康导入）除了查资料期，还读门牌的实际状态，开没开说不准就返回 storage_unavailable。
- 10 月 1 日 13:46 起用门牌替换了停用的卷控制；10 月 11 日读到运行配置 enabled=true、五根都在。逐根开关、到期、重启的全过程这次没有重跑，现状 Unknown。

::screen{#password-center-09 section="tech"}

```typeset
{
 "screen": {
  "id": "password-center-09",
  "section": "tech",
  "title": "钥匙一层套一层",
  "scene": "左上标题。左边约六成宽一张层级图：最上面并排四个小锁头（四种验证），四条线汇到中间一把大金色钥匙，旁边标“根钥匙”；根钥匙往下分三条：左支一把绿钥匙标“密码库钥匙”，指向一本加锁账本；中支一把蓝绿钥匙标“文件根钥匙”，往下再分出两层不标字的小钥匙和一串小方块；右支画一部手机，手机里一把小钥匙只连到“密码库钥匙”，旁边画一个红色小叉表示连不到根钥匙。右边约四成宽，五条竖排的小卡片讲每种验证怎么解开自己那一层。\n仅本横图：文件根钥匙下方明确连续上下两层无字小钥匙，再接分块；第一层代表每个.pcaf的包钥匙，第二层代表包内每个文件的钥匙。它们不画标签、不添加算法；不能用同层两把并列钥匙代替上下层。正确四种验证、根钥匙、密码库支路、手机关系及全部正文保持，右侧五条卡片不挤缩。",
  "portrait": "竖版：层级图在上撑满宽度；五条小卡片在下面一条一行。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "钥匙一层套一层"
    },
    {
     "type": "topology",
     "text_ref": "四种验证各自包着",
     "layout": "graph",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "size": "medium",
     "graph_nodes": [
      {
       "id": "root",
       "count": 1,
       "row": 1,
       "column": 1,
       "column_span": 2,
       "row_v": 1,
       "column_v": 1,
       "icon": "_library/icons/钥匙.png"
      },
      {
       "id": "library",
       "count": 1,
       "row": 2,
       "column": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/hires-icons/数据库.png"
      },
      {
       "id": "file-root",
       "count": 1,
       "row": 2,
       "column": 2,
       "row_v": 3,
       "column_v": 1,
       "icon": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png"
      },
      {
       "id": "phone",
       "count": 1,
       "row": 3,
       "column": 1,
       "column_span": 2,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
      }
     ],
     "edges": [
      {
       "from": "root",
       "to": "library",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "root",
       "to": "file-root",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "phone",
       "to": "library",
       "from_side": "top",
       "to_side": "bottom"
      }
     ]
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "每种验证怎么解开"
    },
    {
     "type": "flow",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/云图片.png",
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "text_ref": "通行密钥",
     "text_layout": "inline",
     "direction": "vertical",
     "columns_v": 1,
     "connector": "none"
    }
   ],
   "notes": "左60%标题/引言/三小解释卡/下钥匙层级图；右40%组标题与五小卡单列。图文字标签回显仅取定稿词、data-echo，不补图外字。按最新scene，文件根钥匙下明确连续上下两层小钥匙再接分块，不能并列替代。手机只能开密码库，保持红叉连接根不可达。 qa-11 接入组件回复：topology.text_layout:inline 已登记并消费，原卡名、冒号、正文同段，保持共享 name/body 字号。 qa-11 新同段接口真实浏览器产生 dg-name/dg-body 的 G3 重叠失败，已撤回本轮新增 inline 字段；前导冒号仍待组件修正，不回退已修图宽和明确绕线。",
   "requires_engine_support": [
    "无nodes拓扑语义图",
    "两层钥匙结构",
    "源词回显"
   ],
   "fix_notes": "qa-11第5项：原四种验证说明与三条钥匙说明明确分配至全宽topology graph；横2列、竖1列；不再使用未分配原文的空topology块；原文全部保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "钥匙一层套一层"
    },
    {
     "type": "topology",
     "text_ref": "四种验证各自包着",
     "layout": "graph",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "size": "medium",
     "graph_nodes": [
      {
       "id": "root",
       "count": 1,
       "row": 1,
       "column": 1,
       "column_span": 2,
       "row_v": 1,
       "column_v": 1,
       "icon": "_library/icons/钥匙.png"
      },
      {
       "id": "library",
       "count": 1,
       "row": 2,
       "column": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/hires-icons/数据库.png"
      },
      {
       "id": "file-root",
       "count": 1,
       "row": 2,
       "column": 2,
       "row_v": 3,
       "column_v": 1,
       "icon": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png"
      },
      {
       "id": "phone",
       "count": 1,
       "row": 3,
       "column": 1,
       "column_span": 2,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
      }
     ],
     "edges": [
      {
       "from": "root",
       "to": "library"
      },
      {
       "from": "root",
       "to": "file-root",
       "return": true,
       "offset": 36,
       "from_side": "left",
       "to_side": "left"
      },
      {
       "from": "phone",
       "to": "library",
       "return": true,
       "offset": 72,
       "from_side": "left",
       "to_side": "left"
      }
     ]
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "每种验证怎么解开"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/云图片.png",
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png"
     ],
     "text_ref": "通行密钥",
     "text_layout": "inline",
     "direction": "vertical",
     "connector": "none"
    }
   ],
   "notes": "现v最上层级图、其下大标题和三解释卡；v2五因子小卡左图右文，各一行，首卡原图组名与第一条共卡。按实际图标题在插画之后；不搬到图前。续图五卡前换张。 qa-11 第二轮视觉修复：单列中心直线会误看为连续向下链，根→文件根与手机→密码库改为已有 return 回连字段，左侧不同36/72px路由，保留根的分支和手机回指。 qa-11 接入组件回复：topology.text_layout:inline 已登记并消费，原卡名、冒号、正文同段，保持共享 name/body 字号。 qa-11 新同段接口真实浏览器产生 dg-name/dg-body 的 G3 重叠失败，已撤回本轮新增 inline 字段；前导冒号仍待组件修正，不回退已修图宽和明确绕线。",
   "pagination_hint": {
    "before": "每种验证怎么解开",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "无nodes拓扑",
    "固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-09-v2.png"
   ],
   "fix_notes": "qa-11第5项：原四种验证说明与三条钥匙说明明确分配至全宽topology graph；横2列、竖1列；不再使用未分配原文的空topology块；原文全部保留。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "密码库钥匙：真正打开 KDBX 的是一把单独的随机钥匙，由根钥匙用 AES-256-GCM 包着（HKDF-SHA256 派生）。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "文件根钥匙：加密文件另有一把随机根钥匙；每个 .pcaf 一把包钥匙，包里每个文件再一把钥匙，按 4 MiB 分块用 AES-256-GCM 加密。",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "手机：手机在 Android Keystore 里生成一把导不出来的 RSA-3072 私钥，电脑用它的公钥只包住“密码库钥匙”。所以撤销一台手机只换这一把密码库钥匙，四种验证不用重来（真实经过见亮点）。",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "通行密钥：WebAuthn 的 PRF 扩展从通行密钥算出 32 字节，解开它那份封装。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "手机动态码：换了电脑时，由一个独立的验证服务（Cloudflare Worker）核对 6 位码，再用这台电脑临时生成的 RSA-3072 公钥加密送回。这个验证服务另有自己的一套限制，只管它：15 分钟错 5 次就冷却 15 分钟，24 小时最多错 20 次。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "恢复码 ：在本机直接解，不联网。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云图片.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云图片",
   "source_phrase": "Google 或微软账号 ：登录后，从 Google 云盘或 OneDrive 的应用专用文件夹取回一份加密材料。",
   "sha256": "57a4f020cb6007e67f4e17abbdd16d6585d8f2182143db3e6268739016385514",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "纸箱对勾",
   "source_phrase": "本机免密开库 ：用 Windows 的 DPAPI 把开库材料绑在这台电脑的我的账户上，日常开库和自动备份不用每次验证；它不算第五种验证。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9a27c27cd770156f2f09.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9a27c27cd770156f2f09",
   "title_text": "钥匙一层套一层",
   "sha256": "ebcdffaf83be86b144de792ff36eb0ee7a260cd21fb3d434c1b65fb72963af40",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

钥匙一层套一层

四种验证各自包着同一把根钥匙；根钥匙再包住下面几把：
- **密码库钥匙**：真正打开 KDBX 的是一把单独的随机钥匙，由根钥匙用 AES-256-GCM 包着（HKDF-SHA256 派生）。
- **文件根钥匙**：加密文件另有一把随机根钥匙；每个 .pcaf 一把包钥匙，包里每个文件再一把钥匙，按 4 MiB 分块用 AES-256-GCM 加密。
- **手机**：手机在 Android Keystore 里生成一把导不出来的 RSA-3072 私钥，电脑用它的公钥只包住“密码库钥匙”。所以撤销一台手机只换这一把密码库钥匙，四种验证不用重来（真实经过见亮点）。

每种验证怎么解开自己那一层：
- **通行密钥**：WebAuthn 的 PRF 扩展从通行密钥算出 32 字节，解开它那份封装。
- **手机动态码**：换了电脑时，由一个独立的验证服务（Cloudflare Worker）核对 6 位码，再用这台电脑临时生成的 RSA-3072 公钥加密送回。这个验证服务另有自己的一套限制，只管它：15 分钟错 5 次就冷却 15 分钟，24 小时最多错 20 次。
- **恢复码**：在本机直接解，不联网。
- **Google 或微软账号**：登录后，从 Google 云盘或 OneDrive 的应用专用文件夹取回一份加密材料。
- **本机免密开库**：用 Windows 的 DPAPI 把开库材料绑在这台电脑的我的账户上，日常开库和自动备份不用每次验证；它不算第五种验证。

::screen{#password-center-10 section="tech"}

```typeset
{
 "screen": {
  "id": "password-center-10",
  "section": "tech",
  "title": "恢复副本和同步",
  "scene": "左上标题。中间一张示意图：左边一个大纸箱标“恢复副本”，箱子里露出七八张不写字的小标签；右边三个目的地竖排：一朵云里的 GitHub 小猫（私人 GitHub 分支）、机箱里的一根固态（G 盘）、一块外接固态连着线（H 盘），三条绿色箭头从纸箱指过去，G、H 旁边各画一个小小的“密码中心.exe”图标。下面两张横卡片：“怎么保证不坏”“手机和电脑怎么同步”。最下面一行数字小字。",
  "portrait": "竖版：纸箱在上，三个目的地在下面一行一个；两张卡片上下排；数字行放最后。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "recovery-head",
     "width": "78%",
     "align": "center",
     "size": "large",
     "text_ref": "恢复副本和同步",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "recovery-head",
     "width": "22%",
     "illustration": "outside",
     "size": "small",
     "align": "right",
     "target_height": 220
    },
    {
     "type": "topology",
     "text_ref": "每存一次",
     "layout": "graph",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "size": "medium",
     "graph_nodes": [
      {
       "id": "bundle",
       "count": 1,
       "row": 1,
       "column": 1,
       "icon": "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png",
       "column_span": 3
      },
      {
       "id": "github",
       "count": 1,
       "row": 2,
       "column": 1,
       "icon": "_library/icons/云.png",
       "align_self": "stretch"
      },
      {
       "id": "g-drive",
       "count": 1,
       "row": 2,
       "column": 2,
       "icon": "_library/hires-icons/数据库.png",
       "align_self": "stretch"
      },
      {
       "id": "h-drive",
       "count": 1,
       "row": 2,
       "column": 3,
       "icon": "_library/hires-icons/数据库.png",
       "align_self": "stretch",
       "row_note_from": "9 月 29 日起",
       "row_note_row": 3
      },
      {
       "id": "portable",
       "count": 1,
       "shape": "context",
       "row": 4,
       "column": 1,
       "column_span": 3
      }
     ],
     "edges": [
      {
       "from": "bundle",
       "to": "github",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "bundle",
       "to": "g-drive",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "bundle",
       "to": "h-drive",
       "from_side": "bottom",
       "to_side": "top"
      }
     ]
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "怎么保证不坏"
    },
    {
     "type": "notice",
     "text_ref": "截至10月1"
    }
   ],
   "notes": "左35%标题介绍与备份清单，中31%卡外恢复纸箱，右34%三个目的地卡竖排，箭头由纸箱分出；下两横卡一排左图右文；最底整宽数字说明窄条。目的地名和程序名只可定稿词回显，禁止重复伪字。 qa-11 接入组件回复：topology.text_layout:inline 已登记并消费，原卡名、冒号、正文同段，保持共享 name/body 字号。 qa-11 新同段接口真实浏览器产生 dg-name/dg-body 的 G3 重叠失败，已撤回本轮新增 inline 字段；前导冒号仍待组件修正，不回退已修图宽和明确绕线。",
   "requires_engine_support": [
    "跨列箭头",
    "无nodes目的地拓扑"
   ],
   "fix_notes": "旧topology没有分配原文，改用已有显式graph接口：恢复整包说明在左，私人GitHub/G/H三原节点在右纵列；末程序包说明完整保留。原插画移标题行，原文和素材库不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "恢复副本和同步"
    },
    {
     "type": "prose",
     "text_ref": "每存一次"
    },
    {
     "type": "illustration",
     "illustration": "right_inside",
     "size": "small"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": "auto",
     "text_ref": "私人 GitHub"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "bottom_inside",
     "text_ref": "怎么保证不坏",
     "size": "medium",
     "split_cards": true,
     "illustrations": [
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/版本循环文件.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "截至10月1"
    }
   ],
   "notes": "以批准10-v+现v2：第一张顶大恢复说明外卡（左标题正文、右纸箱），然后GitHub/G/H三卡一列右插画；第四条G/H程序包说明并入H卡内，不另造第四目的地卡。v2两大卡上下，顶标题正文、下大插画，底数字条。不得在资料中已有普通H盘字样上新增状态字。",
   "pagination_hint": {
    "before": "怎么保证不坏",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "bullet末条并入H卡",
    "外卡包含标题介绍旁图",
    "卡内右/底插画"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-10-v2.png"
   ],
   "fix_notes": "底部两张卡改用已有source_text_card bottom_inside与显式illustrations接口；两卡标题/正文原序保留，图仍在各自卡内底部。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "私人 GitHub：电脑配置库的私人分支 secret-broker-backup，每次整份提交。",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "G 盘：自动写入，留最近 14 天。",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "H 盘：从 G 复制已核对过的副本。9 月 29 日起接进〔电脑配置与恢复〕每天的外接盘同步，回执分别写 G、H 上最新一份的日期；接上后还没自然跑过，H 仍停在 9 月 24 日，待验收。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "G、H 根目录各放一份完整的“密码中心.exe”程序包，接到任何 Windows 电脑都能直接打开。",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "左上标题。中间一张示意图：左边一个大纸箱标“恢复副本”，箱子里露出七八张不写字的小标签；右边三个目的地竖排：一朵云里的 GitHub 小猫（私人 GitHub 分支）、机箱里的一根固态（G 盘）、一块外接固态连着线（H 盘），三条绿色箭头从纸箱指过去，G、H 旁边各画一个小小的“密码中心.exe”图标。下面两张横卡片：“怎么保证不坏”“手机和电脑怎么同步”。最下面一行数字小字。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-b8399041990297fbf73e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b8399041990297fbf73e",
   "title_text": "恢复副本和同步",
   "sha256": "faa901f3982e956f9e670c5aaa1612c44c4d92792e7e09196c7064e55dab6de0",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

恢复副本和同步

每存一次，密码中心就打包一整份恢复副本：加密的密码库、四种验证各自的封装、文件根钥匙的封装、手机设备清单和同步记录，不含任何明文。

- **私人 GitHub**：电脑配置库的私人分支 secret-broker-backup，每次整份提交。
- **G 盘**：自动写入，留最近 14 天。
- **H 盘**：从 G 复制已核对过的副本。9 月 29 日起接进〔电脑配置与恢复〕每天的外接盘同步，回执分别写 G、H 上最新一份的日期；9 月 30 日 H 已追平 G。10 月 10 日 17:34（北京）那次每日冷备的回执是“完成”：G、私人 GitHub、H 上的副本和 H 的“最新”指针都读回核对过，共 16 个文件，不含明文。
- G、H 根目录各放一份完整的“密码中心.exe”程序包，接到任何 Windows 电脑都能直接打开。

**怎么保证不坏**　先写到同一块盘的临时目录，逐个文件核对哈希，最后才切换“最新”指针；中途失败，旧的原封不动。恢复时只补缺的、或者和原来完全一致的条目，对不上就停，不会用旧盘复活已经删掉的条目。

**手机和电脑怎么同步**　两边都从“上次共同确认的那一份”出发改，提交时要求 GitHub 上还是那一份，否则先拉下来合并；两边同时改的同一条两份都留。关窗时后台还在同步，会先提示“正在同步，稍等一下再关”，最多等 3 分钟；这一条刚装好，还没在真实使用里验过。

截至 10 月 12 日：G、H 上各有 61 份恢复副本，最新一份都是 9 月 28 日 07:20 存的（同一份，之后没有更新的副本）。G、H 根目录指向同一个现役程序包，G 上有 2218 个文件；它是最近一次批准的程序包，不随源码一更新就自动换新。

::screen{#password-center-11 section="tech"}

```typeset
{
 "screen": {
  "id": "password-center-11",
  "section": "tech",
  "title": "AI 用 key 和认出是谁",
  "scene": "左上标题。左半边一张小流程图：一个程序窗口伸手 → 门卫（Secret Broker）核对一张身份卡（上面画一条家谱似的进程链，最上面是 Claude 和 Codex 的标志）→ 从门卫分出两条路：上路一个密封的小管道把钥匙递给“传话程序”，传话程序连到三个厂商小标志（通义千问、智谱、DeepSeek）；下路一把钥匙直接放进四个小程序窗口里；AI 的对话气泡在最上方，里面只有一个绿色对勾。右半边上下两块：“认出是谁”和“为什么这样设计”（四张小卡片两两一行）。",
  "portrait": "竖版：流程图在上改成竖排；“认出是谁”一块，接着四张小卡片一张一行。",
  "links": [
   {
    "text": "AI 工具配置管理",
    "href": "/projects/ai-cli-profile-manager/"
   },
   {
    "text": "约法 L14",
    "href": "/rules/charter/#L14"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "AI 用 key，却看不见 key"
    },
    {
     "type": "prose",
     "text_ref": "登记了 5 个"
    },
    {
     "type": "comparison",
     "columns": 2,
     "illustration": "left_inside",
     "text_ref": "4 个由密码中心替程序调用厂商",
     "columns_v": 1,
     "image_mode": "group",
     "groups": [
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "group_images": [
      "_library/icons/代码窗口.png",
      "_library/icons/笔记本电脑.png"
     ],
     "group_image_source": "icons"
    },
    {
     "type": "prose",
     "text_ref": "另一条路"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "认出是谁"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "numbered_steps",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png"
     ],
     "text_ref": "1**秘密不进"
    }
   ],
   "notes": "实际h左约60%标题、无字链路图、3/4两条横卡、另有链接小字；右约40%认出是谁卡、组名、四原则单列（原图并非scene所写2×2，按图）。保持请求到身份再分两路，AI气泡只勾。3/4两个源stats不是数字主卡，需当解释卡。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：四条设计原则改为两列两行、原图标在卡内左侧，避免顶部小图下的短正文把整宽卡撑出右侧大白。 仅更改单页排版规格，不改定稿字句和素材文件。",
   "requires_engine_support": [
    "stats作为解释卡",
    "无nodes链路拓扑"
   ],
   "fix_notes": "qa-11第4项：移除没有文字或asset的独立topology空块；两种交法交comparison逐组卡，标题使用共有name字号，横2张全宽、竖单列；其余说明独立全宽。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "AI 用 key，却看不见 key"
    },
    {
     "type": "prose",
     "text_ref": "登记了 5 个"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "4 个由密码中心替程序调用厂商",
     "image_mode": "group",
     "groups": [
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "group_images": [
      "_library/icons/代码窗口.png",
      "_library/icons/笔记本电脑.png"
     ],
     "group_image_source": "icons"
    },
    {
     "type": "prose",
     "text_ref": "另一条路"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": "auto",
     "text_ref": "认出是谁"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png"
     ],
     "text_ref": "1**秘密不进"
    }
   ],
   "notes": "第一张图在标题之前，下3/4两说明卡、另有小字；第二张认出是谁右大图卡、组名、四原则各一行，左标题正文右图。组名不重复绘制章节标题。",
   "pagination_hint": {
    "before": "认出是谁",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "stats解释卡",
    "右内插画",
    "固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-11-v2.png"
   ],
   "fix_notes": "qa-11第4项：移除没有文字或asset的独立topology空块；两种交法交comparison逐组卡，标题使用共有name字号，横2张全宽、竖单列；其余说明独立全宽。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "3 个走传话程序（中文语音转写的疑难录音复核、智谱 GLM、DeepSeek）：调用方把准备好的请求交给密码中心，它核对调用者、把请求文件的哈希绑定到这一次，再把 key 通过标准输入交给一个固定的“传话程序”；传话程序只连这家厂商的官方地址、校验证书、不走代理、不跟随跳转，写回的结果先去掉 key。调用方和 AI 都拿不到 key。这条路 9 月 28 日 07:06 装上，当天就用真实请求走通，见亮点。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "4 个放进程序自己的环境（高德出行查询、GitHub 账号读取、Google 健康数据导入、学习用的百炼转发）：核对是登记过的程序后，把 key 放进它运行时的环境变量里，程序用完即走，AI 的对话里看不到值。",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "秘密不进 AI 的对话。　密码、key、恢复码不进聊天、日志和命令输出；要看只在本机窗口里给我看。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "拿不准就停。　认不出调用者、对不上目标、回读不一致，一律当失败，不猜着放行。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "回读对上才算成功。　每次改动先写候选、再加密写入、读回核对、更新恢复副本，任何一步不对就退回原样。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双屏同步",
   "source_phrase": "不防自己的设备。  明文窗口允许截屏和远程串流，复制的内容可以经小米妙享到手机，见〔约法 L14〕。",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "红色警示",
   "source_phrase": "拿不准就停。  认不出调用者、对不上目标、回读不一致，一律当失败，不猜着放行。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "回读对上才算成功。  每次改动先写候选、再加密写入、读回核对、更新恢复副本，任何一步不对就退回原样。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9893e6d0fc6dfc342d0f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9893e6d0fc6dfc342d0f",
   "title_text": "AI 用 key，却看不见 key",
   "sha256": "3c05c5553aa603d8ef98c81031ca2ca1f7befc30bdbee346ea70461bbf2a9c14",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

AI 用 key，却看不见 key

登记了 5 个取用目标（原来登记的 GitHub 账号读取、学习用的百炼转发两个，现在的登记里已经没有），分两种交法：
- **4 个由密码中心替程序调用厂商**（高德出行查询、中文语音转写的疑难录音复核用的通义千问、智谱 GLM、DeepSeek）：调用方把准备好的请求交给密码中心，它核对调用者、把请求文件的哈希绑定到这一次，再把 key 通过标准输入交给一个固定的“传话程序”；传话程序只连这家厂商登记的官方地址、校验证书、不走代理、不跟随跳转，写回的结果先去掉 key。调用方和 AI 都拿不到 key。这条路 9 月 28 日 07:06 装上，当天就用真实请求走通，见亮点。高德要求 key 放在网址参数里，10 月 7 日起也由传话程序代办（GET 请求、key 加在查询参数上、不发认证头），高德 key 不再交给出行查询程序本身。
- **1 个发临时票**（Google 健康数据导入）：密码中心用自己保管的长期授权向 Google 换一张只读的临时通行票（access token），最长 1 小时，连同实际到期时间放进导入程序的环境变量；能换新票的长期材料（refresh token）不交出去，Google 回的权限只要不全是只读就拒绝。它是唯一可以不经桌面 AI、凭这台电脑登记过的受信设备材料换票的目标，但换票前照样查资料期，资料锁着就不发票。这是 10 月 7 日装上的源码和安装事实，这次没有真的去换票或读健康数据。
**另一条路：AI 工具自己用厂商 key**　〔AI 工具配置管理〕让 Codex 桌面版用千问、GLM、DeepSeek 时，经本机管道把 key 交给 Codex 本身；在普通终端里用命令行版要显式加 -NativeClient，凭这台电脑登记过的受信设备材料取 key（不冒充桌面 AI、不开资料期或无限制授权，缺材料或已撤销就明确报错，不悄悄退回旧办法），再由 AI 工具配置管理放进实际客户端的环境变量。这条路会把 key 明文交给当前 Windows 账户里调用链上的程序，不是“只有桌面 AI 才能取”的隔离：只撤销桌面版 Claude 或 Codex 的受信身份挡不住它，要停就撤销受信设备或删掉厂商登记；已经交出去的 key 收不回来。高德不走这条路。

**认出是谁**　只有登记过的 Claude 桌面版和 Codex 桌面版算“受信任的 AI”（上面健康临时票和命令行厂商 key 凭的是受信设备材料，不算受信任的 AI）。认法是现场沿着调用程序的父进程一路往上查：在我的 Windows 账户里，而且能追到这两个桌面应用本体。进程名字、环境变量、管理员权限、模型自己怎么说，都不算数。

**为什么这样设计**
1. **秘密不进 AI 的对话。**　密码、key、恢复码不进聊天、日志和命令输出；要看只在本机窗口里给我看。
2. **拿不准就停。**　认不出调用者、对不上目标、回读不一致，一律当失败，不猜着放行。
3. **回读对上才算成功。**　每次改动先写候选、再加密写入、读回核对、更新恢复副本，任何一步不对就退回原样。
4. **不防自己的设备。**　明文窗口允许截屏和远程串流，复制的内容可以经小米妙享到手机，见〔约法 L14〕。

::screen{#password-center-12 section="highlights"}

```typeset
{
 "screen": {
  "id": "password-center-12",
  "section": "highlights",
  "title": "亮点",
  "scene": "左上标题。上面三张大卡片横排（和照片视频录音管理页的“亮点”一样），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一个钥匙环上四把钥匙，其中三把淡成虚线，剩下一把照样插进锁孔；2 一个程序窗口从一只手里接过钥匙，旁边一个对话气泡里是转写结果的短线和一个对勾；3 三部画成虚线的旧手机被划掉，一把新钥匙递给一部实线的新手机。下面整行，“小巧思”小标题下面四张横向圆角卡片两两一行，每张左边一个小水彩图标（一个被轻轻放下的“取消”按钮、一根断开的网线旁边一把完好的钥匙、一张表格被划掉一半、一个剪贴板上贴着“不进历史”的小标签），右边粗体一句加两行小字。",
  "portrait": "竖版：三张大卡片上下排，插画在每张卡片上方；“小巧思”四张卡片在下面一张一行。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 3,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "丢了三种验证"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "小巧思"
    },
    {
     "type": "numbered_steps",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/icons/断线.png",
      "_library/icons/钥匙.png",
      "_library/icons/云.png"
     ],
     "text_ref": "1**取消只算"
    }
   ],
   "notes": "大标题满宽居中；上3大卡一排，图卡顶内/标题正文其下；小巧思组名左；下四扁横卡2×2左图右文。不要把group+para拆成无外卡的标题和正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "丢了三种验证"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "小巧思"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "text_ref": "1**取消只算"
    }
   ],
   "notes": "三亮点大卡一列顶图内，v放前两张，v2开始第三张（旧图第三张未显示大图，仍以原图为准）；小巧思下4纯文字行卡一列。小巧思不补未出现图标。需在第三group节点前固定分张。",
   "pagination_hint": {
    "before": "撤掉一台手机",
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "连续group第三卡分张",
    "按项控制插画"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-12-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个被轻轻放下的“取消”按钮",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断线",
   "source_phrase": "一根断开的网线旁边一把完好的钥匙",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一张表格被划掉一半",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个剪贴板上贴着“不进历史”的小标签",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "断线",
   "source_phrase": "断网不等于密码坏了。  网络错、超时、限流、服务端故障都分开记，只有厂商明确说认证失败才改这条 key 的状态，免得把好好的 key 误判作废。",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "钥匙",
   "source_phrase": "浏览器密码表，少了的不删。  导入 Chrome 导出的密码表时，表里没有的条目只进“待复核”，不会被删；加密写入、回读、备份都成功后，才删掉那份明文表。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云",
   "source_phrase": "复制不进剪贴板历史。  复制密码时带上 Windows 的专用标记，不进 Win+V 历史、不传微软云剪贴板；每次写入后立刻读回确认。",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-cb31464c772622.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-cb31464c772622",
   "source_phrase": "插画：1 一个钥匙环上四把钥匙，其中三把淡成虚线，剩下一把照样插进锁孔；2 一个程序窗口从一只手里接过钥匙，旁边一个对话气泡里是转写结果的短线和一个对勾；3 三部画成虚线的旧手机被划掉，一把新钥匙递给一部实线的新手机。",
   "sha256": "74ecdc848999a961fb98b4350f51806007342d222281697e569bdb65df78f685",
   "status": "ready",
   "original_elements": [
    "一个钥匙环上四把钥匙，其中三把淡成虚线，剩下一把照样插进锁孔"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-085bf9d2ce6c0b.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-085bf9d2ce6c0b",
   "source_phrase": "插画：1 一个钥匙环上四把钥匙，其中三把淡成虚线，剩下一把照样插进锁孔；2 一个程序窗口从一只手里接过钥匙，旁边一个对话气泡里是转写结果的短线和一个对勾；3 三部画成虚线的旧手机被划掉，一把新钥匙递给一部实线的新手机。",
   "sha256": "b94ecc4093ee2189196d281e4cad1901ecb2735dc5b381679292928b6597692a",
   "status": "ready",
   "original_elements": [
    "一个程序窗口从一只手里接过钥匙，旁边一个对话气泡里是转写结果的短线和一个对勾"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机验证现图小槽4比3",
   "source_phrase": "插画：1 一个钥匙环上四把钥匙，其中三把淡成虚线，剩下一把照样插进锁孔；2 一个程序窗口从一只手里接过钥匙，旁边一个对话气泡里是转写结果的短线和一个对勾；3 三部画成虚线的旧手机被划掉，一把新钥匙递给一部实线的新手机。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "三部画成虚线的旧手机被划掉，一把新钥匙递给一部实线的新手机"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

亮点

**丢了三种验证，也还开得了。**
四种本人验证地位一样，任何一种都能打开密码库、再重新登记另外三种。9 月 22 日在笔记本上，手机动态码、通行密钥、Google、微软四种都实际打开过盘里的密码中心。这样一来，手机丢了、账号被锁、恢复码找不到，只要还剩一种就不算完。

**AI 用 key，却看不见 key。**
开头那件事的全貌：9 月 28 日 07:06 按厂商登记 key 装好后，AI 没让我动手，自己用命令行把 GLM-5.3、GLM-5.3-flash、千问 3.8、DeepSeek flash 各试一次，又送一段公开的合成语音给千问识别，全部通过；随后我自己的 Codex 桌面用 GLM-5.3-flash 也正常回复。每家厂商只登记一把 key，换模型、换项目不用再复制；key 只由密码中心交给传话程序或 Codex 本身，AI 收到去掉 key 的转写结果和状态。

**撤掉一台手机，整个库换一把钥匙。**
只把手机标成“已撤销”不够：它手里的钥匙还能开库。9 月 24 日凌晨，电脑上积着 3 个同名的旧 Xiaomi 身份。01:13 先让手机重新发起绑定、在电脑上核对绑定码批准，02:03 前后撤掉 3 个旧身份：密码中心生成新的密码库钥匙、整库重新加密，只给留下的这台发了新封装，它下次同步自动换上，不用再绑一次。

小巧思

1. **取消只算这一次。**　规矩见“确认是我本人”那一屏；这样设计是因为不然我随手关一个验证窗口，已经开着的资料期和授权就被连带锁上，AI 全停。
2. **断网不等于密码坏了。**　网络错、超时、限流、服务端故障都分开记，只有厂商明确说认证失败才改这条 key 的状态，免得把好好的 key 误判作废。
3. **浏览器密码表，以完整导出为准。**　我明确说以一份完整的 Chrome 导出表为准时，库里“浏览器导入”这一类旧的 Google、Edge 导入条目整类原子替换成这张表，别的类别一条不动；同一网址加用户名算一条，密码为空的行不算。加密写入、备份和条数读回都对上后，才删掉那份明文表。旧的增量导入入口只为兼容留着，不再用来更新浏览器密码。
4. **复制不进剪贴板历史。**　复制密码时带上 Windows 的专用标记，不进 Win+V 历史、不传微软云剪贴板；每次写入后立刻读回确认。

::screen{#password-center-13 section="features"}

```typeset
{
 "screen": {
  "id": "password-center-13",
  "section": "features",
  "title": "全部功能（1/4）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张，其余不变；图例在第一张顶上折成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-vault",
    "text": "密码库日常"
   },
   {
    "id": "f-search",
    "text": "搜索条目"
   },
   {
    "id": "f-view",
    "text": "查看条目"
   },
   {
    "id": "f-add",
    "text": "添加条目"
   },
   {
    "id": "f-edit",
    "text": "编辑条目"
   },
   {
    "id": "f-delete",
    "text": "删除条目"
   },
   {
    "id": "f-random",
    "text": "生成随机密码"
   },
   {
    "id": "f-copy",
    "text": "复制"
   },
   {
    "id": "f-types",
    "text": "五类条目"
   },
   {
    "id": "f-clipboard-tab",
    "text": "剪贴板历史标签"
   },
   {
    "id": "g-programs",
    "text": "给程序用 key"
   },
   {
    "id": "f-agent-secretref",
    "text": "把 key 交给登记的程序"
   },
   {
    "id": "f-vendor-keys",
    "text": "按厂商登记 key"
   },
   {
    "id": "f-native-delivery",
    "text": "给 Codex 交 key"
   },
   {
    "id": "f-reveal",
    "text": "让 AI 弹一个密码给我看"
   },
   {
    "id": "f-import-browser",
    "text": "导入浏览器密码"
   },
   {
    "id": "f-source-check",
    "text": "核对凭据来源"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "password-center-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "features_intro",
     "width": "55%",
     "align": "left",
     "size": "large",
     "text_ref": "全部功能",
     "row_fit_illustration": true
    },
    {
     "type": "status_legend",
     "row": "features_intro",
     "text_ref": "图例："
    },
    {
     "type": "prose",
     "row": "features_intro",
     "text_ref": "待验收＝"
    },
    {
     "type": "illustration",
     "row": "features_intro",
     "width": "45%",
     "illustration": "outside",
     "size": "medium"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "密码库日常"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "1搜索条目"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "给程序用 key"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "10把 key"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。13-h以批准替代图，右上独立大插画，标题占左半保持左对齐。13-v在给程序用key组名前换张。",
   "pagination_hint": {},
   "requires_engine_support": [
    "按原图功能编号/状态点"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": null,
     "width": null,
     "align": "center",
     "size": "large",
     "text_ref": "全部功能"
    },
    {
     "type": "status_legend",
     "row": null,
     "text_ref": "图例："
    },
    {
     "type": "prose",
     "row": null,
     "text_ref": "待验收＝"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "密码库日常"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "1搜索条目"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "给程序用 key"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "10把 key"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。13-h以批准替代图，右上独立大插画，标题占左半保持左对齐。13-v在给程序用key组名前换张。",
   "pagination_hint": {
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "按原图功能编号/状态点",
    "竖版按组内条目固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-13-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "搜索条目｜按名称、账号或用途找到要用的那一条｜在用",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "查看条目｜忘了账号信息时，在本机窗口看完整内容｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "添加条目｜新账号、key、银行卡、笔记都加密存进同一个库｜在用",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "编辑条目｜密码或备注变了，直接改原来那一条｜在用",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "删除条目｜不再用的账号从库里拿掉，历史加密副本仍保留｜在用",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "生成随机密码｜设新密码时一次生成 32 位，不用自己编｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "复制｜把账号或密码复制去粘贴，不进剪贴板历史｜在用",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "五类条目｜账号密码、API 密钥、银行卡、笔记、BitLocker 同在一个 KDBX｜在用",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "剪贴板历史标签｜同一个窗口里看最近复制过的内容｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "把 key 交给登记的程序｜登记过的程序要调用服务时，key 直接交给程序｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "按厂商登记 key｜通义千问、智谱 GLM、DeepSeek 各登记一把，换模型换项目不用重登｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "给 Codex 交 key｜AI 工具配置管理让 Codex 用厂商 key 时，经本机管道交过去｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "让 AI 弹一个密码给我看｜说出要哪一条，AI 在本机弹窗显示，值不经过 AI｜在用",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "导入浏览器密码｜Chrome 导出的整张密码表收进库，表里少的不删｜在用",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核对凭据来源｜同一个账号存了几份时，查清哪份有效｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-54596e57810a000930ac.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-54596e57810a000930ac",
   "title_text": "全部功能（57 项）",
   "sha256": "98b8dfb367f8b1c8fad62e8f09bb1e2fedee9da37931420da166836e51021260",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（57 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
待验收＝装好了，等真用一次核对；说不准＝用了不一定留下记录，记录里也没找到。

**密码库日常**
1. 搜索条目｜按名称、账号或用途找到要用的那一条｜在用
2. 查看条目｜忘了账号信息时，在本机窗口看完整内容｜在用
3. 添加条目｜新账号、key、银行卡、笔记都加密存进同一个库｜在用
4. 编辑条目｜密码或备注变了，直接改原来那一条｜在用
5. 删除条目｜不再用的账号从库里拿掉，历史加密副本仍保留｜在用
6. 生成随机密码｜设新密码时一次生成 32 位，不用自己编｜说不准
7. 复制｜把账号或密码复制去粘贴，不进剪贴板历史｜在用
8. 五类条目｜账号密码、API 密钥、银行卡、笔记、BitLocker 同在一个 KDBX｜在用
9. 剪贴板历史标签｜同一个窗口里看最近复制过的内容｜在用

**给程序用 key**
10. 把 key 交给登记的程序｜登记过的程序要调用服务时，由密码中心带着 key 替它调用厂商；健康导入只拿最长 1 小时的只读临时票｜在用
11. 按厂商登记 key｜高德、通义千问、智谱 GLM、DeepSeek 各登记一把，换模型换项目不用重登；高德只走中心代办｜在用
12. 给 Codex 交 key｜AI 工具配置管理让 Codex 用千问、GLM、DeepSeek 时，经本机管道交过去；普通终端命令行版加 -NativeClient 凭受信设备材料取，撤销桌面 AI 挡不住这条路｜在用
13. 让 AI 弹一个密码给我看｜说出要哪一条，AI 在本机弹窗显示，值不经过 AI｜在用
14. 导入浏览器密码｜以一份完整的 Chrome 导出表为准，整类替换“浏览器导入”里旧的 Google/Edge 导入，别的类别不动｜在用
15. 核对凭据来源｜同一个账号存了几份时，查清哪份有效｜说不准

::screen{#password-center-14 section="features"}

```typeset
{
 "screen": {
  "id": "password-center-14",
  "section": "features",
  "title": "全部功能（2/4）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张，其余不变；图例在第一张顶上折成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-identity",
    "text": "本人验证和授权"
   },
   {
    "id": "f-four-factors",
    "text": "四选一验证"
   },
   {
    "id": "f-cooldown",
    "text": "验证冷却"
   },
   {
    "id": "f-trusted-ai",
    "text": "认出桌面 AI"
   },
   {
    "id": "f-local-unlock",
    "text": "本机免密开库"
   },
   {
    "id": "f-data-lease",
    "text": "资料解锁期"
   },
   {
    "id": "f-data-lock",
    "text": "锁定资料"
   },
   {
    "id": "f-takeover",
    "text": "限时无限制授权"
   },
   {
    "id": "f-web-access",
    "text": "网页上办授权"
   },
   {
    "id": "f-web-lock",
    "text": "网页一键减权"
   },
   {
    "id": "f-github-verify",
    "text": "GitHub 重大动作验证"
   },
   {
    "id": "g-files",
    "text": "加密文件",
    "locator_instances": {
     "h": {
      "input_sha256": "897e651b54cf720a353c1d66fd9ca266742a6ea8b03d490b875a13530f18499c",
      "instances": [
       {
        "context_text": "加密文件",
        "context_rect": [
         22,
         568,
         287,
         639
        ],
        "expected_rect": [
         22,
         568,
         287,
         639
        ]
       }
      ]
     }
    }
   },
   {
    "id": "f-file-encrypt",
    "text": "加密文件",
    "locator_text": {
     "h": "26. 加密文件",
     "v": "26. 加密文件"
    }
   },
   {
    "id": "f-file-verify",
    "text": "核验加密文件"
   },
   {
    "id": "f-file-decrypt",
    "text": "解开加密文件"
   },
   {
    "id": "f-file-view",
    "text": "查看加密文件"
   },
   {
    "id": "f-file-edit",
    "text": "修改加密文件"
   },
   {
    "id": "f-file-resume",
    "text": "中断接着加密"
   },
   {
    "id": "f-file-newpc",
    "text": "新电脑上解开"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "password-center-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "本人验证和授权"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "16四选一验证"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "加密文件"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "26加密文件"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。14-v前张16–23，续张24–25后加密26–32，需要连续steps按条目8处分张。",
   "pagination_hint": {},
   "requires_engine_support": [
    "按原图功能编号/状态点"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "本人验证和授权"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "16四选一验证"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "加密文件"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "26加密文件"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。14-v前张16–23，续张24–25后加密26–32，需要连续steps按条目8处分张。",
   "pagination_hint": {
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "按原图功能编号/状态点",
    "竖版按组内条目固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-14-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "四选一验证｜通行密钥、手机动态码、恢复码、账号任选一种｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "验证冷却｜连错 6 次停 5 分钟，再错逐级加长到 24 小时｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显示器",
   "source_phrase": "认出桌面 AI｜只认我账户里、由 Claude 或 Codex 桌面版启动的程序｜在用",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "本机免密开库｜日常开库和自动备份不用每次验证｜在用",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "资料解锁期｜验证一次，一段时间内 AI 可以用私人资料｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "锁定资料｜不想让 AI 再用私人资料时立刻结束｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "限时无限制授权｜我定的时间里，我的明确指令优先于 AI 自己的规则｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "网页上办授权｜人在外面时在网页填动态码，开资料期或无限制授权｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "网页一键减权｜网页上不用登录就能按“锁定个人资料”“锁屏 Windows”，只能减权，不能解锁或拿秘密｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "GitHub 重大动作验证｜删库、转移、改公开前验证一次｜说不准",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "加密文件｜把点名的文件或文件夹加密成 .pcaf，原件不动｜在用",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核验加密文件｜不解出原文，确认加密包没坏｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "解开加密文件｜解到指定文件夹，已有的同名文件不覆盖｜说不准",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "查看加密文件｜只在本机窗口看包里一个文本文件｜说不准",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "修改加密文件｜改包里一个文本文件，另存成新包，原包保留｜说不准",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "中断接着加密｜大批文件加密到一半断了，核对后接着做｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "新电脑上解开｜带齐完整程序、匹配的恢复副本和 .pcaf，验证本人后在新电脑解开｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  }
 ]
}
```

**本人验证和授权**
16. 四选一验证｜通行密钥、手机动态码、恢复码、账号任选一种｜在用
17. 验证冷却｜连错 6 次停 5 分钟，再错逐级加长到 24 小时｜在用
18. 认出桌面 AI｜只认我账户里、由 Claude 或 Codex 桌面版启动的程序｜在用
19. 本机免密开库｜日常开库和自动备份不用每次验证｜在用
20. 资料解锁期｜验证一次，一段时间内 AI 可以用私人资料｜在用
21. 锁定资料｜不想让 AI 再用私人资料时立刻结束｜在用
22. 限时无限制授权｜我定的时间里，我的明确指令优先于 AI 自己的规则｜在用
23. 网页上办授权｜人在外面时在网页填动态码，开资料期或无限制授权｜待验收
24. 网页一键减权｜网页上不用登录就能按“锁定个人资料”“锁屏 Windows”，只能减权，不能解锁或拿秘密｜待验收
25. GitHub 重大动作验证｜删库、转移、改公开前验证一次｜说不准

**加密文件**
26. 加密文件｜把点名的文件或文件夹加密成 .pcaf，原件不动｜在用
27. 核验加密文件｜不解出原文，确认加密包没坏｜说不准
28. 解开加密文件｜解到指定文件夹，已有的同名文件不覆盖｜说不准
29. 查看加密文件｜只在本机窗口看包里一个文本文件｜说不准
30. 修改加密文件｜改包里一个文本文件，另存成新包，原包保留｜说不准
31. 中断接着加密｜大批文件加密到一半断了，核对后接着做｜说不准
32. 新电脑上解开｜带齐完整程序、匹配的恢复副本和 .pcaf，验证本人后在新电脑解开｜说不准

::screen{#password-center-15 section="features"}

```typeset
{
 "screen": {
  "id": "password-center-15",
  "section": "features",
  "title": "全部功能（3/4）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张，其余不变；图例在第一张顶上折成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-phone",
    "text": "手机"
   },
   {
    "id": "f-phone-app",
    "text": "手机 App"
   },
   {
    "id": "f-phone-bind",
    "text": "绑定手机"
   },
   {
    "id": "f-phone-revoke",
    "text": "撤销手机"
   },
   {
    "id": "f-phone-sync",
    "text": "手机和电脑互相同步"
   },
   {
    "id": "g-recovery",
    "text": "备份和恢复"
   },
   {
    "id": "f-recovery-set",
    "text": "自动加密恢复副本"
   },
   {
    "id": "f-cold-h",
    "text": "恢复副本冷备到 H"
   },
   {
    "id": "f-standalone",
    "text": "盘上的完整程序包"
   },
   {
    "id": "f-open-backup",
    "text": "打开备用密码库"
   },
   {
    "id": "f-new-device",
    "text": "新电脑整套恢复"
   },
   {
    "id": "f-sync-status",
    "text": "分清保存和同步"
   },
   {
    "id": "f-close-wait",
    "text": "关窗等同步"
   },
   {
    "id": "f-program-update",
    "text": "程序包自动更新"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "password-center-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "手机"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "33手机 App"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "备份和恢复"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "37自动加密恢复副本"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。15-v顶有卡外手机电脑双向箭头插画，手机组下4卡；v2从备份和恢复开始。",
   "pagination_hint": {},
   "requires_engine_support": [
    "按原图功能编号/状态点"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "medium"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "手机"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "33手机 App"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "备份和恢复"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "37自动加密恢复副本"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。15-v顶有卡外手机电脑双向箭头插画，手机组下4卡；v2从备份和恢复开始。",
   "pagination_hint": {
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "按原图功能编号/状态点",
    "竖版按组内条目固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-15-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "手机 App｜手机上分类、搜索、查看、复制、增改删｜在用",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "绑定手机｜由电脑核对绑定码、批准这台手机｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "撤销手机｜换手机或不用了，收回旧手机的钥匙｜在用",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "手机和电脑互相同步｜两边改的都同步过来，冲突两份都留｜待验收",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "自动加密恢复副本｜每次保存都整份加密备份到私人 GitHub 和 G 盘｜在用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "恢复副本冷备到 H｜每天随外接盘同步，把 G 上核对过的副本复制到 H；9 月 29 日接上，等自然运行追平｜待验收",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "盘上的完整程序包｜G、H 根目录各一份“密码中心.exe”，拿到别的电脑直接开｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "打开备用密码库｜原电脑用不了时，打开一份完整的加密副本｜在用",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "新电脑整套恢复｜从私人 GitHub 取回并登记新电脑、新的 AI｜说不准",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "分清保存和同步｜断网时分得清是只存在本机，还是已经同步｜在用",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "关窗等同步｜关窗时还在同步，先等最多 3 分钟｜待验收",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "程序包自动更新｜批准的新版本自动更新到 E、G；H 随冷备更新｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready"
  }
 ]
}
```

**手机**
33. 手机 App｜手机上分类、搜索、查看、复制、增改删｜在用
34. 绑定手机｜由电脑核对绑定码、批准这台手机｜在用
35. 撤销手机｜换手机或不用了，收回旧手机的钥匙｜在用
36. 手机和电脑互相同步｜两边改的都同步过来，冲突两份都留｜待验收

**备份和恢复**
37. 自动加密恢复副本｜每次保存都整份加密备份到私人 GitHub 和 G 盘｜在用
38. 恢复副本冷备到 H｜每天随外接盘同步，把 G 上核对过的副本复制到 H；9 月 29 日接上，9 月 30 日追平｜在用
39. 盘上的完整程序包｜G、H 根目录各一份“密码中心.exe”，拿到别的电脑直接开｜在用
40. 打开备用密码库｜原电脑用不了时，打开一份完整的加密副本｜在用
41. 新电脑整套恢复｜从私人 GitHub 取回并登记新电脑、新的 AI｜说不准
42. 分清保存和同步｜断网时分得清是只存在本机，还是已经同步｜在用
43. 关窗等同步｜关窗时还在同步，先等最多 3 分钟｜待验收
44. 程序包自动更新｜批准的新版本自动更新到 E、G；H 随冷备更新｜在用

::screen{#password-center-16 section="features"}

```typeset
{
 "screen": {
  "id": "password-center-16",
  "section": "features",
  "title": "全部功能（4/4）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。四张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，后三张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张，其余不变；图例在第一张顶上折成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-bitlocker",
    "text": "磁盘恢复钥匙"
   },
   {
    "id": "f-bitlocker-view",
    "text": "看全部磁盘恢复钥匙"
   },
   {
    "id": "f-bitlocker-intake",
    "text": "录入恢复钥匙"
   },
   {
    "id": "f-bitlocker-coverage",
    "text": "检查钥匙备齐没"
   },
   {
    "id": "g-upkeep",
    "text": "自查"
   },
   {
    "id": "f-daily-check",
    "text": "每天自查"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-retired-autofill",
    "text": "AI 代填网页登录"
   },
   {
    "id": "f-retired-disklock",
    "text": "起疑就锁盘"
   },
   {
    "id": "f-retired-masked",
    "text": "遮住的复制面板"
   },
   {
    "id": "f-retired-clipclean",
    "text": "30 分钟清剪贴板"
   },
   {
    "id": "f-retired-carrier",
    "text": "登记式恢复载体"
   },
   {
    "id": "f-retired-coregoal",
    "text": "目标登记（CoreGoal）"
   },
   {
    "id": "f-retired-ticket",
    "text": "重大动作票据"
   },
   {
    "id": "f-retired-invite",
    "text": "设备邀请"
   },
   {
    "id": "f-retired-openclaw",
    "text": "OpenClaw 专用代码"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "password-center-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "磁盘恢复钥匙"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "45看全部磁盘恢复钥匙"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "自查"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "48每天自查"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "49AI 代填网页登录"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。16-v首张45–54，v2只55–57，需要已停用steps第7项前分张，不重复大组名。",
   "pagination_hint": {},
   "requires_engine_support": [
    "按原图功能编号/状态点"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "磁盘恢复钥匙"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "45看全部磁盘恢复钥匙"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "自查"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "48每天自查"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "49AI 代填网页登录"
    }
   ],
   "notes": "13–16接成同一功能网格，仅13有总标题和图例；组名全宽跨组上方左对齐，卡左小插画/编号功能名及一句话，右上状态点，状态词必须以定稿承接而不多加字。横版每组3列（16自查唯一卡整宽），竖版1列。上下不画额外全段外边框。16-v首张45–54，v2只55–57，需要已停用steps第7项前分张，不重复大组名。",
   "pagination_hint": {
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "按原图功能编号/状态点",
    "竖版按组内条目固定分张"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-16-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "看全部磁盘恢复钥匙｜硬盘要恢复时，在本机窗口看各盘的恢复钥匙｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "录入恢复钥匙｜新盘加密后，把它的恢复钥匙存进库｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "检查钥匙备齐没｜只看每块盘的恢复钥匙存了没有，不显示钥匙｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "每天自查｜每天 18:17 查登记齐不齐、来源有没有更新，顺带更新程序包｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "AI 代填网页登录｜Chrome 扩展和本机通道替 AI 填密码；9 月 27 日撤掉，登录由我自己来｜已停用",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "起疑就锁盘｜觉得不对就锁 BitLocker；9 月 26 日整套删掉｜已停用",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "遮住的复制面板｜只能复制、看不到内容的面板；9 月 25 日删掉｜已停用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "分钟清剪贴板｜复制后 30 分钟自动清掉；9 月 25 日取消｜已停用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "登记式恢复载体｜每块备份盘先登记才能用；9 月 26 日退役，现在盘符随便变｜已停用",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "目标登记（CoreGoal）｜动手前先登记一个无人值守目标才放行；9 月 25 日退役｜已停用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "重大动作票据｜GitHub 重大动作先开 30 秒能力票据、两段式提案；9 月 27 日删掉，改成直接验证一次｜已停用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "设备邀请｜10 分钟有效的新设备邀请；9 月 26 日退役｜已停用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "OpenClaw 专用代码｜给已冻结的 OpenClaw 取 key 的专用分支；9 月 27 日后删掉，凭据留作普通条目｜已停用",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  }
 ]
}
```

**磁盘恢复钥匙**
45. 看全部磁盘恢复钥匙｜硬盘要恢复时，在本机窗口看各盘的恢复钥匙｜在用
46. 录入恢复钥匙｜新盘加密后，把它的恢复钥匙存进库｜说不准
47. 检查钥匙备齐没｜只看每块盘的恢复钥匙存了没有，不显示钥匙｜在用

**自查**
48. 每天自查｜每天 18:17 查登记齐不齐、来源有没有更新，顺带更新程序包｜在用

**已停用**
49. AI 代填网页登录｜Chrome 扩展和本机通道替 AI 填密码；9 月 27 日撤掉，登录由我自己来｜已停用
50. 起疑就锁盘｜觉得不对就锁 BitLocker；9 月 26 日整套删掉｜已停用
51. 遮住的复制面板｜只能复制、看不到内容的面板；9 月 25 日删掉｜已停用
52. 30 分钟清剪贴板｜复制后 30 分钟自动清掉；9 月 25 日取消｜已停用
53. 登记式恢复载体｜每块备份盘先登记才能用；9 月 26 日退役，现在盘符随便变｜已停用
54. 目标登记（CoreGoal）｜动手前先登记一个无人值守目标才放行；9 月 25 日退役｜已停用
55. 重大动作票据｜GitHub 重大动作先开 30 秒能力票据、两段式提案；9 月 27 日删掉，改成直接验证一次｜已停用
56. 设备邀请｜10 分钟有效的新设备邀请；9 月 26 日退役｜已停用
57. OpenClaw 专用代码｜给已冻结的 OpenClaw 取 key 的专用分支；9 月 27 日后删掉，凭据留作普通条目｜已停用

::screen{#password-center-17 section="history"}

```typeset
{
 "screen": {
  "id": "password-center-17",
  "section": "history",
  "title": "演进",
  "scene": "一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字；9 月 25–27 日那个节点旁边画一把剪刀，表示拆掉的东西。右侧留一幅大一点的水彩插画：一只小保险柜从电脑机箱里被搬出来，放到自己的小桌子上，旁边一部手机和两块硬盘。",
  "portrait": "竖版：时间线撑满宽度，插画缩小放在最上面。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进",
     "row": "history-head",
     "width": "78%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "small",
     "row": "history-head",
     "width": "22%",
     "align": "right",
     "target_height": 220
    },
    {
     "type": "timeline",
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "line",
     "text_ref": "7 月 26–28 日",
     "direction": "vertical",
     "columns": 2,
     "width": "100%",
     "text_layout": "inline"
    },
    {
     "type": "notice",
     "text_ref": "截至 9 月 28 日"
    }
   ],
   "notes": "左60%标题+10节点竖时间线，细直线绿圆点，节点内左小图右日期正文；右40%卡外大保险柜搬出插画，右下提交数字小卡。9月25–27剪刀图只在对应节点。dates解析成stats，timeline需按num作日期、text作正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "small",
     "align": "center",
     "target_height": 360
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "line",
     "text_ref": "7 月 26–28 日",
     "direction": "vertical",
     "text_layout": "inline"
    },
    {
     "type": "notice",
     "text_ref": "截至 9 月 28 日"
    }
   ],
   "notes": "现竖图首行左演进标题/右卡外保险柜搬出图；其下时间线整宽，v放前6节点，v2放最后4节点及提交数字。续张节点纯字无插画，沿左连续竖线绿圆点。不可把日期当统计大数字。",
   "pagination_hint": {
    "after_timeline_item": 6,
    "preserve_parts": 2
   },
   "requires_engine_support": [
    "timeline按节点固定分张",
    "续张去节点图"
   ],
   "continuation_images": [
    "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\password-center\\img\\password-center-17-v2.png"
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "7 月 26–28 日：在电脑配置库里起步：守门的 Secret Broker、KDBX 密码库、加密恢复副本。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "7 月底–8 月：加了一大套自我防护：起疑就锁盘、重大动作要开票据、五种验证下限、无人值守的目标登记（CoreGoal）。",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "8 月 30 日：第一版便携密码中心，能离开这台电脑单独打开。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "9 月 10 日：加密文件可以在本机窗口里查看、修改。",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "9 月 14–20 日：资料解锁期、限时无限制授权、四选一验证统一成一个窗口。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "9 月 21–23 日：独立密码库窗口；手机正式接入同一个库；9 月 22 日笔记本离线实测；Chrome 密码表整批导入。",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 25–26 日：接入 Claude 桌面版，和 Codex 一样算受信任的 AI。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/硬盘循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "硬盘循环",
   "source_phrase": "9 月 25–27 日：按我的决定拆掉：起疑锁盘、目标登记、重大动作票据、登记式恢复载体、遮住的复制面板、30 分钟清剪贴板、AI 代填网页登录。",
   "sha256": "0684abe6ca8acb20d34fd7053f7feb74499d5651e267a8c28a352779b689b5b9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "9 月 28 日：00:42 拆成独立的私人仓库，电脑配置库只留安装和机器接线；07:06 起 API key 按厂商登记。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "9 月 29 日：手机端源码放进同一个私有仓库；H 盘的恢复副本接进每天的外接盘同步（待验收）。",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-password-center",
   "source_phrase": "右侧留一幅大一点的水彩插画：一只小保险柜从电脑机箱里被搬出来，放到自己的小桌子上，旁边一部手机和两块硬盘。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一只小保险柜从电脑机箱里被搬出来，放到自己的小桌子上，旁边一部手机和两块硬盘"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-f8367a4ec7c3aa408a9e.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

演进

- **7 月 26–28 日**：在电脑配置库里起步：守门的 Secret Broker、KDBX 密码库、加密恢复副本。
- **7 月底–8 月**：加了一大套自我防护：起疑就锁盘、重大动作要开票据、五种验证下限、无人值守的目标登记（CoreGoal）。
- **8 月 30 日**：第一版便携密码中心，能离开这台电脑单独打开。
- **9 月 10 日**：加密文件可以在本机窗口里查看、修改。
- **9 月 14–20 日**：资料解锁期、限时无限制授权、四选一验证统一成一个窗口。
- **9 月 21–23 日**：独立密码库窗口；手机正式接入同一个库；9 月 22 日笔记本离线实测；Chrome 密码表整批导入。
- **9 月 25–26 日**：接入 Claude 桌面版，和 Codex 一样算受信任的 AI。
- **9 月 25–27 日**：按我的决定拆掉：起疑锁盘、目标登记、重大动作票据、登记式恢复载体、遮住的复制面板、30 分钟清剪贴板、AI 代填网页登录。
- **9 月 28 日**：00:42 拆成独立的私人仓库，电脑配置库只留安装和机器接线；07:06 起 API key 按厂商登记。
- **9 月 29 日**：手机端源码放进同一个私有仓库；H 盘的恢复副本接进每天的外接盘同步，9 月 30 日追平。
- **10 月 1 日**：资料期接上五个私人文件夹的门牌，替换停用的卷控制。
- **10 月 7 日**：高德改由密码中心代办；健康导入改发最长 1 小时的只读临时票，只有它能不经桌面 AI 换票，资料锁照样挡。

截至 9 月 28 日共 389 次提交；到 10 月 11 日共 413 次（都含从电脑配置库迁来的历史）。
