namespace Portfolio.Api.Dtos;

public record WorkHistoryDto(int Id, string Company, string Role, string? Location, string StartDate, string? EndDate, string? Description, List<string> Bullets, int Order);

public record EducationDto(int Id, string Institution, string Degree, string? FieldOfStudy, string StartDate, string? EndDate, string? Description, int Order);

public record SkillDto(int Id, string Category, string Name, int Order);

public record ResumeDto(
    string? Summary,
    string? ResumePdfUrl,
    DateTime UpdatedAt,
    List<WorkHistoryDto> WorkHistory,
    List<EducationDto> Education,
    List<SkillDto> Skills);
