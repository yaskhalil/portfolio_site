"use client"

import { AsciiMesh } from "./ascii-mesh"

export function Hero() {
  return (
    <section className="relative">
      {/* ASCII mesh - inspired by p5js-ascii-renderer, cycles every 5s with morph transition */}
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
          <span className="text-primary">render</span>_cycle: 5s
        </div>
      </div>

      {/* Hero Text */}
      <div className="mt-12 md:mt-16 px-6 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-foreground leading-tight text-balance">
          <span className="text-primary">[</span>Yaseen Khalil<span className="text-primary">]</span>
          <span className="text-muted-foreground mx-3">|</span>
          <span className="block md:inline">Systems Architect &amp; Quantitative Modeler</span>
        </h1>
        
        <p className="mt-6 md:mt-8 font-mono text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          <span className="text-primary">{'>'}</span> Specializing in advanced statistical dynamics, AI agent gateways, and high-dimensional state modeling.
        </p>
      </div>
    </section>
  )
}
