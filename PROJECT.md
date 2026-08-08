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
Live. Blog index and homepage blog section pull from shared `lib/blog-posts.ts`. Hero has ASCII mesh; TechnicalMatrix has the ship-vs-asteroids tree defense game. Current design system documented in docs/SYSTEM_DESIGN.md, which also tracks known issues (font-sans override bug, orphaned styles/globals.css, no reduced-motion handling, static DitchFeed data).

## To Do
- [ ] Fix font-sans override (Inter intended, Geist unresolved) + delete orphaned styles/globals.css
- [ ] Implement prioritized polish list in docs/SYSTEM_DESIGN.md (see "Current gaps" + session improvement plan)
- [ ] Add resume link + X/Medium/Substack to TerminalCTA
- [ ] OG image + JSON-LD Person schema for link previews
