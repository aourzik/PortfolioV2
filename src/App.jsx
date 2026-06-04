import Layout      from './components/layout/Layout'
import Hero        from './components/hero/Hero'
import TechMarquee from './components/marquee/TechMarquee'
import Navbar      from './components/navbar/Navbar'

const PLACEHOLDERS = [
  { id: 'about',    label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact' },
]

export default function App() {
  return (
    <Layout>
      {/* Navbar liquid glass — apparaît après la fin du scroll Hero */}
      <Navbar />

      <main>
        <Hero />
        <TechMarquee />

        {PLACEHOLDERS.map(({ id, label }) => (
          <section
            key={id}
            id={id}
            data-theme={id === 'about' ? 'light' : undefined}
            className={[
              'min-h-screen flex items-center justify-center',
              id === 'about' ? 'bg-cream' : '',
            ].join(' ')}
          >
            <span className={[
              'font-sans text-xs tracking-[0.3em] uppercase',
              id === 'about' ? 'text-black/30' : 'text-cream/20',
            ].join(' ')}>
              {label}
            </span>
          </section>
        ))}
      </main>

      <footer className="flex items-center justify-between px-8 py-6">
        {/* Footer — à implémenter */}
      </footer>
    </Layout>
  )
}
