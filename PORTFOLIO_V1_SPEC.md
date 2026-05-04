# Portfolio v1 — Spec & Scope

> Living document. Read before every coding session. Update when scope genuinely changes (rare).
> The point of this doc is to say **no** to your future self at 11pm when you want to add a feature.

---

## The deal I'm making with myself

Ship a working public portfolio + admin CRUD by **Friday May 15, 2026**.
That gives me the weekend before the internship to rest, review Next.js App Router and Convex docs, and not be exhausted on Day 1 (May 19).

If I'm not on track by Friday May 8, I cut admin polish — never public site polish.

---

## What "done" means

A recruiter can:
- Open the public site on phone or desktop
- See 4 case studies that read well
- Submit the contact form
- Get a sense of who I am

I can:
- Log in to `/admin`
- Add, edit, delete a case study without redeploying
- Upload a hero image for a case study

That's it. That's v1.

---

## In scope (v1)

### Public site
- Homepage: hero, STATUS panel, "Select a World" grid with 4 cards
- World detail page (`/projects/:slug`): docs-style case study layout
- About page (prose bio)
- Uses page (stack/setup)
- Contact form (sends email via MailKit)
- Sound toggle (default: OFF)
- Palette toggle (Overworld / Underground)
- 404 page ("WORLD ?-? GAME OVER")

### Admin (gated)
- Login page (`/admin/login`)
- Project list (`/admin/projects`)
- New project form (`/admin/projects/new`)
- Edit project form (`/admin/projects/:slug/edit`)
- Delete project (with confirm dialog — no soft delete needed for v1)
- Single image upload per project (hero image)

### Backend (ASP.NET Core)
- SQLite + EF Core
- `Projects` table
- `Bugs` table (for "Bugs Defeated" section, FK to Projects)
- `Users` table (just me, seeded)
- JWT auth in httpOnly cookie
- Public read endpoints (no auth)
- Admin write endpoints ([Authorize])
- Contact endpoint (rate-limited, no auth)
- Image upload endpoint ([Authorize])

### The 4 case studies
1. **World 1-1: Smart Habit Tracker** — PERN, deploy session bug saga
2. **World 1-2: Job Tracker** — ASP.NET Core + React + Claude API
3. **World 1-3: Ariseclean Backend** — ASP.NET Core, MailKit, one-day deadline
4. **World 1-4: Domain Tracker MVP** — built live in Young Logix interview

---

## Out of scope (v1) — say NO

I will not build, no matter how tempting:

- Blog / writing section (maybe v2 after the internship)
- Comments
- Analytics dashboard or visitor counter
- Multi-user auth, roles, permissions
- Image gallery / multiple images per project
- Rich text / WYSIWYG editor — markdown textarea is fine
- Draft/published workflow
- Categories, tags, related posts
- Auto-deploy pipelines beyond Vercel + Railway defaults
- Tests beyond a smoke test or two
- Internationalization (English only)
- Real-time anything (no SSE, no WebSockets)
- Resume PDF generator
- A second portfolio site at a different aesthetic
- Anything 3D
- Animations beyond what already exists in the prototype
- A custom font loader strategy — system fonts + Press Start 2P + VT323 from Google Fonts is fine
- "Live commit" feed pulling from GitHub API
- Spotify "now playing" widget
- Any new feature that occurs to me while building

If I think of something that should be added, it goes in the **v2 backlog** at the bottom of this file. Not in the code.

---

## Stack — locked

- **Frontend:** React + Vite + TypeScript + React Router + Tailwind (plain `fetch` for API calls — TanStack Query deferred to v2)
- **Backend:** ASP.NET Core 8 Web API, EF Core, SQLite
- **Auth:** JWT in httpOnly cookie, BCrypt password hashing
- **Email:** MailKit (already wrote this for Ariseclean — copy)
- **Markdown:** `react-markdown` + `rehype-highlight`
- **Hosting:** Vercel (frontend), Railway (backend + SQLite volume)

I will not change the stack mid-build. If something feels wrong, I work around it.

---

## Schedule — honest version

| Dates | Goal |
|---|---|
| **This weekend** | TS + Tailwind warmup (Matt Pocock TS tutorial Sat AM, Tailwind core concepts Sat PM, build one throwaway page in both Sun) |
| **Mon May 4 – Wed May 6** | Step 1: repo setup, both ends running, "Hello World" through the API |
| **Thu May 7 – Sat May 9** | Step 2 + Step 3: backend read endpoints + frontend reading them, World 1-1 live |
| **Sun May 10** | DEPLOY. Public site live with one case study. |
| **Mon May 11** | Step 4: seed remaining 3 case studies |
| **Tue May 12 – Thu May 14** | Step 5: admin CRUD with auth |
| **Fri May 15** | Step 6: contact form, /uses, polish, mobile QA |
| **Sat May 16 – Sun May 17** | Buffer / rest. Do NOT add features. |
| **Mon May 18** | Review Next.js App Router + Convex docs for tomorrow. |
| **Tue May 19** | Internship starts. |

Buffer is a feature. If I burn the buffer on more features, I show up to Day 1 fried. Not worth it.

---

## Daily check-in (be honest)

At the end of each session, answer in 30 seconds:
- What did I ship today? (Not "worked on" — what *runs*?)
- Am I on the schedule?
- Am I drifting into out-of-scope territory? (Be ruthless.)

---

## v2 backlog — where ideas go to wait

(Add to this list any time a "wouldn't it be cool if" thought hits. Then close the tab.)

- TanStack Query (skipped in v1 — plain fetch is enough for 5 endpoints. Will learn at Young Logix.)
- 

---

## Deployment URLs (fill in when live)

- Public site: https://_______
- API: https://_______
- Repo: https://github.com/_______
