"""算坐标、生成第一屏总图 figures/overview.svg（横放的蝴蝶结，中间一盏绿灯）。

用法：python -B -X utf8 make_overview.py             # 写 figures/overview.svg（不铺列底色）
      python -B -X utf8 make_overview.py --bands     # 铺极淡的五列底色
      python -B -X utf8 make_overview.py --out X.svg

图上的每条线、每个名字都取自文稿（对照表随交付给本人）；改文稿后照着改下面的 LEFT、RIGHT。
左翼分四道关收拢：程序关 → AI 关 → 条件关 → “通知”→ 绿灯；每道关上按原来的上下顺序等距排开，
关与关之间用两端水平的三次曲线连，所以一根都不交叉。记号：点＝这一关有人接手，空心圈＝有情况才往下送，
线到最后一个接手的地方为止，线色＝这一段是谁在做。
给动效留的结构：一条线一个 <path>；左翼从左边缘画向中间，右翼从绿灯画向右边缘，“验收”从右翼尽头画回绿灯；
左翼线带周期档 v-tier-1…6，按停在哪一关分 <g>；记号带 ov-mk 和亮起的时刻 --d；字单独放在 ov-words 里。
"""
import argparse
from html import escape
from pathlib import Path

HERE = Path(__file__).resolve().parent
W, H = 1170, 540
CY = 268                      # 绿灯和整张图的中轴
LAMP_X, LAMP_R = 585, 8.5

# 左翼：文稿里写明周期、一直在跑的事。（档, 周期, 叫法, 线色, 程序关, AI 关, 条件关, 到哪为止）
#   线色 ink / ai / ink>ai（过了 AI 关的空心蓝圈改蓝）；关上的记号 dot 实心点、ring 空心圈、"" 穿过；
#   到哪为止 p 程序关、ai AI 关、we 经通知到绿灯。
LEFT = [
    (1, "每 1.5 秒", "内存守护采样", "ink", "dot", "ring", "", "ai"),
    (1, "每 5 秒", "内存黑匣子", "ink", "dot", "", "", "p"),
    (1, "每 5 秒", "查待发通知", "ink", "dot", "", "", "we"),
    (2, "每 5 分钟", "收报错和新消息", "ink>ai", "dot", "ring", "ring", "we"),
    (2, "每 10 分钟", "云端看电脑", "ink", "dot", "", "ring", "we"),
    (2, "每半小时", "收手机上的记录", "ink", "dot", "", "", "p"),
    (2, "定时", "取定位，隔超半小时断开", "ink", "dot", "", "", "p"),
    (2, "每 30 分钟", "收录音，转成文字", "ink", "dot", "", "", "p"),
    (2, "闲满 55 分钟", "Claude 叫醒自己", "ai", "", "dot", "", "ai"),
    (3, "每小时", "备份短信和通话", "ink", "dot", "", "", "p"),
    (3, "每 6 小时", "清掉到期的文件", "ink", "dot", "", "", "p"),
    (4, "每天", "系统备成镜像", "ink", "dot", "", "", "p"),
    (4, "每天", "热备", "ink", "dot", "", "", "p"),
    (4, "每天", "备份 Codex 对话", "ink", "dot", "", "", "p"),
    (5, "每周", "新照片判断去留", "ai", "", "dot", "ring", "we"),
    (5, "每周", "复核改过的规矩", "ai", "", "dot", "", "ai"),
    (5, "每周", "软件查新版", "ink", "dot", "", "", "p"),
    (6, "每月", "月度信", "ai", "", "dot", "", "we"),
]

# 右翼：页面右栏“文中提到的项目”“文中提到的技能”，按第一次出现的节分组、组内按出现先后。
# “本地文字识别”两栏都有，只画一个点；第 10 节的“AI 规则与技能基座”就是规则线本身，画在规则线端点上；
# 最后一个“派活和验收”不从散开点出来，它的墨点就是“验收”回流弧线的起点。
RIGHT = [
    ("01", "设备互联", ["电脑远程控制", "远程电脑串流", "电脑使用与性能记录", "手机采集"]),
    ("02", "数据采集与回溯", ["个人健康", "个人材料查找", "照片视频录音管理"]),
    ("03", "个人理解", ["中文语音转写", "个人理解库", "认得出我"]),
    ("04", "凭据与数据安全", ["密码中心", "本地加密库"]),
    ("05", "代办事务", ["网页上的事接着办", "替我拟消息", "微信聊天读取", "文书和材料制作", "中外消息快查", "个人财务"]),
    ("06", "内容制作", ["本地视频制作", "生图", "汇报网页", "工作支持与交付"]),
    ("08", "系统维护与恢复", ["电脑配置与恢复", "查电脑卡顿", "本地文字识别"]),
    ("09", "多模型协作", ["AI 工具配置管理", "派活和验收"]),
]
# 节名已在别处出现的组（01 在底部设备之间，09 在模型下的括线），右翼只写灰色节号
NUMBER_ONLY = {"01", "09"}

SPAN_TOP, SPAN_BOT = 73, 463          # 两翼外侧上下沿，以中轴对称

# 左翼四道关的位置和槽位间距
# AI 关到绿灯的距离＝右翼模型到绿灯的距离；条件关和“通知”在 AI 关与绿灯之间均匀摆
X_LEAD, X_P, X_A, X_C, X_N = 186, 360, 462, 503, 544
P_P, P_A, P_C = 13, 13, 9
CURL = 0.4                            # 关与关之间三次曲线的控制柄长度（占水平距离的比例）

# 右翼
X_SPLIT0, X_SPLIT1, X_MODEL, X_LANE1, X_TRUNK = 652, 687, 708, 775, 807
MODELS = [(-45, "Claude", "claude"), (-15, "GPT", "gpt"),
          (15, "Gemini", "gemini"), (45, "生图模型", "image")]
X_FAN1, X_RDOT, X_NAME, X_GLAB = 932, 960, 970, 1164

# 开场动效的时间（毫秒），左翼揭开的缓动；记号亮起的时刻由揭开到它的那一刻算出来
REVEAL_MS, REVEAL_W = 1100, 580
REVEAL_EASE = (0.3, 0.55, 0.5, 1)


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def text_w(s, size):
    """粗估字宽：汉字一字一个字号，其余 0.56 个字号。"""
    return sum(size if ord(c) > 0x2E80 else size * 0.56 for c in s)


def bez(x1, y1, x2, y2, t):
    a = lambda p1, p2: 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3
    return a(x1, x2), a(y1, y2)


def reveal_at(x):
    """左翼揭到 x 的时刻（毫秒）：解 CSS cubic-bezier 缓动的反函数。"""
    want = min(1, x / REVEAL_W)
    lo, hi = 0.0, 1.0
    for _ in range(40):
        mid = (lo + hi) / 2
        if bez(*REVEAL_EASE, mid)[1] < want:
            lo = mid
        else:
            hi = mid
    tx = bez(*REVEAL_EASE, lo)[0]
    return round(tx * REVEAL_MS)


def link(x0, y0, x1, y1):
    """两端水平切线的三次曲线（Sankey 连线），接在当前点后面。"""
    k = (x1 - x0) * CURL
    if abs(y1 - y0) < 0.01:
        return f" H{f(x1)}"
    return f" C{f(x0 + k)},{f(y0)} {f(x1 - k)},{f(y1)} {f(x1)},{f(y1)}"


def mark(kind, color, x, y, r, title, d_ms, extra=""):
    """一个关上的记号：dot 实心点、ring 空心圈；color p 墨、a 蓝、w 绿。"""
    cls = {("dot", "p"): "v-p", ("dot", "a"): "v-a", ("ring", "a"): "v-a0", ("ring", "w"): "v-w0"}[(kind, color)]
    return (f'<circle class="{cls} ov-mk" cx="{f(x)}" cy="{f(y)}" r="{f(r)}" style="--d:{d_ms}ms"{extra}>'
            f'<title>{escape(title)}</title></circle>')


def sec(x, y, num, name, anchor="start"):
    a = f' text-anchor="{anchor}"' if anchor != "start" else ""
    tail = f'<tspan dx="6">{escape(name)}</tspan>' if name else ""
    return f'<text x="{f(x)}" y="{f(y)}" class="v-sec"{a}><tspan class="v-nn">{num}</tspan>{tail}</text>'


def split_cubic(p, t):
    """de Casteljau：把一段三次曲线在 t 处分成两段。"""
    lerp = lambda a, b: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    p01, p12, p23 = lerp(p[0], p[1]), lerp(p[1], p[2]), lerp(p[2], p[3])
    p012, p123 = lerp(p01, p12), lerp(p12, p23)
    m = lerp(p012, p123)
    return (p[0], p01, p012, m), (m, p123, p23, p[3])


def cpath(c):
    return f"M{f(c[0][0])},{f(c[0][1])} C{f(c[1][0])},{f(c[1][1])} {f(c[2][0])},{f(c[2][1])} {f(c[3][0])},{f(c[3][1])}"


def build(bands=False):
    back, lines, marks, words = [], [], [], []
    lamp_ms = REVEAL_MS

    # —— 列名对准各自那一列记号；底色栏（可选）以记号所在位置分界 ——
    col_x = [("p", "程序", X_P), ("a", "AI", X_A), ("w", "我们", LAMP_X), ("a", "AI", X_MODEL), ("p", "程序", X_RDOT)]
    edges = [0, 411, 505, 665, 759, W]
    for i, (kind, name, x) in enumerate(col_x):
        if bands:
            back.append(f'<rect class="v-colband v-colband--{kind}" x="{edges[i]}" y="0" width="{edges[i + 1] - edges[i]}" height="{H}"/>')
        words.append(f'<text x="{x}" y="30" class="v-col v-col--{kind}" text-anchor="middle">{name}</text>')

    # —— 规则线：横在两边 AI 列上方，细点线（钩子）落到两边的蓝点上 ——
    RULE_Y, RULE_L, RULE_R = 64, 2 * LAMP_X - 748, 748     # 以绿灯为中点左右等长
    static = [f'<path class="v-l" id="ov-rule" d="M{RULE_L},{RULE_Y} H{RULE_R}"/>']
    static_marks = [f'<circle class="v-p" id="ov-rule-base" cx="{RULE_L}" cy="{RULE_Y}" r="3.4"><title>AI 规则与技能基座</title></circle>']
    words.append(f'<text x="{RULE_L - 10}" y="{RULE_Y + 4.5}" class="v-t v-t--b" text-anchor="end">同一套规则</text>')
    words.append(f'<text x="{RULE_L - 10}" y="{RULE_Y + 21}" class="v-k" text-anchor="end">AI 规则与技能基座</text>')
    words.append(sec(RULE_R + 10, RULE_Y + 4.5, "10", "规则与演进"))

    # —— 左翼：四道关，等距、顺序不变 ——
    n = len(LEFT)
    to_a = [i for i, r in enumerate(LEFT) if r[7] != "p"]
    to_c = [i for i, r in enumerate(LEFT) if r[7] == "we"]
    slot = lambda k, m, p: CY + (k - (m - 1) / 2) * p
    t_p, t_a, t_c, t_n = (reveal_at(x) for x in (X_P, X_A, X_C, X_N))
    groups = {"p": [], "ai": [], "we": []}
    for i, (tier, period, name, color, gp, ga, gc, end) in enumerate(LEFT):
        title = f"{period} {name}"
        yo = SPAN_TOP + i * (SPAN_BOT - SPAN_TOP) / (n - 1)
        yp = slot(i, n, P_P)
        # 标签压在这条线外侧水平段的上方，线从左边缘起
        words.append(f'<text x="16" y="{f(yo - 6)}" class="v-g">{escape(period)}</text>')
        words.append(f'<text x="92" y="{f(yo - 6)}" class="v-k">{escape(name)}</text>')
        if gp:
            marks.append(mark("dot", "p", X_P, yp, 2.6, title, t_p))
        d1 = f"M16,{f(yo)} H{X_LEAD}" + link(X_LEAD, yo, X_P, yp)
        d2 = ""
        if end != "p":
            ya = slot(to_a.index(i), len(to_a), P_A)
            d1 += link(X_P, yp, X_A, ya)
            if ga:
                marks.append(mark(ga, "a", X_A, ya, 3.6 if ga == "dot" else 3.1, title, t_a))
            if end == "we":
                yc = slot(to_c.index(i), len(to_c), P_C)
                d2 = f"M{X_A},{f(ya)}" + link(X_A, ya, X_C, yc) + link(X_C, yc, X_N, CY)
                if gc:
                    marks.append(mark(gc, "w", X_C, yc, 2.9, "有情况才往下送到我们", t_c))
        cls = f"v-l v-wing v-tier-{tier}"
        first, last = color.split(">")[0], color.split(">")[-1]
        tone = lambda c: cls + (" v-wing--ai" if c == "ai" else "")
        if d2 and first == last:          # 同一种颜色：接成一根
            d1, d2 = d1 + d2[d2.index(" "):], ""
        seg = [f'<path class="{tone(first)}" d="{d1}"><title>{escape(title)}</title></path>']
        if d2:                            # 过了 AI 关改色：分两段
            seg.append(f'<path class="{tone(last)}" d="{d2}"><title>{escape(title)}</title></path>')
        key = {"p": "p", "ai": "ai", "we": "we"}[end]
        groups[key].append(f'<g data-row="{i + 1}">' + "".join(seg) + "</g>")
    left = ('<g class="ov-left">'
            + "".join(f'<g class="ov-left--{k}">' + "".join(v) + "</g>" for k, v in groups.items()) + "</g>")
    lines.append(left)
    # 开场用的盖板：和衬底同色，盖住左翼的线，开场时从左往右收掉；在线之上、其余一切之下。默认不显示。
    lines.append(f'<g class="ov-cover" style="--t:{REVEAL_MS}ms"><rect class="ov-cover-paper" x="0" y="{SPAN_TOP - 7}" '
                 f'width="{REVEAL_W}" height="{SPAN_BOT - SPAN_TOP + 14}"/><rect class="ov-cover-tint" x="0" y="{SPAN_TOP - 7}" '
                 f'width="{REVEAL_W}" height="{SPAN_BOT - SPAN_TOP + 14}"/></g>')
    ya_bot = slot(len(to_a) - 1, len(to_a), P_A)

    # 汇成一条，经“通知”接进绿灯（墨色实线）
    lines.append(f'<path class="v-l ov-draw" pathLength="1" style="--d:{t_n}ms;--t:{lamp_ms - t_n}ms" id="ov-to-lamp" '
                 f'd="M{X_N},{CY} H{LAMP_X - LAMP_R - 1}"/>')
    marks.append(mark("dot", "p", X_N, CY, 4.3, "通知", t_n, ' id="ov-notice"'))
    words.append(f'<text x="{X_N}" y="{CY - 11}" class="v-t" text-anchor="middle">通知</text>')
    TITLE_DX = 150                     # 左右两块标题以中轴对称
    words.append(f'<text x="{LAMP_X - TITLE_DX}" y="118" class="v-t v-t--l" text-anchor="end">替我们盯着</text>')
    words.append(f'<text x="{LAMP_X - TITLE_DX}" y="136" class="v-g" text-anchor="end">不开口也一直在跑</text>')
    words.append(f'<text x="{LAMP_X + TITLE_DX}" y="118" class="v-t v-t--l">替我们办事</text>')
    words.append(f'<text x="{LAMP_X + TITLE_DX}" y="136" class="v-g">开口到交回</text>')

    hooks = [f'<path class="v-l v-l--dot ov-fade" style="--d:1400ms" d="M{X_A},{RULE_Y} V{f(ya_bot)}"/>',
             f'<path class="v-l v-l--dot ov-fade" style="--d:1400ms" d="M{X_MODEL},{RULE_Y} V{CY + MODELS[-1][0]}"/>']

    # —— 右翼：说清要什么 → 选模型 → 一条干线 → 散开 ——
    green = [f'<path class="v-l v-l--we v-l--we-main ov-draw" pathLength="1" style="--d:1300ms;--t:300ms" id="ov-ask" '
             f'd="M{LAMP_X + LAMP_R + 1},{CY} H{X_SPLIT0}"/>']
    lens = []
    for dy, name, mid in MODELS:
        green.append(f'<path class="v-l v-l--we v-l--we-main ov-draw" pathLength="1" style="--d:1480ms;--t:160ms" '
                     f'd="M{X_SPLIT0},{CY}{link(X_SPLIT0, CY, X_SPLIT1, CY + dy)} H{X_MODEL}"/>')
        lens.append(f'<path class="v-l ov-draw" pathLength="1" style="--d:1660ms;--t:160ms" '
                    f'd="M{X_MODEL},{CY + dy} H{X_LANE1}{link(X_LANE1, CY + dy, X_TRUNK, CY)}"/>')
        marks.append(mark("dot", "a", X_MODEL, CY + dy, 5.2, name, 1600, f' id="ov-model-{mid}"'))
        words.append(f'<text x="{X_MODEL + 8}" y="{CY + dy - 6}" class="v-t">{name}</text>')
    lens.append(f'<path class="v-l ov-draw" pathLength="1" style="--d:1800ms;--t:40ms" d="M{X_TRUNK},{CY} H{X_TRUNK + 6}"/>')
    green.append(f'<path class="v-l v-l--we v-l--we-main ov-draw" pathLength="1" style="--d:1300ms;--t:400ms" id="ov-rules-up" '
                 f'd="M{LAMP_X},{CY - LAMP_R - 1} V{RULE_Y}"/>')
    words.append(f'<text x="{LAMP_X + 9}" y="186" class="v-t">定规矩</text>')
    words.append(f'<text x="{(LAMP_X + 9 + X_SPLIT0) / 2}" y="{CY - 9}" class="v-t" text-anchor="middle">说清要什么</text>')
    BR_Y = 332
    # 括线只括选模型那一段，让开从右下接进绿灯的“验收”
    static.append(f'<path class="v-l v-brace" d="M{X_SPLIT1},{BR_Y - 4} V{BR_Y} H{X_TRUNK + 2} V{BR_Y - 4}"/>')
    words.append(sec((X_SPLIT1 + X_TRUNK + 2) / 2, BR_Y + 18, "09", "多模型协作", "middle"))
    static.append(f'<path class="v-l v-brace" d="M{X_A + 6},{BR_Y - 4} V{BR_Y} H{LAMP_X - 16} V{BR_Y - 4}"/>')
    words.append(sec((X_A + 6 + LAMP_X - 16) / 2, BR_Y + 18, "07", "无人值守与通知", "middle"))

    items = sum(len(g[2]) for g in RIGHT)
    gap = 6
    pitch_r = (SPAN_BOT - SPAN_TOP - gap * (len(RIGHT) - 1)) / (items - 1)
    y, k_all = SPAN_TOP, 0
    fan, last = [], None
    x0 = X_TRUNK + 6
    for num, gname, names in RIGHT:
        for r, name in enumerate(names):
            title = f"{num} {gname}：{name}"
            d_ms = 2120 + k_all * 10          # 线画到了再亮，从上到下依次
            if num == RIGHT[-1][0] and r == len(names) - 1:
                last = (X_RDOT, y)
                d_ms = 2400
            else:
                fan.append(f'<path class="v-l v-fan ov-draw" pathLength="1" style="--d:1820ms;--t:520ms" '
                           f'd="M{x0},{CY}{link(x0, CY, X_FAN1, y)} H{X_RDOT}"><title>{escape(name)}</title></path>')
            marks.append(mark("dot", "p", X_RDOT, y, 2.5, title, d_ms))
            words.append(f'<text x="{X_NAME}" y="{f(y + 4)}" class="v-k">{escape(name)}</text>')
            if r == 0:
                label = (num, None) if num in NUMBER_ONLY else (num, gname)
                lab_w = text_w(num, 11) + (6 + text_w(gname, 11.5) if label[1] else 0)
                if X_NAME + text_w(name, 11.5) + 10 > X_GLAB - lab_w:
                    raise SystemExit(f"组名和第一行的名字挤在一起：{num}")
                words.append(sec(X_GLAB, y + 4, num, label[1], "end"))
            y += pitch_r
            k_all += 1
        y += gap
    lines.append('<g class="ov-right">' + "".join(green) + "".join(lens) + "".join(fan) + "</g>")

    # —— 验收：从“派活和验收”的墨点出发，贴着底部平走，缓缓上扬，从右下约 45° 接进绿灯 ——
    rx, ry = last
    end = (LAMP_X + (LAMP_R + 1) * 0.7071, CY + (LAMP_R + 1) * 0.7071)
    curve = ((rx, ry), (rx - 260, ry), (end[0] + 130, end[1] + 130), end)
    ink, grn = split_cubic(curve, 0.92)
    lines.append(f'<path class="v-l v-check ov-draw" pathLength="1" style="--d:2400ms;--t:420ms" id="ov-check-back" d="{cpath(ink)}"/>')
    lines.append(f'<path class="v-l v-l--we v-l--we-main ov-draw" pathLength="1" style="--d:2820ms;--t:90ms" id="ov-check" d="{cpath(grn)}"/>')
    words.append(f'<text x="{f(grn[0][0] - 7)}" y="{f(grn[0][1] + 13)}" class="v-t" text-anchor="end">验收</text>')

    # —— 地面和三台设备 ——
    G = 500
    PH, DT, LT = LAMP_X - 165, LAMP_X, LAMP_X + 165
    static.append(f'<path class="v-l v-ground" d="M16,{G} H{PH - 9} M{PH + 9},{G} H{DT - 22} M{DT + 22},{G} H{LT - 17} M{LT + 17},{G} H{W - 16}"/>')
    icons = [
        f'<g id="ov-phone"><title>手机</title><rect class="v-ico" x="{PH - 9}" y="{G - 16}" width="18" height="32" rx="4"/>'
        f'<path class="v-l" d="M{PH - 3},{G + 11} H{PH + 3}"/></g>',
        f'<g id="ov-desktop"><title>台式机</title><rect class="v-ico" x="{DT - 22}" y="{G - 15}" width="44" height="28" rx="3.5"/>'
        f'<path class="v-l" d="M{DT},{G + 13} V{G + 20} M{DT - 10},{G + 21} H{DT + 10}"/></g>',
        f'<g id="ov-laptop"><title>笔记本</title><rect class="v-ico" x="{LT - 17}" y="{G - 12}" width="34" height="23" rx="3"/>'
        f'<path class="v-l" d="M{LT - 24},{G + 16} H{LT + 24}"/></g>',
    ]
    for x, name in ((PH, "手机"), (DT, "台式机"), (LT, "笔记本")):
        words.append(f'<text x="{x}" y="{G + 36}" class="v-t" text-anchor="middle">{name}</text>')
    words.append(sec((PH + DT) / 2, G - 8, "01", "设备互联", "middle"))

    # —— 绿灯：页眉小绿灯的样子，带一圈很淡的光晕；ov-flash 平时看不见，开场末尾闪一下 ——
    lamp = (f'<g id="ov-lamp" style="--d:{lamp_ms}ms"><title>我们</title>'
            f'<circle class="ov-flash" cx="{LAMP_X}" cy="{CY}" r="30" fill="url(#ov-glow)"/>'
            f'<g class="ov-halo"><circle class="ov-glow" cx="{LAMP_X}" cy="{CY}" r="30" fill="url(#ov-glow)"/></g>'
            f'<g class="ov-lamp-core"><circle class="v-lamp-ring" cx="{LAMP_X}" cy="{CY}" r="12.5"/>'
            f'<circle cx="{LAMP_X}" cy="{CY}" r="{LAMP_R}" fill="url(#ov-lamp-body)"/></g></g>')
    defs = ('<defs><radialGradient id="ov-glow"><stop offset="0" stop-color="#00be5f" stop-opacity=".30"/>'
            '<stop offset=".45" stop-color="#00be5f" stop-opacity=".12"/><stop offset="1" stop-color="#00be5f" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="ov-lamp-body" cx=".34" cy=".3" r=".75"><stop offset="0" stop-color="#e2ffee"/>'
            '<stop offset=".26" stop-color="#55e79e"/><stop offset=".6" stop-color="#00a650"/><stop offset="1" stop-color="#008e45"/></radialGradient></defs>')

    body = (defs + "".join(back)
            + '<g class="ov-lines">' + lines[0] + lines[1] + "".join(static) + "".join(hooks) + "".join(lines[2:]) + "</g>"
            + '<g class="ov-marks">' + "".join(icons) + "".join(static_marks) + "".join(marks) + lamp + "</g>"
            + '<g class="ov-words">' + "".join(words) + "</g>")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">'
            f'<title>这套系统的总图：左边一直在跑的自动任务越往中间越少，右边一句话散到几十个项目和技能</title>{body}</svg>\n')


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--bands", action="store_true", help="铺极淡的五列底色")
    ap.add_argument("--out", type=Path, default=HERE / "figures" / "overview.svg")
    a = ap.parse_args()
    a.out.write_text(build(a.bands), encoding="utf-8", newline="")
    print(a.out, {"reveal_ms": [reveal_at(x) for x in (X_P, X_A, X_C, X_N)]})
