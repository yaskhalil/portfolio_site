"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import SectionReveal from "@/components/section-reveal"

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
      "Created FlyGPlot (fly-g-plot.vercel.app), a Drosophila transcription-factor explorer that pipelines single-cell expression data through TF → module → functional enrichment analysis, integrating FlyBase, Ensembl, STRING-DB, g:Profiler, Enrichr, and NCBI GEO.",
      "Designing a KSG k-nearest-neighbor mutual-information pipeline that ranks split-GAL4 hemidriver (AD/DBD) gene pairs on continuous single-cell expression from the developing Drosophila optic lobe, capturing threshold and saturation effects that binary Jaccard/specificity heuristics discard.",
      "Validating KSG-derived rankings against previously validated split-GAL4 combinations from the literature, benchmarking against Spearman-correlation and Jaccard baselines to quantify recovery of known driver pairs.",
    ],
    tags: ["Machine Learning", "FlyGPlot", "scRNA-seq", "KSG-MI", "Split-GAL4"],
    documentationUrl: "https://fly-g-plot.vercel.app/",
    documentationLabel: "view_flygplot",
    statusLabel: "Research Ongoing",
  },
  {
    id: "vt-science",
    title: "Virginia Tech College of Science",
    subtitle: "Undergraduate Joint Researcher | On-site | Dec 2025 – Present",
    bullets: [
      "Developed STP-Diff, a differentiable framework that maps discrete Boolean gene-network dynamics onto a manifold via Semi-Tensor Product (STP) with an implicit Vector-Jacobian Product (VJP) operator, cutting complexity from O(4^N) to O(N·2^N) — a measured 353x speedup at N=20.",
      "Applied Projected Gradient Descent (PGD) adversarial attacks to expose the Rb-E2F axis as the vulnerability bottleneck of a 10-node mammalian cell-cycle model, validated against CRISPR-Cas9 knockout data from DepMap 25Q3 (1000+ cancer cell lines, p < 10^-6).",
      "Quantified network resilience through Epsilon-Critical search, establishing ε_critical = 2.8000 for the p53-Mdm2 DNA-damage circuit.",
    ],
    tags: ["PyTorch", "STP-Diff", "Semi-Tensor Product", "Adversarial ML", "Systems Biology"],
    documentationUrl: "https://doi.org/10.13140/RG.2.2.35274.32965",
    documentationLabel: "view_paper",
    statusLabel: "Preprint",
  },
  {
    id: "talii",
    title: "Talii",
    subtitle: "Co-Founder & Full-Stack Engineer | Hybrid | May 2025 – Mar 2026",
    bullets: [
      "Grew the platform to a live user base and shipped the full application end-to-end, replacing outdated barber booking platforms with a unified scheduling, client-management, and discovery experience.",
      "Engineered a cross-platform ecosystem using a unified TypeScript mono-repo and 110+ modular components, ensuring feature parity across web and native mobile applications.",
      "Designed and normalized a PostgreSQL schema to support distributed scheduling, entity locations, and analytics with scalable RLS-based security.",
    ],
    tags: ["TypeScript Mono-repo", "React Native", "PostgreSQL", "RLS Security"],
    documentationUrl: "https://github.com/yaskhalil/talii",
    documentationLabel: "view_code",
    statusLabel: "Code Available",
    statusUrl: "https://github.com/yaskhalil/talii",
  },
  {
    id: "la-unica",
    title: "La-Unica (Real Estate Startup)",
    subtitle: "Machine Learning Engineer & Front-End Developer | Contract",
    bullets: [
      "Developed machine learning models and front-end work for La-Unica, a venture-backed real estate startup — delivered under contract, with the platform front end built out as a proposed system.",
      "Joined the founding team on a project with multi-million-dollar VC backing and clients already waiting — leading all machine learning work.",
      "Specific architecture and model details are under NDA.",
    ],
    tags: ["Machine Learning", "Real Estate", "React", "Frontend"],
    documentationLabel: "details under NDA",
    statusLabel: "Under NDA",
  },
  {
    id: "honeyruns",
    title: "HoneyRuns",
    subtitle: "Machine Learning Engineer (Intern) | Remote | May 2025 – Jul 2025",
    bullets: [
      "Designed and deployed an end-to-end vehicle health monitoring neural network leveraging a bi-directional LSTM with attention mechanisms.",
      "Improved anomaly detection accuracy from 40-60% to 87-95% through iterative retraining on 30K+ telemetry points every 10 minutes.",
      "Architected a three-tier anomaly detection pipeline utilizing LSTM for sequential insights and DBSCAN for geographic hotspot clustering.",
      "Built scalable FastAPI microservices on Railway with Supabase integration, exposing telemetry insights via an internal dashboard UI.",
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
    subtitle: "Front-End Developer | Virginia Tech Diggeridoos | Jan 2025 – May 2025",
    bullets: [
      "Built the front end for Virginia Tech's Diggeridoos robotics team, turning Arduino telemetry into live visualizations of how the machine was operating.",
      "Led the movement-based visualization work: a 360° sonar-style heading view with a position dot, making facing direction and turning legible at a glance for the operator.",
      "Used React and modern front-end tooling, working on a team to convert raw sensor streams into an intuitive operator dashboard.",
    ],
    tags: ["React", "Arduino", "Data Visualization", "Robotics"],
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
          <SectionReveal key={project.id}>
          <div 
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
              className={`grid transition-all duration-300 ${
                expandedId === project.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
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
                        className="inline-flex items-center rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs text-primary hover:bg-primary/20 transition-colors"
                      >
                        {project.statusLabel}
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-sm border border-border bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground">
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
          </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}
