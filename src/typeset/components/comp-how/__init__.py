"""“怎么协作”页专用组件族：分工图（三张大卡 + 回线 + 两张下卡）。由引擎自动扫描注册。"""
from .flow_cards import render_flow_cards, FLOW_FIELDS

COMPONENTS = {"how_flow_cards": render_flow_cards}
SPEC_FIELDS = {"how_flow_cards": FLOW_FIELDS}
