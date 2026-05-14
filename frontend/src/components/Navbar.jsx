import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Target } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const navLinks = [
  { label: 'Home',    to: '/' },
  { label: 'Upload',  to: '/upload' },
  { label: 'History', to: '/history' },
  { label: 'About',   to: '/about' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'scrolled-nav bg-dark-card/90 backdrop-blur-xl border-b border-dark-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient">AI CV</span>
              <span className="text-white"> Coach</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10 border border-primary/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-dark-card2'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-dark-card2 transition-all"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-card border-b border-dark-border overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-dark-card2'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/upload"
                className="btn-glow mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
              >
                Analyse My CV
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
