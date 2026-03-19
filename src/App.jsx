import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Docs from './pages/Docs.jsx'
import Validator from './pages/Validator.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="topnav">
        <div className="topnav-inner">
          <div className="topnav-brand">
            <span className="topnav-logo">B</span>
            <span className="topnav-title">BTML Guide</span>
            <span className="topnav-version-badge">Book Text Markup Language</span>
          </div>
          <nav className="topnav-links">
            <NavLink to="/docs" className={({ isActive }) => isActive ? 'active' : ''}>
              Documentation
            </NavLink>
            <NavLink to="/validator" className={({ isActive }) => isActive ? 'active' : ''}>
              Validator
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/docs" />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/validator" element={<Validator />} />
      </Routes>
    </div>
  )
}
