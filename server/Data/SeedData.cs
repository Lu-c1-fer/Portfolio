using server.Models;
using System.Text.Json;

namespace server.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Projects.Any())
            return;  // already seeded

        var smartHabitTracker = new Project
        {
            Slug = "smart-habit-tracker",
            World = "1-1",
            Title = "Smart Habit Tracker",
            Year = 2025,
            Status = "cleared",
            Tldr = "Built a habit tracker over a few weekends. The interesting part wasn't the app — it was the four-hour deploy session where four unrelated bugs all surfaced at once. This is that fight.",
            StackJson = JsonSerializer.Serialize(new[] { "React", "Express", "Postgres", "JWT" }),
            BodyMarkdown = """
            ## Problem

            I wanted a habit tracker that didn't gamify my life with confetti. Just: did I do the thing today, yes or no, and how long is my streak. Most apps in this space want a subscription to mark a checkbox.

            So I built one — mostly to have an excuse to wire up auth + streaks + a real Postgres instance from scratch.

            ## Stack power-ups

            PERN, because I knew it and wanted to actually finish. Choices that mattered:

            - JWT in httpOnly cookies, not localStorage. Refresh token rotation. Took longer than the rest of auth combined.
            - Zod on every request body. Server doesn't trust the client, ever.
            - Soft deletes on habits — users undo more than they admit.
            - Rate limiting on /auth/*. Helmet for headers. Boring, important.

            ## Bugs defeated

            *(Coming soon — this is where the four deploy bugs go.)*

            ## Learnings

            *(Coming soon.)*
            """,
            GithubUrl = "https://github.com/ayush/smart-habit-tracker",
            LiveUrl = null,
        };

        context.Projects.Add(smartHabitTracker);
        await context.SaveChangesAsync();
    }
}