#!/usr/bin/env bash
# Check that every file a SILENCE PROTOCOL episode references exists (read-only).
# Usage: bash skills/render-qa/scripts/check_episode_assets.sh <episode number, e.g. 2>
set -u
n=$((10#${1:?usage: check_episode_assets.sh <N>}))
cd "$(git rev-parse --show-toplevel)" || exit 1
EP=$(printf 'EP%02d' "$n"); src="src/stories/silence-protocol/SilenceP$n.tsx"
tsv=$(ls 02_EPISODES/$EP/lines.tsv stories/silence-protocol/$(printf 'ep%02d' "$n")-lines.tsv 2>/dev/null | head -1)
fail=0; miss() { echo "FAIL missing $1"; fail=1; }

[ -f "$src" ] || { echo "FAIL no source $src"; exit 1; }
grep -q "SilenceProtocol-$EP" src/Root.tsx && echo "PASS composition SilenceProtocol-$EP registered" \
  || { echo "FAIL SilenceProtocol-$EP not in src/Root.tsx"; fail=1; }

if [ -n "$tsv" ]; then
  c=0
  while IFS=$'\t' read -r name _; do
    [ -n "$name" ] || continue; c=$((c+1))
    [ -f "public/audio/voice/$name.wav" ] || miss "public/audio/voice/$name.wav"
    [ -f "public/captions/$name.json" ] || miss "public/captions/$name.json"
  done < "$tsv"
  echo "PASS checked $c narration lines from $tsv (voice + captions)"
else
  echo "FAIL no lines.tsv for $EP"; fail=1
fi

# SFX names in the `const SFX` cue table, plus literal audio paths anywhere in the file.
sfx=$(awk '/^const SFX/{on=1} on{print} on&&/^\];/{exit}' "$src" | grep -oE '\["[a-z0-9-]+"' | tr -d '["' | sort -u)
for s in $sfx; do [ -f "public/audio/sfx/$s.wav" ] || miss "public/audio/sfx/$s.wav"; done
echo "PASS checked $(echo "$sfx" | grep -c .) SFX names"
for p in $(grep -oE 'audio/(music|sfx)/[a-z0-9-]+\.wav' "$src" | sort -u); do [ -f "public/$p" ] || miss "public/$p"; done

sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256 >/dev/null 2>&1 && echo "PASS asset checksums" \
  || { echo "FAIL asset checksums (run sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256)"; fail=1; }
exit $fail
