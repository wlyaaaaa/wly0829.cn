# 源包准备与独立排版检查

当前维护从仓库根 `npm run build` 开始，发布只用本机 `site-astro/tools/publish_site.py`。本页保留源包、量测、阅读和迁移的技术契约，方便核对现成输入与恢复材料；它不是另一条构建或发布流程。日常命令见 [网站维护](maintenance.md)，差量传送与回执见 [发布与扫描](publish-and-scan.md)。

## 页面源与完整包

| 材料 | 当前用途 |
|---|---|
| `sources/pages/<id>/page.json`、相邻 `layout.json` | 正文和构图源，构图的文字引用须对应原文；转换方式见 Astro 说明 |
| `site-astro/src/content/pages/` | Astro 读取的 Markdown 内容，须与所属源一致 |
| `site-astro/sources/retained-home-cockpit/` | 已选首页与驾驶舱的保留 HTML、入口和依赖身份；首页不重新排版或自动检查 |
| `dist/`、`release-manifest.json`、`.build-receipt.json` | 本代静态成品、文件身份与构建计时/变化页；缺回执时扫描与发布分别按实际文件哈希判断 |
| `scripts/snapshot-typeset-inputs.py` | 保存既有排版输入及资源映射，供有明确需要的迁移和独立量测使用，不是发布入口 |

完整源包须包含需要的资源字节。只有 HTML 与外置 OSS 地址的部署包不能冒充完整媒体源；源图、视频、遮罩、封面和截图不因迁移而重画或重编码。未选择的旧路由及其资源不能因为本批只改几页而丢失。

## 仍在使用的准备库

`prepare-astro-release.py` 仍依赖 `hybrid-release.py` 的 `assemble`、`verify_release`、库存、路由与资源引用解析，将 Astro 新页与准确基线的保留页组合，并核对原文、导航、源输入和准备回执。它的规则 refresh、源包 prepare 与 verify 能力保持；CI 不调用它们，也不把其旧完整远端核验选项当作新差量发布的步骤。

`hybrid-release.py` 保留 `baseline_entries` 对 HTTP 快照 URL 键与相对文件路径的解析，保留导航映射、原文件字节核对及继承资源读取。`inherited_assets` 使用准确 `baseline_production_commit` 中的历史 `site-release/release-manifest.json`；不能因为部署改到根目录成品分支，就删掉仍用于准备旧基线的迁移解析。其旧 Git 成品提取回退命令已撤掉；当前回退使用同一 Pages 工作流的 `ref`。

`prepare-oss-release.py` 负责将完整源包分为 GitHub 文档与 OSS 资源，保留相同对象地址和真实旧回执，确定性重放地址改写并核对文件身份。清单、控制文件、地址和失败边界见 [OSS 资源契约](oss-publication.md)。这些库保留源码与历史解析用途，不向 `main` 推送成品。

## 几何与输入绑定

独立几何检查继续由 `run-typeset-checks.py --mode geometry` 提供，需要现成预览的 `/__typeset/measure` 接口和明确的非首页页名。它不负责创建成品。已有 `/__typeset/qa` 的预览也可使用脚本原有 QA 能力；该能力不成为 CI 发布门，动效与开场仍由本人判断。

```powershell
python -B -X utf8 scripts/run-typeset-checks.py --mode geometry `
  --url <已有本机预览地址> --task-cache <任务缓存目录> --pages <非首页页名>
```

已有排版量测使用 `wly.typeset-geometry.v1`、`geometry_version: 2`。量测的页、屏、方向和顺序须覆盖被检查内容；生产 HTML 路径与 SHA-256、PNG 分片尺寸及 SHA-256 必须对应实际输入。每条 `issues`、`broken_images` 都保留，顶层 complete 不能代替逐页覆盖。记录字体、视口、源文件和几何路径/指纹，不能把另一版量测套到当前页面。

已有 `wly.typeset-build.v1` 报告中的 `pages`、输出 `files`、`baseline_root`、`baseline_index_sha256`、`built_at_beijing`、`geometry_path`、`geometry_sha256` 和每页 `url`、输入/HTML 指纹仍是迁移证据。它与新构建回执是不同材料；不存在的字段和未做的检查保持 Unknown，不能靠补标签变成已验证。

## 独立阅读检查

阅读入口只检查已有成品，不修改运行件、HTML 或 manifest；临时预览仅提供现成文件和不可用状态提示。`check-typeset-site.py` 适配器接受 `--dist`、已有 `--build-report`、`--out` 和可选 `--cache`，把其余阅读选项交给 `check-typeset-reading.py`。输出与缓存必须在 `dist` 外。首页 `/`、`/index.html` 及 home/homepage/index 别名在启动浏览器前排除，不能靠显式选页重新加入。

原阅读检查保留以下证据：

- `.screen` 中的阅读位置和实际语义节点，屏幕缩放前后的位置差；允许的边界为两像素，保留测得误差，不把不同卡片当成同一位置。
- 横竖变化、宽度断点和连续快速改变尺寸；回到顶部、目录点击、带锚点刷新与浏览器历史返回。
- 实际文档/脚本响应状态及 SHA-256，manifest、HTML 和本地脚本在检查前后不变。
- 本机独立 Chrome 配置、实际失败、响应缺失、清理结果和带北京时间的回执。

运行件没有所需阅读状态，或页面没有可量测屏、响应与成品不一致时，就记录真实失败，不生成替代运行件。`--navigation-only`、`--desktop-height`、Chrome 路径，以及已有封闭候选来源下的单次静态补取选项仍保留；受控补取不能冒充原生冷网络或速度达标。

## 保留的迁移材料

`src/typeset/render_page.py` 及 `src/typeset/` 中的引擎、注册组件、样式和资产属于旧页面源与迁移工具。独立任务需要它们时使用实际输入，不将它们接成自动备用构建链。

屏清单工具 `scripts/inventory.py` 默认输出 `.publish/inventory/`，可用 `TYPESET_INVENTORY_OUT` 指定任务目录。`sources/screens.jsonl` 保留原始迁移清单；迁移记录的原始 740 行与当时重生成 736 行、路径和图片库存差异保持原有证据身份，不是本次重新统计。解析该清单时重绑定相邻 `page.json`，不改写原件冒充同字节重生。

资产引擎默认读取 `sources/assets/`，独立迁移可显式指定已核实的 `TYPESET_ASSET_ROOT`。2f 撤图修复由同版 `engine/render.py`、`components/comp-slots/shots.py` 和 AI CLI 页的构图/正文承接。A1 交接目录的 `not-moved.json` 保留未迁原型、demo、缓存、样片驱动和历史审查文件的路径、字节与原因，退役前核对实际用途。

系统字体仍按原 file URL 引用，不复制字体。下列版本和字节身份观察于北京时间 2026-10-06，没有作为本次机器状态重测：

| 系统字体 | 版本 | 字节 | SHA-256 |
|---|---|---:|---|
| `C:\Windows\Fonts\NotoSansSC-VF.ttf` | Version 2.04;241114210130;non-release | 17773244 | `763146584cf0710223441356b4395e279021b0806c196614377a7a0174ae074a` |
| `C:\Windows\Fonts\STXINGKA.TTF` | Version 1.02 | 4016288 | `7f901dfb0526d542740264fb5ba8dfe483293ad060270d273593e2f04a69d080` |
| `C:\Windows\Fonts\FZSTK.TTF` | Version 1.00 | 7574196 | `0b5a903376fe4d97306c943b690b04a5080889b4f87f8d704962939d3ceef1c4` |

当前源包库、单次独立检查与历史迁移证据各自核对；保存这些材料不表示旧批处理、旧推送或自动回退流程仍可用。当前成品回退和实际公网确认见 [网站维护](maintenance.md)。
