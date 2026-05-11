import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#12121A',
          color: '#e2e8f0',
          border: '1px solid #1E1E2E',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#10B981', secondary: '#0A0A0F' } },
        error:   { iconTheme: { primary: '#EF4444', secondary: '#0A0A0F' } },
      }}
    />
  </React.StrictMode>
)
