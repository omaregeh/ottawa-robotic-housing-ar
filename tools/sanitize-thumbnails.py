#!/usr/bin/env python3
"""Remove generated PNG text/EXIF metadata without changing pixels or compressed IDAT data."""
from pathlib import Path
import struct,shutil
root=Path(__file__).resolve().parents[1]
count=0
for p in (root/'reports/thumbnails').glob('*.png'):
 raw=p.read_bytes();out=raw[:8];offset=8;removed=0
 while offset<len(raw):
  n=struct.unpack_from('>I',raw,offset)[0];kind=raw[offset+4:offset+8];chunk=raw[offset:offset+12+n];offset+=12+n
  if kind in (b'tEXt',b'zTXt',b'iTXt',b'eXIf'):removed+=1
  else:out+=chunk
 if removed:
  backup=root/'.local/pre-publication-metadata'/p.relative_to(root);backup.parent.mkdir(parents=True,exist_ok=True)
  if not backup.exists():shutil.copyfile(p,backup)
  p.write_bytes(out);count+=1
print(f'Sanitized metadata in {count} PNGs; image pixels and IDAT chunks preserved.')
