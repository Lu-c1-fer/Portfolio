using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record NowStatusUpsertDto(
    [Required, MinLength(1)] string HpLabel, [Required, MinLength(1)] string HpValue,
    [Required, MinLength(1)] string XpLabel, [Required, MinLength(1)] string XpValue,
    [Required, MinLength(1)] string CoinsLabel, [Required, MinLength(1)] string CoinsValue,
    [Required, MinLength(1)] string StarLabel, [Required, MinLength(1)] string StarValue,
    [Required, MinLength(1)] string UpdatedDate);
