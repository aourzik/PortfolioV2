import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FINAL_ROTATION = -4

export default function Polaroid({ src, alt, label }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    gsap.set(el, { y: -420, rotation: -30, opacity: 0, scale: 0.85 })

    const st = ScrollTrigger.create({
      trigger: el,
      start:  'top 80%',
      once:   true,
      onEnter() {
        gsap.to(el, {
          y:        0,
          rotation: FINAL_ROTATION,
          opacity:  1,
          scale:    1,
          duration: 1.3,
          ease:     'back.out(1.2)',
          onComplete() {
            gsap.to(el, {
              rotation: FINAL_ROTATION - 1.5,
              duration: 0.08,
              ease:     'power2.out',
              yoyo:     true,
              repeat:   3,
            })
          },
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-fit"
      style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4)) drop-shadow(0 10px 20px rgba(0,0,0,0.25))' }}
    >
      {/* Cadre Polaroid */}
      <div className="bg-white" style={{ padding: '16px 16px 75px 16px' }}>

        {/* Photo — responsive : 380px max, 75vw sur petit écran */}
        <div
          className="relative overflow-hidden"
          style={{ width: 'min(380px, 75vw)', height: 'min(450px, 89vw)' }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Label manuscrit */}
        <div className="pt-4 pb-1 text-center" style={{ width: 'min(380px, 75vw)' }}>
          <span
            className="font-handwriting text-gray-400"
            style={{ fontSize: '1.5rem', letterSpacing: '0.02em' }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Scotch */}
      <div
        className="absolute -top-3 left-1/2 w-16 h-5 rounded-sm"
        style={{
          background:     'rgba(255,245,180,0.45)',
          border:         '1px solid rgba(200,180,80,0.25)',
          backdropFilter: 'blur(1px)',
          transform:      'translateX(-50%) rotate(-1deg)',
        }}
      />
    </div>
  )
}
