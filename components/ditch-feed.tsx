"use client"

import { Terminal } from "lucide-react"
import SectionReveal from "@/components/section-reveal"

const entries = [
  { emoji: "📝", label: "Published 'The Idea of Insecurity' on the blog", ago: "today" },
  { emoji: "✏️", label: "Updated STP-GNN research paper draft", ago: "2d ago" },
  { emoji: "✅", label: "Completed DepMap validation pipeline", ago: "5d ago" },
  { emoji: "📝", label: "Published 'Breaking the 0.5 Deadlock' on the blog", ago: "2w ago" },
  { emoji: "🚀", label: "Started Research_STP project directory", ago: "1mo ago" },
]

export function DitchFeed() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> tail -f activity.log
        </div>
        <SectionReveal>
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
            Ditch
          </h2>
        </SectionReveal>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          Recent WIP & updates
        </p>
      </div>

      <div className="border border-border bg-card rounded-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">activity.log</span>
        </div>

        <div className="divide-y divide-border">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 px-4 md:px-6 py-3">
              <span className="text-base shrink-0">{entry.emoji}</span>
              <p className="font-mono text-sm text-foreground flex-1 truncate">
                {entry.label}
              </p>
              <span className="font-mono text-xs text-muted-foreground shrink-0">
                {entry.ago}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground flex items-center justify-between">
            <span>
              <span className="text-primary">{entries.length}</span> entries
            </span>
            <span className="text-muted-foreground">WIP</span>
          </div>
        </div>
      </div>
    </section>
  )
}
