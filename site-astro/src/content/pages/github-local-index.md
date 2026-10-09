---
{
 "title": "GitHub 项目总索引",
 "kind": "project",
 "url": "/projects/github-index/",
 "tagline": "找全代码仓库，查清副本和同步情况。",
 "old_urls": [
  "/projects/github-local-index/"
 ],
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "usage",
   "label": "怎么用",
   "img": "/_shared/nav-unify-standard/nav-unify-label-43-9fe7ee9705.webp"
  },
  {
   "id": "tech",
   "label": "技术",
   "img": "/_shared/nav-unify-standard/nav-unify-label-49-4aa1a3c674.webp"
  },
  {
   "id": "highlights",
   "label": "亮点",
   "img": "/_shared/nav-unify-standard/nav-unify-label-13-ba0d3fdcc6.webp"
  },
  {
   "id": "features",
   "label": "全部功能",
   "img": "/_shared/nav-unify-standard/nav-unify-label-25-6c8f61c250.webp"
  },
  {
   "id": "history",
   "label": "演进",
   "img": "/_shared/nav-unify-standard/nav-unify-label-55-f8367a4ec7.webp"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "github-local-index",
  "kind": "project",
  "title": "GitHub 项目总索引",
  "url": "/projects/github-index/",
  "old_urls": [
   "/projects/github-local-index/"
  ],
  "tagline": "找全代码仓库，查清副本和同步情况。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "认准每个代码仓库和它的去向",
  "based_on": {
   "commit": "56ceea70f4a128955676d828ac45c4a29054bde3",
   "commit_time": "2026-09-28T09:14:01+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：摊开的大账本上，一行行仓库小卡片轻轻浮起又落下；右页从小文件夹里长出的细绿线慢慢向主干延伸，一只放大镜沿着其中一根线缓缓移动，经过时线头的小圆点由灰变绿；有一根线还没接上主干，放大镜在它上面停一下；右上角 GitHub 小猫标志轻轻眨眼；背景水彩微微流动，偶尔一片小叶子飘过。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-find",
     "name": "找到和认准仓库"
    },
    {
     "id": "g-sync",
     "name": "查同步"
    },
    {
     "id": "g-publish",
     "name": "公开和分享之前"
    },
    {
     "id": "g-ledger",
     "name": "总表的维护"
    },
    {
     "id": "g-site",
     "name": "给网站和驾驶舱"
    },
    {
     "id": "g-major",
     "name": "仓库大动作"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-locate",
     "group": "g-find",
     "name": "找仓库在哪",
     "what": "说项目名，AI 查到它的 GitHub 仓库和本机文件夹；45 个都登记着",
     "how": "AI 进项目时自己查总表和导航登记",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "E:\\GitHub总索引\\config\\repository-paths.json；看板第 11–13 行；使用记录 Get-ProjectAdmission.ps1 160 次（9 月 16–28 日）"
    },
    {
     "id": "f-identity",
     "group": "g-find",
     "name": "认准是哪个仓库",
     "what": "回读文件夹里的 .git，确认连着的仓库和登记一致，不凭目录名猜",
     "how": "单仓库查询 Get-ProjectAdmission 自动做",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "docs/contracts/git.project-admission.md“权威输入”；tools/Get-ProjectAdmission.ps1；使用记录 160 次"
    },
    {
     "id": "f-visibility",
     "group": "g-find",
     "name": "查公开还是私有",
     "what": "总表记着上次看到的；要准，就联网问 GitHub 当下的",
     "how": "问 AI 这个仓库现在公不公开；联网那档用 -LiveMetadata",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "repository-paths.json visibility 字段；git.project-admission.md“核心机制”"
    },
    {
     "id": "f-frozen",
     "group": "g-find",
     "name": "标出冻结的项目",
     "what": "名单从生效的规则读；9 个冻结的只核对身份和位置",
     "how": "刷新时自动标",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "AGENTS.md 第 15 行；git.refresh-consistency.md“刷新与原子快照”末段；看板 9 个“已冻结”"
    },
    {
     "id": "f-live-modes",
     "group": "g-find",
     "name": "按需联网核对",
     "what": "三档：只问 GitHub 的信息、再拉最新远端分支、发布前两样都要新鲜",
     "how": "单仓库查询加 -LiveMetadata、-RefreshRefs 或 -ForPublication",
     "status": "说不准",
     "screen": "github-local-index-08",
     "source": "git.project-admission.md“核心机制”；使用记录只有命令名没有参数，分不出用了哪档"
    },
    {
     "id": "f-sync-all",
     "group": "g-sync",
     "name": "查全部工作目录",
     "what": "同一个仓库的所有工作目录和分支一起查：没提交的、没推送的、领先落后几个",
     "how": "单仓库查询默认就查全部",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "docs/contracts/git.worktree-sync.md“核心机制”；看板 75 个路径"
    },
    {
     "id": "f-unmerged",
     "group": "g-sync",
     "name": "找出没进主线的提交",
     "what": "每条分支都和 GitHub 上的默认分支比，写明主线缺几个提交",
     "how": "单仓库查询和总表刷新都会算",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "git.worktree-sync.md；看板 PCConfig 行“默认分支缺少 9 个提交”；提交 4088380"
    },
    {
     "id": "f-residual",
     "group": "g-sync",
     "name": "分出能收的残留",
     "what": "内容已进主线的临时分支和目录标成残留，确认没人在用再收",
     "how": "看板“Git 下一步”一列",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "git.worktree-sync.md“retirement candidate，不自动删除”；看板 10 个仍需处理"
    },
    {
     "id": "f-retention",
     "group": "g-sync",
     "name": "有专门用途的分支不误报",
     "what": "3 条专门分支、1 个冻结仓库的历史、1 个回滚用的目录登记在案，不算没合的活",
     "how": "登记在 config/git-artifact-governance.json",
     "status": "在用",
     "screen": "github-local-index-08",
     "source": "config/git-artifact-governance.json entries 3、repository_overrides 1、retentions 1"
    },
    {
     "id": "f-target",
     "group": "g-sync",
     "name": "只看这次的目标",
     "what": "一个仓库开着好几个目录时，只让这次要推的那个参与判断，别的照样列出",
     "how": "单仓库查询加 -TargetWorktree 或 -TargetRef",
     "status": "说不准",
     "screen": "github-local-index-08",
     "source": "git.project-admission.md；使用记录没有参数"
    },
    {
     "id": "f-exposure",
     "group": "g-publish",
     "name": "敏感文件提示",
     "what": "公开仓库的目录里出现 .env、私钥、secrets 文件夹这类文件，查询直接判“挡住”；日志、数据库文件列出来请 AI 复看",
     "how": "单仓库查询对公开仓库自动做",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "tools/PublicExposurePolicy.psd1；Get-ProjectAdmission 输出 public_exposure_conflict、public_exposure_review_candidates"
    },
    {
     "id": "f-matrix",
     "group": "g-publish",
     "name": "推送放行规则",
     "what": "一张表写清什么情况能推、什么情况先停",
     "how": "AI 推送前读 05_规则与模板/推送放行与否决规则.md",
     "status": "说不准",
     "screen": "github-local-index-09",
     "source": "05_规则与模板/推送放行与否决规则.md；读没读不留记录"
    },
    {
     "id": "f-companion",
     "group": "g-publish",
     "name": "找到私有配套说明",
     "what": "公开项目的内部说明放在一个私有仓库里，AI 维护时按登记找到；现在登记了 3 个项目",
     "how": "AI 进项目时经技能 project-entry-gate 查",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "docs/private-companion-discovery.md；使用记录 Get-ProjectPrivateCompanion.ps1 212 次；catalog.json 3 个 source"
    },
    {
     "id": "f-refresh",
     "group": "g-ledger",
     "name": "刷新总表",
     "what": "重新扫描，看板页和仓库清单一起重写，每个文件整份替换",
     "how": "仓库新建、搬家、改名、删库后，AI 跑 Refresh-GitHubLocalIndex.ps1",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "git.refresh-consistency.md；刷新日志 9 月 10 次；使用记录 Update-GitHubIndex 12 次、Refresh 10 次"
    },
    {
     "id": "f-consistency",
     "group": "g-ledger",
     "name": "检查总表对不对",
     "what": "拿现场重新生成一份来比，报出差在哪；不改、不提交",
     "how": "AI 跑 Test-GitHubLocalIndexConsistency.ps1",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "git.refresh-consistency.md“CheckOnly”；使用记录 15 次（9 月 20–27 日）"
    },
    {
     "id": "f-owner-status",
     "group": "g-ledger",
     "name": "给别的基座的状态摘要",
     "what": "别的基座（例如体检）来问“Git 这块现在怎样”时，它不改任何文件，只回答“当前、要复核、被挡住、不知道”四种之一",
     "how": "Get-GitOwnerStatus.ps1 -Json",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "git.refresh-consistency.md“输出与失败”；使用记录 9 月 27 日单独调用 2 次；刷新时 Refresh-GitHubLocalIndex.ps1 第 89 行也载入它推进基线"
    },
    {
     "id": "f-repo-home",
     "group": "g-ledger",
     "name": "新仓库放哪",
     "what": "新的个人仓库放 V:\\Personal\\Projects，临时工作目录放 V:\\Personal\\Worktrees，Z 盘不放仓库",
     "how": "AI 新建或 clone 时照做",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "AGENTS.md 第 17 行"
    },
    {
     "id": "f-site-registry",
     "group": "g-site",
     "name": "网站项目登记",
     "what": "哪些项目上网站、叫什么：30 个公开介绍、4 个冻结的只放静态页、12 个不上（其中 1 条是改名前留下的旧名）；新仓库默认不上",
     "how": "改 config/website-projects.json",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "config/website-projects.json；docs/contracts/git.website-projects.md；tests/Test-WebsiteProjects.ps1 第 18–19 行"
    },
    {
     "id": "f-dashboard-facts",
     "group": "g-site",
     "name": "项目数字",
     "what": "给驾驶舱算每个项目 7 天提交数、最后一次提交、没合的分支、和 GitHub 同步没有；不联网",
     "how": "电脑配置与恢复的看板接口每次打开时调用",
     "status": "在用",
     "screen": "github-local-index-09",
     "source": "tools/collect_dashboard_facts.py；PCConfig public_dashboard_projects.py；看板接口 29 个项目 in_sync"
    },
    {
     "id": "f-create",
     "group": "g-major",
     "name": "新建仓库",
     "what": "只在我的账号下建空仓库，先核对同名仓库确实不存在",
     "how": "Invoke-ProtectedGitHubMajorAction.ps1 -Operation create-repository",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "docs/contracts/git.protected-major-actions.md 参数表；9 月 27 日 20:24 重写后无调用记录"
    },
    {
     "id": "f-rename",
     "group": "g-major",
     "name": "仓库改名",
     "what": "核对旧名、公开范围、默认分支，确认新名没被占，改完读回",
     "how": "-Operation rename-repository",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "同上"
    },
    {
     "id": "f-set-visibility",
     "group": "g-major",
     "name": "改公开范围",
     "what": "核对当前是公开还是私有再改，改完读回",
     "how": "-Operation set-visibility",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "同上"
    },
    {
     "id": "f-default-branch",
     "group": "g-major",
     "name": "改默认分支",
     "what": "核对当前默认分支再改，改完读回",
     "how": "-Operation set-default-branch",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "同上"
    },
    {
     "id": "f-delete-transfer",
     "group": "g-major",
     "name": "删库和转移",
     "what": "固定先预演：把所有分支、标签拉到本地各留一个备份记号，列出 issue、发布包等只在网页上的东西，拿给我看过再正式删或转移",
     "how": "先加 -DryRun 预演并呈现给本人，再去掉 -DryRun 正式调用 -Operation delete-repository 或 transfer-repository",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "git.protected-major-actions.md“内容保全和回读”；同上；提交 e2ccb37（9 月 29 日 01:15，删库和转移固定先预演再呈现）"
    },
    {
     "id": "f-refs",
     "group": "g-major",
     "name": "删分支、挪分支",
     "what": "删分支，或把分支挪到别的提交：原来的提交还在别的分支或标签里留着才动；删 GitHub 上的分支时，如果这期间有人推了新提交就不删",
     "how": "-Operation delete-local-ref、delete-remote-ref 或 force-update-local-ref",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "git.protected-major-actions.md 第一张表和“内容保全和回读”"
    },
    {
     "id": "f-remote",
     "group": "g-major",
     "name": "换远端地址",
     "what": "新地址必须是我登录的 GitHub 账号下、声明的那个仓库",
     "how": "-Operation replace-remote-url",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "git.protected-major-actions.md 第一张表"
    },
    {
     "id": "f-dryrun",
     "group": "g-major",
     "name": "先预演",
     "what": "同一条命令加上预演：检查目标、生成网页内容清单，不改 GitHub；删库和转移必须先走这一步",
     "how": "加 -DryRun",
     "status": "待验收",
     "screen": "github-local-index-10",
     "source": "git.protected-major-actions.md“一次调用”；提交 e2ccb37"
    },
    {
     "id": "f-hook",
     "group": "g-retired",
     "name": "提交前拦密钥",
     "what": "7 月 8 日加，9 月 27 日删：AI 对密钥本来就警觉，密钥放密码中心",
     "how": "已删",
     "status": "已停用",
     "screen": "github-local-index-10",
     "source": "提交 84c4056、b7fb62f；决定 ZS36"
    },
    {
     "id": "f-push-record",
     "group": "g-retired",
     "name": "推送里程碑记录",
     "what": "记下每次重要推送；9 月 26 日删，我不记得用过",
     "how": "已删",
     "status": "已停用",
     "screen": "github-local-index-10",
     "source": "提交 bfa2e7f 删 tools/Add-PushRecord.ps1、03_推送决策/已推送记录.md；决定 B6、D7"
    },
    {
     "id": "f-cognition",
     "group": "g-retired",
     "name": "项目来源分页查询",
     "what": "给已退役的个人知识库用，没有调用方了，9 月 26 日删",
     "how": "已删",
     "status": "已停用",
     "screen": "github-local-index-10",
     "source": "提交 9db026a；决定 D7"
    },
    {
     "id": "f-generations",
     "group": "g-retired",
     "name": "多代公开快照",
     "what": "总表曾是 8 份公开文档、留几代副本；9 月 26 日改成一页私有看板，旧版从 Git 历史找",
     "how": "已删",
     "status": "已停用",
     "screen": "github-local-index-10",
     "source": "刷新日志“PUBLISHED generation … documents=8”；提交 bfa2e7f；决定 A3"
    },
    {
     "id": "f-task-map",
     "group": "g-retired",
     "name": "计划任务地图",
     "what": "7 月时这里也出计划任务的健康表和地图，8 月下旬起交给电脑配置与恢复",
     "how": "已搬走",
     "status": "已停用",
     "screen": "github-local-index-10",
     "source": "04_计划任务/用户自动化任务治理建议.md；刷新日志最后一次 user automation map 在 8 月 21 日（本机时间）"
    }
   ],
   "numbers": [
    {
     "id": "n-repos",
     "text": "45 个｜21 个公开、24 个私有",
     "meaning": "GitHub 账号下登记的全部仓库",
     "as_of": "2026-09-28",
     "source": "00_总览/当前同步看板.md 第 11–13 行；config/repository-paths.json 45 条（北京 9 月 28 日 01:40 刷新）",
     "screens": [
      "github-local-index-01",
      "github-local-index-03",
      "github-local-index-08",
      "github-local-index-11"
     ]
    },
    {
     "id": "n-worktrees",
     "text": "75 个｜30 个临时目录",
     "meaning": "看板“本地路径”一列逐格计数；含 Cache 或 Worktrees 的算临时",
     "as_of": "2026-09-28",
     "source": "_count_board.py 统计 00_总览/当前同步看板.md",
     "screens": [
      "github-local-index-01"
     ]
    },
    {
     "id": "n-frozen",
     "text": "9 个",
     "meaning": "看板“维护状态”为已冻结的仓库",
     "as_of": "2026-09-28",
     "source": "看板第 13 行",
     "screens": [
      "github-local-index-01",
      "github-local-index-08"
     ]
    },
    {
     "id": "n-admission-calls",
     "text": "160 次（9 月 16–28 日）",
     "meaning": "AI 使用记录里 Get-ProjectAdmission.ps1 的调用条数（Codex 157、Claude 3；Claude 记录 9 月 24 日才开始）",
     "as_of": "2026-09-28",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl 按命令名精确计数",
     "screens": [
      "github-local-index-01"
     ]
    },
    {
     "id": "n-need",
     "text": "仍需处理：10 个",
     "meaning": "看板“仍需处理”表的行数",
     "as_of": "2026-09-28",
     "source": "看板“## 仍需处理”",
     "screens": [
      "github-local-index-03"
     ]
    },
    {
     "id": "n-cached",
     "text": "36 个仓库没联网问 GitHub",
     "meaning": "那次刷新里远端状态来自本机缓存的仓库数",
     "as_of": "2026-09-28",
     "source": "看板第 17 行",
     "screens": [
      "github-local-index-03"
     ]
    },
    {
     "id": "n-pcconfig-wt",
     "text": "9 个工作目录（另有 8 个临时目录）",
     "meaning": "PCConfig 行本地路径条数",
     "as_of": "2026-09-28",
     "source": "看板 PCConfig 行",
     "screens": [
      "github-local-index-03",
      "github-local-index-07"
     ]
    },
    {
     "id": "n-unmerged",
     "text": "比主线多 9 个提交",
     "meaning": "gpt-child/20260928-005025-final-cleanup 分支 ahead 9、默认分支缺少 9 个提交",
     "as_of": "2026-09-28",
     "source": "看板 PCConfig 行",
     "screens": [
      "github-local-index-03",
      "github-local-index-07"
     ]
    },
    {
     "id": "n-dirty",
     "text": "115 处没提交",
     "meaning": "wly0829.cn 网站重做工作副本的脏文件数",
     "as_of": "2026-09-28",
     "source": "看板 wly0829.cn 行",
     "screens": [
      "github-local-index-03"
     ]
    },
    {
     "id": "n-refresh",
     "text": "9 月刷新过 10 次",
     "meaning": "主目录刷新日志里 9 月的“refresh started”条数（本机日期 9-04 至 9-27，最后一次＝北京 9 月 28 日 01:39）",
     "as_of": "2026-09-28",
     "source": "99_private/logs/GitHubLocalIndexRefresh.log",
     "screens": [
      "github-local-index-04"
     ]
    },
    {
     "id": "n-code",
     "text": "工具 7,515 行；测试 10 个脚本 3,932 行",
     "meaning": "git ls-files 下 tools/、tests/ 逐个 wc -l",
     "as_of": "2026-09-28",
     "source": "提交 56ceea7",
     "screens": [
      "github-local-index-05"
     ]
    },
    {
     "id": "n-commits",
     "text": "455 次提交（7 月 5 日–9 月 28 日）",
     "meaning": "git log 计数，时间换算成北京",
     "as_of": "2026-09-28",
     "source": "提交 56ceea7",
     "screens": [
      "github-local-index-05"
     ]
    },
    {
     "id": "n-gh-limit",
     "text": "一次最多 200 个",
     "meaning": "gh repo list --limit 200",
     "as_of": "2026-09-28",
     "source": "tools/Update-GitHubIndex.ps1 第 1042 行",
     "screens": [
      "github-local-index-05"
     ]
    },
    {
     "id": "n-collector",
     "text": "每个仓库最多算 1.2 秒",
     "meaning": "collect_dashboard_facts.py 每仓库时间预算",
     "as_of": "2026-09-28",
     "source": "tools/collect_dashboard_facts.py 第 30 行",
     "screens": [
      "github-local-index-05"
     ]
    },
    {
     "id": "n-entry-lines",
     "text": "2,746 行 → 896 行",
     "meaning": "大动作入口脚本重写前后的行数",
     "as_of": "2026-09-28",
     "source": "git show b7fb62f~1:tools/Invoke-ProtectedGitHubMajorAction.ps1；现行文件",
     "screens": [
      "github-local-index-06"
     ]
    },
    {
     "id": "n-retention",
     "text": "3 条专门分支、1 个冻结仓库的历史、1 个回滚用的目录",
     "meaning": "git-artifact-governance.json 三类登记条数",
     "as_of": "2026-09-28",
     "source": "config/git-artifact-governance.json",
     "screens": [
      "github-local-index-08"
     ]
    },
    {
     "id": "n-companion",
     "text": "登记了 3 个项目",
     "meaning": "私有配套 catalog 的 source 数",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\public-project-private-backup\\catalog.json",
     "screens": [
      "github-local-index-09"
     ]
    },
    {
     "id": "n-site",
     "text": "30 个公开介绍、4 个冻结的只放静态页、12 个不上（其中 1 条是改名前留下的旧名）",
     "meaning": "website-projects.json 的 website.visibility 计数",
     "as_of": "2026-09-28",
     "source": "config/website-projects.json",
     "screens": [
      "github-local-index-09"
     ]
    },
    {
     "id": "n-48",
     "text": "48 个仓库",
     "meaning": "9 月 1 日那一代总表的仓库数",
     "as_of": "2026-09-01",
     "source": "提交 8cbafc5",
     "screens": [
      "github-local-index-11"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-skill-entry-gate",
     "with": "project-entry-gate（技能）",
     "direction": "交给",
     "flow": "AI 进项目、收尾、准备公开时经这个技能调单仓库查询和私有配套查询；9 月 16–28 日技能被调 266 次",
     "source": "E:\\.agents\\skills\\project-entry-gate\\SKILL.md；使用记录"
    },
    {
     "id": "r-agents-rules",
     "with": "agents",
     "direction": "拿来",
     "flow": "冻结名单、公开分级、重大动作规则都从生效的规则读，这里不另存；规则里写明只有 Git 事实会改变决定时才问总索引",
     "source": "AGENTS.md 第 14–15 行；E187 agents.context-sources.md 第 10、14 行"
    },
    {
     "id": "r-agents-doctor",
     "with": "agents（只读体检脚本）",
     "direction": "交给",
     "flow": "基座体检调单仓库查询核对各仓库；每周基座体检这个 Codex 自动任务查三个基座的 git 状态，驾驶舱把它记在本项目名下",
     "source": "E:\\.agents\\tools\\Invoke-ControlPlaneDoctor.ps1 第 18 行；PCConfig registries/dashboard_sources.json 第 192 行"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "删库、转移、私有改公开、新建公开仓库时，入口先查无限制授权，没有就请密码中心做一次本人验证，拿回回执",
     "source": "docs/contracts/git.protected-major-actions.md“本人验证”"
    },
    {
     "id": "r-pcconfig-cockpit",
     "with": "pcconfig",
     "direction": "交给",
     "flow": "看板接口每次打开时读网站项目登记，调 collect_dashboard_facts.py 拿各项目 7 天提交数、最后提交、没合的分支、同步状态，显示在驾驶舱",
     "source": "git.website-projects.md；PCConfig tools/remote-computer-mcp/public_dashboard_projects.py；registries/dashboard_sources.json 第 167 行"
    },
    {
     "id": "r-pcconfig-recovery",
     "with": "pcconfig",
     "direction": "一起备份",
     "flow": "三个核心仓库之一：每天的加密系统镜像带着它没推送的改动；换机时和另两个基座最先从 GitHub 拉回，是其他项目恢复的入口",
     "source": "PCConfig registries/core_recovery.json 第 36–56 行；docs/recovery/scheduled_tasks_rebuild.md 第 25 行；three_base_local_unique.md 第 3 行"
    },
    {
     "id": "r-private-backup",
     "with": "public-project-private-backup（私有仓库）",
     "direction": "拿来",
     "flow": "公开项目的内部说明存在这个私有仓库，总索引按登记找到对应文件（只给路径和状态，不读正文）",
     "source": "docs/private-companion-discovery.md；99_private/registries/public-project-private-companion.json"
    },
    {
     "id": "r-github",
     "with": "GitHub（外部服务）",
     "direction": "拿来",
     "flow": "用 GitHub 命令行读仓库列表、公开范围、默认分支；大动作入口经它新建、改名、改公开范围、删库、转移，做完读回",
     "source": "tools/Update-GitHubIndex.ps1 第 1042 行；Invoke-ProtectedGitHubMajorAction.ps1"
    },
    {
     "id": "r-website",
     "with": "网站 wly0829.cn",
     "direction": "交给",
     "flow": "哪些项目上网站、叫什么名字、冻结的只放静态页，由这里的 website-projects.json 决定；网站自己不存名单",
     "source": "docs/contracts/git.website-projects.md"
    }
   ],
   "highlights": [
    {
     "id": "h-all-worktrees",
     "title": "一个仓库，九个工作目录",
     "screen": "github-local-index-07"
    },
    {
     "id": "h-read-fail",
     "title": "读不出来，不等于对不上",
     "screen": "github-local-index-07"
    }
   ],
   "mentions": [
    {
     "target": "/projects/agents/",
     "screen": "github-local-index-01",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "github-local-index-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "github-local-index-02",
     "text": "哪几种要我亲自验证，见〔重大动作与本人验证〕"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "github-local-index-02",
     "text": "跟 AI 怎么说、完整的例子：见技能〔project-entry-gate〕"
    },
    {
     "target": "/projects/agents/",
     "screen": "github-local-index-02",
     "text": "它归〔AI 规则与技能基座〕管"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "github-local-index-04",
     "text": "换机怎么做见〔电脑配置与恢复〕"
    },
    {
     "target": "/rules/charter/#L24",
     "screen": "github-local-index-06",
     "text": "冻结名单（〔约法 L24〕）"
    },
    {
     "target": "/projects/password-center/",
     "screen": "github-local-index-06",
     "text": "密钥都在〔密码中心〕"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "github-local-index-10",
     "text": "哪几种要我验证：见〔重大动作与本人验证〕"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "基座体检当前运行状态；未启用时显示“暂无启用中的任务”",
     "source": "/computer-access/api/status → automation.items 里 id 为 codex-automation:github 的一条（project＝GitHub 仓库总表）：state、last_run_at、next_run_at；以及 projects.items 本项目的 health_reason"
    },
    {
     "slot": "sync",
     "meaning": "网站上各项目的仓库和 GitHub 同步没有：几个已同步、几个要看（本项目算出的数，不联网，比的是本机缓存的远端引用）",
     "source": "/computer-access/api/status → projects.items[].github_sync.state（collect_dashboard_facts.py 给的；source=cached_remote_ref）"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“查同步和未交付修改”拆成 f-sync-all“查全部工作目录”和 f-unmerged“找出没进主线的提交”，另把看板“Git 下一步”写成 f-residual；三者是不同的判断，本人想看哪些该退役时分开更清楚。",
    "底稿“发布前查敏感内容”拆成 f-exposure“敏感文件提示”（在用，住在 PublicExposurePolicy.psd1 和单仓库查询里）和 f-hook“提交前拦密钥”（已停用：底稿的证据文件 tools/Install-GitHook.ps1 已在 9 月 27 日 b7fb62f 删除，决定 ZS36）。",
    "底稿“更改仓库设置”拆成 f-rename、f-set-visibility、f-default-branch 三项；“整理分支和远端”拆成 f-refs、f-remote；另补 f-dryrun（入口的预演模式）。",
    "底稿“新建代码仓库”写成 f-create；“删除或转移仓库”写成 f-delete-transfer；“刷新仓库总表”写成 f-refresh；“检查总表是否过时”写成 f-consistency。",
    "底稿“旧网站上还有但已退役”三条：分页仓库认知来源入口→f-cognition，发布里程碑记录→f-push-record，多文档公开代际→f-generations，都标已停用。",
    "底稿没有、按现行代码补上的：f-frozen、f-live-modes、f-residual、f-retention、f-target、f-matrix、f-owner-status、f-repo-home、f-site-registry、f-dashboard-facts、f-task-map。"
   ],
   "dropped": [
    "底稿 unmapped“Get-GitOwnerStatus.ps1 仍保留基线迁移参数”：一次性修复用的参数，本人不会用到，不单列；它所在的工具写成 f-owner-status。",
    "tools/Invoke-GitHubIndexPrivateCutover.ps1（把总索引自己改私有的一次性切换，9 月 26 日已用过）：不是本人会再用的功能，只在演进里写“9 月 26 日总索引改成私有”；9 月 29 日修复对话已删掉它（提交 e2ccb37）。",
    "05_规则与模板/公开发布脱敏规则.md（只剩一行跳转）、05_规则与模板/审计报告模板.md（7 月 5 日建库后没改过，还带计划任务一节）、tools/Refresh-GitHubLocalIndex-Hidden.vbs（没有计划任务在用）：不是功能，不上页，见 audit.md。",
    "每周基座体检（Codex 自动任务）不列为本页功能：它的家在〔AI 规则与技能基座〕页（agents 第 25 项）；驾驶舱把它记在本项目名下，所以本页只在第 2 屏写一句并链过去，开头“现在”横条留 run 槽位。",
    "旧网站没有本项目的截图（V:\\Personal\\Projects\\wly0829.cn\\public\\media 下没有对应目录），screenshots 为空；第 3 屏画真实看板内容代替。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“我在 GitHub 上的每个代码仓库都记在这里”；第 2 屏“我平时不打开它，是 AI 干活时在用”“我说“改一下文字识别””（问法示例）；第 3 屏“我点名才处理”；第 6 屏“能传、能公开、我同意”“也不等于我同意发布”；第 6 屏“9 月 27 日我定了：入口瘦身，承认靠 AI 守规矩”（据决定 ZS6 原话“入口瘦身，承认靠 AI 守规矩”）；功能第 20、26 项“我的账号”“我登录的 GitHub 账号”，第 29 项“我不记得用过”（据决定 B6“不记得”）。",
    "“现在”横条放了 run 和 sync 两个槽位。run 读的“每周基座体检”其实查的是三个基座和各项目，不只是本仓库，只是驾驶舱把它记在这里；sync 是本项目算出的“网站上各项目同步没有”，需要第 2 批的网页程序按 projects.items[].github_sync 汇总成“N 个已同步 · M 个要看”，接口现在没有现成的汇总字段。",
    "第 3 屏 wly0829.cn 一行写“重做这个网站的目录里有 115 处没提交”：那个工作副本是 gpt-child/20260927-190401-site-rebuild（网站重做会话 4bd59299 的），按名字判断是重做这个网站，没打开核对内容。",
    "第 1 屏“160 次”只算 Get-ProjectAdmission.ps1；同期私有配套查询 212 次、技能 project-entry-gate 266 次，三者多有重叠（同一次进项目可能都调），没有相加。",
    "第 4 屏“主目录上 9 月刷新过 10 次”只数 E:\\GitHub总索引 自己的刷新日志；AI 在临时工作副本里的刷新写各自的日志，没算。",
    "第 7 屏“9 月 18 日起两种结论分开”依据两次提交的标题（f1c40b0、0104a7f）；“要是把读失败当成身份对不上，AI 可能就去改远端地址”是按技能里“never repair this by changing remotes”这条禁令推出的风险，没找到真出过这事的记录，所以写成“可能”。",
    "capability 写“认准每个代码仓库和它的去向”，和别的项目的叫法要在项目首页统一。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/github-local-index/page.json",
  "sha256": "862beec5c9c0e046b6f8837f132ca71fda48c799de54ba1c6e2ad0c00baaa904",
  "converted_at_beijing": "2026-10-10T05:26:52+08:00"
 }
}
---

::screen{#github-local-index-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-local-index-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“GitHub 项目总索引”，下面一行一句话（绿色、比正文大一号），再下面介绍段（占左侧约 55% 宽），介绍段里〔AI 规则与技能基座〕〔电脑配置与恢复〕画成链接样式。右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。中间一排四张数字卡片（照标杆开头的数字卡：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一摞仓库小卡片、并排的几个小文件夹、一个贴着雪花封条的小盒子、一只放大镜对着一个文件夹。数字卡下面一行灰色小字（截至时间）。再下面一条细长圆角横条：最左写“现在”，接着依次是小字“基座体检”加一个留空的浅色圆角小框、小字“各项目和 GitHub 同步没有”加同样大小的空框（两个空框各约横条宽度的 22%，框里什么都不画，网页程序会往里填字），最右一个按钮〔现在正不正常 → 驾驶舱〕。横条下面一个白底细绿边的圆角按钮〔在整套系统里的位置 → 怎么协作〕。这是私有仓库，不放 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、截至小字；“现在”横条改成竖排三行（“现在”一行，“基座体检”加空框一行，“各项目和 GitHub 同步没有”加空框一行，空框约占整行宽 70%），驾驶舱按钮单独一行，最后协作按钮一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#github-local-index"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#github-local-index"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/github-local-index/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "sync"
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
     "text_ref": "GitHub项目总索引",
     "align": "center",
     "size": "large",
     "row": "hero",
     "width": "55%"
    },
    {
     "type": "prose",
     "text_ref": "找全代码仓库，查清副本和同步情况。",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "我在GitHub上的每个代码仓库都记在这里：本机放在",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "stat_card",
     "text_ref": "45个GitHub上的全部仓库：21个公开、24个私",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "前三个数截至9月28日01:40，总表最近一次刷新"
    },
    {
     "type": "live_strip",
     "text_ref": "现在基座体检各项目和GitHub同步没有",
     "frame_mode": "plain"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作复制AI续作说明"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上大标题毛笔艺术字“GitHub 项目总索引”，下面一行一句话（绿色、比正文大一号），再下面介绍段（占左侧约 55% 宽），介绍段里〔AI 规则与技能基座〕〔电脑配置与恢复〕画成链接样式。右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。中间一排四张数字卡片（照标杆开头的数字卡：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一摞仓库小卡片、并排的几个小文件夹、一个贴着雪花封条的小盒子、一只放大镜对着一个文件夹。数字卡下面一行灰色小字（截至时间）。再下面一条细长圆角横条：最左写“现在”，接着依次是小字“基座体检”加一个留空的浅色圆角小框、小字“各项目和 GitHub 同步没有”加同样大小的空框（两个空框各约横条宽度的 22%，框里什么都不画，网页程序会往里填字），最右一个按钮〔现在正不正常 → 驾驶舱〕。横条下面一个白底细绿边的圆角按钮〔在整套系统里的位置 → 怎么协作〕。这是私有仓库，不放 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
     "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、截至小字；“现在”横条改成竖排三行（“现在”一行，“基座体检”加空框一行，“各项目和 GitHub 同步没有”加空框一行，空框约占整行宽 70%），驾驶舱按钮单独一行，最后协作按钮一行。 那一排按钮里同样有〔复制 AI 续作说明〕。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "inline_link",
     "illustration",
     "content_card",
     "stat_card",
     "icon",
     "action_button",
     "live_strip"
    ],
    "portrait_component_order": [
     "prose",
     "illustration",
     "stat_card",
     "live_strip",
     "action_button",
     "chapter_title",
     "inline_link",
     "content_card",
     "icon"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "GitHub项目总索引",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "找全代码仓库，查清副本和同步情况。",
     "size": "large",
     "bold": true
    },
    {
     "type": "prose",
     "text_ref": "我在GitHub上的每个代码仓库都记在这里：本机放在"
    },
    {
     "type": "illustration"
    },
    {
     "type": "stat_card",
     "text_ref": "45个GitHub上的全部仓库：21个公开、24个私",
     "columns": 2,
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "前三个数截至9月28日01:40，总表最近一次刷新"
    },
    {
     "type": "live_strip",
     "text_ref": "现在基座体检各项目和GitHub同步没有",
     "frame_mode": "plain"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作复制AI续作说明"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上大标题毛笔艺术字“GitHub 项目总索引”，下面一行一句话（绿色、比正文大一号），再下面介绍段（占左侧约 55% 宽），介绍段里〔AI 规则与技能基座〕〔电脑配置与恢复〕画成链接样式。右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。中间一排四张数字卡片（照标杆开头的数字卡：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一摞仓库小卡片、并排的几个小文件夹、一个贴着雪花封条的小盒子、一只放大镜对着一个文件夹。数字卡下面一行灰色小字（截至时间）。再下面一条细长圆角横条：最左写“现在”，接着依次是小字“基座体检”加一个留空的浅色圆角小框、小字“各项目和 GitHub 同步没有”加同样大小的空框（两个空框各约横条宽度的 22%，框里什么都不画，网页程序会往里填字），最右一个按钮〔现在正不正常 → 驾驶舱〕。横条下面一个白底细绿边的圆角按钮〔在整套系统里的位置 → 怎么协作〕。这是私有仓库，不放 GitHub 按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
     "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、截至小字；“现在”横条改成竖排三行（“现在”一行，“基座体检”加空框一行，“各项目和 GitHub 同步没有”加空框一行，空框约占整行宽 70%），驾驶舱按钮单独一行，最后协作按钮一行。 那一排按钮里同样有〔复制 AI 续作说明〕。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "inline_link",
     "illustration",
     "content_card",
     "stat_card",
     "icon",
     "action_button",
     "live_strip"
    ],
    "portrait_component_order": [
     "prose",
     "illustration",
     "stat_card",
     "live_strip",
     "action_button",
     "chapter_title",
     "inline_link",
     "content_card",
     "icon"
    ]
   },
   "pending_requirements": []
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
   "source_phrase": "45 个｜GitHub 上的全部仓库：21 个公开、24 个私有，本机都有副本",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "75 个｜本机工作目录：每个仓库一个主目录，另有 30 个是 AI 同时干活时开的临时目录",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "source_phrase": "9 个｜冻结的项目：只核对身份和位置，不查改动、不修",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "160 次｜AI 用它查一个仓库的身份和同步（9 月 16–28 日）",
   "sha256": "c1406b3952dfe1326c7d6c43ac634d2d10b2836e0fba5427591d9d0e9460e2a4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-github-local-index.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "e365b0208f0e75f40c63f79598210e3b0bc529f83a26a6bcdfb133606b8e5f80",
   "status": "ready",
   "original_elements": [
    "一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画"
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
   "asset": "_library/titles/title-52fbc3b0e8f01b155bee.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-52fbc3b0e8f01b155bee",
   "title_text": "GitHub 项目总索引",
   "sha256": "1255afdf7fe08e2494a48482e6ebef6cd8b63d7d4398a2e27751bf5b70be0fed",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

GitHub 项目总索引

找全代码仓库，查清副本和同步情况。

我在 GitHub 上的每个代码仓库都记在这里：本机放在哪个文件夹、公开还是私有、默认分支是哪条、本机开着几个工作目录、改动有没有真的进了 GitHub 上的默认分支（下面叫主线）。AI 拿不准一个文件夹是哪个仓库、改动同步没有时，就拿它查；删库、改名、改公开范围，这里也有专门的入口。它和〔AI 规则与技能基座〕、〔电脑配置与恢复〕是整套系统的三个基座：规矩归前者，电脑归后者，代码仓库归它。

**45 个**｜GitHub 上的全部仓库：21 个公开、24 个私有，本机都有副本
**75 个**｜本机工作目录：每个仓库一个主目录，另有 30 个是 AI 同时干活时开的临时目录
**9 个**｜冻结的项目：只核对身份和位置，不查改动、不修
**160 次**｜AI 用它查一个仓库的身份和同步（9 月 16–28 日）

前三个数截至 9 月 28 日 01:40，总表最近一次刷新

现在　基座体检　各项目和 GitHub 同步没有　〔现在正不正常 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

::screen{#github-local-index-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-local-index-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版画面：左上标题，下面一行小字导语。四张大卡片两列两行，每张左上一个小水彩图标（依次：放大镜照着一个文件夹和一个 GitHub 小猫；几根细分支线汇向一根主干、末端一个绿勾；一扇半开的门，门外一个小地球、门内一把小锁；一把剪刀旁边一只小盾牌），卡片里粗体标题加正文。卡片下面一行小字（每周基座体检那一句），左边一个小日历图标。最下面一条浅绿底的细横条，放技能链接那一句。",
  "portrait": "竖版：标题、导语；四张卡片一行一张；然后是日历图标和每周基座体检那一句；最后是浅绿细横条。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "project-entry-gate",
    "href": "/skills/project-entry-gate/"
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
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "我平时不打开它，是AI干活时在用。最常用在这四种时候"
    },
    {
     "type": "content_card",
     "text_ref": "找项目，认准是哪个仓库",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside"
    },
    {
     "type": "prose",
     "text_ref": "基座体检：暂无启用中的任务。"
    },
    {
     "type": "notice",
     "text_ref": "跟AI怎么说、完整的例子：见技能project-en"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题，下面一行小字导语。四张大卡片两列两行，每张左上一个小水彩图标（依次：放大镜照着一个文件夹和一个 GitHub 小猫；几根细分支线汇向一根主干、末端一个绿勾；一扇半开的门，门外一个小地球、门内一把小锁；一把剪刀旁边一只小盾牌），卡片里粗体标题加正文。卡片下面一行小字（每周基座体检那一句），左边一个小日历图标。最下面一条浅绿底的细横条，放技能链接那一句。",
     "portrait": "竖版：标题、导语；四张卡片一行一张；然后是日历图标和每周基座体检那一句；最后是浅绿细横条。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "prose",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "我平时不打开它，是AI干活时在用。最常用在这四种时候"
    },
    {
     "type": "content_card",
     "text_ref": "找项目，认准是哪个仓库",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside"
    },
    {
     "type": "prose",
     "text_ref": "基座体检：暂无启用中的任务。"
    },
    {
     "type": "notice",
     "text_ref": "跟AI怎么说、完整的例子：见技能project-en"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题，下面一行小字导语。四张大卡片两列两行，每张左上一个小水彩图标（依次：放大镜照着一个文件夹和一个 GitHub 小猫；几根细分支线汇向一根主干、末端一个绿勾；一扇半开的门，门外一个小地球、门内一把小锁；一把剪刀旁边一只小盾牌），卡片里粗体标题加正文。卡片下面一行小字（每周基座体检那一句），左边一个小日历图标。最下面一条浅绿底的细横条，放技能链接那一句。",
     "portrait": "竖版：标题、导语；四张卡片一行一张；然后是日历图标和每周基座体检那一句；最后是浅绿细横条。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "prose",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": []
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "GitHub标志",
   "source_phrase": "依次：放大镜照着一个文件夹和一个 GitHub 小猫",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "几根细分支线汇向一根主干、末端一个绿勾",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇半开的门，门外一个小地球、门内一把小锁",
   "sha256": "852456776417cc516beae0cdfd5902ea8ffca347edec2806254ff247171b1766",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "一把剪刀旁边一只小盾牌",
   "sha256": "606a89c71ab7e8571f578b4ff9d83ea50a6562e027cbd1f7740e29feb44b0f24",
   "status": "ready"
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

我平时不打开它，是 AI 干活时在用。最常用在这四种时候：

**找项目，认准是哪个仓库**
我说“改一下文字识别”，AI 先在总表里查到 wlyaaaaa/LocalOCR 放在 E:\Projects\Tools\LocalOCR，再读那个文件夹里的 .git，确认它真连着这个仓库。目录名靠不住：机箱小屏的仓库叫 PC-Panel-Hub，本机文件夹却叫 TURZX-SideScreen。

**改完了，真的同步好了吗**
AI 收尾时把这个仓库的所有工作目录和分支一起查：有没有没提交的、没推送的、推到临时分支却没进主线的。只看当前窗口，会漏掉别的工作目录里做完的活。

**准备公开或分享**
先问 GitHub 它现在是公开还是私有；公开仓库里有没有 .env、私钥这类文件；这个项目有没有放在私有仓库里的内部说明，AI 维护时一起读。

**删库、改名、改公开范围**
走这里的一个入口：先核对目标；删库和转移固定先预演一遍，把保住了哪些分支和标签、哪些 issue 和发布包只有清单没有备份拿给我看，再正式动手；做完再从 GitHub 读回结果。哪几种要我亲自验证，见〔重大动作与本人验证〕。

基座体检：暂无启用中的任务。它归〔AI 规则与技能基座〕管，开头“现在”横条显示当前运行状态。

跟 AI 怎么说、完整的例子：见技能〔project-entry-gate〕

::screen{#github-local-index-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-local-index-03",
  "section": "usage",
  "title": "总表长这样",
  "scene": "横版画面：左上标题，下面一行小字。左侧约四分之三宽是一块水彩风格的显示器屏幕插画（浅色底），屏幕里画一张真实的表格：表头和五行完全照下面的字画，“公开”一列里“公开”“私有”用绿色和灰色小标签；PCConfig 那一行和 wly0829.cn 那一行底色淡黄。右侧约四分之一宽竖着两张小卡片：“仍需处理：10 个”（配一个小清单图标）和“有 36 个仓库这次没联网核对”（配一个小硬盘和一朵带问号的云）。",
  "portrait": "竖版：标题、小字；表格改成一行一张小卡片，每张卡片第一行粗体仓库名，下面四行依次是公开、本机目录、现在的状态、下一步；最后两张说明卡片上下排。",
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
     "text_ref": "总表长这样",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "一页私有的看板，45个仓库一个不漏。下面五行照9月2"
    },
    {
     "type": "table",
     "text_ref": "仓库公开本机目录现在的状态下一步ChineseASR",
     "variant": "row_cards",
     "illustration": "monitor",
     "row": "table",
     "width": "70%"
    },
    {
     "type": "content_card",
     "text_ref": "仍需处理：10个",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "row": "table",
     "width": "30%",
     "icons": [
      "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题，下面一行小字。左侧约四分之三宽是一块水彩风格的显示器屏幕插画（浅色底），屏幕里画一张真实的表格：表头和五行完全照下面的字画，“公开”一列里“公开”“私有”用绿色和灰色小标签；PCConfig 那一行和 wly0829.cn 那一行底色淡黄。右侧约四分之一宽竖着两张小卡片：“仍需处理：10 个”（配一个小清单图标）和“有 36 个仓库这次没联网核对”（配一个小硬盘和一朵带问号的云）。",
     "portrait": "竖版：标题、小字；表格改成一行一张小卡片，每张卡片第一行粗体仓库名，下面四行依次是公开、本机目录、现在的状态、下一步；最后两张说明卡片上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "illustration",
     "table",
     "tag",
     "content_card"
    ],
    "portrait_component_order": [
     "table",
     "content_card",
     "chapter_title",
     "prose",
     "illustration",
     "tag"
    ]
   },
   "pending_requirements": [
    "横版表格须置于显示器水彩框内，PCConfig/网站行淡黄、公开列小标签；现有普通table未消费 monitor 插画外框，需样张。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "总表长这样",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "一页私有的看板，45个仓库一个不漏。下面五行照9月2"
    },
    {
     "type": "table",
     "text_ref": "仓库公开本机目录现在的状态下一步ChineseASR",
     "variant": "row_cards",
     "illustration": "monitor"
    },
    {
     "type": "content_card",
     "text_ref": "仍需处理：10个",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题，下面一行小字。左侧约四分之三宽是一块水彩风格的显示器屏幕插画（浅色底），屏幕里画一张真实的表格：表头和五行完全照下面的字画，“公开”一列里“公开”“私有”用绿色和灰色小标签；PCConfig 那一行和 wly0829.cn 那一行底色淡黄。右侧约四分之一宽竖着两张小卡片：“仍需处理：10 个”（配一个小清单图标）和“有 36 个仓库这次没联网核对”（配一个小硬盘和一朵带问号的云）。",
     "portrait": "竖版：标题、小字；表格改成一行一张小卡片，每张卡片第一行粗体仓库名，下面四行依次是公开、本机目录、现在的状态、下一步；最后两张说明卡片上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "prose",
     "illustration",
     "table",
     "tag",
     "content_card"
    ],
    "portrait_component_order": [
     "table",
     "content_card",
     "chapter_title",
     "prose",
     "illustration",
     "tag"
    ]
   },
   "pending_requirements": [
    "横版表格须置于显示器水彩框内，PCConfig/网站行淡黄、公开列小标签；现有普通table未消费 monitor 插画外框，需样张。"
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
   "asset": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "工具箱",
   "source_phrase": "仍需处理：10 个 \n那一刻几个AI正同时收尾，所以45个里有10个标着要处理，多是用完还没收的临时目录和分支。",
   "sha256": "1f27e2e5b55499cd52cec4a8b7fe253b3b84c0357e9939f1039619291f43461a",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "有 36 个仓库这次没联网核对 \n那次刷新时，这些仓库的远端状态用的是本机上次拉下来的记录（缓存），没有现场问GitHub。旧一点不算出错；真要推送或删东西，再现场查一次。",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/网页看板通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "网页看板通用构图",
   "source_phrase": "左侧约四分之三宽是一块水彩风格的显示器屏幕插画（浅色底），屏幕里画一张真实的表格：表头和五行完全照下面的字画，“公开”一列里“公开”“私有”用绿色和灰色小标签；PCConfig 那一行和 wly0829.cn 那一行底色淡黄。",
   "sha256": "5f5204488bba4692225c17e68b358ac36a94954e10513eddf4ebf9cf13c6071e",
   "status": "ready",
   "original_elements": [
    "浅色显示器，屏幕里五行表格、绿色和灰色小状态标签，其中两行浅黄底；表格字和标签文字由排版程序放，不画进插画"
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
   "asset": "_library/titles/title-9ea6f4e43ba2940923dd.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9ea6f4e43ba2940923dd",
   "title_text": "总表长这样",
   "sha256": "8c15ddd6dbe5d816e3524aab510ddfd35893d9ff86834fe2474be96ab442901d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

总表长这样

一页私有的看板，45 个仓库一个不漏。下面五行照 9 月 28 日 01:40 那一版整理：

| 仓库 | 公开 | 本机目录 | 现在的状态 | 下一步 |
|---|---|---|---|---|
| ChineseASR | 公开 | E:\Projects\Tools\ChineseASR | main 已同步 | 不用管 |
| PC-Panel-Hub | 公开 | E:\Projects\Tools\TURZX-SideScreen，另有 1 个临时目录 | 临时分支的内容已进主线 | 确认没人在用，收掉临时目录 |
| PCConfig | 私有 | E:\PCConfig，另有 8 个临时目录 | 一条临时分支比主线多 9 个提交 | 验证后并进主线 |
| wly0829.cn | 公开 | V:\Personal\Projects\wly0829.cn，另有 4 个临时目录 | 重做这个网站的目录里有 115 处没提交 | 先核对是不是还在施工，不动别人的改动 |
| codex-local-remote | 公开 | V:\Personal\Projects\codex-local-remote | 冻结，只核对身份 | 我点名才处理 |

**仍需处理：10 个**
那一刻几个 AI 正同时收尾，所以 45 个里有 10 个标着要处理，多是用完还没收的临时目录和分支。

**有 36 个仓库这次没联网核对**
那次刷新时，这些仓库的远端状态用的是本机上次拉下来的记录（缓存），没有现场问 GitHub。旧一点不算出错；真要推送或删东西，再现场查一次。

::screen{#github-local-index-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-local-index-04",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。五张横向圆角小卡片，上面两行各两张、最后一行一张横跨整屏，每张左边一个小水彩图标（依次：一本旧账本和一支笔、两张对不上的小卡片、一朵带叉的云旁边一个问号、一只小盾牌挡在一把剪刀前、一个从云里落下的小箱子），右边粗体一句加小字。",
  "portrait": "竖版：标题；五张卡片一行一张，图标在左、字在右。",
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
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "总表过时了新建、搬家、改名、删库之后，AI顺手完整刷",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "last_full_width": true,
     "icons": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。五张横向圆角小卡片，上面两行各两张、最后一行一张横跨整屏，每张左边一个小水彩图标（依次：一本旧账本和一支笔、两张对不上的小卡片、一朵带叉的云旁边一个问号、一只小盾牌挡在一把剪刀前、一个从云里落下的小箱子），右边粗体一句加小字。",
     "portrait": "竖版：标题；五张卡片一行一张，图标在左、字在右。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "第五卡横版横跨两列：core content_card 不消费 last_full_width，待组件实现。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "总表过时了新建、搬家、改名、删库之后，AI顺手完整刷",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "last_full_width": true,
     "icons": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。五张横向圆角小卡片，上面两行各两张、最后一行一张横跨整屏，每张左边一个小水彩图标（依次：一本旧账本和一支笔、两张对不上的小卡片、一朵带叉的云旁边一个问号、一只小盾牌挡在一把剪刀前、一个从云里落下的小箱子），右边粗体一句加小字。",
     "portrait": "竖版：标题；五张卡片一行一张，图标在左、字在右。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "第五卡横版横跨两列：core content_card 不消费 last_full_width，待组件实现。"
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
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "依次：一本旧账本和一支笔",
   "sha256": "6c4493be74e722fa3e8f1c2c95574768fe9c5da8b6afa27a3f66406d68c9a6a8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-mismatching-cards.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-mismatching-cards",
   "source_phrase": "横版画面：左上标题。五张横向圆角小卡片，上面两行各两张、最后一行一张横跨整屏，每张左边一个小水彩图标（依次：一本旧账本和一支笔、两张对不上的小卡片、一朵带叉的云旁边一个问号、一只小盾牌挡在一把剪刀前、一个从云里落下的小箱子），右边粗体一句加小字。",
   "sha256": "b957df4748ad47ebfb974320cfc0b55ec4f38bf95eb530d1e56e539f3ae2af6c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵带叉的云旁边一个问号",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "一只小盾牌挡在一把剪刀前",
   "sha256": "606a89c71ab7e8571f578b4ff9d83ea50a6562e027cbd1f7740e29feb44b0f24",
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
   "source_phrase": "一个从云里落下的小箱子",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
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

**总表过时了**｜新建、搬家、改名、删库之后，AI 顺手完整刷新一次：重新扫描，看板页和给程序查的仓库清单一起重写，每个文件先写临时内容再整份替换，不会写出半个文件；两份要是一份换了一份没换，一致性检查查得出来。总索引自己的目录里，9 月刷新过 10 次。

**登记和现场对不上**｜一致性检查拿现场重新生成一份来比，报出差在哪一项；只报告，不自动改，也不提交。

**GitHub 连不上、命令读不出来**｜只读的查看照做，要写 GitHub 的动作先停；读失败只算“不知道”，不算“对不上”（为什么，见亮点）。拉取时网络中途断开，只自动重试一次；登录、证书这类错误不重试。

**删库前保全没过**｜停下说清原因；不改成请我验证了事，也不丢只有一份的东西。

**总索引自己丢了**｜它是换机时最先从 GitHub 拉回的三个基座之一，每天的加密系统镜像里还带着它没推送的改动；仓库清单随时能重新扫描生成。换机怎么做见〔电脑配置与恢复〕

::screen{#github-local-index-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-local-index-05",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。上半部一张从左到右的流程图，圆角卡片节点、绿色箭头：最左两个来源节点上下排（上：GitHub 小猫标志和一朵云；下：一排小硬盘和文件夹），箭头汇到中间“生成器”节点（一个齿轮），再分成两个结果节点上下排（一页看板纸、一份清单），最右“用的时候”节点（放大镜对着一个带 .git 标签的文件夹）。每个节点下面是它那一段字。流程图下面左边一张小卡片“旁边三样”（三行），中间一行小字（新仓库放哪），最下一条横跨整屏的浅绿细卡片放“规模”。",
  "portrait": "竖版：标题；流程图改成从上到下，五个节点一行一个，箭头向下；然后“旁边三样”卡片、新仓库那行小字、规模卡片。",
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
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "GitHub用GitHub命令行列出我账号下的仓库（",
     "layout": "branches",
     "layers": [
      {
       "count": 2,
       "columns": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "connector": "arrow",
     "illustration": "above_card"
    },
    {
     "type": "content_card",
     "text_ref": "旁边三样",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "新仓库默认放V:\\Personal\\Projects"
    },
    {
     "type": "content_card",
     "text_ref": "规模工具7,515行，PowerShell7为主，算",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。上半部一张从左到右的流程图，圆角卡片节点、绿色箭头：最左两个来源节点上下排（上：GitHub 小猫标志和一朵云；下：一排小硬盘和文件夹），箭头汇到中间“生成器”节点（一个齿轮），再分成两个结果节点上下排（一页看板纸、一份清单），最右“用的时候”节点（放大镜对着一个带 .git 标签的文件夹）。每个节点下面是它那一段字。流程图下面左边一张小卡片“旁边三样”（三行），中间一行小字（新仓库放哪），最下一条横跨整屏的浅绿细卡片放“规模”。",
     "portrait": "竖版：标题；流程图改成从上到下，五个节点一行一个，箭头向下；然后“旁边三样”卡片、新仓库那行小字、规模卡片。"
    },
    "desktop_component_order": [
     "chapter_title",
     "flow",
     "content_card",
     "prose",
     "notice",
     "bullet_list",
     "icon"
    ],
    "portrait_component_order": [
     "flow",
     "prose",
     "content_card",
     "chapter_title",
     "notice",
     "bullet_list",
     "icon"
    ]
   },
   "pending_requirements": [
    "原图为双来源汇生成器、双结果再用时的分支图；定稿两份结果为单一card，现有 topology 不能逐边复现合流/分流。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "GitHub用GitHub命令行列出我账号下的仓库（",
     "layout": "branches",
     "layers": [
      {
       "count": 2,
       "columns": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "connector": "arrow",
     "illustration": "above_card"
    },
    {
     "type": "content_card",
     "text_ref": "旁边三样",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "新仓库默认放V:\\Personal\\Projects"
    },
    {
     "type": "content_card",
     "text_ref": "规模工具7,515行，PowerShell7为主，算",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。上半部一张从左到右的流程图，圆角卡片节点、绿色箭头：最左两个来源节点上下排（上：GitHub 小猫标志和一朵云；下：一排小硬盘和文件夹），箭头汇到中间“生成器”节点（一个齿轮），再分成两个结果节点上下排（一页看板纸、一份清单），最右“用的时候”节点（放大镜对着一个带 .git 标签的文件夹）。每个节点下面是它那一段字。流程图下面左边一张小卡片“旁边三样”（三行），中间一行小字（新仓库放哪），最下一条横跨整屏的浅绿细卡片放“规模”。",
     "portrait": "竖版：标题；流程图改成从上到下，五个节点一行一个，箭头向下；然后“旁边三样”卡片、新仓库那行小字、规模卡片。"
    },
    "desktop_component_order": [
     "chapter_title",
     "flow",
     "content_card",
     "prose",
     "notice",
     "bullet_list",
     "icon"
    ],
    "portrait_component_order": [
     "flow",
     "prose",
     "content_card",
     "chapter_title",
     "notice",
     "bullet_list",
     "icon"
    ]
   },
   "pending_requirements": [
    "原图为双来源汇生成器、双结果再用时的分支图；定稿两份结果为单一card，现有 topology 不能逐边复现合流/分流。"
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
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "GitHub｜用 GitHub 命令行列出我账号下的仓库（一次最多 200 个），读公开还是私有、默认分支",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "本机｜在固定的几个目录里找 .git：E:\\.agents、E:\\PCConfig、E:\\Projects、E:\\.worktrees、V:\\Personal\\Projects、V:\\Personal\\Worktrees、V:\\Work，再加上登记过的位置",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "生成器｜按远端地址（origin）把两边对上，逐个读分支、工作目录、没提交的改动、和主线差几个提交；冻结名单从当前生效的规则读",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "两份结果｜一页看板，给人和 AI 看；一份仓库清单，给程序查",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "source_phrase": "用的时候｜AI 查一个仓库时，先回读真实的 .git；要更准再联网，分三档：只问 GitHub 的信息、再拉最新的远端分支、准备发布时两样都要新鲜",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "私有配套查询：公开项目的内部说明放在哪个私有仓库",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "仓库大动作入口：新建、改名、改公开范围、删库、转移",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "source_phrase": "给驾驶舱的项目数字：不联网，每个仓库最多算 1.2 秒",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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

**GitHub**｜用 GitHub 命令行列出我账号下的仓库（一次最多 200 个），读公开还是私有、默认分支
**本机**｜在固定的几个目录里找 .git：E:\.agents、E:\PCConfig、E:\Projects、E:\.worktrees、V:\Personal\Projects、V:\Personal\Worktrees、V:\Work，再加上登记过的位置
**生成器**｜按远端地址（origin）把两边对上，逐个读分支、工作目录、没提交的改动、和主线差几个提交；冻结名单从当前生效的规则读
**两份结果**｜一页看板，给人和 AI 看；一份仓库清单，给程序查
**用的时候**｜AI 查一个仓库时，先回读真实的 .git；要更准再联网，分三档：只问 GitHub 的信息、再拉最新的远端分支、准备发布时两样都要新鲜

**旁边三样**
- 私有配套查询：公开项目的内部说明放在哪个私有仓库
- 仓库大动作入口：新建、改名、改公开范围、删库、转移
- 给驾驶舱的项目数字：不联网，每个仓库最多算 1.2 秒

新仓库默认放 V:\Personal\Projects，临时工作目录放 V:\Personal\Worktrees；Z 盘是内存缓存盘，不放仓库。

**规模**　工具 7,515 行，PowerShell 7 为主，算数字的一段用 Python；测试 10 个脚本 3,932 行，用临时建的真 Git 仓库和模拟的 GitHub 跑；455 次提交（7 月 5 日–9 月 28 日）；不用数据库。

::screen{#github-local-index-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-local-index-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。前五张横向小卡片两列排（两行各两张、第三行一张），每张左边一个小水彩图标（依次：一张地图和一个指向真实房子的箭头；三扇并排的小门；一根树干上挂着一个绿勾；一个“1”字形的小书架；一张单独夹好的小卡片），右边粗体一句加小字。最下面第六张卡片横跨整屏、略宽一点，左边插画：一面厚砖墙被搬走，原地立着一块薄薄的指路牌，旁边一把钥匙正放进一只小保险箱；右边粗体一句加一段小字。",
  "portrait": "竖版：标题；六张卡片一行一张，最后一张插画在上、字在下。",
  "links": [
   {
    "text": "约法 L24",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "总表只是导航，不是事实。登记会过时。动手前再读一次真",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "last_full_width": true,
     "icons": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。前五张横向小卡片两列排（两行各两张、第三行一张），每张左边一个小水彩图标（依次：一张地图和一个指向真实房子的箭头；三扇并排的小门；一根树干上挂着一个绿勾；一个“1”字形的小书架；一张单独夹好的小卡片），右边粗体一句加小字。最下面第六张卡片横跨整屏、略宽一点，左边插画：一面厚砖墙被搬走，原地立着一块薄薄的指路牌，旁边一把钥匙正放进一只小保险箱；右边粗体一句加一段小字。",
     "portrait": "竖版：标题；六张卡片一行一张，最后一张插画在上、字在下。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "第六卡整宽大插画，前五卡两列；core 不消费 last_full_width/last_illustration，仍待组件。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "总表只是导航，不是事实。登记会过时。动手前再读一次真",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "last_full_width": true,
     "icons": "none"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。前五张横向小卡片两列排（两行各两张、第三行一张），每张左边一个小水彩图标（依次：一张地图和一个指向真实房子的箭头；三扇并排的小门；一根树干上挂着一个绿勾；一个“1”字形的小书架；一张单独夹好的小卡片），右边粗体一句加小字。最下面第六张卡片横跨整屏、略宽一点，左边插画：一面厚砖墙被搬走，原地立着一块薄薄的指路牌，旁边一把钥匙正放进一只小保险箱；右边粗体一句加一段小字。",
     "portrait": "竖版：标题；六张卡片一行一张，最后一张插画在上、字在下。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "inline_link"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "第六卡整宽大插画，前五卡两列；core 不消费 last_full_width/last_illustration，仍待组件。"
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
   "asset": "_library/fix-round-2/icon-clean-efc86be6e153919921f8.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "地图定位",
   "source_phrase": "依次：一张地图和一个指向真实房子的箭头",
   "sha256": "15e471af4ca157edb410cb0bea1e97937c52cc3f22a9fb052fd9396c8c59d844",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "三扇并排的小门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一根树干上挂着一个绿勾",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一个“1”字形的小书架",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一张单独夹好的小卡片",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/索引指路.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "索引指路",
   "source_phrase": "最下面第六张卡片横跨整屏、略宽一点，左边插画：一面厚砖墙被搬走，原地立着一块薄薄的指路牌，旁边一把钥匙正放进一只小保险箱；右边粗体一句加一段小字。",
   "sha256": "848acf70ba6927533720ca5f6a5b26f4561ae933e22fcfe8618363313709ed69",
   "status": "ready",
   "original_elements": [
    "一面厚砖墙被搬走，原地立着一块薄薄的指路牌，旁边一把钥匙正放进一只小保险箱"
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

**总表只是导航，不是事实。**｜登记会过时。动手前再读一次真实的 .git 和 GitHub；不这样，搬过家、改过名的目录会被当成原来那个仓库。

**能传、能公开、我同意，三件事分开。**｜网络和分支没问题，不等于内容适合公开；内容能公开，也不等于我同意发布。三样缺一不可，谁也推不出谁。

**进了 GitHub 主线才算交付。**｜推到临时分支、本地 main 提交了，都不算完；要在 GitHub 上的默认分支里找得到这次的提交。

**一样东西只存一处。**｜冻结名单（〔约法 L24〕）和公开分级从生效的规则读，计划任务交给电脑配置与恢复，这里不再抄一份。

**上不上网站，单独登记。**｜哪些项目上网站、叫什么名字，写在单独的一份登记里，不会被总表刷新覆盖；新仓库默认不上，忘了登记，测试会拦下来。

**大动作入口不假装是一道安全墙。**｜删库、改公开的入口一度写到 2,746 行，还配了提交前拦密钥的检查，看着很严，其实挡不住一个已经登录 GitHub 的程序直接删库，维护却很重。9 月 27 日我定了：入口瘦身，承认靠 AI 守规矩。现在 896 行，只做几件实事：核对目标、删库前保全并先预演给我看、该验证时请我验证、做完读回；重写后还没有用过的记录，所以功能表里标待验收。拦密钥的检查拆了：AI 对密钥本来就警觉，密钥都在〔密码中心〕。

::screen{#github-local-index-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "github-local-index-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：照标杆页的亮点屏：左上标题，两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一根粗树干（主线）旁伸出九根细枝，其中一根枝头挂着九颗小果子、没接回主干，一只放大镜照着它；2 两块小木牌，一块画问号、一块画叉，中间一道竖线隔开。",
  "portrait": "竖版：标题；两张卡片上下排，每张插画在上、字在下。",
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
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "一个仓库，九个工作目录",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png",
      "_library/icons/放大镜.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆页的亮点屏：左上标题，两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一根粗树干（主线）旁伸出九根细枝，其中一根枝头挂着九颗小果子、没接回主干，一只放大镜照着它；2 两块小木牌，一块画问号、一块画叉，中间一道竖线隔开。",
     "portrait": "竖版：标题；两张卡片上下排，每张插画在上、字在下。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "illustration",
     "prose"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "prose"
    ]
   },
   "pending_requirements": [
    "两张亮点卡应逐卡主插画在上，core content_card 当前只领小图标，需illustration绑定。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "一个仓库，九个工作目录",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png",
      "_library/icons/放大镜.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆页的亮点屏：左上标题，两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一根粗树干（主线）旁伸出九根细枝，其中一根枝头挂着九颗小果子、没接回主干，一只放大镜照着它；2 两块小木牌，一块画问号、一块画叉，中间一道竖线隔开。",
     "portrait": "竖版：标题；两张卡片上下排，每张插画在上、字在下。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "illustration",
     "prose"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "prose"
    ]
   },
   "pending_requirements": [
    "两张亮点卡应逐卡主插画在上，core content_card 当前只领小图标，需illustration绑定。"
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件柜",
   "source_phrase": "一个仓库，九个工作目录 \n几个AI同时干活，各开各的临时工作目录。9月28日凌晨，电脑配置与恢复一个仓库就开着9个。收尾只看当前窗口，别的目录里做完没合的活就会被忘掉，或者被当成垃圾清掉。总索引把每条分支都拿去和GitHub上的主线比：内容已进主线的标“残留，可以收”；有独有提交的写明“主线缺N个提交”，先并进去；有没提交改动的只提醒核对，不碰别人的东西。那天它就找出一条比主线多9个提交的临时分支。",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "放大镜",
   "source_phrase": "读不出来，不等于对不上 \nGitHub偶尔连不上，Git命令偶尔失败。要是把“读失败”当成“身份对不上”，AI可能就去改远端地址，或者认定这是别的仓库。9月18日起两种结论分开：读失败只算“不知道”，停写入和推送、不停查看，也不因为一条命令失败就整个停工；真读到了而且和登记不一样，才算冲突。",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/树枝索引.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "树枝索引",
   "source_phrase": "插画：1 一根粗树干（主线）旁伸出九根细枝，其中一根枝头挂着九颗小果子、没接回主干，一只放大镜照着它；2 两块小木牌，一块画问号、一块画叉，中间一道竖线隔开。",
   "sha256": "afe98924e00cbe34c88815a7c2e8b9195ae2737f0b90d323144026d20d396946",
   "status": "ready",
   "original_elements": [
    "一根粗树干（主线）旁伸出九根细枝，其中一根枝头挂着九颗小果子、没接回主干，一只放大镜照着它"
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

**一个仓库，九个工作目录**
几个 AI 同时干活，各开各的临时工作目录。9 月 28 日凌晨，电脑配置与恢复一个仓库就开着 9 个。收尾只看当前窗口，别的目录里做完没合的活就会被忘掉，或者被当成垃圾清掉。总索引把每条分支都拿去和 GitHub 上的主线比：内容已进主线的标“残留，可以收”；有独有提交的写明“主线缺 N 个提交”，先并进去；有没提交改动的只提醒核对，不碰别人的东西。那天它就找出一条比主线多 9 个提交的临时分支。

**读不出来，不等于对不上**
GitHub 偶尔连不上，Git 命令偶尔失败。要是把“读失败”当成“身份对不上”，AI 可能就去改远端地址，或者认定这是别的仓库。9 月 18 日起两种结论分开：读失败只算“不知道”，停写入和推送、不停查看，也不因为一条命令失败就整个停工；真读到了而且和登记不一样，才算冲突。

::screen{#github-local-index-08 section="features"}

```typeset
{
 "screen": {
  "id": "github-local-index-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第一张：顶上有标题“全部功能（32 项）”和一行图例（图例照上面六种圆点画，圆点后写字）。",
  "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。第一张顶上是标题和图例，图例两行三个。",
  "links": [],
  "anchors": [
   {
    "id": "g-find",
    "text": "找到和认准仓库"
   },
   {
    "id": "f-locate",
    "text": "找仓库在哪"
   },
   {
    "id": "f-identity",
    "text": "认准是哪个仓库"
   },
   {
    "id": "f-visibility",
    "text": "查公开还是私有"
   },
   {
    "id": "f-frozen",
    "text": "标出冻结的项目"
   },
   {
    "id": "f-live-modes",
    "text": "按需联网核对"
   },
   {
    "id": "g-sync",
    "text": "查同步",
    "locator_text": {
     "h": "查全部工作目录"
    }
   },
   {
    "id": "f-sync-all",
    "text": "查全部工作目录"
   },
   {
    "id": "f-unmerged",
    "text": "找出没进主线的提交"
   },
   {
    "id": "f-residual",
    "text": "分出能收的残留"
   },
   {
    "id": "f-retention",
    "text": "有专门用途的分支不误报"
   },
   {
    "id": "f-target",
    "text": "只看这次的目标"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（32项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "feature_card",
     "text_ref": "找到和认准仓库",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第一张：顶上有标题“全部功能（32 项）”和一行图例（图例照上面六种圆点画，圆点后写字）。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。第一张顶上是标题和图例，图例两行三个。"
    },
    "desktop_component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "chapter_title",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（32项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "feature_card",
     "text_ref": "找到和认准仓库",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第一张：顶上有标题“全部功能（32 项）”和一行图例（图例照上面六种圆点画，圆点后写字）。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。第一张顶上是标题和图例，图例两行三个。"
    },
    "desktop_component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "chapter_title",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
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
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "找仓库在哪｜说项目名，AI 查到它的 GitHub 仓库和本机文件夹；45 个都登记着｜在用",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "认准是哪个仓库｜回读文件夹里的 .git，确认连着的仓库和登记一致，不凭目录名猜｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "查公开还是私有｜总表记着上次看到的；要准，就联网问 GitHub 当下的｜在用",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "标出冻结的项目｜名单从生效的规则读；9 个冻结的只核对身份和位置｜在用",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "按需联网核对｜三档：只问 GitHub 的信息、再拉最新远端分支、发布前两样都要新鲜｜说不准",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "查全部工作目录｜同一个仓库的所有工作目录和分支一起查：没提交的、没推送的、领先落后几个｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "找出没进主线的提交｜每条分支都和 GitHub 上的默认分支比，写明主线缺几个提交｜在用",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "分出能收的残留｜内容已进主线的临时分支和目录标成残留，确认没人在用再收｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "有专门用途的分支不误报｜3 条专门分支、1 个冻结仓库的历史、1 个回滚用的目录登记在案，不算没合的活｜在用",
   "sha256": "021dd20fa27e238fe3c8aa4aca6e699a49c80ad63d4abcad60dc8ff1e0068aa5",
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
   "source_phrase": "只看这次的目标｜一个仓库开着好几个目录时，只让这次要推的那个参与判断，别的照样列出｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-70b783bfeb9724c803e3.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-70b783bfeb9724c803e3",
   "title_text": "全部功能（32 项）",
   "sha256": "192638e5b17b28fa33cbb67212a1b8895ea9f0331efde081d14ae8580488b06e",
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
   "asset": "_library/titles/title-728aaa9c90d9ede80150.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-728aaa9c90d9ede80150",
   "title_text": "找到和认准仓库",
   "sha256": "366dbbf751240236411275a87a62b0013b2d49a5b9aafd0343f1725956638c9c",
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
   "asset": "_library/titles/title-2e603ba0d248e367b648.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2e603ba0d248e367b648",
   "title_text": "查同步",
   "sha256": "a48c87c00864b6dd65825e858bed7146eac249cbfa7c56c237b1db0b1ee215d1",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（32 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**找到和认准仓库**
1. 找仓库在哪｜说项目名，AI 查到它的 GitHub 仓库和本机文件夹；45 个都登记着｜在用
2. 认准是哪个仓库｜回读文件夹里的 .git，确认连着的仓库和登记一致，不凭目录名猜｜在用
3. 查公开还是私有｜总表记着上次看到的；要准，就联网问 GitHub 当下的｜在用
4. 标出冻结的项目｜名单从生效的规则读；冻结的只核对身份和位置｜在用
5. 按需联网核对｜三档：只问 GitHub 的信息、再拉最新远端分支、发布前两样都要新鲜｜说不准

**查同步**
6. 查全部工作目录｜同一个仓库的所有工作目录和分支一起查：没提交的、没推送的、领先落后几个｜在用
7. 找出没进主线的提交｜每条分支都和 GitHub 上的默认分支比，写明主线缺几个提交｜在用
8. 分出能收的残留｜内容已进主线的临时分支和目录标成残留，确认没人在用再收｜在用
9. 有专门用途的分支不误报｜3 条专门分支、1 个冻结仓库的历史、1 个回滚用的目录登记在案，不算没合的活｜在用
10. 只看这次的目标｜一个仓库开着好几个目录时，只让这次要推的那个参与判断，别的照样列出｜说不准

::screen{#github-local-index-09 section="features"}

```typeset
{
 "screen": {
  "id": "github-local-index-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第二张：没有标题、没有图例，接着上一张往下排。",
  "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。",
  "links": [],
  "anchors": [
   {
    "id": "g-publish",
    "text": "公开和分享之前"
   },
   {
    "id": "f-exposure",
    "text": "敏感文件提示"
   },
   {
    "id": "f-matrix",
    "text": "推送放行规则"
   },
   {
    "id": "f-companion",
    "text": "找到私有配套说明"
   },
   {
    "id": "g-ledger",
    "text": "总表的维护"
   },
   {
    "id": "f-refresh",
    "text": "刷新总表"
   },
   {
    "id": "f-consistency",
    "text": "检查总表对不对"
   },
   {
    "id": "f-owner-status",
    "text": "给别的基座的状态摘要"
   },
   {
    "id": "f-repo-home",
    "text": "新仓库放哪"
   },
   {
    "id": "g-site",
    "text": "给网站和驾驶舱"
   },
   {
    "id": "f-site-registry",
    "text": "网站项目登记"
   },
   {
    "id": "f-dashboard-facts",
    "text": "项目数字"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "公开和分享之前",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only",
     "fill_last_row": true
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第二张：没有标题、没有图例，接着上一张往下排。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "公开和分享之前",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第二张：没有标题、没有图例，接着上一张往下排。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "敏感文件提示｜公开仓库的目录里出现 .env、私钥、secrets 文件夹这类文件，查询直接判“挡住”；日志、数据库文件列出来请 AI 复看｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "source_phrase": "推送放行规则｜一张表写清什么情况能推、什么情况先停｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "找到私有配套说明｜公开项目的内部说明放在一个私有仓库里，AI 维护时按登记找到；现在登记了 3 个项目｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "刷新总表｜重新扫描，看板页和仓库清单一起重写，每个文件整份替换｜在用",
   "sha256": "e414fe17b63dfbc2cf6cfdf658cbbceadcab9c35f1f6c700b2dce327c3bb7629",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "检查总表对不对｜拿现场重新生成一份来比，报出差在哪；不改、不提交｜在用",
   "sha256": "021dd20fa27e238fe3c8aa4aca6e699a49c80ad63d4abcad60dc8ff1e0068aa5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "给别的基座的状态摘要｜别的基座（例如体检）来问“Git 这块现在怎样”时，它不改任何文件，只回答“当前、要复核、被挡住、不知道”四种之一｜在用",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "新仓库放哪｜新的个人仓库放 V:\\Personal\\Projects，临时工作目录放 V:\\Personal\\Worktrees，Z 盘不放仓库｜在用",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "网站项目登记｜哪些项目上网站、叫什么：30 个公开介绍、4 个冻结的只放静态页、12 个不上（其中 1 条是改名前留下的旧名）；新仓库默认不上｜在用",
   "sha256": "021dd20fa27e238fe3c8aa4aca6e699a49c80ad63d4abcad60dc8ff1e0068aa5",
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
   "source_phrase": "项目数字｜给驾驶舱算每个项目 7 天提交数、最后一次提交、没合的分支、和 GitHub 同步没有；不联网｜在用",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-4f614f6662501b88f1c5.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4f614f6662501b88f1c5",
   "title_text": "公开和分享之前",
   "sha256": "94b199b5fe1636708ed7d90e3dd7cf36129a0b70812bc29a1316dffd5ae62be6",
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
   "asset": "_library/titles/title-bc67d336db85bbdbe8c5.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bc67d336db85bbdbe8c5",
   "title_text": "总表的维护",
   "sha256": "67e7682bb187808a65ad4fb51239291e08df9fb0b1e6c7518e3895666cd942b5",
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
   "asset": "_library/titles/title-40da45dafbd39c50e3b7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-40da45dafbd39c50e3b7",
   "title_text": "给网站和驾驶舱",
   "sha256": "2970ec4359cab19dcb1fa4ad743adf2aed0cb847c671348d4cb995cbbb31e4b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**公开和分享之前**
11. 敏感文件提示｜公开仓库的目录里出现 .env、私钥、secrets 文件夹这类文件，查询直接判“挡住”；日志、数据库文件列出来请 AI 复看｜在用
12. 推送放行规则｜一张表写清什么情况能推、什么情况先停｜说不准
13. 找到私有配套说明｜公开项目的内部说明放在一个私有仓库里，AI 维护时按登记找到；现在登记了 3 个项目｜在用

**总表的维护**
14. 刷新总表｜重新扫描，看板页和仓库清单一起重写，每个文件整份替换｜在用
15. 检查总表对不对｜拿现场重新生成一份来比，报出差在哪；不改、不提交｜在用
16. 给别的基座的状态摘要｜别的基座（例如体检）来问“Git 这块现在怎样”时，它不改任何文件，只回答“当前、要复核、被挡住、不知道”四种之一｜在用
17. 新仓库放哪｜新的个人仓库放 V:\Personal\Projects，临时工作目录放 V:\Personal\Worktrees，Z 盘不放仓库｜在用

**给网站和驾驶舱**
18. 网站项目登记｜哪些项目上网站、叫什么：30 个公开介绍、4 个冻结的只放静态页、12 个不上（其中 1 条是改名前留下的旧名）；新仓库默认不上｜在用
19. 项目数字｜给驾驶舱算每个项目 7 天提交数、最后一次提交、没合的分支、和 GitHub 同步没有；不联网｜在用

::screen{#github-local-index-10 section="features"}

```typeset
{
 "screen": {
  "id": "github-local-index-10",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第三张：没有标题、没有图例；“仓库大动作”组名下面先一行小字说明（含一个链接），再排卡片；“已停用”组的卡片整体颜色淡一些。",
  "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   }
  ],
  "anchors": [
   {
    "id": "g-major",
    "text": "仓库大动作"
   },
   {
    "id": "f-create",
    "text": "新建仓库"
   },
   {
    "id": "f-rename",
    "text": "仓库改名"
   },
   {
    "id": "f-set-visibility",
    "text": "改公开范围"
   },
   {
    "id": "f-default-branch",
    "text": "改默认分支"
   },
   {
    "id": "f-delete-transfer",
    "text": "删库和转移"
   },
   {
    "id": "f-refs",
    "text": "删分支、挪分支"
   },
   {
    "id": "f-remote",
    "text": "换远端地址"
   },
   {
    "id": "f-dryrun",
    "text": "先预演"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-hook",
    "text": "提交前拦密钥"
   },
   {
    "id": "f-push-record",
    "text": "推送里程碑记录"
   },
   {
    "id": "f-cognition",
    "text": "项目来源分页查询"
   },
   {
    "id": "f-generations",
    "text": "多代公开快照"
   },
   {
    "id": "f-task-map",
    "text": "计划任务地图"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "仓库大动作",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第三张：没有标题、没有图例；“仓库大动作”组名下面先一行小字说明（含一个链接），再排卡片；“已停用”组的卡片整体颜色淡一些。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "仓库大动作",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：照标杆“全部功能”的画法，但组名不单独占一整列：每组先一行毛笔字组名（横跨整行，左边一个小水彩图标），下面这组的卡片排成三列；每行字按“编号. 功能名｜一句话｜状态”给出，竖线不画：每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，最后的状态词画成右上角一个小圆点（照标杆，状态词不写成字，只画圆点：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉）。一组功能不跨屏。三张图上下拼成一整段，上下边都不画边框。这是第三张：没有标题、没有图例；“仓库大动作”组名下面先一行小字说明（含一个链接），再排卡片；“已停用”组的卡片整体颜色淡一些。",
     "portrait": "竖版：组名一行，卡片改成一行一张（图标、编号和名字、一句话、右上角圆点），组与组之间留一点空。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon",
     "inline_link"
    ],
    "portrait_component_order": [
     "section_heading",
     "status_legend",
     "feature_card",
     "icon",
     "inline_link"
    ]
   },
   "pending_requirements": [
    "毛笔组名与左图标未实现；状态词当前仍显示文字，要求右上圆点独占状态。"
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "新建仓库｜只在我的账号下建空仓库，先核对同名仓库确实不存在｜待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "仓库改名｜核对旧名、公开范围、默认分支，确认新名没被占，改完读回｜待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "改公开范围｜核对当前是公开还是私有再改，改完读回｜待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "改默认分支｜核对当前默认分支再改，改完读回｜待验收",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "删库和转移｜固定先预演：把所有分支、标签拉到本地各留一个备份记号，列出 issue、发布包等只在网页上的东西，拿给我看过再正式删或转移｜待验收",
   "sha256": "3777dffcebd18959634f0a7223b9ff2e81e3b6c7498df0f7a8941dcf69f8a0bd",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "删分支、挪分支｜删分支，或把分支挪到别的提交：原来的提交还在别的分支或标签里留着才动；删 GitHub 上的分支时，如果这期间有人推了新提交就不删｜待验收",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "换远端地址｜新地址必须是我登录的 GitHub 账号下、声明的那个仓库｜待验收",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "先预演｜同一条命令加上预演：检查目标、生成网页内容清单，不改 GitHub；删库和转移必须先走这一步｜待验收",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "提交前拦密钥｜7 月 8 日加，9 月 27 日删：AI 对密钥本来就警觉，密钥放密码中心｜已停用",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
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
   "source_phrase": "推送里程碑记录｜记下每次重要推送；9 月 26 日删，我不记得用过｜已停用",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "项目来源分页查询｜给已退役的个人知识库用，没有调用方了，9 月 26 日删｜已停用",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "多代公开快照｜总表曾是 8 份公开文档、留几代副本；9 月 26 日改成一页私有看板，旧版从 Git 历史找｜已停用",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "计划任务地图｜7 月时这里也出计划任务的健康表和地图，8 月下旬起交给电脑配置与恢复｜已停用",
   "sha256": "c6826d947b1a5b0e6f5f3c857ffd849b19652e70af280bd81b3b38ef8f86f4ad",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-2ebb0ad61f86cc85523b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2ebb0ad61f86cc85523b",
   "title_text": "仓库大动作",
   "sha256": "457a813999488dd77dc06fb597990b616c1a741476657b635b8d7a1d5430b443",
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
   "asset": "_library/titles/title-a8c3698b5b8c485d8bd4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a8c3698b5b8c485d8bd4",
   "title_text": "已停用",
   "sha256": "109419764a0213c3c797117892861b41eba1c925b8ea33a3c2d91df372cd05da",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**仓库大动作**
这一组 9 月 27 日 20:24 重写过，9 月 29 日又把删库和转移改成固定先预演；之后还没有用过的记录。哪几种要我验证：见〔重大动作与本人验证〕
20. 新建仓库｜只在我的账号下建空仓库，先核对同名仓库确实不存在｜待验收
21. 仓库改名｜核对旧名、公开范围、默认分支，确认新名没被占，改完读回｜待验收
22. 改公开范围｜核对当前是公开还是私有再改，改完读回｜待验收
23. 改默认分支｜核对当前默认分支再改，改完读回｜待验收
24. 删库和转移｜固定先预演：把所有分支、标签拉到本地各留一个备份记号，列出 issue、发布包等只在网页上的东西，拿给我看过再正式删或转移｜待验收
25. 删分支、挪分支｜删分支，或把分支挪到别的提交：原来的提交还在别的分支或标签里留着才动；删 GitHub 上的分支时，如果这期间有人推了新提交就不删｜待验收
26. 换远端地址｜新地址必须是我登录的 GitHub 账号下、声明的那个仓库｜待验收
27. 先预演｜同一条命令加上预演：检查目标、生成网页内容清单，不改 GitHub；删库和转移必须先走这一步｜待验收

**已停用**
28. 提交前拦密钥｜7 月 8 日加，9 月 27 日删：AI 对密钥本来就警觉，密钥放密码中心｜已停用
29. 推送里程碑记录｜记下每次重要推送；9 月 26 日删，我不记得用过｜已停用
30. 项目来源分页查询｜给已退役的个人知识库用，没有调用方了，9 月 26 日删｜已停用
31. 多代公开快照｜总表曾是 8 份公开文档、留几代副本；9 月 26 日改成一页私有看板，旧版从 Git 历史找｜已停用
32. 计划任务地图｜7 月时这里也出计划任务的健康表和地图，8 月下旬起交给电脑配置与恢复｜已停用

::screen{#github-local-index-11 section="history"}

```typeset
{
 "screen": {
  "id": "github-local-index-11",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左上标题。左侧约六成宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：一棵小树苗从一本摊开的账本里长出来，越往上枝叶越多，枝上挂着一张张小仓库卡片，树干上挂着一把小锁（代表改成私有），树下几片落叶上画着小叉（代表删掉的功能）。",
  "portrait": "竖版：标题；时间线一整行宽从上到下；插画缩小放在最后。",
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
     "text_ref": "演进",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "7月5日建库：一份公开的仓库总表和同步看板，顺带列计",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "width": "100%",
     "row": "history",
     "columns": 2,
     "columns_v": 1
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。左侧约六成宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：一棵小树苗从一本摊开的账本里长出来，越往上枝叶越多，枝上挂着一张张小仓库卡片，树干上挂着一把小锁（代表改成私有），树下几片落叶上画着小叉（代表删掉的功能）。",
     "portrait": "竖版：标题；时间线一整行宽从上到下；插画缩小放在最后。"
    },
    "desktop_component_order": [
     "chapter_title",
     "timeline",
     "icon",
     "illustration",
     "content_card"
    ],
    "portrait_component_order": [
     "timeline",
     "illustration",
     "chapter_title",
     "icon",
     "content_card"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "7月5日建库：一份公开的仓库总表和同步看板，顺带列计",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版画面：左上标题。左侧约六成宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：一棵小树苗从一本摊开的账本里长出来，越往上枝叶越多，枝上挂着一张张小仓库卡片，树干上挂着一把小锁（代表改成私有），树下几片落叶上画着小叉（代表删掉的功能）。",
     "portrait": "竖版：标题；时间线一整行宽从上到下；插画缩小放在最后。"
    },
    "desktop_component_order": [
     "chapter_title",
     "timeline",
     "icon",
     "illustration",
     "content_card"
    ],
    "portrait_component_order": [
     "timeline",
     "illustration",
     "chapter_title",
     "icon",
     "content_card"
    ]
   },
   "pending_requirements": []
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
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "7 月 5 日　建库：一份公开的仓库总表和同步看板，顺带列计划任务",
   "sha256": "c1406b3952dfe1326c7d6c43ac634d2d10b2836e0fba5427591d9d0e9460e2a4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "7 月 8 日　加上提交前拦密钥的检查和推送记录",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "7 月 10 日　AI 能单独查一个仓库，开始看它的全部工作目录",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "7 月 26 日　定下“进了 GitHub 主线才算交付”",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "8 月 1 日　删库、转移走专门的入口；8 月 12 日加新建私有仓库，8 月 21 日加改名",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "8 月下旬　计划任务交给电脑配置与恢复，这里只管仓库",
   "sha256": "c6826d947b1a5b0e6f5f3c857ffd849b19652e70af280bd81b3b38ef8f86f4ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "9 月 1 日　登记到 48 个仓库，之后陆续删掉不用的",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "9 月 17–18 日　能找到公开项目的私有配套说明；读失败和身份冲突分开",
   "sha256": "faba1a9345b3cdd9cab82c6e7d1509c4314366445446b4bab03139eab4f0afcc",
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
   "source_phrase": "9 月 26 日　总索引改成私有，合成一页看板；删掉推送记录和项目来源查询",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "9 月 27 日　大动作入口瘦身，拆掉拦密钥的检查；删掉一个不用的仓库后刷新",
   "sha256": "e414fe17b63dfbc2cf6cfdf658cbbceadcab9c35f1f6c700b2dce327c3bb7629",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "9 月 28 日　登记新拆出来的密码中心仓库，登记各项目上不上网站；现在 45 个仓库",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 29 日　删库、转移改成固定先预演，给我看过再动手",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-github-local-index.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-github-local-index",
   "source_phrase": "右侧一幅大一点的水彩插画：一棵小树苗从一本摊开的账本里长出来，越往上枝叶越多，枝上挂着一张张小仓库卡片，树干上挂着一把小锁（代表改成私有），树下几片落叶上画着小叉（代表删掉的功能）。",
   "sha256": "e365b0208f0e75f40c63f79598210e3b0bc529f83a26a6bcdfb133606b8e5f80",
   "status": "ready",
   "original_elements": [
    "一棵小树苗从一本摊开的账本里长出来，越往上枝叶越多，枝上挂着一张张小仓库卡片，树干上挂着一把小锁（代表改成私有），树下几片落叶上画着小叉（代表删掉的功能"
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

- **7 月 5 日**　建库：一份公开的仓库总表和同步看板，顺带列计划任务
- **7 月 8 日**　加上提交前拦密钥的检查和推送记录
- **7 月 10 日**　AI 能单独查一个仓库，开始看它的全部工作目录
- **7 月 26 日**　定下“进了 GitHub 主线才算交付”
- **8 月 1 日**　删库、转移走专门的入口；8 月 12 日加新建私有仓库，8 月 21 日加改名
- **8 月下旬**　计划任务交给电脑配置与恢复，这里只管仓库
- **9 月 1 日**　登记到 48 个仓库，之后陆续删掉不用的
- **9 月 17–18 日**　能找到公开项目的私有配套说明；读失败和身份冲突分开
- **9 月 26 日**　总索引改成私有，合成一页看板；删掉推送记录和项目来源查询
- **9 月 27 日**　大动作入口瘦身，拆掉拦密钥的检查；删掉一个不用的仓库后刷新
- **9 月 28 日**　登记新拆出来的密码中心仓库，登记各项目上不上网站；现在 45 个仓库
- **9 月 29 日**　删库、转移改成固定先预演，给我看过再动手
