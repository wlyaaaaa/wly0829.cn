"""十一种文字组件；扫描注册入口。"""
from .primitives import render_bullet_list, render_tag, render_notice, render_monospace
from .cards import render_quote, render_source_text_card, render_glossary, render_points_card, render_dialogue
from .buttons import render_action_button, render_prose
from .primitives import PRIMITIVE_SPEC_FIELDS
from .buttons import BUTTON_FIELDS, PROSE_FIELDS
from .cards import POINTS_FIELDS

COMPONENTS = {
    'bullet_list': render_bullet_list,
    'tag': render_tag,
    'notice': render_notice,
    'monospace': render_monospace,
    'quote': render_quote,
    'source_text_card': render_source_text_card,
    'glossary': render_glossary,
    'points_card': render_points_card,
    'dialogue': render_dialogue,
    'action_button': render_action_button,
    'prose': render_prose,
}

# 只登记实际已消费字段；未知主动字段由共享check_fields标构图未完。
_CARD_FIELDS = {'columns', 'columns_v', 'size', 'split_cards', 'whole_block', 'align', 'last_full_width', 'last_inner_columns'}
SPEC_FIELDS = {
    **PRIMITIVE_SPEC_FIELDS,
    'action_button': BUTTON_FIELDS,
    'prose': PROSE_FIELDS,
    'points_card': POINTS_FIELDS | {'item_pages'},
    'quote': _CARD_FIELDS | {'variant'},
    'glossary': _CARD_FIELDS,
    'source_text_card': _CARD_FIELDS | {
        'split_after', 'body_columns', 'column_split_after_item', 'card_header', 'header_navigation',
        'icon_position', 'header_icon', 'icons', 'inner_columns', 'inner_split_ref', 'inner_left_refs',
        'inner_right_refs', 'emphasis', 'emphasis_ref', 'illustration', 'illustration_v',
        'illustration_asset', 'illustrations', 'item_pages', 'brush', 'size', 'columns_v', 'font_role', 'layout', 'row_note_from', 'row_note_row',
    },
    'dialogue': _CARD_FIELDS | {
        'split_items', 'split_paras', 'paragraph_bubbles', 'flow', 'rows', 'row_counts', 'avatars', 'icons',
        'avatar_source', 'right_images', 'right_image_source', 'avatar_position', 'icon_position',
        'speaker_position', 'sides', 'tail', 'illustration', 'bubble_tone', 'bubble_tones',
        'inset_spans', 'container', 'columns_v', 'compact', 'max_width',
        'annotation_position', 'annotation_spans',
        'bubble_per_item', 'bubble_columns', 'items_layout', 'secondary_illustration', 'speaker_role',
    },
}
