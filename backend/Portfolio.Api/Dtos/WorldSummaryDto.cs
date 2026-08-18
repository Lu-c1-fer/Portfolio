namespace Portfolio.Api.Dtos;

public record WorldSummaryDto(
    string Slug, string World, string Title, string Summary,
    List<string> Stack, string Year, string Enemy, int Difficulty, string Status);
