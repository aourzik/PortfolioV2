import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Polaroid   from './Polaroid'
import ToulouseMap from './ToulouseMap'

gsap.registerPlugin(ScrollTrigger)

// ── Card wrapper avec hover lift + yellow glow ──────────────────────────────
function Card({ children, className = '', style = {}, glowColor = 'rgba(255,183,3,0.07)' }) {
  return (
    <div
      className={`
        bg-[#0a0a0a] rounded-2xl p-6 flex flex-col
        transition-all duration-300 ease-out cursor-default
        hover:-translate-y-1
        ${className}
      `}
      style={{
        ...style,
        '--glow': glowColor,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 12px 40px ${glowColor}, 0 4px 16px rgba(0,0,0,0.5)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return (
    <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-cream/30 mb-3 block">
      {children}
    </span>
  )
}

export default function About() {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' } }
    )
  }, [])

  return (
    <section
      id="about"
      data-theme="light"
      className="bg-cream min-h-screen px-[5vw] pt-20 pb-0 flex flex-col"
    >
      {/* Titre */}
      <h2
        ref={titleRef}
        className="font-display text-black tracking-[-0.03em] leading-[0.85] text-[clamp(2.5rem,6vw,6rem)] mb-14"
        style={{ opacity: 0 }}
      >
        À propos de moi
      </h2>

      {/* Grille principale — polaroid prend plus de place */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.25fr] gap-8 items-start">

        {/* ── Colonne gauche : polaroid ──────────────────────────────── */}
        <div className="flex items-center justify-center min-h-[560px]">
          <Polaroid
            src="/photos/ainyourzik.png"
            alt="Aïny Ourzik"
            label="Aïny Ourzik ✦"
          />
        </div>

        {/* ── Colonne droite : bento ─────────────────────────────────── */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows:    'auto auto 200px',
          }}
        >

          {/* ── Parcours — col 1, rows 1–2 ───────────────────────────── */}
          <Card
            className="justify-between"
            style={{ gridColumn: '1', gridRow: '1 / 3' }}
            glowColor="rgba(255,183,3,0.10)"
          >
            <div>
              <CardLabel>Parcours</CardLabel>
              <p className="font-sans text-cream/80 text-[1.05rem] leading-[1.65]">
                Initialement ergonome, j'ai passé ma carrière à traquer
                le moindre détail pour simplifier la vie des utilisateurs.
                En reconversion via la{' '}
                {/* Holberton School en Fascinate jaune */}
                <span className="font-display text-yellow" style={{ fontSize: '1.45rem' }}>
                  Holberton School
                </span>
                , je transforme cette expertise en code propre et interfaces vivantes.
              </p>
            </div>
            {/* Ligne jaune qui s'étend au hover via le parent Card */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-yellow/40 flex-1" />
              <span className="font-sans text-yellow/40 text-[10px] tracking-widest uppercase">
                2025 →
              </span>
            </div>
          </Card>

          {/* ── Projets — col 2, row 1 ───────────────────────────────── */}
          <Card
            className="group overflow-hidden"
            style={{ gridColumn: '2', gridRow: '1' }}
            glowColor="rgba(255,183,3,0.15)"
          >
            <CardLabel>Projets</CardLabel>
            <div className="flex-1 flex flex-col justify-center relative">
              {/* Chiffre qui scale au hover */}
              <span
                className="font-display text-yellow leading-none tracking-[-0.04em] transition-transform duration-300 group-hover:scale-110 inline-block origin-left"
                style={{ fontSize: 'clamp(3.5rem, 5.5vw, 5.5rem)' }}
              >
                8+
              </span>
              <span className="font-sans text-cream/50 text-sm mt-1 lowercase tracking-wide transition-colors duration-300 group-hover:text-cream/80">
                réalisations
              </span>
              {/* Glow jaune en fond au hover */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-yellow/5 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            </div>
          </Card>

          {/* ── Disponible — col 2, row 2 ────────────────────────────── */}
          <Card
            className="group"
            style={{ gridColumn: '2', gridRow: '2' }}
            glowColor="rgba(255,183,3,0.12)"
          >
            <CardLabel>Disponibilité</CardLabel>
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-sans text-cream/40 text-xs uppercase tracking-widest mb-1 transition-colors duration-300 group-hover:text-cream/60">
                Disponible
              </span>
              <span className="font-display text-yellow tracking-[-0.02em] text-[1.4rem] leading-tight transition-all duration-300 group-hover:text-[1.55rem]">
                Juillet 2026
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-yellow animate-pulse group-hover:[animation-duration:0.6s]" />
              <span className="font-sans text-cream/30 text-[10px] uppercase tracking-widest transition-colors duration-300 group-hover:text-cream/50">
                Open to work
              </span>
            </div>
          </Card>

          {/* ── Map Toulouse — full width, row 3 ──────────────────────── */}
          <div
            className="bg-[#0a0a0a] rounded-2xl overflow-hidden relative group cursor-default"
            style={{
              gridColumn:  '1 / 3',
              gridRow:     '3',
              boxShadow:   '0 2px 8px rgba(0,0,0,0.3)',
              transition:  'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = 'translateY(-3px)'
              e.currentTarget.style.boxShadow  = '0 12px 40px rgba(255,183,3,0.08), 0 4px 16px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = 'translateY(0)'
              e.currentTarget.style.boxShadow  = '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <ToulouseMap />

            {/* Vignette jaune subtile au hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,183,3,0.06) 100%)' }}
            />

            {/* Label */}
            <div className="absolute bottom-4 left-4 z-[400] pointer-events-none">
              <span className="font-sans font-semibold text-cream/80 text-xs tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                📍 Toulouse, France
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bandeau défilant ──────────────────────────────────────────── */}
      <div className="mt-auto -mx-[5vw] overflow-hidden border-t border-black/8 py-3">
        <div
          className="flex items-center w-max"
          style={{ animation: 'marquee 22s linear infinite' }}
        >
          {[0, 1].map(copy => (
            <span key={copy} className="flex items-center font-sans font-light text-[clamp(0.7rem,1.1vw,1rem)] text-black/45 whitespace-nowrap">
              <span>scroll pour voir les magnifiques projets</span>
              <span className="mx-6 text-yellow/70 text-[0.6em]">✦</span>
              <span>tu vas vouloir travailler avec moi&nbsp;!</span>
              <span className="mx-6 text-yellow/70 text-[0.6em]">✦</span>
              <span>merci de l&apos;intérêt que tu portes à mon travail</span>
              <span className="mx-6 text-yellow/70 text-[0.6em]">✦</span>
              <span>le développement c&apos;est génial&nbsp;!</span>
              <span className="mx-6 text-yellow/70 text-[0.6em]">✦</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}
