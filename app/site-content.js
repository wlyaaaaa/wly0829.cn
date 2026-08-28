export const navLinks = [
  { label: "项目", href: "#projects" },
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
    category: "中文语音转写",
    summary:
      "在本地把中文录音转成可复核的文字，也保留两套模型的分歧，方便回头核对。",
    stack: ["Python", "ASR", "Local-first"],
    href: "https://github.com/wlyaaaaa/ChineseASR"
  },
  {
    number: "02",
    title: "AI CLI Profile Manager",
    category: "AI CLI 管理",
    summary:
      "把多套 AI CLI 的 Profile、模型、启动和体检收进一个 Windows 入口，让工作流可切换、可诊断。",
    stack: ["PowerShell", "Windows", "Multi-model"],
    href: "https://github.com/wlyaaaaa/ai-cli-profile-manager"
  },
  {
    number: "03",
    title: "LocalOCR",
    category: "本地中文 OCR",
    summary:
      "在本地处理中文截图和扫描件，按内容在 OCR、视觉语言模型和结构化识别之间自动分流。",
    stack: ["Python", "PaddleOCR", "GPU"],
    href: "https://github.com/wlyaaaaa/LocalOCR"
  },
  {
    number: "04",
    title: "Video Scaffold",
    category: "视频工作流",
    summary:
      "把脚本、TTS、词级时间轴、SVG 动画和 4K 合成串成一条可重复运行的本地视频生产线。",
    stack: ["Python", "TTS", "4K Pipeline"],
    href: "https://github.com/wlyaaaaa/video-scaffold"
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
