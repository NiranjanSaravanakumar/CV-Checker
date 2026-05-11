import { motion } from 'framer-motion'

/**
 * Before → After bullet point comparison cards.
 */
export default function ImprovementSuggestions({ bullets = [] }) {
  if (!bullets.length) {
    return <p className="text-slate-500 text-sm italic">No improvements suggested.</p>
  }

  return (
    <div className="space-y-5">
      {bullets.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl overflow-hidden border border-dark-border"
        >
          {/* Before */}
          <div className="flex items-start gap-3 p-4 bg-danger/5 border-b border-dark-border">
            <span className="shrink-0 px-2 py-0.5 rounded text-xs font-bold bg-danger/20 text-danger mt-0.5">
              BEFORE
            </span>
            <p className="text-slate-400 text-sm leading-relaxed line-through decoration-danger/60">
              {item.original}
            </p>
          </div>

          {/* After */}
          <div className="flex items-start gap-3 p-4 bg-success/5">
            <span className="shrink-0 px-2 py-0.5 rounded text-xs font-bold bg-success/20 text-success mt-0.5">
              AFTER
            </span>
            <p className="text-slate-200 text-sm leading-relaxed">{item.improved}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
