import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ProjectPage from './Pages/ProjectPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="*" element={
        <main className="min-h-screen bg-black text-white font-mono p-8">
          <h1 className="text-2xl">WORLD ?-? · GAME OVER</h1>
          <a href="/" className="underline mt-4 inline-block">← back home</a>
        </main>
      } />
    </Routes>
  )
}

export default App