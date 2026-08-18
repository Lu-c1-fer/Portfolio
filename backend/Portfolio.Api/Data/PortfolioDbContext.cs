using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Portfolio.Api.Models;
using System.Text.Json;

namespace Portfolio.Api.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }

    public DbSet<Site> Sites => Set<Site>();
    public DbSet<ProjectWorld> ProjectWorlds => Set<ProjectWorld>();
    public DbSet<CaseStudy> CaseStudies => Set<CaseStudy>();
    public DbSet<CaseStudySection> CaseStudySections => Set<CaseStudySection>();
    public DbSet<CaseStudyBlock> CaseStudyBlocks => Set<CaseStudyBlock>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<NowStatus> NowStatuses => Set<NowStatus>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<WorkHistoryEntry> WorkHistoryEntries => Set<WorkHistoryEntry>();
    public DbSet<EducationEntry> EducationEntries => Set<EducationEntry>();
    public DbSet<SkillEntry> SkillEntries => Set<SkillEntry>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>());

        var stringListComparer = new ValueComparer<List<string>>(
            (a, b) => (a ?? new()).SequenceEqual(b ?? new()),
            v => v.Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())),
            v => v.ToList());

        var nullableStringListConverter = new ValueConverter<List<string>?, string?>(
            v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => v == null ? null : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null));

        var nullableStringListComparer = new ValueComparer<List<string>?>(
            (a, b) => (a ?? new()).SequenceEqual(b ?? new()),
            v => (v ?? new()).Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())),
            v => v == null ? null : v.ToList());

        modelBuilder.Entity<Site>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.Slug).IsUnique();
        });

        modelBuilder.Entity<ProjectWorld>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => new { p.SiteId, p.Slug }).IsUnique();
            e.Property(p => p.Stack)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<CaseStudy>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.ProjectWorldId).IsUnique();
            e.HasOne<ProjectWorld>().WithOne()
                .HasForeignKey<CaseStudy>(c => c.ProjectWorldId)
                .OnDelete(DeleteBehavior.Cascade);
            e.Property(c => c.Stack)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<CaseStudySection>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasOne<CaseStudy>().WithMany()
                .HasForeignKey(s => s.CaseStudyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CaseStudyBlock>(e =>
        {
            e.HasKey(b => b.Id);
            e.HasOne<CaseStudySection>().WithMany()
                .HasForeignKey(b => b.CaseStudySectionId)
                .OnDelete(DeleteBehavior.Cascade);
            e.Property(b => b.Items)
                .HasConversion(nullableStringListConverter)
                .Metadata.SetValueComparer(nullableStringListComparer);
        });

        modelBuilder.Entity<Profile>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.SiteId).IsUnique();
        });

        modelBuilder.Entity<NowStatus>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.SiteId).IsUnique();
        });

        modelBuilder.Entity<Resume>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => r.SiteId).IsUnique();
        });

        modelBuilder.Entity<WorkHistoryEntry>(e =>
        {
            e.HasKey(w => w.Id);
            e.HasOne<Resume>().WithMany()
                .HasForeignKey(w => w.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
            e.Property(w => w.Bullets)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<EducationEntry>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne<Resume>().WithMany()
                .HasForeignKey(x => x.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SkillEntry>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasOne<Resume>().WithMany()
                .HasForeignKey(s => s.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContactSubmission>(e =>
        {
            e.HasKey(c => c.Id);
        });
    }
}
