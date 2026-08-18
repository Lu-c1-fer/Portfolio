namespace Portfolio.Api.Models;

public class WorkHistoryEntry
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int ResumeId { get; set; }
    public string Company { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? Location { get; set; }
    public string StartDate { get; set; } = null!;
    public string? EndDate { get; set; } // null = current role
    public string? Description { get; set; }
    public List<string> Bullets { get; set; } = new();
    public int Order { get; set; }
}
