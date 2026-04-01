import { create } from 'zustand';
import { Habit, CreateHabitDto, UpdateHabitDto } from '../types';
import { habitsApi } from '../api/habitsApi';
import { useGamificationStore } from './gamificationStore';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  createHabit: (data: CreateHabitDto) => Promise<void>;
  updateHabit: (id: string, data: UpdateHabitDto) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleComplete: (habitId: string, completed: boolean) => Promise<void>;
  recordRelapse: (habitId: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await habitsApi.getAll();
      set({ habits, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch habits', isLoading: false });
      console.error(error);
    }
  },

  createHabit: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await habitsApi.create(data);
      await get().fetchHabits();
    } catch (error) {
      set({ error: 'Failed to create habit', isLoading: false });
      console.error(error);
    }
  },

  updateHabit: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await habitsApi.update(id, data);
      await get().fetchHabits();
    } catch (error) {
      set({ error: 'Failed to update habit', isLoading: false });
      console.error(error);
    }
  },

  deleteHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await habitsApi.delete(id);
      await get().fetchHabits();
    } catch (error) {
      set({ error: 'Failed to delete habit', isLoading: false });
      console.error(error);
    }
  },

  toggleComplete: async (habitId, completed) => {
    try {
      if (completed) {
        await habitsApi.complete(habitId);
      } else {
        await habitsApi.uncomplete(habitId);
      }
      // Обновляем локальное состояние
      await get().fetchHabits();
      // Обновляем геймификацию
      await useGamificationStore.getState().fetchProfile();
      await useGamificationStore.getState().fetchAchievements();
    } catch (error) {
      console.error(error);
    }
  },

  recordRelapse: async (habitId) => {
    try {
      await habitsApi.recordRelapse(habitId);
      await get().fetchHabits();
      await useGamificationStore.getState().fetchProfile();
    } catch (error) {
      console.error(error);
    }
  },
}));
