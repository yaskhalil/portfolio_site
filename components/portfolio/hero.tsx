"use client"

import Link from "next/link"
import { AsciiMesh } from "./ascii-mesh"

const MESH_CODE_HREF = "https://github.com/yaskhalil/portfolio_site/blob/main/components/portfolio/ascii-mesh.tsx"

export function Hero() {
  return (
    <section className="relative">
      {/* ASCII mesh — morph cycle ~17.5s */}
      <div 
        className="w-full h-[60vh] md:h-[70vh] bg-secondary/30 border border-border relative overflow-hidden"
        aria-label="ASCII mesh visualization"
      >
        <AsciiMesh />
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Corner markers */}
        <div className="absolute top-4 left-4 font-mono text-xs text-muted-foreground z-10">
          <span className="text-primary">//</span> ascii.mesh
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-xs text-muted-foreground z-10">
          <span className="text-primary">render</span>_cycle: 17.5s
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <Link
            href={MESH_CODE_HREF}
            className="font-mono text-xs text-muted-foreground hover:text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
            {...(MESH_CODE_HREF.startsWith("http")
              ? { target: "_blank" as const, rel: "noopener noreferrer" }
              : {})}
          >
            <span className="text-primary">{'//'}</span> code for the mesh
          </Link>
        </div>
      </div>

      {/* Hero Text */}
      <div className="mt-12 md:mt-16 px-6 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-foreground leading-tight text-balance">
          <span className="text-primary">[</span>Yaseen Khalil<span className="text-primary">]</span>
          <span className="text-muted-foreground mx-3">|</span>
          <span className="block md:inline">Computational Modeler &amp; ML Systems Architect</span>
        </h1>
        <p className="mt-6 md:mt-8 font-mono text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          <span className="text-primary">{'>'}</span> Exploring the mathematical architecture of intelligent systems. Bridging high-dimensional feature engineering with production data pipelines and autonomous AI integrations.

        </p>
      </div>
    </section>
  )
}
