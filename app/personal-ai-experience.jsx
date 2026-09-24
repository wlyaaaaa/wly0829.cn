import { personalAiImages, personalAiSnapshotDate, personalCodexTotalLabel } from "./personal-ai-experience.js";
import "./personal-ai-experience.css";

export default function PersonalAiExperience({ Gallery, compact = false }) {
  const images = compact ? personalAiImages.slice(0, 3) : personalAiImages;
  return (
    <section id="personal-ai-experience" className={`personal-ai-experience${compact ? " system-frame personal-ai-experience-system" : " personal-ai-experience-project"}`} aria-labelledby="personal-ai-experience-title">
      <div className="personal-ai-experience-intro">
        <div className="personal-ai-experience-story">
          <p className="section-kicker">我的 AI 实践</p>
          <h2 id="personal-ai-experience-title">长期用、大量用，也把 AI 接进真实工作</h2>
          <p>我长期在实际工作里使用不同模型、编程工具和 Agent（智能体），积累了丰富的使用与协作经验。除了 Codex、Claude Code，我还用过 Grok Build、Google Antigravity、OpenCode、Cline、Qoder 等工具；OpenClaw 刚开始受到关注时，我就已经积极尝试。</p>
          <p>我自己的 Codex 工作环境已接入 GLM、DeepSeek、Qwen，提供国产模型 Agent 能力。我仍在持续使用和尝试，经验也会继续积累；这里留下的是这一天的记录。</p>
        </div>
        <div className="personal-ai-experience-total">
          <p className="personal-ai-experience-number"><span>约</span> <strong>{personalCodexTotalLabel}</strong><span>亿 tokens</span></p>
          <p>我的 Codex 五份独立使用记录合计</p>
          <p className="personal-ai-experience-date">快照更新于{personalAiSnapshotDate}</p>
          <small>按五张截图显示的累计数相加；只统计 Codex，不是所有 AI 平台总量，也不是实时计数。</small>
        </div>
      </div>
      <div className="personal-ai-experience-notes">
        <p><strong>截图能展示的范围：</strong>受这次可获取统计的限制，国产模型这组记录只能展示约一个月，不代表我的全部历史用量。其他平台各按自己的口径展示，没有加进上面的 Codex 合计。</p>
        <p><strong>Claude Code 的历史：</strong>我的账号于 2026年6月30日被封，此前的历史统计现在无法展示。按我本人的使用经历，之前已经用了数亿 tokens；这部分没有计入上面的数字。</p>
      </div>
      <Gallery title="我的 AI 使用记录" images={images} presentation={{
        variant: "personal-ai-gallery",
        kicker: "本人使用记录",
        title: compact ? "先看三张 Codex 记录" : "从 Codex 到更多模型与工具",
        description: compact ? "这里精选三张，完整的 11 张截图放在 .agents 页。" : "共 11 张不同原图：五份 Codex 累计记录，以及其他模型和工具的统计或订阅界面。"
      }} />
      {compact ? <a className="personal-ai-experience-more" href="/projects/agents/#personal-ai-experience">查看全部 11 张使用截图与说明 <span aria-hidden="true">→</span></a> : <p className="personal-ai-experience-gallery-hint">手机上可以左右滑动浏览，点任意图片查看完整原图。</p>}
    </section>
  );
}
