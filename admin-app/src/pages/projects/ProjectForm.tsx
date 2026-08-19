import { useEffect, useState, type FormEvent } from "react";
import type { Navigate } from "../../hooks/useHashRoute";
import { useSite } from "../../hooks/useSite";
import { createProject, getProject, updateProject } from "../../lib/api";
import type { WorldUpsert } from "../../lib/types";
import { FormField, inputClass } from "../../components/FormField";
import { SaveStatusBanner, type SaveStatus } from "../../components/SaveStatusBanner";

const BLANK: WorldUpsert = {
  slug: "",
  world: "",
  title: "",
  summary: "",
  stack: [],
  year: "",
  enemy: "",
  difficulty: 2,
  status: "In Progress",
};

export function ProjectForm({ slug, navigate }: { slug: string | null; navigate: Navigate }) {
  const { siteSlug } = useSite();
  const isEdit = slug !== null;
  const [form, setForm] = useState<WorldUpsert>(BLANK);
  const [stackText, setStackText] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  useEffect(() => {
    if (!isEdit || !slug) return;
    setLoading(true);
    getProject(siteSlug, slug)
      .then((p) => {
        setForm({ ...p });
        setStackText(p.stack.join(", "));
      })
      .catch((err) => setStatus({ state: "error", message: String(err) }))
      .finally(() => setLoading(false));
  }, [isEdit, slug, siteSlug]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const dto: WorldUpsert = {
      ...form,
      stack: stackText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setStatus({ state: "saving" });
    try {
      if (isEdit && slug) {
        await updateProject(siteSlug, slug, dto);
      } else {
        await createProject(siteSlug, dto);
      }
      setStatus({ state: "saved" });
      navigate("/projects");
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{isEdit ? `Edit ${slug}` : "New project"}</h1>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
        <FormField label="Slug" hint={isEdit ? "Locked — renaming means delete + recreate." : "URL-safe id, e.g. smart-habit-tracker"}>
          <input
            className={inputClass}
            value={form.slug}
            disabled={isEdit}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </FormField>
        <FormField label="World badge" hint='e.g. "1-1"'>
          <input className={inputClass} value={form.world} onChange={(e) => setForm({ ...form, world: e.target.value })} required />
        </FormField>
        <FormField label="Title">
          <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>
        <FormField label="Summary">
          <textarea
            className={inputClass}
            rows={3}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Stack" hint="Comma-separated, e.g. React, Express, Postgres">
          <input className={inputClass} value={stackText} onChange={(e) => setStackText(e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Year">
            <input className={inputClass} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          </FormField>
          <FormField label="Difficulty">
            <input
              type="number"
              className={inputClass}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })}
            />
          </FormField>
        </div>
        <FormField label="Enemy" hint='The "boss fight" tag, e.g. TIMEZONE BUG'>
          <input className={inputClass} value={form.enemy} onChange={(e) => setForm({ ...form, enemy: e.target.value })} required />
        </FormField>
        <FormField label="Status">
          <input
            className={inputClass}
            list="status-options"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
          />
          <datalist id="status-options">
            <option value="Shipped" />
            <option value="In Progress" />
            <option value="Live" />
            <option value="Archived" />
          </datalist>
        </FormField>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="rounded bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700">
            Save
          </button>
          <button type="button" onClick={() => navigate("/projects")} className="text-sm text-gray-600 hover:underline">
            Cancel
          </button>
          <SaveStatusBanner status={status} />
        </div>
      </form>
    </div>
  );
}
