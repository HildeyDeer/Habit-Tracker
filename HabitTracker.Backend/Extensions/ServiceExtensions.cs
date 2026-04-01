using HabitTracker.Backend.Services;

namespace HabitTracker.Backend.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Регистрация сервисов
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IHabitService, HabitService>();
        services.AddScoped<IGamificationService, GamificationService>();

        return services;
    }
}
