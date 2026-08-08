# PROJECT — Yaseen Khalil's Portfolio Site

## What
Personal portfolio + blog site for Yaseen Khalil (yaseenkhalil.com). Showcases computational modeling work, ML systems architecture, and a 3-part blog series "Engineering a Cell."

## Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Content:** MDX with KaTeX math rendering, rehype-pretty-code for syntax highlighting
- **Fonts:** Inter (sans), Geist Mono (mono)
- **Analytics:** Vercel Analytics
- **Deploy:** Vercel (via GitHub)

## Structure
```
app/
├── page.tsx          — Portfolio homepage (Hero, TechnicalMatrix, Projects, WorkingPapers, TerminalCTA)
├── layout.tsx        — Root layout (fonts, metadata, analytics)
└── blog/
    ├── page.tsx      — Blog index (lists 3 posts)
    └── engineering-cell-part-{1,2,3}/page.mdx — Blog posts
components/
├── portfolio/        — Hero, TechnicalMatrix, Projects, WorkingPapers, TerminalCTA, ascii-mesh
├── ui/               — shadcn/ui components
└── theme-provider.tsx
```

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint

## Docs
- README → links to docs/SYSTEM_DESIGN.md (never duplicate design content elsewhere)

## Git
- GitHub: github.com/yaskhalil/portfolio_site
- Default branch: main
- Deploys to Vercel from main (see docs/SYSTEM_DESIGN.md Deploy note; use `vercel --prod` if auto-deploy stalls)

## Status
Live. Hero title overlays the ASCII mesh (above the fold); TechnicalMatrix has the ship-vs-asteroids tree defense game; TerminalCTA is an interactive shell (type `help`); scrollspy + keyboard nav; OG image + JSON-LD. Projects: Temple (FlyGPlot + KSG split-GAL4 proposal), VT (STP-Diff, DOI 10.13140/RG.2.2.35274.32965), Talii, La-Unica (contract, NDA), HoneyRuns, Diggeridoos — bullets are deliberately explanatory (problem → approach → outcome). Blog list mirrors what is published on Medium (@yaskhalil2006) and Substack (@yaseenkhalil), including "Building in Public When You're Still Figuring It Out" (2026-07-30); Ditch section removed. Design system in docs/SYSTEM_DESIGN.md is the single source of truth.

## To Do
- [ ] Wire a periodic check of Medium/Substack feeds into the blog list (currently manual — see docs/SYSTEM_DESIGN.md section 5)
- [ ] Vary section header treatments / panel widths (currently uniform rhythm)
- [ ] Consider light theme or system-theme support (dark-only today)
