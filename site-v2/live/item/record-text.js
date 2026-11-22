// 正文每段结尾的两个汉字一起换行，保留原文，避免最后只掉下一个字。
window.LiveRecordText = value => window.LiveUI.sp(value).split('\n').map(line => {
  const tail = line.match(/\p{Script=Han}{2}[。！？；：，、…）》」』”’!?.,;:]*$/u);
  return tail ? window.LiveUI.esc(line.slice(0, -tail[0].length)) + `<span class="rec-tail">${window.LiveUI.esc(tail[0])}</span>` : window.LiveUI.esc(line);
}).join('\n');
