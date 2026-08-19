// Read-model types below are copied verbatim from frontend/src/lib/types.ts
// to guarantee shape parity with the backend's read DTOs. Write-model
// ("Upsert") types are new here — the public frontend is read-only and has
// no need for them.

export type Profile = {
  name: string;
  fullName: string;
  tagline: string;
  bio: string;
};

export type ProfileUpsert = Profile;

export type NowStatus = {
  hpLabel: string;
  hpValue: string;
  xpLabel: string;
  xpValue: string;
  coinsLabel: string;
  coinsValue: string;
  starLabel: string;
  starValue: string;
  updatedDate: string;
};

export type NowStatusUpsert = NowStatus;

export type WorldStatus = "Live" | "In Progress" | "Shipped" | "Archived";

export type WorldSummary = {
  slug: string;
  world: string;
  title: string;
  summary: string;
  stack: string[];
  year: string;
  enemy: string;
  difficulty: number;
  status: WorldStatus | string;
};

export type WorldUpsert = {
  slug: string;
  world: string;
  title: string;
  summary: string;
  stack: string[];
  year: string;
  enemy: string;
  difficulty: number;
  status: string;
};

export type CaseStudyBlock = {
  type: "p" | "ul" | "code" | "block";
  text: string | null;
  items: string[] | null;
  lang: string | null;
  variant: string | null;
  title: string | null;
};

export type CaseStudySection = {
  sectionId: string;
  title: string;
  blocks: CaseStudyBlock[];
};

export type CaseStudy = {
  world: string;
  title: string;
  year: string;
  stack: string[];
  tldr: string;
  sections: CaseStudySection[];
};

// Upsert shapes are structurally identical to the read shapes above (no ids,
// order is array position) — aliased rather than redeclared so parseShorthand
// can return CaseStudyBlock[] directly with zero transformation before it's
// dropped into a CaseStudySectionUpsert.blocks array.
export type CaseStudyBlockUpsert = CaseStudyBlock;
export type CaseStudySectionUpsert = {
  sectionId: string;
  title: string;
  blocks: CaseStudyBlockUpsert[];
};
export type CaseStudyUpsert = {
  world: string;
  title: string;
  year: string;
  stack: string[];
  tldr: string;
  sections: CaseStudySectionUpsert[];
};

export type WorkHistoryEntry = {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  bullets: string[];
  order: number;
};

export type WorkHistoryUpsert = {
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  bullets: string[];
  order: number;
};

export type EducationEntry = {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  order: number;
};

export type EducationUpsert = {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  order: number;
};

export type SkillEntry = {
  id: number;
  category: string;
  name: string;
  order: number;
};

export type SkillUpsert = {
  category: string;
  name: string;
  order: number;
};

export type Resume = {
  summary: string | null;
  resumePdfUrl: string | null;
  updatedAt: string;
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
};

// PUT /resume only ever touches these two top-level fields — work history,
// education, and skills are separate per-row CRUD sub-resources (see api.ts).
export type ResumeUpsert = {
  summary: string | null;
  resumePdfUrl: string | null;
};
