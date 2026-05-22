const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5019'

export type ProjectListItem = {
  slug: string
  world: string
  title: string
  year: number
  status: string
  tldr: string
  stack: string[]
  heroImageUrl: string | null
}

export type ProjectDetail = {
  slug: string
  world: string
  title: string
  year: number
  status: string
  tldr: string
  bodyMarkdown: string
  stack: string[]
  heroImageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  listProjects: () => request<ProjectListItem[]>('/api/projects'),
  getProject: (slug: string) => request<ProjectDetail>(`/api/projects/${slug}`),
}