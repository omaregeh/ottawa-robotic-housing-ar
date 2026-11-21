"""Preserve the recovered, already-scannable poster and make a Letter print PDF.

Usage: python tools/prepare-poster.py /path/to/source.png
Requires Pillow, reportlab and zxing-cpp (the recovered .local/poster-venv works).
"""
import hashlib
import json
from pathlib import Path
import shutil
import sys

from PIL import Image
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import zxingcpp

URL = "https://omaregeh.github.io/ottawa-robotic-housing-ar/"
source = Path(sys.argv[1]).resolve()
target = Path("public/targets/poster.png")
pdf = Path("public/print/ottawa-housing-poster-letter.pdf")
assert source != target.resolve(), "Use the preserved source, not the output path."
original = source.read_bytes()
image = Image.open(source)
codes = [r.text for r in zxingcpp.read_barcodes(image)]
assert codes == [URL], f"Source QR must open the production website: {codes}"
target.parent.mkdir(parents=True, exist_ok=True)
pdf.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(source, target)

# Preserve aspect ratio, with at least 1/4 inch of white margin on US Letter.
width, height = letter
margin = 18
scale = min((width - 2 * margin) / image.width, (height - 2 * margin) / image.height)
draw_width, draw_height = image.width * scale, image.height * scale
doc = canvas.Canvas(str(pdf), pagesize=letter, invariant=1)
doc.setTitle("Building Ottawa's Future - AR poster")
doc.setAuthor("Ottawa Housing Futures")
doc.drawImage(ImageReader(image), (width - draw_width) / 2, (height - draw_height) / 2,
              width=draw_width, height=draw_height)
doc.showPage()
doc.save()
assert source.read_bytes() == original, "Source poster must remain unchanged."
metadata = {
    "sourceFilename": source.name,
    "sourceSha256": hashlib.sha256(original).hexdigest(),
    "image": "targets/poster.png",
    "imageSha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    "width": image.width, "height": image.height,
    "qrURL": URL, "qrRecoveredAlreadyValid": True,
    "pdf": "print/ottawa-housing-poster-letter.pdf",
    "pdfSha256": hashlib.sha256(pdf.read_bytes()).hexdigest(),
    "printPage": "US Letter, portrait, fit artwork without cropping, minimum 0.25 inch margins",
    "artworkPPI": round(72 / scale, 1),
    "trackingTarget": "targets/poster.mind", "targetIndex": 0,
    "compiler": "mind-ar 1.2.5 browser Compiler, format v2",
    "notes": "PNG is byte-identical to the recovered source. Compile the entire image, including its existing QR. Corner symbols are decorative; MindAR tracks image features."
}
Path("public/targets/poster.json").write_text(json.dumps(metadata, indent=2) + "\n")
print(json.dumps(metadata, indent=2))
