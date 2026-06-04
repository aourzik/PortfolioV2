import { useEffect, useRef } from 'react'
import gsap from 'gsap'

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
      if (e.target.closest('a, button, [data-hover]')) {
        gsap.to(el, {
          scale: 2.5,
          backgroundColor: 'var(--cursor-color)',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    const onLeave = (e) => {
      const target = e.target.closest('a, button, [data-hover]')
      if (target && !target.contains(e.relatedTarget)) {
        gsap.to(el, {
          scale: 1,
          backgroundColor: 'transparent',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
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
      style={{ borderColor: 'var(--cursor-color)', border: '1.5px solid var(--cursor-color)' }}
    />
  )
}
