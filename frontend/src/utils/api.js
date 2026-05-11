import axios from 'axios'

// In production set VITE_API_URL to your Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,  // 2 min – Gemini can be slow
})

// ─── Resume Upload ───────────────────────────────────────────────────────────
export const uploadResume = (file, onUploadProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────
export const analyzeResume = (resumeText, filename, jobDescription = '') =>
  api.post('/analyze', { resume_text: resumeText, filename, job_description: jobDescription })

// ─── Fetch single report ─────────────────────────────────────────────────────
export const getReport = (id) => api.get(`/report/${id}`)

// ─── Download report ─────────────────────────────────────────────────────────
export const downloadReport = (id, format = 'pdf') =>
  api.get(`/report/${id}/download?format=${format}`, { responseType: 'blob' })

// ─── History ──────────────────────────────────────────────────────────────────
export const getHistory = (page = 1) => api.get(`/history?page=${page}`)

export const deleteAnalysis = (id) => api.delete(`/history/${id}`)

export default api
