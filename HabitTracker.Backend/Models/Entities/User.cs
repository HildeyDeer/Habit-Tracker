using System.Text.Json.Serialization;

namespace HabitTracker.Backend.Models.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [JsonIgnore]
    public GamificationProfile? GamificationProfile { get; set; }
    [JsonIgnore]
    public List<Habit> Habits { get; set; } = new();
    [JsonIgnore]
    public List<UserAchievement> UserAchievements { get; set; } = new();
}
