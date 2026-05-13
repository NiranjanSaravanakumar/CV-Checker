import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage   from './pages/LandingPage'
import UploadPage    from './pages/UploadPage'
import AnalysisPage  from './pages/AnalysisPage'
import HistoryPage   from './pages/HistoryPage'
import AboutPage     from './pages/AboutPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-dark font-sans flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"               element={<LandingPage />} />
              <Route path="/upload"         element={<UploadPage />} />
              <Route path="/analysis/:id"   element={<AnalysisPage />} />
              <Route path="/history"        element={<HistoryPage />} />
              <Route path="/about"          element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
