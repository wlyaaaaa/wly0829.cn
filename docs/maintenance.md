# 网站维护（一页）

在仓库根目录运行，唯一入口是 `scripts/check-typeset-site.py`。正文在 `sources/pages/<页名>/page.json`，构图在相邻 `layout.json`；构图的 `text_ref` 必须继续对应正文。首页使用 `sources/creative/static-home/`。旧兼容路由沿用已验收基线。

首次使用：把登记的完整验收包、旧静态壳及其无损素材缓存分别材料化到 `.publish/baseline/`、`.publish/legacy/`、`.publish/asset-cache/`，准备项目已有 Playwright/Pillow 依赖和正式 `scripts/check-site-ui.py`。Python、FontTools、Brotli 按 `config/render.lock.json` 的版本和 `python_tools` 目录准备；当前为 Python 3.14.7、FontTools 4.63.0、Brotli 1.2.0，后两者安装命令为 `python -m pip install --target E:/Tools/wly-typeset-python314 FontTools==4.63.0 Brotli==1.2.0`。入口开工即核依赖锁和检查器；冷启动先按下文读取正式播种交接，不要求为建立页账本重画全站。完整基线须含实际素材字节，不能只提供 HTML-only OSS 包。

正式播种使用**已发布且公网回读通过的完整 raw 包和 manifest**，不使用候选或失败包。`--baseline-seed` 读取 `wly.typeset-baseline-seed.v1` 交接 JSON：它绑定发布 commit、实际 publication/readback 报告、raw 身份、源构建报告与快照、源码绑定、评估环境、精确迁移证据、旧静态壳及逐页指纹；入口逐项核验这些文件的 SHA 和同代关系。播种只继承正式包与指纹，不制造原生出图缓存；首次选中的变化页仍实际生成并验收，未选页继承该正式 raw。

当前工作树已采用 native8ed 的 `scripts/prepare_native_readability.py` 及 builder/SSR 入口，仍待主线交接 `src/typeset/engine/content.py` 和正式 UI checker。原生源码的本地采用与静态接口检查不表示完整运行已通过；正式冷启动仍须等 C 成功发布回读、首页及原生最小源码正常合入主线，最终变基后绑定正式 seed 再验收。

每个**新批次**先选一个从未用过的 `$run`；同批恢复保留这个值。下例以默认旧壳和素材缓存已准备为前提，替换三个登记路径后冷启动检查急救页：

```powershell
$run='E:/Cache/Codex/Temp/<本次任务>/typeset-run'
$seed='E:/<正式播种交接>/baseline-seed.json'
$raw='E:/<该已发布版本的完整raw包>'
if (Test-Path -LiteralPath $run) { throw '新批次必须换一个未使用的run-root；续作使用下表resume命令' }
python scripts/check-typeset-site.py --pages rescue --baseline-seed $seed --baseline $raw --run-root $run
```

有其他必要变化页未被选择时，入口以 `required_outside_scope` 停止并列出页面；核清影响后显式选完整范围，或用 `--changed` 自动算范围。`--pages`、`--changed`、`--all` 三者互斥。

本批检查中断后，用原路径和原页范围恢复，不重新执行上面的新目录检查；若首次还显式传了 `--state-root`、`--legacy-site` 等，也原样保留：

```powershell
python scripts/check-typeset-site.py --resume --pages rescue --baseline-seed $seed --baseline $raw --run-root $run
```

下表普通新批以已有正式发布账本为前提；首次使用仍加冷启动的正式 seed/raw 参数。

| 操作 | 命令（先改唯一源） |
|---|---|
| 改一页，自动算影响 | `python scripts/check-typeset-site.py --changed --run-root $run` |
| 限定一页生成与验收 | `python scripts/check-typeset-site.py --pages rescue --run-root $run`；冷启动追加上述 `--baseline-seed $seed --baseline $raw`；图输入未变时仍复用完整页 |
| 全量重出 | `python scripts/check-typeset-site.py --all --run-root $run`；冷启动同样绑定正式播种输入 |
| 热修 | 修正文/构图/所属组件后按上述一页命令验收；发布用 `--resume --pages rescue --run-root $run --publish` 并保留原 seed/raw 等输入，共享代码改动用 `--changed` |
| 中断恢复 | `python scripts/check-typeset-site.py --resume --pages rescue --run-root $run`；仍用本批原 scope、seed/raw 和其他输入，发布中断再追加 `--publish`；不选新 run，不借此换页或换基线 |
| 明确全量准备 OSS 对象 | 在本次命令显式追加 `--full-upload`；仅在确需全量时使用 |
| 恢复已发布旧包 | 按下文手动恢复段指定精确 `-RestoreRef`、新的 `-Output` 和匹配该版的 `-LocalAssets`；当前完整门实际通过且已有该目标恢复授权后追加 `-Publish` |
| 加新页 | 新建 `sources/pages/<id>/page.json`、`layout.json`，登记导航及创意挂载范围；`python scripts/check-typeset-site.py --changed --run-root $run` |

`--run-root <目录>` 指定本次证据目录；CLI 默认仍是固定 `.publish/update/`，**不会自动创建新批目录**。新批显式传 fresh 路径；恢复传原路径和原选择范围。`--state-root <目录>` 指定正式基线账本和完整页缓存，默认 Git 共同目录下的 `typeset-state/`，本地阶段与输入状态留在本批 run；更换任务目录不会重置页缓存。`--typeset-root`、`--baseline`、`--legacy-site`、`--asset-cache`、`--inventory` 可指定已登记输入，`--jobs` 控制 QA 并发，默认 3。

正常发布及回读完成后，`published-page-fingerprints.json` 使用 `wly.typeset-published-baseline.v1`，后续新批默认读取它及所绑定的完整 raw，不再强制传第一次的旧 seed。新批显式旧 seed 与更新的正式发布不一致时会停止；不能把新页指纹搭配旧 raw，也不能把本地检查通过的候选当成已发布基线。没有正式 seed 或新版正式账本就在生成前停止，旧 plain 页表和候选不再授权继承。同批恢复使用保存的完整原 seed、基线、源提交、评估器和选页，不先用更新账本替换本批来源。

正式账本中 `raw_root` 和各 `path` 指向的**已发布批次 run** 是运行依赖：保留该批已有 `generation/dist/` 完整 raw、`generation/build-report.json`、`generation/input-snapshot/`、`publisher/publication-state.json`、其中 `readback.report` 指向的实际报告，以及证据指向的输入；初始 seed 另保留其所有 path/SHA 引用和旧壳。后继正式发布完整通过且账本已接管、没有中断发布待恢复后，才核对没有 seed/账本仍引用旧批，再按活动规则回收。只换工作副本或新建 run 不会消除这些依赖。入口不再复制整包到 `current-site` 或保存旧候选页表；本地成品也在 `generation/dist`。

已有推送尝试或实际 published 的 run 只允许原输入、原范围的 `--resume`，换需求或缺原上下文会在目录操作前停止。publisher 已 published 而外层附加回读失败时，恢复回读通过后复用正常成功收尾推进正式账本；同代已完成则核证后直接返回，不挪动 raw。只有实际 published 与同代完整 PASS/Git/raw 关系成立才保存正式账本，push unknown 的回读成功不会晋升。上述分支已在受控小文件夹具核对，真实完整发布及冷启动仍按正式交接验收。

仅当要更新已经登记的原生项目正文时，追加 `--native-routes`，数组写原生 `/projects/...` 路由且不带末尾斜杠，与本批 `--pages` 独立；例如在已有排版页批次中追加 `--native-routes /projects/chinese-asr/models-modes`。没有排版页批次时该参数会停止，不暗加排版页。原生正文由 SSR 重新生成后替换唯一 main，并同步所属元数据；Header/Footer 与其余资源沿完整基线。不存在的路由、画册页和非所属项目路径会拒绝。恢复省略该参数时沿本批原数组；路由数组、SSR/helper/builder、app/server/config 与 package.json/lock 输入变化会使本批失效，生成后再核输入未变。真实原生源码已接入本树，完整依赖与正式 seed 尚待前述主线交接；整页和线上结果仍在最终同代候选验收，参数接线本身不代表发布成功。

| 阶段 | 实际工作 |
|---|---|
| `inputs`：取输入 | 记录本批页面及输入身份，绑定本轮基线 |
| `generation`：生成和装配 | 变化的页出图，其余复用完整页；冻结输入、测几何，各准备步骤返回变化映射，最终材料化一次 |
| `checks`：检查 | 保留原排版 QA；检查影响路由及固定样本的 UI、图片页完整阅读矩阵、内容和 OSS 准备 |
| `publication`：发布 | 仅 `--publish` 执行；再次核验已验候选，复制后附加发布元数据，经原发布门推送 |
| `readback`：回读 | `--publish` 后确认实际线上版本及 HTML/素材字节 |

本次 `publication-state.json` 原子保存五段及各 Python 操作的开始、结束、秒数、失败原因和产物绑定；输入、范围或产物变化使相关段和后续段失效。固定样本为首页、驾驶舱、`/rules/charter/`、长项目 `.agents`、急救页，并追加 `/rules/` 真正原文层；首页交 UI 检查，实际 `typeset` 页面跑完整阅读矩阵。UI 回执绑定检查前后不变的候选 manifest SHA，旧回执或错代证据不能通过发布门。驾驶舱每次验收现跑；`--resume` 先核同批输入/范围，再读真实线上清单，确认已有发布时回读并重新检查驾驶舱。失败日志和上一轮包留在同目录 `retained-*`；确认不再被正式 seed/账本和恢复状态引用后，按活动规则回收。

推送已经发出但结果不明（`push_requested` / `push_result_unknown`）时，`--resume --publish` 只回读原发布代；原输入或候选绑定无法确认时停止交回，不重新上传或推送。确认发布失败而 main 已被其他人推进时也停止，不覆盖后续提交。

普通文字改动只重出变化页的图；纯装配或只影响静态壳与交互的 JS 改动复用图，再生成受影响候选。页指纹使用真实渲染依赖和稳定相对标识，装配依赖另行计入选页；实际共用 CSS、字体和公共依赖变化扩大影响范围。已有共享资源在原路径变字节或被删除且未证明引用范围时，验收扩大到全部路由；新增内容寻址图片只通过其引用页面进入影响集。没有变化且产物绑定仍成立时直接退出，不发布。外部目标 `github-profile` 不属于网站页面。

OSS 准备显式传 `--previous-manifest` 时先核该完整封口清单，缺失或无效明确失败；未显式传时从实际成功 Pages 部署取得前版，不把仅工具提交或旧本地记录当线上成功。仍没有可用前版就停，除非独立明确传 `--full-upload`；全量模式不复用旧对象表。`--all` 控制全量出图，`WLY_RELEASE_FULL=1` 控制既有全量重验。实际上传前的 `verify-local` 回执打印待传对象数量和字节数，扣除已保留及同计划已成功的对象。

上传、`VerifyRemote` 和成功发布后的对象回收共用 `wly0829-publication`。直接调用 `publish-oss-assets.ps1` 的 Upload/VerifyRemote 必须传真实 `-LockHolder`；已有同锁时继续传原持有人，不另造 PID holder 或第二把锁。上传前登记计划内不可变对象与源身份，封口及单独 VerifyRemote 重试补录真实 ETag，不能凭修改时间把候选永远当在途。已明确废弃的候选可在同锁下用 `python scripts/oss-retention.py retire --pin-id <登记ID> --plan-sha256 <登记SHA> --lock-holder <真实持有人>` 精确退役；未声明废弃不按年龄泛清。当前发布及其他在途对象保持，未知库存/响应不报告完成。发布器仅在正式成功、仍持同锁时调用回收，回收失败记 incomplete，不把已成功网页改成发布失败；真实自动回收仍待下一次成功发布回执，本次纯工具整合不重画既有候选。

差量上传和公网回读分别核验。正式发布器在替换发布包前读取线上小型版本标识，自动匹配 Git 共同目录下 `latest-typeset-readback.json` 的最近完整通过报告；匹配后只 GET 描述发生变化的对象，其余保留原通过证据。找不到、错代、报告损坏、线上标识无法核对或显式全量重验时回到完整 GET，并在发布状态及回读报告记录原因。每次完整回读通过后保存新的共享基准；正常末尾和恢复回读都沿用已有完整通过报告。直接调用 `publish-typeset.ps1` 时可显式传 `-PreviousReadback`；正式批入口自动选择基准，无需这个参数。

渲染固定为 `config/render.lock.json` 登记的 Chrome for Testing 154.0.8037.92，放 `E:/Tools/ChromeForTesting/`，无头运行且不读取本人浏览器资料。锁文件登记官方包/程序 SHA、渲染参数和系统字体版本/SHA；升级时先锁新版，再比较一次全量输出。首次安装按锁文件 URL 下载并核 SHA 后解压到登记目录，不能自动改用系统 Chrome。

发布沿用 `Publish-Pages.ps1` → `publish-typeset.ps1`。`--publish` 从 `.publish/publication-options.json` 读取 `Directive`、`LockHolder` 和可选 `paths`（OSS/布局等验收文件）；本轮 `RuntimeVerification` 和 `ReadingPlan` 由新检查入口绑定，必须有真实 UI、完整阅读和实际发布指令，入口不生成批准。发布前提交已验收的 `prep/*` 分支，再执行同批 `python scripts/check-typeset-site.py --resume --pages rescue --run-root $run --publish`，把 `rescue` 换为本批完整原范围并保留原 seed/raw 等参数；候选或范围变化后更新实际指令的绑定。发布器统一 Inspect/Acquire/Release `wly0829-publication` 短锁，持有人为 `Claude/<真实任务号>` 或 `Codex/<真实任务号>`；锁内直接复制已验候选，不重新运行 builder，也不修改原候选。代码迁移分支只作本地验收。

主分支 `publish-typeset.ps1 -UiFull` 扩展其额外 UI 门为全路由；Python 检查入口已自动覆盖影响集与固定样本。`Publish-Pages.ps1` 没有 `-UiFull` 参数，不能把它直接传给 Python 的发布包装入口。

## 网络失败与旧包恢复

live 浏览器网络门首次产生本轮新报告、返回正式失败码 2 且 `failure_class.retryable=true` 时，发布器自动调用已有 `--retry-failed`，只重测失败路由；原 `oss-browser-live.json` 保留，重试写 `oss-browser-live-retry.json`。继承 PASS 仍核 mode、origin、release/source release、plan/manifest SHA、完整路由和实际正文，旧 JSON 自填字段、缺新报告或 CLI 异常不能确认失败，也不盲刷全站。

重试按本轮绑定的实际事件分类：EMPTY_RESPONSE、ABORTED、连接/DNS/超时/TLS、缺正文或缺预期 SHA 等保持 Unknown（未确认）；第三方 frame 或服务 API 的错误也不能当作本站静态包缺陷。只有本包确切路由/OSS 对象的 HTTP/CSP 失败，或已取得 HTTP 200 正文且 SHA 与本轮预期不符，才是 confirmed。Unknown 保存 `online_native_network_unconfirmed` 后停止，不触发自动回滚；confirmed 才请求原恢复流程。原 status、失败事件和完整矩阵不改，候选 prepush 失败仍阻断。

旧 HTML-only 包可能带当年的完整内容门，但 checker 更新会使旧门失效；旧 770 就是这种情况，不是没有门。手动恢复必须用该旧包的完整 **sealed 对象目录**，让当前门重验每个对象 bytes/SHA、秘密、当前 PUBLIC 仓库库存、引用和预算。原始 raw 与已改写 OSS 字节可能不同，不能冒充 sealed 目录；也不能改旧 checker SHA、塞假 JS 或改用旧弱门。

持既有 `wly0829-publication` 锁并对齐/显式整合最新 main，在当前强门源码工作树执行以下准备；任务目录和两个输出目录都必须是新的，先不发布：

```powershell
$restoreRef='770fc6e800be6e7c824d2f01ac57be5f260d2959'
$task='E:/Cache/Codex/Temp/<本次恢复任务>'
$sealed='E:/<已核实匹配该版objects的完整sealed目录>'
$check=Join-Path $task 'checked-old-package'
python scripts/hybrid-release.py restore --ref $restoreRef --output $check
if ($LASTEXITCODE -ne 0) { throw '旧包提取失败，停止恢复' }
$manifest=Join-Path $check 'release-manifest.json'
$before=(Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLower()
if ($before -ne '5fb0800684594f5addb71d6511553764b3a5e8c8a3ba154612ac9c50612cbd01') { throw '旧770清单字节不符，停止恢复' }
node scripts/verify-public-content.mjs --dist $check --local-assets $sealed
if ($LASTEXITCODE -ne 0) { throw '当前完整内容门未通过，停止恢复' }
if ((Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLower() -ne $before) { throw '验证改动了旧清单，停止恢复' }
pwsh -NoProfile -File scripts/rollback-hybrid.ps1 -RestoreRef $restoreRef -Output (Join-Path $task 'restore-dist') -LocalAssets $sealed
```

最后一条会再次提取到新的恢复目录并经过同一门，检查旧 manifest 仍匹配目标 Git blob；已有针对该目标的恢复授权且全门实际通过后，执行时追加 `-Publish`。若先运行了无 `-Publish` 的准备命令，真正发布须把 `-Output` 换为另一新目录（如 `publish-dist`），不能复用已存在的 `restore-dist`。默认完整门回执位于该 dist 父任务目录 `local-content-gate.json`；校验不向旧 manifest 写入新 seal。若 registry 以后为目标版注入 seal，导致提取字节变化就停止，不能称为原字节恢复。发布只定向替换 `site-release`，不 reset/force push main；有并行 main 变化先整合，后续必须确认恢复 commit 的 Pages 与旧 release/manifest 及对象实际字节。

目前 `-LocalAssets` 的小夹具已验证坏对象 SHA 拒绝、原 manifest 不变；一次旧770真实本地门禁在五分钟上限内未结束，物化7057个文件、约3.68GB后停止，未获PASS或FAIL内容结论，清单字节仍未变。真实全门、真实恢复及公网通过尚未验证。自动恢复调用仍缺该版 sealed assets 的 handoff（资产定位传递），不能据手动参数宣称自动恢复已完整可用。

实时状态先读 `https://live.wly0829.cn/computer-access/state`，失败回退原 Cloudflare 地址；原同名路径直接导航报 `ERR_BLOCKED_BY_CLIENT`，页面内 Fetch 已验证，网页与图片维持原托管。
`edge/edgeone/edge-functions/[[path]].js` 只转发此接口，其他路径 404；回源 6 秒超时、不缓存，仅对正式站两种 HTTPS 来源开放跨域读取。
部署：压缩 `edge/edgeone/` 的内容为 ZIP，在 EdgeOne 项目 `makers-lrgrecs7uvjl` 的“新建部署”上传，选择生产；这是接口包，不上传网站或图片。
域名：生产关联 `live.wly0829.cn`，Cloudflare CNAME 仅 DNS，并按控制台添加归属 TXT、申请免费 HTTPS；`eo-test` 保留供试验。
撤回：网站回退本次提交，EdgeOne 回滚到本轮开始前的生产部署 `dpgfu7u5kqgm`；只删除本轮 `live` 的域名绑定及 CNAME/TXT，保留原记录与 `eo-test`。
