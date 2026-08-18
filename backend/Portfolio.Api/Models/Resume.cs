namespace Portfolio.Api.Models;

public class Resume
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string? Summary { get; set; }

    /// <summary>Reserved for a future PDF export/override. Unused until then.</summary>
    public string? ResumePdfUrl { get; set; }

    public DateTime UpdatedAt { get; set; }
}
