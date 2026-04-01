using HabitTracker.Backend.Data;
using HabitTracker.Backend.Models.DTOs;
using HabitTracker.Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Backend.Services;

public class HabitService : IHabitService
{
    private readonly AppDbContext _context;
    private readonly IGamificationService _gamificationService;

    public HabitService(AppDbContext context, IGamificationService gamificationService)
    {
        _context = context;
        _gamificationService = gamificationService;
    }

    public async Task<List<HabitDto>> GetAllHabitsAsync(Guid userId)
    {
        var today = DateTime.UtcNow.Date;

        var habits = await _context.Habits
            .Where(h => h.UserId == userId)
            .Include(h => h.Completions)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return habits.Select(h => new HabitDto
        {
            Id = h.Id,
            Name = h.Name,
            Description = h.Description,
            Icon = h.Icon,
            Color = h.Color,
            Difficulty = h.Difficulty,
            IsBad = h.IsBad,
            IsCompletedToday = h.Completions.Any(c => c.CompletionDate == today),
            CurrentStreak = CalculateStreak(h),
            LastRelapseDate = h.LastRelapseDate
        }).ToList();
    }

    private static int CalculateStreak(Habit habit)
    {
        if (habit.IsBad)
        {
            // Для вредных привычек — дни без срыва
            var startDate = habit.LastRelapseDate ?? habit.CreatedAt;
            return (DateTime.UtcNow.Date - startDate.Date).Days;
        }
        else
        {
            // Для полезных — дни подряд с выполнением
            var today = DateTime.UtcNow.Date;
            int streak = 0;

            for (int i = 0; i < 365; i++)
            {
                var date = today.AddDays(-i);
                var hasCompletion = habit.Completions.Any(c => c.CompletionDate.Date == date);

                if (hasCompletion || i == 0)
                {
                    streak++;
                }
                else
                {
                    break;
                }
            }

            return streak;
        }
    }

    public async Task<HabitDto> GetHabitByIdAsync(Guid habitId, Guid userId)
    {
        var habit = await _context.Habits
            .Include(h => h.Completions)
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        return new HabitDto
        {
            Id = habit.Id,
            Name = habit.Name,
            Description = habit.Description,
            Icon = habit.Icon,
            Color = habit.Color,
            Difficulty = habit.Difficulty,
            IsBad = habit.IsBad,
            IsCompletedToday = habit.Completions.Any(c => c.CompletionDate == DateTime.UtcNow.Date),
            CurrentStreak = CalculateStreak(habit),
            LastRelapseDate = habit.LastRelapseDate
        };
    }

    public async Task<HabitDto> CreateHabitAsync(Guid userId, CreateHabitDto dto)
    {
        var habit = new Habit
        {
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Icon = dto.Icon,
            Color = dto.Color,
            Difficulty = dto.Difficulty,
            IsBad = dto.IsBad
        };

        _context.Habits.Add(habit);
        await _context.SaveChangesAsync();

        return new HabitDto
        {
            Id = habit.Id,
            Name = habit.Name,
            Description = habit.Description,
            Icon = habit.Icon,
            Color = habit.Color,
            Difficulty = habit.Difficulty,
            IsBad = habit.IsBad,
            IsCompletedToday = false,
            CurrentStreak = 0,
            LastRelapseDate = null
        };
    }

    public async Task<HabitDto> UpdateHabitAsync(Guid habitId, Guid userId, UpdateHabitDto dto)
    {
        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        if (dto.Name != null) habit.Name = dto.Name;
        if (dto.Description != null) habit.Description = dto.Description;
        if (dto.Icon != null) habit.Icon = dto.Icon;
        if (dto.Color != null) habit.Color = dto.Color;
        if (dto.Difficulty.HasValue) habit.Difficulty = dto.Difficulty.Value;
        if (dto.IsBad.HasValue) habit.IsBad = dto.IsBad.Value;

        await _context.SaveChangesAsync();

        return new HabitDto
        {
            Id = habit.Id,
            Name = habit.Name,
            Description = habit.Description,
            Icon = habit.Icon,
            Color = habit.Color,
            Difficulty = habit.Difficulty,
            IsBad = habit.IsBad,
            IsCompletedToday = false,
            CurrentStreak = CalculateStreak(habit),
            LastRelapseDate = habit.LastRelapseDate
        };
    }

    public async Task DeleteHabitAsync(Guid habitId, Guid userId)
    {
        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        _context.Habits.Remove(habit);
        await _context.SaveChangesAsync();
    }

    public async Task<HabitCompletion> CompleteHabitAsync(Guid habitId, Guid userId)
    {
        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        var today = DateTime.UtcNow.Date;

        // Проверка, не выполнена ли уже сегодня
        var existing = await _context.HabitCompletions
            .FirstOrDefaultAsync(hc => hc.HabitId == habitId && hc.CompletionDate == today);

        if (existing != null)
        {
            throw new InvalidOperationException("Already completed today");
        }

        // Создание записи о выполнении
        var completion = new HabitCompletion
        {
            HabitId = habitId,
            CompletionDate = today
        };
        _context.HabitCompletions.Add(completion);

        // Обновление геймификации
        var xpReward = habit.Difficulty * 10; // 10, 20, 30 XP
        await _gamificationService.AddExperienceAsync(userId, xpReward);
        await _gamificationService.UpdateStreaksAsync(userId);

        await _context.SaveChangesAsync();

        return completion;
    }

    public async Task UncompleteHabitAsync(Guid habitId, Guid userId, DateTime date)
    {
        var completion = await _context.HabitCompletions
            .FirstOrDefaultAsync(hc => hc.HabitId == habitId && hc.CompletionDate == date.Date);

        if (completion == null)
        {
            throw new KeyNotFoundException("Completion not found");
        }

        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        _context.HabitCompletions.Remove(completion);
        await _context.SaveChangesAsync();
    }

    public async Task<List<HabitCompletion>> GetHabitCompletionsAsync(Guid habitId, Guid userId)
    {
        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        return await _context.HabitCompletions
            .Where(hc => hc.HabitId == habitId)
            .OrderByDescending(hc => hc.CompletionDate)
            .ToListAsync();
    }

    public async Task<Dictionary<DateTime, int>> GetActivityCalendarAsync(Guid userId, int months = 6)
    {
        var startDate = DateTime.UtcNow.Date.AddMonths(-months);

        var completions = await _context.HabitCompletions
            .Where(hc => hc.Habit.UserId == userId && hc.CompletionDate >= startDate)
            .GroupBy(hc => hc.CompletionDate)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToListAsync();

        return completions.ToDictionary(x => x.Key, x => x.Count);
    }

    public async Task<HabitDto> RecordRelapseAsync(Guid habitId, Guid userId, string? comment)
    {
        var habit = await _context.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);

        if (habit == null)
        {
            throw new KeyNotFoundException("Habit not found");
        }

        if (!habit.IsBad)
        {
            throw new InvalidOperationException("Can only record relapses for bad habits");
        }

        // Запись срыва
        habit.LastRelapseDate = DateTime.UtcNow;
        
        // Сброс серии в геймификации
        var profile = await _context.GamificationProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);
        
        if (profile != null)
        {
            profile.CurrentStreak = 0;
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new HabitDto
        {
            Id = habit.Id,
            Name = habit.Name,
            Description = habit.Description,
            Icon = habit.Icon,
            Color = habit.Color,
            Difficulty = habit.Difficulty,
            IsBad = habit.IsBad,
            IsCompletedToday = false,
            CurrentStreak = 0,
            LastRelapseDate = habit.LastRelapseDate
        };
    }
}
