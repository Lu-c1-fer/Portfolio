namespace Portfolio.Api.Dtos;

public record CaseStudyBlockDto(string Type, string? Text, List<string>? Items, string? Lang, string? Variant, string? Title);

public record CaseStudySectionDto(string SectionId, string Title, List<CaseStudyBlockDto> Blocks);

public record CaseStudyDto(string World, string Title, string Year, List<string> Stack, string Tldr, List<CaseStudySectionDto> Sections);
