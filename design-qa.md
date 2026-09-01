# 十一项目 MAP 设计与产品验收

状态：`wechatdirect_candidate_repaired_waiting_clean_recheck`

观察时间：2026-09-01

## 当前范围

Registry 当前启用 11 项：`.agents`、PCConfig、GitHub 总索引、ChineseASR、
TimeAudit、PC Panel Hub、CACB、用 AI 把一件事学明白、Codex Remote、
个人健康证据与安全决策、WeChatDirect。

本轮只建设第 11 项 WeChatDirect，并把它接入已有 System、项目目录、搜索和
`wechat-direct` Skill。没有预建 personal-materials 或任何后续项目页面。

## 唯一验收标准

一个不了解 WeChatDirect 的人看完页面后，能够准确说明它为什么存在、解决什么、
怎样使用、得到什么；页面不遗漏会改变使用判断的重要能力，不以技术名词遮住产品
价值，所有事实都能回到当前 source 验证，桌面和手机完整流畅。

## Source-first 产品结论

- PUBLIC source：`wlyaaaaa/WeChatDirect`，当前本地与远端
  `main=488353629098f24535784c1663159d7570ae96f1`，工作树干净。
- 当前包版本 `0.1.0`；主 CLI 为 Windows + Python 3.14，语音派生使用独立
  Python 3.11 + `pilk`。
- 8 个公开命令：`context`、`sync-contact`、`moments`、
  `sync-moments`、`media-open`、`preserve`、`doctor`、
  `verify-export`。
- 当前 fresh 回归为 50 项测试 + 2 个子测试；ruff 通过。无正文 Doctor 当前为
  success：2 个账号槽位所需配置/状态文件、加密/压缩依赖和语音解码器均 available。
- 页面没有读取真实聊天、朋友圈、联系人、群、媒体、配置、archive 或凭据，也没有
  运行具名聊天 E2E。
- “自动增量”准确写成：用户再次显式运行同一具名归档命令时，程序自动选择无变化、
  单来源排序游标或多来源时间重叠；没有 watcher、计划任务或全账号后台同步。
- 图片、视频、表情和文件当前保留与原消息的资源关系和不可打开缺口；真正可打开和
  复制原始字节的公开路径主要是唯一 `VoiceInfo` 语音。SILK 原件与 WAV 派生通过
  SHA-256 关系区分，转写另交 ChineseASR。
- 完成态档案可以增量重放或显式 `--full-reconcile`；首次硬崩溃无
  `state.json` 半成品、陈旧 `.sync.lock`、自动 repair 和恢复回微信仍未实现。
  `verify-export` 只验真不修复。

## 同轮自动修复

WeChatDirect source 原 README 曾把“媒体资源关系”写得像所有图片/视频/文件都能
打开，也没有把完成态重放与崩溃断点续跑分开。本轮已通过真实 source Owner 修复并
发布：

- README 与 CLI 帮助现在明确 VoiceInfo-only 字节打开、非语音媒体关系/缺口、
  完成态增量、首次硬崩溃半成品、陈旧锁、verify-only 和无 restore/import。
- `sync-contact` 的 no-change 快速路径不再只看来源指纹、文件存在和数量；
  返回成功前会重验 manifest 自身哈希、manifest/state 绑定，以及
  `context.md`、`ai-context.md`、`messages.jsonl` 的哈希、大小和记录数。
- 任何不一致都精确失败并保留原文件，不静默覆盖未知内容。
- source 回归由 48 + 2 增至 50 + 2；新测试覆盖 manifest、自哈希、三份档案漂移、
  大小、数量和 state 绑定。

## 最终审计修复回合

- Reader/UI P1：390/320px 的第 11 张项目卡中，WeChatDirect 长标题被右上 GitHub
  徽标覆盖。现以通用 `<=420px` 规则为所有项目卡徽标保留独立首行；390/320
  复测的交叠高度均为 0，未增加项目专用 CSS。
- Reader/UI P1：System 资产卡把所有项目 reference 硬编码显示成“进入规则”。现改为
  渲染每条关系自己的 label；WeChatDirect 可见文字“语音转写交给 ChineseASR”与
  `/projects/chinese-asr/task-routing/` 完全一致，`.agents` 规则入口仍显示自己的 label。
- Reader/UI P2：项目快照测试标题声称 11 项但只遍历 10 项。现已导入
  `wechatDirectProject` 并让两条单一快照投影测试真实遍历 11 项。
- Reader/UI P2：产品层提前使用 WAL、RAG 等缩写。现把产品流程改回“数据库写入
  日志”“检索增强生成系统”等人话；命令、schema 和内部名继续留在技术层。
- Technical P2：两类导出共享文件的文案曾让人误以为朋友圈也写媒体字节。现明确
  只有联系人导出另写当前可打开的 VoiceInfo 语音，朋友圈只保留关系与缺口。
- Technical P2：技术入口漏列 `sync-moments`。现补齐真实第八命令，并把
  `--full-reconcile` 与 pytest 分别标成补充模式和开发回归，不冒充独立产品命令。
- Bloat/Public P2：System source pack 标为 E97/E98 时仍残留 E95 current 文案。现
  统一到活动 E98 `e1c1e36`、previous E97；E98 的发布后看板实质漂移规则同时进入
  `.agents`、Rules、Registry semantic revision 11、System source pack 与测试。

## 页面信息架构

页面沿用同一个通用项目外壳和三层阅读顺序，不新增 WeChat 专属 React 组件、CSS、
图片依赖或客户端状态机。

- 速览：产品定义、当前快照、最重要边界、普通请求、结果与三态。
- 产品：六步工作流、10 条产品原则、职责/不负责和覆盖全部模块的真实用法。
- 技术：当前版本、Doctor、组件、证据、命令、演进和六个项目自有模块。
- 六模块：聊天上下文、具名增量归档、回复与媒体、朋友圈缓存、账号与只读源、
  保全与验真。
- v1 不设画廊。source 没有公开安全图片资产，仿微信聊天截图会误导产品身份；
  方法画布与结构化正文已提供必要可视化。

## 整站接入

- Registry：`id=wechat-direct`、`order=11`、PUBLIC、`real_dashboard`、
  `route=/projects/wechat-direct`，未来实质 source 变化可触发增量快照。
- System：GitHub 项目总数仍为 49；完整详情页由 10 增至 11。原
  WeChatDirect 资产入口已改到完整项目页，`wechat-history-ai-bridge` 继续保持
  独立接入桥身份。
- Projects：11 张真实项目卡，无占位卡；WeChatDirect 卡直接暴露总览和 6 个模块。
- Skills：`wechat-direct` 从“详情逐步收录”改为对应 WeChatDirect 项目，并保留
  ChineseASR 语音转写关系；测试事实同步更新为 50 + 2。
- Search：广义 “WeChatDirect” 进入总览；聊天、增量、语音关系、朋友圈账号、
  主副号隔离和保全验真分别进入对应模块。
- 静态路由：115 增至 122；每条路由构建时已含完整正文，无点击时正文 fetch、
  spinner、骨架屏或空白壳。

## 构建、测试与反膨胀

- `npm run build` 通过：E98 snapshot binding 通过，122 条完整静态路由，
  124 个 production HTML，PUBLIC gate 扫描 138 个 source 与 218 个 dist 文件，
  共 356 个文件，0 finding；新增两份搜索验证文件不改变渲染页面。
- `npm run test:built` 为 70/70。
- 共享 JavaScript 为 32.44 kB / gzip 9.86 KiB，低于 12 KiB 线；增量来自已合并的全站回顶反馈，不是 WeChatDirect 专用运行时。
- 共享 CSS 为 127.81 kB / gzip 20.42 KiB，低于 21 KiB 线；65 bytes 增量是修复所有窄屏长项目标题与徽标重叠的通用规则，WeChatDirect 没有新增专用 CSS。
- 全站紧凑搜索 gzip 48.60 KiB；64 项项目模块搜索 gzip 50.45 KiB，均低于
  64 KiB 线。
- 没有新增服务、数据库、API、worker、daemon、watcher、scheduler、动态 import、
  正文 fetch、画廊资产或运行时依赖。新增成本只有完整静态 HTML、Registry 数据与
  构建期搜索投影。

## 当前浏览器 QA

本轮使用本机 Chrome 对 Vite preview 完成真实交互验收；console error、
page error、request failure 均为 0。

- 1440×1000：Overview 首屏连续展示产品定义、公开仓库入口、六模块导航和当前项目
  快照；`scrollWidth=clientWidth=1440`，没有大片无意义空白或页面横向溢出。
- 390×844：Overview 与代表性“具名增量归档”模块均有
  `scrollWidth=clientWidth=390`；六模块导航在自己的横向轨道滚动，不撑宽正文。
- 移动端阅读层切换使用真实坐标点击与原生 `.click()` 复验：从 560px / 620px
  切到“产品”后滚动位置差值均为 0。Playwright 的高层 `page.click` 会先替测试
  滚动目标进视口，曾产生一次假跳顶；该结果没有作为产品缺陷。
- 代表性模块直接路由 200，包含 7 个失败/恢复状态、4 个 source 入口、完整
  full reconcile 与首次硬崩溃缺口；移动端没有溢出。
- `/projects/` 实际渲染 11 张卡；System 的“完整项目页”显示 11；
  System WeChatDirect 资产和 `/skills/wechat-direct/` 均可进入新项目页。
- 项目页没有 gallery，公开 GitHub 按钮在 390px 下仍为 156×36px 并保留完整文字。

## 当前缺口与下一门

- 当前 source 仍没有非语音媒体字节打开、群聊窗口外引用全覆盖、首次硬崩溃自动
  续跑、陈旧锁自动修复或恢复回微信；页面已把它们作为具名缺口。
- 当前真实具名微信 E2E 没有在网页任务中执行；源码、50 + 2 回归和无正文 Doctor
  不能替代私人对象现场结果。
- Candidate 尚未经过最终独立 Sol Max 四路审计，也尚未提交/发布网站。
- 通过最终审计、修复、main 收敛、Pages 和公网多视口回读后，才可把状态改为
  `eleven_project_wechatdirect_public_pass`。
