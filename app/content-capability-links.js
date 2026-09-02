// One public relationship source for project / Skill navigation. A Skill is
// linked only when current project evidence proves implementation ownership or
// a real runtime dependency. Source location inside .agents is never enough.
export const skillProjectLinks = {
  "chinese-asr": [
    { relation: "owned-by-project", projectSlug: "chinese-asr", moduleSlug: "task-routing", label: "ChineseASR 项目" }
  ],
  "media-person-self": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" },
    { relation: "uses-project", projectSlug: "chinese-asr", moduleSlug: "speaker-attribution", label: "ChineseASR 的语音归属能力" }
  ],
  "timeaudit-diagnostics": [
    { relation: "owned-by-project", projectSlug: "timeaudit", moduleSlug: "hardware-performance", label: "TimeAudit 项目" }
  ],
  "project-entry-gate": [
    { relation: "owned-by-project", projectSlug: "github-index", moduleSlug: "project-admission", label: "GitHub 总索引" }
  ],
  "personal-health": [
    { relation: "owned-by-project", projectSlug: "personal-health", moduleSlug: "current-evidence-route", label: "个人健康项目" },
    { relation: "uses-project", projectSlug: "personal-health", moduleSlug: "protected-foreground-refresh", label: "设备前台更新" }
  ],
  "daily-preferences": [
    { relation: "owned-by-project", projectSlug: "daily-preferences", moduleSlug: "recommendation-choice", label: "日常偏好与个性化推荐项目" }
  ],
  "local-secret-broker": [
    { relation: "owned-by-project", projectSlug: "pcconfig", moduleSlug: "secrets-providers", label: "PCConfig 凭据中心" }
  ],
  "google-workspace-direct": [
    { relation: "owned-by-project", projectSlug: "pcconfig", moduleSlug: "secrets-providers", label: "PCConfig 固定办公服务入口" }
  ],
  "authorization-file-broker": [
    { relation: "owned-by-project", projectSlug: "pcconfig", moduleSlug: "secrets-providers", label: "PCConfig 最高权限文件入口" }
  ],
  "native-economy-routing": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "capability-routing", label: ".agents 协作路由" }
  ],
  "localocr": [
    { relation: "no-detail-project", systemAssetId: "local-ocr", label: "LocalOCR 精确文字与版面项目" }
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
  "llm-backend-toolkit": [
    { relation: "no-detail-project", systemAssetId: "llm-backend-toolkit", label: "额外 AI 长任务执行器" }
  ],
  "vault-workflow": [
    { relation: "no-detail-project", systemAssetId: "vault-tool", label: "实现项目：本地加密保险库" },
    { relation: "no-detail-project", systemAssetId: "key", label: "私有发布目标：Key" }
  ],
  "work-delivery": [
    { relation: "owned-by-project", projectSlug: "work-delivery", moduleSlug: "package-sources", label: "工作交付副驾驶项目" }
  ],
  documents: [
    { relation: "host-integrated", href: "/#system-node-documents-skill", label: "宿主集成文档能力" }
  ],
  pdf: [
    { relation: "host-integrated", href: "/#system-node-pdf-skill", label: "宿主集成 PDF 能力" }
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
  "file-intake-router": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "capability-routing", label: ".agents 能力路由" }
  ],
  "personal-media": [
    { relation: "unlisted-project", label: "对应本地项目尚未收录详情" }
  ],
  "personal-panel-refresh": [
    { relation: "presentation-infrastructure", label: "由当前网站呈现仓库实现，不作为展示项目" }
  ],
  "tailscale-safe-exposure": [
    { relation: "cross-cutting", label: "跨机器事实、目标服务与远程连接，不设单一项目 Owner" }
  ],
  "control-plane-doctor": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "context-evidence", label: ".agents 跨控制面上下文" },
    { relation: "uses-project", projectSlug: "github-index", moduleSlug: "project-admission", label: "GitHub 项目事实" },
    { relation: "uses-project", projectSlug: "pcconfig", moduleSlug: "machine-facts", label: "PCConfig 机器事实" }
  ],
  "token-budget-advisor": [
    { relation: "owned-by-project", projectSlug: "agents", moduleSlug: "skills-plugins", label: ".agents 能力与插件供应" },
    { relation: "host-integrated", label: "宿主账号与计量入口" }
  ]
};

export const projectReferenceLinks = {
  agents: [
    { relation: "rules", href: "/rules", label: "查看 5 份现行规则" }
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
