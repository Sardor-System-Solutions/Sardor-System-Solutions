#!/usr/bin/env python3
"""Turn raw captures in assets/screenshots/ into the images the site serves.

Three passes:

1. Crop off the browser chrome (tab strip, address bar, bookmarks bar) by
   finding the first row that is not predominantly dark.
2. Blur any region holding personal data. The Oson Uy CRM capture is a real
   developer's workspace, so the client column — names and phone numbers — is
   redacted before the image is ever published.
3. Resample to 2000px wide and write to public/work/.

Run:  python3 scripts/prepare-screenshots.py
Needs Pillow.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "screenshots"
OUT = ROOT / "public" / "work"

TARGET_W = 2000
BLUR_RADIUS = 12

# Regions to redact, in final (post-resize) pixel coordinates.
# left, top, right, bottom
REDACTIONS: dict[str, list[tuple[int, int, int, int]]] = {
    # The "Mijoz" column of the recent-applications table: client names and
    # phone numbers. Everything else in the shot is the product's own chrome.
    "dashboard": [(470, 595, 735, 1091)],
}


def chrome_height(image: Image.Image) -> int:
    """First row below the dark browser chrome."""
    rgb = image.convert("RGB")
    width, height = rgb.size
    step = max(1, width // 120)
    for y in range(0, min(height, 600)):
        row = [rgb.getpixel((x, y)) for x in range(0, width, step)]
        dark = sum(1 for r, g, b in row if r < 90 and g < 90 and b < 90)
        if dark / len(row) < 0.6:
            return y
    return 0


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for source in sorted(SRC.glob("*.png")):
        name = source.stem
        image = Image.open(source)

        top = chrome_height(image)
        cropped = image.crop((0, top, image.width, image.height))

        scale = TARGET_W / cropped.width
        resized = cropped.resize(
            (TARGET_W, round(cropped.height * scale)), Image.LANCZOS
        ).convert("RGB")

        for box in REDACTIONS.get(name, []):
            box = (
                max(0, box[0]),
                max(0, box[1]),
                min(resized.width, box[2]),
                min(resized.height, box[3]),
            )
            region = resized.crop(box).filter(ImageFilter.GaussianBlur(BLUR_RADIUS))
            resized.paste(region, box)

        destination = OUT / f"{name}.png"
        resized.save(destination, optimize=True)

        note = f" redacted {len(REDACTIONS.get(name, []))} region(s)" if name in REDACTIONS else ""
        print(
            f"{name}: chrome {top}px -> {resized.size[0]}x{resized.size[1]}, "
            f"{destination.stat().st_size // 1024} KB{note}"
        )


if __name__ == "__main__":
    main()
