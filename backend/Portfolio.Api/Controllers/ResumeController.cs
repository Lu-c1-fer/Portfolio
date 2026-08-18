using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Dtos;
using Portfolio.Api.Models;
using Portfolio.Api.Sites;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/sites/{siteSlug}/resume")]
public class ResumeController : SiteScopedControllerBase
{
    public ResumeController(PortfolioDbContext db) : base(db) { }

    [HttpGet]
    public async Task<ActionResult<ResumeDto>> Get()
    {
        var resume = await Db.Resumes.AsNoTracking().FirstOrDefaultAsync(r => r.SiteId == SiteId);
        if (resume is null) return NotFound();

        return await BuildResumeDto(resume);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ResumeDto>> UpdateResume(ResumeUpsertDto dto)
    {
        var resume = await GetOrCreateResumeAsync();
        resume.Summary = dto.Summary;
        resume.ResumePdfUrl = dto.ResumePdfUrl;
        resume.UpdatedAt = DateTime.UtcNow;
        await Db.SaveChangesAsync();

        return await BuildResumeDto(resume);
    }

    // ---------------- work history ----------------

    [HttpPost("work-history")]
    [Authorize]
    public async Task<ActionResult<WorkHistoryDto>> CreateWorkHistory(WorkHistoryUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var resume = await GetOrCreateResumeAsync();
        var entry = new WorkHistoryEntry
        {
            SiteId = SiteId,
            ResumeId = resume.Id,
            Company = dto.Company,
            Role = dto.Role,
            Location = dto.Location,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            Bullets = dto.Bullets,
            Order = dto.Order,
        };
        Db.WorkHistoryEntries.Add(entry);
        await Db.SaveChangesAsync();

        return StatusCode(201, ToDto(entry));
    }

    [HttpPut("work-history/{id:int}")]
    [Authorize]
    public async Task<ActionResult<WorkHistoryDto>> UpdateWorkHistory(int id, WorkHistoryUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entry = await Db.WorkHistoryEntries.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Id == id);
        if (entry is null) return NotFound();

        entry.Company = dto.Company;
        entry.Role = dto.Role;
        entry.Location = dto.Location;
        entry.StartDate = dto.StartDate;
        entry.EndDate = dto.EndDate;
        entry.Description = dto.Description;
        entry.Bullets = dto.Bullets;
        entry.Order = dto.Order;
        await Db.SaveChangesAsync();

        return ToDto(entry);
    }

    [HttpDelete("work-history/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteWorkHistory(int id)
    {
        var entry = await Db.WorkHistoryEntries.FirstOrDefaultAsync(w => w.SiteId == SiteId && w.Id == id);
        if (entry is null) return NotFound();

        Db.WorkHistoryEntries.Remove(entry);
        await Db.SaveChangesAsync();
        return NoContent();
    }

    // ---------------- education ----------------

    [HttpPost("education")]
    [Authorize]
    public async Task<ActionResult<EducationDto>> CreateEducation(EducationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var resume = await GetOrCreateResumeAsync();
        var entry = new EducationEntry
        {
            SiteId = SiteId,
            ResumeId = resume.Id,
            Institution = dto.Institution,
            Degree = dto.Degree,
            FieldOfStudy = dto.FieldOfStudy,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            Order = dto.Order,
        };
        Db.EducationEntries.Add(entry);
        await Db.SaveChangesAsync();

        return StatusCode(201, ToDto(entry));
    }

    [HttpPut("education/{id:int}")]
    [Authorize]
    public async Task<ActionResult<EducationDto>> UpdateEducation(int id, EducationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entry = await Db.EducationEntries.FirstOrDefaultAsync(e => e.SiteId == SiteId && e.Id == id);
        if (entry is null) return NotFound();

        entry.Institution = dto.Institution;
        entry.Degree = dto.Degree;
        entry.FieldOfStudy = dto.FieldOfStudy;
        entry.StartDate = dto.StartDate;
        entry.EndDate = dto.EndDate;
        entry.Description = dto.Description;
        entry.Order = dto.Order;
        await Db.SaveChangesAsync();

        return ToDto(entry);
    }

    [HttpDelete("education/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteEducation(int id)
    {
        var entry = await Db.EducationEntries.FirstOrDefaultAsync(e => e.SiteId == SiteId && e.Id == id);
        if (entry is null) return NotFound();

        Db.EducationEntries.Remove(entry);
        await Db.SaveChangesAsync();
        return NoContent();
    }

    // ---------------- skills ----------------

    [HttpPost("skills")]
    [Authorize]
    public async Task<ActionResult<SkillDto>> CreateSkill(SkillUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var resume = await GetOrCreateResumeAsync();
        var entry = new SkillEntry
        {
            SiteId = SiteId,
            ResumeId = resume.Id,
            Category = dto.Category,
            Name = dto.Name,
            Order = dto.Order,
        };
        Db.SkillEntries.Add(entry);
        await Db.SaveChangesAsync();

        return StatusCode(201, ToDto(entry));
    }

    [HttpPut("skills/{id:int}")]
    [Authorize]
    public async Task<ActionResult<SkillDto>> UpdateSkill(int id, SkillUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entry = await Db.SkillEntries.FirstOrDefaultAsync(s => s.SiteId == SiteId && s.Id == id);
        if (entry is null) return NotFound();

        entry.Category = dto.Category;
        entry.Name = dto.Name;
        entry.Order = dto.Order;
        await Db.SaveChangesAsync();

        return ToDto(entry);
    }

    [HttpDelete("skills/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var entry = await Db.SkillEntries.FirstOrDefaultAsync(s => s.SiteId == SiteId && s.Id == id);
        if (entry is null) return NotFound();

        Db.SkillEntries.Remove(entry);
        await Db.SaveChangesAsync();
        return NoContent();
    }

    // ---------------- helpers ----------------

    private async Task<Resume> GetOrCreateResumeAsync()
    {
        var resume = await Db.Resumes.FirstOrDefaultAsync(r => r.SiteId == SiteId);
        if (resume is null)
        {
            resume = new Resume { SiteId = SiteId, UpdatedAt = DateTime.UtcNow };
            Db.Resumes.Add(resume);
            await Db.SaveChangesAsync();
        }
        return resume;
    }

    private async Task<ResumeDto> BuildResumeDto(Resume resume)
    {
        var workHistory = await Db.WorkHistoryEntries.AsNoTracking().Where(w => w.ResumeId == resume.Id).OrderBy(w => w.Order).ToListAsync();
        var education = await Db.EducationEntries.AsNoTracking().Where(e => e.ResumeId == resume.Id).OrderBy(e => e.Order).ToListAsync();
        var skills = await Db.SkillEntries.AsNoTracking().Where(s => s.ResumeId == resume.Id).OrderBy(s => s.Order).ToListAsync();

        return new ResumeDto(
            resume.Summary,
            resume.ResumePdfUrl,
            resume.UpdatedAt,
            workHistory.Select(ToDto).ToList(),
            education.Select(ToDto).ToList(),
            skills.Select(ToDto).ToList());
    }

    private static WorkHistoryDto ToDto(WorkHistoryEntry w) =>
        new(w.Id, w.Company, w.Role, w.Location, w.StartDate, w.EndDate, w.Description, w.Bullets, w.Order);

    private static EducationDto ToDto(EducationEntry e) =>
        new(e.Id, e.Institution, e.Degree, e.FieldOfStudy, e.StartDate, e.EndDate, e.Description, e.Order);

    private static SkillDto ToDto(SkillEntry s) =>
        new(s.Id, s.Category, s.Name, s.Order);
}
