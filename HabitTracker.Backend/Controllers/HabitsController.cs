using System.Security.Claims;
using HabitTracker.Backend.Models.DTOs;
using HabitTracker.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitTracker.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HabitsController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitsController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found");
        }
        return Guid.Parse(userIdClaim);
    }

    /// <summary>
    /// Получить все привычки пользователя
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var habits = await _habitService.GetAllHabitsAsync(userId);
        return Ok(habits);
    }

    /// <summary>
    /// Получить привычку по ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        try
        {
            var habit = await _habitService.GetHabitByIdAsync(id, userId);
            return Ok(habit);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Создать новую привычку
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHabitDto dto)
    {
        var userId = GetUserId();
        var habit = await _habitService.CreateHabitAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
    }

    /// <summary>
    /// Обновить привычку
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateHabitDto dto)
    {
        var userId = GetUserId();
        try
        {
            var habit = await _habitService.UpdateHabitAsync(id, userId, dto);
            return Ok(habit);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Удалить привычку
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        try
        {
            await _habitService.DeleteHabitAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отметить выполнение привычки за сегодня
    /// </summary>
    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var userId = GetUserId();
        try
        {
            var completion = await _habitService.CompleteHabitAsync(id, userId);
            return Ok(completion);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отменить выполнение привычки за указанную дату
    /// </summary>
    [HttpDelete("{id:guid}/uncomplete")]
    public async Task<IActionResult> Uncomplete(Guid id, [FromQuery] DateTime? date = null)
    {
        var userId = GetUserId();
        try
        {
            var completionDate = date?.Date ?? DateTime.UtcNow.Date;
            await _habitService.UncompleteHabitAsync(id, userId, completionDate);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Получить историю выполнений привычки
    /// </summary>
    [HttpGet("{id:guid}/completions")]
    public async Task<IActionResult> GetCompletions(Guid id)
    {
        var userId = GetUserId();
        try
        {
            var completions = await _habitService.GetHabitCompletionsAsync(id, userId);
            return Ok(completions);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Получить календарь активности (тепловая карта)
    /// </summary>
    [HttpGet("completions/calendar")]
    public async Task<IActionResult> GetActivityCalendar([FromQuery] int months = 6)
    {
        var userId = GetUserId();
        var calendar = await _habitService.GetActivityCalendarAsync(userId, months);
        return Ok(calendar);
    }

    /// <summary>
    /// Записать срыв (для вредных привычек)
    /// </summary>
    [HttpPost("{id:guid}/relapse")]
    public async Task<IActionResult> RecordRelapse(Guid id, [FromBody] RelapseDto? dto = null)
    {
        var userId = GetUserId();
        try
        {
            var habit = await _habitService.RecordRelapseAsync(id, userId, dto?.Comment);
            return Ok(habit);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
