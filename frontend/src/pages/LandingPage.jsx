import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Flame, BarChart2, PenLine, Target, TrendingUp, Lightbulb,
  ScanSearch, ShieldCheck, Layers, Upload, Cpu, Zap,
  ArrowRight, Play,
} from 'lucide-react'

/* ── Static data ─────────────────────────────────────────── */
const FEATURES = [
  { Icon: Flame,       title: 'Constructive Feedback',      desc: 'Clear review of weak lines, vague claims, and filler phrases with practical fixes you can apply immediately.' },
  { Icon: BarChart2,   title: 'ATS Score Analysis',         desc: 'ATS compatibility score with missing keywords, formatting improvements, and role-focused recommendations.' },
  { Icon: PenLine,     title: 'Improved Bullet Points',     desc: 'Weak bullets rewritten with action verbs, measurable impact, and stronger technical clarity.' },
  { Icon: Target,      title: 'Interview Preparation',      desc: 'Technical, behavioral, and project questions generated from your CV to build confidence.' },
  { Icon: TrendingUp,  title: 'Strength Radar Chart',       desc: 'Visual breakdown of six CV dimensions — skills, experience, projects, clarity, impact, and ATS fit.' },
  { Icon: Lightbulb,   title: 'Improvement Roadmap',        desc: 'Actionable steps to move from current level to shortlist-ready with steady weekly progress.' },
  { Icon: ScanSearch,  title: 'Growth Checkpoint',          desc: 'Honest positioning feedback that helps you focus effort on the highest-impact improvements.' },
  { Icon: ShieldCheck, title: 'Authenticity Check',         desc: 'Detects copied content, overused templates, and generic AI filler so your profile stays authentic.' },
  { Icon: Layers,      title: 'Portfolio Recommendations',  desc: 'Tailored project ideas to close skill gaps and help you stand out as a student builder.' },
]

const STEPS = [
  { n: '01', Icon: Upload, title: 'Upload Your CV',       desc: 'Drag and drop a PDF, DOCX, or TXT file — up to 10 MB.' },
  { n: '02', Icon: Cpu,    title: 'AI Analysis',          desc: 'An LLM examines every section with the rigour of an experienced recruiter.' },
  { n: '03', Icon: Zap,    title: 'Act on the Insights',  desc: 'Apply the targeted recommendations and improve your callback rate.' },
]

const SAMPLE_FEEDBACK = [
  '"Led a team" — led how many people, for how long, toward what outcome? This phrase appears four times and communicates nothing.',
  'Your stated Python proficiency is contradicted by the absence of any Python project. Credentials require evidence.',
  'The skills section reads as a keyword inventory. Without context or demonstrated depth, it signals inexperience.',
  '"Increased performance by 200%" — which metric, which system, in what timeframe? Unsubstantiated figures reduce credibility.',
  'Three to-do app projects. This is among the most common portfolios submitted. Differentiation is absent.',
]

const STATS = [
  { value: '10K+',  label: 'CVs Analysed' },
  { value: '43pt',  label: 'Avg ATS Score Lift' },
  { value: '94%',   label: 'Users Found Issues' },
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
            <span className="text-gradient">AI CV Coach</span>
            <br />
            <span className="text-white text-4xl sm:text-5xl lg:text-6xl">for Students</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your CV, paste a job description, and receive a{' '}
            <strong className="text-white">comprehensive AI-powered analysis</strong> — ATS score,
            skill gaps, improved bullet points, and a step-by-step path to stronger applications.
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
              <Target className="w-5 h-5" />
              Start My CV Review - Free
            </Link>
            <a
              href="#example"
              className="btn-outline px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              See Example Output
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
              Everything Your CV <span className="text-gradient">Actually Needs</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Not just a keyword checker. Practical AI guidance that helps students improve with every iteration.
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example Feedback ────────────────────────────────────── */}
      <section id="example" className="py-24 px-4 bg-dark-card2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              What a <span className="text-gradient-warm">Constructive Analysis</span> Looks Like
            </h2>
            <p className="text-slate-500">Actual output from a real (anonymised) CV submission.</p>
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
              {SAMPLE_FEEDBACK.map((line, i) => (
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
                className="btn-glow flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-dark text-sm"
              >
                <Target className="w-4 h-4" />
                Improve My CV Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">
            Three Steps to <span className="text-gradient">Better Results</span>
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
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.Icon className="w-7 h-7 text-primary" />
                </div>
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
            Build a CV That Earns More Callbacks
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Get objective feedback your peers may miss. Fast, actionable, and designed for steady growth.
          </p>
          <Link
            to="/upload"
            className="btn-glow inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold text-dark animate-glow-pulse"
          >
            <Target className="w-5 h-5" />
            Analyse My CV - Free
          </Link>
        </div>
      </section>
    </div>
  )
}
