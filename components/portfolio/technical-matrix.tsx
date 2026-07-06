'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

type TreeNode = {
  name: string
  children?: TreeNode[]
}

const rootTree: TreeNode = {
  name: "active-stack/",
  children: [
    {
      name: "modeling/",
      children: [
        { name: "python" },
        { name: "pytorch" },
        { name: "numpy" },
        { name: "gnn" },
        { name: "stp-algebra" },
      ],
    },
    {
      name: "backend/",
      children: [
        { name: "go" },
        { name: "fastapi" },
        { name: "postgres" },
        { name: "kdb-q" },
      ],
    },
    {
      name: "frontend/",
      children: [
        { name: "typescript" },
        { name: "react" },
        { name: "tailwind" },
        { name: "nextjs" },
      ],
    },
    {
      name: "research/",
      children: [
        { name: "r" },
        { name: "depmap" },
        { name: "systems-biology" },
      ],
    },
    {
      name: "infra/",
      children: [
        { name: "docker" },
        { name: "vercel" },
        { name: "supabase" },
      ],
    },
  ],
}

type TreeLine = {
  name: string
  prefix: string
  isRoot: boolean
  isCategory: boolean
}

function flattenTree(node: TreeNode, prefix: string, isLast: boolean, depth: number): TreeLine[] {
  const branchChar = isLast ? "└── " : "├── "
  const linePrefix = prefix + branchChar
  const isRoot = depth === 0
  const isCategory = !!node.children

  const lines: TreeLine[] = [
    { name: node.name, prefix: linePrefix, isRoot, isCategory },
  ]

  if (node.children) {
    const childPrefix = prefix + (isLast ? "    " : "│   ")
    node.children.forEach((child, i) => {
      lines.push(
        ...flattenTree(child, childPrefix, i === node.children!.length - 1, depth + 1)
      )
    })
  }

  return lines
}

const SYMBOLS = '@#$%&!?*'

function garbleChar(): string {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}

function garbleText(text: string): string {
  return text
    .split('')
    .map((char) => {
      // Keep tree-drawing characters, slashes, and spaces intact
      if (/[\s\/│├└─]/.test(char)) return char
      return Math.random() < 0.45 ? garbleChar() : char
    })
    .join('')
}

export function TechnicalMatrix() {
  const [hp, setHp] = useState(3)
  const glitchedRef = useRef<Set<number>>(new Set())
  const [, forceRender] = useState(0)

  const treeLines = useMemo(() => flattenTree(rootTree, '', true, 0), [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setHp((h) => {
        const next = Math.max(0, h - 1)
        // When hit, add 2-3 random line indices to glitch set
        const count = 2 + Math.floor(Math.random() * 2)
        const nextGlitched = new Set(glitchedRef.current)
        for (let i = 0; i < count; i++) {
          nextGlitched.add(Math.floor(Math.random() * treeLines.length))
        }
        glitchedRef.current = nextGlitched
        forceRender((v) => v + 1)
        return next
      })
    }
    window.addEventListener('tree-hit', handler)
    return () => window.removeEventListener('tree-hit', handler)
  }, [treeLines.length])

  const reset = () => {
    setHp(3)
    glitchedRef.current = new Set()
    forceRender((v) => v + 1)
  }

  // Generate 6 random asteroid positions/animation params (stable across renders)
  const asteroids = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      left: 3 + Math.random() * 94,
      top: 2 + Math.random() * 96,
      dur: 10 + Math.random() * 5,
      dx: -50 + Math.random() * 100,
      dy: -50 + Math.random() * 100,
      delay: Math.random() * 5,
      key: i,
    }))
  }, [])

  const isCorrupted = hp <= 0

  return (
    <section
      id="matrix"
      className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28"
    >
      {/* Asteroids — only visible when HP > 0 */}
      {hp > 0 &&
        asteroids.map((a) => (
          <div
            key={a.key}
            className="absolute pointer-events-none"
            style={{
              left: `${a.left}%`,
              top: `${a.top}%`,
              width: 8,
              height: 8,
              backgroundColor: '#22d3ee',
              opacity: 0.4,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              animation: `asteroid-drift ${a.dur}s linear ${a.delay}s infinite alternate`,
              '--dx': `${a.dx}px`,
              '--dy': `${a.dy}px`,
            } as React.CSSProperties}
            aria-hidden
          />
        ))}

      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> cat ./tech_tree
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Tech Tree
        </h2>
      </div>

      {/* Terminal-style container with CRT scan lines */}
      <div className="border border-border bg-card rounded-sm overflow-hidden max-w-xl mx-auto relative">
        {/* CRT scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            zIndex: 1,
          }}
        />
        {/* Cyan glow on border */}
        <div
          className="absolute -inset-px rounded-sm pointer-events-none opacity-20"
          style={{
            boxShadow:
              '0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.05)',
            zIndex: 0,
          }}
        />
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">
            tree
          </span>
        </div>

        {/* Tree content — normal or corrupted */}
        {isCorrupted ? (
          <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[240px]">
            <div className="font-mono text-xl md:text-2xl text-red-500 font-bold mb-6">
              TREE CORRUPTED
            </div>
            <button
              onClick={reset}
              className="font-mono text-sm px-6 py-2 border border-accent/50 text-accent hover:bg-accent/10 transition-colors rounded-sm cursor-pointer"
            >
              RETRY
            </button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="font-mono text-sm leading-relaxed">
              {treeLines.map((line, idx) => {
                const isGlitched = glitchedRef.current.has(idx)
                let textClass = 'text-foreground'
                if (line.isRoot) textClass = 'text-primary'
                else if (line.isCategory) textClass = 'text-accent'

                const displayName = isGlitched ? garbleText(line.name) : line.name

                return (
                  <div key={idx} className="leading-relaxed whitespace-pre">
                    {line.prefix}
                    <span className={textClass}>{displayName}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Terminal footer */}
        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground">
            <span
              className="text-accent"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            >
              {isCorrupted ? 'OFFLINE' : 'READY'}
            </span>{' '}
            | {treeLines.length} nodes
            {!isCorrupted && (
              <span className="ml-3 text-muted-foreground/50">
                | HP: {'■'.repeat(hp)}
                {'□'.repeat(3 - hp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Asteroid drift keyframes injected once */}
      <style jsx>{`
        @keyframes asteroid-drift {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(var(--dx), var(--dy));
          }
          50% {
            transform: translate(
              calc(var(--dx) * 1.2),
              calc(var(--dy) * -0.6)
            );
          }
          75% {
            transform: translate(
              calc(var(--dx) * -0.4),
              calc(var(--dy) * 0.8)
            );
          }
          100% {
            transform: translate(
              calc(var(--dx) * 0.3),
              calc(var(--dy) * -1.1)
            );
          }
        }
      `}</style>
    </section>
  )
}
