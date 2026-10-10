"""旧构图的绝对路径在原临时目录不存在时仍取仓库里的同一张图。"""
import sys
from pathlib import Path
from types import SimpleNamespace
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src/typeset"))
from engine import assets
from engine.registry import load
load()
images = sys.modules["components_comp-diagram._shared"].images
ctx = SimpleNamespace(icons=lambda: [], page={}, screen={"id": "agents-02"},
                      warn=lambda message: None, asset_url=assets.url)
paths = [f"Z:/missing/typeset-proto/assets/a02-ic{i}.png" for i in range(1, 6)]
assert all(not Path(path).exists() for path in paths)
assert images(ctx, {"icons": paths}) == [assets.url(str(Path(assets.PROTO_ASSETS) / f"a02-ic{i}.png")) for i in range(1, 6)]
assert images(ctx, {"icons": ["Z:/missing/icon.png"]}) == []
print("步骤卡路径迁移回归通过：5 张图按原顺序返回，真正缺失的图仍不猜")
