import { useEffect, useState } from 'react'

type HealthResponse = {
  status: string
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:5019/api/health') // <-- replace 5xxx with your backend port
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: HealthResponse) => setHealth(data))
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8">
      <h1 className="text-2xl mb-4">Portfolio — boot check</h1>

      {error && (
        <p className="text-red-400">Error: {error}</p>
      )}

      {!error && !health && (
        <p className="text-gray-400">Loading...</p>
      )}

      {health && (
        <div className="border-2 border-white p-4 inline-block">
          <p>API status: <span className="text-green-400">{health.status}</span></p>
          <p>Timestamp: {health.timestamp}</p>
        </div>
      )}
    </div>
  )
}

export default App