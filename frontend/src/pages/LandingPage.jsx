import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/* ── Static data ─────────────────────────────────────────── */
const FEATURES = [
  { icon: '🔥', title: 'Brutal Roast Mode',       desc: 'Gordon Ramsay-level critique of every weak line, vague claim, and filler buzzword.' },
  { icon: '📊', title: 'ATS Score Analysis',       desc: 'Real ATS compatibility score with missing keywords, formatting fixes, and pass probability.' },
  { icon: '✏️', title: 'Improved Bullet Points',   desc: 'Every weak bullet rewritten with strong action verbs, specificity, and quantified impact.' },
  { icon: '🎯', title: 'Interview Prep',            desc: 'Technical, HR, and project-based interview questions generated from your actual resume.' },
  { icon: '📈', title: 'Strength Radar Chart',      desc: 'Visual breakdown of 6 resume dimensions: skills, experience, projects, and more.' },
  { icon: '💡', title: 'Top 1% Roadmap',           desc: 'Exact, actionable steps to go from average to shortlisted at top companies.' },
  { icon: '🔍', title: 'Reality Check',            desc: 'Honest assessment of where your career positioning actually stands — no sugarcoating.' },
  { icon: '🤖', title: 'AI Plagiarism Detector',   desc: 'Detects copied content, overused GitHub projects, and AI-generated filler.' },
  { icon: '🚀', title: 'Portfolio Suggestions',    desc: 'Tailored project ideas to fill the gaps recruiters notice in your domain.' },
]

const STEPS = [
  { n: '01', icon: '📤', title: 'Upload Resume',    desc: 'Drag & drop your PDF, DOCX, or TXT resume.' },
  { n: '02', icon: '🤖', title: 'AI Roasts It',    desc: 'Gemini AI analyses every section like a brutal recruiter.' },
  { n: '03', icon: '⚡', title: 'Fix & Dominate',  desc: 'Apply the actionable suggestions and get shortlisted.' },
]

const SAMPLE_ROAST = [
  '"Led a team" — led how many people? For how long? On what? This phrase appears 4× and says absolutely nothing.',
  'Your "proficiency in Python" is undermined by having zero Python projects. Did you just watch one tutorial?',
  'The skills section reads like a Google search for "popular programming keywords". No depth, no context.',
  '"Increased performance by 200%" — which metric? Which system? In what timeframe? Sounds made up.',
  'Three to-do app projects on GitHub. Every junior dev has those. You\'re not standing out, you\'re blending in.',
]

const STATS = [
  { value: '10K+', label: 'Resumes Roasted' },
  { value: '43',   label: 'Avg ATS Score Boost' },
  { value: '94%',  label: 'Users Found Issues' },
  { value: '< 60s', label: 'Analysis Time' },
]

/* ── Particle canvas background ─────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.1,
    }))

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(249,115,22,${p.a})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

/* ── Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 grid-bg">
        <ParticleBackground />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-gradient">Resume Reality Check</span>
            <br />
            <span className="text-white text-4xl sm:text-5xl lg:text-6xl">No sugarcoating. Just truth.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, paste a job description, and get a{' '}
            <strong className="text-white">brutally honest AI analysis</strong> — ATS score,
            skill gaps, improved bullet points, and the real reason you&apos;re not getting callbacks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/upload"
              className="btn-glow px-8 py-4 rounded-xl text-base font-bold text-dark inline-flex items-center gap-2"
            >
              🎯 Check My Resume — Free
            </Link>
            <a
              href="#example"
              className="btn-outline px-8 py-4 rounded-xl text-base font-semibold text-slate-300 inline-flex items-center gap-2"
            >
              👀 See Example Output
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass-card px-4 py-3 text-center">
                <div className="text-2xl font-black text-gradient">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Everything Your Resume <span className="text-gradient">Actually Needs</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Not another keyword-stuffing tool. Real AI analysis that thinks like a senior recruiter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card p-6 hover:border-primary/35 transition-colors"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example Roast ───────────────────────────────────────── */}
      <section id="example" className="py-24 px-4 bg-dark-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              What a <span className="text-gradient-warm">Real Roast</span> Looks Like
            </h2>
            <p className="text-slate-500">Actual output from a real (anonymised) resume submission.</p>
          </div>

          <div className="glass-card overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 bg-dark-card2 border-b border-dark-border">
              <span className="w-3 h-3 rounded-full bg-danger/70" />
              <span className="w-3 h-3 rounded-full bg-accent/70" />
              <span className="w-3 h-3 rounded-full bg-success/70" />
              <span className="ml-4 text-xs text-slate-600 font-mono">reality_check_output.json</span>
            </div>

            <div className="p-6 space-y-4">
              {SAMPLE_ROAST.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="shrink-0 text-danger font-bold font-mono text-sm mt-0.5">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed font-mono">{line}</p>
                </motion.div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <Link
                to="/upload"
                className="btn-glow block w-full py-3 rounded-xl text-center font-bold text-dark text-sm"
              >
                🎯 Check My Resume Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">
            Three Steps to <span className="text-gradient">Your Dream Job</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-dark text-xs font-black flex items-center justify-center border-2 border-dark">
                  {step.n}
                </div>
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            Stop Wondering Why You&apos;re Not Getting Calls
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Get the honest analysis your friends won&apos;t give you. Free, instant, no fluff.
          </p>
          <Link
            to="/upload"
            className="btn-glow inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold text-dark animate-glow-pulse"
          >
            🎯 Check My Resume — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  )
}
