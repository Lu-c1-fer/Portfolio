using Portfolio.Api.Models;

namespace Portfolio.Api.Data;

public static class SeedData
{
    public static void SeedIfEmpty(PortfolioDbContext db)
    {
        if (db.Sites.Any())
        {
            return;
        }

        var portfolioSite = new Site
        {
            Slug = "portfolio",
            Name = "Ayush Pokharel — Portfolio",
            Domain = null,
        };
        db.Sites.Add(portfolioSite);
        db.SaveChanges(); // assigns portfolioSite.Id

        db.Profiles.Add(new Profile
        {
            SiteId = portfolioSite.Id,
            Name = "AYUSH",
            FullName = "Ayush Pokharel",
            Tagline = "Full-stack developer. Sydney via Kathmandu.",
            Bio = "PERN background, recently picked up C# and ASP.NET Core. Starting at Young Logix on May 19, 2026.",
        });

        db.NowStatuses.Add(new NowStatus
        {
            SiteId = portfolioSite.Id,
            HpLabel = "BUILDING",
            HpValue = "Domain tracker MVP, properly this time",
            XpLabel = "LEARNING",
            XpValue = "ASP.NET Core internals and EF Core",
            CoinsLabel = "SHIPPED",
            CoinsValue = "4 projects",
            StarLabel = "READING",
            StarValue = "Designing Data-Intensive Applications",
            UpdatedDate = "2026-05-04",
        });

        var smartHabitTracker = new ProjectWorld
        {
            SiteId = portfolioSite.Id,
            Slug = "smart-habit-tracker",
            World = "1-1",
            Title = "Smart Habit Tracker",
            Summary = "A PERN habit tracker. Shipped after a deploy session that turned up four unrelated bugs at once: timezones, CORS, Postgres SSL, and Zod date parsing.",
            Stack = new() { "React", "Express", "Postgres", "JWT", "Zod", "Railway" },
            Year = "2025",
            Enemy = "TIMEZONE BUG",
            Difficulty = 2,
            Status = "Shipped",
        };

        var jobTracker = new ProjectWorld
        {
            SiteId = portfolioSite.Id,
            Slug = "job-tracker",
            World = "1-2",
            Title = "Job Tracker",
            Summary = "An ASP.NET Core + React app with Claude API integration, built while learning C# from a JavaScript background.",
            Stack = new() { "ASP.NET Core", ".NET 8", "React", "Claude API" },
            Year = "2026",
            Enemy = "IServiceCollection",
            Difficulty = 3,
            Status = "In Progress",
        };

        var ariseCleanBackend = new ProjectWorld
        {
            SiteId = portfolioSite.Id,
            Slug = "ariseclean-backend",
            World = "1-3",
            Title = "Ariseclean Backend",
            Summary = "A Web API built for a friend's cleaning business, delivered on a one-day deadline. Email notifications, request validation, SQLite.",
            Stack = new() { "ASP.NET Core", "MailKit", "SQLite" },
            Year = "2026",
            Enemy = "ONE-DAY DEADLINE",
            Difficulty = 2,
            Status = "Shipped",
        };

        var domainTracker = new ProjectWorld
        {
            SiteId = portfolioSite.Id,
            Slug = "domain-tracker",
            World = "1-4",
            Title = "Domain Tracker MVP",
            Summary = "Built live during a technical interview with Young Logix's MD. The project that got the job offer.",
            Stack = new() { "Next.js", "Convex", "Clerk", "TypeScript" },
            Year = "2026",
            Enemy = "LIVE INTERVIEW",
            Difficulty = 4,
            Status = "Shipped",
        };

        db.ProjectWorlds.AddRange(smartHabitTracker, jobTracker, ariseCleanBackend, domainTracker);

        db.SaveChanges(); // assigns ProjectWorld.Id values

        SeedSmartHabitTrackerCaseStudy(db, portfolioSite.Id, smartHabitTracker.Id);
        SeedJobTrackerCaseStudy(db, portfolioSite.Id, jobTracker.Id);
        SeedAriseCleanBackendCaseStudy(db, portfolioSite.Id, ariseCleanBackend.Id);
        SeedDomainTrackerCaseStudy(db, portfolioSite.Id, domainTracker.Id);
        SeedResume(db, portfolioSite.Id);
    }

    private static void SeedSmartHabitTrackerCaseStudy(PortfolioDbContext db, int siteId, int projectWorldId)
    {
        var caseStudy = new CaseStudy
        {
            SiteId = siteId,
            ProjectWorldId = projectWorldId,
            World = "1-1",
            Title = "Smart Habit Tracker",
            Year = "2025",
            Stack = new() { "React", "Express", "Postgres", "Node", "JWT", "Zod", "Helmet", "Railway", "Vercel" },
            Tldr = "Built a habit tracker over a few weekends. The interesting part wasn't the app — it was the four-hour deploy session where four unrelated bugs all surfaced at once. This is that fight.",
        };
        db.CaseStudies.Add(caseStudy);
        db.SaveChanges(); // assigns caseStudy.Id

        AddSection(db, siteId, caseStudy.Id, "problem", "PROBLEM", 0, new List<CaseStudyBlock>
        {
            Paragraph("I wanted a habit tracker that didn't gamify my life with confetti. Just: did I do the thing today, yes or no, and how long is my streak. Most apps in this space want a subscription to mark a checkbox."),
            Paragraph("So I built one — mostly to have an excuse to wire up auth + streaks + a real Postgres instance from scratch."),
        });

        AddSection(db, siteId, caseStudy.Id, "stack", "STACK POWER-UPS", 1, new List<CaseStudyBlock>
        {
            Paragraph("PERN, because I knew it and wanted to actually finish. Choices that mattered:"),
            BulletList(new List<string>
            {
                "JWT in httpOnly cookies, not localStorage. Refresh token rotation. Took longer than the rest of auth combined.",
                "Zod on every request body. Server doesn't trust the client, ever.",
                "Soft deletes on habits — users undo more than they admit.",
                "Rate limiting on /auth/*. Helmet for headers. Boring, important.",
                "Railway for API + Postgres, Vercel for the React app. CORS between them is where the pain started.",
            }),
        });

        AddSection(db, siteId, caseStudy.Id, "build", "BUILD", 2, new List<CaseStudyBlock>
        {
            Paragraph("Streak logic looks trivial until you write it. The naive version:"),
            Code("ts", "// First attempt. Looks fine. Is not fine.\nfunction calculateStreak(completions: Date[]): number {\n  let streak = 0;\n  const today = new Date();\n  for (let i = 0; i < completions.length; i++) {\n    const diff = daysBetween(today, completions[i]);\n    if (diff === i) streak++;\n    else break;\n  }\n  return streak;\n}"),
            Callout("warn", "!", "daysBetween used the user's browser timezone. The DB stored UTC. A user in Sydney logging at 11pm would see it land on tomorrow on the server. Streak resets at midnight UTC, not midnight local. Embarrassing time to find."),
            Paragraph("Fix: store the user's IANA timezone on signup and do all date math server-side relative to that:"),
            Code("ts", "import { fromZonedTime, toZonedTime } from \"date-fns-tz\";\n\nfunction todayInUserTz(tz: string): Date {\n  return toZonedTime(new Date(), tz);\n}\n\nfunction calculateStreak(completions: Date[], tz: string): number {\n  const today = todayInUserTz(tz);\n  // ...compare each completion in user's local day\n}"),
        });

        AddSection(db, siteId, caseStudy.Id, "bugs", "BUGS DEFEATED", 3, new List<CaseStudyBlock>
        {
            Paragraph("Pushed to prod on a Sunday. Four bugs in a row. None of them showed in dev."),
            Callout("warn", "BUG 1", "CORS — Vercel preview URLs are dynamic (commit-hash.vercel.app). Hardcoding the prod origin killed every preview. Fixed with a regex allowlist."),
            Callout("warn", "BUG 2", "Postgres SSL — Railway's managed Postgres requires SSL. node-postgres won't enable it unless you pass { ssl: { rejectUnauthorized: false } }. Default error sent me down a one-hour rabbit hole."),
            Callout("warn", "BUG 3", "Zod + dates — z.date() doesn't parse ISO strings from JSON. You need z.coerce.date(). Form submits silently 400'd until I logged the actual issue array."),
            Callout("warn", "BUG 4", "Timezone, again — the cron job that recomputed streaks ran at UTC midnight. Sydney users lost streaks because their day hadn't ended. Moved recompute to be lazy, cached for 60s."),
        });

        AddSection(db, siteId, caseStudy.Id, "learnings", "LEARNINGS", 4, new List<CaseStudyBlock>
        {
            BulletList(new List<string>
            {
                "Store timezone on the user. Always. Browser's now is not server's now.",
                "Zod errors are useless until you log issue.path. Log them.",
                "CORS misconfig fails 100 different ways. Fix is the same: print origin, print allowlist, eyeball.",
                "Soft deletes pay for themselves the first time a user emails in a panic.",
                "Deploy on a weekday. Not for the bugs — Postgres support is awake.",
            }),
            Callout("tip", "?", "If you're building anything dated, write the timezone tests first. Save yourself the deploy day."),
        });
    }

    private static void SeedJobTrackerCaseStudy(PortfolioDbContext db, int siteId, int projectWorldId)
    {
        var caseStudy = new CaseStudy
        {
            SiteId = siteId,
            ProjectWorldId = projectWorldId,
            World = "1-2",
            Title = "Job Tracker",
            Year = "2026",
            Stack = new() { "ASP.NET Core", ".NET 8", "React", "EF Core", "Claude API" },
            Tldr = "A job-application tracker that reads a pasted job posting and pulls out the company, role, and requirements — using Claude. Built while learning C# and ASP.NET Core from a JavaScript background; this is the project where the backend's plumbing finally started clicking into place. Still in progress.",
        };
        db.CaseStudies.Add(caseStudy);
        db.SaveChanges(); // assigns caseStudy.Id

        AddSection(db, siteId, caseStudy.Id, "problem", "PROBLEM", 0, new List<CaseStudyBlock>
        {
            Paragraph("Tracking applications in a spreadsheet works until it doesn't — a wall of copy-pasted job ad text in one column, half-remembered status updates in another. I wanted one place to log a posting, its status, and notes, without retyping the whole ad by hand every time."),
            Paragraph("It was also the excuse I'd been looking for to actually learn C# and ASP.NET Core past tutorial depth, instead of reading about it."),
        });

        AddSection(db, siteId, caseStudy.Id, "stack", "STACK POWER-UPS", 1, new List<CaseStudyBlock>
        {
            Paragraph("ASP.NET Core API, React frontend, Claude doing the one genuinely hard part."),
            BulletList(new List<string>
            {
                "ASP.NET Core on purpose, not out of familiarity — needed the reps, and it's what the job wanted.",
                "Claude API for posting parsing: paste the ad, get back company / role / location / seniority / must-haves as structured fields.",
                "EF Core against SQL Server LocalDB in dev — Postgres is the plan before this ships for real.",
                "React frontend kept deliberately thin. All the interesting logic lives in the API, on purpose, since that's the part I'm here to learn.",
            }),
        });

        AddSection(db, siteId, caseStudy.Id, "build", "KEY DECISIONS", 2, new List<CaseStudyBlock>
        {
            Paragraph("The parsing endpoint is the whole point of the app. Everything else is CRUD around it."),
            Code("csharp", "public record ParsedPosting(string Company, string Role, string? Location, string Seniority, List<string> MustHaves);\n\npublic async Task<ParsedPosting> ParseAsync(string rawText)\n{\n    var response = await _claude.Messages.CreateAsync(new()\n    {\n        Model = \"claude-sonnet-5\",\n        MaxTokens = 512,\n        System = \"Extract job posting fields. Return JSON only, matching the schema exactly. No prose, no code fences.\",\n        Messages = [ new() { Role = \"user\", Content = rawText } ],\n    });\n\n    return JsonSerializer.Deserialize<ParsedPosting>(response.Text)\n        ?? throw new PostingParseException(\"Claude returned something that wasn't the schema.\");\n}"),
            Callout("warn", "!", "First version trusted the response text directly. Claude would occasionally wrap the JSON in a code fence, or add one polite caveat sentence before it — both broke Deserialize. Fixed by stripping fences before parsing and tightening the system prompt until 'no prose' actually meant no prose."),
        });

        AddSection(db, siteId, caseStudy.Id, "bugs", "BOSS FIGHT: IServiceCollection", 3, new List<CaseStudyBlock>
        {
            Paragraph("Coming from Node, 'dependency injection' meant require() at the top of a file and moving on. ASP.NET Core's container felt like a black box I didn't trust yet — the first real fight was registering the Claude client."),
            Code("csharp", "// First attempt — app crashed on the SECOND request, not the first.\nbuilder.Services.AddSingleton<IPostingParser, ClaudePostingParser>();\n\n// ClaudePostingParser's constructor took an AppDbContext.\n// DbContext is scoped. A singleton holding a scoped dependency\n// is a captive dependency: it grabs one DbContext at startup and\n// never lets go. Worked once, then threw ObjectDisposedException\n// on every request after."),
            Paragraph("Fix was one word — Scoped instead of Singleton — but understanding why took an evening of reading about service lifetimes."),
            Callout("tip", "?", "Rule that finally stuck: match a service's lifetime to its shortest-lived dependency. Anything touching the DbContext is Scoped. Singleton is for state with no request attached to it."),
        });

        AddSection(db, siteId, caseStudy.Id, "learnings", "LEARNINGS", 4, new List<CaseStudyBlock>
        {
            BulletList(new List<string>
            {
                "DI container errors are honest but unhelpful — 'unable to resolve X' means walk the constructor chain by hand.",
                "LLM output is a string until proven otherwise. Parse defensively, every time, even when the prompt says 'JSON only.'",
                "Lifetime bugs in DI don't show up on the first request. If something crashes on the second call, suspect the container before the code.",
            }),
            Callout("tip", "?", "Still open: a real Postgres deploy, a status pipeline (applied → interviewing → offer/rejected), and resume export. This one's not done yet — check back."),
        });
    }

    private static void SeedAriseCleanBackendCaseStudy(PortfolioDbContext db, int siteId, int projectWorldId)
    {
        var caseStudy = new CaseStudy
        {
            SiteId = siteId,
            ProjectWorldId = projectWorldId,
            World = "1-3",
            Title = "Ariseclean Backend",
            Year = "2026",
            Stack = new() { "ASP.NET Core", "MailKit", "SQLite", "EF Core" },
            Tldr = "A booking-request API for a friend's cleaning business, built and deployed in a single day after her contact form quietly stopped sending emails. Small stack, strict validation, and just enough infrastructure that nobody has to look after it.",
        };
        db.CaseStudies.Add(caseStudy);
        db.SaveChanges(); // assigns caseStudy.Id

        AddSection(db, siteId, caseStudy.Id, "problem", "PROBLEM", 0, new List<CaseStudyBlock>
        {
            Paragraph("A friend runs a small cleaning business. Her site's contact form had quietly stopped sending emails — she found out when a customer complained about never getting a reply, not from any error anywhere. She texted that afternoon asking if I could look at it."),
            Paragraph("Scope, deliberately kept tiny: one endpoint that takes a booking request, validates it, stores it, and emails both her and the customer a confirmation. Working by end of day, not a redesign."),
        });

        AddSection(db, siteId, caseStudy.Id, "stack", "STACK POWER-UPS", 1, new List<CaseStudyBlock>
        {
            Paragraph("Every choice here optimized for 'works today and needs no babysitting,' not 'scales later.'"),
            BulletList(new List<string>
            {
                "ASP.NET Core minimal APIs — no controller ceremony for what's functionally one endpoint.",
                "SQLite over Postgres: single tenant, low volume, no database server to provision or pay for on a Tuesday.",
                "MailKit over a transactional email service — sends through her existing provider's SMTP, no new third-party account to set up under time pressure.",
                "Manual validation on every field. This form is public on the internet; it has to survive being spammed, not just used correctly.",
            }),
        });

        AddSection(db, siteId, caseStudy.Id, "build", "KEY DECISIONS", 2, new List<CaseStudyBlock>
        {
            Paragraph("With the business logic this simple, validation and email are basically the whole app."),
            Code("csharp", "app.MapPost(\"/api/bookings\", async (BookingRequest req, IEmailSender email, AppDbContext db) =>\n{\n    var errors = BookingValidator.Validate(req);\n    if (errors.Count > 0) return Results.ValidationProblem(errors);\n\n    var booking = req.ToEntity();\n    db.Bookings.Add(booking);\n    await db.SaveChangesAsync();\n\n    await email.SendAsync(\"hello@ariseclean.com.au\", $\"New booking — {booking.Suburb}\", booking.ToEmailBody());\n    await email.SendAsync(booking.Email, \"We got your request\", ConfirmationTemplate.Render(booking));\n\n    return Results.Ok(new { booking.Id });\n});"),
            Callout("warn", "!", "First version sent both emails synchronously, inside the request. MailKit's SMTP handshake to her provider took 3-4 seconds each — a booking request was taking 8+ seconds round trip and timing out on flaky mobile connections. Fixed by queuing the sends on a background channel and returning as soon as the booking itself was saved."),
        });

        AddSection(db, siteId, caseStudy.Id, "bugs", "BOSS FIGHT: ONE-DAY DEADLINE", 3, new List<CaseStudyBlock>
        {
            Paragraph("The real fight wasn't technical, it was scope. No admin dashboard, no reschedule flow, no retry logic — just a table she could query directly if she ever needed to. Every cut got said out loud to her, not assumed."),
            Callout("tip", "?", "Best deadline trick: ship the smallest version of the actual problem (form's broken, no bookings coming in), not the smallest version of the imagined product. Everything cut was something nobody had asked for yet."),
        });

        AddSection(db, siteId, caseStudy.Id, "learnings", "LEARNINGS", 4, new List<CaseStudyBlock>
        {
            BulletList(new List<string>
            {
                "SQLite is a completely reasonable choice for a single-tenant app small enough to hold in your head.",
                "Never send email synchronously in the request path — SMTP latency isn't yours to control.",
                "A favor for a friend is still a deadline. Scope it like a client project, not a favor.",
                "Ten minutes writing down what got cut was worth more than the code — it's the difference between 'quick fix' and 'quietly permanent architecture.'",
            }),
        });
    }

    private static void SeedDomainTrackerCaseStudy(PortfolioDbContext db, int siteId, int projectWorldId)
    {
        var caseStudy = new CaseStudy
        {
            SiteId = siteId,
            ProjectWorldId = projectWorldId,
            World = "1-4",
            Title = "Domain Tracker MVP",
            Year = "2026",
            Stack = new() { "Next.js", "Convex", "Clerk", "TypeScript" },
            Tldr = "A tool for tracking domain names — renewal dates, which ones are about to expire — built from an empty repo, live, during the final technical interview for the job I now have. This is the one where the pressure was the point.",
        };
        db.CaseStudies.Add(caseStudy);
        db.SaveChanges(); // assigns caseStudy.Id

        AddSection(db, siteId, caseStudy.Id, "problem", "PROBLEM", 0, new List<CaseStudyBlock>
        {
            Paragraph("Young Logix's final interview wasn't a whiteboard exercise — it was 'build something real, screen-shared, for the next 90 minutes.' The brief: a small internal tool to track domain names, since renewal dates were living in a shared spreadsheet that nobody trusted anymore."),
            Paragraph("The constraint wasn't the feature set, it was the clock — every decision had to work by the end of the session and be defensible out loud while making it."),
        });

        AddSection(db, siteId, caseStudy.Id, "stack", "STACK POWER-UPS", 1, new List<CaseStudyBlock>
        {
            Paragraph("Every framework choice in that room was really a 'how much of this do I have to build versus get for free' choice."),
            BulletList(new List<string>
            {
                "Next.js — one repo, App Router, no separate API project to stand up mid-interview.",
                "Convex for the backend — schema, functions, and a live-updating database with nothing to deploy. The only realistic path to working persistence in minutes, not hours.",
                "Clerk for auth — sign-in became a five-minute integration instead of a feature, which mattered because nobody was going to watch me build a password-reset flow live.",
                "TypeScript end to end, including the Convex schema — fewer places to slip on a domain object's shape while narrating out loud.",
            }),
        });

        AddSection(db, siteId, caseStudy.Id, "build", "KEY DECISIONS", 2, new List<CaseStudyBlock>
        {
            Paragraph("First fifteen minutes: what is a 'domain' here, and what's the smallest schema that answers 'what's expiring soon?'"),
            Code("ts", "// convex/schema.ts\nexport default defineSchema({\n  domains: defineTable({\n    name: v.string(),\n    registrar: v.string(),\n    expiresAt: v.number(), // unix ms — sidesteps a timezone conversation, mid-interview\n    ownerId: v.string(),\n  }).index(\"by_owner\", [\"ownerId\"]),\n});"),
            Paragraph("Deliberately left \"status\" out of the schema. Storing active/expiring/expired invites it going stale the moment nobody looks at the app for a while — so it's computed on read instead:"),
            Code("ts", "// convex/domains.ts\nexport const list = query({\n  args: {},\n  handler: async (ctx) => {\n    const userId = await getAuthUserId(ctx);\n    const domains = await ctx.db\n      .query(\"domains\")\n      .withIndex(\"by_owner\", (q) => q.eq(\"ownerId\", userId))\n      .collect();\n\n    const now = Date.now();\n    return domains.map((d) => ({\n      ...d,\n      status: d.expiresAt < now ? \"expired\" : d.expiresAt < now + 30 * 86_400_000 ? \"expiring\" : \"active\",\n    }));\n  },\n});"),
            Callout("tip", "?", "This was the one decision the MD asked a follow-up about: 'what happens if nobody opens the app for a month?' Nothing — there's no cron job to forget to run, because nothing was ever stored to go stale."),
        });

        AddSection(db, siteId, caseStudy.Id, "bugs", "BOSS FIGHT: LIVE INTERVIEW", 3, new List<CaseStudyBlock>
        {
            Paragraph("About an hour in, the domain list rendered empty for a fresh test account. Not a great silent moment with someone watching."),
            Callout("warn", "!", "The index query compared Clerk's internal user id against the wrong id field on the row — an off-by-one-name-mismatch, not a logic bug. Easy fix once spotted, but spotting it live meant narrating the debugging instead of going quiet and hoping."),
            Paragraph("Talked through the fix out loud — checked the query args first, then the index, then the field names — instead of staring at the screen in silence. That narration turned out to matter more than the fix itself."),
        });

        AddSection(db, siteId, caseStudy.Id, "learnings", "LEARNINGS", 4, new List<CaseStudyBlock>
        {
            BulletList(new List<string>
            {
                "Deriving a value beats storing it and hoping something remembers to keep it updated.",
                "Debugging out loud is a feature in an interview, not an admission of failure.",
                "Pick tools that remove entire categories of decisions — Convex removed 'how do I deploy a database,' Clerk removed 'how do I build auth' — when the clock is the actual constraint.",
                "The live version became the real first commit. Nothing from that session got thrown away.",
            }),
            Callout("tip", "?", "If you get a 'build it live' interview: optimize for narratable decisions, not clever ones. Explaining why is the actual interview."),
        });
    }

    private static void AddSection(PortfolioDbContext db, int siteId, int caseStudyId, string sectionId, string title, int order, List<CaseStudyBlock> blocks)
    {
        var section = new CaseStudySection
        {
            SiteId = siteId,
            CaseStudyId = caseStudyId,
            SectionId = sectionId,
            Title = title,
            Order = order,
        };
        db.CaseStudySections.Add(section);
        db.SaveChanges(); // assigns section.Id

        for (var i = 0; i < blocks.Count; i++)
        {
            var block = blocks[i];
            block.SiteId = siteId;
            block.CaseStudySectionId = section.Id;
            block.Order = i;
            db.CaseStudyBlocks.Add(block);
        }
        db.SaveChanges();
    }

    private static CaseStudyBlock Paragraph(string text) => new() { Type = "p", Text = text };
    private static CaseStudyBlock BulletList(List<string> items) => new() { Type = "ul", Items = items };
    private static CaseStudyBlock Code(string lang, string text) => new() { Type = "code", Lang = lang, Text = text };
    private static CaseStudyBlock Callout(string variant, string title, string text) => new() { Type = "block", Variant = variant, Title = title, Text = text };

    // Drafted from the profile bio and the four project case studies — the only real
    // facts available at seed time. No Education entry is seeded: no real institution
    // name is known, and guessing one would be fabricating biographical fact rather
    // than drafting flavor text, so that section is left for the user to fill in later.
    private static void SeedResume(PortfolioDbContext db, int siteId)
    {
        var resume = new Resume
        {
            SiteId = siteId,
            Summary = "Full-stack developer based in Sydney, by way of Kathmandu. PERN background, expanding into C# and ASP.NET Core. Interested in building small, real things and writing down what broke along the way.",
            ResumePdfUrl = null,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Resumes.Add(resume);
        db.SaveChanges();

        db.WorkHistoryEntries.AddRange(
            new WorkHistoryEntry
            {
                SiteId = siteId,
                ResumeId = resume.Id,
                Company = "Young Logix",
                Role = "Software Engineer (Intern)",
                Location = "Sydney, NSW",
                StartDate = "2026-05",
                EndDate = null,
                Description = "Joined after building a domain-tracker MVP live during the technical interview with the MD.",
                Bullets = new() { "Working across a Next.js, Convex, and Clerk stack.", "Offer followed a live coding interview — the MVP built that day became a real feature." },
                Order = 0,
            },
            new WorkHistoryEntry
            {
                SiteId = siteId,
                ResumeId = resume.Id,
                Company = "Independent Projects",
                Role = "Freelance / Self-directed",
                Location = "Sydney, NSW (remote)",
                StartDate = "2025",
                EndDate = "2026-05",
                Description = "Designed, built, and shipped several full-stack projects independently across PERN and ASP.NET Core stacks.",
                Bullets = new()
                {
                    "Smart Habit Tracker — PERN habit tracker with JWT auth and streak tracking.",
                    "Job Tracker — ASP.NET Core + React app integrating the Claude API.",
                    "Ariseclean Backend — ASP.NET Core Web API delivered for a client on a one-day turnaround.",
                },
                Order = 1,
            }
        );

        db.SkillEntries.AddRange(
            Skill(siteId, resume.Id, "Languages", "TypeScript", 0),
            Skill(siteId, resume.Id, "Languages", "C#", 1),
            Skill(siteId, resume.Id, "Languages", "JavaScript", 2),
            Skill(siteId, resume.Id, "Languages", "SQL", 3),
            Skill(siteId, resume.Id, "Frameworks & Libraries", "React", 0),
            Skill(siteId, resume.Id, "Frameworks & Libraries", "Next.js", 1),
            Skill(siteId, resume.Id, "Frameworks & Libraries", "ASP.NET Core", 2),
            Skill(siteId, resume.Id, "Frameworks & Libraries", "Express", 3),
            Skill(siteId, resume.Id, "Databases", "PostgreSQL", 0),
            Skill(siteId, resume.Id, "Databases", "SQLite", 1),
            Skill(siteId, resume.Id, "Databases", "EF Core", 2),
            Skill(siteId, resume.Id, "Tools & Platforms", "Docker", 0),
            Skill(siteId, resume.Id, "Tools & Platforms", "Git", 1),
            Skill(siteId, resume.Id, "Tools & Platforms", "Railway", 2),
            Skill(siteId, resume.Id, "Tools & Platforms", "Vercel", 3),
            Skill(siteId, resume.Id, "Tools & Platforms", "Convex", 4),
            Skill(siteId, resume.Id, "Tools & Platforms", "Clerk", 5)
        );

        db.SaveChanges();
    }

    private static SkillEntry Skill(int siteId, int resumeId, string category, string name, int order) =>
        new() { SiteId = siteId, ResumeId = resumeId, Category = category, Name = name, Order = order };
}
