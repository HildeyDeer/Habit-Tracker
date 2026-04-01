using HabitTracker.Backend.Data;
using HabitTracker.Backend.Models.DTOs;
using HabitTracker.Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Backend.Services;

public class GamificationService : IGamificationService
{
    private readonly AppDbContext _context;

    public GamificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateProfileAsync(Guid userId)
    {
        var profile = new GamificationProfile
        {
            UserId = userId,
            Level = 1,
            ExperiencePoints = 0,
            TotalCompletions = 0,
            CurrentStreak = 0,
            LongestStreak = 0
        };

        _context.GamificationProfiles.Add(profile);
        await _context.SaveChangesAsync();
    }

    public async Task<GamificationProfileDto> GetProfileAsync(Guid userId)
    {
        var profile = await _context.GamificationProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            throw new KeyNotFoundException("Gamification profile not found");
        }

        return new GamificationProfileDto
        {
            Level = profile.Level,
            ExperiencePoints = profile.ExperiencePoints,
            XpToNextLevel = GetXpForNextLevel(profile.Level),
            CurrentStreak = profile.CurrentStreak,
            LongestStreak = profile.LongestStreak,
            TotalCompletions = profile.TotalCompletions
        };
    }

    public async Task<GamificationProfile> AddExperienceAsync(Guid userId, int xp)
    {
        var profile = await _context.GamificationProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            throw new KeyNotFoundException("Gamification profile not found");
        }

        profile.ExperiencePoints += xp;

        // Проверка повышения уровня
        int xpNeeded = GetXpForNextLevel(profile.Level);
        while (profile.ExperiencePoints >= xpNeeded)
        {
            profile.Level++;
            profile.ExperiencePoints -= xpNeeded;
            xpNeeded = GetXpForNextLevel(profile.Level);
        }

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Проверка достижений по уровню
        await CheckAndAwardAchievementsAsync(userId);

        return profile;
    }

    public async Task UpdateStreaksAsync(Guid userId)
    {
        var profile = await _context.GamificationProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            throw new KeyNotFoundException("Gamification profile not found");
        }

        // Получаем все привычки пользователя
        var habits = await _context.Habits
            .Where(h => h.UserId == userId)
            .ToListAsync();

        // Для вредных привычек считаем дни без срыва
        var badHabits = habits.Where(h => h.IsBad).ToList();
        int minStreak = int.MaxValue;

        if (badHabits.Any())
        {
            foreach (var habit in badHabits)
            {
                var daysSinceRelapse = habit.LastRelapseDate.HasValue
                    ? (DateTime.UtcNow.Date - habit.LastRelapseDate.Value.Date).Days
                    : int.MaxValue; // Если срывов не было, считаем с момента создания

                var daysSinceCreated = (DateTime.UtcNow.Date - habit.CreatedAt.Date).Days;
                var streak = Math.Min(daysSinceRelapse, daysSinceCreated);

                if (streak < minStreak)
                    minStreak = streak;
            }
        }

        // Для полезных привычек считаем по выполнениям
        var goodHabits = habits.Where(h => !h.IsBad).ToList();
        int goodHabitStreak = 0;

        if (goodHabits.Any())
        {
            var lastCompletion = await _context.HabitCompletions
                .Where(hc => goodHabits.Select(h => h.Id).Contains(hc.HabitId))
                .OrderByDescending(hc => hc.CompletionDate)
                .FirstOrDefaultAsync();

            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            if (lastCompletion?.CompletionDate == yesterday || lastCompletion?.CompletionDate == today)
            {
                // Простой подсчёт: сколько дней подряд было хотя бы одно выполнение
                goodHabitStreak = await CalculateGoodHabitStreak(userId, goodHabits);
            }
        }

        // Выбираем минимальную серию из вредных и полезных
        if (badHabits.Any() && goodHabits.Any())
        {
            profile.CurrentStreak = Math.Min(minStreak == int.MaxValue ? 0 : minStreak, goodHabitStreak);
        }
        else if (badHabits.Any())
        {
            profile.CurrentStreak = minStreak == int.MaxValue ? 0 : minStreak;
        }
        else
        {
            profile.CurrentStreak = goodHabitStreak;
        }

        if (profile.CurrentStreak > profile.LongestStreak)
            profile.LongestStreak = profile.CurrentStreak;

        // Обновление общего количества выполнений
        profile.TotalCompletions = await _context.HabitCompletions
            .Where(hc => hc.Habit.UserId == userId)
            .CountAsync();

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private async Task<int> CalculateGoodHabitStreak(Guid userId, List<Habit> goodHabits)
    {
        var today = DateTime.UtcNow.Date;
        int streak = 0;

        for (int i = 0; i < 365; i++)
        {
            var date = today.AddDays(-i);
            var hasCompletion = await _context.HabitCompletions
                .AnyAsync(hc => goodHabits.Select(h => h.Id).Contains(hc.HabitId) && hc.CompletionDate == date);

            if (hasCompletion || i == 0) // Сегодня ещё может не быть выполнений
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

    public async Task<List<AchievementDto>> GetAchievementsAsync(Guid userId)
    {
        var allAchievements = await _context.Achievements.ToListAsync();
        var userAchievements = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .ToListAsync();

        return allAchievements.Select(a => new AchievementDto
        {
            Id = a.Id,
            Name = a.Name,
            Description = a.Description,
            Icon = a.Icon,
            IsEarned = userAchievements.Any(ua => ua.AchievementId == a.Id),
            EarnedAt = userAchievements
                .FirstOrDefault(ua => ua.AchievementId == a.Id)?.EarnedAt
        }).ToList();
    }

    public async Task CheckAndAwardAchievementsAsync(Guid userId)
    {
        var profile = await _context.GamificationProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            throw new KeyNotFoundException("Gamification profile not found");
        }

        var userAchievementIds = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        var allAchievements = await _context.Achievements.ToListAsync();

        foreach (var achievement in allAchievements)
        {
            if (userAchievementIds.Contains(achievement.Id))
                continue;

            bool earned = achievement.RequiredType switch
            {
                "completions" => profile.TotalCompletions >= achievement.RequiredValue,
                "streak" => profile.LongestStreak >= achievement.RequiredValue,
                "level" => profile.Level >= achievement.RequiredValue,
                _ => false
            };

            if (earned)
            {
                var userAchievement = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.Id
                };
                _context.UserAchievements.Add(userAchievement);

                // Начисление XP за достижение
                if (achievement.XpReward > 0)
                {
                    profile.ExperiencePoints += achievement.XpReward;
                }
            }
        }

        await _context.SaveChangesAsync();
    }

    private static int GetXpForNextLevel(int level) => 100 * level; // 100, 200, 300...
}
