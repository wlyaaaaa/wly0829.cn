"""示意图组件族；由主引擎自动注册，只依赖本族及只读 ctx 接口。"""
from . import sequence, structure, detail

COMPONENTS = {**sequence.COMPONENTS, **structure.COMPONENTS, **detail.COMPONENTS}
# 各模块只声明自己实际消费的字段；尚未声明的组件不冒充已执行构图。
SPEC_FIELDS = {
    **getattr(sequence, "SPEC_FIELDS", {}),
    **getattr(structure, "SPEC_FIELDS", {}),
    **getattr(detail, "SPEC_FIELDS", {}),
}
