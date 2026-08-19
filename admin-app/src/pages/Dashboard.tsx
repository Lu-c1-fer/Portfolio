import type { Navigate } from "../hooks/useHashRoute";

const TILES = [
  { href: "/projects", label: "Projects", desc: "Create, edit, and manage project worlds + case studies." },
  { href: "/profile", label: "Profile", desc: "Name, tagline, bio." },
  { href: "/now", label: "Now status", desc: "The HP/XP/coins/star status panel on the home page." },
  { href: "/resume", label: "Resume", desc: "Summary, work history, education, skills." },
];

export function Dashboard({ navigate }: { navigate: Navigate }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TILES.map((t) => (
          <button
            key={t.href}
            onClick={() => navigate(t.href)}
            className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-sm transition"
          >
            <div className="font-medium text-gray-900">{t.label}</div>
            <div className="text-sm text-gray-500 mt-1">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
