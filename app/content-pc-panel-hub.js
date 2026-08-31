export const pcPanelHubProject = {
  order: 6,
  slug: "pc-panel-hub",
  title: "PC Panel Hub",
  route: "/projects/pc-panel-hub",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "双副屏产品链在运行；HS2 浮层当前落点健康，动态壁纸于 2026-08-30 由本人确认生效",
  cardStatusTone: "pass",
  snapshotBoundary: "2026-08-31 主机发送链和 HS2 透明浮层落点有新鲜证据；动态壁纸像素/运动只保留 2026-08-30 本人确认，TURZX 实体像素、冻结恢复和睡眠唤醒仍需现场观察",
  repositoryNote: "源码位于 PUBLIC（公开）GitHub 仓库并使用 MIT 许可；仓库只发布项目源码、脚本、合同与公开示例，厂商二进制明确不属于该许可。端口、协议、硬件型号、进程名和状态等技术事实不按字段类别自动隐藏；只有具体值实际含私人正文、身份隐私或可复用凭据时才省略。",
  summary: "PC Panel Hub 把两块实体副屏组成一条不打扰主工作的桌面信息通道。竖直机箱屏一直显示我需要随时瞥一眼的硬件、流畅度、网络、磁盘和后台状态；曲面水冷屏平时保留动态壁纸，只有媒体、任务、手机事件或真正需要注意的告警出现时，才叠加有限数量的透明卡片。两块屏不重复，也不把监控窗口搬回主屏。",
  why: "主屏上的监控窗口会挡工作，也容易在问题发生前被关掉；实体副屏又可能出现“任务仍在运行、主机仍在写串口，但画面已经冻结”的假健康。这个项目把数据可信度、渲染、传输、实体观察和恢复分层，使我既能随时看见关键状态，也能知道哪一层真的被证明。",
  plainExample: "例如我在工作或游戏时，不需要把监控窗口留在主屏：机箱屏持续显示温度、负载、流畅度、网络和磁盘；来电、媒体或任务事件只在水冷屏上临时出现，结束后让动态壁纸继续成为主角。若机箱屏时钟不再跳动，系统只修受影响链路，最终仍以真实屏幕是否继续更新为准。",
  result: "我得到一块持续显示密集遥测的机箱屏、一块只在有意义事件出现时显示的透明 OLED 浮层，以及明确的启动、睡眠、关机、自愈和回退入口。页面同时告诉我：源码和主机合同通过了什么、当前运行链证明了什么、软件 demo（演示）展示了什么，以及哪些实体屏结论仍需现场观察。",
  readerStates: {
    pass: "源码、纯软件回归、运行依赖、唯一发送者和新鲜 heartbeat（心跳）分别通过时，主机侧链路可判为健康；若另有当次实体观察，才把对应屏幕画面记为实体 PASS。",
    problem: "节拍超时、发送失败、串口身份漂移、显示器绑定异常或浮层错屏时，只处理受影响组件，并保留当前模式、退避和回退证据。",
    unavailable: "设备、串口、L-Connect、本地指标或交互桌面不可用时，停止相应输出并标为 Unknown（未验证）；不抢串口、不重置 USB 树，也不把旧预览冒充当前画面。"
  },
  cardMetrics: [
    { label: "显示面", value: "2" },
    { label: "刷新", value: "1 Hz · failed 0" },
    { label: "回归", value: "84 + 8" }
  ],
  heroFacts: [
    { label: "两块显示面", value: "TURZX 480×1920 密集遥测；HS2 2288×1048 动态壁纸 + 透明事件浮层；覆盖 10 类信息、最多 6 张事件卡与 15 个纯软件 demo" },
    { label: "当前刷新选择", value: "安装态为 1 Hz Hybrid（混合）刷新：command 200 全帧基线 + command 204 有界增量；3 秒全帧仅作兼容回退" },
    { label: "数据与恢复节拍", value: "主周期 1000 ms；最近 fetch/render/send 59/10/35 ms；第 60/120/180 帧与每 900 帧重建会话或补全帧，进程排行约 3 秒" },
    { label: "运行快照", value: "2026-08-31T11:19:19Z runtime ready、missing=0；frame/sent=2748/2748、failed=0、period=1000 ms、full=2700；HS2 visible=1、misplaced=0；动态壁纸已经生效是 2026-08-30 本人确认" },
    { label: "源码与回归", value: "PUBLIC main=ebbc1f2ab28bcef7a9a205a346981f16a3d253dc；工作树干净且缓存远端 0/0；84 项指标、8 项天气及项目原生整套检查通过" },
    { label: "证据缺口", value: "本轮为保护正在运行的 COM7 跳过 TestVideoStream；command 204 没有设备 ACK，进程、heartbeat 和 demo 均不能代替实体像素观察" }
  ],
  productPrinciples: [
    { title: "两块屏承担不同工作", detail: "机箱屏负责持续状态，水冷屏负责低频事件；同一信息不在两块屏重复堆叠。" },
    { title: "先保证一眼可读，再显示更多", detail: "信息层级、字号、间距和状态含义优先于指标数量，副屏不能变成缩小版监控墙。" },
    { title: "有效空状态也要被设计", detail: "没有游戏帧、没有通知和没有告警都是真实状态，不制造零值、空卡或假异常。" },
    { title: "每个值带着来源和新鲜度到像素层", detail: "陈旧、估算和未知不能冒充当前实测；UI显示什么必须能追到采集与更新时间。" },
    { title: "实体像素才是最终验收", detail: "进程、日志、发送成功和心跳只能证明主机侧，不能替代对真实屏幕持续更新的观察。" },
    { title: "恢复必须精确而有界", detail: "同一设备只有一个写入者；冻结时只修本链路，不靠重启电脑或重置整棵 USB 树碰运气。" },
    { title: "动态壁纸与事件浮层互不绑架", detail: "浮层透明、低频且可退出；找不到精确副屏时绝不回退到主屏。" }
  ],
  gallery: [
    {
      src: "/media/pc-panel-hub/hs2-live-wallpaper-current.jpg",
      thumbnail: "/media/pc-panel-hub/thumbs/hs2-live-wallpaper-current.webp",
      alt: "2026年8月30日 HS2 显示缓冲区中的 Wallpaper Engine 动态壁纸与透明浮层",
      caption: "2026-08-30 的 2288×1048 显示缓冲区截图；本人当次确认同画面已在 HS2 实体屏生效，左上方透明浮层同时可见。它不是实体相机照片，也不是本轮当前像素回读。",
      evidenceLevel: "E2",
      evidenceLabel: "显示缓冲区截图 + 当次本人确认",
      proves: "证明 2026-08-30 当次动态壁纸曾在 2288×1048 HS2 实体屏生效，透明浮层叠在其上。",
      doesNotProve: "不是实体相机实拍，也不证明当前像素、动态运动、长期帧率、睡眠恢复或异常重启后的自动恢复。",
      observedAt: "2026-08-30T05:20:24Z",
      sourceCommit: "2717ecb4c37bd9e3a0e4a635384ee5a2458c8399"
    },
    {
      src: "/media/pc-panel-hub/turzx-live-frame-current.png",
      thumbnail: "/media/pc-panel-hub/thumbs/turzx-live-frame-current.webp",
      alt: "PC Panel Hub 480×1920 机箱副屏当前生产发送帧",
      caption: "2026-08-30 从当前生产发送循环取得的 480×1920 无损帧：frame 32986 已通过 command 204 差分路径写入 COM7，sent 32986、failed 0，PNG 比同帧 heartbeat（心跳）晚约 7.8 ms 落盘。公开版仅遮盖精确天气地点与前台应用名，其余像素来自同一实时帧；这不是设计稿或测试 fixture（固定演示数据）。",
      evidenceLevel: "E2",
      evidenceLabel: "当前生产发送帧",
      proves: "证明抓取时生产 Renderer 生成了这张逻辑 framebuffer（帧缓冲区），发送循环已把同一帧成功写入目标 USB 串口路径。",
      doesNotProve: "设备没有像素回读或摄像头，因此不证明物理面板逐像素 ACK，也不证明画面在抓取后持续刷新。",
      observedAt: "2026-08-30T06:58:41.2987948Z",
      sourceCommit: "2717ecb4c37bd9e3a0e4a635384ee5a2458c8399"
    },
    {
      src: "/media/pc-panel-hub/turzx-renderer-current.png",
      thumbnail: "/media/pc-panel-hub/thumbs/turzx-renderer-current.webp",
      alt: "PC Panel Hub 当前 Renderer 使用公开安全数据生成的 480×1920 确定性预览",
      caption: "当前 Renderer 代码使用公开安全 fixture（固定演示数据）直接生成的 480×1920 确定性输出：CPU、GPU、FPS、内存、网络、磁盘和进程层级都来自现役版式，不再使用旧 SVG 设计稿冒充实际渲染结果。",
      evidenceLevel: "E1",
      evidenceLabel: "当前渲染器确定性输出",
      proves: "证明当前 Renderer 能按现役代码和公开安全输入生成这套完整像素布局，并保留活跃 FPS 的字段语义。",
      doesNotProve: "输入数值是测试 fixture，不是当前机器读数；它也不证明 USB 串口发送、物理 TURZX 像素或长期运行。",
      observedAt: "2026-08-30T06:47:00Z",
      sourceCommit: "2717ecb4c37bd9e3a0e4a635384ee5a2458c8399"
    },
    {
      src: "/media/pc-panel-hub/hs2-max-six-demo.png",
      thumbnail: "/media/pc-panel-hub/thumbs/hs2-max-six-demo.webp",
      alt: "HS2 曲面 OLED 六卡满载软件演示",
      caption: "HS2 max-six 软件演示：媒体、游戏、系统音量和三条合成通知在 2288×1048 曲面分区内密集排布，验证六卡容量、优先级与补位；不是应用实拍或实体 OLED 验收。",
      evidenceLevel: "E0",
      evidenceLabel: "DemoSource 场景重绘",
      proves: "证明源代码 max-six 场景的六卡容量、左右分区和合成内容关系可视化。",
      doesNotProve: "不证明 WinUI 应用当次运行、透明合成或实体 OLED 的真实效果。",
      observedAt: "2026-08-30",
      sourceCommit: "271ffd25aae11e2f216993ec5595648167ab84bb"
    },
    {
      src: "/media/pc-panel-hub/hs2-hardware-alert-demo.png",
      thumbnail: "/media/pc-panel-hub/thumbs/hs2-hardware-alert-demo.webp",
      alt: "HS2 高优先级硬件告警软件演示",
      caption: "HS2 高优先级硬件告警演示；96°C 与持续 30 秒都是测试 fixture（固定演示数据），不读取本机传感器，也不证明实体屏已显示。",
      evidenceLevel: "E0",
      evidenceLabel: "硬件告警场景重绘",
      proves: "证明高优先级告警在视觉上压过普通事件，并保留行动建议与测试边界。",
      doesNotProve: "不证明本机出现过该温度、告警 provider 在线或实体屏已显示。",
      observedAt: "2026-08-30",
      sourceCommit: "271ffd25aae11e2f216993ec5595648167ab84bb"
    },
    {
      src: "/media/pc-panel-hub/hs2-placement-recovery-design.png",
      thumbnail: "/media/pc-panel-hub/thumbs/hs2-placement-recovery-design.webp",
      alt: "HS2 浮层落点状态与完整恢复策略设计图",
      caption: "浮层落点策略图区分 healthy、drifted、not-visible 与 recovered；只有真实错位请求完整重建，隐藏辅助窗口不触发循环回收。这是代码策略设计，不是当前机器回读。",
      evidenceLevel: "E0",
      evidenceLabel: "恢复策略设计图",
      proves: "证明窗口落点状态、完整重建条件和 no-loop（不循环）边界的设计关系。",
      doesNotProve: "不证明当前显示器 healthy、最近发生过 drift 或恢复已执行。",
      observedAt: "2026-08-30",
      sourceCommit: "271ffd25aae11e2f216993ec5595648167ab84bb"
    }
  ],
  responsibilities: [
    "采集并归一化 CPU、GPU、内存、物理网络、物理磁盘、天气、FPS、前台程序和进程排行",
    "把有来源、时效和 trust（可信度）标记的快照渲染为 480×1920 机箱屏界面",
    "在保守 command 200 全帧与有界 command 204 增量之间维持可关闭、可回退的刷新合同",
    "在 HS2 曲面 OLED 上显示低频事件、任务、媒体、手机状态与真正需要注意的硬件告警",
    "保持 HS2 浮层逐像素透明，让动态壁纸应用或 Windows 静态降级背景继续可见，而不接管壁纸设置",
    "协调两块屏在启动、睡眠、唤醒、关机、显示拓扑变化和进程故障时的安全状态",
    "用单一看门狗、唯一串口写入者、heartbeat（心跳）、熔断和全帧基线限制静默冻结",
    "提供纯软件 demo（演示）、渲染预览、主机侧回归和独立实体观察四种不互相冒充的证据"
  ],
  exclusions: [
    "不替代 TimeAudit 的长期数据库、历史诊断和 Grafana 大盘，也不复制其原始时序数据",
    "不作为企业多机监控、远程设备管理、通用通知数据库、动态壁纸引擎或任意显示器布局工具",
    "不把串口写入成功、进程存活、计划任务 Running 或 heartbeat 新鲜解释为设备 ACK 或实体像素正常",
    "不在普通恢复中重置 USB root hub、删除设备、扫描 PnP、改主屏模式或创建第二个 resume owner",
    "不把 command 204 描述成厂商公开且通用验证的协议；它仍是设备特定候选路径",
    "不在公开仓库或网页复制厂商二进制、私密通知正文、验证码、设备实例号、日志正文或凭据值"
  ],
  glossary: [
    { term: "TURZX case panel（TURZX 机箱屏）", meaning: "480×1920 USB 竖屏，负责高密度、持续刷新的硬件与系统状态。" },
    { term: "HS2 Crystal Overlay（HS2 水晶浮层）", meaning: "2288×1048 曲面 OLED 上的透明事件层，只在真实内容存在时创建卡片。" },
    { term: "dynamic wallpaper layer（动态壁纸层）", meaning: "由独立动态壁纸应用绘制的底层画面；浮层只叠加信息，退出时可由 Windows 静态背景接替。" },
    { term: "snapshot（快照）", meaning: "某一时刻经过来源和新鲜度处理的本机指标集合，不是长期历史库。" },
    { term: "trust score（可信度分数）", meaning: "说明当前快照有多少来源仍新鲜、可解释；不是安全评分。" },
    { term: "command 200 / 204（全帧 / 增量命令）", meaning: "前者发送完整画面并已有本机协议验证；后者只发差异，延迟更低但没有设备 ACK。" },
    { term: "Hybrid refresh（混合刷新）", meaning: "先用全帧建立基线，再用增量保持 1 Hz，并按固定边界重开会话和补全帧。" },
    { term: "heartbeat（心跳）", meaning: "记录主机最近一次真实发送尝试、节拍和恢复基线的无私人正文状态文件。" },
    { term: "one writer（唯一写入者）", meaning: "同一时刻只能有一个 stream 进程拥有目标串口，避免交错写入和错误恢复。" },
    { term: "circuit breaker（熔断）", meaning: "连续失败后先冷却并证明旧进程已释放资源，再创建一次新链路。" },
    { term: "device ACK（设备确认）", meaning: "设备明确回报已接收并显示画面；当前协议没有这样的可信回执。" },
    { term: "physical acceptance（实体观察验收）", meaning: "直接观察真实副屏刷新、位置、睡眠和恢复；软件日志或截图不能替代。" }
  ],
  currentState: {
    observedAt: "2026-08-31T11:19:19Z",
    label: "PUBLIC 源码、纯软件回归、主机发送链与 HS2 浮层落点有新鲜证据；动态壁纸像素保留 2026-08-30 本人确认",
    facts: [
      "Git Owner 回读 wlyaaaaa/PC-Panel-Hub 为 PUBLIC（公开）仓库，默认 main（默认主分支）；本地 HEAD 与缓存 origin/main 均为 ebbc1f2ab28bcef7a9a205a346981f16a3d253dc，工作树干净。",
      "项目 runtime check（运行依赖检查）确认 Python 3.11、.NET Framework C# 编译器、RJCP 串口库、既有 TURZX 运行文件和主 stack（运行栈）入口均存在；检查没有安装或改动任务。",
      "本轮项目原生 test.ps1 通过：指标 84/84、天气 8/8，并完成 renderer、HTTP、power、shortcut、refresh default、cadence、runtime reliability、dry-run stream 与 public release ZIP 检查；未打开 COM7。",
      "当前 main 的 metrics agent 新增 snapshot build lock，防止并发 `/snapshot` 请求同时推进共享采样基线。",
      "新的公开 ZIP 真实构建并解包通过：双屏源码完整包含 HS2，机器 JSON、厂商二进制和生成目录均被排除；只保留无实际天气坐标和网卡值的 config.example.json，本机 config.json 已保留实体文件但停止 Git 跟踪。",
      "2026-08-31T11:19:19Z 的 runtime check 为 ready、missing=0；有界 heartbeat 状态为 ok、snapshot_status=fresh、transport=hybrid_diff_204_full_200、frame=2748、sent=2748、failed=0、period_ms=1000、full=2700；最近 fetch/render/send 为 59/10/35 ms。",
      "当前产品公开 10 类信息，HS2 最多同时显示 6 张事件卡，15 个纯软件 demo 覆盖满载、告警、缺项和恢复布局；这些 demo 不冒充当前事件或实体屏验收。",
      "恢复节拍按第 60/120/180 帧与每 900 帧分层，用于重建会话或补全帧；这些数字是帧数而不是秒数，任何阈值只处理对应链路，不重启整机。",
      "TURZX SideScreen 计划任务状态为 Running、RunLevel=Highest；last result 267009 表示任务仍在运行而不是失败。现场只有一个 TURZX.SideScreen.Stream 进程，HS2.CrystalOverlay 进程也存在。",
      "2026-08-31T04:19:33Z 项目窗口落点策略回读 DISPLAY31 为非主 2288×1048，OverlayPlacementStatus=healthy、visible=1、misplaced=0、actions=0；证明透明浮层当前位于目标副屏。",
      "2026-08-30 显示缓冲区截图由本人当次确认同画面已在 HS2 实体屏生效；该历史物理验收与 2026-08-31 当前浮层落点证据分层保留。",
      "当前运行快照只证明主机侧采集、渲染和发送循环继续推进。它没有读取私人通知正文，也没有证明 COM 后的实体面板已经收到或显示相同画面。"
    ],
    gaps: [
      "本轮没有打开、重启或写入 COM7，也没有主动操作 HS2、L-Connect、USB 或显示模式；实体屏 1 Hz、冻结恢复、睡眠/唤醒和实际位置没有重新验收。",
      "command 204 没有设备 ACK；定期重开串口并补 command 200 全帧只能限制主机侧恢复间隔，不能量化实体冻结时间。",
      "本轮只确认 Wallpaper Engine 进程存在，未重新观察动态壁纸像素或运动；2026-08-30 本人确认不能升级成当前帧率、透明合成性能、全部事件源、睡眠后恢复或异常重启验收。",
      "画廊中的实际壁纸帧来自 Wallpaper Engine 市场场景；作者与公网再发布许可当前 Unknown（证据不足）。本页把它作为当次现场截图，不声称用户原创或拥有该美术素材。",
      "纯软件 gallery（画廊）中的测试 fixture（固定演示数据）和 demo 场景用于验证布局、文本和状态，不代表当前机器数值或实体硬件照片。",
      "公开仓库不含厂商运行二进制和本机绑定，换机安装仍需合法取得厂商文件并重新确认实际串口、显示器和 Hub 拓扑。",
      "普通提交已清理当前 main 与未来 ZIP，但不会抹除既有 PUBLIC Git 历史中的旧机器配置字面量；本轮没有执行未授权的历史重写或 force-push。"
    ]
  },
  operatingFlow: [
    { title: "先从真实来源采样", detail: "metrics agent（指标代理）按来源读取硬件、网络、磁盘、天气、FPS 和前台信息；进程排行独立每 3 秒采样，避免拖住 1 秒主循环。" },
    { title: "给每个值保留时效与可信度", detail: "来源不可达、陈旧或歧义时使用空值、旧快照或失败状态，不把 0 冒充真实传感器值。" },
    { title: "渲染机箱屏", detail: "C# 渲染器把 snapshot（快照）变成 480×1920 位图；网络、磁盘、FPS 和长名称都按真实版面有界显示。" },
    { title: "按当前刷新合同发送", detail: "启动先建立 command 200 全帧基线，再以 command 204 增量维持 1 Hz；60、120、180 和每 900 帧重开会话并补全帧。" },
    { title: "在动态壁纸上独立组织 HS2 事件", detail: "底层背景由动态壁纸应用负责；透明浮层从本地媒体、任务、Windows 通知和硬件状态形成最多六张卡，优先级、寿命、去重和布局由纯逻辑核心决定。" },
    { title: "由一个看门狗协调电源和恢复", detail: "看门狗拥有启动、睡眠、关机和恢复；先证明旧写入者退出，再只恢复目标组件，避免串口或显示拓扑竞争。" },
    { title: "分层验收并诚实标注", detail: "源码、测试、运行、演示、协议与实体观察分别记录；本人观察确认动态壁纸已实际生效，其余实体情景继续保留真实缺口，不用软件回执替代像素观察。" }
  ],
  components: [
    { name: "metrics_agent.py", responsibility: "提供 127.0.0.1:18765/snapshot 的硬件、网络、磁盘、天气、FPS、前台和健康快照。", implementation: "主指标目标 1 秒；物理公网出口歧义时失败关闭，虚拟接口不重复计数。" },
    { name: "top_processes_helper.py", responsibility: "独立采集进程 CPU / RAM 排行。", implementation: "约 3 秒节拍写有界结果，不阻塞主 snapshot 请求。" },
    { name: "TURZX.SideScreen.Stream", responsibility: "取得快照、渲染 480×1920 位图并发送到机箱屏。", implementation: "完整 HTTP body 有墙钟 deadline（截止时间）；失败时可复用最后一份好快照，PNG 预览异步低优先级生成。" },
    { name: "command 200 / 204 transport（传输层）", responsibility: "在完整基线、1 Hz 增量和周期恢复之间保持明确合同。", implementation: "全帧 10 秒上限、增量 900 ms 上限；首次发送失败即退出给看门狗重建。" },
    { name: "HS2.CrystalOverlay.Core", responsibility: "拥有事件、优先级、寿命、去重、布局和告警规则。", implementation: "不依赖显示器，可用合成数据做确定性单元测试。" },
    { name: "HS2.CrystalOverlay", responsibility: "在唯一非主 2288×1048 显示器上创建透明、鼠标穿透的事件浮层。", implementation: "单实例；找不到精确目标时不回退到主屏。" },
    { name: "动态壁纸 / Windows 背景层", responsibility: "在 HS2 浮层下方提供连续背景，动态壁纸应用退出时由 Windows 当前静态背景降级。", implementation: "这是独立显示内容提供者；PC Panel Hub 不修改壁纸设置，也不把背景资源打进仓库。" },
    { name: "StartSideScreenWatchdog.ps1", responsibility: "统一管理 stream、HS2、电源事件、串口所有权、模式保留和故障恢复。", implementation: "连续三次失败进入 30 秒熔断；不因一次重启异常退出长期 Owner。" },
    { name: "Windows startup task（启动任务）", responsibility: "在交互用户登录后以 Highest 运行无可见控制台的长期看门狗。", implementation: "wscript 父适配器保持任务 Running；旧 resume 任务被禁用，不形成第二恢复 Owner。" },
    { name: "纯软件测试与 demo", responsibility: "验证指标口径、渲染、HTTP、节拍、浮层布局、恢复合同和公开发布边界。", implementation: "fixture 值和 demo 场景不触碰设备，也不会被标成实体屏证据。" }
  ],
  usageExamples: [
    { ask: "机箱屏是不是又冻住了？", effect: "先看唯一写入者、heartbeat 年龄、发送动作、节拍与最近全帧，再决定是否运行有界 repair；最终仍观察实体时钟。" },
    { ask: "为什么网络数字和任务管理器不一样？", effect: "确认项目只统计物理公网出口，TUN、Tailscale、Hyper-V 和 VMware 等虚拟接口不会叠加。" },
    { ask: "没开游戏为什么 FPS 是空的？", effect: "把新鲜的 no game frames（无游戏帧）显示为等待状态，而不是 0 FPS 或采集器故障。" },
    { ask: "来通知时 HS2 会不会被卡片塞满？", effect: "最多六卡按优先级选择，最新手机通知、活动来电、任务和硬件告警有不同寿命与保留规则。" },
    { ask: "主屏休眠后窗口为什么跑到小屏？", effect: "只有 HS2 Secondary（副显示器）已验证后才启用窗口保护；主屏断开时先最小化普通应用，不改主屏或远程虚拟屏配置。" },
    { ask: "睡眠回来副屏为什么没恢复？", effect: "看门狗按当前已枚举模式恢复：已有 Windows Secondary 就原位验，只有 native 模式才在稳定后尝试一次提升，失败即回到原生亮屏。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "PUBLIC main 定义两块屏、数据来源、渲染、协议边界、事件规则、恢复和公开安全约束。", doesNotProve: "本机依赖已就绪、任务正在运行或实体设备正常。" },
    { layer: "Tests（测试）", proves: "指标 84、天气 8，以及项目原生脚本覆盖渲染、HTTP、电源、快捷方式、节拍、恢复、dry-run stream 和公开 ZIP 合同。", doesNotProve: "正在使用的 COM 设备可被安全重测，或真实画面没有冻结。" },
    { layer: "Runtime（运行）", proves: "观察时任务、唯一 stream、新鲜发送 heartbeat、2288×1048 HS2、wallpaper64 和 HS2 浮层进程同时存在，失败计数为 0。", doesNotProve: "仅凭进程不能证明动态壁纸运动、透明像素、通知内容和所有传感器值正确。" },
    { layer: "Demo / render（演示 / 渲染）", proves: "软件能在固定合成数据上生成机箱屏版面，并能用 HS2 场景检查六卡、缺项、重排和长文本。", doesNotProve: "截图来自实体硬件或当前机器现场。" },
    { layer: "Protocol observation（协议观察）", proves: "command 200 全帧和 command 123 亮度路径有本机验证；混合刷新有主机侧有界实现。", doesNotProve: "command 204 是厂商保证的通用协议或有设备 ACK。" },
    { layer: "Owner observation（本人现场观察）", proves: "本人于 2026-08-30 确认显示缓冲区同画面已在 HS2 实体屏生效。", doesNotProve: "不证明 2026-08-31 当前像素、1 Hz、冻结恢复、睡眠/唤醒、透明性能或异常断电后的自然启动。" }
  ],
  evolution: [
    { date: "2026-07-04—07-08", commit: "5e552b7–2bafc57", result: "发布 TURZX 机箱屏源码，建立天气、低干扰刷新、睡眠/关机恢复、无闪窗启动和迁移后的真实路径。" },
    { date: "2026-07-22—07-30", commit: "4592994–e7180e3", result: "从简单副屏升级为可信遥测面板：重做 CPU/GPU/网络/磁盘/FPS、修正口径和长帧展示，并加入 HS2 透明浮层。" },
    { date: "2026-07-31—08-06", commit: "fed85f1–e7a5f73", result: "建立 HS2 事件寿命、手机通知、媒体身份、任务、音量、游戏和六卡自适应布局，使第二块屏从装饰层变成低频事件面。" },
    { date: "2026-08-07—08-12", commit: "dfff40a–699600d", result: "把副屏恢复改成证据驱动：保留现有模式、唯一绑定、一次 Secondary 尝试、串口会话重建、全帧恢复和墙钟 deadline。" },
    { date: "2026-08-14—08-16", commit: "7ea67fd–7dfa5c4", result: "物理公网出口、1 Hz 默认与长期看门狗收敛，连续恢复失败不再让计划任务假成功退出。" },
    { date: "2026-08-23—08-25", commit: "78058b2–271ffd2", result: "进一步自愈 stream watchdog、TimeAudit FPS、HS2 monitor 漂移和 COM7 驱动停滞，同时保持设备操作边界不扩大。" },
    { date: "2026-08-30", commit: "2717ecb", result: "补齐含 HS2 的双屏公开源码包，把天气位置和本机配置移出 Git，增加真实 ZIP 清单/隐私回归并修正文档与示意图口径。" },
    { date: "2026-08-30—08-31", commit: "ebbc1f2", result: "为 metrics agent 增加 snapshot build lock，让并发快照请求共享同一采样基线而不相互推进；指标回归增至 84 项。" }
  ],
  operationalEntrypoints: [
    { name: "运行依赖检查", command: "pwsh -NoProfile -File .\\scripts\\check-runtime.ps1", purpose: "只读确认 Python、C# 编译器、串口库、厂商运行文件和 stack 入口是否存在。" },
    { name: "安全回归", command: "pwsh -NoProfile -File .\\scripts\\test.ps1 -SkipStreamWhenRunning", purpose: "生产 stream 已由新鲜 heartbeat 证明运行时，跑纯软件回归并跳过设备写入测试；否则应拆开运行无设备检查。" },
    { name: "查看主机侧健康", command: "Get-Content .\\tools\\turzx_side_screen\\out\\stream\\stream-heartbeat*.json", purpose: "读取节拍、发送动作、失败数、transport 和全帧基线；不把它当实体 ACK。" },
    { name: "有界修复", command: "pwsh -NoProfile -File .\\scripts\\repair-panel.ps1", purpose: "仅在需要且符合项目设备边界时，核对精确 COM 设备、唯一写入者和 1 Hz Hybrid heartbeat 后修复。" },
    { name: "HS2 软件演示", command: "HS2.CrystalOverlay.exe --demo=max-six", purpose: "用合成数据检查 2288×1048 满载六卡布局；不读取私人通知，也不证明实体屏。" },
    { name: "源码发布包", command: "pwsh -NoProfile -File .\\scripts\\build-release.ps1", purpose: "生成不含厂商二进制、日志和本机配置的公开源码包。" }
  ]
};

export const pcPanelHubModules = [
  {
    slug: "telemetry-trust",
    shortTitle: "指标与可信度",
    title: "一秒指标、物理来源与可信度边界",
    teaser: "把硬件、物理公网、磁盘、天气、FPS、前台和进程排行汇成带新鲜度与 trust（可信度）的本地快照，来源不确定时失败关闭。",
    status: "84 项指标测试通过，运行依赖就绪；本轮未逐值核验所有真实传感器",
    statusTone: "mixed",
    value: "屏幕上的每个数字不仅要“能取到”，还要知道它来自哪里、多久前更新、是不是估算或空闲状态。",
    why: "虚拟网卡叠加、CPU 口径混用、探针陈旧、无游戏帧被写成 0 FPS，都会让漂亮面板给出错误判断。",
    example: "网络有 Tailscale 和虚拟机时，系统只选择唯一物理公网出口；无法唯一确认就不给出合计速率，而不是把多个接口相加。",
    result: "得到一个 1 秒主快照和 3 秒进程排行，字段带来源、状态和可信度；无值时知道是空闲、陈旧还是不可用。",
    readerStates: {
      pass: "来源唯一、新鲜且解析成功时返回实际值与 trust 状态。",
      problem: "单个来源陈旧或字段异常时隔离该字段，保留其他可信数据。",
      unavailable: "物理出口、传感器或 TimeAudit 无法确认时返回空值或状态，不猜数字。"
    },
    decisionImpact: [
      "当前源码优先使用 PDH % Processor Utility（处理器效用率）；旧文档中的 Processor Time 说法属于待修漂移，不能反向覆盖运行实现。",
      "物理公网只统计明确出口，虚拟接口不重复计数。",
      "进程排行从 1 秒主循环分离，避免重扫描拖慢屏幕。",
      "新鲜无游戏帧是等待状态，陈旧或连接失败才是故障。"
    ],
    problem: "解决来源混加、不同口径同名、慢采集阻塞主循环、无值清零和陈旧值冒充实时。",
    implementation: [
      "metrics_agent.py 通过 loopback HTTP 提供有界 snapshot。",
      "top_processes_helper.py 每 3 秒独立采样并写有界 JSON。",
      "物理网络按接口身份筛选，TUN、虚拟化和小型虚拟盘按合同排除。",
      "TimeAudit 只提供可选 FPS 事实，本项目不复制长期数据库。"
    ],
    flow: [
      "发现并读取各数据源。",
      "按来源口径归一化和过滤。",
      "计算新鲜度、状态与 trust。",
      "返回 snapshot；慢排行异步更新。",
      "渲染层只消费已标注结果。"
    ],
    concepts: [
      { term: "PDH（Windows 性能计数器）", explanation: "当前代码从这里优先取得 % Processor Utility（处理器效用率），并保留来源与失败状态。" },
      { term: "physical egress（物理公网出口）", explanation: "真实承载上网流量的物理接口，不含隧道或虚拟交换接口。" },
      { term: "fresh / stale（新鲜 / 陈旧）", explanation: "值是否在允许时间内更新；陈旧值可显示但不能冒充当前。" }
    ],
    boundaries: [
      "天气、网络质量和功耗可能包含外部来源或估算。",
      "FPS 来自 TimeAudit/PresentMon，不归本项目保存历史。",
      "进程名和技术指标可公开；具体通知正文和凭据值不进入快照页面。"
    ],
    failures: [
      { condition: "物理公网出口歧义", response: "失败关闭，不叠加多个候选。" },
      { condition: "TimeAudit 没有活跃游戏帧", response: "显示等待游戏帧，不标 0 FPS。" },
      { condition: "慢来源超过 deadline", response: "使用最后一份好快照并降低 trust，主渲染不等待。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\metrics_agent.py", role: "主 snapshot 与来源可信度" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\top_processes_helper.py", role: "3 秒进程排行" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\test_metrics_agent.py", role: "84 项指标口径、并发快照锁与失败回归" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\architecture.md", role: "数据来源与节拍合同" }
    ],
    verification: [
      "本轮 test_metrics_agent.py 运行 84 项并通过。",
      "check-runtime 确认 Python 3.11 与 TimeAudit 读取依赖就绪。",
      "没有逐项对照实体传感器或外部仪表，真实值准确度仍按来源解释。"
    ],
    relation: "为机箱屏渲染和 HS2 硬件告警提供当前值；TimeAudit 继续拥有长期历史。"
  },
  {
    slug: "case-panel-rendering",
    shortTitle: "机箱屏渲染",
    title: "480×1920 机箱屏的信息密度与流畅渲染",
    teaser: "把可信 snapshot（快照）排成适合竖屏远读的时钟、CPU/GPU、FPS、内存、网络、磁盘和进程卡片，并让慢 HTTP 或 PNG 预览不阻塞真实发送。",
    status: "renderer、HTTP pipeline 与 preview 回归通过；gallery 使用合成预览，不是实体照片",
    statusTone: "mixed",
    value: "我不用在主屏打开监控窗口，也能一眼看到温度、负载、FPS、网络、磁盘和后台程序。",
    why: "480 像素宽的竖屏很容易字太小、长名称溢出、卡片空洞；预览编码或慢 HTTP 也可能反过来拖住实体刷新。",
    example: "磁盘名称很长、FPS 暂时为空时，版面仍保留可读层级和状态说明；异步写预览即使失败也不影响串口主路径。",
    result: "得到一张稳定、可远读、能表示空值和长文本的 480×1920 位图，以及不阻塞主循环的诊断预览。",
    readerStates: {
      pass: "完整快照在 deadline 内返回时，按当前数据渲染并发送。",
      problem: "快照超时或字段缺失时复用好数据并显示状态，不冻结整个画面。",
      unavailable: "renderer 构建失败时停止发送，不用旧二进制冒充新界面。"
    },
    decisionImpact: [
      "时钟直接在 renderer 内按本地时间生成，不依赖慢快照。",
      "完整 HTTP body 有墙钟 deadline 和 4 MiB 上限。",
      "PNG 预览在低优先级 single-flight（单飞）线程生成，可丢弃但不阻塞发送。",
      "长进程、磁盘和状态有有界布局，不通过缩成不可读小字解决。"
    ],
    problem: "解决窄屏信息层级、长名称溢出、慢 HTTP body、预览编码阻塞和空值误显示。",
    implementation: [
      "C# / GDI+ 在固定 480×1920 画布上绘制卡片。",
      "指标请求和渲染循环各有 deadline；错误时使用最近好快照。",
      "renderer 线程与串口 sender 线程使用 AboveNormal / Highest，但绝不使用 Realtime。",
      "测试 fixture 生成可重复 PNG，供视觉比较和网站画廊。"
    ],
    flow: [
      "请求本地 snapshot。",
      "验证 body 大小、时效和状态。",
      "在固定画布布局每一块信息。",
      "生成位图并交给 transport。",
      "发送后异步排队诊断 preview。"
    ],
    concepts: [
      { term: "GDI+（Windows 2D 绘图）", explanation: "项目用来绘制固定像素位图的本地图形接口。" },
      { term: "wall-clock deadline（墙钟截止）", explanation: "覆盖 headers 和完整 body 的真实最长等待，而不是只等一个回调。" },
      { term: "single-flight（单飞）", explanation: "同类慢任务未完成时不再排第二份，避免队列堆积。" }
    ],
    boundaries: [
      "软件 PNG 只证明 renderer 输出，不证明实体屏颜色、刷新或连接。",
      "最后好快照可保证画面连续，但必须同时显示新鲜度下降。",
      "设计 SVG 和 fixture 不是当前机器遥测。"
    ],
    failures: [
      { condition: "HTTP body 中途停滞", response: "caller deadline 到期后使用缓存，不等 timer callback。" },
      { condition: "预览文件被锁或编码慢", response: "丢弃本轮 preview，不影响串口发送。" },
      { condition: "字段为空或名称过长", response: "显示状态或有界换行，不清零或溢出卡片。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TURZX.SideScreen.Renderer.cs", role: "位图布局、deadline 与异步预览" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TURZX.SideScreen.Stream.cs", role: "快照读取、渲染循环与发送编排" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TestRenderer.ps1", role: "固定 fixture 渲染回归" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TestHttpPipeline.ps1", role: "HTTP 完整 body 与缓存回归" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\design\\dashboard-live-render-reference.svg", role: "当前布局参考" }
    ],
    verification: [
      "本轮 TestRenderer 与 TestHttpPipeline 通过并生成 480×1920 PNG。",
      "preview 文件约 80 KiB，测试输出可重复读取。",
      "未拍摄实体机箱屏，本模块 Physical 证据仍 Unknown。"
    ],
    relation: "消费指标模块的快照，把位图交给串口传输；画廊展示其软件输出。"
  },
  {
    slug: "serial-transport",
    shortTitle: "串口与刷新",
    title: "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
    teaser: "以 command 200 建完整画面基线、command 204 做有界增量，并用唯一写入者、发送上限、定期重开会话和 heartbeat 限制静默冻结。",
    status: "安装态 Hybrid 1 Hz heartbeat 新鲜且 failed=0；本轮保护 COM7，实体更新未重验",
    statusTone: "mixed",
    value: "主机每秒尝试发送并记录节拍，同时遇到驱动停滞或设备漏掉新会话时补一个完整全帧基线；实体时钟是否真的每秒变化仍靠现场观察。",
    why: "只发全帧约需 2.3 秒，无法做 1 Hz；只发未确认的增量又可能在设备漏帧后永久冻结。",
    example: "stream 重启后先 prime 并发两帧完整基线，再做增量；第 60、120、180 帧重开会话补全帧，之后每 900 帧再恢复一次。",
    result: "得到有明确模式、节拍、最近全帧、发送耗时和失败计数的主机侧刷新链，并保留 3 秒全帧兼容回退。",
    readerStates: {
      pass: "唯一 stream、精确目标、真实发送 heartbeat、节拍和基线均满足合同时判主机侧通过。",
      problem: "发送超时、节拍过慢或基线逾期时退出 worker，让看门狗冷却后重建。",
      unavailable: "无法证明旧写入者退出或设备身份唯一时不创建第二个 writer。"
    },
    decisionImpact: [
      "command 200 是保守已验证全帧路径；command 204 始终标为设备特定候选。",
      "安装默认保持 1 Hz，不把降到 3 秒当通用稳定性修复。",
      "增量 900 ms、全帧 10 秒上限，首次发送失败即退出。",
      "heartbeat 必须包含 send_attempted 和恢复基线，不能只报进程 alive。"
    ],
    problem: "解决全帧太慢、增量静默冻结、串口双写、驱动停滞、假心跳和恢复基线长期不到达。",
    implementation: [
      "启动执行 vendor-shaped priming、亮度恢复和两帧 command 200。",
      "稳态每秒发送 command 204 差分。",
      "warmup 60/120/180 帧与长期 900 帧重建 serial session 并补全帧。",
      "看门狗校验 mode、period、send_ms、last_full_frame 和 failed。"
    ],
    flow: [
      "确认唯一 COM 设备和旧 owner 已退出。",
      "打开串口并发送完整基线。",
      "每秒发送有界差分。",
      "到恢复边界时重开会话并补全帧。",
      "失败退出，由长期看门狗恢复。"
    ],
    concepts: [
      { term: "baseline（完整基线）", explanation: "设备可据此得到完整画面的 command 200 帧。" },
      { term: "delta（差分）", explanation: "只发送变化区域的 command 204 数据，主机更快但无设备 ACK。" },
      { term: "serial session（串口会话）", explanation: "一次独占打开与写入周期；重开可清除部分驱动/设备停滞。" }
    ],
    boundaries: [
      "COM7 是当前本机默认，不是可泛化设备事实；实际操作前必须重验身份。",
      "主机写成功不是 device ACK。",
      "Alt helper 仅保留隔离测试，不进入当前日常链路。"
    ],
    failures: [
      { condition: "旧 stream 未释放 COM", response: "启动失败关闭，不抢占或创建第二个 writer。" },
      { condition: "单次 send 超时或失败", response: "worker 退出，watchdog 进入有界恢复。" },
      { condition: "heartbeat 新鲜但基线逾期", response: "判为不健康，不接受假活。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TURZX.SideScreen.Stream.cs", role: "command 200/204、deadline、heartbeat" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TURZX.SideScreen.Protocol.cs", role: "已验证 command 200/123 编码边界" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\README_protocol.md", role: "协议观察与证据边界" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TestStreamCadence.ps1", role: "节拍与恢复基线合同" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\TestRuntimeReliability.ps1", role: "唯一 writer、heartbeat 和超时回归" }
    ],
    verification: [
      "观察时 heartbeat frame=22201、period=1005 ms、send_ms=34、failed=0、last_full_frame=21600。",
      "StreamCadence 与 RuntimeReliability 本轮通过。",
      "TestVideoStream 被保护性跳过，实体面板未由本轮写入。"
    ],
    relation: "接收 renderer 位图；失败由电源与恢复模块处理；实体结果进入验收模块。"
  },
  {
    slug: "hs2-overlay",
    shortTitle: "HS2 事件浮层",
    title: "2288×1048 OLED 的事件优先级、寿命与显示安全",
    teaser: "在唯一非主 2288×1048 显示器的动态壁纸上，以透明卡片显示媒体、任务、手机、音量、游戏和告警；没有真实内容就不创建空卡。",
    status: "2288×1048 显示器、Wallpaper Engine 与浮层同时在线，本人确认动态壁纸已生效；完整恢复情景未重验",
    statusTone: "mixed",
    value: "动态壁纸保持水冷副屏的视觉背景，低频但重要的信息只以透明卡片叠在上面；密集硬件指标仍留在机箱屏，不让两块屏重复。",
    why: "普通通知可能重复、过期或包含占位文字；卡片太多会越过曲面折线，显示器误选还可能把浮层放到主屏。",
    example: "三条手机通知、Steam、网易云和音量同时出现时，最多六卡，最新通知在底部；硬件告警和来电可抢占，暂时被挤出的计时卡暂停可见寿命。",
    result: "得到动态壁纸背景之上的透明卡片舞台、清晰的来源/寿命/去重规则，以及找不到精确显示器时不显示的安全降级；壁纸引擎与事件浮层仍可独立启停。",
    readerStates: {
      pass: "唯一 2288×1048 非主屏与绑定验证通过时创建鼠标穿透浮层，事件按规则显示。",
      problem: "来源陈旧、重复、超长或卡片竞争时去重、滚动、暂停寿命或淘汰低优先级项。",
      unavailable: "目标显示器不唯一或未验证时不回退主屏；停止旧浮层并等待。"
    },
    decisionImpact: [
      "密集遥测和低频事件分屏，不复制 TimeAudit 或机箱屏。",
      "动态壁纸只提供背景，浮层只提供信息；任一方退出不会伪装成另一方故障。",
      "最多六卡且只为真实内容占位；少量内容贴底收拢。",
      "通知来源独立采集、标准化去重，验证码只在明确语义下识别且不写日志。",
      "浮层不修改壁纸、主屏、远程虚拟屏或 Windows 原生鼠标边界。"
    ],
    problem: "解决双屏重复、空卡、通知风暴、旧通知复活、验证码误识别、超长文本和目标显示器误选。",
    implementation: [
      "Core 项目拥有事件、优先级、寿命、去重、布局与告警纯逻辑。",
      "WinUI 3 应用创建逐像素透明、无激活、鼠标穿透窗口。",
      "Wallpaper Engine 或 Windows 当前背景负责底层画面；浮层不连接或修改其设置。",
      "媒体、Steam、任务、音量、手机和硬件各有独立 adapter（适配器）。",
      "max-six、sparse、reflow、overflow 等 demo 使用合成数据。"
    ],
    flow: [
      "发现并验证目标显示器。",
      "从每个本地来源形成事件候选。",
      "标准化、去重并应用来源新鲜度。",
      "按优先级、寿命和六卡上限选择。",
      "布局到曲面安全区域并透明显示。",
      "事件结束、超时或按键清场后收起。"
    ],
    concepts: [
      { term: "event lifetime（事件寿命）", explanation: "卡片实际可见的累计时间；被高优先级挤出时可暂停。" },
      { term: "pixel alpha（逐像素透明度）", explanation: "只有卡片和文字参与合成，不建立黑色全屏底板。" },
      { term: "display binding（显示器绑定）", explanation: "用尺寸、主/副属性和已保存拓扑锁定目标 OLED，而不是猜 DISPLAY 编号。" }
    ],
    boundaries: [
      "通知正文和验证码属于本机显示内容，不进入公开仓库或网站样图。",
      "动态壁纸由独立应用提供；当前现场截图中的市场场景作者与公网再发布许可为 Unknown，不声称用户拥有或原创。纯软件 demo 继续使用项目可证明的合成背景。",
      "网易云当前无权威播放位置，因此不显示歌词、进度条和已播时间。",
      "Steam 成就和非 Steam 游戏通用识别尚未实现。"
    ],
    failures: [
      { condition: "目标显示器缺失或多解", response: "不在主屏创建窗口，等待唯一目标。" },
      { condition: "单个通知来源异常", response: "继续检查另一来源，不让一条链短路全部手机状态。" },
      { condition: "普通旧通知在启动时存在", response: "只建立基线，不翻出旧消息；活动来电/传输可恢复。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\OverlayScheduler.cs", role: "事件、优先级和寿命调度" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\OverlayDeckLayout.cs", role: "六卡与曲面安全布局" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\App.xaml.cs", role: "WinUI 应用、显示选择和本地 adapter" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\tests\\HS2.CrystalOverlay.Tests", role: "事件、来源、时间和布局测试" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\hs2-crystal-overlay.md", role: "产品行为、演示场景和实体验收" }
    ],
    verification: [
      "源码列出 max-six 等 15 类纯软件 demo 场景，并明确全部使用合成数据。",
      "本轮回读到 2288×1048 HS2、wallpaper64 和 HS2.CrystalOverlay 同时在线，且本人确认动态壁纸已在水冷屏生效；没有读取通知正文。",
      "动态壁纸当前状态已确认；透明合成性能、全部事件寿命、睡眠与异常重启恢复仍未重演。"
    ],
    relation: "读取指标模块的异常值，并与电源恢复模块共享显示器模式边界；不依赖机箱屏渲染。"
  },
  {
    slug: "power-recovery",
    shortTitle: "电源与自愈",
    title: "启动、睡眠、关机、显示拓扑与有界自愈",
    teaser: "由一个长期 watchdog（看门狗）协调两块屏：保留已经成功枚举的模式、证明旧 owner 退出、限制 Secondary 尝试，并在连续失败后熔断。",
    status: "任务 Running、运行硬化回归通过；本轮未主动睡眠、关机、重启服务或操作 USB",
    statusTone: "mixed",
    value: "副屏异常时只修受影响链路，不通过重启整机、反复切显示模式或重置整棵 USB 树碰碰运气。",
    why: "电源事件和设备重枚举容易产生双 watchdog、串口未释放、Windows 窗口被困小屏或每几十秒重建 GPU 拓扑。",
    example: "HS2 启动时已是 Windows Secondary，就原位验证；若只有 native 模式，稳定 30 秒后只尝试一次提升，失败马上回原生亮屏并等下一 epoch。",
    result: "得到一个无可见控制台的长期 Owner、明确的 Active/Suspend/Shutdown 行为、有界重试和不会扩大到无关设备的恢复路径。",
    readerStates: {
      pass: "任务、精确进程、heartbeat、控制器模式与绑定均满足时维持当前输出。",
      problem: "进程死亡、假活、COM 停滞或显示漂移时，只恢复目标组件并回读新证据。",
      unavailable: "控制器/端点/绑定缺失或歧义时保持安全模式，不发送模式命令、不碰 USB/PnP。"
    },
    decisionImpact: [
      "只有一个长期 watchdog 处理 resume；旧事件任务保持禁用。",
      "已有 Secondary 绝不先降级，native 每 epoch 只尝试一次提升。",
      "三次连续失败后 30 秒熔断，先证明旧 stream 释放 COM。",
      "普通恢复不重启 Hub、不删设备、不做 PnP scan，也不改物理主屏和远程虚拟屏。"
    ],
    problem: "解决双恢复 Owner、显示模式抖动、串口竞争、任务假成功退出、睡眠后窗口乱跑和过度 USB 修复。",
    implementation: [
      "计划任务由 wscript 无窗口父适配器启动长期 PowerShell watchdog。",
      "WMI 电源订阅统一处理 suspend/resume，与 live process/COM owner 合并。",
      "HS2 模式按 actual enumerated state（实际已枚举状态）保留，绑定必须连续两次健康。",
      "TURZX suspend 停 stream 并用 command 123 亮度 0；恢复先还亮度再启动。"
    ],
    flow: [
      "登录后启动唯一 watchdog。",
      "检查当前控制器模式、设备绑定和旧 owner。",
      "按实际状态启动两块屏。",
      "持续检查 heartbeat、进程和电源事件。",
      "故障时熔断并精确恢复。",
      "睡眠/关机按各屏合同收口。"
    ],
    concepts: [
      { term: "epoch（一次启动/恢复周期）", explanation: "每次正常启动或 resume 的一次机会；失败不会在同一周期无限重试模式。" },
      { term: "preserve-current-mode（保留当前模式）", explanation: "先接受固件和 Windows 已成功枚举的模式，再决定是否需要切换。" },
      { term: "RunLevel Highest（最高用户运行级别）", explanation: "交互用户任务的提升级别，不是 SYSTEM，也不扩大设备授权。" }
    ],
    boundaries: [
      "修复入口会真实影响副屏，必须先核对精确目标；网站刷新只读。",
      "内部 USB 排针不得带电插拔。",
      "服务/进程回读不等于实体显示恢复。"
    ],
    failures: [
      { condition: "A108 Boot ROM 或控制器缺失", response: "只读等待，不发送模式命令或 USB 操作。" },
      { condition: "Secondary 提升失败", response: "立即回原生亮屏并停止旧浮层，本 epoch 不再尝试。" },
      { condition: "watchdog 子进程反复失败", response: "保留长期循环，30 秒熔断后只启动一次新 stack。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\StartSideScreenWatchdog.ps1", role: "长期进程、电源和恢复 Owner" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\repair-panel.ps1", role: "冻结面板有界修复" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\install-startup-admin.ps1", role: "启动任务安装与旧任务禁用" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\startup.md", role: "模式、电源、拓扑与恢复合同" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\TestRuntimeReliability.ps1", role: "恢复与假活回归" }
    ],
    verification: [
      "观察时计划任务 Running / Highest，唯一 stream 与新鲜 heartbeat 存在。",
      "TestPowerWatchdog、TestRefreshDefaults 和 TestRuntimeReliability 本轮通过。",
      "未制造睡眠、关机、驱动故障或显示拓扑变化，真实恢复 E2E 未重验。"
    ],
    relation: "监管机箱屏传输和 HS2 显示状态；总览中的分层证据决定主机事实能否升级为实体结论。"
  }
];

export const project = pcPanelHubProject;
export const modules = pcPanelHubModules;
