import type { CaseStudy, ContactRequest, NowStatus, Profile, Resume, WorldSummary } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5255";
// This frontend only ever talks to its own site's scoped endpoints — no multi-site UI here.
const SITE_SLUG = "portfolio";
const SITE_BASE = `/api/sites/${SITE_SLUG}`;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Like get(), but a 404 resolves to null instead of throwing — for resources that may legitimately not exist yet. */
async function getOptional<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function getProfile() {
  return get<Profile>(`${SITE_BASE}/profile`);
}

export function getNowStatus() {
  return get<NowStatus>(`${SITE_BASE}/now`);
}

export function getProjects() {
  return get<WorldSummary[]>(`${SITE_BASE}/projects`);
}

export function getProject(slug: string) {
  return get<WorldSummary>(`${SITE_BASE}/projects/${slug}`);
}

export function getCaseStudy(slug: string) {
  return getOptional<CaseStudy>(`${SITE_BASE}/projects/${slug}/case-study`);
}

export function getResume() {
  return get<Resume>(`${SITE_BASE}/resume`);
}

export async function submitContact(payload: ContactRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}${SITE_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST ${SITE_BASE}/contact failed: ${res.status}`);
}
