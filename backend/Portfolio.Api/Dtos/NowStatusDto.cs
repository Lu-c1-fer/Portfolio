namespace Portfolio.Api.Dtos;

public record NowStatusDto(
    string HpLabel, string HpValue,
    string XpLabel, string XpValue,
    string CoinsLabel, string CoinsValue,
    string StarLabel, string StarValue,
    string UpdatedDate);
