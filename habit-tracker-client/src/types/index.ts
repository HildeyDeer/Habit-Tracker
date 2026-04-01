export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  difficulty: number;
  isBad: boolean;
  isCompletedToday: boolean;
  currentStreak: number;
  lastRelapseDate?: string;
}

export interface CreateHabitDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  difficulty?: number;
  isBad?: boolean;
}

export interface UpdateHabitDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  difficulty?: number;
  isBad?: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completionDate: string;
  createdAt: string;
}

export interface GamificationProfile {
  level: number;
  experiencePoints: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isEarned: boolean;
  earnedAt?: string;
}
