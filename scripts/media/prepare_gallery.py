#!/usr/bin/env python3
"""Prepare a privacy-safe, responsive photo gallery for the public NAS folder."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
TARGET_WIDTHS = (480, 960, 1600)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "photo"


def digest_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def discover_images(source: Path) -> list[Path]:
    return sorted(
        path
        for path in source.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def prepare_photo(
    source: Path,
    public_root: Path,
    event_slug: str,
    event_title: str,
    credit: str,
    index: int,
    digest: str,
) -> dict:
    filename = f"{slugify(source.stem)}-{digest[:10]}.webp"
    variants: list[dict] = []

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "transparency" in image.info else "RGB")

        original_width, original_height = image.size
        created_widths: set[int] = set()

        for requested_width in TARGET_WIDTHS:
            output_width = min(requested_width, original_width)
            if output_width in created_widths:
                continue
            created_widths.add(output_width)

            output_height = max(1, round(original_height * output_width / original_width))
            resized = image if output_width == original_width else image.resize(
                (output_width, output_height), Image.Resampling.LANCZOS
            )
            relative_path = Path("events") / event_slug / str(output_width) / filename
            output_path = public_root / relative_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            resized.save(output_path, "WEBP", quality=82, method=6)
            variants.append(
                {
                    "path": relative_path.as_posix(),
                    "width": output_width,
                    "height": output_height,
                }
            )

    primary = variants[-1]
    photo = {
        "path": primary["path"],
        "width": primary["width"],
        "height": primary["height"],
        "alt": f"{event_title} event photograph {index}",
        "variants": [
            {"path": variant["path"], "width": variant["width"]}
            for variant in variants
        ],
    }
    if credit:
        photo["credit"] = credit
    return photo


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create WebP gallery variants and a JSON manifest for the UGREEN public folder."
    )
    parser.add_argument("--source", required=True, type=Path, help="Folder containing approved source images")
    parser.add_argument("--nas-root", required=True, type=Path, help="BachataExplosion NAS staging root")
    parser.add_argument("--event", required=True, help="Event slug, for example role-rotation-2026")
    parser.add_argument("--title", required=True, help="Human-readable event title")
    parser.add_argument("--credit", default="", help="Optional photographer credit")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source = args.source.resolve()
    nas_root = args.nas_root.resolve()
    event_slug = slugify(args.event)

    if not source.is_dir():
        raise SystemExit(f"Source folder does not exist: {source}")

    public_root = nas_root / "Public"
    manifest_root = public_root / "manifests"
    manifest_root.mkdir(parents=True, exist_ok=True)

    candidates = discover_images(source)
    seen_digests: set[str] = set()
    photos: list[dict] = []
    duplicates = 0

    for path in candidates:
        digest = digest_file(path)
        if digest in seen_digests:
            duplicates += 1
            continue
        seen_digests.add(digest)
        try:
            photos.append(
                prepare_photo(
                    path,
                    public_root,
                    event_slug,
                    args.title,
                    args.credit.strip(),
                    len(photos) + 1,
                    digest,
                )
            )
        except (OSError, ValueError) as error:
            print(f"Skipped unreadable image {path}: {error}")

    manifest = {
        "version": 1,
        "event": event_slug,
        "title": args.title,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "photos": photos,
    }
    manifest_path = manifest_root / f"{event_slug}.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Prepared {len(photos)} photographs for {event_slug}")
    print(f"Skipped {duplicates} exact duplicates")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
