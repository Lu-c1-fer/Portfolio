import type { ReactNode } from "react";
import type { Navigate } from "../hooks/useHashRoute";
import { useAuth } from "../hooks/useAuth";
import { useSite } from "../hooks/useSite";
import { KNOWN_SITE_SLUGS } from "../lib/site";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Resume" },
];

export function Layout({ route, navigate, children }: { route: string; navigate: Navigate; children: ReactNode }) {
  const { logout } = useAuth();
  const { siteSlug, setSiteSlug } = useSite();

  const isActive = (href: string) => (href === "/" ? route === "/" : route.startsWith(href));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-900">Portfolio Admin</span>
            <nav className="hidden sm:flex items-center gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={`#${l.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(l.href);
                  }}
                  className={`text-sm ${isActive(l.href) ? "text-blue-700 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Site switcher: real dropdown, but the option list is a hardcoded
                stub — see lib/site.ts for why. */}
            <select
              value={siteSlug}
              onChange={(e) => setSiteSlug(e.target.value as typeof siteSlug)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {KNOWN_SITE_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {slug}
                </option>
              ))}
            </select>
            <button type="button" onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
              Log out
            </button>
          </div>
        </div>
        <nav className="sm:hidden flex items-center gap-4 px-4 pb-3 overflow-x-auto">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={`#${l.href}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(l.href);
              }}
              className={`text-sm whitespace-nowrap ${isActive(l.href) ? "text-blue-700 font-medium" : "text-gray-600"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
