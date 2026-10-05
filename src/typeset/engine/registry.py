"""组件注册：扫描 components\\*\\__init__.py 的 COMPONENTS。core 是兜底，可被其它族覆盖；两个非 core 族重名报错。"""
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(HERE, "components")
# 组件名 → 它认的规格字段（族在 __init__.py 里可选导出 SPEC_FIELDS = {"组件名": [字段…]}）；没导出的族不查
SPEC_FIELDS = {}
OWNER = {}


def load():
    reg, owner, css = {}, {}, []
    SPEC_FIELDS.clear()
    fams = sorted(d for d in os.listdir(COMP_DIR) if os.path.isfile(os.path.join(COMP_DIR, d, "__init__.py")))
    fams = ["core"] + [f for f in fams if f != "core"] if "core" in fams else fams
    warnings = []
    for fam in fams:
        path = os.path.join(COMP_DIR, fam, "__init__.py")
        spec = importlib.util.spec_from_file_location(f"components_{fam}", path,
                                                      submodule_search_locations=[os.path.join(COMP_DIR, fam)])
        mod = importlib.util.module_from_spec(spec)
        sys.modules[spec.name] = mod  # 先登记父包，族内 from .x import y 才能用（04:57 修）
        try:
            spec.loader.exec_module(mod)
        except Exception as e:  # 一个族坏了不拖垮全站，记下来
            sys.modules.pop(spec.name, None)
            warnings.append(f"组件族 {fam} 载入失败：{e!r}")
            continue
        for name, fn in getattr(mod, "COMPONENTS", {}).items():
            if name in reg and owner[name] != "core":
                raise RuntimeError(f"组件名 {name} 在 {owner[name]} 和 {fam} 两个族里重复登记")
            if name in reg:
                warnings.append(f"{fam} 覆盖了 core 的 {name}")
            reg[name] = fn; owner[name] = fam
            SPEC_FIELDS.pop(name, None)
            if name in getattr(mod, "SPEC_FIELDS", {}):
                SPEC_FIELDS[name] = set(mod.SPEC_FIELDS[name])
        cssf = os.path.join(COMP_DIR, fam, "style.css")
        if os.path.exists(cssf):
            css.append(cssf)
    OWNER.clear(); OWNER.update(owner)
    return reg, owner, css, warnings
