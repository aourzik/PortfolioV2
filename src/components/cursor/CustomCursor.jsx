import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SHADOW_ON  = 'inset 0 -0.32em 0 rgba(255, 183, 3, 0.32)'
const SHADOW_OFF = 'inset 0 0em 0 rgba(255, 183, 3, 0)'

export default function CustomCursor() {
  const wrapperRef = useRef(null) // position — direct quickSetter, zéro lag
  const arrowRef   = useRef(null) // scale/opacity — GSAP hover
  const badgeRef   = useRef(null)
  const spinRef    = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const arrow   = arrowRef.current
    const badge   = badgeRef.current
    if (!wrapper || !arrow || !badge) return

    // Init hors écran, invisible
    gsap.set(wrapper, { x: -200, y: -200, opacity: 0 })
    gsap.set(badge,   { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })

    // Position : quickSetter → synchrone, aucun tweening
    const setX = gsap.quickSetter(wrapper, 'x', 'px')
    const setY = gsap.quickSetter(wrapper, 'y', 'px')

    // Badge : léger lag OK pour un badge "VOIR" de 78px
    const xBadge = gsap.quickTo(badge, 'x', { duration: 0.45, ease: 'power3.out' })
    const yBadge = gsap.quickTo(badge, 'y', { duration: 0.45, ease: 'power3.out' })

    spinRef.current = gsap.to(badge, {
      rotation: 360,
      duration: 7,
      ease:     'none',
      repeat:   -1,
      paused:   true,
    })

    let revealed = false

    // ── Mouvement ───────────────────────────────────────────────────────
    const onMove = (e) => {
      setX(e.clientX)
      setY(e.clientY)
      xBadge(e.clientX)
      yBadge(e.clientY)
      if (!revealed) {
        revealed = true
        gsap.to(wrapper, { opacity: 1, duration: 0.3 })
      }
    }

    // ── Hover ────────────────────────────────────────────────────────────
    const onEnter = (e) => {
      if (e.target.closest('[data-cursor="voir"]')) {
        spinRef.current.play()
        gsap.to(arrow, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in',    overwrite: 'auto' })
        gsap.to(badge, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', overwrite: 'auto' })
        return
      }
      const target = e.target.closest('a, button, [data-hover]')
      if (!target) return
      gsap.to(arrow,  { scale: 0.8, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(target, { boxShadow: SHADOW_ON,  duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    }

    const onLeave = (e) => {
      const voirTarget = e.target.closest('[data-cursor="voir"]')
      if (voirTarget && !voirTarget.contains(e.relatedTarget)) {
        spinRef.current.pause()
        gsap.to(badge, { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in',  overwrite: 'auto' })
        gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
        return
      }
      const target = e.target.closest('a, button, [data-hover]')
      if (!target || target.contains(e.relatedTarget)) return
      gsap.to(arrow,  { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(target, { boxShadow: SHADOW_OFF, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout',  onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout',  onLeave)
      spinRef.current?.kill()
    }
  }, [])

  return (
    <>
      {/* Wrapper position — ne pas toucher au transform ici sauf via quickSetter */}
      <div
        ref={wrapperRef}
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        {/* Couche scale/opacity indépendante du translate */}
        <div ref={arrowRef}>
          <svg
            width="22" height="28"
            viewBox="0 0 18 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Contour seul, pas de fill — tip hotspot en (1,1) */}
            <path
              d="M1.5 1.5L1.5 20L6.5 14.5L10.5 23L13 22L9 13.5L16 13.5Z"
              fill="none"
              stroke="#FFB703"
              strokeWidth="1.2"
              strokeLinejoin="miter"
              strokeLinecap="square"
              strokeMiterlimit="15"
            />
          </svg>
        </div>
      </div>

      {/* Badge VOIR — suit la souris avec un léger lag intentionnel */}
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 w-[78px] h-[78px] rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,250,232,0.07) 0%, transparent 65%), #0a0a0a',
          border:     '1px solid rgba(255,250,232,0.18)',
          boxShadow:  '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span className="font-sans font-semibold text-cream text-[0.65rem] tracking-[0.28em] uppercase">
          VOIR
        </span>
      </div>
    </>
  )
}
