using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record ContactRequestDto(
    [Required, MinLength(1)] string Name,
    [Required, EmailAddress] string Email,
    [Required, MinLength(10)] string Message);
