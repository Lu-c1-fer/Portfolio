namespace Portfolio.Api.Models;

public class Site
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Domain { get; set; }
}
