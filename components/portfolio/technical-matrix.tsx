'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { bulletData } from '../terminal-cursor'

type TreeNode = {
  name: string
  children?: TreeNode[]
}

const rootTree: TreeNode = {
  name: 'active-stack/',
  children: [
    {
      name: 'modeling/',
      children: [
        { name: 'python' },
        { name: 'pytorch' },
        { name: 'numpy' },
        { name: 'gnn' },
        { name: 'stp-algebra' },
      ],
    },
    {
      name: 'backend/',
      children: [
        { name: 'go' },
        { name: 'fastapi' },
        { name: 'postgres' },
        { name: 'kdb-q' },
      ],
    },
    {
      name: 'frontend/',
      children: [
        { name: 'typescript' },
        { name: 'react' },
        { name: 'tailwind' },
        { name: 'nextjs' },
      ],
    },
    {
      name: 'research/',
      children: [
        { name: 'r' },
        { name: 'depmap' },
        { name: 'systems-biology' },
      ],
    },
    {
      name: 'infra/',
      children: [
        { name: 'docker' },
        { name: 'vercel' },
        { name: 'supabase' },
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
  const branchChar = isLast ? '└── ' : '├── '
  const linePrefix = prefix + branchChar
  const isRoot = depth === 0
  const isCategory = !!node.children

  const lines: TreeLine[] = [{ name: node.name, prefix: linePrefix, isRoot, isCategory }]

  if (node.children) {
    const childPrefix = prefix + (isLast ? '    ' : '│   ')
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
      if (/[\s\/│├└─]/.test(char)) return char
      return Math.random() < 0.45 ? garbleChar() : char
    })
    .join('')
}

type Asteroid = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

type Particle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

const ASTEROID_SPEEDS = [0.4, 0.6, 0.8]
const SPAWN_INTERVALS = [4000, 3000, 2000]

export function TechnicalMatrix() {
  const [hp, setHp] = useState(3)
  const glitchedRef = useRef<Set<number>>(new Set())
  const [, forceRender] = useState(0)
  const [showDirections, setShowDirections] = useState(false)
  const [score, setScore] = useState(0)
  const [wave, setWave] = useState(1)
  const [waveFlash, setWaveFlash] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)

  // Particle refs
  const particlesRef = useRef<Particle[]>([])
  const particleElsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const particlesContainerRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)

  // Wave tracking refs
  const totalTimeRef = useRef(0)
  const prevWaveRef = useRef(1)
  const waveFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const asteroidSpeedRef = useRef(ASTEROID_SPEEDS[0])

  // Game state refs (mutable, no re-render)
  const asteroidsRef = useRef<Asteroid[]>([])
  const asteroidElsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const asteroidContainerRef = useRef<HTMLDivElement>(null)
  const asteroidIdRef = useRef(0)
  const spawnAccumRef = useRef(0)
  const nextSpawnRef = useRef(2000 + Math.random() * 2000)
  const gameRunningRef = useRef(true)

  const treeLines = useMemo(() => flattenTree(rootTree, '', true, 0), [])

  const handleHit = useCallback(() => {
    setHp((h) => {
      const next = Math.max(0, h - 1)
      const count = 2 + Math.floor(Math.random() * 2)
      const nextGlitched = new Set(glitchedRef.current)
      for (let i = 0; i < count; i++) {
        nextGlitched.add(Math.floor(Math.random() * treeLines.length))
      }
      glitchedRef.current = nextGlitched
      forceRender((v) => v + 1)
      if (next <= 0) {
        gameRunningRef.current = false
      }
      return next
    })
  }, [treeLines.length])

  const getTreeRect = useCallback(() => {
    return document.getElementById('matrix-card')?.getBoundingClientRect() ?? null
  }, [])

  const getSectionRect = useCallback(() => {
    return document.getElementById('matrix')?.getBoundingClientRect() ?? null
  }, [])

  const spawnAsteroid = useCallback(() => {
    const sectionRect = getSectionRect()
    const treeRect = getTreeRect()
    if (!sectionRect || !treeRect) return

    const side = Math.random() < 0.5 ? 0 : 1
    let x: number, y: number

    if (side === 0) {
      // Left edge of section
      x = sectionRect.left - 40
    } else {
      // Right edge of section
      x = sectionRect.right + 40
    }
    y = sectionRect.top + Math.random() * sectionRect.height

    const cx = treeRect.left + treeRect.width / 2
    const cy = treeRect.top + treeRect.height / 2
    const dx = cx - x
    const dy = cy - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const speed = asteroidSpeedRef.current + Math.random() * 0.4

    const asteroid: Asteroid = {
      id: asteroidIdRef.current++,
      x,
      y,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      size: 36 + Math.random() * 12,
    }

    asteroidsRef.current.push(asteroid)

    // Create DOM element — outer wrapper for positioning, inner for CSS rotation
    const opacity = 0.4 + Math.random() * 0.3
    const rotDuration = 3 + Math.random() * 4
    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      position: fixed;
      left: ${asteroid.x}px;
      top: ${asteroid.y}px;
      transform: translate(-50%, -50%);
      z-index: 50;
      pointer-events: none;
    `
    const inner = document.createElement('div')
    inner.style.cssText = `
      width: ${asteroid.size}px;
      height: ${asteroid.size}px;
      background-color: #22d3ee;
      opacity: ${opacity};
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      animation: asteroid-spin ${rotDuration}s linear infinite;
    `
    wrapper.appendChild(inner)
    asteroidContainerRef.current?.appendChild(wrapper)
    asteroidElsRef.current.set(asteroid.id, wrapper)

    forceRender((v) => v + 1)
  }, [getTreeRect, getSectionRect])

  const createPopEffect = useCallback((x: number, y: number) => {
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 24px;
      height: 24px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, #22d3ee 0%, rgba(34,211,238,0.3) 50%, transparent 70%);
      border-radius: 50%;
      z-index: 60;
      pointer-events: none;
      transition: all 0.25s ease-out;
    `
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      el.style.transform = 'translate(-50%, -50%) scale(2.5)'
      el.style.opacity = '0'
    })
    setTimeout(() => el.remove(), 250)
  }, [])

  const spawnParticles = useCallback((x: number, y: number) => {
    const count = 6 + Math.floor(Math.random() * 3) // 6-8
    const colors = ['#f97316', '#facc15', '#ef4444']
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 3
      const particle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20,
        maxLife: 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
      particlesRef.current.push(particle)

      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: ${particle.color};
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 60;
        pointer-events: none;
      `
      particlesContainerRef.current?.appendChild(el)
      particleElsRef.current.set(particle.id, el)
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (hp <= 0) {
      gameRunningRef.current = false
      // Clear remaining asteroid DOM elements
      asteroidElsRef.current.forEach((el) => el.remove())
      asteroidElsRef.current.clear()
      asteroidsRef.current = []
      // Clear particles
      particleElsRef.current.forEach((el) => el.remove())
      particleElsRef.current.clear()
      particlesRef.current = []
      return
    }

    gameRunningRef.current = true
    let rafId: number
    let prevTime = 0
    totalTimeRef.current = 0
    prevWaveRef.current = 1
    asteroidSpeedRef.current = ASTEROID_SPEEDS[0]

    const tick = (time: number) => {
      if (!gameRunningRef.current) {
        cancelAnimationFrame(rafId)
        return
      }

      const dt = prevTime ? time - prevTime : 16
      prevTime = time

      // Wave escalation — every 15s of cumulative runtime
      totalTimeRef.current += dt
      const newWave = Math.floor(totalTimeRef.current / 15000) + 1
      if (newWave !== prevWaveRef.current) {
        prevWaveRef.current = newWave
        setWave(newWave)
        const waveIdx = Math.min(newWave - 1, ASTEROID_SPEEDS.length - 1)
        asteroidSpeedRef.current = ASTEROID_SPEEDS[waveIdx]
        setWaveFlash(`WAVE ${newWave}`)
        if (waveFlashTimeoutRef.current) clearTimeout(waveFlashTimeoutRef.current)
        waveFlashTimeoutRef.current = setTimeout(() => setWaveFlash(null), 2000)
      }

      const waveIdx = Math.min(
        Math.max(Math.floor(totalTimeRef.current / 15000), 0),
        SPAWN_INTERVALS.length - 1
      )
      const spawnInterval = SPAWN_INTERVALS[waveIdx]

      // Spawn timer
      spawnAccumRef.current += dt
      if (spawnAccumRef.current >= nextSpawnRef.current) {
        spawnAccumRef.current = 0
        nextSpawnRef.current = spawnInterval + Math.random() * 1000
        spawnAsteroid()
      }

      const treeRect = getTreeRect()
      const asteroids = asteroidsRef.current
      const removedAsteroids: number[] = []
      let bulletDestroyed = false

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]

        // Skip already-removed
        if (removedAsteroids.includes(a.id)) continue

        // Move
        a.x += a.vx
        a.y += a.vy

        // Update DOM element (wrapper)
        const el = asteroidElsRef.current.get(a.id)
        if (el) {
          el.style.left = `${a.x}px`
          el.style.top = `${a.y}px`
        }

        // Bullet-asteroid collision
        let bulletHit = false
        for (let bi = 0; bi < bulletData.length; bi++) {
          const b = bulletData[bi]
          const dx = b.x - a.x
          const dy = b.y - a.y
          if (Math.sqrt(dx * dx + dy * dy) < 25) {
            bulletHit = true
            break
          }
        }

        if (bulletHit) {
          createPopEffect(a.x, a.y)
          spawnParticles(a.x, a.y)
          setScore((s) => s + 1)
          bulletDestroyed = true
          removedAsteroids.push(a.id)
          continue
        }

        // Asteroid-tree collision — check if asteroid center is within card's rect
        if (treeRect) {
          if (
            a.x >= treeRect.left &&
            a.x <= treeRect.right &&
            a.y >= treeRect.top &&
            a.y <= treeRect.bottom
          ) {
            removedAsteroids.push(a.id)
            setShaking(true)
            setTimeout(() => setShaking(false), 300)
            handleHit()
            continue
          }
        }
      }

      // Remove destroyed asteroids
      if (removedAsteroids.length > 0) {
        asteroidsRef.current = asteroids.filter((a) => !removedAsteroids.includes(a.id))
        removedAsteroids.forEach((id) => {
          const el = asteroidElsRef.current.get(id)
          if (el) {
            el.remove()
            asteroidElsRef.current.delete(id)
          }
        })
        forceRender((v) => v + 1)
      }

      // Update particles
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life--

        const pel = particleElsRef.current.get(p.id)
        if (pel) {
          pel.style.left = `${p.x}px`
          pel.style.top = `${p.y}px`
          pel.style.opacity = `${Math.max(0, p.life / p.maxLife)}`
        }

        if (p.life <= 0) {
          const pel2 = particleElsRef.current.get(p.id)
          if (pel2) pel2.remove()
          particleElsRef.current.delete(p.id)
          particles.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [hp, spawnAsteroid, getTreeRect, handleHit, createPopEffect, spawnParticles])

  const reset = () => {
    setHp(3)
    setScore(0)
    setWave(1)
    setWaveFlash(null)
    setShaking(false)
    glitchedRef.current = new Set()
    totalTimeRef.current = 0
    prevWaveRef.current = 1
    asteroidSpeedRef.current = ASTEROID_SPEEDS[0]
    // Clear any lingering particles
    particleElsRef.current.forEach((el) => el.remove())
    particleElsRef.current.clear()
    particlesRef.current = []
    if (waveFlashTimeoutRef.current) clearTimeout(waveFlashTimeoutRef.current)
    gameRunningRef.current = true
    forceRender((v) => v + 1)
  }

  const isCorrupted = hp <= 0

  return (
    <section id="matrix" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes asteroid-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      {/* Asteroid container for game asteroids */}
      <div ref={asteroidContainerRef} aria-hidden />
      {/* Particles container */}
      <div ref={particlesContainerRef} aria-hidden />

      {/* Game directions button */}
      <button
        onClick={() => setShowDirections((v) => !v)}
        className="absolute top-6 right-6 md:top-8 md:right-12 lg:right-20 z-10 w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs font-mono text-muted-foreground opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="Game directions"
      >
        ?
      </button>

      {/* Directions popup */}
      {showDirections && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40"
          onClick={() => setShowDirections(false)}
        >
          <div
            className="bg-card border border-border rounded-sm p-6 max-w-sm mx-4 font-mono text-sm text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-lg mb-3 text-accent">DEFEND THE TECH TREE</div>
            <p className="mb-2 text-muted-foreground">
              Asteroids are drifting toward your skill tree.
            </p>
            <p className="mb-2 text-muted-foreground">
              Shoot them down with your ship&apos;s guns.
            </p>
            <p className="mb-4 text-muted-foreground">Survive as long as you can.</p>
            <button
              onClick={() => setShowDirections(false)}
              className="w-full py-2 border border-accent/50 text-accent hover:bg-accent/10 transition-colors rounded-sm cursor-pointer text-xs"
            >
              [CLICK TO DISMISS]
            </button>
          </div>
        </div>
      )}

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
      <div
        id="matrix-card"
        className={`border border-border bg-card rounded-sm overflow-hidden max-w-[420px] mx-auto relative${shaking ? ' shake' : ''}`}
      >
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
          <span className="ml-4 font-mono text-xs text-muted-foreground">tree</span>
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
            <div className="font-mono text-sm leading-relaxed mx-auto max-w-2xl">
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

        {/* Wave flash overlay */}
        {waveFlash && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span
              className="font-mono text-lg font-bold text-accent"
              style={{ animation: 'fadeOut 2s ease-out forwards' }}
            >
              {waveFlash}
            </span>
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
            </span>
            {!isCorrupted && (
              <>
                <span className="ml-3 text-muted-foreground/50">
                  | SCORE: {score}
                </span>
                <span className="ml-3 text-muted-foreground/50">
                  | HP: {'■'.repeat(hp)}
                  {'□'.repeat(3 - hp)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
