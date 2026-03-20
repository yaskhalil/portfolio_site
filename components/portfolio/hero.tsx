"use client"

export function Hero() {
  return (
    <section className="relative">
      {/* WebGL Placeholder - Empty div for 3D network mesh */}
      <div 
        className="w-full h-[60vh] md:h-[70vh] bg-secondary/30 border border-border relative overflow-hidden"
        aria-label="WebGL 3D network mesh placeholder"
      >
        {/* Grid overlay for visual effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Corner markers */}
        <div className="absolute top-4 left-4 font-mono text-xs text-muted-foreground">
          <span className="text-primary">//</span> webgl.canvas
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-xs text-muted-foreground">
          <span className="text-primary">mesh</span>_initialized: true
        </div>
        
        {/* Center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center font-mono text-muted-foreground/50 text-sm">
            <div className="w-20 h-20 border border-dashed border-border rounded-sm mx-auto mb-4 flex items-center justify-center">
              <span className="text-primary">&lt;/&gt;</span>
            </div>
            <p>3D_NETWORK_MESH</p>
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <div className="mt-12 md:mt-16 px-6 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-foreground leading-tight text-balance">
          <span className="text-primary">[</span>Your Name<span className="text-primary">]</span>
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
