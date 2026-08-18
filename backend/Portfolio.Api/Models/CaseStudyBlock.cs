namespace Portfolio.Api.Models;

public class CaseStudyBlock
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public int CaseStudySectionId { get; set; }
    public int Order { get; set; }

    /// <summary>"p" | "ul" | "code" | "block"</summary>
    public string Type { get; set; } = null!;

    public string? Text { get; set; }     // used by p, code (the code text), block (callout body)
    public List<string>? Items { get; set; } // used by ul
    public string? Lang { get; set; }     // used by code
    public string? Variant { get; set; }  // used by block ("tip" | "warn")
    public string? Title { get; set; }    // used by block (optional glyph/title override)
}
