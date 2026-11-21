#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .local
# Separate fixture: preserve the recovered development sample camera files.
ffmpeg -hide_banner -loglevel error -loop 1 -i public/targets/poster.png -t 12 -vf 'scale=-2:660,pad=960:720:(ow-iw)/2:(oh-ih)/2:color=white' -r 10 -pix_fmt yuv420p .local/poster-target.y4m -y
ffmpeg -hide_banner -loglevel error -f lavfi -i color=white:s=960x720:r=10 -t 6 -pix_fmt yuv420p .local/poster-blank.y4m -y
python3 - <<'PY'
from pathlib import Path
p = Path('.local')
header, frames = (p / 'poster-target.y4m').read_bytes().split(b'\n', 1)
blank = (p / 'poster-blank.y4m').read_bytes().split(b'\n', 1)[1]
(p / 'poster-tracking-test.y4m').write_bytes(header + b'\n' + frames + blank + frames + blank)
PY
