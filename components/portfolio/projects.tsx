"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  hasGraphPlaceholders?: boolean
}

const projects: Project[] = [
  {
    id: "bocm-talii",
    title: "Applied Systems Engineering",
    subtitle: "BOCM / Talii",
    description: "Full-stack mobile/web marketplace. Architected robust user auth and multi-party payment routing (barber payouts). Optimized with AI-assisted code generation.",
    tags: ["Full-Stack", "Mobile", "Payment Routing", "Auth"],
  },
  {
    id: "axiom",
    title: "Startup Infrastructure",
    subtitle: "Axiom",
    description: "Conceptual AI agent gateway. Unified system interactions for Slack, Google Workspace, Square, and Sentry APIs.",
    tags: ["AI Agents", "API Gateway", "System Integration"],
  },
  {
    id: "boolean-dynamics",
    title: "Mathematical Inquiry",
    subtitle: "Boolean Dynamics",
    description: "Benchmarking Semi-Tensor Product (STP) against Multivariate Regression for high-dimensional steady states.",
    tags: ["STP", "Statistical Analysis", "Research"],
    hasGraphPlaceholders: true,
  },
]

export function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>("bocm-talii")

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> ls ./projects --verbose
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Systems Architecture
        </h2>
      </div>

      {/* Projects Accordion */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="border border-border bg-card rounded-sm overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleProject(project.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors duration-200 group"
              aria-expanded={expandedId === project.id}
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-muted-foreground mt-1">
                  [{String(index).padStart(2, '0')}]
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-mono text-sm text-primary mt-1">
                    {project.subtitle}
                  </p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                  expandedId === project.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Accordion Content */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                expandedId === project.id ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 border-t border-border">
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
                  <span className="text-accent">{'>'}</span> {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 font-mono text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Graph Placeholders for Boolean Dynamics */}
                {project.hasGraphPlaceholders && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square border border-dashed border-border bg-secondary/20 rounded-sm flex items-center justify-center">
                      <div className="text-center font-mono text-xs text-muted-foreground">
                        <div className="w-12 h-12 border border-border mx-auto mb-2 flex items-center justify-center">
                          <span className="text-primary text-lg">G1</span>
                        </div>
                        <p>STP_BENCHMARK</p>
                      </div>
                    </div>
                    <div className="aspect-square border border-dashed border-border bg-secondary/20 rounded-sm flex items-center justify-center">
                      <div className="text-center font-mono text-xs text-muted-foreground">
                        <div className="w-12 h-12 border border-border mx-auto mb-2 flex items-center justify-center">
                          <span className="text-primary text-lg">G2</span>
                        </div>
                        <p>REGRESSION_ANALYSIS</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Project Link */}
                <div className="mt-6 pt-4 border-t border-border">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-accent transition-colors group"
                  >
                    <span>view_documentation</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
