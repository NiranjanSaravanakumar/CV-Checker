import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const STACK = [
  { label: 'React 18 + Vite',         icon: '⚛️',  desc: 'Frontend SPA with fast HMR'              },
  { label: 'Tailwind CSS',             icon: '🎨',  desc: 'Utility-first dark-theme styling'         },
  { label: 'Framer Motion',            icon: '✨',  desc: 'Fluid animations & transitions'           },
  { label: 'Flask',                    icon: '🐍',  desc: 'Lightweight Python REST API'              },
  { label: 'LLM Analysis',             icon: '🤖',  desc: 'Large language model for deep CV analysis' },
  { label: 'SQLite + SQLAlchemy',       icon: '🗄️',  desc: 'Persistent analysis history'             },
  { label: 'Recharts',                 icon: '📊',  desc: 'Radar chart for CV strength'             },
  { label: 'ReportLab',                icon: '📄',  desc: 'PDF report generation'                   },
]

const TEAM_FAQS = [
  {
    q: 'Is my CV data private?',
    a: 'Yes. Uploaded files are deleted immediately after text extraction. Only the analysis result (no file) is stored in the database.',
  },
  {
    q: 'How accurate is the ATS score?',
    a: 'The score is based on LLM analysis of keyword density, formatting conventions, and standard ATS parsing rules. It\'s directionally accurate but not a guarantee of any specific ATS system.',
  },
  {
    q: 'Can I use this to generate my CV from scratch?',
    a: 'Not yet — today the tool focuses on analysing and improving existing CVs. A CV builder is on the roadmap.',
  },
  {
    q: 'Why does analysis take 15-30 seconds?',
    a: 'The LLM processes your full CV and generates a structured 20+ field JSON report. The generation itself takes the bulk of the time.',
  },
  {
    q: 'Is the feedback supportive for students?',
    a: 'Yes. Feedback is direct but respectful, focused only on resume quality and growth. The goal is to encourage improvement, not discourage learners.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-6xl block mb-6">🚀</span>
          <h1 className="text-4xl font-black text-white mb-4">
            About <span className="text-gradient">AI CV Coach</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A full-stack AI tool built to help students and early-career job seekers improve
            CVs with clear, actionable, and confidence-building feedback.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎯 The Mission
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Many CV tools stop at keyword matching. Real career growth needs deeper guidance:
            project clarity, credible claims, measurable impact, and role-focused communication.
          </p>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-white">AI CV Coach</strong> uses LLM
            language understanding to review CVs like an experienced recruiter while still
            encouraging consistent effort and improvement.
          </p>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">⚙️ Tech Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STACK.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">❓ FAQ</h2>
          <div className="space-y-4">
            {TEAM_FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="glass-card p-5"
              >
                <h3 className="text-sm font-semibold text-white mb-2">Q: {faq.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">A: {faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center glass-card p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Level Up Your CV?</h2>
          <p className="text-slate-500 mb-6">Upload your CV and get clear feedback that helps you improve one step at a time.</p>
          <Link to="/upload" className="btn-glow inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white">
            🚀 Start My CV Review - Free
          </Link>
        </div>
      </div>
    </div>
  )
}
