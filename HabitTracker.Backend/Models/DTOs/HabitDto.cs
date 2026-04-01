namespace HabitTracker.Backend.Models.DTOs;

public class HabitDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int Difficulty { get; set; }
    public bool IsBad { get; set; }
    public bool IsCompletedToday { get; set; }
    public int CurrentStreak { get; set; }
    public DateTime? LastRelapseDate { get; set; }
}

public class CreateHabitDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int Difficulty { get; set; } = 1;
    public bool IsBad { get; set; } = false;
}

public class UpdateHabitDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int? Difficulty { get; set; }
    public bool? IsBad { get; set; }
}

public class RelapseDto
{
    public string? Comment { get; set; }
}
