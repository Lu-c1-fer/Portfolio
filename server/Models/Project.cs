
namespace server.Models;
public class Project
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string World { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Status {get; set; } = "cleared";
    public string Tldr { get; set; } = string.Empty;
    public string BodyMarkdown { get; set; } = string.Empty;
    public string StackJson { get; set; } = "[]";
    public string? HeroImageUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }