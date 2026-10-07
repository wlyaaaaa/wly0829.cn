"""comp-hub 的总页与卡片组件，含追加入口网格和表头统计变体。"""
from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path


COMPONENTS = {}
SPEC_FIELDS = {}
_loaded = {}
for _name in ("headings", "feature_status", "tiles", "link_stats", "entry_cards", "layout_constraints"):
    # registry 以文件路径载入族；无需它把族包预先登记到 sys.modules。
    _spec = spec_from_file_location(f"comp_hub_{_name}", Path(__file__).parent / f"{_name}.py")
    _module = module_from_spec(_spec)
    _spec.loader.exec_module(_module)
    _loaded[_name] = _module
    COMPONENTS.update(getattr(_module, 'COMPONENTS', {}))
    SPEC_FIELDS.update(getattr(_module, 'SPEC_FIELDS', {}))
COMPONENTS['link_grid'] = _loaded['entry_cards'].wrap_link_grid(COMPONENTS['link_grid'])
_base_fields = {
    'section_heading': ['align','size','heading_size','heading_style','heading_font','group_heading',
        'group_heading_style','group_heading_font','font','heading_asset','group_heading_asset',
        'group_heading_assets','heading_source_image','heading_source_box','group_heading_source_image',
        'group_heading_source_box','heading_icon','group_heading_icon','variant','group_heading_variant','underline'],
    'title_strip': ['align','layout','description_align','leaf_position','brush_position','right_leaves',
        'leaves','frozen','muted'],
    'project_tile': ['columns','portrait_columns','stat_columns','number_rows','portrait_number_rows',
        'number_column_widths','portrait_number_column_widths','stat_count','stat_alignment','stat_style',
        'separator_after_date','separator_before_footer','link_fill_width','status_style',
        'illustration','illustration_index'],
    'directory_tile': ['columns','portrait_columns','illustration','group_illustrations','icon_map','icons',
        'group_icons','group_style','decorative_icons','icon_policy','group_heading','group_heading_style',
        'group_heading_font','group_heading_font_family','heading_size','group_heading_asset',
        'group_heading_assets','group_heading_source_image','group_heading_source_box',
        'group_heading_icon','group_heading_variant','size','group_heading_layout','separator','group_heading_brush'],
    'stretch_list': ['live_key','key','min_height','placement','leaves','slice'],
}
for _kind, _fields in _base_fields.items():
    SPEC_FIELDS[_kind] = sorted(set(SPEC_FIELDS.get(_kind, [])) | set(_fields))
for _kind, _fields in _loaded['layout_constraints'].SUPPORTED_FIELDS.items():
    COMPONENTS[_kind] = _loaded['layout_constraints'].wrap_renderer(COMPONENTS[_kind], _kind)
    SPEC_FIELDS[_kind] = sorted(set(SPEC_FIELDS.get(_kind, [])) | set(_fields))
