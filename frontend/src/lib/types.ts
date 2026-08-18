export type Profile = {
  name: string;
  fullName: string;
  tagline: string;
  bio: string;
};

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

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
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

export type SkillEntry = {
  id: number;
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
