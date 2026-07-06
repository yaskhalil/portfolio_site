"use client"

const COMMANDS = ["matrix", "projects", "blog", "research"] as const

export function TerminalNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-6 md:px-12 lg:px-20 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center">
        <span className="font-mono text-xs text-muted-foreground shrink-0 whitespace-nowrap">
          <span className="text-primary">$</span> help
        </span>
        <span className="text-muted-foreground/30 mx-1 shrink-0">//</span>
        <div className="flex items-center gap-1">
          {COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => scrollTo(cmd)}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors px-2.5 py-1.5 border border-transparent hover:border-border/40 rounded-sm shrink-0 whitespace-nowrap"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
