import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SHADOW_ON  = 'inset 0 -0.32em 0 rgba(255, 183, 3, 0.32)'
const SHADOW_OFF = 'inset 0 0em 0 rgba(255, 183, 3, 0)'

export default function CustomCursor() {
  const ringRef  = useRef(null)
  const badgeRef = useRef(null)
  const spinRef  = useRef(null)

  useEffect(() => {
    const ring  = ringRef.current
    const badge = badgeRef.current
    if (!ring || !badge) return

    // ── Init positions ──────────────────────────────────────────────
    gsap.set(ring,  { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })

    // quickTo partagés pour ring et badge
    const xRing  = gsap.quickTo(ring,  'x', { duration: 0.5, ease: 'power3.out' })
    const yRing  = gsap.quickTo(ring,  'y', { duration: 0.5, ease: 'power3.out' })
    const xBadge = gsap.quickTo(badge, 'x', { duration: 0.45, ease: 'power3.out' })
    const yBadge = gsap.quickTo(badge, 'y', { duration: 0.45, ease: 'power3.out' })

    // Rotation continue du badge (démarre pausée, reprend au hover projet)
    spinRef.current = gsap.to(badge, {
      rotation: 360,
      duration: 7,
      ease:     'none',
      repeat:   -1,
      paused:   true,
    })

    // ── Mouvement ───────────────────────────────────────────────────
    const onMove = (e) => {
      xRing(e.clientX);  yRing(e.clientY)
      xBadge(e.clientX); yBadge(e.clientY)
      gsap.to(ring, { opacity: 1, duration: 0.4, overwrite: 'auto' })
    }

    // ── Hover ───────────────────────────────────────────────────────
    const onEnter = (e) => {
      // Projet : affiche le badge VOIR
      if (e.target.closest('[data-cursor="voir"]')) {
        spinRef.current.play()
        gsap.to(ring,  { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
        gsap.to(badge, { scale: 1, opacity: 1, duration: 0.4,  ease: 'back.out(1.5)', overwrite: 'auto' })
        return
      }

      // Lien/bouton : surligneur jaune
      const target = e.target.closest('a, button, [data-hover]')
      if (!target) return
      gsap.to(ring,   { scale: 1.6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(target, { boxShadow: SHADOW_ON,  duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    }

    const onLeave = (e) => {
      // Quitte un projet
      const voirTarget = e.target.closest('[data-cursor="voir"]')
      if (voirTarget && !voirTarget.contains(e.relatedTarget)) {
        spinRef.current.pause()
        gsap.to(badge, { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in',  overwrite: 'auto' })
        gsap.to(ring,  { scale: 1, opacity: 1, duration: 0.3,  ease: 'power2.out', overwrite: 'auto' })
        return
      }

      // Quitte un lien/bouton
      const target = e.target.closest('a, button, [data-hover]')
      if (!target || target.contains(e.relatedTarget)) return
      gsap.to(ring,   { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
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
      {/* Ring normal */}
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 size-6 rounded-full pointer-events-none z-[9999]"
        style={{ border: '1.5px solid var(--cursor-color)' }}
      />

      {/* Badge VOIR — texturé, tourne lentement */}
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 w-[78px] h-[78px] rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,250,232,0.07) 0%, transparent 65%), #0a0a0a',
          border:     '1px solid rgba(255,250,232,0.18)',
          boxShadow:  '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Le texte est contre-rotatif pour rester lisible pendant la rotation du badge */}
        <span
          className="font-sans font-semibold text-cream text-[0.65rem] tracking-[0.28em] uppercase"
          style={{ transform: 'rotate(0deg)' }}
        >
          VOIR
        </span>
      </div>
    </>
  )
}
