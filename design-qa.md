# 十三项目 MAP 设计与产品验收

## 本轮范围

本轮只建设第 13 项“文书和材料制作（document-materials）”，并把它接入项目目录、System、搜索和同名 Skill。没有预建 work-delivery-copilot 或 daily-preferences 页面。

公开产品只使用“文书和材料制作”以及合同、说明、申请、通知、回复、售后材料、附件包等中性表达。项目、Skill、System、搜索、SEO、图片说明和生成 HTML 均禁止重新暴露受限的私人领域身份、内部兼容包名、维护路径或真实个人载荷。

## 权威来源与自动修复

- Source：PRIVATE `wlyaaaaa/personal-formal-documents`，默认分支 `main`。
- 正式回读：本地 `main`、`origin/main` 与 GitHub 远端 `main` 均为 `3ab7fb45718a98bd8e0ae1e0dee14b5c31cf22bc`，工作树 clean。
- 当前产品版本：2.0.1。
- 聚焦回归：32 项全部通过。
- 全仓回归：526 项通过、6 项环境性跳过、101 个子测试通过；Ruff 通过。
- 本轮没有读取任何真实事项、原件、签名、正文、路径、回执、哈希或个人结果。

首次 source-first 取证发现并自动修复了会影响网页可信度的真实问题：

1. 输入只解析一次，实际用于生成的规范值被封存；参与方、收件方、渠道、日期、事实、请求和附件全部进入成品读回。
2. 四类通用正式材料都完成 build→verify 参数化回归；对外文书不再显示内部 role 或原始渠道 enum。
3. 2.0.1 wheel 携带唯一 Word exporter 资源，兼容构建共用同一实现，并以无窗口方式运行。
4. PDF 每页必须有可见页码；彩色渲染同时生成 L 模式灰度 artifact，并分别记录哈希与 ink/edge 审计。
5. v3 release 携带输入、DOCX/PDF、附件、三类审计、逐页彩色/灰度图和所需签名快照；缺文件、多文件、路径逃逸、大小或哈希变化都会失败。
6. v3 release 复制到空目录、删除原 build 后仍可独立 verify；2.0.0 的 v2 release 继续有限验证并明确 `legacy_v2_non_self_contained` limitations。

## 信息架构

Overview（总览）先说清入口、绕过规则、最终结果、现实状态与当前证据；技术细节不占据首屏。

1. `current-matter-sources`：当前事项、最小必要原件、事实、来源说明、未知与本人决定。
2. `editable-docx-pdf`：制作计划、同源 DOCX/PDF、附件、Word/fallback 和不可覆盖 build。
3. `page-audit-release`：正文读回、页码、彩色/灰度页面、自包含 v3 release、空目录复验和 v2 限制。
4. `signature-delivery-version`：本人签名或明确无需签名、produced/signed/ready_for_delivery 与 delivered=false。
5. `reality-readback-recovery`：delivered/received/handled、对方签回、现实回读、复制恢复和避免重复动作。

模块不按命令、Schema 或材料类别拆分；它们只围绕会改变用户判断的五段产品旅程。

## 可视化证据

- 画廊只有 1 张完全虚构的单页样张，不创建重复缩略图。
- 图片来自 2.0.1 当前生成器的真实 Microsoft Word → PDF → Poppler 流程。
- 样张与灰度页均完成 1/1 页审计；公开 PNG 为 110,278 bytes，低于 250 KiB。
- 它只证明当前生成器、版式、正文、页码和页面边缘真实工作过，不证明真实个人事项、全部材料类型、真实签名或外部递送。
- 受限模板不进入画廊，也不经裁切、改字或匿名化后冒充原貌。

## 整站接入

- Registry：第 13 项、`real_dashboard`、PRIVATE source、5 个模块和材料变化阈值；无公开 `local_root`。
- Projects：13 张真实项目卡，第 13 张直接暴露总览和 5 个模块。
- System：完整项目页计数 13；既有文书资产和组成节点原位直达新项目，同时保留 Skill 入口。
- Skills：从四层旧概述升级为 produced→signed→ready_for_delivery→delivered→received→handled，加独立对方签回；维护命令、内部定位和内部任务名不进入 HTML 或搜索。
- Search：总览、5 个模块、System 与 Skill 均使用有界语义投影；不把完整正文复制进共享 JavaScript。

## 构建、体积与回归

- `npm test`：72/72 通过。
- 静态输出：133 条完整页面路由、135 个生产 HTML、250 条紧凑搜索记录。
- PUBLIC gate：141 个 source + 232 个 dist 文件，共 373 个文件，0 finding。
- 共享增强 JS：10,103 bytes gzip（9.87 KiB），低于 12 KiB。
- 共享 CSS：20,910 bytes gzip（20.42 KiB），低于 21 KiB。
- 全站搜索：52,357 bytes gzip（51.13 KiB），低于 64 KiB。
- 全项目模块搜索：55,976 bytes gzip（54.66 KiB），低于 64 KiB；本项目 2,999 bytes gzip。
- 新项目没有专用 renderer、CSS、依赖、服务、数据库、后台状态、正文 fetch、动态 import、spinner 或骨架屏。

## 真实浏览器验收

- 视口：1440、768、390、320 CSS px。
- 项目目录、总览、代表模块、Skill 与 System 的文档 `scrollWidth === clientWidth`；没有页面级横向溢出。
- 移动端项目导航按实际模块数完整换行成两列，六个入口首屏全部可见；不再依赖隐藏滚动条或无提示横向滑动，直接进入模块时保持页面顶部。
- 标题、PRIVATE 入口卡、速览、画廊、三态、人话三格与长技术字段自然换行，没有大块无意义空白。
- 连续访问 Projects、总览、模块、Skill 和 System：0 console error、0 page exception、0 resource failure。
- 画廊在 Overview 可见；图片单击进入现有 lightbox，复用关闭、缩放和键盘控制。

## 公开边界

公开的是产品身份、流程、输出格式、版本、命令语义、文件结构、状态、失败、测试、PRIVATE main commit 和完全虚构样张。真实个人事项、原件、签名、正文、收件对象、地址、金额、路径、回执、哈希和结果全部未读取、未公开。

PRIVATE 不是删技术的理由：页面仍完整解释 request、DOCX/PDF、Word/fallback、逐页彩色/灰度、SHA-256、manifest digest、exact set、v2/v3、签名资产和状态边界。

## 仍然存在的真实缺口

- `facts[].source_note` 仍可选；整包输入固定不等于每条事实已逐一闭合来源。
- 自动化没有绑定 AI 或人工整篇语义审阅回执，不能证明事实主线、语气和请求事项已经完成最终审阅。
- 通用 CLI 只实现 produced/signed/ready_for_delivery；delivered/received/handled 与对方签回由当前事项和现实来源拥有。
- 签名是图片与 SHA-256 绑定，不是证书签名或可信时间戳；manifest digest 也不是数字签名。
- v3 可普通复制到空目录后复验，但没有自动备份、后台恢复或断点续传 mirror。
- 本轮只有完全虚构 E2E；真实个人材料、真实签名和外部递送 E2E 为 not_run。

## 四路终审

- Product Completeness：PASS；5 个模块最小充分，项目、Skill、System、Registry、搜索和画廊没有能力遗漏或产品过称。
- Technical Truth：PASS；最终 HTML、搜索分片、Skill 回执、签名边界和扩展禁词门均通过，P0/P1=0。
- First Reader：PASS；320/390 两列导航完整可见，每个独立表面的核心状态首现均有人话解释，P0/P1=0。
- UI / Bloat / Privacy：PASS；1440/900/768/390/320 无页面溢出、大片空白、控制台或资源错误，画廊交互与所有体积/隐私门通过，P0/P1/P2=0。

网站内容提交 `9e027e0348be7ba11b2c60b8b5376d5482f027e6` 已 fast-forward 到 PUBLIC `main` 并由远端回读；GitHub Pages run `33493830395` 的 build/deploy 均成功。公网 System、Projects、第 13 项总览、5 个模块、Skill、项目搜索分片与完全虚构样张已逐项回读：HTML 与最终构建在换行规范化后完全一致，搜索分片和 PNG 字节级一致。第 13 项的本地候选、发布效果与公网事实至此闭合。
