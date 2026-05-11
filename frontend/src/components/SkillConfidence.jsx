import { motion } from 'framer-motion'

/**
 * Horizontal confidence meter for each skill.
 * Props: skills = { skillName: confidence_0_to_100 }
 */
export default function SkillConfidence({ skills = {} }) {
  const entries = Object.entries(skills)

  if (!entries.length) {
    return <p className="text-slate-500 text-sm italic">No skill data available.</p>
  }

  // Sort descending
  const sorted = [...entries].sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">
      {sorted.map(([skill, confidence], i) => {
        const pct    = Math.min(100, Math.max(0, confidence))
        const color  =
          pct >= 75 ? '#10B981' :
          pct >= 50 ? '#F59E0B' : '#EF4444'

        return (
          <motion.div
            key={skill}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300 font-medium">{skill}</span>
              <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
            </div>
            <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
