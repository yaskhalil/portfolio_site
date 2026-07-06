# AGENTS — Portfolio Site (yaseenkhalil.com)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build (must pass before push)
- `npm run lint` — ESLint check
- `npm run start` — serve built output

## Conventions
- **TypeScript strict mode** — no `any` unless truly unavoidable
- **shadcn/ui components** — use existing UI components before building new ones; they're under `components/ui/`
- **CSS** — Tailwind CSS 4 utility classes; no CSS modules or styled-components
- **Fonts** — Inter for sans (--font-sans), Geist Mono for mono (--font-mono)
- **Blog posts** — MDX files under `app/blog/*/page.mdx`; use KaTeX for math (`$$...$$`)

## Constraints
- Do NOT regenerate or overwrite shadcn/ui components in `components/ui/` — they are customized and stable
- Blog MDX files use remark-math + rehype-katex — ensure math renders correctly
- The site deploys via Vercel from the `main` branch — verify build passes locally before pushing
- Keep the homepage sections in order: Hero → TechnicalMatrix → Projects → WorkingPapers → TerminalCTA

## See also
- `PROJECT.md` — full project overview and structure
- `MISTAKES.md` — recorded pitfalls and lessons
- `~/.hermes/SOUL.md` — global agent rules and OPINIONS.md location
