"""在保留驾驶舱的原渲染入口增加手机摘要；完整记录仍在原明细里。"""
import hashlib
import re
from pathlib import Path


HELPER = r'''
const cpTodoPhone=matchMedia('(max-width:767px)');
cpTodoPhone.addEventListener('change',()=>render());
function cpMobileTodo(card,item){
 if(!cpTodoPhone.matches)return;
 const raw=rawList(item.source_id)?.find(row=>row.id===item.id)||{},text=item.title||item.text||'事项说明未登记';
 const report=text.match(/^等你选[：:]\s*(.+?)[，,]请在电脑上打开汇报页/);
 const brief=value=>String(value||'').replace(/\s*汇报在电脑上[：:].*$/s,'').replace(/\s*做完点[“"].*$/s,'').trim();
 const name=report?report[1]:brief(text).split(/[，,；;]/)[0];
 const step=report?'在电脑上打开这份汇报，选定答复。':brief(item.user_action)||'展开登记要求，确认你要做的一步。';
 const done=item.pass_criteria||raw.pass_criteria||(report?'AI 收到并核实你的答复后，才算完成。':'由 AI 核实登记条件后关闭；具体条件需查看登记要求。');
 const anchor=({automation:'tasks',backups:'cp-original-backups'})[item.source_id]||'projects';
 const button=cpButton('完整操作与依据');button.onclick=()=>cpOpenDetails(anchor);
 card.replaceChildren(cpNode('h4','cp-todo-name',name),cpFactNode(cpFacts([['下一步',step],['完成条件',done]])),button);
}
function cpMobileCopies(){
 const ui=cockpitUI;if(cpTodoPhone.matches){ui.details.insertBefore(ui.copyAll,ui.archive);ui.details.insertBefore(ui.conclusion.copyActions,ui.archive);}
 else{ui.need.after(ui.copyAll);ui.conclusion.body.before(ui.conclusion.copyActions);}
}
'''
STYLE = '''
@media(max-width:767px){
 .cp-need .cp-action-grid{grid-template-columns:minmax(0,1fr)!important}
 .cp-need .cp-action-grid>.cp-action-card{grid-column:1/-1!important;width:100%!important;justify-self:stretch!important;box-sizing:border-box}
 .cp-todo-name{margin:0;font-size:16px;line-height:1.5;color:#486754;overflow-wrap:anywhere}
 .cp-need .cp-action-card .cp-facts{margin:8px 0 12px}
}
'''


def build(public, cockpit):
    public, cockpit = Path(public), Path(cockpit)
    text = cockpit.read_text(encoding='utf-8')
    url = re.search(r'data-src="([^"]*/b2-typeset-[\w]+\.js)"', text)[1]
    source = public / url.lstrip('/')
    runtime = source.read_text(encoding='utf-8')
    entry, append, sync = 'function renderCockpit(){', '(index<5?cards:rest).append(card);', 'syncChildren(ui.need,needNodes);'
    if any(runtime.count(marker) != 1 for marker in (entry, append, sync)):
        raise ValueError('驾驶舱待办原入口发生变化，不能套用手机摘要')
    runtime = runtime.replace(entry, HELPER + entry).replace(append, 'cpMobileTodo(card,item);' + append)
    runtime = runtime.replace(sync, sync + 'cpMobileCopies();')
    digest = hashlib.sha256(runtime.encode('utf-8')).hexdigest()
    target = source.with_name('b2-typeset-' + digest[:20] + '.js')
    target.write_text(runtime, encoding='utf-8', newline='')
    text = text.replace(url, '/' + target.relative_to(public).as_posix())
    text = text.replace('</head>', '<style data-cockpit-mobile-todo>' + STYLE + '</style></head>')
    cockpit.write_text(text, encoding='utf-8', newline='')
    return {'runtime': target.relative_to(public).as_posix(), 'sha256': digest}
