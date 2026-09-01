# 十四项目 MAP 设计与产品验收

## 本轮范围

本轮只建设第 14 项“工作交付副驾驶（work-delivery）”，没有开始 daily-preferences 或其他项目。新增项目使用 `real_dashboard`，公开路由为 `/projects/work-delivery`，模块固定为产品真实边界决定的 5 个：交付包与来源、证据与质量门、同版多种交付物、来源变化与下一版、状态/价值与恢复。

实现继续使用既有 React、Vite、构建时完整路由、原生目录导航、紧凑搜索、gallery/lightbox（图片画廊/大图查看器）和 lazy image（延迟图片）能力；没有新增服务、数据库、专用 viewer（查看器）、CSS 系统、正文 fetch（点击取正文）、dynamic import（动态导入）、spinner（转圈）或 skeleton（骨架屏）。

## 权威来源

- `work-delivery-copilot`：PRIVATE `main=73f92f1e57869628380e72aad14ceec8e0400c7d`，现场 admission 为 clean、in_sync；0.2.0 行为实现闭合于 `c815ea3daa04d4012200419fa989a9808ab7be36`，后续 docs-only 提交只记录当前实现盲自然路由 E2E。
- `work-delivery` Skill：`.agents` PRIVATE `main=6a9e1b0704cd86c4674ddc4521a3aae04cb6356f`，`skills/work-delivery/SKILL.md` 为 5,178 bytes，SHA-256 `e39ed36db7a3c753bca217d31a0ab3f0c20a3ae5dbf6508f3693b78126ba90fb`。Skill 只发现、判断和进入项目，不复制业务逻辑或状态。
- E 规则：活动版本保持 E98；`.agents` source 已进入下一候选提交，网页把 source 与 active release 分层，不让新 Skill 提交冒充活动 E 规则。
- 图片：只使用来源 Owner 指定的三张完全虚构合成输出；可视内容、build/fact ID 和 manifest 语义已经逐张核对，无需重渲染。

## 产品真实性

当前正式输出严格只有：

- `PRD.md`
- `manifest.json`
- `traceability.csv`
- `产品需求文档.docx`
- `项目评审.pptx`
- `执行跟踪表.xlsx`

页面与 Skill 已删除旧的“项目计划、周报、汇报”成品承诺。0.2.0 的 SQLite canonical build/manifest、手写 ready 拒绝、typed money/date/datetime、CSV 行列、append-only review reason、唯一原文 rebound、stale、同目录六文件不可覆盖、统一 CLI、隔离 wheel、37 项测试、Ruff 和两套合成 Office E2E 均进入技术层。

缺口同样公开：review event 没有 actor；影响只到事实与整个 build；可靠输入仍以本地文本/Markdown/CSV 为主；AI 分析在项目外；总体时间为 `baseline_required`；没有第一项真实工作、第一次真实来源变化、交付包导出、SQLite 备份、数据库丢失恢复或跨机器迁移。

## 当前实现盲自然路由 E2E

fresh Sol Max 未获 Skill、工具、Provider、内部路径或预期路线提示，只收到三份明确资料、持续更新目标和“本轮只要 DOCX”的自然请求。它自主选择 `work-delivery → work-delivery-copilot`，只读 3/3 指定来源，建立唯一 package，确认 27 条事实、39 条追溯并识别 5 条待确认，其中 4 条阻断正式交付。

最终 quality 保持 draft，只生成 `PRD.md`、`manifest.json`、`traceability.csv`；Office builder 为 0，没有 DOCX/PPTX/XLSX/PDF/PNG。current build verify 通过，旧 build 自动 stale。可见墙钟约 12 分 12 秒，成功 batch 核心约 0.043 秒；只证明 route_selected_without_hint、来源范围和质量门，不证明真实工作提速或正式 Office E2E。

## 三张图片的证据边界

| 图片 | SHA-256 | 能证明 | 不能证明 |
| --- | --- | --- | --- |
| `fictional-prd-page.png` | `69c333fcf8c34037e51438800ceed968228d94878bf16523b4c5b2c38cb2a4da` | DOCX 构建器能把确认事实、修订号和证据定位组织成可读代表页 | AI 对真实工作理解、整份 PRD 专业质量、全部页面或真实项目完成 |
| `fictional-review-slide.png` | `d02c74e85870aab2c2061859d79009c5ca43dcef51fc98cd4ec973a6a35fd420` | PPTX 构建器能读取同一规范清单的关键事实、类型和确认状态 | 真实评审发生、全部幻灯片无问题、组织批准或可以上线 |
| `fictional-execution-tracker.png` | `0c8133cc06e695a496b6f57bc22c5d821ecb242bf0695a1e529f71419cd99b5e` | XLSX 构建器能把同一事实修订投影成执行跟踪表并保留 fact ID | 负责人接受任务、状态自动更新、外部系统连接或真实团队采用 |

三张图没有创建重复 thumbnail（缩略图）；卡片直接 lazy-load（延迟加载）原图，点击后复用同一个 lightbox。

## 接线与合同

- Registry：第 14 项、`real_dashboard`、PRIVATE source、5 个模块、3 类 impact source 和真实工作/真实变化条件采集器；不公开 `local_root`。
- Projects：14 张真实项目卡，第 14 张直接暴露总览和 5 个模块。
- System：完整详情页计数 14；既有 `work-delivery-copilot` 资产和组成节点原位直达项目，并保留一个 Skill 入口。
- Skill：当前 5,178-byte / SHA-256 证据、6 个精确输出、当前盲测、真实缺口和项目 ownership 关系已更新。
- Search/SEO：项目总览、5 模块、Skill、System、搜索分片、canonical、Open Graph、sitemap 与原生 trailing slash 路由由现有生成链统一产生。
- Snapshot：`.agents` source 现场更新为 `6a9e1b0`，活动 E98 仍绑定 `e1c1e36`；两层不互相冒充。

## 本地验收

- 静态输出：139 个完整页面、255 条紧凑搜索记录。
- 共享增强 JS：10.13 KiB gzip，低于 12 KiB review line。
- 共享 CSS：20.95 KiB gzip，低于 21 KiB review line。
- 站点合同：73/73 pass。
- 源项目：37/37 tests pass；Ruff pass；隔离 wheel 与两套合成 Office E2E pass。
- 浏览器：桌面 1440×1000 的 Projects、Overview、两个代表模块、Skill、System 均为 200、无 overflow、无控制台错误；移动 390×844 的 Overview、Product 和来源变化模块无 overflow。
- 交互：三张 lazy image、点击打开、ArrowLeft/ArrowRight、Escape、focus 约束和三阅读层切换通过；重复 Skill 链接已收敛为一个。

## 独立终审

- product：初审发现 2 个 P0、2 个 P1。已补齐简体中文/Asia/Shanghai/YYYY-MM-DD/CNY/中国企业角色/完整 PRD 结构与 WPS/Office 默认值，补齐三类用户动作、首轮 1.25 倍、变更轮 0.75 倍、累计人工时间和停止/收窄门；`update-source` 改为有效 `--file`；每次 artifacts 与合成验收的重导入/几何/公式/视觉检查已分开。复审 P0=0、P1=0、P2=0。
- technical：初审 P0=0、P1=0，发现 snapshot 测试未纳入第 14 项的 P2；补齐后两条投影测试通过，复审 P0=0、P1=0、P2=0。
- reader：总览、5 模块、Skill、System 与自然搜索回读 PASS，P0/P1/P2 均为 0。
- UI-bloat：桌面/移动端、三图 lightbox、键盘/焦点、单一 Skill 链接和反膨胀复核 PASS，P0/P1/P2 均为 0。

## 发布状态

最终修复后的本地产品/技术验收为 PASS：浏览器复验 PASS，`npm run build` 的 snapshot、139 路由和 PUBLIC gate PASS，73/73 测试 PASS，四路终审 P0/P1/P2 均为 0。

Git commit、远端 `main`、Pages run 和公网内容是发布时的动态事实，必须从 GitHub 与线上站点现场回读；本文件不预写尚未发生的 commit/run，也不替代最终发布回读。只有任务收口同时确认本地 HEAD、远端 `main`、Pages deployment commit 和公网 System/Projects/总览/5 模块/Skill/Search/3 图一致，才能对外报告 PUBLIC 完成。
