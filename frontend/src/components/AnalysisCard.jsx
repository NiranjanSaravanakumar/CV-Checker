import { motion } from 'framer-motion'

/**
 * Generic glass-morphism card used across the analysis page.
 * Props:
 *  - title       : string – section heading
 *  - icon        : string – emoji or svg element
 *  - accentColor : 'purple' | 'cyan' | 'amber' | 'red' | 'green'
 *  - children    : React nodes
 *  - delay       : animation delay (seconds)
 */
const ACCENT_MAP = {
  purple: { border: 'border-primary/25',  heading: 'text-primary',   bg: 'bg-primary/5'  },
  cyan:   { border: 'border-secondary/25',heading: 'text-secondary',  bg: 'bg-secondary/5'},
  amber:  { border: 'border-accent/25',   heading: 'text-accent',     bg: 'bg-accent/5'   },
  red:    { border: 'border-danger/25',   heading: 'text-danger',     bg: 'bg-danger/5'   },
  green:  { border: 'border-success/25',  heading: 'text-success',    bg: 'bg-success/5'  },
}

export default function AnalysisCard({
  title,
  icon,
  accentColor = 'purple',
  children,
  delay = 0,
}) {
  const accent = ACCENT_MAP[accentColor] ?? ACCENT_MAP.purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card border ${accent.border} overflow-hidden`}
    >
      {/* Card header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-dark-border ${accent.bg}`}>
        <span className="text-xl">{icon}</span>
        <h3 className={`font-semibold text-base ${accent.heading}`}>{title}</h3>
      </div>

      {/* Card body */}
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  )
}
