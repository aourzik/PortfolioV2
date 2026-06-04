import Layout from './components/layout/Layout'
import Hero   from './components/hero/Hero'

const PLACEHOLDERS = [
  { id: 'about',    label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact' },
]

export default function App() {
  return (
    <Layout>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        {/* Navigation — à implémenter */}
      </header>

      <main>
        <Hero />

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

      <footer className="flex items-center justify-between px-8 py-6">
        {/* Footer — à implémenter */}
      </footer>
    </Layout>
  )
}
