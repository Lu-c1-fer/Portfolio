using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Dtos;
using Portfolio.Api.Models;
using Portfolio.Api.Sites;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/sites/{siteSlug}/projects")]
public class ProjectsController : SiteScopedControllerBase
{
    public ProjectsController(PortfolioDbContext db) : base(db) { }

    [HttpGet]
    public async Task<ActionResult<List<WorldSummaryDto>>> GetAll()
    {
        var worlds = await Db.ProjectWorlds.AsNoTracking().Where(w => w.SiteId == SiteId).OrderBy(w => w.World).ToListAsync();
        return worlds.Select(ToDto).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<WorldSummaryDto>> GetBySlug(string slug)
    {
        var world = await Db.ProjectWorlds.AsNoTracking().FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        return ToDto(world);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<WorldSummaryDto>> Create(WorldUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var exists = await Db.ProjectWorlds.AnyAsync(w => w.SiteId == SiteId && w.Slug == dto.Slug);
        if (exists) return Conflict(new { error = $"A project with slug '{dto.Slug}' already exists." });

        var world = new ProjectWorld
        {
            SiteId = SiteId,
            Slug = dto.Slug,
            World = dto.World,
            Title = dto.Title,
            Summary = dto.Summary,
            Stack = dto.Stack,
            Year = dto.Year,
            Enemy = dto.Enemy,
            Difficulty = dto.Difficulty,
            Status = dto.Status,
        };
        Db.ProjectWorlds.Add(world);
        await Db.SaveChangesAsync();

        return StatusCode(201, ToDto(world));
    }

    [HttpPut("{slug}")]
    [Authorize]
    public async Task<ActionResult<WorldSummaryDto>> Update(string slug, WorldUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var world = await Db.ProjectWorlds.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        if (dto.Slug != slug)
        {
            var conflict = await Db.ProjectWorlds.AnyAsync(w => w.SiteId == SiteId && w.Slug == dto.Slug);
            if (conflict) return Conflict(new { error = $"A project with slug '{dto.Slug}' already exists." });
        }

        world.Slug = dto.Slug;
        world.World = dto.World;
        world.Title = dto.Title;
        world.Summary = dto.Summary;
        world.Stack = dto.Stack;
        world.Year = dto.Year;
        world.Enemy = dto.Enemy;
        world.Difficulty = dto.Difficulty;
        world.Status = dto.Status;
        await Db.SaveChangesAsync();

        return ToDto(world);
    }

    [HttpDelete("{slug}")]
    [Authorize]
    public async Task<IActionResult> Delete(string slug)
    {
        var world = await Db.ProjectWorlds.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        Db.ProjectWorlds.Remove(world); // cascades to CaseStudy → sections → blocks
        await Db.SaveChangesAsync();
        return NoContent();
    }

    // ---------------- case study sub-resource ----------------

    [HttpGet("{slug}/case-study")]
    public async Task<ActionResult<CaseStudyDto>> GetCaseStudy(string slug)
    {
        var world = await Db.ProjectWorlds.AsNoTracking().FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        var caseStudy = await Db.CaseStudies.AsNoTracking().FirstOrDefaultAsync(c => c.ProjectWorldId == world.Id);
        if (caseStudy is null) return NotFound();

        return await BuildCaseStudyDto(caseStudy);
    }

    [HttpPut("{slug}/case-study")]
    [Authorize]
    public async Task<ActionResult<CaseStudyDto>> UpsertCaseStudy(string slug, CaseStudyUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var world = await Db.ProjectWorlds.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        await using var transaction = await Db.Database.BeginTransactionAsync();

        var caseStudy = await Db.CaseStudies.FirstOrDefaultAsync(c => c.ProjectWorldId == world.Id);
        if (caseStudy is null)
        {
            caseStudy = new CaseStudy { SiteId = SiteId, ProjectWorldId = world.Id };
            Db.CaseStudies.Add(caseStudy);
        }
        else
        {
            var sectionIds = await Db.CaseStudySections.Where(s => s.CaseStudyId == caseStudy.Id).Select(s => s.Id).ToListAsync();
            Db.CaseStudyBlocks.RemoveRange(Db.CaseStudyBlocks.Where(b => sectionIds.Contains(b.CaseStudySectionId)));
            Db.CaseStudySections.RemoveRange(Db.CaseStudySections.Where(s => s.CaseStudyId == caseStudy.Id));
            await Db.SaveChangesAsync();
        }

        caseStudy.World = dto.World;
        caseStudy.Title = dto.Title;
        caseStudy.Year = dto.Year;
        caseStudy.Stack = dto.Stack;
        caseStudy.Tldr = dto.Tldr;
        await Db.SaveChangesAsync(); // ensures caseStudy.Id is populated

        for (var si = 0; si < dto.Sections.Count; si++)
        {
            var sectionDto = dto.Sections[si];
            var section = new CaseStudySection
            {
                SiteId = SiteId,
                CaseStudyId = caseStudy.Id,
                SectionId = sectionDto.SectionId,
                Title = sectionDto.Title,
                Order = si,
            };
            Db.CaseStudySections.Add(section);
            await Db.SaveChangesAsync(); // ensures section.Id is populated

            for (var bi = 0; bi < sectionDto.Blocks.Count; bi++)
            {
                var blockDto = sectionDto.Blocks[bi];
                Db.CaseStudyBlocks.Add(new CaseStudyBlock
                {
                    SiteId = SiteId,
                    CaseStudySectionId = section.Id,
                    Order = bi,
                    Type = blockDto.Type,
                    Text = blockDto.Text,
                    Items = blockDto.Items,
                    Lang = blockDto.Lang,
                    Variant = blockDto.Variant,
                    Title = blockDto.Title,
                });
            }
        }
        await Db.SaveChangesAsync();
        await transaction.CommitAsync();

        return await BuildCaseStudyDto(caseStudy);
    }

    [HttpDelete("{slug}/case-study")]
    [Authorize]
    public async Task<IActionResult> DeleteCaseStudy(string slug)
    {
        var world = await Db.ProjectWorlds.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Slug == slug);
        if (world is null) return NotFound();

        var caseStudy = await Db.CaseStudies.FirstOrDefaultAsync(c => c.ProjectWorldId == world.Id);
        if (caseStudy is null) return NotFound();

        Db.CaseStudies.Remove(caseStudy); // cascades to sections → blocks
        await Db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<CaseStudyDto> BuildCaseStudyDto(CaseStudy caseStudy)
    {
        var sections = await Db.CaseStudySections.AsNoTracking()
            .Where(s => s.CaseStudyId == caseStudy.Id)
            .OrderBy(s => s.Order)
            .ToListAsync();

        var sectionIds = sections.Select(s => s.Id).ToList();
        var blocks = await Db.CaseStudyBlocks.AsNoTracking()
            .Where(b => sectionIds.Contains(b.CaseStudySectionId))
            .OrderBy(b => b.Order)
            .ToListAsync();

        var blocksBySection = blocks.ToLookup(b => b.CaseStudySectionId);

        var sectionDtos = sections.Select(s => new CaseStudySectionDto(
            s.SectionId,
            s.Title,
            blocksBySection[s.Id].Select(b => new CaseStudyBlockDto(b.Type, b.Text, b.Items, b.Lang, b.Variant, b.Title)).ToList()
        )).ToList();

        return new CaseStudyDto(caseStudy.World, caseStudy.Title, caseStudy.Year, caseStudy.Stack, caseStudy.Tldr, sectionDtos);
    }

    private static WorldSummaryDto ToDto(ProjectWorld w) =>
        new(w.Slug, w.World, w.Title, w.Summary, w.Stack, w.Year, w.Enemy, w.Difficulty, w.Status);
}
