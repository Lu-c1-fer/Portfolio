import { useEffect, useState } from "react";
import type { Navigate } from "../../hooks/useHashRoute";
import { useSite } from "../../hooks/useSite";
import { getCaseStudy, getProject, saveCaseStudy } from "../../lib/api";
import { parseShorthand } from "../../lib/parseShorthand";
import type { CaseStudySectionUpsert, CaseStudyUpsert } from "../../lib/types";
import { FormField, inputClass, textareaClass } from "../../components/FormField";
import { SaveStatusBanner, type SaveStatus } from "../../components/SaveStatusBanner";
import { CaseStudyBlockPreview } from "../../components/CaseStudyBlockPreview";

type SectionDraft = {
  key: string;
  title: string;
  text: string;
  previewOpen: boolean;
};

function slugifyBase(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** Derives each section's sectionId from its title, de-duplicating within this case study — the UI never shows a raw id field. */
function assignSectionIds(sections: SectionDraft[]): CaseStudySectionUpsert[] {
  const seen = new Map<string, number>();
  return sections.map((s) => {
    const base = slugifyBase(s.title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const sectionId = count === 0 ? base : `${base}-${count + 1}`;
    return { sectionId, title: s.title, blocks: parseShorthand(s.text) };
  });
}

let keyCounter = 0;
const nextKey = () => `s${++keyCounter}-${Date.now()}`;

export function CaseStudyEditor({ slug, navigate }: { slug: string; navigate: Navigate }) {
  const { siteSlug } = useSite();
  const [projectTitle, setProjectTitle] = useState(slug);
  const [projectWorld, setProjectWorld] = useState("");
  const [title, setTitle] = useState("");
  const [tldr, setTldr] = useState("");
  const [stackText, setStackText] = useState("");
  const [year, setYear] = useState("");
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  useEffect(() => {
    setLoading(true);
    Promise.all([getProject(siteSlug, slug), getCaseStudy(siteSlug, slug)])
      .then(([project, caseStudy]) => {
        setProjectTitle(project.title);
        setProjectWorld(project.world);
        if (caseStudy) {
          setTitle(caseStudy.title);
          setTldr(caseStudy.tldr);
          setStackText(caseStudy.stack.join(", "));
          setYear(caseStudy.year);
          setSections(
            caseStudy.sections.map((s) => ({
              key: nextKey(),
              title: s.title,
              text: blocksToShorthand(s.blocks),
              previewOpen: false,
            })),
          );
        } else {
          // No case study yet — seed sensible defaults from the project itself.
          setTitle(project.title);
          setTldr("");
          setStackText(project.stack.join(", "));
          setYear(project.year);
          setSections([]);
        }
      })
      .catch((err) => setStatus({ state: "error", message: String(err) }))
      .finally(() => setLoading(false));
  }, [siteSlug, slug]);

  const addSection = () => {
    setSections([...sections, { key: nextKey(), title: "New section", text: "", previewOpen: false }]);
  };

  const removeSection = (key: string) => {
    setSections(sections.filter((s) => s.key !== key));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const updateSection = (key: string, patch: Partial<SectionDraft>) => {
    setSections(sections.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  };

  const save = async () => {
    // World badge isn't editable here (it lives on the project record, not
    // the case study form) — reuse what we already loaded so we don't
    // clobber it with an empty string.
    const dto: CaseStudyUpsert = {
      world: projectWorld,
      title,
      year,
      stack: stackText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tldr,
      sections: assignSectionIds(sections),
    };
    setStatus({ state: "saving" });
    try {
      await saveCaseStudy(siteSlug, slug, dto);
      setStatus({ state: "saved" });
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Case study — {projectTitle}</h1>
        <button onClick={() => navigate("/projects")} className="text-sm text-gray-600 hover:underline">
          Back to projects
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 mb-6">
        <FormField label="Title">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormField>
        <FormField label="TL;DR">
          <textarea className={inputClass} rows={3} value={tldr} onChange={(e) => setTldr(e.target.value)} required />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stack" hint="Comma-separated">
            <input className={inputClass} value={stackText} onChange={(e) => setStackText(e.target.value)} />
          </FormField>
          <FormField label="Year">
            <input className={inputClass} value={year} onChange={(e) => setYear(e.target.value)} required />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={section.key} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                className={`${inputClass} flex-1 font-medium`}
                value={section.title}
                onChange={(e) => updateSection(section.key, { title: e.target.value })}
                placeholder="Section title"
              />
              <button
                type="button"
                onClick={() => moveSection(i, -1)}
                disabled={i === 0}
                className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-900"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveSection(i, 1)}
                disabled={i === sections.length - 1}
                className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-900"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => updateSection(section.key, { previewOpen: !section.previewOpen })}
                className="text-sm text-blue-700 hover:underline whitespace-nowrap"
              >
                {section.previewOpen ? "Hide preview" : "Preview"}
              </button>
              <button type="button" onClick={() => removeSection(section.key)} className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <textarea
              className={textareaClass}
              rows={8}
              value={section.text}
              onChange={(e) => updateSection(section.key, { text: e.target.value })}
              placeholder={
                'Blank line = new paragraph\n- list item\n- another item\n\n```ts\nconst x = 1;\n```\n\n!!! warn: Title\nCallout body until the next blank line.'
              }
            />
            {section.previewOpen && (
              <div className="mt-3">
                <CaseStudyBlockPreview blocks={parseShorthand(section.text)} />
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={addSection} className="mt-4 text-sm text-blue-700 hover:underline">
        + Add section
      </button>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
        <button type="button" onClick={save} className="rounded bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700">
          Save case study
        </button>
        <SaveStatusBanner status={status} />
      </div>
    </div>
  );
}

/** Best-effort reconstruction of shorthand source from parsed blocks, so re-opening an existing case study shows editable text rather than a blank textarea. Not the inverse of parseShorthand in a byte-exact sense — round-tripping through save will re-derive identical blocks either way. */
function blocksToShorthand(blocks: { type: string; text: string | null; items: string[] | null; lang: string | null; variant: string | null; title: string | null }[]): string {
  return blocks
    .map((b) => {
      if (b.type === "p") return b.text ?? "";
      if (b.type === "ul") return (b.items ?? []).map((it) => `- ${it}`).join("\n");
      if (b.type === "code") return "```" + (b.lang ?? "") + "\n" + (b.text ?? "") + "\n```";
      if (b.type === "block") {
        const header = b.title ? `!!! ${b.variant ?? "tip"}: ${b.title}` : `!!! ${b.variant ?? "tip"}`;
        return `${header}\n${b.text ?? ""}`;
      }
      return "";
    })
    .join("\n\n");
}
