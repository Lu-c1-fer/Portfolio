using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Dtos;
using Portfolio.Api.Models;
using Portfolio.Api.Sites;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/sites/{siteSlug}/profile")]
public class ProfileController : SiteScopedControllerBase
{
    public ProfileController(PortfolioDbContext db) : base(db) { }

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        var profile = await Db.Profiles.AsNoTracking().FirstOrDefaultAsync(p => p.SiteId == SiteId);
        if (profile is null) return NotFound();

        return new ProfileDto(profile.Name, profile.FullName, profile.Tagline, profile.Bio);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> UpdateProfile(ProfileUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var profile = await Db.Profiles.FirstOrDefaultAsync(p => p.SiteId == SiteId);
        if (profile is null)
        {
            profile = new Profile { SiteId = SiteId };
            Db.Profiles.Add(profile);
        }

        profile.Name = dto.Name;
        profile.FullName = dto.FullName;
        profile.Tagline = dto.Tagline;
        profile.Bio = dto.Bio;
        await Db.SaveChangesAsync();

        return new ProfileDto(profile.Name, profile.FullName, profile.Tagline, profile.Bio);
    }
}
