# Yaseen Khalil — Portfolio

Personal portfolio + blog for [yaseenkhalil.com](https://yaseenkhalil.com): computational modeling, ML systems architecture, and the "Engineering a Cell" blog series.

## Stack
Next.js 16 (App Router) · Tailwind CSS 4 · shadcn/ui · MDX + KaTeX · rehype-pretty-code · Vercel Analytics

## Docs
- **Design system & architecture** → [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) (single source of truth: theme tokens, sections, interaction systems, known issues)
- **Agent instructions** → [AGENTS.md](AGENTS.md) (commands, conventions, constraints)
- **Project state** → [PROJECT.md](PROJECT.md)
- **Lessons learned** → [MISTAKES.md](MISTAKES.md)

## Commands
```bash
npm run dev      # dev server
npm run build    # production build (must pass before push)
npm run lint     # ESLint
npm run start    # serve built output
```

## Deploy
Vercel, from GitHub `main` (repo: github.com/yaskhalil/portfolio_site). If auto-deploy stalls, `vercel --prod`.
