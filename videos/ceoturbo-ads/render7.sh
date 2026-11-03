#!/usr/bin/env bash
cd "$(dirname "$0")"
for v in "" 4x5; do D=$(./stage.sh ad7-the-line ad7 $v); (cd $D && npx hyperframes render --quality high --output ../../renders/ad7-the-line${v:+-$v}.mp4 2>&1 | grep -E "MB ·"); done
for f in renders/ad7-the-line.mp4 renders/ad7-the-line-4x5.mp4; do echo -n "$f "; ffmpeg -hide_banner -i $f -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tr '\n' ' '; echo; done
echo RENDER_DONE
