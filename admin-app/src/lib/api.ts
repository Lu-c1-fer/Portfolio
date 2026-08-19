import { clearStoredKey, getStoredKey, notifyUnauthorized } from "./auth";
import type {
  CaseStudy,
  CaseStudyUpsert,
  EducationEntry,
  EducationUpsert,
  NowStatus,
  NowStatusUpsert,
  Profile,
  ProfileUpsert,
  Resume,
  ResumeUpsert,
  SkillEntry,
  SkillUpsert,
  WorkHistoryEntry,
  WorkHistoryUpsert,
  WorldSummary,
  WorldUpsert,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5255";

function siteBase(siteSlug: string) {
  return `/api/sites/${siteSlug}`;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const key = getStoredKey();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401) {
    clearStoredKey();
    notifyUnauthorized();
    window.location.hash = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Like request(), but a 404 resolves to null instead of throwing — for resources that may legitimately not exist yet (e.g. a project with no case study written). */
async function requestOptional<T>(path: string): Promise<T | null> {
  const key = getStoredKey();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
  });
  if (res.status === 404) return null;
  if (res.status === 401) {
    clearStoredKey();
    notifyUnauthorized();
    window.location.hash = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ---- Profile ----
export const getProfile = (siteSlug: string) => request<Profile>("GET", `${siteBase(siteSlug)}/profile`);
export const updateProfile = (siteSlug: string, dto: ProfileUpsert) =>
  request<Profile>("PUT", `${siteBase(siteSlug)}/profile`, dto);

// ---- Now status ----
export const getNowStatus = (siteSlug: string) => request<NowStatus>("GET", `${siteBase(siteSlug)}/now`);
export const updateNowStatus = (siteSlug: string, dto: NowStatusUpsert) =>
  request<NowStatus>("PUT", `${siteBase(siteSlug)}/now`, dto);

// ---- Projects ----
export const getProjects = (siteSlug: string) => request<WorldSummary[]>("GET", `${siteBase(siteSlug)}/projects`);
export const getProject = (siteSlug: string, slug: string) =>
  request<WorldSummary>("GET", `${siteBase(siteSlug)}/projects/${slug}`);
export const createProject = (siteSlug: string, dto: WorldUpsert) =>
  request<WorldSummary>("POST", `${siteBase(siteSlug)}/projects`, dto);
export const updateProject = (siteSlug: string, slug: string, dto: WorldUpsert) =>
  request<WorldSummary>("PUT", `${siteBase(siteSlug)}/projects/${slug}`, dto);
export const deleteProject = (siteSlug: string, slug: string) =>
  request<void>("DELETE", `${siteBase(siteSlug)}/projects/${slug}`);

// ---- Case study ----
export const getCaseStudy = (siteSlug: string, slug: string) =>
  requestOptional<CaseStudy>(`${siteBase(siteSlug)}/projects/${slug}/case-study`);
export const saveCaseStudy = (siteSlug: string, slug: string, dto: CaseStudyUpsert) =>
  request<CaseStudy>("PUT", `${siteBase(siteSlug)}/projects/${slug}/case-study`, dto);
export const deleteCaseStudy = (siteSlug: string, slug: string) =>
  request<void>("DELETE", `${siteBase(siteSlug)}/projects/${slug}/case-study`);

// ---- Resume (top-level fields only — sub-collections below) ----
export const getResume = (siteSlug: string) => request<Resume>("GET", `${siteBase(siteSlug)}/resume`);
export const updateResumeSummary = (siteSlug: string, dto: ResumeUpsert) =>
  request<Resume>("PUT", `${siteBase(siteSlug)}/resume`, dto);

// ---- Resume sub-resources: work history / education / skills ----
// Each is an independent per-row CRUD endpoint (own server-assigned id, own
// caller-supplied order) — not nested inside the resume PUT. One factory
// avoids writing near-identical create/update/remove three times.
function resumeSubResource<TRead, TUpsert>(kind: "work-history" | "education" | "skills") {
  const base = (siteSlug: string) => `${siteBase(siteSlug)}/resume/${kind}`;
  return {
    create: (siteSlug: string, dto: TUpsert) => request<TRead>("POST", base(siteSlug), dto),
    update: (siteSlug: string, id: number, dto: TUpsert) => request<TRead>("PUT", `${base(siteSlug)}/${id}`, dto),
    remove: (siteSlug: string, id: number) => request<void>("DELETE", `${base(siteSlug)}/${id}`),
  };
}

export const workHistoryApi = resumeSubResource<WorkHistoryEntry, WorkHistoryUpsert>("work-history");
export const educationApi = resumeSubResource<EducationEntry, EducationUpsert>("education");
export const skillsApi = resumeSubResource<SkillEntry, SkillUpsert>("skills");
