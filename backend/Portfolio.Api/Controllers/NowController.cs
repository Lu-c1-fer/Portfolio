using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Dtos;
using Portfolio.Api.Models;
using Portfolio.Api.Sites;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/sites/{siteSlug}/now")]
public class NowController : SiteScopedControllerBase
{
    public NowController(PortfolioDbContext db) : base(db) { }

    [HttpGet]
    public async Task<ActionResult<NowStatusDto>> GetNow()
    {
        var now = await Db.NowStatuses.AsNoTracking().FirstOrDefaultAsync(n => n.SiteId == SiteId);
        if (now is null) return NotFound();

        return ToDto(now);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<NowStatusDto>> UpdateNow(NowStatusUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var now = await Db.NowStatuses.FirstOrDefaultAsync(n => n.SiteId == SiteId);
        if (now is null)
        {
            now = new NowStatus { SiteId = SiteId };
            Db.NowStatuses.Add(now);
        }

        now.HpLabel = dto.HpLabel;
        now.HpValue = dto.HpValue;
        now.XpLabel = dto.XpLabel;
        now.XpValue = dto.XpValue;
        now.CoinsLabel = dto.CoinsLabel;
        now.CoinsValue = dto.CoinsValue;
        now.StarLabel = dto.StarLabel;
        now.StarValue = dto.StarValue;
        now.UpdatedDate = dto.UpdatedDate;
        await Db.SaveChangesAsync();

        return ToDto(now);
    }

    private static NowStatusDto ToDto(NowStatus now) => new(
        now.HpLabel, now.HpValue,
        now.XpLabel, now.XpValue,
        now.CoinsLabel, now.CoinsValue,
        now.StarLabel, now.StarValue,
        now.UpdatedDate);
}
