# 十二项目 MAP 设计与产品验收

## 本轮范围

本轮只建设第 12 项“个人材料查找（personal-materials）”，并把它接入已有项目目录、System、搜索和 `personal-materials` Skill。没有预建 personal-formal-documents 或更后的项目页面。

统一验收标准没有改变：不了解项目的人看完后，能准确说明它为什么存在、什么时候不该用、怎样从一句普通描述回到真正原件、最后得到什么，以及找不到、文件变化或入口不可用时怎样恢复；产品思想和人话先于技术名词，技术事实仍完整可核验。

## 权威来源与自动修复

- Source：PRIVATE（私有）`wlyaaaaa/personal-materials`，默认分支 `main`。
- 正式回读：本地 `main`、`origin/main` 与 GitHub 远端 `main` 均为 `08a3b0df5e999615c127e401e84b35b04a8752cb`，工作树 clean（干净）。
- 合成回归：37 项全部通过，根任务实测 33.30 秒；Ruff 静态检查通过。
- 本轮没有打开真实 `materials.sqlite3`、来源根、候选、token、路径、哈希、正文或原件，也没有运行真实自然请求 E2E（端到端验收）。

首次全量取证发现并自动修复了源项目的真实问题：

1. handoff 接入改为在同一文件句柄上完成 `stat → SHA-256 → stat`，并保持到数据库提交前再次核对。
2. 禁止 `material_key` 与 `source/native_id` 双向静默重绑；内容变化时先清理旧 `material_text`。
3. `filesystem-directory` 根必须为绝对路径；`init` 核对完整四表列合同与 SQLite integrity（完整性）。
4. 有界发现改为受预算约束的增量目录枚举；目录/条目读取失败进入明确 gap，候选消失不再拖垮整次发现。
5. 同路径新内容刷新版本字段并清理旧派生文字；`open` 与 `open-discovered` 在启动前再次复验。
6. 查找第二阶段改名为 `unverified_source_evidence`，准确表达它可由来源/材料元数据、`search_text` 或绑定文字命中，不再把无 `material_text` 的候选冒充“只靠派生文字”。

## 信息架构

页面复用现有 Project/Module 静态壳层，没有新增专用组件、CSS、客户端依赖或运行时。

- Overview（总览）：可靠定位直接绕过；非媒体才进入；位置未知时才发现；选中后才读字节；零命中只说明本轮范围。
- `registered-lookup`：已登记查找、版本/重复/原生关系、三阶段证据强度和路径隐藏。
- `bounded-discovery`：最多 8 个来源、2500 个文件、每源 12 层、总计 8 秒；选择前不读正文、不算哈希、不跟随链接。
- `verified-open`：来源根、相对路径、stat、SHA-256、稳定身份、事务回滚、版本刷新和启动前复验。
- `exact-intake`：`personal-materials.handoff.v1`、四表最小索引、稳定句柄、身份防重绑、文字失效、媒体拒绝、`init/status` 边界。

项目没有公开安全的真实视觉输出：CLI 截图会带出私人候选，文件管理器假界面又不是真产品。因此本页没有 gallery（画廊），这是事实边界，不是遗漏。

## 整站接入

- Registry：第 12 项、`real_dashboard`、PRIVATE source、首次完整快照，后续只按实质变化增量维护。
- Projects：项目目录现在有 12 张真实卡，第 12 张直接暴露总览与 4 个模块。
- System：完整项目页计数 12；项目资产和“位置未知时的非媒体原件查找”组成节点均直达新项目，并同时保留 Skill 入口。
- Skills：修正旧的“9 项测试”“候选直接给路径”“发现阶段核对 hash/content”等陈旧说法；项目与 Skill 双向可达。
- Search：总览、4 个模块、System 入口与项目作用域搜索均使用有界语义投影；没有把完整正文复制进共享 JavaScript。

## 构建、体积与回归

- `npm test`：71/71 通过。
- 静态输出：127 条完整页面路由、129 个生产 HTML、245 条紧凑搜索记录。
- PUBLIC gate（公开内容门）：139 个 source + 224 个 dist 文件，共 363 个文件，0 finding（发现项）。
- 共享增强 JS：10,100 bytes gzip（9.86 KiB），低于 12 KiB 审查线。
- 共享 CSS：20,907 bytes gzip（20.42 KiB），低于 21 KiB 审查线。
- 全站搜索：51,047 bytes gzip（49.85 KiB），低于 64 KiB 审查线。
- 全项目模块搜索：53,737 bytes gzip（52.48 KiB），低于 64 KiB 审查线。
- 正文仍在各自静态 HTML；没有点击后 `fetch`、动态正文 import、spinner、骨架屏或空白占位。

## 真实浏览器验收

- 视口：1440、768、390、320 CSS px。
- 项目目录、总览、代表模块、Skill 与 System 的文档 `scrollWidth === clientWidth`；没有页面级水平溢出。
- 390/320 的模块导航只在自己的横向轨道内移动，不带动整页；直接进入模块时页面保持顶部。
- 项目标题、PRIVATE 入口卡、速览、三态、人话三格和模块正文按既有断点自然换行，没有大块无意义空白。
- 连续访问 Projects、总览、模块和 System：0 console error、0 page exception、0 resource failure。
- 本地静态预览的代表页面 TTFB 为 1.7–2.2 ms；该数字只证明本机静态链路，不冒充公网性能。

## 公开边界

公开的是项目身份、产品流程、命令、表结构、算法、数值上限、失败语义、PRIVATE main commit 与合成测试。未公开实际数据库、来源根、账号/设备、标题、候选、内部 ID、token、真实路径、文件哈希、关系边、绑定正文或原件。

PRIVATE 不是删减公开安全技术的理由；页面仍完整写出 SQLite、四表、匹配阶段、Base64 选择句柄、来源根承诺、文件签名、SHA-256、事务和所有当前失败边界。

## 仍然存在的真实缺口

- 本轮没有执行一次真实自然请求 → 候选 → 选择 → 打开原件 E2E；当前私人来源覆盖与默认应用现场保持 Unknown（未验证）。
- Windows `os.startfile` 只能接收路径，不能把已核验句柄交给目标应用；最后一次复验到应用真正读取之间仍有极小窗口。
- 外部文件系统与 SQLite 不能形成一个原子事务；提交前复核、启动前复核和以后每次 `open` 重验只能收窄窗口。
- 有界发现达到预算时，已检查子集可能随文件系统枚举顺序变化；零命中始终只代表本次检查范围。

## 四路终审

- Product Completeness：PASS，P0=0 / P1=0 / P2=0。
- Technical Truth：PASS，P0=0 / P1=0 / P2=0；曾发现的未验证阶段语义偏差已修源、发布、回读并补回归。
- First Reader：PASS，P0=0 / P1=0 / P2=0。
- UI / Bloat / Privacy：PASS，P0=0 / P1=0 / P2=0；旧 `design-qa.md` 是唯一 P1，本文件已就地替换并完成只读回签。

网站候选此刻仍是本地 worktree，尚未提交、推送或完成 Pages 回读；上述 PASS 不冒充 PUBLIC 完成。
