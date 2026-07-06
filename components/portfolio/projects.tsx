"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"

interface Project {
  id: string
  title: string
  subtitle: string
  description?: string
  bullets?: string[]
  tags: string[]
  documentationUrl?: string
  documentationLabel?: string
  documentationError?: boolean
  statusLabel?: string
  statusUrl?: string
}

const projects: Project[] = [
  {
    id: "temple-university",
    title: "Temple University",
    subtitle: "Machine Learning Research Intern | Hybrid | May 2026 – Present",
    bullets: [
      "Architecting analytical software to evaluate neural gene expression, focusing on high-dimensional system dynamics in developmental models.",
      "Implementing KSG k-Nearest Neighbors (KSG-KNN) estimators to process complex datasets, extracting novel computational metrics to accelerate laboratory investigation."
    ],
    tags: ["Machine Learning", "Neural Gene Expression", "KSG-KNN", "Systems Biology"],
    documentationLabel: "Research Ongoing",
  },
  {
    id: "vt-science",
    title: "Virginia Tech College of Science",
    subtitle: "Undergraduate Joint Researcher | On-site | Dec 2025 – Present",
    bullets: [
      "Architected a PyTorch-based Semi-Tensor Product Graph Neural Network (STP-GNN), engineering an algebraic transition operator using Khatri-Rao assembly to map discrete Boolean logic into a continuous, differentiable landscape scaled for 2²⁰+ state-space circuits.",
      "Condensed a 30-variable module from an unstable 1,140+ attractor space down to 3 functional basins, executing 10,000-trajectory stochastic simulations to mathematically prove absolute structural robustness within the system dynamics.",
      "Engineered gradient-directed perturbation algorithms to bypass invariant manifold bottlenecks, validating the architecture against discrete probabilistic baselines with <0.1% variance."
    ],
    tags: ["PyTorch", "STP-GNN", "State-Space", "Stochastic Simulation"],
    documentationUrl: "https://github.com/yaskhalil/Benchmark-STP-vs-MLLR",
    documentationLabel: "view_research_code",
    statusLabel: "ArXiv Publication Coming Soon",
  },
  {
    id: "talii",
    title: "Talii",
    subtitle: "Co-Founder & Full-Stack Engineer | Hybrid | May 2025 – Mar 2026",
    bullets: [
      "Engineered and launched a cross-platform ecosystem using a unified TypeScript mono-repo and 110+ modular components, ensuring feature parity across web and native mobile applications.",
      "Designed and normalized a PostgreSQL schema to support distributed scheduling, entity locations, and analytics with scalable RLS-based security."
    ],
    tags: ["TypeScript Mono-repo", "React Native", "PostgreSQL", "RLS Security"],
    documentationUrl: "https://github.com/yaskhalil/talii",
    documentationLabel: "view_code",
    statusLabel: "Code Available",
    statusUrl: "https://github.com/yaskhalil/talii",
  },
  {
    id: "honeyruns",
    title: "HoneyRuns",
    subtitle: "Machine Learning Engineer (Intern) | Remote | May 2025 – Jul 2025",
    bullets: [
      "Designed and deployed an end-to-end vehicle health monitoring neural network leveraging a bi-directional LSTM with attention mechanisms.",
      "Improved anomaly detection accuracy from 40-60% to 87-95% through iterative retraining on 30K+ telemetry points every 10 minutes.",
      "Architected a three-tier anomaly detection pipeline utilizing LSTM for sequential insights and DBSCAN for geographic hotspot clustering.",
      "Built scalable FastAPI microservices on Railway with Supabase integration, exposing telemetry insights via an internal dashboard UI."
    ],
    tags: ["BiLSTM", "Attention Mechanisms", "DBSCAN", "FastAPI", "Supabase"],
    documentationUrl: "https://www.honeyruns.com",
    documentationLabel: "visit_honeyruns",
    statusLabel: "Live",
    statusUrl: "https://www.honeyruns.com",
  },
  {
    id: "diggeridoos",
    title: "The Diggeridoos",
    subtitle: "Software Member | On-site | Jan 2025 – May 2025",
    bullets: [
      "Developed responsive web components and interactive front-end features utilizing JavaScript and React.js."
    ],
    tags: ["JavaScript", "React.js", "Frontend"],
    documentationLabel: "Academic Project",
  },
]

export function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>("temple-university")

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="projects" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
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
                expandedId === project.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 border-t border-border">
                {project.bullets ? (
                  <ul className="space-y-3 mb-6">
                    {project.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} className="font-mono text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="text-accent shrink-0 mt-1">{'>'}</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : project.description ? (
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
                    <span className="text-accent">{'>'}</span> {project.description}
                  </p>
                ) : null}

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

                {/* View Project Link */}
                <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
                  {project.statusLabel && (
                    project.statusUrl ? (
                      <a
                        href={project.statusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs text-primary hover:bg-primary/20 transition-colors"
                      >
                        {project.statusLabel}
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground">
                        {project.statusLabel}
                      </span>
                    )
                  )}
                  {project.documentationError ? (
                    <span className="inline-flex items-center gap-2 font-mono text-sm text-destructive">
                      {project.documentationLabel ?? "error_code_classified"}
                    </span>
                  ) : (
                    project.documentationUrl ? (
                      <a
                        href={project.documentationUrl}
                        target={project.documentationUrl.startsWith("http") ? "_blank" : undefined}
                        rel={project.documentationUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-accent transition-colors group"
                      >
                        <span>{project.documentationLabel ?? "view_documentation"}</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      project.documentationLabel && (
                        <span className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground">
                          {project.documentationLabel}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
