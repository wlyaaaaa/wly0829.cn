# GitHub Pages 文档与 OSS 资源契约

本站将 HTML 与站点控制文件交给 GitHub Pages，把图片、视频、样式、脚本、字体和搜索资源放在上海 OSS。资源迁移保留内容及素材原字节，导航和实时状态 API 保持原目标。当前上传和成品推送只使用本机 `site-astro/tools/publish_site.py`；完整命令、计时和失败回执见 [发布与扫描](publish-and-scan.md)。本页说明仍在使用的准备库与历史证据解析，不另设上传、封口或回退入口。

## 目标与输入

正式资源目标为 `wly0829-img-media-shanghai`、`cn-shanghai`，默认 HTTPS 地址为 `https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com`。这是北京时间 2026-10-04 02:53 引导 `3ac11b33-8a56-4beb-9b60-a948f8fc75e6` 选定的目标；此前北京桶保留备用的迁移事实不授权改变本次目标。

本机发布器沿用 `E:\Tools\aliyun-cli\aliyun.exe` 和已有 `website-images` profile，不查看或复制凭据，不另登录，不改桶、Referer 或 CORS 设置。素材不因跨来源而重画、重编码或改分辨率。视频挂载、遮罩和封面需要它们自己的真实来源证据；准备器只改资源地址，不替产品选择新的媒体。

输入是完整当前源包。`release-manifest.json` 中的文件大小、SHA-256 和库存须对应实际文件，旧下层路由不能因只改部分页面而被裁掉。只有 HTML 和远端地址的 Pages 包不能冒充完整媒体源；上一清单仅提供同代、已有成功证据的对象地址和回执，不替代缺失源材料。

## 准备库输出

`prepare-oss-release.py finalize-dist` 是构建最后的离线步骤，完成地址改写和身份记录。扫描和发布只读取定稿后的同一份字节，发布器不再调用准备器。库内部的 `prepare` 使用新的临时输出目录，保留输入：

- `github/`：全部 HTML 与必要控制文件，HTML 只改资源引用；正文、普通导航、API、热区和转屏行为保留。
- `oss/`：非 HTML 内容资源，保留原相对路径及二进制字节。
- `oss-plan.json`：源包与输出身份、大小、版本对象键、引用闭包、逐字符 URL 改写记录、控制文件例外与汇总。本地准备状态不会冒充远端通过。
- `release-manifest.json`：`files` 对应 Pages 文件，`oss.objects` 对应 OSS 对象；已有批次、基线或回退字段保持它们原来的历史证据身份。

控制文件包括 `CNAME`、存在时的 `.nojekyll`、`robots.txt`、`sitemap.xml` 和发布清单，保留域名及抓取行为。当前 `site-dist` 成品另带最小 `.github/workflows/pages.yml`，使成品 push 能触发部署；该目录和 `.git` 不进入 Pages 上传包。

## 确定性地址改写

HTML 资源属性、srcset、内联 CSS 和 JSON 都按原页面地址解析；JSON 的 `avif_assets` 键和值同步改写。CSS 的根路径、相对 `url()` 和 `@import` 按 CSS 自身路径解析；JavaScript 模块 import、动态 import 和 Vite 预加载数组指向同代对象。普通导航和搜索记录的正文不因资源迁移而替换。

改写版本写入计划和清单，旧清单按其版本重放，缺版本号时按版本 1，不能用新逻辑冒充旧确定性产物。版本 2 起覆盖 `data-lazy-srcset` 与 `data-lazy-style`；当前离线定稿按每个资源的实际依赖内容生成地址，保留内容未变的旧地址。Vite 预加载数组和资源拼接前缀变更记入 URL 日志，不改其他业务分支。

本地核验重放同一改写并逐字节比较。输入漂移、未登记改动、二进制变化或缺失本地资源均报错。相同内容且地址不变的对象沿用原键、地址与真实回执；哈希相同但对象键变化也按本次变化处理，不能据哈希相同漏传新键。

## 当前传送与回读

显式提供的上一清单无效时直接失败；未提供时查实际成功部署的版本，不把仅本地 commit 或未部署成品当成上一成功发布。新发布器在本地独立成品仓库准备普通 `site-dist` 提交；源码分支不因发布而变动，也不把资源混进源码提交。

发布持既有 `wly0829-publication` 短锁，保留对象 pin，先上传变化资源，再传变化 HTML，最后更新清单。资源设置真实 MIME 和不可变长期缓存头；只对本次新传对象 HEAD 核大小及 ETag/Content-MD5，未变对象继承已核回执。再 GET 首页、驾驶舱、`/computer-access/` 与本次变化页，核 200 和 HTML 哈希。HEAD 是大小与对象内容摘要核对，不标作完整 GET 正文证明。

本次发布不做整库 GET、不运行 seal、不清理线上对象。回收能力仍在所属保留工具中，与发布分开；`rollback_keep` 等实际仍被 pin/collect 使用的留存能力保持。旧恢复专用封口登记和旧上传/回退 CLI 已退役。

CI 使用 Ubuntu，只部署成品，不运行源码构建、扫描、公开内容门或旧全包核验。`upload-pages-artifact@v5` 的官方 tar 代码始终排 `.git`、`.github`；当前设置 `include-hidden-files: true`，保留成品中其余隐藏文件，不使用不存在的 exclude 输入。实际定义见 [官方 action.yml](https://raw.githubusercontent.com/actions/upload-pages-artifact/v5/action.yml)。

## 旧回执与迁移解析

准备库继续解析旧完整 GET、HEAD/CRC64/MD5、混合复用以及同版本机内容核验回执。它们分别保留原 `release_id`、checker 身份、对象指纹与核验方法，不把旧全包封口写成新发布的必要步骤，也不把新 HEAD 改名为旧正文核验。

定稿器中的继承资源解析仍需准确历史提交中的 `site-release/release-manifest.json`；资源复制和继承逻辑仅存于 `prepare-oss-release.py`，hybrid 装配、全量验证、旧 Git 提取回退及其 CLI 已删。当前回退通过同一个 Pages workflow 的 `ref` 输入部署实际旧 `site-dist` SHA，具体未来命令见 [网站维护](maintenance.md)，没有备用源码重建链。

本地准备器保留 `--test-loopback` 的测试材料语义：loopback 计划明确为 `test_only`，不能作为生产传送。已有受控静态补取回执记录首次失败和一次实际补取、响应正文及 MIME/CORS，不能冒充原生冷网络或速度达标。记录这些迁移材料不表示本轮上传、Pages 部署或旧回退已执行。
