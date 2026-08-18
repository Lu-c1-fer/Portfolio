using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Dtos;

public record CaseStudyBlockUpsertDto(
    [Required, MinLength(1)] string Type,
    string? Text,
    List<string>? Items,
    string? Lang,
    string? Variant,
    string? Title);

public record CaseStudySectionUpsertDto(
    [Required, MinLength(1)] string SectionId,
    [Required, MinLength(1)] string Title,
    List<CaseStudyBlockUpsertDto> Blocks);

public record CaseStudyUpsertDto(
    [Required, MinLength(1)] string World,
    [Required, MinLength(1)] string Title,
    [Required, MinLength(1)] string Year,
    List<string> Stack,
    [Required, MinLength(1)] string Tldr,
    List<CaseStudySectionUpsertDto> Sections);
