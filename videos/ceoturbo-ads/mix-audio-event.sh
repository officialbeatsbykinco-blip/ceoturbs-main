#!/usr/bin/env bash
# Voice + bed for the "event is in 2 weeks" shirt ad, muxed onto the HyperFrames render:
#   node ads/hyperframes/build.mjs && (render ads/hyperframes/event-last-minute) && ./mix-audio-event.sh
# Narration: Kokoro af_heart (American female), lines in assets/audio/event-vo/l1..l5.wav, silence-trimmed.
# Script + direction: ads/hyperframes/event-last-minute/voice-script.txt. Each line starts 0.15 s into its scene.
# The bed ducks under the voice; final mix is normalized to -14 LUFS / -1.5 dBTP.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../ads/hyperframes/out"
cd "$HERE/assets/audio"
V=event-vo; T=(150 4250 7850 10650 14650)
node make-bed-event.mjs
ARGS=(-i eventbed.wav); FC=""; MIX=""
for i in 0 1 2 3 4; do ARGS+=(-i "$V/l$((i+1)).wav"); FC+="[$((i+1))]aresample=44100,highpass=f=90,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-16:TP=-2:LRA=7,adelay=${T[$i]}|${T[$i]}[v$i];"; MIX+="[v$i]"; done
FC+="${MIX}amix=inputs=5:normalize=0:dropout_transition=0[vo];[vo]asplit=2[vo1][vo2];[0]volume=0.5[bed];[bed][vo1]sidechaincompress=threshold=0.03:ratio=8:attack=10:release=250[duck];[duck][vo2]amix=inputs=2:normalize=0:duration=first[mix];[mix]loudnorm=I=-14:TP=-1.5:LRA=9,apad[out]"
ffmpeg -loglevel error -y "${ARGS[@]}" -filter_complex "$FC" -map "[out]" -t 18.3 -ar 44100 -ac 1 event.wav
ffmpeg -loglevel error -y -i "$OUT/event-last-minute.mp4" -i event.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "$OUT/event-last-minute-vo.mp4"
ffmpeg -hide_banner -i event.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tr '\n' ' '; echo
echo "$OUT/event-last-minute-vo.mp4"
