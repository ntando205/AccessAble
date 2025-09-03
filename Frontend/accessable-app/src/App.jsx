import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import AccessibilityMap from './AccessibilityMap.jsx'
import Jobs from './Jobs.jsx'
import Healthcare from './Healthcare.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* You can add navigation here later */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<AccessibilityMap />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/healthcare" element={<Healthcare />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App