using System.Text.Json.Serialization;

namespace HabitTracker.Backend.Models.Entities;

public class GamificationProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public int Level { get; set; } = 1;
    public int ExperiencePoints { get; set; } = 0;
    public int TotalCompletions { get; set; } = 0;
    public int CurrentStreak { get; set; } = 0;
    public int LongestStreak { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [JsonIgnore]
    public User User { get; set; } = null!;
}
