// One public relationship source for project / Skill navigation. A Skill is
// linked only when current project evidence proves implementation ownership or
// a real runtime dependency. Source location inside .agents is never enough.
export const skillProjectLinks = {
  "learning": [
    {
      relation: "owned-by-project",
      projectSlug: "learning",
      label: "学习方法项目"
    }
  ],
  "cloud-asset-channel": [
    {
      relation: "owned-by-project",
      projectSlug: "agents",
      moduleSlug: "skills-plugins",
      label: ".agents 云端素材通道"
    },
    {
      relation: "rules",
      href: "/rules/?rule=capabilities_runtime_contract#rule-panel-capabilities_runtime_contract",
      label: "现行云端素材通道规则"
    }
  ],
  "cockpit": [
    {
      relation: "presentation-infrastructure",
      href: "/cockpit/",
      label: "驾驶舱：当前状态与需要你"
    },
    {
      relation: "uses-project",
      projectSlug: "pcconfig",
      moduleSlug: "machine-facts",
      label: "PCConfig：状态来源与事项登记"
    }
  ],
  "report-page": [
    {
      relation: "owned-by-project",
      projectSlug: "agents",
      moduleSlug: "skills-plugins",
      label: ".agents 本地汇报网页能力"
    }
  ],
  "explain-to-me": [
    { relation: "owned-by-project", projectSlug: "personal-expression", moduleSlug: "explain-to-me", label: "个人表达：向本人讲明白" }
  ],
  "reply-as-me": [
    { relation: "owned-by-project", projectSlug: "personal-expression", moduleSlug: "reply-as-me", label: "个人表达：替本人拟消息" }
  ],
  "chinese-asr": [
    { relation: "owned-by-project", projectSlug: "chinese-asr", moduleSlug: "task-routing", label: "ChineseASR 项目" }
  ],
  "media-person-self": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" },
    { relation: "uses-project", projectSlug: "chinese-asr", moduleSlug: "speaker-attribution", label: "ChineseASR 的语音归属能力" }
  ],
  "timeaudit-diagnostics": [
    { relation: "owned-by-project", projectSlug: "timeaudit", moduleSlug: "hardware-performance", label: "TimeAudit：历史指标与健康技术参考" },
    { relation: "uses-project", projectSlug: "pcconfig", moduleSlug: "machine-facts", label: "PCConfig：综合卡顿与原生内存证据" }
  ],
  "project-entry-gate": [
    { relation: "owned-by-project", projectSlug: "github-index", moduleSlug: "project-admission", label: "GitHub 总索引" }
  ],
  "personal-health": [
    { relation: "owned-by-project", projectSlug: "personal-health", moduleSlug: "current-evidence-route", label: "个人健康项目" },
    { relation: "uses-project", projectSlug: "personal-health", moduleSlug: "protected-foreground-refresh", label: "设备前台更新" }
  ],
  "daily-preferences": [
    { relation: "owned-by-project", projectSlug: "daily-preferences", moduleSlug: "personal-understanding", label: "个人理解库项目" },
    { relation: "uses-project", projectSlug: "daily-preferences", moduleSlug: "mobile-context-delivery", label: "手机与云端使用同一理解库" }
  ],
  "local-secret-broker": [
    { relation: "owned-by-project", href: "/projects/password-center", label: "密码中心：凭据、验证与程序供给" },
    { relation: "uses-project", projectSlug: "pcconfig", moduleSlug: "secrets-providers", label: "PCConfig：本机安装与恢复接线" }
  ],
  "google-workspace-direct": [
    { relation: "owned-by-project", projectSlug: "pcconfig", moduleSlug: "secrets-providers", label: "PCConfig：Gmail、Drive 与 Google Tasks 固定入口" }
  ],
  "authorization-file-broker": [
    { relation: "owned-by-project", href: "/projects/password-center", label: "密码中心：文件加密、本地编辑与恢复" },
    { relation: "uses-project", projectSlug: "pcconfig", moduleSlug: "authorization-files", label: "PCConfig：文件加密安装与恢复接线" }
  ],
  "localocr": [
    { relation: "owned-by-project", projectSlug: "localocr", moduleSlug: "input-routing", label: "LocalOCR 本地文字识别与文档解析" }
  ],
  "personal-materials": [
    { relation: "owned-by-project", projectSlug: "personal-materials", moduleSlug: "registered-lookup", label: "个人材料查找项目" }
  ],
  "wechat-direct": [
    { relation: "owned-by-project", projectSlug: "wechat-direct", moduleSlug: "bounded-chat-context", label: "WeChatDirect 项目" },
    { relation: "uses-project", projectSlug: "chinese-asr", moduleSlug: "task-routing", label: "中文语音转写项目" }
  ],
  "document-materials": [
    { relation: "owned-by-project", projectSlug: "document-materials", moduleSlug: "current-matter-sources", label: "文书和材料制作项目" }
  ],
  "vault-workflow": [
    { relation: "owned-by-project", projectSlug: "vault-tool", moduleSlug: "ai-local-interface", label: "vault-tool 本地文件加密与恢复" },
    { relation: "no-detail-project", systemAssetId: "key", label: "私有发布目标：Key" }
  ],
  "work-delivery": [
    { relation: "owned-by-project", projectSlug: "work-delivery", moduleSlug: "package-sources", label: "工作支持与交付项目" }
  ],
  documents: [
    { relation: "host-integrated", href: "/skills/#skill-documents", label: "宿主集成文档能力" }
  ],
  pdf: [
    { relation: "host-integrated", href: "/skills/#skill-pdf", label: "宿主集成 PDF 能力" }
  ],
  "md-to-pdf": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" }
  ],
  "pdf-render-safe": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" }
  ],
  "mojibake-doctor": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" }
  ],
  "browser-control-continuity": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 浏览器连续性能力" }
  ],
  "personal-media": [
    { relation: "owned-by-project", projectSlug: "personal-media", moduleSlug: "search-browse", label: "个人媒体整理与恢复项目" }
  ],
  "tailscale-safe-exposure": [
    { relation: "cross-cutting", label: "跨机器事实、目标服务与远程连接，不设单一项目 Owner" },
    { relation: "uses-project", projectSlug: "sunshine-remote-streaming", label: "Sunshine：串流路径与恢复技术参考" },
    { relation: "uses-project", projectSlug: "meshclip-kit", label: "meshclip-kit：诊断与中断恢复技术参考" }
  ]

};

export const projectReferenceLinks = {
  agents: [
    { relation: "rules", href: "/rules", label: "查看现行规则专题" }
  ],
  pcconfig: [
    { relation: "uses-project", href: "/projects/personal-materials/registered-lookup", label: "不知道原件放在哪里：进入个人材料查找" }
  ],
  "personal-media": [
    { relation: "skill", href: "/skills/personal-media", label: "Skill：个人照片、视频与录音检索" }
  ],
  "personal-materials": [
    { relation: "skill", href: "/skills/personal-materials", label: "Skill：非媒体原件查找" }
  ],
  "document-materials": [
    { relation: "skill", href: "/skills/document-materials", label: "Skill：文书和材料制作" },
    { relation: "uses-project", href: "/projects/personal-materials/registered-lookup", label: "位置未知时先找原件" }
  ],
  "wechat-direct": [
    { relation: "uses-project", href: "/projects/chinese-asr/task-routing", label: "语音转写交给 ChineseASR" }
  ]

};

export const capabilityRelationLabels = {
  "owned-by-project": "对应项目",
  "uses-project": "依赖项目",
  "no-detail-project": "对应项目 · 详情逐步收录",
  "host-integrated": "宿主能力",
  "unlisted-project": "对应项目",
  "presentation-infrastructure": "呈现基础设施",
  "cross-cutting": "跨项目能力",
  skill: "能力入口",
  rules: "现行规则"

};
