using HabitTracker.Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<GamificationProfile> GamificationProfiles => Set<GamificationProfile>();
    public DbSet<Habit> Habits => Set<Habit>();
    public DbSet<HabitCompletion> HabitCompletions => Set<HabitCompletion>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Конфигурация User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Username).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.AvatarUrl).HasMaxLength(500);
        });

        // Конфигурация GamificationProfile
        modelBuilder.Entity<GamificationProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithOne(u => u.GamificationProfile)
                .HasForeignKey<GamificationProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Конфигурация Habit
        modelBuilder.Entity<Habit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Difficulty).IsRequired();
            entity.HasOne(e => e.User)
                .WithMany(u => u.Habits)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Конфигурация HabitCompletion
        modelBuilder.Entity<HabitCompletion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.HabitId, e.CompletionDate }).IsUnique();
            entity.HasOne(e => e.Habit)
                .WithMany(h => h.Completions)
                .HasForeignKey(e => e.HabitId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Конфигурация Achievement
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.RequiredType).HasMaxLength(50).IsRequired();
        });

        // Конфигурация UserAchievement
        modelBuilder.Entity<UserAchievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
            entity.HasOne(e => e.User)
                .WithMany(u => u.UserAchievements)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Achievement)
                .WithMany(a => a.UserAchievements)
                .HasForeignKey(e => e.AchievementId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed данных для достижений
        SeedAchievements(modelBuilder);
    }

    private static void SeedAchievements(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Achievement>().HasData(
            new Achievement
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                Name = "Первый шаг",
                Description = "Выполнить 1 привычку",
                Icon = "🎯",
                RequiredType = "completions",
                RequiredValue = 1,
                XpReward = 10
            },
            new Achievement
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                Name = "Старожил",
                Description = "7-дневная серия",
                Icon = "🔥",
                RequiredType = "streak",
                RequiredValue = 7,
                XpReward = 50
            },
            new Achievement
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                Name = "Мастер привычек",
                Description = "Выполнить 30 привычек",
                Icon = "⭐",
                RequiredType = "completions",
                RequiredValue = 30,
                XpReward = 100
            },
            new Achievement
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                Name = "Неутомимый",
                Description = "30-дневная серия",
                Icon = "💪",
                RequiredType = "streak",
                RequiredValue = 30,
                XpReward = 200
            },
            new Achievement
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                Name = "Уровень 5",
                Description = "Достичь 5-го уровня",
                Icon = "🏆",
                RequiredType = "level",
                RequiredValue = 5,
                XpReward = 0
            }
        );
    }
}
