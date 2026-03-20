"use client"

const skills = [
  { category: "STATISTICAL_METHODS", items: ["Principal Component Analysis (PCA)", "Singular Value Decomposition (SVD)", "Multivariate Linear Regression"] },
  { category: "DYNAMICAL_SYSTEMS", items: ["Semi-Tensor Product (STP)", "Attractor Dynamics"] },
  { category: "LANGUAGES", items: ["Python (PyTorch)", "Java"] },
  { category: "INFRASTRUCTURE", items: ["Apache Airflow 3", "Full-Stack Architecture", "Payment Routing"] },
]

export function TechnicalMatrix() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> cat ./technical_matrix
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Technical Matrix
        </h2>
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
            {skills.map((group, groupIndex) => (
              <div key={group.category} className="space-y-4">
                <div className="font-mono text-xs text-primary">
                  [{String(groupIndex).padStart(2, '0')}] {group.category}
                </div>
                <ul className="space-y-2">
                  {group.items.map((item, itemIndex) => (
                    <li 
                      key={item}
                      className="font-mono text-sm text-foreground flex items-start gap-3 group"
                    >
                      <span className="text-muted-foreground">
                        {String(itemIndex + 1).padStart(2, '0')}
                      </span>
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
