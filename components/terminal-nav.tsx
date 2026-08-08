"use client"

import { useEffect, useState } from "react"

const COMMANDS = ["matrix", "projects", "blog", "research"] as const
const SECTIONS = [...COMMANDS] as string[]

export function TerminalNav() {
  const [active, setActive] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  // Scrollspy — highlight the section currently in view
  useEffect(() => {
    const sections = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Keyboard navigation — 1-4 to jump, j/k or arrows to cycle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return

      if (e.key >= "1" && e.key <= "4") {
        scrollTo(COMMANDS[Number(e.key) - 1])
        return
      }

      const idx = active ? COMMANDS.indexOf(active as (typeof COMMANDS)[number]) : -1
      if (e.key === "j" || e.key === "ArrowDown") {
        const next = idx < 0 ? 0 : Math.min(idx + 1, COMMANDS.length - 1)
        scrollTo(COMMANDS[next])
      } else if (e.key === "k" || e.key === "ArrowUp") {
        const next = idx < 0 ? 0 : Math.max(idx - 1, 0)
        scrollTo(COMMANDS[next])
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-6 md:px-12 lg:px-20 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center">
        <span className="font-mono text-xs text-muted-foreground shrink-0 whitespace-nowrap">
          <span className="text-primary">$</span> help
        </span>
        <span className="text-muted-foreground/30 mx-1 shrink-0">//</span>
        <div className="flex items-center gap-1">
          {COMMANDS.map((cmd, i) => (
            <button
              key={cmd}
              onClick={() => scrollTo(cmd)}
              className={`font-mono text-xs px-2.5 py-1.5 border border-transparent hover:border-border/40 rounded-sm shrink-0 whitespace-nowrap transition-colors cursor-pointer ${
                active === cmd ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              aria-current={active === cmd ? "true" : undefined}
            >
              {active === cmd ? "> " : ""}
              {cmd}
            </button>
          ))}
        </div>
        <span className="hidden lg:inline font-mono text-xs text-muted-foreground/50 shrink-0 whitespace-nowrap ml-2">
          keys: 1-4, j/k
        </span>
      </div>
    </nav>
  )
}
