import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["正常工作", "发现问题", "暂不可用"];
const sourceCommit = "f6e134f3dec42528748829c4f957da88061533b0";
const selectedImageHash = "46CC9437FEB7EFB96ED926AEAF6DC26535F22EB72049978D022F9A46F8688E16";

export const emeraldVeilSnapshot = createProjectSnapshot({
  observedAt: "2026-09-08T05:38:55.307Z",
  label: "桌面与锁屏回读正确，六分钟配置与常驻程序已恢复",
  boundary: "静态壁纸恢复与空闲泡泡分别工作。现有常驻程序和360秒配置已恢复；本轮未主动预览泡泡、改变空闲时间或进入锁屏，实际画面与远端使用仍单独验收。",
  metrics: [
    { label: "选定图片", value: "青雨 · 第二幕 / 4K" },
    { label: "桌面与锁屏", value: "接口回读通过" },
    { label: "空闲策略", value: "6分钟 / 常驻已恢复" },
    { label: "本机配置", value: "0.1.26 / 核对通过" }
  ],
  facts: [
    { label: "源版本与工作区", value: `PUBLIC main ${sourceCommit} 已正常推送并通过GitHub引用接口远端回读；App版本0.1.26。修复了Wallpaper Engine控制命令非零退出仍被当作成功的问题。11个未跟踪猫分层实验文件原样保留，不作为现役能力或已提交源码。` },
    { label: "两张背景各自负责什么", value: `assets/verdant-rain-4k.png 是桌面和锁屏选用的青雨 · 第二幕，3840×2160、sRGB SDR（标准动态范围），SHA-256 ${selectedImageHash}。泡泡显示时使用另一张嵌入程序的assets/emerald-veil-background.jpg，同为3840×2160；更换Windows底图不会替换泡泡背景。` },
    { label: "静态背景现场回读", value: "Set-WindowsBackground.ps1 -Action Verify返回verified，desktop.matches=true、lockScreen.matches=true，锁屏解码图像平均像素差为0，changedSurfaces为空。两处都引用本用户LocalAppData中的持久副本；这次没有应用图片或进入真实锁屏。" },
    { label: "泡泡安装与当前运行", value: "现有安装器已部署0.1.26并通过Verify；制品与安装文件SHA-256同为877E33853316B3ECE3D60549FADCB31E9454CB6435AEC04D80CCD760273EB0DA，均为175337116字节。唯一自启值Emerald Veil Native Bubbles直接指向本用户Programs\\EmeraldVeil\\EmeraldVeil.exe。当前会话1有一个响应正常的常驻进程，未强制显示泡泡。" },
    { label: "配置恢复", value: "本轮发现enabled=1但程序已停止，注册表超时600、运行时360。沿现有Enable入口将注册表恢复为360，并启动已安装程序；首次前像SHA-256前后相同。现配置Verify通过：NativeBubblesEnabled=1、ScreenSaveActive=0、ScreenSaverIsSecure=0，运行时false/360/false。原停止原因未有充分证据。" },
    { label: "输入与恢复机制", value: "源码每50ms读取GetLastInputInfo，360秒可靠空闲后显示；零位移鼠标消息被过滤，孤立注入移动仍传给应用但暂不计为空闲活动。第二次注入在250ms内到达才确认连续活动；渲染器退出后，仍空闲时按1秒退避重试。" },
    { label: "源码验证范围", value: "本轮37项测试通过，0失败、0跳过。原36项覆盖输入分类、空闲计时、状态协调、外部暂停与部分源码结构；新增隔离进程测试先复现控制命令失败被忽略，再验证非零结果被正确拒绝。测试不启动真实Bubbles，不能证明窗口像素、Job Object实机清理、自然触发或远端画面。" }
  ],
  gaps: [
    "现有常驻程序与配置已恢复，但原退出原因没有充分证据；托盘退出本来就是正常功能，不能据一次停止推断为反复崩溃，也未增加另一层自动重启服务。",
    "桌面/锁屏接口回读通过，不等于本轮看过真正锁屏画面；跨机器设置流程已有实现，本轮未在第二台电脑重新应用。",
    "原生泡泡的大小、数量和边缘运动由Windows实现决定；当前版本采用未公开的Radius参数，系统更新后需要重新确认实际画面。",
    "泡泡让静止画面多一些运动，不保证OLED不会烧屏；亮度、面板维护和自动息屏仍由显示器及系统负责。",
    "远程兼容依靠同一用户桌面、输入穿透和不主动锁屏；不承诺所有远程软件、网络和显示器组合已经实测。"
  ]
});

export const emeraldVeilProject = {
  order: 29,
  slug: "emerald-veil",
  title: "Emerald Veil",
  kicker: "把喜欢的壁纸带到新电脑，空闲时让原生泡泡飘起来",
  lead: "把喜欢的壁纸带到新电脑，空闲时让原生泡泡飘起来",
  route: "/projects/emerald-veil",
  visibility: "公开仓库",
  statusTone: "accent",
  badge: "壁纸 / 空闲屏保",
  repositoryNote: "公开仓库保存项目代码、已选图片和恢复说明。原来的桌面/锁屏图片、注册表备份和本机运行状态留在本机；网站展示一次核对结果，不控制当前桌面。",
  summary: "一件事是把选好的青雨4K静帧设为Windows桌面和锁屏，重装或换机后仍用同一条命令恢复；另一件事是电脑空闲六分钟后，用Windows自带泡泡覆盖在专属背景上，正常输入就退回工作。两个功能独立，已有Wallpaper Engine壁纸可以保留。",
  why: "桌面图片不应随着项目目录搬家而丢失，换电脑也不该重新找图、调参数。空闲画面则需要在回来操作时及时退开，不能借屏保把远程桌面锁住，或让旧泡泡进程越积越多。这个项目分别处理图片恢复、空闲触发、窗口共存与停用恢复。",
  plainExample: "“新电脑也用这张青雨壁纸；我离开一会儿时让泡泡飘起来，回来就继续干活。”先恢复桌面和锁屏图片；需要空闲泡泡时再安装并启用常驻程序。正常使用时保留现有桌面，空闲达到六分钟才显示另一张专属背景和原生泡泡，移动鼠标、点击或打字便收起。当前图片已核对正确，常驻程序和六分钟配置也已恢复。",
  result: "得到一套能重复使用的壁纸恢复入口，以及可暂停、预览、停用和卸载的原生泡泡功能。图片设置成功会返回明确回读结果；配置、程序运行和真正看到的画面分别验证，不用“已安装”代替“正在工作”。",
  cardStatus: "桌面锁屏回读通过 · 六分钟配置与常驻程序已恢复",
  cardStatusTone: "accent",
  ...emeraldVeilSnapshot,
  stateLabels,
  readerStates: {
    pass: "图片文件、固定图片模式和Windows回读一致时，恢复脚本报告完成。泡泡程序正常运行并达到六分钟可靠空闲时才显示；普通活动会把画面收起。",
    problem: "配置发生漂移或常驻程序停止时，先分开核对设置、安装与进程，再处理相应问题；静态图片不因此被重新生成或替换。本轮已经修正超时值并恢复现有程序。",
    unavailable: "系统缺少Bubbles.scr、没有可用的当前用户桌面或已有另一原生泡泡实例时，不再启动一份。缺少选图或图像校验不符时，静态恢复入口直接报错。"
  },
  searchAliases: ["Emerald Veil", "EmeraldVeil", "青雨", "桌面壁纸", "锁屏图片", "原生泡泡", "屏保", "六分钟空闲"],
  searchProjection: {
    intents: ["换电脑后恢复桌面壁纸和锁屏图片", "电脑空闲六分钟显示泡泡", "屏保和Wallpaper Engine一起使用", "鼠标没有移动却总是退出屏保", "关闭泡泡并恢复原来设置"],
    entities: ["EmeraldVeil", "Bubbles.scr", "Set-WindowsBackground.ps1", "Set-NativeBubbles.ps1", "Wallpaper Engine", "ExternalProtectionPause"],
    relations: ["Windows桌面和锁屏使用青雨静帧，泡泡使用独立嵌入背景", "原生Bubbles提供画面，用户会话程序负责空闲触发与退出"]
  },
  productPrinciples: [
    { title: "壁纸恢复和空闲画面各做一件事", detail: "只想恢复图片就运行一次脚本，不必装常驻程序。泡泡的背景嵌入自己的程序，不依赖Windows或Wallpaper Engine当前选了哪张图。" },
    { title: "泡泡借用系统原件，操作还给用户", detail: "保留Windows原生泡泡的材质与运动，不重画一套。覆盖层不抢焦点、不主动锁屏，正常输入时退开；远端是否好用仍要看实际客户端。" },
    { title: "区分真操作和没有意义的鼠标消息", detail: "有些设备或远程工具会发出指针根本没动的消息，不能让它们不断重置空闲时间；连续移动、按键和滚轮仍算活动。判断事件本身，不按软件名称猜用户在不在。" },
    { title: "已有画面和保护工具可以继续用", detail: "设置静态图片时不改Wallpaper Engine。启动泡泡时只短暂协调其当前会话播放；外部黑罩持有暂停标记时，泡泡连预览也会让位，标记消失后恢复原来的策略。" },
    { title: "停用、还原和卸载说清楚", detail: "Disable先停止泡泡和自动触发；Restore还原第一次启用前保存的屏保参数；Remove移除项目自启和程序。原壁纸在Windows设置里按保存记录选回，不冒充一个命令能还原电脑所有改动。" }
  ],
  usageExamples: [
    { ask: "新电脑也想用这张壁纸，锁屏一起设好。", effect: "用项目内图片运行Apply（应用图片），保留原图记录，复制到本用户持久目录，再分别回读桌面与锁屏。图片内容、固定模式和持久路径都正确时不重复设置。", moduleSlug: "windows-desktop-and-lockscreen-background" },
    { ask: "离开六分钟以后再出泡泡，回来打字就收起。", effect: "常驻程序读取最近输入时间，过滤特定无意义移动，达到阈值才启动原生泡泡；一般输入先隐藏窗口再结束进程。托盘15秒预览是主动看效果，期间不因输入提前结束。", moduleSlug: "native-bubbles-idle-overlay" },
    { ask: "Wallpaper Engine继续用；主屏黑罩开着时，别再盖一层泡泡。", effect: "泡泡启动时短暂停止并恢复当前会话的Wallpaper Engine播放，不改其选图；外部黑罩的暂停标记生效时，现有泡泡会收起，新的空闲显示和预览都会让位。", moduleSlug: "wallpaper-engine-coexistence-and-rain-experiment" },
    { ask: "暂时不要泡泡，或者以后彻底卸载。", effect: "临时暂停可在托盘里切换；Disable关闭自动泡泡，Restore按原始记录还原屏保参数，Remove删除项目启动项与可执行文件。三种操作的结果不同，原始记录仍留作恢复依据。", moduleSlug: "reversibility-preimage-and-remote-compatibility" }
  ],
  components: [
    { name: "Set-WindowsBackground.ps1", responsibility: "恢复Windows桌面与系统锁屏图片", implementation: "读取选图清单和PNG，核对SHA-256，通过SystemParametersInfoW和Windows.System.UserProfile.LockScreen设置并回读。PowerShell 7自动转到Windows自带64位Windows PowerShell运行WinRT接口。" },
    { name: "EmeraldVeil.App", responsibility: "在当前用户桌面等待空闲，显示与收起泡泡", implementation: ".NET 10 Windows WinExe（不弹控制台的应用），WPF（Windows界面框架）承载嵌入背景，托盘提供预览、暂停、登录启动和退出。当前源码与安装版本0.1.26。" },
    { name: "EmeraldVeil.Core", responsibility: "区分可靠空闲、活动、暂停和恢复时机", implementation: "IdleTimeline处理计时、回绕与不可靠采样；InputActivityFilter只在内存判断活动；VeilActivationPolicy和VeilModeReconciler决定显示/隐藏及1秒恢复退避。" },
    { name: "NativeBubblesLauncher / VeilWindow", responsibility: "管理原生泡泡进程和两层画面", implementation: "会话租约防止重复启动，Job Object（作业对象）关闭时结束子进程。原生泡泡窗口使用黑色色键透明；不透明的项目背景窗口紧贴其下，两者都不接管用户输入。" },
    { name: "WallpaperEngineQuiescence / ExternalProtectionPause", responsibility: "和已有壁纸、外部黑罩协调", implementation: "唯一识别当前会话wallpaper64，再用同目录wallpaper32控制stop/play；外部暂停只看会话内命名标记是否仍被持有，不识别远程产品或记录输入。" },
    { name: "Set-NativeBubbles.ps1 / Install-EmeraldVeil.ps1", responsibility: "配置、检查、停用、恢复和安装", implementation: "原屏保参数保存在本机前像；安装器部署单个程序并注册直接WinExe Run值，不建立服务、计划任务或额外常驻脚本。" }
  ],
  operationalEntrypoints: [
    { name: "恢复桌面与锁屏图片", command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\Set-WindowsBackground.ps1 -Action Apply", purpose: "在项目目录运行；使用已保存图片，不重新生成。会修改当前用户个性化设置，先保存原始图片与设置记录。" },
    { name: "只检查图片", command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\Set-WindowsBackground.ps1 -Action Verify", purpose: "核对图片、固定模式、持久路径和解码锁屏画面，正确返回verified/0，漂移返回drift/1；不锁定会话。" },
    { name: "构建可安装泡泡程序", command: "dotnet publish .\\src\\EmeraldVeil.App\\EmeraldVeil.App.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o .\\artifacts\\publish\\win-x64", purpose: "从源码安装需.NET 10 SDK；生成安装器默认读取的单文件程序。不因构建自动启动泡泡。" },
    { name: "安装或更新泡泡程序", command: "pwsh -NoProfile -File .\\scripts\\Install-EmeraldVeil.ps1 -Action Install", purpose: "部署到本用户Programs\\EmeraldVeil，注册直接启动项并启动程序；Enable不是安装器，不能替代这一步。" },
    { name: "启用六分钟自动泡泡", command: "pwsh -NoProfile -File .\\scripts\\Set-NativeBubbles.ps1 -Action Enable", purpose: "保存第一次启用前的原状态，写入360秒、半径和enabled标志，并关闭Windows自己的自动屏保触发。" },
    { name: "检查泡泡配置", command: "pwsh -NoProfile -File .\\scripts\\Set-NativeBubbles.ps1 -Action Verify", purpose: "检查屏保注册表与运行时；程序是否运行和实际画面仍需分别观察。" },
    { name: "检查程序安装", command: "pwsh -NoProfile -File .\\scripts\\Install-EmeraldVeil.ps1 -Action Verify", purpose: "检查已安装的程序与自启项，不把安装一致当作实屏效果已通过。" },
    { name: "立即停用泡泡", command: "pwsh -NoProfile -File .\\scripts\\Set-NativeBubbles.ps1 -Action Disable", purpose: "停止匹配Windows系统路径的泡泡进程，清除项目enabled标志，并让Windows自动触发保持关闭。不是只读操作，也不会还原静态壁纸。" },
    { name: "还原原屏保设置", command: "pwsh -NoProfile -File .\\scripts\\Set-NativeBubbles.ps1 -Action Restore", purpose: "还原第一次Enable前记录的精确键值存在性、类型、值和运行时状态；不是恢复Windows默认值，也不是卸载程序。" },
    { name: "卸载泡泡程序", command: "pwsh -NoProfile -File .\\scripts\\Install-EmeraldVeil.ps1 -Action Remove", purpose: "移除项目自启项和已装程序。若同时要回到原屏保设置，先按Restore处理；恢复记录留在本机。" }
  ],
  technicalContracts: [
    { artifact: "assets/windows-background.json", schema: "name / image / sha256 / width / height / color / renderSettings", owner: "静态背景脚本", boundary: `选图SHA-256 ${selectedImageHash}；3840×2160。参数vivid=0.5、rain=0.75、wind=0、haze=0.5、depth=0、rainStyle=1，只记录选定画面来源，不让Windows运行动态雨幕。` },
    { artifact: "%LOCALAPPDATA%\\EmeraldVeil\\windows-background\\before-first-apply.json", schema: "capturedUtc / desktopPath / desktopBackup / wallpaperStyle / tileWallpaper / lockScreenOriginalUri / lockScreenBackup / pictureSelectors", owner: "静态背景脚本", boundary: "这是脚本保存的JSON记录，没有另一个wly.*版本schema。首次保存原图和模式，重复应用不覆盖原图；缺少旧selector字段时只补采该字段。原图片按记录在Windows设置里选回。" },
    { artifact: "%LOCALAPPDATA%\\EmeraldVeil\\native-bubbles-preimage.json", schema: "emerald-veil.native-bubbles-preimage.v2；兼容v1", owner: "Set-NativeBubbles.ps1", boundary: "保存runtime和registry_values，逐项含路径、名称、存在性、类型、值；v2包括NativeBubblesEnabled，v1恢复时将该标志还原为不存在。记录留在本机。" },
    { artifact: "原生泡泡配置", schema: "HKCU Desktop + Screensavers\\Bubbles + Software\\EmeraldVeil", owner: "配置脚本与常驻程序", boundary: "SCRNSAVE.EXE指向系统Bubbles.scr；ScreenSaveTimeOut=360、ScreenSaveActive=0、ScreenSaverIsSecure=0均为REG_SZ；Radius=1130000000、NativeBubblesEnabled=1为REG_DWORD。常驻程序每30秒修正运行时策略，不是全注册表定时重写器。" },
    { artifact: "会话内进程与窗口", schema: "native-bubbles-session-<session>.lock / JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE / HWND", owner: "NativeBubblesLauncher", boundary: "租约和当前会话进程检查拒绝重复实例，不接管已有原生泡泡。启动进程归作业对象，退出时先隐藏已持有窗口，再释放进程和租约。" },
    { artifact: "Local\\EmeraldVeil.ExternalProtectionPause", schema: "会话内命名mutex（互斥体）的句柄生命周期标记", owner: "外部保护程序创建，Emerald Veil只读观察", boundary: "以initiallyOwned=false创建，持有句柄即让位；无需Wait或ReleaseMutex。观察者立即关闭探测句柄，最后持有者关闭或崩溃后标记消失。" }
  ],
  evidenceLayers: [
    { layer: "当前源码与37项测试", proves: "当前公开提交、核心逻辑与源码约定检查通过；隔离的真实进程回归证明控制命令非零退出不再被当作成功。", doesNotProve: "不启动真实渲染器，不能证明实际泡泡像素、窗口层级、Job Object崩溃清理或完整六分钟自然触发。" },
    { layer: "本机静态图片回读", proves: "Verify确认两处引用持久副本，固定图片模式正确，锁屏解码图像平均误差为0。", doesNotProve: "不是实际锁屏目视，也不是第二台电脑上的应用验证；不证明HDR或任意显示器裁剪效果。" },
    { layer: "本机泡泡安装和运行状态", proves: "新制品与安装文件版本、哈希一致，安装和配置Verify均通过；已恢复一个响应正常的当前会话常驻程序。", doesNotProve: "配置与常驻恢复不证明本轮已看到自然触发的泡泡，也不证明原退出原因已根治。" },
    { layer: "真实使用与远端画面", proves: "只有实际看到空闲触发、输入退出和远端连接，才证明对应会话和显示组合的使用结果。", doesNotProve: "本轮未重新执行这些实机操作；设计机制、历史截图或测试数量不能补成当前PASS。" }
  ],
  galleryPresentation: {
    kicker: "两张图片，各有用途",
    title: "桌面与锁屏，和泡泡出现时的背景",
    description: "这里展示源项目中的完整图片资产。它们不是本轮锁屏照片，也不是泡泡运行截图；单击可查看4K原图。",
    prefetchAdjacentFull: false
  },
  gallery: [
    { src: "/media/emerald-veil/verdant-rain-4k.webp", thumbnail: "/media/emerald-veil/thumbs/verdant-rain-4k.webp", width: 3840, height: 2160, evidenceLabel: "桌面与锁屏选图", alt: "青雨第二幕选定的雨林猫咪静帧", caption: "青雨 · 第二幕：Windows桌面和真正系统锁屏使用这张静帧，动态雨幕不会一起安装。", originalSha256: selectedImageHash, originalBytes: 7780115, displayBytes: 4487986, displaySha256: "ef2859f4c264448cacd93ba59bb86e578c92bd4ffb8b63e421985d58bc05ec37", displayNote: "WebP（网页图像格式）无损显示副本；保持 3840×2160 尺寸，解码后的 RGBA（红绿蓝及透明度）像素与来源 PNG 逐字节相同。来源身份仍保留原 PNG 的 SHA-256 和字节数。" },
    { src: "/media/emerald-veil/emerald-veil-background.jpg", thumbnail: "/media/emerald-veil/thumbs/emerald-veil-background.webp", width: 3840, height: 2160, evidenceLabel: "泡泡专属背景资产", alt: "Emerald Veil原生泡泡覆盖层使用的独立背景图", caption: "原生泡泡出现时，程序在泡泡下面显示这张嵌入背景；它与当前Windows壁纸是两份独立资产。", originalSha256: "e0db6b29758b81f3ce70a75a25266eaa206be1d1b78ce83f205263337291c9f4", originalBytes: 2339467 }
  ],
  glossary: [
    { term: "Bubbles.scr", meaning: "Windows自带的气泡屏幕保护程序。本项目使用系统现有副本的/s全尺寸模式，微软仍决定泡泡材质、运动和数量。" },
    { term: "watchdog（看门狗）", meaning: "这里指本用户会话中的小程序：等待空闲、显示泡泡、响应活动、重试意外退出的渲染器。它不是系统服务。" },
    { term: "Job Object（作业对象）", meaning: "把本次启动的泡泡进程交给Windows统一管理；关闭最后一个作业句柄时结束其子进程，减少退出后残留。" },
    { term: "Color-key（色键透明）", meaning: "把原生泡泡窗口中的黑色像素设为透明，让下面的项目背景显示出来。背景窗口本身仍是不透明图片。" },
    { term: "Preimage（变更前状态）", meaning: "修改前保存的具体原状态，用于按原样恢复；它不代表备份整台电脑，也不自动证明所有操作完全可回滚。" },
    { term: "DWM（桌面窗口合成器）", meaning: "Windows负责组合各个窗口画面的组件。这里等待其完成一轮合成，避免泡泡初始化时使用尚未稳定的背景。" },
    { term: "GetLastInputInfo", meaning: "Windows提供的最近输入时间。项目结合少量内存中的事件分类计算空闲，不保存用户按键、活动日志或截图。" }
  ],
  operatingFlow: [
    { title: "先恢复喜欢的图片", detail: "从选图清单找到已保存PNG，按需保存原始记录、复制到本用户持久目录并设置Windows桌面和锁屏，最后读取实际结果。" },
    { title: "需要泡泡时再安装启用", detail: "安装单个程序与直接登录启动项，然后用Enable配置六分钟策略；不把一次性图片恢复变成长驻服务。" },
    { title: "等待可靠空闲", detail: "程序每50ms观察输入；无意义鼠标移动不重置计时，暂停、外部黑罩或不可靠读数会阻止自动显示。" },
    { title: "显示并维护两层画面", detail: "和现有壁纸播放做短暂协调，显示专属背景，再启动原生泡泡；维护两层位置，输入或停止操作到来就收起。" },
    { title: "问题按层处理", detail: "仍空闲时可重试意外退出的渲染器；静态背景漂移按需重跑Apply（应用图片）；想撤回时分别处理屏保参数、程序安装和原壁纸。" }
  ],
  responsibilities: ["保存并恢复已选Windows桌面/锁屏静帧与换机入口。", "用系统原生泡泡提供六分钟空闲覆盖层，并处理输入、暂停和渲染器恢复。", "让专属背景、原生泡泡、已有Wallpaper Engine和外部黑罩按各自职责共存。", "保存受影响设置的原状态，明确停用、还原、卸载和实际验证的区别。"],
  exclusions: ["不提供安全锁屏，也不改变用户主动锁定电脑的选择。", "不重新分发Windows的Bubbles.scr或微软泡泡素材。", "不添加网络、遥测、持久活动日志、屏幕截图或第二个输入监控系统。", "不接管Wallpaper Engine选图、播放列表或持久配置。", "已拒绝的猫分层草稿不属于现役功能，不作为待办自动恢复。"],
  sources: [
    { path: "docs/product-design.md", role: "原生泡泡、输入、显示、共存、恢复与验收边界。" },
    { path: "docs/windows-background.md", role: "静态图片恢复与跨机器使用说明。" },
    { path: "scripts/Set-WindowsBackground.ps1", role: "图片清单校验、原状态保存、应用与只读回读。" },
    { path: "scripts/Set-NativeBubbles.ps1 / scripts/Install-EmeraldVeil.ps1", role: "配置与安装分别负责的真实命令。" },
    { path: "src/EmeraldVeil.App / src/EmeraldVeil.Core", role: "常驻程序、窗口、进程、输入分类与状态恢复实现。" },
    { path: "assets/windows-background.json / assets/verdant-rain-4k.png / assets/emerald-veil-background.jpg", role: "两张独立图片与已接受的静帧参数。" },
    { path: "experiments/verdant-rain/ART_DIRECTION.md", role: "已认可雨幕与失败猫分层实验的明确边界。" },
    { path: "tests/EmeraldVeil.Core.Tests", role: "本轮37项核心、源码约定与控制命令进程回归测试。" }
  ],
  evolution: [
    { date: "2026-08", commit: "8c7d69e", result: "由原生泡泡承担画面，补齐输入过滤、六分钟空闲触发、渲染器恢复和可停用的用户会话入口。" },
    { date: "2026-08-31—09-05", commit: "f243bce", result: "把专属背景、窗口层级维护、Wallpaper Engine初始化协调与外部黑罩让位组合成日常桌面共存方案。" },
    { date: "2026-09-07", commit: "cf77883", result: "保留已认可的青雨静帧，增加Windows桌面/锁屏的独立恢复入口；动态雨幕留在实验中，未接受的猫分层不进入产品。" }
  ],
  snapshotUpdateNote: "本页按2026-09-08源代码、测试、本机回读与修复后安装更新。图片回读、程序安装、常驻运行、实屏与远端使用分别记录，观察时间之后的状态变化需再核对。"
};

export const emeraldVeilModules = [
  {
    id: "windows-desktop-and-lockscreen-background", slug: "windows-desktop-and-lockscreen-background", order: 1,
    title: "桌面与锁屏图片恢复", shortTitle: "桌面锁屏恢复",
    kicker: "同一张选定图片，重装和换机后都能再用",
    teaser: "恢复青雨4K静帧，保留原始图片记录，把正式引用放在本用户持久目录。",
    summary: "用一次性脚本把选定的青雨静帧设为Windows桌面和系统锁屏，核对固定图片模式与实际回读；之后移动项目目录不影响已设置图片。",
    status: "本机接口回读通过", statusTone: "accent", stateLabels,
    value: "图片和恢复入口放在一起，新电脑不必重新找图、猜颜色参数或依赖原来的用户名与盘符。",
    why: "只把图片路径指向开发或临时目录，后续搬家容易失效；桌面和锁屏又是两处独立设置。脚本保存已选图、明确分别设置与核对结果，避免看到一处正确就以为两处都好了。",
    example: "“这台新电脑也用青雨，锁屏一起换好。”带上脚本、清单和原PNG，运行Apply（应用图片）。它先保存这台电脑原有图片与设置，再把新图复制到本用户目录，分别设为桌面和锁屏；只想检查时运行Verify。",
    result: "返回明确的verified或drift及退出码，指出桌面/锁屏是否一致。原图记录还在，需要撤回时可在Windows个性化设置里选回；真实锁屏的裁剪与观感仍要实际看。",
    problem: "接口设置可能只成功一部分；脚本不是桌面与锁屏的原子事务。出现系统错误应按具体失败位置核对，保留已保存的原图记录后再处理。",
    relation: "只管理Windows原生静态图片。Wallpaper Engine可继续显示自己的动画，泡泡专属背景不从此入口加载。",
    readerStates: { pass: "两处都引用正确持久副本且处于固定图片模式时，脚本返回verified；重复Apply（应用图片）不重新设置。", problem: "Windows个性化或其他软件改变选图/模式后，Verify返回drift；想恢复选定图时再运行Apply（应用图片）。", unavailable: "图片缺失、哈希不符或Windows接口不可用时直接报告错误，不生成替代图、不锁定电脑。" },
    decisionImpact: ["只恢复图片无需安装泡泡或.NET SDK，64位Windows自带PowerShell即可。", "恢复新机器使用项目原图；原电脑的before-first-apply记录只用于撤回原电脑，不是新机器的设置来源。", "脚本不会在后台争抢。以后主动打开Wallpaper Engine的覆盖系统壁纸/锁屏选项可能再改原生图片，需要时按需重跑。"],
    concepts: [
      { term: "青雨 · 第二幕", explanation: "已选用的3840×2160静帧，保留原画与猫的完整轮廓；是sRGB SDR，不宣称HDR或10位输出。" },
      { term: "持久图片副本", explanation: "复制到%LOCALAPPDATA%\\EmeraldVeil\\windows-background的图，Windows引用它而非可移动的项目目录。" },
      { term: "解码后比较", explanation: "Windows可能重新编码锁屏缓存，脚本比较画面而非只比缓存文件字节，避免编码变化被误判为换图。" }
    ],
    implementation: [
      "读取assets/windows-background.json核对PNG的SHA-256；PowerShell 7或32位宿主转到64位Windows PowerShell，使用系统现成WinRT投影。",
      "桌面使用SystemParametersInfoW，锁屏使用Windows.System.UserProfile.LockScreen.SetImageFileAsync；没有IDesktopWallpaper第二套实现。",
      "三个每用户选择器BackgroundType、RotatingLockScreenEnabled、SlideshowEnabled都明确设为DWORD 0，以采用固定图片。",
      "首次应用前保存原桌面图（可读取时）、原锁屏图与选择器状态；临时写入再移动前像文件。图片引用必须在持久目录且源哈希匹配。",
      "锁屏图像检查宽高比后缩为128×72比较RGB均值，容差为3；本轮实际平均误差0。只有确有漂移才用带哈希前缀和新GUID的文件名重设，避开缓存旧图。"
    ],
    flow: ["读取选图与清单，先验证原图哈希。", "读取两处图片、固定模式及锁屏解码画面。", "Apply（应用图片）且有漂移时保存原始记录，补正确模式，复制并校验新持久副本。", "分别修改需要变化的桌面或锁屏，再完整回读；Verify只执行读取。", "打印结果和changedSurfaces；不符合返回1，系统错误直接报告。"],
    boundaries: ["仅需保留脚本、选图清单、PNG三个文件即可进行静态恢复；不依赖原机路径或Wallpaper Engine。", "不更改Wallpaper Engine，不启停泡泡，不锁定电脑，也不增加自启、服务或任务。", "原状态记录不是自动Restore命令；原壁纸与锁屏通过Windows设置按记录选回。"],
    failures: [
      { condition: "图像、固定模式或持久引用发生漂移", response: "Verify返回drift/1，不自动改图；Apply（应用图片）会按需要重设对应表面。" },
      { condition: "锁屏缓存只是重新编码", response: "通过解码画面容差比较判断，不因为缓存字节不同直接判失败。" },
      { condition: "磁盘写入或系统API失败", response: "报出实际错误；已成功的选择器或桌面修改可能保留，不能称整次自动回滚。原图记录仍用于核对和手动恢复。" }
    ],
    sources: [{ path: "docs/windows-background.md", role: "恢复、换机、原图和现有应用边界。" }, { path: "scripts/Set-WindowsBackground.ps1", role: "真实设置与只读回读实现。" }, { path: "assets/windows-background.json / assets/verdant-rain-4k.png", role: "选图、参数与完整静帧。" }],
    verification: ["本轮Verify为verified，desktop/lockScreen均true、锁屏平均像素差0，没有修改表面。", "脚本会在内容、模式和路径都正确时跳过；它不会主动进入锁屏。", "跨机操作与真实锁屏目视需分别做，本轮未重做；不能用接口结果推定观感完全一致。"],
    searchProjection: { intents: ["换电脑后恢复桌面壁纸和锁屏", "青雨静帧怎么设置", "壁纸图片移动后失效", "只检查锁屏是否仍是选定图片"], entities: ["Set-WindowsBackground.ps1", "windows-background.json", "verdant-rain-4k.png", "before-first-apply.json", "LockScreen"], relations: ["Apply（应用图片）按需恢复两处静态图，Verify只读核对", "原机器前像用于原机撤回，项目原图用于新机器恢复"], failureRecovery: ["drift后按需重新Apply（应用图片）", "系统错误按部分结果核对，原图手动选回"] }
  },
  {
    id: "native-bubbles-idle-overlay", slug: "native-bubbles-idle-overlay", order: 2,
    title: "原生泡泡、空闲触发与输入退出", shortTitle: "空闲泡泡",
    kicker: "等真正空闲才显示，正常操作时退开",
    teaser: "六分钟输入判断、两层画面与原生进程恢复，保留Windows自己的泡泡材质和运动。",
    summary: "本用户会话中的小程序等待可靠空闲，在专属背景上显示Windows原生泡泡，正常输入时隐藏并结束本次渲染；程序意外退出的恢复和窗口层级另有明确处理。",
    status: "六分钟配置与常驻程序已恢复", statusTone: "accent", stateLabels,
    value: "空闲时换成会动的画面，回来操作不需要多一次解锁；重复启动和旧渲染器残留有明确的控制。",
    why: "远程软件或设备可能发出指针位置根本没变的消息，导致屏保永远等不到空闲，或刚出现就消失。这里判断事件而非软件名字，同时保留正常输入、可靠计时和故障退出路径。",
    example: "“我去倒杯水，六分钟后再显示泡泡，回来动鼠标就继续。”程序运行且启用时按这个规则等待；一条无位移消息不会打断计时。若主动点托盘的15秒预览，则让这段预览显示完，期间输入不会提前结束。",
    result: "显示Windows原生大泡泡和项目专属背景，普通活动时先收起窗口，再结束受管进程。现有程序与六分钟配置已恢复；实际自然触发和退出画面仍按本次使用单独验收。",
    problem: "本轮修复前发现注册表超时600与运行时360不一致，且常驻程序没有运行；现已恢复。不能由37项测试通过再推定实屏和远端画面也已通过。",
    relation: "泡泡下面是嵌入的emerald-veil-background.jpg，不是Windows桌面刚换上的青雨PNG，也不是桌面截图。",
    readerStates: { pass: "可靠空闲达到360秒时自动显示；正常活动先隐藏窗口，再结束本次泡泡进程。", problem: "原生渲染器意外退出时，仍应显示就按1秒退避重试；用户已经回来则取消恢复。", unavailable: "计时不可靠、暂停或系统组件缺失时不自动显示；已有另一原生实例时拒绝再开，不抢占它。" },
    decisionImpact: ["零位移WM_MOUSEMOVE被过滤；孤立的注入移动仍送给应用，只暂不计为空闲活动。250ms内出现第二次注入移动才确认连续活动。", "物理移动、确认连续注入、按钮、滚轮和键盘都算活动；不记录按键内容、坐标历史或工具名单。", "托盘预览15秒刻意不因输入结束；--show-now入口和自然空闲显示会因输入收起，不能把两种体验写成相同。", "Windows主屏的物理矩形决定画面位置；泡泡大小由原生实现决定，显示/DPI（显示缩放）改变后先停止旧实例，再按当前状态重建。"],
    concepts: [{ term: "GetLastInputInfo", explanation: "系统最近一次输入时间，结合窄事件分类计算是否可靠空闲。" }, { term: "Job Object（作业对象）", explanation: "本次启动的泡泡归属一个关闭即杀子进程的系统对象，退出不靠寻找并接管别人的实例。" }, { term: "Color-key（色键透明）", explanation: "只把原生泡泡窗口的黑色设为透明，让紧贴其下的项目图片显露。" }],
    implementation: [
      "50ms采样配合IdleTimeline处理输入时钟；原始tick先于分类到达时先挂起一轮，下一轮仍未分类则算活动，不无限忽略未知输入。",
      "启用后以系统Bubbles.scr /s启动，不依赖Windows自动屏保触发。会话文件租约和同会话只读进程检查避免重复启动，已启动子进程归kill-on-close作业对象。",
      "Per-Monitor V2（每显示器DPI感知）在窗口创建前生效；Screen.PrimaryScreen.Bounds定位目标。选择交叠主屏的原生窗口，隐藏同进程其他可见窗口，不提供多屏任意排布配置器。",
      "WPF背景是不透明图片但输入穿透、不激活；原生泡泡加LAYERED、TRANSPARENT、NOACTIVATE、TOOLWINDOW和置顶。背景每100ms保持在所选泡泡HWND下，原生窗口每250ms维护边界与样式。",
      "原生窗口连续8次、约2秒维护失败才结束渲染器；状态协调在仍应显示时按1秒退避恢复。输入先隐藏窗口，再完成进程收口，50ms是采样周期而非所有机器的绝对完成时限。",
      "Radius DWORD 1130000000解释约218.43；当前Windows原生/s钳制最大半径200，名义直径400物理像素。4K下原生公式约26颗，不写SphereDensity，缩放比例不用于计算泡泡大小。"
    ],
    flow: ["读取输入，形成可靠空闲或活动观察。", "检查手动暂停、主动预览与外部黑罩标记。", "可靠空闲达到360秒后准备背景，取得本会话租约并启动系统泡泡。", "维护两层位置和原生窗口，持续对照实际渲染器是否存在。", "活动或停止时隐藏并收口；仍空闲但渲染器不在时按退避重试。"],
    boundaries: ["使用Windows已安装的Bubbles.scr，不复制微软二进制或重画泡泡。", "原生边缘、碰撞与数量由Windows决定；不承诺每颗泡泡始终完整在屏幕内。", "不做屏幕捕获、网络或持久活动记录；泡泡也不能保证防止OLED烙印。电池模式先息屏是另一条系统策略。"],
    failures: [{ condition: "原生泡泡缺失或已有实例", response: "缺失报错；重复实例拒绝启动且不接管它。仍满足显示条件时后续可重试。" }, { condition: "输入分类没有及时给出结果", response: "原始变化先挂起一轮，下一次仍未知就计为活动，保持可退出。" }, { condition: "渲染器退出或显示/DPI（显示缩放）改变", response: "停止旧实例；仍需显示则按状态与退避重新建立，不维持两个并存窗口。" }],
    sources: [{ path: "src/EmeraldVeil.Core", role: "空闲、分类、策略和状态协调。" }, { path: "src/EmeraldVeil.App/NativeBubblesLauncher.cs / VeilWindow.cs", role: "真实进程、Job Object及两层窗口。" }, { path: "src/EmeraldVeil.App/VeilController.cs / TrayIconHost.cs", role: "50ms循环、15秒预览与托盘控制。" }, { path: "docs/product-design.md", role: "显示、尺寸、输入和验收边界。" }],
    verification: ["本轮37项测试通过，含原36项核心/源码约定与新增控制命令非零退出回归。", "恢复后只有一个当前会话常驻程序，配置Verify通过；没有主动预览、改变空闲时间或注入输入来制造验收画面。", "真正的窗口层级、崩溃后无残留和退出延迟仍需对应实机验证，不从单元测试推定。"],
    searchProjection: { intents: ["电脑空闲六分钟出泡泡", "鼠标没动屏保却退出", "泡泡进程退出后留下后台进程", "托盘预览15秒", "大泡泡数量和缩放"], entities: ["Bubbles.scr", "GetLastInputInfo", "InputActivityFilter", "IdleTimeline", "Job Object", "VeilModeReconciler", "Radius"], relations: ["用户会话程序触发原生/s覆盖层", "独立图片背景在泡泡窗口下，50ms观察输入"], failureRecovery: ["渲染器退出仍空闲则1秒退避", "未知输入第二次采样接受为活动", "显示变化先停旧实例再建立"] }
  },
  {
    id: "wallpaper-engine-coexistence-and-rain-experiment", slug: "wallpaper-engine-coexistence-and-rain-experiment", order: 3,
    title: "和动态壁纸、外部黑罩共存", shortTitle: "壁纸与黑罩共存",
    kicker: "已有壁纸继续用，黑罩需要时泡泡让位",
    teaser: "说明Wallpaper Engine初始化协调、外部暂停标记，以及雨幕实验和系统图片的区别。",
    summary: "静态恢复不碰Wallpaper Engine；泡泡启动只短暂协调当前会话播放，外部黑罩持有暂停标记时不显示泡泡。已认可的动态雨幕仍是一份独立浏览器实验。",
    status: "实现已核对，本轮未触发共存实屏", statusTone: "accent", stateLabels,
    value: "保留现在用着的动态壁纸，让原生泡泡初始化时得到正确背景；主动黑屏保护开启时，泡泡不会反过来盖在黑罩上。",
    why: "原生泡泡初始化可能撞上动态壁纸的过渡画面，窗口层级也可能让其他桌面层插进来。另一个主动黑罩有自己的显示目的，不能由泡泡抢回来；这些冲突需要在各自入口处理。",
    example: "“动态壁纸别换掉，我打开主屏黑罩时泡泡也别冒出来。”泡泡启动时短暂停止同会话的Wallpaper Engine播放，等专属背景和泡泡窗口就绪后恢复；黑罩持有暂停标记期间，当前泡泡收起，新的空闲显示和主动预览都会让位。",
    result: "不用修改Wallpaper Engine的选图和配置；外部黑罩结束或最后持有者崩溃后，暂停标记自然消失，恢复原来的空闲/手动暂停策略。不会为此再建服务或定时任务。",
    problem: "控制器缺失、进程不唯一、命令非零退出或超时会导致本轮初始化失败；本轮没有证明实际暂停/续播画面。",
    relation: "原生泡泡共存是一条运行机制；动态雨幕属于独立实验，Windows桌面与锁屏实际采用已保存的静帧。",
    readerStates: { pass: "唯一当前会话Wallpaper Engine可协调时，准备背景与泡泡后恢复播放；没有运行该软件就跳过这一步。", problem: "识别不唯一、控制器缺失或初始化失败时收起背景并结束这次尝试，不能继续宣称无冲突。", unavailable: "外部黑罩标记存在时主动让位，不是故障；静态图片恢复仍可独立使用。" },
    decisionImpact: ["只识别当前会话唯一wallpaper64进程，通过同目录wallpaper32的-control stop/play临时控制，不改播放列表、壁纸选择或持久配置。", "现实现对Wallpaper Engine停止后等待2秒，再完成背景渲染与DWM合成；不是“毫秒级毫无等待”。", "外部黑罩用同会话命名句柄表示仍需保护，退出自动释放，避免一个忘记清理的文件让泡泡永久暂停。", "青雨雨幕参数已认可，不等于猫抠图方案通过；不把未接受的分层草稿当成壁纸新功能。"],
    concepts: [{ term: "DWM（桌面窗口合成器）", explanation: "等待背景确实进入一轮桌面合成后再初始化原生泡泡，减少取到暂态画面的机会。" }, { term: "ExternalProtectionPause（外部保护暂停）", explanation: "黑罩存续时持有的命名句柄；泡泡只读检查存在性，最后句柄关闭后恢复策略。" }, { term: "动态雨幕实验", explanation: "experiments/verdant-rain中的独立浏览器预览；保留已接受雨幕参数，不作为Windows动态壁纸或泡泡渲染器。" }],
    implementation: [
      "WallpaperEngineQuiescence解析当前会话wallpaper64的路径，取同目录wallpaper32.exe发stop/play；每个控制客户端等待上限3秒。进程不唯一或路径不可读会报错，不猜目标。",
      "VeilWindow在停止播放后等待2秒，显示背景，完成WPF Render和DwmFlush，再启动Bubbles并等窗口就绪；finally尝试恢复播放。0.1.26起检查控制进程非零退出并报错，但没有播放状态回读，因此命令成功仍不是播放画面证据。",
      "Local\\EmeraldVeil.ExternalProtectionPause以initiallyOwned=false创建，只持有句柄；50ms策略轮询及UI应用前都会检查，避免排队显示越过刚出现的黑罩。观察者立即关闭自己的探测句柄。",
      "外部标记存在时连预览都隐藏；消失后沿用现有idle、enabled和手动暂停状态，不改超时、启动项或显示拓扑。",
      "青雨雨幕保留vivid0.5、rain0.75、wind0、haze0.5、depth0、rainStyle1。Windows实际使用选定PNG，未接受的猫分层文件不进入构建或展示。"
    ],
    flow: ["需要显示泡泡时，先检查外部黑罩标记。", "有唯一Wallpaper Engine渲染器时，通过其控制客户端停止播放，等2秒。", "显示项目背景并等待合成，启动原生泡泡并等待对应窗口就绪。", "在finally中尝试恢复Wallpaper Engine播放；失败不能称续播已确认。", "外部标记后来出现时立即让位；标记消失后按原策略继续。"],
    boundaries: ["不改Wallpaper Engine持久配置，也不提供通用壁纸引擎适配框架；当前识别是wallpaper64及其wallpaper32控制客户端。", "不识别ToDesk、Sunshine等远程产品来决定暂停；黑罩必须通过明确的标记合作。", "猫分层视觉实验已停止，只有用户重新明确启动才重开；无需把失败草稿搬进网页作为能力。"],
    failures: [{ condition: "多个当前会话渲染器或控制客户端不存在", response: "拒绝猜测并结束本轮显示尝试，不随意停止其他壁纸进程。" }, { condition: "背景/原生窗口初始化或播放控制超时", response: "隐藏背景，finally尝试续播；当前实现没有远端或WE播放状态验收，不承诺画面已恢复。" }, { condition: "外部黑罩持有者崩溃", response: "最后句柄关闭后标记自然消失，恢复已有空闲和暂停策略；不留下持久暂停文件。" }],
    sources: [{ path: "src/EmeraldVeil.App/WallpaperEngineQuiescence.cs", role: "当前会话识别、控制命令与超时。" }, { path: "src/EmeraldVeil.App/VeilWindow.cs / VeilController.cs", role: "两秒等待、背景合成与UI前重查。" }, { path: "src/EmeraldVeil.Core/ExternalProtectionPause.cs", role: "句柄存在性检查。" }, { path: "experiments/verdant-rain/ART_DIRECTION.md / assets/windows-background.json", role: "已接受画面参数和未接受方案边界。" }],
    verification: ["本轮源码核对确认2秒停止等待、3秒控制客户端超时、finally续播和外部标记双重检查。", "外部暂停测试使用随机测试名称验证句柄生命周期，没有持有实际生产黑罩标记。", "Wallpaper Engine现场进程存在，不代表本轮已实测泡泡共存；没有启停它或触发泡泡。"],
    searchProjection: { intents: ["泡泡屏保与Wallpaper Engine共存", "黑罩开着时让泡泡暂停", "青雨动态雨幕和锁屏静帧什么关系"], entities: ["Wallpaper Engine", "WallpaperEngineQuiescence", "ExternalProtectionPause", "DWM", "verdant-rain"], relations: ["stop之后2秒等待，背景合成与泡泡就绪后尝试play", "外部黑罩句柄优先于空闲和预览"], failureRecovery: ["控制目标不唯一不猜测", "黑罩最后句柄关闭恢复原策略", "初始化失败finally尝试恢复播放"] }
  },
  {
    id: "reversibility-preimage-and-remote-compatibility", slug: "reversibility-preimage-and-remote-compatibility", order: 4,
    title: "安装、暂停、停用与原设置恢复", shortTitle: "启停与恢复",
    kicker: "知道怎么装，也知道怎样停下和撤回",
    teaser: "安装、配置、应急停止和恢复原设置分别处理；远程输入按相同桌面规则工作。",
    summary: "本用户安装一个不弹控制台的程序，保留精确原屏保状态；托盘暂停、Disable、Restore、Remove各有自己的作用，原静态图片则按另一份记录恢复。",
    status: "0.1.26安装与配置回读通过", statusTone: "accent", stateLabels,
    value: "出现干扰时能先停下来，不必先成功还原所有细节；以后不需要时能分清恢复设置、卸载程序和换回原图。",
    why: "暂停不是卸载，恢复原状态也不是恢复Windows默认值。把这些动作混成“一键无损回滚”会让用户不知道到底改回了什么；原始状态必须在首次修改前保存，重复操作也不能覆盖它。",
    example: "“今天先别出泡泡，以后可能还用。”托盘Pause protection（暂停保护）即可临时暂停，仍能手动看预览；若要关闭自动泡泡用Disable。彻底不用时根据需要先Restore原屏保设置，再Remove程序；想换回旧壁纸则按静态图片备份在Windows设置里选回。",
    result: "留下清楚的原状态与操作结果。泡泡不主动锁屏，因此不会要求用户为退出它再输密码；这不代替Windows锁定，也不证明每个远程客户端都已经测试。",
    problem: "安装验证不会证明自启已经执行，也不能猜出程序为何退出；本轮已恢复现有常驻与360秒配置。缺少或损坏原状态记录时，仍不能猜出第一次启用前的旧配置。",
    relation: "安装器负责程序和Run值，配置脚本负责屏保参数和前像，桌面/锁屏脚本负责图片；这些路径互相不能冒充。",
    readerStates: { pass: "正常安装后由一个直接Run值启动程序；原状态已经保存，分别选择暂停、停用、还原或卸载。", problem: "配置漂移会让Verify报告具体不一致。Disable采用较小的应急路径，即使非必要泡泡参数漂移也可关闭自动触发。", unavailable: "原状态记录缺失或不支持时Restore报错，不猜测旧值；安装目标冲突或程序制品缺失时也直接报错。" },
    decisionImpact: ["日常可在托盘预览15秒、暂停/恢复保护、切换Start with Windows（随Windows登录启动）或退出；暂停是当前程序状态，不承诺跨重启保存。", "Windows可能在登录或驱动重置后重新打开自己的屏保触发。程序启用且运行时会在启动和每30秒检查并修正运行时的六分钟、非锁屏、关闭自动触发策略，避免Windows另起一套屏保；程序退出后这项维护也停止。", "Enable首次记录runtime和相关注册表值的存在性、类型和值，原子落盘；重复Enable先校验而不覆盖第一次原状态。", "Disable关闭泡泡和自动触发，不还原Radius或旧超时；Restore才按前像恢复，Remove另行删除已装程序与启动项。", "远程兼容靠不主动切换到安全桌面、输入穿透、不抢焦点；实际连接与画面仍由客户端验收，不按软件名称声称全兼容。"],
    concepts: [{ term: "Preimage（变更前状态）", explanation: "第一次Enable前保存的相关配置；记录精确存在性、类型、值和运行时，不是整机镜像。" }, { term: "WinExe（无控制台应用）", explanation: "直接登录启动一个本用户图形程序，无需PowerShell常驻包装、服务或计划任务。" }, { term: "当前交互桌面", explanation: "用户现在操作的桌面，泡泡保持在这里；不会自行进入Windows锁屏或凭据输入桌面。" }],
    implementation: [
      "Install默认读取artifacts/publish/win-x64/EmeraldVeil.exe，复制到%LOCALAPPDATA%\\Programs\\EmeraldVeil；使用暂存文件与哈希检查，再设置唯一Emerald Veil Native Bubbles Run值。源码构建目标net10.0-windows。",
      "Set-NativeBubbles保存emerald-veil.native-bubbles-preimage.v2，其中runtime含active/timeout_seconds/secure，registry_values逐项记录受影响值，含enabled与旧启动元数据；兼容v1。",
      "Enable配置360秒、非安全退出、Windows自动触发关闭与项目enabled。它核对已有Run项，不负责安装该项；先安装再启用。",
      "登录启动时若项目启用，常驻程序修正Windows运行时false/360/false；随后每30秒检查并修正运行时漂移，不重写全部注册表参数。",
      "Disable匹配系统路径的原生泡泡进程并停止，清除enabled并维持active=false；Restore停止泡泡后按前像回填相关状态，并在操作失败时尝试恢复本次操作前状态。",
      "不安装通用键盘记录器；输入分类只保留有限内存状态，点击穿透和不激活让普通输入继续送往当前应用。"
    ],
    flow: ["从源码使用.NET 10 SDK构建单文件制品，再Install安装程序与直接Run项。", "Enable先保存并验证第一次原状态，再配置本项目泡泡策略。", "需要时分别用配置Verify、安装Verify、进程观察和实际画面判断，不能相互替代。", "暂时暂停用托盘；应急关闭用Disable；按原状态撤回用Restore。", "不再需要程序时Remove；旧桌面和锁屏按另一份图片记录在Windows设置中选回。"],
    boundaries: ["本用户安装不需管理员；从源码构建泡泡程序需要.NET 10 SDK，静态图片恢复不需要它。", "源仓库不存机器前像、个人日志或微软系统组件；卸载不意味着删除所有恢复记录。", "原生泡泡不是安全锁屏；需要锁定电脑时仍由用户和Windows正常处理。"],
    failures: [{ condition: "原状态缺失、损坏或schema不支持", response: "Restore直接报错，无法替用户猜旧设置；Disable不依赖完整前像，可用于先关闭自动泡泡。" }, { condition: "程序制品缺失或已有安装目标冲突", response: "安装器报出具体目标，避免覆盖不属于该安装的文件；不伪造安装完成。" }, { condition: "启用标志和Run值存在，但程序未运行", response: "分开报告安装、配置和运行证据，核对退出原因后再恢复；不能由注册表正常推定六分钟空闲功能正在工作。" }],
    sources: [{ path: "scripts/Install-EmeraldVeil.ps1", role: "Install / Verify / Remove与实际制品路径。" }, { path: "scripts/Set-NativeBubbles.ps1", role: "Enable / Verify / Disable / Restore及v1/v2前像。" }, { path: "src/EmeraldVeil.App/App.xaml.cs / NativeBubblesSettings.cs / TrayIconHost.cs", role: "登录策略修正、托盘控制和30秒运行时维护。" }, { path: "docs/product-design.md", role: "原状态、远程输入、实机验收边界。" }],
    verification: ["本轮通过既有安装器更新0.1.26，制品与安装文件SHA-256相同，唯一直接WinExe启动项核对通过。", "既有Enable修正超时值后Verify通过：注册表与运行时均360秒，active和secure均false；首次前像哈希未改变。新安装程序在当前会话正常运行。", "没有执行Disable、Restore、锁屏或真实远端验证；原停止原因未有充分证据，不把重新运行写成已证明根治所有退出。"],
    searchProjection: { intents: ["暂停EmeraldVeil泡泡", "卸载泡泡并还原Windows原设置", "已安装但泡泡没有运行", "屏保会不会锁住远程桌面"], entities: ["Install-EmeraldVeil.ps1", "Set-NativeBubbles.ps1", "native-bubbles-preimage.json", "Disable", "Restore", "Pause protection"], relations: ["安装器负责程序和Run项，Enable负责屏保策略", "Restore恢复原设置不是Windows默认值，Remove才卸载"], failureRecovery: ["原状态缺失不猜测，先Disable关闭自动泡泡", "配置漂移和运行停止分别核对", "远程客户端实际连接才证明对应使用结果"] }
  }
];

export const project = emeraldVeilProject;
export const modules = emeraldVeilModules;
