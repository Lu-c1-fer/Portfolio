import { useEffect, useRef, useState } from "react";
import { sfx } from "../lib/sfx";
import { getCaseStudy, getProject } from "../lib/api";
import type { CaseStudy, CaseStudyBlock, WorldSummary } from "../lib/types";
import type { Navigate } from "../hooks/useHashRoute";
import { PixelPanel } from "../components/PixelPanel";
import { PixelButton } from "../components/PixelButton";
import { ItemTag, classifyStack } from "../components/ItemTag";
import { NesCodeBlock } from "../components/NesCodeBlock";
import { NesCallout } from "../components/NesCallout";
import { NotFound } from "./NotFound";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "summary-only"; world: WorldSummary }
  | { status: "full"; world: WorldSummary; caseStudy: CaseStudy };

export function ProjectCaseStudy({ slug, navigate }: { slug: string; navigate: Navigate }) {
  const [data, setData] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setData({ status: "loading" });

    Promise.allSettled([getProject(slug), getCaseStudy(slug)]).then(([worldResult, caseStudyResult]) => {
      if (cancelled) return;

      if (worldResult.status !== "fulfilled") {
        setData({ status: "not-found" });
        return;
      }

      const caseStudy = caseStudyResult.status === "fulfilled" ? caseStudyResult.value : null;
      if (caseStudy) {
        setData({ status: "full", world: worldResult.value, caseStudy });
      } else {
        setData({ status: "summary-only", world: worldResult.value });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (data.status === "loading") {
    return (
      <div className="bg-nesSky min-h-[80vh] py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="font-pixel text-[9px] text-nesBlack/60">LOADING…</p>
        </div>
      </div>
    );
  }

  if (data.status === "not-found") {
    return <NotFound navigate={navigate} />;
  }

  if (data.status === "summary-only") {
    const { world } = data;
    return (
      <div className="bg-nesSky min-h-[80vh] py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <BackTo navigate={navigate} />
          <PixelPanel color="white" className="p-5 mt-6">
            <div className="font-pixel text-[9px] text-nesRed/70">WORLD {world.world}</div>
            <h1 className="font-pixel text-[16px] text-nesBlack mt-2">{world.title}</h1>
            <p className="font-body text-[17px] text-nesBlack/85 mt-3">{world.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {world.stack.map((s) => (
                <ItemTag key={s} kind={classifyStack(s)}>
                  {s}
                </ItemTag>
              ))}
            </div>
            <div className="mt-5">
              <NesCallout variant="tip" title="?">
                Full case study isn't written yet for this project.
              </NesCallout>
            </div>
          </PixelPanel>
        </div>
      </div>
    );
  }

  return <FullCaseStudy world={data.world} caseStudy={data.caseStudy} navigate={navigate} />;
}

function FullCaseStudy({ world, caseStudy, navigate }: { world: WorldSummary; caseStudy: CaseStudy; navigate: Navigate }) {
  const [activeId, setActiveId] = useState(caseStudy.sections[0]?.sectionId);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 },
    );
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [caseStudy]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      sfx.play("blip");
    }
  };

  return (
    <div className="bg-nesSky min-h-[80vh] py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <BackTo navigate={navigate} />

        <PixelPanel color="black" className="p-5 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="font-pixel text-[9px] text-nesGold/80">
                WORLD {caseStudy.world} · {caseStudy.year}
              </div>
              <h1 className="font-pixel text-[16px] sm:text-[20px] text-nesWhite mt-2 leading-tight">{world.title}</h1>
            </div>
            <div className="font-pixel text-[8px] text-nesWhite/60">CASE STUDY · DOC</div>
          </div>
        </PixelPanel>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-6">
          <aside className="lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
            <PixelPanel color="white" className="p-4">
              <div className="font-pixel text-[8px] text-nesRed mb-3">SECTIONS</div>
              <ul className="space-y-1.5">
                {caseStudy.sections.map((s) => (
                  <li key={s.sectionId}>
                    <button
                      onClick={() => scrollTo(s.sectionId)}
                      className={`w-full text-left font-pixel text-[9px] py-1 flex items-center gap-1.5 ${activeId === s.sectionId ? "text-nesRed" : "text-nesBlack/70 hover:text-nesBlack"}`}
                    >
                      <span className={activeId === s.sectionId ? "opacity-100" : "opacity-0"}>▶</span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="font-pixel text-[8px] text-nesRed mt-5 mb-2">STACK</div>
              <div className="flex flex-wrap gap-1.5">
                {caseStudy.stack.map((s) => (
                  <ItemTag key={s} kind={classifyStack(s)}>
                    {s}
                  </ItemTag>
                ))}
              </div>
            </PixelPanel>
          </aside>

          <article className="order-1 lg:order-2 max-w-2xl">
            <PixelPanel color="gold" className="p-4">
              <div className="font-pixel text-[10px] text-nesBlack mb-2">TL;DR</div>
              <p className="font-body text-[17px] text-nesBlack leading-snug">{caseStudy.tldr}</p>
            </PixelPanel>

            <div className="mt-6 space-y-10">
              {caseStudy.sections.map((s) => (
                <section
                  key={s.sectionId}
                  id={s.sectionId}
                  ref={(el) => {
                    refs.current[s.sectionId] = el;
                  }}
                  className="scroll-mt-24"
                >
                  <h2 className="font-pixel text-[14px] text-nesBlack flex items-center gap-2">
                    <span className="text-nesRed">▶</span>
                    {s.title}
                  </h2>
                  <div className="mt-4">
                    {s.blocks.map((b, i) => (
                      <NesBlock key={i} block={b} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t-4 border-dashed border-nesBlack/30 flex items-center justify-between">
              <PixelButton color="black" onClick={() => navigate("/worlds")}>◀ BACK</PixelButton>
              <span className="font-pixel text-[9px] text-nesBlack/60">END OF PROJECT</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function NesBlock({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "p":
      return <p className="my-3 font-body text-[17px] text-nesBlack/90 leading-[1.7]">{block.text}</p>;
    case "ul":
      return (
        <ul className="my-3 space-y-2">
          {(block.items ?? []).map((it, i) => (
            <li key={i} className="font-body text-[17px] text-nesBlack/90 leading-snug flex gap-3">
              <span className="text-nesRed font-pixel text-[12px] mt-0.5">▸</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return <NesCodeBlock lang={block.lang ?? "text"} code={block.text ?? ""} />;
    case "block":
      return (
        <NesCallout variant={block.variant ?? "tip"} title={block.title}>
          {block.text}
        </NesCallout>
      );
    default:
      return null;
  }
}

function BackTo({ navigate }: { navigate: Navigate }) {
  return (
    <PixelButton color="black" onClick={() => navigate("/worlds")}>◀ MAP</PixelButton>
  );
}
