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

## Git
- GitHub: github.com/yaskhalil/portfolio_sit
- Default branch: main
- Auto-deploys to Vercel on push

## Status
Live. Blog posts are complete. Currently static — no future features planned unless new blog content is written.
