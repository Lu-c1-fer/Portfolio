import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { api, type ProjectDetail } from '../lib/api'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.getProject(slug)
      .then((data) => setProject(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <p className="p-8 font-mono text-gray-400">Loading...</p>
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-black text-white font-mono p-8">
        <p className="text-red-400 mb-4">{error ?? 'Project not found'}</p>
        <Link to="/" className="underline">← back home</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <div className="p-8 border-b-2 border-white">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">← back</Link>
        <div className="text-sm text-yellow-400 mt-4 mb-1">WORLD {project.world} · {project.year}</div>
        <h1 className="text-4xl">{project.title}</h1>
      </div>

      <div className="p-8 max-w-3xl">
        <div className="border-2 border-yellow-400 bg-yellow-400/10 p-4 mb-8">
          <div className="text-yellow-400 mb-2 text-sm">TL;DR</div>
          <p>{project.tldr}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {project.bodyMarkdown}
          </ReactMarkdown>
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="underline">
              github →
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="underline">
              live →
            </a>
          )}
        </div>
      </div>
    </main>
  )
}