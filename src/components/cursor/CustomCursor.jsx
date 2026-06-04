import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SHADOW_ON  = 'inset 0 -0.32em 0 rgba(255, 183, 3, 0.32)'
const SHADOW_OFF = 'inset 0 0em 0 rgba(255, 183, 3, 0)'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      gsap.to(el, { opacity: 1, duration: 0.4, overwrite: 'auto' })
    }

    const onEnter = (e) => {
      const target = e.target.closest('a, button, [data-hover]')
      if (!target) return

      // Cursor : léger scale du ring, sans fill
      gsap.to(el, { scale: 1.6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })

      // Surligneur : GSAP anime le boxShadow directement (évite conflits CSS)
      gsap.to(target, {
        boxShadow: SHADOW_ON,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = (e) => {
      const target = e.target.closest('a, button, [data-hover]')
      if (!target || target.contains(e.relatedTarget)) return

      gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })

      gsap.to(target, {
        boxShadow: SHADOW_OFF,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 size-6 rounded-full pointer-events-none z-[9999]"
      style={{ border: '1.5px solid var(--cursor-color)' }}
    />
  )
}
