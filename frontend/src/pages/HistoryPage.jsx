import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { getHistory, deleteAnalysis } from '../utils/api'

function ScoreBadge({ score }) {
  const color =
    score >= 75 ? 'text-success bg-success/10 border-success/30' :
    score >= 50 ? 'text-accent bg-accent/10 border-accent/30'    :
                  'text-danger bg-danger/10 border-danger/30'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score ?? '—'}
    </span>
  )
}

export default function HistoryPage() {
  const [records,  setRecords]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(1)
  const [deleting, setDeleting] = useState(null)

  const fetchHistory = (p = 1) => {
    setLoading(true)
    getHistory(p)
      .then((res) => {
        setRecords(res.data.analyses)
        setTotal(res.data.total)
        setPages(res.data.pages)
        setPage(p)
      })
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHistory(1) }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteAnalysis(id)
      toast.success('Analysis deleted.')
      fetchHistory(page)
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-black text-white">
              Analysis <span className="text-gradient">History</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{total} analyses stored</p>
          </div>
          <Link to="/upload" className="btn-glow px-5 py-2 rounded-lg text-sm font-semibold text-white">
            + New Analysis
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 h-20 skeleton rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && records.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <p className="text-5xl mb-4">📭</p>
            <h2 className="text-xl font-bold text-white mb-2">No Analyses Yet</h2>
            <p className="text-slate-500 mb-6">Upload your first resume to get roasted.</p>
            <Link to="/upload" className="btn-glow px-8 py-3 rounded-xl text-sm font-bold text-white">
              🔥 Get Roasted
            </Link>
          </motion.div>
        )}

        {/* Records list */}
        {!loading && records.length > 0 && (
          <div className="space-y-4">
            {records.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{rec.filename}</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      {new Date(rec.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-14 sm:ml-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">ATS</span>
                    <ScoreBadge score={rec.ats_score} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Score</span>
                    <span className="text-xs font-mono text-slate-400">
                      {rec.recruiter_score?.toFixed(1) ?? '—'}/10
                    </span>
                  </div>

                  <Link
                    to={`/analysis/${rec.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
                  >
                    View →
                  </Link>

                  <button
                    onClick={() => handleDelete(rec.id)}
                    disabled={deleting === rec.id}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-danger hover:bg-danger/10 transition-colors"
                    title="Delete"
                  >
                    {deleting === rec.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => fetchHistory(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg text-sm btn-outline text-slate-400 disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-slate-500 text-sm">Page {page} of {pages}</span>
            <button
              onClick={() => fetchHistory(page + 1)}
              disabled={page >= pages}
              className="px-4 py-2 rounded-lg text-sm btn-outline text-slate-400 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
