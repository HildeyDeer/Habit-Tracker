namespace HabitTracker.Backend.Models.DTOs;

public class GamificationProfileDto
{
    public int Level { get; set; }
    public int ExperiencePoints { get; set; }
    public int XpToNextLevel { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public int TotalCompletions { get; set; }
}

public class AchievementDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public bool IsEarned { get; set; }
    public DateTime? EarnedAt { get; set; }
}
