namespace Portfolio.Api.Models;

public class SkillEntry
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int ResumeId { get; set; }
    public string Category { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int Order { get; set; }
}
