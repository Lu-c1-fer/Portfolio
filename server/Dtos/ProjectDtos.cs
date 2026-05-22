namespace server.Dtos;

public record ProjectListItemDto(
    string Slug,
    string World,
    string Title,
    int Year,
    string Status,
    string Tldr,
    string[] Stack,
    string? HeroImageUrl
);

public record ProjectDetailDto(
    string Slug,
    string World,
    string Title,
    int Year,
    string Status,
    string Tldr,
    string BodyMarkdown,
    string[] Stack,
    string? HeroImageUrl,
    string? GithubUrl,
    string? LiveUrl
);