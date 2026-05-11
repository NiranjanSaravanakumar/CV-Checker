import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import ResumeDropzone from '../components/ResumeDropzone'
import LoadingScreen  from '../components/LoadingScreen'
import { uploadResume, analyzeResume } from '../utils/api'

const TIPS = [
  '💡 Make sure your resume is text-based, not a scanned image.',
  '💡 PDF works best for most ATS systems.',
  '💡 Remove password protection before uploading.',
  '💡 Keep your resume to 1–2 pages for best results.',
]

const JD_PLACEHOLDER = `Paste the job description here (optional but highly recommended).

Example:
We are looking for a Senior Software Engineer with 5+ years experience in React, Node.js, and AWS. The ideal candidate has strong system design skills and experience with microservices architecture...`

export default function UploadPage() {
  const [file,      setFile]      = useState(null)
  const [jd,        setJd]        = useState('')
  const [step,      setStep]      = useState('idle')   // idle | uploading | analysing | done
  const [loadMsg,   setLoadMsg]   = useState('')
  const navigate = useNavigate()

  const handleFileAccepted = (f) => setFile(f)

  const handleAnalyse = async () => {
    if (!file) {
      toast.error('Please select a resume file first.')
      return
    }

    try {
      // Step 1: Upload & parse
      setStep('uploading')
      setLoadMsg('Uploading and parsing your resume…')
      const uploadRes = await uploadResume(file)
      const { resume_text, filename } = uploadRes.data

      // Step 2: AI analyse (pass job description if provided)
      setStep('analysing')
      setLoadMsg('Roasting your resume with Gemini AI…')
      const analyseRes = await analyzeResume(resume_text, filename, jd.trim())
      const { id, analysis } = analyseRes.data

      // Step 3: Navigate to results, passing analysis in state to avoid extra API round-trip
      navigate(`/analysis/${id}`, { state: { analysis, filename } })
    } catch (err) {
      setStep('idle')
      const msg =
        err.response?.data?.error ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. Gemini AI may be slow — please retry.' : err.message)
      toast.error(msg)
    }
  }

  if (step === 'uploading' || step === 'analysing') {
    return <LoadingScreen message={loadMsg} />
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 grid-bg">
      {/* Glow blobs */}
      <div className="fixed top-1/3 left-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-64 h-64 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black text-white mb-3">
            <span className="text-gradient">Resume Reality Check</span>
          </h1>
          <p className="text-slate-500 text-base">
            Upload your resume — add a job description for targeted insights. 🎯
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* ── Left column: Resume Dropzone ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-lg">📄</div>
              <div>
                <h2 className="text-white font-bold text-base">Resume</h2>
                <p className="text-slate-500 text-xs">PDF, DOCX, or TXT · max 10 MB</p>
              </div>
            </div>

            <div className="flex-1">
              <ResumeDropzone onFileAccepted={handleFileAccepted} />
            </div>
          </motion.div>

          {/* ── Right column: Job Description ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-lg">💼</div>
                <div>
                  <h2 className="text-white font-bold text-base">Job Description</h2>
                  <p className="text-slate-500 text-xs">Optional — enables targeted gap analysis</p>
                </div>
              </div>
              {jd.trim() && (
                <span className="text-xs px-2 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-medium">
                  {jd.trim().split(/\s+/).length} words
                </span>
              )}
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder={JD_PLACEHOLDER}
              rows={12}
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-secondary/50 focus:bg-white/8 transition-all duration-200 leading-relaxed"
            />

            {jd.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20"
              >
                <span className="text-secondary text-sm mt-0.5">✓</span>
                <p className="text-xs text-slate-400">
                  JD detected — the AI will match your resume against this role, flag missing keywords, and tailor interview questions.
                </p>
              </motion.div>
            )}

            {!jd.trim() && (
              <p className="mt-3 text-xs text-slate-600 text-center">
                Without a JD the AI gives general feedback. Add one for role-specific insights.
              </p>
            )}
          </motion.div>
        </div>

        {/* Analyse button — full width below both columns */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <motion.button
            onClick={handleAnalyse}
            disabled={!file}
            whileHover={file ? { scale: 1.015 } : {}}
            whileTap={file ? { scale: 0.985 } : {}}
            className={`w-full py-4 rounded-xl text-base font-bold transition-all duration-300 ${
              file
                ? 'btn-glow text-dark cursor-pointer'
                : 'bg-dark-muted text-slate-600 cursor-not-allowed border border-dark-border'
            }`}
          >
            {file
              ? jd.trim()
                ? '🎯 Analyse Against This JD'
                : '🎯 Analyse My Resume'
              : 'Select a resume file to continue'}
          </motion.button>
        </motion.div>

        {/* Tips + Privacy — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Tips for Best Results
            </h3>
            <ul className="space-y-2">
              {TIPS.map((tip) => (
                <li key={tip} className="text-sm text-slate-500">{tip}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              How JD Matching Works
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-slate-500">🎯 Compares your skills against role requirements</li>
              <li className="text-sm text-slate-500">🔑 Finds missing ATS keywords from the JD</li>
              <li className="text-sm text-slate-500">❓ Generates role-specific interview questions</li>
              <li className="text-sm text-slate-500">📊 Re-weights ATS score for the target role</li>
            </ul>
          </motion.div>
        </div>

        {/* Privacy notice */}
        <p className="text-center text-xs text-slate-700 mt-6">
          🔒 Your resume and job description are never stored permanently. Files are deleted immediately after text extraction.
        </p>
      </div>
    </div>
  )
}
