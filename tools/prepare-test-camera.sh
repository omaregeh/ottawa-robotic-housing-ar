#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .local
# Synthetic test fixture only. The product renders actual 3D GLBs at runtime.
ffmpeg -hide_banner -loglevel error -loop 1 -i public/targets/development.png -t 12 -vf 'scale=560:-2,pad=640:480:(ow-iw)/2:(oh-ih)/2:color=white' -r 10 -pix_fmt yuv420p .local/target.y4m -y
ffmpeg -hide_banner -loglevel error -f lavfi -i color=white:s=640x480:r=10 -t 6 -pix_fmt yuv420p .local/blank.y4m -y
python3 - <<'PY'
from pathlib import Path
p=Path('.local');header,frames=(p/'target.y4m').read_bytes().split(b'\n',1);blank=(p/'blank.y4m').read_bytes().split(b'\n',1)[1]
(p/'tracking-test.y4m').write_bytes(header+b'\n'+frames+blank+frames+blank)
PY
