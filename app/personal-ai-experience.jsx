import { personalAiImages, personalAiSnapshotDate, personalCodexTotalLabel } from "./personal-ai-experience.js";
import "./personal-ai-experience.css";

function ExperienceConnections() {
  return (
    <div className="personal-ai-connections" aria-label="我已经接入的能力">
      <article>
        <span className="personal-ai-connection-label">国产模型也能做 Agent</span>
        <h3>Codex × GLM / DeepSeek / Qwen</h3>
        <p>我自己的 Codex 环境已接入这些模型，让国产模型参与实际的智能体任务。</p>
      </article>
      <article>
        <span className="personal-ai-connection-label">从深度思考到电脑操作</span>
        <h3>ChatGPT × 电脑 MCP</h3>
        <p>我在已有 ChatGPT 订阅内使用 GPT-6 Astra Pro，通过电脑 MCP 做长任务、开多个对话持续操作电脑。</p>
        <p className="personal-ai-subscription"><strong>不另付 API 费用 · 不占 Codex 用量</strong><small>按我的订阅内使用方式记录；ChatGPT 套餐规则仍适用。</small></p>
        <a href="/mcp/">了解电脑接入 <span aria-hidden="true">→</span></a>
      </article>
    </div>
  );
}

export default function PersonalAiExperience({ Gallery, compact = false }) {
  return (
    <section id="personal-ai-experience" className={"personal-ai-experience" + (compact ? " system-frame personal-ai-experience-system" : " personal-ai-experience-project")} aria-labelledby="personal-ai-experience-title">
      <div className="personal-ai-experience-intro">
        <div className="personal-ai-experience-story">
          <p className="section-kicker">我的 AI 实践</p>
          <h2 id="personal-ai-experience-title">我的 AI 实战积累</h2>
          <p>{compact
            ? "我长期使用 AI 处理实际工作和项目开发，积累了丰富的模型使用与智能体协作经验。OpenClaw 刚受到关注时，我就已经积极尝试。"
            : "我长期把 AI 用在实际工作和项目开发中，积累了丰富的模型使用与智能体协作经验。除了 Codex、Claude Code，我还用过 Grok Build、Google Antigravity、OpenCode、Cline、Qoder 等工具；OpenClaw 刚受到关注时，我就已经积极尝试。"}</p>
          {!compact && <p className="personal-ai-experience-continuing">使用还在继续，经验也在增加。这里保留的是我的个人记录，快照截至 {personalAiSnapshotDate}。</p>}
        </div>
        <div className="personal-ai-experience-total">
          <p className="personal-ai-total-label">个人 Codex 累计用量</p>
          <p className="personal-ai-experience-number"><span>约</span><strong>{personalCodexTotalLabel}</strong><span>亿 tokens</span></p>
          <p>我的 Codex 五份独立使用记录合计</p>
          <small>按截图所示累计数相加，仅含 Codex；未合并其他平台用量。</small>
          <p className="personal-ai-experience-date">{personalAiSnapshotDate} 快照 · 非实时统计</p>
          {compact && <Gallery title="Codex 使用记录" images={personalAiImages.slice(0, 3)} presentation={{
            id: "personal-ai-preview",
            variant: "personal-ai-gallery personal-ai-preview-gallery",
            headingLevel: 3,
            compactCards: true,
            title: "Codex 原图预览",
            kicker: "",
            description: "单击图片放大"
          }} />}
        </div>
        <ExperienceConnections />
      </div>
      {compact ? (
        <div className="personal-ai-experience-footer">
          <p>持续实践中 · 更多工具经历、历史说明与原始截图</p>
          <a className="personal-ai-experience-more" href="/projects/agents/#personal-ai-experience">查看完整经历与 11 张原图 <span aria-hidden="true">→</span></a>
        </div>
      ) : (
        <>
          <Gallery title="我的 AI 使用记录" images={personalAiImages} presentation={{
            id: "personal-ai-records",
            variant: "personal-ai-gallery",
            headingLevel: 3,
            kicker: "本人使用记录",
            title: "从 Codex 到更多模型与工具",
            description: "11 张不同原图，点击任意一张查看完整记录。",
            groups: [
              { startIndex: 0, title: "五份 Codex 累计记录", description: "521.9 + 204.4 + 296.5 + 378.2 + 520.1 = 1,921.1 亿 tokens。五份记录独立，均为我的个人使用记录。" },
              { startIndex: 5, title: "其他模型与工具", description: "受这次可获取统计的限制，国产模型这组记录只能展示约一个月，不代表全部历史用量。各平台口径分别保留，未计入上面的 Codex 合计。" }
            ]
          }} />
          <div className="personal-ai-experience-notes">
            <div><h3>这只是能展示出来的一部分</h3><p>GLM、DeepSeek、Qwen 展示各自可获取的用量记录；OpenCode 展示该工具的统计；Antigravity、Grok 展示订阅与使用界面。订阅界面不代表累计用量，其他工具经历也没有全部留下截图。</p></div>
            <div><h3>Claude Code 的历史记录</h3><p>我的账号于 <strong>2026年6月30日被封</strong>，此前的历史统计现在无法展示。按我本人的使用经历，之前已经用了<strong>数亿 tokens</strong>；这部分没有计入上面的数字。</p></div>
          </div>
        </>
      )}
    </section>
  );
}
