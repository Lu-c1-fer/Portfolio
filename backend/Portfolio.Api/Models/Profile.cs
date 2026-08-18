namespace Portfolio.Api.Models;

public class Profile
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string Name { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Tagline { get; set; } = null!;
    public string Bio { get; set; } = null!;
}
