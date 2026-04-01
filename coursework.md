# Курсовая работа

**Тема:** «Разработка модуля трекера привычек с элементами геймификации на базе React и ASP.NET Core»

## Введение

В современном мире вопросы саморазвития и формирования полезных привычек становятся все более актуальными. Люди стремятся к повышению личной эффективности, но часто сталкиваются с отсутствием мотивации и системы контроля. Цифровые инструменты, такие как трекеры привычек, помогают решить эту проблему, однако большинство существующих решений либо перегружены функционалом, либо не обеспечивают достаточного уровня вовлеченности пользователя.

**Актуальность работы** заключается в создании легковесного, но функционального модуля трекера привычек с элементами геймификации, который может быть легко интегрирован в существующие экосистемы (веб-приложения, порталы, мобильные приложения). Использование современных технологий (React 19, TypeScript, ASP.NET Core 10) обеспечивает высокую производительность, безопасность и удобство сопровождения.

**Цель работы:** разработать модуль трекера привычек с геймификацией, реализованный в виде независимого SPA-приложения с RESTful API, готового к интеграции в сторонние проекты.

**Задачи:**

1. Провести анализ существующих трекеров привычек и определить ключевые функции.
2. Спроектировать базу данных для хранения информации о привычках, выполнениях, пользователях и элементах геймификации.
3. Разработать RESTful API на ASP.NET Core 10 с поддержкой JWT-аутентификации.
4. Реализовать клиентское приложение на React 19 с TypeScript для взаимодействия с API.
5. Внедрить элементы геймификации (очки опыта, уровни, достижения, стрик-серии).
6. Обеспечить возможность интеграции разработанного модуля в другие проекты (модульная архитектура, четкое API).

---

## 1. Анализ предметной области

### 1.1. Обзор существующих решений

| Название | Преимущества | Недостатки |
|----------|-------------|------------|
| Habitica | Сильная геймификация (RPG-стиль), сообщество | Перегруженность функционалом, сложность для новичков |
| Loop Habit Tracker | Простота, открытый код, статистика | Отсутствие геймификации, только мобильная версия |
| Habitify | Красивый дизайн, аналитика | Платная подписка, нет RPG-элементов |
| Fabulous | Акцент на ритуалы, коучинг | Тяжелый интерфейс, платная модель |

**Вывод:** Существующие решения либо слишком сложны, либо не предоставляют гибких возможностей для интеграции. Актуальна разработка модульного решения с базовыми функциями трекинга и легкой геймификацией.

### 1.2. Ключевые требования к модулю

**Функциональные требования:**

- Регистрация и аутентификация пользователей (JWT).
- Создание, редактирование и удаление привычек.
- Отметка выполнения привычки за текущий день.
- Просмотр календаря активности (тепловая карта).
- Начисление очков опыта (XP) за выполнение.
- Система уровней (каждый новый уровень требует больше XP).
- Стрик-серии (непрерывное выполнение привычки).
- Достижения (ачивки) за определенные действия.
- Лидерборд (таблица лидеров) — опционально.

**Нефункциональные требования:**

- **Модульность:** возможность использования API независимо от фронтенда.
- **Четкая документация API** (Swagger/OpenAPI).
- **Масштабируемость базы данных** (PostgreSQL).
- **Безопасность:** JWT, хеширование паролей (BCrypt).
- **Производительность:** оптимизированные запросы к БД.

---

## 2. Технологический стек

### 2.1. Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 19.2.0 | Библиотека для построения пользовательского интерфейса |
| TypeScript | 5.9.3 | Типизация, повышение надежности кода |
| Vite | 7.2.6 | Сборщик, быстрая разработка |
| React Router DOM | 7.11.0 | Маршрутизация |
| Zustand | 5.0.9 | Управление глобальным состоянием |
| Axios | 1.13.2 | HTTP-клиент для взаимодействия с API |
| Tailwind CSS | - | Утилитарная стилизация |
| Framer Motion | 12.34.3 | Анимации для геймификационных элементов |
| Lucide React | 0.560.0 | Иконки |
| Vitest + Testing Library | 4.1.0 | Тестирование |

### 2.2. Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| ASP.NET Core | 10 | Веб-фреймворк |
| C# | 12+ | Язык программирования |
| PostgreSQL | 10+ | Реляционная база данных |
| Entity Framework Core | 10 | ORM, миграции |
| JWT | - | Аутентификация |
| Swagger/OpenAPI | - | Документация API |

### 2.3. Обоснование выбора

Выбор стека обусловлен необходимостью создания модуля, который:

- Будет легко поддерживаться и расширяться.
- Сможет интегрироваться с различными фронтенд-приложениями (благодаря REST API).
- Обеспечит высокую производительность и безопасность.
- Позволит использовать наработки в дипломном проекте (единый стек технологий).

---

## 3. Проектирование системы

### 3.1. Архитектура

Модуль построен по клиент-серверной архитектуре с четким разделением на:

- **Backend API** — независимый сервис, предоставляющий RESTful эндпоинты.
- **Frontend SPA** — клиентское приложение, взаимодействующее с API.
- **База данных PostgreSQL** — хранение всех данных.

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend SPA (React)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │  Zustand    │ │   React     │ │   Axios         │  │
│  │  (Store)    │ │  Router     │ │   (API Client)  │  │
│  └─────────────┘ └─────────────┘ └─────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│               ASP.NET Core 10 Web API                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Controllers  │  Middleware  │  JWT Auth       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Services (Business Logic)                      │   │
│  │  - HabitService   - GamificationService        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Repository / EF Core                           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL                           │
│     (Users, Habits, HabitCompletions, Achievements)    │
└─────────────────────────────────────────────────────────┘
```

### 3.2. Модель базы данных

```sql
-- Пользователи (может быть расширена при интеграции)
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Username VARCHAR(100) NOT NULL,
    AvatarUrl VARCHAR(500),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Профили геймификации (связаны с пользователями 1:1)
CREATE TABLE GamificationProfiles (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    Level INTEGER DEFAULT 1,
    ExperiencePoints INTEGER DEFAULT 0,
    TotalCompletions INTEGER DEFAULT 0,
    CurrentStreak INTEGER DEFAULT 0,
    LongestStreak INTEGER DEFAULT 0,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Привычки
CREATE TABLE Habits (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    Icon VARCHAR(50),
    Color VARCHAR(7),
    Difficulty INTEGER DEFAULT 1 CHECK (Difficulty BETWEEN 1 AND 3),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Выполнения привычек (логи)
CREATE TABLE HabitCompletions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    HabitId UUID NOT NULL REFERENCES Habits(Id) ON DELETE CASCADE,
    CompletionDate DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(HabitId, CompletionDate) -- одна привычка раз в день
);

-- Достижения
CREATE TABLE Achievements (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Icon VARCHAR(50),
    RequiredType VARCHAR(50), -- completions, streak, level
    RequiredValue INTEGER NOT NULL,
    XpReward INTEGER DEFAULT 0
);

-- Выданные достижения пользователям
CREATE TABLE UserAchievements (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    AchievementId UUID NOT NULL REFERENCES Achievements(Id) ON DELETE CASCADE,
    EarnedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(UserId, AchievementId)
);
```

**ER-диаграмма (основные связи):**

- User (1) → Habit (M)
- User (1) → GamificationProfile (1)
- Habit (1) → HabitCompletion (M)
- Achievement (M) ↔ User (M) через UserAchievements

### 3.3. API Endpoints (REST)

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| POST | `/api/auth/register` | Регистрация | Public |
| POST | `/api/auth/login` | Вход (JWT) | Public |
| POST | `/api/auth/refresh` | Обновление токена | Public |
| GET | `/api/habits` | Получить все привычки пользователя | Private |
| POST | `/api/habits` | Создать привычку | Private |
| PUT | `/api/habits/{id}` | Обновить привычку | Private |
| DELETE | `/api/habits/{id}` | Удалить привычку | Private |
| POST | `/api/habits/{id}/complete` | Отметить выполнение | Private |
| DELETE | `/api/habits/{id}/uncomplete` | Отменить выполнение | Private |
| GET | `/api/habits/completions/calendar` | Получить календарь активности | Private |
| GET | `/api/gamification/profile` | Получить профиль (уровень, XP) | Private |
| GET | `/api/gamification/achievements` | Получить достижения пользователя | Private |
| GET | `/api/gamification/leaderboard` | Таблица лидеров (опционально) | Private |

### 3.4. Модели данных (C#)

```csharp
// Основные DTO для API
public class HabitDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
    public string Color { get; set; }
    public int Difficulty { get; set; } // 1-3
    public bool IsCompletedToday { get; set; }
}

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
    public string Name { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
    public bool IsEarned { get; set; }
    public DateTime? EarnedAt { get; set; }
}
```

---

## 4. Реализация серверной части (Backend)

### 4.1. Структура проекта

```
HabitTracker.Backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── HabitsController.cs
│   └── GamificationController.cs
├── Models/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Habit.cs
│   │   ├── HabitCompletion.cs
│   │   ├── GamificationProfile.cs
│   │   └── Achievement.cs
│   └── DTOs/
├── Services/
│   ├── IAuthService.cs / AuthService.cs
│   ├── IHabitService.cs / HabitService.cs
│   └── IGamificationService.cs / GamificationService.cs
├── Data/
│   ├── AppDbContext.cs
│   └── Migrations/
├── Middleware/
│   └── JwtMiddleware.cs
├── Extensions/
│   └── ServiceExtensions.cs
└── Program.cs
```

### 4.2. Ключевые реализации

**JWT-аутентификация (Program.cs):**

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

**Геймификационный сервис (логика начисления XP):**

```csharp
public async Task<GamificationProfile> AddExperienceAsync(Guid userId, int xp)
{
    var profile = await _context.GamificationProfiles
        .FirstOrDefaultAsync(p => p.UserId == userId);
    
    profile.ExperiencePoints += xp;
    
    // Проверка повышения уровня
    int xpNeeded = GetXpForNextLevel(profile.Level);
    while (profile.ExperiencePoints >= xpNeeded)
    {
        profile.Level++;
        profile.ExperiencePoints -= xpNeeded;
        xpNeeded = GetXpForNextLevel(profile.Level);
    }
    
    await _context.SaveChangesAsync();
    return profile;
}

private int GetXpForNextLevel(int level) => 100 * level; // 100, 200, 300...
```

**Выполнение привычки с проверкой стрика:**

```csharp
public async Task<HabitCompletion> CompleteHabitAsync(Guid habitId, Guid userId)
{
    var habit = await _context.Habits.FindAsync(habitId);
    if (habit.UserId != userId) throw new UnauthorizedAccessException();
    
    // Проверка, не выполнена ли уже сегодня
    var today = DateTime.UtcNow.Date;
    var existing = await _context.HabitCompletions
        .FirstOrDefaultAsync(hc => hc.HabitId == habitId && hc.CompletionDate == today);
    if (existing != null) throw new InvalidOperationException("Already completed today");
    
    // Создание записи
    var completion = new HabitCompletion
    {
        HabitId = habitId,
        CompletionDate = today
    };
    _context.HabitCompletions.Add(completion);
    
    // Обновление геймификации
    var xpReward = habit.Difficulty * 10; // 10, 20, 30 XP
    await _gamificationService.AddExperienceAsync(userId, xpReward);
    
    // Обновление стриков
    await _gamificationService.UpdateStreaksAsync(userId);
    
    await _context.SaveChangesAsync();
    return completion;
}
```

---

## 5. Реализация клиентской части (Frontend)

### 5.1. Структура проекта

```
habit-tracker-client/
├── src/
│   ├── components/
│   │   ├── habits/
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitCalendar.tsx
│   │   ├── gamification/
│   │   │   ├── LevelProgress.tsx
│   │   │   ├── StreakDisplay.tsx
│   │   │   └── AchievementsList.tsx
│   │   └── ui/ (общие компоненты)
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── habitsStore.ts
│   │   └── gamificationStore.ts
│   ├── api/
│   │   ├── client.ts (axios instance)
│   │   ├── authApi.ts
│   │   ├── habitsApi.ts
│   │   └── gamificationApi.ts
│   ├── types/
│   │   └── index.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ProfilePage.tsx
│   └── App.tsx
```

### 5.2. Zustand Store (пример)

```typescript
// stores/habitsStore.ts
import { create } from 'zustand';
import { habitsApi } from '../api/habitsApi';
import { Habit } from '../types';

interface HabitsStore {
  habits: Habit[];
  isLoading: boolean;
  fetchHabits: () => Promise<void>;
  createHabit: (data: Partial<Habit>) => Promise<void>;
  toggleComplete: (habitId: string, completed: boolean) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  isLoading: false,
  
  fetchHabits: async () => {
    set({ isLoading: true });
    try {
      const habits = await habitsApi.getAll();
      set({ habits, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },
  
  toggleComplete: async (habitId, completed) => {
    if (completed) {
      await habitsApi.complete(habitId);
    } else {
      await habitsApi.uncomplete(habitId);
    }
    // Обновляем локальное состояние
    await get().fetchHabits();
    // Обновляем геймификацию
    await useGamificationStore.getState().fetchProfile();
  },
  
  // ... остальные методы
}));
```

### 5.3. Axios с перехватчиками JWT

```typescript
// api/client.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Интерцептор для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обновления токена
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        localStorage.setItem('accessToken', response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.4. Компонент LevelProgress (с анимацией)

```tsx
// components/gamification/LevelProgress.tsx
import { motion } from 'framer-motion';
import { useGamificationStore } from '../../stores/gamificationStore';

export const LevelProgress = () => {
  const { profile } = useGamificationStore();
  const progressPercent = (profile.xp / profile.xpToNextLevel) * 100;
  
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold">Level {profile.level}</span>
        <span className="text-white text-sm">
          {profile.xp} / {profile.xpToNextLevel} XP
        </span>
      </div>
      <div className="h-3 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
```

---

## 6. Геймификация: механики и реализация

### 6.1. Система уровней и XP

| Уровень | Требуемый XP | Кумулятивный XP |
|---------|--------------|-----------------|
| 1 | 0 | 0 |
| 2 | 100 | 100 |
| 3 | 200 | 300 |
| 4 | 300 | 600 |
| 5 | 400 | 1000 |

**Формула XP для уровня N:** `XP_Needed = 100 * N`

### 6.2. Стрик-серии

- **Текущая серия:** количество дней подряд с выполнением хотя бы одной привычки.
- **Максимальная серия:** рекордное значение.
- **Сброс серии:** если пользователь пропустил день.

```csharp
public async Task UpdateStreaksAsync(Guid userId)
{
    var profile = await _context.GamificationProfiles
        .FirstAsync(p => p.UserId == userId);
    
    var lastCompletion = await _context.HabitCompletions
        .Where(hc => hc.Habit.UserId == userId)
        .OrderByDescending(hc => hc.CompletionDate)
        .FirstOrDefaultAsync();
    
    var today = DateTime.UtcNow.Date;
    var yesterday = today.AddDays(-1);
    
    if (lastCompletion?.CompletionDate == yesterday)
    {
        profile.CurrentStreak++;
        if (profile.CurrentStreak > profile.LongestStreak)
            profile.LongestStreak = profile.CurrentStreak;
    }
    else if (lastCompletion?.CompletionDate != today)
    {
        profile.CurrentStreak = 0;
    }
    
    await _context.SaveChangesAsync();
}
```

### 6.3. Достижения (ачивки)

**Примеры достижений:**

| Достижение | Условие | Награда (XP) |
|------------|---------|--------------|
| Первый шаг | Выполнить 1 привычку | 10 XP |
| Старожил | 7-дневная серия | 50 XP |
| Мастер привычек | Выполнить 30 привычек | 100 XP |
| Неутомимый | 30-дневная серия | 200 XP |
| Уровень 5 | Достичь 5-го уровня | 0 XP |

---

## 7. Интеграция в другие проекты

### 7.1. Использование API независимо

Разработанный модуль предоставляет чистое REST API, которое может быть использовано:

- Другими фронтенд-приложениями (React, Vue, Angular, мобильные приложения).
- В качестве микросервиса в составе более крупной системы.

**Пример интеграции в другой проект:**

```javascript
// Любое приложение может обращаться к API
const response = await fetch('https://api.example.com/api/habits', {
  headers: {
    'Authorization': `Bearer ${userToken}`
  }
});
```

### 7.2. Совместное использование базы данных

Модуль использует отдельную схему (`habit_tracker`) в PostgreSQL, что позволяет:

- Не конфликтовать с существующими таблицами.
- Легко мигрировать данные при необходимости.

### 7.3. Расширение моделей

При интеграции с другим бэкендом можно:

- Добавить внешние ключи к существующей таблице пользователей.
- Использовать систему Identity для объединения аутентификации.

---

## 8. Тестирование

### 8.1. Юнит-тесты (Vitest + React Testing Library)

```typescript
// stores/__tests__/habitsStore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useHabitsStore } from '../habitsStore';

describe('habitsStore', () => {
  it('should fetch habits', async () => {
    const store = useHabitsStore.getState();
    await store.fetchHabits();
    expect(store.habits).toBeDefined();
  });
});
```

### 8.2. Тестирование API (xUnit)

```csharp
[Fact]
public async Task CompleteHabit_ShouldAddXP_WhenValid()
{
    // Arrange
    var userId = Guid.NewGuid();
    var habit = new Habit { Id = Guid.NewGuid(), UserId = userId, Difficulty = 2 };
    _context.Habits.Add(habit);
    await _context.SaveChangesAsync();
    
    // Act
    await _habitService.CompleteHabitAsync(habit.Id, userId);
    
    // Assert
    var profile = await _context.GamificationProfiles.FirstAsync(p => p.UserId == userId);
    Assert.Equal(20, profile.ExperiencePoints); // Difficulty 2 = 20 XP
}
```

---

## 9. Заключение

### 9.1. Достигнутые результаты

В ходе выполнения курсовой работы был разработан модуль трекера привычек с геймификацией, включающий:

- RESTful API на ASP.NET Core 10 с JWT-аутентификацией.
- SPA-клиент на React 19 с TypeScript.
- Базу данных PostgreSQL с оптимизированной структурой.
- Элементы геймификации:
  - Система уровней и очков опыта (XP).
  - Стрик-серии (текущая и максимальная).
  - Достижения (ачивки).
- Модульную архитектуру, позволяющую интегрировать разработанные компоненты в другие проекты.

### 9.2. Перспективы развития

- Добавление социальных элементов (друзья, общие челленджи).
- Уведомления (push, email) о необходимости выполнения привычек.
- Расширенная аналитика (графики прогресса, экспорт данных).
- PWA-версия для использования на мобильных устройствах.
- WebSockets (SignalR) для обновлений в реальном времени.

### 9.3. Практическая значимость

Разработанный модуль может быть использован:

- Как самостоятельный сервис для личного использования.
- В составе более крупных веб-приложений (порталы здоровья, образовательные платформы).
- Как основа для коммерческого продукта.

---

## Список литературы

1. React Documentation – https://react.dev/
2. TypeScript Handbook – https://www.typescriptlang.org/docs/
3. ASP.NET Core Documentation – https://learn.microsoft.com/en-us/aspnet/core/
4. Entity Framework Core – https://learn.microsoft.com/en-us/ef/core/
5. Zustand Documentation – https://docs.pmnd.rs/zustand/
6. Framer Motion – https://www.framer.com/motion/
7. Tailwind CSS – https://tailwindcss.com/docs/
8. Habitica Gamification Mechanics – https://habitica.fandom.com/wiki/Gamification
9. Designing Habit-Forming Products – Nir Eyal, "Hooked"

---

## Приложения

### Приложение А. Скриншоты интерфейса

(Здесь размещаются скриншоты основных экранов: дашборд, список привычек, календарь активности, профиль с достижениями)

### Приложение Б. Листинги кода

(Ключевые фрагменты кода: модель базы данных, сервис геймификации, Zustand store, компонент прогресса)

### Приложение В. Документация API (Swagger)

(Сгенерированная документация Swagger/OpenAPI)
