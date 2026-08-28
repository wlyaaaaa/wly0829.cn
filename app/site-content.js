export const navLinks = [
  { label: "方法", href: "#thinking" },
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

export const principles = [
  {
    number: "01",
    title: "先判问题，再选技术",
    summary:
      "先确认目标用户、真实任务、失败代价和成功标准，再决定该用规则、Workflow、RAG 还是 Agent。"
  },
  {
    number: "02",
    title: "把边界设计进体验",
    summary:
      "权限、隐私、人工确认、降级与回退不是上线前的附加项，而是产品本身的一部分。"
  },
  {
    number: "03",
    title: "用真实任务完成收尾",
    summary:
      "代码通过只是中间状态；最终要看真实输入、可见结果、异常路径和部署回读是否闭合。"
  }
];

export const projects = [
  {
    number: "01",
    title: "ChineseASR",
    category: "可审计语音转写",
    summary:
      "在本地把中文录音转成可复核文本，并保留双模型分歧、异常检测和输入证据。",
    stack: ["Python", "ASR", "Local-first"],
    href: "https://github.com/wlyaaaaa/ChineseASR"
  },
  {
    number: "02",
    title: "AI CLI Profile Manager",
    category: "多模型工作台",
    summary:
      "把多套 AI CLI 的 Profile、模型、启动和体检收进一个 Windows 入口，让工作流可切换、可诊断。",
    stack: ["PowerShell", "Windows", "Multi-model"],
    href: "https://github.com/wlyaaaaa/ai-cli-profile-manager"
  },
  {
    number: "03",
    title: "LocalOCR",
    category: "文档理解基础设施",
    summary:
      "在本地对中文截图与扫描件做 OCR、视觉语言模型和结构化分流，并保留坐标与置信度。",
    stack: ["Python", "PaddleOCR", "GPU"],
    href: "https://github.com/wlyaaaaa/LocalOCR"
  },
  {
    number: "04",
    title: "Video Scaffold",
    category: "可复用视频流水线",
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
