#!/usr/bin/env bash
# Stage one ad as its own HyperFrames project.
# Usage: ./stage.sh <ad-file-without-.html> <audio-name> [4x5]
#   default -> .build/<name>/ (1080x1920); with 4x5 -> .build/<name>-4x5/ (1080x1350, content zoomed to fit)
set -euo pipefail
cd "$(dirname "$0")"
n="$1"; a="$2"; v="${3:-}"
d=".build/$n${v:+-$v}"
rm -rf "$d"; mkdir -p "$d/assets/audio"
cp -r assets/fonts assets/img assets/gsap.min.js "$d/assets/"
cp "assets/audio/$a.wav" "$d/assets/audio/"; cp assets/audio/vo*.wav "$d/assets/audio/" 2>/dev/null || true
cp hyperframes.json meta.json "$d/"
if [ "$v" = "4x5" ]; then
  sed -e 's/height: 1920px/height: 1350px/g' \
      -e 's/height=1920/height=1350/' \
      -e 's/data-height="1920"/data-height="1350"/' \
      -e 's/<div id="root" data-composition-id="\(ad[0-9]*\)"/<div id="root" class="r45" data-composition-id="\1x5"/' \
      -e 's/__timelines\["\(ad[0-9]*\)"\]/__timelines["\1x5"]/' \
      "$n.html" > "$d/index.html"
else
  cp "$n.html" "$d/index.html"
fi
echo "$d"
