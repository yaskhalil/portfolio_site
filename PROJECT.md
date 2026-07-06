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
Live. Blog posts include Engineering a Cell series + The Idea of Insecurity. Blog index and homepage blog section now pull from shared `lib/blog-posts.ts`. Site deployed on Vercel (manual deploy, no Git auto-deploy yet). Git remote was migrated from `portfolio_sit` to `portfolio_site`.

## To Do
- [ ] Connect Vercel to GitHub for auto-deploy on push
- [ ] Add iigma.im-inspired design polish (custom cursor, project carousel, terminal-style navigation)
