using System.Text.Json.Serialization;

namespace HabitTracker.Backend.Models.Entities;

public class HabitCompletion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HabitId { get; set; }
    public DateTime CompletionDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [JsonIgnore]
    public Habit Habit { get; set; } = null!;
}
