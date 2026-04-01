namespace HabitTracker.Backend.Models.Entities;

public class Achievement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string RequiredType { get; set; } = string.Empty; // completions, streak, level
    public int RequiredValue { get; set; }
    public int XpReward { get; set; } = 0;

    // Навигационные свойства
    public List<UserAchievement> UserAchievements { get; set; } = new();
}
