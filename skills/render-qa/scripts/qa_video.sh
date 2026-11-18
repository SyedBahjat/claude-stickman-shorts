#!/usr/bin/env bash
# Deterministic QC of a rendered/mastered episode (read-only). Prints PASS/FAIL lines; exit 1 on any FAIL.
# Usage: bash skills/render-qa/scripts/qa_video.sh <file.mp4> [--frames N] [--min 85] [--max 90]
set -u
f="${1:?usage: qa_video.sh <file.mp4> [--frames N] [--min S] [--max S]}"; shift
want_frames=""; min=85; max=90
while [ $# -gt 0 ]; do case "$1" in
  --frames) want_frames="$2"; shift 2;; --min) min="$2"; shift 2;; --max) max="$2"; shift 2;;
  *) echo "unknown option $1"; exit 2;; esac; done
[ -f "$f" ] || { echo "FAIL file not found: $f"; exit 1; }
fail=0
ok()  { echo "PASS $*"; }
bad() { echo "FAIL $*"; fail=1; }
v() { ffprobe -v error -select_streams "$1" -show_entries "stream=$2" -of default=nw=1:nk=1 "$f" | head -1; }

codec=$(v v:0 codec_name); pix=$(v v:0 pix_fmt); w=$(v v:0 width); h=$(v v:0 height)
fps=$(v v:0 r_frame_rate); nf=$(v v:0 nb_frames)
dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")
acodec=$(v a:0 codec_name); asr=$(v a:0 sample_rate)

[ "$codec" = h264 ] && [ "$pix" = yuv420p ] && ok "video $codec $pix" || bad "video codec/pix_fmt $codec $pix (want h264 yuv420p)"
[ "$w" = 1080 ] && [ "$h" = 1920 ] && ok "size ${w}x${h}" || bad "size ${w}x${h} (want 1080x1920)"
[ "$fps" = 30/1 ] && ok "fps $fps" || bad "fps $fps (want 30/1)"
awk -v d="$dur" -v a="$min" -v b="$max" 'BEGIN{exit !(d>=a && d<=b+0.05)}' && ok "duration ${dur}s" || bad "duration ${dur}s (want ${min}-${max}s)"
exp=$(awk -v d="$dur" 'BEGIN{printf "%d", d*30+0.5}')
[ -n "$want_frames" ] && exp="$want_frames"
[ "$nf" = "$exp" ] && ok "frames $nf" || bad "frames $nf (want $exp)"
[ "$acodec" = aac ] && [ "$asr" = 48000 ] && ok "audio $acodec ${asr}Hz" || bad "audio $acodec ${asr}Hz (want aac 48000Hz)"

errs=$(ffmpeg -v error -i "$f" -f null - 2>&1 | head -5)
[ -z "$errs" ] && ok "full decode clean" || bad "decode errors: $errs"

lou=$(ffmpeg -hide_banner -nostats -i "$f" -map 0:a:0 -af ebur128=peak=true:framelog=quiet -f null - 2>&1)
I=$(echo "$lou" | grep -E '^\s+I:' | tail -1 | awk '{print $2}')
P=$(echo "$lou" | grep -E '^\s+Peak:' | tail -1 | awk '{print $2}')
awk -v i="$I" 'BEGIN{exit !(i>=-19.5 && i<=-17.0)}' && ok "loudness ${I} LUFS" || bad "loudness ${I} LUFS (want about -18, -19.5..-17.0)"
awk -v p="$P" 'BEGIN{exit !(p<=-1.5)}' && ok "true peak ${P} dBFS" || bad "true peak ${P} dBFS (want <= -1.5)"

echo "sha256 $(sha256sum "$f" | cut -c1-64)  $(du -h "$f" | cut -f1)"
exit $fail
