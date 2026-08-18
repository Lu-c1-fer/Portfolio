using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record WorldUpsertDto(
    [Required, MinLength(1)] string Slug,
    [Required, MinLength(1)] string World,
    [Required, MinLength(1)] string Title,
    [Required, MinLength(1)] string Summary,
    List<string> Stack,
    [Required, MinLength(1)] string Year,
    [Required, MinLength(1)] string Enemy,
    int Difficulty,
    [Required, MinLength(1)] string Status);
