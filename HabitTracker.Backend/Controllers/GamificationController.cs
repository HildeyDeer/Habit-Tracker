using System.Security.Claims;
using HabitTracker.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitTracker.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GamificationController : ControllerBase
{
    private readonly IGamificationService _gamificationService;

    public GamificationController(IGamificationService gamificationService)
    {
        _gamificationService = gamificationService;
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
    /// Получить геймификационный профиль пользователя (уровень, XP, стрики)
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        try
        {
            var profile = await _gamificationService.GetProfileAsync(userId);
            return Ok(profile);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Получить достижения пользователя
    /// </summary>
    [HttpGet("achievements")]
    public async Task<IActionResult> GetAchievements()
    {
        var userId = GetUserId();
        var achievements = await _gamificationService.GetAchievementsAsync(userId);
        return Ok(achievements);
    }

    /// <summary>
    /// Проверить и выдать достижения (вручную)
    /// </summary>
    [HttpPost("achievements/check")]
    public async Task<IActionResult> CheckAchievements()
    {
        var userId = GetUserId();
        await _gamificationService.CheckAndAwardAchievementsAsync(userId);
        return NoContent();
    }
}
