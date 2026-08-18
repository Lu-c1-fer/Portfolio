using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using System.Text.Json;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProjectsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectListItemDto>>> GetAll()
    {
        var projects = await _context.Projects
            .OrderBy(p => p.World)
            .ToListAsync();

        var dtos = projects.Select(p => new ProjectListItemDto(
            p.Slug,
            p.World,
            p.Title,
            p.Year,
            p.Status,
            p.Tldr,
            ParseStack(p.StackJson),
            p.HeroImageUrl
        ));

        return Ok(dtos);
    }
    [HttpGet("{slug}")]
     public async Task<ActionResult<ProjectDetailDto>> GetBySlug(string slug)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (project is null)
            return NotFound();

        var dto = new ProjectDetailDto(
            project.Slug,
            project.World,
            project.Title,
            project.Year,
            project.Status,
            project.Tldr,
            project.BodyMarkdown,
            ParseStack(project.StackJson),
            project.HeroImageUrl,
            project.GithubUrl,
            project.LiveUrl
        );

        return Ok(dto);
    }

    private static string[] ParseStack(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<string[]>(json) ?? Array.Empty<string>();
        }
        catch
        {
            return Array.Empty<string>();
        }
    }
}