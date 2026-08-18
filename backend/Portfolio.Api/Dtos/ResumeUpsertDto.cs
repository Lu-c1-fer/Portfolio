using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record ResumeUpsertDto(string? Summary, string? ResumePdfUrl);

public record WorkHistoryUpsertDto(
    [Required, MinLength(1)] string Company,
    [Required, MinLength(1)] string Role,
    string? Location,
    [Required, MinLength(1)] string StartDate,
    string? EndDate,
    string? Description,
    List<string> Bullets,
    int Order);

public record EducationUpsertDto(
    [Required, MinLength(1)] string Institution,
    [Required, MinLength(1)] string Degree,
    string? FieldOfStudy,
    [Required, MinLength(1)] string StartDate,
    string? EndDate,
    string? Description,
    int Order);

public record SkillUpsertDto(
    [Required, MinLength(1)] string Category,
    [Required, MinLength(1)] string Name,
    int Order);
