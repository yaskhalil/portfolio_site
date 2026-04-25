"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  documentationUrl?: string
  documentationLabel?: string
  documentationError?: boolean
  statusLabel?: string
  statusUrl?: string
}

const projects: Project[] = [
  {
    id: "bocm-talii",
    title: "Applied Systems Engineering",
    subtitle: "BOCM / Talii",
    description: "Built the end-to-end product foundation for a cosmetologist marketplace across web and mobile, with a focus on account reliability and multi-party transaction flows. The work centered on making core booking and payout operations dependable enough for daily production use.",
    tags: ["Full-Stack", "Mobile", "Payment Routing", "Auth"],
    documentationUrl: "https://github.com/yaskhalil/talii",
    documentationLabel: "view_documentation",
    statusLabel: "Code Available",
    statusUrl: "https://github.com/yaskhalil/talii",
  },
  {
    id: "axiom",
    title: "Startup Infrastructure",
    subtitle: "Axiom",
    description: "Designed an early-stage orchestration layer for AI agents to interact with core business platforms through one consistent interface. The intent was to reduce integration complexity so product teams could automate workflows without rebuilding connectors for each service.",
    tags: ["AI Agents", "API Gateway", "System Integration"],
    documentationUrl: "https://github.com/AxiomAPI/MVP",
    documentationLabel: "view_documentation",
    statusLabel: "Code Available",
    statusUrl: "https://github.com/AxiomAPI/MVP",
  },
  {
    id: "boolean-dynamics",
    title: "Computational Systems Biology Research",
    subtitle: "STP vs Regression | pyMaBoSS | Boolean subnets -> PPI",
    description: "Led a research direction centered on a Semi-Tensor-Product-based Graph Neural Network for cancer signaling analysis. The architecture uses STP operators to preserve logical structure while enabling differentiable learning, then integrates stochastic simulation outputs to study attractor behavior and intervention sensitivity as biological network scale increases.",
    tags: ["STP", "pyMaBoSS", "Boolean Networks", "Interventions", "PPI", "Statistical Analysis"],
    documentationUrl: "https://github.com/yaskhalil/Benchmark-STP-vs-MLLR",
    documentationLabel: "view_documentation",
    statusLabel: "ArXiv Publication Coming Soon",
  },
  {
    id: "levin-telematics",
    title: "Data Platform Engineering",
    subtitle: "Airflow 3 / Astronomer CLI + Postgres",
    description: "Engineered a production-oriented telemetry pipeline architecture with Airflow 3 and Postgres to transform raw vehicle streams into reliable analytics datasets. The workflow emphasizes replay-safe ingestion, backfill flexibility, and strong data contracts so downstream teams can trust operational and trend reporting.",
    tags: ["Airflow 3", "Astronomer CLI", "Postgres", "Idempotency", "Telemetry"],
    documentationUrl: "https://github.com/yaskhalil/levin-telematics-orchestration",
    documentationLabel: "view_documentation",
    statusLabel: "Posting Soon",
  },
  {
    id: "vehicle-health-monitoring",
    title: "ML Engineering for Fleet Reliability",
    subtitle: "HoneyRuns | Sequence modeling + anomaly detection",
    description: "Built and iterated on machine learning workflows for vehicle-health signal interpretation, combining sequence models and clustering to detect risk patterns before service disruption. This work translated high-volume telematics streams into practical maintenance intelligence that supports faster intervention planning.",
    tags: ["PyTorch", "BiLSTM", "Attention", "DBSCAN", "FastAPI"],
    documentationUrl: "https://www.honeyruns.com",
    documentationLabel: "visit_honeyruns",
    statusLabel: "Live",
    statusUrl: "https://www.honeyruns.com",
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

                {/* Graph Placeholders for Boolean Dynamics
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
                )} */}

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
                    <a
                      href={project.documentationUrl ?? "#"}
                      target={project.documentationUrl?.startsWith("http") ? "_blank" : undefined}
                      rel={project.documentationUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-accent transition-colors group"
                    >
                      <span>{project.documentationLabel ?? "view_documentation"}</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
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
