using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Data;
using Portfolio.Api.Dtos;
using Portfolio.Api.Models;
using Portfolio.Api.Sites;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/sites/{siteSlug}/contact")]
public class ContactController : SiteScopedControllerBase
{
    public ContactController(PortfolioDbContext db) : base(db) { }

    [HttpPost]
    public async Task<IActionResult> Submit(ContactRequestDto request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        Db.ContactSubmissions.Add(new ContactSubmission
        {
            SiteId = SiteId,
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Message = request.Message.Trim(),
            CreatedAt = DateTime.UtcNow,
        });
        await Db.SaveChangesAsync();

        return Ok();
    }
}
