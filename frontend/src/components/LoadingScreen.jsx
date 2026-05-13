import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu } from 'lucide-react'

const AI_MESSAGES = [
  'Scanning for buzzwords and corporate filler…',
  'Detecting AI-generated content…',
  'Calculating ATS compatibility score…',
  'Evaluating recruiter first impression…',
  'Identifying skill gaps…',
  'Analysing project depth and authenticity…',
  'Generating improved bullet points…',
  'Crafting tailored interview questions…',
  'Checking for overused project templates…',
  'Building your personalised improvement plan…',
  'Running final quality checks…',
  'Finalising your reality check report…',
]

export default function LoadingScreen({ message = 'Analysing your resume…' }) {
  const [msgIndex,  setMsgIndex]  = useState(0)
  const [progress,  setProgress]  = useState(0)

  // Cycle AI messages
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % AI_MESSAGES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // Fake progress bar (never actually reaches 100 until done)
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p  // Stall before completion
        return p + Math.random() * 4
      })
    }, 600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-md">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-dark-border" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-secondary animate-spin"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        <p className="text-slate-500 text-sm mb-8 font-mono">Gemini AI is hard at work…</p>

        {/* AI message cycler */}
        <div className="glass-card px-6 py-4 mb-8 min-h-[60px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-slate-300 font-mono text-center"
            >
              {AI_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="text-slate-600 text-xs mt-2 font-mono">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
