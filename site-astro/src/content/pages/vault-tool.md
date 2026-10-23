---
{
 "title": "本地加密库",
 "kind": "project",
 "url": "/projects/vault-tool/",
 "tagline": "用自己记住的密码，把选中的文件锁进一个加密包",
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
  "page": "vault-tool",
  "kind": "project",
  "title": "本地加密库",
  "url": "/projects/vault-tool/",
  "tagline": "用自己记住的密码，把选中的文件锁进一个加密包",
  "status": "偶尔用",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "最近 AI 技能记录",
    "at": "2026-09-29 01:11"
   },
   "facts": [],
   "as_of": "2026-10-11",
   "source": "AI 使用账本只统计到 10 月 10 日零点，只记技能名、不记做了什么和成没成功，不能当使用证明（10 月 11 日只读重取，源码 b884ab61）"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/vault-tool",
  "capability": "安全地保管和使用秘密、确认是本人",
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，水彩风、白底纯绿。从开头这屏的插画出发：几张纸片和一张小照片轻轻飘进绿色信封，信封口自己合上，一把挂锁“咔”地扣上并亮一圈柔和的绿光；信封后面两张半透明卡片轻轻错开又叠回去；一条细绿线上一个光点从信封流向右边带 GitHub 小猫标志和小锁的云，云亮一下表示收到；背景水彩纸纹理微微流动，一两片叶子飘过。不出现任何可读的密码、文件名或数字串，不出现人脸。",
  "registry": {
   "groups": [
    {
     "id": "g-store",
     "name": "放进去和取出来"
    },
    {
     "id": "g-credential",
     "name": "密码和钥匙"
    },
    {
     "id": "g-advanced",
     "name": "进阶"
    },
    {
     "id": "g-check",
     "name": "检查和维护"
    },
    {
     "id": "g-backup",
     "name": "备份到私人仓库"
    }
   ],
   "features": [
    {
     "id": "f-encrypt",
     "group": "g-store",
     "name": "加密建库",
     "what": "把选中的文件和文件夹锁进一个 vault.enc，原件默认保留",
     "how": "终端菜单“加密 / 添加文件”，或让 AI 打开本机窗口建一个新 .enc",
     "status": "在用",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 1673–1713、2387–2443；技能 Encrypt 模式；私人密文仓库 7/7 起有密文"
    },
    {
     "id": "f-add",
     "group": "g-store",
     "name": "往库里加文件",
     "what": "新文件在内存里并进原内容，同名用新版，另一套不动",
     "how": "终端菜单“加密 / 添加文件”，先输原密码",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 2387–2443；提交 574e06b；终端合并不留日志"
    },
    {
     "id": "f-view",
     "group": "g-store",
     "name": "终端里查看、搜索",
     "what": "按文件名或内容搜，文字只在内存里显示",
     "how": "菜单“解密查看”，输密码",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 1718–1904；vault.log 无 DECRYPT 记录"
    },
    {
     "id": "f-window-view",
     "group": "g-store",
     "name": "窗口里查看",
     "what": "在本机窗口里挑一个文本文件看",
     "how": "跟 AI 说要看哪个库里的什么",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "技能 LocalView；vault_auth_helper.py"
    },
    {
     "id": "f-window-edit",
     "group": "g-store",
     "name": "窗口里改文字",
     "what": "改库里一个文本文件，只重加密这一套",
     "how": "跟 AI 说要改哪个库里的哪个文件",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "技能 LocalEdit；references/local-ui-security.md；7/27 技能加入窗口编辑器、同一时段库有更新，但没有记录是哪项操作"
    },
    {
     "id": "f-export",
     "group": "g-store",
     "name": "只取出选中的文件",
     "what": "按关键字只取匹配的文件，同名不覆盖",
     "how": "菜单解密时选“解压到文件夹”",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 1907–1988、3270–3354；技能 DecryptExport"
    },
    {
     "id": "f-copy",
     "group": "g-store",
     "name": "复制一段文字",
     "what": "复制文本到剪贴板，20 秒后自动清",
     "how": "终端查看时输入 :copy 加文件名",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 126、630–682、1819–1837"
    },
    {
     "id": "f-panic",
     "group": "g-store",
     "name": "一键销毁",
     "what": "清屏、内存清零、删解出的文件夹，立即退出",
     "how": "查看时按 Ctrl+X",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 567–625、1803–1809、1923–1928"
    },
    {
     "id": "f-keyfile",
     "group": "g-credential",
     "name": "密钥文件",
     "what": "除了密码，再要一个文件才能打开",
     "how": "建库时回答“要”，选一个文件",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 420–468；本页不公开自己的库用没用"
    },
    {
     "id": "f-argon2",
     "group": "g-credential",
     "name": "换用 Argon2id",
     "what": "算钥匙改用 Argon2id，缺依赖就报错",
     "how": "建库时加 --kdf argon2",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 324–334、379–394；key-repository-workflow.md“更强模式”"
    },
    {
     "id": "f-passwd",
     "group": "g-credential",
     "name": "改密码",
     "what": "只换这次打开那一套的密码，另一套不动",
     "how": "菜单“修改密码 / 密钥文件”，或跟 AI 说",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 2242–2276；技能 ChangePassword"
    },
    {
     "id": "f-verify-pw",
     "group": "g-credential",
     "name": "试一下密码对不对",
     "what": "只验一次密码和密钥文件，不留任何授权",
     "how": "跟 AI 说“看看这个库我密码还记得对不对”",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "技能 VerifyPassword（9/10 加入）"
    },
    {
     "id": "f-rebuild",
     "group": "g-credential",
     "name": "另做新副本",
     "what": "扩容、换密钥文件时另存一份新库，旧库不动",
     "how": "命令 vault_tool.py rebuild --out 新文件",
     "status": "待验收",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 3514–3591；9/18 加入（06a8bf5），库文件最后一次改动是 7 月 27 日"
    },
    {
     "id": "f-two-layer",
     "group": "g-advanced",
     "name": "两套内容两个密码",
     "what": "另一个密码打开另一套内容，从文件上看不出有第二套",
     "how": "菜单“设置诱饵密码”，先把另一套文件放进 decoy_source/",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 2002–2104、1005–1120；本页不公开自己的库用没用"
    },
    {
     "id": "f-image",
     "group": "g-advanced",
     "name": "藏进图片",
     "what": "把 vault.enc 接在一张图片后面，也能取回；输出位置已有文件就拒绝，不覆盖",
     "how": "菜单或跟 AI 说，给封面图和输出位置",
     "status": "说不准",
     "screen": "vault-tool-09",
     "source": "vault_tool.py 2109–2179；提交 015fb14（北京 9/29 01:16）藏图、取回改成不覆盖已有输出；技能 Hide/Unhide；SKILL.md 提到 H 盘封面图的处理，但没找到使用记录"
    },
    {
     "id": "f-info",
     "group": "g-check",
     "name": "不开库看结构",
     "what": "不用密码看格式、参数、要不要密钥文件、结构坏没坏",
     "how": "菜单“查看库信息”，或让 AI 查",
     "status": "在用",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 1299–1340、2281–2349；vault.log 北京 6/24 01:00–6/28 22:20 五次“查看库信息”"
    },
    {
     "id": "f-plan",
     "group": "g-check",
     "name": "动手前预演",
     "what": "先查路径、格式、大小超没超限，给出下一步，不执行",
     "how": "让 AI 先预演",
     "status": "说不准",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 1399–1571、3357–3468；技能 AssessVault/PlanVault"
    },
    {
     "id": "f-recovery-check",
     "group": "g-check",
     "name": "恢复自检",
     "what": "用临时密码在内存里跑一遍，确认这台电脑能开库",
     "how": "换电脑前让 AI 跑一次",
     "status": "待验收",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 3471–3511；9/18 加入"
    },
    {
     "id": "f-migrate",
     "group": "g-check",
     "name": "旧格式升级",
     "what": "VAULT01、02 重新加密成 VAULT03，先留旧库",
     "how": "菜单“升级到 VAULT03”",
     "status": "在用",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 2184–2237；vault.log 6/28“MIGRATE: V2 -> V3”"
    },
    {
     "id": "f-cleanup-source",
     "group": "g-check",
     "name": "加密后删原件",
     "what": "只删和打包时一模一样的原件，改过的留着",
     "how": "明确要求时加 --cleanup-source",
     "status": "待验收",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 1702–1705、3014–3081；9/18 加入"
    },
    {
     "id": "f-clean-plaintext",
     "group": "g-check",
     "name": "清理残留明文",
     "what": "清掉上次没清干净的 decrypted/",
     "how": "命令 clean-plaintext --confirm",
     "status": "说不准",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 1991–1997、2745–2749"
    },
    {
     "id": "f-clean-backups",
     "group": "g-check",
     "name": "清理旧库备份",
     "what": "升级、改密留下的旧库副本，确认后删掉",
     "how": "菜单“清理备份文件”",
     "status": "说不准",
     "screen": "vault-tool-10",
     "source": "vault_tool.py 2352–2382"
    },
    {
     "id": "f-vault-links",
     "group": "g-check",
     "name": "认登记过的目录入口",
     "what": "电脑配置为资料目录整体加密登记的挂载点可以当路径用；登记还没建",
     "how": "自动，读电脑配置的登记",
     "status": "待验收",
     "screen": "vault-tool-10",
     "source": "登记已存在（10 月 11 日核对）"
    },
    {
     "id": "f-publish",
     "group": "g-backup",
     "name": "密文传到私人仓库",
     "what": "把 vault.enc 原样传到私人密文仓库，读回比对字节",
     "how": "让 AI 先预演再上传",
     "status": "在用",
     "screen": "vault-tool-10",
     "source": "密文上传脚本；技能 PublishVault；私人密文仓库 7/26–27 三次提交说明与脚本默认格式“backup: update encrypted vault (时间)”一致；私有检查 7/7 起就有，字节读回 9/3（0b9d4c4）才加，还没在真实上传里用过"
    },
    {
     "id": "f-verify-remote",
     "group": "g-backup",
     "name": "核对私人仓库",
     "what": "确认目标是私有仓库、路径在",
     "how": "让 AI 核对私人仓库",
     "status": "说不准",
     "screen": "vault-tool-10",
     "source": "技能 VerifyRemote（只核对目标和路径，不回读密文字节）"
    },
    {
     "id": "f-protect-readme",
     "group": "g-backup",
     "name": "保护私人仓库的说明文件",
     "what": "说明文件在 GitHub 上是明文，换成固定的安全文字，原说明加密进库",
     "how": "明确要求才做，要在本机再输一次密码",
     "status": "在用",
     "screen": "vault-tool-10",
     "source": "技能 ProtectRemoteReadme（protect_remote_readme.py，7/8 版在本机弹窗要密码）；私人密文仓库提交 7d3c210（7/8 21:37）的说明正是该脚本默认的“backup: protect remote README in encrypted vault”，README 和 vault.enc 同时改动"
    }
   ],
   "numbers": [
    {
     "id": "n-deps",
     "text": "0 个",
     "meaning": "默认 scrypt 下，Windows 上加密解密要另装的第三方库（Argon2id 是可选项，另算）",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 16、67–86、808–915 行：Windows 走 bcrypt.dll",
     "screens": [
      "vault-tool-01"
     ]
    },
    {
     "id": "n-layers",
     "text": "2 套",
     "meaning": "一个 VAULT03 库最多放几套各自密码的内容",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 1005–1120 行",
     "screens": [
      "vault-tool-01"
     ]
    },
    {
     "id": "n-key-versions",
     "text": "4 版",
     "meaning": "私人密文仓库里密文文件真正变化的次数（7/7–7/27）；另有两次提交没改任何文件",
     "as_of": "2026-10-11",
     "source": "私人密文仓库 Git 记录；10 月 11 日只读元数据复核，7/27 之后没有新提交",
     "screens": [
      "vault-tool-01"
     ]
    },
    {
     "id": "n-last-upload",
     "text": "7 月 27 日",
     "meaning": "最近一次往私人密文仓库推送（北京时间 04:06 起三次，最后 23:16）",
     "as_of": "2026-10-11",
     "source": "私人密文仓库 Git 记录，换算北京时间；10 月 11 日只读元数据复核，最新提交仍是 7/27 23:16",
     "screens": [
      "vault-tool-01",
      "vault-tool-11"
     ]
    },
    {
     "id": "n-tests",
     "text": "145 个",
     "meaning": "源码测试定义 145 个，这次没有运行；9/28 实跑 144 个＋40 子用例全过",
     "as_of": "2026-10-11",
     "source": "HEAD b884ab6 各 test_*.py 的 def test_ 计数 145（10 月 11 日 16:08 北京读，526e891 时为 144）；9/28 实跑 py -3 -m pytest -q（E:\\Projects\\Tools\\vault-tool）",
     "screens": [
      "vault-tool-01",
      "vault-tool-06"
     ]
    },
    {
     "id": "n-lines",
     "text": "3595 行",
     "meaning": "vault_tool.py 一个文件的行数",
     "as_of": "2026-10-11",
     "source": "wc -l vault_tool.py（10 月 11 日于 HEAD b884ab6 复核仍 3595 行，__version__ 2.3.1）",
     "screens": [
      "vault-tool-04",
      "vault-tool-06"
     ]
    },
    {
     "id": "n-commits",
     "text": "23 次",
     "meaning": "vault-tool 仓库提交数，6/23–10/11（含北京 9/29 01:16 的 015fb14）",
     "as_of": "2026-10-11",
     "source": "git log | wc -l",
     "screens": [
      "vault-tool-06",
      "vault-tool-11"
     ]
    },
    {
     "id": "n-kdf-time",
     "text": "约 0.6 秒",
     "meaning": "建库前校准，算一次钥匙的目标耗时",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 115、356–376 行",
     "screens": [
      "vault-tool-05"
     ]
    },
    {
     "id": "n-min-size",
     "text": "64 KiB",
     "meaning": "VAULT03 文件的最小大小（分桶下限）",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 129、397–411 行",
     "screens": [
      "vault-tool-05"
     ]
    },
    {
     "id": "n-retry",
     "text": "5 次",
     "meaning": "连续输错密码的上限，第 2 次起等 2、4、8、16 秒",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 140–141、1618–1648 行",
     "screens": [
      "vault-tool-05"
     ]
    },
    {
     "id": "n-clipboard",
     "text": "20 秒 / 15 秒",
     "meaning": "终端 / 本机窗口里复制后多久自动清剪贴板",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 126 行；vault_auth_helper.py 第 487 行",
     "screens": [
      "vault-tool-07"
     ]
    },
    {
     "id": "n-archive-limit",
     "text": "1 万个文件、4 GiB",
     "meaning": "一个库里文件数和解开后总大小的上限",
     "as_of": "2026-09-28",
     "source": "vault_tool.py 第 2790–2793、2926–2937 行",
     "screens": [
      "vault-tool-07"
     ]
    },
    {
     "id": "n-features",
     "text": "26 项",
     "meaning": "全部功能条数",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "vault-tool-09"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-key-repo",
     "with": "私人密文仓库（GitHub）",
     "direction": "交给",
     "flow": "把 vault.enc 原样写到私人密文仓库（GitHub 官方接口，不克隆），上传后读回比对长度和 SHA-256；只流密文",
     "source": "scripts/密文上传脚本；docs/key-repository-workflow.md"
    },
    {
     "id": "r-key-readme",
     "with": "私人密文仓库（GitHub）",
     "direction": "交给",
     "flow": "明确要求时，把 私人密文仓库的说明文件换成固定的安全文字，原说明加密进库",
     "source": "vault-workflow 技能 ProtectRemoteReadme；私人密文仓库提交 7d3c210"
    },
    {
     "id": "r-skill",
     "with": "vault-workflow 技能",
     "direction": "被调用",
     "flow": "AI 经技能调用只读检查、打开本机密码窗口、发起上传；技能回给 AI 的只有状态、路径、个数和密文哈希",
     "source": "E:\\.agents\\skills\\vault-workflow\\SKILL.md"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "各管各",
     "flow": "什么都不流：钥匙、恢复材料、密文、运行依赖都不共用；没说用哪套时“帮我加密这个文件”默认走密码中心",
     "source": "vault-workflow SKILL.md 第 10 行；决定记录第一轮 B4；.agents 提交 2ed452e"
    },
    {
     "id": "r-local-secret-broker",
     "with": "local-secret-broker 技能",
     "direction": "分流",
     "flow": "密码、API key、BitLocker、验证方式的请求不进本工具，交给密码中心那条路",
     "source": "vault-workflow SKILL.md 第 10 行"
    },
    {
     "id": "r-pcconfig-links",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "读电脑配置登记的资料目录入口清单（vault-links.json），登记过、入口和实际指向一致才放行；登记已存在，本项目真实使用仍待验收",
     "source": "vault_tool.py 第 2822–2902 行；提交 34742e4"
    },
    {
     "id": "r-pcconfig-registry",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "电脑配置的恢复锚点和配置项登记可用命令与恢复关系，源码路径导航取 GitHub 总索引；改动影响查询仍能查到它",
     "source": "PCConfig registries/project_restore_anchors.json（Vault）、project_config_keys.json（vault_tool）；GitHub 总索引 config/repository-paths.json（仓库导航快照）"
    },
    {
     "id": "r-github-cli",
     "with": "GitHub CLI（gh）",
     "direction": "拿来",
     "flow": "上传和读回走本机已登录的 gh api；目标不是私有仓库就拒绝",
     "source": "密文上传脚本 第 22–51 行"
    }
   ],
   "highlights": [
    {
     "id": "h-ai-no-password",
     "title": "AI 帮我改了私人仓库，却没见到密码",
     "screen": "vault-tool-08"
    }
   ],
   "mentions": [
    {
     "target": "/how/#vault-tool",
     "screen": "vault-tool-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/rules/charter/#L25",
     "screen": "vault-tool-01",
     "text": "约法 L25"
    },
    {
     "target": "/projects/password-center/",
     "screen": "vault-tool-01",
     "text": "密码中心"
    },
    {
     "target": "/skills/vault-workflow/",
     "screen": "vault-tool-02",
     "text": "加密库操作技能"
    },
    {
     "target": "/skills/vault-workflow/",
     "screen": "vault-tool-04",
     "text": "加密库操作技能"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "vault-tool-06",
     "text": "电脑配置与恢复"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“库内容查看”拆成 f-view（终端里看、搜）和 f-window-view（本机窗口看），入口和能力不同；终端里的“按内容搜索”并进 f-view。",
    "底稿“结构检查”对应 f-info；同属只读检查的 doctor、assess、plan 里，“预演一次操作”单列为 f-plan，“恢复自检”单列为 f-recovery-check，因为用途和加入时间不同。",
    "底稿“恢复副本”（重建更大或新凭据的库）对应 f-rebuild，改名“另做新副本”，免得和升级、改密时自动留的旧库备份混淆。",
    "底稿“双密码分层”对应 f-two-layer；“图片承载”对应 f-image（藏进和取回合成一条）。",
    "建库时的密码强度提示（短于 12 位警告）并进 f-encrypt 的说明，不单列。"
   ],
   "dropped": [
    "旧默认目录 E:\\Vault 的迁移提示不列功能：只在 assess 里报一条风险，没有单独的动作。",
    "终端菜单的“持久菜单”（出错、Ctrl+C 都回菜单）不列功能：是界面行为，写进第 2 屏的用法里不单讲。"
   ],
   "unsure": [
    "两套内容的写法：旧稿 Claude 审稿意见是“不在公开网站上点明哪一套是真的”。本页照实写了机制（第 2 屏终端菜单原文“设置诱饵密码（抗胁迫 / 似真否认）”、第 5 屏尾部装第二套时和随机数分不出），但不写我自己的库有没有第二套、哪一套装什么，也不写用没用密钥文件、用哪种算法。代码本身公开，菜单原文照登不会多泄露什么；如 Claude 认为菜单这行也要避开，第 2 屏插画可只画前 4 项。",
    "功能状态（9/28 资料解锁后复查）：能查的使用记录都查了——AI 技能使用账本（9/15 起）、Codex 和 Claude 对话记录（分别从 9/15、9/24 起，7 月的已不在）、AI 记忆备份、vault.log、私人密文仓库提交、本地 vault.enc 修改时间。没有找到新的真实使用：vault.enc 自 7/27 04:04 以后没变过；终端解密、加密、改密、诱饵、藏图、清理从 6/24 起每次都会写 vault.log，一条也没有；技能窗口的操作不写日志，也没在 9/15 以后的记录里出现。所以状态不变；说不准的几项只能说明 6/24 以后没走终端，走技能窗口的 7 月那几次（7/23、7/27 库有变化）具体做了什么查不到。",
    "manifest 的 capability 分组：本页填“安全地保管和使用秘密、确认是本人”，与密码中心相同，好让项目首页把两套加密放在一组；如果项目首页想单独分一组“加密保管文件”，请改这一栏。",
    "替本人口吻写的句子（上线前请本人过目）：第 7 屏“6 月 28 日我反馈过：老的‘加文件’会拿新文件重建整个库”（依据是提交 574e06b 的说明“修复用户反馈的两个 UX 问题……老的‘加文件’会覆盖整库丢数据”，原话没留下）；第 7 屏“当天先止住”的说法同样依据 574e06b 的代码（旧库先解到 source/ 再整库重加密）；第 11 屏“按我的决定”。",
    "亮点只留 7/8 保护私人密文仓库 说明文件这一件（依据：私人密文仓库提交 7d3c210 的说明与 protect_remote_readme.py 默认提交说明一字不差，README 和 vault.enc 同时改动）。“AI 帮我做了这件事”是推断：脚本是给 AI 调用的、同晚 21:48 技能提交了这个脚本，但没有对话记录直接证明是 AI 跑的；私人密文仓库提交早于技能提交 11 分钟，当时跑的是工作区里的版本。第 7 屏“库文件最后一次改动是 7 月 27 日”是替本人口吻的句子，依据是私人密文仓库最后一次推送。",
    "密码中心页第 7 屏对比表两处和本页事实略有出入，建议那页微调：“怎么用”写“自己在本机运行它的菜单”，实际还能让 AI 经技能打开本机窗口（查看、改字、建库、导出、改密）；“放在哪”只写 私人密文仓库，实际项目目录 E:\\Projects\\Tools\\vault-tool 里还有一份字节相同的 vault.enc。另外那一屏没有锚点，本页只能链到密码中心页顶；建议给那屏加一个锚点（例如 #vs-vault），本页再改链接。",
    "技能 SKILL.md 写隐写“按本人对 H 盘原始封面图的既定选择”只留载体图、原封面和原密文保留；决定记录里没搜到这条原话，也没找到做过的记录，f-image 标“说不准”。",
    "没有真实截图：旧网站和仓库里都没有这个项目的界面截图。第 2 屏用插画画终端菜单（字照代码里的菜单写，编号按库已存在、已是 VAULT03、没有旧备份时的情况）。如果要真实截图，需要用虚构库另拍，不能拍真实库。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/vault-tool/page.json",
  "sha256": "63df0ab58912a9be2bf92135e1d73953b9a4f4ba4c87a21ea246894fa6097a97",
  "converted_at_beijing": "2026-10-23T08:10:05+08:00"
 }
}
---

::screen{#vault-tool-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-01",
  "section": "top",
  "title": "开头",
  "scene": "左上毛笔艺术字大标题，下面介绍段；介绍段下面并排两枚白底细绿边圆角按钮（怎么协作、GitHub，GitHub 按钮左边画 GitHub 小猫标志）。右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人密文仓库）。中间一排四张数字卡片（和样张第一屏一样：上面小插画，大号绿色数字，下面一行小字；小插画依次是：一台笔记本电脑屏幕上一个 Windows 窗口标志、两张叠起来的卡片、一朵带锁的云、一个打满对勾的清单）。最下面一行灰色小字（偶尔用那句），和一行“两套加密怎么选”的说明，各带一个链接。没有“现在”横条（这个项目没有自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：标题和介绍在上，两枚按钮一行；插画缩小放在按钮下面；四张数字卡两两一行排成两行；最后两行小字各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#vault-tool"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/vault-tool"
   },
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/vault-tool/#ai-brief"
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "47%",
     "text_ref": "本地加密库"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 最近 AI 技能记录 9 月 29 日 01:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用账本只统计到 10 月 10 日零点，只记技能名、不记做了什么和成没成功，不能当使用证明（10 月 11 日只读重取，源码 b884ab61）",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "把我选中的文件"
    },
    {
     "type": "action_button",
     "columns": 3,
     "row": "hero",
     "text_ref": "在整套系统里的位置"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "53%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "1"
    },
    {
     "type": "notice",
     "align": "left",
     "text_ref": "偶尔用"
    }
   ],
   "notes": "原图左文右插画，文字栏内标题—介绍—按钮竖排。原图横版只有两按钮，第三按钮以定稿补齐同样式。四张数字卡一行；底部两句在同一整宽浅条内。插画信封到云用绿色虚线箭头；没有实时横条。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "本地加密库"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 最近 AI 技能记录 9 月 29 日 01:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用账本只统计到 10 月 10 日零点，只记技能名、不记做了什么和成没成功，不能当使用证明（10 月 11 日只读重取，源码 b884ab61）"
    },
    {
     "type": "stat_card",
     "columns": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "1",
     "columns_v": 2
    },
    {
     "type": "notice",
     "text_ref": "偶尔用"
    },
    {
     "type": "prose",
     "text_ref": "把我选中的文件"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "在整套系统里的位置",
     "columns_v": 2
    },
    {
     "type": "illustration"
    },
    {
     "type": "notice",
     "text_ref": "它和"
    }
   ],
   "notes": "竖版主图在按钮之后、数字卡之前；四数字卡两列两行；两个底部说明分别整宽。v2 按已批准替换图。第三按钮依定稿补齐并折到第二行，不缩字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "个｜默认 scrypt 下，Windows 上要另装的第三方库：加密直接用系统自带的接口",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "套｜一个库里最多放两套内容，各用各的密码。被逼交密码时可以只交出一套，从文件上看不出还有另一套",
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
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "版｜密文在私人 Key 仓库里存过 4 版（7 月 7–27 日），最近一次上传 7 月 27 日",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "个｜自动测试，9 月 28 日 28 秒全部通过",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/密封文件钥匙.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "403ce13ac20240234cb5c83107cbfe12f712515dc8e047df1cbe2246f6868cf2",
   "status": "ready",
   "original_elements": [
    "一只绿色的密封信封（信封正面印着小字抽象图形），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库"
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
   "asset": "_library/titles/title-6e677e46fe2cb211db69.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6e677e46fe2cb211db69",
   "title_text": "本地加密库",
   "sha256": "d48e9f8921dcb6aaa6fccbfacecdfa4c90eb473f12831a8c302902e4171b964b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**本地加密库**

把我选中的文件和文件夹锁进一个加密文件 vault.enc，用我自己记住的密码打开（需要时再加一个密钥文件：拿任意一个文件当第二把钥匙）。以后在本机输入密码，就能查看里面的文字、只取出要用的文件、往里加新东西；锁好的密文再原样备份到我在 GitHub 上的私人密文仓库。AI 能帮我检查、准备和备份，密码只在本机窗口里输：AI 拿不到，也找不回。



1. 0 个｜默认 scrypt 下，Windows 上要另装的第三方库：加密直接用系统自带的接口
2. 2 套｜一个库里最多放两套内容，各用各的密码。被逼交密码时可以只交出一套，从文件头上看不出还有另一套
3. 4 版｜私人密文仓库里，密文文件有 4 次内容变化（7 月 7–27 日），最近一次推送 7 月 27 日
4. 145 个｜测试定义（只计数，截至 10 月 22 日，这次没有运行）；9 月 28 日实跑的 144 个 28 秒全部通过

偶尔用：只修报错，不加功能，见〔约法 L25〕。
它和〔密码中心〕是两套互不相通的加密；没说用哪套时，“帮我加密这个文件”默认走密码中心，两套怎么选看密码中心页的对比表。

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#vault-tool-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "左上标题。五张横向圆角卡片竖着排成一列，每张左边一个小水彩图标（一只手把几张纸塞进信封、一只放大镜照着一页文字、一只手从信封里抽出一张照片、一个信封旁边多出一个加号、一朵带锁的云和一个往上的箭头），右边粗体标题加两三行正文。屏幕右侧约三分之一宽画一个终端窗口的水彩插画（深色底、绿色字），窗口里画真实的菜单文字（text 里从“常用”到“[0] 退出”那 4 行，照原样分行），窗口下面一行小字说明（text 里“在终端里运行……看到的菜单”那句）。最下面一行小字放一个链接。",
  "portrait": "竖版：终端插画放在标题下面、撑满宽度；五张卡片一张一行；链接行在最后。",
  "links": [
   {
    "text": "加密库操作技能",
    "href": "/skills/vault-workflow/"
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
     "text_ref": "平时怎么用"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/fix-round-2/icon-clean-f2b865944254996a0705.png"
     ],
     "text_ref": "放进去"
    },
    {
     "type": "prose",
     "text_ref": "运行后的菜单分三类"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 具体怎么说"
    }
   ],
   "notes": "五张用法卡竖排左栏；右侧终端/电脑插画，在屏内右侧，卡片外。真实菜单用定稿文字绘制 document_mock，禁止继续使用带菜单字的位图；图注置菜单下。若 document_mock 尚缺，应提请求。整屏章节标题按批准要求居中，原图旧标题靠左。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。"
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
     "type": "illustration"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/fix-round-2/icon-clean-f2b865944254996a0705.png"
     ],
     "text_ref": "放进去",
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "运行后的菜单分三类"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 具体怎么说"
    }
   ],
   "notes": "按实际原图而非 portrait 描述：顶部是人操作电脑的大插画，接五张单列用法卡，菜单在备份卡之后，再图注和链接。原 v 第一张前三卡，v2 后两卡和菜单。五卡的小图左侧在卡内；v2 原图后两卡没有小图，统一图标方式需父代理权衡原图与 G6。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只手把几张纸塞进信封",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一只放大镜照着一页文字",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "照片堆",
   "source_phrase": "一只手从信封里抽出一张照片",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "source_phrase": "一个信封旁边多出一个加号",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵带锁的云和一个往上的箭头",
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
   "asset": "_library/illustrations/终端光标通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "终端光标通用构图",
   "source_phrase": "屏幕右侧约三分之一宽画一个终端窗口的水彩插画（深色底、绿色字），窗口里画真实的菜单文字（text 里从“常用”到“[0] 退出”那 4 行，照原样分行），窗口下面一行小字说明（text 里“在终端里运行……看到的菜单”那句）。",
   "sha256": "a846c2e4d1273a3e407416311b7438633e24641fb2603805fcd7b59afe05146b",
   "status": "ready",
   "original_elements": [
    "深色底终端小窗口，窗口只画绿光光标与浅灰短线，菜单真实字由排版程序另放"
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

**放进去**　在 vault-tool 文件夹里运行 python vault_tool.py，选“加密 / 添加文件”，一行一个粘贴要加的文件或文件夹路径。第一次会让我设密码、问要不要加密钥文件，并提示密码短于 12 位太弱。原件默认原地不动。

**看一眼**　选“解密查看”，输密码后在终端里按文件名搜，或打“/关键字”按内容搜，文字直接显示；看完按 Enter 清屏，明文不写硬盘。想在窗口里看、改几行字，跟 AI 说，它打开本机的阅读窗口，我从列表里挑一个文件。

**取出来**　图片、PDF 这类终端显示不了的，在终端里输一个关键字只取出匹配的文件；遇到同名文件不覆盖。让 AI 导出时，是把这次打开的内容全部导到指定文件夹，不能只挑一个。

**加东西**　还是在终端选“加密 / 添加文件”，先输原密码，再粘贴新文件的路径；旧内容不会丢，怎么做到的见“还没在真实使用里验过的几道保护”第 1 条。AI 那边的“加密”只会新建一个库，不会往已有的库里加。

**备份**　改完让 AI 把 vault.enc 原样传到私人密文仓库，传完从 GitHub 读回来比对字节。

运行后的菜单分三类：常用的是查看、搜索和往库里加文件；管理是改密码或密钥文件、不输密码看库的基本信息。
进阶的是设一个诱饵密码（被逼着打开时只露出另一套内容），以及把加密库藏进一张图片、需要时再取出来；这两样都在终端里做，AI 可以帮我准备步骤。

跟 AI 具体怎么说：〔加密库操作技能〕

::screen{#vault-tool-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-03",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "左上标题。六张横向圆角卡片两列三行，每张左边一个小水彩图标（一张被撕碎的密码纸条、一台冒烟的电脑旁边一朵云、一个写到一半的文件和一个回卷箭头、一只按在键盘 Ctrl 和 X 上的手、一个断了一角的信封、一个打开的文件夹上面一把扫帚），右边粗体一句加两三行小字。",
  "portrait": "竖版：六张卡片一张一行。",
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
     "text_ref": "出事怎么办"
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "none",
     "icons": "none",
     "text_ref": "忘了密码"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png"
     ],
     "text_ref": "会留下什么记录"
    }
   ],
   "notes": "六问题卡两列三行，按行读取；第七条记录说明是一张单独整宽卡。原图每张图标在卡内左侧，无连接。正文按定稿保全平台依赖。整屏标题按批准要求居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "忘了密码",
     "columns_v": 1
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png"
     ],
     "text_ref": "会留下什么记录",
     "columns_v": 1
    }
   ],
   "notes": "七张单列卡，左图右文；第一张竖图含前两卡，续图含第 3–7 卡。无连接，不重复标题。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张被撕碎的密码纸条",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一台冒烟的电脑旁边一朵云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个写到一半的文件和一个回卷箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "一只按在键盘 Ctrl 和 X 上的手",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "一个断了一角的信封",
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
   "source_phrase": "一个打开的文件夹上面一把扫帚",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "key": "文件夹",
   "source_phrase": "会留下什么记录 终端菜单的操作写进同一文件夹的 vault.log，只记时间和操作类型（例如“查看库信息”“连续输错密码”），不记文件名和内容；让 AI 开窗口做的操作不写这份记录。\n",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "key": "文件夹",
   "source_phrase": "会留下什么记录 终端菜单的操作写进同一文件夹的 vault.log，只记时间和操作类型（例如“查看库信息”“连续输错密码”），不记文件名和内容；让 AI 开窗口做的操作不写这份记录。\n",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

出事怎么办

**忘了密码，或丢了密钥文件**　打不开，没有找回的办法，AI 和这个网站也帮不上。密钥文件是按整个文件的内容算的，换一个看起来一样的文件也不行。

**电脑坏了**　从私人密文仓库取回 vault.enc，在任何装了 Python 3.11 以上的电脑上，拿这个公开仓库的 vault_tool.py，输入密码（和密钥文件）就能打开。默认 scrypt 下，Windows 不用另装库；Linux、macOS 要装 cryptography。选了 Argon2id 的库，各平台还要装 argon2-cffi。先跑一遍“恢复自检”：用临时编的内容在内存里加密、解密一遍，确认这台电脑的环境能开库；它不碰真库，证明不了我的密码还对（9 月 18 日加入，还没真用过）。

**保存到一半出错**　库不会只写了一半：出错就把原来的密文放回去（这套流程还没在真实使用里验过，见技术一节）。连放回也失败，就报出加密的旧库副本在哪，不假装已经恢复。

**有人突然过来**　在终端里看的时候按 Ctrl+X：清屏、内存清零、删掉解出来的文件夹，程序直接退出。

**库文件坏了**　不输密码先查结构。文件被截断、格式认不出，就停下来，不去解、不去升级、也不覆盖。

**解出来的明文残留**　程序被强行结束时，解压用的文件夹 decrypted/ 里可能留着明文。下次在终端里真正选择解压时会先清掉；不输密码的检查不会自动删，要我明确说“清理”才清。

**会留下什么记录**　终端里的加密、解密、改密、设诱饵、藏图、清理这些操作写进同一文件夹的 vault.log，只记时间和操作类型（例如“查看库信息”“连续输错密码”），菜单出错时会记下错误信息。终端菜单的“添加文件”和让 AI 开窗口做的操作都不写这份记录，所以记录里没有，不能说明没做过。

::screen{#vault-tool-04 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "左上标题。上半部分一张从左到右的流程图，六个节点（圆角卡片，小水彩图标：一叠文件、一个打包带扎起来的纸箱、一把从密码纸条和小钥匙卡片里“长”出来的钥匙、一把挂锁、一个密封信封、一朵带锁的云），绿色箭头依次连起来；每个节点下面一两行小字；第 6 个节点画成虚线框，表示可选。下半部分左右两张卡片：左“用了什么”，右“AI 在哪一边”。",
  "portrait": "竖版：流程图改成从上到下；两张卡片上下排。",
  "links": [
   {
    "text": "加密库操作技能",
    "href": "/skills/vault-workflow/"
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
     "type": "flow",
     "columns": 6,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none",
     "optional_items": [
      6
     ],
     "text_ref": "选中的文件"
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "none",
     "icons": "none",
     "text_ref": "用了什么"
    }
   ],
   "notes": "六步横向一行：图标在顶部方框内、名称和说明在图标下；绿色箭头逐步向右，第六图框虚线表示可选。底部两等宽卡，左卡用了什么、右卡 AI 在哪一边，卡内插画左文右。整屏标题居中。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
     "type": "flow",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none",
     "optional_items": [
      6
     ],
     "text_ref": "选中的文件",
     "columns_v": 1
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "用了什么",
     "columns_v": 1
    }
   ],
   "notes": "前六步单列下箭头，左图右文；v2 是已批准替换图，两张整宽卡上下排，毛笔卡头在左上、插画在卡内右上/右侧，正文在左并自然环绕右图。illustration_align=right 是所需扩展；标准枚举不能完整表达，请父代理向组件族说明。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "source_phrase": "成虚线框，表示可选",
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
   "slot_ordinal": 3,
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
   "slot_ordinal": 4,
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
   "slot_ordinal": 5,
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
   "slot_ordinal": 6,
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

1. **选中的文件**：只处理我点名的文件和文件夹，不去扫整块盘
2. **打包压缩**：tar + gzip 打成一个包，边打包边记下每个文件的 SHA-256
3. **由密码算钥匙**：scrypt（可选 Argon2id）；有密钥文件时，把它的 SHA-256 拼进密码一起算
4. **加密**：AES-256-GCM，带认证标签：密文被改过一个字节就解不开
5. **写成 vault.enc**：VAULT03 格式；写完读回再解一遍，对上了才算成功
6. **备份（可选）**：原样传到私人密文仓库，读回比对长度和 SHA-256

**用了什么**
- 一个 Python 文件 vault_tool.py（2.3.1 版，3595 行），有终端菜单，也有命令行子命令。
- Windows 上加密走系统的 CNG 接口（bcrypt.dll）；Linux、macOS 用 cryptography 库；Argon2id 要另装 argon2-cffi，缺了就报错，不悄悄换算法。
- 备份脚本用 PowerShell 调 GitHub 官方接口，上传时不克隆私人密文仓库；另有一份只放密文和安全说明的受管本地副本，由技能单独管理。

**AI 在哪一边**
AI 经〔加密库操作技能〕调用：不需要密码的检查它自己跑；要密码时它只打开本机窗口，窗口回给它的只有状态、路径、个数和密文哈希。真用过的一次见亮点。

::screen{#vault-tool-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-05",
  "section": "tech",
  "title": "钥匙和容器",
  "scene": "左上标题。上半部分一张横向的“文件剖面图”：一条长长的水彩色带，从左到右分成三段，第一段窄（文件头，浅绿）、第二段中等（第一层，绿色）、第三段宽（尾部，画成细密的灰绿色杂点，看不出里面有没有东西）；每段上方标名称和大小，下方一两行小字。色带下面一把小尺子，标“总大小只看第一层”。下半部分三张小卡片横排：“钥匙怎么算”“输错密码”“旧格式”。",
  "portrait": "竖版：剖面图改成从上到下的三段竖条，说明放在每段右边；三张小卡片上下排。",
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
     "text_ref": "钥匙和容器"
    },
    {
     "type": "segmented_band",
     "columns": 3,
     "layout": "horizontal",
     "segment_proportions": [
      18,
      34,
      48
     ],
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "vault.enc 里面分三段",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ]
    },
    {
     "type": "notice",
     "illustration": "none",
     "ruler": true,
     "text_ref": "总大小只看第一层"
    },
    {
     "type": "content_card",
     "columns": 3,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "text_ref": "钥匙怎么算"
    }
   ],
   "notes": "横向文件剖面三段：文件头窄、第一层中、尾部宽；段名在上、说明在下，尺子贯穿剖面下方，尺子下放总大小说明。底部三等宽小卡一行，无卡间箭头。segmented_band 标题保留中档毛笔字。需要组件样张。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "钥匙和容器"
    },
    {
     "type": "segmented_band",
     "columns": 1,
     "layout": "vertical",
     "segment_proportions": [
      1,
      1,
      1
     ],
     "illustration": "outside",
     "annotation_side": "right",
     "connector": "none",
     "text_ref": "vault.enc 里面分三段",
     "columns_v": 1,
     "icons": [
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "text_ref": "总大小只看第一层",
     "columns_v": 1
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/icons/钥匙.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "text_ref": "钥匙怎么算",
     "columns_v": 1
    }
   ],
   "notes": "顶部段名为无毛笔正文粗体居中；三段剖面竖条在左，三张段说明卡在右，用绿色虚线引线连接。总大小说明是左图右文整宽卡。续图三个单列大卡毛笔标题左上、插画卡内右侧。组件需支持 annotation_side/right 与 illustration_align/right；不能简单三卡横排缩窄。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "文件头（21 字节）  ：格式名 VAULT03、要不要密钥文件、算钥匙用的参数。不记录有没有第二套内容。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "第一层  ：盐、随机数、认证标签、长度，然后是第一套内容的密文。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "尾部  ：只有一套内容时，这里全是随机数；有第二套时，第二套加密后正好填满这里，从外面看和随机数没有区别。",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "钥匙怎么算 每次建库前先试算，让算一次钥匙花约 0.6 秒：scrypt 从 16 MiB 内存起翻倍，最多约 1 GiB；Argon2id 最多 1 GiB。参数写进文件头，解的时候照着算。遇到要 4 GiB 以上内存的参数直接拒绝，免得被人改过的文件把电脑拖死。\n",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "输错密码 第 2 次起分别等 2、4、8、16 秒再让输，5 次都错就结束这次操作，回到菜单。\n",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "旧格式 VAULT01（PBKDF2-SHA256 迭代 60 万次 + AES-CBC）和 VAULT02（scrypt + AES-GCM）都还能打开；“升级”把它们重新加密成 VAULT03，动手前先留一份旧库。\n",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "文件头（21 字节）  ：格式名 VAULT03、要不要密钥文件、算钥匙用的参数。不记录有没有第二套内容。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "第一层  ：盐、随机数、认证标签、长度，然后是第一套内容的密文。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "尾部  ：只有一套内容时，这里全是随机数；有第二套时，第二套加密后正好填满这里，从外面看和随机数没有区别。",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "总大小只看第一层 至少 64 KiB，按第一层的两倍往上取整（64 MiB 以内取 2 的幂）。所以从文件大小也看不出尾部装没装东西；打开时还会核对大小合不合这个规则，被截断的直接认出来。\n",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "钥匙怎么算 每次建库前先试算，让算一次钥匙花约 0.6 秒：scrypt 从 16 MiB 内存起翻倍，最多约 1 GiB；Argon2id 最多 1 GiB。参数写进文件头，解的时候照着算。遇到要 4 GiB 以上内存的参数直接拒绝，免得被人改过的文件把电脑拖死。\n",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "输错密码 第 2 次起分别等 2、4、8、16 秒再让输，5 次都错就结束这次操作，回到菜单。\n",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "key": "锁",
   "source_phrase": "旧格式 VAULT01（PBKDF2-SHA256 迭代 60 万次 + AES-CBC）和 VAULT02（scrypt + AES-GCM）都还能打开；“升级”把它们重新加密成 VAULT03，动手前先留一份旧库。\n",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c3fd324ab88edff77317.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c3fd324ab88edff77317",
   "title_text": "钥匙和容器",
   "sha256": "26cade75aeaaf30480a4892daf81eecfcd5779de1df2804897f137040ad8bdf5",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

钥匙和容器

**vault.enc 里面分三段**
- **文件头（21 字节）**：格式名 VAULT03、要不要密钥文件、算钥匙用的参数。不记录有没有第二套内容。
- **第一层**：盐、随机数、认证标签、长度，然后是第一套内容的密文。
- **尾部**：只有一套内容时，这里全是随机数；有第二套时，第二套加密后正好填满这里，从外面看和随机数没有区别。

**总大小只看第一层**　至少 64 KiB，按第一层的两倍往上取整（64 MiB 以内取 2 的幂）。所以从文件大小也看不出尾部装没装东西；打开时还会核对大小合不合这个规则，被截断的直接认出来。

**钥匙怎么算**　每次建库前先试算，让算一次钥匙花约 0.6 秒：scrypt 从 16 MiB 内存起翻倍，最多约 1 GiB；Argon2id 最多 1 GiB。参数写进文件头，解的时候照着算。遇到要 4 GiB 以上内存的参数直接拒绝，免得被人改过的文件把电脑拖死。

**输错密码**　第 2 次起分别等 2、4、8、16 秒再让输，5 次都错就结束这次操作，回到菜单。

**旧格式**　VAULT01（PBKDF2-SHA256 迭代 60 万次 + AES-CBC）和 VAULT02（scrypt + AES-GCM）都还能打开；“升级”把它们重新加密成 VAULT03，动手前先留一份旧库。

::screen{#vault-tool-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一份原件上盖着“保留”小印章、两条岔开的小路、一张被玻璃罩住的卡片、三个大小不同的对勾、一条被剪断的链子、一块内存条上一把小锁），每张粗体一句加一两行小字；右边约三分之一宽，竖着三张大数字卡。",
  "portrait": "竖版：六张卡片一张一行；三张数字卡在最后排成一行三个（放不下就一行一个）。",
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
     "text_ref": "为什么这样设计"
    },
    {
     "type": "flow",
     "columns": 2,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "row": "principles",
     "width": "73%",
     "text_ref": "原件默认不删"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "row": "principles",
     "width": "27%",
     "text_ref": "3595 行"
    }
   ],
   "notes": "六张编号原则卡左侧两列三行，按行读取；右栏三张数字卡竖排。原图右侧数字从标题同高起，本草案整屏标题按批准要求居中后再开双栏。无连接。统计段是三个独立 para 而非 stats 节点，stat_card 需保全竖线后文字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "flow",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "text_ref": "原件默认不删",
     "columns_v": 1
    },
    {
     "type": "stat_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "3595 行",
     "columns_v": 1
    }
   ],
   "notes": "六单列左图右文原则卡，数字卡在最后一行三个，图在卡内顶部、大数字下接说明；原 v 第一图含前四卡，续图第 5、6 卡和数字卡。正文不缩字，必要时数字卡依 portrait 允许单列。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一份原件上盖着“保留”小印章",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "两条岔开的小路",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一张被玻璃罩住的卡片",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "三个大小不同的对勾",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断链.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断链",
   "source_phrase": "一条被剪断的链子",
   "sha256": "8f475338e1eae8c1614422882edcc0696419be567cbbba434c0617d4161dd3ff",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一块内存条上一把小锁",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-9ce99a7f5a6a4d1b80fa.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

为什么这样设计

1. **原件默认不删。**　加密成功不等于可以删原件；要删得另外说，而且只删和打包时一模一样的文件（重算 SHA-256 核对），被改过的、是链接的都留着。
2. **追加和重建是两件事。**　加文件是在原库上合并；换密钥文件、空间不够是另做一份新副本，旧库原样保留。两件事入口分开，免得想加一个文件却把整库换掉。
3. **另一套内容绝不碰。**　改密码、加文件、改字，只重新加密这次用密码打开的那一套，另一套的密文一个字节都不动；打开了一套，也不推断另一套是空的。
4. **能看结构、能打开、能恢复是三件事。**　不带密码只能看出结构没坏；密码对了才证明内容在；私人密文仓库读回一致只证明密文存对了。
5. **不跟着链接走。**　路径上有符号链接、目录联接就拒绝，免得写到别处。唯一例外：〔电脑配置与恢复〕登记的资料目录入口，登记过、门开着、指向也对得上才放行；这份登记已经建立，使用时仍要核对入口当前状态。
6. **明文尽量不落盘。**　查看只在内存里，内存页尽量锁住，不让系统换到页面文件；要落盘的导出只写到指定的文件夹。

3595 行｜vault_tool.py 一个文件（2.3.1 版）
145 个｜测试定义（只计数，截至 10 月 22 日，这次没有运行）；9 月 28 日实跑的 144 个和另外 40 个子用例全部通过，9 月 29 日新加的 1 个之后没跑过
23 次｜提交（6 月 23 日起）

::screen{#vault-tool-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-07",
  "section": "tech",
  "title": "还没在真实使用里验过的几道保护",
  "scene": "左上标题，标题下面一行灰色小字说明。八张横向小卡片两列四行，每张左边一个小水彩图标（一个信封里原有的纸完好、一只手插进一张新纸；一个文件被换到架子上、旁边一个回卷箭头；一个输入法候选框被划掉；一个剪贴板上挂着小沙漏；一个终端窗口的滚动条被小扫帚扫空；两个同名文件并排；一个信封后面多留一截空位；一个纸箱上贴着“上限”小标签），右边粗体一句加一两行小字；每张右上角一个黄色小圆点（待验收的颜色）。",
  "portrait": "竖版：说明小字在标题下面；八张卡片一张一行。",
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
     "size": "medium",
     "text_ref": "还没在真实使用里验过的几道保护"
    },
    {
     "type": "prose",
     "text_ref": "代码里都有"
    },
    {
     "type": "flow",
     "columns": 2,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "status": "待验收",
     "status_position": "top_right",
     "text_ref": "加文件不丢旧内容",
     "direction": "horizontal",
     "highlight": []
    }
   ],
   "notes": "八编号保护卡两列四行，黄色状态圆点卡内右上，左图右文，无连接。章节标题整宽中档（长句），说明紧接标题，保全定稿比原图更长的细节。size medium 表示原图长标题中档，实际标题排单行或合理折行，不缩正文。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "还没在真实使用里验过的几道保护"
    },
    {
     "type": "prose",
     "text_ref": "代码里都有"
    },
    {
     "type": "flow",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "status": "待验收",
     "status_position": "top_right",
     "text_ref": "加文件不丢旧内容",
     "columns_v": 1,
     "direction": "vertical",
     "highlight": []
    }
   ],
   "notes": "章节标题居中两行，灰色小说明随后；八卡整宽单列，图在卡内左侧，黄色状态点右上；原 v 前四卡、续图后四卡。；本轮将原 numbered_steps 接到现有 flow，同原有列数和连接方式；flow 支持所需左图右文，并避免 core 步骤23/30与同页侧卡24/32字号冲突。高亮/角色图标与固定分张需求仍须按报告逐项核对。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个信封里原有的纸完好、一只手插进一张新纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个文件被换到架子上、旁边一个回卷箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "一个输入法候选框被划掉",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个剪贴板上挂着小沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "代码窗口",
   "source_phrase": "一个终端窗口的滚动条被小扫帚扫空",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "两个同名文件并排",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个信封后面多留一截空位",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个纸箱上贴着“上限”小标签",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-a625b4fe783092515a60.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a625b4fe783092515a60",
   "title_text": "还没在真实使用里验过的几道保护",
   "sha256": "57610bce57e64fe8bbba75162fc4a0898356542efceb7db4c14a5927696d2213",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

还没在真实使用里验过的几道保护

代码里都有、自动测试都过；库文件最后一次改动是 7 月 27 日，下面这些是那以后才加的，或者用它的那条路至今没留下使用记录。

1. **加文件不丢旧内容。**　旧库不解到硬盘，新文件在内存里并进原内容，同名用新版；只重新加密这次打开的那一套，另一套和密码都不变（9 月 18 日起）。6 月 28 日先止住过一次“加一个文件丢掉整库”，那时是把旧库解到文件夹、叠上新文件再整库重加密。
2. **存到一半出错也不坏库。**　新密文先写临时文件、读回解一遍核对；确认原库这期间没被别的程序改过，才一下替换；替换后再解一遍。任何一步不对就放回原密文。同一个库有系统互斥锁，两个程序不能同时写（9 月 3–18 日陆续加入）。
3. **输密码时关掉输入法。**　本机窗口的密码框一拿到光标就断开输入法，免得第三方输入法的联想和云同步记下按键。
4. **复制了会自动清。**　窗口里复制，15 秒后清、关窗立刻清，只清自己复制的那段；终端里复制，20 秒后把剪贴板整个清空，程序 20 秒内就退出的话不保证清。
5. **看完连回滚记录一起清。**　终端里看完按 Enter，不只清屏，还清掉往上翻能看到的历史。
6. **取出来不覆盖。**　目标已有同名文件：内容一样算“已经有了”，不一样算冲突、留着不写；每个文件核对 SHA-256 后才放到位。把库藏进图片、从图片取回库也一样：输出位置已有文件（比如一个已有的库）就直接拒绝，旧文件一个字节不动（9 月 29 日起；之前会问要不要覆盖）。
7. **新库预留修改空间。**　新建的库在压缩包后面多留一截空位（至少 4 KiB、最多 1 MiB），在窗口里改几行字不用重建；放不下就拒绝保存，原库不动。
8. **防压缩炸弹。**　一个库最多 1 万个文件、解开后不超过 4 GiB；声称更大的直接拒绝。

::screen{#vault-tool-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "vault-tool-08",
  "section": "highlights",
  "title": "亮点",
  "scene": "一张宽大的亮点卡片，上面一幅水彩插画：一个 AI 小机器人站在一扇半开的窗户外面，窗户里一个小窗口弹出密码框，一双手在键盘上输入；窗外机器人只接到一张写着对勾的小纸条；远处一朵画着 GitHub 小猫标志和小锁的云，云里一页纸被换成一张写着“安全说明”的新纸（纸上不画可读的正文）。卡片标题用大字，下面一段正文。",
  "portrait": "竖版：插画在上，标题和正文在下。",
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
     "align": "left",
     "size": "large",
     "row": "highlight",
     "width": "47%",
     "text_ref": "亮点：AI 帮我改了私人仓库",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "私人密文仓库的说明文件在 GitHub 上是明文"
    },
    {
     "type": "illustration",
     "row": "highlight",
     "width": "53%"
    }
   ],
   "notes": "按实际原图：整屏白底左侧大毛笔两行标题和两段正文，右侧一幅占约半屏的主插画，插画在文字卡外；没有可见大卡边框，不能因 scene 写宽大亮点卡就套卡。主插画包含窗外机器人、窗口密码框、锁云，图片中 AI/安全说明 文字须依 G7 去除，非定稿字不保留。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "私人密文仓库的说明文件在 GitHub 上是明文"
    },
    {
     "type": "illustration"
    },
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点：AI 帮我改了私人仓库"
    }
   ],
   "notes": "主插画置整屏最上，毛笔大标题在插画下两行，正文接在标题下；原图无卡边框。章节标题整宽居中；图中文字按 G7 去除。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "asset": "_library/illustrations/本地输入回执.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "本地输入回执",
   "source_phrase": "一张宽大的亮点卡片，上面一幅水彩插画：一个 AI 小机器人站在一扇半开的窗户外面，窗户里一个小窗口弹出密码框，一双手在键盘上输入；窗外机器人只接到一张写着对勾的小纸条；远处一朵画着 GitHub 小猫标志和小锁的云，云里一页纸被换成一张写着“安全说明”的新纸（纸上不画可读的正文）。",
   "sha256": "d7c54c97d65c30bbc0d4029beb5515e5a6052a76b71eeff1b9d9f0042c3ec548",
   "status": "ready",
   "original_elements": [
    "一个 AI 小机器人站在一扇半开的窗户外面，窗户里一个小窗口弹出密码框，一双手在键盘上输入；窗外机器人只接到一张写着对勾的小纸条；远处一朵画着 GitHub 小猫标志和小锁的云，云里一页纸被换成一张画抽象短线的的新纸（纸上不画只画抽象短线；正文由排版程序另放"
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
   "asset": "_library/titles/title-bad9a8cf38e71ad4c472.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bad9a8cf38e71ad4c472",
   "title_text": "亮点：AI 帮我改了私人仓库，却没见到密码",
   "sha256": "1f2c43143a9231a89c1b491181bd6f1cd4641fb571701f59044c688dfd8c8c7c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**亮点：AI 帮我改了私人仓库，却没见到密码**

私人密文仓库的说明文件在 GitHub 上是明文，里面的话只该放在加密库里。7 月 8 日，AI 帮我做了这件事：把说明文件换成一段固定的安全文字，原来的说明加密进 vault.enc，一起传回私人密文仓库。要开库的那一步，AI 弹出本机的小窗口让我自己输密码，密码和原说明都只在那个窗口的进程里，回到 AI 手里的只有“成功”和提交号。

7 月 27 日往私人密文仓库更新密文，从提交说明看走的也是同一个上传脚本：先确认目标是私有仓库，不是就拒绝上传。

::screen{#vault-tool-09 section="features"}

```typeset
{
 "screen": {
  "id": "vault-tool-09",
  "section": "features",
  "title": "全部功能（1/2）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下面一行小字说明，第二张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张；图例在第一张顶上折成两行，说明小字折成两三行。",
  "links": [],
  "anchors": [
   {
    "id": "g-store",
    "text": "放进去和取出来"
   },
   {
    "id": "f-encrypt",
    "text": "加密建库"
   },
   {
    "id": "f-add",
    "text": "往库里加文件"
   },
   {
    "id": "f-view",
    "text": "终端里查看、搜索"
   },
   {
    "id": "f-window-view",
    "text": "窗口里查看"
   },
   {
    "id": "f-window-edit",
    "text": "窗口里改文字"
   },
   {
    "id": "f-export",
    "text": "只取出选中的文件"
   },
   {
    "id": "f-copy",
    "text": "复制一段文字"
   },
   {
    "id": "f-panic",
    "text": "一键销毁"
   },
   {
    "id": "g-credential",
    "text": "密码和钥匙"
   },
   {
    "id": "f-keyfile",
    "text": "密钥文件"
   },
   {
    "id": "f-argon2",
    "text": "换用 Argon2id"
   },
   {
    "id": "f-passwd",
    "text": "改密码"
   },
   {
    "id": "f-verify-pw",
    "text": "试一下密码对不对"
   },
   {
    "id": "f-rebuild",
    "text": "另做新副本"
   },
   {
    "id": "g-advanced",
    "text": "进阶"
   },
   {
    "id": "f-two-layer",
    "text": "两套内容两个密码"
   },
   {
    "id": "f-image",
    "text": "藏进图片"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "vault-tool-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "feature_header",
     "width": "43%",
     "text_ref": "全部功能（26 项）"
    },
    {
     "type": "status_legend",
     "row": "feature_header",
     "width": "57%",
     "text_ref": "图例"
    },
    {
     "type": "prose",
     "row": "feature_header",
     "text_ref": "在用＝有真实使用的记录"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "放进去和取出来",
     "row": "feature_groups",
     "width": "66%"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "feature_groups",
     "flow": "column",
     "rows": 4,
     "text_ref": "1加密建库把选中的文件和文件夹锁进一个vault.enc"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "密码和钥匙",
     "row": "feature_groups",
     "width": "34%"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "feature_groups",
     "text_ref": "9密钥文件除了密码，再要一个文件才能打开说不准10换用A"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "进阶"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "14两套内容两个密码另一个密码打开另一套内容，从文件上看"
    }
   ],
   "notes": "实际原图标题左、图例和说明在右同高，故标题不是整屏独占行。上方放进去组占左 2/3 两列，编号 1–4 左列、5–8 中列；密码组在右 1/3 单列 9–13；下方进阶两卡等宽整行。组名在本组卡片上方左对齐小档。功能卡图标左内、状态右上；原图与 scene 三列同组描述冲突，以图为准。column-major 需组件支持。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（26 项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "prose",
     "text_ref": "在用＝有真实使用的记录"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "放进去和取出来"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1加密建库把选中的文件和文件夹锁进一个vault.enc",
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "密码和钥匙"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "9密钥文件除了密码，再要一个文件才能打开说不准10换用A",
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "进阶"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "14两套内容两个密码另一个密码打开另一套内容，从文件上看",
     "columns_v": 1
    }
   ],
   "notes": "章节标题居中；图例两行、说明下面。1–8 单列左内图标，v2 原图 9–15 单列无图标，状态右上。组名毛笔中档且在组上方。原图没有第二次章节标题；建议父代理在样张验收时明确 G6 图标一致与实际原图优先的处理，不自行加图。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。"
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
   "asset": "_library/hires-icons/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁文件夹",
   "source_phrase": "加密建库｜把选中的文件和文件夹锁进一个 vault.enc，原件默认保留｜在用",
   "sha256": "78acc36e374518879cc0c4c5b223e31ab40d194c265c4eebe81873ade5d0649b",
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
   "source_phrase": "往库里加文件｜新文件在内存里并进原内容，同名用新版，另一套不动｜说不准",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "终端里查看、搜索｜按文件名或内容搜，文字只在内存里显示｜说不准",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "窗口里查看｜在本机窗口里挑一个文本文件看｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "窗口里改文字｜改库里一个文本文件，只重加密这一套｜说不准",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "只取出选中的文件｜按关键字只取匹配的文件，同名不覆盖｜说不准",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "复制一段文字｜复制文本到剪贴板，20 秒后自动清｜说不准",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "一键销毁｜清屏、内存清零、删解出的文件夹，立即退出｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "密钥文件｜除了密码，再要一个文件才能打开｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "换用 Argon2id｜算钥匙改用 Argon2id，缺依赖就报错｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "改密码｜只换这次打开那一套的密码，另一套不动｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "试一下密码对不对｜只验一次密码和密钥文件，不留任何授权｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "另做新副本｜扩容、换密钥文件时另存一份新库，旧库不动｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "两套内容两个密码｜另一个密码打开另一套内容，从文件上看不出有第二套｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "藏进图片｜把 vault.enc 接在一张图片后面，也能取回；输出位置已有文件就拒绝，不覆盖｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9927af4bc24dd2e35e4d.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9927af4bc24dd2e35e4d",
   "title_text": "全部功能（26 项）",
   "sha256": "2130e322c30a46cde1e0e6a40f881265342953e414470cadc6102485d8f68aee",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e03bbf568653cad2e0a1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e03bbf568653cad2e0a1",
   "title_text": "密码和钥匙",
   "sha256": "45af0b6d1aca61de10cec2316a5f0c3c3c0e21147990524ae2eecfafb3ac8d08",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-23ad502c91364e7e8a95.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-23ad502c91364e7e8a95",
   "title_text": "放进去和取出来",
   "sha256": "811e2cb046d4e3923d0486fc1d26d6abb0e65b29d7b11fc5566af03534a32078",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-5e70230a9631d5c877b6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5e70230a9631d5c877b6",
   "title_text": "进阶",
   "sha256": "f5af0c915ce015125b78fc1c50fd80ad8861ef2d3f51efce1b0f4d484ea94e17",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（26 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
在用＝有真实使用的记录；待验收＝做好了，还没在真实使用里验过；说不准＝用了不一定留下记录，记录里也没找到。

**放进去和取出来**
1. 加密建库｜把选中的文件和文件夹锁进一个 vault.enc，原件默认保留｜在用
2. 往库里加文件｜新文件在内存里并进原内容，同名用新版，另一套不动｜说不准
3. 终端里查看、搜索｜按文件名或内容搜，文字只在内存里显示｜说不准
4. 窗口里查看｜在本机窗口里挑一个文本文件看｜说不准
5. 窗口里改文字｜改库里一个文本文件，只重加密这一套｜说不准
6. 只取出选中的文件｜按关键字只取匹配的文件，同名不覆盖｜说不准
7. 复制一段文字｜复制文本到剪贴板，20 秒后自动清｜说不准
8. 一键销毁｜清屏、内存清零、删解出的文件夹，立即退出｜说不准

**密码和钥匙**
9. 密钥文件｜除了密码，再要一个文件才能打开｜说不准
10. 换用 Argon2id｜算钥匙改用 Argon2id，缺依赖就报错｜说不准
11. 改密码｜只换这次打开那一套的密码，另一套不动｜说不准
12. 试一下密码对不对｜只验一次密码和密钥文件，不留任何授权｜说不准
13. 另做新副本｜扩容、换密钥文件时另存一份新库，旧库不动｜待验收

**进阶**
14. 两套内容两个密码｜另一个密码打开另一套内容，从文件上看不出有第二套｜说不准
15. 藏进图片｜把 vault.enc 接在一张图片后面，也能取回；输出位置已有文件就拒绝，不覆盖｜说不准

::screen{#vault-tool-10 section="features"}

```typeset
{
 "screen": {
  "id": "vault-tool-10",
  "section": "features",
  "title": "全部功能（2/2）",
  "scene": "和照片视频录音管理页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名用毛笔小标题横跨在这组卡片上方，下面这组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下面一行小字说明，第二张没有标题、没有图例，接着往下排；上下边都不画边框。每行“编号. 功能名｜一句话｜状态”，竖线不画，状态画成圆点。",
  "portrait": "竖版：组名小标题照旧横跨在上；卡片改成一行一张（手机上）或一行两张；图例在第一张顶上折成两行，说明小字折成两三行。",
  "links": [],
  "anchors": [
   {
    "id": "g-check",
    "text": "检查和维护"
   },
   {
    "id": "f-info",
    "text": "不开库看结构"
   },
   {
    "id": "f-plan",
    "text": "动手前预演"
   },
   {
    "id": "f-recovery-check",
    "text": "恢复自检"
   },
   {
    "id": "f-migrate",
    "text": "旧格式升级"
   },
   {
    "id": "f-cleanup-source",
    "text": "加密后删原件"
   },
   {
    "id": "f-clean-plaintext",
    "text": "清理残留明文"
   },
   {
    "id": "f-clean-backups",
    "text": "清理旧库备份"
   },
   {
    "id": "f-vault-links",
    "text": "认资料加密盘的挂载点"
   },
   {
    "id": "g-backup",
    "text": "备份到私人仓库"
   },
   {
    "id": "f-publish",
    "text": "密文传到私人仓库"
   },
   {
    "id": "f-verify-remote",
    "text": "核对 私人密文仓库"
   },
   {
    "id": "f-protect-readme",
    "text": "保护 私人密文仓库的说明文件"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "vault-tool-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "检查和维护"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "item_spans": {
      "23": 2
     },
     "text_ref": "16. 不开库看结构｜不用密码看格式、参数、要不要密钥文件、结构坏没坏｜在用"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "备份到私人仓库"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "24. 密文传到私人仓库｜把 vault.enc 原样传到私人密文仓库，读回比对字节｜在用"
    }
   ],
   "notes": "续屏没有全部功能章节标题、没有图例。检查维护八卡 3+3+2 排列，其中最后一张 23 横跨后两列、22 占第一列；下面备份组三卡一行。组名毛笔中档在组上方；图标卡内左，状态右上。item_spans=23:2 需要组件扩展，不能假称 columns=3 已完全表达。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "检查和维护"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "16. 不开库看结构｜不用密码看格式、参数、要不要密钥文件、结构坏没坏｜在用",
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "备份到私人仓库"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "24. 密文传到私人仓库｜把 vault.enc 原样传到私人密文仓库，读回比对字节｜在用",
     "columns_v": 1
    }
   ],
   "notes": "所有功能卡整宽单列左图右文；v 第 16–21 卡，v2 第 22、23 卡和备份组。v2 原图顶上重复检查维护组名，定稿只出现一次，重排连续屏不重复定稿文字；如分页必须回显须 data-echo。没有图例。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "source_phrase": "不开库看结构｜不用密码看格式、参数、要不要密钥文件、结构坏没坏｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "动手前预演｜先查路径、格式、大小超没超限，给出下一步，不执行｜说不准",
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
   "source_phrase": "恢复自检｜用临时密码在内存里跑一遍，确认这台电脑能开库｜待验收",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "旧格式升级｜VAULT01、02 重新加密成 VAULT03，先留旧库｜在用",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "加密后删原件｜只删和打包时一模一样的原件，改过的留着｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "清理残留明文｜清掉上次没清干净的 decrypted/｜说不准",
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
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "清理旧库备份｜升级、改密留下的旧库副本，确认后删掉｜说不准",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "认资料加密盘的挂载点｜电脑配置为资料目录整体加密登记的挂载点可以当路径用；登记还没建｜待验收",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "密文传到 Key｜把 vault.enc 原样传到私人 Key 仓库，读回比对字节｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核对 Key 仓库｜确认目标是私有仓库、路径在｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "保护 Key 的说明文件｜说明文件在 GitHub 上是明文，换成固定的安全文字，原说明加密进库｜在用",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c68f20b8b04ed36f07ad.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c68f20b8b04ed36f07ad",
   "title_text": "备份到私人仓库",
   "sha256": "ed3265b2189fb0f66d220e78d53a41f410130d32e55eff21ba41bb5d56b1f876",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-a3c4b76cad78bf07f59b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a3c4b76cad78bf07f59b",
   "title_text": "检查和维护",
   "sha256": "8f7e15030716bf626b5d5d7aebf16ce10d451b304248b89969f341b6dfc8c24e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**检查和维护**
16. 不开库看结构｜不用密码看格式、参数、要不要密钥文件、结构坏没坏｜在用
17. 动手前预演｜先查路径、格式、大小超没超限，给出下一步，不执行｜说不准
18. 恢复自检｜用临时内容在内存里跑一遍，确认这台电脑的环境能开库；不碰真库｜待验收
19. 旧格式升级｜VAULT01、02 重新加密成 VAULT03，先留旧库｜在用
20. 加密后删原件｜只删和打包时一模一样的原件，改过的留着｜待验收
21. 清理残留明文｜清掉上次没清干净的 decrypted/｜说不准
22. 清理旧库备份｜升级、改密留下的旧库副本，确认后删掉｜说不准
23. 认登记过的目录入口｜电脑配置已建立登记，入口和实际指向一致时可用；本项目真实使用仍待验收｜待验收

**备份到私人仓库**
24. 密文传到私人仓库｜把 vault.enc 原样传到私人密文仓库，读回比对字节｜在用
25. 核对私人仓库｜确认目标是私有仓库、路径在；不回读密文｜说不准
26. 保护私人仓库的说明文件｜说明文件在 GitHub 上是明文，换成固定的安全文字，原说明加密进库｜在用

::screen{#vault-tool-11 section="history"}

```typeset
{
 "screen": {
  "id": "vault-tool-11",
  "section": "history",
  "title": "演进",
  "scene": "一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：一个信封从单薄的一层慢慢变成里面叠着两张卡片、贴着挂锁，旁边一朵带锁的云，像一路长出来的样子。",
  "portrait": "竖版：时间线在上，插画缩小放在最后。",
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
     "align": "left",
     "size": "large",
     "row": "history-header",
     "width": "58%",
     "text_ref": "演进",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "history-header",
     "width": "42%",
     "size": "small",
     "target_height": 280,
     "align": "right"
    },
    {
     "type": "timeline",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "ribbon",
     "text_ref": "6 月 23 日",
     "direction": "vertical",
     "connector_style": "thin_line",
     "split_at": 4
    },
    {
     "type": "timeline",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      8
     ],
     "connector": "ribbon",
     "text_ref": "9 月 29 日",
     "direction": "vertical",
     "connector_style": "thin_line"
    },
    {
     "type": "notice",
     "align": "center",
     "text_ref": "截至 10 月 11 日共 23 次提交。"
    }
   ],
   "notes": "左侧竖向时间线九节点，细绿实线/空心圆在卡片左外，卡内图标在左、日期粗体。右侧主插画在卡片外，从单层信封发展成锁信封再到锁云，绿色箭头连接，底下提交数浅条；章节标题只占左栏，靠左。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。\n2026-10-06 Astra复核退回：恢复原双栏，仅拆出末节点为整行；前段保持双栏，末图标明确使用本屏原序列的最后一个。"
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
     "type": "timeline",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "ribbon",
     "illustration_after_item": 4,
     "text_ref": "6 月 23 日",
     "columns_v": 1,
     "direction": "vertical",
     "connector_style": "thin_line"
    },
    {
     "type": "notice",
     "align": "center",
     "text_ref": "截至 10 月 11 日共 23 次提交。"
    }
   ],
   "notes": "以实际原图为准：前四时间节点后，主插画横向一行位于第 4（7月23–27）和第 5（8月31–9月3）之间；续图再五节点和提交数浅条。portrait 所写插画最后与原图冲突。本屏 bullets 为单一节点，现 text_ref 不能切到第5条，需 timeline 组件按 illustration_after_item=4 插入资产；未支持前不能声称构图还原。时间线细绿线在卡片左外，卡内左图右文，标题原图小左档。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "6 月 23 日：第一版：scrypt 加 AES-256-GCM 的离线加密小工具。",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "6 月 28 日：新格式 VAULT03：密钥文件、两套内容、藏进图片、内存锁页、按内容搜索；先止住“加一个文件丢掉整库”；加了旧格式升级。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "7 月 7–8 日：私人 Key 仓库建起来，密文第一次备份上去；加了不看内容的检查命令，AI 能帮上忙了；Key 的说明文件换成安全文字。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "7 月 23–27 日：Key 里的密文又更新了几版；AI 能打开本机窗口改库里的文字。7 月 27 日是最近一次上传。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "8 月 31 日–9 月 3 日：安全删除只删自己的文件；拒绝被截断的库；保存改成写完读回再核对。",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "9 月 18 日：保存、导出、回滚整套加固；加文件改成在内存里合并，另一套不再受牵连；加了另做新副本、恢复自检、动手前预演。",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "9 月 25 日：认电脑配置登记过的加密盘入口，为以后把资料目录整体加密做准备。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "9 月 26 日：按我的决定，“帮我加密这个文件”默认改走密码中心，这里只管 vault.enc 和 Key 仓库。",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 29 日：藏进图片、从图片取回改成不覆盖已有文件，命令行不会再把已有的库盖掉。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/密封文件钥匙.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "密封文件钥匙",
   "source_phrase": "右侧一幅大一点的水彩插画：一个信封从单薄的一层慢慢变成里面叠着两张卡片、贴着挂锁，旁边一朵带锁的云，像一路长出来的样子。",
   "sha256": "403ce13ac20240234cb5c83107cbfe12f712515dc8e047df1cbe2246f6868cf2",
   "status": "ready",
   "original_elements": [
    "一个信封从单薄的一层慢慢变成里面叠着两张卡片、贴着挂锁，旁边一朵带锁的云，像一路长出来的样子"
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

- **6 月 23 日**：第一版：scrypt 加 AES-256-GCM 的离线加密小工具。
- **6 月 28 日**：新格式 VAULT03：密钥文件、两套内容、藏进图片、内存锁页、按内容搜索；先止住“加一个文件丢掉整库”；加了旧格式升级。
- **7 月 7–8 日**：私人密文仓库建起来，密文第一次备份上去；加了不看内容的检查命令，AI 能帮上忙了；仓库的说明文件换成安全文字。
- **7 月 23–27 日**：私人密文仓库里的密文又变了两次；AI 能打开本机窗口改库里的文字。7 月 27 日是最近一次推送。
- **8 月 31 日–9 月 3 日**：安全删除只删自己的文件；拒绝被截断的库；保存改成写完读回再核对。
- **9 月 18 日**：保存、导出、回滚整套加固；加文件改成在内存里合并，另一套不再受牵连；加了另做新副本、恢复自检、动手前预演。
- **9 月 25 日**：认电脑配置登记过的目录入口（登记过、指向对得上才放行），不是把资料目录自动整体加密。
- **9 月 26 日**：按我的决定，“帮我加密这个文件”默认改走密码中心，这里只管 vault.enc 和私人密文仓库。
- **9 月 29 日**：藏进图片、从图片取回改成输出位置已有文件就直接拒绝，不再问要不要覆盖。

截至 10 月 11 日共 23 次提交。
