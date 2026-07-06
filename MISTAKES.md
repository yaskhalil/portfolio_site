# MISTAKES.md — Lessons Learned

## [2026-07-05] ASCII mesh: large rewrites break silently
- **What happened:** Rewrote the entire ascii-mesh.tsx component to add mouse reactivity, color cycling, responsive grid, scroll warp, and ASCII glyph rendering in one pass. The canvas rendered 0 pixels — complete failure.
- **Root cause:** Too many changes at once. The scroll handler's `(window as any).__lastScrollY` caused a silent runtime error that broke the animation loop entirely. No error surfaced in the console, only "blank canvas."
- **Fix:** Reverted to the original working file. Added changes incrementally: mouse tracking (worked), HSL color cycling (worked), responsive grid (worked). Scroll handler broke it. Isolated each feature on a clean base.
- **Pattern to avoid:** Never rewrite 600 lines in one go. Make one change, build, verify (check pixel count on canvas). Multiple features + a single runtime error is impossible to bisect without git.

## [2026-07-05] Canvas rendering verification needs a delay
- **What happened:** Checked canvas pixels immediately after page load and got 0 — assumed broken. But the animation loop hadn't started yet (requestAnimationFrame hadn't fired).
- **Fix:** Always wait 2-3 seconds before checking canvas content. The component mounts, hydrates, then starts the rAF loop.
- **Pattern to avoid:** Don't assume 0 pixels = broken component. The animation loop may not have started.

## [2026-07-05] Vercel build cache serves stale versions
- **What happened:** Even after deploying the original working file, pixel checks showed 0. Earlier tests of the same file had shown 4500+ pixels.
- **Fix:** The earlier tests were from a different deployment (different Vercel deployment URL). Always check which deployment URL is being served.
- **Pattern to avoid:** Vercel's `--prod --yes` aliases to the production URL immediately. But the new build may not have fully propagated. Use the unique deployment URL for verification.

## [2026-07-05] HSL color format works on canvas
- **What happened:** Switched from hardcoded RGB `"rgb(0, 255, 229)"` to computed HSL `"hsl(180, 100%, 60%)"` — rendered correctly.
- **Pattern to adopt:** HSL is valid in canvas `fillStyle`. Use it for dynamic color cycling.
