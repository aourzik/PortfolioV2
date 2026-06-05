import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Icon } from '@iconify/react'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT   = 60
const ZOOM_TARGET   = { x: 0.50, y: 0.36 }
const ZOOM_START    = 0.45
const ZOOM_MAX      = 3.8
// Centre de l'écran MacBook dans l'image source (mesuré : 634/1440, 346/900)
const SCREEN_CENTER = { x: 0.365, y: 0.38 }

const getFrameUrl = (i) =>
  `/assets/hero-3d/gemini_peux_tu_me_générer_une_${String(i).padStart(3, '0')}.png`

// Frames sur lesquelles le texte apparaît (fondu) — les 14 dernières
const TEXT_FADE_FRAMES = 2

export default function Outro() {
  const sectionRef      = useRef(null)
  const canvasRef       = useRef(null)
  const titleRef        = useRef(null)
  const iconsRef        = useRef(null)
  const perspectiveRef  = useRef(null)
  const imagesRef       = useRef([])
  const frameRef        = useRef(FRAME_COUNT - 1)
  const [loaded, setLoaded] = useState(false)

  // ── Préchargement depuis cache navigateur ──────────────────────────────
  useEffect(() => {
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.src = getFrameUrl(i)
      return img
    })
    imagesRef.current = imgs

    const allCached = imgs.every(img => img.complete && img.naturalWidth > 0)
    if (allCached) { setLoaded(true); return }

    let done = 0
    const onDone = () => { if (++done === FRAME_COUNT) setLoaded(true) }
    imgs.forEach(img => {
      if (img.complete && img.naturalWidth > 0) { done++; return }
      img.addEventListener('load',  onDone)
      img.addEventListener('error', onDone)
    })
    if (done === FRAME_COUNT) setLoaded(true)
  }, [])

  // ── Canvas + ScrollTrigger ─────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const imgs   = imagesRef.current
    const titleEl = titleRef.current
    const iconsEl = iconsRef.current

    function draw(index) {
      const img = imgs[Math.max(0, Math.min(index, FRAME_COUNT - 1))]
      if (!img?.naturalWidth) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      const baseScale = Math.max(cw / iw, ch / ih)
      const baseDw    = iw * baseScale
      const baseDh    = ih * baseScale

      const prog    = index / (FRAME_COUNT - 1)
      const zRaw    = Math.max(0, (prog - ZOOM_START) / (1 - ZOOM_START))
      const zEased  = zRaw * zRaw * (3 - 2 * zRaw)
      const zFactor = 1 + zEased * (ZOOM_MAX - 1)

      const dw = baseDw * zFactor
      const dh = baseDh * zFactor

      const normalDx = (cw - dw) / 2
      const normalDy = (ch - dh) / 2
      const anchorDx = cw * 0.5 - dw * ZOOM_TARGET.x
      const anchorDy = ch * 0.5 - dh * ZOOM_TARGET.y
      const dx = normalDx + (anchorDx - normalDx) * zEased
      const dy = normalDy + (anchorDy - normalDy) * zEased

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)

      // Masque coin
      const cornerX    = dx + dw
      const cornerY    = dy + dh
      const gradRadius = dw * 0.22
      if (cornerX - gradRadius < cw && cornerY - gradRadius < ch) {
        const grad = ctx.createRadialGradient(
          cornerX, cornerY, gradRadius * 0.1,
          cornerX, cornerY, gradRadius,
        )
        grad.addColorStop(0,    'rgba(10,10,10,1)')
        grad.addColorStop(0.40, 'rgba(10,10,10,0.95)')
        grad.addColorStop(0.72, 'rgba(10,10,10,0.5)')
        grad.addColorStop(1,    'rgba(10,10,10,0)')
        ctx.fillStyle = grad
        ctx.fillRect(
          Math.max(0, cornerX - gradRadius),
          Math.max(0, cornerY - gradRadius),
          gradRadius + 2,
          gradRadius + 2,
        )
      }

      // ── Texte + icônes : fondu sur les dernières frames ───────────────
      const op = Math.max(0, 1 - index / TEXT_FADE_FRAMES)
      if (titleEl) titleEl.style.opacity = String(op)
      if (iconsEl) iconsEl.style.opacity = String(op)
    }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width  = Math.round(width)
      canvas.height = Math.round(height)

      const firstImg = imgs[0]
      if (firstImg?.naturalWidth && titleEl && perspectiveRef.current) {
        const cw = canvas.width
        const ch = canvas.height
        const iw = firstImg.naturalWidth
        const ih = firstImg.naturalHeight

        // Reproduit le même "cover" que draw() au zoom 1 (frame 0)
        const baseScale = Math.max(cw / iw, ch / ih)
        const dw = iw * baseScale
        const dh = ih * baseScale
        const dx = (cw - dw) / 2
        const dy = (ch - dh) / 2

        // Pixel canvas du centre de l'écran MacBook
        const screenCx = dx + SCREEN_CENTER.x * dw
        const screenCy = dy + SCREEN_CENTER.y * dh

        // Décalage depuis le centre du canvas (point de départ du h1 centré en flex)
        const tx = screenCx - cw / 2
        const ty = screenCy - ch / 2

        titleEl.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(0.54) rotateX(-10deg) rotateY(10deg) rotateZ(-2.5deg)`

        // perspectiveOrigin : % du viewport pointant vers le centre de l'écran MacBook
        perspectiveRef.current.style.perspectiveOrigin =
          `${((screenCx / cw) * 100).toFixed(2)}% ${((screenCy / ch) * 100).toFixed(2)}%`
      }

      draw(frameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    draw(FRAME_COUNT - 1)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate(self) {
        const f = Math.round((1 - self.progress) * (FRAME_COUNT - 1))
        if (f !== frameRef.current) {
          frameRef.current = f
          draw(f)
        }
      },
    })

    return () => {
      st.kill()
      window.removeEventListener('resize', resize)
    }
  }, [loaded])

  return (
    <section ref={sectionRef} id="outro" className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/*
          Texte collé sur l'écran du MacBook (frame 0).
          Rotations calculées depuis la vue 3/4 de l'image :
            rotateX(-18deg) : écran incliné en arrière (haut plus loin)
            rotateY( 22deg) : viewer légèrement à gauche (côté droit recule)
            rotateZ(  2deg) : légère rotation du laptop sur la table
            scale(0.58)     : réduit pour tenir dans l'écran
        */}
        {/*
          perspectiveOrigin calée sur le centre de l'écran MacBook mesuré dans le canvas :
          x = 482 / 1440 = 33.5%   y = 346 / 900 = 38.4%
        */}
        <div
          ref={perspectiveRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ perspective: '1000px' }}
        >
          <h1
            ref={titleRef}
            className="font-display tracking-[-0.03em] leading-[0.85] text-center"
            style={{
              opacity:         0,
              transform:       'translateX(-260px) translateY(-100px) scale(0.54) rotateX(-10deg) rotateY(10deg) rotateZ(-2.5deg)',
              transformOrigin: '50% 50%',
            }}
          >
            <span
              data-line="0"
              className="block text-[10vw]"
              style={{
                letterSpacing:    '-0.04em',
                color:            'transparent',
                WebkitTextStroke: '2px #FFFAE8',
              }}
            >
              Aïny Ourzik
            </span>
            <span
              data-line="1"
              className="block text-yellow text-[7vw] mt-[1vw] font-sans font-extrabold italic"
              style={{ letterSpacing: '-0.06em' }}
            >
              l'ergonomie
            </span>
            <span
              data-line="2"
              className="block text-cream text-[5vw] font-sans font-light"
              style={{ letterSpacing: '-0.03em' }}
            >
              du développement
            </span>
          </h1>
        </div>

        {/* ── Icônes 2×2 — bas droite ─────────────────────────────────── */}
        <div
          ref={iconsRef}
          className="absolute top-[7vh] right-[6vw] z-20 grid grid-cols-2 gap-5 pointer-events-auto"
          style={{ opacity: 0 }}
        >
          {[
            { icon: 'simple-icons:linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/ainy-ourzik' },
            { icon: 'simple-icons:github',   label: 'GitHub',   href: 'https://github.com/aourzik/' },
            { icon: 'simple-icons:gmail',    label: 'Gmail',    href: 'mailto:a.ourzik.dev@gmail.com' },
            { icon: 'ph:file-pdf',           label: 'CV',       href: '/assets/Ainy_Ourzik_CV.pdf' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              title={item.label}
              target="_blank"
              rel="noreferrer"
              className="
                group flex items-center justify-center
                w-24 h-24 rounded-full
                bg-[#FFB703]/10 border-2 border-[#FFB703]/40
                hover:bg-[#FFB703]/20 hover:border-[#FFB703]
                transition-all duration-300 hover:scale-110
              "
              style={{ boxShadow: '0 0 24px rgba(255,183,3,0.15)' }}
            >
              <Icon
                icon={item.icon}
                width={38}
                height={38}
                className="text-[#FFB703] transition-colors duration-300"
              />
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
