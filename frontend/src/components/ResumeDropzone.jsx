import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, UploadCloud } from 'lucide-react'

const ACCEPTED_TYPES = {
  'application/pdf':                                              ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain':                                                   ['.txt'],
}

const MAX_SIZE = 10 * 1024 * 1024  // 10 MB

export default function ResumeDropzone({ onFileAccepted }) {
  const [error, setError] = useState('')

  const onDrop = useCallback(
    (accepted, rejected) => {
      setError('')
      if (rejected.length > 0) {
        const reason = rejected[0].errors[0]?.message || 'Invalid file'
        setError(reason)
        return
      }
      if (accepted.length > 0) {
        onFileAccepted(accepted[0])
      }
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE,
      multiple: false,
    })

  const file = acceptedFiles[0]

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          isDragReject
            ? 'border-danger bg-danger/5'
            : isDragActive
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : file
            ? 'border-success bg-success/5'
            : 'border-dark-muted bg-dark-card hover:border-primary/60 hover:bg-primary/5'
        }`}
      >
        <input {...getInputProps()} />

        {/* Scan-line animation when dragging */}
        {isDragActive && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
              style={{ animation: 'scan-line 1.5s linear infinite' }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <p className="text-xs text-slate-600">Click or drag to replace</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={isDragActive ? { scale: 1.2, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
              >
                {isDragActive
                  ? <UploadCloud className="w-8 h-8 text-primary" />
                  : <FileText className="w-8 h-8 text-primary/70" />
                }
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {isDragActive ? 'Release to upload' : 'Drop your CV here'}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  or <span className="text-primary font-medium">click to browse</span>
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="px-2 py-1 rounded bg-dark-card2 border border-dark-border">PDF</span>
                <span className="px-2 py-1 rounded bg-dark-card2 border border-dark-border">DOCX</span>
                <span className="px-2 py-1 rounded bg-dark-card2 border border-dark-border">TXT</span>
                <span>Max 10 MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-danger flex items-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  )
}
