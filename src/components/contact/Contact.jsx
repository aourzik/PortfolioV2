import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ORBIT_SPEED = 1 / 22

const ICONS = [
  { icon: 'simple-icons:linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/ainy-ourzik' },
  { icon: 'simple-icons:github',   label: 'GitHub',   href: 'https://github.com/aourzik/' },
  { icon: 'simple-icons:gmail',    label: 'Gmail',    href: 'mailto:a.ourzik.dev@gmail.com' },
  { icon: 'ph:file-pdf',           label: 'CV',       href: '/assets/Ainy_Ourzik_CV.pdf' },
]

// Ovale : assez grand pour ne jamais frôler le texte central
function getRx() { return Math.min(window.innerWidth  * 0.32, 430) }
function getRy() { return Math.min(window.innerHeight * 0.30, 260) }

export default function Contact() {
  const iconRefs   = useRef([])
  const textRef    = useRef(null)
  const isPaused   = useRef(false)
  const pauseStart = useRef(0)
  const timeOffset = useRef(0)
  const [ring, setRing] = useState(() => ({ w: getRx() * 2, h: getRy() * 2 }))

  const onEnter = () => {
    if (!isPaused.current) {
      isPaused.current   = true
      pauseStart.current = gsap.ticker.time
    }
  }

  const onLeave = () => {
    if (isPaused.current) {
      timeOffset.current += gsap.ticker.time - pauseStart.current
      isPaused.current = false
    }
  }

  useEffect(() => {
    const el = textRef.current
    if (el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      )
    }
  }, [])

  useEffect(() => {
    const onResize = () => setRing({ w: getRx() * 2, h: getRy() * 2 })
    window.addEventListener('resize', onResize)

    const tick = () => {
      const rx = getRx()
      const ry = getRy()
      const t  = isPaused.current
        ? pauseStart.current - timeOffset.current
        : gsap.ticker.time - timeOffset.current

      iconRefs.current.forEach((el, i) => {
        if (!el) return
        const angle = t * ORBIT_SPEED * Math.PI * 2 + (i / ICONS.length) * Math.PI * 2
        gsap.set(el, {
          x: Math.cos(angle) * rx,
          y: Math.sin(angle) * ry,
        })
      })
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      id="contact"
      data-theme="light"
      className="bg-cream min-h-screen relative flex items-center justify-center overflow-hidden"
    >

      {/* ── Filigrane nom ───────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span
          className="font-display text-black/[0.055] block leading-[0.82]"
          style={{ fontSize: '28vw' }}
        >
          Aïny
        </span>
        <span
          className="font-display text-black/[0.055] block leading-[0.82]"
          style={{ fontSize: '25vw' }}
        >
          Ourzik
        </span>
      </div>

      {/* ── Anneau ovale ────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width:        ring.w,
            height:       ring.h,
            borderRadius: '50%',
            border:       '1px dashed rgba(10,10,10,0.18)',
          }}
        />
      </div>

      {/* ── Icônes orbitantes ───────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {ICONS.map((item, i) => (
          <div
            key={item.label}
            ref={el => { iconRefs.current[i] = el }}
            className="absolute pointer-events-auto"
            style={{ marginTop: '-40px', marginLeft: '-40px' }}
          >
            <a
              href={item.href}
              title={item.label}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onTouchStart={onEnter}
              onTouchEnd={onLeave}
              className="
                group flex items-center justify-center
                w-20 h-20 rounded-full
                bg-[#0a0a0a] border-2 border-[#FFFAE8]/10
                hover:border-[#FFB703] hover:scale-110
                transition-all duration-300
              "
              style={{ boxShadow: '0 4px 28px rgba(0,0,0,0.25)' }}
            >
              <Icon
                icon={item.icon}
                width={30}
                height={30}
                className="text-[#FFFAE8]/70 group-hover:text-[#FFB703] transition-colors duration-300"
              />
            </a>
          </div>
        ))}
      </div>

      {/* ── Phrase centrale ─────────────────────────────────────────── */}
      <div ref={textRef} className="relative z-10 text-center px-[6vw] max-w-5xl" style={{ opacity: 0 }}>
        <p
          className="font-sans font-extrabold italic text-black leading-[0.88]"
          style={{
            fontSize:      'clamp(2.2rem, 5vw, 5.5rem)',
            letterSpacing: '-0.04em',
          }}
        >
          Prêt à{' '}
          <span
            className="font-display not-italic text-yellow"
            style={{ letterSpacing: '-0.04em' }}
          >
            travailler
          </span>
          {' '}ensemble&nbsp;?
          <br />
          Contacte&nbsp;moi&nbsp;!
        </p>
      </div>

    </section>
  )
}
