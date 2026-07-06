'use client'

import { useEffect, useRef } from 'react'

export default function TerminalCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      body { cursor: none !important; }
      @keyframes terminal-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    let rafId: number
    const tick = () => {
      const cur = posRef.current
      const tgt = targetRef.current
      // lerp toward target for smooth following
      cur.x += (tgt.x - cur.x) * 0.15
      cur.y += (tgt.y - cur.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      style.remove()
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <span
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] select-none"
      style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: 20,
        lineHeight: 1,
        color: '#22d3ee',
        animation: 'terminal-blink 530ms step-end infinite',
      }}
      aria-hidden
    >
      _
    </span>
  )
}
