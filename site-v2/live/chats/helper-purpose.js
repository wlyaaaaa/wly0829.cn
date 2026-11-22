// 对话卡和完整对话共用帮手用途；优先取任务名，进展只作补充。
(() => {
  'use strict';
  const U = window.LiveUI;
  const placeholder = /^(?:帮手|对话|正在准备|正在换说法|没有(?:标题|记录)|未命名的 AI 活|GPT 派单|第\s*\d+\s*[/／]\s*\d+\s*步)$|(?:仅本人|可信设备)可见/;

  U.chatHelperPurpose = (helper, parent, viewer, field = U.chatFields.field) => {
    const candidates = [
      [helper.localized?.title, 'title', 0], [helper.title, 'title', 0],
      [helper.localized?.summary, 'summary', 80], [helper.summary, 'summary', 80],
    ];
    for (const [value, key, limit] of candidates) {
      if (!value) continue;
      const purpose = field(value, helper, parent, key);
      const words = U.fieldText(purpose, viewer).trim();
      if (/\p{Script=Han}/u.test(words) && !placeholder.test(words)) return { purpose, limit };
    }
    return null;
  };
  U.chatHelperPurpose.placeholder = placeholder;
})();
