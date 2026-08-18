import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type ProjectListItem } from '../lib/api'

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.listProjects()
      .then((data) => setProjects(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-8 font-mono text-gray-400">Loading...</p>
  }

  if (error) {
    return <p className="p-8 font-mono text-red-400">Error: {error}</p>
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono p-8">
      <h1 className="text-4xl mb-2">ayush.dev</h1>
      <p className="text-gray-400 mb-8">full-stack dev · sydney via kathmandu</p>

      <h2 className="text-2xl mb-4">— select a world —</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            className="block border-2 border-white p-4 hover:bg-white hover:text-black transition-colors"
          >
            <div className="text-sm text-red-400 mb-1">WORLD {p.world}</div>
            <h3 className="text-xl mb-2">{p.title}</h3>
            <p className="text-sm mb-3 line-clamp-2">{p.tldr}</p>
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="text-xs border border-current px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}