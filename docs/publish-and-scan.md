# 构建、扫描与发布操作

更新规矩见 [网站怎么更新](update.md)。以下只列现有工具的操作入口。

## 工作副本、依赖与构建

正文作者输入见 [Astro 说明](../site-astro/README.md#内容文件怎么写)。唯一构建入口为仓库根 `npm run build`，内部走 `scripts/build-site.py` → `site-astro`。

日常构建使用主持已确定的常驻工作树 `E:\Cache\wly-site-build\wt`。每轮先核对未提交改动及正在使用同一 `dist` 的任务；有别人的改动或归属不明的文件时先交回主持，不能用切分支、重置或清理覆盖它们。确认源码工作区干净、上一轮写入者已经结束后，才从最新 `origin/main` 开始：

```powershell
Set-Location -LiteralPath 'E:\Cache\wly-site-build\wt'
git status --short
# 确认未提交源码改动已妥善处理，再依次执行。
git fetch origin
$refreshStamp = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::UtcNow, 'China Standard Time').ToString('yyyyMMdd-HHmmss')
git switch -C "refresh/$refreshStamp" origin/main
```

`git fetch` 失败时不执行下一步。切换前记下 `site-astro/package-lock.json` 的内容指纹，切换后比较；`npm ci --prefix site-astro` 只在首次安装，或这份锁文件内容变化时执行。常驻工作树的根及 `site-astro` 下 `node_modules`、`site-astro/.cache`、`site-astro/public`、`site-astro/src/content/rendered`、`.publish/typeset-out/_cache` 和 `dist` 均留在原地，不以“准备新一轮”为由清空。并行约束见 [Astro 说明的唯一构建入口与回执](../site-astro/README.md#唯一构建入口与回执)：同一 `dist` 只有一个写入者，各批构建依次运行。

预览用可控后台会话运行，设定就绪等待期限；成功、失败或超时后只停止本任务的进程／会话，不作为普通前台命令等待。

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 5194
```

部分构建前，按 Git 共享目录 `wly-oss/published.json` 的成品提交定位成功发布的 `site-dist`，核对发布清单、构建回执及非目标 HTML 的 SHA256。缓存基线不符时，先按成功构建回执逐文件校验原 `dist`，再同步到可重建 `dist`，只使目标路由的缓存失效，不用旧 `rendered` 覆盖正文。

## 扫描与公开词检查

`<dist>` 是仓库根 `npm run build` 生成的完整成品目录。构建已调用 `finalize-dist`；扫描和发布直接使用它。

```powershell
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist>
# 检查全站或指定路由；--out 指定本次扫描目录。
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages all --out <扫描目录>
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages /projects/daily-preferences/,/projects/password-center/
python -B -X utf8 site-astro/tools/publish_site.py --word-check-only <dist>
```

扫描默认 `published-diff`，按 Git 共享目录 `wly-oss/published.json` 比较上次成功发布与当前 HTML；外壳、排版引擎或共享脚本变化时用 `--pages all`。缺少成功记录时工具提示回退 `changed`，此时核实真实前版和累计范围。默认结果在 dist 同级 `scan-glance`，查看 `scan-result.json` 的逐页结果、截图、计时和 `dist_files_sha256`；`live_unavailable` 单列为实时接口不可用。

扫描依赖 Playwright、Pillow 和 urllib3。复用同一扫描输出目录可复用其中的 `oss-cache`；`proxy_stats`、`proxy_requests` 和 `attempts` 保存传输、缓存与重试证据。仅扫描静态稳定画面，不录屏。

公开词检查读取现有私有配置 `E:\PCConfig\registries\site_public_words.json`，完整文件、行列和邻近文字见发布输出的 `word-check.json`。规则原文省略由 `scripts/rule_original_contract.py` 读取同表。命中句的改写和精确单句例外见 [公开内容规则](design/panel-content-contract.md#public-content-gate)。

## 发布前浏览器检查

发布前用浏览器核直达路由、自定义 404、键盘导航、电脑和手机无横向溢出、控制台无错。驾驶舱等分本人版和公开版的页面，用本人默认 Chrome 的新标签页核本人版，检查首屏、下一屏和实时数据，用完关闭本任务标签页；无头浏览器只检查公开版。授权与状态页同时核与驾驶舱的联动，不代本人提交授权、解锁或锁屏。
目录路由的 canonical、Open Graph 和 sitemap 地址核对为实际返回 200 的尾斜杠网址。

## 发布做什么

```powershell
# 预演计划；输出是本地预演，不上传或部署。
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <扫描结果绝对路径> --dry-run
# 只上传并回读资源；此时公网网页尚未切换。
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <扫描结果绝对路径> --upload-only
# 正式发布。
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <扫描结果绝对路径>
```

可选参数：`--output <新目录>` 指定输出，默认在 `E:\Cache\wly-site-build\publish-runs` 的唯一目录；`--previous-manifest <文件>` 指定已核实成功前版，不传时自动发现；`--pages-timeout <秒>` 调整触发及等待 Pages 的期限，默认 1200 秒；`--source-commit <40位源码SHA>` 仅在构建来源缺失且已核真实作者输入时提供来源，否则优先使用构建回执，缺失记 Unknown。

从输出目录的 `publish-receipt.json` 读取上传计划、实际文件与字节、HEAD/GET 结果、源码与成品身份、Pages 运行网址、部署标识及每步耗时。`uploaded_only` 是只上传，`published` 是部署和公网回读通过；成功基线在 Git 共享目录 `wly-oss/published.json`。已部署但最终回读失败时，沿相同入口续发同版；恢复证明由发布器核验。

## 独立清理 OSS 旧对象

发布命令结束、释放锁后，从 `publish-receipt.json` 的 `oss_retention.command` 取得独立清理命令：

```powershell
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录> --dry-run
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录>
# 需要时调整本轮核对候选数，默认 1000。
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录> --retention-max-keys <数量>
```

保留正式发布输出目录到清理结束；后续已部署新成品时，改用当前成功发布的输出目录。查看 `oss-retention-plan.json` 和 `oss-retention.json` 的精确候选、保留原因、删除回读及残留。结果为 `retention_complete`、`retention_incomplete` 或 `retention_dry_run`；残留只影响清理退出码，不改已上线结果。正式发布默认延后清理；兼容参数 `--skip-retention` 记录 `skipped_by_request`。

施工清单在 Git 共享目录 `wly-oss/pins/<pin-id>.json`，通过 `plan_snapshot`、`plan_sha256` 和回执 `oss_retention_pin` 定位。历史清单缺原文件时看 `pending_pins` 的具体保留原因。已获本人批准的精确退役对象，按原回滚记录的 `retired_objects` 保存原大小及内容指纹；不改原清单或其哈希。

沿用本机现有 `aliyun ossutil` 的 `website-images` 配置、OSS profile 和 `wly0829-publication` 短锁，不另建凭据。

## EdgeOne live 函数单独发布

`live.wly0829.cn` 的实时状态转发由腾讯云 EdgeOne Pages（现称 Makers）项目承载。以后把 `edge/edgeone/edge-functions/[[path]].js` 的改动推送到 main，GitHub 工作流会更新函数专用部署分支，EdgeOne 自动发布；需要重发同一版时，也可以用下面的一条命令完成，无需再登录腾讯云。普通请求是“把最新 main 的 live 转发函数上线”，完成后应从公网主入口读到实际的新行为。前面的 `publish_site.py` 只更新 OSS 与 GitHub Pages，不会更新 EdgeOne 函数。

工作流使用 GitHub 自带的仓库写入权限，通过 Git API 将当前 main 的 `edge/edgeone` 文件树直接复用为同仓库 `edgeone-live` 分支的根文件树；不 checkout 全仓库，不需要腾讯云令牌。首个提交没有父提交，后续提交只接续该部署分支自身历史，普通快进更新，不把 main 的全站历史带入部署分支。main 始终是函数源码的编辑入口，`edgeone-live` 是工作流生成的部署结果，不在上面手工维护另一份源码。

每次 main 推送都会运行该工作流，但函数文件树相同时不生成新提交，也不触发部署分支更新；这项过滤在 GitHub 工作流中完成，不是 EdgeOne 路径过滤。日常部署只需把函数改动推送到 main；需要强制重部署时执行：

```powershell
gh workflow run edgeone-live.yml --repo wlyaaaaa/wly0829.cn --ref main -f redeploy=true
```

`redeploy=true` 即使函数文件树不变，也会创建新的部署提交，触发 EdgeOne 自动发布。工作流每次读取当前 main，排队的旧事件不会把部署分支退回旧源码。上述命令沿用已配置的 GitHub CLI 身份，不调用浏览器登录。

每次发布保留 main 源码提交、函数文件树 SHA、部署分支提交、工作流结果与 EdgeOne 部署 ID；平台显示成功后，再对 `https://live.wly0829.cn/computer-access/state?view=cockpit` 执行现行 live 验收，确认 `pcconfig.cockpit-view.v1` 精简视图和实际转发行为。响应大小随当前数据变化，不用固定字节数判定成功。工作流成功只说明部署分支已更新，不能代替 EdgeOne 成功记录及公网回读；失败也不能用旧成功部署的响应冒充本次发布通过。

暂停自动入口使用 GitHub 工作流的[停用命令](https://cli.github.com/manual/gh_workflow_disable)，恢复使用[启用命令](https://cli.github.com/manual/gh_workflow_enable)：

```powershell
# 暂停：停止 main 推送后生成新的 EdgeOne 部署提交。
gh workflow disable edgeone-live.yml --repo wlyaaaaa/wly0829.cn
# 恢复：启用后，执行上面的 redeploy 命令发布当前 main。
gh workflow enable edgeone-live.yml --repo wlyaaaaa/wly0829.cn
```

停用工作流不会撤回线上部署或关闭 live 服务，期间 main 的函数改动不会自动上线；恢复后显式重部署当前 main，避免遗漏停用期间的改动。EdgeOne 的生产自动部署复选框由平台默认开启且不可操作，因此停止入口在 GitHub 工作流一侧。

## 其他独立检查入口

离线链接与锚点检查由扫描器调用 `link_check.py`。`check.py` 提供逐屏原文、窄栏/表格宽度及空卡检查；`check-site-ui.py` 提供交互与历史基线检查；`run-typeset-checks.py` 和 `check-typeset-*` 提供几何、阅读位置与恢复检查，按任务所需选择，不作为另一条发布流程。

## 现有取数工具操作

旧取数工具的参数、来源表和回执格式见 [取数工具说明](../scripts/content-refresh/README.md)。以下入口供当前工具接线和故障诊断使用，更新范围仍按 [网站怎么更新](update.md)。

```powershell
# 只盘点。
python -B -X utf8 scripts/content-refresh/refresh.py --inventory --strict --output <本次目录/盘点>
# 当前工具的默认批量取数；targeted 限定人工核对和讲解清单，不筛自动取数来源。
python -B -X utf8 scripts/content-refresh/refresh.py --strict --no-report --output <本次目录/取数>
python -B -X utf8 scripts/content-refresh/refresh.py --strict --no-report --targeted <页id,...> --output <本次目录/取数>
# 只有本人明确点名才携带此标记。
python -B -X utf8 scripts/content-refresh/refresh.py --strict --no-report --manual-owner-request personal-health --output <本次目录/取数>
# 本路诊断。
python -B -X utf8 scripts/content-refresh/refresh.py --inventory --strict --only <页id,...> --output <本次目录/本路盘点>
```

盘点结果见 `dated-inventory.json`、`fact-tasks.md`；取数结果见 `result.json`、`number-edits.json`。应用、合稿及闭环入口的参数见取数工具说明；`--total-seconds`、`--item-seconds` 可调整现有读取预算。冻结路由盘点用 `site-astro/tools/frozen_inventory.py --routes <路由清单> --output <盘点.json>`，转换操作见 [冻结页转换](frozen-conversion.md)。

## 现有计划与作者源入口

只读计划与 v2 结果包字段见 [AI 刷新计划适配合同](maintenance/ai-panel-refresh.md)。

```powershell
npm run refresh:ai -- --project <Registry项目id>
npm run refresh:ai -- --project personal-health --manual-owner-request
npm run refresh:ai -- --all
npm run verify:ai-refresh -- --bundle <ai-result.json>
npm run impact -- --project agents --path AGENTS.md
npm run impact -- --project agents --path AGENTS.md --material-change
```

计划只定位来源、采集入口、当前作者源与指纹，不写正文。`--manual-owner-request` 仅携带本次已存在的本人点名事实。路径命中只是候选，`--material-change` 表示已确认漂移。

规则作者源由现有 `python scripts/prepare-astro-release.py refresh --output <本轮回执.json>` 从已核验的 current E release 更新到 `sources/rules`；构建再验证该快照并排版原文。Skills 目录和详情由 `sources/pages/skills-home`、`sources/pages/skill-*` 拥有。旧 React 专用的 `refresh:agents-snapshot` 与 `verify:snapshot` 已退役；文件指纹只说明作者输入是否变化，不代替当前活动规则与来源证据的核验。

## 独立阅读与几何检查

`check-typeset-site.py` 现在只读已有 `dist`，不构建、不发布，也不管理旧批处理账本。阅读计划或现成构建报告必须含 `pages` 对象及每页 `url`，且对应实际成品；报告和浏览器缓存写在 `dist` 外。

```powershell
python -B -X utf8 scripts/check-typeset-site.py `
  --dist dist --build-report <本代reading-plan或build-report.json> `
  --out <任务目录/reading.json> --pages <非首页的页名>
```

检查保留阅读位置、反复转屏、页内目录、刷新与历史导航矩阵，以及实际 HTML/脚本响应和成品字节不变检查。直接使用 `check-typeset-reading.py` 时也会排除首页和首页别名（首页是保留 HTML，不是排版阅读页）；不会用旧运行件补丁重建成品。

`run-typeset-checks.py` 的独立几何与 QA 能力继续保留。几何模式需要已经提供 `/__typeset/measure` 的本机预览，普通静态 `dist` 不自动提供该接口；输入、量测和证据契约见 [源包与独立检查](typeset-publication.md)。这些检查按具体任务使用，不接回 CI、不暗中触发重建或发布。

## 成品部署与回退

从发布回执的 `site_dist.commit` 取得成品 SHA，按回执所列 GitHub 运行网址定位本次 run id。重部署旧成品使用同一工作流的 `sha` 输入：

```powershell
gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref main -f sha=<旧site-dist提交SHA>
gh run watch <上条命令对应的run-id> --repo wlyaaaaa/wly0829.cn --exit-status
```

运行成功后核公网 `release-identity.json`、资源清单和关键页字节，分别记录源码 SHA、成品 SHA 与实际部署 ID。`github-pages` 环境保持只允许 `main`。回退后的公网版本与本机 `wly-oss/published.json` 不同时，下次增量发布先核真实前版，必要时传已核验的 `--previous-manifest`。源包与旧清单恢复材料见 [OSS 资源契约](oss-publication.md)。
