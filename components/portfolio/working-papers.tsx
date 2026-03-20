"use client"

import Link from "next/link"
import { useRef } from "react"
import { GitCommit, Clock, ChevronDown, ChevronUp } from "lucide-react"

interface BlogEntry {
  slug: string
  hash: string
  date: string
  title: string
  status: "published" | "in-progress" | "draft"
}

const blogEntries: BlogEntry[] = [
  {
    slug: "engineering-cell-part-1",
    hash: "a1b2c3d",
    date: "2026-03-20",
    title: "The 17,000-Dimensional Elephant",
    status: "published",
  },
  {
    slug: "engineering-cell-part-2",
    hash: "e4f5g6h",
    date: "2026-03-20",
    title: "Breaking the 0.5 Deadlock",
    status: "published",
  },
  {
    slug: "engineering-cell-part-3",
    hash: "i7j8k9l",
    date: "2026-03-20",
    title: "Turning Cells into Matrices",
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

const SCROLL_THRESHOLD = 4

export function WorkingPapers() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const showScrollArrows = blogEntries.length > SCROLL_THRESHOLD

  const scroll = (direction: "up" | "down") => {
    const el = scrollRef.current
    if (!el) return
    const amount = 120
    el.scrollBy({ top: direction === "down" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> git log --blog --oneline
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Blog
        </h2>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          Engineering a Cell: From 17,000 Dimensions to a Single Matrix
        </p>
      </div>

      {/* Git-style log */}
      <div className="border border-border bg-card rounded-sm overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <GitCommit className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">blog.log</span>
        </div>

        {/* Log entries + optional scroll arrows */}
        <div className="flex">
          <div
            ref={scrollRef}
            className={`flex-1 divide-y divide-border ${showScrollArrows ? "max-h-[320px] overflow-y-auto" : ""}`}
          >
            {blogEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blog/${entry.slug}`}
                className="block p-4 md:p-6 hover:bg-secondary/20 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                  <div className="flex items-center gap-4 md:w-48 shrink-0">
                    <code className="font-mono text-sm text-primary">
                      {entry.hash}
                    </code>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono text-xs">{entry.date}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                      {entry.title}
                    </p>
                  </div>
                  <div className="md:w-24 shrink-0">
                    <span className={`font-mono text-xs ${statusColors[entry.status]}`}>
                      [{statusLabels[entry.status]}]
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {showScrollArrows && (
            <div className="flex flex-col border-l border-border bg-secondary/30 p-1 shrink-0">
              <button
                type="button"
                onClick={() => scroll("up")}
                className="p-2 hover:bg-secondary/50 rounded transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Scroll up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("down")}
                className="p-2 hover:bg-secondary/50 rounded transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Scroll down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground flex items-center justify-between">
            <span>
              <span className="text-primary">{blogEntries.length}</span> entries |
              <span className="text-accent ml-1">{blogEntries.filter(e => e.status === "published").length}</span> merged
            </span>
            <span className="text-muted-foreground">HEAD -{">"} main</span>
          </div>
        </div>
      </div>
    </section>
  )
}
