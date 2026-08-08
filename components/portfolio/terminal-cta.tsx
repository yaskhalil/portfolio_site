"use client"

import { useState, useRef } from "react"

const LINKS = {
  email: "mailto:yaskhalil2006@gmail.com",
  github: "https://github.com/yaskhalil",
  linkedin: "https://www.linkedin.com/in/yaseenkhalil/",
  medium: "https://medium.com/@yaskhalil2006",
  substack: "https://yaseenkhalil.substack.com",
} as const

type Command = keyof typeof LINKS | "help" | "status" | "clear"

const ALIASES: Record<string, Command> = {
  email: "email",
  mail: "email",
  github: "github",
  gh: "github",
  linkedin: "linkedin",
  in: "linkedin",
  medium: "medium",
  substack: "substack",
  help: "help",
  "?": "help",
  status: "status",
  clear: "clear",
  ls: "help",
}

const HELP_TEXT = "Commands: email, github, linkedin, medium, substack, status, clear"

type LogEntry = { cmd: string; output: string; kind: "ok" | "err" | "info" }

export function TerminalCTA() {
  const [input, setInput] = useState("")
  const [log, setLog] = useState<LogEntry[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    const key = ALIASES[cmd]
    if (!key) {
      setLog((l) => [...l, { cmd, output: `bash: ${cmd}: command not found. Try 'help'.`, kind: "err" }])
      setInput("")
      return
    }

    if (key === "help") {
      setLog((l) => [...l, { cmd, output: HELP_TEXT, kind: "info" }])
    } else if (key === "clear") {
      setLog([])
    } else if (key === "status") {
      setLog((l) => [...l, { cmd, output: "Seeking a new challenge.", kind: "ok" }])
    } else {
      const url = LINKS[key]
      setLog((l) => [...l, { cmd, output: `Opening ${url} ...`, kind: "ok" }])
      if (url.startsWith("http")) {
        window.open(url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = url
      }
    }
    setInput("")
  }

  const outputColor = (kind: LogEntry["kind"]) =>
    kind === "err" ? "text-destructive" : kind === "info" ? "text-accent" : "text-foreground"

  return (
    <footer id="research" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      {/* Terminal Container */}
      <div className="border border-border bg-card rounded-sm overflow-hidden max-w-4xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">terminal — bash</span>
        </div>

        {/* Terminal content */}
        <div className="p-6 md:p-8 space-y-6" onClick={() => inputRef.current?.focus()}>
          {/* Command output */}
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-accent">user@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">~</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">cat ./status.txt</span>
            </div>
            <div className="font-mono text-base md:text-lg text-foreground">
              <span className="text-primary">{'>'}</span> Seeking a new challenge.
            </div>
          </div>

          {/* Contact listing */}
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-accent">user@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">~</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">ls ./contact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 pt-2">
              {(Object.keys(LINKS) as (keyof typeof LINKS)[]).map((key) => (
                <a
                  key={key}
                  href={LINKS[key]}
                  {...(LINKS[key].startsWith("http") || LINKS[key].startsWith("mailto")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="text-primary group-hover:translate-x-0.5 transition-transform">./</span>
                  <span className="group-hover:underline underline-offset-4">{key}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Command log */}
          {log.length > 0 && (
            <div className="space-y-2">
              {log.map((entry, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-mono text-sm">
                    <span className="text-accent">user@portfolio</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-primary">~</span>
                    <span className="text-muted-foreground">$ </span>
                    <span className="text-foreground">{entry.cmd}</span>
                  </div>
                  <div className={`font-mono text-sm ${outputColor(entry.kind)}`}>{entry.output}</div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive prompt */}
          <div className="flex items-center gap-0 font-mono text-sm pt-2">
            <span className="text-accent shrink-0">user@portfolio</span>
            <span className="text-muted-foreground shrink-0">:</span>
            <span className="text-primary shrink-0">~</span>
            <span className="text-muted-foreground shrink-0">$&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run(input)
              }}
              placeholder="type a command — try 'help'"
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 min-w-0 bg-transparent outline-none border-none text-foreground caret-primary placeholder:text-muted-foreground/40 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 font-mono text-xs text-muted-foreground">
        <span className="text-primary">&copy;</span> {new Date().getFullYear()} | Built with precision
      </div>
    </footer>
  )
}
