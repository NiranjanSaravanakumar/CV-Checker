import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { getReport, downloadReport } from '../utils/api'
import AnalysisCard          from '../components/AnalysisCard'
import ScoreGauge            from '../components/ScoreGauge'
import ResumeRadarChart      from '../components/ResumeRadarChart'
import InterviewQuestions    from '../components/InterviewQuestions'
import ImprovementSuggestions from '../components/ImprovementSuggestions'
import SkillConfidence       from '../components/SkillConfidence'

/* ── Tab definitions ───────────────────────────────────────── */
const TABS = [
  { id: 'roast',        label: '🔥 Roast',        },
  { id: 'ats',          label: '📊 ATS',           },
  { id: 'improvements', label: '✏️ Improve',       },
  { id: 'interview',    label: '🎯 Interview',     },
  { id: 'skills',       label: '💡 Skills',        },
  { id: 'insights',     label: '🚀 Insights',      },
]

/* ── Helper components ─────────────────────────────────────── */
function Skeleton({ lines = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded skeleton" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  )
}

function Tag({ text, color = 'primary' }) {
  const map = {
    primary: 'bg-primary/15 text-primary border-primary/30',
    danger:  'bg-danger/15 text-danger border-danger/30',
    amber:   'bg-accent/15 text-accent border-accent/30',
    green:   'bg-success/15 text-success border-success/30',
    cyan:    'bg-secondary/15 text-secondary border-secondary/30',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${map[color] ?? map.primary}`}>
      {text}
    </span>
  )
}

function ListItems({ items = [], icon = '•', iconClass = 'text-primary' }) {
  if (!items.length) return <p className="text-slate-500 text-sm italic">None detected.</p>
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-start gap-3"
        >
          <span className={`shrink-0 text-sm mt-0.5 font-bold ${iconClass}`}>{icon}</span>
          <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
        </motion.li>
      ))}
    </ul>
  )
}

/* ── Main page ─────────────────────────────────────────────── */
export default function AnalysisPage() {
  const { id }          = useParams()
  const location        = useLocation()
  const [analysis, setAnalysis] = useState(location.state?.analysis ?? null)
  const [filename, setFilename] = useState(location.state?.filename ?? '')
  const [loading,  setLoading]  = useState(!analysis)
  const [activeTab, setActiveTab] = useState('roast')
  const [downloading, setDownloading] = useState(false)

  // Fetch from API if we don't have the data in router state
  useEffect(() => {
    if (analysis) return
    getReport(id)
      .then((res) => {
        setAnalysis(res.data.analysis)
        setFilename(res.data.filename)
      })
      .catch(() => toast.error('Failed to load analysis. Please check the URL.'))
      .finally(() => setLoading(false))
  }, [id, analysis])

  const handleDownload = async (fmt) => {
    setDownloading(true)
    try {
      const res = await downloadReport(id, fmt)
      const url = URL.createObjectURL(res.data)
      const a   = document.createElement('a')
      a.href    = url
      a.download = `resume_analysis_${id}.${fmt}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Downloaded as ${fmt.toUpperCase()}`)
    } catch {
      toast.error('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton lines={3} />
          <Skeleton lines={6} />
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🤔</p>
          <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
          <p className="text-slate-500 mb-6">This report may have been deleted or the URL is incorrect.</p>
          <Link to="/upload" className="btn-glow px-6 py-3 rounded-xl text-sm font-semibold text-white">
            Start Fresh
          </Link>
        </div>
      </div>
    )
  }

  const shortlistColor =
    analysis.recruiter_shortlist_prediction === 'Yes'   ? 'text-success' :
    analysis.recruiter_shortlist_prediction === 'Maybe' ? 'text-accent'  : 'text-danger'

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-0 w-80 h-80 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Page header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <Link to="/upload" className="text-slate-600 hover:text-slate-400 text-sm flex items-center gap-1 mb-2 transition-colors">
              ← New Analysis
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Analysis Report <span className="text-slate-600 text-lg">#{id}</span>
            </h1>
            {filename && <p className="text-slate-500 text-sm mt-1">📄 {filename}</p>}
          </div>

          {/* Download buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
              className="btn-outline px-4 py-2 rounded-lg text-sm font-medium text-slate-300 flex items-center gap-2"
            >
              📥 PDF
            </button>
            <button
              onClick={() => handleDownload('txt')}
              disabled={downloading}
              className="btn-outline px-4 py-2 rounded-lg text-sm font-medium text-slate-300 flex items-center gap-2"
            >
              📄 TXT
            </button>
            <Link
              to="/history"
              className="btn-outline px-4 py-2 rounded-lg text-sm font-medium text-slate-300"
            >
              📋 History
            </Link>
          </div>
        </motion.div>

        {/* ── Top metrics row ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          {/* ATS Score gauge */}
          <div className="glass-card p-6 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">ATS Score</p>
            <ScoreGauge score={analysis.ats_score ?? 0} size={140} />
          </div>

          {/* Recruiter impression */}
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Recruiter Impression</p>
            <div className="text-6xl font-black text-gradient">
              {analysis.recruiter_impression?.toFixed(1) ?? '—'}
            </div>
            <p className="text-slate-500 text-sm">out of 10</p>
          </div>

          {/* Would shortlist */}
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Would Recruiter Shortlist?</p>
            <div className={`text-4xl font-black ${shortlistColor}`}>
              {analysis.recruiter_shortlist_prediction ?? '—'}
            </div>
            {analysis.copied_content_warning && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/30">
                <span className="text-danger text-xs font-bold">⚠️ Possible copied content detected</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Radar chart ───────────────────────────────────────── */}
        {analysis.resume_strength_radar && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-base font-semibold text-slate-300 mb-6 flex items-center gap-2">
              📈 Resume Strength Radar
            </h2>
            <ResumeRadarChart radarData={analysis.resume_strength_radar} />
          </motion.div>
        )}

        {/* ── Tab navigation ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-dark-border pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary/20 border border-primary/40 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────── */}

        {/* ROAST TAB */}
        {activeTab === 'roast' && (
          <div className="space-y-6">
            <AnalysisCard title="Resume Roast 🔥" icon="🔥" accentColor="red" delay={0}>
              <ListItems
                items={analysis.roast}
                icon="🔥"
                iconClass="text-danger"
              />
            </AnalysisCard>

            <AnalysisCard title="Buzzword Cemetery" icon="💀" accentColor="amber" delay={0.1}>
              {analysis.buzzwords?.length ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.buzzwords.map((w) => (
                    <Tag key={w} text={w} color="amber" />
                  ))}
                </div>
              ) : <p className="text-slate-500 text-sm italic">No buzzwords found — impressive.</p>}
            </AnalysisCard>

            <AnalysisCard title="Fake-Sounding Claims" icon="🚩" accentColor="red" delay={0.2}>
              <ListItems
                items={analysis.fake_sounding_claims}
                icon="🚩"
                iconClass="text-danger"
              />
            </AnalysisCard>

            {analysis.overused_github_projects?.length > 0 && (
              <AnalysisCard title="Overused GitHub Projects Detected" icon="😐" accentColor="amber" delay={0.25}>
                <div className="flex flex-wrap gap-2">
                  {analysis.overused_github_projects.map((p) => <Tag key={p} text={p} color="amber" />)}
                </div>
                <p className="text-xs text-slate-600 mt-3">These projects appear on thousands of junior dev resumes. They add no differentiation.</p>
              </AnalysisCard>
            )}
          </div>
        )}

        {/* ATS TAB */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            <AnalysisCard title="ATS Keyword Analysis" icon="🔑" accentColor="cyan" delay={0}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-success uppercase tracking-wider mb-3">✅ Keywords Found</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.ats_keywords?.found?.map((k) => <Tag key={k} text={k} color="green" />)}
                    {!analysis.ats_keywords?.found?.length && <p className="text-slate-500 text-sm italic">None detected.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-danger uppercase tracking-wider mb-3">❌ Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.ats_keywords?.missing?.map((k) => <Tag key={k} text={k} color="danger" />)}
                    {!analysis.ats_keywords?.missing?.length && <p className="text-slate-500 text-sm italic">None identified.</p>}
                  </div>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Formatting Issues" icon="📐" accentColor="amber" delay={0.1}>
              <ListItems items={analysis.formatting_issues} icon="⚠️" iconClass="text-accent" />
            </AnalysisCard>
          </div>
        )}

        {/* IMPROVEMENTS TAB */}
        {activeTab === 'improvements' && (
          <div className="space-y-6">
            <AnalysisCard title="Improved Bullet Points" icon="✏️" accentColor="green" delay={0}>
              <ImprovementSuggestions bullets={analysis.improved_bullets} />
            </AnalysisCard>
          </div>
        )}

        {/* INTERVIEW TAB */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <AnalysisCard title="Interview Questions" icon="🎯" accentColor="cyan" delay={0}>
              <InterviewQuestions questions={analysis.interview_questions} />
            </AnalysisCard>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <AnalysisCard title="Skill Confidence Meter" icon="📊" accentColor="purple" delay={0}>
              <SkillConfidence skills={analysis.skill_confidence} />
            </AnalysisCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnalysisCard title="Weak / Unsubstantiated Skills" icon="⚠️" accentColor="amber" delay={0.1}>
                <div className="flex flex-wrap gap-2">
                  {analysis.weak_skills?.map((s) => <Tag key={s} text={s} color="amber" />)}
                  {!analysis.weak_skills?.length && <p className="text-slate-500 text-sm italic">None detected.</p>}
                </div>
              </AnalysisCard>

              <AnalysisCard title="Missing Skills" icon="🔍" accentColor="red" delay={0.15}>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills?.map((s) => <Tag key={s} text={s} color="danger" />)}
                  {!analysis.missing_skills?.length && <p className="text-slate-500 text-sm italic">None identified.</p>}
                </div>
              </AnalysisCard>
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <AnalysisCard title="Reality Check 🪞" icon="🪞" accentColor="red" delay={0}>
              <ListItems items={analysis.reality_check} icon="→" iconClass="text-danger" />
            </AnalysisCard>

            <AnalysisCard title="How to Make This Resume Top 1% 🏆" icon="🏆" accentColor="amber" delay={0.1}>
              <ListItems items={analysis.top_1_percent_advice} icon="★" iconClass="text-accent" />
            </AnalysisCard>

            <AnalysisCard title="Portfolio Project Suggestions" icon="🚀" accentColor="cyan" delay={0.15}>
              <ListItems items={analysis.portfolio_suggestions} icon="💡" iconClass="text-secondary" />
            </AnalysisCard>

            <AnalysisCard title="Missing Projects" icon="📁" accentColor="purple" delay={0.2}>
              <ListItems items={analysis.missing_projects} icon="📌" iconClass="text-primary" />
            </AnalysisCard>

            {analysis.linkedin_headline && (
              <AnalysisCard title="Suggested LinkedIn Headline" icon="💼" accentColor="cyan" delay={0.25}>
                <div className="flex items-start gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-xl">
                  <span className="text-2xl">💼</span>
                  <p className="text-slate-200 font-medium leading-relaxed">{analysis.linkedin_headline}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(analysis.linkedin_headline); toast.success('Copied!') }}
                  className="mt-3 text-xs text-secondary hover:underline"
                >
                  📋 Copy to clipboard
                </button>
              </AnalysisCard>
            )}

            {analysis.github_bio && (
              <AnalysisCard title="GitHub Profile Bio" icon="🐙" accentColor="purple" delay={0.3}>
                <div className="p-4 bg-dark-card2 border border-dark-border rounded-xl">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {analysis.github_bio}
                  </pre>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(analysis.github_bio); toast.success('Copied!') }}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  📋 Copy to clipboard
                </button>
              </AnalysisCard>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/upload"
            className="btn-glow inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white"
          >
            🔥 Analyse Another Resume
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
