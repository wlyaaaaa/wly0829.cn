export const navLinks = [
  { label: "项目", href: "#projects" },
  { label: "未公开", href: "#private" },
  {
    label: "GitHub",
    href: "https://github.com/wlyaaaaa",
    ariaLabel: "在新窗口打开吴乐阳的 GitHub",
    newWindow: true
  },
  {
    label: "邮件",
    href: "mailto:hello@wly0829.cn",
    ariaLabel: "发送邮件至 hello@wly0829.cn"
  }
];

export const projects = [
  {
    number: "01",
    title: "ChineseASR",
    category: "做出来了",
    question:
      "为什么转写只能给一个答案，不能把两套模型的分歧留下来？",
    outcome:
      "最后做成了本地双模型转写：两边说得不一样的地方不会被抹掉，可以回头听。",
    stack: ["Python", "ASR", "Local-first"],
    href: "https://github.com/wlyaaaaa/ChineseASR"
  },
  {
    number: "02",
    title: "AI CLI Profile Manager",
    category: "自己在用",
    question:
      "为什么工具越来越多，配置却要到处切？",
    outcome:
      "于是把常用 AI CLI 的 Profile、模型、代理和体检收进一个 Windows 入口。这是我每天会用的那种。",
    stack: ["PowerShell", "Windows", "Multi-model"],
    href: "https://github.com/wlyaaaaa/ai-cli-profile-manager"
  },
  {
    number: "03",
    title: "LocalOCR",
    category: "还在折腾",
    question:
      "为什么没读出来，就敢说图片里没有文字？",
    outcome:
      "这里最重要的是分清没读出来、低置信和真的没有字；需要时再换另一种本地识别方式。",
    stack: ["Python", "PaddleOCR", "GPU"],
    href: "https://github.com/wlyaaaaa/LocalOCR"
  },
  {
    number: "04",
    title: "Video Scaffold",
    category: "做出来了",
    question:
      "为什么一段文字不能一路变成配音、字幕和视频？",
    outcome:
      "脚本、TTS、词级时间轴、SVG 动画、4K 合成——现在可以从头跑到尾。",
    stack: ["Python", "TTS", "4K Pipeline"],
    href: "https://github.com/wlyaaaaa/video-scaffold"
  }
];

export const privateIdeas = [
  {
    number: "A1",
    title: "本地微信上下文助手",
    status: "已落地 · 私有自用",
    question: "小窗口容易缺上下文，整账号同步又太重，能不能只处理点名的一段？",
    outcome:
      "做成了一个只读的本地工具：只看指定对象的上下文，不做整账号同步，也不公开聊天。",
    shape: "wide"
  },
  {
    number: "A2",
    title: "手机远程工作站",
    status: "已落地 · 持续自用",
    question: "手机在外网用个人工作站，怎样尽量不把主机原有的显示现场弄乱？",
    outcome:
      "远程画面和传输网络分开处理，主屏优先、显示兜底；复杂的显示恢复还在继续加固。",
    shape: "tall"
  },
  {
    number: "B1",
    title: "AI 智能体能力评测实验室",
    status: "研究中",
    question: "榜单把模型、Agent 工具和运行失败混成一个分数时，这个排名还能说明什么？",
    outcome:
      "评测框架和可复验题库已经实现，排名方法仍在校正，所以暂时不发布“谁更强”。",
    shape: "wide-low"
  }
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/wlyaaaaa",
    ariaLabel: "在新窗口打开吴乐阳的 GitHub"
  },
  {
    label: "X",
    href: "https://x.com/wlyaaaaaaa",
    ariaLabel: "在新窗口打开吴乐阳的 X"
  },
  {
    label: "哔哩哔哩",
    href: "https://space.bilibili.com/179179701",
    ariaLabel: "在新窗口打开吴乐阳的哔哩哔哩主页"
  }
];
