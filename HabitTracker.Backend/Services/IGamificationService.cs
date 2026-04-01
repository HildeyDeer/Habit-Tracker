using HabitTracker.Backend.Models.DTOs;
using HabitTracker.Backend.Models.Entities;

namespace HabitTracker.Backend.Services;

public interface IGamificationService
{
    Task CreateProfileAsync(Guid userId);
    Task<GamificationProfileDto> GetProfileAsync(Guid userId);
    Task<GamificationProfile> AddExperienceAsync(Guid userId, int xp);
    Task UpdateStreaksAsync(Guid userId);
    Task<List<AchievementDto>> GetAchievementsAsync(Guid userId);
    Task CheckAndAwardAchievementsAsync(Guid userId);
}
