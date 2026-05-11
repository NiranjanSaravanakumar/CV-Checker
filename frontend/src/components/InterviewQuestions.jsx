import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TABS = [
  { id: 'technical',     label: '⚙️ Technical',     color: 'text-secondary' },
  { id: 'hr',            label: '🤝 HR / Behavioral', color: 'text-accent'    },
  { id: 'project_based', label: '🚀 Project-Based',  color: 'text-primary'   },
]

export default function InterviewQuestions({ questions = {} }) {
  const [activeTab, setActiveTab] = useState('technical')

  const currentQuestions = questions[activeTab] ?? []

  return (
    <div>
      {/* Tab bar */}
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
            <span className={`ml-2 text-xs ${tab.color}`}>
              ({(questions[tab.id] ?? []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Questions list */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {currentQuestions.length === 0 ? (
            <li className="text-slate-500 text-sm italic">No questions generated.</li>
          ) : (
            currentQuestions.map((q, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-dark-card2 border border-dark-border"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{q}</p>
              </motion.li>
            ))
          )}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}
