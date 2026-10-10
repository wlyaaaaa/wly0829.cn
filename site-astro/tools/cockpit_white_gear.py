"""将审定白色主图接入保留的驾驶舱；只改原图的颜色差与纹理引用。"""
import hashlib
import html
import json
import re
import shutil
from pathlib import Path
import numpy as np
from PIL import Image


def build(public, cockpit):
    public, cockpit = Path(public), Path(cockpit)
    text = cockpit.read_text(encoding="utf-8")
    head = re.search(r'<section\b[^>]*\bid="cockpit-01"[^>]*>', text)[0]
    binding = json.loads(html.unescape(re.search(r'data-living-binding="([^"]+)"', head)[1]))
    config_url = re.search(r'data-living-config="([^"]+)"', head)[1]
    config = json.loads((public / config_url.lstrip("/")).read_text(encoding="utf-8"))
    source = Path(__file__).resolve().parents[2] / "sources/assets/_library/illustrations/ill-53b8c5c622e8b9.png"
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    result = {"source": source.relative_to(Path(__file__).resolve().parents[2]).as_posix(), "sha256": digest}
    if all(config[o]["source_sha256"] == digest for o in binding):
        return result
    texture_url = f"/_living/_textures/{digest}.png"
    (public / texture_url.lstrip("/")).parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, public / texture_url.lstrip("/"))
    new = Image.open(source).convert("RGBA")
    for orientation, item in binding.items():
        cfg = config[orientation]
        old = Image.open(public / cfg["texture"]["src"].lstrip("/")).convert("RGBA")
        if old.size != new.size or old.getchannel("A").tobytes() != new.getchannel("A").tobytes():
            raise ValueError("驾驶舱换色图的尺寸或透明度与原图不同，不能原位换色")
        crop = tuple(round(v * old.size[i % 2]) for i, v in enumerate(cfg["texture"]["box"]))
        x, y, w, h = [round(v * item["size"][i % 2]) for i, v in enumerate(item["rect"])]
        patches = []
        for image in (old, new):
            flat = Image.new("RGBA", image.size, "white")
            flat.alpha_composite(image)
            patches.append(np.asarray(flat.crop(crop).convert("RGB").resize((w, h), Image.Resampling.LANCZOS), dtype=np.int16))
        image_path = public / item["src"].lstrip("/")
        screen = Image.open(image_path).convert("RGB")
        pixels = np.asarray(screen.crop((x, y, x + w, y + h)), dtype=np.int16)
        screen.paste(Image.fromarray(np.clip(pixels + patches[1] - patches[0], 0, 255).astype(np.uint8)), (x, y))
        target = image_path.with_name(image_path.stem + "-white-" + digest[:12] + ".png")
        screen.save(target)
        text = text.replace(item["src"], "/" + target.relative_to(public).as_posix())
        text = text.replace(item["source_sha256"], digest)
        cfg["texture"]["src"], cfg["source_sha256"] = texture_url, digest
    target = public / config_url.lstrip("/")
    target = target.with_name("config-white-" + digest[:12] + ".json")
    target.write_text(json.dumps(config, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    cockpit.write_text(text.replace(config_url, "/" + target.relative_to(public).as_posix()), encoding="utf-8", newline="")
    return result


if __name__ == "__main__":
    import sys
    print(build(sys.argv[1], sys.argv[2]))
