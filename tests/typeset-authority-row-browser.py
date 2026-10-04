"""Check taller authority rows move the complete following content; no page capture."""
import argparse
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright


async def run(args):
    root = Path(__file__).resolve().parents[1]
    source = (root / 'scripts/typeset-layout.js').read_text('utf8')
    helper = source[source.index('/* typeset-live-flow-v1 */'):source.index('/* end-typeset-live-flow-v1 */')]
    css = (root / 'scripts/typeset-layout.css').read_text('utf8')
    args.temp.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as runtime:
        browser = await runtime.chromium.launch_persistent_context(
            str(args.temp), executable_path=str(args.chrome), headless=True,
            viewport={'width': 412, 'height': 915}, device_scale_factor=3.5,
            is_mobile=True, has_touch=True)
        page = await browser.new_page()
        await page.set_content('<!doctype html><style>' + css + '</style><div class="typeset-part" id="host" style="width:400px"><picture><img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'400\' height=\'600\' fill=\'white\'/%3E%3C/svg%3E"></picture><div class="overlays"></div></div>')
        await page.add_script_tag(content=helper)
        result = await page.evaluate('''() => {
          const host=document.querySelector('#host');host._layout={size:[400,600]};
          const overlay=host.querySelector('.overlays'),landmarks=[];
          for(const x of [.01,.25,.75]){const node=document.createElement('a');node.href='#legend';node._sourceRect=[x,.7,.2,.05];overlay.append(node);landmarks.push(node);}
          const node=document.createElement('div'),content=document.createElement('div');content.style.height='180px';content.textContent='Synthetic taller status card';node.append(content);overlay.append(node);
          const state=TypesetLiveFlow.apply(host,[{node,rect:[.05,.3,.9,.1],forceOverlay:true,flowRow:true}]);
          const before=landmarks.map(n=>n.getBoundingClientRect().top);
          content.style.height='300px';TypesetLiveFlow.apply(host,state.cells);
          const after=landmarks.map(n=>n.getBoundingClientRect().top);
          return {column:!!state.column,row:state.bands.some(b=>b.row),before,after,shifts:after.map((v,i)=>v-before[i]),allConnected:landmarks.every(n=>n.isConnected),source:state.tiles.every(t=>t.image.src===host.querySelector('picture img').src)};
        }''')
        assert result['row'] and not result['column'], result
        assert max(result['before']) - min(result['before']) < 1, result
        assert max(result['after']) - min(result['after']) < 1, result
        assert all(abs(delta - 120) < 1 for delta in result['shifts']), result
        assert result['allConnected'] and result['source'], result
        # An old producer has no plain marker. False keeps its source band;
        # true uses the bounded compact-frame path for an admitted new marker.
        compact = await page.evaluate('''() => {
          const host=document.querySelector('#host'),node=host.querySelector('.typeset-live-flow-cards>div');
          const old=TypesetLiveFlow.apply(host,[{node,rect:[.05,.3,.9,.05],compactFrame:false}]);
          const retained=old.tiles.some(t=>t.masked.length===1);
          const next=TypesetLiveFlow.apply(host,[{node,rect:[.05,.3,.9,.05],compactFrame:true}]);
          return {retained,compact:next.bands.every(b=>b.compact),unmasked:next.tiles.every(t=>!t.masked.length)};
        }''')
        assert compact == {'retained': True, 'compact': True, 'unmasked': True}, compact
        print({'fixture_only': True, 'row_growth': result, 'explicit_compact_only': compact, 'screenshots': 0})
        await browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--chrome', type=Path, default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--temp', type=Path, required=True)
    asyncio.run(run(parser.parse_args()))
