"use client"

import { useRef, useEffect, type ReactNode } from "react"

export default function SectionReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
          observer.unobserve(el)
        }
      },
      { rootMargin: "-0px 0px -100px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ opacity: 0, transform: "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
      {children}
    </div>
  )
}
