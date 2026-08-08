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
- **Sans** — Inter via `next/font` (`--font-sans` variable). Tailwind 4 defaults are used: `font-sans` → `var(--font-sans)` so the next/font variable wins. Do NOT reintroduce a `@theme inline { --font-sans: ... }` override — it silently replaced Inter with an unloaded font.
- **Mono** — Geist Mono via `next/font` (`--font-mono`), same mechanism.
- Headings: `font-sans font-bold` (h1 text-3xl→5xl, h2 text-2xl/3xl). Body terminal text: `font-mono text-sm`.

## Layout
Single column, `px-6 md:px-12 lg:px-20`, sections `py-20 md:py-28`, separated by `border-t border-border`. Page order (locked): Hero → TerminalNav → TechnicalMatrix → Projects → DitchFeed → WorkingPapers (Blog) → TerminalCTA (footer).

## Sections & interaction systems
1. **Hero** — AsciiMesh canvas (85–90vh) morphs ASCII glyphs; corner labels (`// ascii.mesh` top-left, `render_cycle` + mesh source link top-right). Name + typewriter subtitle sit in an overlay panel (bg-background/70 + backdrop-blur, border-t) pinned to the canvas bottom — above the fold. `// scroll` hint (desktop only). Typewriter skipped under prefers-reduced-motion. MISTAKES lesson: mesh rewrites must be incremental (one change, build, verify pixels after 2–3s rAF warmup).
2. **TerminalNav** — sticky, `$ help //` + commands [matrix, projects, blog, research], smooth-scroll. Scrollspy (IntersectionObserver, rootMargin -30%/-60%) prefixes active command with `>`; keyboard nav: 1–4 jump, j/k or arrows cycle (ignored while typing in an input). IDs: `matrix`, `projects`, `blog`, `research`.
3. **TechnicalMatrix** (`#matrix`) — the centerpiece. Renders an `active-stack/` tree (modeling, backend, frontend, research, infra) as a `find`-style tree. Interactive game: custom cursor is a retro ship (see TerminalCursor); mousedown fires bullets; asteroids (cyan diamonds) spawn from section edges and drift toward the tree card; bullet hit = pop + particles + score++; asteroid hits tree = HP-- (3 HP) + screen shake + tree lines glitch (30ms/300ms dual-rate char garble). Waves escalate every 15s (speed + spawn rate). Game pauses when section out of viewport. `reset` restores everything. Game (spawning, `?` button, score/HP row) is disabled for prefers-reduced-motion and touch (pointer: coarse) — tree renders static.
4. **Projects** — accordion, one open at a time (default temple-university). Header: `[NN]` index + title + mono subtitle + chevron. Body: `>` bullets, tag chips (bordered, hover→primary), status pill (Live = cyan pill; else muted; sharp `rounded-sm` — no rounded-full anywhere). Doc link (`view_code`, external). Expansion animates via `grid-rows-[0fr]→[1fr]` (no max-h magic number). Cards wrapped in SectionReveal.
5. **DitchFeed** — `tail -f activity.log` window. Static hardcoded entries (emoji + label + ago). Honesty issue: it implies live activity but never changes. Entries wrapped in SectionReveal.
6. **WorkingPapers** (`#blog`) — git-log window: hash (from `postHashes`), date, title, `[MERGED/IN_REVIEW/DRAFT]` badge. Rows link to `/blog/<slug>`. Scroll arrows appear if >4 entries.
7. **TerminalCTA** (`#research`) — terminal window: `cat ./status.txt` → "Seeking a new challenge.", `ls ./contact` → email, github, linkedin, medium, substack links, then an interactive prompt: type a command and Enter. Commands/aliases: email, github, linkedin, medium, substack, status, clear, help/?/ls. Unknown → `bash: <cmd>: command not found. Try 'help'.` URL commands open in a new tab (mailto navigates in place). Clicking the terminal focuses the input.

## Global interactions
- **TerminalCursor** (all pages): hides native cursor (`body { cursor: none }`), draws lerped ship + speed flame on full-viewport canvas (z-9999, pointer-events-none). Mousedown fires a bullet ONLY when the cursor is inside `#matrix`; bullets sync to `bulletData` (shared module the game reads) and despawn outside matrix bounds. rAF loop pauses after 3s idle (no movement + no bullets) and on tab hide; restarts on mouse activity. NO global preventDefault (text selection works). Entire component is skipped for touch (pointer: coarse) and prefers-reduced-motion — native cursor stays.
- **SectionReveal**: scroll-triggered reveal (IntersectionObserver) — used on section h2s, project cards, and ditch feed entries.
- **Keyboard nav**: 1–4 jump to sections, j/k or ↑/↓ cycle; ignored when focus is in an input/textarea.
- **Metadata**: `app/opengraph-image.tsx` generates a dark terminal-card OG image (edge runtime, dynamic); JSON-LD Person schema in root layout (github/linkedin/medium/substack sameAs).

## Content model
- Blog: MDX under `app/blog/*/page.mdx`, KaTeX math, rehype-pretty-code. Index + homepage pull from `lib/blog-posts.ts` (single source: slug, title, description, date, part, status, hash).
- Projects: hardcoded array in `components/portfolio/projects.tsx`.
- Contact/writing links: single LINKS map in `components/portfolio/terminal-cta.tsx` (also feeds the interactive shell).
- No CMS, no images. DitchFeed data is static (see honesty issue above).

## Accessibility / motion (current state)
- prefers-reduced-motion: typewriter skipped, custom cursor disabled, game disabled. CSS animations still run (acceptable).
- Touch: custom cursor + game disabled; tree renders static. Game is mouse-only by design.
- Custom cursor only when JS runs; native cursor otherwise.
- Accordion has `aria-expanded`; nav buttons have `aria-current`; shell input has an aria-label.

## Deploy
Vercel from GitHub `main` (github.com/yaskhalil/portfolio_site.git). `npm run build` must pass locally before push. Verify builds catch TS6133 unused vars. If hobby auto-deploy silently stops, deploy via CLI (`vercel --prod`).
