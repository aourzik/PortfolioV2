import Layout      from './components/layout/Layout'
import Hero        from './components/hero/Hero'
import TechMarquee from './components/marquee/TechMarquee'
import Navbar      from './components/navbar/Navbar'
import About       from './components/about/About'
import Projects    from './components/projects/Projects'
import Contact     from './components/contact/Contact'
import Outro       from './components/outro/Outro'

const PLACEHOLDERS = []

export default function App() {
  return (
    <Layout>
      <Navbar />

      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Projects />
        <Contact />
        <Outro />

        {PLACEHOLDERS.map(({ id, label }) => (
          <section
            key={id}
            id={id}
            className="min-h-screen flex items-center justify-center"
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-cream/20">
              {label}
            </span>
          </section>
        ))}
      </main>

    </Layout>
  )
}
