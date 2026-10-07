"""Build external production assets and the double-clickable offline preview.

All landscape inputs come from this task copy. The optional portrait inputs are
the sibling task's two named deliverables; no website checkout is read.
"""
from __future__ import annotations

import argparse
import base64
import copy
import hashlib
import html
import json
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
ASSET_DIR = DIST / "assets"
OUT = ROOT / "out"
VERIFY = ROOT / "verification"
PORTRAIT_OUT = ROOT.parent / "p1v" / "out"
PLATE_QUALITY = 93
SPRITE_QUALITY = 90
POSES = ("idle", "look", "tilt", "preen", "crouch", "hop", "hop2", "sing", "sleep")
DEFAULT_GEOM = {
    "scr": [[1653, 761], [2321, 769], [2311, 1138], [1641, 1099]],
    "pc": [2396, 713, 2857, 1256],
    "fan": [2480, 880],
}


def dump_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def local_path(value: str | Path) -> Path:
    """Keep build inputs inside the explicitly supplied task copy."""
    path = Path(value)
    path = (ROOT / path if not path.is_absolute() else path).resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError(f"Input is outside the task copy: {path}")
    return path


def data_url(path: Path, mime="image/webp") -> str:
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def write_webp(source: Path, filename: str, quality: int, records: dict, previous: dict) -> tuple[int, int]:
    destination = ASSET_DIR / filename
    source_hash = sha256(source)
    previous_record = previous.get(filename, {})
    with Image.open(source) as original:
        size = original.size
        has_alpha = "A" in original.getbands() or "transparency" in original.info
        if (not destination.exists() or previous_record.get("source_sha256") != source_hash
                or previous_record.get("quality") != quality
                or previous_record.get("sha256") != sha256(destination)):
            image = original.convert("RGBA" if has_alpha else "RGB")
            # WebP's alpha channel is lossless; only the colour plane is compressed.
            image.save(destination, "WEBP", quality=quality, method=6, exact=True)
    records[filename] = {
        "source": str(source), "source_sha256": source_hash, "quality": quality,
        "width": size[0], "height": size[1], "alpha": has_alpha,
        "bytes": destination.stat().st_size, "sha256": sha256(destination),
    }
    return size


def sprite_metadata(meta_path: Path, records: dict, previous: dict) -> tuple[dict, dict]:
    meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
    sprites = {}
    entries = meta.get("sprites", meta.get("poses", {}))
    for name in POSES:
        if name not in entries:
            raise ValueError(f"Missing bird pose: {name}")
        entry = entries[name]
        # The copied legacy JSON still has a dir pointing to sample. Resolve files
        # beside the selected metadata, never through that stale directory.
        source = local_path(meta_path.parent / entry["file"])
        w, h = write_webp(source, f"bird-{name}.webp", SPRITE_QUALITY, records, previous)
        declared_w, declared_h = entry.get("width", w), entry.get("height", h)
        if (declared_w, declared_h) != (w, h):
            raise ValueError(f"Pose size differs from metadata: {name}")
        anchor = entry.get("feet")
        if anchor is None:
            anchor = [entry["foot_anchor"]["x"], entry["foot_anchor"]["y"]]
        sprite = {"src": f"assets/bird-{name}.webp", "w": w, "h": h,
                  "feet": anchor, "scale": entry.get("scale", entry.get("scale_relative_to_idle", 1))}
        eye = entry.get("eye", entry.get("eye_center"))
        if eye is not None:
            sprite["eye"] = [eye["x"], eye["y"]] if isinstance(eye, dict) else eye
        sprites[name] = sprite
    place = meta.get("place")
    if place is None:
        idle = meta.get("idle_placement", {})
        anchor = idle.get("foot_anchor", {})
        place = {"x": anchor.get("x", 1440), "y": anchor.get("y", 808), "scale": idle.get("scale", 1)}
    return sprites, place


def portrait_layout(meta_path: Path, sprites: dict, records: dict, previous: dict) -> dict | None:
    plate_path = PORTRAIT_OUT / "plate-v-white-nobird.png"
    geom_path = PORTRAIT_OUT / "geom-v.json"
    if not plate_path.exists() or not geom_path.exists():
        return None
    raw = json.loads(geom_path.read_text(encoding="utf-8-sig"))
    if raw.get("status") in {"in_progress", "draft", "pending"}:
        print("Portrait deliverables are still being prepared; keeping landscape available.", flush=True)
        return None
    geom = copy.deepcopy(raw.get("geom", raw))
    # Accept the sibling task's documented measurement format as well as the
    # engine-native scr/pc/fan format, preserving its other measured regions.
    geom.setdefault("scr", raw.get("monitor", {}).get("screen_corners"))
    geom.setdefault("pc", raw.get("case", {}).get("bbox_xyxy"))
    fan = raw.get("case", {}).get("fan_center", raw.get("fan"))
    if fan is None and raw.get("fans"):
        fan = raw["fans"][0]["center"]
    if isinstance(fan, dict):
        fan = fan.get("center", fan)
        if isinstance(fan, dict) and "x" in fan:
            fan = [fan["x"], fan["y"]]
    geom.setdefault("fan", fan)
    bird = raw.get("bird", {})
    place = raw.get("place", bird.get("place"))
    source_meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
    idle_file = source_meta.get("sprites", source_meta.get("poses", {}))["idle"]["file"]
    idle_path = local_path(meta_path.parent / idle_file)
    if place is None and bird.get("animation_anchor_suggestion"):
        anchor = bird["animation_anchor_suggestion"]
        place = {"x": anchor[0], "y": anchor[1]}
        target = bird["bbox_xyxy"]
        with Image.open(idle_path) as idle_image:
            visible = idle_image.convert("RGBA").getchannel("A").point(lambda alpha: 255 if alpha >= 16 else 0).getbbox()
        sprite_scale = float(sprites["idle"]["scale"])
        visible_width, visible_height = visible[2] - visible[0], visible[3] - visible[1]
        target_width, target_height = target[2] - target[0], target[3] - target[1]
        # Keep the approved idle pose's proportions and match the measured bird's
        # visible bounding-box area. This derives ~0.76 without stretching it.
        place["scale"] = math.sqrt(target_width * target_height / (visible_width * visible_height)) / sprite_scale
        dump_json(VERIFY / "portrait-placement.json", {
            "method": "uniform scale matching measured original bird bbox area to idle visible-alpha bbox",
            "alpha_threshold": 16, "idle_alpha_bbox": visible, "original_bird_bbox": target,
            "sprite_scale": sprite_scale, "place": place,
            "visible_size_at_scale": [visible_width * sprite_scale * place["scale"], visible_height * sprite_scale * place["scale"]],
            "geometry_source": str(geom_path), "geometry_sha256": sha256(geom_path),
        })
    if place is None and bird.get("foot_anchor"):
        anchor = bird["foot_anchor"]
        place = {"x": anchor[0], "y": anchor[1]} if isinstance(anchor, list) else dict(anchor)
        place["scale"] = bird.get("scale", 1)
    if place is None or any(geom.get(key) is None for key in ("scr", "pc", "fan")):
        raise ValueError("Portrait deliverables need measured scr, pc, fan and bird place before packaging")
    place.setdefault("scale", 1)
    width, height = write_webp(plate_path, "plate-v-white-nobird.webp", PLATE_QUALITY, records, previous)
    source_size = raw.get("source", {})
    if source_size.get("width") is not None and (source_size["width"], source_size["height"]) != (width, height):
        raise ValueError("Portrait geometry dimensions do not match its plate")
    # Put the approved original idle pose into the static fallback at precisely
    # the same pixel anchor and scale used by the live engine. No image is drawn.
    with Image.open(plate_path) as plate_image, Image.open(idle_path) as idle_image:
        base = plate_image.convert("RGBA")
        idle = idle_image.convert("RGBA")
        sprite = sprites["idle"]
        scale = float(place["scale"]) * float(sprite["scale"])
        if scale <= 0:
            raise ValueError("Portrait idle scale must be positive")
        feet_x, feet_y = sprite["feet"]
        matrix = (1 / scale, 0, feet_x - place["x"] / scale,
                  0, 1 / scale, feet_y - place["y"] / scale)
        bird_layer = idle.transform(base.size, Image.Transform.AFFINE, matrix, resample=Image.Resampling.BICUBIC)
        base.alpha_composite(bird_layer)
        work = VERIFY / "assets-work"
        work.mkdir(parents=True, exist_ok=True)
        baked = work / "plate-v-white-static.png"
        base.convert("RGB").save(baked)
    write_webp(baked, "plate-v-white.webp", PLATE_QUALITY, records, previous)
    return {"width": width, "height": height, "plate": "assets/plate-v-white.webp",
            "plateNoBird": "assets/plate-v-white-nobird.webp", "geom": geom, "place": place}


def package_assets(meta_path: Path) -> dict:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    VERIFY.mkdir(parents=True, exist_ok=True)
    manifest_path = VERIFY / "assets-manifest.json"
    previous = json.loads(manifest_path.read_text(encoding="utf-8")).get("assets", {}) if manifest_path.exists() else {}
    records = {}
    width, height = write_webp(ROOT / "plates" / "plate-white.png", "plate-h-white.webp", PLATE_QUALITY, records, previous)
    nb_size = write_webp(ROOT / "plates" / "plate-white-nobird.png", "plate-h-white-nobird.webp", PLATE_QUALITY, records, previous)
    if nb_size != (width, height):
        raise ValueError("Landscape plate and birdless plate have different dimensions")
    sprites, place = sprite_metadata(meta_path, records, previous)
    geom = dict(DEFAULT_GEOM)
    geom.update(json.loads((ROOT / "geom-white.json").read_text(encoding="utf-8-sig")))
    landscape = {"width": width, "height": height, "plate": "assets/plate-h-white.webp",
                 "plateNoBird": "assets/plate-h-white-nobird.webp", "geom": geom, "place": place}
    portrait = portrait_layout(meta_path, sprites, records, previous)
    config = {"speed": 2.5, "landscape": landscape, "portrait": portrait, "sprites": sprites}
    dump_json(DIST / "hero-live.config.json", config)
    sprite_bytes = sum(record["bytes"] for name, record in records.items() if name.startswith("bird-"))
    dump_json(manifest_path, {"assets": records, "sprites_bytes": sprite_bytes,
                             "portrait_available": portrait is not None,
                             "source_scope": "landscape and sprites: current p1 copy; portrait: p1v/out named deliverables"})
    print(f"Packaged {len(records)} assets; nine bird poses: {sprite_bytes:,} bytes; portrait: {portrait is not None}", flush=True)
    return config


def inline_config(config: dict) -> dict:
    inline = copy.deepcopy(config)
    for orientation in ("landscape", "portrait"):
        layout = inline.get(orientation)
        if layout:
            for key in ("plate", "plateNoBird"):
                layout[key] = data_url(DIST / layout[key])
    for sprite in inline["sprites"].values():
        sprite["src"] = data_url(DIST / sprite["src"])
    return inline


def build_preview(config: dict) -> Path:
    template = (ROOT / "template.html").read_text(encoding="utf-8-sig")
    required = ("/*__HERO_CSS__*/", "/*__HERO_ENGINE__*/", "/*__CONFIG__*/null")
    missing = [token for token in required if token not in template]
    if missing:
        raise ValueError("The shared-engine preview template is not ready; missing: " + ", ".join(missing)
                         + ". Assets are ready; use --assets-only until template replacement is complete.")
    inline = inline_config(config)
    css = (DIST / "hero-live.css").read_text(encoding="utf-8-sig")
    engine = (DIST / "hero-live.js").read_text(encoding="utf-8-sig")
    preview_video = {"src": "../src/hero-64ed36342c7b310c-e181492b.mp4",
                     "mask": "../src/hero-64ed36342c7b310c-e181492b-mask.png"}
    replacements = {
        "/*__HERO_CSS__*/": css,
        "/*__HERO_ENGINE__*/": engine,
        "/*__CONFIG__*/null": json.dumps(inline, ensure_ascii=False).replace("</", "<\\/"),
        "/*__PLATE_H__*/": html.escape(inline["landscape"]["plate"], quote=True),
        "/*__PLATE_V__*/": html.escape((inline.get("portrait") or inline["landscape"])["plate"], quote=True),
        "/*__PREVIEW_VIDEO__*/null": json.dumps(preview_video, ensure_ascii=False),
        "/*__ASPECT_V__*/": f'{(inline.get("portrait") or inline["landscape"])["width"]}/{(inline.get("portrait") or inline["landscape"])["height"]}',
        "/*__VIDEO__*/": preview_video["src"],
        "/*__MASK__*/": preview_video["mask"],
    }
    for token, replacement in replacements.items():
        template = template.replace(token, replacement)
    OUT.mkdir(parents=True, exist_ok=True)
    output = OUT / "活的那幅画-小样.html"
    output.write_text(template, encoding="utf-8")
    print(f"Wrote {output} ({output.stat().st_size:,} bytes)", flush=True)
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--meta", default="sprites/bird.json", help="metadata path inside this task copy")
    parser.add_argument("--assets-only", action="store_true", help="package assets and config while the preview template is being integrated")
    parser.add_argument("--no-assets", action="store_true", help="rebuild only the preview from the existing dist config and engine")
    args = parser.parse_args()
    config = json.loads((DIST / "hero-live.config.json").read_text(encoding="utf-8")) if args.no_assets else package_assets(local_path(args.meta))
    if not args.assets_only:
        build_preview(config)


if __name__ == "__main__":
    main()

