"""真实定稿的插画标注、线型图例与数据图；不产生额外标签。"""
import math
import re
import json
from pathlib import Path

from ._shared import attr, images, inline, render_node, render_nodes, render_unit, units


def _incomplete(ctx, message, kind="composition"):
    if callable(getattr(ctx, "incomplete", None)):
        ctx.incomplete(message, kind)
    else:
        ctx.warn(message)


def _finite(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError, OverflowError):
        return None


def _ratio(value, default=1.5):
    result = _finite(value)
    return result if result is not None and result > 0 else default


def _columns(spec, ctx, default=1):
    value = spec.get("columns", default)
    if type(value) is not int or not 1 <= value <= 4:
        _incomplete(ctx, f"annotation/line_legend columns={value!r} 不支持；保留正常字号和原文")
        return default
    return value


def _connector(spec, ctx, default="solid"):
    value = spec.get("connector", default)
    if value not in ("arrow", "dashed", "solid", "none"):
        _incomplete(ctx, f"annotation connector={value!r} 不支持；未猜连线方式")
        return "none"
    return value


def _entry(entry, ctx):
    """绑定牌字时保留原前缀，前缀不混成新增标签。"""
    if "annotation_ref" not in entry:
        return render_unit(entry, ctx)
    prefix = entry.get("annotation_prefix", "")
    lead = f'<span class="dd-label-prefix tb" data-role="body">{inline(prefix, ctx)}</span>' if prefix else ""
    return lead + f'<div class="dg-body tb" data-role="body">{inline(entry["annotation_fragment"], ctx)}</div>'


def _binding_attrs(entry):
    return (f' data-label-ref="{attr(entry["annotation_ref"])}"' if "annotation_ref" in entry else "") + (
        f' data-target-id="{attr(entry["annotation_target"])}"' if "annotation_target" in entry else "")


def _bind_labels(entries, refs, ctx):
    """只沿源文明确边界拆牌字；拒绝缺字、重复、倒序和词内截断。"""
    if not isinstance(refs, list) or not refs or any(not isinstance(ref, str) or not ref for ref in refs) or len(set(refs)) != len(refs):
        _incomplete(ctx, "annotation labels 必须是互不重复的原文引用；保留全部原文")
        return entries, False
    result, found = [], []
    for entry in entries:
        source = entry.get("text", "") if entry.get("type") == "para" else ""
        local = [ref for ref in refs if ref in source]
        if not local:
            result.append(entry)
            continue
        if any(source.count(ref) != 1 for ref in local):
            _incomplete(ctx, "annotation labels 在原段不唯一；未重复输出标签")
            return entries, False
        local = sorted(local, key=source.index)
        positions = [source.index(ref) for ref in local]
        prefix = source[:positions[0]]
        if prefix and not (prefix[-1].isspace() or prefix[-1] in "：:"):
            _incomplete(ctx, "annotation labels 引用不是源文字段边界；保留原段")
            return entries, False
        for index, ref in enumerate(local):
            if index + 1 < len(local) and positions[index] + len(ref) > positions[index + 1]:
                _incomplete(ctx, "annotation labels 原文引用互相重叠；未重复输出")
                return entries, False
            tail = source[positions[index] + len(ref):positions[index + 1] if index + 1 < len(local) else len(source)]
            if tail.strip():
                _incomplete(ctx, "annotation labels 截断了原字段或遗漏文字；保留原段")
                return entries, False
            fragment = ref + tail
            result.append(dict(type="para", text=(prefix if index == 0 else "") + fragment,
                               annotation_ref=ref, annotation_fragment=fragment,
                               annotation_prefix=prefix if index == 0 else ""))
        found.extend(local)
    if found != refs:
        _incomplete(ctx, "annotation labels 缺少源绑定或不是原文顺序；保留全部原文")
        return entries, False
    return result, True


def _annotation_plan(nodes, spec, ctx):
    """构图描述转源绑定及可执行模式；语义图位没有坐标时仍明确未完成。"""
    spec = dict(spec)
    entries = units(nodes)
    layout = spec.get("items_layout", {})
    if not isinstance(layout, dict):
        _incomplete(ctx, "annotation items_layout 只支持字段对象")
        layout = {}
    for key in layout:
        if key not in {"labels", "media", "target", "placement", "lead_word", "keep_text_order"}:
            _incomplete(ctx, f"annotation items_layout.{key} 不支持")
    refs = spec.get("labels", layout.get("labels"))
    if "labels" in spec and "labels" in layout and spec["labels"] != layout["labels"]:
        _incomplete(ctx, "annotation 两份 labels 原文引用冲突；未替换源文")
    placement = spec.get("placement", layout.get("placement"))
    if placement is not None:
        spec["placement"] = placement
    if placement is not None and placement not in ("illustration_labels", "标签贴在上方插画各部位", "above", "below", "left", "right"):
        _incomplete(ctx, f"annotation placement={placement!r} 不支持")
    semantic = placement in ("illustration_labels", "标签贴在上方插画各部位") or bool(layout)
    if refs is None and placement == "illustration_labels":
        # 原牌字由全角空白明确分隔，不拿scene的物件名补标签。
        candidates = [entry for entry in entries if entry.get("type") == "para" and "　" in entry.get("text", "")]
        if len(candidates) == 1:
            refs = [word for word in re.split(r"　+", candidates[0]["text"]) if word]
        else:
            _incomplete(ctx, "annotation illustration_labels 缺少明确原文标签边界")
    if refs is not None:
        entries, bound = _bind_labels(entries, refs, ctx)
        spec["_labels_bound"] = bound
        semantic = True
    if "lead_word" in layout:
        request = layout["lead_word"]
        prefix = next((entry.get("annotation_prefix", "") for entry in entries if entry.get("annotation_prefix")), "")
        if not isinstance(request, str) or not prefix or not request.startswith(prefix):
            _incomplete(ctx, "annotation lead_word 不匹配原前缀；未从描述补文字")
        spec["_lead_word"] = prefix
    if "keep_text_order" in layout and layout["keep_text_order"] is not True:
        _incomplete(ctx, "annotation keep_text_order 仅支持 true；原文字仍保持源顺序")
    for key in ("media", "target"):
        if key in layout:
            value = layout[key]
            if not isinstance(value, str) or not value.strip():
                _incomplete(ctx, f"annotation items_layout.{key} 需要明确的语义引用")
            else:
                spec["_" + key + "_semantic"] = value
    if "targets" in spec:
        ids = spec["targets"]
        if not isinstance(ids, list) or len(ids) != len(entries) or any(not isinstance(key, str) or not key for key in ids) or len(set(ids)) != len(ids):
            _incomplete(ctx, "annotation targets 需要与原条目一一对应的唯一语义ID")
        else:
            entries = [dict(entry, annotation_target=key) for entry, key in zip(entries, ids)]
            anchors = spec.get("anchors")
            if isinstance(anchors, list):
                normalized = []
                for anchor in anchors:
                    point = dict(anchor) if isinstance(anchor, dict) else anchor
                    if isinstance(point, dict) and "unit" not in point and point.get("target") in ids:
                        point["unit"] = ids.index(point["target"])
                    normalized.append(point)
                spec["anchors"] = normalized
        # 语义ID描述的是既有图的部位；不能因此再建一个媒体槽。
        spec["labels_position"] = "external"
        if not spec.get("target_selector") and len(ctx.screen.get("screenshots", []) or []) == 1:
            spec["target_selector"] = '.slot-shot-item[data-shot-index="0"] .slot-shot-frame, [data-hot="screenshot"][data-href="0"]'
    elif semantic and not spec.get("labels_position"):
        spec["labels_position"] = "overlay"
    if placement == "above":
        spec["labels_position"] = "above"
    elif placement == "below":
        spec["labels_position"] = "below"
    elif placement in ("left", "right"):
        spec["media_side"] = "right" if placement == "left" else "left"
    if semantic:
        spec["_semantic_binding"] = True
        if spec.get("_media_semantic") and not spec.get("asset") and not spec.get("target_selector"):
            _incomplete(ctx, f"annotation media={spec['_media_semantic']!r} 尚无明确素材/目标绑定；未拿任意插画代替")
        if spec.get("_target_semantic") and not spec.get("target_selector"):
            _incomplete(ctx, f"annotation target={spec['_target_semantic']!r} 尚无明确既有目标选择器")
    return entries, spec


_ARROW_MARKER = (
    'function makeArrow(){if(connector!=="arrow")return null;'
    'const id="dd-arrow-"+(window.__ddArrowSerial=(window.__ddArrowSerial||0)+1);'
    'const defs=document.createElementNS(NS,"defs"),marker=document.createElementNS(NS,"marker");'
    'for(const [k,v] of Object.entries({id,viewBox:"0 0 8 8",refX:7,refY:4,markerWidth:8,markerHeight:8,orient:"auto",markerUnits:"strokeWidth"}))marker.setAttribute(k,v);'
    'const tip=document.createElementNS(NS,"path");tip.setAttribute("class","dd-arrow-head");tip.setAttribute("d","M 0 0 L 8 4 L 0 8 Z");'
    'marker.append(tip);defs.append(marker);svg.append(defs);return id;}'
)


def _plan_attrs(spec):
    attrs = []
    for field, attribute in (("_media_semantic", "media-semantic"), ("_target_semantic", "target-semantic"),
                             ("placement", "placement"), ("_lead_word", "lead-word")):
        if spec.get(field) is not None:
            attrs.append(f' data-{attribute}="{attr(spec[field])}"')
    if "columns" in spec:
        attrs.append(f' data-columns="{attr(spec["columns"])}"')
    if "connector" in spec:
        attrs.append(f' data-connector="{attr(spec["connector"])}"')
    return "".join(attrs)


def _render_overlay(entries, spec, ctx):
    selector = spec.get("target_selector")
    columns = _columns(spec, ctx)
    targets = []
    anchors = spec.get("anchors", [])
    if not isinstance(anchors, list):
        _incomplete(ctx, "annotation overlay anchors 只支持明确坐标数组")
        anchors = []
    for anchor in anchors:
        try:
            index = int(anchor["unit"])
            x, y = _finite(anchor["x"]), _finite(anchor["y"])
            width = _finite(anchor.get("width", .45))
            if not 0 <= index < len(entries) or x is None or y is None or width is None or not 0 <= x <= 1 or not 0 <= y <= 1 or not .05 <= width <= 1:
                raise ValueError()
            targets.append(dict(unit=index, x=x, y=y, width=width))
        except (KeyError, TypeError, ValueError):
            _incomplete(ctx, "annotation overlay 锚点无效；保留原文，不猜位置")
    valid = isinstance(selector, str) and bool(selector) and len(targets) == len(entries) and {a["unit"] for a in targets} == set(range(len(entries)))
    role = " dd-overlay-name" if spec.get("label_role") == "name" else ""
    parts = [f'<div class="c-diagram dd-overlay-host{role}" data-comp="annotation" style="--dd-label-cols:{columns}"{_plan_attrs(spec)}>']
    for i, entry in enumerate(entries):
        label = _entry(entry, ctx)
        if spec.get("label_role") == "name":
            label = label.replace('data-role="body"', 'data-role="name"')
        parts.append(f'<div class="dd-overlay-label" data-unit="{i}"{_binding_attrs(entry)}>{label}</div>')
    if not valid:
        _incomplete(ctx, "annotation overlay 需要明确既有素材 target_selector 和全部原文标签 anchors；当前仅保留原文")
        parts[0] = parts[0].replace('data-comp="annotation"', 'data-comp="annotation" data-overlay-error="target-or-coordinates-missing"')
    else:
        # 文字保留原DOM顺序；只按实际媒体外框改视觉位置，不重画或复制插画。
        config = json.dumps(dict(selector=selector, anchors=targets), ensure_ascii=False).replace("<", "\\u003c")
        parts.append('<script>(()=>{const root=document.currentScript.parentElement;'
                     f'const c={config};'
                     'function reset(error){root.dataset.overlayError=error;root.classList.remove("dd-overlay-ready");'
                     'root.querySelectorAll(".dd-overlay-label").forEach(label=>{'
                     'label.style.removeProperty("left");label.style.removeProperty("top");label.style.removeProperty("max-width")});}'
                     'function draw(){let target;try{target=document.querySelector(c.selector)}catch(e){}'
                     'if(!target){reset("target-missing");return}'
                     'const m=target.getBoundingClientRect();if(!m.width||!m.height){reset("target-empty");return}'
                     'root.classList.add("dd-overlay-ready");delete root.dataset.overlayError;'
                     'const r=root.getBoundingClientRect();for(const a of c.anchors){'
                     'const label=root.querySelector(`[data-unit="${a.unit}"]`);'
                     'label.style.maxWidth=`${m.width*a.width}px`;'
                     'const b=label.getBoundingClientRect();'
                     'label.style.left=`${m.left-r.left+m.width*a.x-b.width/2}px`;'
                     'label.style.top=`${m.top-r.top+m.height*a.y-b.height/2}px`;}}'
                     'const page=document.querySelector("#page")||root;new ResizeObserver(draw).observe(page);'
                     'document.querySelectorAll("img").forEach(i=>i.addEventListener("load",draw));'
                     'window.addEventListener("resize",draw);if(document.fonts)document.fonts.ready.then(draw);draw();})();</script>')
        ctx.warn("annotation overlay 新样式统一放进最后验收页；按明确目标与归一坐标叠字")
    parts.append('</div>')
    return "".join(parts)


def _render_external(entries, spec, ctx):
    """说明保持正常流；仅无字引线覆盖到同屏既有目标。"""
    columns = _columns(spec, ctx)
    connector = _connector(spec, ctx, spec.get("leader_style", "dashed"))
    parts = [f'<div class="c-diagram dd-external-host" data-comp="annotation" style="--dd-label-cols:{columns}"{_plan_attrs(spec)}>']
    missing_numbers = []
    for index, entry in enumerate(entries):
        if entry.get("type") == "item" and entry.get("n") is not None:
            remaining = dict(entry)
            number = remaining.pop("n")
            content = (f'<span class="dg-number dd-external-number tb" data-role="step_number">{inline(number, ctx)}</span>'
                       f'<div class="dd-external-text">{_entry(remaining, ctx)}</div>')
        else:
            missing_numbers.append(index)
            content = f'<div class="dd-external-text">{_entry(entry, ctx)}</div>'
        fallback = ' data-source-fallback="label-edge"' if index in missing_numbers else ""
        parts.append(f'<div class="dd-external-row" data-unit="{index}"{fallback}{_binding_attrs(entry)}>{content}</div>')
    if missing_numbers:
        _incomplete(ctx, "annotation external 缺少原编号节点；引线退到原说明外框边缘，不造编号")
        parts[0] = parts[0].replace('data-comp="annotation"', 'data-comp="annotation" data-overlay-error="source-number-missing"')
    # 竖版原约定只留编号；不生成SVG、目标或监听器，也不因无横版坐标报缺口。
    if (ctx.orient == "v" and not spec.get("leaders_v", False)) or connector == "none":
        return "".join(parts) + '</div>'
    targets, error = [], ""
    anchors = spec.get("anchors")
    if isinstance(anchors, list):
        for anchor in anchors:
            try:
                index = anchor["unit"]
                x, y = _finite(anchor["x"]), _finite(anchor["y"])
                if (type(index) is not int or not 0 <= index < len(entries)
                        or x is None or y is None or not 0 <= x <= 1 or not 0 <= y <= 1):
                    raise ValueError()
                targets.append(dict(unit=index, x=x, y=y,
                                    targetId=entries[index].get("annotation_target", ""),
                                    dashed=anchor.get("style", "dashed" if connector == "dashed" else spec.get("leader_style", "solid")) == "dashed"))
            except (KeyError, TypeError, ValueError):
                error = "anchors-invalid"
    else:
        error = "anchors-incomplete"
    if (not entries or len(targets) != len(entries)
            or {a["unit"] for a in targets} != set(range(len(entries)))):
        error = error or "anchors-incomplete"
    selector = spec.get("target_selector")
    if not isinstance(selector, str) or not selector.strip():
        error = "target-selector-missing"
    if error:
        _incomplete(ctx, f"annotation external {error}；保留原文，不猜既有目标或部位")
        parts[0] = re.sub(r' data-overlay-error="[^"]*"', '', parts[0])
        parts[0] = parts[0].replace('data-comp="annotation"', f'data-comp="annotation" data-overlay-error="{error}"')
        return "".join(parts) + '</div>'
    parts.append('<svg class="dd-external-lines" aria-hidden="true"></svg>')
    config = json.dumps(dict(selector=selector, anchors=targets), ensure_ascii=False).replace("<", "\\u003c")
    parts.append('<script>(()=>{const root=document.currentScript.parentElement;'
                 f'const c={config};'
                 'const svg=root.querySelector(".dd-external-lines");'
                 'const scope=root.closest("[data-screen-id],[data-screen],#page")||root.parentElement||root;'
                 'const NS="http://www.w3.org/2000/svg";let target=null,closed=false;'
                 f'const connector={json.dumps(connector)};'
                 + _ARROW_MARKER +
                 'function reset(error){svg.replaceChildren();root.classList.remove("dd-external-ready");'
                 'root.dataset.overlayError=error;delete root.dataset.overlayFallback;}'
                 'function close(){if(closed)return;closed=true;observer.disconnect();changes.disconnect();'
                 'window.removeEventListener("resize",draw);scope.removeEventListener("load",draw,true);'
                 'if(document.fonts?.removeEventListener)document.fonts.removeEventListener("loadingdone",draw);'
                 'svg.replaceChildren();}'
                 'function draw(){if(closed)return;if(!root.isConnected){close();return;}let found;'
                 'try{found=[...new Set(scope.querySelectorAll(c.selector))]}catch(e){reset("selector-invalid");return;}'
                 'if(found.length!==1){reset(found.length?"target-ambiguous":"target-missing");return;}'
                 'if(target!==found[0]){if(target)observer.unobserve(target);target=found[0];observer.observe(target);}'
                 'const m=target.getBoundingClientRect(),r=root.getBoundingClientRect();'
                 'if(![m.left,m.top,m.width,m.height,r.left,r.top,r.width,r.height].every(Number.isFinite)'
                 '||m.width<=0||m.height<=0||r.width<=0||r.height<=0){reset("target-empty");return;}'
                 'svg.replaceChildren();svg.setAttribute("viewBox",`0 0 ${r.width} ${r.height}`);const arrowId=makeArrow();'
                 'const fallback=[];let sourceError="";for(const a of c.anchors){'
                 'const label=root.querySelector(`[data-unit="${a.unit}"]`);'
                 'if(!label){sourceError="source-label-missing";break;}'
                 'const point=label.querySelector(".dd-external-number[data-role=step_number]");'
                 'const b=(point||label).getBoundingClientRect();'
                 'if(![b.left,b.top,b.width,b.height].every(Number.isFinite)||b.width<=0||b.height<=0)'
                 '{sourceError="source-empty";break;}'
                 'const tx=m.left+m.width*a.x-r.left,ty=m.top+m.height*a.y-r.top;'
                 'let sx=b.left+b.width/2-r.left,sy=b.top+b.height/2-r.top;'
                 'if(!point){sx=(m.left+m.width/2<b.left+b.width/2?b.left:b.left+b.width)-r.left;fallback.push(a.unit);}'
                 'const path=document.createElementNS(NS,"path");'
                 'path.setAttribute("class","dd-leader"+(a.dashed?" dd-dashed":""));'
                 'if(arrowId)path.setAttribute("marker-end","url(#"+arrowId+")");'
                 'if(a.targetId)path.setAttribute("data-target-id",a.targetId);'
                 'path.setAttribute("data-unit",a.unit);path.setAttribute("data-source-port",point?"number-center":"label-edge");'
                 'path.setAttribute("d",`M ${sx} ${sy} L ${tx} ${ty}`);svg.append(path);}'
                 'if(sourceError){reset(sourceError);return;}root.classList.add("dd-external-ready");'
                 'if(fallback.length){root.dataset.overlayError="source-number-missing";root.dataset.overlayFallback=fallback.join(",");}'
                 'else{delete root.dataset.overlayError;delete root.dataset.overlayFallback;}}'
                 'const observer=new ResizeObserver(draw);observer.observe(scope);observer.observe(root);'
                 'const changes=new MutationObserver(records=>{if(records.some(m=>'
                 '!m.target.closest?.("svg")&&'
                 '!(m.type==="attributes"&&m.target.classList?.contains("dd-external-host"))))draw();});'
                 'changes.observe(scope,{childList:true,subtree:true,attributes:true,attributeFilter:["class","style","src","data-hot","data-href","data-shot-index"]});'
                 'scope.addEventListener("load",draw,true);window.addEventListener("resize",draw);'
                 'if(document.fonts){document.fonts.ready.then(draw);document.fonts.addEventListener?.("loadingdone",draw);}'
                 'draw();})();</script>')
    parts.append('</div>')
    return "".join(parts)


_ANNOTATION_LEADERS_JS = r"""
function draw(){
  const box=root.getBoundingClientRect(),media=root.querySelector('.dd-image,.dd-shot');
  if(!media||!box.width)return;
  const m=media.getBoundingClientRect();
  svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  svg.replaceChildren();const arrowId=makeArrow();
  const ports=anchors.map(a=>{
    const label=root.querySelector(`[data-unit="${a.unit}"]`);if(!label)return null;
    const l=label.getBoundingClientRect(),right=m.left>l.left;
    return {a,x:m.left-box.left+a.x*m.width,y:m.top-box.top+a.y*m.height,
      ex:(above?l.left+l.width/2:(right?l.right+8:l.left-8))-box.left,
      ey:(above?l.bottom:l.top+l.height/2)-box.top,
      near:above?l.bottom-box.top:(right?l.right:l.left)-box.left,
      far:above?m.top-box.top:(right?m.left:m.right)-box.left};
  }).filter(Boolean);
  const compact=points=>points.filter((p,i)=>!i||p.x!==points[i-1].x||p.y!==points[i-1].y);
  const segments=points=>points.slice(1).map((b,i)=>({a:points[i],b}));
  const intersects=(s,t)=>{
    const sx=Math.min(s.a.x,s.b.x),ex=Math.max(s.a.x,s.b.x),sy=Math.min(s.a.y,s.b.y),ey=Math.max(s.a.y,s.b.y);
    const tx=Math.min(t.a.x,t.b.x),ux=Math.max(t.a.x,t.b.x),ty=Math.min(t.a.y,t.b.y),uy=Math.max(t.a.y,t.b.y);
    return Math.min(ex,ux)>=Math.max(sx,tx)-.01&&Math.min(ey,uy)>=Math.max(sy,ty)-.01;
  };
  // 先保留安全的原路线；冲突时试两种分轨及从实际锚点直角出线。
  const route=(p,index,mode)=>{
    const start={x:p.x,y:p.y},end={x:p.ex,y:p.ey};
    if(mode===3)return compact([start,above?{x:p.ex,y:p.y}:{x:p.x,y:p.ey},end]);
    if(mode===4)return compact([start,above?{x:p.x,y:p.ey}:{x:p.ex,y:p.y},end]);
    const fraction=mode===0?.5:(mode===1?index+1:ports.length-index)/(ports.length+1);
    const rail=p.far+(p.near-p.far)*fraction;
    return compact(above?[start,{x:p.x,y:rail},{x:p.ex,y:rail},end]
      :[start,{x:rail,y:p.y},{x:rail,y:p.ey},end]);
  };
  let lines=null;
  for(let mode=0;mode<5;mode++){
    const trial=ports.map((p,index)=>route(p,index,mode));
    let clear=true;
    for(let i=0;i<trial.length&&clear;i++)for(let j=i+1;j<trial.length;j++)
      if(segments(trial[i]).some(s=>segments(trial[j]).some(t=>intersects(s,t)))){clear=false;break;}
    if(clear){lines=trial;break;}
  }
  if(!lines){lines=ports.map((p,index)=>route(p,index,0));root.dataset.overlayError='annotation-routes-cross';}
  else if(root.dataset.overlayError==='annotation-routes-cross')delete root.dataset.overlayError;
  for(let i=0;i<ports.length;i++){
    const p=ports[i],path=document.createElementNS(NS,'path');
    path.setAttribute('class','dd-leader'+(p.a.dashed?' dd-dashed':''));
    path.setAttribute('data-unit',p.a.unit);
    if(arrowId)path.setAttribute('marker-end','url(#'+arrowId+')');
    path.setAttribute('d',lines[i].map((point,index)=>`${index?'L':'M'} ${point.x} ${point.y}`).join(' '));
    svg.append(path);const dot=document.createElementNS(NS,'circle');
    dot.setAttribute('class','dd-anchor');dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);dot.setAttribute('r',3);svg.append(dot);
  }
}
new ResizeObserver(draw).observe(root);
root.querySelectorAll('img').forEach(img=>img.addEventListener('load',draw));
if(document.fonts)document.fonts.ready.then(draw);draw();
"""


def _screenshot_preview(ctx, index):
    """仅填入定稿截图槽明确绑定且存在的本机文件，热区仍由原接口输出。"""
    screen = getattr(ctx, "screen", {})
    shots = screen.get("screenshots", []) if isinstance(screen, dict) else []
    file = shots[index].get("file") if type(index) is int and 0 <= index < len(shots) and isinstance(shots[index], dict) else None
    if not isinstance(file, str) or not Path(file).is_file():
        _incomplete(ctx, f"annotation 截图 {index} 缺少存在的明确文件，保留原截图热区", "asset")
        return ""
    url = ctx.asset_url(file) if callable(getattr(ctx, "asset_url", None)) else Path(file).resolve().as_uri()
    return f'<img class="dd-shot-preview" src="{attr(url)}" alt="">'


def render_annotation(block, ctx):
    entries, spec = _annotation_plan(block.get("nodes", []), block.get("spec", {}), ctx)
    connector = _connector(spec, ctx, spec.get("leader_style", "solid"))
    if spec.get("labels_position") == "external":
        return _render_external(entries, spec, ctx)
    columns = _columns(spec, ctx)
    if spec.get("labels_position") not in (None, "above", "below", "overlay", "external"):
        _incomplete(ctx, f"annotation labels_position={spec['labels_position']!r} 不支持")
    if spec.get("labels_position") == "overlay" and connector not in ("none", "solid") and spec.get("anchors"):
        _incomplete(ctx, "annotation overlay 连线还需区别标签位置与目标落点，未把叠字坐标当箭头几何")
    if spec.get("labels_position") == "overlay" or spec.get("target_selector"):
        return _render_overlay(entries, spec, ctx)
    labels_above = ctx.orient == "h" and spec.get("labels_position") == "above"
    screenshot = spec.get("screenshot")
    media = ""
    if screenshot is not None:
        media = (f'<div class="dd-shot" {ctx.hot("screenshot", screenshot)} '
                 f'style="aspect-ratio:{_ratio(spec.get("aspect_ratio")):g}">{_screenshot_preview(ctx, screenshot)}</div>')
    else:
        choice = dict(spec)
        if spec.get("asset"):
            choice["illustrations"] = [spec["asset"]]
        assets = images(ctx, choice, "illustrations")
        if assets:
            media = f'<img class="dd-image" src="{attr(assets[0])}" alt="">'
        else:
            _incomplete(ctx, "annotation 缺少插画素材或截图序号；保留全部标注文字", "asset")
    leaders = bool(connector != "none" and media and spec.get("anchors") and
                   (ctx.orient == "h" or spec.get("leaders_v", False)))
    targets = []
    if leaders:
        for anchor in spec["anchors"]:
            try:
                index = int(anchor["unit"])
                x, y = _finite(anchor["x"]), _finite(anchor["y"])
                if (index < 0 or index >= len(entries) or x is None or y is None
                        or not 0 <= x <= 1 or not 0 <= y <= 1):
                    raise ValueError()
                targets.append({"unit": index, "x": x, "y": y,
                                "dashed": anchor.get("style", "dashed" if connector == "dashed" else spec.get("leader_style")) == "dashed"})
            except (KeyError, TypeError, ValueError):
                _incomplete(ctx, "annotation 锚点无效；该引线未绘制")
    if connector != "none" and media and not spec.get("anchors") and ctx.orient == "h":
        _incomplete(ctx, "annotation 未提供实际部位锚点；未猜测引线落点")
    mode = " dd-connected" if targets else ""
    if not media:
        mode += " dd-no-media"
    if spec.get("media_side") == "right":
        mode += " dd-media-right"
    if labels_above:
        mode += " dd-labels-above"
    stack = "columns" in spec or spec.get("labels_position") == "below"
    if stack:
        mode += " dd-annotation-columns"
    if spec.get("labels_position") == "below":
        mode += " dd-labels-below"
    media_width = _finite(spec.get("media_width", 58))
    media_width = media_width if media_width is not None and 10 <= media_width <= 80 else 58
    media_width_v = _finite(spec.get("media_width_v", 100))
    media_width_v = media_width_v if media_width_v is not None and 10 <= media_width_v <= 100 else 100
    parts = [f'<div class="c-diagram dd-annotation{mode}" data-comp="annotation"{_plan_attrs(spec)}>']
    parts.append(f'<div class="dd-annotation-grid" style="--dd-label-cols:{columns};--dd-rows:{max(1, len(entries))};--dd-media-fr:{media_width:g}fr;--dd-text-fr:{96 - media_width:g}fr;--dd-media-v:{media_width_v:g}%">')
    if media:
        parts.append(f'<div class="dd-media">{media}</div>')
    if stack:
        parts.append('<div class="dd-label-stack">')
    for i, entry in enumerate(entries):
        card = " card" if labels_above else ""
        parts.append(f'<div class="dd-callout{card}" data-unit="{i}"{_binding_attrs(entry)}>{_entry(entry, ctx)}</div>')
    if stack:
        parts.append('</div>')
    if targets:
        parts.append('<svg class="dd-leaders" aria-hidden="true"></svg>')
        # 用实际媒体和文字外框连接。图片、字体加载或文字换行后仍指向同一部位。
        # 此脚本只创建无字图形；不会把脚本字符串作为页面文字显示。
        parts.append('<script>(()=>{const root=document.currentScript.parentElement;'
                     'const svg=root.querySelector(".dd-leaders");'
                     f'const anchors={json.dumps(targets, separators=(",", ":"))};'
                     f'const above={str(labels_above).lower()};'
                     'const NS="http://www.w3.org/2000/svg";'
                     f'const connector={json.dumps(connector)};'
                     + _ARROW_MARKER +
                     _ANNOTATION_LEADERS_JS + '})();</script>')
    parts.append('</div></div>')
    return "".join(parts)


def render_line_legend(block, ctx):
    spec = block.get("spec", {})
    if spec.get("layout", "rows") not in ("rows", "grid"):
        _incomplete(ctx, f"line_legend layout={spec['layout']!r} 不支持")
    columns = _columns(spec, ctx, 2 if spec.get("layout") == "grid" else 1)
    layout = " dd-legend-grid" if spec.get("layout") == "grid" else ""
    if "columns" in spec:
        layout += " dd-legend-columns"
    parts = [f'<div class="c-diagram dd-legend card{layout}" data-comp="line_legend" style="--dd-legend-cols:{columns}">']
    for unit in units(block.get("nodes", [])):
        source = str(unit.get("lead", unit.get("name", unit.get("text", ""))) or "")
        style = next((kind for name, kind in (("实线", "solid"), ("虚线", "dashed"),
                                              ("点线", "dotted"), ("双线", "double"))
                      if source.startswith(name)), None)
        if style is None:
            parts.append(f'<div class="dd-legend-extra">{render_unit(unit, ctx)}</div>')
        else:
            parts.append(f'<div class="dd-legend-row"><span class="dd-sample dd-{style}" aria-hidden="true"></span>'
                         f'<div class="dd-legend-text">{render_unit(unit, ctx)}</div></div>')
    parts.append('</div>')
    return "".join(parts)


_NUMBER = r"[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?"
_END = re.compile(r"^(.*?)(\*\*)?(" + _NUMBER + r")(\*\*)?\s*(%|GiB|GB|TB|次|份|个|秒)?(?:\s*(?:（[^（）]*）|\([^()]*\)))?\s*$")
_WHOLE = re.compile(r"^\s*\*{0,2}(" + _NUMBER + r")\*{0,2}\s*(%|GiB|GB|TB|次|份|个|秒)?\s*$")


def _number(text):
    match = _WHOLE.fullmatch(str(text or ""))
    return _finite(match.group(1).replace(",", "")) if match else None


def _points(node):
    """只识别成组的标签/数值，不把正文里的日期、范围、编号当测量值。"""
    kind = node.get("type")
    if kind == "para":
        text = node.get("text", "")
        segments = re.split(r"(\s*·\s*)", text)
        if len(segments) < 3:
            return None
        prefix = ""
        first = segments[0]
        if "：" in first:
            prefix, segments[0] = first.split("：", 1)
            prefix += "："
        points = []
        for i in range(0, len(segments), 2):
            match = _END.fullmatch(segments[i])
            if not match or not match.group(1).strip() or re.search(r"[–~～]", match.group(1)[-2:]):
                return None
            value = _finite(match.group(3).replace(",", ""))
            if value is None:
                return None
            points.append({"value": value, "label": match.group(1),
                           "number": segments[i][len(match.group(1)):],
                           "separator": segments[i + 1] if i + 1 < len(segments) else ""})
        return {"prefix": prefix, "points": points}
    if kind == "table":
        rows = node.get("rows", [])
        if not rows or any(len(row) != 2 or _number(row[1]) is None for row in rows):
            return None
        return {"header": node.get("header"), "points": [
            {"value": _number(row[1]), "label": row[0], "number": row[1], "separator": ""}
            for row in rows]}
    if kind == "stats":
        entries = node.get("items", [])
        if not entries or any(_number(item.get("num")) is None for item in entries):
            return None
        # 数字先于说明：仍按原顺序渲染，CSS 只改变它们的视觉位置。
        return {"points": [{"value": _number(item["num"]), "number": item["num"],
                             "label": item.get("text", ""), "number_first": True,
                             "separator": ""} for item in entries]}
    return None


def _segment_points(node, config):
    """明确原文边界和真实权重才形成分段条，不自动把正文各类数字当权重。"""
    if node.get("type") not in ("para", "card") or not isinstance(config, list) or len(config) < 2:
        return None
    text = (str(node.get("name", "")) + str(node.get("text", ""))) if node.get("type") == "card" else str(node.get("text", ""))
    positions = []
    for item in config:
        if not isinstance(item, dict) or not isinstance(item.get("ref"), str) or not item["ref"]:
            return None
        if text.count(item["ref"]) != 1:
            return None
        pos = text.find(item["ref"])
        if positions and pos <= positions[-1]:
            return None
        positions.append(pos)
    points = []
    for index, item in enumerate(config):
        fragment = text[positions[index]:positions[index + 1] if index + 1 < len(positions) else len(text)]
        sep = re.search(r"[｜·]\s*$", fragment)
        separator = fragment[sep.start():] if sep and fragment[sep.start()] != "｜" else ""
        if sep:
            fragment = fragment[:sep.start()]
        number = re.search(_NUMBER, fragment)
        if not number:
            return None
        value = _finite(number.group().replace(",", ""))
        if value is None or _finite(item.get("value")) != value:
            return None
        if fragment[number.end():].lstrip().startswith(("–", "～", "~")):
            return None
        points.append({"value": value, "label": fragment[:number.start()],
                       "number": fragment[number.start():], "separator": separator})
    return {"prefix": text[:positions[0]], "points": points}


def _stacked_points(node):
    found = _points(node)
    if found:
        return found
    if node.get("type") == "bullets":
        entries = [((str(p["lead"]) + " ") if p.get("lead") else "") + str(p.get("text", "")) for p in node.get("items", [])]
        if len(entries) < 2:
            return None
        points = []
        for text in entries:
            match = re.match(r"^\s*(" + _NUMBER + r")(?=\s|[个份条次张项]|$)", text)
            if not match or text[match.end():].lstrip().startswith(("月", "日", "年", "–", "~", "～")):
                return None
            value = _finite(match.group(1).replace(",", ""))
            if value is None:
                return None
            points.append(dict(value=value, number=text[:match.end()],
                               label=text[match.end():], number_first=True, separator=""))
        return {"points": points}
    if node.get("type") == "para":
        entries = re.split(r"[　]+|\s{2,}", node.get("text", ""))
        if len(entries) < 2:
            return None
        points = []
        for text in entries:
            match = re.match(r"^\s*(" + _NUMBER + r")(?=\s|[个份条次张项]|$)", text)
            if not match or not re.match(r"\s*(?:个|份|条|次)?\s*·", text[match.end():]):
                return None
            value = _finite(match.group(1).replace(",", ""))
            if value is None:
                return None
            points.append(dict(value=value, number=text[:match.end()],
                               label=text[match.end():], number_first=True, separator=""))
        return {"points": points}
    return None


def _labels(point, ctx, flow=False, leading="", trailing=""):
    measured = "" if flow else " tb"
    number_first = point.get("number_first")
    label_text = ("" if number_first else leading) + point["label"] + (trailing if number_first else "")
    number_text = (leading if number_first else "") + point["number"] + ("" if number_first else trailing)
    label = f'<span class="dd-chart-label{measured}" data-role="body">{inline(label_text, ctx)}</span>'
    # 原括注是正文，不能随数字整段继承粗体/强调色；仍位于原数字后的原DOM次序。
    note_at = re.search(r"[（(]", number_text)
    if note_at:
        head, note = number_text[:note_at.start()], number_text[note_at.start():]
        number_body = inline(head, ctx) + f'<span class="dd-chart-note" data-role="body">{inline(note, ctx)}</span>'
    else:
        number_body = inline(number_text, ctx)
    number = f'<span class="dd-chart-number{measured}" data-role="chart_number">{number_body}</span>'
    return number + label if point.get("number_first") else label + number


def _shape(kind, points):
    """SVG 只含几何图形；没有刻度或标签文字。"""
    maximum = max(point["value"] for point in points)
    if kind == "line":
        coords = [(30 + i * 940 / max(1, len(points) - 1), 270 - point["value"] / maximum * 240)
                  for i, point in enumerate(points)]
        path = " ".join(("M" if i == 0 else "L") + f" {x:g} {y:g}" for i, (x, y) in enumerate(coords))
        shapes = f'<path class="dd-line-path" d="{path}"/>' + "".join(
            f'<circle class="dd-line-dot" cx="{x:g}" cy="{y:g}" r="7"/>' for x, y in coords)
        return '<svg class="dd-line-chart" viewBox="0 0 1000 300" aria-hidden="true">' + shapes + '</svg>'
    total = sum(point["value"] for point in points)
    cursor, arcs = 0, []
    circumference = 2 * math.pi * 95
    for point in points:
        length = point["value"] / total * circumference
        arcs.append(f'<circle class="dd-donut-arc" cx="150" cy="150" r="95" '
                    f'stroke-dasharray="{length:g} {circumference - length:g}" '
                    f'stroke-dashoffset="{-cursor:g}"/>')
        cursor += length
    return '<svg class="dd-donut-chart" viewBox="0 0 300 300" aria-hidden="true">' + "".join(arcs) + '</svg>'


def render_chart(block, ctx):
    spec, nodes = block.get("spec", {}), block.get("nodes", [])
    kind = spec.get("chart_type", spec.get("kind", spec.get("variant", "bar")))
    for alias in ("kind", "variant"):
        if alias in spec and spec[alias] not in (None, "none", "auto", kind):
            _incomplete(ctx, f"chart {alias} 与 chart_type 不一致；采用明确 chart_type")
    if kind not in ("bar", "column", "line", "donut", "segmented", "stacked"):
        _incomplete(ctx, f"chart 不支持图型 {kind}；保留定稿文字")
        return '<div class="c-diagram dd-chart card" data-comp="chart">' + render_nodes(nodes, ctx) + '</div>'
    if kind == "segmented":
        index = spec.get("segments_node", 0)
        found = _segment_points(nodes[index], spec.get("segments")) if isinstance(index, int) and 0 <= index < len(nodes) else None
        groups = {index: found} if found else {}
        if not found:
            _incomplete(ctx, "chart segmented 缺少按原文顺序匹配且数值一致的 segments；保留原文")
    else:
        point_reader = _stacked_points if kind == "stacked" or spec.get("number_first") else _points
        groups = {i: found for i, node in enumerate(nodes) if (found := point_reader(node))}
    selected = {(i, j) for i, group in groups.items() for j, _ in enumerate(group["points"])}
    data = spec.get("data")
    valid = True
    if data is not None:
        selected = set()
        try:
            if not isinstance(data, list) or not data:
                raise ValueError()
            for item in data:
                index, point = item["node"], item.get("item", 0)
                if not isinstance(index, int) or not isinstance(point, int) or index < 0 or point < 0:
                    raise ValueError()
                source = groups[index]["points"][point]["value"]
                if "value" in item and _finite(item["value"]) != source:
                    raise ValueError()
                if (index, point) in selected:
                    raise ValueError()
                selected.add((index, point))
        except (KeyError, IndexError, TypeError, ValueError):
            valid = False
            _incomplete(ctx, "chart 的 data 与定稿节点数值不一致；保留定稿文字")
    ordered = [point for i, group in groups.items() for j, point in enumerate(group["points"])
               if (i, j) in selected]
    if not valid or not ordered or any(point["value"] < 0 for point in ordered) or not max((p["value"] for p in ordered), default=0):
        if valid:
            _incomplete(ctx, "chart 没有可绘制的真实非负数据序列；保留定稿文字")
        return '<div class="c-diagram dd-chart card" data-comp="chart">' + render_nodes(nodes, ctx) + '</div>'
    is_segmented = kind in ("segmented", "stacked")
    if is_segmented and len(ordered) != sum(len(group["points"]) for group in groups.values()):
        _incomplete(ctx, "chart 分段条必须保留整组原文分段；选择部分数据时退回原文")
        return '<div class="c-diagram dd-chart card" data-comp="chart">' + render_nodes(nodes, ctx) + '</div>'
    maximum = max(point["value"] for point in ordered)
    total = sum(point["value"] for point in ordered)
    center = spec.get("center_node") if kind == "donut" else None
    if center is not None and (center != 0 or not nodes or nodes[0].get("type") != "para" or _number(nodes[0].get("text")) is None or not math.isclose(_number(nodes[0]["text"]), total)):
        _incomplete(ctx, "chart center_node 需指向首段原总数且等于真实分段之和；保留原文")
        return '<div class="c-diagram dd-chart card" data-comp="chart">' + render_nodes(nodes, ctx) + '</div>'
    mode = " dd-chart-segmented" if kind == "stacked" else ""
    labels_layout = spec.get("labels_layout", "rows" if kind in ("stacked", "donut") else "segments")
    if labels_layout not in ("rows", "segments"):
        _incomplete(ctx, f"chart labels_layout={labels_layout!r} 不支持；保留默认布局和原字")
        labels_layout = "rows" if kind in ("stacked", "donut") else "segments"
    if kind == "donut" and labels_layout != "rows":
        _incomplete(ctx, "chart donut labels_layout 只支持 rows；保持原字的紧凑下方图例")
        labels_layout = "rows"
    row_flow = (is_segmented and (labels_layout == "rows" or ctx.orient == "v")) or kind == "donut"
    if row_flow:
        mode += " dd-legend-rows"
    parts = [f'<div class="c-diagram dd-chart dd-chart-{kind}{mode} card" data-comp="chart">']
    if kind in ("line", "donut"):
        shape = _shape(kind, ordered)
        if center is not None:
            shape = '<div class="dd-donut-figure">' + shape + f'<div class="dd-chart-total tb" data-role="diagram_total">{inline(nodes[0]["text"], ctx)}</div></div>'
        parts.append(shape)
    for i, node in enumerate(nodes):
        if center is not None and i == center:
            continue
        group = groups.get(i)
        if not group or not any((i, j) in selected for j in range(len(group["points"]))):
            parts.append(render_node(node, ctx))
            continue
        if is_segmented and not sum(point["value"] for point in group["points"]):
            _incomplete(ctx, "chart 一组分段全为零，没有可画的比例；该组保留原文")
            parts.append(render_node(node, ctx))
            continue
        if group.get("prefix"):
            parts.append(f'<div class="dd-chart-prefix tb" data-role="name">{inline(group["prefix"], ctx)}</div>')
        if group.get("header"):
            parts.append('<div class="dd-chart-header">' + "".join(
                f'<span class="tb" data-role="name">{inline(cell, ctx)}</span>' for cell in group["header"]) + '</div>')
        weights = ";--dd-segments:" + " ".join(f'{point["value"]:g}fr' for point in group["points"]) if is_segmented else ""
        parts.append(f'<div class="dd-points" style="--dd-count:{len(group["points"])}{weights}">')
        for j, point in enumerate(group["points"]):
            denominator = sum(p["value"] for p in group["points"]) if is_segmented else maximum
            share = point["value"] / denominator * 100 if (i, j) in selected else 0
            colour = ("title", "accent", "text", "badge")[j % 4] if is_segmented else ("title", "accent", "line", "soft")[j % 4]
            parts.append(f'<div class="dd-point" style="--dd-share:{share:g}%;--dd-item:{j + 1};--dd-label-row:{j + 2};--dd-colour:var(--{colour})">')
            # 原中点转到下一条真实标签的前端，DOM字符顺序仍是前项、分隔字、后项。
            leading = group["points"][j - 1]["separator"] if j and (row_flow or kind in ("column", "bar")) else ""
            trailing = point["separator"] if j == len(group["points"]) - 1 and (row_flow or kind in ("column", "bar")) else ""
            labels = _labels(point, ctx, flow=row_flow,
                             leading=leading if kind in ("column", "bar", "donut") else "",
                             trailing=trailing if kind in ("column", "bar", "donut") else "")
            if is_segmented:
                key = '<span class="dd-colour-key" aria-hidden="true"></span>'
                if row_flow:
                    leading_html = f'<span class="dd-separator" data-role="body">{inline(leading, ctx)}</span>' if leading else ""
                    trailing_html = f'<span class="dd-separator" data-role="body">{inline(trailing, ctx)}</span>' if trailing else ""
                    labels = key + leading_html + labels + trailing_html
                else:
                    labels = key + labels
                    if point["separator"]:
                        labels += f'<span class="dd-separator tb" data-role="body">{inline(point["separator"], ctx)}</span>'
            label_class = "dd-point-labels dd-label-flow tb" if row_flow else "dd-point-labels"
            label_role = ' data-role="body" data-separator-flow="next-label"' if row_flow else ""
            parts.append(f'<div class="{label_class}"{label_role}>{labels}</div>')
            if kind in ("bar", "column", "segmented", "stacked") and (i, j) in selected:
                parts.append('<div class="dd-track" aria-hidden="true"><div class="dd-bar"></div></div>')
            if point["separator"] and not is_segmented and kind not in ("column", "bar", "donut"):
                parts.append(f'<span class="dd-separator tb" data-role="body">{inline(point["separator"], ctx)}</span>')
            parts.append('</div>')
        parts.append('</div>')
    parts.append('</div>')
    return "".join(parts)


COMPONENTS = {"annotation": render_annotation, "line_legend": render_line_legend, "chart": render_chart}

SPEC_FIELDS = {
    "annotation": {"asset", "illustrations", "illustration", "screenshot", "aspect_ratio", "media_side", "media_width", "media_width_v", "anchors", "leader_style", "leaders_v", "labels_position", "target_selector", "label_role", "columns", "connector", "items_layout", "labels", "placement", "targets"},
    "line_legend": {"layout", "columns"},
    "chart": {"chart_type", "kind", "variant", "data", "segments", "segments_node", "number_first", "center_node", "labels_layout"},
}
