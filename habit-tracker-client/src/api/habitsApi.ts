import apiClient from './client';
import { Habit, CreateHabitDto, UpdateHabitDto, HabitCompletion } from '../types';

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const response = await apiClient.get('/habits');
    return response.data;
  },

  getById: async (id: string): Promise<Habit> => {
    const response = await apiClient.get(`/habits/${id}`);
    return response.data;
  },

  create: async (data: CreateHabitDto): Promise<Habit> => {
    const response = await apiClient.post('/habits', data);
    return response.data;
  },

  update: async (id: string, data: UpdateHabitDto): Promise<Habit> => {
    const response = await apiClient.put(`/habits/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`);
  },

  complete: async (id: string): Promise<HabitCompletion> => {
    const response = await apiClient.post(`/habits/${id}/complete`);
    return response.data;
  },

  uncomplete: async (id: string, date?: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}/uncomplete`, {
      params: { date },
    });
  },

  recordRelapse: async (id: string, comment?: string): Promise<Habit> => {
    const response = await apiClient.post(`/habits/${id}/relapse`, { comment });
    return response.data;
  },

  getCompletions: async (id: string): Promise<HabitCompletion[]> => {
    const response = await apiClient.get(`/habits/${id}/completions`);
    return response.data;
  },

  getActivityCalendar: async (months: number = 6): Promise<Record<string, number>> => {
    const response = await apiClient.get('/habits/completions/calendar', {
      params: { months },
    });
    return response.data;
  },
};
