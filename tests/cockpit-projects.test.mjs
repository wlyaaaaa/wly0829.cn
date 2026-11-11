import test from 'node:test';
import assert from 'node:assert/strict';
import { renderProjects } from '../site-astro/src/cockpit/projects.js';

test('private repository text and note stay literal, unsafe entry cannot execute', () => {
  const html = renderProjects({projects:[{repo:'a/<b>',name:'<img src=x onerror=alert(1)>',purpose:'A & B',entry:'javascript:alert(1)',frozen:true,change:'变化：<script>坏</script>',updated_at:'2026-11-11T23:00:00Z',commits_7d:0,commits_30d:2,waiting_owner:1}],unassigned:{waiting_owner:3}});
  assert.ok(!html.includes('<script>') && !html.includes('<img') && !html.includes('href="javascript:'));
  assert.ok(html.includes('变化：&lt;script&gt;坏&lt;/script&gt;'));
  assert.ok(html.includes('2026/11/12') && html.includes('已冻结'));
  assert.ok(html.includes('没标项目') && html.includes('<td>3</td>'));
});

test('missing counts remain unknown and unmatched project counts remain visible', () => {
  const html = renderProjects({projects:[{name:'空',commits_7d:null,commits_30d:null,error:'未读到'}],unassigned:{waiting_owner:0},unmatched:{'旧项目':2}});
  assert.ok(html.includes('冻结状态未读到') && html.includes('<td>未读到</td>'));
  assert.ok(html.includes('旧项目') && html.includes('<td>2</td>'));
});
