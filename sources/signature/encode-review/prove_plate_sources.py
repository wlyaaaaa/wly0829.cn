"""Read original plate inputs, replay WEBP encoding, and record exact evidence.

Only writes this script's own directory. Does not execute the original builder.
"""
from __future__ import annotations

import hashlib
import io
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import PIL
from PIL import Image, features

OUT = Path(__file__).resolve().parent
TASK = OUT.parent.parent
CREATIVE = Path(r"E:\Cache\Claude\Temp\28482c99")
P1 = CREATIVE / "p1"
BASELINES = TASK / "creative-handoff/home-living/dist/assets"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def sha_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def png_signature(path: Path) -> bool:
    return path.read_bytes()[:8] == b"\x89PNG\r\n\x1a\n"


def pixel_summary(a: np.ndarray, b: np.ndarray) -> dict:
    assert a.shape == b.shape
    d = np.abs(a.astype(np.int16) - b.astype(np.int16))
    return {"equal": bool(np.array_equal(a, b)),
            "changed_pixels": int(np.any(d != 0, axis=2).sum()),
            "max_channel_difference": int(d.max()),
            "mean_channel_difference": float(d.mean())}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    original_manifest_path = P1 / "verification/assets-manifest.json"
    manifest = json.loads(original_manifest_path.read_text(encoding="utf-8-sig"))["assets"]
    config_path = P1 / "dist/hero-live.config.6a31ab346c.json"
    config = json.loads(config_path.read_text(encoding="utf-8-sig"))
    sources = {
        "plate-h-white.webp": P1 / "plates/plate-white.png",
        "plate-h-white-nobird.webp": P1 / "plates/plate-white-nobird.png",
        "plate-v-white-nobird.webp": CREATIVE / "p1v/out/plate-v-white-nobird.png",
    }

    # This is the exact alpha_composite/AFFINE construction in p1/build.py.
    # Both inputs are the original PNGs; the shipped bird WEBP is never decoded.
    idle_path = P1 / "sprites/bird-idle.png"
    place, sprite = config["portrait"]["place"], config["sprites"]["idle"]
    base = Image.open(sources["plate-v-white-nobird.webp"]).convert("RGBA")
    idle = Image.open(idle_path).convert("RGBA")
    scale = float(place["scale"]) * float(sprite["scale"])
    feet_x, feet_y = sprite["feet"]
    matrix = (1 / scale, 0, feet_x - place["x"] / scale,
              0, 1 / scale, feet_y - place["y"] / scale)
    layer = idle.transform(base.size, Image.Transform.AFFINE, matrix,
                           resample=Image.Resampling.BICUBIC)
    base.alpha_composite(layer)
    rebuilt = OUT / "plate-v-white-static-rebuilt.png"
    base.convert("RGB").save(rebuilt)
    sources["plate-v-white.webp"] = rebuilt

    records = []
    for old_name, source in sources.items():
        record = manifest[old_name]
        stem = Path(old_name).stem
        baseline_matches = list(BASELINES.glob(stem + ".*.webp"))
        assert len(baseline_matches) == 1, (stem, baseline_matches)
        baseline = baseline_matches[0]
        original_image = Image.open(source).convert("RGB")
        encoded = io.BytesIO()
        original_image.save(encoded, "WEBP", quality=93, method=6, exact=True)
        replay_bytes = encoded.getvalue()
        replay_pixels = np.array(Image.open(io.BytesIO(replay_bytes)).convert("RGB"))
        baseline_pixels = np.array(Image.open(baseline).convert("RGB"))
        source_pixels = np.array(original_image)
        replay_sha = sha_bytes(replay_bytes)
        baseline_sha = sha(baseline)
        records.append({
            "old_name": old_name,
            "source_path": str(source),
            "source_sha256": sha(source),
            "source_sha256_recorded_by_original_pipeline": record["source_sha256"],
            "source_sha_matches_original_pipeline": sha(source) == record["source_sha256"],
            "source_is_png_by_signature": png_signature(source),
            "source_mode": Image.open(source).mode,
            "source_dimensions": list(original_image.size),
            "rebuilt_from_original_png_inputs": old_name == "plate-v-white.webp",
            "baseline_path": str(baseline),
            "baseline_bytes": baseline.stat().st_size,
            "baseline_sha256": baseline_sha,
            "baseline_sha_matches_original_pipeline": baseline_sha == record["sha256"],
            "baseline_webp_chunk": baseline.read_bytes()[12:16].decode("ascii"),
            "replayed_bytes": len(replay_bytes),
            "replayed_sha256": replay_sha,
            "encoded_sha_equal": replay_sha == baseline_sha,
            "encoded_bytes_equal": replay_bytes == baseline.read_bytes(),
            "decoded_replay_vs_baseline": pixel_summary(replay_pixels, baseline_pixels),
            "source_vs_decoded_baseline": pixel_summary(source_pixels, baseline_pixels),
            "original_declared_quality": record["quality"],
        })
    inputs = [P1 / "build.py", original_manifest_path, config_path, idle_path]
    result = {
        "schema": "home-bio.plate-source-proof.v1",
        "observed_at_beijing": datetime.now(timezone(timedelta(hours=8))).isoformat(),
        "python": sys.version,
        "pillow": PIL.__version__,
        "libwebp": features.version("webp"),
        "encoder": "Pillow Image.save WEBP / libwebp",
        "original_parameters": {"quality": 93, "method": 6, "exact": True,
                                "lossless": False, "input_mode": "RGB"},
        "original_source_and_encoder_records": [{"path": str(p), "sha256": sha(p)} for p in inputs],
        "vertical_reconstruction": {"idle_source_path": str(idle_path),
                                    "idle_source_sha256": sha(idle_path),
                                    "matrix": list(matrix), "place": place, "sprite": sprite,
                                    "method": "original PNG idle AFFINE BICUBIC + RGBA alpha_composite + RGB"},
        "items": records,
        "all_baselines_reproduced_sha256": all(i["encoded_sha_equal"] for i in records),
        "all_baselines_reproduced_decoded_pixels": all(i["decoded_replay_vs_baseline"]["equal"] for i in records),
        "all_source_png_hashes_match_original_pipeline": all(i["source_sha_matches_original_pipeline"] for i in records),
    }
    (OUT / "plate-source-proof.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: result[k] for k in ("all_baselines_reproduced_sha256", "all_baselines_reproduced_decoded_pixels", "all_source_png_hashes_match_original_pipeline")}, ensure_ascii=False))
    for i in records:
        print(i["old_name"], i["baseline_bytes"], i["source_sha_matches_original_pipeline"], i["encoded_sha_equal"], i["decoded_replay_vs_baseline"])


if __name__ == "__main__":
    main()
