"""完整定稿节点的流程、时间线与分段带；图形始终在文字下方。"""

from html import escape
from itertools import count
import json
from pathlib import Path
from engine.assets import ASSET_ROOT
import re
from urllib.parse import unquote, urlsplit
from urllib.request import url2pathname

from ._shared import images, render_node, render_unit, units


_EDGE_IDS = count(1)
_NO_CONTAINER_RECEIPT = object()


_SEQUENCE_EDGES_JS = r"""(() => {
  const root = document.currentScript.closest('.c-sequence');
  const svg = root.querySelector('.sequence-edges');
  const ns = 'http://www.w3.org/2000/svg';
  const items = () => [...root.querySelectorAll('.sequence-item')].filter(item => item.closest('.c-sequence') === root);
  const box = item => (item.querySelector('.sequence-art') || item.querySelector('.sequence-card') || item).getBoundingClientRect();
  let queued = false;
  const draw = () => {
    const r = root.getBoundingClientRect(), ox = r.left + root.clientLeft, oy = r.top + root.clientTop;
    const width = root.clientWidth, height = root.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${Math.max(1,width)} ${Math.max(1,height)}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    const paths = [], edgePorts = [], nodes = items(), defs=svg.querySelector('defs');
    if(defs) for(const old of defs.querySelectorAll('[data-sequence-fade], [data-sequence-counter]')) old.remove();
    const fade=Number(root.dataset.fadeAfter), fadeActive=root.dataset.fadeAfter!=='' && root.dataset.fadeAfter!==undefined && fade>=0 && fade<nodes.length;
    const mix=t=>`color-mix(in srgb, var(--accent) ${100*(1-t)}%, var(--muted-line) ${100*t}%)`;
    const add = (d, kind, sequenceIndex=null, ports=null) => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d); path.setAttribute('data-edge-kind', kind);
      if(sequenceIndex!==null){path.setAttribute('data-source-item',sequenceIndex);path.setAttribute('data-target-item',sequenceIndex+1);}
      if (ports) edgePorts.push({x:ports[0]+ox,y:ports[1]+oy}, {x:ports[2]+ox,y:ports[3]+oy});
      if (root.dataset.connector === 'arrow') path.setAttribute('marker-end', `url(#${svg.dataset.arrow})`);
      if (kind === 'branch') path.setAttribute('stroke-dasharray', '4 5');
      if(fadeActive && defs && sequenceIndex!==null && ports) {
        const a=Math.max(0,(sequenceIndex-fade)/(nodes.length-fade));
        const b=Math.max(0,(sequenceIndex+1-fade)/(nodes.length-fade));
        if(b>0) {
          const id=svg.dataset.arrow+'-fade-'+sequenceIndex, gradient=document.createElementNS(ns,'linearGradient');
          gradient.setAttribute('id',id); gradient.setAttribute('data-sequence-fade','true');
          gradient.setAttribute('gradientUnits','userSpaceOnUse');
          for(const [key,value] of Object.entries({x1:ports[0],y1:ports[1],x2:ports[2],y2:ports[3]})) gradient.setAttribute(key,value);
          for(const [offset,t] of [[0,a],[1,b]]) {
            const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);
            stop.setAttribute('style','stop-color:'+mix(t));gradient.appendChild(stop);
          }
          defs.appendChild(gradient);path.setAttribute('style',`stroke:url(#${id})`);
          path.setAttribute('data-fade-start',a);path.setAttribute('data-fade-end',b);
          if(root.dataset.connector==='arrow') {
            const marker=document.createElementNS(ns,'marker'), tip=document.createElementNS(ns,'path');
            marker.setAttribute('id',id+'-tip');marker.setAttribute('data-sequence-fade','true');
            for(const [key,value] of Object.entries({markerWidth:6,markerHeight:6,refX:6,refY:3,orient:'auto'})) marker.setAttribute(key,value);
            tip.setAttribute('d','M 0 0 L 6 3 L 0 6 Z');tip.setAttribute('style','fill:'+mix(b));
            marker.appendChild(tip);defs.appendChild(marker);path.setAttribute('marker-end',`url(#${id}-tip)`);
          }
        }
      }
      paths.push(path);
    };
    for(let i=0;i<nodes.length;i++) {
      const item=nodes[i], marker=item.querySelector('.sequence-source-connector');
      if(!marker) continue;
      delete marker.dataset.incomplete;
      marker.style.position='absolute';
      marker.style.left='auto';marker.style.top='auto';
      const previous=nodes[i-1];
      if(!previous) {marker.dataset.incomplete='原箭头没有前节点，未猜连接';marker.style.position='relative';continue;}
      // 竖版原连接字位于完整节点之间，above_card图也占位；横版保持既有卡间端口。
      const occupied=n=>root.dataset.orient==='v' && root.dataset.direction==='vertical'?n.getBoundingClientRect():(n.querySelector('.sequence-main-card')||n.querySelector('.sequence-card')||n).getBoundingClientRect();
      const a=occupied(previous),b=occupied(item),frame=item.getBoundingClientRect();
      let axis,cx,cy,gap;
      if(b.left>a.right) {axis='horizontal';gap=b.left-a.right;cx=(a.right+b.left)/2;cy=((a.top+a.bottom)+(b.top+b.bottom))/4;}
      else if(b.top>a.bottom) {axis='vertical';gap=b.top-a.bottom;cx=((a.left+a.right)+(b.left+b.right))/4;cy=(a.bottom+b.top)/2;}
      else {marker.dataset.incomplete='原箭头两节点没有可用框间空隙';marker.style.position='relative';continue;}
      marker.dataset.axis=axis;
      const measured=marker.getBoundingClientRect(),extent=axis==='horizontal'?measured.right-measured.left:measured.bottom-measured.top;
      if(gap<extent+4) {marker.dataset.incomplete='原箭头实际字框大于框间空隙，保留可见字符待调整';marker.style.position='relative';continue;}
      marker.style.left=(cx-frame.left-marker.offsetWidth/2)+'px';
      marker.style.top=(cy-frame.top-marker.offsetHeight/2)+'px';
    }
    if(root.dataset.layout==='vertical_flags') {
      const flags=nodes.map(item=>item.querySelector('.sequence-flag')).filter(Boolean);
      if(flags.length) {
        const boxes=flags.map(flag=>flag.getBoundingClientRect()), spacing=parseFloat(getComputedStyle(root).getPropertyValue('--sequence-space'))||16;
        const x=Math.max(2,Math.min(...boxes.map(b=>b.left-ox))-spacing/2);
        add(`M ${x} ${(boxes[0].top+boxes[0].bottom)/2-oy} V ${(boxes.at(-1).top+boxes.at(-1).bottom)/2-oy}`,'flag-rail');
        for(const b of boxes) {
          const y=(b.top+b.bottom)/2-oy;add(`M ${x} ${y} H ${b.left-ox}`,'flag-stem');
          const point=document.createElementNS(ns,'circle');point.setAttribute('cx',x);point.setAttribute('cy',y);point.setAttribute('r',3);
          point.setAttribute('data-edge-kind','flag-point');paths.push(point);
        }
      }
    }
    if (root.dataset.variant==='day_band') {
      const rows=[...root.querySelectorAll('.sequence-row')].filter(row=>row.closest('.c-sequence')===root);
      if(rows.length===2) {
        const a=rows[0].getBoundingClientRect(), b=rows[1].getBoundingClientRect(), y=(a.bottom+b.top)/2-oy;
        const centers=nodes.map(item=>{const r=item.getBoundingClientRect();return (r.left+r.right)/2-ox;});
        add(`M ${Math.min(...centers)} ${y} H ${Math.max(...centers)}`, 'day-axis');
        for(const item of nodes) {
          const r=item.getBoundingClientRect(), row=item.closest('.sequence-row'), x=(r.left+r.right)/2-ox;
          const start=(row===rows[0]?r.bottom:r.top)-oy;
          add(`M ${x} ${start} V ${y}`, 'day-spoke');
        }
      }
    }
    if (['flat','serpentine','z_order'].includes(root.dataset.path) && root.dataset.variant!=='day_band' && root.dataset.direction === 'horizontal' && root.dataset.connector!=='none') for (let i=1;i<nodes.length;i++) {
      const previous = nodes[i-1], next = nodes[i];
      if (previous.closest('.sequence-chain') !== next.closest('.sequence-chain')) continue;
      if(previous.dataset.pageBreakAfter==='true'||next.dataset.pageBreakBefore==='true')continue;
      if(next.querySelector('.sequence-source-connector'))continue;
      const a = box(previous), b = box(next), ar = previous.closest('.sequence-row'), br = next.closest('.sequence-row');
      const ay = (a.top+a.bottom)/2-oy, by = (b.top+b.bottom)/2-oy;
      if (ar === br) {
        if(root.dataset.path==='flat')continue; // 本行继续用原 CSS 接线，不重复画。
        const forward = a.right <= b.left;
        const ax = (forward?a.right:a.left)-ox, bx = (forward?b.left:b.right)-ox;
        const middle = (ax+bx)/2;
        add(`M ${ax} ${ay} H ${middle} V ${by} H ${bx}`, 'same-row',i,[ax,ay,bx,by]);
      } else {
        // 换行只经过上下两节点之间的空带；同列蛇形退化为一根短竖线。
        const ap=previous.getBoundingClientRect(),bp=next.getBoundingClientRect();
        if(bp.top<=ap.bottom) {next.dataset.incomplete='跨行节点缺少真实上下空隙，未画穿卡连接';continue;}
        const overlapLeft=Math.max(a.left,b.left),overlapRight=Math.min(a.right,b.right);
        const aligned=overlapRight-overlapLeft>4?(overlapLeft+overlapRight)/2-ox:null;
        const ax=aligned===null?(a.left+a.right)/2-ox:aligned,bx=aligned===null?(b.left+b.right)/2-ox:aligned;
        const sy=ap.bottom-oy,ty=bp.top-oy,middle=(sy+ty)/2;
        add(Math.abs(ax-bx)<.05?`M ${ax} ${sy} V ${ty}`
          :`M ${ax} ${sy} V ${middle} H ${bx} V ${ty}`, 'row-turn',i,[ax,sy,bx,ty]);
      }
    }
    if(root.dataset.path==='curved') for(let i=1;i<nodes.length;i++) {
      const a=nodes[i-1].getBoundingClientRect(),b=nodes[i].getBoundingClientRect();
      if(nodes[i-1].closest('.sequence-chain')!==nodes[i].closest('.sequence-chain')) continue;
      if(nodes[i-1].dataset.pageBreakAfter==='true'||nodes[i].dataset.pageBreakBefore==='true')continue;
      if(root.dataset.direction==='vertical') {
        const ax=a.left-ox+3,bx=b.left-ox+3,ay=a.bottom-oy,by=b.top-oy,cy=(ay+by)/2;
        add(`M ${ax} ${ay} V ${cy} H ${bx} V ${by}`,'curved',i,[ax,ay,bx,by]);
      } else {
        const ax=a.right-ox,bx=b.left-ox,ay=(a.top+a.bottom)/2-oy,by=(b.top+b.bottom)/2-oy,cx=(ax+bx)/2;
        add(`M ${ax} ${ay} H ${cx} V ${by} H ${bx}`,'curved',i,[ax,ay,bx,by]);
      }
    }
    if(root.dataset.branches && defs) {
      const marker=document.createElementNS(ns,'marker'),tip=document.createElementNS(ns,'path');
      marker.setAttribute('id',svg.dataset.arrow+'-counter');marker.setAttribute('data-sequence-counter','true');
      for(const [key,value] of Object.entries({markerWidth:6,markerHeight:6,refX:6,refY:3,orient:'auto'}))marker.setAttribute(key,value);
      tip.setAttribute('d','M 0 0 L 6 3 L 0 6 Z');tip.setAttribute('style','fill:var(--diagram-counter)');
      marker.appendChild(tip);defs.appendChild(marker);
    }
    if(root.dataset.branches) for(const branch of JSON.parse(root.dataset.branches)) {
      const source=nodes[branch.item-1];if(!source) continue;
      const a=source.getBoundingClientRect(),sx=(a.left+a.right)/2-ox,sy=a.bottom-oy;
      const targets=branch.targets.map(n=>nodes[n-1]).filter(Boolean);
      for(let i=0;i<targets.length;i++) {
        const b=targets[i].getBoundingClientRect(),tx=b.left-ox,ty=(b.top+b.bottom)/2-oy;
        const rail=3+i*3,below=Math.min(height-3,sy+8+i*3);
        if(root.dataset.direction==='horizontal') {
          const top=a.top-oy, targetBottom=b.bottom-oy;
          const bottom=Math.max(...nodes.slice(0,branch.item-1).map(n=>n.getBoundingClientRect().bottom))-oy;
          if(top<=bottom) {root.dataset.incomplete='branches:below 没有真实上下两行间隙，反照线未绘制';continue;}
          const y=bottom+(top-bottom)*(i+1)/(targets.length+1),x=(b.left+b.right)/2-ox;
          // 宽来源卡为每个目标保留对齐的顶边端口，反照线不共用中心竖轨。
          const sourceX=Math.max(a.left-ox+4,Math.min(a.right-ox-4,x));
          add(Math.abs(sourceX-x)<.05?`M ${sourceX} ${top} V ${targetBottom}`
            :`M ${sourceX} ${top} V ${y} H ${x} V ${targetBottom}`,'counter-branch');
        } else add(`M ${sx} ${sy} V ${below} H ${rail} V ${ty} H ${tx}`,'counter-branch');
        const p=paths.at(-1);p.setAttribute('stroke-dasharray','4 5');
        p.setAttribute('marker-end',`url(#${svg.dataset.arrow}-counter)`);
        p.setAttribute('data-source-item',branch.item);p.setAttribute('data-target-item',branch.targets[i]);
      }
    }
    if(root.dataset.databaseBracket==='true' && nodes.length===7) {
      const subset=nodes.slice(1,6).map(n=>n.getBoundingClientRect());
      const top=Math.min(...subset.map(b=>b.top))-oy,bottom=Math.max(...subset.map(b=>b.bottom))-oy;
      const x=width-4;
      add(`M ${x-8} ${top} H ${x} V ${bottom} H ${x-8}`,'database-bracket');
      paths.at(-1).removeAttribute('marker-end');
    }
    for(const item of nodes) if(item.dataset.branchSide) {
      const main=item.querySelector('.sequence-main-card'), branch=item.querySelector('.sequence-failure-branch');
      if(!main||!branch) continue;
      const a=main.getBoundingClientRect(),b=branch.getBoundingClientRect();
      if(item.dataset.branchSide==='bottom' && b.top>a.bottom) {
        const sx=(a.left+a.right)/2-ox,sy=a.bottom-oy,tx=(b.left+b.right)/2-ox,ty=b.top-oy,mid=(sy+ty)/2;
        add(`M ${sx} ${sy} V ${mid} H ${tx} V ${ty}`,'failure-branch');
      } else if(item.dataset.branchSide==='right' && b.left>a.right) {
        const sx=a.right-ox,sy=(a.top+a.bottom)/2-oy,tx=b.left-ox,ty=(b.top+b.bottom)/2-oy,mid=(sx+tx)/2;
        add(`M ${sx} ${sy} H ${mid} V ${ty} H ${tx}`,'failure-branch');
      } else {item.dataset.incomplete='原失败支线没有真实主卡到枝卡的空隙，连接线未绘制';continue;}
      const line=paths.at(-1);line.setAttribute('stroke-dasharray','4 5');line.setAttribute('data-source-item',Number(item.dataset.index)+1);
      line.setAttribute('data-source-port',item.dataset.branchSide==='bottom'?'bottom':'right');
    }
    const stub=Number(root.dataset.branchStub), stubNode=nodes.find(item=>Number(item.dataset.index)+1===stub);
    if(stub>0 && stubNode && root.dataset.branchDirection==='top_right') {
      const flag=stubNode.querySelector('.sequence-flag')||stubNode, a=flag.getBoundingClientRect();
      const neighbours=nodes.filter(item=>item!==stubNode && item.closest('.sequence-row')===stubNode.closest('.sequence-row'))
        .map(item=>item.getBoundingClientRect()).filter(b=>b.left>=a.right-1);
      const available=neighbours.length?Math.min(...neighbours.map(b=>b.left-a.right)):width-(a.right-ox)-4;
      const spacing=parseFloat(getComputedStyle(root).getPropertyValue('--sequence-space'))||16;
      const length=Math.min(spacing*0.8,Math.max(0,available-4));
      if(length>1) {
        const x=a.right-ox,y=(a.top+a.bottom)/2-oy;
        add(`M ${x} ${y} H ${x+length} V ${Math.max(2,y-spacing)}`,'branch-stub');
      }
    }
    const loop=Number(root.dataset.loopAt), loopNode=nodes.find(item=>Number(item.dataset.index)+1===loop);
    if(loop>0 && loopNode) {
      const card=n=>n.querySelector('.sequence-main-card')||n.querySelector('.sequence-card')||n;
      const r=card(loopNode).getBoundingClientRect(), row=loopNode.closest('.sequence-row');
      const rowRects=[...row.querySelectorAll('.sequence-item')].map(item=>card(item).getBoundingClientRect());
      const obstacles=nodes.filter(n=>n!==loopNode).map(n=>card(n).getBoundingClientRect());
      if((loopNode.dataset.incomplete||'').startsWith('loop_at')) delete loopNode.dataset.incomplete;
      const spacing=parseFloat(getComputedStyle(root).getPropertyValue('--sequence-space'))||16;
      const cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;
      const dx=Math.min((r.right-r.left)/4,Math.max(8,spacing*0.7)),dy=Math.min((r.bottom-r.top)/4,Math.max(8,spacing*0.7));
      const acrossY=obstacles.filter(b=>b.bottom>cy-dy-6 && b.top<cy+dy+6);
      const acrossX=obstacles.filter(b=>b.right>cx-dx-6 && b.left<cx+dx+6);
      const rooms={
        right:Math.min(ox+width-4,...acrossY.filter(b=>b.right>r.right).map(b=>b.left-4))-r.right,
        left:r.left-Math.max(ox+4,...acrossY.filter(b=>b.left<r.left).map(b=>b.right+4)),
        bottom:Math.min(oy+height-4,...acrossX.filter(b=>b.bottom>r.bottom).map(b=>b.top-4))-r.bottom,
        top:r.top-Math.max(oy+4,...acrossX.filter(b=>b.top<r.top).map(b=>b.bottom+4)),
      };
      const preferred=r.right>=Math.max(...rowRects.map(b=>b.right))-1?'right':r.left<=Math.min(...rowRects.map(b=>b.left))+1?'left':rooms.right>=rooms.left?'right':'left';
      const sides=[preferred,preferred==='right'?'left':'right','bottom','top'];
      const occupiedSide=side=>edgePorts.some(p=>side==='right'||side==='left'
        ? Math.abs(p.x-(side==='right'?r.right:r.left))<2 && p.y>=r.top-1 && p.y<=r.bottom+1
        : Math.abs(p.y-(side==='bottom'?r.bottom:r.top))<2 && p.x>=r.left-1 && p.x<=r.right+1);
      // 回环先用未被主链占用的边，避免和入卡箭头挤在同一端口。
      const side=sides.find(s=>rooms[s]>=12 && !occupiedSide(s)) || sides.find(s=>rooms[s]>=12);
      if(!side) loopNode.dataset.incomplete='loop_at原卡四侧均缺安全空间，源布局待修；未画穿卡回环';
      else {
        const arc=Math.min(rooms[side],Math.max(12,spacing));
        let sx,sy,tx,ty,c1x,c1y,c2x,c2y;
        if(side==='right'||side==='left') {
          sx=tx=(side==='right'?r.right:r.left)-ox;sy=cy-dy-oy;ty=cy+dy-oy;
          c1x=c2x=sx+(side==='right'?arc:-arc);c1y=sy;c2y=ty;
        } else {
          sy=ty=(side==='bottom'?r.bottom:r.top)-oy;sx=cx-dx-ox;tx=cx+dx-ox;
          c1y=c2y=sy+(side==='bottom'?arc:-arc);c1x=sx;c2x=tx;
        }
        add(side==='right'||side==='left'
          ? `M ${sx} ${sy} H ${c1x} V ${ty} H ${tx}`
          : `M ${sx} ${sy} V ${c1y} H ${tx} V ${ty}`, 'loop');
        const p=paths.at(-1);p.setAttribute('data-loop-node',loop);
        p.setAttribute('data-loop-target-node',loop);p.setAttribute('data-loop-side',side);
        p.setAttribute('data-loop-card',`${r.left-ox},${r.top-oy},${r.right-ox},${r.bottom-oy}`);
        p.setAttribute('data-loop-source-port',`${sx},${sy}`);p.setAttribute('data-loop-target-port',`${tx},${ty}`);
        p.setAttribute('data-loop-outer-x',Math.max(c1x,c2x));
        p.setAttribute('data-loop-outer-y',Math.max(c1y,c2y));
      }
    }
    const from = Number(root.dataset.branchAfter), to = Number(root.dataset.branchReturn);
    if (from>0 && to>0 && from!==to) {
      const a = nodes.find(item=>Number(item.dataset.index)+1===from);
      const b = nodes.find(item=>Number(item.dataset.index)+1===to);
      if (a && b) {
        const ar=a.getBoundingClientRect(), br=b.getBoundingClientRect();
        if (root.dataset.direction === 'vertical') {
          const ax=ar.right-ox, bx=br.right-ox, ay=(ar.top+ar.bottom)/2-oy, by=(br.top+br.bottom)/2-oy;
          add(`M ${ax} ${ay} H ${width-8} V ${by} H ${bx}`, 'branch');
        } else {
          const ax=(ar.left+ar.right)/2-ox, bx=(br.left+br.right)/2-ox;
          const ay=ar.top-oy, by=br.top-oy, turn=Math.max(8,Math.min(ay,by)-12);
          add(`M ${ax} ${ay} V ${turn} H ${bx} V ${by}`, 'branch');
        }
      }
    }
    svg.replaceChildren(...(defs?[defs,...paths]:paths));
    root.dataset.sequenceEdgeCount = String(paths.length);
  };
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;draw();});};
  draw();
  if(typeof ResizeObserver!=='undefined') {
    const observer=new ResizeObserver(schedule); observer.observe(root);
    for(const item of items()) observer.observe(item);
  }
  window.addEventListener('resize',schedule);
  for(const image of root.querySelectorAll('img')) image.addEventListener('load',schedule);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();"""


_SECTION_LEADERS_JS = r"""(() => {
  const root = document.currentScript.closest('.c-sequence');
  const svg = root && root.querySelector('.sequence-leaders');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  let queued = false;
  const pairs = () => [...root.querySelectorAll('.sequence-item')].map(item => ({
    item,
    source: item.querySelector('.sequence-section-symbol'),
    target: item.querySelector('.sequence-section-description')
  })).filter(pair => pair.source && pair.target);
  const draw = () => {
    const frame = root.getBoundingClientRect();
    const originX = frame.left + root.clientLeft;
    const originY = frame.top + root.clientTop;
    const width = root.clientWidth, height = root.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    const paths = [];
    for (const pair of pairs()) {
      const a = pair.source.getBoundingClientRect();
      const b = pair.target.getBoundingClientRect();
      // 由两个外框中心取得面对面的边缘端口，路径只经过二者之间的 gap。
      const sx = a.right - originX, sy = (a.top + a.bottom) / 2 - originY;
      const tx = b.left - originX, ty = (b.top + b.bottom) / 2 - originY;
      if (!(width > 0 && height > 0 && tx > sx) ||
          ![sx, sy, tx, ty].every(Number.isFinite)) continue;
      const middle = (sx + tx) / 2;
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${sx} ${sy} H ${middle} V ${ty} H ${tx}`);
      path.setAttribute('data-segment', pair.item.dataset.index);
      path.setAttribute('data-source-center', `${(a.left + a.right) / 2 - originX},${sy}`);
      path.setAttribute('data-target-center', `${(b.left + b.right) / 2 - originX},${ty}`);
      paths.push(path);
    }
    svg.replaceChildren(...paths);
    root.dataset.sequenceLeaderCount = String(paths.length);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; draw(); });
  };
  draw();
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    for (const pair of pairs()) {
      observer.observe(pair.source);
      observer.observe(pair.target);
    }
  }
  window.addEventListener('resize', schedule);
  for (const image of root.querySelectorAll('img')) image.addEventListener('load', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();"""


def _record(ctx, message, kind="composition"):
    incomplete = getattr(ctx, "incomplete", None)
    if callable(incomplete):
        incomplete(message, kind)
    else:
        ctx.warn(message)


def _roles(fragment):
    def role(match):
        tag = match.group(0)
        if 'data-role=' in tag:
            return tag
        name = 'step_number' if match.group(1) == 'number' else 'name' if match.group(1) in ('name', 'heading') else 'body'
        return tag[:-1] + f' data-role="{name}">'
    return re.sub(r'<(?:div|span)\b[^>]*class="[^"]*\bdg-(body|name|heading|number|cell|code|linkrow)\b[^"]*"[^>]*>', role, fragment)


def _choice(spec, key, choices, default, ctx=None):
    value = spec.get(key, default)
    if value not in choices and ctx is not None:
        _record(ctx, f"sequence 的 {key}={value!r} 未支持，使用 {default} 完整保字")
    return value if value in choices else default


def _columns(spec, default, count, ctx=None):
    try:
        value = int(spec.get("columns", default))
    except (TypeError, ValueError, OverflowError):
        value = default
        if ctx is not None:
            _record(ctx, "sequence 的 columns 不是有效整数，按默认列数完整保字")
    if (value < 1 or value > 12) and ctx is not None:
        _record(ctx, "sequence 的 columns 超出当前 1–12 列范围，保全原字但原列数未执行")
    return max(1, min(max(1, count), value, 12))


def _mapped_image(value, ctx, field):
    """只消费明确存在的PNG路径或已发布库的完全同名key，不猜语义别名。"""
    if isinstance(value,dict):value=value.get('asset')
    if not isinstance(value,str) or not value.strip():
        _record(ctx,f'{field} 未给明确PNG路径或可解析库键','asset');return None
    value=value.strip()
    root=Path(ASSET_ROOT)
    if value.startswith('file:'):
        path=Path(url2pathname(unquote(urlsplit(value).path)))
    else:path=Path(value)
    candidates=[path] if path.is_absolute() else [root/path,root/str(getattr(ctx,'page',{}).get('slug',getattr(ctx,'page',{}).get('id','')))/path]
    for candidate in candidates:
        if candidate.suffix.lower()=='.png' and candidate.is_file():
            return ctx.asset_url(str(candidate))
    # manifest已经核验READY和指纹；同屏同名优先，跨屏只接受唯一确定的完全同名路径。
    from engine import assets as engine_assets
    manifest=engine_assets.manifest();sid=getattr(ctx,'screen',{}).get('id','')
    def matching(rows):
        return {str(r['path']) for r in rows if r.get('key')==value and r.get('_lib') and Path(r.get('path','')).suffix.lower()=='.png' and Path(r.get('path','')).is_file()}
    paths=matching(manifest.get(sid,[]))
    if not paths:paths=matching(r for rows in manifest.values() for r in rows)
    if len(paths)==1:return ctx.asset_url(next(iter(paths)))
    reason='库键对应多条不同PNG，请给具体路径' if paths else '没有存在的明确PNG路径或完全同名库键'
    _record(ctx,f'{field}={value!r} {reason}','asset');return None


def _role_name(unit):
    name=unit.get('name') if unit.get('type')=='card' else unit.get('lead',unit.get('num',''))
    return re.sub(r'\*\*','',str(name or '')).strip().rstrip(':：')


def _station_assets(spec, real, ctx):
    """工位组合图只按原工位句与ready逐槽回执消费，不把现通用设备自动当组合物件。"""
    layout = spec.get('items_layout') or {}
    art = layout.get('station_art')
    if art is None:
        return {}
    mappings = layout.get('semantic_map')
    if (not isinstance(art,list) or len(art)!=len(real)
            or not isinstance(mappings,list) or len(mappings)!=len(real)):
        _record(ctx,'items_layout.station_art 缺逐工位完整 semantic_map（item/source_lead/source_phrase/asset/role）','asset')
        return {}
    scene = str(getattr(ctx,'screen',{}).get('scene') or '')
    clauses = {}
    for match in re.finditer(r'第\s*(\d+)\s*个工位.*?(?=；\s*第\s*\d+\s*个工位|。传送带|$)',scene):
        clauses[int(match.group(1))] = match.group(0).strip('；。 ')
    from engine import assets as engine_assets
    receipts = engine_assets.manifest().get(getattr(ctx,'screen',{}).get('id',''),[])
    result = {}
    compact = lambda value: re.sub(r'\s+','',str(value or '')).strip('；。')
    for index, unit in enumerate(real,1):
        row = mappings[index-1]
        clause = clauses.get(index)
        if (not isinstance(row,dict) or type(row.get('item')) is not int or row['item']!=index
                or row.get('source_lead')!=_role_name(unit) or row.get('role')!='icon'
                or not clause or compact(row.get('source_phrase'))!=compact(clause)):
            _record(ctx,f'第{index}工位 semantic_map 的原序/lead/完整工位句或icon角色不匹配','asset')
            continue
        url = _mapped_image(row.get('asset'),ctx,f'第{index}工位 semantic_map.asset')
        if not url:
            continue
        matching = [r for r in receipts if r.get('_lib') and r.get('status')=='ready'
                    and r.get('role')=='icon' and str(r.get('slot_ordinal'))==str(index)
                    and r.get('path') and ctx.asset_url(r['path'])==url
                    and compact(r.get('source_phrase'))==compact(clause)
                    and r.get('semantic_status') in ('scene_explicit_primary_object','scene_explicit_composite')
                    and not r.get('fallback') and not r.get('omitted_source_details')
                    and not re.search(r'未全部|未完全|不承诺|须在.*核对',str(r.get('semantic_abstraction') or ''))]
        if not matching:
            _record(ctx,f'第{index}工位 PNG尚无同屏同槽完整组合物件的ready语义回执，保留原图位及素材缺口','asset')
            continue
        result[index] = url
    return result


def _field_spec(raw, ctx, component, block_receipt=_NO_CONTAINER_RECEIPT):
    """只解释正式块中可确定的字段；其余值明确未完成，不改变调用方spec。"""
    spec = dict(raw)
    for alias in ("flow_direction", "orientation"):
        if alias in raw:
            if raw[alias] in ("horizontal", "vertical"):
                spec.setdefault("direction", raw[alias])
            else:
                _record(ctx, f"{alias}={raw[alias]!r} 没有已实现的方向含义")
    containers = {"connection_card", "steps_card", "claude_card", "command_step_card", "example_main"}
    if "container" in raw:
        if raw["container"] in containers:
            spec["_container"] = raw["container"]
            actual = getattr(ctx,'applied_container',None) if block_receipt is _NO_CONTAINER_RECEIPT else block_receipt
            if actual != raw['container']:
                _record(ctx, f"container={raw['container']} 跨相邻兄弟块，未收到同名真实父外框回执；block优先，旧ctx仅兼容无block字段")
        else:
            _record(ctx, f"container={raw['container']!r} 没有明确外框样式")
    if "highlight_steps" in raw and "highlight" not in raw:
        spec["highlight"] = raw["highlight_steps"]
    if "row_order" in raw:
        rows = [[int(n) for n in re.findall(r"\d+", row)] for row in str(raw["row_order"]).split('/')]
        if rows and all(rows) and sum(rows, []) == list(range(1, sum(map(len, rows)) + 1)):
            if getattr(ctx, 'orient', 'h') == 'h':
                spec.setdefault("item_rows", list(map(len, rows)))
            spec["_expected_order"] = sum(rows, [])
        else:
            _record(ctx, "row_order 不是保持源序的连续编号，不能倒置或重复原文")
    if raw.get("illustration_position") == "right":
        spec["illustration"] = "right_inside"
    elif "illustration_position" in raw and raw["illustration_position"] not in (None, "none"):
        _record(ctx, f"illustration_position={raw['illustration_position']!r} 尚无确定图位")
    failure = raw.get("failure_branch")
    if failure is not None:
        if isinstance(failure, dict) and isinstance(failure.get('at'), int) and isinstance(failure.get('source_text'), str):
            branches = dict(spec.get("branch_refs") or {})
            branches.setdefault(str(failure['at']), [failure['source_text']])
            spec['branch_refs'] = branches
            spec['_failure_branch_at'] = failure['at']
        else:
            _record(ctx, "failure_branch 未提供原项序号与原句，不造失败标签")
    hint = raw.get('layout_hint')
    if hint == '标题旁小图标，①②③紧凑全宽行':
        spec.update(direction='vertical', columns=1, _split_circled=True, _compact_rows=True)
    elif hint not in (None, '', 'none'):
        _record(ctx, f"描述型 layout_hint 尚未明确执行：{hint}")
    if raw.get('semantic_layout') == 'byte_reversal_four_nodes':
        spec['_expected_count'] = 4
        spec['columns'] = 4 if getattr(ctx,'orient','h') == 'h' else 1
    elif 'semantic_layout' in raw:
        _record(ctx, f"semantic_layout={raw['semantic_layout']!r} 无原词节点实现")
    if raw.get('ribbon') == 'curved_vertical':
        spec.update(path='curved', direction='vertical')
    elif 'ribbon' in raw:
        _record(ctx, f"ribbon={raw['ribbon']!r} 尚未执行")
    layout = raw.get('items_layout')
    if layout is not None:
        if not isinstance(layout, dict):
            _record(ctx, "items_layout 必须是明确的节点/行/图位对象")
        else:
            known = {'stations','station_art','semantic_map','label','body_placement','node_type','item_count','order','number_position','icon_position','heading_position','connector_direction','rows','text_position','illustration_position','illustration_width','row_columns','each_row_fills_width','heading_number_style','illustration_count','count','card','icon_side','path','badge_side','original_split_after','continuation_icons','row_sizes','last_card_span','original_split_between_nodes','node_shape','connector'}
            for key in layout.keys()-known:
                _record(ctx, f"items_layout.{key} 尚无实际执行，原字保留")
            for key in ('item_count','count'):
                if key in layout:spec['_expected_count'] = layout[key]
            for key in ('order','stations'):
                if key in layout:spec['_expected_'+key] = layout[key]
            if layout.get('node_type') is not None:spec['_expected_node_type'] = layout['node_type']
            row_lists = layout.get('rows')
            if isinstance(row_lists,list) and row_lists and all(isinstance(r,list) for r in row_lists):
                order=sum(row_lists,[])
                if order==list(range(1,len(order)+1)):
                    spec.setdefault('item_rows',list(map(len,row_lists)));spec['_expected_order']=order
                else:_record(ctx,"items_layout.rows没有保持原序，不能重排原字")
            for key in ('row_columns','row_sizes'):
                if key in layout:spec.setdefault('item_rows',layout[key])
            if layout.get('number_position') == 'top_left':spec['number_position']='top_left'
            if layout.get('icon_position') == 'top_left_inside':spec.update(illustration='top_inside',_icon_align='left')
            if layout.get('illustration_position') == 'bottom_inside':spec['illustration']='bottom_inside'
            if layout.get('icon_side')=='left':spec['illustration']='left_inside'
            if layout.get('badge_side')=='left':spec['number_position']='left_outside'
            if layout.get('card')=='open':spec['open_nodes']=True
            if layout.get('card')=='horizontal':spec['direction']='vertical'
            if layout.get('path') in ('curved','thin_vertical'):
                spec['direction']='vertical'
                if layout['path']=='curved':spec['path']='curved'
                else:spec.update(connector='line',open_nodes=True)
            if layout.get('connector')=='thin_vertical_line' or layout.get('node_shape')=='small_green_dot':
                spec.update(direction='vertical',connector='line',open_nodes=True,_dot_nodes=True)
            if layout.get('connector_direction') in ('right','down'):
                spec['direction']='horizontal' if layout['connector_direction']=='right' else 'vertical'
            if layout.get('original_split_after') is not None and getattr(ctx,'orient','h')=='v':
                spec.setdefault('part_after_steps',[layout['original_split_after']])
                if layout.get('continuation_icons')=='none':spec['_no_icons_after']=layout['original_split_after']
            if layout.get('original_split_between_nodes') and getattr(ctx,'orient','h')=='v':spec.setdefault('part_after_steps',[1])
            if layout.get('heading_number_style')=='green_inline':spec['number_position']='inline'
            if layout.get('body_placement') in ('工位下四列','工位右侧'):
                spec.update(name_in_card=False,_station_labels=True)
                spec['illustration']='above_card' if layout['body_placement']=='工位下四列' else 'left_inside'
                spec['direction']='horizontal' if layout['body_placement']=='工位下四列' else 'vertical'
            if layout.get('illustration_count') is not None:spec['_expected_icon_count']=layout['illustration_count']
            if layout.get('illustration_width') not in (None,'100%'):_record(ctx,'items_layout图宽尚不支持该非100%值')
    if raw.get('main_illustration_position') not in (None, 'between_items'):
        _record(ctx, 'main_illustration_position 仅支持已有 illustration_after_item 明确切点')
    elif raw.get('main_illustration_position') == 'between_items' and not isinstance(raw.get('illustration_after_item'), int):
        _record(ctx, 'between_items 缺少明确原项切点，不能猜图位')
    if raw.get('end_illustration') not in (None,'none',False):
        spec['_end_asset_url']=_mapped_image(raw['end_illustration'],ctx,'end_illustration')
    if raw.get('tone') == 'historical_after_aug03':
        spec['_historical_date'] = '8月3日'
    elif 'tone' in raw:
        _record(ctx, f"tone={raw['tone']!r} 未确定历史起点")
    for key, choices in (('size', ('medium',)), ('name_in_card',(True,False)),
                         ('status',('待验收',)), ('status_position',('top_right',)),
                         ('last_item_illustration',('left_inside','none'))):
        if key in raw and raw[key] not in choices:
            _record(ctx, f"{key}={raw[key]!r} 未实现该值")
    return spec


def _field_validate(spec, nodes, ctx):
    """计数、顺序、标签均核对原节点，不制造元信息所声称的文字。"""
    source_units = units([_normalized_node(n) for n in nodes])
    real = [n for n in source_units if n.get('type') in ('item','card')]
    expected = spec.get('_expected_count')
    for key in ('card_count','item_count','nodes'):
        if key in spec:
            if expected is None:expected=spec[key]
            if spec[key] != len(real):_record(ctx,f"{key}={spec[key]} 与原节点{len(real)}不符，不补假节点")
    split_layout = spec.get('items_layout') or {}
    split_declared = split_layout.get('original_split_after') or split_layout.get('original_split_between_nodes')
    full_numbers = [int(n) for n in re.findall(r'(?m)^(\d+)\.\s+',getattr(ctx,'screen',{}).get('text',''))]
    whole_count_verified = bool(split_declared and expected is not None and full_numbers == list(range(1,expected+1)))
    if split_layout.get('original_split_between_nodes') and expected == 2:
        # 两次真事按两条原日期卡拆张，count属于整组；本块只分到第一件。
        date_headers = re.findall(r'(?m)^\*\*(\d{1,2}\s*月[^*]+)\*\*',getattr(ctx,'screen',{}).get('text',''))
        whole_count_verified = len(date_headers) == expected
    if expected is not None and expected != len(real) and not whole_count_verified:_record(ctx,f"items_layout/semantic预期{expected}，实际原节点{len(real)}，不伪补")
    if whole_count_verified and len(real) < expected:
        counts = spec.get('item_rows')
        if isinstance(counts,list) and sum(counts)==expected:
            remainder, local = len(real), []
            for n in counts:
                if not remainder:break
                local.append(min(remainder,n));remainder-=min(remainder,n)
            spec['item_rows']=local
    order = spec.get('_expected_order')
    if order is not None and order != list(range(1,len(real)+1)):_record(ctx,'原序检查与实际节点不符')
    node_type = spec.get('_expected_node_type')
    if node_type and any(n.get('source_type') != node_type for n in real):
        _record(ctx, f'items_layout.node_type={node_type} 与实际原节点种类不符')
    stations = spec.get('_expected_stations')
    if stations is not None:
        actual=[re.sub(r'\s+|\*\*','',str(n.get('lead',n.get('name',n.get('num',''))))) for n in real]
        if [re.sub(r'\s+','',str(s)) for s in stations] != actual:_record(ctx,'工位名称没有逐项匹配原lead，不造标签')
    spec['_station_asset_urls'] = _station_assets(spec,real,ctx)
    manual = spec.get('human_action_items') or []
    if not isinstance(manual,list) or any(type(n) is not int or not 1<=n<=len(real) for n in manual) or len(set(manual))!=len(manual):
        _record(ctx,'human_action_items 未给唯一有效的原步骤序号，保留原图位')
        manual = []
    spec['_manual_items'] = manual
    if manual:
        # 与core numbered_steps沿用相同字段和已明确的小手PNG，不从主体icons数组猜手动标记。
        spec['_manual_asset_url'] = _mapped_image('_library/icons/指向手.png',ctx,'human_action_items 手动动作小手')
    role_icons=spec.get('role_icons')
    if role_icons is not None:
        if not isinstance(role_icons,dict):_record(ctx,'role_icons不是明确角色映射')
        else:
            spec['_role_asset_urls']={}
            for name,key in role_icons.items():
                if any(_role_name(n)==name for n in real):
                    spec['_role_asset_urls'][name]=_mapped_image(key,ctx,f'role_icons.{name}')
    failure = spec.get('failure_branch')
    if isinstance(failure,dict):
        at = failure.get('at',0)
        if not (isinstance(at,int) and 0<at<=len(real) and failure.get('source_text','') in str(real[at-1].get('text',''))):
            _record(ctx,'failure_branch 指定原项/原句没有匹配，不造分支文字')
    return real


def _normalized_node(node):
    if node.get("type") == "para":
        match = re.fullmatch(r"\*\*(.+?)\*\*\s*(?:｜\s*|(?=[:：]))(.*)", node.get("text", ""), re.DOTALL)
        if not match:
            match = re.fullmatch(r"\*\*(.+?[:：])\*\*\s*(.*)", node.get("text", ""), re.DOTALL)
        if match:
            return dict(node, type="item", lead=match.group(1), text=match.group(2))
    return node


_DATE_EVENT = re.compile(r"^(\d{1,2}\s*月(?:\s*\d{1,2}(?:\s*[–—-]\s*\d{1,2})?\s*日|\s*(?:初|上旬|中旬|下旬|底))(?:\s*\d{1,2}:\d{2}(?:[–—-]\d{1,2}:\d{2})?)?)(.*)$", re.DOTALL)


def _literal(node):
    """保留原排版标记，让 ctx.inline 处理；不从说明文生造节点名称。"""
    source = '\n'.join(node.get("src", []))
    if source:
        return source
    if node.get("type") == "group":
        return str(node.get("name", ""))
    if node.get("type") == "card":
        return '**' + str(node.get("name", "")) + '**' + str(node.get("text", ""))
    return str(node.get("text", ""))


def _source_arrow_units(fragments, ctx):
    """原连接字符移到后项之前的独立可见DOM，原片段与原顺序不变。"""
    result, carry = [], ''
    arrow = r'(→|⇒|⟶|->)'
    for i, original in enumerate(fragments):
        text = original
        before, carry = carry, ''
        leading = re.match(r'\s*' + arrow + r'\s*',text)
        if leading and i:
            before += leading.group(1)
            text = text[leading.end():]
        elif leading:
            _record(ctx,'第一原片段前的箭头没有前节点，保留该原字符，不猜前项')
        trailing = re.search(r'\s*' + arrow + r'\s*$',text) if i<len(fragments)-1 else None
        if trailing:
            carry = trailing.group(1)
            text = text[:trailing.start()]
        bold = re.fullmatch(r'\s*\*\*(.*?)\*\*\s*',text,re.DOTALL)
        unit = {'type':'item','lead':bold.group(1),'text':''} if bold else {'type':'item','text':text}
        if before:unit['_source_connector_before']=before
        result.append(unit)
    return result


def _prepared_nodes(nodes, spec, ctx, component=None):
    """明确兼容字段把原段落编入链；未点名的普通/未知节点仍原样保留。"""
    ordinary_dates = sum(n.get("type") == "para" and bool(_DATE_EVENT.match(n.get("text", ""))) for n in nodes)
    paragraph_events = bool(spec.get("paragraph_items") or spec.get("paragraph_nodes_as_events")) or (component == "timeline" and ordinary_dates >= 2)
    date_series = paragraph_events and any(n.get("type") == "para" and _DATE_EVENT.match(n.get("text", "")) for n in nodes)
    title_body_pairs = sum(
        n.get("type") == "steps" and len(n.get("items", [])) == 1 and nodes[i + 1].get("type") == "para"
        for i, n in enumerate(nodes[:-1]))
    bind_steps = bool(spec.get("attach_following_para")) or title_body_pairs >= 2
    bind_groups = bool(spec.get("group_nodes_as_steps"))
    references = spec.get("segment_refs")
    prepared = []
    for original in nodes:
        node = _normalized_node(original)
        kind = node.get("type")
        if spec.get('_split_circled') and kind in ('para','card'):
            pieces = re.split(r'(?=[①②③])', str(node.get('text','')))
            portions=[p for p in pieces if p]
            if len(portions) == 3 and all(portions[i].startswith('①②③'[i]) for i in range(3)):
                if kind=='card':prepared.append({'type':'group','name':node.get('name',''),'_hint_title':True})
                prepared.extend({'type':'item','text':p} for p in portions)
                continue
            _record(ctx, 'layout_hint 三个原圈号未完整匹配，不猜紧凑行切点')
        if kind in ("para", "group", "card") and (spec.get("split_inline_arrows") or (references and kind == "para")):
            text = _literal(node)
            split = None
            if references and kind == "para":
                positions, cursor = [0], 0
                if isinstance(references, list) and references:
                    for ref in references:
                        position = text.find(ref, cursor) if isinstance(ref, str) and ref else -1
                        if position < 0:
                            break
                        if position not in positions:
                            positions.append(position)
                        cursor = position + len(ref)
                    else:
                        positions.append(len(text))
                        split = [text[a:b] for a, b in zip(positions, positions[1:]) if b > a]
                if split is None:
                    _record(ctx, "sequence 的 segment_refs 未全匹配本段，保留原文，不猜切点")
            if split is None and spec.get("split_inline_arrows") and re.search(r"→|⇒|⟶|->", text):
                split = [s for s in re.split(r"(?=→|⇒|⟶|->)", text) if s]
            if split and len(split) > 1:
                prepared.extend(_source_arrow_units(split,ctx))
                continue
        if kind == "group" and bind_groups:
            prepared.append({"type": "item", "lead": node.get("name", ""), "text": "", "following_nodes": [], "group_event": True})
        elif kind in ("steps", "bullets", "stats") and bind_steps:
            prepared.extend(units([node]))
        elif kind in ("para", "bullets") and prepared and prepared[-1].get("type") == "item" and (bind_steps or (bind_groups and prepared[-1].get("group_event"))):
            last = dict(prepared[-1])
            last["following_nodes"] = list(last.get("following_nodes", [])) + [node]
            prepared[-1] = last
        elif kind == "para" and paragraph_events:
            date = _DATE_EVENT.match(node.get("text", ""))
            if date:
                prepared.append({"type": "item", "lead": date.group(1), "text": date.group(2)})
            elif not date_series:
                prepared.append(dict(node, type="item"))
            else:
                prepared.append(node)
        else:
            prepared.append(node)
    return prepared


def _sections(nodes, merge_lists=False):
    """保留普通节点的相对顺序；每段清单自身形成一条完整节点链。"""
    pending = []
    for node in nodes:
        # 同一真实定稿可能由不同版本解析器产出 para 或 card；不改传入节点。
        node = _normalized_node(node)
        if node.get("type") in ("steps", "bullets", "stats"):
            if merge_lists:
                pending.extend(units([node]))
                continue
            if pending:
                yield True, pending
                pending = []
            yield True, units([node])
        elif node.get("type") in ("item", "card"):
            pending.append(node)
        else:
            if pending:
                yield True, pending
                pending = []
            yield False, [node]
    if pending:
        yield True, pending


def _img(url):
    return f'<img class="sequence-icon" src="{escape(str(url), quote=True)}" alt="">'


def _film_segments(text, spec, ctx):
    """只沿原文边界切片；显式锚点、镜像算式和宽空格均不补字。"""
    references = spec.get("segment_refs")
    if isinstance(references, list) and references:
        starts, cursor = [0], 0
        for reference in references:
            if not isinstance(reference, str) or not reference:
                break
            position = text.find(reference, cursor)
            if position < 0:
                break
            if position not in starts:
                starts.append(position)
            cursor = position + len(reference)
        else:
            starts.append(len(text))
            return "", [text[a:b] for a, b in zip(starts, starts[1:]) if b > a]
        _record(ctx, "film 的 segment_refs 未全部匹配原文，保留全文并按原文分隔符自动分段")
    if re.search(r"[＋＝]", text):
        prefix, sep, content = text.partition("：")
        if not sep:
            prefix, content = "", text
        else:
            prefix += sep
        return prefix, [s for s in re.split(r"(?=[＋＝])", content) if s]
    boundaries = [m.end() for m in re.finditer(r"\u3000+|[ \t]{2,}", text)]
    if boundaries:
        starts = [0] + boundaries + [len(text)]
        return "", [text[a:b] for a, b in zip(starts, starts[1:]) if text[a:b].strip()]
    return None


def _inline_unit(unit, ctx):
    """同一段只有一个文字框；中文冒号来自正文，不生成新的分隔字。"""
    if unit.get("type") not in ("card", "item"):
        return render_unit(unit, ctx)
    name = unit.get("name") if unit.get("type") == "card" else unit.get("lead", unit.get("num"))
    number = ctx.inline(str(unit["n"])) if unit.get("n") is not None else ""
    heading = '<strong>' + ctx.inline(str(name)) + '</strong>' if name else ''
    text = ctx.inline(str(unit.get("text") or "")).replace("｜", "<wbr>")
    return '<div class="sequence-inline dg-body tb">' + number + heading + text + '</div>'


def _heading_separator(unit):
    """只迁移原正文最前一枚冒号；原字及后续‘第一版：’不改变。"""
    unit = dict(unit)
    key = 'name' if unit.get('type') == 'card' else 'lead' if unit.get('lead') else 'num'
    text = unit.get('text')
    if unit.get(key) and isinstance(text,str):
        match = re.match(r'\s*([：:])',text)
        if match:
            unit[key] = str(unit[key]) + match.group(1)
            unit['text'] = text[match.end():]
    return unit


def _item(unit, ctx, icon, placement, index, count, kind, highlighted=False, text_layout="block",
          outside_icon=False, optional=False, section=False, branch_refs=None, reserve_icon_space=False,
          section_annotation=False, number_position="inside", break_after=False, break_before=False,
          vertical_flags=False, options=None):
    # render_unit 统一处理编号、列、日期和普通卡片，避免重复排出 cols/lead/text。
    options = options or {}
    unit = _heading_separator(unit)
    source_connector = unit.pop('_source_connector_before',None)
    section_mode = options.get('section_content','outside')
    section_label = ''
    if section and section_mode == 'inside':
        section_label = render_unit(dict(unit,text=''),ctx)
        for key in ('name','lead','num','n'):
            unit.pop(key,None)
        unit['type'] = 'item'
    number = ''
    if number_position in ("left_outside", "top_left") and unit.get("n") is not None:
        number = '<span class="sequence-number-outside dg-number tb">' + ctx.inline(str(unit["n"])) + '</span>'
        unit.pop("n", None)
    external_name = ''
    if options.get('name_in_card') is False:
        key = 'name' if unit.get('type') == 'card' else 'lead' if 'lead' in unit else 'num'
        if unit.get(key):
            external_name = '<div class="sequence-station-label dg-name tb">' + ctx.inline(str(unit.pop(key))) + '</div>'
    badge = ''
    if options.get('emphasis_badge'):
        value = str(options['emphasis_badge'])
        text = str(unit.get('text') or '')
        match = re.match(r'(?:\*\*)?' + re.escape(value) + r'(?:\*\*)?', text)
        if match:
            badge = '<span class="sequence-emphasis-badge dg-body tb">' + ctx.inline(match.group(0)) + '</span>'
            unit['text'] = text[match.end():]
        else:
            _record(ctx, f'第{index+1}项原正文开头没有 emphasis_badge 原词，不复制或补字')
    content = _inline_unit(unit, ctx) if text_layout == "inline" else render_unit(unit, ctx)
    if badge:
        match = re.search(r'<div class="dg-body\b',content)
        content = content[:match.start()] + badge + content[match.start():] if match else content + badge
    content += ''.join(render_node(n, ctx) for n in unit.get("following_nodes", []))
    external_branch = ''
    branch_side = ''
    if branch_refs and (not isinstance(branch_refs,(list,tuple)) or any(not isinstance(ref,str) or not ref for ref in branch_refs)):
        _record(ctx,f'第{index+1}项 branch_refs 不是有效原句列表，完整保留主正文')
        branch_refs = None
    if branch_refs and unit.get("type") in ("item", "card"):
        text = unit.get("text") or ""
        positions, cursor = [0], 0
        for ref in branch_refs:
            pos = text.find(ref, cursor) if isinstance(ref, str) and ref else -1
            if pos < 0:
                _record(ctx, f"flow 第 {index + 1} 项 branch_refs 未匹配全文，保留原项")
                break
            if pos not in positions:
                positions.append(pos)
            cursor = pos + len(ref)
        else:
            positions.append(len(text))
            pieces = [text[a:b] for a, b in zip(positions, positions[1:]) if b > a]
            if len(branch_refs) == 1 and len(pieces) == 2:
                # 单个明确支句的前缀仍是原主说明；只把尾部原句移到外支卡。
                content = render_unit(dict(unit,text=pieces[0]),ctx)
                if badge:
                    at = re.search(r'<div class="dg-body\b',content)
                    content = content[:at.start()] + badge + content[at.start():] if at else content + badge
                content += ''.join(render_node(n,ctx) for n in unit.get('following_nodes',[]))
                external_branch = ('<div class="sequence-failure-branch card"><div class="dg-body tb">'
                                   + ctx.inline(pieces[1]).replace('｜','<wbr>') + '</div></div>')
                branch_side = 'bottom' if getattr(ctx,'orient','h') == 'h' else 'right'
            else:
                head = render_unit(dict(unit, text=""), ctx)
                branches = ''.join('<div class="sequence-branch card"><div class="dg-body tb">'
                                   + ctx.inline(piece).replace("｜", "<wbr>") + '</div></div>' for piece in pieces)
                content = '<div class="sequence-branch-head">' + head + '</div><div class="sequence-branches">' + branches + '</div>'
    manual_url = options.get('manual_asset_url')
    if manual_url:
        marker = (f'<img class="sequence-manual-action" src="{escape(str(manual_url),quote=True)}" '
                  f'alt="" aria-hidden="true" data-role="icon" data-human-action-item="{index+1}" '
                  'data-mapping-field="human_action_items">')
        if external_name:
            external_name = external_name[:-6] + marker + '</div>'
        else:
            pattern = r'(<div class="dg-name\b[^"]*"[^>]*>.*?)(</div>)' if text_layout!='inline' else r'(<strong>.*?)(</strong>)'
            content, inserted = re.subn(pattern,lambda m:m[1]+marker+m[2],content,count=1,flags=re.DOTALL)
            if not inserted:
                _record(ctx,f'第{index+1}项 human_action_items 没有原名称可挂小手，未吞素材缺口','asset')
        ctx.warn('手动动作小手新增名称旁图形；保持原字号及主体图位，统一纳入最后验收页')
    copy = f'<div class="sequence-copy">{content}</div>'
    image = _img(icon) if icon and placement != "none" else ""
    if image and options.get('station_mapped'):
        image = image.replace('<img ',f'<img data-role="icon" data-station-item="{index+1}" data-source-lead="{escape(options["station_mapped"],quote=True)}" data-mapping-field="items_layout.semantic_map" ',1)
    if reserve_icon_space and placement != "none":
        image = '<div class="sequence-icon sequence-icon-blank" aria-hidden="true"></div>'
    body = copy
    if image and placement in ("top_inside", "left_inside") and not outside_icon:
        body = image + copy
    if image and placement == "right_inside":
        body = copy + image
    if image and placement == "bottom_inside":
        body = copy + image
    if section:
        if section_mode == 'inside':
            body = ('<div class="sequence-section-symbol sequence-section-labeled">'
                    + section_label + '</div>' + body)
        elif section_mode == 'none':
            pass
        elif section_annotation:
            body = ('<div class="sequence-section-symbol" aria-hidden="true"></div>'
                    '<div class="sequence-section-description card">' + body + '</div>')
        else:
            body = '<div class="sequence-section-symbol" aria-hidden="true"></div>' + body
    if options.get('status')=='待验收':
        body = '<span class="sequence-status deco" aria-hidden="true" data-status="待验收"></span>' + body
    selected = (' data-highlight="true"' if highlighted else '') + (' data-optional="true"' if optional else '')
    card = f'<div class="sequence-card card"{selected}>{body}</div>'
    if options.get('film'):
        rail = '<div class="sequence-film-rail deco" aria-hidden="true"></div>'
        card = f'<div class="sequence-card sequence-film-frame card"{selected}>{rail}{body}{rail}</div>'
    if image and placement in ("above_card", "outside"):
        card = '<div class="sequence-art">' + image + '</div>' + card
    if image and placement == 'below_card':
        card += '<div class="sequence-art sequence-art-below">' + image + '</div>'
    if external_name:
        card = external_name + card
    if image and outside_icon and placement == "left_inside":
        card = image + card
    # 日常横时间轴：原文名字是旗头，旗下面才是图标及说明，不重复名字。
    name = unit.get("name") if unit.get("type") == "card" else unit.get("lead", unit.get("num"))
    if kind == "timeline" and placement == "outside" and name and unit.get("n") is None:
        remainder = dict(unit, type="item")
        for key in ("name", "lead", "num"):
            remainder.pop(key, None)
        flag = f'<div class="sequence-flag dg-name tb">{ctx.inline(str(name))}</div>'
        art = '<div class="sequence-art">' + image + '</div>' if image else ''
        card_class = 'sequence-card sequence-flag-card card' if vertical_flags else 'sequence-card sequence-open card'
        card = (flag + art + '<div class="' + card_class + '"><div class="sequence-copy">'
                + badge + render_unit(remainder, ctx) + '</div></div>')
    if external_branch:
        card = card.replace('class="sequence-card card"','class="sequence-card sequence-main-card card"',1)
        card = f'<div class="sequence-main-and-branch" data-side="{branch_side}">{card}{external_branch}</div>'
    external = ' sequence-external-icon' if image and outside_icon and placement == "left_inside" else ''
    if vertical_flags:
        external += ' sequence-vertical-flag'
    if number:
        card = number + '<div class="sequence-node-body' + (' sequence-external-body' if external else '') + '">' + card + '</div>'
        external = ' sequence-number-top-left' if number_position == 'top_left' else ' sequence-number-left-outside'
    if source_connector:
        # 真实原字符、正常可见tb；不使用data-text、aria-hidden或装饰字伪装。
        native_vertical = options.get('native_vertical_source_arrow') and '→' in source_connector
        shown_connector = source_connector.replace('→','↓') if native_vertical else source_connector
        native_attr = ' data-native-vertical="true"' if native_vertical else ''
        card = ('<span class="sequence-source-connector tb" data-role="body"' + native_attr + '>'
                + ctx.inline(shown_connector) + '</span>' + card)
    breaks = (' data-page-break-after="true"' if break_after else '') + (' data-page-break-before="true"' if break_before else '')
    attrs = (f' data-illustration="{placement}" data-number-position="{number_position}"'
             f' data-branch-side="{branch_side}"'
             f' data-item-variant="{options.get("variant", "default")}"'
             f' data-item-connector="{options.get("connector", "inherit")}"'
             f' data-icon-align="{options.get("icon_align", "center")}"')
    return (f'<div class="sequence-item sequence-item-{kind}{external}" '
            f'data-index="{index}"{breaks}{attrs} style="--sequence-index:{index};--sequence-count:{count}">'
            f'{card}</div>')


def _render(block, ctx, kind):
    spec = _field_spec(block.get("spec") or {},ctx,kind,block.get('applied_container',_NO_CONTAINER_RECEIPT))
    orient = getattr(ctx, "orient", "h")
    date_rows = kind == "timeline" and spec.get("layout") == "date_rows"
    vertical_flags = kind == "timeline" and spec.get("layout") == "vertical_flags"
    priority_steps = kind == "segmented_band" and spec.get("layout") == "priority_steps"
    default_direction = "vertical" if orient == "v" or (kind == "timeline" and spec.get("columns") == 1) else "horizontal"
    section = kind == "segmented_band" and spec.get("layout") in ("horizontal", "vertical") and bool(spec.get("segment_proportions"))
    section_mode = _choice(spec,'section_content',('inside','outside','none'),'inside',ctx) if section else 'outside'
    direction = spec["layout"] if section else _choice(spec, "direction", ("horizontal", "vertical"), default_direction, ctx)
    if date_rows:
        direction = "vertical"
    if vertical_flags:
        direction = "vertical"
    if kind == "timeline" and spec.get("column_flow"):
        if spec["column_flow"] == "top_to_bottom":
            direction = "vertical"
        else:
            _record(ctx, "column_flow 当前只支持 top_to_bottom，保留所有日期；指定读序未执行")
    if kind == "flow" and spec.get("layout") not in (None, "", "none", "auto", "snake"):
        _record(ctx, "flow.layout 当前只支持 snake，原文保全；指定构图未执行")
    connector = _choice(spec, "connector", ("arrow", "ribbon", "line", "none"),
                        "ribbon" if kind == "timeline" else "none" if kind == "segmented_band" else "arrow", ctx)
    if spec.get("connector_style") == "thin_line" and connector != "none":
        connector = "line"
    placement = _choice(spec, "illustration", (
        "above_card", "below_card", "left_inside", "right_inside", "top_inside", "bottom_inside", "outside", "outside_left", "outside-left", "left_outside", "none"),
        "left_inside" if direction == "vertical" else "above_card", ctx)
    if date_rows:
        if spec.get("illustration", "none") not in (None, "none") or spec.get("icons", "none") not in (None, "none", False):
            _record(ctx, "date_rows 是无逐条插画的紧凑日期行；当前图片规格未执行，请明确 illustration/icons:none")
        placement = "none"
        connector = "none"
    outside_left = placement in ("outside_left", "outside-left", "left_outside")
    if outside_left:
        placement = "left_inside"
    if vertical_flags:
        placement = "outside"
    if kind == "timeline":
        variant = _choice(spec, "variant", ("default", "vertical", "day_band"), "default", ctx)
        if variant == "vertical":
            direction = "vertical"
        if spec.get("band_placement") not in (None, "", "left", "between_rows"):
            _record(ctx, "timeline.band_placement 当前只支持 left/between_rows，原文保全；指定带位置未执行")
        if variant == "day_band" and (direction != "horizontal" or spec.get("band_placement") not in (None, "between_rows")):
            _record(ctx, "day_band 目前只支持横版上下两排连接到中带，当前构图尚未执行")
    else:
        variant = _choice(spec, "variant", ("steps", "funnel", "film", "stack"), "steps", ctx)
    if section:
        variant = "section"
        if section_mode == 'inside':
            ctx.warn('原名称进入分段条统一纳入最后验收页，待本人整体看；原文字完整保留')
    if kind == 'segmented_band' and variant == 'film':
        ctx.warn('胶片孔轨与帧格统一纳入最后验收页，待本人整体看；原文字完整保留')
    text_layout = _choice(spec, "text_layout", ("inline", "block"),
                          "inline" if kind == "segmented_band" and variant == "stack" else "block", ctx)
    highlighted = spec.get("highlight", [])
    if not isinstance(highlighted, (list, tuple)):
        highlighted = [highlighted]
    optional = spec.get("optional_items", [])
    if not isinstance(optional, (list, tuple)):
        optional = [optional]
    omitted_icons = spec.get("omit_icons", [])
    if not isinstance(omitted_icons, (list, tuple)):
        omitted_icons = [omitted_icons]
    outside_icon = spec.get("illustration_inside") is False or outside_left
    open_nodes = bool(spec.get("open_nodes", kind == "timeline" and not vertical_flags and (outside_icon or placement in ("above_card", "outside"))))
    icon_percent = None
    icon_width = spec.get("icon_width")
    if icon_width is not None:
        width_match = re.fullmatch(r"(\d+(?:\.\d+)?)%", str(icon_width))
        if width_match and 0<float(width_match.group(1))<70:
            icon_percent = float(width_match.group(1))
        else:
            _record(ctx, "icon_width 需要明确的0–70%图栏宽度，原字保全；指定比例未执行")
    icon_separator = spec.get("icon_separator") is True
    enclosure = spec.get("enclosure") == "single_card" or priority_steps
    default_path = "z_order" if spec.get("z_order") else "serpentine" if spec.get("snake") or spec.get("turn_after") or (kind == "flow" and spec.get("layout") == "snake") else "flat"
    path = _choice(spec, "path", ("flat", "ascending", "serpentine", "z_order", "curved"), default_path, ctx)
    loop_at = spec.get("loop_at", 0)
    if not isinstance(loop_at, int) or loop_at < 0:
        _record(ctx, "loop_at 不是有效的原节点序号，保留原文；循环标记未绘制")
        loop_at = 0
    last_marker = _choice(spec, "last_marker", ("none", "pending", "ring_question"), "none", ctx)
    failure_at = spec.get("failure_mark_at", 0)
    if not isinstance(failure_at, int) or failure_at < 0:
        _record(ctx, "failure_mark_at 不是有效原节点序号，保留原字；原叉标尚未绘制")
        failure_at = 0
    fade_after = spec.get("fade_after")
    if "fade_after" in spec and fade_after is None:
        _record(ctx, "fade_after 尚未给出原灰起点，原字/图形保留；主丝带渐灰未执行")
    if fade_after is not None and (not isinstance(fade_after, int) or fade_after < 0):
        _record(ctx, "fade_after 不是有效原节点序号，保留原文；尾段渐淡未执行")
        fade_after = None
    if last_marker != "none" or fade_after is not None:
        ctx.warn("原规格节点标记/灰色尾段是新增组件样式，待样张审定")
    align = _choice(spec, "align", ("left", "center", "right"), "left", ctx)
    scale = _choice(spec, "scale", ("default", "large"), "default", ctx) if kind == "flow" else "default"
    if scale == "large":
        ctx.warn("flow 图位与编号圆徽放大为待审候选，字号保持共用变量；待样张审定")
    number_position = _choice(spec, "number_position", ("inside", "left_inside", "inline", "left_outside", "top_left"), "inside", ctx)
    break_after = spec.get("page_break_after_item", spec.get("part_after_steps", [])) if orient == "v" else []
    break_before = spec.get("page_break_before_item", []) if orient == "v" else []
    if not isinstance(break_after, (list, tuple)):
        break_after = [break_after]
    if not isinstance(break_before, (list, tuple)):
        break_before = [break_before]
    branch_after = spec.get("branch_after")
    branch_return = spec.get("branch_return")
    branch_direction = _choice(spec, "branch_direction", ("none", "top_right"), "none", ctx)
    branch_stub = isinstance(branch_after,int) and branch_after>0 and branch_direction=="top_right" and branch_return is None
    branch_edge = (isinstance(branch_after, int) and isinstance(branch_return, int)
                   and branch_after > 0 and branch_return == branch_after + 1 and connector != "none")
    if branch_after and not branch_edge and not branch_stub and not spec.get("branch_refs"):
        _record(ctx, "branch_after/branch_return 未声明当前支持的相邻回连或原文分支锚点，保留全部原文；该支线尚未绘制")
    if enclosure and (break_after or break_before):
        _record(ctx, "single_card 整体外框不能跨明确换张；请按源条目拆成前后两块外卡，当前保字但外框收口未完成")
    font = max(int(getattr(ctx, "min_font", 22 if orient == "h" else 36)),
               24 if orient == "h" else 36)
    all_icons = images(ctx, spec, kind="icons") if placement != "none" else []
    if spec.get('_split_circled'):
        placement = 'none'
    icon_i = 0
    outer_card = ' sequence-group-enclosure card' if enclosure else ''
    parts = [f'<div class="c-diagram c-sequence c-{kind}{outer_card}" data-comp="{kind}" '
             f'data-orient="{escape(str(orient), quote=True)}" data-direction="{direction}" '
             f'data-connector="{connector}" data-illustration="{placement}" '
             f'data-variant="{variant}" data-text-layout="{text_layout}" '
             f'data-open-nodes="{str(open_nodes).lower()}" data-enclosure="{"single_card" if enclosure else "none"}" '
             f'data-path="{path}" '
             f'data-stagger="{str(bool((spec.get("stagger") or spec.get("alternating")) and direction == "horizontal")).lower()}" '
             f'data-align="{align}" '
             f'data-layout="{"date_rows" if date_rows else "vertical_flags" if vertical_flags else "priority_steps" if priority_steps else "default"}" data-scale="{scale}" '
             f'data-number-position="{number_position}" '
             f'data-loop-at="{loop_at}" '
             f'data-fade-after="{fade_after if fade_after is not None else ""}" data-icon-width-explicit="{str(icon_percent is not None).lower()}" '
             f'data-icon-separator="{str(icon_separator).lower()}" data-branch-stub="{branch_after if branch_stub else 0}" data-branch-direction="{branch_direction}" '
             f'data-branch-after="{branch_after if branch_edge else 0}" data-branch-return="{branch_return if branch_edge else 0}" '
             f'data-annotation-side="{escape(str(spec.get("annotation_side", "none")), quote=True)}" '
             f'data-size="{spec.get("size","default")}" data-dot-nodes="{str(bool(spec.get("_dot_nodes"))).lower()}" '
             f'data-section-content="{section_mode}" '
             f'data-compact-rows="{str(bool(spec.get("_compact_rows"))).lower()}" '
             f'style="--sequence-min-font:{font}px;--sequence-icon-column:{icon_percent if icon_percent is not None else 25:g}%">']
    nodes = _prepared_nodes(block.get("nodes") or [], spec, ctx, kind)
    has_source_connectors = any(n.get('_source_connector_before') for n in nodes)
    if has_source_connectors:
        connector = 'none'
        parts[0] = parts[0].replace('data-connector="arrow"','data-connector="none"').replace('data-connector="ribbon"','data-connector="none"').replace('data-connector="line"','data-connector="none"')
        parts[0] = parts[0].replace('data-comp=','data-source-connectors="true" data-comp=',1)
        ctx.warn('原连接箭头移到真实框间，竖版纵向→按裁定画正常↓；统一纳入最后验收页，待本人整体看')
    real = _field_validate(spec, nodes, ctx)
    if loop_at>len(real):
        _record(ctx,f'loop_at={loop_at} 超过实际原节点数{len(real)}，不猜循环节点')
    branches = []
    for branch in spec.get('branches', []) or []:
        if (isinstance(branch,dict) and isinstance(branch.get('item'),int)
                and 0 < branch['item'] <= len(real) and branch.get('placement') == 'below'
                and branch.get('connector') == 'dashed_arrow'
                and isinstance(branch.get('targets'),list) and branch['targets']
                and all(isinstance(n,int) and 0<n<branch['item'] for n in branch['targets'])):
            branches.append(branch)
        else:_record(ctx, 'branches 未提供真实前项目标/下置虚线箭头，不猜反照关系')
    if branches:
        parts[0] = parts[0].replace('data-comp=', 'data-branches="' + escape(json.dumps(branches),quote=True) + '" data-comp=',1)
    database = False
    if spec.get('database_bracket') is True:
        labels = [str(n.get('name',n.get('lead',''))) for n in real]
        database = labels == ['交付包','来源快照','证据片段','事实','决定记录','构建','六个文件']
        if not database:_record(ctx,'database_bracket 未匹配原交付包→数据库内五节点→文件链，不猜括号范围')
        else:parts[0] = parts[0].replace('data-comp=','data-database-bracket="true" data-comp=',1)
    if spec.get('_historical_date'):
        match = next((i for i,n in enumerate(real) if re.sub(r'\s+|\*\*','',str(n.get('lead',n.get('num','')))).startswith(spec['_historical_date'])),None)
        if match is not None: fade_after = match + 1
        else: _record(ctx, '历史灰起点8月3日未匹配原日期，不猜起点')
        parts[0] = re.sub(r'data-fade-after="[^"]*"',f'data-fade-after="{fade_after if fade_after is not None else ""}"',parts[0])
    # 组头图只接受明确素材及调用方核验过无字的标记，不随机领 manifest 的第一张。
    header_requested = "header_illustration" in spec or (enclosure and not priority_steps and any(n.get("type") == "group" for n in nodes))
    if header_requested:
        header = spec.get("header_illustration")
        asset = header.get("asset") if isinstance(header, dict) else header
        verified = header.get("verified_no_text") is True if isinstance(header, dict) else spec.get("header_illustration_verified_no_text") is True
        if not enclosure:
            _record(ctx, "header_illustration 只用于 enclosure:single_card，当前未放组头图")
        elif not isinstance(asset, str) or not asset or asset in ("auto", "none"):
            _record(ctx, "组头缺少明确的已核验无字素材，保留组头文字和整体外框", "asset")
        elif asset.startswith(("file:", "data:", "http:", "https:")):
            _record(ctx, "header_illustration 请指定核验过的本地素材路径，当前未放图")
        elif not verified:
            _record(ctx, "header_illustration 尚未标记完成无字核验，不放图；保留全部组头文字", "asset")
        else:
            header_urls = images(ctx, {"illustrations": [asset]}, kind="illustrations")
            if header_urls:
                parts.append('<img class="sequence-header-art deco" src="' + escape(str(header_urls[0]), quote=True) + '" alt="" aria-hidden="true">')
                parts[0] = parts[0].replace('data-comp=', 'data-header-art="true" data-comp=', 1)
            else:
                _record(ctx, "header_illustration 指定素材不存在，保留组头文字和整体外框", "asset")
    if priority_steps:
        start = next((i for i, node in enumerate(nodes) if node.get("type") == "steps" or node.get("source_type") == "steps"), None)
        if start is not None:
            parts.extend('<div class="sequence-context">' + render_node(node, ctx) + '</div>' for node in nodes[:start])
            nodes = nodes[start:]
        else:
            _record(ctx, "priority_steps 没有真实编号台阶节点，原文保全；台阶构图未执行")
    sections = _sections(nodes, merge_lists=kind == "timeline" or (kind == "segmented_band" and variant == "funnel"))
    has_external_branch = False
    has_horizontal_wrap = False
    # 整段 steps 与其后说明卡可按显式分排组成最后一行；来源顺序保持不变。
    flat = units([_normalized_node(n) for n in nodes])
    if (isinstance(spec.get("item_rows", spec.get("row_counts", spec.get("rows"))), list)
            and flat and all(n.get("type") in ("item", "card") for n in flat)):
        sections = [(True, flat)]
    for is_chain, members in sections:
        # 真实胶片标签和镜像链均为单 para；语义分段只切原文，不改 nodes。
        if (kind == "segmented_band" and variant == "film" and not is_chain
                and members[0].get("type") == "para"):
            text = members[0].get("text", "")
            segments = _film_segments(text, spec, ctx)
            if segments:
                prefix, fragments = segments
                if prefix:
                    parts.append(f'<div class="sequence-context tb">{ctx.inline(prefix)}</div>')
                members = [{"type": "item", "text": s} for s in fragments if s]
                is_chain = True
        if not is_chain:
            title_art=''
            if members[0].get('_hint_title'):
                if all_icons:
                    title_art='<img class="sequence-title-icon deco" aria-hidden="true" src="'+escape(str(all_icons[0]),quote=True)+'" alt="">'
                    all_icons=[]
                else:_record(ctx,'圈号紧凑三行标题旁没有明确可用图标','asset')
            parts.append(f'<div class="sequence-context sequence-title-context">{title_art}{render_node(members[0], ctx)}</div>')
            continue
        if not members:
            continue
        segment_specs = spec.get("segments")
        if kind == "timeline" and isinstance(segment_specs, list) and segment_specs:
            offset, valid = 0, True
            for segment in segment_specs:
                if (not isinstance(segment, dict) or segment.get("start") != offset
                        or not isinstance(segment.get("count"), int) or segment["count"] <= 0):
                    valid = False
                    break
                offset += segment["count"]
            if valid and offset == len(members):
                offset = 0
                for segment in segment_specs:
                    stop = offset + segment["count"]
                    child = {k: v for k, v in spec.items() if k not in (
                        "segments", "decoration_after", "illustration_after_item", "branch_after", "branch_return",
                        "item_rows", "row_counts", "rows", "split_at")}
                    child.update(segment)
                    for key in ("highlight", "optional_items", "omit_icons"):
                        indexes = spec.get(key)
                        if isinstance(indexes, (list, tuple)):
                            child[key] = [n-offset for n in indexes if isinstance(n,int) and offset<n<=stop]
                    if stop != len(members):
                        child.pop("last_marker", None)
                    if fade_after is not None:
                        if fade_after >= stop:
                            child.pop("fade_after", None)
                        else:
                            child["fade_after"] = max(0, fade_after-offset)
                    child["icons"] = all_icons[offset:stop] if all_icons else "none"
                    if segment.get("layout") == "flags":
                        child["illustration"] = segment.get("illustration", "outside")
                    elif segment.get("layout") == "cards":
                        child["open_nodes"] = False
                    child_block={"nodes":members[offset:stop],"spec":child}
                    if 'applied_container' in block:child_block['applied_container']=block['applied_container']
                    parts.append(_render(child_block,ctx,kind))
                    offset = stop
                    if spec.get("decoration_after") == offset:
                        main_images = images(ctx, spec, kind="illustrations")
                        if main_images:
                            parts.append('<div class="sequence-main-art"><img src="' + escape(str(main_images[0]), quote=True) + '" alt=""></div>')
                        else:
                            _record(ctx, f"第 {offset} 项后的 decoration_after 主图缺失，分段文字完整保留", "asset")
                continue
            _record(ctx, "segments 未按原顺序覆盖本条完整链，保留全链，不猜未声明的分段")
        group_icons = all_icons[icon_i:icon_i + len(members)]
        station_assets = spec.get('_station_asset_urls') or {}
        if station_assets:
            group_icons = [station_assets.get(i+1) or (group_icons[i] if i<len(group_icons) else None) for i in range(len(members))]
        role_assets=spec.get('_role_asset_urls') or {}
        if any(role_assets.values()):
            base_icons=group_icons
            group_icons=[role_assets.get(_role_name(member)) or (base_icons[i] if i<len(base_icons) else None) for i,member in enumerate(members)]
            if spec.get('icons','auto') not in (None,'none',False):
                for i,member in enumerate(members):
                    if group_icons[i] is None and _role_name(member) not in role_assets:
                        _record(ctx,f'第{i+1}项未被role_icons映射且原图标不足，保留原字','asset')
        elif placement != "none" and len(group_icons) < len(members):
            if spec.get("icons", "auto") not in (None, "none", False):
                _record(ctx, f"{kind} 的图标不足整组（需要 {len(members)}，可用 {len(group_icons)}），本组统一不放图标", "asset")
            group_icons = []
        icon_i += len(members)
        vertical = (direction == "vertical" or (kind == "segmented_band" and variant in ("steps", "stack"))
                    or (kind == "segmented_band" and variant == "funnel" and "direction" not in spec))
        limit = 12 if kind == "segmented_band" and variant == "film" else 6 if kind == "flow" else 4
        default = 1 if vertical else min(limit, len(members))
        column_spec = {"columns": spec["columns_v"]} if orient == "v" and "columns_v" in spec else spec
        columns = 1 if vertical else _columns(column_spec, default, len(members), ctx)
        if orient == "v" and vertical and kind != "timeline" and "columns_v" in spec:
            if _columns(column_spec, 1, len(members), ctx) != 1:
                _record(ctx, "当前向下 flow/分段带不支持 columns_v 多列，原字保全；可用 horizontal+item_rows 指定 Z 字行")
        # 显式分排：连接线不越过下一排的文字；每个节点保留自适应高度。
        counts = spec.get("item_rows", spec.get("row_counts", spec.get("rows")))
        turns = spec.get("turn_after")
        if counts is None and not vertical and isinstance(turns, list) and turns:
            if all(isinstance(n,int) and 0<n<len(members) for n in turns) and turns == sorted(set(turns)):
                endpoints = [0]+turns+[len(members)]
                counts = [b-a for a,b in zip(endpoints,endpoints[1:])]
            else:
                _record(ctx, "turn_after 不是递增的原节点切点，保字但原转弯位置未执行")
        if isinstance(counts, list) and counts and all(isinstance(n, int) and 0 < n <= 12 for n in counts) and sum(counts) == len(members):
            rows, offset = [], 0
            for n in counts:
                rows.append(members[offset:offset + n]); offset += n
        else:
            if counts is not None:
                _record(ctx, "item_rows/row_counts/rows 与本链原节点数不一致，保全原字但指定分排未执行")
            rows = [members[i:i + columns] for i in range(0, len(members), columns)]
        has_horizontal_wrap = has_horizontal_wrap or (not vertical and len(rows) > 1)
        if variant == "day_band" and len(rows) != 2:
            _record(ctx, "day_band 的原节点未形成上下两排，原字保全；中带连接未执行")
        timeline_columns = 1
        if kind == "timeline" and vertical:
            column_spec = spec if orient == "h" else {"columns": spec.get("columns_v", 1)}
            timeline_columns = _columns(column_spec, 1, len(members), ctx)
        column_ends = []
        if timeline_columns > 1:
            rows = [[member] for member in members]
            split_at = spec.get("split_at")
            if timeline_columns == 2 and isinstance(split_at, int) and 0 < split_at < len(members):
                column_ends = [split_at]
            elif timeline_columns == 2 and isinstance(spec.get("items_per_column"), int) and 0 < spec["items_per_column"] < len(members):
                column_ends = [spec["items_per_column"]]
            elif timeline_columns == 2 and isinstance(spec.get("split_after"), str):
                reference = re.sub(r"\s+|\*\*", "", spec["split_after"])
                index = next((i for i, item in enumerate(members)
                              if re.sub(r"\s+|\*\*", "", str(item.get("lead", item.get("num", item.get("name", ""))))).startswith(reference)), None)
                if index is not None and 0 < index + 1 < len(members):
                    column_ends = [index + 1]
                else:
                    _record(ctx, "split_after 原文日期未匹配，先保全日期并均分两列；指定切点尚未执行")
                    column_ends = [(len(members) + 1) // 2]
            else:
                column_ends = [(len(members) * i + timeline_columns - 1) // timeline_columns for i in range(1, timeline_columns)]
        chain_class = 'sequence-chain'
        if timeline_columns > 1:
            chain_class += ' sequence-timeline-columns'
            parts.append(f'<div class="{chain_class}" data-axis="columns" style="--sequence-columns:{timeline_columns}">')
            parts.append('<div class="sequence-chain" data-axis="vertical">')
        else:
            parts.append(f'<div class="{chain_class}" data-axis="{"vertical" if vertical else "horizontal"}">')
        hero_at = spec.get("hero_after_item") if kind == "flow" and orient == "h" else None
        running = 0
        boundaries = []
        for row in rows:
            running += len(row)
            boundaries.append(running)
        hero_images = []
        if isinstance(hero_at, int) and 0 < hero_at < len(members) and hero_at in boundaries:
            hero_images = images(ctx, spec, kind="illustrations")
            if hero_images:
                parts.append('<div class="sequence-hero-layout"><div class="sequence-hero-items">')
            else:
                _record(ctx, f"前 {hero_at} 项右侧主插画缺失，先完整保留步骤，尚未复现原大插画", "asset")
        offset = 0
        for row_i, row in enumerate(rows):
            template = ""
            proportions = spec.get("segment_proportions")
            if section and not vertical and isinstance(proportions, list) and len(proportions) == len(row):
                try:
                    weights = [float(n) for n in proportions]
                    if all(0 < n <= 10000 for n in weights):
                        template = ';grid-template-columns:' + ' '.join(f'minmax(0,{n:g}fr)' for n in weights)
                except (TypeError, ValueError):
                    _record(ctx, "segment_proportions 不是有效正数，段宽等分且原文完整保留")
            reversed_row = path == "serpentine" and not vertical and row_i % 2 == 1
            parts.append(f'<div class="sequence-row" data-reversed="{str(reversed_row).lower()}" style="--sequence-columns:{len(row)}{template}">')
            for j, unit in enumerate(row):
                index = offset + j
                icon = group_icons[index] if index < len(group_icons) else None
                omitted_icon = index + 1 in omitted_icons
                if omitted_icon:
                    icon = None
                    _record(ctx, f"{kind} 第 {index + 1} 项按 omit_icons 不放图标，保留同高无边框空白；该项仍缺合格无字素材", "asset")
                branch_map = spec.get("branch_refs", {})
                branch_refs = branch_map.get(str(index + 1), branch_map.get(index + 1)) if isinstance(branch_map, dict) else branch_map if spec.get("branch_item") == index + 1 else None
                item_placement = placement
                placements = spec.get('item_illustration_v') if orient == 'v' else None
                if placements is not None:
                    if isinstance(placements,list) and len(placements)==len(members) and all(p in ('left_inside','top_inside','none') for p in placements):
                        item_placement = placements[index]
                    elif index == 0:_record(ctx,'item_illustration_v 与实际竖版原项数/图位不符')
                if index == len(members)-1 and spec.get('last_item_illustration') in ('left_inside','none'):item_placement=spec['last_item_illustration']
                if isinstance(spec.get('_no_icons_after'),int) and index+1>spec['_no_icons_after']:icon=None
                human = index+1 in spec.get('_manual_items',[])
                options = {'name_in_card':spec.get('name_in_card',True),'icon_align':spec.get('_icon_align','center'),
                           'section_content':section_mode,'film':kind=='segmented_band' and variant=='film',
                           'native_vertical_source_arrow':orient=='v' and vertical,'status':spec.get('status')}
                if human:
                    options['manual_asset_url'] = spec.get('_manual_asset_url')
                if index+1 in station_assets:
                    if item_placement=='none' or not icon:
                        _record(ctx,f'第{index+1}工位 semantic_map 图位为none或图未消费，保留素材缺口','asset')
                    else:
                        options['station_mapped'] = _role_name(unit)
                item_vertical_flags = vertical_flags
                variants = spec.get('item_variants')
                if variants is not None:
                    if isinstance(variants,list) and len(variants)==len(members) and all(v in ('flags_connected','date_left_flags') for v in variants):
                        options['variant']=variants[index]
                        item_placement='outside'
                        item_vertical_flags=variants[index]=='date_left_flags'
                    elif index==0:_record(ctx,'item_variants 未逐项覆盖真实链或含未支持图形')
                connectors = spec.get('item_connectors')
                if connectors is not None:
                    if isinstance(connectors,list) and len(connectors)==len(members) and all(c in ('ribbon','none') for c in connectors):
                        options['connector']=connectors[index]
                    elif index==0:_record(ctx,'item_connectors未逐项覆盖真实链或含未支持线形')
                if spec.get('emphasis_item') == index+1:
                    options['emphasis_badge']=spec.get('emphasis_badge')
                if 'highlight' in block.get('spec',{}):
                    selected = index+1 in highlighted
                elif 'highlight_steps' in spec:
                    original_number = unit.get('n',index+1)
                    try: original_number = int(original_number)
                    except (TypeError,ValueError):original_number=index+1
                    selected = original_number in (spec.get('highlight_steps') or [])
                else:selected=index+1 in highlighted
                item_html = _item(unit, ctx, icon, item_placement, index, len(members), kind,
                                   selected, text_layout, outside_icon,
                                   index + 1 in optional, section, branch_refs, omitted_icon,
                                   section and vertical and spec.get("annotation_side") == "right", number_position,
                                   index + 1 in break_after, index + 1 in break_before, item_vertical_flags,options)
                has_external_branch = has_external_branch or 'sequence-main-and-branch' in item_html
                if fade_after is not None and index + 1 > fade_after:
                    item_html = item_html.replace('data-index=', 'data-muted="true" data-index=', 1)
                if index == len(members)-1 and last_marker != "none":
                    item_html = item_html.replace('data-index=', f'data-marker="{last_marker}" data-index=', 1)
                    if last_marker == "ring_question":
                        # 问号是原规格点名的图形标记，无新的文字标签。
                        symbol = ('<div class="sequence-symbol"><svg aria-hidden="true" class="deco" viewBox="0 0 32 32">'
                                  '<circle cx="16" cy="16" r="14"></circle>'
                                  '<path d="M 11 11 C 11 5 22 5 22 11 C 22 15 16 14 16 19"></path>'
                                  '<circle class="sequence-question-dot" cx="16" cy="24" r="1"></circle></svg></div>')
                        end = item_html.find('>') + 1
                        item_html = item_html[:end] + symbol + item_html[end:]
                if failure_at == index + 1:
                    symbol = ('<div class="sequence-symbol"><svg aria-hidden="true" class="sequence-failure-mark deco" viewBox="0 0 32 32">'
                              '<path d="M 8 8 L 24 24 M 24 8 L 8 24"></path></svg></div>')
                    end = item_html.find('>') + 1
                    item_html = item_html[:end] + symbol + item_html[end:]
                parts.append(item_html)
            parts.append('</div>')
            offset += len(row)
            if offset in column_ends:
                parts.append('</div><div class="sequence-chain" data-axis="vertical">')
            if hero_images and offset == hero_at:
                parts.append('</div><div class="sequence-main-art"><img src="' + escape(str(hero_images[0]), quote=True) + '" alt=""></div></div>')
            if spec.get("illustration_after_item", spec.get("decoration_after")) == offset:
                main_images = images(ctx, spec, kind="illustrations")
                if main_images:
                    parts.append('<div class="sequence-main-art"><img src="' + escape(str(main_images[0]), quote=True) + '" alt=""></div>')
                else:
                    _record(ctx, f"第 {offset} 项后的主插画缺失，保留节点顺序，尚未复现原插画", "asset")
        if section and section_mode != 'none':
            parts.append('<div class="sequence-ruler" aria-hidden="true"></div>')
        if timeline_columns > 1:
            parts.append('</div>')
        parts.append('</div>')
    if has_external_branch:
        ctx.warn('单原尾句的下方/右侧外支卡统一纳入最后验收页，待本人整体看；主说明仍完整保留')
    if spec.get('_end_asset_url'):
        parts.append('<div class="sequence-main-art sequence-end-art"><img src="'+escape(str(spec['_end_asset_url']),quote=True)+'" alt=""></div>')
    if section and section_mode == 'outside' and direction == "vertical" and spec.get("annotation_side") == "right":
        parts.append('<svg class="sequence-leaders deco" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>')
        parts.append('<script>' + _SECTION_LEADERS_JS + '</script>')
    if has_source_connectors or has_external_branch or (path == 'curved' and connector != 'none') or branches or database or (direction == "horizontal" and (path in ("serpentine","z_order") or (path == "flat" and has_horizontal_wrap and variant != "day_band")) and connector != "none") or branch_edge or branch_stub or vertical_flags or loop_at or (variant == "day_band" and direction == "horizontal"):
        marker = 'sequence-arrow-' + str(next(_EDGE_IDS))
        parts.append('<svg class="sequence-edges deco" aria-hidden="true" data-arrow="' + marker + '" xmlns="http://www.w3.org/2000/svg">'
                     '<defs><marker id="' + marker + '" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z"></path></marker></defs></svg>')
        parts.append('<script>' + _SEQUENCE_EDGES_JS + '</script>')
    parts.append('</div>')
    return _roles(''.join(parts))


def render_flow(block, ctx):
    return _render(block, ctx, "flow")


def render_timeline(block, ctx):
    return _render(block, ctx, "timeline")


def render_segmented_band(block, ctx):
    return _render(block, ctx, "segmented_band")


COMPONENTS = {
    "flow": render_flow,
    "timeline": render_timeline,
    "segmented_band": render_segmented_band,
}

# 仅声明本模块真正读取/执行的字段；frame/row/width/text_ref 等由引擎声明。
_COMMON_FIELDS = [
    "columns", "columns_v", "direction", "connector", "connector_style", "illustration", "icons", "illustrations",
    "align", "text_layout", "highlight", "optional_items", "omit_icons", "illustration_inside", "open_nodes",
    "enclosure", "header_illustration", "header_illustration_verified_no_text", "path", "snake", "stagger",
    "item_rows", "row_counts", "rows", "branch_refs", "branch_item", "branch_after", "branch_return",
    "paragraph_items", "paragraph_nodes_as_events", "attach_following_para", "group_nodes_as_steps",
    "split_inline_arrows", "segment_refs", "illustration_after_item", "decoration_after",
    "number_position", "page_break_after_item", "page_break_before_item", "part_after_steps",
    "z_order", "loop_at", "alternating", "last_marker", "fade_after",
    "turn_after", "failure_mark_at",
    "branch_direction", "icon_width", "icon_separator",
    "name_in_card", "size", "items_layout", "container", "layout_hint", "orientation", "flow_direction",
    "card_count", "item_count", "nodes", "semantic_layout", "illustration_position", "item_illustration_v",
    "human_action_items", "last_item_illustration", "row_order", "emphasis_item", "emphasis_badge",
    "item_variants", "item_connectors", "branches", "failure_branch", "status", "status_position",
    "main_illustration_position", "highlight_steps", "role_icons", "ribbon", "database_bracket", "tone", "end_illustration",
]
SPEC_FIELDS = {
    "flow": _COMMON_FIELDS + ["hero_after_item", "layout", "scale"],
    "timeline": _COMMON_FIELDS + ["split_at", "split_after", "items_per_column", "column_flow", "segments", "variant", "band_placement", "layout"],
    "segmented_band": _COMMON_FIELDS + ["variant", "layout", "segment_proportions", "annotation_side", "section_content"],
}
