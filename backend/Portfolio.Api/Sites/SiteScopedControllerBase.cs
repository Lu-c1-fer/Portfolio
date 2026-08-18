using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;

namespace Portfolio.Api.Sites;

/// <summary>
/// Resolves the {siteSlug} route segment to a Site once per request (404s if unknown)
/// and exposes the resolved SiteId to derived controllers, so every action scopes its
/// queries without repeating the lookup.
/// </summary>
public abstract class SiteScopedControllerBase : ControllerBase, IAsyncActionFilter
{
    protected readonly PortfolioDbContext Db;
    protected int SiteId { get; private set; }

    protected SiteScopedControllerBase(PortfolioDbContext db)
    {
        Db = db;
    }

    [NonAction]
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (context.RouteData.Values.TryGetValue("siteSlug", out var slugValue) && slugValue is string siteSlug)
        {
            var siteId = await Db.Sites.AsNoTracking()
                .Where(s => s.Slug == siteSlug)
                .Select(s => (int?)s.Id)
                .FirstOrDefaultAsync();

            if (siteId is null)
            {
                context.Result = new NotFoundObjectResult(new { error = $"Unknown site '{siteSlug}'." });
                return;
            }

            SiteId = siteId.Value;
            await next();
        }
        else
        {
            context.Result = new BadRequestObjectResult(new { error = "Missing siteSlug route value." });
        }
    }
}
