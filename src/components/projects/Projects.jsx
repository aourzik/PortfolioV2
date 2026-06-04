import { useRef } from 'react'

// ── Données projets ──────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'coroller',
    src: '/photos/projets/coroller.png',
    name: 'Coroller',
    description: 'Site vitrine d\'une créatrice d\'illustration et crochet',
    type: 'Site web',
    wide: true,
  },
  {
    id: 'homepoopy',
    src: '/photos/projets/homepoopy.png',
    name: 'Poopy',
    description: 'App mobile d\'aide au suivi des MICI',
    type: 'App mobile',
    wide: false,
  },
  {
    id: 'homereadme',
    src: '/photos/projets/homereadme.png',
    name: 'ReadMe',
    description: 'App mobile de bibliothèque partagée avec ses amies et organisation de book club, prêt de livres.',
    type: 'App mobile',
    wide: false,
  },
  {
    id: 'duchess_duke',
    src: '/photos/projets/duchess_duke.png',
    name: 'Duchess & Duke',
    description: 'Reproduction d\'un grand site de location de maison de vacance version Bridgerton',
    type: 'Site web',
    wide: true,
  },
  {
    id: 'darkpoopy',
    src: '/photos/projets/darkpoopy.png',
    name: 'Poopy',
    description: 'App mobile d\'aide au suivi des MICI',
    type: 'App mobile',
    wide: false,
  },
  {
    id: 'friendsreadme',
    src: '/photos/projets/friendsreadme.png',
    name: 'ReadMe',
    description: 'App mobile de bibliothèque partagée avec ses amies et organisation de book club, prêt de livres.',
    type: 'App mobile',
    wide: false,
  },
  {
    id: 'profilreadme',
    src: '/photos/projets/profilreadme.png',
    name: 'ReadMe',
    description: 'App mobile de bibliothèque partagée avec ses amies et organisation de book club, prêt de livres.',
    type: 'App mobile',
    wide: false,
  },
  {
    id: 'traces',
    src: '/photos/projets/traces.png',
    name: 'Poopy',
    description: 'App mobile d\'aide au suivi des MICI',
    type: 'App mobile',
    wide: false,
  },
]

// ── Carte projet ─────────────────────────────────────────────────────────────
function ProjectCard({ src, name, description, type, wide }) {
  return (
    <div
      className="group relative flex-shrink-0 rounded-2xl overflow-hidden"
      style={{ width: wide ? '620px' : '300px', height: '520px' }}
      data-cursor="voir"
    >
      {/* Image */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        draggable={false}
      />

      {/* Badge type — visible par défaut, discret */}
      <div className="absolute top-3 left-3 z-10">
        <span className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-cream/50 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {type}
        </span>
      </div>

      {/* ── Overlay description — slide-up on hover ─────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        {/* Gradient de fondu */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -top-16 pointer-events-none" />

        <div className="relative px-4 pb-5 pt-10">
          {/* Nom du projet */}
          <p className="font-display text-yellow text-[0.95rem] tracking-[-0.02em] leading-tight mb-2">
            {name}
          </p>

          {/* Description — apparaît avec léger délai */}
          <p
            className="font-sans font-light text-cream/70 text-[0.75rem] leading-snug opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            style={{ transition: 'opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s' }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Section principale ───────────────────────────────────────────────────────
export default function Projects() {
  const trackRef  = useRef(null)
  // Dupliquer pour la boucle infinie
  const items = [...PROJECTS, ...PROJECTS]

  return (
    <section id="projects" className="bg-[#0a0a0a] py-24 overflow-hidden">

      {/* Titre */}
      <div className="px-[5vw] mb-70">
        <h2 className="font-display text-cream tracking-[-0.03em] leading-[0.85] text-[clamp(2.5rem,6vw,6rem)]">
          <span className="block">Tous les</span>
          <span
            className="block font-sans font-extrabold italic text-yellow"
            style={{ letterSpacing: '-0.05em' }}
          >
            projets
          </span>
        </h2>
      </div>

      {/* ── Slider infini ────────────────────────────────────────────── */}
      <div
        style={{
          mask:        'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMask:  'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
        onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused' }}
        onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }}
      >
        <div
          ref={trackRef}
          className="flex gap-5 w-max px-5"
          style={{ animation: 'marquee 35s linear infinite' }}
        >
          {items.map((project, i) => (
            <ProjectCard key={`${project.id}-${i}`} {...project} />
          ))}
        </div>
      </div>

    </section>
  )
}
