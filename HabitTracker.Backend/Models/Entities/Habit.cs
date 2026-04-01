using System.Text.Json.Serialization;

namespace HabitTracker.Backend.Models.Entities;

public class Habit
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int Difficulty { get; set; } = 1; // 1-3
    public bool IsBad { get; set; } = false; // true = вредная привычка (отказываемся), false = полезная (формируем)
    public DateTime? LastRelapseDate { get; set; } // дата срыва (для вредных привычек)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [JsonIgnore]
    public User User { get; set; } = null!;
    public List<HabitCompletion> Completions { get; set; } = new();
}
