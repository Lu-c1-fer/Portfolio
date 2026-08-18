namespace Portfolio.Api.Models;

public class ContactSubmission
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Message { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
