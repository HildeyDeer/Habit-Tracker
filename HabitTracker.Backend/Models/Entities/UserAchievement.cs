using System.Text.Json.Serialization;

namespace HabitTracker.Backend.Models.Entities;

public class UserAchievement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid AchievementId { get; set; }
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [JsonIgnore]
    public User User { get; set; } = null!;
    [JsonIgnore]
    public Achievement Achievement { get; set; } = null!;
}
