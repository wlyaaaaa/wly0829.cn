# 构建、扫描与发布操作

按需更新从 [网站怎么更新](update.md) 的批次入口走，发布同一批次的选页。以下是组装、扫描、回收及独立发布整份成品时使用的共用工具。QA 和按需更新各用自己的源码、成品和回执；家里 QA 站另有安排，按需发布只切公网。

## 工作副本、依赖与构建

在本轮工作副本从仓库根运行 `npm run build`。`scripts/build-site.py` 组装 `site-v2/` 网页源和 `site-v2/live/` 的实况前端，生成完整 `dist/`，最后离线改写 OSS 资源地址。旧 `/cockpit/` 四个地址由同一构建生成跳转，保留查询参数和 hash。

按 [README](../README.md) 配齐本机输入。正式构建从包含本轮提交的干净工作副本开始。预览只读已有 `dist/`，结束后关闭本任务起的预览进程。

```powershell
npm run build
python -B -X utf8 site-v2/site-assembly/组装.py --只检查 --output dist
npm run preview -- --host 127.0.0.1 --port 5194
```

`dist/.build-receipt.json` 记录真实源码身份、输入指纹、文件清单、构建时间与各步骤耗时，`release-manifest.json` 与 `release-identity.json` 由现有准备库封口；没有成功封口就不进入正式发布。源码未提交时记 `Unknown`，不冒充提交版本。可复现的发布清单不写每次变化的构建时钟，实际时间只在构建回执里。

内容缓存放在忽略的 `.cache/site-assembly/`，删除后自动重建；规则页缓存包含当前活动规则指针、实际规则和模板内容。`python -B -X utf8 scripts/build-site.py --full --cache-dir .cache/cold-build` 用一个新的空缓存目录验证全冷构建。`python -B -X utf8 tests/test_incremental_build.py` 会实际改一页、对比增量与空缓存构建的完整文件名和 SHA-256（构建回执含时钟与耗时，单独排除），最后还原源文件。

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

扫描依赖 Playwright、Pillow 和 urllib3。电脑用 1536×860 的桌面上下文，手机用 390×844 的移动设备上下文（支持触摸、识别页面视口）；本站 `width=1440` 的页面在手机上按整页等比缩小，不按 390 宽重新排版。复用同一扫描输出目录可复用其中的 `oss-cache`；`proxy_stats`、`proxy_requests` 和 `attempts` 保存传输、缓存与重试证据。仅扫描静态稳定画面，不录屏。

用 `python -B -X utf8 scripts/check-visible-text.py <预览地址> --details` 扫两版的可见文字。输出按页面和版本列出 `issues`；其中“拼行残留列表符”标出疑似在句末拼入的列表符及附近原文。

公开词检查读取 `E:\PCConfig\registries\site_public_words.json`。正式构建、组装检查和发布检查遇到公开成品中的 `owner_row_words`（仅本人可见词）时停止，其他词表命中和跟踪源码命中继续提示。精确登记的例外只放过原文范围内的指定词，带 `live: true` 的 `dist/*` 例外也适用于不同公开成品文件。`public_judgments.same` 只减少普通提示。`scripts/site_public_words.py` 继续检查密码、密钥、令牌、验证码、手机号、通过校验的证件号和银行卡号以及结构化住址。拦截报告只给文件、类别和行列；发布输出的 `word-check.json` 将提示和 `blocking_hits` 分列，命中拦截的文件不附带词表原句。成品根目录的 `.build-receipt.json`、`release-manifest.json`、`release-identity.json` 属于非展示构建记录。规则原文省略由 `scripts/rule_original_contract.py` 读取同表。提示由 AI 按意思判断。[公开内容规则](design/panel-content-contract.md#public-content-gate)

## 发布前浏览器检查

发布前用浏览器核直达路由、自定义 404、键盘导航、电脑和手机无横向溢出、控制台无错。驾驶舱等分本人版和公开版的页面，用本人默认 Chrome 的新标签页核本人版，检查首屏、下一屏和实时数据，用完关闭本任务标签页；无头浏览器只检查公开版。授权与状态页同时核与驾驶舱的联动，不代本人提交授权、解锁或锁屏。
目录路由的 canonical、Open Graph 和 sitemap 地址核对为实际返回 200 的尾斜杠网址。
新版普通公开页由组装器写入 canonical 和 Open Graph 正式地址（目录页保留尾斜杠、内容页保留 `.html`）；404 保持 noindex 且不加 canonical，站点所有权验证文件照常发布但不进 sitemap。
`npm run test:built` 对已有 `dist/` 跑现役成品检查。授权页按当轮真实接口和发布范围核对。

## 发布做什么

发布器跳过 `live/_fixtures/` 下全部开发示意数据：不上传到 OSS 或 GitHub，也不纳入发布的公开文字检查。它们仍保留在本机 dist，供带 `?fixture` 的本机预览使用；构建与预览不受影响。

规则页的公开稿和本人正文由同一次构建、按同一个规则版本生成：`npm run build` 默认取当前活动版本，组装时生成公开规则页，同时把本人正文写到电脑服务的 `E:/Data/RemoteComputerMCP/state/owner-rule-pages/<版号>.json`（可用 `WLY_OWNER_RULES_OUT` 改去处；这台电脑没有该运行目录时只出公开稿）。本人正文由家网本人读口和已配对设备读取；网站构建和发布目录只包含公开稿。不再手动补本人正文，也不用 `WLY_RULES_RELEASE` 固定旧版本。单独补一份时仍可运行：

```powershell
python -B -X utf8 -I site-v2/first-layer/rules-page/demo/build.py --release E:/.agents/releases/<版号> --owner-out E:/Data/RemoteComputerMCP/state/owner-rule-pages
```

发布用的 `<dist>` 必须带实况垫底文件 `live/_fallback.json`（电脑和云上副本都不可用时实况页读它）。将 `$env:WLY_LIVE_PCCONFIG_ROOT` 设为这次发布对应的 PCConfig 工作树，`$env:WLY_LIVE_FALLBACK_CMD` 指向同一工作树的导出器，然后 `npm run build`。下例用 `E:\PCConfig`：

```powershell
$env:WLY_LIVE_PCCONFIG_ROOT = 'E:\PCConfig'
$env:WLY_LIVE_FALLBACK_CMD = 'python -B -X utf8 E:\PCConfig\tools\remote-computer-mcp\export_public_fallback.py --strict --out "{out}"'
npm run build
```

构建和发布预演会核对随站备用包使用的访客规则及资源身份。涉及后端契约换版时，先用发布对应的后端生成云端和随站副本，再更新边缘接口及网站。普通本地构建可以省略备用包变量。

两条线实际发布时共用正式入口和发布锁，先用最近一次正式成功的成品比对。另一线先发就重新核基线。下列直跑发布器的命令适用于已授权的独立整份成品发布，按需更新从 [批次入口](update.md#十三本轮清单怎么跑) 调用该工具。

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

新版于 2026-11-22 完成从升级页的首发切换。旧站清单仅留作首发历史，日常使用最近的正式成功基线。

新包重新采用已退役的旧对象键时，发布器重新 HEAD 核验，缺失或不符就从本次成品补传，再次核验。重新采用的资源需要在本次成品有原字节。

## 正式发布后回收 OSS 旧对象

部署、公网回读和成功基线登记都通过后，发布器在同一把发布锁里回收旧对象。预演、仅上传以及发布失败时跳过回收。新版保留当前清单引用和在途发布占用。上一版独用的图和其他生成对象在本次回收时删除，只按核对过大小、ETag 和版本的精确对象名操作。

选页发版保留未改页所需的旧资源，从保留的旧 HTML 及经核验的资源字节追到间接依赖。`publish-receipt.json` 的 `retained_reference_gaps` 如有条目，查看记录的页面或对象及原因。缺证据的上一版对象暂时保留，在结果页记下这部分待查内容。

每次回收在本次发布输出目录写 `oss-retention-plan.json` 和 `oss-retention.json`。前者列计划删除的精确对象和字节数，后者列实删对象、字节数、残留或错误，以及删除前后的 GetBucketStat 对象数、容量和统计时间。桶统计可能延迟，实删以逐对象回读为准。`publish-receipt.json` 的 `oss_retention` 给出状态和回执路径，回收出错时已发布结果仍显示 `published`。

发布成功和旧版清理分别记结果。用上版清单和本轮退役、改址记录核普通旧网址，确认 404/410 或实际到达新版目标。普通访问仍出旧字节时，在对应缓存来源处理后再读一次。OSS 回收补跑只覆盖对象清理，旧网址和缓存回查见 [收尾步骤](update.md#第-7-步-发布结果页收尾)。

要补跑或预演回收，从 `publish-receipt.json` 的 `oss_retention.command` 取命令，用当前成功发布的输出目录：

```powershell
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录> --dry-run
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录>
# 需要时限制补跑核对的候选数。
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录> --retention-max-keys <数量>
```

补跑结果为 `retention_complete`、`retention_incomplete` 或 `retention_dry_run`。补跑和回收预演各写新的子目录，终端输出 `receipt` 指向本次回执。只有显式传 `--skip-retention` 时，正式发布才会记为 `skipped_by_request`。

施工清单在 Git 共享目录 `wly-oss/pins/<pin-id>.json`，通过 `plan_snapshot`、`plan_sha256` 和回执 `oss_retention_pin` 定位。历史清单缺原文件时看 `pending_pins` 的具体保留原因。已获本人批准的精确退役对象，按原回滚记录的 `retired_objects` 保存原大小及内容指纹；不改原清单或其哈希。

沿用本机现有 `aliyun ossutil` 的 `website-images` 配置、OSS profile 和 `wly0829-publication` 短锁，不另建凭据。

## EdgeOne live 函数单独发布

实况先读电脑。EdgeOne 读不到时会从 OSS 取 `policy-10` 公开备用包的生成时刻和受众证明，响应为 `no-store`。浏览器也可通过同版 `release-identity.json` 读随站 `live/_fallback.json` 的元数据，公网用 OSS 地址、家网预览用本地路径。备用包只说明生成时刻，离线提示按页面实际读到的数据展示。

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

## 成品恢复

发布回执保留源码 SHA、成品 SHA 和实际部署 ID，用于定位同一版。发现问题时先在源码修复，重新组装并发布，回读公网成品和涉及的页面。如确需恢复旧内容，从可用源码重建并确保本次成品含所需资源，再走同一发布入口。新版成功后会清理上一版独用素材，旧成品 SHA 只作追溯。
