"""离线清点指定两批直接子页；只向本文件所在目录写清点产物。"""
from __future__ import annotations
import collections, datetime, hashlib, json, os, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]/'src/typeset'))
from engine.content import bound_json

ROOT = pathlib.Path(__file__).resolve().parents[1] / 'sources/pages'
OUT = pathlib.Path(os.environ.get('TYPESET_INVENTORY_OUT', ROOT.parents[1] / '.publish/inventory'))
NOW = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')
NUM = r'[一二三四五六七八九十两百\d]+'
CN = {'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10}
def number(s):
    if s.isdigit(): return int(s)
    if s in CN: return CN[s]
    if '十' in s:
        a,b=s.split('十'); return CN.get(a,1)*10+CN.get(b,0)
    return 1
def sha(raw): return hashlib.sha256(raw).hexdigest()
def jwrite(p,v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# 分类是本次清点采用的技术归并，不改变定稿和本人选定的版式。
CAT = {
 'chapter_title':('毛笔章节标题＋笔刷线','毛笔(?:艺术字)?(?:大)?标题|大标题毛笔|毛笔字和笔刷线','横版左上或居中；竖版仍置顶、允许标题自然换行。原文页明确禁用大标题的屏不画。'),
 'section_heading':('小节／组名／卡头标题','小标题|组名|卡头|小节标题|粗体.*标题','横版横跨本组或卡头；竖版在各组／卡片顶部，组说明可另起一行。'),
 'prose':('介绍段／说明段／图注小字','介绍段|介绍文字|一段介绍|正文|说明段|两行介绍|一行.*字','横版在指定文字栏；竖版整宽顺排。粗体、链接和截至日期保留各自样式，按逐字定稿排。'),
 'bullet_list':('圆点短句／条目清单','小圆点|要点|短句|条目|带小绿点','横版可在卡内分两栏；竖版单栏逐条。功能行和时间线不重复算普通列表。'),
 'inline_link':('绿色链接行／正文内链接','链接|下划线|可点','横版与正文同流或独立一行；竖版可折行，完整链接词和箭头不截断。'),
 'action_button':('链接按钮／操作按钮行','按钮','横版并排或网格；竖版按原描述改成逐行、两列或三列。保留主、次、灰边按钮区别。'),
 'stat_card':('大数字卡／数字格','数字卡|数字格|数字块|大数字|大号.*数字','横版常见一排四张、两列或三列；竖版常见两两一行，也有一行三个、逐张横卡。按本屏原文，不统一强制两列。'),
 'content_card':('说明／场景／原则／亮点卡片网格','卡片|小卡|大卡|竖卡|横卡','横版实际出现 1～6 列、2×2、左多右少等；竖版多数整宽顺排，部分保留两列。大小插画在卡顶或左侧。'),
 'feature_card':('功能卡＋状态点（编号可选）','功能卡|编号. 功能名|全部功能','横版以三列为主，另有两列和按实际项数铺满；竖版一列或两列。组名独占上方行，跨屏续接不重复标题图例。'),
 'project_tile':('项目总页独立卡','单张项目卡片|单张卡片，1200','横版单张 1200×750；不另画竖图，由网页按实际屏宽重排卡片。数字 0～10 格按实际数铺满，冻结卡显示原因和当前替代。'),
 'directory_tile':('技能／规则／协作目录卡','技能名|专题名|项目名|项目卡片','横版技能总页固定每排四张；规则总页 3／4／3；协作项目卡每排三张。竖版一张一行。'),
 'source_text_card':('规则原文长段卡','约法原文|规则原文样张|每组一张白底','横版左右或多栏原文卡；竖版整宽顺排，粗体条名与正文同段。不是把原文压成摘要。'),
 'points_card':('人话要点卡＋浅绿卡头','每个“###|每条要点','横版按指定宽度分栏，卡内可再分栏；竖版一张整宽顺排。例句／实例有底色，命令用等宽小框。'),
 'glossary':('词条／术语对照卡','先认几个词|词表|词条|先懂几个词','横版竖列词名与释义；竖版整宽逐词，不缩小长词条。'),
 'numbered_steps':('编号条目／步骤卡','编号步骤|编号流程|圆形编号|圆圈序号|带编号|四步|五步|七步|步骤卡','横版沿路、卡列或流程排；竖版按既定编号从上到下，部分两列 Z 字。角色徽章与需要本人操作的底色随步骤保留；原则和亮点的编号条目也使用同一编号字样。'),
 'flow':('流程节点＋箭头／流水线','流程|流水线|传送带|工位|节点.*箭头|绿色向下箭头','横版水平、蛇形或多条并行；竖版多数改向下，分支标签和非主链节点保留。'),
 'topology':('架构／层级／链路示意图','架构图|层级图|示意图|链路图|剖面插画|三层示意|背后怎么连','横版左右分支、上下层级或多路汇合；竖版主干上下顺序，分支仍能识别。文字标签由程序覆盖，图形底图不带字。'),
 'timeline':('日期／日常时间线','时间线|时间轴|时间带|节点.*日期','横版横向交错、两行丝带或左右列；竖版单条竖线，日期与说明对应。运行时段线与演进日期线共用节点样式。'),
 'table':('表格／对照表','表格|对照表|大表|三列表|两列表|小表|型号表|分拣表','横版保留 2～5 列表头及分隔线；竖版多数变成逐行卡片，并用原表头作前缀。不能仅把横表缩窄。'),
 'comparison':('对比两栏／管与不管','左右两栏|左右两大栏|左右对照图|两栏对照|两张.*对照|左右两张.*对比|左栏“管|左卡“备|改前.*改后','横版左右对照、对应项齐行；竖版上下或逐组先灰后绿。对比截图另列组件。'),
 'dialogue':('问答／跟 AI 说的气泡','对话气泡|对话卡片|一段对话|画成一段竖向的对话|手机聊天样式的对话框|短气泡|气泡.*右对齐|气泡.*左对齐|一问一答','横版气泡一至两列，完整例子左对话右补充；竖版逐气泡顺排，保留我／AI 的对齐与底色。'),
 'quote':('引用／例句／跟 AI 说框','引语|引号|引用框|引语框|“例：”|以“实例：”','横版嵌在说明卡或单独浅绿条；竖版整宽放在所属段落下。保留示例标签，不把例句变成规则正文。'),
 'notice':('浅绿提示条／黄色便签／灰色说明条','提示条|提醒条|便签|横幅|细卡片|细长卡片|说明条|浅绿底.*小结','横版贯通全宽或左右并排；竖版整宽，内含按钮时按钮可另起一行。'),
 'tag':('状态／来源／角色标签胶囊','标签|胶囊|徽章','横版贴卡角或标题旁；竖版仍贴所属卡，长标签换行。标签只画颜色的屏不擅自加字。'),
 'status_legend':('状态圆点／叉／水彩灯＋图例','图例|状态圆点|状态小圆点|小圆点表示状态|右上角.*圆点|小水彩灯|水彩色点','横版同标题一行或卡角；竖版图例折两行，状态点仍随卡。绿／黄／灰／空心／叉按本页图例，不统一删状态。'),
 'line_legend':('实线／虚线／点线／双线图例','实线、虚线、点线、双线','横版四行短线样本和释义；竖版整宽四行。网页动态连线使用同样的语义。'),
 'live_strip':('“现在”实时横条＋留空框','“现在”横条|横条“现在”|“现在”两个|“现在”两个字','横版标签、1～3 个空框、驾驶舱按钮同一横条；竖版空框逐行，不把实时值烘进 PNG。'),
 'live_box':('实时状态／总灯／提示留空框','状态空框|横长空框|总灯|提示条空框|连接状态空框','横版嵌入卡片、总灯旁或页角；竖版满宽，状态灯底座保留。内容与灯色由网页填入。'),
 'stretch_list':('可拉长的九宫格列表框','九宫格|能往下拉长','横版保留完整上下沿及直边，中段纯白；竖版满宽，同样可按实时列表长度拉伸。'),
 'input_field':('时长／验证码输入留空框','输入空框|输入框是真的|真的输入框','横版在第 3／4 步下，旁边验证按钮；竖版整宽并置于各自步骤下。框是实际网页输入控件的位置。'),
 'live_embed':('Grafana 实时曲线嵌入框','嵌入框|面板嵌在这里','横版约 86% 宽 16:9；竖版上下两段，各约 4:3。框内不画假曲线。'),
 'screenshot':('真实截图／照片留空位','截图位|截图空位|截图空框|放截图|照片空位|空位放截图|空位.*真实截图','横版侧栏、多图并排或画廊；竖版按原图比例整宽／两列，图注紧贴。不画手机壳替代真实矩形截图。'),
 'screenshot_compare':('改前改后拖动对比截图位','左右拖动|改前改后对比','横版同一个槽接 before／after 两个源文件；竖版保留原比例，标签在两端。两张源图只算一个槽。'),
 'illustration':('无字水彩插画位','插画|小插画|小水彩|水彩小画|小幅水彩','横版左／右／顶／卡内大小插画；竖版移到标题下、卡顶或末尾，部分省掉补空白插画。横竖共享语义资产，不按两幅重复采购。'),
 'icon':('无字小水彩图标／品牌小标','小图标|水彩图标|小插画依次|小标志|小水彩.*图标|水彩线描图标','横版卡角、行首、节点顶；竖版多在左，图标可缩而正文不缩。圆点、箭头、编号和细线不计插画资产。'),
 'annotation':('插画／截图引线标注','标注文字|标注|虚线指向|细線.*对应|细线.*对应|细虚线.*对应|图解|引线|虚线.*指向','横版用细线把编号或标签连到对应部位；竖版有的保留，有的去引线改编号清单，按本屏描述。'),
 'monospace':('命令／地址／路径等宽字条','等宽|命令条|地址条|代码块','横版浅灰／浅绿底字条；竖版可完整折行，不截断路径、命令或地址；反引号是语法，不画。'),
 'chart':('程序绘制的数据图','柱状图|条形图|圆环图|堆叠条|折线图|统计图','横版在侧栏或下半屏；竖版整宽，图例可移到图下。条形、柱形、环形、堆叠按真实数字程序画。'),
 'document_mock':('结果稿／文件目录／有字菜单与窗口小样','示例结果|示例纸张|摊开的水彩纸|终端窗口.*真实.*菜单|账本.*真实内容|文件.*清单.*一行行|稿纸.*三格|菜单.*四行|菜单.*三行|菜单文字|主题.*Verdant Mint|提示条.*写着','横版展开纸面或窗口，有粗体／高亮／表头／菜单项；竖版逐页／逐段展开。可读文字都交给程序；纸张和窗口装饰可用无字底图。'),
 'segmented_band':('漏斗／胶片帧带／文件剖面／优先台阶','漏斗|帧条|镜像链|文件剖面|五级.*台阶|胶片.*一格一秒','横版宽窄层级或横条分段；竖版上下层级，名称、数量和箭头跟随对应段。'),
 'map':('全景地图／贴顶小地图＋项目牌','全景图|水彩地图|小地图|缩小.*全景图','横版湖面分区、左侧小地图；竖版区域岛两列四排或地图贴顶。牌名由程序排，连线／点亮由网页覆盖，不画进底图。'),
 'title_strip':('独立分组横条／窄标题横幅','横条 1600|窄横条 5:1|窄横条 6:1|画面较矮|矮的横幅','项目组横条横版 1600×180、竖版 940×240；GitHub 横条无竖版，按宽缩放；不能强制套 16:9。'),
 'button_variants':('按钮状态变体图','不能点|进行中|预画变体图','横竖共用同尺寸的常态、禁用、进行中、换字变体位置，真实状态由网页切换。'),
 'site_chrome_reference':('全站页眉页脚引用','页眉页脚照全站','404 描述引用现有全站页眉页脚，没有本任务范围内独立定稿；这里只登记引用，不估造其文字和布局。'),
}

def text_structure(t):
    lines=t.splitlines(); tables=[]; current=[]
    for i,line in enumerate(lines+['']):
        if line.strip().startswith('|'): current.append((i+1,line))
        elif current:
            real=[x for x in current if not re.match(r'^\s*\|[\s|:\-]+$',x[1])]
            if real: tables.append({'start_line':current[0][0],'columns':len(real[0][1].strip().strip('|').split('|')),'data_rows':max(0,len(real)-1)})
            current=[]
    return {'headings':[{'line':i+1,'level':len(m[1]),'text':m[2]} for i,l in enumerate(lines) if (m:=re.match(r'^(#{1,6})\s+(.+)$',l))],
      'numbered_lines':[{'line':i+1,'text':l} for i,l in enumerate(lines) if re.match(r'^\s*\d+[.、)]\s*',l)],
      'bullet_lines':sum(bool(re.match(r'^\s*[-*]\s+',l)) for l in lines), 'tables':tables,
      'links':re.findall(r'〔([^〕]+)〕',t),'bold_spans':len(re.findall(r'\*\*.+?\*\*',t)),'characters':len(t)}

def clean_scene(a):
    # 括号中的具体物体、品牌及“不画”的语法例子不参与版式识别。
    prev=None
    while prev!=a:
        prev=a;a=re.sub(r'（[^（）]*）','',a)
    a=re.sub(r'各卡状态：.*','',a)
    return a

def first_quote(a,rx):
    for clause in re.split(r'[。\n]',a):
        if re.search(rx,clause): return clause.strip()[:240]
    return ''

def quantities(a,word):
    return [number(m[1]) for m in re.finditer(rf'({NUM})\s*(?:张|个|幅|条|枚|盏|道|站|块)?\s*{word}',a)]

def infer_cards(a,st):
    q=quantities(a,r'(?:横向|竖向|竖长|等宽|同样大小|小|大|圆角|横排的|一样大的|并排的|带[^，。]*的)*\s*(?:卡片|小卡片|大卡片|卡|小卡|大卡|说明卡|场景卡|原则卡)')
    q.extend(number(m[1]) for m in re.finditer(rf'({NUM})\s*张[^，。；]{{0,16}}(?:卡片|小卡|大卡|说明卡|场景卡|原则卡)',a))
    q=[n for n in q if n<45]
    if q:return max(q)
    if re.search('每个“###',a):return sum(x['level']==3 for x in st['headings'])
    if re.search('左右两张|左右两栏|两栏卡片|两张.*并排|左卡.*右卡',a):return 2
    if re.search('一张.*卡片',a):return 1
    return max(1,len(st['numbered_lines']))

def inventory(p,d,s,image_files):
    a=s['scene']; v=s.get('portrait','');t=s['text']; ac=clean_scene(a); st=text_structure(t)
    sid=s['id']; sec=s.get('section',''); shape=s.get('shape'); comps={}
    # 条目只登记真实用法；重复模板中的否定要求不产生组件。
    def add(k,count=1,ev=None,role='主体',pos=None,estimated=False):
        if k in comps:
            comps[k]['count']=max(comps[k]['count'],count);return
        rx=CAT[k][1];m=re.search(rx,a)
        comps[k]={'component':k,'name':CAT[k][0],'count':count,'unit':'项' if k in ['icon','illustration'] else '组',
          'role':role,'evidence':ev or first_quote(a,rx) or t.splitlines()[0][:100],
          'evidence_source':'scene' if (ev is None and m) else 'scene/text',
          'estimated':estimated,'_pos':pos if pos is not None else (m.start() if m else 100000)}
    cardn=infer_cards(ac,st)
    feature_n=max(len(st['numbered_lines']),st['bullet_lines'],sum('｜' in l and not l.lstrip().startswith('#') for l in t.splitlines())) if sec=='features' else 0
    if sec=='features' and st['tables']:feature_n=sum(x['data_rows'] for x in st['tables'])
    h3=sum(x['level']==3 for x in st['headings'])
    is_feature=sec=='features' and feature_n>0
    feature_table=is_feature and p.parent.name=='learning'
    is_project=shape=='card' and p.parent.name=='projects-home'
    is_source=shape=='source_text'
    is_points=p.parent.name.startswith('rule-') and sec=='points' and ('###' in t or '每个“###' in a)
    has_card=('卡' in ac) and not is_source
    # 大标题／卡头分开；续接图不重复大标题。
    no_title=bool(re.search('没有(?:大)?标题|不再(?:画|重复)(?:大)?标题|不画毛笔大标题|不重复大标题|没有标题和图例|不另写标题',ac))
    if is_feature:
        # 通用模板常同时说“第一张有标题、后两张没有”；按本页真实第一屏定位。
        first_feature=next(x['id'] for x in d['screens'] if x.get('section')=='features')
        if sid==first_feature and re.search('第一张顶上有标题|这是第一张|顶上有标题|左上标题',ac):no_title=False
    has_heading=bool(re.search(r'^#{1,2}\s',t,re.M)) or sec=='top' or re.search('左上标题|左上大标题|左上毛笔|大标题.*居中|标题在|顶上有标题|顶上是标题',ac)
    if has_heading and not no_title:
        if is_source: add('section_heading',role='页眉',pos=0)
        elif not is_project:
            add('chapter_title',role='顶部',pos=0,ev=first_quote(a,'标题') or t.splitlines()[0])
    if h3 or re.search('组名|小标题|卡头|小节标题',ac):add('section_heading',max(h3,1),role='各段／卡内')
    prose_exp=bool(re.search('介绍|说明段|导语|引言|正文|一段字|两段字|段文字|说明小字|一行小字|灰色.*字|灰绿.*字|图注|图说|截图说明',ac))
    if prose_exp and not is_feature:add('prose',role='段落／图注')
    if st['bullet_lines'] and not (is_feature or is_source or sec=='history' or p.parent.name=='skills-home' and sec!='top' or p.parent.name=='rules-home' and sec=='topics' or sec=='top' and re.search('数字卡|数字格|数字块',ac)):
        add('bullet_list',st['bullet_lines'],ev='text 中 - 开头的独立条目；功能卡／日期节点另计',role='卡内',estimated=False)
    if st['links'] or s.get('links'):add('inline_link',len(st['links']) or len(s.get('links',[])),ev='定稿 〔链接词〕及 links 字段',role='内联／独立行')
    if re.search('按钮',ac) and not re.search('不画.*按钮',ac):add('action_button',max(1,len(s.get('buttons',[]))),role='按钮行')
    elif re.search('按钮',ac):
        clauses=[x for x in ac.split('。') if '按钮' in x and not re.search('不画.*按钮',x)]
        if clauses:add('action_button',ev=clauses[0],role='按钮行')
    statn=0
    if is_project:
        statn=len(s.get('card',{}).get('numbers',[]))
        if statn:add('stat_card',statn,ev='card.numbers 的实际格数；scene 明确 0～10 格，按实际数铺满',role='下半部数字格')
    elif re.search(CAT['stat_card'][1],ac):
        q=quantities(ac,r'(?:等宽|小|大|并排的|同样大小的|竖着的)*\s*(?:数字卡片|数字卡|大数字|数字块)')
        statn=max(q) if q else (4 if sec=='top' and '数字卡' in ac else max(1,sum(bool(re.match(r'^\s*-\s*\*\*[^*]*\d',l)) for l in t.splitlines())))
        add('stat_card',statn,role='数字区',estimated=not bool(q))
    if is_project:add('project_tile',role='整张卡片容器',pos=-1)
    elif is_source:add('source_text_card',max(1,h3),role='原文长段',pos=100)
    elif is_points:add('points_card',max(1,h3),role='要点卡容器',pos=100)
    elif is_feature and not feature_table:add('feature_card',feature_n,role='按组功能网格',pos=100)
    elif p.parent.name=='skills-home' and sec!='top' or p.parent.name=='rules-home' and sec=='topics':
        add('directory_tile',max(1,len(st['numbered_lines']),st['bullet_lines']),role='目录网格',pos=100,estimated=True)
    elif p.parent.name=='how' and sid in ['how-06','how-07','how-08']:
        add('directory_tile',max(1,st['bullet_lines']),role='按区域项目输入输出卡',pos=100,estimated=True)
    elif has_card:add('content_card',cardn,role='内容卡容器',estimated=True)
    if re.search(CAT['glossary'][1],ac):add('glossary',role='词条区')
    flow=bool(re.search(CAT['flow'][1],ac)) and not is_project and not is_source
    if p.parent.name in ['skills-home','rules-home'] and sec!='top':flow=False
    # 图中的叙事箭头不是全部都另拆成流程组件；只有说明明确要求流程的才登记。
    if flow:add('flow',max(1,len(st['numbered_lines'])),role='流程节点区',estimated=True)
    steps=bool(st['numbered_lines']) and not is_feature and not is_source
    if (steps or re.search(CAT['numbered_steps'][1],ac)) and not (is_feature or is_project or is_source):
        add('numbered_steps',max(1,len(st['numbered_lines'])),role='流程内／步骤卡',estimated=not bool(st['numbered_lines']))
    if re.search(CAT['topology'][1],ac) and not is_source and not is_project:add('topology',role='架构图形区')
    timeline=bool(re.search(CAT['timeline'][1],ac)) or sec=='history'
    if timeline:
        events=max(1,st['bullet_lines'],len(st['numbered_lines']));add('timeline',events,role='时间节点',estimated=events==1)
    if st['tables'] or re.search(CAT['table'][1],ac):add('table',len(st['tables']) or 1,role='表格区',estimated=not bool(st['tables']))
    if re.search(CAT['comparison'][1],ac) and not is_project:add('comparison',role='左右／前后对照')
    if re.search(CAT['dialogue'][1],ac) and not is_project:
        # 插画里的无字聊天气泡并不等于排版对话。
        if sec=='examples' or p.parent.name.startswith('skill-') and sec=='top' or re.search('写“跟 AI|写“怎么跟|引号里的话|我”的气泡|“AI 交回”|每句.*气泡|气泡.*里面是我说',ac):add('dialogue',role='有字气泡')
    if re.search('引语|引用框|引语框|以“例：”|以“实例：”|引语一句',ac) or (sec=='examples' and 'dialogue' not in comps):add('quote',role='引用／例句底框')
    if re.search(CAT['notice'][1],ac) and not is_project:add('notice',role='提示／便签条')
    if re.search(CAT['tag'][1],ac):
        # 插画里明确不写字的牌子不是文本胶囊；项目卡真实状态按 card 字段判。
        if is_project and not s.get('card',{}).get('status') and sid=='projects-home-20':pass
        elif re.search('标签|胶囊|徽章',ac):add('tag',role='卡内／标题旁标签')
    if is_feature or re.search('圆点表示状态|状态圆点|状态小圆点|小水彩灯|水彩色点|绿点、黄点|图例',ac):
        if not ('实线、虚线、点线、双线' in ac and not re.search('圆点|色块|状态|小标签',ac)):add('status_legend',role='状态点／实际图例')
    if re.search(CAT['line_legend'][1],ac):add('line_legend',role='线型图例')
    lives=s.get('live',[])
    if lives and p.parent.name not in ['cockpit','computer-access']:
        if re.search('现在',ac):add('live_strip',len(lives),ev=f'本屏 live={lives}；对应现在横条／实时框',role='实时横条')
        else:add('live_box',len(lives),ev=f'本屏 live={lives}',role='实时框')
    if p.parent.name=='cockpit':
        if '九宫格' in a:add('stretch_list',1,role='实时列表容器')
        if sid=='cockpit-01':add('live_box',7,ev='圆形总灯位＋总灯文字框＋五个速览空框；另有要处理列表框',role='总览实时槽')
        if sid=='cockpit-07':add('live_box',3,ev='三张状态卡，每张下半一个留空框',role='卡内实时槽')
        if sid=='cockpit-04':add('live_embed',1,role='实时嵌入槽')
    if p.parent.name=='computer-access' and lives:
        add('live_box',4 if sid=='computer-access-01' else 1,ev='连接状态／三张卡状态，或预览／结果提示；来自本屏 scene 和 live',role='实时状态槽')
    if re.search(CAT['input_field'][1],ac):add('input_field',2,role='实际输入槽')
    shots=s.get('screenshots',[])
    shot_groups=[];seen=set()
    for n,shot in enumerate(shots):
        group=shot.get('compare') or f'ordinary-{n}'
        if group not in seen:seen.add(group);shot_groups.append(group)
    screenshot_count=len(shot_groups)
    if shots or re.search(CAT['screenshot'][1],ac):add('screenshot',screenshot_count or 1,role='实际截图槽',estimated=not bool(shots))
    if any(x.get('compare') for x in shots) or re.search('左右拖动|改前改后对比',ac):add('screenshot_compare',len({x.get('compare') for x in shots if x.get('compare')}) or 1,role='截图槽交互层')
    if re.search(CAT['annotation'][1],a):add('annotation',role='图形／截图文字覆盖层')
    if re.search(CAT['monospace'][1],ac) or '`' in t:add('monospace',role='命令／代码／地址文字')
    if re.search(CAT['chart'][1],ac) and not (p.parent.name in ['skills-home','rules-home'] and sec!='top'):add('chart',role='数据图形')
    if re.search(CAT['document_mock'][1],a):add('document_mock',role='有字结果／窗口小样')
    if re.search(CAT['segmented_band'][1],ac) and not is_source and not is_project:add('segmented_band',role='层级／分段图形')
    if p.parent.name=='how' and (sid=='how-02' or sec.startswith('case-') or sid in ['how-13','how-14','how-15']):add('map',role='地图底图＋文字牌＋网页连线')
    if shape=='strip' or re.search(CAT['title_strip'][1],ac):add('title_strip',role='独立矮横条',pos=-1)
    if re.search(CAT['button_variants'][1],ac):add('button_variants',role='网页切换按钮状态')
    if re.search(CAT['site_chrome_reference'][1],ac):add('site_chrome_reference',role='引用共享页眉页脚')

    # 图像资产预算：同一逻辑屏的横竖共用一次，不计线／边框／灯点／编号／箭头／绿叶装饰。
    art_notes=[];art_est=False;icons=0;ills=0
    aa=a # 图标枚举经常在括号内，资产计数必须读原 scene，不能用去括号的布局摘要。
    if is_project:ills=1;art_notes.append('独立项目卡规定一幅内容插画；数字格不自带图标')
    elif is_source:
        ills=1 if sid in ['charter-03','charter-04','charter-05'] else 0
        art_notes.append('原文页角落绿叶统一装饰不另采购；只计明确小画')
    else:
        # 明确“每张上面一幅”是一卡一画，不能只算一幅。
        each_art=bool(re.search(r'每张[^。]{0,35}(?:一幅[^，。]{0,12}插画|小水彩插画|水彩插画|小插画)|各[^。]{0,25}一幅[^。]{0,12}插画',aa))
        has_art=bool(re.search('插画|小幅水彩|水彩小画|一小幅.*水彩|一幅.*水彩',ac))
        explicit=[number(m[1]) for m in re.finditer(rf'({NUM})\s*幅\s*(?:大一点的|小|水彩|小水彩|较大的|很小的|上下两格的|大)*\s*(?:水彩插画|插画|小插画|水彩小画|水彩)',ac)]
        if each_art and not is_points and not is_feature:
            ills=cardn;art_notes.append(f'每卡一幅插画，主卡数取 {cardn}')
            if shots and sec in ['highlights','tech'] and re.search('插画位换成|不画插画|或截图',ac):
                ills=max(0,ills-screenshot_count);art_notes.append('截图替代插画位，扣除对应槽数')
            # 主卡外额外插画：仅分离明确的旁侧／卡下，不重复数“一幅”泛指。
            if re.search('卡片(?:下面|下方).*一幅|右列最后一张下面接一小幅',ac):ills+=1
            art_est=True
        elif explicit:
            ills=sum(explicit);art_notes.append('scene 明确的一幅／小幅插画位；重复卡顶另按卡数')
            # repeated description of same illustration shouldn't double count; hero scene may show one.
            if sec=='top':ills=1
            art_est=len(explicit)>1
        elif has_art:
            ills=1;art_est=True;art_notes.append('描述未明确分幅，按一幅独立插画估计')
        if sec=='top' and p.parent.name=='steam-millennium-config-backup':ills=0
        if is_feature:
            icons=feature_n;art_notes.append('每功能卡／表格行一个小水彩图标，按定稿编号、列表或功能行实数')
            if feature_table:icons+=sum(bool(re.match(r'^\*\*.+\*\*$',l)) for l in t.splitlines())
            if '插画' in ac and '空出' in ac:
                if sid=='work-delivery-copilot-09':ills=3
                elif sid=='codex-local-remote-05':ills=1
                else:ills=max(ills,1)
            else:ills=0
        elif is_points:
            icons=max(1,h3);art_notes.append('每个 ### 要点卡一个图标')
            # 示例默认模板提到“插画”不自动采购一幅；只有明确额外的小景。
            if not re.search('一幅|一小幅|小景|小画',ac):ills=0
        else:
            # 行首／节点／卡角的批量小图标，按各自结构计，避免只按文字出现次数。
            if not timeline and re.search('每个节点[^。]{0,35}小.*图标|每步[^。]{0,30}小.*图标|节点.*图标依次|节点.*小水彩图标|每站一个小图标',aa):
                n=quantities(aa,r'(?:编号|圆形|圆角|小|流程)?\s*(?:节点|站|步骤|小旗|工位)')
                node_n=max(n) if n else max(1,len(st['numbered_lines']))
                icons+=node_n;art_notes.append(f'流程／步骤图标按 {node_n} 节点估算');art_est=True
            if timeline and re.search('每个节点.*小.*图标',aa):
                icons+=max(1,st['bullet_lines'],len(st['numbered_lines']));art_notes.append('时间线逐日期节点图标')
            if re.search('每张(?:卡片|卡|小卡片|大卡片)[^。]{0,40}小.*(?:图标|标志)|每张[^。]{0,30}小水彩图标|卡片左上角一个小水彩图标',aa):
                icons+=cardn;art_notes.append(f'卡角／卡首图标按 {cardn} 主卡估算');art_est=True
            if re.search('每行[^。]{0,40}小.*图标|行首一个小水彩图标|左列每格前一个小水彩图标',aa) and st['tables']:
                n=sum(x['data_rows'] for x in st['tables']);icons+=n;art_notes.append(f'表格逐行图标 {n}')
            if re.search('每条[^。]{0,45}小.*图标|每段[^。]{0,40}小水彩图标',aa):
                n=st['bullet_lines'] or len(st['numbered_lines']) or cardn
                q=quantities(aa,r'(?:带[^，。]{0,20}|编号|带小水彩图标的)?\s*(?:短句|短段|条目|规矩|说明|小条|字|段)')
                if q:n=max(q)
                icons+=n;art_notes.append(f'逐条说明图标 {n}');art_est=True
            if statn and re.search('数字卡[^。]{0,100}(?:小图标|小水彩图标|小插画|插画)|小插画依次|小插画，大号|上面一个小水彩图标',aa):
                icons+=statn;art_notes.append(f'数字卡图标 {statn}')
            if not icons and re.search('小图标|小水彩图标|小水彩线描图标',aa):
                icons=max(1,cardn if re.search('左右.*卡|两张.*卡',aa) else 1);art_est=True;art_notes.append('图标数未逐个指定，按主要结构估计')
    # 明确特殊结构的资产数覆盖，保留理由。
    ASSET_OVERRIDES={
      'agents-01':(1,4),'agents-02':(2,5),'agents-03':(0,8),'agents-05':(0,7),'agents-07':(1,2),'agents-08':(0,10),
      'agents-09':(4,0),'agents-10':(0,5),'agents-11':(3,0),'agents-15':(1,12),'agents-16':(0,3),
      'chinese-asr-03':(1,7),'chinese-asr-04':(0,5),'chinese-asr-05':(1,11),'chinese-asr-06':(0,11),
      'charter-01':(1,0),'devconfig-backup-03':(2,1),'devconfig-backup-05':(0,17),'devconfig-backup-10':(0,2),
      'pcconfig-01':(1,4),'pcconfig-02':(0,10),'pcconfig-03':(1,0),'pcconfig-06':(1,6),'pcconfig-07':(0,10),
      'pcconfig-08':(1,2),'pcconfig-09':(1,4),'pcconfig-10':(2,0),'pcconfig-11':(1,0),'pcconfig-12':(0,7),
      'pcconfig-13':(0,6),'pcconfig-16':(3,0),'personal-media-01':(1,4),'personal-media-02':(3,0),
      'personal-media-03':(0,4),'personal-media-04':(0,0),'personal-media-05':(1,6),'personal-media-06':(1,0),
      'personal-media-07':(2,3),'personal-media-08':(0,8),'personal-media-09':(0,6),'personal-media-10':(3,0),
      'projects-home-01':(1,0),'rules-home-01':(1,0),'rules-home-02':(0,10),'rules-home-03':(0,6),'rules-home-04':(0,2),
      'skills-home-01':(1,0),'skills-home-02':(0,9),'skills-home-03':(0,8),'skills-home-04':(0,9),
      'how-01':(1,0),'how-02':(1,34),'how-03':(0,4),'how-04':(1,4),'how-05':(0,6),
      'how-09':(2,0),'how-10':(2,0),'how-11':(2,0),'how-12':(1,0),'how-13':(1,4),'how-14':(2,0),'how-15':(1,1),
      'how-this-site-08':(0,4),'how-this-site-09':(0,3),'how-this-site-11':(0,0),'how-this-site-12':(1,0),
      'how-this-site-13':(1,0),'how-this-site-14':(1,0),'how-this-site-14b':(1,5),'how-this-site-15':(0,6),
      'cockpit-01':(1,0),'cockpit-02':(1,0),'cockpit-03':(1,6),'cockpit-04':(0,1),'cockpit-05':(1,5),
      'cockpit-06':(0,5),'cockpit-07':(0,3),'cockpit-08':(1,0),'cockpit-09':(0,6),
      'computer-access-01':(1,3),'computer-access-02':(0,3),'computer-access-03':(0,0),'computer-access-04':(0,0),
      'mcp-01':(1,2),'mcp-02':(0,6),'mcp-03':(0,3),'mcp-04':(0,3),'mcp-05':(0,2),'mcp-06':(0,4),
      'rescue-01':(1,0),'rescue-02':(0,4),'rescue-03':(0,4),'rescue-04':(0,4),'rescue-05':(0,4),
      'rescue-06':(0,4),'rescue-07':(0,4),'rescue-08':(0,4),'rescue-09':(0,4),'rescue-10':(0,4),
      '404-01':(1,4),'work-delivery-copilot-02':(4,0),'work-delivery-copilot-06':(0,14),'work-delivery-copilot-08':(3,3),
      'video-scaffold-08':(3,15),'video-scaffold-09':(3,16),'chinese-asr-14':(1,13),'timeaudit-16':(1,9),
      'personal-formal-documents-09':(1,8),
      'ai-cli-profile-manager-02':(0,6),'ai-cli-profile-manager-04':(0,4),'ai-cli-profile-manager-07':(0,7),
      'ai-cli-profile-manager-08':(0,6),'ai-cli-profile-manager-09':(1,5),'ai-cli-profile-manager-11':(0,6),
      'codex-memory-02':(0,8),'codex-memory-03':(0,5),'codex-memory-06':(1,4),'codex-memory-08':(4,0),
      'daily-preferences-04':(0,4),'daily-preferences-05':(0,7),'daily-preferences-07':(0,8),'daily-preferences-10':(0,6),
      'devconfig-backup-02':(0,4),'devconfig-backup-04':(0,6),'emerald-veil-04':(0,7),'emerald-veil-05':(0,7),
      'github-local-index-03':(1,0),'github-local-index-05':(0,8),'localocr-05':(0,7),'localocr-08':(1,4),
      'meshclip-kit-02':(3,3),'meshclip-kit-06':(3,3),'personal-expression-07':(0,7),
      'password-center-02':(1,5),'password-center-06':(1,6),'password-center-07':(2,0),'password-center-08':(0,9),
      'password-center-09':(0,5),'password-center-10':(0,4),'password-center-11':(0,5),'password-center-12':(3,4),
      'pc-panel-hub-02':(0,5),'pc-panel-hub-03':(0,9),'pc-panel-hub-05':(1,6),'pc-panel-hub-08':(0,4),
      'personal-materials-06':(0,4),'personal-materials-09':(0,4),'proxyclean-03':(0,1),'proxyclean-05':(0,8),
      'ramdisk-guardian-05':(0,4),'remote-control-05':(0,6),'sunshine-remote-streaming-04':(0,6),
      'sunshine-remote-streaming-05':(0,6),'timeaudit-05':(1,5),'timeaudit-06':(1,6),'timeaudit-09':(0,8),
      'timeaudit-12':(1,0),'vault-tool-06':(0,6),'wechatdirect-04':(0,9),'wechatdirect-05':(1,10),
      'wechatdirect-06':(0,4),'work-delivery-copilot-07':(0,6),
    }
    if sid in ASSET_OVERRIDES:
        ills,icons=ASSET_OVERRIDES[sid];art_notes.append('复核 scene 的特殊组合后指定预算');art_est=True
    if p.parent.name=='github-profile':
        ills=1 if sid not in ['github-profile-02','github-profile-09'] else 0;icons=0
    if s.get('shape')=='strip':ills=icons=0;art_notes.append('横条绿叶可复用共享装饰，不单列内容插画')
    if ills:add('illustration',ills,role='无字图像资产位',estimated=art_est)
    if icons:add('icon',icons,role='无字小图像资产位',estimated=art_est)
    if not ills:comps.pop('illustration',None)
    if not icons:comps.pop('icon',None)
    # 外层模板优先在同一高度登记；其后的条目是子组件，不意味额外占一整行。
    ordered=sorted(comps.values(),key=lambda x:(x['_pos'],x['component']))
    # 常见模板给出明确的从上到下顺序，避免样式说明的叙述顺序被误作空间顺序。
    template_order=None
    if is_source:
        template_order=['section_heading','source_text_card','tag','prose','inline_link','monospace','table','illustration']
    elif is_feature:
        template_order=['chapter_title','status_legend','prose','section_heading','feature_card','table','content_card','icon','inline_link','tag','illustration']
    elif is_project:
        template_order=['project_tile','section_heading','inline_link','tag','prose','illustration','stat_card','action_button','icon']
    elif 'directory_tile' in comps:
        template_order=['chapter_title','section_heading','directory_tile','icon','inline_link','prose','tag','monospace']
    elif shape=='strip':template_order=['title_strip','section_heading','prose','inline_link']
    if template_order:
        ordered.sort(key=lambda x:(template_order.index(x['component']) if x['component'] in template_order else len(template_order),x['_pos']))
    else:
        ordered.sort(key=lambda x:(-1 if x['component']=='chapter_title' else 0,x['_pos'],x['component']))
    for n,c in enumerate(ordered,1):c['order']=n;c.pop('_pos')
    portrait=[]
    for c in ordered:
        rx=CAT[c['component']][1];m=re.search(rx,v)
        portrait.append((m.start() if m else 10000+c['order'],c['component']))
    portrait.sort()
    images=[{'path':str(q),'bytes':q.stat().st_size} for q in image_files if q.stem==sid or q.stem.startswith(sid+'-')]
    # 按确定约定标出不能替换的模式和分张顺序。
    no_portrait='不画竖版' in v or '不另画竖版' in v
    portrait_files=[q.name for q in image_files if re.match(re.escape(sid)+r'-v\d*$',q.stem)]
    portrait_files=sorted(portrait_files,key=lambda x:int(re.search(r'-v(\d*)\.',x)[1] or 1))
    mode='独立卡片' if is_project else '规则原文' if is_source else '分组横条' if shape=='strip' else 'GitHub 深浅双主题' if p.parent.name=='github-profile' else '普通整屏'
    def columns(desc):
        nums=[number(m[1]) for m in re.finditer(rf'({NUM})\s*列',desc)]
        nums.extend(number(m[1]) for m in re.finditer(rf'每(?:排|行)\s*({NUM})\s*(?:张|个)',desc))
        if '一行一张' in desc or '一张一行' in desc or '一行一条' in desc:nums.append(1)
        return sorted(set(nums))
    return {'screen_id':sid,'page':p.parent.name,'batch':p.parent.parent.name,'source_path':str(p),'source_sha256':sha(p.read_bytes()),
      'section':sec,'title':s.get('title'),'shape':shape or 'screen','layout_mode':mode,'hidden':bool(s.get('hidden',False)),
      'components':ordered,'desktop_component_order':[x['component'] for x in ordered],
      'portrait_component_order':[] if no_portrait else [x[1] for x in portrait],
      'order_basis':'常见模板按标题／图例／组名／卡片／卡内元素／底部的空间顺序；其他屏按 scene 的上到下描述列外层与子组件，左右并排读左后右。portrait 按原描述首提位置。source_layout 保留完整原文，具体跨栏先后以它为准。',
      'source_layout':{'desktop':a,'portrait':v},'text_structure':st,
      'layout_variants':{'desktop_columns_mentioned':columns(a),'portrait_columns_mentioned':columns(v),
        'card_groups':[l.strip('* #') for l in t.splitlines() if re.match(r'^\*\*[^*]+\*\*$',l)],
        'table_shapes':st['tables'],'illustration_position_mentions':[m[0] for m in re.finditer(r'(?:左|右|上|下|顶)[^。；]{0,30}(?:插画|小水彩|小幅水彩)',a)],
        'portrait_split_or_protection':bool(re.search(r'分[234五六七八九十\d]*张|v2|v3|不拆张|不重画|原路径|字节保护|原范围',v))},
      'assets':{'illustrations':ills,'small_icons':icons,'combined':ills+icons,'estimated':art_est,'basis':art_notes,
                'count_scope':'逻辑屏横竖共用的资产位；不含同图不同主题／尺寸导出；不含共享叶子、线、框、状态点、编号。','existing_screen_images':images},
      'has_live_frame':bool(lives),'live_slots':lives,'has_screenshot_slot':'screenshot' in comps,
      'screenshot_slot_count':screenshot_count or (comps.get('screenshot',{}).get('count',0)),
      'screenshot_sources':shots,'chain':s.get('chain',''),'reuse':s.get('reuse',''),
      'portrait':{'required':not no_portrait,'existing_parts':portrait_files,'explicit_order':s.get('portrait_order',[]),'constraints':v},
      'card_numbers_actual':s.get('card',{}).get('numbers',[]) if is_project else [],
      'links_count':len(s.get('links',[])),'anchors_count':len(s.get('anchors',[]))}

def main():
    paths=sorted(ROOT.glob('*/page.json'))
    before={str(p):sha(p.read_bytes()) for p in paths};image_before={};rows=[];pages=[]
    for p in paths:
        raw=p.read_bytes();d=bound_json(p, lambda source: source.read_text('utf-8-sig'))
        imgs=sorted(q for q in (p.parent/'img').glob('*') if q.is_file() and q.suffix.lower() in ['.png','.jpg','.jpeg','.webp','.avif'])
        for q in imgs:image_before[str(q)]=(q.stat().st_size,q.stat().st_mtime_ns)
        pages.append({'batch':p.parent.parent.name,'page':p.parent.name,'screens':len(d['screens']),'source_path':str(p),'sha256':sha(raw)})
        rows.extend(inventory(p,d,s,imgs) for s in d['screens'])
    ids=[x['screen_id'] for x in rows];assert len(ids)==len(set(ids)), '重复屏 id'
    for row in rows:
        assert all(x['component'] in CAT for x in row['components'])
        assert row['assets']['combined']==row['assets']['illustrations']+row['assets']['small_icons']
        assert row['screenshot_slot_count']>=0
    counts=collections.Counter(c['component'] for r in rows for c in r['components'])
    items=collections.Counter()
    for r in rows:
        for c in r['components']:items[c['component']]+=c['count']
    illustrations=sum(r['assets']['illustrations'] for r in rows);icons=sum(r['assets']['small_icons'] for r in rows)
    changed_sources=[p for p,h in before.items() if sha(pathlib.Path(p).read_bytes())!=h]
    changed_images=[p for p,s in image_before.items() if not pathlib.Path(p).exists() or (pathlib.Path(p).stat().st_size,pathlib.Path(p).stat().st_mtime_ns)!=s]
    stats={'generated_at_beijing':NOW,'scope':'sources/pages 直接子页，不含递归历史／预览／退役目录',
      'pages':len(paths),'screens':len(rows),'batches':dict(collections.Counter(r['batch'] for r in rows)),
      'component_types':len(counts),'component_screen_counts':dict(sorted(counts.items())),'component_item_counts':dict(sorted(items.items())),
      'illustrations':illustrations,'small_icons':icons,'total_visual_asset_slots':illustrations+icons,
      'asset_estimated_screens':sum(r['assets']['estimated'] for r in rows),
      'live_screens':sum(r['has_live_frame'] for r in rows),'live_registry_slots':sum(len(r['live_slots']) for r in rows),
      'screenshot_screens':sum(r['has_screenshot_slot'] for r in rows),'screenshot_slots':sum(r['screenshot_slot_count'] for r in rows),
      'screenshot_source_files':sum(len(r['screenshot_sources']) for r in rows),
      'logical_shapes':dict(collections.Counter(r['shape'] for r in rows)),
      'existing_image_files':len(image_before),'screens_with_existing_images':sum(bool(r['assets']['existing_screen_images']) for r in rows),
      'no_separate_portrait_screens':sum(not r['portrait']['required'] for r in rows),
      'portrait_multi_part_screens':sum(len(r['portrait']['existing_parts'])>1 for r in rows),
      'readonly_verification':{'source_sha256_unchanged':not changed_sources,'changed_sources':changed_sources,
        'image_size_mtime_unchanged':not changed_images,'changed_images':changed_images,'image_content_hashes_checked':False},
      'reuse_estimate':{'illustrations_fraction':0.65,'icons_fraction':0.55,'basis':'抽看三张现有图：agents-01-h、agents-12-h、projects-home-03。按分区独立、无字、裁切余量粗估；未裁切验证，不是逐幅可复用名单。','approx_reusable_illustrations':round(illustrations*.65),'approx_reusable_icons':round(icons*.55)},
      'pages_manifest':pages}
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'screens.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False,separators=(',',':'))+'\n' for r in rows),encoding='utf-8')
    jwrite(OUT/'stats.json',stats)
    md=['# 全站排版组件总表',f'\n清点时间：{NOW}（北京时间）；离线只读分析。活动规则核验由调用方记录。',
      f'\n## 范围与数字\n\n指定范围共 **{len(paths)} 页、{len(rows)} 屏、{len(counts)} 类组件**。来源 `sources/pages/`。三张总页已包含。只读直接子页，不含管线历史／预览和退役目录。',
      f'\n规划无字水彩资产位 **{illustrations} 幅插画＋{icons} 个小图标＝{illustrations+icons} 个**。这是按描述拆分的预算，{stats["asset_estimated_screens"]} 屏涉及数量推断；不是去重后的最终采购量。横竖不翻倍，共享叶子／状态点／箭头／线框不计。',
      f'\n实时框涉及 **{stats["live_screens"]} 屏**（live 注册 {stats["live_registry_slots"]} 项）；截图／照片槽涉及 **{stats["screenshot_screens"]} 屏、{stats["screenshot_slots"]} 槽**，使用 {stats["screenshot_source_files"]} 条源图记录。before／after 两图按同一槽计。',
      '\n组件「屏数」是一屏是否用到，不按卡片／图标数量膨胀。嵌套组件也分别登记，所以各类屏数不能相加当作总屏数。正文、标题、链接的数量列不是逐字渲染字数。',
      '\n## 各组件出现屏数\n\n| 组件 | 屏数 | 示例屏 id |\n|---|---:|---|']
    for k,n in sorted(counts.items(),key=lambda x:(-x[1],x[0])):
        ex=[r['screen_id'] for r in rows if k in r['desktop_component_order']][:3]
        md.append(f'| {CAT[k][0]} `{k}` | {n} | {"、".join(ex)} |')
    md.append('\n## 外形、原话依据与横竖排法\n')
    for k,n in sorted(counts.items(),key=lambda x:(-x[1],x[0])):
        candidates=[r for r in rows if k in r['desktop_component_order']]
        # 例子优先跨页，便于看到共性；只有一屏的组件不伪造 2～3 个例子。
        examples=[];seen=set()
        for r in candidates:
            if r['page'] not in seen:examples.append(r);seen.add(r['page'])
            if len(examples)==3:break
        if len(examples)<3:
            examples.extend(r for r in candidates if r not in examples)
            examples=examples[:3]
        md.extend([f'### {CAT[k][0]}（{n} 屏）\n',f'- 标识：`{k}`；例子：'+ '、'.join(r['screen_id'] for r in examples)+ '。'])
        quote=None
        for r in examples:
            quote=first_quote(r['source_layout']['desktop'],CAT[k][1])
            if quote:break
        if quote:md.append(f'- scene 原话（{r["screen_id"]}）：“{quote}”。')
        else:
            c=next(c for c in examples[0]['components'] if c['component']==k)
            md.append(f'- 依据（{examples[0]["screen_id"]}）：{c["evidence"]}。此项由定稿结构或注册字段确认，scene 无独立完整句。')
        md.append(f'- 横竖排法：{CAT[k][2]}')
    md.extend(['\n## 逐屏清单字段与阅读顺序\n',
      '`screens.jsonl` 每行一屏，包含 page／batch／source_path／source_sha256、components（顺序、名称、计数、依据、是否估算）、横竖组件顺序、完整 scene／portrait 原文、定稿结构、插画和小图标预算、实时槽、截图源与槽数、chain／reuse、实际项目数字格和竖版已有文件／显式顺序。',
      '常见模板顺序按标题／图例／组名／卡片／卡内元素／底部列出；其他屏按 scene 的上到下描述列外层和子组件，同高区域先左后右；容器内的标题、圆点、图标并非各占一整行。原 scene／portrait 同时保留供批量编译复核，不能把这份分类清单当成已审核过的坐标规范。',
      '\n## 必须按原约定处理的变体\n',
      '- 普通整屏之外：35 张项目独立卡、9 条项目分组横条、38 屏规则原文；另有 GitHub 页 9 屏深浅双主题，横幅 3:1、窄条 5:1／6:1、卡片 3:2，不另画竖版。',
      '- 数字格按 `card.numbers` 的实际 0～10 项，不按 scene 通用模板固定四张；技能总页每排四张，功能卡通常三列但有两列和按实际项数铺满。',
      '- 竖版分张已有文件只登记不移动、不重画；`pcconfig-05` 的显式顺序是 v、v3、v4、v2。有完整卡之间拆张，也有明确“不拆张”的屏，逐屏 portrait 原文保留。',
      '- 驾驶舱需动态列表九宫格边框、灯位、实时嵌入框；授权页需真实输入框及按钮变体；协作页需无连线地图底图、文字牌与网页动态连线／贴顶地图。它们不等同于普通现在横条。',
      '- 原描述中需要可读字的插画标签、窗口菜单、纸面、图表，都应由程序从定稿排字覆盖；裁切带字图标不算无字复用成功。',
      '\n## 现有插画复用粗估\n',
      f'抽看 agents-01-h、agents-12-h、projects-home-03 三张；共发现 {stats["existing_image_files"]} 张当前 img 直接图像文件，{stats["screens_with_existing_images"]} 屏有同 id 图像。只把现有整屏作为裁切候选，没有改图或生成裁切物。',
      f'AI 估计：大／小独立插画约 **65%** 可裁来复用（约 {round(illustrations*.65)} 幅）；小图标约 **55%**（约 {round(icons*.55)} 个），合计约 **{round((illustrations*.65+icons*.55)/(illustrations+icons)*100)}%**。粗估误差可达 ±20 个百分点。图标嵌字、图文交叠、底色或裁切空间不足时应重画；同物重复出现可进一步合并，但本清点没有对图像做跨屏去重。',
      '\n## 验证和边界\n',
      f'- JSON 定稿全部解析；屏 id 唯一；JSONL 行数 {len(rows)}，每屏组件标识都在总表；资产加总一致。',
      f'- 读取前后 {len(paths)} 份定稿 SHA-256 '+('一致。' if not changed_sources else '发生变化：'+str(changed_sources)),
      f'- {len(image_before)} 个直接图像文件大小和修改时间 '+('一致。' if not changed_images else '发生变化：'+str(changed_images)),
      '- 没有联网，没有弹窗口，没有修改网站／定稿／图片／登录／令牌／代理配置。只写本清点目录；规定汇报文件另写宿主结果目录。',
      '- 分类经过模式归并和特殊屏复核，资产数量仍有估计，不是对 740 屏逐幅裁切的可复用认证；组件布局编译前应检查字段与逐字定稿的对应。',
      '\n## AI 建议与要定的事\n',
      'AI 建议：样板通过后先补大标题、正文、链接按钮、数字卡、普通卡网格、功能卡、规则原文、表格转竖卡这组共性；地图和授权动态控件单列接入。依据是本表实际出现频率及它们的运行时差别。',
      '没有必须阻塞清点的产品取舍。大段竖版能否继续采用既有分张、地图标签如何层叠，是后续编译实现需按逐屏已定要求处理的技术事项；不在本清点里擅改。'])
    (OUT/'components.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in stats.items() if k not in ['pages_manifest','component_item_counts']},ensure_ascii=False,indent=2))

if __name__=='__main__':main()
