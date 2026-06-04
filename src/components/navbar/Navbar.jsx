import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'about',    href: '#about' },
  { label: 'projects', href: '#projects' },
  { label: 'contact',  href: '#contact' },
]

// Liquid glass sur fond sombre (défaut)
const darkGlass = {
  background:           'rgba(255, 250, 232, 0.04)',
  backdropFilter:       'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border:               '1px solid rgba(255, 250, 232, 0.10)',
  boxShadow: [
    'inset 0 1px 0 rgba(255, 255, 255, 0.10)',
    'inset 0 -1px 0 rgba(0, 0, 0, 0.15)',
    '0 8px 32px rgba(0, 0, 0, 0.45)',
    '0 0 0 0.5px rgba(255, 255, 255, 0.04)',
  ].join(', '),
}

// Liquid glass sur fond crème
const lightGlass = {
  background:           'rgba(10, 10, 10, 0.06)',
  backdropFilter:       'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  border:               '1px solid rgba(10, 10, 10, 0.10)',
  boxShadow: [
    'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
    '0 8px 32px rgba(0, 0, 0, 0.10)',
  ].join(', '),
}

// Scroll vers une section via Lenis
function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { duration: 1.4 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Navbar() {
  const navRef   = useRef(null)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const el = navRef.current
    if (!el) return

    // État initial : caché
    gsap.set(el, { y: -90, opacity: 0 })
    el.style.pointerEvents = 'none'

    // Apparaît quand le Hero est scrollé entièrement
    const stAppear = ScrollTrigger.create({
      trigger:    '#hero',
      start:      'bottom bottom',
      onEnter() {
        el.style.pointerEvents = 'auto'
        gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      },
      onLeaveBack() {
        el.style.pointerEvents = 'none'
        gsap.to(el, { y: -90, opacity: 0, duration: 0.4, ease: 'power3.in' })
      },
    })

    // Détecte toutes les sections à fond clair (data-theme="light")
    const lightSections = document.querySelectorAll('[data-theme="light"]')
    const stLight = []
    lightSections.forEach(section => {
      stLight.push(ScrollTrigger.create({
        trigger:   section,
        start:     'top 80px',   // position du bas de la navbar
        end:       'bottom 80px',
        onEnter:      () => setIsLight(true),
        onLeaveBack:  () => setIsLight(false),
        onLeave:      () => setIsLight(false),
        onEnterBack:  () => setIsLight(true),
      }))
    })

    // Devient discrète dans l'Outro
    const stOutro = ScrollTrigger.create({
      trigger: '#outro',
      start:   'top 80px',
      end:     'bottom bottom',
      onEnter:     () => gsap.to(el, { opacity: 0.25, scale: 0.82, duration: 0.6, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(el, { opacity: 1,    scale: 1,    duration: 0.5, ease: 'power2.out' }),
    })

    return () => {
      stAppear.kill()
      stLight.forEach(st => st.kill())
      stOutro.kill()
    }
  }, [])

  const glass      = isLight ? lightGlass : darkGlass
  const textBrand  = isLight ? 'text-black'    : 'text-cream'
  const textLink   = isLight ? 'text-black/50'  : 'text-cream/60'
  const textHover  = isLight ? 'hover:text-black' : 'hover:text-cream'

  return (
    <nav
      ref={navRef}
      className="fixed top-5 inset-x-0 z-[100] flex justify-center px-6"
    >
      <div
        className="flex items-center justify-between w-full max-w-4xl px-7 py-3.5 rounded-full transition-colors duration-300"
        style={glass}
      >
        {/* Nom — Fascinate */}
        <button
          onClick={() => scrollTo('#hero')}
          className={`font-display text-[clamp(0.85rem,1.1vw,1.1rem)] tracking-[-0.02em] whitespace-nowrap transition-colors duration-300 ${textBrand}`}
        >
          Aïny Ourzik
        </button>

        {/* Liens */}
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <button
                onClick={() => scrollTo(href)}
                className={`font-sans font-medium text-sm lowercase tracking-[-0.02em] transition-colors duration-300 ${textLink} ${textHover}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
