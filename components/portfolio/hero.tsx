"use client"

import Link from "next/link"
import { AsciiMesh } from "./ascii-mesh"
import { useState, useEffect } from "react"

const MESH_CODE_HREF = "https://github.com/yaskhalil/portfolio_site/blob/main/components/portfolio/ascii-mesh.tsx"

const SUBTITLE = "Exploring the mathematical architecture of intelligent systems. Bridging high-dimensional feature engineering with production data pipelines and autonomous AI integrations."

export function Hero() {
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(true)
  const [cursor, setCursor] = useState(true)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        i++
        setText(SUBTITLE.slice(0, i))
        if (i >= SUBTITLE.length) {
          clearInterval(iv)
          setTyping(false)
          setCursor(false)
        }
      }, 40)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!typing) {
      const iv = setInterval(() => setBlink(v => !v), 1000)
      return () => clearInterval(iv)
    }
  }, [typing])

  useEffect(() => {
    if (!typing) return
    const iv = setInterval(() => setCursor(v => !v), 530)
    return () => clearInterval(iv)
  }, [typing])

  return (
    <section className="relative">
      {/* ASCII mesh — morph cycle ~17.5s */}
      <div 
        className="relative w-full h-[85vh] md:h-[90vh] bg-secondary/30 border border-border overflow-hidden"
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
        <div className="absolute top-4 right-4 md:right-12 lg:right-20 z-10 text-right font-mono text-xs text-muted-foreground space-y-1">
          <div>
            <span className="text-primary">render</span>_cycle: 17.5s
          </div>
          <div>
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
      </div>

      {/* Hero Text — overlay panel on the mesh */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-20 py-8 md:py-10 bg-background/70 backdrop-blur-sm border-t border-border">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-foreground leading-tight text-balance">
              <span className="text-primary">[</span>Yaseen Khalil<span className="text-primary">]</span>
              <span className="text-muted-foreground mx-3">|</span>
              <span className="block md:inline">Computational Modeler &amp; ML Systems Architect</span>
            </h1>
            <p className="mt-4 md:mt-5 font-mono text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
              <span className="text-primary" style={{ opacity: typing ? 1 : (blink ? 1 : 0.3) }}>{'>'}</span> {text}{cursor && <span>_</span>}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-1 font-mono text-xs text-muted-foreground shrink-0 pb-1" aria-hidden>
            <span>// scroll</span>
            <span className="animate-bounce">v</span>
          </div>
        </div>
      </div>
    </section>
  )
}
