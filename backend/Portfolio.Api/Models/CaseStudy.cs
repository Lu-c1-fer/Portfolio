namespace Portfolio.Api.Models;

public class CaseStudy
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int ProjectWorldId { get; set; }
    public string World { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Year { get; set; } = null!;
    public List<string> Stack { get; set; } = new();
    public string Tldr { get; set; } = null!;
}
