import { create } from 'zustand';
import { GamificationProfile, Achievement } from '../types';
import { gamificationApi } from '../api/gamificationApi';

interface GamificationState {
  profile: GamificationProfile | null;
  achievements: Achievement[];
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  profile: null,
  achievements: [],
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await gamificationApi.getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  fetchAchievements: async () => {
    try {
      const achievements = await gamificationApi.getAchievements();
      set({ achievements });
    } catch (error) {
      console.error(error);
    }
  },
}));
