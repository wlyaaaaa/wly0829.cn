import { createContinuationContext, serializeContinuationContext } from "./continuation-brief.js";

export function ProjectContinuation({ entry, module }) {
  const context = createContinuationContext(entry);
  const id = `continuation-${entry.project.slug}-${module?.slug || "project"}`;
  return (
    <details className="continuation-brief" data-continuation-brief="" id={id}>
      <summary className="continuation-summary">
        <span><strong>复制 AI 续作说明</strong><span>带着这个项目，交给 AI 接着做</span></span>
        <span className="continuation-toggle" aria-hidden="true">+</span>
      </summary>
      <div className="continuation-body">
        <p className="continuation-intro" id={`${id}-intro`}>写下接下来想做什么。这里会把你的目标、本页事实和来源整理在一起，复制给 Astra 或 Gemini 后，就不用重新介绍项目了。</p>
        <fieldset className="continuation-fields" data-continuation-fields="" disabled aria-describedby={`${id}-intro`}>
          <legend className="continuation-visually-hidden">整理续作说明</legend>
          <div className="continuation-scope-field">
            <label htmlFor={`${id}-scope`}>这次处理哪里</label>
            <select id={`${id}-scope`} data-continuation-scope="" defaultValue={module?.slug || ""}>
              <option value="">整个项目</option>
              {context.modules.map((item) => <option key={item.slug} value={item.slug}>{item.shortTitle}</option>)}
            </select>
          </div>
          <div className="continuation-goal-field">
            <label htmlFor={`${id}-goal`}>你想让 AI 接下来做什么</label>
            <textarea id={`${id}-goal`} data-continuation-goal="" rows={3} placeholder="例如：检查这个功能现在能否正常使用，有问题就修好。" autoComplete="off" spellCheck={false} />
          </div>
          <div className="continuation-actions">
            <button type="button" data-continuation-copy="" disabled>复制说明</button>
            <p className="continuation-local-note">只在当前网页整理，不会发起 AI 任务。</p>
          </div>
          <p className="continuation-status" data-continuation-status="" role="status" aria-live="polite" aria-atomic="true" />
          <div className="continuation-preview-field">
            <label htmlFor={`${id}-preview`}>将要复制的内容</label>
            <textarea id={`${id}-preview`} className="continuation-preview" data-continuation-preview="" rows={12} readOnly placeholder="先填写上面的目标，完整说明会出现在这里。" spellCheck={false} />
          </div>
        </fieldset>
        <noscript><p>启用浏览器 JavaScript 后可以自动整理。你也可以直接把本页链接和自己的目标复制给 AI。</p></noscript>
        <script type="application/json" data-continuation-context="" dangerouslySetInnerHTML={{ __html: serializeContinuationContext(context) }} />
      </div>
    </details>
  );
}
