# ayush-portfolio

An 8-bit/NES-themed portfolio site, plus the API and admin CRM that drive it.
Three apps in this repo:

- **`frontend/`** — the public site (React 19 + Vite + TypeScript + Tailwind).
  Home, project case studies, About, Uses, Resume, a contact form, and a
  Day/Night palette toggle.
- **`backend/Portfolio.Api`** — the API (ASP.NET Core / .NET 10 + EF Core +
  PostgreSQL). Full CRUD, multi-site-scoped, API-key auth on writes.
- **`admin-app/`** — a small CRM (same stack as `frontend/`) for editing site
  content — projects, case studies, profile, now-status, and resume — without
  redeploying.

## Stack

- **Frontend / admin:** React 19, Vite, TypeScript, Tailwind CSS. No
  react-router — both apps use a small hand-rolled hash router
  (`useHashRoute`) instead. Plain `fetch`, no data-fetching library.
- **Backend:** ASP.NET Core on .NET 10, EF Core, PostgreSQL.
- **Auth:** a single API key, sent as `Authorization: Bearer <key>` on
  write requests. Read (`GET`) endpoints are public.

## Running locally

Start Postgres first:

```bash
docker compose up -d
```

Then each app (`.claude/launch.json` has matching launch configs):

| App | Command | Port |
|---|---|---|
| Backend | `dotnet run --project backend/Portfolio.Api --launch-profile http` | 5255 |
| Frontend | `npm --prefix frontend run dev` | 5173 |
| Admin CRM | `npm --prefix admin-app run dev` | 5174 |

The backend seeds itself on first run and applies EF Core migrations
automatically. `frontend/.env` and `admin-app/.env` both point
`VITE_API_BASE_URL` at `http://localhost:5255` by default.

## Deployment

- **Frontend:** Vercel.
- **Backend:** Render, via `backend/Portfolio.Api/Dockerfile` (multi-stage
  .NET build). Render assigns a dynamic port through the `PORT` env var,
  which `Program.cs` reads and binds to on all interfaces. The Dockerfile
  also sets `DOTNET_hostBuilder__reloadConfigOnChange=false` — without it,
  ASP.NET Core's config file-watcher exhausts Render's inotify instance
  limit on startup.
- CORS origins are configured via `Cors:AllowedOrigins` in
  `backend/Portfolio.Api/appsettings.json` (or the equivalent
  `Cors__AllowedOrigins__N` environment variables on Render) — add new
  frontend/admin deployment URLs there as they come up.
- **Admin CRM:** not yet deployed; intended to become its own Vercel project.

## Multi-site architecture

Every backend route is scoped under `/api/sites/{siteSlug}/...` and resolves
to a `SiteId` via `SiteScopedControllerBase`, so the same API can serve more
than one site's content (e.g. a future second site) from one database,
partitioned by site.

The admin CRM's site switcher is real, working UI — but its list of sites is
currently a hardcoded placeholder (`admin-app/src/lib/site.ts`), since there's
no `GET`/`POST /api/sites` endpoint yet to discover or create sites
dynamically. That's a known gap to close before adding a second site.
