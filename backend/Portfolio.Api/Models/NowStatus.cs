namespace Portfolio.Api.Models;

public class NowStatus
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string HpLabel { get; set; } = null!;
    public string HpValue { get; set; } = null!;
    public string XpLabel { get; set; } = null!;
    public string XpValue { get; set; } = null!;
    public string CoinsLabel { get; set; } = null!;
    public string CoinsValue { get; set; } = null!;
    public string StarLabel { get; set; } = null!;
    public string StarValue { get; set; } = null!;
    public string UpdatedDate { get; set; } = null!;
}
