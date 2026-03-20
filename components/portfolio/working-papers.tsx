"use client"

import { GitCommit, Clock } from "lucide-react"

interface ResearchEntry {
  hash: string
  date: string
  title: string
  status: "published" | "in-progress" | "draft"
}

const researchEntries: ResearchEntry[] = [
  {
    hash: "a3f2b91",
    date: "2026-03-15",
    title: "High-dimensional steady state convergence via STP methods",
    status: "in-progress",
  },
  {
    hash: "8d4c7e3",
    date: "2026-02-28",
    title: "Comparative analysis: regression models for attractor identification",
    status: "draft",
  },
  {
    hash: "1b9f5a2",
    date: "2026-01-12",
    title: "Boolean network dynamics: computational efficiency benchmarks",
    status: "published",
  },
  {
    hash: "c7e3d6f",
    date: "2025-11-30",
    title: "PCA applications in high-dimensional state spaces",
    status: "published",
  },
]

const statusColors = {
  "published": "text-accent",
  "in-progress": "text-primary",
  "draft": "text-muted-foreground",
}

const statusLabels = {
  "published": "MERGED",
  "in-progress": "IN_REVIEW",
  "draft": "DRAFT",
}

export function WorkingPapers() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> git log --research --oneline
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Working Papers
        </h2>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          Follow my research
        </p>
      </div>

      {/* Git-style log */}
      <div className="border border-border bg-card rounded-sm overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <GitCommit className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">research.log</span>
        </div>

        {/* Log entries */}
        <div className="divide-y divide-border">
          {researchEntries.map((entry, index) => (
            <div 
              key={entry.hash}
              className="p-4 md:p-6 hover:bg-secondary/20 transition-colors group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                {/* Hash and date */}
                <div className="flex items-center gap-4 md:w-48 shrink-0">
                  <code className="font-mono text-sm text-primary">
                    {entry.hash}
                  </code>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-xs">{entry.date}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                    {entry.title}
                  </p>
                </div>

                {/* Status */}
                <div className="md:w-24 shrink-0">
                  <span className={`font-mono text-xs ${statusColors[entry.status]}`}>
                    [{statusLabels[entry.status]}]
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground flex items-center justify-between">
            <span>
              <span className="text-primary">{researchEntries.length}</span> entries | 
              <span className="text-accent ml-1">{researchEntries.filter(e => e.status === 'published').length}</span> published
            </span>
            <span className="text-muted-foreground">HEAD -{'>'} main</span>
          </div>
        </div>
      </div>
    </section>
  )
}
