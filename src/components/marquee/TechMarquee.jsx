import { Icon } from '@iconify/react'

// Stack complet avec icônes Simple Icons via Iconify
const STACK = [
  { label: 'react',        icon: 'simple-icons:react' },
  { label: 'next.js',      icon: 'simple-icons:nextdotjs' },
  { label: 'node',         icon: 'simple-icons:nodedotjs' },
  { label: 'bun.js',       icon: 'simple-icons:bun' },
  { label: 'python',       icon: 'simple-icons:python' },
  { label: 'c',            icon: 'simple-icons:c' },
  { label: 'mongodb',      icon: 'simple-icons:mongodb' },
  { label: 'postgresql',   icon: 'simple-icons:postgresql' },
  { label: 'tailwind',     icon: 'simple-icons:tailwindcss' },
  { label: 'figma',        icon: 'simple-icons:figma' },
  { label: 'flutter',      icon: 'simple-icons:flutter' },
  { label: 'git',          icon: 'simple-icons:git' },
  { label: 'github',       icon: 'simple-icons:github' },
  { label: 'html',         icon: 'simple-icons:html5' },
  { label: 'css',          icon: 'simple-icons:css3' },
  { label: 'javascript',   icon: 'simple-icons:javascript' },
  { label: 'claude',       icon: 'simple-icons:anthropic' },
  { label: 'vscode',       icon: 'simple-icons:visualstudiocode' },
  { label: 'claude code',  icon: 'simple-icons:anthropic' },
  { label: 'gsap',         icon: 'simple-icons:greensock' },
]

// Séparateur entre chaque item
function Sep() {
  return (
    <span aria-hidden className="text-yellow/50 mx-8 text-[0.45em] leading-none self-center">
      ✦
    </span>
  )
}

// Un item tech : icône + label
function Item({ label, icon }) {
  return (
    <span className="inline-flex items-center gap-3 shrink-0">
      <Icon
        icon={icon}
        width={28}
        height={28}
        className="opacity-70 shrink-0"
        style={{ color: 'inherit' }}
      />
      <span className="text-cream/80">{label}</span>
    </span>
  )
}

// Rendu d'une ligne de stack avec séparateurs
function Track({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <Item {...item} />
          <Sep />
        </span>
      ))}
    </>
  )
}

export default function TechMarquee() {
  return (
    <div
      className="
        relative w-full overflow-hidden
        border-t border-b border-cream/10
        py-5
        bg-black
      "
      // Pause le défilement au hover
      onMouseEnter={e => e.currentTarget.querySelector('.marquee-track').style.animationPlayState = 'paused'}
      onMouseLeave={e => e.currentTarget.querySelector('.marquee-track').style.animationPlayState = 'running'}
    >
      {/* Dégradés de fondu sur les bords */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

      {/* Piste défilante : contenu doublé pour boucle parfaite */}
      <div
        className="marquee-track flex items-center w-max"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        <span className="inline-flex items-center font-sans font-medium lowercase tracking-[-0.04em] text-[clamp(1.2rem,2.2vw,2rem)] text-cream/80 whitespace-nowrap">
          <Track items={STACK} />
          {/* Copie exacte pour le loop sans couture */}
          <Track items={STACK} />
        </span>
      </div>
    </div>
  )
}
