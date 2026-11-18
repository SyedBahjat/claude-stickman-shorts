"""Remap word captions from the spoken text (numbers as words) to the display text (365, €260,000)."""
import json, re, sys
def n(t): return re.sub(r"[^a-z0-9']", "", t.lower())
for line in open(sys.argv[1]):
    name, say, cap = line.rstrip("\n").split("\t")
    p = f"public/captions/{name}.json"
    sp = json.load(open(p))
    disp = cap.split()
    out, j = [], 0
    for i, d in enumerate(disp):
        if j >= len(sp): break
        if n(d) == n(sp[j]["text"]) or not re.search(r"[0-9€]", d):
            group = [sp[j]]; j += 1
        else:
            nxt = n(disp[i + 1]) if i + 1 < len(disp) else None
            group = []
            while j < len(sp) and (nxt is None or n(sp[j]["text"]) != nxt):
                group.append(sp[j]); j += 1
            if nxt is None: group += sp[j:]; j = len(sp)
        out.append({"text": (" " if out else "") + d, "startMs": group[0]["startMs"], "endMs": group[-1]["endMs"],
                    "timestampMs": (group[0]["startMs"] + group[-1]["endMs"]) // 2, "confidence": None})
    json.dump(out, open(p, "w"), indent=1)
    print(name, " ".join(w["text"].strip() for w in out))
