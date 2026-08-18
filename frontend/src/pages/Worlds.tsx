import { useEffect, useState } from "react";
import { sfx } from "../lib/sfx";
import { getProjects } from "../lib/api";
import type { WorldSummary } from "../lib/types";
import type { Navigate } from "../hooks/useHashRoute";
import { PixelButton } from "../components/PixelButton";
import { WorldCard } from "../components/WorldCard";

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; worlds: WorldSummary[] };

export function Worlds({ navigate }: { navigate: Navigate }) {
  const [data, setData] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((worlds) => {
        if (!cancelled) setData({ status: "ready", worlds });
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
      <div className="mx-auto max-w-5xl">
        <PixelButton color="black" onClick={() => navigate("/")}>◀ MAP</PixelButton>

        <h1 className="font-pixel text-[16px] text-nesBlack mt-6 mb-2">ALL PROJECTS</h1>
        <p className="font-body text-[16px] text-nesBlack/80 mb-6">Every project, in order. Some still under construction.</p>

        {data.status === "loading" && <p className="font-pixel text-[9px] text-nesBlack/60">LOADING…</p>}
        {data.status === "error" && <p className="font-pixel text-[9px] text-nesRed">Couldn't load projects.</p>}
        {data.status === "ready" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {data.worlds.map((w) => (
              <WorldCard
                key={w.slug}
                world={w}
                onSelect={() => {
                  sfx.play("coin");
                  navigate(`/projects/${w.slug}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
