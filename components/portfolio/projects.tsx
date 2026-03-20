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
  documentationUrl?: string
  documentationLabel?: string
  documentationError?: boolean
}

const projects: Project[] = [
  {
    id: "bocm-talii",
    title: "Applied Systems Engineering",
    subtitle: "BOCM / Talii",
    description: "Full-stack mobile/web cosmetologist marketplace. Architected robust user auth and multi-party payment routing (barber payouts). Optimized with AI-assisted code generation.",
    tags: ["Full-Stack", "Mobile", "Payment Routing", "Auth"],
    documentationUrl: "https://github.com/yaskhalil/talii",
    documentationLabel: "view_documentation",
  },
  {
    id: "axiom",
    title: "Startup Infrastructure",
    subtitle: "Axiom",
    description: "Conceptual AI agent gateway. Unified system interactions for Slack, Google Workspace, Square, and Sentry APIs.",
    tags: ["AI Agents", "API Gateway", "System Integration"],
    documentationUrl: "https://github.com/AxiomAPI/MVP",
    documentationLabel: "view_documentation",
  },
  {
    id: "boolean-dynamics",
    title: "Mathematical Inquiry & Intervention Scoring",
    subtitle: "STP vs Regression | pyMaBoSS | Boolean subnets -> PPI",
    description: "Efficiency-Fidelity benchmark comparing Semi-Tensor Product (STP) algebraic linearization (exact logic preservation) vs multivariate least-squares regression (scalable dynamics) for cancer signaling circuits. Implementing both linearizations against stochastic Boolean networks with pyMaBoSS, starting from gene-expression driven circuits to evaluate behavior under drug-like perturbations. Developing intervention scoring approaches, transitioning from rule-curated Boolean subnets (~50-200 nodes) toward larger PPI graph structures.",
    tags: ["STP", "pyMaBoSS", "Boolean Networks", "Interventions", "PPI", "Statistical Analysis"],
    hasGraphPlaceholders: true,
    documentationUrl: "https://github.com/yaskhalil/Benchmark-STP-vs-MLLR",
    documentationLabel: "view_documentation",
  },
  {
    id: "levin-telematics",
    title: "Levin Telematics Airflow Data Platform",
    subtitle: "Airflow 3 / Astronomer CLI + Postgres",
    description: "Production-style Airflow 3 pipeline ingests partitioned Levin vehicle telemetry, normalizes fields into a canonical schema, and generates curated daily rollups. Enforced idempotent loads (safe reruns/backfills via unique event keys), dynamic task mapping for date-range backfills, and run-level artifacts for operational visibility. Data contract validations: schema/type/range checks (timestamp parseability, non-null vehicle IDs, plausible bounds for speed/RPM/temp) with quality stats per partition.",
    tags: ["Airflow 3", "Astronomer CLI", "Postgres", "Idempotency", "Telemetry"],
    documentationUrl: "https://github.com/yaskhalil/levin-telematics-orchestration",
    documentationLabel: "view_documentation",
  },
  {
    id: "vehicle-health-monitoring",
    title: "Vehicle Health Monitoring Pipeline",
    subtitle: "BiLSTM + attention (seq anomalies) + DBSCAN (hotspots)",
    description: "End-to-end vehicle health neural network using bi-directional LSTM with attention; improved anomaly detection accuracy from 40-60% to 87-95% through iterative retraining on 30K+ telemetry points every 10 minutes. Three-tier anomaly detection: LSTM for sequential insights, DBSCAN for geographic hotspot clustering; 33% increase in predictive reliability across simulated fleets. FastAPI microservices on Railway with Supabase integration.",
    tags: ["PyTorch", "BiLSTM", "Attention", "DBSCAN", "FastAPI"],
    documentationLabel: "error_code_classified",
    documentationError: true,
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
                <div className="mt-6 pt-4 border-t border-border">
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
