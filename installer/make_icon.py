"""
make_icon.py  —  يحوّل logo.png إلى icon.ico بالأحجام المطلوبة لـ Windows
الاستخدام: python make_icon.py [logo.png]
يتطلب: pip install Pillow
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("تثبيت Pillow أولاً:  pip install Pillow")
    sys.exit(1)

# Windows icon sizes required for professional EXE icons
ICO_SIZES = [256, 128, 64, 48, 32, 16]

def make_ico(src: Path, dst: Path) -> None:
    img = Image.open(src).convert("RGBA")

    # Square-crop if not square
    w, h = img.size
    if w != h:
        side = min(w, h)
        left = (w - side) // 2
        top  = (h - side) // 2
        img  = img.crop((left, top, left + side, top + side))

    frames = []
    for size in ICO_SIZES:
        resized = img.resize((size, size), Image.LANCZOS)
        frames.append(resized)

    # Save as multi-resolution ICO
    frames[0].save(
        dst,
        format="ICO",
        sizes=[(f.width, f.height) for f in frames],
        append_images=frames[1:]
    )
    print(f"تم إنشاء: {dst}  ({', '.join(str(s) for s in ICO_SIZES)} px)")

if __name__ == "__main__":
    src_name = sys.argv[1] if len(sys.argv) > 1 else "logo.png"
    src = Path(__file__).parent / src_name
    dst = Path(__file__).parent / "icon.ico"

    if not src.exists():
        print(f"الملف غير موجود: {src}")
        print("ضع شعار المشروع (PNG) في مجلد installer/ باسم logo.png")
        sys.exit(1)

    make_ico(src, dst)
