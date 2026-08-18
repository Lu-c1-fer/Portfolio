namespace Portfolio.Api.Models;

public class EducationEntry
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int ResumeId { get; set; }
    public string Institution { get; set; } = null!;
    public string Degree { get; set; } = null!;
    public string? FieldOfStudy { get; set; }
    public string StartDate { get; set; } = null!;
    public string? EndDate { get; set; }
    public string? Description { get; set; }
    public int Order { get; set; }
}
