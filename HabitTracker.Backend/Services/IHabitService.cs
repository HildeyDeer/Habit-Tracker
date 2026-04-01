using HabitTracker.Backend.Models.DTOs;
using HabitTracker.Backend.Models.Entities;

namespace HabitTracker.Backend.Services;

public interface IHabitService
{
    Task<List<HabitDto>> GetAllHabitsAsync(Guid userId);
    Task<HabitDto> GetHabitByIdAsync(Guid habitId, Guid userId);
    Task<HabitDto> CreateHabitAsync(Guid userId, CreateHabitDto dto);
    Task<HabitDto> UpdateHabitAsync(Guid habitId, Guid userId, UpdateHabitDto dto);
    Task DeleteHabitAsync(Guid habitId, Guid userId);
    Task<HabitCompletion> CompleteHabitAsync(Guid habitId, Guid userId);
    Task UncompleteHabitAsync(Guid habitId, Guid userId, DateTime date);
    Task<List<HabitCompletion>> GetHabitCompletionsAsync(Guid habitId, Guid userId);
    Task<Dictionary<DateTime, int>> GetActivityCalendarAsync(Guid userId, int months = 6);
    Task<HabitDto> RecordRelapseAsync(Guid habitId, Guid userId, string? comment);
}
