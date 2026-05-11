import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-base">
                <span className="text-gradient">Resume</span>
                <span className="text-white"> Reality Check</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Honest AI resume analysis. ATS scoring, skill gap detection,
              improved bullet points, interview prep — all in one place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home',    to: '/' },
                { label: 'Upload Resume', to: '/upload' },
                { label: 'History', to: '/history' },
                { label: 'About',   to: '/about' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-slate-500 hover:text-primary text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Powered By
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Gemini AI', 'React', 'Flask', 'Tailwind CSS', 'SQLite'].map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-dark-card2 border border-dark-border rounded text-xs text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Resume Reality Check. Built for job seekers.
          </p>
          <p className="text-slate-600 text-xs">
            For educational use only. Roast responsibly. 🔥
          </p>
        </div>
      </div>
    </footer>
  )
}
