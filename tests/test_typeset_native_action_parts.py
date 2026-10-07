import importlib.util, sys
from pathlib import Path

path = Path(__file__).parents[1] / 'scripts' / 'build-typeset-site.py'
spec = importlib.util.spec_from_file_location('action_parts_builder', path)
builder = importlib.util.module_from_spec(spec); sys.modules[spec.name] = builder; spec.loader.exec_module(builder)
source = {'buttons': [{'text':'复制给 AI 的说明','where':'主机卡片'}, {'text':'复制给 AI 的说明','where':'备用入口卡片'}]}
old = {'id':'mcp-03','layouts':{'h':{},'v':{}},'parts':[{'native_actions':[{'text':'复制给 AI 的说明','action':'copy-note','copy_text':'host','hot_id':'mcp-03-h-0-0'}, {'text':'复制给 AI 的说明','action':'copy-note','copy_text':'backup','hot_id':'mcp-03-h-5-0'}]}]}
hot = {'id':'mcp-03-h-9-0','text':'复制给 AI 的说明','href':'备用入口卡片::复制给 AI 的说明'}
assert builder.action_for(hot, {'data-button-where':'备用入口卡片'}, source, old)['copy_text'] == 'backup'
time_source = {'buttons':[{'text':'0.5小时','where':'第 3 步'}]}
time_old = {'id':'computer-access-02','layouts':{'h':{},'v':{}},'parts':[{'native_actions':[{'text':'0.5小时','action':'hours-0.5','hot_id':'computer-access-02-h-7-3'}]}]}
assert builder.action_for({'id':'computer-access-02-h-8-3','text':'0.5小时','href':'0.5小时'}, {}, time_source, time_old)['action'] == 'hours-0.5'
v_old = {'id':'only-v','layouts':{'h':{},'v':{}},'parts':[{'native_actions':[{'text':'刷新','action':'refresh','hot_id':'only-v-v-0-0'}]}]}
assert builder.action_for({'id':'only-v-v-0-0','text':'刷新','href':'刷新'}, {}, {'buttons':[{'text':'刷新'}]}, v_old)['action'] == 'refresh'
