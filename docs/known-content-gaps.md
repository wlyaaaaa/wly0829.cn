# 网站内容遗留

以下是已查实、尚未修改页面的内容差异。2026 年 11 月 6 日本人明确要求本次只登记这两页，不改页、不发布，也不做整站构建；登记本身不触发更新任务。

## ChineseASR 云密钥说明

状态：待后续明确要求刷新时处理。本次核对的网站源码基线为 `281b94b5`。

| 页面 | 已核对的作者输入与现有正文 | 遗留内容与处理依据 |
|---|---|---|
| `chinese-asr` | `sources/pages/chinese-asr/page.json:127`、`:1125`；`site-astro/src/content/pages/chinese-asr.md:2247` | 仍写“key 由密码中心直接送出去，这里只准备请求”。当前 ChineseASR 正常运行会在自身进程读取共享本地加密副本并直接请求阿里云；遇到明确的凭据失效时才尝试新候选，实际请求验证通过后覆盖旧副本，手动供给另走现有导入/同步入口。以后刷新时应同步核对概览、数据流和当前状态说明，保留 9 月 28 日旧做法作为有日期的历史事实。 |
| `chinese-asr-runtime-privacy` | `sources/pages/chinese-asr-runtime-privacy/page.json:146`、`:158`；`site-astro/src/content/pages/chinese-asr-runtime-privacy.md:679`、`:909`、`:973` | 仍写“项目只准备请求，由密码中心送出”“密钥不经过 ASR 进程”，并沿用旧 SecretRef 发送解释。后续应按 ChineseASR 与 PCConfig 现行源码说明本地副本、进程内持钥直发、先验证后替换和密钥不进入命令行/日志的边界；共享资料期查询仍由 AuthorityHost 提供，应与取钥、请求传输分开描述。 |

依据只取 ChineseASR 当前 `AGENTS.md`、README 云入口、`src/zh_asr/qwen_transport.py`，以及 PCConfig 的 `tools/vendor_key_copy.py` / `tools/Sync-VendorKeyCopy.ps1`。本清单不包含密钥值、录音、转写正文或云请求。

本次没有修改上述作者输入、原生 Markdown、布局或成品，没有构建、上传或发布；页面仍是原来已发布的快照，不能把本登记算作两页已经更新。
