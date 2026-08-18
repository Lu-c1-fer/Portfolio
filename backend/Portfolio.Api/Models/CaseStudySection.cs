namespace Portfolio.Api.Models;

public class CaseStudySection
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int CaseStudyId { get; set; }
    public string SectionId { get; set; } = null!;
    public string Title { get; set; } = null!;
    public int Order { get; set; }
}
