# LEDGER

One entry per mission. Draft location, point-by-point self-grade against SUCCESS.md, and every patch the refinement loop makes.

---

## 01-website — Eyes Closed Client Room prototype

- **Date:** 2026-07-16
- **Wargamer:** Claude Fable 5 (dispatched via /html-it → wargames skill)
- **Battle plan:** `wargames/01-website.md`
- **HTML rendering:** `wargames/01-website.html`

### Self-grade vs SUCCESS.md

1. **Expected observations** — PASS. Every move (1–10) has an explicit **Expect** line stating what the executor should see.
2. **Failure / cause / counter per move** — PASS. Every move carries at least one **If instead / because / then**; Move 3 and Move 6 carry two (their highest-risk steps).
3. **Fork triggers** — PASS. Forks A–E each keyed to a concrete observation (render timeout, font fallback, 375px wrap, the decoration urge, fidelity cost); routes are prescriptive, no judgment calls.
4. **RECON NEEDED marked with exact check** — PASS. Two items (§5): science bundle visuals (check: browser render per Move 1/Fork A) and React-app port-back (check: operator answer post-review; explicitly out of scope).
5. **Abort conditions** — PASS. Four (§6): scope escape outside `site/`, pre-existing `site/`, chrome-vs-mobile unsatisfiability, no browser available for verification.
6. **Verification spelled out** — PASS. V1–V9 (§7): each names the run, the environment (`file://` primary), and what pass looks like; V9 forces claim-by-claim audit of the executor's own report.
7. **Red-team pass recorded** — PASS. §8 records five attacks: 1, 2, 3, 5 landed and produced patches (DO-NOT-READ guard, file://+relative-link contract, overlay focus/scroll discipline, hash-nav ban); attack 4 failed against the draft and still yielded Fork D.
8. **Executable blind** — PASS with one dependency: recon facts table (§0) pins every file path, token, and size so a mid-tier executor never has to re-derive; the only open judgment is board visual fidelity, bounded by Fork E ("skeleton + palette + one hero element, max").

### Patches from the refinement loop

- Added byte-size warning + DO-NOT-READ on the science bundle (attack 1).
- Banned `type="module"`, mandated relative-path audit, made `file://` the primary verification environment (attack 2).
- Overlay: focus move/restore, `body` scroll lock, three tested close paths (attack 3).
- Fork D added — names the "quiet stage looks bare" urge itself as a trigger (attack 4).
- Banned hash navigation for board switching; `min-height` matting prescribed (attack 5).
- Operator directive (2026-07-16) folded into §0 + directive 2: primary wayfinding must be large; full-viewport overlay explicitly mandated; corner-icon nav named as the pattern to kill.
