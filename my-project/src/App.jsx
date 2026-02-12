import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AskAi from './pages/AskAi'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages — rendered full-screen without navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ask-ai" element={<AskAi />} />

        {/* Main app pages — with navbar */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen w-full bg-transparent text-gray-900">
              <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/30 border-b border-white/20 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <Link to="/" className="font-bold text-xl tracking-tight text-white drop-shadow-md">ChatGPT</Link>
                  <div className="hidden md:flex items-center gap-4">
                    <Link to="/" className="text-white/80 hover:text-white transition drop-shadow-sm">Home</Link>
                    <Link to="/about" className="text-white/80 hover:text-white transition drop-shadow-sm">About</Link>
                    <Link to="/contact" className="text-white/80 hover:text-white transition drop-shadow-sm">Contact</Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-white/90 text-sm font-semibold hover:text-white transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 bg-white/90 text-black rounded-full text-sm font-semibold hover:bg-white transition shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              </nav>

              <main className="flex-1 flex flex-col items-center justify-center">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App