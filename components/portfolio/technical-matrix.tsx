"use client"

import SectionReveal from "@/components/section-reveal"

const skills = [
  {
    category: "Computational Modeling",
    items: [
      "High-Dimensional System Dynamics",
      "Semi-Tensor Product (STP) Algebra",
      "Graph Neural Networks (GNNs)",
      "Probabilistic Boolean Networks (PBNs)",
      "Stochastic Simulations",
      "Discrete Network Robustness",
    ],
  },
  {
    category: "Data Science & Machine Learning",
    items: [
      "Deep Learning (Bi-LSTM, Attention Mechanisms)",
      "High-Dimensional Data Analysis (KSG-KNN Estimators)",
      "Clustering Algorithms (DBSCAN)",
      "Neural Gene Expression Dynamics",
    ],
  },
  {
    category: "Software Engineering & Architecture",
    items: [
      "Microservices & API Design (FastAPI)",
      "Cross-Platform Mono-repos (TypeScript)",
      "Relational Schema & RLS Security (Postgres)",
      "Modular Frontend Component Architectures",
      "High-Throughput Streaming Telematics",
    ],
  },
  {
    category: "Languages (Primary)",
    items: ["Python", "Go", "Java", "R", "SQL"],
  },
  {
    category: "Languages (Secondary)",
    items: ["TypeScript", "Mojo", "KDB/q", "CSS"],
  },
  {
    category: "Athletics & Lifestyle",
    items: [
      "Brazilian Jiu-Jitsu",
      "MMA",
      "Boxing",
      "Weightlifting",
      "Running",
    ],
  },
]

export function TechnicalMatrix() {
  return (
    <section id="matrix" className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> cat ./technical_matrix
        </div>
        <SectionReveal>
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
            Technical Matrix
          </h2>
        </SectionReveal>
      </div>

      {/* Terminal-style container */}
      <div className="border border-border bg-card rounded-sm overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">skills.config</span>
        </div>

        {/* Skills grid */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {skills.map((group) => (
              <div key={group.category} className="space-y-4">
                <div className="font-mono text-xs text-primary uppercase tracking-wider">
                  {group.category}
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li 
                      key={item}
                      className="font-mono text-sm text-foreground flex items-start gap-2 group"
                    >
                      <span className="text-accent shrink-0 mt-1">{'>'}</span>
                      <span className="group-hover:text-primary transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal footer */}
        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-accent">READY</span> | {skills.reduce((acc, g) => acc + g.items.length, 0)} modules loaded
          </div>
        </div>
      </div>
    </section>
  )
}
