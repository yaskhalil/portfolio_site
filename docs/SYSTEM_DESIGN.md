# SYSTEM_DESIGN — yaseenkhalil.com

Design system and architecture doc for the portfolio site. README links here; this is the single source of truth for how the site looks, moves, and is structured. If a change contradicts this doc, update the doc too.

## Concept
"Precision Data Brutalism" — a dark, terminal-flavored portfolio. Every section is presented as a shell/CLI artifact (`$ help`, `ls ./projects --verbose`, `git log --blog`, `tail -f activity.log`). The gimmick is the interface; the content (research, ML systems, writing) is the payload. The site is a portfolio, not a game — the game elements are garnish for the TechnicalMatrix section only.

## Theme (CSS tokens, app/globals.css)
Dark-only, flat colors. No gradients anywhere. Sharp corners (`--radius: 0.25rem`).

| Token | Value | Use |
|---|---|---|
| background | `#0A0E17` | page bg |
| foreground | `#F0F0F0` | body text |
| card | `#0D1219` | panels, accordions, terminal windows |
| primary | `#00FFE5` (cyan) | commands, prompts, links, active states |
| secondary / muted | `#1A2233` | panel headers, hover fills |
| muted-foreground | `#8A9BAE` | secondary text, labels |
| accent | `#4ADE80` (green) | success/MERGED status, bullet glyphs |
| border | `#1E2A3A` | all hairlines |
| destructive | oklch red | terminal window dots (muted) |

Semantic extras used in-game (not yet tokens): `#facc15` amber (bullets/score), `#f97316` orange, `#ef4444` red (particles/flame).

## Typography
- **Sans** — intended: Inter via `next/font` (`--font-sans` variable). KNOWN ISSUE: `@theme inline` in globals.css redefines `--font-sans` to `'Geist'`, which is NOT loaded → sans text currently falls back to system default. Fix: drop the `@theme inline` override so the Inter variable wins.
- **Mono** — Geist Mono via `next/font` (`--font-mono`). Used for: terminal chrome, section headers (`$ cmd` lines), project subtitles, tags, body copy inside terminal panels.
- Headings: `font-sans font-bold` (h1 text-3xl→5xl, h2 text-2xl/3xl). Body terminal text: `font-mono text-sm`.

## Layout
Single column, `px-6 md:px-12 lg:px-20`, sections `py-20 md:py-28`, separated by `border-t border-border`. Page order (locked): Hero → TerminalNav → TechnicalMatrix → Projects → DitchFeed → WorkingPapers (Blog) → TerminalCTA (footer).

## Sections & interaction systems
1. **Hero** — AsciiMesh canvas (60–70vh) morphs ASCII glyphs; corner labels (`// ascii.mesh`, `render_cycle: 17.5s`, link to mesh source). Below: h1 + typewriter subtitle (`>` prompt, `_` cursor, blink after typing). MISTAKES lesson: mesh rewrites must be incremental (one change, build, verify pixels after 2–3s rAF warmup).
2. **TerminalNav** — sticky, `$ help //` + commands [matrix, projects, blog, research], smooth-scroll to section ids. IDs: `matrix`, `projects`, `blog`, `research`.
3. **TechnicalMatrix** (`#matrix`) — the centerpiece. Renders an `active-stack/` tree (modeling, backend, frontend, research, infra) as a `find`-style tree. Interactive game: custom cursor is a retro ship (see TerminalCursor); mousedown fires bullets; asteroids (cyan diamonds) spawn from section edges and drift toward the tree card; bullet hit = pop + particles + score++; asteroid hits tree = HP-- (3 HP) + screen shake + tree lines glitch (30ms/300ms dual-rate char garble). Waves escalate every 15s (speed + spawn rate). Game pauses when section out of viewport. `reset` restores everything.
4. **Projects** — accordion, one open at a time (default temple-university). Header: `[NN]` index + title + mono subtitle + chevron. Body: `>` bullets, tag chips (bordered, hover→primary), status pill (Live = cyan pill; else muted), doc link (`view_code`, external). Hard `max-h-[800px]` expansion — risky with long content.
5. **DitchFeed** — `tail -f activity.log` window. Static hardcoded entries (emoji + label + ago). Honesty issue: it implies live activity but never changes.
6. **WorkingPapers** (`#blog`) — git-log window: hash (from `postHashes`), date, title, `[MERGED/IN_REVIEW/DRAFT]` badge. Rows link to `/blog/<slug>`. Scroll arrows appear if >4 entries.
7. **TerminalCTA** (`#research`) — terminal window: `cat ./status.txt` → "Seeking a new challenge.", `ls ./contact` → email / github / linkedin links, blinking block cursor, `© year | Built with precision`.

## Global interactions
- **TerminalCursor** (all pages): hides native cursor (`body { cursor: none }`), draws lerped ship + speed flame on full-viewport canvas (z-9999, pointer-events-none). Mousedown = `preventDefault()` + fire bullet into `bulletData` (shared module the game reads). Bullets despawn outside `#matrix` bounds.
- **SectionReveal**: scroll-triggered reveal (used on some h2s only — inconsistent).

## Content model
- Blog: MDX under `app/blog/*/page.mdx`, KaTeX math, rehype-pretty-code. Index + homepage pull from `lib/blog-posts.ts` (single source: slug, title, description, date, part, status, hash).
- Projects: hardcoded array in `components/portfolio/projects.tsx`.
- No CMS, no images, no resume link (gaps).

## Accessibility / motion (current gaps)
- No `prefers-reduced-motion` handling anywhere (typewriter, game, cursor, glitch all ignore it).
- Custom cursor kills native cursor — no fallback if JS fails.
- Global `mousedown preventDefault` can block text selection/click semantics.
- Accordion has `aria-expanded` but no keyboard affordance beyond native button.
- Mobile: game has no touch controls (ship needs a mouse).

## Deploy
Vercel from GitHub `main` (github.com/yaskhalil/portfolio_site.git). `npm run build` must pass locally before push. Verify builds catch TS6133 unused vars. If hobby auto-deploy silently stops, deploy via CLI (`vercel --prod`).
