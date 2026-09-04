import { createProjectSnapshot } from "./project-snapshot.js";

const pcPanelHubSnapshot = createProjectSnapshot({
  observedAt: "2026-09-02T19:56:46Z",
  label: "当前源码已核对 HS2 信息寿命与前置窗口保护；8 月 31 日主机快照及 8 月 30 日实体观察分层保留，未重新运行设备验收",
  boundary: "2026-09-02 只读源码复核到 7144da5：普通窗口保护先于完整 HS2 控制器/浮层验证，RTSS 优先帧链与手机、音乐、游戏信息路径已核对。下列 8c217ead 测试、发送帧数、进程与落点仍是 2026-08-31 证据；没有启动或重启 watchdog、触碰 COM7、L-Connect、USB、显示模式或壁纸控制。实体动态壁纸只保留 2026-08-30 本人历史确认",
  metrics: [
    { label: "显示面", value: "2" },
    { label: "发送帧", value: "2748 / 2748" },
    { label: "发送失败", value: "0" },
    { label: "当前刷新", value: "1 Hz" }
  ],
  facts: [
    { label: "两块显示面", value: "TURZX 480×1920 显示密集遥测；HS2 2288×1048 在动态壁纸上显示网易云曲目/封面、Steam 本次时长与退出总结、手机电量、通知/来电/验证码、任务与告警，最多 6 张事件卡" },
    { label: "当前刷新选择", value: "安装态为 1 Hz Hybrid（混合）刷新：command 200 全帧基线 + command 204 有界增量；3 秒全帧仅作兼容回退" },
    { label: "数据与恢复节拍", value: "主周期 1000 ms；最近 fetch/render/send 59/10/35 ms；第 60/120/180 帧与每 900 帧重建会话或补全帧，进程排行约 3 秒" },
    { label: "显示拓扑恢复", value: "只观察活动显示器身份与唯一主屏归属；15 秒探测、30 秒稳定、900 秒冷却，恰好三屏且 MTT/HS2 绑定健康时才通过当前用户 shell 对既有 Wallpaper Engine 发一次 stop/play" },
    { label: "运行快照", value: "2026-08-31T11:19:19Z runtime ready、missing=0；frame/sent=2748/2748、failed=0、period=1000 ms、full=2700；本轮确认 HS2 浮层落点，实体动态壁纸沿用 2026-08-30 本人历史确认" },
    { label: "源码、回归与边界", value: "PUBLIC main=8c217ead；本地、origin 与实时远端一致且工作树干净，84 项指标、8 项天气及原生检查通过；为保护 COM7 跳过写入测试，command 204 无设备 ACK，仍不能代替实体像素观察" },
    { label: "已验证发布基线", value: "2026-08-31 Git Owner 回读 wlyaaaaa/PC-Panel-Hub 为 PUBLIC（公开）仓库，默认 main（默认主分支）；当时 8c217eadf76e6849c382c909b407d9dc436f9005 的本地 HEAD、origin/main 与实时远端 main 一致，工作树干净、ahead/behind 为 0/0。下列原生测试和运行数字仍绑定这一历史观察，不用于证明后续代码已发布或加载。", hero: false },
    { label: "当前源码补核", value: "2026-09-02 本地 HEAD=7144da589119fa59d5eb56bbaa921d2bf3af8484；HS2 产品文档、StartSideScreenWatchdog、Invoke-HS2StartupWindowGuard 与窗口策略没有未提交改动。普通窗口保护在控制器恢复前启动，每 250 ms 检查、默认覆盖启动最初 180 秒，随父 watchdog 退出；完整浮层仍等待 Secondary 模式与绑定双样本验收。本次只读取源码和测试定义。", hero: false },
    { label: "运行依赖", value: "项目 runtime check（运行依赖检查）确认 Python 3.11、.NET Framework C# 编译器、RJCP 串口库、既有 TURZX 运行文件和主 stack（运行栈）入口均存在；检查没有安装或改动任务。", hero: false },
    { label: "原生回归", value: "8c217ead 上项目原生 test.ps1 -SkipStreamWhenRunning 通过：指标 84/84、天气 8/8，并完成 renderer、HTTP、PowerWatchdog、shortcut、refresh default、cadence、runtime reliability 与 public release ZIP 检查；检测到新鲜生产 heartbeat 后保护性跳过 TestVideoStream，未打开 COM7。", hero: false },
    { label: "拓扑资格", value: "8c217ead 新增显示拓扑恢复：看门狗每 15 秒只读活动显示器设备名与唯一主屏归属；HDR-only 变化和没有形成新活动显示器/主屏身份的波动不触发。只有恰好三块活动屏、唯一 DISPLAY\\MTT1337\\* 与 Root\\MttVDD 设备/后端健康、HS2 已为 Secondary 且既有 8091/AD23/MI_00/LED 绑定健康，变化稳定 30 秒后才有资格重绑。", hero: false },
    { label: "壁纸重绑动作", value: "恢复时先从当前 session（会话）中唯一 wallpaper64 进程取得安装目录，再要求同目录唯一 wallpaper32.exe 与当前 session 的 explorer shell；Highest watchdog 通过 Shell.Application 依次分派 `-control stop`、等待 1500 ms、再分派 `-control play`，不启动高权限常驻渲染进程、不打开 GUI、不写场景或配置。", hero: false },
    { label: "事件与冷却", value: "同一拓扑事件最多消费一次，重绑后进入 900 秒冷却；控制客户端、用户 shell 或 COM 分派不可用时返回具名状态并记日志。失败分派也会消费当前事件并更新基线，避免同一显示变化形成 stop/play 循环；只有后续真实拓扑变化并跨过冷却才会得到新机会。", hero: false },
    { label: "硬件失败关闭", value: "绑定的 LIAN LI Hub、AD23、MI_00 或 LED 若出现 Code 10，恢复链立即失败关闭并提示关机后检查 HS2 USB 排针、线缆和辅助供电；不会自动重启 Hub、移除设备、扫描 PnP 或形成重试循环。", hero: false },
    { label: "源码与运行态分层", value: "上述 8c217ead 事实属于 source/test（源码/测试）层。本轮没有重启或重新安装已经运行的 watchdog，也没有制造显示拓扑变化、执行真实 wallpaper32 stop/play 或读取实体像素，因此不能推断当前内存中的长期进程已经加载新恢复代码。", hero: false },
    { label: "并发采样保护", value: "当前 main 的 metrics agent 新增 snapshot build lock，防止并发 `/snapshot` 请求同时推进共享采样基线。", hero: false },
    { label: "公开构建", value: "新的公开 ZIP 真实构建并解包通过：双屏源码完整包含 HS2，机器 JSON、厂商二进制和生成目录均被排除；只保留无实际天气坐标和网卡值的 config.example.json，本机 config.json 已保留实体文件但停止 Git 跟踪。", hero: false },
    { label: "公开源码范围", value: "当前 PUBLIC main 同时包含 clean clone 安装入口、只读 runtime check、启动任务安装/卸载脚本、HS2 拓扑绑定、显示拓扑/壁纸重绑逻辑、Win+F1/Win+F2 控制和 Publish-HS2Task.ps1 生产者入口；本机私有 config、厂商运行文件和 out 下的 HS2 绑定不属于公开源码。", hero: false },
    { label: "主动任务协议", value: "HS2 主动任务协议使用本机 `HS2.CrystalOverlay.Tasks` 命名管道：Id、标题、详情、进度、预计剩余与状态被独立校验；活动任务默认五分钟租约，同 Id 重开会先清旧完成卡，completed 显示一次完成提示，cancelled 清除活动与完成状态。", hero: false },
    { label: "运行快照详情", value: "2026-08-31T11:19:19Z 的 runtime check 为 ready、missing=0；有界 heartbeat 状态为 ok、snapshot_status=fresh、transport=hybrid_diff_204_full_200、frame=2748、sent=2748、failed=0、period_ms=1000、full=2700；最近 fetch/render/send 为 59/10/35 ms。", hero: false },
    { label: "产品信息面", value: "HS2 的 10 类信息有各自来源和寿命：网易云播放常驻、切歌扩展 8 秒；Steam 运行时显示本次时长、退出总结 60 个可见秒；双来源手机电量按证据新鲜度择优；普通通知/动态状态 60 个可见秒、连接提示 5 秒、验证码 15 秒，来电/活动传输随源结束且有 5 分钟失联保护。全局最多 6 卡，15 个纯软件 demo 不冒充当前事件或实体验收。", hero: false },
    { label: "恢复节拍", value: "恢复节拍按第 60/120/180 帧与每 900 帧分层，用于重建会话或补全帧；这些数字是帧数而不是秒数，任何阈值只处理对应链路，不重启整机。", hero: false },
    { label: "当前进程", value: "TURZX SideScreen 计划任务状态为 Running、RunLevel=Highest；last result 267009 表示任务仍在运行而不是失败。现场只有一个 TURZX.SideScreen.Stream 进程，HS2.CrystalOverlay 进程也存在。", hero: false },
    { label: "浮层落点", value: "2026-08-31T04:19:33Z 项目窗口落点策略回读 DISPLAY31 为非主 2288×1048，OverlayPlacementStatus=healthy、visible=1、misplaced=0、actions=0；证明透明浮层当前位于目标副屏。", hero: false },
    { label: "历史实体确认", value: "2026-08-30 显示缓冲区截图由本人当次确认同画面已在 HS2 实体屏生效；该历史物理验收与 2026-08-31 当前浮层落点证据分层保留。", hero: false },
    { label: "主机侧含义", value: "当前运行快照只证明主机侧采集、渲染和发送循环继续推进。它没有读取私人通知正文，也没有证明 COM 后的实体面板已经收到或显示相同画面。", hero: false }
  ],
  gaps: [
    "7144da5 的前置普通窗口保护及本次补全的信息来源/寿命只经过源码复核；没有重跑来源测试、真实播放/切歌、启动 Steam、接收通知、读取手机电量或验证登录期窗口迁移。源项目 AGENTS 仍有‘Active 后才窗口保护’的旧句；当前产品文档与实现已将普通窗口保护和完整浮层验收拆开，这处源规则文字漂移仍需来源 Owner 收口。",
    "本轮没有打开、重启或写入 COM7，也没有主动操作 HS2、L-Connect、USB、显示模式或 Wallpaper Engine 控制客户端；实体屏 1 Hz、冻结恢复、睡眠/唤醒、拓扑重绑和实际位置没有重新验收。",
    "command 204 没有设备 ACK；定期重开串口并补 command 200 全帧只能限制主机侧恢复间隔，不能量化实体冻结时间。",
    "Runtime 层本轮只确认 Wallpaper Engine 进程与 HS2 浮层落点，未证明已经运行的 watchdog 加载 8c217ead，也未重新观察实体动态壁纸像素或运动；2026-08-30 本人历史确认不能升级成当前帧率、拓扑重绑、透明合成性能、全部事件源、睡眠后恢复或异常重启验收。",
    "没有注入“stop 已成功而 play 分派失败”的真实故障。源码对此不做同事件自动 rollback（回滚）或紧密重试：它保留原 Wallpaper Engine 配置与场景、消费该事件并进入冷却；若背景没有恢复，Windows 当前静态背景仍是视觉降级，后续由 Wallpaper Engine 自身的用户控制或下一次真实拓扑事件处理。",
    "本轮没有在另一台机器或重装后的 Windows 上执行 clean clone、合法厂商文件补齐、私有配置重建、双屏换绑、启动任务和自然启动的完整 E2E；当前主机安装健康不能替代换机验收。",
    "本轮没有在当前交互桌面真实按下 Win+F1/Win+F2，也没有用真实长任务生产者跑完 active→completed/cancelled 与异常退出租约回收；源码和纯逻辑测试不能冒充这条用户可见 E2E。",
    "画廊中的实际壁纸帧来自 Wallpaper Engine 市场场景；作者与公网再发布许可当前 Unknown（证据不足）。本页把它作为当次现场截图，不声称用户原创或拥有该美术素材。",
    "纯软件 gallery（画廊）中的测试 fixture（固定演示数据）和 demo 场景用于验证布局、文本和状态，不代表当前机器数值或实体硬件照片。",
    "公开仓库不含厂商运行二进制和本机绑定，换机安装仍需合法取得厂商文件并重新确认实际串口、显示器和 Hub 拓扑。",
    "普通提交已清理当前 main 与未来 ZIP，但不会抹除既有 PUBLIC Git 历史中的旧机器配置字面量；本轮没有执行未授权的历史重写或 force-push。"
  ]
});

export const pcPanelHubProject = {
  order: 29,
  slug: "pc-panel-hub",
  title: "PC Panel Hub",
  route: "/projects/pc-panel-hub",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "双屏信息与前置窗口保护源码已核对；运行数据为 8 月 31 日基线，实体动态壁纸保留 8 月 30 日本人确认",
  cardStatusTone: "mixed",
  ...pcPanelHubSnapshot,
  searchAliases: ["机箱副屏冻住怎么办", "HS2水冷屏通知浮层", "副屏睡眠后恢复", "显示器变化后动态壁纸不恢复", "A108端点不见了怎么接线", "双副屏遥测和事件", "新电脑怎么安装双副屏", "换机后怎么恢复副屏绑定", "Win+F1清理HS2通知", "Win+F2切换HS2时钟", "怎么把长任务显示到HS2"],
  repositoryNote: "源码位于 PUBLIC（公开）GitHub 仓库并使用 MIT 许可；仓库只发布项目源码、脚本、合同与公开示例，厂商二进制明确不属于该许可。端口、协议、硬件型号、进程名和状态等技术事实不按字段类别自动隐藏；只有具体值实际含私人正文、身份隐私或可复用凭据时才省略。",
  summary: "PC Panel Hub 让 TURZX 480×1920 USB 机箱屏和 LIAN LI HS2 2288×1048 曲面 OLED 水冷屏各司其职：前者持续显示 Windows 主机的硬件、帧率、网络、磁盘和后台状态，后者在动态壁纸上临时显示媒体、手机、任务和告警。显示器身份或主屏归属真正变化后，单一看门狗还会在三屏绑定健康、变化稳定且冷却允许时，请现有 Wallpaper Engine 做一次有界渲染重绑。公开源码同时保留从干净克隆到本机双屏绑定的重建路线，使换机或重装不必靠旧路径和记忆拼安装。",
  why: "主屏上的监控窗口会挡工作，也容易在问题发生前被关掉；实体副屏又可能出现“任务仍在运行、主机仍在写串口，但画面已经冻结”的假健康。远程虚拟屏、HS2 或主屏重新枚举后，Wallpaper Engine 进程也可能仍在，却继续绑定旧渲染面而没有恢复动态背景。换机时若把源码、厂商运行文件、本机配置和硬件绑定混成一份，还会把旧机器身份带到新机器。这个项目把安装、数据可信度、渲染、传输、控制、恢复、运行证据和实体观察分层，使我既能随时看见关键状态，也能知道哪一层真的被证明。",
  plainExample: "我可以说：“主屏只留给工作和游戏，电脑状态放到机箱屏上。”温度、负载、流畅度、网络和磁盘会持续排在 480×1920 的竖屏里；没开游戏时明确显示正在等待帧，不会伪造一个 0 FPS。最后我抬眼就能看见电脑现在忙不忙、热不热，主屏不用常驻监控窗口。",
  result: "我得到一块持续显示密集遥测的机箱屏、一块只在有意义事件出现时显示的透明 OLED 浮层、一组可直接清场或切换时钟的全局控制、一次只作用于既有 Wallpaper Engine 渲染面的有界拓扑恢复，以及从干净源码重建本机安装态的明确路径。页面同时告诉我：源码和测试通过了什么、当前安装与运行链证明了什么、软件 demo（演示）展示了什么，以及哪些恢复和实体屏结论仍需现场观察。",
  readerStates: {
    pass: "源码、纯软件回归、运行依赖、唯一发送者和新鲜 heartbeat（心跳）分别通过时，主机侧链路可判为健康；若另有当次实体观察，才把对应屏幕画面记为实体 PASS。",
    problem: "节拍超时、发送失败、串口身份漂移、显示器绑定异常、浮层错屏或拓扑变化后动态壁纸未恢复时，只处理受影响组件，并保留当前模式、稳定窗口、冷却、失败状态和回退证据。",
    unavailable: "设备、串口、L-Connect、本地指标、唯一三屏绑定、Wallpaper Engine 控制客户端或交互桌面不可用时，停止相应动作并标为 Unknown（未验证）；不抢串口、不重置 USB 树、不改壁纸配置，也不把旧预览冒充当前画面。"
  },
  productPrinciples: [
    { title: "两块屏承担不同工作", detail: "机箱屏负责持续状态，水冷屏负责低频事件；同一信息不在两块屏重复堆叠。" },
    { title: "先保证一眼可读，再显示更多", detail: "信息层级、字号、间距和状态含义优先于指标数量，副屏不能变成缩小版监控墙。" },
    { title: "有效空状态也要被设计", detail: "没有游戏帧、没有通知和没有告警都是真实状态，不制造零值、空卡或假异常。" },
    { title: "每个值带着来源和新鲜度到像素层", detail: "陈旧、估算和未知不能冒充当前实测；UI显示什么必须能追到采集与更新时间。" },
    { title: "实体像素才是最终验收", detail: "进程、日志、发送成功和心跳只能证明主机侧，不能替代对真实屏幕持续更新的观察。" },
    { title: "恢复必须精确而有界", detail: "同一设备只有一个写入者；串口冻结只修发送链，壁纸恢复只在目标三屏与进程身份都精确成立后执行一次，不靠重启电脑、重置整棵 USB 树或循环 stop/play 碰运气。" },
    { title: "动态壁纸与事件浮层互不绑架", detail: "浮层透明、低频且可退出；找不到精确副屏时绝不回退到主屏。" },
    { title: "公开源码与本机安装态分开", detail: "Git 只保存可重建的源码、脚本、合同和无真实值示例；厂商运行文件、串口、物理网卡、天气坐标与硬件绑定在每台机器上合法取得或重新确认。" },
    { title: "人在屏前可以立即收束信息", detail: "Win+F1 只清已结束或短时内容，活动媒体、游戏、任务、传输、来电和硬件告警继续保留；Win+F2 只切换时钟并记住选择。" }
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
    "保持 HS2 浮层逐像素透明，让动态壁纸应用或 Windows 静态降级背景继续可见；不接管壁纸资产和设置，只在真实显示拓扑变化后对既有 Wallpaper Engine 渲染面做一次有界重绑",
    "用 Win+F1 清理可清内容、Win+F2 持久切换时钟，并让主动任务通过有租约的本机命名管道显示进度与完成状态",
    "协调两块屏在启动、睡眠、唤醒、关机、显示拓扑变化和进程故障时的安全状态，并在唯一三屏绑定健康时恢复动态壁纸渲染",
    "用单一看门狗、唯一串口写入者、heartbeat（心跳）、熔断和全帧基线限制静默冻结",
    "提供从 clean clone（干净克隆）、合法厂商运行文件和私有配置到双屏重新绑定、启动任务与分层验收的换机路径",
    "提供纯软件 demo（演示）、渲染预览、主机侧回归和独立实体观察四种不互相冒充的证据"
  ],
  exclusions: [
    "不替代 TimeAudit 的长期数据库、历史诊断和 Grafana 大盘，也不复制其原始时序数据",
    "不作为企业多机监控、远程设备管理、通用通知数据库、动态壁纸引擎或任意显示器布局工具",
    "不把串口写入成功、进程存活、计划任务 Running 或 heartbeat 新鲜解释为设备 ACK 或实体像素正常",
    "不在普通恢复中重置 USB root hub、删除设备、扫描 PnP、改主屏模式、改 Wallpaper Engine 配置、打开其 GUI 或创建第二个 resume owner",
    "不把 command 204 描述成厂商公开且通用验证的协议；它仍是设备特定候选路径",
    "不把厂商 EXE/DLL、本机 config.json、天气坐标、物理网卡名、设备拓扑绑定、日志或生成目录放进 Git 或公开源码包",
    "不在换机时照搬旧串口、旧显示器编号或旧 HS2 实例绑定；这些值必须在新机器上重新发现和验证",
    "不在公开仓库或网页复制厂商二进制、验证码、凭据值，或经逐值判断确含私人正文、达到 L3+ 的具体载荷；设备实例号、路径和日志等普通技术事实若会改变绑定或恢复判断则保留"
  ],
  glossary: [
    { term: "TURZX case panel（TURZX 机箱屏）", meaning: "480×1920 USB 竖屏，负责高密度、持续刷新的硬件与系统状态。" },
    { term: "HS2 Crystal Overlay（HS2 水晶浮层）", meaning: "2288×1048 曲面 OLED 上的透明事件层，只在真实内容存在时创建卡片。" },
    { term: "dynamic wallpaper layer（动态壁纸层）", meaning: "由独立动态壁纸应用绘制的底层画面；浮层只叠加信息。真实拓扑变化后看门狗只调用既有控制客户端重绑渲染，不修改场景或设置；应用退出时可由 Windows 静态背景接替。" },
    { term: "snapshot（快照）", meaning: "某一时刻经过来源和新鲜度处理的本机指标集合，不是长期历史库。" },
    { term: "trust score（可信度分数）", meaning: "说明当前快照有多少来源仍新鲜、可解释；不是安全评分。" },
    { term: "command 200 / 204（全帧 / 增量命令）", meaning: "前者发送完整画面并已有本机协议验证；后者只发差异，延迟更低但没有设备 ACK。" },
    { term: "Hybrid refresh（混合刷新）", meaning: "先用全帧建立基线，再用增量保持 1 Hz，并按固定边界重开会话和补全帧。" },
    { term: "heartbeat（心跳）", meaning: "记录主机最近一次真实发送尝试、节拍和恢复基线的无私人正文状态文件。" },
    { term: "one writer（唯一写入者）", meaning: "同一时刻只能有一个 stream 进程拥有目标串口，避免交错写入和错误恢复。" },
    { term: "circuit breaker（熔断）", meaning: "连续失败后先冷却并证明旧进程已释放资源，再创建一次新链路。" },
    { term: "device ACK（设备确认）", meaning: "设备明确回报已接收并显示画面；当前协议没有这样的可信回执。" },
    { term: "physical acceptance（实体观察验收）", meaning: "直接观察真实副屏刷新、位置、睡眠和恢复；软件日志或截图不能替代。" },
    { term: "clean clone（干净克隆）", meaning: "只从公开仓库取得被 Git 跟踪的源码、文档和无真实值示例，不携带旧机器的运行输出或绑定。" },
    { term: "local installation state（本机安装态）", meaning: "合法取得的厂商运行文件、私有 config、设备绑定、计划任务和当前机器验收共同组成的可重建状态。" },
    { term: "named pipe（命名管道）", meaning: "同一台 Windows 机器上让任务生产者把有界 JSON 更新交给 HS2 浮层的进程间通道。" },
    { term: "lease（租约）", meaning: "活动任务必须周期续报的最长保留时间；默认五分钟，生产者异常退出后卡片会自动收起。" },
    { term: "narrow fallback hook（窄范围回退钩子）", meaning: "只有 Win+F1 被其他程序占用时启用，只接管真实键盘的 Win+F1 且要求不带 Ctrl/Alt，不吞掉注入按键或其他冲突组合。" },
    { term: "topology fingerprint（拓扑指纹）", meaning: "只由当前活动显示器设备名与唯一主屏标志组成；分辨率、位置和 HDR 变化不在指纹内，因此不会误触发壁纸重绑。" },
    { term: "render rebind（渲染重绑）", meaning: "通过当前用户桌面外壳对同一安装目录下的 wallpaper32.exe 依次发送 stop 与 play，让既有场景重新绑定当前显示面；不启动新的常驻渲染器。" }
  ],
  operatingFlow: [
    { title: "先建立本机安装态", detail: "从 clean clone 补齐合法取得的厂商运行文件，把无真实值示例复制为 ignored（Git 忽略）的 config.json，重新确认串口、物理公网接口、天气与 HS2 拓扑，再让 runtime check 决定能否安装启动任务。" },
    { title: "先从真实来源采样", detail: "metrics agent（指标代理）按来源读取硬件、网络、磁盘、天气、FPS 和前台信息；进程排行独立每 3 秒采样，避免拖住 1 秒主循环。" },
    { title: "给每个值保留时效与可信度", detail: "来源不可达、陈旧或歧义时使用空值、旧快照或失败状态，不把 0 冒充真实传感器值。" },
    { title: "渲染机箱屏", detail: "C# 渲染器把 snapshot（快照）变成 480×1920 位图；网络、磁盘、FPS 和长名称都按真实版面有界显示。" },
    { title: "按当前刷新合同发送", detail: "启动先建立 command 200 全帧基线，再以 command 204 增量维持 1 Hz；60、120、180 和每 900 帧重开会话并补全帧。" },
    { title: "在动态壁纸上独立组织和控制 HS2 事件", detail: "底层背景由动态壁纸应用负责；透明浮层从本地媒体、命名管道任务、Windows 通知和硬件状态形成最多六张卡。Win+F1 清理可清内容并抑制同一中继内容复活，Win+F2 持久切换时钟。" },
    { title: "由一个看门狗协调电源和恢复", detail: "看门狗拥有启动、睡眠、关机和恢复；先证明旧串口写入者退出。显示器身份或主屏归属变化时先等待 30 秒并确认三屏绑定健康，再通过当前用户 shell 对既有 Wallpaper Engine 做一次 stop/play，不修改拓扑或壁纸设置。" },
    { title: "分层验收并诚实标注", detail: "源码、测试、安装、运行、演示、协议与实体观察分别记录；8c217ead 只升级源码/测试层，实体动态壁纸仍只沿用 2026-08-30 本人历史确认，其余实体情景继续保留真实缺口，不用软件回执替代像素观察。" }
  ],
  components: [
    { name: "公开源码包与 private config（私有配置）", responsibility: "把可公开重建的源码/示例与每台机器的串口、物理网卡、天气、厂商运行文件和 HS2 拓扑绑定分开。", implementation: "公开 ZIP 只允许 config.example.json；config.json、vendor EXE/DLL、out、bin、obj 与设备绑定保持在 Git 外。" },
    { name: "check-runtime.ps1 + startup installer（启动安装器）", responsibility: "在注册登录启动任务前检查 Python、C# 编译器、RJCP、TURZX 运行文件和 stack 入口。", implementation: "缺项即拒绝安装；通过后用 wscript 无窗口父适配器为当前交互用户注册 Highest 任务，并禁用旧并行 Owner。" },
    { name: "metrics_agent.py", responsibility: "提供 127.0.0.1:18765/snapshot 的硬件、网络、磁盘、天气、FPS、前台和健康快照。", implementation: "主指标目标 1 秒；物理公网出口歧义时失败关闭，虚拟接口不重复计数。" },
    { name: "top_processes_helper.py", responsibility: "独立采集进程 CPU / RAM 排行。", implementation: "约 3 秒节拍写有界结果，不阻塞主 snapshot 请求。" },
    { name: "TURZX.SideScreen.Stream", responsibility: "取得快照、渲染 480×1920 位图并发送到机箱屏。", implementation: "完整 HTTP body 有墙钟 deadline（截止时间）；失败时可复用最后一份好快照，PNG 预览异步低优先级生成。" },
    { name: "command 200 / 204 transport（传输层）", responsibility: "在完整基线、1 Hz 增量和周期恢复之间保持明确合同。", implementation: "全帧 10 秒上限、增量 900 ms 上限；首次发送失败即退出给看门狗重建。" },
    { name: "HS2.CrystalOverlay.Core", responsibility: "拥有事件、优先级、寿命、去重、布局和告警规则。", implementation: "不依赖显示器，可用合成数据做确定性单元测试。" },
    { name: "HS2.CrystalOverlay", responsibility: "在唯一非主 2288×1048 显示器上创建透明、鼠标穿透的事件浮层。", implementation: "单实例；找不到精确目标时不回退到主屏。" },
    { name: "GlobalHotkeyCoordinator + GlanceSource", responsibility: "提供 Win+F1 清场与 Win+F2 时钟开关。", implementation: "F1 被占用时只启用精确物理组合的窄回退；时钟状态写入应用本地设置并在重启后继续。" },
    { name: "Publish-HS2Task.ps1 + task pipe（任务管道）", responsibility: "让复制、下载、渲染或安装脚本显式发布标题、详情、进度、预计剩余和结束状态。", implementation: "命名管道逐条接收有界 JSON；同 Id 更新，默认五分钟租约，静默生产者到期自动清卡。" },
    { name: "动态壁纸 / Windows 背景层", responsibility: "在 HS2 浮层下方提供连续背景，动态壁纸应用退出时由 Windows 当前静态背景降级。", implementation: "这是独立显示内容提供者；PC Panel Hub 不修改壁纸资产或设置，也不把背景资源打进仓库。显示拓扑真实变化后只通过既有 wallpaper32 控制客户端请求一次渲染重绑。" },
    { name: "StartSideScreenWatchdog.ps1", responsibility: "统一管理 stream、HS2、电源事件、串口所有权、模式保留、三屏拓扑观察和故障恢复。", implementation: "串口链连续三次失败进入 30 秒熔断；壁纸链使用 15 秒探测、30 秒稳定、900 秒冷却与一次 stop/play 分派，不因一次失败退出长期 Owner 或形成循环重启。" },
    { name: "Windows startup task（启动任务）", responsibility: "在交互用户登录后以 Highest 运行无可见控制台的长期看门狗。", implementation: "wscript 父适配器保持任务 Running；旧 resume 任务被禁用，不形成第二恢复 Owner。" },
    { name: "纯软件测试与 demo", responsibility: "验证指标口径、渲染、HTTP、节拍、浮层布局、恢复合同和公开发布边界。", implementation: "fixture 值和 demo 场景不触碰设备，也不会被标成实体屏证据。" }
  ],
  usageExamples: [
    { moduleSlug: "installation-binding-migration", ask: "新电脑第一次怎么把两块副屏装回来？", effect: "按当前机器重新确认两块屏、串口、网络和天气来源，依赖齐全后才设置自动启动；最后分别验证电脑确实在发送，以及两块实体屏真的显示正确。" },
    { moduleSlug: "installation-binding-migration", ask: "重装 Windows 后能直接复制旧的 HS2 绑定吗？", effect: "旧配置只能作为线索，不能当答案；系统会重新识别眼前的设备和显示拓扑，确认唯一且稳定后才保存，换机时尤其不会照搬旧编号。" },
    { moduleSlug: "serial-transport", ask: "机箱屏是不是又冻住了？", effect: "先确认是不是只有一个程序在写屏、最近是否真的发送成功，再做一次有边界的恢复；最终还要看实体屏上的时钟是否重新跳动。" },
    { moduleSlug: "telemetry-trust", ask: "为什么网络数字和任务管理器不一样？", effect: "确认项目只统计物理公网出口，TUN、Tailscale、Hyper-V 和 VMware 等虚拟接口不会叠加。" },
    { moduleSlug: "telemetry-trust", ask: "没开游戏为什么 FPS 是空的？", effect: "数据新鲜且电脑确实空闲时，屏幕直接显示正在等待游戏帧；若游戏已经在渲染却收不到帧，就明确提示采集异常，不把所有空值都说成正常。" },
    { moduleSlug: "case-panel-rendering", ask: "机箱屏上的长名称把版面挤坏了怎么办？", effect: "长名称会在固定竖屏里换行或有界截断，核心数字和状态仍清楚可读；诊断预览再慢也不会拖住实体屏刷新。" },
    { moduleSlug: "hs2-overlay", ask: "来通知时 HS2 会不会被卡片塞满？", effect: "最多六卡按优先级选择，最新手机通知、活动来电、任务和硬件告警有不同寿命与保留规则。" },
    { moduleSlug: "hs2-overlay", ask: "听网易云时能瞥到当前歌曲和封面吗？", effect: "播放时显示精确匹配的歌名、全部歌手、双语标题与封面，切歌扩展 8 秒；身份有歧义就收起，不按最新缓存猜歌，也不显示没有权威位置源的歌词或进度。" },
    { moduleSlug: "hs2-overlay", ask: "这次 Steam 玩了多久，退出后还能看总结吗？", effect: "用本地清单和进程日志识别本次会话，运行中显示封面、时长与 UTC+8 开始时间，退出总结累计显示 60 个可见秒；不把它说成总账号时长、成就或游戏 FPS。" },
    { moduleSlug: "hs2-overlay", ask: "手机放在一边，插上充电后水冷屏怎么显示？", effect: "它会从两条独立来源里选时间更新的电量和充电状态；手机失联或信息过旧就把卡片收起，不拿台式机电池或旧日志冒充。" },
    { moduleSlug: "hs2-overlay", ask: "同一条手机通知来了两遍，来电和验证码会不会一直留着？", effect: "重复通知只显示一次，不同数字仍保留差异；普通通知和验证码会按各自短寿命收起，来电与传输结束后也不会赖在屏上。" },
    { moduleSlug: "hs2-overlay", ask: "我只想清掉旧通知，不要停掉正在播放和运行中的任务。", effect: "按 Win+F1 清除手机通知、短操作、完成提示和游戏总结；活动媒体、游戏、任务、传输、来电与硬件告警保留，同一中继内容在抑制窗内不会立刻复活。" },
    { moduleSlug: "hs2-overlay", ask: "把这次长复制的进度显示到 HS2，脚本异常退出也别留下死卡。", effect: "复制过程始终更新同一张进度卡；完成或取消会正常收口，脚本突然消失时卡片也会在宽限期后自动退场。" },
    { moduleSlug: "power-recovery", ask: "刚登录，普通窗口已经跑进水冷屏，为什么还要等浮层？", effect: "窗口保护会先把误入小屏的普通应用搬回安全屏，不必等完整浮层启动；这一步不抢焦点，也不改主屏和远程虚拟屏配置。" },
    { moduleSlug: "power-recovery", ask: "睡眠回来副屏为什么没恢复？", effect: "先确认副屏现在究竟处于什么模式，拓扑稳定后只尝试一次恢复；失败就收起旧浮层、保留现场并说明原因，不在同一轮里反复切屏。" },
    { moduleSlug: "power-recovery", ask: "显示器切换回来后 HS2 动态壁纸还在但不动，怎么恢复？", effect: "先确认显示器身份真的变化并已经稳定，再核对三块屏和 HS2 绑定；条件齐全时只让原有动态壁纸重新绑定一次，条件不全就保留静态背景并说明卡在哪。" },
    { moduleSlug: "power-recovery", ask: "A108 或显示端点不见了，物理接线怎么恢复？", effect: "先关机并断开整机电源，再把 OLED USB 主线直连主板 USB 2.0 9-pin 排针或官方 EDGE HUB；随附一分二 Hub 不支持 LCD，供电不足时补 SATA。改线后只在唯一 8091、port 2 controller、port 3 LED 拓扑连续两次健康时重新绑定；这条顺序来自项目合同，本页没有执行实体接线实测。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "PUBLIC main=8c217ead 定义两块屏、数据来源、渲染、协议边界、Win+F1/Win+F2、任务生产者协议、安装/换机，以及以活动显示器/主屏指纹、MTT/HS2 绑定、当前用户 Wallpaper Engine 进程身份、稳定窗和冷却组成的有界恢复。", doesNotProve: "源码已被当前长期进程重新加载、stop/play 已真实分派、壁纸已恢复或实体设备正常。" },
    { layer: "Tests（测试）", proves: "8c217ead 的完整原生检查通过：指标 84、天气 8，以及渲染、HTTP、热键/任务、电源、快捷方式、节拍、运行可靠性与公开 ZIP；PowerWatchdog 还覆盖 HDR-only 不触发、唯一 MTT/Root\\MttVDD、三屏健康、30 秒稳定、900 秒冷却、一次控制分派及禁止修改配置/启动常驻渲染器。", doesNotProve: "真实 topology change（拓扑变化）、当前用户 shell、wallpaper32 stop/play、正在使用的 COM 或实体像素实际恢复。" },
    { layer: "Installation contract（安装合同）", proves: "公开 ZIP 可解包，缺厂商文件时 runtime check 失败关闭，私有配置/绑定不进包，启动任务只在依赖通过后注册；新启动的 watchdog 会从当前源码加载恢复函数。", doesNotProve: "本轮没有重启或重装现有任务，因此不能证明正在运行的 PowerShell 已加载 8c217ead；也不证明另一台电脑、系统重装或新硬件拓扑已完成自然启动和双屏实体 E2E。" },
    { layer: "Runtime（运行）", proves: "11:19 快照观察到任务、唯一 stream、新鲜发送 heartbeat、2288×1048 HS2、wallpaper64 和 HS2 浮层进程同时存在，失败计数为 0；本轮测试开始时生产 heartbeat 仍新鲜。", doesNotProve: "没有拓扑故障注入、重绑日志或进程重载证据；仅凭进程不能证明 8c217ead 已生效、动态壁纸运动、透明像素、通知内容或所有传感器值正确。" },
    { layer: "Demo / render（演示 / 渲染）", proves: "软件能在固定合成数据上生成机箱屏版面，并能用 HS2 场景检查六卡、缺项、重排和长文本。", doesNotProve: "截图来自实体硬件或当前机器现场。" },
    { layer: "Protocol observation（协议观察）", proves: "command 200 全帧和 command 123 亮度路径有本机验证；混合刷新有主机侧有界实现。", doesNotProve: "command 204 是厂商保证的通用协议或有设备 ACK。" },
    { layer: "Physical / Owner observation（实体 / 本人现场观察）", proves: "本人于 2026-08-30 确认显示缓冲区同画面已在 HS2 实体屏生效。", doesNotProve: "不证明 2026-08-31 当前像素、8c217ead 拓扑重绑、1 Hz、冻结恢复、睡眠/唤醒、透明性能或异常断电后的自然启动。" }
  ],
  evolution: [
    { date: "2026-07-04—07-08", commit: "5e552b7–2bafc57", result: "发布 TURZX 机箱屏源码，建立天气、低干扰刷新、睡眠/关机恢复、无闪窗启动和迁移后的真实路径。" },
    { date: "2026-07-22—07-30", commit: "4592994–e7180e3", result: "从简单副屏升级为可信遥测面板：重做 CPU/GPU/网络/磁盘/FPS、修正口径和长帧展示，并加入 HS2 透明浮层。" },
    { date: "2026-07-31—08-06", commit: "fed85f1–e7a5f73", result: "建立 HS2 事件寿命、手机通知、媒体身份、主动任务命名管道、Win+F1 清场、Win+F2 时钟、音量、游戏和六卡自适应布局，使第二块屏从装饰层变成可直接控制的低频事件面。" },
    { date: "2026-08-07—08-12", commit: "dfff40a–699600d", result: "把副屏恢复改成证据驱动：保留现有模式、唯一绑定、一次 Secondary 尝试、串口会话重建、全帧恢复和墙钟 deadline。" },
    { date: "2026-08-14—08-16", commit: "7ea67fd–7dfa5c4", result: "物理公网出口、1 Hz 默认与长期看门狗收敛，连续恢复失败不再让计划任务假成功退出。" },
    { date: "2026-08-23—08-25", commit: "78058b2–271ffd2", result: "进一步自愈 stream watchdog、TimeAudit FPS、HS2 monitor 漂移和 COM7 驱动停滞，同时保持设备操作边界不扩大。" },
    { date: "2026-08-30", commit: "2717ecb", result: "补齐含 HS2 的双屏公开源码包，把天气位置和本机配置移出 Git，增加真实 ZIP 清单/隐私回归并修正文档与示意图口径。" },
    { date: "2026-08-30—08-31", commit: "ebbc1f2–8c217ead", result: "先为 metrics agent 增加 snapshot build lock，让并发快照请求共享同一采样基线；随后补齐显示拓扑变化后的 Wallpaper Engine 有界渲染重绑、唯一 MTT/HS2/主屏健康门、Code 10 失败关闭与无循环恢复，指标回归保持 84 项并扩展电源/恢复测试。" }
  ],
  operationalEntrypoints: [
    { name: "运行依赖检查", command: "pwsh -NoProfile -File .\\scripts\\check-runtime.ps1", purpose: "只读确认 Python、C# 编译器、串口库、厂商运行文件和 stack 入口是否存在。" },
    { name: "安装登录启动", command: "pwsh -NoProfile -File .\\scripts\\install-startup-admin.ps1", purpose: "先跑 runtime check，再为当前交互用户注册 Highest、无可见控制台的唯一长期看门狗；需要管理员 PowerShell。" },
    { name: "撤销启动注册", command: "pwsh -NoProfile -File .\\scripts\\uninstall-startup-admin.ps1", purpose: "移除本项目启动任务，保留源码、合法厂商文件与私有配置，供修正后重装或手动运行。" },
    { name: "登记 HS2 长任务", command: "pwsh -NoProfile -File .\\tools\\hs2_crystal_overlay\\Publish-HS2Task.ps1 -Id copy-photos -Title \"复制照片\" -ProgressPercent 42 -RemainingMinutes 3", purpose: "通过本机命名管道更新任务卡；相同 Id 续报，结束时传 completed 或 cancelled。" },
    { name: "安全回归", command: "pwsh -NoProfile -File .\\scripts\\test.ps1 -SkipStreamWhenRunning", purpose: "生产 stream 已由新鲜 heartbeat 证明运行时，跑纯软件回归并跳过设备写入测试；否则应拆开运行无设备检查。" },
    { name: "查看拓扑恢复状态", command: "Get-Content .\\tools\\turzx_side_screen\\out\\side-screen-watchdog.log -Tail 80", purpose: "查看 Wallpaper Engine 恢复的 Baseline、Stabilizing、WaitForHealth、Cooldown、Rebind 或具名分派失败；日志是主机侧诊断，不是实体壁纸验收。" },
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
    status: "8 月 31 日 84 项指标测试和依赖检查通过；本次只读核对 RTSS/PresentMon 消费状态，未重验实时指标",
    statusTone: "mixed",
    searchAliases: ["为什么网络数字和任务管理器不一样", "没开游戏FPS为什么空", "副屏指标是不是旧数据", "物理公网出口怎么选"],
    searchProjection: {
      intents: ["判断副屏指标是否来自当前可信来源", "解释物理公网速率为什么不叠加虚拟接口", "区分没有游戏帧与FPS采集故障"],
      entities: ["CPU", "GPU", "FPS", "TimeAudit", "物理公网出口", "trust"],
      relations: ["每个值同时绑定来源和新鲜度", "物理公网出口排除隧道与虚拟交换接口", "新鲜无游戏帧是等待状态而不是零"],
      failureRecovery: ["来源歧义时返回空值而不猜数字", "慢来源超时后复用最后好快照并降低可信度", "单字段失败时隔离该字段并保留其他数据"]
    },
    value: "屏幕上的每个数字不仅要“能取到”，还要知道它来自哪里、多久前更新、是不是估算或空闲状态。",
    why: "虚拟网卡叠加、CPU 口径混用、探针陈旧、无游戏帧被写成 0 FPS，都会让漂亮面板给出错误判断。",
    example: "我问“开着 Tailscale 和虚拟机时，这个网速数字还准吗？”系统只认唯一的物理公网出口；如果分不清，就直接显示网络数据不可用，绝不会把几张虚拟网卡相加成一个离谱数字。",
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
      "新鲜且明确 gated_idle 才是正常等待；starting 是启动中，waiting_frames 是有渲染但无匹配帧，缺状态、陈旧和来源错误不能混成空闲。"
    ],
    problem: "解决来源混加、不同口径同名、慢采集阻塞主循环、无值清零和陈旧值冒充实时。",
    implementation: [
      "metrics_agent.py 通过 loopback HTTP 提供有界 snapshot。",
      "top_processes_helper.py 每 3 秒独立采样并写有界 JSON。",
      "物理网络按接口身份筛选，TUN、虚拟化和小型虚拟盘按合同排除。",
      "TimeAudit 只提供可选 FPS 事实，本项目经 PostgreSQL 的 `fact_system_hardware` 读取数值、`fps_capture_status` 与 `fps_capture_detail`，不直接连接或启停 RTSS，也不复制长期数据库。",
      "当前上游先选 RTSS 精确前台、RTSS 最近前台、已启用 Wallpaper 桌面渲染器和唯一新鲜帧；映射不可用才启动 PresentMon 后备。`metrics_agent.py` 把 gated_idle 映射为 idle、starting 映射为 connecting、waiting_frames 映射为 error，并另行核对数据库样本年龄。"
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
      "FPS 来自 TimeAudit 的 RTSS 优先 / PresentMon 后备链；本项目只读其 PostgreSQL 结果，不拥有帧源、RTSS 运行或历史。允许桌面渲染帧时，正 FPS 不自动代表游戏成绩。",
      "进程名和技术指标可公开；具体通知正文和凭据值不进入快照页面。"
    ],
    failures: [
      { condition: "物理公网出口歧义", response: "失败关闭，不叠加多个候选。" },
      { condition: "TimeAudit 样本新鲜且明确为 gated_idle", response: "显示正常等待游戏帧，不用 0 FPS 冒充已取得帧。" },
      { condition: "TimeAudit 返回 waiting_frames、source_unavailable、error、缺采集状态或样本过旧", response: "显示相应采集异常、来源不足或陈旧；不因为数值为 0 就判健康，不由副屏另启帧源。" },
      { condition: "慢来源超过 deadline", response: "使用最后一份好快照并降低 trust，主渲染不等待。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\metrics_agent.py", role: "主 snapshot 与来源可信度" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\top_processes_helper.py", role: "3 秒进程排行" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\test_metrics_agent.py", role: "84 项指标口径、并发快照锁与失败回归" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\architecture.md", role: "数据来源与节拍合同" }
    ],
    verification: [
      "8 月 31 日 test_metrics_agent.py 运行 84 项并通过；本次只读核对当前帧状态映射，没有重跑来源测试。",
      "check-runtime 确认 Python 3.11 与 TimeAudit 读取依赖就绪。",
      "没有逐项对照实体传感器或外部仪表，真实值准确度仍按来源解释。"
    ],
    relation: "安装与换机模块提供当前机私有来源配置；本模块为机箱屏渲染和 HS2 硬件告警提供当前值，TimeAudit 继续拥有长期历史。"
  },
  {
    slug: "case-panel-rendering",
    shortTitle: "机箱屏渲染",
    title: "480×1920 机箱屏的信息密度与流畅渲染",
    teaser: "把可信 snapshot（快照）排成适合竖屏远读的时钟、CPU/GPU、FPS、内存、网络、磁盘和进程卡片，并让慢 HTTP 或 PNG 预览不阻塞真实发送。",
    status: "8 月 31 日 renderer、HTTP pipeline 与 preview 回归通过；gallery 使用合成预览，不是当前实体照片",
    statusTone: "mixed",
    searchAliases: ["机箱屏长文字怎么显示", "480×1920面板怎么渲染", "快照超时屏幕会卡住吗", "PNG预览能证明实体屏吗"],
    searchProjection: {
      intents: ["查看480×1920机箱屏怎样组织信息", "处理长名称空值和慢快照", "判断软件PNG能证明到哪一层"],
      entities: ["480×1920", "Renderer", "GDI+", "snapshot", "PNG preview", "wall-clock deadline"],
      relations: ["渲染器把带可信度的快照变成固定像素位图", "诊断预览与串口主循环解耦", "软件位图不能代替实体像素观察"],
      failureRecovery: ["HTTP body超时后使用最后好快照", "预览编码失败时丢弃预览但继续发送", "构建失败时停止发送而不复用旧二进制"]
    },
    value: "我不用在主屏打开监控窗口，也能一眼看到温度、负载、FPS、网络、磁盘和后台程序。",
    why: "480 像素宽的竖屏很容易字太小、长名称溢出、卡片空洞；预览编码或慢 HTTP 也可能反过来拖住实体刷新。",
    example: "磁盘名字长得快能写一行诗、游戏又没启动时，机箱屏仍会把名称、容量和“正在等待帧”排清楚，不让文字互相打架；电脑上的预览偶尔失败，实体屏照样继续刷新。",
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
    status: "8 月 31 日 Hybrid 1 Hz heartbeat 新鲜且 failed=0；本次不触碰 COM7，当前主机发送与实体更新未重验",
    statusTone: "mixed",
    searchAliases: ["机箱屏是不是冻住了", "1Hz混合刷新", "command 200和204区别", "串口写成功等于屏幕正常吗"],
    searchProjection: {
      intents: ["诊断机箱屏主机发送链是否冻结", "解释1Hz混合刷新为何同时需要全帧和差分", "判断串口成功是否等于实体屏正常"],
      entities: ["command 200", "command 204", "COM", "heartbeat", "one writer", "device ACK"],
      relations: ["command 200建立完整基线而command 204维持有界差分", "唯一写入者拥有目标串口", "主机写入成功不等于设备确认或实体像素正常"],
      failureRecovery: ["旧写入者未退出时拒绝第二个writer", "发送超时后退出worker并由watchdog有界重建", "heartbeat缺恢复基线时判为不健康"]
    },
    value: "主机每秒尝试发送并记录节拍，同时遇到驱动停滞或设备漏掉新会话时补一个完整全帧基线；实体时钟是否真的每秒变化仍靠现场观察。",
    why: "只发全帧约需 2.3 秒，无法做 1 Hz；只发未确认的增量又可能在设备漏帧后永久冻结。",
    example: "机箱屏像是冻住了，系统会先确认旧写入者已经退出，再用一张完整画面重新打底，之后恢复每秒更新。最后仍以实体屏上的时钟重新跳动为准，而不是看到电脑“发送成功”就宣布修好。",
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
      "2026-08-31T11:19:19Z heartbeat frame=2748、sent=2748、period=1000 ms、send_ms=35、failed=0、last_full_frame=2700。",
      "StreamCadence 与 RuntimeReliability 本轮通过。",
      "TestVideoStream 被保护性跳过，实体面板未由本轮写入。"
    ],
    relation: "安装与换机模块先确认当前串口和本地 runtime；本模块接收 renderer 位图，失败由电源与恢复模块处理，实体结果进入分层验收。"
  },
  {
    slug: "hs2-overlay",
    shortTitle: "HS2 事件浮层",
    title: "2288×1048 OLED 的事件优先级、全局控制与任务接入",
    teaser: "在唯一非主 2288×1048 显示器的动态壁纸上，以透明卡片显示媒体、任务、手机、音量、游戏和告警；Win+F1 清场、Win+F2 切换时钟，长任务由发起脚本显式登记。",
    status: "音乐、Steam、双来源电量与通知寿命已按当前源码核对；进程/落点仅保留 8 月 31 日证据，实体动态壁纸为 8 月 30 日历史确认，真实事件未重演",
    statusTone: "mixed",
    searchAliases: ["来通知HS2会不会塞满", "HS2浮层跑到主屏怎么办", "动态壁纸和事件卡是什么关系", "2288×1048六卡布局", "HS2网易云歌名封面", "Steam本次时长退出总结", "手机电量小米妙享手机连接", "HS2来电验证码多久消失", "Win+F1清理HS2通知", "Win+F2关闭HS2时钟", "怎么把长任务显示到HS2", "HS2任务卡片为什么自动消失"],
    searchProjection: {
      intents: ["理解HS2动态壁纸与透明事件卡怎样分工", "查看网易云当前曲目和封面", "查看Steam本次时长及退出总结", "从两条独立中继读取手机电量", "区分普通通知来电传输与验证码寿命", "处理通知过多重复或过期", "用Win+F1清场并保留活动内容", "用Win+F2持久切换时钟", "把复制下载渲染安装任务接到HS2", "防止浮层误落到主屏"],
      entities: ["HS2", "2288×1048", "Wallpaper Engine", "CrystalOverlay", "网易云", "Steam", "小米妙享", "手机连接", "PhoneBatteryArbitration", "PhoneNotificationReconciler", "Win+F1", "Win+F2", "HS2.CrystalOverlay.Tasks", "Publish-HS2Task"],
      relations: ["动态壁纸提供背景而浮层只提供低频事件", "网易云窗口标题与完整播放列表精确匹配后才显示封面", "Steam进程日志形成当前会话与60秒退出总结", "手机电量双源独立探测按证据时间择优", "普通通知60秒验证码15秒来电随活动状态结束", "最多六卡按优先级寿命与去重选择", "Win+F1只清可清内容并抑制同一中继内容复活", "Win+F2切换时钟并把状态保存在应用本地设置", "任务生产者用稳定Id和租约更新同一张进度卡", "目标显示器不唯一时不回退主屏"],
      failureRecovery: ["显示器缺失或多解时停止旧浮层并等待", "单个通知来源异常时隔离该来源", "启动时旧通知只建立基线而不重新弹出", "Win+F1注册冲突1409时只启用物理Win+F1且不带Ctrl或Alt的窄回退", "生产者停止续租时默认五分钟自动清除活动卡", "管道客户端静默或半途断开时限时释放并接受下一次连接"]
    },
    value: "不切走主屏，就能瞥到网易云正在播放的歌名和封面、Steam 这次玩了多久、手机是否在充电，以及真正到来的通知、来电和验证码。动态壁纸继续做背景；事件按自己的寿命收起，我也能一键清场、切换时钟或让主动登记的长任务显示进度。",
    why: "普通通知可能重复、过期或包含占位文字；卡片太多会越过曲面折线，显示器误选还可能把浮层放到主屏。若清场误删来电或正在运行的任务、热键冲突时吞掉其他按键，或生产者异常退出后留下永久任务卡，这块副屏同样会变成干扰源。",
    example: "我说“把这次照片复制进度放到水冷屏上”。屏幕始终更新同一张进度卡，不会一会儿刷出十几张；复制完成后短暂显示结果再收起，脚本半路崩了也会自动清掉死卡。",
    result: "得到动态壁纸背景之上的透明卡片舞台、可预测的来源/寿命/去重规则、不会误伤活动工作的清场键、可持久记忆的时钟开关，以及带失败回收的主动任务接入；找不到精确显示器时仍不显示到主屏。",
    readerStates: {
      pass: "唯一 2288×1048 非主屏与绑定验证通过时创建鼠标穿透浮层；Win+F1 清可清内容、Win+F2 切换时钟，合法任务更新按 Id 与租约投影。",
      problem: "来源陈旧、重复、超长或卡片竞争时去重、滚动、暂停寿命或淘汰低优先级项；热键冲突和静默生产者只降级各自功能。",
      unavailable: "目标显示器不唯一或未验证时不回退主屏；热键注册的非预期错误只记为不可用，非法或超界管道消息被拒绝。"
    },
    decisionImpact: [
      "密集遥测和低频事件分屏，不复制 TimeAudit 或机箱屏。",
      "动态壁纸只提供背景，浮层只提供信息；任一方退出不会伪装成另一方故障。",
      "听网易云时，歌名、全部歌手、封面和双语标题在播放期间紧凑常驻，切歌扩展 8 秒；窗口标题与播放列表不能精确对应就暂时隐藏，暂停或退出后收起，绝不按预加载缓存猜当前歌曲。",
      "启动 Steam 游戏后可看本次会话时长、封面与 UTC+8 开始时间；退出后总结累计可见 60 秒。它回答‘这次玩了多久’，不冒充账号总时长、游戏 FPS、成就或非 Steam 通用识别。",
      "手机放在一旁时，电量和充电状态无底板常驻并微位移防烧屏。小米妙享和手机连接始终各自探测；同等新鲜优先小米，手机连接证据明显更新时选后者。断开、无有效数据或确认过旧就隐藏，不让旧日志和台式机电池制造假在线。",
      "普通通知和动态状态最多显示 60 个真正可见秒，连接提示 5 秒；启动时普通旧消息只建基线，仍活动的来电/传输可恢复，并在源结束或持续失联 5 分钟后收起。最新三条手机通知按到达顺序保留，第四条淘汰最旧，最新一条不会被其他普通卡挤掉。",
      "同一消息经小米妙享和手机连接错峰转发时只保留一张，数字不同仍保留区别。明确验证码语义才放大最新 4–8 位数字，显示 15 个可见秒；新码原位替换旧码，同码重复不续命，不把订单号、取件码、手机号或日期误当验证码。",
      "最多六卡且只为真实内容占位；少量内容贴底收拢。",
      "硬件告警、来电和活动传输优先；音乐、游戏与最新手机通知在普通压力下保留。除即时音量卡外，计时卡被挤出时暂停可见计时，但超过三分钟墙钟寿命后不再复活；验证码另算通知配额，仍受全局六卡限制。",
      "通知来源独立采集、标准化去重，验证码只在明确语义下识别且不写日志。",
      "Win+F1 清除手机通知、验证码、短操作、完成提示、游戏总结和恢复提示，但保留活动媒体、游戏、任务、传输、来电与硬件告警；同一中继内容在抑制窗内不复活。",
      "Win+F2 只切换中国标准时间的 HH:mm 时钟；状态写入应用本地设置，重启后继续，Win+F3/F4 不占用。",
      "只有 Win+F1 注册返回冲突 1409 时才启用低级键盘窄回退；它只处理真实键盘的 Win+F1 且要求不带 Ctrl/Alt，并从按下到抬起只触发一次。Win+F2 不安装广域回退。",
      "主动任务必须由生产者显式发布 Id、Title、可选 Detail/ProgressPercent/RemainingMinutes 与 active/completed/cancelled，不扫描系统进程猜任务。",
      "活动任务默认五分钟租约；同 Id 进度续报自动续租，重开先清旧完成提示，completed 显示 15 秒完成卡，cancelled 清除两种状态，异常退出后自动收卡。",
      "浮层不修改壁纸、主屏、远程虚拟屏或 Windows 原生鼠标边界。"
    ],
    problem: "解决双屏重复、空卡、通知风暴、旧通知复活、验证码误识别、超长文本、目标显示器误选、清场误伤活动工作、热键冲突扩大以及长任务卡永久残留。",
    implementation: [
      "Core 项目拥有事件、优先级、寿命、去重、布局与告警纯逻辑。",
      "WinUI 3 应用创建逐像素透明、无激活、鼠标穿透窗口。",
      "Wallpaper Engine 或 Windows 当前背景负责底层画面；浮层不连接或修改其设置。",
      "`NeteaseLocalMediaProbe` 读取窗口标题、完整 playing list（播放列表）与音频会话；只在同歌名/全部歌手的精确候选内用歌词缓存新鲜度消歧。`MediaSessionSource` 发布 MediaActive 与 8 秒 MediaTrackChange，按曲目 URI 异步缓存封面，ArtworkGenerationGate 阻止上一首的迟到封面覆盖当前曲目。",
      "`SteamGameSource` 从本地 appmanifest 清单和 gameprocess_log.txt 匹配仍存活的 Steam 会话；`SteamGameTracking` 解析日志本地时区和夏令时，显示统一 UTC+8。运行卡随本次起点计算时长，结束后生成独立 GameSummary；OverlayPolicies 规定 60 个可见秒，封面异步完成也必须仍属于同一会话。",
      "`PhoneBatterySources` 每 5 秒同时启动小米妙享与手机连接探测，各自有 2 秒超时及 single-flight（单飞）保护。小米读界面与近期日志、手机连接读伴随文件与界面；PhoneBatteryProbeReadingCache 分开 ObservedAt（来源证据时间）与 ConfirmedAt（最近确认时间），重复读旧日志不会刷新证据时间。",
      "`PhoneBatteryArbitration` 先排除未连接、越界或确认超过 15 秒的读数，再比较证据时间：小米不比手机连接旧超过 15 秒时优先小米，否则选择更新的手机连接。小米界面电量可合并近期日志充电趋势；一个探测故障不阻断另一个，只有均不可用才收起电量。",
      "`PhoneNotificationSource` 通过 Windows UserNotificationListener 读取小米妙享和手机连接实际通知；`PhoneNotificationReconciler` 按 ID 对账活动状态、启动基线与移除事件，并为来电/传输保留 5 分钟安全租约。PhoneNotificationClassification 规范 Unicode、空白和标点后跨源近似去重，数字序列不同不合并。",
      "`PhoneVerificationCodeDetector` 要求验证码/OTP（一次性密码）上下文并排除非验证码数字；固定验证码事件 ID 让新码原位替换，同码去重不重置寿命。OverlayPolicies 定义普通/动态 60 秒、连接 5 秒、验证码 15 秒；OverlayScheduler 累计真实可见时间、限制最新三条通知与三分钟墙钟队列，不把正文或验证码写日志。",
      "音量来自 Windows 默认音频端点变化，显示 6 秒且不带设备名；U 盘和网络事件显示 12 秒，网络断开需连续确认。硬件告警来自 TURZX/LHM，异常常驻、恢复提示 10 秒；这些来源与媒体、Steam、任务和手机各自隔离。",
      "GlobalHotkeyCoordinator 优先 RegisterHotKey；只有 Win+F1 的 1409 冲突进入低级键盘 hook（钩子），手势状态机过滤注入按键、Ctrl/Alt 和重复 keydown。",
      "GlanceSource 把 GlanceVisible 写入 ApplicationData 本地设置；默认显示 HH:mm，启动、解锁和每个整分钟边界刷新。",
      "OverlayScheduler 的 ClearDismissible 只移除可清类型，并按内容指纹保存至少 10 秒、手机中继 3 分钟的抑制状态。",
      "Publish-HS2Task.ps1 把有界 JSON 写入 `HS2.CrystalOverlay.Tasks`；协议层校验 Id、字段类型与范围，投影层管理活动/完成身份，租约表每 5 秒清理超时任务。",
      "max-six、sparse、reflow、overflow 等 demo 使用合成数据。"
    ],
    flow: [
      "发现并验证目标显示器。",
      "从每个本地 adapter 和任务命名管道形成事件候选。",
      "任务生产者用稳定 Id 上报 active；进度续报刷新租约，completed 或 cancelled 明确收口。",
      "标准化、去重并应用来源新鲜度。",
      "按优先级、寿命和六卡上限选择。",
      "布局到曲面安全区域并透明显示。",
      "Win+F1 只清可清内容并建立复活抑制；Win+F2 只切换并保存时钟状态。",
      "事件结束、租约到期或显示器失效后收起。"
    ],
    concepts: [
      { term: "event lifetime（事件寿命）", explanation: "卡片实际可见的累计时间；被高优先级挤出时可暂停。" },
      { term: "pixel alpha（逐像素透明度）", explanation: "只有卡片和文字参与合成，不建立黑色全屏底板。" },
      { term: "display binding（显示器绑定）", explanation: "用尺寸、主/副属性和已保存拓扑锁定目标 OLED，而不是猜 DISPLAY 编号。" },
      { term: "dismissal suppression（清场抑制）", explanation: "清掉一条可清内容后，在有界时间内按同一内容身份拒绝中继重复投递；真正不同的新内容仍可显示。" },
      { term: "task producer protocol（任务生产者协议）", explanation: "发起长任务的脚本通过命名管道显式声明 Id、标题、详情、进度、预计剩余、状态和租约。" },
      { term: "lease sweep（租约清理）", explanation: "浮层每五秒检查活动任务；超过默认五分钟未续报就移除卡片，避免异常生产者留下死状态。" }
    ],
    boundaries: [
      "通知正文和验证码属于本机显示内容，不进入公开仓库或网站样图。",
      "动态壁纸由独立应用提供；当前现场截图中的市场场景作者与公网再发布许可为 Unknown，不声称用户拥有或原创。纯软件 demo 继续使用项目可证明的合成背景。",
      "网易云当前无权威播放位置，因此不显示歌词、进度条和已播/总时长；保留的 HS2.NeteasePlaybackBridge 只是未启用的兼容与诊断工程，不属于当前浮层运行链。歌词缓存仅用于精确候选消歧，不代表歌词已经显示。",
      "手机链只接收 Windows 通知中心实际提供的两条中继来源，不等于手机全部通知或手机全库；双源电量是证据择优，不是两个值取平均或界面永远优先。",
      "Steam 成就和非 Steam 游戏通用识别尚未实现。",
      "Win+F1 的窄回退只在注册冲突 1409 时启用；注入按键、没有 Win、带 Ctrl/Alt 的 F1 全部透传，其他注册错误不扩大拦截。Win+F2 注册失败时只记录不可用。",
      "任务管道是本机显式生产者入口，不是权限通道、远程 API 或通用进程监视器；单行最多 64K 字符，Id 最多 128 个安全字符，标题最多 256、详情最多 1024。"
    ],
    failures: [
      { condition: "目标显示器缺失或多解", response: "不在主屏创建窗口，等待唯一目标。" },
      { condition: "单个通知来源异常", response: "继续检查另一来源，不让一条链短路全部手机状态。" },
      { condition: "普通旧通知在启动时存在", response: "只建立基线，不翻出旧消息；活动来电/传输可恢复。" },
      { condition: "网易云标题/全部歌手无法精确匹配或存在无法消解的版本歧义", response: "隐藏媒体卡片，保留未匹配/歧义状态；不以最新缓存、预加载歌曲或迟到封面填空。" },
      { condition: "Steam 清单、进程日志或本次起点不能确认", response: "不虚构当前游戏和时长；没有足够结束证据时不凭缺项制造总结，成就和非 Steam 识别继续明确未接入。" },
      { condition: "小米妙享或手机连接探测超时", response: "两条链继续独立；短暂失败可保留尚新鲜的最近确认值，超时本身不刷新证据时间。两源都失联或过旧时隐藏电量。" },
      { condition: "普通通知重复、同 ID 更新或同验证码跨源重发", response: "按内容和 ID 去重且不重置原寿命；数字不同保留为不同通知，新验证码才在固定位置替换并重新计时。" },
      { condition: "来电/传输通知已移除或通知访问持续失联", response: "源移除时结束活动卡；失联最长 5 分钟后收起，不永久占卡。" },
      { condition: "Win+F1 已被其他程序注册", response: "仅在错误 1409 时启用真实键盘 Win+F1 且不带 Ctrl/Alt 的窄回退；按下一次触发、重复按下不重触发、抬起后释放，注入按键和冲突组合透传。" },
      { condition: "Win+F2 或非冲突型热键注册失败", response: "记录具体错误并只关闭该快捷键，不安装会吞掉其他按键的广域 hook。" },
      { condition: "任务 JSON 非法、超界、客户端静默或半途断开", response: "非法消息不发布；读取一秒超时且单行最多 64 KiB，断开的管道立即重开，意外服务错误记录后退避一秒。" },
      { condition: "任务生产者异常退出或同 Id 重开", response: "无续报时默认五分钟租约到期自动清卡；同 Id 重开先清旧完成提示，再显示新的活动进度。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\NeteaseLocalMediaSource.cs", role: "网易云窗口/播放列表精确身份、音频状态与候选消歧" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\MediaSessionSource.cs", role: "播放/切歌卡与防迟到封面覆盖" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\SteamGameSource.cs", role: "Steam 清单、进程日志、本次时长、UTC+8 与退出总结" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\PhoneBatterySources.cs", role: "双电量探测器、独立超时与缓存确认" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\PhoneBattery.cs", role: "证据时间、连接有效性与双源仲裁" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\PhoneNotificationSource.cs", role: "Windows 双中继通知与五分钟活动安全租约" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\PhoneNotificationReconciler.cs", role: "启动基线、活动结束、去重与固定验证码卡" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\OverlayPolicies.cs", role: "媒体、游戏、手机各类可见寿命与优先级" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\OverlayScheduler.cs", role: "事件、优先级和寿命调度" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\OverlayDeckLayout.cs", role: "六卡与曲面安全布局" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\GlobalHotkeyCoordinator.cs", role: "Win+F1/F2 注册、冲突处理和窄回退" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\GlobalHotkeyGestureState.cs", role: "物理 Win+F1 一次触发、注入过滤和按键透传状态机" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\GlanceSource.cs", role: "HH:mm 时钟、整分钟刷新与持久可见状态" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\Publish-HS2Task.ps1", role: "主动任务命名管道生产者入口" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay.Core\\ImportantTaskProtocol.cs", role: "任务 JSON 字段、类型、范围和状态校验" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\ImportantTaskSource.cs", role: "任务管道、默认租约、到期清卡和失败隔离" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\src\\HS2.CrystalOverlay\\App.xaml.cs", role: "WinUI 应用、显示选择和本地 adapter" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\hs2_crystal_overlay\\tests\\HS2.CrystalOverlay.Tests", role: "事件、清场抑制、热键手势、任务协议/租约/管道、时间和布局测试" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\hs2-crystal-overlay.md", role: "产品行为、演示场景和实体验收" }
    ],
    verification: [
      "源码列出 max-six 等 15 类纯软件 demo 场景，并明确全部使用合成数据。",
      "当前 main 的 GlobalHotkeyGestureStateTests 与 OverlaySchedulerTests 覆盖物理 Win+F1 一次触发、注入/冲突组合透传、活动媒体/游戏/任务/来电/传输/告警保留及同一手机中继内容不复活；项目原生整套检查于本轮快照中通过。",
      "ImportantTaskProtocolTests、ImportantTaskProjectionTests 与 BoundedLineReaderTests 覆盖明确进度单位、completed/cancelled、同 Id 重开、五分钟租约续报、并发到期、静默客户端超时和下一客户端恢复；本轮未用真实生产任务做用户可见 E2E。",
      "2026-09-02 只读核对 NeteaseLocalMedia、SteamGameTracking、PhoneBattery、PhoneNotificationReconciler、PhoneNotificationClassification 与 OverlayScheduler 对应源码/测试定义；本次没有重跑这些来源测试，也没有读取真实媒体、手机电量或通知。",
      "8 月 31 日历史回读曾确认 2288×1048 HS2、wallpaper64 和 HS2.CrystalOverlay 同时在线及浮层落点；实体动态壁纸只沿用 2026-08-30 本人历史确认，没有读取通知正文。",
      "实体动态壁纸本轮未重验；透明合成性能、全部事件寿命、真实 Win+F1/Win+F2、生产任务异常退出、睡眠与异常重启恢复也仍未重演。"
    ],
    relation: "安装与换机模块先建立本机 HS2 绑定；本模块读取指标异常、接收显式任务并管理用户控制，与电源恢复模块共享显示器模式边界，但不依赖机箱屏渲染。"
  },
  {
    slug: "installation-binding-migration",
    shortTitle: "安装、绑定与换机",
    title: "从干净源码到双副屏本机安装态",
    teaser: "把 clean clone（干净克隆）、合法取得的厂商运行文件、每台机器自己的串口/物理网卡/天气配置和双屏绑定按顺序组装；依赖未齐时不装启动任务，主机通过后仍单独看实体像素。",
    status: "源码安装合同与 8 月 31 日公开 ZIP/主机证据保留；本次未刷新安装态，clean clone（干净克隆）、换机和重装 E2E 未执行",
    statusTone: "mixed",
    searchAliases: ["新电脑第一次怎么装双副屏", "换机后怎么恢复PC Panel Hub", "重装Windows后副屏怎么重新绑定", "config.json为什么不进Git", "厂商TURZX文件放在哪里", "计划任务怎么安装", "旧HS2绑定能不能复制", "clean clone怎么验收"],
    searchProjection: {
      intents: ["从公开源码在新电脑安装双副屏", "重装Windows后恢复本机配置和启动任务", "判断哪些厂商文件和私有配置不能进Git", "重新绑定TURZX串口与HS2显示拓扑", "区分主机安装通过与实体像素通过", "失败后撤销启动任务或使用兼容回退"],
      entities: ["clean clone", "config.example.json", "config.json", "RJCP.SerialPortStream.dll", "TURZX.exe", "check-runtime.ps1", "TURZX SideScreen task", "HS2 topology binding"],
      relations: ["公开源码只提供可重建代码而厂商运行文件由安装者合法取得", "config.example复制为ignored config后才填写串口物理网卡和天气", "runtime check通过先于启动任务注册", "TURZX绑定实际串口而HS2绑定唯一8091与AD23和LED拓扑", "换机重新发现设备身份而不复制旧实例号", "主机进程心跳与实体像素观察分层验收"],
      failureRecovery: ["厂商运行文件或编译运行依赖缺失时不安装任务", "串口网卡或天气未确认时修正私有config而不改公开示例", "HS2拓扑缺失歧义或不连续时保持未绑定", "启动任务路径错误时卸载后用正确Root重装", "Hybrid不兼容时显式退回三秒command200而不自动降级", "没有换机或自然启动实测时保留Unknown"]
    },
    value: "换电脑、重装系统或重新布线时，我能从公开仓库重建一套属于当前机器的双副屏安装，而不用复制旧路径、旧串口和旧硬件实例号，也不会为了方便把私人配置或厂商二进制塞回 Git。",
    why: "源码能构建不代表本机能运行；公开仓库故意不带厂商程序、真实天气位置、物理网卡、串口和 HS2 绑定。若跳过依赖检查或照搬旧机器身份，计划任务可能指向错误路径、抢错 COM，或让浮层绑定到不确定显示器。",
    example: "我说“这台新电脑也要用上两块副屏”。安装过程会重新识别当前串口、网卡、天气位置和显示器，不照抄旧机器编号；最后我会亲眼看到机箱屏在更新、水冷屏落在正确位置，确认后它们才随登录自动启动。",
    result: "我得到一套可解释、可撤销的本机安装态：公开源码保持干净，私人值与厂商文件留在本机；启动任务只在依赖完整后注册，两块屏各自有明确绑定，源码/测试/运行/实体像素和自然启动不会被混成一个 PASS。",
    readerStates: {
      pass: "源码包、合法本机依赖、私有配置、TURZX 串口、HS2 唯一拓扑、启动任务和分层验收都通过时，才把当前机器记为完整安装。",
      problem: "缺依赖、路径漂移、旧绑定、设备歧义或 Hybrid 不兼容时停在对应层，修正配置/绑定或显式回退后重验，不靠重启整机碰运气。",
      unavailable: "无法合法取得厂商运行文件、无法唯一识别串口/HS2 拓扑或没有实体观察条件时，不安装或不升级对应结论；保留源码可用与实体 Unknown。"
    },
    decisionImpact: [
      "clean clone 只带公开源码、文档、脚本、测试和无真实值示例；厂商 EXE/DLL、私有 JSON、out/bin/obj、日志和设备绑定不属于 Git 交付。",
      "RJCP.SerialPortStream.dll 与 TURZX.exe 或 TURZX.weatherfix.metrics.exe 必须由安装者从有权使用的来源取得，并放在仓库根；项目不代为分发。",
      "config.example.json 只能作为模板；复制成 ignored config.json 后再填写当前 serial.port、network.publicInterface 与 weather 经纬度，换机不沿用旧值。",
      "check-runtime 只读检查 Python、按需 psutil/asyncpg、csc.exe、RJCP、TURZX 运行文件和 StartSideScreenStack；任一必需项缺失时安装器拒绝注册任务。",
      "TURZX 绑定当前真实串口并在实机写入前确认唯一健康设备；COM7 只是本机默认，不是迁移常量。",
      "HS2 重新发现唯一健康 8091 Hub、port 2 控制器、port 3 LED、AD23 与 MI_00 显示接口；只有连续两次健康才保存新的 ignored 拓扑绑定并启用浮层。",
      "启动任务属于当前交互用户，以 Highest 在登录时由 wscript 无窗口启动唯一长期 watchdog；旧 stock 任务被禁用而非删除，旧 Resume Owner 不得与新 watchdog 并存。",
      "验收顺序固定为源码/公开包、runtime check、配置与绑定、任务/进程/heartbeat、TURZX 实体像素、HS2 实体背景与浮层、睡眠恢复和异常断电后的自然启动；前一层不能替后一层。"
    ],
    problem: "解决公开源码缺少本机私有运行态、换机误复制硬件身份、厂商文件误入 Git、依赖未齐先装任务、旧路径残留、双屏只验进程不验像素，以及安装失败后没有清晰回退的问题。",
    implementation: [
      "build-release.ps1 从源码构建 ZIP，只纳入 README、AGENTS、LICENSE、docs、scripts 与三套 tool source；测试会解包核对 HS2 源码和公开清单。",
      "发布规则只允许 tools/turzx_side_screen/config.example.json 这一份配置示例；真实 config.json、weather local JSON、out、bin、obj、AppPackages、厂商 EXE/DLL 和生成预览全部排除。",
      "config.json 保存当前机 serial、480×1920 刷新、loopback metrics、天气、时区、物理公网接口与 UI 选项；天气也可从显式私有路径或成对环境变量注入，未填坐标时失败关闭。",
      "check-runtime.ps1 发现合适 Python 与 C# 编译器，核对 RJCP/TURZX 文件和 stack 入口，并返回 ready/missing；TimeAudit 凭据存在时才要求 Python 同时具备 psutil 与 asyncpg。",
      "StartSideScreenWatchdog.ps1 在 ignored out 中维护 hs2-usb-topology-binding.json；新机器或改线后由健康拓扑生成，旧绑定不作为跨机事实。",
      "install-startup-admin.ps1 先调用 runtime check，再把已解析 Root、Port、Interval 与 Hybrid 模式写进计划任务动作；wscript 父适配器保持无窗口长期运行。",
      "uninstall-startup-admin.ps1 可移除主任务与旧 Resume task；安装器只禁用旧 stock 任务而不删除，Hybrid 不兼容时另有显式 command-200 三秒兼容模式。",
      "验收记录把当前主机运行证据和新机/重装 E2E 分开；没有摄像头或设备 ACK 时，以人工观察两块实体屏和自然启动作为最后一层。"
    ],
    flow: [
      "从 PUBLIC main 或公开源码 ZIP 建立 clean clone。",
      "从合法来源把 RJCP 串口库与 TURZX 运行程序放到仓库根。",
      "复制 config.example.json 为 ignored config.json，填写当前串口、物理公网接口和天气；不改公开模板。",
      "运行 check-runtime，缺项时停止且不注册启动任务。",
      "确认 TURZX 当前实际串口与唯一设备身份，再做主机侧渲染/发送检查。",
      "让 HS2 进入当前可用模式，核对唯一 8091、port 2 controller、port 3 LED、AD23/MI_00 与非主 2288×1048 显示器；连续两次健康后保存绑定。",
      "在 HS2 目标显示器选择 Wallpaper Engine 背景或 Windows 静态背景；浮层本身不复制或修改壁纸资产。",
      "以管理员 PowerShell 安装当前交互用户的登录任务，并回读任务动作、Root、Highest 与唯一 watchdog。",
      "检查 runtime、唯一进程、heartbeat、HS2 落点和公开安全边界。",
      "分别观察 TURZX 实体时钟/像素、HS2 背景/透明浮层，再按需要验睡眠恢复与异常断电后的自然启动。"
    ],
    concepts: [
      { term: "source package（源码包）", explanation: "能公开克隆、构建和检查的代码/文档集合，不包含一台机器的可执行依赖、配置、绑定或运行输出。" },
      { term: "private config（私有配置）", explanation: "由 config.example.json 派生、被 Git 忽略的当前机串口、物理网卡和天气等值；可备份但不能公开提交。" },
      { term: "machine binding（机器绑定）", explanation: "当前电脑上 TURZX 串口与 HS2 Hub/controller/LED/display 的实际身份关系；换机或重接后必须重新发现。" },
      { term: "runtime gate（运行依赖门）", explanation: "check-runtime 返回 ready 前不允许安装启动任务，避免把缺依赖的路径变成开机故障。" },
      { term: "layered acceptance（分层验收）", explanation: "源码、测试、安装、进程/heartbeat、实体像素、睡眠恢复和自然启动分别给结论，不能互相替代。" }
    ],
    boundaries: [
      "厂商 TURZX 程序、RJCP 二进制和 Wallpaper Engine 场景必须从安装者有权使用的来源取得；PUBLIC 仓库与源码 ZIP 不重新分发。",
      "config.json、天气坐标、物理网卡名、TIMEAUDIT 凭据、设备拓扑绑定、日志和生成输出保持在 Git 外；公开示例继续为空值。",
      "旧机器的 COM7、DISPLAY 编号、8091/AD23/LED 实例号和任务 Root 都不是新机器事实；迁移必须重新发现并回读。",
      "内部 USB 排针改线属于实体操作，必须关机并断开整机电源；安装页面不会把源码接线说明写成已完成实测。",
      "安装启动任务需要管理员 PowerShell，会改变当前用户的 Task Scheduler；网站刷新和本模块证据采集保持只读。",
      "当前主机健康、公开 ZIP 回归或 source contract 都不能证明另一台机器、重装系统、睡眠或异常断电后的真实 E2E。"
    ],
    failures: [
      { condition: "Python、csc、RJCP、TURZX 运行文件或 stack 入口缺失", response: "check-runtime 返回具体 missing 且非零退出；安装器立即停止，不留下半注册启动任务。" },
      { condition: "私有串口、物理网卡或天气值仍是旧机器内容", response: "保留公开示例不动，在 ignored config.json 中重新发现并填写；天气坐标缺失时 shim 失败关闭，不回落作者位置。" },
      { condition: "TURZX 串口不唯一或旧 writer 仍占用", response: "不启动第二个 writer，不把 COM7 当常量；先确认当前设备身份和旧 Owner 退出。" },
      { condition: "HS2 绑定缺失、歧义或只出现 A108 Boot ROM", response: "不复制旧绑定、不发送模式命令；等待唯一完整拓扑，并在 AD23/MI_00 与 LED 连续两次健康后再保存。" },
      { condition: "启动任务 Root、参数或安装结果错误", response: "运行 uninstall-startup-admin.ps1 撤销本项目任务，修正路径/配置并重新通过 runtime check 后再安装；不并行启用旧 Resume Owner。" },
      { condition: "1 Hz Hybrid 在目标 TURZX 上不兼容", response: "显式使用 `-HybridRefresh:$false` 回到已验证 command 200 三秒兼容模式；不把自动降频当修复成功。" },
      { condition: "主机检查通过但实体画面未更新", response: "把问题留在实体/设备层，不升级 PASS；观察真实 TURZX 时钟和 HS2 背景/浮层，必要时交给串口或电源恢复模块。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\README.md", role: "clean clone、本机配置、厂商运行文件、启动任务与实体验收总入口" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\release.md", role: "公开源码包包含/排除与合法本地 runtime 边界" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\config.example.json", role: "无真实值的 serial/network/weather 安装模板" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\check-runtime.ps1", role: "Python、csc、RJCP、TURZX 与 stack 的只读 ready/missing 门" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\install-startup-admin.ps1", role: "Highest 登录任务、Root/Port/Hybrid 参数与旧任务收口" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\uninstall-startup-admin.ps1", role: "启动任务撤销与重装前回退入口" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\startup.md", role: "双屏启动、HS2 绑定、任务动作、模式回退与分层验收合同" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\HS2ActiveRecoveryPolicy.ps1", role: "唯一 8091/AD23/MI_00/LED 拓扑发现、读取与原子绑定规则" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\test-public-release.ps1", role: "fresh ZIP 解包、缺厂商 runtime 失败和私有/二进制排除回归" }
    ],
    verification: [
      "8 月 31 日 PUBLIC main=8c217eadf76e6849c382c909b407d9dc436f9005，本地 HEAD、origin/main 与实时远端 main 当时一致且源工作树干净；该次公开发布测试构建并解包 ZIP，确认 config.example、双屏源码和安装脚本存在，厂商二进制、本机 JSON 与生成目录不存在。",
      "2026-08-31T11:19:19Z 当前主机 check-runtime 为 ready、missing=0，TURZX SideScreen 任务为 Running/Highest，唯一 stream 与新鲜 Hybrid heartbeat 存在；这些只证明现有安装态。",
      "当前源码的 runtime checker 回归同时验证：缺 RJCP/TURZX 时失败，补齐要求的 runtime 与 stack 后才 ready；安装器自身也会在注册任务前调用该门。",
      "本轮没有在 clean clone、另一台电脑或重装后的 Windows 上重建 private config、重新绑定两块屏、安装任务并完成自然启动；TURZX 与 HS2 实体像素、睡眠/恢复和异常断电验收保持 Unknown。"
    ],
    relation: "本模块把公开源码变成当前机器可运行的前置安装态，为指标、渲染、串口和 HS2 浮层提供私有配置与双屏绑定；安装完成后的睡眠、冻结、端点消失和运行期自愈仍由电源恢复模块负责。"
  },
  {
    slug: "power-recovery",
    shortTitle: "电源与自愈",
    title: "启动、睡眠、关机、显示拓扑与有界自愈",
    teaser: "由一个长期 watchdog（看门狗）协调两块屏：保留已成功枚举的模式、证明旧 owner 退出、限制 Secondary 尝试；显示器身份或唯一主屏归属变化后，只有目标三屏与背景进程身份都健康，才让既有 Wallpaper Engine 做一次有界渲染重绑。",
    status: "7144da5 的前置窗口保护与保留模式已只读核对；8c217ead 测试/任务为 8 月 31 日基线，本次未启动 watchdog、触发恢复、控制壁纸或操作 USB",
    statusTone: "mixed",
    searchAliases: ["A108端点不见了怎么接线", "随附一分二Hub能不能带LCD", "OLED供电不足要接SATA吗", "8091端口2控制器端口3LED", "改接线后为什么要连续两次健康", "睡眠回来副屏没恢复", "显示器切换后动态壁纸不动", "Wallpaper Engine怎么有界重绑"],
    searchProjection: {
      intents: ["恢复A108或显示端点缺失后的物理链路", "判断OLED应该接主板排针还是Hub", "在改线后重新确认唯一控制器和LED拓扑", "处理睡眠唤醒与显示漂移", "在三屏身份变化后恢复HS2动态壁纸"],
      entities: ["A108", "USB 2.0 9-pin", "EDGE HUB", "SATA", "8091", "DISPLAY\\MTT1337", "wallpaper64与wallpaper32", "explorer user shell"],
      relations: ["随附一分二Hub不支持LCD而官方EDGE HUB可承载目标链路", "供电不足时由SATA补充供电", "只有唯一8091与port 2 controller和port 3 LED拓扑连续两次健康才重新绑定", "活动显示器设备名和主屏归属共同形成拓扑指纹", "唯一MTT后端与HS2 Secondary绑定健康后才允许壁纸重绑", "当前会话wallpaper64定位同目录wallpaper32并由explorer shell分派stop/play"],
      failureRecovery: ["端点缺失时先关机断电再检查物理接线", "拓扑歧义或健康检查不连续时保持未绑定", "HDR波动和未改变活动屏身份的DXGI波动不触发壁纸恢复", "控制客户端或用户shell缺失时记录具名状态并停止", "失败分派消费本次拓扑事件且不形成stop/play循环", "实体恢复未执行时保留Unknown而不拿源码或进程冒充"]
    },
    value: "刚登录时，即使完整 HS2 浮层还在等设备验证，误入水冷屏的普通应用也能先被搬回安全屏，不必卡在那里等启动结束。后续副屏异常只修受影响链路：串口有熔断、HS2 模式有 epoch（周期）边界，动态壁纸只在真实三屏变化稳定后重绑一次。",
    why: "电源事件和设备重枚举容易产生双 watchdog、串口未释放、Windows 窗口被困小屏或每几十秒重建 GPU 拓扑。主屏、HS2 或 MTT 虚拟屏断开再回来时，Wallpaper Engine 进程还在也不等于它已把现有场景重新绑定到新的显示渲染面；只看进程会把静止或黑色背景误判为健康。",
    example: "远程虚拟屏退出又回来后，HS2 浮层位置没错，动态壁纸却像一张海报一样不动了。看门狗会先等显示拓扑稳定并确认三块屏身份都对，再让原来的壁纸重绑一次；条件少一项就不折腾屏幕，只保留静态背景并写清原因。",
    result: "满足条件时，用户应看到原有 Wallpaper Engine 场景在 HS2 透明浮层下恢复渲染，而不需要打开 GUI、重选壁纸或改显示布局；主机日志会给出 Baseline、Stabilizing、WaitForHealth、Cooldown、Rebind 或具体分派失败。条件不全时保持现状和 Windows 静态背景降级；源码/测试已证明决策合同，但本页没有真实触发 stop/play 或完成实体恢复 E2E（端到端验证）。",
    readerStates: {
      pass: "首次健康观察只建立壁纸拓扑基线；之后指纹真的变化、稳定满 30 秒、三屏/MTT/HS2 绑定健康且离上次分派至少 900 秒时，只分派一次 stop/play 并记录结果。任务、精确进程、heartbeat、控制器模式与绑定仍分别验收。",
      problem: "拓扑仍在变化或任一绑定不健康时等待；串口假活进入熔断；Wallpaper Engine 分派失败时消费本事件、保留现有配置并停止紧密重试，避免把一次恢复变成循环闪屏。",
      unavailable: "控制器、端点、唯一 MTT 后端、当前会话 wallpaper64 路径、同目录 wallpaper32 或 explorer shell 缺失时不执行壁纸控制。需要物理处理则明确要求先关机断电；需要恢复壁纸时仍可使用 Wallpaper Engine 自身用户控制，系统静态背景继续是视觉降级。"
    },
    decisionImpact: [
      "只有一个长期 watchdog 处理 resume；旧事件任务保持禁用。",
      "普通窗口保护和完整浮层启动是两道门：前者在识别到 2288×1048 目标后即可执行，不等控制器、浮层进程或完整三屏验证；后者仍要求 Secondary 模式与保存绑定连续两次健康，不能把已搬回窗口当成 HS2 Active。",
      "登录启动的前 180 秒用独立 250 ms 窗口保护循环覆盖阻塞恢复期，循环随父 watchdog 退出；它只搬移普通窗口，无其他安全屏时先最小化，永不搬动 HS2 浮层、Wallpaper Engine 或桌面外壳。",
      "已有 Secondary 绝不先降级，native 每 epoch 只尝试一次提升。",
      "Secondary 提升失败只收起旧浮层并等待显示链恢复，保留当前或请求的 Secondary 模式；不发送 SetSecondaryScreen(false) 降回原生，也不重置本周期已经用过的一次尝试。",
      "三次连续失败后 30 秒熔断，先证明旧 stream 释放 COM。",
      "壁纸恢复只比较活动显示器 DeviceName 与 IsPrimary；HDR、坐标、分辨率以及没有改变这两类身份的 DXGI 波动不触发。首次健康观察只立基线，不重启渲染。",
      "恢复门要求恰好三块活动屏、唯一主屏、唯一健康 DISPLAY\\MTT1337\\* 与硬件 ID 为 Root\\MttVDD 的健康后端，以及已经验证的 HS2 Secondary + 8091/AD23/MI_00/LED 绑定；少屏、多屏、主屏歧义或任一设备异常都等待。",
      "背景进程身份来自当前 watchdog session 内 wallpaper64 的真实路径；只有推导出唯一同目录 wallpaper32.exe 且当前 session 至少有一个 explorer shell 时，才用 Shell.Application 在普通用户桌面分派控制命令。",
      "默认 15 秒探测、30 秒稳定、900 秒冷却、stop/play 间隔 1500 ms；一次失败也消费该拓扑事件。它不从 Highest watchdog 启动常驻 wallpaper64、不打开 GUI、不写配置，也不自动反复重试同一事件。",
      "绑定 LIAN LI 设备出现 Code 10 时立即失败关闭，只给出关机后检查 USB 排针、线缆和辅助供电的行动提示；不重启 Hub、不移除设备、不扫描 PnP。",
      "A108 或端点缺失进入物理恢复：断电后只用主板 USB 2.0 9-pin 直连或官方 EDGE HUB，随附一分二 Hub 不承载 LCD；供电不足再接 SATA。",
      "改变接线后，唯一 8091 + port 2 controller + port 3 LED 拓扑必须连续两次健康才允许换绑。",
      "本模块从已经建立的本机安装态开始；clean clone、厂商文件、private config、首次双屏绑定和启动任务安装属于独立安装与换机模块。",
      "普通恢复不重启 Hub、不删设备、不做 PnP scan，也不改物理主屏、远程虚拟屏、分辨率、刷新率、HDR、缩放或捕获目标。"
    ],
    problem: "解决双恢复 Owner、显示模式抖动、串口竞争、任务假成功退出、睡眠后窗口乱跑、拓扑变化后 Wallpaper Engine 仍绑定旧渲染面、只看进程的假健康，以及过度 USB/PnP 修复。",
    implementation: [
      "计划任务由 wscript 无窗口父适配器启动长期 PowerShell watchdog。",
      "StartSideScreenWatchdog 在 Set-ActiveDisplayState 的阻塞恢复前先启动 `Invoke-HS2StartupWindowGuard.ps1` 并立即执行普通窗口保护。子循环绑定父 PID 与创建时间，默认 DurationSeconds=180、PollMilliseconds=250；父退出或时限到就结束，并输出有界 hs2-startup-window-guard.json 与启动错误证据。",
      "`Get-HS2ExclusiveWindowGuardPlan` 不要求已有浮层 PID：优先已知目标，再按 2288×1048 几何优先选择非主屏；安全落点优先已知安全屏/主屏，再取其他屏最大工作区，无可用落点才最小化。窗口按可见性、cloaked（隐藏合成状态）、有效尺寸和排除进程过滤，无激活迁移；这不是完整控制器拓扑认证。",
      "WMI 电源订阅统一处理 suspend/resume，与 live process/COM owner 合并。",
      "HS2 模式按 actual enumerated state（实际已枚举状态）保留，绑定必须连续两次健康。",
      "TURZX suspend 停 stream 并用 command 123 亮度 0；恢复先还亮度再启动。",
      "WindowsDisplayWindowPolicy.ps1 通过 EnumDisplayMonitors/GetMonitorInfo 只读捕获活动屏 DeviceName、IsPrimary 和几何；Get-WallpaperEngineTopologyFingerprint 只保留前两项并排序，避免 HDR 或布局细节造成误触发。",
      "HS2ActiveRecoveryPolicy.ps1 用窄 PnP 查询核对唯一 DISPLAY\\MTT1337\\* 和 ROOT\\DISPLAY\\* 后端，并逐项读取 IsPresent、ProblemCode 与 HardwareIds=Root\\MttVDD；再与 Test-HS2CurrentSecondaryBindingHealthy 的既有 HS2 绑定交叉验证。",
      "Get-WallpaperEngineRebindDecision 维护 baseline、pending fingerprint、pendingSince 与 lastRebind；状态机区分 WaitForTopology、Baseline、Healthy、Stabilizing、WaitForHealth、Cooldown 和 Rebind。",
      "Resolve-WallpaperEngineControlExecutable 只接受当前 session 的 wallpaper64，读取其真实路径并解析同目录唯一 wallpaper32.exe；Invoke-WallpaperEngineRenderRebind 要求当前 session 有 explorer，再通过 Shell.Application 隐藏分派 stop/play。",
      "任何 probe（探测）或控制错误只写有界状态日志；失败分派也更新 baseline 与 lastRebind，因而不在同一拓扑上循环。没有持久配置变更可撤销；若 stop 后 play 未恢复，原场景/设置仍归 Wallpaper Engine，Windows 静态背景与其用户控制是回退面。"
    ],
    flow: [
      "登录后启动唯一 watchdog。",
      "在控制器恢复可能阻塞前启动 250 ms / 180 秒的普通窗口保护并立即检查一次；即使浮层还不存在也能处理误入小屏的普通应用。",
      "检查当前控制器模式、设备绑定和旧 owner。",
      "已有 Secondary 原位验证；实际 native 稳定 30 秒后至多提升一次。完整模式/绑定双样本通过才启动浮层，失败则保留模式、停止旧浮层并等待，不主动降级。",
      "每 15 秒只读捕获活动显示器身份、唯一主屏、MTT PnP 后端与 HS2 Secondary 绑定；首次完整健康只保存 baseline。",
      "发现设备名或主屏归属变化后保存 pending 指纹；30 秒内又变化就重新计时，少屏、多屏、主屏歧义、MTT/HS2 不健康都停在 WaitForHealth。",
      "变化稳定且距上次尝试满 900 秒时，从本会话 wallpaper64 解析同目录 wallpaper32，并经 explorer shell 分派 stop，等待 1500 ms，再分派 play。",
      "分派成功后等待用户看到原动态壁纸在 HS2 浮层下恢复；主机状态只记为命令已分派，不冒充像素恢复。分派失败则记录 control-client-unavailable、user-shell-unavailable 或 control-dispatch-failed，消费本事件并停止重试。",
      "若 A108 或显示端点缺失，停止软件恢复并正常关机、断开整机电源。",
      "把 OLED USB 主线直连主板 USB 2.0 9-pin 排针或官方 EDGE HUB；不用随附一分二 Hub 承载 LCD，供电不足时接 SATA。",
      "重新上电后核对唯一 8091、port 2 controller 和 port 3 LED，连续两次健康才更新绑定。",
      "按实际状态启动两块屏。",
      "持续检查 heartbeat、进程和电源事件。",
      "故障时熔断并精确恢复。",
      "睡眠/关机按各屏合同收口。"
    ],
    concepts: [
      { term: "epoch（一次启动/恢复周期）", explanation: "每次正常启动或 resume 的一次机会；失败不会在同一周期无限重试模式。" },
      { term: "preserve-current-mode（保留当前模式）", explanation: "先接受固件和 Windows 已成功枚举的模式，再决定是否需要切换。" },
      { term: "RunLevel Highest（最高用户运行级别）", explanation: "交互用户任务的提升级别，不是 SYSTEM，也不扩大设备授权；壁纸控制仍经当前用户 shell 分派。" },
      { term: "topology baseline（拓扑基线）", explanation: "第一次完整健康观察得到的活动设备名 + 主屏归属；建立基线本身不触发 Wallpaper Engine。" },
      { term: "stability window（稳定窗口）", explanation: "新指纹必须连续保持 30 秒；任何再次变化会重新计时，避免插拔过程中反复恢复。" },
      { term: "cooldown（冷却）", explanation: "每次真实分派无论成功或失败都留下 900 秒节流；同一事件被消费，避免 stop/play 循环。" }
    ],
    boundaries: [
      "修复入口会真实影响副屏，必须先核对精确目标；网站刷新只读。",
      "壁纸恢复只作用于现有 Wallpaper Engine 控制接口：不切换 Windows 显示拓扑、不改主屏、不改分辨率/刷新率/HDR/缩放/捕获目标，不打开 Wallpaper GUI、不写场景或配置，也不创建服务、计划任务或高权限常驻渲染器。",
      "wallpaper64 存在只说明候选进程；必须同一 session、能读取真实路径、解析到唯一同目录 wallpaper32，并存在当前 session explorer shell，才有控制资格。",
      "stop/play 的 Dispatched=true 只证明 ShellExecute 已接受两次调用，不证明 Wallpaper Engine 完成渲染，更不证明 HS2 实体像素已经运动。",
      "一次分派中 stop 成功而 play 失败没有自动 rollback（回滚）事务；产品以不改配置、Windows 静态背景和 Wallpaper Engine 自身用户控制保持可恢复，并用事件消费 + 长冷却避免更坏的自动循环。",
      "内部 USB 排针不得带电插拔。",
      "随附一分二 Hub 不支持 LCD；只能使用主板 USB 2.0 9-pin 直连或官方 EDGE HUB，供电不足时才补 SATA。",
      "接线改变后的单次枚举不够；唯一 8091、port 2 controller、port 3 LED 拓扑必须连续两次健康才换绑。",
      "上述接线、拓扑和壁纸重绑来自项目 source contract（源码合同）；本轮未关机、拔插、改线、重启当前 watchdog、制造拓扑变化或执行物理恢复，不能写成已安装或实体实测通过。",
      "这里处理已安装机器的运行期端点消失和接线修正，不代替 clean clone、换机或系统重装验收。",
      "服务/进程回读不等于实体显示恢复。"
    ],
    failures: [
      { condition: "普通窗口进入已识别的 HS2，但完整控制器或浮层尚未就绪", response: "前置窗口保护先把普通应用无激活地搬回安全屏；无其他落点时最小化。浮层、Wallpaper 和桌面外壳排除，完整 HS2 验证仍独立等待。" },
      { condition: "启动窗口保护子进程提前退出或父 watchdog 已退出", response: "提前退出留明确错误证据，不把无窗口启动当成运行成功；父退出时子循环结束，不遗留第二个长期恢复 Owner。" },
      { condition: "HDR、分辨率、坐标或 DXGI 波动没有改变活动显示器身份/主屏归属", response: "指纹保持相同，返回 Healthy 或 WaitForHealth；不触发 Wallpaper Engine，避免普通画质变化造成闪屏。" },
      { condition: "活动屏不是恰好三块、主屏不唯一、MTT1337/Root\\MttVDD 不唯一或不健康、HS2 Secondary/绑定不健康", response: "进入 WaitForTopology 或 WaitForHealth，保留 pending 状态但不分派 stop/play；健康恢复且指纹稳定后再评估。" },
      { condition: "当前会话没有可读 wallpaper64、出现多个控制目录、同目录 wallpaper32 缺失或 explorer shell 不存在", response: "返回 control-client-unavailable 或 user-shell-unavailable；不猜安装路径、不跨 session 控制、不启动高权限 wallpaper64。" },
      { condition: "Shell.Application 建立或 stop/play 分派失败", response: "返回 control-dispatch-failed 并记有界日志；本次事件仍被消费、baseline 更新并进入 900 秒冷却，不对同一拓扑自动重试。原壁纸配置不变；若背景未恢复，保留 Windows 静态背景并由 Wallpaper Engine 自身用户控制恢复。" },
      { condition: "绑定的 LIAN LI Hub、显示、MI_00 或 LED 出现 Code 10", response: "同一签名只提示一次并立即失败关闭；要求关机后检查 HS2 USB 排针、线缆和辅助供电，不自动重启 Hub、移除设备或扫描 PnP。" },
      { condition: "A108 Boot ROM 或显示端点缺失", response: "停止软件尝试；需要恢复时先关机断电，再按主板 USB 2.0 9-pin 直连或官方 EDGE HUB 的物理旅程处理，绝不带电拔插。" },
      { condition: "随附一分二 Hub 上看不到 LCD", response: "不继续重试该 Hub；它不支持 LCD。改用主板 USB 2.0 9-pin 直连或官方 EDGE HUB，若供电不足再接 SATA。" },
      { condition: "改线后出现多个 8091 或端口角色不一致", response: "保持旧绑定失效，不启动浮层；只在唯一 8091、port 2 controller、port 3 LED 连续两次健康后重新绑定。" },
      { condition: "Secondary 提升失败", response: "停止旧浮层、保留当前或请求的 Secondary 模式并等待自然显示链恢复；不发送原生模式命令，本 epoch 不再尝试提升。" },
      { condition: "watchdog 子进程反复失败", response: "保留长期循环，30 秒熔断后只启动一次新 stack。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\StartSideScreenWatchdog.ps1", role: "长期进程、电源 Owner、Wallpaper Engine 进程身份解析、用户 shell 分派和有界恢复状态" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\Invoke-HS2StartupWindowGuard.ps1", role: "控制器验证前的 250 ms 窗口保护、180 秒寿命与父进程存活绑定" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\HS2ActiveRecoveryPolicy.ps1", role: "拓扑指纹、MTT/HS2 健康门、30 秒稳定、900 秒冷却、Code 10 失败关闭与重绑决策" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\WindowsDisplayWindowPolicy.ps1", role: "EnumDisplayMonitors 活动屏/主屏快照，以及浮层、Wallpaper Engine 和桌面外壳窗口排除" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\tools\\turzx_side_screen\\TestPowerWatchdog.ps1", role: "HDR-only、三屏/MTT/HS2 健康、稳定/冷却、控制分派与禁止扩大动作回归" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\repair-panel.ps1", role: "冻结面板有界修复" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\install-startup-admin.ps1", role: "启动任务安装与旧任务禁用" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\hs2-crystal-overlay.md", role: "三屏壁纸重绑、Code 10、设备操作禁区与实体边界" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\docs\\startup.md", role: "模式、电源、拓扑与恢复合同" },
      { path: "E:\\Projects\\Tools\\TURZX-SideScreen\\scripts\\TestRuntimeReliability.ps1", role: "恢复与假活回归" }
    ],
    verification: [
      "Source：2026-09-02 本地 HEAD=7144da589119fa59d5eb56bbaa921d2bf3af8484；前置窗口保护与模式保留已在当前代码和 TestPowerWatchdog 断言中核对。本次没有执行来源测试或新现场；8c217ead 的 PUBLIC main/远端一致性和下述测试仍保留为 8 月 31 日历史证据。",
      "Tests：8c217ead 上完整 test.ps1 -SkipStreamWhenRunning 通过；84 项指标、8 项天气、TestPowerWatchdog、TestRefreshDefaults、TestRuntimeReliability、cadence 与公开 ZIP 均通过，生产流新鲜时保护性跳过 TestVideoStream。",
      "Installation：现有计划任务观察时为 Running / Highest，唯一 stream 与新鲜 heartbeat 存在；本轮没有重启/重装任务或回读运行进程加载的函数版本，因此 8c217ead installed（已安装）状态保持 Unknown。",
      "Runtime：没有制造显示器拔插、主屏切换、MTT 重枚举、Code 10、控制客户端缺失或 stop/play 半失败；没有看到真实 Rebind 日志或 Wallpaper Engine 渲染恢复。",
      "接线选择、Hub 能力、SATA 供电与 8091 端口拓扑来自当前项目源码和启动合同；它们是可执行恢复说明，不是本轮物理观察结果。",
      "Physical：2026-08-30 本人只确认当时显示缓冲区同画面已在 HS2 实体屏生效；本轮未重验动态运动、拓扑重绑、睡眠、关机、驱动故障或异常启动，真实恢复 E2E 未通过。"
    ],
    relation: "接收安装与换机模块已经验证的本机配置和双屏绑定，监管运行期机箱屏传输、HS2 显示状态与既有 Wallpaper Engine 的渲染重绑；它不拥有 clean clone、首次安装、壁纸资产或场景设置，总览中的分层证据决定源码、测试、安装、运行事实能否升级为实体结论。"
  }
];

export const project = pcPanelHubProject;
export const modules = pcPanelHubModules;
