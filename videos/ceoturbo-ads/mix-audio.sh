#!/usr/bin/env bash
# Master + premix the narration for an ad: ./mix-audio.sh <voice-prefix> <out-name>
#   e.g. ./mix-audio.sh ln ad7   (uses assets/audio/ln1-8.wav over ad7bed.wav -> ad7.wav)
#        ./mix-audio.sh d8_ln ad8
# Voice lines are generated with: npx hyperframes tts "<line>" -v af_heart -s 0.92 -o raw.wav, then mastered here:
# high-pass, light EQ, compressor, de-ess, -16 LUFS per line; the music bed ducks under the voice (sidechain);
# the final mix is loudness-normalized to -14 LUFS / -1.5 dBTP (Meta, TikTok, Reels). Start times are in ms.
set -euo pipefail
cd "$(dirname "$0")/assets/audio"
P="$1"; OUT="$2"; T=(500 4200 8500 10900 13600 15800 20600 23400)
ARGS=(-i ad7bed.wav); FC=""; MIX=""
for i in 0 1 2 3 4 5 6 7; do ARGS+=(-i "${P}$((i+1)).wav"); FC+="[$((i+1))]adelay=${T[$i]}|${T[$i]}[v$i];"; MIX+="[v$i]"; done
FC+="${MIX}amix=inputs=8:normalize=0:dropout_transition=0[vo];[vo]asplit=2[vo1][vo2];[0]volume=0.9[bed];[bed][vo1]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[duck];[duck][vo2]amix=inputs=2:normalize=0:duration=first[mix];[mix]loudnorm=I=-14:TP=-1.5:LRA=9,apad[out]"
ffmpeg -loglevel error -y "${ARGS[@]}" -filter_complex "$FC" -map "[out]" -t 27 -ar 44100 -ac 2 "$OUT.wav"
ffmpeg -hide_banner -i "$OUT.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tr '\n' ' '; echo
