'use client'

import { useEffect, useRef } from 'react'

export default function TerminalCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const prevPosRef = useRef({ x: 0, y: 0 })
  const lastAngleRef = useRef(-Math.PI / 2)
  const bulletsRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `body { cursor: none !important; }`
    document.head.appendChild(style)

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    const BULLET_SPEED = 9
    const BULLET_LIFE = 60
    const MAX_BULLETS = 20
    const SPREAD = 0.3

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const cur = posRef.current

      // Use the ship's current visual rotation (lastAngleRef) for bullet direction
      let angle = lastAngleRef.current

      // Slight random spread — keep ±0.3 rad
      angle += (Math.random() - 0.5) * SPREAD * 2

      const bullets = bulletsRef.current
      // Drop oldest if at max
      while (bullets.length >= MAX_BULLETS) {
        bullets.shift()
      }

      bullets.push({
        x: cur.x,
        y: cur.y,
        vx: Math.cos(angle - Math.PI / 2) * BULLET_SPEED,
        vy: Math.sin(angle - Math.PI / 2) * BULLET_SPEED,
        life: BULLET_LIFE,
      })
    }
    window.addEventListener('mousedown', onMouseDown)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const SIZE = 60

    let rafId: number
    const tick = () => {
      const cur = posRef.current
      const prev = prevPosRef.current
      const tgt = targetRef.current

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

      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.save()
      ctx.translate(SIZE / 2, SIZE / 2)

      // Compute rotation angle from velocity; fall back to last angle when stationary
      if (speed > 0.5) {
        lastAngleRef.current = Math.atan2(vy, vx) + Math.PI / 2
      }
      ctx.rotate(lastAngleRef.current)

      // Speed flame — proportional to velocity, with random flicker
      if (speed > 15) {
        const t = Math.min(speed / 250, 1)
        const flameLen = t * 28 + 4
        const f = Math.random() * 10

        // Three-layer flame: red → orange → yellow (scaled up)
        for (const [w, m, c] of [[10, 1, '#ef4444'], [7, 0.65, '#f97316'], [4, 0.4, '#facc15']]) {
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
      const bullets = bulletsRef.current
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]
        b.x += b.vx
        b.y += b.vy
        b.life--
        if (b.life <= 0) {
          bullets.splice(i, 1)
          continue
        }
        // Bullet position relative to canvas
        const bx = b.x - (cur.x - SIZE / 2)
        const by = b.y - (cur.y - SIZE / 2)
        ctx.beginPath()
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#facc15'
        ctx.fill()
      }

      canvas.style.transform = `translate(${cur.x - SIZE / 2}px, ${cur.y - SIZE / 2}px)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      style.remove()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={60}
      height={60}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      aria-hidden
    />
  )
}
