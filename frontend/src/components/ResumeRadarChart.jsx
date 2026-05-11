import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const LABELS = {
  technical_skills: 'Technical Skills',
  experience:       'Experience',
  projects:         'Projects',
  education:        'Education',
  achievements:     'Achievements',
  presentation:     'Presentation',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { subject, value } = payload[0].payload
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-slate-300 font-medium">{subject}</p>
        <p className="text-primary font-bold">{value} / 100</p>
      </div>
    )
  }
  return null
}

export default function ResumeRadarChart({ radarData }) {
  if (!radarData) return null

  const chartData = Object.entries(LABELS).map(([key, label]) => ({
    subject: label,
    value:   radarData[key] ?? 0,
    fullMark: 100,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="rgba(124,58,237,0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Resume"
            dataKey="value"
            stroke="#7C3AED"
            fill="#7C3AED"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ fill: '#7C3AED', r: 4 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
