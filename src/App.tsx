import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Play from './pages/Play'
import Monitor from './pages/Monitor'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jugar" element={<Play />} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </Router>
  )
}

export default App
