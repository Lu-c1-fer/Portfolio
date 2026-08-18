import { useEffect, useState } from "react";
import { getResume } from "../lib/api";
import type { EducationEntry, Resume as ResumeData, SkillEntry, WorkHistoryEntry } from "../lib/types";
import type { Navigate } from "../hooks/useHashRoute";
import { PixelPanel } from "../components/PixelPanel";
import { PixelButton } from "../components/PixelButton";
import { ItemTag, classifyStack } from "../components/ItemTag";

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; resume: ResumeData };

export function Resume({ navigate }: { navigate: Navigate }) {
  const [data, setData] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getResume()
      .then((resume) => {
        if (!cancelled) setData({ status: "ready", resume });
      })
      .catch(() => {
        if (!cancelled) setData({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-nesSky min-h-[80vh] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <PixelButton color="black" onClick={() => navigate("/")}>◀ MAP</PixelButton>

        <PixelPanel color="white" className="p-5 sm:p-6 mt-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-pixel text-[16px] text-nesBlack">RESUME</h1>
            {data.status === "ready" && data.resume.resumePdfUrl && (
              <a href={data.resume.resumePdfUrl} target="_blank" rel="noreferrer">
                <PixelButton color="gold">PDF ▶</PixelButton>
              </a>
            )}
          </div>

          {data.status === "loading" && <p className="font-pixel text-[9px] text-nesBlack/60 mt-4">LOADING…</p>}
          {data.status === "error" && <p className="font-pixel text-[9px] text-nesRed mt-4">Couldn't load the resume.</p>}

          {data.status === "ready" && (
            <div className="mt-5 space-y-8">
              {data.resume.summary && (
                <p className="font-body text-[17px] text-nesBlack/90 leading-[1.75]">{data.resume.summary}</p>
              )}

              {data.resume.workHistory.length > 0 && (
                <section>
                  <h2 className="font-pixel text-[12px] text-nesRed mb-4">EXPERIENCE</h2>
                  <div className="space-y-6">
                    {data.resume.workHistory.map((entry) => (
                      <WorkHistoryCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              )}

              {data.resume.education.length > 0 && (
                <section>
                  <h2 className="font-pixel text-[12px] text-nesGreen mb-4">EDUCATION</h2>
                  <div className="space-y-6">
                    {data.resume.education.map((entry) => (
                      <EducationCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              )}

              {data.resume.skills.length > 0 && (
                <section>
                  <h2 className="font-pixel text-[12px] text-nesBlue mb-4">SKILLS</h2>
                  <SkillsList skills={data.resume.skills} />
                </section>
              )}
            </div>
          )}
        </PixelPanel>
      </div>
    </div>
  );
}

function WorkHistoryCard({ entry }: { entry: WorkHistoryEntry }) {
  return (
    <div className="border-l-4 border-nesBlack pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-pixel text-[11px] text-nesBlack">{entry.role}</span>
        <span className="font-body text-[15px] text-nesBlack/60">
          {entry.startDate} – {entry.endDate ?? "Present"}
        </span>
      </div>
      <div className="font-body text-[16px] text-nesBlack/80 mt-0.5">
        {entry.company}
        {entry.location ? ` · ${entry.location}` : ""}
      </div>
      {entry.description && <p className="font-body text-[16px] text-nesBlack/85 mt-2 leading-snug">{entry.description}</p>}
      {entry.bullets.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {entry.bullets.map((b, i) => (
            <li key={i} className="font-body text-[16px] text-nesBlack/80 leading-snug flex gap-2">
              <span className="text-nesBlack/40 mt-0.5">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  return (
    <div className="border-l-4 border-nesBlack pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-pixel text-[11px] text-nesBlack">
          {entry.degree}
          {entry.fieldOfStudy ? `, ${entry.fieldOfStudy}` : ""}
        </span>
        <span className="font-body text-[15px] text-nesBlack/60">
          {entry.startDate} – {entry.endDate ?? "Present"}
        </span>
      </div>
      <div className="font-body text-[16px] text-nesBlack/80 mt-0.5">{entry.institution}</div>
      {entry.description && <p className="font-body text-[16px] text-nesBlack/85 mt-2 leading-snug">{entry.description}</p>}
    </div>
  );
}

function SkillsList({ skills }: { skills: SkillEntry[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category}>
          <div className="font-pixel text-[9px] text-nesBlack/60 mb-2">{category.toUpperCase()}</div>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter((s) => s.category === category)
              .map((s) => (
                <ItemTag key={s.id} kind={classifyStack(s.name)}>
                  {s.name}
                </ItemTag>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
