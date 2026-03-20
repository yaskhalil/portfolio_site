"use client"

import { useState, useEffect } from "react"
import { Mail, Github, Linkedin } from "lucide-react"

export function TerminalCTA() {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-border">
      {/* Terminal Container */}
      <div className="border border-border bg-card rounded-sm overflow-hidden max-w-4xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">terminal — bash</span>
        </div>

        {/* Terminal content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Command output */}
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-accent">user@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">~</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">cat ./status.txt</span>
            </div>
            <div className="font-mono text-base md:text-lg text-foreground pl-0 md:pl-0">
              <span className="text-primary">{'>'}</span> Seeking a new challenge.
            </div>
          </div>

          {/* Links section */}
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-accent">user@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">~</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">ls ./contact</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pl-0 md:pl-0 pt-2">
              <a 
                href="mailto:yaskhalil2006@gmail.com"
                className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="group-hover:underline">email</span>
              </a>
              
              <a 
                href="https://github.com/yaskhalil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Github className="w-4 h-4" />
                <span className="group-hover:underline">github</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/yaseenkhalil/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Linkedin className="w-4 h-4" />
                <span className="group-hover:underline">linkedin</span>
              </a>
            </div>
          </div>

          {/* Blinking cursor line */}
          <div className="font-mono text-sm pt-4">
            <span className="text-accent">user@portfolio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-primary">~</span>
            <span className="text-muted-foreground">$ </span>
            <span 
              className={`inline-block w-2 h-4 bg-primary align-middle transition-opacity ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 font-mono text-xs text-muted-foreground">
        <span className="text-primary">&copy;</span> {new Date().getFullYear()} | Built with precision
      </div>
    </footer>
  )
}
