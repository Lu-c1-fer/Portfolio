using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record ProfileUpsertDto(
    [Required, MinLength(1)] string Name,
    [Required, MinLength(1)] string FullName,
    [Required, MinLength(1)] string Tagline,
    [Required, MinLength(1)] string Bio);
