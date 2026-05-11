import { motion } from 'framer-motion'

/**
 * Circular ATS score gauge.
 * Props: score (0-100), size (px)
 */
export default function ScoreGauge({ score = 0, size = 160 }) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const radius       = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset   = circumference * (1 - clampedScore / 100)

  const color =
    clampedScore >= 75 ? '#10B981' :
    clampedScore >= 50 ? '#F59E0B' : '#EF4444'

  const label =
    clampedScore >= 75 ? 'ATS Friendly' :
    clampedScore >= 50 ? 'Needs Work'   : 'ATS Hostile'

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(30,30,46,1)" strokeWidth={12}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-black text-white leading-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          >
            {clampedScore}
          </motion.span>
          <span className="text-xs text-slate-500 mt-1">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{label}</span>
    </div>
  )
}
