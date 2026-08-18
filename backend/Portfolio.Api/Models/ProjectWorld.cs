namespace Portfolio.Api.Models;

public class ProjectWorld
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string Slug { get; set; } = null!;
    public string World { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Summary { get; set; } = null!;
    public List<string> Stack { get; set; } = new();
    public string Year { get; set; } = null!;
    public string Enemy { get; set; } = null!;
    public int Difficulty { get; set; }
    public string Status { get; set; } = null!;
}
