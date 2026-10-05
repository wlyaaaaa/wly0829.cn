"""Explicit public runtime projection; producer/provenance records never pass through."""
from __future__ import annotations

import re

# These detect values, not producer field names. Dropping unknown fields is the
# publication boundary; this check catches a misplaced path in an allowed field.
LOCAL_LITERAL = re.compile(
    r'(?i)(?:file:/+(?:[a-z]:)?|(?<![a-z0-9])[a-z]:[\\/]+|(?<![\\.\w])\\\\(?!\\)[^\\\s]+\\(?!\\))'
    r'[^\s<>"\'，。；！？（）【】,;!?()|`]*'
)
INTERNAL_LITERAL = re.compile(r'\b(?:claude-gate-\d+|root_task_id|human_prompt_id|wave\d[a-z]?-(?:current|final)-\d+)\b', re.I)

# None means a scalar, never an unconstrained nested object. Lists and maps must
# declare their item schema. Only public names/URLs may be dynamic map keys.
S = None
def fields(names):
    return {key:S for key in names.split()}
def array(schema):
    return [schema]
def mapping(schema, key_kind='name'):
    return ('map', schema, key_kind)

RECT = array(S)
LINK = fields('id text href original_href rect text_rect whole button card_title card_title_rect arrow_status text_only kind slot action copy_text hot_id live_part occurrence part x y w h rect_px target invalid')
for key in ('rect','text_rect','card_title_rect','rect_px'):
    LINK[key]=RECT
SHOT = fields('src full caption role size crop')
SHOT.update(size=RECT,crop=RECT)
LINK['shots']=array(SHOT)
MARK = fields('id key reason text slot kind rect value numeric notation basis policy state colour shape direction background href hot_id live_part')
MARK['rect']=RECT
MARK['text_box']=RECT
GEOMETRY=('union',RECT,MARK)
CARD = fields('id background basis destination_count group has_primary href main_id text whole reason')
CARD.update(rect=RECT,links=array(('union',S,LINK)))
VIEWER = fields('src avif width height sha256')
LAYOUT = fields('orientation')
LAYOUT.update(size=RECT,source_size=RECT,crop=RECT,title_rect=RECT,viewer=VIEWER,
              links=array(LINK),anchors=array(LINK),live=array(MARK),native_live=array(MARK),
              native_actions=array(LINK),screenshots=array(SHOT),cards=array(RECT),
              numbers=array(MARK),dots=array(GEOMETRY),arrows=array(GEOMETRY),
              interactive_cards=array(CARD),card_text_only=array(CARD),
              card_uncertain=array(CARD),card_arrow_pending=array(MARK))
PART = {**LAYOUT,**fields('image src both compact_live')}
PART['hotspots']=array(LINK)
PART['panorama_nodes']=array({'text':S,'href':S,'original_href':S,'rect':RECT})
SCREEN = fields('id title section shape nav_section nav_title render_mode primary_href source_version')
SCREEN.update(layouts={'h':LAYOUT,'v':LAYOUT},parts=array(PART),screen_anchors=array(S),html_anchors=array(LINK),
              source_meta=fields('relative_file version omitted_count original_html rendered_input_sha256 raw_rendered_input_sha256 public_projection_sha256 source_sha256 public_source_sha256 excerpt_contract excerpt_id src'))
COMPONENT = fields('src')
COMPONENT.update(size=RECT,links=array(LINK),slots=array(MARK))
ART = fields('header_signature header_tile menu_icon signature github bilibili x email landscape_wide landscape_ratio landscape_left landscape_right landscape back_to_top easter_bird landscape_done')
ART.update(labels=mapping(S),backgrounds=fields('a b c d e'),footer_bubble=RECT,
           page_navigation={'next':{'src':S,'size':RECT},'previous':{'src':S,'size':RECT}},
           source_frames={'h':{'src':S,'size':RECT,'scale':S,'slices':RECT},'v':{'src':S,'size':RECT,'scale':S,'slices':RECT}})
SHARED = fields('script_bundle style_bundle')
LABEL_GEOMETRY={**fields('src ink_left ink_right ink_top ink_bottom'), 'size':RECT,'ink_box':RECT}
LABEL={**LABEL_GEOMETRY,'encoded_edges':{'webp':LABEL_GEOMETRY,'avif':LABEL_GEOMETRY}}
SHARED.update(art=ART,components=mapping(COMPONENT,'component'),avif_assets=mapping(S,'url'),
              nav_labels=mapping(LABEL),leaves=array(S),group_leaf={'src':S,'crop':RECT,'source_sha256':S})
COUNTS = fields('arrows cards depth dots numbers seam update')
PUBLIC_PAGE = fields('schema page kind family title url repo_url repository_visibility typeset video_prompt home_living')
PUBLIC_PAGE.update(screens=array(SCREEN),shared=SHARED,project=S,page_end={},
                   neighbors={'next':fields('href original_href title'),'previous':fields('href original_href title')},
                   status_binding={**fields('project repo page matched visibility'),'labels':mapping(S),'prefixes':mapping(S)},
                   b2_live_anchors=array(fields('api_project from how id lands_on site_title')),
                   video={**fields('src mask bytes download_timeout_ms intro_fade_seconds playback_rate desktop_video mobile_video mount_allowed'),
                          'compatibility':fields('status reason'),'rect':RECT,'size':RECT},
                   motion_counts={**COUNTS,'h':COUNTS,'v':COUNTS},
                   motion_capabilities={**{key:fields('policy status label count_h count_v') for key in ('cards','numbers','arrows','screenshots','card_feedback')},
                                        'dots':fields('policy status label')})
PUBLIC_SEARCH={**fields('type group projectSlug title href detail search excerpt text'),'aliases':array(S),'scopes':array(S)}

def public_search_records(value, omitted=None):
    return project(value,array(PUBLIC_SEARCH),'search',omitted)

def project(value, schema, pointer='page-data', omitted=None):
    """Copy only declared fields, preserving every declared runtime value."""
    if value is None:
        return None
    if schema is None:
        if isinstance(value,(dict,list)):
            raise ValueError('Undeclared nested runtime payload at '+pointer)
        return value
    if isinstance(schema,tuple):
        if schema[0]=='union':
            return project(value,schema[2] if isinstance(value,dict) else schema[1],pointer,omitted)
        if not isinstance(value,dict):
            raise ValueError('Expected runtime map at '+pointer)
        result={}
        for key,item in value.items():
            allowed = isinstance(key,str) and not LOCAL_LITERAL.search(key) and not INTERNAL_LITERAL.search(key)
            if schema[2]=='url': allowed = allowed and key.startswith(('/','http://','https://','assets/'))
            if schema[2]=='component': allowed = allowed and bool(re.fullmatch(r'(?:header|footer|menu|bar-[a-z]+|end-[a-z]+)-[hv]',key))
            if allowed:
                result[key]=project(item,schema[1],pointer+'.'+key,omitted)
            elif omitted is not None:
                omitted.append(pointer+'.'+key)
        return result
    if isinstance(schema,list):
        if not isinstance(value,list):
            raise ValueError('Expected runtime list at '+pointer)
        return [project(item,schema[0],pointer+'[]',omitted) for item in value]
    if not isinstance(value,dict):
        raise ValueError('Expected runtime object at '+pointer)
    if omitted is not None:
        omitted.extend(pointer+'.'+key for key in value if key not in schema)
    return {key:project(value[key],rule,pointer+'.'+key,omitted) for key,rule in schema.items() if key in value}

def local_values(value, pointer='page-data'):
    found=[]
    if isinstance(value,dict):
        for key,item in value.items(): found.extend(local_values(item,pointer+'.'+key))
    elif isinstance(value,list):
        for i,item in enumerate(value): found.extend(local_values(item,pointer+'['+str(i)+']'))
    elif isinstance(value,str):
        for pattern in (LOCAL_LITERAL,INTERNAL_LITERAL):
            found.extend({'field':pointer,'value':match[0]} for match in pattern.finditer(value))
    return found

def public_page_data(value, omitted=None):
    result=project(value,PUBLIC_PAGE,omitted=omitted)
    findings=local_values(result)
    if findings:
        raise ValueError('Local/internal literal in public runtime field: '+findings[0]['field'])
    return result

def omit_local_literals(text, findings=None, context=None, replacement=''):
    """Remove only literal spans; surrounding authored words are untouched."""
    def remove(match):
        if findings is not None: findings.append({**(context or {}),'value':match[0],'offset':match.start()})
        return replacement
    return INTERNAL_LITERAL.sub(remove,LOCAL_LITERAL.sub(remove,text))
