import { Hero } from "@/components/portfolio/hero"
import { TechnicalMatrix } from "@/components/portfolio/technical-matrix"
import { Projects } from "@/components/portfolio/projects"
import { WorkingPapers } from "@/components/portfolio/working-papers"
import { TerminalCTA } from "@/components/portfolio/terminal-cta"

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <TechnicalMatrix />
      <Projects />
      <WorkingPapers />
      <TerminalCTA />
    </main>
  )
}
