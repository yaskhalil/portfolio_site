import { Hero } from "@/components/portfolio/hero"
import { TechnicalMatrix } from "@/components/portfolio/technical-matrix"
import { Projects } from "@/components/portfolio/projects"
import { DitchFeed } from "@/components/ditch-feed"
import { WorkingPapers } from "@/components/portfolio/working-papers"
import { TerminalCTA } from "@/components/portfolio/terminal-cta"
import { TerminalNav } from "@/components/terminal-nav"

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <TerminalNav />
      <TechnicalMatrix />
      <Projects />
      <DitchFeed />
      <WorkingPapers />
      <TerminalCTA />
    </main>
  )
}
