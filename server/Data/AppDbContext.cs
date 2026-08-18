using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Project> Projects=> Set<Project>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.Property(p=>p.Slug).IsRequired();
            entity.Property(p => p.Title).IsRequired();
        });
        base.OnModelCreating(modelBuilder);
    }
}