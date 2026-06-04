import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 60
const getFrameUrl = (i) =>
  `/assets/hero-3d/gemini_peux_tu_me_générer_une_${String(i).padStart(3, '0')}.png`

const ZOOM_TARGET = { x: 0.50, y: 0.36 }
const ZOOM_START  = 0.45
const ZOOM_MAX    = 3.8

// Direction d'exit par ligne : -1 = gauche, 1 = droite
const LINE_DIRS = [-1, 1, -1]

export default function Hero() {
  const sectionRef  = useRef(null)
  const canvasRef   = useRef(null)
  const titleRef    = useRef(null)
  const imagesRef   = useRef([])
  const frameRef    = useRef(0)
  const [loaded,   setLoaded]   = useState(false)
  const [progress, setProgress] = useState(0)

  // ── Préchargement ─────────────────────────────────────────────────────
  useEffect(() => {
    let done = 0
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.src = getFrameUrl(i)
      img.onload = img.onerror = () => {
        done++
        setProgress(done / FRAME_COUNT)
        if (done === FRAME_COUNT) setLoaded(true)
      }
      return img
    })
    imagesRef.current = imgs
    return () => imgs.forEach(img => { img.onload = img.onerror = null })
  }, [])

  // ── Canvas + ScrollTrigger + animation titre ───────────────────────────
  useEffect(() => {
    if (!loaded) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const imgs   = imagesRef.current

    // Cache les lignes du titre pour l'animation (évite querySelectorAll dans le scroll)
    const titleLines = titleRef.current
      ? Array.from(titleRef.current.querySelectorAll('[data-line]'))
      : []
    titleLines.forEach(el => { el.style.willChange = 'transform, opacity' })

    function draw(index) {
      const img = imgs[Math.max(0, Math.min(index, FRAME_COUNT - 1))]
      if (!img?.naturalWidth) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      const baseScale = Math.max(cw / iw, ch / ih)
      const baseDw = iw * baseScale
      const baseDh = ih * baseScale

      const prog   = index / (FRAME_COUNT - 1)
      const zRaw   = Math.max(0, (prog - ZOOM_START) / (1 - ZOOM_START))
      const zEased = zRaw * zRaw * (3 - 2 * zRaw)           // smoothstep
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

      // Masque dégradé radial (étoiles Gemini)
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

      // ── Animation exit du titre ──────────────────────────────────────
      // Les lignes filent vers les côtés en même temps que le zoom démarre
      titleLines.forEach((line, i) => {
        const dir = LINE_DIRS[i] ?? (i % 2 === 0 ? -1 : 1)
        const tx  = dir * zEased * 130            // vw
        const op  = Math.max(0, 1 - zEased * 1.8) // disparaît avant la fin du zoom
        line.style.transform = `translateX(${tx}vw)`
        line.style.opacity   = op
      })
    }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width  = Math.round(width)
      canvas.height = Math.round(height)
      draw(frameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    draw(0)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate(self) {
        const f = Math.round(self.progress * (FRAME_COUNT - 1))
        if (f !== frameRef.current) {
          frameRef.current = f
          draw(f)
        }
      },
    })

    return () => {
      st.kill()
      window.removeEventListener('resize', resize)
      titleLines.forEach(el => { el.style.willChange = '' })
    }
  }, [loaded])

  return (
    <section ref={sectionRef} id="hero" className="relative h-[600vh]">

      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Canvas plein écran */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Loader */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
            <span className="font-sans text-cream/30 text-xs tracking-[0.3em] uppercase tabular-nums">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}

        {/* ── Typographie — centrée ───────────────────────────────────── */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none">
          <h1
            ref={titleRef}
            className="font-display tracking-[-0.03em] leading-[0.85] text-center"
          >
            <span data-line="0" className="block text-cream text-[10vw]">
              Aïny Ourzik
            </span>
            {/* Tagline plus petite, légèrement espacée du nom */}
            <span data-line="1" className="block text-yellow text-[5vw] mt-[1vw]">
              l'ergonomie
            </span>
            <span data-line="2" className="block text-cream text-[5vw]">
              du développement
            </span>
          </h1>
        </div>

        {/* ── Scroll indicator animé — bas de l'écran centré ─────────── */}
        <div className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none select-none">
          <span className="font-sans font-medium text-cream/50 text-[10px] tracking-[0.45em] uppercase">
            scroll
          </span>

          {/* Capsule avec dot qui descend */}
          <div className="w-[18px] h-[30px] rounded-full border border-cream/35 flex items-start justify-center pt-[5px]">
            <div
              className="w-[5px] h-[6px] rounded-full bg-yellow"
              style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }}
            />
          </div>

          {/* Ligne qui pulse vers le bas */}
          <div className="w-px h-8 bg-cream/15 overflow-hidden relative">
            <div
              className="absolute inset-x-0 top-0 h-full bg-yellow/60"
              style={{ animation: 'scroll-line 1.8s ease-in-out infinite 0.3s' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
