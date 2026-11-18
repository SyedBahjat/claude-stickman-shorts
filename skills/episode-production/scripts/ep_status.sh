#!/usr/bin/env bash
# One-shot SILENCE PROTOCOL status (read-only). Usage: bash skills/episode-production/scripts/ep_status.sh [--fetch]
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
br=$(git branch --show-current)
[ "${1:-}" = "--fetch" ] && git fetch -q origin "$br" 2>/dev/null
up=$(git rev-parse -q --verify "origin/$br" 2>/dev/null)
sync="no upstream"
[ -n "$up" ] && sync="ahead $(git rev-list --count "$up"..HEAD), behind $(git rev-list --count HEAD.."$up")"
echo "branch    $br @ $(git rev-parse --short HEAD) ($sync)"
d=$(git status --porcelain | wc -l); echo "worktree  $([ "$d" = 0 ] && echo clean || echo "$d changed paths")"
if sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256 >/dev/null 2>&1; then
  echo "assets    OK ($(wc -l < 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256) files intact)"
else
  echo "assets    FAIL:"; sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256 2>&1 | head -5
fi
echo "canon     $(grep -o '02_EPISODES/[^`]*CANON\.md' CLAUDE.md | head -1)"
last=0
for e in 02_EPISODES/EP[0-9]*; do
  [ -d "$e" ] || continue
  n=$((10#${e##*EP})); [ "$n" -gt "$last" ] && last=$n
  c=$(ls "$e" | grep -c 'CANON\.md')
  t=$(ls "$e"/*lines.tsv stories/silence-protocol/$(printf 'ep%02d' "$n")-lines.tsv 2>/dev/null | head -1)
  echo "episode   ${e##*/}: canon=$([ "$c" -gt 0 ] && echo yes || echo NO) lines=$([ -n "$t" ] && wc -l < "$t" || echo -)"
done
echo "comps     $(grep -o 'SilenceProtocol-EP[0-9]*' src/Root.tsx | tr '\n' ' ')"
printf 'next      EP%02d\n' $((last + 1))
echo "tts       $([ -f "${TTS_DIR:-$HOME/.cache/silence-tts}/kokoro-v1.0.onnx" ] && echo installed || echo 'missing (bash scripts/tts/setup_tts.sh)')"
echo "node      $([ -d node_modules ] && echo installed || echo 'missing (npm install)')"
echo "renders   $(ls out/*.mp4 2>/dev/null | tr '\n' ' ' || true)"
