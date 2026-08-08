'use client'

import { useEffect, useRef } from 'react'

export const bulletData: { x: number; y: number; vx: number; vy: number }[] = []

export default function TerminalCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Leave the native cursor alone for touch devices and reduced-motion users
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqCoarse = window.matchMedia('(pointer: coarse)')
    if (mqReduced.matches || mqCoarse.matches) return

    const style = document.createElement('style')
    style.textContent = `body { cursor: none !important; }`
    document.head.appendChild(style)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const posRef = { x: 0, y: 0 }
    const targetRef = { x: 0, y: 0 }
    const prevPosRef = { x: 0, y: 0 }
    const lastAngleRef = { a: -Math.PI / 2 }
    const bulletsRef: { x: number; y: number; vx: number; vy: number }[] = []
    const lastActivityRef = { t: performance.now() }
    let initialized = false
    let rafId = 0
    let running = false

    const BULLET_SPEED = 25
    const MAX_BULLETS = 20
    const SPREAD = 0.3
    const IDLE_MS = 3000

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const isInsideMatrix = (x: number, y: number) => {
      const el = document.getElementById('matrix')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(rafId)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!initialized) {
        posRef.x = targetRef.x = e.clientX
        posRef.y = targetRef.y = e.clientY
        prevPosRef.x = e.clientX
        prevPosRef.y = e.clientY
        initialized = true
      }
      targetRef.x = e.clientX
      targetRef.y = e.clientY
      lastActivityRef.t = performance.now()
      if (!running) start()
    }

    const onMouseDown = (e: MouseEvent) => {
      lastActivityRef.t = performance.now()
      // Fire only while aiming inside the game section
      if (!isInsideMatrix(e.clientX, e.clientY)) return

      let angle = lastAngleRef.a
      angle += (Math.random() - 0.5) * SPREAD * 2
      lastAngleRef.a = angle

      const bullets = bulletsRef
      while (bullets.length >= MAX_BULLETS) {
        bullets.shift()
      }
      bullets.push({
        x: posRef.x,
        y: posRef.y,
        vx: Math.cos(angle - Math.PI / 2) * BULLET_SPEED,
        vy: Math.sin(angle - Math.PI / 2) * BULLET_SPEED,
      })
      if (!running) start()
    }

    const onVisibility = () => {
      if (document.hidden) {
        stop()
      } else if (performance.now() - lastActivityRef.t < IDLE_MS * 2) {
        start()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      if (!running) return

      const cur = posRef
      const prev = prevPosRef
      const tgt = targetRef

      // Velocity from previous frame's position delta
      const vx = cur.x - prev.x
      const vy = cur.y - prev.y
      const speed = Math.sqrt(vx * vx + vy * vy)

      // Store current as previous before updating
      prev.x = cur.x
      prev.y = cur.y

      // Lerp toward target (0.15 interpolation)
      cur.x += (tgt.x - cur.x) * 0.15
      cur.y += (tgt.y - cur.y) * 0.15

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ship at absolute cursor position
      ctx.save()
      ctx.translate(cur.x, cur.y)

      // Compute rotation angle from velocity; fall back to last angle when stationary
      if (speed > 0.5) {
        lastAngleRef.a = Math.atan2(vy, vx) + Math.PI / 2
      }
      ctx.rotate(lastAngleRef.a)

      // Speed flame — proportional to velocity, with random flicker
      if (speed > 15) {
        const t = Math.min(speed / 250, 1)
        const flameLen = t * 28 + 4
        const f = Math.random() * 10

        // Three-layer flame: red → orange → yellow (scaled up)
        for (const [w, m, c] of [[10, 1, '#ef4444'], [7, 0.65, '#f97316'], [4, 0.4, '#facc15']] as const) {
          ctx.beginPath()
          ctx.moveTo(-w, 10)
          ctx.lineTo(0, 8 + (flameLen + f) * m)
          ctx.lineTo(w, 10)
          ctx.closePath()
          ctx.fillStyle = c
          ctx.fill()
        }
      }

      // Ship body — retro triangle
      ctx.beginPath()
      ctx.moveTo(0, -14)
      ctx.lineTo(-9, 10)
      ctx.lineTo(9, 10)
      ctx.closePath()
      ctx.fillStyle = '#22d3ee'
      ctx.fill()
      ctx.strokeStyle = '#0891b2'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.restore()

      // Update and draw bullets
      const bullets = bulletsRef
      const sectionEl = document.getElementById('matrix')
      let sectionBounds: DOMRect | null = null
      if (sectionEl) {
        sectionBounds = sectionEl.getBoundingClientRect()
      }
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]
        b.x += b.vx
        b.y += b.vy

        // Despawn when outside the section bounds
        if (sectionBounds) {
          const margin = 80
          if (
            b.x < sectionBounds.left - margin ||
            b.x > sectionBounds.right + margin ||
            b.y < sectionBounds.top - margin ||
            b.y > sectionBounds.bottom + margin
          ) {
            bullets.splice(i, 1)
            continue
          }
        } else if (
          b.x < -100 || b.x > window.innerWidth + 100 ||
          b.y < -100 || b.y > window.innerHeight + 100
        ) {
          bullets.splice(i, 1)
          continue
        }

        // Draw comet trail: 2 circles along velocity direction
        const dx = b.vx / BULLET_SPEED
        const dy = b.vy / BULLET_SPEED
        const trailOpacities = [0.5, 0.8]
        for (let t = 0; t < trailOpacities.length; t++) {
          const tb = t + 1
          ctx.beginPath()
          ctx.arc(b.x - dx * tb * 6, b.y - dy * tb * 6, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(250, 204, 21, ${trailOpacities[t]})`
          ctx.fill()
        }
        // Main bullet
        ctx.beginPath()
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#facc15'
        ctx.fill()
      }

      // Sync bullet positions for game collision detection
      bulletData.length = 0
      bullets.forEach((b) =>
        bulletData.push({ x: b.x, y: b.y, vx: b.vx, vy: b.vy })
      )

      // Idle pause: no mouse activity and no bullets in flight → stop the loop
      if (performance.now() - lastActivityRef.t > IDLE_MS && bullets.length === 0) {
        stop()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)

    return () => {
      style.remove()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      aria-hidden
    />
  )
}
