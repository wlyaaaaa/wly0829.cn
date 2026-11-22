// 剪贴板只在用户点击时调用；回退文本框始终藏在屏幕外，结束后清掉。
export async function copyToClipboard(text, nav = navigator, doc = document) {
  try { await nav.clipboard.writeText(text); return true; } catch { /* 浏览器不允许时走兼容入口 */ }
  const active = doc.activeElement, area = doc.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
  doc.body.append(area);
  try { area.select(); return doc.execCommand('copy') === true; }
  catch { return false; }
  finally { area.remove(); active?.focus?.({ preventScroll: true }); }
}
