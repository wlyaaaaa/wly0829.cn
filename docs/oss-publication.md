# HTML 留在 GitHub、资源迁往上海 OSS

用户北京时间 2026-10-04 00:07 同意图片、视频迁到阿里云北京生产桶默认 HTTPS 地址，并明确说“我同意，视频也换这个地址，你不要忘记视频”。迁移保留内容图片、MP4、遮罩和封面的原字节；静态脚本、样式、字体和搜索数据一并迁走。本站导航和状态 API 保持原目标。视频运行时更新与首页指定导航更正先由各自维护者准备，再交本管线改资源地址。

同日 02:53 引导 `3ac11b33-8a56-4beb-9b60-a948f8fc75e6` 将正式源改为上海桶 `wly0829-img-media-shanghai`（cn-shanghai），默认地址 `https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com`；北京桶原样留作备用，已上传对象保留。切换前，隔离候选须在本人电脑完成电脑、手机模拟各至少两轮冷缓存整页验收，稳定在 2 秒内；失败轮次保留。

`prepare-oss-release.py` 只准备本地发布包；`publish-oss-assets.ps1` 上传并核验资源。最终 HTML 由既有 Pages 发布负责人集成、验证和发布。两者不读取凭据文件，不登录，不创建账号，不提交或推送，不改桶设置。

同版附加要求来自 00:12 引导 `aac557ef-ebb6-4a14-9ff5-d495dce33fdc` 和 01:25 引导 `3071ed41-1b86-4536-98db-ea25c9e82042`：首页仅修改指定六处链接；视频直接流式加载；只有视频与当前插画有可靠一致性证据时挂载，其余保留静图和所有原媒体。跨来源迁移不授权重画或重编码素材。

## 输入与输出

输入必须是完整当前发布包，`release-manifest.json` 的 `files` 与真实文件逐项 SHA-256、大小及库存一致。不要从页名列表裁剪包：旧下层路由也必须保留。视频运行时和首页更正产生的 staging 包需先重建同一清单，再用作输入。

正式首版统一入口先绑定首页链接、视频证据，再分离资源。首页目标 `/how/` 只有在源清单和真实文件指纹中存在时恢复；未发布时使用现有协作说明页。视频证据须与完整源包、视频、遮罩和首屏静图指纹一致。

```powershell
python scripts/prepare-oss-publication.py `
  --source <完整当前发布包> --output <全新统一准备目录> `
  --video-bindings <完整来源核对JSON> `
  --asset-base-url <已选定的上海HTTPS origin> --prefix releases/<本次唯一版本>
```

统一输出的 `runtime/` 是保留全部媒体的完整包，`assets/` 是下面的资源分离结果。后版动效和其他页面修复从这份完整包继续生成，不能拿仅含 HTML 的 GitHub 输出冒充完整媒体源。

```powershell
python scripts/prepare-oss-release.py prepare `
  --source <完整已核实发布包> `
  --asset-base-url <已选定的上海桶默认HTTPS origin> `
  --prefix releases/<本次唯一版本> `
  --previous-manifest <上一版封口的release-manifest.json> `
  --output <全新准备目录>
```

首次迁移省略 `--previous-manifest`；后续发布显式提供上一版封口清单。准备器从原文件大小与 SHA-256 开始筛选复用对象，再传播脚本、样式和数据中的依赖地址变化，逐字节核对最终输出。未变对象继续引用原对象键和完整 GET 回执；只有变化对象进入本次新前缀、上传和完整 GET。文件名、图片清晰度、尺寸、质量及二进制正文均不为省流量改变。

桶名、profile（配置身份）、CLI 位置来自 OSS 迁移交接及本人选定目标，不能从旧桶或测速例子推定。准备器支持北京与上海的默认 HTTPS origin；本次正式发布使用上海，不带路径、查询参数或图片处理参数。版本前缀不能重复使用给不同内容。

输出为：

- `github/`：全部原 HTML 路由和必要站点控制文件；HTML 只改资源引用。普通导航链接、内联正文、实时状态 API、热区和转屏逻辑保留。
- `oss/`：全部非 HTML 内容资源，保持原相对路径。引用和历史资源均保留，不暗删旧资源。图片、MP4、遮罩、封面等二进制逐字节原样复制。
- `oss-plan.json`：输入及输出大小/指纹、版本对象键、真实引用闭包、逐字符 URL 改写位置、改前改后内容、控制文件例外及汇总。`remote_verified: false` 表示本地准备从不冒充远端通过。
- `remote-verification.json`：运行远端核验后生成，绑定 `oss-plan.json` 的真实文件指纹。新对象有本次完整 GET，未变对象沿用同一地址与指纹的旧完整 GET，完整覆盖后才有 `html_ready: true`。

“只留 HTML”的必要技术例外为 `CNAME`、`.nojekyll`（存在时）、`robots.txt`、`sitemap.xml` 和 `release-manifest.json`。它们服务 GitHub 的域名、抓取与既有生产恢复入口，保留原控制行为；页面内容资源全部去 OSS。清单 `files` 对应 GitHub 文件，`oss.objects` 对应 OSS 文件。原 `baseline_files`、接受批次和回退引用仍是原发布历史证据，不伪造为本次云核验。

## 地址改写范围

HTML 的资源属性、srcset（多尺寸图片地址）、内联 CSS 和内联 JSON 都按原页面地址解析。JSON 中 `avif_assets` 的对象键和值同时更新，避免 AVIF 回退映射失配。CSS 的根路径及相对 `url()`、`@import` 按原 CSS 文件解析。JavaScript 的模块 import、动态 import 和 Vite 预加载数组指向同一版本。

当前改写版本2也覆盖 `data-lazy-srcset` 和 `data-lazy-style`，确保懒加载激活后仍使用同代OSS地址。版本号写入计划与发布清单；旧清单没有版本号时按版本1重放。校验旧版来源时不能用新版本替换旧确定性改写。

Vite 共享预加载器原先给数组地址添加 `/`；数组迁成绝对 URL 后，只把这一个 URL 前缀字符串改为空。截图运行时原先给 `shot.src` 添加 `assets/`；页面数据已改成绝对 URL，只移除该 URL 拼接前缀。这两项都完整写入 URL 差异日志，不改业务分支。搜索记录脚本本身保留原 bytes，其中的 HTML 导航和技术正文不替换。

每次本地核验都从源重新执行同一改写并逐字节对照产物；未记录的改动、输入漂移、二进制变化和丢失的本地资源都会失败。准备输出须为全新目录，输入目录永不修改。

## 上传与远端核验

```powershell
# 只检查本地，不上传、不发布。
pwsh -NoProfile -File scripts/publish-oss-assets.ps1 -Preparation <准备目录>

# OSS 交接到位后由负责人执行。身份直接交官方 CLI，不经过模型。
pwsh -NoProfile -File scripts/publish-oss-assets.ps1 `
  -Preparation <准备目录> -CliPath <handoff中的aliyun程序> `
  -CliProfile <handoff中的OAuth配置身份> -Upload

# 已传好时，可单独重新核验所有对象。
pwsh -NoProfile -File scripts/publish-oss-assets.ps1 `
  -Preparation <准备目录> -VerifyRemote
```

上传按 MIME 类型分组，每组保留原路径，指定正确 `Content-Type` 和版本资源的长期缓存头。使用已交接的现代 `aliyun ossutil cp` OAuth profile，region 从默认域名解析；不使用长期 Key 参数、配置查看或调试输出。公共读、允许本站的 Referer、GET CORS（跨域读取）由桶交接提供，上传工具不自行修改。模块脚本和视频读取必须在实际本站来源下通过 CORS。

上传使用 `--ignore-existing --force`：前者跳过已有对象，后者免除交互提示；已实测同一计划第二次上传为零对象。发生部分传输失败时，保留真实 CLI 记录并生成实际 GET 核验结果。`retry-failed` 只重查同一计划指纹和完整对象集合中失败的项目，旧失败回执另存，保留的通过项仍来自真实完整 GET。已存在的错误正文不覆盖，另起新版本前缀解决。所有旧版本前缀保留。

外置 CSS 的背景资源使用 CSS 自己的 OSS 地址作为 Referer。桶名单除了本站，还须允许自身默认 HTTPS 域名；否则浏览器背景图会被拒绝。首版先实际回读确认两桶 Referer/CORS 相同，随后仅为上海补上 `https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/*`，保留禁止空 Referer、其他来源和 CORS 原值；北京不改。此配置修复由负责人持短锁单独执行及回读，不由上传器隐式改桶。

同日07:10的明确指令另外授权两桶 `ResponseVary=true`；这项配置已经单独回读并用同URL普通图片→CORS图片→GL上传测试。北京上述Referer未改。以后是否改配置仍依据真实指令，上传入口不隐式改桶。

正文证明在对象首次上传后的封口阶段完成：每个新对象执行匿名完整 GET，带实际本站 Origin/Referer，检查 HTTP 200、真实正文大小、SHA-256、MIME 和 CORS；新 MP4 另执行 Range GET，核对 206、`Content-Range` 及完整正文中的相同分段。未变对象沿用旧地址和已验证正文回执，不再上传、完整 GET。上传退出码及自填 `x-oss-meta-sha256` 仍不能证明正文。

CI 逐对象 HEAD，核对实际大小、封口 GET 响应里的 `x-oss-hash-crc64ecma`，旧回执无 CRC64 时比对其 ETag，同时保留 MIME、CORS、identity 编码检查。CRC64 存在时不能靠相同 ETag 放过 CRC64 差异。任一项不符或 HEAD 不可用，才完整 GET，并重新核正文 SHA-256；MP4 仍核 Range。HEAD 与 ETag 的职责是确认已证明正文的对象没有改变，正文证明仍来自上传封口，因此正常 CI 不需要再次下载整包。[OSS 的 HeadObject 定义](https://www.alibabacloud.com/help/zh/oss/developer-reference/headobject)支持不返回正文地读取大小与 CRC64。

全通过后上传入口自动调用 `seal-remote`：回执须绑定当前准备计划，再写入发布清单的 `oss.verification`。封口还在本机对完整包运行原公开内容门，包含全部 JS、每种扩展的凭据检查、仓库引用和资源闭包；结果与公开仓库清单绑定到发布身份，写入 `oss.content_verification`，失败不产生通过结果。GitHub 清单的发布身份同时绑定源版本、选定 origin、版本前缀、GitHub 文件及完整 OSS 对象指纹；历史 `baseline_files` 只作来源证据。旧清单没有本机内容门回执时，必须先用完整本地包补做扫描，不能把 HEAD 当成内容扫描。`hybrid-release.py` 校验当前 GitHub 文件、全部路由及已绑定的 OSS 证明，原未迁移发布仍走既有分支。

CI 继续扫描所有源码和 HTML；OSS 正文内容检查复用上述同版完整本机扫描结果，不下载正文或制造 JS 占位。新增本机扫描后，第二道 `verify-public-content.mjs` 也复用同一结果，避免第一道已通过后又整包重下；源码与 GitHub 文件的原检查保留。

`verify-oss-browser-network.py` 默认让所有路由共用同一个独立 Chrome 缓存；Chrome 已明确命中缓存且同一对象此前取得正文 SHA 时复用该证据，真实新响应和媒体 Range 仍核对正文。候选 HTML 使用 CDP 只拦导航文档，避免 Playwright 路由拦截关闭资源缓存；OSS 和状态服务仍走真实网络。脚本不在 CDP 已取得正文后另做原生完整 GET。`--retry-failed <原回执>` 校验原回执与本版清单绑定，只访问失败或缺失路由，保留通过路由的完整证据并输出完整路由清单；`--cold-cache` 单独保留逐页冷缓存全量检查，不在常规发布使用。下载量记录在浏览器回执 `oss_download_bytes`，仅计本次新跑路由的 OSS 网络响应。

本地发布校验、远端封口核验和浏览器检查开始前打印“本次预计下载约 X GB”；超过 5GB 时先停止，由主持确认后才通过 `--confirm-download-over-5gb` 明确继续。HEAD 门的预估按全部对象需要异常完整 GET 的保守上界计算；冷缓存逐页检查也使用保守上界，不将零正文 HEAD 冒充整包新证明。

远端全通过之后，发布负责人还须完成真实浏览器验收：首页及旧下层导航、搜索、模块跨源加载、LocalOCR 冷缓存整页 1–2 秒目标、视频开播与拖动、HTTP 状态、热区/动效及实时转屏。完整 GET 能证明文件与传输契约，不能单独证明浏览器性能或体验达标。最后才发布 `github/`，不能把本地准备成功当作可上线。既有发布/回读脚本中依赖全资源留在 GitHub 的检查需由负责人兼容 OSS 清单后调用。

## 回滚与本地演练

回滚恢复前一版 HTML 和控制文件。所有仍被任意清单引用的对象都保留，跨版本复用对象也遵守这一条；将来清理只能删除没有任何保留清单引用的对象，本次不增加清理功能。首次迁移的旧 HTML 原引用 GitHub 资源，首次切换也须保留该旧完整包/提交作为恢复材料。

本地演练可传 `--test-loopback --asset-base-url http://127.0.0.1:<端口>`，无需生产桶/profile。此计划明确标为 `test_only`，发布入口拒绝上传，也拒绝把其核验当成生产证据。针对性测试通过真实本地 HTTP 服务验证正文指纹、CORS、MIME 和视频 Range；伪造的正确元数据搭配错误正文必须失败。

上传分组副本、演练和失败回执属于当前任务的接续材料。负责人完成发布/恢复验收后，按现有回收站工具回收本次生成目录，不永久删除旧 OSS 前缀。

## 后续排版批次的OSS发布

`Publish-Pages.ps1` 的 batch 可显式提供 `runtime_baseline=true` 及 `OssPreparation`、`OssQaPlan`、`OssVerification`、`OssReading`、`OssCold`。先验完整当前源码与已发布Git split的对应关系，再验排版源码、同代OSS分拆和实际浏览器证据。发布时重建全部源码，输入、HTML、媒体、geometry及产物身份必须与已审版一致；Git只放已验分拆结果，不把完整源码当GitHub成品。

2026-10-04 14:52 引导 `8c5b469a-9178-475c-92aa-b59dd6fa5292` 将 08:52 的有界重试裁定明确扩至 2e、2f 和以后各版：本机冷启动空响应和长耗时，每个资源最多重试一次后完整取到且字节一致即通过，不再等稳定 2 秒。`OssRetryProof` 保留首次原生失败、长耗时、实际一次补取及完整 body/大小/SHA/MIME/CORS；网站图片、CSS、动态脚本各一次的真实恢复仍单独验收。受控 HTTPS 取回和证据复用不冒充原生 2 秒通过，不改代理/网络设置。既有 2b/2c 回执继续按原 08:52 指令及其副机直连证据核对。

`verify-typeset-oss.py` 绑定源码与split库存、实际QA的完整页集合、实际阅读中的HTML/脚本响应SHA，以及原始冷加载和单次补取证明。预发布源码gate仍要真实Claude发布指令；不得制造。staged只允许manifest的回滚引用和已审页证据更新，HTML/资源字节必须保持。回滚使用发布时实际生产Git提交，旧OSS前缀保留；并发、普通push、Pages、全量线上回读和自动恢复沿用既有发布分支。
