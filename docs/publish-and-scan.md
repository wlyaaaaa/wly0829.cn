# 增量发布与一眼错误扫描

先构建成品，再用一个扫描入口检查稳定后的画面。发布入口只传新增或内容变化的文件，并留下实测计时。扫描失败只报告问题；扫描器不改页面，也不替本人按授权、解锁、锁屏等按钮。

```powershell
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist>
# 只有外壳、排版引擎或共享脚本变化时另跑全站。
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages all
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages /projects/daily-preferences/,/projects/password-center/
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <scan-result.json> --dry-run
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <scan-result.json> --output <正式发布输出新目录>
# 上条发布完成、释放锁后，另跑清理；可与下一轮取数并行。
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录>
```

`<dist>` 是完整构建目录。构建最后调用离线 `finalize-dist`，一次完成资源地址改写和 OSS/Pages 分包身份；扫描和发布都使用收口后的同一份磁盘字节。这个函数不读取线上清单，同一输入的结果可重复，已收口且未改变的目录再次运行不变。唯一构建链已调用该收口步骤；发布入口不再改写页面或资源。没有构建回执时，扫描仍能读取成品并自行计算文件哈希。

资源地址由该资源和实际依赖的内容决定。修改一份 JSON 时，无关脚本和页面不会因为整包指纹变化而换地址；读取该 JSON 的脚本会随真正变化的依赖更新。循环引用使用有限的源依赖闭包，重复定稿不在循环中反复换键。

构建部分重建旧成品时，原始清单可带 `previous_oss`，值为上一次本机最终清单的 `oss` 对象。它提供旧对象的 `key`、`url`、`sha256`、`source` 及已有回执，供离线保留字节未变的地址、识别旧绝对引用；这不是一次成功部署证明。旧脚本中真正受依赖变化影响的引用会更新，查询参数和锚点保留。定稿清单保存结果，不再重复保存整个 `previous_oss` 副本。发布仍独立比较真实成功前版，决定哪些对象确实要上传。

## 发布做什么

- 显式 `--previous-manifest <文件>` 无效时直接报错；未指定时，沿用 `oss-retention.py` 对真实成功 GitHub Pages 部署的发现方式。不会把未部署的最新提交当成上一版。
- 先逐个比较整份 dist 的文件 SHA256 与指定扫描记录，增、删、改任何文件均拒绝发布并列出差异。再按最终成品清单与真实成功前版计算上传计划；对象地址变化也必须上传对应字节，不能因为哈希相同就跳过新地址。资源先上传 OSS，随后把原字节的 Pages 成品提交到专用 `site-dist` 分支；全部部署和回读通过后，最后写既有 Git 共享目录的 `wly-oss/published.json` 成功记录。
- OSS 对本次上传对象做 HEAD，核大小及 ETag 或 Content-MD5；首页、驾驶舱、`/computer-access/` 和变化的 HTML 做 GET，核 HTTP 200 和正文 SHA256。推完 `site-dist` 后，从 `main` 手动触发 `pages.yml` 并传入刚推的 `sha`；按触发命令返回的运行网址取得 run id，等待该次运行成功才开始页面回读。`--pages-timeout`（默认 600 秒）覆盖触发和等待，失败或超时直接报错；若 GitHub CLI 未返回运行网址，也报错而不猜是哪次运行。
- `oss-retention.py pin` 在上传前保留本次所需对象。保留集包含清单对象，以及成品 HTML、CSS、JS 中实际引用的绝对 OSS 地址。资源回读后，以本轮真实 HEAD 证明补齐受管对象登记并保存 pin；正式发布本身不调用 `collect`，不删除旧对象。部署和公网回读成功后写成功基线，返回 `status=published`、`publication_status=published`、`oss_retention.status=deferred`，删除数 0，退出 0。
- 每份施工登记在 Git 共享目录 `wly-oss/pins/<pin-id>.json` 的 `plan_snapshot` 保存清单原文，并以 `plan_sha256` 核对原始字节；`plan` 路径保留来源定位，原文件仍在时也核对其哈希，准备目录清掉不影响已保存的快照。发布回执的 `oss_retention_pin` 记录落点和清单哈希。历史登记没有快照且原清单已缺失时，保留该登记的全部精确 key，在 `pending_pins` 列明原因，继续核对其他候选；结果仍如实记为 `incomplete`，不会自动撤销其他施工登记。未知登记格式或现存清单哈希变化仍停止退役。
- OSS 退役在发布命令结束、释放发布锁后独立运行 `publish_site.py --retention-only <正式发布输出目录>`，可与下一轮调查、取数并行。该命令只接受成功实发回执，重新取得现有短锁，结束后释放自己取得的锁；不借用仍由发布过程持有的锁。保留该输出目录直至清理结束；后续已部署新成品时，须使用当前成功发布的输出目录，旧提交清理会被拒绝。现役资源和引用、有效回滚以及其他施工清单组成保留集。只核对已有受管登记中不被保留的精确 key，不整桶扫描、不按年龄认定用途。每个候选完整查询全部版本，核唯一 `null`、确为最新、大小和非空 ETag 与原证明一致，保存预演计划；删除前再核精确版本、线上成品提交和本地保留登记未变化，以原 API 精确删除 `VersionId=null`，删除后再次回读。缺证明、多版本或未知清单保留并列明原因，其他施工清单不会自动撤销。
- 每轮默认最多核对 1000 个受管候选，使用已有 8 路并发查询，可用 `--retention-max-keys` 调整；超出的对象留待下次单独清理。已核实不存在或已删的受管登记同步移除，不重复查询空对象。退役结果和预演分别写 `oss-retention.json`、`oss-retention-plan.json`。清理命令返回 `retention_complete` 或 `retention_incomplete`，残留只让清理命令退出 1，不改已上线的发布结果；可加 `--dry-run` 仅查询计划，返回 `retention_dry_run`，有未完成项仍非零退出。发布失败、仅上传或发布预演均不触发清理。
- 沿用已有 `aliyun ossutil` 的 `website-images` 配置，程序不读取、复制或记录凭据内容。没有新增 CDN 刷新步骤，既有被替换的发布链也没有这一步。

正式发布默认延后清理，不必再加参数。`--skip-retention` 保留兼容性，显式使用时回执记录 `skipped_by_request` 和删除数 0；它同样不在发布内清理。发布回执中的 `oss_retention.command` 给出后续独立命令，清理失败不把已上线状态改成发布失败。

每次运行在输出目录写 `publish-receipt.json`，包含逐步秒数、计划与实际传输文件数和字节数、HEAD/GET 结果、部署标识及失败原因。`--output <新目录>` 可指定落点；默认写到 dist 的同级唯一目录。失败回执会保留，不把上传完成当成发布成功。

`--dry-run` 同样先核扫描文件哈希，只读上一版清单，计算差异，并在独立临时仓库生成真实的 `site-dist` 提交。首次提交没有父提交；已存在分支时从其提交接续。预演不领发布锁、不 pin、不上传、不推送、不触发部署、不写成功记录。传输时间按固定 10,000,000 字节/秒估算；回执明确记录这个假设，它不是网络实测，也不包含 GitHub Pages 排队时间。

成品仓库包含全部 Pages 文件、资源清单和成品身份，部署工作流只保留在 `main`，源码工作树不切分支。关闭 Git 换行转换后逐文件核暂存 blob 原始字节；普通 push 不强推。`--source-commit <40位源码SHA>` 可说明成品对应的源码，优先使用成品已有构建回执；缺失写 `Unknown`，不把当前源码 HEAD 冒充构建证据。

## EdgeOne live 函数单独发布

`live.wly0829.cn` 的实时状态转发由腾讯云 EdgeOne Pages（现称 Makers）项目承载。以后把 `edge/edgeone/edge-functions/[[path]].js` 的改动推送到 main，GitHub 工作流会更新函数专用部署分支，EdgeOne 自动发布；需要重发同一版时，也可以用下面的一条命令完成，无需再登录腾讯云。普通请求是“把最新 main 的 live 转发函数上线”，完成后应从公网主入口读到实际的新行为。前面的 `publish_site.py` 只更新 OSS 与 GitHub Pages，不会更新 EdgeOne 函数。这条无人值守路线已于北京时间 2026 年 10 月 12 日完成实测。

北京时间 2026 年 10 月 12 日的已核实配置与结果：

- 现有项目名 `wly-edgeone-trial-20261006`，项目 ID `makers-lrgrecs7uvjl`；生产域名为 `live.wly0829.cn` 和 `eo-test.wly0829.cn`。
- 现有项目已关联 `wlyaaaaa/wly0829.cn`；GitHub App 已安装并仅选这个仓库。生产分支为 `edgeone-live`，生产自动部署默认开启，预览自动部署关闭。框架 `Other`、根目录 `.`、输出目录 `.`、编译命令 `true`、安装命令 `true`；两条 `true` 是 Bash 空操作，不运行网站全站构建，平台仍正常编译边缘函数。控制台 Node.js 版本仍为 `22.11.0`。域名、DNS 和证书未改。
- `.github/workflows/edgeone-live.yml` 已集成到 main 提交 `c3684acb2f909f93bf8955062fd953abc6c78384`。main 推送触发的 GitHub 运行 `38169676317` 于 03:50:06 创建并成功，生成首个部署分支提交 `9a30c350a8ef7be3485d687d4ea71857a6b10155`，父提交为空；根文件树为 `09cdec8fceee988f4ee256efe615c5c223ae8744`，只有 `edge-functions`。
- 首个小分支 Git 生产部署 `dpiskwlq1jrc` 于 03:54:37 发起、03:55:08 成功，克隆耗时 1345 毫秒，函数编译成功。03:55:53 的 `-RequireMainCompact` 验收通过，主入口返回 `pcconfig.cockpit-view.v1`，本次响应为 158942 字节。
- 无人值守实测由命令行触发 GitHub 运行 `38170111261`，事件为 `workflow_dispatch`，源码仍为上述 main 提交；03:56:26～03:56:36 运行成功。它生成提交 `82b496dd9a2d79f3e8a33c46d22f909acf4538f3`，唯一父提交为 `9a30c350a8ef7be3485d687d4ea71857a6b10155`，文件树不变。EdgeOne 自动产生生产部署 `dpcl7w6tn1js`，03:56:37 发起并成功，构建耗时 17 秒、克隆耗时 1745 毫秒；03:58:38 的 `-RequireMainCompact` 验收通过，响应为 158933 字节。本次仅通过浏览器只读观察记录，没有点击部署，也未创建腾讯云令牌或新增密码中心凭据。

工作流使用 GitHub 自带的仓库写入权限，通过 Git API 将当前 main 的 `edge/edgeone` 文件树直接复用为同仓库 `edgeone-live` 分支的根文件树；不 checkout 全仓库，不需要腾讯云令牌。首个提交没有父提交，后续提交只接续该部署分支自身历史，普通快进更新，不把 main 的全站历史带入部署分支。main 始终是函数源码的编辑入口，`edgeone-live` 是工作流生成的部署结果，不在上面手工维护另一份源码。

每次 main 推送都会运行该工作流，但函数文件树相同时不生成新提交，也不触发部署分支更新；这项过滤在 GitHub 工作流中完成，不是 EdgeOne 路径过滤。日常部署只需把函数改动推送到 main；需要强制重部署时执行：

```powershell
gh workflow run edgeone-live.yml --repo wlyaaaaa/wly0829.cn --ref main -f redeploy=true
```

`redeploy=true` 即使函数文件树不变，也会创建新的部署提交，触发 EdgeOne 自动发布。工作流每次读取当前 main，排队的旧事件不会把部署分支退回旧源码。上述命令沿用已配置的 GitHub CLI 身份，不调用浏览器登录。

每次发布保留 main 源码提交、函数文件树 SHA、部署分支提交、工作流结果与 EdgeOne 部署 ID；平台显示成功后，再对 `https://live.wly0829.cn/computer-access/state?view=cockpit` 执行现行 live 验收，确认 `pcconfig.cockpit-view.v1` 精简视图和实际转发行为。响应大小随当前数据变化，不用固定字节数判定成功。工作流成功只说明部署分支已更新，不能代替 EdgeOne 成功记录及公网回读；失败也不能用旧成功部署的响应冒充本次发布通过。

暂停自动入口使用 GitHub 工作流的[停用命令](https://cli.github.com/manual/gh_workflow_disable)，恢复使用[启用命令](https://cli.github.com/manual/gh_workflow_enable)；本次未执行这两个操作：

```powershell
# 暂停：停止 main 推送后生成新的 EdgeOne 部署提交。
gh workflow disable edgeone-live.yml --repo wlyaaaaa/wly0829.cn
# 恢复：启用后，执行上面的 redeploy 命令发布当前 main。
gh workflow enable edgeone-live.yml --repo wlyaaaaa/wly0829.cn
```

停用工作流不会撤回线上部署或关闭 live 服务，期间 main 的函数改动不会自动上线；恢复后显式重部署当前 main，避免遗漏停用期间的改动。EdgeOne 的生产自动部署复选框由平台默认开启且不可操作，因此停止入口在 GitHub 工作流一侧。

保留的历史边界：直接把生产分支设为 main、根目录设为 `edge/edgeone` 时，首次 Git 部署 `dpvondepzdi5` 已接收 `2.23 GiB`，随后出现 3926 条 `unable to write file` 和 `checkout failed`，未进入安装或构建。平台笼统概括为 Git 403，准确原因 `Unknown`；不能把它报告为权限原因。当前小分支路线已完成成功部署，不再依赖这条失败路线。

此前手动上传部署 `dpyqa3wa7o0h` 于 02:42:38 成功，来源为 main 提交 `0cbee36164ff5dbc98bf4eb60bedfeb0b44c49ec` 的 `edge/edgeone` 子目录，ZIP 根下只有 `edge-functions/[[path]].js`，未添加 `index.html`、`package.json` 或 `edgeone.json`。这条记录保留为历史恢复证据；解除 Git 关联后能否恢复上传或 CLI 路线仍为 `Unknown`，不将旧上传办法当作当前 Git 项目的现成恢复命令。函数目录及路由约定见[官方 Edge Functions 文档](https://pages.edgeone.ai/document/edge-functions)。

## 扫描做什么

默认 `published-diff` 比较 Git 共享目录 `wly-oss/published.json` 内上一成功发布清单与当前 HTML 的 SHA256，覆盖多轮构建累计的新增和变化页。规则换版仍使用该范围；只有外壳、排版引擎或共享脚本变化时另跑 `--pages all`，不是因 E 版本号变化就重扫全站。缺少成功记录时明确提示回退 `changed`，比较同一输出目录上一份扫描的页面哈希；没有扫描记录时选择全部页面。回退不证明成功前版，须核实实际累计范围。检查未完成的页面不会记成已完成，因此下次仍会选中。`--out <目录>` 可保存独立的一次验收，默认写到 dist 同级 `scan-glance`。

扫描器沿用 `rescue-sweep.py` 和 `rescue-sweep-dom.js` 的文字范围、可见性、滚动、哈希和截图方法。四个独立无头 Chrome 并行检查 1920×1080、3840×2160，设备像素比为 1。它启动任务自己的本机静态服务，按最终清单把尚未上传的新 OSS 地址映射到 dist 中的确切资源字节；旧继承资源和实时只读数据继续以公网一致的 Origin/Referer 请求，写请求不转发。预览仅在内存里把 URL 换成本机代理地址，磁盘成品不变。临时浏览器配置位于任务输出目录，用完释放，不读取本人的 Chrome 登录资料。

每页先等 load、字体及当前图片，网络静默一秒；从顶部滚到页底触发懒加载，等待图片和网络稳定，再回到顶部检查。超时或检查器异常是 `scan_error`，不会得到通过结论。不录屏、不判断动效或打开过程；这些仍由本人验收。

本机预览用 HTTP/1.1 保持连接，减少每张资源另建本机连接的开销；滚完后把整页可显示、已有 `src` 的图片设为 eager 并等待完成，再执行整页坏图检查，避免只等当前视口却检查整页。隐藏图片和页面左右范围之外的图片不被强制加载；缺少地址、真实坏图和仍残留的加载占位继续报错。浏览器关闭页面或取消请求导致的断开单独记入 `proxy_disconnects`，记录资源、断开位置和 Windows 错误码，不输出服务线程异常栈，也不把已经成功送出的响应算成上游失败。

扫描依赖 Playwright、Pillow 和 urllib3。转发 GET/HEAD 使用 urllib3 连接池，每个上游最多同时使用 4 条连接，取连接最多等 8 秒；每次连接超时 3 秒、读取超时 5 秒、总超时配置 8 秒。建连和完整正文读取的传输异常最多重试两次，浏览器只接收最终结果；真实 HTTP 错误和内容哈希错误不重试成成功。已映射的本地 OSS 对象继续优先读取成品原字节，并核清单 SHA256。

仅不可变的 OSS `releases/` GET 对象可缓存；按对象地址、清单内容 SHA256（如有）及 Range 分键，回读核 SHA256，损坏则重新取数，完整对象另核清单哈希。不同地址不借用同一哈希的缓存，以免盖住错地址的真实 404。缓存放在扫描输出的 `oss-cache`，复用同一输出目录可复用缓存；若输出在 dist 或源码仓库内，缓存改放系统临时目录的 `wly-scan-glance`，不进入成品或仓库。缓存和元数据先写临时文件再原子替换，实时接口不缓存。扫描结果的 `proxy_stats` 与 `proxy_requests` 保留本地取数、缓存命中、上游请求、重试和最终错误证据。

图片、关联空图框或加载占位未完成时，只在其每个相关图片都有明确传输失败证据时改记 `transport`。转发重试耗尽与浏览器限定网络错误沿用一次整页重扫，保留首轮 `attempts`；整页混有真失败就不自动重扫。404、哈希不符、HTTP 200 但无法解码的坏图、缺地址或没有对应请求证据的空框仍是真失败，不能因为另一张图超时就通过。

六类失败是大块空白、文字压叠、文字被裁、空图框、请求或站内链接与锚点错误、可见按钮或链接点不动。屏幕像素阈值与叠放白名单集中在 `scan_glance.json`。栏底空白仍须超过 200 像素；用本人截图校准后，行高比例从 25% 调为 20%，使“手机上也能用”屏实际 218.8 像素、20.54% 的空白被检出，屏内竖带仍须超过视口高度 40%。原普查另外七类保留为提示：屏外或透明文字、占位词与坏字、重复标题、重复卡片、重复大图、横向越界、日期说法。

本人已于北京时间 2026 年 10 月 11 日 04:32 验收首页。`home_locked` 现默认 `true`，全站扫描、改页扫描及路由指定扫描均跳过首页，也不把首页发出的离线断链列入结论。以后首页的视觉改动由 AI 看静态截图、本人看效果，不再等待主持手动打开锁定。新扫描器不写死时段按钮个数。

输出 `scan-result.json` 记录页面、视口、类别、元素选择器、坐标、逐页计时及截图路径，并记录全 dist 的 `dist_files_sha256`。开始和结束的成品清单不同会报 `scan_error`，不能得到通过结论。每页每视口一张整页 PNG，失败局部图从同一张完整截图按实际坐标裁切。请求失败没有元素坐标时附首屏；未选中页面的离线断链只记录 `viewport=offline`、空坐标，不伪造局部截图。退出码非零表示有失败；实时接口读不到单列为 `live_unavailable`，不计作静态 404。

## 旧入口的处理

已移除 `publish-oss-assets.ps1`、`Publish-Pages.ps1`、`publish-typeset.ps1`、`publish-hybrid.ps1`、`publish-assembled.ps1`、`rollback-hybrid.ps1`，以及准备器的 `verify-remote`、`seal-remote` CLI、旧 hybrid restore 和专属测试。历史完整 GET/封存格式的解析和测试辅助函数仍供旧清单回归，发布入口不调用它们。`fullsite_check.py` 的通用溢出、坏图、请求错误和空白检测由新扫描器接替，已删除。

保留 `link_check.py` 作为新扫描入口调用的离线链接和锚点检查，只有一份实现。`check.py` 还有逐屏原文对照、窄栏/表格宽度和空卡内容检查；`check-site-ui.py` 还有专门的交互与历史基线检查；`run-typeset-checks.py` 和 `check-typeset-*` 还有几何、阅读位置和恢复证据，均未被这次稳定画面扫描完整覆盖。它们不代替新扫描入口；本次不运行其中的动效审查。旧 UI 检查的时段标签已改为四个，并同步删除对应两条循环按钮缺失基线。

## 与构建链的接线

这次只改发布和扫描，不接管构建。`pages.yml` 只允许从 `main` 手动触发，必填 `sha` 是 40 位十六进制的 `site-dist` 提交号；先 fetch 该分支并核实提交属于其历史，再 checkout 该提交、configure-pages、upload-pages-artifact、deploy-pages；CI 不构建、不扫描。官方成品上传动作始终排除 `.git`、`.github`。`check-typeset-site.py` 现只读已有 dist，阅读位置、转屏、导航和哈希检查保留。构建调用 `finalize-dist`；必要的资源复制和历史继承逻辑集中在 `prepare-oss-release.py`，旧 hybrid 装配、全量验证及其 CLI 已退出。

现有 `github-pages` 环境于北京时间 2026 年 10 月 11 日 05:17 只读确认仅允许 `main`，保持该设置；发布窗口先把本次工作流合入 `main`，再执行发布命令，本次没有改设置、建远程分支或部署。回退用同一入口：`gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref main -f sha=<上一个site-dist提交号>`，等待返回的 run id 成功后核公网资源清单和成品身份。不能把本地预演说成真实上传、Pages 部署或五分钟发布已经验收。
