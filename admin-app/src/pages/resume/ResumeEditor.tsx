import { useEffect, useState, type FormEvent } from "react";
import { useSite } from "../../hooks/useSite";
import { educationApi, getResume, skillsApi, updateResumeSummary, workHistoryApi } from "../../lib/api";
import type { EducationEntry, EducationUpsert, Resume, SkillEntry, SkillUpsert, WorkHistoryEntry, WorkHistoryUpsert } from "../../lib/types";
import { FormField, textareaClass } from "../../components/FormField";
import { SaveStatusBanner, type SaveStatus } from "../../components/SaveStatusBanner";
import { ResumeListSection, type FieldConfig } from "./ResumeListSection";

const WORK_HISTORY_FIELDS: FieldConfig<WorkHistoryUpsert>[] = [
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "location", label: "Location" },
  { key: "startDate", label: "Start date" },
  { key: "endDate", label: "End date (blank = present)" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "bullets", label: "Bullets", type: "list" },
];

const EDUCATION_FIELDS: FieldConfig<EducationUpsert>[] = [
  { key: "institution", label: "Institution" },
  { key: "degree", label: "Degree" },
  { key: "fieldOfStudy", label: "Field of study" },
  { key: "startDate", label: "Start date" },
  { key: "endDate", label: "End date" },
  { key: "description", label: "Description", type: "textarea" },
];

const SKILL_FIELDS: FieldConfig<SkillUpsert>[] = [
  { key: "category", label: "Category" },
  { key: "name", label: "Name" },
];

const BLANK_WORK_HISTORY: WorkHistoryUpsert = {
  company: "",
  role: "",
  location: null,
  startDate: "",
  endDate: null,
  description: null,
  bullets: [],
  order: 0,
};
const BLANK_EDUCATION: EducationUpsert = {
  institution: "",
  degree: "",
  fieldOfStudy: null,
  startDate: "",
  endDate: null,
  description: null,
  order: 0,
};
const BLANK_SKILL: SkillUpsert = { category: "", name: "", order: 0 };

export function ResumeEditor() {
  const { siteSlug } = useSite();
  const [resume, setResume] = useState<Resume | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  const load = () => {
    setLoading(true);
    getResume(siteSlug)
      .then((r) => {
        setResume(r);
        setSummary(r.summary ?? "");
      })
      .catch((err) => setStatus({ state: "error", message: String(err) }))
      .finally(() => setLoading(false));
  };

  useEffect(load, [siteSlug]);

  const saveSummary = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ state: "saving" });
    try {
      await updateResumeSummary(siteSlug, { summary, resumePdfUrl: resume?.resumePdfUrl ?? null });
      setStatus({ state: "saved" });
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
    }
  };

  if (loading || !resume) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Resume</h1>

      <form onSubmit={saveSummary} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <FormField label="Summary">
          <textarea className={textareaClass} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </FormField>
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700">
            Save summary
          </button>
          <SaveStatusBanner status={status} />
        </div>
      </form>

      <ResumeListSection<WorkHistoryEntry, WorkHistoryUpsert>
        title="Work history"
        siteSlug={siteSlug}
        entries={resume.workHistory}
        api={workHistoryApi}
        fields={WORK_HISTORY_FIELDS}
        emptyUpsert={BLANK_WORK_HISTORY}
        toUpsert={(e) => ({
          company: e.company,
          role: e.role,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          description: e.description,
          bullets: e.bullets,
          order: e.order,
        })}
        renderSummary={(e) => (
          <span>
            <span className="font-medium">{e.role}</span> · {e.company}
            {e.location ? ` · ${e.location}` : ""} · {e.startDate}–{e.endDate ?? "present"}
          </span>
        )}
        onChanged={load}
      />

      <ResumeListSection<EducationEntry, EducationUpsert>
        title="Education"
        siteSlug={siteSlug}
        entries={resume.education}
        api={educationApi}
        fields={EDUCATION_FIELDS}
        emptyUpsert={BLANK_EDUCATION}
        toUpsert={(e) => ({
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy,
          startDate: e.startDate,
          endDate: e.endDate,
          description: e.description,
          order: e.order,
        })}
        renderSummary={(e) => (
          <span>
            <span className="font-medium">{e.degree}</span>
            {e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""} · {e.institution} · {e.startDate}–{e.endDate ?? "present"}
          </span>
        )}
        onChanged={load}
      />

      <ResumeListSection<SkillEntry, SkillUpsert>
        title="Skills"
        siteSlug={siteSlug}
        entries={resume.skills}
        api={skillsApi}
        fields={SKILL_FIELDS}
        emptyUpsert={BLANK_SKILL}
        toUpsert={(e) => ({ category: e.category, name: e.name, order: e.order })}
        renderSummary={(e) => (
          <span>
            <span className="text-gray-400">{e.category}</span> · {e.name}
          </span>
        )}
        onChanged={load}
      />
    </div>
  );
}
