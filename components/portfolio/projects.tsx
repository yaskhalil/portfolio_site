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
      "Created FlyGPlot (fly-g-plot.vercel.app), a Drosophila transcription-factor explorer built around the lab's single-cell workflow: expression data flows through transcription-factor → co-expression module → functional enrichment stages, with a ledger-style interface and live integrations to FlyBase, Ensembl, STRING-DB, g:Profiler, Enrichr, and NCBI GEO so each stage hands off cleanly to the next.",
      "Researching how to improve split-GAL4 driver design: current hemidriver selection relies on binary overlap heuristics (Jaccard/specificity indices over thresholded expression patterns), which throw away the strength and shape of gene co-expression. I am designing a KSG k-nearest-neighbor mutual-information pipeline that ranks candidate AD/DBD pairs on continuous single-cell expression from the developing Drosophila optic lobe, capturing the threshold and saturation effects that standard correlation metrics miss.",
      "The validation plan is to first confirm KSG-derived rankings recover known, previously validated split-GAL4 combinations from the literature, then benchmark against Spearman-correlation and Jaccard baselines to quantify whether the added complexity measurably improves true-positive recovery — with the goal of proposing novel driver pairs for visual neuron types that currently lack genetic access tools.",
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
      "Developed STP-Diff, a framework that makes Boolean gene-regulatory networks differentiable: discrete dynamics are mapped onto a continuous manifold via Semi-Tensor Product (STP) representation with an implicit Vector-Jacobian Product (VJP) operator, cutting the exponential cost of explicit STP (O(4^N)) down to O(N·2^N) — a measured 353x speedup at N=20 with no numerical approximation, keeping attractor analysis tractable past the ~15-node wall.",
      "Applied Projected Gradient Descent (PGD) adversarial attacks — borrowed from computer vision — to find minimal logical perturbations that force phenotypic transitions, exposing the Rb-E2F axis as the vulnerability bottleneck of a 10-node mammalian cell-cycle model. The prediction held up empirically: stratified CRISPR-Cas9 knockout data from DepMap 25Q3 (1000+ cancer cell lines) showed Rb-loss lines become critically dependent on E2F (p < 10^-6).",
      "Built an Epsilon-Critical search that measures whole-network resilience as a single number, establishing ε_critical = 2.8000 for the p53-Mdm2 DNA-damage circuit — the perturbation magnitude where the network's negative feedback stops absorbing attacks and the apoptotic attractor takes over. Published as a preprint: DOI 10.13140/RG.2.2.35274.32965.",
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
      "Built Talii to replace outdated barber platforms: fragmented booking, no client retention, and no-shows plague the industry, so I co-founded and shipped a unified scheduling, client-management, and discovery platform end-to-end, growing it to a live user base.",
      "Engineered the whole ecosystem on a unified TypeScript mono-repo with 110+ modular components, keeping feature parity across web and native mobile so barbers and clients get the same experience on any device.",
      "Designed a normalized PostgreSQL schema with RLS-based security for distributed scheduling, entity locations, and analytics — permissions enforced at the database layer rather than in app code.",
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
      "Contracted as a machine learning engineer and front-end developer for La-Unica, a venture-backed real estate startup: I built the machine learning models and the platform front end as a proposed system — delivered under contract even though the site itself was not ultimately adopted.",
      "Joined the founding team on a project carrying multi-million-dollar VC backing with clients already waiting, and I lead all of the machine learning work for it.",
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
      "Designed and deployed an end-to-end vehicle health monitoring neural network — a bi-directional LSTM with attention — that catches developing faults in fleet telemetry before they become breakdowns.",
      "Iteratively retrained on 30K+ telemetry points every 10 minutes, lifting anomaly detection accuracy from 40-60% to 87-95%.",
      "Architected a three-tier detection pipeline — LSTM for sequential insight, DBSCAN for geographic hotspot clustering, and FastAPI microservices on Railway with Supabase feeding an internal dashboard UI.",
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
      "Built the front end for Virginia Tech's Diggeridoos robotics team, ingesting Arduino telemetry and turning it into live visualizations so the team could see how the machine was actually operating in real time.",
      "Led the movement-based visualization work: a 360° sonar-style heading view with a position dot that made facing direction and turning legible at a glance — operators could see where the machine was pointed instead of reading raw sensor values.",
      "Worked on a team using React and modern front-end tooling to convert raw sensor streams into an intuitive operator dashboard.",
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
