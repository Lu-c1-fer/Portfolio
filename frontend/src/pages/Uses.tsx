import type { Navigate } from "../hooks/useHashRoute";
import { PixelPanel } from "../components/PixelPanel";
import { PixelButton } from "../components/PixelButton";

type UsesColor = "red" | "green" | "blue" | "gold";

const COLOR_HEX: Record<UsesColor, string> = {
  red: "#E52521",
  green: "#43B047",
  blue: "#5C94FC",
  gold: "#A0522D",
};

const SECTIONS: { label: string; color: UsesColor; items: { name: string; note: string }[] }[] = [
  {
    label: "HARDWARE",
    color: "red",
    items: [
      { name: "MacBook Air M2", note: "16GB. Fine for everything except JetBrains products." },
      { name: "Dell U2723QE", note: '27" 4K. Worth the eye savings.' },
      { name: "Keychron K3 Pro", note: "Low-profile browns. Library-friendly." },
    ],
  },
  {
    label: "EDITOR",
    color: "green",
    items: [
      { name: "VS Code", note: "Default. I tried Zed. I'll try it again." },
      { name: "Vim keys", note: "Just enough to be dangerous." },
      { name: "JetBrains Mono", note: "Ligatures off." },
    ],
  },
  {
    label: "WEB",
    color: "blue",
    items: [
      { name: "Next.js / Vite", note: "Both, depending on the repo." },
      { name: "Tailwind", note: "Yes, I know. I'm shipping anyway." },
      { name: "TanStack Query", note: "Stop writing useEffect for fetching." },
    ],
  },
  {
    label: "BACKEND",
    color: "gold",
    items: [
      { name: "ASP.NET Core", note: "Recent convert. The tooling is unfair." },
      { name: "Postgres", note: "Always. SQLite for prototypes." },
      { name: "EF Core", note: "Migrations that actually work." },
    ],
  },
];

export function Uses({ navigate }: { navigate: Navigate }) {
  return (
    <div className="bg-nesSky min-h-[80vh] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <PixelButton color="black" onClick={() => navigate("/")}>◀ MAP</PixelButton>

        <PixelPanel color="white" className="p-5 sm:p-6 mt-6">
          <h1 className="font-pixel text-[16px] text-nesBlack">GEAR · /uses</h1>
          <p className="font-body text-[16px] text-nesBlack/80 mt-3">
            The tools and tiny pieces of hardware I reach for daily. Updated whenever something changes.
          </p>
          <div className="mt-6 space-y-7">
            {SECTIONS.map((s) => (
              <div key={s.label}>
                <div className="font-pixel text-[10px] mb-3" style={{ color: COLOR_HEX[s.color] }}>
                  — {s.label} —
                </div>
                <ul className="space-y-2">
                  {s.items.map((it) => (
                    <li key={it.name} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 border-l-4 border-nesBlack pl-3 py-1">
                      <span className="font-pixel text-[10px] text-nesBlack">{it.name}</span>
                      <span className="font-body text-[16px] text-nesBlack/75">{it.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PixelPanel>
      </div>
    </div>
  );
}
