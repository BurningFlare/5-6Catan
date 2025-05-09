import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LobbyPage from './pages/Lobby'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import LobbyRoom from './pages/LobbyRoom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        } />
        <Route path="/lobby/:id" element={
          <ProtectedRoute>
            <LobbyRoom />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
